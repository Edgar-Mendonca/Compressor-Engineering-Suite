import type { ReactNode } from "react";

// Shared 2.5D (oblique) drawing of the shop test train used by the mechanical running test and the
// performance test pages (and, captured as a picture, by their PDF reports): VFD, driver, couplings with
// guards, gearbox, compressor casing(s) with bearing housings, probes and nozzles, dry-gas-seal panel and
// lube-oil console with supply / drain headers. The PT page draws its closed loop in the top band.

export type TrainSpec = { vfd: boolean; geared: boolean; casings: number; turbine?: boolean; ratio?: number; names?: { driver?: string; gear?: string; casing?: string[] } };
export type Anchors = {
  W: number; H: number; dy: number; Y: number; YD: number; yB: number;
  motor: [number, number]; gear?: [number, number]; vfd?: [number, number]; dgs: [number, number];
  casings: { x: number; w: number; de: number; nde: number; suction: [number, number]; discharge: [number, number] }[];
  console: [number, number];
};
type Fam = "steel" | "driver" | "comp" | "gear" | "base" | "cab" | "guard" | "dark";
const FAM: Record<Fam, [string, string, string]> = {
  steel: ["#f1f4f7", "#b4bdc6", "#727d88"], driver: ["#5d8dc4", "#2f5f96", "#1b3c63"], comp: ["#a9bfcd", "#6f8ea3", "#455f72"],
  gear: ["#b9c1c8", "#8b959e", "#5e6871"], base: ["#9aa2aa", "#6d757e", "#4c535b"], cab: ["#eef0f2", "#cfd4d9", "#9da5ad"],
  guard: ["#ffe08a", "#f2b632", "#b98511"], dark: ["#5b6670", "#3a434c", "#232a31"],
};
const K = 0.55;      // depth y factor of the oblique projection
const LINE = "#1f2a35";

