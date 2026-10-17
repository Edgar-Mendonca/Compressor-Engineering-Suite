"""Integration: workflow, storage, optimisation, reports, CAD and API."""

import json
import math

import pytest
from fastapi.testclient import TestClient

from compsuite.cad.geometry import cadquery_available, rotor_step, rotor_stl, scene
from compsuite.core.model import Project
from compsuite.core.storage import Store
from compsuite.core.trace import jsonable
from compsuite.core.workflow import run_project
from compsuite.optimization.studies import compare_configurations, parametric_study, set_path


@pytest.fixture(scope="module")
def full():
    p = Project()
    return p, run_project(p, level="full")


@pytest.fixture(scope="module")
def fast():
    p = Project()
    return p, run_project(p, level="fast")


def test_full_workflow_example(full):
    p, r = full
    s = r["summary"]
    assert s["type"].startswith("Centrifugal")
    assert 3 <= s["stages"] <= 6
    assert 10000 < s["speed_rpm"] < 20000
    assert 0.75 < s["polytropic_efficiency"] < 0.86
    # Power consistent with mass flow x head / efficiency
    sz = r["sizing"]
    assert math.isclose(sz["gas_power_kw"], sz["mass_flow_kg_s"] * sz["polytropic_head_total_j_kg"] /
                        sz["polytropic_efficiency_overall"] / 1e3, rel_tol=1e-6)
    # Discharge pressure of the stage march meets the requirement
    assert abs(sz["stages"][-1]["P_out_bara"] - p.design_case().discharge_pressure_bara) < 0.5
    # Operating points: the rated case sits at ~100 % speed
    rated = next(o for o in r["operating_points"] if o["case"] == "Rated")
    assert abs(rated["speed_frac"] - 1.0) < 0.01
    # Lateral analysis produced a stable rotor with criteria evaluated
    lat = r["casings"][0]["lateral"]
    assert lat["stability"]["logdec_with_qa"] > 0.1
    assert lat["unbalance_cases"] and all("pass" in pk for c in lat["unbalance_cases"] for pk in c["peaks"])
    counts = r["checklist"]["counts"]
    assert counts["review"] >= 5 and sum(counts.values()) == len(r["checklist"]["items"])
    json.dumps(jsonable(r))  # fully serialisable


def test_map_ordering(full):
    _, r = full
    for line in r["performance_map"]["lines"]:
        q = [pt["q_am3_h"] for pt in line["points"]]
        assert q == sorted(q)
        assert line["points"][0]["head_kj_kg"] > line["points"][-1]["head_kj_kg"]  # head falls toward stonewall


def test_design_change_propagates(fast):
    p, r0 = fast
    p2 = set_path(p, "cases.0.discharge_pressure_bara", 110.0)
    r1 = run_project(p2, level="fast")
    assert r1["sizing"]["polytropic_head_total_j_kg"] > r0["sizing"]["polytropic_head_total_j_kg"]
    assert r1["casings"][0]["rotor"]["casing_torque_nm"] > r0["casings"][0]["rotor"]["casing_torque_nm"]


def test_intercooling_triggered_by_temperature_limit():
    p = Project()
    p.design_basis.max_discharge_temperature_c = 110.0
    r = run_project(p, level="fast")
    assert r["sizing"]["n_sections"] >= 2
    assert all(s["T_out_c"] <= 125 for s in r["sizing"]["sections"])


def test_user_bearing_coefficients():
    p = Project()
    p.bearings.journal_type = "user"
    r = run_project(p, level="fast")
    assert r["casings"][0]["lateral"]["stability"]["logdec_with_qa"] is not None


def test_storage_revisions_and_history(fast, tmp_path):
    p, r = fast
    st = Store(tmp_path / "t.db")
    rec = st.create(p)
    pid = rec["id"]
    p2 = p.model_copy(update={"name": "Changed"})
    st.update(pid, p2, "rename")
    assert [x["revision"] for x in st.revisions(pid)] == [0, 1]
    assert st.project(pid, 0).name == p.name and st.project(pid).name == "Changed"
    run_id = st.save_run(pid, 1, r)
    assert st.history(pid)[0]["id"] == run_id
    assert st.run(run_id)["summary"]["stages"] == r["summary"]["stages"]


def test_parametric_and_compare(fast):
    p, _ = fast
    ps = parametric_study(p, "bearings.preload", [0.1, 0.3], ["logdec_with_qa", "bearing_loss_kw"])
    assert all(row["ok"] for row in ps["rows"])
    cmp = compare_configurations([p, set_path(p, "design_basis.head_coefficient", 0.45)], ["stages", "efficiency"])
    assert len(cmp["rows"]) == 2


def test_reports_and_cad(full, tmp_path):
    from compsuite.reporting.report import report_html, report_pdf, results_excel
    p, r = full
    html = report_html(p, r)
    assert "Verification checklist" in html and "Not a certificate of compliance" in html
    assert report_pdf(p, r)[:4] == b"%PDF"
    assert results_excel(p, r)[:2] == b"PK"
    cas = r["casings"][0]
    stl = rotor_stl(cas["rotor"], cas["impellers"]["impellers"])
    assert stl.startswith("solid") and stl.count("facet normal") > 100
    sc = scene(cas["rotor"], cas["impellers"]["impellers"])
    assert sum(1 for x in sc["parts"] if x["type"] == "impeller") == r["sizing"]["n_stages"]
    if cadquery_available():
        path = rotor_step(cas["rotor"], cas["impellers"]["impellers"], str(tmp_path / "rotor.step"))
        assert open(path).read(20).startswith("ISO-10303")


def test_api_endpoints(tmp_path, monkeypatch):
    monkeypatch.setenv("COMPSUITE_DB", str(tmp_path / "api.db"))
    import importlib
    import compsuite.api.app as appmod
    importlib.reload(appmod)
    c = TestClient(appmod.app)
    assert c.get("/api/health").json()["status"] == "ok"
    proj = c.get("/api/defaults").json()
    st = c.post("/api/thermo/state", json={"components": {"CH4": 1}, "temperature_c": 25, "pressure_bara": 50}).json()
    assert 0.85 < st["state"]["Z"] < 0.95
    created = c.post("/api/projects", json={"project": proj, "note": "first"}).json()
    pid = created["id"]
    res = c.post(f"/api/projects/{pid}/run?level=fast").json()
    assert res["summary"]["stages"] >= 1 and "scene" in res
    assert len(c.get(f"/api/projects/{pid}/history").json()) == 1
    proj["cases"][0]["discharge_pressure_bara"] = 95
    assert c.put(f"/api/projects/{pid}", json={"project": proj, "note": "higher Pd"}).json()["current_revision"] == 1
    r = c.post("/api/export/rotor.stl", json={"project": proj, "level": "fast"})
    assert r.status_code == 200 and r.text.startswith("solid")
    r = c.post("/api/export/calculix-beam.inp", json={"project": proj, "level": "fast"})
    assert "*FREQUENCY" in r.text
    assert c.post("/api/studies/parametric", json={"project": proj, "variable": "bearings.preload", "values": [0.2],
                                                   "metrics": ["nope"]}).status_code == 422


def test_app_info_and_changelog():
    from compsuite import __version__
    from compsuite.api.app import app
    c = TestClient(app)
    info = c.get("/api/app/info").json()
    assert info["name"] == "CentriForge" and info["version"] == __version__
    assert info["changelog"][0]["version"] == __version__ and info["changelog"][0]["items"]
    assert c.post("/api/app/update").status_code == 400  # not the installed app
