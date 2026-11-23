import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const selector = fileURLToPath(new URL("./select-recipe-ci-revision.sh", import.meta.url));
const bash = process.env.RECIPE_TEST_BASH || "bash";
const shellPath = (path) => path.replaceAll("\\", "/");

function git(cwd, ...args) {
  return execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
}

function fixture(t, { conflict = false, workflowChanged = false } = {}) {
  const tempParent = resolve(tmpdir());
  const temp = mkdtempSync(join(tempParent, "recipe-ci-revision-"));
  assert.equal(dirname(temp), tempParent);
  t.after(() => rmSync(temp, { recursive: true, force: true }));

  const origin = join(temp, "origin.git");
  const workspace = join(temp, "runner");
  git(temp, "init", "--bare", origin);
  git(temp, "init", "--initial-branch=main", workspace);
  git(workspace, "config", "user.name", "CI revision fixture");
  git(workspace, "config", "user.email", "ci-revision@example.invalid");
  git(workspace, "remote", "add", "origin", origin);

  function addCommit(name) {
    writeFileSync(join(workspace, name), name + "\n");
    git(workspace, "add", "--", name);
    git(workspace, "commit", "-m", name);
    return git(workspace, "rev-parse", "HEAD");
  }

  if (workflowChanged) {
    const dir = join(workspace, ".github", "workflows");
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "pages.yml"), "original\n");
    git(workspace, "add", "--", ".github/workflows/pages.yml");
  }
  const base = addCommit("original-base");
  git(workspace, "switch", "-c", "feature");
  if (conflict) {
    writeFileSync(join(workspace, "original-base"), "feature\n");
    git(workspace, "add", "--", "original-base");
  }
  const head = addCommit("feature-change");
  git(workspace, "switch", "main");
  if (conflict) {
    writeFileSync(join(workspace, "original-base"), "main\n");
    git(workspace, "add", "--", "original-base");
  }
  if (workflowChanged) {
    writeFileSync(join(workspace, ".github", "workflows", "pages.yml"), "updated\n");
    git(workspace, "add", "--", ".github/workflows/pages.yml");
  }
  const nextBase = addCommit("concurrent-main-change");
  const freshTree = conflict ? "" : git(workspace, "merge-tree", "--write-tree", nextBase, head);

  git(workspace, "switch", "--detach", base);
  git(workspace, "merge", "--no-ff", "--no-edit", head);
  const eventMerge = git(workspace, "rev-parse", "HEAD");
  git(workspace, "push", "origin", base + ":refs/heads/main");

  const output = join(temp, "output");
  const summary = join(temp, "summary");
  function run({ event = "pull_request", baseMoves = false, prHead = head } = {}) {
    if (baseMoves) git(workspace, "push", "origin", nextBase + ":refs/heads/main");
    return spawnSync(bash, [shellPath(selector)], {
      cwd: workspace,
      encoding: "utf8",
      env: {
        ...process.env,
        GITHUB_EVENT_NAME: event,
        PR_BASE_REF: "main",
        PR_BASE_SNAPSHOT: base,
        PR_HEAD: prHead,
        EVENT_SHA: eventMerge,
        GITHUB_OUTPUT: shellPath(output),
        GITHUB_STEP_SUMMARY: shellPath(summary),
      },
    });
  }

  return {
    base, eventMerge, freshTree, head, nextBase, run,
    checkedOut: () => git(workspace, "rev-parse", "HEAD"),
    commitInfo: () => git(workspace, "show", "-s", "--format=%P %T", "HEAD"),
    result: () => readFileSync(output, "utf8"),
    report: () => readFileSync(summary, "utf8"),
  };
}

test("keeps the event merge when its base still matches", (t) => {
  const f = fixture(t);
  const r = f.run();
  assert.equal(r.status, 0, r.stderr);
  assert.equal(f.checkedOut(), f.eventMerge);
  assert.equal(f.result(), "pr_base=" + f.base + "\ntested_sha=" + f.eventMerge + "\n");
});

test("rebuilds the test merge against current main without changing the PR head", (t) => {
  const f = fixture(t);
  const r = f.run({ baseMoves: true });
  assert.equal(r.status, 0, r.stderr);
  assert.notEqual(f.checkedOut(), f.eventMerge);
  assert.equal(f.commitInfo(), [f.nextBase, f.head, f.freshTree].join(" "));
  assert.ok(f.report().split("\n").includes("Tested tree: " + f.freshTree));
  assert.equal(f.result(), "pr_base=" + f.nextBase + "\ntested_sha=" + f.checkedOut() + "\n");
});

test("fails closed if the current base conflicts with the PR head", (t) => {
  const f = fixture(t, { conflict: true });
  const r = f.run({ baseMoves: true });
  assert.equal(r.status, 1, r.stderr);
  assert.match(r.stderr, /Cannot merge the pinned PR head/);
  assert.equal(f.checkedOut(), f.eventMerge);
});

test("fails closed if the workflow changed on the current base", (t) => {
  const f = fixture(t, { workflowChanged: true });
  const r = f.run({ baseMoves: true });
  assert.equal(r.status, 1, r.stderr);
  assert.match(r.stderr, /workflow changed between the event and fresh test merge/);
  assert.equal(f.checkedOut(), f.eventMerge);
});

test("rejects an event merge paired with the wrong PR head", (t) => {
  const f = fixture(t);
  const r = f.run({ prHead: f.base });
  assert.equal(r.status, 1, r.stderr);
  assert.match(r.stderr, /not the expected two-parent PR merge/);
});

test("keeps the exact event checkout for non-PR builds", (t) => {
  const f = fixture(t);
  const r = f.run({ event: "push" });
  assert.equal(r.status, 0, r.stderr);
  assert.equal(f.checkedOut(), f.eventMerge);
  assert.equal(f.result(), "pr_base=\ntested_sha=" + f.eventMerge + "\n");
});
