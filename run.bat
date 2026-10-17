@echo off
rem Compressor Engineering Suite - double-click to start.
rem First run creates a Python environment and installs the suite.
setlocal
rem Avoid OpenBLAS per-thread buffer allocation failures on many-core PCs.
set "OPENBLAS_NUM_THREADS=1"
set "OMP_NUM_THREADS=1"
cd /d "%~dp0backend"

set "PY=python"
where py >nul 2>nul
if %errorlevel%==0 set "PY=py -3"

if not exist ".venv\Scripts\python.exe" (
  echo First run: creating the Python environment...
  %PY% -m venv .venv
  if errorlevel 1 goto nopython
)

".venv\Scripts\python.exe" -I -c "import compsuite.api.app" >nul 2>nul
if errorlevel 1 (
  echo First run: installing the suite, this takes a few minutes...
  ".venv\Scripts\python.exe" -m pip install --upgrade pip
  ".venv\Scripts\python.exe" -m pip install -e .
  if errorlevel 1 goto failed
)

echo.
echo Starting Compressor Engineering Suite at http://127.0.0.1:8000
echo Your browser opens automatically. Close this window to stop the server.
echo.
".venv\Scripts\python.exe" -m compsuite.cli serve --open
pause
exit /b 0

:nopython
echo.
echo Python 3.10 or newer was not found.
echo Install it from https://www.python.org/downloads/ and tick "Add python.exe to PATH",
echo then double-click run.bat again.
pause
exit /b 1

:failed
echo.
echo Installation failed. Check your internet connection, then run run.bat again.
pause
exit /b 1
