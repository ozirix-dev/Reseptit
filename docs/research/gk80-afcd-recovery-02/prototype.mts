// Disabled, one-recipe research adapter. No production module imports this file.
// There is intentionally no flag or API which activates publication.
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {fingerprint,calculate as ingredientArithmetic,type Recipe,type Source,type CompositionSource} from '../../../site/scripts/gk80-candidate-model.ts';
import {calculateCandidate} from '../../../site/scripts/gk80-candidate-policy.ts';
import {assertFoodBindings,assertFoodApplication} from '../../../site/scripts/gk80-food-safety.ts';
import {calculate,normalizeCarbohydrate,round,type Calculation,type FoodRecord} from '../../../site/scripts/nutrition-model.ts';

export const RECIPE_ID='uunikanapasta-kesakurpitsa';
export const CASE_FINGERPRINT='ba3cb85ba2d94392baeeb4b451f9e8afea004cc92c6da11d6ca9e762bb283ff2';
export const RESEARCH_FINGERPRINT='d09c61c2d3796efe1a04add86966c20b1affd00414ac8e0834b5eb7db2b766ae';
const folder=path.dirname(fileURLToPath(import.meta.url));
export const textHash=(s:string)=>createHash('sha256').update(s.replaceAll('\r\n','\n')).digest('hex');
export const loadCase=()=>JSON.parse(readFileSync(path.join(folder,'case.json'),'utf8'));
export const loadRecipe=()=>readFileSync(path.join(folder,'pr153-source.md'),'utf8');
type Range={lower:number;upper:number};
type Macro='availableCarbohydrate'|'protein'|'fat'|'fibre';
const macros:Macro[]=['availableCarbohydrate','protein','fat','fibre'];
const clean=(n:number)=>round(n,6);
const interval=(lower:number,upper:number):Range=>({lower:clean(lower),upper:clean(upper)});
const stable=(r:Range,dp:number,value:number)=>({
 ...r,decimalPlaces:dp,requestedValue:value,
 endpointDisplays:[round(r.lower,dp),round(r.upper,dp)],
 stable:round(r.lower,dp)===value&&round(r.upper,dp)===value,
});

export function validateCase(packet:ReturnType<typeof loadCase>,recipeText:string){
 if(packet.recipeId!==RECIPE_ID||packet.pilot.recipeId!==RECIPE_ID)throw Error('RECIPE_OUTSIDE_CLOSED_CASE');
 if(fingerprint(packet)!==CASE_FINGERPRINT)throw Error('STALE_CASE_OR_UNAUTHORIZED_CHANGE');
 const {caseFingerprintSha256,...research}=packet.pilot;
 if(caseFingerprintSha256!==RESEARCH_FINGERPRINT||fingerprint(research)!==RESEARCH_FINGERPRINT)throw Error('STALE_RESEARCH');
 if(textHash(recipeText)!==packet.pilot.sourceRecipeSha256)throw Error('STALE_PREPARATION');
 if(packet.pilot.servings!==4||packet.candidate.servings!==4||packet.pilot.ingredients.length!==10)throw Error('SCOPE_CHANGED');
 for(const flag of ['publicationEligible','productionEnabled','ownerContentApproved','ownerMethodApproved','sourceBindingsApproved','activationSupported']){
  if(packet[flag]!==false)throw Error('PUBLICATION_NOT_AUTHORIZED');
 }
 if(packet.candidate.coverageProposalEligible!==false)throw Error('CANDIDATE_MUST_BE_DISABLED');
 for(const s of packet.sourceCards.giSources){const {evidenceHash,...body}=s;if(fingerprint(body)!==evidenceHash)throw Error('STALE_GI_SOURCE');}
 for(const c of packet.compositionSources){const {evidenceHash,...body}=c;if(fingerprint(body)!==evidenceHash)throw Error('STALE_COMPOSITION');}
 const pepper=packet.pilot.ingredients[8];
 if(pepper.aggregatePolyolPer100g!==null||!pepper.unknownAggregate||Object.values(pepper.individuallyReportedSpecies).some(v=>v!==null))throw Error('UNKNOWN_MUST_STAY_UNKNOWN');
 return packet;
}

