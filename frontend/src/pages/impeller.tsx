import { useState } from "react";
import { fmt, type Json } from "../api";
import { Plot } from "../components/Plot";
import { FIELDS } from "../components/feaFields";
import { MeridionalSketch, VelocityTriangles } from "../components/ImpellerSketches";
import { Lazy, NeedRun, cas, sub, ImpellerFEAView, SectionPlot, Kpis, Table, Trace, type Ctx } from "./common";

export function ImpellerFEA({ fea }: { fea: Json }) {
  const [sel, setSel] = useState(0);
  const [field, setField] = useState("von_mises_mpa");
  const f = fea.impellers[Math.min(sel, fea.impellers.length - 1)];
  return (
    <section className="card accent" style={{ marginTop: 14 }}>
      <div className="row"><h3 style={{ margin: 0 }}>Impeller FEA — axisymmetric model, 3D result view</h3>
        <div className="chips" style={{ margin: 0 }}>{fea.impellers.map((x: Json, i: number) =>
          <button key={i} className={`chip ${sel === i ? "on" : ""}`} onClick={() => setSel(i)}>Impeller {x.impeller}</button>)}</div></div>
      <Kpis items={[["Peak σvm at MCS", `${fmt(f.max_vm_mcs_mpa, 0)} MPa`], ["Peak σvm at 115 %", `${fmt(f.max_vm_overspeed_mpa, 0)} MPa`],
        ["Yield use MCS / 115 %", `${fmt(f.yield_utilisation_mcs, 2)} / ${fmt(f.yield_utilisation_overspeed, 2)}`],
        ["Tip radial growth", `${fmt(f.tip_radial_growth_um, 0)} µm`], ["Eye growth / axial shift", `${fmt(f.eye_radial_growth_um, 0)} / ${fmt(f.eye_axial_shift_um, 0)} µm`],
        ["Mesh", `${f.elements} elements · ${f.nodes} nodes`]]} />
      <div className="grid">
        <Lazy><ImpellerFEAView key={sel} fea={f} /></Lazy>
        <div>
          <div className="chips">{FIELDS.slice(0, 5).map(([k, l]) => <button key={k} className={`chip ${field === k ? "on" : ""}`} onClick={() => setField(k)}>{l}</button>)}</div>
          <Lazy><SectionPlot model={f.model} field={field} caseName="MCS" /></Lazy>
          <p className="muted">Meridional section at MCS ({f.elements} quads; hover an element for its value). Range {fmt(Math.min(...f.model.cases.MCS[field]), 0)}–{fmt(Math.max(...f.model.cases.MCS[field]), 0)}.</p>
          <p className="muted">Eye growth and axial shift feed the eye-seal clearance check; blade stresses need a 3D cyclic-sector model.</p>
        </div>
      </div>
    </section>
  );
}

const VENDOR_FIELDS: [string, string, number][] = [["D2_mm", "D2 mm", 1], ["bore_mm", "Bore mm", 1], ["b2_mm", "b2 mm", 0.1], ["blades", "Blades", 1],
  ["mass_kg", "Mass kg", 0.01], ["cg_mm", "CG mm", 0.1], ["ip_kgm2", "Ip kg·m²", 0.001], ["it_kgm2", "It kg·m²", 0.001], ["yield_mpa", "Yield MPa", 1],
  ["uts_mpa", "UTS MPa", 1], ["E_gpa", "E GPa", 1], ["poisson", "ν", 0.01], ["density_kg_m3", "ρ kg/m³", 1], ["temperature_c", "T op °C", 1],
  ["min_radial_interference_mm", "Min radial interf. mm", 0.001]];

