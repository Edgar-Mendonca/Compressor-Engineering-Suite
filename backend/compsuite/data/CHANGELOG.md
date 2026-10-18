# CentriForge changelog

Release notes shown on the launcher. Newest first. Releases are published
from version tags (vX.Y.Z) with a Windows installer attached.

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
