import { num } from "./modules";

// Guided tour on the example project: each step opens a module and explains what to do there.
export const STEPS: { page: string; title: string; text: string; run?: boolean }[] = [
  { page: "project", title: "Design basis", text: "Every project starts with the design basis: driver, tip-speed and Mach limits, temperature limits and the acceptance criteria every check uses. Fields left blank are estimated." },
  { page: "gas", title: "Gas & operating cases", text: "Enter the gas composition (normalised automatically) and every operating case. Mark one case as the design case; the machine is sized for it and checked against all others." },
  { page: "gas", title: "Run the analysis", text: "Click Run analysis (top right) whenever inputs change. One run updates every module: thermodynamics, sizing, mechanics, rotordynamics, materials and the checklist.", run: true },
  { page: "thermo", title: "Thermodynamics", text: "Check compressibility, k and the phase envelope. The dew-point margin tells you whether liquid can form at suction or in the coolers." },
  { page: "compressor", title: "Selection & performance", text: "The selected casing, stages and speed, with the performance map. Hover over the chart to read values; use Edit chart to change axes, labels and styles, and export PNG, SVG, PDF or CSV." },
  { page: "materials", title: "Material assessment", text: "Sour and wet service at every stage: SSC domain, CO2 corrosion and the acceptance criteria per component. A material only passes with recorded evidence." },
  { page: "impellers", title: "Impeller design", text: "Impeller geometry, tip speed and Mach number, with the axisymmetric disc stress check at MCS and overspeed." },
  { page: "impfea", title: "Impeller FEA validation", text: "The 3D cyclic-sector FEA validates the impeller: stresses at MCS and 115 % overspeed, permanent growth, modes and fatigue. Switch result field, load case and cut-away in the viewer." },
  { page: "rotor", title: "Rotor, shaft & thrust", text: "The shaft layout from impellers, seals, balance piston and bearings. Shaft stresses are checked before rotordynamics." },
  { page: "bearings", title: "Bearings & seals", text: "Tilting-pad bearing coefficients feed rotordynamics; seal leakage and dry gas seal conditioning are checked here." },
  { page: "lateral", title: "Lateral & stability", text: "Campbell diagram, critical speeds, unbalance response and stability against API 617-style criteria." },
  { page: "torsional", title: "Torsional train", text: "Natural frequencies of the whole train, interference with excitations and the motor start-up torque." },
  { page: "mrt", title: "Mechanical running test", text: "The API 617 shop running test planned from your design: play the animated test to see the speed-time plan, predicted probe readings and critical-speed pass, then enter the log sheet for pass / fail." },
  { page: "verify", title: "Verification", text: "The full traceable checklist. Work through every fail and attention item, then save a revision and export the report in Reports & projects." },
];

export function TutorialCard({ step, setStep, open, run, running }: {
  step: number; setStep: (n: number | null) => void; open: (id: string) => void; run: () => void; running: boolean;
}) {
  const s = STEPS[step];
  const go = (n: number) => { setStep(n); open(STEPS[n].page); };
  return (
    <aside className="tour" role="dialog" aria-label="Tutorial">
      <div className="mono caps muted">Tutorial · {step + 1} / {STEPS.length} · module {num(s.page)}</div>
      <h3>{s.title}</h3>
      <p>{s.text}</p>
      <div className="row">
        {s.run && <button className="btn primary" disabled={running} onClick={run}>{running ? "Running…" : "Run it for me"}</button>}
        <span className="spacer" />
        <button className="btn" disabled={step === 0} onClick={() => go(step - 1)}>Back</button>
        {step < STEPS.length - 1 ? <button className="btn primary" onClick={() => go(step + 1)}>Next</button>
          : <button className="btn primary" onClick={() => setStep(null)}>Finish</button>}
      </div>
      <button className="tour-x" onClick={() => setStep(null)} aria-label="Close tutorial">×</button>
    </aside>
  );
}
