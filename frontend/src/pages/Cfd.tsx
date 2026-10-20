import { useEffect, useRef, useState } from "react";
import { fmt, type Json } from "../api";
import { safeName, saveFrom } from "../files";
import { LiveChart } from "../components/LiveChart";
import { ramp } from "../components/feaFields";
import { svgToPng } from "../components/testTags";
import type { Ctx } from "./Pages";

// CFD-lite (backend aero/cfdlite.py): meridional streamline-curvature field, blade-to-blade loading and plan view,
// vaneless diffuser / stall / volute, return-vane cascade, checks, report and CFD export. Particles move along the
// streamlines at the local velocity (animated).

const FIELDS: [string, string][] = [["Mrel", "Relative Mach"], ["W", "Relative velocity W (m/s)"], ["Wm", "Meridional velocity (m/s)"], ["C", "Absolute velocity C (m/s)"],
  ["p_bara", "Static pressure (bara)"], ["T_c", "Static temperature (°C)"], ["beta_deg", "Relative flow angle β (°)"]];
const col = (t: number) => `rgb(${ramp(t).map((c) => Math.round(c * 255)).join(",")})`;

function useClock() {
  const [t, setT] = useState(0);
  useEffect(() => { let raf = 0; const t0 = performance.now(); const f = (n: number) => { setT((n - t0) / 1000); raf = requestAnimationFrame(f); }; raf = requestAnimationFrame(f); return () => cancelAnimationFrame(raf); }, []);
  return t;
}

// particle at fraction (0..1) of a polyline, with time spent per segment ~ 1 / speed
function along(pts: number[][], spd: number[], u: number) {
  const seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]) / Math.max(spd[i] ?? 1, 1));
  const tot = seg.reduce((a, b) => a + b, 0);
  let s = (u % 1) * tot;
  for (let i = 0; i < seg.length; i++) {
    if (s <= seg[i]) { const f = s / (seg[i] || 1); return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f]; }
    s -= seg[i];
  }
  return pts[pts.length - 1];
}

function Bar({ lo, hi, label }: { lo: number; hi: number; label: string }) {
  return <div className="legend"><span>{fmt(lo, 2)}</span><div className="bar" style={{ background: `linear-gradient(90deg, ${[0, .2, .4, .6, .8, 1].map(col).join(",")})` }} /><span>{fmt(hi, 2)}</span><span className="muted">{label}</span></div>;
}

const Meridional = ({ m, field, t, svgRef }: { m: Json; field: string; t: number; svgRef?: React.Ref<SVGSVGElement> }) => {
  const R: number[][] = m.r_mm, Z: number[][] = m.z_mm, V: number[][] = m[field];
  const all = V.flat(), lo = Math.min(...all), hi = Math.max(...all);
  const zs = Z.flat(), rs = R.flat(), z0 = Math.min(...zs), z1 = Math.max(...zs), r0 = Math.min(...rs), r1 = Math.max(...rs);
  const W = 520, H = 520 * (r1 - r0 + 20) / (z1 - z0 + 20), X = (z: number) => 10 + ((z - z0) / (z1 - z0)) * (W - 20), Y = (r: number) => H - 10 - ((r - r0) / (r1 - r0)) * (H - 20);
  const nq = R.length, ns = R[0].length, quads = [];
  for (let i = 0; i < nq - 1; i++) for (let j = 0; j < ns - 1; j++) {
    const v = (V[i][j] + V[i + 1][j] + V[i][j + 1] + V[i + 1][j + 1]) / 4;
    quads.push(<path key={`${i}-${j}`} d={`M${X(Z[i][j])},${Y(R[i][j])} L${X(Z[i + 1][j])},${Y(R[i + 1][j])} L${X(Z[i + 1][j + 1])},${Y(R[i + 1][j + 1])} L${X(Z[i][j + 1])},${Y(R[i][j + 1])} Z`}
      fill={col((v - lo) / (hi - lo || 1))} stroke={col((v - lo) / (hi - lo || 1))} strokeWidth={0.6} />);
  }
  const lines = Array.from({ length: ns }, (_, j) => R.map((row, i) => [X(Z[i][j]), Y(row[j])]));
  const wall = (k: string) => m[k].map((p: number[], i: number) => `${i ? "L" : "M"}${X(p[1])},${Y(p[0])}`).join(" ");
  return <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxHeight: 560, background: "#fff" }}>
    {quads}
    {lines.map((l, j) => <path key={j} d={l.map((p, i) => `${i ? "L" : "M"}${p[0]},${p[1]}`).join(" ")} fill="none" stroke="#fff" strokeOpacity={0.6} strokeWidth={0.7} />)}
    <path d={wall("hub_mm")} fill="none" stroke="#0c1a2b" strokeWidth={2} /><path d={wall("shroud_mm")} fill="none" stroke="#0c1a2b" strokeWidth={2} />
    {[m.i_le, m.i_te].map((i: number) => <line key={i} x1={X(Z[i][0])} y1={Y(R[i][0])} x2={X(Z[i][ns - 1])} y2={Y(R[i][ns - 1])} stroke="#0c1a2b" strokeDasharray="4 3" />)}
    {lines.flatMap((l, j) => [0, 0.33, 0.66].map((o) => { const p = along(l, m.W.map((row: number[]) => row[j]), t * 0.18 + o + j * 0.07); return <circle key={`${j}${o}`} cx={p[0]} cy={p[1]} r={2.6} fill="#fff" stroke="#0c1a2b" strokeWidth={0.6} />; }))}
    <text x={W - 8} y={14} fontSize={10} textAnchor="end" fill="#5b6878">side view · z →, r ↑ · dashed: impeller LE / TE</text>
  </svg>;
};

