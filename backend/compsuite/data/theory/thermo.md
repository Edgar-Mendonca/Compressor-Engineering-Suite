# Thermodynamics and compression

## What this module does
It finds the gas properties at every point of the compression (density, compressibility, enthalpy, entropy, speed of sound) and works out the head, discharge temperature and power for each operating case.

## Gas properties
The gas is a mixture described by its mole fractions. Properties come from a cubic equation of state (Peng–Robinson) or, where selected, from CoolProp's reference equations.

$$P = \frac{R_u T}{V_m - b} - \frac{a\,\alpha(T)}{V_m^2 + 2bV_m - b^2}$$

The compressibility factor $Z = P V_m / (R_u T)$ says how far the gas is from ideal. The density follows from it:

$$\rho = \frac{P\,M}{Z\,R_u\,T}$$

## Polytropic compression
A real compressor stage is not reversible. The polytropic model spreads the losses evenly along the path: each small pressure rise $dP$ needs an enthalpy rise

$$dh = \frac{v\,dP}{\eta_p}$$

The **polytropic head** is the useful work per kilogram:

$$H_p = \int_{P_1}^{P_2} v\,dP$$

The app integrates this in 40 equal steps of $\ln P$, finding $v$ from the equation of state at each step. This is exact for the chosen efficiency and needs no average $Z$ or $k$.

The **enthalpy rise** is the work the shaft puts into the gas: $\Delta h = H_p/\eta_p$. The discharge temperature is the temperature at which $h(T_2, P_2) = h_1 + \Delta h$.

## Schultz check
The standard hand method for test evaluation uses the end states only:

$$n = \frac{\ln(P_2/P_1)}{\ln(v_1/v_2)}, \qquad H_p = f\,\frac{n}{n-1}\,(P_2 v_2 - P_1 v_1)$$

The factor $f$ (close to 1) corrects for the path not being a true polytrope. The app shows both results; if they differ by more than one point of efficiency the gas is strongly non-ideal and the integrated value should be used.

## Isentropic values
The isentropic (reversible, adiabatic) discharge state has the suction entropy at the discharge pressure. $H_s = h(T_{2s}, P_2) - h_1$ and $\eta_s = H_s/\Delta h$. The isentropic efficiency is always lower than the polytropic one at pressure ratios above 1.

## Power
$$P_g = \dot m\,\Delta h, \qquad P_{sh} = P_g\,(1 + k_m)$$

$k_m$ covers bearing and seal losses.

## Limits
- One uncooled section per calculation; intercooling is handled by the stage design.
- Near the critical point and in two-phase regions the equation of state loses accuracy: check the dew-point margin first.
