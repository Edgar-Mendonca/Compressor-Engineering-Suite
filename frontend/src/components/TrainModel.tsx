import type { Json } from "../api";
import { SERIES } from "./Plot";

// Torsional mass-elastic model (same layout as the report): one disc per station sized by Ip^0.35, shaft
// stiffness between stations, couplings as springs, the gear mesh as two pitch circles, component bars and
// station numbers. An optional mode shape is drawn as the twist line through the stations and animated.

export function TrainModel({ model, shape, label }: { model: Json; shape?: number[]; label?: string }) {
  const st: Json[] = model.stations ?? [];
  const xs: number[] = [];
  let pos = 0;
  st.forEach((s, i) => { pos += i === 0 || s.rotor === st[i - 1].rotor ? 1 : 1.8; xs.push(pos); });
  const W = 1000, H = shape ? 300 : 210, yc = shape ? 175 : 110, sx = (W - 60) / (pos + 0.6), X = (x: number) => 30 + (x - 0.7) * sx + sx * 0.4;
  const ipMax = Math.max(...st.map((s) => s.ip_kgm2 || 1e-9));
  const hh = (s: Json) => 52 * (0.18 + 0.82 * ((s.ip_kgm2 || 1e-9) / ipMax) ** 0.35);
  const rotors = [...new Set(st.map((s) => s.rotor as string))];
  const col = (r: string) => SERIES[rotors.indexOf(r) % SERIES.length];
  const bw = Math.min(16, sx * 0.34);
  const mx = shape ? Math.max(...shape.map(Math.abs)) || 1 : 1;
  const line = (k: number) => st.map((_, i) => `${i ? "L" : "M"}${X(xs[i]).toFixed(1)},${(yc - 125 - (k * 32 * (shape?.[i] ?? 0)) / mx).toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="rotor-model" role="img" aria-label="Torsional train model">
      {st.map((s, i) => {
        if (!i) return null;
        const same = st[i - 1].rotor === s.rotor, x0 = X(xs[i - 1]) + bw / 2, x1 = X(xs[i]) - bw / 2;
        const mesh = !same && (/Pinion/.test(s.rotor) || /Bull/.test(st[i - 1].rotor));
        if (same) return <line key={i} x1={x0} x2={x1} y1={yc} y2={yc} stroke="#5b6878" strokeWidth={5} />;
        if (mesh) { const m = (x0 + x1) / 2; return <g key={i} fill="none" stroke="#c0392b" strokeWidth={1.4}><circle cx={m - 8} cy={yc} r={24} /><circle cx={m + 16} cy={yc} r={12} />
          <text x={m} y={yc + 42} fontSize={10} textAnchor="middle" fill="#c0392b" stroke="none">gear mesh</text></g>; }
        const n = 10, d = Array.from({ length: n + 1 }, (_, k) => `${k ? "L" : "M"}${x0 + ((x1 - x0) * k) / n},${yc + (k === 0 || k === n ? 0 : k % 2 ? 12 : -12)}`).join(" ");
        return <path key={i} d={d} fill="none" stroke="#5b6878" strokeWidth={1.5} />;
      })}
      {st.map((s, i) => <g key={i}>
        <rect x={X(xs[i]) - bw / 2} y={yc - hh(s)} width={bw} height={2 * hh(s)} rx={3} fill={col(s.rotor)} stroke="#1f2a35" strokeWidth={0.6} />
        <text x={X(xs[i])} y={yc + 72} fontSize={9} textAnchor="middle" fill="#3b4652">{s.station}</text></g>)}
      {rotors.map((r) => {
        const xr = st.map((s, i) => (s.rotor === r ? X(xs[i]) : NaN)).filter((v) => !isNaN(v)), a = Math.min(...xr) - 12, b = Math.max(...xr) + 12;
        return <g key={r}><line x1={a} x2={b} y1={yc - 62} y2={yc - 62} stroke={col(r)} strokeWidth={2} />
          <text x={(a + b) / 2} y={yc - 68} fontSize={11} textAnchor="middle" fill={col(r)} fontWeight={600}>{r.slice(0, 26)}</text></g>;
      })}
      {shape && <g>
        <line x1={20} x2={W - 20} y1={yc - 125} y2={yc - 125} stroke="#9aa3ab" strokeDasharray="4 4" />
        <path d={line(-1)} fill="none" stroke="#0b5cad" strokeOpacity={0.3} strokeDasharray="4 3" />
        <path d={line(1)} fill="none" stroke="#0b5cad" strokeWidth={2.2}><animate attributeName="d" values={`${line(1)};${line(-1)};${line(1)}`} dur="1.6s" repeatCount="indefinite" /></path>
        {st.map((_, i) => { const a = yc - 125 - (32 * (shape[i] ?? 0)) / mx, b = yc - 125 + (32 * (shape[i] ?? 0)) / mx;
          return <circle key={i} cx={X(xs[i])} cy={a} r={2.4} fill="#0b5cad"><animate attributeName="cy" values={`${a};${b};${a}`} dur="1.6s" repeatCount="indefinite" /></circle>; })}
        {label && <text x={24} y={20} fontSize={12} fill="#0b5cad" fontWeight={600}>{label}</text>}
      </g>}
      <text x={24} y={H - 6} fontSize={9} fill="#5b6878">Disc height ~ station inertia · zigzag = coupling stiffness · circles = gear mesh · numbers = stations{shape ? " · blue = twist angle (animated)" : ""}</text>
    </svg>
  );
}
