"""Generic instrument tags and glossary for the shop test reports and pages.

Location-based names following API 670 / ISO 20816-1 practice: radial proximity probes in X / Y pairs at
45 deg left and right of top dead centre viewed from the driver, axial probes A / B on the thrust collar,
one keyphasor; process and utility tags use ISA 5.1 first letters (PT pressure, TE temperature,
FT flow, SE speed, JT power). Internal keys (V1-X, TA1, p1 ...) stay fixed; the user can rename any tag
and description in the project (``project.test_tags``) and every page and report follows.
"""

from __future__ import annotations

# key: (tag, description, unit, location, group)
DEFAULT_TAGS: dict[str, tuple[str, str, str, str, str]] = {
    "V1-X": ("DE-X", "Radial shaft vibration, drive end, X probe", "um pk-pk", "DE journal, 45 deg left of TDC", "vibration"),
    "V1-Y": ("DE-Y", "Radial shaft vibration, drive end, Y probe", "um pk-pk", "DE journal, 45 deg right of TDC", "vibration"),
    "V2-X": ("NDE-X", "Radial shaft vibration, non-drive end, X probe", "um pk-pk", "NDE journal, 45 deg left of TDC", "vibration"),
    "V2-Y": ("NDE-Y", "Radial shaft vibration, non-drive end, Y probe", "um pk-pk", "NDE journal, 45 deg right of TDC", "vibration"),
    "V5-Z": ("AX-A", "Axial rotor position, probe A", "um", "Thrust collar, NDE", "vibration"),
    "V6-Z": ("AX-B", "Axial rotor position, probe B", "um", "Thrust collar, NDE", "vibration"),
    "KPH": ("KPH", "Keyphasor, once-per-turn phase reference", "-", "Shaft, DE", "vibration"),
    **{f"TA{i}": (f"TE-DE-{i}", f"Journal bearing metal temperature, drive end, pad {i}", "C", "DE journal bearing", "temperature") for i in (1, 2, 3)},
    **{f"TA{i}": (f"TE-NDE-{i - 3}", f"Journal bearing metal temperature, non-drive end, pad {i - 3}", "C", "NDE journal bearing", "temperature") for i in (4, 5, 6)},
    **{f"TA{i}": (f"TE-TA-{i - 6}", f"Thrust bearing metal temperature, active side, pad {i - 6}", "C", "Thrust bearing, active", "temperature") for i in (7, 8, 9)},
    **{f"TA{i}": (f"TE-TI-{i - 9}", f"Thrust bearing metal temperature, inactive side, pad {i - 9}", "C", "Thrust bearing, inactive", "temperature") for i in (10, 11, 12)},
    "Bearing 1": ("TE-DE", "Journal bearing metal temperature, drive end (max pad)", "C", "DE journal bearing", "temperature"),
    "Bearing 2": ("TE-NDE", "Journal bearing metal temperature, non-drive end (max pad)", "C", "NDE journal bearing", "temperature"),
    "Thrust (active)": ("TE-TA", "Thrust bearing metal temperature, active side (max pad)", "C", "Thrust bearing", "temperature"),
    "TD1": ("TE-DE-DRN", "Lube oil drain temperature, drive end bearing", "C", "DE bearing drain", "lube oil"),
    "TD2": ("TE-NDE-DRN", "Lube oil drain temperature, non-drive end bearing", "C", "NDE bearing drain", "lube oil"),
    "T_oil": ("TE-LO-IN", "Lube oil supply temperature", "C", "Oil header", "lube oil"),
    "P_oil": ("PT-LO-IN", "Lube oil supply pressure", "barg", "Oil header", "lube oil"),
    "SG_DE": ("FT-SG-DE", "Dry gas seal primary vent flow, drive end", "Nm3/h", "DGS panel", "seal gas"),
    "SG_NDE": ("FT-SG-NDE", "Dry gas seal primary vent flow, non-drive end", "Nm3/h", "DGS panel", "seal gas"),
    "SG_P": ("PT-SG", "Seal gas supply pressure", "barg", "DGS panel", "seal gas"),
    "SEP": ("FT-SEP", "Separation gas flow", "Nm3/h", "DGS panel", "seal gas"),
    "N1": ("SE", "Compressor shaft speed", "rpm", "Shaft, keyphasor", "speed"),
    "p1": ("PT-S", "Compressor suction static pressure", "bara", "Suction flange, 4 taps", "process"),
    "t1": ("TE-S", "Compressor suction temperature", "C", "Suction flange, 4 thermowells", "process"),
    "p2": ("PT-D", "Compressor discharge static pressure", "bara", "Discharge flange, 4 taps", "process"),
    "t2": ("TE-D", "Compressor discharge temperature", "C", "Discharge flange, 4 thermowells", "process"),
    "dp": ("dP-FE", "Flow element differential pressure", "kPa", "Orifice FE, corner taps", "process"),
    "pu": ("PT-FE", "Flow element upstream pressure", "bara", "Orifice FE upstream", "process"),
    "tu": ("TE-FE", "Flow element upstream temperature", "C", "Orifice FE upstream", "process"),
    "power": ("JT", "Shaft power (torque meter or driver input)", "kW", "Driver / torque meter", "process"),
    "qloss": ("Q-LOSS", "Casing heat loss", "kW", "Compressor casing", "process"),
    "gas": ("AT-GAS", "Test gas analysis (purity, composition)", "mol %", "Loop sample point", "process"),
    "valve": ("FV-1", "Discharge throttle / control valve opening", "%", "Return line", "process"),
    "asv": ("FV-ASV", "Anti-surge (recycle) valve opening", "%", "Recycle line", "process"),
    "cooler": ("E-1", "Loop gas cooler duty", "kW", "Return line", "process"),
}

