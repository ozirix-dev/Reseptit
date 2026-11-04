#!/usr/bin/env python3
"""Local GI and composition evidence search for GK100 review."""
from __future__ import annotations

import argparse
from collections import Counter, defaultdict
from contextlib import closing, contextmanager
import json
from pathlib import Path
import re
import sqlite3
import sys
import unicodedata

import gi_sqlite_index as index

DEFAULT_COMPOSITION = index.ROOT / "docs/nutrition/food-records.json"
DEFAULT_INDEX = index.ROOT / ".cache/gk100/evidence-v2.sqlite"
EVIDENCE_SCHEMA = "2"


def _json_digest(value: object) -> str:
    return index._digest(json.dumps(value, sort_keys=True, ensure_ascii=False, allow_nan=False).encode("utf-8"))


def _words(text: str) -> list[str]:
    normalized = unicodedata.normalize("NFKD", text.casefold())
    folded = "".join(char for char in normalized if not unicodedata.combining(char))
    return re.findall(r"[^\W_]+", folded)


def _source_text(*fields: object) -> str:
    return " ".join(_words(" ".join(str(field) for field in fields if field)))


def _composition_rows(raw: bytes) -> list[dict]:
    rows = json.loads(raw)
    if not isinstance(rows, list):
        raise ValueError("Composition registry must be an array")
    for row in rows:
        if not isinstance(row, dict) or any(
            not isinstance(row.get(key), str) or not row[key].strip()
            for key in ("id", "name", "sourceUrl", "basis", "state", "carbohydrateDefinition")
        ):
            raise ValueError("Composition records require an ID, name, source, basis, state and CHO definition")
    return rows


def _extend_index(db, sources, gi_records, composition_raw, composition_sha):
    composition = _composition_rows(composition_raw)
    sources_by_url = defaultdict(list)
    for source in sources:
        sources_by_url[source.get("url")].append(source)

    try:
        db.execute("CREATE VIRTUAL TABLE evidence_text USING fts5(kind UNINDEXED, record_id UNINDEXED, text)")
        engine = "FTS5"
    except sqlite3.OperationalError as exc:
        if "no such module: fts5" not in str(exc).lower():
            raise
        db.execute("CREATE TABLE evidence_text (kind TEXT, record_id TEXT, text TEXT)")
        engine = "SQLITE_TOKEN_SCAN"
    db.execute("CREATE TABLE composition_record (record_key TEXT PRIMARY KEY, id TEXT NOT NULL, payload_json TEXT NOT NULL)")
    db.execute("CREATE INDEX composition_by_id ON composition_record(id)")
    db.executemany("INSERT INTO metadata VALUES (?, ?)", [
        ("evidence_schema", EVIDENCE_SCHEMA), ("composition_sha256", composition_sha), ("text_engine", engine),
    ])
    db.execute("ALTER TABLE gi_record ADD COLUMN calculation_use TEXT")
    db.executemany("UPDATE gi_record SET calculation_use = ? WHERE id = ?",
                   [(row.get("calculationUse"), row["id"]) for row in gi_records])
    for row in sorted(gi_records, key=lambda value: value["id"]):
        source = row["source"]
        registered = sources_by_url.get(source.get("url"), [])
        text = _source_text(row["id"], row["foodKey"], row["preparationKey"], row.get("food"),
                            row.get("preparation"), row.get("note"), source.get("title"),
                            source.get("qualityEvidence"), source.get("table"),
                            *(entry.get(field) for entry in registered for field in ("title", "use")))
        db.execute("INSERT INTO evidence_text VALUES ('GI', ?, ?)", (row["id"], text))
    for row in sorted(composition, key=lambda value: value["id"]):
        text = _source_text(row["id"], row["name"], row["state"], row.get("primaryReference"),
                            row.get("definitionEvidence"), row.get("licence"))
        record_key = _json_digest(row)
        inserted = db.execute("INSERT OR IGNORE INTO composition_record VALUES (?, ?, ?)",
                              (record_key, row["id"], json.dumps(row, ensure_ascii=False, allow_nan=False)))
        if inserted.rowcount:
            db.execute("INSERT INTO evidence_text VALUES ('COMPOSITION', ?, ?)", (record_key, text))


