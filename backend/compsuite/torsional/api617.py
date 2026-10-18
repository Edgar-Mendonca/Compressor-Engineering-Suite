"""Train torsional analysis in the form of an API 617 / API 684 / API 671 vendor report.

Model: shaft finite elements (massless torsion springs, inertia lumped at the
nodes) for each rotor, couplings as springs with half the coupling inertia at
each hub, and gear meshes as springs acting on the pitch-line displacement.
Every DOF is referred to one reference speed (compressor speed): J and k of a
branch at speed ratio r (own / reference) are multiplied by r^2. Counter-
rotating shafts carry a direction sign, so physical mode shapes show opposite
signs across a gear mesh and the pinion amplitude is ~ratio x the bull gear's.

Analyses (all results at the components' own speeds):
  * undamped TNFs, normalised physical mode shapes, strain / kinetic energy
    shares per component ("main vibrating rotors");
  * Campbell data and the separation table (mode vs 1X/2X of each shaft line
    and 1X/2X line frequency) with the API 617 margin over the operating range;
    an interfering mode is "dangerous" when the excitation's shaft line holds a
    significant share of the modal strain energy;
  * steady-state resonant response (exciting torque a fraction of rated torque
    M = 9549 P / N, modal damping zeta) -> alternating shear stress per rotor vs
    the allowable, coupling alternating torque on the API 671 modified Goodman
    diagram (SF = OB / OA);
  * VSD harmonics 6n+-1 of the motor electrical frequency over the acceleration
    schedule (Campbell crossings, swept response for significant harmonics);
  * short-circuit transients M(t) = sum Mk exp(-a_k t) sin(w_k t + phi_k) at
    the motor core, Newmark integration in modal coordinates.

Allowable shear stresses (documented choice, see shear_allowables):
  steady / fatigue  tau_e = 0.577 Se Cs Cz / Kt,
                    tau_allow = tau_e (1 - tau_m / (0.577 UTS)) / SF
  transient         tau_allow,tr = 0.7 Sy / sqrt(3)  (peak, once-per-life fault torque)
"""

from __future__ import annotations

import math
from dataclasses import dataclass, field

import numpy as np
from scipy import linalg, signal

from compsuite.torsional.train import Shaft, Station, Train


# ----------------------------------------------------------------- model parts
@dataclass
class Element:
    length_m: float
    od_m: float
    id_m: float = 0.0
    od_mass_m: float | None = None
    id_mass_m: float | None = None
    added_ip: float = 0.0  # kg m2 at the element's start station
    core: bool = False  # start station belongs to the motor core (electrical torque)
    mesh: bool = False  # start station is the gear mesh point
    excite: bool = False  # start station takes mechanical excitation (impellers)
    label: str = ""


@dataclass
class RotorPart:
    name: str
    elements: list[Element]
    ratio: float  # own speed / reference speed
    line: int  # shaft line (1 = driver / low speed, 2 = high speed)
    material: dict  # shear_modulus_pa, density_kg_m3, yield_mpa, uts_mpa, endurance_mpa
    direction: int = 1
    end_ip: float = 0.0  # extra inertia at the last station


@dataclass
class CouplingPart:
    name: str
    ip: float
    stiffness: float
    ratio: float
    line: int
    max_transient_nm: float
    alt_allow_nm: float


@dataclass
class MeshPart:
    name: str
    k_n_m: float  # linear mesh stiffness along the line of action
    r_base_gear_m: float
    r_base_pinion_m: float
    gear: str  # rotor names
    pinion: str


def shaft_k(G, L, od, id_=0.0):
    return G * math.pi * (od**4 - id_**4) / 32 / L


def subdivide(elements: list[Element], max_len: float) -> list[Element]:
    """Split long elements (lumped-inertia discretisation error); flags and added inertia stay at the first piece."""
    out = []
    for e in elements:
        n = max(1, math.ceil(e.length_m / max_len - 1e-9)) if max_len else 1
        for k in range(n):
            out.append(Element(e.length_m / n, e.od_m, e.id_m, e.od_mass_m, e.id_mass_m, e.added_ip if k == 0 else 0.0,
                               e.core and k == 0, e.mesh and k == 0, e.excite and k == 0, e.label))
    return out


