"""Mechanical running test (API 617 8.3.2 / 8.3.3): plan, prediction, acceptance, URT, logs, leak test, report."""

import pytest
from fastapi.testclient import TestClient

from compsuite.api.app import app
from compsuite.core.model import Project
from compsuite.core.workflow import run_project
from compsuite.testing import mrt as M


@pytest.fixture(scope="module")
def base():
    p = Project()
    r = run_project(p, level="fast")
    return p, r, M.mrt_analysis(p, r)


def test_limits():
    assert M.vib_limit_um(5000) == 25.4
    assert M.vib_limit_um(15000) == pytest.approx(25.4 * (12000 / 15000) ** 0.5)


def test_plan_and_prediction(base):
    p, r, o = base
    sp, plan = o["speeds"], o["plan"]
    assert sp["trip_rpm"] > sp["mcs_rpm"] > sp["min_rpm"]
    segs = plan["segments"]
    trip = [s for s in segs if s["phase"] == "trip" and s["n0_rpm"] == s["n1_rpm"]]
    assert trip and trip[0]["t1_min"] - trip[0]["t0_min"] >= 15
    run = sum(s["t1_min"] - s["t0_min"] for s in segs if s["phase"] == "run4h" and s["n0_rpm"] == s["n1_rpm"] == sp["mcs_rpm"])
    assert run == pytest.approx(240)
    assert [s["seq"] for s in segs if s["seq"]] == ["Seq 1", "Seq 2", "Seq 3", "Seq 4", "Seq 5"]
    assert max(plan["speed_rpm"]) == pytest.approx(sp["trip_rpm"], rel=1e-4) and plan["speed_rpm"][-1] == 0
    assert max(plan["oil_t_c"]) > min(plan["oil_t_c"])
    pred = o["prediction"]
    assert set(pred["probes"]) == set(M.PROBES) and pred["critical_speeds"]
    assert len(pred["waterfall"]) == 6 and pred["waterfall"][0]["components"][0]["kind"] == "1X"
    assert all(len(v["x_um"]) == len(v["speeds_rpm"]) for v in pred["centreline"].values())
    assert o["train"]["components"][0]["kind"] == "vfd" and any(c["kind"] == "casing" for c in o["train"]["components"])
    assert {a["status"] for a in o["acceptance"]} <= {"pass", "attention", "review", "fail"}
    assert o["urt"]["range_g_mm"][0] == pytest.approx(2 * o["urt"]["ur_g_mm"]) and o["urt"]["nameplate"] == "calc"


def test_geared_train():
    p = Project()
    p.design_basis.driver_type = "fixed_speed_motor_gearbox"
    p.train.gear_ratio = 4.0
    tr = M.test_train(p, {"casings": [{"impellers": {"impellers": [1, 2]}}], "summary": {}}, {"rated_rpm": 12000}, {})
    kinds = [c["kind"] for c in tr["components"]]
    assert tr["geared"] and kinds.index("gearbox") > kinds.index("motor") and kinds.count("coupling") == 2


def test_log_urt_and_leak(base):
    p, r, _ = base
    mcs = r["casings"][0]["lateral"]["speeds"]["mcs_rpm"]
    log = [{"time": f"{h}:{m:02d}", "N1": mcs, "V1-X": 8, "V1-Y": 9, "V2-X": 7, "V2-Y": 6, "V5-Z": 100 + 10 * i, "V6-Z": 90,
            "TA1": 85, "TA2": 88, "seq": f"Seq {i}" if 1 <= i <= 5 else "nor"} for i, (h, m) in enumerate([(0, 0), (0, 30), (1, 0), (1, 30), (2, 0), (2, 30), (3, 0), (3, 30), (4, 0)])]
    leak = {"readings": [{"t_min": t, "pressure_barg": 80.0, "dgs_de_nm3h": 1.2, "dgs_nde_nm3h": 1.0, "joint_leak": False} for t in (0, 15, 30)]}
    u0 = M.mrt_analysis(p, r)["urt"]
    lo, mid, hi = u0["predicted_range_um"]["V1-X"]["mcs"]
    o = M.mrt_analysis(p, r, log=log, coastdown=[{"speed_rpm": s, "probe": "V1-X", "amp_um": a} for s, a in [(3000, 3), (u0["predicted_critical_rpm"], 9), (9000, 4)]],
                       urt_measured={"critical_rpm": u0["predicted_critical_rpm"] * 1.02, "amplitudes_um": {"V1-X": mid}}, leak=leak, options={"noise_dba": 82})
    assert o["log"]["summary"]["duration_at_mcs_min"] == 240 and len(o["log"]["summary"]["sequences"]) == 5
    acc = {a["check"]: a["status"] for a in o["acceptance"]}
    assert acc["4 h run at MCS"] == "pass" and acc["Lube-oil sequences"] == "pass" and acc["Noise at 1 m"] == "pass"
    assert o["urt"]["status"] == "pass" and o["urt"]["nameplate"] == "test"
    assert o["leak"]["status"] == "pass"
    bad = M.mrt_analysis(p, r, log=[{**log[0], "V1-X": 40, "TA3": 120}])
    assert bad["log"]["rows"][0]["status"] == "fail" and bad["status"] == "fail"


def test_api_and_report():
    c = TestClient(app)
    proj = Project().model_dump()
    d = c.post("/api/mrt", json={"project": proj}).json()
    assert d["plan"]["duration_min"] > 300 and "along" in d and len(d["along"]["V1-X"]) == len(d["along"]["t_min"])
    pdf = c.post("/api/mrt/report.pdf", json={"project": proj})
    assert pdf.status_code == 200 and pdf.content[:4] == b"%PDF"
