"""FastAPI engineering backend.

Run:  uvicorn compsuite.api.app:app --reload
Data: COMPSUITE_DB (default ./compsuite.db). The built React frontend in
``frontend/dist`` is served at ``/`` when present.
"""

from __future__ import annotations

import os
import tempfile
from collections import OrderedDict
from pathlib import Path
from typing import Any, Literal, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse, Response
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from compsuite import __version__
from compsuite.cad.geometry import cadquery_available, rotor_step, rotor_stl, scene
from compsuite.core.model import Project
from compsuite.core.storage import Store
from compsuite.core.trace import input_hash, jsonable
from compsuite.core.workflow import run_project
from compsuite.materials.database import _db as materials_db, at_temperature
from compsuite.optimization import studies
from compsuite.reporting.report import report_html, report_pdf, results_excel
from compsuite.structural.calculix import rotor_axisymmetric_deck, rotor_beam_deck
from compsuite.thermo.backends import coolprop_available, make_gas
from compsuite.thermo.components import COMPONENTS

app = FastAPI(title="Compressor Engineering Suite", version=__version__,
              description="Preliminary compressor engineering calculations. Not a certificate of compliance.")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

store = Store(os.environ.get("COMPSUITE_DB", "compsuite.db"))
_cache: "OrderedDict[str, dict]" = OrderedDict()


def _run_cached(project: Project, level: str = "full") -> dict:
    key = f"{input_hash(project)}:{level}"
    if key in _cache:
        _cache.move_to_end(key)
        return _cache[key]
    try:
        res = run_project(project, level=level)
    except (ValueError, KeyError) as exc:
        raise HTTPException(422, f"Calculation failed: {exc}") from exc
    _cache[key] = res
    while len(_cache) > 8:
        _cache.popitem(last=False)
    return res


# ---------------------------------------------------------------- reference
@app.get("/api/health")
def health():
    return {"status": "ok", "version": __version__, "engines": {"coolprop": coolprop_available(), "cadquery": cadquery_available()}}


@app.get("/api/defaults")
def defaults():
    return Project().model_dump()


@app.get("/api/schema")
def schema():
    return Project.model_json_schema()


@app.get("/api/components")
def components():
    return [{"key": c.key, "name": c.name, "mw": c.mw, "tc_k": c.tc, "pc_bar": c.pc / 1e5, "omega": c.omega} for c in COMPONENTS.values()]


@app.get("/api/materials")
def materials():
    return materials_db()


@app.get("/api/materials/{key}")
def material(key: str, temperature_c: float = 20.0):
    try:
        return at_temperature(key, temperature_c)
    except KeyError as exc:
        raise HTTPException(404, str(exc)) from exc


class ThermoRequest(BaseModel):
    components: dict[str, float]
    backend: Literal["pr", "coolprop"] = "pr"
    temperature_c: float = 35.0
    pressure_bara: float = 30.0


@app.post("/api/thermo/state")
def thermo_state(req: ThermoRequest):
    try:
        gas = make_gas(req.components, req.backend)
        st = gas.state(req.temperature_c + 273.15, req.pressure_bara * 1e5)
    except (ValueError, RuntimeError) as exc:
        raise HTTPException(422, str(exc)) from exc
    return jsonable({"state": st, "mw": gas.mw(), "engine": getattr(gas, "engine", "")})


class EnvelopeRequest(BaseModel):
    components: dict[str, float]
    p_min_bara: float = 1.0
    p_max_bara: float = 120.0
    points: int = 18


@app.post("/api/thermo/envelope")
def thermo_envelope(req: EnvelopeRequest):
    gas = make_gas(req.components, "pr")
    env = gas.phase_envelope(req.p_min_bara * 1e5, req.p_max_bara * 1e5, req.points)
    return {"dew": [{"T_c": t - 273.15, "P_bara": p / 1e5} for t, p in env["dew"]],
            "bubble": [{"T_c": t - 273.15, "P_bara": p / 1e5} for t, p in env["bubble"]],
            "model": "Peng-Robinson, successive substitution (points near the critical region may be missing)"}


class ChartRequest(BaseModel):
    components: dict[str, float]
    backend: Literal["pr", "coolprop"] = "pr"
    t_min_c: float = 0.0
    t_max_c: float = 200.0
    pressures_bara: list[float] = Field(default_factory=lambda: [10, 30, 60, 100])