const Plan = ({ p, t }: { p: Json; t: number }) => {
  const x: number[] = p.x_mm, y0: number[] = p.y_ps_mm, s: number[] = p.pitch_mm, Wf: number[][] = p.W, K = Wf[0].length;
  const ys = [...y0, ...y0.map((v, i) => v + 2 * s[i])], xmin = Math.min(...x), xmax = Math.max(...x), ymin = Math.min(...ys), ymax = Math.max(...ys);
  const W = 520, H = Math.min(620, 520 * (ymax - ymin) / (xmax - xmin)), X = (v: number) => 10 + ((v - xmin) / (xmax - xmin)) * (W - 20), Y = (v: number) => H - 10 - ((v - ymin) / (ymax - ymin)) * (H - 20);
  const all = Wf.flat(), lo = Math.min(...all), hi = Math.max(...all), quads = [];
  for (let k2 = 0; k2 < 2; k2++) for (let i = 0; i < x.length - 1; i++) for (let k = 0; k < K - 1; k++) {
    const yy = (ii: number, kk: number) => y0[ii] + (k2 + kk / (K - 1)) * s[ii], v = (Wf[i][k] + Wf[i + 1][k] + Wf[i][k + 1] + Wf[i + 1][k + 1]) / 4;
    quads.push(<path key={`${k2}${i}-${k}`} d={`M${X(x[i])},${Y(yy(i, k))} L${X(x[i + 1])},${Y(yy(i + 1, k))} L${X(x[i + 1])},${Y(yy(i + 1, k + 1))} L${X(x[i])},${Y(yy(i, k + 1))} Z`}
      fill={col((v - lo) / (hi - lo || 1))} stroke={col((v - lo) / (hi - lo || 1))} strokeWidth={0.6} />);
  }
  return <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxHeight: 620, background: "#fff" }}>{quads}
    {[0, 1, 2].map((k) => <path key={k} d={x.map((v, i) => `${i ? "L" : "M"}${X(v)},${Y(y0[i] + k * s[i])}`).join(" ")} fill="none" stroke="#0c1a2b" strokeWidth={4} />)}
    {[0, 1].flatMap((k2) => [0.25, 0.5, 0.75].flatMap((f) => [0, 0.5].map((o) => { const kk = Math.round(f * (K - 1)); const l = x.map((v, i) => [X(v), Y(y0[i] + (k2 + f) * s[i])]);
      const q = along(l, Wf.map((r) => r[kk]), t * 0.25 + o + f); return <circle key={`${k2}${f}${o}`} cx={q[0]} cy={q[1]} r={3} fill="#fff" stroke="#0c1a2b" strokeWidth={0.6} />; })))}
    <text x={W - 8} y={14} fontSize={10} textAnchor="end" fill="#5b6878">mid-span · relative frame · {fmt(lo, 0)}–{fmt(hi, 0)} m/s</text>
  </svg>;
};