def _verify(db, source_sha, composition_sha):
    db.execute("BEGIN")
    meta = index._index_metadata(db)
    if (meta["schema_version"], meta["source_sha256"], meta.get("evidence_schema"),
        meta.get("composition_sha256")) != (index.SCHEMA_VERSION, source_sha, EVIDENCE_SCHEMA, composition_sha):
        raise index.StaleIndexError("GI evidence index does not match the source snapshots")
    if meta.get("text_engine") not in {"FTS5", "SQLITE_TOKEN_SCAN"}:
        raise ValueError("GI evidence index has invalid text-search metadata")
    if "calculation_use" not in {row[1] for row in db.execute("PRAGMA table_info(gi_record)")}:
        raise index.StaleIndexError("GI evidence index is missing its calculation-use column")
    db.execute("SELECT record_key, id, payload_json FROM composition_record LIMIT 0")
    try:
        db.execute("SELECT kind, record_id, text FROM evidence_text LIMIT 0")
    except sqlite3.OperationalError as exc:
        if "no such module: fts5" in str(exc).lower():
            raise index.StaleIndexError("FTS5 is unavailable in this SQLite runtime") from exc
        raise
    db.row_factory = sqlite3.Row
    return meta


@contextmanager
def evidence_snapshot(source=index.DEFAULT_SOURCE, composition=DEFAULT_COMPOSITION, destination=DEFAULT_INDEX):
    """Read each source once and keep all queries in one SQLite read transaction."""
    if destination.resolve() in {source.resolve(), composition.resolve()}:
        raise ValueError("Evidence index destination must differ from both canonical source paths")
    raw, composition_raw = source.read_bytes(), composition.read_bytes()
    source_sha, composition_sha = index._digest(raw), index._digest(composition_raw)
    if destination.exists():
        with closing(index._open_index(destination)) as db:
            try:
                meta = _verify(db, source_sha, composition_sha)
            except index.StaleIndexError:
                pass
            else:
                yield db, meta
                return
    def extend(db, sources, records):
        _extend_index(db, sources, records, composition_raw, composition_sha)

    index._build_index(source, destination, raw, source_sha, extend=extend, replace_attempts=3)
    with closing(index._open_index(destination)) as db:
        yield db, _verify(db, source_sha, composition_sha)


def _text_ids(db, engine, text, kind, limit):
    tokens = list(dict.fromkeys(_words(text)))
    if len(tokens) > 64:
        raise ValueError("Evidence text search supports at most 64 distinct words")
    if not tokens:
        return []
    if engine == "FTS5":
        # Only normalized words become literal FTS tokens. User text cannot provide FTS operators.
        expression = " AND ".join(f'"{word}"' for word in tokens)
        rows = db.execute(
            "SELECT record_id FROM evidence_text WHERE evidence_text MATCH ? AND kind = ? "
            "ORDER BY rank, record_id LIMIT ?", (expression, kind, limit),
        )
    else:
        conditions = " AND ".join("instr(' ' || text || ' ', ?) > 0" for _ in tokens)
        rows = db.execute(
            f"SELECT record_id FROM evidence_text WHERE kind = ? AND {conditions} ORDER BY record_id LIMIT ?",
            (kind, *(f" {token} " for token in tokens), limit),
        )
    return [row[0] for row in rows]


def _gi_record(db, record_id):
    return db.execute("SELECT * FROM gi_record WHERE id = ?", (record_id,)).fetchone()


def _compose(row, match):
    return {**json.loads(row["payload_json"]), "recordSha256": row["record_key"],
            "retrieval": match, "requiresRecipeSpecificApproval": True}


def _gi_candidate(row, retrieval, food_key, preparation_key, sources_by_url):
    evidence = json.loads(row["payload_json"])
    candidate = index._candidate(row, preparation_key, evidence=evidence)
    reference = evidence["source"]
    registry_sources = sources_by_url.get(reference.get("url"), [])
    source_ids = [source["id"] for source in registry_sources]
    warnings = []
    if candidate["calculationUse"] == "REFERENCE_ONLY":
        warnings.append("REFERENCE_ONLY")
    if candidate["evidenceKind"] == "PUBLISHED_IMPUTATION":
        warnings.append("PUBLISHED_IMPUTATION")
    if candidate["matchKind"] in {"ANALOG", "CATEGORY_MEAN"}:
        warnings.append("POSSIBLE_ANALOGUE")
    if food_key and row["food_key"] != food_key:
        warnings.append("FOOD_KEY_MISMATCH")
    if preparation_key and row["preparation_key"] != preparation_key:
        warnings.append("PREPARATION_MISMATCH")
    if not source_ids:
        warnings.append("SOURCE_REGISTRY_ID_NOT_LINKED")
    if retrieval == "TEXT_MATCH":
        warnings.append("APPLICABILITY_UNVERIFIED")
    return {**candidate, "retrieval": retrieval, "sourceRegistryIds": source_ids,
            "registrySources": registry_sources, "source": reference,
            "originalSourceCard": evidence.get("originalSourceCard"),
            "originalSourceCardScope": evidence.get("originalSourceCardScope"), "warnings": warnings}


