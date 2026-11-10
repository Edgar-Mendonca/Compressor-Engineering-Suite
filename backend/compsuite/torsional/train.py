"""Torsional vibration analysis of a compressor train.

Lumped inertia / shaft-stiffness model referred to the compressor speed
(inertia and stiffness of a branch running at speed ratio n relative to the
compressor are multiplied by n^2). Provides natural frequencies and mode
shapes, an interference (Campbell) diagram with API 617 separation checks,
steady forced response with modal damping, and an optional synchronous-motor
start-up transient (pulsating air-gap torque at twice slip frequency).

A gearbox is represented by its two wheels with a referred mesh stiffness.
For more detailed models (branched trains, couplings with nonlinear
stiffness, electrical coupling) the openTorsion library is the intended
integration path.
"""

from __future__ import annotations

import math
from dataclasses import dataclass

import numpy as np
from scipy import linalg
from scipy.integrate import solve_ivp

from compsuite.core.trace import record


@dataclass
class Station:
    name: str
    inertia: float  # kg m2 at its own speed
    ratio: float = 1.0  # own speed / compressor speed
    rotor: str = ""
    x_m: float = 0.0
    direction: int = 1  # -1 for shafts counter-rotating relative to the reference


@dataclass
class Shaft:
    name: str
    stiffness: float  # N m / rad at its own speed
    ratio: float = 1.0
    diameter: float = 0.1  # for stress
    endurance_shear_mpa: float | None = None
    rotor: str = ""
    kind: str = "shaft"  # shaft / coupling / mesh
    inner_diameter: float = 0.0
    length: float = 0.0
    i: int | None = None  # end stations (default: chain i, i+1)
    j: int | None = None


@dataclass
class Train:
    stations: list[Station]
    shafts: list[Shaft]  # shaft k connects stations (i, j), default (k, k+1)

    def __post_init__(self):
        for k, sh in enumerate(self.shafts):
            if sh.i is None:
                sh.i, sh.j = k, k + 1

    def matrices(self):
        n = len(self.stations)
        J = np.diag([s.inertia * s.ratio**2 for s in self.stations])
        K = np.zeros((n, n))
        for sh in self.shafts:
            k = sh.stiffness * sh.ratio**2
            ix = np.ix_([sh.i, sh.j], [sh.i, sh.j])
            K[ix] += k * np.array([[1, -1], [-1, 1]])
        return J, K


def natural_frequencies(train: Train, n_modes: int = 6) -> dict:
    J, K = train.matrices()
    w2, vec = linalg.eigh(K, J)
    w = np.sqrt(np.clip(w2, 0, None))
    modes = []
    for j in range(1, min(len(w), n_modes + 1)):  # skip rigid-body mode
        v = vec[:, j] / np.max(np.abs(vec[:, j]))
        twist = [float(v[sh.j] - v[sh.i]) for sh in train.shafts]
        modes.append({"freq_hz": float(w[j] / (2 * math.pi)), "freq_cpm": float(w[j] * 60 / (2 * math.pi)),
                      "shape": v.tolist(), "shaft_twist": twist,
                      "dominant_shaft": train.shafts[int(np.argmax(np.abs(twist)))].name})
    return {"modes": modes, "stations": [s.name for s in train.stations], "shafts": [s.name for s in train.shafts]}


def excitations(speed_rpm_comp: float, gear_ratio: float, line_hz: float, driver: str, poles: int) -> dict:
    """Excitation frequencies (Hz) at a given compressor speed."""
    f_c = speed_rpm_comp / 60.0
    f_d = f_c / gear_ratio
    ex = {"1x compressor": f_c, "2x compressor": 2 * f_c}
    if abs(gear_ratio - 1.0) > 1e-6:
        ex["1x driver"] = f_d
        ex["2x driver"] = 2 * f_d
    if driver == "vfd_motor":
        f_el = f_d * poles / 2
        ex["6x electrical (VFD)"] = 6 * f_el
        ex["12x electrical (VFD)"] = 12 * f_el
    elif "motor" in driver:
        ex["2x line"] = 2 * line_hz
    return ex


def interference(train: Train, nat: dict, speed_range_rpm: tuple[float, float], mcs_rpm: float, gear_ratio: float,
                 line_hz: float, driver: str, poles: int, margin: float, n_check_modes: int = 3) -> dict:
    lo, hi = speed_range_rpm
    speeds = np.linspace(0, hi * 1.2, 61)
    lines = {}
    for s in speeds:
        for k, v in excitations(s, gear_ratio, line_hz, driver, poles).items():
            lines.setdefault(k, []).append(v)
    checks = []
    for m in nat["modes"][:n_check_modes]:
        fn = m["freq_hz"]
        for name in lines:
            f_lo = excitations(lo, gear_ratio, line_hz, driver, poles)[name]
            f_hi = excitations(hi, gear_ratio, line_hz, driver, poles)[name]
            band_lo, band_hi = min(f_lo, f_hi), max(f_lo, f_hi)
            if band_lo <= fn <= band_hi:
                sep = 0.0
            else:
                sep = min(abs(fn - band_lo) / band_lo if band_lo > 0 else 9.0, abs(fn - band_hi) / band_hi if band_hi > 0 else 9.0)
            # Crossing speed for proportional excitations.
            ratio_hi = f_hi / hi if hi > 0 else 0
            crossing = fn / ratio_hi if ratio_hi > 0 and abs(f_hi - f_lo) > 1e-9 else None
            checks.append({"mode_hz": fn, "excitation": name, "band_hz": [band_lo, band_hi], "separation": sep,
                           "crossing_rpm": crossing, "pass": sep >= margin})
    return {"speeds_rpm": speeds.tolist(), "lines_hz": lines, "checks": checks,
            "all_pass": all(c["pass"] for c in checks)}


