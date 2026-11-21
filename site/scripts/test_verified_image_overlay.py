"""Isolated regression tests for SHA-pinned Git-tracked WebP overlays."""
from __future__ import annotations

import base64
import hashlib
import struct
import json
from pathlib import Path
import tempfile
import unittest

from verified_image_overlay import apply_overlays


_tiny = base64.b64decode("UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEAAUAmJaQAA3AA/v89WAAAAA==")
_unknown = b"test" + struct.pack("<I", 70) + b"A" * 70
WEBP = _tiny[:4] + struct.pack("<I", len(_tiny) + len(_unknown) - 8) + _tiny[8:] + _unknown


class OverlayTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        root = Path(self.tmp.name)
        self.source = root / "source"
        self.dest = root / "verified"
        self.source.mkdir()
        self.dest.mkdir()
        (self.source / "alkuruoat").mkdir()
        self.filename = self.source / "alkuruoat/kakku.webp"
        self.filename.write_bytes(WEBP)
        self.manifest = root / "overlays.json"
        self.entry = {"path": "alkuruoat/kakku.webp", "bytes": len(WEBP),
                      "sha256": hashlib.sha256(WEBP).hexdigest(), "approved": True, "source": "git-tracked"}
        self.write_manifest()

    def tearDown(self):
        self.tmp.cleanup()

    def write_manifest(self):
        self.manifest.write_text(json.dumps({"schema_version": 1, "repository": "ozirix-dev/Reseptit",
                                             "files": [self.entry]}))

    def test_verified_copy_and_idempotence(self):
        self.assertEqual(apply_overlays(self.manifest, self.source, self.dest), 1)
        self.assertEqual((self.dest / self.entry["path"]).read_bytes(), WEBP)
        self.assertEqual(apply_overlays(self.manifest, self.source, self.dest), 1)
        self.assertEqual(apply_overlays(self.manifest, self.source, self.dest, "verify"), 1)

    def test_absent_overlay_fails_verify_mode(self):
        with self.assertRaisesRegex(ValueError, "missing"):
            apply_overlays(self.manifest, self.source, self.dest, "verify")

    def test_corrupted_source_fails_without_mutating_verified_root(self):
        preserved = self.dest / "other.txt"
        preserved.write_bytes(b"private R2 original")
        self.filename.write_bytes(WEBP[:-1] + b"X")
        with self.assertRaisesRegex(ValueError, "SHA-256"):
            apply_overlays(self.manifest, self.source, self.dest)
        self.assertEqual(preserved.read_bytes(), b"private R2 original")
        self.assertFalse((self.dest / self.entry["path"]).exists())

    def test_existing_different_target_fails_without_overwrite(self):
        target = self.dest / self.entry["path"]
        target.parent.mkdir()
        target.write_bytes(b"unsafe replacement")
        with self.assertRaisesRegex(ValueError, "size"):
            apply_overlays(self.manifest, self.source, self.dest)
        self.assertEqual(target.read_bytes(), b"unsafe replacement")

    def test_path_traversal_and_wrong_hash_rejected(self):
        self.entry["path"] = "../escape.webp"
        self.write_manifest()
        with self.assertRaisesRegex(ValueError, "path"):
            apply_overlays(self.manifest, self.source, self.dest)
        self.entry["path"] = "alkuruoat/kakku.webp"
        self.entry["sha256"] = "0" * 64
        self.write_manifest()
        with self.assertRaisesRegex(ValueError, "SHA-256"):
            apply_overlays(self.manifest, self.source, self.dest)

    def test_unapproved_and_duplicate_manifest_rejected(self):
        self.entry["approved"] = False
        self.write_manifest()
        with self.assertRaisesRegex(ValueError, "Unapproved"):
            apply_overlays(self.manifest, self.source, self.dest)
        self.entry["approved"] = True
        self.manifest.write_text(json.dumps({"schema_version": 1, "repository": "ozirix-dev/Reseptit",
                                             "files": [self.entry, self.entry]}))
        with self.assertRaisesRegex(ValueError, "Duplicate"):
            apply_overlays(self.manifest, self.source, self.dest)

    @unittest.skipUnless(hasattr(Path, "symlink_to"), "symlink unsupported")
    def test_symlink_source_is_rejected(self):
        target = self.source / "outside.webp"
        target.write_bytes(WEBP)
        self.filename.unlink()
        try:
            self.filename.symlink_to(target)
        except (OSError, NotImplementedError):
            self.skipTest("Creating symlink requires permissions")
        with self.assertRaisesRegex(ValueError, "symlink"):
            apply_overlays(self.manifest, self.source, self.dest)


if __name__ == "__main__":
    unittest.main()