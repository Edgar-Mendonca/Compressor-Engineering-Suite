// Lightweight SVG line / bar chart for animated pages (re-rendered every frame, so no Plotly).
export type Series = { x: number[]; y: number[]; color: string; name?: string; dash?: boolean; width?: number; right?: boolean; fill?: boolean; dots?: boolean };
type Props = {
  series: Series[]; title?: string; xl?: string; yl?: string; yr?: string; h?: number;
  xr?: [number, number]; yrange?: [number, number]; y2range?: [number, number];
  vlines?: { x: number; color: string; label?: string; dash?: boolean }[]; hlines?: { y: number; color: string; label?: string }[];
  bars?: { x: number; y: number; color: string; label?: string }[]; cursor?: number; legend?: boolean; fit?: boolean; markers?: { x: number; y: number; color: string; label?: string }[];
};

const nice = (lo: number, hi: number, n = 5) => {
  const span = hi - lo || 1, step0 = span / n, p = 10 ** Math.floor(Math.log10(step0));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * p).find((s) => s >= step0) ?? step0;
  const out: number[] = [];
  for (let v = Math.ceil(lo / step) * step; v <= hi + 1e-9; v += step) out.push(+v.toFixed(10));
  return out;
};
const lab = (v: number) => (Math.abs(v) >= 1e4 ? `${(v / 1000).toFixed(0)}k` : Math.abs(v) >= 100 ? v.toFixed(0) : Math.abs(v) >= 10 ? v.toFixed(1).replace(/\.0$/, "") : v.toFixed(2).replace(/0$/, ""));

