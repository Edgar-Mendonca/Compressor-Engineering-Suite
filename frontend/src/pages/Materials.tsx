import { Fragment, useEffect, useState } from "react";
import { api, fmt, type Json } from "../api";
import { Plot, SERIES } from "../components/Plot";
import { SchemaForm } from "../components/SchemaForm";
import { safeName, saveFrom } from "../files";

// Material assessment: per-location sour/wet service, SSC domains, corrosion acceptance,
// automatic selection, weld overlay, SOP and contaminants. Results from materials/assessment.py.

type Ctx = { schema: Json; project: Json; setProject: (p: Json) => void; results: Json };

const VERDICT: Record<string, [string, string]> = { outside: ["fail", "Outside limits"], evidence: ["attention", "Evidence needed"],
  within: ["pass", "Within limits"] };
const DOMAIN_FILL: Record<string, string> = { D0: "#2E9E6B", D1: "#E6C229", D2: "#F28E1C", D3: "#C0392B" };
const LIMITS: [string, string][] = [["min_temp_c", "Min T °C"], ["max_temp_c", "Max T °C"], ["max_hardness_hrc", "Max HRC"],
  ["measured_hardness_hrc", "Meas. HRC"], ["max_wet_ph2s_bar", "Wet pH₂S bar"], ["max_pco2_bar", "pCO₂ bar"], ["min_ph", "Min pH"],
  ["max_chloride_ppm", "Cl⁻ ppm"], ["corrosion_allowance_mm", "CA mm"]];
const OVR: [string, string, number][] = [["P_bara", "P bara", 2], ["T_c", "T °C", 1], ["h2o_pct", "H₂O %", 3], ["co2_pct", "CO₂ %", 2], ["h2s_pct", "H₂S %", 1]];
const TABS = ["Service conditions", "Charts", "Components & selection", "Cross-section", "Weld overlay & SOP", "Contaminants", "Criteria & inputs"];
const statusOf = (c: Json) => (c?.acceptance?.status === "fail" ? "outside" : c?.status ?? "evidence");

function Pill({ s }: { s: string }) {
  const cls = ["pass", "within", "compliant", "ok"].includes(s) ? "pass" : s === "fail" || s === "outside" ? "fail" : s === "review" ? "review" : "attention";
  return <span className={`pill ${cls}`}>{s}</span>;
}

/** Schematic half-section of a straight-through casing; each part coloured by its verdict, click for details. */
function CrossSection({ comps, n, sel, setSel, mode }: { comps: Json[]; n: number; sel: string; setSel: (s: string) => void; mode: string }) {
  const by = Object.fromEntries(comps.map((c) => [c.component, c]));
  const fill = (name: string) => {
    const c = by[name];
    if (!c) return "#C9CED3";
    if (mode === "environment") return c.wet ? "#4C9BEA" : "#C9CED3";
    return ({ outside: "#E57368", evidence: "#F2C46D", within: "#7CC69B" } as Record<string, string>)[statusOf(c)] ?? "#C9CED3";
  };
  const part = (name: string, el: JSX.Element) => (
    <g key={name + el.key} className={`xpart ${sel === name ? "sel" : ""}`} fill={fill(name)} onClick={() => setSel(name)}>
      <title>{name}{by[name] ? ` · ${by[name].material}` : ""}</title>{el}</g>);
  const N = Math.max(1, Math.min(n, 10));
  const x0 = 250, x1 = 690, w = (x1 - x0) / N;
  const overlay = new Set<string>(comps.filter((c) => c.selection?.overlay).map((c) => c.component));
  return (
    <svg viewBox="0 0 1000 360" className="xsec" role="img" aria-label="Compressor cross-section">
      <line x1="20" y1="335" x2="980" y2="335" stroke="#5B6878" strokeDasharray="14 5 3 5" strokeWidth="1" />
      {part("Shaft", <rect key="s" x="30" y="300" width="940" height="32" />)}
      {part("Casing", <path key="c" d="M150 40 H850 V82 H820 V8 H760 V82 H262 V8 H202 V82 H150 Z" />)}
      {part("Inlet cover", <rect key="ic" x="112" y="40" width="40" height="252" />)}
      {part("Discharge cover", <rect key="dc" x="848" y="40" width="40" height="252" />)}
      {part("Inlet plenum", <path key="ip" d="M168 90 H240 Q252 150 246 214 H222 Q228 150 214 114 H168 Z" />)}
      {Array.from({ length: N - 1 }, (_, i) => part("Diaphragms", <rect key={`d${i}`} x={x0 + w * (i + 1) - 7} y="96" width="14" height="150" />))}
      {Array.from({ length: N }, (_, i) => {
        const a = x0 + w * i + 10, b = a + w - 26;
        return part(i === 0 ? "First impeller" : "Other impellers",
          <path key={`i${i}`} d={`M${a} 296 L${a} 190 Q${a + 4} 150 ${b - 6} 140 L${b} 140 L${b} 296 Z`} />);
      })}
      {part("Discharge scroll", <rect key="ds" x="704" y="100" width="70" height="96" rx="34" />)}
      {part("Balance drum", <rect key="bd" x="784" y="246" width="54" height="52" />)}
      {part("Shaft sleeve", <rect key="sl" x="168" y="288" width="72" height="11" />)}
      {Array.from({ length: N }, (_, i) => part("Labyrinths", <rect key={`l${i}`} x={x0 + w * i + 4} y="262" width="8" height="20" />))}
      {part("Labyrinths", <rect key="lb" x="790" y="236" width="42" height="9" />)}
      {(overlay.has("Casing") || overlay.has("Inlet cover")) &&
        <path d="M152 292 V44 M202 82 V8 M262 8 V82 H330" fill="none" stroke="#B5D334" strokeWidth="6" pointerEvents="none" opacity=".9" />}
      <text x="232" y="28" className="xlab">Inlet</text><text x="790" y="28" className="xlab">Discharge</text>
    </svg>
  );
}

