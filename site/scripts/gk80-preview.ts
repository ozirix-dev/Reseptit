import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { calculate, display, type Recipe, type Source } from './gk80-model';
const folder = new URL('../../docs/nutrition/gk80/pilot-1/',import.meta.url);
const read = (f:string) => JSON.parse(readFileSync(new URL(f,folder),'utf8'));
const sources:Source[] = read('sources.json').records;
const recipes:Recipe[] = read('recipes.json').recipes;
const expected: {recipeId:string;inputHash:string}[] = read('golden.json').recipes;
const outputs = recipes.map(r => {
  const recipePath=(r as Recipe & {sourcePath:string}).sourcePath;
  const currentHash=createHash('sha256').update(readFileSync(new URL('../../'+recipePath,import.meta.url),'utf8').replaceAll('\r\n','\n')).digest('hex');
  const result=calculate(r,sources,currentHash,expected.find(e=>e.recipeId===r.recipeId)!.inputHash);
  return {...result,display:Object.fromEntries((['fi','en','sv','th'] as const).map(l=>[l,display(result,l)]))};
});
console.log(JSON.stringify({publication:'ISOLATED_DRAFT_PREVIEW',outputs},null,2));
