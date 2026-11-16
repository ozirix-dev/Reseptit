"""Revision-bound GI/GK maintainer queries and a small portable pilot export."""
from __future__ import annotations

import hashlib
import json
import os
from pathlib import Path
import re
import sqlite3
import statistics
import subprocess
import time
from contextlib import closing
from tempfile import TemporaryDirectory
from urllib.parse import urlsplit

import gi_sqlite_index as index

ROOT = index.ROOT
INPUTS = (
    "docs/nutrition/glycemic-index-records.json",
    "docs/nutrition/food-records.json",
    "docs/nutrition/glycemic-load-pilot-input.json",
    "docs/nutrition/glycemic-load-recipe-bindings.json",
    "docs/nutrition/gk80-release-registry.json",
    "docs/nutrition/new-public-gk-pending-sources.json",
    "docs/nutrition/gk80-operation149/cases.json",
    "docs/nutrition/gk80-operation149/gi-sources.json",
    "docs/nutrition/gk80-operation149/owner-approval.json",
)
GENERATED = (
    "tmp/nutrition/glycemic-load-pilot.json",
    "site/src/generated/glycemic-load-pilot.generated.ts",
    "site/src/generated/gk-only-variants.generated.ts",
    "site/src/generated/glycemic-load-filters.generated.ts",
)
MAINTAINER_SCHEMA_VERSION = "3"
VARIANT_CASES, VARIANT_GI, VARIANT_APPROVAL = INPUTS[-3:]
INDEXED = """
CREATE TABLE maintainer_source (
  snapshot TEXT NOT NULL, legacy_id TEXT NOT NULL, observation_id TEXT NOT NULL,
  source_url TEXT NOT NULL, locator TEXT, kind TEXT NOT NULL, applicability TEXT,
  gi REAL, reference_scale TEXT NOT NULL, food_key TEXT NOT NULL, preparation_key TEXT NOT NULL,
  registry_kind TEXT, calculation_use TEXT, food TEXT, preparation TEXT,
  PRIMARY KEY (snapshot, legacy_id)
);
CREATE INDEX maintainer_observation ON maintainer_source(snapshot, observation_id, legacy_id);
CREATE TABLE maintainer_dependency (
  snapshot TEXT NOT NULL, legacy_id TEXT NOT NULL, recipe_id TEXT NOT NULL, role TEXT NOT NULL,
  version_id TEXT NOT NULL,
  PRIMARY KEY (snapshot, legacy_id, recipe_id, version_id, role)
);
CREATE TABLE maintainer_calculation (
  snapshot TEXT NOT NULL, recipe_id TEXT NOT NULL, version_id TEXT NOT NULL,
  status TEXT NOT NULL, gk REAL, recipe_sha256 TEXT, input_sha256 TEXT, evidence_sha256 TEXT,
  approval TEXT NOT NULL, review_reference TEXT,
  range_min REAL, range_max REAL, range_kind TEXT,
  public_status TEXT, public_gk REAL, public_range_min REAL, public_range_max REAL, public_range_kind TEXT,
  scope TEXT NOT NULL, blocker_categories TEXT, calculation_reference TEXT NOT NULL,
  sensitivity_min REAL, sensitivity_max REAL, sensitivity_kind TEXT,
  PRIMARY KEY (snapshot, recipe_id, version_id)
);
"""
CASES = {
    "preparation": "potato-fried-evoo-lady-rosetta-gi-114",
    "analogue": "tomato-raw-cooked-sauce-analogue-gi-22",
    "direct": "whole-tomato-raw-gi-22",
    "imputed": "op142-vegetable-imputation40",
    "rights": "red-pepper-literature-analogue-gi-40",
}
# Fixed aliases keep legacy identifiers that encode GI values in Git and SQLite.
PREVIEW_SOURCE_IDS = {
    CASES["preparation"]: "potato-fried-evoo-lady-rosetta",
    CASES["analogue"]: "tomato-raw-cooked-sauce-analogue",
    CASES["direct"]: "whole-tomato-raw",
    CASES["imputed"]: "vegetable-imputation",
}
TOMATO = "whole-tomato-raw-gi-22"
OBSERVATION_ALIASES = {
    "tomato-cherry-raw-analogue-gi-22": TOMATO,
    "tomato-raw-cooked-sauce-analogue-gi-22": TOMATO,
    "potato-boiled-tortilla-analogue-gi-66": "potato-boiled-china-gi-66",
    "potato-boiled-preparation-analogue-gi-66": "potato-boiled-china-gi-66",
}
FRIED_POTATO_STUDY = "https://doi.org/10.12944/CRNFSJ.4.1.02"
SECONDARY_SOURCES = {
    "https://doi.org/10.1093/ajcn/nqab233",
    "https://doi.org/10.1093/ajcn/76.1.5",
    "https://glycemicindex.com/gi-search/",
}

