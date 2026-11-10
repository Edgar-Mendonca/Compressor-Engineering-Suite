# Compressor selection and performance

## What this module does
It picks the type of compressor for the duty, sizes a centrifugal machine (number of sections, impellers, tip diameter, speed), designs each stage and builds the performance map with its surge and stonewall limits. Every operating case is then placed on the map.

## Type selection
The first choice comes from the actual suction volume flow:

$$Q_1 = \frac{\dot m}{\rho_1}$$

| Suction flow (Am³/h) | Usual choice |
| --- | --- |
| below 300 | Reciprocating |
| 300 to 1500 | Reciprocating or screw |
| 1500 to 250000 | Centrifugal |
| above 250000 | Axial or large centrifugal |

The ranges overlap in practice; the table gives a starting point, not a final answer.

## Sections and intercooling
The total pressure ratio is split equally between sections. The app starts with one section and adds one (up to four) while any section's discharge temperature is above the limit. Between sections the gas is cooled to the set temperature and loses the cooler pressure drop.

## Number of impellers, tip speed and diameter
The tip speed is limited by the material and by the machine Mach number:

$$U_{2,max} = \min(U_{2,lim},\ M_{u,max}\,a_1)$$

Each impeller can give a head of about $\psi\,U_2^2$, where $\psi$ is the head coefficient. The number of impellers is the smallest whole number that delivers the total head:

$$z = \left\lceil \frac{H_p}{\psi\,U_{2,max}^2} \right\rceil, \qquad U_2 = \sqrt{\frac{H_p}{z\,\psi}}$$

The tip diameter follows from the first-stage flow coefficient, and the speed from tip speed and diameter:

$$D_2 = \sqrt{\frac{4\,Q_1}{\pi\,\phi_1\,U_2}}, \qquad N = \frac{60}{2\pi}\,\frac{2\,U_2}{D_2}$$

All impellers in a casing share the same diameter and speed. User overrides of stage count, diameter or speed replace the matching step.

## Stage-by-stage design
The gas is marched through the stages. At each stage inlet the density is found from the equation of state, and from it the volume flow and the flow coefficient:

$$\phi = \frac{Q}{(\pi/4)\,D_2^2\,U_2}$$

The flow coefficient falls from stage to stage because the gas gets denser. The stage efficiency comes from a typical curve of efficiency against flow coefficient, lowered when the machine Mach number is above 0.9. The outlet pressure uses a local polytropic exponent from the inlet state, and the outlet temperature comes from the energy balance $h_{out} = h_{in} + H_{st}/\eta_i$.

Because the efficiencies change the section heads, the march is repeated until the section efficiencies change by less than 0.0002.

## Overall results
$$\eta_p = \frac{\sum H_{st}}{\sum H_{st}/\eta_i}, \qquad P_g = \dot m \sum \frac{H_{st}}{\eta_i}$$

The shaft power adds the mechanical losses, and the driver rating adds the chosen margin. The specific speed and specific diameter (per stage) show where the stage sits among known good designs:

$$N_s = \frac{\omega\,\sqrt{Q_1}}{(H_p/z)^{3/4}}, \qquad D_s = \frac{D_2\,(H_p/z)^{1/4}}{\sqrt{Q_1}}$$

## Performance map by stage stacking
Off design, each stage keeps its own design flow and head coefficients and follows a generic normalised curve:

$$\psi = \psi_d\,f_\psi(r), \qquad \eta = \eta_d\,f_\eta(r), \qquad r = \phi/\phi_d$$

For a given speed and mass flow the gas is marched through every stage and cooler on the real-gas model. This shows how the rear stages drift away from their design point when the front stages change the density.

- **Surge** is reached when any stage falls below $r = 0.70$.
- **Stonewall** is reached when any stage goes above $r = 1.40$, or its head drops to zero.

Both limits are found on each speed line by halving the flow interval. The map lines run in equal flow steps between them.

## Operating cases
For a variable-speed driver the speed is found so that the stacked discharge pressure equals the required one (root search between 40 % and 130 %). For a fixed-speed driver the speed is 100 % and any extra pressure must be throttled. The surge margin is

$$SM = \frac{\dot m - \dot m_s}{\dot m}$$

with $\dot m_s$ the surge flow at the same speed.

## Checks
- Flow coefficient below 0.01: very narrow impeller, poor efficiency.
- Flow coefficient above 0.16: consider a larger diameter or double flow.
- Machine Mach number above the limit.
- Operating speed outside the allowed range, or an operating case inside the surge region.

## Limits
- Generic stage curves; vendor or test curves are needed for guarantees.
- Mach-number effects on the stage curves are not modelled.
- The map is drawn at the design-case suction conditions.
