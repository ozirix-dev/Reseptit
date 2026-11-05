#!/usr/bin/env python3
"""GK80 batch controller: opt-in, bounded, restartable local Codex research runs.

No GitHub writes, network requests, model calls or Codex processes occur on import,
init, status, stop, resume, plan or handoff. Only step/run --execute start Codex.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
import time
from datetime import datetime, timezone

EXPECTED_REPO = "ozirix-dev/Reseptit"
STATE_DIR = ".gk80-controller"
EVIDENCE_PREFIX = "docs/research/gk80-batch30/"
STATES = {"NEW", "RESEARCH", "CALCULATED", "VERIFIED", "HOLD", "EXCLUDED"}
REQUIRED_CHECKS = ("source", "amount", "gi", "omission", "hash")
HEX64 = re.compile(r"^[a-f0-9]{64}$")
RECIPE_ID = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")


class GateError(Exception):
    """A failed safety or progress gate: stop, preserve evidence, do not retry."""


def utcnow() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def atomic_json(path: Path, value: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temp = path.with_name(path.name + ".tmp")
    with temp.open("w", encoding="utf-8", newline="\n") as stream:
        json.dump(value, stream, indent=2, ensure_ascii=False, sort_keys=True)
        stream.write("\n")
        stream.flush()
        os.fsync(stream.fileno())
    os.replace(temp, path)


def load_json(path: Path) -> dict:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, ValueError) as exc:
        raise GateError(f"Invalid or missing JSON: {path}: {exc}") from exc
    if not isinstance(value, dict):
        raise GateError(f"Expected JSON object: {path}")
    return value


def git(root: Path, *args: str) -> str:
    try:
        done = subprocess.run(
            ["git", "-C", str(root), *args], check=True,
            stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True,
            encoding="utf-8", errors="replace", timeout=25,
        )
    except (OSError, subprocess.SubprocessError) as exc:
        raise GateError(f"Git guard failed: {args}: {exc}") from exc
    return done.stdout.strip()


def guard(root: Path, expected_branch: str | None = None) -> tuple[str, str]:
    if not root.is_dir():
        raise GateError(f"Worktree is missing: {root}")
    top = Path(git(root, "rev-parse", "--show-toplevel")).resolve()
    if top != root.resolve():
        raise GateError(f"Use the worktree root, not a parent or child: {top}")
    origin = git(root, "remote", "get-url", "origin").rstrip("/")
    if origin.endswith(".git"):
        origin = origin[:-4]
    allowed = {
        "https://github.com/" + EXPECTED_REPO,
        "git@github.com:" + EXPECTED_REPO,
        "ssh://git@github.com/" + EXPECTED_REPO,
    }
    if origin not in allowed:
        raise GateError(f"Wrong origin (expected {EXPECTED_REPO}): {origin}")
    branch = git(root, "symbolic-ref", "--quiet", "--short", "HEAD")
    if branch in {"main", "master"} or not branch.startswith("codex/gk80-batch30-"):
        raise GateError("Use a dedicated codex/gk80-batch30-* research worktree branch")
    if expected_branch and branch != expected_branch:
        raise GateError(f"Unexpected branch owner: {branch} != {expected_branch}")
    return branch, git(root, "rev-parse", "HEAD")


def paths(root: Path) -> dict[str, Path]:
    directory = root / STATE_DIR
    return {
        "directory": directory,
        "queue": directory / "queue.json",
        "state": directory / "state.json",
        "lock": directory / "active.lock",
        "stop": directory / "STOP",
        "logs": directory / "logs",
    }


def validate_queue(root: Path, queue: dict, target: int) -> dict[str, int]:
    if queue.get("schemaVersion") != 1 or queue.get("target") != target:
        raise GateError("Queue schemaVersion or target does not match the pinned run")
    candidates = queue.get("candidates")
    if not isinstance(candidates, list) or len(candidates) > 326:
        raise GateError("Queue candidates must be a list of at most 326 IDs")
    seen: set[str] = set()
    counts = {state: 0 for state in STATES}
    for item in candidates:
        if not isinstance(item, dict):
            raise GateError("Candidate must be a JSON object")
        recipe_id, status = item.get("recipeId"), item.get("status")
        if not isinstance(recipe_id, str) or not RECIPE_ID.fullmatch(recipe_id):
            raise GateError(f"Invalid recipe ID: {recipe_id}")
        if recipe_id in seen:
            raise GateError(f"Duplicate candidate ID: {recipe_id}")
        seen.add(recipe_id)
        if status not in STATES:
            raise GateError(f"Invalid status for {recipe_id}: {status}")
        counts[status] += 1
        if status == "VERIFIED":
            checks = item.get("checks", {})
            if not isinstance(checks, dict) or any(checks.get(k) is not True for k in REQUIRED_CHECKS):
                raise GateError(f"Missing independent review checklist for {recipe_id}")
            if not isinstance(item.get("sources"), list) or not item["sources"]:
                raise GateError(f"Missing GI/composition source references for {recipe_id}")
            if not all(isinstance(s, dict) and isinstance(s.get("url"), str)
                       and s["url"].startswith("https://") for s in item["sources"]):
                raise GateError(f"Invalid sources for {recipe_id}")
            if type(item.get("servings")) is not int or item["servings"] <= 0:
                raise GateError(f"Missing serving count for {recipe_id}")
            if type(item.get("ingredientCount")) is not int or item["ingredientCount"] < 1:
                raise GateError(f"Missing ingredient inventory for {recipe_id}")
            for name in ("gkPerServing", "omittedChoPerServing"):
                value = item.get(name)
                if type(value) not in (int, float) or value < 0 or value != value or value == float("inf"):
                    raise GateError(f"Invalid {name} for {recipe_id}")
            for name in ("inputSha256", "evidenceSha256"):
                if not isinstance(item.get(name), str) or not HEX64.fullmatch(item[name]):
                    raise GateError(f"Missing SHA-256 {name} for {recipe_id}")
            input_file = evidence_file(root, item.get("inputPath"), recipe_id)
            if sha256(input_file.read_bytes()) != item["inputSha256"]:
                raise GateError(f"Input SHA-256 mismatch for {recipe_id}")
            input_object = load_json(input_file)
            if input_object.get("recipeId") != recipe_id:
                raise GateError(f"Input identity mismatch for {recipe_id}")
            evidence = evidence_file(root, item.get("evidencePath"), recipe_id)
            if sha256(evidence.read_bytes()) != item["evidenceSha256"]:
                raise GateError(f"Evidence SHA-256 mismatch for {recipe_id}")
            proof = load_json(evidence)
            if proof.get("recipeId") != recipe_id or proof.get("inputSha256") != item["inputSha256"]:
                raise GateError(f"Evidence identity mismatch for {recipe_id}")
        elif status == "HOLD" and not str(item.get("blocker", "")).strip():
            raise GateError(f"HOLD requires a specific blocker: {recipe_id}")
    if counts["VERIFIED"] > target:
        raise GateError("More VERIFIED IDs than the agreed target; review queue")
    return counts


def evidence_file(root: Path, relative: str, recipe_id: str) -> Path:
    """Keep input and evidence within the physical research directory, not just the repo."""
    if not isinstance(relative, str) or not relative.startswith(EVIDENCE_PREFIX):
        raise GateError(f"Evidence must be in {EVIDENCE_PREFIX}: {recipe_id}")
    canonical_root = root.resolve()
    expected_dir = canonical_root / EVIDENCE_PREFIX
    actual_dir = (root / EVIDENCE_PREFIX).resolve()
    if actual_dir != expected_dir:
        raise GateError(f"Unsafe evidence directory symlink for {recipe_id}")
    resolved = (root / relative).resolve()
    if not resolved.is_relative_to(expected_dir) or not resolved.is_file() or resolved.suffix != ".json":
        raise GateError(f"Unsafe or missing evidence path for {recipe_id}")
    return resolved


def check_research_scope(root: Path, baseline_sha: str) -> None:
    """Fail closed on changes outside the approved research directory, including commits."""
    modified = git(root, "diff", "--name-only", baseline_sha, "--").splitlines()
    untracked = git(root, "ls-files", "--others", "--exclude-standard").splitlines()
    unexpected = sorted({f for f in modified + untracked
                         if f and not (f.replace("\\\\", "/").startswith(EVIDENCE_PREFIX)
                                       or f.replace("\\\\", "/").startswith(STATE_DIR + "/"))})
    if unexpected:
        raise GateError("Unapproved research worktree changes: " + ", ".join(unexpected[:12]))


def checked_queue_after_turn(root: Path, old_queue: dict, p: dict, target: int) -> tuple[dict, dict | None, str | None]:
    """Recover interrupted/partial queue writes without treating them as progress."""
    try:
        new_queue = load_json(p["queue"])
        counts = validate_queue(root, new_queue, target)
        return new_queue, counts, None
    except GateError as exc:
        atomic_json(p["queue"], old_queue)
        try:
            prior_counts = validate_queue(root, old_queue, target)
        except GateError:
            prior_counts = None  # An overwritten evidence file now requires manual repair.
        return old_queue, prior_counts, str(exc)


def active(root: Path) -> tuple[dict, dict, dict[str, Path]]:
    p = paths(root)
    state = load_json(p["state"])
    for key in ("target", "maxTurns", "maxStaleTurns", "turns", "staleTurns"):
        if type(state.get(key)) is not int:
            raise GateError(f"Invalid controller-owned state field: {key}")
    if (state.get("schemaVersion") != 1 or state["target"] != 30
            or not 1 <= state["maxTurns"] <= 40
            or not 1 <= state["maxStaleTurns"] <= 8
            or not 0 <= state["turns"] <= state["maxTurns"]
            or not 0 <= state["staleTurns"] <= state["maxTurns"]):
        raise GateError("Controller-owned state budget or schema was altered")
    if not isinstance(state.get("startSha"), str) or not re.fullmatch(r"[0-9a-f]{40}", state["startSha"]):
        raise GateError("Invalid pinned research starting SHA")
    guard(root, state.get("branch"))
    queue = load_json(p["queue"])
    validate_queue(root, queue, state["target"])
    return state, queue, p


def summary(state: dict, counts: dict, queue: dict) -> dict:
    return {
        "phase": state["phase"], "turns": state["turns"],
        "maxTurns": state["maxTurns"], "target": state["target"],
        "verified": counts["VERIFIED"], "calculated": counts["CALCULATED"],
        "research": counts["RESEARCH"], "hold": counts["HOLD"],
        "excluded": counts["EXCLUDED"], "queued": len(queue["candidates"]),
        "lastExit": state.get("lastExit"), "reason": state.get("reason", ""),
        "branch": state["branch"], "pinnedStartSha": state["startSha"],
    }


def acquire(lock: Path) -> None:
    try:
        with lock.open("x", encoding="utf-8") as stream:
            stream.write(f"pid={os.getpid()} started={utcnow()}\n")
    except FileExistsError as exc:
        raise GateError(f"Another controller owns {lock}; inspect before manually clearing") from exc


def prompt(root: Path, state: dict, counts: dict) -> str:
    return f"""GK80 CONTROLLER – ONE RESEARCH TURN, NOT THE WHOLE JOB.
