import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { fmt, type Json } from "../api";
import { safeName, saveBlob, saveFrom } from "../files";
import { ramp } from "./feaFields";
import { Plot, SERIES } from "./Plot";

// 3D impeller FEA Pro: on-demand cyclic-sector solve (backend structural/impeller3d.py),
// 3D viewer (full 360 / sector, fields, deformation, cut plane, probe, extremes),
// mode and spin-test animations, paths, SAFE, fit, fatigue, convergence and exports.

export const FIELDS: [string, string][] = [["von_mises_mpa", "von Mises (MPa)"], ["max_principal_mpa", "Max principal (MPa)"], ["hoop_mpa", "Hoop (MPa)"],
  ["radial_mpa", "Radial (MPa)"], ["axial_mpa", "Axial (MPa)"], ["strain_ue", "Equivalent strain (µε)"], ["disp_um", "Displacement (µm)"],
  ["ur_um", "Radial displacement (µm)"], ["uz_um", "Axial displacement (µm)"], ["safety_factor", "Safety factor vs yield"],
  ["temperature_c", "Temperature (°C)"], ["plastic_strain_ue", "Plastic strain (µε)"], ["residual_ur_um", "Permanent radial growth (µm)"]];
const TABS = ["3D results", "Paths", "Modes & SAFE", "Spin test", "Shrink fit", "Fatigue", "Convergence", "Export"];

export type View = { field: string; caseName: string; scale: number; full: boolean; cut: number; wire: boolean; mode: number | null; spin: boolean; cam?: "iso" | "sector" | "front" | "back" };

