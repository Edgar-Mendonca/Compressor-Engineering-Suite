import os
import tempfile

# Keep test runs out of the user's Documents/CentriForge folder.
os.environ.setdefault("CENTRIFORGE_HOME", tempfile.mkdtemp(prefix="centriforge-test-"))