def forced_response(train: Train, nat_modes: int, speeds_rpm: np.ndarray, torque_amp: float, at_station: int,
                    order: float, zeta: float) -> dict:
    """Steady harmonic response to a torque of amplitude torque_amp at order x compressor speed."""
    J, K = train.matrices()
    w2, phi = linalg.eigh(K, J)
    n = len(train.stations)
    out = {sh.name: [] for sh in train.shafts}
    for s in speeds_rpm:
        w = order * s * 2 * math.pi / 60
        F = np.zeros(n)
        F[at_station] = torque_amp * train.stations[at_station].ratio
        q = np.zeros(n, dtype=complex)
        for j in range(n):
            wj = math.sqrt(max(w2[j], 0.0))
            fj = phi[:, j] @ F
            denom = wj**2 - w**2 + 2j * zeta * wj * w
            q += phi[:, j] * fj / denom if abs(denom) > 1e-12 else 0
        for sh in train.shafts:
            # Dynamic torque at the shaft's own speed.
            T_ref = sh.stiffness * sh.ratio**2 * (q[sh.j] - q[sh.i])
            out[sh.name].append(float(abs(T_ref) / sh.ratio))
    return {"speeds_rpm": list(map(float, speeds_rpm)), "order": order, "dynamic_torque_nm": out}


