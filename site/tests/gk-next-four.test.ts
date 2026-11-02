import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {createElement as h} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {MemoryRouter} from 'react-router-dom';
import {buildApprovedFourVariants,loadApprovedFour,verifyNextFourCase,verifyMext05001,NEXT_FOUR_INPUTS,verifyNextFourManifest} from '../scripts/gk-next-four';
import {buildGkOnlyVariants} from '../scripts/gk149-integration';
import {buildApprovedSevenVariants} from '../scripts/gk-next-seven';
import {digest,textHash} from '../scripts/gk149-model';
import {countGkVersions,type GkOnlyVariant} from '../src/features/recipes/gk-only-types';
import {GkOnlyVariantPanel,gkOnlyQuantity,gkOnlyPreparation,gkOnlyValue,gkOnlyUi,gkScopeUi} from '../src/features/recipes/GkOnlyVariantPanel';
import {gkOnlyVariants,gkVersionCoverage} from '../src/generated/gk-only-variants.generated';

const root=fileURLToPath(new URL('../../',import.meta.url)),folder='docs/nutrition/gk80-next-four/';
const read=(p:string)=>JSON.parse(readFileSync(path.join(root,p),'utf8'));
const four=buildApprovedFourVariants(root),loaded=loadApprovedFour(root),manifest=verifyNextFourManifest(root),baseline=read(folder+'main-baseline.json');
const old=[...buildGkOnlyVariants(root),...buildApprovedSevenVariants(root)];
const render=(v:GkOnlyVariant,locale:'fi'|'en'|'sv'|'th',servings=v.servings)=>renderToStaticMarkup(h(MemoryRouter,null,h(GkOnlyVariantPanel,{variant:v,locale,servings})));

