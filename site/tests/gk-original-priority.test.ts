import historicalBaseline from '../../docs/nutrition/gk-legacy-reconciliation/baseline.json';
import {restoreBeforeAfcdCorrection} from './restore-pre-ehold';
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createMemoryRouter, RouterProvider, MemoryRouter } from 'react-router-dom';
import { countGkVersions } from '../src/features/recipes/gk-only-types';
import { gkVariantScope, manakishStudyBinding } from '../src/features/recipes/gk-estimate-scope';
import { GkOnlyVariantPanel, gkOnlyValue, gkOnlyPreparation, studyServingTitle } from '../src/features/recipes/GkOnlyVariantPanel';
import { GkCoverageSummary, coverageCopy } from '../src/features/glycemic-load/GkCoverageSummary';
import { gkCopy } from '../src/features/glycemic-load/glycemic-load-copy';
import { RecipePage } from '../src/features/recipes/RecipePage';
import { siteContent } from '../src/generated/content.generated';
import { glycemicLoadFilterCategories } from '../src/generated/glycemic-load-filters.generated';
import { filterRecipes, emptyRecipeFilters } from '../src/features/recipes/recipe-search';
import { contentForRoute, localeIndexes } from '../src/content/route-data';

const root = path.resolve(import.meta.dirname, '../..');
const report = JSON.parse(readFileSync(path.join(root, 'tmp/nutrition/glycemic-load-pilot.json'), 'utf8'));
const variants = report.gkOnlyVariants as import('../src/features/recipes/gk-only-types').GkOnlyVariant[];
const counts = countGkVersions(report.results, variants);
const locales = ['fi','en','sv','th'] as const;
const checksum = (v: unknown) => createHash('sha256').update(JSON.stringify(v)).digest('hex');
const escaped = (s: string) => s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#x27;');

function recipeMarkup(recipeId: string, locale: typeof locales[number]) {
  // Actual route data where published; component-language fixture otherwise.
  const original = siteContent.recipes.find(r => r.recipeId === recipeId && r.locale === locale)
    ?? { ...siteContent.recipes.find(r => r.recipeId === recipeId && r.locale === 'fi')!, locale, routePath: `${localeIndexes[locale]}${recipeId}/` };
  assert.ok(original.recipeId);
  const data = contentForRoute([original], original.routePath);
  const router = createMemoryRouter([{ id:'content', path:'*', element:createElement(RecipePage) }], {
    initialEntries:[original.routePath], hydrationData:{loaderData:{content:data}},
  });
  try { return renderToStaticMarkup(createElement(RouterProvider,{router})); }
  finally { router.dispose(); }
}

test('current GK coverage keeps originals, home variants and study comparisons separate', () => {
  const originalNumeric = report.results.filter((row: {status: string}) => row.status === 'CALCULATED').length;
  assert.equal(counts.originalNumeric, originalNumeric);
  assert.equal(counts.originalTarget, Math.ceil(report.results.length * 0.8));
  assert.equal(counts.originalTargetGap, Math.max(0, counts.originalTarget - originalNumeric));
  assert.equal(counts.originalRecipeIds.length, originalNumeric);
  assert.equal(counts.variantRecipeIds.length, counts.additionalA + counts.additionalB);
  assert.ok(counts.studyServingRecipeIds.includes(manakishStudyBinding.recipeId));
  assert.ok(!counts.numericRecipeIds.includes(manakishStudyBinding.recipeId));
  assert.equal(new Set([...counts.originalRecipeIds,...counts.variantRecipeIds]).size, counts.numericRecipes);
  assert.deepEqual(report.coverageViews.originalRecipe, {
    total: report.results.length, numeric: originalNumeric, missing: report.results.length - originalNumeric,
  });
  assert.equal(report.coverageViews.legacyMixed.historicalOnly,true);
});

test('the 326 historical results and 87 approved variants retain their baseline hashes', () => {
  // Restore the two reviewed AFCD objects and select the sealed variant cohort.
  assert.equal(checksum(restoreBeforeAfcdCorrection(structuredClone(report)).results),'697333a249360f25c42cc6170a7e0b1814e01b939b23ed38653f7dbd2f45b563');
  const historical = variants.filter(v => Object.hasOwn(historicalBaseline.variantHashes, v.recipeId + '/' + v.versionId));
  assert.equal(checksum(historical),'3270ca1bbdfcacc680d4bc7f2f9a599e9599e26ac29e87f9684c15565a83eee0');
});

test('study scope correction is pinned, immutable, and cannot be reused by a changed manakish input', () => {
  const v=variants.find(v=>v.recipeId===manakishStudyBinding.recipeId)!;
  const before=JSON.stringify(v);
  assert.equal(v.studyServing,undefined);
  assert.equal(v.point,30.5);
  assert.equal(gkVariantScope(v),'STUDY_COMPARISON');
  assert.equal(JSON.stringify(v),before);
  assert.throws(()=>gkVariantScope({...v,inputSha256:'0'.repeat(64)}),/GK_SCOPE_REVIEW_REQUIRED/);
  assert.throws(()=>gkVariantScope({...v,versionId:'unreviewed-version'}),/GK_SCOPE_REVIEW_REQUIRED/);
  assert.throws(()=>countGkVersions(report.results,[v,v]),/distinct recipe within its scope/);
});