This is an isolated research worktree. Branch owner: {state['branch']}.
Pinned source HEAD at initialization: {state['startSha']}.
Read AGENTS.md and docs/rinnakkaiset-codex-ajot.md. Verify repo_guard.
The supervisor tracks progress in {paths(root)['queue']}.
Goal: {state['target']} UNIQUE, SOURCE-DOCUMENTED, VERIFIED recipe IDs.
Current VERIFIED: {counts['VERIFIED']}. The previous nine research scenarios are
NOT pre-approved: inspect them and import no better than CALCULATED.
In this turn screen 5-8 available recipe IDs. Finish at most 3-5 new
evidence packages. Prefer reusable validated composition and GI sources.
HOLD any single blocked recipe with one exact blocker, then immediately
select a different recipe. Do not spend the whole turn on one GI source.
Consult current main and open PRs before adding IDs; omit already
published and other writers' IDs. Recheck before preparing any handoff.
Write immutable per-recipe input JSON and completed source/amount/serving/
preparation/omission evidence JSON under docs/research/gk80-batch30/.
Both JSON objects need recipeId; evidence JSON also has inputSha256.
Update .gk80-controller/queue.json, schemaVersion 1, target {state['target']},
candidates list. For VERIFIED, include checks source/amount/gi/omission/hash
each true, sources with HTTPS URLs, gkPerServing, omittedChoPerServing,
servings, ingredientCount, inputPath, inputSha256, evidencePath, evidenceSha256.
Both hashes MUST be calculated from the corresponding real on-disk files.
Do not mark VERIFIED on a guessed hash or on a placeholder file.
VERIFIED requires genuine source and content review, not just arithmetic;
the controller checks structural integrity, not scientific validity.
Leave uncertain candidates CALCULATED or HOLD. Never invent GI or mass data.
Persist the queue and files before ending this turn. When one result is
ready, CONTINUE with the next within the turn. Do not call interim reports
complete; do not ask the user to restart from 7/30, 8/30 or 9/30.
DO NOT change original recipes, public GK output, source catalogs or
other owners' branches. DO NOT push, create PRs, merge, publish, deploy,
change GitHub Actions, bypass sandbox or change the model. No unrelated tests.
The controller may call another turn. End with a concise checkpoint only.
"""


def one_turn(root: Path, state: dict, queue: dict, p: dict, executable: str,
             seconds: int, execute: bool) -> bool:
    counts = validate_queue(root, queue, state["target"])
    if counts["VERIFIED"] >= state["target"]:
        state["phase"], state["reason"] = "READY_FOR_DRAFT", "30 structural gates passed"
        atomic_json(p["state"], state)
        return False
    if state["turns"] >= state["maxTurns"]:
        state["phase"], state["reason"] = "STOPPED_BUDGET", "Maximum local turns reached"
        atomic_json(p["state"], state)
        return False
    if p["stop"].exists():
        state["phase"], state["reason"] = "STOPPED_REQUESTED", "STOP file present"
        atomic_json(p["state"], state)
        return False
    text = prompt(root, state, counts)
    if not execute:
        print("DRY RUN – no Codex started.\n" + text)
        return False
    resolved_codex = shutil.which(executable)
    if not resolved_codex:
        raise GateError(f"Codex executable not found: {executable}")
    check_research_scope(root, state["startSha"])
    acquire(p["lock"])
    # Material progress, not a repeatedly edited prose note or timestamp.
    def fingerprint(q: dict) -> str:
        items = [(v.get("recipeId"), v.get("status"), v.get("evidenceSha256"), v.get("blocker"))
                 for v in q["candidates"]]
        return json.dumps(sorted(items), sort_keys=True, ensure_ascii=False)
    previous = fingerprint(queue)
    state["phase"], state["reason"] = "RUNNING", ""
    atomic_json(p["state"], state)
    p["logs"].mkdir(parents=True, exist_ok=True)
    logfile = p["logs"] / f"turn-{state['turns'] + 1:03}.jsonl"
    started = time.monotonic()
    result_code = -1
    stopped = False
    try:
        # No shell interpolation, no API key handling, no approval/sandbox bypass.
        cmd = [resolved_codex, "exec", "--sandbox", "workspace-write",
               "-C", str(root), "--json", "-"]
        with logfile.open("wb") as log:
            proc = subprocess.Popen(
                cmd, cwd=root, stdin=subprocess.PIPE,
                stdout=log, stderr=subprocess.STDOUT,
            )
            assert proc.stdin is not None
            proc.stdin.write(text.encode("utf-8"))
            proc.stdin.close()
            while proc.poll() is None:
                if p["stop"].exists() or time.monotonic() - started > seconds:
                    stopped = True
                    proc.terminate()
                    try:
                        proc.wait(timeout=8)
                    except subprocess.TimeoutExpired:
                        proc.kill()
                        proc.wait(timeout=8)
                    break
                time.sleep(0.5)
            result_code = proc.returncode if proc.returncode is not None else -1
    except KeyboardInterrupt:
        if "proc" in locals() and proc.poll() is None:
            proc.terminate()
            try:
                proc.wait(timeout=8)
            except subprocess.TimeoutExpired:
                proc.kill()
                proc.wait(timeout=8)
        state["turns"] += 1
        state["phase"], state["reason"] = "STOPPED_REQUESTED", "Ctrl+C interrupted the local Codex turn"
        atomic_json(p["state"], state)
        return False
    except (OSError, subprocess.SubprocessError) as exc:
        state["turns"] += 1
        state["phase"], state["reason"] = "STOPPED_CODEX_ERROR", str(exc)
        atomic_json(p["state"], state)
        return False
    finally:
        p["lock"].unlink(missing_ok=True)

    state["turns"] += 1
    state["lastExit"] = result_code
    state["lastLog"] = str(logfile.relative_to(root))
    state["updated"] = utcnow()
    try:
        guard(root, state["branch"])
        check_research_scope(root, state["startSha"])
    except GateError as exc:
        state["phase"], state["reason"] = "STOPPED_GUARD", str(exc)
        atomic_json(p["state"], state)
        return False

    new_queue, new_counts, recovery_error = checked_queue_after_turn(
        root, queue, p, state["target"])
    if recovery_error:
        state["phase"], state["reason"] = (
            "STOPPED_INVALID_QUEUE",
            f"Restored prior queue after interrupted/invalid write: {recovery_error}"
            + ("; previous evidence also changed, manual repair required" if new_counts is None else ""),
        )
        atomic_json(p["state"], state)
        return False
    if stopped:
        state["phase"] = "STOPPED_REQUESTED" if p["stop"].exists() else "STOPPED_TIMEOUT"
        state["reason"] = "Explicit stop or bounded per-turn timeout; valid queue checkpoint preserved"
        state["lastVerified"] = new_counts["VERIFIED"]
        atomic_json(p["state"], state)
        return False
    unchanged = fingerprint(new_queue) == previous
    state["staleTurns"] = state.get("staleTurns", 0) + 1 if unchanged else 0
    state["lastVerified"] = new_counts["VERIFIED"]
    if result_code != 0:
        state["phase"], state["reason"] = "STOPPED_CODEX_ERROR", f"Codex exit={result_code}; see {logfile}"
    elif new_counts["VERIFIED"] >= state["target"]:
        state["phase"], state["reason"] = "READY_FOR_DRAFT", "Target reached; human PR handoff needed"
    elif state["staleTurns"] >= state["maxStaleTurns"]:
        state["phase"], state["reason"] = "STOPPED_STALLED", "Repeated turns made no queue change"
    elif state["turns"] >= state["maxTurns"]:
        state["phase"], state["reason"] = "STOPPED_BUDGET", "Maximum local turns reached"
    else:
        state["phase"], state["reason"] = "PAUSED", "Ready for another bounded turn"
    atomic_json(p["state"], state)
    print(json.dumps(summary(state, new_counts, new_queue), ensure_ascii=False, indent=2))
    return state["phase"] == "PAUSED"


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--worktree", type=Path, required=True, help="Dedicated Reseptit research Git worktree")
    subs = parser.add_subparsers(dest="action", required=True)
    init = subs.add_parser("init", help="Create local queue; never runs Codex")
    init.add_argument("--branch", required=True, help="Owned codex/gk80-batch30-* branch")
    init.add_argument("--target", type=int, default=30)
    init.add_argument("--max-turns", type=int, default=12)
    init.add_argument("--max-stale-turns", type=int, default=3)
    subs.add_parser("status", help="Read-only summary")
    subs.add_parser("stop", help="Request cooperative stop (also terminates current local Codex process)")
    subs.add_parser("resume", help="Explicitly clear STOP and resume a stopped local queue")
    subs.add_parser("handoff", help="Create a local Markdown evidence manifest (never PR/push)")
    for name in ("step", "run"):
        q = subs.add_parser(name)
        q.add_argument("--execute", action="store_true", help="Required to start a Codex process")
        q.add_argument("--codex", default="codex")
        q.add_argument("--max-seconds", type=int, default=1200)
        if name == "run":
            q.add_argument("--turn-limit", type=int, default=6, help="Additional turns in this invocation")
    args = parser.parse_args(argv)
    root = args.worktree.resolve()
    p = paths(root)
    try:
        if args.action == "init":
            branch, sha = guard(root, args.branch)
            if args.target != 30 or not 1 <= args.max_turns <= 40 or not 1 <= args.max_stale_turns <= 8:
                raise GateError("V1 is limited to target=30, 1-40 turns, 1-8 stale turns")
            if p["state"].exists() or p["lock"].exists():
                raise GateError("Existing queue or active owner: never overwrite; use status/resume")
            queue = {"schemaVersion": 1, "target": args.target, "candidates": []}
            state = {"schemaVersion": 1, "target": args.target, "branch": branch,
                     "startSha": sha, "turns": 0, "maxTurns": args.max_turns,
                     "maxStaleTurns": args.max_stale_turns, "staleTurns": 0,
                     "phase": "PAUSED", "lastExit": None, "created": utcnow()}
            atomic_json(p["queue"], queue)
            atomic_json(p["state"], state)
            print(json.dumps(summary(state, validate_queue(root, queue, args.target), queue),
                             ensure_ascii=False, indent=2))
            return 0
        if args.action == "stop":
            # Stop must work even while another process owns active.lock.
            state = load_json(p["state"])
            guard(root, state["branch"])
            p["stop"].write_text(f"STOP requested {utcnow()}\n", encoding="utf-8")
            print(f"STOP requested: {p['stop']}")
            return 0
        state, queue, p = active(root)
        if args.action == "status":
            print(json.dumps(summary(state, validate_queue(root, queue, state["target"]), queue),
                             ensure_ascii=False, indent=2))
            return 0
        if args.action == "resume":
            if p["lock"].exists():
                raise GateError("Controller lock is present; do not clear a live session")
            if state["phase"] == "READY_FOR_DRAFT":
                raise GateError("Target achieved; use handoff, not resume")
            if state["turns"] >= state["maxTurns"]:
                raise GateError("Turn budget exhausted; requires explicit new plan")
            if state["phase"] == "STOPPED_GUARD":
                raise GateError("Research scope violation; inspect worktree before resuming")
            check_research_scope(root, state["startSha"])
            p["stop"].unlink(missing_ok=True)
            state["phase"], state["reason"] = "PAUSED", "Explicitly resumed"
            atomic_json(p["state"], state)
            print("Resumed; step/run still requires --execute")
            return 0
        if args.action == "handoff":
            check_research_scope(root, state["startSha"])
            counts = validate_queue(root, queue, state["target"])
            if counts["VERIFIED"] < 30:
                raise GateError(f"Need 30 VERIFIED IDs; have {counts['VERIFIED']}")
            target = root / "docs/research/gk80-batch30/HANDOFF.md"
            if target.exists():
                raise GateError("Handoff already exists; review it rather than overwrite")
            verified = sorted((v for v in queue["candidates"] if v["status"] == "VERIFIED"),
                              key=lambda v: v["recipeId"])
            lines = ["# GK80 batch30 – source-evidence handoff", "",
                     f"Research start SHA: `{state['startSha']}`",
                     f"Research branch: `{state['branch']}`",
                     "State: RESEARCH VERIFIED (structural only), NOT OWNER APPROVED.",
                     "No Ready/merge/deploy authorization.", "",
                     "| Recipe ID | GK/serving | Omitted CHO g/serving | Evidence SHA256 |",
                     "| --- | ---: | ---: | --- |"]
            for v in verified:
                lines.append(f"| {v['recipeId']} | {v['gkPerServing']} | {v['omittedChoPerServing']} | `{v['evidenceSha256']}` |")
            lines += ["", "Next: independently review scientific sources and all 30 evidence files.",
                      "Refresh main and open PR deduplication before creating ONE Draft PR.",
                      "No push/PR is performed by this controller.", ""]
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text("\n".join(lines), encoding="utf-8", newline="\n")
            print(f"Handoff prepared: {target}; no GitHub mutation")
            return 0
        if args.max_seconds < 30 or args.max_seconds > 7200:
            raise GateError("Per-turn timeout must be 30..7200 seconds")
        if p["lock"].exists():
            raise GateError("Another process owns active.lock; refusing concurrent writer")
        if state["phase"] == "READY_FOR_DRAFT":
            raise GateError("30 candidates reached; use handoff")
        if state["phase"] != "PAUSED":
            raise GateError(f"Stopped or interrupted phase {state['phase']}; use resume after review")
        if args.action == "step":
            one_turn(root, state, queue, p, args.codex, args.max_seconds, args.execute)
        elif not args.execute:
            one_turn(root, state, queue, p, args.codex, args.max_seconds, False)
        else:
            if not 1 <= args.turn_limit <= 20:
                raise GateError("--turn-limit must be in 1..20")
            for _ in range(args.turn_limit):
                if not one_turn(root, state, queue, p, args.codex, args.max_seconds, True):
                    break
                state, queue, p = active(root)
        return 0
    except GateError as exc:
        print(f"HALT: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
