import { useEffect, useMemo, useRef, useState } from "react";
import type { Json } from "../api";

// Charts are drawn by the backend with matplotlib in a GraphPad Prism style and
// shown as SVG. This component adds the data cursor, the chart editor and exports.
// Traces and layout use a small Plotly-like vocabulary (see reporting/prism.py).

export const SERIES = ["#0B5CAD", "#D55E00", "#009E73", "#CC79A7", "#E69F00", "#56B4E9", "#000000", "#7F7F7F"];

type Opts = Record<string, Json>;
const DEFAULT_KEY = "cf.chart.default";
const load = (k: string): Opts => { try { return JSON.parse(localStorage.getItem(k) ?? "{}"); } catch { return {}; } };
const save = (k: string, v: Opts) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } };
const titleOf = (v: Json) => (typeof v === "string" ? v : v?.text ?? "");

function chartKey(data: Json[], layout: Json) {
  const t = [titleOf(layout?.title), titleOf(layout?.xaxis?.title), titleOf(layout?.yaxis?.title), data.map((d) => d.name).join("|")].join("·");
  return `cf.chart.${t}`;
}

async function post(url: string, body: unknown) {
  const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error((await r.json().catch(() => ({}))).detail ?? r.statusText);
  return r;
}

function toFrac(v: number, lim: number[], log: boolean) {
  if (log) return (Math.log10(v) - Math.log10(lim[0])) / (Math.log10(lim[1]) - Math.log10(lim[0]));
  return (v - lim[0]) / (lim[1] - lim[0]);
}
function fromFrac(f: number, lim: number[], log: boolean) {
  if (log) return 10 ** (Math.log10(lim[0]) + f * (Math.log10(lim[1]) - Math.log10(lim[0])));
  return lim[0] + f * (lim[1] - lim[0]);
}
const num = (v: number) => (Math.abs(v) >= 1e5 || (Math.abs(v) < 1e-3 && v !== 0) ? v.toExponential(3) : Number(v.toPrecision(5)).toString());

const MARKERS = ["", "o", "s", "D", "^", "v", "P", "X", "*"];
const MARKER_NAMES: Record<string, string> = { "": "none", o: "circle", s: "square", D: "diamond", "^": "triangle up", v: "triangle down", P: "plus", X: "cross", "*": "star" };

