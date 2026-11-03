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

test('the four A inputs and legacy variants remain intact as four approved B versions enter coverage',()=>{
 assert.equal(four.length,4);assert.deepEqual(Object.fromEntries(four.map(v=>[v.recipeId,v.inputSha256])),NEXT_FOUR_INPUTS);
 assert.ok(four.every(v=>v.level==='A'&&v.confidence==='LOW'&&v.codingKinds.length===0));
 assert.deepEqual(gkOnlyVariants.slice(0,27),[...old,...four]);
 for(const previous of baseline.legacyVariants){const v=old.find(v=>v.recipeId===previous.recipeId)!;assert.equal(digest(v),previous.variantSha256,previous.recipeId);}
 const report=read('tmp/nutrition/glycemic-load-pilot.json');
 assert.deepEqual(report.gkOnlyVariants,gkOnlyVariants);assert.deepEqual(report.versionCoverage,gkVersionCoverage);
 assert.equal(gkVersionCoverage.numericRecipes,198);assert.equal(gkVersionCoverage.originalNumeric,156);assert.equal(gkVersionCoverage.additionalA,32);assert.equal(gkVersionCoverage.additionalB,10);assert.equal(gkVersionCoverage.total,326);assert.equal(gkVersionCoverage.missing,128);
 assert.deepEqual(report.coverageViews,{originalRecipe:{total:326,numeric:156,missing:170},atLeastOneExactVersion:{total:326,numeric:198,missing:128,additionalApprovedVersions:42}});
 assert.throws(()=>countGkVersions(report.results,[...gkOnlyVariants,four[0]]),/distinct/);
 for(const id of ['jerk-kana','sate-ayam'])assert.ok(!gkOnlyVariants.some(v=>v.recipeId===id));
});
test('only the approved B inputs appear with outward-rounded source ranges',()=>{
 const expected = {
  'intialainen-besan-chilla': ['5c0942255538ff47e866006ff3fb40d44bd25abe5c30496c69cdcee8adccd01a','9–12'],
  'intialainen-pinaatti-paneer-chilla': ['cdfff763f373d92f5142ac772b52068a2e453ebd56bcff5c29b507422c6a8d16','9–11'],
  'intialainen-mannasuurimoupma': ['365f6eaff17867ea8fc415dd57af8d2ef91176e2c80239dfbc0d69ac2dc2d1cc','26–27'],
  'intialainen-ven-pongal': ['88400041451f8120facd3394a151f79639d901cc4c8359f36859fe9251bc1345','40–46'],
 };
 const added = gkOnlyVariants.slice(27,31);
 assert.deepEqual(added.map(v=>v.recipeId).sort(),Object.keys(expected).sort());
 for (const v of added) {
  const [input,range] = expected[v.recipeId as keyof typeof expected];
  assert.equal(v.inputSha256,input);
  assert.equal(v.level,'B');
  assert.equal(v.omittedCho,0);
  assert.equal(v.macroScope,'NO_MACRO_PACKAGE_FOR_THIS_VERSION');
  for (const locale of ['fi','en','sv','th'] as const) {
   assert.equal(gkOnlyValue(v,locale),range);
   assert.ok(render(v,locale).includes(v.limitation![locale]));
  }
 }
 const pongal = added.find(v=>v.recipeId==='intialainen-ven-pongal')!;
 assert.deepEqual(gkOnlyQuantity(pongal,4,4),{amount:1400,unit:'ml'});
});