def startup_transient(train: Train, rated_torque: float, sync_rpm_comp: float, line_hz: float, poles: int,
                      zeta: float, t_end: float | None = None, pulsating_ratio: float = 0.5,
                      avg_ratio: float = 1.2, load_ratio: float = 0.3) -> dict:
    """Synchronous motor start: average torque avg_ratio*T_r plus pulsating
    pulsating_ratio*T_r at 2 x slip frequency, load ~ speed^2."""
    J, K = train.matrices()
    n = len(train.stations)
    w2, phi = linalg.eigh(K, J)
    # Rayleigh damping fitted to the first flexible mode.
    w1 = math.sqrt(max(w2[1], 1.0))
    C = 2 * zeta / w1 * K
    w_sync = sync_rpm_comp * 2 * math.pi / 60
    Jtot = J.sum()
    t_acc = Jtot * w_sync / ((avg_ratio - load_ratio / 3) * rated_torque)
    t_end = t_end or 1.2 * t_acc
    r_drv = train.stations[0].ratio
    Jinv = np.diag(1 / np.diag(J))

    def rhs(t, y):
        th, om = y[:n], y[n:]
        w_m = om[0]
        slip = max(1 - w_m / w_sync, 0.0)
        f_slip = 2 * slip * line_hz
        Tm = rated_torque * (avg_ratio * (1 if slip > 0 else 0.0) + (load_ratio if slip == 0 else 0)
                             + pulsating_ratio * math.sin(2 * math.pi * f_slip * t) * (1 if slip > 0.002 else 0))
        T = np.zeros(n)
        T[0] = Tm * r_drv
        T[-1] = -load_ratio * rated_torque * (om[-1] / w_sync) ** 2
        acc = Jinv @ (T - K @ th - C @ om)
        return np.concatenate([om, acc])

    sol = solve_ivp(rhs, (0, t_end), np.zeros(2 * n), max_step=min(2e-3, 0.05 / max(math.sqrt(w2[-1]) / (2 * math.pi), 1)),
                    rtol=1e-6, atol=1e-9)
    t = sol.t
    th = sol.y[:n]
    om = sol.y[n:]
    shaft_t = {}
    for sh in train.shafts:
        shaft_t[sh.name] = (sh.stiffness * sh.ratio**2 * (th[sh.j] - th[sh.i]) / sh.ratio).tolist()
    step = max(1, len(t) // 1500)
    return {"t_s": t[::step].tolist(), "speed_rpm": (om[0][::step] * 60 / (2 * math.pi)).tolist(),
            "shaft_torque_nm": {k: v[::step] for k, v in shaft_t.items()},
            "peak_torque_nm": {k: float(np.max(np.abs(v))) for k, v in shaft_t.items()},
            "acceleration_time_s": t_acc}


def _mat(shaft_material: dict, yield_mpa=None, uts_mpa=None) -> dict:
    m = {k: shaft_material[k] for k in ("shear_modulus_pa", "density_kg_m3", "yield_mpa", "uts_mpa", "endurance_mpa")}
    if yield_mpa:
        m["yield_mpa"] = yield_mpa
    if uts_mpa:
        m["uts_mpa"], m["endurance_mpa"] = uts_mpa, 0.5 * uts_mpa
    return m


def _els(rows) -> list:
    from compsuite.torsional.api617 import Element
    mm = lambda v: None if v is None else v / 1e3
    return [Element(r.length_mm / 1e3, r.od_mm / 1e3, r.id_mm / 1e3, mm(r.od_mass_mm), mm(r.id_mass_mm), r.added_ip_kgm2,
                    r.core, r.mesh, label=r.label) for r in rows]


def _d_end(torque):
    return (16 * torque / (math.pi * 40e6)) ** (1 / 3)  # 40 MPa nominal shear at rated torque


def compressor_elements(rotor: dict) -> list:
    """Torsional elements of the compressor rotor from the rotor sections; impeller,
    balance piston, collar and sleeve inertias added at their stations (coupling
    half excluded: the coupling inertia is split over the hubs)."""
    from compsuite.torsional.api617 import Element
    secs = rotor["sections"]
    masses = [m for m in rotor["masses"] if m["kind"] != "coupling"]
    zs = sorted({round(float(z), 6) for s in secs for z in (s["z0_m"], s["z1_m"])} | {round(float(m["z_m"]), 6) for m in masses})
    els = []
    for a, b in zip(zs[:-1], zs[1:]):
        zm = 0.5 * (a + b)
        s = next((s for s in secs if s["z0_m"] <= zm <= s["z1_m"]), secs[-1])
        here = [m for m in masses if abs(m["z_m"] - a) < 1e-6]
        els.append(Element(b - a, s["od_m"], s["id_m"], added_ip=float(sum(m["ip_kgm2"] for m in here)),
                           excite=any(m["kind"] == "impeller" for m in here), label=s["label"]))
    return els


def _coupling(c, T, d_shaft, G, pf, ip_def=None, k_def=None):
    """Coupling data; estimates: Ip 2.5e-5 (1.5 T)^0.9, body stiffness 100 x continuous rating (1.5 T) in series
    with pf x hub length (= shaft diameter) of shaft on each side (API 671 penetration)."""
    ip = (c.ip_kgm2 if c else None) or ip_def or 2.5e-5 * (1.5 * T) ** 0.9
    k = (c.stiffness_nm_rad if c else None) or k_def
    if not k:
        k = 1 / (1 / (100 * 1.5 * T) + 2 * pf * d_shaft / (G * math.pi * d_shaft**4 / 32))
    t_max = (c.max_transient_torque_nm if c else None) or 5.0 * T
    t_alt = (c.allowable_alternating_torque_nm if c else None) or 0.15 * t_max
    return ip, k, t_max, t_alt


def build_train(project, rotor: dict, sizing: dict, shaft_material: dict) -> Train:
    """Assemble the train: driver (VFD / fixed-speed motor or turbine), coupling(s), optional bull gear / pinion,
    compressor rotor from its shaft sections. Vendor station tables replace the estimates when supplied.
    The returned Train carries `meta` (component bookkeeping) and `info` (speeds, gear data)."""
    from compsuite.torsional.api617 import CouplingPart, Element, MeshPart, RotorPart, build
    tr, db = project.train, project.design_basis
    N_c = sizing["speed_rpm"]
    teeth = bool(tr.pinion_teeth and tr.bull_gear_teeth)
    gr = tr.bull_gear_teeth / tr.pinion_teeth if teeth else tr.gear_ratio
    geared = teeth or abs(gr - 1.0) > 1e-6
    N_d = N_c / gr
    P_kw = tr.motor_rated_power_kw or sizing["driver_rating_kw"]
    T_d, T_c = 9549 * P_kw / N_d, 9549 * P_kw / N_c
    mc = _mat(shaft_material)
    md = _mat(shaft_material, tr.driveline_shaft_yield_mpa, tr.driveline_shaft_uts_mpa)
    G = mc["shear_modulus_pa"]
    electric = "motor" in db.driver_type
    r_d, r_c = 1 / gr, 1.0
    dirn = -1 if geared else 1
    drv = "Motor" if electric else "Driver"
    # Driver rotor (NDE -> coupling end).
    if tr.motor_elements:
        e_drv = _els(tr.motor_elements)
    else:
        J = tr.driver_inertia_kgm2 or 0.04 * P_kw * (1500.0 / N_d) ** 2
        d = _d_end(T_d)
        n_core = 4 if electric else 1
        e_drv = [Element(0.3, 0.8 * d, label="NDE stub")]
        e_drv += [Element(2.5 * d / n_core, 1.3 * d, added_ip=J / n_core, core=electric, excite=not electric,
                          label="Core" if electric else "Driver body") for _ in range(n_core)]
        e_drv.append(Element(0.6, d, label="Shaft end"))
    parts, meshes, gear = [RotorPart(drv, e_drv, r_d, 1, md, dirn)], [], None
    pf = tr.coupling_penetration_factor
    if geared:
        ip, k, tm, ta = _coupling(tr.ls_coupling, T_d, _d_end(T_d), G, pf)
        parts.append(CouplingPart(f"Coupling {drv}-Bull gear", ip, k, r_d, 1, tm, ta))
        beta = math.radians(tr.gear_helix_angle_deg)
        at = math.atan(math.tan(math.radians(tr.gear_pressure_angle_deg)) / math.cos(beta))
        d_ps, d_bs = _d_end(T_c), _d_end(T_d)
        if teeth and tr.gear_module_mm:
            dp = tr.pinion_teeth * tr.gear_module_mm / 1e3 / math.cos(beta)
        else:
            dp = 2.5 * d_ps
        db_ = dp * gr
        b = (tr.gear_face_width_mm or 0.9e3 * dp) / 1e3
        rho = md["density_kg_m3"]
        geo = teeth and tr.gear_module_mm
        J_b = 0.8 * rho * math.pi * db_**4 * b / 32 if geo else tr.gear_inertia_low_kgm2
        k_lin = tr.gear_mesh_stiffness_n_mm * 1e3 if tr.gear_mesh_stiffness_n_mm else (
            20e6 * b * 1e3 if geo or tr.gear_face_width_mm else tr.gear_mesh_stiffness_nm_rad / (dp / 2 * math.cos(at)) ** 2)
        if tr.bull_gear_elements:
            e_b = _els(tr.bull_gear_elements)
        else:
            e_b = [Element(0.4, d_bs, label="Shaft end"), Element(b / 2, 1.3 * d_bs, label="Gear"),
                   Element(b / 2, 1.3 * d_bs, added_ip=J_b, mesh=True, label="Gear"), Element(0.3, d_bs, label="NDE stub")]
        if tr.pinion_elements:
            e_p = _els(tr.pinion_elements)
        else:
            dpo = 0.85 * dp
            jp = 0.0 if geo else tr.gear_inertia_high_kgm2
            e_p = [Element(0.2, d_ps, label="NDE stub"), Element(b / 2, dpo, od_mass_m=dp if geo else dpo, label="Pinion"),
                   Element(b / 2, dpo, od_mass_m=dp if geo else dpo, added_ip=jp, mesh=True, label="Pinion"),
                   Element(0.35, d_ps, label="Shaft end")]
        parts += [RotorPart("Bull gear", e_b, r_d, 1, md, dirn), RotorPart("Pinion", e_p, r_c, 2, md, 1)]
        meshes.append(MeshPart("Gear mesh", k_lin, db_ / 2 * math.cos(at), dp / 2 * math.cos(at), "Bull gear", "Pinion"))
        gear = {"ratio": gr, "pinion_teeth": tr.pinion_teeth, "bull_gear_teeth": tr.bull_gear_teeth, "module_mm": tr.gear_module_mm,
                "pressure_angle_deg": tr.gear_pressure_angle_deg, "helix_angle_deg": tr.gear_helix_angle_deg,
                "transverse_pressure_angle_deg": math.degrees(at), "pinion_pitch_diameter_mm": dp * 1e3,
                "bull_pitch_diameter_mm": db_ * 1e3, "face_width_mm": b * 1e3, "mesh_stiffness_n_mm": k_lin / 1e3,
                "mesh_k_bull_nm_rad": k_lin * (db_ / 2 * math.cos(at)) ** 2, "mesh_k_pinion_nm_rad": k_lin * (dp / 2 * math.cos(at)) ** 2,
                "estimated": not geo}
    cpl_name = "Coupling Pinion-Compressor" if geared else f"Coupling {drv}-Compressor"
    ip, k, tm, ta = _coupling(tr.hs_coupling, T_c, rotor["coupling_diameter_m"], G, pf, tr.coupling_inertia_kgm2,
                              tr.coupling_torsional_stiffness_nm_rad)
    parts.append(CouplingPart(cpl_name, ip, k, r_c, 2 if geared else 1, tm, ta))
    parts.append(RotorPart("Compressor", compressor_elements(rotor), r_c, 2 if geared else 1, mc, 1))
    train, meta = build(parts, meshes)
    lines = ({1: (f"{drv} + Bull gear", N_d), 2: ("Pinion + Compressor", N_c)} if geared else {1: (f"{drv} + Compressor", N_c)})
    train.meta = meta
    train.info = {"geared": geared, "gear_ratio": gr, "driver_rpm": N_d, "compressor_rpm": N_c, "rated_power_kw": P_kw,
                  "lines": lines, "gear": gear, "electric": electric}
    return train


def _sc_terms(rows, T_rated, line_hz):
    return [{"mk_nm": r.mk_knm * 1e3 if r.mk_knm is not None else r.mk_pu * T_rated, "alpha": r.alpha_1_s,
             "omega": r.omega_rad_s if r.omega_rad_s is not None else r.omega_x_line * 2 * math.pi * line_hz,
             "phi": r.phase_rad} for r in rows]


def torsional_analysis(project, train: Train, sizing: dict, shaft_material: dict) -> dict:
    from compsuite.torsional import api617 as A
    tr, db, cr = project.train, project.design_basis, project.criteria
    info, meta = train.info, train.meta
    vfd = db.driver_type == "vfd_motor"
    rec = record("torsional", "Shaft finite-element torsional model of the train referred to compressor speed (API 617 / 684 / 671)",
                 [tr, db],
                 assumptions=["Massless torsional shaft elements with inertia lumped at the stations; coupling inertia split over the hubs",
                              "Gear mesh as a spring on the pitch-line displacement (base radii); counter-rotation gives opposite mode-shape signs",
                              f"Coupling stiffness per API 671 with {tr.coupling_penetration_factor:.2f} shaft penetration (estimated couplings)",
                              "Driver, gear and coupling data estimated when not supplied (replace with vendor data)",
                              f"Separation margin {cr.torsional_separation_margin:.0%} beyond {db.min_operating_speed_pct:.0f}-"
                              f"{db.max_continuous_speed_pct:.0f} % speed; resonance dangerous when the exciting shaft line holds "
                              f">= {tr.danger_strain_energy_share:.0%} of the modal strain energy",
                              f"Steady state: exciting torque {tr.steady_excitation_pct:g} % of M = 9549 P/N, zeta = {tr.steady_state_damping_ratio}",
                              "Allowable alternating shear tau = 0.577 Se Cs Cz / Kt x (1 - tau_m / (0.577 UTS)) / SF",
                              f"Transient allowable shear = {tr.transient_yield_fraction} Sy / sqrt(3) (peak incl. rated torque)",
                              f"Coupling: API 671 modified Goodman, mean {tr.coupling_goodman_mean_factor:g} x rated torque, SF = OB/OA >= {tr.coupling_min_safety}",
                              "Short circuit M(t) = sum Mk exp(-a t) sin(w t + phi) at the motor core, Newmark modal integration"],
                 references=["API 617 9th ed. (2022) torsional analysis", "API 684 (2019) torsional tutorial, penetration factor",
                             "API 671 (2020) coupling Goodman evaluation", "ISO 6336-1 mesh stiffness c_gamma"])
    N = sizing["speed_rpm"]
    lo, hi = db.min_operating_speed_pct / 100, db.max_continuous_speed_pct / 100
    T_motor = 9549 * info["rated_power_kw"] / info["driver_rpm"]
    sc_cases = {}
    if info["electric"] and tr.short_circuit_analysis:
        # Fault at the motor terminals: stator frequency = drive output frequency for VFD motors.
        f_sc = info["driver_rpm"] * tr.motor_poles / 120 if vfd else tr.line_frequency_hz
        sc_cases = {"Three-phase short circuit": _sc_terms(tr.short_circuit_3ph, T_motor, f_sc),
                    "Two-phase short circuit": _sc_terms(tr.short_circuit_2ph, T_motor, f_sc)}
    s = A.Settings(info["rated_power_kw"], info["lines"], lo, hi, cr.torsional_separation_margin, tr.steady_state_damping_ratio,
                   tr.steady_excitation_pct / 100, info["electric"], vfd, tr.line_frequency_hz, tr.motor_poles,
                   dict(tr.vfd_harmonics_pct), tr.vfd_acceleration_time_s, sc_cases, tr.short_circuit_duration_s,
                   dict(Cs=tr.shaft_surface_factor, Cz=tr.shaft_size_factor, Kt=tr.shaft_stress_concentration,
                        SF=tr.shaft_fatigue_safety, tr_frac=tr.transient_yield_fraction),
                   tr.coupling_goodman_mean_factor, tr.coupling_min_safety, tr.danger_strain_energy_share, max(tr.torsional_modes, 10))
    s.sc_clear_s, s.sc_events = tr.breaker_clearing_time_s, tr.short_circuit_events
    res = A.analyse(train, meta, s)
    md, c = res["md"], A.stress_factor(train)
    T_rated = 9549 * info["rated_power_kw"] / N
    comps = [n for n, r in meta["rotors"].items() if r["kind"] == "rotor"]
    cpls = [n for n, r in meta["rotors"].items() if r["kind"] == "coupling"]

    # Legacy keys: natural, interference, forced, stress.
    nat = {"modes": [{"freq_hz": m["freq_hz"], "freq_cpm": m["freq_cpm"], "shape": m["shape"], "shaft_twist":
                      [float(m["shape_ref"][sh.j] - m["shape_ref"][sh.i]) for sh in train.shafts],
                      "dominant_shaft": max(m["strain_energy"], key=m["strain_energy"].get), "main_rotors": ", ".join(m["main"])}
                     for m in res["modes"]],
           "stations": [st.name for st in train.stations], "shafts": [sh.name for sh in train.shafts]}
    speeds = np.linspace(0, 1.2 * N, 61)
    exc = res["excitations"]
    f_at = lambda e, rpm_c: (e["order"] * e["rpm"] * rpm_c / N / 60) if e["order"] else e["f_rated_cpm"] / 60
    lines_hz = {e["name"]: [f_at(e, v) for v in speeds] for e in exc}
    ss_by = {(x["mode"], x["excitation"]): x for x in res["steady_state"]}
    checks = []
    for row in res["separation_table"]:
        for cell, e in zip(row["cells"], exc):
            if row["mode"] > 3 and not cell["interferes"]:
                continue
            band = sorted([f_at(e, lo * N), f_at(e, hi * N)])
            ok_sep = cell["separation"] >= cr.torsional_separation_margin
            ss = ss_by.get((row["mode"], e["name"]))
            checks.append({"mode_hz": row["freq_hz"], "excitation": e["name"], "band_hz": band, "separation": cell["separation"],
                           "margin_pct": cell["margin_pct"], "crossing_rpm": cell["crossing_pct"] * N / 100 if cell["crossing_pct"] else None,
                           "dangerous": cell["dangerous"], "separation_ok": ok_sep,
                           "resolved_by_stress_analysis": bool(ss and ss["pass"]), "pass": ok_sep or bool(ss and ss["pass"])})
    if res["vsd"]:
        f_el = res["vsd"]["electrical_hz_rated"]
        ok_order = {r["order"]: r["pass"] for r in res["vsd"]["responses"]}
        for x in res["vsd"]["crossings"]:
            if x["in_operating_range"] and x["evaluated"]:  # lower content is covered by the 1 % steady-state case
                checks.append({"mode_hz": x["freq_cpm"] / 60, "excitation": f"VFD harmonic {x['order']}x f_el",
                               "band_hz": [x["order"] * f_el * lo, x["order"] * f_el * hi], "separation": 0.0, "margin_pct": None,
                               "crossing_rpm": x["speed_pct"] * N / 100, "dangerous": None, "separation_ok": False,
                               "resolved_by_stress_analysis": ok_order.get(x["order"], True), "pass": ok_order.get(x["order"], True)})
    inter = {"speeds_rpm": speeds.tolist(), "lines_hz": lines_hz, "checks": checks, "all_pass": all(x["pass"] for x in checks)}
    for x in checks:
        if not x["pass"] and "VFD" not in x["excitation"]:
            rec.warn(f"Torsional mode {x['mode_hz']:.1f} Hz within {cr.torsional_separation_margin:.0%} of {x['excitation']} "
                     f"band {x['band_hz'][0]:.1f}-{x['band_hz'][1]:.1f} Hz and not cleared by the stress analysis")

    # 1 % rated torque at 1X compressor speed at the compressor coupling hub (legacy sweep).
    comp_first = meta["rotors"]["Compressor"]["first"]
    sp = np.linspace(0.05 * N, 1.2 * N, 200)
    F = A.force_vector(train, [comp_first], 0.01 * T_rated)
    Tsw = np.array([np.abs(A.harmonic(md, F, v * math.pi / 30, tr.modal_damping_ratio)) for v in sp])
    forced = {"speeds_rpm": sp.tolist(), "order": 1.0,
              "dynamic_torque_nm": {n: Tsw[:, meta["rotors"][n]["elements"]].max(axis=1).tolist() for n in comps + cpls}}
    # Envelope of alternating element torque: legacy sweep + steady-state resonance cases.
    env = Tsw.max(axis=0)
    for x in res["steady_state"]:
        env = np.maximum(env, np.array(x["element_shear_mpa"]) * 1e6 / np.where(c > 0, c, np.inf))
    stress = []
    for n in comps:
        r = meta["rotors"][n]
        el = r["elements"]
        e = el[int(np.argmax(env[el] * c[el]))]
        sh, al = train.shafts[e], res["allowables"][n]
        T_mean = 9549 * info["rated_power_kw"] / (sh.ratio * N)
        tau_m, tau_a = T_mean * c[e] / 1e6, env[e] * c[e] / 1e6
        sf = 1 / (tau_a / al["tau_e_mpa"] + tau_m / al["tau_u_mpa"]) if tau_a + tau_m > 0 else float("inf")
        stress.append({"shaft": n, "diameter_mm": sh.diameter * 1e3, "mean_torque_nm": T_mean, "max_dynamic_torque_nm": float(env[e]),
                       "mean_shear_mpa": tau_m, "alternating_shear_mpa": tau_a, "goodman_safety": sf, "station": sh.i + 1})

    # Model / station report.
    components = []
    for n, r in meta["rotors"].items():
        row = {"name": n, "kind": r["kind"], "line": r["line"], "speed_rpm": r["ratio"] * N}
        if r["kind"] == "rotor":
            row.update(ip_kgm2=r["ip_own"], stiffness_nm_rad=r["stiffness_own"], length_mm=r["length_m"] * 1e3,
                       stations=[r["first"] + 1, r["last"] + 1], material={k: r["material"][k] for k in ("yield_mpa", "uts_mpa", "endurance_mpa")})
        elif r["kind"] == "coupling":
            row.update(ip_kgm2=r["ip"], stiffness_nm_rad=r["stiffness"], max_transient_torque_nm=r["max_transient_nm"],
                       allowable_alternating_torque_nm=r["alt_allow_nm"], penetration_factor=tr.coupling_penetration_factor)
        else:
            row.update(stiffness_nm_rad=r["k_pinion_nm_rad"], mesh_stiffness_n_mm=r["k_n_mm"])
        components.append(row)
    model = {"components": components, "stations": meta["stations"], "gear": info["gear"], "geared": info["geared"],
             "lines": {str(k): {"label": v[0], "rated_rpm": v[1]} for k, v in info["lines"].items()},
             "rated_power_kw": info["rated_power_kw"], "rated_torque_nm": {str(k): v for k, v in res["rated_torque_nm"].items()},
             "total_ip_ref_kgm2": float(np.trace(md["J"])), "electric": info["electric"], "vfd": vfd}
    tnf = [{k: m[k] for k in ("mode", "freq_hz", "freq_cpm", "shape", "strain_energy", "kinetic_energy", "line_strain_energy", "main")}
           for m in res["modes"]]
    for x in res["steady_state"]:
        if not x["pass"]:
            rec.warn(f"Steady-state resonance mode {x['mode']} ({x['freq_cpm']:.0f} cpm) vs {x['excitation']}: stress or coupling SF not acceptable")
    for k, v in res["short_circuit"].items():
        if not v["pass"]:
            rec.warn(f"{k}: peak shaft stress or coupling torque above the transient allowable")
    if res["vsd"] and not res["vsd"]["pass"]:
        rec.warn("VSD harmonic response exceeds allowable stress / coupling Goodman SF")
    co = res["conclusion"]
    text = [f"{co['interferences']} interference point(s) within the {cr.torsional_separation_margin:.0%} margin band, "
            f"{co['dangerous']} on modes where the exciting shaft line participates.",
            "Steady-state resonant stresses and coupling Goodman safety factors are acceptable." if co["steady_state_pass"]
            else "Steady-state resonant response NOT acceptable at one or more interference points."]
    if co["vsd_pass"] is not None:
        text.append("VSD harmonic responses are acceptable." if co["vsd_pass"] else "VSD harmonic response NOT acceptable.")
    if co["short_circuit_pass"] is not None:
        text.append(("Short-circuit peak stresses and coupling torques are within the transient allowables" if co["short_circuit_pass"]
                     else "Short-circuit peak stress or coupling torque exceeds the transient allowable")
                    + ("; alternating stresses below the endurance limit: infinite fatigue life." if co["infinite_life"]
                       else "; alternating stress above the endurance limit: limited number of fault events (cumulative damage assessment)."))
    co["text"] = text
    out = {"train": {"stations": [st.__dict__ for st in train.stations], "shafts": [sh.__dict__ for sh in train.shafts]},
           "natural": nat, "interference": inter, "forced": forced, "stress": stress, "rated_torque_nm": T_rated,
           "model": model, "tnf": tnf, "campbell": res["campbell"], "separation_table": res["separation_table"],
           "steady_state": res["steady_state"], "vsd": res["vsd"], "short_circuit": res["short_circuit"],
           "allowables": res["allowables"], "conclusion": co}
    if tr.synchronous_motor_startup and "motor" in db.driver_type:
        sync = 120 * tr.line_frequency_hz / tr.motor_poles * info["gear_ratio"]
        out["startup"] = startup_transient(train, T_rated, sync, tr.line_frequency_hz, tr.motor_poles, tr.modal_damping_ratio)
        rec.assumptions.append("Synchronous motor start: 1.2 Tr average + 0.5 Tr pulsating at 2 x slip frequency")
    _steps(rec, train, meta, info, res, components, tr, s, N)
    out["trace"] = rec
    return out


def _steps(rec, train, meta, info, res, components, tr, s, N) -> None:
    rec.sym(**{"M_r": ("Rated torque", "N·m"), "P": ("Rated power", "kW"), "N": ("Shaft speed", "rpm"), "I_p": ("Polar mass moment of inertia", "kg·m²"),
               r"\rho": ("Material density", "kg/m³"), "D": ("Outer diameter", "m"), "d": ("Inner diameter", "m"), "L": ("Element length", "m"),
               r"I_{add}": ("Added inertia (impellers, discs, cores)", "kg·m²"), "k": ("Torsional stiffness of one element", "N·m/rad"),
               "K_r": ("Torsional stiffness of the rotor (elements in series)", "N·m/rad"), "G": ("Shear modulus", "Pa"), "n_e": ("Number of shaft elements", "-"),
               "K_c": ("Coupling torsional stiffness", "N·m/rad"), "T_c": ("Rated torque at the coupling", "N·m"), "p_f": ("Shaft penetration factor", "-"),
               "T_{max}": ("Coupling maximum transient torque", "N·m"), "T_{alt}": ("Coupling allowable alternating torque", "N·m"),
               "k_m": ("Linear gear mesh stiffness", "N/m"), "r_b": ("Base radius", "m"), "k_t": ("Torsional mesh stiffness", "N·m/rad"),
               r"\mathbf{K}": ("Stiffness matrix referred to compressor speed", "N·m/rad"), r"\mathbf{J}": ("Inertia matrix referred to compressor speed", "kg·m²"),
               r"\boldsymbol\phi": ("Mode shape", "-"), r"\omega": ("Natural frequency", "rad/s"), "n": ("Speed ratio to the compressor", "-"),
               "n_s": ("Number of stations", "-"), "f_n": ("Torsional natural frequency", "cpm"), "f_e": ("Excitation frequency at rated speed", "cpm"),
               "SM": ("Separation margin", "%"), "E_s": ("Strain energy of an element", "J"), r"\theta": ("Twist across an element", "rad"),
               "S": ("Share of modal strain energy in a shaft line", "-"), r"\tau_e": ("Endurance shear stress with factors", "MPa"),
               "S_e": ("Material endurance limit", "MPa"), "C_s": ("Surface factor", "-"), "C_z": ("Size factor", "-"), "K_t": ("Stress concentration factor", "-"),
               r"\tau_u": ("Ultimate shear stress", "MPa"), r"\sigma_u": ("Tensile strength", "MPa"), r"\tau_m": ("Mean shear stress from rated torque", "MPa"),
               "SF": ("Safety factor", "-"), r"\tau_{all}": ("Allowable alternating shear stress", "MPa"), r"\tau_a": ("Alternating shear stress", "MPa"),
               "T_a": ("Alternating torque", "N·m"), "T_0": ("Exciting torque amplitude", "N·m"), "f_x": ("Exciting torque fraction of rated", "-"),
               r"\zeta": ("Modal damping ratio", "-"), "T_m": ("Mean torque at the coupling", "N·m"), r"\tau_{tot}": ("Peak shear incl. rated torque", "MPa"),
               r"\tau_d": ("Dynamic shear stress", "MPa"), "T_{tot}": ("Peak coupling torque incl. rated torque", "N·m"),
               "M(t)": ("Air-gap torque during the short circuit", "N·m"), "M_k": ("Torque term amplitude", "N·m"), r"\alpha_k": ("Decay rate", "1/s"),
               r"\omega_k": ("Term frequency", "rad/s"), r"\varphi_k": ("Phase", "rad"), "t_{end}": ("Simulated time", "s"), r"\boldsymbol\theta": ("Station twist angles", "rad"),
               r"\mathbf{C}": ("Damping matrix", "N·m·s/rad"), r"\mathbf{T}": ("Exciting torques", "N·m")})
    names = {"Ip kg·m²": "Polar inertia", "K MN·m/rad": "Torsional stiffness", "Max transient kN·m": "Coupling maximum transient torque",
             "Allow. alt. kN·m": "Coupling allowable alternating torque", "Torsional mesh K (bull / pinion)": "Torsional mesh stiffness",
             "TNF cpm": "Torsional natural frequency", "TNF Hz": "Torsional natural frequency in Hz", "Max shear MPa": "Alternating shear stress",
             "Allowable MPa": "Allowable alternating shear stress", "SF": "Coupling Goodman safety factor",
             "Peak incl. rated MPa": "Peak shear stress in the short circuit", "Peak incl. rated kN·m": "Peak coupling torque in the short circuit"}

    def st(label, *a, ui="", **k):
        return rec.step(names.get(label, label), *a, ui=ui or (label if label in names else ""), **k)
    for ln, (lab, rpm) in info["lines"].items():
        st("Rated torque", r"M_r = 9549\,P/N", {"P": (info["rated_power_kw"], "kW"), "N": (rpm, "rpm")}, res["rated_torque_nm"][ln] / 1e3, "kN·m", "M_r", note=lab)
    rows = [c for c in components if c["kind"] != "mesh"]
    for i, c in enumerate(rows):
        r = meta["rotors"][c["name"]]
        if c["kind"] == "rotor":
            el = [train.shafts[e] for e in r["elements"]]
            e0 = el[0] if el else None
            g = {r"\rho": (r["material"]["density_kg_m3"], "kg/m³"), "n_e": len(el)}
            if e0:
                g.update({"D": (e0.diameter, "m"), "d": (e0.inner_diameter, "m"), "L": (e0.length, "m")})
            st("Ip kg·m²", r"I_p = \sum\left(\rho\,\frac{\pi(D^4 - d^4)}{32}\,L + I_{add}\right)", g, c["ip_kgm2"], "kg·m²", "I_p", row=i,
               note=f"{c['name']}: sum over {len(el)} elements; values shown for the first element")
            st("K MN·m/rad", r"K_r = \left(\sum \frac{1}{k}\right)^{-1},\quad k = \frac{G\,\pi(D^4 - d^4)}{32\,L}",
               {"G": (r["material"]["shear_modulus_pa"], "Pa"), "n_e": len(el)}, (c["stiffness_nm_rad"] or 0) / 1e6, "MN·m/rad", "K_r", row=i)
        else:
            T = res["rated_torque_nm"][r["line"]]
            st("Ip kg·m²", r"I_p = 2.5\times10^{-5}\,(1.5\,T_c)^{0.9}", {"T_c": (T, "N·m")}, c["ip_kgm2"], "kg·m²", "I_p", row=i,
               note="Vendor value when given; otherwise this estimate, split half to each hub")
            st("K MN·m/rad", r"\frac{1}{K_c} = \frac{1}{150\,T_c} + \frac{2\,p_f\,D}{G\,\pi D^4/32}", {"T_c": (T, "N·m"), "p_f": tr.coupling_penetration_factor},
               c["stiffness_nm_rad"] / 1e6, "MN·m/rad", "K_c", row=i, note="Vendor value when given; otherwise this estimate (body in series with the shaft inside the hubs)")
            st("Max transient kN·m", r"T_{max} = 5\,T_c", {"T_c": (T, "N·m")}, c["max_transient_torque_nm"] / 1e3, "kN·m", "T_{max}", row=i, note="Vendor value when given")
            st("Allow. alt. kN·m", r"T_{alt} = 0.15\,T_{max}", {"T_{max}": (c["max_transient_torque_nm"], "N·m")}, c["allowable_alternating_torque_nm"] / 1e3,
               "kN·m", "T_{alt}", row=i, note="Vendor value when given")
    gear = info.get("gear")
    if gear:
        st("Torsional mesh K (bull / pinion)", r"k_t = k_m\,r_b^2", {"k_m": (gear["mesh_stiffness_n_mm"] * 1e3, "N/m"),
           "r_b": (gear["pinion_pitch_diameter_mm"] / 2e3 * math.cos(math.radians(gear["transverse_pressure_angle_deg"])), "m")},
           gear["mesh_k_pinion_nm_rad"] / 1e6, "MN·m/rad", "k_t", note=f"Pinion side; bull gear side {gear['mesh_k_bull_nm_rad'] / 1e6:.0f} MN·m/rad")
    st("Train model", r"\mathbf{J}\,\ddot{\boldsymbol\theta} + \mathbf{C}\,\dot{\boldsymbol\theta} + \mathbf{K}\,\boldsymbol\theta = \mathbf{T},\quad J_i = n^2 I_p,\ k_i = n^2 k",
       {"n_s": len(train.stations), "n": 1 / info["gear_ratio"]}, len(train.shafts), "elements", note="Every branch referred to compressor speed by its speed ratio squared")
    for i, m in enumerate(res["modes"]):
        st("TNF cpm", r"\mathbf{K}\boldsymbol\phi = \omega^2\mathbf{J}\boldsymbol\phi,\quad f_n = \frac{60\,\omega}{2\pi}", {"n_s": len(train.stations)},
           m["freq_cpm"], "cpm", "f_n", row=i, note="Generalised symmetric eigenproblem; the rigid-body mode at zero is skipped")
        st("TNF Hz", r"f_n = \frac{\omega}{2\pi}", {r"\omega": (2 * math.pi * m["freq_hz"], "rad/s")}, m["freq_hz"], "Hz", row=i)
        for k, (lab, _) in info["lines"].items():
            st(f"Strain energy share, {lab}", r"S = \frac{\sum_{line} E_s}{\sum E_s},\quad E_s = \tfrac{1}{2}\,k\,\theta^2", {}, 100 * m["line_strain_energy"].get(k, 0.0),
               "%", "S", row=i, note="Gear mesh strain energy is split half to each line", ui=f"SE share {lab}")
    exc = res["excitations"]
    for i, row in enumerate(res["separation_table"]):
        for cell, e in zip(row["cells"], exc):
            st(f"Separation margin to {e['name']}", r"SM = 100\,\frac{f_n - f_e}{f_e}", {"f_n": (row["freq_cpm"], "cpm"), "f_e": (e["f_rated_cpm"], "cpm")}, cell["margin_pct"], "%", "SM", row=i,
               note=("Interferes" + (": dangerous, the exciting line holds enough strain energy" if cell["dangerous"] else ": not dangerous")) if cell["interferes"] else "", ui=e["name"])
    for n, al in res["allowables"].items():
        mat = meta["rotors"][n]["material"]
        st(f"Endurance shear stress, {n}", r"\tau_e = 0.577\,S_e\,C_s\,C_z / K_t", {"S_e": (mat["endurance_mpa"], "MPa"), "C_s": s.allow["Cs"], "C_z": s.allow["Cz"],
           "K_t": s.allow["Kt"]}, al["tau_e_mpa"], "MPa", r"\tau_e")
    if res["steady_state"]:
        ss = res["steady_state"][0]
        st("Exciting torque", r"T_0 = f_x\,M_r", {"f_x": s.steady_frac}, ss["exciting_torque_nm"], "N·m", "T_0",
           note=f"Mode {ss['mode']} excited at resonance by {ss['excitation']}; modal superposition with damping ratio {s.zeta}")
        for i, r in enumerate(ss["rotors"]):
            sh = next(x for x in train.shafts if x.rotor == r["rotor"] and x.kind == "shaft" and x.i + 1 == r["station"])
            Jp = math.pi * (sh.diameter**4 - sh.inner_diameter**4) / (16 * sh.diameter)
            st("Max shear MPa", r"\tau_a = \frac{16\,T_a\,D}{\pi(D^4 - d^4)}", {"T_a": (r["max_shear_mpa"] * 1e6 * Jp, "N·m"), "D": (sh.diameter, "m"),
               "d": (sh.inner_diameter, "m")}, r["max_shear_mpa"], "MPa", r"\tau_a", row=i, note=f"{r['rotor']}, largest element stress at station {r['station']}")
            al = res["allowables"][r["rotor"]]
            st("Allowable MPa", r"\tau_{all} = \tau_e\,(1 - \tau_m/\tau_u)/SF,\quad \tau_u = 0.577\,\sigma_u", {r"\tau_e": (al["tau_e_mpa"], "MPa"),
               r"\tau_m": (r["mean_shear_mpa"], "MPa"), r"\tau_u": (al["tau_u_mpa"], "MPa"), "SF": al["SF"]}, r["allowable_mpa"], "MPa", r"\tau_{all}", row=i)
        for i, c in enumerate(ss["couplings"]):
            g = c["goodman"]
            st("SF", r"SF = \left(\frac{T_m}{T_{max}} + \frac{T_a}{T_{alt}}\right)^{-1}", {"T_m": (g["mean_nm"], "N·m"), "T_a": (c["alt_torque_nm"], "N·m"),
               "T_{max}": (g["line"][1][0], "N·m"), "T_{alt}": (c["allowable_alt_nm"], "N·m")}, c["sf"], "", "SF", row=i,
               note=f"{c['coupling']}: modified Goodman line; mean torque {tr.coupling_goodman_mean_factor:g} × rated")
    for name, v in list(res["short_circuit"].items())[:1]:
        t = v["terms"][0] if v["terms"] else {"mk_nm": 0, "alpha": 0, "omega": 0, "phi": 0}
        st("Short-circuit response", r"M(t) = \sum M_k\,e^{-\alpha_k t}\sin(\omega_k t + \varphi_k)", {"M_k": (t["mk_nm"], "N·m"), r"\alpha_k": (t["alpha"], "1/s"),
           r"\omega_k": (t["omega"], "rad/s"), r"\varphi_k": (t["phi"], "rad"), "t_{end}": (s.sc_duration_s, "s")}, len(v["t_s"]), "time points",
           note=f"{name}: Newmark (average acceleration) on the elastic modes, time step below 1/20 of the highest kept mode period; first term shown")
        for i, r in enumerate(v["rotors"]):
            st("Peak incl. rated MPa", r"\tau_{tot} = \max|\tau_m + \tau_d(t)|", {r"\tau_m": (r["mean_shear_mpa"], "MPa"), r"\tau_d": (r["max_shear_mpa"], "MPa")},
               r["max_total_shear_mpa"], "MPa", r"\tau_{tot}", row=i, note=f"{r['rotor']}; allowable {r['allowable_mpa']:.1f} MPa = {tr.transient_yield_fraction} Sy/√3")
        for i, c in enumerate(v["couplings"]):
            st("Peak incl. rated kN·m", r"T_{tot} = \max|M_r + T_d(t)|", {"T_{max}": (c["allowable_nm"], "N·m")}, c["max_total_torque_nm"] / 1e3, "kN·m", "T_{tot}", row=i,
               note=c["coupling"])
