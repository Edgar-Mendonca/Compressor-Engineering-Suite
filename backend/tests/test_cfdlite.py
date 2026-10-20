"""CFD-lite: physically sensible meridional field, blade loading, diffuser, cascade; API, export and report."""

import io
import zipfile

import numpy as np
from fastapi.testclient import TestClient

from compsuite.aero.cfdlite import analyse, cascade
from compsuite.api.app import app
from compsuite.core.trace import jsonable
from compsuite.core.workflow import run_project
from compsuite.examples import export_gas


def test_cfdlite_physics():
    r = jsonable(run_project(export_gas(), "full"))
    imp = r["casings"][0]["impellers"]["impellers"][0]
    st = next(s for s in r["sizing"]["stages"] if s["index"] == imp["index"])
    o = analyse(imp, st, r["cases"][0]["suction"])
    m = o["meridional"]
    Wm, p = np.array(m["Wm"]), np.array(m["p_bara"])
    assert (Wm > 0).all() and np.array(m["Mrel"]).max() < 1.2
    assert p[m["i_te"]].mean() > p[m["i_le"]].mean() > 0.8 * st["P_in_bara"]          # the impeller raises the static pressure
    le = Wm[m["i_le"] + 2]
    assert le[-1] > le[0]                                                               # faster flow at the shroud in the inlet bend
    b = o["blade_to_blade"]["streamlines"]["mid"]
    assert max(b["W_ss"]) > max(b["W_ps"]) and 1.0 < o["blade_to_blade"]["max_diffusion_ratio"] < 4
    s = o["stator"]
    assert 0 < s["cp_recovery"] < 1 and s["diffuser"][-1]["alpha_deg"] > 0
    c = o["cascade"]
    assert 0 <= c["exit_flow_deg"] < c["inlet_flow_deg"] and len(c["streamlines"]) > 10
    assert {x["status"] for x in o["checks"]} <= {"pass", "review"}


def test_cascade_more_vanes_less_deviation():
    assert cascade(30, solidity=2.0)["deviation_deg"] < cascade(30, solidity=0.8)["deviation_deg"]


def test_cfd_api_export_report():
    c = TestClient(app)
    body = {"project": export_gas().model_dump(), "impeller": 0}
    assert c.post("/api/cfd", json=body).status_code == 200
    z = zipfile.ZipFile(io.BytesIO(c.post("/api/cfd/export.zip", json=body).content))
    assert {"hub.curve", "shroud.curve", "profile.curve", "boundary_conditions.txt", "meridional_field.csv"} <= set(z.namelist())
    assert c.post("/api/cfd/report.pdf", json=body).content[:4] == b"%PDF"
    assert c.post("/api/cfd", json={**body, "impeller": 99}).status_code == 404