VARIANT_RECIPE = "keto-mutakakku"
CHAIN_RECIPE = "gazpacho"
TABLES = ("maintainer_source", "maintainer_dependency", "maintainer_calculation")
CALCULATION_COLUMNS = (
    "snapshot,recipe_id,version_id,status,gk,recipe_sha256,input_sha256,evidence_sha256,"
    "approval,review_reference"
)
PREVIEW_SCHEMA = """CREATE TABLE maintainer_source (
  snapshot TEXT NOT NULL, legacy_id TEXT NOT NULL, observation_id TEXT NOT NULL,
  source_url TEXT NOT NULL, locator TEXT, kind TEXT NOT NULL, applicability TEXT,
  gi REAL, reference_scale TEXT NOT NULL, food_key TEXT NOT NULL, preparation_key TEXT NOT NULL,
  PRIMARY KEY (snapshot, legacy_id)
);
CREATE TABLE maintainer_dependency (
  snapshot TEXT NOT NULL, legacy_id TEXT NOT NULL, recipe_id TEXT NOT NULL, role TEXT NOT NULL,
  PRIMARY KEY (snapshot, legacy_id, recipe_id, role)
);
CREATE TABLE maintainer_calculation (
  snapshot TEXT NOT NULL, recipe_id TEXT NOT NULL, version_id TEXT NOT NULL,
  status TEXT NOT NULL, gk REAL, recipe_sha256 TEXT, input_sha256 TEXT, evidence_sha256 TEXT,
  approval TEXT NOT NULL, review_reference TEXT,
  PRIMARY KEY (snapshot, recipe_id, version_id)
);
"""


def encode(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, allow_nan=False,
                      separators=(",", ":")).encode("utf-8")


def digest(value):
    return hashlib.sha256(value).hexdigest()


def save(path, value):
    path.write_bytes(encode(value) + b"\n")


def git(*args):
    return subprocess.check_output(["git", "-C", str(ROOT), *args], encoding="utf-8").strip()


def current_revision():
    revision = git("rev-parse", "HEAD")
    if git("status", "--porcelain", "--untracked-files=no"):
        raise ValueError("A clean checkout is required to bind the audit to a revision")
    return revision


def generated_array(raw, name):
    text = raw.decode("utf-8")
    match = re.search(r"(?m)^export const " + re.escape(name) + r"(?::[^=\n]+)?\s*=\s*(\[)", text)
    if not match:
        raise ValueError("Cannot read generated array " + name)
    array, consumed = json.JSONDecoder().raw_decode(text[match.start(1):])
    if not text[match.start(1) + consumed:].startswith(";"):
        raise ValueError("Generated array has unexpected trailing data: " + name)
    return array


def capture(folder):
    folder = checked_folder(folder)
    revision = current_revision()
    env = {**os.environ, "RECIPAVO_BUILD_TARGET": "production"}
    for name in ("RECIPE_SOURCE_ROOT", "RECIPAVO_PREVIEW_ORIGIN", "VITE_RECIPAVO_HERO_PREVIEW"):
        env.pop(name, None)
    trace = {}
    with TemporaryDirectory() as scratch:
        trace_file = Path(scratch) / "reads.json"
        env["RECIPAVO_GK_READ_TRACE"] = str(trace_file)
        for script, args in (
            ("build-content.ts", []), ("nutrition-audit.ts", ["--strict"]), ("glycemic-load-pilot.ts", []),
        ):
            result = subprocess.run(
                ["node", "--import", "./scripts/gi_sqlite_capture_reads.mjs", "--import", "tsx", "scripts/" + script, *args],
                cwd=ROOT / "site", env=env, capture_output=True, encoding="utf-8", errors="replace",
            )
            if result.returncode:
                raise ValueError(f"{script} failed: {result.stderr[-4000:]}")
            trace["site/scripts/" + script] = json.loads(trace_file.read_bytes())
    if current_revision() != revision:
        raise ValueError("Checkout changed during capture")
    folder.mkdir(parents=True, exist_ok=True)
    report = json.loads((ROOT / GENERATED[0]).read_bytes())
    report.pop("generatedAt", None)
    report["maintainerReadTrace"] = trace
    save(folder / "audit.json", report)
    publish = {}
    for key, path, symbol in (
        ("originals", GENERATED[1], "glycemicLoadPilotResults"),
        ("variants", GENERATED[2], "gkOnlyVariants"),
    ):
        publish[key] = generated_array((ROOT / path).read_bytes(), symbol)
    save(folder / "public.json", publish)
    manifest = {
        "version": 2, "revision": revision, "tree": git("rev-parse", "HEAD^{tree}"),
        "activeInputs": {p: input_digest(ROOT / p) for p in INPUTS},
        "auditSha256": digest((folder / "audit.json").read_bytes()),
        "publicSha256": digest((folder / "public.json").read_bytes()),
        "publicModuleSha256": {p: digest((ROOT / p).read_bytes()) for p in GENERATED[1:]},
    }
    save(folder / "manifest.json", manifest)
    return manifest


