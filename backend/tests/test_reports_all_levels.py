"""Every report must build for every example and every run level the app can feed it (a report crash on partial
results once hung the release self-test)."""

import pytest

from compsuite.core.workflow import run_project
from compsuite.examples import EXAMPLES
from compsuite.materials.report import material_selection_report
from compsuite.reporting import rotordynamics_reports as R
from compsuite.reporting.report import report_html, report_pdf, results_excel


@pytest.mark.parametrize("ex", list(EXAMPLES))
@pytest.mark.parametrize("level", ["fast", "full"])
def test_reports_build(ex, level):
    p = EXAMPLES[ex]["build"]()
    res = run_project(p, level=level)
    assert report_pdf(p, res)[:4] == b"%PDF"
    assert report_html(p, res).startswith("<!") and results_excel(p, res)[:2] == b"PK"
    assert material_selection_report(p, res)[:4] == b"%PDF"
    if level == "full":
        for f in (R.lateral_report, R.stability_report, R.torsional_report):
            assert f(p, res)[:4] == b"%PDF"
