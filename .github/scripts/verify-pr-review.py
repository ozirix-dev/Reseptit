"""Read-only, head-bound review preflight for ozirix-dev/Reseptit PRs."""
import argparse
import json
import re
import subprocess

OWNER = "ozirix-dev"
REPO = "Reseptit"
CODEX_BOT_ID = 199175422
CODEX_APP_ID = 1144995
SUMMARY = "<!-- codex-pull-request-review-summary -->"
SUMMARY_STATE = re.compile(r"<!-- codex-review-state:v1 (\{[^\n]+\}) -->")
REVIEW_DECISIONS = {"APPROVED", "CHANGES_REQUESTED"}
THREADS = """
query($number:Int!, $cursor:String) {
  repository(owner:"ozirix-dev", name:"Reseptit") {
    pullRequest(number:$number) {
      headRefOid
      reviewThreads(first:100, after:$cursor) {
        nodes { isResolved }
        pageInfo { hasNextPage endCursor }
      }
    }
  }
}
"""


def codex_receipt(head, comments):
    summaries = []
    for comment in comments:
        user = comment["user"]
        app = comment.get("performed_via_github_app") or {}
        body = (comment["body"] or "").splitlines()
        if (user["id"] == CODEX_BOT_ID and user["type"] == "Bot"
                and app.get("id") == CODEX_APP_ID and body and body[0] == SUMMARY):
            summaries.append(comment)
    if not summaries:
        return None
    latest = max(summaries, key=lambda comment: (comment["updated_at"], comment["id"]))
    body = latest["body"].splitlines()
    match = SUMMARY_STATE.fullmatch(body[1]) if len(body) > 1 else None
    if not match:
        raise ValueError("Codex review summary has an unrecognized state marker")
    states = json.loads(match[1])
    for kind in ("code_review", "security_review"):
        state = states[kind]
        if state["commit_sha"] != head:
            continue
        if state["status"] != "completed" or state["has_unresolved_findings"] is not False:
            raise ValueError(f"Codex {kind} for {head} is incomplete or has unresolved findings")
    if states["code_review"]["commit_sha"] == head:
        return latest["html_url"]
    return None


def review_state(head, author, reviews, unresolved, comments=()):
    latest_decisions = {}
    # GitHub lists reviews chronologically. A new push does not resolve a change request.
    for review in reviews:
        user = review["user"]
        state = review["state"]
        if (user["id"] != author and user["type"] == "User"
                and review.get("maintainer_access")
                and state in REVIEW_DECISIONS):
            latest_decisions[user["id"]] = review
    if unresolved or any(review["state"] == "CHANGES_REQUESTED" for review in latest_decisions.values()):
        raise ValueError("Current PR has unresolved review threads or requested changes")
    receipt = codex_receipt(head, comments)
    independent = [
        review["html_url"] for review in latest_decisions.values()
        if review["state"] == "APPROVED" and review["commit_id"] == head
    ]
    if not receipt and not independent:
        raise ValueError("No SHA-bound Codex receipt or independent maintainer approval for " + head)
    return {"head": head, "codexReceipt": receipt, "independentApprovals": independent}


def api(*args):
    return json.loads(subprocess.check_output(["gh", "api", *args], encoding="utf-8"))


def check(number, head):
    path = f"repos/{OWNER}/{REPO}/pulls/{number}"
    pr = api(path)
    if pr["state"] != "open" or pr["draft"] or pr["head"]["sha"] != head:
        raise ValueError("Expected an open, Ready PR with the requested HEAD")
    reviews = []
    for page in api("--paginate", "--slurp", path + "/reviews?per_page=100"):
        reviews.extend(page)
    permissions = {}
    for review in reviews:
        user = review["user"]
        if (user["id"] == pr["user"]["id"] or user["type"] != "User"
                or review["state"] not in REVIEW_DECISIONS
                or review["author_association"] not in {"OWNER", "MEMBER", "COLLABORATOR"}):
            continue
        login = user["login"]
        if not re.fullmatch(r"[a-zA-Z0-9-]{1,39}", login):
            raise ValueError("Invalid review author login")
        if login not in permissions:
            access = api(f"repos/{OWNER}/{REPO}/collaborators/{login}/permission")
            permissions[login] = access["permission"] in {"write", "maintain", "admin"}
        review["maintainer_access"] = permissions[login]
    cursor = None
    unresolved = 0
    while True:
        args = ["graphql", "-f", "query=" + THREADS, "-F", f"number={number}"]
        if cursor:
            args.extend(("-f", "cursor=" + cursor))
        result = api(*args)
        if result.get("errors"):
            raise ValueError("GitHub could not read all review threads")
        pull_request = result["data"]["repository"]["pullRequest"]
        if pull_request["headRefOid"] != head:
            raise ValueError("PR HEAD changed during review verification")
        threads = pull_request["reviewThreads"]
        unresolved += sum(not thread["isResolved"] for thread in threads["nodes"])
        if not threads["pageInfo"]["hasNextPage"]:
            break
        cursor = threads["pageInfo"]["endCursor"]
    comments = [
        comment
        for page in api("--paginate", "--slurp", f"repos/{OWNER}/{REPO}/issues/{number}/comments?per_page=100")
        for comment in page
    ]
    latest = api(path)
    if latest["state"] != "open" or latest["draft"] or latest["head"]["sha"] != head:
        raise ValueError("PR state or HEAD changed during review verification")
    return review_state(head, pr["user"]["id"], reviews, unresolved, comments)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("number", type=int)
    parser.add_argument("head")
    args = parser.parse_args()
    if args.number < 1 or not re.fullmatch(r"[0-9a-f]{40}", args.head):
        parser.error("Use the PR number and full reviewed HEAD SHA")
    try:
        result = check(args.number, args.head)
    except (KeyError, TypeError, ValueError, OSError, subprocess.CalledProcessError) as exc:
        parser.exit(1, f"Review preflight blocked: {exc}\n")
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
