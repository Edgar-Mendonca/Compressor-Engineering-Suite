// Calculation transparency: formulas (KaTeX), step cards, symbols, the theory handbook and references.
// Traces register their steps while shown; Kpis and Table cells whose label matches a step open its card.
import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import { api, fmt, type Json } from "../api";

export type Step = { name: string; formula: string; given: Record<string, [unknown, string]>; result: unknown; unit: string;
  symbol: string; row: number | null; note: string; ui?: string[] };
type Entry = { step: Step; trace: Json };

export function Tex({ tex, block }: { tex: string; block?: boolean }) {
  const html = katex.renderToString(tex, { displayMode: !!block, throwOnError: false, output: "html" });
  return <span className={block ? "tex block" : "tex"} dangerouslySetInnerHTML={{ __html: html }} />;
}

// ------------------------------------------------------------------ step registry
export const norm = (s: string) => s.toLowerCase().replace(/\(.*?\)|\[.*?\]/g, "").replace(/[^a-z0-9%₂²³ ]+/g, " ").replace(/\s+/g, " ").trim();
const traces = new Map<Json, number>();
let index = new Map<string, Entry[]>();
let ver = 0;
const subs = new Set<() => void>();
const rebuild = () => {
  index = new Map();
  for (const t of traces.keys()) for (const s of (t.steps ?? []) as Step[]) {
    for (const k of new Set([s.name, ...(s.ui ?? [])].map(norm))) index.set(k, [...(index.get(k) ?? []), { step: s, trace: t }]);
  }
  ver++; subs.forEach((f) => f());
};
const subscribe = (f: () => void) => { subs.add(f); return () => { subs.delete(f); }; };
export function useRegister(trace: Json | Json[]) {
  const list: Json[] = (Array.isArray(trace) ? trace : [trace]).filter((t) => t?.steps?.length);
  const key = list.map(idOf).join(",");
  useEffect(() => {
    if (!list.length) return;
    list.forEach((t) => traces.set(t, (traces.get(t) ?? 0) + 1)); rebuild();
    return () => {
      list.forEach((t) => { const n = (traces.get(t) ?? 1) - 1; if (n > 0) traces.set(t, n); else traces.delete(t); }); rebuild();
    };
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
}
const ids = new WeakMap<object, number>();
let nextId = 0;
const idOf = (t: Json) => { if (!ids.has(t)) ids.set(t, ++nextId); return ids.get(t)!; };
// Makes values clickable for traces that are not shown in a Trace panel (one trace per case or stage).
export function Register({ traces: t }: { traces: Json[] }) { useRegister(t); return null; }
export function useStepFor() {
  useSyncExternalStore(subscribe, () => ver);
  return (label: string, row?: number): Entry | undefined => {
    const es = index.get(norm(label));
    if (!es) return undefined;
    return row === undefined ? es.find((e) => e.step.row == null) ?? es[0] : es.find((e) => e.step.row === row);
  };
}
const bySymbol = (sym: string, row: number | null) => {
  let best: Entry | undefined;
  for (const es of index.values()) for (const e of es) if (e.step.symbol === sym && (best === undefined || e.step.row === row)) best = e;
  return best;
};

// ------------------------------------------------------------------ modal host
type Modal = { kind: "step"; entry: Entry } | { kind: "theory"; page?: string } | null;
let modal: Modal = null;
const msubs = new Set<() => void>();
export const openModal = (m: Modal) => { modal = m; msubs.forEach((f) => f()); };
export const openStep = (entry: Entry) => openModal({ kind: "step", entry });
export const openTheory = (page?: string) => openModal({ kind: "theory", page });

export function CalcHost() {
  const m = useSyncExternalStore((f) => { msubs.add(f); return () => { msubs.delete(f); }; }, () => modal);
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && openModal(null);
    window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k);
  }, []);
  if (!m) return null;
  return (
    <div className="modal-bg" onClick={() => openModal(null)}>
      <div className={`modal calc ${m.kind === "theory" ? "wide" : ""}`} onClick={(e) => e.stopPropagation()} role="dialog">
        <button className="x" aria-label="Close" onClick={() => openModal(null)}>×</button>
        {m.kind === "step" ? <StepCard entry={m.entry} /> : <Handbook page={m.page} />}
      </div>
    </div>
  );
}

