import {assertScratch} from './scratch-scope.mts';
import fs from 'node:fs/promises';import path from 'node:path';import {pathToFileURL} from 'node:url';
const root=path.resolve(process.argv[2]),out=path.resolve(process.argv[3]);
await assertScratch(out);
const mod=async(p:string)=>import(pathToFileURL(path.join(root,p)).href);
const {recipeNutritionInputHash}=await mod('site/scripts/nutrition-evidence.ts');
const {recipeBindingHash,exactRecipeTextBindingMatches}=await mod('site/scripts/glycemic-load-recipe-binding.ts');
const {createHash}=await import('node:crypto');
const baseline=JSON.parse(await fs.readFile(path.join(out,'../run/baseline-internal.json'),'utf8'));
const fineli=JSON.parse(await fs.readFile(path.join(root,'docs/nutrition/fineli-release-20-reference.json'),'utf8'));
const bindings=JSON.parse(await fs.readFile(path.join(root,'docs/nutrition/glycemic-load-recipe-bindings.json'),'utf8'));
const count=(a:any[])=>a.reduce((o:any,x:any)=>(o[x]=(o[x]??0)+1,o),{});
const quantities=[],paired=[],recordDefinitions=[];
for(const r of baseline.rows){
 for(const [ix,i] of r.recipe.ingredients.entries())if(i.amount===null||!['g','kg'].includes(i.unit))quantities.push({recipeId:r.recipeId,index:ix,item:i.item,amount:i.amount,unit:i.unit,hasCurrentEvidence:Boolean(r.evidence),evidenceConversion:r.evidence?.ingredients[ix]?.gramsPerUnit??null,excluded:Boolean(r.evidence?.ingredients[ix]?.excludedReason)});
 const a=r.evidence?.ingredients.filter((i:any)=>/foodstandards\.gov\.au/.test(i.record?.sourceUrl??'')&&/paired/i.test(i.record?.polyolsEvidence??''))??[];
 if(a.length)paired.push({recipeId:r.recipeId,baselineStatus:r.checked.status,rows:a.map((i:any)=>({item:i.item,recordId:i.record.id,polyols:i.record.per100g.polyols,evidence:i.record.polyolsEvidence}))});
 if(r.evidence)for(const i of r.evidence.ingredients)if(i.record)recordDefinitions.push({recipeId:r.recipeId,item:i.item,id:i.record.id,definition:i.record.carbohydrateDefinition,missingPolyols:i.record.per100g.polyols==null});
}
const probe=baseline.rows.find((r:any)=>r.recipeId==='marokkolainen-couscous');
const encode=(data:any,content=probe.content)=>`---\n${JSON.stringify(data)}\n---\n${content}`;
const baseData=probe.recipe,baseText=encode(baseData);const baseMacro=recipeNutritionInputHash(baseData),baseGk=recipeBindingHash(baseText);
const hash=(text:string)=>createHash('sha256').update(text).digest('hex');
const tests:any[]=[];
for(const change of ['title','image','formatting','editorialProse','preparationProse','ingredientName','ingredientAmount','servings','cookingMethod','ingredientNote','ingredientStateNote']){
 const d=structuredClone(baseData);let content=probe.content;
 if(change==='title')d.title+=' audit';if(change==='image')d.image.src='audit/image.webp';
 if(change==='editorialProse')content+='\nToimituksellinen lisätieto.\n';
 if(change==='preparationProse')content=content.replace(/## Valmistus/,'## Valmistus\n\nKeitä vielä 20 minuuttia.');
 if(change==='ingredientName')d.ingredients[0].item+=' audit';
 if(change==='ingredientAmount')d.ingredients[0].amount+=1;if(change==='servings')d.servings+=1;
 if(change==='cookingMethod')d.cooking_method=[...(d.cooking_method??[]),'haudutus'];
 if(change==='ingredientNote')d.ingredients[0].note='toimituksellinen lisähuomio';
 if(change==='ingredientStateNote')d.ingredients[0].note='valutettu';
 let text=encode(d,content);if(change==='formatting')text=text.replace('\n---\n','\n---\n\n');
 tests.push({change,nutritionInputHashChanged:recipeNutritionInputHash(d)!==baseMacro,gkStructuralHashChanged:recipeBindingHash(text)!==baseGk,exactTextHashChanged:!exactRecipeTextBindingMatches(hash(baseText),text)});
}
const complete=baseline.rows.filter((r:any)=>r.evidence&&r.checked.calculated?.rows);
const unresolvedConversions=complete.flatMap((r:any)=>r.checked.calculated.rows.filter((x:any)=>x.issues.some((i:string)=>/unit conversion/.test(i))).map((x:any)=>({recipeId:r.recipeId,item:x.item,issues:x.issues})));
const result={hashMutationProbes:tests,exactTextBindings:Object.keys(bindings.exactRecipeText??{}).length,quantities,unresolvedCurrentEvidenceConversions:unresolvedConversions,fineliPortionRecords:fineli.foods.filter((f:any)=>Object.keys(f.portion_mass_g??{}).length).length,fineliPortionFields:count(fineli.foods.flatMap((f:any)=>Object.keys(f.portion_mass_g??{}))),pairedAfcdRecipes:paired,pairedAfcdStatuses:count(paired.map((p:any)=>p.baselineStatus)),recordDefinitionCounts:count(recordDefinitions.map((r:any)=>r.definition)),recordDefinitions};
await fs.writeFile(path.join(out,'diagnostics.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({hashMutationProbes:tests,exactTextBindings:result.exactTextBindings,nonMassOrMissingQuantities:quantities.length,recipesWithNonMassOrMissingQuantities:new Set(quantities.map((x:any)=>x.recipeId)).size,unresolvedCurrentEvidenceConversions:unresolvedConversions,fineliPortionRecords:result.fineliPortionRecords,pairedAfcdStatuses:result.pairedAfcdStatuses}));