export function Viewer({ r, v, setProbe, anim, h: height }: { r: Json; v: View; setProbe: (p: Json) => void; anim: Json; h?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const live = useRef<Json>({});
  live.current.anim = anim;
  live.current.v = v;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mesh = r.mesh, Z = v.full ? mesh.Z : 1, a = mesh.alpha;
    const N: number[][] = mesh.nodes_mm, F: number[][] = mesh.faces;
    const caseD = r.cases[v.caseName] ?? {};
    const vals: number[] = caseD[v.field] ?? caseD.von_mises_mpa;
    const U: number[][] = r.displacement_um[v.caseName] ?? N.map(() => [0, 0, 0]);
    const lo = Math.min(...vals), hi = Math.max(...vals);
    const w = el.clientWidth, h = el.clientHeight;
    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.localClippingEnabled = true;
    el.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b1220);
    const R = mesh.r_tip_mm / 1000;
    const cam = new THREE.PerspectiveCamera(35, w / h, 0.001, 20);
    // camera presets: impeller axis = three y (eye side up); sector 0 lies on +x
    const presets: Record<string, [number[], number[]]> = { iso: [[R * 2.2, R * 1.7, R * 2.4], [0, R * 0.2, 0]], front: [[0, R * 3.6, 0.001], [0, 0, 0]],
      back: [[0, -R * 3.6, 0.001], [0, 0, 0]], sector: [[R * 1.9, R * 1.1, R * 0.9], [R * 0.75, R * 0.15, 0]] };
    const [cp, ct] = presets[v.cam ?? "iso"];
    cam.position.set(cp[0], cp[1], cp[2]);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x223344, 1.3));
    const sun = new THREE.DirectionalLight(0xffffff, 1.2);
    sun.position.set(1, 2, 1.5);
    scene.add(sun);
    const fill = new THREE.DirectionalLight(0xffffff, 0.9);
    fill.position.set(-1, -2, -1.5);
    scene.add(fill);
    const holder = new THREE.Group();
    scene.add(holder);
    // geometry: replicate the sector Z times; impeller axis z -> three y
    const tri: number[] = [];
    F.forEach((f) => tri.push(f[0], f[1], f[2], f[0], f[2], f[3]));
    const nN = N.length;
    const base = new Float32Array(nN * Z * 3), disp = new Float32Array(nN * Z * 3), col = new Float32Array(nN * Z * 3);
    const idx: number[] = [];
    for (let s = 0; s < Z; s++) {
      const c = Math.cos(s * a), sn = Math.sin(s * a);
      for (let i = 0; i < nN; i++) {
        const [x, y, z] = N[i], [ux, uy, uz] = U[i] ?? [0, 0, 0];
        const k = 3 * (s * nN + i);
        base[k] = (c * x - sn * y) / 1000; base[k + 1] = z / 1000; base[k + 2] = -(sn * x + c * y) / 1000;
        disp[k] = (c * ux - sn * uy) / 1e6; disp[k + 1] = uz / 1e6; disp[k + 2] = -(sn * ux + c * uy) / 1e6;
        const cc = ramp((vals[i] - lo) / (hi - lo || 1));
        col[k] = cc[0]; col[k + 1] = cc[1]; col[k + 2] = cc[2];
      }
      tri.forEach((q) => idx.push(q + s * nN));
    }
    const pos = new Float32Array(base.length);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE.BufferAttribute(col, 3));
    g.setIndex(idx);
    const clip = [new THREE.Plane(new THREE.Vector3(0, 0, -1), 1)];
    const mat = new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.DoubleSide, roughness: 0.5, metalness: 0.1, wireframe: v.wire,
      clippingPlanes: clip, clipShadows: true });
    const obj = new THREE.Mesh(g, mat);
    holder.add(obj);
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(g, 30), new THREE.LineBasicMaterial({ color: 0x0b1220, transparent: true, opacity: 0.25, clippingPlanes: clip }));
    if (!v.wire) holder.add(edges);
    // extremes markers (sector 0)
    const imax = vals.indexOf(hi), imin = vals.indexOf(lo);
    const mk = (i: number, c: number) => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(R * 0.025), new THREE.MeshBasicMaterial({ color: c, clippingPlanes: clip }));
      m.position.set(base[3 * i], base[3 * i + 1], base[3 * i + 2]);
      holder.add(m);
      return m;
    };
    const mMax = mk(imax, 0xff2d55), mMin = mk(imin, 0x2dd4ff);
    const grid = new THREE.PolarGridHelper(R * 1.4, 12, 6, 64, 0x2b3a4f, 0x1c2836);
    grid.position.y = -0.003;
    scene.add(grid);
    const ctl = new OrbitControls(cam, renderer.domElement);
    ctl.enableDamping = true;
    ctl.target.set(ct[0], ct[1], ct[2]);

    // mode shape (complex sector shape -> full annulus for nodal diameter k)
    const shape = v.mode !== null ? r.mode_shapes[v.mode] : null;
    const modeVec = new Float32Array(base.length);
    if (shape) {
      for (let s = 0; s < Z; s++) {
        const c = Math.cos(s * a), sn = Math.sin(s * a), ph = shape.nd * s * a, cp = Math.cos(ph), sp = Math.sin(ph);
        for (let i = 0; i < nN; i++) {
          const re = shape.re[i], im = shape.im[i];
          const vx = re[0] * cp - im[0] * sp, vy = re[1] * cp - im[1] * sp, vz = re[2] * cp - im[2] * sp;
          const k = 3 * (s * nN + i);
          modeVec[k] = c * vx - sn * vy; modeVec[k + 1] = vz; modeVec[k + 2] = -(sn * vx + c * vy);
        }
      }
    }
    const raycaster = new THREE.Raycaster();
    const onClick = (e: MouseEvent) => {
      const b = renderer.domElement.getBoundingClientRect();
      raycaster.setFromCamera(new THREE.Vector2(((e.clientX - b.left) / b.width) * 2 - 1, -((e.clientY - b.top) / b.height) * 2 + 1), cam);
      const hit = raycaster.intersectObject(obj)[0];
      if (!hit || !hit.face) return;
      const cand = [hit.face.a, hit.face.b, hit.face.c];
      const p = hit.point;
      const best = cand.reduce((q, i) => (p.distanceToSquared(new THREE.Vector3(pos[3 * i], pos[3 * i + 1], pos[3 * i + 2])) <
        p.distanceToSquared(new THREE.Vector3(pos[3 * q], pos[3 * q + 1], pos[3 * q + 2])) ? i : q), cand[0]);
      const ni = best % nN;
      const [x, y, z] = N[ni];
      setProbe({ node: ni, r_mm: Math.hypot(x, y), z_mm: z, values: Object.fromEntries(FIELDS.filter(([k]) => caseD[k]).map(([k, l]) => [l, caseD[k][ni]])) });
    };
    renderer.domElement.addEventListener("click", onClick);
    let raf = 0, t0 = performance.now(), lastSig = "";
    const loop = () => {
      const now = performance.now(), t = (now - t0) / 1000;
      const L = live.current, an = L.anim, vv: View = L.v;
      let sc = vv.scale, extra = 0, speedRot = vv.spin ? 0.004 : 0;
      if (an?.kind === "spin") {
        // spin test: elastic growth with speed^2, colours from the frame, permanent growth after spin-down
        const s = an.speed;
        sc = vv.scale * Math.min(s, 1.15) ** 2 / 1.0;
        speedRot = 0.002 + s * 0.05;
        const cs = an.colors as Float32Array | undefined;
        if (cs) (g.getAttribute("color") as THREE.BufferAttribute).copyArray(cs).needsUpdate = true;
        if (an.residual) sc = vv.scale * 0;
        extra = an.residual ? 1 : 0;
      }
      const mode = shape ? Math.sin(t * 4) * R * 0.04 : 0;
      const sig = `${sc}|${mode.toFixed(6)}|${extra}|${an?.resVec ? 1 : 0}`;
      if (sig !== lastSig) {            // geometry only when the deformation changes, not every frame
        lastSig = sig;
        for (let k = 0; k < pos.length; k++) pos[k] = base[k] + disp[k] * sc + modeVec[k] * mode + (extra ? (an.resVec?.[k] ?? 0) : 0);
        (g.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
        g.computeVertexNormals();
      }
      clip[0].constant = vv.cut >= 100 ? 10 : (vv.cut / 100) * R * 1.2;
      mMax.visible = mMin.visible = !shape && !an;
      holder.rotation.y += speedRot;
      ctl.update();
      renderer.render(scene, cam);
      raf = requestAnimationFrame(loop);
    };
    loop();
    live.current.snap = () => renderer.domElement.toDataURL("image/png");
    return () => {
      cancelAnimationFrame(raf);
      renderer.domElement.removeEventListener("click", onClick);
      ctl.dispose(); renderer.dispose(); renderer.forceContextLoss(); g.dispose();
      el.removeChild(renderer.domElement);
    };
  }, [r, v.field, v.caseName, v.full, v.wire, v.mode, v.cam]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { (window as Json).__feaSnap = () => live.current.snap?.(); }, []);
  return <div ref={ref} className={height ? "viewer" : "viewer tall"} style={height ? { height } : undefined} />;
}

