from scratch_scope import assert_scratch
"""One read-only production snapshot; no site build or mutation."""
import concurrent.futures, datetime, hashlib, json, re, urllib.request, sys
from pathlib import Path
out=Path(sys.argv[1]);assert_scratch(out);out.mkdir(parents=True,exist_ok=True)
base='https://ozirix-dev.github.io/Reseptit/'
def fetch(url):
    with urllib.request.urlopen(url,timeout=35) as response:
        raw=response.read()
    text=raw.decode('utf-8')
    match=re.search(r'<script id="page-content" type="application/json">(.*?)</script>',text,re.S)
    return raw, json.loads(match.group(1)) if match else None
index,content=fetch(base)
def one(card):
    url=base+card['routePath'].lstrip('/')
    try:
        raw,data=fetch(url);recipe=data['recipe']
        return {'recipeId':card['recipeId'],'url':url,'status':200,'sha256':hashlib.sha256(raw).hexdigest(),'nutrition':recipe['nutrition']}
    except Exception as error:
        return {'recipeId':card['recipeId'],'url':url,'status':'UNKNOWN','error':str(error)}
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
    rows=list(pool.map(one,content['recipes']))
gkraw,_=fetch(base+'glykeeminen-kuorma/')
gktext=re.sub('<[^>]+>',' ',gkraw.decode('utf-8'))
counts=re.search(r'(\d+)\s+reseptiä tarkasteltu\s+(\d+)\s+laskennallista arviota\s+(\d+)\s+ilman kokonaisarviota',gktext)
result={'verifiedAtUtc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'indexSha256':hashlib.sha256(index).hexdigest(),'gkPageSha256':hashlib.sha256(gkraw).hexdigest(),'gkSummary':list(map(int,counts.groups())) if counts else None,'rows':rows}
(out/'production.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
valid=[r for r in rows if r['status']==200]
print(json.dumps({'recipes':len(rows),'read':len(valid),'completeMacros':sum(all(v is not None for v in r['nutrition'].values()) for r in valid),'summary':result['gkSummary'],'errors':[r for r in rows if r['status']!=200]},ensure_ascii=False))
