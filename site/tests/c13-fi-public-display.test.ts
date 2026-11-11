import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { siteContent } from "../src/generated/content.generated";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";
import { c13PublicFiPaths, projectC13FiDisplay } from "../scripts/c13-fi-public-display";
import { c13CanonicalHistoryPaths, originalForC13CanonicalHistory } from "./c13-canonical-historical-transition";

const root = path.resolve(import.meta.dirname, "../..");
const overlays = ["reseptit/aamupalat/indialainen-poha-maapahkinoilla.md", "reseptit/aamupalat/lahi-ita-manakish-zaatarilla.md"];

test("C13 retains source SHA-locked poha and manakish display corrections", async () => {
  assert.deepEqual([...c13PublicFiPaths].sort(), [...overlays].sort());
  for (const file of overlays) {
  const raw = await readFile(path.join(root, file), "utf8");
  const shown = projectC13FiDisplay(file, raw);
  const before = parseMarkdown(raw), after = parseMarkdown(shown);
  assert.ok(before && after);
  const oldData = recipeFrontmatterSchema.parse(before.data);
  const newData = recipeFrontmatterSchema.parse(after.data);
  assert.deepEqual(newData.ingredients, oldData.ingredients);
  assert.equal(newData.servings, oldData.servings);
  assert.equal(newData.cooking_method?.join("|"), oldData.cooking_method?.join("|"));
  assert.notEqual(shown, raw);
  assert.throws(() => projectC13FiDisplay(file, raw + "\n# unreviewed"), /C13_FI_SOURCE_STALE/);
  }
});

test("C13 nine original FI recipes contain canonical chef instructions while frozen GK history is unchanged", async () => {
  assert.equal(c13CanonicalHistoryPaths.length, 9);
  for (const relative of c13CanonicalHistoryPaths) {
    const id = path.basename(relative, ".md");
    const raw = await readFile(path.join(root, relative), "utf8");
    const historical = originalForC13CanonicalHistory(root, relative, raw);
    assert.notEqual(raw, historical, id);
    assert.equal(projectC13FiDisplay(relative, raw), raw, id);
    const current = parseMarkdown(raw), previous = parseMarkdown(historical);
    assert.ok(current && previous, id);
    const data = recipeFrontmatterSchema.parse(current.data);
    const old = recipeFrontmatterSchema.parse(previous.data);
    assert.deepEqual(current.data, previous.data, id + ": no input/metadata changes");
    assert.deepEqual(data.ingredients, old.ingredients);
    assert.equal(data.servings, old.servings);
    assert.match(current.content, /## Valmistus\n\n1\. /);
    assert.equal((current.content.match(/^\d+\. /gm)??[]).length,4,id);
    assert.match(current.content, /## Muistiinpanot/);
    const publicFi = siteContent.recipes.find(r => r.recipeId === id && r.locale === "fi");
    assert.ok(publicFi, id);
    assert.equal(publicFi.instructionsText.length,4,id);
    assert.equal(publicFi.servings,data.servings,id);
    assert.deepEqual(publicFi.ingredients,data.ingredients,id);
    assert.throws(() => originalForC13CanonicalHistory(root,relative,raw + "\n# tampered"),
      /unreviewed C13 source mutation/,id);
  }
});
