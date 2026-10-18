"""PTC 10 performance test: similarity limits, test design, data reduction round trip and acceptance."""

import pytest

from compsuite.core.workflow import run_project
from compsuite.examples import export_gas
from compsuite.testing import ptc10
from compsuite.thermo.backends import make_gas


@pytest.fixture(scope="module")
def ctx():
    p = export_gas()
    return p, run_project(p, "full")


def test_limit_fits():
    lo, hi = ptc10.mach_limits(0.8)
    assert lo == pytest.approx(-0.058, abs=0.003) and hi == pytest.approx(0.086, abs=0.003)
    assert ptc10.mach_limits(0.1)[0] == pytest.approx(-0.1)
    assert ptc10.reynolds_limits(4e6) == (0.1, 100.0)


def test_orifice_round_trip():
    g = make_gas({"CO2": 100}, "pr")
    st = g.state(308.15, 5e5)
    d = ptc10.size_orifice(8.0, 0.4, st.rho, 1.5e-5, float(st.k), 5e5)
    assert 0.2 * 0.4 <= d <= 0.75 * 0.4
    assert ptc10.orifice_mass_flow(d, 0.4, 25e3, 5e5, st.rho, 1.5e-5, float(st.k)) == pytest.approx(8.0, rel=1e-3)


def test_type2_co2_example(ctx):
    p, res = ctx
    out = ptc10.ptc10_analysis(p, res, {"test_type": 2})
    s = out["sections"][0]
    assert s["selected"]["gas"] == "CO2" and s["selected"]["qualified"]
    assert any(not c["qualified"] for c in s["combinations"])          # some combinations are rejected
    ln = next(ln for ln in s["lines"] if abs(ln["speed_frac"] - 1) < 1e-6)
    r = min((r for r in ln["results"] if "test" in r), key=lambda r: abs(r["similarity"]["phi"] - 1))
    assert r["similarity"]["phi"] == pytest.approx(1.0, abs=0.1)
    assert 0.3 < r["uncertainty_pct"]["eta_p"] < 2.0
    assert out["status"] == "pass", s["acceptance"]


def test_type1_and_user_speed(ctx):
    p, res = ctx
    out = ptc10.ptc10_analysis(p, res, {"test_type": 1, "type1": {"P1_bara": 29.0}})
    assert out["sections"][0]["selected"]["qualified"]
    sel = ptc10.ptc10_analysis(p, res, {"test_type": 2, "selection": {"1": {"gas": "N2", "P1_bara": 5.0, "N_rpm": 13000}}})["sections"][0]["selected"]
    assert sel["gas"] == "N2" and sel["N_rpm"] == pytest.approx(13000) and sel["user_set"]
    assert not sel["qualified"]                                          # volume ratio no longer matched


def test_reports(ctx):
    p, res = ctx
    out = ptc10.ptc10_analysis(p, res, {})
    assert ptc10.ptc10_report(p, out)[:4] == b"%PDF"
