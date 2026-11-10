# Performance test

## What this module does
It designs the shop performance test, reduces the measured readings to head, efficiency and power, converts them to the specified gas and speed, and checks the result against the guarantee.

## Test design
When the specified gas cannot be run in the shop, a substitute gas is used and the machine is kept aerodynamically similar. Three numbers must match:

$$\varphi = \frac{Q_1}{\frac{\pi}{4}D_2^2\,U}, \qquad r_v = \frac{\rho_2}{\rho_1}, \qquad U = \frac{\pi D_2 N}{60}$$

The flow coefficient $\varphi$ sets the velocity triangles; the volume ratio $r_v$ makes the last stage see the same flow as the first. The discharge pressure is found so that the test volume ratio equals the specified one. Equal head coefficient then gives the test speed:

$$N_t = N_{sp}\sqrt{H_{p,t}/H_{p,sp}}$$

and the test flow follows as $Q_t = Q_{sp}\,N_t/N_{sp}$. The machine Mach number $M_m = U/a_1$ and Reynolds number $Re_m = U b_2\rho_1/\mu_1$ must stay within the allowed bands. Each test gas and suction pressure is screened against these limits and the stand's temperature, pressure and power limits, and the test speed range must keep clear of critical speeds.

## Data reduction
Flow is measured with an orifice:

$$\dot m = C\,E\,\varepsilon\,\frac{\pi}{4}d^2\sqrt{2\,\Delta p\,\rho_u}, \qquad E = \frac{1}{\sqrt{1-\beta^4}}$$

where the discharge coefficient $C$ depends on the Reynolds number, so it is found in a few iterations. Flange readings are static; adding the velocity head gives total conditions. The polytropic head between the measured end states uses a mean temperature along the path:

$$H_p = (h_2 - h_1) - (s_2 - s_1)\,\frac{T_{02} - T_{01}}{\ln(T_{02}/T_{01})}$$

The work input includes the heat lost from the casing, $w = (h_2 - h_1) + Q_l/\dot m$, and the efficiency is $\eta = H_p/w$.

## Conversion to specified conditions
With the speed ratio $r = N_{sp}/N_t$, similar machines follow

$$Q_{sp} = Q_t\,r, \qquad H_{p,sp} = H_{p,t}\,r^2$$

and the efficiency stays the same, apart from a small correction for the different Reynolds number: $\eta_{sp} = 1 - (1-\eta_t)f_{Re}$. The discharge pressure and power on the specified gas follow from the head and efficiency.

## Uncertainty
Each instrument reading is moved by its uncertainty and the point is reduced again; the changes are combined as the root of the sum of squares, plus a method uncertainty.

## Acceptance
At the rated speed line the converted points are interpolated at the guarantee flow. The head must not fall below the guarantee, the shaft power may exceed it by at most 4 %, and the surge flow must not be higher than predicted.

## Limits
- Similarity holds only within the volume-ratio, Mach and Reynolds bands; outside them the conversion is not valid.
- Casing heat loss is estimated from a bare casing when not entered.
- Mach and Reynolds limit lines are fitted approximations of the standard's charts.
