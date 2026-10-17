import type { Json } from "../api";

// Field names carry their units as suffixes (e.g. max_tip_speed_m_s).
const UNITS: [string, string][] = [
  ["_nm_rad", "N·m/rad"], ["_nm3_h", "Nm³/h"], ["_w_m2k", "W/m²K"], ["_kgm2", "kg·m²"], ["_l_min", "L/min"],
  ["_m3_h", "m³/h"], ["_m_s", "m/s"], ["_n_m", "N/m"], ["_bara", "bara"], ["_barg", "barg"], ["_bar", "bar"],
  ["_mpa", "MPa"], ["_pa", "Pa"], ["_kn", "kN"], ["_mm", "mm"], ["_um", "µm"], ["_kg", "kg"], ["_rpm", "rpm"],
  ["_kw", "kW"], ["_hz", "Hz"], ["_pct", "%"], ["_min", "min"], ["_c", "°C"], ["_m", "m"],
];

export function label(key: string): { text: string; unit: string } {
  for (const [suf, unit] of UNITS) {
    if (key.endsWith(suf)) {
      const base = key.slice(0, -suf.length);
      return { text: humanise(base), unit };
    }
  }
  return { text: humanise(key), unit: "" };
}

const humanise = (s: string) => {
  const t = s.replace(/_/g, " ");
  return t.charAt(0).toUpperCase() + t.slice(1);
};

function resolve(schema: Json, prop: Json): Json {
  if (prop?.$ref) return schema.$defs[prop.$ref.split("/").pop()];
  return prop;
}

function kind(prop: Json): { type: string; nullable: boolean; enum?: string[] } {
  if (prop.enum) return { type: "enum", nullable: false, enum: prop.enum };
  if (prop.anyOf) {
    const nonNull = prop.anyOf.filter((p: Json) => p.type !== "null");
    const t = nonNull[0] ?? {};
    return { type: t.enum ? "enum" : t.type ?? (t.$ref ? "object" : "string"), nullable: true, enum: t.enum };
  }
  return { type: prop.type ?? (prop.$ref ? "object" : "string"), nullable: false };
}

export function SchemaForm({ schema, def, value, onChange, skip = [] }: {
  schema: Json; def: string; value: Json; onChange: (v: Json) => void; skip?: string[];
}) {
  const d = schema?.$defs?.[def] ?? (def === "Project" ? schema : null);
  if (!d || !value) return null;
  const props = d.properties ?? {};
  return (
    <div className="form">
      {Object.keys(props).filter((k) => !skip.includes(k)).map((k) => {
        const p = resolve(schema, props[k]);
        const kd = kind(p);
        if (kd.type === "object" || kd.type === "array") return null;
        const { text, unit } = label(k);
        const title = props[k].description ?? p.description ?? "";
        const v = value[k];
        const set = (nv: unknown) => onChange({ ...value, [k]: nv });
        if (kd.type === "boolean") {
          return (
            <label key={k} className="check" title={title}>
              <input type="checkbox" checked={!!v} onChange={(e) => set(e.target.checked)} /> {text}
            </label>
          );
        }
        if (kd.type === "enum") {
          return (
            <label key={k} title={title}>
              {text}
              <select value={v ?? ""} onChange={(e) => set(e.target.value)}>
                {kd.enum!.map((o) => <option key={o} value={o}>{o.replace(/_/g, " ")}</option>)}
              </select>
            </label>
          );
        }
        const numeric = kd.type === "number" || kd.type === "integer";
        return (
          <label key={k} title={title}>
            <span>{text}{unit ? ` (${unit})` : ""}</span>
            <input
              type={numeric ? "number" : "text"}
              step="any"
              value={v ?? ""}
              placeholder={kd.nullable ? "auto" : ""}
              onChange={(e) => {
                const raw = e.target.value;
                if (raw === "" && kd.nullable) return set(null);
                set(numeric ? (raw === "" ? 0 : kd.type === "integer" ? parseInt(raw, 10) : parseFloat(raw)) : raw);
              }}
            />
          </label>
        );
      })}
    </div>
  );
}
