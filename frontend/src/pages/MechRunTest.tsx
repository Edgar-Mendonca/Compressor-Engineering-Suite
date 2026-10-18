import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { fmt, type Json } from "../api";
import { LiveChart } from "../components/LiveChart";
import { Plot, SERIES } from "../components/Plot";
import { safeName, saveFrom, toast } from "../files";
import { Summary, svgToPng, TagsPanel, useTags } from "../components/testTags";

// Mechanical running test (API 617 9th ed. 8.3.2 / 8.3.3), backend testing/mrt.py: test train,
// speed-time plan with the lube-oil sequences, predicted probe response along the plan, acceptance,
// unbalanced rotor response test, test log evaluation, assembled gas leak test and the PDF report.

type Ctx = { project: Json; results: Json; casing: number; setProject: (p: Json) => void };
const TABS = ["Test train", "Speed-time plan", "Predicted response", "Acceptance", "URT", "Test log", "Gas leak test", "Tags & glossary", "Report"];
const PROBES = ["V1-X", "V1-Y", "V2-X", "V2-Y"];
const LOGCOLS = ["time", "N1", ...PROBES, "V5-Z", "V6-Z", ...Array.from({ length: 12 }, (_, i) => `TA${i + 1}`), "TD1", "TD2", "T_oil", "P_oil", "SG_DE", "SG_NDE", "seq"];
type TFn = (k: string) => string;
const PHASE_COL: Record<string, string> = { startup: "#7F7F7F", warmup: "#E69F00", critical: "#C0392B", step: "#0B5CAD", trip: "#CC79A7",
  runout: "#56B4E9", run4h: "#009E73", coastdown: "#5b6878" };
const MULS = [1, 10, 60, 120, 300, 600];
const MEM: Record<string, Json> = {};              // inputs kept per project while the app is open
const post = async (url: string, body: unknown) => {
  const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error((await r.json().catch(() => ({}))).detail ?? r.statusText);
  return r.json();
};
const Pill = ({ s }: { s: string }) => <span className={`pill ${s}`}>{s}</span>;
const num = (v: unknown) => (v === "" || v === null || v === undefined || Number.isNaN(Number(v)) ? undefined : Number(v));
const hhmm = (m: number) => `${Math.floor(m / 60)}:${String(Math.floor(m % 60)).padStart(2, "0")}`;
/** Index of the last element <= x in a sorted array. */
const bisect = (a: number[], x: number) => { let lo = 0, hi = a.length - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (a[m] <= x) lo = m; else hi = m - 1; } return lo; };
const lerp = (xs: number[], ys: number[], x: number) => { const i = bisect(xs, x); if (i >= xs.length - 1) return ys[ys.length - 1]; const f = (x - xs[i]) / ((xs[i + 1] - xs[i]) || 1); return ys[i] + (ys[i + 1] - ys[i]) * Math.max(0, Math.min(1, f)); };
const level = (r: number) => (r < 0.6 ? "#1f9d63" : r < 0.85 ? "#e0a020" : "#d6453a");
const tlevel = (v: number, lim: number) => level(((v - 40) / (lim - 40)) * 0.8);

function parseCSV(text: string): Json[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (!lines.length) return [];
  const sep = [";", "\t", ","].find((s) => lines[0].includes(s)) ?? ",";
  const head = lines[0].split(sep).map((h) => h.trim().replace(/^"|"$/g, ""));
  return lines.slice(1).map((l) => { const v = l.split(sep); return Object.fromEntries(head.map((h, i) => [h, (v[i] ?? "").trim().replace(/^"|"$/g, "")])); });
}
const toCSV = (rows: Json[], cols: string[]) => [cols.join(","), ...rows.map((r) => cols.map((c) => r[c] ?? "").join(","))].join("\n");

// ---------------------------------------------------------------- animation
/** Horizontal cylinder with a vertical gradient. */
export const Cyl = ({ x, y, w, h, g, rx = 3 }: { x: number; y: number; w: number; h: number; g: string; rx?: number }) =>
  <rect x={x} y={y - h / 2} width={w} height={h} rx={rx} fill={`url(#${g})`} stroke="#1d2733" strokeWidth="1" />;
/** 2.5D box: front face, top and right side. */
export function Box({ x, y, w, h, c, d = 12, children }: { x: number; y: number; w: number; h: number; c: [string, string, string]; d?: number; children?: ReactNode }) {
  return <g>
    <polygon points={`${x},${y} ${x + d},${y - d * 0.7} ${x + w + d},${y - d * 0.7} ${x + w},${y}`} fill={c[0]} stroke="#1d2733" strokeWidth=".8" />
    <polygon points={`${x + w},${y} ${x + w + d},${y - d * 0.7} ${x + w + d},${y + h - d * 0.7} ${x + w},${y + h}`} fill={c[2]} stroke="#1d2733" strokeWidth=".8" />
    <rect x={x} y={y} width={w} height={h} fill={c[1]} stroke="#1d2733" strokeWidth=".8" />{children}</g>;
}
/** Spinning shaft segment: a stripe pattern moving with the shaft angle. */
const Shaft = ({ x1, x2, y, r, pat }: { x1: number; x2: number; y: number; r: number; pat: string }) =>
  <g><rect x={x1} y={y - r} width={x2 - x1} height={2 * r} fill="url(#gSteel)" /><rect x={x1} y={y - r} width={x2 - x1} height={2 * r} fill={`url(#${pat})`} opacity=".55" /></g>;

export function Gear({ cx, cy, r, teeth, ang, fill }: { cx: number; cy: number; r: number; teeth: number; ang: number; fill: string }) {
  const p: string[] = [];
  for (let i = 0; i < teeth * 2; i++) { const a = (i * Math.PI) / teeth; const rr = i % 2 ? r : r * 0.88; p.push(`${cx + rr * Math.cos(a)},${cy + rr * Math.sin(a)}`); }
  return <g transform={`rotate(${ang} ${cx} ${cy})`}><polygon points={p.join(" ")} fill={fill} stroke="#1d2733" strokeWidth=".8" />
    <circle cx={cx} cy={cy} r={r * 0.25} fill="#c9d1da" stroke="#1d2733" /><line x1={cx} y1={cy} x2={cx + r * 0.7} y2={cy} stroke="#1d2733" strokeWidth="2" /></g>;
}

function Tacho({ n, max, marks, crit, trip }: { n: number; max: number; marks: [string, number][]; crit: number[]; trip: number }) {
  const A = (v: number) => (-225 + 270 * Math.min(v / max, 1)) * Math.PI / 180;
  const P = (v: number, r: number) => `${100 + r * Math.cos(A(v))},${100 + r * Math.sin(A(v))}`;
  const arc = (a: number, b: number, r: number) => `M${P(a, r)} A${r} ${r} 0 ${A(b) - A(a) > Math.PI ? 1 : 0} 1 ${P(b, r)}`;
  return (
    <svg viewBox="-22 -16 244 190" className="tacho" role="img" aria-label="Tachometer">
      <path d={arc(0, max, 80)} stroke="var(--line-2)" strokeWidth="10" fill="none" />
      <path d={arc(0, Math.max(n, 1), 80)} stroke="var(--accent)" strokeWidth="10" fill="none" />
      <path d={arc(trip, max, 80)} stroke="#d6453a" strokeWidth="4" fill="none" />
      {crit.map((c) => <path key={c} d={arc(c * 0.9, c * 1.1, 92)} stroke="#d6453a" strokeOpacity=".55" strokeWidth="6" fill="none" />)}
      {Array.from({ length: 11 }, (_, i) => (i * max) / 10).map((v) => <g key={v}><line x1={P(v, 66).split(",")[0]} y1={P(v, 66).split(",")[1]} x2={P(v, 72).split(",")[0]} y2={P(v, 72).split(",")[1]} stroke="var(--muted)" />
        <text x={P(v, 56).split(",")[0]} y={P(v, 56).split(",")[1]} fontSize="7" textAnchor="middle" dominantBaseline="middle" fill="var(--muted)">{Math.round(v / 1000)}</text></g>)}
      {marks.map(([l, v]) => <text key={l} x={P(v, 103).split(",")[0]} y={P(v, 103).split(",")[1]} fontSize="7" textAnchor="middle" fill="var(--ink)">{l}</text>)}
      <line x1="100" y1="100" x2={P(n, 74).split(",")[0]} y2={P(n, 74).split(",")[1]} stroke="#d6453a" strokeWidth="3" strokeLinecap="round" />
      <circle cx="100" cy="100" r="6" fill="var(--ink)" />
      <text x="100" y="150" textAnchor="middle" className="tacho-v">{Math.round(n).toLocaleString()}</text>
      <text x="100" y="168" textAnchor="middle" fontSize="8" fill="var(--muted)">compressor rpm · dial ×1000</text>
    </svg>
  );
}

