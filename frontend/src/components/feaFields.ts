// Colour ramp and result fields shared by the FEA views (kept out of the three.js chunk).
export const RAMP = [[0.19, 0.07, 0.6], [0.07, 0.45, 0.9], [0.1, 0.75, 0.8], [0.35, 0.85, 0.35], [0.98, 0.8, 0.15], [0.9, 0.2, 0.15]];
export const ramp = (t: number) => {
  const x = Math.min(Math.max(t, 0), 1) * (RAMP.length - 1);
  const i = Math.min(Math.floor(x), RAMP.length - 2);
  const f = x - i;
  return RAMP[i].map((a, k) => a + (RAMP[i + 1][k] - a) * f);
};
export const FIELDS: [string, string][] = [["von_mises_mpa", "von Mises (MPa)"], ["hoop_mpa", "Hoop σθ (MPa)"],
  ["radial_mpa", "Radial σr (MPa)"], ["axial_mpa", "Axial σz (MPa)"], ["disp_um", "Displacement (µm)"], ["ur_um", "Radial growth (µm)"]];
