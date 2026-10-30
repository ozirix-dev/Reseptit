"""Read-only R2 screen. Inputs are freshly generated audits, not historical totals.

Run audits first; --output-dir must be disposable scratch (publish via repo_guard).
The flags describe machine evidence, never a scientific/publication approval.
"""
import argparse
import collections
import hashlib
import json
import pathlib
import re
import subprocess

def read(p):
    return json.loads(p.read_text(encoding="utf-8"))

def sha(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()

def classify(text):
    t = text.lower()
    if "recipe structure differs" in t:
        return "H"  # A fingerprint mismatch does not prove an obsolete recipe version.
    if "differ from the last gl review" in t:
        return "G"
    if "food/preparation match" in t or "not a valid match" in t or "not applicable" in t:
        return "F"
    if "gi" in t and any(s in t for s in ["missing", "withdrawn", "reference_only", "reference-only", "no sufficiently", "no preparation", "no gi binding", "no suitable", "does not measure", "not establish"]):
        return "E"
    if any(s in t for s in ["different liquids", "product type", "selected liquid", "sweetener type", "variant"]):
        return "C"
    if "mass conversion" in t or "unit or decimal" in t:
        return "I"
    if any(s in t for s in ["mass is missing", "quantity", "quantities", "unweighed", "no verified mass", "unresolved amount", "unspecified amount"]):
        return "A"
    if any(s in t for s in ["food record", "composition is unresolved", "no source-matched composition", "no specific fineli", "composition match"]):
        return "B"
    if any(s in t for s in ["retained", "strained", "preparation state"]):
        return "D"
    if any(s in t for s in ["carbohydrate", "omitted", "ceiling"]):
        return "J"
    return "L"

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", type=pathlib.Path, required=True)
    ap.add_argument("--output-dir", type=pathlib.Path, required=True)
    args = ap.parse_args()
    root = args.root.resolve()
    out = args.output_dir.resolve()
    if out == root or root in out.parents:
        raise SystemExit("Write to disposable scratch, then publish with repo_guard.")
    g = read(root / "tmp/nutrition/glycemic-load-pilot.json")
    n = read(root / "tmp/nutrition/audit.json")
    foods = {r["id"]: r for r in read(root / "docs/nutrition/food-records.json")}
    gis = {r["id"]: r for r in read(root / "docs/nutrition/glycemic-index-records.json")["records"]}
    ni = {r["recipe_id"]: r for r in n["inventory"]}
    gi = {r["recipeId"]: r for r in g["results"]}
    inputs = {r["recipeId"]: r for r in g["calculationInputs"]}
    if len(ni) != n["sources"] or len(gi) != len(g["results"]) or set(ni) != set(gi) or set(ni) != set(inputs):
        raise SystemExit("STOP: duplicate/missing/unexpected published recipe IDs")
    if len(ni) != 326 or g["summary"] != {"recipes": 326, "calculated": 83, "insufficientSourceData": 243}:
        raise SystemExit("STOP: R2 baseline is no longer 326/83/243")
    historical = {}
    review_path = root / "docs/nutrition/glycemic-load-r1b-review.md"
    for line in review_path.read_text(encoding="utf-8").splitlines():
        cells = [v.strip() for v in line.split("|")]
        if len(cells) == 5 and cells[1] in ni and re.fullmatch(r"[GMCU/]+", cells[2]):
            historical[cells[1]] = {"categories": cells[2], "finding": cells[3]}
    if len(historical) != 38:
        raise SystemExit("STOP: R1B structural list does not have 38 unique recipes")
    rows = []
    for rid in sorted(ni):
        a, r, inp = ni[rid], gi[rid], inputs[rid]
        text = (root / a["source_path"]).read_text(encoding="utf-8")
        title_match = re.search(r"^title:\s*(.+)$", text, re.M)
        issues = [{"class": classify(b), "evidence": b, "basis": "current-model-blocker"} for b in r["blockers"]]
        if rid in historical:
            issues.append({"class": "H", "evidence": historical[rid]["finding"], "basis": "R1B documented difference; still present in locked main; not inferred from hash alone"})
        # Explicitly retain conservative bounds as bounds, never as exact CHO.
        unknown = [i["name"] for i in r["ingredients"] if i.get("availableCarbohydratePerServingG") is None]
        partial = sum(i.get("availableCarbohydratePerServingG") or 0 for i in r["ingredients"])
        bounds = [i["name"] for i in r["ingredients"] if i.get("availableCarbohydrateUpperBoundPerServingG") is not None]
        missing_mass = [i["name"] for i in r["ingredients"] if i.get("grams") is None and i.get("availableCarbohydratePerServingG") != 0]
        broad = [i["name"] for i in r["ingredients"] if i.get("giRecordId") and gis.get(i["giRecordId"], {}).get("matchKind") == "CATEGORY_MEAN"]
        withdrawn = [i["name"] for i in r["ingredients"] if any(s in " ".join(i.get("issues", [])).lower() for s in ["withdrawn", "reference_only", "reference-only", "not a valid match"])]
        active_rejected = [i["name"] for i in r["ingredients"] if i.get("giRecordId") in ["dairy-category-mean-gi-35", "fruit-category-mean-gi-51"]]
        if active_rejected:
            issues.append({"class": "F", "evidence": "Active dairy/fruit category mean requires individual source review: " + ", ".join(active_rejected), "basis": "R0/R1A source-risk screen; not a new publication decision"})
        if len(inp["ingredients"]) != len(a["ingredients"]) and rid not in historical:
            issues.append({"class": "H", "evidence": f"Ingredient row count differs: recipe {len(a['ingredients'])}, GL {len(inp['ingredients'])}; grouping/omissions require review", "basis": "machine screen, mismatch cause not established"})
        cats = sorted(set(i["class"] for i in issues))
        incomplete = r["status"] != "CALCULATED"
        # K indicates independently observed categories, not several rows of E.
        primary = ("K" if len(cats) > 1 else (cats[0] if cats else "L")) if incomplete else None
        estimate = a["status"] == "ESTIMATE WITH EVIDENCE"
        source_refs = sorted(set(foods[i["fineliRecordId"]]["sourceUrl"] for i in inp["ingredients"] if i.get("fineliRecordId") in foods))
        calcpath = a["calculationEvidence"]
        calc = read(root / calcpath) if calcpath else None
        assumptions = []
        if calc:
            for item in calc["ingredients"]:
                if item.get("excluded") or item.get("omission") or item.get("excludedReason") or item.get("amount") is None:
                    assumptions.append({"item": item["item"], "reason": item.get("excludedReason") or "unquantified/excluded row; inspect calculation"})
        rows.append({
            "recipeId": rid, "title": title_match.group(1).strip('"\'') if title_match else None,
            "sourcePath": a["source_path"], "sourceContentSha256": a["source_content_hash"],
            "recipeBindingSha256": g["sourceHashes"][rid], "calculationInputSha256": g["calculationInputHashes"][rid], "calculationEvidenceSha256": g["calculationEvidenceHashes"][rid],
            "gkStatus": r["status"], "gkPerServing": r["glycemicLoadPerServing"], "gkConfidence": r["confidence"], "servings": a["servings"],
            "publishedAvailableCarbohydratePerServingG": a["values"]["carbs_net_per_serving_g"],
            "strictNutritionAuditStatus": a["status"], "strictAuditErrors": a["evidenceErrors"],
            "recalculatedNutritionValues": a["recalculatedValues"], "calculationPath": calcpath,
            "knownGlCarbohydrateSubtotalPerServingG": round(partial, 8), "subtotalIsWholeRecipe": False,
            "missingCarbohydrateRows": unknown, "boundedNotExactRows": bounds,
            "wholeCarbohydrateSourced": "NOT_ESTABLISHED" if unknown or not estimate else "NEEDS_SOURCE_REVIEW",
            "ingredientBindingCompleteness": "DIFFERENCE_REQUIRES_REVIEW" if "H" in cats or "G" in cats else "NO_MACHINE_DIFFERENCE_FOUND_NOT_SEMANTIC_APPROVAL",
            "allEssentialAmountsKnown": "NO" if missing_mass else "NOT_INDEPENDENTLY_VERIFIED",
            "missingMassRows": missing_mass, "unitConversionsVerified": "NOT_INDEPENDENTLY_VERIFIED",
            "foodCompositionMatch": "UNRESOLVED" if "B" in cats or "C" in cats else "NOT_INDEPENDENTLY_VERIFIED",
            "giFoodFamilyMatch": "REQUIRES_REVIEW" if broad or "F" in cats else "NOT_INDEPENDENTLY_VERIFIED",
            "giPreparationMatch": "NOT_INDEPENDENTLY_VERIFIED",
            "missingGiMaterial": True if "E" in cats else None,
            "activeCategoryMeanRows": broad, "activePreviouslyQuestionedDairyFruitRows": active_rejected,
            "withdrawnOrRejectedGiNotes": withdrawn,
            "primaryBlockerClass": primary, "secondaryBlockerClass": cats[1] if len(cats) > 1 else None,
            "underlyingBlockerClasses": cats, "issues": issues,
            "sourceCorrectionSolvesAll": "NOT_ESTABLISHED", "solvableWithoutRecipeChange": "NOT_ESTABLISHED",
            "potentialCarbohydrateOnlyCandidate": incomplete and estimate,
            "potentialLaterGkCandidate": "NEEDS_SOURCE_REVIEW" if incomplete else "EXISTING_LEGACY_VALUE",
            "carbohydrateEvidenceClass": "C" if unknown else "D",
            "carbohydrateClassReason": "C: partial GL sum only; D: no independently verified whole total. Strict-audit estimates are screening evidence, not R2 source approval.",
            "nutritionOmissionRows": assumptions, "sourceUrls": source_refs,
            "r1bStructuralFinding": historical.get(rid),
            "repairabilityScreen": "GI_RESEARCH_AND_OTHER_REVIEW" if any(c in cats for c in ["E", "F"]) else "NON_GI_REVIEW_CANDIDATE_UNCONFIRMED",
        })
    incomplete_rows = [r for r in rows if r["gkStatus"] != "CALCULATED"]
    summary = {"recipes": len(rows), "calculated": 83, "incomplete": len(incomplete_rows), "giRecords": len(gis),
        "primaryBlockerCounts": {k: sum(r["primaryBlockerClass"] == k for r in incomplete_rows) for k in "ABCDEFGHIJKL"},
        "overlappingBlockerCounts": {k: sum(k in r["underlyingBlockerClasses"] for r in incomplete_rows) for k in "ABCDEFGHIJL"},
        "strictNutritionAuditCounts": n["counts"], "preliminaryCarbohydrateOnlyCandidates": sum(r["potentialCarbohydrateOnlyCandidate"] for r in rows),
        "nonGiReviewCandidatesUnconfirmed": sum(r["repairabilityScreen"] == "NON_GI_REVIEW_CANDIDATE_UNCONFIRMED" for r in incomplete_rows),
        "giResearchOrSourceReviewCandidates": sum(r["repairabilityScreen"] == "GI_RESEARCH_AND_OTHER_REVIEW" for r in incomplete_rows),
        "verifiedSolvableByQuantityOrRecordOnly": 0, "verifiedNewGkProposals": 0,
        "unresolvedWithCurrentEvidence": len(incomplete_rows), "historicalR1bStructuralRows": len(historical)}
    out.mkdir(parents=True, exist_ok=True)
    inventory = {"schemaVersion": 1, "asOf": "2026-10-30 Europe/Helsinki", "repository": "ozirix-dev/Reseptit",
        "baselineCommit": "e8da2c9417e2aeff55a85d599b3b7e1ad465f36c",
        "generatedFromHead": subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=root, text=True).strip(),
        "scope": "Automatic screening of every current published Finnish recipe; not source validation or publication approval.",
        "classificationPolicy": "Every current model blocker retained; K for multiple observed categories. R1B differences retained separately. Missing knowledge is explicit; unknown contribution is not zero; the subtotal sums known rows only.",
        "summary": summary, "recipes": rows}
    (out / "gk-r2-inventory.json").write_text(json.dumps(inventory, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(summary, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    main()