@app.post("/api/thermo/chart")
def thermo_chart(req: ChartRequest):
    """Property curves vs temperature at several pressures (Z, density, cp, k, sound speed)."""
    import numpy as np
    gas = make_gas(req.components, req.backend)
    out = []
    for p in req.pressures_bara:
        rows = []
        for t in np.linspace(req.t_min_c, req.t_max_c, 21):
            try:
                st = gas.state(t + 273.15, p * 1e5)
                rows.append({"T_c": float(t), "Z": st.Z, "rho": st.rho, "cp": st.cp, "k": st.k, "sound": st.sound, "mu": st.mu,
                             "h_kj_kg": st.h / 1e3, "s_kj_kgk": st.s / 1e3})
            except (ValueError, ZeroDivisionError):
                continue
        out.append({"P_bara": p, "rows": rows})
    return jsonable(out)


# ---------------------------------------------------------------- run
class RunRequest(BaseModel):
    project: Project
    level: Literal["full", "fast"] = "full"


@app.post("/api/run")
def run(req: RunRequest):
    res = _run_cached(req.project, req.level)
    out = jsonable(res)
    cas = res["casings"][0]
    out["scene"] = scene(cas["rotor"], cas["impellers"]["impellers"])
    return JSONResponse(out)


# ---------------------------------------------------------------- projects
class SaveRequest(BaseModel):
    project: Project
    note: str = ""


@app.get("/api/projects")
def list_projects():
    return store.list()


@app.post("/api/projects")
def create_project(req: SaveRequest):
    return store.create(req.project, req.note or "Created")


@app.get("/api/projects/{pid}")
def get_project(pid: int, revision: Optional[int] = None):
    try:
        return store.get(pid, revision)
    except KeyError as exc:
        raise HTTPException(404, "Project or revision not found") from exc


@app.put("/api/projects/{pid}")
def update_project(pid: int, req: SaveRequest):
    try:
        return store.update(pid, req.project, req.note)
    except KeyError as exc:
        raise HTTPException(404, "Project not found") from exc


@app.delete("/api/projects/{pid}")
def delete_project(pid: int):
    store.delete(pid)
    return {"deleted": pid}


@app.get("/api/projects/{pid}/revisions")
def revisions(pid: int):
    return store.revisions(pid)


@app.post("/api/projects/{pid}/run")
def run_saved(pid: int, level: Literal["full", "fast"] = "full", revision: Optional[int] = None):
    try:
        info = store.get(pid, revision)
    except KeyError as exc:
        raise HTTPException(404, "Project not found") from exc
    project = Project.model_validate(info["project"])
    res = _run_cached(project, level)
    run_id = store.save_run(pid, info["revision"], res)
    out = jsonable(res)
    cas = res["casings"][0]
    out["scene"] = scene(cas["rotor"], cas["impellers"]["impellers"])
    out["run_id"] = run_id
    return JSONResponse(out)


@app.get("/api/projects/{pid}/history")
def history(pid: int):
    return store.history(pid)


@app.get("/api/runs/{run_id}")
def get_run(run_id: int):
    try:
        return JSONResponse(store.run(run_id))
    except KeyError as exc:
        raise HTTPException(404, "Run not found") from exc


# ---------------------------------------------------------------- exports
EXPORTS = {"report.html": "text/html", "report.pdf": "application/pdf",
           "results.xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
           "results.json": "application/json", "rotor.stl": "model/stl", "rotor.step": "application/step",
           "calculix-beam.inp": "text/plain", "calculix-axisymmetric.inp": "text/plain", "scene.json": "application/json"}


