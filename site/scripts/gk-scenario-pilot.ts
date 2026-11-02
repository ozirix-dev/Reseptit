import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {loadScenarioPilot,assessPilot} from './gk-scenario-model';

// Scratch output is deliberately outside public/, src/generated and production build inputs.
if(process.argv.length>2)throw Error('No activation or publication arguments are supported');
const root=fileURLToPath(new URL('../../',import.meta.url));
const {pack,base}=loadScenarioPilot(root),report=assessPilot(pack,base);
const out=path.join(root,'tmp/nutrition/gk-scenarios-01');mkdirSync(out,{recursive:true});
writeFileSync(path.join(out,'results.json'),JSON.stringify(report,null,2)+'\n');
writeFileSync(path.join(out,'styles.css'),readFileSync(path.join(root,'site/src/styles.css')));
// The UI consumes the same DTO the CLI emits. No hardcoded GL values in the preview.
const html=readFileSync(path.join(root,'site/previews/gk-scenarios.html'),'utf8');
writeFileSync(path.join(out,'index.html'),html.replace('<!-- GENERATED_RESULT_DATA -->',
 '<script id="scenario-data" type="application/json">'+JSON.stringify(report).replaceAll('<','\\u003c')+'</script>'));
console.log(JSON.stringify({output:out,recipeCount:report.uniqueRecipeCount,sourceEligible:report.newSourceEligibleWholeRecipeResults,
 published:report.publishedResults,coverageDelta:report.coverageDelta,results:report.results.map(r=>({id:r.scenarioId,
 whole:r.wholeRecipe.kind,conditional:r.conditional,ordinaryUnresolved:r.coverage.unresolvedOrdinaryChoG,blockers:r.blockers}))},null,2));
