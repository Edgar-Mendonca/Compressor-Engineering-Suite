import { useEffect, useMemo, useRef, useState } from "react";
import { fmt, type Json } from "../api";
import { LiveChart, type Series } from "../components/LiveChart";
import { safeName, saveFrom, toast } from "../files";
import { Box, Cyl, Gear } from "./MechRunTest";

// Shop performance test to ASME PTC 10-2022, backend testing/ptc10.py: Type 1 / Type 2 test design with
// every test-gas combination screened, an animated 2.5D closed loop (gas flow, seal-gas system, surge),
// the test log (simulated example or measured), data reduction, conversion, uncertainty, curves, acceptance and the PDF.

type Ctx = { project: Json; results: Json; casing: number; setProject: (p: Json) => void };
const TABS = ["Test design", "Test loop", "Test log", "Results", "Curves", "Acceptance", "Report"];
const LINE = ["#0b5cad", "#2e9e6b", "#d1782a", "#7b3fb5", "#c0392b"];
const COLS: [string, string][] = [["point", "Point"], ["n_rpm", "N rpm"], ["p1_bara", "p1 bara"], ["t1_c", "t1 °C"], ["p2_bara", "p2 bara"], ["t2_c", "t2 °C"],
  ["dp_kpa", "Orifice dp kPa"], ["pu_bara", "pu bara"], ["tu_c", "tu °C"], ["heat_loss_kw", "Heat loss kW"]];
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
const PATH: Pt[] = [[668, 228], [668, 120], [880, 120], [880, 54], [292, 54], [292, 150], [536, 150], [536, 228], [536, 300], [668, 300]];
function along(s: number): { p: Pt; seg: number; f: number } {
  const L = PATH.slice(1).map((p, i) => Math.hypot(p[0] - PATH[i][0], p[1] - PATH[i][1]));
  const tot = L.reduce((a, b) => a + b, 0);
  let d = ((s % 1) + 1) % 1 * tot;
  for (let i = 0; i < L.length; i++) { if (d <= L[i]) { const f = d / L[i]; return { p: [lerp(PATH[i][0], PATH[i + 1][0], f), lerp(PATH[i][1], PATH[i + 1][1], f)], seg: i, f }; } d -= L[i]; }
  return { p: PATH[0], seg: 0, f: 0 };
}

