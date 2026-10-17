# PyInstaller build of the CentriForge desktop app (one folder, windowed).
#   cd packaging && pyinstaller --noconfirm centriforge.spec
import os
from PyInstaller.utils.hooks import collect_data_files, collect_submodules

ROOT = os.path.abspath(os.path.join(SPECPATH, ".."))
hidden = collect_submodules("compsuite") + collect_submodules("uvicorn")
datas = [(os.path.join(ROOT, "frontend", "dist"), os.path.join("frontend", "dist"))]
datas += collect_data_files("compsuite")
try:
    import CoolProp  # noqa: F401  optional property engine
    hidden += collect_submodules("CoolProp")
    datas += collect_data_files("CoolProp")
except ImportError:
    pass

a = Analysis([os.path.join(SPECPATH, "launch.py")], pathex=[os.path.join(ROOT, "backend")], datas=datas, hiddenimports=hidden,
             excludes=["tkinter", "cadquery", "ross", "IPython", "pytest", "PyQt5", "PyQt6", "PySide2", "PySide6",
                       "numba", "llvmlite", "pyarrow", "plotly", "narwhals", "torch", "sympy", "sklearn", "notebook", "jupyter"])
pyz = PYZ(a.pure)
exe = EXE(pyz, a.scripts, [], exclude_binaries=True, name="CentriForge", console=False,
          icon=os.path.join(SPECPATH, "centriforge.ico"))
coll = COLLECT(exe, a.binaries, a.datas, name="CentriForge")
