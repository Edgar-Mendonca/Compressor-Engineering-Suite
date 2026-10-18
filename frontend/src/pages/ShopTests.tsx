import { useEffect, useRef, useState } from "react";
import { fmt, type Json } from "../api";

// API 617 shop-test simulator (backend testing/shoptest.py): balancing limits, residual
// unbalance check, high-speed (influence-coefficient) balancing, impeller overspeed test record
// and rotor thrust, with animations. The mechanical running test is its own module (MechRunTest.tsx).

type Ctx = { project: Json; results: Json; casing: number; setProject: (p: Json) => void };
const TABS = ["Balancing", "Residual unbalance check", "High-speed balance", "Overspeed test record", "Thrust"];
const post = async (url: string, body: unknown) => {
  const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error((await r.json().catch(() => ({}))).detail ?? r.statusText);
  return r.json();
};
const Pill = ({ s }: { s: string }) => <span className={`pill ${s}`}>{s}</span>;

/** Rotating rotor face: heavy spot, trial / correction weights, vibration vector. */
function RotorFace({ heavy, weights, vib, speed = 1, label }: { heavy?: number; weights: { angle: number; color: string; size: number; label?: string }[];
  vib?: { amp: number; phase: number }; speed?: number; label?: string }) {
  const [t, setT] = useState(0);
  useEffect(() => { let raf = 0; const s = performance.now(); const f = () => { setT((performance.now() - s) / 1000); raf = requestAnimationFrame(f); }; raf = requestAnimationFrame(f); return () => cancelAnimationFrame(raf); }, []);
  const rot = (t * 120 * speed) % 360;
  const pt = (deg: number, r: number) => [100 + r * Math.cos(((deg + rot) * Math.PI) / 180), 100 - r * Math.sin(((deg + rot) * Math.PI) / 180)];
  return (
    <svg viewBox="0 0 200 200" className="rface" role="img" aria-label="Rotor face">
      <circle cx="100" cy="100" r="78" fill="#dfe6ee" stroke="#3b4652" strokeWidth="2" />
      <circle cx="100" cy="100" r="22" fill="#9aa7b4" stroke="#3b4652" />
      {[0, 60, 120, 180, 240, 300].map((a) => { const [x, y] = pt(a, 70); return <circle key={a} cx={x} cy={y} r="2" fill="#5b6878" />; })}
      {heavy !== undefined && (() => { const [x, y] = pt(heavy, 55); return <g><circle cx={x} cy={y} r="8" fill="#C0392B" /><text x={x} y={y + 3} textAnchor="middle" fontSize="8" fill="#fff">H</text></g>; })()}
      {weights.map((w, i) => { const [x, y] = pt(w.angle, 66); return <g key={i}><rect x={x - w.size / 2} y={y - w.size / 2} width={w.size} height={w.size} fill={w.color} stroke="#000" />
        {w.label && <text x={x} y={y - w.size} textAnchor="middle" fontSize="8">{w.label}</text>}</g>; })}
      {vib && (() => { const [x, y] = [100 + vib.amp * Math.cos(((vib.phase + rot) * Math.PI) / 180), 100 - vib.amp * Math.sin(((vib.phase + rot) * Math.PI) / 180)];
        return <line x1="100" y1="100" x2={x} y2={y} stroke="#0B5CAD" strokeWidth="3" markerEnd="url(#ah)" />; })()}
      <defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#0B5CAD" /></marker></defs>
      {label && <text x="100" y="196" textAnchor="middle" fontSize="10" fill="#5b6878">{label}</text>}
    </svg>
  );
}