function TrainAnim({ d, T, still, svgRef }: { d: Json; T: TFn; still?: boolean; svgRef?: (e: SVGSVGElement | null) => void }) {
  const plan = d.plan, al = d.along, sp = d.speeds, tr = d.train, lim = d.limit_um;
  const crit: number[] = d.prediction.critical_speeds.filter((c: Json) => !(c.af < 2.5)).map((c: Json) => c.speed_rpm);
  const dur: number = plan.duration_min;
  const t0 = still ? (plan.segments.find((q: Json) => q.phase === "run4h" && q.n0_rpm === q.n1_rpm)?.t0_min ?? 0) + 20 : 0;
  const t = useRef(t0), phi = useRef(0.13), phiD = useRef(0.07), flow = useRef(0), last = useRef(0);
  const [mul, setMul] = useState(120);
  const [playing, setPlaying] = useState(false);
  const [, setFrame] = useState(0);
  const st = useRef({ mul, playing }); st.current = { mul, playing };
  // Animation loop only while playing; about 30 frames per second so the page stays light.
  useEffect(() => {
    if (!playing) return;
    let raf = 0, acc = 0;
    const f = (now: number) => {
      const dt = last.current ? Math.min((now - last.current) / 1000, 0.1) : 0; last.current = now;
      t.current = Math.min(t.current + (dt * st.current.mul) / 60, dur); if (t.current >= dur) setPlaying(false);
      const n = lerp(plan.t_min, plan.speed_rpm, t.current);
      phi.current += dt * 1.6 * (n / sp.rated_rpm);                       // visual rev/s, proportional to speed
      phiD.current += (dt * 1.6 * (n / sp.rated_rpm)) / tr.gear_ratio;
      flow.current += dt * 30 * lerp(plan.t_min, plan.oil_p_barg, t.current);
      acc += dt;
      if (acc >= 1 / 30) { acc = 0; setFrame((k) => (k + 1) % 1e6); }
      raf = requestAnimationFrame(f);
    };
    raf = requestAnimationFrame(f);
    return () => { cancelAnimationFrame(raf); last.current = 0; };
  }, [playing, plan, sp, tr, dur]);

  const now = t.current;
  const n = lerp(plan.t_min, plan.speed_rpm, now);
  const seg = plan.segments[plan.segment[Math.min(bisect(plan.t_min, now), plan.segment.length - 1)]];
  const oilT = lerp(plan.t_min, plan.oil_t_c, now), oilP = lerp(plan.t_min, plan.oil_p_barg, now);
  const jit = (k: number) => 1 + 0.025 * Math.sin(now * 37 + k * 1.7) * (n > 50 ? 1 : 0);
  const vib = Object.fromEntries(PROBES.map((k, i) => [k, n > 50 ? lerp(al.t_min, al[k], now) * jit(i) : 0]));
  const btemp: [string, number][] = Object.keys(al).filter((k) => k.startsWith("Bearing") || k.startsWith("Thrust")).map((k) => [k, lerp(al.t_min, al[k], now)]);
  const nearCrit = crit.find((c) => Math.abs(n - c) < 0.12 * c && n > 100);
  const geared = tr.geared, ratio = tr.gear_ratio;
  const comps: Json[] = tr.components;
  const casings = comps.filter((c) => c.kind === "casing");
  const fr = Math.max(0, Math.min(n / sp.mcs_rpm, 1.2));
  const rise: number[] = Object.values(d.prediction.bearing_oil ?? {}).map((b: Json) => b.temp_rise_k ?? 15);
  const drain = [oilT + (rise[0] ?? 15) * fr ** 1.5, oilT + (rise[1] ?? rise[0] ?? 15) * fr ** 1.5];
  const axial = n > 50 ? 110 + 45 * fr + 4 * Math.sin(now * 3) : 0;
  const sgv = [0.35 + 0.9 * fr, 0.32 + 0.85 * fr], sgp = 3 + 2 * fr;

  // Layout along x.
  const Y = geared ? 172 : 196, YD = 196, base = 292;
  let x = 24;
  const at: Record<string, [number, number]> = {};
  const place = (k: string, w: number, gap = 18) => { at[k] = [x, w]; x += w + gap; };
  if (comps.some((c) => c.kind === "vfd")) place("vfd", 92, 34);
  place("motor", 230, 0); place("lsc", 64, 0);
  if (geared) { place("gear", 150, 0); place("hsc", 64, 0); }
  casings.forEach((_, i) => { place(`cas${i}`, 270, 0); if (i < casings.length - 1) place(`ic${i}`, 56, 0); });
  const trainEnd = x;
  place("dgs", 150, 0);
  const W = x + 30;
  const stripes = (id: string, p: number) => <pattern id={id} width="10" height="40" patternUnits="userSpaceOnUse" patternTransform={`translate(0 ${(p * 4 * 10) % 40})`}>
    <rect width="10" height="40" fill="none" /><path d="M0 0 L10 10 M0 20 L10 30" stroke="#1d2733" strokeWidth="3" /></pattern>;
  const fins = (x0: number, w: number, y0: number, h: number) => Array.from({ length: Math.floor(w / 8) }, (_, i) => <line key={i} x1={x0 + 4 + i * 8} x2={x0 + 4 + i * 8} y1={y0} y2={y0 + h} stroke="#0a3d73" strokeWidth="2.2" opacity=".8" />);
  const probe = (cx: number, cy: number, name: string, side: 1 | -1) => {
    const v = vib[name], r = v / lim, col = level(r);
    const ang = side > 0 ? -45 : -135, rad = (ang * Math.PI) / 180;
    const [px, py] = [cx + 30 * Math.cos(rad), cy + 30 * Math.sin(rad)];
    return <g key={name}><line x1={cx + 14 * Math.cos(rad)} y1={cy + 14 * Math.sin(rad)} x2={px} y2={py} stroke="#2b3542" strokeWidth="4" />
      <circle cx={px} cy={py} r="4.5" fill={col} stroke="#1d2733" className={r > 0.85 ? "blink" : ""} /></g>;
  };
  const tag = (x0: number, y0: number, lines: [string, string, string][]) => <g transform={`translate(${x0} ${y0})`}>
    <rect width="146" height={6 + lines.length * 13} rx="2" fill="var(--panel)" stroke="var(--line-2)" opacity=".96" />
    {lines.map(([k, v, c], i) => <g key={k}><circle cx="8" cy={11 + i * 13} r="3" fill={c} /><text x="15" y={14 + i * 13} className="mrt-tag">{k}</text>
      <text x="140" y={14 + i * 13} className="mrt-tag" textAnchor="end">{v}</text></g>)}</g>;
  const housing = (cx: number, y: number, label: string, p: string) => <g>
    <Box x={cx - 20} y={y - 30} w={40} h={58} c={["#a9b6c4", "#8996a6", "#6c7889"]} d={8} />
    {probe(cx, y - 26, `${p}-X`, 1)}{probe(cx, y - 26, `${p}-Y`, -1)}
    <text x={cx} y={y - 66} textAnchor="middle" className="mrt-lab">{label}</text></g>;
  const pipeIn = (xx: number, y2: number) => <path d={`M${xx} ${base - 12} V${y2}`} className="oil sup" strokeDashoffset={-flow.current} />;
  const pipeOut = (xx: number, y2: number) => <path d={`M${xx + 8} ${y2} V${base - 4}`} className="oil drn" strokeDashoffset={-flow.current * 0.6} />;
  const bearings: number[] = [];
  const [mx, mw] = at.motor;
  bearings.push(mx + 14, mx + mw - 14);

  const bodyC = n > 0 ? "" : "idle";
  const mini = useMemo(() => {
    const k = Math.max(1, Math.floor(plan.t_min.length / 400));
    const pts = plan.t_min.filter((_: number, i: number) => i % k === 0).map((tt: number, i: number) => [tt, plan.speed_rpm[i * k]]);
    return pts;
  }, [plan]);
  const MX = (tt: number) => 8 + (tt / dur) * 344, MY = (v: number) => 88 - (v / (sp.trip_rpm * 1.08)) * 80;

  const stage = (
        <svg ref={svgRef} viewBox={`0 0 ${W} 412`} className={`mrt-stage ${bodyC}`} role="img" aria-label="Mechanical running test train">
          <defs>
            {[["gSteel", "#e3e8ee", "#8e9aa8", "#58636f"], ["gMotor", "#5f97d6", "#1a5aa6", "#0d3a6e"], ["gCas", "#a7c0cf", "#5e8197", "#34505f"],
              ["gHead", "#93a7b8", "#5a6d7e", "#38464f"], ["gGuard", "#ffd27a", "#e69f00", "#a86d00"], ["gGear", "#9aa6b3", "#6b7785", "#4a5562"],
              ["gTank", "#c9b48a", "#9a7e4d", "#6b5530"]].map(([id, a, b, c]) =>
              <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={a} /><stop offset=".45" stopColor={b} /><stop offset="1" stopColor={c} /></linearGradient>)}
            {stripes("pD", phiD.current)}{stripes("pC", phi.current)}
            <radialGradient id="gShadow"><stop offset="0" stopColor="#000" stopOpacity=".25" /><stop offset="1" stopColor="#000" stopOpacity="0" /></radialGradient>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0 H0 V40" fill="none" stroke="var(--line)" strokeWidth=".6" /></pattern>
          </defs>
          <rect width={W} height="412" fill="url(#grid)" />
          {/* baseplate */}
          <ellipse cx={W / 2} cy={base + 30} rx={W / 2} ry="16" fill="url(#gShadow)" />
          <Box x={at.motor[0] - 10} y={base} w={trainEnd - at.motor[0] + 4} h={20} c={["#9aa3ad", "#6f7883", "#4d555e"]} d={16} />
          {comps.some((c) => c.kind === "vfd") && <g>
            <Box x={at.vfd[0]} y={92} w={at.vfd[1]} h={220} c={["#7f8b99", "#48525f", "#323a44"]} d={14}>
              <rect x={at.vfd[0] + 8} y={102} width={at.vfd[1] / 2 - 10} height={200} fill="none" stroke="#2a313a" />
              <rect x={at.vfd[0] + at.vfd[1] / 2 + 2} y={102} width={at.vfd[1] / 2 - 10} height={200} fill="none" stroke="#2a313a" />
              <rect x={at.vfd[0] + 14} y={114} width={58} height={26} fill="#0b1220" />
              <text x={at.vfd[0] + 43} y={131} textAnchor="middle" className="mrt-lcd">{fmt((n / ratio) / 60 * 1, 1)} Hz</text>
              <circle cx={at.vfd[0] + 20} cy={152} r="3.5" fill={n > 0 ? "#2ecc71" : "#55606c"} /><circle cx={at.vfd[0] + 32} cy={152} r="3.5" fill={playing ? "#f1c40f" : "#55606c"} />
              {Array.from({ length: 6 }, (_, i) => <line key={i} x1={at.vfd[0] + 16} x2={at.vfd[0] + 40} y1={250 + i * 6} y2={250 + i * 6} stroke="#2a313a" strokeWidth="2" />)}
            </Box>
            <text x={at.vfd[0] + at.vfd[1] / 2} y={330} textAnchor="middle" className="mrt-lab">VFD ({comps[0].source})</text>
            <path d={`M${at.vfd[0] + at.vfd[1]} 120 C ${at.vfd[0] + at.vfd[1] + 30} 120, ${at.motor[0] + 60} 100, ${at.motor[0] + 90} ${YD - 72}`} stroke="#1d2733" strokeWidth="5" fill="none" />
          </g>}
          {/* driver */}
          <Shaft x1={mx + mw - 20} x2={at.lsc[0] + at.lsc[1] + 10} y={YD} r={9} pat="pD" />
          <rect x={mx + 18} y={YD + 48} width={22} height={base - YD - 48} fill="#4d555e" /><rect x={mx + mw - 40} y={YD + 48} width={22} height={base - YD - 48} fill="#4d555e" />
          <rect x={mx} y={YD - 50} width={18} height={100} rx="5" fill="url(#gHead)" stroke="#1d2733" />
          {Array.from({ length: 5 }, (_, i) => <line key={i} x1={mx + 3} x2={mx + 15} y1={YD - 36 + i * 18} y2={YD - 36 + i * 18} stroke="#1d2733" />)}
          <Cyl x={mx + 18} y={YD} w={mw - 40} h={112} g="gMotor" rx={8} />
          {fins(mx + 24, mw - 52, YD - 56, 112)}
          <rect x={mx + mw - 22} y={YD - 44} width={16} height={88} rx="4" fill="url(#gHead)" stroke="#1d2733" />
          <Box x={mx + mw / 2 - 30} y={YD - 82} w={60} h={26} c={["#6f9fd8", "#2a66ac", "#164479"]} d={8} />
          <text x={mx + mw / 2} y={YD + 6} textAnchor="middle" className="mrt-name">MOTOR</text>
          <text x={mx + mw / 2} y={330} textAnchor="middle" className="mrt-lab">{comps.find((c) => c.kind === "motor" || c.kind === "turbine")?.name}</text>
          {/* LS (or only) coupling with guard */}
          {(() => { const [cx, cw] = at.lsc, yy = geared ? YD : Y; return <g>
            <rect x={cx + 6} y={yy - 22} width={14} height={44} fill="url(#gSteel)" stroke="#1d2733" /><rect x={cx + cw - 20} y={yy - 22} width={14} height={44} fill="url(#gSteel)" stroke="#1d2733" />
            <rect x={cx + 6} y={yy - 22} width={14} height={44} fill={`url(#${geared ? "pD" : "pC"})`} opacity=".5" /><rect x={cx + cw - 20} y={yy - 22} width={14} height={44} fill={`url(#${geared ? "pD" : "pC"})`} opacity=".5" />
            <rect x={cx + 2} y={yy - 30} width={cw - 4} height={60} rx="12" fill="url(#gGuard)" opacity=".42" stroke="#a86d00" />
            <text x={cx + cw / 2} y={yy - 38} textAnchor="middle" className="mrt-lab">{geared ? "LS cpl" : "Coupling"}</text></g>; })()}
          {geared && (() => { const [gx, gw] = at.gear; const ang = phiD.current * 360, angP = -phi.current * 360; return <g>
            <Shaft x1={gx + gw - 10} x2={at.hsc[0] + at.hsc[1] + 10} y={Y} r={7} pat="pC" />
            <Box x={gx} y={YD - 70} w={gw} h={base - YD + 70} c={["#a4afbb", "#76828f", "#56616d"]} d={14}>
              <rect x={gx + 14} y={YD - 58} width={gw - 28} height={120} rx="6" fill="#1d2733" opacity=".85" />
              <Gear cx={gx + gw * 0.42} cy={YD} r={44} teeth={28} ang={ang} fill="url(#gGear)" />
              <Gear cx={gx + gw * 0.42 + 44 + 15} cy={Y} r={17} teeth={11} ang={angP} fill="#c4ccd6" />
              <rect x={gx + 14} y={YD - 58} width={gw - 28} height={120} rx="6" fill="none" stroke="#e69f00" strokeDasharray="5 3" />
            </Box>
            <text x={gx + gw / 2} y={330} textAnchor="middle" className="mrt-lab">Gearbox i = {fmt(ratio, 2)}</text>
            <text x={gx + gw / 2} y={343} textAnchor="middle" className="mrt-lab">{fmt(n / ratio, 0)} / {fmt(n, 0)} rpm</text>
            {(() => { const [cx, cw] = at.hsc; return <g>
              <rect x={cx + 6} y={Y - 18} width={12} height={36} fill="url(#gSteel)" stroke="#1d2733" /><rect x={cx + cw - 18} y={Y - 18} width={12} height={36} fill="url(#gSteel)" stroke="#1d2733" />
              <rect x={cx + 6} y={Y - 18} width={12} height={36} fill="url(#pC)" opacity=".5" /><rect x={cx + cw - 18} y={Y - 18} width={12} height={36} fill="url(#pC)" opacity=".5" />
              <rect x={cx + 2} y={Y - 26} width={cw - 4} height={52} rx="10" fill="url(#gGuard)" opacity=".42" stroke="#a86d00" />
              <text x={cx + cw / 2} y={Y - 34} textAnchor="middle" className="mrt-lab">HS cpl</text></g>; })()}
          </g>; })()}
          {/* compressor casing(s) */}
          {casings.map((_c, i) => { const [cx, cw] = at[`cas${i}`]; const b1 = cx + 26, b2 = cx + cw - 26; bearings.push(b1, b2); return <g key={i}>
            <Shaft x1={cx - 10} x2={cx + cw + (i < casings.length - 1 ? 10 : -6)} y={Y} r={7} pat="pC" />
            <rect x={cx + 56} y={Y + 50} width={18} height={base - Y - 50} fill="#4d555e" /><rect x={cx + cw - 74} y={Y + 50} width={18} height={base - Y - 50} fill="#4d555e" />
            <rect x={cx + 44} y={Y - 64} width={26} height={128} rx="6" fill="url(#gHead)" stroke="#1d2733" />
            <rect x={cx + cw - 70} y={Y - 64} width={26} height={128} rx="6" fill="url(#gHead)" stroke="#1d2733" />
            <Cyl x={cx + 66} y={Y} w={cw - 132} h={116} g="gCas" rx={10} />
            {Array.from({ length: 7 }, (_, k) => <circle key={k} cx={cx + 57} cy={Y - 54 + k * 18} r="2.2" fill="#2b3542" />)}
            {Array.from({ length: 7 }, (_, k) => <circle key={k} cx={cx + cw - 57} cy={Y - 54 + k * 18} r="2.2" fill="#2b3542" />)}
            {[[cx + 96, "SUCTION"], [cx + cw - 124, "DISCH."]].map(([nx, l]) => <g key={l as string}>
              <rect x={(nx as number)} y={Y - 106} width={28} height={50} fill="url(#gCas)" stroke="#1d2733" />
              <rect x={(nx as number) - 8} y={Y - 114} width={44} height={10} fill="url(#gHead)" stroke="#1d2733" />
              <text x={(nx as number) + 14} y={Y - 120} textAnchor="middle" className="mrt-lab">{l}</text></g>)}
            <text x={cx + cw / 2} y={Y + 5} textAnchor="middle" className="mrt-name">CASING {i + 1}</text>
            {housing(b1, Y, "DE journal", "V1")}{housing(b2, Y, "NDE journal + thrust", "V2")}
            {/* keyphasor at the DE shaft and axial probes A / B on the thrust collar */}
            <g><line x1={b1 + 34} y1={Y + 36} x2={b1 + 34} y2={Y + 9} stroke="#2b3542" strokeWidth="4" /><polygon points={`${b1 + 30},${Y + 8} ${b1 + 38},${Y + 8} ${b1 + 34},${Y + 3}`} fill="#e0a020" />
              <text x={b1 + 34} y={Y + 48} textAnchor="middle" className="mrt-lab">{T("KPH")}</text></g>
            {[0, 1].map((j) => <g key={j}><line x1={cx + cw - 6 + 14} y1={Y - 12 + j * 24} x2={cx + cw - 6 + 2} y2={Y - 4 + j * 8} stroke="#2b3542" strokeWidth="3.5" />
              <circle cx={cx + cw - 6 + 15} cy={Y - 13 + j * 26} r="4" fill={level(axial / 500)} stroke="#1d2733" />
              <text x={cx + cw + 14} y={Y - 18 + j * 40} className="mrt-lab">{T(j ? "V6-Z" : "V5-Z")}</text></g>)}
            <rect x={b2 + 16} y={Y - 6} width={10} height={12} fill="#2b3542" />
            <text x={cx + cw / 2} y={330} textAnchor="middle" className="mrt-lab">Casing {i + 1} ({casings[i].source}) · {fmt(n, 0)} rpm</text>
            <text x={cx + cw / 2} y={343} textAnchor="middle" className="mrt-lab">X/Y probes 45° from TDC · axial at thrust collar</text>
          </g>; })}
          {/* oil console and piping */}
          <g>
            <path d={`M140 ${base - 12} H${x - 30}`} className="oil sup" strokeDashoffset={-flow.current} />
            <path d={`M${x - 22} ${base - 4} H140`} className="oil drn" strokeDashoffset={-flow.current * 0.6} />
            {bearings.map((bx, i) => <g key={i}>{pipeIn(bx - 4, (i < 2 ? YD : Y) + 28)}{pipeOut(bx - 4, (i < 2 ? YD : Y) + 28)}</g>)}
            <path d={`M140 ${base - 12} V354`} className="oil sup" strokeDashoffset={-flow.current} />
            <path d={`M132 ${base - 4} V354`} className="oil drn" strokeDashoffset={-flow.current * 0.6} />
            <Box x={40} y={340} w={160} h={44} c={["#d7c8a6", "#a88a55", "#7a6237"]} d={10}>
              <text x={120} y={366} textAnchor="middle" className="mrt-name small">LUBE OIL CONSOLE</text></Box>
            <Cyl x={210} y={360} w={46} h={22} g="gMotor" /><rect x={262} y={340} width={14} height={40} rx="6" fill="url(#gSteel)" stroke="#1d2733" />
            <rect x={282} y={340} width={14} height={40} rx="6" fill="url(#gSteel)" stroke="#1d2733" />
            <text x={306} y={354} className="mrt-lab" textAnchor="start">supply → (blue) / drain ← (orange)</text>
          </g>
          {/* dry gas seal panel: seal gas to both seals, primary vents back to the panel */}
          {casings.length > 0 && (() => { const [gx] = at.dgs, [cx, cw] = at[`cas${casings.length - 1}`], [c0] = at.cas0; return <g>
            <Box x={gx + 6} y={120} w={104} h={150} c={["#a596cf", "#6c5a9c", "#4c3d78"]} d={12}>
              <text x={gx + 58} y={140} textAnchor="middle" className="mrt-name small" fill="#fff">DGS PANEL</text>
              {[0, 1, 2].map((j) => <g key={j}><circle cx={gx + 34 + j * 24} cy={168} r="9" fill="#ece8f6" stroke="#2b2350" /><line x1={gx + 34 + j * 24} y1={168} x2={gx + 34 + j * 24 + 6 * Math.cos(now * 2 + j)} y2={168 - 6 * Math.abs(Math.sin(now * 2 + j))} stroke="#c0392b" strokeWidth="1.5" /></g>)}
              <rect x={gx + 18} y={190} width={80} height={8} rx="2" fill="#2b2350" /><rect x={gx + 18} y={206} width={80} height={8} rx="2" fill="#2b2350" /></Box>
            {[[c0 + 40, "#e69f00"], [cx + cw - 40, "#e69f00"]].map(([xx, c], j) => <g key={j}>
              <path d={`M${gx + 6} ${150 + j * 10} H${(xx as number) + (j ? 0 : 0)} V${Y - 58}`} className="oil" stroke={c as string} strokeWidth="2.6" strokeDashoffset={-flow.current * 0.8} fill="none" opacity=".85" />
              <path d={`M${(xx as number) + 8} ${Y - 58} V${110 - j * 8} H${gx + 6}`} className="oil" stroke="#56b4e9" strokeWidth="2.2" strokeDashoffset={flow.current * 0.5} fill="none" opacity=".75" /></g>)}
            <text x={gx + 58} y={284} textAnchor="middle" className="mrt-lab">seal gas → (orange)</text>
            <text x={gx + 58} y={296} textAnchor="middle" className="mrt-lab">vents ← (blue)</text>
          </g>; })()}
          {/* live tags */}
          {casings.length > 0 && (() => { const [cx, cw] = at.cas0, [gx] = at.dgs; return <>
            {tag(cx - 150, 18, [[T("V1-X"), `${fmt(vib["V1-X"], 1)} µm`, level(vib["V1-X"] / lim)], [T("V1-Y"), `${fmt(vib["V1-Y"], 1)} µm`, level(vib["V1-Y"] / lim)],
              [T("Bearing 1"), `${fmt(btemp[0]?.[1], 0)} °C`, tlevel(btemp[0]?.[1] ?? 0, d.bearing_temp_limit_c)], [T("TD1"), `${fmt(n > 50 ? drain[0] : oilT, 1)} °C`, "#3d8fd6"]])}
            {tag(cx + cw - 100, 18, [[T("V2-X"), `${fmt(vib["V2-X"], 1)} µm`, level(vib["V2-X"] / lim)], [T("V2-Y"), `${fmt(vib["V2-Y"], 1)} µm`, level(vib["V2-Y"] / lim)],
              [T("Bearing 2"), `${fmt(btemp[1]?.[1], 0)} °C`, tlevel(btemp[1]?.[1] ?? 0, d.bearing_temp_limit_c)], [T("Thrust (active)"), `${fmt(btemp[2]?.[1], 0)} °C`, tlevel(btemp[2]?.[1] ?? 0, d.bearing_temp_limit_c)],
              [T("V5-Z"), `${fmt(axial, 0)} µm`, level(axial / 500)]])}
            {tag(gx - 14, 310, [[T("SG_DE"), `${fmt(n > 50 ? sgv[0] : 0.2, 2)} Nm³/h`, "#56b4e9"], [T("SG_NDE"), `${fmt(n > 50 ? sgv[1] : 0.2, 2)} Nm³/h`, "#56b4e9"], [T("SG_P"), `${fmt(sgp, 1)} barg`, "#e69f00"]])}
            {tag(300, 364, [[T("T_oil"), `${fmt(oilT, 1)} °C`, "#3d8fd6"], [T("P_oil"), `${fmt(oilP, 2)} barg`, "#3d8fd6"]])}
            {tag(cx + cw / 2 - 73, 352, [[T("N1"), `${fmt(n, 0)} rpm`, "var(--accent)"]])}</>; })()}
        </svg>);
  if (still) return stage;
  return (
    <div className="mrt-anim">
      <div className="mrt-stage-wrap">
        <div className={`mrt-banner ${nearCrit ? "crit" : ""}`} style={{ borderLeftColor: PHASE_COL[seg?.phase] }}>
          <b>{seg?.seq ? `4 h run · ${seg.seq}` : seg?.label}</b>
          <span className="mono small">{nearCrit ? `Passing critical ${Math.round(nearCrit)} rpm, keep accelerating` : seg?.critical ? "Critical-speed pass in this phase" : `${hhmm(now)} / ${hhmm(dur)}`}</span>
        </div>
        {stage}
        <div className="mrt-controls">
          <button className="btn primary" onClick={() => { if (t.current >= dur) t.current = 0; setPlaying(!playing); }}>{playing ? "Pause" : now > 0 && now < dur ? "Resume" : "Play test"}</button>
          <button className="btn" onClick={() => { t.current = 0; setPlaying(false); setFrame((k) => k + 1); }}>Reset</button>
          <div className="seg">{MULS.map((m) => <button key={m} className={mul === m ? "on" : ""} onClick={() => setMul(m)}>{m}×</button>)}</div>
          <input type="range" className="mrt-scrub" min={0} max={dur} step={0.25} value={now} onChange={(e) => { t.current = Number(e.target.value); setFrame((k) => k + 1); }} aria-label="Test time" />
          <span className="mono small">{hhmm(now)} of {hhmm(dur)} h:min</span>
        </div>
        <LivePanel d={d} now={now} n={n} vib={vib} T={T} />
      </div>
      <aside className="mrt-side">
        <Tacho n={n} max={Math.ceil((sp.trip_rpm * 1.12) / 1000) * 1000} trip={sp.trip_rpm} crit={crit}
          marks={[["MSS", sp.min_rpm], ["MCS", sp.mcs_rpm], ["TRIP", sp.trip_rpm]]} />
        <div className="mrt-bars">
          {PROBES.map((k) => { const r = vib[k] / lim; return <div key={k} className="mrt-bar"><span className="mono">{T(k)}</span>
            <div><i style={{ width: `${Math.min(r, 1.2) / 1.2 * 100}%`, background: level(r) }} /><b style={{ left: `${100 / 1.2}%` }} /></div><span className="mono">{fmt(vib[k], 1)}</span></div>; })}
          {btemp.map(([k, v]) => { const r = v / d.bearing_temp_limit_c; return <div key={k} className="mrt-bar"><span className="mono">{T(k)}</span>
            <div><i style={{ width: `${Math.min(r, 1.2) / 1.2 * 100}%`, background: tlevel(v, d.bearing_temp_limit_c) }} /><b style={{ left: `${100 / 1.2}%` }} /></div><span className="mono">{fmt(v, 0)} °C</span></div>; })}
          <div className="muted small">Limit lines: {fmt(lim, 1)} µm pk-pk, {fmt(d.bearing_temp_limit_c, 0)} °C. Predicted values at the current speed.</div>
        </div>
        <div className="mrt-orbits">{["V1", "V2"].map((b) => { const ax = vib[`${b}-X`] / lim, ay = vib[`${b}-Y`] / lim, a = phi.current * 2 * Math.PI;
          return <svg key={b} viewBox="-50 -50 100 100" role="img" aria-label={`${b} orbit`}><circle r="15" fill="none" stroke="var(--line)" />
            <circle r="30" fill="none" stroke="#d6453a" strokeDasharray="3 3" /><line x1="-46" x2="46" stroke="var(--line)" /><line y1="-46" y2="46" stroke="var(--line)" />
            <ellipse rx={30 * ax + 0.5} ry={30 * ay + 0.5} fill="none" stroke="var(--accent)" strokeWidth="2" transform="rotate(-30)" />
            <circle cx={(30 * ax) * Math.cos(a) * Math.cos(-0.52) - (30 * ay) * Math.sin(a) * Math.sin(-0.52)} cy={(30 * ax) * Math.cos(a) * Math.sin(-0.52) + (30 * ay) * Math.sin(a) * Math.cos(-0.52)} r="3.5" fill="#d6453a" />
            <text x="-46" y="-40" fontSize="9" fill="var(--muted)">{b === "V1" ? "DE" : "NDE"} orbit</text><text x="46" y="46" fontSize="7" textAnchor="end" fill="#d6453a">dashed = limit</text></svg>; })}</div>
        <svg viewBox="0 0 360 112" className="mrt-mini" role="img" aria-label="Speed-time plan">
          {plan.segments.map((s: Json, i: number) => <rect key={i} x={MX(s.t0_min)} y={96} width={Math.max(MX(s.t1_min) - MX(s.t0_min), 0.5)} height={8} fill={PHASE_COL[s.phase]} opacity={s === seg ? 1 : 0.55} />)}
          {crit.map((c) => <g key={c}><line x1={8} x2={352} y1={MY(c)} y2={MY(c)} stroke="#d6453a" strokeDasharray="3 3" /><text x={350} y={MY(c) - 2} fontSize="7" textAnchor="end" fill="#d6453a">Nc {Math.round(c)}</text></g>)}
          <line x1={8} x2={352} y1={MY(sp.mcs_rpm)} y2={MY(sp.mcs_rpm)} stroke="var(--line-2)" strokeDasharray="2 3" />
          <polyline fill="none" stroke="var(--accent)" strokeWidth="1.6" points={mini.map(([a, b]: number[]) => `${MX(a)},${MY(b)}`).join(" ")} />
          <line x1={MX(now)} x2={MX(now)} y1={4} y2={106} stroke="var(--ink)" /><circle cx={MX(now)} cy={MY(n)} r="3.5" fill="#d6453a" />
        </svg>
        <div className="mrt-legend">{Object.entries(PHASE_COL).map(([k, c]) => <span key={k}><i style={{ background: c }} />{k}</span>)}</div>
        <div className="mono small">Oil {fmt(oilT, 1)} °C / {fmt(oilP, 2)} barg · {seg?.oil_t} T / {seg?.oil_p} P</div>
      </aside>
    </div>
  );
}