def load_capture(folder):
    manifest_path = folder / "manifest.json"
    try:
        raw_manifest = manifest_path.read_bytes()
        manifest = json.loads(raw_manifest)
        if not isinstance(manifest, dict) or set(manifest) != {
            "version", "revision", "tree", "activeInputs", "auditSha256", "publicSha256", "publicModuleSha256",
        }:
            raise ValueError("Invalid capture manifest fields")
        if (manifest["version"] != 2 or manifest["revision"] != current_revision()
                or manifest["tree"] != git("rev-parse", "HEAD^{tree}")):
            raise ValueError("Stale GI/GK capture: run capture for this revision")
        expected_inputs = manifest["activeInputs"]
        module_hashes = manifest["publicModuleSha256"]
        if (not isinstance(expected_inputs, dict) or set(expected_inputs) != set(INPUTS)
                or not isinstance(module_hashes, dict) or set(module_hashes) != set(GENERATED[1:])
                or any(not valid_sha256(h) for h in [*expected_inputs.values(), *module_hashes.values(),
                                                    manifest["auditSha256"], manifest["publicSha256"]])):
            raise ValueError("Invalid or outdated capture checksums: run capture again")
        for path in INPUTS:
            if input_digest(ROOT / path) != expected_inputs[path]:
                raise ValueError("GI/GK input differs from its capture: " + path)
        results = []
        for name in ("audit", "public"):
            raw = (folder / (name + ".json")).read_bytes()
            if digest(raw) != manifest[name + "Sha256"]:
                raise ValueError("GI/GK capture checksum failed: " + name)
            results.append(json.loads(raw))
        if raw_manifest != manifest_path.read_bytes():
            raise ValueError("Capture changed during lookup: retry after capture finishes")
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"Unreadable GI/GK capture at {folder}: run capture again ({exc})") from exc
    return manifest, *results


def valid_sha256(value):
    return isinstance(value, str) and re.fullmatch(r"[0-9a-f]{64}", value) is not None


def input_digest(path):
    return digest(path.read_bytes().replace(b"\r\n", b"\n"))


def checked_folder(folder):
    folder = folder.resolve()
    if folder.is_relative_to(ROOT) and not folder.is_relative_to(ROOT / "tmp"):
        raise ValueError("GI/GK artifacts must go under repo tmp/ or outside the checkout")
    return folder


def observation_kind(record):
    # Source evidence and recipe applicability are independent properties.
    ref = record["source"]
    if record.get("evidenceKind") == "PUBLISHED_IMPUTATION":
        return "PUBLISHED_IMPUTATION"
    if record.get("matchKind") == "CATEGORY_MEAN":
        return "CATEGORY_MEAN"
    if ref["url"] in SECONDARY_SOURCES:
        return "SECONDARY_REFERENCE"
    if ref.get("referenceFood") == "Bread" and record["referenceScale"] == "GLUCOSE_100":
        return "PUBLISHED_SCALE_ESTIMATE"
    if ref["url"] == FRIED_POTATO_STUDY and ref.get("participants") == 8:
        return "HUMAN_GI"
    if record.get("evidenceKind") == "HUMAN_GI":
        return "HUMAN_GI_RECORDED"
    return "NEEDS_REVIEW"


def observation_ids(records):
    by_id = {row["id"]: row for row in records}
    result = {key: key for key in by_id}
    for alias, primary in OBSERVATION_ALIASES.items():
        if alias not in by_id or primary not in by_id:
            continue
        row, measured = by_id[alias], by_id[primary]
        if (row.get("matchKind") == "ANALOG"
                and all(row[key] == measured[key] for key in ("gi", "foodKey", "preparationKey", "referenceScale"))
                and row["source"]["url"] == measured["source"]["url"]
                and (primary == TOMATO or row["source"]["table"] == measured["source"]["table"])):
            result[alias] = primary
    return result


def variant_packet(root):
    cases = json.loads((root / VARIANT_CASES).read_bytes())["cases"]
    gi = json.loads((root / VARIANT_GI).read_bytes())["records"]
    receipt = json.loads((root / VARIANT_APPROVAL).read_bytes())["approvedInputs"]
    native_ids = {row["id"]: row["nativeId"] for row in gi if row.get("path") == INPUTS[0]}
    # The build verifies the packet and seals those exact inputs before capture.
    return {
        (case["recipeId"], case["inputSha256"]): (
            (case.get("recipeSha256") or {}).get("fi"),
            {native_ids[row["giId"]] for row in case["candidateIngredients"] if row.get("giId") in native_ids},
        )
        for case in cases if receipt.get(case["recipeId"]) == case["inputSha256"]
    }


