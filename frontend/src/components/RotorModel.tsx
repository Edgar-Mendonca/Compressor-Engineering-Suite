import type { Json } from "../api";
import { SERIES } from "./Plot";

// Rotor model drawing in the style of a vendor lateral report: stepped shaft half-sections, impellers and added
// masses (radius from Ip = m r^2 / 2), bearings as spring-damper supports, close-clearance stations, centre of
// gravity and station numbers. Mode shapes are drawn over the rotor and animated (SVG animate, no JS loop).

export type RMode = { shape: number[]; label: string; color?: string; whirl?: string };

const W = 1000, PAD = 46;

export function RotorModel({ rotor, z, modes = [], cg, h = 250, labels = true }: { rotor: Json; z: number[]; modes?: RMode[]; cg?: number; h?: number; labels?: boolean }) {
  const secs: Json[] = rotor.sections ?? [];
  const L = Math.max(...secs.map((s) => s.z1_m), ...z);
  const rS = Math.max(...secs.map((s) => s.od_m)) / 2;
  const mR = (m: Json) => Math.sqrt((2 * (m.ip_kgm2 ?? 0)) / Math.max(m.mass_kg ?? 1, 1e-6));
  const rM = Math.max(rS, ...(rotor.masses ?? []).map(mR));
  const yc = h * (labels ? 0.5 : 0.5), ky = (h * 0.3) / rM;   // radial scale exaggerated for legibility
  const X = (zz: number) => PAD + ((W - 2 * PAD) * zz) / L;
  const every = Math.max(1, Math.ceil(z.length / 24));
  const amp = h * 0.26;
  // shape positions: the node list, or evenly spread when a case model carries extra seal nodes
  const zs = (n: number) => (n === z.length ? z : Array.from({ length: n }, (_, i) => z[0] + ((z[z.length - 1] - z[0]) * i) / Math.max(n - 1, 1)));
  const path = (sh: number[], sgn: number) => {
    const mx = Math.max(...sh.map(Math.abs)) || 1, q = zs(sh.length);
    return sh.map((s, i) => `${i ? "L" : "M"}${X(q[i]).toFixed(1)},${(yc - (sgn * amp * s) / mx).toFixed(1)}`).join(" ");
  };
  const nodal = (sh: number[]) => { const q = zs(sh.length); return sh.slice(1).flatMap((s, i) => (s * sh[i] < 0 ? [q[i] + ((q[i + 1] - q[i]) * Math.abs(sh[i])) / (Math.abs(sh[i]) + Math.abs(s))] : [])); };
  return (
    <svg viewBox={`0 0 ${W} ${h}`} className="rotor-model" role="img" aria-label="Rotor model">
      <defs>
        <linearGradient id="rm-steel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#eef2f6" /><stop offset="0.45" stopColor="#c3ccd6" /><stop offset="1" stopColor="#8794a3" /></linearGradient>
        <linearGradient id="rm-imp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a9c4dc" /><stop offset="0.5" stopColor="#5d86ab" /><stop offset="1" stopColor="#3a5f80" /></linearGradient>
        <linearGradient id="rm-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f3dc9a" /><stop offset="0.5" stopColor="#c99a3a" /><stop offset="1" stopColor="#8f6a20" /></linearGradient>
        <pattern id="rm-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="#7b8794" strokeWidth="1" /></pattern>
      </defs>
      <line x1={PAD - 20} x2={W - PAD + 20} y1={yc} y2={yc} stroke="#7b8794" strokeDasharray="14 4 3 4" strokeWidth={0.8} />
      {secs.map((s, i) => {
        const r = (s.od_m / 2) * ky, ri = ((s.id_m ?? 0) / 2) * ky;
        return <g key={i}><rect x={X(s.z0_m)} y={yc - r} width={X(s.z1_m) - X(s.z0_m)} height={2 * r} fill="url(#rm-steel)" stroke="#2b3440" strokeWidth={0.6} />
          {ri > 0 && <rect x={X(s.z0_m)} y={yc - ri} width={X(s.z1_m) - X(s.z0_m)} height={2 * ri} fill="#fff" stroke="#2b3440" strokeWidth={0.4} />}</g>;
      })}
      {(rotor.masses ?? []).map((m: Json, i: number) => {
        const imp = m.kind === "impeller" || /mpeller/.test(m.label), r = Math.max(mR(m), rS * 1.1) * ky, x = X(m.z_m), w = imp ? Math.max(10, r * 0.28) : 9;
        const shape = imp ? `M${x - w / 2},${yc - rS * ky * 1.05} L${x - w / 2},${yc - r} L${x + w * 0.1},${yc - r} L${x + w / 2},${yc - r * 0.55} L${x + w / 2},${yc - rS * ky * 1.05} Z` : "";
        return <g key={i}>
          {imp ? <><path d={shape} fill="url(#rm-imp)" stroke="#1f3447" strokeWidth={0.6} /><path d={shape} transform={`translate(0 ${2 * yc}) scale(1 -1)`} fill="url(#rm-imp)" stroke="#1f3447" strokeWidth={0.6} /></>
            : <rect x={x - w / 2} y={yc - r} width={w} height={2 * r} rx={1.5} fill="url(#rm-gold)" stroke="#5c4514" strokeWidth={0.6} />}
          {labels && <text x={x} y={yc - r - 6} fontSize={9} textAnchor="middle" fill="#3b4652">{String(m.label).replace("Impeller ", "Imp ").replace("Coupling half", "Cplg").replace("Balance piston", "Bal. piston").slice(0, 16)}</text>}
        </g>;
      })}
      {(rotor.bearing_z_m ?? []).map((zb: number, i: number) => {
        const x = X(zb), y0 = yc + rS * ky * 1.02, y1 = yc + h * 0.36;
        const zig = Array.from({ length: 5 }, (_, j) => `L${x - 9 + (j % 2 ? 4 : -4)},${y0 + 6 + ((y1 - y0 - 12) * (j + 0.5)) / 5}`).join(" ");
        return <g key={i} stroke="#0b5cad" strokeWidth={1.1} fill="none">
          <path d={`M${x - 9},${y0} L${x - 9},${y0 + 6} ${zig} L${x - 9},${y1 - 6} L${x - 9},${y1}`} />
          <path d={`M${x + 8},${y0} L${x + 8},${y0 + (y1 - y0) * 0.45} M${x + 3},${y0 + (y1 - y0) * 0.45} L${x + 13},${y0 + (y1 - y0) * 0.45} M${x + 2},${y0 + (y1 - y0) * 0.35} L${x + 2},${y0 + (y1 - y0) * 0.6} L${x + 14},${y0 + (y1 - y0) * 0.6} L${x + 14},${y0 + (y1 - y0) * 0.35} M${x + 8},${y0 + (y1 - y0) * 0.6} L${x + 8},${y1}`} />
          <path d={`M${x - 15},${y0} L${x + 15},${y0}`} strokeWidth={1.6} />
          <rect x={x - 20} y={y1} width={40} height={6} fill="url(#rm-hatch)" stroke="none" /><line x1={x - 20} x2={x + 20} y1={y1} y2={y1} />
          {labels && <text x={x} y={y1 + 18} fontSize={9.5} textAnchor="middle" fill="#0b5cad" stroke="none" fontWeight={600}>{i === 0 ? "DE bearing" : "NDE bearing"}</text>}
        </g>;
      })}
      {labels && (rotor.close_clearance_locations ?? []).filter((s: Json) => !/mpeller/.test(s.label)).map((s: Json, i: number) => (
        <g key={i}><line x1={X(s.z_m)} x2={X(s.z_m)} y1={yc - rS * ky * 1.2} y2={14} stroke="#c0392b" strokeDasharray="2 2" strokeWidth={0.7} />
          <text x={X(s.z_m) + 3} y={14} fontSize={8} fill="#c0392b">{String(s.label).replace(/seal ?/i, "").slice(0, 14)}</text></g>))}
      {cg != null && <g><circle cx={X(cg)} cy={yc} r={6} fill="#fff" stroke="#111" /><path d={`M${X(cg)},${yc - 6} A6,6 0 0,1 ${X(cg) + 6},${yc} L${X(cg)},${yc} Z M${X(cg)},${yc + 6} A6,6 0 0,1 ${X(cg) - 6},${yc} L${X(cg)},${yc} Z`} fill="#111" />
        {labels && <text x={X(cg) + 9} y={yc + 16} fontSize={9} fill="#111">CG</text>}</g>}
      {z.map((zz, i) => (i % every === 0 || i === z.length - 1) && <g key={i}>
        <line x1={X(zz)} x2={X(zz)} y1={yc - 3} y2={yc + 3} stroke="#3b4652" strokeWidth={0.6} />
        {labels && <text x={X(zz)} y={h - 4} fontSize={8} textAnchor="middle" fill="#5b6878">{i + 1}</text>}</g>)}
      {modes.map((m, j) => {
        const c = m.color ?? (m.whirl === "backward" ? "#e5732e" : SERIES[j % SERIES.length]), a = path(m.shape, 1), b = path(m.shape, -1);
        return <g key={j}>
          <path d={b} fill="none" stroke={c} strokeOpacity={0.3} strokeDasharray="4 3" strokeWidth={1} />
          <path d={a} fill="none" stroke={c} strokeWidth={2.2}><animate attributeName="d" values={`${a};${b};${a}`} dur="1.6s" repeatCount="indefinite" /></path>
          {nodal(m.shape).map((q, i) => <circle key={i} cx={X(q)} cy={yc} r={3.5} fill="#fff" stroke={c} strokeWidth={1.4} />)}
          <text x={W - PAD} y={16 + 13 * j} fontSize={10} textAnchor="end" fill={c} fontWeight={600}>{m.label}</text>
        </g>;
      })}
    </svg>
  );
}