def build(parts: list, meshes: list[MeshPart] | None = None, max_len: float = 0.0) -> tuple[Train, dict]:
    """Assemble rotors and couplings given in shaft-line order (coupling between
    consecutive rotors), plus gear meshes between named rotors. Elements longer
    than max_len (m, 0 = keep the given stations, as in a vendor model) are subdivided."""
    st: list[Station] = []
    sh: list[Shaft] = []
    meta = {"rotors": {}, "nodes": [], "stations": []}
    prev_end = None
    pending_cpl = None
    for p in parts:
        if isinstance(p, CouplingPart):
            pending_cpl = p
            continue
        m, base = p.material, len(st)
        p = RotorPart(p.name, subdivide(p.elements, max_len), p.ratio, p.line, p.material, p.direction, p.end_ip)
        G, rho = m["shear_modulus_pa"], m["density_kg_m3"]
        n = len(p.elements) + 1
        ip = np.zeros(n)
        x = np.zeros(n)
        info = {"first": base, "last": base + n - 1, "core": [], "mesh": None, "excite": [], "elements": []}
        for k, e in enumerate(p.elements):
            odm = e.od_mass_m if e.od_mass_m is not None else e.od_m
            idm = e.id_mass_m if e.id_mass_m is not None else e.id_m
            je = rho * math.pi * (odm**4 - idm**4) / 32 * e.length_m
            ip[k] += je / 2 + e.added_ip
            ip[k + 1] += je / 2
            x[k + 1] = x[k] + e.length_m
            if e.core:
                info["core"].append(base + k)
            if e.mesh:
                info["mesh"] = base + k
            if e.excite:
                info["excite"].append(base + k)
            if e.length_m > 0:
                sh.append(Shaft(f"{p.name} el {k + 1}", shaft_k(G, e.length_m, e.od_m, e.id_m), p.ratio, e.od_m,
                                rotor=p.name, kind="shaft", inner_diameter=e.id_m, length=e.length_m, i=base + k, j=base + k + 1))
                info["elements"].append(len(sh) - 1)
        ip[-1] += p.end_ip
        for k in range(n):
            st.append(Station(f"{p.name} {k + 1}", float(ip[k]), p.ratio, rotor=p.name, x_m=float(x[k]), direction=p.direction))
        if pending_cpl is not None and prev_end is not None:
            c = pending_cpl
            st[prev_end].inertia += c.ip / 2
            st[base].inertia += c.ip / 2
            sh.append(Shaft(c.name, c.stiffness, c.ratio, 0.0, rotor=c.name, kind="coupling", i=prev_end, j=base))
            meta["rotors"][c.name] = {"kind": "coupling", "line": c.line, "elements": [len(sh) - 1], "ip": c.ip,
                                      "stiffness": c.stiffness, "max_transient_nm": c.max_transient_nm,
                                      "alt_allow_nm": c.alt_allow_nm, "ratio": c.ratio}
        pending_cpl = None
        info.update(kind="rotor", line=p.line, ratio=p.ratio, material=m, direction=p.direction,
                    ip_own=float(ip.sum()), length_m=float(x[-1]))
        flex = sum(1 / sh[i].stiffness for i in info["elements"])
        info["stiffness_own"] = 1 / flex if flex > 0 else None
        meta["rotors"][p.name] = info
        prev_end = base + n - 1
    for g in meshes or []:
        gi, pi = meta["rotors"][g.gear], meta["rotors"][g.pinion]
        a = gi["mesh"] if gi["mesh"] is not None else gi["last"]
        b = pi["mesh"] if pi["mesh"] is not None else pi["first"]
        sh.append(Shaft(g.name, g.k_n_m * g.r_base_pinion_m**2, pi["ratio"], 0.0, rotor=g.name, kind="mesh", i=a, j=b))
        meta["rotors"][g.name] = {"kind": "mesh", "line": 0, "elements": [len(sh) - 1], "ratio": pi["ratio"],
                                  "k_n_mm": g.k_n_m / 1e3,
                                  "k_gear_nm_rad": g.k_n_m * g.r_base_gear_m**2, "k_pinion_nm_rad": g.k_n_m * g.r_base_pinion_m**2}
    train = Train(st, sh)
    meta["stations"] = [{"station": i + 1, "rotor": s.rotor, "x_mm": s.x_m * 1e3, "ip_kgm2": s.inertia,
                         "speed_ratio": s.ratio} for i, s in enumerate(st)]
    for i, s in enumerate(sh):
        if s.kind == "shaft":
            meta["stations"][s.i].update(length_mm=s.length * 1e3, od_mm=s.diameter * 1e3, id_mm=s.inner_diameter * 1e3,
                                         k_nm_rad=s.stiffness)
    return train, meta


