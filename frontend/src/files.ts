// Saving and opening files. In the desktop app a native Save As / Open dialog is used
// (window.pywebview.api, see backend/compsuite/desktop.py); in a browser, a download.

import type { Json } from "./api";

type Bridge = {
  save_file: (name: string, b64: string, type?: string) => Promise<string | null>;
  save_text: (path: string | null, text: string, name: string) => Promise<string | null>;
  open_project: () => Promise<{ path: string; text: string } | null>;
  read_path: (path: string) => Promise<{ path: string; text: string }>;
  reveal: (path: string) => Promise<void>;
  open_path: (path: string) => Promise<void>;
};
export const bridge = (): Bridge | null => (window as Json).pywebview?.api ?? null;

export type Toast = { text: string; path?: string; error?: boolean };
const listeners = new Set<(t: Toast) => void>();
export const onToast = (f: (t: Toast) => void) => { listeners.add(f); return () => { listeners.delete(f); }; };
export const toast = (t: Toast) => listeners.forEach((f) => f(t));

const b64 = (blob: Blob) => new Promise<string>((res, rej) => {
  const r = new FileReader();
  r.onload = () => res(String(r.result).split(",")[1] ?? "");
  r.onerror = () => rej(r.error);
  r.readAsDataURL(blob);
});

export const safeName = (s: string) => String(s).replace(/[^\w.-]+/g, "_");

/** Save a file: native dialog in the desktop app, download in a browser. */
export async function saveBlob(blob: Blob, name: string) {
  const b = bridge();
  try {
    if (b) {
      const path = await b.save_file(name, await b64(blob));
      if (path) toast({ text: "Saved", path });
      return path;
    }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    toast({ text: `Downloaded ${name} (browser downloads folder)` });
    return name;
  } catch (e) {
    toast({ text: `Could not save: ${(e as Error).message}`, error: true });
    return null;
  }
}

/** POST json, save the response under the given name. */
export async function saveFrom(url: string, body: unknown, name: string) {
  const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!r.ok) {
    const d = await r.json().catch(() => ({}));
    toast({ text: d.detail ?? r.statusText, error: true });
    return null;
  }
  return saveBlob(await r.blob(), name);
}

// ---- projects (.cfproj)
const RECENT = "cf.recent";
export const recent = (): { path: string; name: string; t: number }[] => { try { return JSON.parse(localStorage.getItem(RECENT) ?? "[]"); } catch { return []; } };
const addRecent = (path: string, name: string) => {
  try { localStorage.setItem(RECENT, JSON.stringify([{ path, name, t: Date.now() }, ...recent().filter((r) => r.path !== path)].slice(0, 8))); } catch { /* ignore */ }
};

export async function saveProject(project: Json, path: string | null): Promise<string | null> {
  const text = JSON.stringify({ format: "centriforge-project", version: 1, project }, null, 1);
  const b = bridge();
  if (b) {
    const p = await b.save_text(path, text, `${safeName(project.name)}.cfproj`);
    if (p) { addRecent(p, project.name); toast({ text: "Project saved", path: p }); }
    return p;
  }
  await saveBlob(new Blob([text], { type: "application/json" }), `${safeName(project.name)}.cfproj`);
  return null;
}

export const parseProject = (text: string): Json => { const d = JSON.parse(text); return d.format === "centriforge-project" ? d.project : d; };

export async function openProject(path?: string): Promise<{ project: Json; path: string | null } | null> {
  const b = bridge();
  if (b) {
    const r = path ? await b.read_path(path) : await b.open_project();
    if (!r) return null;
    const project = parseProject(r.text);
    addRecent(r.path, project.name);
    return { project, path: r.path };
  }
  return new Promise((res) => {
    const i = document.createElement("input");
    i.type = "file";
    i.accept = ".cfproj,.json,application/json";
    i.onchange = async () => { const f = i.files?.[0]; res(f ? { project: parseProject(await f.text()), path: null } : null); };
    i.click();
  });
}