/** Polar plot of amplitude vs trial-weight angle with the fitted curve. */
function Polar({ pts, fit, maxv }: { pts: [number, number][]; fit?: { angle_deg: number[]; amplitude: number[] }; maxv: number }) {
  const P = (a: number, v: number) => [110 + (v / maxv) * 90 * Math.cos((a * Math.PI) / 180), 110 - (v / maxv) * 90 * Math.sin((a * Math.PI) / 180)];
  return (
    <svg viewBox="0 0 220 220" className="rface" role="img" aria-label="Polar plot">
      {[0.25, 0.5, 0.75, 1].map((f) => <circle key={f} cx="110" cy="110" r={90 * f} fill="none" stroke="#d3d7d6" />)}
      {[0, 30, 60, 90, 120, 150].map((a) => { const [x1, y1] = P(a, maxv), [x2, y2] = P(a + 180, maxv); return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#e4e7e6" />; })}
      {fit && <polyline fill="none" stroke="#0B5CAD" strokeWidth="2" points={fit.angle_deg.map((a, i) => P(a, fit.amplitude[i]).join(",")).join(" ")} />}
      {pts.map(([a, v], i) => { const [x, y] = P(a, v); return <g key={i}><circle cx={x} cy={y} r="4" fill="#D55E00" stroke="#000" /><text x={x + 5} y={y - 5} fontSize="8">{a}°</text></g>; })}
      <text x="110" y="216" textAnchor="middle" fontSize="9" fill="#5b6878">amplitude vs trial-weight angle</text>
    </svg>
  );
}

export function ShopTestsPage(c: Ctx) {
  const [tab, setTab] = useState(0);
  const [d, setD] = useState<Json>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [rc, setRc] = useState({ trial_g_mm: 0, rows: [0, 60, 120, 180, 240, 300].map((a) => ({ angle: a, amp: "" as string | number })) });
  const [ib, setIb] = useState<Json>({ initial: [{ probe: "Bearing 1", amp: 30, phase: 40 }, { probe: "Bearing 2", amp: 22, phase: 160 }],
    trials: [{ plane: "Plane 1", weight_g_mm: 500, angle_deg: 0, readings: [{ probe: "Bearing 1", amp: 18, phase: 70 }, { probe: "Bearing 2", amp: 25, phase: 150 }] },
      { plane: "Plane 2", weight_g_mm: 500, angle_deg: 0, readings: [{ probe: "Bearing 1", amp: 26, phase: 30 }, { probe: "Bearing 2", amp: 12, phase: 200 }] }] });
  const [osm, setOsm] = useState<Json[]>(["Bore", "Eye", "Tip", "Shroud OD"].map((l) => ({ location: l, before_mm: "", after_mm: "" })));

  const seq = useRef(0);
  const load = async (extra: Json = {}) => {
    const id = ++seq.current;                       // only the latest request may update the page
    setBusy(true); setErr("");
    try {
      const r = await post("/api/shoptest", { project: c.project, casing: c.casing, ...extra });
      if (id === seq.current) setD(r);
    } catch (e) { if (id === seq.current) setErr((e as Error).message); } finally { if (id === seq.current) setBusy(false); }
  };
  useEffect(() => { if (c.results) load(); }, [c.results, c.casing]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!c.results) return <><h2>Shop tests: balancing & overspeed</h2><p className="muted">Run the analysis first.</p></>;
  const allow = d?.rotor_balance?.[0]?.governing_g_mm ?? 0;
  const trial = rc.trial_g_mm || Math.round(allow * 1.5);
  const nums = (rows: Json[]) => rows.filter((q) => q.amp !== "" && !Number.isNaN(Number(q.amp)));
  const runResidual = () => {
    const rows = nums(rc.rows);
    if (rows.length < 4) { setErr("Enter at least 4 amplitude readings"); return; }
    load({ residual: { angles_deg: rows.map((q) => q.angle), amplitudes: rows.map((q) => Number(q.amp)), trial_g_mm: trial, allowable_g_mm: allow } });
  };
  const res = d?.residual_check, inf = d?.influence, th = d?.thrust, os = d?.overspeed;

  return (
    <>
      <h2>Shop tests: balancing & overspeed</h2>
      <p className="lead">Plan and evaluate the shop tests: component and rotor balancing limits, the residual unbalance check, at-speed balancing with influence
        coefficients and the impeller overspeed test record, plus the rotor thrust balance. Enter test readings to get pass / fail. The mechanical running
        test (API 617 8.3.2) is planned and evaluated in the Mechanical running test module.</p>
      {err && <div className="error">{err}</div>}
      {d && <div className="kpis">{[["Rotor class", `${d.rotor_class.class} (N/Nc1 ${fmt(d.rotor_class.ratio_mcs_to_first_critical, 2)})`],
        ["Allowable unbalance / plane", `${fmt(allow, 1)} g·mm`], ["MCS", `${fmt(d.speeds.mcs_rpm, 0)} rpm`],
        ["Thrust bearing load ratio", fmt(th?.load_ratio, 2)]].map(([l, x]) => <div className="kpi" key={l}><div className={`v ${String(x).length > 16 ? "long" : ""}`}>{x}</div><div className="l">{l}</div></div>)}</div>}
      <div className="seg" style={{ marginBottom: 14 }}>{TABS.map((t, i) => <button key={t} className={tab === i ? "on" : ""} onClick={() => setTab(i)}>{t}</button>)}</div>
      {busy && <p className="muted">Calculating…</p>}
      {d && tab === 0 && <div className="grid">
        <div className="card"><h3>Component balance (each impeller) — U = 6350 W / N</h3>
          <table className="t"><thead><tr><th>Component</th><th>Mass kg</th><th>API 617 g·mm</th><th>Handbook 4W/N g·mm</th><th>Eccentricity µm</th></tr></thead>
            <tbody>{d.component_balance.map((q: Json) => <tr key={q.component}><td>{q.component}</td><td className="n">{fmt(q.mass_kg, 1)}</td><td className="n">{fmt(q.api617_g_mm, 1)}</td>
              <td className="n">{fmt(q.handbook_g_mm, 1)}</td><td className="n">{fmt(q.eccentricity_um, 3)}</td></tr>)}</tbody></table>
          <h3 style={{ marginTop: 14 }}>Rotor assembly (per correction plane / journal)</h3>
          <table className="t"><thead><tr><th>Plane</th><th>Static load kg</th><th>Allowable g·mm</th></tr></thead>
            <tbody>{d.rotor_balance.map((q: Json) => <tr key={q.plane}><td>{q.plane}</td><td className="n">{fmt(q.static_load_kg, 1)}</td><td className="n">{fmt(q.governing_g_mm, 1)}</td></tr>)}</tbody></table>
          <p className="muted small">{d.rotor_class.recommendation}.</p></div>
        <div className="card"><h3>Balancing sequence</h3>
          <RotorFace heavy={40} weights={[{ angle: 220, color: "#009E73", size: 12, label: "correction" }]} vib={{ amp: 30, phase: 40 }} label="Heavy spot H, correction weight opposite" />
          <ol className="small"><li>Balance each impeller (component) to the allowable above.</li><li>Stack impellers on the shaft, balancing after each addition (sequential stacking).</li>
            <li>Final assembly balance in two planes; then the residual unbalance check (next tab).</li><li>{d.rotor_class.class === "flexible" ? "Flexible rotor: at-speed balance (High-speed balance tab) if the running test requires it." : "Rigid rotor: low-speed balance is sufficient."}</li></ol></div>
      </div>}

      {d && tab === 1 && <div className="grid">
        <div className="card"><h3>Readings with the trial weight at each angle</h3>
          <label className="muted">Trial weight g·mm (1–2 × allowable, suggested {fmt(allow * 1.5, 0)})
            <input className="inp" type="number" value={rc.trial_g_mm || ""} placeholder={String(Math.round(allow * 1.5))} onChange={(e) => setRc({ ...rc, trial_g_mm: Number(e.target.value) })} /></label>
          <table className="t"><thead><tr><th>Angle °</th><th>Amplitude (µm or mm/s)</th></tr></thead>
            <tbody>{rc.rows.map((q, i) => <tr key={i}><td><input className="inp cell" type="number" value={q.angle} onChange={(e) => setRc({ ...rc, rows: rc.rows.map((x, j) => (j === i ? { ...x, angle: Number(e.target.value) } : x)) })} /></td>
              <td><input className="inp cell" type="number" step="any" value={q.amp} onChange={(e) => setRc({ ...rc, rows: rc.rows.map((x, j) => (j === i ? { ...x, amp: e.target.value } : x)) })} /></td></tr>)}</tbody></table>
          <div className="row" style={{ marginTop: 8 }}>
            <button className="btn" onClick={() => setRc({ ...rc, rows: [...rc.rows, { angle: (rc.rows[rc.rows.length - 1]?.angle ?? 0) + 30, amp: "" }] })}>Add angle</button>
            <button className="btn" onClick={() => { const U0 = allow * 0.4, h = 0.02; setRc({ trial_g_mm: trial, rows: rc.rows.map((q) => ({ ...q, amp: Number((h * Math.hypot(U0 * Math.cos(1.2) + trial * Math.cos(q.angle * Math.PI / 180), U0 * Math.sin(1.2) + trial * Math.sin(q.angle * Math.PI / 180))).toFixed(3)) })) }); }}>Fill example readings</button>
            <button className="btn primary" onClick={runResidual}>Evaluate</button></div>
        </div>
        <div className="card"><h3>Result {res && <Pill s={res.status} />}</h3>
          <Polar pts={nums(rc.rows).map((q) => [q.angle, Number(q.amp)])} fit={res?.fit} maxv={Math.max(...nums(rc.rows).map((q) => Number(q.amp)), 1) * 1.2} />
          {res && <table className="t"><tbody>{[["Residual unbalance", `${fmt(res.residual_g_mm, 1)} g·mm at ${fmt(res.residual_angle_deg, 0)}°`], ["Allowable", `${fmt(res.allowable_g_mm, 1)} g·mm`],
            ["Ratio", fmt(res.ratio, 2)], ["Trial weight in 1–2.5 × allowable", res.trial_ok ? "yes" : "no — repeat with a suitable trial weight"]].map(([k, x]) =>
            <tr key={k}><td className="muted">{k}</td><td>{x}</td></tr>)}</tbody></table>}
          <RotorFace heavy={res?.residual_angle_deg} weights={nums(rc.rows).map((q) => ({ angle: q.angle, color: "#E69F00", size: 7 }))} label="Trial-weight positions and fitted heavy spot" />
        </div>
      </div>}

      {d && tab === 2 && <div className="grid">
        <div className="card"><h3>Influence-coefficient balancing — readings (amplitude, phase °)</h3>
          <table className="t"><thead><tr><th>Run</th><th>Weight g·mm ∠°</th>{ib.initial.map((p: Json) => <th key={p.probe}>{p.probe}</th>)}</tr></thead>
            <tbody>
              <tr><td>Initial</td><td>–</td>{ib.initial.map((p: Json, j: number) => <td key={j}><input className="inp cell" type="number" value={p.amp} onChange={(e) => setIb({ ...ib, initial: ib.initial.map((q: Json, k: number) => (k === j ? { ...q, amp: Number(e.target.value) } : q)) })} />
                ∠<input className="inp cell" type="number" value={p.phase} onChange={(e) => setIb({ ...ib, initial: ib.initial.map((q: Json, k: number) => (k === j ? { ...q, phase: Number(e.target.value) } : q)) })} /></td>)}</tr>
              {ib.trials.map((t: Json, i: number) => <tr key={i}><td>{t.plane} trial</td>
                <td><input className="inp cell" type="number" value={t.weight_g_mm} onChange={(e) => setIb({ ...ib, trials: ib.trials.map((q: Json, k: number) => (k === i ? { ...q, weight_g_mm: Number(e.target.value) } : q)) })} />
                  ∠<input className="inp cell" type="number" value={t.angle_deg} onChange={(e) => setIb({ ...ib, trials: ib.trials.map((q: Json, k: number) => (k === i ? { ...q, angle_deg: Number(e.target.value) } : q)) })} /></td>
                {t.readings.map((p: Json, j: number) => <td key={j}><input className="inp cell" type="number" value={p.amp} onChange={(e) => setIb({ ...ib, trials: ib.trials.map((q: Json, k: number) => (k === i ? { ...q, readings: q.readings.map((x: Json, m: number) => (m === j ? { ...x, amp: Number(e.target.value) } : x)) } : q)) })} />
                  ∠<input className="inp cell" type="number" value={p.phase} onChange={(e) => setIb({ ...ib, trials: ib.trials.map((q: Json, k: number) => (k === i ? { ...q, readings: q.readings.map((x: Json, m: number) => (m === j ? { ...x, phase: Number(e.target.value) } : x)) } : q)) })} /></td>)}</tr>)}
            </tbody></table>
          <button className="btn primary" style={{ marginTop: 8 }} onClick={() => load({ influence: ib })}>Calculate correction weights</button></div>
        <div className="card"><h3>Corrections</h3>
          {inf ? <>
            <table className="t"><thead><tr><th>Plane</th><th>Correction</th></tr></thead><tbody>{inf.corrections.map((q: Json) => <tr key={q.plane}><td>{q.plane}</td><td>{fmt(q.weight_g_mm, 0)} g·mm ∠ {fmt(q.angle_deg, 0)}°</td></tr>)}</tbody></table>
            <table className="t" style={{ marginTop: 8 }}><thead><tr><th>Probe</th><th>Before</th><th>Predicted after</th></tr></thead>
              <tbody>{inf.initial.map((q: Json, i: number) => <tr key={q.probe}><td>{q.probe}</td><td className="n">{fmt(q.amp, 1)}</td><td className="n">{fmt(inf.predicted[i].amp, 2)}</td></tr>)}</tbody></table>
            <div className="row">{inf.corrections.map((q: Json, i: number) => <RotorFace key={i} weights={[{ angle: q.angle_deg, color: "#009E73", size: 12, label: `${fmt(q.weight_g_mm, 0)}` }]}
              vib={{ amp: Math.min(60, inf.predicted[i]?.amp ?? 0), phase: inf.predicted[i]?.phase ?? 0 }} label={q.plane} />)}</div></>
            : <p className="muted">Enter the initial run and one trial run per plane, then calculate.</p>}</div>
      </div>}

      {d && tab === 3 && <div className="grid">
        <div className="card"><h3>Overspeed test (115 % MCS, ≥ 1 min) — record sheet</h3>
          <table className="t"><thead><tr><th>Location</th><th>Diameter before mm</th><th>After mm</th><th>Change µm (radial)</th><th>Allowable µm</th><th>Status</th></tr></thead>
            <tbody>{osm.map((q, i) => { const row = os?.rows?.find((x: Json) => x.location === q.location); return <tr key={q.location}><td>{q.location}</td>
              <td><input className="inp cell" type="number" step="any" value={q.before_mm} onChange={(e) => setOsm(osm.map((x, j) => (j === i ? { ...x, before_mm: e.target.value } : x)))} /></td>
              <td><input className="inp cell" type="number" step="any" value={q.after_mm} onChange={(e) => setOsm(osm.map((x, j) => (j === i ? { ...x, after_mm: e.target.value } : x)))} /></td>
              <td className="n">{row ? fmt(row.radial_change_um, 1) : "–"}</td><td className="n">{os?.allowable_um?.[q.location] ?? "–"}</td><td>{row && <Pill s={row.status} />}</td></tr>; })}</tbody></table>
          <button className="btn primary" style={{ marginTop: 8 }} onClick={() => load({ overspeed_measured: osm.filter((q) => q.before_mm !== "" && q.after_mm !== "").map((q) => ({ location: q.location, before_mm: Number(q.before_mm), after_mm: Number(q.after_mm) })) })}>Evaluate</button></div>
        <div className="card"><h3>Predicted by the 3D FEA {os && <Pill s={os.status} />}</h3>
          {Object.keys(os?.predicted_um ?? {}).length ? <table className="t"><tbody>{Object.entries(os.predicted_um).map(([k, x]) => <tr key={k}><td>{k}</td><td className="n">{fmt(x as number, 2)} µm permanent (radial)</td></tr>)}</tbody></table>
            : <p className="muted">Run the 3D FEA (Impeller FEA validation) to predict the permanent growth; its Spin test tab animates the test.</p>}</div>
      </div>}

      {d && tab === 4 && th && <div className="grid">
        <div className="card"><h3>Impeller thrust (Δp on the eye-seal annulus + momentum)</h3>
          <table className="t"><thead><tr><th>Impeller</th><th>Δp bar</th><th>Eye seal mm</th><th>Thrust kN</th></tr></thead>
            <tbody>{th.impellers.map((q: Json) => <tr key={q.impeller}><td>{q.impeller}</td><td className="n">{fmt(q.dp_bar, 2)}</td><td className="n">{fmt(q.eye_seal_mm, 0)}</td><td className="n">{fmt(q.thrust_kn, 1)}</td></tr>)}</tbody></table></div>
        <div className="card"><h3>Balance and thrust bearing</h3>
          <table className="t"><tbody>{[["Gross impeller thrust (simple / model)", `${fmt(th.gross_simple_kn, 1)} / ${fmt(th.gross_model_kn, 1)} kN`], ["Balance piston", `${fmt(th.balance_piston_kn, 1)} kN`],
            ["Residual / design swing", `${fmt(th.residual_kn, 1)} / ${fmt(th.swing_kn, 1)} kN`], [`Coupling friction (${th.coupling_type})`, `${fmt(th.coupling_friction_kn[0], 1)}–${fmt(th.coupling_friction_kn[1], 1)} kN`],
            ["Bearing load / rating", `${fmt(th.bearing_load_kn, 1)} / ${fmt(th.bearing_rating_kn, 1)} kN`], ["Collar speed", `${fmt(th.collar_speed_m_s, 0)} m/s`],
            ["Max diaphragm Δp", `${fmt(th.max_diaphragm_dp_bar, 2)} bar`]].map(([k, x]) => <tr key={k}><td className="muted">{k}</td><td>{x}</td></tr>)}</tbody></table>
          <table className="t" style={{ marginTop: 8 }}><tbody>{th.checks.map((q: Json) => <tr key={q.check}><td>{q.check}</td><td className="muted">{q.criterion}</td><td className="n">{fmt(q.value, 2)}</td><td><Pill s={q.status} /></td></tr>)}</tbody></table>
          <p className="muted small">Coupling type is set in Torsional train inputs (gear couplings add friction thrust).</p></div>
      </div>}
    </>
  );
}
