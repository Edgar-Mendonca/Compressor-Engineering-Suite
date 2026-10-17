// Thin client for the CentriForge FastAPI backend.

export type Json = any; // eslint-disable-line @typescript-eslint/no-explicit-any

async function req(method: string, url: string, body?: unknown): Promise<Json> {
  const res = await fetch(url, {
    method,
    headers: body === undefined ? {} : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) {
    let detail = `${res.status} ${res.statusText}`;
    try {
      const j = await res.json();
      detail = typeof j.detail === "string" ? j.detail : JSON.stringify(j.detail ?? j);
    } catch {
      /* keep status text */
    }
    throw new Error(detail);
  }
  return res.json();
}

export const api = {
  health: () => req("GET", "/api/health"),
  appInfo: () => req("GET", "/api/app/info"),
  examples: () => req("GET", "/api/examples"),
  example: (key: string) => req("GET", `/api/examples/${key}`),
  updateCheck: () => req("GET", "/api/app/update"),
  updateApply: () => req("POST", "/api/app/update"),
  updateStatus: () => req("GET", "/api/app/update/status"),
  defaults: () => req("GET", "/api/defaults"),
  schema: () => req("GET", "/api/schema"),
  components: () => req("GET", "/api/components"),
  materials: () => req("GET", "/api/materials"),
  run: (project: Json, level: "full" | "fast" = "full") => req("POST", "/api/run", { project, level }),
  thermoChart: (body: Json) => req("POST", "/api/thermo/chart", body),
  envelope: (body: Json) => req("POST", "/api/thermo/envelope", body),
  projects: () => req("GET", "/api/projects"),
  createProject: (project: Json, note: string) => req("POST", "/api/projects", { project, note }),
  updateProject: (id: number, project: Json, note: string) => req("PUT", `/api/projects/${id}`, { project, note }),
  getProject: (id: number, revision?: number) =>
    req("GET", `/api/projects/${id}${revision === undefined ? "" : `?revision=${revision}`}`),
  revisions: (id: number) => req("GET", `/api/projects/${id}/revisions`),
  runSaved: (id: number) => req("POST", `/api/projects/${id}/run?level=full`),
  history: (id: number) => req("GET", `/api/projects/${id}/history`),
  metrics: () => req("GET", "/api/studies/metrics"),
  parametric: (body: Json) => req("POST", "/api/studies/parametric", body),
  sensitivity: (body: Json) => req("POST", "/api/studies/sensitivity", body),
  optimize: (body: Json) => req("POST", "/api/studies/optimize", body),
};

export async function download(kind: string, project: Json) {
  const { saveFrom, safeName } = await import("./files");
  return saveFrom(`/api/export/${kind}`, { project, level: "full" }, `${safeName(project.name)}_rev${project.revision}_${kind}`);
}

export const fmt = (v: unknown, nd = 1): string => {
  if (v === null || v === undefined) return "–";
  if (typeof v === "number") {
    if (!Number.isFinite(v)) return "–";
    return v.toLocaleString(undefined, { maximumFractionDigits: nd, minimumFractionDigits: nd });
  }
  if (typeof v === "boolean") return v ? "yes" : "no";
  return String(v);
};
