/** Verify four complete F25 A2 recipe candidates without admitting them to the FI catalog or i18n.
 * Exact source blob, method changes, nutrient source and GK status remain fail-closed.
 */
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {parseMarkdown} from "../src/content/markdown";
import {recipeFrontmatterSchema} from "../src/content/schema";
import {readF25GateAtCreation, readF25HistoricalBlob} from "./f25-history";
import a2 from "../../meta/kaannokset/f25-a2-four-fi-draft-manifest-20261111.json";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../..");
const gitBlob=(b:Buffer)=>createHash("sha1").update("blob "+b.byteLength+"\0").update(b).digest("hex");
const equal=(x:unknown,y:unknown)=>JSON.stringify(x)===JSON.stringify(y);

export function auditF25A2FourDrafts(){
  if(a2.schemaVersion!==1||a2.stage!=="HOLD"||a2.sources.length!==4)throw Error("F25_A2_INVALID_MANIFEST");
  const originalGate=readF25GateAtCreation(root);
  const ids=new Set<string>();
  const rows=[];
  for(const record of a2.sources){
    if(ids.has(record.recipeId))throw Error("F25_A2_DUPLICATE");ids.add(record.recipeId);
    const old=readF25HistoricalBlob(root,record.sourceGitBlobSha);
    if(gitBlob(old)!==record.sourceGitBlobSha)throw Error("F25_A2_SOURCE_CHANGED: "+record.recipeId);
    const parsed=parseMarkdown(old.toString("utf8"));
    if(!parsed)throw Error("F25_A2_NO_MARKDOWN");
    const data=recipeFrontmatterSchema.parse(parsed.data);
    const baseline=data.ingredients.map(x=>({amount:x.amount,unit:x.unit,item:x.item}));
    if(data.recipe_id!==record.recipeId||data.language!=="fi"||data.servings!==record.servings||!equal(baseline,record.oldIngredients))throw Error("F25_A2_BASELINE_STALE: "+record.recipeId);
    const gate=originalGate.sources.find(x=>x.recipe_id===record.recipeId);
    if(!gate||gate.approval!==null)throw Error("F25_A2_WRONG_RELEASE_AUTHORIZATION");
    if(!record.candidatePath.startsWith("docs/reviews/f25-a2-draft-recipes/")||record.candidatePath.startsWith("reseptit/"))throw Error("F25_A2_WRONG_DESTINATION");
    const draftBytes=readFileSync(path.join(root,record.candidatePath));
    if(gitBlob(draftBytes)!==record.candidateGitBlobSha)throw Error("F25_A2_DRAFT_CHANGED: "+record.recipeId);
    const draft=draftBytes.toString("utf8");
    for(const needle of ["EI JULKAISUUN","## Ainekset","## Valmistus","Ei koepaistoa"])if(!draft.includes(needle))throw Error("F25_A2_INCOMPLETE_DRAFT: "+record.recipeId+": "+needle);
    for(const flag of ["nutritionApproved","gkApproved","translationApproved","physicalTrialCompleted"] as const)
      if(record[flag]!==false)throw Error("F25_A2_APPROVAL_FALSE_CLAIM: "+record.recipeId);
    if(record.productAndMethodBlockers.length<4||record.methodReferences.length<1)throw Error("F25_A2_UNDOCUMENTED");
    const changed=record.proposedIngredients.filter(x=>!record.oldIngredients.some(y=>equal(x,y)));
    if(!equal(changed,record.sourceChanges))throw Error("F25_A2_CHANGE_LIST_STALE");
    if(record.candidateTimeTotalMin<record.oldTimeTotalMin)throw Error("F25_A2_SHORTER_THAN_LEGACY_TIME");
    const productContrast=record.productContrast;
    if(productContrast){
      const computed=(productContrast.brandLabelCarbGPer100-productContrast.oldSourceAvailableCarbGPer100)*productContrast.usedDryPearlsG/100/productContrast.servings;
      if(Math.abs(computed-productContrast.netCarbDifferenceGPerServing)>1e-9 || productContrast.fibreAndPolyolsVerified!==false || productContrast.approval!=="HOLD_BRAND_AND_FIBRE")throw Error("F25_A2_BRANDED_PRODUCT_MISMATCH: "+record.recipeId);
    }
    rows.push({recipeId:record.recipeId,status:"HOLD",sourceSha:record.sourceGitBlobSha,oldTime:record.oldTimeTotalMin,
      candidateTime:record.candidateTimeTotalMin,addedOrChangedItems:changed,productContrast,approval:false});
  }
  return {total:rows.length,approved:0,rows,disposition:"HOLD: candidate recipes are not cooked, nutritionally approved, or GK/i18n-authorized"};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  process.stdout.write(JSON.stringify(auditF25A2FourDrafts(),null,2)+"\n");
}