const Cascade = ({ c, t }: { c: Json; t: number }) => {
  const W = 520, H = 460, X = (v: number) => 20 + ((v + 0.5) / 2.3) * (W - 40), Y = (v: number) => H - 20 - ((v + 0.6 * c.pitch) / (3.2 * c.pitch + 1)) * (H - 40);
  return <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxHeight: 480, background: "#fff" }}>
    {c.streamlines.map((ln: Json, i: number) => { const pts = ln.pts.map((p: number[]) => [X(p[0]), Y(p[1])]); const q = along(pts, pts.map(() => 1), t * 0.12 + i * 0.13);
      return <g key={i}><path d={pts.map((p: number[], k: number) => `${k ? "L" : "M"}${p[0]},${p[1]}`).join(" ")} fill="none" stroke="#0b5cad" strokeWidth={0.8} opacity={0.7} />
        <circle cx={q[0]} cy={q[1]} r={2.6} fill="#e5732e" /></g>; })}
    {[-1, 0, 1, 2].map((k) => <path key={k} d={c.camber.map((p: number[], i: number) => `${i ? "L" : "M"}${X(p[0])},${Y(p[1] + k * c.pitch)}`).join(" ")} fill="none" stroke="#0c1a2b" strokeWidth={4} strokeLinecap="round" />)}
  </svg>;
};