@app.post("/api/export/{kind}")
def export(kind: str, req: RunRequest):
    if kind not in EXPORTS:
        raise HTTPException(404, f"Unknown export. Available: {sorted(EXPORTS)}")
    p = req.project
    res = _run_cached(p, req.level)
    cas = res["casings"][0]
    headers = {"Content-Disposition": f'attachment; filename="{p.name.replace(" ", "_")}_rev{p.revision}_{kind}"'}
    if kind == "report.html":
        return HTMLResponse(report_html(p, res))
    if kind == "report.pdf":
        return Response(report_pdf(p, res), media_type=EXPORTS[kind], headers=headers)
    if kind == "results.xlsx":
        return Response(results_excel(p, res), media_type=EXPORTS[kind], headers=headers)
    if kind == "results.json":
        return JSONResponse(jsonable(res), headers=headers)
    if kind == "rotor.stl":
        return Response(rotor_stl(cas["rotor"], cas["impellers"]["impellers"]), media_type=EXPORTS[kind], headers=headers)
    if kind == "rotor.step":
        if not cadquery_available():
            raise HTTPException(501, "STEP export needs CadQuery (pip install cadquery)")
        with tempfile.TemporaryDirectory() as d:
            path = rotor_step(cas["rotor"], cas["impellers"]["impellers"], str(Path(d) / "rotor.step"))
            return Response(Path(path).read_bytes(), media_type=EXPORTS[kind], headers=headers)
    if kind == "calculix-beam.inp":
        kb = sum(r["kyy"] for r in cas["bearing_rated"].values() if "kyy" in r) / max(len(cas["bearing_rated"]), 1) or 1e9
        return Response(rotor_beam_deck(cas["_model"], kb, p.name), media_type="text/plain", headers=headers)
    if kind == "calculix-axisymmetric.inp":
        w = res["sizing"]["speed_rpm"] * p.design_basis.max_continuous_speed_pct / 100 * 3.141592653589793 / 30
        return Response(rotor_axisymmetric_deck(cas["rotor"], cas["_shaft_material"], w), media_type="text/plain", headers=headers)
    return JSONResponse(scene(cas["rotor"], cas["impellers"]["impellers"]))


# ---------------------------------------------------------------- studies
class ParametricRequest(BaseModel):
    project: Project
    variable: str
    values: list[float]
    metrics: list[str]


class SensitivityRequest(BaseModel):
    project: Project
    variables: list[str]
    metrics: list[str]
    rel_step: float = 0.05


class OptimizeRequest(BaseModel):
    project: Project
    variables: list[dict[str, Any]]
    objective: str
    sense: Literal["max", "min"] = "max"
    constraints: list[dict[str, Any]] = Field(default_factory=list)
    max_evals: int = 30


class CompareRequest(BaseModel):
    projects: list[Project]
    metrics: Optional[list[str]] = None


@app.get("/api/studies/metrics")
def study_metrics():
    return sorted(studies.METRICS)


def _check_metrics(ms):
    bad = [m for m in ms if m not in studies.METRICS]
    if bad:
        raise HTTPException(422, f"Unknown metrics {bad}. Available: {sorted(studies.METRICS)}")


@app.post("/api/studies/parametric")
def parametric(req: ParametricRequest):
    _check_metrics(req.metrics)
    return jsonable(studies.parametric_study(req.project, req.variable, req.values, req.metrics))


@app.post("/api/studies/sensitivity")
def sensitivity(req: SensitivityRequest):
    _check_metrics(req.metrics)
    return jsonable(studies.sensitivity(req.project, req.variables, req.metrics, req.rel_step))


@app.post("/api/studies/optimize")
def optimize(req: OptimizeRequest):
    _check_metrics([req.objective] + [c["metric"] for c in req.constraints])
    return jsonable(studies.optimize(req.project, req.variables, req.objective, req.sense, req.constraints, req.max_evals))


@app.post("/api/studies/compare")
def compare(req: CompareRequest):
    if req.metrics:
        _check_metrics(req.metrics)
    return jsonable(studies.compare_configurations(req.projects, req.metrics))


# ---------------------------------------------------------------- frontend
_root = Path(__file__).resolve().parents[3]
_material_app = _root / "apps" / "material-assessment"
if _material_app.is_dir():
    app.mount("/material-assessment", StaticFiles(directory=_material_app, html=True), name="material-assessment")

_dist = _root / "frontend" / "dist"
if _dist.is_dir():
    app.mount("/assets", StaticFiles(directory=_dist / "assets"), name="assets")

    @app.get("/{path:path}", include_in_schema=False)
    def spa(path: str):
        f = _dist / path
        if path and f.is_file():
            return FileResponse(f)
        return FileResponse(_dist / "index.html")
