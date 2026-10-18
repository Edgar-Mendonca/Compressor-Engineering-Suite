import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { fmt, type Json } from "../api";
import { LiveChart, type Series } from "../components/LiveChart";
import { safeName, saveFrom, toast } from "../files";
import { Summary, svgToPng, TagsPanel, useTags } from "../components/testTags";
import { Arrow, Block, layout, TagCard, TrainScene, type TrainSpec } from "../components/TrainScene";

// Shop performance test to ASME PTC 10-2022, backend testing/ptc10.py: Type 1 / Type 2 test design with
// every test-gas combination screened, an animated 2.5D closed loop (gas flow, seal-gas system, surge),
// the test log (simulated example or measured), data reduction, conversion, uncertainty, curves, acceptance and the PDF.

type Ctx = { project: Json; results: Json; casing: number; setProject: (p: Json) => void };
const TABS = ["Test design", "Test loop", "Test log", "Results", "Curves", "Acceptance", "Tags & glossary", "Report"];
const LINE = ["#0b5cad", "#2e9e6b", "#d1782a", "#7b3fb5", "#c0392b"];
// [field, tag key, unit]
const COLS: [string, string, string][] = [["point", "", "Point"], ["n_rpm", "N1", "rpm"], ["p1_bara", "p1", "bara"], ["t1_c", "t1", "°C"], ["p2_bara", "p2", "bara"], ["t2_c", "t2", "°C"],
  ["dp_kpa", "dp", "kPa"], ["pu_bara", "pu", "bara"], ["tu_c", "tu", "°C"], ["heat_loss_kw", "qloss", "kW (blank = estimate)"],
  ["fl_p1", "p1", "fluct %"], ["fl_t1", "t1", "fluct %"], ["fl_p2", "p2", "fluct %"], ["fl_q", "dp", "flow fluct %"], ["fl_n", "N1", "fluct %"], ["fl_eta", "", "η fluct %"]];
const METHODS: [string, string][] = [["sandberg_colby", "Sandberg-Colby"], ["schultz", "Schultz"], ["path", "Path integration"]];
const MEM: Record<string, Json> = {};
const post = async (url: string, body: unknown) => {
  const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error((await r.json().catch(() => ({}))).detail ?? r.statusText);
  return r.json();
};
const Pill = ({ s }: { s: string }) => <span className={`pill ${s}`}>{s}</span>;
const pct = (v: number) => `${v >= 0 ? "+" : ""}${fmt(v, 2)} %`;
const lerp = (a: number, b: number, f: number) => a + (b - a) * f;
const tcol = (f: number) => { const k = Math.max(0, Math.min(1, f)); return `rgb(${Math.round(lerp(43, 214, k))},${Math.round(lerp(123, 69, k))},${Math.round(lerp(214, 58, k))})`; };

// ---------------------------------------------------------------- animated closed loop
type Pt = [number, number];
type TFn = (k: string) => string;
/** Point at fraction s (0..1, wrapping) along a polyline, with the segment index and its local fraction. */
function along(P: Pt[], s: number): { p: Pt; seg: number; f: number } {
  const L = P.slice(1).map((p, i) => Math.hypot(p[0] - P[i][0], p[1] - P[i][1]));
  let d = ((s % 1) + 1) % 1 * L.reduce((x, y) => x + y, 0);
  for (let i = 0; i < L.length; i++) { if (d <= L[i]) { const f = d / L[i]; return { p: [lerp(P[i][0], P[i + 1][0], f), lerp(P[i][1], P[i + 1][1], f)], seg: i, f }; } d -= L[i]; }
  return { p: P[0], seg: 0, f: 0 };
}
const smooth = (f: number) => f * f * (3 - 2 * f);
const MULS = [10, 30, 60, 120, 300];
const FL: [string, string, number][] = [["fl_p1", "Inlet pressure", 2.0], ["fl_t1", "Inlet temperature", 0.3], ["fl_p2", "Discharge pressure", 2.0],
  ["fl_q", "Inlet volume flow", 0.5], ["fl_n", "Speed", 0.5], ["fl_eta", "Polytropic efficiency", 0.5]];

type Ev = { kind: string; label: string; t0: number; t1: number; li: number; k: number };
type Op = { q: number; h: number; eta: number; p1: number; t1: number; p2: number; t2: number; m: number; w: number; n: number; dp: number; valve: number; asv: number;
  fl: number; surge: boolean; loopP: number; rec: boolean };

/** Shop test sequence on a minutes timeline: charge, start-up, mechanical run, each speed line point by point
 * (throttle, stabilise, record; surge approach after the last point), vent and coast-down. */
function buildSeq(lines: Json[], coastS: number): Ev[] {
  const ev: Ev[] = []; let t = 0;
  const add = (kind: string, label: string, dur: number, li = 0, k = 0) => { ev.push({ kind, label, t0: t, t1: t + dur, li, k }); t += dur; };
  add("charge", "Purge and charge the loop with test gas", 15);
  add("start", "Start-up to the first test speed", 6);
  add("mech", "Mechanical run until bearing and seal readings are stable", 30);
  lines.forEach((ln, li) => {
    if (li) add("speed", `Change speed to the ${fmt(ln.speed_frac * 100, 0)} % line`, 4, li, 0);
    ln.rs.forEach((r: Json, k: number) => {
      add("throttle", `${fmt(ln.speed_frac * 100, 0)} % line · throttle to ${r.point}`, 3, li, k);
      add("stab", `${fmt(ln.speed_frac * 100, 0)} % line · ${r.point} stabilising (heat balance)`, 8, li, k);
      add("record", `${fmt(ln.speed_frac * 100, 0)} % line · recording ${r.point}`, 5, li, k);
      if (r.surge) { add("surge", `${fmt(ln.speed_frac * 100, 0)} % line · surge approach, anti-surge valve opens`, 1.5, li, k); add("recover", "Open the throttle valve, close the anti-surge valve", 2, li, k); }
    });
  });
  add("vent", "Open the outlet valve and vent to about 2 barg", 6, lines.length - 1, 0);
  add("coast", "Trip and coast-down", Math.max(coastS / 60, 2), lines.length - 1, 0);
  return ev;
}

function stateAt(t: number, seq: Ev[], lines: Json[], tm: number): { op: Op; ev: Ev; f: number } {
  let i = 0; while (i < seq.length - 1 && t >= seq[i].t1) i++;
  const ev = seq[i], f = Math.max(0, Math.min(1, (t - ev.t0) / (ev.t1 - ev.t0 || 1)));
  const P = (li: number, k: number): Op => { const ln = lines[li], r = ln.rs[Math.min(k, ln.rs.length - 1)], rd = r.reading ?? {}, n = ln.rs.length;
    return { q: r.test.qv_m3_h, h: r.test.head_kj_kg, eta: r.test.eta_p, p1: r.test.P01_bara, t1: r.test.T01_c, p2: r.test.P02_bara, t2: r.test.T02_c, m: r.test.m_kg_s,
      w: r.test.shaft_power_kw, n: r.test.n_rpm, dp: rd.dp_kpa ?? 0, valve: 100 - 72 * k / Math.max(n - 1, 1), asv: 0, fl: 0, surge: false, loopP: 1, rec: false }; };
  const mix = (A: Op, B: Op, g: number): Op => Object.fromEntries(Object.keys(A).map((k) => [k, typeof (A as Json)[k] === "number" ? lerp((A as Json)[k], (B as Json)[k], g) : (B as Json)[k]])) as Op;
  const first = P(0, 0);
  const amb: Op = { ...first, q: 0, h: 0, w: 0, n: 0, dp: 0, p2: first.p1, t2: first.t1, m: 0, valve: 100 };
  let op: Op;
  switch (ev.kind) {
    case "charge": op = { ...amb, p1: lerp(1.0, first.p1, smooth(f)), p2: lerp(1.0, first.p1, smooth(f)), loopP: f }; break;
    case "start": { const g = smooth(f); op = { ...first, n: first.n * g, q: first.q * g, h: first.h * g * g, w: first.w * g ** 3, m: first.m * g, dp: first.dp * g * g,
      p2: first.p1 + (first.p2 - first.p1) * g * g, t2: first.t1 + (first.t2 - first.t1) * g * g }; break; }
    case "mech": op = first; break;
    case "speed": { const A = P(ev.li - 1, lines[ev.li - 1].rs.length - 1), B = P(ev.li, 0); op = mix({ ...A, valve: 100 }, B, smooth(f)); break; }
    case "throttle": { const A = ev.k ? P(ev.li, ev.k - 1) : P(ev.li, 0); op = mix(A, P(ev.li, ev.k), smooth(f)); op.fl = 1; break; }
    case "stab": op = { ...P(ev.li, ev.k), fl: Math.exp(-3.2 * f) }; break;
    case "record": op = { ...P(ev.li, ev.k), fl: 0.04, rec: true }; break;
    case "surge": { const A = P(ev.li, ev.k), o = Math.sin(tm * 2 * Math.PI * 0.7); op = { ...A, q: A.q * (0.82 + 0.2 * o), h: A.h * (0.95 - 0.05 * Math.abs(o)), p2: A.p2 * (1 - 0.03 * Math.abs(o)),
      valve: A.valve - 6, asv: Math.min(100, 100 * f * 3), surge: true, fl: 1 }; break; }
    case "recover": { const A = P(ev.li, ev.k), B = P(Math.min(ev.li + 1, lines.length - 1), 0); op = mix({ ...A, asv: 100 }, { ...B, asv: 0, n: A.n, q: B.q * A.n / B.n, h: B.h * (A.n / B.n) ** 2 }, smooth(f)); break; }
    case "vent": { const A = P(ev.li, 0); op = { ...A, p1: lerp(A.p1, 3.0, f), p2: lerp(A.p2, 3.2, f), q: A.q * (1 - 0.3 * f), h: A.h * (1 - 0.6 * f), w: A.w * (1 - 0.8 * f), valve: 100, loopP: 1 - 0.7 * f }; break; }
    default: { const A = P(ev.li, 0), g = 1 - smooth(f); op = { ...A, n: A.n * g, q: A.q * g * 0.6, h: A.h * g * g * 0.3, w: 0, m: A.m * g * 0.4, dp: A.dp * g * g * 0.3, p1: 3.0, p2: 3.0 + 0.4 * g * g, valve: 100, loopP: 0.3 }; }
  }
  if (op.fl > 0.001) {   // process noise while the point settles
    const z = (k: number) => Math.sin(tm * (1.3 + k * 0.37) + k * 2.1) * 0.6 + Math.sin(tm * (3.1 + k * 0.53) + k) * 0.4;
    op = { ...op, p1: op.p1 * (1 + 0.012 * op.fl * z(1)), t1: op.t1 + 0.6 * op.fl * z(2), p2: op.p2 * (1 + 0.012 * op.fl * z(3)), q: op.q * (1 + (op.surge ? 0 : 0.008) * op.fl * z(4)), n: op.n * (1 + 0.003 * op.fl * z(5)) };
  }
  return { op, ev, f };
}