test('coverage copy shows original target and independent variant/study counts in every language', () => {
  for(const locale of locales){
    const html=renderToStaticMarkup(createElement(GkCoverageSummary,{coverage:counts,locale}));
    assert.ok(html.includes(coverageCopy[locale].title));
    assert.ok(html.includes(counts.originalNumeric + '/' + counts.total));
    assert.ok(html.includes('data-gk-coverage="VARIANT_COVERAGE"><strong>' + counts.variantNumeric + '</strong>'));
    assert.ok(html.includes('data-gk-coverage="STUDY_SERVINGS"><strong>' + counts.studyServingRecipeIds.length + '</strong>'));
    assert.ok(html.includes(counts.numericRecipes + '/' + counts.total));
    assert.ok(html.includes(counts.originalTarget + '/' + counts.total));
    assert.ok(html.includes('<strong>' + counts.originalTargetGap + '</strong>'));
  }
});

test('recipe page keeps an original total or an explicit missing message, alongside separate variants or study comparisons, in four languages', () => {
  for(const locale of locales){
    for(const id of ['keto-mutakakku',manakishStudyBinding.recipeId,'idli-sambar']){
      const html=recipeMarkup(id,locale);
      assert.ok(html.includes(escaped(gkCopy[locale].missing)),id+'/'+locale);
      assert.ok(html.includes('data-gk-status="UNAVAILABLE"'));
      assert.ok(!html.includes('data-gk-status="CALCULATED"'));
      const original=html.match(/<div class="recipe-glycemic-load"[^>]*>([\s\S]*?)<\/div>/)?.[1];
      assert.ok(original && !original.includes('gk-evidence__value'));
    }
    const html=recipeMarkup('kermainen-lohipata',locale);
    assert.ok(html.includes('data-gk-status="CALCULATED"'));
    assert.ok(!html.includes('data-gk-status="UNAVAILABLE"'));
  }
});

test('variant amounts and preparation are openly compared with the original; study portions do not follow the original serving control', () => {
  const variant=variants.find(v=>v.recipeId==='valimerellinen-farinata-aamupalaksi')!;
  const original=siteContent.recipes.find(r=>r.recipeId===variant.recipeId&&r.locale==='fi')!;
  for(const locale of locales){
    const html=renderToStaticMarkup(createElement(MemoryRouter,null,createElement(GkOnlyVariantPanel,{variant,locale,originalRecipe:original})));
    assert.ok(html.includes('data-gk-scope="RECIPE_VARIANT"'));
    assert.ok(html.includes('open=""'));
    assert.ok(html.includes('data-gk-original-comparison="amounts-and-preparation"'));
    assert.ok(html.includes(escaped(gkOnlyPreparation(variant,locale))));
    const study=variants.find(v=>v.recipeId===manakishStudyBinding.recipeId)!;
    const studyHtml=renderToStaticMarkup(createElement(MemoryRouter,null,createElement(GkOnlyVariantPanel,{variant:study,locale,servings:8})));
    assert.ok(studyHtml.includes(studyServingTitle[locale]));
    assert.ok(studyHtml.includes('data-gk-scope="STUDY_COMPARISON"'));
    assert.ok(studyHtml.includes('113 g'));
    assert.ok(!studyHtml.includes('904 g'));
    assert.ok(studyHtml.includes(gkOnlyValue(study,locale)));
  }
});

test('directory GK filters exclude missing original estimates, variants and studies while ordinary recipes remain searchable in all languages', () => {
  for(const locale of locales){
    const recipes=siteContent.recipes.filter(r=>r.locale===locale);
    const unfiltered=filterRecipes(recipes,emptyRecipeFilters,locale,glycemicLoadFilterCategories);
    assert.equal(unfiltered.length,recipes.length);
    for(const v of variants){
      if(!counts.originalRecipeIds.includes(v.recipeId)) assert.equal(glycemicLoadFilterCategories[v.recipeId],undefined,v.recipeId);
    }
    for(const gl of ['low','medium','high'] as const){
      const filtered=filterRecipes(recipes,{...emptyRecipeFilters,gl},locale,glycemicLoadFilterCategories);
      assert.ok(filtered.every(r=>counts.originalRecipeIds.includes(r.recipeId)));
    }
  }
});

test('fifteen pending decision packages remain in history with zero original-coverage forecast', () => {
  const review=JSON.parse(readFileSync(path.join(root,'docs/nutrition/gk-original-priority-v2-review.json'),'utf8'));
  assert.equal(review.candidates.length,15);
  assert.equal(review.expectedOriginalCoverageDelta,0);
  assert.equal(review.candidates.filter((c:any)=>c.classification==='VARIANT_ONLY').length,14);
  assert.equal(review.candidates.find((c:any)=>c.recipeId==='idli-sambar').classification,'NO_RELIABLE_GK');
  for(const c of review.candidates){
    assert.equal(c.ownerStatus,'PENDING');assert.equal(c.publicationAuthorized,false);
    assert.ok(!counts.originalRecipeIds.includes(c.recipeId));
    assert.ok([c.candidateSha256,c.originalSha256,c.inputSha256].every(h=>/^[a-f0-9]{64}$/.test(h)));
  }
});