def inventory():
    registry = json.loads(index.DEFAULT_SOURCE.read_bytes())
    inputs = json.loads((ROOT / INPUTS[2]).read_bytes())
    uses = {}
    for recipe in inputs["recipes"]:
        for row in recipe["ingredients"]:
            if row.get("giRecordId"):
                uses.setdefault(row["giRecordId"], set()).add(recipe["recipeId"])
    observations = observation_ids(registry["records"])
    return [
        {"id": r["id"], "observationId": observations[r["id"]], "source": r["source"].get("url"), "locator": r["source"].get("table"),
         "food": r["foodKey"], "preparation": r["preparationKey"],
         "evidenceKind": observation_kind(r), "registryEvidenceKind": r.get("evidenceKind"),
         "application": r.get("matchKind"), "referenceScale": r["referenceScale"],
         "gi": r.get("gi"),
         "usage": r.get("calculationUse") or "SEE_RECIPE_BINDING",
         "boundInputRecipes": sorted(uses.get(r["id"], ())),
         "unresolved": [key for key in ("table", "url") if not r["source"].get(key)]}
        for r in registry["records"]
    ]


def collect(db, snapshot, registry, audit, public, bindings, packet=None):
    records = registry["records"]
    observations = observation_ids(records)
    by_url = {}
    sources = []
    for r in records:
        ref = r["source"]
        by_url.setdefault(ref["url"], set()).add(r["id"])
        sources.append((snapshot, r["id"], observations[r["id"]], ref["url"], ref.get("table"),
                        observation_kind(r), r.get("matchKind"), r.get("gi"), r["referenceScale"],
                        r["foodKey"], r["preparationKey"], r.get("evidenceKind"),
                        r.get("calculationUse"), r.get("food"), r.get("preparation")))
    db.executemany("INSERT INTO maintainer_source VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", sources)

    uses = set()
    for label, records in (("calculation-input", audit["calculationInputs"]),
                           ("audit-result", audit["results"]),
                           ("public-original", public["originals"])):
        for row in records:
            for ingredient in row.get("ingredientEvidence", []) or row.get("ingredients", []):
                if ingredient.get("giRecordId"):
                    uses.add((snapshot, ingredient["giRecordId"], row["recipeId"], label, "original"))
    public_originals = {r["recipeId"]: r for r in public["originals"]}
    mismatches = set().union(*(audit.get(key, []) for key in (
        "recipeBindingMismatches", "calculationInputMismatches", "calculationEvidenceMismatches",
    )))
    insert = (
        f"INSERT INTO maintainer_calculation ({CALCULATION_COLUMNS},"
        "range_min,range_max,range_kind,public_status,public_gk,public_range_min,public_range_max,"
        "public_range_kind,scope,blocker_categories,calculation_reference,"
        "sensitivity_min,sensitivity_max,sensitivity_kind) VALUES (" + ",".join("?" * 24) + ")"
    )
    for row in audit["results"]:
        recipe = row["recipeId"]
        hashes = tuple(audit[key].get(recipe) for key in (
            "sourceHashes", "calculationInputHashes", "calculationEvidenceHashes",
        ))
        bound = recipe not in mismatches and all(
            h and bindings.get(key, {}).get(recipe) == h for key, h in
            zip(("recipes", "calculationInputs", "calculationEvidence"), hashes)
        )
        shown = public_originals.get(recipe, {})
        numeric = shown.get("status") == "CALCULATED"
        if numeric:
            state = "PUBLISHED_AND_BASELINE_BINDING_MATCHES" if bound else "PUBLISHED_CHECK_RELEASE_PATH"
        elif recipe in mismatches:
            state = "NO_PUBLISHED_NUMERIC_ORIGINAL_BINDING_MISMATCH"
        else:
            state = "NO_PUBLISHED_NUMERIC_ORIGINAL"
        blockers = sorted({reason["category"] for reason in shown.get("incompleteReasons", [])})
        db.execute(insert, (
            snapshot, recipe, "original", row["status"], row["glycemicLoadPerServing"], *hashes,
            state, INPUTS[3] if bound else None,
            *range_fields(row.get("glycemicLoadRangePerServing"), row.get("modelScenario")),
            shown.get("status"), shown.get("glycemicLoadPerServing"),
            *range_fields(shown.get("glycemicLoadRangePerServing"), shown.get("modelScenario")),
            "ORIGINAL_RECIPE", ",".join(blockers), GENERATED[0], None, None, None,
        ))
    for pending in audit.get("newPublicGkPendingSources", []):
        db.execute(insert, (
            snapshot, pending["recipeId"], "original", "REVIEW_PENDING", None, None, None, None,
            "NO_PUBLISHED_NUMERIC_ORIGINAL", INPUTS[5], None, None, None, None, None,
            None, None, None, "ORIGINAL_RECIPE", "REVIEW_PENDING", GENERATED[0], None, None, None,
        ))
    public_variants = {(r["recipeId"], r["versionId"]): r for r in public["variants"]}
    audited_variants = audit.get("gkOnlyVariants", [])
    study_recipes = set(audit.get("versionCoverage", {}).get("studyServingRecipeIds", []))
    explicit_study_recipes = {r["recipeId"] for r in audited_variants if r.get("studyServing")}
    legacy_study_recipes = study_recipes - explicit_study_recipes
    for recipe in legacy_study_recipes:
        if sum(r["recipeId"] == recipe for r in audited_variants) != 1:
            raise ValueError("Ambiguous study comparison version for " + recipe)
    for variant in audited_variants:
        key = (variant["recipeId"], variant["versionId"])
        shown = public_variants.pop(key, {})
        # The build reports study scope separately, including sealed legacy study servings.
        study = variant.get("studyServing") or variant["recipeId"] in legacy_study_recipes
        scope = "STUDY_COMPARISON" if study else "RECIPE_VARIANT"
        shown_range = range_fields(shown.get("scenarioRange"), shown.get("rangeKind"))
        calculated_range = range_fields(variant.get("scenarioRange"), variant.get("rangeKind"))
        if shown and (variant.get("point"), calculated_range, variant["inputSha256"], variant["level"]) != (
            shown.get("point"), shown_range, shown["inputSha256"], shown["level"],
        ):
            raise ValueError("Public GK variant differs from the audited result: " + str(key))
        approval = ("PUBLISHED_STUDY_COMPARISON" if study else "PUBLISHED_VARIANT") if shown else (
            "UNPUBLISHED_STUDY_COMPARISON" if study else "UNPUBLISHED_VARIANT"
        )
        pack = (packet or {}).get((variant["recipeId"], variant["inputSha256"]))
        recipe_hash, exact_ids = pack if pack else (variant.get("recipeSha256"), set())
        for legacy_id in exact_ids:
            if legacy_id not in observations:
                raise ValueError("Approved variant refers to missing canonical GI ID: " + legacy_id)
            uses.add((snapshot, legacy_id, key[0], "variant-input", key[1]))
        cited_ids = set().union(*(
            by_url.get(citation["url"], set()) for citation in variant.get("sources", [])
            if citation["kind"] in {"HUMAN_GI", "PUBLISHED_CODING", "B_CODING"}
        ))
        exact_observations = {observations[legacy_id] for legacy_id in exact_ids}
        for legacy_id in cited_ids:
            if observations[legacy_id] not in exact_observations:
                uses.add((snapshot, legacy_id, key[0], "unverified-variant-citation", key[1]))
        db.execute(insert, (
            snapshot, *key, variant["level"], variant.get("point"), recipe_hash,
            variant["inputSha256"], variant.get("evidenceSha256"), approval,
            VARIANT_APPROVAL if pack else GENERATED[2] if shown else None, *calculated_range,
            "CALCULATED" if shown else None, shown.get("point"), *shown_range,
            scope, None, GENERATED[0],
            *range_fields(variant.get("sensitivity"), (variant.get("sensitivity") or {}).get("kind")),
        ))
    if public_variants:
        raise ValueError("Public GK variants missing from the audit: " + str(sorted(public_variants)))

    db.executemany("INSERT INTO maintainer_dependency VALUES (?,?,?,?,?)", sorted(uses))
    verify_public_projection(db, snapshot, public)


