"""CentriForge desktop app: the web app in its own native window.

Starts the API server on a free local port and opens it with pywebview
(Edge WebView2 on Windows). Without pywebview it falls back to the
default browser. ``--selftest`` runs one fast analysis and exits; the
release build uses it to prove the bundle is complete.
"""

from __future__ import annotations

import socket
import sys
import threading
import time
import urllib.request
import webbrowser

from compsuite import APP_NAME, __version__
from compsuite.core.paths import FROZEN, data_dir


def _free_port() -> int:
    with socket.socket() as s:
        s.bind(("127.0.0.1", 0))
        return s.getsockname()[1]


def _serve(port: int):
    import uvicorn
    from compsuite.api.app import app
    server = uvicorn.Server(uvicorn.Config(app, host="127.0.0.1", port=port, log_level="warning", log_config=None))
    threading.Thread(target=server.run, daemon=True).start()
    url = f"http://127.0.0.1:{port}"
    for _ in range(240):
        try:
            urllib.request.urlopen(url + "/api/health", timeout=1)
            return server, url
        except OSError:
            time.sleep(0.25)
    raise RuntimeError("The engineering server did not start")


def selftest() -> int:
    from compsuite.core.model import Project
    from compsuite.core.workflow import run_project
    from compsuite.reporting.report import report_pdf
    res = run_project(Project(), level="fast")
    report_pdf(Project(), res)
    _, url = _serve(_free_port())
    page = urllib.request.urlopen(url + "/").read()
    assert b"<div id=\"root\">" in page, "frontend not bundled"
    print(f"{APP_NAME} {__version__} selftest ok: {res['summary']['checklist']}")
    return 0


def main() -> int:
    if FROZEN and sys.stdout is None:  # windowed build: keep a log instead of a console
        sys.stdout = sys.stderr = open(data_dir() / "centriforge.log", "w", buffering=1, encoding="utf-8")
    if "--selftest" in sys.argv:
        return selftest()
    server, url = _serve(_free_port())
    try:
        import webview
    except ImportError:
        webbrowser.open(url)
        print(f"{APP_NAME} running at {url} - close this window to stop.")
        while True:
            time.sleep(3600)
    try:
        webview.create_window(f"{APP_NAME} {__version__}", url, width=1480, height=920, min_size=(1000, 640))
        webview.start()
    except Exception as exc:  # no WebView2 runtime: use the default browser instead
        print(f"Native window unavailable ({exc}); opening the browser.")
        webbrowser.open(url)
        while True:
            time.sleep(3600)
    server.should_exit = True
    return 0


if __name__ == "__main__":
    sys.exit(main())
