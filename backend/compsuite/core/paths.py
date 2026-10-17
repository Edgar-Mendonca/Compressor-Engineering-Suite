"""Where the application finds its bundled files and keeps user data.

Bundled files (the built frontend) live next to the source tree, or inside
the PyInstaller bundle when frozen. User data (the project database) lives
in Documents/CentriForge so that updates and re-installs never touch it.
"""

from __future__ import annotations

import os
import shutil
import sys
from pathlib import Path

FROZEN = getattr(sys, "frozen", False)


def resource_root() -> Path:
    if FROZEN:
        return Path(getattr(sys, "_MEIPASS", Path(sys.executable).parent))
    return Path(__file__).resolve().parents[3]


def data_dir() -> Path:
    if os.environ.get("CENTRIFORGE_HOME"):
        d = Path(os.environ["CENTRIFORGE_HOME"])
    else:
        docs = Path.home() / "Documents"
        d = (docs if docs.is_dir() else Path.home()) / "CentriForge"
    d.mkdir(parents=True, exist_ok=True)
    return d


def database_path() -> Path:
    if os.environ.get("COMPSUITE_DB"):
        return Path(os.environ["COMPSUITE_DB"])
    db = data_dir() / "projects.db"
    # Carry over projects saved by 0.1.x, which kept compsuite.db in the working folder.
    legacy = Path("compsuite.db")
    if not db.exists() and legacy.is_file():
        shutil.copy2(legacy, db)
    return db
