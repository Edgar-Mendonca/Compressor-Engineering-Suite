"""Shared engineering data model.

One ``Project`` holds every input. Modules read the parts they need and the
workflow passes results downstream, so a change to any input propagates to
every dependent calculation on the next run. Fields left as ``None`` are
estimated by the relevant module and the estimate is reported.

Units are carried in field names (bara, degC, mm, kg, rpm ...).
"""

from __future__ import annotations

from typing import Literal, Optional

from pydantic import BaseModel, Field


FlowUnit = Literal["kg/s", "kg/h", "Am3/h", "Nm3/h", "Sm3/h", "MMSCFD"]


class GasComposition(BaseModel):
    components: dict[str, float] = Field(
        default_factory=lambda: {"CH4": 85.0, "C2H6": 6.0, "C3H8": 3.0, "iC4H10": 0.6, "nC4H10": 0.9,
                                 "nC5H12": 0.3, "N2": 1.2, "CO2": 2.5, "H2S": 0.5},
        description="Mole fractions or percentages (normalised internally)")
    backend: Literal["pr", "coolprop"] = "pr"


class OperatingCase(BaseModel):
    name: str = "Rated"
    is_design: bool = False
    suction_pressure_bara: float = 30.0
    suction_temperature_c: float = 35.0
    discharge_pressure_bara: float = 90.0
    flow_value: float = 60.0
    flow_unit: FlowUnit = "kg/s"
    polytropic_efficiency: Optional[float] = Field(None, description="None = estimated from the stage design")
    measured_discharge_temperature_c: Optional[float] = Field(None, description="Test/plant data: back-calculate efficiency")


class DesignBasis(BaseModel):
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


class BearingDesign(BaseModel):
    journal_type: Literal["tilting_pad", "plain_cylindrical", "user"] = "tilting_pad"
    length_to_diameter: float = 0.4
    radial_clearance_ratio: float = Field(0.0018, description="Radial clearance / journal radius")
    pads: int = 5
    preload: float = Field(0.20, description="Tilting-pad preload m = 1 - Cb/Cp")
    pivot_offset: float = Field(0.5, description="Pivot location as a fraction of pad arc")
    load_between_pads: bool = True
    oil_grade: Literal["ISO VG 32", "ISO VG 46", "ISO VG 68"] = "ISO VG 32"
    oil_supply_temperature_c: float = 50.0
    oil_temperature_rise_c: float = 17.0
    user_coefficients: Optional[BearingCoefficients] = None
    thrust_allowable_unit_load_mpa: float = 2.4
    thrust_target_residual_kn: float = 10.0


class SealDesign(BaseModel):
    shaft_end_seal: Literal["dry_gas_tandem", "dry_gas_double", "oil_film", "labyrinth"] = "dry_gas_tandem"
    labyrinth_teeth: int = 8
    labyrinth_clearance_mm: Optional[float] = Field(None, description="Radial; None = (0.0025 x D + 0.1 mm) / 2")
    labyrinth_pitch_mm: float = 4.0
    balance_piston_teeth: int = 20
    seal_vent_pressure_bara: float = 1.3
    dgs_reference_leakage_nm3_h: float = Field(5.0, description="Vendor leakage at reference pressure (per seal)")
    dgs_reference_pressure_bara: float = 50.0
    seal_gas_superheat_margin_c: float = Field(20.0, description="Required margin above dew point (API 692 practice)")
    seal_cross_coupling_n_m: float = Field(0.0, description="User-supplied total seal cross-coupling (if known)")


class TrainDesign(BaseModel):
    driver_inertia_kgm2: Optional[float] = None
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


class MaterialAssessment(BaseModel):
    water_content_ppmv: float = Field(500.0, description="Used when H2O is not in the gas composition")
    liquid_water_assumed: bool = Field(False, description="Treat every location as wet (conservative)")
    measured_ph: Optional[float] = Field(None, description="None = estimated condensed-water pH")
    chloride_ppm: Optional[float] = None
    mdmt_c: float = -29.0
    service_life_years: float = 25.0
    sop_pressure_bara: Optional[float] = Field(None, description="Settle-out pressure; None = estimated")
    sop_temperature_c: float = 15.0
    sop_exposure_fraction: float = Field(0.05, description="Share of service life spent at settle-out (corrosion)")
    records: list[MaterialRecord] = Field(default_factory=list, description="Empty = defaults from the selected materials")


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

    def design_case(self) -> OperatingCase:
        for c in self.cases:
            if c.is_design:
                return c
        return self.cases[0]
