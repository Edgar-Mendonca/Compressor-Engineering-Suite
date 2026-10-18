import { useEffect, useState } from "react";
import { fmt, type Json } from "../api";
import { Plot, SERIES } from "../components/Plot";
import { FeaExplorer, Legend, Viewer, type View } from "../components/Fea3D";
import { safeName, saveBlob, saveFrom } from "../files";
import { ImpellerFEA, type Ctx } from "./Pages";

// Impeller FEA validation: a step-by-step report in the order of a vendor 3D FEA report
// (inputs, model, validation, results, bore contact, overspeed, acceptance, all impellers, export).

const STEPS = ["Inputs", "Model", "Model validation", "Results", "Bore contact", "Overspeed", "Acceptance", "All impellers", "Export"];
const MEANING: Record<string, string> = {
  von_mises_mpa: "von Mises equivalent stress — compare with yield; the hottest spot is where the wheel would yield first.",
  hoop_mpa: "Hoop (tangential) stress — drives bore growth, burst margin and the loss of shrink-fit contact.",
};
const VIEWS: [View["cam"], string][] = [["sector", "Sector close-up"], ["front", "Front (eye side)"], ["back", "Back (disk side)"]];
const col = (ok: boolean | null) => (ok === null ? "var(--muted)" : ok ? "var(--pass)" : "var(--fail)");

function Kpi({ l, v, ok = null }: { l: string; v: string; ok?: boolean | null }) {
  return <div className="kpi" style={{ borderTop: `3px solid ${col(ok)}` }}><div className={`v ${v.length > 16 ? "long" : ""}`} style={{ color: ok === false ? "var(--fail)" : undefined }}>{v}</div><div className="l">{l}</div></div>;
}

function T({ head, rows }: { head: string[]; rows: (string | number | JSX.Element | null | undefined)[][] }) {
  return (
    <div className="scroll"><table className="t"><thead><tr>{head.map((h) => <th key={h}>{h}</th>)}</tr></thead>
      <tbody>{rows.map((r, i) => <tr key={i}>{r.map((x, j) => <td key={j} className={typeof x === "number" ? "n" : ""}>{typeof x === "number" ? fmt(x, Math.abs(x) < 10 ? 3 : 1) : x ?? "–"}</td>)}</tr>)}</tbody></table></div>
  );
}

const Pill = ({ s }: { s: string }) => <span className={`pill ${s}`}>{s}</span>;

function Step({ n, title, children, lead }: { n: number; title: string; lead?: string; children: React.ReactNode }) {
  return (
    <section className="card" id={`fea-step-${n}`} style={{ marginTop: 14 }}>
      <div className="row" style={{ alignItems: "baseline", gap: 10 }}>
        <span className="mono" style={{ background: "var(--accent)", color: "var(--accent-ink)", padding: "2px 9px", fontWeight: 600 }}>{n}</span>
        <h3 style={{ margin: 0 }}>{title}</h3></div>
      {lead && <p className="muted small" style={{ marginTop: 6 }}>{lead}</p>}
      {children}
    </section>
  );
}

