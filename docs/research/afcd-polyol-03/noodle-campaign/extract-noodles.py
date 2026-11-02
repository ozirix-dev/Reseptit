"""Read-only noodle state extraction. Usage: extract-noodles.py SOURCE_DIR EXTERNAL_OUT.
Requires the original corrected2026-03-27 workbooks; preserves source tokens.
"""
import hashlib,json,subprocess,sys
from pathlib import Path
import openpyxl
source,out=map(Path,sys.argv[1:3]);parent=out.resolve()
while not parent.exists():parent=parent.parent
assert subprocess.run(['git','rev-parse','--show-toplevel'],cwd=parent,capture_output=True).returncode==128,'Output must be outside Git'
expected={'main-20260327.xlsx':'0d5a77077dd6cd91cbc2e6e317b8b218a38728c409eed452f1c10635a0d3099c','carbs-20260327.xlsx':'099bdadb4a980df503e7a3dd057e49a69b68315b67012a3358b9a6d06984e137'}
books={}
for name,want in expected.items():
 p=source/name;assert hashlib.sha256(p.read_bytes()).hexdigest()==want,name
 books[name]=openpyxl.load_workbook(p,read_only=True,data_only=True)['表全体']
main=books['main-20260327.xlsx'];carbs=books['carbs-20260327.xlsx']
assert '質量計' in main['P5'].value and carbs['O5'].value=='CHOAVL' and carbs['F5'].value=='CHOAVLM'
ids=['01047','01048','01050','01051','01041','01056'];rows={}
for name,sheet in books.items():
 rows[name]={}
 for ix,row in enumerate(sheet.iter_rows(values_only=True),1):
  key=str(row[1]).strip()
  if key in ids:
   assert key not in rows[name],'Duplicate nativeID in authoritative all-food sheet'
   rows[name][key]=(ix,row)
records=[]
for native_id in ids:
 ix,row=rows['main-20260327.xlsx'][native_id];other=rows['carbs-20260327.xlsx'].get(native_id)
 record={'id':'MEXT2023-'+native_id,'nativeId':native_id,'name':row[3],'sourceRelease':'STFCJ2023_CORRECTED_2026_03_27','basis':'per100g-edible','fieldCode':'CHOAVL','fieldName':'利用可能炭水化物（質量計）','mainWorkbookSha256':expected['main-20260327.xlsx'],'carbohydrateWorkbookSha256':expected['carbs-20260327.xlsx'],'sheet':'表全体','mainCell':'P'+str(ix),'massToken':str(row[15]),'monosaccharideEquivalentToken':str(row[13]),'differenceToken':str(row[16]),'differenceEnergyFlag':row[17],'polyolsToken':str(row[19]),'carbohydrateCell':None,'carbohydrateMassToken':None,'componentTokens':None}
 if other:
  j,values=other;record.update({'carbohydrateCell':'O'+str(j),'carbohydrateMassToken':str(values[14]),'componentTokens':dict(zip(['STARCH','GLUS','FRUS','GALS','SUCS','MALS','LACS','TRES'],map(str,values[6:14])))})
 records.append(record)
pack={'source':{'name':'MEXT Standard Tables of Food Composition in Japan2023, corrected2026-03-27','landingPage':'https://www.mext.go.jp/a_menu/syokuhinseibun/mext_00001.html','mainUrl':'https://www.mext.go.jp/content/20260327-mxt_kagsei-mext-000029402_02.xlsx','carbohydrateUrl':'https://www.mext.go.jp/content/20260327-mxt_kagsei-mext-000029402_13.xlsx','definitionsUrl':'https://www.mext.go.jp/content/20230428-mxt_kagsei-mext_00001_041.pdf','definitionLocator':'PDF physical pages9-10 and14: mass sum vs monosaccharide equivalents and difference','definitionsSha256':'d02b814b4900438c2abf40d566cc3f17d0719e20d120fe0434565563c638cc43','attribution':'日本食品標準成分表（八訂）増補2023年から引用','scope':'Six noodle state controls only; unknown sugar alcohols never become zero; native author-published mass sum used without recomputing unknown components.'},'records':records}
out.mkdir(parents=True,exist_ok=True);(out/'mext-noodles.json').write_text(json.dumps(pack,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps([{'id':r['nativeId'],'main':r['massToken'],'carb':r['carbohydrateMassToken'],'cells':[r['mainCell'],r['carbohydrateCell']]} for r in records]))
