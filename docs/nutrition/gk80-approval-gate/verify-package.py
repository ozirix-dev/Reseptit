"""Read-only seals/queue verification. Requires existing Python and Node; writes nothing."""
from pathlib import Path
import csv
import hashlib
import json
import subprocess

HERE = Path(__file__).resolve().parent

def read(name):
    return json.loads((HERE / name).read_text(encoding='utf-8'))

manifest = read('package-manifest.json')
for name, expected in manifest['filesSha256Lf'].items():
    raw = (HERE / name).read_bytes().replace(b'\r\n', b'\n')
    assert hashlib.sha256(raw).hexdigest() == expected, name
assert manifest['newApprovalGranted'] is False
assert manifest['publicationAuthorized'] is False

pack = read('proposals.json')
sources = read('sources.json')['records']
assert pack['activation'] is False
assert pack['ownerApprovalRecordedByThisReview'] is False
entries = pack['entries']
assert len(entries) == 18 and len({e['recipeId'] for e in entries}) == 16
objects = [{k: v for k, v in e['sealedProposal'].items() if k != 'inputSha256'} for e in entries]
objects += [s['record'] for s in sources.values()]
js = "let s='';process.stdin.on('data',c=>s+=c);process.stdin.on('end',()=>process.stdout.write(JSON.stringify(JSON.parse(s).map(v=>require('crypto').createHash('sha256').update(JSON.stringify(v)).digest('hex')))));"
actual = json.loads(subprocess.check_output(['node', '-e', js], input=json.dumps(objects, ensure_ascii=False).encode('utf-8')))
expected = [e['inputSha256'] for e in entries] + list(sources)
assert actual == expected, 'Input or source-record seal mismatch'
for entry in entries:
    assert all(value in sources for value in entry['sourceRecordSha256'].values())
    proposal = entry['sealedProposal']
    assert proposal.get('approval', proposal.get('ownerApproval')) is False

with (HERE / 'approval-table.csv').open(encoding='utf-8', newline='') as stream:
    rows = list(csv.DictReader(stream))
assert len(rows) == 15 and len({r['recipeId'] for r in rows}) == 15
counts = {status: sum(r['recommendedDecision'] == status for r in rows) for status in {r['recommendedDecision'] for r in rows}}
assert counts == {'ALREADY_APPROVED_UNPUBLISHED': 3, 'READY_FOR_OWNER_APPROVAL': 2, 'CONDITIONAL_REVIEW': 3, 'SOURCE_HOLD': 7}
assert all(r['newPublishedByThisReview'] == '0' for r in rows)
receipts = read('existing-approvals.json')
assert receipts['newApprovals'] == 0 and len(receipts['receipts']) == 3
assert all(r['approvalCreatedByThisReview'] is False for r in receipts['receipts'])
print(json.dumps({'status': 'PASS', 'files': len(manifest['filesSha256Lf']), 'sealedInputs': len(entries), 'sourceRecords': len(sources), 'reviewRows': len(rows), 'newOwnerApprovals': 0, 'writes': 0}))
