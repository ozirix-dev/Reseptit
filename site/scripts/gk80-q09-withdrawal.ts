import {readFile} from 'node:fs/promises';import path from 'node:path';import {createHash} from 'node:crypto';
import type {GlycemicLoadResult} from './glycemic-load-model';
export async function withdrawQ09Tea<T extends GlycemicLoadResult>(root:string,results:T[]):Promise<T[]>{
 const file='reseptit/aamupalat/kiinalainen-teehaudutetut-munat.md';const current=createHash('sha256').update((await readFile(path.join(root,file),'utf8')).replaceAll('\r\n','\n')).digest('hex');if(current!=='bae898d991ed769ae2853f2860e1ebcd3629e292e0d5ca2901244c0377d640e1')throw Error('Q09_WITHDRAWAL_SOURCE_STALE');
 const index=results.findIndex(r=>r.recipeId==='kiinalainen-teehaudutetut-munat');if(index<0)throw Error('Q09_WITHDRAWAL_SCOPE');
 const out=[...results];out[index]={...out[index],status:'INSUFFICIENT SOURCE DATA',unroundedGlycemicLoadPerServing:null,glycemicLoadPerServing:null,glycemicLoadRangePerServing:null,confidence:null,interpretation:'Q09: consumed marinade, star-anise quantity/extraction and shell/peeling preparation are unresolved; known positive CHO must not appear as GK0.',blockers:[...out[index].blockers,'Q09 source data incomplete: consumed marinade and star anise; do not display zero.']};return out;
}
