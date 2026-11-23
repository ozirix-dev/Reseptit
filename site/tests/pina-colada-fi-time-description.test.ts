import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { publicRecipeDescription } from "../scripts/public-recipe-copy";

test("Piña colada describes the reviewed basis of its FI preparation time", () => {
  const id = "pina-colada-hedelmajaatelo";
  const source = readFileSync(new URL("../../reseptit/jalkiruoat/" + id + ".md", import.meta.url), "utf8");
  const review = readFileSync(new URL("../../docs/reviews/new-recipes/" + id + ".json", import.meta.url), "utf8");
  assert.match(source, /^time_total_min: 140$/m);
  assert.match(review, /140 minuutin kokonaisaika arvioidaan valmiiksi pakastetuista hedelmistä/);
  assert.match(review, /tuoreiden hedelmien esipakastus lisää noin 2 tuntia/);

  const description = publicRecipeDescription(id, id, "fi") ?? "";
  assert.match(description, /Aika on arvio valmiiksi pakastetuille hedelmille/);
  assert.match(description, /tuoreita hedelmiä, varaa lisäksi noin kaksi tuntia/);
  assert.equal(publicRecipeDescription(id, id, "en"), undefined);
});