export function ImpellerPage(c: Ctx) {
  const k = cas(c);
  const [sel, setSel] = useState(0);
  if (!k) return <NeedRun results={c.results} />;
  const imps: Json[] = k.impellers.impellers;
  const st = k.impeller_stress.impellers;
  const i0 = Math.min(sel, imps.length - 1);
  const g = imps[i0];
  const d = st[Math.min(sel, st.length - 1)].mcs;
  const sp = k.lateral.speeds;
  const mcs = sp.mcs_rpm;
  const tip = (n: number) => n * Math.PI / 30 * g.D2_mm / 2000;
  const vend: Json[] = c.project.impeller_vendor ?? [];
  const setV = (n: number, key: string, val: string) => {
    const cur = vend.find((v) => v.impeller === n) ?? { impeller: n };
    const nv = { ...cur, [key]: val === "" ? null : Number(val) };
    const rest = vend.filter((v) => v.impeller !== n);
    sub(c, "impeller_vendor", Object.entries(nv).some(([q, x]) => q !== "impeller" && x != null) ? [...rest, nv].sort((a, b) => a.impeller - b.impeller) : rest);
  };
  const dhMin = Math.min(...imps.map((q) => q.de_haller));
  const mMax = Math.max(...imps.map((q) => q.triangles.inlet.tip.relative_mach));
  const m = g.material;
  return (
    <>
      <h2>Impeller design</h2>
      <p className="lead">Velocity triangles, blade angles and slip, diffusion (de Haller), meridional geometry, mass properties and the
        vendor data that replace the correlation estimates downstream (rotor model and FEA). Structural validation is in the Impeller FEA module.</p>
      <div className="kpis">
        <div className="kpi"><div className="v">{imps.length}</div><div className="l">Impellers in casing</div></div>
        <div className="kpi"><div className="v">{fmt(g.D2_mm, 0)} mm</div><div className="l">D2 (impeller {g.index + 1})</div></div>
        <div className="kpi"><div className="v">{fmt(tip(mcs), 0)} m/s</div><div className="l">Tip speed at MCS</div></div>
        <div className="kpi" style={{ borderTop: `3px solid var(--${dhMin >= 0.7 ? "pass" : dhMin >= 0.55 ? "attention" : "fail"})` }}><div className="v">{fmt(dhMin, 2)}</div><div className="l">Min de Haller w2/w1,tip (≥ 0.55)</div></div>
        <div className="kpi" style={{ borderTop: `3px solid var(--${mMax <= 0.9 ? "pass" : "fail"})` }}><div className="v">{fmt(mMax, 2)}</div><div className="l">Max inlet relative Mach (≤ 0.9)</div></div>
        <div className="kpi"><div className="v">{vend.length}</div><div className="l">Impellers with vendor data</div></div>
      </div>
      <div className="chips" style={{ marginTop: 12 }}>{imps.map((q: Json, i: number) =>
        <button key={i} className={`chip ${i0 === i ? "on" : ""}`} onClick={() => setSel(i)}>Impeller {q.index + 1}{q.vendor ? " ★" : ""}</button>)}</div>
      <div className="grid" style={{ marginTop: 8 }}>
        <div className="card"><h3>Velocity triangles — impeller {g.index + 1}</h3><VelocityTriangles g={g} /></div>
        <div className="card"><h3>Meridional section</h3><MeridionalSketch g={g} />
          <p className="muted small">b2/D2 {fmt(g.b2_D2, 4)} · eye/tip {fmt(g.eye_tip_ratio, 3)} · hub/tip {fmt(g.hub_tip_ratio, 3)} · φ {fmt(g.flow_coefficient, 4)} · ψ {fmt(g.head_coefficient, 3)}</p></div>
      </div>
      <div className="card" style={{ marginTop: 14 }}>
        <h3>Velocity triangles and aero checks</h3>
        <Table rows={imps} cols={[["Imp.", (i) => String(i.index + 1)], ["cm1 m/s", (i) => i.triangles.inlet.tip.cm, 0], ["U1 tip", (i) => i.triangles.inlet.tip.U, 0],
          ["w1 tip", (i) => i.triangles.inlet.tip.w, 0], ["β1 hub°", (i) => i.triangles.inlet.hub.beta_deg], ["β1 mean°", (i) => i.triangles.inlet.mean.beta_deg],
          ["β1 tip°", (i) => i.triangles.inlet.tip.beta_deg], ["β1b tip°", (i) => i.triangles.inlet.tip.beta_blade_deg], ["Incid.°", (i) => i.triangles.inlet.tip.incidence_deg],
          ["Mrel1", (i) => i.triangles.inlet.tip.relative_mach, 3], ["U2", (i) => i.triangles.outlet.U, 0], ["cm2", (i) => i.triangles.outlet.cm, 0],
          ["cu2", (i) => i.triangles.outlet.cu, 0], ["w2", (i) => i.triangles.outlet.w, 0], ["β2 flow°", (i) => i.triangles.outlet.beta_deg],
          ["β2 blade°", (i) => i.triangles.outlet.beta_blade_deg, 0], ["Slip σ", (i) => i.slip_factor, 3],
          ["de Haller", (i) => (i.de_haller < 0.55 ? `${fmt(i.de_haller, 2)} ⚠` : fmt(i.de_haller, 2))], ["b2/D2", (i) => i.b2_D2, 4],
          ["φ", (i) => i.flow_coefficient, 4], ["ψ", (i) => i.head_coefficient, 3], ["Work μ", (i) => i.work_coefficient, 3]]} />
        <p className="muted small">Angles from tangential. β1b = flow angle + design incidence; β2 blade = 90° − backsweep. de Haller w2/w1,tip below 0.55 (diffusion ratio above 1.8) flags excessive relative diffusion; 0.55–0.7 is normal for shroud-tip ratios.</p>
      </div>
      <div className="grid" style={{ marginTop: 14 }}>
        <div className="card"><h3>Speeds — impeller {g.index + 1}</h3>
          <Table rows={[["Rated", sp.rated_rpm ?? mcs / 1.05], ["Maximum continuous (MCS)", mcs], ["Trip (1.10 × MCS)", 1.1 * mcs], ["Overspeed test (1.15 × MCS)", 1.15 * mcs]].map(([l, n]) => ({ l, n }))}
            cols={[["Speed", (q) => q.l], ["rpm", (q) => q.n, 0], ["× MCS", (q) => q.n / mcs, 3], ["Tip speed m/s", (q) => tip(q.n), 1]]} /></div>
        <div className="card"><h3>Basic parameters</h3>
          <Table rows={[["D2", "mm", g.D2_mm, 1], ["Bore", "mm", g.bore_mm, 1], ["Mass", "kg", g.mass_kg, 2], ["CG from back face", "mm", g.cg_mm, 1],
            ["Ip", "kg·m²", g.ip_kgm2, 3], ["It", "kg·m²", g.it_kgm2, 3]].map(([l, u, v, n]) => ({ l, u, v, n, src: g.vendor && g.vendor[({ D2: "D2_mm", Bore: "bore_mm", Mass: "mass_kg", "CG from back face": "cg_mm", Ip: "ip_kgm2", It: "it_kgm2" } as Json)[l as string]] != null ? "vendor" : "estimate" }))}
            cols={[["Parameter", (q) => q.l], ["Unit", (q) => q.u], ["Value", (q) => (q.v == null ? "–" : fmt(q.v, q.n))], ["Source", (q) => q.src]]} /></div>
        <div className="card"><h3>Material</h3>
          <Table rows={[m]} cols={[["Material", (q) => q.name], ["E GPa", (q) => q.E_gpa, 0], ["ν", (q) => q.poisson, 2], ["ρ kg/m³", (q) => q.density_kg_m3, 0],
            ["Yield MPa", (q) => q.yield_mpa, 0], ["UTS MPa", (q) => q.uts_mpa, 0], ["T op °C", (q) => `${fmt(q.T_in_c, 0)} – ${fmt(q.temperature_c ?? q.T_out_c, 0)}`], ["Source", (q) => q.source]]} /></div>
      </div>
      <div className="card" style={{ marginTop: 14 }}>
        <h3>Vendor impeller data (optional)</h3>
        <p className="muted small">Values entered here replace the correlation estimates in the rotor model and the FEA (the FE wheel is scaled to the vendor mass and Ip).
          Leave blank to keep the estimate. Re-run the analysis to apply.</p>
        <div className="scroll"><table className="t"><thead><tr><th>Imp.</th>{VENDOR_FIELDS.map(([, l]) => <th key={l}>{l}</th>)}</tr></thead>
          <tbody>{imps.map((q) => { const v = vend.find((x) => x.impeller === q.index + 1) ?? {}; return (
            <tr key={q.index}><td>{q.index + 1}</td>{VENDOR_FIELDS.map(([f, , stp]) => <td key={f}><input className="inp cell" type="number" step={stp} style={{ width: 78 }}
              value={v[f] ?? ""} placeholder={q.estimate?.[f] != null ? fmt(q.estimate[f], 2) : q[f] != null && typeof q[f] === "number" ? fmt(q[f], 2) : ""}
              onChange={(e) => setV(q.index + 1, f, e.target.value)} /></td>)}</tr>); })}</tbody></table></div>
        {imps.some((q) => q.validation?.length) && <>
          <h3 style={{ marginTop: 12 }}>Validation — app estimate vs vendor</h3>
          <Table rows={imps.flatMap((q) => (q.validation ?? []).map((v: Json) => ({ ...v, imp: q.index + 1 })))}
            cols={[["Imp.", (v) => String(v.imp)], ["Quantity", (v) => v.key], ["App estimate", (v) => v.estimate, 3], ["Vendor", (v) => v.vendor, 3], ["Diff %", (v) => v.diff_pct, 1],
              ["Limit ± %", (v) => v.limit_pct, 0], ["Status", (v) => v.status]]} /></>}
      </div>
      <div className="card" style={{ marginTop: 14 }}>
        <h3>Geometry and mass properties</h3>
        <Table rows={imps} cols={[["Imp.", (i) => String(i.index + 1)], ["D2 mm", (i) => i.D2_mm, 0], ["b2 mm", (i) => i.b2_mm],
          ["Eye mm", (i) => i.D1_eye_mm, 0], ["Hub mm", (i) => i.hub_mm, 0], ["Bore mm", (i) => i.bore_mm, 0], ["Blades", (i) => String(i.blades)],
          ["Mass kg", (i) => i.mass_kg], ["Ip kg·m²", (i) => i.ip_kgm2, 3], ["It kg·m²", (i) => i.it_kgm2, 3], ["Thrust kN", (i) => i.thrust_n / 1e3, 2],
          ["Umax mat. m/s", (i) => i.max_tip_speed_for_material_m_s, 0]]} />
      </div>
      <div className="grid" style={{ marginTop: 14 }}>
        <div className="card">
          <h3>Disk stress at MCS (rotating-disk estimate)</h3>
          <Plot data={[
            { x: d.r_m.map((x: number) => x * 1e3), y: d.sigma_t_pa.map((x: number) => x / 1e6), name: "Tangential", mode: "lines" },
            { x: d.r_m.map((x: number) => x * 1e3), y: d.sigma_r_pa.map((x: number) => x / 1e6), name: "Radial", mode: "lines" },
            { x: d.r_m.map((x: number) => x * 1e3), y: d.von_mises_pa.map((x: number) => x / 1e6), name: "von Mises", mode: "lines" },
          ]} layout={{ xaxis: { title: "Radius (mm)" }, yaxis: { title: "Stress (MPa)" } }} />
        </div>
        <div className="card">
          <h3>Stress summary</h3>
          <Table rows={st} cols={[["Imp.", (s) => String(s.impeller)], ["σvm MCS MPa", (s) => s.max_vm_mcs_mpa, 0],
            ["σvm 115 % MPa", (s) => s.max_vm_overspeed_mpa, 0], ["σθ avg 115 % MPa", (s) => s.avg_tangential_overspeed_mpa, 0],
            ["avg / 0.9 Sy", (s) => s.overspeed_average_ratio, 2], ["Burst rpm", (s) => s.burst_speed_rpm, 0], ["Burst margin", (s) => s.burst_margin, 2],
            ["Tip growth µm", (s) => s.tip_growth_um, 0]]} />
          <p className="muted small">Design-level estimate. The 3D cyclic-sector validation (MCS, overspeed, bore contact, acceptance) is in the Impeller FEA module.</p>
        </div>
      </div>
      <Trace trace={k.impellers.trace} />
      <Trace trace={k.impeller_stress.trace} />
    </>
  );
}
