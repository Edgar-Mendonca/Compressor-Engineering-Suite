import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { api, type Json } from "./api";
import { Launcher } from "./Launcher";
import { GROUPS, MODULES, num } from "./modules";
import { NewProject } from "./NewProject";
import { bridge, onToast, openProject, recent, saveBlob, saveProject, type Toast } from "./files";
import { STEPS, TutorialCard } from "./Tutorial";
import * as P from "./pages/Pages";
/** Project inputs that change results (report labels such as test tags and document data excluded). */
const runKey = (p: Json) => JSON.stringify(p ? { ...p, test_tags: undefined, test_doc: undefined, dynamics: undefined } : p);

// Heavy pages load on first use so the app starts quickly.
const ImpellerFEAPage = lazy(() => import("./pages/ImpellerFEA").then((m) => ({ default: m.ImpellerFEAPage })));
const CfdPage = lazy(() => import("./pages/Cfd").then((m) => ({ default: m.CfdPage })));
const DynamicsPage = lazy(() => import("./pages/Dynamics").then((m) => ({ default: m.DynamicsPage })));
const MechRunTestPage = lazy(() => import("./pages/MechRunTest").then((m) => ({ default: m.MechRunTestPage })));
const ShopTestsPage = lazy(() => import("./pages/ShopTests").then((m) => ({ default: m.ShopTestsPage })));
const PerfTestPage = lazy(() => import("./pages/PerfTest").then((m) => ({ default: m.PerfTestPage })));

const RENDER: Record<string, (c: P.Ctx) => JSX.Element> = {
  project: (c) => <P.ProjectPage {...c} />, gas: (c) => <P.GasCasesPage {...c} />, thermo: (c) => <P.ThermoPage {...c} />,
  compressor: (c) => <P.CompressorPage {...c} />, impellers: (c) => <P.ImpellerPage {...c} />, impfea: (c) => <ImpellerFEAPage {...c} />, cfd: (c) => <CfdPage {...c} />, rotor: (c) => <P.RotorPage {...c} />,
  bearings: (c) => <P.BearingsSealsPage {...c} />, lateral: (c) => <P.LateralPage {...c} />, torsional: (c) => <P.TorsionalPage {...c} />, dynamics: (c) => <DynamicsPage {...c} />,
  materials: (c) => <P.MaterialsPage {...c} />, aux: (c) => <P.AuxPage {...c} />, optimize: (c) => <P.OptimizePage {...c} />,
  shoptest: (c) => <ShopTestsPage {...c} />, mrt: (c) => <MechRunTestPage {...c} />, perftest: (c) => <PerfTestPage {...c} />, verify: (c) => <P.VerificationPage {...c} />, reports: (c) => <P.ReportsPage {...c} />,
};

const DRAFT_KEY = "compsuite.draft.v1";
const THEMES = ["auto", "light", "dark"] as const;
const store = {
  get: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* storage unavailable */ } },
};

