import {siteContent} from '../src/generated/content.generated';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import test from 'node:test';import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';
import {fingerprint} from '../scripts/gk80-candidate-model';
import {calculateCandidate} from '../scripts/gk80-candidate-policy';

import {parseMarkdown} from '../src/content/markdown';
import {recipeFrontmatterSchema} from '../src/content/schema';
import {semanticHash} from '../scripts/translation-semantic-review';
import {verifyNutritionEvidence} from '../scripts/nutrition-evidence';
import {normalizeCarbohydrate} from '../scripts/nutrition-model';
const root=new URL('../../',import.meta.url),folder=new URL('docs/nutrition/gk80-release-7/',root),json=(n:string)=>JSON.parse(readFileSync(new URL(n,folder),'utf8'));
const recipes=json('recipes.json').recipes,sources=json('sources.json').records,comps=json('composition-sources.json').records,golden=json('golden.json').recipes;
test('all11 exact source versions, typed food bindings, macros and published recipe evidence match',()=>{
 assert.equal(recipes.length,11);assert.equal(new Set(recipes.map((r:any)=>r.recipeId)).size,11);
 for(const r of recipes){const text=readFileSync(new URL(r.sourcePath,root),'utf8'),hash=createHash('sha256').update(text.replaceAll('\r\n','\n')).digest('hex'),g=golden.find((g:any)=>g.recipeId===r.recipeId),out=calculateCandidate(r,sources,hash,g.inputHash,comps);assert.equal(out.numericProposal,true,r.recipeId);
  assert.ok(Math.abs(out.min!-g.scenarios[0].wholeGk)<1e-10,r.recipeId);assert.equal(r.proposedVersionHash,fingerprint({title:r.proposedTitle,servings:r.servings,scenarios:r.scenarios,preparation:r.proposedPreparation}));
  const parsed=parseMarkdown(text)!;const evidence=JSON.parse(readFileSync(new URL(`docs/nutrition/calculations/${r.recipeId}.json`,root),'utf8'));assert.deepEqual(verifyNutritionEvidence(parsed.data as never,evidence).errors,[],r.recipeId);
  const live=siteContent.recipes.find(x=>x.recipeId===r.recipeId&&x.locale==='fi')!,publication=json('publication-macros.json').recipes.find((x:any)=>x.recipeId===r.recipeId);assert.ok(live);for(const entry of siteContent.recipes.filter(x=>x.recipeId===r.recipeId))assert.deepEqual(entry.nutrition,publication.publishedMacros,r.recipeId+'/'+entry.locale);
  assert.throws(()=>calculateCandidate(r,sources,'0'.repeat(64),g.inputHash,comps),/STALE_INPUT/);
 }
});
test('independent Decimal reproduces all11 release7 recipe contributions',()=>{
 assert.equal(JSON.parse(execFileSync(process.platform==='win32'?'python':'python3',[fileURLToPath(new URL('site/scripts/gk80-release7-decimal.py',root))],{encoding:'utf8'})).status,'PASS');
});
test('photograph scope is disclosed for every candidate',()=>{for(const r of recipes){const t=readFileSync(new URL(r.sourcePath,root),'utf8');assert.match(t,/Kuva on tarjoilua havainnollistava kuvituskuva/);assert.match(t,/kuvan ylimääräiset lisukkeet eivät kuulu arvioon/);}});


test('seven blocked proposals retain missing-polyol evidence and stay outside the release registry',()=>{
 const held=json('held-review.json').recipes;assert.equal(held.length,7);
 for(const h of held){const c=h.lockedResearchBundle.comps.find((c:any)=>c.id.startsWith('U')||['maille-label-proxy','chicken-label-proxy'].includes(c.id));assert.ok(c,h.recipeId);const us=c.id.startsWith('U');assert.equal(normalizeCarbohydrate({...c.sourceRecord,carbohydrateDefinition:us?'US_TOTAL_INCLUDING_FIBRE':'EU_AVAILABLE',per100g:{carbohydrate:c.per100g.availableCarbohydrate+(us?c.per100g.fibre:0),fibre:c.per100g.fibre,polyols:null}}).net,null,h.recipeId);}
 const registry=JSON.parse(readFileSync(new URL('docs/nutrition/gk80-release-registry.json',root),'utf8'));
 for(const id of [...held.map((h:any)=>h.recipeId),'jerk-kana','pav-bhaji','palak-paneer','nakkikeitto-kukkakaalilla'])assert.equal(registry.requiredPacks.some((p:any)=>p.recipeIds.includes(id)),false,id);
});

