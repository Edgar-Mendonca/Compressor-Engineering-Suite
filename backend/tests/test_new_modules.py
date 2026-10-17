"""Impeller axisymmetric FEA and material assessment."""

import math
import shutil

import numpy as np
import pytest

from compsuite.materials.assessment import assess_record, co2_corrosion_mm_y, condensed_water_ph, ssc_domain
from compsuite.structural import impeller_fea as F


def thin_disk(ri=0.05, ro=0.25, t=0.004, nr=40, nz=2):
    rs, zs = np.linspace(ri, ro, nr + 1), np.linspace(0, t, nz + 1)
    nodes = [(r, z) for r in rs for z in zs]
    idx = lambda i, j: i * (nz + 1) + j
    el = [[idx(i, j), idx(i + 1, j), idx(i + 1, j + 1), idx(i, j + 1)] for i in range(nr) for j in range(nz)]
    return {"nodes": np.array(nodes), "elements": np.array(el), "zones": ["hub"] * len(el)}


def test_axisymmetric_fe_thin_disk_matches_closed_form():
    E, nu, rho, w, ri, ro = 2e11, 0.3, 7800, 1500.0, 0.05, 0.25
    res = F.solve(thin_disk(), E, nu, rho, w)
    sigma_bore = E * res["u"][0, 0] / ri  # free bore: sigma_theta = E u / r
    ref = (3 + nu) / 4 * rho * w**2 * (ro**2 + (1 - nu) / (3 + nu) * ri**2)
    assert abs(sigma_bore / ref - 1) < 0.005


def test_axisymmetric_fe_thermal_free_expansion():
    """Uniform temperature rise on a free disk: u = alpha dT r, no stress."""
    m = thin_disk()
    res = F.solve(m, 2e11, 0.3, 7800, 0.0, 1.2e-5, np.full(len(m["nodes"]), 100.0))
    assert np.allclose(res["u"][:, 0], 1.2e-5 * 100 * m["nodes"][:, 0], rtol=1e-6)
    assert np.max(np.abs(res["stress"][:, 2:6])) < 1e3


@pytest.mark.skipif(shutil.which("ccx") is None, reason="CalculiX not installed")
def test_impeller_fe_matches_calculix(tmp_path):
    import subprocess
    imp = {"D2_mm": 352, "D1_eye_mm": 200, "hub_mm": 219, "b2_mm": 18, "blades": 17}
    m = F.mesh(imp)
    w = 1650.0
    ours = F.solve(m, 2e11, 0.29, 7800, w, blades=17)["u"]
    (tmp_path / "imp.inp").write_text(F.calculix_deck(m, 2e11, 0.29, 7800, w))
    subprocess.run(["ccx", "-i", "imp"], cwd=tmp_path, capture_output=True, check=True)
    u = {}
    for line in (tmp_path / "imp.dat").read_text().splitlines():
        p = line.split()
        if len(p) >= 3 and p[0].isdigit():
            u[int(p[0]) - 1] = float(p[1])
    tip = int(np.argmax(m["nodes"][:, 0] + 1e-6 * m["nodes"][:, 1]))
    assert abs(ours[tip, 0] / u[tip] - 1) < 0.005


def test_water_chemistry_and_corrosion():
    assert 3.6 < condensed_water_ph(25, 1.0, 0.0) < 4.1  # CO2-saturated water at 1 bar: pH ~3.9
    assert condensed_water_ph(25, 10.0, 0.0) < condensed_water_ph(25, 1.0, 0.0)
    assert ssc_domain(0.001, 4.0) == "D0" and ssc_domain(1.0, 3.0) == "D3"
    assert math.isclose(co2_corrosion_mm_y(60, 1.0), 10 ** (5.8 - 1710 / 333.15), rel_tol=1e-9)


def test_material_name_alone_never_passes():
    from compsuite.core.model import Project
    rows = [{"location": "Stage 1", "T_c": 80, "ph2s_bar": 0.2, "pco2_bar": 1.0, "wet": False, "sour": True, "ph": 4.0,
             "co2_rate_mm_y": 0.0}]
    bare = {"component": "Shaft", "material": "AISI 4140 Q&T", "verified": False, "evidence_reference": "",
            "min_temp_c": -30, "max_temp_c": 400, "max_hardness_hrc": 22, "measured_hardness_hrc": None,
            "max_dry_ph2s_bar": None, "corrosion_resistant": False}
    assert assess_record(bare, rows, Project())["status"] == "evidence"
    good = {**bare, "verified": True, "evidence_reference": "MTC-123", "measured_hardness_hrc": 20, "max_dry_ph2s_bar": 1.0}
    assert assess_record(good, rows, Project())["status"] == "within"
    assert assess_record({**good, "measured_hardness_hrc": 25}, rows, Project())["status"] == "outside"
