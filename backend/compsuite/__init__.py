"""CentriForge - compressor engineering suite.

Preliminary engineering calculations for industrial centrifugal compressors.
Results support design studies and comparisons; they do not certify
compliance with API 617 or any other standard.
"""

import os as _os

# The suite solves many small matrices; multi-threaded BLAS gives no speed-up
# and OpenBLAS can fail to allocate per-thread buffers on many-core Windows
# machines ("Memory allocation still failed after 10 retries"). Must be set
# before NumPy is first imported; users can still override these variables.
for _v in ("OPENBLAS_NUM_THREADS", "OMP_NUM_THREADS", "MKL_NUM_THREADS"):
    _os.environ.setdefault(_v, "1")

__version__ = "0.5.2"
APP_NAME = "CentriForge"
RELEASE_DATE = "2026-10-18"
GITHUB_REPO = "Edgar-Mendonca/Compressor-Engineering-Suite"
