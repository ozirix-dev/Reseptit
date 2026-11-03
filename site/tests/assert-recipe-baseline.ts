import assert from "node:assert/strict";
import { textHash } from "../scripts/gk149-model";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { recipeTextForApprovedSnapshot } from "../scripts/approved-recipe-note-edits";
import { parseMarkdown } from "../src/content/markdown";

const publishedTorrasTranslations = new Set([
  "kaannokset/en/jalkiruoat/keto-mutakakku.md",
  "kaannokset/en/jalkiruoat/keto-suklaakeksit.md",
  "kaannokset/en/jalkiruoat/meheva-suklaakakku.md",
]);

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
      if (file === "reseptit/aamupalat/karibia-ackee-ja-suolakala.md") {
        const original = execFileSync("git", ["show", baseline + ":" + file], { cwd: root, encoding: "utf8" });
        assert.equal(textHash(original), "57565170269e72af8dba35c959f83d8d64a9f16886a0a0a3b0f395ed66459183", change);
        assert.equal(textHash(current), "ccf0f6b8d757100a7c2974b0154e2d292ab965a11a4050e3ea890d209a289e2d", change);
        continue;
      }
      const snapshot = recipeTextForApprovedSnapshot(file, current);
      if (snapshot !== current) {
        const original = execFileSync("git", ["show", baseline + ":" + file], { cwd: root, encoding: "utf8" });
        assert.equal(snapshot, original, change);
        continue;
      }
    }
    assert.ok(status === "A" && file.startsWith("kaannokset/") && file.endsWith(".md"), change);
    const draft = parseMarkdown(readFileSync(path.join(root, file), "utf8"));
    if (publishedTorrasTranslations.has(file) && draft?.data.status === "published") {
      const reviewed = execFileSync("git", ["show", "d6531cd0592b01c0106a24bb6a3bd930dedbc504:" + file], {
        cwd: root,
        encoding: "utf8",
      });
      const current = readFileSync(path.join(root, file), "utf8").replaceAll("\r\n", "\n");
      assert.equal(current, reviewed.replace("\nstatus: draft\n", "\nstatus: published\n"), change);
    } else {
      assert.equal(draft?.data.status, "draft", change);
    }
  }
}
