import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { recipeTextForApprovedSnapshot } from "../scripts/approved-recipe-note-edits";
import { parseMarkdown } from "../src/content/markdown";

export function assertRecipeBaseline(root: string, baseline: string, ...protectedPaths: string[]) {
  const changes = execFileSync(
    "git",
    ["diff", "--no-renames", "--name-status", baseline, "--", "reseptit", "kaannokset", ...protectedPaths],
    { cwd: root, encoding: "utf8" },
  ).trim().split(/\r?\n/).filter(Boolean);

  for (const change of changes) {
    const [status, file] = change.split("\t");
    if (status === "M" && file.startsWith("reseptit/")) {
      const current = readFileSync(path.join(root, file), "utf8").replaceAll("\r\n", "\n");
      const snapshot = recipeTextForApprovedSnapshot(file, current);
      if (snapshot !== current) {
        const original = execFileSync("git", ["show", baseline + ":" + file], { cwd: root, encoding: "utf8" });
        assert.equal(snapshot, original, change);
        continue;
      }
    }
    assert.ok(status === "A" && file.startsWith("kaannokset/") && file.endsWith(".md"), change);
    const draft = parseMarkdown(readFileSync(path.join(root, file), "utf8"));
    assert.equal(draft?.data.status, "draft", change);
  }
}