export function Plot({ data, layout, height = 340 }: { data: Json[]; layout?: Json; height?: number }) {
  const key = useMemo(() => chartKey(data, layout), [data, layout]);
  const [opts, setOpts] = useState<Opts>(() => ({ ...load(DEFAULT_KEY), ...load(key) }));
  const [res, setRes] = useState<Json>(null);
  const [err, setErr] = useState("");
  const [edit, setEdit] = useState(false);
  const [cursor, setCursor] = useState<Json>(null);
  const [width, setWidth] = useState(0);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => { setOpts({ ...load(DEFAULT_KEY), ...load(key) }); }, [key]);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(Math.round(el.clientWidth / 24) * 24));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const h = Number(opts.height_px ?? height);
  const body = useMemo(() => ({
    spec: { data, layout: layout ?? {} },
    opts: { ...opts, width_in: Math.max(3, (width || 640) / 96), height_in: Math.max(2, h / 96) },
  }), [data, layout, opts, width, h]);

  useEffect(() => {
    if (!width) return;
    let live = true;
    const t = setTimeout(async () => {
      try {
        const r = await (await post("/api/plot", body)).json();
        if (live) { setRes(r); setErr(""); }
      } catch (e) { if (live) setErr((e as Error).message); }
    }, 120);
    return () => { live = false; clearTimeout(t); };
  }, [body, width]);

  const set = (k: string, v: Json) => {
    const next = { ...opts, [k]: v === "" ? undefined : v };
    setOpts(next);
    save(key, next);
  };
  const setSeries = (i: number, k: string, v: Json) => set("series", { ...(opts.series ?? {}), [i]: { ...(opts.series?.[i] ?? {}), [k]: v } });

  const onMove = (e: React.MouseEvent) => {
    const m = res?.meta;
    const el = box.current?.querySelector("svg");
    if (!m || !el) return;
    const r = el.getBoundingClientRect();
    const fx = (e.clientX - r.left) / r.width, fy = 1 - (e.clientY - r.top) / r.height;
    const a = m.axes;
    if (fx < a.left || fx > a.right || fy < a.bottom || fy > a.top) { setCursor(null); return; }
    const ax = (fx - a.left) / (a.right - a.left), ay = (fy - a.bottom) / (a.top - a.bottom);
    let best: Json = null;
    data.forEach((t, i) => {
      const s = m.series[i];
      if (!s || !s.visible || s.axis !== "y") return;
      (t.x ?? []).forEach((xv: number, j: number) => {
        const yv = t.y?.[j];
        if (typeof xv !== "number" || typeof yv !== "number") return;
        const px = toFrac(xv, m.xlim, m.xlog), py = toFrac(yv, m.ylim, m.ylog);
        const d = ((px - ax) * r.width) ** 2 + ((py - ay) * r.height) ** 2;
        if (!best || d < best.d) best = { d, i, x: xv, y: yv, px, py, name: s.name, color: s.color };
      });
    });
    const near = best && best.d < 30 ** 2 ? best : null;
    setCursor({ fx, fy, x: fromFrac(ax, m.xlim, m.xlog), y: fromFrac(ay, m.ylim, m.ylog), near, a });
  };

  const exportAs = async (fmt: string) => {
    const name = (titleOf(layout?.title) || res?.meta?.labels?.y || "chart").replace(/[^\w-]+/g, "_");
    let blob: Blob;
    if (fmt === "csv") {
      const n = Math.max(...data.map((t) => (t.x ?? []).length));
      const head = data.flatMap((t, i) => [`${t.name ?? `series ${i + 1}`} x`, `${t.name ?? `series ${i + 1}`} y`]);
      const rows = Array.from({ length: n }, (_, j) => data.flatMap((t) => [t.x?.[j] ?? "", t.y?.[j] ?? ""]).join(","));
      blob = new Blob([[head.map((s) => `"${s}"`).join(","), ...rows].join("\n")], { type: "text/csv" });
    } else {
      blob = await (await post(`/api/plot/export/${fmt}`, { ...body, dpi: Number(opts.dpi ?? 600) })).blob();
    }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${name}.${fmt}`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const meta = res?.meta;
  const lim = (k: string, i: number) => (opts[k]?.[i] ?? "");
  const setLim = (k: string, i: number, v: string) => {
    const cur = [...(opts[k] ?? [null, null])];
    cur[i] = v === "" ? null : Number(v);
    set(k, cur.every((x) => x === null) ? undefined : cur);
  };

  return (
    <div className="pchart">
      <div className="pbar">
        <button className={`chip ${edit ? "on" : ""}`} onClick={() => setEdit(!edit)}>Edit chart</button>
        {["png", "svg", "pdf", "csv"].map((f) => <button key={f} className="chip" onClick={() => exportAs(f)}>{f.toUpperCase()}</button>)}
      </div>
      <div ref={box} className="plot" style={{ minHeight: h }} onMouseMove={onMove} onMouseLeave={() => setCursor(null)}>
        {res ? <div className="svg" dangerouslySetInnerHTML={{ __html: res.svg }} /> : <div className="ploading" style={{ height: h }}>Drawing chart…</div>}
        {cursor && <>
          <div className="xhair v" style={{ left: `${cursor.fx * 100}%`, top: `${(1 - cursor.a.top) * 100}%`, bottom: `${cursor.a.bottom * 100}%` }} />
          <div className="xhair h" style={{ top: `${(1 - cursor.fy) * 100}%`, left: `${cursor.a.left * 100}%`, right: `${(1 - cursor.a.right) * 100}%` }} />
          {cursor.near && <div className="xdot" style={{ left: `${(cursor.a.left + cursor.near.px * (cursor.a.right - cursor.a.left)) * 100}%`,
            top: `${(1 - (cursor.a.bottom + cursor.near.py * (cursor.a.top - cursor.a.bottom))) * 100}%`, borderColor: cursor.near.color }} />}
          <div className="xread mono" style={{ left: `${Math.min(cursor.fx * 100 + 1, 70)}%`, top: `${(1 - cursor.a.top) * 100 + 1}%` }}>
            {cursor.near ? <><b style={{ color: cursor.near.color }}>{cursor.near.name}</b><br />x {num(cursor.near.x)} · y {num(cursor.near.y)}</>
              : <>x {num(cursor.x)} · y {num(cursor.y)}</>}
          </div>
        </>}
      </div>
      {err && <div className="error">{err}</div>}
      {edit && meta && (
        <div className="peditor">
          <div className="form">
            <label>Title<input value={opts.title ?? ""} placeholder={meta.labels.title} onChange={(e) => set("title", e.target.value)} /></label>
            <label>X axis title<input value={opts.xlabel ?? ""} placeholder={meta.labels.x} onChange={(e) => set("xlabel", e.target.value)} /></label>
            <label>Y axis title<input value={opts.ylabel ?? ""} placeholder={meta.labels.y} onChange={(e) => set("ylabel", e.target.value)} /></label>
            {meta.labels.y2 !== null && <label>Right Y axis title<input value={opts.y2label ?? ""} placeholder={meta.labels.y2} onChange={(e) => set("y2label", e.target.value)} /></label>}
            <label>X min / max<span className="pair">
              <input type="number" step="any" value={lim("xlim", 0)} placeholder={num(meta.xlim[0])} onChange={(e) => setLim("xlim", 0, e.target.value)} />
              <input type="number" step="any" value={lim("xlim", 1)} placeholder={num(meta.xlim[1])} onChange={(e) => setLim("xlim", 1, e.target.value)} /></span></label>
            <label>Y min / max<span className="pair">
              <input type="number" step="any" value={lim("ylim", 0)} placeholder={num(meta.ylim[0])} onChange={(e) => setLim("ylim", 0, e.target.value)} />
              <input type="number" step="any" value={lim("ylim", 1)} placeholder={num(meta.ylim[1])} onChange={(e) => setLim("ylim", 1, e.target.value)} /></span></label>
            <label>Scale<span className="pair">
              <select value={String(opts.xlog ?? meta.xlog)} onChange={(e) => set("xlog", e.target.value === "true")}><option value="false">X linear</option><option value="true">X log</option></select>
              <select value={String(opts.ylog ?? meta.ylog)} onChange={(e) => set("ylog", e.target.value === "true")}><option value="false">Y linear</option><option value="true">Y log</option></select></span></label>
            <label>Legend<select value={opts.legend ?? "best"} onChange={(e) => set("legend", e.target.value)}>
              {["best", "upper right", "upper left", "lower right", "lower left", "center right", "outside", "below", "none"].map((v) => <option key={v}>{v}</option>)}</select></label>
            <label>Axis style<select value={opts.axis_style ?? "prism"} onChange={(e) => set("axis_style", e.target.value)}>
              <option value="prism">Prism (open, ticks out)</option><option value="box">Box (closed, ticks in)</option></select></label>
            <label>Grid<select value={opts.grid ?? "none"} onChange={(e) => set("grid", e.target.value)}>
              <option value="none">None</option><option value="major">Major</option><option value="both">Major + minor</option></select></label>
            <label className="check"><input type="checkbox" checked={!!opts.minor_ticks} onChange={(e) => set("minor_ticks", e.target.checked)} />Minor ticks</label>
            <label className="check"><input type="checkbox" checked={!!opts.frame_legend} onChange={(e) => set("frame_legend", e.target.checked)} />Legend frame</label>
            <label>Colour scheme<select value={opts.palette ?? "engineering"} onChange={(e) => set("palette", e.target.value)}>
              {["engineering", "prism", "colorblind", "grayscale"].map((v) => <option key={v}>{v}</option>)}</select></label>
            <label>Font size {opts.font_size ?? 11} pt<input type="range" min={7} max={18} value={opts.font_size ?? 11} onChange={(e) => set("font_size", Number(e.target.value))} /></label>
            <label>Line width {opts.line_width ?? 1.8}<input type="range" min={0.5} max={4} step={0.1} value={opts.line_width ?? 1.8} onChange={(e) => set("line_width", Number(e.target.value))} /></label>
            <label>Marker size {opts.marker_size ?? 6}<input type="range" min={2} max={14} step={0.5} value={opts.marker_size ?? 6} onChange={(e) => set("marker_size", Number(e.target.value))} /></label>
            <label>Height {h} px<input type="range" min={200} max={800} step={20} value={h} onChange={(e) => set("height_px", Number(e.target.value))} /></label>
            <label>PNG resolution<select value={String(opts.dpi ?? 600)} onChange={(e) => set("dpi", Number(e.target.value))}>
              {[150, 300, 600, 1200].map((v) => <option key={v} value={v}>{v} dpi</option>)}</select></label>
          </div>
          <table className="t" style={{ marginTop: 12 }}>
            <thead><tr><th>Show</th><th>Series</th><th>Colour</th><th>Marker</th><th>Line</th></tr></thead>
            <tbody>{meta.series.map((s: Json, i: number) => (
              <tr key={i}>
                <td><input type="checkbox" checked={s.visible} onChange={(e) => setSeries(i, "visible", e.target.checked)} /></td>
                <td><input className="inp" value={opts.series?.[i]?.name ?? ""} placeholder={s.name} onChange={(e) => setSeries(i, "name", e.target.value)} /></td>
                <td><input type="color" value={s.color.length === 7 ? s.color : "#000000"} onChange={(e) => setSeries(i, "color", e.target.value)} /></td>
                <td><select className="inp" value={opts.series?.[i]?.marker ?? s.marker} onChange={(e) => setSeries(i, "marker", e.target.value)}>
                  {MARKERS.map((m) => <option key={m} value={m}>{MARKER_NAMES[m]}</option>)}</select></td>
                <td><select className="inp" value={opts.series?.[i]?.dash ?? s.dash} onChange={(e) => setSeries(i, "dash", e.target.value)}>
                  {["solid", "dash", "dot", "dashdot"].map((m) => <option key={m}>{m}</option>)}</select></td>
              </tr>))}</tbody>
          </table>
          <div className="row" style={{ marginTop: 10 }}>
            <button className="btn" onClick={() => { const { series, title, xlabel, ylabel, y2label, xlim, ylim, ...style } = opts; void series; void title; void xlabel; void ylabel; void y2label; void xlim; void ylim; save(DEFAULT_KEY, style); }}>
              Use style for all charts</button>
            <button className="btn" onClick={() => { setOpts(load(DEFAULT_KEY)); save(key, {}); }}>Reset this chart</button>
            <button className="btn" onClick={() => { save(DEFAULT_KEY, {}); setOpts({}); save(key, {}); }}>Reset all styles</button>
            <span className="muted small">Edits are saved automatically on this computer.</span>
          </div>
        </div>
      )}
    </div>
  );
}
