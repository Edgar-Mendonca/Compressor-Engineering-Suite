"""API 617 / 684 / 671 torsional report: model, formulas and a coarse train run."""

import math

import numpy as np
import pytest

from compsuite.torsional import api617 as A

MAT = {"shear_modulus_pa": 80e9, "density_kg_m3": 7850, "yield_mpa": 600, "uts_mpa": 800, "endurance_mpa": 400}


def _two_rotor(J1=10.0, J2=2.0, k=1e6, gear=None):
    """Two single-station rotors joined by a coupling (or, with gear=(n, k_lin, r_p), by a gear mesh)."""
    def rotor(name, J, ratio, line, dirn=1, mesh=False):
        return A.RotorPart(name, [], ratio, line, MAT, dirn, end_ip=J)
    if gear is None:
        return A.build([rotor("a", J1, 1.0, 1), A.CouplingPart("c", 0.0, k, 1.0, 1, 1e5, 1e4), rotor("b", J2, 1.0, 1)])
    n, k_lin, r_p = gear
    return A.build([rotor("a", J1, 1 / n, 1, -1, True), rotor("b", J2, 1.0, 2, 1, True)], [A.MeshPart("m", k_lin, r_p * n, r_p, "a", "b")])


def test_two_inertia_frequency_and_low_frequency_shaft_torque():
    J1, J2, k = 10.0, 2.0, 1e6
    train, meta = _two_rotor(J1, J2, k)
    md = A.modes(train, meta, 3)
    f = math.sqrt(k * (J1 + J2) / (J1 * J2)) / (2 * math.pi)
    assert md["modes"][0]["freq_hz"] == pytest.approx(f, rel=1e-3)
    # Quasi-static torque T at rotor a: the coupling carries T J2 / (J1 + J2).
    T = A.harmonic(md, A.force_vector(train, [0], 100.0), 0.01 * 2 * math.pi * f, 0.01)
    assert abs(T[meta["rotors"]["c"]["elements"][0]]) == pytest.approx(100 * J2 / (J1 + J2), rel=1e-3)


def test_gear_mesh_referral_and_opposite_mode_signs():
    n, k_lin, r_p, J1, Jg, Jp, k = 4.0, 2e10, 0.05, 40.0, 8.0, 0.5, 1e6
    train, meta = _two_rotor(J1, Jp, gear=(n, k_lin, r_p))
    md = A.modes(train, meta, 3)
    k_ref = k_lin * r_p**2  # torsional mesh stiffness at pinion speed
    Ja = J1 / n**2
    assert md["modes"][0]["freq_hz"] == pytest.approx(math.sqrt(k_ref * (Ja + Jp) / (Ja * Jp)) / (2 * math.pi), rel=1e-6)
    assert meta["rotors"]["m"]["k_gear_nm_rad"] == pytest.approx(k_lin * (r_p * n) ** 2)
    # Motor - coupling - bull gear = stiff mesh = pinion: in the coupling mode bull gear and pinion move together,
    # so the physical angles have opposite signs and the pinion amplitude is n times the bull gear's.
    rot = lambda name, J, ratio, line, dirn: A.RotorPart(name, [], ratio, line, MAT, dirn, end_ip=J)
    train, meta = A.build([rot("motor", J1, 1 / n, 1, -1), A.CouplingPart("c", 0.0, k, 1 / n, 1, 1e5, 1e4), rot("bull", Jg, 1 / n, 1, -1),
                           rot("pinion", Jp, 1.0, 2, 1)], [A.MeshPart("m", k_lin, r_p * n, r_p, "bull", "pinion")])
    m1 = A.modes(train, meta, 3)["modes"][0]
    Jeq = Jg + Jp * n**2
    assert m1["freq_hz"] == pytest.approx(math.sqrt(k * (J1 + Jeq) / (J1 * Jeq)) / (2 * math.pi), rel=1e-3)
    g, p = m1["shape"][meta["rotors"]["bull"]["first"]], m1["shape"][meta["rotors"]["pinion"]["first"]]
    assert g * p < 0 and abs(p / g) == pytest.approx(n, rel=1e-3)
    assert m1["main"] == ["c"]


def test_separation_margin_and_danger_classification():
    md = {"modes": [{"mode": 1, "freq_cpm": 1800.0, "freq_hz": 30.0, "main": ["x"], "line_strain_energy": {1: 0.6, 2: 0.4}},
                    {"mode": 2, "freq_cpm": 2760.0, "freq_hz": 46.0, "main": ["y"], "line_strain_energy": {1: 0.02, 2: 0.98}}]}
    exc = A.excitation_list({1: ("LS", 2000.0), 2: ("HS", 10000.0)}, True, 50.0)
    tab = A.separation_table(md, exc, 0.70, 1.05, 0.10, 0.10)
    c = {x["excitation"]: x for x in tab[0]["cells"]}
    assert c["1X LS"]["margin_pct"] == pytest.approx(-10.0)
    assert c["1X LS"]["interferes"] and c["1X LS"]["dangerous"]  # 0.9 within [0.63, 1.155]
    assert not c["2X LS"]["interferes"]  # 1800 / 4000 = 0.45 < 0.63
    assert c["1X LS"]["crossing_pct"] == pytest.approx(90.0)
    c2 = {x["excitation"]: x for x in tab[1]["cells"]}
    assert c2["1X line frequency"]["interferes"] and not c2["1X line frequency"]["dangerous"]  # 46 vs 50 Hz, LS line idle


