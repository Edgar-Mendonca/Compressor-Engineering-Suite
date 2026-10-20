"""Shared engineering data model.

One ``Project`` holds every input. Modules read the parts they need and the
workflow passes results downstream, so a change to any input propagates to
every dependent calculation on the next run. Fields left as ``None`` are
estimated by the relevant module and the estimate is reported.

Units are carried in field names (bara, degC, mm, kg, rpm ...).
"""

from __future__ import annotations

from typing import Any, Literal, Optional

from pydantic import BaseModel, Field, model_validator


class Checked(BaseModel):
    """Physical limits per field ({name: (low, high, meaning)}); a value outside them is rejected with a clear message."""
    _LIMITS: dict = {}

    @model_validator(mode="after")
    def _limits(self):
        bad = []
        for k, (lo, hi, what) in self._LIMITS.items():
            v = getattr(self, k, None)
            if v is not None and not (lo <= v <= hi):
                bad.append(f"{k} = {v} is outside {lo} to {hi} ({what})")
        if bad:
            raise ValueError("; ".join(bad))
        return self


FlowUnit = Literal["kg/s", "kg/h", "Am3/h", "Nm3/h", "Sm3/h", "MMSCFD"]


class GasComposition(BaseModel):
    components: dict[str, float] = Field(
        default_factory=lambda: {"CH4": 85.0, "C2H6": 6.0, "C3H8": 3.0, "iC4H10": 0.6, "nC4H10": 0.9,
                                 "nC5H12": 0.3, "N2": 1.2, "CO2": 2.5, "H2S": 0.5},
        description="Mole fractions or percentages (normalised internally)")
    backend: Literal["pr", "coolprop"] = "pr"


class OperatingCase(Checked):
    _LIMITS = {"suction_pressure_bara": (0.05, 1000, "absolute pressure, bara"), "suction_temperature_c": (-200, 400, "deg C"),
                "discharge_pressure_bara": (0.06, 1500, "absolute pressure, bara"), "flow_value": (1e-6, 1e8, "must be positive"),
                "polytropic_efficiency": (0.3, 0.98, "fraction, not %")}

    name: str = "Rated"
    is_design: bool = False
    suction_pressure_bara: float = 30.0
    suction_temperature_c: float = 35.0
    discharge_pressure_bara: float = 90.0
    flow_value: float = 60.0
    flow_unit: FlowUnit = "kg/s"
    polytropic_efficiency: Optional[float] = Field(None, description="None = estimated from the stage design")
    measured_discharge_temperature_c: Optional[float] = Field(None, description="Test/plant data: back-calculate efficiency")


    @model_validator(mode="after")
    def _pressures(self):
        if self.discharge_pressure_bara <= self.suction_pressure_bara:
            raise ValueError(f"discharge pressure {self.discharge_pressure_bara} bara must be above suction pressure {self.suction_pressure_bara} bara")
        return self

class DesignBasis(Checked):
    _LIMITS = {"max_tip_speed_m_s": (50, 600, "m/s"), "max_machine_mach": (0.2, 1.6, "-"), "head_coefficient": (0.2, 0.8, "psi"),
                "first_stage_flow_coefficient": (0.005, 0.2, "phi"), "max_impellers_per_casing": (1, 12, "-"), "mechanical_loss_fraction": (0, 0.2, "fraction"),
                "driver_rating_margin": (1.0, 2.0, "factor"), "min_operating_speed_pct": (10, 100, "%"), "max_continuous_speed_pct": (90, 130, "%"),
                "trip_speed_pct": (95, 140, "%"), "speed_rpm_override": (100, 100000, "rpm"), "impeller_diameter_mm_override": (50, 3000, "mm")}

    driver_type: Literal["vfd_motor", "fixed_speed_motor_gearbox", "steam_turbine", "gas_turbine"] = "vfd_motor"
    max_tip_speed_m_s: float = 300.0
    max_machine_mach: float = 0.95
    head_coefficient: float = Field(0.50, description="Polytropic head coefficient psi = Hp / U2^2")
    first_stage_flow_coefficient: float = Field(0.09, description="phi = Q / (pi/4 D2^2 U2)")
    max_impellers_per_casing: int = 9
    max_discharge_temperature_c: float = 175.0
    intercooler_outlet_temperature_c: float = 40.0
    intercooler_pressure_drop_bar: float = 0.5
    mechanical_loss_fraction: float = 0.015
    driver_rating_margin: float = 1.10
    min_operating_speed_pct: float = 70.0
    max_continuous_speed_pct: float = 105.0
    trip_speed_pct: float = 110.0
    speed_rpm_override: Optional[float] = None
    stages_override: Optional[int] = None
    impeller_diameter_mm_override: Optional[float] = None


