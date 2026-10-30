"""Read-only Decimal verification of the eight-recipe product-binding research batch."""
from decimal import Decimal, getcontext
import hashlib
import json
from pathlib import Path

getcontext().prec = 40
ROOT = Path(__file__).resolve().parents[2]
FOLDER = ROOT / "docs/nutrition/gk80/broth-sauce-1"
D = Decimal
KEYS = ("carbohydrate", "protein", "fat", "fibre")


def canonical(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def fingerprint(value):
    return hashlib.sha256(canonical(value).encode()).hexdigest()


def number(value):
    return None if value is None else format(value.quantize(D("0.000000000001")).normalize(), "f")


def checked_hash(record):
    payload = {key: value for key, value in record.items() if key != "evidenceHash"}
    if fingerprint(payload) != record["evidenceHash"]:
        raise ValueError("STALE_EVIDENCE")


def contribution(product, binding, servings):
    # Never reinterpret ml as g. An explicit weighed recipe is a different scenario.
    if product["nutritionBasis"] != {"amount": "100", "unit": binding["unit"]}:
        raise ValueError("UNIT_BASIS_MISMATCH")
    amount, fraction, portions = D(binding["amount"]), D(binding["consumedFraction"]), D(servings)
    if not all(value.is_finite() for value in (amount, fraction, portions)):
        raise ValueError("INVALID_QUANTITY")
    if amount <= 0 or portions <= 0 or not 0 <= fraction <= 1:
        raise ValueError("INVALID_QUANTITY")
    factor = amount * fraction / 100 / portions
    result = {}
    for key in KEYS:
        value = product["declaredPer100"][key]
        if value is None:
            result[key] = None  # Unreported fibre is not zero.
        else:
            value = D(value)
            if not value.is_finite() or value < 0:
                raise ValueError("INVALID_NUTRIENT")
            result[key] = value * factor  # EU label carbohydrate: do not subtract fibre.
    return result


def verify():
    read = lambda name: json.loads((FOLDER / name).read_text(encoding="utf-8"))
    products = read("products.json")["records"]
    recipes = read("recipes.json")["recipes"]
    saved = {r["recipeId"]: r for r in read("results.json")["results"]}
    old = {r["recipeId"]: r for r in json.loads((ROOT / "docs/nutrition/gk80/run-2/recipes.json").read_text(encoding="utf-8"))["recipes"]}
    product_map = {p["id"]: p for p in products}
    assert len(products) == len(product_map) == 4
    assert len(recipes) == len(saved) == len({r["recipeId"] for r in recipes}) == 8
    for p in products:
        checked_hash(p)
        assert p["gi"] is None
        assert p["availableCarbohydrateExcludingPolyolsPer100"] is None
        assert p["carbohydrateDefinition"] == "EU_LABEL_CARBOHYDRATE_EXCLUDES_FIBRE_INCLUDES_ANY_POLYOLS"
    for source in read("provenance.json")["localFiles"]:
        text = (ROOT / source["path"]).read_text(encoding="utf-8").replace("\r\n", "\n")
        assert hashlib.sha256(text.encode()).hexdigest() == source["sha256"], source["path"]
    bindings = 0
    for r in recipes:
        checked_hash(r)
        e = saved[r["recipeId"]]
        assert e["inputHash"] == r["evidenceHash"]
        original = old[r["recipeId"]]
        assert r["sourceSha256"] == original["sourceSha256"]
        assert D(r["servings"]) == D(original["servings"])
        totals = {k: D(0) for k in KEYS}
        prior = D(0)
        indices = []
        for b in r["productBindings"]:
            bindings += 1
            indices.append(b["ingredientIndex"])
            p = product_map[b["productId"]]
            assert p["evidenceHash"] == b["productEvidenceHash"]
            assert b["consumedFractionEvidence"] == "EXPLICIT_PROPOSED_ALL_CONSUMED_SCENARIO_NOT_MEASURED"
            assert b["consumedFraction"] == "1"
            ingredient = next(i for i in original["scenarios"][0]["ingredients"] if i["index"] == b["ingredientIndex"])
            assert fingerprint(ingredient) == b["previousResearchIngredientHash"]
            old_c = None if ingredient["massG"] is None or ingredient["per100g"] is None else D(str(ingredient["massG"])) * D(str(ingredient["retention"])) * D(str(ingredient["per100g"]["availableCarbohydrate"])) / 100 / D(r["servings"])
            assert number(old_c) == b["previousResearchCarbohydratePerServing"]
            prior = None if prior is None or old_c is None else prior + old_c
            values = contribution(p, b, r["servings"])
            for k in KEYS:
                totals[k] = None if totals[k] is None or values[k] is None else totals[k] + values[k]
        assert len(indices) == len(set(indices))
        assert {k: number(v) for k, v in totals.items()} == e["productLabelContributionPerServing"]
        c = totals["carbohydrate"]
        assert number(prior) == e["previousResearchTargetCarbohydratePerServing"]
        assert number(c - prior if prior is not None else None) == e["nominalLabelMinusPriorAvailableCarbohydrate"]
        assert number(c / 100) == e["unknownGkCoefficient"]
        for gi in (50, 100, 150):
            assert number(c * D(gi) / 100) == e["diagnosticOnly"][f"hypotheticalGi{gi}"]
        assert number(100 / c) == e["diagnosticOnly"]["labelBasedGiForOneGk"]
        assert e["diagnosticOnly"]["usesDeclaredCarbohydrateAsIfAllGlycaemic"] is True
        assert e["diagnosticOnly"]["isMeasuredOrSourceBound"] is False
        assert e["diagnosticOnly"]["coverageEligible"] is False
        assert r["wholeRecipeGk"] is None and e["wholeRecipeGk"] is None
        assert r["numericGkProposal"] is False and e["numericGkProposal"] is False
    assert bindings == 9
    metrics = read("metrics.json")
    assert metrics["newNumericGkProposals"] == metrics["newApproved"] == metrics["newPublished"] == 0
    assert metrics["productionBefore"] == metrics["productionAfter"] == 83
    return {"status": "PASS", "products": len(products), "recipes": len(recipes), "ingredientBindings": bindings,
            "numericGkProposals": 0, "precision": getcontext().prec, "readOnly": True}


if __name__ == "__main__":
    print(json.dumps(verify()))
