"""Parametric studies, sensitivity analysis, design optimisation and
configuration comparison on the integrated workflow.

Design variables and metrics are addressed by dotted paths:
  variables: "shaft.shaft_diameter_at_impellers_mm", "bearings.preload",
             "design_basis.head_coefficient", ...
  metrics:   names in ``METRICS`` (e.g. "logdec_with_qa", "efficiency").

Every evaluation runs the real workflow (``level="fast"`` by default:
coarser bearing tables, damped modes and Level I stability without
unbalance sweeps), so trade-offs include the coupling between
aerodynamics, mechanics and rotordynamics. For larger multidisciplinary
problems OpenMDAO is the intended integration path.
"""

from __future__ import annotations

from typing import Callable

import numpy as np
from scipy.optimize import minimize

from compsuite.core.model import Project
from compsuite.core.trace import record
from compsuite.core.workflow import run_project


def _sep(res):
    lat = res["casings"][0]["lateral"]
    if lat.get("min_mode_separation") is not None:
        return lat["min_mode_separation"]
    seps = [p["separation_pct"] / 100 for c in lat["unbalance_cases"] for p in c["peaks"] if p["af"] >= 2.5]
    return min(seps) if seps else 1.0


METRICS: dict[str, Callable[[dict], float]] = {
    "efficiency": lambda r: r["sizing"]["polytropic_efficiency_overall"],
    "shaft_power_kw": lambda r: r["sizing"]["shaft_power_kw"],
    "speed_rpm": lambda r: r["sizing"]["speed_rpm"],
    "stages": lambda r: float(r["sizing"]["n_stages"]),
    "tip_speed_m_s": lambda r: r["sizing"]["tip_speed_m_s"],
    "rotor_mass_kg": lambda r: r["casings"][0]["mass_properties"]["mass_kg"],
    "bearing_span_mm": lambda r: r["casings"][0]["rotor"]["bearing_span_m"] * 1e3,
    "logdec_with_qa": lambda r: r["casings"][0]["lateral"]["stability"]["logdec_with_qa"],
    "logdec_no_qa": lambda r: r["casings"][0]["lateral"]["stability"]["logdec_no_qa"],
    "q0_over_qa": lambda r: (r["casings"][0]["lateral"]["stability"]["q0_n_m"] or 1e12) / r["casings"][0]["lateral"]["stability"]["qa_n_m"],
    "min_mode_separation": _sep,
    "shaft_fatigue_safety": lambda r: r["casings"][0]["shaft"]["min_fatigue_safety"],
    "impeller_overspeed_ratio": lambda r: max(i["overspeed_average_ratio"] for i in r["casings"][0]["impeller_stress"]["impellers"]),
    "bearing_loss_kw": lambda r: sum(b["power_loss_kw"] for b in r["casings"][0]["bearing_rated"].values()),
    "min_film_um": lambda r: min(b["h_min_m"] for b in r["casings"][0]["bearing_rated"].values()) * 1e6,
    "torsional_first_mode_hz": lambda r: r["torsional"]["natural"]["modes"][0]["freq_hz"],
    "min_surge_margin": lambda r: min(o.get("surge_margin", -1) for o in r["operating_points"]),
    "checklist_fails": lambda r: float(r["checklist"]["counts"]["fail"]),
}


def set_path(project: Project, path: str, value) -> Project:
    p = project.model_copy(deep=True)
    obj = p
    parts = path.split(".")
    for part in parts[:-1]:
        obj = obj[int(part)] if part.isdigit() else getattr(obj, part)
    last = parts[-1]
    current = getattr(obj, last)
    if isinstance(current, int) and not isinstance(current, bool):
        value = int(round(value))
    setattr(obj, last, value)
    return p


def get_path(project: Project, path: str):
    obj = project
    for part in path.split("."):
        obj = obj[int(part)] if part.isdigit() else getattr(obj, part)
    return obj


def evaluate(project: Project, metrics: list[str], level: str = "fast") -> dict:
    try:
        res = run_project(project, level=level)
    except Exception as exc:  # noqa: BLE001 - infeasible designs are reported, not raised
        return {"ok": False, "error": str(exc), **{m: None for m in metrics}}
    out = {"ok": True}
    for m in metrics:
        try:
            out[m] = float(METRICS[m](res))
        except Exception:  # noqa: BLE001
            out[m] = None
    return out


def parametric_study(project: Project, variable: str, values: list[float], metrics: list[str], level: str = "fast") -> dict:
    rec = record("optimization.parametric", "One-at-a-time parametric sweep on the integrated workflow", [variable, values, metrics])
    rows = []
    for v in values:
        rows.append({"value": v, **evaluate(set_path(project, variable, v), metrics, level)})
    return {"variable": variable, "metrics": metrics, "rows": rows, "trace": rec}


