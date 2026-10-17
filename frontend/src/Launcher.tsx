import { useEffect, useMemo, useState } from "react";
import { api, type Json } from "./api";
import { GROUPS, MODULES, groupOf, num } from "./modules";

const ago = (t: number) => {
  const m = Math.round((Date.now() / 1000 - t) / 60);
  return m < 1 ? "just now" : m < 60 ? `${m} min ago` : `${Math.round(m / 60)} h ago`;
};

function moduleStatus(results: Json, checks: string[]) {
  if (!results || !checks.length) return null;
  const all: Json[] = results.checklist?.items ?? [];
  const items = checks.includes("*") ? all : all.filter((i) => checks.some((c) => i.module === c || i.module.startsWith(c + ".")));
  const n = (s: string) => items.filter((i: Json) => i.status === s).length;
  return { pass: n("pass"), fail: n("fail"), attention: n("attention"), review: n("review"), total: items.length };
}

function UpdatePanel({ info }: { info: Json }) {
  const [upd, setUpd] = useState<Json>(null);
  const [st, setSt] = useState<Json>(null);
  const [busy, setBusy] = useState(false);
  const check = async () => {
    setBusy(true);
    try { setUpd(await api.updateCheck()); } finally { setBusy(false); }
  };
  useEffect(() => { check(); }, []);
  useEffect(() => {
    if (!st || !["downloading", "installing"].includes(st.phase)) return;
    const t = setInterval(async () => { try { setSt(await api.updateStatus()); } catch { /* app is restarting */ } }, 600);
    return () => clearInterval(t);
  }, [st]);
  const install = async () => {
    try { setSt(await api.updateApply()); } catch (e) { setSt({ phase: "error", message: (e as Error).message }); }
  };
  const pill = !upd ? ["muted", "Checking…"] : upd.error ? ["attention", "Offline · update check failed"]
    : upd.available ? ["warn", `Update available · ${upd.latest}`] : ["ok", info.installed ? "Installed · up to date" : "Up to date"];
  return (
    <div className="upd">
      <span className={`pill ${pill[0]}`}>{pill[1]}</span>
      <div className="mono small muted">Version {info.version} · {info.release_date}{!info.installed && " · running from source"}</div>
      {upd?.available && upd.can_install && !st && <button className="btn primary wide" onClick={install}>Update to {upd.latest}{upd.size_mb ? ` · ${upd.size_mb} MB` : ""}</button>}
      {upd?.available && !upd.can_install && <a className="btn primary wide" href={upd.url} target="_blank" rel="noreferrer">Get {upd.latest} on GitHub ↗</a>}
      {(!upd || !upd.available) && <button className="btn wide" disabled={busy} onClick={check}>{busy ? "Checking…" : "Check for updates"}</button>}
      {st && <div className="progress"><div style={{ width: `${Math.round((st.progress ?? 0) * 100)}%` }} /><span className="mono small">{st.message}</span></div>}
      {upd?.checked && <div className="mono small muted">Checked {ago(upd.checked)} · GitHub Releases</div>}
    </div>
  );
}

