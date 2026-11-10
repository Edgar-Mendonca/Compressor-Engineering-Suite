# Rotor, shaft and axial thrust

## What this module does
It lays out the rotor from the stage design (shaft steps, impellers, balance piston, seal sleeves, journals, thrust collar and coupling), balances the axial thrust, and checks the shaft for stress, fatigue, yield and sag.

## Rotor layout
The shaft must carry the full casing torque. The torque follows from the casing power and speed, $T = P/\omega$. With an allowable shear stress of 15 % of the yield strength and a factor $k_t$ for short torque peaks, the smallest solid shaft is

$$d_t = \left(\frac{16\,T\,k_t}{\pi\,\tau_a}\right)^{1/3}$$

Torsion is rarely the limit. A long, thin rotor bends easily and has a low first critical speed, so the shaft at the impellers is also kept above the bearing span divided by 8.5:

$$d = \max\left(d_t,\ \min\left(\frac{L_s}{8.5},\ 0.4\,D_2\right)\right)$$

The span itself depends on the shaft size (journal length, seal zones, impeller pitch), so the layout is repeated until the diameter stops changing. Diameters are rounded up to 5 mm. The journals are 0.75 of the impeller-shaft diameter and the seal sleeves 0.95. The span-to-diameter ratio $L_s/d$ is shown as a quick stiffness indicator; above about 9 the rotor is flexible and stability needs a closer look.

The coupling half, balance piston, thrust collar and seal sleeves are added as point masses with mass and inertia from their size and material. Users can replace the whole geometry with their own sections and masses.

## Axial thrust
Each impeller is pushed toward its eye: the stage pressure rise acts on the ring between the eye seal and the shaft, and the gas entering the eye adds a little momentum:

$$F_i = \Delta p\,\frac{\pi}{4}\left(D_s^2 - d^2\right) + \dot m\,c_1$$

The sum $F_g$ of all impellers is far too large for a thrust bearing alone. A balance piston behind the last impeller sees discharge pressure on one side and suction pressure on the other (through the balance line):

$$F_{bp} = \Delta p\,\frac{\pi}{4}\left(d_{bp}^2 - d_s^2\right)$$

The piston diameter is chosen so that a small residual thrust $F_r = F_g - F_{bp}$ remains, always in the same direction, which keeps the thrust bearing loaded on its active side. Because the real pressures behind the impellers change with flow and seal wear, a swing of 30 % of the gross thrust is added to size the thrust bearing:

$$F_d = |F_r| + 0.3\,|F_g|, \qquad A_p = F_d / p_a$$

The collar diameter follows from the pad area with pads covering 80 % of the ring. A gear coupling locks under torque and can push the rotor with $F_a = \mu\,2T/D_p$ ($\mu$ 0.15 to 0.30); this is added to the bearing load. Disc couplings pass almost no thrust.

Checks: the load should be at most half the bearing rating, and the collar rim speed $v_c = \pi D_c N/60$ should stay below about 190 m/s.

## Shaft stress
Gravity loads and bearing reactions give the bending moment $M(z)$ along the shaft by plain statics. Torque enters at the coupling and each impeller takes out its own stage power. At every shoulder and section centre:

$$\sigma_b = \frac{32\,M\,d}{\pi(d^4 - d_i^4)}, \qquad \tau = \frac{16\,T\,d}{\pi(d^4 - d_i^4)}, \qquad \sigma_{ax} = \frac{4\,F_{ax}}{\pi(d^2 - d_i^2)}$$

At a shoulder the fillet raises the local stress by $K_t$, read from stepped-bar chart fits in $D/d$ and $r/d$. Not all of that rise hurts fatigue: the notch sensitivity $q$ (from strength and fillet radius) gives $K_f = 1 + q(K_t - 1)$.

## Fatigue and yield
On a turning shaft, gravity bending changes sign every turn (alternating stress), while torque and thrust are steady (mean stress):

$$\sigma_a = K_f\,\sigma_b, \qquad \sigma_m = \sqrt{(K_f\,\sigma_{ax})^2 + 3\,(K_{fs}\,\tau)^2}$$

The endurance limit of a polished test bar is reduced for surface finish, size and the wanted reliability, $S_e = k_a\,k_b\,k_e\,S_e'$. The Goodman line then gives the fatigue safety factor:

$$\frac{1}{n_f} = \frac{\sigma_a}{S_e} + \frac{\sigma_m}{S_u}$$

For yield, the peak stress at the transient torque is compared with the yield strength, $n_y = S_y/\sigma_{max}$. The lowest values along the shaft are reported with their position.

## Sag and stiffness
The finite-element shaft model on its bearings gives the static deflection under gravity. The mid-span sag and the equivalent stiffness (rotor weight over sag relative to the bearings) give a feel for how flexible the rotor is.

## Limits
- Layout rules are typical proportions for a first design, not a vendor drawing.
- Impeller thrust uses a simple pressure-on-annulus model; cavity swirl and leakage effects are not modelled.
- Shrink fits, keyways and fretting under impeller hubs are not included in the stress check.
- Bending from unbalance and misalignment is not part of the fatigue check; it is small in a well-balanced machine.
