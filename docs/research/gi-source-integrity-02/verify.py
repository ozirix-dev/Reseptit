"""Read-only integrity check for the GK-006 research sidecar; not a publication gate."""
import hashlib
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]

def require(condition, label):
    if not condition:
        raise SystemExit("FAIL: " + label)

def read_lf(path):
    return path.read_bytes().replace(b"\r\n", b"\n")

def git_blob(data):
    return hashlib.sha1(b"blob " + str(len(data)).encode() + b"\0" + data).hexdigest()

def load(path):
    return json.loads(read_lf(path))

def verify():
    manifest = load(HERE / "artifact-manifest.json")
    require(set(manifest["lfSha256"]) == {"README.md", "source-classifications.json", "verify.py"}, "manifest file set")
    for name, expected in manifest["lfSha256"].items():
        require(hashlib.sha256(read_lf(HERE / name)).hexdigest() == expected, name)
    data = load(HERE / "source-classifications.json")
    require(data["status"] == "AUDIT_SIDECAR_NOT_RUNTIME_MIGRATION", "status")
    registry = ROOT / data["registry"]["path"]
    raw = read_lf(registry)
    require(git_blob(raw) == data["registry"]["gitBlob"], "pinned registry blob")
    old = ROOT / data["previousPackage"]["path"]
    for name, field in [("artifact-manifest.json", "artifactManifestGitBlob"), ("source-classifications.json", "sourceClassificationsGitBlob")]:
        require(git_blob(read_lf(old / name)) == data["previousPackage"][field], "previous package " + name)
    records = json.loads(raw)["records"]
    require(len(records) == 64, "64 registry rows")
    missing = {r["id"]: r for r in records if "evidenceKind" not in r}
    rows = data["sources"]
    require(len(rows) == len({r["id"] for r in rows}) == len(missing) == 45, "45 unique rows")
    require({r["id"] for r in rows} == set(missing), "exact membership")
    require(len(records) - len(missing) == 19, "19 untouched rows")
    report_counts = {ref: 0 for ref in data["provenance"]["reports"].values()}
    for row in rows:
        source = missing[row["id"]]
        s = source["source"]
        snapshot = {"matchKind": source.get("matchKind"), "evidenceKind": source.get("evidenceKind"), "qualityTier": source.get("qualityTier"), "calculationUse": source.get("calculationUse"), "sourcePublished": s.get("published"), "sourceIso26642Confirmed": s.get("iso26642Confirmed"), "sourceParticipants": s.get("participants"), "sourceReferenceFood": s.get("referenceFood"), "sourceUrl": s["url"], "sourceLocator": s.get("table")}
        require(row["value"] == source["gi"] and row["registrySnapshot"] == snapshot, "source snapshot " + row["id"])
        require(row["newUseAuthorized"] is False, "no new use " + row["id"])
        require(row["calculationUse"] == ("REFERENCE_ONLY" if source.get("calculationUse") == "REFERENCE_ONLY" else "REVIEW_REQUIRED"), "calculation scope " + row["id"])
        require(all(ref in report_counts for ref in row["reviewReferences"]), "known report reference")
        report_counts[row["reviewReferences"][0]] += 1
    require(report_counts == {data["provenance"]["reports"][k]: v for k, v in data["coverage"].items()}, "20+8+17 coverage")
    require(all(f["runtimeChangeAuthorized"] is False for f in data["findings"]), "findings not authorized")
    print("PASS: sealed sidecar, pinned registry and prior artifacts; 45/45 rows, no new use")

if __name__ == "__main__":
    verify()
