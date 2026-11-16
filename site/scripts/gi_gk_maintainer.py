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
from urllib.parse import urlsplit

import gi_sqlite_index as index

ROOT = index.ROOT
INPUTS = (
    "docs/nutrition/glycemic-index-records.json",
    "docs/nutrition/food-records.json",
    "docs/nutrition/glycemic-load-pilot-input.json",
    "docs/nutrition/glycemic-load-recipe-bindings.json",
    "docs/nutrition/gk80-release-registry.json",
)
GENERATED = (
    "tmp/nutrition/glycemic-load-pilot.json",
    "site/src/generated/glycemic-load-pilot.generated.ts",
    "site/src/generated/gk-only-variants.generated.ts",
    "site/src/generated/glycemic-load-filters.generated.ts",
)
INDEXED = """
CREATE TABLE maintainer_source (
  snapshot TEXT NOT NULL, legacy_id TEXT NOT NULL, observation_id TEXT NOT NULL,
  source_url TEXT NOT NULL, locator TEXT, kind TEXT NOT NULL, applicability TEXT,
  gi REAL, reference_scale TEXT NOT NULL, food_key TEXT NOT NULL, preparation_key TEXT NOT NULL,
  PRIMARY KEY (snapshot, legacy_id)
);
CREATE INDEX maintainer_food ON maintainer_source(snapshot, food_key, preparation_key, legacy_id);
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
CASES = {
    "preparation": "potato-fried-evoo-lady-rosetta-gi-114",
    "analogue": "tomato-raw-cooked-sauce-analogue-gi-22",
    "direct": "whole-tomato-raw-gi-22",
    "imputed": "op142-vegetable-imputation40",
    "rights": "red-pepper-literature-analogue-gi-40",
}
TOMATO = "whole-tomato-raw-gi-22"
VARIANT_RECIPE = "keto-mutakakku"
CHAIN_RECIPE = "gazpacho"
TABLES = ("maintainer_source", "maintainer_dependency", "maintainer_calculation")


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
    for script, args in (
        ("build-content.ts", []), ("nutrition-audit.ts", ["--strict"]), ("glycemic-load-pilot.ts", []),
    ):
        result = subprocess.run(["node", "--import", "tsx", "scripts/" + script, *args],
                                cwd=ROOT / "site", env=env, capture_output=True, encoding="utf-8",
                                errors="replace")
        if result.returncode:
            raise ValueError(f"{script} failed:\n{result.stderr[-4000:]}")
    if current_revision() != revision:
        raise ValueError("Checkout changed during capture")
    folder.mkdir(parents=True, exist_ok=True)
    report = json.loads((ROOT / GENERATED[0]).read_bytes())
    report.pop("generatedAt", None)
    save(folder / "audit.json", report)
    publish = {}
    for key, path, symbol in (
        ("originals", GENERATED[1], "glycemicLoadPilotResults"),
        ("variants", GENERATED[2], "gkOnlyVariants"),
    ):
        publish[key] = generated_array((ROOT / path).read_bytes(), symbol)
    save(folder / "public.json", publish)
    manifest = {
        "version": 1, "revision": revision, "tree": git("rev-parse", "HEAD^{tree}"),
        "activeInputs": {p: digest((ROOT / p).read_bytes()) for p in INPUTS},
        "auditSha256": digest((folder / "audit.json").read_bytes()),
        "publicSha256": digest((folder / "public.json").read_bytes()),
        "publicModuleSha256": {p: digest((ROOT / p).read_bytes()) for p in GENERATED[1:]},
    }
    save(folder / "manifest.json", manifest)
    return manifest


def load_capture(folder):
    manifest = json.loads((folder / "manifest.json").read_bytes())
    if manifest["version"] != 1 or manifest["revision"] != current_revision():
        raise ValueError("Stale GI/GK capture: run capture for this revision")
    for path, expected in manifest["activeInputs"].items():
        if digest((ROOT / path).read_bytes()) != expected:
            raise ValueError("GI/GK input is newer than its capture: " + path)
    results = []
    for name in ("audit", "public"):
        raw = (folder / (name + ".json")).read_bytes()
        if digest(raw) != manifest[name + "Sha256"]:
            raise ValueError("GI/GK capture checksum failed: " + name)
        results.append(json.loads(raw))
    return manifest, *results


def checked_folder(folder):
    folder = folder.resolve()
    if folder.is_relative_to(ROOT) and not folder.is_relative_to(ROOT / "tmp"):
        raise ValueError("GI/GK artifacts must go under repo tmp/ or outside the checkout")
    return folder


def inventory():
    registry = json.loads(index.DEFAULT_SOURCE.read_bytes())
    inputs = json.loads((ROOT / INPUTS[2]).read_bytes())
    uses = {}
    for recipe in inputs["recipes"]:
        for row in recipe["ingredients"]:
            if row.get("giRecordId"):
                uses.setdefault(row["giRecordId"], set()).add(recipe["recipeId"])
    return [
        {"id": r["id"], "source": r["source"].get("url"), "locator": r["source"].get("table"),
         "food": r["foodKey"], "preparation": r["preparationKey"],
         "evidenceKind": r.get("evidenceKind") or "NEEDS_REVIEW",
         "usage": r.get("calculationUse") or "SEE_RECIPE_BINDING",
         "boundInputRecipes": sorted(uses.get(r["id"], ())),
         "unresolved": [key for key in ("table", "url") if not r["source"].get(key)]}
        for r in registry["records"]
    ]


def collect(db, snapshot, registry, audit, public, bindings):
    sources = []
    for r in registry["records"]:
        ref = r["source"]
        # Identical reported tomato evidence has two legacy applications. Keep the legacy IDs.
        observation = TOMATO if r["id"] == CASES["analogue"] else r["id"]
        kind = r.get("evidenceKind") or "NEEDS_REVIEW"
        if r["id"] == CASES["preparation"]:
            kind = "HUMAN_GI"
        sources.append((snapshot, r["id"], observation, ref["url"], ref.get("table"),
                        kind, r.get("matchKind"), r.get("gi"), r["referenceScale"],
                        r["foodKey"], r["preparationKey"]))
    db.executemany("INSERT INTO maintainer_source VALUES (?,?,?,?,?,?,?,?,?,?,?)", sources)

    uses = set()
    for label, records in (("calculation-input", audit["calculationInputs"]),
                           ("audit-result", audit["results"]),
                           ("public-original", public["originals"])):
        for row in records:
            for ingredient in row.get("ingredientEvidence", []) or row.get("ingredients", []):
                if ingredient.get("giRecordId"):
                    uses.add((snapshot, ingredient["giRecordId"], row["recipeId"], label))
    db.executemany("INSERT INTO maintainer_dependency VALUES (?,?,?,?)", sorted(uses))
    public_ids = {r["recipeId"] for r in public["originals"] if r["status"] == "CALCULATED"}
    review_path = INPUTS[3]
    for row in audit["results"]:
        recipe = row["recipeId"]
        hashes = tuple(audit[key].get(recipe) for key in ("sourceHashes", "calculationInputHashes", "calculationEvidenceHashes"))
        bound = all(h and bindings.get(key, {}).get(recipe) == h for key, h in
                    zip(("recipes", "calculationInputs", "calculationEvidence"), hashes))
        state = "PUBLISHED_AND_BASELINE_BINDING_MATCHES" if recipe in public_ids and bound else (
            "PUBLISHED_CHECK_RELEASE_PATH" if recipe in public_ids else "NO_PUBLISHED_NUMERIC_ORIGINAL")
        db.execute("INSERT INTO maintainer_calculation VALUES (?,?,?,?,?,?,?,?,?,?)",
                   (snapshot, recipe, "original", row["status"], row["glycemicLoadPerServing"], *hashes,
                    state, review_path if bound else "site/scripts/glycemic-load-pilot.ts"))
    for variant in public["variants"]:
        db.execute("INSERT INTO maintainer_calculation VALUES (?,?,?,?,?,?,?,?,?,?)",
                   (snapshot, variant["recipeId"], variant["versionId"], variant["level"], variant.get("point"),
                    None, variant["inputSha256"], None, "PUBLISHED_VARIANT",
                    "site/src/generated/gk-only-variants.generated.ts"))


def open_pilot(folder, evidence):
    folder = checked_folder(folder)
    manifest, audit, public = load_capture(folder)
    snapshot = digest(encode(manifest))
    destination = folder / "maintainer.sqlite"
    raw = index.DEFAULT_SOURCE.read_bytes()
    composition = evidence.DEFAULT_COMPOSITION.read_bytes()
    expected = manifest["activeInputs"][INPUTS[0]]
    if destination.exists():
        with closing(index._open_index(destination)) as db:
            try:
                meta = evidence._verify(db, expected, digest(composition))
                if meta.get("maintainer_snapshot") == snapshot:
                    return destination, snapshot
            except index.StaleIndexError:
                pass
    def extend(db, sources, records):
        evidence._extend_index(db, sources, records, composition, digest(composition))
        db.executescript(INDEXED)
        collect(db, snapshot, {"records": records}, audit, public, json.loads((ROOT / INPUTS[3]).read_bytes()))
        db.execute("INSERT INTO metadata VALUES ('maintainer_snapshot',?)", (snapshot,))
    index._build_index(index.DEFAULT_SOURCE, destination, raw, expected, extend=extend, replace_attempts=3)
    return destination, snapshot


def lookup(db, snapshot, mode, key, after="", limit=50):
    if not 1 <= limit <= 100:
        raise ValueError("Limit must be 1–100")
    if mode == "source":
        sql = "SELECT * FROM maintainer_source WHERE snapshot=? AND legacy_id=?"
        params = (snapshot, key)
    elif mode == "impact":
        sql = ("SELECT recipe_id,role FROM maintainer_dependency "
               "WHERE snapshot=? AND legacy_id=? AND (recipe_id,role)>(?,?) "
               "ORDER BY recipe_id,role LIMIT ?")
        recipe, _, role = after.partition(":")
        params = (snapshot, key, recipe, role, limit + 1)
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
        next_key = rows[-1]["recipe_id"] + ":" + rows[-1]["role"] if mode == "impact" else rows[-1]["version_id"]
    result = {"snapshot": snapshot, "query": mode, "id": key, "rows": rows, "next": next_key}
    if mode == "impact":
        result["scope"] = "Exact legacy ID references. Variant-only links without a GI identifier are unverified."
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
    selected = {value for key, value in CASES.items() if key != "rights"}
    def rows(table, query):
        return [tuple(row) for row in db.execute(query, (snapshot,))]
    by_table = {
        "maintainer_source": [
            (s, legacy, observation, url, None, kind, applicability, None, scale, food, preparation)
            for s, legacy, observation, url, locator, kind, applicability, gi, scale, food, preparation
            in rows("maintainer_source", "SELECT * FROM maintainer_source WHERE snapshot=? ORDER BY legacy_id")
            if legacy in selected and urlsplit(url).scheme == "https"
        ],
        "maintainer_dependency": [
            row for row in rows("maintainer_dependency", "SELECT * FROM maintainer_dependency WHERE snapshot=? ORDER BY legacy_id,recipe_id,role")
            if row[1] in selected and row[3] == "public-original"
        ],
        "maintainer_calculation": [
            row for row in rows("maintainer_calculation", "SELECT * FROM maintainer_calculation WHERE snapshot=? ORDER BY recipe_id,version_id")
            if (row[1] == VARIANT_RECIPE and row[8] == "PUBLISHED_VARIANT")
            or (row[1] == CHAIN_RECIPE and row[2] == "original"
                and row[8] == "PUBLISHED_AND_BASELINE_BINDING_MATCHES")
        ],
    }
    schema = ("CREATE TABLE preview_snapshots (id TEXT PRIMARY KEY, revision TEXT NOT NULL);\n"
              "CREATE TABLE preview_active (slot INTEGER PRIMARY KEY CHECK(slot=1), snapshot TEXT NOT NULL REFERENCES preview_snapshots(id));\n"
              + INDEXED)
    (output / "schema.sql").write_text(schema, encoding="utf-8", newline="\n")
    revision = json.loads((folder / "manifest.json").read_bytes())["revision"]
    def insert(table, row):
        return f"INSERT INTO {table} VALUES ({','.join(map(sql_value, row))}) ON CONFLICT DO NOTHING;\n"
    sql = insert("preview_snapshots", (snapshot, revision))
    for table in TABLES:
        sql += "".join(insert(table, row) for row in by_table[table])
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
        if restored.execute("SELECT legacy_id FROM maintainer_source WHERE legacy_id=? OR gi IS NOT NULL",
                            (CASES["rights"],)).fetchall():
            raise ValueError("Preview contains restricted evidence")
        if not any(row["recipe_id"] == CHAIN_RECIPE for row in lookup(restored, snapshot, "impact", CASES["analogue"])["rows"]):
            raise ValueError("Portable impact lookup lost the linked recipe")
        if len(lookup(restored, snapshot, "source", CASES["analogue"])["rows"]) != 1:
            raise ValueError("Portable lookup lost the source record")
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
            db.executemany("INSERT INTO maintainer_source VALUES (?,?,?,?,?,?,?,?,?,?,?)",
                           (("bench", f"i{i:06}", f"o{i:06}", "", None, "synthetic", None, None, "glucose", "food", "raw") for i in range(n)))
            db.executemany("INSERT INTO maintainer_dependency VALUES (?,?,?,?)",
                           (("bench", f"i{i:06}", f"r{i:06}", "synthetic") for i in range(n)))
            db.executemany("INSERT INTO maintainer_calculation VALUES (?,?,?,?,?,?,?,?,?,?)",
                           (("bench", f"r{i:06}", "original", "synthetic", None, None, None, None, "synthetic", None) for i in range(n)))
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

