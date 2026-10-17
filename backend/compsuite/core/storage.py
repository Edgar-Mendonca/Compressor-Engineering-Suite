"""Project storage: projects, revisions and calculation history (SQLite).

Every save of a project creates a new immutable revision; every run stores
its result with the revision, input hash and software version so any
result can be traced to the exact inputs that produced it.
"""

from __future__ import annotations

import json
import sqlite3
from datetime import datetime, timezone
from pathlib import Path

from compsuite import __version__
from compsuite.core.model import Project
from compsuite.core.trace import input_hash, jsonable

SCHEMA = """
CREATE TABLE IF NOT EXISTS projects (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, created TEXT NOT NULL,
                                     updated TEXT NOT NULL, current_revision INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS revisions (project_id INTEGER NOT NULL, revision INTEGER NOT NULL, created TEXT NOT NULL,
                                      note TEXT, data TEXT NOT NULL, input_hash TEXT NOT NULL,
                                      PRIMARY KEY (project_id, revision));
CREATE TABLE IF NOT EXISTS runs (id INTEGER PRIMARY KEY AUTOINCREMENT, project_id INTEGER NOT NULL, revision INTEGER NOT NULL,
                                 created TEXT NOT NULL, software_version TEXT NOT NULL, input_hash TEXT NOT NULL,
                                 level TEXT NOT NULL, elapsed_s REAL, summary TEXT NOT NULL, result TEXT NOT NULL);
"""


def _now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


class Store:
    def __init__(self, path: str | Path):
        self.path = str(path)
        Path(self.path).parent.mkdir(parents=True, exist_ok=True) if self.path != ":memory:" else None
        self.conn = sqlite3.connect(self.path, check_same_thread=False)
        self.conn.row_factory = sqlite3.Row
        self.conn.executescript(SCHEMA)

    def create(self, project: Project, note: str = "Created") -> dict:
        now = _now()
        cur = self.conn.execute("INSERT INTO projects (name, created, updated, current_revision) VALUES (?, ?, ?, 0)",
                                (project.name, now, now))
        pid = cur.lastrowid
        project = project.model_copy(update={"revision": 0})
        self._insert_revision(pid, project, note)
        self.conn.commit()
        return self.get(pid)

    def _insert_revision(self, pid: int, project: Project, note: str):
        self.conn.execute("INSERT INTO revisions (project_id, revision, created, note, data, input_hash) VALUES (?, ?, ?, ?, ?, ?)",
                          (pid, project.revision, _now(), note, project.model_dump_json(), input_hash(project)))

    def update(self, pid: int, project: Project, note: str = "") -> dict:
        row = self.conn.execute("SELECT current_revision FROM projects WHERE id = ?", (pid,)).fetchone()
        if row is None:
            raise KeyError(pid)
        rev = row["current_revision"] + 1
        project = project.model_copy(update={"revision": rev})
        self._insert_revision(pid, project, note or f"Revision {rev}")
        self.conn.execute("UPDATE projects SET name = ?, updated = ?, current_revision = ? WHERE id = ?",
                          (project.name, _now(), rev, pid))
        self.conn.commit()
        return self.get(pid)

    def get(self, pid: int, revision: int | None = None) -> dict:
        p = self.conn.execute("SELECT * FROM projects WHERE id = ?", (pid,)).fetchone()
        if p is None:
            raise KeyError(pid)
        rev = p["current_revision"] if revision is None else revision
        r = self.conn.execute("SELECT * FROM revisions WHERE project_id = ? AND revision = ?", (pid, rev)).fetchone()
        if r is None:
            raise KeyError((pid, rev))
        return {"id": pid, "name": p["name"], "created": p["created"], "updated": p["updated"],
                "current_revision": p["current_revision"], "revision": rev, "note": r["note"],
                "input_hash": r["input_hash"], "project": json.loads(r["data"])}

    def project(self, pid: int, revision: int | None = None) -> Project:
        return Project.model_validate(self.get(pid, revision)["project"])

    def list(self) -> list[dict]:
        rows = self.conn.execute("SELECT * FROM projects ORDER BY updated DESC").fetchall()
        return [dict(r) for r in rows]

    def revisions(self, pid: int) -> list[dict]:
        rows = self.conn.execute("SELECT revision, created, note, input_hash FROM revisions WHERE project_id = ? ORDER BY revision",
                                 (pid,)).fetchall()
        return [dict(r) for r in rows]

    def delete(self, pid: int):
        for t in ("runs", "revisions"):
            self.conn.execute(f"DELETE FROM {t} WHERE project_id = ?", (pid,))
        self.conn.execute("DELETE FROM projects WHERE id = ?", (pid,))
        self.conn.commit()

    def save_run(self, pid: int, revision: int, result: dict) -> int:
        data = jsonable(result)
        cur = self.conn.execute(
            "INSERT INTO runs (project_id, revision, created, software_version, input_hash, level, elapsed_s, summary, result) "
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (pid, revision, _now(), __version__, result["input_hash"], result.get("level", "full"), result.get("elapsed_s"),
             json.dumps(data["summary"]), json.dumps(data)))
        self.conn.commit()
        return cur.lastrowid

    def history(self, pid: int) -> list[dict]:
        rows = self.conn.execute("SELECT id, revision, created, software_version, input_hash, level, elapsed_s, summary "
                                 "FROM runs WHERE project_id = ? ORDER BY id DESC", (pid,)).fetchall()
        return [{**dict(r), "summary": json.loads(r["summary"])} for r in rows]

    def run(self, run_id: int) -> dict:
        r = self.conn.execute("SELECT result FROM runs WHERE id = ?", (run_id,)).fetchone()
        if r is None:
            raise KeyError(run_id)
        return json.loads(r["result"])
