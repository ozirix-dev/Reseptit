"""Exercise the review preparer with real Git and a local origin."""

import importlib.util
import json
import subprocess
import tempfile
import unittest
from contextlib import chdir
from pathlib import Path
from unittest.mock import patch

spec = importlib.util.spec_from_file_location(
    "prepare_recipavo_review", Path(__file__).with_name("prepare-recipavo-review.py")
)
review = importlib.util.module_from_spec(spec)
spec.loader.exec_module(review)


def git(cwd, *args):
    result = subprocess.run(
        ["git", "-c", "commit.gpgsign=false", *args],
        cwd=cwd, capture_output=True, text=True, timeout=30, check=False,
    )
    if result.returncode:
        raise AssertionError(f"git {args} exited {result.returncode}: {result.stderr}")
    return result.stdout.strip()


class PullRequestSnapshotTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        temp = tempfile.TemporaryDirectory()
        cls.addClassCleanup(temp.cleanup)
        cls.root = Path(temp.name).resolve()
        cls.origin = cls.root / "origin"
        cls.origin.mkdir()
        git(cls.origin, "init", "--quiet", "--initial-branch=main")
        git(cls.origin, "config", "user.email", "review-fixture@example.invalid")
        git(cls.origin, "config", "user.name", "Review Test")
        cls.commit("deleted on PR.txt")
        git(cls.origin, "branch", "pr")
        for number in range(3):
            cls.commit(f"main {number}.txt")
        cls.base = git(cls.origin, "rev-parse", "HEAD")
        git(cls.origin, "switch", "--quiet", "pr")
        git(cls.origin, "rm", "--quiet", "deleted on PR.txt")
        for number in range(3):
            cls.commit(f"pr {number}.txt")
        cls.head = git(cls.origin, "rev-parse", "HEAD")
        git(cls.origin, "update-ref", "refs/pull/1/head", cls.head)
        tree = git(cls.origin, "rev-parse", "HEAD^{tree}")
        cls.unrelated = git(cls.origin, "commit-tree", tree, "-m", "Unrelated root")
        git(cls.origin, "update-ref", "refs/pull/2/head", cls.unrelated)
        git(cls.origin, "switch", "--quiet", "main")

    @classmethod
    def commit(cls, path):
        (cls.origin / path).write_text(path, encoding="utf-8")
        git(cls.origin, "add", "--", path)
        git(cls.origin, "commit", "--quiet", "-m", path)

    def clone(self, *, shallow):
        temp = tempfile.TemporaryDirectory(dir=self.root)
        self.addCleanup(temp.cleanup)
        checkout = Path(temp.name)
        depth = ["--depth=1"] if shallow else []
        git(checkout, "clone", "--quiet", *depth, self.origin.as_uri(), ".")
        self.assertEqual(git(checkout, "rev-parse", "--is-shallow-repository"),
                         "true" if shallow else "false")
        return checkout

    def snapshot(self, *, checkout, number=1, head=None, repo=review.REPO, target="main"):
        payload = {
            "head": {"sha": self.head if head is None else head, "repo": {"full_name": repo}},
            "base": {"sha": self.base, "ref": target},
        }
        with chdir(checkout), patch.object(review, "api", return_value=json.dumps(payload)):
            return review.pr_snapshot(number)

    def test_full_and_shallow_clones_return_the_same_pr_only_paths(self):
        expected_paths = ["pr 0.txt", "pr 1.txt", "pr 2.txt"]
        for shallow in (False, True):
            with self.subTest(shallow=shallow):
                checkout = self.clone(shallow=shallow)
                self.assertEqual(self.snapshot(checkout=checkout), (self.head, expected_paths))
                self.assertEqual(git(checkout, "rev-parse", "HEAD"), self.base)

    def test_rejects_a_moved_pr_head(self):
        with self.assertRaisesRegex(ValueError, "PR head changed"):
            self.snapshot(checkout=self.clone(shallow=True), head=self.base)

    def test_rejects_another_repository_or_target_branch(self):
        checkout = self.clone(shallow=True)
        for args in ({"repo": "someone/Reseptit"}, {"target": "other"}):
            with self.subTest(args=args), self.assertRaisesRegex(ValueError, "targeting main"):
                self.snapshot(checkout=checkout, **args)

    def test_rejects_invalid_revisions(self):
        with self.assertRaisesRegex(ValueError, "Invalid pull request revisions"):
            self.snapshot(checkout=self.clone(shallow=True), head="HEAD")

    def test_reports_fetch_failure(self):
        with self.assertRaisesRegex(ValueError, "git fetch failed"):
            self.snapshot(checkout=self.clone(shallow=True), number=404)

    def test_reports_missing_merge_base(self):
        with self.assertRaisesRegex(ValueError, "git diff failed"):
            self.snapshot(checkout=self.clone(shallow=True), number=2, head=self.unrelated)


if __name__ == "__main__":
    unittest.main()
