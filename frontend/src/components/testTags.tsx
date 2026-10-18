import { useEffect, useState } from "react";
import type { Json } from "../api";

// Generic instrument tags (API 670 / ISO 20816 locations, ISA 5.1 letters) shared by the MRT and PT pages and
// reports, backend testing/tags.py. Users rename any tag or description; overrides live in project.test_tags.

export type TagRow = { tag: string; description: string; unit: string; location: string; group: string };
let CACHE: { tags: Record<string, TagRow>; glossary: [string, string][] } | null = null;
let LOADING: Promise<void> | null = null;

export function useTagDefaults() {
  const [d, setD] = useState(CACHE);
  useEffect(() => {
    if (CACHE) return;
    LOADING ??= fetch("/api/test-tags").then((r) => r.json()).then((j) => { CACHE = j; }).catch(() => undefined);
    LOADING.then(() => setD(CACHE));
  }, []);
  return d;
}

/** Tag table with the project's overrides applied. */
export function useTags(project: Json) {
  const d = useTagDefaults();
  const ov: Json = project?.test_tags ?? {};
  const table: Record<string, TagRow> = {};
  for (const [k, v] of Object.entries(d?.tags ?? {})) {
    const o = ov[k];
    table[k] = { ...v, ...(typeof o === "string" ? (o ? { tag: o } : {}) : Object.fromEntries(Object.entries(o ?? {}).filter(([, x]) => x))) };
  }
  const T = (k: string) => table[k]?.tag ?? k;
  return { table, T, glossary: d?.glossary ?? [] };
}

const GROUPS = ["vibration", "temperature", "lube oil", "seal gas", "speed", "process"];

/** Editable tag map, document data and glossary. */
export function TagsPanel({ project, setProject, groups = GROUPS, keys }: { project: Json; setProject: (p: Json) => void; groups?: string[]; keys?: string[] }) {
  const { table, glossary } = useTags(project);
  const d = useTagDefaults();
  const ov: Json = project?.test_tags ?? {};
  const doc: Json = project?.test_doc ?? {};
  const set = (k: string, f: string, v: string) => {
    const cur = typeof ov[k] === "string" ? { tag: ov[k] } : { ...(ov[k] ?? {}) };
    if (v === "" || v === d?.tags[k]?.[f as keyof TagRow]) delete cur[f]; else cur[f] = v;
    const next = { ...ov }; if (Object.keys(cur).length) next[k] = cur; else delete next[k];
    setProject({ ...project, test_tags: next });
  };
  const setDoc = (k: string, v: string) => setProject({ ...project, test_doc: { ...doc, [k]: v } });
  const rows = Object.entries(table).filter(([k, r]) => (keys ? keys.includes(k) : groups.includes(r.group)));
  return (
    <div className="grid">
      <div className="card" style={{ gridColumn: "1 / -1" }}><h3>Instrument tags · API 670 / ISO 20816 locations, ISA 5.1 letters</h3>
        <p className="muted small">Generic defaults; type your plant tag or description over any row (blank = default). Pages, live tags and both PDF reports use these names.
          Saved with the project. <button className="btn" onClick={() => setProject({ ...project, test_tags: {} })}>Reset all to defaults</button></p>
        <div className="scroll" style={{ maxHeight: 460 }}><table className="t small"><thead><tr><th>Tag</th><th>Description</th><th>Unit</th><th>Location</th><th>Group</th></tr></thead>
          <tbody>{rows.map(([k, r]) => <tr key={k}>
            <td><input className="inp" style={{ width: 110 }} value={r.tag} onChange={(e) => set(k, "tag", e.target.value)} /></td>
            <td><input className="inp" style={{ width: "100%", minWidth: 260 }} value={r.description} onChange={(e) => set(k, "description", e.target.value)} /></td>
            <td className="muted">{r.unit}</td><td className="muted small">{r.location}</td><td className="muted small">{r.group}</td></tr>)}</tbody></table></div></div>
      <div className="card"><h3>Report document data</h3><div className="form">
        {([["number", "Document no."], ["rev", "Revision"], ["client", "Client / purchaser"], ["equipment_tag", "Equipment tag"], ["vendor", "Vendor / works"], ["po", "Purchase order"],
          ["date", "Test date"]] as [string, string][]).map(([k, l]) =>
          <label key={k}>{l}<input value={doc[k] ?? ""} onChange={(e) => setDoc(k, e.target.value)} /></label>)}
        {([["prepared", "Prepared by"], ["checked", "Checked by"], ["witnessed", "Witnessed by (purchaser)"], ["approved", "Approved by"]] as [string, string][]).map(([k, l]) =>
          <label key={k}>{l}<input value={doc.signoff?.[k] ?? ""} onChange={(e) => setProject({ ...project, test_doc: { ...doc, signoff: { ...(doc.signoff ?? {}), [k]: e.target.value } } })} /></label>)}
      </div><p className="muted small">Printed on the cover, the running header / footer and the sign-off page of the reports.</p></div>
      <div className="card"><h3>Glossary</h3><table className="t small"><tbody>{glossary.map(([a, b]) => <tr key={a}><td><b>{a}</b></td><td>{b}</td></tr>)}</tbody></table></div>
    </div>
  );
}

/** Result summary chips (criterion, value, status). */
export function Summary({ rows }: { rows: [string, string, string][] }) {
  return <div className="sumchips">{rows.map(([k, v, s]) => <div key={k} className={`sumchip ${s}`}><span>{k}</span><b>{v}</b><i>{s}</i></div>)}</div>;
}

/** Rasterise an on-screen SVG (light theme, computed styles inlined) to a PNG data URL for the PDF reports. */
export async function svgToPng(svg: SVGSVGElement | null, width = 2000): Promise<string | undefined> {
  if (!svg) return undefined;
  const root = document.documentElement, prev = root.dataset.theme;
  root.dataset.theme = "light";
  try {
    const clone = svg.cloneNode(true) as SVGSVGElement;
    const src = svg.querySelectorAll("*"), dst = clone.querySelectorAll("*");
    const PROPS = ["fill", "stroke", "stroke-width", "stroke-dasharray", "opacity", "fill-opacity", "stroke-opacity", "font-family", "font-size", "font-weight", "letter-spacing", "text-anchor"];
    const inline = (a: Element, b: Element) => { const cs = getComputedStyle(a); (b as SVGElement).setAttribute("style", PROPS.map((p) => `${p}:${cs.getPropertyValue(p)}`).join(";")); };
    inline(svg, clone);
    src.forEach((el, i) => { if (!(el instanceof SVGStopElement)) inline(el, dst[i]); });
    const bg = getComputedStyle(svg).backgroundColor;
    const vb = svg.viewBox.baseVal, h = Math.round(width * vb.height / vb.width);
    clone.setAttribute("width", String(width)); clone.setAttribute("height", String(h)); clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clone.querySelectorAll(".blink").forEach((e) => e.classList.remove("blink"));
    const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)], { type: "image/svg+xml" }));
    const img = new Image();
    await new Promise<void>((ok, bad) => { img.onload = () => ok(); img.onerror = () => bad(new Error("render")); img.src = url; });
    const c = document.createElement("canvas"); c.width = width; c.height = h;
    const g = c.getContext("2d")!; g.fillStyle = bg && bg !== "rgba(0, 0, 0, 0)" ? bg : "#ffffff"; g.fillRect(0, 0, width, h); g.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);
    return c.toDataURL("image/png");
  } catch { return undefined; } finally { if (prev === undefined) delete root.dataset.theme; else root.dataset.theme = prev; }
}