function LoopAnim({ s, d, T, spec, still, svgRef }: { s: Json; d: Json; T: TFn; spec: TrainSpec; still?: boolean; svgRef?: (e: SVGSVGElement | null) => void }) {
  const A = useMemo(() => layout(spec, 60), [spec]);
  const lines = useMemo(() => s.lines.filter((l: Json) => l.results?.some((r: Json) => r.test)).map((l: Json) => ({ ...l,
    rs: l.results.map((r: Json, i: number) => ({ ...r, reading: l.readings[i] })).filter((r: Json) => r.test) })), [s]);
  const seq = useMemo(() => buildSeq(lines, s.coastdown?.predicted_s ?? 300), [lines, s]);
  const dur = seq[seq.length - 1]?.t1 ?? 1;
  const tStill = useMemo(() => { const li = Math.max(0, lines.findIndex((l: Json) => Math.abs(l.speed_frac - 1) < 0.01));
    return seq.find((e) => e.kind === "record" && e.li === li && e.k === Math.floor((lines[li]?.rs.length ?? 1) / 2))?.t0 ?? 0; }, [seq, lines]);
  const t = useRef(still ? tStill + 1 : 0), tm = useRef(0.4), last = useRef(0), pos = useRef(Array.from({ length: 70 }, (_, i) => i / 70));
  const [mul, setMul] = useState(60);
  const [inst, setInst] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [, setFrame] = useState(0);
  const st = useRef({ mul }); st.current = { mul };
  useEffect(() => {
    if (!playing) return;
    let raf = 0, acc = 0;
    const f = (now: number) => {
      const dt = last.current ? Math.min((now - last.current) / 1000, 0.1) : 0; last.current = now;
      tm.current += dt;
      t.current = Math.min(t.current + dt * st.current.mul / 60, dur); if (t.current >= dur) setPlaying(false);
      const { op } = stateAt(t.current, seq, lines, tm.current);
      const qmax = lines[0]?.rs[0]?.test.qv_m3_h || 1;
      const spd = op.surge ? 0.16 * Math.sin(tm.current * 2 * Math.PI * 0.7) : 0.02 + 0.12 * Math.min(op.q / qmax, 1.4);
      pos.current = pos.current.map((p) => p + spd * dt);
      acc += dt; if (acc >= 1 / 30) { acc = 0; setFrame((k) => (k + 1) % 1e6); }
      raf = requestAnimationFrame(f);
    };
    raf = requestAnimationFrame(f);
    return () => { cancelAnimationFrame(raf); last.current = 0; };
  }, [playing, seq, lines, dur]);
  if (!lines.length) return <p className="muted">No test points to animate.</p>;

  const now = t.current;
  const { op, ev, f } = stateAt(now, seq, lines, tm.current);
  const ln = lines[ev.li], li = ev.li;
  const recorded: { li: number; r: Json }[] = seq.filter((e) => e.kind === "record" && e.t1 <= now).map((e) => ({ li: e.li, r: lines[e.li].rs[e.k] }));
  const gas = Object.keys(s.test_gas ?? {}).join("/") || "gas";
  const seal = s.seal_gas;
  const phi = tm.current * (op.n / 3000);
  const fl = (k: number) => op.fl * [0.9, 0.25, 0.95, 0.45, 0.25, 0.4][k] * 2.2;   // fluctuation % shown for the stability check
  const stableOk = FL.map(([, , lim], k) => fl(k) <= lim);
  const stabT = ev.kind === "stab" ? (ev.t1 - now) : 0;
  const hhmm = (m: number) => `${Math.floor(m / 60)}:${String(Math.floor(m % 60)).padStart(2, "0")}`;
  const purity = 95 + 4.6 * Math.min(1, now / 15);
  const sgv = op.n > 50 ? [0.4 + 1.1 * op.p1 / 10, 0.38 + 1.05 * op.p1 / 10] : [0.1, 0.1];
  // closed loop over the train: discharge -> throttle valve -> cooler -> orifice -> suction
  const c0 = A.casings[0], [gx] = A.dgs, [mx, mw] = A.motor;
  const [sx, sy] = c0.suction, [dx] = c0.discharge;
  const yA = 134, yT = 54, xR = gx + 96, xL = mx + 10, cx0 = (A.gear?.[0] ?? mx + mw) - 40, cx1 = cx0 + 230, fe = sx - 150;
  const LOOP: Pt[] = [[dx, sy], [dx, yA], [xR, yA], [xR, yT], [xL, yT], [xL, yA], [sx, yA], [sx, sy]];
  const hot = (seg: number, x: number) => seg <= 2 ? 1 : seg === 3 ? Math.max(0, Math.min(1, (x - cx0) / (cx1 - cx0))) : 0;
  const pts = LOOP.map((p) => p.join(",")).join(" ");
  const gid = still ? "ptc" : "pt";
  const loop = <g>
    <polyline points={pts} className="ts-pipe" stroke="#3b4652" strokeWidth="22" />
    <polyline points={pts} className="ts-pipe" stroke="#c9d1d8" strokeWidth="17" />
    <polyline points={pts} className="ts-pipe" stroke="#eef2f5" strokeWidth="4" opacity=".7" transform="translate(-3 -3)" />
    {/* gas flow coloured by temperature */}
    {op.loopP > 0.05 && pos.current.map((p, j) => { const q = along(LOOP, p); return <circle key={j} cx={q.p[0]} cy={q.p[1]} r="4.2" fill={tcol(hot(q.seg, q.p[0]))} opacity={0.95 * Math.min(1, op.loopP * 1.5)} />; })}
    {/* cooler on the return line, with cooling water */}
    <Block id="ptl" x={cx0} y={yT - 24} w={cx1 - cx0} h={48} d={14} f="comp">
      {Array.from({ length: Math.floor((cx1 - cx0 - 20) / 10) }, (_, j) => <line key={j} x1={cx0 + 10 + j * 10} x2={cx0 + 10 + j * 10} y1={yT - 20} y2={yT + 20} stroke="#33505f" strokeWidth="2" opacity=".7" />)}
      <rect x={(cx0 + cx1) / 2 - 58} y={yT - 9} width="116" height="18" rx="2" fill="#e8eef2" stroke="#455f72" strokeWidth=".6" />
      <text x={(cx0 + cx1) / 2} y={yT + 4} textAnchor="middle" className="ts-plate">{T("cooler")} {fmt(op.w * 0.92, 0)} kW</text></Block>
    <path d={`M${cx0 + 24} ${yT - 32} V${yT - 44} H${cx0 - 16}`} className="ts-flow" stroke="#3d8fd6" strokeDashoffset={-tm.current * 20} />
    <path d={`M${cx1 - 10} ${yT - 32} V${yT - 44} H${cx1 + 30}`} className="ts-flow" stroke="#d17a2a" strokeDashoffset={tm.current * 20} />
    {/* throttle valve on the riser and anti-surge recycle around it */}
    <path d={`M${xR} ${yA - 14} H${xR + 44} V${yT + 14} H${xR}`} className="ts-pipe" stroke={op.asv > 1 ? "#c0392b" : "#8e9aa5"} strokeWidth="7" strokeDasharray={op.asv > 1 ? "9 6" : undefined} strokeDashoffset={-tm.current * 40} />
    {([[xR, (yA + yT) / 2, op.valve, "#0b5cad"], [xR + 44, (yA + yT) / 2, op.asv, op.asv > 1 ? "#c0392b" : "#5b6878"]] as [number, number, number, string][]).map(([vx, vy, o, c], j) => <g key={j}>
      <polygon points={`${vx - 11},${vy - 11} ${vx + 11},${vy - 11} ${vx - 11},${vy + 11} ${vx + 11},${vy + 11}`} transform={`rotate(90 ${vx} ${vy})`} fill="#f4f6f8" stroke="#1f2a35" strokeWidth="1.3" />
      <line x1={vx} y1={vy} x2={vx - 20} y2={vy} stroke="#1f2a35" strokeWidth="2" /><rect x={vx - 34} y={vy - 8} width="14" height="16" rx="2" fill={c} />
      <rect x={vx - 34} y={vy + 10} width="14" height="3" fill="var(--line)" /><rect x={vx - 34} y={vy + 10} width={14 * o / 100} height="3" fill="#2e9e6b" /></g>)}
    {/* orifice flow element, gas analyser and gas charging */}
    {/* flow element as an in-line spool with flanges */}
    <rect x={fe - 30} y={yA - 15} width="60" height="30" rx="4" fill={`url(#${gid}-c-steel)`} stroke="#1f2a35" strokeWidth=".9" />
    <rect x={fe - 34} y={yA - 18} width="6" height="36" rx="1" fill="#9aa4ad" stroke="#1f2a35" strokeWidth=".7" /><rect x={fe + 28} y={yA - 18} width="6" height="36" rx="1" fill="#9aa4ad" stroke="#1f2a35" strokeWidth=".7" />
    <rect x={fe - 2} y={yA + 15} width="4" height="6" fill="#1f2a35" />
    <text x={fe} y={yA - 26} textAnchor="middle" className="ts-lab">FLOW ELEMENT</text><text x={fe} y={yA - 38} textAnchor="middle" className="ts-sub">orifice β {fmt(s.setup.beta, 3)}</text>
    {/* gas charging bottle with its valve */}
    <path d={`M${xL + 63} ${yA + 8} V${yA + 34}`} stroke="#6d757e" strokeWidth="3" />
    <polygon points={`${xL + 66},${yA + 22} ${xL + 80},${yA + 15} ${xL + 80},${yA + 29}`} fill="#f4f6f8" stroke="#1f2a35" strokeWidth=".9" />
    <polygon points={`${xL + 94},${yA + 22} ${xL + 80},${yA + 15} ${xL + 80},${yA + 29}`} fill="#f4f6f8" stroke="#1f2a35" strokeWidth=".9" />
    <rect x={xL + 47} y={yA + 34} width="32" height="62" rx="14" fill={`url(#${gid}-c-cab)`} stroke="#1f2a35" strokeWidth=".9" />
    <rect x={xL + 57} y={yA + 28} width="12" height="8" rx="2" fill="#9aa4ad" stroke="#1f2a35" strokeWidth=".6" />
    <text x={xL + 63} y={yA + 70} textAnchor="middle" className="ts-plate">{gas}</text><text x={xL + 40} y={yA + 56} textAnchor="end" className="ts-lab">GAS CHARGING</text>
    {/* labels and flow arrows */}
    <text x={(cx0 + cx1) / 2} y={yT - 38} textAnchor="middle" className="ts-lab">GAS COOLER</text>
    <text x={xR - 46} y={(yA + yT) / 2 - 4} textAnchor="end" className="ts-lab">CONTROL VALVE</text><text x={xR - 46} y={(yA + yT) / 2 + 9} textAnchor="end" className="ts-sub">with anti-surge bypass</text>
    {op.loopP > 0.05 && !op.surge && <g>
      <Arrow x={(cx1 + xR) / 2} y={yT} dir="l" c="#d6453a" /><Arrow x={(xL + cx0) / 2} y={yT} dir="l" c="#2f7fc9" /><Arrow x={(xL + fe) / 2} y={yA} dir="r" c="#2f7fc9" />
      <Arrow x={(dx + xR) / 2} y={yA} dir="r" c="#d6453a" /><Arrow x={sx} y={yA + 34} dir="d" c="#2f7fc9" /><Arrow x={dx} y={yA + 40} dir="u" c="#d6453a" /><Arrow x={xR} y={yT + 14} dir="u" c="#d6453a" /></g>}

  </g>;
  const over = <g>
    <TagCard x={xL + 120} y={yA + 18} title="Driver" w={140} to={[mx + mw / 2 - 5, A.YD - 100]} rows={[[T("N1"), `${fmt(op.n, 0)} rpm`], [T("power"), `${fmt(op.w, 0)} kW`]]} />
    <TagCard x={fe - 236} y={yA + 18} title="Flow element" w={156} rh={15} to={[fe, yA + 16]} rows={[[T("dp"), `${fmt(op.dp, 2)} kPa`], [T("tu"), `${fmt(op.t1, 1)} °C`], [T("gas"), `${fmt(purity, 1)} %`, "#a08f5c"]]} />
    <TagCard x={sx - 206} y={yA + 18} title="Compressor flanges" w={160} rh={15} to={[sx - 12, yA + 34]} rows={[[T("p1"), `${fmt(op.p1, 3)} bara`], [T("t1"), `${fmt(op.t1, 2)} °C`],
      [T("p2"), `${fmt(op.p2, 3)} bara`, "#c0392b"], [T("t2"), `${fmt(op.t2, 2)} °C`, "#c0392b"]]} />
    <TagCard x={xR - 214} y={yT + 18} title="Control valves" w={176} rh={15} to={[xR - 34, (yA + yT) / 2]} rows={[[T("valve"), `${fmt(op.valve, 0)} % open`, "#2e9e6b"], [T("asv"), `${fmt(op.asv, 0)} %`, op.asv > 1 ? "#c0392b" : "#5b6878"]]} />
    <TagCard x={gx - 30} y={yA + 18} title="Seal gas" w={176} rh={15} to={[gx + 60, A.Y - 110]} rows={[[T("SG_DE"), `${fmt(sgv[0], 2)} Nm³/h`, "#56b4e9"], [T("SG_NDE"), `${fmt(sgv[1], 2)} Nm³/h`, "#56b4e9"], [T("SG_P"), `${fmt(op.p1 + 1.5, 2)} bara`, "#e69f00"]]} />
    <TagCard x={A.console[0]} y={A.console[1] - 104} title="Lube oil" w={176} rh={15} to={[A.console[0] + 90, A.console[1] - 6]} rows={[[T("T_oil"), "45.0 °C", "#3d8fd6"], [T("P_oil"), `${fmt(op.n > 50 ? 1.6 : 0.2, 2)} barg`, "#3d8fd6"]]} />
    {op.rec && <g><rect x={c0.x + 70} y={A.Y + 96} width={c0.w - 140} height="22" rx="3" fill="#0b5cad" opacity=".92" /><text x={c0.x + c0.w / 2} y={A.Y + 111} textAnchor="middle" className="ts-name">● RECORDING {lines[li].rs[ev.k].point}</text></g>}
    {op.surge && <g><rect x={c0.x + 70} y={A.Y + 96} width={c0.w - 140} height="22" rx="3" fill="#c0392b" opacity=".95" className="blink" /><text x={c0.x + c0.w / 2} y={A.Y + 111} textAnchor="middle" className="ts-name">SURGE · ANTI-SURGE VALVE OPEN</text></g>}
  </g>;
  const stage = <TrainScene id={gid} t={spec} a={A} phiD={phi / Math.max(spec.ratio ?? 1, 1)} phiC={phi} flow={tm.current * 30} running={op.n > 50} hz={op.n / Math.max(spec.ratio ?? 1, 1) / 60}
    top={loop} over={inst || still ? over : undefined} svgRef={svgRef} />;
  if (still) return stage;

  const all: { l: Json; c: string }[] = lines.map((l: Json, j: number) => ({ l, c: LINE[j % 5] }));
  const recS = (key: string, sc = 1): Series[] => all.map(({ c }, j: number) => { const pts = recorded.filter((x) => x.li === j).map((x) => x.r.test).sort((a: Json, b: Json) => a.qv_m3_h - b.qv_m3_h);
    return { x: pts.map((p: Json) => p.qv_m3_h), y: pts.map((p: Json) => p[key] * sc), color: c, dots: true, width: 1.6, name: `${fmt(lines[j].speed_frac * 100, 0)} %` }; }).filter((x) => x.x.length);
  const predS = (key: string, sc = 1): Series[] => all.map(({ l, c }) => ({ x: l.predicted_test.map((p: Json) => p.qv_m3_h), y: l.predicted_test.map((p: Json) => p[key] * sc), color: c, dash: true, width: 1 }));
  // fluctuation trend over the last 10 test minutes
  const win = Array.from({ length: 61 }, (_, k) => now - 10 + k / 6).filter((x) => x >= 0);
  const hist = win.map((x) => stateAt(x, seq, lines, tm.current - (now - x) * 60 / Math.max(mul, 1)).op);
  const ref = { p1: op.p1, p2: op.p2, q: op.q || 1, n: op.n || 1 };
  return (
    <div className="mrt-anim">
      <div className="mrt-stage-wrap">
        <div className={`mrt-banner ${op.surge ? "crit" : ""}`} style={{ borderLeftColor: op.surge ? "#c0392b" : op.rec ? "#2e9e6b" : "#0b5cad" }}>
          <b>{ev.label}</b><span className="mono small">{hhmm(now)} / {hhmm(dur)} h:min · {gas} closed loop · Type {d.test_type}</span>
        </div>
        {stage}
        <div className="mrt-controls">
          <button className="btn primary" onClick={() => { if (t.current >= dur) t.current = 0; setPlaying(!playing); }}>{playing ? "Pause" : now > 0 && now < dur ? "Resume" : "Play test"}</button>
          <button className="btn" onClick={() => { t.current = 0; setPlaying(false); setFrame((k) => k + 1); }}>Reset</button>
          <button className={`btn ${inst ? "on" : ""}`} onClick={() => setInst(!inst)}>{inst ? "Hide instruments" : "Show instruments"}</button>
          <div className="seg">{MULS.map((m) => <button key={m} className={mul === m ? "on" : ""} onClick={() => setMul(m)}>{m}×</button>)}</div>
          <div className="seg">{lines.map((l: Json, j: number) => <button key={j} className={li === j ? "on" : ""} onClick={() => { t.current = seq.find((e) => e.li === j && e.kind === "throttle")?.t0 ?? 0; setFrame((k) => k + 1); }}>
            {fmt(l.speed_frac * 100, 0)} %</button>)}</div>
          <input type="range" className="mrt-scrub" min={0} max={dur} step={0.1} value={now} onChange={(e) => { t.current = Number(e.target.value); setFrame((k) => k + 1); }} aria-label="Test time" />
        </div>
        <div className="mrt-live-row" style={{ marginTop: 12 }}>
          <LiveChart fit title={`Test map · ${gas} · ${fmt(ln.speed_frac * 100, 0)} % line ${fmt(op.n, 0)} rpm`} xl="Inlet volume flow (m³/h)" yl="Polytropic head (kJ/kg)" h={220}
            series={[...predS("head_kj_kg"), ...recS("head_kj_kg")]}
            markers={op.n > 50 ? [{ x: op.q, y: op.h, color: op.surge ? "#c0392b" : "#0c1a2b", label: op.surge ? "SURGE" : "operating point" }] : []} />
          <LiveChart fit title="Polytropic efficiency" xl="Inlet volume flow (m³/h)" yl="η p %" h={220} legend={false}
            series={[...predS("eta_p", 100), ...recS("eta_p", 100)]} markers={op.n > 50 && op.h > 1 ? [{ x: op.q, y: op.eta * 100, color: "#0c1a2b" }] : []} />
        </div>
        <div className="mrt-live-row" style={{ marginTop: 10 }}>
          <LiveChart fit title="Shaft power" xl="Inlet volume flow (m³/h)" yl="kW" h={200} legend={false}
            series={recS("shaft_power_kw")} markers={op.n > 50 ? [{ x: op.q, y: op.w, color: "#0c1a2b" }] : []} />
          <LiveChart title="Fluctuation over the last 10 min (deviation from the current reading)" xl="Test time (min)" yl="%" h={200} yrange={[-2.5, 2.5]} xr={[Math.max(now - 10, 0), Math.max(now, 10)]}
            hlines={[{ y: 0.5, color: "#c0392b", label: "flow / speed limit ±0.5 %" }, { y: -0.5, color: "#c0392b" }]}
            series={[{ x: win, y: hist.map((h) => (h.p1 / ref.p1 - 1) * 100), color: "#0b5cad", name: T("p1"), width: 1.2 }, { x: win, y: hist.map((h) => (h.p2 / ref.p2 - 1) * 100), color: "#c0392b", name: T("p2"), width: 1.2 },
              { x: win, y: hist.map((h) => (h.q / ref.q - 1) * 100), color: "#2e9e6b", name: "flow", width: 1.2 }, { x: win, y: hist.map((h) => (h.n / ref.n - 1) * 100), color: "#7b3fb5", name: T("N1"), width: 1.2 }]} />
        </div>
      </div>
      <aside className="mrt-side">
        <div className="pt-phase"><b className="small">{ev.kind === "stab" ? `Stabilising · ${fmt(stabT, 1)} min to go` : ev.kind === "record" ? "Recording the point (scans averaged)" : ev.label}</b>
          <div className="bar"><i style={{ width: `${f * 100}%` }} /></div>
          <div className="pt-stab">{FL.map(([, lab, lim], k) => <Fragment key={k}><span>{lab}</span><span className="mono">{fmt(fl(k), 2)} % / {lim}</span>
            <span className={stableOk[k] ? "ok" : "no"}>{stableOk[k] ? "✓" : "…"}</span></Fragment>)}</div></div>
        <div className="pt-kpi">{([["Speed", `${fmt(op.n, 0)} rpm`], ["Inlet flow", `${fmt(op.q, 0)} m³/h`], ["Mass flow", `${fmt(op.m, 2)} kg/s`],
          ["p1 / p2", `${fmt(op.p1, 2)} / ${fmt(op.p2, 2)} bar`], ["t1 / t2", `${fmt(op.t1, 1)} / ${fmt(op.t2, 1)} °C`], ["Head", `${fmt(op.h, 1)} kJ/kg`],
          ["η polytropic", `${fmt(op.eta * 100, 2)} %`], ["Shaft power", `${fmt(op.w, 0)} kW`]] as [string, string][]).map(([l, x]) =>
          <div key={l}><b>{x}</b><span>{l}</span></div>)}</div>
        <div className="card"><h3>Recorded points ({recorded.length})</h3><div className="scroll" style={{ maxHeight: 170 }}><table className="t small"><thead><tr><th>Line</th><th>Pt</th><th className="n">q m³/h</th><th className="n">Hp</th><th className="n">Eff %</th></tr></thead>
          <tbody>{recorded.slice().reverse().map((x, j) => <tr key={j}><td>{fmt(lines[x.li].speed_frac * 100, 0)} %</td><td>{x.r.point}</td><td className="n">{fmt(x.r.test.qv_m3_h, 0)}</td>
            <td className="n">{fmt(x.r.test.head_kj_kg, 1)}</td><td className="n">{fmt(x.r.test.eta_p * 100, 2)}</td></tr>)}</tbody></table></div></div>
        <div className="card"><h3>Gas temperature</h3>
          <svg viewBox="0 0 260 30"><defs><linearGradient id="tg"><stop offset="0" stopColor={tcol(0)} /><stop offset="1" stopColor={tcol(1)} /></linearGradient></defs>
            <rect x="10" y="4" width="240" height="10" rx="3" fill="url(#tg)" /><text x="10" y="27" className="lc-tick">{fmt(op.t1, 0)} °C suction</text>
            <text x="250" y="27" className="lc-tick" textAnchor="end">{fmt(op.t2, 0)} °C discharge</text></svg></div>
        <div className="card"><h3>Seal gas (dry gas seals)</h3><table className="t small"><tbody>
          {[["Primary", seal?.primary], ["Secondary", seal?.secondary], ["Buffer", seal?.buffer], ["Separation", seal?.separation]].map(([a, b]) => <tr key={a}><td>{a}</td><td>{b}</td></tr>)}
        </tbody></table></div>
        {s.valves?.length > 0 && <div className="card"><h3>Section valves</h3><table className="t small"><thead><tr><th>Valve</th><th>Sec 1</th><th>Sec 2</th></tr></thead>
          <tbody>{s.valves.map((q: Json) => <tr key={q.tag}><td>{q.name}</td><td>{q.s1}</td><td>{q.s2}</td></tr>)}</tbody></table></div>}
      </aside>
    </div>
  );
}

