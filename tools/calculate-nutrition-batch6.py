import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FINELI = {str(x["source_id"]): x for x in json.loads((ROOT / "docs/nutrition/fineli-release-20-reference.json").read_text(encoding="utf-8"))["foods"]}
AFCD = {x["source_id"]: x for x in json.loads((ROOT / "docs/nutrition/afcd-release-3-reference.json").read_text(encoding="utf-8"))["foods"]}
OFF = {x["id"]: x for x in json.loads((ROOT / "docs/nutrition/food-records.json").read_text(encoding="utf-8"))}

# Kai jiew, 4 servings. Amounts are grams actually included in the calculation.
# Fineli pieces/spoons were converted using the source record's own unit mass.
rows = [
    ("8 medium eggs; Fineli KPL_M = 55 g each", 8 * FINELI["858"]["portion_mass_g"]["KPL_M"], FINELI["858"]["per100g"]["available_carbohydrate_g_per_100g"], FINELI["858"]["per100g"]["fibre_g_per_100g"], FINELI["858"]["per100g"]["polyols_g_per_100g"], FINELI["858"]["per100g"]["protein_g_per_100g"], FINELI["858"]["per100g"]["fat_g_per_100g"], "Fineli #858"),
    ("Squid Brand fish sauce, weighed", 10, OFF["off-13692210-squid-brand-fish-sauce-2026-10-24"]["per100g"]["carbohydrate"], OFF["off-13692210-squid-brand-fish-sauce-2026-10-24"]["per100g"]["fibre"], 0, OFF["off-13692210-squid-brand-fish-sauce-2026-10-24"]["per100g"]["protein"], OFF["off-13692210-squid-brand-fish-sauce-2026-10-24"]["per100g"]["fat"], "Open Food Facts 13692210"),
    ("Rapeseed oil; Fineli RKL = 13.5 g", 2 * FINELI["535"]["portion_mass_g"]["RKL"], FINELI["535"]["per100g"]["available_carbohydrate_g_per_100g"], FINELI["535"]["per100g"]["fibre_g_per_100g"], FINELI["535"]["per100g"]["polyols_g_per_100g"], FINELI["535"]["per100g"]["protein_g_per_100g"], FINELI["535"]["per100g"]["fat_g_per_100g"], "Fineli #535; all listed oil counted as retained"),
    ("Water; excluded as zero-macronutrient", 0, 0, 0, 0, 0, 0, "recipe water"),
    ("Spring onion, weighed", 15, AFCD["F006250"]["available_carbohydrate_without_sugar_alcohols_g_per_100g"], AFCD["F006250"]["fibre_g_per_100g"], AFCD["F006250"]["available_carbohydrate_with_sugar_alcohols_g_per_100g"] - AFCD["F006250"]["available_carbohydrate_without_sugar_alcohols_g_per_100g"], AFCD["F006250"]["protein_g_per_100g"], AFCD["F006250"]["fat_g_per_100g"], "AFCD Release 3 F006250"),
    ("Cucumber", 150, FINELI["346"]["per100g"]["available_carbohydrate_g_per_100g"], FINELI["346"]["per100g"]["fibre_g_per_100g"], FINELI["346"]["per100g"]["polyols_g_per_100g"], FINELI["346"]["per100g"]["protein_g_per_100g"], FINELI["346"]["per100g"]["fat_g_per_100g"], "Fineli #346"),
    ("Fresh coriander", 5, AFCD["F003192"]["available_carbohydrate_without_sugar_alcohols_g_per_100g"], AFCD["F003192"]["fibre_g_per_100g"], AFCD["F003192"]["available_carbohydrate_with_sugar_alcohols_g_per_100g"] - AFCD["F003192"]["available_carbohydrate_without_sugar_alcohols_g_per_100g"], AFCD["F003192"]["protein_g_per_100g"], AFCD["F003192"]["fat_g_per_100g"], "AFCD Release 3 F003192"),
]

# Each source value is per 100 g. Round only after summing and dividing by servings.
totals = [sum(grams * value / 100 for _, grams, *values, _source in rows for value in [values[i]]) for i in range(5)]
net, fibre, polyols, protein, fat = totals
servings = 4
print(json.dumps({"recipe": "kai-jiew-vhh", "servings": servings, "ingredients": [{"item": item, "grams": grams, "source": source} for item, grams, *_values, source in rows], "perServing": {"carbs_net_per_serving_g": round(net / servings, 2), "carbs_total_per_serving_g": round((net + fibre + polyols) / servings, 2), "protein_per_serving_g": round(protein / servings, 2), "fat_per_serving_g": round(fat / servings, 2)}, "totals": {"net": net, "fibre": fibre, "polyols": polyols, "protein": protein, "fat": fat}}, ensure_ascii=False, indent=2))
