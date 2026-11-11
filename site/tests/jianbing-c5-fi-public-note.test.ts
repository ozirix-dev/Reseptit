import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import {parseMarkdown} from "../src/content/markdown";
import {siteContent} from "../src/generated/content.generated";
import {projectJianbingC5FiPublicNote} from "../scripts/jianbing-c5-fi-public-note";

const root=path.resolve(import.meta.dirname,"../..");
const relative="reseptit/aamupalat/kiinalainen-jianbing-munaletty.md";
test("Jianbing source-locked FI caveat keeps original nutrition evidence and method",async()=>{
  const source=await readFile(path.join(root,relative),"utf8");
  const patched=projectJianbingC5FiPublicNote(relative,source);
  const before=parseMarkdown(source),after=parseMarkdown(patched);
  assert.ok(before&&after);
  assert.deepEqual(after.data,before.data);
  assert.equal(after.content.split("## Valmistus")[1].split("## Muistiinpanot")[0],
    before.content.split("## Valmistus")[1].split("## Muistiinpanot")[0]);
  assert.match(after.content,/AFCD F005702/);
  assert.match(after.content,/EU-, Australian- ja Hongkongin/);
  assert.match(after.content,/resepti ei ole gluteeniton/);
  assert.throws(()=>projectJianbingC5FiPublicNote(relative,source+"\nUNREVIEWED"),
    /JIANBING_C5_SOURCE_STALE/);
  assert.equal(projectJianbingC5FiPublicNote("reseptit/aamupalat/muu.md",source),source);
});
test("Jianbing production FI page has caveat, and V2 remains unpublished",()=>{
  const entry=siteContent.recipes.find(r=>r.recipeId==="kiinalainen-jianbing-munaletty"&&r.locale==="fi");
  assert.ok(entry);
  assert.match(entry.notesText??"",/AFCD F005702/);
  assert.equal(siteContent.recipes.some(r=>r.recipeId==="kiinalainen-jianbing-soy-bean-sauce-punnittu-v2"),false);
});