def verify_public_projection(db, snapshot, public):
    originals = {
        (r["recipeId"], "original"): (
            r["status"], r["glycemicLoadPerServing"],
            *range_fields(r.get("glycemicLoadRangePerServing"), r.get("modelScenario")),
        )
        for r in public["originals"]
    }
    variants = {
        (r["recipeId"], r["versionId"]): (
            "CALCULATED", r.get("point"), *range_fields(r.get("scenarioRange"), r.get("rangeKind")),
        )
        for r in public["variants"]
    }
    rows = db.execute(
        "SELECT recipe_id,version_id,public_status,public_gk,public_range_min,public_range_max,public_range_kind "
        "FROM maintainer_calculation WHERE snapshot=? AND public_status IS NOT NULL",
        (snapshot,),
    )
    projected = {(recipe, version): tuple(result) for recipe, version, *result in rows}
    expected = originals | variants
    if projected != expected:
        differences = sorted(key for key in projected.keys() | expected.keys() if projected.get(key) != expected.get(key))
        raise ValueError("Public GK projection differs for " + str(differences[:10]))
    return {"originals": len(originals), "variants": len(variants)}


def range_fields(interval, kind):
    if interval is None:
        return None, None, None
    return interval["min"], interval["max"], kind or "UNKNOWN"


def open_pilot(folder, evidence, destination=None):
    folder = checked_folder(folder)
    manifest, audit, public = load_capture(folder)
    snapshot = digest(encode(manifest))
    destination = destination or folder / "maintainer.sqlite"
    raw = index.DEFAULT_SOURCE.read_bytes()
    composition = evidence.DEFAULT_COMPOSITION.read_bytes()
    expected = digest(raw)
    if (digest(raw.replace(b"\r\n", b"\n")) != manifest["activeInputs"][INPUTS[0]]
            or digest(composition.replace(b"\r\n", b"\n")) != manifest["activeInputs"][INPUTS[1]]):
        raise ValueError("Canonical inputs changed during index build")
    if destination.exists():
        try:
            with checked_database(destination, snapshot) as db:
                evidence._verify(db, expected, digest(composition))
                return destination, snapshot
        except (index.StaleIndexError, sqlite3.DatabaseError):
            pass
    def extend(db, sources, records):
        evidence._extend_index(db, sources, records, composition, digest(composition))
        db.executescript(INDEXED)
        collect(db, snapshot, {"records": records}, audit, public, json.loads((ROOT / INPUTS[3]).read_bytes()), variant_packet(ROOT))
        db.executemany("INSERT INTO metadata VALUES (?,?)", (
            ("maintainer_snapshot", snapshot), ("maintainer_schema_version", MAINTAINER_SCHEMA_VERSION),
        ))
    index._build_index(index.DEFAULT_SOURCE, destination, raw, expected, extend=extend, replace_attempts=3)
    return destination, snapshot