/** Meridional projection of the FE nodes with the restraints and loads drawn on. */
function ModelSketch({ r }: { r: Json }) {
  const N: number[][] = r.mesh.nodes_mm;
  const P = N.map(([x, y, z]) => [Math.hypot(x, y), z]);
  const rb = r.mesh.r_bore_mm, rt = r.mesh.r_tip_mm, zmax = Math.max(...P.map((p) => p[1]));
  const W = rt * 1.25, H = zmax * 1.35, pad = rt * 0.08;
  const bore = P.filter((p) => Math.abs(p[0] - rb) < 0.05);
  const X = (q: number) => q, Y = (q: number) => zmax - q;
  return (
    <svg viewBox={`${-pad} ${-pad} ${W + pad} ${H + pad}`} style={{ width: "100%", maxHeight: 340, background: "var(--panel)" }} role="img" aria-label="Model restraints and loads">
      {P.map((p, i) => <circle key={i} cx={X(p[0])} cy={Y(p[1])} r={rt / 260} fill="var(--accent)" opacity={0.55} />)}
      {/* axial restraint of the bore ring at the back face */}
      {[0, 1, 2].map((k) => <path key={k} d={`M${rb + k * rt * 0.02} ${Y(0)} l${-rt * 0.012} ${rt * 0.03} h${rt * 0.024} z`} fill="var(--fail)" />)}
      <text x={rb} y={Y(0) + rt * 0.07} fontSize={rt * 0.035} fill="var(--fail)">axial restraint (bore ring, back face)</text>
      {/* fit pressure on the bore */}
      {bore.filter((_, i) => i % Math.max(1, Math.floor(bore.length / 6)) === 0).map((p, i) =>
        <path key={i} d={`M${rb - rt * 0.07} ${Y(p[1])} h${rt * 0.06}`} stroke="var(--warm)" strokeWidth={rt / 200} markerEnd="url(#ar)" />)}
      <text x={rb - rt * 0.07} y={Y(zmax * 0.5)} fontSize={rt * 0.035} fill="var(--warm)" textAnchor="end">fit pressure</text>
      {/* centrifugal load */}
      <path d={`M${rt * 0.98} ${Y(zmax * 0.25)} h${rt * 0.14}`} stroke={SERIES[2]} strokeWidth={rt / 150} markerEnd="url(#ar)" />
      <text x={rt * 0.9} y={Y(zmax * 0.25) - rt * 0.03} fontSize={rt * 0.035} fill={SERIES[2]}>ω² r</text>
      <line x1={0} y1={Y(0) + rt * 0.1} x2={0} y2={-pad} stroke="var(--muted)" strokeDasharray="4 3" strokeWidth={rt / 400} />
      <text x={rt * 0.01} y={Y(0) + rt * 0.09} fontSize={rt * 0.03} fill="var(--muted)">axis</text>
      <defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="context-stroke" /></marker></defs>
    </svg>
  );
}

