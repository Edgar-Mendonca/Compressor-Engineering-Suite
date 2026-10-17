import { Fragment, useEffect, useMemo, useState } from "react";
import { api, download, fmt, type Json } from "../api";
import { Plot, SERIES } from "../components/Plot";
import { FIELDS, ImpellerFEAView, SectionPlot } from "../components/ImpellerFEAView";
import { RotorView } from "../components/RotorView";
import { SchemaForm } from "../components/SchemaForm";

export type Ctx = {
  schema: Json; project: Json; setProject: (p: Json) => void; results: Json; casing: number; setCasing: (n: number) => void;
  run: (p: Json) => Promise<void>; running: boolean; savedId: number | null; setSavedId: (n: number | null) => void;
  setResults: (r: Json, p: Json) => void;
};

const Disclaimer = () => (
  <div className="notice">Preliminary engineering results for design studies and comparisons. Not a certificate of compliance with
    API 617 / 614 / 692, ISO 15156 or any other standard. Safety-critical conclusions require qualified engineering review.</div>
);

const NeedRun = ({ results }: { results: Json }) => (results ? null : <p className="muted">Run the analysis to see results.</p>);

function Kpis({ items }: { items: [string, string][] }) {
  return (
    <div className="kpis">
      {items.map(([l, v]) => (
        <div className="kpi" key={l}><div className={`v ${v.length > 16 ? "long" : ""}`}>{v}</div><div className="l">{l}</div></div>
      ))}
    </div>
  );
}

