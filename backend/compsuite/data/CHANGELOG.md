# CentriForge changelog

Release notes shown on the launcher. Newest first. Releases are published
from version tags (vX.Y.Z) with a Windows installer attached.

## 0.5.7 - 2026-10-20
- New module **CFD-lite flow**: (A) hub-to-shroud flow field by streamline curvature through the inlet, impeller and vaneless diffuser (relative Mach, velocities, pressure, temperature, flow angle); (B) blade-to-blade loading on hub / mid / shroud with diffusion ratio, pressure-side reversal and inducer choke margin, plus the mid-span passage field; (C) vaneless diffuser with friction, rotating-stall margin and volute radial force; (D) return-channel vane cascade by a panel method (loading, deviation, streamlines); (E) CFD case export (TurboGrid-style curves, boundary conditions, field CSV); animated particles in every field; CFD-lite report
- Robustness: physical limits on the inputs with clear messages (for example a negative pressure or an efficiency entered in %); discharge must be above suction
- Robustness: every report is tested for every example and run level; a browser smoke test opens every page in CI; lint (ruff) in CI
- Robustness: unexpected engine errors reach the app as a readable message; silent fallbacks now write a warning to the log; File > Copy diagnostics collects the version, platform and log tail for a bug report
- The page code is split into one file per domain; unused code removed
- FEA: the von Mises minimum can no longer show a small negative value; the design report gives bearing coefficients in MN/m and kN s/m

## 0.5.6 - 2026-10-20
- New module **Dynamics & anti-surge**: time-domain simulation of the compressor system built from the design (performance map, real-gas properties, volumes, cooler, check valve, ESD, anti-surge and hot-gas bypass valves, driver and the train inertia from the torsional model, anti-surge controller with control line and trip line)
- Studies: emergency shutdown, ESD with hot-gas bypass, normal stop, driver trip, blocked discharge, deep surge (controller out of service), start-up from settle-out and a speed step; every event can be edited (trip, valve moves, controller on / off, speed set-point)
- Editable P&ID: drag the equipment, edit any vessel, valve, the compressor, the driver or the controller, add volumes, coolers, valves, check valves and piping
- Animation: flow along the lines (direction and size), valve openings, live pressure / temperature tags, the operating point moving on the map with the surge and control lines, live trends of margin, speed, pressures, flows, valve positions, power and temperature
- Dynamic simulation report in the house style (P&ID, model tables, events, map trajectory, trends, comparison of all studies, conclusions, sign-off)

## 0.5.5 - 2026-10-19
- 3D FEA viewer: element mesh lines over the results, crisp colour bands (8-16, or smooth) with a labelled colour bar, MAX / MIN markers with values, faint undeformed outline, front / back / side / sector / iso views, fit, axis triad, report-quality picture export (white, 3x) and "Add to report" pictures
- FEA report rebuilt in the house style (cover, contents, sign-off) with banded contour pictures and MAX / MIN, mesh pictures, further fields, hot-spot table, stress along paths, bore contact and shrink fit, spin test, permanent deformation, Campbell / SAFE, mode shapes and the Goodman diagram
- Rotor model drawing in the vendor style (stepped shaft, impellers, added masses, spring-damper bearings, close clearances, CG, stations) in the rotor, lateral and stability pages, with animated mode shapes and deflected shapes over it
- 3D rotor view: whirl orbits at the stations and the deflected centreline, forward (green) and backward (orange) modes
- Torsional page: mass-elastic train model (as in the report) and animated mode shapes on the model; reports add mode shapes on the train / rotor model and damped mode shapes at MCS
- Design-study (calculation) report rebuilt in the house style: datasheet, cases, map, stages and impellers, rotor and shaft, bearings, seals and lube oil, lateral with mode shapes on the rotor, torsional, checklist, methods and sign-off

## 0.5.4 - 2026-10-18
- Fixed the "Unhandled exception in script - WinError 87" dialog: on closing the app the watchdog restarted the engine process while the window process was exiting; the watchdog now stops first, the engine exits quietly if its parent has gone, and the release self-test starts and stops the engine process the way the app does
- Report pictures are sharp and on a white background: the captured 2.5D drawings keep their colours (theme gradients resolved) at high resolution and are embedded in the PDF without resampling
- Torsional report: the train model drawing (mass-elastic stations, coupling springs, gear mesh, station numbers) is shown again
- Code clean-up (unused code removed), the engine log is kept small, README rewritten with every module, the workflows, the reports and the release plan