def checked_database(destination, snapshot):
    db = index._open_index(destination)
    try:
        meta = dict(db.execute("SELECT key,value FROM metadata"))
        if (meta.get("maintainer_snapshot") != snapshot
                or meta.get("maintainer_schema_version") != MAINTAINER_SCHEMA_VERSION):
            raise index.StaleIndexError("Stale GI/GK index: retry to rebuild from the current capture")
        if db.execute("PRAGMA quick_check(1)").fetchone()[0] != "ok":
            raise index.StaleIndexError("Damaged GI/GK index: retry to rebuild from the current capture")
    except BaseException:
        db.close()
        raise
    return closing(db)


def lookup(db, snapshot, mode, key, after="", limit=50):
    if not 1 <= limit <= 100:
        raise ValueError("Limit must be 1–100")
    if mode == "source":
        sql = "SELECT * FROM maintainer_source WHERE snapshot=? AND legacy_id=?"
        params = (snapshot, key)
    elif mode == "impact":
        aliases = [row[0] for row in db.execute(
            "SELECT sibling.legacy_id FROM maintainer_source AS source "
            "JOIN maintainer_source AS sibling USING (snapshot,observation_id) "
            "WHERE source.snapshot=? AND source.legacy_id=? ORDER BY sibling.legacy_id",
            (snapshot, key),
        )]
        cursor = after.split(":") if after else ["", "", "", ""]
        if len(cursor) != 4:
            raise ValueError("Invalid impact cursor: use the next value from the same query")
        matched = aliases or [key]
        sql = (
            "SELECT d.recipe_id,d.version_id,d.legacy_id,d.role,c.approval,c.public_status "
            "FROM maintainer_dependency d LEFT JOIN maintainer_calculation c USING (snapshot,recipe_id,version_id) "
            f"WHERE d.snapshot=? AND d.legacy_id IN ({','.join('?' for _ in matched)}) "
            "AND (d.recipe_id,d.version_id,d.legacy_id,d.role)>(?,?,?,?) "
            "ORDER BY d.recipe_id,d.version_id,d.legacy_id,d.role LIMIT ?"
        )
        params = (snapshot, *matched, *cursor, limit + 1)
    elif mode == "approval":
        sql = ("SELECT * FROM maintainer_calculation WHERE snapshot=? AND recipe_id=? AND version_id>? "
               "ORDER BY version_id LIMIT ?")
        params = (snapshot, key, after, limit + 1)
    else:
        raise ValueError("Unknown maintainer query")
    cursor = db.execute(sql, params)
    rows = [dict(zip([c[0] for c in cursor.description], row)) for row in cursor]
    next_key = None
    if len(rows) > limit:
        rows = rows[:limit]
        next_key = ":".join(rows[-1][k] for k in ("recipe_id", "version_id", "legacy_id", "role")) if mode == "impact" else rows[-1]["version_id"]
    result = {"snapshot": snapshot, "query": mode, "id": key, "rows": rows, "next": next_key}
    if mode == "impact":
        result["observationAliases"] = aliases
        result["coverage"] = "PARTIAL"
        result["scope"] = (
            "Exact original and indexed approved-packet links, plus unverified variant citation matches. "
            "Other packet identifiers, differently formatted citations and historical links may require manual checking."
        )
    return result


def cases(db, snapshot):
    def source(name):
        rows = lookup(db, snapshot, "source", CASES[name])["rows"]
        if len(rows) != 1:
            raise ValueError("Missing pilot case: " + name)
        return rows[0]
    direct, preparation, analogue, imputed, rights = (
        source(name) for name in ("direct", "preparation", "analogue", "imputed", "rights"))
    chain = lookup(db, snapshot, "approval", CHAIN_RECIPE)["rows"]
    original = next((row for row in chain if row["version_id"] == "original"), None)
    linked = ("gazpacho", "public-original") in {
        (row["recipe_id"], row["role"])
        for row in lookup(db, snapshot, "impact", analogue["legacy_id"], limit=100)["rows"]
    }
    if not (linked and original and original["approval"] == "PUBLISHED_AND_BASELINE_BINDING_MATCHES"
            and all(original[name] for name in ("recipe_sha256", "input_sha256", "evidence_sha256"))):
        raise ValueError("Pilot has no complete approved source-to-calculation chain")
    results = {
        "source_and_reported_value": bool(direct["locator"]) and direct["gi"] == 22,
        "measured_preparation": preparation["kind"] == "HUMAN_GI" and preparation["gi"] == 114
            and preparation["preparation_key"] != "boiled-unspecified",
        "analogue_is_application": analogue["applicability"] == "ANALOG",
        "imputation_not_measurement": imputed["kind"] == "PUBLISHED_IMPUTATION",
        "same_observation_two_legacy_applications": direct["observation_id"] == analogue["observation_id"]
            and direct["legacy_id"] != analogue["legacy_id"],
        "reference_only_excluded_from_cloud_export": rights["legacy_id"] == CASES["rights"],
        "missing_not_zero": sql_value(None) == "NULL" and sql_value(0) == "0",
        "approved_variant": any(row["approval"] == "PUBLISHED_VARIANT" and row["input_sha256"]
                                for row in lookup(db, snapshot, "approval", VARIANT_RECIPE)["rows"]),
    }
    if not all(results.values()):
        raise ValueError("Pilot case failed: " + str(results))
    return {"snapshot": snapshot, "cases": results, "linkedApprovedRecipe": CHAIN_RECIPE}