export function TrainDefs({ id, phiD, phiC }: { id: string; phiD: number; phiC: number }) {
  return <defs>
    {Object.entries(FAM).map(([f, [a, b, c]]) => <g key={f}>
      <linearGradient id={`${id}-c-${f}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={c} /><stop offset=".18" stopColor={a} /><stop offset=".55" stopColor={b} /><stop offset="1" stopColor={c} /></linearGradient>
      <linearGradient id={`${id}-b-${f}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></linearGradient></g>)}
    {([["D", phiD], ["C", phiC]] as [string, number][]).map(([k, p]) =>
      <pattern key={k} id={`${id}-rot${k}`} width="14" height="60" patternUnits="userSpaceOnUse" patternTransform={`translate(0 ${(p * 56) % 60})`}>
        <path d="M0 0 L14 14 M0 30 L14 44" stroke="#1f2a35" strokeWidth="3" opacity=".35" /></pattern>)}
    <pattern id={`${id}-mesh`} width="6" height="6" patternUnits="userSpaceOnUse"><path d="M0 6 L6 0" stroke="#8a6206" strokeWidth=".8" opacity=".5" /></pattern>
    <radialGradient id={`${id}-shadow`}><stop offset="0" stopColor="#000" stopOpacity=".22" /><stop offset="1" stopColor="#000" stopOpacity="0" /></radialGradient>
    <linearGradient id={`${id}-floor`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--panel)" /><stop offset="1" stopColor="var(--panel-2)" /></linearGradient>
  </defs>;
}

/** Oblique box: front face (x, y, w, h), depth d up and to the right. */
export function Block({ id, x, y, w, h, d = 14, f, children, sw = 0.8 }: { id: string; x: number; y: number; w: number; h: number; d?: number; f: Fam; children?: ReactNode; sw?: number }) {
  const [a, , c] = FAM[f], dy = d * K;
  return <g>
    <polygon points={`${x},${y} ${x + d},${y - dy} ${x + w + d},${y - dy} ${x + w},${y}`} fill={a} stroke={LINE} strokeWidth={sw} strokeLinejoin="round" />
    <polygon points={`${x + w},${y} ${x + w + d},${y - dy} ${x + w + d},${y + h - dy} ${x + w},${y + h}`} fill={c} stroke={LINE} strokeWidth={sw} strokeLinejoin="round" />
    <rect x={x} y={y} width={w} height={h} fill={`url(#${id}-b-${f})`} stroke={LINE} strokeWidth={sw} />{children}</g>;
}
/** Horizontal cylinder along x with the right end cap visible. */
export function Drum({ id, x, cy, w, r, f, rot, cap = true }: { id: string; x: number; cy: number; w: number; r: number; f: Fam; rot?: string; cap?: boolean }) {
  return <g>
    <rect x={x} y={cy - r} width={w} height={2 * r} fill={`url(#${id}-c-${f})`} stroke={LINE} strokeWidth=".8" />
    {rot && <rect x={x} y={cy - r} width={w} height={2 * r} fill={`url(#${id}-rot${rot})`} />}
    {cap && <ellipse cx={x + w} cy={cy} rx={Math.max(r * 0.24, 2)} ry={r} fill={FAM[f][1]} stroke={LINE} strokeWidth=".8" />}
  </g>;
}
/** Spur gear with teeth, spokes hidden behind a web, and a hub. */
const Teeth = ({ cx, cy, r, n, ang, fill, hub }: { cx: number; cy: number; r: number; n: number; ang: number; fill: string; hub?: boolean }) => {
  const p: string[] = [];
  for (let i = 0; i < n * 4; i++) { const a = (i / (n * 4)) * 2 * Math.PI, rr = i % 4 < 2 ? r : r * 0.86; p.push(`${cx + rr * Math.cos(a)},${cy + rr * Math.sin(a)}`); }
  return <g transform={`rotate(${ang} ${cx} ${cy})`}><polygon points={p.join(" ")} fill={fill} stroke={LINE} strokeWidth=".8" />
    <circle cx={cx} cy={cy} r={r * 0.62} fill="#8b959e" stroke={LINE} strokeWidth=".6" />{hub && <circle cx={cx} cy={cy} r={r * 0.26} fill="#eef1f4" stroke={LINE} strokeWidth=".8" />}
    <line x1={cx} y1={cy} x2={cx + r * 0.55} y2={cy} stroke={LINE} strokeWidth="1.5" /></g>;
};
/** Flow direction arrow on a line. */
export const Arrow = ({ x, y, dir, c }: { x: number; y: number; dir: "l" | "r" | "u" | "d"; c: string }) => {
  const r = { r: 0, d: 90, l: 180, u: 270 }[dir];
  return <g transform={`translate(${x} ${y}) rotate(${r})`}><path d="M-9 0 H5" stroke={c} strokeWidth="2.4" /><polygon points="9,0 2,-5 2,5" fill={c} /></g>;
};
const Bolts = ({ cx, cy, r, n = 10 }: { cx: number; cy: number; r: number; n?: number }) => <g>{Array.from({ length: n }, (_, i) => {
  const a = -Math.PI / 2 + (i / (n - 1)) * Math.PI; return <circle key={i} cx={cx + r * 0.24 * Math.cos(a) * 0.9} cy={cy + r * Math.sin(a) * 0.92} r="1.9" fill="#2b343d" />; })}</g>;

/** Anchors in scene coordinates; dy moves the train down to leave a taller top band (the PT loop). */
export function layout(t: TrainSpec, dy = 0): Anchors {
  return shift(layout0(t), dy);
}
function shift(a: Anchors, dy: number): Anchors {
  return { ...a, dy: a.dy + dy, H: a.H + dy, yB: a.yB + dy, Y: a.Y + dy, YD: a.YD + dy, console: [a.console[0], a.console[1] + dy],
    casings: a.casings.map((c) => ({ ...c, suction: [c.suction[0], c.suction[1] + dy], discharge: [c.discharge[0], c.discharge[1] + dy] })) };
}
function layout0(t: TrainSpec): Anchors {
  const H = 548, yB = 452, Y = t.geared ? 318 : 342, YD = 342;
  let x = 40 + 180 + 46;
  const a: Partial<Anchors> = { H, dy: 0, yB, Y, YD, casings: [], console: [40, yB - 92] };
  if (t.vfd) { a.vfd = [x, 86]; x += 86 + 34; }
  a.motor = [x, 250]; x += 250 + 70;
  if (t.geared) { a.gear = [x, 170]; x += 170 + 70; }
  for (let i = 0; i < t.casings; i++) {
    const w = 330;
    a.casings!.push({ x, w, de: x + 30, nde: x + w - 30, suction: [x + w * 0.33, Y - 150], discharge: [x + w * 0.67, Y - 150] });
    x += w + (i < t.casings - 1 ? 64 : 0);
  }
  x += 60; a.dgs = [x, 128]; x += 128 + 30;
  a.W = Math.max(x, 1100);
  return a as Anchors;
}

const Coupling = ({ id, x, w, y, r, rot }: { id: string; x: number; w: number; y: number; r: number; rot: string }) => <g>
  <Drum id={id} x={x} cy={y} w={w} r={r * 0.32} f="steel" rot={rot} cap={false} />
  <Drum id={id} x={x + 6} cy={y} w={16} r={r * 0.78} f="steel" rot={rot} />
  <Drum id={id} x={x + w - 22} cy={y} w={16} r={r * 0.78} f="steel" rot={rot} />
  <rect x={x} y={y - r - 4} width={w} height={2 * r + 8} rx="10" fill={FAM.guard[1]} opacity=".32" stroke={FAM.guard[2]} strokeWidth="1.2" />
  <rect x={x} y={y - r - 4} width={w} height={2 * r + 8} rx="10" fill={`url(#${id}-mesh)`} />
</g>;

/** Probe pair (X / Y at 45 deg either side of top dead centre) on a bearing housing. */
const Probes = ({ cx, cy, col }: { cx: number; cy: number; col: [string, string] }) => <g>{[-1, 1].map((s, j) => {
  const a = (-90 + s * 45) * Math.PI / 180, x1 = cx + 22 * Math.cos(a), y1 = cy + 22 * Math.sin(a), x2 = cx + 40 * Math.cos(a), y2 = cy + 40 * Math.sin(a);
  return <g key={s}><line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#2b343d" strokeWidth="5" strokeLinecap="round" />
    <circle cx={x2} cy={y2} r="4.6" fill={col[j]} stroke={LINE} strokeWidth=".8" /></g>; })}</g>;

export function TrainScene({ id, t, a: A0, phiD, phiC, flow, running, hz, probe, top, over, svgRef, height }: {
  id: string; t: TrainSpec; a: Anchors; phiD: number; phiC: number; flow: number; running: boolean; hz?: number;
  probe?: (k: string) => string; top?: ReactNode; over?: ReactNode; svgRef?: (e: SVGSVGElement | null) => void; height?: number;
}) {
  const a = shift(A0, -A0.dy), H = A0.H;
  const { W, Y, YD, yB } = a;
  const pc = (k: string) => probe?.(k) ?? "#2e9e6b";
  const [mx, mw] = a.motor;
  const bearings: [number, number][] = [[mx + 46, YD], [mx + mw - 34, YD], ...a.casings.flatMap((c) => [[c.de, Y], [c.nde, Y]] as [number, number][])];
  const lab = (x: number, s: string, s2?: string) => <g><line x1={x} x2={x} y1={yB + 48} y2={yB + 56} stroke="var(--line-2)" />
    <text x={x} y={yB + 68} textAnchor="middle" className="ts-lab">{s}</text>{s2 && <text x={x} y={yB + 80} textAnchor="middle" className="ts-sub">{s2}</text>}</g>;
  const end = a.casings[a.casings.length - 1];
  const [gx] = a.dgs;
  return (
    <svg ref={svgRef} viewBox={`0 0 ${W} ${height ?? H}`} className="mrt-stage ts" role="img" aria-label="Shop test train">
      <TrainDefs id={id} phiD={phiD} phiC={phiC} />
      <rect width={W} height={height ?? H} fill={`url(#${id}-floor)`} />
      {/* floor shadow and baseplate */}
      <ellipse cx={(mx + end.x + end.w) / 2} cy={yB + 26} rx={(end.x + end.w - mx) / 1.8} ry="18" fill={`url(#${id}-shadow)`} />
      {top}
      <g transform={`translate(0 ${A0.dy})`}>
      <Block id={id} x={mx - 16} y={yB} w={end.x + end.w - mx + 32} h={24} d={22} f="base">
        {Array.from({ length: Math.floor((end.x + end.w - mx) / 60) }, (_, i) => <rect key={i} x={mx + i * 60} y={yB + 6} width="8" height="12" fill="#3b4249" opacity=".55" />)}</Block>
      {/* VFD cabinet */}
      {a.vfd && (() => { const vfd = a.vfd; return <g>
        <Block id={id} x={vfd[0]} y={150} w={vfd[1]} h={yB + 24 - 150} d={18} f="cab">
          <line x1={vfd[0] + vfd[1] / 2} x2={vfd[0] + vfd[1] / 2} y1={214} y2={yB + 18} stroke="#9da5ad" />
          <rect x={vfd[0] + 8} y={166} width={vfd[1] - 16} height={28} rx="2" fill="#0d1620" />
          <text x={vfd[0] + vfd[1] / 2} y={185} textAnchor="middle" className="ts-lcd">{hz != null ? `${hz.toFixed(1)}Hz` : "VFD"}</text>
          <circle cx={vfd[0] + 16} cy={206} r="3.5" fill={running ? "#2ecc71" : "#7a838c"} /><circle cx={vfd[0] + 28} cy={206} r="3.5" fill="#e0a020" opacity=".6" />
          {Array.from({ length: 7 }, (_, i) => <line key={i} x1={vfd[0] + vfd[1] / 2 + 8} x2={vfd[0] + vfd[1] - 8} y1={yB - 80 + i * 7} y2={yB - 80 + i * 7} stroke="#8d969f" strokeWidth="2" />)}
          <rect x={vfd[0] + vfd[1] / 2 - 6} y={300} width="3" height="18" fill="#6d757e" /><rect x={vfd[0] + vfd[1] / 2 + 3} y={300} width="3" height="18" fill="#6d757e" /></Block>
        <path d={`M${vfd[0] + vfd[1] + 18} 176 C ${vfd[0] + vfd[1] + 50} 176, ${mx + 120} 190, ${mx + 125} ${YD - 92}`} stroke="#22292f" strokeWidth="6" fill="none" strokeLinecap="round" />
      </g>; })()}
      {/* driver */}
      {!t.turbine ? <g>
        <Block id={id} x={mx + 44} y={YD + 52} w={34} h={yB - YD - 52} d={10} f="dark" /><Block id={id} x={mx + mw - 82} y={YD + 52} w={34} h={yB - YD - 52} d={10} f="dark" />
        <Drum id={id} x={mx} cy={YD} w={46} r={60} f="dark" />
        {Array.from({ length: 7 }, (_, i) => <line key={i} x1={mx + 8} x2={mx + 40} y1={YD - 42 + i * 14} y2={YD - 42 + i * 14} stroke="#11171c" strokeWidth="2.2" />)}
        <Drum id={id} x={mx + 46} cy={YD} w={mw - 76} r={66} f="driver" />
        {Array.from({ length: Math.floor((mw - 90) / 9) }, (_, i) => <line key={i} x1={mx + 54 + i * 9} x2={mx + 54 + i * 9} y1={YD - 60} y2={YD + 60} stroke="#17365b" strokeWidth="2.4" opacity=".55" />)}
        <Block id={id} x={mx + mw / 2 - 40} y={YD - 100} w={70} h={34} d={14} f="driver"><rect x={mx + mw / 2 - 30} y={YD - 92} width="50" height="18" rx="2" fill="#dfe6ee" opacity=".9" />
          <text x={mx + mw / 2 - 5} y={YD - 79} textAnchor="middle" className="ts-plate">{t.names?.driver?.match(/\d+\s*kW/)?.[0] ?? "MOTOR"}</text></Block>
        <Drum id={id} x={mx + mw - 30} cy={YD} w={14} r={46} f="driver" />
      </g> : <g>
        <Block id={id} x={mx} y={YD - 70} w={mw - 30} h={yB - YD + 70} d={18} f="comp"><line x1={mx} x2={mx + mw - 30} y1={YD} y2={YD} stroke={LINE} />
          <text x={mx + (mw - 30) / 2} y={YD - 20} textAnchor="middle" className="ts-name">STEAM TURBINE</text></Block>
      </g>}
      <Drum id={id} x={mx + mw - 16} cy={YD} w={70 + 4} r={8} f="steel" rot="D" cap={false} />
      <Coupling id={id} x={mx + mw + 4} w={58} y={YD} r={26} rot="D" />
      {/* gearbox */}
      {a.gear && (() => { const [x, w] = a.gear; return <g>
        <Block id={id} x={x} y={Y - 92} w={w} h={yB - Y + 92} d={24} f="gear">
          <line x1={x} x2={x + w} y1={Y - 46} y2={Y - 46} stroke={LINE} strokeWidth="1.2" />
          {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={x + 10 + i * (w - 20) / 8} cy={Y - 46} r="2" fill="#2b343d" />)}
          {/* cut-away window with the gear wheel and pinion */}
          <rect x={x + 14} y={Y - 34} width={w - 28} height={YD - Y + 92} rx="8" fill="#1e262e" stroke={LINE} />
          <rect x={x + 14} y={Y - 34} width={w - 28} height={YD - Y + 92} rx="8" fill="none" stroke="#e0a020" strokeWidth="1.2" strokeDasharray="6 4" />
          <Teeth cx={x + w * 0.4} cy={YD} r={47} n={30} ang={phiD * 360} fill="#e6eaee" hub />
          <Teeth cx={x + w * 0.4 + 64} cy={Y} r={19} n={12} ang={-phiC * 360} fill="#c9d0d7" hub />
          <Block id={id} x={x + 30} y={Y - 84} w={w - 60} h={26} d={8} f="gear" />
          <rect x={x + w - 34} y={Y - 112} width="12" height="16" fill={FAM.gear[2]} stroke={LINE} /><circle cx={x + w - 28} cy={Y - 115} r="5" fill={FAM.gear[0]} stroke={LINE} />
          <text x={x + w / 2} y={yB - 14} textAnchor="middle" className="ts-name dark">GEARBOX</text></Block>
        <Drum id={id} x={x + w - 4} cy={Y} w={70 + 8} r={7} f="steel" rot="C" cap={false} />
        <Coupling id={id} x={x + w + 6} w={58} y={Y} r={22} rot="C" />
      </g>; })()}
      {/* compressor casing(s) */}
      {a.casings.map((c, i) => <g key={i}>
        <Drum id={id} x={c.x - 6} cy={Y} w={c.w + 12} r={7} f="steel" rot="C" cap={false} />
        <Block id={id} x={c.x + 70} y={Y + 58} w={30} h={yB - Y - 58} d={12} f="dark" /><Block id={id} x={c.x + c.w - 100} y={Y + 58} w={30} h={yB - Y - 58} d={12} f="dark" />
        {/* bearing housings */}
        <Block id={id} x={c.x + 8} y={Y - 38} w={44} h={76} d={14} f="comp" /><Block id={id} x={c.x + c.w - 52} y={Y - 38} w={44} h={76} d={14} f="comp" />
        <text x={c.x + 30} y={Y + 30} textAnchor="middle" className="ts-name">DE</text><text x={c.x + c.w - 22} y={Y + 30} textAnchor="middle" className="ts-name">NDE</text>
        {/* end covers and barrel */}
        <Drum id={id} x={c.x + 52} cy={Y} w={30} r={84} f="comp" /><Bolts cx={c.x + 82} cy={Y} r={84} />
        <Drum id={id} x={c.x + 82} cy={Y} w={c.w - 164} r={76} f="comp" />
        <Drum id={id} x={c.x + c.w - 82} cy={Y} w={30} r={84} f="comp" /><Bolts cx={c.x + c.w - 52} cy={Y} r={84} />
        {/* nozzles with flanges */}
        {[c.suction, c.discharge].map(([nx, ny], j) => <g key={j}>
          <rect x={nx - 22} y={ny + 14} width={44} height={Y - 74 - ny - 14} fill={`url(#${id}-c-comp)`} stroke={LINE} strokeWidth=".8" />
          <rect x={nx - 34} y={ny + 4} width={68} height={12} fill={`url(#${id}-c-comp)`} stroke={LINE} strokeWidth=".8" />
          <ellipse cx={nx} cy={ny + 4} rx={34} ry={8} fill={FAM.comp[0]} stroke={LINE} strokeWidth=".8" />
          {Array.from({ length: 8 }, (_, b) => <circle key={b} cx={nx + 27 * Math.cos(b * Math.PI / 4)} cy={ny + 4 + 6.2 * Math.sin(b * Math.PI / 4)} r="1.8" fill="#2b343d" />)}
          <ellipse cx={nx} cy={ny + 4} rx={13} ry={3} fill="#3c5263" />
          <text x={j ? nx + 40 : nx - 40} y={ny + 30} textAnchor={j ? "start" : "end"} className="ts-lab">{j ? "DISCHARGE" : "SUCTION"}</text></g>)}
        <rect x={c.x + c.w / 2 - 34} y={Y - 12} width="68" height="24" rx="2" fill="#dfe6ee" opacity=".92" stroke="#455f72" strokeWidth=".6" />
        <text x={c.x + c.w / 2} y={Y + 4} textAnchor="middle" className="ts-plate">{a.casings.length > 1 ? `CASING ${i + 1}` : "COMPRESSOR"}</text>
        {/* probes: X / Y on both journals, keyphasor at DE, axial A / B at the thrust end */}
        <Probes cx={c.de + 2} cy={Y - 10} col={[pc("V1-X"), pc("V1-Y")]} /><Probes cx={c.nde - 2} cy={Y - 10} col={[pc("V2-X"), pc("V2-Y")]} />
        <line x1={c.de + 2} y1={Y + 44} x2={c.de + 2} y2={Y + 60} stroke="#2b343d" strokeWidth="4.5" /><polygon points={`${c.de - 3},${Y + 62} ${c.de + 7},${Y + 62} ${c.de + 2},${Y + 68}`} fill="#e0a020" />
        {i === a.casings.length - 1 && [0, 1].map((j) => <g key={j}><line x1={c.x + c.w + 4} y1={Y - 8 + j * 16} x2={c.x + c.w + 22} y2={Y - 14 + j * 28} stroke="#2b343d" strokeWidth="4.5" strokeLinecap="round" />
          <circle cx={c.x + c.w + 24} cy={Y - 15 + j * 30} r="4.4" fill={pc(j ? "V6-Z" : "V5-Z")} stroke={LINE} strokeWidth=".8" /></g>)}
        {i < a.casings.length - 1 && <Coupling id={id} x={c.x + c.w + 3} w={58} y={Y} r={20} rot="C" />}
      </g>)}
      {/* dry gas seal panel and its lines to the seals (inboard of the bearing housings) */}
      <g>
        <Block id={id} x={gx} y={Y - 110} w={a.dgs[1]} h={yB + 24 - Y + 110} d={18} f="cab">
          <rect x={gx + 8} y={Y - 102} width={a.dgs[1] - 16} height="16" fill="#6c5a9c" /><text x={gx + a.dgs[1] / 2} y={Y - 90} textAnchor="middle" className="ts-name">DGS PANEL</text>
          {[0, 1, 2].map((j) => <g key={j}><circle cx={gx + 26 + j * 38} cy={Y - 62} r="13" fill="#f8f9fa" stroke={LINE} /><line x1={gx + 26 + j * 38} y1={Y - 62}
            x2={gx + 26 + j * 38 + 9 * Math.cos(-2.2 + (running ? 1.6 : 0.2) + j * 0.3)} y2={Y - 62 + 9 * Math.sin(-2.2 + (running ? 1.6 : 0.2) + j * 0.3)} stroke="#c0392b" strokeWidth="1.6" /></g>)}
          {[0, 1, 2, 3].map((j) => <g key={j}><rect x={gx + 16 + j * 25} y={Y - 34} width="12" height="66" rx="5" fill="#e9f2f8" stroke={LINE} strokeWidth=".7" />
            <circle cx={gx + 22 + j * 25} cy={Y + 22 - (running ? 26 + 6 * j : 2)} r="4" fill={j < 2 ? "#56b4e9" : "#e69f00"} /></g>)}
        </Block>
        {a.casings.flatMap((c) => [c.x + 64, c.x + c.w - 64]).map((sx, j) => <g key={j}>
          <path d={`M${gx} ${Y - 70 + j * 6} H${sx + 4} V${Y - 84}`} className="ts-flow" stroke="#e69f00" strokeDashoffset={-flow} />
          <path d={`M${sx - 4} ${Y - 84} V${Y - 96 - j * 6} H${gx}`} className="ts-flow" stroke="#56b4e9" strokeDashoffset={flow * 0.7} />
          {j === 0 && <><Arrow x={gx - 26} y={Y - 70} dir="l" c="#e69f00" /><Arrow x={gx - 26} y={Y - 96} dir="r" c="#3d9bd6" /></>}</g>)}
      </g>
      {/* lube oil console with supply (blue) and drain (orange) headers */}
      {(() => { const [cx, cy] = a.console; return <g>
        <path d={`M${cx + 180} ${yB + 32} H${bearings[bearings.length - 1][0] + 6}`} className="ts-oil" stroke="#3d8fd6" strokeDashoffset={-flow} />
        <path d={`M${bearings[bearings.length - 1][0] - 6} ${yB + 41} H${cx + 180}`} className="ts-oil" stroke="#d17a2a" strokeDashoffset={-flow * 0.6} />
        {[0.25, 0.55, 0.85].map((f) => { const x0 = cx + 180 + f * (bearings[bearings.length - 1][0] - cx - 180); return <g key={f}>
          <Arrow x={x0} y={yB + 32} dir="r" c="#2f7fc9" /><Arrow x={x0 + 30} y={yB + 41} dir="l" c="#c96a1c" /></g>; })}
        {bearings.map(([bx, by], j) => <g key={j}><path d={`M${bx + 6} ${yB + 32} V${by + 40}`} className="ts-oil thin" stroke="#3d8fd6" strokeDashoffset={-flow} />
          <path d={`M${bx - 6} ${by + 40} V${yB + 41}`} className="ts-oil thin" stroke="#d17a2a" strokeDashoffset={-flow * 0.6} /></g>)}
        <Block id={id} x={cx} y={cy} w={180} h={yB + 24 - cy} d={20} f="cab">
          <rect x={cx + 8} y={cy + 8} width="164" height="16" fill="#a88a4f" /><text x={cx + 90} y={cy + 20} textAnchor="middle" className="ts-name">LUBE OIL CONSOLE</text>
          <rect x={cx + 14} y={cy + 34} width="10" height={yB - cy - 30} rx="2" fill="#e9f2f8" stroke={LINE} strokeWidth=".6" />
          <rect x={cx + 15.5} y={cy + 34 + (yB - cy - 30) * 0.35} width="7" height={(yB - cy - 30) * 0.65} rx="1" fill="#c9a24a" />
          {[0, 1].map((j) => <g key={j}><Drum id={id} x={cx + 40 + j * 66} cy={cy + 52} w={44} r={14} f="driver" /><Drum id={id} x={cx + 84 + j * 66} cy={cy + 52} w={12} r={9} f="steel" />
            <rect x={cx + 46 + j * 66} y={cy + 70} width="14" height="34" rx="6" fill={`url(#${id}-c-steel)`} stroke={LINE} strokeWidth=".7" /></g>)}</Block>
      </g>; })()}
      {/* name strip */}
      {lab(a.console[0] + 90, "LUBE OIL CONSOLE")}
      {a.vfd && lab(a.vfd[0] + a.vfd[1] / 2, "VFD")}
      {lab(mx + mw / 2, t.turbine ? "DRIVER" : "MOTOR", t.names?.driver)}
      {lab(mx + mw + 33, a.gear ? "LS COUPLING" : "COUPLING")}
      {a.gear && lab(a.gear[0] + a.gear[1] + 35, "HS COUPLING")}
      {a.gear && lab(a.gear[0] + a.gear[1] / 2, "GEARBOX", t.names?.gear)}
      {a.casings.map((c, i) => <g key={i}>{lab(c.x + c.w / 2, a.casings.length > 1 ? `CASING ${i + 1}` : "COMPRESSOR", t.names?.casing?.[i])}</g>)}
      {lab(gx + a.dgs[1] / 2, "SEAL GAS PANEL")}
      </g>
      {over}
    </svg>
  );
}

