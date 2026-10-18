"""pywebview walks every public attribute of the js_api object when a page loads. A public reference to the
native window made it read window.height / width, which wait for the window to be ready - a deadlock that
froze the desktop app (0.4.x - 0.5.0). Only methods may be public on the bridge."""

import inspect

from compsuite.desktop import Bridge


def test_bridge_exposes_only_methods():
    b = Bridge()
    b._window = object()
    public = {n: getattr(b, n) for n in dir(b) if not n.startswith("_")}
    assert public and all(inspect.ismethod(v) for v in public.values()), [n for n, v in public.items() if not inspect.ismethod(v)]


def test_watchdog_does_not_restart_on_close():
    from compsuite import desktop

    class Dead:
        exitcode = -15

        def is_alive(self):
            return False
    state = {"server": Dead()}
    desktop.shutdown(state)
    assert state["closing"]
    desktop._watchdog(state, None)      # returns at once instead of restarting the engine
