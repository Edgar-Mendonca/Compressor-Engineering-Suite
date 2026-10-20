import { useState } from "react";
import { fmt, type Json } from "../api";
import { Plot, SERIES } from "../components/Plot";
import { safeName, saveFrom } from "../files";
import { RotorModel } from "../components/RotorModel";
import { TrainModel } from "../components/TrainModel";
import { SchemaForm } from "../components/SchemaForm";
import { NeedRun, cas, sub, Kpis, Table, Trace, type Ctx } from "./common";

function RDReports({ c, kinds }: { c: Ctx; kinds: [string, string][] }) {
  const [busy, setBusy] = useState("");
  return <div className="row" style={{ margin: "6px 0 12px" }}>{kinds.map(([k, l]) => <button key={k} className="btn primary" disabled={!!busy}
    onClick={async () => { setBusy(k); try { await saveFrom(`/api/${k}/analysis-report.pdf`, { project: c.project, casing: c.casing ?? 0 }, `${safeName(c.project.name)}_${k}_analysis.pdf`); } finally { setBusy(""); } }}>
    {busy === k ? "Building report…" : l}</button>)}
    <span className="muted small">Our report layout: cover and summary, contents, references and assumptions, data, results per bearing case, conclusion, appendices, legend and sign-off (document data on the test pages' Tags & glossary tab).</span></div>;
}

const LAT_TABS: [string, string, string][] = [
  ["model", "Model & bearings", "Rotor model and bearing coefficients used for both bearing cases (min clearance / min oil temperature, max clearance / max oil temperature)."],
  ["map", "Critical speed map", "Where the undamped critical speeds sit against the real bearing stiffness: the intersections are the expected critical speeds."],
  ["unbalance", "Unbalance cases", "API 617-2022 unbalance placed to excite each mode shape (Ua = 2 Ur at mode maxima, coupling unbalance at the overhang)."],
  ["bode", "Response", "Synchronous response at the bearing probes for each unbalance case: peaks are the damped critical speeds."],
  ["afsm", "AF / SM", "Each response peak's amplification factor and its separation margin from the operating range against the API 617 requirement."],
  ["clearance", "Clearance check", "Response scaled by Scc stays below 75 % of the running clearance at every bearing and seal, so the rotor will not rub."],
  ["shapes", "Deflected shapes", "Rotor deflection along the shaft at each critical speed and at maximum continuous speed."],
  ["level1", "Stability Level I", "Margin between the cross-coupling that would destabilise the rotor (Q0) and the aerodynamic cross-coupling expected (QA)."],
  ["level2", "Level II", "Final log decrement of the first forward mode with bearings, eye seals and balance-piston seal: positive damping margin proves stability."],
  ["conclusion", "Conclusion", "Summary of all API 617-2022 lateral checks for both bearing cases."],
];
const pf = (b: boolean | null | undefined) => (b == null ? "–" : b ? "pass" : "FAIL");
const vline = (v: number, color = SERIES[2]) => ({ type: "line", x0: v, x1: v, yref: "paper", y0: 0, y1: 1, line: { color, dash: "dot", width: 1 } });

function LatChips({ items, value, set }: { items: string[]; value: number; set: (i: number) => void }) {
  return <div className="chips" style={{ margin: 0 }}>{items.map((l, i) =>
    <button key={l} className={`chip ${value === i ? "on" : ""}`} onClick={() => set(i)}>{l}</button>)}</div>;
}

export function LateralPage(c: Ctx) {
  const k = cas(c);
  const [tab, setTab] = useState("model");
  const [bc, setBc] = useState(0);
  const [ucase, setUcase] = useState(0);
  if (!k) return <NeedRun results={c.results} />;
  const lat = k.lateral;
  if (!lat.campbell) return <p className="muted">Lateral analysis not available for this run level.</p>;
  const sp = lat.speeds;
  const camp = lat.campbell;
  const cases: Json[] = lat.bearing_cases ?? [];
  const bcase = cases[Math.min(bc, cases.length - 1)];
  const ucs = bcase?.unbalance ?? [];
  const uc = ucs[Math.min(ucase, ucs.length - 1)];
  const st = lat.stability;
  const s2 = lat.stability_api617;
  const z = lat.z_m as number[];
  const vlines = [sp.min_rpm, sp.mcs_rpm, sp.trip_rpm].map((v: number) => vline(v));
  const brgLines = k.rotor.bearing_z_m.map((zb: number) => vline(zb, SERIES[5]));
  const pts = (kind: string, damped: boolean) => {
    const x: number[] = [];
    const y: number[] = [];
    camp.speeds_rpm.forEach((s: number, i: number) => camp.modes[i].forEach((m: Json) => {
      if ((m.whirl === kind || (kind === "backward" && m.whirl === "mixed")) && (m.logdec > 1) === damped) { x.push(s); y.push(m.freq_hz * 60); }
    }));
    return { x, y };
  };
  const caseChips = cases.length > 1 && <LatChips items={cases.map((x) => x.label)} value={bc} set={setBc} />;
  const ucChips = <LatChips items={ucs.map((u: Json) => `Case ${u.case}: ${u.label}`)} value={ucase} set={setUcase} />;
  const info = LAT_TABS.find((t) => t[0] === tab)!;
  return (
    <>
      <h2>Lateral &amp; stability</h2>
      <p className="lead">Finite-element rotor (Timoshenko beams, gyroscopics, speed-dependent bearings) evaluated in the order of an
        API 617-2022 lateral and stability report, for the minimum / average / maximum bearing clearance and oil inlet temperature cases.</p>
      <RDReports c={c} kinds={[["lateral", "Lateral analysis report (PDF)"], ["stability", "Stability analysis report (PDF)"]]} />
      <Kpis items={[["Speed range", `${fmt(sp.min_rpm, 0)}–${fmt(sp.mcs_rpm, 0)} rpm`], ["Trip", `${fmt(sp.trip_rpm, 0)} rpm`],
        ["FCSR (rigid supports)", `${fmt(st.first_critical_rigid_rpm, 0)} rpm`], ["CSR", fmt(st.critical_speed_ratio, 2)],
        ["QA (Σ qA)", s2 ? `${fmt(s2.qa_total_kn_mm, 2)} kN/mm` : `${fmt(st.qa_n_m / 1e6, 2)} MN/m`],
        ["Min δf (Level II)", s2 ? fmt(Math.min(...s2.level2.map((r: Json) => r.delta_f)), 3) : "–"],
        ["Avl", `${fmt(lat.amplitude_limit_um, 1)} µm pk-pk`], ["Overall", lat.conclusion ? (lat.conclusion.pass ? "pass" : "review") : "–"]]} />
      <div className="chips">{LAT_TABS.map(([id, l]) => <button key={id} className={`chip ${tab === id ? "on" : ""}`} onClick={() => setTab(id)}>{l}</button>)}</div>
      <p className="muted">{info[2]}</p>
      {!bcase && tab !== "model" && <p className="muted">API 617-2022 bearing cases not available for this run.</p>}

      {tab === "model" && <>
        <div className="card" style={{ marginBottom: 14 }}><h3>Rotor model — sections to scale (radius exaggerated), impellers, added masses, bearings, close clearances, stations</h3>
          <RotorModel rotor={k.rotor} z={z} cg={lat.mass_properties.cg_m} h={280} /></div>
        <div className="grid">
          <div className="card"><h3>Rotor model</h3>
            <Table rows={k.rotor.sections} cols={[["Section", (s) => s.label], ["z0 mm", (s) => s.z0_m * 1e3, 1], ["z1 mm", (s) => s.z1_m * 1e3, 1],
              ["OD mm", (s) => s.od_m * 1e3, 1], ["ID mm", (s) => s.id_m * 1e3, 1]]} />
            <Table rows={k.rotor.masses} cols={[["Added mass", (m) => m.label], ["z mm", (m) => m.z_m * 1e3, 1], ["kg", (m) => m.mass_kg, 2],
              ["Ip kg·m²", (m) => m.ip_kgm2, 3], ["It kg·m²", (m) => m.it_kgm2, 3]]} />
            <p className="muted">Rotor mass {fmt(lat.mass_properties.mass_kg, 1)} kg · length {fmt(lat.mass_properties.length_m * 1e3, 0)} mm ·
              span {fmt(k.rotor.bearing_span_m * 1e3, 0)} mm · bearing loads {Object.entries(lat.bearing_static_loads_n).map(([l, v]) => `${l} ${fmt(v, 0)} N`).join(", ")}</p>
          </div>
          <div className="card"><h3>Campbell diagram</h3>
            <Plot height={380} data={[
              { ...pts("forward", false), name: "Forward", mode: "markers", marker: { color: SERIES[0], size: 6 } },
              { ...pts("backward", false), name: "Backward", mode: "markers", marker: { color: SERIES[5], size: 6, symbol: "square" } },
              { ...pts("forward", true), name: "Forward (δ > 1)", mode: "markers", marker: { color: SERIES[0], size: 5, opacity: 0.25 } },
              { x: camp.speeds_rpm, y: camp.speeds_rpm, name: "1X", mode: "lines", line: { color: SERIES[3] } },
            ]} layout={{ xaxis: { title: "Rotor speed (rpm)" }, yaxis: { title: "Damped natural frequency (cpm)", range: [0, Math.max(...camp.speeds_rpm) * 2] }, shapes: vlines }} />
          </div>
        </div>
        {cases.map((x) => <div className="card" key={x.key} style={{ marginTop: 14 }}>
          <h3>Bearing coefficients — {x.label} (oil inlet {fmt(x.oil_inlet_c, 1)} °C)</h3>
          <div className="grid">{Object.entries(x.bearing_coefficients).map(([lb, t]: [string, Json]) => <div key={lb}>
            <p className="muted">{lb}: radial clearance {fmt(t.geometry.radial_clearance_um, 1)} µm{t.geometry.preload != null ? `, preload ${fmt(t.geometry.preload, 3)}` : ""}</p>
            <Table rows={t.rows} cols={[["rpm", (r) => r.speed_rpm, 0], ["Kxx MN/m", (r) => r.kxx / 1e6, 1], ["Kxy", (r) => r.kxy / 1e6, 2], ["Kyx", (r) => r.kyx / 1e6, 2],
              ["Kyy", (r) => r.kyy / 1e6, 1], ["Cxx kN·s/m", (r) => r.cxx / 1e3, 1], ["Cxy", (r) => r.cxy / 1e3, 2], ["Cyx", (r) => r.cyx / 1e3, 2], ["Cyy", (r) => r.cyy / 1e3, 1]]} />
          </div>)}</div>
        </div>)}
      </>}

      {tab === "map" && bcase && <>
        {caseChips}
        <div className="grid" style={{ marginTop: 10 }}>
          <div className="card"><h3>Undamped critical speed map — {bcase.label}</h3>
            <Plot height={400} data={[...[0, 1, 2, 3].map((j) => ({ x: lat.undamped_critical_map.k_n_m,
              y: lat.undamped_critical_map.critical_speeds_rpm.map((r: number[]) => r[j]), name: `Mode ${j + 1}`, mode: "lines", line: { color: SERIES[j] } })),
              ...(["kxx", "kyy"] as const).map((kk, i) => ({ x: bcase.stiffness_curve[kk], y: bcase.stiffness_curve.speeds_rpm, name: kk === "kxx" ? "Kxx" : "Kyy",
                mode: "lines+markers", line: { color: SERIES[6], dash: i ? "dash" : "solid" } }))]}
              layout={{ xaxis: { title: "Bearing stiffness (N/m)", type: "log" }, yaxis: { title: "Speed (rpm)", type: "log" },
                shapes: [sp.mcs_rpm, sp.min_rpm].map((v: number) => ({ type: "line", xref: "paper", x0: 0, x1: 1, y0: v, y1: v, line: { color: SERIES[2], dash: "dot" } })) }} />
            <Table rows={bcase.undamped_criticals} cols={[["Mode", (r) => r.mode, 0], ["at Kxx (rpm)", (r) => r.kxx_rpm ?? "–", 0], ["at Kyy (rpm)", (r) => r.kyy_rpm ?? "–", 0]]} />
          </div>
          <div className="card"><h3>First four undamped mode shapes (K = {fmt(bcase.k_at_mcs_n_m / 1e6, 0)} MN/m at MCS)</h3>
            <Plot height={400} data={bcase.undamped_modes.map((m: Json, j: number) => ({ x: z, y: m.shape, name: `Mode ${j + 1}: ${fmt(m.freq_rpm, 0)} rpm`, mode: "lines", line: { color: SERIES[j] } }))}
              layout={{ xaxis: { title: "Axial position z (m)" }, yaxis: { title: "Normalised deflection" }, shapes: brgLines }} />
          </div>
        </div>
        <div className="card" style={{ marginTop: 14 }}><h3>Undamped mode shapes on the rotor model — {bcase.label}</h3>
          <div className="grid">{bcase.undamped_modes.map((m: Json, j: number) => <RotorModel key={j} rotor={k.rotor} z={z} h={190} labels={false}
            modes={[{ shape: m.shape, label: `Mode ${j + 1}: ${fmt(m.freq_rpm, 0)} rpm`, color: SERIES[j] }]} />)}</div>
          <p className="muted small">Animated; open circles are nodal points. Dashed line is the opposite half-cycle.</p></div>
      </>}

      {tab === "unbalance" && bcase && <>
        {caseChips}
        <div className="card" style={{ marginTop: 10 }}><h3>Unbalance cases (API 617-2022 6.8.2.7)</h3>
          <Table rows={ucs.flatMap((u: Json) => u.unbalances.map((x: Json) => ({ ...x, case: u.case, label: u.label })))} cols={[["Case", (r) => `${r.case}: ${r.label}`],
            ["Node", (r) => r.node, 0], ["z mm", (r) => r.z * 1e3, 0], ["W kg", (r) => r.W_kg, 1], ["Unbalance g·mm", (r) => r.g_mm, 1], ["Phase °", (r) => r.phase_deg, 0], ["Basis", (r) => r.basis]]} />
          <p className="muted">Ur = 6350 W/Nmc g·mm (3937 above 25 000 rpm), Ua = 2 Ur; coupling unbalance = 2 × max(63500 W/Nmc, 12.7 W, 72) with W the coupling-half mass.</p>
        </div>
      </>}

      {tab === "bode" && uc && <>
        <div className="row">{caseChips}{ucChips}</div>
        <div className="grid" style={{ marginTop: 10 }}>
          <div className="card"><h3>Amplitude — {bcase.label}, case {uc.case}</h3>
            <Plot height={360} data={Object.entries(uc.bode).map(([l, d]: [string, Json], i) => ({ x: uc.speeds_rpm, y: d.amp_pp_um, name: l, mode: "lines", line: { color: SERIES[i] } }))}
              layout={{ xaxis: { title: "Speed (rpm)" }, yaxis: { title: "Amplitude (µm pk-pk)" }, shapes: vlines }} />
          </div>
          <div className="card"><h3>Phase</h3>
            <Plot height={360} data={Object.entries(uc.bode).map(([l, d]: [string, Json], i) => ({ x: uc.speeds_rpm, y: d.phase_deg, name: l, mode: "lines", line: { color: SERIES[i] } }))}
              layout={{ xaxis: { title: "Speed (rpm)" }, yaxis: { title: "Phase (deg)", range: [-180, 180] }, shapes: vlines }} />
          </div>
        </div>
      </>}

      {tab === "afsm" && bcase && <div className="grid" style={{ marginTop: 10 }}>{cases.map((x) => <div className="card" key={x.key}>
        <h3>Critical speed evaluation — {x.label}</h3>
        <Table rows={x.unbalance.flatMap((u: Json) => u.criticals.map((p: Json) => ({ ...p, case: u.case })))} cols={[["Case", (p) => p.case, 0], ["Location", (p) => p.location],
          ["Critical rpm", (p) => p.speed_rpm, 0], ["AF", (p) => p.af ?? "N/A", 2], ["SM actual %", (p) => p.sm_actual_pct, 2],
          ["SM required %", (p) => p.sm_required_pct ?? "No need", 2], ["Result", (p) => pf(p.pass)]]} />
      </div>)}</div>}

      {tab === "clearance" && uc && <>
        <div className="row">{caseChips}{ucChips}</div>
        <div className="grid" style={{ marginTop: 10 }}>
          <div className="card"><h3>Amax {fmt(uc.amax_um, 2)} µm · Avl {fmt(uc.avl_um, 1)} µm · Scc {fmt(uc.scc, 2)}</h3>
            <Table rows={uc.clearance} cols={[["Station", (s) => s.label], ["Node", (s) => s.node, 0], ["Max Ap µm", (s) => s.ap_um, 2], ["Corrected µm", (s) => s.corrected_um, 2],
              ["75 % clearance µm", (s) => s.limit_um, 1], ["Result", (s) => (s.qualified ? "qualified" : "NOT qualified")]]} />
          </div>
          <div className="card"><h3>Corrected amplitude vs 75 % of clearance</h3>
            <Plot height={360} data={[{ x: uc.clearance.map((s: Json) => s.z_m), y: uc.clearance.map((s: Json) => s.corrected_um), name: "Scc × Ap", mode: "markers", marker: { color: SERIES[0], size: 8 } },
              { x: uc.clearance.map((s: Json) => s.z_m), y: uc.clearance.map((s: Json) => s.limit_um), name: "75 % min clearance", mode: "markers", marker: { color: SERIES[1], size: 8, symbol: "square" } }]}
              layout={{ xaxis: { title: "Axial position z (m)" }, yaxis: { title: "Amplitude (µm pk-pk)" } }} />
          </div>
        </div>
        <p className="muted">Scc = min(6, Avl / Amax), Amax = largest probe response over Nma–Nmc, Avl = 25.4 √(12000/Nmc) µm capped at 25.4 µm.</p>
      </>}

      {tab === "shapes" && uc && <>
        <div className="row">{caseChips}{ucChips}</div>
        <div className="card" style={{ marginTop: 10 }}><h3>Deflected shapes — case {uc.case}</h3>
          <Plot height={380} data={uc.deflected_shapes.map((d: Json, i: number) => ({ x: z, y: d.shape_um, name: `${d.label === "Nmc" ? "Nmc" : "Critical"} ${fmt(d.speed_rpm, 0)} rpm`, mode: "lines", line: { color: SERIES[i % 8] } }))}
            layout={{ xaxis: { title: "Axial position z (m)" }, yaxis: { title: "Response major semi-axis (µm)" }, shapes: brgLines }} />
          <RotorModel rotor={k.rotor} z={z} h={230} modes={uc.deflected_shapes.map((d: Json, i: number) => ({ shape: d.shape_um, label: `${d.label === "Nmc" ? "Nmc" : "Critical"} ${fmt(d.speed_rpm, 0)} rpm`, color: SERIES[i % 8] }))} />
        </div>
      </>}

      {tab === "level1" && s2 && <>
        <Kpis items={[["QA = Σ qA", `${fmt(s2.qa_total_kn_mm, 2)} kN/mm`], ["Avg gas density", `${fmt(s2.avg_gas_density_kg_m3, 2)} kg/m³`],
          ["FCSR", `${fmt(s2.fcsr_rpm, 0)} rpm`], ["CSR = Nmc / FCSR", fmt(s2.csr, 2)]]} />
        <div className="grid">
          <div className="card"><h3>Anticipated cross-coupling per impeller (API 617-2022 6.8.4.7)</h3>
            <Table rows={s2.qa_table} cols={[["Impeller", (r) => r.impeller, 0], ["HP kW", (r) => r.power_kw, 1], ["Dc mm", (r) => r.dc_mm, 0], ["Hc mm", (r) => r.hc_mm, 1],
              ["ρs kg/m³", (r) => r.rho_s, 2], ["ρd kg/m³", (r) => r.rho_d, 2], ["qA kN/mm", (r) => r.qa_kn_mm, 3]]} />
            <p className="muted">qA = HP·Bc·C / (Dc·Hc·Nr) · (ρd/ρs), Bc = 3, C = 9.55, Nr = {fmt(sp.rated_rpm, 0)} rpm; applied at mid-span.</p>
            <Table rows={s2.level1} cols={[["Bearing case", (r) => r.label], ["Q0 kN/mm", (r) => r.q0_kn_mm, 2], ["QA kN/mm", (r) => r.qa_kn_mm, 2], ["Q0/QA", (r) => r.q0_over_qa ?? "–", 2],
              ["δA", (r) => r.delta_a, 3], ["Region", (r) => r.region], ["Level II", (r) => (r.level2_required ? `required (${r.reasons.join(", ")})` : "not required")]]} />
          </div>
          <div className="card"><h3>Stability sensitivity: log dec vs applied cross-coupling</h3>
            <Plot height={360} data={[...s2.level1.map((r: Json, i: number) => ({ x: r.sweep_kn_mm.map((p: number[]) => p[0]), y: r.sweep_kn_mm.map((p: number[]) => p[1]), name: r.label, mode: "lines+markers", line: { color: SERIES[i] } })),
              { x: s2.level1.map(() => s2.qa_total_kn_mm), y: s2.level1.map((r: Json) => r.delta_a), name: "δA at QA", mode: "markers", marker: { size: 10, color: SERIES[3] } }]}
              layout={{ xaxis: { title: "Applied cross-coupling Q (kN/mm)" }, yaxis: { title: "Log decrement, first forward mode" },
                shapes: [{ type: "line", xref: "paper", x0: 0, x1: 1, y0: 0, y1: 0, line: { color: SERIES[7] } }, vline(s2.qa_total_kn_mm, SERIES[3])] }} />
          </div>
          <div className="card"><h3>Level I screening: CSR vs average gas density</h3>
            <Plot height={360} data={[{ x: s2.screening_boundary.map((p: number[]) => p[0]), y: s2.screening_boundary.map((p: number[]) => p[1]), name: "Region A / B boundary", mode: "lines", line: { color: SERIES[6] } },
              { x: [s2.avg_gas_density_kg_m3], y: [s2.csr], name: "This rotor", mode: "markers", marker: { size: 12, color: SERIES[1] } }]}
              layout={{ xaxis: { title: "Average gas density (kg/m³)", range: [0, Math.max(80, s2.avg_gas_density_kg_m3 * 1.3)] }, yaxis: { title: "Critical speed ratio", range: [1, 4] },
                annotations: [{ x: 5, y: 3.8, text: "Region B" }, { x: 5, y: 1.3, text: "Region A" }] }} />
            <p className="muted">Boundary digitised from the API 617 Level I chart — verify against the licensed edition.</p>
          </div>
        </div>
      </>}

      {tab === "level2" && s2 && <>
        {(lat.modes_at_mcs ?? []).find((q: Json) => q.shape && q.whirl !== "backward") && (() => { const q = lat.modes_at_mcs.find((x: Json) => x.shape && x.whirl !== "backward");
          return <div className="card" style={{ marginBottom: 10 }}><h3>First forward damped mode at MCS — {fmt(q.freq_cpm, 0)} cpm, log dec {fmt(q.logdec, 3)}</h3>
            <RotorModel rotor={k.rotor} z={z} h={220} modes={[{ shape: q.shape, label: "Forward whirl", color: "#30a46c" }]} /></div>; })()}
        <div className="card"><h3>Final log decrement (API 617-2022 6.8.4.14)</h3>
          <Table rows={s2.level2} cols={[["Bearing case", (r) => r.label], ["Rotor + bearings δb", (r) => r.delta_b, 3], ["Freq cpm", (r) => r.freq_b_cpm, 0],
            ["+ seals, min seal clr δf", (r) => r.delta_f_min_seal ?? "–", 3], ["Freq cpm", (r) => r.freq_f_min_seal_cpm ?? "–", 0],
            ["+ seals, max seal clr δf", (r) => r.delta_f_max_seal ?? "–", 3], ["Freq cpm", (r) => r.freq_f_max_seal_cpm ?? "–", 0],
            ["+ seals + QA (min clr)", (r) => r.delta_f_qa_min_seal ?? "–", 3],
            [`δf > ${s2.logdec_min_api}`, (r) => pf(r.pass_api)], [`δf > ${s2.logdec_min_dep ?? "(DEP n/a)"}`, (r) => pf(r.pass_dep)]]} />
        </div>
        <div className="grid" style={{ marginTop: 14 }}>
          {(["min", "max"] as const).filter((x) => s2.seal_coefficients[x]).map((x) => <div className="card" key={x}>
            <h3>Seal dynamic coefficients — {x} seal clearance, at MCS</h3>
            <Table rows={s2.seal_coefficients[x]} cols={[["Seal", (r) => r.label], ["Clr mm", (r) => r.radial_clearance_mm, 3], ["Pre-swirl", (r) => r.pre_swirl_ratio, 2],
              ["K MN/m", (r) => r.K / 1e6, 3], ["k MN/m", (r) => r.k / 1e6, 3], ["C kN·s/m", (r) => r.C / 1e3, 3], ["c kN·s/m", (r) => r.c / 1e3, 3]]} />
          </div>)}
          {s2.level2[0]?.vs_speed_min_seal && <div className="card"><h3>First forward mode vs speed (with seals)</h3>
            <Plot height={340} data={[...s2.level2.map((r: Json, i: number) => ({ x: r.vs_speed_min_seal.map((p: Json) => p.speed_rpm), y: r.vs_speed_min_seal.map((p: Json) => p.logdec), name: `δ, ${r.label}`, mode: "lines+markers", line: { color: SERIES[i] } })),
              ...s2.level2.map((r: Json, i: number) => ({ x: r.vs_speed_min_seal.map((p: Json) => p.speed_rpm), y: r.vs_speed_min_seal.map((p: Json) => p.freq_cpm), name: `freq, ${r.label}`, mode: "lines", yaxis: "y2", line: { color: SERIES[i], dash: "dash" } }))]}
              layout={{ xaxis: { title: "Speed (rpm)" }, yaxis: { title: "Log decrement" }, yaxis2: { title: "Damped frequency (cpm)" }, shapes: [vline(sp.mcs_rpm)] }} />
          </div>}
        </div>
        <p className="muted">Seal coefficients are a one-control-volume bulk-flow estimate (swirl brakes set pre-swirl to 0); replace with vendor seal data for design.</p>
      </>}

      {tab === "conclusion" && lat.conclusion && <div className="card">
        <h3>Conclusion: {lat.conclusion.pass ? "all API 617-2022 lateral checks met" : "items need review"}</h3>
        <Table rows={lat.conclusion.items} cols={[["Check", (i) => i.item], ["Result", (i) => pf(i.pass)]]} />
        <p className="muted">Level I failing only means a Level II analysis is required; Level II governs the stability verdict.</p>
      </div>}
      <Trace trace={lat.trace} />
    </>
  );
}

const ok = (p: boolean | null | undefined) => (p == null ? "–" : <span className={`status ${p ? "pass" : "fail"}`}>{p ? "pass" : "fail"}</span>);
const Proves = ({ children }: { children: Json }) => <p className="muted small">{children}</p>;

/** Schematic of the train: motor → coupling → bull gear / pinion → coupling → compressor (or direct drive). */
export function TorsionalPage(c: Ctx) {
  const r = c.results;
  const [m, setM] = useState(0);
  const [ssi, setSsi] = useState(0);
  if (!r) return <NeedRun results={r} />;
  const t = r.torsional;
  if (!t.model) return <p className="muted">Re-run the analysis to see the torsional report.</p>;
  const tr = c.project.train ?? {};
  const md = t.model, modes = t.tnf, cb = t.campbell;
  const comps = md.components.filter((x: Json) => x.kind !== "mesh");
  const stationRotor = md.stations.map((s: Json) => s.rotor);
  const rotorNames = [...new Set<string>(stationRotor)];
  const maxCpm = Math.max(...cb.excitations.map((e: Json) => Math.max(...e.cpm))) * 1.1;
  const vline = (x: number, col: string, dash = "solid") => ({ type: "line", x0: x, x1: x, yref: "paper", y0: 0, y1: 1, line: { color: col, dash, width: 1 } });
  const rangeShapes = [...cb.operating_pct.map((x: number) => vline(x, SERIES[2])), ...cb.margin_pct.map((x: number) => vline(x, SERIES[2], "dash"))];
  const tnfLines = (x1: number) => modes.map((q: Json, i: number) => ({ x: [0, x1], y: [q.freq_cpm, q.freq_cpm], mode: "lines", name: i === 0 ? "TNFs" : `TNF ${q.mode}`,
    showlegend: i === 0, line: { color: "#555", width: 1 } }));
  const ss = t.steady_state[Math.min(ssi, Math.max(t.steady_state.length - 1, 0))];
  const exNames: string[] = t.separation_table[0]?.cells.map((x: Json) => x.excitation) ?? [];
  const setTrain = (k: string, v: Json) => sub(c, "train", { ...tr, [k]: v });
  const scEdit = (key: string) => (tr[key] ?? []).map((row: Json, i: number) => (
    <tr key={i}>{["mk_pu", "alpha_1_s", "omega_x_line", "phase_rad"].map((f) => (
      <td key={f}><input type="number" step="any" value={row[f] ?? 0} style={{ width: 80 }}
        onChange={(e) => setTrain(key, tr[key].map((x: Json, j: number) => (j === i ? { ...x, [f]: Number(e.target.value) } : x)))} /></td>))}</tr>));
  const co = t.conclusion;
  return (
    <>
      <h2>Torsional vibration of the train</h2>
      <p className="lead">Train torsional analysis in the order of an API 617 / API 684 / API 671 vendor report: model, natural frequencies,
        Campbell diagram, mode shapes, separation margins, steady-state resonant stresses and coupling Goodman check, VSD harmonics and
        motor short-circuit transients.</p>
      <RDReports c={c} kinds={[["torsional", "Torsional analysis report (PDF)"]]} />

      <div className="card"><h3>1. Train model</h3>
        <Proves>Shows which rotors, couplings and gear mesh make up the model, with the inertias and stiffnesses that set every result below.</Proves>
        <TrainModel model={md} />
        <div className="grid">
          <Table rows={comps} cols={[["Component", (x) => x.name], ["Speed rpm", (x) => x.speed_rpm, 0], ["Ip kg·m²", (x) => x.ip_kgm2, 3],
            ["K MN·m/rad", (x) => (x.stiffness_nm_rad ?? 0) / 1e6, 3], ["Max transient kN·m", (x) => (x.max_transient_torque_nm ? x.max_transient_torque_nm / 1e3 : "–"), 1],
            ["Allow. alt. kN·m", (x) => (x.allowable_alternating_torque_nm ? x.allowable_alternating_torque_nm / 1e3 : "–"), 2]]} />
          {md.gear && <Table rows={[["Teeth pinion / bull", `${md.gear.pinion_teeth ?? "–"} / ${md.gear.bull_gear_teeth ?? "–"}`], ["Ratio", fmt(md.gear.ratio, 4)],
            ["Module", md.gear.module_mm ? `${md.gear.module_mm} mm` : "estimated"], ["Pressure / helix angle", `${md.gear.pressure_angle_deg}° / ${md.gear.helix_angle_deg}°`],
            ["Pitch Ø pinion / bull", `${fmt(md.gear.pinion_pitch_diameter_mm, 1)} / ${fmt(md.gear.bull_pitch_diameter_mm, 1)} mm`],
            ["Mesh stiffness", `${fmt(md.gear.mesh_stiffness_n_mm / 1e6, 2)}×10⁶ N/mm`], ["Torsional mesh K (bull / pinion)",
              `${fmt(md.gear.mesh_k_bull_nm_rad / 1e6, 0)} / ${fmt(md.gear.mesh_k_pinion_nm_rad / 1e6, 1)} MN·m/rad`]]}
            cols={[["Gear", (x) => x[0]], ["Value", (x) => x[1]]]} />}
        </div>
        <p className="muted small">Rated torque M = 9549·P/N: {Object.entries(md.rated_torque_nm).map(([k, v]: [string, Json]) => `${md.lines[k].label} ${fmt(v / 1e3, 2)} kN·m`).join(" · ")}.
          Coupling stiffness per API 671 with {fmt(tr.coupling_penetration_factor ?? 1 / 3, 2)} shaft penetration.</p>
        <details><summary>Station table ({md.stations.length} stations)</summary>
          <Table rows={md.stations} cols={[["#", (x) => x.station, 0], ["Rotor", (x) => x.rotor], ["x mm", (x) => x.x_mm, 1], ["L mm", (x) => x.length_mm ?? "–", 1],
            ["OD mm", (x) => x.od_mm ?? "–", 1], ["ID mm", (x) => x.id_mm ?? "–", 1], ["Ip kg·m²", (x) => x.ip_kgm2, 4], ["K N·m/rad", (x) => (x.k_nm_rad ? x.k_nm_rad.toExponential(3) : "–")]]} />
        </details>
      </div>

      <div className="card" style={{ marginTop: 14 }}><h3>2. Undamped torsional natural frequencies</h3>
        <Proves>Lists the train's natural frequencies and which components store the vibration energy in each mode.</Proves>
        <Table rows={modes} cols={[["Mode", (x) => x.mode, 0], ["TNF cpm", (x) => x.freq_cpm, 0], ["TNF Hz", (x) => x.freq_hz, 2], ["Main vibrating components", (x) => x.main.join(", ")],
          ...Object.keys(md.lines).map((k) => [`SE share ${md.lines[k].label}`, (x: Json) => `${fmt((x.line_strain_energy[k] ?? 0) * 100, 0)} %`] as [string, (r: Json) => unknown])]} />
      </div>

      <div className="card" style={{ marginTop: 14 }}><h3>3. Campbell diagram</h3>
        <Proves>Shows where TNFs (horizontal) cross shaft-speed and line-frequency excitations inside the operating range ±10 % (vertical lines).</Proves>
        <Plot height={420} data={[...tnfLines(120),
          ...cb.excitations.map((e: Json, i: number) => ({ x: cb.speed_pct, y: e.cpm, name: e.name, mode: "lines", line: { color: SERIES[i % 8], width: 1.5 } }))]}
          layout={{ xaxis: { title: "Speed (% of rated)", range: [0, 120] }, yaxis: { title: "Frequency (cpm)", range: [0, maxCpm] },
            shapes: [...rangeShapes, ...cb.excitations.filter((e: Json) => e.band_cpm).map((e: Json) => ({ type: "rect", x0: 0, x1: 120, y0: e.band_cpm[0], y1: e.band_cpm[1], fillcolor: SERIES[2], opacity: 0.12 }))] }} />
      </div>

      <div className="card" style={{ marginTop: 14 }}><h3>3b. Campbell diagram in absolute values</h3>
        <Proves>The same diagram against compressor speed in rpm and frequency in Hz, as asked for in reviews of vendor reports.</Proves>
        <Plot height={380} data={[...cb.tnf_cpm.map((f: number, i: number) => ({ x: [0, 1.2 * r.sizing.speed_rpm], y: [f / 60, f / 60], name: `TNF ${i + 1}`, mode: "lines", showlegend: false,
          line: { color: "#2b3440", dash: "dash", width: 1 } })),
          ...cb.excitations.map((e: Json, i: number) => ({ x: cb.speed_pct.map((p: number) => p / 100 * r.sizing.speed_rpm), y: e.cpm.map((v: number) => v / 60), name: e.name, mode: "lines", line: { color: SERIES[i % 8], width: 1.5 } }))]}
          layout={{ xaxis: { title: "Compressor speed (rpm)" }, yaxis: { title: "Frequency (Hz)", range: [0, maxCpm / 60] },
            shapes: cb.operating_pct.map((p: number) => ({ type: "line", x0: p / 100 * r.sizing.speed_rpm, x1: p / 100 * r.sizing.speed_rpm, yref: "paper", y0: 0, y1: 1, line: { color: SERIES[2], dash: "dot" } })) }} />
      </div>

      <div className="card" style={{ marginTop: 14 }}><h3>4. Mode shapes</h3>
        <Proves>Normalised physical twist angles; across the gear mesh the signs are opposite and the pinion amplitude is about ratio × the bull gear's.</Proves>
        <div className="chips">{modes.map((q: Json, i: number) => <button key={i} className={`chip ${m === i ? "on" : ""}`} onClick={() => setM(i)}>{`${q.mode}: ${fmt(q.freq_cpm, 0)} cpm`}</button>)}</div>
        <Plot data={rotorNames.map((n, i) => {
          const idx = stationRotor.map((s: string, k: number) => (s === n ? k : -1)).filter((k: number) => k >= 0);
          return { x: idx.map((k: number) => k + 1), y: idx.map((k: number) => modes[m]?.shape[k]), name: n, mode: "lines+markers", line: { color: SERIES[i % 8] }, marker: { size: 3 } };
        })} layout={{ xaxis: { title: "Station" }, yaxis: { title: "Normalised angle", range: [-1.1, 1.1] } }} />
        {modes[m] && <TrainModel model={md} shape={modes[m].shape} label={`Mode ${modes[m].mode}: ${fmt(modes[m].freq_cpm, 0)} cpm`} />}
        <p className="muted small">Strain energy: {Object.entries(modes[m]?.strain_energy ?? {}).filter(([, v]: [string, Json]) => v > 0.01).map(([k, v]: [string, Json]) => `${k} ${fmt(v * 100, 0)} %`).join(" · ")}</p>
      </div>

      <div className="card" style={{ marginTop: 14 }}><h3>5. Interference and separation margins</h3>
        <Proves>Separation margin (TNF − excitation at rated speed) / excitation; inside {fmt(cb.margin_pct[0] - 100, 1)} % … +{fmt(cb.margin_pct[1] - 100, 1)} % a mode interferes, and it is dangerous only when the exciting shaft line participates in its strain energy.</Proves>
        <Table rows={t.separation_table} cols={[["Mode", (x) => x.mode, 0], ["TNF cpm", (x) => x.freq_cpm, 0],
          ...exNames.map((n, j) => [n, (x: Json) => { const q = x.cells[j]; const s = `${fmt(q.margin_pct, 2)} %`;
            return q.interferes ? <span className={`status ${q.dangerous ? "fail" : "attention"}`}>{`${s} ${q.dangerous ? "dangerous" : "safe"}`}</span> : s; }] as [string, (r: Json) => unknown]),
          ["Main components", (x) => x.main.join(", ")]]} />
      </div>

      <div className="card" style={{ marginTop: 14 }}><h3>6. Steady-state resonant response and coupling Goodman check</h3>
        <Proves>At each interference point the train is excited at resonance by {fmt(tr.steady_excitation_pct ?? 1, 1)} % of rated torque (ζ = {tr.steady_state_damping_ratio ?? 0.01}); shaft alternating stress must stay below the allowable and coupling SF = OB/OA ≥ {tr.coupling_min_safety ?? 1.25}.</Proves>
        {t.steady_state.length === 0 ? <p className="muted">No interference point: steady-state stress analysis not required.</p> : <>
          <div className="chips">{t.steady_state.map((x: Json, i: number) => <button key={i} className={`chip ${ssi === i ? "on" : ""}`} onClick={() => setSsi(i)}>{`Mode ${x.mode} · ${x.excitation}`}</button>)}</div>
          <div className="grid">
            <div>
              <Table rows={ss.rotors} cols={[["Rotor", (x) => x.rotor], ["Max shear MPa", (x) => x.max_shear_mpa, 3], ["Allowable MPa", (x) => x.allowable_mpa, 1], ["Station", (x) => x.station, 0], ["Result", (x) => ok(x.pass)]]} />
              <Table rows={ss.couplings} cols={[["Coupling", (x) => x.coupling], ["Alt. torque N·m", (x) => x.alt_torque_nm, 1], ["Allow. alt. N·m", (x) => x.allowable_alt_nm, 0], ["SF", (x) => x.sf, 2], ["Min SF", (x) => x.sf_min, 2], ["Result", (x) => ok(x.pass)]]} />
              <p className="muted small">Allowable τ = τe·(1 − τm/τu)/SF with τe = 0.577·Se·Cs·Cz/Kt (Cs {tr.shaft_surface_factor ?? 0.8}, Cz {tr.shaft_size_factor ?? 0.75}, Kt {tr.shaft_stress_concentration ?? 2}, SF {tr.shaft_fatigue_safety ?? 2}), τu = 0.577·UTS.</p>
            </div>
            <Plot data={ss.couplings.flatMap((q: Json, i: number) => [
              { x: q.goodman.line.map((p: number[]) => p[0] / 1e3), y: q.goodman.line.map((p: number[]) => p[1] / 1e3), mode: "lines", name: `${q.coupling} Goodman line`, line: { color: SERIES[i] } },
              { x: [0, (q.goodman.B?.[0] ?? 0) / 1e3], y: [0, (q.goodman.B?.[1] ?? 0) / 1e3], mode: "lines", name: `O–B (SF ${fmt(q.sf, 2)})`, line: { color: SERIES[i], dash: "dot" } },
              { x: [q.goodman.A[0] / 1e3], y: [q.goodman.A[1] / 1e3], mode: "markers", name: `A ${q.coupling}`, marker: { color: SERIES[i], size: 7 } }])}
              layout={{ xaxis: { title: "Mean torque (kN·m)" }, yaxis: { title: "Alternating torque (kN·m)" } }} />
          </div>
        </>}
      </div>

      {t.vsd && <div className="card" style={{ marginTop: 14 }}><h3>7. VSD harmonic excitation</h3>
        <Proves>Integer harmonics of the motor electrical frequency ({fmt(t.vsd.electrical_hz_rated, 1)} Hz at rated) swept over the acceleration schedule; crossings inside the operating range must give acceptable stress.</Proves>
        <Plot height={420} data={[...tnfLines(120), ...t.vsd.lines.map((h: Json, i: number) => ({ x: cb.speed_pct, y: h.cpm, name: `${h.order}× (${h.pct} %)`, mode: "lines", line: { color: SERIES[i % 8], width: 1 } }))]}
          layout={{ xaxis: { title: `Motor speed (% of rated; 0 → ${fmt(t.vsd.schedule.speed_pct[1], 0)} % in ${fmt(t.vsd.schedule.t_s[1], 0)} s)`, range: [0, 120] },
            yaxis: { title: "Frequency (cpm)", range: [0, (modes[Math.min(5, modes.length - 1)]?.freq_cpm ?? 1e4) * 1.1] }, shapes: rangeShapes }} />
        <div className="grid">
          <Table rows={t.vsd.crossings.filter((x: Json) => x.in_operating_range || x.evaluated)} cols={[["Mode", (x) => x.mode, 0], ["Order", (x) => x.order, 0],
            ["Content %", (x) => x.content_pct, 2], ["Crossing % speed", (x) => x.speed_pct, 1], ["In operating range", (x) => (x.in_operating_range ? "yes" : "no")], ["Evaluated", (x) => (x.evaluated ? "yes" : "no")]]} />
          <Table rows={t.vsd.responses.flatMap((v: Json) => v.rotors.map((q: Json) => ({ ...q, order: v.order, acc: v.acceleration_envelope.rotors.find((a: Json) => a.rotor === q.rotor)?.max_shear_mpa })))}
            cols={[["Order", (x) => x.order, 0], ["Rotor", (x) => x.rotor], ["Max shear (op. range) MPa", (x) => x.max_shear_mpa, 3], ["Max during acceleration MPa", (x) => x.acc, 3], ["Allowable MPa", (x) => x.allowable_mpa, 1], ["Result", (x) => ok(x.pass)]]} />
        </div>
        {t.vsd.responses.length === 0 && <p className="muted small">No harmonic above {fmt(tr.steady_excitation_pct ?? 1, 1)} % of rated torque: covered by the steady-state analysis.</p>}
      </div>}

      {Object.keys(t.short_circuit).length > 0 && <div className="card" style={{ marginTop: 14 }}><h3>8. Short-circuit transients</h3>
        <Proves>Air-gap torque M(t) = Σ Mk·e^(−αk t)·sin(ωk t + φk) at the motor core; peak shaft stress (incl. rated torque) must stay below {tr.transient_yield_fraction ?? 0.7}·Sy/√3 and coupling torque below its maximum transient rating.</Proves>
        {Object.entries(t.short_circuit).map(([name, v]: [string, Json]) => (
          <div key={name} style={{ marginTop: 10 }}><h4>{name}</h4>
            <div className="grid">
              <Plot data={[{ x: v.t_s, y: v.excitation_nm.map((y: number) => y / 1e3), name: "Exciting torque", mode: "lines", line: { color: "#555" } },
                ...v.couplings.map((q: Json, i: number) => ({ x: v.t_s, y: v.series[q.coupling].map((y: number) => y / 1e3), name: q.coupling, mode: "lines", line: { color: SERIES[i] } }))]}
                layout={{ xaxis: { title: "Time (s)" }, yaxis: { title: "Torque (kN·m)" } }} />
              <Plot data={v.rotors.map((q: Json, i: number) => ({ x: v.t_s, y: v.series[q.rotor], name: `${q.rotor} (station ${q.station})`, mode: "lines", line: { color: SERIES[i % 8] } }))}
                layout={{ xaxis: { title: "Time (s)" }, yaxis: { title: "Dynamic shear stress (MPa)" } }} />
            </div>
            <div className="grid">
              <Table rows={v.rotors} cols={[["Rotor", (x) => x.rotor], ["Max dyn. MPa", (x) => x.max_shear_mpa, 1], ["Peak incl. rated MPa", (x) => x.max_total_shear_mpa, 1],
                ["Allowable MPa", (x) => x.allowable_mpa, 1], ["Alt. MPa", (x) => x.alternating_shear_mpa, 1], ["Endurance MPa", (x) => x.endurance_shear_mpa, 1], ["Result", (x) => ok(x.pass)]]} />
              <Table rows={v.couplings} cols={[["Coupling", (x) => x.coupling], ["Max dyn. kN·m", (x) => x.max_torque_nm / 1e3, 2], ["Peak incl. rated kN·m", (x) => x.max_total_torque_nm / 1e3, 2],
                ["Max transient kN·m", (x) => x.allowable_nm / 1e3, 1], ["Result", (x) => ok(x.pass)]]} />
            </div>
          </div>))}
        <details style={{ marginTop: 8 }}><summary>Edit short-circuit torque terms (Mk in × rated torque, ω in × 2π·f)</summary>
          {(["short_circuit_3ph", "short_circuit_2ph"] as const).map((k) => (
            <table key={k} className="t"><thead><tr><th colSpan={4}>{k === "short_circuit_3ph" ? "Three-phase" : "Two-phase"}</th></tr>
              <tr><th>Mk (pu)</th><th>α 1/s</th><th>ω / 2πf</th><th>φ rad</th></tr></thead><tbody>{scEdit(k)}</tbody></table>))}
        </details>
      </div>}

      <div className="card" style={{ marginTop: 14 }}><h3>9. Conclusion</h3>
        <Proves>Summarises whether the train meets the API 617 torsional requirements with the data used.</Proves>
        <ul>{co.text.map((x: string) => <li key={x}>{x}</li>)}</ul>
        <p>Overall: {ok(co.acceptable)}</p>
      </div>

      <div className="card" style={{ marginTop: 14 }}><h3>Train inputs</h3>
        <p className="muted small">Vendor station tables (motor / bull gear / pinion elements), coupling data and harmonic tables can be entered in the project file (train section).</p>
        <SchemaForm schema={c.schema} def="TrainDesign" value={tr} onChange={(v) => sub(c, "train", v)} /></div>
      <Trace trace={t.trace} />
    </>
  );
}

// ------------------------------------------------------------------ systems
