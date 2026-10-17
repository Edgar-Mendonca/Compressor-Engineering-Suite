// The suite's modules in engineering workflow order. The number shown on the
// launcher and in the sidebar is the position in this list.

export type Group = { id: string; label: string; color: string };
export const GROUPS: Group[] = [
  { id: "inputs", label: "Inputs", color: "#0B5CAD" },
  { id: "process", label: "Process & aero", color: "#0E8A91" },
  { id: "mechanical", label: "Mechanical", color: "#6D4FC2" },
  { id: "dynamics", label: "Rotordynamics", color: "#D9822B" },
  { id: "systems", label: "Materials & systems", color: "#2E9E6B" },
  { id: "evaluate", label: "Evaluate & report", color: "#C2414B" },
];

export type Module = { id: string; label: string; group: string; desc: string; how: string; checks: string[] };
export const MODULES: Module[] = [
  { id: "project", label: "Design basis", group: "inputs", checks: [],
    desc: "Project data, driver, speed limits, criteria and the standards basis.",
    how: "Start here: set the design limits and acceptance criteria every later check uses." },
  { id: "gas", label: "Gas & operating cases", group: "inputs", checks: [],
    desc: "Gas composition, property model and all operating cases.",
    how: "Enter mol % and each case's flow, suction and discharge conditions." },
  { id: "thermo", label: "Thermodynamics", group: "process", checks: ["compression"],
    desc: "Peng-Robinson / CoolProp properties, phase envelope and compression path.",
    how: "Check Z, k and the dew-point margin before trusting the compression results." },
  { id: "compressor", label: "Selection & performance", group: "process", checks: ["aero"],
    desc: "Casing and stage selection, head, power, efficiency and the performance map.",
    how: "Review surge margin, turndown and power for each case on the map." },
  { id: "impellers", label: "Impellers & FEA", group: "mechanical", checks: ["impeller", "structural"],
    desc: "Impeller geometry, tip speed, axisymmetric FEA and the 3D stress viewer.",
    how: "Look at peak stress at MCS and 115 % overspeed against yield." },
  { id: "rotor", label: "Rotor & shaft", group: "mechanical", checks: ["mechanical"],
    desc: "Shaft sizing, rotor layout, masses and the 3D rotor model.",
    how: "Confirm shaft stress and the bearing span before running rotordynamics." },
  { id: "bearings", label: "Bearings & seals", group: "mechanical", checks: ["bearings", "seals"],
    desc: "Tilting-pad bearings, labyrinth leakage and dry gas seal conditioning.",
    how: "Check pad temperature, film thickness and seal-gas dew-point margin." },
  { id: "lateral", label: "Lateral rotordynamics", group: "dynamics", checks: ["rotordynamics"],
    desc: "Critical speeds, Campbell diagram, unbalance response and stability.",
    how: "Review separation margins, amplification factors and log decrement." },
  { id: "torsional", label: "Torsional train", group: "dynamics", checks: ["torsional"],
    desc: "Train torsional natural frequencies, interference and motor start-up.",
    how: "Check margins to 1x and 2x line frequency and the start-up shaft torque." },
  { id: "materials", label: "Material assessment", group: "systems", checks: ["materials"],
    desc: "Sour and wet service per stage, SSC domains, CO2 corrosion and evidence.",
    how: "Record each component's material and evidence; nothing passes on a name alone." },
  { id: "aux", label: "Lube oil & piping", group: "systems", checks: ["auxiliary", "piping", "conditioning"],
    desc: "Lube oil system sizing and nozzle loads / piping checks.",
    how: "Size the oil system and check nozzle loads against the allowables." },
  { id: "optimize", label: "Optimisation", group: "evaluate", checks: [],
    desc: "Parametric studies, sensitivity and constrained optimisation.",
    how: "Vary speed, stages or geometry to see what moves power and margins." },
  { id: "verify", label: "Verification", group: "evaluate", checks: ["*"],
    desc: "The full traceable checklist from every module, with references.",
    how: "Work through every fail and attention item before issuing results." },
  { id: "reports", label: "Reports & projects", group: "evaluate", checks: [],
    desc: "PDF / HTML / Excel reports, CAD and FE exports, saved revisions.",
    how: "Save a revision, then export the report and data package." },
];

export const num = (id: string) => String(MODULES.findIndex((m) => m.id === id) + 1).padStart(2, "0");
export const groupOf = (m: Module) => GROUPS.find((g) => g.id === m.group)!;
