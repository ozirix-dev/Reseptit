"""Read-only independent checks of conditional source-component arithmetic.
No production input, receipt, publication or source approval is written.
"""
from decimal import Decimal as D
import json
from pathlib import Path

folder=Path(__file__).resolve().parent
root=folder.parents[2]
review=json.loads((folder/'source-review.json').read_text(encoding='utf-8'))
reference=json.loads((root/'docs/nutrition/fineli-release-20-reference.json').read_text(encoding='utf-8'))
fineli={r['source_id']:r for r in reference['foods']}
obs={r['id']:D(str(r['per100g'])) for r in review['sourceObservations']}
component=lambda grams,carbs,servings:D(grams)*D(str(carbs))/D(100)/D(servings)
cases={
 'avocado':(component('120',fineli['11057']['per100g']['available_carbohydrate_g_per_100g'],'2'),D('0.462')),
 'cornstarch-baozi':(component('7',fineli['27']['per100g']['available_carbohydrate_g_per_100g'],'4'),D('1.505')),
 'soy-bulgogi':(component('72',fineli['31']['per100g']['available_carbohydrate_g_per_100g'],'4'),D('1.71')),
 'ginger-conditional':(component('10',obs['IFCT2017-G014'],'4'),D('0.22425')),
 'curry-leaf-conditional':(component('10',obs['IFCT2017-G010'],'4'),D('0.11275')),
 'mustard-assumed3g':(component('3',obs['IFCT2017-H013'],'4'),D('0.126')),
 'potato-component-conditional-gk':(component('500',fineli['205']['per100g']['available_carbohydrate_g_per_100g'],'4')*D(66)/D(100),D('12.7875')),
}
for name,(actual,expected) in cases.items():assert actual==expected,(name,actual,expected)
assert cases['cornstarch-baozi'][0]>=1 and cases['soy-bulgogi'][0]>=1,'These missing-GI contributions cannot use the individual omission tolerance'
assert review['sourceApprovalGranted'] is False and review['publicationAuthorized'] is False
print(json.dumps({'status':'PASS','checked':len(cases),'conditionalCases':['ginger-conditional','curry-leaf-conditional','mustard-assumed3g','potato-component-conditional-gk'],'publicationAuthorized':False}))
