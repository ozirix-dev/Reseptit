from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path
import unittest

spec = spec_from_file_location("verify_pr_review", Path(__file__).resolve().parents[2] / ".github/scripts/verify-pr-review.py")
gate = module_from_spec(spec)
spec.loader.exec_module(gate)


def review(sha="current", author=gate.CODEX_BOT_ID, kind="Bot", state="COMMENTED", body=gate.RECEIPT):
    return {"commit_id": sha, "user": {"id": author, "type": kind}, "state": state, "body": body,
            "maintainer_access": True, "html_url": "review-url"}


class ReviewGateTests(unittest.TestCase):
    def test_only_real_exact_head_receipt_counts(self):
        for rows in ([], [review(sha="previous")], [review(author=4)], [review(body="Looks good")]):
            with self.assertRaisesRegex(ValueError, "No SHA-bound"):
                gate.review_state("current", 1, rows, 0)
        self.assertEqual(gate.review_state("current", 1, [review()], 0)["codexReceipt"], "review-url")

    def test_unresolved_threads_and_current_requested_changes_block(self):
        with self.assertRaisesRegex(ValueError, "unresolved"):
            gate.review_state("current", 1, [review()], 1)
        with self.assertRaisesRegex(ValueError, "requested changes"):
            gate.review_state("current", 1, [review(), review(author=2, kind="User", state="CHANGES_REQUESTED")], 0)

    def test_empty_codex_review_requires_an_exact_independent_approval(self):
        own = review(author=1, kind="User", state="APPROVED")
        other = review(author=2, kind="User", state="APPROVED")
        with self.assertRaisesRegex(ValueError, "No SHA-bound"):
            gate.review_state("current", 1, [own], 0)
        self.assertEqual(gate.review_state("current", 1, [other], 0)["independentApprovals"], ["review-url"])
        with self.assertRaisesRegex(ValueError, "No SHA-bound"):
            gate.review_state("current", 1, [{**other, "maintainer_access": False}], 0)
        with self.assertRaisesRegex(ValueError, "No SHA-bound"):
            gate.review_state("current", 1, [other, {**other, "state": "DISMISSED"}], 0)