GLOSSARY: list[tuple[str, str]] = [
    ("DE / NDE", "Drive end / non-drive end of the compressor"),
    ("TDC", "Top dead centre; probe angles are viewed from the driver"),
    ("1X / 2X", "Vibration component at once / twice running speed"),
    ("pk-pk", "Peak-to-peak displacement"),
    ("Unfiltered", "Overall (broadband) vibration amplitude"),
    ("Slow roll", "Low-speed (300-500 rpm) reading of mechanical + electrical runout"),
    ("Compensated", "1X vector with the slow-roll runout vector subtracted"),
    ("Bode / polar", "1X amplitude and phase against speed, as two curves / one vector plot"),
    ("AF", "Amplification factor of a critical speed (half-power method)"),
    ("SM", "Separation margin of a critical speed from the operating speed range"),
    ("MSS / MCS", "Minimum / maximum continuous speed"),
    ("Trip", "Overspeed trip speed"),
    ("URT", "Unbalanced rotor response verification test (API 617 8.3.3)"),
    ("Ur", "Allowable residual unbalance, 6350 W / N (g mm)"),
    ("DGS", "Dry gas seal"),
    ("PTC 10", "ASME PTC 10-2022 Performance test code on compressors and exhausters"),
    ("Type 1 / Type 2", "Test on the specified gas near specified conditions / on a substitute gas by similarity"),
    ("rv", "Specific volume ratio, inlet to discharge"),
    ("phi", "Flow coefficient q / (pi/4 D2^2 U)"),
    ("psi", "Polytropic work (head) coefficient Hp / U^2"),
    ("Mm", "Machine Mach number U / a1"),
    ("Rem", "Machine Reynolds number U b / nu"),
    ("Hp", "Polytropic head"),
    ("eta p", "Polytropic efficiency"),
    ("FE", "Flow element (orifice, ISO 5167-2)"),
    ("ASV", "Anti-surge (recycle) valve"),
    ("U95", "Expanded uncertainty at 95 % confidence (PTC 19.1)"),
]


def tag_table(overrides: dict | None = None) -> dict[str, dict]:
    """Merged tag map: key -> {tag, description, unit, location, group}. Overrides may be a tag string
    or a dict with any of these fields."""
    out = {k: {"tag": t, "description": d, "unit": u, "location": loc, "group": g} for k, (t, d, u, loc, g) in DEFAULT_TAGS.items()}
    for k, v in (overrides or {}).items():
        if k in out and v:
            out[k] = {**out[k], **({"tag": str(v)} if isinstance(v, str) else {kk: str(vv) for kk, vv in v.items() if vv})}
    return out


def tag_names(overrides: dict | None = None) -> dict[str, str]:
    return {k: v["tag"] for k, v in tag_table(overrides).items()}
