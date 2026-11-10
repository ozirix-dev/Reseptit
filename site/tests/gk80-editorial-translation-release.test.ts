import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { siteContent } from "../src/generated/content.generated";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";
import { projectReviewedFiEditorialSource } from "../scripts/gk80-editorial-display";

const root=path.resolve(import.meta.dirname,"../..");
const cases = [["indonesialainen-bubur-ayam-kanariisipuuro",3],["vietnamilainen-chao-ga-kanapuuro",3],["munakasmuffinit",5],["tonnikalamunakkaat-uunissa",5],["pohjoisafrikkalainen-harissa-shakshuka",5]] as Array<[string, number]>;
const locales=["en","sv","th"] as const;

test("fifteen published translations reflect the six-source GK80 FI public correction policy",()=>{
 for(const [id,count] of cases){
  const sourcePath="reseptit/aamupalat/"+id+".md";
  const raw=readFileSync(path.join(root,sourcePath),"utf8");
  const visibleFi=parseMarkdown(projectReviewedFiEditorialSource(sourcePath,raw))!;
  const fi=siteContent.recipes.find(entry=>entry.recipeId===id&&entry.locale==="fi");
  assert.ok(fi,id+": missing published FI page");
  assert.equal(fi.instructionsText.length,count,id+": corrected FI step count");
  for(const lang of locales){
   const entry=siteContent.recipes.find(x=>x.recipeId===id&&x.locale===lang);
   assert.ok(entry,id+":"+lang+": missing published locale");
   assert.equal(entry.instructionsText.length,count,id+":"+lang+": step count");
   assert.equal(entry.servings,visibleFi.data.servings);
   assert.equal(entry.timeTotalMin,visibleFi.data.time_total_min);
   assert.deepEqual(entry.ingredients.map(item=>[item.amount,item.unit]),
                    recipeFrontmatterSchema.parse(visibleFi.data).ingredients.map(item=>[item.amount,item.unit]));
   assert.deepEqual(entry.nutrition,fi.nutrition,id+":"+lang+": macros changed");
   const text=entry.instructionsText.join(" ");
   if(id.includes("kanariisipuuro")){
    assert.match(text,/75\s*°\s*C/);
    assert.match(text,/25/);
    assert.match(text,/15/);
    assert.match(text,lang==="th"?/น้ำ|ไก่/:lang==="sv"?/kokvätska|kyckling/i:/cooking juices|chicken/i);
   }
   if(id==="munakasmuffinit"){
    assert.match(text,lang==="th"?/ซิลิโคน/:lang==="sv"?/silikon/i:/silicone/i);
    assert.match(text,lang==="th"?/ไขมันเบคอนทั้งหมด/:lang==="sv"?/allt sparat baconfett/i:/all the reserved bacon fat/i);
    assert.doesNotMatch(text,/Source clarification needed|Källan måste förtydligas|ต้นฉบับต้องชี้แจง|Grease six muffin tin cups|Smörj sex muffinsformar/);
   }
   if(id==="tonnikalamunakkaat-uunissa"){
    assert.match(text,lang==="th"?/ซิลิโคน/:lang==="sv"?/silikon/i:/silicone/i);
    assert.doesNotMatch(text,/Source clarification needed|Källan måste förtydligas|ต้องชี้แจงต้นฉบับ|grease six muffin tin cups|smörj sex muffinsformar/);
   }
   if(id==="pohjoisafrikkalainen-harissa-shakshuka"){
    assert.match(entry.ingredients[0].item,lang==="th"?/ไม่รวมเปลือก/:lang==="sv"?/utan skal/i:/without shell/i);
    assert.doesNotMatch(entry.ingredients[0].item,/needs correction|behöver korrigeras|ต้องแก้ไข/);
    assert.doesNotMatch(entry.notesHtml??"",/requires a source correction|källan måste rättas|ต้องแก้คำในต้นฉบับ/);
   }
  }
 }
});

test("coconut rice is published only with reconciled SHA-pinned FI cooking method",()=>{
 const id="thai-kookosriisi-mangolla";
 const sourcePath="reseptit/aamupalat/"+id+".md";
 const raw=readFileSync(path.join(root,sourcePath),"utf8");
 const original=recipeFrontmatterSchema.parse(parseMarkdown(raw)!.data);
 const display=recipeFrontmatterSchema.parse(parseMarkdown(projectReviewedFiEditorialSource(sourcePath,raw))!.data);
 assert.deepEqual(original.cooking_method,["paistaminen"],"the historical GK80 source remains sealed");
 assert.deepEqual(display.cooking_method,["keittäminen"],"published FI corrects the erroneous metadata");
 for(const lang of locales){
  const live=siteContent.recipes.find(x=>x.recipeId===id&&x.locale===lang);
  assert.ok(live,id+":"+lang+": published page must exist");
  const targetPath="kaannokset/"+lang+"/aamupalat/"+id+".md";
  const target=recipeFrontmatterSchema.parse(parseMarkdown(readFileSync(path.join(root,targetPath),"utf8"))!.data);
  assert.equal(target.status,"published");
  assert.deepEqual(target.cooking_method,display.cooking_method);
  assert.equal(target.servings,display.servings);
  assert.deepEqual(target.ingredients.map(i=>[i.amount,i.unit]),display.ingredients.map(i=>[i.amount,i.unit]));
  for(const key of ["carbs_net_per_serving_g","carbs_total_per_serving_g","protein_per_serving_g","fat_per_serving_g"] as const)
    assert.equal(target[key],original[key],id+":"+lang+": no macro drift");
 }
});
