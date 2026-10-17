import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { Json } from "../api";

// Perceptually ordered blue → cyan → green → yellow → red ramp.
const RAMP = [[0.19, 0.07, 0.6], [0.07, 0.45, 0.9], [0.1, 0.75, 0.8], [0.35, 0.85, 0.35], [0.98, 0.8, 0.15], [0.9, 0.2, 0.15]];
export const ramp = (t: number) => {
  const x = Math.min(Math.max(t, 0), 1) * (RAMP.length - 1);
  const i = Math.min(Math.floor(x), RAMP.length - 2);
  const f = x - i;
  return RAMP[i].map((a, k) => a + (RAMP[i + 1][k] - a) * f);
};
export const FIELDS: [string, string][] = [["von_mises_mpa", "von Mises (MPa)"], ["hoop_mpa", "Hoop σθ (MPa)"],
  ["radial_mpa", "Radial σr (MPa)"], ["axial_mpa", "Axial σz (MPa)"], ["disp_um", "Displacement (µm)"], ["ur_um", "Radial growth (µm)"]];

type Opts = { field: string; caseName: string; scale: number; cut: boolean; wire: boolean; blades: boolean; spin: boolean };

function build(model: Json, o: Opts) {
  const nodes: number[][] = model.nodes_mm;
  const els: number[][] = model.elements;
  const c = model.cases[o.caseName];
  const val: number[] = c[o.field];
  const lo = Math.min(...val), hi = Math.max(...val);
  // Deformed (r, z) in metres; displacement scaled for visibility.
  const P = nodes.map(([r, z], i) => [(r + o.scale * c.ur_um[i] / 1000) / 1000, (z + o.scale * c.uz_um[i] / 1000) / 1000]);
  const sweep = o.cut ? 1.5 * Math.PI : 2 * Math.PI;
  const S = 72;
  const pos: number[] = [], col: number[] = [];
  const push = (r: number, z: number, th: number, v: number) => {
    pos.push(r * Math.cos(th), z, r * Math.sin(th));
    col.push(...ramp((v - lo) / (hi - lo || 1)));
  };
  // Outer surface: revolve boundary edges (edges used by one element).
  const count = new Map<string, number[]>();
  els.forEach((e) => e.forEach((a, k) => {
    const b = e[(k + 1) % 4];
    const key = a < b ? `${a},${b}` : `${b},${a}`;
    count.set(key, count.has(key) ? [] : [a, b]);
  }));
  for (const ed of count.values()) {
    if (ed.length !== 2) continue;
    const [a, b] = ed;
    for (let s = 0; s < S; s++) {
      const t0 = (sweep * s) / S, t1 = (sweep * (s + 1)) / S;
      push(P[a][0], P[a][1], t0, val[a]); push(P[b][0], P[b][1], t0, val[b]); push(P[b][0], P[b][1], t1, val[b]);
      push(P[a][0], P[a][1], t0, val[a]); push(P[b][0], P[b][1], t1, val[b]); push(P[a][0], P[a][1], t1, val[a]);
    }
  }
  // Section faces at the cut planes show the full 2D field.
  if (o.cut) for (const th of [0, sweep]) for (const e of els) {
    for (const tri of [[0, 1, 2], [0, 2, 3]]) tri.forEach((k) => push(P[e[k]][0], P[e[k]][1], th, val[e[k]]));
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
  g.computeVertexNormals();
  return { g, lo, hi, sweep };
}

export function ImpellerFEAView({ fea }: { fea: Json }) {
  const ref = useRef<HTMLDivElement>(null);
  const cases = Object.keys(fea.model.cases);
  const [o, setO] = useState<Opts>({ field: "von_mises_mpa", caseName: cases[0], scale: 100, cut: true, wire: false, blades: true, spin: false });
  const range = useMemo(() => {
    const v: number[] = fea.model.cases[o.caseName][o.field];
    return [Math.min(...v), Math.max(...v)];
  }, [fea, o.caseName, o.field]);
  const optsRef = useRef(o);
  optsRef.current = o;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const w = el.clientWidth, h = el.clientHeight;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(w, h);
    el.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b1220);
    const R = fea.model.r_tip_mm / 1000;
    const cam = new THREE.PerspectiveCamera(35, w / h, 0.001, 20);
    cam.position.set(R * 2.4, R * 1.6, R * 2.4);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x223344, 1.4));
    const sun = new THREE.DirectionalLight(0xffffff, 1.3);
    sun.position.set(1, 2, 1.5);
    scene.add(sun);
    const holder = new THREE.Group();
    scene.add(holder);
    const { g, sweep } = build(fea.model, o);
    const mat = new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.DoubleSide, roughness: 0.5, metalness: 0.15, wireframe: o.wire });
    holder.add(new THREE.Mesh(g, mat));
    if (o.blades) {
      // Blades (smeared in the FE model) drawn as backswept ribbons spanning hub to shroud.
      const N: number[][] = fea.model.nodes_mm;
      const zones: string[] = fea.model.zones;
      const span = new Map<number, [number, number]>();
      fea.model.elements.forEach((e: number[], i: number) => {
        if (zones[i] !== "passage") return;
        e.forEach((n) => {
          const r = Math.round(N[n][0] * 100) / 100, z = N[n][1];
          const cur = span.get(r);
          span.set(r, cur ? [Math.min(cur[0], z), Math.max(cur[1], z)] : [z, z]);
        });
      });
      const cols = [...span.entries()].sort((x, y) => x[0] - y[0]);
      const bm = new THREE.MeshStandardMaterial({ color: 0xb8c7d6, metalness: 0.55, roughness: 0.35, side: THREE.DoubleSide });
      const sweepB = (fea.model.backsweep_deg * Math.PI) / 180 * 1.4;
      const r0 = cols[0][0], rN = cols[cols.length - 1][0];
      for (let i = 0; i < fea.model.blades; i++) {
        const th0 = (2 * Math.PI * i) / fea.model.blades;
        if (o.cut && th0 > sweep - 0.05) continue;
        const vs: number[] = [];
        const pt = (r: number, z: number, t: number) => { const th = th0 + sweepB * t; vs.push((r / 1000) * Math.cos(th), z / 1000, (r / 1000) * Math.sin(th)); };
        for (let k = 0; k < cols.length - 1; k++) {
          const [ra, [la, ha]] = cols[k], [rb, [lb, hb]] = cols[k + 1];
          const ta = (ra - r0) / (rN - r0), tb = (rb - r0) / (rN - r0);
          pt(ra, la, ta); pt(rb, lb, tb); pt(rb, hb, tb); pt(ra, la, ta); pt(rb, hb, tb); pt(ra, ha, ta);
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.Float32BufferAttribute(vs, 3));
        geo.computeVertexNormals();
        holder.add(new THREE.Mesh(geo, bm));
      }
    }
    holder.rotation.y = Math.PI; // start with the cut-away facing the camera
    const grid = new THREE.PolarGridHelper(R * 1.4, 12, 6, 64, 0x2b3a4f, 0x1c2836);
    grid.position.y = -0.002;
    scene.add(grid);
    const ctl = new OrbitControls(cam, renderer.domElement);
    ctl.enableDamping = true;
    ctl.target.set(0, R * 0.15, 0);
    let raf = 0;
    const loop = () => {
      if (optsRef.current.spin) holder.rotation.y += 0.004;
      ctl.update();
      renderer.render(scene, cam);
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      cancelAnimationFrame(raf);
      ctl.dispose();
      renderer.dispose();
      g.dispose();
      el.removeChild(renderer.domElement);
    };
  }, [fea, o.field, o.caseName, o.scale, o.cut, o.wire, o.blades]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = (k: keyof Opts, v: unknown) => setO({ ...o, [k]: v });
  return (
    <div className="fea">
      <div className="toolbar">
        <select className="inp" value={o.field} onChange={(e) => set("field", e.target.value)} aria-label="Result">
          {FIELDS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
        </select>
        <select className="inp" value={o.caseName} onChange={(e) => set("caseName", e.target.value)} aria-label="Load case">
          {cases.map((c) => <option key={c}>{c}</option>)}
        </select>
        <label className="muted">Deformation ×{o.scale}
          <input type="range" min={0} max={400} step={10} value={o.scale} onChange={(e) => set("scale", Number(e.target.value))} /></label>
        {([["cut", "Cut-away"], ["wire", "Mesh"], ["blades", "Blades"], ["spin", "Rotate"]] as const).map(([k, l]) =>
          <button key={k} className={`chip ${o[k] ? "on" : ""}`} onClick={() => set(k, !o[k])}>{l}</button>)}
      </div>
      <div ref={ref} className="viewer tall" />
      <div className="legend">
        <span>{range[0].toFixed(0)}</span>
        <div className="bar" style={{ background: `linear-gradient(90deg, ${RAMP.map((c) => `rgb(${c.map((v) => Math.round(v * 255)).join(",")})`).join(",")})` }} />
        <span>{range[1].toFixed(0)}</span>
        <span className="muted">{FIELDS.find((f) => f[0] === o.field)?.[1]} · {o.caseName}</span>
      </div>
    </div>
  );
}

