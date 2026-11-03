import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {buildPohaHoneyMustardVariants} from '../scripts/gk-poha-honey-mustard';

const root = fileURLToPath(new URL('../../', import.meta.url));

test('poha and honey-mustard GK-only details are correctly localized without changing their numeric result', () => {
  const variants = buildPohaHoneyMustardVariants(root);
  assert.deepEqual(variants.map(v => [v.recipeId, v.point]), [
    ['indialainen-poha-maapahkinoilla', 28.33],
    ['hunaja-sinappikana-kaalilla', 7.14],
  ]);
  const [poha, chicken] = variants;
  assert.match(poha.ingredients[1].name.fi, /suolaamattomat maapähkinät/);
  assert.doesNotMatch(poha.ingredients[1].name.fi, /Raa.at suolattomat /);
  assert.ok(Math.abs(poha.omittedCho - 0.210525) < 1e-10);
  assert.ok(Math.abs(chicken.omittedCho - 1.2254125) < 1e-10);
  for (const variant of variants) {
    assert.equal(variant.macroScope, 'NO_MACRO_PACKAGE_FOR_THIS_VERSION');
    for (const locale of ['en', 'sv', 'th'] as const) {
      assert.notEqual(variant.preparation[locale], variant.preparation.fi);
      assert.notEqual(variant.limitation?.[locale], variant.limitation?.fi);
      assert.equal(variant.ingredients.every(i => i.name[locale] !== i.name.fi), true);
      assert.ok(variant.preparation[locale].length > 30);
      assert.ok((variant.limitation?.[locale]?.length ?? 0) > 30);
    }
  }
});
