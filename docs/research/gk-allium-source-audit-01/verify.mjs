// Read-only pinned historical audit. No runtime edits or approval.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
const baseCommit = "a0fbeb33d7fb84f4e0718ec57f1d5e4447a290dc";
const pins = {
  "input": {
    "path": "docs/nutrition/glycemic-load-pilot-input.json",
    "blob": "914b0fa604516f8585e616863bfff5dcaab3e729"
  },
  "food": {
    "path": "docs/nutrition/food-records.json",
    "blob": "d7d6b83b45ed6b048582850f39425d08eb8d1ec6"
  },
  "falafelRecipe": {
    "path": "reseptit/paaruoat/falafel.md",
    "blob": "1bce7a03427ebfb6422c46eeef9f04e141359070"
  },
  "falafelCalc": {
    "path": "docs/nutrition/calculations/falafel.json",
    "blob": "f6ede7516470e2e5c2ccb7d3595270f669f2beee"
  },
  "bissaraRecipe": {
    "path": "reseptit/aamupalat/pohjoisafrikkalainen-bissara.md",
    "blob": "1c7fb66e7512d91bd986d3de8c20a4a5ee0251c6"
  },
  "bissaraCalc": {
    "path": "docs/nutrition/calculations/pohjoisafrikkalainen-bissara.json",
    "blob": "08ab461c196dfa1a8584d5e49e46500c27d16512"
  }
};
function audit(input, foods, falafelRecipe, falafelCalc, bissaraRecipe, bissaraCalc) {
  const require = (ok, label) => { if (!ok) throw new Error("FAIL: " + label); };
  const round = x => Math.round(x * 1e6) / 1e6;
  const garlic = s => /valkosipuli|garlic/i.test(s);
  const classify = (id, name) => id == null ? "UNMAPPED" : name == null ? "UNKNOWN_RECORD" : garlic(name) ? "GARLIC_RECORD" : /sipuli|onion/i.test(name) ? "ONION_NOT_GARLIC" : "OTHER_REVIEW";
  require(input.recipes.length === 326 && new Set(input.recipes.map(r => r.recipeId)).size === 326, "326 unique historical recipes");
  const food = new Map(foods.map(r => [r.id, r]));
  const rows = input.recipes.flatMap(r => r.ingredients.flatMap((i, index) => {
    if (!/valkosipuli/i.test(i.name)) return [];
    const record = food.get(i.fineliRecordId);
    return [{recipeId:r.recipeId,ingredientIndex:index,servings:r.servings,name:i.name,grams:i.grams??null,foodRecordId:i.fineliRecordId??null,giRecordId:i.giRecordId??null,recordName:record?.name??null,classification:classify(i.fineliRecordId,record?.name),newUseAuthorized:false}];
  }));
  const counts = {GARLIC_RECORD:0,UNMAPPED:0,ONION_NOT_GARLIC:0,UNKNOWN_RECORD:0,OTHER_REVIEW:0};
  for (const row of rows) counts[row.classification]++;
  require(rows.length===51 && new Set(rows.map(r=>r.recipeId)).size===50,"51 literal garlic rows in 50 recipes");
  require(counts.GARLIC_RECORD===45 && counts.UNMAPPED===4 && counts.ONION_NOT_GARLIC===2 && counts.UNKNOWN_RECORD===0 && counts.OTHER_REVIEW===0,"screen counts");
  const specs=[
    {id:"falafel",index:2,oldGrams:165,amount:3,unit:"kpl",item:"valkosipulinkynttä",servings:4,recipe:falafelRecipe,calc:falafelCalc,expectedRecipeLine:/amount:\s*3,\s*unit:\s*kpl,\s*item:\s*valkosipulinkynttä/,note:"Three cloves; current source recipe and nutrition memo use 3 g per clove. Other historical falafel rows (including chickpeas and oil) still require whole-recipe/version review."},
    {id:"pohjoisafrikkalainen-bissara",index:1,oldGrams:null,amount:1,unit:"tl",item:"valkosipuli",servings:2,recipe:bissaraRecipe,calc:bissaraCalc,expectedRecipeLine:/amount:\s*1\s*\n\s*unit:\s*tl\s*\n\s*item:\s*valkosipuli(?:\s*\n|$)/,note:"One teaspoon; current nutrition memo uses 3 g minced garlic. The historical exclusion cites the wrong onion card, not a verified garlic conversion."}
  ];
  const matches=rows.filter(r=>r.classification==="ONION_NOT_GARLIC");
  require(matches.length===specs.length && specs.every(s=>matches.some(m=>m.recipeId===s.id&&m.ingredientIndex===s.index)),"two exact mismatch identities");
  const candidates=specs.map(s=>{
    const recipe=input.recipes.find(r=>r.recipeId===s.id);
    const before=recipe.ingredients[s.index];
    require(recipe.servings===s.servings && before.name===s.item && before.grams===s.oldGrams && before.fineliRecordId==="fineli-335-release-20" && before.giRecordId===null,s.id+" exact historical row");
    require(s.expectedRecipeLine.test(s.recipe),s.id+" current recipe ingredient amount");
    require(s.calc.recipeId===s.id && s.calc.servings===s.servings && s.calc.reviewerStatus==="AUTOMATED ONLY",s.id+" nutrition memo scope");
    const memo=s.calc.ingredients.filter(i=>i.item===s.item);
    require(memo.length===1,s.id+" unique garlic memo row");
    const n=memo[0], rec=food.get(n.record.id), old=food.get(before.fineliRecordId);
    require(n.amount===s.amount && n.unit===s.unit && n.gramsPerUnit===3 && n.edibleFraction===1 && n.retainedFraction===1,s.id+" documented conversion");
    require(rec?.id==="afcd-F004193-release-3" && garlic(rec.name) && rec.carbohydrateDefinition==="EU_AVAILABLE" && n.record.carbohydrateDefinition==="EU_AVAILABLE" && rec.per100g.carbohydrate===10.2 && n.record.per100g.carbohydrate===10.2,s.id+" same documented garlic composition");
    require(old?.id==="fineli-335-release-20" && /KELTASIPULI/i.test(old.name) && old.carbohydrateDefinition==="EU_AVAILABLE" && old.per100g.carbohydrate===4.8,s.id+" old onion composition");
    const grams=s.amount*n.gramsPerUnit;
    const oldCarb=before.grams==null?null:round(before.grams*old.per100g.carbohydrate/100/s.servings);
    const candidateCarb=round(grams*rec.per100g.carbohydrate/100/s.servings);
    const candidate={...before,grams,fineliRecordId:rec.id,giRecordId:null,massEvidence:`Candidate only: ${s.amount} ${s.unit} x ${n.gramsPerUnit} g per unit per pinned recipe nutrition memo; AFCD F004193 raw peeled garlic, not onion.`};
    delete candidate.excludedReason;
    return {recipeId:s.id,ingredientIndex:s.index,servings:s.servings,before,proposedRowForReview:candidate,documentedConversion:{amount:s.amount,unit:s.unit,gramsPerUnit:n.gramsPerUnit,sourceReviewStatus:s.calc.reviewerStatus},compositionOnlyAvailableCarbGPerServing:{historical:oldCarb,candidate:candidateCarb,delta:oldCarb===null?null:round(candidateCarb-oldCarb)},note:s.note,newUseAuthorized:false};
  });
  require(candidates[0].compositionOnlyAvailableCarbGPerServing.historical===1.98 && candidates[0].compositionOnlyAvailableCarbGPerServing.candidate===0.2295 && candidates[0].compositionOnlyAvailableCarbGPerServing.delta===-1.7505,"falafel arithmetic");
  require(candidates[1].compositionOnlyAvailableCarbGPerServing.historical===null && candidates[1].compositionOnlyAvailableCarbGPerServing.candidate===0.153 && candidates[1].compositionOnlyAvailableCarbGPerServing.delta===null,"bissara unknown remains unknown");
  return {status:"HISTORICAL_INPUT_IDENTITY_SCREEN_NOT_RUNTIME_APPROVAL",scope:"Literal Finnish ingredient-name substring valkosipuli in the 326 pinned original inputs. Garlic record names are identity labels, not adequacy or preparation approvals. Unmapped rows are not zero. No public GK, variants, retained carbohydrate, new approval or complete source audit inferred.",summary:{inputRecipes:326,matchedIngredientRows:51,matchedRecipeIds:50,classifications:counts},rows,candidates,newUseAuthorized:false};
}
const here=dirname(fileURLToPath(import.meta.url));
const root=resolve(here,"../../..");
function readPin(pin){
  const resolved=execFileSync("git",["-C",root,"rev-parse","--verify",baseCommit+":"+pin.path],{encoding:"utf8"}).trim();
  if(resolved!==pin.blob)throw new Error("FAIL: path pin "+pin.path);
  const bytes=execFileSync("git",["-C",root,"cat-file","blob",pin.blob],{maxBuffer:8*1024*1024});
  const digest=createHash("sha1").update("blob "+bytes.length+"\0").update(bytes).digest("hex");
  if(digest!==pin.blob)throw new Error("FAIL: blob digest "+pin.path);
  return bytes.toString("utf8");
}
const data=Object.fromEntries(Object.entries(pins).map(([k,pin])=>[k,readPin(pin)]));
const report={baseCommit,pins,...audit(JSON.parse(data.input),JSON.parse(data.food),data.falafelRecipe,JSON.parse(data.falafelCalc),data.bissaraRecipe,JSON.parse(data.bissaraCalc))};
const expected=readFileSync(resolve(here,"audit.json"),"utf8").replaceAll("\r\n","\n");
if(JSON.stringify(report,null,2)+"\n"!==expected)throw new Error("FAIL: audit snapshot differs");
console.log("PASS: 51 literal garlic rows, two onion mismatches, exact candidate arithmetic; no runtime approval");
