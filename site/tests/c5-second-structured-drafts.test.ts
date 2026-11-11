import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { parseMarkdown } from "../src/content/markdown";
import { recipeFrontmatterSchema } from "../src/content/schema";
import { siteContent } from "../src/generated/content.generated";

const root=path.resolve(import.meta.dirname,"../..");
const blob=(s:string)=>createHash("sha1").update("blob "+Buffer.byteLength(s,"utf8")+"\0").update(s).digest("hex");
const versions=[
  {
    id:"kiinalainen-jianbing-soy-bean-sauce-punnittu-v2",
    blob:"d3ffb96266b4a3a1adffcd1e2c3589bb31ec2d0e",
    original:"kiinalainen-jianbing-munaletty",
    originalBlob:"15eef1ad0e7d56666e923e8d035db14e7efadd0c",
    exact:[
      ["vehnäjauhoa",100,"g"],
      ["vettä",180,"ml"],
      ["kananmunaa",2,"kpl"],
      ["kevätsipulia",12,"g"],
      ["seesaminsiemeniä",8,"g"],
      ["neutraalia paistoöljyä",13.5,"g"],
      ["Lee Kum Kee Soy Bean Sauce -kastiketta",15,"g"],
      ["suolaa",1,"g"],
    ] as const,
    note:/soijaa ja vehnää/,
  },
  {
    id:"meksikolainen-huevos-divorciados-kypsat-pavut-v2",
    blob:"dca1c51653e98f8a8fc8ab71c1db1bca41d8ef90",
    original:"meksikolainen-huevos-divorciados",
    originalBlob:"7559395cbb0d66229b7b964fb034bbcf3f9edd0b",
    exact:[
      ["kananmunaa",2,"kpl"],
      ["kypsiä valutettuja mustapapuja",150,"g"],
      ["tuoretta tomaattia",120,"g"],
      ["valmista vihreää salsaa",150,"g"],
      ["neutraalia paistoöljyä",13.5,"g"],
      ["suolaa",1,"g"],
    ] as const,
    note:/ei.*150 g kuivia mustapapuja/i,
  },
] as const;

test("two new C5 FI draft versions have exact sealed quantities and cannot be publicly listed",async()=>{
  for(const v of versions) {
    const file="reseptit/raakileet/"+v.id+".md";
    const source=await readFile(path.join(root,file),"utf8");
    assert.equal(blob(source),v.blob,v.id+": DRAFT_SHA_STALE");
    const original=await readFile(path.join(root,"reseptit/aamupalat",v.original+".md"),"utf8");
    assert.equal(blob(original),v.originalBlob,v.original+": HISTORICAL_SOURCE_CHANGED");
    const parsed=parseMarkdown(source);assert.ok(parsed,v.id);
    const data=recipeFrontmatterSchema.parse(parsed.data);
    assert.equal(data.recipe_id,v.id);
    assert.equal(data.status,"draft");
    assert.equal(data.language,"fi");
    assert.equal(data.category,"aamupala");
    assert.equal(data.servings,2);
    assert.equal(data.ingredients.length,v.exact.length);
    for(let i=0;i<v.exact.length;i++){
      const [item,amount,unit]=v.exact[i];
      assert.equal(data.ingredients[i].item,item);
      assert.equal(data.ingredients[i].amount,amount);
      assert.equal(data.ingredients[i].unit,unit);
    }
    for(const field of ["carbs_net_per_serving_g","carbs_total_per_serving_g",
      "protein_per_serving_g","fat_per_serving_g"] as const){
      assert.equal(data[field],null,v.id+": MACROS_MUST_BE_NULL");
    }
    assert.match(parsed.content,/EI JULKAISTU \/ EI KOEPAISTETTU/);
    assert.match(parsed.content,v.note);
    assert.match(parsed.content,/GK: ei määritetty/);
    assert.equal(siteContent.recipes.some(r=>r.recipeId===v.id),false,v.id+": SHOULD_NOT_PUBLISH");
  }
});
