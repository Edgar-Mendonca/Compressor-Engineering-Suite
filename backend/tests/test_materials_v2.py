"""Material assessment v2: stage table, charts, corrosion acceptance, auto-selection, O2, SOP, report."""

import json

import pytest

from compsuite.aero.sizing import size_compressor
from compsuite.core.model import MaterialAssessment, Project, StageOverride
from compsuite.core.trace import jsonable
from compsuite.materials.assessment import corrosion_acceptance, material_assessment, ssc_domain
from compsuite.thermo.backends import make_gas

# Vendor presentation, sour reinjection compressor (30 % H2S): stage inlet P bar, T degC.
STAGES = [(2.72, 28.1), (3.92, 47.8), (5.52, 66.9), (7.72, 86.0), (10.70, 105.5), (14.59, 124.9)]
PRESENTATION = {"Casing": ("ASTM A350 LF2", "Alloy 625"), "Inlet cover": ("ASTM A350 LF2", "Alloy 625"),
                "Discharge cover": ("ASTM A350 LF2", None), "Inlet plenum": ("Alloy 625", None),
                "Discharge scroll": ("ASTM A352 LCB (Mod)", None), "Diaphragms": ("ASTM A350 LF2", None),
                "First impeller": ("Alloy 718", None), "Other impellers": ("ASTM A182 F22", None),
                "Shaft": ("AISI 4140 A668 Cl L <=22 HRC", None), "Shaft sleeve": ("Alloy 718", None),
                "Balance drum": ("ASTM A182 F22", None), "Labyrinths": ("AA6082-T6", None)}


def _project(**contaminants):
    p = Project()
    p.gas.components = {"CH4": 55.0, "C2H6": 6.0, "C3H8": 3.0, "N2": 1.0, "CO2": 5.0, "H2S": 30.0}
    ma = p.material_assessment
    ma.overrides_only = True
    ma.stage_overrides = [StageOverride(location=f"St{i + 1}", P_bara=P, T_c=T, h2o_pct=0.922, co2_pct=5.0, h2s_pct=30.0)
                          for i, (P, T) in enumerate(STAGES)]
    ma.sop_pressure_bara, ma.sop_temperature_c, ma.service_life_years = 13.9, 40.0, 20
    for k, v in contaminants.items():
        setattr(ma.contaminants, k, v)
    return p


@pytest.fixture(scope="module")
def gas_sizing():
    p = _project()
    gas = make_gas(p.gas.components, "pr")
    return gas, size_compressor(gas, p)


def _run(gas_sizing, p):
    gas, sz = gas_sizing
    return material_assessment(gas, sz, p)


def test_presentation_stage_table(gas_sizing):
    r = _run(gas_sizing, _project())
    rows = {x["location"]: x for x in r["conditions"]}
    s1 = rows["St1"]
    assert s1["ph2s_bar"] == pytest.approx(0.817, abs=0.002) and s1["pco2_bar"] == pytest.approx(0.136, abs=0.001)
    assert s1["ph"] == pytest.approx(3.91, abs=0.15) and s1["domain"] == "D3"
    assert [rows[f"St{i}"]["moisture"] for i in range(1, 7)] == ["WET"] + ["DRY"] * 5
    assert all(rows[f"St{i}"]["domain"] == "D3" for i in range(1, 7))
    assert s1["cumulative_loss_mm"] == pytest.approx(s1["cr_mm_y"] * 20)
    assert rows["SOP saturation"]["T_c"] == pytest.approx(50.6, abs=0.5) and rows["SOP saturation"]["wet"]
    sop = r["sop"]
    assert sop["trip_setpoint_c"] == pytest.approx(sop["dew_point_c"] + 10) and sop["status"] == "attention"
    ch = r["charts"]
    assert len(ch["dew_point"]["saturation"]) == 101 and {g["domain"] for g in ch["ssc"]["regions"]} == {"D0", "D1", "D2", "D3"}
    json.dumps(jsonable(r))


