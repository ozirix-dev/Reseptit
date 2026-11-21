import assert from "node:assert/strict";
import test from "node:test";
import { compareInventories, toMarkdown } from "./editorial-public-audit";
import type { PublicRecipe, RawInventory } from "./editorial-public-audit";

const generic = "Tässä kotikeittiöön sovitetussa ohjeessa valmistetaan kylmä aamiainen.";
const repeated = "Paloittele tuoreet kasvikset ja valmistele yrtit sekä kastikkeen ainekset.";
const evidence = (id: string) => ({
  recipeId: id, title: id, path: "reseptit/aamupalat/" + id + ".md", sourceSha256: "sha-" + id,
});
const row = (id: string, description: string, steps: string[], time: number | null = 25): PublicRecipe =>
  ({ recipeId: id, locale: "fi", routePath: "/" + id + "/", description,
    instructionsText: steps, timeTotalMin: time });

function raw(): RawInventory {
  return {
    counts: { reviewed: 3 },
    indexedRecipes: [evidence("a"), evidence("b"), evidence("c")],
    signals: {
      genericLead: [evidence("a"), evidence("b")],
      repeatedSteps: [{
        phrase: "paloittele tuoreet kasvikset ja valmistele yrtit sekä kastikkeen ainekset",
        recipes: [evidence("a"), evidence("b"), evidence("c")],
      }],
      duplicateDescription: [evidence("a")],
      missingTime: [evidence("c")],
    },
  };
}
test("source-only generic copy does not become a public false positive", () => {
  const output = compareInventories(raw(), [
    row("a", "Mango ja jogurtti sekoitetaan.", ["Sekoita mango ja jogurtti kulhossa."]),
    row("b", generic, [repeated]),
    row("c", "Riisikulho kananmunalla.", [repeated], null),
    { ...row("other-language", generic, [repeated]), locale: "en" },
  ]);
  assert.equal(output.totals.projectedFiRecipes, 3);
  assert.equal(output.totals.rawGenericNoLongerVisible, 1);
  assert.deepEqual(output.visible.genericDescriptions.map(x => x.recipeId), ["b"]);
  assert.equal(output.totals.projectedRepeatedStepGroups, 1);
  assert.equal(output.totals.rawRepeatGroupsStillRepeated, 1);
  assert.equal(output.totals.projectedMissingTimes, 1);
  assert.match(toMarkdown(output), /julkisessa esityksessä/i);
});
test("source-only repeated steps disappear when visible instructions are corrected", () => {
  const output = compareInventories(raw(), [
    row("a", "Yksilöllinen annos.", ["Jaa kylmänä kahteen kulhoon."]),
    row("b", "Toinen annos.", ["Sekoita jogurtti ja mehu."]),
    row("c", "Kolmas annos.", ["Valmistele koristeet."]),
  ]);
  assert.equal(output.totals.rawRepeatGroupsNoLongerRepeated, 1);
  assert.equal(output.totals.projectedRepeatedStepGroups, 0);
  assert.equal(output.totals.projectedGenericDescriptions, 0);
});
test("source/public mismatch and duplicate IDs fail closed", () => {
  assert.throws(() => compareInventories(raw(), [row("a", "", []), row("b", "", [])]), /SOURCE_PUBLIC_DRIFT/);
  assert.throws(() => compareInventories(raw(), [
    row("a", "", []), row("a", "", []), row("c", "", []),
  ]), /DUPLICATE_PUBLIC_RECIPE_ID/);
  const invalid = raw();
  invalid.indexedRecipes[2] = evidence("a");
  assert.throws(() => compareInventories(invalid, []), /DUPLICATE_RAW_RECIPE_ID/);
});
test("older raw audits without a source index are rejected", () => {
  const invalid = raw();
  invalid.indexedRecipes = [];
  assert.throws(() => compareInventories(invalid, []), /RAW_INVENTORY_OUTDATED/);
});