export default function App() {
  const [schema, setSchema] = useState<Json>(null);
  const [project, setProjectState] = useState<Json>(null);
  const [results, setResults] = useState<Json>(null);
  const [ranWith, setRanWith] = useState<string>("");
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string>("");
  const [page, setPage] = useState<string>("home");
  const [savedId, setSavedId] = useState<number | null>(null);
  const [casing, setCasing] = useState(0);
  const [wizard, setWizard] = useState(false);
  const [tour, setTour] = useState<number | null>(null);
  const [draft, setDraft] = useState<Json>(null);
  const [filePath, setFilePath] = useState<string | null>(null);
  const [menu, setMenu] = useState(false);
  const [toasts, setToasts] = useState<(Toast & { id: number })[]>([]);
  const [theme, setTheme] = useState<string>(() => store.get("centriforge.theme") ?? "auto");

  useEffect(() => {
    if (theme === "auto") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", theme);
    store.set("centriforge.theme", theme);
  }, [theme]);

  const draftT = useRef(0);
  const setProject = useCallback((p: Json) => {
    setProjectState(p);
    window.clearTimeout(draftT.current);   // the draft is written once typing pauses, not on every keystroke
    draftT.current = window.setTimeout(() => store.set(DRAFT_KEY, JSON.stringify(p)), 800);
  }, []);

  const abort = useRef<AbortController | null>(null);
  const [started, setStarted] = useState(0);
  const [, setTick] = useState(0);
  useEffect(() => { if (!running) return; const t = setInterval(() => setTick((k) => k + 1), 500); return () => clearInterval(t); }, [running]);
  const run = useCallback(async (p: Json) => {
    abort.current?.abort();
    const ac = new AbortController();
    abort.current = ac;
    setRunning(true);
    setStarted(Date.now());
    setError("");
    try {
      const r = await api.run(p, "full", ac.signal);
      setResults(r);
      setRanWith(runKey(p));
      setCasing(0);
    } catch (e) {
      if (!ac.signal.aborted) setError((e as Error).message);
    } finally {
      if (abort.current === ac) setRunning(false);
    }
  }, []);
  const cancel = () => { abort.current?.abort(); setRunning(false); };
  const elapsed = running ? Math.round((Date.now() - started) / 1000) : 0;

  // Start-up loads only the schema: no project and no analysis until the user picks one on the start page.
  useEffect(() => {
    api.schema().then(setSchema).catch((e) => setError(`Engineering server not reachable: ${(e as Error).message}.`));
    try { const d = store.get(DRAFT_KEY); if (d) setDraft(JSON.parse(d)); } catch { /* ignore */ }
  }, []);

  useEffect(() => onToast((t) => {
    const id = Date.now() + Math.random();
    setToasts((x) => [...x, { ...t, id }]);
    setTimeout(() => setToasts((x) => x.filter((q) => q.id !== id)), t.path ? 12000 : 5000);
  }), []);
  // Autosave every 2 minutes (recovered from the start page after a crash).
  useEffect(() => {
    if (!project) return;
    const t = setInterval(() => { fetch("/api/autosave", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(project) }).catch(() => undefined); }, 120000);
    return () => clearInterval(t);
  }, [project]);

  const start = useCallback(async (p: Json, id: number | null = null, page = "project") => {
    const d = await api.defaults();
    setProject({ ...d, ...p });
    setSavedId(id);
    setResults(null);
    setRanWith("");
    setCasing(0);
    setPage(page);
    setFilePath(null);
  }, [setProject]);
  const fileSave = async (as: boolean) => { if (project) { const p = await saveProject(project, as ? null : filePath); if (p) setFilePath(p); } setMenu(false); };
  const fileOpen = async (path?: string) => {
    setMenu(false);
    const r = await openProject(path);
    if (r) { await start(r.project); setFilePath(r.path); }
  };
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") { e.preventDefault(); fileSave(e.shiftKey); } };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  });
  const actions = {
    newProject: () => setWizard(true),
    openExample: async (key: string) => { setTour(null); start(await api.example(key)); },
    tutorial: async () => { await start(await api.example("export_gas"), null, STEPS[0].page); setTour(0); },
    openSaved: async (id: number) => { const rec = await api.getProject(id); start(rec.project, id); },
    importFile: (p: Json) => start(p),
    openFile: fileOpen,
    resume: draft ? () => start(draft) : null,
    resumeName: draft?.name ?? "",
  };

  const stale = useMemo(() => !!results && runKey(project) !== ranWith, [project, results, ranWith]);
  const ctx: P.Ctx = { schema, project, setProject, results, casing, setCasing, run, running, savedId, setSavedId,
    setResults: (r: Json, p: Json) => { setResults(r); setRanWith(runKey(p)); } };
  const current = MODULES.find((m) => m.id === page);
  const open = (id: string) => { setPage(id); document.querySelector("main")?.scrollTo(0, 0); };

  return (
    <div className="shell">
      <header className="bar">
        <button className="brand" onClick={() => open("home")} aria-label="Launcher">
          <img src="/favicon.svg" alt="" width="24" height="24" /><b>CENTRI<span>FORGE</span></b>
        </button>
        <div className="filemenu">
          <button className="tab-btn" onClick={() => setMenu(!menu)}>File ▾</button>
          {menu && <div className="menu" onMouseLeave={() => setMenu(false)}>
            <button onClick={() => { setMenu(false); open("home"); }}>New / examples…</button>
            <button onClick={() => fileOpen()}>Open project…</button>
            <button disabled={!project} onClick={() => fileSave(false)}>Save<span>Ctrl+S</span></button>
            <button disabled={!project} onClick={() => fileSave(true)}>Save as…<span>Ctrl+Shift+S</span></button>
            {bridge() && recent().length > 0 && <><div className="mono caps muted sep">Recent files</div>
              {recent().map((r) => <button key={r.path} onClick={() => fileOpen(r.path)} title={r.path}>{r.name}<span>{r.path.split(/[\\/]/).slice(-2, -1)[0]}</span></button>)}</>}
            <div className="mono caps muted sep">Help</div>
            <button onClick={async () => { setMenu(false); const t = await (await fetch("/api/app/diagnostics")).text();
              try { await navigator.clipboard.writeText(t); alert("Diagnostics copied: paste them into your bug report."); }
              catch { saveBlob(new Blob([t], { type: "text/plain" }), "centriforge-diagnostics.txt"); } }}>Copy diagnostics</button>
          </div>}
        </div>
        <nav className="tabs">
          <button className={page === "home" ? "on" : ""} onClick={() => open("home")}>Launcher</button>
          <button className={page !== "home" ? "on" : ""} disabled={!project} title={project ? "" : "Start or open a project first"}
            onClick={() => open(current ? current.id : "project")}>Workspace</button>
        </nav>
        <span className="mono caps muted hide-sm">Compressor engineering suite</span>
        <span className="spacer" />
        {running && <span className="pill attention run-pill"><i style={{ width: `${Math.min(95, elapsed * 3.5)}%` }} />Running analysis · {elapsed} s
          <button className="chip" onClick={cancel}>Cancel</button></span>}
        <button className="tab-btn" onClick={() => setTheme(THEMES[(THEMES.indexOf(theme as never) + 1) % 3])} title="Theme">
          Theme · {theme}</button>
      </header>

      <div className="toasts">{toasts.map((t) => (
        <div key={t.id} className={`toast ${t.error ? "err" : ""}`}><div><b>{t.text}</b>{t.path && <div className="mono small">{t.path}</div>}</div>
          {t.path && bridge() && <><button className="chip" onClick={() => bridge()!.open_path(t.path!)}>Open file</button>
            <button className="chip" onClick={() => bridge()!.reveal(t.path!)}>Show in folder</button></>}</div>))}</div>
      {wizard && <NewProject onClose={() => setWizard(false)} onCreate={(p) => { setWizard(false); setTour(null); start(p); }} />}
      {tour !== null && page !== "home" && <TutorialCard step={tour} setStep={setTour} open={open} run={() => project && run(project)} running={running} />}
      {page === "home" || !project ? (
        <main className="home">{error && <div className="error">{error}</div>}
          <Launcher results={results} project={project} open={open} running={running} actions={actions} /></main>
      ) : (
        <div className="app">
          <nav className="side" aria-label="Workflow">
            {GROUPS.map((g) => (
              <div key={g.id}>
                <div className="group mono caps"><i style={{ background: g.color }} />{g.label}</div>
                {MODULES.filter((m) => m.group === g.id).map((m) => (
                  <button key={m.id} className={m.id === page ? "active" : ""} onClick={() => open(m.id)}>
                    <span className="step mono">{num(m.id)}</span>{m.label}
                  </button>
                ))}
              </div>
            ))}
          </nav>
          <main>
            <header className="top">
              <span className="crumb mono caps">{current && `${num(current.id)} · ${current.label}`}</span>
              <input className="title" aria-label="Project name" value={project?.name ?? ""}
                onChange={(e) => project && setProject({ ...project, name: e.target.value })} />
              <span className="muted mono small" title={filePath ?? ""}>rev {project?.revision ?? 0}{filePath ? ` · ${filePath.split(/[\\/]/).pop()}` : savedId ? ` · saved #${savedId}` : " · unsaved draft"}</span>
              <span className="spacer" />
              {results && results.casings?.length > 1 && (
                <select className="inp" value={casing} onChange={(e) => setCasing(Number(e.target.value))} aria-label="Casing">
                  {results.casings.map((_: Json, i: number) => <option key={i} value={i}>Casing {i + 1}</option>)}
                </select>
              )}
              {stale && <span className="pill attention">Inputs changed</span>}
              <button className="btn primary" disabled={running || !project} onClick={() => run(project)}>
                {running ? "Running analysis…" : "Run analysis"}
              </button>
            </header>
            <div className="content">
              {error && <div className="error">{error}</div>}
              <Suspense fallback={<p className="muted">Loading module…</p>}>
                {project && schema && current ? RENDER[current.id](ctx) : !error && <p className="muted">Loading…</p>}</Suspense>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
