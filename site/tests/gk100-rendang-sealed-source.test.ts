import { test } from 'node:test';
import assert from 'node:assert/strict';
import { historicalRendangForApprovedVersion } from '../scripts/gk100-rendang-sealed-source';
const path = 'reseptit/paaruoat/rendang-padang.md';
const originalStep = "2. Laita maustetahna, kookosmaito, sitruunaruoho ja kaffirlimetinlehdet paksupohjaiseen kattilaan. Kuumenna sekoittaen lähes kiehuvaksi.";
const correctedStep = "2. Laita maustetahna, kookosmaito, sitruunaruoho, kaffirlimetinlehdet ja ainesluettelon 1 tl kurkumajauhetta paksupohjaiseen kattilaan. Kuumenna sekoittaen lähes kiehuvaksi.";

test('rendang: only exact corrected step maps back to sealed historical step', () => {
  const historical = 'header\n' + originalStep + '\nfooter\n';
  const corrected = historical.replace(originalStep, correctedStep);
  assert.equal(historicalRendangForApprovedVersion(path, corrected), historical);
  assert.equal(historicalRendangForApprovedVersion(path, historical), historical);
  assert.equal(historicalRendangForApprovedVersion('reseptit/paaruoat/other.md', corrected), corrected);
});
test('rendang: duplicate corrected step is explicitly rejected', () => {
  assert.throws(() => historicalRendangForApprovedVersion(path, correctedStep + '\n' + correctedStep), /GK100_RENDANG_AMBIGUOUS_CORRECTION/);
});
test('rendang: unrelated modifications are not silently dropped', () => {
  const changed = correctedStep + '\n' + 'extra ingredient';
  const transformed = historicalRendangForApprovedVersion(path, changed);
  assert.equal(transformed, originalStep + '\n' + 'extra ingredient');
  // Full sealed bundle validation must compare this to the original SHA and reject it.
});
