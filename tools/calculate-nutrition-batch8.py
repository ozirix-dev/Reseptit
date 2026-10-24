"""Reproduce source-backed values for Thai nutrition batch B."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FINELI = {str(x["source_id"]): x for x in json.loads((ROOT / "docs/nutrition/fineli-release-20-reference.json").read_text(encoding="utf-8"))["foods"]}
AFCD = {x["source_id"]: x for x in json.loads((ROOT / "docs/nutrition/afcd-release-3-reference.json").read_text(encoding="utf-8"))["foods"]}
PRODUCTS = {x["id"]: x for x in json.loads((ROOT / "docs/nutrition/food-records.json").read_text(encoding="utf-8"))}


def row(name, grams, carb, fibre, polyols, protein, fat):
    values = (carb, fibre, polyols, protein, fat)
    if any(value is None for value in values):
        raise ValueError(f"{name} has an unreported nutrient")
    return (name, grams, *values)


def f(food_id, grams):
    food = FINELI[str(food_id)]
    values = food["per100g"]
    return row(
        f"Fineli #{food_id} {food['name']}", grams,
        values["available_carbohydrate_g_per_100g"],
        values["fibre_g_per_100g"], values["polyols_g_per_100g"],
        values["protein_g_per_100g"], values["fat_g_per_100g"],
    )


def a(food_id, grams):
    food = AFCD[food_id]
    carb = food["available_carbohydrate_without_sugar_alcohols_g_per_100g"]
    with_polyols = food["available_carbohydrate_with_sugar_alcohols_g_per_100g"]
    polyols = None if carb is None or with_polyols is None else with_polyols - carb
    return row(
        f"AFCD {food_id} {food['name']}", grams, carb,
        food["fibre_g_per_100g"], polyols,
        food["protein_g_per_100g"], food["fat_g_per_100g"],
    )


def p(record_id, grams):
    food = PRODUCTS[record_id]
    values = food["per100g"]
    # EU label total carbohydrates can include declared polyols. Normalize
    # those to available carbohydrate before aggregate totals add the sourced
    # polyol mass back as a separate component.
    carb = values["carbohydrate"]
    if food["carbohydrateDefinition"] == "EU_TOTAL_INCLUDING_POLYOLS":
        if carb is None or values["polyols"] is None or values["polyols"] > carb:
            raise ValueError(f"{record_id} has invalid EU total carbohydrate/polyol data")
        carb -= values["polyols"]
    return row(
        f"{food['name']} ({record_id})", grams,
        carb, values["fibre"], values["polyols"],
        values["protein"], values["fat"],
    )


def result(recipe_id, rows, servings=4):
    totals = [sum(item[1] * item[i] / 100 for item in rows) for i in range(2, 7)]
    net, fibre, polyols, protein, fat = totals
    return {
        "recipe": recipe_id,
        "servings": servings,
        "ingredients": [{"record": item[0], "grams": item[1]} for item in rows],
        "totals": dict(zip(("net", "fibre", "polyols", "protein", "fat"), totals)),
        "perServing": {
            "carbs_net_per_serving_g": round(net / servings, 2),
            "carbs_total_per_serving_g": round((net + fibre + polyols) / servings, 2),
            "protein_per_serving_g": round(protein / servings, 2),
            "fat_per_serving_g": round(fat / servings, 2),
        },
    }


FISH = "off-13692210-squid-brand-fish-sauce-2026-10-24"
ERY = "foodin-erythritol-200g-label-2026-10-24"
NOODLE = "koro-konjac-noodles-prepared-2026-10-24"
RED = "mae-ploy-red-curry-paste-2026-10-24"
PANANG = "mae-ploy-panang-curry-paste-2026-10-24"
GREEN = "mae-ploy-green-curry-paste-2026-10-24"

recipes = [
    result("moo-ping-vhh", [a("F007089", 700), a("F002991", 100), p(FISH, 30), f(31, 15), a("F004193", 7), a("F003192", 6), p(ERY, 4), a("F006159", 13.5), f(346, 200), a("F005198", 60)]),
    result("pad-kee-mao-vhh-konjac", [p(NOODLE, 600), a("F002806", 500), a("F000431", 150), a("F002247", 120), a("F000396", 30), a("F004193", 10.5), a("F002901", 24), p(FISH, 30), f(31, 15), a("F008026", 15), p(ERY, 4), a("F006159", 27)]),
    result("pad-kra-pao-vhh", [a("F007057", 600), f(322, 600), f(858, 220), a("F000396", 30), a("F004193", 10.5), a("F002901", 24), p(FISH, 30), f(31, 15), p(ERY, 4), a("F006159", 27)]),
    result("pad-see-ew-vhh-konjac", [p(NOODLE, 600), a("F002594", 500), f(324, 300), f(858, 165), a("F006159", 27), f(31, 30), f(31, 15), a("F008026", 15), p(ERY, 4), a("F004193", 7)]),
    result("pad-thai-vhh-konjac", [p(NOODLE, 400), a("F007433", 400), f(858, 165), a("F009176", 150), a("F008806", 150), a("F009081", 30), p(FISH, 30), a("F004729", 15), p(ERY, 4), f(378, 30), a("F006159", 27), a("F003192", 12), a("F005198", 60)]),
    result("panang-curry-kanalla-vhh", [a("F002806", 600), a("F002991", 400), p(PANANG, 30), a("F000431", 150), f(378, 30), p(FISH, 15), p(ERY, 4), a("F000396", 20), f(322, 500)]),
    result("punainen-kanacurry-vhh", [a("F002806", 600), a("F002991", 400), p(RED, 30), a("F000253", 200), a("F002247", 120), p(FISH, 15), p(ERY, 4), f(552, 10), a("F000396", 20), f(322, 600)]),
    result("thai-vihrea-curry-kanalla-vhh", [a("F002806", 600), a("F002991", 400), p(GREEN, 30), f(389, 200), a("F003761", 150), f(322, 600), p(FISH, 30), p(ERY, 4), a("F000396", 20), a("F006159", 13.5)]),
    result("tom-kha-gai-vhh", [a("F002806", 600), a("F002991", 400), f(30315, 500), a("F005946", 200), a("F004213", 30), p(FISH, 30), a("F004729", 45), p(ERY, 4), a("F002901", 12), a("F003192", 12)]),
    result("tom-yum-goong-vhh", [a("F007433", 500), a("F005946", 200), f(29010, 22), a("F004213", 25), a("F002901", 24), p(FISH, 30), a("F004729", 45), f(352, 150), a("F003192", 12)]),
]

print(json.dumps({"recipes": recipes}, ensure_ascii=False, indent=2))
