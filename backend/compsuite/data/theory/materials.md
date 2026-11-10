# Materials screening and sour-service assessment

## What this module does
It screens shaft, impeller and casing materials for temperature, strength and sour service, and then checks every location of the compressor for wet and sour conditions, corrosion rate and metal loss. Each component is checked against the acceptance criteria and against its own recorded material limits.

## Material properties at temperature
Database values are at room temperature. Strength and stiffness are lowered with temperature using a derating table for each material family:

$$S_y(T) = f_y(T)\,S_y, \qquad E(T) = f_E(T)\,E$$

The tensile strength falls by half the yield derating.

## Screening
A material passes screening when the highest metal temperature is below its upper limit, the lowest temperature is above its lower limit and, in sour service, a hardness limit for sour service is known. Sour service applies when

$$p_{H_2S} \ge 0.003\ \text{bar}$$

In sour service the hardness limit caps the usable strength of carbon and low-alloy steels at about 550 MPa (scaled by the temperature derating). Candidates are ranked by usable strength.

## Conditions at each location
Locations are the suction, every stage outlet, the settle-out point at its design temperature and the settle-out point at its water dew point. Water is knocked out to saturation at each stage inlet. At each location:

$$p_{H_2S} = P\,y_{H_2S}, \qquad p_{CO_2} = P\,y_{CO_2}, \qquad p_w = P\,y_w$$

The **water dew point** is the temperature where the vapour pressure of pure water equals $p_w$. A location is **wet** when

$$T \le T_{dew} + \Delta T_m$$

or when liquid water is assumed. This ideal-mixing dew point is low at high pressure, which is why a margin is used.

## Condensed-water pH
Unless measured, the pH is that of pure water saturated with CO2 and H2S:

$$[H^+]^2 = K_1 K_H\,p_{CO_2} + K_1 K_H\,p_{H_2S}, \qquad pH = -\log_{10}[H^+]$$

each gas with its own constants, corrected to temperature. Real water with dissolved salts or bicarbonate has a higher pH, so this is on the safe side.

## Sour severity
The severity domain (0 to 3) is read from the pH against $p_{H_2S}$ chart. Below the sour threshold the domain is 0. The boundaries are editable and must be set from the licensed standard.

## Corrosion rate and metal loss
For carbon steel in wet CO2 service:

$$\log_{10} CR = 5.8 - \frac{1710}{T} + 0.67\,\log_{10} p_{CO_2}$$

with $T$ in kelvin. The rate is multiplied by a calibration factor and by an oxygen factor when oxygen ingress is above the threshold. Dry locations have zero rate. The loss over the design life is

$$\delta = CR\,L$$

and for settle-out rows it is scaled by the share of life spent at settle-out (zero when a dew-point trip protects it).

## Component checks
Each component sees the locations of its zone. Corrosion-resistant alloys and weld overlay are taken to have negligible general corrosion within their qualified range. The checks are:

- Rate and total loss against the acceptance criteria of the component class (impellers by blade thickness).
- Loss against the corrosion allowance.
- Recorded limits: temperatures, hardness, wet and dry $p_{H_2S}$, $p_{CO_2}$, minimum pH, chlorides.

The verdict is **outside** when any limit is exceeded, **evidence needed** when nothing is exceeded but a limit or the verified reference is missing, and **within** only when all recorded and verified limits are met. A material name alone never passes.

## Settle-out
When the compressor stops under pressure, the gas cools toward ambient. If the settle-out temperature can fall below the water dew point, water condenses. The app proposes a depressurisation trip at

$$T_{trip} = T_{dew} + \Delta T_{tt}$$

and a maximum standstill time under pressure.

## Limits
- Ideal mixing for the dew point; it reads low at high pressure.
- Unbuffered pH; measured values should be used where known.
- The corrosion correlation is a worst case for bare carbon steel and ignores protective scale.
- Screening values are typical, not specification minimums.
