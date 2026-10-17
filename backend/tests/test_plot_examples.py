from fastapi.testclient import TestClient

from compsuite.api.app import app
from compsuite.examples import EXAMPLES, blank
from compsuite.reporting.prism import render

SPEC = {"data": [{"x": [1, 2, 3], "y": [2, 4, 3], "name": "a", "mode": "lines+markers"},
                 {"x": [1, 2, 3], "y": [10, 20, 15], "name": "b", "mode": "lines", "yaxis": "y2"}],
        "layout": {"title": "T", "xaxis": {"title": "x (m)", "type": "log", "range": [0, 1]}, "yaxis": {"title": "y"},
                   "yaxis2": {"title": "y2"}, "shapes": [{"type": "line", "xref": "paper", "x0": 0, "x1": 1, "y0": 3, "y1": 3}]}}


def test_render_formats_and_meta():
    r = render(SPEC, {"xlim": [None, 8], "series": {"0": {"name": "renamed", "color": "#ff0000"}}})
    assert r["content"].startswith("<?xml") and "renamed" in r["content"]
    m = r["meta"]
    assert m["xlog"] and abs(m["xlim"][0] - 1) < 1e-9 and abs(m["xlim"][1] - 8) < 1e-9 and m["y2lim"] is not None
    assert 0 < m["axes"]["left"] < m["axes"]["right"] < 1
    assert render(SPEC, fmt="png", dpi=100)["content"][:4] == b"\x89PNG"
    assert render(SPEC, fmt="pdf")["content"][:4] == b"%PDF"


def test_plot_api_and_examples():
    c = TestClient(app)
    assert c.post("/api/plot", json={"spec": SPEC}).json()["meta"]["series"][1]["axis"] == "y2"
    assert c.post("/api/plot/export/png", json={"spec": SPEC, "dpi": 100}).headers["content-type"] == "image/png"
    ids = [e["id"] for e in c.get("/api/examples").json()]
    assert set(ids) == set(EXAMPLES) and c.get("/api/examples/blank").json()["cases"][0]["is_design"]
    assert c.get("/api/examples/nope").status_code == 404


def test_examples_are_valid_projects():
    for e in EXAMPLES.values():
        p = e["build"]()
        assert p.cases and p.design_case().is_design
    assert len(blank().cases) == 1
