# Bearings and seals

## What this module does
It works out how the journal bearings carry the rotor (film thickness, losses, oil flow, temperature) and how stiff and damped they are at each speed, which feeds the rotordynamics. It also sizes the leakage of the labyrinth seals and balance piston, estimates the destabilising forces from the impellers, and checks the seal gas for the dry gas seals.

## Oil film
The journal runs off-centre in its bearing. The oil gap is

$$h(\theta) = c - x\cos\theta - y\sin\theta$$

where $c$ is the radial clearance and $(x, y)$ the journal position. For a short bearing (length up to about 0.6 of the diameter), the oil pressure around the bearing is

$$p(\theta) = -\frac{\mu\,L^3}{2\,h^3}\left(\omega\,\frac{\partial h}{\partial\theta} + 2\,\frac{\partial h}{\partial t}\right)$$

Where this gives a negative pressure the film breaks up, so those values are set to zero. Summing the pressure around the bearing gives the oil-film force.

In a tilting-pad bearing each pad turns freely on its pivot. At every journal position each pad is turned until the pressure has no moment about the pivot. Preload sets how far the pad's curve is from the shaft's curve.

## Running position
The journal position is found by Newton iteration so that the film force exactly carries the static load $W$ (the bearing reaction from the shaft model). The results are the eccentricity ratio $\varepsilon = e/c$ and the minimum film thickness $h_{min}$. The Sommerfeld number

$$S = \frac{\mu\,n\,L\,D}{W}\left(\frac{R}{c}\right)^2$$

sums up the operating state: high $S$ means a lightly loaded, centred journal.

## Dynamic coefficients
For rotordynamics the film is replaced by springs and dampers. Moving the journal a tiny step and measuring the change in force gives the stiffness; giving it a tiny velocity gives the damping:

$$K_{ij} = -\frac{\partial F_i}{\partial q_j}, \qquad C_{ij} = -\frac{\partial F_i}{\partial \dot q_j}$$

Both use central differences of one ten-thousandth of the clearance. For tilting pads the pads are re-balanced at each shifted position for stiffness, and held at their running tilt for damping. The cross terms $K_{xy}$, $K_{yx}$ of a plain bearing push the shaft sideways and can drive whirl; free tilting pads have almost none, which is why they are used on high-speed compressors.

## Heat and oil flow
The film works at one effective temperature, $T_{eff} = T_s + 0.8\,\Delta T$, and the oil viscosity at that temperature comes from the grade's 40 °C and 100 °C values. The shear loss and the oil needed to carry it away are

$$P_f = \frac{\mu(\omega R)^2}{c_{eff}}\,R\,\theta_{arc}\,L, \qquad Q = \frac{P_f}{\rho\,c_p\,\Delta T}$$

The babbitt (pad metal) temperature is a rough screening value only.

## Labyrinth seals
A labyrinth is a row of sharp teeth with a small gap to the shaft. Gas throttles at each tooth, so leakage falls as teeth are added:

$$\dot m = C_d\,\gamma\,A\,\frac{p_u}{\sqrt{Z R_s T_u}}\sqrt{\frac{1 - (p_d/p_u)^2}{N - \ln(p_d/p_u)}}$$

$A = \pi D c$ is the gap area, $N$ the number of teeth and $C_d = 0.71$. The carry-over factor $\gamma$ corrects for gas that jets straight through to the next tooth without slowing down; it grows with a larger gap compared to the tooth pitch. Clearances default to about $(0.0025\,D + 0.1\ \text{mm})/2$.

Eye seals leak from the impeller shroud back to the eye (lost flow, shown as a share of the compressor flow), interstage seals from one stage outlet to its inlet, and the balance piston from discharge to suction. Piston leakage above about 3 % is flagged.

## Cross-coupling from the impellers
Swirling gas around the impellers and in the seals pushes the rotor sideways, like the cross terms of a plain bearing. Each stage adds a cross-coupled stiffness estimated as

$$q = B_c\,\frac{T}{D_c\,H_c}\,\frac{\rho_d}{\rho_s}$$

with $T$ the stage torque, $D_c$ and $H_c$ the impeller tip diameter and width, the density ratio across the stage and $B_c = 3$. Their sum $Q_a$ (plus any seal value given) is the load used in the stability check: the log decrement must stay positive with it applied.

## Dry gas seals
The shaft ends are sealed with dry gas seals held at suction pressure behind the balance line. Primary leakage is scaled from the vendor's reference point, $Q_l = Q_{ref}\,(p/p_{ref})^{1.5}$. Clean seal gas must be supplied for both seals: their leakage plus a flow of 5 m/s inward through the process-side labyrinth so that dirty process gas never reaches the faces.

Seal gas expands across the faces at constant enthalpy and cools (Joule–Thomson). Liquid dropping out on the faces destroys them, so the gas temperature is followed along the expansion from supply to vent pressure and compared with the hydrocarbon and water dew points. The smallest gap is the superheat margin; if it is below the required margin a seal gas heater is needed.

## Limits
- Short-bearing theory loses accuracy for $L/D$ above about 0.6.
- One film temperature; no heat flow into the pads or shaft, no pad flexibility or pad inertia.
- Labyrinth leakage uses a simple formula with a fixed discharge coefficient; honeycomb and hole-pattern seals are not modelled.
- The cross-coupling estimate is a screening value; detailed seal and impeller-cavity models give better numbers.
- Dry gas seal leakage should be replaced by vendor curves for design.
