"""FastAPI engineering backend.

Run:  uvicorn compsuite.api.app:app --reload
Data: COMPSUITE_DB (default Documents/CentriForge/projects.db). The built React frontend in
``frontend/dist`` is served at ``/`` when present.
"""

from __future__ import annotations

import tempfile
from collections import OrderedDict
from pathlib import Path
from typing import Any, Literal, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse, Response
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from compsuite import APP_NAME, __version__
from compsuite.api.appinfo import router as appinfo_router
from compsuite.core.model import Project
from compsuite.core.paths import database_path, resource_root
from compsuite.core.storage import Store
from compsuite.core.trace import input_hash, jsonable
from compsuite.materials.database import _db as materials_db, at_temperature
from compsuite.thermo.backends import coolprop_available, make_gas
from compsuite.thermo.components import COMPONENTS

app = FastAPI(title=APP_NAME, version=__version__,
              description="Preliminary compressor engineering calculations. Not a certificate of compliance.")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


@app.exception_handler(Exception)
async def _unexpected(request, exc: Exception):
    """Unexpected engine errors reach the app as a readable message (and the log), not a bare 500."""
    import logging
    from fastapi.responses import JSONResponse
    logging.getLogger("compsuite").exception("error in %s", request.url.path)
    return JSONResponse(status_code=500, content={"detail": f"Engine error in {request.url.path}: {type(exc).__name__}: {exc}. "
                                                             "If it repeats, use File > Copy diagnostics and send it with the project file."})

app.include_router(appinfo_router)
store = Store(database_path())

# Heavy engineering and reporting modules load on first use (or in the
# background after start-up, see warm_up) so the server answers in about a second.


def run_project(project, level="full"):
    from compsuite.core.workflow import run_project as _run
    return _run(project, level=level)


def _cad():
    from compsuite.cad import geometry
    return geometry


def _studies():
    from compsuite.optimization import studies
    return studies


class _LockedReport:
    """Report builders use pyplot (global state): share the chart renderer's lock."""

    def __getattr__(self, name):
        from compsuite.reporting import prism, report
        fn = getattr(report, name)

        def call(*a, **k):
            with prism._LOCK:
                return fn(*a, **k)
        return call


def _rep():
    return _LockedReport()


def _ccx():
    from compsuite.structural import calculix
    return calculix


def warm_up() -> None:
    """Import the solver stack in the background so the first analysis starts at once."""
    import compsuite.core.workflow  # noqa: F401
    import compsuite.reporting.prism  # noqa: F401


@app.on_event("startup")
def _start_warm_up():
    import threading
    threading.Thread(target=warm_up, daemon=True).start()
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
    return {"status": "ok", "version": __version__, "engines": {"coolprop": coolprop_available(), "cadquery": _cad().cadquery_available()}}


@app.get("/api/defaults")
def defaults():
    return Project().model_dump()


@app.post("/api/autosave")
def autosave(project: Project):
    from compsuite.core.paths import data_dir
    import json
    import time
    (data_dir() / "autosave.cfproj").write_text(json.dumps({"saved": time.time(), "project": project.model_dump()}), encoding="utf-8")
    return {"ok": True}


@app.get("/api/autosave")
def autosave_get():
    from compsuite.core.paths import data_dir
    import json
    f = data_dir() / "autosave.cfproj"
    if not f.is_file():
        return {"saved": None}
    try:
        return json.loads(f.read_text(encoding="utf-8"))
    except ValueError:
        return {"saved": None}


@app.get("/api/examples")
def examples():
    from compsuite.examples import catalogue
    return catalogue()


@app.get("/api/examples/{key}")
def example(key: str):
    from compsuite.examples import EXAMPLES, blank
    if key == "blank":
        return blank().model_dump()
    if key not in EXAMPLES:
        raise HTTPException(404, f"Unknown example {key}")
    return EXAMPLES[key]["build"]().model_dump()


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
    out["scene"] = _cad().scene(cas["rotor"], cas["impellers"]["impellers"])
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
    out["scene"] = _cad().scene(cas["rotor"], cas["impellers"]["impellers"])
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


