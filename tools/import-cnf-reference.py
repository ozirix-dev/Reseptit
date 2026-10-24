#!/usr/bin/env python3
"""Build a raw, source-attributed CNF 2026 lookup subset.

The nutrient values remain the original strings from Health Canada's CSVs.
Records are included only when all six listed nutrients have explicit rows;
missing values are never filled with zero.
"""

from __future__ import annotations

import argparse
import csv
import json
import re
import unicodedata
import zipfile
from collections import Counter, defaultdict
from decimal import Decimal, InvalidOperation
from pathlib import Path


NUTRIENTS = ("203", "204", "205", "291", "260", "261")
MACROS = ("203", "204", "205", "291", "260", "261")
SOURCE_URL = "https://open.canada.ca/data/en/dataset/1b6139bd-ed7e-4043-bc28-ff00e10f3109"
LICENSE_URL = "https://open.canada.ca/en/open-government-licence-canada"
ATTRIBUTION = (
    "Contains information licensed under the Open Government Licence – Canada. "
    "Source: Canadian Nutrient File, Health Canada (2026)."
)


def read_csv(archive: zipfile.ZipFile, member: str) -> list[dict[str, str]]:
    with archive.open(member) as file:
        return list(csv.DictReader(line.decode("utf-8-sig") for line in file))


def normalized(value: str) -> str:
    decomposed = unicodedata.normalize("NFKD", value.casefold())
    asciiish = "".join(char for char in decomposed if not unicodedata.combining(char))
    return re.sub(r"[^a-z0-9]+", " ", asciiish).strip()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("archive", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()

    with zipfile.ZipFile(args.archive) as archive:
        foods = read_csv(archive, "Food_Name.csv")
        nutrient_names = read_csv(archive, "Nutrient_Name.csv")
        amounts = read_csv(archive, "Nutrient_Amount.csv")

    names = {row["Nutrient_Code"]: row for row in nutrient_names}
    missing_names = set(NUTRIENTS) - names.keys()
    if missing_names:
        raise ValueError(f"CNF nutrient definitions missing: {sorted(missing_names)}")

    by_food: dict[str, dict[str, dict[str, str]]] = defaultdict(dict)
    for row in amounts:
        code = row["Nutrient_Code"]
        if code in NUTRIENTS:
            food_code = row["Food_Code"]
            if code in by_food[food_code]:
                raise ValueError(f"Duplicate nutrient row: {food_code}/{code}")
            try:
                value = Decimal(row["Nutrient_Amount"])
            except InvalidOperation as exc:
                raise ValueError(f"Invalid value at {food_code}/{code}") from exc
            if value < 0:
                raise ValueError(f"Negative value at {food_code}/{code}: {value}")
            if code in MACROS and value > 100:
                raise ValueError(f"Value above 100 g/100 g at {food_code}/{code}: {value}")
            by_food[food_code][code] = {
                "value": row["Nutrient_Amount"],
                "sourceCode": row["Nutrient_Source_Code"],
                "updatedAt": row["Nutrient_Last_Updated_Date"],
            }

    ids = [food["Food_Code"] for food in foods]
    if len(ids) != len(set(ids)):
        raise ValueError("Duplicate CNF food code")

    entries = []
    for food in foods:
        nutrient_values = by_food.get(food["Food_Code"], {})
        if not all(code in nutrient_values for code in NUTRIENTS):
            continue
        entries.append({
            "foodCode": food["Food_Code"],
            "name": food["Food_Description_EN"],
            "alternateName": food["Alternate_Description_EN"] or None,
            "nutrients": {
                code: {
                    "name": names[code]["Nutrient_Name_EN"],
                    "unit": names[code]["Nutrient_Unit"],
                    **nutrient_values[code],
                }
                for code in NUTRIENTS
            },
        })

    all_name_counts = Counter(normalized(food["Food_Description_EN"]) for food in foods)
    duplicate_names = sorted(name for name, count in all_name_counts.items() if count > 1)
    included_name_counts = Counter(normalized(entry["name"]) for entry in entries)
    included_duplicate_names = sorted(name for name, count in included_name_counts.items() if count > 1)
    payload = {
        "dataset": "Canadian Nutrient File 2026",
        "publisher": "Health Canada",
        "retrievedAt": "2026-10-24",
        "sourceUrl": SOURCE_URL,
        "license": "Open Government Licence – Canada",
        "licenseUrl": LICENSE_URL,
        "attribution": ATTRIBUTION,
        "recordScope": "Only foods with explicit rows for all six nutrient codes are included.",
        "nutrientCodes": list(NUTRIENTS),
        "nutrientBasis": "Values copied without numeric conversion from the source CSV; per 100 g edible portion.",
        "carbohydrateCaveat": "CNF total carbohydrate by difference includes dietary fibre. Mannitol and sorbitol are separate partial polyol fields; this subset is a raw lookup and is not wired into recipe calculations.",
        "qualityCheck": {
            "sourceFoodCount": len(foods),
            "includedRecordCount": len(entries),
            "excludedForMissingNutrientRows": len(foods) - len(entries),
            "duplicateFoodCodes": 0,
            "duplicateNormalizedEnglishNames": duplicate_names,
            "includedDuplicateNormalizedEnglishNames": included_duplicate_names,
            "negativeSelectedNutrientValues": 0,
            "selectedValuesAbove100gPer100g": 0,
        },
        "foods": entries,
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(payload["qualityCheck"], ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
