import assert from "node:assert/strict";
import test from "node:test";
import { siteContent } from "../src/generated/content.generated";

test("published ackee page carries the safety hold without modifying nutrition-bound recipe source", () => {
  const recipe = siteContent.recipes.find((entry) =>
    entry.recipeId === "karibia-ackee-ja-suolakala" && entry.locale === "fi");
  assert.ok(recipe, "published original ackee page must remain discoverable until reviewed");
  assert.match(recipe.description, /TURVALLISUUSVAROITUS/);
  assert.match(recipe.description, /Älä valmista ruokaa näillä ainesmäärillä/);
  assert.match(recipe.description, /hypoglysiini A/i);
  assert.match(recipe.instructionsText.join(" "), /Älä valmista tätä ruokalajia/);
  assert.match(recipe.instructionsText.join(" "), /fda\.gov\/food\/natural-toxins-food\/hypoglycin-and-ackee-fruit/);
  assert.doesNotMatch(recipe.instructionsText.join(" "), /kypsennä pavut tai liha/);
});