@app.post("/api/export/material-selection.pdf")
def export_material_report(req: RunRequest):
    from compsuite.materials.report import material_selection_report
    from compsuite.reporting import prism
    res = _run_cached(req.project, req.level)
    with prism._LOCK:
        pdf = material_selection_report(req.project, res)
    name = req.project.name.replace(" ", "_")
    return Response(pdf, media_type="application/pdf",
                    headers={"Content-Disposition": f'attachment; filename="{name}_material_selection.pdf"'})


@app.post("/api/export/{kind}")
def export(kind: str, req: RunRequest):
    if kind not in EXPORTS:
        raise HTTPException(404, f"Unknown export. Available: {sorted(EXPORTS)}")
    p = req.project
    res = _run_cached(p, req.level)
    cas = res["casings"][0]
    headers = {"Content-Disposition": f'attachment; filename="{p.name.replace(" ", "_")}_rev{p.revision}_{kind}"'}
    if kind == "report.html":
        return HTMLResponse(_rep().report_html(p, res))
    if kind == "report.pdf":
        return Response(_rep().report_pdf(p, res), media_type=EXPORTS[kind], headers=headers)
    if kind == "results.xlsx":
        return Response(_rep().results_excel(p, res), media_type=EXPORTS[kind], headers=headers)
    if kind == "results.json":
        return JSONResponse(jsonable(res), headers=headers)
    if kind == "rotor.stl":
        return Response(_cad().rotor_stl(cas["rotor"], cas["impellers"]["impellers"]), media_type=EXPORTS[kind], headers=headers)
    if kind == "rotor.step":
        if not _cad().cadquery_available():
            raise HTTPException(501, "STEP export needs CadQuery (pip install cadquery)")
        with tempfile.TemporaryDirectory() as d:
            path = _cad().rotor_step(cas["rotor"], cas["impellers"]["impellers"], str(Path(d) / "rotor.step"))
            return Response(Path(path).read_bytes(), media_type=EXPORTS[kind], headers=headers)
    if kind == "calculix-beam.inp":
        kb = sum(r["kyy"] for r in cas["bearing_rated"].values() if "kyy" in r) / max(len(cas["bearing_rated"]), 1) or 1e9
        return Response(_ccx().rotor_beam_deck(cas["_model"], kb, p.name), media_type="text/plain", headers=headers)
    if kind == "calculix-axisymmetric.inp":
        w = res["sizing"]["speed_rpm"] * p.design_basis.max_continuous_speed_pct / 100 * 3.141592653589793 / 30
        return Response(_ccx().rotor_axisymmetric_deck(cas["rotor"], cas["_shaft_material"], w), media_type="text/plain", headers=headers)
    return JSONResponse(_cad().scene(cas["rotor"], cas["impellers"]["impellers"]))


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
    return sorted(_studies().METRICS)


def _check_metrics(ms):
    bad = [m for m in ms if m not in _studies().METRICS]
    if bad:
        raise HTTPException(422, f"Unknown metrics {bad}. Available: {sorted(_studies().METRICS)}")


@app.post("/api/studies/parametric")
def parametric(req: ParametricRequest):
    _check_metrics(req.metrics)
    return jsonable(_studies().parametric_study(req.project, req.variable, req.values, req.metrics))


@app.post("/api/studies/sensitivity")
def sensitivity(req: SensitivityRequest):
    _check_metrics(req.metrics)
    return jsonable(_studies().sensitivity(req.project, req.variables, req.metrics, req.rel_step))


@app.post("/api/studies/optimize")
def optimize(req: OptimizeRequest):
    _check_metrics([req.objective] + [c["metric"] for c in req.constraints])
    return jsonable(_studies().optimize(req.project, req.variables, req.objective, req.sense, req.constraints, req.max_evals))


