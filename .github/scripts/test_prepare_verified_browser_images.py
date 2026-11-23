"""Exercise the browser CI image bootstrap without network access."""

import base64
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[2]
BOOTSTRAP = ROOT / ".github/scripts/prepare-verified-browser-images.ps1"
PROJECT = "ozirix-dev/Reseptit"
SOURCE = b"pinned image bytes"
IMAGE_PATH = "alkuruoat/sample.webp"
OVERLAY_PATH = "alkuruoat/overlay.webp"
TINY_WEBP = base64.b64decode("UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEAAUAmJaQAA3AA/v89WAAAAA==")
WEBP_CHUNK = b"test" + (70).to_bytes(4, "little") + b"A" * 70
OVERLAY = TINY_WEBP[:4] + (len(TINY_WEBP) + len(WEBP_CHUNK) - 8).to_bytes(4, "little") + TINY_WEBP[8:] + WEBP_CHUNK


class BrowserImageBootstrapTests(unittest.TestCase):
    def setUp(self):
        temporary = tempfile.TemporaryDirectory()
        self.addCleanup(temporary.cleanup)
        self.root = Path(temporary.name).resolve()
        self.env_file = self.root / "github-env"
        (self.root / "assets").mkdir()
        self.overlay = self.root / "kuvat" / OVERLAY_PATH
        self.overlay.parent.mkdir(parents=True)
        self.overlay.write_bytes(OVERLAY)
        scripts = self.root / "site/scripts"
        scripts.mkdir(parents=True)
        for name in ("restore-image-inputs.py", "verified_image_overlay.py"):
            shutil.copyfile(ROOT / "site/scripts" / name, scripts / name)

        self.image_root = self.root / "verified"
        self.source = self.image_root / IMAGE_PATH
        self.source.parent.mkdir(parents=True)
        self.source.write_bytes(SOURCE)
        self.entry = {
            "path": IMAGE_PATH,
            "bytes": len(SOURCE),
            "sha256": hashlib.sha256(SOURCE).hexdigest(),
            "approved": True,
            "build": True,
        }
        self.write_json("images.manifest.json", {
            "schemaVersion": 1,
            "repository": PROJECT,
            "ci": {"mode": "tracked"},
            "files": [self.entry],
        })
        self.write_json("images.tracked-overlays.json", {
            "schema_version": 1,
            "repository": PROJECT,
            "files": [{
                "path": OVERLAY_PATH,
                "bytes": len(OVERLAY),
                "sha256": hashlib.sha256(OVERLAY).hexdigest(),
                "approved": True,
                "source": "git-tracked",
            }],
        })

    def write_json(self, name, data):
        (self.root / "assets" / name).write_text(json.dumps(data), encoding="utf-8")

    def bootstrap(self, **overrides):
        env = {
            **os.environ,
            "GITHUB_ENV": str(self.env_file),
            "RUNNER_TEMP": str(self.root),
            "PROJECT_IMAGE_ROOT": str(self.image_root),
            "IMAGE_CI_PUBLIC_ONLY": "false",
            **overrides,
        }
        return subprocess.run(
            ["pwsh", "-NoProfile", "-File", str(BOOTSTRAP)],
            cwd=self.root,
            env=env,
            check=False,
            capture_output=True,
            text=True,
            timeout=30,
        )

    def assert_failed_closed(self, result, message):
        output = result.stdout + result.stderr
        self.assertNotEqual(result.returncode, 0, output)
        self.assertIn(message, output)
        self.assertFalse(self.env_file.exists())

    def test_exports_root_after_manifest_and_overlay_checks(self):
        result = self.bootstrap()
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertEqual((self.image_root / OVERLAY_PATH).read_bytes(), OVERLAY)
        self.assertEqual(self.env_file.read_text(encoding="utf-8").splitlines(), [
            f"PROJECT_IMAGE_ROOT={self.image_root}",
        ])

    def test_missing_manifest_source_blocks_build(self):
        self.source.unlink()
        self.assert_failed_closed(self.bootstrap(), "Missing or changed image input")

    def test_same_size_wrong_manifest_hash_blocks_build(self):
        self.source.write_bytes(SOURCE[:-1] + b"X")
        self.assert_failed_closed(self.bootstrap(), "Missing or changed image input")

    def test_missing_overlay_blocks_build(self):
        self.overlay.unlink()
        self.assert_failed_closed(self.bootstrap(), OVERLAY_PATH)

    def test_public_mode_strips_private_credentials_and_fails_closed(self):
        restore = self.root / "site/scripts/restore-image-inputs.py"
        restore.write_text(
            "import json, os, sys\n"
            "from pathlib import Path\n"
            "manifest = Path(sys.argv[sys.argv.index('--manifest') + 1])\n"
            "assert json.loads(manifest.read_text())['ci']['mode'] == 'public'\n"
            "for name in ('IMAGE_CI_ACCESS_KEY_ID', 'IMAGE_CI_SECRET_ACCESS_KEY', "
            "'IMAGE_CI_SESSION_TOKEN'):\n"
            "    assert not os.environ.get(name), name\n"
            "sys.exit('pinned public source unavailable')\n",
            encoding="utf-8",
        )
        result = self.bootstrap(
            IMAGE_CI_PUBLIC_ONLY="true",
            IMAGE_CI_ACCESS_KEY_ID="fixture",
            IMAGE_CI_SECRET_ACCESS_KEY="fixture",
            IMAGE_CI_SESSION_TOKEN="fixture",
        )
        self.assert_failed_closed(result, "pinned public source unavailable")
        manifest = self.root / "assets/images.manifest.json"
        self.assertEqual(json.loads(manifest.read_text())["ci"]["mode"], "tracked")
