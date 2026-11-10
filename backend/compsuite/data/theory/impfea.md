# Impeller finite-element analysis

## What this module does
It checks that each impeller survives its speeds and temperatures: the stresses at maximum continuous speed (MCS), at trip and at the 115 % overspeed test, the growth of the bore, tip and eye, how long the shrink fit stays tight, and the fatigue and vibration margins. Two models are used: a fast axisymmetric model for every impeller in the main run, and a 3D model of one blade sector that is run on request.

## The finite-element equation
Both models solve the same static balance between the stiffness of the wheel and the loads on it:

$$K\,u = F$$

$K$ is built from every element as $\int B^T D\,B\,dV$, where $B$ turns nodal displacements into strains and $D$ turns strains into stresses for the material ($E$, $\nu$). The loads $F$ are the centrifugal body force $\rho\,\omega^2 r$, the gas pressure on the surfaces, the temperature field and the fit pressure on the bore. The equations are linear and are solved directly with a sparse solver, so there is no iteration for the elastic cases. The residual $\lVert K u - F\rVert / \lVert F\rVert$ is shown as a balance check; it should sit near machine precision.

## Axisymmetric model
The meridional section (radius and axial position) is meshed with 4-node rings: hub and back plate, the blade passage and the shroud. The blades cannot be drawn in a ring model, so they are spread over the passage as a ring of reduced density and stiffness, with the blade fraction

$$f = \min\left(1,\ \frac{Z\,t_b}{2\pi r}\right)$$

This puts the blade mass on the hub and shroud while the hub and shroud carry the hoop stress. The model gives the peak von Mises stress in the solid parts, the tip growth and the eye growth that feeds the eye-seal clearance check. Blade root and fillet stresses need the 3D model.

## 3D sector model
One blade passage (hub disk, one blade, shroud) is meshed with 8-node bricks whose lines follow the blade camber. Cyclic symmetry ties the two cut faces: the displacement on one face equals the displacement on the other turned by the sector angle $360°/Z$. The full wheel is the sector repeated.

The von Mises stress combines the three principal stresses:

$$\sigma_{vm} = \sqrt{\tfrac12\left[(\sigma_1-\sigma_2)^2+(\sigma_2-\sigma_3)^2+(\sigma_3-\sigma_1)^2\right]}$$

### Shrink fit
Two unit load cases give the bore growth per $\omega^2$ ($g_i$) and per unit bore pressure ($c_i$). With the solid-shaft values $g_s$ and $c_s$ the fit pressure at any speed is

$$p_{fit}(\omega) = \frac{\delta - (g_i - g_s)\,\omega^2}{c_i + c_s}$$

The fit lifts off when this reaches zero. The bore contact length is the share of the bore where the bore growth, taken relative to the shaft, stays below the radial interference; at least half of the bore should stay in contact at MCS.

### Overspeed
The quick method scales the MCS stress by the speed ratio squared, $\sigma_{os} = \sigma_{mcs}(N_{os}/N_{mcs})^2$. The second method solves the overspeed with a bilinear stress-strain curve: each element gets a secant modulus $E_s = \sigma(\varepsilon_{eq})/(E\,\varepsilon_{eq})$, the model is solved again, and this repeats with half-step relaxation until no secant modulus changes by more than 0.002. The permanent growth is the elastic-plastic displacement minus the elastic displacement under the same load.

### Burst, fatigue and vibration
The burst speed uses the volume-average hoop stress: $N_b = N_{mcs}\sqrt{0.9\,S_u/\bar\sigma_\theta}$.

High-cycle fatigue uses the Goodman line, with the alternating stress taken as a small fraction of the steady stress (three times larger where a blade-passing resonance falls in the speed range):

$$SF = \left(\frac{\sigma_a}{S_e} + \frac{\sigma_m}{S_u}\right)^{-1}$$

Low-cycle fatigue (start-stop cycles) raises the peak stress by a stress concentration factor, finds the local strain by the Neuber rule $\sigma\,\varepsilon = (K_t\,\sigma_{vm})^2/E$ and reads the life from a strain-life curve built from the tensile strength and modulus.

Natural frequencies are found for each nodal diameter with the MCS stress added as stiffening and the spin softening taken off:

$$\left[K + K_G + K_S - (2\pi f)^2 M\right]\phi = 0$$

A blade-passing or vane-passing order that meets one of these modes inside the speed range is flagged on the interference (SAFE) diagram.

## Model checks
| Check | What it shows |
|---|---|
| Constant-strain patch test | a linear displacement gives exactly uniform stress: the element is coded right |
| Free thermal expansion | a uniform temperature rise gives no stress: thermal loads balance |
| Rotating disc | bore hoop stress and growth of a thin disc match the closed-form solution |
| Mesh convergence | average hoop stress changes little from the medium to the fine mesh |
| 2D against 3D | the ring model and the sector model agree on the overall level |

The closed-form disc solution used in the check is

$$\sigma_\theta(r_i) = \frac{3+\nu}{4}\,\rho\,\omega^2\left(r_o^2 + \frac{1-\nu}{3+\nu}\,r_i^2\right)$$

## Limits
- The impeller shape is built from the stage design, not from the CAD model: proportions of hub, back plate and shroud are estimates (scaled to the vendor mass when given).
- The blade is a constant-angle spiral of uniform thickness; fillets are not modelled, so local peaks at the blade root are indicative.
- Plasticity is a simple deformation-theory model; use it for the overspeed test, not for cyclic plastic behaviour.
- Fatigue checks use assumed alternating stress levels, not measured or computed forced response.
