import { useEffect, useMemo, useState } from "react";
import { api, download, fmt, type Json } from "../api";
import { Plot, SERIES } from "../components/Plot";
import { saveProject } from "../files";
import { SchemaForm } from "../components/SchemaForm";
import { Disclaimer, NeedRun, sub, Kpis, Table, Trace, type Ctx } from "./common";

export function AuxPage(c: Ctx) {
  const r = c.results;
  if (!r) return <NeedRun results={r} />;
  const l = r.lube;
  const p = r.piping;
  return (
    <>
      <h2>Lube oil & piping</h2>
      <p className="lead">Oil flow from bearing losses, pump, cooler and reservoir sizing (API 614 considerations); suction and
        discharge line sizing, compressible pressure drop, recycle valve (IEC 60534) and flow meter (ISO 5167); system curve.</p>
      <div className="grid">
        <div className="card"><h3>Lube oil system</h3>
          <Table rows={[["Journal losses", `${fmt(l.journal_loss_kw, 1)} kW`], ["Thrust loss", `${fmt(l.thrust_loss_kw, 1)} kW`],
            ["Normal oil flow", `${fmt(l.normal_flow_l_min, 0)} L/min`], ["Pump rated flow", `${fmt(l.pump_rated_flow_l_min, 0)} L/min`],
            ["Pump shaft power", `${fmt(l.pump_shaft_kw, 1)} kW`], ["Cooler duty", `${fmt(l.cooler_duty_kw, 1)} kW`],
            ["Cooler LMTD", `${fmt(l.cooler_lmtd_c, 1)} °C`], ["Cooler area (incl. fouling)", `${fmt(l.cooler_area_m2, 2)} m²`],
            ["Cooling water", `${fmt(l.cooling_water_m3_h, 1)} m³/h`], ["Reservoir working volume", `${fmt(l.reservoir_working_l, 0)} L`],
            ["Oil viscosity at drain", `${fmt(l.oil_viscosity_cst_at_drain, 1)} cSt`]]} cols={[["Item", (x) => x[0]], ["Value", (x) => x[1]]]} /></div>
        <div className="card"><h3>Process piping</h3>
          <Table rows={["suction", "discharge"].map((s) => ({ side: s, ...p[s] }))} cols={[["Line", (x) => x.side], ["NPS", (x) => String(x.nps_in)],
            ["ID mm", (x) => x.id_m * 1e3, 0], ["v m/s", (x) => x.velocity_m_s], ["ρv² Pa", (x) => x.rho_v2_pa, 0], ["Mach", (x) => x.mach, 3],
            ["Re", (x) => x.reynolds, 0], ["f", (x) => x.friction_factor, 4], ["ΔP bar", (x) => x.dp_bar, 3]]} />
          <p>Recycle valve Cv {fmt(p.recycle_valve.cv, 0)} (x = {fmt(p.recycle_valve.x, 2)}, {p.recycle_valve.choked ? "choked" : "not choked"}) ·
            Orifice β {fmt(p.flowmeter.beta, 2)}, C {fmt(p.flowmeter.C, 4)}, ΔP {fmt(p.flowmeter.dp_pa / 1e3, 1)} kPa</p></div>
      </div>
      <div className="card" style={{ marginTop: 14 }}><h3>Compressor and system curves at rated speed</h3>
        <Plot data={[{ x: p.system_curve.map((q: Json) => q.q_am3_h), y: p.system_curve.map((q: Json) => q.compressor_head_kj_kg), name: "Compressor (100 %)", mode: "lines" },
          { x: p.system_curve.map((q: Json) => q.q_am3_h), y: p.system_curve.map((q: Json) => q.system_head_kj_kg), name: "System", mode: "lines", line: { dash: "dash" } }]}
          layout={{ xaxis: { title: "Suction flow (Am³/h)" }, yaxis: { title: "Head (kJ/kg)" } }} /></div>
      <div className="grid" style={{ marginTop: 14 }}>
        <div className="card"><h3>Lube inputs</h3><SchemaForm schema={c.schema} def="LubeDesign" value={c.project.lube} onChange={(v) => sub(c, "lube", v)} /></div>
        <div className="card"><h3>Piping inputs</h3><SchemaForm schema={c.schema} def="PipingDesign" value={c.project.piping} onChange={(v) => sub(c, "piping", v)} /></div>
      </div>
      <Trace trace={l.trace} />
      <Trace trace={p.trace} />
    </>
  );
}