def incidence(train: Train) -> np.ndarray:
    """G: element torque at own speed = G @ theta_ref (k r (theta_j - theta_i))."""
    G = np.zeros((len(train.shafts), len(train.stations)))
    for e, s in enumerate(train.shafts):
        G[e, s.i] -= s.stiffness * s.ratio
        G[e, s.j] += s.stiffness * s.ratio
    return G


def stress_factor(train: Train) -> np.ndarray:
    """tau = T * c (Pa per N m) for shaft elements; 0 for couplings / meshes."""
    c = np.zeros(len(train.shafts))
    for e, s in enumerate(train.shafts):
        if s.kind == "shaft" and s.diameter > 0:
            c[e] = 16 * s.diameter / (math.pi * (s.diameter**4 - s.inner_diameter**4))
    return c


# --------------------------------------------------------------------- modal
def modes(train: Train, meta: dict, n_modes: int = 12) -> dict:
    J, K = train.matrices()
    w2, phi = linalg.eigh(K, J)
    w = np.sqrt(np.clip(w2, 0, None))
    G = incidence(train)
    k_ref = np.array([s.stiffness * s.ratio**2 for s in train.shafts])
    sign_r = np.array([s.direction * s.ratio for s in train.stations])
    Jd = np.diag(J)
    comps = list(meta["rotors"])
    out = []
    for j in range(1, min(len(w), n_modes + 1)):
        v = phi[:, j]
        twist = np.array([v[s.j] - v[s.i] for s in train.shafts])
        se = 0.5 * k_ref * twist**2
        ke = 0.5 * Jd * v**2
        se_c = {c: float(se[meta["rotors"][c]["elements"]].sum() / se.sum()) for c in comps}
        ke_c = {c: float(sum(ke[k] for k, s in enumerate(train.stations) if s.rotor == c) / ke.sum()) for c in comps}
        lines = {1: 0.0, 2: 0.0}
        for c in comps:
            ln = meta["rotors"][c]["line"]
            for L in ([1, 2] if ln == 0 else [ln]):
                lines[L] = lines.get(L, 0.0) + se_c[c] / (2 if ln == 0 else 1)
        phys = sign_r * v
        phys = phys / np.max(np.abs(phys))
        main = [c for c, f in sorted(se_c.items(), key=lambda t: -t[1]) if f >= 0.15] or [max(se_c, key=se_c.get)]
        out.append({"mode": j, "freq_hz": float(w[j] / (2 * math.pi)), "freq_cpm": float(w[j] * 30 / math.pi),
                    "shape_ref": (v / np.max(np.abs(v))).tolist(), "shape": phys.tolist(),
                    "strain_energy": se_c, "kinetic_energy": ke_c, "line_strain_energy": lines, "main": main,
                    "mode_torque_per_rad": (G @ v).tolist()})
    return {"modes": out, "w": w, "phi": phi, "J": J, "K": K, "G": G}


