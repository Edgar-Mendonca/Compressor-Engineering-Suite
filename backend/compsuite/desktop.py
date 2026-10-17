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


SPLASH = f"""<!doctype html><html><body style="margin:0;height:100vh;display:grid;place-items:center;background:#F2F3EF;
font-family:'Segoe UI',Arial,sans-serif;color:#0C1A2B"><div style="text-align:center">
<div style="font-size:42px;font-weight:700;letter-spacing:.04em">Centri<span style="color:#0B5CAD">Forge</span></div>
<div style="font:12px Consolas,monospace;letter-spacing:.2em;color:#5B6878;margin-top:6px">COMPRESSOR ENGINEERING SUITE · {__version__}</div>
<div style="width:220px;height:3px;background:#D3D7D6;margin:28px auto 10px;overflow:hidden"><div style="width:40%;height:100%;
background:#0B5CAD;animation:s 1.1s infinite ease-in-out"></div></div>
<div style="font:12px Consolas,monospace;color:#5B6878">Starting engineering engine…</div></div>
<style>@keyframes s{{0%{{transform:translateX(-100%)}}100%{{transform:translateX(250%)}}}}</style></body></html>"""


class Bridge:
    """Native file dialogs for the web UI (window.pywebview.api.*). Remembers the last folder."""

    def __init__(self):
        self.window = None
        self._settings = data_dir() / "settings.json"

    def _get(self, k, default=None):
        import json
        try:
            return json.loads(self._settings.read_text()).get(k, default)
        except (OSError, ValueError):
            return default

    def _set(self, k, v):
        import json
        try:
            d = json.loads(self._settings.read_text())
        except (OSError, ValueError):
            d = {}
        d[k] = v
        self._settings.write_text(json.dumps(d, indent=1))

    def _dialog(self, kind, name="", types=()):
        import webview
        from pathlib import Path
        folder = self._get("last_folder") or str(Path.home() / "Documents")
        r = self.window.create_file_dialog(kind, directory=folder, save_filename=name, file_types=types)
        if not r:
            return None
        path = r if isinstance(r, str) else r[0]
        self._set("last_folder", str(Path(path).parent))
        return path

    def save_file(self, name, b64, filetype=""):
        import base64
        import webview
        ext = name.rsplit(".", 1)[-1] if "." in name else ""
        types = (f"{filetype or ext.upper()} file (*.{ext})", "All files (*.*)") if ext else ()
        path = self._dialog(webview.SAVE_DIALOG, name, types)
        if not path:
            return None
        if ext and not path.lower().endswith("." + ext.lower()):
            path += "." + ext
        with open(path, "wb") as f:
            f.write(base64.b64decode(b64))
        return path

    def save_text(self, path, text, name="project.cfproj"):
        import webview
        if not path:
            path = self._dialog(webview.SAVE_DIALOG, name, ("CentriForge project (*.cfproj)", "All files (*.*)"))
            if not path:
                return None
            if not path.lower().endswith((".cfproj", ".json")):
                path += ".cfproj"
        with open(path, "w", encoding="utf-8") as f:
            f.write(text)
        return path

    def open_project(self):
        import webview
        path = self._dialog(webview.OPEN_DIALOG, "", ("CentriForge project (*.cfproj;*.json)", "All files (*.*)"))
        if not path:
            return None
        with open(path, encoding="utf-8") as f:
            return {"path": path, "text": f.read()}

    def read_path(self, path):
        with open(path, encoding="utf-8") as f:
            return {"path": path, "text": f.read()}

    def reveal(self, path):
        import os
        import subprocess
        if sys.platform == "win32":
            subprocess.Popen(["explorer", "/select,", os.path.normpath(path)])
        else:
            webbrowser.open("file://" + os.path.dirname(path))

    def open_path(self, path):
        import os
        if sys.platform == "win32":
            os.startfile(path)  # noqa: S606
        else:
            webbrowser.open("file://" + path)


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
    from compsuite.reporting.prism import render
    spec = {"data": [{"x": [1, 10], "y": [1, 2], "mode": "lines+markers"}], "layout": {"xaxis": {"type": "log"}}}
    for fmt in ("svg", "png", "pdf"):
        assert render(spec, fmt=fmt, dpi=100)["content"], fmt
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
    try:
        import webview
    except ImportError:
        server, url = _serve(_free_port())
        webbrowser.open(url)
        print(f"{APP_NAME} running at {url} - close this window to stop.")
        while True:
            time.sleep(3600)
    state: dict = {}

    def boot(window):  # runs after the splash window is on screen
        try:
            state["server"], url = _serve(_free_port())
            window.load_url(url)
        except Exception as exc:  # show the reason instead of a frozen splash
            window.load_html(f"<body style='font-family:Segoe UI;padding:40px'><h2>{APP_NAME} could not start</h2><pre>{exc}</pre></body>")

    try:
        bridge = Bridge()
        win = webview.create_window(f"{APP_NAME} {__version__}", html=SPLASH, width=1480, height=920, min_size=(1000, 640),
                                    background_color="#F2F3EF", js_api=bridge)
        bridge.window = win
        webview.start(boot, win)
    except Exception as exc:  # no WebView2 runtime: use the default browser instead
        print(f"Native window unavailable ({exc}); opening the browser.")
        server, url = _serve(_free_port())
        webbrowser.open(url)
        while True:
            time.sleep(3600)
    server = state.get("server")
    if server is None:
        return 0
    server.should_exit = True
    return 0


if __name__ == "__main__":
    sys.exit(main())
