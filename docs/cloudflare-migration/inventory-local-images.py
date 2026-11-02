import pathlib,json,hashlib,collections,argparse,subprocess
from PIL import Image
parser=argparse.ArgumentParser(description='Read-only inventory of specified checkout image sources and generated outputs; JSON to stdout.')
parser.add_argument('root',type=pathlib.Path)
r=parser.parse_args().root.resolve();rows=[]
for rel in ['kuvat','site/public/kuvat','site/dist/kuvat']:
 for f in sorted((r/rel).rglob('*')):
  if not f.is_file() or f.suffix.lower() not in ['.webp','.png','.jpg','.jpeg','.avif','.gif']:continue
  if f.is_symlink() or not f.resolve().is_relative_to(r):raise ValueError('Image escapes checkout: '+str(f))
  raw=f.read_bytes();row={'path':f.relative_to(r).as_posix(),'scope':rel,'bytes':len(raw),'sha256':hashlib.sha256(raw).hexdigest()}
  if f.suffix.lower()!='.webp':
   with Image.open(f) as im:row.update(format=im.format,width=im.width,height=im.height)

  rows.append(row)
c=collections.defaultdict(list)
for row in rows:c[row['sha256']].append(row)
summary={'checkout':str(r),'checkoutHead':subprocess.check_output(['git','-C',str(r),'rev-parse','HEAD']).decode().strip(),'imageFilesInObservedDirectories':len(rows),'physicalBytes':sum(x['bytes'] for x in rows),'uniqueSha256':len(c),'uniqueBytes':sum(v[0]['bytes'] for v in c.values()),'duplicateGroups':sum(len(v)>1 for v in c.values()),'redundantPhysicalBytes':sum(sum(x['bytes'] for x in v[1:]) for v in c.values() if len(v)>1),'scopeNote':'Only listed canonical/output directories observed read-only. Other active worktrees and tmp/performance/browser caches excluded. Not the main snapshot.'}
print(json.dumps({'summary':summary,'files':rows,'duplicateGroups':[{'sha256':k,'paths':[x['path'] for x in v]} for k,v in c.items() if len(v)>1]},ensure_ascii=False,indent=2))