def _request(db, engine, request, sources_by_url):
    limit = request.get("limit", 12)
    if type(limit) is not int or not 1 <= limit <= 100:
        raise ValueError("Evidence search limit must be an integer from 1 to 100")
    text, food, preparation, gi_id, composition_id = (
        request.get(key) for key in ("text", "foodKey", "preparationKey", "giRecordId", "compositionRecordId")
    )
    if any(value is not None and (not isinstance(value, str) or not value.strip())
           for value in (text, food, preparation, gi_id, composition_id)):
        raise ValueError("Evidence search terms and keys must be nonempty strings")
    gi_rows = {}
    if gi_id:
        row = _gi_record(db, gi_id)
        if row is not None:
            gi_rows[gi_id] = (row, "BOUND_RECORD")
    if food:
        for row in db.execute(
            "SELECT * FROM gi_record WHERE food_key = ? ORDER BY (preparation_key = ?) DESC, "
            "preparation_key, CASE WHEN calculation_use = 'REFERENCE_ONLY' THEN 1 ELSE 0 END, id LIMIT ?",
            (food, preparation, limit),
        ):
            match = ("EXACT_KEY_MATCH" if preparation and row["preparation_key"] == preparation
                     else "PREPARATION_MISMATCH" if preparation else "FOOD_KEY_MATCH")
            gi_rows.setdefault(row["id"], (row, match))
    compositions = {}
    bound_compositions = 0
    if composition_id:
        for row in db.execute("SELECT * FROM composition_record WHERE id = ? ORDER BY record_key", (composition_id,)):
            compositions[row["record_key"]] = _compose(row, "BOUND_RECORD")
        bound_compositions = len(compositions)
    if text:
        for record_id in _text_ids(db, engine, text, "GI", limit):
            if record_id not in gi_rows:
                gi_rows[record_id] = (_gi_record(db, record_id), "TEXT_MATCH")
        for key in _text_ids(db, engine, text, "COMPOSITION", limit):
            if key not in compositions:
                row = db.execute("SELECT * FROM composition_record WHERE record_key = ?", (key,)).fetchone()
                compositions[key] = _compose(row, "TEXT_MATCH")
    gi = [_gi_candidate(row, match, food, preparation, sources_by_url)
          for row, match in list(gi_rows.values())[:limit]]
    gaps = []
    if gi_id and gi_id not in gi_rows:
        gaps.append("BOUND_GI_NOT_IN_REGISTRY")
    if composition_id and not bound_compositions:
        gaps.append("BOUND_COMPOSITION_NOT_IN_REGISTRY")
    if bound_compositions > 1:
        gaps.append("AMBIGUOUS_COMPOSITION_ID")
    if not gi_id and not any(item["retrieval"] == "EXACT_KEY_MATCH" for item in gi):
        if any(item["retrieval"] == "PREPARATION_MISMATCH" for item in gi):
            gaps.append("NO_PREPARATION_MATCH")
        else:
            gaps.append("NO_EXACT_GI_KEY" if gi else "NO_GI_LEAD")
    if any(item["retrieval"] == "BOUND_RECORD" and
           {"FOOD_KEY_MISMATCH", "PREPARATION_MISMATCH"}.intersection(item["warnings"]) for item in gi):
        gaps.append("GI_BINDING_KEY_MISMATCH")
    if gi_id:
        reference_only = any(item["recordId"] == gi_id and item["calculationUse"] == "REFERENCE_ONLY"
                             for item in gi)
    else:
        exact = [item for item in gi if item["retrieval"] == "EXACT_KEY_MATCH"]
        reference_only = bool(exact) and all(item["calculationUse"] == "REFERENCE_ONLY" for item in exact)
    if reference_only:
        gaps.append("GI_REFERENCE_ONLY")
    if not composition_id:
        gaps.append("COMPOSITION_BINDING_REQUIRED" if compositions else "NO_COMPOSITION_LEAD")
    if gaps:
        review = "UNSUPPORTED"
    else:
        review = "REVIEW_REQUIRED"
    return {"gi": gi, "composition": list(compositions.values())[:max(limit, bound_compositions)],
            "gaps": gaps, "review": review}


