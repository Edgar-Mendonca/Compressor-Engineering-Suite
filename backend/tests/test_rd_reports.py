"""0.5.3: min / avg / max bearing cases, seals and support flexibility in the lateral model, torsional clearing
time / Miner / torque reversal, and the lateral, stability and torsional analysis reports."""

import numpy as np
import pytest
from fastapi.testclient import TestClient

from compsuite.api.app import app
from compsuite.core.workflow import run_project
from compsuite.examples import export_gas
from compsuite.reporting import rotordynamics_reports as R
from compsuite.rotordynamics.lateral import series_support
from compsuite.torsional.api617 import miner_damage


@pytest.fixture(scope="module")
def ctx():
    p = export_gas()
    p.train.breaker_clearing_time_s = 0.1
    return p, run_project(p, "full")


def test_cases_and_seals(ctx):
    p, r = ctx
    L = r["casings"][0]["lateral"]
    assert [c["key"] for c in L["bearing_cases"]] == ["min", "avg", "max"]
    assert L["seal_coefficients_lateral"] and all("bode_stations" in u for u in L["bearing_cases"][0]["unbalance"])
    assert len(L["stability_api617"]["level2"]) == 3


def test_series_support_and_miner():
    w = np.array([100.0, 1000.0])
    rows = [{"kxx": 1e8, "kyy": 1e8, "kxy": 1e6, "kyx": -1e6, "cxx": 1e5, "cyy": 1e5, "cxy": 0.0, "cyx": 0.0}] * 2
    out = series_support(rows, w, 1e8, 0.0)
    assert out["kxx"][0] < 1e8 and out["kxx"][0] == pytest.approx(5e7, rel=0.05)
    assert series_support(rows, w, 0.0, 0.0)["kxx"][0] == 1e8
    assert miner_damage(np.array([0.0, 10, 0, 8, 0]), 20, 400, 1000)["infinite_life"]
    d = miner_damage(np.array([0.0, 100, 0, 80, 0]), 50, 400, 1000)
    assert d["cycles_above_endurance"] == 2 and d["damage"] > 0


def test_torsional_extras(ctx):
    _, r = ctx
    sc = r["torsional"]["short_circuit"]["Three-phase short circuit"]
    assert sc["clearing_time_s"] == 0.1 and "miner_damage" in sc and "torque_reversal" in sc


def test_reports(ctx):
    p, r = ctx
    for fn in (R.lateral_report, R.stability_report):
        assert fn(p, r)[:4] == b"%PDF"
    assert R.torsional_report(p, r)[:4] == b"%PDF"


def test_report_api():
    c = TestClient(app)
    proj = export_gas().model_dump()
    res = c.post("/api/torsional/analysis-report.pdf", json={"project": proj})
    assert res.status_code == 200 and res.content[:4] == b"%PDF"
    assert c.post("/api/nope/analysis-report.pdf", json={"project": proj}).status_code == 404
