# Impeller design and disk stress

## What this module does
It estimates the main dimensions of each impeller from its stage design point, draws the inlet and outlet velocity triangles, checks diffusion and inlet Mach number, estimates mass and inertia, works out the axial thrust, and checks the disk stress at maximum continuous speed (MCS), at overspeed and against burst.

## Main dimensions
The exit width comes from the outlet volume flow and a chosen outlet meridional velocity of 0.27 times the tip speed, with 10 % blockage for the blades:

$$b_2 = \frac{Q_2}{\pi\,D_2\,c_{m2}\,(1-B)}, \qquad Q_2 = \dot m/\rho_2$$

The hub diameter is 1.25 times the shaft diameter (at most half the tip diameter). The eye diameter is the one that gives the lowest relative velocity at the eye tip:

$$w_{1t} = \sqrt{c_{m1}^2 + (\omega D_1/2)^2}, \qquad c_{m1} = \frac{Q_1}{(\pi/4)(D_1^2 - d_h^2)}$$

A larger eye slows the axial flow but raises the blade speed; the best eye balances the two. The eye is kept at or below 0.75 $D_2$.

## Velocity triangles
At the inlet the flow enters axially with no swirl. At hub, mean and tip radius:

$$U = \omega\,r, \qquad \beta_1 = \arctan(c_{m1}/U)$$

Angles are measured from the tangential direction. The blade angle is the flow angle plus a small design incidence. The inlet relative Mach number is $w_{1t}/a_1$.

At the outlet the blades are swept back 40° from radial. The flow does not follow the blades exactly; the slip factor (17 blades) measures this:

$$\sigma = 1 - \frac{\sqrt{\cos\beta_{bs}}}{Z_b^{0.7}}$$

$$c_{u2} = U_2\left(\sigma - \frac{c_{m2}}{U_2}\tan\beta_{bs}\right), \qquad w_2 = \sqrt{c_{m2}^2 + (U_2 - c_{u2})^2}$$

The work coefficient $\mu = c_{u2}/U_2$ times the stage efficiency should be close to the head coefficient from sizing; this is a consistency check.

## Checks
- **de Haller ratio** $w_2/w_{1t}$: how much the relative flow slows down in the impeller. Below 0.55 the flow is likely to separate; 0.55 to 0.7 is normal at the shroud tip.
- **Inlet relative Mach number** above 0.9: shock losses and a narrow operating range.
- **Width ratio** $b_2/D_2$ below 0.012: very narrow, poor efficiency and hard to make.

## Mass, inertia and thrust
Mass and inertia come from an equivalent disk tuned to typical closed impellers:

$$m_i = 0.62\,\rho_m\,\pi\,(r_o^2 - r_i^2)\,t_{eq}, \qquad t_{eq} = 0.035\,D_2 + b_2$$

$$I_p = \tfrac12\,m_i\,(0.55\,r_o^2 + r_i^2), \qquad I_t = \tfrac12\,I_p + m_i\,L^2/12$$

Vendor values, when entered, replace these estimates and a table shows the difference.

The axial thrust comes from the pressure in the side gaps. The gas there turns at about half the shaft speed, so the pressure falls toward the shaft. Front and back cancel between the eye seal and the tip; the back face also carries pressure between the shaft seal and the eye. The inlet momentum reduces the thrust.

## Quick stress estimate
The hoop stress at the bore of a uniform spinning ring is

$$\sigma_{bore} = \frac{3+\nu}{4}\,\rho_m\,\omega^2\left(r_o^2 + \frac{1-\nu}{3+\nu}\,r_i^2\right)$$

and the tip speed the material allows comes from setting the centre stress of a solid disk equal to the allowed fraction of yield:

$$U_{max} = \sqrt{\frac{f_y\,S_y}{\rho_m\,(3+\nu)/4}}$$

## Disk stress by finite elements
The impeller is modelled as a hub disk whose thickness tapers from hub to tip. Shroud and blades are carried as an extra 1.5 times body load outside the eye. The disk is in plane stress and the unknown is the radial displacement $u(r)$. Equilibrium of a thin ring is

$$\frac{d}{dr}(t\,r\,\sigma_r) - t\,\sigma_\theta + b\,\rho\,\omega^2 r^2 t = 0$$

The disk is cut into 59 linear elements with two Gauss points each, and solved in one linear step. The residual $\lVert Ku - F\rVert/\lVert F\rVert$ shows the force balance is met. A temperature drop of 20 K from tip to bore is included.

Results at MCS and at 115 % MCS (overspeed test):

- **Peak von Mises stress**, usually at the bore. Local yielding at overspeed is often accepted and is flagged for review.
- **Average hoop stress** at overspeed, weighted by thickness: must stay at or below 0.9 of yield.
- **Burst speed**: the spin stress grows with speed squared, so

$$\omega_b = \omega_{mcs}\sqrt{\frac{0.9\,S_u}{\bar\sigma_{\theta,m}}}$$

using the average hoop stress at MCS without thermal load. The burst margin is $\omega_b/\omega_{mcs}$.

## Limits
- Correlation-based geometry; replace with the real geometry once it exists.
- Blade and shroud stresses need a 3D model (see the Impeller FEA module).
- Shrink-fit pressure at the bore is not included in the disk model.
