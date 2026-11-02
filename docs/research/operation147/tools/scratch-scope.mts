import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
/** Refuse a scratch destination in any Git worktree, including through a junction. */
export async function assertScratch(destination:string){
 let existing=path.resolve(destination);
 while(true){try{existing=await fs.realpath(existing);break;}catch(e:any){if(e.code!=='ENOENT')throw e;const parent=path.dirname(existing);if(parent===existing)throw e;existing=parent;}}
 let gitRoot:string|undefined;
 try{gitRoot=execFileSync('git',['rev-parse','--show-toplevel'],{cwd:existing,encoding:'utf8',stdio:['ignore','pipe','ignore']}).trim();}catch(e:any){if(e.status!==128)throw e;}
 if(gitRoot)throw Error(`Scratch destination must be outside every Git worktree: ${gitRoot}`);
}
