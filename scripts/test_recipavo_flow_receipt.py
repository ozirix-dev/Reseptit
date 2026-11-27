"""Windows integration test for Recipavo FLOW receipts, using a local gh fixture."""

import json
import os
from pathlib import Path
import secrets
import shutil
import subprocess
import sys
import tempfile
import unittest


REPO = "ozirix-dev/Reseptit"
REPO_RECORD = {"full_name": REPO}
HEAD, BASE, TESTED = "1" * 40, "2" * 40, "3" * 40
RELEASE_RUN, CI_RUN = "888", "889"
RELEASE_PATH = ".github/workflows/recipavo-production-manual.yml"
CI_PATH = ".github/workflows/pages.yml"
SCRIPTS = Path(__file__).resolve().parent


def run_gh_fixture(args):
    if args == ["run", "view", CI_RUN, "--repo", f"github.com/{REPO}", "--attempt", "1", "--log"]:
        print(f"build\tSelect risk-based checks\t2026-11-27T00:00:00Z BASE_SHA: {BASE}")
        print(f"build\tSelect risk-based checks\t2026-11-27T00:00:00Z HEAD_SHA: {TESTED}")
        return

    prefix = ["api", "--hostname", "github.com", "--method", "GET"]
    if args[:5] != prefix or len(args) != 6:
        raise ValueError(f"Unexpected gh call: {args}")
    pr = int(os.environ["RECIPAVO_FLOW_TEST_PR"])
    run = {"status": "completed", "conclusion": "success", "run_attempt": 1, "repository": REPO_RECORD}
    responses = {
        "git/ref/heads/main": {"object": {"sha": BASE}},
        f"pulls/{pr}": {
            "state": "open",
            "head": {"sha": HEAD, "repo": REPO_RECORD},
            "base": {"ref": "main", "repo": REPO_RECORD},
        },
        f"actions/runs/{RELEASE_RUN}": {
            **run, "path": RELEASE_PATH, "event": "workflow_dispatch", "head_branch": "main",
            "head_sha": BASE, "updated_at": "2026-11-27T00:00:00Z",
        },
        f"actions/runs/{CI_RUN}": {
            **run, "path": CI_PATH, "event": "pull_request", "head_sha": HEAD,
            "head_repository": REPO_RECORD, "pull_requests": [{"number": pr}],
        },
        f"actions/runs/{RELEASE_RUN}/attempts/1/jobs": {
            "jobs": [{
                "name": "Approved production build and Wrangler promotion",
                "conclusion": "success",
                "steps": [{
                    "name": "Verify production pages, SEO, assets, SHA and Functions GET 405",
                    "conclusion": "success",
                }],
            }],
        },
    }
    endpoint = args[5].removeprefix(f"repos/{REPO}/")
    print(json.dumps(responses[endpoint]))


@unittest.skipUnless(os.name == "nt", "Recipavo FLOW targets Windows")
class ReceiptTest(unittest.TestCase):
    def test_reuses_verified_receipt_and_rejects_conflicting_fields(self):
        pwsh = shutil.which("pwsh")
        self.assertIsNotNone(pwsh, "PowerShell 7 is required")
        local_app_data = subprocess.check_output(
            [pwsh, "-NoProfile", "-Command", "[Environment]::GetFolderPath('LocalApplicationData')"],
            text=True, timeout=20,
        ).strip()
        pr = str(1_000_000_000 + secrets.randbelow(1_000_000_000))
        key = f"{pr}-{HEAD}-{BASE}-{RELEASE_RUN}-1-{CI_RUN}-1"
        root = Path(local_app_data) / "Recipavo" / "Flow" / "v1"
        receipt = root / f"{key}.json"
        lock = root / f"{pr}.lock"
        temp_receipt = receipt.with_suffix(".json.tmp")
        for path in (receipt, lock, temp_receipt):
            self.assertFalse(path.exists(), f"Fixture path already exists: {path}")
            self.addCleanup(path.unlink, missing_ok=True)

        with tempfile.TemporaryDirectory() as fixture:
            shim = Path(fixture) / "gh.cmd"
            shim.write_text(f'@echo off\n"{sys.executable}" "{__file__}" --fixture %*\n', encoding="utf-8")
            env = {**os.environ, "PATH": fixture + os.pathsep + os.environ["PATH"], "RECIPAVO_FLOW_TEST_PR": pr}
            args = [
                pwsh, "-NoProfile", "-File", str(SCRIPTS / "recipavo-flow.ps1"), "-PullRequest", pr,
                "-HeadSha", HEAD, "-BaseSha", BASE, "-ReleaseRun", RELEASE_RUN, "-ReleaseAttempt", "1",
                "-CiRun", CI_RUN, "-CiAttempt", "1",
            ]

            def run():
                return subprocess.run(args, env=env, capture_output=True, text=True, timeout=40, check=False)

            first = run()
            self.assertEqual(first.returncode, 0, first.stderr)
            self.assertFalse(json.loads(first.stdout)["reused"])
            saved = receipt.read_text(encoding="utf-8")
            original = json.loads(saved)
            self.assertEqual(original["testedCommit"], TESTED)

            reused = run()
            self.assertEqual(reused.returncode, 0, reused.stderr)
            result = json.loads(reused.stdout)
            self.assertTrue(result["reused"])
            for field in ("state", "key", "pullRequest", "headSha", "baseSha", "testedCommit", "release", "ci"):
                self.assertEqual(result[field], original[field])
            self.assertEqual(receipt.read_text(encoding="utf-8"), saved)

            for field, bad_value in {
                "key": "incorrect",
                "state": "WAITING_CI",
                "pullRequest": f"https://github.com/{REPO}/pull/1",
                "headSha": "4" * 40,
                "baseSha": "5" * 40,
                "testedCommit": "6" * 40,
                "release": f"https://github.com/{REPO}/actions/runs/{RELEASE_RUN}/attempts/2",
                "ci": f"https://github.com/{REPO}/actions/runs/{CI_RUN}/attempts/2",
            }.items():
                with self.subTest(field=field):
                    corrupt = json.dumps({**original, field: bad_value})
                    receipt.write_text(corrupt, encoding="utf-8")
                    rejected = run()
                    self.assertEqual(rejected.returncode, 1, rejected.stderr)
                    self.assertIn(f"verified field '{field}'", rejected.stderr)
                    self.assertEqual(rejected.stdout, "")
                    self.assertEqual(receipt.read_text(encoding="utf-8"), corrupt)


if __name__ == "__main__":
    if sys.argv[1:2] == ["--fixture"]:
        run_gh_fixture(sys.argv[2:])
    else:
        unittest.main()