class ShaftSection(BaseModel):
    label: str = ""
    length_mm: float
    od_mm: float
    id_mm: float = 0.0


class AttachedMass(BaseModel):
    label: str
    kind: Literal["impeller", "coupling", "thrust_collar", "balance_piston", "sleeve", "other"] = "other"
    position_mm: float
    mass_kg: float
    ip_kgm2: float
    it_kgm2: float


class ShaftDesign(BaseModel):
    material: str = "AISI 4140 Q&T"
    impeller_material: str = "17-4PH H1150"
    shaft_diameter_at_impellers_mm: Optional[float] = None
    journal_diameter_mm: Optional[float] = None
    coupling_overhang_mm: float = 260.0
    fillet_radius_ratio: float = Field(0.06, description="Shoulder fillet radius / smaller diameter")
    surface_finish: Literal["ground", "machined", "hot_rolled", "forged"] = "machined"
    reliability: float = 0.99
    torque_transient_factor: float = Field(1.5, description="Peak / rated torque for yield check")
    sections_override: Optional[list[ShaftSection]] = None
    masses_override: Optional[list[AttachedMass]] = None
    bearing_positions_mm_override: Optional[list[float]] = None


class BearingCoefficients(BaseModel):
    kxx: float = 2e8
    kxy: float = 0.0
    kyx: float = 0.0
    kyy: float = 2e8
    cxx: float = 2e5
    cxy: float = 0.0
    cyx: float = 0.0
    cyy: float = 2e5


class BearingDesign(Checked):
    _LIMITS = {"length_to_diameter": (0.1, 2.0, "L/D"), "radial_clearance_ratio": (0.0003, 0.006, "Cr / R"), "pads": (2, 12, "-"),
                "preload": (0.0, 0.9, "m"), "pivot_offset": (0.3, 0.8, "fraction of arc"), "oil_supply_temperature_c": (10, 90, "deg C")}

    journal_type: Literal["tilting_pad", "plain_cylindrical", "user"] = "tilting_pad"
    length_to_diameter: float = 0.4
    radial_clearance_ratio: float = Field(0.0018, description="Radial clearance / journal radius")
    pads: int = 5
    preload: float = Field(0.20, description="Tilting-pad preload m = 1 - Cb/Cp")
    pivot_offset: float = Field(0.5, description="Pivot location as a fraction of pad arc")
    pivot_stiffness_n_m: Optional[float] = Field(None, description="Pivot stiffness per pad (series with film); blank = rigid")
    clearance_tolerance_fraction: float = Field(0.11, description="Bearing clearance range +/- fraction (min/max cases)")
    oil_supply_tolerance_c: float = Field(5.0, description="Oil supply temperature range +/- (min/max cases)")
    load_between_pads: bool = True
    oil_grade: Literal["ISO VG 32", "ISO VG 46", "ISO VG 68"] = "ISO VG 32"
    oil_supply_temperature_c: float = 50.0
    oil_temperature_rise_c: float = 17.0
    user_coefficients: Optional[BearingCoefficients] = None
    thrust_allowable_unit_load_mpa: float = 2.4
    thrust_target_residual_kn: float = 10.0
    lateral_cases: Literal["min_avg_max", "all"] = Field("min_avg_max", description="Bearing cases: min / average / max clearance with min / nominal / max oil "
                                                         "inlet temperature; 'all' adds min clearance + max oil and max clearance + min oil")
    support_stiffness_n_m: float = Field(0.0, description="Bearing support (pedestal / casing) stiffness in series with the oil film; 0 = rigid")
    support_damping_n_s_m: float = 0.0
    include_seals_in_lateral: bool = Field(True, description="Labyrinth / balance-drum seal stiffness and damping in the lateral response model")
    bearing_make_model: str = ""
    rotor_weight_drawing_kg: Optional[float] = Field(None, description="Rotor weight from the rotor assembly drawing (consistency check)")


