import test from 'node:test';import assert from 'node:assert/strict';
import {formatGlycemicLoadNumber} from '../src/features/recipes/gk80-format';
import {roundedCandidatePoint} from '../scripts/gk80-candidate-policy';
test('positive modeled GK never renders as zero; true zero and historical precision remain distinct',()=>{
 for(const locale of ['fi-FI','en-GB','sv-SE','th-TH']){assert.equal(formatGlycemicLoadNumber(.2,locale,true),'<1');assert.equal(formatGlycemicLoadNumber(.99,locale,true),'<1');assert.equal(formatGlycemicLoadNumber(0,locale,true),'0');}
 assert.equal(formatGlycemicLoadNumber(.2,'fi-FI',false),'0,2');assert.equal(formatGlycemicLoadNumber(22.3745,'fi-FI',true),'22');assert.equal(formatGlycemicLoadNumber(26.4445,'fi-FI',true),'26');
 assert.equal(roundedCandidatePoint(0),0);assert.equal(roundedCandidatePoint(.8661),.87);
 for(const tiny of [.004,.0001]){assert.ok(roundedCandidatePoint(tiny)>0);assert.equal(formatGlycemicLoadNumber(roundedCandidatePoint(tiny),'fi-FI',true),'<1');}
});
