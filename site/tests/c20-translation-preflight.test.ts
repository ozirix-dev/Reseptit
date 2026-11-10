import assert from "node:assert/strict";
import {test} from "node:test";
import {missingPreparationNumbers, sourceQualityFindings} from "../scripts/c20-translation-preflight";
test("preflight detects missing cooking numerals without confusing comma/dot decimals", () => {
  assert.deepEqual(missingPreparationNumbers(["Lisää 0,5 g ja kypsennä 200 asteessa."],["Add 0.5 g and cook at 200 °C."]),[]);
  assert.deepEqual(missingPreparationNumbers(["Lisää 15 g, 15 g ja paista 200 asteessa."],["Add 15 g and bake at 200 °C."]),["15"]);
});
test("generic unrelated FI kitchen template is HOLD, specific instruction passes", () => {
  assert.ok(sourceQualityFindings("Valmistele kulhon ainekset; kypsennä pavut tai proteiini.").length);
  assert.deepEqual(sourceQualityFindings("Kuutioi tomaatti ja paista munat kypsiksi."),[]);
});