# ------------------------------------------------------------ interference
def excitation_list(lines: dict, electric: bool, line_hz: float) -> list[dict]:
    """lines: {line: (label, rated_rpm)}. Proportional excitations have 'order'
    and 'rpm'; constant ones a fixed frequency."""
    ex = []
    for ln, (lab, rpm) in lines.items():
        for k in (1, 2):
            ex.append({"name": f"{k}X {lab}", "line": ln, "order": k, "rpm": rpm, "f_rated_cpm": k * rpm})
    if electric:
        for k in (1, 2):
            ex.append({"name": f"{k}X line frequency", "line": 1, "order": None, "rpm": None, "f_rated_cpm": k * line_hz * 60})
    return ex


def separation_table(md: dict, exc: list[dict], lo: float, hi: float, margin: float, danger_share: float) -> list[dict]:
    rows = []
    for m in md["modes"]:
        fn = m["freq_cpm"]
        cells = []
        for e in exc:
            f0 = e["f_rated_cpm"]
            mg = (fn - f0) / f0
            if e["order"] is not None:
                band = (lo * f0, hi * f0)
                inter = lo * (1 - margin) <= fn / f0 <= hi * (1 + margin)
                crossing = fn / e["order"] / e["rpm"] * 100
            else:
                band = (f0, f0)
                inter = abs(mg) < margin
                crossing = None
            sep = 0.0 if band[0] <= fn <= band[1] else min(abs(fn - band[0]) / band[0], abs(fn - band[1]) / band[1])
            share = m["line_strain_energy"].get(e["line"], 0.0)
            cells.append({"excitation": e["name"], "margin_pct": mg * 100, "separation": sep, "interferes": inter,
                          "crossing_pct": crossing, "line_share": share, "dangerous": inter and share >= danger_share})
        rows.append({"mode": m["mode"], "freq_cpm": fn, "freq_hz": m["freq_hz"], "main": m["main"], "cells": cells})
    return rows


# ------------------------------------------------------------- allowables
def shear_allowables(mat: dict, Cs=0.8, Cz=0.75, Kt=2.0, SF=2.0, tr_frac=0.7) -> dict:
    tau_e = 0.577 * mat["endurance_mpa"] * Cs * Cz / Kt
    return {"tau_e_mpa": tau_e, "tau_u_mpa": 0.577 * mat["uts_mpa"], "SF": SF,
            "transient_mpa": tr_frac * mat["yield_mpa"] / math.sqrt(3)}


def steady_allowable(al: dict, tau_m: float) -> float:
    return max(al["tau_e_mpa"] * (1 - tau_m / al["tau_u_mpa"]) / al["SF"], 0.0)


def goodman(t_mean: float, t_alt: float, t_alt_allow: float, t_max: float) -> dict:
    """API 671 modified Goodman: line from (0, T_alt_allow) to (T_max, 0);
    A = operating point, B = ray OA extended to the line, SF = OB / OA."""
    d = t_mean / t_max + t_alt / t_alt_allow
    sf = 1 / d if d > 0 else float("inf")
    return {"mean_nm": t_mean, "alt_nm": t_alt, "sf": sf, "line": [[0.0, t_alt_allow], [t_max, 0.0]],
            "A": [t_mean, t_alt], "B": [t_mean * sf, t_alt * sf] if math.isfinite(sf) else None}


# ------------------------------------------------------- harmonic response
def harmonic(md: dict, F: np.ndarray, w: float, zeta: float) -> np.ndarray:
    """Complex element torque amplitudes (own speed) for torque vector F (referred) at w rad/s."""
    wn, phi = md["w"], md["phi"]
    q = (phi.T @ F) / (wn**2 - w**2 + 2j * zeta * wn * w)
    return md["G"] @ (phi @ q)


def force_vector(train: Train, nodes: list[int], torque: float) -> np.ndarray:
    F = np.zeros(len(train.stations))
    for n in nodes:
        F[n] += torque / len(nodes) * train.stations[n].ratio
    return F


