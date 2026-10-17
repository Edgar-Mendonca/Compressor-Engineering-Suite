# Open-source library evaluation

Status of each project named in the proposal (section 18) and how the suite
uses it today. The suite is designed so that every external engine sits
behind an adapter: the built-in method always works, and the external engine
is used when installed and selected, which keeps the core installable and lets
results be cross-checked.

**Licences:** the licence column records what the projects publish as far as
we know at the time of writing; where it says "package metadata" it was read
from the installed package. Each one must be confirmed against the
project's repository (and its dependencies) before anything is bundled or
redistributed. Entries marked *confirm* are ones we have not verified.

| # | Project | Role in the suite | Status | Licence (confirm before bundling) |
|---|---------|-------------------|--------|-----------------------------------|
| 1 | CoolProp | Reference real-gas properties (HEOS mixtures) | **Integrated** as optional backend `gas.backend = "coolprop"` (`thermo/backends.py`); used in tests to validate the built-in Peng–Robinson model | MIT |
| 2 | Cantera | Transport properties, reacting mixtures | Not integrated. Candidate for transport properties (viscosity, conductivity) to replace the Lee–Gonzalez–Eakin correlation | BSD-3-Clause |
| 3 | fluids (Caleb Bell) | Piping, friction, valves, meters | **Adapter**: when installed, the Colebrook friction factor is cross-checked (`piping/flow.py`). Built-in implementations of Colebrook, IEC 60534 and ISO 5167 are used otherwise | MIT |
| 4 | Petrobras ccp | Centrifugal compressor performance (test evaluation, curve conversion) | Not integrated (installed as a ROSS dependency). Intended for ASME PTC 10 test evaluation and vendor-curve conversion between conditions | Apache-2.0 (package metadata, `ccp-performance` 0.4.1) |
| 5 | SINTEF h2iCompressor | Preliminary design / off-design of centrifugal stages | Not integrated. Candidate to replace the generic stage curves (`aero/stage.py`) with a mean-line model | *confirm* |
| 6 | OpenMDAO pyCycle | Thermodynamic cycles, compressor maps | Not integrated. Relevant for driver (gas turbine) cycle coupling | Apache-2.0 |
| 7 | TurboFlow | Mean-line turbomachinery models | Not integrated. Candidate mean-line engine (see 5) | *confirm* |
| 8 | Petrobras ROSS | Lateral rotordynamics | **Adapter** `rotordynamics/ross_adapter.py` converts the suite rotor model to ROSS element by element; used in tests as an independent cross-check (frequencies within 0.1 %, log dec within 0.002) | Apache-2.0 (package metadata, `ross-rotordynamics` 3.0.0) |
| 9 | openTorsion (Aalto) | Torsional vibration | Not integrated. Built-in lumped model covers the standard train; openTorsion is the path for branched trains and electrical coupling | *confirm* |
| 10 | CalculiX | Structural FE | **Integrated as external solver**: beam (frequency) and axisymmetric (centrifugal stress) input decks are exported and can be run with `ccx`; the beam deck is used in tests to cross-check the rotor FE (agreement < 1 %) | GPL-2.0 (external executable; not linked) |
| 11 | Code_Aster | Advanced structural FE | Not integrated. Same deck-export pattern as CalculiX is the intended route | GPL-3.0 (external executable) |
| 12 | CadQuery | Parametric CAD | **Integrated (optional)**: STEP export of the rotor (`cad/geometry.py`). STL export works without it | Apache-2.0 |
| 13 | OpenCASCADE | CAD kernel | Used through CadQuery (OCP) | LGPL-2.1 with OCCT exception |
| 14 | OpenMDAO | Multidisciplinary optimisation | Not integrated. The optimisation module (`optimization/studies.py`) uses SciPy COBYLA with the workflow in the loop; OpenMDAO is the path for gradient-based MDO | Apache-2.0 |
| 15 | SciPy | Numerics, eigen-solvers, optimisation | **Core dependency** throughout | BSD-3-Clause |

## Licensing notes

* GPL solvers (CalculiX, Code_Aster) are invoked as separate executables via
  text input decks; the suite does not link them. Keep it that way unless the
  project licence is chosen to be GPL-compatible.
* The suite itself has no licence file yet. Choosing one (for example
  Apache-2.0 or MIT for broad reuse, or GPL-3.0 if GPL code is to be linked)
  is a project decision that should be made before the first public release.
* Material data in `compsuite/data/materials.json` are typical handbook values
  entered for preliminary design. Standards bodies' data (ASME, ASTM, API) are
  copyrighted; only reference them, and keep project-specific limits in the
  user's own records.

## Accuracy and validation reviews

Each integration is accompanied by a test that compares the suite's own
method with the external engine or with an analytical reference. See
`VALIDATION.md` for the current list and tolerances.
