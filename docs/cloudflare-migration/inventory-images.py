import pathlib,subprocess,json,hashlib,collections,re,yaml,argparse,xml.etree.ElementTree as ET
from PIL import Image
parser=argparse.ArgumentParser(description='Read-only Git-tracked image and recipe reference inventory; JSON to stdout.')
parser.add_argument('root',type=pathlib.Path)
root=parser.parse_args().root.resolve()
files=subprocess.check_output(['git','-C',str(root),'ls-files','-z']).decode().split('\0');exts={'.webp','.png','.jpg','.jpeg','.gif','.avif','.svg','.bmp','.tif','.tiff','.heic','.ico'}
images=[]
for rel in files:
 if pathlib.Path(rel).suffix.lower() not in exts:continue
 f=root/rel
 if f.is_symlink() or not f.resolve().is_relative_to(root):raise ValueError('Image escapes repository: '+rel)
 raw=f.read_bytes();row={'path':rel,'bytes':len(raw),'sha256':hashlib.sha256(raw).hexdigest(),'extension':f.suffix.lower()}
 try:
  if f.suffix.lower()=='.svg':
   svg=ET.fromstring(raw);row.update(format='SVG',viewBox=svg.attrib.get('viewBox'))
  else:
   with Image.open(f) as im:row.update(format=im.format,width=im.width,height=im.height,frames=getattr(im,'n_frames',1),exifPresent=bool(im.getexif()),infoKeys=sorted(im.info.keys()))
 except Exception as e:row['metadataReadError']=str(e)
 images.append(row)
refs=[];recipes=[]
for folder in ['reseptit','kaannokset','arkisto','luonnokset']:
 for f in sorted((root/folder).rglob('*.md')) if (root/folder).exists() else []:
  t=f.read_text(encoding='utf-8-sig');m=re.match(r'^---\s*\n(.*?)\n---',t,re.S)
  if not m:continue
  d=yaml.safe_load(m.group(1))
  if not isinstance(d,dict) or not d.get('recipe_id'):continue
  img=d.get('image');row={'path':f.relative_to(root).as_posix(),'recipeId':d['recipe_id'],'language':d.get('language'),'status':d.get('status'),'image':img}
  recipes.append(row)
  if isinstance(img,dict):
   for field,src in [('src',img.get('src'))]+[('srcset',x.get('src')) for x in (img.get('srcset') or [])]:
    if src:refs.append({'recipeId':d['recipe_id'],'recipePath':row['path'],'language':d.get('language'),'status':d.get('status'),'field':field,'imagePath':'kuvat/'+src,'exists':(root/'kuvat'/src).is_file()})
sha=collections.defaultdict(list)
for i in images:sha[i['sha256']].append(i)
used={x['imagePath'] for x in refs};published={x['imagePath'] for x in refs if x['status']=='published'}
for i in images:
 i['recipeRefs']=[x for x in refs if x['imagePath']==i['path']];i['publishedRefs']=sum(x['status']=='published' for x in i['recipeRefs'])
source=[x for x in images if x['path'].startswith('kuvat/')]
summary={'baseSha':subprocess.check_output(['git','-C',str(root),'rev-parse','HEAD']).decode().strip(),'trackedImageFiles':len(images),'trackedImageBytes':sum(x['bytes'] for x in images),'recipeSourceImages':len(source),'recipeSourceBytes':sum(x['bytes'] for x in source),'byExtension':dict(collections.Counter(x['extension'] for x in images)),'sourceByDirectory':{d:{'files':len(v:=[x for x in source if str(pathlib.PurePosixPath(x['path']).parent)==d]),'bytes':sum(x['bytes'] for x in v)} for d in sorted({str(pathlib.PurePosixPath(x['path']).parent) for x in source})},'publishedFinnishRecipes':sum(x['status']=='published' and x['language']=='fi' for x in recipes),'publishedRecipeVersions':sum(x['status']=='published' for x in recipes),'publishedImages':len(published),'duplicateGroups':len([v for v in sha.values() if len(v)>1]),'duplicateRedundantBytes':sum(sum(x['bytes'] for x in v[1:]) for v in sha.values() if len(v)>1),'missingImageRefs':sum(not x['exists'] for x in refs),'publishedWithoutImage':[x['recipeId'] for x in recipes if x['status']=='published' and not x['image']],'unusedSourceImages':[x['path'] for x in source if x['path'] not in used],'notPublishedSourceImages':[x['path'] for x in source if x['path'] not in published],'dimensions':dict(collections.Counter(str(x.get('width'))+'x'+str(x.get('height')) for x in source))}
result={'summary':summary,'images':images,'duplicates':[[x['path'] for x in v] for v in sha.values() if len(v)>1],'missingReferences':[x for x in refs if not x['exists']],'recipes':recipes}
print(json.dumps(result,ensure_ascii=False,indent=2))