// Large SI values read better in engineering units.
const SHOW: Record<string, [string, number]> = { Pa: ["bar", 1e5], "J/kg": ["kJ/kg", 1e3], W: ["kW", 1e3], "N/m": ["kN/m", 1e3] };
const shown = (v: unknown, u: string): [unknown, string] => {
  const c = SHOW[u];
  return c && typeof v === "number" && Math.abs(v) >= 1e4 ? [v / c[1], c[0]] : [v, u];
};
const val = (v: unknown) => (typeof v === "number" ? fmt(v, Math.abs(v) >= 100 ? 1 : Math.abs(v) >= 1 ? 3 : 4) : String(v ?? "–"));

export function StepCard({ entry, compact }: { entry: Entry; compact?: boolean }) {
  const { step: s, trace } = entry;
  const syms = (trace.symbols ?? {}) as Record<string, [string, string]>;
  return (
    <div className="stepcard">
      {!compact && <p className="mono caps muted">How this is calculated{s.row != null ? ` · row ${s.row + 1}` : ""}</p>}
      {!compact && <h3>{s.name}</h3>}
      <Tex tex={s.formula} block />
      {Object.keys(s.given).length > 0 && <table className="t where"><tbody>
        {Object.entries(s.given).map(([k, [v0, u0]]) => {
          const [v, u] = shown(v0, u0);
          const src = bySymbol(k, s.row);
          return (
            <tr key={k}>
              <td><Tex tex={k} /></td><td>{syms[k]?.[0] ?? ""}</td>
              <td className="n">{val(v)} <span className="muted">{u}</span></td>
              <td>{src && src.step !== s && <button className="chip" title="Show how this input is calculated" onClick={() => openStep(src)}>from {src.step.name} ›</button>}</td>
            </tr>
          );
        })}
      </tbody></table>}
      <p className="result">{s.symbol ? <Tex tex={s.symbol} /> : s.name} = <b>{val(s.result)}</b> {s.unit}</p>
      {s.note && <p className="muted">{s.note}</p>}
      {!compact && <p className="muted small">{trace.method}{THEORY[pageOf(trace.module)] ? <> · <a href="#" onClick={(e) => { e.preventDefault(); openTheory(pageOf(trace.module)); }}>theory</a></> : null}</p>}
    </div>
  );
}

// Click target for a shown value. Falls back to plain text when no step matches.
export function Val({ label, row, children }: { label: string; row?: number; children: ReactNode }) {
  const e = useStepFor()(label, row);
  if (!e) return <>{children}</>;
  return <span className="calc-link" role="button" tabIndex={0} title="Show the calculation" onClick={() => openStep(e)}
    onKeyDown={(k) => k.key === "Enter" && openStep(e)}>{children}</span>;
}

// ------------------------------------------------------------------ trace panel
const PAGE: [string, string][] = [["compression", "thermo"], ["aero.cfd", "cfd"], ["aero", "compressor"], ["impeller", "impellers"],
  ["structural.disk", "impellers"], ["structural", "impfea"], ["materials", "materials"], ["mechanical", "rotor"], ["bearings", "bearings"],
  ["seals", "bearings"], ["rotordynamics", "lateral"], ["torsional", "torsional"], ["auxiliary", "auxiliary"], ["piping", "auxiliary"],
  ["optimization", "optimize"], ["cfd", "cfd"], ["dynamics", "dynamics"], ["testing.ptc10", "perftest"], ["testing.mrt", "mrt"],
  ["testing.perf", "perftest"], ["testing.mech", "mrt"], ["testing", "shoptest"]];
export const pageOf = (module: string) => PAGE.find(([p]) => (module ?? "").startsWith(p))?.[1] ?? "";
let THEORY: Record<string, string> = {};
api.theory().then((l: Json[]) => { THEORY = Object.fromEntries(l.map((p) => [p.id, p.title])); }).catch(() => undefined);

