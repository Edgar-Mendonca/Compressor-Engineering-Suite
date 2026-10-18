import { fmt, type Json } from "../api";
import { SERIES } from "./Plot";

// Velocity triangles and a meridional sketch of one impeller (SVG, from impeller/geometry.py results).

function Arrow({ x1, y1, x2, y2, c, w = 2, dash }: { x1: number; y1: number; x2: number; y2: number; c: string; w?: number; dash?: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth={w} strokeDasharray={dash} markerEnd={`url(#vt-${c.replace(/[^a-z0-9]/gi, "")})`} />;
}

/** U horizontal (A to B), absolute c from A, relative w from B; all drawn to one velocity scale. */
function Tri({ t, s, x0, y0, c, label, solid, ly }: { t: Json; s: number; x0: number; y0: number; c: string; label: string; solid?: boolean; ly: number }) {
  const B = [x0 + t.U * s, y0], C = [x0 + t.cu * s, y0 - t.cm * s];
  return (
    <g>
      <Arrow x1={x0} y1={y0} x2={B[0]} y2={B[1]} c={c} dash={solid ? undefined : "5 3"} w={1.5} />
      <Arrow x1={x0} y1={y0} x2={C[0]} y2={C[1]} c={c} />
      <Arrow x1={B[0]} y1={B[1]} x2={C[0]} y2={C[1]} c={c} w={2.5} />
      <text x={0} y={ly} fontSize={10.5} fill={c}>{label}: U {fmt(t.U, 0)} · cm {fmt(t.cm, 0)} · cu {fmt(t.cu, 0)} · w {fmt(t.w, 0)} m/s · β {fmt(t.beta_deg, 1)}°{t.relative_mach != null ? ` · Mrel ${fmt(t.relative_mach, 2)}` : ""}</text>
    </g>
  );
}

export function VelocityTriangles({ g }: { g: Json }) {
  const vt = g.triangles;
  const inl = vt.inlet, out = vt.outlet;
  const vmax = Math.max(inl.tip.U, out.U, inl.tip.cm, out.cm);
  const s = 300 / vmax;
  const cols = [SERIES[0], SERIES[2], SERIES[1], SERIES[3]];
  const h1 = inl.tip.cm * s, h2 = out.cm * s;
  return (
    <svg viewBox={`-10 -10 400 ${h1 + h2 + 170}`} style={{ width: "100%", maxHeight: 420 }} role="img" aria-label="Velocity triangles">
      <defs>{cols.map((c) => <marker key={c} id={`vt-${c.replace(/[^a-z0-9]/gi, "")}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0 0 L10 5 L0 10 z" fill={c} /></marker>)}</defs>
      <text x={0} y={4} fontSize={12} fontWeight={600} fill="currentColor">Inlet (axial inflow, no prewhirl) — hub / mean / tip</text>
      {(["hub", "mean", "tip"] as const).map((k, i) => <Tri key={k} t={inl[k]} s={s} x0={0} y0={h1 + 20} c={cols[i]} label={k} solid={k === "tip"} ly={h1 + 36 + i * 13} />)}
      <text x={0} y={h1 + 92} fontSize={12} fontWeight={600} fill="currentColor">Outlet — slip σ {fmt(out.slip_factor, 3)}, blade β2 {fmt(out.beta_blade_deg, 0)}°, flow β2 {fmt(out.beta_deg, 1)}°</text>
      <Tri t={out} s={s} x0={0} y0={h1 + h2 + 108} c={cols[3]} label="outlet" solid ly={h1 + h2 + 124} />
      <text x={0} y={h1 + h2 + 142} fontSize={11} fill={vt.de_haller_ok ? "var(--pass)" : "var(--fail)"}>
        de Haller w2/w1,tip = {fmt(vt.de_haller, 2)} {vt.de_haller_ok ? "(≥ 0.55)" : "(< 0.55: high diffusion)"} · c2 {fmt(out.c, 0)} m/s</text>
    </svg>
  );
}

/** Half meridional section: back face, hub and shroud contours, eye, exit width b2 and bore. */
export function MeridionalSketch({ g }: { g: Json }) {
  const r2 = g.D2_mm / 2, r1 = g.D1_eye_mm / 2, rh = g.hub_mm / 2, rb = (g.bore_mm ?? g.hub_mm / 1.25) / 2, b2 = g.b2_mm;
  const tb = 0.035 * g.D2_mm + 4, ts = 0.022 * g.D2_mm + 3, L = Math.max(g.axial_length_mm, tb + b2 + 0.15 * r2);
  const W = L + 0.25 * r2, s = 300 / Math.max(W, r2 * 1.1);
  const X = (z: number) => 20 + z * s, Y = (r: number) => 20 + (r2 * 1.05 - r) * s;
  const hub = `M${X(0)} ${Y(r2)} L${X(0)} ${Y(rb)} L${X(L)} ${Y(rb)} L${X(L)} ${Y(rh)} Q${X(tb)} ${Y(rh)} ${X(tb)} ${Y(r2)} Z`;
  const shroud = `M${X(L)} ${Y(r1)} Q${X(tb + b2)} ${Y(r1)} ${X(tb + b2)} ${Y(r2)} L${X(tb + b2 + ts)} ${Y(r2)} Q${X(tb + b2 + ts)} ${Y(r1 + ts)} ${X(L)} ${Y(r1 + ts)} Z`;
  const dim = (x: number, ya: number, yb: number, t: string) => <g><line x1={x} y1={ya} x2={x} y2={yb} stroke="var(--muted)" strokeWidth={0.8} />
    <text x={x + 4} y={(ya + yb) / 2} fontSize={10.5} fill="var(--muted)">{t}</text></g>;
  return (
    <svg viewBox={`0 0 ${X(W) + 60} ${Y(0) + 30}`} style={{ width: "100%", maxHeight: 420 }} role="img" aria-label="Meridional section">
      <path d={hub} fill={`color-mix(in srgb, ${SERIES[0]} 25%, transparent)`} stroke={SERIES[0]} strokeWidth={1.4} />
      <path d={shroud} fill={`color-mix(in srgb, ${SERIES[2]} 25%, transparent)`} stroke={SERIES[2]} strokeWidth={1.4} />
      <line x1={X(-0.05 * r2)} y1={Y(0)} x2={X(W)} y2={Y(0)} stroke="var(--muted)" strokeDasharray="6 4" />
      <text x={X(W) - 4} y={Y(0) - 4} fontSize={10} fill="var(--muted)" textAnchor="end">axis</text>
      <line x1={X(tb)} y1={Y(r2)} x2={X(tb + b2)} y2={Y(r2)} stroke={SERIES[1]} strokeWidth={3} />
      <text x={X(tb + b2) + 6} y={Y(r2) - 4} fontSize={11} fill={SERIES[1]}>b2 {fmt(b2, 1)} mm</text>
      <line x1={X(L)} y1={Y(rh)} x2={X(L)} y2={Y(r1)} stroke={SERIES[3]} strokeWidth={3} />
      <text x={X(L) + 6} y={Y((r1 + rh) / 2)} fontSize={11} fill={SERIES[3]}>eye</text>
      {dim(X(W) + 10, Y(r2), Y(0), `D2 ${fmt(g.D2_mm, 0)}`)}
      {dim(X(L) + 34, Y(r1), Y(0), `D1 ${fmt(g.D1_eye_mm, 0)}`)}
      {dim(X(L * 0.5), Y(rb), Y(0), `bore ${fmt(2 * rb, 0)}`)}
      <text x={X(0.02 * r2)} y={Y(r2) + 14} fontSize={10.5} fill={SERIES[0]}>hub / disk</text>
      <text x={X(tb + b2 + ts) + 4} y={Y(r1 + ts + 0.25 * (r2 - r1))} fontSize={10.5} fill={SERIES[2]}>shroud</text>
    </svg>
  );
}