// ---------------------------------------------------------------- live charts under the train
const PCOL: Record<string, string> = { "V1-X": "#0b5cad", "V1-Y": "#7b3fb5", "V2-X": "#2e9e6b", "V2-Y": "#d1782a" };

function LivePanel({ d, now, n, vib, T }: { d: Json; now: number; n: number; vib: Record<string, number>; T: TFn }) {
  const al = d.along, pr = d.prediction, sp = d.speeds, lim = d.limit_um;
  const [probe, setProbe] = useState("V1-X");
  const i = Math.max(bisect(al.t_min, now), 1);
  const th = al.t_min.slice(0, i + 1).map((v: number) => v / 60);
  const crit: number[] = pr.critical_speeds.map((c: Json) => c.speed_rpm);
  const a1 = vib[probe] || 0, f1 = n / 60, fm = (4 * sp.mcs_rpm) / 60;
  const comp = n > 50 ? [[1, a1, "1X"], [2, 0.06 * a1 + 0.25, "2X"], [3, 0.1 + 0.02 * a1, "3X"], [0.43, 0.25, "sub"]] as [number, number, string][] : [];
  return (
    <div className="mrt-live">
      <div className="mrt-live-head"><b>Live test charts</b>
        <div className="seg">{PROBES.map((k) => <button key={k} className={probe === k ? "on" : ""} onClick={() => setProbe(k)}>{T(k)}</button>)}</div></div>
      <LiveChart title="Trend · shaft vibration (µm pk-pk) and speed" xl="Time (h)" yl="µm pk-pk" yr="rpm" h={200}
        xr={[0, d.plan.duration_min / 60]} yrange={[0, lim * 1.1]} y2range={[0, sp.trip_rpm * 1.08]} cursor={now / 60}
        hlines={[{ y: lim, color: "#c0392b", label: `limit ${fmt(lim, 1)}` }]}
        series={[...PROBES.map((k) => ({ x: th, y: al[k].slice(0, i + 1), color: PCOL[k], name: T(k), width: 1.4 })),
          { x: th, y: al.speed_rpm.slice(0, i + 1), color: "#8e9aa5", right: true, fill: true, width: 1.2, name: "speed" }]} />
      <div className="mrt-live-row">
        <LiveChart title={`Bode · ${T(probe)} 1X amplitude`} xl="Speed (rpm)" yl="µm pk-pk" h={180} xr={[0, sp.trip_rpm * 1.04]}
          vlines={crit.slice(0, 2).map((c) => ({ x: c, color: "#c0392b", label: `Nc ${Math.round(c)}` }))}
          series={[{ x: pr.speeds_rpm, y: pr.probes[probe].amp_1x_um, color: PCOL[probe], fill: true, width: 1.6 }]}
          markers={n > 50 ? [{ x: n, y: lerp(pr.speeds_rpm, pr.probes[probe].amp_1x_um, n), color: "#c0392b", label: `${Math.round(n)} rpm` }] : []} legend={false} />
        <LiveChart title={`Spectrum · ${T(probe)} at ${Math.round(n)} rpm`} xl="Frequency (Hz)" yl="µm" h={180} xr={[0, fm]}
          yrange={[0, Math.max(lim * 0.5, a1 * 1.25, 1)]} bars={comp.map(([o, a, l]) => ({ x: o * f1, y: a, color: l === "1X" ? PCOL[probe] : "#8e9aa5", label: l }))}
          series={[]} legend={false} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- waterfall and polar
function Waterfall({ wf: raw, mcs }: { wf: Json[]; mcs: number }) {
  const wf = [...raw].sort((a, b) => a.speed_rpm - b.speed_rpm);
  const fmax = (4 * mcs) / 60, amax = Math.max(...wf.flatMap((w) => w.components.map((q: Json) => q.amp_um)), 1);
  return (
    <svg viewBox="0 0 600 330" className="runup" role="img" aria-label="Waterfall">
      {wf.map((w, i) => { const ox = 40 + i * 22, oy = 290 - i * 40; const X = (f: number) => ox + (f / fmax) * 340;
        const pts: string[] = [];
        for (let k = 0; k <= 300; k++) { const f = (k / 300) * fmax; let a = 0.05 + 0.04 * Math.abs(Math.sin(k * 1.3 + i));
          for (const q of w.components) a += q.amp_um * Math.exp(-(((f - q.freq_hz) / (fmax * 0.006)) ** 2));
          pts.push(`${X(f)},${oy - (a / amax) * 70}`); }
        return <g key={i}><line x1={ox} x2={ox + 340} y1={oy} y2={oy} stroke="#b9bfc2" />
          <polyline fill="none" stroke={SERIES[i % SERIES.length]} strokeWidth="1.4" points={pts.join(" ")} />
          <text x={ox + 346} y={oy + 3} fontSize="9" fill="#5b6878">{w.label} · {Math.round(w.speed_rpm)} rpm</text></g>; })}
      {[0, 1, 2, 3, 4].map((o) => <text key={o} x={40 + (o / 4) * 340} y={306} fontSize="9" textAnchor="middle" fill="#5b6878">{fmt((o * mcs) / 60, 0)}</text>)}
      <text x="220" y="322" fontSize="10" textAnchor="middle" fill="#0c1a2b">Frequency (Hz) · 1X dominant, small 2X / sub-synchronous residuals</text>
    </svg>
  );
}

// ---------------------------------------------------------------- page
export function MechRunTestPage(c: Ctx) {
  const key = c.project?.name ?? "project";
  const mem = MEM[key] ?? (MEM[key] = { log: [], cd: [], urt: { critical_rpm: "", amplitudes_um: {} }, leak: null, options: { urt_multiple: 4, runout_um: 4 } });
  const [tab, setTab] = useState(0);
  const [d, setD] = useState<Json>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [log, setLogS] = useState<Json[]>(mem.log);
  const [cd, setCdS] = useState<Json[]>(mem.cd);
  const [urt, setUrtS] = useState<Json>(mem.urt);
  const [leak, setLeakS] = useState<Json>(mem.leak);
  const [opt, setOptS] = useState<Json>(mem.options);
  const setLog = (v: Json[]) => { mem.log = v; setLogS(v); };
  const setCd = (v: Json[]) => { mem.cd = v; setCdS(v); };
  const setUrt = (v: Json) => { mem.urt = v; setUrtS(v); };
  const setLeak = (v: Json) => { mem.leak = v; setLeakS(v); };
  const setOpt = (v: Json) => { mem.options = v; setOptS(v); };
  const fileRef = useRef<HTMLInputElement>(null);
  const capRef = useRef<SVGSVGElement | null>(null);
  const { T } = useTags(c.project);

  const body = (o: Json = opt) => ({
    project: c.project, casing: c.casing, options: o,
    log: log.map((r) => Object.fromEntries(Object.entries(r).map(([k, v]) => [k, k === "time" || k === "seq" ? v : num(v) ?? ""]))).filter((r) => r.N1 !== ""),
    coastdown: cd.filter((q) => num(q.speed_rpm) !== undefined && num(q.amp_um) !== undefined).map((q) => ({ ...q, speed_rpm: Number(q.speed_rpm), amp_um: Number(q.amp_um), phase_deg: num(q.phase_deg) })),
    urt: { critical_rpm: num(urt.critical_rpm), amplitudes_um: Object.fromEntries(Object.entries(urt.amplitudes_um ?? {}).filter(([, v]) => num(v) !== undefined).map(([k, v]) => [k, Number(v)])) },
    leak: leak ? { ...leak, readings: leak.readings.map((r: Json) => ({ ...r, pressure_barg: num(r.pressure_barg) ?? null, dgs_de_nm3h: num(r.dgs_de_nm3h) ?? null, dgs_nde_nm3h: num(r.dgs_nde_nm3h) ?? null })) } : null,
  });
  const seq = useRef(0);
  const load = async (o: Json = opt) => {
    const id = ++seq.current;
    setBusy(true); setErr("");
    try { const r = await post("/api/mrt", body(o)); if (id === seq.current) { setD(r); if (!leak) setLeak({ gas: r.leak.gas, test_pressure_barg: r.leak.test_pressure_barg, dgs_primary_ref_nm3h: r.leak.dgs_primary_ref_nm3h, hold_min: r.leak.hold_min, readings: r.leak.readings }); } }
    catch (e) { if (id === seq.current) setErr((e as Error).message); } finally { if (id === seq.current) setBusy(false); }
  };
  useEffect(() => { if (c.results) load(); }, [c.results, c.casing]); // eslint-disable-line react-hooks/exhaustive-deps

  const pr = d?.prediction;
  const plots = useMemo(() => {
    if (!d) return null;
    const s = pr.speeds_rpm, h = d.plan.t_min.map((t: number) => t / 60);
    const lim = { x: [s[0], s[s.length - 1]], y: [d.limit_um, d.limit_um], name: "API limit", mode: "lines", line: { dash: "dash", color: "#C0392B" } };
    return {
      speed: [{ x: h, y: d.plan.speed_rpm, name: "Speed", mode: "lines" }, ...pr.critical_speeds.map((q: Json, i: number) => ({ x: [0, h[h.length - 1]], y: [q.speed_rpm, q.speed_rpm],
        name: `Critical ${i + 1} (AF ${fmt(q.af, 1)})`, mode: "lines", line: { dash: "dash", color: SERIES[1 + i] } })),
        { x: [0, h[h.length - 1]], y: [d.speeds.mcs_rpm, d.speeds.mcs_rpm], name: "MCS", mode: "lines", line: { dash: "dot", color: SERIES[2] } }],
      oil: [{ x: h, y: d.plan.oil_t_c, name: "Oil supply T (°C)", mode: "lines" }, { x: h, y: d.plan.oil_p_barg, name: "Oil supply P (barg)", mode: "lines", yaxis: "y2" }],
      amp: [...PROBES.map((k) => ({ x: s, y: pr.probes[k].unfiltered_um, name: `${T(k)} unfiltered`, mode: "lines" })),
        ...PROBES.slice(0, 1).flatMap((k) => [{ x: s, y: pr.probes[k].amp_1x_um, name: `${T(k)} 1X compensated`, mode: "lines", line: { dash: "dot" } },
          { x: s, y: pr.probes[k].uncomp_1x_um, name: `${T(k)} 1X uncompensated`, mode: "lines", line: { dash: "dash" } }]), lim],
      phase: PROBES.map((k) => ({ x: s, y: pr.probes[k].phase_deg, name: T(k), mode: "lines" })),
      polar: ["V1-X", "V2-X"].map((k) => ({ x: pr.probes[k].amp_1x_um.map((a: number, i: number) => a * Math.cos((pr.probes[k].phase_deg[i] * Math.PI) / 180)),
        y: pr.probes[k].amp_1x_um.map((a: number, i: number) => a * Math.sin((pr.probes[k].phase_deg[i] * Math.PI) / 180)), name: `${T(k)} 1X`, mode: "lines" })),
      orbit: Object.entries(pr.orbits ?? {}).map(([k, v]: [string, Json]) => ({ x: v.x_um, y: v.y_um, name: `${k.replace("V1", "DE").replace("V2", "NDE")} ${fmt(v.speed_rpm, 0)} rpm`, mode: "lines" })),
      cl: Object.entries(pr.centreline).flatMap(([k, v]: [string, Json], i) => [{ x: v.x_um, y: v.y_um, name: k, mode: "lines+markers" },
        { x: Array.from({ length: 73 }, (_, j) => v.clearance_um * Math.cos((j * 5 * Math.PI) / 180)), y: Array.from({ length: 73 }, (_, j) => v.clearance_um * Math.sin((j * 5 * Math.PI) / 180)),
          name: `${k} clearance`, mode: "lines", line: { dash: "dash", color: SERIES[6 + (i % 2)] } }]),
      temp: Object.entries(pr.bearing_temp_table).map(([k, v]: [string, Json]) => ({ x: v.speeds_rpm, y: v.temp_c, name: k, mode: "lines+markers" })),
      urt: [...PROBES.map((k) => ({ x: d.urt.speeds_rpm, y: d.urt.response[k].amp_um, name: `${T(k)} with trial`, mode: "lines" })),
        ...PROBES.map((k) => ({ x: [d.speeds.mcs_rpm, d.speeds.mcs_rpm], y: [d.urt.predicted_range_um[k].mcs[0], d.urt.predicted_range_um[k].mcs[2]], name: `${T(k)} range at MCS`, mode: "lines+markers", showlegend: false }))],
    };
  }, [d, pr, T]);
  const logPlot = useMemo(() => d?.log ? [...PROBES.map((k) => ({ x: d.log.rows.map((r: Json) => r.t_min), y: d.log.rows.map((r: Json) => r.vib[k] ?? null), name: `${T(k)} measured`, mode: "lines+markers" })),
    { x: d.log.rows.map((r: Json) => r.t_min), y: d.log.rows.map((r: Json) => r.predicted["V1-X"]), name: `${T("V1-X")} predicted`, mode: "lines", line: { dash: "dash" } },
    { x: [d.log.rows[0]?.t_min ?? 0, d.log.rows[d.log.rows.length - 1]?.t_min ?? 1], y: [d.limit_um, d.limit_um], name: "Limit", mode: "lines", line: { dash: "dash", color: "#C0392B" } }] : null, [d, T]);

  if (!c.results) return <><h2>Mechanical running test</h2><p className="muted">Run the analysis first.</p></>;
  const exampleLog = () => {
    if (!d) return;
    const mcs = d.speeds.mcs_rpm, at = (k: string) => d.along[k][d.along[k].length - 10] ?? 5;
    // 4 h at MCS, one row every 15 min: 60 min stabilisation, the five 30 min oil sequences, final readings
    const seqs = ["nor", "nor", "nor", "nor", "Seq 1", "Seq 1", "Seq 2", "Seq 2", "Seq 3", "Seq 3", "Seq 4", "Seq 4", "Seq 5", "Seq 5", "nor", "nor", "nor"];
    setLog(seqs.map((s, i) => { const o = d.oil, ot = s === "Seq 1" || s === "Seq 2" ? o.t.max : s === "Seq 4" || s === "Seq 5" ? o.t.min : o.t.nor;
      const op = s === "Seq 1" || s === "Seq 4" ? o.p.min : s === "Seq 2" || s === "Seq 5" ? o.p.max : o.p.nor;
      const row: Json = { time: hhmm(i * 15), N1: Math.round(mcs), seq: s, T_oil: fmt(ot, 1), P_oil: fmt(op, 2), "V5-Z": 120 + 3 * i, "V6-Z": 118 + 3 * i,
        SG_DE: (1.2 + 0.05 * Math.sin(i)).toFixed(2), SG_NDE: (1.1 + 0.05 * Math.cos(i)).toFixed(2) };
      PROBES.forEach((k, j) => { row[k] = (at(k) * (1 + 0.06 * Math.sin(i + j))).toFixed(1); });
      for (let j = 1; j <= 12; j++) row[`TA${j}`] = (((d.along[j <= 3 ? "Bearing 1" : j <= 6 ? "Bearing 2" : "Thrust (active)"] ?? [80]).slice(-10)[0] - (j > 9 ? 12 : 0)) + (ot - o.t.nor) + 0.5 * Math.sin(i * j)).toFixed(1);
      const rise: number[] = Object.values(d.prediction.bearing_oil ?? {}).map((b: Json) => b.temp_rise_k ?? 15);
      row.TD1 = (ot + (rise[0] ?? 14)).toFixed(1); row.TD2 = (ot + (rise[1] ?? 16)).toFixed(1); return row; }));
  };
  const importCSV = async (f: File) => { const byTag = Object.fromEntries(LOGCOLS.map((k) => [T(k), k]));
    const rows = parseCSV(await f.text()).map((r) => Object.fromEntries(Object.entries(r).map(([k, v]) => [byTag[k] ?? k, v]))); if (!rows.length) { toast({ text: "No rows in the CSV", error: true }); return; } setLog(rows); toast({ text: `Imported ${rows.length} log rows` }); };
  const exportCSV = () => { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([toCSV(log, LOGCOLS)], { type: "text/csv" })); a.download = `${safeName(key)}_MRT_log.csv`; a.click(); };
  const acc = d?.acceptance ?? [];
  const report = async () => saveFrom("/api/mrt/report.pdf", { ...body(), images: { setup: await svgToPng(capRef.current) } }, `${safeName(key)}_MRT.pdf`);
  const setO = (patch: Json) => setOpt({ ...opt, ...patch });

  return (
    <>
      <h2>Mechanical running test</h2>
      <p className="lead">API 617 9th ed. 8.3.2 / 8.3.3 shop running test, planned from the project: the test train, the speed-time profile through the critical speeds, trip
        hold and the 4 h run with five lube-oil sequences, the predicted probe readings along it, the acceptance criteria, the unbalanced rotor response test, the
        test-log evaluation, the assembled gas leak test and the report.</p>
      {err && <div className="error">{err}</div>}
      {d && <div className="kpis">{[["MSS / MCS / trip", `${fmt(d.speeds.min_rpm, 0)} / ${fmt(d.speeds.mcs_rpm, 0)} / ${fmt(d.speeds.trip_rpm, 0)} rpm`],
        ["Vibration limit", `${fmt(d.limit_um, 1)} µm pk-pk`], ["1st critical (predicted)", pr.critical_speeds[0] ? `${fmt(pr.critical_speeds[0].speed_rpm, 0)} rpm` : "–"],
        ["Test duration", `${hhmm(d.plan.duration_min)} h`], ["URT nameplate", `"${d.urt.nameplate}"`], ["Overall", d.status]].map(([l, x]) =>
        <div className="kpi" key={l}><div className={`v ${String(x).length > 16 ? "long" : ""}`}>{l === "Overall" ? <Pill s={x} /> : x}</div><div className="l">{l}</div></div>)}</div>}
      {d && <Summary rows={acc.map((a: Json) => [a.check, a.measured != null ? fmt(a.measured, 1) : a.predicted != null ? `${fmt(a.predicted, 1)} pred.` : "–", a.status])} />}
      <div className="seg" style={{ marginBottom: 14 }}>{TABS.map((t, i) => <button key={t} className={tab === i ? "on" : ""} onClick={() => setTab(i)}>{t}</button>)}</div>
      {busy && <p className="muted">Calculating…</p>}
      {d && <div className="capture" aria-hidden="true"><TrainAnim d={d} T={T} still svgRef={(e) => { capRef.current = e; }} /></div>}

      {d && tab === 0 && <>
        <div className="card"><h3>Test train · animated run of the speed-time plan</h3><TrainAnim key={`${d.plan.duration_min}-${d.train.components.length}`} d={d} T={T} /></div>
        <div className="grid" style={{ marginTop: 14 }}>
          <div className="card"><h3>Equipment checklist (shop / contract)</h3>
            <table className="t"><thead><tr><th>Item</th><th>Source</th><th>Note</th></tr></thead>
              <tbody>{d.train.components.map((q: Json) => <tr key={q.key}><td>{q.name}</td>
                <td><select className="inp" value={q.source} onChange={(e) => { const o = { ...opt, equipment: { ...(opt.equipment ?? {}), [q.key]: e.target.value } }; setOpt(o); load(o); }}>
                  <option value="shop">shop</option><option value="contract">contract</option></select></td><td className="muted small">{q.note}</td></tr>)}</tbody></table></div>
          <div className="card"><h3>Procedure</h3><ol className="small">{d.procedure.map((s: string, i: number) => <li key={i}>{s}</li>)}</ol>
            <p className="muted small">Driver type and gear ratio come from Design basis and Torsional train inputs.</p></div>
        </div></>}

      {d && tab === 1 && plots && <>
        <div className="grid">
          <div className="card"><h3>Speed vs time</h3><Plot height={320} data={plots.speed} layout={{ xaxis: { title: "Time (h)" }, yaxis: { title: "Speed (rpm)" } }} /></div>
          <div className="card"><h3>Lube-oil supply temperature and pressure</h3><Plot height={320} data={plots.oil} layout={{ xaxis: { title: "Time (h)" }, yaxis: { title: "Oil T (°C)" }, yaxis2: { title: "Oil P (barg)" } }} /></div>
        </div>
        <div className="card" style={{ marginTop: 14 }}><h3>Test sequence</h3>
          <div className="scroll"><table className="t"><thead><tr><th>Phase</th><th>Activity</th><th>Time min</th><th>Speed rpm</th><th>Oil T / P</th><th /></tr></thead>
            <tbody>{d.plan.segments.map((s: Json, i: number) => <tr key={i}><td><span className="dom" style={{ background: PHASE_COL[s.phase] }}>{s.phase}</span></td><td>{s.label}</td>
              <td className="n">{fmt(s.t0_min, 0)}–{fmt(s.t1_min, 0)}</td><td className="n">{fmt(s.n0_rpm, 0)} → {fmt(s.n1_rpm, 0)}</td><td>{s.oil_t} / {s.oil_p}</td>
              <td>{s.critical && <span className="pill fail">critical</span>}</td></tr>)}</tbody></table></div>
          <p className="muted small">Oil: T {fmt(d.oil.t.min, 0)} / {fmt(d.oil.t.nor, 0)} / {fmt(d.oil.t.max, 0)} °C, P {fmt(d.oil.p.min, 2)} / {fmt(d.oil.p.nor, 2)} / {fmt(d.oil.p.max, 2)} barg (min / normal / max).</p></div></>}

      {d && tab === 2 && plots && <>
        <p className="muted small">Synchronous response to the allowable residual unbalance (6350 W/N per journal: {pr.residual_unbalance_g_mm.map((u: number) => fmt(u, 0)).join(" / ")} g·mm, static at the
          centre of mass plus a couple) from the rotor FE model with speed-dependent bearing coefficients; unfiltered = 1X with {fmt(pr.runout_um, 1)} µm runout and small residuals.</p>
        <div className="grid">
          <div className="card"><h3>Bode · amplitude</h3><Plot height={300} data={plots.amp} layout={{ xaxis: { title: "Speed (rpm)" }, yaxis: { title: "Amplitude (µm pk-pk)" } }} /></div>
          <div className="card"><h3>Bode · 1X phase</h3><Plot height={300} data={plots.phase} layout={{ xaxis: { title: "Speed (rpm)" }, yaxis: { title: "Phase lag (°)" } }} /></div>
          <div className="card"><h3>Polar (1X)</h3><Plot height={320} data={plots.polar} layout={{ xaxis: { title: "Real (µm)" }, yaxis: { title: "Imag (µm)" } }} /></div>
          <div className="card"><h3>Orbits (1X) at MCS and trip</h3><Plot height={320} data={plots.orbit} layout={{ xaxis: { title: "X (µm)" }, yaxis: { title: "Y (µm)", scaleanchor: "x" } }} /></div>
          <div className="card"><h3>Shaft centreline in the bearing clearance</h3><Plot height={320} data={plots.cl} layout={{ xaxis: { title: "x (µm)" }, yaxis: { title: "y (µm)" } }} /></div>
          <div className="card"><h3>Waterfall at six speeds</h3><Waterfall wf={pr.waterfall} mcs={d.speeds.mcs_rpm} /></div>
          <div className="card"><h3>Bearing metal temperature (normal oil)</h3><Plot height={300} data={plots.temp} layout={{ xaxis: { title: "Speed (rpm)" }, yaxis: { title: "Babbitt (°C)" } }} /></div>
        </div>
        <div className="card" style={{ marginTop: 14 }}><h3>Predicted critical speeds</h3>
          <table className="t"><thead><tr><th>Critical</th><th>Speed rpm</th><th>AF</th><th>Position</th><th>SM actual %</th><th>SM required %</th><th>Status</th><th>Note</th></tr></thead>
            <tbody>{pr.critical_speeds.map((q: Json, i: number) => <tr key={i}><td>{i + 1}</td><td className="n">{fmt(q.speed_rpm, 0)}</td><td className="n">{fmt(q.af, 2)}</td><td>{q.position}</td>
              <td className="n">{fmt(q.sm_actual_pct, 1)}</td><td className="n">{q.af == null ? "AF not determinable" : q.sm_required_pct == null ? "none" : fmt(q.sm_required_pct, 1)}</td><td><Pill s={q.sm_status} /></td>
              <td className="muted">{q.af == null ? "broad hump, no half-power band: confirm with the coast-down Bode" : q.af < 2.5 ? "critically damped (AF < 2.5)" : q.speed_rpm < d.speeds.min_rpm ? "pass quickly during run-up" : "inside the speed range: check separation"}</td></tr>)}</tbody></table></div></>}

      {d && tab === 3 && <div className="card"><h3>Acceptance criteria · API 617 8.3.2 {d.log ? "(with the test log)" : "(predicted; enter the test log for measured values)"}</h3>
        <div className="scroll"><table className="t"><thead><tr><th>Check</th><th>Criterion</th><th>Predicted</th><th>Measured</th><th>Status</th></tr></thead>
          <tbody>{acc.map((a: Json) => <tr key={a.check}><td>{a.check}</td><td className="muted">{a.criterion}</td><td className="n">{fmt(a.predicted, 1)}</td><td className="n">{fmt(a.measured, 1)}</td><td><Pill s={a.status} /></td></tr>)}</tbody></table></div>
        <div className="form" style={{ marginTop: 12 }}>
          <label>Measured runout µm<input type="number" step="any" value={opt.runout_measured_um ?? ""} onChange={(e) => setOpt({ ...opt, runout_measured_um: num(e.target.value) })} /></label>
          <label>Noise at 1 m dBA<input type="number" step="any" value={opt.noise_dba ?? ""} onChange={(e) => setOpt({ ...opt, noise_dba: num(e.target.value) })} /></label>
          <label>Predicted runout µm<input type="number" step="any" value={opt.runout_um ?? 4} onChange={(e) => setOpt({ ...opt, runout_um: num(e.target.value) })} /></label>
          <label>Bearing metal limit °C<input type="number" value={opt.bearing_temp_limit_c ?? 105} onChange={(e) => setOpt({ ...opt, bearing_temp_limit_c: num(e.target.value) })} /></label>
          <label>Trip set point rpm<input type="number" value={opt.trip_setpoint_rpm ?? ""} placeholder={fmt(d.speeds.trip_rpm, 0)} onChange={(e) => setO({ trip_setpoint_rpm: num(e.target.value) })} /></label>
          <label>Trip measured rpm<input type="number" value={opt.trip_measured_rpm ?? ""} onChange={(e) => setO({ trip_measured_rpm: num(e.target.value) })} /></label>
          <label>DGS primary vent ref Nm³/h<input type="number" step="any" value={opt.dgs_primary_ref_nm3h ?? 4.5} onChange={(e) => setO({ dgs_primary_ref_nm3h: num(e.target.value) })} /></label>
        </div>
        <button className="btn primary" style={{ marginTop: 10 }} onClick={() => load()}>Re-evaluate</button></div>}

      {d && tab === 4 && plots && <div className="grid">
        <div className="card"><h3>Unbalanced rotor response test (8.3.3) {d.urt.status !== "review" && <Pill s={d.urt.status} />}</h3>
          <table className="t"><tbody>{[["Ur, coupling-end journal", `${fmt(d.urt.ur_g_mm, 1)} g·mm (journal load ${fmt(d.urt.journal_load_kg, 0)} kg)`],
            ["Coupling half mass", `${fmt(d.urt.coupling_half_mass_kg, 1)} kg`], ["Trial radius", `${fmt(d.urt.radius_mm, 0)} mm`],
            ["Allowed trial range 2–8 × Ur", `${fmt(d.urt.range_g_mm[0], 0)}–${fmt(d.urt.range_g_mm[1], 0)} g·mm = ${fmt(d.urt.range_mass_g[0], 2)}–${fmt(d.urt.range_mass_g[1], 2)} g`],
            ["Selected trial", `${fmt(d.urt.multiple, 1)} × Ur = ${fmt(d.urt.trial_g_mm, 0)} g·mm = ${fmt(d.urt.trial_mass_g, 2)} g at the coupling`],
            ["Predicted critical with trial", `${fmt(d.urt.predicted_critical_rpm, 0)} rpm`], ["Test speed (operating speed nearest the critical)", `${fmt(d.urt.test_speed_rpm, 0)} rpm`],
            ["Nameplate critical speed stamp", `"${d.urt.nameplate}"`]].map(([k, v]) => <tr key={k}><td className="muted">{k}</td><td>{v}</td></tr>)}</tbody></table>
          <div className="form" style={{ marginTop: 10 }}>
            <label>Trial multiple of Ur (2–8)<input type="number" step="0.5" value={opt.urt_multiple ?? 4} onChange={(e) => setOpt({ ...opt, urt_multiple: num(e.target.value) })} /></label>
            <label>Trial radius mm<input type="number" value={opt.urt_radius_mm ?? ""} placeholder={fmt(d.urt.radius_mm, 0)} onChange={(e) => setOpt({ ...opt, urt_radius_mm: num(e.target.value) })} /></label>
            <label>Measured critical rpm<input type="number" value={urt.critical_rpm ?? ""} onChange={(e) => setUrt({ ...urt, critical_rpm: e.target.value })} /></label>
            {PROBES.map((k) => <label key={k}>{k} at MCS µm<input type="number" step="any" value={urt.amplitudes_um?.[k] ?? ""} placeholder={`${fmt(d.urt.predicted_range_um[k].mcs[0], 1)}–${fmt(d.urt.predicted_range_um[k].mcs[2], 1)}`}
              onChange={(e) => setUrt({ ...urt, amplitudes_um: { ...urt.amplitudes_um, [k]: e.target.value } })} /></label>)}
          </div>
          <button className="btn primary" style={{ marginTop: 10 }} onClick={() => load()}>Evaluate URT</button>
          <table className="t" style={{ marginTop: 10 }}><tbody>{d.urt.checks.map((q: Json) => <tr key={q.check}><td>{q.check}</td><td className="n">{fmt(q.value, 2)}</td><td><Pill s={q.status} /></td></tr>)}</tbody></table></div>
        <div className="card"><h3>Predicted response with the trial unbalance</h3><Plot height={340} data={plots.urt} layout={{ xaxis: { title: "Speed (rpm)" }, yaxis: { title: "1X (µm pk-pk)" } }} />
          <p className="muted small">Range = trial response ± residual response (unknown relative phase). Measured critical must lie within ±5 % of the prediction and the probe response at MCS within the range; then the nameplate shows "test", otherwise "calc".</p></div>
      </div>}

      {d && tab === 5 && <>
        <div className="card"><h3>Log sheet (one row every 30 min) {d.log && <Pill s={d.log.status} />}</h3>
          <div className="row">
            <button className="btn" onClick={() => setLog([...log, { time: hhmm(log.length * 30), N1: Math.round(d.speeds.mcs_rpm) }])}>Add row</button>
            <button className="btn" onClick={exampleLog}>Fill example (from prediction)</button>
            <button className="btn" onClick={() => fileRef.current?.click()}>Import CSV</button>
            <input ref={fileRef} type="file" accept=".csv,.txt" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) importCSV(f); e.target.value = ""; }} />
            <button className="btn" onClick={exportCSV} disabled={!log.length}>Export CSV</button>
            <button className="btn" onClick={() => setLog([])} disabled={!log.length}>Clear</button>
            <button className="btn primary" onClick={() => load()}>Evaluate</button>
          </div>
          <div className="scroll mrt-log"><table className="t"><thead><tr>{LOGCOLS.map((k) => <th key={k} title={k}>{k === "time" || k === "seq" ? k : T(k)}</th>)}<th>Status</th></tr></thead>
            <tbody>{log.map((r, i) => <tr key={i}>{LOGCOLS.map((k) => <td key={k}><input className="inp cell" value={r[k] ?? ""} onChange={(e) => setLog(log.map((x, j) => (j === i ? { ...x, [k]: e.target.value } : x)))} /></td>)}
              <td>{d.log?.rows[i] && <span title={d.log.rows[i].flags.join("; ")}><Pill s={d.log.rows[i].status} /></span>}</td></tr>)}</tbody></table></div>
          <p className="muted small">One row every 15 min. Columns: {T("N1")} speed rpm, {T("V1-X")}/{T("V1-Y")}/{T("V2-X")}/{T("V2-Y")} shaft vibration µm pk-pk, {T("V5-Z")}/{T("V6-Z")} axial position µm,
            {` ${T("TA1")}…${T("TA12")}`} bearing metal °C, {T("TD1")}/{T("TD2")} oil drain °C, {T("T_oil")} / {T("P_oil")} oil supply, {T("SG_DE")}/{T("SG_NDE")} seal vents Nm³/h, seq (Seq 1–5 or nor).
            CSV headers may be the tags or the internal keys (hover a header).</p></div>
        <div className="grid" style={{ marginTop: 14 }}>
          {logPlot && <div className="card"><h3>Measured vs predicted</h3><Plot height={300} data={logPlot} layout={{ xaxis: { title: "Time (min)" }, yaxis: { title: "µm pk-pk" } }} /></div>}
          <div className="card"><h3>Coast-down Bode points</h3>
            <table className="t"><thead><tr><th>Speed rpm</th><th>Probe</th><th>Amp µm</th><th>Phase °</th></tr></thead>
              <tbody>{cd.map((q, i) => <tr key={i}>{["speed_rpm", "probe", "amp_um", "phase_deg"].map((k) => <td key={k}><input className="inp cell" value={q[k] ?? ""} onChange={(e) => setCd(cd.map((x, j) => (j === i ? { ...x, [k]: e.target.value } : x)))} /></td>)}</tr>)}</tbody></table>
            <div className="row" style={{ marginTop: 8 }}><button className="btn" onClick={() => setCd([...cd, { speed_rpm: "", probe: "V1-X", amp_um: "", phase_deg: "" }])}>Add point</button>
              <button className="btn" onClick={() => { const s = pr.speeds_rpm; setCd(s.filter((_: number, i: number) => i % 12 === 0).map((x: number) => { const i = s.indexOf(x); return { speed_rpm: Math.round(x), probe: "V1-X", amp_um: (pr.probes["V1-X"].amp_1x_um[i] * 1.1).toFixed(2), phase_deg: Math.round(pr.probes["V1-X"].phase_deg[i]) }; })); }}>Fill example</button>
              <button className="btn primary" onClick={() => load()}>Evaluate</button></div>
            {d.coastdown && <table className="t" style={{ marginTop: 8 }}><tbody>{Object.entries(d.coastdown).map(([k, v]: [string, Json]) => <tr key={k}><td>{k}</td>
              <td>measured critical {fmt(v.measured_critical_rpm, 0)} rpm vs predicted {fmt(v.predicted_critical_rpm, 0)} ({fmt(v.deviation_pct, 1)} %)</td><td><Pill s={v.status} /></td></tr>)}</tbody></table>}</div>
        </div></>}

      {d && tab === 6 && leak && <div className="grid">
        <div className="card"><h3>Assembled gas leak test {d.leak.status !== "review" && <Pill s={d.leak.status} />}</h3>
          <div className="form">
            <label>Test gas<input value={leak.gas} onChange={(e) => setLeak({ ...leak, gas: e.target.value })} /></label>
            <label>Test pressure barg (max sealing)<input type="number" step="any" value={leak.test_pressure_barg} onChange={(e) => setLeak({ ...leak, test_pressure_barg: num(e.target.value) })} /></label>
            <label>Hold min<input type="number" value={leak.hold_min} onChange={(e) => setLeak({ ...leak, hold_min: num(e.target.value) })} /></label>
            <label>DGS primary leakage ref Nm³/h<input type="number" step="any" value={leak.dgs_primary_ref_nm3h} onChange={(e) => setLeak({ ...leak, dgs_primary_ref_nm3h: num(e.target.value) })} /></label>
          </div>
          <table className="t" style={{ marginTop: 10 }}><thead><tr><th>t min</th><th>Pressure barg</th><th>DGS DE Nm³/h</th><th>DGS NDE Nm³/h</th><th>Joint leakage</th></tr></thead>
            <tbody>{leak.readings.map((r: Json, i: number) => <tr key={i}>{["t_min", "pressure_barg", "dgs_de_nm3h", "dgs_nde_nm3h"].map((k) => <td key={k}><input className="inp cell" type="number" step="any" value={r[k] ?? ""}
              onChange={(e) => setLeak({ ...leak, readings: leak.readings.map((x: Json, j: number) => (j === i ? { ...x, [k]: e.target.value } : x)) })} /></td>)}
              <td><input type="checkbox" checked={!!r.joint_leak} onChange={(e) => setLeak({ ...leak, readings: leak.readings.map((x: Json, j: number) => (j === i ? { ...x, joint_leak: e.target.checked } : x)) })} /></td></tr>)}</tbody></table>
          <div className="row" style={{ marginTop: 8 }}>
            <button className="btn" onClick={() => setLeak({ ...leak, readings: [...leak.readings, { t_min: (Number(leak.readings[leak.readings.length - 1]?.t_min) || 0) + 15, joint_leak: false }] })}>Add reading</button>
            <button className="btn primary" onClick={() => load()}>Evaluate</button></div>
          <table className="t" style={{ marginTop: 8 }}><tbody>{d.leak.checks.map((q: Json) => <tr key={q.check}><td>{q.check}</td><td className="n">{typeof q.value === "boolean" ? (q.value ? "yes" : "no") : fmt(q.value, 2)}</td><td><Pill s={q.status} /></td></tr>)}</tbody></table></div>
        <div className="card"><h3>Procedure</h3><ol className="small">{d.leak.procedure.map((s: string) => <li key={s}>{s}</li>)}</ol>
          <h3 style={{ marginTop: 14 }}>Post-test inspection</h3>
          {d.inspection.map((q: Json) => <label key={q.key} className="row small" style={{ marginBottom: 4 }}><input type="checkbox" checked={!!opt.inspection?.[q.key]}
            onChange={(e) => { const o = { ...opt, inspection: { ...(opt.inspection ?? {}), [q.key]: e.target.checked } }; setOpt(o); }} />{q.item}</label>)}
          <h3 style={{ marginTop: 14 }}>Retest rules</h3><ul className="small">{d.retest_rules.map((s: string) => <li key={s}>{s}</li>)}</ul></div>
      </div>}

      {tab === 7 && <TagsPanel project={c.project} setProject={c.setProject} groups={["vibration", "temperature", "lube oil", "seal gas", "speed"]} />}

      {d && tab === 8 && <div className="grid">
        <div className="card"><h3>Report</h3>
          <p className="small">Cover with the 2.5D test-train picture and the result summary, contents, set-up and instrument list with calibration, procedure and plan, lube-oil
            variation tests, trend, slow-roll compensated Bode, polar, orbits and shaft centreline, critical speeds and separation margins, spectra / waterfall / sub-synchronous
            screening, bearings and oil, acceptance, trip test and URT, the 15-min log, seal and gas leak tests, inspection, deviations, legend and sign-off.</p>
          <table className="t" style={{ maxWidth: 640 }}><tbody>{[["Acceptance", d.status], ["URT", d.urt.status], ["Test log", d.log?.status ?? "review"], ["Gas leak test", d.leak.status]].map(([k, s]) =>
            <tr key={k}><td>{k}</td><td><Pill s={s} /></td></tr>)}</tbody></table>
          <button className="btn primary" style={{ marginTop: 12 }} disabled={busy} onClick={report}>Download PDF report</button>
          <p className="muted small">Document number, client and sign-off names: Tags & glossary tab.</p></div>
        <div className="card"><h3>Instrument calibration</h3><table className="t small"><thead><tr><th>Tag</th><th>Instrument</th><th>Calibration (date / certificate)</th></tr></thead>
          <tbody>{d.instruments.map((r: Json) => <tr key={r.key}><td className="mono">{T(r.key)}</td><td className="small">{r.instrument}</td>
            <td><input className="inp" value={opt.calibration?.[r.key] ?? ""} onChange={(e) => setO({ calibration: { ...(opt.calibration ?? {}), [r.key]: e.target.value } })} /></td></tr>)}</tbody></table></div>
        <div className="card"><h3>Deviations and non-conformances</h3><table className="t small"><thead><tr><th>Item</th><th>Description</th><th>Disposition</th><th /></tr></thead>
          <tbody>{(opt.deviations ?? []).map((x: Json, i: number) => <tr key={i}>{["item", "description", "disposition"].map((k) => <td key={k}><input className="inp" value={x[k] ?? ""}
            onChange={(e) => setO({ deviations: opt.deviations.map((y: Json, j: number) => (j === i ? { ...y, [k]: e.target.value } : y)) })} /></td>)}
            <td><button className="btn" onClick={() => setO({ deviations: opt.deviations.filter((_: Json, j: number) => j !== i) })}>×</button></td></tr>)}</tbody></table>
          <button className="btn" onClick={() => setO({ deviations: [...(opt.deviations ?? []), { item: "", description: "", disposition: "" }] })}>Add deviation</button></div>
        <div className="card"><h3>Inspection findings</h3>{d.inspection.map((q: Json) => <label key={q.key} className="small" style={{ display: "block", marginBottom: 6 }}>{q.item}
          <input className="inp" style={{ width: "100%" }} placeholder="finding / remark" value={opt.inspection_notes?.[q.key] ?? ""}
            onChange={(e) => setO({ inspection_notes: { ...(opt.inspection_notes ?? {}), [q.key]: e.target.value } })} /></label>)}</div>
      </div>}
    </>
  );
}