def evaluate_torques(T_alt: np.ndarray, meta: dict, train: Train, c: np.ndarray, rated: dict, al: dict, cpl: dict) -> dict:
    """Per rotor: max alternating shear vs allowable; per coupling: Goodman."""
    rot, cps = [], []
    for name, r in meta["rotors"].items():
        if r["kind"] == "rotor" and r["elements"]:
            el = r["elements"]
            tau = np.abs(T_alt[el]) * c[el] / 1e6
            k = int(np.argmax(tau))
            e = el[k]
            tm = rated[r["line"]] * c[e] / 1e6
            allow = steady_allowable(al[name], tm)
            rot.append({"rotor": name, "max_shear_mpa": float(tau[k]), "allowable_mpa": allow, "mean_shear_mpa": tm,
                        "station": train.shafts[e].i + 1, "diameter_mm": train.shafts[e].diameter * 1e3,
                        "pass": bool(tau[k] <= allow)})
        elif r["kind"] == "coupling":
            ta = float(abs(T_alt[r["elements"][0]]))
            g = goodman(cpl["mean_factor"] * rated[r["line"]], ta, r["alt_allow_nm"], r["max_transient_nm"])
            cps.append({"coupling": name, "alt_torque_nm": ta, "allowable_alt_nm": r["alt_allow_nm"], "goodman": g,
                        "sf": g["sf"], "sf_min": cpl["sf_min"], "pass": bool(g["sf"] >= cpl["sf_min"])})
    return {"rotors": rot, "couplings": cps}


# ---------------------------------------------------------- short circuit
def sc_torque(t: np.ndarray, terms: list[dict]) -> np.ndarray:
    return sum(tm["mk_nm"] * np.exp(-tm["alpha"] * t) * np.sin(tm["omega"] * t + tm["phi"]) for tm in terms)


def newmark_modal(md: dict, F_shape: np.ndarray, torque_fn, t_end: float, zeta: float, f_exc_max: float,
                  n_min: int = 12) -> tuple[np.ndarray, np.ndarray]:
    """Average-acceleration Newmark on decoupled elastic modes; returns t and
    element torques (n_el x n_t). Modes above max(10 f_exc, 1.2 f_n_min) are
    truncated (quasi-static contribution of very stiff modes neglected)."""
    wn, phi = md["w"], md["phi"]
    f = wn / (2 * math.pi)
    f_cut = max(10 * f_exc_max, 1.2 * f[min(n_min, len(f) - 1)])
    keep = np.where((f > 1e-6 * f.max()) & (f <= f_cut))[0]
    wk, pk = wn[keep], phi[:, keep]
    dt = min(1 / (20 * f[keep].max()), 1 / (40 * max(f_exc_max, 1.0)))
    nt = int(math.ceil(t_end / dt)) + 1
    t = np.linspace(0, t_end, nt)
    dt = t[1] - t[0]
    p = torque_fn(t)
    # Average-acceleration Newmark == trapezoidal rule == bilinear (Tustin) map of 1 / (s^2 + 2 zeta w s + w^2):
    # each mode is an IIR filter of the excitation (zero initial state).
    q = np.empty((len(keep), nt))
    for m, (wm, fm) in enumerate(zip(wk, pk.T @ F_shape)):
        K, c = 2 / dt, 2 * zeta * wm
        a = np.array([K**2 + c * K + wm**2, 2 * wm**2 - 2 * K**2, K**2 - c * K + wm**2])
        q[m] = signal.lfilter(fm * np.array([1.0, 2.0, 1.0]) / a[0], a / a[0], p)
    return t, md["G"] @ (pk @ q)


# ------------------------------------------------------------- full analysis
@dataclass
class Settings:
    rated_power_kw: float
    lines: dict  # {line: (label, rated_rpm)}
    lo: float = 0.70
    hi: float = 1.05
    margin: float = 0.10
    zeta: float = 0.01
    steady_frac: float = 0.01
    electric: bool = True
    vfd: bool = True
    line_hz: float = 50.0
    poles: int = 4
    harmonics: dict = field(default_factory=dict)  # order -> % of rated torque
    accel_time_s: float = 60.0
    sc_cases: dict = field(default_factory=dict)  # name -> list of terms (mk_nm, alpha, omega, phi)
    sc_duration_s: float = 1.0
    allow: dict = field(default_factory=dict)  # Cs, Cz, Kt, SF, tr_frac
    cpl_mean_factor: float = 1.1
    cpl_sf_min: float = 1.25
    danger_share: float = 0.10
    n_modes: int = 12
    sc_clear_s: float | None = None   # protection clearing time: excitation removed after it
    sc_events: int = 1000             # events over the life (cumulative fatigue)