// ------------------------------------------------------------------ evaluate
const VARIABLES = ["shaft.shaft_diameter_at_impellers_mm", "shaft.journal_diameter_mm", "bearings.length_to_diameter", "bearings.radial_clearance_ratio",
  "bearings.preload", "bearings.pivot_offset", "design_basis.head_coefficient", "design_basis.first_stage_flow_coefficient",
  "design_basis.max_tip_speed_m_s", "design_basis.speed_rpm_override", "seals.labyrinth_teeth", "train.coupling_torsional_stiffness_nm_rad"];

export function OptimizePage(c: Ctx) {
  const [metrics, setMetrics] = useState<string[]>([]);
  const [variable, setVariable] = useState("bearings.preload");
  const [values, setValues] = useState("0.05, 0.15, 0.25, 0.35, 0.45");
  const [chosen, setChosen] = useState<string[]>(["logdec_with_qa", "bearing_loss_kw", "min_film_um"]);
  const [study, setStudy] = useState<Json>(null);
  const [sens, setSens] = useState<Json>(null);
  const [opt, setOpt] = useState<Json>(null);
  const [busy, setBusy] = useState("");
  const [err, setErr] = useState("");
  const [obj, setObj] = useState("logdec_with_qa");
  const [bounds, setBounds] = useState("0.05, 0.5");
  useEffect(() => { api.metrics().then(setMetrics).catch(() => undefined); }, []);
  const go = async (what: string, f: () => Promise<void>) => {
    setBusy(what); setErr("");
    try { await f(); } catch (e) { setErr((e as Error).message); } finally { setBusy(""); }
  };
  const toggle = (m: string) => setChosen(chosen.includes(m) ? chosen.filter((x) => x !== m) : [...chosen, m]);
  return (
    <>
      <h2>Engineering optimisation</h2>
      <p className="lead">Parametric studies, sensitivity analysis and constrained optimisation with the full workflow in the
        loop (fast level: coarser bearing tables, damped modes and Level I stability). Each evaluation takes a few seconds.</p>
      {err && <div className="error">{err}</div>}
      <div className="card">
        <h3>Metrics</h3>
        <div className="chips">{metrics.map((m) => <button key={m} className={`chip ${chosen.includes(m) ? "on" : ""}`} onClick={() => toggle(m)}>{m}</button>)}</div>
      </div>
      <div className="grid" style={{ marginTop: 14 }}>
        <div className="card">
          <h3>Parametric study</h3>
          <div className="form">
            <label>Variable<select value={variable} onChange={(e) => setVariable(e.target.value)}>{VARIABLES.map((v) => <option key={v}>{v}</option>)}</select></label>
            <label>Values (comma separated)<input value={values} onChange={(e) => setValues(e.target.value)} /></label>
          </div>
          <button className="btn primary" style={{ marginTop: 8 }} disabled={!!busy} onClick={() => go("p", async () => {
            setStudy(await api.parametric({ project: c.project, variable, values: values.split(",").map(Number).filter(Number.isFinite), metrics: chosen }));
          })}>{busy === "p" ? "Running…" : "Run study"}</button>
          {study && <>
            {study.metrics.map((m: string, i: number) => (
              <Plot key={m} height={220} data={[{ x: study.rows.map((r: Json) => r.value), y: study.rows.map((r: Json) => r[m]), mode: "lines+markers",
                name: m, line: { color: SERIES[i % 8] } }]} layout={{ xaxis: { title: study.variable }, yaxis: { title: m }, margin: { t: 10 } }} />
            ))}
          </>}
        </div>
        <div className="card">
          <h3>Sensitivity (normalised: % change of metric per % change of variable)</h3>
          <p className="muted">Uses the variables currently set (auto-estimated variables are skipped).</p>
          <button className="btn" disabled={!!busy} onClick={() => go("s", async () => {
            setSens(await api.sensitivity({ project: c.project, variables: ["bearings.length_to_diameter", "bearings.radial_clearance_ratio",
              "bearings.preload", "design_basis.head_coefficient", "design_basis.max_tip_speed_m_s"], metrics: chosen }));
          })}>{busy === "s" ? "Running (≈1 min)…" : "Run sensitivity"}</button>
          {sens && <Table rows={sens.sensitivities} cols={[["Variable", (r) => r.variable], ...sens.metrics.map((m: string) => [m, (r: Json) => r[m], 2] as [string, (r: Json) => unknown, number])]} />}
          <h3 style={{ marginTop: 16 }}>Optimise one variable</h3>
          <div className="form">
            <label>Objective (maximise)<select value={obj} onChange={(e) => setObj(e.target.value)}>{metrics.map((m) => <option key={m}>{m}</option>)}</select></label>
            <label>Bounds for “{variable}”<input value={bounds} onChange={(e) => setBounds(e.target.value)} /></label>
          </div>
          <button className="btn" style={{ marginTop: 8 }} disabled={!!busy} onClick={() => go("o", async () => {
            const [lo, hi] = bounds.split(",").map(Number);
            setOpt(await api.optimize({ project: c.project, variables: [{ path: variable, lower: lo, upper: hi }], objective: obj, sense: "max",
              constraints: [{ metric: "min_film_um", op: ">=", value: c.project.criteria.bearing_min_film_um }], max_evals: 12 }));
          })}>{busy === "o" ? "Optimising…" : "Optimise (constraint: min film ≥ criterion)"}</button>
          {opt && <p>Best {variable} = <strong>{fmt(opt.best.x[variable], 4)}</strong> → {obj} = {fmt(opt.best[obj], 4)} ·
            {opt.feasible ? " feasible" : " infeasible"} · {opt.evaluations} evaluations</p>}
          {opt && <Plot height={220} data={[{ x: opt.history.map((h: Json) => h.x[variable]), y: opt.history.map((h: Json) => h[obj]), mode: "markers", name: "evaluations" }]}
            layout={{ xaxis: { title: variable }, yaxis: { title: obj }, margin: { t: 10 } }} />}
        </div>
      </div>
    </>
  );
}

