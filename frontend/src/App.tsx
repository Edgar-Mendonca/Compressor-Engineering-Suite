import { useCallback, useEffect, useMemo, useState } from "react";
import { api, type Json } from "./api";
import * as P from "./pages/Pages";

type Page = { id: string; label: string; step?: number; group: string; render: (ctx: P.Ctx) => JSX.Element };

const PAGES: Page[] = [
  { id: "project", label: "Design basis", step: 1, group: "Inputs", render: (c) => <P.ProjectPage {...c} /> },
  { id: "gas", label: "Gas & operating cases", step: 2, group: "Inputs", render: (c) => <P.GasCasesPage {...c} /> },
  { id: "thermo", label: "Thermodynamics", step: 3, group: "Process & aero", render: (c) => <P.ThermoPage {...c} /> },
  { id: "compressor", label: "Selection & performance", step: 4, group: "Process & aero", render: (c) => <P.CompressorPage {...c} /> },
  { id: "impellers", label: "Impellers", step: 5, group: "Mechanical", render: (c) => <P.ImpellerPage {...c} /> },
  { id: "rotor", label: "Rotor & shaft", step: 6, group: "Mechanical", render: (c) => <P.RotorPage {...c} /> },
  { id: "bearings", label: "Bearings & seals", step: 8, group: "Mechanical", render: (c) => <P.BearingsSealsPage {...c} /> },
  { id: "lateral", label: "Lateral rotordynamics", step: 9, group: "Dynamics", render: (c) => <P.LateralPage {...c} /> },
  { id: "torsional", label: "Torsional train", step: 10, group: "Dynamics", render: (c) => <P.TorsionalPage {...c} /> },
  { id: "aux", label: "Lube oil & piping", step: 12, group: "Systems", render: (c) => <P.AuxPage {...c} /> },
  { id: "materials", label: "Material assessment", group: "Systems", render: (c) => <P.MaterialsPage {...c} /> },
  { id: "optimize", label: "Optimisation", step: 13, group: "Evaluate", render: (c) => <P.OptimizePage {...c} /> },
  { id: "verify", label: "Verification", step: 14, group: "Evaluate", render: (c) => <P.VerificationPage {...c} /> },
  { id: "reports", label: "Reports & projects", step: 15, group: "Evaluate", render: (c) => <P.ReportsPage {...c} /> },
];

const DRAFT_KEY = "compsuite.draft.v1";

export default function App() {
  const [schema, setSchema] = useState<Json>(null);
  const [project, setProjectState] = useState<Json>(null);
  const [results, setResults] = useState<Json>(null);
  const [ranWith, setRanWith] = useState<string>("");
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string>("");
  const [page, setPage] = useState<string>(() => {
    try { return localStorage.getItem("compsuite.page") ?? "compressor"; } catch { return "compressor"; }
  });
  const [savedId, setSavedId] = useState<number | null>(null);
  const [casing, setCasing] = useState(0);

  const setProject = useCallback((p: Json) => {
    setProjectState(p);
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(p)); } catch { /* storage unavailable */ }
  }, []);

  const run = useCallback(async (p: Json) => {
    setRunning(true);
    setError("");
    try {
      const r = await api.run(p, "full");
      setResults(r);
      setRanWith(JSON.stringify(p));
      setCasing(0);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setRunning(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [s, d] = await Promise.all([api.schema(), api.defaults()]);
        setSchema(s);
        let start = d;
        try {
          const draft = localStorage.getItem(DRAFT_KEY);
          if (draft) start = { ...d, ...JSON.parse(draft) };
        } catch { /* ignore */ }
        setProjectState(start);
        run(start);
      } catch (e) {
        setError(`Backend not reachable: ${(e as Error).message}. Start it with "compsuite serve".`);
      }
    })();
  }, [run]);

  useEffect(() => {
    try { localStorage.setItem("compsuite.page", page); } catch { /* ignore */ }
  }, [page]);

  const stale = useMemo(() => !!results && JSON.stringify(project) !== ranWith, [project, results, ranWith]);
  const ctx: P.Ctx = { schema, project, setProject, results, casing, setCasing, run, running, savedId, setSavedId,
    setResults: (r: Json, p: Json) => { setResults(r); setRanWith(JSON.stringify(p)); } };
  const current = PAGES.find((p) => p.id === page) ?? PAGES[0];
  const groups = Array.from(new Set(PAGES.map((p) => p.group)));

  return (
    <div className="app">
      <nav className="side" aria-label="Workflow">
        <h1><img src="/favicon.svg" alt="" width="28" height="28" />Compressor Engineering Suite</h1>
        {groups.map((g) => (
          <div key={g}>
            <div className="group">{g}</div>
            {PAGES.filter((p) => p.group === g).map((p) => (
              <button key={p.id} className={p.id === page ? "active" : ""} onClick={() => setPage(p.id)}>
                <span className="step">{p.step ?? "•"}</span>{p.label}
              </button>
            ))}
          </div>
        ))}
      </nav>
      <main>
        <header className="top">
          <input className="title" aria-label="Project name" value={project?.name ?? ""}
            onChange={(e) => project && setProject({ ...project, name: e.target.value })} />
          <span className="muted">rev {project?.revision ?? 0}{savedId ? ` · saved #${savedId}` : " · unsaved draft"}</span>
          <span className="spacer" />
          {results && results.casings?.length > 1 && (
            <select className="btn" value={casing} onChange={(e) => setCasing(Number(e.target.value))} aria-label="Casing">
              {results.casings.map((_: Json, i: number) => <option key={i} value={i}>Casing {i + 1}</option>)}
            </select>
          )}
          {stale && <span className="status attention">inputs changed</span>}
          <button className="btn primary" disabled={running || !project} onClick={() => run(project)}>
            {running ? "Running analysis…" : "Run analysis"}
          </button>
        </header>
        <div className="content">
          {error && <div className="error">{error}</div>}
          {project && schema ? current.render(ctx) : !error && <p className="muted">Loading…</p>}
        </div>
      </main>
    </div>
  );
}
