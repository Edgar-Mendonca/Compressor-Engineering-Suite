# Shop tests: balancing and overspeed

## What this module does
It sets the balancing limits for each impeller and for the assembled rotor, evaluates the residual unbalance check and at-speed balancing from test readings, and records the impeller overspeed test.

## Balancing limits
The allowable residual unbalance per plane grows with the mass carried and falls with speed:

$$U = \frac{6350\,W}{N_{mc}}$$

with $W$ in kg and $N_{mc}$ in rpm, giving g·mm. For an impeller $W$ is its mass; for the rotor planes it is the static load on each journal. The older 4 W/N rule (oz·in with W in lb) is shown for comparison and the smaller value governs. Dividing by the mass gives the allowable eccentricity $e = U/W$ of the centre of mass in µm.

## Rotor class
The ratio of maximum continuous speed to the first critical speed on rigid supports decides the balancing approach. Above about 0.7 the rotor bends in service and is treated as flexible: at-speed balancing may be needed.

## Residual unbalance check
A trial weight $U_t$ is moved around the rotor to six or more angles and the vibration $V$ is read at each. The squared readings follow

$$V^2 = a + 2b\cos\theta + 2c\sin\theta$$

which is fitted by least squares. From the fit the sensitivity $h$ and the residual unbalance follow:

$$h^2 = \frac{a + \sqrt{a^2 - 4(b^2+c^2)}}{2U_t^2}, \qquad U_0 = \frac{\sqrt{b^2+c^2}}{h^2\,U_t}$$

The angle of the fit gives the heavy spot. The check passes when $U_0$ is within the allowable. The trial weight should be one to two and a half times the allowable for a clear result.

## At-speed balancing
Readings are taken as vectors (amplitude and phase). One trial run per plane gives the influence coefficients $\mathbf{A} = (\mathbf{V}_t - \mathbf{V}_0)/\mathbf{W}_t$. The correction weights that best cancel the initial readings are

$$\mathbf{W} = -\mathbf{A}^{+}\,\mathbf{V}_0$$

using the least-squares inverse when there are more probes than planes. The predicted readings after correction are $\mathbf{V}_0 + \mathbf{A}\mathbf{W}$.

## Overspeed test
Each impeller is spun above maximum continuous speed. Bore, eye and tip diameters are measured before and after; the permanent radial change $(D_1 - D_0)/2$ must stay within the allowable. The impeller stress analysis predicts the expected growth.

## Limits
- The residual check assumes a linear rotor: the response is proportional to unbalance.
- At-speed balancing assumes the influence coefficients do not change between runs.