class SealDesign(Checked):
    _LIMITS = {"labyrinth_teeth": (1, 60, "-"), "balance_piston_teeth": (1, 80, "-"), "pre_swirl_ratio": (0.0, 1.0, "-")}

    shaft_end_seal: Literal["dry_gas_tandem", "dry_gas_double", "oil_film", "labyrinth"] = "dry_gas_tandem"
    labyrinth_teeth: int = 8
    labyrinth_clearance_mm: Optional[float] = Field(None, description="Radial; None = (0.0025 x D + 0.1 mm) / 2")
    labyrinth_pitch_mm: float = 4.0
    balance_piston_teeth: int = 20
    seal_vent_pressure_bara: float = 1.3
    dgs_reference_leakage_nm3_h: float = Field(5.0, description="Vendor leakage at reference pressure (per seal)")
    dgs_reference_pressure_bara: float = 50.0
    seal_gas_superheat_margin_c: float = Field(20.0, description="Required margin above dew point (API 692 practice)")
    pre_swirl_ratio: float = Field(0.5, description="Labyrinth inlet swirl ratio (stability Level II)")
    swirl_brakes: bool = Field(False, description="Eye seals fitted with swirl brakes (pre-swirl 0)")
    balance_piston_swirl_brake: bool = True
    labyrinth_clearance_tolerance_mm: float = Field(0.1, description="Seal clearance range (min/max cases)")
    labyrinth_tooth_height_mm: float = 3.5
    gas_viscosity_pa_s: float = 1.3e-5
    seal_cross_coupling_n_m: float = Field(0.0, description="User-supplied total seal cross-coupling (if known)")


class TorsionalElement(BaseModel):
    """One torsional shaft element (vendor station table row); added inertia acts at its start station."""
    length_mm: float
    od_mm: float = Field(..., description="Stiffness outside diameter")
    id_mm: float = 0.0
    od_mass_mm: Optional[float] = Field(None, description="Mass outside diameter (default = stiffness OD)")
    id_mass_mm: Optional[float] = None
    added_ip_kgm2: float = 0.0
    core: bool = Field(False, description="Start station is part of the motor core (electrical torque)")
    mesh: bool = Field(False, description="Start station is the gear mesh point")
    label: str = ""


class TorsionalCoupling(BaseModel):
    ip_kgm2: Optional[float] = None
    stiffness_nm_rad: Optional[float] = None
    max_transient_torque_nm: Optional[float] = Field(None, description="Default 5 x rated torque")
    allowable_alternating_torque_nm: Optional[float] = Field(None, description="API 671 Goodman endurance intercept; default 0.15 x max transient")


class ShortCircuitTerm(BaseModel):
    """M(t) term Mk exp(-alpha t) sin(omega t + phi); Mk as multiple of rated torque unless mk_knm is set."""
    mk_pu: float = 0.0
    mk_knm: Optional[float] = None
    alpha_1_s: float = 20.0
    omega_x_line: float = Field(0.0, description="omega as multiple of 2 pi x line frequency")
    omega_rad_s: Optional[float] = None
    phase_rad: float = 0.0


def _sc3() -> list:
    return [ShortCircuitTerm(mk_pu=-0.5, alpha_1_s=18.0, omega_x_line=0.0, phase_rad=1.5708),
            ShortCircuitTerm(mk_pu=-8.0, alpha_1_s=21.0, omega_x_line=1.0, phase_rad=0.0)]


def _sc2() -> list:
    return [ShortCircuitTerm(mk_pu=0.1, alpha_1_s=1000.0, omega_x_line=0.0, phase_rad=1.5708),
            ShortCircuitTerm(mk_pu=-7.0, alpha_1_s=22.0, omega_x_line=1.0, phase_rad=0.0),
            ShortCircuitTerm(mk_pu=4.5, alpha_1_s=12.0, omega_x_line=2.0, phase_rad=0.0)]


def _vfd_harmonics() -> dict:
    # Generic illustration of a multi-level drive; replace with the drive vendor's table.
    return {5: 1.2, 7: 0.8, 11: 0.6, 13: 0.5, 17: 0.3, 19: 0.3, 23: 0.2, 25: 0.2, 29: 0.1, 31: 0.1, 35: 0.1, 37: 0.1,
            41: 0.1, 43: 0.1, 47: 0.05, 49: 0.05}


