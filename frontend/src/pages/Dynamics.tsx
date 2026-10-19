import { useEffect, useRef, useState } from "react";
import { fmt, type Json } from "../api";
import { safeName, saveFrom } from "../files";
import { LiveChart } from "../components/LiveChart";
import { Pid, type Sel } from "../components/Pid";
import { svgToPng } from "../components/testTags";
import type { Ctx } from "./Pages";

// Compressor-system dynamics: editable P&ID (nodes, valves, controllers), study presets with editable
// events, time-domain run (backend dynamics/engine.py), animated P&ID and map, live trends and the report.

const ACTIONS = ["trip", "valve", "release", "controller", "speed"];
const C = ["#0b5cad", "#d55e00", "#009e73", "#cc79a7", "#e69f00", "#56b4e9", "#7f7f7f", "#000"];
const NEW: Record<string, Json> = {
  volume: { type: "volume", label: "New volume", V_m3: 2, P_bara: 30, T_c: 35 },
  cooler: { type: "cooler", label: "New cooler", V_m3: 2, P_bara: 30, T_c: 35, T_out_c: 35, tau_s: 2 },
  valve: { type: "valve", label: "New valve", Cv: 300, open: 0, stroke_s: 2, char: "linear" },
  check: { type: "check", label: "New check valve", Cv: 1000, open: 1, stroke_s: 0.3 },
  pipe: { type: "pipe", label: "New pipe", Cv: 3000, open: 1 },
};

function Props({ obj, nodes, set }: { obj: Json; nodes: string[]; set: (o: Json) => void }) {
  const skip = ["id", "type", "x", "y", "from", "to", "P_settle_bara"];
  return <table className="t"><tbody>
    {"from" in obj && (["from", "to"] as const).map((k) => <tr key={k}><td className="muted">{k}</td><td>
      <select className="inp" value={obj[k]} onChange={(e) => set({ ...obj, [k]: e.target.value })}>{nodes.map((n) => <option key={n}>{n}</option>)}</select></td></tr>)}
    {Object.entries(obj).filter(([k, v]) => !skip.includes(k) && ["number", "string", "boolean"].includes(typeof v)).map(([k, v]) => <tr key={k}><td className="muted">{k}</td><td>
      {typeof v === "boolean" ? <input type="checkbox" checked={v} onChange={(e) => set({ ...obj, [k]: e.target.checked })} />
        : k === "char" ? <select className="inp" value={v as string} onChange={(e) => set({ ...obj, [k]: e.target.value })}>{["linear", "equal%", "quick"].map((x) => <option key={x}>{x}</option>)}</select>
          : <input className="inp" value={String(v)} onChange={(e) => set({ ...obj, [k]: typeof v === "number" && e.target.value !== "" && !isNaN(Number(e.target.value)) ? Number(e.target.value) : e.target.value })} />}
    </td></tr>)}
  </tbody></table>;
}