function LoopAnim({ s, d }: { s: Json; d: Json }) {
  const lines = s.lines.filter((l: Json) => l.results?.some((r: Json) => r.test));
  const [li, setLi] = useState(Math.max(0, lines.findIndex((l: Json) => Math.abs(l.speed_frac - 1) < 0.01)));
  const [v, setV] = useState(0.35);                       // control valve closing: 0 = open (overload) ... 1 = surge
  const [playing, setPlaying] = useState(false);
  const [, setFrame] = useState(0);
  const tm = useRef(0), pos = useRef(Array.from({ length: 70 }, (_, i) => i / 70)), last = useRef(0), surgeT = useRef(0), vRef = useRef(v);
  vRef.current = v;
  const ln = lines[Math.min(li, lines.length - 1)];
  const rs = (ln?.results ?? []).filter((r: Json) => r.test).sort((a: Json, b: Json) => b.test.qv_m3_h - a.test.qv_m3_h);
  const surge = v > 1.0;
  useEffect(() => {
    let raf = 0, acc = 0;
    const f = (now: number) => {
      const dt = last.current ? Math.min((now - last.current) / 1000, 0.1) : 0; last.current = now;
      tm.current += dt;
      if (playing) {
        const nv = vRef.current + dt * 0.06;
        if (nv > 1.06) { surgeT.current += dt; if (surgeT.current > 3.5) { surgeT.current = 0; setV(0.2); setPlaying(false); } else setV(1.06); } else setV(nv);
      }
      const flowDir = vRef.current > 1 ? Math.sin(tm.current * 2 * Math.PI * 0.7) : 1;
      const spd = (vRef.current > 1 ? 0.14 : 0.05 + 0.1 * (1 - Math.min(vRef.current, 1))) * flowDir;
      pos.current = pos.current.map((p) => p + spd * dt);
      acc += dt;
      if (acc >= 1 / 30) { acc = 0; setFrame((k) => (k + 1) % 1e6); }
      raf = requestAnimationFrame(f);
    };
    raf = requestAnimationFrame(f);
    return () => { cancelAnimationFrame(raf); last.current = 0; };
  }, [playing]);
  if (!ln || rs.length < 2) return <p className="muted">No test points to animate.</p>;

  // Operating point along the speed line from the reduced test points (overload ... surge).
  const k = Math.min(v, 1) * (rs.length - 1), i0 = Math.min(Math.floor(k), rs.length - 2), fr = k - i0;
  const osc = surge ? Math.sin(tm.current * 2 * Math.PI * 0.7) : 0;
  const I = (g: (r: Json) => number) => lerp(g(rs[i0]), g(rs[i0 + 1]), fr);
  const op = { q: I((r) => r.test.qv_m3_h) * (1 + 0.12 * osc), h: I((r) => r.test.head_kj_kg) * (1 - 0.05 * Math.abs(osc)), eta: I((r) => r.test.eta_p),
    p1: I((r) => r.test.P01_bara), t1: I((r) => r.test.T01_c), p2: I((r) => r.test.P02_bara) * (1 - 0.03 * Math.abs(osc)), t2: I((r) => r.test.T02_c),
    m: I((r) => r.test.m_kg_s), w: I((r) => r.test.shaft_power_kw), n: I((r) => r.test.n_rpm), mach: I((r) => r.test.mach) };
  const dp = rs[0] ? lerp(ln.readings[Math.min(i0, ln.readings.length - 1)]?.dp_kpa ?? 0, ln.readings[Math.min(i0 + 1, ln.readings.length - 1)]?.dp_kpa ?? 0, fr) : 0;
  const tfrac = (seg: number, f: number) => seg <= 2 ? 1 : seg === 3 ? 1 - f * 0.92 : seg === 8 ? 0 : seg === 9 ? f : 0.08;   // discharge hot, cooler, suction cold, compression
  const phi = tm.current * (op.n / 3000);
  const gas = Object.keys(s.test_gas ?? {}).join("/") || "gas";
  const seal = s.seal_gas;
  const valveOpen = surge ? 1 : 1 - Math.min(v, 1) * 0.85;
  const tag = (x: number, y: number, t: string, val: string) => <g transform={`translate(${x} ${y})`}><circle r="13" fill="var(--panel)" stroke="#0b5cad" strokeWidth="1.5" />
    <text y="3" textAnchor="middle" className="pt-tagt">{t}</text><rect x="16" y="-9" width="78" height="18" rx="2" fill="var(--panel)" stroke="var(--line-2)" />
    <text x="90" y="4" textAnchor="end" className="mrt-tag">{val}</text></g>;
  const pipe = PATH.slice(0, 8).map((p) => p.join(",")).join(" ");
  const pred = ln.predicted_test, tl = ln.results.filter((r: Json) => r.test).map((r: Json) => r.test).sort((a: Json, b: Json) => a.qv_m3_h - b.qv_m3_h);
  return (
    <div className="mrt-anim">
      <div className="mrt-stage-wrap">
        <div className={`mrt-banner ${surge ? "crit" : ""}`} style={{ borderLeftColor: surge ? "#c0392b" : "#0b5cad" }}>
          <b>{surge ? "SURGE - flow reversal, anti-surge valve opened" : `${fmt(ln.speed_frac * 100, 0)} % speed line · ${v < 0.15 ? "overload" : v > 0.9 ? "approaching surge" : "throttling along the speed line"}`}</b>
          <span className="mono small">{gas} closed loop · Type {d.test_type}</span>
        </div>
        <svg viewBox="0 0 1000 440" className="mrt-stage" role="img" aria-label="Performance test closed loop">
          <defs>
            {[["gSteel", "#e3e8ee", "#8e9aa8", "#58636f"], ["gMotor", "#5f97d6", "#1a5aa6", "#0d3a6e"], ["gCas", "#a7c0cf", "#5e8197", "#34505f"],
              ["gHead", "#93a7b8", "#5a6d7e", "#38464f"], ["gGear", "#9aa6b3", "#6b7785", "#4a5562"], ["gPipe", "#dfe5ea", "#a3afba", "#6e7a86"]].map(([id, a, b, c]) =>
              <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={a} /><stop offset=".45" stopColor={b} /><stop offset="1" stopColor={c} /></linearGradient>)}
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0 H0 V40" fill="none" stroke="var(--line)" strokeWidth=".6" /></pattern>
          </defs>
          <rect width="1000" height="440" fill="url(#grid)" />
          {/* loop piping */}
          <polyline points={pipe} fill="none" stroke="#5b6672" strokeWidth="20" strokeLinejoin="round" />
          <polyline points={pipe} fill="none" stroke="url(#gPipe)" strokeWidth="16" strokeLinejoin="round" />
          {/* cooler */}
          <Box x={560} y={32} w={190} h={44} c={["#8fc7b9", "#4f9a88", "#357265"]} d={12}>
            {Array.from({ length: 16 }, (_, j) => <line key={j} x1={570 + j * 11} x2={570 + j * 11} y1={36} y2={72} stroke="#2e6a5c" strokeWidth="2" />)}
            <rect x={622} y={46} width={66} height={16} rx="2" fill="#357265" /><text x={655} y={58} textAnchor="middle" className="mrt-name small">COOLER</text></Box>
          <text x={655} y={22} textAnchor="middle" className="mrt-lab">water flow controls suction temperature</text>
          {/* control valve */}
          <g transform={`translate(880 88)`}><polygon points="-16,-14 16,-14 -16,14 16,14" fill="#e7ebee" stroke="#1d2733" strokeWidth="1.5" transform="rotate(90)" />
            <rect x="-4" y="-34" width="8" height="20" fill="#5b6672" /><rect x="-16" y="-44" width="32" height="12" rx="3" fill="#0b5cad" />
            <rect x="-70" y="10" width="46" height="6" fill="var(--line)" /><rect x="-70" y="10" width={46 * valveOpen} height="6" fill="#2e9e6b" />
            <text x="-24" y="2" className="mrt-lab" textAnchor="end">control valve {fmt(valveOpen * 100, 0)} % open</text></g>
          {/* anti-surge / vent */}
          <path d="M880 120 H960 V54 H880" fill="none" stroke={surge ? "#c0392b" : "#a3afba"} strokeWidth="6" strokeDasharray={surge ? "8 6" : undefined} />
          <text x="964" y="92" className="mrt-lab" textAnchor="start" transform="rotate(90 964 92)">anti-surge {surge ? "OPEN" : "closed"}</text>
          {/* orifice and gas charging */}
          <rect x="412" y="134" width="6" height="32" fill="#0c1a2b" /><text x="415" y="128" textAnchor="middle" className="mrt-lab">FE orifice β {fmt(s.setup.beta, 3)}</text>
          <Box x={196} y={165} w={52} h={72} c={["#cfd6dc", "#aab4bc", "#87929b"]} d={10}><text x={222} y={206} textAnchor="middle" className="mrt-name small" fill="#0c1a2b">{gas}</text></Box>
          <path d="M222 165 V150 H292" stroke="#a3afba" strokeWidth="5" fill="none" /><text x={222} y={254} textAnchor="middle" className="mrt-lab">gas charging (holds p1)</text>
          {/* gas particles coloured by temperature */}
          {pos.current.map((p, j) => { const a = along(p); const inside = a.seg >= 8; return <circle key={j} cx={a.p[0]} cy={a.p[1]} r={inside ? 3 : 4.2}
            fill={tcol(tfrac(a.seg, a.f))} opacity={inside ? 0.5 : 0.95} />; })}
          {/* train */}
          <Box x={30} y={392} w={760} h={18} c={["#9aa3ad", "#6f7883", "#4d555e"]} d={14} />
          <rect x={250} y={318} width={170} height={10} fill="url(#gSteel)" />
          <Cyl x={50} y={320} w={180} h={110} g="gMotor" rx={8} />
          {Array.from({ length: 20 }, (_, j) => <line key={j} x1={58 + j * 8.5} x2={58 + j * 8.5} y1={266} y2={374} stroke="#0a3d73" strokeWidth="2" opacity=".75" />)}
          <text x={140} y={325} textAnchor="middle" className="mrt-name">MOTOR</text>
          <Box x={300} y={270} w={110} h={122} c={["#a4afbb", "#76828f", "#56616d"]} d={14}>
            <rect x={312} y={280} width={86} height={86} rx="6" fill="#1d2733" opacity=".85" />
            <Gear cx={345} cy={330} r={30} teeth={24} ang={phi * 360 / 6} fill="url(#gGear)" /><Gear cx={385} cy={306} r={11} teeth={9} ang={-phi * 360} fill="#c4ccd6" /></Box>
          <rect x={410} y={300} width={90} height={9} fill="url(#gSteel)" />
          <rect x={430} y={290} width={40} height={30} rx="8" fill="#e69f00" opacity=".45" stroke="#a86d00" />
          <rect x={480} y={244} width={26} height={124} rx="6" fill="url(#gHead)" stroke="#1d2733" />
          <rect x={700} y={244} width={26} height={124} rx="6" fill="url(#gHead)" stroke="#1d2733" />
          <Cyl x={504} y={306} w={198} h={116} g="gCas" rx={10} />
          {[[524, "SUCTION"], [654, "DISCHARGE"]].map(([nx, l]) => <g key={l as string}><rect x={nx as number} y={214} width={28} height={36} fill="url(#gCas)" stroke="#1d2733" />
            <rect x={(nx as number) - 8} y={206} width={44} height={10} fill="url(#gHead)" stroke="#1d2733" /></g>)}
          <text x={603} y={311} textAnchor="middle" className="mrt-name">COMPRESSOR</text>
          {/* dry gas seal panel */}
          <Box x={800} y={250} w={110} h={130} c={["#a596cf", "#6c5a9c", "#4c3d78"]} d={12}><text x={855} y={272} textAnchor="middle" className="mrt-name small">DGS PANEL</text>
            {[["primary", "#e69f00"], ["secondary", "#56b4e9"], ["buffer", "#2e9e6b"]].map(([kk, c], j) => <g key={kk}>
              <circle cx={814} cy={292 + j * 26} r="4" fill={c} /><text x={822} y={295 + j * 26} className="mrt-tag" fill="#fff">{kk}: {String(seal?.[kk] ?? "-").slice(0, 14)}</text></g>)}</Box>
          {[["#e69f00", 0], ["#56b4e9", 6], ["#2e9e6b", 12]].map(([c, o]) => <g key={c as string}>
            <path d={`M800 ${290 + (o as number) * 2} H${740 + (o as number)} V${300 + (o as number)} H726`} className="gas" stroke={c as string} strokeWidth="3" strokeDashoffset={-tm.current * 30} />
            <path d={`M${740 + (o as number)} ${300 + (o as number)} V${386 - (o as number)} H${470 - (o as number)} V${300 + (o as number)} H480`} className="gas" stroke={c as string} strokeWidth="2.5" strokeDashoffset={-tm.current * 30} opacity=".7" /></g>)}
          {/* instruments */}
          {tag(470, 190, "PT", `${fmt(op.p1, 3)} bar`)}{tag(470, 162, "TT", `${fmt(op.t1, 1)} °C`)}
          {tag(694, 190, "PT", `${fmt(op.p2, 3)} bar`)}{tag(694, 162, "TT", `${fmt(op.t2, 1)} °C`)}
          {tag(312, 96, "FT", `${fmt(dp, 2)} kPa`)}{tag(40, 236, "ST", `${fmt(op.n, 0)} rpm`)}
        </svg>
        <div className="mrt-controls">
          <button className="btn primary" onClick={() => { if (v > 1) setV(0.05); setPlaying(!playing); }}>{playing ? "Pause" : "Run speed line to surge"}</button>
          <button className="btn" onClick={() => { setPlaying(false); setV(0.05); surgeT.current = 0; }}>Open valve</button>
          <div className="seg">{lines.map((l: Json, j: number) => <button key={j} className={li === j ? "on" : ""} onClick={() => setLi(j)}>{fmt(l.speed_frac * 100, 0)} %</button>)}</div>
          <input type="range" className="mrt-scrub" min={0} max={1.06} step={0.005} value={v} onChange={(e) => { setPlaying(false); setV(Number(e.target.value)); }} aria-label="Control valve" />
          <span className="mono small">valve closing {fmt(Math.min(v, 1) * 100, 0)} %</span>
        </div>
        <div className="mrt-live-row" style={{ marginTop: 12 }}>
          <LiveChart fit title={`Test map · ${gas} at ${fmt(ln.N_test_rpm, 0)} rpm`} xl="Inlet volume flow (m³/h)" yl="Polytropic head (kJ/kg)" h={210}
            series={[{ x: pred.map((p: Json) => p.qv_m3_h), y: pred.map((p: Json) => p.head_kj_kg), color: "#8e9aa5", dash: true, name: "predicted" },
              { x: tl.map((p: Json) => p.qv_m3_h), y: tl.map((p: Json) => p.head_kj_kg), color: LINE[li % 5], dots: true, name: "test points" }]}
            vlines={[{ x: Math.min(...tl.map((p: Json) => p.qv_m3_h)), color: "#c0392b", label: "surge" }]}
            markers={[{ x: op.q, y: op.h, color: surge ? "#c0392b" : "#0c1a2b", label: surge ? "SURGE" : "operating point" }]} />
          <LiveChart fit title="Polytropic efficiency" xl="Inlet volume flow (m³/h)" yl="η p %" h={210}
            series={[{ x: pred.map((p: Json) => p.qv_m3_h), y: pred.map((p: Json) => p.eta_p * 100), color: "#8e9aa5", dash: true, name: "predicted" },
              { x: tl.map((p: Json) => p.qv_m3_h), y: tl.map((p: Json) => p.eta_p * 100), color: LINE[li % 5], dots: true, name: "test" }]}
            markers={[{ x: op.q, y: op.eta * 100, color: "#0c1a2b" }]} />
        </div>
      </div>
      <aside className="mrt-side">
        <div className="pt-kpi">{([["Speed", `${fmt(op.n, 0)} rpm`], ["Inlet flow", `${fmt(op.q, 0)} m³/h`], ["Mass flow", `${fmt(op.m, 2)} kg/s`],
          ["p1 / p2", `${fmt(op.p1, 2)} / ${fmt(op.p2, 2)} bar`], ["t1 / t2", `${fmt(op.t1, 1)} / ${fmt(op.t2, 1)} °C`], ["Head", `${fmt(op.h, 1)} kJ/kg`],
          ["η polytropic", `${fmt(op.eta * 100, 2)} %`], ["Gas power", `${fmt(op.w, 0)} kW`], ["Machine Mach", fmt(op.mach, 3)]] as [string, string][]).map(([l, x]) =>
          <div key={l}><b>{x}</b><span>{l}</span></div>)}</div>
        <div className="card"><h3>Gas temperature</h3>
          <svg viewBox="0 0 260 30"><defs><linearGradient id="tg"><stop offset="0" stopColor={tcol(0)} /><stop offset="1" stopColor={tcol(1)} /></linearGradient></defs>
            <rect x="10" y="4" width="240" height="10" rx="3" fill="url(#tg)" /><text x="10" y="27" className="lc-tick">{fmt(op.t1, 0)} °C suction</text>
            <text x="250" y="27" className="lc-tick" textAnchor="end">{fmt(op.t2, 0)} °C discharge</text></svg></div>
        <div className="card"><h3>Seal gas (dry gas seals)</h3><table className="t small"><tbody>
          {[["Primary", seal?.primary], ["Secondary", seal?.secondary], ["Buffer", seal?.buffer], ["Separation", seal?.separation]].map(([a, b]) => <tr key={a}><td>{a}</td><td>{b}</td></tr>)}
        </tbody></table><p className="muted small">Contract seals are used; record dynamic leakage during the test and static leakage before and after.</p></div>
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
    critical_margin_pct: 10, reynolds_correction: false, selection: {} }, logs: {} });
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
    rows[i] = { ...rows[i], [k]: k === "point" ? val : Number(val) }; sec[frac] = rows;
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
    return { head: pick(basis, "head_kj_kg"), eta: pick(basis, "eta_p"), power: pick(basis, "shaft_power_kw") };
  }, [s, basis]);
  const g = s?.acceptance?.guarantee_qv_m3_h;

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
              <tr><td>Reynolds-number correction</td><td><label><input type="checkbox" checked={!!opt.reynolds_correction} onChange={(e) => upd({ reynolds_correction: e.target.checked })} /> apply (often excluded for Type 2 by contract)</label></td></tr>
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

      {d && s?.lines && tab === 1 && <div className="card"><h3>Closed test loop · 2.5D, gas coloured by temperature</h3><LoopAnim key={`${secKey}-${sel?.gas}-${sel?.N_rpm}`} s={s} d={d} /></div>}

      {d && s?.lines && tab === 2 && <div className="card"><h3>Test log · section {s.spec.section}</h3>
        {s.simulated ? <p className="small"><Pill s="review" /> Simulated example readings (predicted curve on the test gas with a small machine deviation and instrument scatter).{" "}
          <button className="btn" onClick={editable}>Edit as measured log</button></p> : <p className="small"><Pill s="pass" /> Measured log in use.{" "}
          <button className="btn" onClick={() => load()}>Recalculate</button> <button className="btn" onClick={() => { const l = { ...logs }; delete l[secKey]; setLogs(l); load(opt, l); }}>Back to example</button></p>}
        <p><button className="btn" onClick={exportCSV}>Export CSV</button> <button className="btn" onClick={() => fileRef.current?.click()}>Import CSV</button>
          <input ref={fileRef} type="file" accept=".csv,.txt" hidden onChange={(e) => e.target.files?.[0] && importCSV(e.target.files[0])} />
          <span className="muted small"> CSV columns: speed_frac, {COLS.map(([k]) => k).join(", ")}, surge</span></p>
        {s.lines.map((ln: Json) => { const fr = ln.speed_frac.toFixed(3); const rows = s.simulated ? ln.readings : (logs[secKey]?.[fr] ?? ln.readings); return <div key={fr} style={{ marginBottom: 12 }}>
          <b>{fmt(ln.speed_frac * 100, 0)} % speed · test {fmt(ln.N_test_rpm, 0)} rpm (specified {fmt(ln.N_sp_rpm, 0)} rpm)</b>
          <div className="scroll"><table className="t small"><thead><tr>{COLS.map(([, l]) => <th key={l} className="n">{l}</th>)}<th>Surge</th></tr></thead>
            <tbody>{rows.map((r: Json, i: number) => <tr key={i}>{COLS.map(([k]) => <td key={k} className="n">{s.simulated ? (k === "point" ? r[k] : fmt(r[k], k.startsWith("p") ? 4 : 2)) :
              <input className="inp" style={{ width: 82 }} defaultValue={r[k]} onBlur={(e) => setCell(fr, i, k, e.target.value)} />}</td>)}<td>{r.surge ? "yes" : ""}</td></tr>)}</tbody></table></div></div>; })}
      </div>}

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
        </div>
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

      {d && tab === 6 && <div className="grid">
        <div className="card"><h3>Report</h3><p className="small">PTC 10 report layout: summary and similarity, closed-loop set-up drawing, instruments and stability criteria, test design and
          gas screening, data and results per speed, curves with uncertainty bands, orifice, seal gas, coast-down and the computational method.</p>
          <button className="btn primary" disabled={busy} onClick={() => saveFrom("/api/ptc10/report.pdf", body(), `${safeName(key)}_PTC10.pdf`)}>Download PDF report</button></div>
        <div className="card"><h3>Procedure</h3><ol className="small">{d.procedure.map((x: string, i: number) => <li key={i}>{x}</li>)}</ol></div>
        <div className="card"><h3>Instruments</h3><table className="t small"><thead><tr><th>Instrument</th><th>Parameter</th><th>Accuracy</th><th>Qty</th></tr></thead>
          <tbody>{d.instruments.map((r: string[]) => <tr key={r[0]}>{r.map((x) => <td key={x}>{x}</td>)}</tr>)}</tbody></table></div>
        <div className="card"><h3>Stability per point</h3><table className="t small"><tbody>{d.stability.map((r: string[]) => <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td></tr>)}</tbody></table></div>
      </div>}
    </>
  );
}