export function standardNutritionInput(packet:ReturnType<typeof loadCase>):Calculation{
 return {recipeId:RECIPE_ID,sourceHash:packet.pilot.sourceRecipeSha256,calculatedAt:'2026-11-01',servings:4,
  scope:'Disabled research input; all weighed edible matter retained. Pure salt mass remains unknown.',
  reviewerStatus:'AUTOMATED ONLY',carbohydrateOutput:'AVAILABLE_EXCLUDING_FIBRE',
  ingredients:packet.pilot.ingredients.map((i:any)=>{
   const s=packet.sourceCards.compositionSources.find((x:any)=>x.sourceId===i.sourceId);
   const sourceUrl=s?.evidence.sourceUrl??s?.evidence.originalComposition?.sourceRecord?.sourceUrl??'https://fineli.fi/';
   const record:FoodRecord={id:i.sourceId,name:i.name,sourceUrl,retrievedAt:'2026-11-01',licence:'Source-specific card in case.json; Fineli CC BY4.0',state:i.state,basis:'per100g-edible',carbohydrateDefinition:'EU_AVAILABLE',polyolsSourceVerified:!i.unknownAggregate,polyolsEvidence:i.polyolEvidence,
    per100g:{carbohydrate:Number(i.macroPer100g.availableCarbohydrate),protein:Number(i.macroPer100g.protein),fat:Number(i.macroPer100g.fat),fibre:Number(i.macroPer100g.fibre),polyols:i.aggregatePolyolPer100g===null?null:Number(i.aggregatePolyolPer100g)}};
   return {item:i.name,amount:i.massG===null?null:Number(i.massG),unit:'g',record,state:i.state,matchEvidence:'Exact proposed case row; no installed source binding',edibleFraction:1,edibleEvidence:'Weighed edible input',retainedFraction:1,retentionEvidence:'All liquid, solids and fat consumed; conditional input model, not measured yield'};
  })};
}

export function precisionAudit(packet:ReturnType<typeof loadCase>){
 const p=packet.pilot,sums=Object.fromEntries(macros.map(k=>[k,0])) as Record<Macro,number>;
 let ordinary=0,known=0,pepperMaximum=0;
 for(const i of p.ingredients){
  const factor=i.certifiedZeroSalt?0:Number(i.massG)*Number(i.retention)/100/4;
  for(const k of macros)sums[k]+=Number(i.macroPer100g[k])*factor;
  const cho=Number(i.macroPer100g.availableCarbohydrate)*factor;
  if(cho>0){if(i.gi===null)throw Error('MISSING_GI');ordinary+=cho*Number(i.gi)/100;}
  known+=Number(i.knownPartialPolyolPer100g)*factor;
  if(i.unknownAggregate){
   if(i.index!==8||i.aggregatePolyolPer100g!==null)throw Error('UNREVIEWED_UNKNOWNS');
   const residual=100-macros.reduce((n,k)=>n+Number(i.macroPer100g[k]),0)-Number(i.knownPartialPolyolPer100g);
   if(residual<0)throw Error('SOURCE_ACCOUNTING_CONFLICT');pepperMaximum+=residual*factor;
  }
 }
 const policy=packet.precisionAuditPolicy;
 const audit=(multiplier:number)=>{
  let macroDelta=0,aGkDelta=0,zeroPolyolSensitivity=0;
  for(const index of policy.auditedIngredientIndices){
   const i=p.ingredients[index],factor=Number(i.massG)/100/p.servings;
   macroDelta+=Number(policy.positiveMacroQuantumPer100g)*multiplier*factor;
   aGkDelta+=Number(policy.positiveMacroQuantumPer100g)*multiplier*factor*Number(i.gi)/100;
   zeroPolyolSensitivity+=Number(policy.zeroPolyolQuantumPer100g)*multiplier*factor;
  }
  const total=sums.availableCarbohydrate+sums.fibre+known;
  const gk=interval(ordinary-aGkDelta,ordinary+aGkDelta+(pepperMaximum+zeroPolyolSensitivity)*1.5);
  const displays={
   carbsNetG:stable(interval(sums.availableCarbohydrate-macroDelta,sums.availableCarbohydrate+macroDelta),2,7.38),
   carbsTotalG:stable(interval(total-2*macroDelta,total+2*macroDelta+pepperMaximum+zeroPolyolSensitivity),1,10.4),
   proteinG:stable(interval(sums.protein-macroDelta,sums.protein+macroDelta),2,39.53),
   fatG:stable(interval(sums.fat-macroDelta,sums.fat+macroDelta),2,23.91),
   gk:stable(gk,0,3),
  };
  return {displays,gkWidth:clean(gk.upper-gk.lower),gkClassStable:gk.lower>=0&&gk.upper<=10,
   withinNamedWidthBudget:gk.upper-gk.lower<=.10,
   decomposition:{pepperPolyolWidth:clean(pepperMaximum*1.5),availableChoRoundingWidth:clean(2*aGkDelta),reportedZeroPolyolResponseSensitivity:clean(zeroPolyolSensitivity*1.5)},
   allFourMacroDisplaysStable:Object.entries(displays).filter(([k])=>k!=='gk').every(([,v])=>v.stable)};
 };
 return {fixedSource:{macroPerServing:Object.fromEntries(Object.entries(sums).map(([k,v])=>[k,clean(v)])),gk:interval(ordinary,ordinary+pepperMaximum*1.5),gkWidth:clean(pepperMaximum*1.5),totalCho:interval(sums.availableCarbohydrate+sums.fibre+known,sums.availableCarbohydrate+sums.fibre+known+pepperMaximum),unknownAggregatePolyolPoint:null,wholeGkPoint:null},
  nearestQuantum:audit(Number(policy.nearestMultiplier)),conservativeQuantum:audit(Number(policy.conservativeMultiplier)),
  uncertaintyScope:'Conditional display-quantum sensitivity for Fineli393/11134 only. Not a proved source rounding algorithm or an analytical/biological bound. Other source profiles fixed.'};
}