class TrainDesign(BaseModel):
    driver_inertia_kgm2: Optional[float] = None
    coupling_type: Literal["disc", "diaphragm", "gear"] = Field("disc", description="Gear couplings transmit friction thrust")
    coupling_torsional_stiffness_nm_rad: Optional[float] = None
    coupling_inertia_kgm2: Optional[float] = None
    gear_ratio: float = Field(1.0, description="Compressor speed / driver speed (1 = direct drive)")
    gear_inertia_low_kgm2: float = 5.0
    gear_inertia_high_kgm2: float = 0.5
    gear_mesh_stiffness_nm_rad: float = 5e7
    line_frequency_hz: float = 50.0
    motor_poles: int = 2
    modal_damping_ratio: float = 0.02
    synchronous_motor_startup: bool = False
    # --- API 617 / 684 / 671 torsional report inputs (all optional, estimated when absent) ---
    motor_rated_power_kw: Optional[float] = Field(None, description="Rated torque M = 9549 P / N (default: driver rating)")
    pinion_teeth: Optional[int] = None
    bull_gear_teeth: Optional[int] = None
    gear_module_mm: Optional[float] = None
    gear_pressure_angle_deg: float = 20.0
    gear_helix_angle_deg: float = 10.0
    gear_face_width_mm: Optional[float] = None
    gear_mesh_stiffness_n_mm: Optional[float] = Field(None, description="Default 20 N/(mm um) x face width (ISO 6336 c_gamma)")
    ls_coupling: Optional[TorsionalCoupling] = Field(None, description="Driver - bull gear coupling (geared trains)")
    hs_coupling: Optional[TorsionalCoupling] = Field(None, description="Coupling at the compressor")
    coupling_penetration_factor: float = Field(1 / 3, description="API 671 shaft penetration into hubs for estimated couplings")
    motor_elements: Optional[list[TorsionalElement]] = None
    bull_gear_elements: Optional[list[TorsionalElement]] = None
    pinion_elements: Optional[list[TorsionalElement]] = None
    driveline_shaft_yield_mpa: Optional[float] = Field(None, description="Motor / gear shaft material (default compressor shaft)")
    driveline_shaft_uts_mpa: Optional[float] = None
    torsional_modes: int = 12
    steady_state_damping_ratio: float = 0.01
    steady_excitation_pct: float = Field(1.0, description="Exciting torque, % of rated torque")
    shaft_surface_factor: float = 0.8
    shaft_size_factor: float = 0.75
    shaft_stress_concentration: float = 2.0
    shaft_fatigue_safety: float = 2.0
    transient_yield_fraction: float = Field(0.7, description="Transient allowable shear = f Sy / sqrt(3)")
    coupling_goodman_mean_factor: float = Field(1.1, description="Mean torque on the coupling Goodman diagram / rated torque")
    coupling_min_safety: float = 1.25
    breaker_clearing_time_s: Optional[float] = Field(None, description="Protection (breaker) clearing time: short-circuit torque removed after it")
    short_circuit_events: int = Field(1000, description="Short-circuit / start events over the life for the cumulative fatigue (Miner) check")
    danger_strain_energy_share: float = Field(0.10, description="Exciting shaft line share of modal strain energy that makes a resonance dangerous")
    vfd_harmonics_pct: dict[int, float] = Field(default_factory=_vfd_harmonics, description="Torque harmonic content, % of rated, by order of motor electrical frequency")
    vfd_acceleration_time_s: float = 60.0
    short_circuit_analysis: bool = True
    short_circuit_3ph: list[ShortCircuitTerm] = Field(default_factory=_sc3)
    short_circuit_2ph: list[ShortCircuitTerm] = Field(default_factory=_sc2)
    short_circuit_duration_s: float = 1.0


class LubeDesign(BaseModel):
    pump_margin: float = Field(1.15, description="Rated pump flow / normal required flow")
    supply_pressure_barg: float = 1.5
    pump_discharge_pressure_barg: float = 10.0
    pump_efficiency: float = 0.70
    cooling_water_inlet_c: float = 32.0
    cooling_water_rise_c: float = 8.0
    cooler_u_w_m2k: float = 350.0
    reservoir_retention_min: float = 8.0
    filter_pressure_drop_bar: float = 0.5
    control_oil_allowance_l_min: float = 0.0