@app.post("/api/studies/compare")
def compare(req: CompareRequest):
    if req.metrics:
        _check_metrics(req.metrics)
    return jsonable(_studies().compare_configurations(req.projects, req.metrics))


# ---------------------------------------------------------------- 3D impeller FEA and shop tests
class FEARequest(BaseModel):
    project: Project
    casing: int = 0
    impeller: int = 0
    opts: dict[str, Any] = Field(default_factory=dict)
    images: list[dict[str, str]] = Field(default_factory=list)      # viewer pictures for the report: {title, png data-URL}


_fea_cache: "OrderedDict[str, dict]" = OrderedDict()


def _fea(req: FEARequest) -> tuple[dict, dict]:
    import hashlib
    import json
    from compsuite.structural.impeller3d import analyse
    res = _run_cached(req.project, "full")
    try:
        cas = res["casings"][req.casing]
        imp = cas["impellers"]["impellers"][req.impeller]
    except (IndexError, KeyError) as exc:
        raise HTTPException(404, "No such casing / impeller") from exc
    st = next(s for s in res["sizing"]["stages"] if s["index"] == imp["index"])
    key = hashlib.sha1(json.dumps([input_hash(req.project), req.casing, req.impeller, req.opts], sort_keys=True, default=str).encode()).hexdigest()
    if key not in _fea_cache:
        opts = {"bore_mm": imp.get("bore_mm") or cas["rotor"]["shaft_diameter_impellers_m"] * 1e3, **req.opts}
        r = analyse(imp, st, cas["_imp_mat"], cas["lateral"]["speeds"], opts)
        axi = next((a for a in (cas.get("impeller_fea") or {}).get("impellers", []) if a["impeller"] == r["impeller"]), None)
        if axi:  # 2D axisymmetric (smeared blades) vs 3D sector
            s3 = r["summary"]
            r["validation"]["axi_vs_3d"] = {"vm_mcs_2d_mpa": axi["max_vm_mcs_mpa"], "vm_mcs_3d_mpa": s3["peak_vm_mcs_mpa"],
                                            "hoop_mcs_2d_mpa": axi["max_hoop_mcs_mpa"], "hoop_mcs_3d_mpa": s3["peak_hoop_mcs_mpa"],
                                            "tip_growth_2d_um": axi["tip_radial_growth_um"],
                                            "tip_growth_3d_um": float(r["_fields"]["Centrifugal MCS"]["ur_um"].max())}
        r["_group"] = (input_hash(req.project), req.casing, json.dumps(req.opts, sort_keys=True, default=str))
        _fea_cache[key] = r
        while len(_fea_cache) > 10:
            _fea_cache.popitem(last=False)
    return _fea_cache[key], cas


@app.post("/api/fea3d")
def fea3d(req: FEARequest):
    return jsonable(_fea(req)[0])


@app.post("/api/fea3d/export/{fmt}")
def fea3d_export(fmt: Literal["vtu", "inp", "pdf"], req: FEARequest):
    from compsuite.reporting import prism
    from compsuite.structural import impeller3d as I
    r, cas = _fea(req)
    name = f"{req.project.name.replace(' ', '_')}_impeller{r['impeller']}"
    if fmt == "vtu":
        return Response(I.to_vtu(r), media_type="application/xml", headers={"Content-Disposition": f'attachment; filename="{name}.vtu"'})
    if fmt == "inp":
        return Response(I.to_calculix(r, cas["_imp_mat"], cas["lateral"]["speeds"]["mcs_rpm"]), media_type="text/plain",
                        headers={"Content-Disposition": f'attachment; filename="{name}_ccx.inp"'})
    from compsuite.structural.impeller3d_report import fea_report
    others = sorted((I.summary_row(v) for v in _fea_cache.values() if v.get("_group") == r.get("_group")), key=lambda q: q["impeller"])
    with prism._LOCK:
        pdf = fea_report(req.project, r, others, req.images)
    return Response(pdf, media_type="application/pdf", headers={"Content-Disposition": f'attachment; filename="{name}_fea.pdf"'})


