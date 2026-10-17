"""Example projects for the start page gallery.

Each example is a complete, runnable project. The compositions and duties are
generic illustrations, not data from any real installation.
"""

from __future__ import annotations

from compsuite.core.model import GasComposition, OperatingCase, Project


def export_gas() -> Project:
    return Project()


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
    p.design_basis.max_tip_speed_m_s = 240.0
    p.design_basis.max_machine_mach = 0.8
    p.design_basis.max_impellers_per_casing = 6
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
