"""Validation of thermodynamics and compression calculations."""

import math

import pytest

from compsuite.compression.process import compress, efficiency_from_discharge, mass_flow, polytropic_path, schultz
from compsuite.core.model import OperatingCase
from compsuite.thermo.backends import coolprop_available, make_gas
from compsuite.thermo.eos import PengRobinson, lee_gonzalez_eakin, water_psat
from compsuite.bearings.journal import oil_kinematic_viscosity_cst

NG = {"CH4": 85, "C2H6": 7, "C3H8": 3, "nC4H10": 1, "nC5H12": 0.5, "N2": 1.5, "CO2": 2}


def test_composition_normalised_and_mw():
    g = PengRobinson({"CH4": 50, "C2H6": 50})
    assert math.isclose(sum(g.x), 1.0)
    assert math.isclose(g.mw(), 0.5 * 16.043 + 0.5 * 30.070, rel_tol=1e-9)


def test_ideal_gas_limit():
    g = PengRobinson({"N2": 1})
    assert abs(g.z(300.0, 1e3) - 1.0) < 1e-4


def test_unknown_component_rejected():
    with pytest.raises(ValueError):
        PengRobinson({"XYZ": 1})


def test_water_saturation_pressure():
    assert math.isclose(water_psat(373.15), 101418.0, rel_tol=2e-3)  # IAPWS-95: 101.418 kPa at 100 degC
    assert math.isclose(water_psat(298.15), 3169.9, rel_tol=2e-3)


@pytest.mark.skipif(not coolprop_available(), reason="CoolProp not installed")
def test_peng_robinson_vs_coolprop_methane():
    import CoolProp.CoolProp as CP
    g = PengRobinson({"CH4": 1})
    for T, P in ((300.0, 50e5), (350.0, 100e5), (280.0, 20e5)):
        assert abs(g.z(T, P) - CP.PropsSI("Z", "T", T, "P", P, "Methane")) < 0.025
    dh = g.h(400, 80e5) - g.h(300, 20e5)
    dh_cp = CP.PropsSI("H", "T", 400, "P", 80e5, "Methane") - CP.PropsSI("H", "T", 300, "P", 20e5, "Methane")
    assert abs(dh - dh_cp) / dh_cp < 0.015


@pytest.mark.skipif(not coolprop_available(), reason="CoolProp not installed")
def test_coolprop_backend_matches_pure_fluid():
    import CoolProp.CoolProp as CP
    g = make_gas({"N2": 1}, "coolprop")
    assert math.isclose(g.density(300, 50e5), CP.PropsSI("D", "T", 300, "P", 50e5, "Nitrogen"), rel_tol=1e-9)


def test_helium_polytropic_ideal_gas_analytical():
    """Ideal monatomic gas with constant cp: T2/T1 = PR^(R/(cp eta))."""
    g = PengRobinson({"He": 1})
    T1, P1, P2, eta = 300.0, 1e5, 3e5, 0.8
    res = polytropic_path(g, T1, P1, P2, eta, steps=60)
    expected = T1 * (P2 / P1) ** (1 / (2.5 * eta))
    assert abs(res["T2"] - expected) < 0.2
    # Polytropic head = eta * cp * (T2 - T1)
    cp = 20.786 / 4.003e-3
    assert math.isclose(res["head"], eta * cp * (res["T2"] - T1), rel_tol=2e-3)


def test_schultz_consistent_with_path_integration():
    g = PengRobinson(NG)
    T1, P1, P2, eta = 308.15, 30e5, 90e5, 0.80
    res = polytropic_path(g, T1, P1, P2, eta)
    sch = schultz(g, T1, P1, res["T2"], P2)
    assert abs(sch["eta_p"] - eta) < 0.005
    assert abs(sch["head"] - res["head"]) / res["head"] < 0.005


def test_efficiency_back_calculation_round_trip():
    g = PengRobinson(NG)
    res = polytropic_path(g, 308.15, 30e5, 90e5, 0.77, steps=20)
    assert abs(efficiency_from_discharge(g, 308.15, 30e5, 90e5, res["T2"]) - 0.77) < 1e-3


def test_compress_energy_balance():
    g = PengRobinson(NG)
    out = compress(g, 308.15, 30e5, 90e5, 50.0, 0.8, 0.01)
    assert math.isclose(out["gas_power_kw"], 50.0 * out["enthalpy_rise_j_kg"] / 1e3)
    assert math.isclose(out["shaft_power_kw"], out["gas_power_kw"] * 1.01)
    assert 0.7 < out["isentropic_efficiency"] < 0.8  # isentropic < polytropic for compression


def test_flow_unit_conversions():
    g = PengRobinson(NG)
    c = OperatingCase(flow_value=3600.0, flow_unit="kg/h")
    assert math.isclose(mass_flow(g, c), 1.0)
    c = OperatingCase(flow_value=1.0, flow_unit="MMSCFD")
    m = mass_flow(g, c)
    rho_std = g.density(288.7056, 101325.0)
    assert math.isclose(m, 1e6 * 0.028316846592 / 86400 * rho_std)


def test_dew_point_and_viscosity_plausible():
    g = PengRobinson(NG)
    dews = g.dew_points(30e5)
    assert dews and 220 < max(dews) < 300  # rich-ish natural gas: hydrocarbon dew point below ambient
    mu = lee_gonzalez_eakin(300.0, g.density(300.0, 50e5), g.mw())
    assert 1.0e-5 < mu < 1.6e-5


def test_oil_viscosity_reproduces_grade_points():
    assert math.isclose(oil_kinematic_viscosity_cst("ISO VG 46", 40), 46.0, rel_tol=1e-9)
    assert math.isclose(oil_kinematic_viscosity_cst("ISO VG 46", 100), 6.8, rel_tol=1e-9)
    assert 14 < oil_kinematic_viscosity_cst("ISO VG 32", 60) < 17  # typical VG 32 data: ~15-16 cSt at 60 degC