/** Instrument callout: ISA bubble rows with values, a leader line to the point it measures. */
export function TagCard({ x, y, title, rows, to, w = 168, rh = 17 }: { x: number; y: number; title?: string; rows: [string, string, string?][]; to?: [number, number]; w?: number; rh?: number }) {
  const h = (title ? 18 : 4) + rows.length * rh + 4;
  return <g>
    {to && <path d={to[0] >= x && to[0] <= x + w ? `M${to[0]} ${to[1]} V${to[1] > y ? y + h : y}` : `M${to[0]} ${to[1]} V${y + h / 2} H${to[0] < x ? x : x + w}`}
      fill="none" stroke="#5b6878" strokeWidth=".9" strokeDasharray="3 2" />}
    {to && <circle cx={to[0]} cy={to[1]} r="2.6" fill="#5b6878" />}
    <rect x={x} y={y} width={w} height={h} rx="3" fill="var(--panel)" stroke="var(--line-2)" opacity=".97" />
    {title && <text x={x + 8} y={y + 13} className="ts-cardt">{title}</text>}
    {rows.map(([t, v, c], i) => { const yy = y + (title ? 18 : 4) + i * rh; return <g key={t + i}>
      <rect x={x + 6} y={yy + 2} width="62" height="13" rx="6.5" fill="var(--panel)" stroke={c ?? "#0b5cad"} strokeWidth="1.1" />
      <text x={x + 37} y={yy + 12} textAnchor="middle" className="ts-tag" fill={c ?? "#0b5cad"}>{t}</text>
      <text x={x + w - 7} y={yy + 12} textAnchor="end" className="ts-val">{v}</text></g>; })}
  </g>;
}