// ---------------------------------------------------------------- page
export function PerfTestPage(c: Ctx) {
  const key = c.project?.name ?? "project";
  const mem = MEM[key] ?? (MEM[key] = { opt: { test_type: 2, method: "sandberg_colby", speed_adjust_pct: 0, test_suction_temperature_c: 35, max_test_temperature_c: 200,
    critical_margin_pct: 10, reynolds_correction: true, balance_leak_pct: 0, selection: {} }, logs: {} });
  const [tab, setTab] = useState(0);
  const [opt, setOptS] = useState<Json>(mem.opt);
  const [logs, setLogsS] = useState<Json>(mem.logs);
  const [d, setD] = useState<Json>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [si, setSi] = useState(0);
  const [basis, setBasis] = useState("converted");
  const setOpt = (o: Json) => { mem.opt = o; setOptS(o); };
  const setLogs = (l: Json) => { mem.logs = l; setLogsS(l); };
  const seq = useRef(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const capRef = useRef<SVGSVGElement | null>(null);
  const { T } = useTags(c.project);
  const db = c.project?.design_basis ?? {}, gr = Number(c.project?.train?.gear_ratio ?? 1);
  const turbine = /turbine/.test(db.driver_type ?? "");
  const spec: TrainSpec = useMemo(() => ({ vfd: !turbine, geared: gr > 1.0001 || db.driver_type === "fixed_speed_motor_gearbox", casings: 1, turbine,
    ratio: gr > 1.0001 ? gr : 1, names: { driver: turbine ? "test driver" : "shop motor", casing: ["contract rotor"] } }), [turbine, gr, db.driver_type]);
  const body = (o: Json = opt, l: Json = logs) => ({ project: c.project, options: o, logs: l });
  const load = async (o: Json = opt, l: Json = logs) => {
    const id = ++seq.current;
    setBusy(true); setErr("");
    try { const r = await post("/api/ptc10", body(o, l)); if (id === seq.current) setD(r); }
    catch (e) { if (id === seq.current) setErr((e as Error).message); } finally { if (id === seq.current) setBusy(false); }
  };
  useEffect(() => { if (c.results) load(); }, [c.results]); // eslint-disable-line react-hooks/exhaustive-deps
  const upd = (patch: Json) => { const o = { ...opt, ...patch }; setOpt(o); load(o); };
  const s = d?.sections?.[Math.min(si, (d?.sections?.length ?? 1) - 1)];
  const sel = s?.selected;
  const secKey = String(s?.spec?.section ?? 1);
  const choose = (cmb: Json) => upd({ selection: { ...(opt.selection ?? {}), [secKey]: { gas: cmb.gas, P1_bara: cmb.P1_bara } } });
  const editable = () => {  // copy the simulated readings into the editable measured log
    const l = { ...logs };
    for (const ss of d.sections) l[String(ss.spec.section)] = Object.fromEntries((ss.lines ?? []).map((x: Json) => [x.speed_frac.toFixed(3), x.readings]));
    setLogs(l); load(opt, l); toast({ text: "Readings copied into the measured test log - edit them with the shop data" });
  };
  const setCell = (frac: string, i: number, k: string, val: string) => {
    const sec = { ...(logs[secKey] ?? {}) }, rows = [...(sec[frac] ?? [])];
    rows[i] = { ...rows[i], [k]: k === "point" ? val : val.trim() === "" ? null : Number(val) }; sec[frac] = rows;
    setLogs({ ...logs, [secKey]: sec });
  };
  const importCSV = async (f: File) => {
    const lines = (await f.text()).split(/\r?\n/).filter((x) => x.trim()); if (lines.length < 2) return;
    const sep = [";", "\t", ","].find((q) => lines[0].includes(q)) ?? ",", head = lines[0].split(sep).map((h) => h.trim());
    const sec: Json = {};
    for (const ln of lines.slice(1)) { const v = ln.split(sep); const r = Object.fromEntries(head.map((h, i) => [h, h === "point" ? v[i] : Number(v[i])]));
      const fr = Number(r.speed_frac).toFixed(3); (sec[fr] ??= []).push(r); }
    const l = { ...logs, [secKey]: sec }; setLogs(l); load(opt, l); toast({ text: `Imported ${lines.length - 1} readings` });
  };
  const exportCSV = () => {
    const rows = (s?.lines ?? []).flatMap((x: Json) => x.readings.map((r: Json) => ({ speed_frac: x.speed_frac, ...r })));
    const cols = ["speed_frac", ...COLS.map(([k]) => k), "surge"];
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([[cols.join(","), ...rows.map((r: Json) => cols.map((k) => r[k] ?? "").join(","))].join("\n")], { type: "text/csv" }));
    a.download = `${safeName(key)}_PTC10_log.csv`; a.click();
  };
  const curves = useMemo(() => {
    if (!s?.lines) return null;
    const pick = (key: string, q: string) => s.lines.flatMap((ln: Json, i: number) => {
      const pr = key === "test" ? ln.predicted_test : ln.predicted, rs = ln.results.filter((r: Json) => r[key]).map((r: Json) => r[key]).sort((a: Json, b: Json) => a.qv_m3_h - b.qv_m3_h);
      const f = (p: Json) => (q === "eta_p" ? p.eta_p * 100 : q === "shaft_power_kw" ? (p.shaft_power_kw ?? p.power_kw) : p[q]);
      const out: Series[] = pr.every((p: Json) => f(p) !== undefined) ? [{ x: pr.map((p: Json) => p.qv_m3_h), y: pr.map(f), color: LINE[i % 5], dash: true, width: 1.2 }] : [];
      if (rs.length) out.push({ x: rs.map((p: Json) => p.qv_m3_h), y: rs.map(f), color: LINE[i % 5], dots: true, name: `${fmt(ln.speed_frac * 100, 0)} %` });
      return out;
    });
    const sl = basis === "test" ? [] : (s.surge_line ?? []);
    const surge = (k: string): Series[] => sl.length > 1 ? [{ x: sl.map((x: Json) => x.qv_m3_h), y: sl.map((x: Json) => x[k]), color: "#c0392b", width: 1.6, name: "surge line" }] : [];
    return { head: [...pick(basis, "head_kj_kg"), ...surge("head_kj_kg")], eta: pick(basis, "eta_p"), power: pick(basis, "shaft_power_kw"),
      p2: [...pick(basis, basis === "test" ? "P02_bara" : "P2_bara"), ...surge("P2_bara")] };
  }, [s, basis]);
  const g = s?.acceptance?.guarantee_qv_m3_h;
  const pts = (s?.lines ?? []).flatMap((ln: Json) => ln.results.filter((r: Json) => r.test).map((r: Json) => ({ ...r, frac: ln.speed_frac })));
  const summary: [string, string, string][] = d ? (d.sections ?? []).flatMap((x: Json) => [
    ...(x.acceptance?.checks ?? []).map((q: Json) => [`S${x.spec.section} ${q.check.split(" (")[0]}`, pct(q.deviation_pct), q.status]),
    ...(x.selected ? [[`S${x.spec.section} similarity / stand limits`, `${(x.selected.checks ?? []).filter((q: Json) => q.pass).length}/${(x.selected.checks ?? []).length}`, x.selected.qualified ? "pass" : "fail"]] : []),
    ...((x.lines ?? []).length ? [[`S${x.spec.section} point stability`, `${x.lines.flatMap((l: Json) => l.results).filter((r: Json) => r.stable).length}/${x.lines.flatMap((l: Json) => l.results).filter((r: Json) => r.test).length}`,
      x.lines.flatMap((l: Json) => l.results).every((r: Json) => !r.test || r.stable) ? "pass" : "fail"]] : [])]) : [];
  const report = async () => saveFrom("/api/ptc10/report.pdf", { ...body(), images: { loop: await svgToPng(capRef.current) } }, `${safeName(key)}_PTC10.pdf`);

  return (
    <>
      <h2>Performance test (ASME PTC 10)</h2>
      <p className="lead">Shop thermodynamic performance test to ASME PTC 10-2022: choose a Type 1 test on the specified gas or a Type 2 test on a substitute gas, see every
        test-gas combination screened against the similarity limits, run the closed loop, then reduce the test log, convert it to the specified conditions and check
        the API 617 acceptance (head 0 % negative, power ≤ 104 %, surge not above prediction).</p>
      {err && <div className="error">{err}</div>}
      {!c.results && <p className="muted">Run the analysis first.</p>}
      {d && <div className="kpis">{[["Test type", `Type ${d.test_type}`], ["Test gas", sel ? (d.test_type === 2 ? sel.gas : "specified gas") : "–"],
        ["Test speed", sel ? `${fmt(sel.N_rpm, 0)} rpm` : "–"], ["Suction", sel ? `${fmt(sel.P1_bara, 2)} bara · ${fmt(sel.T1_c, 1)} °C` : "–"],
        ["Data", s?.simulated ? "simulated example" : "measured log"], ["Overall", d.status]].map(([l, x]) =>
        <div className="kpi" key={l}><div className={`v ${String(x).length > 16 ? "long" : ""}`}>{l === "Overall" ? <Pill s={x} /> : x}</div><div className="l">{l}</div></div>)}</div>}
      {d && <Summary rows={summary} />}
      {d && s?.lines && <div className="capture" aria-hidden="true"><LoopAnim key={`cap-${secKey}-${sel?.gas}-${sel?.N_rpm}`} s={s} d={d} T={T} spec={spec} still svgRef={(e) => { capRef.current = e; }} /></div>}
      <div className="seg" style={{ marginBottom: 14 }}>{TABS.map((t, i) => <button key={t} className={tab === i ? "on" : ""} onClick={() => setTab(i)}>{t}</button>)}
        {d?.sections?.length > 1 && d.sections.map((x: Json, i: number) => <button key={`s${i}`} className={si === i ? "on" : ""} onClick={() => setSi(i)}>Section {x.spec.section}</button>)}</div>
      {busy && <p className="muted">Calculating the test (screening, data reduction and uncertainty)…</p>}

      {d && s && tab === 0 && <>
        <div className="grid">
          <div className="card"><h3>Test basis</h3>
            <div className="seg" style={{ marginBottom: 10 }}>{[1, 2].map((t) => <button key={t} className={opt.test_type === t ? "on" : ""} onClick={() => upd({ test_type: t })}>
              Type {t} · {t === 1 ? "specified gas" : "substitute test gas"}</button>)}</div>
            <table className="t small"><tbody>
              <tr><td>Head / efficiency method</td><td><select className="inp" value={opt.method} onChange={(e) => upd({ method: e.target.value })}>
                {METHODS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></td></tr>
              {([["test_suction_temperature_c", "Test suction temperature °C"], ["max_test_temperature_c", "Stand max discharge temperature °C"], ["test_driver_kw", "Test driver power kW (blank = contract)"],
                ["max_test_pressure_bara", "Loop max pressure bara (blank = max discharge)"], ["critical_margin_pct", "Critical-speed margin %"], ["speed_adjust_pct", "Speed adjustment % (API 617 8.3.5.5)"]] as [string, string][]).map(([k, l]) =>
                <tr key={k}><td>{l}</td><td><input className="inp" type="number" defaultValue={opt[k] ?? ""} onBlur={(e) => upd({ [k]: e.target.value === "" ? undefined : Number(e.target.value) })} /></td></tr>)}
              <tr><td>Suction pressures to screen bara</td><td><input className="inp" defaultValue={(opt.test_suction_pressures_bara ?? [1.2, 3, 5, 8, 12]).join(", ")}
                onBlur={(e) => upd({ test_suction_pressures_bara: e.target.value.split(/[ ,;]+/).map(Number).filter((x) => x > 0) })} /></td></tr>
              <tr><td>Reynolds-number correction</td><td><label><input type="checkbox" checked={opt.reynolds_correction !== false} onChange={(e) => upd({ reynolds_correction: e.target.checked })} /> apply PTC 10 RA / RB correction</label></td></tr>
              {([["balance_leak_pct", "Balance-piston leakage % of flow (vendor)"], ["seal_leak_kg_s", "DGS primary vent leakage kg/s"], ["casing_od_m", "Casing OD m (heat loss, blank = estimate)"],
                ["casing_length_m", "Casing length m (blank = estimate)"], ["ambient_c", "Ambient temperature °C"]] as [string, string][]).map(([k, l]) =>
                <tr key={k}><td>{l}</td><td><input className="inp" type="number" step="any" defaultValue={opt[k] ?? ""} onBlur={(e) => upd({ [k]: e.target.value === "" ? undefined : Number(e.target.value) })} /></td></tr>)}
            </tbody></table></div>
          <div className="card"><h3>Specified vs test conditions · section {s.spec.section}</h3>
            {sel ? <table className="t small"><thead><tr><th>Item</th><th className="n">Specified</th><th className="n">Test</th></tr></thead><tbody>
              {([["Gas", "process gas", d.test_type === 2 ? sel.gas : "process gas"], ["Molecular weight", fmt(s.spec.mw, 2), fmt(sel.mw, 2)], ["Inlet flow m³/h", fmt(s.spec.qv * 3600, 0), fmt(sel.qv_m3_h, 0)],
                ["p1 / p2 bara", `${fmt(s.spec.P1 / 1e5, 2)} / ${fmt(s.spec.P2 / 1e5, 2)}`, `${fmt(sel.P1_bara, 2)} / ${fmt(sel.P2_bara, 2)}`],
                ["t1 / t2 °C", `${fmt(s.spec.T1 - 273.15, 1)} / ${fmt(s.spec.T2 - 273.15, 1)}`, `${fmt(sel.T1_c, 1)} / ${fmt(sel.T2_c, 1)}`],
                ["Head kJ/kg", fmt(s.spec.head / 1e3, 2), fmt(sel.head_kj_kg, 2)], ["Power kW", fmt(s.spec.power_kw, 0), fmt(sel.power_kw, 0)], ["Speed rpm", fmt(s.spec.N, 0), fmt(sel.N_rpm, 0)],
                ["Machine Mach", fmt(s.spec.mach, 4), fmt(sel.mach, 4)], ["Machine Reynolds", Number(s.spec.reynolds).toExponential(2), Number(sel.reynolds).toExponential(2)],
                ["Flow coefficient", fmt(s.spec.phi, 4), fmt(sel.phi, 4)], ["Volume ratio", fmt(s.spec.rv, 4), fmt(sel.rv, 4)]] as string[][]).map(([a, b, x]) =>
                <tr key={a}><td>{a}</td><td className="n">{b}</td><td className="n">{x}</td></tr>)}</tbody></table> : <p className="muted">No feasible combination.</p>}
            {sel && d.test_type === 2 && <p className="small">Test speed <input className="inp" style={{ width: 110 }} type="number" defaultValue={Math.round(sel.N_rpm)} key={sel.N_rpm}
              onBlur={(e) => { const N = Number(e.target.value); if (Math.abs(N - sel.N_rpm) > 1) upd({ selection: { ...(opt.selection ?? {}), [secKey]: { gas: sel.gas, P1_bara: sel.P1_bara, N_rpm: N } } }); }} /> rpm
              <span className="muted"> · set your own speed; the volume ratio then follows and is re-checked</span></p>}</div>
        </div>
        <div className="grid" style={{ marginTop: 14 }}>
          <div className="card"><h3>Scope and test basis</h3><p className="small">{d.scope}</p>
            <table className="t small"><tbody><tr><td>Gas property method</td><td>{d.property_method}</td></tr><tr><td>Head / efficiency method</td><td>{METHODS.find(([k]) => k === d.method)?.[1]}</td></tr>
              <tr><td>Reynolds correction</td><td>{d.reynolds_correction ? "applied (PTC 10 RA / RB)" : "not applied"}</td></tr></tbody></table></div>
          {s.gas_properties && <div className="card"><h3>Gas properties at the inlet</h3><table className="t small"><thead><tr><th>Property</th><th className="n">Specified</th><th className="n">Test</th></tr></thead>
            <tbody>{([["P / T", (g_: Json) => `${fmt(g_.P_bara, 2)} bara / ${fmt(g_.T_c, 1)} °C`], ["Molecular weight", (g_: Json) => fmt(g_.mw, 2)], ["Compressibility Z", (g_: Json) => fmt(g_.z, 4)],
              ["Isentropic exponent k", (g_: Json) => fmt(g_.k, 4)], ["cp kJ/kg K", (g_: Json) => fmt(g_.cp / 1e3, 4)], ["Density kg/m³", (g_: Json) => fmt(g_.rho, 3)],
              ["Speed of sound m/s", (g_: Json) => fmt(g_.sound, 1)], ["Viscosity µPa s", (g_: Json) => fmt(g_.mu * 1e6, 3)]] as [string, (g_: Json) => string][]).map(([l, fn]) =>
              <tr key={l}><td>{l}</td><td className="n">{fn(s.gas_properties.specified)}</td><td className="n">{fn(s.gas_properties.test)}</td></tr>)}</tbody></table></div>}
        </div>
        {sel?.checks && <div className="card" style={{ marginTop: 14 }}><h3>Permissible deviations · PTC 10 {d.test_type === 2 ? "Table 3-2.1-2 + stand limits" : "Table 3-1"}</h3>
          <table className="t"><thead><tr><th>Item</th><th>Limit</th><th className="n">Value</th><th>Assessment</th></tr></thead>
            <tbody>{sel.checks.map((q: Json) => <tr key={q.check}><td>{q.check}</td><td>{q.limit}</td><td className="n">{typeof q.value === "number" ? fmt(q.value, 3) : q.value}</td>
              <td><Pill s={q.pass ? "pass" : "fail"} /></td></tr>)}</tbody></table></div>}
        {d.test_type === 2 && <div className="card" style={{ marginTop: 14 }}><h3>All test-gas combinations · click a row to use it</h3>
          <div className="scroll"><table className="t small"><thead><tr><th>Gas</th><th className="n">p1 bara</th><th className="n">N rpm</th><th className="n">p2 bara</th><th className="n">t2 °C</th>
            <th className="n">Power kW</th><th className="n">ΔMach</th><th className="n">Re ratio</th><th>Result</th></tr></thead>
            <tbody>{s.combinations.map((q: Json, i: number) => <tr key={i} className={sel && q.gas === sel.gas && q.P1_bara === sel.P1_bara ? "sel" : ""} style={{ cursor: q.N_rpm ? "pointer" : undefined }}
              onClick={() => q.N_rpm && choose(q)}><td>{q.gas}</td><td className="n">{fmt(q.P1_bara, 1)}</td><td className="n">{fmt(q.N_rpm, 0)}</td><td className="n">{fmt(q.P2_bara, 2)}</td>
              <td className="n">{fmt(q.T2_c, 0)}</td><td className="n">{fmt(q.power_kw, 0)}</td><td className="n">{q.mach !== undefined ? fmt(q.mach - s.spec.mach, 3) : "–"}</td>
              <td className="n">{q.reynolds ? fmt(q.reynolds / s.spec.reynolds, 3) : "–"}</td><td>{q.qualified ? <Pill s="pass" /> : <span className="small muted">{q.reason}</span>}</td></tr>)}</tbody></table></div>
          <p className="muted small">Each gas is matched to the specified volume ratio and flow coefficient; the speed follows from equal head coefficient. Rejected: Mach / Reynolds outside
            PTC 10 limits, discharge temperature, pressure or power beyond the stand, speed range near a critical, or two-phase at suction.</p></div>}
        {d.test_type === 1 && <div className="card" style={{ marginTop: 14 }}><h3>Type 1 test conditions</h3><table className="t small"><tbody>
          {([["P1_bara", "Test suction pressure bara"], ["T1_c", "Test suction temperature °C"], ["N_rpm", "Test speed rpm"], ["mw", "Test gas molecular weight"]] as [string, string][]).map(([k, l]) =>
            <tr key={k}><td>{l}</td><td><input className="inp" type="number" defaultValue={opt.type1?.[k] ?? ""} placeholder="specified" onBlur={(e) =>
              upd({ type1: { ...(opt.type1 ?? {}), [k]: e.target.value === "" ? undefined : Number(e.target.value) } })} /></td></tr>)}</tbody></table></div>}
      </>}

      {d && s?.lines && tab === 1 && <div className="card"><h3>Closed test loop · 2.5D, gas coloured by temperature</h3><LoopAnim key={`${secKey}-${sel?.gas}-${sel?.N_rpm}`} s={s} d={d} T={T} spec={spec} /></div>}

      {d && s?.lines && tab === 2 && <div className="card"><h3>Test log · section {s.spec.section}</h3>
        {s.simulated ? <p className="small"><Pill s="review" /> Simulated example readings (predicted curve on the test gas with a small machine deviation and instrument scatter).{" "}
          <button className="btn" onClick={editable}>Edit as measured log</button></p> : <p className="small"><Pill s="pass" /> Measured log in use.{" "}
          <button className="btn" onClick={() => load()}>Recalculate</button> <button className="btn" onClick={() => { const l = { ...logs }; delete l[secKey]; setLogs(l); load(opt, l); }}>Back to example</button></p>}
        <p><button className="btn" onClick={exportCSV}>Export CSV</button> <button className="btn" onClick={() => fileRef.current?.click()}>Import CSV</button>
          <input ref={fileRef} type="file" accept=".csv,.txt" hidden onChange={(e) => e.target.files?.[0] && importCSV(e.target.files[0])} />
          <span className="muted small"> CSV columns: speed_frac, {COLS.map(([k]) => k).join(", ")}, surge · fluctuation = max − min over the reading period</span></p>
        {s.lines.map((ln: Json) => { const fr = ln.speed_frac.toFixed(3); const rows = s.simulated ? ln.readings : (logs[secKey]?.[fr] ?? ln.readings); return <div key={fr} style={{ marginBottom: 12 }}>
          <b>{fmt(ln.speed_frac * 100, 0)} % speed · test {fmt(ln.N_test_rpm, 0)} rpm (specified {fmt(ln.N_sp_rpm, 0)} rpm)</b>
          <div className="scroll"><table className="t small"><thead><tr>{COLS.map(([k, tk, u]) => <th key={k} className="n" title={k}>{tk ? T(tk) : ""}<br /><span className="muted">{u}</span></th>)}<th>Surge</th></tr></thead>
            <tbody>{rows.map((r: Json, i: number) => <tr key={i}>{COLS.map(([k]) => <td key={k} className="n">{s.simulated ? (k === "point" ? r[k] : r[k] == null ? "–" : fmt(r[k], k.startsWith("p") ? 4 : 2)) :
              <input className="inp" style={{ width: 82 }} defaultValue={r[k]} onBlur={(e) => setCell(fr, i, k, e.target.value)} />}</td>)}<td>{r.surge ? "yes" : ""}</td></tr>)}</tbody></table></div></div>; })}
      </div>}

      {d && s?.lines && tab === 3 && <div className="card" style={{ marginBottom: 14 }}><h3>Similarity and stability per point (each point against its equivalent specified point)</h3>
        <div className="scroll"><table className="t small"><thead><tr><th>Line</th><th>Point</th><th className="n">φ ratio</th><th className="n">ψ ratio</th><th className="n">rv ratio</th><th className="n">ΔMm</th>
          <th className="n">Rem ratio</th><th>Similarity</th><th className="n">Heat loss kW</th><th className="n">Re factor</th><th>Stability</th></tr></thead>
          <tbody>{pts.map((r: Json, i: number) => <tr key={i}><td>{fmt(r.frac * 100, 0)} %</td><td>{r.point}{r.surge ? " · surge" : ""}</td><td className="n">{fmt(r.similarity.phi, 3)}</td>
            <td className="n">{fmt(r.similarity.psi, 3)}</td><td className="n">{fmt(r.similarity.rv, 4)}</td><td className="n">{fmt(r.similarity.mach, 4)}</td><td className="n">{fmt(r.similarity.re, 3)}</td>
            <td><Pill s={Object.values(r.similarity_ok ?? {}).every(Boolean) ? "pass" : "fail"} /></td><td className="n">{fmt(r.test.heat_loss_kw, 2)}{r.test.heat_loss_estimated ? " est." : ""}</td>
            <td className="n">{fmt(r.converted.re_factor, 4)}</td>
            <td title={r.stability?.map((x: Json) => `${x.item} ${fmt(x.value, 2)} / ${x.limit} %`).join("\n")}><Pill s={r.stable ? "pass" : "fail"} /></td></tr>)}</tbody></table></div>
        <p className="muted small">rv: test volume ratio over the converted (specified-gas) volume ratio; Mach and Reynolds against the specified machine at the equivalent speed.
          ψ: polytropic work coefficient Hp / U². Stability: fluctuation of each reading against the PTC 10 limits (hover).</p></div>}
      {d && s?.lines && tab === 3 && s.lines.map((ln: Json) => { const ok = ln.results.filter((r: Json) => r.test); return <div className="card" key={ln.speed_frac} style={{ marginBottom: 14 }}>
        <h3>{fmt(ln.speed_frac * 100, 0)} % speed · results and uncertainty</h3><div className="scroll"><table className="t small">
          <thead><tr><th>Point</th><th className="n">q test m³/h</th><th className="n">Hp test</th><th className="n">η test %</th><th className="n">q conv m³/h</th><th className="n">Hp conv kJ/kg</th>
            <th className="n">p2 conv bara</th><th className="n">t2 conv °C</th><th className="n">Power kW</th><th className="n">U(q)</th><th className="n">U(Hp)</th><th className="n">U(η)</th><th className="n">U(P)</th></tr></thead>
          <tbody>{ok.map((r: Json) => <tr key={r.point}><td>{r.point}{r.surge ? " · surge" : ""}</td><td className="n">{fmt(r.test.qv_m3_h, 0)}</td><td className="n">{fmt(r.test.head_kj_kg, 2)}</td>
            <td className="n">{fmt(r.test.eta_p * 100, 2)}</td><td className="n">{fmt(r.converted.qv_m3_h, 0)}</td><td className="n">{fmt(r.converted.head_kj_kg, 2)}</td><td className="n">{fmt(r.converted.P2_bara, 2)}</td>
            <td className="n">{fmt(r.converted.T2_c, 1)}</td><td className="n">{fmt(r.converted.shaft_power_kw, 0)}</td>
            {["qv_m3_h", "head_kj_kg", "eta_p", "shaft_power_kw"].map((k) => <td key={k} className="n">{fmt(r.uncertainty_pct[k], 2)} %</td>)}</tr>)}</tbody></table></div>
        {ln.results.some((r: Json) => r.error) && <p className="error small">{ln.results.filter((r: Json) => r.error).map((r: Json) => `${r.point}: ${r.error}`).join("; ")}</p>}</div>; })}

      {d && curves && tab === 4 && <>
        <div className="seg" style={{ marginBottom: 10 }}>{[["converted", "Converted to specified"], ...(d.speed_adjust_pct ? [["adjusted", `Adjusted speed ${fmt(d.speed_adjust_pct, 1)} %`]] : []), ["test", "As tested (test gas)"]].map(([k, l]) =>
          <button key={k} className={basis === k ? "on" : ""} onClick={() => setBasis(k)}>{l}</button>)}</div>
        <div className="grid">
          <div className="card"><LiveChart fit title="Polytropic head" xl="Inlet volume flow (m³/h)" yl="kJ/kg" h={260} series={curves.head}
            markers={g && basis !== "test" ? [{ x: g, y: s.spec.head / 1e3, color: "#c0392b", label: "guarantee" }] : []} /></div>
          <div className="card"><LiveChart fit title="Polytropic efficiency" xl="Inlet volume flow (m³/h)" yl="%" h={260} series={curves.eta}
            markers={g && basis !== "test" ? [{ x: g, y: s.spec.eta * 100, color: "#c0392b", label: "guarantee" }] : []} /></div>
          <div className="card"><LiveChart fit title="Shaft power" xl="Inlet volume flow (m³/h)" yl="kW" h={260} series={curves.power}
            hlines={g && basis !== "test" ? [{ y: s.spec.power_kw * 1.04, color: "#c0392b", label: "104 % guarantee power" }] : []}
            markers={g && basis !== "test" ? [{ x: g, y: s.spec.power_kw, color: "#c0392b", label: "guarantee" }] : []} /></div>
          <div className="card"><LiveChart fit title="Discharge pressure" xl="Inlet volume flow (m³/h)" yl="bara" h={260} series={curves.p2}
            markers={g && basis !== "test" ? [{ x: g, y: s.spec.P2 / 1e5, color: "#c0392b", label: "guarantee" }] : []} /></div>
        </div>
        {s.deviation?.length > 0 && <div className="card" style={{ marginTop: 14 }}><h3>Deviation from prediction at each line's guarantee-equivalent flow</h3>
          <div className="scroll"><table className="t small"><thead><tr><th>Line</th><th className="n">Flow m³/h</th><th className="n">Head test / pred</th><th className="n">Δ %</th><th className="n">η test / pred</th>
            <th className="n">Δ pts</th><th className="n">Power test / pred</th><th className="n">Δ %</th><th className="n">p2 Δ %</th></tr></thead>
            <tbody>{s.deviation.map((x: Json) => <tr key={x.speed_frac}><td>{fmt(x.speed_frac * 100, 0)} %</td><td className="n">{fmt(x.qv_m3_h, 0)}</td>
              <td className="n">{fmt(x.head_kj_kg.test, 1)} / {fmt(x.head_kj_kg.predicted, 1)}</td><td className="n">{pct(x.head_kj_kg.deviation_pct)}</td>
              <td className="n">{fmt(x.eta_p.test, 2)} / {fmt(x.eta_p.predicted, 2)}</td><td className="n">{fmt(x.eta_p.test - x.eta_p.predicted, 2)}</td>
              <td className="n">{fmt(x.shaft_power_kw.test, 0)} / {fmt(x.shaft_power_kw.predicted, 0)}</td><td className="n">{pct(x.shaft_power_kw.deviation_pct)}</td>
              <td className="n">{pct(x.P2_bara.deviation_pct)}</td></tr>)}</tbody></table></div></div>}
        <p className="muted small">Dashed: predicted{basis === "test" ? " on the test gas" : " on the specified gas"}. Dots: test points{basis === "test" ? " on the test gas" : " converted by similarity"}.</p></>}

      {d && s?.acceptance && tab === 5 && <div className="grid">
        <div className="card"><h3>API 617 acceptance · {fmt((s.acceptance.line ?? 1) * 100, 0)} % line ({s.acceptance.basis})</h3>
          <table className="t"><thead><tr><th>Check</th><th className="n">Guarantee</th><th className="n">Test</th><th className="n">Deviation</th><th>Status</th></tr></thead>
            <tbody>{s.acceptance.checks.map((q: Json) => <tr key={q.check}><td>{q.check}</td><td className="n">{fmt(q.guarantee, 1)}</td><td className="n">{fmt(q.test, 1)}</td>
              <td className="n">{pct(q.deviation_pct)}</td><td><Pill s={q.status} /></td></tr>)}</tbody></table></div>
        <div className="card"><h3>Coast-down (rundown tank check)</h3>
          <LiveChart xl="Time (s)" yl="rpm" h={180} legend={false} series={[{ x: s.coastdown.trace.map((p: number[]) => p[0]), y: s.coastdown.trace.map((p: number[]) => p[1]), color: "#0b5cad", fill: true }]} />
          <p className="small">Predicted {fmt(s.coastdown.predicted_s, 0)} s (train inertia {fmt(s.coastdown.inertia_kgm2, 2)} kg m² at the compressor). Measured{" "}
            <input className="inp" style={{ width: 80 }} type="number" defaultValue={opt.coastdown_measured_s ?? ""} onBlur={(e) => upd({ coastdown_measured_s: e.target.value === "" ? undefined : Number(e.target.value) })} /> s ·
            rundown tank time <input className="inp" style={{ width: 80 }} type="number" defaultValue={opt.rundown_tank_s ?? ""} onBlur={(e) => upd({ rundown_tank_s: e.target.value === "" ? undefined : Number(e.target.value) })} /> s{" "}
            <Pill s={s.coastdown.status} /></p></div>
      </div>}

      {tab === 6 && <TagsPanel project={c.project} setProject={c.setProject} groups={["process", "seal gas", "speed", "lube oil"]} />}

      {d && tab === 7 && <div className="grid">
        <div className="card"><h3>Report</h3><p className="small">Cover with the 2.5D loop picture and the result summary, contents, scope and gases, set-up and instruments, procedure, test design
          and gas screening, similarity per point, data / stability / corrections / results per speed, a worked data reduction, curves (converted and as tested) with the surge
          line, deviations, API 617 acceptance and conclusions, flow element, coast-down and method, legend and sign-off.</p>
          <button className="btn primary" disabled={busy} onClick={report}>Download PDF report</button>
          <p className="muted small">Document number, client, sign-off names and tag names: Tags & glossary tab.</p></div>
        <div className="card"><h3>Procedure</h3><ol className="small">{d.procedure.map((x: string, i: number) => <li key={i}>{x}</li>)}</ol></div>
        <div className="card"><h3>Instruments</h3><table className="t small"><thead><tr><th>Instrument</th><th>Parameter</th><th>Accuracy</th><th>Qty</th></tr></thead>
          <tbody>{d.instruments.map((r: string[]) => <tr key={r[0]}>{r.map((x) => <td key={x}>{x}</td>)}</tr>)}</tbody></table></div>
        <div className="card"><h3>Stability per point</h3><table className="t small"><tbody>{d.stability.map((r: string[]) => <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td></tr>)}</tbody></table></div>
      </div>}
    </>
  );
}
