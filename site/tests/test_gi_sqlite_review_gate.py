from importlib.util import module_from_spec, spec_from_file_location
import json
from pathlib import Path
import unittest

spec = spec_from_file_location("verify_pr_review", Path(__file__).resolve().parents[2] / ".github/scripts/verify-pr-review.py")
gate = module_from_spec(spec)
spec.loader.exec_module(gate)


def review(sha="current", author=2, state="APPROVED"):
    return {"commit_id": sha, "user": {"id": author, "type": "User"}, "state": state,
            "maintainer_access": True, "html_url": "review-url"}


def summary(sha="current", *, status="completed", unresolved=False, security_sha=None, id_=1):
    state = {
        "code_review": {"commit_sha": sha, "status": status, "has_unresolved_findings": unresolved},
        "security_review": {"commit_sha": security_sha, "status": None, "has_unresolved_findings": None},
    }
    return {"id": id_, "updated_at": "2026-11-17T00:00:00Z", "html_url": "summary-url",
            "user": {"id": gate.CODEX_BOT_ID, "type": "Bot"},
            "performed_via_github_app": {"id": gate.CODEX_APP_ID},
            "body": f"{gate.SUMMARY}\n<!-- codex-review-state:v1 {json.dumps(state)} -->\n\n<details>\n"}


class ReviewGateTests(unittest.TestCase):
    def test_only_latest_exact_head_summary_from_the_codex_app_counts(self):
        for comments in ([], [summary("previous")], [summary(), summary("previous", id_=2)],
                         [{**summary(), "user": {"id": 4, "type": "User"}}],
                         [{**summary(), "performed_via_github_app": None}]):
            with self.assertRaisesRegex(ValueError, "No SHA-bound"):
                gate.review_state("current", 1, [], 0, comments)
        self.assertEqual(gate.review_state("current", 1, [], 0, [summary()])["codexReceipt"], "summary-url")

    def test_incomplete_review_or_open_findings_block_even_with_an_approval(self):
        for comment in (summary(status="in_progress"), summary(unresolved=True),
                        summary(unresolved=None), summary(security_sha="current")):
            with self.assertRaisesRegex(ValueError, "incomplete or has unresolved"):
                gate.review_state("current", 1, [review()], 0, [comment])

    def test_unrecognized_trusted_summary_blocks(self):
        with self.assertRaisesRegex(ValueError, "unrecognized state"):
            gate.review_state("current", 1, [review()], 0, [{**summary(), "body": gate.SUMMARY}])

    def test_unresolved_threads_and_current_requested_changes_block(self):
        with self.assertRaisesRegex(ValueError, "unresolved"):
            gate.review_state("current", 1, [], 1, [summary()])
        with self.assertRaisesRegex(ValueError, "requested changes"):
            gate.review_state("current", 1, [review(state="CHANGES_REQUESTED")], 0, [summary()])

    def test_empty_codex_review_requires_an_exact_independent_approval(self):
        own = review(author=1)
        other = review()
        with self.assertRaisesRegex(ValueError, "No SHA-bound"):
            gate.review_state("current", 1, [own], 0)
        with self.assertRaisesRegex(ValueError, "No SHA-bound"):
            gate.review_state("current", 1, [review(sha="previous")], 0)
        self.assertEqual(gate.review_state("current", 1, [other], 0)["independentApprovals"], ["review-url"])
        with self.assertRaisesRegex(ValueError, "No SHA-bound"):
            gate.review_state("current", 1, [{**other, "maintainer_access": False}], 0)
        with self.assertRaisesRegex(ValueError, "No SHA-bound"):
            gate.review_state("current", 1, [other, {**other, "state": "DISMISSED"}], 0)