def sensitivity(project: Project, variables: list[str], metrics: list[str], rel_step: float = 0.05, level: str = "fast") -> dict:
    """Normalised central-difference sensitivities S = (dM/M) / (dx/x)."""
    rec = record("optimization.sensitivity", "Normalised central differences", [variables, metrics, rel_step])
    base = evaluate(project, metrics, level)
    table = []
    for var in variables:
        x0 = get_path(project, var)
        if x0 is None:
            table.append({"variable": var, "note": "variable is auto-estimated (None); set a value to study it"})
            continue
        h = abs(x0) * rel_step or rel_step
        up = evaluate(set_path(project, var, x0 + h), metrics, level)
        dn = evaluate(set_path(project, var, x0 - h), metrics, level)
        row = {"variable": var, "base_value": x0}
        for m in metrics:
            if None in (up[m], dn[m], base[m]) or base[m] == 0:
                row[m] = None
            else:
                row[m] = (up[m] - dn[m]) / (2 * h) * x0 / base[m]
        table.append(row)
    return {"base": base, "sensitivities": table, "metrics": metrics, "trace": rec}


def optimize(project: Project, variables: list[dict], objective: str, sense: str = "max",
             constraints: list[dict] | None = None, max_evals: int = 40, level: str = "fast") -> dict:
    """Derivative-free constrained optimisation (COBYLA).

    variables:   [{"path": ..., "lower": ..., "upper": ...}]
    constraints: [{"metric": ..., "op": ">=" | "<=", "value": ...}]
    """
    constraints = constraints or []
    rec = record("optimization.optimize", "COBYLA on normalised variables, workflow in the loop",
                 [variables, objective, sense, constraints, max_evals],
                 assumptions=["Local optimum from the current design; repeat from other starts for global trends",
                              f"Workflow level '{level}' inside the loop; verify the optimum with a full run"])
    metrics = sorted({objective} | {c["metric"] for c in constraints})
    lo = np.array([v["lower"] for v in variables], float)
    hi = np.array([v["upper"] for v in variables], float)
    x0 = []
    for v in variables:
        cur = get_path(project, v["path"])
        x0.append(cur if cur is not None else 0.5 * (v["lower"] + v["upper"]))
    u0 = (np.clip(np.array(x0, float), lo, hi) - lo) / (hi - lo)
    history, cache = [], {}

    def run(u):
        key = tuple(np.round(u, 6))
        if key in cache:
            return cache[key]
        x = lo + np.clip(u, 0, 1) * (hi - lo)
        p = project
        for v, xv in zip(variables, x):
            p = set_path(p, v["path"], float(xv))
        ev = evaluate(p, metrics, level)
        history.append({"x": dict(zip([v["path"] for v in variables], map(float, x))), **ev})
        cache[key] = ev
        return ev

    sign = -1.0 if sense == "max" else 1.0

    def f(u):
        ev = run(u)
        val = ev.get(objective)
        return 1e6 if val is None else sign * val

    cons = [{"type": "ineq", "fun": lambda u: u}, {"type": "ineq", "fun": lambda u: 1 - u}]
    for c in constraints:
        def g(u, c=c):
            val = run(u).get(c["metric"])
            if val is None:
                return -1e3
            scale = max(abs(c["value"]), 1e-9)
            return (val - c["value"]) / scale if c["op"] == ">=" else (c["value"] - val) / scale
        cons.append({"type": "ineq", "fun": g})
    sol = minimize(f, u0, method="COBYLA", constraints=cons, options={"maxiter": max_evals, "rhobeg": 0.25, "catol": 1e-4})
    best_x = lo + np.clip(sol.x, 0, 1) * (hi - lo)
    best = run(sol.x)
    feasible = all(best.get(c["metric"]) is not None and
                   (best[c["metric"]] >= c["value"] - 1e-9 if c["op"] == ">=" else best[c["metric"]] <= c["value"] + 1e-9)
                   for c in constraints)
    if not feasible:
        rec.warn("Optimum does not satisfy all constraints")
    return {"objective": objective, "sense": sense, "best": {"x": dict(zip([v["path"] for v in variables], map(float, best_x))), **best},
            "feasible": feasible, "evaluations": len(history), "history": history, "message": str(sol.message), "trace": rec}


def compare_configurations(projects: list[Project], metrics: list[str] | None = None, level: str = "fast") -> dict:
    metrics = metrics or ["efficiency", "shaft_power_kw", "speed_rpm", "stages", "rotor_mass_kg", "logdec_with_qa",
                          "min_mode_separation", "shaft_fatigue_safety", "min_surge_margin", "checklist_fails"]
    rows = [{"name": p.name, **evaluate(p, metrics, level)} for p in projects]
    ranking = {}
    for m in metrics:
        vals = [(r["name"], r[m]) for r in rows if r.get(m) is not None]
        if vals:
            better_low = m in ("shaft_power_kw", "rotor_mass_kg", "checklist_fails", "stages", "bearing_loss_kw")
            ranking[m] = [n for n, _ in sorted(vals, key=lambda t: t[1], reverse=not better_low)]
    return {"metrics": metrics, "rows": rows, "ranking": ranking}


def trade_off(rows: list[dict], x: str, y: str) -> list[dict]:
    """Pareto-optimal subset (maximise both x and y)."""
    pts = [r for r in rows if r.get(x) is not None and r.get(y) is not None]
    out = []
    for p in pts:
        if not any((q[x] >= p[x] and q[y] >= p[y]) and (q[x] > p[x] or q[y] > p[y]) for q in pts):
            out.append(p)
    return sorted(out, key=lambda r: r[x])


__all__ = ["METRICS", "parametric_study", "sensitivity", "optimize", "compare_configurations", "trade_off", "set_path",
           "get_path"]
