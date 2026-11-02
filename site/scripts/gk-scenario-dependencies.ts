/** Lexical dependency inventory only: no recipe GL calculations or coverage mutations. */
import {readFileSync,readdirSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {parse} from 'yaml';
import {textHash} from './gk149-model';

export function scenarioDependencies(root:string){
 const rows:Array<{recipeId:string;path:string;sourceLfSha256:string;polyol:boolean;chocolatePolyolProblem:boolean;
  ketoChocolate:boolean;explicitAlternative:boolean;verifiedCompositionDifference:boolean;wholeRecipeGiMissing:true;
  newSourceEligibleNumericalResults:0;triggers:string[]}>=[];
 const seen=new Set<string>();
 function walk(dir:string){
  for(const entry of readdirSync(dir,{withFileTypes:true})){
   const file=path.join(dir,entry.name);if(entry.isDirectory()){walk(file);continue;}
   if(!entry.name.endsWith('.md'))continue;
   const text=readFileSync(file,'utf8'),match=text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
   if(!match)continue;const meta=parse(match[1]);
   if(meta.language!=='fi'||meta.status!=='published'||!meta.recipe_id)continue;
   const ingredients=(meta.ingredients??[]).map((i:{item:string})=>i.item);
   const polyol=ingredients.some((s:string)=>/erytrit|ksylit|maltit|sokerialkohol|polyol/i.test(s));
   const ketoChocolate=['keto','vhh'].includes(meta.diet_class)&&ingredients.some((s:string)=>/suklaa/i.test(s));
   const chocolatePolyolProblem=ingredients.some((s:string)=>/suklaa/i.test(s)&&/sokeriton|sokeritonta|sokerittom/i.test(s));
   const explicitAlternative=ingredients.some((s:string)=>/\btai\b/i.test(s));
   if(!polyol&&!ketoChocolate&&!chocolatePolyolProblem&&!explicitAlternative)continue;
   if(seen.has(meta.recipe_id))throw Error('Duplicate recipe identity');seen.add(meta.recipe_id);
   rows.push({recipeId:meta.recipe_id,path:path.relative(root,file).replaceAll('\\','/'),sourceLfSha256:textHash(text),polyol,chocolatePolyolProblem,ketoChocolate,explicitAlternative,
    verifiedCompositionDifference:['keto-mutakakku','keto-suklaakeksit'].includes(meta.recipe_id),wholeRecipeGiMissing:true,
    newSourceEligibleNumericalResults:0,triggers:ingredients.filter((s:string)=>/erytrit|ksylit|maltit|sokerialkohol|polyol|suklaa|\btai\b/i.test(s))});
  }
 }
 walk(path.join(root,'reseptit'));rows.sort((a,b)=>a.recipeId.localeCompare(b.recipeId,'en'));
 return {baselineMain:'92dc6dbe7b27e145d6938026c73b6823f2e2108f',method:'FI published ingredient metadata, polyol/chocolate/explicit-tai lexical screening; not a complete semantic substitution audit.',
  count:rows.length,polyol:rows.filter(r=>r.polyol).length,chocolatePolyolProblem:rows.filter(r=>r.chocolatePolyolProblem).length,
  ketoChocolate:rows.filter(r=>r.ketoChocolate).length,explicitAlternatives:rows.filter(r=>r.explicitAlternative).length,
  verifiedCompositionDifferences:rows.filter(r=>r.verifiedCompositionDifference).length,
  fullProductOrRecipeGiEvidenceMissingInThisPilot:rows.length,newSourceEligibleNumericalResults:0,publishedResults:0,coverageDelta:0,
  limitation:'Verified composition difference refers only to the two recipes using generic sugar-free chocolate. They could use the same sourced product alternatives; no new GL is computed for cookies. Other rows require product/recipe-specific review. Counts overlap; count is deduplicated.',rows};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 if(process.argv.length>2)throw Error('Read-only inventory takes no arguments');
 console.log(JSON.stringify(scenarioDependencies(fileURLToPath(new URL('../../',import.meta.url))),null,2));
}