def test_allowables_and_goodman():
    al = A.shear_allowables(MAT)
    assert al["tau_e_mpa"] == pytest.approx(0.577 * 400 * 0.8 * 0.75 / 2.0)
    assert al["transient_mpa"] == pytest.approx(0.7 * 600 / math.sqrt(3))
    assert A.steady_allowable(al, 0.0) == pytest.approx(al["tau_e_mpa"] / 2.0)
    g = A.goodman(1000.0, 100.0, 500.0, 5000.0)
    assert g["sf"] == pytest.approx(2.5)  # 1 / (1000/5000 + 100/500)
    assert g["B"][0] / 5000 + g["B"][1] / 500 == pytest.approx(1.0)  # B lies on the Goodman line


def test_short_circuit_torque_and_step_overshoot():
    t = np.array([0.0, 0.01])
    terms = [{"mk_nm": -2.0, "alpha": 20.0, "omega": 0.0, "phi": math.pi / 2}, {"mk_nm": 3.0, "alpha": 10.0, "omega": 314.0, "phi": 0.0}]
    ref = -2 * math.exp(-0.2) + 3 * math.exp(-0.1) * math.sin(3.14)
    assert A.sc_torque(t, terms)[1] == pytest.approx(ref)
    # Suddenly applied constant torque on a free-free two-inertia system: peak shaft torque 2 T J2 / (J1 + J2).
    J1, J2 = 10.0, 2.0
    train, meta = _two_rotor(J1, J2, 1e6)
    md = A.modes(train, meta, 3)
    _, Te = A.newmark_modal(md, A.force_vector(train, [0], 1.0), lambda tt: 1000.0 * np.ones_like(tt), 0.2, 0.0, 1.0, n_min=1)
    assert np.abs(Te[meta["rotors"]["c"]["elements"][0]]).max() == pytest.approx(2 * 1000 * J2 / (J1 + J2), rel=0.01)


def test_vsd_crossing_speed():
    train, meta = _two_rotor()
    meta["rotors"]["a"]["core"] = [0]
    s = A.Settings(100.0, {1: ("Motor", 1500.0)}, harmonics={5: 2.0, 7: 0.5}, poles=4, sc_cases={})
    res = A.analyse(train, meta, s)
    f1 = res["modes"][0]["freq_hz"]
    x = next(c for c in res["vsd"]["crossings"] if c["order"] == 5 and c["mode"] == 1)
    assert x["speed_pct"] == pytest.approx(100 * f1 / (5 * 1500 * 4 / 120))
    assert [r["order"] for r in res["vsd"]["responses"]] == [5]  # only content above the 1 % steady excitation


@pytest.fixture(scope="module")
def geared_run():
    from compsuite.core.workflow import run_project
    from compsuite.examples import export_gas
    p = export_gas()
    p.train.pinion_teeth, p.train.bull_gear_teeth, p.train.gear_module_mm = 31, 93, 5.0
    p.train.gear_helix_angle_deg, p.train.gear_pressure_angle_deg = 15.0, 20.0
    return run_project(p, level="fast")


def test_geared_vfd_train_report(geared_run):
    t = geared_run["torsional"]
    md = t["model"]
    assert md["geared"] and md["gear"]["ratio"] == pytest.approx(3.0)
    names = [c["name"] for c in md["components"]]
    assert names[:4] == ["Motor", "Coupling Motor-Bull gear", "Bull gear", "Pinion"] and "Gear mesh" in names
    assert len(t["tnf"]) >= 10 and all(a["freq_hz"] < b["freq_hz"] for a, b in zip(t["tnf"], t["tnf"][1:]))
    rot = {n: r for n, r in zip(names, md["components"])}
    assert rot["Motor"]["speed_rpm"] == pytest.approx(rot["Pinion"]["speed_rpm"] / 3.0)
    assert len(t["separation_table"]) == len(t["tnf"]) and len(t["campbell"]["excitations"]) == 6
    for x in t["steady_state"]:
        assert {r["rotor"] for r in x["rotors"]} == {"Motor", "Bull gear", "Pinion", "Compressor"}
        assert all(c["goodman"]["sf"] > 0 for c in x["couplings"])
    assert set(t["short_circuit"]) == {"Three-phase short circuit", "Two-phase short circuit"}
    assert t["vsd"] is not None and t["conclusion"]["text"]
    # Legacy keys used by reporting, checklist and the summary.
    assert t["natural"]["modes"][0]["freq_hz"] > 0 and t["interference"]["checks"] and t["stress"]
    assert {"goodman_safety", "shaft"} <= set(t["stress"][0]) and "lines_hz" in t["interference"]
    assert geared_run["summary"]["torsional_modes_hz"]


def test_direct_drive_example_runs():
    from compsuite.core.workflow import run_project
    from compsuite.examples import export_gas
    p = export_gas()
    p.train.short_circuit_analysis = False
    t = run_project(p, level="fast")["torsional"]
    assert not t["model"]["geared"] and t["short_circuit"] == {}
    assert [c["kind"] for c in t["model"]["components"]] == ["rotor", "coupling", "rotor"]