def sql_value(value):
    if value is None:
        return "NULL"
    if isinstance(value, str):
        return "'" + value.replace("'", "''") + "'"
    return json.dumps(value, allow_nan=False)


def export_preview(db, snapshot, folder):
    # Project-derived identifiers and citations only. Exclude numeric GI, passage
    # locators and records with unresolved rights. Cloud import needs separate approval.
    output = folder / "d1-preview"
    output.mkdir(exist_ok=True)
    def rows(query):
        return [tuple(row) for row in db.execute(query, (snapshot,))]
    by_table = {
        "maintainer_source": [
            (s, PREVIEW_SOURCE_IDS[legacy], PREVIEW_SOURCE_IDS[observation], url, None, kind, applicability, None,
             scale, food, "vegetable-imputation" if legacy == CASES["imputed"] else preparation)
            for s, legacy, observation, url, _locator, kind, applicability, _gi, scale, food, preparation
            in rows("SELECT snapshot,legacy_id,observation_id,source_url,locator,kind,applicability,"
                        "gi,reference_scale,food_key,preparation_key FROM maintainer_source "
                        "WHERE snapshot=? ORDER BY legacy_id")
            if legacy in PREVIEW_SOURCE_IDS and urlsplit(url).scheme == "https"
        ],
        "maintainer_dependency": [
            (s, PREVIEW_SOURCE_IDS[legacy], recipe, role)
            for s, legacy, recipe, role in rows(
                "SELECT snapshot,legacy_id,recipe_id,role FROM maintainer_dependency WHERE snapshot=? ORDER BY legacy_id,recipe_id,role")
            if legacy in PREVIEW_SOURCE_IDS and role == "public-original"
        ],
        "maintainer_calculation": [
            row for row in rows(
                "SELECT snapshot,recipe_id,version_id,status,public_gk,NULL,NULL,NULL,approval,NULL "
                "FROM maintainer_calculation WHERE snapshot=? ORDER BY recipe_id,version_id")
            if (row[1] == VARIANT_RECIPE and row[8] == "PUBLISHED_VARIANT")
            or (row[1] == CHAIN_RECIPE and row[2] == "original"
                and row[8] == "PUBLISHED_AND_BASELINE_BINDING_MATCHES")
        ],
    }
    schema = ("CREATE TABLE preview_snapshots (id TEXT PRIMARY KEY, revision TEXT NOT NULL);\n"
              "CREATE TABLE preview_active (slot INTEGER PRIMARY KEY CHECK(slot=1), snapshot TEXT NOT NULL REFERENCES preview_snapshots(id));\n"
              + PREVIEW_SCHEMA)
    (output / "schema.sql").write_text(schema, encoding="utf-8", newline="\n")
    revision = json.loads((folder / "manifest.json").read_bytes())["revision"]
    def insert(table, row):
        return f"INSERT INTO {table} VALUES ({','.join(map(sql_value, row))}) ON CONFLICT DO NOTHING;\n"
    sql = insert("preview_snapshots", (snapshot, revision))
    for table in TABLES:
        sql += "".join(insert(table, row) for row in by_table[table])
    if any(legacy_id in sql for legacy_id in CASES.values()):
        raise ValueError("Preview contains a local GI identifier")
    (output / "import.sql").write_text(sql, encoding="utf-8", newline="\n")
    with closing(sqlite3.connect(":memory:")) as restored:
        restored.execute("PRAGMA foreign_keys=ON")
        restored.executescript(schema)
        restored.executescript(sql)
        before = restored.total_changes
        restored.executescript(sql)
        if before != restored.total_changes or restored.execute("PRAGMA foreign_key_check").fetchall():
            raise ValueError("Portable SQL replay or foreign key check failed")
        for table, expected in by_table.items():
            if sorted(restored.execute(f"SELECT * FROM {table}").fetchall()) != sorted(expected):
                raise ValueError("Restored projection differs: " + table)
        preview_ids = {row[0] for row in restored.execute("SELECT legacy_id FROM maintainer_source")}
        if preview_ids != set(PREVIEW_SOURCE_IDS.values()) or restored.execute(
            "SELECT 1 FROM maintainer_source WHERE gi IS NOT NULL OR locator IS NOT NULL"
        ).fetchone():
            raise ValueError("Preview sources differ from the permitted projection")
        alias = PREVIEW_SOURCE_IDS[CASES["analogue"]]
        source = lookup(restored, snapshot, "source", alias)["rows"]
        if len(source) != 1 or source[0]["observation_id"] != PREVIEW_SOURCE_IDS[CASES["direct"]]:
            raise ValueError("Portable lookup lost the shared source observation")
        if not restored.execute(
            "SELECT 1 FROM maintainer_dependency WHERE snapshot=? AND legacy_id=? AND recipe_id=?",
            (snapshot, alias, CHAIN_RECIPE),
        ).fetchone():
            raise ValueError("Portable impact lookup lost the linked recipe")
        if len(lookup(restored, snapshot, "approval", CHAIN_RECIPE)["rows"]) != 1:
            raise ValueError("Portable lookup lost the approved calculation")
        if restored.execute("SELECT snapshot FROM preview_active").fetchall():
            raise ValueError("A D1 import must stay passive")
        # Synthetic predecessor is used only for the local rollback exercise.
        previous = "local-rollback-fixture"
        restored.execute("INSERT INTO preview_snapshots VALUES (?,?)", (previous, "fixture"))
        restored.execute("INSERT INTO preview_active VALUES (1,?)", (previous,))
        swap = "UPDATE preview_active SET snapshot=? WHERE slot=1 AND snapshot=?"
        if restored.execute(swap, (snapshot, "stale")).rowcount != 0:
            raise ValueError("A stale activation overwrote the active version")
        if restored.execute(swap, (snapshot, previous)).rowcount != 1:
            raise ValueError("Local activation failed")
        if restored.execute(swap, (previous, snapshot)).rowcount != 1:
            raise ValueError("Local rollback failed")
        if restored.execute("SELECT snapshot FROM preview_active WHERE slot=1").fetchone() != (previous,):
            raise ValueError("Local rollback did not restore active version")
    manifest = {"schemaVersion": 1, "revision": revision, "snapshot": snapshot,
                "tables": {k: len(v) for k,v in by_table.items()}, "localReplayWrites": 0,
                "remoteApprovalRequired": True, "localActivationAndRollbackVerified": True,
                "sha256": {n: digest((output / n).read_bytes()) for n in ("schema.sql", "import.sql")}}
    save(output / "manifest.json", manifest)
    return manifest


