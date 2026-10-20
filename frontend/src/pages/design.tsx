import { useEffect, useState } from "react";
import { api, fmt, type Json } from "../api";
import { Plot, SERIES } from "../components/Plot";
import { SchemaForm } from "../components/SchemaForm";
import { Disclaimer, NeedRun, sub, Kpis, Table, Trace, type Ctx } from "./common";

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
