"""Application info and one-click updates from GitHub Releases.

The installed (frozen) Windows app downloads the release's Setup.exe and
runs it silently; the installer replaces the program files and starts the
new version. User projects live outside the install folder. When running
from source, the check still reports new releases and links to them.
"""

from __future__ import annotations

import json
import os
import re
import subprocess
import sys
import tempfile
import threading
import time
import urllib.error
import urllib.request
from pathlib import Path

from fastapi import APIRouter, HTTPException
from fastapi.responses import PlainTextResponse

from compsuite import APP_NAME, GITHUB_REPO, RELEASE_DATE, __version__
from compsuite.core.paths import FROZEN, data_dir, database_path

router = APIRouter(prefix="/api/app")
REPO = os.environ.get("CENTRIFORGE_REPO", GITHUB_REPO)
_state: dict = {"phase": "idle", "progress": 0.0, "message": ""}
_last_check: dict = {}


def _vtuple(v: str) -> tuple:
    return tuple(int(x) for x in re.findall(r"\d+", v)[:3])


def changelog() -> list[dict]:
    """Sections of CHANGELOG.md as [{version, date, items}], newest first."""
    path = Path(__file__).resolve().parents[1] / "data" / "CHANGELOG.md"
    out: list[dict] = []
    if not path.is_file():
        return out
    for line in path.read_text(encoding="utf-8").splitlines():
        m = re.match(r"^## \[?v?([\d.]+)\]?\s*(?:[-–]\s*(.+))?", line)
        if m:
            out.append({"version": m.group(1), "date": (m.group(2) or "").strip(), "items": []})
        elif out and line.strip().startswith(("-", "*")):
            out[-1]["items"].append(line.strip()[1:].strip())
    return out


@router.get("/info")
def info():
    return {"name": APP_NAME, "version": __version__, "release_date": RELEASE_DATE, "repo": REPO,
            "installed": FROZEN, "platform": sys.platform, "data_dir": str(data_dir()),
            "database": str(database_path()), "changelog": changelog()}


def _get_json(url: str) -> dict:
    req = urllib.request.Request(url, headers={"Accept": "application/vnd.github+json", "User-Agent": APP_NAME})
    with urllib.request.urlopen(req, timeout=10) as r:
        return json.load(r)


@router.get("/update")
def check_update(force: bool = False):
    c = _last_check.get("resp")
    if c and not force and time.time() - c["checked"] < 600:   # the launcher re-opens often; GitHub once per 10 min
        return c
    try:
        rel = _get_json(f"https://api.github.com/repos/{REPO}/releases/latest")
    except urllib.error.HTTPError as exc:
        if exc.code == 404:  # repository has no published release yet
            return {"available": False, "current": __version__, "latest": None, "checked": time.time()}
        return {"available": False, "current": __version__, "error": f"GitHub answered {exc.code}", "checked": time.time()}
    except Exception as exc:  # offline, rate-limited, no release yet
        return {"available": False, "current": __version__, "error": f"Could not reach GitHub: {exc}",
                "checked": time.time()}
    latest = rel.get("tag_name", "").lstrip("v")
    asset = next((a for a in rel.get("assets", []) if a["name"].lower().endswith(".exe")), None)
    _last_check.update(rel=rel, asset=asset)
    _last_check["resp"] = {"available": bool(latest) and _vtuple(latest) > _vtuple(__version__), "current": __version__,
            "latest": latest, "published": rel.get("published_at"), "notes": rel.get("body", ""),
            "url": rel.get("html_url"), "installer": asset["browser_download_url"] if asset else None,
            "size_mb": round(asset["size"] / 1e6, 1) if asset else None,
            "can_install": FROZEN and sys.platform == "win32" and asset is not None, "checked": time.time()}
    return _last_check["resp"]


def _download_and_install(url: str) -> None:
    try:
        _state.update(phase="downloading", progress=0.0, message="Downloading update")
        dest = Path(tempfile.gettempdir()) / f"{APP_NAME}-Setup.exe"
        req = urllib.request.Request(url, headers={"User-Agent": APP_NAME})
        with urllib.request.urlopen(req, timeout=30) as r, open(dest, "wb") as f:
            total = int(r.headers.get("Content-Length") or 0)
            done = 0
            while chunk := r.read(1 << 20):
                f.write(chunk)
                done += len(chunk)
                _state["progress"] = done / total if total else 0.0
        _state.update(phase="installing", progress=1.0, message="Installing - CentriForge will restart")
        flags = getattr(subprocess, "DETACHED_PROCESS", 0) | getattr(subprocess, "CREATE_NEW_PROCESS_GROUP", 0)
        subprocess.Popen([str(dest), "/VERYSILENT", "/SUPPRESSMSGBOXES", "/NORESTART", "/CLOSEAPPLICATIONS"],
                         creationflags=flags, close_fds=True)
        time.sleep(1.5)
        os._exit(0)  # release the program files so the installer can replace them
    except Exception as exc:
        _state.update(phase="error", message=f"Update failed: {exc}")


@router.post("/update")
def apply_update():
    if not (FROZEN and sys.platform == "win32"):
        raise HTTPException(400, "One-click install works in the installed Windows app. From source, download the new release.")
    if _state["phase"] in ("downloading", "installing"):
        return _state
    asset = _last_check.get("asset") or (check_update(True) and _last_check.get("asset"))
    if not asset:
        raise HTTPException(404, "No installer found in the latest release.")
    threading.Thread(target=_download_and_install, args=(asset["browser_download_url"],), daemon=True).start()
    _state.update(phase="downloading", progress=0.0, message="Starting download")
    return _state


@router.get("/update/status")
def update_status():
    return _state


@router.get("/diagnostics", response_class=PlainTextResponse)
def diagnostics() -> str:
    """Plain-text diagnostics for bug reports: versions, platform, data folder and the tail of the logs (no project data)."""
    import platform

    import numpy
    import scipy

    from compsuite import __version__
    from compsuite.core.paths import data_dir
    lines = [f"CentriForge {__version__}", f"Python {sys.version.split()[0]} on {platform.platform()}", f"numpy {numpy.__version__}, scipy {scipy.__version__}",
             f"frozen: {getattr(sys, 'frozen', False)}", f"data folder: {data_dir()}"]
    for name in ("centriforge.log", "server.log"):
        f = data_dir() / name
        if f.exists():
            tail = f.read_text(encoding="utf-8", errors="replace").splitlines()[-120:]
            lines += ["", f"--- {name} (last {len(tail)} lines) ---", *tail]
    return "\n".join(lines)
