import {siteContent} from '../src/generated/content.generated';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import test from 'node:test';import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';
import {fingerprint} from '../scripts/gk80-candidate-model';
import {calculateCandidate} from '../scripts/gk80-candidate-policy';
import {loadPacks} from '../scripts/gk80-release';
import {parseMarkdown} from '../src/content/markdown';
import {verifyNutritionEvidence} from '../scripts/nutrition-evidence';
const root=new URL('../../',import.meta.url),folder=new URL('docs/nutrition/gk80-release-3/',root),json=(n:string)=>JSON.parse(readFileSync(new URL(n,folder),'utf8'));
const recipes=json('recipes.json').recipes,sources=json('sources.json').records,comps=json('composition-sources.json').records,golden=json('golden.json').recipes;
test('all12 exact source versions, typed food bindings, macros and published recipe evidence match',()=>{
 assert.equal(recipes.length,12);assert.equal(new Set(recipes.map((r:any)=>r.recipeId)).size,12);
 for(const r of recipes){const text=readFileSync(new URL(r.sourcePath,root),'utf8'),hash=createHash('sha256').update(text.replaceAll('\r\n','\n')).digest('hex'),g=golden.find((g:any)=>g.recipeId===r.recipeId),out=calculateCandidate(r,sources,hash,g.inputHash,comps);assert.equal(out.numericProposal,true,r.recipeId);
  assert.ok(Math.abs(out.min!-g.scenarios[0].wholeGk)<1e-10,r.recipeId);assert.equal(r.proposedVersionHash,fingerprint({title:r.proposedTitle,servings:r.servings,scenarios:r.scenarios,preparation:r.proposedPreparation}));
  const parsed=parseMarkdown(text)!;const evidence=JSON.parse(readFileSync(new URL(`docs/nutrition/calculations/${r.recipeId}.json`,root),'utf8'));assert.deepEqual(verifyNutritionEvidence(parsed.data as never,evidence).errors,[],r.recipeId);
  const live=siteContent.recipes.find(x=>x.recipeId===r.recipeId&&x.locale==='fi')!,publication=json('publication-macros.json').recipes.find((x:any)=>x.recipeId===r.recipeId);assert.ok(live);assert.deepEqual(live.nutrition,publication.publishedMacros,r.recipeId);
  assert.throws(()=>calculateCandidate(r,sources,'0'.repeat(64),g.inputHash,comps),/STALE_INPUT/);
 }
});
test('standalone main-based pack3 adds12 different results, preserving314 others',async()=>{
 const report=JSON.parse(readFileSync(new URL('tmp/nutrition/glycemic-load-pilot.json',root),'utf8')),selected=new Set(recipes.map((r:any)=>r.recipeId));assert.equal(report.results.length,326);assert.equal(report.summary.calculated,95);
 for(const old of json('legacy-baseline.json').recipes){const now=report.results.find((r:any)=>r.recipeId===old.recipeId);assert.ok(now);if(selected.has(old.recipeId)){assert.equal(old.status,'INSUFFICIENT SOURCE DATA');assert.equal(now.status,'CALCULATED');assert.equal(now.confidence,'LOW');assert.equal(now.omittedAvailableCarbohydratePerServingG,0);}else assert.equal(createHash('sha256').update(JSON.stringify(now)).digest('hex'),old.sha256,old.recipeId);}
 const packs=await loadPacks(fileURLToPath(root));assert.equal(packs.length,1);assert.equal(packs[0].recipes.length,12);
 const m=json('manifest.json');for(const id of m.recipeIds)assert.deepEqual(m.existingLocales[id],['fi']);assert.equal(m.approvalState,'READY_FOR_OWNER_METHOD_AND_CONTENT_REVIEW');
});
test('independent Decimal reproduces all12 release3 recipe contributions',()=>{
 assert.equal(JSON.parse(execFileSync(process.platform==='win32'?'python':'python3',[fileURLToPath(new URL('site/scripts/gk80-release3-decimal.py',root))],{encoding:'utf8'})).status,'PASS');
});
test('photographs are disclosed illustrations and the soup no longer uses the skewer photograph',()=>{
 for(const r of recipes){const text=readFileSync(new URL(r.sourcePath,root),'utf8');assert.match(text,/Kuva on tarjoilua havainnollistava kuvituskuva/);assert.match(text,/kuvan ylimääräiset lisukkeet eivät kuulu arvioon/);}
 const soup=parseMarkdown(readFileSync(new URL(recipes.find((r:any)=>r.recipeId==='shoyu-kanakeitto-konjac').sourcePath,root),'utf8'))!;
 assert.equal((soup.data.image as any).src,'aamupalat/vietnamilainen-pho-ga-aamuksi.webp');
 assert.match(String((soup.data.image as any).alt),/Kuvituskuva kananuudelikeitosta/);
});
