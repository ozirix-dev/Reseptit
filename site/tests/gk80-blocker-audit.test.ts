import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { glycemicLoadPilotResults } from "../src/generated/glycemic-load-pilot.generated";

const report = JSON.parse(readFileSync(new URL("../../tmp/nutrition/glycemic-load-pilot.json", import.meta.url), "utf8"));

test("corrected ingredients no longer block their GK calculations", () => {
  const dosa = report.results.find((recipe: any) => recipe.recipeId === "masala-dosa");
  assert.ok(dosa);
  const potato = dosa.ingredients.find((ingredient: any) => ingredient.giRecordId === "potato-boiled-preparation-analogue-gi-66");
  assert.equal(potato?.gi, 66);
  assert.ok(dosa.omittedAvailableCarbohydratePerServingG < 2);
  assert.ok(dosa.blockers.every((blocker: string) => /differs? from the last GL review/.test(blocker)));

  const tostada = report.results.find((recipe: any) => recipe.recipeId === "meksikolainen-paputostada-aamupalaksi");
  assert.ok(tostada);
  assert.equal(tostada.ingredients.find((ingredient: any) => ingredient.name === "avokado")?.gi, null);
  assert.ok(tostada.omittedAvailableCarbohydratePerServingG < 2);
  assert.ok(tostada.blockers.some((blocker: string) => blocker.includes("maissitortilla")));
  assert.ok(tostada.blockers.every((blocker: string) => !blocker.includes(": avokado:")));
});

test("public blocker labels distinguish review and rejected GI", () => {
  const dosa = glycemicLoadPilotResults.find((recipe) => recipe.recipeId === "masala-dosa");
  const charSiu = glycemicLoadPilotResults.find((recipe) => recipe.recipeId === "char-siu");
  assert.ok(dosa?.incompleteReasons.length);
  assert.ok(dosa.incompleteReasons.every((reason) => reason.category === "REVIEW"));
  assert.ok(charSiu?.incompleteReasons.some((reason) => reason.category === "GI" && reason.ingredientNames.fi === "hoisinkastiketta"));
});