class PipingDesign(BaseModel):
    suction_length_m: float = 40.0
    discharge_length_m: float = 60.0
    suction_fittings_k: float = 6.0
    discharge_fittings_k: float = 8.0
    roughness_mm: float = 0.045
    suction_velocity_limit_m_s: float = 20.0
    discharge_velocity_limit_m_s: float = 25.0
    rho_v2_limit_pa: float = 15000.0
    recycle_valve_xt: float = 0.7
    recycle_valve_fl: float = 0.9
    orifice_beta: float = 0.6
    system_static_pressure_fraction: float = Field(0.6, description="Share of rated head that is static (no flow)")


class Criteria(BaseModel):
    """Acceptance criteria. Values reflect common API 617 practice but MUST be
    checked against the licensed edition named here before relying on them."""
    edition: str = "API 617 8th ed. (2014) - criteria to be verified by user"
    lateral_logdec_min: float = 0.1
    lateral_logdec_level2_min: Optional[float] = Field(None, description="Level II log dec limit; 0.2 for Shell DEP, blank = API")
    unbalance_ua_over_ur: float = 2.0
    unbalance_g_mm_factor: float = Field(6350.0, description="Ub = factor x W / N (W kg, N rpm)")
    unbalance_multiplier: float = 4.0
    amplitude_limit_um_cap: float = 25.4
    clearance_ratio_limit: float = 0.75
    torsional_separation_margin: float = 0.10
    impeller_yield_fraction: float = 0.8
    shaft_fatigue_safety_min: float = 1.5
    shaft_yield_safety_min: float = 1.5
    bearing_min_film_um: float = 15.0
    bearing_max_babbitt_c: float = 110.0
    bearing_max_unit_load_mpa: float = 2.8
    surge_margin_min: float = Field(0.10, description="Minimum surge margin at each operating case (flow fraction)")
    impeller_burst_margin_min: float = 1.3
    seal_balance_piston_leakage_max_pct: float = 3.0


class MaterialRecord(BaseModel):
    """Documented service limits for one component's wetted material (None = not recorded)."""
    component: str
    material: str
    wetted_surface: str = ""
    evidence_reference: str = ""
    verified: bool = False
    component_class: Optional[Literal["casing", "diaphragm", "impeller", "shaft"]] = Field(
        None, description="Corrosion acceptance class; None = from the component name")
    overlay: Optional[str] = Field(None, description="Weld overlay alloy on the wetted surface (e.g. Alloy 625)")
    min_temp_c: Optional[float] = None
    max_temp_c: Optional[float] = None
    max_hardness_hrc: Optional[float] = None
    measured_hardness_hrc: Optional[float] = None
    max_wet_ph2s_bar: Optional[float] = None
    max_dry_ph2s_bar: Optional[float] = None
    max_pco2_bar: Optional[float] = None
    min_ph: Optional[float] = None
    max_chloride_ppm: Optional[float] = None
    corrosion_allowance_mm: float = 3.0
    corrosion_resistant: bool = False


class StageOverride(BaseModel):
    """Service condition at one location. Matches a computed location by name (e.g. "Suction", "Stage 2",
    "SOP design"); other names are added as new locations. None = keep the computed value."""
    location: str
    P_bara: Optional[float] = None
    T_c: Optional[float] = None
    h2o_pct: Optional[float] = Field(None, description="Water, mol %")
    co2_pct: Optional[float] = Field(None, description="CO2, mol %")
    h2s_pct: Optional[float] = Field(None, description="H2S, mol %")
    ph: Optional[float] = Field(None, description="Measured / vendor pH")
    cr_mm_y: Optional[float] = Field(None, description="Vendor carbon-steel corrosion rate")


class CorrosionCriterion(BaseModel):
    """Allowed corrosion rate and total loss for one component class (impellers by blade thickness)."""
    component_class: Literal["casing", "diaphragm", "impeller", "shaft"]
    blade_min_mm: Optional[float] = Field(None, description="Impellers: blade thickness > this")
    blade_max_mm: Optional[float] = Field(None, description="Impellers: blade thickness <= this")
    max_cr_mm_y: float
    max_total_mm: float


