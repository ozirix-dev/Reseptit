/**
 * Read-only Chat N ownership audit for pull_request events.
 *
 * This is workflow hygiene, NOT authenticated branch ownership or a Repo Guard
 * security decision. Existing PRs (#791 and earlier) are grandfathered.
 */
import { appendFile, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export const LEGACY_LAST_PR = 791;

function positiveInt(raw) {
  if (!/^[1-9][0-9]*$/u.test(raw ?? "")) return null;
  const value = Number(raw);
  return Number.isSafeInteger(value) ? value : null;
}

function ownerNumberFromBody(body, errors) {
  const lines = body.split(/\r?\n/u).map(line => line.trim());
  const declarations = lines.filter(line => /^(?:\*\*)?Työn omistaja:/iu.test(line));
  if (declarations.length > 1) {
    errors.push("PR description contains multiple owner declarations.");
    return null;
  }
  if (!declarations.length) return null;
  const match = /^(?:\*\*)?Työn omistaja:(?:\*\*)?\s*(.*?)\s*$/u.exec(declarations[0]);
  const value = match?.[1]?.replace(/\*\*$/u, "").trim() ?? "";
  if (!/^Chat\b/iu.test(value)) return null; // Explicit non-Chat owner, e.g. Codex.
  const chat = /^Chat[ \t]+([^\s]+)$/u.exec(value);
  const n = positiveInt(chat?.[1]);
  if (n === null) errors.push("PR owner declaration must use Chat followed by a positive integer.");
  return n;
}

export function checkChatOwner(pr) {
  if (!pr || typeof pr !== "object" || !Number.isSafeInteger(pr.number) ||
      pr.number <= 0 || typeof pr.title !== "string" ||
      typeof pr.head?.ref !== "string") {
    return { status: "fail", errors: ["Missing or invalid GitHub pull_request payload."], warnings: [] };
  }
  if (pr.number <= LEGACY_LAST_PR) {
    return { status: "legacy", errors: [], warnings: [] };
  }

  const errors = [];
  const warnings = [];
  const title = pr.title.trim();
  const body = typeof pr.body === "string" ? pr.body : "";
  const branch = pr.head.ref;

  const titleLooksChat = /^\[\s*Chat\b/iu.test(title);
  const titleCandidate = /^\[Chat[ \t]+([^\]]+)\](?:[ \t]|$)/u.exec(title);
  const titleNumber = positiveInt(titleCandidate?.[1]);
  if (titleLooksChat && titleNumber === null) {
    errors.push("PR title Chat marker must be [Chat N] with a positive integer.");
  }

  const bodyErrors = [];
  const bodyNumber = ownerNumberFromBody(body, bodyErrors);
  errors.push(...bodyErrors);

  const branchLikeChat = /^chat[0-9]+(?:\/|$)/u.test(branch);
  const branchMatch = /^chat([0-9]+)\//u.exec(branch);
  const branchNumber = positiveInt(branchMatch?.[1]);
  if (branchLikeChat && branchNumber === null) {
    errors.push("Chat-number branch prefix must be chatN/ with a positive integer.");
  }

  const chatIndicated = titleLooksChat || titleNumber !== null ||
    bodyNumber !== null || bodyErrors.length > 0 || branchLikeChat;

  if (!chatIndicated) {
    warnings.push("No Chat N marker found. ChatGPT-authored PRs must identify their owner.");
  } else {
    if (titleNumber === null) {
      errors.push("Chat PR title must begin with [Chat N].");
    }
    if (bodyNumber === null) {
      errors.push("Chat PR description must contain Työn omistaja: Chat N.");
    }
    if (titleNumber !== null && bodyNumber !== null && titleNumber !== bodyNumber) {
      errors.push("Chat number in PR title and owner declaration must match.");
    }
    if (branchNumber !== null && titleNumber !== null && branchNumber !== titleNumber) {
      errors.push("Chat branch prefix and PR title owner must match.");
    }
    if (branchNumber !== null && bodyNumber !== null && branchNumber !== bodyNumber) {
      errors.push("Chat branch prefix and PR description owner must match.");
    }
    if (branchNumber === null && titleNumber !== null && bodyNumber === titleNumber) {
      warnings.push("Prefer a chatN/ branch for new ChatGPT work; existing branch naming is permitted.");
    }
  }
  return {
    status: errors.length ? "fail" : warnings.length ? "warning" : "pass",
    errors: [...new Set(errors)],
    warnings: [...new Set(warnings)],
  };
}

async function cli() {
  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (!eventPath) throw new Error("GITHUB_EVENT_PATH is required.");
  const event = JSON.parse(await readFile(eventPath, "utf8"));
  const verdict = checkChatOwner(event?.pull_request);
  // Never print PR title/body or arbitrary user-controlled strings as GitHub
  // workflow commands: only static validation messages are logged.
  for (const message of verdict.errors) console.error("::error::" + message);
  for (const message of verdict.warnings) console.log("::warning::" + message);
  console.log("Chat ownership check: " + verdict.status.toUpperCase());
  if (process.env.GITHUB_STEP_SUMMARY) {
    const id = Number.isSafeInteger(event?.pull_request?.number) ? event.pull_request.number : "?";
    await appendFile(process.env.GITHUB_STEP_SUMMARY,
      "## Chat ownership audit\n" +
      "- PR: #" + id + "\n" +
      "- Result: " + verdict.status.toUpperCase() + "\n" +
      "- This is metadata hygiene, not a verified writer identity or merge permission.\n");
  }
  if (verdict.status === "fail") process.exitCode = 1;
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  cli().catch(() => {
    console.error("::error::Chat ownership audit could not read the pull request event.");
    process.exitCode = 1;
  });
}