class FEABatchRequest(BaseModel):
    project: Project
    casing: int = 0
    impellers: Optional[list[int]] = None          # 0-based within the casing; None = all
    opts: dict[str, Any] = Field(default_factory=dict)


@app.post("/api/fea3d/batch")
def fea3d_batch(req: FEABatchRequest):
    """Summary rows of the 3D FEA for several impellers (the client calls one impeller at a time for progress)."""
    from compsuite.structural.impeller3d import summary_row
    res = _run_cached(req.project, "full")
    try:
        n = len(res["casings"][req.casing]["impellers"]["impellers"])
    except (IndexError, KeyError) as exc:
        raise HTTPException(404, "No such casing") from exc
    idx = req.impellers if req.impellers is not None else list(range(n))
    if any(i < 0 or i >= n for i in idx):
        raise HTTPException(404, "No such impeller")
    rows = [summary_row(_fea(FEARequest(project=req.project, casing=req.casing, impeller=i, opts=req.opts))[0]) for i in idx]
    return jsonable({"rows": rows, "qualified": all(r["qualified"] for r in rows)})


class ShopTestRequest(BaseModel):
    project: Project
    casing: int = 0
    residual: Optional[dict[str, Any]] = None      # {impeller|plane, angles_deg, amplitudes, trial_g_mm}
    influence: Optional[dict[str, Any]] = None     # {initial, trials}
    running_readings: list[dict[str, Any]] = Field(default_factory=list)
    overspeed_measured: list[dict[str, Any]] = Field(default_factory=list)
    overspeed_allowable_um: dict[str, float] = Field(default_factory=dict)


@app.post("/api/shoptest")
def shoptest(req: ShopTestRequest):
    from compsuite.testing import shoptest as T
    res = _run_cached(req.project, "full")
    cas = res["casings"][req.casing]
    sp = cas["lateral"]["speeds"]
    n = sp["mcs_rpm"]
    imps = cas["impellers"]["impellers"]
    comp = [{"component": f"Impeller {i['index'] + 1}", "mass_kg": i["mass_kg"], **T.allowable_unbalance(i["mass_kg"], n)} for i in imps]
    loads = cas["lateral"].get("bearing_static_loads_n") or {"Journal 1": 1e3, "Journal 2": 1e3}
    planes = [{"plane": k, "static_load_kg": abs(L) / 9.81, **T.allowable_unbalance(abs(L) / 9.81, n)} for k, L in loads.items()]
    crit = cas["lateral"]["stability"].get("first_critical_rigid_rpm", n)
    out = {"speeds": sp, "component_balance": comp, "rotor_balance": planes, "rotor_class": T.rotor_class(n, crit),
           "running_test": T.running_test(sp, cas["lateral"], req.running_readings), "thrust": cas.get("thrust")}
    if req.residual:
        r = req.residual
        allow = r.get("allowable_g_mm") or planes[0]["governing_g_mm"]
        out["residual_check"] = T.residual_unbalance_check(r["angles_deg"], r["amplitudes"], r["trial_g_mm"], allow)
    if req.influence and req.influence.get("trials"):
        out["influence"] = T.influence_balance(req.influence["initial"], req.influence["trials"])
    pred = {}
    cached = [v for v in _fea_cache.values()]
    if cached:
        s = cached[-1]["summary"]
        pred = {"Bore": s["permanent_bore_growth_um"], "Eye": s["permanent_eye_growth_um"], "Tip": s["permanent_tip_growth_um"]}
    out["overspeed"] = T.overspeed_record(pred, req.overspeed_measured, req.overspeed_allowable_um)
    return jsonable(out)