export function evaluatePrototype(packet=loadCase(),recipeText=loadRecipe()){
 validateCase(packet,recipeText);
 const candidate=packet.candidate as Recipe,sources=packet.sourceCards.giSources as Source[],comps=packet.compositionSources as CompositionSource[];
 // Arithmetic is inspectable while the actual production food-binding gate stays closed.
 const arithmetic=ingredientArithmetic(candidate,sources,candidate.sourceSha256,fingerprint(candidate),comps);
 let foodBindingBlocker:string|null=null;
 try{calculateCandidate(candidate,sources,candidate.sourceSha256,fingerprint(candidate),comps);}
 catch(e){foodBindingBlocker=(e as Error).message;}
 if(!foodBindingBlocker?.startsWith('UNREVIEWED_FOOD_PREPARATION:'))throw Error('EXPECTED_UNAPPROVED_BINDING_GATE');
 const bindingDiagnostics=packet.bindingProposals.map((b:any)=>{
  const ingredient=candidate.scenarios[0].ingredients.find(i=>i.index===b.ingredientIndex)!;
  const isolated={...candidate,scenarios:[{id:'isolated-binding-diagnostic',ingredients:[ingredient]}]};
  const consumedForm=assertFoodApplication(b.aliasProposal.foodKind,b.giSourceId);
  if(consumedForm!==b.aliasProposal.consumedForms[b.giSourceId])throw Error('PROPOSED_PREPARATION_MISMATCH');
  let productionGate:string|null=null;
  try{assertFoodBindings(isolated,sources);}catch(e){productionGate=(e as Error).message;}
  if(!productionGate?.startsWith('UNREVIEWED_FOOD_PREPARATION:'))throw Error('NEW_ALIAS_MUST_NOT_BE_INSTALLED');
  const source=sources.find(s=>s.id===b.giSourceId)!;
  const allowed=source.allowedCompositionIds;
  return {ingredientIndex:b.ingredientIndex,compositionId:b.aliasProposal.compositionId,giSourceId:b.giSourceId,consumedForm,productionGate,
   existingSourceAllowsNewComposition:!Array.isArray(allowed)||allowed.includes(b.aliasProposal.compositionId)};
 });
 const input=standardNutritionInput(packet),standard=calculate(input);
 const pepper=input.ingredients[8].record!;
 if(normalizeCarbohydrate(pepper).net!==null||standard.status!=='INSUFFICIENT SOURCE DATA'||standard.totalCarbohydratePerServingG!==null)throw Error('STANDARD_MODEL_MUST_REJECT_UNKNOWN_POLYOL');
 const precision=precisionAudit(packet);
 const blockers=['OWNER_METHOD_AND_CONTENT_APPROVAL_PENDING','SOURCE_BINDINGS_NOT_INSTALLED','MISSING_PEPPER_AGGREGATE_POLYOLS','PUBLICATION_DISABLED'];
 if(!precision.conservativeQuantum.allFourMacroDisplaysStable)blockers.push('NET_CHO_TWO_DECIMAL_DISPLAY_UNSTABLE');
 return {caseId:packet.caseId,recipeId:RECIPE_ID,caseFingerprint:CASE_FINGERPRINT,researchFingerprint:RESEARCH_FINGERPRINT,
  status:'HOLD',publicationEligible:false,productionEnabled:false,activationSupported:false,productionGkOverride:null,
  ownerDecision:'HOLD',blockers,foodBindingBlocker,
  standardModel:{status:standard.status,pepperNet:normalizeCarbohydrate(pepper).net,totalCarbohydratePerServingG:standard.totalCarbohydratePerServingG,saltMass:input.ingredients[9].amount},
  arithmeticDiagnostic:{numericProposal:arithmetic.numericProposal,knownAWholeGk:arithmetic.min,missing:arithmetic.scenarios[0].missing},precision,
  bindingProposals:packet.bindingProposals,bindingDiagnostics,
  basilApplicability:{namedFood:packet.pilot.ingredients[7].state,sourceId:packet.pilot.ingredients[7].sourceId,giSourceId:packet.pilot.ingredients[7].giSourceId,
   availableChoUpperPer100g:clean(Number(packet.pilot.ingredients[7].macroPer100g.availableCarbohydrate)+Number(packet.precisionAuditPolicy.positiveMacroQuantumPer100g)),
   lowChoCutoff:5,compositionQualifiesWithinSensitivity:Number(packet.pilot.ingredients[7].macroPer100g.availableCarbohydrate)+Number(packet.precisionAuditPolicy.positiveMacroQuantumPer100g)<=5,
   existingSourceAllowsNewComposition:bindingDiagnostics.find((b:any)=>b.ingredientIndex===7)!.existingSourceAllowsNewComposition,ownerApproved:false,installed:false},
 };
}

export function assertPublicationAuthorized():never{
 throw Error('PUBLICATION_DISABLED_OWNER_APPROVAL_AND_SEPARATE_IMPLEMENTATION_REQUIRED');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))console.log(JSON.stringify(evaluatePrototype(),null,2));
