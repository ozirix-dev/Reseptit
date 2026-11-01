// Independent Number endpoint/grid arithmetic and Intl formatting check.
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const data=JSON.parse(fs.readFileSync(path.join(here,'cases.json'),'utf8'));
const expected=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const close=(a,b)=>assert.ok(Math.abs(a-Number(b))<1e-11,`${a} != ${b}`);
let gridChecks=0,macroChecks=0;
for(const c of data.cases){
 const out=expected.results.find(r=>r.recipeId===c.recipeId),cap=150;
 let gk=0,A=0,F=0,P=0,E=0,protein=0,fat=0,t;
 for(const i of c.ingredients){const f=Number(i.massG)/100/c.servings,a=Number(i.macro.availableCarbohydrate)*f;A+=a;F+=Number(i.macro.fibre)*f;protein+=Number(i.macro.protein)*f;fat+=Number(i.macro.fat)*f;gk+=a*Number(i.gi??0)/100;
  if(i.targetDefinition)t={i,f};else if(i.pairedCarbohydrates){const p=i.pairedCarbohydrates.withValue-i.pairedCarbohydrates.without;P+=p*f;E+=(100-Object.values(i.macro).reduce((s,v)=>s+Number(v),0)-p)*f;}else P+=Number(i.polyolsSourceValue)*f;}
 const {i,f}=t;let pmax,base,netlo,nethi,totlo,tothi;
 if(i.targetDefinition==='AVAILABLE_WITH_UNKNOWN_EXTERNAL_POLYOLS'){
  pmax=(100-Object.values(i.macro).reduce((s,v)=>s+Number(v),0))*f;base=gk;netlo=nethi=A;totlo=A+F+P;tothi=totlo+pmax;
 }else{pmax=(i.us.total-i.us.fibre)*f;base=gk-pmax*Number(i.gi)/100;netlo=A-pmax;nethi=A;totlo=tothi=A+F+P;}
 tothi+=E;
 close(base,out.sourceModelGk.lower);close(base+(pmax+E)*cap/100,out.sourceModelGk.upper);
 const macro={carbsNetG:[netlo,nethi],carbsTotalG:[totlo,tothi],proteinG:[protein,protein],fatG:[fat,fat]};
 for(const [k,[lo,hi]] of Object.entries(macro)){close(lo,out.macros[k].lower);close(hi,out.macros[k].upper);const digits=out.macros[k].decimalPlaces;if(out.macros[k].stable){const fmt=new Intl.NumberFormat('en-US',{minimumFractionDigits:digits,maximumFractionDigits:digits,useGrouping:false});assert.equal(fmt.format(lo),fmt.format(hi));assert.equal(Number(fmt.format(lo)),Number(out.macros[k].value));}else{assert.equal(out.macros[k].value,null);assert.notEqual(Math.round(lo),Math.round(hi));}macroChecks++;}
 // Hypothetical shares/responses are probe coordinates, never source values.
 for(let share=0;share<=10;share++)for(let response=0;response<=10;response++)for(const extraResponse of [0,cap/2,cap]){
  const hypotheticalP=pmax*share/10,hypotheticalGi=cap*response/10;
  const value=(i.targetDefinition==='AVAILABLE_WITH_UNKNOWN_EXTERNAL_POLYOLS'?gk+hypotheticalP*hypotheticalGi/100:base+(pmax-hypotheticalP)*Number(i.gi)/100+hypotheticalP*hypotheticalGi/100)+E*extraResponse/100;
  assert.ok(value>=Number(out.sourceModelGk.lower)-1e-11&&value<=Number(out.sourceModelGk.upper)+1e-11);
  if(out.proposedDisplayedGk.stable)assert.equal(Math.round(value),Number(out.proposedDisplayedGk.value));gridChecks++;
 }
}
console.log(JSON.stringify({status:'PASS',cases:5,macroChecks,scenarioGridChecks:gridChecks}));
