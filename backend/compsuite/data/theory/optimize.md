# Engineering optimisation

## What this module does
It changes design inputs and runs the whole workflow (aerodynamics, mechanics, bearings, rotordynamics) for each change, so every trade-off includes the coupling between disciplines. It offers a parametric sweep, a sensitivity table and a constrained optimisation of one or more variables.

## Parametric study
One variable is set to each value in a list, all other inputs held fixed, and the chosen metrics are read from each run:

$$M_k = M(x_k)$$

## Sensitivity
Each variable is moved a small step $h$ (5 % of its value) up and down from the current design. The normalised sensitivity is

$$S = \frac{M_+ - M_-}{2h}\cdot\frac{x_0}{M_0}$$

It reads as the percent change of the metric per percent change of the variable. A value of $-0.9$ means a 1 % rise of the variable lowers the metric by about 0.9 %. Variables left on automatic (no value set) are skipped.

## Optimisation
The variables are scaled to 0…1 between their bounds:

$$x = x_{lo} + u\,(x_{hi} - x_{lo})$$

The optimiser looks for the best objective subject to each constraint, written as $g_j \ge 0$ with

$$g_j = \frac{M_j - L_j}{|L_j|}$$

for a lower limit (the sign turns over for an upper limit). The method is COBYLA: it builds linear models of the objective and constraints from the runs made so far and moves within a trust region that shrinks as the search closes in, starting at 0.25 of the range. It needs no gradients, which suits a workflow with tables and switches. Each step costs one full run, so the number of runs is capped.

The result shows the best design found, whether it meets all constraints and every run made.

## Limits
- The optimum is local: start from other designs to see whether a better one exists.
- Runs inside the loop use the fast workflow level (coarser bearing tables, fewer checks); confirm the optimum with a full run.
- A run that fails (for example an infeasible geometry) counts as a very poor objective and a broken constraint.