def benchmark():
    reports = []
    for n in (64, 10_000, 100_000):
        with closing(sqlite3.connect(":memory:")) as db:
            started = time.perf_counter_ns()
            db.executescript(INDEXED)
            db.executemany("INSERT INTO maintainer_source VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                           (("bench", f"i{i:06}", f"o{i:06}", "", None, "synthetic", None, None, "glucose", "food", "raw", None, None, None, None) for i in range(n)))
            db.executemany("INSERT INTO maintainer_dependency VALUES (?,?,?,?,?)",
                           (("bench", f"i{i:06}", f"r{i:06}", "synthetic", "original") for i in range(n)))
            db.executemany(
                f"INSERT INTO maintainer_calculation ({CALCULATION_COLUMNS},scope,calculation_reference) "
                "VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
                           (("bench", f"r{i:06}", "original", "synthetic", None, None, None, None, "synthetic", None, "ORIGINAL_RECIPE", "synthetic") for i in range(n)))
            build_ms = (time.perf_counter_ns() - started) / 1_000_000
            times = {}
            for mode in ("source", "impact", "approval"):
                samples = []
                for i in range(100):
                    suffix = (i * 977) % n
                    key = f'{"r" if mode == "approval" else "i"}{suffix:06}'
                    start = time.perf_counter_ns()
                    result = lookup(db, "bench", mode, key)
                    samples.append((time.perf_counter_ns() - start) / 1_000_000)
                    if len(result["rows"]) != 1:
                        raise ValueError("Synthetic query result differs")
                times[mode] = {"medianMs": statistics.median(samples), "p95Ms": sorted(samples)[94]}
            query_plans = [
                db.execute("EXPLAIN QUERY PLAN SELECT * FROM " + table + " WHERE snapshot=? AND " + key + "=?",
                           ("bench", "i000000")).fetchall()
                for table,key in zip(TABLES, ("legacy_id","legacy_id","recipe_id"))
            ]
            if any(not all("SEARCH" in row[3] for row in plan) for plan in query_plans):
                raise ValueError("A maintainer lookup scans its table")
            pages, page_size = (db.execute("PRAGMA "+key).fetchone()[0] for key in ("page_count", "page_size"))
            reports.append({"observations": n, "representativeSqliteBytes": pages * page_size,
                            "buildMs": build_ms, "queryMs": times, "queryPlans": query_plans})
    return reports