export function MaterialsPage(c: Ctx) {
  const [db, setDb] = useState<Json>(null);
  const [tab, setTab] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const [sel, setSel] = useState("First impeller");
  const [mode, setMode] = useState("verdict");
  const [busy, setBusy] = useState(false);
  useEffect(() => { api.materials().then(setDb).catch(() => undefined); }, []);
  const p = c.project, ma = p.material_assessment, res = c.results?.material_assessment;
  const setMA = (v: Json) => c.setProject({ ...p, material_assessment: v });
  const comps: Json[] = res?.components ?? [];
  const records: Json[] = ma.records.length ? ma.records : comps.map((x: Json) => {
    const keep = ["component", "material", "wetted_surface", "evidence_reference", "verified", "component_class", "overlay", ...LIMITS.map(([k]) => k),
      "max_dry_ph2s_bar", "corrosion_resistant"];
    return Object.fromEntries(keep.filter((k) => k in x).map((k) => [k, x[k]]));
  });
  const setRec = (i: number, k: string, v: unknown) => setMA({ ...ma, records: records.map((x, j) => (j === i ? { ...x, [k]: v } : x)) });
  const nval = (v: string) => (v === "" ? null : parseFloat(v));
  const cond: Json[] = res?.conditions ?? [];
  const ovr = (loc: string) => ma.stage_overrides.find((o: Json) => o.location === loc) ?? {};
  const setOvr = (loc: string, k: string, v: number | null) => {
    const rest = ma.stage_overrides.filter((o: Json) => o.location !== loc);
    const cur = { ...ovr(loc), location: loc, [k]: v };
    const any = Object.entries(cur).some(([kk, vv]) => kk !== "location" && vv !== null && vv !== undefined);
    setMA({ ...ma, stage_overrides: any ? [...rest, cur] : rest });
  };
  const n = c.results?.casings?.reduce((a: number, k: Json) => a + k.impellers.impellers.length, 0) ?? 6;
  const report = async () => {
    setBusy(true);
    try { await saveFrom("/api/export/material-selection.pdf", { project: p, level: "full" }, `${safeName(p.name)}_material_selection.pdf`); }
    finally { setBusy(false); }
  };

  const dp = res?.charts?.dew_point, ssc = res?.charts?.ssc;
  const picked = comps.find((x) => x.component === sel);
  const maxDomain = cond.reduce((a, x) => Math.max(a, x.domain_index ?? 0), 0);

  return (
    <>
      <div className="row" style={{ alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <h2>Material assessment</h2>
          <p className="lead">Sour and wet service at every location of the compressor: partial pressures, water dew point, condensed-water pH,
            SSC severity domain and corrosion rate, checked against the acceptance criteria per component, with an automatic material
            selection. A material only passes with a recorded, verified service basis.</p>
        </div>
        <button className="btn primary" disabled={!res || busy} onClick={report}>{busy ? "Preparing…" : "Material selection report (PDF)"}</button>
      </div>
      {!res ? <p className="muted">Run the analysis to see the assessment.</p> : <>
        <div className="kpis">
          {[["Wet locations", cond.filter((x) => x.wet).map((x) => x.location).join(", ") || "none"],
            ["Highest SSC domain", cond.some((x) => x.sour) ? `Domain ${maxDomain}` : "not sour"],
            ["Corrosion acceptance", `${comps.filter((x) => x.acceptance?.status === "fail").length} fail`],
            ["Evidence needed", String(res.counts.evidence)], ["Outside limits", String(res.counts.outside)],
            ["Weld overlay", res.weld_overlay?.required ? `required · ${res.weld_overlay.alloy}` : "not required"],
            ["SOP trip setpoint", res.sop?.trip_setpoint_c != null ? `${fmt(res.sop.trip_setpoint_c, 1)} °C` : "–"]].map(([l, v]) => (
            <div className="kpi" key={l}><div className={`v ${String(v).length > 16 ? "long" : ""}`}>{v}</div><div className="l">{l}</div></div>))}
        </div>
        <div className="seg" style={{ marginBottom: 14 }}>{TABS.map((t, i) => <button key={t} className={tab === i ? "on" : ""} onClick={() => setTab(i)}>{t}</button>)}</div>

        {tab === 0 && <div className="card">
          <h3>Service conditions by location — edit any input to override the process value</h3>
          <div className="scroll"><table className="t">
            <thead><tr><th>Location</th>{OVR.map(([, l]) => <th key={l}>{l}</th>)}<th>pH₂S bar</th><th>pCO₂ bar</th><th>pH</th>
              <th>Severity</th><th>Moisture</th><th>Dew °C</th><th>CR mm/y</th><th>Loss {res.design_life_years} y mm</th></tr></thead>
            <tbody>{cond.map((x) => (
              <tr key={x.location} className={x.sop ? "soprow" : ""}>
                <td><b>{x.location}</b>{x.source === "override" && <span className="pill blue" style={{ marginLeft: 6 }}>override</span>}</td>
                {OVR.map(([k, , nd]) => <td key={k}><input className="inp cell" type="number" step="any" value={ovr(x.location)[k] ?? ""}
                  placeholder={fmt(x[k], nd)} onChange={(e) => setOvr(x.location, k, nval(e.target.value))} /></td>)}
                <td className="n">{fmt(x.ph2s_bar, 3)}</td><td className="n">{fmt(x.pco2_bar, 3)}</td><td className="n">{fmt(x.ph, 2)}</td>
                <td><span className="dom" style={{ background: DOMAIN_FILL[x.domain] ?? "#999" }}>{x.sour ? `Domain ${x.domain_index}` : "Non-sour"}</span></td>
                <td><span className={`pill ${x.wet ? "fail" : "muted"}`}>{x.moisture}</span></td>
                <td className="n">{fmt(x.water_dew_point_c, 1)}</td><td className="n">{fmt(x.cr_mm_y, 3)}</td><td className="n">{fmt(x.cumulative_loss_mm, 2)}</td>
              </tr>))}</tbody>
          </table></div>
          <p className="muted small">Blank inputs use the compressor results; typed values override them (e.g. vendor or measured data). Carbon-steel corrosion
            rate from de Waard–Milliams × {ma.corrosion_factor} with the O₂ factor; SOP rows {ma.sop.protected ? "are protected by the dew-point trip and not counted in component loss" : "count towards component loss"}.</p>
        </div>}

        {tab === 1 && dp && ssc && <div className="grid">
          <div className="card"><h3>Water partial pressure vs temperature</h3>
            <Plot height={380} data={[
              { x: dp.saturation.map((q: number[]) => q[0]), y: dp.saturation.map((q: number[]) => q[1]), mode: "lines", name: "Water saturation", line: { color: "#0C1A2B" } },
              { x: dp.margin.map((q: number[]) => q[0]), y: dp.margin.map((q: number[]) => q[1]), mode: "lines", name: `Margin curve (+${dp.margin_c} °C)`, line: { color: SERIES[5], dash: "dash" } },
              ...[["Wet", (q: Json) => q.wet && !q.sop, "#C0392B", "circle"], ["Dry", (q: Json) => !q.wet && !q.sop, SERIES[0], "circle"], ["SOP", (q: Json) => q.sop, SERIES[4], "square"]].map(
                ([name, f, col, sym]) => {
                  const pts = dp.points.filter(f as (q: Json) => boolean);
                  return { x: pts.map((q: Json) => q.x), y: pts.map((q: Json) => q.y), text: pts.map((q: Json) => q.location), mode: "markers+text", name, marker: { color: col, symbol: sym, size: 9 } };
                })]}
              layout={{ xaxis: { title: "Temperature (°C)", range: [0, 200] }, yaxis: { title: "H₂O partial pressure (bar)", type: dp.y_type } }} />
            <p className="muted small">{dp.note}</p></div>
          <div className="card"><h3>SSC severity domains (pH vs pH₂S)</h3>
            <Plot height={380} data={[
              ...ssc.boundaries.map((b: Json) => ({ x: b.points.map((q: number[]) => q[0]), y: b.points.map((q: number[]) => q[1]), mode: "lines", name: b.name, line: { color: "#2C65B0" }, showlegend: false })),
              ...[["Locations", (q: Json) => !q.sop, "#C0392B", "circle"], ["SOP", (q: Json) => q.sop, SERIES[4], "square"]].map(([name, f, col, sym]) => {
                const pts = ssc.points.filter(f as (q: Json) => boolean);
                return { x: pts.map((q: Json) => Math.max(q.x, ssc.x_range[0])), y: pts.map((q: Json) => q.y), mode: "markers", name, marker: { color: col, symbol: sym, size: 8 } };
              })]}
              layout={{ xaxis: { title: "pH₂S (bar)", type: "log", range: [Math.log10(ssc.x_range[0]), Math.log10(ssc.x_range[1])] },
                yaxis: { title: "pH", range: ssc.y_range },
                shapes: [...ssc.regions.map((r: Json) => ({ type: "polygon", points: r.polygon, fillcolor: DOMAIN_FILL[r.domain], opacity: 0.16 })),
                  { type: "line", x0: ssc.sour_threshold_bar, x1: ssc.sour_threshold_bar, yref: "paper", y0: 0, y1: 1, line: { color: "#2C65B0", width: 1.6 } }],
                annotations: ssc.regions.map((r: Json) => ({ x: r.label_at[0], y: r.label_at[1], text: `Domain ${r.label}`, color: "#7A1F14", bold: true, align: "center" })) }} />
            <p className="muted small">{ssc.note}</p></div>
        </div>}

        {tab === 2 && <div className="card">
          <h3>Components — automatic selection, corrosion acceptance and evidence</h3>
          <div className="scroll"><table className="t">
            <thead><tr><th>Component</th><th>Service</th><th>Proposed material</th><th>Overlay</th><th>NACE</th><th>Max HRC</th><th>Min T °C</th>
              <th>CR / limit mm/y</th><th>Loss / limit mm</th><th>Verdict</th></tr></thead>
            <tbody>{comps.map((x, i) => {
              const [cls, txt] = VERDICT[statusOf(x)] ?? VERDICT.evidence;
              const s = x.selection ?? {};
              return (<Fragment key={x.component}>
                <tr className="click" onClick={() => setOpen(open === i ? null : i)}>
                  <td><b>{x.component}</b></td>
                  <td><span className={`pill ${x.wet ? "fail" : "muted"}`}>{x.wet ? "WET" : "DRY"}</span> {x.domain}</td>
                  <td>{s.designation ?? x.material}</td><td>{s.overlay ?? "–"}</td><td><Pill s={s.nace ?? "review"} /></td>
                  <td className="n">{s.max_hrc ?? "–"}</td><td className="n">{s.min_temp_c ?? "–"}</td>
                  <td className="n">{fmt(x.cr_mm_y, 3)} / {fmt(x.limit_cr, 3)}</td><td className="n">{fmt(x.loss_mm, 2)} / {fmt(x.limit_total, 1)}</td>
                  <td><span className={`badge ${cls}`}>{txt}</span></td>
                </tr>
                {open === i && <tr><td colSpan={10}><div className="detail">
                  <div><div className="mono caps label">Why this material</div><ul>{(s.rationale ?? []).map((t: string) => <li key={t}>{t}</li>)}</ul>
                    {s.alternatives?.length > 0 && <><div className="mono caps label">Alternatives</div><ul>{s.alternatives.map((t: string) => <li key={t}>{t}</li>)}</ul></>}
                    {s.nace_note && <p className="muted small">{s.nace_note}</p>}</div>
                  <div><div className="mono caps label">Checks</div><div className="verdict">
                    {x.failures.map((t: string) => <div key={t} className="status fail">✕ {t}</div>)}
                    {x.missing.map((t: string) => <div key={t} className="status attention">○ {t}</div>)}
                    {x.checks.map((t: string) => <div key={t} className="status pass">✓ {t}</div>)}</div></div>
                  <div><div className="mono caps label">Record (your documented limits)</div>
                    <div className="form">
                      <label>Material<select value={records[i]?.material} onChange={(e) => setRec(i, "material", e.target.value)}>
                        {(db?.materials ?? [{ key: records[i]?.material }]).map((m: Json) => <option key={m.key}>{m.key}</option>)}</select></label>
                      <label>Evidence reference<input value={records[i]?.evidence_reference ?? ""} placeholder="doc / cert ref" onChange={(e) => setRec(i, "evidence_reference", e.target.value)} /></label>
                      <label className="check"><input type="checkbox" checked={!!records[i]?.verified} onChange={(e) => setRec(i, "verified", e.target.checked)} />Verified</label>
                      {LIMITS.map(([k, l]) => <label key={k}>{l}<input type="number" step="any" value={records[i]?.[k] ?? ""} onChange={(e) => setRec(i, k, nval(e.target.value))} /></label>)}
                    </div></div>
                </div></td></tr>}
              </Fragment>);
            })}</tbody>
          </table></div>
          <p className="muted small">Click a row for the rationale, checks and the record editor. Edit records from qualified documents, then re-run.</p>
        </div>}

        {tab === 3 && <div className="grid">
          <div className="card"><h3>Cross-section — click a part</h3>
            <div className="chips" style={{ marginBottom: 6 }}>{[["verdict", "Colour by verdict"], ["environment", "Colour by wet / dry"]].map(([k, l]) =>
              <button key={k} className={`chip ${mode === k ? "on" : ""}`} onClick={() => setMode(k)}>{l}</button>)}</div>
            <CrossSection comps={comps} n={n} sel={sel} setSel={setSel} mode={mode} />
            <div className="legend">{mode === "verdict" ? <>
              <span className="sw" style={{ background: "#7CC69B" }} />Within <span className="sw" style={{ background: "#F2C46D" }} />Evidence needed
              <span className="sw" style={{ background: "#E57368" }} />Outside / acceptance fail</> : <>
              <span className="sw" style={{ background: "#4C9BEA" }} />Wet <span className="sw" style={{ background: "#C9CED3" }} />Dry</>}
              <span className="sw" style={{ background: "#B5D334" }} />Weld overlay</div>
          </div>
          <div className="card accent">{picked ? <>
            <h3>{picked.component}</h3>
            <div className="pname">{picked.selection?.designation ?? picked.material}</div>
            <p className="muted">{picked.location} · {picked.wet ? "wet" : "dry"} · {picked.domain} · surface {picked.surface}</p>
            <table className="t"><tbody>
              {[["NACE", picked.selection?.nace], ["Max hardness", picked.selection?.max_hrc != null ? `${picked.selection.max_hrc} HRC` : "–"],
                ["Min temperature", `${picked.selection?.min_temp_c ?? "–"} °C (MDMT ${picked.selection?.mdmt_c ?? res.mdmt_c} °C)`],
                ["Corrosion rate", `${fmt(picked.cr_mm_y, 3)} mm/y (limit ${fmt(picked.limit_cr, 3)})`],
                ["Loss over life", `${fmt(picked.loss_mm, 2)} mm (limit ${fmt(picked.limit_total, 1)})`],
                ["Verdict", (VERDICT[statusOf(picked)] ?? VERDICT.evidence)[1]]].map(([k, v]) => <tr key={k}><td className="muted">{k}</td><td>{v}</td></tr>)}
            </tbody></table>
            <ul>{(picked.selection?.rationale ?? []).map((t: string) => <li key={t}>{t}</li>)}</ul>
          </> : <p className="muted">Click a part of the section.</p>}</div>
        </div>}

        {tab === 4 && <div className="grid">
          <div className="card"><h3>Weld overlay <Pill s={res.weld_overlay.status} /></h3>
            <p>{res.weld_overlay.statement}</p>
            <table className="t"><thead><tr><th>Check</th><th>Criterion</th><th>Value</th><th>Status</th></tr></thead>
              <tbody>{res.weld_overlay.checks.map((k: Json) => <tr key={k.check}><td>{k.check}{k.note && <div className="muted small">{k.note}</div>}</td>
                <td>{k.criterion}</td><td>{k.value ?? "–"}</td><td><Pill s={k.status} /></td></tr>)}</tbody></table>
            <div className="mono caps label" style={{ marginTop: 12 }}>Process steps</div>
            <ol>{res.weld_overlay.process_steps.map((t: string) => <li key={t}>{t}</li>)}</ol>
            <SchemaForm schema={c.schema} def="WeldOverlay" value={ma.weld_overlay} onChange={(v) => setMA({ ...ma, weld_overlay: v })} />
          </div>
          <div className="card"><h3>Settle-out (SOP) and standstill <Pill s={res.sop.status} /></h3>
            <div className="kpis">{[["SOP pressure", `${fmt(res.sop.pressure_bara, 2)} bara`], ["SOP water dew point", `${fmt(res.sop.dew_point_c, 1)} °C`],
              ["Trip setpoint", `${fmt(res.sop.trip_setpoint_c, 1)} °C`], ["Max pressurised standstill", `${res.sop.standstill_hours_max} h`]].map(([l, v]) =>
              <div className="kpi" key={l}><div className="v">{v}</div><div className="l">{l}</div></div>)}</div>
            <ul>{res.sop.statements.map((t: string) => <li key={t}>{t}</li>)}</ul>
            <SchemaForm schema={c.schema} def="SOPSettings" value={ma.sop} onChange={(v) => setMA({ ...ma, sop: v })} />
          </div>
        </div>}

        {tab === 5 && <div className="card"><h3>Contaminants</h3>
          <table className="t"><thead><tr><th>Item</th><th>Value</th><th>Limit</th><th>Status</th><th>Note</th></tr></thead>
            <tbody>{res.contaminants.map((k: Json) => <tr key={k.item}><td><b>{k.item}</b></td><td>{k.value ?? "–"}</td><td>{k.limit}</td>
              <td><Pill s={k.status} /></td><td className="muted">{k.note}</td></tr>)}</tbody></table>
          <div style={{ marginTop: 14 }}><SchemaForm schema={c.schema} def="Contaminants" value={ma.contaminants} onChange={(v) => setMA({ ...ma, contaminants: v })} /></div>
        </div>}

        {tab === 6 && <>
          <div className="card"><h3>Corrosion acceptance criteria (blade thickness used: {fmt(res.blade_thickness_mm, 1)} mm, {res.blade_thickness_basis})</h3>
            <table className="t"><thead><tr><th>Component class</th><th>Blade thickness</th><th>Max rate mm/y</th><th>Max total mm</th></tr></thead>
              <tbody>{ma.acceptance_criteria.map((k: Json, i: number) => {
                const upd = (f: string, v: number | null) => setMA({ ...ma, acceptance_criteria: ma.acceptance_criteria.map((q: Json, j: number) => (j === i ? { ...q, [f]: v } : q)) });
                return <tr key={i}><td>{k.component_class}</td>
                  <td>{k.component_class === "impeller" ? `> ${k.blade_min_mm ?? 0}${k.blade_max_mm ? ` ≤ ${k.blade_max_mm}` : ""} mm` : "–"}</td>
                  <td><input className="inp cell" type="number" step="any" value={k.max_cr_mm_y} onChange={(e) => upd("max_cr_mm_y", nval(e.target.value))} /></td>
                  <td><input className="inp cell" type="number" step="any" value={k.max_total_mm} onChange={(e) => upd("max_total_mm", nval(e.target.value))} /></td></tr>;
              })}</tbody></table></div>
          <div className="card" style={{ marginTop: 14 }}><h3>Assessment inputs</h3>
            <SchemaForm schema={c.schema} def="MaterialAssessment" value={ma} onChange={setMA} skip={["records"]} /></div>
          {db && <details className="card" style={{ marginTop: 14 }}><summary>Material database — {db._notice}</summary>
            <div className="scroll"><table className="t"><thead><tr>{["Material", "Family", "Sy MPa", "Su MPa", "T min °C", "T max °C", "Sour HRC max", "Corrosion"].map((h) => <th key={h}>{h}</th>)}</tr></thead>
              <tbody>{db.materials.map((m: Json) => <tr key={m.key}><td>{m.key}</td><td>{String(m.family).replace(/_/g, " ")}</td><td className="n">{m.yield_mpa}</td>
                <td className="n">{m.uts_mpa}</td><td className="n">{m.min_temp_c}</td><td className="n">{m.max_temp_c}</td><td className="n">{m.sour_max_hrc ?? "–"}</td>
                <td>{m.corrosion}</td></tr>)}</tbody></table></div></details>}
        </>}
      </>}
    </>
  );
}
