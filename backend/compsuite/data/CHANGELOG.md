# CentriForge changelog

Release notes shown on the launcher. Newest first. Releases are published
from version tags (vX.Y.Z) with a Windows installer attached.

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
