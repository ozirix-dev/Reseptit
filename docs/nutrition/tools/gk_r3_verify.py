"""Read-only R3 evidence verification. Run after the ordinary nutrition/GK audits.

No network, generated-file writes, active data mutations or publication decisions.
Python standard library; Decimal arithmetic is independent of the TS model.
"""
import argparse, collections, hashlib, json, pathlib, re, subprocess
from decimal import Decimal, ROUND_HALF_UP

def read(path):
    return json.loads(path.read_text(encoding="utf-8-sig"))

def sha(path):
    return hashlib.sha256(path.read_bytes().replace(b"\r\n", b"\n")).hexdigest()

def rounded(value):
    return float(Decimal(str(value)).quantize(Decimal(".01"), rounding=ROUND_HALF_UP))

def screen_risks(root):
    """Heuristic triage of only the 83 CALCULATED audit results; not source approval."""
    pilot = read(root / "tmp/nutrition/glycemic-load-pilot.json")
    inputs = {r["recipeId"]: r for r in read(root / "docs/nutrition/glycemic-load-pilot-input.json")["recipes"]}
    catalog = {r["id"]: r for r in read(root / "docs/nutrition/glycemic-index-records.json")["records"]}
    rows = []
    for r in pilot["results"]:
        if r["status"] != "CALCULATED":
            continue
        total = sum((i.get("availableCarbohydratePerServingG") or 0) for i in r["ingredients"])
        # Model's first field already includes the conservative upper bounds.
        # The second is a subset for disclosure, never an additional summand.
        omitted = r["omittedAvailableCarbohydratePerServingG"]
        flags, evidence = set(), []
        if r["confidence"] == "LOW": flags.add("LOW_CONFIDENCE")
        if omitted >= 1.5: flags.add("OMISSION_AT_LEAST_75_PERCENT_OF_2G_CAP")
        if total > 0 and omitted / total >= .5: flags.add("AT_LEAST_HALF_KNOWN_CHO_OMITTED")
        if r["glycemicLoadPerServing"] == 0 and omitted > 0: flags.add("DISPLAYED_ZERO_WITH_NONZERO_OMISSIONS")
        uncertain = 0
        for index, i in enumerate(r["ingredients"]):
            inp = inputs[r["recipeId"]]["ingredients"][index]
            assert inp["name"] == i["name"]
            g = catalog.get(i.get("giRecordId"), {})
            text = " ".join(str(g.get(k, "")) for k in ("id", "food", "preparation", "note"))
            category = bool(re.search(r"category.mean|food.group|group.mean|group.average", text, re.I))
            analog = i.get("matchKind") == "ANALOG" or g.get("matchKind") == "ANALOG"
            prep_key_mismatch = bool(g and inp.get("preparationKey") and g.get("preparationKey") and inp["preparationKey"] != g["preparationKey"])
            declared_mismatch = bool(g and re.search(r"not (?:an )?exact|not.*(?:preparation|cooking).*match|cooked.*analogue|cooked.*analog|preparation.*proxy", str(inp.get("giMatchEvidence", "")) + " " + text, re.I))
            cho = i.get("availableCarbohydratePerServingG") or 0
            uncertain_match = bool(g and (category or analog or i.get("confidence") == "LOW" or prep_key_mismatch or declared_mismatch))
            if category: flags.add("FOOD_CATEGORY_MEAN")
            if prep_key_mismatch or declared_mismatch: flags.add("PREPARATION_MATCH_FLAG")
            if uncertain_match:
                uncertain += cho
                if cho >= 5 or (cho >= 1 and total and cho / total >= .25): flags.add("MAJOR_CHO_WITH_UNCERTAIN_GI_MATCH")
            if category or analog or prep_key_mismatch or declared_mismatch or uncertain_match:
                evidence.append({"ingredient": i["name"], "availableCarbohydratePerServingG": rounded(cho), "giRecordId": i.get("giRecordId"), "matchKind": i.get("matchKind"), "categoryMean": category, "declaredOrKeyPreparationMismatch": prep_key_mismatch or declared_mismatch, "inputPreparationKey": inp.get("preparationKey"), "recordPreparationKey": g.get("preparationKey"), "giMatchEvidence": inp.get("giMatchEvidence"), "bindingRole": "NUMERICALLY_USED" if i.get("giContribution") is not None else "UNUSED_ZERO_CHO_METADATA" if cho == 0 else "BOUND_NOT_USED", "giContribution": i.get("giContribution")})
        weights = {"FOOD_CATEGORY_MEAN": 8, "PREPARATION_MATCH_FLAG": 8, "MAJOR_CHO_WITH_UNCERTAIN_GI_MATCH": 10, "OMISSION_AT_LEAST_75_PERCENT_OF_2G_CAP": 5, "AT_LEAST_HALF_KNOWN_CHO_OMITTED": 4, "DISPLAYED_ZERO_WITH_NONZERO_OMISSIONS": 4, "LOW_CONFIDENCE": 2}
        score = sum(weights[f] for f in flags)
        rows.append({"recipeId": r["recipeId"], "priorityScore": score, "flags": sorted(flags), "currentGk": r["glycemicLoadPerServing"], "confidence": r["confidence"], "knownAvailableCarbohydratePerServingG": rounded(total), "omittedCarbohydrateIncludingBoundsPerServingG": rounded(omitted), "omittedFractionOfKnownCarbohydrate": round(omitted / total, 4) if total else None, "uncertainMatchedCarbohydratePerServingG": rounded(uncertain), "ingredientFlags": evidence})
    rows.sort(key=lambda r: (-r["priorityScore"], -r["uncertainMatchedCarbohydratePerServingG"], -r["omittedCarbohydrateIncludingBoundsPerServingG"], r["recipeId"]))
    for rank, row in enumerate(rows, 1): row["rank"] = rank
    assert len(rows) == 83 and len({r["recipeId"] for r in rows}) == 83
    return {"schemaVersion": 1, "scope": "Automatic-only heuristic screen of existing83;R3.1 distinguishes storedGIid from numerical use;no83scientific approval", "limitations": "Regex/key/metadata flags may miss actual cooking mismatches or flag a disclosed analogue. No flag means no detected signal, not validated evidence. Omission fractions use known CHO only; bounds can overstate them. Scores are editorial priorities, not clinical risk probabilities.", "bindingInterpretation": "A storedGIid on sourceCHO0 is unused metadata,not a numericGI contribution. Targeted family findings are separate in gk-r3-1-targeted-screen.json.", "thresholds": {"largeOmissionG": 1.5, "largeOmissionShare": .5, "majorIngredientG": 5, "majorIngredientShareWithAtLeast1g": .25}, "flagCounts": dict(sorted(collections.Counter(f for r in rows for f in r["flags"]).items())), "recipes": rows}

