import {recipeTextForApprovedSnapshot} from './approved-recipe-note-edits';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {calculateGlycemicLoad, type GlycemicIndexRecord, type GlycemicLoadResult} from './glycemic-load-model';
import type {FoodRecord} from './nutrition-model';
import type {GkOnlyVariant, LocalizedText} from '../src/features/recipes/gk-only-types';

const folder = 'docs/nutrition/gk80-four-product-a';
const receipts = {
  'current-a-cap-route': 'db3b4683aea1c46cc48dd6a613fc3e87defbaf32e9246c98f0a0e9bf94609071',
  'sausage-a-route': 'f349172ede5e5314af663b841b70969e401dd7d52dae54fee9ab77ffa1c12cc8',
};
type Copy = {names: LocalizedText[]; preparation: LocalizedText; limitation: LocalizedText};
const sha = (value: string) => createHash('sha256').update(value).digest('hex');
const close = (a: number, b: number) => Math.abs(a-b) < 1e-10;
function check(condition: unknown, message: string): asserts condition {
  if (!condition) throw Error('GK80 product A: ' + message);
}

export function buildProductAVariants(root: string): GkOnlyVariant[] {
  const text = (file: string) => readFileSync(join(root,file),'utf8').replaceAll('\r\n','\n');
  const read = (file: string) => JSON.parse(text(file));
  const nativeGi: GlycemicIndexRecord[] = read('docs/nutrition/glycemic-index-records.json').records;
  const copy: Record<string,Copy> = read(folder+'/public-copy.json');
  const variants: GkOnlyVariant[] = [];
  for (const [packet, receiptHash] of Object.entries(receipts)) {
    const dir = folder+'/'+packet+'/';
    check(sha(text(dir+'approval.json'))===receiptHash, 'approval receipt seal');
    const approval = read(dir+'approval.json');
    check(approval.sourceAndContentApproved && approval.integrationAuthorizedForOwnerInLaterBatch
      && !approval.publicationAuthorized, 'approval scope');
    const seals = approval.reviewedPacketFilesLfSha256 ?? approval.reviewedPacketSha256;
    for (const name of ['cases.json','sources.json']) {
      check(sha(text(dir+name))===seals[name], 'reviewed packet seal: '+name);
    }
    const sources = read(dir+'sources.json');
    for (const [file,seal] of Object.entries(sources.sourceFilesLfSha256)) {
      check(sha(text(file))===seal, 'native source or engine seal: '+file);
    }
    const foods: FoodRecord[] = sources.composition.filter((f:any)=>Number.isFinite(f.availablePer100g)).map((f:any)=>({
      id:f.id, name:f.name, sourceUrl:'native:'+f.id, retrievedAt:'2026-11-02', licence:'See sealed source catalog',
      state:f.name, basis:'per100g-edible', carbohydrateDefinition:'EU_AVAILABLE',
      per100g:{carbohydrate:f.availablePer100g},
    }));
    const records: GlycemicIndexRecord[] = sources.giBindings.map((g:any)=>{
      if (g.kind==='EXISTING_PUBLISHED_CODING') {
        const record = nativeGi.find(row=>row.id===g.nativeId);
        check(record?.gi===g.gi && record?.evidenceKind==='PUBLISHED_IMPUTATION'
          && record.calculationUse!=='REFERENCE_ONLY', 'native vegetable coding');
        return record;
      }
      check(g.kind==='NAMED_HUMAN_GI' && g.reference==='GLUCOSE_100_2_H', 'named GI reference');
      return {
        id:g.id, gi:g.gi, foodKey:g.id, preparationKey:g.id, food:g.food, preparation:g.note,
        qualityTier:'SUPPLEMENTARY', referenceScale:'GLUCOSE_100', matchKind:'ANALOG', confidence:'LOW', evidenceKind:'HUMAN_GI',
        source:{title:g.food,url:g.sourceUrl,table:g.pdf+' p'+g.pdfPage+' item '+g.item,
          year:2021,published:true,iso26642Confirmed:false,qualityEvidence:g.note},note:g.note,
      };
    });
    for (const c of read(dir+'cases.json').cases) {
      const {inputSha256,...input} = c;
      const accepted = approval.acceptedVersions?.find((a:any)=>a.recipeId===c.recipeId) ?? approval;
      const expectedPoint = Number(accepted.primaryCalculatedPartGk ?? accepted.pointCalculatedPart);
      const expectedOmitted = Number(accepted.positiveChoOmittedOrNominalCap ?? accepted.omittedChoOrNominalCapPerServing);
      check(c.level==='A' && c.servings===4 && inputSha256===accepted.inputSha256
        && sha(JSON.stringify(input))===inputSha256, 'exact input: '+c.recipeId);
      for (const [locale,file] of Object.entries(c.paths)) {
        check(sha(recipeTextForApprovedSnapshot(file as string,text(file as string)))===c.recipeSha256Lf[locale], 'parent recipe seal: '+file);
      }
      const usedComposition = new Set<string>();
      const usedRecords = new Set<string>();
      const results: GlycemicLoadResult[] = c.scenarios.map((scenario:any)=>{
        const omittedGroups = new Map<number|null,number>();
        const ingredients = c.candidateIngredients.map((row:any,index:number)=>{
          const id = scenario.compositionOverrides[index] ?? row.compositionId;
          const food = sources.composition.find((f:any)=>f.id===id);
          const binding = sources.giBindings.find((g:any)=>g.id===row.giId);
          check(food && (!row.giId || binding?.allowedCompositionIds.includes(id)), 'food/GI pairing');
          usedComposition.add(id);
          const label = food.kind==='LABEL_UPPER_PER100G';
          const mass = food.kind==='PHYSICAL_MASS_UPPER';
          const cap = label || mass;
          check(cap===(row.carbohydrateUse==='UPPER_BOUND') && (!cap || !binding), 'CHO cap semantics');
          const cho = row.grams * (mass ? 100 : label ? food.declaredCarbohydrate : food.availablePer100g) / 100 / c.servings;
          if (!binding && cho>0) omittedGroups.set(row.originalIndex,(omittedGroups.get(row.originalIndex)??0)+cho);
          if (cap) return {
            name:row.name, grams:row.grams, fineliRecordId:null, giRecordId:null,
            availableCarbohydrateUpperBoundPerServingG:cho, upperBoundEvidence:row.note,
            negligibleAssumption:row.note, excludedReason:'Reviewed omission cap',
          };
          const record = binding ? records.find(record=>record.id===(binding.nativeId??binding.id)) : undefined;
          if (record) usedRecords.add(record.id);
          return {name:row.name,grams:row.grams,fineliRecordId:id,giRecordId:record?.id??null,
            foodKey:record?.foodKey,preparationKey:record?.preparationKey,massEvidence:row.note,giMatchEvidence:c.preparationDecision};
        });
        const omitted = [...omittedGroups.values()].reduce((sum,cho)=>sum+cho,0);
        check(omitted<2 && [...omittedGroups.values()].every(cho=>cho<1), 'strict A omission gates');
        const result = calculateGlycemicLoad({recipeId:c.recipeId,servings:c.servings,ingredients},foods,records);
        check(result.status==='CALCULATED' && !result.blockers.length && result.unroundedGlycemicLoadPerServing!==null
          && close(result.omittedAvailableCarbohydratePerServingG,omitted), 'A engine replay');
        return result;
      });
      const primary = results[0];
      const omittedCho = Math.max(...results.map(result=>result.omittedAvailableCarbohydratePerServingG));
      check(primary.glycemicLoadPerServing===expectedPoint && close(omittedCho,expectedOmitted), 'approved point or omission changed');
      const values = results.map(result=>result.unroundedGlycemicLoadPerServing!);
      const range = results.length>1 ? {min:Math.min(...values),max:Math.max(...values)} : null;
      const approvedRange = accepted.calculatedPartSourceScenarioEnvelope;
      check(range ? approvedRange && close(range.min,approvedRange.min) && close(range.max,approvedRange.max)
        : !approvedRange, 'approved calculated-part range changed');
      const labels = copy[c.recipeId];
      check(labels?.names.length===c.candidateIngredients.length, 'public copy ingredients');
      const publicSources: GkOnlyVariant['sources'] = sources.composition.filter((f:any)=>usedComposition.has(f.id)).map((f:any)=>{
        const product = sources.products.find((p:any)=>p.id===f.observationId);
        const mass = f.kind==='PHYSICAL_MASS_UPPER';
        return {
          title:product?.name ?? f.name ?? f.id,
          url:product?.url ?? (mass ? '#gk-only-method' : f.kind==='AFCD_WITHOUT_SUGAR_ALCOHOLS'
            ? 'https://www.foodstandards.gov.au/science-data/monitoringnutrients/afcd' : 'https://fineli.fi/fineli/fi/index'),
          kind:product || mass ? 'BOUND' : 'CARBOHYDRATE',
          note:product ? f.declaredCarbohydrate+' g CHO / 100 g (nominal label cap)'
            : mass ? 'Full weighed input mass reserved as carbohydrate.' : f.availablePer100g+' g CHO / 100 g',
        };
      });
      for (const record of records.filter(r=>usedRecords.has(r.id))) {
        publicSources.push({title:record.source.title,url:record.source.url,
          kind:record.evidenceKind==='HUMAN_GI'?'HUMAN_GI':'PUBLISHED_CODING',
          note:record.note??record.source.qualityEvidence});
      }
      variants.push({
        recipeId:c.recipeId, versionId:'gk-product-a-'+inputSha256.slice(0,12), inputSha256,
        level:'A', servings:c.servings, point:expectedPoint, scenarioRange:range,
        rangeKind:range?'NAMED_COMPARATOR_SCENARIOS':null, ...(range ? {rangeDisplay:'OUTWARD_INTEGER' as const} : {}),
        omittedCho, confidence:'LOW', macroScope:'NO_MACRO_PACKAGE_FOR_THIS_VERSION',
        quantityContract:'GK_ONLY_NATIVE_UNITS_V1',
        ingredients:c.candidateIngredients.map((row:any,index:number)=>{
          const name=labels.names[index];
          if (c.recipeId==='kana-tagine-sitruunalla' && index===14) {
            return {name,grams:null,quantity:{amount:300,unit:'ml'}};
          }
          if (c.recipeId==='hernekeitto-savupotkalla' && index===2) {
            return {name,grams:null,quantity:{amount:2000,unit:'ml'}};
          }
          return {name,grams:row.grams||null};
        }),
        preparation:labels.preparation, limitation:labels.limitation, standalonePreparation:true,
        codingKinds:[], sensitivity:null, sources:publicSources,
      });
    }
  }
  check(variants.length===4 && new Set(variants.map(v=>v.recipeId)).size===4, 'exact four recipes');
  return variants;
}
