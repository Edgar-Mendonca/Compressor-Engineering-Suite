"""Validation of rotordynamics, bearings, structural, torsional, seals and piping models."""

import math
import shutil

import numpy as np
import pytest

from compsuite.bearings.journal import JournalBearing, ocvirk_load
from compsuite.mechanical.shaft import KT_BEND, kt_shoulder, marin_endurance
from compsuite.piping.flow import colebrook, control_valve_cv, isothermal_pressure_drop, orifice_iso5167
from compsuite.rotordynamics import fe
from compsuite.rotordynamics.lateral import required_separation
from compsuite.seals.seals import labyrinth_leakage, wachel_cross_coupling
from compsuite.structural.disk import rotating_disk
from compsuite.torsional.train import Shaft, Station, Train, natural_frequencies

E, G, RHO = 2.07e11, 7.96e10, 7850.0
STIFF = fe.constant_support(kxx=1e13, kyy=1e13)


def ss_beam(L=1.5, D=0.05):
    return fe.RotorModel([fe.Section(0, L, D)], [], [fe.Support("A", 0, STIFF), fe.Support("B", L, STIFF)], E, G, RHO)


def test_simply_supported_beam_first_frequency():
    L, D = 1.5, 0.05
    m = ss_beam(L, D)
    I, A = math.pi * D**4 / 64, math.pi * D**2 / 4
    f_eb = (math.pi**2 / L**2) * math.sqrt(E * I / (RHO * A)) / (2 * math.pi)
    f = fe.modal(m, 0.0, 2)["modes"][0]["freq_hz"]
    assert abs(f - f_eb) / f_eb < 0.003  # Timoshenko slightly below Euler-Bernoulli


def test_jeffcott_rotor():
    L, d, md = 1.5, 0.02, 50.0
    m = fe.RotorModel([fe.Section(0, L, d)], [fe.PointMass("disk", L / 2, md, 0, 0)],
                      [fe.Support("A", 0, STIFF), fe.Support("B", L, STIFF)], E, G, RHO)
    I = math.pi * d**4 / 64
    k = 48 * E * I / L**3
    ms = RHO * math.pi * d**2 / 4 * L
    f_ref = math.sqrt(k / (md + 0.486 * ms)) / (2 * math.pi)
    assert abs(fe.modal(m, 0.0, 2)["modes"][0]["freq_hz"] - f_ref) / f_ref < 0.002


def overhung():
    return fe.RotorModel([fe.Section(0, 0.6, 0.05)], [fe.PointMass("disk", 0.6, 20, 0.4, 0.2)],
                         [fe.Support("A", 0, STIFF), fe.Support("B", 0.3, STIFF)], E, G, RHO)


def test_gyroscopic_forward_stiffening_backward_softening():
    m = overhung()
    f0 = fe.modal(m, 0.0, 2)["modes"]
    f1 = fe.modal(m, 10000 * math.pi / 30, 2)["modes"]
    fw = next(x for x in f1 if x["whirl"] == "forward")
    bw = next(x for x in f1 if x["whirl"] == "backward")
    assert fw["freq_hz"] > f0[0]["freq_hz"] * 1.2
    assert bw["freq_hz"] < f0[0]["freq_hz"] * 0.8


def damped_rotor():
    brg = fe.constant_support(kxx=5e7, kyy=5e7, cxx=2e4, cyy=2e4)
    return fe.RotorModel([fe.Section(0, 1.2, 0.08)], [fe.PointMass("disk", 0.6, 100, 1.0, 0.5)],
                         [fe.Support("A", 0, brg), fe.Support("B", 1.2, brg)], E, G, RHO)


def test_cross_coupling_destabilises_forward_mode():
    m = damped_rotor()
    q = 2e6
    ex = [fe.Support("Q", 0.6, fe.constant_support(kxy=q, kyx=-q), "seal")]
    modes = fe.modal(m, 1000.0, 4, ex)["modes"]
    fw = next(x for x in modes if x["whirl"] == "forward")
    bw = next(x for x in modes if x["whirl"] == "backward")
    assert fw["logdec"] < 0 < bw["logdec"]


