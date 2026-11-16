"""Read-only, head-bound review preflight for ozirix-dev/Reseptit PRs."""
import argparse
import json
import re
import subprocess

OWNER = "ozirix-dev"
REPO = "Reseptit"
CODEX_BOT_ID = 199175422
RECEIPT = "<!-- codex-review-receipt:v1 -->"
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


def review_state(head, author, reviews, unresolved):
    latest_approvals = {}
    receipt = None
    for review in reviews:
        if review["commit_id"] != head:
            continue
        user = review["user"]
        state = review["state"]
        if (user["id"] == CODEX_BOT_ID and user["type"] == "Bot" and state == "COMMENTED"
                and (review["body"] or "").lstrip().startswith(RECEIPT)):
            receipt = review["html_url"]
        if (user["id"] != author and user["type"] == "User"
                and review.get("maintainer_access")
                and state in {"APPROVED", "CHANGES_REQUESTED", "DISMISSED"}):
            latest_approvals[user["id"]] = (state, review["html_url"])
    if unresolved or any(state == "CHANGES_REQUESTED" for state, _ in latest_approvals.values()):
        raise ValueError("Current PR has unresolved review threads or requested changes")
    independent = [url for state, url in latest_approvals.values() if state == "APPROVED"]
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
        if (review["commit_id"] != head or user["id"] == pr["user"]["id"] or user["type"] != "User"
                or review["state"] not in {"APPROVED", "CHANGES_REQUESTED", "DISMISSED"}
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
    return review_state(head, pr["user"]["id"], reviews, unresolved)


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
