# CFD-lite flow analysis

## What this module does
It solves the flow through one stage at its design point in a few seconds: the hub-to-shroud flow field through the inlet, impeller and vaneless diffuser, the blade loading on three streamlines, the diffuser with its rotating-stall and volute-force checks, and the return-channel vanes. It is a design screen to find problems early; a full 3D CFD run is still needed to confirm.

## Meridional flow by streamline curvature
The passage is cut by straight lines from hub to shroud (quasi-orthogonals). Along each line, the change of the meridional velocity is set by the curvature of the streamlines:

$$\frac{dW_m}{dn} = \kappa_n\,W_m$$

so the velocity is higher on the side where the streamlines bend away. The level of the velocity on each line is found by bisection until the mass flow through it matches the stage flow:

$$\dot m = \int_0^L \rho\,W_m \sin\psi\;2\pi r\,B\;dn$$

$B$ is the blade blockage (0.92 inside the impeller). The density comes from the total temperature (rising with the Euler work $\omega\,r c_u$), the velocity and the stage efficiency. After each pass the streamlines are moved so that each carries an equal share of the mass flow, with 0.4 relaxation. The solution has converged when no streamline moves more than $10^{-5}$ of the passage width. The mass balance check compares the mass flow through every station with the stage flow.

The swirl $r c_u$ rises smoothly from zero at the leading edge to the exit value set by the work coefficient.

## Blade-to-blade loading
On the hub, mid and shroud streamlines the difference between suction-side and pressure-side velocity follows from the rate at which the blades add swirl:

$$W_{ss} - W_{ps} = \frac{2\pi}{Z}\,\frac{d(r c_u)}{dm}$$

The **diffusion ratio** $W_{ss,\max}/W_2$ should stay below about 2; above that the suction side is likely to separate. A negative pressure-side velocity means the flow turns back near the blade.

The inducer throat is checked against the sonic area at the inlet relative Mach number:

$$\frac{A_1}{A^*} = \frac{1}{M_1}\left[\frac{2}{k+1}\left(1+\frac{k-1}{2}M_1^2\right)\right]^{\frac{k+1}{2(k-1)}}$$

A choke margin $A_{th}/A^*$ below 1.05 leaves little room for extra flow.

## Vaneless diffuser
The diffuser is marched outward in 40 radial steps. Wall friction takes swirl and total pressure from the flow:

$$\frac{d(r c_u)}{dr} = -\frac{c_f\,r\,C\,c_u}{b\,c_m}, \qquad \frac{dp_0}{dr} = -\frac{c_f\,\rho\,C^3}{c_m\,b}$$

The results are the flow angle, the static pressure recovery $C_p = (p - p_2)/(p_{0,2} - p_2)$ and the total-pressure loss coefficient.

## Rotating stall and volute force
A vaneless diffuser stalls when the inlet flow angle (from tangential) falls below a critical angle that depends on the width-to-radius ratio. The flow angle is worked out across a range of flows from the exit velocity triangle; the flow where it meets the critical angle is the stall onset. It should be at or below 75 % of design flow.

The volute radial force is near zero at design flow and grows away from it:

$$F_r = 0.36\,|1 - q^2|\,\Delta p\,D_2\,b$$

## Return-channel cascade
The return vanes are treated as a 2D row of thin cambered vanes. Each vane is split into panels, each carrying a point vortex at its quarter point; the flow must be parallel to the panel at its three-quarter point. The influence of a whole periodic row of vortices is used, so one vane stands for the full row. The vortex strengths come from a linear system; since the vanes see the mean of the inlet and exit velocity, and the exit velocity depends on the total circulation,

$$V_{y2} = V_{y1} + \frac{\sum \Gamma_j}{s}$$

this is repeated until the exit velocity stops changing. Results are the exit angle (deviation), turning and the vane loading $\Delta C_p$.

## Limits
- Inviscid core flow with fixed blockage and efficiency; no boundary-layer growth, tip leakage or secondary flows.
- Gas properties held at the suction state.
- The impeller and diffuser shapes are built from the stage design, not from the CAD model.
- Stall and volute force use simple fits; treat them as trends.
