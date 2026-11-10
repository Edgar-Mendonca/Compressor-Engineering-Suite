# Lateral rotordynamics and stability

## What this module does
It builds a beam model of the rotor on its bearings, finds the critical speeds and how well they are damped, predicts the vibration caused by unbalance, and checks the rotor against the separation margin, clearance and stability criteria for each bearing case (minimum, average and maximum clearance with the matching oil temperature).

## Rotor model
The shaft is cut into short Timoshenko beam elements (shear and rotary inertia included). Impellers, sleeves, the balance piston and the coupling half are lumped masses with their polar and transverse inertias. Each node has four unknowns: two displacements and two slopes. The equation of motion is

$$\mathbf{M}\ddot{\mathbf{q}} + (\mathbf{C} + \Omega\mathbf{G})\dot{\mathbf{q}} + \mathbf{K}\mathbf{q} = \mathbf{F}\,e^{i\Omega t}$$

$\mathbf{G}$ holds the gyroscopic terms, which grow with speed $\Omega$. The bearing stiffness and damping come from the bearing tables and change with speed. For the many repeated solves the model is reduced to its 40 lowest modes; tests check this against the full model.

## Critical speeds and damping
The complex eigenvalues $\lambda = -\zeta\omega_n \pm i\,\omega_d$ give each mode's frequency and damping. Damping is shown as the logarithmic decrement

$$\delta = \frac{2\pi\zeta}{\sqrt{1-\zeta^2}}$$

The **critical speed ratio** compares the maximum continuous speed with the first critical speed on rigid supports: $CSR = N_{mc}/N_{c1}$. A flexible rotor (high CSR) running in dense gas is more prone to instability.

## Unbalance response
Unbalance is placed where each mode shape is largest, sized from the allowable residual unbalance $U_r = K_u W / N_{mc}$ and doubled ($U_a = 2U_r$). A third case puts the coupling unbalance at the overhang. The response is swept over speed; the peaks are the damped critical speeds.

The **amplification factor** tells how sharp a peak is. It uses the two speeds where the response falls to the peak divided by $\sqrt 2$:

$$AF = \frac{N_c}{N_2 - N_1}$$

When the peaks overlap, $AF = 1/(2\zeta)$ from the nearest mode is used instead.

## Separation margin
A critical speed with $AF \ge 2.5$ must stay away from the operating speed range. Below the minimum speed the required margin is $\min(16,\ 17(1 - 1/(AF-1.5)))$ %, above the maximum continuous speed $\min(26,\ 10 + 17(1 - 1/(AF-1.5)))$ %. Well-damped peaks ($AF < 2.5$) need no margin.

## Clearance check
The vibration limit at the probes is $A_{vl} = 25.4\sqrt{12000/N_{mc}}$ µm, capped. The response is scaled so that the largest probe reading in the speed range reaches this limit, but by no more than six times: $S_{cc} = \min(6, A_{vl}/A_{max})$. The scaled response at every bearing and seal must stay below 75 % of the running clearance, so the rotor will not rub even at the vibration limit.

## Stability, Level I
Each impeller adds aerodynamic cross-coupling that feeds energy into forward whirl:

$$q_A = \frac{P_s\,B_c\,C}{D_c\,H_c\,N_r}\,\frac{\rho_d}{\rho_s}$$

The sum $Q_A$ is applied at mid-span. The log decrement of the first forward mode is traced against applied cross-coupling; $Q_0$ is the value that makes it zero (found by bisection). A Level II analysis is needed when $Q_0/Q_A < 2$, when the log decrement at $Q_A$ is below the minimum, or when $2 \le Q_0/Q_A < 10$ and the rotor lies in region B of the CSR–gas density chart.

## Stability, Level II
The first forward mode is solved with the bearings alone ($\delta_b$), then with the eye seals and balance piston added at minimum and maximum seal clearance ($\delta_f$). The seal stiffness and damping come from a simple bulk-flow model of the labyrinths. The lowest $\delta_f$ must exceed the required minimum.

## Limits
- Seal coefficients are screening estimates; vendor seal data should replace them for design.
- Supports are rigid unless a support stiffness is entered; casing and foundation modes are not modelled.
- The region A/B boundary is an approximation of the screening chart.