function Table({ cols, rows }: { cols: [string, (r: Json) => unknown, number?][]; rows: Json[] }) {
  return (
    <div className="scroll">
      <table className="t">
        <thead><tr>{cols.map(([h]) => <th key={h}>{h}</th>)}</tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {cols.map(([h, f, nd]) => {
                const v = f(r);
                return <td key={h} className={typeof v === "number" ? "n" : ""}>{typeof v === "number" ? fmt(v, nd ?? 1) : (v as string) ?? "–"}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Trace({ trace }: { trace: Json }) {
  if (!trace) return null;
  return (
    <details className="card" style={{ marginTop: 14 }}>
      <summary><strong>Method & assumptions</strong> <span className="muted">— {trace.module}: {trace.method}</span></summary>
      <ul>{trace.assumptions.map((a: string) => <li key={a}>{a}</li>)}</ul>
      {trace.references.length > 0 && <p className="muted">References: {trace.references.join("; ")}</p>}
      {trace.warnings.length > 0 && <ul>{trace.warnings.map((w: string) => <li key={w} className="status attention">{w}</li>)}</ul>}
      <p className="muted">Engine {trace.engine} · v{trace.version} · inputs {trace.inputs_hash}</p>
    </details>
  );
}

const cas = (c: Ctx) => c.results?.casings?.[c.casing] ?? c.results?.casings?.[0];
const sub = (c: Ctx, key: string, v: Json) => c.setProject({ ...c.project, [key]: v });

// ------------------------------------------------------------------ inputs
export function ProjectPage(c: Ctx) {
  const p = c.project;
  return (
    <>
      <h2>Design basis</h2>
      <p className="lead">Define the project and the design basis. Fields left blank (“auto”) are estimated by the
        relevant module and reported in its trace.</p>
      <Disclaimer />
      <div className="card">
        <h3>Project</h3>
        <div className="form">
          <label>Description<input value={p.description} onChange={(e) => sub(c, "description", e.target.value)} /></label>
        </div>
      </div>
      <div className="card" style={{ marginTop: 14 }}>
        <h3>Design basis and limits</h3>
        <SchemaForm schema={c.schema} def="DesignBasis" value={p.design_basis} onChange={(v) => sub(c, "design_basis", v)} />
      </div>
      <div className="card" style={{ marginTop: 14 }}>
        <h3>Acceptance criteria (version-controlled — verify against the specified edition)</h3>
        <SchemaForm schema={c.schema} def="Criteria" value={p.criteria} onChange={(v) => sub(c, "criteria", v)} />
      </div>
    </>
  );
}

export function GasCasesPage(c: Ctx) {
  const p = c.project;
  const [comps, setComps] = useState<Json[]>([]);
  useEffect(() => { api.components().then(setComps).catch(() => undefined); }, []);
  const gas = p.gas.components as Record<string, number>;
  const total = Object.values(gas).reduce((a, b) => a + Number(b || 0), 0);
  const setGas = (g: Record<string, number>) => sub(c, "gas", { ...p.gas, components: g });
  const setCase = (i: number, k: string, v: unknown) => {
    const cases = p.cases.map((x: Json, j: number) => (j === i ? { ...x, [k]: v } : k === "is_design" && v ? { ...x, is_design: false } : x));
    sub(c, "cases", cases);
  };
  const unused = comps.filter((x) => !(x.key in gas));
  const num = (v: string) => (v === "" ? null : parseFloat(v));
  return (
    <>
      <h2>Gas composition & operating cases</h2>
      <p className="lead">Mole composition (normalised automatically), property model and all operating cases. The case
        marked “design” sizes the machine; every case is located on the performance map.</p>
      <div className="grid">
        <div className="card">
          <h3>Composition (mol %) · total {fmt(total, 2)}</h3>
          <table className="t">
            <tbody>
              {Object.entries(gas).map(([k, v]) => (
                <tr key={k}>
                  <td>{comps.find((x) => x.key === k)?.name ?? k}</td>
                  <td><input className="inp" type="number" step="any" value={v} aria-label={`${k} mol %`}
                    onChange={(e) => setGas({ ...gas, [k]: parseFloat(e.target.value || "0") })} /></td>
                  <td><button className="btn" onClick={() => { const g = { ...gas }; delete g[k]; setGas(g); }}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="row" style={{ marginTop: 8 }}>
            <select className="inp" id="addcomp" defaultValue="">
              <option value="" disabled>Add component…</option>
              {unused.map((x) => <option key={x.key} value={x.key}>{x.name}</option>)}
            </select>
            <button className="btn" onClick={() => {
              const el = document.getElementById("addcomp") as HTMLSelectElement;
              if (el.value) setGas({ ...gas, [el.value]: 1 });
            }}>Add</button>
            <label className="muted">Property model{" "}
              <select className="inp" value={p.gas.backend} onChange={(e) => sub(c, "gas", { ...p.gas, backend: e.target.value })}>
                <option value="pr">Peng-Robinson (built-in)</option>
                <option value="coolprop">CoolProp HEOS (reference)</option>
              </select>
            </label>
          </div>
        </div>
        <div className="card">
          <h3>Operating cases</h3>
          <div className="scroll">
            <table className="t">
              <thead><tr><th>Design</th><th>Name</th><th>Ps bara</th><th>Ts °C</th><th>Pd bara</th><th>Flow</th><th>Unit</th>
                <th>ηp (auto)</th><th>Td meas. °C</th><th /></tr></thead>
              <tbody>
                {p.cases.map((x: Json, i: number) => (
                  <tr key={i}>
                    <td><input type="radio" checked={x.is_design} onChange={() => setCase(i, "is_design", true)} aria-label="design case" /></td>
                    <td><input className="inp" style={{ width: 90 }} value={x.name} onChange={(e) => setCase(i, "name", e.target.value)} /></td>
                    {["suction_pressure_bara", "suction_temperature_c", "discharge_pressure_bara", "flow_value"].map((k) => (
                      <td key={k}><input className="inp" style={{ width: 70 }} type="number" step="any" value={x[k]}
                        onChange={(e) => setCase(i, k, parseFloat(e.target.value || "0"))} /></td>
                    ))}
                    <td><select className="inp" value={x.flow_unit} onChange={(e) => setCase(i, "flow_unit", e.target.value)}>
                      {["kg/s", "kg/h", "Am3/h", "Nm3/h", "Sm3/h", "MMSCFD"].map((u) => <option key={u}>{u}</option>)}
                    </select></td>
                    <td><input className="inp" style={{ width: 60 }} type="number" step="any" placeholder="auto" value={x.polytropic_efficiency ?? ""}
                      onChange={(e) => setCase(i, "polytropic_efficiency", num(e.target.value))} /></td>
                    <td><input className="inp" style={{ width: 60 }} type="number" step="any" placeholder="–" value={x.measured_discharge_temperature_c ?? ""}
                      onChange={(e) => setCase(i, "measured_discharge_temperature_c", num(e.target.value))} /></td>
                    <td><button className="btn" disabled={p.cases.length < 2}
                      onClick={() => sub(c, "cases", p.cases.filter((_: Json, j: number) => j !== i))}>×</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="btn" style={{ marginTop: 8 }}
            onClick={() => sub(c, "cases", [...p.cases, { ...p.cases[p.cases.length - 1], name: `Case ${p.cases.length + 1}`, is_design: false }])}>
            Add case</button>
        </div>
      </div>
    </>
  );
}

// ------------------------------------------------------------------ process & aero
export function ThermoPage(c: Ctx) {
  const r = c.results;
  const [chart, setChart] = useState<Json>(null);
  const [env, setEnv] = useState<Json>(null);
  const [prop, setProp] = useState("Z");
  const [busy, setBusy] = useState("");
  const comps = c.project.gas.components;
  useEffect(() => {
    api.thermoChart({ components: comps, backend: c.project.gas.backend, t_min_c: -20, t_max_c: 200,
      pressures_bara: [10, 30, 60, 90, 120] }).then(setChart).catch(() => setChart(null));
  }, [comps, c.project.gas.backend]);
  if (!r) return <NeedRun results={r} />;
  const g = r.gas;
  const st = g.suction_state;
  const props: [string, string][] = [["Z", "Compressibility Z"], ["rho", "Density (kg/m³)"], ["cp", "cp (J/kg K)"], ["k", "cp/cv"],
    ["sound", "Speed of sound (m/s)"], ["mu", "Viscosity (Pa s)"], ["h_kj_kg", "Enthalpy (kJ/kg)"]];
  return (
    <>
      <h2>Thermodynamics</h2>
      <p className="lead">Real-gas properties on the selected equation of state, phase behaviour and compression of every
        operating case (numerical polytropic path, Schultz method for comparison).</p>
      <Kpis items={[["Molecular weight", fmt(g.mw, 2)], ["Z suction", fmt(st.Z, 4)], ["Density suction", `${fmt(st.rho, 2)} kg/m³`],
        ["cp/cv", fmt(st.k, 3)], ["Isentropic exponent", fmt(st.n_s, 3)], ["Speed of sound", `${fmt(st.sound, 0)} m/s`],
        ["HC dew point @ Ps", g.hydrocarbon_dew_point_c === null ? "none found" : `${fmt(g.hydrocarbon_dew_point_c)} °C`],
        ["pH₂S suction", `${fmt(g.ph2s_suction_bar, 3)} bar`]]} />
      <div className="grid">
        <div className="card">
          <h3>Property chart</h3>
          <div className="chips">{props.map(([k, l]) => <button key={k} className={`chip ${prop === k ? "on" : ""}`} onClick={() => setProp(k)}>{l}</button>)}</div>
          {chart && <Plot data={chart.map((s: Json, i: number) => ({ x: s.rows.map((q: Json) => q.T_c), y: s.rows.map((q: Json) => q[prop]),
            name: `${s.P_bara} bara`, mode: "lines", line: { color: SERIES[i] } }))}
            layout={{ xaxis: { title: "Temperature (°C)" }, yaxis: { title: props.find((x) => x[0] === prop)?.[1] } }} />}
        </div>
        <div className="card">
          <h3>Phase envelope</h3>
          {!env && <button className="btn" disabled={!!busy} onClick={async () => {
            setBusy("env");
            try { setEnv(await api.envelope({ components: comps, p_min_bara: 1, p_max_bara: 150, points: 22 })); } finally { setBusy(""); }
          }}>{busy ? "Computing (≈10 s)…" : "Compute phase envelope"}</button>}
          {env && <Plot data={[
            { x: env.dew.map((q: Json) => q.T_c), y: env.dew.map((q: Json) => q.P_bara), name: "Dew points", mode: "markers", marker: { color: SERIES[0], size: 6 } },
            { x: env.bubble.map((q: Json) => q.T_c), y: env.bubble.map((q: Json) => q.P_bara), name: "Bubble points", mode: "markers", marker: { color: SERIES[3], size: 6 } },
            ...r.cases.map((cs: Json, i: number) => ({ x: cs.path.map((q: number[]) => q[0]), y: cs.path.map((q: number[]) => q[1]),
              name: `${cs.case} compression path`, mode: "lines", line: { color: SERIES[(i + 1) % 8], dash: "dot" } })),
          ]} layout={{ xaxis: { title: "Temperature (°C)" }, yaxis: { title: "Pressure (bara)" } }} />}
          {env && <p className="muted">{env.model}</p>}
        </div>
      </div>
      <div className="card" style={{ marginTop: 14 }}>
        <h3>Operating cases on the real-gas model</h3>
        <Table rows={r.cases} cols={[["Case", (x) => x.case], ["PR", (x) => x.pressure_ratio, 3], ["Flow kg/s", (x) => x.mass_flow_kg_s, 2],
          ["Q1 Am³/h", (x) => x.suction_volume_flow_m3_s * 3600, 0], ["Hp kJ/kg", (x) => x.polytropic_head_j_kg / 1e3],
          ["Hs kJ/kg", (x) => x.isentropic_head_j_kg / 1e3], ["ηp", (x) => x.polytropic_efficiency, 3], ["ηs", (x) => x.isentropic_efficiency, 3],
          ["ηp Schultz", (x) => x.schultz.eta_p, 3], ["Td °C", (x) => x.discharge.T - 273.15], ["Td isen. °C", (x) => x.isentropic_discharge_temperature_c],
          ["Z2", (x) => x.discharge.Z, 4], ["Gas kW", (x) => x.gas_power_kw, 0], ["Shaft kW", (x) => x.shaft_power_kw, 0]]} />
      </div>
      <Trace trace={r.cases[0]?.trace} />
    </>
  );
}

export function CompressorPage(c: Ctx) {
  const r = c.results;
  const [view, setView] = useState<"head" | "pressure_ratio" | "eta_p" | "power_kw">("head");
  if (!r) return <NeedRun results={r} />;
  const sz = r.sizing;
  const pm = r.performance_map;
  const key = view === "head" ? "head_kj_kg" : view;
  const ylab: Record<string, string> = { head: "Polytropic head (kJ/kg)", pressure_ratio: "Pressure ratio", eta_p: "Polytropic efficiency", power_kw: "Power (kW)" };
  const opKey: Record<string, string> = { head: "head_kj_kg", pressure_ratio: "", eta_p: "eta_p", power_kw: "power_kw" };
  const ops = r.operating_points.filter((o: Json) => o.q_am3_h);
  return (
    <>
      <h2>Compressor selection & aerodynamic performance</h2>
      <p className="lead">Type selection, preliminary sizing (stages, speed, diameter, sections and casings), stage design and
        the stage-stacked performance map with surge and stonewall limits.</p>
      <Kpis items={[["Configuration", sz.configuration], ["Recommended type", sz.type_selection.recommended],
        ["Speed", `${fmt(sz.speed_rpm, 0)} rpm`], ["Impeller D2", `${fmt(sz.impeller_diameter_m * 1e3, 0)} mm`],
        ["Tip speed", `${fmt(sz.tip_speed_m_s, 1)} m/s`], ["Machine Mach", fmt(sz.machine_mach, 3)],
        ["Polytropic head", `${fmt(sz.polytropic_head_total_j_kg / 1e3, 1)} kJ/kg`], ["ηp overall", fmt(sz.polytropic_efficiency_overall, 3)],
        ["Shaft power", `${fmt(sz.shaft_power_kw, 0)} kW`], ["Driver rating", `${fmt(sz.driver_rating_kw, 0)} kW`],
        ["Specific speed Ns", fmt(sz.specific_speed, 3)], ["Specific diameter Ds", fmt(sz.specific_diameter, 2)]]} />
      <div className="card">
        <h3>Performance map</h3>
        <div className="chips">{(["head", "pressure_ratio", "eta_p", "power_kw"] as const).map((v) =>
          <button key={v} className={`chip ${view === v ? "on" : ""}`} onClick={() => setView(v)}>{ylab[v]}</button>)}</div>
        <Plot height={420} data={[
          ...pm.lines.map((l: Json, i: number) => ({ x: l.points.map((p: Json) => p.q_am3_h), y: l.points.map((p: Json) => p[key]),
            mode: "lines", name: `${fmt(l.speed_frac * 100, 0)} % (${fmt(l.speed_rpm, 0)} rpm)`, line: { color: SERIES[0], width: 1.2 + 0.4 * (i % 2) } })),
          { x: pm.surge_line.map((p: Json) => p.q_am3_h), y: pm.surge_line.map((p: Json) => p[key]), name: "Surge limit", mode: "lines",
            line: { color: SERIES[3], width: 2.2 } },
          { x: pm.stonewall_line.map((p: Json) => p.q_am3_h), y: pm.stonewall_line.map((p: Json) => p[key]), name: "Stonewall", mode: "lines",
            line: { color: SERIES[5], dash: "dash" } },
          ...(opKey[view] ? [{ x: ops.map((o: Json) => o.q_am3_h), y: ops.map((o: Json) => o[opKey[view]]), text: ops.map((o: Json) => o.case),
            mode: "markers+text", textposition: "top right", name: "Operating cases", marker: { color: SERIES[1], size: 10 } }] : []),
        ]} layout={{ xaxis: { title: "Suction volume flow (Am³/h)" }, yaxis: { title: ylab[view] } }} />
      </div>
      <div className="grid" style={{ marginTop: 14 }}>
        <div className="card">
          <h3>Operating cases on the map</h3>
          <Table rows={r.operating_points} cols={[["Case", (o) => o.case], ["Speed %", (o) => (o.speed_frac ?? NaN) * 100],
            ["rpm", (o) => o.speed_rpm, 0], ["ηp", (o) => o.eta_p, 3], ["Pd bara", (o) => o.discharge_bara, 2], ["Td °C", (o) => o.discharge_c],
            ["Power kW", (o) => o.power_kw, 0], ["Surge margin %", (o) => (o.surge_margin ?? NaN) * 100],
            ["Notes", (o) => (o.notes ?? []).join("; ") || (o.feasible ? "ok" : "")]]} />
        </div>
        <div className="card">
          <h3>Compressor type screening</h3>
          <p>Suction flow {fmt(sz.type_selection.suction_flow_am3_h, 0)} Am³/h → <strong>{sz.type_selection.recommended}</strong></p>
          <Table rows={Object.entries(sz.type_selection.ranges_am3_h)} cols={[["Type", (x) => x[0]],
            ["From Am³/h", (x) => x[1][0], 0], ["To Am³/h", (x) => x[1][1], 0]]} />
          {sz.type_selection.notes.map((n: string) => <p key={n} className="muted">{n}</p>)}
        </div>
      </div>
      <div className="card" style={{ marginTop: 14 }}>
        <h3>Stage-by-stage design</h3>
        <Table rows={sz.stages} cols={[["Stage", (s) => String(s.index + 1)], ["Section", (s) => String(s.section + 1)], ["φ", (s) => s.phi, 4],
          ["ψ", (s) => s.psi, 3], ["ηp", (s) => s.eta, 3], ["Q in m³/s", (s) => s.Q_in_m3_s, 3], ["P in", (s) => s.P_in_bara, 2],
          ["P out", (s) => s.P_out_bara, 2], ["T in °C", (s) => s.T_in_c], ["T out °C", (s) => s.T_out_c], ["Power kW", (s) => s.power_kw, 0]]} />
      </div>
      <Trace trace={sz.trace} />
      <Trace trace={pm.trace} />
    </>
  );
}

// ------------------------------------------------------------------ mechanical
function ImpellerFEA({ fea }: { fea: Json }) {
  const [sel, setSel] = useState(0);
  const [field, setField] = useState("von_mises_mpa");
  const f = fea.impellers[Math.min(sel, fea.impellers.length - 1)];
  return (
    <section className="card accent" style={{ marginTop: 14 }}>
      <div className="row"><h3 style={{ margin: 0 }}>Impeller FEA — axisymmetric model, 3D result view</h3>
        <div className="chips" style={{ margin: 0 }}>{fea.impellers.map((x: Json, i: number) =>
          <button key={i} className={`chip ${sel === i ? "on" : ""}`} onClick={() => setSel(i)}>Impeller {x.impeller}</button>)}</div></div>
      <Kpis items={[["Peak σvm at MCS", `${fmt(f.max_vm_mcs_mpa, 0)} MPa`], ["Peak σvm at 115 %", `${fmt(f.max_vm_overspeed_mpa, 0)} MPa`],
        ["Yield use MCS / 115 %", `${fmt(f.yield_utilisation_mcs, 2)} / ${fmt(f.yield_utilisation_overspeed, 2)}`],
        ["Tip radial growth", `${fmt(f.tip_radial_growth_um, 0)} µm`], ["Eye growth / axial shift", `${fmt(f.eye_radial_growth_um, 0)} / ${fmt(f.eye_axial_shift_um, 0)} µm`],
        ["Mesh", `${f.elements} elements · ${f.nodes} nodes`]]} />
      <div className="grid">
        <ImpellerFEAView key={sel} fea={f} />
        <div>
          <div className="chips">{FIELDS.slice(0, 5).map(([k, l]) => <button key={k} className={`chip ${field === k ? "on" : ""}`} onClick={() => setField(k)}>{l}</button>)}</div>
          <SectionPlot model={f.model} field={field} caseName="MCS" />
          <p className="muted">Meridional section at MCS ({f.elements} quads; hover an element for its value). Range {fmt(Math.min(...f.model.cases.MCS[field]), 0)}–{fmt(Math.max(...f.model.cases.MCS[field]), 0)}.</p>
          <p className="muted">Eye growth and axial shift feed the eye-seal clearance check; blade stresses need a 3D cyclic-sector model.</p>
        </div>
      </div>
    </section>
  );
}

export function ImpellerPage(c: Ctx) {
  const k = cas(c);
  const [sel, setSel] = useState(0);
  if (!k) return <NeedRun results={c.results} />;
  const imps = k.impellers.impellers;
  const st = k.impeller_stress.impellers;
  const d = st[Math.min(sel, st.length - 1)].mcs;
  return (
    <>
      <h2>Impeller geometry & stress</h2>
      <p className="lead">Impeller dimensions, blade configuration, mass and inertia, centrifugal and thermal stress
        (axisymmetric rotating-disk FE) and axial thrust.</p>
      <div className="card">
        <Table rows={imps} cols={[["Imp.", (i) => String(i.index + 1)], ["D2 mm", (i) => i.D2_mm, 0], ["b2 mm", (i) => i.b2_mm],
          ["b2/D2", (i) => i.b2_D2, 4], ["Eye mm", (i) => i.D1_eye_mm, 0], ["Hub mm", (i) => i.hub_mm, 0], ["Blades", (i) => String(i.blades)],
          ["Slip σ", (i) => i.slip_factor, 3], ["Work coeff.", (i) => i.work_coefficient, 3], ["W1 tip m/s", (i) => i.inlet_w1_tip_m_s, 0],
          ["Mrel1", (i) => i.inlet_relative_mach, 3], ["Mass kg", (i) => i.mass_kg], ["Ip kg·m²", (i) => i.ip_kgm2, 3],
          ["It kg·m²", (i) => i.it_kgm2, 3], ["Thrust kN", (i) => i.thrust_n / 1e3, 2], ["Umax mat. m/s", (i) => i.max_tip_speed_for_material_m_s, 0]]} />
      </div>
      <div className="grid" style={{ marginTop: 14 }}>
        <div className="card">
          <h3>Disk stress at MCS</h3>
          <div className="chips">{st.map((s: Json, i: number) => <button key={i} className={`chip ${sel === i ? "on" : ""}`} onClick={() => setSel(i)}>Impeller {s.impeller}</button>)}</div>
          <Plot data={[
            { x: d.r_m.map((x: number) => x * 1e3), y: d.sigma_t_pa.map((x: number) => x / 1e6), name: "Tangential", mode: "lines" },
            { x: d.r_m.map((x: number) => x * 1e3), y: d.sigma_r_pa.map((x: number) => x / 1e6), name: "Radial", mode: "lines" },
            { x: d.r_m.map((x: number) => x * 1e3), y: d.von_mises_pa.map((x: number) => x / 1e6), name: "von Mises", mode: "lines" },
          ]} layout={{ xaxis: { title: "Radius (mm)" }, yaxis: { title: "Stress (MPa)" } }} />
        </div>
        <div className="card">
          <h3>Stress summary</h3>
          <Table rows={st} cols={[["Imp.", (s) => String(s.impeller)], ["σvm MCS MPa", (s) => s.max_vm_mcs_mpa, 0],
            ["σvm 115 % MPa", (s) => s.max_vm_overspeed_mpa, 0], ["σθ avg 115 % MPa", (s) => s.avg_tangential_overspeed_mpa, 0],
            ["avg / 0.9 Sy", (s) => s.overspeed_average_ratio, 2], ["Burst rpm", (s) => s.burst_speed_rpm, 0], ["Burst margin", (s) => s.burst_margin, 2],
            ["Tip growth µm", (s) => s.tip_growth_um, 0]]} />
        </div>
      </div>
      {k.impeller_fea && <ImpellerFEA fea={k.impeller_fea} />}
      <Trace trace={k.impellers.trace} />
      <Trace trace={k.impeller_stress.trace} />
      {k.impeller_fea && <Trace trace={k.impeller_fea.trace} />}
    </>
  );
}

export function RotorPage(c: Ctx) {
  const k = cas(c);
  const [mode, setMode] = useState(-1);
  if (!k) return <NeedRun results={c.results} />;
  const rot = k.rotor;
  const sh = k.shaft;
  const lat = k.lateral;
  const fw = (lat.modes_at_mcs ?? []).filter((m: Json) => m.whirl === "forward" && m.shape);
  const modeShape = mode >= 0 && fw[mode] ? { z: lat.z_m, shape: fw[mode].shape } : null;
  const scene = c.results.scene;
  const mp = k.mass_properties;
  return (
    <>
      <h2>Rotor assembly & shaft design</h2>
      <p className="lead">Parametric stepped shaft with impellers, balance piston, seals, journals, thrust collar and
        coupling; mass properties, thrust balance, stresses, fatigue and deflection. Override the geometry in the shaft inputs below.</p>
      <Kpis items={[["Rotor mass", `${fmt(mp.mass_kg, 0)} kg`], ["Centre of gravity", `${fmt(mp.cg_m * 1e3, 0)} mm`],
        ["Ip / It(cg)", `${fmt(mp.ip_kgm2, 2)} / ${fmt(mp.it_cg_kgm2, 1)} kg·m²`], ["Bearing span", `${fmt(rot.bearing_span_m * 1e3, 0)} mm`],
        ["Span / D", fmt(rot.span_to_diameter, 2)], ["Shaft at impellers", `${fmt(rot.shaft_diameter_impellers_m * 1e3, 0)} mm`],
        ["Journal", `${fmt(rot.journal_diameter_m * 1e3, 0)} mm`], ["Torque", `${fmt(rot.casing_torque_nm, 0)} N·m`],
        ["Balance piston", `${fmt(rot.balance_piston_diameter_m * 1e3, 0)} mm`], ["Residual thrust", `${fmt(rot.thrust.residual_n / 1e3, 1)} kN`],
        ["Min fatigue SF", fmt(sh.min_fatigue_safety, 2)], ["Mid-span sag", `${fmt(sh.midspan_sag_um, 1)} µm`]]} />
      <div className="card">
        <div className="row" style={{ marginBottom: 8 }}>
          <h3 style={{ margin: 0 }}>3D rotor</h3>
          <div className="chips" style={{ margin: 0 }}>
            <button className={`chip ${mode < 0 ? "on" : ""}`} onClick={() => setMode(-1)}>Static</button>
            {fw.slice(0, 4).map((m: Json, i: number) => <button key={i} className={`chip ${mode === i ? "on" : ""}`} onClick={() => setMode(i)}>
              Mode {i + 1}: {fmt(m.freq_cpm, 0)} cpm, δ {fmt(m.logdec, 2)}</button>)}
          </div>
        </div>
        {scene && <RotorView scene={scene} mode={modeShape} />}
        <p className="muted">Drag to orbit, scroll to zoom. Mode animation shows forward whirl of the damped mode shape at MCS (amplitude exaggerated).</p>
      </div>
      <div className="grid" style={{ marginTop: 14 }}>
        <div className="card">
          <h3>Bending moment & torque</h3>
          <Plot data={[
            { x: sh.moment_diagram.z_m, y: sh.moment_diagram.moment_nm, name: "Gravity bending moment (N·m)", mode: "lines" },
            { x: sh.moment_diagram.z_m, y: sh.moment_diagram.torque_nm, name: "Torque (N·m)", mode: "lines", yaxis: "y2" },
          ]} layout={{ xaxis: { title: "z (m)" }, yaxis: { title: "Moment (N·m)" }, yaxis2: { overlaying: "y", side: "right", title: "Torque (N·m)" } }} />
        </div>
        <div className="card">
          <h3>Shaft safety factors</h3>
          <Plot data={[
            { x: sh.points.map((p: Json) => p.z_m), y: sh.points.map((p: Json) => p.fatigue_safety), name: "Fatigue (DE-Goodman)", mode: "markers+lines" },
            { x: sh.points.map((p: Json) => p.z_m), y: sh.points.map((p: Json) => Math.min(p.yield_safety, 100)), name: "Yield (transient torque)", mode: "markers+lines" },
          ]} layout={{ xaxis: { title: "z (m)" }, yaxis: { title: "Safety factor", type: "log" },
            shapes: [{ type: "line", xref: "paper", x0: 0, x1: 1, y0: 1.5, y1: 1.5, line: { color: SERIES[3], dash: "dash" } }] }} />
        </div>
      </div>
      <div className="grid" style={{ marginTop: 14 }}>
        <div className="card">
          <h3>Shaft sections</h3>
          <Table rows={rot.sections} cols={[["Section", (s) => s.label], ["z0 mm", (s) => s.z0_m * 1e3, 0], ["z1 mm", (s) => s.z1_m * 1e3, 0],
            ["OD mm", (s) => s.od_m * 1e3, 0], ["ID mm", (s) => s.id_m * 1e3, 0]]} />
        </div>
        <div className="card">
          <h3>Attached masses</h3>
          <Table rows={rot.masses} cols={[["Item", (m) => m.label], ["z mm", (m) => m.z_m * 1e3, 0], ["Mass kg", (m) => m.mass_kg],
            ["Ip kg·m²", (m) => m.ip_kgm2, 3], ["It kg·m²", (m) => m.it_kgm2, 3]]} />
        </div>
      </div>
      <div className="card" style={{ marginTop: 14 }}>
        <h3>Stress at shoulders and sections</h3>
        <Table rows={sh.points} cols={[["z mm", (p) => p.z_m * 1e3, 0], ["Type", (p) => p.kind], ["d mm", (p) => p.d_mm, 0], ["Kt b", (p) => p.kt_bending, 2],
          ["Kf", (p) => p.kf, 2], ["M N·m", (p) => p.moment_nm, 0], ["T N·m", (p) => p.torque_nm, 0], ["σb MPa", (p) => p.bending_mpa, 2],
          ["τ MPa", (p) => p.torsion_mpa, 1], ["σvm MPa", (p) => p.von_mises_mpa, 1], ["Se MPa", (p) => p.Se_mpa, 0],
          ["SF fatigue", (p) => p.fatigue_safety, 2], ["SF yield", (p) => p.yield_safety, 2]]} />
      </div>
      <div className="card" style={{ marginTop: 14 }}>
        <h3>Shaft design inputs</h3>
        <SchemaForm schema={c.schema} def="ShaftDesign" value={c.project.shaft} onChange={(v) => sub(c, "shaft", v)} />
      </div>
      <Trace trace={rot.trace} />
      <Trace trace={sh.trace} />
    </>
  );
}

export function BearingsSealsPage(c: Ctx) {
  const k = cas(c);
  const [coef, setCoef] = useState<"k" | "c">("k");
  if (!k) return <NeedRun results={c.results} />;
  const brg = k.bearings.bearings;
  const seals = k.seals;
  const cond = seals.end_seals.conditioning;
  const traces: Json[] = [];
  Object.entries(brg).forEach(([label, b]: [string, Json], i) => {
    const keys = coef === "k" ? ["kxx", "kyy", "kxy", "kyx"] : ["cxx", "cyy", "cxy", "cyx"];
    keys.forEach((kk, j) => traces.push({ x: b.speeds_rpm, y: b.rows.map((r: Json) => r[kk]), name: `${label} ${kk}`, mode: "lines+markers",
      line: { color: SERIES[j], dash: i ? "dot" : "solid" } }));
  });
  return (
    <>
      <h2>Bearings & seals</h2>
      <p className="lead">Hydrodynamic journal bearings (short-bearing Reynolds solution with pad equilibrium),
        thrust bearing, labyrinths, balance piston, aerodynamic cross-coupling and dry-gas-seal gas conditioning.</p>
      <div className="grid">
        <div className="card">
          <h3>Bearing dynamic coefficients vs speed</h3>
          <div className="chips">
            <button className={`chip ${coef === "k" ? "on" : ""}`} onClick={() => setCoef("k")}>Stiffness (N/m)</button>
            <button className={`chip ${coef === "c" ? "on" : ""}`} onClick={() => setCoef("c")}>Damping (N·s/m)</button>
          </div>
          <Plot data={traces} layout={{ xaxis: { title: "Speed (rpm)" }, yaxis: { title: coef === "k" ? "Stiffness (N/m)" : "Damping (N·s/m)" } }} />
        </div>
        <div className="card">
          <h3>Bearing performance at MCS</h3>
          <Table rows={Object.entries(k.bearing_rated)} cols={[["Bearing", (x) => x[0]], ["Load N", (x) => x[1].load_n, 0],
            ["Unit load MPa", (x) => x[1].unit_load_mpa, 2], ["U m/s", (x) => x[1].surface_speed_m_s, 0], ["ε", (x) => x[1].eccentricity, 3],
            ["hmin µm", (x) => x[1].h_min_m * 1e6, 1], ["Loss kW", (x) => x[1].power_loss_kw, 1], ["Oil L/min", (x) => x[1].oil_flow_l_min, 0],
            ["Babbitt °C (est.)", (x) => x[1].babbitt_temperature_est_c, 0]]} />
          <h3 style={{ marginTop: 12 }}>Thrust bearing</h3>
          <Table rows={[k.rotor.thrust]} cols={[["Gross kN", (t) => t.gross_impeller_n / 1e3, 1], ["Piston kN", (t) => t.balance_piston_n / 1e3, 1],
            ["Residual kN", (t) => t.residual_n / 1e3, 1], ["Design load kN", (t) => t.thrust_bearing_load_n / 1e3, 1],
            ["Collar mm", (t) => t.collar_diameter_m * 1e3, 0]]} />
        </div>
      </div>
      <div className="grid" style={{ marginTop: 14 }}>
        <div className="card">
          <h3>Labyrinths and aerodynamic cross-coupling</h3>
          <Table rows={seals.labyrinths} cols={[["Stage", (x) => String(x.stage)], ["Eye Ø mm", (x) => x.eye_diameter_mm, 0],
            ["Clearance mm", (x) => x.eye_clearance_mm, 3], ["Eye leak %", (x) => x.eye_leakage_pct, 2], ["Interstage kg/s", (x) => x.interstage_leakage_kg_s, 3],
            ["Wachel q MN/m", (x) => x.wachel_q_n_m / 1e6, 3]]} />
          <p>Balance piston Ø {fmt(seals.balance_piston.diameter_mm, 0)} mm · leakage {fmt(seals.balance_piston.leakage_pct, 2)} % ·
            total Qa {fmt(seals.total_wachel_q_n_m / 1e6, 2)} MN/m</p>
        </div>
        <div className="card">
          <h3>Shaft-end seals: {String(seals.end_seals.type).replace(/_/g, " ")}</h3>
          {cond ? (
            <Table rows={[
              ["Seal pressure", `${fmt(seals.end_seals.seal_pressure_bara, 2)} bara`],
              ["Primary leakage per seal", `${fmt(seals.end_seals.primary_leakage_nm3_h_per_seal, 1)} Nm³/h`],
              ["Seal gas supply (total)", `${fmt(seals.end_seals.seal_gas_supply_nm3_h_total, 0)} Nm³/h`],
              ["Hydrocarbon dew point at supply", `${fmt(cond.hydrocarbon_dew_point_c)} °C`],
              ["Supply temperature", `${fmt(cond.supply_temperature_c)} °C`],
              ["Temperature after expansion (JT)", `${fmt(cond.temperature_after_expansion_c)} °C`],
              ["Superheat margin", `${fmt(cond.superheat_margin_c)} °C`],
              ["Heater required", cond.heater_required ? "yes" : "no"],
              ["Condensation risk after expansion", cond.condensation_risk_after_expansion ? "yes" : "no"],
            ]} cols={[["Item", (x) => x[0]], ["Value", (x) => x[1]]]} />
          ) : <p className="muted">No dry gas seal conditioning for this seal type.</p>}
        </div>
      </div>
      <div className="grid" style={{ marginTop: 14 }}>
        <div className="card"><h3>Bearing inputs</h3>
          <SchemaForm schema={c.schema} def="BearingDesign" value={c.project.bearings} onChange={(v) => sub(c, "bearings", v)} /></div>
        <div className="card"><h3>Seal inputs</h3>
          <SchemaForm schema={c.schema} def="SealDesign" value={c.project.seals} onChange={(v) => sub(c, "seals", v)} /></div>
      </div>
      <Trace trace={k.bearings.trace} />
      <Trace trace={seals.trace} />
    </>
  );
}

// ------------------------------------------------------------------ dynamics
export function LateralPage(c: Ctx) {
  const k = cas(c);
  const [ucase, setUcase] = useState(0);
  if (!k) return <NeedRun results={c.results} />;
  const lat = k.lateral;
  if (!lat.campbell) return <p className="muted">Lateral analysis not available for this run level.</p>;
  const sp = lat.speeds;
  const camp = lat.campbell;
  const pts = (kind: string, damped: boolean) => {
    const x: number[] = [];
    const y: number[] = [];
    const t: string[] = [];
    camp.speeds_rpm.forEach((s: number, i: number) => camp.modes[i].forEach((m: Json) => {
      if ((m.whirl === kind || (kind === "backward" && m.whirl === "mixed")) && (m.logdec > 1) === damped) {
        x.push(s); y.push(m.freq_hz * 60); t.push(`log dec ${fmt(m.logdec, 3)}`);
      }
    }));
    return { x, y, text: t };
  };
  const vlines = [["Min", sp.min_rpm], ["MCS", sp.mcs_rpm], ["Trip", sp.trip_rpm]].map(([, v]) =>
    ({ type: "line", x0: v, x1: v, yref: "paper", y0: 0, y1: 1, line: { color: SERIES[2], dash: "dot", width: 1 } }));
  const uc = lat.unbalance_cases[Math.min(ucase, lat.unbalance_cases.length - 1)];
  const st = lat.stability;
  return (
    <>
      <h2>Lateral rotordynamics</h2>
      <p className="lead">Finite-element rotor (Timoshenko beams, gyroscopics, speed-dependent bearings), Campbell diagram,
        undamped critical-speed map, unbalance response with API 617-style amplification factor / separation margin / amplitude
        checks, and Level I stability with modified-Wachel cross-coupling.</p>
      <Kpis items={[["Speed range", `${fmt(sp.min_rpm, 0)}–${fmt(sp.mcs_rpm, 0)} rpm`], ["Trip", `${fmt(sp.trip_rpm, 0)} rpm`],
        ["1st critical (rigid supports)", `${fmt(st.first_critical_rigid_rpm, 0)} rpm`], ["Critical speed ratio", fmt(st.critical_speed_ratio, 2)],
        ["Qa (Wachel)", `${fmt(st.qa_n_m / 1e6, 2)} MN/m`], ["Q0 (zero log dec)", st.q0_n_m ? `${fmt(st.q0_n_m / 1e6, 2)} MN/m` : "> range"],
        ["Log dec, no Qa", fmt(st.logdec_no_qa, 3)], ["Log dec with Qa", fmt(st.logdec_with_qa, 3)],
        ["Level I", st.level1_pass ? "pass" : "Level II required"], ["Amplitude limit", `${fmt(lat.amplitude_limit_um, 1)} µm pk-pk`]]} />
      <div className="grid">
        <div className="card">
          <h3>Campbell diagram</h3>
          <Plot height={380} data={[
            { ...pts("forward", false), name: "Forward", mode: "markers", marker: { color: SERIES[0], size: 6 } },
            { ...pts("backward", false), name: "Backward", mode: "markers", marker: { color: SERIES[5], size: 6, symbol: "square" } },
            { ...pts("forward", true), name: "Forward (δ > 1)", mode: "markers", marker: { color: SERIES[0], size: 5, opacity: 0.25 } },
            { ...pts("backward", true), name: "Backward (δ > 1)", mode: "markers", marker: { color: SERIES[5], size: 5, opacity: 0.25, symbol: "square" } },
            { x: camp.speeds_rpm, y: camp.speeds_rpm, name: "1X", mode: "lines", line: { color: SERIES[3] } },
          ]} layout={{ xaxis: { title: "Rotor speed (rpm)" }, yaxis: { title: "Damped natural frequency (cpm)", range: [0, Math.max(...camp.speeds_rpm) * 2] }, shapes: vlines }} />
        </div>
        <div className="card">
          <h3>Undamped critical-speed map</h3>
          <Plot height={380} data={[0, 1, 2, 3].map((j) => ({ x: lat.undamped_critical_map.k_n_m,
            y: lat.undamped_critical_map.critical_speeds_rpm.map((r: number[]) => r[j]), name: `Mode ${j + 1}`, mode: "lines" }))}
            layout={{ xaxis: { title: "Bearing stiffness (N/m)", type: "log" }, yaxis: { title: "Critical speed (rpm)", type: "log" },
              shapes: [sp.mcs_rpm, sp.min_rpm].map((v) => ({ type: "line", xref: "paper", x0: 0, x1: 1, y0: v, y1: v, line: { color: SERIES[2], dash: "dot" } })) }} />
        </div>
      </div>
      <div className="card" style={{ marginTop: 14 }}>
        <div className="row"><h3 style={{ margin: 0 }}>Unbalance response</h3>
          <div className="chips" style={{ margin: 0 }}>{lat.unbalance_cases.map((u: Json, i: number) =>
            <button key={i} className={`chip ${ucase === i ? "on" : ""}`} onClick={() => setUcase(i)}>Mode {u.mode} unbalance</button>)}</div></div>
        {uc && <>
          <Plot height={360} data={Object.entries(uc.response.probes).map(([z, d]: [string, Json], i) => ({ x: uc.response.speeds_rpm,
            y: d.major_um, name: `z = ${fmt(Number(z), 3)} m`, mode: "lines", line: { color: SERIES[i % 8] } }))}
            layout={{ xaxis: { title: "Speed (rpm)" }, yaxis: { title: "Response major semi-axis (µm)", type: "log" }, shapes: vlines }} />
          <p className="muted">Unbalance: {uc.unbalances.map((u: Json) => `${fmt(u.g_mm, 0)} g·mm at z = ${fmt(u.z, 3)} m, ${u.phase_deg}°`).join("; ")}</p>
          <div className="grid">
            <Table rows={uc.peaks} cols={[["Critical rpm", (p) => p.speed_rpm, 0], ["AF", (p) => p.af, 2], ["Method", (p) => p.af_method ?? ""],
              ["Amplitude µm", (p) => p.amplitude_um, 2], ["SM %", (p) => p.separation_pct], ["Required %", (p) => p.required_separation_pct ?? "AF < 2.5"],
              ["Result", (p) => (p.pass ? "pass" : "FAIL")]]} />
            <Table rows={[...uc.amplitude_checks, ...uc.clearance_checks]} cols={[["Location", (a) => a.location],
              ["Value", (a) => (a.pk_pk_um_1x_unbalance ?? a.max_pk_pk_um)], ["Limit", (a) => a.limit_um ?? a.diametral_clearance_um * c.project.criteria.clearance_ratio_limit],
              ["Result", (a) => (a.pass ? "pass" : "FAIL")]]} />
          </div>
        </>}
      </div>
      <div className="grid" style={{ marginTop: 14 }}>
        <div className="card">
          <h3>Forward mode shapes at MCS</h3>
          <Plot data={lat.modes_at_mcs.filter((m: Json) => m.whirl === "forward").slice(0, 4).map((m: Json) => ({ x: lat.z_m, y: m.shape,
            name: `${fmt(m.freq_cpm, 0)} cpm, δ ${fmt(m.logdec, 2)}`, mode: "lines" }))}
            layout={{ xaxis: { title: "z (m)" }, yaxis: { title: "Normalised amplitude" },
              shapes: k.rotor.bearing_z_m.map((z: number) => ({ type: "line", x0: z, x1: z, yref: "paper", y0: 0, y1: 1, line: { color: SERIES[5], dash: "dash" } })) }} />
        </div>
        <div className="card">
          <h3>Level I stability: log dec vs cross-coupling</h3>
          <Plot data={[{ x: st.logdec_vs_q.map((p: number[]) => p[0] / 1e6), y: st.logdec_vs_q.map((p: number[]) => p[1]), mode: "lines+markers", name: "First forward mode" },
            { x: [st.qa_n_m / 1e6], y: [st.logdec_with_qa], mode: "markers", name: "Qa", marker: { size: 12, color: SERIES[1] } }]}
            layout={{ xaxis: { title: "Cross-coupled stiffness Q (MN/m)" }, yaxis: { title: "Log decrement" },
              shapes: [{ type: "line", xref: "paper", x0: 0, x1: 1, y0: c.project.criteria.lateral_logdec_min, y1: c.project.criteria.lateral_logdec_min, line: { color: SERIES[3], dash: "dash" } }] }} />
        </div>
      </div>
      <Trace trace={lat.trace} />
    </>
  );
}

export function TorsionalPage(c: Ctx) {
  const r = c.results;
  const [m, setM] = useState(0);
  if (!r) return <NeedRun results={r} />;
  const t = r.torsional;
  const inter = t.interference;
  const modes = t.natural.modes;
  return (
    <>
      <h2>Torsional vibration of the train</h2>
      <p className="lead">Driver, coupling(s), gearbox and compressor shaft line as a lumped model referred to compressor
        speed: natural frequencies, mode shapes, interference diagram with separation checks, forced response and stresses.</p>
      <div className="grid">
        <div className="card">
          <h3>Interference diagram</h3>
          <Plot height={380} data={[
            ...Object.entries(inter.lines_hz).map(([n, f]: [string, Json], i) => ({ x: inter.speeds_rpm, y: f, name: n, mode: "lines", line: { color: SERIES[i % 8] } })),
            ...modes.slice(0, 4).map((md: Json) => ({ x: [0, Math.max(...inter.speeds_rpm)], y: [md.freq_hz, md.freq_hz], mode: "lines",
              name: `${fmt(md.freq_hz, 1)} Hz`, line: { color: "#888", dash: "dash", width: 1 } })),
          ]} layout={{ xaxis: { title: "Compressor speed (rpm)" }, yaxis: { title: "Frequency (Hz)", range: [0, Math.min(4000, (modes[3]?.freq_hz ?? 1000) * 1.3)] },
            shapes: [r.casings[0].lateral.speeds.min_rpm, r.casings[0].lateral.speeds.mcs_rpm].map((v: number) => ({ type: "line", x0: v, x1: v, yref: "paper", y0: 0, y1: 1, line: { color: SERIES[2], dash: "dot" } })) }} />
        </div>
        <div className="card">
          <h3>Mode shapes</h3>
          <div className="chips">{modes.slice(0, 5).map((md: Json, i: number) => <button key={i} className={`chip ${m === i ? "on" : ""}`} onClick={() => setM(i)}>{fmt(md.freq_hz, 1)} Hz</button>)}</div>
          <Plot data={[{ x: t.natural.stations, y: modes[m]?.shape ?? [], mode: "lines+markers", name: "Relative twist angle" }]}
            layout={{ xaxis: { title: "", tickangle: -30 }, yaxis: { title: "Normalised angle" }, margin: { b: 110 } }} />
          <p className="muted">Dominant shaft: {modes[m]?.dominant_shaft}</p>
        </div>
      </div>
      <div className="grid" style={{ marginTop: 14 }}>
        <div className="card">
          <h3>Forced response: 1 % rated torque at 1X, applied at the coupling</h3>
          <Plot data={Object.entries(t.forced.dynamic_torque_nm).map(([n, v]: [string, Json]) => ({ x: t.forced.speeds_rpm, y: v, name: n, mode: "lines" }))}
            layout={{ xaxis: { title: "Speed (rpm)" }, yaxis: { title: "Dynamic torque (N·m)", type: "log" } }} />
        </div>
        <div className="card">
          <h3>Separation checks</h3>
          <Table rows={inter.checks} cols={[["Mode Hz", (x) => x.mode_hz, 1], ["Excitation", (x) => x.excitation],
            ["Band Hz", (x) => `${fmt(x.band_hz[0], 0)}–${fmt(x.band_hz[1], 0)}`], ["Separation %", (x) => x.separation * 100],
            ["Result", (x) => (x.pass ? "pass" : x.excitation.includes("VFD") ? "evaluate" : "FAIL")]]} />
        </div>
      </div>
      {t.startup && <div className="card" style={{ marginTop: 14 }}>
        <h3>Synchronous motor start-up transient</h3>
        <Plot data={Object.entries(t.startup.shaft_torque_nm).map(([n, v]: [string, Json]) => ({ x: t.startup.t_s, y: v, name: n, mode: "lines" }))}
          layout={{ xaxis: { title: "Time (s)" }, yaxis: { title: "Shaft torque (N·m)" } }} />
      </div>}
      <div className="grid" style={{ marginTop: 14 }}>
        <div className="card"><h3>Shaft stresses</h3>
          <Table rows={t.stress} cols={[["Shaft", (x) => x.shaft], ["Ø mm", (x) => x.diameter_mm, 0], ["Mean N·m", (x) => x.mean_torque_nm, 0],
            ["Max dyn. N·m", (x) => x.max_dynamic_torque_nm, 0], ["τm MPa", (x) => x.mean_shear_mpa, 1], ["τa MPa", (x) => x.alternating_shear_mpa, 2],
            ["Goodman SF", (x) => x.goodman_safety, 2]]} /></div>
        <div className="card"><h3>Train inputs</h3>
          <SchemaForm schema={c.schema} def="TrainDesign" value={c.project.train} onChange={(v) => sub(c, "train", v)} /></div>
      </div>
      <Trace trace={t.trace} />
    </>
  );
}

// ------------------------------------------------------------------ systems
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

const VERDICT: Record<string, [string, string]> = { outside: ["fail", "Outside recorded limits"], evidence: ["attention", "Evidence needed"],
  within: ["pass", "Within recorded limits · conditional"] };
const LIMITS: [string, string][] = [["min_temp_c", "Min T °C"], ["max_temp_c", "Max T °C"], ["max_hardness_hrc", "Max HRC"],
  ["measured_hardness_hrc", "Meas. HRC"], ["max_wet_ph2s_bar", "Wet pH₂S bar"], ["max_dry_ph2s_bar", "Dry pH₂S bar"],
  ["max_pco2_bar", "pCO₂ bar"], ["min_ph", "Min pH"], ["max_chloride_ppm", "Cl⁻ ppm"], ["corrosion_allowance_mm", "CA mm"]];

export function MaterialsPage(c: Ctx) {
  const [db, setDb] = useState<Json>(null);
  const [open, setOpen] = useState<number | null>(null);
  useEffect(() => { api.materials().then(setDb).catch(() => undefined); }, []);
  const r = c.results;
  const p = c.project;
  const ma = p.material_assessment;
  const res = r?.material_assessment;
  const records: Json[] = ma.records.length ? ma.records : (res?.components ?? []).map((x: Json) => {
    const { status, failures, missing, checks, ...rec } = x; void status; void failures; void missing; void checks; return rec;
  });
  const setMA = (v: Json) => c.setProject({ ...p, material_assessment: v });
  const setRec = (i: number, k: string, v: unknown) => setMA({ ...ma, records: records.map((x, j) => (j === i ? { ...x, [k]: v } : x)) });
  const num = (v: string) => (v === "" ? null : parseFloat(v));
  const cond: Json[] = res?.conditions ?? [];
  // Illustrative domain boundaries for the pH2S-pH chart.
  const xs = [0.003, 0.01, 0.03, 0.1, 0.3, 1, 3, 10];
  const lg = (x: number) => Math.log10(x);
  return (
    <>
      <h2>Material assessment</h2>
      <p className="lead">Sour and wet service screening at every stage, driven by the compressor design: partial pressures, water dew
        point, condensed-water pH, SSC severity domain and CO₂ corrosion, checked against each component's <strong>recorded, verified</strong> limits.
        A material name alone never passes.</p>
      {res && <Kpis items={[["Outside limits", String(res.counts.outside)], ["Evidence needed", String(res.counts.evidence)],
        ["Within limits", String(res.counts.within)], ["Sour", cond.some((x) => x.sour) ? "yes (pH₂S ≥ 0.3 kPa)" : "no"],
        ["Wet locations", cond.filter((x) => x.wet).map((x) => x.location).join(", ") || "none"]]} />}
      <div className="grid">
        <div className="card">
          <h3>Service conditions by location</h3>
          <Table rows={cond} cols={[["Location", (x) => x.location], ["P bara", (x) => x.P_bara, 1], ["T °C", (x) => x.T_c, 0],
            ["pH₂S bar", (x) => x.ph2s_bar, 3], ["pCO₂ bar", (x) => x.pco2_bar, 2], ["Water dew °C", (x) => x.water_dew_point_c, 1],
            ["State", (x) => (x.wet ? "WET" : "dry")], ["pH", (x) => x.ph, 2], ["Domain", (x) => x.domain], ["CO₂ mm/y", (x) => x.co2_rate_mm_y, 2]]} />
        </div>
        <div className="card">
          <h3>SSC severity map (illustrative domains, not ISO 15156 limits)</h3>
          <Plot height={300} data={[
            { x: xs, y: xs.map((x) => Math.min(6.5, 4 + lg(x) - lg(0.003))), mode: "lines", name: "D1 / D2", line: { color: SERIES[2], dash: "dash" } },
            { x: xs, y: xs.map((x) => Math.min(5.5, 3.5 + lg(x) - lg(0.01))), mode: "lines", name: "D2 / D3", line: { color: SERIES[3], dash: "dash" } },
            { x: cond.map((x) => Math.max(x.ph2s_bar, 1e-4)), y: cond.map((x) => x.ph), text: cond.map((x) => x.location), mode: "markers+text",
              textposition: "top center", name: "Locations", marker: { size: 11, color: cond.map((x) => (x.wet ? SERIES[3] : SERIES[0])) } },
          ]} layout={{ xaxis: { title: "pH₂S (bar)", type: "log" }, yaxis: { title: "pH", range: [2.5, 7] },
            shapes: [{ type: "line", x0: 0.003, x1: 0.003, yref: "paper", y0: 0, y1: 1, line: { color: SERIES[5], dash: "dot" } }] }} />
        </div>
      </div>
      <div className="card" style={{ marginTop: 14 }}>
        <h3>Components — recorded limits and verdicts</h3>
        <div className="scroll"><table className="t">
          <thead><tr><th>Component</th><th>Material</th><th>Evidence ref.</th><th>Verified</th>{LIMITS.map(([, l]) => <th key={l}>{l}</th>)}<th>Verdict</th></tr></thead>
          <tbody>{records.map((x, i) => {
            const v = res?.components?.[i];
            const [cls, txt] = VERDICT[v?.status ?? "evidence"];
            return (<Fragment key={i}>
              <tr>
                <td>{x.component}</td>
                <td><select className="inp" value={x.material} onChange={(e) => setRec(i, "material", e.target.value)}>
                  {(db?.materials ?? [{ key: x.material }]).map((m: Json) => <option key={m.key}>{m.key}</option>)}</select></td>
                <td><input className="inp" style={{ width: 110 }} value={x.evidence_reference} placeholder="doc / cert ref"
                  onChange={(e) => setRec(i, "evidence_reference", e.target.value)} /></td>
                <td><input type="checkbox" checked={x.verified} onChange={(e) => setRec(i, "verified", e.target.checked)} /></td>
                {LIMITS.map(([k]) => <td key={k}><input className="inp" style={{ width: 64 }} type="number" step="any" value={x[k] ?? ""}
                  onChange={(e) => setRec(i, k, num(e.target.value))} /></td>)}
                <td><button className={`badge ${cls}`} onClick={() => setOpen(open === i ? null : i)}>{txt}</button></td>
              </tr>
              {open === i && v && <tr><td colSpan={LIMITS.length + 5}>
                <div className="verdict">
                  {v.failures.map((t: string) => <div key={t} className="status fail">✕ {t}</div>)}
                  {v.missing.map((t: string) => <div key={t} className="status attention">○ {t}</div>)}
                  {v.checks.map((t: string) => <div key={t} className="status pass">✓ {t}</div>)}
                </div></td></tr>}
            </Fragment>);
          })}</tbody>
        </table></div>
        <p className="muted">Edit limits from your qualified documents, then re-run. Click a verdict for the detailed checks.</p>
      </div>
      <div className="card" style={{ marginTop: 14 }}><h3>Assessment inputs</h3>
        <SchemaForm schema={c.schema} def="MaterialAssessment" value={ma} onChange={setMA} skip={["records"]} /></div>
      {db && <details className="card" style={{ marginTop: 14 }}><summary><strong>Material database</strong> <span className="muted">— {db._notice}</span></summary>
        <Table rows={db.materials} cols={[["Material", (m) => m.key], ["Family", (m) => m.family.replace(/_/g, " ")], ["ρ kg/m³", (m) => m.density_kg_m3, 0],
          ["E GPa", (m) => m.E_gpa, 0], ["Sy MPa", (m) => m.yield_mpa, 0], ["Su MPa", (m) => m.uts_mpa, 0], ["T min °C", (m) => m.min_temp_c, 0],
          ["T max °C", (m) => m.max_temp_c, 0], ["Sour HRC max", (m) => m.sour_max_hrc ?? "–"], ["Corrosion", (m) => m.corrosion]]} /></details>}
      {res && <Trace trace={res.trace} />}
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
      if (kind === "report.html") {
        const res = await fetch("/api/export/report.html", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ project: c.project, level: "full" }) });
        const w = window.open("", "_blank");
        if (w) { w.document.write(await res.text()); w.document.close(); }
      } else await download(kind, c.project);
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
          <button className="btn" onClick={() => {
            const a = document.createElement("a");
            a.href = URL.createObjectURL(new Blob([JSON.stringify(c.project, null, 1)], { type: "application/json" }));
            a.download = `${String(c.project.name).replace(/\s+/g, "_")}_rev${c.project.revision}.json`;
            a.click();
          }}>Export project file</button>
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
