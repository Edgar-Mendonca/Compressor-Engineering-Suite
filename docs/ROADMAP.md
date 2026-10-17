# Status against the proposal and roadmap

Legend: **Done** = implemented and tested in this repository ·
**Partial** = implemented with simplified methods (see notes) ·
**Planned** = not implemented yet.

| Proposal section | Status | What exists | Main gaps |
|---|---|---|---|
| 1 Process & thermodynamics | Done | Mixtures (19 components), Peng–Robinson with kij, optional CoolProp HEOS, Z/ρ/h/s/cp/cv/k/sound speed, viscosity (LGE), dew/bubble points and phase envelope, water dew point, polytropic path integration, isentropic, Schultz, head/power/efficiency, efficiency back-calculation from test data, property charts | Transport properties beyond viscosity; GERG-2008 directly; hydrate prediction |
| 2 Selection & aerodynamic design | Partial | Type screening, sizing (stages, speed, D2, sections with intercooling, casings), φ/ψ, Ns/Ds, stage-by-stage design, stage-stacking map with surge/stonewall, variable/fixed speed operating points, surge margin | Generic stage curves (no mean-line model, no Mach effects on curves); no aerodynamic shape optimisation; side-streams |
| 3 Rotor shaft & mechanical | Done | Parametric stepped shaft or user geometry, attached masses, mass/CG/inertia, torque distribution, bending (statics), Kt (Peterson fits), Marin factors, DE-Goodman fatigue, first-cycle yield, sag and static stiffness, thrust balance | Shrink-fit/keyway stresses under impellers; thermal bow |
| 4 Lateral rotordynamics | Done | Timoshenko FE with gyroscopics, speed-dependent bearings, Campbell, forward/backward whirl, mode shapes, undamped critical-speed map, unbalance response with mode-based unbalance placement, AF (half-power or eigenvalue), API 617-style separation margins, amplitude and clearance checks, Level I stability (modified Wachel, Q0 search, CSR) | Level II stability with seal/impeller dynamic coefficients; housing/pedestal flexibility; ROSS used for cross-check only |
| 5 Torsional | Partial | Lumped train incl. gearbox referral, natural frequencies, modes, interference diagram, separation checks, forced response with modal damping, synchronous-motor start-up transient, shaft torsional Goodman check | Electrical (air-gap) excitation from drive data; short-circuit transients; branched trains; openTorsion integration |
| 6 Bearings | Partial | Plain and tilting-pad journals: short-bearing Reynolds with cavitation, pad moment equilibrium, K and C vs speed, film thickness, losses, oil flow, isoviscous effective temperature | THD/TEHD temperature, finite-length bearings, pad flexibility and frequency-reduced coefficients, thrust bearing film model |
| 7 Seals | Partial | Labyrinth leakage (Martin/Hodkinson), balance piston, eye/interstage seals, Wachel cross-coupling, DGS leakage scaling, seal gas supply, dew-point margin along the JT expansion path | Bulk-flow seal dynamic coefficients (labyrinth, hole-pattern, damper seals), seal gas filtration sizing |
| 8 Impeller & rotor assembly | Done | Geometry estimate, slip and work coefficient, mass/inertia, axial thrust, balance piston, 3D assembly view, STL/STEP | Blade geometry for CFD/FEA; balancing calculations |
| 9 Structural FEA | Partial | Rotating disk FE (centrifugal + thermal, overspeed, burst margin), CalculiX beam and axisymmetric decks | 3D impeller FEA, casing FEA, structural optimisation |
| 10 Lube oil & auxiliaries | Partial | Oil flow, pump, cooler (LMTD), reservoir, viscosity (ASTM D341) | Pressure-drop network, accumulators, rundown tank, control oil |
| 11 Piping & flow | Done | Pipe sizing, Colebrook, isothermal compressible ΔP, IEC 60534 gas valve sizing, ISO 5167 orifice, system vs compressor curve | Pulsation/acoustics; anti-surge dynamics |
| 12 Materials | Partial | 14-material database, temperature derating, screening (temperature, strength, sour hardness), links to the Material Assessment app | Certified data sources, corrosion-rate models, impact-test rules |
| 13 Optimisation | Done | Parametric studies, normalised sensitivity, constrained COBYLA, configuration comparison, Pareto filter | Gradient-based MDO (OpenMDAO), multi-start/global methods |
| 14 Visualisation | Done | Interactive maps, property charts, phase envelope, Campbell, UCS map, unbalance, mode shapes, 3D rotor with mode animation, torsional plots, stress plots, bearing/seal plots | Dashboards across multiple projects |
| 15 Standards & verification | Partial | Versioned criteria object, checklist with pass/fail/attention/review, traceability records | Edition-specific criteria files reviewed by a qualified engineer; API 618/614/692 detail |
| 16 Documentation & reporting | Done | Datasheet, HTML/PDF report, Excel workbook, JSON, STL/STEP, CalculiX decks, revisions and calculation history | Word export; API datasheet form layout |
| 17 Architecture | Done | Python + FastAPI + React/TypeScript + Plotly + Three.js, SQLite, CadQuery optional | Multi-user auth; background job queue for long studies |

## Phase plan (from the proposal)

| Phase | Content | Status |
|---|---|---|
| 1 | Core architecture, project management, materials, thermodynamics | Done |
| 2 | Aerodynamic performance & preliminary selection | Done (generic stage curves) |
| 3 | Parametric shaft, impeller and rotor assembly | Done |
| 4 | Lateral and torsional rotordynamics | Done (Level I stability) |
| 5 | Bearings, seals, auxiliaries | Partial |
| 6 | Structural FEA, advanced mechanical, coupled optimisation | Partial |
| 7 | Verification, documentation, dashboards, reporting | Partial (criteria files need qualified review) |
| 8 | Additional compressor types | Planned |

## Suggested next steps

1. Have a qualified rotating-equipment engineer review and version the
   criteria (`Criteria`) for the API 617 edition you use.
2. Replace the generic stage curves with a mean-line model (TurboFlow or
   h2iCompressor) and add vendor-curve import.
3. Add bulk-flow seal coefficients and run Level II stability.
4. Add a THD bearing model or import vendor bearing coefficients per speed.
5. Choose a project licence before publishing.
