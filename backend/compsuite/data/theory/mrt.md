# Mechanical running test

## What this module does
It plans the shop running test (test train, speed–time profile with the lube-oil changes), predicts what the probes and bearing sensors should read along the way, sets the acceptance limits, plans the unbalanced rotor response test, and evaluates the test log, coast-down and gas leak test when readings are entered.

## Test plan
The rotor is warmed up at low speed, taken quickly through the first critical speed, stepped up in 10 % steps to maximum continuous speed, held at trip speed for at least 15 minutes, then run for four hours at maximum continuous speed. During the four hours the oil temperature and pressure are moved through five 30-minute combinations to show the bearings are not sensitive to them. The test ends with a coast-down while the response is recorded.

## Predicted response
The same rotor model as the lateral analysis is used. The allowable residual unbalance per plane,

$$U = \frac{6350\,W}{N_{mc}}$$

is placed at the rotor's centre of mass, with half of each plane's value at the bearings. The 1X response is swept from slow roll to just above trip speed. The probes also see runout and small non-synchronous parts, so the predicted unfiltered reading is

$$A_u = \sqrt{A_{1X}^2 + r_o^2 + (0.04A_{1X} + 0.3)^2}$$

Peaks of the response are the predicted critical speeds; their amplification factor and separation margin are checked as in the lateral analysis.

Bearing metal temperatures come from the bearing tables at each speed, shifted by the difference between the actual and design oil supply temperature.

## Acceptance
- Unfiltered vibration up to maximum continuous speed: $A_{vl} = \min(25.4,\ 25.4\sqrt{12000/N_{mc}})$ µm.
- The reading may rise by no more than 12.7 µm from maximum continuous speed to trip speed.
- Runout: no more than $\max(6.35,\ 0.25A_{vl})$ µm.
- Non-synchronous parts: no more than 20 % of the limit.
- Bearing metal temperature, axial movement and the four-hour duration within their limits.

When a log is entered, each reading is compared with these limits and with the prediction at the same speed.

## Unbalanced rotor response test
A trial unbalance of two to eight times $U_r = 6350\,W_1/N_{mc}$ (with $W_1$ the coupling-end journal load) is fixed at the coupling. The model predicts the critical speed with this trial weight. The measured critical must fall within 5 % of the prediction, and the readings within the predicted range.

## Gas leak test
The assembled machine is held at the test pressure for at least 30 minutes with readings every 15 minutes. The pressure drop $\Delta p = 100(p_0 - p_{low})/p_t$ must stay within 1 % and no joint may leak.

## Limits
- Predictions use the model's bearing coefficients and an assumed unbalance pattern; real residual unbalance differs in size and angle.
- Runout and non-synchronous parts are rough estimates until the slow-roll readings are taken.
