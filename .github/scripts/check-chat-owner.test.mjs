import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { checkChatOwner, LEGACY_LAST_PR } from "./check-chat-owner.mjs";

const pr = (number, title, body, ref) => ({
  number, title, body, head: { ref },
});

test("Chat 1, Chat 12 and Chat 100 all pass the same ownership rules", () => {
  for (const n of [1, 12, 100]) {
    const result = checkChatOwner(pr(792, "[Chat " + n + "] docs: own task",
      "Työn omistaja: Chat " + n + "\n\nTehtävä: documented",
      "chat" + n + "/own-task-20261121"));
    assert.deepEqual(result, { status: "pass", errors: [], warnings: [] });
  }
});

test("legacy open PRs remain exempt after this check is merged", () => {
  assert.equal(LEGACY_LAST_PR, 791);
  assert.equal(checkChatOwner(pr(784, "Old recipe", "", "chat4/recipe-draft")).status, "legacy");
  assert.equal(checkChatOwner(pr(791, "[Chat 1] old rule", "", "chat1/old-rule")).status, "legacy");
});

test("a new human or Codex PR with no Chat N marker gets only a warning", () => {
  for (const body of ["", "Työn omistaja: Codex", "Työn omistaja: Human"]) {
    const result = checkChatOwner(pr(792, "Maintenance", body, "fix/maintenance"));
    assert.equal(result.status, "warning");
    assert.equal(result.errors.length, 0);
    assert.match(result.warnings.join(" "), /Chat N marker/u);
  }
});

test("a declared Chat owner on a pre-existing non-chat branch is allowed with a warning", () => {
  const result = checkChatOwner(pr(793,
    "[Chat 4] continue an owned branch",
    "Työn omistaja: Chat 4",
    "recipe/older-branch"));
  assert.equal(result.status, "warning");
  assert.equal(result.errors.length, 0);
});

test("title/description Chat numbers must agree", () => {
  const result = checkChatOwner(pr(792, "[Chat 3] update",
    "Työn omistaja: Chat 4", "chat3/own-task"));
  assert.equal(result.status, "fail");
  assert.match(result.errors.join(" "), /title and owner declaration must match/u);
});

test("branch Chat number must agree with both PR markers", () => {
  const result = checkChatOwner(pr(792, "[Chat 3] update",
    "Työn omistaja: Chat 3", "chat4/other-chat"));
  assert.equal(result.status, "fail");
  assert.match(result.errors.join(" "), /branch prefix/u);
});

test("one-sided declarations are a failed check, not a silent default", () => {
  for (const value of [
    pr(792, "[Chat 7] task", "", "chat7/task"),
    pr(792, "task", "Työn omistaja: Chat 7", "other/task"),
    pr(792, "task", "", "chat7/task"),
  ]) {
    assert.equal(checkChatOwner(value).status, "fail");
  }
});

test("Chat 0, leading zeros, placeholders and huge integers are rejected", () => {
  for (const marker of ["0", "01", "N", "99999999999999999999999999"]) {
    const result = checkChatOwner(pr(792,
      "[Chat " + marker + "] task", "Työn omistaja: Chat " + marker,
      "chat" + marker + "/task"));
    assert.equal(result.status, "fail", marker);
  }
});

test("multiple or malformed body declarations fail", () => {
  const a = checkChatOwner(pr(792, "[Chat 5] task",
    "Työn omistaja: Chat 5\nTyön omistaja: Chat 5", "chat5/task"));
  assert.equal(a.status, "fail");
  assert.match(a.errors.join(" "), /multiple owner declarations/u);
  assert.equal(checkChatOwner(pr(792, "[Chat 5] task",
    "Työn omistaja: Chat N", "chat5/task")).status, "fail");
});

test("Markdown-bold owner declaration is accepted", () => {
  const result = checkChatOwner(pr(792, "[Chat 16] task",
    "**Työn omistaja:** Chat 16", "chat16/task"));
  assert.equal(result.status, "pass");
});

test("malformed or absent GitHub event data fails closed", () => {
  for (const x of [null, {}, { number: 792, title: "test" },
    { number: "792", title: "test", head: { ref: "task" } },
    { number: 0, title: "", head: { ref: "task" } }]) {
    assert.equal(checkChatOwner(x).status, "fail");
  }
});

function cliEvent(event) {
  const root = mkdtempSync(join(tmpdir(), "recipavo-chat-owner-"));
  try {
    const eventPath = join(root, "event.json");
    const summaryPath = join(root, "summary.md");
    writeFileSync(eventPath, JSON.stringify({ pull_request: event }));
    const r = spawnSync(process.execPath,
      [fileURLToPath(new URL("./check-chat-owner.mjs", import.meta.url))],
      {
        encoding: "utf8",
        env: { ...process.env, GITHUB_EVENT_PATH: eventPath, GITHUB_STEP_SUMMARY: summaryPath },
      });
    return { status: r.status, stderr: r.stderr, stdout: r.stdout,
      summary: readFileSync(summaryPath, "utf8") };
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

test("workflow CLI succeeds and writes a metadata-only summary", () => {
  const run = cliEvent(pr(792, "[Chat 12] verify",
    "Työn omistaja: Chat 12\nPrivate example: should-not-be-logged",
    "chat12/task"));
  assert.equal(run.status, 0);
  assert.match(run.summary, /PASS/u);
  assert.ok(!run.summary.includes("should-not-be-logged"));
});

test("workflow CLI emits a static action error and fails on mismatched owner", () => {
  const run = cliEvent(pr(792, "[Chat 3] mismatch\n::warning::injected",
    "Työn omistaja: Chat 4", "chat3/task"));
  assert.equal(run.status, 1);
  assert.match(run.stderr, /::error::/u);
  assert.ok(!run.stderr.includes("injected"));
  assert.ok(!run.summary.includes("injected"));
});
