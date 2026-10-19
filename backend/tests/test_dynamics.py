"""Dynamic simulation: default network from the design, steady design point, surge detection, a passing study, API and report."""

from fastapi.testclient import TestClient

from compsuite.api.app import app
from compsuite.core.trace import jsonable
from compsuite.core.workflow import run_project
from compsuite.dynamics.engine import simulate
from compsuite.dynamics.network import SCENARIOS, default_network, scenario
from compsuite.examples import export_gas


def _net():
    p = export_gas()
    return default_network(p, jsonable(run_project(p, "full")))


def test_design_point_steady_and_studies():
    net = _net()
    base = simulate(net, {"duration_s": 3, "events": []})
    c = base["compressor"]
    assert abs(c["speed_frac"][-1] - net["driver"]["speed_setpoint"]) < 0.01
    assert abs(base["links"]["K-100"]["mdot_kg_s"][-1] / net["design"]["mass_flow_kg_s"] - 1) < 0.03
    assert abs(base["nodes"]["V-101"]["P_bara"][-1] - net["design"]["Pd_bara"]) < 1.5
    assert not base["summary"]["surge"]
    surge = simulate(net, scenario("surge", net))["summary"]
    assert surge["surge"] and surge["surge_cycles"] >= 1 and surge["verdict"] == "fail"
    stop = simulate(net, scenario("stop", net))["summary"]
    assert not stop["surge"] and stop["settle_out_bara"] and net["design"]["Ps_bara"] < stop["settle_out_bara"] < net["design"]["Pd_bara"]
    assert set(SCENARIOS) >= {"esd", "trip", "blocked", "startup", "stop"}


def test_dynamics_api_and_report():
    c = TestClient(app)
    p = export_gas().model_dump()
    m = c.post("/api/dynamics/model", json={"project": p}).json()
    assert {"nodes", "links", "controllers", "driver", "map"} <= set(m["network"]) and "esd" in m["scenarios"]
    net = m["network"]
    net["links"] = [l for l in net["links"] if l["id"] != "HV-100"]          # user edit: remove the hot-gas valve
    r = c.post("/api/dynamics/run", json={"project": p, "network": net, "scenario": {**m["scenarios"]["blocked"], "duration_s": 10}})
    assert r.status_code == 200 and "HV-100" not in r.json()["links"]
    pdf = c.post("/api/dynamics/report.pdf", json={"project": p, "network": net, "scenario": "blocked"})
    assert pdf.status_code == 200 and pdf.content[:4] == b"%PDF"
