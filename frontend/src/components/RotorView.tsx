import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { Json } from "../api";

const COLORS: Record<string, number> = {
  shaft: 0x9aa7b4, impeller: 0x4f8fcf, piston: 0xc9a35a, collar: 0xb07c4f, coupling: 0x7d8a98, sleeve: 0x6fb3a6, bearing: 0xe08a3c,
};

type Mode = { z: number[]; shape: number[]; label?: string; whirl?: string } | null;

function interp(z: number[], s: number[], x: number) {
  if (x <= z[0]) return s[0];
  for (let i = 1; i < z.length; i++) {
    if (x <= z[i]) return s[i - 1] + ((s[i] - s[i - 1]) * (x - z[i - 1])) / (z[i] - z[i - 1]);
  }
  return s[s.length - 1];
}

function lathe(points: [number, number][], color: number, opacity = 1) {
  const pts = points.map(([r, z]) => new THREE.Vector2(Math.max(r, 1e-4), z));
  const geo = new THREE.LatheGeometry(pts, 64);
  const mat = new THREE.MeshStandardMaterial({ color, metalness: 0.55, roughness: 0.42, side: THREE.DoubleSide,
    transparent: opacity < 1, opacity });
  return new THREE.Mesh(geo, mat);
}

/** Builds the rotor from the backend scene description. Lathe axis (three.js Y) = rotor z. */
function buildRotor(scene: Json): { group: THREE.Group; pieces: { obj: THREE.Object3D; z: number }[] } {
  const group = new THREE.Group();
  const pieces: { obj: THREE.Object3D; z: number }[] = [];
  const add = (obj: THREE.Object3D, z: number) => {
    group.add(obj);
    pieces.push({ obj, z });
  };
  for (const p of scene.parts) {
    if (p.type === "cylinder") {
      // Split long sections so mode-shape deflection can bend the shaft.
      const n = Math.max(1, Math.ceil((p.z1 - p.z0) / 0.04));
      for (let i = 0; i < n; i++) {
        const a = p.z0 + ((p.z1 - p.z0) * i) / n;
        const b = p.z0 + ((p.z1 - p.z0) * (i + 1)) / n;
        add(lathe([[p.r_inner, a], [p.r_outer, a], [p.r_outer, b], [p.r_inner, b]], COLORS.shaft), (a + b) / 2);
      }
    } else if (p.type === "impeller") {
      const z0 = p.z_center - p.length / 2;
      const L = p.length;
      const g = new THREE.Group();
      g.add(lathe([[p.r_hub, z0 + L], [p.r2, z0 + 0.8 * L], [p.r2, z0 + 0.7 * L], [p.r_hub * 1.2, z0 + 0.62 * L]], COLORS.impeller));
      g.add(lathe([[p.r2, z0 + 0.62 * L - p.b2], [(p.r1 + p.r2) / 2, z0 + 0.3 * L], [p.r1 * 1.05, z0], [p.r1 * 0.98, z0]],
        COLORS.impeller, 0.55));
      const bladeMat = new THREE.MeshStandardMaterial({ color: 0x2f6aa3, metalness: 0.5, roughness: 0.45 });
      for (let i = 0; i < p.blades; i++) {
        const ang = (2 * Math.PI * i) / p.blades;
        const len = p.r2 - p.r1 * 0.9;
        const blade = new THREE.Mesh(new THREE.BoxGeometry(0.004, p.b2 * 1.2, len), bladeMat);
        const rm = (p.r2 + p.r1 * 0.9) / 2;
        blade.position.set(rm * Math.sin(ang), z0 + 0.62 * L - p.b2 / 2, rm * Math.cos(ang));
        blade.rotation.y = ang + (p.backsweep_deg * Math.PI) / 180 / 2;
        g.add(blade);
      }
      add(g, p.z_center);
    } else if (p.type === "disk") {
      const a = p.z_center - p.thickness / 2;
      const b = p.z_center + p.thickness / 2;
      add(lathe([[0.01, a], [p.r_outer, a], [p.r_outer, b], [0.01, b]], COLORS[p.material] ?? COLORS.shaft), p.z_center);
    } else if (p.type === "bearing") {
      const a = p.z_center - p.width / 2;
      const b = p.z_center + p.width / 2;
      const ring = lathe([[p.r_inner * 1.02, a], [p.r_outer * 1.6, a], [p.r_outer * 1.6, b], [p.r_inner * 1.02, b], [p.r_inner * 1.02, a]],
        COLORS.bearing, 0.45);
      group.add(ring); // bearings stay fixed
    }
  }
  return { group, pieces };
}

