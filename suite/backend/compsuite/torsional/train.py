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


@dataclass
class Shaft:
    name: str
    stiffness: float  # N m / rad at its own speed
    ratio: float = 1.0
    diameter: float = 0.1  # for stress
    endurance_shear_mpa: float | None = None


@dataclass
class Train:
    stations: list[Station]
    shafts: list[Shaft]  # shaft i connects station i and i+1

    def matrices(self):
        n = len(self.stations)
        J = np.diag([s.inertia * s.ratio**2 for s in self.stations])
        K = np.zeros((n, n))
        for i, sh in enumerate(self.shafts):
            k = sh.stiffness * sh.ratio**2
            K[i:i + 2, i:i + 2] += k * np.array([[1, -1], [-1, 1]])
        return J, K


def natural_frequencies(train: Train, n_modes: int = 6) -> dict:
    J, K = train.matrices()
    w2, vec = linalg.eigh(K, J)
    w = np.sqrt(np.clip(w2, 0, None))
    modes = []
    for j in range(1, min(len(w), n_modes + 1)):  # skip rigid-body mode
        v = vec[:, j] / np.max(np.abs(vec[:, j]))
        twist = [float(v[i + 1] - v[i]) for i in range(len(v) - 1)]
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
        for i, sh in enumerate(train.shafts):
            # Dynamic torque at the shaft's own speed.
            T_ref = sh.stiffness * sh.ratio**2 * (q[i + 1] - q[i])
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
    for i, sh in enumerate(train.shafts):
        shaft_t[sh.name] = (sh.stiffness * sh.ratio**2 * (th[i + 1] - th[i]) / sh.ratio).tolist()
    step = max(1, len(t) // 1500)
    return {"t_s": t[::step].tolist(), "speed_rpm": (om[0][::step] * 60 / (2 * math.pi)).tolist(),
            "shaft_torque_nm": {k: v[::step] for k, v in shaft_t.items()},
            "peak_torque_nm": {k: float(np.max(np.abs(v))) for k, v in shaft_t.items()},
            "acceleration_time_s": t_acc}


def build_train(project, rotor: dict, sizing: dict, shaft_material: dict) -> Train:
    """Assemble the default train from the design: driver, coupling(s), optional gearbox, compressor stations."""
    tr = project.train
    P = sizing["driver_rating_kw"] * 1e3  # W
    N_c = sizing["speed_rpm"]
    gr = tr.gear_ratio
    N_d = N_c / gr
    T_c = sizing["shaft_power_kw"] * 1e3 / (N_c * math.pi / 30)
    J_drv = tr.driver_inertia_kgm2 or 0.04 * (P / 1e3) * (1500.0 / N_d) ** 2
    # Flexible disc coupling estimates scaled on 1.5 x rated torque (replace with vendor data).
    T_couple = T_c * 1.5
    k_cpl = tr.coupling_torsional_stiffness_nm_rad or 1500.0 * T_couple
    J_cpl = tr.coupling_inertia_kgm2 or 2.5e-5 * T_couple**0.9
    G = shaft_material["shear_modulus_pa"]

    def driver_shaft(torque, ratio, name, length=0.5):
        d = (16 * torque / (math.pi * 40e6)) ** (1 / 3)  # 40 MPa nominal shear
        return Shaft(name, G * math.pi * d**4 / 32 / length, ratio, d)

    stations = [Station("Driver rotor", J_drv, 1 / gr)]
    shafts = []
    if abs(gr - 1.0) > 1e-6:
        T_ls = T_c * gr
        stations += [Station("LS coupling (driver half)", J_cpl * gr**0.5, 1 / gr),
                     Station("Bull gear", tr.gear_inertia_low_kgm2, 1 / gr),
                     Station("Pinion", tr.gear_inertia_high_kgm2, 1.0)]
        shafts += [driver_shaft(T_ls, 1 / gr, "Driver shaft end"),
                   Shaft("LS coupling", 1500.0 * 1.5 * T_ls, 1 / gr, (16 * T_ls / (math.pi * 40e6)) ** (1 / 3)),
                   Shaft("Gear mesh (ref. pinion)", tr.gear_mesh_stiffness_nm_rad, 1.0, 0.12)]
    else:
        stations.append(Station("Coupling (driver half)", J_cpl, 1.0))
        shafts.append(driver_shaft(T_c, 1.0, "Driver shaft end"))
    stations.append(Station("Coupling (compressor half)", J_cpl, 1.0))
    shafts.append(Shaft("Coupling", k_cpl, 1.0, rotor["coupling_diameter_m"]))
    # Compressor stations: impellers, with shaft segments from the coupling hub.
    prev_z, prev_name = rotor["coupling_hub_z_m"], "coupling hub"
    sections = rotor["sections"]
    for pm in [m for m in rotor["masses"] if m["kind"] == "impeller"]:
        k = _segment_stiffness(sections, prev_z, pm["z_m"], G)
        d = _min_diameter(sections, prev_z, pm["z_m"])
        shafts.append(Shaft(f"Shaft {prev_name} - {pm['label']}", k, 1.0, d))
        stations.append(Station(pm["label"], pm["ip_kgm2"] + _shaft_ip(sections, pm["z_m"], shaft_material), 1.0))
        prev_z, prev_name = pm["z_m"], pm["label"]
    return Train(stations, shafts)


def _segment_stiffness(sections, z0, z1, G):
    flex = 0.0
    for s in sections:
        a, b = max(s["z0_m"], min(z0, z1)), min(s["z1_m"], max(z0, z1))
        if b > a:
            Jp = math.pi / 32 * (s["od_m"] ** 4 - s["id_m"] ** 4)
            flex += (b - a) / (G * Jp)
    return 1.0 / flex if flex > 0 else 1e12


def _min_diameter(sections, z0, z1):
    ds = [s["od_m"] for s in sections if s["z1_m"] > min(z0, z1) and s["z0_m"] < max(z0, z1)]
    return min(ds) if ds else sections[0]["od_m"]


def _shaft_ip(sections, z, mat, width=0.15):
    ip = 0.0
    for s in sections:
        a, b = max(s["z0_m"], z - width / 2), min(s["z1_m"], z + width / 2)
        if b > a:
            m = mat["density_kg_m3"] * math.pi / 4 * (s["od_m"] ** 2 - s["id_m"] ** 2) * (b - a)
            ip += m * (s["od_m"] ** 2 + s["id_m"] ** 2) / 8
    return ip


def torsional_analysis(project, train: Train, sizing: dict, shaft_material: dict) -> dict:
    tr, db, cr = project.train, project.design_basis, project.criteria
    rec = record("torsional", "Lumped-parameter torsional model referred to compressor speed", [tr, db],
                 assumptions=["Driver inertia, coupling stiffness/inertia estimated when not supplied",
                              f"Modal damping ratio {tr.modal_damping_ratio}",
                              "Forced response: 1 % rated torque at 1x compressor speed applied at the coupling",
                              f"Separation margin {cr.torsional_separation_margin:.0%} over min-MCS speed range, first three modes",
                              "VFD harmonic coincidences flagged for forced-response evaluation"],
                 references=["API 617 8th ed. 4.8 / 1.x torsional analysis requirements", "API 684 Tutorial on torsional analysis",
                             "openTorsion (Aalto ARotor) - intended advanced engine"])
    nat = natural_frequencies(train)
    N = sizing["speed_rpm"]
    rng = (N * db.min_operating_speed_pct / 100, N * db.max_continuous_speed_pct / 100)
    inter = interference(train, nat, rng, rng[1], tr.gear_ratio, tr.line_frequency_hz, db.driver_type, tr.motor_poles,
                         cr.torsional_separation_margin)
    for c in inter["checks"]:
        if not c["pass"] and "VFD" not in c["excitation"]:
            rec.warn(f"Torsional mode {c['mode_hz']:.1f} Hz within {cr.torsional_separation_margin:.0%} of "
                     f"{c['excitation']} band {c['band_hz'][0]:.1f}-{c['band_hz'][1]:.1f} Hz")
    T_rated = sizing["shaft_power_kw"] * 1e3 / (N * math.pi / 30)
    coupling_idx = next(i for i, s in enumerate(train.stations) if s.name == "Coupling (compressor half)")
    speeds = np.linspace(0.05 * N, 1.2 * N, 300)
    forced = forced_response(train, 6, speeds, 0.01 * T_rated, coupling_idx, 1.0, tr.modal_damping_ratio)
    stress = []
    Se_shear = 0.577 * shaft_material["endurance_mpa"]
    for sh in train.shafts:
        Tdyn = max(forced["dynamic_torque_nm"][sh.name])
        T_mean = T_rated / sh.ratio
        Jp = math.pi * sh.diameter**4 / 32
        tau_m = T_mean * sh.diameter / 2 / Jp / 1e6
        tau_a = Tdyn * sh.diameter / 2 / Jp / 1e6
        sf = 1 / (tau_a / Se_shear + tau_m / (0.577 * shaft_material["uts_mpa"])) if (tau_a + tau_m) > 0 else float("inf")
        stress.append({"shaft": sh.name, "diameter_mm": sh.diameter * 1e3, "mean_torque_nm": T_mean,
                       "max_dynamic_torque_nm": Tdyn, "mean_shear_mpa": tau_m, "alternating_shear_mpa": tau_a,
                       "goodman_safety": sf})
    out = {"train": {"stations": [s.__dict__ for s in train.stations], "shafts": [s.__dict__ for s in train.shafts]},
           "natural": nat, "interference": inter, "forced": forced, "stress": stress, "rated_torque_nm": T_rated}
    if tr.synchronous_motor_startup and "motor" in db.driver_type:
        sync = 120 * tr.line_frequency_hz / tr.motor_poles * tr.gear_ratio
        out["startup"] = startup_transient(train, T_rated, sync, tr.line_frequency_hz, tr.motor_poles, tr.modal_damping_ratio)
        rec.assumptions.append("Synchronous motor start: 1.2 Tr average + 0.5 Tr pulsating at 2 x slip frequency")
    out["trace"] = rec
    return out
