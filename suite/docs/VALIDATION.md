# Validation record

Every entry below is an automated test in `suite/backend/tests/`. Run them
with `pytest` from `suite/backend`. Tests that need an optional engine
(CoolProp, CalculiX, ROSS, CadQuery) are skipped when it is not installed;
the CI workflow installs CoolProp and CalculiX.

Validation shows the implementation solves the stated models correctly. It
does not make the models suitable for every machine: see the assumptions in
each module's trace and the limits in `ROADMAP.md`.

## Thermodynamics and compression

| Case | Reference | Tolerance / result |
|---|---|---|
| Ideal-gas limit, N₂ at 1 kPa | Z = 1 | < 1e-4 |
| Water saturation pressure at 25 °C and 100 °C | IAPWS-95 (3.1699 kPa, 101.418 kPa) | < 0.2 % |
| Methane Z at 280–350 K, 20–100 bar | CoolProp HEOS | ΔZ < 0.025 (typical PR deviation ~2 %) |
| Methane Δh 300 K/20 bar → 400 K/80 bar | CoolProp HEOS | < 1.5 % (0.7 % found) |
| Helium polytropic compression (ideal gas, constant cp) | T₂/T₁ = PR^(R/(cp ηp)), Hp = ηp cp ΔT | < 0.2 K, < 0.2 % |
| Natural gas 30 → 90 bar | Schultz method vs. path integration | Δη < 0.005, ΔHp < 0.5 % |
| Efficiency back-calculation round trip | Input ηp | < 0.001 |
| Energy balance | P = ṁ Δh | exact |
| MMSCFD and kg/h conversions | Definitions | exact |
| ISO VG 46 viscosity at 40/100 °C | Grade definition (ASTM D341 fit) | exact |

## Rotordynamics

| Case | Reference | Tolerance / result |
|---|---|---|
| Simply supported uniform shaft, first frequency | Euler–Bernoulli closed form (Timoshenko slightly lower) | < 0.3 % (44.75 vs 44.81 Hz) |
| Jeffcott rotor | √(48EI/L³ / (m + 0.486 m_shaft)) | < 0.2 % |
| Overhung disk at 10,000 rpm | Gyroscopic stiffening of forward, softening of backward whirl | forward +20 %, backward −20 % |
| Destabilising cross-coupling kxy = −kyx = q | Forward log dec < 0 < backward log dec | sign check |
| Amplification factor | Half-power AF vs 1/(2ζ) of the damped eigenvalue | < 2 % (76.6 vs 76.9) |
| Unbalance response far below the critical | me ω² / k_static | < 30 % (static estimate) |
| 20-mode Ritz reduction | Full model | frequencies < 0.5 % |
| Stepped hollow rotor on springs with disks | **CalculiX** B32R beam model | < 1 % (65.06 vs 65.37 Hz; 132.4 vs 132.8; 424.9 vs 426.6) |
| Anisotropic, cross-coupled bearings, gyroscopics, 0 and 1000 rad/s | **ROSS 3.0** | frequency < 0.1 %, log dec < 0.002 |
| API 617 separation-margin formula | 8th ed. structure (AF < 2.5 none; SM = min(16, 17(1 − 1/(AF − 1.5))) below, min(26, 10 + …) above) | exact |

During development the CalculiX check exposed that CalculiX 2.21 expands
`CIRC` beam sections inaccurately (−27 % on the simply supported bar); the
exported deck therefore uses equivalent square sections with scaled density,
which reproduce the analytical answer.

## Bearings, structures, torsion, seals, piping

| Case | Reference | Tolerance / result |
|---|---|---|
| Plain journal bearing, ε = 0.3 and 0.6 | Ocvirk short-bearing load capacity and attitude angle | ε < 1e-3, attitude < 0.1° |
| Plain journal bearing direct stiffness | Closed-form short-bearing coefficient | < 1 % |
| Plain bearing cross-coupling sign | kxy − kyx > 0 (destabilising) | sign check |
| Tilting-pad bearing (free pivots) | Zero cross-coupled stiffness and attitude angle | < 1e-6 relative |
| Uniform rotating annular disk | Timoshenko bore hoop stress; free radial boundaries | < 0.2 % |
| Two-inertia torsional system, and the same system through a gear | f = √(k(J₁+J₂)/(J₁J₂))/2π, n² referral | exact |
| Stepped-shaft Kt (D/d = 1.5, r/d = 0.05) | Peterson chart (~2.0) | 1.9–2.2 |
| Marin size and surface factors | Shigley formulas | exact |
| Labyrinth leakage trends | More teeth less, larger clearance more | monotonic |
| Wachel cross-coupling | q = Bc T/(D h) ρd/ρs | exact |
| Colebrook friction, Re = 1e5, ε/D = 1e-4 | Moody chart 0.0185 | < 0.0005 |
| IEC 60534 gas valve | Choking at x ≥ Fγ xT, Y = 2/3 when choked | exact |
| ISO 5167 orifice, β = 0.6 | C ≈ 0.60, ε ≈ 0.99 | range check |

## Integration

| Case | Check |
|---|---|
| Example project, full run | Plausible design (3–6 stages, 10–20 krpm, 0.75 < ηp < 0.86); power = ṁ Hp / η; stage march meets discharge pressure within 0.5 bar; rated case at 100 % speed; stable rotor; checklist complete; results JSON-serialisable |
| Map ordering | Flow increases and head falls along each speed line |
| Design change propagation | Higher discharge pressure → more head → more torque on the rotor |
| Intercooling | Lower discharge-temperature limit triggers multiple sections |
| User bearing coefficients | Workflow runs with user K/C |
| Storage | Revisions, history and stored runs round-trip |
| Optimisation | Parametric study and configuration comparison run on the workflow |
| Reports and CAD | HTML, PDF, Excel, STL, scene, STEP (CadQuery) generated |
| API | Health, thermo, project CRUD, run, history, exports, metric validation |
