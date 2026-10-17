"""Unit constants and conversions. All internal calculations use SI."""

R = 8.314462618  # J/(mol K)
G0 = 9.80665  # m/s2
P_ATM = 101325.0  # Pa

# Reference conditions for standard volumetric flow.
NORMAL_T = 273.15  # 0 degC (Nm3)
STANDARD_T = 288.15  # 15 degC (Sm3)


def bar_to_pa(p_bar: float) -> float:
    return p_bar * 1e5


def pa_to_bar(p_pa: float) -> float:
    return p_pa / 1e5


def c_to_k(t_c: float) -> float:
    return t_c + 273.15


def k_to_c(t_k: float) -> float:
    return t_k - 273.15


def rpm_to_rad(n_rpm: float) -> float:
    return n_rpm * 2.0 * 3.141592653589793 / 60.0


def rad_to_rpm(w: float) -> float:
    return w * 60.0 / (2.0 * 3.141592653589793)
