import test from 'node:test';
import assert from 'node:assert/strict';
import {classifyGk80Source as classify} from '../scripts/gk80-source-classification';
test('human evidence remains human when applied as an analogue',()=>{
 assert.deepEqual(classify('HUMAN_GI','DIRECT'),{evidenceKind:'HUMAN_GI',applicationKind:'DIRECT',matchKind:'EXACT'});
 assert.deepEqual(classify('HUMAN_GI','APPLIED'),{evidenceKind:'HUMAN_GI',applicationKind:'FOOD_ANALOGUE',matchKind:'ANALOG'});
});
test('published assignments cannot be relabeled as measured human GI',()=>{
 assert.deepEqual(classify('PUBLISHED_IMPUTATION','APPLIED'),{evidenceKind:'PUBLISHED_IMPUTATION',applicationKind:'PUBLISHED_IMPUTATION',matchKind:'CALCULATION_POLICY'});
 assert.throws(()=>classify('PUBLISHED_IMPUTATION','DIRECT'),/IMPUTATION_NOT_MEASURED/);
 assert.throws(()=>classify('MODELLED_SCENARIO','APPLIED'),/UNKNOWN_EVIDENCE_KIND/);
});