def _default_criteria() -> list[CorrosionCriterion]:
    C = CorrosionCriterion
    return [C(component_class="impeller", blade_min_mm=4, blade_max_mm=6, max_cr_mm_y=0.05, max_total_mm=1.0),
            C(component_class="impeller", blade_min_mm=6, blade_max_mm=10, max_cr_mm_y=0.075, max_total_mm=1.5),
            C(component_class="impeller", blade_min_mm=10, max_cr_mm_y=0.125, max_total_mm=2.5),
            C(component_class="shaft", max_cr_mm_y=0.05, max_total_mm=1.0),
            C(component_class="diaphragm", max_cr_mm_y=0.15, max_total_mm=3.0),
            C(component_class="casing", max_cr_mm_y=0.2, max_total_mm=4.0)]


class SSCPoint(BaseModel):
    ph2s_bar: float
    ph: float


class SSCDomains(BaseModel):
    """Severity-domain boundaries in the pH2S-pH plane (straight lines in log pH2S). Defaults are
    illustrative of the ISO 15156-2 Figure 1 shape, NOT the standard's values: enter them from the licensed copy."""
    sour_threshold_bar: float = Field(0.003, description="Domain 0 below this pH2S")
    d1_d2: list[SSCPoint] = Field(default_factory=lambda: [SSCPoint(ph2s_bar=0.003, ph=4.0), SSCPoint(ph2s_bar=0.949, ph=6.5),
                                                           SSCPoint(ph2s_bar=100, ph=6.5)])
    d2_d3: list[SSCPoint] = Field(default_factory=lambda: [SSCPoint(ph2s_bar=0.003, ph=3.5), SSCPoint(ph2s_bar=0.01, ph=3.5),
                                                           SSCPoint(ph2s_bar=1.0, ph=5.5), SSCPoint(ph2s_bar=100, ph=5.5)])


class WeldOverlay(BaseModel):
    enabled: Literal["auto", "yes", "no"] = Field("auto", description="auto = where the selection requires it")
    alloy: str = "IN625"
    min_undiluted_mm: float = Field(3.0, description="Minimum thickness with undiluted alloy chemistry")
    max_fe_dilution_pct: float = Field(7.0, description="Fe at 1 mm below the overlay surface (alloy 625: 5-7 % max)")
    measured_undiluted_mm: Optional[float] = None
    measured_fe_dilution_pct: Optional[float] = None


class SOPSettings(BaseModel):
    standstill_hours_max: float = Field(4.0, description="Maximum pressurised standstill at SOP the MOC is suitable for")
    expected_standstill_hours: Optional[float] = None
    tt_margin_c: float = Field(10.0, description="Trip setpoint above the SOP water dew point")
    depressurise_to_psig: float = 5.0
    protected: bool = Field(True, description="Dew-point trip / standstill limit in place: settle-out excluded from component "
                                              "corrosion and wet limits (False = counted with sop_exposure_fraction)")


class Contaminants(BaseModel):
    mercury_ng_nm3: Optional[float] = None
    mercury_limit_ng_nm3: float = 1.0
    chloride_entrainment_ppmv: Optional[float] = Field(None, description="Chloride from liquid carry-over")
    chloride_saturation_ppmv: Optional[float] = Field(None, description="Chloride with saturation water")
    o2_ingress_ppmv: Optional[float] = Field(None, description="Max O2 ingress (e.g. via seal N2)")
    n2_purity_pct: Optional[float] = None
    o2_threshold_ppb: float = Field(50.0, description="API RP 581: CS/LAS corrosion rate doubled above this O2")
    o2_rate_multiplier: float = 2.0
    scrubber_efficiency_pct: Optional[float] = None
    scrubber_min_efficiency_pct: float = Field(99.9, description="Removal of droplets >= 10 um")
    carryover_l_mmscfd: Optional[float] = None
    carryover_max_l_mmscfd: float = 13.4
    max_droplet_um: Optional[float] = None
    max_droplet_limit_um: float = 200.0


