/** Research profile only. No imports from public calculation/release paths. */
export const PROFILE='GK_B_NAMED_SOURCES_WITH_A_MINOR_OMISSIONS_V1';
export function evaluateMinorOmissions(c:any,comps:any[],gis:any[],evaluate:any){
 const hold=(why:string)=>({recipeId:c.recipeId,profile:PROFILE,numericProposal:false,publicationAuthorized:false,ownerApproval:false,blockers:[why]});
 if(c.level!=='B'||!Number.isInteger(c.servings)||c.servings<=0)return hold('INVALID_B_CASE');
 if(!c.originalIngredientGroups||!Array.isArray(c.omitOriginalIngredientGroups)||!c.omitOriginalIngredientGroups.length)return hold('ORIGINAL_INGREDIENT_GROUPS_REQUIRED');
 const ids=new Set(c.omitOriginalIngredientGroups);
 if(ids.size!==c.omitOriginalIngredientGroups.length)return hold('DUPLICATE_OMISSION_GROUP');
 const groups=new Map<string,{cho:number,names:string[]}>();const covered:any[]=[],omitted:any[]=[];
 for(const i of c.candidateIngredients){
  const group=c.originalIngredientGroups[i.name],f=comps.find(x=>x.id===i.compositionId);
  if(!group||!f||!Number.isFinite(f.availablePer100g)||f.availablePer100g<0||f.availablePer100g>100||!Number.isFinite(i.grams)||i.grams<0||!i.note)return hold('UNKNOWN_SOURCE_MASS_OR_GROUP: '+i.name);
  if(!['AVAILABLE_POINT','UPPER_BOUND'].includes(i.carbohydrateUse))return hold('INVALID_CARBOHYDRATE_USE');
  if(['PHYSICAL_MASS_CAP','LABEL_ROUNDING_CAP','LABEL_CARBOHYDRATE_UPPER'].includes(f.kind)&&i.carbohydrateUse!=='UPPER_BOUND')return hold('BOUND_IS_NOT_A_POINT');
  const cho=i.grams*f.availablePer100g/100/c.servings;
  if(ids.has(group)){
   if(i.giId!==null)return hold('OMISSION_MUST_HAVE_EXPLICITLY_UNRESOLVED_GI');
   const g=groups.get(group)??{cho:0,names:[]};g.cho+=cho;g.names.push(i.name);groups.set(group,g);
   omitted.push({name:i.name,originalIngredientGroup:group,choMin:i.carbohydrateUse==='UPPER_BOUND'?0:cho,choMax:cho,giId:null,gkMin:null,gkMax:null});
  }else covered.push(i);
 }
 if(groups.size!==ids.size)return hold('UNKNOWN_OMISSION_GROUP');
 // Group the ORIGINAL logical ingredient before comparing: splitting a paste into
 // several catalog rows cannot make an >=1g ingredient eligible. Equality fails.
 if([...groups.values()].some(g=>g.cho>=1-1e-12))return hold('ORIGINAL_INGREDIENT_NOT_BELOW_1G');
 const sum=[...groups.values()].reduce((s,g)=>s+g.cho,0);
 if(sum>=2-1e-12)return hold('TOTAL_NOT_BELOW_2G');
 if(!covered.some(i=>{const g=gis.find(g=>g.id===i.giId),f=comps.find(f=>f.id===i.compositionId);return g?.kind==='NAMED_HUMAN_GI'&&i.grams*f.availablePer100g>0;}))return hold('NAMED_HUMAN_GI_REQUIRED_FOR_COVERED_MAIN_FOOD');
 const result=evaluate({...c,candidateIngredients:covered},comps,gis);
 return {...result,profile:PROFILE,ownerApproval:false,publicationAuthorized:false,methodApprovalRequired:true,interpretation:'Covered-carbohydrate B model with explicit minor omissions. Omitted CHO is positive/unknown GI, never GI0. Current profile unchanged.',omittedCho:sum,unknownGiCho:result.unknownGiCho+sum,omittedOriginalGroups:[...groups].map(([id,g])=>({id,...g})),contributions:[...result.contributions,...omitted],sourceEquivalenceCertified:false};
}
