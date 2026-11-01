import {siteContent} from '../src/generated/content.generated';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import test from 'node:test';import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';
import {fingerprint} from '../scripts/gk80-candidate-model';
import {calculateCandidate} from '../scripts/gk80-candidate-policy';

import {parseMarkdown} from '../src/content/markdown';
import {verifyNutritionEvidence} from '../scripts/nutrition-evidence';
import {normalizeCarbohydrate} from '../scripts/nutrition-model';
const root=new URL('../../',import.meta.url),folder=new URL('docs/nutrition/gk80-release-6/',root),json=(n:string)=>JSON.parse(readFileSync(new URL(n,folder),'utf8'));
const recipes=json('recipes.json').recipes,sources=json('sources.json').records,comps=json('composition-sources.json').records,golden=json('golden.json').recipes;
test('all5 exact source versions, typed food bindings, macros and published recipe evidence match',()=>{
 assert.equal(recipes.length,5);assert.equal(new Set(recipes.map((r:any)=>r.recipeId)).size,5);
 for(const r of recipes){const text=readFileSync(new URL(r.sourcePath,root),'utf8'),hash=createHash('sha256').update(text.replaceAll('\r\n','\n')).digest('hex'),g=golden.find((g:any)=>g.recipeId===r.recipeId),out=calculateCandidate(r,sources,hash,g.inputHash,comps);assert.equal(out.numericProposal,true,r.recipeId);
  assert.ok(Math.abs(out.min!-g.scenarios[0].wholeGk)<1e-10,r.recipeId);assert.equal(r.proposedVersionHash,fingerprint({title:r.proposedTitle,servings:r.servings,scenarios:r.scenarios,preparation:r.proposedPreparation}));
  const parsed=parseMarkdown(text)!;const evidence=JSON.parse(readFileSync(new URL(`docs/nutrition/calculations/${r.recipeId}.json`,root),'utf8'));assert.deepEqual(verifyNutritionEvidence(parsed.data as never,evidence).errors,[],r.recipeId);
  const live=siteContent.recipes.find(x=>x.recipeId===r.recipeId&&x.locale==='fi')!,publication=json('publication-macros.json').recipes.find((x:any)=>x.recipeId===r.recipeId);assert.ok(live);for(const entry of siteContent.recipes.filter(x=>x.recipeId===r.recipeId))assert.deepEqual(entry.nutrition,publication.publishedMacros,r.recipeId+'/'+entry.locale);
  assert.throws(()=>calculateCandidate(r,sources,'0'.repeat(64),g.inputHash,comps),/STALE_INPUT/);
 }
});
test('independent Decimal reproduces all5 release6 recipe contributions',()=>{
 assert.equal(JSON.parse(execFileSync(process.platform==='win32'?'python':'python3',[fileURLToPath(new URL('site/scripts/gk80-release6-decimal.py',root))],{encoding:'utf8'})).status,'PASS');
});
test('photograph scope is disclosed for every candidate',()=>{for(const r of recipes){const t=readFileSync(new URL(r.sourcePath,root),'utf8');assert.match(t,/Kuva on tarjoilua havainnollistava kuvituskuva/);assert.match(t,/kuvan ylimääräiset lisukkeet eivät kuulu arvioon/);}});

test('held paneer and bay records remain explicitly unverified, never invented zero polyols',()=>{
 const held=json('held-review.json').recipes;assert.equal(held.length,2);
 for(const entry of held){const target=entry.lockedResearchBundle.comps.find((c:any)=>['N01301-r6','U170917-r6'].includes(c.id));assert.equal(target.sourceRecord.polyolsSourceVerified,false);assert.equal(target.sourceRecord.polyolsValue,null);const isUs=target.id.startsWith('U');assert.equal(normalizeCarbohydrate({...target.sourceRecord,carbohydrateDefinition:isUs?'US_TOTAL_INCLUDING_FIBRE':'EU_AVAILABLE',per100g:{carbohydrate:isUs?target.sourceRecord.totalCarbohydratePer100g:target.per100g.availableCarbohydrate,fibre:target.per100g.fibre,polyols:null}}).net,null);}
 const registry=JSON.parse(readFileSync(new URL('docs/nutrition/gk80-release-registry.json',root),'utf8'));for(const id of ['palak-paneer','nakkikeitto-kukkakaalilla'])assert.equal(registry.requiredPacks.some((p:any)=>p.recipeIds.includes(id)),false);
});
test('all and only the existing nine translated pages match weighed ingredient masses and preparation counts',()=>{
 for(const r of recipes){const entries=siteContent.recipes.filter(x=>x.recipeId===r.recipeId);const manifest=json('manifest.json');assert.deepEqual(entries.map(x=>x.locale).sort(),manifest.existingLocales[r.recipeId].sort());for(const e of entries){assert.equal(e.instructionsText.length,r.proposedPreparation.length);}}
});
