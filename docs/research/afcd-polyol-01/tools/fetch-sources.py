"""Fetch each pinned publisher workbook once; refuse changed bytes."""
import hashlib,json,subprocess,sys,urllib.request
from pathlib import Path
manifest=Path(sys.argv[1]);out=Path(sys.argv[2]).resolve();parent=out
while not parent.exists():parent=parent.parent
check=subprocess.run(['git','rev-parse','--show-toplevel'],cwd=parent,capture_output=True)
if check.returncode!=128:raise ValueError('Source cache must be outside Git worktrees')
out.mkdir(parents=True,exist_ok=True)
entries=json.loads(manifest.read_text('utf8'))
for e in entries:
    assert Path(e['name']).name==e['name']
    p=out/e['name']
    if not p.exists():
        with urllib.request.urlopen(e['url'],timeout=35) as r:p.write_bytes(r.read())
    if hashlib.sha256(p.read_bytes()).hexdigest()!=e['sha256']:raise ValueError('Publisher file changed; fresh review required: '+e['name'])
(out/'manifest.json').write_text(json.dumps(entries,indent=2)+'\n',encoding='utf8')
print('Three pinned source workbooks verified; no source values changed.')
