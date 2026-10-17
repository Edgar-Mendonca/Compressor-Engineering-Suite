#!/usr/bin/env sh
# Compressor Engineering Suite - start on macOS/Linux: ./run.sh
set -e
cd "$(dirname "$0")/backend"
[ -x .venv/bin/python ] || { echo "First run: creating the Python environment..."; python3 -m venv .venv; }
.venv/bin/python -I -c "import compsuite.api.app" 2>/dev/null || { echo "First run: installing the suite..."; .venv/bin/python -m pip install -e .; }
echo "Starting at http://127.0.0.1:8000 (Ctrl+C to stop)"
exec .venv/bin/python -m compsuite.cli serve --open
