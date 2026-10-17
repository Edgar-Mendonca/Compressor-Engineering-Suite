"""Engineering material database, temperature-dependent properties and
screening-level material selection.

Selection here is a *screening* step (temperature range, strength need,
sour-service hardness availability, corrosion notes). Documented service
limits and qualification evidence for the chosen material must be recorded
and checked separately.
"""

from __future__ import annotations

import json
from functools import lru_cache
from importlib import resources

import numpy as np

from compsuite.core.trace import record

SOUR_PH2S_BAR = 0.003  # ISO 15156-2 sour threshold: 0.3 kPa partial pressure of H2S


@lru_cache(maxsize=1)
def _db() -> dict:
    with resources.files("compsuite.data").joinpath("materials.json").open() as f:
        return json.load(f)


def list_materials(use: str | None = None) -> list[dict]:
    mats = _db()["materials"]
    return [m for m in mats if use is None or use in m["uses"]]


def get_material(key: str) -> dict:
    for m in _db()["materials"]:
        if m["key"] == key:
            return dict(m)
    raise KeyError(f"Material '{key}' not in database. Available: {[m['key'] for m in _db()['materials']]}")


def at_temperature(key: str, temp_c: float) -> dict:
    """Material properties derated to temperature (linear interpolation)."""
    m = get_material(key)
    db = _db()
    pts = db["temperature_points_c"]
    der = db["derating"][m["family"]]
    fE = float(np.interp(temp_c, pts, der["E"]))
    fy = float(np.interp(temp_c, pts, der["yield"]))
    m["temperature_c"] = temp_c
    m["E_pa"] = m["E_gpa"] * 1e9 * fE
    m["yield_mpa"] = m["yield_mpa"] * fy
    m["uts_mpa"] = m["uts_mpa"] * (0.5 + 0.5 * fy)
    m["endurance_mpa"] = m.get("endurance_mpa") or (0.5 * m["uts_mpa"] if m["uts_mpa"] <= 1400 else 700.0)
    m["shear_modulus_pa"] = m["E_pa"] / (2 * (1 + m["poisson"]))
    m["above_max_temperature"] = temp_c > m["max_temp_c"]
    return m


def screen_materials(use: str, max_temp_c: float, min_temp_c: float, ph2s_bar: float, wet: bool,
                     required_yield_mpa: float | None = None) -> dict:
    sour = ph2s_bar >= SOUR_PH2S_BAR
    rec = record("materials", "Screening by temperature range, strength and sour-service availability",
                 [use, max_temp_c, min_temp_c, ph2s_bar, wet, required_yield_mpa],
                 assumptions=["Typical database values; not specification minimums",
                              f"Sour service when pH2S >= {SOUR_PH2S_BAR * 100:.1f} kPa (ISO 15156-2 threshold)",
                              "Sour hardness limits reduce the usable strength of low-alloy steels"],
                 references=["ISO 15156 / NACE MR0175", "API 617 material requirements"])
    rows = []
    for m in list_materials(use):
        p = at_temperature(m["key"], max_temp_c)
        checks = {
            "max_temperature": max_temp_c <= m["max_temp_c"],
            "min_temperature": min_temp_c >= m["min_temp_c"],
            "sour_hardness_defined": (not sour) or m.get("sour_max_hrc") is not None,
        }
        usable_yield = p["yield_mpa"]
        if sour and m["family"] in ("low_alloy", "carbon_steel"):
            usable_yield = min(usable_yield, 550.0 * (p["yield_mpa"] / m["yield_mpa"]))
        if required_yield_mpa:
            checks["strength"] = usable_yield >= required_yield_mpa
        score = usable_yield / (required_yield_mpa or usable_yield)
        rows.append({"key": m["key"], "family": m["family"], "usable_yield_mpa": usable_yield,
                     "strength_to_weight": usable_yield * 1e6 / p["density_kg_m3"] / 1e3,
                     "checks": checks, "suitable": all(checks.values()), "score": score,
                     "sour_note": m["sour_note"], "corrosion": m["corrosion"]})
    rows.sort(key=lambda r: (not r["suitable"], -r["score"]))
    if wet:
        rec.warn("Wet service: confirm corrosion rates and allowances in the project material records")
    return {"use": use, "sour": sour, "candidates": rows, "trace": rec}
