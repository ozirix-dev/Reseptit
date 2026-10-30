import test from 'node:test';
import assert from 'node:assert/strict';
import {assertFoodApplication,foodKindForId} from '../scripts/gk80-food-safety';
test('explicit food identity rejects seven word collisions and preparation transfers',()=>{
 const pairs=[['A007535','BUTTERNUT','F500'],['A002991','COCONUT_MILK','F689'],['F34667','PEANUT_BUTTER','F500'],['A006077','ALMOND_FLOUR','F31842'],['A008004','FISH_SAUCE','F34255'],['F182','RICE_FLOUR','A007682'],['F162','POTATO_STARCH','F205']];
 for(const [id,kind,wrong] of pairs){assert.equal(foodKindForId(id),kind);assert.notEqual(foodKindForId(id),foodKindForId(wrong));}
 const cases=[['BUTTERNUT','dairy-imputation30'],['COCONUT_MILK','dairy-imputation30'],['PEANUT_BUTTER','dairy-imputation30'],['ALMOND_FLOUR','sourdough54'],['FISH_SAUCE','dairy-imputation30'],['RICE_FLOUR','rice-jasmine68'],['POTATO_STARCH','potato-boiled66-r5']];
 for(const [kind,gi] of cases)assert.throws(()=>assertFoodApplication(kind,gi),/FOOD_FAMILY_OR_PREPARATION/,kind);
 assert.equal(assertFoodApplication('BUTTERNUT','pumpkin51'),'BOILED_PIECES');
 assert.equal(assertFoodApplication('RICE','rice-congee80'),'HOT_PORRIDGE_40_MIN');
 assert.throws(()=>assertFoodApplication('RICE','rice-noodle61'),/FOOD_FAMILY_OR_PREPARATION/);
});
