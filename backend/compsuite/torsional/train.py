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
    out["trace"] = rec
    return out
