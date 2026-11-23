import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { copyFile, cp, mkdir, mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";

const site = path.resolve(import.meta.dirname, "..");
const recipeId = "nutrition-removal-fixture";
const recipe = `reseptit/jalkiruoat/${recipeId}.md`;
const calculation = `docs/nutrition/calculations/${recipeId}.json`;
const published = `---
title: Test recipe
recipe_id: ${recipeId}
url_slug: ${recipeId}
category: jalkiruoka
language: fi
status: published
servings: 1
ingredients:
  - { amount: 100, unit: g, item: omena }
---

## Valmistus

1. Viipaloi omena.
`;

test("changed-content CLI checks nutrition evidence when a recipe leaves publication", async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), "changed-recipe-nutrition-"));
  t.after(() => rm(root, { recursive: true, force: true }));

  const fixtureSite = path.join(root, "site");
  await mkdir(fixtureSite);
  await cp(path.join(site, "scripts"), path.join(fixtureSite, "scripts"), { recursive: true });
  await cp(path.join(site, "src"), path.join(fixtureSite, "src"), {
    recursive: true,
    filter: (source) => source !== path.join(site, "src", "generated"),
  });
  await copyFile(path.join(site, "package.json"), path.join(fixtureSite, "package.json"));
  await symlink(path.join(site, "node_modules"), path.join(fixtureSite, "node_modules"), "junction");

  await mkdir(path.join(root, "meta", "kaannokset"), { recursive: true });
  await copyFile(path.join(site, "../meta/kaannokset/f25-release-gate.json"),
    path.join(root, "meta/kaannokset/f25-release-gate.json"));
  await mkdir(path.dirname(path.join(root, calculation)), { recursive: true });
  await copyFile(path.join(site, "../docs/nutrition/recipe-correctness-history.json"),
    path.join(root, "docs/nutrition/recipe-correctness-history.json"));
  await writeFile(path.join(root, "docs/nutrition/glycemic-load-recipe-bindings.json"), "{}");
  await writeFile(path.join(root, "docs/nutrition/glycemic-load-recipe-aliases.json"), "{}");
  await mkdir(path.dirname(path.join(root, recipe)), { recursive: true });

  const git = (...args: string[]) =>
    execFileSync("git", ["-c", "core.autocrlf=false", ...args], { cwd: root, encoding: "utf8" }).trim();
  git("init", "--quiet");
  await writeFile(path.join(root, recipe), published);
  await writeFile(path.join(root, calculation), JSON.stringify({ recipeId }));
  git("add", "--", recipe, calculation);
  const base = git("write-tree");
  const validate = (...changed: string[]) => {
    git("read-tree", base);
    git("add", "-A", "--", ...changed);
    const head = git("write-tree");
    assert.deepEqual(git("diff", "--name-only", base, head).split("\n").sort(), changed.sort());
    return spawnSync(process.execPath, ["--import", "tsx", "scripts/validate-changed-content.ts", ...changed], {
      cwd: fixtureSite,
      encoding: "utf8",
      env: { ...process.env, BASE_SHA: base, HEAD_SHA: head },
    });
  };

  for (const change of ["deleted", "draft"] as const) {
    await t.test(`${change} recipe with unchanged calculation is rejected`, async () => {
      await writeFile(path.join(root, calculation), JSON.stringify({ recipeId }));
      if (change === "deleted") {
        await rm(path.join(root, recipe));
      } else {
        await writeFile(path.join(root, recipe), published.replace("status: published", "status: draft"));
      }

      const orphaned = validate(recipe);
      assert.equal(orphaned.status, 1, orphaned.stderr || orphaned.stdout);
      assert.match(orphaned.stderr, /calculation evidence has no published Finnish source/);

      await rm(path.join(root, calculation));
      const removedTogether = validate(recipe, calculation);
      assert.equal(removedTogether.status, 0, removedTogether.stderr);
    });
  }
});
