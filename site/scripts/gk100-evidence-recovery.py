"""Join the version-aware main audit with pinned editorial evidence; stdout is JSONL."""

import hashlib
import json
import re
import subprocess
import sys
from decimal import Decimal
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BASE = "b96ba0b0dfe8f859736f9db63be982021ca7a63d"
ARCHIVES = {
    "230": "2b991589d4dfc2010f26ec16733a95eb9a7824fc",
    "244": "e2c3bca1072ccee1e3b565a9c08bac039d94ab59",
    "245": "d9c699c810a98146c3b285011163b1d53546371f",
    "247": "25b6e5276b07bc9854e277e11c5131d8fde1ce7b",
    "248": "b44220f7cb05c7ce88a8bd077088447eccd5609d",
    "249": "2440fa19ddf59aed4f497c8ebead2e68993e830e",
}
NUTRITION = "docs/nutrition/"
MANIFESTS = (
    ("244", "gk100-next-26"),
    ("245", "gk100-244-followup"),
    ("248", "gk100-manakish-study"),
    ("249", "gk100-aloo-paratha-study"),
)


# Ranked evidence questions. A shared row is a research lead, not shared applicability.
PRIORITY_TARGETS = {
    "simmered-coconut-milk": ("massaman-curry-kanalla-vhh", "khao-soi-vhh-konjac", "tom-kha-gai-vhh",
        "kerala-kalacurry", "kookos-lime-kanacurry", "indonesialainen-lontong-sayur-aamiaiseksi"),
    "steamed-wheat-bun": ("dim-sum", "baozi", "kiinalainen-bao-munalla"),
    "boiled-dried-rice-noodle": ("pho-bo", "goi-cuon"),
    "pan-cooked-potato-paratha": ("aloo-paratha", "intialainen-aloo-paratha"),
    "baked-almond-dough": ("vhh-runebergintortut", "keto-korvapuustit"),
    "steamed-filled-wheat-dumpling": ("dim-sum", "xiaolongbao"),
    "heated-tomatillo-salsa": ("meksikolainen-chilaquiles-verdes", "meksikolainen-huevos-divorciados"),
    "pan-cooked-rice-coconut-crepe": ("vietnamilainen-banh-xeo-aamiaisletut",),
    "yeasted-baked-pizza-base": ("pizza-margherita",),
    "deep-fried-leavened-wheat": ("chole-bhature",),
    "fried-filled-samosa": ("samosa",),
    "fried-crisp-semolina-shell": ("pani-puri",),
    "boiled-oil-free-semolina": ("pohjoisafrikkalainen-taatelipuuro-appelsiinilla",),
    "pan-cooked-semolina-yogurt-batter": ("intialainen-rava-uttapam",),
    "pan-cooked-semolina-milk-dough": ("pohjoisafrikkalainen-harcha-juustolla",),
    "fried-rice-with-kecap": ("indonesialainen-nasi-goreng-aamiaisriisi",),
    "tapioca-pearls-coconut-milk": ("vietnamilainen-papaija-kookospuuro",),
    "boiled-mashed-urad": ("dal-makhani",),
    "simmered-cabbage-in-served-broth": ("indonesialainen-lontong-sayur-aamiaiseksi",),
    "dry-heat-sweet-potato": ("korealainen-bataatti-riisikulho",),
}


def load(path):
    return json.loads((ROOT / path).read_bytes())


def git(*args):
    return subprocess.check_output(["git", *args], cwd=ROOT)


def archive(pr, name):
    return json.loads(git("show", f"{ARCHIVES[pr]}:{NUTRITION}{name}.json"))


def indexed(rows, key):
    result = {row[key]: row for row in rows}
    if len(result) != len(rows):
        raise ValueError(f"Duplicate {key}")
    return result


def review_class(hard_gaps, applicability_open, owner_decision, uncertainty):
    """Research disposition only; Approval Factory keeps its existing states."""
    if hard_gaps:
        return "BLOCKED"
    if applicability_open:
        return "REVIEW_REQUIRED"
    if owner_decision:
        return "OWNER_DECISION"
    return "PASS_WITH_DISCLOSED_UNCERTAINTY" if uncertainty else "PASS"


# Specific signals precede generic expressions. Each pilot message remains visible.
BLOCKERS = (
    ("E8", r"structure differs|input must be reviewed|mapping and calculation must be reviewed|fingerprint"),
    ("E7", r"licen[cs]e|permission|commercial reuse"),
    ("E4", r"mass is missing|sheet mass|quantity|mass per ml|density|portion mass|unit mass|mass conversion|gram conversion|amount .*unknown|food-specific unit"),
    ("E1", r"composition|carbohydrate is missing|food record|not treated as zero|carbohydrate estimate|carbohydrate cannot be established|carbohydrate contribution .* cannot be sourced|source data incomplete"),
    ("E3", r"preparation|category.mean|analogu|food family|no match"),
    ("E2", r"GI evidence|GI source|GI value|glycemic index"),
    ("E5", r"tolerance|omitted available|uncertainty|range"),
)
PRIMARY = ("E1", "E4", "E2", "E3", "E7", "E5", "E8", "E6", "UNCLASSIFIED")


