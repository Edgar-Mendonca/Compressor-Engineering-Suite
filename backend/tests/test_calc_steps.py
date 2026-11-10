"""Calculation transparency: every recorded step is complete and every symbol is explained."""

import math
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from compsuite.api.app import app
from compsuite.core.trace import jsonable
from compsuite.core.workflow import collect_traces, run_project
from compsuite.examples import EXAMPLES

THEORY = Path(__file__).resolve().parents[1] / "compsuite" / "data" / "theory"


@pytest.fixture(scope="module")
def traces():
    return collect_traces(run_project(EXAMPLES["export_gas"]["build"](), level="fast"))


def check(tr):
    for s in tr.steps:
        assert s["name"] and s["formula"], (tr.module, s)
        missing = set(s["given"]) - set(tr.symbols)
        assert not missing, f"{tr.module} / {s['name']}: no meaning for {missing}"
        if isinstance(s["result"], float):
            assert math.isfinite(s["result"]), (tr.module, s["name"])
    jsonable(tr)


def test_steps_complete(traces):
    for tr in traces:
        check(tr)


def test_core_modules_have_steps(traces):
    have = {t.module for t in traces if t.steps}
    assert "compression" in have
    assert len(have) >= 8, have


def test_theory_and_references():
    c = TestClient(app)
    pages = c.get("/api/app/theory").json()
    assert {"thermo"} <= {p["id"] for p in pages}
    for p in pages:
        text = c.get(f"/api/app/theory/{p['id']}").text
        assert text.startswith("# ") and text.count("$$") % 2 == 0, p["id"]
    assert c.get("/api/app/theory/nope").status_code == 404
    refs = c.get("/api/app/references").json()
    assert sum(len(g["items"]) for g in refs) > 30
    assert len(list(THEORY.glob("*.md"))) == len(pages)
