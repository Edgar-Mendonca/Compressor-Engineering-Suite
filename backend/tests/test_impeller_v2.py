import math

import numpy as np
import pytest
from fastapi.testclient import TestClient

from compsuite.aero.stage import wiesner_slip
from compsuite.api.app import app
from compsuite.core.model import Project
from compsuite.impeller import geometry as G
from compsuite.materials.database import at_temperature
from compsuite.structural import impeller3d as I

COARSE = {"level": 1, "convergence": False, "max_nd": 2, "n_modes": 1}


def test_velocity_triangles_and_euler_work():
    om = 1000.0
    vt = G.velocity_triangles(1.0, 0.4, om, 0.25, 0.12, 0.5, 0.02, 17, 40.0, 400.0, blockage=0.1)
    cm1 = 1.0 / (math.pi / 4 * (0.25**2 - 0.12**2))
    tip = vt["inlet"]["tip"]
    assert tip["cm"] == pytest.approx(cm1) and tip["U"] == pytest.approx(om * 0.125)
    assert tip["w"] == pytest.approx(math.hypot(cm1, om * 0.125))
    assert tip["beta_deg"] == pytest.approx(math.degrees(math.atan(cm1 / (om * 0.125))))
    assert tip["incidence_deg"] == pytest.approx(tip["beta_blade_deg"] - tip["beta_deg"])
    assert vt["inlet"]["hub"]["w"] < vt["inlet"]["mean"]["w"] < tip["w"]
    o = vt["outlet"]
    U2 = om * 0.25
    cm2 = 0.4 / (math.pi * 0.5 * 0.02 * 0.9)
    assert o["cm"] == pytest.approx(cm2)
    assert o["cu"] / U2 == pytest.approx(wiesner_slip(17, 40.0) - cm2 / U2 * math.tan(math.radians(40)))
    assert o["beta_blade_deg"] == 50.0 and o["slip_velocity"] == pytest.approx((1 - o["slip_factor"]) * U2)
    assert vt["de_haller"] == pytest.approx(o["w"] / tip["w"])


def test_de_haller_flag():
    lo = G.velocity_triangles(1.5, 0.3, 1000.0, 0.25, 0.12, 0.5, 0.03, 17, 40.0, 400.0)
    hi = G.velocity_triangles(0.4, 1.0, 1000.0, 0.25, 0.12, 0.5, 0.01, 17, 40.0, 400.0)
    assert lo["de_haller"] < 0.7 and not lo["de_haller_ok"]
    assert hi["de_haller"] >= 0.7 and hi["de_haller_ok"]


def test_vendor_override_reaches_rotor_and_validation():
    from compsuite.core.workflow import run_project
    p = Project(impeller_vendor=[{"impeller": 1, "mass_kg": 30.0, "ip_kgm2": 0.4, "it_kgm2": 0.25, "yield_mpa": 900}])
    r = run_project(p, "fast")
    g = r["casings"][0]["impellers"]["impellers"][0]
    assert g["mass_kg"] == 30.0 and g["ip_kgm2"] == 0.4 and g["estimate"]["mass_kg"] != 30.0
    assert {v["key"] for v in g["validation"]} == {"mass_kg", "ip_kgm2", "it_kgm2", "yield_mpa"}
    assert any(m["label"] == "Impeller 1" and m["mass_kg"] == 30.0 for m in r["casings"][0]["rotor"]["masses"])
    assert "de_haller" in g and "triangles" in g


def test_contact_length():
    z = [0, 50, 100]
    assert I.contact_length(z, [0.25, 0.2, 0.15], 0.2) == pytest.approx(50, abs=0.2)
    assert I.contact_length(z, [0.1, 0.1, 0.1], 0.2) == 100
    assert I.contact_length(z, [0.3, 0.3, 0.25], 0.2) == 0
    assert I.contact_length([100, 0], [0.15, 0.3], 0.2) == pytest.approx(100 / 3, abs=0.2)


