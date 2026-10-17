# Architecture

```
backend/compsuite/          Python engineering core + FastAPI
    core/        model.py (shared data model), workflow.py (pipeline), storage.py (SQLite),
                 trace.py (traceability), units.py
    thermo/      components, Peng-Robinson EOS, CoolProp backend adapter
    compression/ flow conversions, polytropic/isentropic compression, Schultz, efficiency back-calculation
    aero/        sizing (stages, speed, diameter, sections, casings), generic stage curves,
                 stage-stacking maps, operating points
    impeller/    geometry, slip/work coefficient, mass/inertia, axial thrust
    mechanical/  parametric rotor assembly, shaft integrity (Kt, Marin, DE-Goodman)
    rotordynamics/ Timoshenko-beam FE (fe.py), API 617-style lateral analysis (lateral.py), ROSS adapter
    bearings/    short-bearing Reynolds solution, plain + tilting-pad, oil properties
    seals/       labyrinth leakage, Wachel cross-coupling, dry-gas-seal conditioning
    torsional/   lumped train model, interference, forced response, start-up transient
    structural/  rotating-disk FE, CalculiX deck export/run
    auxiliary/   lube-oil system
    piping/      pipe sizing, compressible pressure drop, valve and orifice sizing
    materials/   database (data/materials.json), temperature derating, screening
    optimization/ parametric, sensitivity, COBYLA optimisation, comparison
    standards/   verification checklist
    reporting/   figures (matplotlib), HTML/PDF report, Excel workbook, datasheet
    cad/         Three.js scene description, STL, STEP (CadQuery)
    api/app.py   FastAPI routes; serves the built frontend
frontend/                   React + TypeScript (Vite), Plotly charts, Three.js rotor viewer
docs/                       this folder
```

## Shared engineering data model

`core/model.py` defines one `Project` (pydantic) containing every input:
gas, operating cases, design basis, shaft, bearings, seals, train, lube,
piping, criteria and materials. Units are part of the field names
(`suction_pressure_bara`, `journal_diameter_mm`). Optional fields set to
`None` are estimated by the owning module and the estimate is reported. The
same model drives the API (`/api/schema` publishes it as JSON Schema) and the
frontend forms, so adding a field to the model makes it editable in the UI.

## Workflow

`core/workflow.run_project(project, level)` runs the modules in dependency
order so a change to any input propagates to every result:

```
gas properties ─► sizing & stage design ─► operating points on the map ─► case compression
        │                    │
        ▼                    ▼
   materials ─► impellers ─► rotor assembly ─► bearings (speed tables) ─► shaft integrity
                                   │                     │
                                   ▼                     ▼
                                 seals (Qa) ───────► lateral rotordynamics ─► impeller stress
                                   │
                                   ▼
                           torsional train ─► lube oil ─► piping ─► verification checklist
```

Multi-casing designs are handled per casing for the mechanical and lateral
analyses. `level="fast"` (used inside optimisation loops) uses coarser bearing
tables and skips unbalance sweeps and maps.

## Traceability

Every module returns a `CalcRecord` (`core/trace.py`) with: module, method,
engine (built-in, CoolProp, …), software version, a hash of the inputs it
used, assumptions, references and warnings. Reports print these records, the
checklist cites the module behind each check, and stored runs keep the
project revision, input hash and software version (`core/storage.py`).

## Numerical notes

* Lateral FE: 4 DOF per node (x, φx, y, φy), consistent mass with rotary
  inertia, Timoshenko shear factor, skew gyroscopic matrix. Repeated solves
  (Campbell, unbalance sweeps, stability search) are done on a 40-mode Ritz
  basis built from the undamped system with symmetrised bearing stiffness;
  this is checked against the full model in the tests.
* Bearing coefficients are finite differences of the integrated fluid force
  about the static equilibrium, in the same coordinate frame as the rotor
  model. This avoids frame/sign errors that arise when transcribing
  closed-form coefficient tables.
* Off-design maps use stage stacking on the real-gas model, so density
  changes, intercooling and stage mismatching appear in the overall map.

## Extending

* **New compressor types (API 618, screw):** add a sizing/performance module
  that produces the same `sizing`-like dictionary (speed, power, stages or
  cylinders) and a rotor/crankshaft builder; the torsional, lube, piping,
  materials, reporting and checklist modules are reusable.
* **New engines:** add an adapter next to the built-in method (see
  `thermo/backends.py`, `rotordynamics/ross_adapter.py`,
  `structural/calculix.py`) and a validation test comparing the two.
* **Criteria editions:** `Criteria` in the model carries the edition label
  and numeric limits; keep one JSON per edition under version control and
  load it into the project.