export function ImpellerFEAPage(c: Ctx) {
  const k = c.results?.casings?.[c.casing] ?? c.results?.casings?.[0];
  const [imp, setImp] = useState(0);
  const [opts, setOpts] = useState<Json>({ level: 2, interference_um_per_mm: 0, min_radial_interference_mm: 0, diffuser_vanes: 0, starts_per_year: 300 });
  const [r, setR] = useState<Json>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [t0, setT0] = useState(0);
  const [tick, setTick] = useState(0);
  const [caseName, setCaseName] = useState("MCS combined");
  const [field, setField] = useState("von_mises_mpa");
  const [rows, setRows] = useState<Json[]>([]);
  const [prog, setProg] = useState<[number, number] | null>(null);
  useEffect(() => { if (!busy && !prog) return; const t = setInterval(() => setTick(Date.now()), 500); return () => clearInterval(t); }, [busy, prog]);
  useEffect(() => { setR(null); setRows([]); }, [c.results]);
  if (!k) return <p className="muted">Run the analysis to see results.</p>;
  const imps: Json[] = k.impellers.impellers;
  const o = { ...opts, min_radial_interference_mm: opts.min_radial_interference_mm || undefined };
  const body = { project: c.project, casing: c.casing, impeller: imp, opts: o };
  const post = async (url: string, b: Json) => {
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b) });
    if (!res.ok) throw new Error((await res.json()).detail ?? res.statusText);
    return res.json();
  };
  const run = async () => {
    setBusy(true); setErr(""); setT0(Date.now());
    try { setR(await post("/api/fea3d", body)); } catch (e) { setErr((e as Error).message); } finally { setBusy(false); }
  };
  const runAll = async () => {
    setErr(""); setRows([]); setT0(Date.now());
    const acc: Json[] = [];
    try {
      for (let i = 0; i < imps.length; i++) {
        setProg([i, imps.length]);
        acc.push(...(await post("/api/fea3d/batch", { project: c.project, casing: c.casing, impellers: [i], opts: o })).rows);
        setRows([...acc]);
      }
    } catch (e) { setErr((e as Error).message); } finally { setProg(null); }
  };
  const s = r?.summary;
  const name = r ? `${safeName(c.project.name)}_impeller${r.impeller}` : "";
  const Sy = r?.material.yield_mpa;
  const acc: Json[] = r?.acceptance ?? [];
  const passAll = acc.every((a) => a.status === "pass");
  const vbase: View = { field, caseName, scale: 150, full: true, cut: 100, wire: false, mode: null, spin: false };
  const bp = r?.bore_path;
  const fr: Json[] = r?.overspeed_frames ?? [];

  return (
    <>
      <h2>Impeller FEA validation</h2>
      <p className="lead">3D cyclic-sector finite-element validation of each impeller, laid out like a vendor FEA report: inputs, model, model checks,
        stresses at MCS and overspeed, bore contact, acceptance criteria and a summary of all impellers.</p>
      <div className="card accent">
        <div className="toolbar">
          <select className="inp" value={imp} onChange={(e) => { setImp(Number(e.target.value)); setR(null); }} aria-label="Impeller">
            {imps.map((q, i) => <option key={i} value={i}>Impeller {q.index + 1} · D2 {fmt(q.D2_mm, 0)} mm{q.vendor ? " · vendor data" : ""}</option>)}</select>
          <label className="muted">Mesh<select className="inp" value={opts.level} onChange={(e) => setOpts({ ...opts, level: Number(e.target.value) })}>
            <option value={1}>Coarse</option><option value={2}>Medium</option><option value={3}>Fine</option></select></label>
          {([["interference_um_per_mm", "Fit µm/mm (0 = auto)", 0.1], ["min_radial_interference_mm", "Min radial interference mm (0 = vendor / auto)", 0.001],
            ["diffuser_vanes", "Diffuser vanes", 1], ["starts_per_year", "Starts / year", 10]] as const).map(([q, l, st]) =>
            <label key={q} className="muted">{l}<input className="inp cell" type="number" step={st} value={opts[q]} onChange={(e) => setOpts({ ...opts, [q]: Number(e.target.value) })} /></label>)}
          <button className="btn primary" disabled={busy || !!prog} onClick={run}>{busy ? `Solving… ${Math.round((tick - t0) / 1000) || 0} s` : r ? "Re-run 3D FEA" : "Run 3D FEA"}</button>
        </div>
        {err && <div className="error">{err}</div>}
        {!r && !busy && <p className="muted">Solves the selected impeller (about 10–30 s at the medium mesh): centrifugal, gas pressure, thermal and shrink-fit cases,
          the elastic-plastic overspeed, modes with stress stiffening and the fatigue checks. Vendor data entered on the Impeller design page are used automatically.</p>}
        {r && <>
          <div className="kpis">
            <Kpi l="Verdict" v={passAll ? "Qualified" : "Not qualified"} ok={passAll} />
            <Kpi l={`Max σvm @ MCS (yield ${fmt(Sy, 0)})`} v={`${fmt(s.peak_vm_mcs_mpa, 0)} MPa`} ok={s.peak_vm_mcs_mpa < Sy} />
            <Kpi l="Max σvm @ overspeed (scaled)" v={`${fmt(s.peak_vm_overspeed_scaled_mpa, 0)} MPa`} ok={s.peak_vm_overspeed_scaled_mpa < Sy} />
            <Kpi l="Max hoop @ MCS" v={`${fmt(s.peak_hoop_mcs_mpa, 0)} MPa`} />
            <Kpi l="Bore growth / min interference" v={`${fmt(s.max_bore_ur_mm, 3)} / ${fmt(s.min_radial_interference_mm, 3)} mm`} ok={s.contact_length_pct >= 50} />
            <Kpi l="Contact length @ MCS (≥ 50 %)" v={`${fmt(s.contact_length_pct, 0)} %`} ok={s.contact_length_pct >= 50} />
            <Kpi l="Permanent bore growth" v={`${fmt(s.permanent_bore_growth_um, 1)} µm`} />
            <Kpi l="FE mass" v={`${fmt(s.fe_mass_kg, 2)} kg`} />
          </div>
          <div className="chips" style={{ marginTop: 10 }}>{STEPS.map((t, i) =>
            <button key={t} className="chip" onClick={() => document.getElementById(`fea-step-${i + 1}`)?.scrollIntoView({ behavior: "smooth" })}>{i + 1} · {t}</button>)}</div>
        </>}
      </div>

      {r && <>
        <Step n={1} title="Inputs" lead="Speeds, basic impeller parameters (FE model vs vendor) and material data used in the analysis.">
          <div className="grid">
            <T head={["Speed", "rpm", "× MCS", "Tip speed m/s"]} rows={r.inputs.speeds.map((q: Json) => [q.speed, fmt(q.rpm, 0), fmt(q.ratio_mcs, 3), fmt(q.tip_speed_m_s, 1)])} />
            <T head={["Parameter", "Unit", "FE model", "Vendor", "Diff %"]} rows={r.inputs.basic.map((q: Json) => [q.parameter, q.unit, q.value, q.vendor,
              q.diff_pct == null ? null : <span style={{ color: col(Math.abs(q.diff_pct) <= 10) }}>{fmt(q.diff_pct, 1)}</span>])} />
          </div>
          <T head={["Material", "E GPa", "ν", "ρ kg/m³", "Yield MPa", "UTS MPa", "α µm/m·K", "Temperature °C", "Source"]} rows={[[r.inputs.material.name, fmt(r.inputs.material.E_gpa, 0),
            fmt(r.inputs.material.poisson, 2), fmt(r.inputs.material.density_kg_m3, 0), fmt(r.inputs.material.yield_mpa, 0), fmt(r.inputs.material.uts_mpa, 0),
            fmt(r.inputs.material.expansion_um_mk, 1), `${fmt(r.inputs.material.temperature_range_c[0], 0)} – ${fmt(r.inputs.material.temperature_range_c[1], 0)}`, r.inputs.material.source]]} />
        </Step>

        <Step n={2} title="Finite-element model" lead="One blade passage (hub, blade, shroud) meshed with hexahedra and tied by cyclic symmetry; the full wheel is the sector repeated.">
          <div className="kpis">{[["Element", "hex8"], ["Sector elements / nodes", `${r.model.elements} / ${r.model.nodes}`], ["Full wheel elements", String(r.model.elements_full)],
            ["DOF (sector)", String(r.model.dof)], ["Sector angle", `${fmt(r.model.sector_deg, 2)}°`],
            ["Thickness factors", Array.isArray(r.model.thickness_factor) ? r.model.thickness_factor.map((x: number) => fmt(x, 2)).join(" / ") : fmt(r.model.thickness_factor, 2)]].map(([l, x]) => <Kpi key={l} l={l} v={x} />)}</div>
          <div className="grid" style={{ marginTop: 10 }}>
            <Viewer r={r} v={{ ...vbase, caseName: "Standstill (fit only)", wire: true, cam: "sector", scale: 0 }} setProbe={() => undefined} anim={null} h={340} />
            <div><ModelSketch r={r} />
              <div className="grid" style={{ gap: 8 }}><div><strong className="small">Restraints</strong><ul className="small">{r.model.restraints.map((x: string) => <li key={x}>{x}</li>)}</ul></div>
                <div><strong className="small">Loads</strong><ul className="small">{r.model.loads.map((x: string) => <li key={x}>{x}</li>)}</ul></div></div></div>
          </div>
        </Step>

        <Step n={3} title="Model validation" lead="Checks that the element, mesh and solver give the right answer before the results are used.">
          <div className="grid">
            <T head={["Check", "Result", "Limit", "Status"]} rows={[
              ["Constant-strain patch test (impeller mesh)", `${r.validation.patch.constant_strain_error_pct.toExponential(1)} %`, "< 1e-6 %", <Pill s={r.validation.patch.pass ? "pass" : "fail"} />],
              ["Free thermal expansion, 100 K", `${r.validation.patch.free_thermal_vm_mpa.toExponential(1)} MPa`, "≈ 0", <Pill s={r.validation.patch.free_thermal_vm_mpa < 1e-3 ? "pass" : "fail"} />],
              ["Rotating disc: bore hoop FE / exact", `${fmt(r.validation.disc.hoop_bore_fe_mpa, 0)} / ${fmt(r.validation.disc.hoop_bore_exact_mpa, 0)} MPa (${fmt(r.validation.disc.hoop_error_pct, 1)} %)`, "± 5 %",
                <Pill s={Math.abs(r.validation.disc.hoop_error_pct) <= 5 ? "pass" : "fail"} />],
              ["Rotating disc: bore growth FE / exact", `${fmt(r.validation.disc.ur_bore_fe_um, 1)} / ${fmt(r.validation.disc.ur_bore_exact_um, 1)} µm (${fmt(r.validation.disc.ur_error_pct, 1)} %)`, "± 5 %",
                <Pill s={Math.abs(r.validation.disc.ur_error_pct) <= 5 ? "pass" : "fail"} />],
              ...(r.validation.axi_vs_3d ? [["2D axisymmetric vs 3D: peak σvm at MCS", `${fmt(r.validation.axi_vs_3d.vm_mcs_2d_mpa, 0)} / ${fmt(r.validation.axi_vs_3d.vm_mcs_3d_mpa, 0)} MPa`, "info", <Pill s="review" />],
                ["2D vs 3D: tip growth (centrifugal)", `${fmt(r.validation.axi_vs_3d.tip_growth_2d_um, 0)} / ${fmt(r.validation.axi_vs_3d.tip_growth_3d_um, 0)} µm`, "info", <Pill s="review" />]] : []),
              ...(s.convergence_error_pct != null ? [["Mesh convergence (average hoop, medium vs fine)", `${fmt(s.convergence_error_pct, 2)} %`, "≤ 5 %", <Pill s={s.convergence_error_pct <= 5 ? "pass" : "fail"} />]] : []),
            ]} />
            {r.convergence.length > 0 && <Plot height={300} data={[{ x: r.convergence.map((q: Json) => q.dof), y: r.convergence.map((q: Json) => q.peak_vm_mpa), name: "Peak von Mises", mode: "lines+markers" },
              { x: r.convergence.map((q: Json) => q.dof), y: r.convergence.map((q: Json) => q.avg_hoop_mpa), name: "Average hoop", mode: "lines+markers" }]}
              layout={{ title: "Mesh convergence (centrifugal MCS)", xaxis: { title: "DOF (sector)", type: "log" }, yaxis: { title: "Stress (MPa)" } }} />}
          </div>
          {k.impeller_fea && <details style={{ marginTop: 10 }}><summary className="muted">2D axisymmetric model (all impellers)</summary><ImpellerFEA fea={k.impeller_fea} /></details>}
        </Step>

        <Step n={4} title="Results per load case" lead="Three standard views per result. Click a view to probe; drag to rotate.">
          <div className="toolbar">
            <div className="seg">{Object.keys(r.cases).map((q) => <button key={q} className={caseName === q ? "on" : ""} onClick={() => setCaseName(q)}>{q}</button>)}</div>
            <div className="seg">{[["von_mises_mpa", "von Mises"], ["hoop_mpa", "Hoop"]].map(([q, l]) => <button key={q} className={field === q ? "on" : ""} onClick={() => setField(q)}>{l}</button>)}</div>
          </div>
          <div className="kpis">{[["Max", `${fmt(Math.max(...r.cases[caseName][field]), 0)} MPa`], ["Min", `${fmt(Math.min(...r.cases[caseName][field]), 0)} MPa`],
            ["Max / yield", fmt(Math.max(...r.cases[caseName][field]) / Sy, 2)]].map(([l, x]) => <Kpi key={l} l={l} v={x} ok={l === "Max / yield" ? Math.max(...r.cases[caseName][field]) < Sy : null} />)}</div>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", marginTop: 8 }}>
            {VIEWS.map(([cam, l]) => <div key={cam}><div className="mono caps label">{l}</div>
              <Viewer r={r} v={{ ...vbase, cam }} setProbe={() => undefined} anim={null} h={300} /></div>)}
          </div>
          <Legend vals={r.cases[caseName][field]} label={`${field === "hoop_mpa" ? "Hoop" : "von Mises"} (MPa) · ${caseName}`} />
          <p className="small" style={{ marginTop: 6 }}><strong>What this means:</strong> {MEANING[field]}</p>
        </Step>

        <Step n={5} title="Bore radial deformation and contact length" lead="Free bore growth at MCS along the bore axial length against the minimum radial interference; contact is kept where the growth (relative to the shaft) stays below the interference.">
          <div className="grid">
            <Plot height={320} data={[{ x: bp.z_mm, y: bp.ur_mm, name: "Bore radial deformation", mode: "lines+markers" },
              { x: bp.z_mm, y: bp.ur_mm.map((u: number) => u - bp.shaft_growth_mm), name: "Relative to shaft growth", mode: "lines", line: { dash: "dash" } },
              { x: [Math.min(...bp.z_mm), Math.max(...bp.z_mm)], y: [bp.min_radial_interference_mm, bp.min_radial_interference_mm], name: "Min radial interference", mode: "lines", line: { color: SERIES[1] } }]}
              layout={{ xaxis: { title: "Axial position from back face (mm)" }, yaxis: { title: "Radial (mm)" } }} />
            <div><div className="kpis">
              <Kpi l="Max bore radial deformation" v={`${fmt(s.max_bore_ur_mm, 4)} mm`} />
              <Kpi l={`Min radial interference (${bp.interference_source})`} v={`${fmt(bp.min_radial_interference_mm, 4)} mm`} />
              <Kpi l={`Contact length of ${fmt(bp.axial_length_mm, 0)} mm (≥ 50 %)`} v={`${fmt(bp.contact_length_pct, 0)} %`} ok={bp.contact_length_pct >= 50} />
              <Kpi l="Lift-off speed / MCS (≥ 1.15)" v={`${fmt(s.lift_off_rpm, 0)} rpm · ${fmt(s.lift_off_ratio, 2)}`} ok={s.lift_off_ratio >= 1.15} /></div>
              <p className="small" style={{ marginTop: 8 }}><strong>What this means:</strong> {bp.contact_length_pct >= 50 ? "the impeller stays clamped on the shaft over at least half of the bore at MCS, so torque transfer and centring are kept." : "the bore loses contact over more than half of its length at MCS: increase the interference or stiffen the hub."}</p></div>
          </div>
        </Step>

        <Step n={6} title="Overspeed" lead="Two methods: the MCS stress scaled with the speed ratio squared (vendor practice) and the elastic-plastic FE solution with the permanent growth after the test.">
          <div className="grid">
            <T head={["Method", "Peak σvm MPa", "Yield MPa", "Ratio", ""]} rows={[
              [`Scaled σ(MCS) × (Nos / Nmcs)² = × ${fmt(s.overspeed_ratio_sq, 3)}`, s.peak_vm_overspeed_scaled_mpa, Sy, s.peak_vm_overspeed_scaled_mpa / Sy, <Pill s={s.peak_vm_overspeed_scaled_mpa < Sy ? "pass" : "fail"} />],
              ["Elastic-plastic FE (bilinear)", s.peak_vm_overspeed_mpa, Sy, s.peak_vm_overspeed_mpa / Sy, <Pill s={s.peak_vm_overspeed_mpa < r.material.uts_mpa ? "pass" : "fail"} />],
              ["Yielded volume / permanent bore · eye · tip growth", `${fmt(s.plastic_volume_overspeed_pct, 2)} %`, `${fmt(s.permanent_bore_growth_um, 1)} · ${fmt(s.permanent_eye_growth_um, 1)} · ${fmt(s.permanent_tip_growth_um, 1)} µm`, null, null]]} />
            <Plot height={300} data={[{ x: fr.map((q) => q.speed_frac * 100), y: fr.map((q) => q.max_vm_mpa), name: "Peak σvm (FE, fit + centrifugal)", mode: "lines+markers" },
              { x: fr.map((q) => q.speed_frac * 100), y: fr.map((q) => s.peak_vm_mcs_mpa * q.speed_frac ** 2), name: "Scaled σ(MCS)·(N/Nmcs)²", mode: "lines", line: { dash: "dash" } },
              { x: [0, 115], y: [Sy, Sy], name: "Yield", mode: "lines", line: { color: SERIES[1] } }]}
              layout={{ xaxis: { title: "Speed (% MCS)" }, yaxis: { title: "Stress (MPa)" } }} />
          </div>
        </Step>

        <Step n={7} title="Acceptance criteria">
          <T head={["Criterion", "Value", "Limit", "Unit", "Status"]} rows={acc.map((a) => [a.criterion, a.value, a.limit, a.unit, <Pill s={a.status} />])} />
        </Step>

        <Step n={8} title="All impellers" lead="Runs the same 3D analysis for every impeller of the casing (one at a time, with progress) and summarises the qualification.">
          <div className="toolbar">
            <button className="btn primary" disabled={!!prog || busy} onClick={runAll}>{prog ? `Impeller ${prog[0] + 1} of ${prog[1]}… ${Math.round((tick - t0) / 1000) || 0} s` : "Run all impellers"}</button>
            {prog && <div className="progress" style={{ maxWidth: 360 }}><div style={{ width: `${(prog[0] / prog[1]) * 100}%` }} /><span className="small">{Math.round((prog[0] / prog[1]) * 100)} %</span></div>}
          </div>
          {rows.length > 0 && <T head={["Imp.", "Max σvm MCS", "Max σvm OS scaled", "Max σvm OS e-p", "Yield", "Bore growth mm", "Min interference mm", "Contact %", "Qualified"]}
            rows={rows.map((q) => [String(q.impeller), q.max_vm_mcs_mpa, q.max_vm_overspeed_scaled_mpa, q.max_vm_overspeed_ep_mpa, q.yield_mpa, fmt(q.max_bore_ur_mm, 4),
              fmt(q.min_radial_interference_mm, 4), q.contact_length_pct, <span title={q.fails.join("; ")}><Pill s={q.qualified ? "pass" : "fail"} /></span>])} />}
        </Step>

        <Step n={9} title="Export">
          <div className="row">
            <button className="btn primary" onClick={() => saveFrom("/api/fea3d/export/pdf", body, `${name}_fea.pdf`)}>FEA report (PDF)</button>
            <button className="btn" onClick={() => saveFrom("/api/fea3d/export/vtu", body, `${name}.vtu`)}>ParaView (.vtu, full 360°)</button>
            <button className="btn" onClick={() => saveFrom("/api/fea3d/export/inp", body, `${name}_ccx.inp`)}>CalculiX deck (.inp)</button>
            <button className="btn" onClick={() => saveBlob(new Blob([JSON.stringify({ summary: r.summary, inputs: r.inputs, acceptance: r.acceptance, validation: r.validation, bore_path: r.bore_path, all_impellers: rows }, null, 1)], { type: "application/json" }), `${name}_results.json`)}>Results (JSON)</button>
            <p className="muted small" style={{ flexBasis: "100%" }}>The PDF follows the steps above; impellers already solved with the same options are added to its summary table.</p>
          </div>
        </Step>

        <section className="card" style={{ marginTop: 14 }}>
          <h3>Detailed explorer — paths, modes & SAFE, spin test, fit, fatigue</h3>
          <FeaExplorer r={r} body={body} name={name} />
        </section>
      </>}
    </>
  );
}