export function LiveChart({ series, title, xl, yl, yr, h = 190, xr, yrange, y2range, vlines = [], hlines = [], bars = [], cursor, legend = true, markers = [], fit = false }: Props) {
  const W = 560, L = 46, R = series.some((s) => s.right) ? 46 : 14, T = title ? 24 : 10, B = 32;
  const all = (k: "x" | "y", right = false) => series.filter((s) => !!s.right === right).flatMap((s) => s[k]).concat(k === "x" ? bars.map((b) => b.x) : bars.map((b) => b.y));
  const xs = all("x").concat(markers.map((m) => m.x)).filter(Number.isFinite), ys = all("y").concat(markers.map((m) => m.y)).filter(Number.isFinite);
  const pad = (a: number[], f: number): [number, number] => { const lo = Math.min(...a), hi = Math.max(...a), d = (hi - lo || Math.abs(hi) || 1) * f; return [lo - d, hi + d]; };
  const [x0, x1] = xr ?? (fit ? pad(xs, 0.04) : [Math.min(...xs, 0), Math.max(...xs, 1)]);
  const [y0, y1] = yrange ?? (fit ? pad(ys.concat(hlines.map((l) => l.y)), 0.1) : [Math.min(0, ...ys), Math.max(...ys, ...hlines.map((l) => l.y), 1e-6) * 1.12]);
  const r2 = series.filter((s) => s.right).flatMap((s) => s.y);
  const [z0, z1] = y2range ?? [0, Math.max(...r2, 1) * 1.08];
  const X = (v: number) => L + ((v - x0) / (x1 - x0 || 1)) * (W - L - R);
  const Y = (v: number) => h - B - ((v - y0) / (y1 - y0 || 1)) * (h - T - B);
  const Z = (v: number) => h - B - ((v - z0) / (z1 - z0 || 1)) * (h - T - B);
  const path = (s: Series) => s.x.map((x, i) => `${i ? "L" : "M"}${X(x).toFixed(1)} ${(s.right ? Z : Y)(s.y[i]).toFixed(1)}`).join("");
  return (
    <svg viewBox={`0 0 ${W} ${h}`} className="livechart" role="img" aria-label={title ?? "chart"}>
      {title && <text x={L} y={15} className="lc-title">{title}</text>}
      {nice(y0, y1).map((v) => <g key={`y${v}`}><line x1={L} x2={W - R} y1={Y(v)} y2={Y(v)} className="lc-grid" /><text x={L - 5} y={Y(v) + 3} className="lc-tick" textAnchor="end">{lab(v)}</text></g>)}
      {nice(x0, x1, 6).map((v) => <g key={`x${v}`}><line x1={X(v)} x2={X(v)} y1={T} y2={h - B} className="lc-grid" /><text x={X(v)} y={h - B + 13} className="lc-tick" textAnchor="middle">{lab(v)}</text></g>)}
      {r2.length > 0 && nice(z0, z1).map((v) => <text key={`z${v}`} x={W - R + 5} y={Z(v) + 3} className="lc-tick">{lab(v)}</text>)}
      <line x1={L} x2={W - R} y1={h - B} y2={h - B} className="lc-axis" /><line x1={L} x2={L} y1={T} y2={h - B} className="lc-axis" />
      {xl && <text x={(L + W - R) / 2} y={h - 4} className="lc-label" textAnchor="middle">{xl}</text>}
      {yl && <text transform={`translate(11 ${(T + h - B) / 2}) rotate(-90)`} className="lc-label" textAnchor="middle">{yl}</text>}
      {yr && <text transform={`translate(${W - 6} ${(T + h - B) / 2}) rotate(90)`} className="lc-label" textAnchor="middle">{yr}</text>}
      {hlines.map((l, i) => <g key={`h${i}`}><line x1={L} x2={W - R} y1={Y(l.y)} y2={Y(l.y)} stroke={l.color} strokeDasharray="5 4" strokeWidth="1.2" />
        {l.label && <text x={W - R - 3} y={Y(l.y) - 4} textAnchor="end" className="lc-tick" fill={l.color}>{l.label}</text>}</g>)}
      {vlines.map((l, i) => <g key={`v${i}`}><line x1={X(l.x)} x2={X(l.x)} y1={T} y2={h - B} stroke={l.color} strokeDasharray={l.dash === false ? undefined : "4 4"} strokeWidth="1" />
        {l.label && <text x={X(l.x) + 3} y={T + 9} className="lc-tick" fill={l.color}>{l.label}</text>}</g>)}
      {bars.map((b, i) => <g key={`b${i}`}><rect x={X(b.x) - 3} y={Y(b.y)} width={6} height={Math.max(h - B - Y(b.y), 0)} fill={b.color} rx="1" />
        {b.label && <text x={X(b.x)} y={Y(b.y) - 4} textAnchor="middle" className="lc-tick">{b.label}</text>}</g>)}
      {series.map((s, i) => s.x.length > 1 && <g key={i}>
        {s.fill && <path d={`${path(s)}L${X(s.x[s.x.length - 1])} ${h - B}L${X(s.x[0])} ${h - B}Z`} fill={s.color} opacity=".1" />}
        <path d={path(s)} fill="none" stroke={s.color} strokeWidth={s.width ?? 1.8} strokeDasharray={s.dash ? "5 4" : undefined} strokeLinejoin="round" />
        {s.dots && s.x.map((x, k) => <circle key={k} cx={X(x)} cy={(s.right ? Z : Y)(s.y[k])} r="3" fill={s.color} stroke="var(--panel)" />)}</g>)}
      {markers.map((m, i) => <g key={`m${i}`}><circle cx={X(m.x)} cy={Y(m.y)} r="5" fill={m.color} stroke="var(--panel)" strokeWidth="1.5" />
        {m.label && <text x={X(m.x) + 7} y={Y(m.y) - 6} className="lc-tick" fill={m.color}>{m.label}</text>}</g>)}
      {cursor !== undefined && <line x1={X(cursor)} x2={X(cursor)} y1={T} y2={h - B} stroke="var(--ink)" strokeWidth="1" />}
      {legend && series.some((s) => s.name) && <g transform={`translate(${L + 6} ${T + 4})`}>{series.filter((s) => s.name).map((s, i) =>
        <g key={i} transform={`translate(${i * 86} 0)`}><rect width="12" height="3" y="3" fill={s.color} /><text x="16" y="8" className="lc-tick">{s.name}</text></g>)}</g>}
    </svg>
  );
}
