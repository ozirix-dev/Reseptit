"""Read public Recipe site evidence without checking out or executing PR code."""

import io
import json
import os
import re
import subprocess
import zipfile
from pathlib import Path

REPO = "ozirix-dev/Reseptit"
RESULT = Path("/tmp/gh-aw/agent/recipavo-review-input.json")
FI_PATH = r"reseptit/(?:aamupalat|valipalat|alkuruoat|paaruoat|jalkiruoat|leivonnaiset)/[a-z0-9-]+\.md"
EN_SV_TH_PATH = r"kaannokset/(en|sv|th)/[a-z0-9-]+/[a-z0-9-]+\.md"
PENDING_PATH = r"docs/reviews/valipalat/(?:katselmointi|luonnokset)/[a-z0-9-]+\.md"
SIMILARITY_PATH = rf"(?:{FI_PATH}|{PENDING_PATH})"
SHA = r"[0-9a-f]{40}"
RESET = re.compile(r"\x1b\[[0-?]*[ -/]*[@-~]")
PAIR_LIMIT = 5

def command(*args):
    result = subprocess.run(args, capture_output=True, timeout=90, check=False)
    if result.returncode:
        raise ValueError(f"{args[0]} {args[1]} failed (exit {result.returncode}).")
    return result.stdout

def api(path):
    return command("gh", "api", "--allow-escape-sequences", f"repos/{REPO}/{path}")

def number(name, *, positive=True):
    value = os.environ.get(name, "").strip()
    if not re.fullmatch(r"[0-9]{1,15}", value) or (positive and int(value) == 0):
        raise ValueError(f"{name}: supply a valid numeric input.")
    return int(value)

def field(text, name, pattern):
    frontmatter = re.match(r"^---\r?\n(.*?)\r?\n---(?:\r?\n|$)", text, re.S)
    match = frontmatter and re.search(
        rf"""^{name}:\s*["']?({pattern})["']?[ \t]*$""", frontmatter[1], re.M
    )
    return match[1] if match else None

def blob(commit, path):
    spec = f"{commit}:{path}"
    try:
        kind = command("git", "cat-file", "-t", spec).strip()
        size = int(command("git", "cat-file", "-s", spec))
    except ValueError:
        return None
    if kind != b"blob" or size > 9_000:
        return None
    return command("git", "cat-file", "blob", spec).decode("utf-8", errors="replace")

def pr_snapshot(pr_number):
    pr = json.loads(api(f"pulls/{pr_number}"))
    head_repo = (pr["head"]["repo"] or {}).get("full_name", "")
    if head_repo.lower() != REPO.lower() or pr["base"]["ref"] != "main":
        raise ValueError("Choose a same-repository pull request targeting main.")
    head, base = pr["head"]["sha"], pr["base"]["sha"]
    if not all(re.fullmatch(SHA, sha) for sha in (head, base)):
        raise ValueError("Invalid pull request revisions.")
    command("git", "fetch", "--no-tags", "origin", f"refs/pull/{pr_number}/head", base)
    fetched = command("git", "rev-parse", "FETCH_HEAD").decode().strip()
    if head != fetched:
        raise ValueError("The PR head changed while preparing the review. Start a new run.")
    paths = command("git", "diff", "--name-only", "-z", "--diff-filter=ACMRT", f"{base}...{head}")
    return head, paths.decode().split("\0")[:-1]

def translations(pr_number, offset):
    head, paths = pr_snapshot(pr_number)
    selected = sorted(path for path in paths if re.fullmatch(EN_SV_TH_PATH, path))
    pairs = []
    for path in selected[offset:offset + PAIR_LIMIT]:
        translation = blob(head, path)
        source_path = field(translation or "", "source_recipe", FI_PATH)
        recipe_id = field(translation or "", "recipe_id", r"[a-z0-9-]+")
        source = blob(head, source_path) if source_path else None
        if not recipe_id or field(source or "", "recipe_id", r"[a-z0-9-]+") != recipe_id:
            source = None
        pairs.append({
            "id": recipe_id, "language": path.split("/")[1],
            "translation_path": path, "translation": translation,
            "source_path": source_path, "finnish_source": source,
        })
    return {
        "pr": pr_number, "head_sha": head, "offset": offset,
        "total_changed_translations": len(selected), "pairs": pairs,
        "next_offset": offset + len(pairs) if pairs and offset + len(pairs) < len(selected) else None,
    }

def run_info(run_id):
    run = json.loads(api(f"actions/runs/{run_id}"))
    if run["path"] != ".github/workflows/pages.yml" or run["status"] != "completed":
        raise ValueError("Choose a completed Recipe site run.")
    jobs = json.loads(api(f"actions/runs/{run_id}/attempts/{run['run_attempt']}/jobs?per_page=100"))
    return run, jobs["jobs"]

def job_log(job):
    data = api(f"actions/jobs/{job['id']}/logs")
    return RESET.sub("", data.decode("utf-8", errors="replace"))

def playwright_diagnostics(run_id):
    artifacts = json.loads(api(f"actions/runs/{run_id}/artifacts?per_page=100"))
    artifact = next((item for item in artifacts["artifacts"]
                     if item["name"] == "recipe-site-browser-diagnostics" and not item["expired"]), None)
    if not artifact or artifact["size_in_bytes"] > 10_000_000:
        return []
    try:
        data = api(f"actions/artifacts/{artifact['id']}/zip")
        with zipfile.ZipFile(io.BytesIO(data)) as archive:
            entries = [item for item in archive.infolist()
                       if not item.is_dir() and item.filename.endswith(("error-context.md", ".log", ".txt"))]
            return [
                {"path": item.filename, "excerpt": archive.open(item).read(1800).decode("utf-8", errors="replace")}
                for item in entries[:4]
            ]
    except (ValueError, OSError, zipfile.BadZipFile):
        return []

