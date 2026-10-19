import { forwardRef, useRef } from "react";
import type { Json } from "../api";

// Interactive P&ID of the dynamic model (ISA-style symbols). Nodes can be dragged; any element can be
// selected. With a result frame, lines carry animated flow (speed ~ flow, reversed when the flow reverses),
// valves show their opening, and tag boxes show pressure, temperature and flow.

export type Sel = { kind: "node" | "link" | "ctl"; id: string } | null;
const W = 1120, H = 400;

export const Pid = forwardRef<SVGSVGElement, { net: Json; res?: Json; f?: number; sel: Sel; onSel: (s: Sel) => void; onMove: (id: string, x: number, y: number) => void }>(
  function Pid({ net, res, f = 0, sel, onSel, onMove }, ref) {
    const drag = useRef<string | null>(null);
    const pos: Record<string, [number, number]> = Object.fromEntries(net.nodes.map((n: Json) => [n.id, [n.x, n.y]]));
    const nv = (id: string) => res?.nodes?.[id];
    const lv = (id: string) => res?.links?.[id];
    const dmax = Math.max(...net.links.filter((l: Json) => l.type === "compressor").map((l: Json) => l.design_kg_s ?? 1), 1);
    const isSel = (k: string, id: string) => sel?.kind === k && sel.id === id;
    const vpos: Record<string, [number, number]> = {};
    const move = (e: React.PointerEvent<SVGSVGElement>) => {
      if (!drag.current) return;
      const svg = e.currentTarget, p = svg.createSVGPoint();
      p.x = e.clientX; p.y = e.clientY;
      const q = p.matrixTransform(svg.getScreenCTM()!.inverse());
      onMove(drag.current, Math.round(Math.min(Math.max(q.x, 30), W - 30) / 10) * 10, Math.round(Math.min(Math.max(q.y, 40), H - 40) / 10) * 10);
    };
    const links = net.links.map((l: Json, k: number) => {
      const [x0, y0] = pos[l.from] ?? [0, 0], [x1, y1] = pos[l.to] ?? [0, 0];
      const back = x1 < x0, dy = back ? 120 + 45 * (k % 2) : 0;
      const pts = back ? [[x0, y0], [x0, y0 + dy], [x1, y1 + dy], [x1, y1]] : [[x0, y0], [(x0 + x1) / 2, y0], [(x0 + x1) / 2, y1], [x1, y1]];
      const [mx, my] = back ? [(x0 + x1) / 2, y0 + dy] : [(x0 + x1) / 2, (y0 + y1) / 2];
      vpos[l.id] = [mx, my];
      const m = lv(l.id)?.mdot_kg_s?.[f] ?? 0, op = lv(l.id)?.open?.[f];
      const flow = Math.abs(m) / dmax, d = pts.map((p, i) => `${i ? "L" : "M"}${p[0]},${p[1]}`).join(" ");
      const col = back ? "#0b5cad" : "#2b3440";
      return <g key={l.id} onPointerDown={(e) => { e.stopPropagation(); onSel({ kind: "link", id: l.id }); }} style={{ cursor: "pointer" }}>
        <path d={d} fill="none" stroke={col} strokeWidth={1.6} />
        {res && flow > 0.01 && <path d={d} fill="none" stroke={m < 0 ? "#c0392b" : "#30a46c"} strokeWidth={1.5 + 3 * Math.min(flow, 1)} strokeDasharray="6 10" opacity={0.9}>
          <animate attributeName="stroke-dashoffset" from={m < 0 ? 0 : 32} to={m < 0 ? 32 : 0} dur={`${Math.max(0.15, 0.9 / Math.max(flow, 0.05))}s`} repeatCount="indefinite" /></path>}
        <path d={d} fill="none" stroke="transparent" strokeWidth={12} />
        {l.type === "compressor" ? <g>
          <path d={`M${mx - 30},${my - 26} L${mx + 30},${my - 13} L${mx + 30},${my + 13} L${mx - 30},${my + 26} Z`} fill="#c9d6e3" stroke={isSel("link", l.id) ? "#e5732e" : "#0c1a2b"} strokeWidth={isSel("link", l.id) ? 2.5 : 1.4} />
          <text x={mx} y={my - 34} fontSize={11} fontWeight={700} textAnchor="middle">{l.id}</text>
          {res && <text x={mx} y={my + 42} fontSize={10} textAnchor="middle" fill="#0b5cad">{`${(res.compressor.speed_frac[f] * 100).toFixed(0)} % · ${m.toFixed(1)} kg/s`}</text>}
        </g> : l.type === "pipe" ? null : <g>
          <path d={`M${mx - 13},${my - 9} L${mx + 13},${my + 9} L${mx + 13},${my - 9} L${mx - 13},${my + 9} Z`}
            fill={l.type === "check" ? "#2b3440" : `url(#pid-open-${l.id})`} stroke={isSel("link", l.id) ? "#e5732e" : "#2b3440"} strokeWidth={isSel("link", l.id) ? 2.4 : 1.1} />
          <defs><linearGradient id={`pid-open-${l.id}`} x1="0" x2="0" y1="1" y2="0"><stop offset={op ?? l.open ?? 0} stopColor="#30a46c" /><stop offset={op ?? l.open ?? 0} stopColor="#fff" /></linearGradient></defs>
          {l.type !== "check" && <path d={`M${mx},${my} L${mx},${my - 18} M${mx - 8},${my - 18} L${mx + 8},${my - 18} L${mx},${my - 25} Z`} stroke="#2b3440" fill="#2b3440" />}
          <text x={mx} y={my + (l.type === "check" ? -14 : -30)} fontSize={10} fontWeight={700} textAnchor="middle">{l.id}</text>
          {res && <text x={mx} y={my + 22} fontSize={9.5} textAnchor="middle" fill="#0b5cad">{l.type === "check" ? `${m.toFixed(1)} kg/s` : `${((op ?? 0) * 100).toFixed(0)} % · ${m.toFixed(1)}`}</text>}
        </g>}
      </g>;
    });
    const nodes = net.nodes.map((n: Json) => {
      const [x, y] = pos[n.id], s = isSel("node", n.id), st = s ? "#e5732e" : "#2b3440", sw = s ? 2.4 : 1.2;
      const P = nv(n.id)?.P_bara?.[f], T = nv(n.id)?.T_c?.[f];
      return <g key={n.id} style={{ cursor: "move" }} onPointerDown={(e) => { e.stopPropagation(); drag.current = n.id; onSel({ kind: "node", id: n.id }); (e.currentTarget.ownerSVGElement as SVGSVGElement).setPointerCapture(e.pointerId); }}>
        {n.type === "source" || n.type === "sink" ? <path d={n.type === "source" ? `M${x - 30},${y - 15} L${x + 12},${y - 15} L${x + 30},${y} L${x + 12},${y + 15} L${x - 30},${y + 15} Z` : `M${x + 30},${y - 15} L${x - 12},${y - 15} L${x - 30},${y} L${x - 12},${y + 15} L${x + 30},${y + 15} Z`} fill="#eef2f6" stroke={st} strokeWidth={sw} />
          : n.type === "cooler" ? <g><circle cx={x} cy={y} r={28} fill="#e8f4fb" stroke={st} strokeWidth={sw} /><path d={`M${x - 20},${y + 6} L${x - 9},${y - 9} L${x},${y + 9} L${x + 9},${y - 9} L${x + 20},${y + 6}`} fill="none" stroke="#0b5cad" strokeWidth={1.6} /></g>
            : <rect x={x - 17} y={y - 36} width={34} height={72} rx={16} fill="#eef2f6" stroke={st} strokeWidth={sw} />}
        <text x={x} y={y - 46} fontSize={11} fontWeight={700} textAnchor="middle">{n.id}</text>
        <text x={x} y={y + 52} fontSize={9.5} textAnchor="middle" fill="#5b6878">{n.label}</text>
        {P != null && <g><rect x={x - 38} y={y + 58} width={76} height={30} rx={3} fill="#0c1a2b" opacity={0.88} />
          <text x={x} y={y + 71} fontSize={10} textAnchor="middle" fill="#9fe6b8" fontFamily="monospace">{`${P.toFixed(1)} bara`}</text>
          <text x={x} y={y + 84} fontSize={10} textAnchor="middle" fill="#ffd27a" fontFamily="monospace">{`${T.toFixed(0)} °C`}</text></g>}
      </g>;
    });
    const ctls = (net.controllers ?? []).map((c: Json) => {
      const v = vpos[c.valve];
      if (!v) return null;
      const [mx, my] = v, s = isSel("ctl", c.id), on = res ? true : c.enabled !== false;
      return <g key={c.id} style={{ cursor: "pointer" }} onPointerDown={(e) => { e.stopPropagation(); onSel({ kind: "ctl", id: c.id }); }}>
        <path d={`M${mx},${my - 25} L${mx + 40},${my - 60}`} stroke="#c0392b" strokeDasharray="4 3" />
        <circle cx={mx + 52} cy={my - 68} r={17} fill="#fff" stroke={s ? "#e5732e" : "#c0392b"} strokeWidth={s ? 2.4 : 1.3} opacity={on ? 1 : 0.5} />
        <line x1={mx + 35} x2={mx + 69} y1={my - 68} y2={my - 68} stroke="#c0392b" strokeWidth={0.8} />
        <text x={mx + 52} y={my - 72} fontSize={9} textAnchor="middle" fill="#c0392b" fontWeight={700}>{c.id.split("-")[0]}</text>
        <text x={mx + 52} y={my - 58} fontSize={8} textAnchor="middle" fill="#c0392b">{c.id.split("-")[1] ?? ""}</text>
      </g>;
    });
    return <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="pid" onPointerMove={move} onPointerUp={() => { drag.current = null; }} onPointerDown={() => onSel(null)}
      style={{ width: "100%", background: "#fff", border: "1px solid #dfe4e8", borderRadius: 6, touchAction: "none", userSelect: "none" }} role="img" aria-label="P&ID">
      <defs><pattern id="pid-grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0 L0 0 0 20" fill="none" stroke="#eef1f4" strokeWidth={1} /></pattern></defs>
      <rect width={W} height={H} fill="url(#pid-grid)" />
      {links}{nodes}{ctls}
      {res && <text x={W - 14} y={22} fontSize={13} textAnchor="end" fontFamily="monospace" fill="#0c1a2b">{`t = ${res.t[f].toFixed(2)} s`}</text>}
    </svg>;
  });
