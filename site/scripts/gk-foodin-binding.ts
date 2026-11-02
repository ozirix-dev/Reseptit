/** Exact record refinement of the unchanged, approved whole-file Foodin evidence. */
import {createHash} from 'node:crypto';
export const FOODIN_ORIGINAL_FILE_SHA256='2f8ff76b97848294c28195bb92c6d202e9754168ddb169d30ee5e8610d2c2b9b';
export const FOODIN_RECORD_ID='foodin-erythritol-200g-label-2026-10-24';
export const FOODIN_RECORD_SHA256='7e0a63b22c853205f20e449986fe6d7f050de2a6be6a190f978aba5899eb436b';
export function verifyFoodinRecord(records:unknown,originalFileSha256:unknown){
 if(originalFileSha256!==FOODIN_ORIGINAL_FILE_SHA256||!Array.isArray(records))throw Error('Unrecognized Foodin approved evidence lineage');
 const rows=records.filter(r=>r?.id===FOODIN_RECORD_ID);
 if(rows.length!==1||createHash('sha256').update(JSON.stringify(rows[0])).digest('hex')!==FOODIN_RECORD_SHA256)throw Error('Approved Foodin label record changed or ambiguous');
 return rows[0];
}
