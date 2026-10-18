"""Example projects for the start page gallery.

Each example is a complete, runnable project. The compositions and duties are
generic illustrations, not data from any real installation.
"""

from __future__ import annotations

from compsuite.core.model import GasComposition, OperatingCase, Project


def export_gas() -> Project:
    """Reference case: VFD induction motor (4-pole, about 74 Hz at rated speed) + parallel-shaft gearbox + compressor,
    tilting-pad bearings with min/max clearance cases, swirl-braked balance piston."""
    p = Project()
    p.cases[2].flow_value = 44.0  # turndown kept above the surge-margin limit (recycle handles lower flows)
    p.design_basis.driver_type = "vfd_motor"
    p.shaft.impeller_material = "Alloy 718"  # 17-4PH H1150 is above yield at MCS for 277 m/s tip speed
    t = p.train
    t.motor_poles, t.pinion_teeth, t.bull_gear_teeth = 4, 26, 177  # ratio 6.81
    t.gear_module_mm, t.gear_pressure_angle_deg, t.gear_helix_angle_deg = 6.5, 22.5, 25.0
    t.gear_ratio = 177 / 26
    b = p.bearings
    b.oil_grade, b.oil_supply_temperature_c, b.preload, b.length_to_diameter = "ISO VG 46", 50.0, 0.45, 0.3
    p.seals.swirl_brakes, p.seals.balance_piston_swirl_brake = True, True  # swirl brakes on eye seals and piston
    return p


def sour_reinjection() -> Project:
    p = Project(
        name="Example sour gas reinjection compressor",
        description="Low-pressure sour gas (30 % H2S, 5 % CO2, water saturated) compressed for reinjection; "
                    "wet first stage, dry downstream stages",
        gas=GasComposition(components={"CH4": 57.5, "C2H6": 3.5, "C3H8": 1.2, "N2": 1.9, "CO2": 5.0, "H2S": 30.0, "H2O": 0.9}),
        cases=[
            OperatingCase(name="Rated", is_design=True, suction_pressure_bara=2.72, suction_temperature_c=28.1,
                          discharge_pressure_bara=20.0, flow_value=6.0),
            OperatingCase(name="Normal", suction_pressure_bara=2.72, suction_temperature_c=28.1,
                          discharge_pressure_bara=19.0, flow_value=5.4),
            OperatingCase(name="Hot day", suction_pressure_bara=2.6, suction_temperature_c=45.0,
                          discharge_pressure_bara=20.0, flow_value=5.0),
        ],
    )
    # Heavy, wet sour gas: lower tip speed and Mach limits keep inlet Mach and impeller stress acceptable.
    p.design_basis.max_tip_speed_m_s = 225.0
    p.design_basis.max_machine_mach = 0.8
    p.design_basis.min_operating_speed_pct = 80.0  # reinjection: narrow speed range keeps the 1st critical clear
    p.seals.balance_piston_teeth = 24  # longer piston keeps leakage under 3 % at the higher casing-2 pressure ratio
    p.design_basis.max_impellers_per_casing = 5  # keeps bearing span / shaft diameter near 11
    return p


def blank(name: str = "New compressor project") -> Project:
    """Starting point for a new project: one case, a simple sweet gas, example design limits."""
    return Project(name=name, description="",
                   gas=GasComposition(components={"CH4": 90.0, "C2H6": 5.0, "C3H8": 2.0, "N2": 1.5, "CO2": 1.5}),
                   cases=[OperatingCase(name="Rated", is_design=True)])


EXAMPLES = {
    "export_gas": {"title": "Export gas compressor", "build": export_gas,
                   "summary": "Sweet natural gas, 30 → 90 bara, VFD motor drive. The reference case for every module.",
                   "tags": ["Natural gas", "Single casing", "VFD"]},
    "sour_reinjection": {"title": "Sour gas reinjection compressor", "build": sour_reinjection,
                         "summary": "30 % H2S, 5 % CO2, water saturated, 2.7 → 20 bara. Wet first stage: material "
                                    "assessment, SSC domains and corrosion allowance.",
                         "tags": ["Sour service", "Materials", "Low pressure"]},
}


def catalogue() -> list[dict]:
    return [{"id": k, **{f: v[f] for f in ("title", "summary", "tags")}} for k, v in EXAMPLES.items()]