def test_auto_selection_reproduces_presentation(gas_sizing):
    r = _run(gas_sizing, _project())
    sel = {s["component"]: s for s in r["selection"]}
    for comp, (mat, overlay) in PRESENTATION.items():
        assert (sel[comp]["proposed"], sel[comp]["overlay"]) == (mat, overlay), comp
    assert all(s["mdmt_ok"] for s in sel.values()) and sel["Shaft"]["mdmt_c"] == -29 and sel["Casing"]["mdmt_c"] == -46
    assert sel["Shaft"]["max_hrc"] == 22
    assert r["weld_overlay"]["required"] and set(r["weld_overlay"]["components"]) == {"Casing", "Inlet cover"}
    # Default records from the selection: all corrosion-acceptable, but never pass on name alone.
    assert all(c["acceptance"] == "pass" for c in r["components"])
    assert all(c["status"] == "evidence" for c in r["components"])


def test_corrosion_acceptance_criteria():
    crit = MaterialAssessment().acceptance_criteria
    assert corrosion_acceptance("impeller", 0.07, 1.4, crit, 8.0)["pass"]
    assert not corrosion_acceptance("impeller", 0.08, 1.4, crit, 8.0)["pass"]
    assert corrosion_acceptance("impeller", 0.1, 2.0, crit, 12.0)["limit_cr"] == 0.125
    assert not corrosion_acceptance("shaft", 0.04, 1.2, crit)["pass"]
    assert corrosion_acceptance("casing", 0.2, 4.0, crit)["pass"]
    assert corrosion_acceptance("diaphragm", 0.15, 3.0, crit)["limit_total"] == 3.0


def test_bare_carbon_steel_fails_wet_acceptance(gas_sizing):
    p = _project()
    from compsuite.core.model import MaterialRecord
    p.material_assessment.records = [MaterialRecord(component="Inlet cover", material="ASTM A350 LF2", corrosion_allowance_mm=10)]
    c = _run(gas_sizing, p)["components"][0]
    assert c["acceptance"] == "fail" and c["status"] == "outside" and c["cr_mm_y"] > 0.2


def test_o2_doubles_carbon_steel_rate(gas_sizing):
    base = _run(gas_sizing, _project())["conditions"][0]
    o2 = _run(gas_sizing, _project(o2_ingress_ppmv=69.0))
    row = o2["conditions"][0]
    assert row["cr_mm_y"] == pytest.approx(2 * base["cr_mm_y"]) and row["o2_factor"] == 2
    items = {c["item"]: c for c in o2["contaminants"]}
    assert items["O2 ingress"]["status"] == "attention" and "Elemental sulfur (O2 + H2S)" in items


def test_ssc_domains_editable():
    from compsuite.core.model import SSCDomains, SSCPoint
    d = SSCDomains(d2_d3=[SSCPoint(ph2s_bar=0.003, ph=3.0), SSCPoint(ph2s_bar=100, ph=3.0)])
    assert ssc_domain(1.0, 3.5) == "D3" and ssc_domain(1.0, 3.5, d) == "D2"


def test_material_report_pdf(gas_sizing):
    from compsuite.materials.report import material_selection_report
    p = _project(mercury_ng_nm3=0.5, chloride_entrainment_ppmv=8, chloride_saturation_ppmv=368)
    pdf = material_selection_report(p, {"material_assessment": _run(gas_sizing, p)})
    assert pdf.startswith(b"%PDF")


def test_old_project_json_loads():
    old = {"material_assessment": {"water_content_ppmv": 300, "mdmt_c": -29, "records": [
        {"component": "Shaft", "material": "AISI 4140 Q&T"}]}}
    p = Project.model_validate(old)
    assert p.material_assessment.mdmt_c == -29 and p.material_assessment.dew_margin_c == 10
    assert "StageOverride" in json.dumps(Project.model_json_schema())
