/** F25 source-to-draft structural verification. Explicitly NOT a semantic release approval. */
import path from "node:path";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const fields = ["carbs_net_per_serving_g","carbs_total_per_serving_g","protein_per_serving_g","fat_per_serving_g"];
const locales = ["en","sv","th"];
const unitAlias = {
  en: { pcs:"kpl", tbsp:"rkl", tsp:"tl" },
  sv: { st:"kpl", msk:"rkl", tsk:"tl" },
  th: { "ฟอง":"kpl", "ลูก":"kpl", "หัว":"kpl", "ชิ้น":"kpl", "ช้อนโต๊ะ":"rkl", "ช้อนชา":"tl" }
};
function parseRecipe(filepath) {
 const raw = readFileSync(filepath,"utf8");
 const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw);
 if (!match) throw Error("Missing YAML frontmatter: "+filepath);
 const data = parse(match[1]);
 const heading = /^## (?:Valmistus|Instructions|Tillagning|วิธีทำ)\s*$/m.exec(raw);
 if(!heading) throw Error("Missing instruction heading: "+filepath);
 const after = raw.slice(heading.index+heading[0].length);
 const end = after.search(/^## /m);
 const content = after.slice(0,end<0?undefined:end);
 return {data,steps:(content.match(/^\s*\d+[.)] \S.*$/gm)||[]).length};
}
export function normalizeUnit(locale,unit) { return unitAlias[locale]?.[unit] ?? unit; }
export function checkF25(root=repo) {
 const ledger = JSON.parse(readFileSync(path.join(root,"meta/kaannokset/f25-source-worklist.json"),"utf8"));
 const errors=[];let count=0,sourceCount=0,ingredients=0,steps=0,macros=0;
 for(const record of ledger.recipeSources) {
  const source = parseRecipe(path.join(root,record.source_path));
  const dir = record.source_path.split("/")[1];
  const paths = locales.map(l=>path.join(root,"kaannokset",l,dir,record.recipe_id+".md"));
  const present = paths.filter(p=>existsSync(p)).length;
  if(present===0)continue;
  if(present!==3){ errors.push(record.recipe_id+": incomplete triple "+present+"/3");continue; }
  sourceCount++;
  for(let i=0;i<3;i++) {
   const locale=locales[i],filepath=paths[i],draft=parseRecipe(filepath),a=source.data,b=draft.data;
   count++;ingredients+=b.ingredients?.length??0;steps+=draft.steps;
   if(b.status!=="draft"||b.recipe_id!==record.recipe_id||b.language!==locale||b.source_language!=="fi"||b.source_recipe!==record.source_path||b.translation_of!==record.recipe_id)errors.push(record.recipe_id+"/"+locale+": draft provenance/status mismatch");
   if(b.category!==a.category||b.servings!==a.servings||b.time_total_min!==a.time_total_min)errors.push(record.recipe_id+"/"+locale+": category/servings/time mismatch");
   if(JSON.stringify(b.image?.src)!==JSON.stringify(a.image?.src)||b.image?.width!==a.image?.width||b.image?.height!==a.image?.height)errors.push(record.recipe_id+"/"+locale+": image mismatch");
   if(!Array.isArray(b.ingredients)||b.ingredients.length!==a.ingredients.length){errors.push(record.recipe_id+"/"+locale+": ingredient row count");continue;}
   for(let j=0;j<a.ingredients.length;j++) {
    const fi=a.ingredients[j],t=b.ingredients[j];
    if(t.amount!==fi.amount||normalizeUnit(locale,t.unit)!==fi.unit)errors.push(record.recipe_id+"/"+locale+": ingredient "+j+" amount/unit mismatch");
    if((fi.note!==undefined)!==(t.note!==undefined))errors.push(record.recipe_id+"/"+locale+": ingredient "+j+" note lost");
   }
   for(const field of fields) {
    if((a[field]??null)!==(b[field]??null))errors.push(record.recipe_id+"/"+locale+": macro "+field+" mismatch");
    if(b[field]!==undefined&&b[field]!==null)macros++;
   }
   if(source.steps!==draft.steps)errors.push(record.recipe_id+"/"+locale+": preparation step count mismatch");
  }
 }
 if(count!==ledger.draftTranslations||sourceCount!==ledger.draftedFinnishSources||ledger.publishedTranslations!==0||ledger.release_authorized!==false)errors.push("F25 ledger counts/release state mismatch");
 return {sourceCount,files:count,ingredients,steps,macros,errors};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{
  const result=checkF25();
  console.log("F25_DRAFT_STRUCTURE",JSON.stringify(result));
  if(result.errors.length)process.exitCode=1;
 }catch(err){console.error(err);process.exitCode=1;}
}