def verify(root):
    folder = root / "docs/nutrition"
    manifest = read(folder / "gk-r3-verification-manifest.json")
    ledger = read(folder / "gk-r3-source-evidence.json")
    api = {r["id"]: r for r in ledger["afcd"]["originalResponses"]}
    for file, digest in manifest["unchangedSourceFiles"].items():
        assert sha(root / file) == digest, ("source changed", file)
    pilot = read(root / "tmp/nutrition/glycemic-load-pilot.json")
    assert pilot["summary"] == manifest["publicGkSummary"]
    assert hashlib.sha256(json.dumps(pilot["results"], ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode()).hexdigest() == manifest["publicGkResultsSha256"]
    for prefix, expected_tree in manifest.get("protectedContentTrees", {}).items():
        names = subprocess.check_output(["git", "-C", str(root), "ls-files", "-z", "--", prefix]).decode().split(chr(0))
        rows = [{"path": n, "sha256": sha(root / n)} for n in names if n]
        actual_tree = {"files": len(rows), "sha256": hashlib.sha256(json.dumps(rows, sort_keys=True, separators=(",", ":")).encode()).hexdigest()}
        assert actual_tree == expected_tree, ("protected recipe/translation/calculation tree changed", prefix)
    fineli = {r["source_id"]: r for r in read(folder / "fineli-release-20-reference.json")["foods"]}
    afcd = {r["source_id"]: r for r in read(folder / "afcd-release-3-reference.json")["foods"]}
    audit = {r["recipe_id"]: r for r in read(root / "tmp/nutrition/audit.json")["inventory"]}
    fk = ["available_carbohydrate_g_per_100g", "protein_g_per_100g", "fat_g_per_100g", "fibre_g_per_100g"]
    ak = ["available_carbohydrate_without_sugar_alcohols_g_per_100g", "protein_g_per_100g", "fat_g_per_100g", "fibre_g_per_100g"]
    keys = ["availableCarbohydrate", "protein", "fat", "fibre"]
    recipes = []
    for batch in range(1, 4):
        b = read(folder / f"gk-r3-batch-{batch}.json")
        assert len(b["recipes"]) == 8 and b["batch"] == batch
        for r in b["recipes"]:
            recipes.append(r)
            a = audit[r["recipeId"]]
            assert a["source_path"] == r["sourcePath"] and sha(root / r["sourcePath"]) == r["sourceSha256"]
            assert a["servings"] == r["servings"]
            assert a["ingredients"] == [i["recipeIngredient"] for i in r["ingredients"]], ("ingredient list", r["recipeId"])
            sums = {k: Decimal(0) for k in keys}
            for i in r["ingredients"]:
                if not i.get("composition"): continue
                comp = i["composition"]
                if comp["dataset"].endswith("fineli-release-20-reference.json"):
                    expected = dict(zip(keys, [fineli[comp["id"]]["per100g"][k] for k in fk]))
                elif comp["dataset"].endswith("afcd-release-3-reference.json"):
                    expected = dict(zip(keys, [afcd[comp["id"]][k] for k in ak]))
                    original = api[comp["id"]]
                    assert original["rawResponseSha256"] == comp["apiSha256"]
                    for k, nk in zip(keys, ["AVAILCHO", "PROT", "FAT", "AOACDFTOTW"]):
                        gravity = Decimal(str(original["specificGravity"] or 1))
                        tolerance = Decimal(".051") * (1 + gravity) if original["specificGravity"] else Decimal(".000001")
                        assert abs(Decimal(str(expected[k])) * gravity - Decimal(str(original["apiMacroExcerpt"][nk]))) <= tolerance
                else:
                    assert comp["id"] == "foodin-erythritol-200g-label-2026-10-24"
                    assert comp["declaredCarbohydrateG"] == comp["declaredPolyolsG"] == 100
                    expected = dict.fromkeys(keys, 0)
                assert expected == i["per100g"], ("primary composition", r["recipeId"], i["index"])
                if "mass" in i:
                    m, q = i["mass"], i["recipeIngredient"]
                    if m["status"] == "RECIPE_MASS":
                        assert Decimal(str(i["edibleMassG"])) == Decimal(str(q["amount"])) * (1000 if q["unit"] == "kg" else 1)
                    elif m["status"] == "FOOD_SPECIFIC_PORTION_ESTIMATE":
                        assert Decimal(str(i["edibleMassG"])) == Decimal(str(q["amount"])) * Decimal(str(m["sourceGramsPerUnit"]))
                        portion = re.search(r"Fineli Release 20 (\d+) foodaddunit (\w+)", m["source"])
                        if portion:
                            factor = {"ml": .01, "dl": 1, "l": 10}.get(q["unit"], 1)
                            assert abs(fineli[portion[1]]["portion_mass_g"][portion[2]] * factor - m["sourceGramsPerUnit"]) < 1e-10
                        elif "USDA SR Legacy2018" in m["source"]:
                            fdc = re.search(r"FDC(\d+)", m["source"])[1]
                            row_id = re.search(r"row(\d+)", m["source"])[1]
                            row = next(p for p in ledger["usda"]["selectedOriginalPortions"] if p["fdc_id"] == fdc and p["id"] == row_id)
                            assert q["unit"] == "tl" and row["modifier"] == "tsp" and row["amount"] == "1"
                            assert float(row["gram_weight"]) == m["sourceGramsPerUnit"]
                        elif "specific" in m["source"]:
                            assert q["unit"] == "ml" and api[comp["id"]]["specificGravity"] == m["sourceGramsPerUnit"]
                        elif comp["id"] == "F006250":
                            assert q["unit"] == "kpl" and m["sourceGramsPerUnit"] == 15
                            assert any(p["measurement"] == "Spring Onion, 15 g" and p["amount"] == 15 for p in api[comp["id"]]["measurements"])
                        else:
                            raise AssertionError(("unrecognized portion evidence", r["recipeId"], i["index"]))
                    elif m["status"] == "ZERO_MACRO":
                        assert all(v == 0 for v in expected.values())
                for k in keys:
                    sums[k] += Decimal(str(i["edibleMassG"])) * Decimal(str(expected[k])) / 100 / Decimal(str(r["servings"]))
                assert abs(float(Decimal(str(i["edibleMassG"])) * Decimal(str(expected[keys[0]])) / 100 / Decimal(str(r["servings"]))) - i["availableCarbohydrateContributionPerServingG"]) < 1e-10
            if r["independentScenarioPerServing"]:
                assert {k: rounded(v) for k, v in sums.items()} == r["independentScenarioPerServing"], ("independent sum", r["recipeId"])
                assert r["strictBaselinePerServing"]["availableCarbohydrate"] == a["recalculatedValues"]["carbs_net_per_serving_g"]
                for k, field in [("protein", "protein_per_serving_g"), ("fat", "fat_per_serving_g")]: assert r["strictBaselinePerServing"][k] == a["recalculatedValues"][field]
            else:
                assert rounded(sums[keys[0]]) == r["knownCarbohydrateSubtotalPerServingG"]
            whole = r["decision"] in ("VERIFIED_TOTAL", "ESTIMATED_TOTAL_WITH_EVIDENCE")
            assert whole == r["scenarioIsWholeEstimate"]
            assert r["wholeAvailableCarbohydratePerServingG"] == (rounded(sums[keys[0]]) if whole else None)
            if whole:
                assert all(i["mass"]["status"] in ("RECIPE_MASS", "FOOD_SPECIFIC_PORTION_ESTIMATE", "ZERO_MACRO") for i in r["ingredients"])
            assert not r["independentApproval"]
    assert len(recipes) == len({r["recipeId"] for r in recipes}) == 24
    counts = dict(collections.Counter(r["decision"] for r in recipes))
    assert counts == manifest["decisionCounts"]
    assert sum(r["r2Candidate"] for r in recipes) == 22
    assert sum(r["recipeId"] not in manifest["r2FollowupRecipeIds"] for r in recipes) == manifest["expectedNewDeepReviews"]
    register = read(folder / "gk-r3-carbohydrate-register.json")
    assert len(register["recipes"]) == 24 and register["counts"] == {"VERIFIED_TOTAL": 0, **counts}
    for record in register["recipes"]:
        recipe = next(r for r in recipes if r["recipeId"] == record["recipeId"])
        for k in ("decision", "servings", "wholeAvailableCarbohydratePerServingG", "independentScenarioPerServing", "deltaPerServing"):
            assert record[k] == recipe[k], ("register drift", record["recipeId"], k)
    matrix = read(folder / "gk-r3-nutrition-proposal-matrix.json")
    assert len(matrix["proposals"]) == 5
    assert sum(p["decision"] == "ESTIMATE_READY_FOR_INDEPENDENT_REVIEW" for p in matrix["proposals"]) == 2
    for proposal in matrix["proposals"]:
        recipe = next(r for r in recipes if r["recipeId"] == proposal["recipeId"])
        assert proposal["currentStrictPerServing"] == recipe["strictBaselinePerServing"]
        assert proposal["r2ProposedInputScenarioPerServing"] == recipe["independentScenarioPerServing"]
        assert proposal["deltaPerServing"] == recipe["deltaPerServing"]
    studies = read(folder / "gk-r3-gi-studies.json")
    assert len(studies["studies"]) == 8 and all(not s["applicable"] for s in studies["studies"])
    assert all(id in {r["recipeId"] for r in recipes} for s in studies["studies"] for id in s["recipeIds"])
    fixup = read(folder / "gk-r3-1-review.json")
    for file in fixup["r2Compatibility"]["nutritionAndCompositionFilesVerifiedIdentical"]:
        original = subprocess.check_output(["git", "-C", str(root), "show", manifest["r2Head"] + ":" + file])
        assert original.replace(b"\r\n", b"\n") == (root / file).read_bytes().replace(b"\r\n", b"\n"), ("R2 shared source/calculation mismatch", file)
    assert fixup["currentCounts"] == register["counts"]
    for id in manifest["reviewFixup"]["requiresRecipeTextCorrectionForB"]:
        r = next(r for r in recipes if r["recipeId"] == id)
        assert r["decision"] == "ESTIMATED_TOTAL_WITH_EVIDENCE"
        assert r["scenarioScope"]["requiresRecipeCorrection"] and not r["scenarioScope"]["currentRecipeTextResolved"]
        assert not r["scenarioScope"]["publicationReady"] and not r["scenarioScope"]["reviewIsApproval"]
    for item in fixup["densityComparisons"]:
        r = next(r for r in recipes if r["recipeId"] == item["recipeId"])
        coconut = next(i for i in r["ingredients"] if "kookosmaito" in i["recipeIngredient"]["item"])
        for option in item["densityOnlyComparisons"]:
            mass = Decimal(str(item["volumeMl"])) * Decimal(str(option["gramsPerMl"]))
            assert mass == Decimal(str(option["batchMassG"]))
            for key in keys:
                change = (mass - Decimal(str(coconut["edibleMassG"]))) * Decimal(str(coconut["per100g"][key])) / 100 / Decimal(str(r["servings"]))
                assert change == Decimal(str(option["deltaPerServingUnrounded"][key]))
                assert rounded(Decimal(str(item["originalUnroundedPerServing"][key])) + change) == option["scenarioPerServing"][key]
    assert screen_risks(root) == read(folder / "gk-r3-existing-83-risk-screen.json")
    # Omission classification is a substantive invariant, not a snapshot waiver.
    probe = next(r for r in recipes if r["recipeId"] == "tomaatti-kananmuna-wokki")
    rice = next(i for i in probe["ingredients"] if i.get("composition", {}).get("id") == "1370")
    assert rice["edibleMassG"] == rice["recipeIngredient"]["amount"] == 450
    assert all(r["wholeAvailableCarbohydratePerServingG"] is None for r in recipes if r["decision"] in ("PARTIAL_ONLY", "INSUFFICIENT_EVIDENCE"))
    print(json.dumps({"result": "PASS", "recipes": 24, "candidateRecipes": 22, "decisions": counts, "riskScreenRecipes": 83, "sourcePins": len(manifest["unchangedSourceFiles"]), "independentApproval": False, "unchangedGkResults": len(pilot["results"]), "protectedTrees": {p: t["files"] for p, t in manifest["protectedContentTrees"].items()}}, indent=2))

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=pathlib.Path, default=pathlib.Path(__file__).resolve().parents[3])
    args = parser.parse_args()
    verify(args.root.resolve())