def ci_failure(run_id):
    run, jobs = run_info(run_id)
    if run["conclusion"] not in {"failure", "timed_out"}:
        raise ValueError("Choose a failed or timed out Recipe site run.")
    failures = []
    for job in [job for job in jobs if job["conclusion"] in {"failure", "timed_out"}][:3]:
        failed = [step["name"] for step in (job.get("steps") or [])
                  if step["conclusion"] in {"failure", "timed_out"}]
        logs = job_log(job)
        lines = logs.splitlines()
        anchors = [index for index, line in enumerate(lines) if re.search(
            r"##\[error\]|\b(?:Error|AssertionError|TimeoutError|FAIL)\b", line, re.I
        )]
        indices = sorted({near for index in anchors[-45:]
                          for near in range(max(0, index - 3), min(len(lines), index + 4))})
        combined = "\n".join(lines[index] for index in indices) if indices else "\n".join(lines[-70:])
        failures.append({"job": job["name"], "failed_steps": failed, "log_excerpt": combined[-9000:]})
    return {
        "run_url": run["html_url"], "head_sha": run["head_sha"], "failures": failures,
        "playwright_excerpts": playwright_diagnostics(run_id),
    }

def similarity(pr_number, run_id):
    head, paths = pr_snapshot(pr_number)
    run, jobs = run_info(run_id)
    if run["event"] != "pull_request" or run["head_sha"] != head:
        raise ValueError("Use the Recipe site pull_request run for the exact current PR head.")
    associations = run.get("pull_requests", [])
    if associations and pr_number not in {pr["number"] for pr in associations}:
        raise ValueError("The Recipe site run belongs to another pull request.")
    build = next((job for job in jobs if job["name"] == "build"), None)
    if not build:
        raise ValueError("Recipe site build job is missing.")
    logs = job_log(build)
    report = re.search(
        r"# Recipavo – reseptien samankaltaisuustarkistus.*?Samankaltaisuusluvut[^\n]*", logs, re.S
    )
    if not report:
        raise ValueError("The existing changed-recipe similarity audit did not produce a report in this run.")
    tested = re.search(rf"(?m)\[command\][^\r\n]*git log -1 --format=%H\r?\n\S+ ({SHA})\r?$", logs)
    if not tested:
        raise ValueError("Cannot identify the tested recipe snapshot from the build log.")
    tested_sha = tested[1]
    command("git", "fetch", "--no-tags", "origin", tested_sha)
    parents = command("git", "show", "-s", "--format=%P", tested_sha).decode().split()
    if len(parents) != 2 or parents[1] != head:
        raise ValueError("The build snapshot does not contain the selected PR head.")
    lines = re.sub(r"(?m)^\d{4}-\d\d-\d\dT\S+ ", "", report[0]).splitlines()
    changed = {}
    for path in paths:
        if re.fullmatch(SIMILARITY_PATH, path):
            contents = blob(head, path)
            recipe_id = field(contents or "", "recipe_id", r"[a-z0-9-]+")
            if recipe_id:
                changed[recipe_id] = path

    shortlisted = []
    candidate_id = None
    for line in lines:
        heading = re.match(r"## ([a-z0-9-]+) — ", line)
        if heading:
            candidate_id = heading[1]
        match = re.search(rf"\(([a-z0-9-]+)\) – ({SIMILARITY_PATH}); score ([\d.]+)", line)
        if candidate_id and match:
            shortlisted.append((candidate_id, *match.groups()))
    pairs = []
    for candidate_id, match_id, match_path, score in shortlisted[:PAIR_LIMIT]:
        candidate_path = changed.get(candidate_id)
        pairs.append({
            "candidate_id": candidate_id, "candidate_path": candidate_path,
            "candidate": blob(tested_sha, candidate_path) if candidate_path else None,
            "match_id": match_id, "match_path": match_path, "score": score,
            "match": blob(tested_sha, match_path),
        })
    return {
        "pr": pr_number, "head_sha": head, "run_url": run["html_url"],
        "tested_sha": tested_sha, "audit_summary": "\n".join(lines[:10]),
        "shortlisted_matches": len(shortlisted), "pairs": pairs,
    }

def main():
    mode = os.environ["REVIEW_MODE"]
    if mode == "translations":
        data = translations(number("REVIEW_PR"), number("REVIEW_OFFSET", positive=False))
    elif mode == "ci-failure":
        data = ci_failure(number("REVIEW_CI_RUN"))
    elif mode == "similarity":
        data = similarity(number("REVIEW_PR"), number("REVIEW_CI_RUN"))
    else:
        raise ValueError("Unknown review mode.")

    payload = json.dumps({"mode": mode, **data}, ensure_ascii=False)
    if len(payload.encode()) > 100_000:
        raise ValueError("Review packet is too large for this pilot.")
    RESULT.parent.mkdir(parents=True, exist_ok=True)
    RESULT.write_text(payload, encoding="utf-8")
    if "pairs" in data and not data["pairs"]:
        with open(os.environ["GITHUB_STEP_SUMMARY"], "a", encoding="utf-8") as summary:
            summary.write("## Recipavo: ei vertailupareja valitussa erässä\n")
        output_path = Path(os.environ["GH_AW_SAFE_OUTPUTS"])
        output_path.parent.mkdir(parents=True, exist_ok=True)
        with output_path.open("a", encoding="utf-8") as outputs:
            outputs.write('{"type":"noop","message":"No review pairs in the selected batch."}\n')

if __name__ == "__main__":
    try:
        main()
    except (ValueError, subprocess.TimeoutExpired) as exc:
        raise SystemExit(str(exc)) from None
