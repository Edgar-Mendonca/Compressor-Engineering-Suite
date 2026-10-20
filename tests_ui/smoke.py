"""Browser smoke test: open the app, load the example, run the analysis and open every page; fail on any page
error, console error or empty page. Needs the built frontend (frontend/dist) and Playwright with Chromium.

    python tests_ui/smoke.py [--chromium PATH]
"""

from __future__ import annotations

import re
import sys
import threading
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "backend"))


def serve(port: int):
    import uvicorn
    from starlette.routing import Mount
    from starlette.staticfiles import StaticFiles

    from compsuite.api.app import app
    app.router.routes.insert(0, Mount("/ui", app=StaticFiles(directory=ROOT / "frontend" / "dist", html=True)))
    threading.Thread(target=uvicorn.run, args=(app,), kwargs={"host": "127.0.0.1", "port": port, "log_level": "warning"}, daemon=True).start()
    time.sleep(3)


def main() -> int:
    from playwright.sync_api import sync_playwright
    exe = sys.argv[sys.argv.index("--chromium") + 1] if "--chromium" in sys.argv else None
    labels = re.findall(r'\{ id: "[a-z0-9]+", label: "([^"]+)", group:', (ROOT / "frontend/src/modules.ts").read_text())
    serve(8077)
    bad: list[str] = []
    with sync_playwright() as p:
        b = p.chromium.launch(**({"executable_path": exe} if exe else {}))
        pg = b.new_context(viewport={"width": 1440, "height": 900}).new_page()
        errs: list[str] = []
        pg.on("pageerror", lambda e: errs.append(f"page error: {e}"))
        pg.on("console", lambda m: errs.append(f"console: {m.text}") if m.type == "error" and "WebGL" not in m.text else None)
        pg.goto("http://127.0.0.1:8077/ui/")
        pg.wait_for_selector(".excard", timeout=60000)
        pg.click("text=Export gas compressor")
        pg.wait_for_timeout(500)
        pg.click("header.top >> text=Run analysis")
        time.sleep(2)
        pg.wait_for_selector("header.top >> text=Run analysis", timeout=600000)
        for lab in labels:
            errs.clear()
            pg.click(f"nav.side >> text={lab}")
            pg.wait_for_timeout(2500)
            txt = pg.inner_text("main")
            if len(txt.strip()) < 80 or errs:
                bad.append(f"{lab}: {'; '.join(errs[:3]) or 'page is empty'}")
            print(("FAIL " if bad and bad[-1].startswith(lab) else "ok   ") + lab, flush=True)
        b.close()
    for x in bad:
        print("::error::" + x)
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