export function CfdPage(c: Ctx) {
  const k = c.results?.casings?.[c.casing] ?? c.results?.casings?.[0];
  const [imp, setImp] = useState(0);
  const [r, setR] = useState<Json>(null);
  const [field, setField] = useState("Mrel");
  const [busy, setBusy] = useState("");
  const [err, setErr] = useState("");
  const svgRef = useRef<SVGSVGElement>(null);
  const t = useClock();
  const body = { project: c.project, casing: c.casing, impeller: imp };
  useEffect(() => {
    if (!c.results) return;
    setBusy("Solving…"); setErr("");
    fetch("/api/cfd", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      .then(async (x) => { if (!x.ok) throw new Error((await x.json()).detail); setR(await x.json()); }).catch((e) => setErr(String(e))).finally(() => setBusy(""));
  }, [c.results, imp]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!c.results) return <p className="muted">Run the analysis first: CFD-lite uses the stage design (impeller geometry, triangles, gas and flow).</p>;
  const imps: Json[] = k?.impellers?.impellers ?? [];
  const name = `${safeName(c.project.name)}_impeller${imp + 1}`;
  const m = r?.meridional, b = r?.blade_to_blade, st = r?.stator, cs = r?.cascade;
  const V = m ? m[field].flat() : [0, 1];
  return (
    <>
      <h2>CFD-lite flow analysis</h2>
      <p className="lead">Fast flow solvers for one stage at its design point: hub-to-shroud field by streamline curvature, blade-to-blade loading,
        vaneless diffuser with rotating-stall and volute checks, return-vane cascade (panel method), and a CFD case export. Seconds, not hours; confirm with 3-D CFD.</p>
      <div className="row" style={{ gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
        <select className="inp" value={imp} onChange={(e) => { setImp(Number(e.target.value)); setR(null); }}>{imps.map((x, i) => <option key={i} value={i}>Impeller {i + 1} · D2 {fmt(x.D2_mm, 0)} mm</option>)}</select>
        <button className="btn primary" disabled={!r || !!busy} onClick={async () => { setBusy("Building the report…"); try { await saveFrom("/api/cfd/report.pdf", { ...body, images: { meridional: await svgToPng(svgRef.current) } }, `${name}_cfd_lite.pdf`); } catch (e) { setErr(String(e)); } setBusy(""); }}>Report (PDF)</button>
        <button className="btn" disabled={!r || !!busy} onClick={() => saveFrom("/api/cfd/export.zip", body, `${name}_cfd.zip`)}>Export CFD case (.zip)</button>
        {busy && <span className="muted">{busy}</span>}{err && <span style={{ color: "var(--fail)" }}>{err}</span>}
      </div>
      {r && <>
        <div className="kpis">{r.checks.map((x: Json) => <div key={x.check} className="kpi"><div className="v" style={{ color: x.status === "pass" ? "var(--pass)" : "var(--attention)" }}>
          {typeof x.value === "number" ? fmt(x.value, 2) : x.value ?? "–"}</div><div className="l">{x.check}</div></div>)}</div>
        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", marginTop: 12 }}>
          <div className="card"><h3>A · Meridional field</h3>
            <div className="chips">{FIELDS.map(([f, l]) => <button key={f} className={`chip ${field === f ? "on" : ""}`} onClick={() => setField(f)}>{l.split(" (")[0]}</button>)}</div>
            <Meridional m={m} field={field} t={t} svgRef={svgRef} />
            <Bar lo={Math.min(...V)} hi={Math.max(...V)} label={FIELDS.find((f) => f[0] === field)?.[1] ?? ""} /></div>
          <div className="card"><h3>B · Blade-to-blade (mid-span, relative W)</h3><Plan p={b.plan} t={t} />
            <p className="muted small">Throat {fmt(b.throat_area_mm2, 0)} mm² · choke margin {fmt(b.choke_margin, 2)} · max diffusion ratio {fmt(b.max_diffusion_ratio, 2)}</p></div>
        </div>
        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr 1fr", marginTop: 12 }}>
          {Object.entries(b.streamlines).map(([nm, s]: [string, Json]) => <LiveChart key={nm} title={`${nm} streamline · DR ${fmt(s.diffusion_ratio, 2)}`} xl="LE → TE" yl="W (m/s)" h={220}
            series={[{ x: s.m_frac, y: s.W_ss, color: "#c0392b", name: "suction", width: 1.6 }, { x: s.m_frac, y: s.W_ps, color: "#0b5cad", name: "pressure", width: 1.6 },
              { x: s.m_frac, y: s.W, color: "#7f7f7f", name: "mean", width: 1 }]} />)}
        </div>
        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr 1fr", marginTop: 12 }}>
          <LiveChart title={`C · Vaneless diffuser: flow angle · Cp ${fmt(st.cp_recovery, 2)} · loss ${fmt(st.loss_coefficient, 3)}`} xl="r (mm)" yl="α (°)" yr="Cp" h={230} xr={[st.diffuser[0].r_mm, st.diffuser[st.diffuser.length - 1].r_mm]}
            series={[{ x: st.diffuser.map((d: Json) => d.r_mm), y: st.diffuser.map((d: Json) => d.alpha_deg), color: "#0b5cad", name: "α", width: 1.6 },
              { x: st.diffuser.map((d: Json) => d.r_mm), y: st.diffuser.map((d: Json) => d.cp_recovery), color: "#d55e00", name: "Cp", width: 1.6, right: true }]} />
          <LiveChart title={`Rotating stall: onset at ${st.stall.stall_q_frac ? fmt(st.stall.stall_q_frac * 100, 0) + " %" : "–"} flow`} xl="Flow (% design)" yl="α2 (°)" h={230}
            hlines={[{ y: st.stall.alpha_crit_deg, color: "#c0392b", label: "critical" }]} vlines={st.stall.stall_q_frac ? [{ x: st.stall.stall_q_frac * 100, color: "#c0392b", dash: true }] : []}
            series={[{ x: st.stall.q_frac.map((q: number) => q * 100), y: st.stall.alpha_deg, color: "#0b5cad", name: "α2", width: 1.6 }]} />
          <LiveChart title="Volute radial force" xl="Flow (% design)" yl="kN" h={230}
            series={[{ x: st.volute.map((v: Json) => v.q_frac * 100), y: st.volute.map((v: Json) => v.radial_force_n / 1e3), color: "#009e73", name: "F", width: 1.6 }]} />
        </div>
        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", marginTop: 12 }}>
          <div className="card"><h3>D · Return-channel vane cascade</h3><Cascade c={cs} t={t} />
            <p className="muted small">Inlet {fmt(cs.inlet_flow_deg, 1)}° → exit {fmt(cs.exit_flow_deg, 1)}° (deviation), turning {fmt(cs.turning_deg, 1)}°, solidity {cs.solidity}, Zweifel {fmt(cs.zweifel, 2)}</p></div>
          <div className="card"><LiveChart title="Vane loading ΔCp" xl="x / chord" yl="ΔCp" h={300} series={[{ x: cs.x_load, y: cs.dcp, color: "#0b5cad", name: "ΔCp", width: 1.6 }]} />
            <h3 style={{ marginTop: 10 }}>E · CFD case export</h3>
            <p className="small">hub.curve, shroud.curve and profile.curve (TurboGrid-style point lists, mm), boundary_conditions.txt (inlet total p / T, mass flow per wheel and per passage,
              speed, gas, walls, periodicity) and meridional_field.csv for comparing with the 3-D result.</p></div>
        </div>
      </>}
    </>
  );
}