test('exact four A inputs extend23 unchanged GK-only versions to183 distinct numeric recipes',()=>{
 assert.equal(four.length,4);assert.deepEqual(Object.fromEntries(four.map(v=>[v.recipeId,v.inputSha256])),NEXT_FOUR_INPUTS);
 assert.ok(four.every(v=>v.level==='A'&&v.confidence==='LOW'&&v.codingKinds.length===0));
 assert.deepEqual(gkOnlyVariants,[...old,...four]);
 for(const previous of baseline.legacyVariants){const v=old.find(v=>v.recipeId===previous.recipeId)!;assert.equal(digest(v),previous.variantSha256,previous.recipeId);}
 const report=read('tmp/nutrition/glycemic-load-pilot.json');
 assert.deepEqual(report.gkOnlyVariants,gkOnlyVariants);assert.deepEqual(report.versionCoverage,gkVersionCoverage);
 assert.equal(gkVersionCoverage.numericRecipes,183);assert.equal(gkVersionCoverage.originalNumeric,156);assert.equal(gkVersionCoverage.additionalA,21);assert.equal(gkVersionCoverage.additionalB,6);assert.equal(gkVersionCoverage.total,326);assert.equal(gkVersionCoverage.missing,143);
 assert.deepEqual(report.coverageViews,{originalRecipe:{total:326,numeric:156,missing:170},atLeastOneExactVersion:{total:326,numeric:183,missing:143,additionalApprovedVersions:27}});
 assert.throws(()=>countGkVersions(report.results,[...gkOnlyVariants,four[0]]),/distinct/);
 for(const id of ['intialainen-besan-chilla','intialainen-pinaatti-paneer-chilla','jerk-kana','sate-ayam'])assert.ok(!gkOnlyVariants.some(v=>v.recipeId===id));
});
test('all326 parent GK objects,23 old variants, macro sources and recipe trees remain on the main baseline',()=>{
 const report=read('tmp/nutrition/glycemic-load-pilot.json');assert.equal(report.results.length,326);
 assert.deepEqual(Object.fromEntries(report.results.map((r:any)=>[r.recipeId,digest(r)])),baseline.originalResultHashes);
 assert.equal(report.results.filter((r:any)=>r.status==='CALCULATED').length,156);
 for(const [p,hash] of Object.entries(baseline.protectedSourceFilesLfSha256))assert.equal(textHash(readFileSync(path.join(root,p),'utf8')),hash,p);
 const changed=execFileSync('git',['diff','--name-only',baseline.main,'--','reseptit','kaannokset','docs/nutrition/calculations'],{cwd:root,encoding:'utf8'}).trim();assert.equal(changed,'');
 for(const v of four){assert.equal(v.macroScope,'NO_MACRO_PACKAGE_FOR_THIS_VERSION');for(const key of ['macros','nutrition','macroEvidence'])assert.ok(!(key in v));assert.equal(report.results.find((r:any)=>r.recipeId===v.recipeId).status,'INSUFFICIENT SOURCE DATA');}
});
test('original three approval receipts stay exact and do not grant Ready/merge/deploy authority',()=>{
 const lineage=read(folder+'approval-lineage.json');assert.equal(manifest.integrationAuthorized,true);
 for(const [p,binding] of Object.entries(lineage.receiptBindings) as Array<[string,any]>){
  const raw=readFileSync(path.join(root,p),'utf8'),pinned=execFileSync('git',['show',binding.sourceCommit+':'+p],{cwd:root,encoding:'utf8'});
  assert.equal(textHash(raw),textHash(pinned));assert.equal(textHash(raw),binding.sha256Lf);
  const a=JSON.parse(raw);assert.equal(a.readyAuthorized,false);assert.equal(a.mergeAuthorized,false);assert.equal(a.deployAuthorized,false);
 }
 assert.equal(manifest.readyAuthorized,false);assert.equal(manifest.mergeAuthorized,false);assert.equal(manifest.deployAuthorized,false);
 for(const {c} of loaded){verifyNextFourCase(c);assert.throws(()=>verifyNextFourCase({...c,recipeId:'intialainen-besan-chilla'}),/unapproved/);const changed=structuredClone(c);changed.candidateIngredients[0].grams=149;assert.throws(()=>verifyNextFourCase(changed),/unapproved/);}
});
test('MEXT05001 admission is separate from natto and cannot become arbitrary almond flour or a source zero',()=>{
 const context=read(folder+'sources.json').contexts.native,f=context.composition.find((f:any)=>f.id==='MEXT05001');
 assert.equal(verifyMext05001(context,f),5.2);assert.equal(150*5.2/100/8,0.975);assert.ok(Math.abs(1-0.975-0.025)<1e-12);
 assert.throws(()=>verifyMext05001(context,{...f,nativeId:'04046'}),/scope/);
 assert.throws(()=>verifyMext05001(context,{...f,id:'commercial-almond-flour'}),/scope/);
 const changed=structuredClone(context);changed.mext.records[0].massToken='-';assert.throws(()=>verifyMext05001(changed,f),/unmeasured/);
 assert.throws(()=>verifyMext05001(context,{...f,availablePer100g:0}),/scope/);
});
test('bulgogi retains dry300g rice, whole cooked marinade and oil; berry A excludes European bilberry',()=>{
 const b=loaded.find((x:any)=>x.c.recipeId==='bulgogi')!,berry=four.find(v=>v.recipeId==='rahka-marjakerroskulho')!;
 const rice=b.c.candidateIngredients.find((i:any)=>i.compositionId==='F007682');assert.equal(rice.grams,300);assert.match(rice.note,/dry/);
 assert.equal(b.c.candidateIngredients.find((i:any)=>i.compositionId==='F008065').grams,72);assert.equal(b.c.candidateIngredients.find((i:any)=>i.compositionId==='F008969').grams,14);
 const display=four.find(v=>v.recipeId==='bulgogi')!;assert.deepEqual(gkOnlyQuantity(display,4,8),{amount:2,unit:'tbsp'});assert.match(gkOnlyPreparation(display,'en'),/all cooked marinade and pan juices/);
 assert.match(berry.ingredients[3].name.en,/Canadian wild blueberry/);assert.match(berry.limitation!.en,/not European bilberries/);assert.equal(berry.point,2.34);
 assert.ok(!gkOnlyVariants.some(v=>v.inputSha256==='309fdb4e31b5c59ed01f25d96f8d1aa865ef154a12d7391cc5e9fe0e89c8ab18'));
});
test('native ml and original spoons scale without any gram mass or changed sealed input',()=>{
 const cocoa=four.find(v=>v.recipeId==='kaakao-kookos-chia')!,pie=four.find(v=>v.recipeId==='rahkapiirakka-vhh')!;
 for(const [servings,drink,cream] of [[2,100,50],[4,200,100],[8,400,200]]){
  assert.deepEqual(gkOnlyQuantity(cocoa,1,servings),{amount:drink,unit:'ml'});assert.deepEqual(gkOnlyQuantity(cocoa,2,servings),{amount:cream,unit:'ml'});
  assert.ok(gkOnlyPreparation(cocoa,'en',servings).includes(`${drink} ml`));assert.ok(gkOnlyPreparation(cocoa,'en',servings).includes(`${cream} ml`));
 }
 assert.equal(cocoa.ingredients[1].grams,null);assert.equal(cocoa.ingredients[2].grams,null);assert.deepEqual(gkOnlyQuantity(pie,5,16),{amount:4,unit:'tbsp'});
 const rows=loaded.find((x:any)=>x.c.recipeId==='kaakao-kookos-chia')!.result.ingredients;
 const drink=rows.find((i:any)=>i.recipeQuantity?.unit==='ml')!;assert.equal(drink.grams,null);assert.equal(drink.recipeQuantity!.massGrams,null);assert.equal(drink.availableCarbohydrateUpperBoundPerServingG,0.2);
 assert.ok(Math.abs(cocoa.sensitivity!.min)<1e-12&&Math.abs(cocoa.sensitivity!.max-2.53125)<1e-12);
 const ambiguous=structuredClone(cocoa);ambiguous.ingredients[1].grams=200;assert.throws(()=>gkOnlyQuantity(ambiguous,1),/contract/);
 assert.throws(()=>gkOnlyQuantity({...cocoa,quantityContract:undefined},1),/contract/);assert.throws(()=>gkOnlyQuantity(cocoa,1,0),/servings/);
 for(const v of old)for(let i=0;i<v.ingredients.length;i++){const grams=v.ingredients[i].grams;assert.deepEqual(gkOnlyQuantity(v,i,v.servings*2),grams===null?null:{amount:grams*2,unit:'g'});}
});
test('four-language panels expose exact scope, omission limits and source units before source details',()=>{
 for(const v of four)for(const locale of ['fi','en','sv','th'] as const){
  const html=render(v,locale),t=gkOnlyUi[locale];assert.ok(html.includes(t.scope)&&html.includes(t.low)&&html.includes(t.sources)&&html.includes(t.omissionEnd));
  assert.ok(html.includes('NO_MACRO_PACKAGE_FOR_THIS_VERSION')&&html.includes('GK_ONLY_NATIVE_UNITS_V1'));assert.ok(!/undefined|NaN|\{\{/.test(html));
  assert.ok(html.indexOf('data-gk-limitation')<html.indexOf(t.a));assert.ok(html.includes(v.limitation![locale]));
  if(v.point!<1)assert.equal(gkOnlyValue(v,locale),gkScopeUi[locale].tiny);
 }
 const cocoa=four.find(v=>v.recipeId==='kaakao-kookos-chia')!;
 assert.ok(render(cocoa,'fi',8).includes('400 ml'));assert.ok(render(cocoa,'sv',8).includes('200 ml'));assert.ok(render(cocoa,'th',8).includes('400 มล.'));
 for(const key of ['0,9625','0,725'])assert.ok(render(cocoa,'fi').includes(key));
});
test('independent Decimal replay matches four admitted A results and keeps native ml caps separate',()=>{
 const output=JSON.parse(execFileSync(process.platform==='win32'?'python':'python3',['-I',path.join(root,folder+'verify_decimal.py')],{encoding:'utf8'}));assert.equal(output.status,'PASS');assert.equal(output.checked,4);assert.equal(output.writes,0);
 for(const v of four){const actual=output.results.find((r:any)=>r.recipeId===v.recipeId);assert.equal(Number(actual.point),v.point);assert.ok(Math.abs(Number(actual.omittedCho)-v.omittedCho)<1e-12);}
 const cacao=output.results.find((r:any)=>r.recipeId==='kaakao-kookos-chia');assert.equal(cacao.coveredCho,'0.725');assert.equal(cacao.omittedCho,'0.9625');
});
