// Isolated review only. Copies the unchanged food-safety module into explicit
// scratch space with a proposed catalog; never edits an installed catalog.
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';

const flag=(n:string)=>{const k=process.argv.indexOf(n);return k<0?undefined:process.argv[k+1];};
const root=path.resolve(flag('--repo')??process.cwd());
const data=path.resolve(flag('--data-dir')??path.dirname(fileURLToPath(import.meta.url)));
const outputArg=flag('--output-dir');if(!outputArg)throw Error('EXPLICIT_SCRATCH_OUTPUT_REQUIRED');
const output=path.resolve(outputArg),relative=path.relative(root,output);
if(relative===''||(!relative.startsWith('..'+path.sep)&&!path.isAbsolute(relative)))throw Error('OUTPUT_MUST_BE_OUTSIDE_REPOSITORY');
assert.equal(execFileSync('git',['-C',root,'remote','get-url','origin'],{encoding:'utf8'}).trim(),'https://github.com/ozirix-dev/Reseptit.git');
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const sha=(s:string|Buffer)=>createHash('sha256').update(s).digest('hex');
const moduleAt=async(p:string)=>import(pathToFileURL(path.join(root,p)).href);
const {calculate,fingerprint}=await moduleAt('site/scripts/gk80-candidate-model.ts');
const {calculateCandidate}=await moduleAt('site/scripts/gk80-candidate-policy.ts');
const {normalizeCarbohydrate}=await moduleAt('site/scripts/nutrition-model.ts');
const {assertFoodBindings:installedBindings}=await moduleAt('site/scripts/gk80-food-safety.ts');
mkdirSync(output,{recursive:true});
const catalog=read(path.join(root,'site/scripts/gk80-food-catalog.json'));
const binding=read(path.join(data,'nakki-binding-proposal.json'));
assert.equal(sha(readFileSync(path.join(root,'site/scripts/gk80-food-catalog.json'),'utf8').replaceAll('\r\n','\n')),binding.catalogSha256);
assert.equal(binding.addAliases.length,7);
const overlay=structuredClone(catalog);overlay.aliases.push(...binding.addAliases);
const newComp=read(path.join(data,'marjoram-source-proposal.json')).records[0];
const {evidenceHash,...payload}=newComp;assert.equal(fingerprint(payload),evidenceHash);
const byId=new Map<string,any>();
for(const n of [6,7])for(const h of read(path.join(root,`docs/nutrition/gk80-release-${n}/held-review.json`)).recipes)byId.set(h.recipeId,h.lockedResearchBundle);
const scope=['jauheliha-kaalikeitto-vhh','vhh-kaalilaatikko','ropa-vieja','siskonmakkarakeitto-juurekset','nakkikeitto-kukkakaalilla'];
const modelSourceId='marjoram50-polyoli02-source-substitution';let sourceVariant:any;
const prepared=new Map<string,any>();
for(const id of scope){
 const b=structuredClone(byId.get(id));assert.ok(b,id);
 const original=calculate(b.recipe,b.sources,b.recipe.sourceSha256,b.golden.inputHash,b.comps);
 assert.ok(Math.abs(original.min-b.golden.scenarios[0].wholeGk)<1e-12);
 const p=path.join(root,b.recipe.sourcePath);assert.equal(sha(readFileSync(p,'utf8').replaceAll('\r\n','\n')),b.recipe.sourceSha256);
 if(id==='jauheliha-kaalikeitto-vhh'||id==='vhh-kaalilaatikko'){
  const i=b.recipe.scenarios[0].ingredients.find((i:any)=>i.composition?.sourceId==='U170928-r5');assert.ok(i);
  const oldSource=b.sources.find((s:any)=>s.id===i.impact.sourceId);assert.equal(oldSource.gi,50);
  sourceVariant={...oldSource,id:modelSourceId,allowedCompositionIds:[newComp.id],recipeScope:['jauheliha-kaalikeitto-vhh','vhh-kaalilaatikko'],applicationNote:'Existing named GI50 assumption rebound only to the reviewed dried-marjoram composition; source substitution awaits owner review.'};
  delete sourceVariant.evidenceHash;sourceVariant.evidenceHash=fingerprint(sourceVariant);
  b.sources.push(sourceVariant);b.comps.push(newComp);
  i.composition={sourceId:newComp.id,evidenceHash:newComp.evidenceHash};i.per100g=newComp.per100g;
  i.state='dried marjoram, ground and fully consumed';
  i.compositionBasisNote='MATVARETABELLEN_MI0181_SOURCE_DECLARED_SUGAR_PLUS_STARCH';
  i.impact={...i.impact,sourceId:modelSourceId,evidenceHash:sourceVariant.evidenceHash};
  i.applicability+=' Source-specific composition substitution only; polyols remain unknown and publication is withheld.';
  b.recipe.proposedVersionHash=fingerprint({title:b.recipe.proposedTitle,servings:b.recipe.servings,scenarios:b.recipe.scenarios,preparation:b.recipe.proposedPreparation});
 }
 prepared.set(id,b);
}
const sourceText=readFileSync(path.join(root,'site/scripts/gk80-food-safety.ts'),'utf8');
const nakkiOnly=path.join(output,'nakki-only');mkdirSync(nakkiOnly,{recursive:true});
writeFileSync(path.join(nakkiOnly,'gk80-food-safety.mts'),sourceText);
writeFileSync(path.join(nakkiOnly,'gk80-food-catalog.json'),JSON.stringify(overlay));
const {assertFoodBindings:nakkiOnlyBindings}=await import(pathToFileURL(path.join(nakkiOnly,'gk80-food-safety.mts')).href);
nakkiOnlyBindings(prepared.get('nakkikeitto-kukkakaalilla').recipe,prepared.get('nakkikeitto-kukkakaalilla').sources);
overlay.sourceRules[modelSourceId]={foodKinds:['GROUND_SPICE'],consumedForm:'AS_DEFINED'};
overlay.foodTypes['NO06.186']='GROUND_SPICE';
overlay.aliases.push({compositionId:newComp.id,foodId:'NO06.186',foodKind:'GROUND_SPICE',inputForm:'dried marjoram, ground and fully consumed',allowedSources:[modelSourceId],consumedForms:{[modelSourceId]:'AS_DEFINED'}});
writeFileSync(path.join(output,'gk80-food-safety.mts'),sourceText);
writeFileSync(path.join(output,'gk80-food-catalog.json'),JSON.stringify(overlay));
const {assertFoodBindings}=await import(pathToFileURL(path.join(output,'gk80-food-safety.mts')).href);
const results=[];
for(const id of scope){
 const b=prepared.get(id),old=byId.get(id);
 const isMarjoram=['jauheliha-kaalikeitto-vhh','vhh-kaalilaatikko'].includes(id);
 let installedError:string|null=null;
 try{calculateCandidate(old.recipe,old.sources,old.recipe.sourceSha256,old.golden.inputHash,old.comps);}catch(e){installedError=String(e);}
 assertFoodBindings(b.recipe,b.sources);
 const value=calculate(b.recipe,b.sources,b.recipe.sourceSha256,fingerprint(b.recipe),b.comps);
 const normalization=isMarjoram?normalizeCarbohydrate({...newComp.sourceRecord,carbohydrateDefinition:'EU_AVAILABLE',per100g:{carbohydrate:newComp.per100g.availableCarbohydrate,fibre:newComp.per100g.fibre,polyols:null}}):null;
 if(normalization){assert.equal(normalization.available,20.3);assert.equal(normalization.net,null);}
 results.push({recipeId:id,sourceRecipeHashMatchesMain:true,installedPolicyError:installedError,
  originalResearchGk:old.golden.scenarios[0].wholeGk,proposedResearchGk:value.min,
  researchMacros:value.scenarios[0].macros,inputHash:fingerprint(b.recipe),
  stagedFoodBindings:'PASS',sourceDecision:isMarjoram?'PROPOSE_NO_06_186_AVAILABLE_ONLY':'RETAIN_USDA_PROXY_NO_BAY_SUBSTITUTION',
  normalization,strictTotalCarbohydratePerServing:null,polyolsPer100g:null,
  status:'HOLD_PUBLICATION_POLYOL_SOURCE_INCOMPLETE',publicationEligible:false});
}
// Negative controls call the exact production validator against the proposal.
let negativeControls=0;
const nakki=prepared.get('nakkikeitto-kukkakaalilla');
const testReject=(edit:(r:any)=>void,pattern:RegExp)=>{const r=structuredClone(nakki.recipe);edit(r);assert.throws(()=>assertFoodBindings(r,nakki.sources),pattern);negativeControls++;};
testReject(r=>{r.scenarios[0].ingredients[0].state='raw frankfurter';},/UNREVIEWED_FOOD_PREPARATION/);
testReject(r=>{r.scenarios[0].ingredients[0].impact.sourceId='dairy-imputation30';},/UNREVIEWED_FOOD_PREPARATION/);
testReject(r=>{r.scenarios[0].ingredients[6].massG=100;},/PORTION_CHO_LIMIT/);
testReject(r=>{r.scenarios[0].ingredients[6].composition.sourceId='unknown-large-polyol-product';},/UNREVIEWED_FOOD_PREPARATION/);
// Missing/zero retain separate meanings at the unchanged normalizer boundary.
const record={id:'synthetic',name:'synthetic',state:'as sold',basis:'per100g-edible',carbohydrateDefinition:'EU_TOTAL_INCLUDING_POLYOLS',polyolsSourceVerified:true,polyolsEvidence:'synthetic exact test',per100g:{carbohydrate:100,fibre:0,polyols:100}};
assert.equal(normalizeCarbohydrate(record).net,0);
assert.equal(normalizeCarbohydrate({...record,per100g:{...record.per100g,polyols:null}}).net,null);
const report={schemaVersion:1,baseMain:binding.baseMain,status:'PASS',scope,results,
 nakkiBindingReview:{existingAliases:2,proposedAliases:7,allNineIngredientBindingsPassInScratch:true,installedCatalogUnchanged:true,newFoodTypes:0,newSourceRules:0},
 marjoramProposal:{sourceRecord:newComp,giSourceVariant:sourceVariant,catalogAlias:overlay.aliases.at(-1),catalogSourceRule:overlay.sourceRules[modelSourceId],ownerApprovalPending:true},
 controls:{negativeFoodBindingControls:negativeControls,unknownVsKnownPolyolControls:2},
 copiedProductionValidatorSha256:sha(sourceText),newPublishableRecipes:0,publicationEligible:false};
writeFileSync(path.join(output,'review-results.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({status:'PASS',recipes:results.length,nakkiAliases:7,negativeControls,newPublishableRecipes:0}));
