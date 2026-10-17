import { useState } from "react";
import { api, type Json } from "./api";

const DRIVERS: [string, string][] = [["vfd_motor", "Electric motor, variable speed (VFD)"], ["fixed_speed_motor_gearbox", "Fixed-speed motor + gearbox"],
  ["steam_turbine", "Steam turbine"], ["gas_turbine", "Gas turbine"]];
const COMPS = ["CH4", "C2H6", "C3H8", "iC4H10", "nC4H10", "iC5H12", "nC5H12", "nC6H14", "N2", "O2", "CO2", "H2S", "H2", "H2O", "CO", "Ar", "He"];

/** Guided setup for a new project: name, driver, gas, design case. Everything else starts from sensible defaults. */
export function NewProject({ onCreate, onClose }: { onCreate: (p: Json) => void; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("New compressor project");
  const [desc, setDesc] = useState("");
  const [driver, setDriver] = useState("vfd_motor");
  const [gas, setGas] = useState<[string, number][]>([["CH4", 90], ["C2H6", 5], ["C3H8", 2], ["N2", 1.5], ["CO2", 1.5]]);
  const [c, setC] = useState({ suction_pressure_bara: 30, suction_temperature_c: 35, discharge_pressure_bara: 90, flow_value: 60, flow_unit: "kg/s" });
  const total = gas.reduce((a, [, v]) => a + (Number(v) || 0), 0);
  const ok = [name.trim().length > 0, gas.length > 0 && total > 0, c.discharge_pressure_bara > c.suction_pressure_bara && c.flow_value > 0];

  const create = async () => {
    const p = await api.example("blank");
    p.name = name.trim();
    p.description = desc;
    p.design_basis.driver_type = driver;
    p.gas.components = Object.fromEntries(gas.filter(([, v]) => Number(v) > 0));
    p.cases = [{ ...p.cases[0], ...c, name: "Rated", is_design: true }];
    onCreate(p);
  };
  const steps = ["Project", "Gas", "Design case"];
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="New project">
        <div className="seg">{steps.map((s, i) => <button key={s} className={i === step ? "on" : ""} onClick={() => setStep(i)}>{i + 1} · {s} {ok[i] ? "✓" : ""}</button>)}</div>
        <div className="mbody">
          {step === 0 && <div className="form">
            <label>Project name<input value={name} onChange={(e) => setName(e.target.value)} autoFocus /></label>
            <label>Description<input value={desc} placeholder="Service, location, duty" onChange={(e) => setDesc(e.target.value)} /></label>
            <label>Driver<select value={driver} onChange={(e) => setDriver(e.target.value)}>{DRIVERS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></label>
          </div>}
          {step === 1 && <>
            <table className="t"><thead><tr><th>Component</th><th>mol %</th><th /></tr></thead>
              <tbody>{gas.map(([k, v], i) => <tr key={i}>
                <td><select className="inp" value={k} onChange={(e) => setGas(gas.map((g, j) => (j === i ? [e.target.value, g[1]] : g)))}>{COMPS.map((x) => <option key={x}>{x}</option>)}</select></td>
                <td><input className="inp" type="number" step="any" value={v} onChange={(e) => setGas(gas.map((g, j) => (j === i ? [g[0], Number(e.target.value)] : g)))} /></td>
                <td><button className="btn" onClick={() => setGas(gas.filter((_, j) => j !== i))}>Remove</button></td></tr>)}</tbody></table>
            <div className="row" style={{ marginTop: 8 }}>
              <button className="btn" onClick={() => setGas([...gas, [COMPS.find((x) => !gas.some(([k]) => k === x)) ?? "CH4", 0]])}>Add component</button>
              <span className="muted">Total {total.toFixed(2)} % (normalised automatically)</span></div>
          </>}
          {step === 2 && <div className="form">
            <label>Suction pressure (bara)<input type="number" step="any" value={c.suction_pressure_bara} onChange={(e) => setC({ ...c, suction_pressure_bara: Number(e.target.value) })} /></label>
            <label>Suction temperature (°C)<input type="number" step="any" value={c.suction_temperature_c} onChange={(e) => setC({ ...c, suction_temperature_c: Number(e.target.value) })} /></label>
            <label>Discharge pressure (bara)<input type="number" step="any" value={c.discharge_pressure_bara} onChange={(e) => setC({ ...c, discharge_pressure_bara: Number(e.target.value) })} /></label>
            <label>Flow<input type="number" step="any" value={c.flow_value} onChange={(e) => setC({ ...c, flow_value: Number(e.target.value) })} /></label>
            <label>Flow unit<select value={c.flow_unit} onChange={(e) => setC({ ...c, flow_unit: e.target.value })}>
              {["kg/s", "kg/h", "Am3/h", "Nm3/h", "Sm3/h", "MMSCFD"].map((u) => <option key={u}>{u}</option>)}</select></label>
            <p className="muted small" style={{ gridColumn: "1 / -1" }}>Add more operating cases later on the Gas & operating cases page.</p>
          </div>}
        </div>
        <div className="row mfoot">
          <button className="btn" onClick={onClose}>Cancel</button><span className="spacer" />
          {step > 0 && <button className="btn" onClick={() => setStep(step - 1)}>Back</button>}
          {step < 2 ? <button className="btn primary" onClick={() => setStep(step + 1)}>Next</button>
            : <button className="btn primary" disabled={!ok.every(Boolean)} onClick={create}>Create project</button>}
        </div>
      </div>
    </div>
  );
}
