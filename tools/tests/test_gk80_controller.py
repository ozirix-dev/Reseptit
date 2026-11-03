"""Focused offline safety tests for tools/gk80_controller.py.

No Codex calls, GitHub API, Actions runs, site builds or remote fetches.
Run: python -m unittest discover -s tools/tests -p 'test_gk80_controller.py'
"""
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import tempfile
import unittest

MODULE = Path(__file__).resolve().parents[1] / "gk80_controller.py"
spec = importlib.util.spec_from_file_location("gk80_controller", MODULE)
controller = importlib.util.module_from_spec(spec)
spec.loader.exec_module(controller)


class ControllerTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.root = Path(self.temporary.name)
        self.git("init", "-q")
        self.git("checkout", "-q", "-b", "codex/gk80-batch30-fixture")
        self.git("remote", "add", "origin", "https://github.com/ozirix-dev/Reseptit.git")
        (self.root / "AGENTS.md").write_text("Test fixture\n", encoding="utf-8")
        self.git("add", "AGENTS.md")
        self.git("-c", "user.name=Test", "-c", "user.email=test@example.invalid",
                 "commit", "-qm", "fixture")
        self.p = controller.paths(self.root)

    def tearDown(self):
        self.temporary.cleanup()

    def git(self, *args):
        subprocess.run(["git", "-C", str(self.root), *args], check=True,
                       capture_output=True, text=True)

    def invoke(self, *args):
        return controller.main(["--worktree", str(self.root), *args])

    def initialize(self):
        self.assertEqual(self.invoke("init", "--branch", "codex/gk80-batch30-fixture"), 0)

    def test_init_and_preview_never_start_codex(self):
        self.initialize()
        self.assertEqual(self.invoke("step"), 0)
        self.assertEqual(self.invoke("status"), 0)
        state = controller.load_json(self.p["state"])
        self.assertEqual(state["turns"], 0)
        self.assertEqual(state["phase"], "PAUSED")
        self.assertFalse(self.p["lock"].exists())
        self.assertFalse(self.p["logs"].exists())

    def test_wrong_origin_or_wrong_branch_is_rejected(self):
        self.git("remote", "set-url", "origin", "https://github.com/ozirix-dev/Ravinto.git")
        with self.assertRaisesRegex(controller.GateError, "Wrong origin"):
            controller.guard(self.root)
        self.git("remote", "set-url", "origin", "https://github.com/ozirix-dev/Reseptit.git")
        self.git("checkout", "-q", "-b", "main")
        with self.assertRaisesRegex(controller.GateError, "dedicated"):
            controller.guard(self.root)

    def test_stop_and_resume_preserve_queue_and_require_execute(self):
        self.initialize()
        before = self.p["queue"].read_bytes()
        self.assertEqual(self.invoke("stop"), 0)
        self.assertTrue(self.p["stop"].exists())
        self.assertEqual(self.invoke("resume"), 0)
        self.assertFalse(self.p["stop"].exists())
        self.assertEqual(before, self.p["queue"].read_bytes())
        self.assertEqual(controller.load_json(self.p["state"])["turns"], 0)

    def test_invalid_status_duplicate_id_and_hold_without_reason(self):
        q = {"schemaVersion": 1, "target": 30, "candidates": [
            {"recipeId": "foo", "status": "NEW"}, {"recipeId": "foo", "status": "NEW"}]}
        with self.assertRaisesRegex(controller.GateError, "Duplicate"):
            controller.validate_queue(self.root, q, 30)
        q["candidates"] = [{"recipeId": "foo", "status": "HOLD"}]
        with self.assertRaisesRegex(controller.GateError, "blocker"):
            controller.validate_queue(self.root, q, 30)

    def verified(self):
        relative = "docs/research/gk80-batch30/fixture.json"
        evidence = self.root / relative
        evidence.parent.mkdir(parents=True, exist_ok=True)
        input_hash = "a" * 64
        evidence.write_text(json.dumps({"recipeId": "foo", "inputSha256": input_hash}),
                            encoding="utf-8")
        entry = {"recipeId": "foo", "status": "VERIFIED",
                 "checks": {name: True for name in controller.REQUIRED_CHECKS},
                 "sources": [{"url": "https://fineli.fi/fineli/fi/elintarvikkeet/1"}],
                 "servings": 4, "ingredientCount": 5, "gkPerServing": 4.2,
                 "omittedChoPerServing": 0.1, "inputSha256": input_hash,
                 "evidencePath": relative,
                 "evidenceSha256": controller.sha256(evidence.read_bytes())}
        return evidence, {"schemaVersion": 1, "target": 30, "candidates": [entry]}

    def test_verified_requires_matching_evidence_hash_and_identity(self):
        evidence, q = self.verified()
        self.assertEqual(controller.validate_queue(self.root, q, 30)["VERIFIED"], 1)
        evidence.write_text("{}", encoding="utf-8")
        with self.assertRaisesRegex(controller.GateError, "SHA-256 mismatch"):
            controller.validate_queue(self.root, q, 30)

    def test_verification_does_not_allow_path_traversal_or_unreviewed_status(self):
        evidence, q = self.verified()
        item = q["candidates"][0]
        item["evidencePath"] = "docs/research/gk80-batch30/../../../outside.json"
        with self.assertRaisesRegex(controller.GateError, "Unsafe"):
            controller.validate_queue(self.root, q, 30)
        item["evidencePath"] = "docs/research/gk80-batch30/fixture.json"
        item["checks"]["source"] = False
        with self.assertRaisesRegex(controller.GateError, "checklist"):
            controller.validate_queue(self.root, q, 30)

    def test_handoff_refuses_incomplete_and_init_refuses_overwrite(self):
        self.initialize()
        self.assertEqual(self.invoke("handoff"), 2)
        self.assertEqual(self.invoke("init", "--branch", "codex/gk80-batch30-fixture"), 2)

    def test_lock_refuses_parallel_writers(self):
        self.initialize()
        self.p["lock"].write_text("another pid\n", encoding="utf-8")
        self.assertEqual(self.invoke("step", "--execute"), 2)
        self.assertTrue(self.p["lock"].exists())


if __name__ == "__main__":
    unittest.main()