test('four product A versions preserve the approved calculated-part presentation',()=>{
 const expected = {
  'paella-valenciana': [40.35,'39–41',1.675],
  'kana-tagine-sitruunalla': [21.05,'21–25',1.68725],
  'hernekeitto-savupotkalla': [16.22,'≈ 16,22',1.5628875],
  'uunimakkara-sipulipedilla': [0.26,gkScopeUi.fi.tiny,1.4763875],
 };
 const added = gkOnlyVariants.slice(31,35);
 assert.deepEqual(added.map(v=>v.recipeId).sort(),Object.keys(expected).sort());
 for (const v of added) {
  const [point,display,omitted] = expected[v.recipeId as keyof typeof expected];
  assert.equal(v.point,point);
  assert.equal(gkOnlyValue(v,'fi'),display);
  assert.ok(Math.abs(v.omittedCho-Number(omitted))<1e-10);
  assert.equal(v.level,'A');
  assert.equal(v.macroScope,'NO_MACRO_PACKAGE_FOR_THIS_VERSION');
  for (const locale of ['fi','en','sv','th'] as const) {
   assert.ok(render(v,locale).includes(v.limitation![locale]));
  }
 }
 const tagine = added.find(v=>v.recipeId==='kana-tagine-sitruunalla')!;
 assert.deepEqual(gkOnlyQuantity(tagine,14,8),{amount:600,unit:'ml'});
});

test('Panang and tofu kimchi use the approved calculated portions and quantities',()=>{
 const [panang,kimchi]=gkOnlyVariants.slice(35,37);
 assert.equal(panang.recipeId,'panang-curry-kanalla-vhh');
 assert.equal(panang.point,1.89);
 assert.ok(Math.abs(panang.omittedCho-1.9328)<1e-10);
 assert.deepEqual(gkOnlyQuantity(panang,6,4),{amount:15,unit:'ml'});
 assert.equal(kimchi.recipeId,'korealainen-tofu-kimchi-aamiaiskulho');
 assert.equal(kimchi.point,25.16);
 assert.equal(kimchi.omittedCho,1.2);
 assert.equal(gkOnlyQuantity(kimchi,4),null);
 for (const variant of [panang,kimchi]) {
  assert.equal(variant.macroScope,'NO_MACRO_PACKAGE_FOR_THIS_VERSION');
  for (const locale of ['fi','en','sv','th'] as const) {
   assert.ok(render(variant,locale).includes(variant.limitation![locale]));
  }
 }
});

test('approved curry variants retain the sealed calculation and native quantities',()=>{
 const [green,red,yellow]=gkOnlyVariants.slice(38,41);
 assert.deepEqual([green.point,red.point,yellow.point],[2.38,1.95,1.28]);
 assert.deepEqual(gkOnlyQuantity(green,6,8),{amount:60,unit:'ml'});
 assert.deepEqual(gkOnlyQuantity(red,5,8),{amount:30,unit:'g'});
 assert.ok([green,red,yellow].every(v=>v.level==='A' && v.omittedCho<2));
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

test('blueberry pie adds one exact GK-only version with separate egg quantities', () => {
 const variant = gkOnlyVariants.find(v => v.recipeId === 'vhh-mustikkapiirakka');
 assert.ok(variant);
 assert.equal(variant.level, 'A');
 assert.equal(variant.point, 1.3);
 assert.ok(Math.abs(variant.omittedCho - 1.736875) < 1e-10);
 assert.deepEqual(variant.ingredients.map(i => i.grams), [150, 75, 55, 250, 110, 150, 5]);
 assert.equal(variant.macroScope, 'NO_MACRO_PACKAGE_FOR_THIS_VERSION');
});

test('Lindström brine is an independent preparation with scaled, fully included brine quantities', () => {
  const variant = gkOnlyVariants.find(v => v.recipeId === 'lindstrominpihvit-kaalilla')!;
  assert.equal(variant.point, 6.9);
  assert.equal(variant.omittedCho, 0.6495625);
  assert.equal(variant.macroScope, 'NO_MACRO_PACKAGE_FOR_THIS_VERSION');
  assert.equal(variant.standalonePreparation, true);
  for (const [index, amount] of [[2, 20], [3, 10], [4, 30]]) {
    assert.deepEqual(gkOnlyQuantity(variant, index, 8), {amount, unit: 'g'});
  }
  for (const locale of ['fi', 'en', 'sv', 'th'] as const) {
    const html = render(variant, locale);
    assert.ok(html.includes(variant.limitation![locale]));
    assert.ok(html.includes(variant.preparation[locale]));
    assert.ok(!html.includes(gkOnlyUi[locale].prepare));
  }
});