export function VerificationPage(c: Ctx) {
  const r = c.results;
  const [filter, setFilter] = useState<string>("all");
  const items = useMemo(() => (r ? r.checklist.items.filter((i: Json) => filter === "all" || i.status === filter) : []), [r, filter]);
  if (!r) return <NeedRun results={r} />;
  const n = r.checklist.counts;
  return (
    <>
      <h2>Engineering verification</h2>
      <p className="lead">Every module's checks against the version-controlled criteria, with source, reference and status.
        “Review” items are outside the software's scope and need qualified engineering review.</p>
      <Disclaimer />
      <Kpis items={[["Pass", String(n.pass)], ["Fail", String(n.fail)], ["Attention", String(n.attention)], ["For review", String(n.review)]]} />
      <div className="chips">{["all", "fail", "attention", "pass", "review"].map((s) => <button key={s} className={`chip ${filter === s ? "on" : ""}`} onClick={() => setFilter(s)}>{s}</button>)}</div>
      <div className="card">
        <div className="scroll"><table className="t">
          <thead><tr><th>Category</th><th>Check</th><th>Criterion</th><th>Value</th><th>Status</th><th>Reference</th><th>Module</th></tr></thead>
          <tbody>{items.map((i: Json, k: number) => (
            <tr key={k}><td>{i.category}</td><td>{i.check}{i.note && <div className="muted">{i.note}</div>}</td><td>{i.criterion}</td><td>{i.value}</td>
              <td><span className={`status ${i.status}`}>{i.status}</span></td><td>{i.reference}</td><td className="muted">{i.module}</td></tr>
          ))}</tbody>
        </table></div>
      </div>
      <p className="muted">Criteria basis: {r.checklist.criteria_edition}</p>
    </>
  );
}

