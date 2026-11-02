// Isolated proposal. Never imported by the production calculation/publication pipeline.
import {createHash} from 'node:crypto';
import type {FoodRecord} from '../../../site/scripts/nutrition-model';
const digest=(value: unknown)=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
export const AFCD_AVAILABLE_FIELD='available_carbohydrate_without_sugar_alcohols_g_per_100g';
export function afcdGkOnlyObservation(reference: any, local: FoodRecord, selectedNativeId: string, exactStateEvidence: string) {
  if(!reference?.source?.name?.includes('Release 3') || reference.source.release_date!=='2025-12')throw Error('Unverified AFCD release');
  if(!exactStateEvidence.trim())throw Error('Exact food/state correspondence must be reviewed separately');
  const idFromLocal=local.id.match(/F\d{6}/i)?.[0].toUpperCase();
  if(idFromLocal!==selectedNativeId || !/^F\d{6}$/.test(selectedNativeId))throw Error('Native source identity mismatch');
  const matches=reference.foods.filter((f:any)=>f.source_id===selectedNativeId);
  if(matches.length!==1)throw Error('Native source observation missing or ambiguous');
  const native=matches[0],available=native[AFCD_AVAILABLE_FIELD];
  if(typeof available!=='number'||!Number.isFinite(available)||available<0)throw Error('Available carbohydrate is unknown, not zero');
  if(local.basis==='unresolved')throw Error('Food weight basis unresolved');
  // Do not implement or copy #182 in this handoff, including a same-ID macro/GK alias.
  if(local.carbohydrateDefinition!=='EU_AVAILABLE'||local.per100g.carbohydrate!==available)throw Error('Local field needs separate correction; PR182 remains conditional');
  const sourceRecordSha256=digest(native),localRecordSha256=digest(local);
  const record: FoodRecord={id:`gk-only-afcd-R3-${selectedNativeId}-${sourceRecordSha256.slice(0,12)}`,name:native.name,sourceUrl:reference.source.source_url,retrievedAt:local.retrievedAt,licence:reference.source.licence,state:local.state,basis:local.basis,carbohydrateDefinition:'EU_AVAILABLE',polyolsSourceVerified:false,per100g:{carbohydrate:available,polyols:null}};
  return {record,release:'3',nativeId:selectedNativeId,sourceField:AFCD_AVAILABLE_FIELD,sourceRecordSha256,localRecordSha256,exactStateEvidence,polyolsTotalState:'UNKNOWN',macroAuthorization:false,giAuthorization:false,publicationAuthorization:false};
}
