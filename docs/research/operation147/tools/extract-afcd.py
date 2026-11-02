"""Read the pinned official XLSX; never edit or export the source workbook."""
import hashlib,json,sys
from pathlib import Path
import openpyxl
source=Path(sys.argv[1])
workbook=openpyxl.load_workbook(source,read_only=True,data_only=True)
sheet=workbook['Proximates'];expected={35:'Erythritol',36:'Maltitol',37:'Xylitol',38:'Available carbohydrate, without sugar alcohols',39:'Available carbohydrate, with sugar alcohols'}
rows=[]
for row,name in expected.items():
    assert sheet[f'A{row}'].value.strip()==name,(row,sheet[f'A{row}'].value)
    cells={f'A{row}':sheet[f'A{row}'].value}
    if row>=38:cells[f'G{row}']=sheet[f'G{row}'].value
    rows.append({'sheet':'Proximates','row':row,'cells':cells})
print(json.dumps({'name':source.name,'sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'rows':rows},ensure_ascii=False,indent=2))