export function Steps({ trace }: { trace: Json }) {
  useRegister(trace);
  const steps = (trace?.steps ?? []) as Step[];
  const syms = Object.entries((trace?.symbols ?? {}) as Record<string, [string, string]>);
  const rows = [...new Set(steps.map((s) => s.row))];
  const [row, setRow] = useState<number | null>(rows[0] ?? null);
  if (!steps.length) return null;
  return (
    <>
      <h4>Calculation steps</h4>
      {rows.length > 1 && <div className="seg">{rows.map((r) => <button key={String(r)} className={r === row ? "on" : ""} onClick={() => setRow(r)}>{r == null ? "General" : `Row ${r + 1}`}</button>)}</div>}
      <ol className="steps">{steps.filter((s) => rows.length < 2 || s.row === row).map((s, i) => (
        <li key={i}><details><summary><b>{s.name}</b> = {val(s.result)} {s.unit}</summary><StepCard entry={{ step: s, trace }} compact /></details></li>))}</ol>
      {syms.length > 0 && <details><summary><b>Symbols</b> <span className="muted">({syms.length})</span></summary>
        <table className="t where"><thead><tr><th>Symbol</th><th>Meaning</th><th>Unit</th></tr></thead><tbody>
          {syms.map(([k, [m, u]]) => <tr key={k}><td><Tex tex={k} /></td><td>{m}</td><td>{u}</td></tr>)}</tbody></table></details>}
    </>
  );
}

// ------------------------------------------------------------------ handbook and references
function inline(s: string): ReactNode[] {
  return s.split(/(\$[^$]+\$|\*\*[^*]+\*\*)/g).map((p, i) =>
    p.startsWith("$") && p.length > 2 ? <Tex key={i} tex={p.slice(1, -1)} /> : p.startsWith("**") ? <b key={i}>{p.slice(2, -2)}</b> : p);
}

export function Markdown({ text }: { text: string }) {
  const out: ReactNode[] = [];
  const ls = text.split(/\r?\n/);
  for (let i = 0; i < ls.length; i++) {
    const l = ls[i];
    if (!l.trim()) continue;
    if (l.trim().startsWith("$$")) {
      let t = l.trim().slice(2);
      while (!t.trim().endsWith("$$") && i + 1 < ls.length) t += " " + ls[++i];
      out.push(<Tex key={i} tex={t.trim().replace(/\$\$$/, "")} block />);
    } else if (/^#{1,3} /.test(l)) {
      const n = l.indexOf(" "), T = (["h2", "h3", "h4"] as const)[n - 1];
      out.push(<T key={i}>{inline(l.slice(n + 1))}</T>);
    } else if (l.startsWith("- ")) {
      const items: string[] = [];
      while (i < ls.length && ls[i].startsWith("- ")) items.push(ls[i++].slice(2));
      i--; out.push(<ul key={i}>{items.map((t, j) => <li key={j}>{inline(t)}</li>)}</ul>);
    } else if (l.startsWith("|")) {
      const rows: string[][] = [];
      while (i < ls.length && ls[i].startsWith("|")) { if (!/^\|[\s:|-]+\|$/.test(ls[i])) rows.push(ls[i].split("|").slice(1, -1).map((c) => c.trim())); i++; }
      i--; out.push(<table key={i} className="t"><thead><tr>{rows[0].map((c, j) => <th key={j}>{inline(c)}</th>)}</tr></thead>
        <tbody>{rows.slice(1).map((r, k) => <tr key={k}>{r.map((c, j) => <td key={j}>{inline(c)}</td>)}</tr>)}</tbody></table>);
    } else {
      let t = l;
      while (i + 1 < ls.length && ls[i + 1].trim() && !/^(#|- |\||\$\$)/.test(ls[i + 1].trim())) t += " " + ls[++i];
      out.push(<p key={i}>{inline(t)}</p>);
    }
  }
  return <div className="md">{out}</div>;
}

export function Handbook({ page }: { page?: string }) {
  const [list, setList] = useState<Json[]>([]);
  const [cur, setCur] = useState(page ?? "");
  const [text, setText] = useState("");
  useEffect(() => { api.theory().then((l: Json[]) => { setList(l); if (!cur && l.length) setCur(l[0].id); }).catch(() => undefined); }, []);
  useEffect(() => { if (cur) api.theoryPage(cur).then(setText).catch((e) => setText(`# Not available\n\n${e}`)); }, [cur]);
  return (
    <div className="handbook">
      <nav>{list.map((p) => <button key={p.id} className={p.id === cur ? "on" : ""} onClick={() => setCur(p.id)}>{p.title}</button>)}</nav>
      <article>{text ? <Markdown text={text} /> : <p className="muted">Loading…</p>}</article>
    </div>
  );
}

export function References() {
  const [groups, setGroups] = useState<Json[]>([]);
  useEffect(() => { api.references().then(setGroups).catch(() => undefined); }, []);
  return (
    <div className="refs">{groups.map((g) => (
      <div key={g.group}><h4>{g.group}</h4><ul>{g.items.map((r: string) => <li key={r}>{r}</li>)}</ul></div>))}</div>
  );
}