/** Meridional section drawn as the actual FE quads, coloured by element-average value. */
export function SectionPlot({ model, field, caseName }: { model: Json; field: string; caseName: string }) {
  const N: number[][] = model.nodes_mm;
  const v: number[] = model.cases[caseName][field];
  const ev = model.elements.map((e: number[]) => e.reduce((a, n) => a + v[n], 0) / 4);
  const lo = Math.min(...ev), hi = Math.max(...ev);
  const xs = N.map((p) => p[0]), ys = N.map((p) => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys), pad = 4;
  return (
    <svg viewBox={`${x0 - pad} ${-y1 - pad} ${x1 - x0 + 2 * pad} ${y1 - y0 + 2 * pad}`} className="section" role="img" aria-label="FE section">
      {model.elements.map((e: number[], i: number) => {
        const c = ramp((ev[i] - lo) / (hi - lo || 1)).map((q) => Math.round(q * 255));
        return (<polygon key={i} points={e.map((n) => `${N[n][0]},${-N[n][1]}`).join(" ")} fill={`rgb(${c.join(",")})`}
          stroke="rgba(0,0,0,.25)" strokeWidth={0.15}><title>{`${model.zones[i]} · ${ev[i].toFixed(0)}`}</title></polygon>);
      })}
    </svg>
  );
}