export function Legend({ vals, label }: { vals: number[]; label: string }) {
  const lo = Math.min(...vals), hi = Math.max(...vals);
  return (
    <div className="legend"><span>{fmt(lo, 1)}</span>
      <div className="bar" style={{ background: `linear-gradient(90deg, ${[0, .2, .4, .6, .8, 1].map((t) => `rgb(${ramp(t).map((c) => Math.round(c * 255)).join(",")})`).join(",")})` }} />
      <span>{fmt(hi, 1)}</span><span className="muted">{label}</span></div>);
}

export function Fea3D({ project, results, casing }: { project: Json; results: Json; casing: number }) {
  const cas = results?.casings?.[casing];
  const [imp, setImp] = useState(0);
  const [opts, setOpts] = useState<Json>({ level: 2, interference_um_per_mm: 0, diffuser_vanes: 0, igv_vanes: 0, return_vanes: 0, alt_fraction: 0.03, starts_per_year: 300 });
  const [r, setR] = useState<Json>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [t0, setT0] = useState(0);
  const body = { project, casing, impeller: imp, opts };

  const run = async () => {
    setBusy(true); setErr(""); setT0(Date.now());
    try {
      const res = await fetch("/api/fea3d", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error((await res.json()).detail ?? res.statusText);
      setR(await res.json());
    } catch (e) { setErr((e as Error).message); } finally { setBusy(false); }
  };
  const [tick, setTick] = useState(0);
  useEffect(() => { if (!busy) return; const t = setInterval(() => setTick(Date.now()), 500); return () => clearInterval(t); }, [busy]);

  if (!cas) return null;
  const imps: Json[] = cas.impellers.impellers;
  const s = r?.summary;
  const name = r ? `${safeName(project.name)}_impeller${r.impeller}` : "";

  return (
    <div className="card" style={{ marginTop: 14 }}>
      <h3>Impeller FEA Pro — 3D cyclic-sector model</h3>
      <div className="toolbar">
        <select className="inp" value={imp} onChange={(e) => { setImp(Number(e.target.value)); setR(null); }} aria-label="Impeller">
          {imps.map((q, i) => <option key={i} value={i}>Impeller {q.index + 1} · D2 {fmt(q.D2_mm, 0)} mm</option>)}</select>
        <label className="muted">Mesh<select className="inp" value={opts.level} onChange={(e) => setOpts({ ...opts, level: Number(e.target.value) })}>
          <option value={1}>Coarse</option><option value={2}>Medium</option><option value={3}>Fine</option></select></label>
        {([["interference_um_per_mm", "Fit µm/mm (0 = auto)", 0.1], ["diffuser_vanes", "Diffuser vanes", 1], ["igv_vanes", "IGV vanes", 1], ["return_vanes", "Return vanes", 1],
          ["alt_fraction", "Alt. stress ratio", 0.01], ["starts_per_year", "Starts / year", 10]] as const).map(([k, l, st]) =>
          <label key={k} className="muted">{l}<input className="inp cell" type="number" step={st} value={opts[k]} onChange={(e) => setOpts({ ...opts, [k]: Number(e.target.value) })} /></label>)}
        <button className="btn primary" disabled={busy} onClick={run}>{busy ? `Solving… ${Math.round((tick - t0) / 1000) || 0} s` : r ? "Re-run 3D FEA" : "Run 3D FEA"}</button>
      </div>
      {err && <div className="error">{err}</div>}
      {!r && !busy && <p className="muted">Builds a 3D sector (hub, blade, shroud) for the selected impeller and solves the centrifugal, pressure, thermal and shrink-fit
        load cases, the elastic-plastic 115 % overspeed, the modes with stress stiffening and the fatigue checks (about 10–30 s).</p>}
      {r && <>
        <div className="kpis">{[["Peak σvm MCS", `${fmt(s.peak_vm_mcs_mpa, 0)} MPa · ${s.peak_zone}`], ["Yield use MCS", fmt(s.yield_utilisation_mcs, 2)],
          ["Overspeed yielded vol.", `${fmt(s.plastic_volume_overspeed_pct, 2)} %`], ["Permanent bore / eye", `${fmt(s.permanent_bore_growth_um, 1)} / ${fmt(s.permanent_eye_growth_um, 1)} µm`],
          ["Burst margin", fmt(s.burst_margin, 2)], ["Lift-off / MCS", fmt(s.lift_off_ratio, 2)], ["Goodman SF", fmt(s.goodman_sf_min, 2)],
          ["LCF cycles", Number(s.lcf_cycles).toExponential(2)], ["Mesh", `${s.elements} hex · ${s.dof} DOF · ±${fmt(s.convergence_error_pct ?? 0, 1)} %`]].map(([l, x]) =>
          <div className="kpi" key={l}><div className={`v ${String(x).length > 16 ? "long" : ""}`}>{x}</div><div className="l">{l}</div></div>)}</div>
        <table className="t" style={{ marginBottom: 12 }}><tbody>{r.checks.map((c: Json) => <tr key={c.check}><td>{c.check}</td><td className="muted">{c.criterion}</td>
          <td className="n">{typeof c.value === "number" ? fmt(c.value, 3) : c.value}</td><td><span className={`pill ${c.status}`}>{c.status}</span></td></tr>)}</tbody></table>
        <FeaExplorer r={r} body={body} name={name} />
      </>}
    </div>
  );
}

/** Tabbed explorer of one 3D FEA result: 3D view, paths, modes / SAFE, spin test, fit, fatigue, convergence, export. */
export function FeaExplorer({ r, body, name }: { r: Json; body: Json; name: string }) {
  const [tab, setTab] = useState(0);
  const [v, setV] = useState<View>({ field: "von_mises_mpa", caseName: "MCS combined", scale: 200, full: true, cut: 100, wire: false, mode: null, spin: false });
  const [probe, setProbe] = useState<Json>(null);
  const [anim, setAnim] = useState<Json>(null);
  // spin-test animation: 0 -> 115 % -> hold -> 0, then permanent growth
  const spin = useMemo(() => {
    if (!r) return null;
    const mc = r.cases["Centrifugal MCS"].von_mises_mpa as number[], os = r.cases["Overspeed 115 % (elastic-plastic)"];
    const pl = os.plastic_strain_ue as number[], hi = Math.max(...os.von_mises_mpa);
    return { mc, os: os.von_mises_mpa as number[], pl, hi };
  }, [r]);
  useEffect(() => {
    if (!anim?.playing || !spin || !r) return;
    let raf = 0;
    const start = performance.now();
    const Z = v.full ? r.mesh.Z : 1, nN = r.mesh.nodes_mm.length;
    const colors = new Float32Array(nN * Z * 3);
    const res = r.cases["Overspeed 115 % (elastic-plastic)"].residual_ur_um as number[];
    const resVec = new Float32Array(nN * Z * 3);
    for (let s = 0; s < Z; s++) for (let i = 0; i < nN; i++) {
      const [x, y] = r.mesh.nodes_mm[i], rr = Math.hypot(x, y) || 1, a = s * r.mesh.alpha;
      const ux = (x / rr) * res[i] * 1e-6 * 2000, uy = (y / rr) * res[i] * 1e-6 * 2000;
      const k = 3 * (s * nN + i);
      resVec[k] = Math.cos(a) * ux - Math.sin(a) * uy; resVec[k + 2] = -(Math.sin(a) * ux + Math.cos(a) * uy);
    }
    const loop = () => {
      const t = (performance.now() - start) / 1000 * anim.rate;
      const speed = t < 6 ? 1.15 * t / 6 : t < 8 ? 1.15 : t < 11 ? 1.15 * (11 - t) / 3 : 0;
      const residual = t >= 11;
      for (let s = 0; s < Z; s++) for (let i = 0; i < nN; i++) {
        let val = speed <= 1 ? spin.mc[i] * speed * speed : spin.mc[i] + (spin.os[i] - spin.mc[i]) * (speed - 1) / 0.15;
        if (residual) val = 0;
        const c = ramp(val / spin.hi);
        const yielded = !residual && speed > 1 && spin.pl[i] > 0;
        const k = 3 * (s * nN + i);
        colors[k] = yielded ? 1 : c[0]; colors[k + 1] = yielded ? 0.95 : c[1]; colors[k + 2] = yielded ? 0.95 : c[2];
      }
      setAnim((a: Json) => (a ? { ...a, speed, residual, colors, resVec, t } : a));
      if (t < 14) raf = requestAnimationFrame(loop); else setAnim((a: Json) => (a ? { ...a, playing: false } : a));
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [anim?.playing, anim?.rate]); // eslint-disable-line react-hooks/exhaustive-deps

  const s = r.summary;
  const nmcs = r.safe?.speed_range_rpm?.[1] ?? 1;
  const sp = [0, 0.25, 0.5, 0.75, 1, 1.15].map((x) => x * nmcs);
  const casesList = Object.keys(r.cases);
  const vals: number[] = r.cases[v.caseName]?.[v.field] ?? r.cases[v.caseName].von_mises_mpa;
  return (
    <>
        <div className="seg" style={{ marginBottom: 10 }}>{TABS.map((t, i) => <button key={t} className={tab === i ? "on" : ""} onClick={() => { setTab(i); setAnim(null); if (i !== 2) setV({ ...v, mode: null }); }}>{t}</button>)}</div>

      {[0, 2, 3].includes(tab) && <>
        {tab === 0 && <div className="toolbar">
          <select className="inp" value={v.field} onChange={(e) => setV({ ...v, field: e.target.value })}>{FIELDS.filter(([k]) => r.cases[v.caseName]?.[k]).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
          <select className="inp" value={v.caseName} onChange={(e) => setV({ ...v, caseName: e.target.value })}>{casesList.map((c) => <option key={c}>{c}</option>)}</select>
          <label className="muted">Deformation ×{v.scale}<input type="range" min={0} max={1000} step={20} value={v.scale} onChange={(e) => setV({ ...v, scale: Number(e.target.value) })} /></label>
          <label className="muted">Cut plane<input type="range" min={-100} max={100} value={v.cut} onChange={(e) => setV({ ...v, cut: Number(e.target.value) })} /></label>
          {([["full", "Full 360°"], ["wire", "Mesh"], ["spin", "Rotate"]] as const).map(([k, l]) => <button key={k} className={`chip ${v[k] ? "on" : ""}`} onClick={() => setV({ ...v, [k]: !v[k] })}>{l}</button>)}
          <button className="chip" onClick={async () => { const d = (window as Json).__feaSnap?.(); if (d) saveBlob(await (await fetch(d)).blob(), `${name}_${v.field}.png`); }}>Snapshot PNG</button>
        </div>}
        {tab === 2 && <div className="toolbar"><span className="muted">Animate mode:</span>
          {r.mode_shapes.map((m: Json, i: number) => <button key={i} className={`chip ${v.mode === i ? "on" : ""}`} onClick={() => setV({ ...v, mode: v.mode === i ? null : i })}>
            ND {m.nd} · {m.mode} · {fmt(m.f_mcs_hz, 0)} Hz</button>)}</div>}
        {tab === 3 && <div className="toolbar">
          <button className="btn primary" onClick={() => setAnim({ kind: "spin", playing: true, rate: anim?.rate ?? 1, speed: 0 })}>{anim?.playing ? "Restart" : "Play spin test"}</button>
          <label className="muted">Speed ×{anim?.rate ?? 1}<input type="range" min={0.25} max={3} step={0.25} value={anim?.rate ?? 1} onChange={(e) => setAnim({ ...(anim ?? { kind: "spin" }), rate: Number(e.target.value) })} /></label>
          {anim && <span className="gauge mono">{anim.residual ? "STOPPED · permanent growth ×2000" : `${Math.round((anim.speed ?? 0) * 100)} % MCS · ${Math.round((anim.speed ?? 0) * nmcs)} rpm`}</span>}
          <span className="muted small">White = yielded zones at overspeed</span></div>}
        <div className="grid" style={{ gridTemplateColumns: "1fr 280px" }}>
          <Viewer r={r} v={tab === 3 ? { ...v, field: "von_mises_mpa", caseName: "Centrifugal MCS", mode: null } : v} setProbe={setProbe} anim={tab === 3 ? anim : null} />
          <div className="probe">
            <div className="mono caps label">Probe — click the model</div>
            {probe ? <><div className="mono small">node {probe.node} · r {fmt(probe.r_mm, 1)} mm · z {fmt(probe.z_mm, 1)} mm</div>
              <table className="t"><tbody>{Object.entries(probe.values).map(([k, x]) => <tr key={k}><td className="muted">{k}</td><td className="n">{fmt(x as number, 2)}</td></tr>)}</tbody></table></>
              : <p className="muted small">Values at the nearest node for the selected load case. Red sphere = maximum, cyan = minimum.</p>}
          </div>
        </div>
        {tab === 0 && <Legend vals={vals} label={`${FIELDS.find((f) => f[0] === v.field)?.[1]} · ${v.caseName}`} />}
      </>}

      {tab === 1 && <div className="grid">{Object.entries(r.paths).map(([pn, p]: [string, Json]) => (
        <div key={pn}><h3>{pn}</h3>
          <Plot height={300} data={Object.keys(p.cases).map((c) => ({ x: p.x_mm, y: p.cases[c][v.field.endsWith("_mpa") ? v.field : "von_mises_mpa"], name: c, mode: "lines+markers" }))}
            layout={{ xaxis: { title: p.axis }, yaxis: { title: FIELDS.find((f) => f[0] === (v.field.endsWith("_mpa") ? v.field : "von_mises_mpa"))?.[1] } }} /></div>))}</div>}

      {tab === 2 && <div className="grid" style={{ marginTop: 12 }}>
        <div><h3>Campbell diagram by nodal diameter</h3>
          <Plot height={360} data={[...Array.from(new Set(r.modes.map((m: Json) => m.nd))).flatMap((nd) => r.modes.filter((m: Json) => m.nd === nd && m.mode === 1).map((m: Json) => ({
            x: sp, y: sp.map((n) => Math.sqrt(m.f0_hz ** 2 + (m.f_mcs_hz ** 2 - m.f0_hz ** 2) * (n / nmcs) ** 2)), name: `ND ${nd}`, mode: "lines" }))),
            ...r.safe.excitations.map((e: Json) => ({ x: sp, y: sp.map((n) => e.order * n / 60), name: e.name, mode: "lines", line: { dash: "dash", color: "#777", width: 1 }, showlegend: e.order > 6 })),
            { x: [r.safe.speed_range_rpm[0], r.safe.speed_range_rpm[0]], y: [0, Math.max(...r.modes.map((m: Json) => m.f_mcs_hz))], mode: "lines", name: "Speed range", line: { color: SERIES[2], dash: "dot" } },
            { x: [nmcs, nmcs], y: [0, Math.max(...r.modes.map((m: Json) => m.f_mcs_hz))], mode: "lines", name: "MCS", line: { color: SERIES[2], dash: "dot" }, showlegend: false }]}
            layout={{ xaxis: { title: "Speed (rpm)" }, yaxis: { title: "Frequency (Hz)" } }} /></div>
        <div><h3>SAFE interference — nearest resonances</h3>
          <div className="scroll" style={{ maxHeight: 360 }}><table className="t"><thead><tr><th>Excitation</th><th>ND</th><th>Mode</th><th>Resonance rpm</th><th>f Hz</th><th>Margin</th></tr></thead>
            <tbody>{r.safe.hits.slice(0, 16).map((h: Json, i: number) => <tr key={i} className={h.in_range ? "soprow" : ""}><td>{h.excitation}</td><td className="n">{h.nd}</td><td className="n">{h.mode}</td>
              <td className="n">{fmt(h.resonance_rpm, 0)}</td><td className="n">{fmt(h.f_hz, 0)}</td><td><span className={`pill ${h.in_range ? "fail" : h.margin < 0.1 ? "attention" : "pass"}`}>{h.in_range ? "in range" : `${fmt(h.margin * 100, 0)} %`}</span></td></tr>)}</tbody></table></div>
          <table className="t" style={{ marginTop: 10 }}><thead><tr><th>ND</th><th>Mode</th><th>f at 0 rpm</th><th>f at MCS</th></tr></thead>
            <tbody>{r.modes.map((m: Json, i: number) => <tr key={i}><td className="n">{m.nd}</td><td className="n">{m.mode}</td><td className="n">{fmt(m.f0_hz, 0)}</td><td className="n">{fmt(m.f_mcs_hz, 0)}</td></tr>)}</tbody></table></div>
      </div>}

      {tab === 3 && <div className="grid" style={{ marginTop: 12 }}>
        <div><Plot height={300} data={[{ x: r.overspeed_frames.map((f: Json) => f.speed_frac * 100), y: r.overspeed_frames.map((f: Json) => f.tip_growth_um), name: "Tip growth (µm)", mode: "lines+markers" },
          { x: r.overspeed_frames.map((f: Json) => f.speed_frac * 100), y: r.overspeed_frames.map((f: Json) => f.plastic_volume_pct), name: "Yielded volume (%)", mode: "lines+markers", yaxis: "y2" }]}
          layout={{ title: "Spin test: growth and yielding vs speed", xaxis: { title: "Speed (% MCS)" }, yaxis: { title: "Tip growth (µm)" }, yaxis2: { title: "Yielded volume (%)" } }} /></div>
        <div><Plot height={300} data={[{ x: r.overspeed_frames.map((f: Json) => f.speed_frac * 100), y: r.overspeed_frames.map((f: Json) => f.max_vm_mpa), name: "Peak von Mises", mode: "lines+markers" },
          { x: [0, 115], y: [r.material.yield_mpa, r.material.yield_mpa], name: "Yield", mode: "lines", line: { dash: "dash", color: SERIES[1] } }]}
          layout={{ title: "Peak stress vs speed", xaxis: { title: "Speed (% MCS)" }, yaxis: { title: "Stress (MPa)" } }} />
          <p className="muted small">Predicted permanent growth after the 115 % test: bore {fmt(s.permanent_bore_growth_um, 2)} µm, eye {fmt(s.permanent_eye_growth_um, 2)} µm,
            tip {fmt(s.permanent_tip_growth_um, 2)} µm. Enter the measured values in Shop tests → Overspeed test record.</p></div>
      </div>}

      {tab === 4 && <div className="grid">
        <div><Plot height={320} data={[{ x: r.fit.curve.map((q: Json) => q.rpm), y: r.fit.curve.map((q: Json) => q.pressure_mpa), name: "Fit pressure", mode: "lines" },
          { x: [r.fit.lift_off_rpm, r.fit.lift_off_rpm], y: [0, s.fit_pressure_standstill_mpa], name: "Lift-off", mode: "lines", line: { dash: "dash", color: SERIES[3] } },
          { x: [nmcs * 1.15, nmcs * 1.15], y: [0, s.fit_pressure_standstill_mpa], name: "115 % MCS", mode: "lines", line: { dash: "dot", color: SERIES[2] } }]}
          layout={{ title: "Shrink-fit contact pressure vs speed", xaxis: { title: "Speed (rpm)" }, yaxis: { title: "Contact pressure (MPa)" } }} /></div>
        <div className="kpis">{[["Diametral interference", `${fmt(s.fit_interference_um, 0)} µm`], ["Pressure at standstill", `${fmt(s.fit_pressure_standstill_mpa, 1)} MPa`],
          ["Pressure at MCS", `${fmt(s.fit_pressure_mcs_mpa, 1)} MPa`], ["Lift-off speed", `${fmt(s.lift_off_rpm, 0)} rpm`], ["Lift-off / MCS (≥ 1.15)", fmt(s.lift_off_ratio, 2)]].map(([l, x]) =>
          <div className="kpi" key={l}><div className="v">{x}</div><div className="l">{l}</div></div>)}</div>
      </div>}

      {tab === 5 && <div className="grid">
        <div><Plot height={340} data={[{ x: [0, r.material.uts_mpa], y: [s.endurance_mpa, 0], name: "Goodman line", mode: "lines" },
          { x: [0, r.material.uts_mpa], y: [s.endurance_mpa / 1.5, 0], name: "SF 1.5", mode: "lines", line: { dash: "dash" } },
          { x: [s.mean_mpa], y: [s.alternating_mpa], name: `Critical point (${s.goodman_zone})`, mode: "markers", marker: { size: 11, symbol: "diamond" } }]}
          layout={{ title: "Goodman diagram (HCF)", xaxis: { title: "Mean stress (MPa)" }, yaxis: { title: "Alternating stress (MPa)" } }} /></div>
        <div className="kpis">{[["Goodman SF (≥ 1.5)", fmt(s.goodman_sf_min, 2)], ["Mean / alternating", `${fmt(s.mean_mpa, 0)} / ${fmt(s.alternating_mpa, 1)} MPa`],
          ["Endurance limit", `${fmt(s.endurance_mpa, 0)} MPa`], ["LCF cycles to initiation", Number(s.lcf_cycles).toExponential(2)], ["Required starts", fmt(s.lcf_required, 0)],
          ["LCF life ratio (≥ 2)", fmt(s.lcf_ratio, 2)], ["SAFE interference", s.safe_interference ? "yes (alt. ×3)" : "none"]].map(([l, x]) =>
          <div className="kpi" key={l}><div className="v">{x}</div><div className="l">{l}</div></div>)}</div>
      </div>}

      {tab === 6 && <Plot height={300} data={[{ x: r.convergence.map((c: Json) => c.dof), y: r.convergence.map((c: Json) => c.avg_hoop_mpa), name: "Average hoop (MPa)", mode: "lines+markers" },
        { x: r.convergence.map((c: Json) => c.dof), y: r.convergence.map((c: Json) => c.tip_growth_um), name: "Tip growth (µm)", mode: "lines+markers", yaxis: "y2" }]}
        layout={{ title: "Mesh convergence (centrifugal MCS)", xaxis: { title: "Degrees of freedom", type: "log" }, yaxis: { title: "Average hoop (MPa)" }, yaxis2: { title: "Tip growth (µm)" } }} />}

      {tab === 7 && <div className="row">
        <button className="btn primary" onClick={() => saveFrom("/api/fea3d/export/pdf", body, `${name}_fea.pdf`)}>FEA report (PDF)</button>
        <button className="btn" onClick={() => saveFrom("/api/fea3d/export/vtu", body, `${name}.vtu`)}>ParaView (.vtu, full 360°)</button>
        <button className="btn" onClick={() => saveFrom("/api/fea3d/export/inp", body, `${name}_ccx.inp`)}>CalculiX deck (.inp)</button>
        <button className="btn" onClick={() => saveBlob(new Blob([JSON.stringify({ summary: r.summary, checks: r.checks, modes: r.modes, safe: r.safe.hits }, null, 1)], { type: "application/json" }), `${name}_results.json`)}>Results (JSON)</button>
        <p className="muted small" style={{ flexBasis: "100%" }}>Every chart has its own PNG / SVG / PDF / CSV buttons; the 3D view has Snapshot PNG.</p>
      </div>}
    </>
  );
}