class MRTRequest(BaseModel):
    project: Project
    casing: int = 0
    log: list[dict[str, Any]] = Field(default_factory=list)          # log sheet rows (N1, V1-X ... TA1 ... seq)
    coastdown: list[dict[str, Any]] = Field(default_factory=list)    # [{speed_rpm, probe, amp_um, phase_deg}]
    urt: Optional[dict[str, Any]] = None                             # {critical_rpm, amplitudes_um: {V1-X: ...}}
    leak: Optional[dict[str, Any]] = None                            # {test_pressure_barg, readings: [...]}
    options: dict[str, Any] = Field(default_factory=dict)
    images: dict[str, str] = Field(default_factory=dict)             # report pictures captured in the app (data-URL PNG)


def _mrt(req: MRTRequest) -> dict:
    from compsuite.testing.mrt import mrt_analysis
    res = _cache.get(f"{input_hash(req.project)}:full") or _run_cached(req.project, "fast")   # reuse a full run if cached
    if not 0 <= req.casing < len(res["casings"]):
        raise HTTPException(422, "No such casing")
    return mrt_analysis(req.project, res, req.casing, req.log, req.coastdown, req.urt, req.leak, req.options)


@app.post("/api/mrt")
def mrt(req: MRTRequest):
    return jsonable(_mrt(req))


@app.post("/api/mrt/report.pdf")
def mrt_pdf(req: MRTRequest):
    from compsuite.reporting import prism
    from compsuite.testing.mrt import mrt_report
    out = _mrt(req)
    with prism._LOCK:
        pdf = mrt_report(req.project, out, req.images)
    return Response(pdf, media_type="application/pdf",
                    headers={"Content-Disposition": f'attachment; filename="{req.project.name.replace(" ", "_")}_MRT.pdf"'})


class CfdRequest(BaseModel):
    project: Project
    casing: int = 0
    impeller: int = 0
    images: dict[str, str] = Field(default_factory=dict)


_cfd_cache: "OrderedDict[str, tuple]" = OrderedDict()


def _cfd(req: CfdRequest):
    from compsuite.aero.cfdlite import analyse
    res = jsonable(_run_cached(req.project, "full"))
    try:
        cas = res["casings"][req.casing]
        imp = cas["impellers"]["impellers"][req.impeller]
    except (IndexError, KeyError) as exc:
        raise HTTPException(404, "No such casing / impeller") from exc
    key = f"{input_hash(req.project)}:{req.casing}:{req.impeller}"
    if key not in _cfd_cache:
        st = next(s for s in res["sizing"]["stages"] if s["index"] == imp["index"])
        case = next((c for c in res["cases"] if str(c.get("case", "")).lower().startswith("rated")), res["cases"][0])
        _cfd_cache[key] = (analyse(imp, st, case["suction"]), imp)
        while len(_cfd_cache) > 8:
            _cfd_cache.popitem(last=False)
    return _cfd_cache[key]


@app.post("/api/cfd")
def cfd(req: CfdRequest):
    return _cfd(req)[0]


@app.post("/api/cfd/export.zip")
def cfd_export(req: CfdRequest):
    from compsuite.aero.cfdlite import export_zip
    r, imp = _cfd(req)
    return Response(export_zip(imp, r, req.project.name), media_type="application/zip",
                    headers={"Content-Disposition": f'attachment; filename="{req.project.name.replace(" ", "_")}_impeller{r["impeller"]}_cfd.zip"'})


@app.post("/api/cfd/report.pdf")
def cfd_report(req: CfdRequest):
    from compsuite.aero.cfdlite_report import cfd_report as rep
    from compsuite.reporting import prism
    r, imp = _cfd(req)
    with prism._LOCK:
        pdf = rep(req.project, r, imp, req.images)
    return _pdf(pdf, req.project, f"cfd_impeller{r['impeller']}")


class DynRequest(BaseModel):
    project: Project
    network: Optional[dict[str, Any]] = None        # edited P&ID; None = project.dynamics.network or the default
    scenario: Any = "esd"                           # preset key or a full scenario dict
    reset: bool = False
    all: bool = False                               # report: run every preset for the comparison table
    images: dict[str, str] = Field(default_factory=dict)