def category(message):
    return next((code for code, pattern in BLOCKERS if re.search(pattern, message, re.I)), "UNCLASSIFIED")


def emit():
    if git("merge-base", BASE, "HEAD").decode().strip() != BASE:
        raise ValueError("Run on the pinned main or this review branch")
    pilot = load("tmp/nutrition/glycemic-load-pilot.json")
    recipes = indexed(load("tmp/nutrition/audit.json")["inventory"], "recipe_id")
    results = indexed(pilot["results"], "recipeId")
    historic = indexed(archive("230", "gk80-operation80-inventory")["recipes"], "recipeId")
    numeric = set(pilot["versionCoverage"]["numericRecipeIds"])
    calculated = {key for key, row in results.items() if row["status"] == "CALCULATED"}
    variants = {row["recipeId"] for row in pilot["gkOnlyVariants"] if row["point"] is not None or row["scenarioRange"]}
    if recipes.keys() != results.keys() or numeric != calculated | variants or len(numeric) != pilot["versionCoverage"]["numericRecipes"]:
        raise ValueError("Version-aware coverage and input recipe IDs disagree")

    reviews = {}
    for pr, name in MANIFESTS:
        for key, row in indexed(archive(pr, name + "-manifest")["candidates"], "recipeId").items():
            summary = {field: row[field] for field in ("state", "candidateSha256", "inputSha256", "originalSha256", "point", "range") if field in row}
            summary.update(pr=int(pr), commit=ARCHIVES[pr], path=row["packetPath"])
            reviews[key] = summary
    for pr, name in MANIFESTS:
        if pr not in {"244", "245", "248"}:
            continue
        bundle = archive(pr, name + "-release-bundle")
        for key in bundle["recipeIds"]:
            if reviews[key]["pr"] == int(pr):
                reviews[key]["state"] = "RELEASE_READY"
    reviews["indonesialainen-lontong-sayur-aamiaiseksi"] = {
        "pr": 247, "commit": ARCHIVES["247"], "state": "BLOCKED",
        "path": NUTRITION + "gk100-lontong-sayur-calculation.md",
    }

    missing = results.keys() - numeric
    for target, keys in PRIORITY_TARGETS.items():
        if len(keys) != len(set(keys)) or not set(keys) <= missing:
            raise ValueError(f"Invalid recipe references in priority target: {target}")
    header = {"schemaVersion": 1, "main": BASE, "total": len(results),
              "numeric": len(numeric), "missing": len(missing), "archiveHeads": ARCHIVES,
              "priorityTargets": [{"rank": rank, "target": target, "recipeIds": keys}
                                  for rank, (target, keys) in enumerate(PRIORITY_TARGETS.items(), 1)]}
    yield header
    gi = indexed(load(NUTRITION + "glycemic-index-records.json")["records"], "id")
    for key in sorted(missing):
        result, recipe = results[key], recipes[key]
        path = recipe["source_path"]
        raw = git("show", BASE + ":" + path)
        if raw.decode().splitlines() != (ROOT / path).read_text(encoding="utf-8").splitlines():
            raise ValueError("Changed recipe file: " + path)
        issues = [[category(msg), msg.removeprefix(key + ": ")] for msg in result["blockers"]]
        previous = historic.get(key, {})
        review = reviews.get(key)
        codes = {code for code, _ in issues}
        if review and review["state"] in {"OWNER_DECISION", "RELEASE_READY"}:
            codes.add("E6")
        ingredients = []
        for row in result["ingredients"]:
            gi_id = row.get("giRecordId")
            ingredients.append({
                "name": row["name"], "grams": row["grams"], "cho": row["availableCarbohydratePerServingG"],
                "choRange": row.get("availableCarbohydratePerServingRangeG"),
                "choUpperBound": row.get("availableCarbohydrateUpperBoundPerServingG"),
                "composition": row["fineliRecordId"], "giId": gi_id, "gi": row["gi"],
                "matchKind": row.get("matchKind"), "sourceTier": gi.get(gi_id, {}).get("qualityTier"),
            })
        known = sum(row["cho"] for row in ingredients if row["cho"] is not None)
        yield {
            "recipeId": key, "status": "NO_PUBLISHED_NUMERIC_GK", "path": path,
            "recipeSha256": hashlib.sha256(raw).hexdigest(), "inputSha256": pilot["calculationInputHashes"][key],
            "servings": result["servings"], "knownChoSubtotal": round(known, 9),
            "unquantifiedIngredients": [row["name"] for row in ingredients if row["cho"] is None],
            "ingredients": ingredients, "blockers": issues,
            "primaryBlocker": "E6" if review and review["state"] in {"OWNER_DECISION", "RELEASE_READY"}
                else next((code for code in PRIMARY if code in codes), "UNCLASSIFIED"),
            "blockerCodes": sorted(codes), "pilotStatus": result["status"],
            "editorialDecision": review or {"pr": 230, "commit": ARCHIVES["230"], "state": previous.get("status", "UNREVIEWED")},
            "archivedVariantNote": (previous.get("operation80Proposal") or {}).get("evidencePath"),
            "variantNeed": "EXISTING_CANDIDATE" if review and review.get("candidateSha256") else
                "ASSESS" if not previous.get("operation80Proposal") else "ARCHIVED_VARIANT_REVIEW",
            "sourceRights": "REVIEW_REQUIRED" if "E7" in codes else "NOT_INDEPENDENTLY_REVIEWED",
            "sourceQuantities": recipe["ingredients"],
        }


