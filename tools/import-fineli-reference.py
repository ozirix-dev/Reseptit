#!/usr/bin/env python3
"""Import the downloadable Fineli food and measure tables as a local reference."""

from __future__ import annotations

import argparse
import csv
import json
import re
import sys
import unicodedata
import zipfile
from collections import Counter, defaultdict
from pathlib import Path


SOURCE_URL = "https://fineli.fi/fineli/fi/avoin-data"
COMPONENTS = {
    "CHOAVL": "available_carbohydrate_g_per_100g",
    "FIBT": "fibre_g_per_100g",
    "SUGOH": "polyols_g_per_100g",
    "PROT": "protein_g_per_100g",
    "FAT": "fat_g_per_100g",
}
UNITS = {"RKL", "TL", "DL", "L", "KPL_S", "KPL_M", "KPL_L", "KPL_VALM"}


def normalize(value: str) -> str:
    value = unicodedata.normalize("NFKD", value.casefold())
    value = "".join(ch for ch in value if not unicodedata.combining(ch))
    return re.sub(r"[^a-z0-9]+", " ", value).strip()


def read_csv(archive: zipfile.ZipFile, filename: str) -> list[dict[str, str]]:
    text = archive.read(filename).decode("cp1252")
    return list(csv.DictReader(text.splitlines(), delimiter=";"))


def number(value: str | None) -> float | None:
    if value is None or not value.strip():
        return None
    return float(value.replace(",", "."))


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("package", type=Path, help="Fineli open-data ZIP package")
    parser.add_argument("output", type=Path)
    args = parser.parse_args()

    with zipfile.ZipFile(args.package) as archive:
        base_foods = read_csv(archive, "food.csv")
        names = read_csv(archive, "foodname_FI.csv")
        portions = read_csv(archive, "foodaddunit.csv")
        component_values = read_csv(archive, "component_value.csv")
    fi_names = {row["FOODID"]: row["FOODNAME"] for row in names if row["LANG"] == "FI"}
    food_data = {row["FOODID"]: row for row in base_foods}
    values: dict[str, dict[str, float | None]] = defaultdict(dict)
    provenance: dict[str, dict[str, dict[str, str]]] = defaultdict(dict)
    component_keys: list[tuple[str, str]] = []
    for row in component_values:
        code = row["EUFDNAME"]
        if code not in COMPONENTS:
            continue
        food_id = row["FOODID"]
        component_keys.append((food_id, code))
        values[food_id][COMPONENTS[code]] = number(row["BESTLOC"])
        provenance[food_id][COMPONENTS[code]] = {
            "acquisition_type": row["ACQTYPE"],
            "method_type": row["METHTYPE"],
            "method_indicator": row["METHIND"],
        }
    units: dict[str, dict[str, float]] = defaultdict(dict)
    unit_keys: list[tuple[str, str]] = []
    for row in portions:
        if row["FOODUNIT"] in UNITS:
            unit_keys.append((row["FOODID"], row["FOODUNIT"]))
            mass = number(row["MASS"])
            if mass is not None:
                units[row["FOODID"]][row["FOODUNIT"]] = mass

    foods = []
    for food_id, source in food_data.items():
        name = fi_names.get(food_id, source["FOODNAME"]).strip()
        food = {
            "source_id": food_id,
            "name": name,
            "food_type": source["FOODTYPE"],
            "process": source["PROCESS"],
            "edible_portion_percent": number(source["EDPORT"]),
            "ingredient_class": source["IGCLASS"],
            "food_class": source["FUCLASS"],
            "per100g": {key: values.get(food_id, {}).get(key) for key in COMPONENTS.values()},
            "component_provenance": provenance.get(food_id, {}),
            "portion_mass_g": units.get(food_id, {}),
        }
        foods.append(food)

    ids = [food["source_id"] for food in foods]
    names_norm = [normalize(food["name"]) for food in foods]
    duplicate_ids = [key for key, count in Counter(ids).items() if count > 1]
    duplicate_names = [key for key, count in Counter(names_norm).items() if count > 1]
    duplicate_component_rows = [key for key, count in Counter(component_keys).items() if count > 1]
    duplicate_portion_rows = [key for key, count in Counter(unit_keys).items() if count > 1]
    invalid = []
    for food in foods:
        for field, value in food["per100g"].items():
            if value is not None and (value < 0 or value > 100):
                invalid.append((food["source_id"], field, value))
        for unit, value in food["portion_mass_g"].items():
            if value <= 0 or value > 10000:
                invalid.append((food["source_id"], unit, value))
    if duplicate_ids or duplicate_component_rows or duplicate_portion_rows or invalid:
        raise SystemExit(
            "Validation failed: "
            f"duplicate IDs={duplicate_ids}; "
            f"duplicate component rows={duplicate_component_rows[:10]}; "
            f"duplicate portion rows={duplicate_portion_rows[:10]}; "
            f"invalid values={invalid[:10]}"
        )

    complete = [
        food for food in foods
        if all(food["per100g"][key] is not None for key in COMPONENTS.values())
    ]
    payload = {
        "source": {
            "name": "Fineli Food Composition Database, Release 20",
            "publisher": "Finnish Institute for Health and Welfare (THL)",
            "retrieved_from": SOURCE_URL,
            "licence": "Creative Commons Attribution 4.0 International (CC BY 4.0)",
            "licence_url": "https://creativecommons.org/licenses/by/4.0/",
            "attribution": "Source: Finnish Institute for Health and Welfare (THL), Fineli Food Composition Database, Release 20. The source table was converted from semicolon-separated CSVs to JSON; fields were joined by food ID, names were localized to Finnish, and missing values remain null.",
            "component_semantics": "Fineli nutrient component codes are retained in this importer: CHOAVL (available carbohydrate), FIBT (total dietary fibre), SUGOH (sugar alcohols), PROT (protein), FAT (fat).", 
            "missing_values": "Null means no source value was reported; it does not mean zero.",
            "portion_mass_semantics": "Fineli foodaddunit MASS values are grams per the listed food-specific unit; no generic spoon, volume, or piece conversion is inferred.",
            "use_limit": "Reference data only. Recipe matching, edible-portion state, cooking retention, and serving scope still require review.",
        },
        "counts": {
            "food_records": len(foods),
            "unique_source_ids": len(set(ids)),
            "duplicate_normalized_names": len(duplicate_names),
            "duplicate_normalized_name_values": sorted(duplicate_names),
            "duplicate_component_rows": len(duplicate_component_rows),
            "duplicate_portion_rows": len(duplicate_portion_rows),
            "records_with_all_five_macros": len(complete),
            "records_with_sugar_alcohol_value": sum(food["per100g"]["polyols_g_per_100g"] is not None for food in foods),
            "records_with_any_food_specific_portion_mass": sum(bool(food["portion_mass_g"]) for food in foods),
            "food_specific_portion_rows": sum(len(food["portion_mass_g"]) for food in foods),
            "invalid_or_out_of_range_values": len(invalid),
        },
        "foods": foods,
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(payload["counts"], ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
