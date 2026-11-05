"""Read-only check of the three AFCD cells against the pinned official workbook.
Usage: python verify_source.py path/to/AFCD-nutrient-profiles.xlsx
Python standard library only; no downloads or output files.
"""
import hashlib
import json
from decimal import Decimal, ROUND_HALF_UP
from pathlib import Path
import sys
from xml.etree import ElementTree as ET
from zipfile import ZipFile

folder = Path(__file__).resolve().parent
snapshot = json.loads((folder / 'before.json').read_text(encoding='utf-8'))
workbook = Path(sys.argv[1])
assert hashlib.sha256(workbook.read_bytes()).hexdigest() == snapshot['sourceProfiles']['sha256'], 'Workbook hash differs'
ns = {'m': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
with ZipFile(workbook) as archive:
    shared = []
    if 'xl/sharedStrings.xml' in archive.namelist():
        shared = [''.join(node.itertext()) for node in ET.fromstring(archive.read('xl/sharedStrings.xml'))]
    # The pinned workbook's second sheet is "All solids & liquids per 100 g".
    sheet = ET.fromstring(archive.read('xl/worksheets/sheet2.xml'))
    cells = {node.attrib['r']: node for node in sheet.findall('.//m:c', ns)}

    def value(address):
        node = cells[address]
        if node.attrib.get('t') == 'inlineStr':
            return ''.join(node.find('m:is', ns).itertext())
        text = node.find('m:v', ns).text
        return shared[int(text)] if node.attrib.get('t') == 's' else text

    for fix in snapshot['fixes']:
        row = fix['source']['row']
        assert value(f'A{row}') == fix['nativeId']
        assert Decimal(value(f'AM{row}')) == Decimal(str(fix['after']))
        assert Decimal(value(f'AN{row}')) == Decimal(str(fix['before']))

peach = next(r for r in snapshot['selectedResults'] if r['recipeId'] == snapshot['affectedIds'][0])
fix = snapshot['fixes'][0]

def total(corrected):
    result = Decimal(0)
    for ingredient in peach['ingredients']:
        if ingredient['gi'] is None:
            continue  # Preserve the existing documented omissions.
        available = fix['after'] if corrected and ingredient['fineliRecordId'] == fix['id'] else ingredient['availableCarbohydratePer100g']
        result += Decimal(str(ingredient['gi'])) * Decimal(str(available)) * Decimal(str(ingredient['grams'])) / Decimal(10000) / Decimal(peach['servings'])
    return result

old, new = total(False), total(True)
assert old == Decimal('4.0836') and new == Decimal('3.96885')
assert old - new == Decimal('0.11475')
assert new.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP) == Decimal('3.97')
print(json.dumps({'status': 'PASS', 'sourceRecords': 3, 'previousExactGk': str(old), 'correctedExactGk': str(new), 'deltaGk': str(new-old)}))
