/** SOURCE-01: read-only FI inventory; stdout only. No build, network or database writes. */
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
const [rootArg, dependencyRootArg, snapshot] = process.argv.slice(2);
if (!rootArg || !dependencyRootArg || !/^[a-f0-9]{40}$/.test(snapshot ?? '')) {
  throw Error('Usage: tsx audit-baseline.mts <verified-repo-root> <existing-site-dependency-root> <snapshot-SHA>');
}
const root = fs.realpathSync(rootArg);
const dependencyRoot = fs.realpathSync(dependencyRootArg);
const git = (...args: string[]) => execFileSync('git', ['-C', root, ...args], {encoding: 'utf8'}).trim();
const remote = git('remote', 'get-url', 'origin');
if (!/^(https:\/\/github\.com\/ozirix-dev\/Reseptit(?:\.git)?|git@github\.com:ozirix-dev\/Reseptit(?:\.git)?)$/.test(remote)) throw Error('Wrong research repository');
// A documentation-only HEAD may differ. Inputs and verifier must still equal the frozen snapshot.
git('diff', '--exit-code', snapshot, '--', 'reseptit', 'site/scripts', 'docs/nutrition');
const require = createRequire(path.join(dependencyRoot, 'package.json'));
const {parse} = require('yaml');
const moduleAt = (name: string) => import(pathToFileURL(path.join(root, 'site/scripts', name)).href);
const {verifyNutritionEvidence, recipeNutritionInputHash} = await moduleAt('nutrition-evidence.ts');
const {isScopedPolyolEvidence, loadScopedPolyolC} = await moduleAt('gk80-polyol-c.ts');
const {isRecoveryEvidence, loadRecovery} = await moduleAt('gk80-uunikanapasta.ts');
const json = (relative: string) => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
const walk = (relative: string): string[] => fs.readdirSync(path.join(root, relative), {withFileTypes:true})
  .flatMap(entry => entry.isDirectory() ? walk(`${relative}/${entry.name}`) : entry.name.endsWith('.md') ? [`${relative}/${entry.name}`] : []).sort();
const keys = ['carbs_net_per_serving_g','carbs_total_per_serving_g','protein_per_serving_g','fat_per_serving_g'];
const batchDir = 'docs/nutrition/batches';
const batches = fs.readdirSync(path.join(root, batchDir)).filter(p => p.endsWith('.json')).map(p => json(`${batchDir}/${p}`));
const rows: any[] = [];
for (const sourcePath of walk('reseptit')) {
  const text = fs.readFileSync(path.join(root, sourcePath),'utf8');
  const frontmatter = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!frontmatter) continue;
  const data = parse(frontmatter[1]);
  if (!data?.recipe_id || !Array.isArray(data.ingredients)) continue;
  const evidencePath = `docs/nutrition/calculations/${data.recipe_id}.json`;
  const evidence = fs.existsSync(path.join(root,evidencePath)) ? json(evidencePath) : null;
  const checked = verifyNutritionEvidence(data,evidence);
  if (evidence && (!evidence.batchId || !batches.some(b => b.batchId === evidence.batchId && b.recipes?.some((r:any) => r.recipeId === evidence.recipeId)))) checked.errors.push('Missing batch manifest binding');
  try {
    if (evidence && isScopedPolyolEvidence(evidence)) await loadScopedPolyolC(root,data.recipe_id);
    if (evidence && isRecoveryEvidence(evidence)) await loadRecovery(root,data.recipe_id);
  } catch (error) { checked.errors.push(String(error)); }
  const values = Object.fromEntries(keys.map(k => [k,data[k] ?? null]));
  rows.push({recipeId:data.recipe_id,sourcePath,inputHash:recipeNutritionInputHash(data),values,
    nonNull:Object.values(values).filter(v => v !== null).length,
    evidence:evidence ? evidencePath : null,evidenceStatus:checked.status,evidenceErrors:checked.errors,
    publicationStatus:evidence?.publicationStatus ?? null});
}
if (new Set(rows.map(r => r.recipeId)).size !== rows.length) throw Error('Duplicate recipe ID');
const unbacked = rows.filter(r => r.nonNull > 0 && (!r.evidence || r.evidenceErrors.length));
const statuses: Record<string,number> = {};
for (const row of rows) statuses[row.evidenceStatus] = (statuses[row.evidenceStatus] ?? 0)+1;
const summary = {recipes:rows.length,allFour:rows.filter(r=>r.nonNull===4).length,
 anyMissing:rows.filter(r=>r.nonNull<4).length,allMissing:rows.filter(r=>r.nonNull===0).length,
 partial:rows.filter(r=>r.nonNull>0&&r.nonNull<4).length,
 unbackedPublishedRecipes:unbacked.length,unbackedPublishedValues:unbacked.reduce((s,r)=>s+r.nonNull,0),statuses};
process.stdout.write(JSON.stringify({baseSha:snapshot,scope:'FI source recipes; numeric publication and existing evidence; not translation or human approval audit',summary,rows},null,2)+'\n');
