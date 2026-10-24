#!/usr/bin/env python3
"""Create a source-isolated, licensed AFCD Release 3 nutrient reference."""

from __future__ import annotations

import argparse
import json
import re
import sys
import unicodedata
from collections import Counter
from pathlib import Path

import openpyxl


SOURCE_URL = "https://www.foodstandards.gov.au/science-data/food-nutrient-databases/afcd/data-files"
LICENCE_URL = "https://www.foodstandards.gov.au/science-data/monitoringnutrients/afcd/datauserlicenceagreement"
LICENCE_NAME = "FSANZ Data User Licence Agreement, based on CC BY-SA 3.0 Australia"
LIMITATION = (
    "There are limitations associated with food composition databases. Food composition data used in the database or databases may represent an average of the nutrient content of a particular sample of foods and ingredients, determined at a particular time. The nutrient composition of foods and ingredients can vary substantially between batches and brands because of a number of factors, including changes in season, processing practices and ingredient source, and methods of calculation."
)
AUSTRALIA_NOTE = (
    "This work is based on Australian data. Australia data may not be appropriate for use in other countries."
)

FIELDS = {
    "Protein": "protein_g_per_100g",
    "Fat, total": "fat_g_per_100g",
    "Total dietary fibre": "fibre_g_per_100g",
    "Available carbohydrate, without sugar alcohols": "available_carbohydrate_without_sugar_alcohols_g_per_100g",
    "Available carbohydrate, with sugar alcohols": "available_carbohydrate_with_sugar_alcohols_g_per_100g",
    "Glycerol": "glycerol_g_per_100g",
    "Erythritol": "erythritol_g_per_100g",
    "Maltitol": "maltitol_g_per_100g",
    "Mannitol": "mannitol_g_per_100g",
    "Xylitol": "xylitol_g_per_100g",
    "Sorbitol": "sorbitol_g_per_100g",
}


def normalize(value: str) -> str:
    value = unicodedata.normalize("NFKD", value.casefold())
    value = "".join(ch for ch in value if not unicodedata.combining(ch))
    return re.sub(r"[^a-z0-9]+", " ", value).strip()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("profiles", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()

    workbook = openpyxl.load_workbook(args.profiles, data_only=True, read_only=True)
    sheet = workbook["All solids & liquids per 100 g"]
    rows = sheet.iter_rows(values_only=True)
    next(rows)
    next(rows)
    header = next(rows)
    positions: dict[str, int] = {}
    for index, value in enumerate(header):
        if value is None:
            continue
        clean = re.sub(r"\s*\(g\)\s*$", "", " ".join(str(value).split()))
        if clean in FIELDS:
            positions[FIELDS[clean]] = index
    required = {
        "protein_g_per_100g",
        "fat_g_per_100g",
        "fibre_g_per_100g",
        "available_carbohydrate_without_sugar_alcohols_g_per_100g",
        "available_carbohydrate_with_sugar_alcohols_g_per_100g",
    }
    if not required.issubset(positions):
        raise SystemExit(f"Missing required AFCD columns: {sorted(required - positions.keys())}")

    foods = []
    for row in rows:
        key, classification, derivation, name = row[:4]
        if not key or not name:
            continue
        record = {
            "source_id": str(key),
            "classification": classification,
            "derivation": derivation,
            "name": str(name).strip(),
        }
        for field, index in positions.items():
            value = row[index]
            record[field] = value if isinstance(value, (int, float)) else None
        foods.append(record)

    ids = [food["source_id"] for food in foods]
    names = [normalize(food["name"]) for food in foods]
    duplicate_ids = [key for key, count in Counter(ids).items() if count > 1]
    duplicate_names = [key for key, count in Counter(names).items() if count > 1]
    invalid_values = []
    for food in foods:
        for field in positions:
            value = food[field]
            if value is not None and (not isinstance(value, (int, float)) or value < 0 or value > 100):
                invalid_values.append((food["source_id"], field, value))
    if duplicate_ids or invalid_values:
        raise SystemExit(f"Validation failed: duplicate IDs={duplicate_ids}; invalid values={invalid_values[:10]}")

    payload = {
        "source": {
            "name": "Australian Food Composition Database (AFCD), Release 3",
            "publisher": "Food Standards Australia New Zealand (FSANZ)",
            "release_date": "2025-12",
            "source_url": SOURCE_URL,
            "licence": LICENCE_NAME,
            "licence_url": LICENCE_URL,
            "copyright_notice": "© Food Standards Australia New Zealand (FSANZ), Australian Food Composition Database, Release 3.",
            "changes_made": "Converted from the published Excel nutrient profiles to JSON; retained selected per-100-g nutrient columns and source food IDs, names, classifications and derivation labels. Nutrient values are unchanged.",
            "limitation_of_data_statement": LIMITATION,
            "australian_data_statement": AUSTRALIA_NOTE,
            "disclaimer": "The source work is provided as-is. FSANZ gives no warranty concerning the contents or accuracy of the work, its fitness for purpose, or absence of errors.",
            "component_semantics": {
                "available_carbohydrate_without_sugar_alcohols_g_per_100g": "Sum of available carbohydrates excluding sugar alcohols; AFCD's equation excludes sugar alcohols.",
                "available_carbohydrate_with_sugar_alcohols_g_per_100g": "AFCD's equation includes sorbitol, mannitol and glycerol. Other sugar alcohols are not included in this equation.",
                "missing_values": "Null means no value is reported; it does not mean zero.",
                "use_limit": "Separate reference dataset only. Do not infer a recipe ingredient match by name alone or use this source outside its stated Australian-data limitation.",
            },
        },
            "counts": {
                "food_records": len(foods),
                "unique_source_ids": len(set(ids)),
                "duplicate_normalized_names": len(duplicate_names),
                "duplicate_normalized_name_values": sorted(duplicate_names),
                "records_with_all_five_required_macros": sum(
                    all(food[field] is not None for field in required) for food in foods
                ),
                "invalid_or_out_of_range_values": len(invalid_values),
            },
            "foods": foods,
        }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(payload["counts"], ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