export function Launcher({ results, project, open, running }: { results: Json; project: Json; open: (id: string) => void; running: boolean }) {
  const [info, setInfo] = useState<Json>(null);
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");
  useEffect(() => { api.appInfo().then(setInfo).catch(() => setInfo(null)); }, []);
  const shown = useMemo(() => MODULES.filter((m) => (filter === "all" || m.group === filter)
    && (m.label + m.desc).toLowerCase().includes(q.toLowerCase())), [filter, q]);
  const s = results?.summary;
  const latest = info?.changelog?.[0];

  return (
    <div className="launcher">
      <section className="hero">
        <div className="cell brand">
          <img src="/favicon.svg" alt="" width="76" height="76" />
          <div>
            <h1>Centri<span>Forge</span></h1>
            <div className="mono caps muted">Compressor engineering suite</div>
            <p className="muted">Centrifugal compressor thermodynamics, selection, mechanical design, rotordynamics, materials and
              verification in one traceable workflow. Preliminary engineering - not a certificate of compliance.</p>
          </div>
        </div>
        <div className="cell">
          <div className="mono caps label">What's new{latest && ` in ${latest.version}`}</div>
          <ul className="news">{(latest?.items ?? []).map((t: string) => <li key={t}>{t}</li>)}</ul>
        </div>
        <div className="cell">{info ? <UpdatePanel info={info} /> : <span className="mono small muted">Loading app info…</span>}</div>
      </section>

      <section className="hero project">
        <div className="cell">
          <div className="mono caps label">Current project</div>
          <div className="pname">{project?.name ?? "–"} <span className="mono small muted">rev {project?.revision ?? 0}</span></div>
        </div>
        {[["Configuration", s?.configuration], ["Speed", s && `${Math.round(s.speed_rpm).toLocaleString()} rpm`],
          ["Shaft power", s && `${Math.round(s.shaft_power_kw).toLocaleString()} kW`]].map(([l, v]) => (
          <div className="cell" key={l}><div className="mono caps label">{l}</div><div className="big">{running ? "…" : v ?? "–"}</div></div>
        ))}
        <div className="cell">
          <div className="mono caps label">Checklist</div>
          {s ? <div className="counts">{(["pass", "fail", "attention", "review"] as const).map((k) =>
            <span key={k} className={`pill ${k}`}>{s.checklist[k]} {k}</span>)}</div> : <span className="muted">{running ? "Running analysis…" : "–"}</span>}
        </div>
        <div className="cell"><button className="btn primary wide" onClick={() => open("project")}>Open workspace</button></div>
      </section>

      <div className="filters">
        <div className="seg">
          <button className={filter === "all" ? "on" : ""} onClick={() => setFilter("all")}>All <b>{MODULES.length}</b></button>
          {GROUPS.map((g) => <button key={g.id} className={filter === g.id ? "on" : ""} onClick={() => setFilter(g.id)}>
            {g.label} <b>{MODULES.filter((m) => m.group === g.id).length}</b></button>)}
        </div>
        <input className="inp search" placeholder="Search modules" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search modules" />
      </div>

      <section className="tiles">
        {shown.map((m) => {
          const g = groupOf(m);
          const st = moduleStatus(results, m.checks);
          return (
            <article className="tile" key={m.id}>
              <header><span className="num" style={{ background: g.color }}>{num(m.id)}</span><span className="mono caps muted">{g.label}</span></header>
              <div className="body">
                <h3>{m.label}</h3>
                <p>{m.desc}</p>
                <p className="how"><span className="mono caps">How to use</span>{m.how}</p>
                <div className="tstat">{!st ? <span className="pill muted">{results ? "Inputs / tools" : "Not run yet"}</span>
                  : st.fail ? <span className="pill fail">{st.fail} fail · {st.pass} pass</span>
                  : st.attention ? <span className="pill attention">{st.attention} attention · {st.pass} pass</span>
                  : st.total ? <span className="pill pass">{st.pass} pass</span> : <span className="pill muted">No checks</span>}</div>
              </div>
              <footer><button className="btn primary wide" onClick={() => open(m.id)}>Open</button></footer>
            </article>
          );
        })}
      </section>

      <footer className="foot mono caps">
        <span>{info ? `Projects saved in ${info.data_dir}` : ""}</span>
        <span className="spacer" />
        {info && <a href={`https://github.com/${info.repo}`} target="_blank" rel="noreferrer">GitHub ↗</a>}
        {info && <a href={`https://github.com/${info.repo}/releases`} target="_blank" rel="noreferrer">Releases ↗</a>}
        <a href="/docs" target="_blank" rel="noreferrer">API ↗</a>
      </footer>
    </div>
  );
}