def test_amplification_factor_matches_modal_damping():
    m = damped_rotor()
    sp = np.linspace(2600, 2900, 601) * math.pi / 30
    u = fe.unbalance_response(m, sp, [{"z": 0.6, "me": 1e-4}], [0.6])
    pk = fe.find_peaks_af(u["speeds_rpm"], u["probes"]["0.6000"]["major_um"])[0]
    zeta = fe.modal(m, pk["speed_rpm"] * math.pi / 30, 2)["modes"][0]["damping_ratio"]
    assert abs(pk["af"] - 1 / (2 * zeta)) / pk["af"] < 0.02


def test_unbalance_static_limit():
    """Far below the critical, response ~ me w^2 / k_static."""
    m = damped_rotor()
    w = 30.0
    u = fe.unbalance_response(m, np.array([w]), [{"z": 0.6, "me": 1e-3}], [0.6])
    k_static = 1.0 / (np.abs(fe.static_deflection(m)["y_m"][m.node_at(0.6)]) / (m.gravity_load()[2::4].sum() * -1))
    approx = 1e-3 * w**2 / k_static * 1e6
    assert abs(u["probes"]["0.6000"]["major_um"][0] - approx) / approx < 0.3


def test_modal_reduction_accuracy():
    m = damped_rotor()
    w = 1500.0
    full = fe.modal(m, w, 4)["modes"]
    red = fe.modal(m, w, 4, basis=m.reduction_basis(w, 20))["modes"]
    for a, b in zip(full, red):
        assert abs(a["freq_hz"] - b["freq_hz"]) / a["freq_hz"] < 0.005


@pytest.mark.skipif(shutil.which("ccx") is None, reason="CalculiX not installed")
def test_rotor_fe_matches_calculix(tmp_path):
    from compsuite.structural.calculix import rotor_beam_deck, run_calculix
    k = 5e7
    brg = fe.constant_support(kxx=k, kyy=k)
    m = fe.RotorModel([fe.Section(0, 0.3, 0.06), fe.Section(0.3, 0.9, 0.08, 0.02), fe.Section(0.9, 1.2, 0.06)],
                      [fe.PointMass("disk", 0.6, 100, 0, 0), fe.PointMass("d2", 1.15, 20, 0, 0)],
                      [fe.Support("A", 0.1, brg), fe.Support("B", 1.0, brg)], E, G, RHO)
    ours = [x["freq_hz"] for x in fe.modal(m, 0.0, 6)["modes"]][::2]
    ccx = run_calculix(rotor_beam_deck(m, k), tmp_path)["frequencies_hz"][::2]
    for a, b in zip(ours[:3], ccx[:3]):
        assert abs(a - b) / b < 0.01


def test_api617_separation_formula():
    assert required_separation(2.0, True) is None
    assert math.isclose(required_separation(5.0, False), 10 + 17 * (1 - 1 / 3.5))
    assert required_separation(100.0, True) == 16.0
    assert required_separation(float("inf"), False) == 26.0


def test_plain_bearing_matches_ocvirk():
    D, L, c, mu, w = 0.1, 0.05, 1e-4, 0.02, 1000.0
    b = JournalBearing(D, L, c, kind="plain_cylindrical", n_theta=721)
    for ecc in (0.3, 0.6):
        co = b.coefficients(ocvirk_load(mu, w, D / 2, L, c, ecc), mu, w)
        assert abs(co["eccentricity"] - ecc) < 1e-3
        att = math.degrees(math.atan(math.pi * math.sqrt(1 - ecc**2) / (4 * ecc)))
        assert abs(co["attitude_deg"] - att) < 0.1
        # Closed-form short-bearing direct stiffness (dimensionless, load-direction terms)
        h0 = 1 / (math.pi**2 * (1 - ecc**2) + 16 * ecc**2) ** 1.5
        W = ocvirk_load(mu, w, D / 2, L, c, ecc)
        k_a = 4 * (math.pi**2 * (2 - ecc**2) + 16 * ecc**2) * h0
        assert abs(co["kxx"] * c / W - k_a) / k_a < 0.01
        assert co["kxy"] - co["kyx"] > 0  # destabilising cross-coupling of a plain bearing


def test_tilting_pad_has_no_cross_coupling():
    b = JournalBearing(0.1, 0.05, 1e-4, kind="tilting_pad")
    co = b.coefficients(5000.0, 0.02, 1000.0)
    assert abs(co["kxy"]) < 1e-6 * co["kxx"] and abs(co["kyx"]) < 1e-6 * co["kyy"]
    assert abs(co["attitude_deg"]) < 1e-3
    assert co["kxx"] > 0 and co["cyy"] > 0


