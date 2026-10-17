import math

import numpy as np
import pytest

from compsuite.examples import sour_reinjection
from compsuite.mechanical.thrust import coupling_friction_thrust, impeller_thrust
from compsuite.structural import impeller3d as I
from compsuite.testing import shoptest as T

IMP = {"D2_mm": 352, "D1_eye_mm": 281, "hub_mm": 181, "b2_mm": 26, "blades": 17, "backsweep_deg": 40, "index": 0}


@pytest.fixture(scope="module")
def sector():
    return I.Sector(I.build_mesh(IMP, 0.145, 1), 2e11, 0.3, 7850, 12e-6)


def test_patch_tests(sector):
    f, eps0 = sector.f_thermal(np.full(sector.n, 100.0))
    S = sector.stresses(sector.solve(f), eps0=eps0)
    assert I.von_mises(S).max() < 1e-3                      # free uniform expansion: no stress
    rot = np.zeros(sector.ndof)
    rot[0::3], rot[1::3] = -sector.nodes[:, 1], sector.nodes[:, 0]
    assert np.abs(sector.K0 @ rot).max() < 1e-3 * sector.K0.diagonal().max()   # rigid rotation: no force


def test_centrifugal_matches_axisymmetric_model(sector):
    from compsuite.structural import impeller_fea as A
    w = 1500.0
    u = sector.solve(sector.f_centrifugal(w)).reshape(-1, 3)
    X = sector.nodes
    th = np.arctan2(X[:, 1], X[:, 0])
    tip3d = (u[:, 0] * np.cos(th) + u[:, 1] * np.sin(th)).max()
    m = A.mesh(IMP)
    tip2d = A.solve(m, 2e11, 0.3, 7850, w, 0.0, None, 17)["u"][:, 0].max()
    assert 0.8 < tip3d / tip2d < 1.4        # discrete blades vs smeared blades


def test_handbook_thrust_examples():
    assert abs(5 * impeller_thrust(6 * 98066.5, 0.27, 0.17) / 9.80665 - 10370) < 10
    lo, hi = coupling_friction_thrust(716 * 9.80665, 0.2)
    assert abs(lo / 9.80665 - 1074) < 1 and abs(hi / 9.80665 - 2148) < 1


def test_balancing_and_running_limits():
    a = T.allowable_unbalance(200, 10000)
    assert abs(a["api617_g_mm"] - 127.0) < 1e-6 and abs(a["handbook_g_mm"] - 127.0) < 0.1
    assert abs(T.vibration_limit_um(12000) - 25.4) < 1e-9 and T.vibration_limit_um(15000) < 25.4
    ang = [0, 60, 120, 180, 240, 300]
    U0, h, Ut = 50 * np.exp(1j * np.radians(75)), 0.01, 150
    amp = [abs(h * (U0 + Ut * np.exp(1j * np.radians(x)))) for x in ang]
    r = T.residual_unbalance_check(ang, amp, Ut, 100)
    assert abs(r["residual_g_mm"] - 50) < 1e-6 and abs(r["residual_angle_deg"] - 75) < 1e-6 and r["status"] == "pass"


def test_influence_balance_cancels_vibration():
    A = np.array([[0.02 * np.exp(0.3j), 0.01 * np.exp(1.1j)], [0.008 * np.exp(-0.5j), 0.025 * np.exp(2.0j)]])
    U = np.array([300 * np.exp(0.7j), 200 * np.exp(-1.2j)])
    V0 = A @ U
    pr = lambda v: [{"probe": f"P{i}", "amp": abs(x), "phase": math.degrees(np.angle(x))} for i, x in enumerate(v)]  # noqa: E731
    trials = []
    for p in range(2):
        W = np.zeros(2, complex); W[p] = 500
        trials.append({"plane": f"Plane {p + 1}", "weight_g_mm": 500, "angle_deg": 0, "readings": pr(V0 + A @ W)})
    r = T.influence_balance(pr(V0), trials)
    assert max(q["amp"] for q in r["predicted"]) < 1e-6
    assert abs(r["corrections"][0]["weight_g_mm"] - 300) < 1e-6


def test_sour_example_geometry_is_physical():
    from compsuite.core.workflow import run_project
    r = run_project(sour_reinjection(), level="fast")
    for c in r["casings"]:
        for imp in c["impellers"]["impellers"]:
            assert imp["D1_eye_mm"] <= 0.75 * imp["D2_mm"] + 1e-6 and imp["hub_mm"] < imp["D1_eye_mm"]


def test_full_3d_analysis_coarse():
    from compsuite.core.model import Project
    from compsuite.core.workflow import run_project
    r = run_project(Project(), level="fast")
    c = r["casings"][0]
    res = I.analyse(c["impellers"]["impellers"][0], r["sizing"]["stages"][0], c["_imp_mat"], c["lateral"]["speeds"],
                    {"level": 1, "convergence": False, "max_nd": 3, "bore_mm": c["rotor"]["shaft_diameter_impellers_m"] * 1e3})
    s = res["summary"]
    assert abs(s["lift_off_ratio"] - 1.2) < 1e-6
    assert 100 < s["peak_vm_mcs_mpa"] < 2000 and s["burst_margin"] > 1
    assert all(m["f_mcs_hz"] >= m["f0_hz"] * 0.98 for m in res["modes"])      # stress stiffening does not lower much
    assert "<VTKFile" in I.to_vtu(res, full=False) and "*DLOAD" in I.to_calculix(res, c["_imp_mat"], 10000)
