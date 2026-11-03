import {readFileSync} from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
const root=path.resolve(process.argv[2]??path.join(import.meta.dirname,'../../..'));
const dir=process.argv[3]??import.meta.dirname;
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const bundle=read(path.join(dir,'granola-conditional-input.json'));
const baseline=read(path.join(dir,'scope-and-baseline.json'));
for(const [rel,hash] of Object.entries(baseline.sourceHashes)){
 if(createHash('sha256').update(readFileSync(path.join(root,rel))).digest('hex')!==hash)throw Error('BASELINE_CHANGED: '+rel);
}
const {calculateGlycemicLoad}=await import(pathToFileURL(path.join(root,'site/scripts/glycemic-load-model.ts')).href);
const original=read(path.join(root,'docs/nutrition/glycemic-load-pilot-input.json')).recipes.find((x:any)=>x.recipeId===bundle.recipeId);
const foods=bundle.sourceRowsAndInputs.map((r:any)=>{
 const food=structuredClone(r.sourceRecord);
 if(r.nativeAvailableCarbohydrateEvidence){
  food.per100g.carbohydrate=r.nativeAvailableCarbohydrateEvidence.available_carbohydrate_without_sugar_alcohols_g_per_100g;
  food.per100g.polyols=null;food.polyolsSourceVerified=false;
  food.polyolsEvidence='Individual polyols unknown; use native available carbohydrate without sugar alcohols, without subtraction.';
 }
 return food;
});
const allGi=read(path.join(root,'docs/nutrition/glycemic-index-records.json')).records;
const before=calculateGlycemicLoad(original,foods,allGi);
const proposed=structuredClone(original);
const cinnamon=proposed.ingredients.find((i:any)=>i.name==='kanelia');
const food=foods.find((f:any)=>f.id===cinnamon.fineliRecordId);
const cho=food.per100g.carbohydrate*cinnamon.grams/100/original.servings;
if(cho>bundle.templateSourceCard.maxCarbohydratePerServing||cho>bundle.templateSourceCard.maxCumulativeCarbohydratePerServing)throw Error('EXISTING_SPICE_LIMIT');
const card={id:'research-only-granola-cinnamon50',gi:50,foodKey:'research-cinnamon',preparationKey:'weighed-ground-cinnamon-baked',food:'Weighed ground cinnamon',preparation:'2.6 g whole recipe; fully consumed in baked granola',qualityTier:'SUPPLEMENTARY',referenceScale:'GLUCOSE_100',matchKind:'ANALOG',confidence:'LOW',evidenceKind:'PUBLISHED_IMPUTATION',source:{title:'PROJECT EXTENSION, not measured cinnamon GI',url:bundle.templateSourceCard.sourceUrl,published:true,iso26642Confirmed:false,qualityEvidence:'Underlying coding method is published; this named application is conditional and unapproved. No new human cinnamon GI claimed.'},note:'Mechanical prototype only. Recipe-specific approval and teaspoon mass unresolved.'};
Object.assign(cinnamon,{giRecordId:card.id,foodKey:card.foodKey,preparationKey:card.preparationKey,giMatchEvidence:card.note});
const after=calculateGlycemicLoad(proposed,foods,[...allGi,card]);
if(before.status!=='INSUFFICIENT SOURCE DATA'||after.status!=='CALCULATED')throw Error('UNEXPECTED_MODEL_RESULT');
console.log(JSON.stringify({recipeId:bundle.recipeId,mechanicalModelOnly:true,sourceEligible:false,publicationApproved:false,recipeChangedOnDisk:false,before:{status:before.status,omitted:before.omittedAvailableCarbohydratePerServingG},after:{status:after.status,unroundedGk:after.unroundedGlycemicLoadPerServing,gk:after.glycemicLoadPerServing,omitted:after.omittedAvailableCarbohydratePerServingG,confidence:after.confidence},spiceCarbohydrate:cho,spiceImputedGk:cho*.5,allAvailableCarbohydrate:after.ingredients.reduce((s:number,i:any)=>s+i.availableCarbohydratePerServingG,0),cinnamonMassEvidenceVerified:false,allEightSourceIngredientRowsRepresented:proposed.ingredients.length===8,unknownIndividualPolyolsForcedToZero:false},null,2));
