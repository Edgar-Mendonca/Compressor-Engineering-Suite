import { lazy, Suspense } from "react";
import { fmt, type Json } from "../api";

export const ImpellerFEAView = lazy(() => import("../components/ImpellerFEAView").then((m) => ({ default: m.ImpellerFEAView })));
export const SectionPlot = lazy(() => import("../components/ImpellerFEAView").then((m) => ({ default: m.SectionPlot })));
export const RotorView = lazy(() => import("../components/RotorView").then((m) => ({ default: m.RotorView })));
export const Lazy = ({ children }: { children: JSX.Element }) => <Suspense fallback={<p className="muted">Loading 3D view…</p>}>{children}</Suspense>;

export type Ctx = {
  schema: Json; project: Json; setProject: (p: Json) => void; results: Json; casing: number; setCasing: (n: number) => void;
  run: (p: Json) => Promise<void>; running: boolean; savedId: number | null; setSavedId: (n: number | null) => void;
  setResults: (r: Json, p: Json) => void;
};

export const Disclaimer = () => (
  <div className="notice">Preliminary engineering results for design studies and comparisons. Not a certificate of compliance with
    API 617 / 614 / 692, ISO 15156 or any other standard. Safety-critical conclusions require qualified engineering review.</div>
);

export const NeedRun = ({ results }: { results: Json }) => (results ? null : <p className="muted">Run the analysis to see results.</p>);

export function Kpis({ items }: { items: [string, string][] }) {
  return (
    <div className="kpis">
      {items.map(([l, v]) => (
        <div className="kpi" key={l}><div className={`v ${v.length > 16 ? "long" : ""}`}>{v}</div><div className="l">{l}</div></div>
      ))}
    </div>
  );
}

export function Table({ cols, rows }: { cols: [string, (r: Json) => unknown, number?][]; rows: Json[] }) {
  return (
    <div className="scroll">
      <table className="t">
        <thead><tr>{cols.map(([h]) => <th key={h}>{h}</th>)}</tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {cols.map(([h, f, nd]) => {
                const v = f(r);
                return <td key={h} className={typeof v === "number" ? "n" : ""}>{typeof v === "number" ? fmt(v, nd ?? 1) : (v as string) ?? "–"}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Trace({ trace }: { trace: Json }) {
  if (!trace) return null;
  return (
    <details className="card" style={{ marginTop: 14 }}>
      <summary><strong>Method & assumptions</strong> <span className="muted">— {trace.module}: {trace.method}</span></summary>
      <ul>{trace.assumptions.map((a: string) => <li key={a}>{a}</li>)}</ul>
      {trace.references.length > 0 && <p className="muted">References: {trace.references.join("; ")}</p>}
      {trace.warnings.length > 0 && <ul>{trace.warnings.map((w: string) => <li key={w} className="status attention">{w}</li>)}</ul>}
      <p className="muted">Engine {trace.engine} · v{trace.version} · inputs {trace.inputs_hash}</p>
    </details>
  );
}

export const cas = (c: Ctx) => c.results?.casings?.[c.casing] ?? c.results?.casings?.[0];
export const sub = (c: Ctx, key: string, v: Json) => c.setProject({ ...c.project, [key]: v });

// ------------------------------------------------------------------ inputs