export function DynamicsPage(c: Ctx) {
  const [net, setNet] = useState<Json>(c.project?.dynamics?.network ?? null);
  const [scs, setScs] = useState<Json>(null);
  const [key, setKey] = useState("esd");
  const [sc, setSc] = useState<Json>(null);
  const [res, setRes] = useState<Json>(null);
  const [f, setF] = useState(0);
  const [play, setPlay] = useState(false);
  const [rate, setRate] = useState(1);
  const [sel, setSel] = useState<Sel>(null);
  const [busy, setBusy] = useState("");
  const [err, setErr] = useState("");
  const pidRef = useRef<SVGSVGElement>(null);

  const post = async (url: string, body: Json) => {
    const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ project: c.project, ...body }) });
    if (!r.ok) throw new Error((await r.json().catch(() => ({}))).detail ?? r.statusText);
    return r.json();
  };
  const load = async (reset = false) => {
    setBusy("Building the model…"); setErr("");
    try {
      const m = await post("/api/dynamics/model", { network: reset ? null : net, reset });
      setScs(m.scenarios); setSc(m.scenarios[key]);
      if (reset || !net) save(m.network);
    } catch (e) { setErr(String(e)); }
    setBusy("");
  };
  useEffect(() => { if (c.results) load(); }, [c.results]); // eslint-disable-line react-hooks/exhaustive-deps
  const save = (n: Json) => { setNet(n); c.setProject({ ...c.project, dynamics: { ...(c.project.dynamics ?? {}), network: n } }); };

  useEffect(() => {          // playback: real time x rate
    if (!play || !res) return;
    let raf = 0, last = performance.now();
    const dt = res.t[1] - res.t[0];
    const tick = (now: number) => {
      const steps = ((now - last) / 1000) * rate / dt;
      if (steps >= 1) { last = now; setF((x) => { const y = Math.min(x + Math.floor(steps), res.t.length - 1); if (y === res.t.length - 1) setPlay(false); return y; }); }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [play, res, rate]);

  if (!c.results) return <p className="muted">Run the analysis first: the dynamic model is built from the design (map, gas, volumes, valves, driver and train inertia).</p>;
  if (!net || !sc) return <p className="muted">{busy || err || "Loading…"}</p>;

  const run = async () => {
    setBusy("Simulating…"); setErr(""); setPlay(false);
    try { const r = await post("/api/dynamics/run", { network: net, scenario: sc }); setRes(r); setF(0); setPlay(true); } catch (e) { setErr(String(e)); }
    setBusy("");
  };
  const report = async (all: boolean) => {
    setBusy(all ? "Running every study for the report…" : "Building the report…");
    try { await saveFrom("/api/dynamics/report.pdf", { project: c.project, network: net, scenario: sc, all, images: { pid: await svgToPng(pidRef.current) } }, `${safeName(c.project.name)}_dynamics_${key}.pdf`); }
    catch (e) { setErr(String(e)); }
    setBusy("");
  };
  const nodeIds = net.nodes.map((n: Json) => n.id);
  const list = sel?.kind === "node" ? "nodes" : sel?.kind === "link" ? "links" : "controllers";
  const obj = sel ? net[list]?.find((x: Json) => x.id === sel.id) : null;
  const upd = (o: Json) => save({ ...net, [list]: net[list].map((x: Json) => (x.id === o.id ? o : x)) });
  const add = (t: string) => {
    const isNode = t === "volume" || t === "cooler", arr = isNode ? net.nodes : net.links;
    const pre = { volume: "V", cooler: "E", valve: "XV", check: "NRV", pipe: "L" }[t]!;
    let n = 1; while (arr.some((x: Json) => x.id === `${pre}-${200 + n}`)) n++;
    const id = `${pre}-${200 + n}`;
    if (isNode) save({ ...net, nodes: [...net.nodes, { id, ...NEW[t], x: 560, y: 120 }] });
    else save({ ...net, links: [...net.links, { id, ...NEW[t], from: nodeIds[1], to: nodeIds[2] }] });
    setSel({ kind: isNode ? "node" : "link", id });
  };
  const del = () => {
    if (!sel || (sel.kind === "link" && obj?.type === "compressor")) return;
    if (sel.kind === "node") save({ ...net, nodes: net.nodes.filter((x: Json) => x.id !== sel.id), links: net.links.filter((l: Json) => l.from !== sel.id && l.to !== sel.id) });
    else save({ ...net, [list]: net[list].filter((x: Json) => x.id !== sel.id) });
    setSel(null);
  };
  const ids = [...net.links.filter((l: Json) => l.type === "valve").map((l: Json) => l.id), ...(net.controllers ?? []).map((x: Json) => x.id)];
  const setEv = (i: number, e: Json) => setSc({ ...sc, events: sc.events.map((x: Json, j: number) => (j === i ? e : x)) });

  const t = res?.t ?? [], tf = t[f] ?? 0, cm = res?.compressor, sm = res?.summary;
  const mg = (net.controllers ?? []).find((x: Json) => x.type === "antisurge")?.margin ?? 0.1;
  const map = res?.map, sl = [0.3, 0.5, 0.7, 0.9, 1, 1.05];
  const ev = (sc.events ?? []).map((e: Json) => ({ x: e.t, color: "#9aa3ab", dash: true }));
  const sub = (y: number[]) => y.slice(0, f + 1);
  return (
    <>
      <h2>Dynamics &amp; anti-surge</h2>
      <p className="lead">Time-domain simulation of the compressor system: ESD and driver trip, anti-surge control, blocked discharge, start-up, normal stop and
        settle-out. The P&amp;ID is built from the design; drag the equipment, select any item to edit it, add volumes, valves and check valves, then run a study.</p>

      <div className="card">
        <div className="row" style={{ flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
          <select className="inp" value={key} onChange={(e) => { setKey(e.target.value); setSc(scs[e.target.value]); setRes(null); }}>
            {Object.entries(scs ?? {}).map(([k, v]: [string, Json]) => <option key={k} value={k}>{v.title}</option>)}</select>
          <label className="muted">Duration s <input className="inp" style={{ width: 70 }} value={sc.duration_s} onChange={(e) => setSc({ ...sc, duration_s: Number(e.target.value) || 1 })} /></label>
          <button className="btn primary" disabled={!!busy} onClick={run}>{busy === "Simulating…" ? busy : "Run study"}</button>
          <button className="btn" disabled={!!busy} onClick={() => report(false)}>Report (this study)</button>
          <button className="btn" disabled={!!busy} onClick={() => report(true)}>Report (all studies)</button>
          <button className="btn" disabled={!!busy} onClick={() => { if (confirm("Rebuild the P&ID from the design? Your edits are lost.")) load(true); }}>Reset P&amp;ID</button>
          {busy && <span className="muted">{busy}</span>}
        </div>
        {err && <p style={{ color: "var(--fail)" }}>{err}</p>}
        <Pid ref={pidRef} net={net} res={res} f={f} sel={sel} onSel={setSel}
          onMove={(id, x, y) => save({ ...net, nodes: net.nodes.map((n: Json) => (n.id === id ? { ...n, x, y } : n)) })} />
        {res && <div className="row" style={{ gap: 8, marginTop: 8 }}>
          <button className="btn primary" onClick={() => { if (f >= t.length - 1) setF(0); setPlay(!play); }}>{play ? "Pause" : "Play"}</button>
          {[0.5, 1, 2, 5].map((r) => <button key={r} className={`chip ${rate === r ? "on" : ""}`} onClick={() => setRate(r)}>{r}×</button>)}
          <input type="range" min={0} max={t.length - 1} value={f} onChange={(e) => { setPlay(false); setF(Number(e.target.value)); }} style={{ flex: 1 }} />
          <span className="mono">{fmt(tf, 2)} / {fmt(t[t.length - 1], 1)} s</span>
        </div>}
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", marginTop: 12 }}>
        <div className="card"><h3>{sel ? `${sel.id} — ${obj?.label ?? ""}` : "Edit the model"}</h3>
          <div className="chips">{Object.keys(NEW).map((k) => <button key={k} className="chip" onClick={() => add(k)}>+ {k}</button>)}
            {sel && <button className="chip" onClick={del}>Delete {sel.id}</button>}</div>
          {obj ? <Props obj={obj} nodes={nodeIds} set={upd} /> : <p className="muted small">Select a vessel, valve, the compressor or a controller bubble on the P&amp;ID to edit it.
            Valves: Cv (US), opening 0–1, stroke time, trim. Volumes: m³ and initial pressure / temperature. Controller: control line margin, trip line, Kp, Ti.</p>}
          <h3 style={{ marginTop: 10 }}>Driver and train</h3>
          <Props obj={net.driver} nodes={[]} set={(d) => save({ ...net, driver: d })} />
        </div>
        <div className="card"><h3>Events — {sc.title}</h3>
          <table className="t"><thead><tr><th>t s</th><th>Action</th><th>Item</th><th>Value</th><th /></tr></thead><tbody>
            {(sc.events ?? []).map((e: Json, i: number) => <tr key={i}>
              <td><input className="inp" style={{ width: 60 }} value={e.t} onChange={(x) => setEv(i, { ...e, t: Number(x.target.value) || 0 })} /></td>
              <td><select className="inp" value={e.action} onChange={(x) => setEv(i, { ...e, action: x.target.value })}>{ACTIONS.map((a) => <option key={a}>{a}</option>)}</select></td>
              <td>{["valve", "release", "controller"].includes(e.action) && <select className="inp" value={e.id ?? ""} onChange={(x) => setEv(i, { ...e, id: x.target.value })}>
                <option value="" />{ids.map((v: string) => <option key={v}>{v}</option>)}</select>}</td>
              <td>{e.action === "valve" ? <input className="inp" style={{ width: 60 }} value={e.open} onChange={(x) => setEv(i, { ...e, open: Number(x.target.value) })} />
                : e.action === "speed" ? <input className="inp" style={{ width: 60 }} value={e.value} onChange={(x) => setEv(i, { ...e, value: Number(x.target.value) })} />
                  : e.action === "controller" ? <select className="inp" value={e.on ? "on" : "off"} onChange={(x) => setEv(i, { ...e, on: x.target.value === "on" })}><option>on</option><option>off</option></select> : null}</td>
              <td><button className="chip" onClick={() => setSc({ ...sc, events: sc.events.filter((_: Json, j: number) => j !== i) })}>×</button></td></tr>)}
          </tbody></table>
          <button className="chip" onClick={() => setSc({ ...sc, events: [...(sc.events ?? []), { t: 2, action: "valve", id: ids[0], open: 0 }] })}>+ event</button>
          <p className="muted small">valve: opening 0–1 (overrides the controller) · release: back to its controller · controller: on / off · speed: set-point as a fraction of rated.</p>
        </div>
      </div>

      {res && <>
        <div className="kpis" style={{ marginTop: 12 }}>{[["Verdict", sm.verdict.toUpperCase()], ["Surge", sm.surge ? `YES · ${sm.surge_cycles} cycle(s)` : "no"],
          ["Min surge margin", sm.min_surge_margin_pct != null ? `${fmt(sm.min_surge_margin_pct, 1)} %` : "–"], ["Max discharge T", `${fmt(sm.max_discharge_c, 0)} °C`],
          ["Max pressure", `${fmt(sm.max_pressure_bara, 1)} bara`], ["Settle-out", sm.settle_out_bara ? `${fmt(sm.settle_out_bara, 1)} bara` : "–"],
          ["Speed now", `${fmt(cm.speed_frac[f] * 100, 1)} %`], ["Margin now", `${fmt(cm.surge_margin[f], 1)} %`]].map(([l, v]) =>
            <div key={l} className="kpi"><div className="v" style={l === "Verdict" ? { color: sm.verdict === "pass" ? "var(--pass)" : "var(--fail)" } : undefined}>{v}</div><div className="l">{l}</div></div>)}</div>
        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", marginTop: 12 }}>
          <LiveChart title="Operating point on the map" xl="Actual suction flow (m³/h)" yl="Head (kJ/kg)" h={300}
            xr={[Math.min(0, ...cm.q_am3_h), Math.max(...map.q) * 1.12]} yrange={[0, Math.max(...map.h) * 1.25]}
            series={[...sl.map((s) => ({ x: map.q.map((q: number) => q * s), y: map.h.map((h: number) => h * s * s), color: "#c3ccd6", width: 1, name: `${s * 100} %` })),
              { x: sl.map((s) => map.q_surge * s), y: sl.map((s) => map.h_surge * s * s), color: "#c0392b", width: 1.8, name: "surge" },
              { x: sl.map((s) => map.q_surge * s * (1 + mg)), y: sl.map((s) => map.h_surge * s * s), color: "#e69f00", width: 1.2, name: "control" },
              { x: sub(cm.q_am3_h), y: sub(cm.head_kj_kg), color: "#0b5cad", width: 1.4, name: "path" }]} legend={false}
            markers={[{ x: cm.q_am3_h[f], y: cm.head_kj_kg[f], color: cm.surge_margin[f] < 0 ? "#c0392b" : "#30a46c", label: "now" }]} />
          <LiveChart title="Surge margin (%) and speed (%)" xl="Time (s)" yl="%" h={300} xr={[0, t[t.length - 1]]} yrange={[-120, 110]} cursor={tf} vlines={ev}
            hlines={[{ y: mg * 100, color: "#e69f00", label: "control line" }, { y: 0, color: "#c0392b", label: "surge" }]}
            series={[{ x: sub(t), y: sub(cm.surge_margin), color: C[0], name: "margin", width: 1.4 }, { x: sub(t), y: sub(cm.speed_frac.map((v: number) => v * 100)), color: C[1], name: "speed", width: 1.4 }]} />
          <LiveChart title="Pressures (bara)" xl="Time (s)" yl="bara" h={240} xr={[0, t[t.length - 1]]} cursor={tf} vlines={ev}
            series={net.nodes.filter((n: Json) => n.type !== "source" && n.type !== "sink").map((n: Json, i: number) => ({ x: sub(t), y: sub(res.nodes[n.id].P_bara), color: C[i % 8], name: n.id, width: 1.3 }))} />
          <LiveChart title="Flows (kg/s, negative = reverse)" xl="Time (s)" yl="kg/s" h={240} xr={[0, t[t.length - 1]]} cursor={tf} vlines={ev}
            series={net.links.filter((l: Json) => l.type !== "pipe").map((l: Json, i: number) => ({ x: sub(t), y: sub(res.links[l.id].mdot_kg_s), color: C[i % 8], name: l.id, width: 1.3 }))} />
          <LiveChart title="Valve openings (%)" xl="Time (s)" yl="%" h={220} xr={[0, t[t.length - 1]]} yrange={[0, 105]} cursor={tf} vlines={ev}
            series={net.links.filter((l: Json) => l.type === "valve").map((l: Json, i: number) => ({ x: sub(t), y: sub(res.links[l.id].open.map((v: number) => v * 100)), color: C[i % 8], name: l.id, width: 1.3 }))} />
          <LiveChart title="Power (kW) and discharge temperature (°C)" xl="Time (s)" yl="kW" yr="°C" h={220} xr={[0, t[t.length - 1]]} cursor={tf} vlines={ev}
            series={[{ x: sub(t), y: sub(cm.power_kw), color: C[0], name: "gas power", width: 1.3 }, { x: sub(t), y: sub(cm.Td_kw), color: C[2], name: "driver", width: 1.1 },
              { x: sub(t), y: sub(cm.T_out_c), color: C[1], name: "T discharge", width: 1.3, right: true }]} />
        </div>
      </>}
    </>
  );
}
