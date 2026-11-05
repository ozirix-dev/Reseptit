import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { recipeTextForApprovedSnapshot } from "../scripts/approved-recipe-note-edits";
import { parseMarkdown } from "../src/content/markdown";

const translationDraftCommits = new Map([
  ["kaannokset/en/jalkiruoat/keto-mutakakku.md", "d6531cd0592b01c0106a24bb6a3bd930dedbc504"],
  ["kaannokset/en/jalkiruoat/keto-suklaakeksit.md", "d6531cd0592b01c0106a24bb6a3bd930dedbc504"],
  ["kaannokset/en/jalkiruoat/meheva-suklaakakku.md", "d6531cd0592b01c0106a24bb6a3bd930dedbc504"],
  ["kaannokset/sv/jalkiruoat/keto-mutakakku.md", "47f3362c9fe426f25e6978dc9be519c19ae4b789"],
  ["kaannokset/th/jalkiruoat/keto-mutakakku.md", "47f3362c9fe426f25e6978dc9be519c19ae4b789"],
  ["kaannokset/sv/jalkiruoat/keto-suklaakeksit.md", "e70057d325b564f9e8406470fdd6f0a458087a28"],
  ["kaannokset/sv/jalkiruoat/meheva-suklaakakku.md", "e70057d325b564f9e8406470fdd6f0a458087a28"],
  ["kaannokset/th/jalkiruoat/keto-suklaakeksit.md", "0989c731ebd8e1e6c75935714c8fc2cf5bbf890a"],
  ["kaannokset/th/jalkiruoat/meheva-suklaakakku.md", "0989c731ebd8e1e6c75935714c8fc2cf5bbf890a"],
]);


// The two localization batches add reviewed translations and locale metadata.
const reviewedPublications = [
  ["d9e4fdc314142518b4afdd60933f3f0a75ead519", "3de79f256490067500fe7f96706d4f4b20d26f91"],
  ["3de79f256490067500fe7f96706d4f4b20d26f91", "2e4e84532eb046c6e38d513c5ba3a7e2bf783f25"],
] as const;
const publishedLocaleMetadata = "\ntranslation_languages: [en, sv, th]\ntranslation_status: {en: published, sv: published, th: published}\n";

export function assertRecipeBaseline(root: string, baseline: string, ...protectedPaths: string[]) {
  const changes = execFileSync(
    "git",
    ["diff", "--no-renames", "--name-status", baseline, "--", "reseptit", "kaannokset", ...protectedPaths],
    { cwd: root, encoding: "utf8" },
  ).trim().split(/\r?\n/).filter(Boolean);

  const published = new Map<string, string>();
  for (const [parent, commit] of reviewedPublications) {
    const files = execFileSync(
      "git",
      ["diff", "--name-only", "--diff-filter=A", parent, commit, "--", "kaannokset"],
      { cwd: root, encoding: "utf8" },
    ).trim().split(/\r?\n/).filter(Boolean);
    assert.equal(files.length, 30, commit);
    for (const file of files) published.set(file, commit);
  }

  for (const change of changes) {
    const [status, file] = change.split("\t");
    if (status === "M" && (file.startsWith("reseptit/") || file.startsWith("kaannokset/"))) {
      const current = readFileSync(path.join(root, file), "utf8").replaceAll("\r\n", "\n");
      let snapshot = recipeTextForApprovedSnapshot(file, current);
      if (snapshot === current && file.startsWith("reseptit/")) {
        const relativeRecipePath = file.slice("reseptit/".length);
        if (["en", "sv", "th"].every(locale => published.has(`kaannokset/${locale}/${relativeRecipePath}`))) {
          snapshot = snapshot.replace(publishedLocaleMetadata, "\n");
        }
      }
      if (snapshot !== current) {
        const original = execFileSync("git", ["show", baseline + ":" + file], { cwd: root, encoding: "utf8" });
        assert.equal(snapshot, original, change);
        continue;
      }
    }
    assert.ok(status === "A" && file.startsWith("kaannokset/") && file.endsWith(".md"), change);
    const publishedCommit = published.get(file);
    if (publishedCommit) {
      const reviewed = execFileSync("git", ["show", publishedCommit + ":" + file], { cwd: root, encoding: "utf8" });
      const current = readFileSync(path.join(root, file), "utf8").replaceAll("\r\n", "\n");
      assert.equal(current, reviewed, change);
      continue;
    }
    const draft = parseMarkdown(readFileSync(path.join(root, file), "utf8"));
    const draftCommit = translationDraftCommits.get(file);
    if (draftCommit && draft?.data.status === "published") {
      const reviewed = execFileSync("git", ["show", draftCommit + ":" + file], {
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