test('all thirty existing translated pages preserve weighed masses, serving counts, macros and preparation structure',()=>{
 let checked=0;const historical=json('historical-source-text.json'),manifest=json('manifest.json');
 const jsonFromRoot=(p:string)=>JSON.parse(readFileSync(new URL('../../'+p,import.meta.url),'utf8'));
 const publicationIndex=jsonFromRoot('meta/kaannokset/published-translation-pairs.json');
 const reviewProofs=jsonFromRoot('meta/kaannokset/codex-review-evidence.json');
 for(const r of recipes){
  const fiText=readFileSync(new URL(r.sourcePath,root),'utf8');
  const fiParsed=parseMarkdown(fiText)!;
  const fi=fiParsed.data as any;
  const entries=siteContent.recipes.filter(x=>x.recipeId===r.recipeId);
  const historicalLocales=manifest.existingLocales[r.recipeId] as string[];
  const newLocales=(publicationIndex.sources.find((x:any)=>x.recipe_id===r.recipeId)?.locales??[]) as string[];
  assert.deepEqual(entries.map(x=>x.locale).sort(),[...new Set([...historicalLocales,...newLocales])].sort(),r.recipeId+': only historically recorded or SHA-attested additions');
  for(const locale of newLocales.filter(x=>!historicalLocales.includes(x))){
   const translatedPath='kaannokset/'+locale+'/'+r.sourcePath.replace('reseptit/','');
   const parsed=parseMarkdown(readFileSync(new URL(translatedPath,root),'utf8'))!;
   const proof=reviewProofs[r.recipeId+':'+locale];
   assert.ok(proof,r.recipeId+':'+locale+': missing publication proof');
   assert.equal(proof.outcome,'pass',r.recipeId+':'+locale);
   assert.deepEqual(proof.findings.filter((x:any)=>x.status==='open'&&['P0','P1'].includes(x.severity)),[]);
   assert.equal(proof.source_hash,semanticHash({data:recipeFrontmatterSchema.parse(fiParsed.data),content:fiParsed.content}),r.recipeId+':'+locale+': source proof');
   assert.equal(proof.translation_hash,semanticHash({data:recipeFrontmatterSchema.parse(parsed.data),content:parsed.content}),r.recipeId+':'+locale+': translation proof');
  }
  for(const e of entries)assert.equal(e.instructionsText.length,r.proposedPreparation.length);
  for(const file of Object.keys(historical).filter(f=>f.startsWith('kaannokset/')&&f.endsWith('/'+r.recipeId+'.md'))){const d=parseMarkdown(readFileSync(new URL(file,root),'utf8'))!.data as any;assert.deepEqual(d.ingredients.map((i:any)=>[i.amount,i.unit]),fi.ingredients.map((i:any)=>[i.amount,i.unit]),file);assert.equal(d.servings,fi.servings,file);assert.equal(d.time_total_min,fi.time_total_min,file);checked++;}
 }assert.equal(checked,30);
});

test('quesadilla public GI explanation matches its locked tortilla source binding',()=>{
 const r=recipes.find((r:any)=>r.recipeId==='meksikolainen-quesadilla-sienilla');
 const i=r.scenarios[0].ingredients.find((i:any)=>i.composition?.sourceId==='F35554-r5');
 const bound=sources.find((s:any)=>s.id===i.impact.sourceId);assert.ok(bound);
 const text=readFileSync(new URL(r.sourcePath,root),'utf8');
 const stated=text.match(/Tortillan GI (\d+,\d+)/);assert.ok(stated);
 assert.equal(Number(stated[1].replace(',','.')),bound.gi);
 const review=readFileSync(new URL('docs/nutrition/gk80-run8/README.md',root),'utf8');
 const reviewed=review.match(/Quesadilla:[\s\S]*?\(GI (\d+,\d+)/);assert.ok(reviewed);
 assert.equal(Number(reviewed[1].replace(',','.')),bound.gi);
});