def miner_damage(series: np.ndarray, tau_e: float, tau_u: float, events: int) -> dict:
    """Cumulative damage of the decaying transient: each response peak above the endurance shear is one cycle,
    life from a Basquin line through (1e3 cycles, 0.9 tau_u) and (1e6 cycles, tau_e)."""
    a = np.abs(np.asarray(series))
    pk = a[1:-1][(a[1:-1] >= a[:-2]) & (a[1:-1] >= a[2:])] if len(a) > 2 else a
    pk = pk[pk > tau_e]
    if not len(pk) or tau_u <= tau_e:
        return {"cycles_above_endurance": 0, "damage_per_event": 0.0, "damage": 0.0, "infinite_life": True}
    b = math.log10(0.9 * tau_u / tau_e) / 3.0
    n = 1e6 * (tau_e / np.minimum(pk, 0.9 * tau_u)) ** (1 / b)
    d1 = float(np.sum(1 / n))
    return {"cycles_above_endurance": int(len(pk)), "damage_per_event": d1, "damage": d1 * events, "infinite_life": False}


def _decimate(a, n=800):
    step = max(1, len(a) // n)
    return np.asarray(a)[::step]


def analyse(train: Train, meta: dict, s: Settings) -> dict:
    md = modes(train, meta, s.n_modes)
    G, c = md["G"], stress_factor(train)
    rated = {ln: 9549 * s.rated_power_kw / rpm for ln, (_, rpm) in s.lines.items()}  # N m at each line's speed
    al = {n: shear_allowables(r["material"], **s.allow) for n, r in meta["rotors"].items() if r["kind"] == "rotor"}
    cpl = {"mean_factor": s.cpl_mean_factor, "sf_min": s.cpl_sf_min}
    rotors = meta["rotors"]
    motor = next((n for n, r in rotors.items() if r["kind"] == "rotor" and r["core"]), None)
    # Mechanical 1X / 2X excitation of a shaft line acts at its gear mesh, else at its coupling hubs.
    line_nodes = {}
    for ln in s.lines:
        nodes = [r["mesh"] for r in rotors.values() if r["kind"] == "rotor" and r["line"] == ln and r["mesh"] is not None]
        if not nodes:
            nodes = sorted({k for r in rotors.values() if r["kind"] == "coupling" and r["line"] == ln
                            for k in (train.shafts[r["elements"][0]].i, train.shafts[r["elements"][0]].j)})
        line_nodes[ln] = nodes or [0]
    core_nodes = rotors[motor]["core"] if motor else line_nodes[1]

    # Campbell + separation table
    exc = excitation_list(s.lines, s.electric, s.line_hz)
    table = separation_table(md, exc, s.lo, s.hi, s.margin, s.danger_share)
    pct = np.linspace(0, 120, 121)
    campbell = {"speed_pct": pct.tolist(), "tnf_cpm": [m["freq_cpm"] for m in md["modes"]],
                "excitations": [{"name": e["name"], "line": e["line"],
                                 "cpm": (pct / 100 * e["f_rated_cpm"]).tolist() if e["order"] else [e["f_rated_cpm"]] * len(pct),
                                 "band_cpm": None if e["order"] else [0.9 * e["f_rated_cpm"], 1.1 * e["f_rated_cpm"]]}
                                for e in exc],
                "operating_pct": [s.lo * 100, s.hi * 100],
                "margin_pct": [s.lo * (1 - s.margin) * 100, s.hi * (1 + s.margin) * 100]}

    # Steady-state resonant response for every interfering mode / excitation pair
    steady = []
    for row, m in zip(table, md["modes"]):
        for cell, e in zip(row["cells"], exc):
            if not cell["interferes"]:
                continue
            nodes = core_nodes if e["order"] is None else line_nodes[e["line"]]
            T0 = s.steady_frac * rated[e["line"]]
            Ta = np.abs(harmonic(md, force_vector(train, nodes, T0), 2 * math.pi * m["freq_hz"], s.zeta))
            ev = evaluate_torques(Ta, meta, train, c, rated, al, cpl)
            steady.append({"mode": m["mode"], "freq_cpm": m["freq_cpm"], "excitation": e["name"],
                           "dangerous": cell["dangerous"], "exciting_torque_nm": T0,
                           "element_shear_mpa": (Ta * c / 1e6).tolist(), **ev,
                           "pass": all(r["pass"] for r in ev["rotors"] + ev["couplings"])})

    # VSD harmonics over the acceleration schedule
    vsd = None
    if s.vfd and motor:
        N_m = s.lines[1][1]
        f_el = lambda p: p / 100 * N_m * s.poles / 120  # Hz at % speed
        orders = sorted(int(h) for h in s.harmonics)
        lines_h = [{"order": h, "pct": s.harmonics.get(h, s.harmonics.get(str(h), 0.0)),
                    "cpm": (h * f_el(pct) * 60).tolist()} for h in orders]
        crossings = []
        for m in md["modes"]:
            for lh in lines_h:
                p_cross = m["freq_hz"] / (lh["order"] * f_el(1.0)) * 1.0
                if p_cross <= s.hi * 100 * 1.2:
                    crossings.append({"mode": m["mode"], "freq_cpm": m["freq_cpm"], "order": lh["order"],
                                      "speed_pct": p_cross, "content_pct": lh["pct"],
                                      "in_operating_range": bool(s.lo * 100 <= p_cross <= s.hi * 100),
                                      "evaluated": lh["pct"] > s.steady_frac * 100})
        responses = []
        F1 = force_vector(train, core_nodes, 1.0)
        for lh in lines_h:
            if lh["pct"] <= s.steady_frac * 100:
                continue
            sp = np.unique(np.concatenate([np.linspace(1, s.hi * 100, 300),
                                           [x["speed_pct"] for x in crossings if x["order"] == lh["order"] and x["speed_pct"] <= s.hi * 100]]))
            T0 = lh["pct"] / 100 * rated[1]
            Tm = np.array([np.abs(harmonic(md, F1 * T0, 2 * math.pi * lh["order"] * f_el(p), s.zeta)) for p in sp])
            # Pass / fail on continuous operation (min - MCS); crossings below minimum speed are
            # transient passages during acceleration, where this steady-state amplitude is conservative.
            op = (sp >= s.lo * 100) & (sp <= s.hi * 100)
            ev = evaluate_torques(Tm[op].max(axis=0), meta, train, c, rated, al, cpl)
            acc = evaluate_torques(Tm.max(axis=0), meta, train, c, rated, al, cpl)
            curves = {n: (Tm[:, r["elements"]] * c[r["elements"]] / 1e6).max(axis=1).tolist()
                      for n, r in rotors.items() if r["kind"] == "rotor" and r["elements"]}
            curves.update({n: Tm[:, r["elements"][0]].tolist() for n, r in rotors.items() if r["kind"] == "coupling"})
            responses.append({"order": lh["order"], "content_pct": lh["pct"], "exciting_torque_nm": T0, "speed_pct": sp.tolist(),
                              "curves": curves, **ev,
                              "acceleration_envelope": {"rotors": acc["rotors"], "couplings": acc["couplings"]}, "pass": all(r["pass"] for r in ev["rotors"] + ev["couplings"])})
        vsd = {"electrical_hz_rated": f_el(100), "lines": lines_h, "crossings": crossings, "responses": responses,
               "schedule": {"t_s": [0.0, s.accel_time_s * s.hi], "speed_pct": [0.0, s.hi * 100]},
               "pass": all(r["pass"] for r in responses)}

    # Short-circuit transients at the motor core
    sc = {}
    if s.electric and motor and s.sc_cases:
        F1 = force_vector(train, core_nodes, 1.0)
        for name, terms in s.sc_cases.items():
            clr = s.sc_clear_s
            fn = lambda t, terms=terms: sc_torque(t, terms) * (np.asarray(t) <= clr if clr else 1.0)
            f_exc = max([tm["omega"] / (2 * math.pi) for tm in terms] + [1.0])
            t, Te = newmark_modal(md, F1, fn, s.sc_duration_s, s.zeta, f_exc)
            rows, cps, series = [], [], {}
            for n, r in rotors.items():
                if r["kind"] == "rotor" and r["elements"]:
                    el = r["elements"]
                    tau = Te[el] * c[el][:, None] / 1e6
                    k = int(np.argmax(np.abs(tau).max(axis=1)))
                    e, tk = el[k], tau[k]
                    tm = rated[r["line"]] * c[e] / 1e6
                    tot = float(max(abs(tm + tk.max()), abs(tm + tk.min())))
                    t_alt = float((tk.max() - tk.min()) / 2)
                    tau_u = al[n].get("tau_u_mpa") or al[n]["transient_mpa"] / 0.7 * 1.6
                    mn = miner_damage(tk, al[n]["tau_e_mpa"], tau_u, s.sc_events)
                    rows.append({"rotor": n, "max_shear_mpa": float(np.abs(tk).max()), "max_total_shear_mpa": tot, "miner": mn,
                                 "mean_shear_mpa": tm, "alternating_shear_mpa": t_alt, "allowable_mpa": al[n]["transient_mpa"],
                                 "endurance_shear_mpa": al[n]["tau_e_mpa"], "station": train.shafts[e].i + 1,
                                 "pass": tot <= al[n]["transient_mpa"], "infinite_life": t_alt < al[n]["tau_e_mpa"]})
                    series[n] = _decimate(tk).tolist()
                elif r["kind"] == "coupling":
                    tq = Te[r["elements"][0]]
                    tm = rated[r["line"]]
                    tot = float(max(abs(tm + tq.max()), abs(tm + tq.min())))
                    cps.append({"coupling": n, "max_torque_nm": float(np.abs(tq).max()), "max_total_torque_nm": tot,
                                "min_total_torque_nm": float(tm + tq.min()), "torque_reversal": bool(tm + tq.min() < 0),
                                "allowable_nm": r["max_transient_nm"], "pass": tot <= r["max_transient_nm"]})
                    series[n] = _decimate(tq).tolist()
            sc[name] = {"terms": terms, "t_s": _decimate(t).tolist(), "excitation_nm": _decimate(fn(t)).tolist(),
                        "series": series, "rotors": rows, "couplings": cps,
                        "pass": all(x["pass"] for x in rows + cps), "infinite_life": all(x["infinite_life"] for x in rows),
                        "clearing_time_s": s.sc_clear_s, "events": s.sc_events, "miner_damage": max([x["miner"]["damage"] for x in rows] or [0.0]),
                        "torque_reversal": any(x["torque_reversal"] for x in cps)}

    inter_pairs = [(r["mode"], x["excitation"], x["dangerous"]) for r in table for x in r["cells"] if x["interferes"]]
    concl = {"interferences": len(inter_pairs), "dangerous": sum(1 for p in inter_pairs if p[2]),
             "steady_state_pass": all(x["pass"] for x in steady), "vsd_pass": vsd["pass"] if vsd else None,
             "short_circuit_pass": all(v["pass"] for v in sc.values()) if sc else None,
             "infinite_life": all(v["infinite_life"] for v in sc.values()) if sc else None}
    concl["acceptable"] = bool(concl["steady_state_pass"] and concl["vsd_pass"] is not False
                               and concl["short_circuit_pass"] is not False)
    return {"md": md, "modes": md["modes"], "rated_torque_nm": rated, "allowables": al, "excitations": exc,
            "separation_table": table, "campbell": campbell, "steady_state": steady, "vsd": vsd,
            "short_circuit": sc, "conclusion": concl}
