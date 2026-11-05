import {createHash} from 'node:crypto';
const sha=(text:string)=>createHash('sha256').update(text.replaceAll('\r\n','\n')).digest('hex');
const previous='2f8ff76b97848294c28195bb92c6d202e9754168ddb169d30ee5e8610d2c2b9b';
const corrected='361a945c3d6702ec64529dff267f8cd849ba0a8a14fd42ee6798d189a619dcd3';
/** Exact reviewed edition compatibility. Never rewrite a sealed receipt or accept other edits. */
export function reviewedSourceHashMatches(file:string,text:string,expected:string):boolean {
 if(sha(text)===expected)return true;
 if(file!=='docs/nutrition/food-records.json'||expected!==previous||sha(text)!==corrected)return false;
 const records=JSON.parse(text);
 const fixes:Record<string,[number,number]>={"afcd-F006573-release-3": [8, 7.7], "afcd-F007619-release-3": [7, 6.9], "afcd-F002384-release-3": [5, 2.8]};
 for(const [id,[before,after]] of Object.entries(fixes)){
  const row=records.find((r:{id:string})=>r.id===id);
  if(!row||row.per100g.carbohydrate!==after)return false;
  row.per100g.carbohydrate=before;
 }
 return sha(JSON.stringify(records,null,2)+'\n')===previous;
}
