"""API 617-2022 lateral / stability formulas and a coarse run on an example project."""

import json
import math

import pytest

from compsuite.core.trace import jsonable
from compsuite.core.workflow import run_project
from compsuite.examples import export_gas
from compsuite.rotordynamics.lateral import (amplitude_limit_um, coupling_unbalance_g_mm, required_separation,
                                             residual_unbalance_g_mm, scale_factor_scc)
from compsuite.rotordynamics.stability import anticipated_qa_kn_mm, labyrinth_coefficients, level1_screening


def test_unbalance_formulas():
    # Ua = 2 Ur with Ur = 6350 W / Nmc (W = 684.1 kg rotor, Nmc 10378 rpm -> ~837 g mm)
    assert 2 * residual_unbalance_g_mm(684.1, 10378) == pytest.approx(837.2, rel=1e-3)
    assert residual_unbalance_g_mm(100, 30000) == pytest.approx(3937 * 100 / 30000)
    # Coupling: 2 x max(63500 W/N, 12.7 W, 72)
    assert coupling_unbalance_g_mm(21.5, 10378) == pytest.approx(2 * 12.7 * 21.5)
    assert coupling_unbalance_g_mm(1.0, 10378) == pytest.approx(144.0)
    assert coupling_unbalance_g_mm(10.0, 3000) == pytest.approx(2 * 63500 * 10 / 3000)


def test_amplitude_and_scale_factor():
    avl = amplitude_limit_um(10378, 25.4)
    assert avl == pytest.approx(25.4)
    assert amplitude_limit_um(20000, 25.4) == pytest.approx(25.4 * math.sqrt(12000 / 20000))
    assert scale_factor_scc(avl, 9.04) == pytest.approx(2.81, abs=0.01)
    assert scale_factor_scc(avl, 1.77) == 6.0
    assert required_separation(4.18, True) == pytest.approx(10.65, abs=0.05)
    assert required_separation(2.82, False) == pytest.approx(14.12, abs=0.05)
    assert required_separation(2.0, True) is None


def test_anticipated_cross_coupling():
    stages = [(964.9, 520, 25.2, 6.89, 5.41), (998.0, 520, 19.0, 9.43, 7.46), (1021.5, 520, 16.1, 12.86, 10.13),
              (998.3, 520, 20.1, 17.58, 13.78), (814.7, 510, 10.2, 42.53, 34.40), (874.2, 500, 11.5, 32.36, 26.03),
              (873.3, 510, 13.7, 24.53, 19.37)]
    q = [anticipated_qa_kn_mm(p, d, h, 9884, rd, rs) for p, d, h, rd, rs in stages]
    assert q[0] == pytest.approx(0.27, abs=0.005)
    assert sum(q) == pytest.approx(3.01, abs=0.01)


def test_screening_and_seal_model():
    assert not level1_screening(2.46, 0.183, 2.49, 18.8)["level2_required"]
    assert level1_screening(1.5, 0.3, 2.0, 10.0)["level2_required"]
    assert level1_screening(3.0, 0.3, 3.6, 10.0)["region"] == "B"
    w = 10378 * math.pi / 30
    args = (0.19, 0.375e-3, 5, 4e-3, 3.5e-3, 5.27e5, 3.9e5, 251.0 * 317.0, 1.2e-5, w)
    hi, lo = labyrinth_coefficients(*args, 0.5), labyrinth_coefficients(*args, 0.0)
    assert hi["k"] > lo["k"] and hi["k"] > 0 and hi["C"] > 0
    assert 1e4 < hi["k"] < 1e6  # order of vendor eye-seal values (0.1 - 0.7 MN/m)


@pytest.fixture(scope="module")
def lat():
    return run_project(export_gas(), level="full")["casings"][0]["lateral"]


def test_example_api617_run(lat):
    assert [c["key"] for c in lat["bearing_cases"]] == ["min", "max"]
    kmin, kmax = (c["k_at_mcs_n_m"] for c in lat["bearing_cases"])
    assert kmin > kmax > 0  # tighter, colder bearing is stiffer
    for c in lat["bearing_cases"]:
        assert len(c["undamped_modes"]) == 4 and c["bearing_coefficients"]
        assert [u["case"] for u in c["unbalance"]] == [1, 2, 3]
        assert len(c["unbalance"][1]["unbalances"]) == 2 and c["unbalance"][1]["unbalances"][1]["phase_deg"] == 180.0
        for u in c["unbalance"]:
            assert 0 < u["scc"] <= 6 and u["avl_um"] <= 25.4
            assert u["clearance"] and all(s["corrected_um"] == pytest.approx(u["scc"] * s["ap_um"]) for s in u["clearance"])
            assert u["deflected_shapes"][-1]["label"] == "Nmc"
    st = lat["stability_api617"]
    assert st["qa_total_kn_mm"] > 0 and len(st["qa_table"]) > 0 and st["csr"] > 1
    assert len(st["level1"]) == 2 and len(st["level2"]) == 2
    assert all(r["q0_kn_mm"] > 0 for r in st["level1"]) and all("delta_f_min_seal" in r for r in st["level2"])
    assert len(st["seal_coefficients"]["min"]) == len(st["qa_table"]) + 1  # eye seals + balance piston
    # Legacy keys still present
    assert lat["unbalance_cases"] and "logdec_with_qa" in lat["stability"]
    assert lat["conclusion"]["items"]
    json.dumps(jsonable(lat))
