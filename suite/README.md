# Compressor Engineering Suite

Open-source, browser-based platform for preliminary design, selection,
simulation and evaluation of industrial centrifugal compressors (API 617
scope), built so every module shares one engineering data model and responds
to design changes:

Process → thermodynamics → selection & aerodynamics → impellers → rotor &
shaft → bearings & seals → lateral & torsional rotordynamics → structural →
auxiliaries → optimisation → verification → documentation.

> **Scope and limits.** Results support preliminary engineering, design
> studies and comparisons. The software does **not** certify compliance with
> API 617, API 614, API 692, ISO 15156 or any other standard. Acceptance
> criteria are configurable and must be verified against the edition that
> applies to the job. Detailed design and safety-critical conclusions require
> qualified engineering review.

## Quick start

```sh
# Backend (Python 3.10+)
cd suite/backend
pip install -e ".[test,coolprop,cad]"   # coolprop and cad (CadQuery) are optional
pytest                                  # validation and integration tests
compsuite serve                         # http://127.0.0.1:8000  (API docs at /docs)

# Frontend (Node 18+)
cd suite/frontend
npm ci
npm run build        # FastAPI then serves the app at http://127.0.0.1:8000
# or, for development with hot reload (backend running on :8000):
npm run dev          # http://127.0.0.1:5173
```

Command line without the browser:

```sh
compsuite example > project.json        # edit as needed
compsuite run project.json --out results/
# writes results.json, report.html, report.pdf, results.xlsx, rotor.stl
```

Optional external tools are picked up automatically: CalculiX (`ccx`) for
the FE deck cross-checks and ROSS (`pip install ross-rotordynamics`) for the
rotordynamics cross-check.

## What the example project shows

The default project is a 60 kg/s natural-gas compressor, 30 → 90 bara. A full
run (about 10 s) produces: a 4-impeller straight-through machine at
~15,000 rpm, 352 mm impellers, ~11.1 MW shaft power, a 427 kg rotor on
tilting-pad bearings with one well-separated critical speed above trip and a
Level I log decrement of 0.71, and a checklist with two findings to act on
(turndown case surge margin 6.6 % → anti-surge recycle needed; first torsional
mode 9.6 % below minimum speed vs 10 % required → coupling selection).

## Workflow in the browser

| Step | Page | Content |
|---|---|---|
| 1 | Design basis | Project, design limits, acceptance criteria |
| 2 | Gas & operating cases | Composition, property model, cases (design case marked) |
| 3 | Thermodynamics | Properties, property charts, phase envelope, case compression |
| 4 | Selection & performance | Type, sizing, stage design, map with surge/stonewall and cases |
| 5 | Impellers | Geometry, mass/inertia, thrust, disk stress |
| 6–7 | Rotor & shaft | 3D rotor with mode animation, sections, masses, stresses, fatigue |
| 8, 11 | Bearings & seals | K/C vs speed, film, losses, thrust, labyrinths, Wachel, seal gas |
| 9 | Lateral rotordynamics | Campbell, UCS map, unbalance response, API checks, stability |
| 10 | Torsional train | Interference diagram, modes, forced response, stresses |
| 12 | Lube oil & piping | Oil system, line sizing, valve, meter, system curve |
| – | Materials | Database, temperature derating, screening |
| 13 | Optimisation | Parametric study, sensitivity, constrained optimisation |
| 14 | Verification | Checklist with criteria, values, status and references |
| 15 | Reports & projects | HTML/PDF/Excel/JSON, STL/STEP, CalculiX decks, revisions, history |

## Documentation

* [Architecture](docs/ARCHITECTURE.md) — data model, workflow, numerics, extension points
* [Validation](docs/VALIDATION.md) — reference cases and tolerances checked by the tests
* [Library evaluation](docs/LIBRARY_EVALUATION.md) — the 15 proposed open-source projects: role, status, licence notes
* [Status and roadmap](docs/ROADMAP.md) — proposal sections vs. implementation, next steps

## Relationship to the Material Assessment app

The static Material Assessment app at the repository root records documented
material service limits and evidence for sour/wet service. The suite's
material module performs screening only and refers to that app for the
evidence record.