export function ReportsPage(c: Ctx) {
  const [list, setList] = useState<Json[]>([]);
  const [revs, setRevs] = useState<Json[]>([]);
  const [hist, setHist] = useState<Json[]>([]);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState("");
  const [err, setErr] = useState("");
  const refresh = async () => {
    setList(await api.projects());
    if (c.savedId) { setRevs(await api.revisions(c.savedId)); setHist(await api.history(c.savedId)); }
  };
  useEffect(() => { refresh().catch(() => undefined); }, [c.savedId]); // eslint-disable-line react-hooks/exhaustive-deps
  const dl = async (kind: string) => {
    setBusy(kind); setErr("");
    try {
      await download(kind, c.project);
    } catch (e) { setErr((e as Error).message); } finally { setBusy(""); }
  };
  const save = async () => {
    setErr("");
    try {
      const rec = c.savedId ? await api.updateProject(c.savedId, c.project, note) : await api.createProject(c.project, note || "Created");
      c.setSavedId(rec.id);
      c.setProject(rec.project);
      setNote("");
      await refresh();
    } catch (e) { setErr((e as Error).message); }
  };
  const exportsList: [string, string][] = [["report.html", "Calculation report (HTML, printable)"], ["report.pdf", "Calculation report (PDF)"],
    ["results.xlsx", "Results workbook (Excel)"], ["results.json", "Full results (JSON)"], ["rotor.stl", "Rotor CAD (STL)"],
    ["rotor.step", "Rotor CAD (STEP, needs CadQuery)"], ["calculix-beam.inp", "CalculiX beam deck (frequency check)"],
    ["calculix-axisymmetric.inp", "CalculiX axisymmetric deck (centrifugal stress)"], ["scene.json", "3D scene (JSON)"]];
  return (
    <>
      <h2>Reports, revisions & history</h2>
      <p className="lead">Technical documentation with datasheet, figures, checklist and full traceability; CAD and FE exports;
        project revisions and calculation history stored on the server.</p>
      {err && <div className="error">{err}</div>}
      <div className="grid">
        <div className="card"><h3>Documents & exports</h3>
          {exportsList.map(([k, l]) => <div className="row" key={k} style={{ marginBottom: 6 }}>
            <button className="btn" disabled={!!busy} onClick={() => dl(k)}>{busy === k ? "Preparing…" : "Download"}</button><span>{l}</span></div>)}
        </div>
        <div className="card"><h3>Save project revision</h3>
          <div className="row"><input className="inp" style={{ flex: 1 }} placeholder="Revision note" value={note} onChange={(e) => setNote(e.target.value)} />
            <button className="btn primary" onClick={save}>{c.savedId ? "Save new revision" : "Save project"}</button></div>
          {revs.length > 0 && <Table rows={revs} cols={[["Rev", (r) => String(r.revision)], ["Saved", (r) => r.created], ["Note", (r) => r.note],
            ["Input hash", (r) => r.input_hash]]} />}
          {c.savedId && <button className="btn" style={{ marginTop: 8 }} onClick={async () => {
            const res = await api.runSaved(c.savedId!); c.setResults(res, c.project); await refresh();
          }}>Run saved revision and record in history</button>}
          {hist.length > 0 && <><h3 style={{ marginTop: 12 }}>Calculation history</h3>
            <Table rows={hist} cols={[["Run", (h) => String(h.id)], ["Rev", (h) => String(h.revision)], ["When", (h) => h.created],
              ["Version", (h) => h.software_version], ["Speed rpm", (h) => h.summary.speed_rpm, 0], ["Power kW", (h) => h.summary.shaft_power_kw, 0],
              ["Fails", (h) => String(h.summary.checklist.fail)]]} /></>}
        </div>
      </div>
      <div className="card" style={{ marginTop: 14 }}><h3>Saved projects</h3>
        <Table rows={list} cols={[["#", (p) => String(p.id)], ["Name", (p) => p.name], ["Revision", (p) => String(p.current_revision)], ["Updated", (p) => p.updated]]} />
        <div className="row" style={{ marginTop: 8 }}>
          {list.map((p) => <button key={p.id} className="btn" onClick={async () => {
            const rec = await api.getProject(p.id); c.setSavedId(p.id); c.setProject(rec.project);
          }}>Open #{p.id}</button>)}
          <button className="btn" onClick={async () => { const d = await api.defaults(); c.setSavedId(null); c.setProject(d); }}>New from example</button>
          <button className="btn" onClick={() => saveProject(c.project, null)}>Export project file</button>
          <label className="btn">Import project file
            <input type="file" accept=".json,application/json" hidden onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              try { const p = JSON.parse(await f.text()); c.setSavedId(null); c.setProject({ ...(await api.defaults()), ...p }); }
              catch (err) { alert(`Not a CentriForge project file: ${(err as Error).message}`); }
              e.target.value = "";
            }} />
          </label>
        </div>
      </div>
    </>
  );
}