def lookup_gi_batch(requests, *, source=index.DEFAULT_SOURCE, composition=DEFAULT_COMPOSITION,
                    destination=DEFAULT_INDEX):
    if not isinstance(requests, list) or any(not isinstance(row, dict) for row in requests):
        raise ValueError("Evidence requests must be an array of objects")
    fields = {"id", "text", "foodKey", "preparationKey", "giRecordId", "compositionRecordId", "limit"}
    for row in requests:
        unknown = row.keys() - fields
        if unknown:
            raise ValueError(f"Unknown evidence request fields: {', '.join(sorted(unknown))}")
    ids = [row.get("id") for row in requests]
    if any(not isinstance(key, str) or not key.strip() for key in ids) or len(set(ids)) != len(ids):
        raise ValueError("Evidence requests require unique, nonempty string IDs")
    request_sha = _json_digest(requests)
    cached = {}
    results = []
    with evidence_snapshot(source, composition, destination) as (db, meta):
        sources_by_url = defaultdict(list)
        for row in db.execute("SELECT url, payload_json FROM source_registry WHERE url IS NOT NULL ORDER BY id"):
            sources_by_url[row["url"]].append(json.loads(row["payload_json"]))
        for request in requests:
            terms = {key: value for key, value in request.items() if key != "id"}
            key = json.dumps(terms, sort_keys=True, ensure_ascii=False)
            if key not in cached:
                cached[key] = _request(db, meta["text_engine"], terms, sources_by_url)
            results.append({"id": request["id"], **cached[key]})
    return {"requestSha256": request_sha, "indexSnapshotSha256": _json_digest(meta),
            "sourceSha256": meta["source_sha256"], "compositionSha256": meta["composition_sha256"],
            "evidenceSchema": EVIDENCE_SCHEMA, "textEngine": meta["text_engine"],
            "autoApproved": False, "results": results}


def _queue_requests(recipes, *, inventory):
    requests, ingredients = [], []
    for recipe in recipes:
        blockers = defaultdict(list)
        for code, message in recipe.get("blockers", []):
            name, separator, _ = message.partition(":")
            if separator:
                blockers[_source_text(name)].append({"code": code, "detail": message})
        for position, item in enumerate(recipe.get("ingredients", []), 1):
            request_id = f"{recipe['recipeId']}:{position}"
            gi_id = item.get("giId" if inventory else "giRecordId")
            composition_id = item.get("composition" if inventory else "fineliRecordId")
            requests.append({"id": request_id, "text": item["name"], "foodKey": item.get("foodKey"),
                             "preparationKey": item.get("preparationKey"), "giRecordId": gi_id,
                             "compositionRecordId": composition_id})
            ingredients.append({"id": request_id, "recipeId": recipe["recipeId"], "ingredient": item["name"],
                                "grams": item.get("grams"), "recipeQuantity": item.get("recipeQuantity"),
                                "queueCho": item.get("cho"), "queueChoRange": item.get("choRange"),
                                "queueChoUpperBound": item.get("choUpperBound"),
                                "pilotChoEstimatePerServing": item.get("estimatedAvailableCarbohydratePerServingG"),
                                "pilotChoEstimateEvidence": item.get("negligibleAssumption"),
                                "queueBlockers": blockers.get(_source_text(item["name"]), []),
                                "existingGiRecordId": gi_id,
                                "existingCompositionRecordId": composition_id,
                                "existingApplicabilityEvidence": item.get("giMatchEvidence"),
                                "excludedReason": item.get("excludedReason")})
    return requests, ingredients