def test_rotating_disk_bore_stress():
    nu, w, ri, ro = 0.3, 1500.0, 0.05, 0.25
    r = np.linspace(ri, ro, 200)
    res = rotating_disk(r, np.full_like(r, 0.02), 2e11, nu, 7800, w)
    ref = (3 + nu) / 4 * 7800 * w**2 * (ro**2 + (1 - nu) / (3 + nu) * ri**2)
    assert abs(res["sigma_t_pa"][0] - ref) / ref < 0.002
    assert abs(res["sigma_r_pa"][0]) < 0.002 * ref and abs(res["sigma_r_pa"][-1]) < 0.002 * ref


def test_two_inertia_torsional_and_gear_referral():
    J1, J2, k = 10.0, 2.0, 1e6
    f_ref = math.sqrt(k * (J1 + J2) / (J1 * J2)) / (2 * math.pi)
    t = Train([Station("a", J1), Station("b", J2)], [Shaft("s", k)])
    assert math.isclose(natural_frequencies(t)["modes"][0]["freq_hz"], f_ref, rel_tol=1e-9)
    # Same physical system with the driver side at half speed: J and k scale with n^2.
    n = 0.5
    t2 = Train([Station("a", J1 / n**2, n), Station("b", J2)], [Shaft("s", k / n**2, n)])
    assert math.isclose(natural_frequencies(t2)["modes"][0]["freq_hz"], f_ref, rel_tol=1e-9)


def test_peterson_kt_and_marin():
    kt = kt_shoulder(1.5, 1.0, 0.05, KT_BEND)
    assert 1.9 < kt < 2.2  # Peterson chart: D/d = 1.5, r/d = 0.05 -> about 2.0
    assert kt_shoulder(1.0, 1.0, 0.05, KT_BEND) == 1.0
    en = marin_endurance({"uts_mpa": 860, "endurance_mpa": 430}, 0.15, "machined", 0.99)
    assert math.isclose(en["ka"], 4.51 * 860**-0.265) and math.isclose(en["kb"], 1.51 * 150**-0.157)


def test_labyrinth_and_wachel():
    base = labyrinth_leakage(50e5, 30e5, 350, 18, 0.9, 0.2, 2e-4, 8, 4e-3)
    more_teeth = labyrinth_leakage(50e5, 30e5, 350, 18, 0.9, 0.2, 2e-4, 16, 4e-3)
    wider = labyrinth_leakage(50e5, 30e5, 350, 18, 0.9, 0.2, 4e-4, 8, 4e-3)
    assert more_teeth["mass_flow_kg_s"] < base["mass_flow_kg_s"] < wider["mass_flow_kg_s"]
    # Wachel: q = Bc T / (D h) * density ratio
    q = wachel_cross_coupling(1e6, 1000.0, 0.5, 0.02, 1.2, 1.0)
    assert math.isclose(q, 3 * 1000.0 / (0.5 * 0.02) * 1.2)


def test_piping_correlations():
    assert abs(colebrook(1e5, 1e-4) - 0.0185) < 0.0005  # Moody chart
    assert math.isclose(colebrook(1000, 1e-4), 0.064)
    dp = isothermal_pressure_drop(30e5, 20.0, 0.3, 100.0, 5.0, 300.0, 0.92, 18.0, 1.1e-5, 4.5e-5)
    assert 0 < dp["dp_pa"] < 1e5
    v = control_valve_cv(36000, 50, 20, 40.0, 1.3, 0.7)  # x = 0.6 < F_gamma x_T = 0.65
    assert not v["choked"] and v["cv"] > 0
    vc = control_valve_cv(36000, 50, 10, 40.0, 1.3, 0.7)  # x = 0.8: choked, flow limited by x_T
    assert vc["choked"] and math.isclose(vc["Y"], 2 / 3)
    o = orifice_iso5167(5.0, 0.3, 0.6, 25.0, 1.1e-5, 1.3, 30e5)
    assert 0.59 < o["C"] < 0.62 and 0.98 < o["expansibility"] <= 1.0
