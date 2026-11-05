import {reviewedSourceHashMatches} from './afcd-column-correction';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {calculateGlycemicLoad, type GlycemicIndexRecord, type GlycemicLoadIngredientInput} from './glycemic-load-model';
import type {FoodRecord} from './nutrition-model';
import type {GkOnlyVariant, LocalizedText} from '../src/features/recipes/gk-only-types';

const folder = 'docs/nutrition/gk80-three-curries';
const receiptHash = 'b63486190b069da8ab091bbb378fa2a4174a4a67705807bfed6876a2d5f2a537';
type Ingredient = {name:string; grams:number|null; millilitres?:number; sourceId:string; giId:string|null};
type Copy = {names:LocalizedText[]; preparation:LocalizedText; limitation:LocalizedText};
const sha = (value:string) => createHash('sha256').update(value).digest('hex');
function check(condition:unknown, message:string): asserts condition {
  if (!condition) throw Error('GK80 three curries: '+message);
}

export function buildThreeCurryVariants(root:string): GkOnlyVariant[] {
  const text = (file:string) => readFileSync(join(root,file),'utf8').replaceAll('\r\n','\n');
  const read = (file:string) => JSON.parse(text(file));
  const nativeGi: GlycemicIndexRecord[] = read('docs/nutrition/glycemic-index-records.json').records;
  const copy: Record<string,Copy> = read(folder+'/public-copy.json');
  check(sha(text(folder+'/approval.json'))===receiptHash,'approval receipt');
  const receipt = read(folder+'/approval.json');
  return ['green','red','yellow'].map(packet=>{
    const approval = receipt.packets[packet];
    const dir = folder+'/'+packet+'/';
    for (const name of ['cases.json','sources.json']) {
      check(sha(text(dir+name))===approval.files[name],'reviewed '+name);
    }
    const sources = read(dir+'sources.json');
    for (const [file,hash] of Object.entries(sources.sourceFilesLfSha256)) {
      check(reviewedSourceHashMatches(file,text(file),hash as string),'native source or engine changed: '+file);
    }
    const {cases} = read(dir+'cases.json');
    check(cases.length===1,'single exact case');
    const c = cases[0];
    const {inputSha256,...input} = c;
    check(c.recipeId===approval.recipeId && inputSha256===approval.inputSha256
      && sha(JSON.stringify(input))===inputSha256,'input seal');
    for (const [locale,file] of Object.entries(c.paths)) {
      check(sha(text(file as string))===c.recipeSha256Lf[locale],'recipe seal: '+file);
    }
    const gi = nativeGi.find(row=>row.id===sources.giBinding.nativeId);
    check(gi && gi.gi===sources.giBinding.value && gi.calculationUse!=='REFERENCE_ONLY','GI record');
    const foods: FoodRecord[] = [];
    const publicSources: GkOnlyVariant['sources'] = [];
    const ingredients = c.ingredients.map((i:Ingredient):GlycemicLoadIngredientInput=>{
      const comp = sources.composition.find((row:any)=>row.id===i.sourceId);
      if (comp) {
        check(!i.giId || (i.giId===gi.id && sources.giBinding.allowedCompositionIds.includes(i.sourceId)),'GI source pairing');
        const url = comp.kind==='FINELI_NATIVE_POINT' ? 'https://fineli.fi/fineli/fi/index'
          : comp.kind==='AFCD_NATIVE_POINT' ? 'https://www.foodstandards.gov.au/science-data/monitoringnutrients/afcd'
            : 'https://foodin.fi/tuote/erytritoli-luomu-200g-2/';
        foods.push({id:i.sourceId,name:i.name,sourceUrl:url,retrievedAt:'2026-11-02',licence:'Sealed source catalog',
          state:i.name,basis:'per100g-edible',carbohydrateDefinition:'EU_AVAILABLE',per100g:{carbohydrate:comp.availablePer100g}});
        publicSources.push({title:i.name,url,kind:'CARBOHYDRATE',note:comp.availablePer100g+' g CHO / 100 g'});
        return {name:i.name,grams:i.grams,fineliRecordId:i.sourceId,giRecordId:i.giId,
          foodKey:i.giId?gi.foodKey:undefined,preparationKey:i.giId?gi.preparationKey:undefined,
          massEvidence:'Reviewed weighed amount',giMatchEvidence:c.preparationDecision};
      }
      const label = sources.externalObservations.find((row:any)=>row.id===i.sourceId);
      check(label && !i.giId,'nominal cap source');
      const volume = label.basis==='per100ml';
      const amount = volume ? i.millilitres : i.grams;
      const value = label.totalCarbohydrate??label.declaredCarbohydrate;
      check((volume || label.basis.startsWith('per100g')) && amount!==null && amount!==undefined
        && Number.isFinite(value),'native quantity and cap basis');
      const note = i.sourceId.endsWith('_WHOLE_MASS') ? 'Full weighed input mass reserved as carbohydrate.' : value+' g CHO / 100 '+(volume?'ml':'g')+' (nominal cap)';
      publicSources.push({title:i.name,url:label.url??'#gk-only-method',kind:'BOUND',note});
      return {name:i.name,grams:i.grams,fineliRecordId:null,giRecordId:null,
        availableCarbohydrateUpperBoundPerServingG:amount*value/100/c.servings,upperBoundEvidence:note,
        negligibleAssumption:note,excludedReason:'Reviewed nominal omission cap'};
    });
    const result = calculateGlycemicLoad({recipeId:c.recipeId,servings:c.servings,ingredients},foods,[gi]);
    check(result.status==='CALCULATED' && !result.blockers.length
      && result.glycemicLoadPerServing===approval.calculatedGkPart
      && Math.abs(result.omittedAvailableCarbohydratePerServingG-approval.omittedCho)<1e-10,
    'approved calculation changed');
    publicSources.push({title:gi.source.title,url:gi.source.url,
      kind:gi.evidenceKind==='HUMAN_GI'?'HUMAN_GI':'PUBLISHED_CODING',note:gi.note??gi.source.qualityEvidence});
    const labels = copy[c.recipeId];
    const displayIngredients: GkOnlyVariant['ingredients'] = c.ingredients.map((i:Ingredient,index:number)=>{
      const name=labels.names[index];
      check(name,'public ingredient name');
      return i.millilitres===undefined ? {name,grams:i.grams}
        : {name,grams:null,quantity:{amount:i.millilitres,unit:'ml'}};
    });
    return {
      recipeId:c.recipeId,versionId:'gk-curry-a-'+inputSha256.slice(0,12),inputSha256,level:'A',
      servings:c.servings,point:result.glycemicLoadPerServing,scenarioRange:null,rangeKind:null,
      omittedCho:result.omittedAvailableCarbohydratePerServingG,confidence:'LOW',
      macroScope:'NO_MACRO_PACKAGE_FOR_THIS_VERSION',quantityContract:'GK_ONLY_NATIVE_UNITS_V1',
      ingredients:displayIngredients,preparation:labels.preparation,limitation:labels.limitation,
      standalonePreparation:true,codingKinds:[],sensitivity:null,sources:publicSources,
    };
  });
}
