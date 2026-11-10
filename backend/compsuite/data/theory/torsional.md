# Torsional vibration of the train

## What this module does
It models the driver, couplings, gear and compressor as one twisting system, finds its natural frequencies and mode shapes, checks them against the shaft-speed and electrical excitations, and works out shaft stresses and coupling safety at resonance, under drive harmonics and during a motor short circuit.

## Model
Each rotor is cut into short shaft elements. An element of length $L$ and diameters $D$, $d$ has stiffness

$$k = \frac{G\,\pi(D^4 - d^4)}{32\,L}$$

and its inertia $\rho\,\pi(D^4-d^4)L/32$ is split between its two ends; impellers, motor cores and gear wheels add their own inertia. A coupling is a spring between two hubs; when no vendor value is given its stiffness is the body in series with the shaft inside the hubs. The gear mesh is a spring along the line of action, $k_t = k_m r_b^2$.

Shafts running at another speed are referred to compressor speed: inertia and stiffness are multiplied by the speed ratio squared, $n^2$. The equation of motion is

$$\mathbf{J}\,\ddot{\boldsymbol\theta} + \mathbf{C}\,\dot{\boldsymbol\theta} + \mathbf{K}\,\boldsymbol\theta = \mathbf{T}$$

## Natural frequencies
The undamped modes solve $\mathbf{K}\boldsymbol\phi = \omega^2\mathbf{J}\boldsymbol\phi$; the first (rigid-body) mode at zero is skipped. For each mode the share of strain energy $\tfrac12 k\theta^2$ in each shaft line shows which line takes part in it.

## Separation margins
Each mode is compared with 1× and 2× the speed of each shaft line and, for motors, 1× and 2× line frequency:

$$SM = 100\,\frac{f_n - f_e}{f_e}$$

A mode interferes when it falls inside the operating speed range widened by the margin. It is only dangerous when the exciting shaft line holds a large share of that mode's strain energy.

## Steady-state resonance
At each interference the train is driven at resonance by a small torque (a fraction of rated torque) with modal damping. The alternating shear stress $\tau_a = 16T_aD/(\pi(D^4-d^4))$ must stay below

$$\tau_{all} = \frac{\tau_e\,(1 - \tau_m/\tau_u)}{SF}, \qquad \tau_e = \frac{0.577\,S_e\,C_s\,C_z}{K_t}$$

where $\tau_m$ is the steady shear from rated torque. Couplings are checked on a modified Goodman line: $SF = 1/(T_m/T_{max} + T_a/T_{alt})$ must exceed the minimum.

## Drive harmonics and short circuits
For variable-speed motors each harmonic of the electrical frequency is swept over the speed range. For a motor short circuit the air-gap torque $M(t) = \sum M_k e^{-\alpha_k t}\sin(\omega_k t + \varphi_k)$ is applied at the motor core and the response is integrated in time on the elastic modes. The peak shear including rated torque must stay below a fraction of the shear yield stress, and the coupling torque below its transient rating.

## Limits
- Linear model: coupling stiffness that changes with torque and gear backlash are not modelled.
- Driver, coupling and gear data are estimated when not supplied; vendor data should replace them.
- Branched trains with more than one gear mesh need a dedicated model.
