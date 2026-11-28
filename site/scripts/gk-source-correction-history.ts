// Specific source-correction predecessor, for frozen history and read-only review only.
// Never used by the live calculation or publication path.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import manifest from "../tests/history/gk-source-corrections-candidate.json";
const inputPath = "docs/nutrition/glycemic-load-pilot-input.json";
const sha = (s:string) => createHash("sha256").update(s).digest("hex");
export function predecessorForGkSourceCorrection(file:string,text:string):string {
  if(file!==inputPath) return text;
  const current=text.replaceAll("\r\n","\n");
  if(sha(current)===manifest.beforeFileSha256) return current;
  assert.equal(sha(current),manifest.afterFileSha256,"unreviewed source-correction successor");
  const data=JSON.parse(current);
  for(const [id,entry] of Object.entries(manifest.transitions)){
    const matches=data.recipes.filter((r:{recipeId:string})=>r.recipeId===id);
    assert.equal(matches.length,1,id);
    assert.deepEqual(matches[0],entry.afterInput,id+" exact corrected input");
    const index=data.recipes.findIndex((r:{recipeId:string})=>r.recipeId===id);
    data.recipes[index]=structuredClone(entry.beforeInput);
  }
  const before=JSON.stringify(data,null,2)+"\n";
  assert.equal(sha(before),manifest.beforeFileSha256,"historical predecessor hash");
  return before;
}
