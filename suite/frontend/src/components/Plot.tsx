import { useEffect, useRef } from "react";
// @ts-expect-error - the minified bundle ships without type declarations
import Plotly from "plotly.js-dist-min";
import type { Json } from "../api";

export const SERIES = ["#1f6fb2", "#d9822b", "#2e9e6b", "#c2414b", "#7b5ea7", "#8a8f98", "#0e8a91", "#b5487f"];

function themeLayout(): Json {
  const css = getComputedStyle(document.documentElement);
  const ink = css.getPropertyValue("--ink").trim() || "#1f2933";
  const line = css.getPropertyValue("--line").trim() || "#dde3e9";
  return {
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    font: { family: "system-ui, sans-serif", size: 11.5, color: ink },
    margin: { l: 58, r: 16, t: 28, b: 46 },
    xaxis: { gridcolor: line, zerolinecolor: line, linecolor: line },
    yaxis: { gridcolor: line, zerolinecolor: line, linecolor: line },
    legend: { orientation: "h", y: -0.22, font: { size: 10.5 } },
    hovermode: "closest",
    colorway: SERIES,
  };
}

function merge(a: Json, b: Json): Json {
  const out = { ...a };
  for (const k of Object.keys(b ?? {})) {
    out[k] = b[k] && typeof b[k] === "object" && !Array.isArray(b[k]) ? merge(a[k] ?? {}, b[k]) : b[k];
  }
  return out;
}

export function Plot({ data, layout, height = 340 }: { data: Json[]; layout?: Json; height?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    Plotly.react(ref.current, data, merge(themeLayout(), { height, ...layout }), {
      responsive: true,
      displaylogo: false,
      toImageButtonOptions: { format: "svg" },
    });
  }, [data, layout, height]);
  useEffect(() => {
    const el = ref.current;
    return () => {
      if (el) Plotly.purge(el);
    };
  }, []);
  return <div ref={ref} className="plot" style={{ minHeight: height }} />;
}
