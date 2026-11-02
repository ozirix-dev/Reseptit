/** Isolated MEXT GK-only source adapter. No production import or activation. */
export function mextAvailableMass(reference:any,nativeId:string) {
  const rows=reference.records.filter((r:any)=>r.nativeId===nativeId);
  if(rows.length!==1) throw Error('MEXT native identity missing or ambiguous');
  const r=rows[0];
  if(r.mainWorkbookSha256!=='0d5a77077dd6cd91cbc2e6e317b8b218a38728c409eed452f1c10635a0d3099c'||r.carbohydrateWorkbookSha256!=='099bdadb4a980df503e7a3dd057e49a69b68315b67012a3358b9a6d06984e137') throw Error('MEXT workbook revision hash mismatch');
  if(r.sourceRelease!=='STFCJ2023_CORRECTED_2026_03_27'||r.basis!=='per100g-edible'||r.fieldCode!=='CHOAVL'||r.fieldName!=='利用可能炭水化物（質量計）') throw Error('MEXT source field/version not verified');
  if(!/^P\d+$/.test(r.mainCell)||!/^O\d+$/.test(r.carbohydrateCell??'')) throw Error('MEXT independent mass-sum observation missing');
  const token=String(r.massToken).trim();
  // Parenthesized estimates, trace and unavailable values must not become ordinary points.
  if(!/^\d+(?:\.\d+)?$/.test(token)) throw Error('MEXT mass unmeasured/estimated/trace, not source zero');
  if(token!==r.carbohydrateMassToken) throw Error('MEXT source workbooks disagree');
  const availablePer100g=Number(token);
  if(!Number.isFinite(availablePer100g)||availablePer100g>100) throw Error('Invalid source carbohydrate');
  return {nativeId,availablePer100g,sourceState:availablePer100g===0?'SOURCE_PUBLISHED_ZERO':'SOURCE_PUBLISHED_MASS_SUM',polyolsTotalState:'UNKNOWN_OR_UNUSED',polyols:null,monosaccharideEquivalentToken:r.monosaccharideEquivalentToken,differenceToken:r.differenceToken,unmeasuredComponents:Object.entries(r.componentTokens??{}).filter(([,v])=>v==='-').map(([k])=>k),methodNote:'Use the native author-published CHOAVL sum, not a self-sum with missing components coerced to zero. No GI/macro authorization.',sourceFamilyApprovalRequired:true,publicationAuthorization:false};
}
