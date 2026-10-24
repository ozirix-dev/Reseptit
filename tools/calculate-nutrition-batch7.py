"""Reproduce ingredient-based values for Thai batch A, excluding water and trace spices."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FINELI = {str(x["source_id"]): x for x in json.loads((ROOT / "docs/nutrition/fineli-release-20-reference.json").read_text(encoding="utf-8"))["foods"]}
AFCD = {x["source_id"]: x for x in json.loads((ROOT / "docs/nutrition/afcd-release-3-reference.json").read_text(encoding="utf-8"))["foods"]}
OFF = {x["id"]: x for x in json.loads((ROOT / "docs/nutrition/food-records.json").read_text(encoding="utf-8"))}

def f(food_id, grams):
    x = FINELI[str(food_id)]["per100g"]
    vals = [x[k] for k in ("available_carbohydrate_g_per_100g", "fibre_g_per_100g", "polyols_g_per_100g", "protein_g_per_100g", "fat_g_per_100g")]
    # Fineli's shrimp record leaves fibre and polyols unreported; these are not
    # present in plain animal flesh. Keep this narrowly scoped and documented.
    if str(food_id) == "835":
        vals[1:3] = [0, 0]
    if any(v is None for v in vals):
        raise ValueError(f"Fineli #{food_id} contains an unreported nutrient")
    return (f"Fineli #{food_id} {FINELI[str(food_id)]['name']}", grams, *vals)

def a(food_id, grams):
    x = AFCD[food_id]
    carb = x["available_carbohydrate_without_sugar_alcohols_g_per_100g"]
    fibre = x["fibre_g_per_100g"]
    polyols = x["available_carbohydrate_with_sugar_alcohols_g_per_100g"] - carb
    vals = [carb, fibre, polyols, x["protein_g_per_100g"], x["fat_g_per_100g"]]
    if any(v is None for v in vals):
        raise ValueError(f"AFCD {food_id} contains an unreported nutrient")
    return (f"AFCD {food_id} {x['name']}", grams, *vals)

def product(record_id, grams):
    record = OFF[record_id]
    x = record["per100g"]
    carbohydrate = x["carbohydrate"]
    if record["carbohydrateDefinition"] == "EU_TOTAL_INCLUDING_POLYOLS":
        if carbohydrate is None or x["polyols"] is None or x["polyols"] > carbohydrate:
            raise ValueError(f"Product record {record_id} has invalid carbohydrate/polyol data")
        carbohydrate -= x["polyols"]
    vals = [carbohydrate, x["fibre"], x["polyols"], x["protein"], x["fat"]]
    if any(v is None for v in vals):
        raise ValueError(f"Product record {record_id} contains an unreported nutrient")
    return (f"{OFF[record_id]['name']} ({OFF[record_id]['id']})", grams, *vals)

def result(recipe_id, rows, servings=4):
    totals = [sum(row[1] * row[i] / 100 for row in rows) for i in range(2, 7)]
    net, fibre, polyols, protein, fat = totals
    return {"recipe": recipe_id, "servings": servings,
            "ingredients": [{"record": r[0], "grams": r[1]} for r in rows],
            "totals": dict(zip(("net", "fibre", "polyols", "protein", "fat"), totals)),
            "perServing": {"carbs_net_per_serving_g": round(net/servings, 2),
                           "carbs_total_per_serving_g": round((net+fibre+polyols)/servings, 2),
                           "protein_per_serving_g": round(protein/servings, 2),
                           "fat_per_serving_g": round(fat/servings, 2)}}

FISH = "off-13692210-squid-brand-fish-sauce-2026-10-24"
ERY = "foodin-erythritol-200g-label-2026-10-24"
NOODLE = "koro-konjac-noodles-prepared-2026-10-24"
YELLOW = "mae-ploy-yellow-curry-paste-2026-10-24"
RED = "mae-ploy-red-curry-paste-2026-10-24"
MASSAMAN = "mae-ploy-massaman-curry-paste-2026-10-24"
SOYPASTE = "healthy-boy-soybean-paste-2026-10-24"

recipes = [
    result("yum-woon-sen-vhh", [product(NOODLE,400), a("F007057",200), f(835,200), f(352,125), f(335,40), product(FISH,30), a("F004729",45), product(ERY,4), a("F002901",5), a("F003192",6), f(535,13.5), f(339,40)]),
    result("gai-yang-vhh", [f(11563,900), product(FISH,45), f(31,15), a("F004193",10.5), a("F003192",20), product(ERY,4), a("F004729",15), f(322,500), f(346,200)]),
    result("keltainen-kanacurry-vhh", [a("F002806",600), a("F002991",400), product(YELLOW,30), f(322,400), f(335,70), product(FISH,15), product(ERY,4), f(552,10), a("F003192",5)]),
    result("khao-kha-moo-vhh", [f(705,800), f(30315,1000), f(31,45), product(FISH,15), product(ERY,12), a("F004193",14), f(858,220), f(359,300), f(322,500)]),
    result("khao-man-gai-vhh", [a("F002806",700), f(322,700), f(30315,15), f(346,200), a("F004213",30), product(SOYPASTE,30), product(FISH,15), a("F004729",15), a("F004193",3.5), a("F003192",5)]),
    result("khao-soi-vhh-konjac", [a("F002806",600), a("F002991",400), product(RED,30), f(30315,500), product(NOODLE,400), product(FISH,30), a("F004729",15), product(ERY,4), f(359,100), f(335,50)]),
    result("larb-moo-vhh", [a("F007057",600), product(FISH,30), a("F004729",45), f(182,9), f(335,50), a("F005700",15), a("F003192",15), f(320,250), f(346,200)]),
    result("massaman-curry-kanalla-vhh", [a("F002806",600), a("F002991",400), product(MASSAMAN,45), f(304,250), f(322,200), f(378,40), f(335,70), product(FISH,15), a("F004729",15), product(ERY,4), f(322,400)]),
]
print(json.dumps({"recipes": recipes}, ensure_ascii=False, indent=2))
