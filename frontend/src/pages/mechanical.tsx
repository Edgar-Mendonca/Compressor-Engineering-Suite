import { useState } from "react";
import { fmt, type Json } from "../api";
import { Plot, SERIES } from "../components/Plot";
import { RotorModel } from "../components/RotorModel";
import { SchemaForm } from "../components/SchemaForm";
import { Lazy, NeedRun, cas, sub, RotorView, Kpis, Table, Trace, type Ctx } from "./common";

export function RotorPage(c: Ctx) {
  const k = cas(c);
  const [mode, setMode] = useState(-1);
  if (!k) return <NeedRun results={c.results} />;
  const rot = k.rotor;
  const sh = k.shaft;
  const lat = k.lateral;
  const fw = (lat.modes_at_mcs ?? []).filter((m: Json) => m.shape).slice(0, 6);
  const modeShape = mode >= 0 && fw[mode] ? { z: lat.z_m, shape: fw[mode].shape, whirl: fw[mode].whirl } : null;
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
            {fw.map((m: Json, i: number) => <button key={i} className={`chip ${mode === i ? "on" : ""}`} onClick={() => setMode(i)}>
              {m.whirl === "backward" ? "BW" : "FW"} {fmt(m.freq_cpm, 0)} cpm, δ {fmt(m.logdec, 2)}</button>)}
          </div>
        </div>
        {scene && <Lazy><RotorView scene={scene} mode={modeShape} /></Lazy>}
        <p className="muted">Drag to orbit, scroll to zoom. Mode animation shows the whirl orbits (green forward, orange backward) and the deflected centreline of the damped mode at MCS (amplitude exaggerated).</p>
        <RotorModel rotor={rot} z={lat.z_m} cg={mp.cg_m} h={250} modes={modeShape ? [{ shape: modeShape.shape, whirl: modeShape.whirl, label: `${fw[mode].whirl} ${fmt(fw[mode].freq_cpm, 0)} cpm`, color: modeShape.whirl === "backward" ? "#e5732e" : "#30a46c" }] : []} />
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
/** Download buttons for the lateral / stability / torsional analysis reports (full-level run on the server). */
