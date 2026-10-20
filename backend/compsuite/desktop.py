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
        self._window = None   # private: pywebview must not expose (and walk) the native window object
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
        from pathlib import Path
        folder = self._get("last_folder") or str(Path.home() / "Documents")
        r = self._window.create_file_dialog(kind, directory=folder, save_filename=name, file_types=types)
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


def _server_main(port: int) -> None:
    """Child process: the engineering server. Heavy analyses here never block the window's UI thread."""
    if FROZEN and sys.stdout is None:
        log = data_dir() / "server.log"
        mode = "w" if log.exists() and log.stat().st_size > 5_000_000 else "a"   # keep the log small
        sys.stdout = sys.stderr = open(log, mode, buffering=1, encoding="utf-8")
    import multiprocessing as mp
    import os

    def orphan_guard():  # the window process is gone (crash, kill): do not linger as an orphan engine
        parent = mp.parent_process()
        while parent is None or parent.is_alive():
            time.sleep(2.0)
        os._exit(0)
    threading.Thread(target=orphan_guard, daemon=True).start()
    import uvicorn
    from compsuite.api.app import app
    uvicorn.Server(uvicorn.Config(app, host="127.0.0.1", port=port, log_level="warning", log_config=None)).run()


def _wait(url: str, proc=None) -> None:
    for _ in range(240):
        if proc is not None and not proc.is_alive():
            raise RuntimeError(f"The engineering server stopped during start-up (exit code {proc.exitcode}); see server.log")
        try:
            urllib.request.urlopen(url + "/api/health", timeout=1)
            return
        except OSError:
            time.sleep(0.25)
    raise RuntimeError("The engineering server did not start")


def _serve(port: int, process: bool = False):
    """Start the server on ``port``: in a separate process for the desktop window, else in a thread."""
    url = f"http://127.0.0.1:{port}"
    if process:
        import multiprocessing as mp
        proc = mp.get_context("spawn").Process(target=_server_main, args=(port,), daemon=True, name="centriforge-server")
        proc.start()
        _wait(url, proc)
        return proc, url
    import uvicorn
    from compsuite.api.app import app
    server = uvicorn.Server(uvicorn.Config(app, host="127.0.0.1", port=port, log_level="warning", log_config=None))
    threading.Thread(target=server.run, daemon=True).start()
    _wait(url)
    return server, url


def _watchdog(state: dict, window) -> None:
    """Restart a crashed server and reload the page; close the app when the server exits cleanly (update install)."""
    while not state.get("closing"):
        time.sleep(1.0)
        proc = state.get("server")
        if state.get("closing"):
            return
        if proc is None or proc.is_alive():
            continue
        if proc.exitcode == 0:
            window.destroy()
            return
        print(f"Engineering server exited with code {proc.exitcode}; restarting.")
        try:
            state["server"], url = _serve(_free_port(), process=True)
            window.load_url(url)
        except Exception as exc:  # noqa: BLE001
            window.load_html(f"<body style='font-family:Segoe UI;padding:40px'><h2>{APP_NAME} engine stopped</h2><pre>{exc}</pre></body>")
            return


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
    # The desktop app runs the engine in a child process: start it, stop it the way the app does on close.
    state = {"server": _serve(_free_port(), process=True)[0]}
    shutdown(state)
    assert not state["server"].is_alive(), "engine process did not stop"
    print(f"{APP_NAME} {__version__} selftest ok: {res['summary']['checklist']}")
    return 0


def main() -> int:
    import multiprocessing
    import os
    try:
        multiprocessing.freeze_support()  # frozen build: the server child re-enters here
    except OSError:
        # A server child whose parent window already closed cannot attach to it (WinError 87): exit quietly
        # instead of showing the "unhandled exception" dialog.
        os._exit(0)
    if FROZEN and sys.stdout is None:  # windowed build: keep a log instead of a console
        sys.stdout = sys.stderr = open(data_dir() / "centriforge.log", "w", buffering=1, encoding="utf-8")
    if "--selftest" in sys.argv:
        try:
            return selftest()
        except Exception:  # noqa: BLE001 - report and exit: an unhandled error opens a dialog that blocks the build
            import traceback
            traceback.print_exc()
            return 1
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
            state["server"], url = _serve(_free_port(), process=True)
            window.load_url(url)
            threading.Thread(target=_watchdog, args=(state, window), daemon=True).start()
        except Exception as exc:  # show the reason instead of a frozen splash
            window.load_html(f"<body style='font-family:Segoe UI;padding:40px'><h2>{APP_NAME} could not start</h2><pre>{exc}</pre></body>")

    try:
        bridge = Bridge()
        win = webview.create_window(f"{APP_NAME} {__version__}", html=SPLASH, width=1480, height=920, min_size=(1000, 640),
                                    background_color="#F2F3EF", js_api=bridge)
        bridge._window = win
        webview.start(boot, win)
    except Exception as exc:  # no WebView2 runtime: use the default browser instead
        print(f"Native window unavailable ({exc}); opening the browser.")
        server, url = _serve(_free_port())
        webbrowser.open(url)
        while True:
            time.sleep(3600)
    shutdown(state)
    return 0


def shutdown(state: dict) -> None:
    """Stop the watchdog first (so it does not restart the engine during exit), then the engine process."""
    state["closing"] = True
    proc = state.get("server")
    if proc is not None and proc.is_alive():
        proc.terminate()
        proc.join(5)


if __name__ == "__main__":
    sys.exit(main())