def test_validation_checks_and_scaled_overspeed():
    imp = {"D2_mm": 400, "D1_eye_mm": 250, "hub_mm": 170, "b2_mm": 20, "blades": 15, "backsweep_deg": 40, "index": 0,
           "vendor": {"mass_kg": 20.0, "min_radial_interference_mm": 0.1}}
    st = {"P_in_bara": 20, "P_out_bara": 30, "rho_out": 20, "power_kw": 1000, "T_out_c": 90, "T_in_c": 30}
    r = I.analyse(imp, st, at_temperature("17-4PH H1150", 90), {"mcs_rpm": 12000}, COARSE)
    s = r["summary"]
    assert s["peak_vm_overspeed_scaled_mpa"] == pytest.approx(s["peak_vm_mcs_mpa"] * 1.15**2)
    assert s["fe_mass_kg"] == pytest.approx(20.0, rel=0.01)
    assert r["validation"]["patch"]["pass"]
    assert abs(r["validation"]["disc"]["hoop_error_pct"]) < 5 and abs(r["validation"]["disc"]["ur_error_pct"]) < 5
    assert r["bore_path"]["min_radial_interference_mm"] == pytest.approx(0.1)
    assert [x["speed"] for x in r["inputs"]["speeds"]][-1] == "Overspeed test"
    assert r["inputs"]["speeds"][-1]["rpm"] == pytest.approx(13800) and r["inputs"]["speeds"][2]["rpm"] == pytest.approx(13200)
    assert len(r["acceptance"]) == 9 and s["qualified"] == all(a["status"] == "pass" for a in r["acceptance"][:4])


def test_benchmark_against_reference_report():
    """Anonymised benchmark: a 520 mm shrouded wheel at 10378 rpm with vendor mass / inertia, material and interference.
    The reference 3D FEA gives max VM 576 MPa, hoop 577 MPa, max bore radial deformation 0.22 mm, contact length > 50 %."""
    V = {"mass_kg": 42.49, "ip_kgm2": 1.224, "it_kgm2": 0.655, "bore_mm": 195, "min_radial_interference_mm": 0.202}
    imp = {"D2_mm": 520, "D1_eye_mm": 340, "hub_mm": 230, "b2_mm": 18, "blades": 17, "backsweep_deg": 40, "index": 0, "vendor": V,
           "material_override": {"yield_mpa": 900, "uts_mpa": 1150, "E_gpa": 194, "poisson": 0.3, "density_kg_m3": 7850}}
    st = {"P_in_bara": 30, "P_out_bara": 45, "rho_out": 30, "power_kw": 2000, "T_out_c": 100, "T_in_c": 40}
    r = I.analyse(imp, st, at_temperature("Alloy 718", 100), {"mcs_rpm": 10378}, {**COARSE, "bore_mm": 195})
    s = r["summary"]
    assert 0.9 < s["peak_vm_mcs_mpa"] / 576 < 1.35
    assert 0.9 < s["peak_hoop_mcs_mpa"] / 577 < 1.35
    assert 0.85 < s["max_bore_ur_mm"] / 0.2199 < 1.15
    assert s["contact_length_pct"] >= 50
    basic = {b["parameter"]: b for b in r["inputs"]["basic"]}
    assert abs(basic["Polar inertia Ip"]["diff_pct"]) < 2 and abs(basic["Transverse inertia It (about CG)"]["diff_pct"]) < 10


def test_batch_endpoint_and_report():
    c = TestClient(app)
    body = {"project": Project().model_dump(), "casing": 0, "impellers": [0, 1], "opts": COARSE}
    r = c.post("/api/fea3d/batch", json=body)
    assert r.status_code == 200, r.text
    rows = r.json()["rows"]
    assert [q["impeller"] for q in rows] == [1, 2]
    assert all(q["max_vm_overspeed_scaled_mpa"] > q["max_vm_mcs_mpa"] > 0 and 0 <= q["contact_length_pct"] <= 100 for q in rows)
    assert c.post("/api/fea3d/batch", json={**body, "impellers": [99]}).status_code == 404
    one = c.post("/api/fea3d", json={k: v for k, v in body.items() if k != "impellers"}).json()
    assert {"inputs", "model", "validation", "bore_path", "acceptance"} <= set(one)
    assert "axi_vs_3d" in one["validation"]
    pdf = c.post("/api/fea3d/export/pdf", json={k: v for k, v in body.items() if k != "impellers"})
    assert pdf.status_code == 200 and pdf.content[:4] == b"%PDF"
    assert np.isfinite(rows[0]["max_bore_ur_mm"])