def _dyn(req: DynRequest):
    from compsuite.dynamics import network as DN
    net = None if req.reset else (req.network or req.project.dynamics.get("network"))
    net = net or DN.default_network(req.project, jsonable(_run_cached(req.project, "full")))
    sc = req.scenario if isinstance(req.scenario, dict) else DN.scenario(req.scenario, net)
    return DN, net, sc


@app.post("/api/dynamics/model")
def dynamics_model(req: DynRequest):
    DN, net, _ = _dyn(req)
    return {"network": net, "scenarios": {k: DN.scenario(k, net) for k in DN.SCENARIOS}}


@app.post("/api/dynamics/run")
def dynamics_run(req: DynRequest):
    from compsuite.dynamics.engine import simulate
    _, net, sc = _dyn(req)
    try:
        return {**simulate(net, sc), "scenario": sc}
    except (KeyError, StopIteration, ValueError) as exc:
        raise HTTPException(422, f"Network or scenario error: {exc}") from exc


@app.post("/api/dynamics/report.pdf")
def dynamics_report(req: DynRequest):
    from compsuite.dynamics.engine import simulate
    from compsuite.dynamics.report import dynamics_report as rep
    from compsuite.reporting import prism
    DN, net, sc = _dyn(req)
    res = simulate(net, sc)
    comp = [(k, DN.SCENARIOS[k]["title"], simulate(net, DN.scenario(k, net))["summary"]) for k in DN.SCENARIOS] if req.all else []
    with prism._LOCK:
        pdf = rep(req.project, net, sc, res, comp, req.images.get("pid"))
    return _pdf(pdf, req.project, "dynamics")


class RDReportRequest(BaseModel):
    project: Project
    casing: int = 0


def _pdf(data: bytes, project, kind: str):
    return Response(data, media_type="application/pdf",
                    headers={"Content-Disposition": f'attachment; filename="{project.name.replace(" ", "_")}_{kind}.pdf"'})


@app.post("/api/{kind}/analysis-report.pdf")
def rotordynamics_report(kind: str, req: RDReportRequest):
    """Lateral, stability or torsional analysis report (needs a full-level run, reused from the cache)."""
    from compsuite.reporting import prism
    from compsuite.reporting import rotordynamics_reports as R
    res = _run_cached(req.project, "full")
    if not 0 <= req.casing < len(res["casings"]):
        raise HTTPException(422, "No such casing")
    if kind != "torsional" and not res["casings"][req.casing]["lateral"].get("bearing_cases"):
        raise HTTPException(422, "Lateral bearing cases not available")
    with prism._LOCK:
        if kind == "lateral":
            urt = None
            try:
                from compsuite.testing.mrt import mrt_analysis
                urt = mrt_analysis(req.project, res, req.casing)["urt"]
            except (KeyError, ValueError, IndexError):
                pass
            data = R.lateral_report(req.project, res, req.casing, urt)
        elif kind == "stability":
            data = R.stability_report(req.project, res, req.casing)
        elif kind == "torsional":
            data = R.torsional_report(req.project, res)
        else:
            raise HTTPException(404, "Unknown report")
    return _pdf(data, req.project, f"{kind.title()}_analysis")


@app.get("/api/test-tags")
def test_tags():
    from compsuite.testing.tags import GLOSSARY, tag_table
    return {"tags": tag_table(), "glossary": GLOSSARY}


class PTCRequest(BaseModel):
    project: Project
    options: dict[str, Any] = Field(default_factory=dict)            # test_type, method, selection, speed_adjust_pct, limits ...
    logs: dict[str, Any] = Field(default_factory=dict)               # {section: {"0.900": [readings]}}; empty = simulated example
    images: dict[str, str] = Field(default_factory=dict)             # report pictures captured in the app (data-URL PNG)


_ptc_cache: "OrderedDict[str, dict]" = OrderedDict()