class MaterialAssessment(BaseModel):
    water_content_ppmv: float = Field(500.0, description="Used when H2O is not in the gas composition")
    liquid_water_assumed: bool = Field(False, description="Treat every location as wet (conservative)")
    measured_ph: Optional[float] = Field(None, description="None = estimated condensed-water pH")
    chloride_ppm: Optional[float] = None
    mdmt_c: float = Field(-46.0, description="Minimum design metal temperature (pressure parts and internals)")
    shaft_mdmt_c: float = -29.0
    service_life_years: float = Field(25.0, description="Design life for cumulative corrosion loss")
    sop_pressure_bara: Optional[float] = Field(None, description="Settle-out pressure; None = estimated")
    sop_temperature_c: float = 15.0
    sop_exposure_fraction: float = Field(0.05, description="Share of service life spent at settle-out (corrosion)")
    dew_margin_c: float = Field(10.0, description="Wet when T < water dew point + margin")
    corrosion_factor: float = Field(1.0, description="Multiplier on the de Waard-Milliams rate (scale, inhibition, calibration)")
    impeller_blade_thickness_mm: Optional[float] = Field(None, description="None = from impeller results / 6 mm")
    stage_overrides: list[StageOverride] = Field(default_factory=list, description="Empty = conditions from the process results")
    overrides_only: bool = Field(False, description="Use only the override locations (plus SOP rows)")
    acceptance_criteria: list[CorrosionCriterion] = Field(default_factory=_default_criteria)
    ssc_domains: SSCDomains = Field(default_factory=SSCDomains)
    weld_overlay: WeldOverlay = Field(default_factory=WeldOverlay)
    sop: SOPSettings = Field(default_factory=SOPSettings)
    contaminants: Contaminants = Field(default_factory=Contaminants)
    records: list[MaterialRecord] = Field(default_factory=list, description="Empty = defaults from the automatic selection")


class ImpellerVendor(BaseModel):
    """Vendor data for one impeller (1-based number across the train). None = keep the app estimate."""
    impeller: int = 1
    D2_mm: Optional[float] = None
    bore_mm: Optional[float] = None
    b2_mm: Optional[float] = None
    blades: Optional[int] = None
    mass_kg: Optional[float] = None
    cg_mm: Optional[float] = Field(None, description="Axial CG from the impeller back face")
    ip_kgm2: Optional[float] = None
    it_kgm2: Optional[float] = None
    yield_mpa: Optional[float] = None
    uts_mpa: Optional[float] = None
    E_gpa: Optional[float] = None
    poisson: Optional[float] = None
    density_kg_m3: Optional[float] = None
    temperature_c: Optional[float] = Field(None, description="Operating (metal) temperature")
    min_radial_interference_mm: Optional[float] = Field(None, description="Minimum radial shrink-fit interference")


class Project(BaseModel):
    name: str = "Example export gas compressor"
    description: str = "Single-casing centrifugal compressor, preliminary study"
    revision: int = 0
    gas: GasComposition = Field(default_factory=GasComposition)
    cases: list[OperatingCase] = Field(default_factory=lambda: [
        OperatingCase(name="Rated", is_design=True),
        OperatingCase(name="Normal", flow_value=52.0, discharge_pressure_bara=85.0),
        OperatingCase(name="Turndown", flow_value=40.0, suction_pressure_bara=28.0, discharge_pressure_bara=80.0),
    ])
    design_basis: DesignBasis = Field(default_factory=DesignBasis)
    shaft: ShaftDesign = Field(default_factory=ShaftDesign)
    bearings: BearingDesign = Field(default_factory=BearingDesign)
    seals: SealDesign = Field(default_factory=SealDesign)
    train: TrainDesign = Field(default_factory=TrainDesign)
    lube: LubeDesign = Field(default_factory=LubeDesign)
    piping: PipingDesign = Field(default_factory=PipingDesign)
    criteria: Criteria = Field(default_factory=Criteria)
    casing_material: str = "ASTM A350 LF2"
    material_assessment: MaterialAssessment = Field(default_factory=MaterialAssessment)
    impeller_vendor: list[ImpellerVendor] = Field(default_factory=list, description="Optional vendor impeller data (overrides estimates)")
    test_tags: dict[str, Any] = Field(default_factory=dict, description="User instrument tags for the shop test pages and reports (key -> tag or {tag, description})")
    test_doc: dict[str, Any] = Field(default_factory=dict, description="Test report document data: number, revision, client, equipment tag, sign-off names")
    dynamics: dict[str, Any] = Field(default_factory=dict, description="Dynamic simulation set-up: edited network (P&ID) and scenario; empty = built from the design")

    def design_case(self) -> OperatingCase:
        for c in self.cases:
            if c.is_design:
                return c
        return self.cases[0]
