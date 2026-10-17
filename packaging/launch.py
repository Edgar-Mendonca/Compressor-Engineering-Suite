"""PyInstaller entry point for the CentriForge desktop app."""

import sys

from compsuite.desktop import main

if __name__ == "__main__":
    sys.exit(main())