def _ptc(req: PTCRequest) -> tuple[dict, dict]:
    import hashlib
    import json
    from compsuite.testing.ptc10 import ptc10_analysis
    res = _cache.get(f"{input_hash(req.project)}:full") or _run_cached(req.project, "fast")
    key = hashlib.sha1(json.dumps([input_hash(req.project), req.options, req.logs], sort_keys=True, default=str).encode()).hexdigest()
    if key not in _ptc_cache:
        try:
            _ptc_cache[key] = ptc10_analysis(req.project, res, req.options, req.logs)
        except (ValueError, KeyError) as exc:
            raise HTTPException(422, f"Performance test calculation failed: {exc}") from exc
        while len(_ptc_cache) > 6:
            _ptc_cache.popitem(last=False)
    return _ptc_cache[key], res


@app.post("/api/ptc10")
def ptc10(req: PTCRequest):
    return jsonable(_ptc(req)[0])


@app.post("/api/ptc10/report.pdf")
def ptc10_pdf(req: PTCRequest):
    from compsuite.reporting import prism
    from compsuite.testing.mrt import test_train
    from compsuite.testing.ptc10 import ptc10_report
    out, res = _ptc(req)
    comps = test_train(req.project, res, res["casings"][0]["lateral"]["speeds"], {})["components"]
    with prism._LOCK:
        pdf = ptc10_report(req.project, out, comps, req.images)
    return Response(pdf, media_type="application/pdf",
                    headers={"Content-Disposition": f'attachment; filename="{req.project.name.replace(" ", "_")}_PTC10.pdf"'})


# ---------------------------------------------------------------- charts
class PlotRequest(BaseModel):
    spec: dict[str, Any]
    opts: dict[str, Any] = Field(default_factory=dict)
    dpi: int = Field(600, ge=72, le=1200)


_plot_cache: "OrderedDict[str, dict]" = OrderedDict()


@app.post("/api/plot")
def plot(req: PlotRequest):
    """Render a chart in the GraphPad Prism style: SVG plus axes metadata for the data cursor."""
    import hashlib
    import json
    from compsuite.reporting.prism import render
    key = hashlib.sha1(json.dumps([req.spec, req.opts], sort_keys=True, default=str).encode()).hexdigest()
    if key not in _plot_cache:
        try:
            r = render(req.spec, req.opts, "svg")
        except (ValueError, TypeError, KeyError) as exc:
            raise HTTPException(422, f"Chart could not be drawn: {exc}") from exc
        _plot_cache[key] = {"svg": r["content"], "meta": r["meta"]}
        while len(_plot_cache) > 64:
            _plot_cache.popitem(last=False)
    return _plot_cache[key]


@app.post("/api/plot/export/{fmt}")
def plot_export(fmt: Literal["png", "svg", "pdf"], req: PlotRequest):
    from compsuite.reporting.prism import render
    r = render(req.spec, req.opts, fmt, dpi=req.dpi)
    media = {"png": "image/png", "svg": "image/svg+xml", "pdf": "application/pdf"}[fmt]
    return Response(r["content"], media_type=media, headers={"Content-Disposition": f'attachment; filename="chart.{fmt}"'})


# ---------------------------------------------------------------- frontend
_dist = resource_root() / "frontend" / "dist"
_built = (_dist / "index.html").is_file() and (_dist / "assets").is_dir()
if not _built:
    @app.get("/", include_in_schema=False)
    def frontend_missing():
        return HTMLResponse(
            "<h2>CentriForge</h2><p>The API is running, but the browser app has not been built.</p>"
            "<p>Install Node.js 18+, then run:</p><pre>cd frontend\nnpm ci\nnpm run build</pre>"
            "<p>and restart <code>compsuite serve</code>. API docs: <a href='/docs'>/docs</a></p>")

if _built:
    app.mount("/assets", StaticFiles(directory=_dist / "assets"), name="assets")

    @app.get("/{path:path}", include_in_schema=False)
    def spa(path: str):
        f = _dist / path
        if path and f.is_file():
            return FileResponse(f)
        return FileResponse(_dist / "index.html")
