# Compressor system dynamics

## What this module does
It simulates the compressor and its piping system over time: emergency shutdown, driver trip, blocked discharge, start-up, speed changes and surge. It shows whether the anti-surge system keeps the machine out of surge, the peak pressures and temperatures, and the settle-out pressure.

## The network
The system is a set of gas volumes (scrubbers, coolers, piping) joined by links: the compressor, control and shutdown valves, check valves and piping. Fixed-pressure sources and sinks stand for the suction and export headers. The state of the system is the gas mass and temperature in each volume, the compressor flow, each valve position, the shaft speed and the controller integrators.

## Governing equations
Each volume keeps its mass and energy:

$$\frac{dm_i}{dt} = \sum \dot m_{in} - \sum \dot m_{out}$$

$$\frac{dT_i}{dt} = \frac{\sum \dot m\,c_p T - c_v T_i\,\frac{dm_i}{dt} + Q_i}{m_i\,c_v}$$

and its pressure follows from the gas law, $P = Z\,m\,R\,T/V$. A cooler returns gas at its outlet temperature with a short time lag.

The compressor flow has inertia (the gas in the compressor and its ducts), so it does not follow the map at once. This lets surge and reverse flow happen:

$$\frac{d\dot m_c}{dt} = \frac{A}{L}\,(P_1\,\Pi - P_2)$$

The shaft speed follows the torque balance on the train inertia:

$$J\,\omega_0\,\frac{dn}{dt} = \tau_d - \tau_g - \tau_l$$

## Compressor map
All speed lines of the performance map are folded onto one curve by the fan laws ($q/N$, $H/N^2$), scaled to pass through the rated point. Left of surge the head falls smoothly to a shut-off value; in reverse flow it rises like a throttle. The pressure ratio follows from the head:

$$\Pi = \left(1 + \frac{H}{\sigma\,Z\,R\,T_1}\right)^{\sigma}$$

where $\sigma = n/(n-1)$ is found by bisection so that the rated head and pressure ratio agree.

## Valves
Valve flow uses the standard gas sizing equation:

$$W = N_6\,C_v\,f\,Y\sqrt{x\,P_1\,\rho_1}, \qquad Y = 1 - \frac{x}{3F_k x_T}$$

$f$ is the trim characteristic (linear, quick-opening or equal-percentage) at the current opening, and $x$ is limited at choked flow. Each valve moves at a rate set by its stroke time. The default valve sizes come from the same equation at the design flow.

## Control
The anti-surge controller measures the surge margin on flow, $SM = (q/n)/q_s - 1$, and opens the recycle valve (proportional plus integral) when the margin falls below its set point. Below the trip line it steps the valve fully open. A pressure controller can be added on any volume.

## Solving
The equations are integrated in time with LSODA, which switches between stiff and non-stiff methods as needed (relative tolerance $10^{-5}$, internal step at most 0.05 s). The run is restarted at each event (trip, valve command, set-point change). Before the scenario starts the system settles at the design point. The mass balance check compares the change of gas in all volumes with the net flow through the boundaries; it should be a small fraction of a percent.

## Results
| Result | Meaning |
|---|---|
| Min surge margin | lowest margin while running; below zero is surge |
| Surge cycles | number of times the compressor flow turned negative |
| Max discharge T | highest gas temperature leaving the compressor |
| Max pressure | highest pressure in any volume |
| Settle-out | common pressure when both sides have equalised |

## Limits
- Lumped volumes: no pressure waves along pipes, so fast acoustic effects are not captured.
- Gas properties held at the design suction state.
- The map extension beyond surge is a generic shape; real deep-surge cycles depend on the machine.
- Controller tuning and valve data are typical values until replaced with the real ones.
