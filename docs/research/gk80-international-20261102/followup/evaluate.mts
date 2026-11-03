import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const root=path.resolve(process.argv[2]??path.join(import.meta.dirname,'../../../..'));
const dir=process.argv[3]??import.meta.dirname;
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const sha=(b:any)=>createHash('sha256').update(b).digest('hex');
const manifest=read(path.join(dir,'source-manifest.json'));
for(const [rel,hash] of Object.entries(manifest.sourceHashes)){
 if(sha(readFileSync(path.join(root,rel)))!==hash)throw Error('BASELINE_CHANGED '+rel);
}
const {calculateGlycemicLoad}=await import(pathToFileURL(path.join(root,'site/scripts/glycemic-load-model.ts')).href);
const gi=read(path.join(root,'docs/nutrition/glycemic-index-records.json')).records;
const results=[];
for(const filename of ['granola-source-resolved.json','pellava-conditional-version.json']){
 const bundle=read(path.join(dir,filename));
 const text=readFileSync(path.join(root,bundle.sourcePath),'utf8').replace(/\r\n/g,'\n');
 if(sha(text)!==bundle.sourceLfSha256)throw Error('RECIPE_CHANGED '+bundle.recipeId);
 if(bundle.rows.length!==bundle.originalIngredientCount||bundle.rows.length!==8)throw Error('SOURCE_ROW_COUNT');
 const foods=bundle.rows.filter((r:any)=>r.food).map((r:any)=>r.food);
 for(const f of foods){
  if(f.id.startsWith('research-afcd-')&&(f.per100g.polyols!==null||f.polyolsSourceVerified!==false))throw Error('POLYOLS_MUST_STAY_UNKNOWN');
 }
 const beforeInput={recipeId:bundle.recipeId,servings:bundle.servings,ingredients:structuredClone(bundle.rows.map((r:any)=>r.input))};
 const before=calculateGlycemicLoad(beforeInput,foods,gi);
 const input=structuredClone(beforeInput);
 const cinnamon=input.ingredients[4].name==='kanelia'?input.ingredients[4]:input.ingredients[5];
 if(cinnamon.name!=='kanelia'||cinnamon.grams!==2.55)throw Error('CINNAMON_IDENTITY');
 const food=foods.find((f:any)=>f.id===cinnamon.fineliRecordId);
 const spiceCho=food.per100g.carbohydrate*cinnamon.grams/100/input.servings;
 if(spiceCho>bundle.templateSourceCard.maxCarbohydratePerServing||spiceCho>bundle.templateSourceCard.maxCumulativeCarbohydratePerServing)throw Error('SPICE_LIMIT');
 const card={id:'research-only-cinnamon50-'+bundle.recipeId,gi:50,foodKey:'research-cinnamon',preparationKey:'ground-cinnamon-fully-retained',food:'Ground cinnamon, whole consumed quantity',preparation:'Sourced generic teaspoon-density proxy2.55g/recipe; not weighed batch',qualityTier:'SUPPLEMENTARY',referenceScale:'GLUCOSE_100',matchKind:'ANALOG',confidence:'LOW',evidenceKind:'PUBLISHED_IMPUTATION',source:{title:'Project small-spice extension: not a human cinnamon GI',url:bundle.templateSourceCard.sourceUrl,published:true,iso26642Confirmed:false,qualityEvidence:'Published coding method plus prior project extension; new named recipe application remains unapproved.'},note:'Research only; no source, content or publication approval inferred from mechanical CALCULATED.'};
 Object.assign(cinnamon,{giRecordId:card.id,foodKey:card.foodKey,preparationKey:card.preparationKey,giMatchEvidence:card.note});
 const after=calculateGlycemicLoad(input,foods,[...gi,card]);
 if(before.status!=='INSUFFICIENT SOURCE DATA'||after.status!=='CALCULATED')throw Error('UNEXPECTED_STATUS '+JSON.stringify(after));
 if(Math.abs(after.unroundedGlycemicLoadPerServing-Number(bundle.expected.unroundedGk))>1e-12)throw Error('DECIMAL_EXPECTATION_MISMATCH');
 const expectedOmission=Number(bundle.expected.omittedChoG??bundle.expected.omittedChoUpperG);
 if(Math.abs(after.omittedAvailableCarbohydratePerServingG-expectedOmission)>1e-12)throw Error('OMISSION_EXPECTATION_MISMATCH');
 results.push({recipeId:bundle.recipeId,sourceLfSha256:bundle.sourceLfSha256,researchStatus:bundle.researchStatus,allEightRowsRepresented:true,correctedCompositionBeforeSpice:{status:before.status,omittedCho:before.omittedAvailableCarbohydratePerServingG},after,spiceChoG:spiceCho,policyLimitsUnchanged:{eachOmissionStrictlyBelow1g:true,cumulativeOmissionStrictlyBelow2g:true,spiceAtMost0_5g:true,cumulativeSpiceAtMost1g:true},publicationApproved:false,newPublishedValue:false,sourceApplicationApproved:false,allRecipeAndRegistryFilesReadOnly:true,recipeInput:input});
}
console.log(JSON.stringify({mechanicalModelOnly:true,warning:'CALCULATED is a numeric check, not source or publication approval. Pellava label upper is additionally conditional.',results},null,2));
