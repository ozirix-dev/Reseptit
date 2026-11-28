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
    require(set(manifest["lfSha256"]) == {"README.md", "source-classifications.json", "verify.py", "historical-input-impact.json"}, "manifest file set")
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
    impact = load(HERE / "historical-input-impact.json")
    require(impact["status"] == "AUDIT_HISTORICAL_INPUT_ONLY_NOT_RUNTIME_APPROVAL", "impact status")
    require(impact["registryGitBlob"] == data["registry"]["gitBlob"], "impact registry pin")
    require(impact["sourceClassificationsGitBlob"] == git_blob(read_lf(HERE / "source-classifications.json")), "impact source card pin")
    inputs = read_lf(ROOT / impact["inputPath"])
    require(git_blob(inputs) == impact["inputGitBlob"], "historical input blob")
    recipes = json.loads(inputs)["recipes"]
    require(len(recipes) == len({r["recipeId"] for r in recipes}) == 326, "unique input recipes")
    expected = {source["id"]: [] for source in rows}
    for recipe in recipes:
        for index, ingredient in enumerate(recipe["ingredients"]):
            source_id = ingredient.get("giRecordId")
            if source_id in expected:
                expected[source_id].append({"recipeId": recipe["recipeId"], "ingredientIndex": index, "foodKey": ingredient.get("foodKey"), "preparationKey": ingredient.get("preparationKey")})
    require(len(impact["sources"]) == len({s["id"] for s in impact["sources"]}) == 45, "45 impact cards")
    require({s["id"] for s in impact["sources"]} == set(expected), "impact membership")
    for source in impact["sources"]:
        refs = expected[source["id"]]
        require(source["references"] == refs, "exact references " + source["id"])
        require(source["ingredientRowCount"] == len(refs) and source["recipeCount"] == len({r["recipeId"] for r in refs}), "counts " + source["id"])
    all_refs = [r for refs in expected.values() for r in refs]
    require(impact["summary"] == {"inputRecipes": 326, "sourceCards": 45, "referencedSourceCards": 32, "unreferencedSourceCards": 13, "uniqueRecipeIds": 262, "ingredientRows": 576}, "impact summary")
    require(len(all_refs) == 576 and len({r["recipeId"] for r in all_refs}) == 262 and sum(bool(v) for v in expected.values()) == 32, "recounted impact")
    tomato = impact["tomatoReview"]
    require(tomato["runtimeChangeAuthorized"] is False and tomato["currentCanonicalCaptureRequired"] is True, "tomato HOLD")
    require(tomato["sourceId"] == "tomato-raw-cooked-sauce-analogue-gi-22", "tomato source")
    counts = {"HEAT_TREATMENT_REPORTED": 0, "NO_ACTUAL_COOKING_REPORTED": 0, "AMBIGUOUS_REPORTED": 0, "COOKED_IN_SAUCE_INPUT_KEY": 0, "MISSING_PREPARATION_INPUT_KEY": 0}
    projected = []
    for row in tomato["references"]:
        require(row["newBindingAuthorized"] is False and row["reviewGroup"] in counts, "no tomato approval")
        group = row["reviewGroup"]
        counts[group] += 1
        key = "cooked-in-sauce" if group == "COOKED_IN_SAUCE_INPUT_KEY" else None if group == "MISSING_PREPARATION_INPUT_KEY" else "whole-raw"
        require(row["preparationKey"] == key, "tomato key")
        projected.append({k: v for k, v in row.items() if k not in {"reviewGroup", "newBindingAuthorized"}})
    require(projected == expected[tomato["sourceId"]], "39 exact tomato rows")
    require(counts == tomato["groups"] == {"HEAT_TREATMENT_REPORTED": 20, "NO_ACTUAL_COOKING_REPORTED": 10, "AMBIGUOUS_REPORTED": 1, "COOKED_IN_SAUCE_INPUT_KEY": 3, "MISSING_PREPARATION_INPUT_KEY": 5}, "tomato groups")
    print("PASS: sealed sidecar, pinned registry and prior artifacts; 45/45 rows, 576 exact references, no new use")

if __name__ == "__main__":
    verify()
