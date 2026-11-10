# Lube oil system and piping

## What this module does
It sizes the lube oil system from the bearing losses (oil flow, pump, cooler, reservoir) and the process piping around the compressor (line size, pressure drop, recycle valve, flow meter), and compares the compressor curve with the system curve.

## Bearing losses
The journal bearing losses come from the bearing model at rated speed. The thrust bearing loss is the shear of a thin oil film (30 µm) over 80 % of the collar face:

$$P_t = 0.8\,\mu\,\omega^2\,\frac{\pi}{2}\,\frac{r_o^4 - r_i^4}{h_f}$$

## Oil flow and pump
All bearing heat is carried off by the oil as it warms by the design rise $\Delta T$. Control oil is added on top:

$$Q_n = \frac{P_j + P_t}{\rho\,c_p\,\Delta T} + Q_c$$

The pump is rated with a flow margin, $Q_p = k_p\,Q_n$, and its shaft power is $P_p = Q_p\,\Delta p/\eta_p$.

## Cooler
The cooler removes the full bearing heat. In counter-flow the hot oil leaving the bearings meets the warm water outlet and the cooled oil meets the cold water inlet:

$$\Delta T_{lm} = \frac{\Delta T_1 - \Delta T_2}{\ln(\Delta T_1/\Delta T_2)}, \qquad A = 1.15\,\frac{\Phi}{U\,\Delta T_{lm}}$$

The factor 1.15 leaves room for fouling. If the water is warmer than the oil should be, the temperatures cross and the cooler cannot work; this is flagged. The water flow is $\dot m_w = \Phi/(c_w\,\Delta T_w)$.

## Reservoir
The reservoir working volume holds the normal flow for the retention time, $V_r = Q_n\,t_r$, so that air and water can settle out before the oil is pumped again.

## Pipe size
Each line takes the smallest standard pipe in which both the gas velocity and the momentum flux $\rho v^2$ stay within their limits:

$$v = \frac{\dot m}{\rho\,\pi d^2/4}$$

High velocity causes noise and pressure loss; high $\rho v^2$ causes vibration and fatigue at branches. The Mach number $v/a$ is shown as a check.

## Pressure drop
The friction factor follows from the Colebrook–White equation, solved by repeated substitution:

$$\frac{1}{\sqrt f} = -2\log_{10}\left(\frac{\varepsilon/d}{3.7} + \frac{2.51}{Re\,\sqrt f}\right)$$

Gas expands as its pressure falls, so the line is treated as constant-temperature compressible flow, and the outlet pressure is found from

$$p_1^2 - p_2^2 = G^2\,\frac{Z R_u T}{M}\left(f\frac{L}{d} + K + 2\ln\frac{p_1}{p_2}\right)$$

where $G$ is the mass flux and $K$ the sum of the fitting losses.

## Recycle valve
The anti-surge recycle valve is sized for the design flow from discharge back to suction. The pressure drop ratio $x = (P_1 - P_2)/P_1$ is limited at choking to $F_\gamma\,x_T$, and the expansion factor allows for the gas expanding in the valve:

$$Y = 1 - \frac{x}{3\,F_\gamma\,x_T}, \qquad C_v = \frac{W}{27.3\,Y\sqrt{x\,P_1\,\rho_1}}$$

## Flow meter
A flange-tap orifice in the suction line measures the flow. Its discharge coefficient $C$ depends on the diameter ratio $\beta$ and the Reynolds number (a standard fitted equation). The differential pressure at design flow is found from

$$\dot m = \frac{C}{\sqrt{1-\beta^4}}\,\epsilon\,\frac{\pi}{4}d_o^2\sqrt{2\,\Delta p\,\rho_1}$$

with the expansibility $\epsilon$ updated with $\Delta p$. The permanent pressure loss is also given.

## System curve
The system needs a fixed share of the rated head (static pressure difference) plus a friction part that grows with flow squared:

$$H_{sys} = H_r\left(s + (1-s)\,(Q/Q_r)^2\right)$$

Where this curve crosses the 100 % speed line is where the compressor will run without control.

## Limits
- Oil properties are typical mineral oil values; seal oil systems are not modelled.
- Line flow is taken at constant temperature over the whole length; heat exchange and elevation are ignored.
- The valve and orifice sizing are first estimates; final sizing uses the vendor's valve data and the full meter run design.