## 0.5.3 - 2026-10-18
- Shop test illustrations redrawn as one shared 2.5D test train for the MRT and the PT (lube console, VFD, motor, LS / HS couplings with guards, gearbox with toothed gears, compressor with DE / NDE housings and flanged nozzles, seal gas panel), oil and seal-gas lines with flow arrows; the PT adds the closed loop (gas cooler, flow element spool, gas charging, control valve with anti-surge bypass) with red / blue gas flow; instruments can be shown or hidden; the same pictures go into the reports
- Lateral: minimum / average / maximum bearing clearance and oil inlet temperature cases (optionally the two mixed cases), labyrinth and balance-drum seal coefficients in the response model, flexible bearing supports (series stiffness / damping), response curves at every close-clearance station, rotor-weight check against the drawing, bearing make / model
- Torsional: Campbell diagram in absolute values (rpm / Hz), protection clearing time for the short-circuit torque, cumulative fatigue (Miner) over the number of events, torque-reversal check through couplings / gear mesh
- New PDF reports in the CentriForge style: Lateral analysis, Stability analysis and Torsional analysis (cover and summary, contents, scope / references / assumptions, compressor, rotor and bearing data, node-numbered rotor model, bearing and seal coefficients, critical speed map with min / avg / max stiffness, mode shapes, damped Campbell, unbalance response per case with AF / SM notes, deflected shapes, clearance check with the 75 % column, URT check point, screening with sensitivity, screening chart and Kirk-Donald plot, Level II log decrement vs speed, train model, natural frequencies, Campbell, separation margins, steady-state, VSD and short-circuit results, conclusions, appendices, legend and sign-off)

## 0.5.2 - 2026-10-18
- Generic instrument tags and legend instead of a vendor's naming: radial probes DE-X / DE-Y / NDE-X / NDE-Y (45 deg from top dead centre viewed from the driver, API 670 / ISO 20816), axial AX-A / AX-B, keyphasor KPH, bearing TE-DE / TE-NDE / TE-TA / TE-TI, lube oil TE-LO-IN / PT-LO-IN, seal gas FT-SG-DE / FT-SG-NDE, process PT-S / TE-S / PT-D / TE-D / dP-FE, speed SE, power JT. Every tag and description can be renamed on the new "Tags & glossary" tab (saved with the project) and the pages, live tags and reports follow; glossary of abbreviations included
- Reports rebuilt as professional documents: cover with the 2.5D picture from the app and a result summary, contents page, running header and footer with document number, revision and "page i of n", banded tables, legend page and sign-off page (document number, client, equipment tag and sign-off names entered in the app)
- Mechanical running test: slow-roll runout and compensated / uncompensated Bode, orbits at MCS and trip, shaft centreline, critical speeds with AF and API 617 separation margins, sub-synchronous screening, bearings and oil (loads, film, oil flow, temperature rise), lube-oil variation test table, 15-min log with seal vent flows and drain temperatures, overspeed trip test, instrument list with calibration, deviations, inspection findings; more acceptance checks (oil temperature rise, seal vent flow, trip test, separation margin)
- Mechanical running test animation: keyphasor, axial probes, dry gas seal panel with seal gas and vent flows, live tags for vibration, bearing, drain, seal gas, oil and speed
- Performance test animation rebuilt as the full test sequence on a timeline (play, pause, speed, scrub, jump to a speed line): charging, start-up, mechanical run, each point throttled, stabilised and recorded, surge approach with the anti-surge valve, venting and coast-down; live tags on the loop, stability checklist with timer, recorded points, live test map, efficiency, power and fluctuation charts
- Performance test results: PTC 10 Reynolds-number correction (RA / RB), balance-piston and seal leakage, estimated casing heat loss, mechanical losses, stability check per point, work coefficient, similarity per point against its equivalent specified point, discharge pressure curve, surge line, deviation from prediction per speed line, gas composition and properties, worked data-reduction example, conclusions

## 0.5.1 - 2026-10-18
- Fixed the desktop app freezing ("Not responding"), slow loading and the need to restart: on every page load the window bridge exposed the native window object, and pywebview's scan of it waited on the window itself (a deadlock). The bridge now exposes only its file functions; the page API is ready in milliseconds

