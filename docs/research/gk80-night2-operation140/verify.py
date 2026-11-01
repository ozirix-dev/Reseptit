"""Read-only, standard-library verification; no network, build or GK calculation.

Run from any directory. --baseline-report optionally verifies the already-existing
clean-main report without recalculating it. This is historical preparation
evidence, not owner approval or a future-main compatibility test.
"""
from pathlib import Path
import argparse
import collections
import hashlib
import json
import subprocess

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
MAIN = "583fdb91aeb12114f909412b9165fc3b02a6515d"


def read(path):
    return json.loads(path.read_text(encoding="utf8"))


def sha(path):
    return hashlib.sha256(path.read_bytes().replace(b"\r\n", b"\n")).hexdigest()


def git(*args):
    return subprocess.check_output(["git", "-C", str(ROOT), *args], text=True).strip()


def verify(report_path=None):
    manifest = read(HERE / "artifact-manifest.json")
    assert manifest["baseMain"] == MAIN
    assert set(manifest["lfSha256"]) == {p.name for p in HERE.iterdir() if p.is_file() and p.name != "artifact-manifest.json"}
    for name, expected in manifest["lfSha256"].items():
        assert sha(HERE / name) == expected, name
    for item in read(HERE / "input-manifest.json")["mainFiles"]:
        assert sha(ROOT / item["path"]) == item["lfSha256"], item["path"]
    base = read(HERE / "main133-baseline.json")
    assert base["main"] == MAIN
    assert git("rev-parse", MAIN + "^{tree}") == base["sourceTree"]
    assert base["counts"] == {"recipes": 326, "numeric": 133, "incomplete": 193}
    assert len(base["resultHashes"]) == len(base["resultSummaries"]) == len(base["publishedNutrition"]) == 326
    published = set(base["numericIds"])
    assert len(published) == 133
    assert published == {r["recipeId"] for r in base["resultSummaries"] if r["status"] == "CALCULATED"}
    for row in base["publishedNutrition"].values():
        assert sha(ROOT / row["sourcePath"]) == row["sourceSha256"]
    screen = read(HERE / "screening86.json")
    assert len(screen["recipes"]) == screen["screened"] == 86
    assert dict(collections.Counter(r["class"] for r in screen["recipes"])) == screen["counts"] == {"D": 65, "C": 13, "B": 8}
    screen_ids = {r["recipeId"] for r in screen["recipes"]}
    assert len(screen_ids) == 86 and not published & screen_ids
    for row in screen["recipes"]:
        assert sha(ROOT / row["sourcePath"]) == row["sourceSha256"]
    matrix = read(HERE / "shared-source-matrix193.json")
    incomplete = {r["recipeId"] for r in matrix["recipes"]}
    assert len(matrix["recipes"]) == len(incomplete) == 193
    assert incomplete | published == set(base["resultHashes"]) and not incomplete & published
    assert screen_ids <= incomplete
    assert all(r["verifiedNewReleaseReady"] == 0 for r in matrix["rankedFamilies"])
    partition = read(HERE / "partition.json")
    assert partition["counts"] == {"publishedNumeric": 133, "oldNumericProposalsSourceHold": 23, "oldKayaProposal": 1, "oldNativeHolds": 83, "newlyScreened": 86}
    assert sum(partition["counts"].values()) == 326
    deep = read(HERE / "deep-review-six.json")
    assert len(deep["recipes"]) == deep["hold"] == 6 and deep["rounds"] == 1
    assert set(deep["selectedIds"]) <= screen_ids
    assert all(r["result"] == "HOLD" and r["newWholeGk"] is None and r["newFourMacroPackage"] is None for r in deep["recipes"])
    kaya = read(HERE / "kaya-decision.json")
    assert kaya["decision"] == "HOLD" and kaya["newWholeGk"] is None
    assert kaya["correctedSourceAttribution"]["row226"]["gi"] == 54
    assert kaya["correctedSourceAttribution"]["row227"]["gi"] == 82
    assert kaya["underlyingSupplementSha256"] == "e930c4a090697abd4f7331a64837b524cf4701513cbb9865a739f4f9fb131061"
    shared = read(HERE / "shared-source-decisions.json")
    assert shared["familiesStudied"] == 2 and shared["wholeRecipesFreed"] == 0
    assert shared["families"][1]["existingPdfSha256"] == "4b90cf8309e1246a5cd4ee30d12b50278facd3e75de791745bb51e519a20bc39"
    assert sha(ROOT / "docs/nutrition/fineli-release-20-reference.json") == shared["families"][0]["frozenReferenceFileLfSha256"]
    proof = read(HERE / "normalization-proof.json")
    assert proof["status"] == "PASS" and proof["recordUsesCompared"] == 1933 and proof["uniqueRecordIds"] == 751
    assert proof["activeUsTotalUses"] == 0 and proof["everyExistingNormalizationUnchanged"] is True
    assert sha(ROOT / "site/scripts/nutrition-model.ts") == proof["patchedModelLfSha256"]
    allowed = {"site/scripts/nutrition-model.ts", "site/tests/nutrition-model.test.ts"}
    prefix = HERE.relative_to(ROOT).as_posix() + "/"
    changes = git("diff", "--name-only", MAIN).splitlines()
    assert allowed <= set(changes)
    assert all(p in allowed or p.startswith(prefix) for p in changes), changes
    resources = read(HERE / "scope-and-resources.json")
    assert resources["localFullBuilds"] == resources["newFull326Calculations"] == resources["manualActions"] == 0
    assert resources["newWholeNumericCandidates"] == resources["newOwnerReady"] == 0
    assert not any(resources[k] for k in ["readyAuthorized", "mergeAuthorized", "deployAuthorized", "oldPrsModified", "reportHubModified"])
    if report_path:
        assert sha(report_path) == base["sourceReportLfSha256"]
        report = read(report_path)
        hashes = {r["recipeId"]: hashlib.sha256(json.dumps(r, ensure_ascii=False, separators=(",", ":")).encode()).hexdigest() for r in report["results"]}
        assert hashes == base["resultHashes"]
    return {"status": "PASS", "screened": 86, "deepHold": 6, "kaya": "HOLD", "newReady": 0, "publishedBaseline": "133/326", "lockedResultObjects": 326, "normalizationRecordUses": 1933, "existingBaselineReportChecked": bool(report_path), "new326Calculation": False}


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--baseline-report", type=Path)
    args = parser.parse_args()
    print(json.dumps(verify(args.baseline_report), ensure_ascii=False))