def review_queue(path, recipe_ids=(), *, inventory=True, **context):
    raw = path.read_bytes()
    if inventory:
        header, *recipes = [json.loads(line) for line in raw.splitlines() if line.strip()]
        if header.get("schemaVersion") != 1 or not isinstance(header.get("main"), str):
            raise ValueError("Expected a GK100 Evidence Recovery V1-format inventory")
        recipes = [row for row in recipes if row.get("status") == "NO_PUBLISHED_NUMERIC_GK"]
    else:
        header, recipes = {}, json.loads(raw)["recipes"]
    if recipe_ids:
        selected = set(recipe_ids)
        recipes = [recipe for recipe in recipes if recipe["recipeId"] in selected]
        missing = selected - {recipe["recipeId"] for recipe in recipes}
        if missing:
            raise ValueError(f"Recipes unavailable in this queue selection: {', '.join(sorted(missing))}")
    requests, ingredients = _queue_requests(recipes, inventory=inventory)
    output = lookup_gi_batch(requests, **context)
    shared = defaultdict(set)
    reuse = defaultdict(set)
    for entry, result in zip(ingredients, output["results"], strict=True):
        result.update(entry)
        inventory_zero = entry["queueCho"] == 0 and not entry["queueChoRange"] and not entry["queueChoUpperBound"]
        pilot_zero = entry["pilotChoEstimatePerServing"] == 0 and bool(entry["pilotChoEstimateEvidence"])
        if (inventory_zero or pilot_zero) and not entry["queueBlockers"] and not entry["existingGiRecordId"]:
            gi_search_gaps = {"NO_GI_LEAD", "NO_EXACT_GI_KEY", "NO_PREPARATION_MATCH", "GI_REFERENCE_ONLY"}
            result["gaps"] = [gap for gap in result["gaps"] if gap not in gi_search_gaps]
            result["giRequirement"] = "NOT_NEEDED_FOR_DOCUMENTED_ZERO_CHO"
            if not result["gaps"]:
                result["review"] = "REVIEW_REQUIRED"
        recipe = entry["recipeId"]
        term = _source_text(entry["ingredient"])
        for blocker in entry["queueBlockers"]:
            shared[(blocker["code"], term)].add(recipe)
        if entry["existingGiRecordId"]:
            reuse[entry["existingGiRecordId"]].add(recipe)
    priorities = [
        {"blockerCode": code, "ingredientTerm": term, "recipeCount": len(ids), "recipeIds": sorted(ids)}
        for (code, term), ids in sorted(shared.items(), key=lambda item: (-len(item[1]), item[0]))[:20]
    ]
    selected_recipes = {row["recipeId"] for row in recipes}
    targets = []
    for target in header.get("priorityTargets", []):
        related = [recipe for recipe in target["recipeIds"] if recipe in selected_recipes]
        if related:
            targets.append({**target, "recipeIds": related})
    return {**output, "queueInputSha256": index._digest(raw), "queueMain": header.get("main"),
            "queueFormat": "EVIDENCE_RECOVERY_INVENTORY" if inventory else "NORMALIZED_PILOT_INPUT",
            "recipes": [{key: row[key] for key in ("recipeId", "queueState", "recipeSha256", "inputSha256",
                                                   "blockers", "sourceRights") if key in row} for row in recipes],
            "gapCounts": dict(Counter(gap for row in output["results"] for gap in row["gaps"])),
            "priorityGaps": priorities,
            "inventoryPriorityTargets": targets[:20],
            "existingGiReuse": {record: sorted(ids) for record, ids in sorted(reuse.items())},
            "review": "REVIEW_REQUIRED"}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--db", type=Path, default=DEFAULT_INDEX)
    parser.add_argument("--gi-source", type=Path, default=index.DEFAULT_SOURCE)
    parser.add_argument("--composition-source", type=Path, default=DEFAULT_COMPOSITION)
    inputs = parser.add_mutually_exclusive_group(required=True)
    inputs.add_argument("--requests", type=Path, help="JSON array of evidence search requests")
    inputs.add_argument("--inventory", type=Path, help="GK100 Evidence Recovery JSONL inventory")
    inputs.add_argument("--pilot", type=Path, help="normalized GK calculation pilot JSON")
    parser.add_argument("--recipe", action="append", default=[])
    args = parser.parse_args()
    context = {"source": args.gi_source, "composition": args.composition_source, "destination": args.db}
    try:
        if args.requests:
            if args.recipe:
                parser.error("--recipe applies only to --inventory and --pilot")
            result = lookup_gi_batch(json.loads(args.requests.read_bytes()), **context)
        else:
            if args.pilot and not args.recipe:
                parser.error("select at least one --recipe with --pilot")
            result = review_queue(args.inventory or args.pilot, args.recipe, inventory=bool(args.inventory), **context)
    except (OSError, ValueError, sqlite3.Error) as exc:
        parser.exit(1, f"GI evidence search failed: {exc}\n")
    sys.stdout.reconfigure(encoding="utf-8")
    print(json.dumps(result, ensure_ascii=False, indent=2, allow_nan=False))


if __name__ == "__main__":
    main()
