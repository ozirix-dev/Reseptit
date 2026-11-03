import assert from "node:assert/strict";
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

const pohaHoneyTranslations = new Set(["en", "sv", "th"].flatMap(locale => [
  `kaannokset/${locale}/aamupalat/indialainen-poha-maapahkinoilla.md`,
  `kaannokset/${locale}/paaruoat/hunaja-sinappikana-kaalilla.md`,
]));

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
    if (publishedTorrasTranslations.has(file) && draft?.data.status === "published") {
      const reviewed = execFileSync("git", ["show", "d6531cd0592b01c0106a24bb6a3bd930dedbc504:" + file], {
        cwd: root,
        encoding: "utf8",
      });
      const current = readFileSync(path.join(root, file), "utf8").replaceAll("\r\n", "\n");
      assert.equal(current, reviewed.replace("\nstatus: draft\n", "\nstatus: published\n"), change);
    } else if (pohaHoneyTranslations.has(file)) {
      const translated = execFileSync("git", ["show", "4a7d039322a4fa437e7403e5b4a63f5af1d47c58:" + file], {
        cwd: root,
        encoding: "utf8",
      });
      const current = readFileSync(path.join(root, file), "utf8").replaceAll("\r\n", "\n");
      assert.equal(current, translated, change);
    } else {
      assert.equal(draft?.data.status, "draft", change);
    }
  }
}