def comparison():
    """Check the real recipe cohort against published outputs and pinned packets."""
    pilot = load("tmp/nutrition/glycemic-load-pilot.json")
    results = indexed(pilot["results"], "recipeId")
    variants = indexed(pilot["gkOnlyVariants"], "recipeId")
    cohort = (
        ("HIGH", "japanilainen-okayu-umeboshipluumulla", 36.7676),
        ("HIGH", "masala-dosa", 57.8025),
        ("HIGH", "pohjoisafrikkalainen-baghrir", 48.905217),
        ("MEDIUM", "tortilla-de-patatas", 15.76),
        ("MEDIUM", "dan-dan-nuudelit", 18.52555),
        ("MEDIUM", "thai-jok-kanalla", 26.47),
        ("LOW", "keto-mutakakku", 0.07),
        ("LOW", "keto-suklaakeksit", 0.03),
        ("LOW", "kaakao-kookos-chia", 0.22),
    )
    for group, key, expected in cohort:
        variant = variants.get(key)
        result = results[key]
        if variant:
            value = variant["point"] if variant["point"] is not None else variant["scenarioRange"]["min"]
            omitted = variant["omittedCho"]
        else:
            value = result["glycemicLoadPerServing"]
            omitted = result["omittedAvailableCarbohydratePerServingG"]
        lower, upper = {"HIGH": (30, float("inf")), "MEDIUM": (10, 30), "LOW": (0, 1)}[group]
        if not lower <= value < upper or abs(value - expected) > 1e-8:
            raise ValueError(f"Published comparison changed for {key}")
        review_open = key == "thai-jok-kanalla" or group == "LOW"
        yield {"group": group, "recipeId": key, "v1": "PUBLISHED",
               "v2": review_class(False, review_open, False, True),
               "publishedGkOrLowerScenario": value, "omissionStressAtGi100": omitted}

    history = indexed(archive("244", "gk100-next-26-batch")["candidates"], "recipeId")
    for key in ("tunisialainen-ojja", "indonesialainen-lontong-sayur-aamiaiseksi", "vietnamilainen-banh-xeo-aamiaisletut"):
        if history[key]["classification"]["outcome"] != "BLOCKED" or key in pilot["versionCoverage"]["numericRecipeIds"]:
            raise ValueError(f"Expected an unpublished, blocked archive case: {key}")
        if key == "vietnamilainen-banh-xeo-aamiaisletut":
            packet = load(NUTRITION + "gk100-banh-xeo-cooked-sprouts-release-candidate.json")
            point = sum(Decimal(str(g)) * Decimal(str(cho)) * Decimal(str(gi))
                        for g, cho, gi in packet["inputs"]) / (10000 * packet["servings"])
            [omission] = packet["omissions"]
            omitted = (Decimal(str(omission["choPer100g"])) *
                       packet["ingredients"][omission["ingredientIndex"]]["grams"] / (100 * packet["servings"]))
            if point != Decimal("31.76344") or omitted != Decimal("0.44"):
                raise ValueError("Bánh xèo candidate accounting changed")
            v2 = review_class(False, True, True, True)
        else:
            v2 = review_class(True, True, False, True)
        yield {"group": "DIFFICULT", "recipeId": key, "v1": "BLOCKED", "v2": v2}


if __name__ == "__main__":
    if sys.argv[1:] not in ([], ["--sample"]):
        raise SystemExit("Usage: gk100-evidence-recovery.py [--sample]")
    for record in comparison() if sys.argv[1:] else emit():
        print(json.dumps(record, ensure_ascii=False, separators=(",", ":")))
