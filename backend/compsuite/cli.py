"""Command line: run a project file and write results/report files.

  compsuite example > project.json
  compsuite run project.json --out results/ [--fast]
  compsuite serve [--port 8000]
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from compsuite.core.model import Project


def _open_when_ready(url: str) -> None:
    """Open the browser after the server answers its health check."""
    import threading
    import time
    import urllib.request
    import webbrowser

    def wait():
        for _ in range(120):
            try:
                urllib.request.urlopen(url + "/api/health", timeout=1)
                webbrowser.open(url)
                return
            except OSError:
                time.sleep(0.5)
    threading.Thread(target=wait, daemon=True).start()


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(prog="compsuite", description="Compressor engineering suite")
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("example", help="print the example project JSON")
    r = sub.add_parser("run", help="run a project JSON file")
    r.add_argument("project")
    r.add_argument("--out", default="compsuite-results")
    r.add_argument("--fast", action="store_true")
    s = sub.add_parser("serve", help="start the web application")
    s.add_argument("--host", default="127.0.0.1")
    s.add_argument("--port", type=int, default=8000)
    s.add_argument("--open", action="store_true", help="open the browser once the server is ready")
    args = ap.parse_args(argv)

    if args.cmd == "example":
        print(Project().model_dump_json(indent=2))
        return 0
    if args.cmd == "serve":
        import uvicorn
        if args.open:
            _open_when_ready(f"http://{args.host}:{args.port}")
        uvicorn.run("compsuite.api.app:app", host=args.host, port=args.port)
        return 0

    from compsuite.cad.geometry import rotor_stl
    from compsuite.core.trace import jsonable
    from compsuite.core.workflow import run_project
    from compsuite.reporting.report import report_html, report_pdf, results_excel

    project = Project.model_validate_json(Path(args.project).read_text())
    res = run_project(project, level="fast" if args.fast else "full")
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    (out / "results.json").write_text(json.dumps(jsonable(res), indent=1))
    (out / "report.html").write_text(report_html(project, res))
    (out / "report.pdf").write_bytes(report_pdf(project, res))
    (out / "results.xlsx").write_bytes(results_excel(project, res))
    cas = res["casings"][0]
    (out / "rotor.stl").write_text(rotor_stl(cas["rotor"], cas["impellers"]["impellers"]))
    s = res["summary"]
    print(f"{s['configuration']}: {s['speed_rpm']:.0f} rpm, {s['shaft_power_kw']:.0f} kW, eta_p {s['polytropic_efficiency']:.3f}")
    print(f"Checklist: {s['checklist']}  ->  {out}/")
    for w in s["warnings"]:
        print("  !", w)
    return 0


if __name__ == "__main__":
    sys.exit(main())