export function RotorView({ scene, mode, amplitude = 0.04 }: { scene: Json; mode?: Mode; amplitude?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const modeRef = useRef<Mode>(mode ?? null);
  modeRef.current = mode ?? null;

  useEffect(() => {
    const el = ref.current;
    if (!el || !scene) return;
    const w = el.clientWidth;
    const h = el.clientHeight;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    el.appendChild(renderer.domElement);
    const s = new THREE.Scene();
    s.background = new THREE.Color(0x0b1220);
    const camera = new THREE.PerspectiveCamera(35, w / h, 0.01, 50);
    const L = scene.length;
    camera.position.set(L * 0.3, L * 0.22, L * 0.62);
    s.add(new THREE.HemisphereLight(0xdfe8f2, 0x1a2430, 1.1));
    const sun = new THREE.DirectionalLight(0xffffff, 1.6);
    sun.position.set(2, 3, 2);
    s.add(sun);
    const { group, pieces } = buildRotor(scene);
    // Rotor axis along world X, centred.
    const holder = new THREE.Group();
    group.rotation.z = -Math.PI / 2;
    group.position.x = -L / 2;
    holder.add(group);
    s.add(holder);
    // whirl orbits at the stations and the deflected centreline (rebuilt when the mode changes)
    const orbitG = new THREE.Group();
    holder.add(orbitG);
    const NZ = 80, cl = new Float32Array(NZ * 3);
    const clGeo = new THREE.BufferGeometry();
    clGeo.setAttribute("position", new THREE.BufferAttribute(cl, 3));
    const clLine = new THREE.Line(clGeo, new THREE.LineBasicMaterial({ color: 0xffffff, depthTest: false }));
    clLine.renderOrder = 2;
    holder.add(clLine);
    const dots: THREE.Mesh[] = [];
    let built: Mode = null;
    const build = (m: Mode) => {
      orbitG.clear(); dots.length = 0; built = m;
      if (!m) return;
      const col = m.whirl === "backward" ? 0xe5732e : 0x30a46c;
      const zs = [...scene.parts.filter((p: Json) => p.type !== "cylinder").map((p: Json) => p.z_center), 0, L];
      for (const zz of zs) {
        const a = Math.abs(amplitude * interp(m.z, m.shape, zz));
        const ring = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(Array.from({ length: 48 }, (_, i) =>
          new THREE.Vector3(zz - L / 2, a * Math.cos((i / 48) * 2 * Math.PI), a * Math.sin((i / 48) * 2 * Math.PI)))), new THREE.LineBasicMaterial({ color: col, depthTest: false }));
        ring.renderOrder = 2;
        orbitG.add(ring);
        const d = new THREE.Mesh(new THREE.SphereGeometry(L * 0.004), new THREE.MeshBasicMaterial({ color: col, depthTest: false }));
        d.renderOrder = 3; d.userData.z = zz;
        orbitG.add(d); dots.push(d);
      }
      (clLine.material as THREE.LineBasicMaterial).color.setHex(col);
    };
    const grid = new THREE.GridHelper(L * 1.6, 16, 0x2a3643, 0x1d2731);
    grid.position.y = -0.35;
    s.add(grid);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.enableDamping = true;
    let raf = 0;
    const t0 = performance.now();
    const loop = () => {
      const t = (performance.now() - t0) / 1000;
      const m = modeRef.current;
      if (m !== built) build(m);
      const ph = 2 * Math.PI * 0.6 * t, dir = m?.whirl === "backward" ? -1 : 1;
      clLine.visible = !!m;
      if (m) {
        for (let i = 0; i < NZ; i++) {
          const zz = (L * i) / (NZ - 1), a = amplitude * interp(m.z, m.shape, zz);
          cl[3 * i] = zz - L / 2; cl[3 * i + 1] = a * Math.cos(ph); cl[3 * i + 2] = dir * a * Math.sin(ph);
        }
        clGeo.attributes.position.needsUpdate = true;
        for (const d of dots) { const a = amplitude * interp(m.z, m.shape, d.userData.z); d.position.set(d.userData.z - L / 2, a * Math.cos(ph), dir * a * Math.sin(ph)); }
      }
      for (const pc of pieces) {
        if (m) {
          const a = amplitude * interp(m.z, m.shape, pc.z);
          // whirl orbit in the plane normal to the rotor axis (group is rotated: local x = world -y, local z = world z)
          pc.obj.position.x = -a * Math.cos(ph);
          pc.obj.position.z = dir * a * Math.sin(ph);
        } else {
          pc.obj.position.x = 0;
          pc.obj.position.z = 0;
        }
        pc.obj.rotation.y = t * 0.8; // spin
      }
      controls.update();
      renderer.render(s, camera);
      raf = requestAnimationFrame(loop);
    };
    loop();
    const onResize = () => {
      const nw = el.clientWidth;
      const nh = el.clientHeight;
      renderer.setSize(nw, nh);
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      controls.dispose();
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, [scene, amplitude]);

  return <div ref={ref} className="viewer" />;
}
