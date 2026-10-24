"""Reproduce evidence-backed nutrition for the four remaining recipes."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FINELI = {str(x["source_id"]): x for x in json.loads((ROOT / "docs/nutrition/fineli-release-20-reference.json").read_text(encoding="utf-8"))["foods"]}
AFCD = {x["source_id"]: x for x in json.loads((ROOT / "docs/nutrition/afcd-release-3-reference.json").read_text(encoding="utf-8"))["foods"]}


def f(food_id, grams):
    record = FINELI[str(food_id)]
    source = record["per100g"]
    values = [source[key] for key in (
        "available_carbohydrate_g_per_100g", "fibre_g_per_100g",
        "polyols_g_per_100g", "protein_g_per_100g", "fat_g_per_100g",
    )]
    if any(value is None for value in values):
        raise ValueError(f"Fineli #{food_id} has an unreported required component: {values}")
    return {"record": f"Fineli #{food_id} {record['name']}", "grams": grams, "values": values}


def a(food_id, grams):
    record = AFCD[food_id]
    available = record["available_carbohydrate_without_sugar_alcohols_g_per_100g"]
    polyols = record["available_carbohydrate_with_sugar_alcohols_g_per_100g"] - available
    values = [available, record["fibre_g_per_100g"], polyols,
              record["protein_g_per_100g"], record["fat_g_per_100g"]]
    if any(value is None for value in values):
        raise ValueError(f"AFCD {food_id} has an unreported required component: {values}")
    return {"record": f"AFCD {food_id} {record['name']}", "grams": grams, "values": values}


def result(recipe_id, servings, ingredients, omitted_minor=None):
    omitted_minor = omitted_minor or []
    omitted_g_per_serving = sum(grams for _, grams in omitted_minor) / servings
    if omitted_g_per_serving > 1:
        raise ValueError(f"{recipe_id} omitted mass exceeds the 1 g/serving bound")
    totals = [sum(row["grams"] * row["values"][i] / 100 for row in ingredients) for i in range(5)]
    net, fibre, polyols, protein, fat = totals
    return {
        "recipe": recipe_id,
        "servings": servings,
        "ingredients": [{"record": row["record"], "grams": row["grams"]} for row in ingredients],
        "omittedMinor": [{"ingredient": name, "gramsPerRecipe": grams} for name, grams in omitted_minor],
        "omittedUpperBound_g_per_serving": round(omitted_g_per_serving, 3),
        "totals": dict(zip(("net", "fibre", "polyols", "protein", "fat"), totals)),
        "perServing": {
            "carbs_net_per_serving_g": round(net / servings, 2),
            "carbs_total_per_serving_g": round((net + fibre + polyols) / servings, 2),
            "protein_per_serving_g": round(protein / servings, 2),
            "fat_per_serving_g": round(fat / servings, 2),
        },
    }


recipes = [
    result("italian-pata", 4, [
        f(11562, 500), f(398, 200), f(389, 400), f(386, 120),
        a("F004193", 3.5), f(29239, 150), f(536, 12),
    ], [("kuivattu oregano", 2), ("mustapippuri", 1)]),
    result("jauheliha-makaronilaatikko", 8, [
        f(117, 400), f(712, 600), f(335, 70), f(541, 13.5),
        f(649, 500), f(858, 330), f(675, 200), f(29065, 200), f(642, 300),
    ], [("valkosipulijauhe", 3), ("mustapippuri", 1), ("paprikajauhe", 2)]),
    result("kermainen-lohipata", 4, [
        f(34255, 600), f(335, 70), a("F004193", 7), f(11571, 200),
        f(631, 200), f(500, 14), f(11557, 5), f(28, 5), f(33456, 150),
    ], [("kuivattu tilli", 1), ("mustapippuri", 1)]),
    result("keto-kauralesesampylat", 8, [
        f(858, 165), f(649, 200), a("F006077", 60), f(170, 25),
        f(31681, 20), f(631, 50), f(500, 30), a("F000247", 10),
        f(30, 3), f(385, 8),
    ]),
]

print(json.dumps({"recipes": recipes}, ensure_ascii=False, indent=2))