## 0.5.0 - 2026-10-18
- New module: performance test to ASME PTC 10-2022 - Type 1 (specified gas) or Type 2 (substitute gas) with every test-gas combination (CO2, N2, R134a, CO2/N2, He/N2, custom) screened against the PTC 10 similarity limits, stand limits, critical speeds and the phase envelope; the export gas example loads a CO2 Type 2 test
- Animated 2.5D closed test loop: gas flow coloured by temperature, control valve, cooler, orifice, gas charging, anti-surge, dry-gas-seal panel, live instruments and test map, run a speed line to surge
- Data reduction: ISO 5167 orifice, static-to-total conversion, Sandberg-Colby / Schultz / path head, casing heat loss, conversion to specified conditions, optional speed adjustment, PTC 19.1 uncertainty, API 617 acceptance (head, power 104 %, surge), coast-down check, test log import / export, PDF report
- Mechanical running test: live trend, Bode and spectrum charts under the animated train, probes named 1R1X / 1R1Y / 1R2X / 1R2Y, report with the drawn test train, set-up table, trend chart, Bode and polar plots per probe, spectra per test speed, waterfall and spectrogram
- Faster and more responsive: the engineering engine runs in its own process (no more "Not responding" during analyses, auto-restart if it stops), animations only redraw while playing, heavy pages and the 3D views load on demand (start-up bundle 800 kB -> 300 kB), progress and Cancel for analysis runs, update check cached
- R134a added to the property components

## 0.4.1 - 2026-10-18
- Modules in engineering order: materials, impeller design, impeller FEA, rotor, bearings, shop tests, lateral & stability, torsional, mechanical running test, systems, reports
- Impeller design: velocity triangles, blade angles, de Haller ratio, meridional sketch, vendor-data override with estimate-vs-vendor table
- Impeller FEA validation page as a step-by-step report: inputs, model, validation, results in three views, bore contact length >= 50 %, overspeed by two methods, acceptance table, run-all summary
- Lateral (API 617-2022): min / max bearing clearance cases, unbalance per mode shape and coupling, AF / SM tables, Scc clearance check, deflected shapes
- Stability: cross-coupling per impeller, Level I screening, Level II with labyrinth and balance-piston coefficients at min / max seal clearance
- Torsional: motor - gearbox - compressor train, Campbell with 1X/2X and line frequency, dangerous-mode check, steady-state stresses, coupling Goodman (API 671), VSD harmonics, 2- and 3-phase short circuit
- New module: mechanical running test - animated test train, speed-time plan with oil sequences, predicted Bode / polar / waterfall, acceptance, unbalanced rotor response test, test log, gas leak test, PDF
- Shop tests now cover balancing and overspeed; the running test moved to its own module
- Tilting-pad bearings: optional pivot stiffness; examples updated (VFD motor + gearbox, swirl brakes, Alloy 718 export impellers, sour example 5 impellers per casing) - both examples pass all checks

## 0.4.0 - 2026-10-17
- Impeller FEA Pro: 3D cyclic-sector model (hub, blade, shroud), centrifugal, pressure, thermal and shrink-fit loads
- Elastic-plastic 115 % overspeed with permanent growth, burst margin, Goodman (HCF) and LCF fatigue
- Modes by nodal diameter with stress stiffening, Campbell and SAFE interference diagrams, mode animation
- 3D viewer: all stress / strain / displacement fields, probe, cut plane, extremes, paths, spin-test animation
- Exports: FEA report (PDF), ParaView (.vtu), CalculiX deck (.inp), snapshot PNG
- Shop tests (API 617): balancing limits, residual unbalance check, high-speed balancing, running test, overspeed record, with animations
- Rotor thrust: impellers, balance piston, coupling friction, thrust bearing load and collar speed
- Fixed: impeller geometry for low-pressure high-flow stages (sour gas example), each impeller modelled individually
- Save As dialog for every export, project files (.cfproj) with Open / Save / Save As, recent files and autosave recovery

## 0.3.0 - 2026-10-17
- Faster start: splash window at once, solver loads in the background, no automatic example run
- Start page: new project with guided setup, example gallery, guided tutorial, recent projects, import
- New sour gas reinjection example (30 % H2S, wet first stage)
- All charts redrawn in a GraphPad Prism style (matplotlib), the same in the app and the reports
- Chart editor: titles, axis ranges and log scales, legend, fonts, sizes, colours, markers, line styles
- Data cursor on every chart; export PNG (up to 1200 dpi), SVG, PDF and CSV
- Material assessment rebuilt: per-stage sour/wet table, dew-point and SSC domain charts, corrosion acceptance by component, auto material selection, weld overlay, SOP and contaminant checks, material selection report

## 0.2.0 - 2026-10-17
- New name and logo: CentriForge, compressor engineering suite
- Windows installer with its own app window - no Python, Node or command line needed
- Launcher page with version, release notes and module tiles in workflow order (01-14)
- One-click update from GitHub Releases; projects are kept in Documents/CentriForge
- New engineering look: IBM Plex type, engineering blue, light and dark themes
- Project import and export as JSON files

## 0.1.0 - 2026-10-10
- Thermodynamics, compression, selection and performance maps
- Impellers with axisymmetric FEA and 3D viewer; rotor and shaft design
- Bearings, seals, lateral and torsional rotordynamics
- Material assessment for sour and wet service; lube oil and piping
- Optimisation studies, verification checklist and reports
