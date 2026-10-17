"""Traceability records attached to every calculation result.

Each module returns its numbers together with a CalcRecord that names the
method, the software version, a hash of the inputs, and the assumptions and
limitations that apply. Reports print these records verbatim.
"""

from __future__ import annotations

import hashlib
import json
import math
from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone
from typing import Any

import numpy as np

from compsuite import __version__


def jsonable(obj: Any) -> Any:
    """Convert numpy/dataclass/pydantic objects to JSON-compatible values."""
    if hasattr(obj, "model_dump"):
        return jsonable(obj.model_dump())
    if hasattr(obj, "__dataclass_fields__"):
        return jsonable(asdict(obj))
    if isinstance(obj, dict):
        # Keys starting with "_" hold live objects (models, gas) for exports.
        return {str(k): jsonable(v) for k, v in obj.items() if not str(k).startswith("_")}
    if isinstance(obj, (list, tuple)):
        return [jsonable(v) for v in obj]
    if isinstance(obj, np.ndarray):
        return jsonable(obj.tolist())
    if isinstance(obj, (np.floating,)):
        obj = float(obj)
    if isinstance(obj, (np.integer,)):
        return int(obj)
    if isinstance(obj, (np.bool_,)):
        return bool(obj)
    if isinstance(obj, complex):
        return {"re": jsonable(obj.real), "im": jsonable(obj.imag)}
    if isinstance(obj, float) and not math.isfinite(obj):
        return None
    return obj


def input_hash(inputs: Any) -> str:
    payload = json.dumps(jsonable(inputs), sort_keys=True, default=str)
    return hashlib.sha256(payload.encode()).hexdigest()[:16]


@dataclass
class CalcRecord:
    module: str
    method: str
    inputs_hash: str = ""
    assumptions: list[str] = field(default_factory=list)
    references: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)
    engine: str = "compsuite built-in"
    version: str = __version__
    timestamp: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat(timespec="seconds"))

    def warn(self, message: str) -> None:
        if message not in self.warnings:
            self.warnings.append(message)


def record(module: str, method: str, inputs: Any = None, **kwargs) -> CalcRecord:
    return CalcRecord(module=module, method=method, inputs_hash=input_hash(inputs) if inputs is not None else "", **kwargs)
