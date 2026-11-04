#!/usr/bin/env python3
"""Rebuildable, read-only SQLite search cache for the reviewed GI JSON registry.

Search results are evidence leads, never recipe-level GI/GK approvals.
"""
from __future__ import annotations

import argparse
from contextlib import closing
import hashlib
import json
import math
import os
from pathlib import Path
import sqlite3
import sys
import tempfile

ROOT = Path(__file__).resolve().parents[2]
DEFAULT_SOURCE = ROOT / "docs/nutrition/glycemic-index-records.json"
SCHEMA_VERSION = "1"


def _digest(raw: bytes) -> str:
    return hashlib.sha256(raw).hexdigest()


def _check_registry(data: object) -> tuple[list[dict], list[dict]]:
    if not isinstance(data, dict) or not isinstance(data.get("sources"), list) or not isinstance(data.get("records"), list):
        raise ValueError("Expected sources[] and records[] in canonical GI JSON")
    sources, records = data["sources"], data["records"]
    for label, items in (("source", sources), ("record", records)):
        ids: set[str] = set()
        for item in items:
            if not isinstance(item, dict) or not isinstance(item.get("id"), str) or not item["id"].strip():
                raise ValueError(f"Invalid {label} identifier")
            if item["id"] in ids:
                raise ValueError(f"Duplicate {label} identifier: {item['id']}")
            ids.add(item["id"])
    for row in records:
        for name in ("foodKey", "preparationKey", "qualityTier", "referenceScale"):
            if not isinstance(row.get(name), str) or not row[name].strip():
                raise ValueError(f"Record {row['id']}: missing {name}")
        gi = row.get("gi")
        if isinstance(gi, bool) or not isinstance(gi, (float, int)) or not math.isfinite(gi) or gi < 0:
            raise ValueError(f"Record {row['id']}: invalid GI")
        if not isinstance(row.get("source"), dict):
            raise ValueError(f"Record {row['id']}: missing source provenance")
    return sources, records


class StaleIndexError(ValueError):
    """The generated index exists but needs to be rebuilt."""


def build_index(source: Path, destination: Path) -> dict:
    raw = source.read_bytes()
    return _build_index(source, destination, raw, _digest(raw))


def _build_index(source: Path, destination: Path, raw: bytes, source_sha256: str) -> dict:
    if source.resolve() == destination.resolve():
        raise ValueError("SQLite output must differ from source JSON")
    sources, records = _check_registry(json.loads(raw))
    destination.parent.mkdir(parents=True, exist_ok=True)
    fd, temporary = tempfile.mkstemp(prefix=".gi-index-", suffix=".sqlite", dir=destination.parent)
    os.close(fd)
    try:
        with closing(sqlite3.connect(temporary)) as db, db:
            db.executescript("""
                CREATE TABLE metadata (key TEXT PRIMARY KEY, value TEXT NOT NULL);
                CREATE TABLE source_registry (
                    id TEXT PRIMARY KEY, title TEXT, url TEXT, payload_json TEXT NOT NULL
                );
                CREATE TABLE gi_record (
                    id TEXT PRIMARY KEY,
                    food_key TEXT NOT NULL,
                    preparation_key TEXT NOT NULL,
                    food TEXT,
                    preparation TEXT,
                    gi REAL NOT NULL,
                    reference_scale TEXT NOT NULL,
                    quality_tier TEXT NOT NULL,
                    match_kind TEXT,
                    confidence TEXT,
                    source_url TEXT,
                    source_locator TEXT,
                    payload_json TEXT NOT NULL
                );
                CREATE INDEX gi_food_preparation ON gi_record(food_key, preparation_key);
                CREATE INDEX gi_food ON gi_record(food_key);
            """)
            db.executemany("INSERT INTO metadata(key, value) VALUES (?, ?)", [
                ("schema_version", SCHEMA_VERSION),
                ("source_sha256", source_sha256),
                ("source_count", str(len(sources))),
                ("record_count", str(len(records))),
            ])
            for row in sorted(sources, key=lambda r: r["id"]):
                db.execute("INSERT INTO source_registry VALUES (?, ?, ?, ?)", (
                    row["id"], row.get("title"), row.get("url"), json.dumps(row, sort_keys=True, ensure_ascii=False),
                ))
            for row in sorted(records, key=lambda r: r["id"]):
                ref = row["source"]
                db.execute("INSERT INTO gi_record VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", (
                    row["id"], row["foodKey"], row["preparationKey"], row.get("food"),
                    row.get("preparation"), row["gi"], row["referenceScale"], row["qualityTier"],
                    row.get("matchKind"), row.get("confidence"), ref.get("url"),
                    str(ref.get("table") or ref.get("locator") or ""),
                    json.dumps(row, sort_keys=True, ensure_ascii=False),
                ))
        os.replace(temporary, destination)
    finally:
        if os.path.exists(temporary):
            os.unlink(temporary)
    return {"sourceSha256": source_sha256, "sources": len(sources), "records": len(records), "db": str(destination)}


def _open_verified(destination: Path, source_sha256: str) -> sqlite3.Connection:
    db = sqlite3.connect(destination.resolve().as_uri() + "?mode=ro", uri=True)
    db.row_factory = sqlite3.Row
    try:
        meta = dict(db.execute("SELECT key, value FROM metadata"))
        if "schema_version" not in meta or "source_sha256" not in meta:
            raise ValueError("SQLite file is missing GI index metadata")
        if meta["schema_version"] != SCHEMA_VERSION:
            raise StaleIndexError("SQLite index schema mismatch: rebuild required")
        if meta["source_sha256"] != source_sha256:
            raise StaleIndexError("SQLite index is stale against canonical GI JSON: rebuild required")
    except Exception:
        db.close()
        raise
    return db


def _open_batch(source: Path, destination: Path) -> sqlite3.Connection:
    raw = source.read_bytes()
    source_sha256 = _digest(raw)
    if destination.exists():
        try:
            return _open_verified(destination, source_sha256)
        except StaleIndexError:
            pass
    _build_index(source, destination, raw, source_sha256)
    return _open_verified(destination, source_sha256)


def lookup(source: Path, destination: Path, food_key: str, preparation_key: str | None = None,
           include_other_preparations: bool = False, limit: int = 30) -> dict:
    with closing(_open_verified(destination, _digest(source.read_bytes()))) as db:
        return _lookup(db, food_key, preparation_key, include_other_preparations, limit)


def lookup_batch(source: Path, destination: Path, queries: list[dict]) -> list[dict]:
    """Search a single verified snapshot and return results in request order."""
    if not isinstance(queries, list) or any(not isinstance(query, dict) for query in queries):
        raise ValueError("Batch queries must be a JSON array of query objects")
    with closing(_open_batch(source, destination)) as db:
        return [_lookup(db, **query) for query in queries]


def _lookup(db: sqlite3.Connection, food_key: str, preparation_key: str | None = None,
            include_other_preparations: bool = False, limit: int = 30) -> dict:
    if not isinstance(food_key, str) or not food_key.strip() or type(limit) is not int or not 1 <= limit <= 500:
        raise ValueError("Provide food_key and 1 <= limit <= 500")
    if preparation_key is not None and not isinstance(preparation_key, str):
        raise ValueError("preparation_key must be a string or null")
    if not isinstance(include_other_preparations, bool):
        raise ValueError("include_other_preparations must be a boolean")
    query = "SELECT * FROM gi_record WHERE food_key = ?"
    params: list = [food_key]
    if preparation_key is not None and not include_other_preparations:
        query += " AND preparation_key = ?"
        params.append(preparation_key)
    query += " ORDER BY preparation_key, id LIMIT ?"
    params.append(limit)
    rows = db.execute(query, params).fetchall()
    candidates = []
    for row in rows:
        same_preparation = preparation_key is not None and row["preparation_key"] == preparation_key
        candidates.append({
            "recordId": row["id"], "foodKey": row["food_key"],
            "preparationKey": row["preparation_key"], "gi": row["gi"],
            "referenceScale": row["reference_scale"], "qualityTier": row["quality_tier"],
            "matchKind": row["match_kind"] or "UNSPECIFIED",
            "confidence": row["confidence"], "sourceUrl": row["source_url"],
            "sourceLocator": row["source_locator"],
            "matchAssessment": "SAME_PREPARATION_KEY_NEEDS_REVIEW" if same_preparation else "PREPARATION_NOT_ESTABLISHED",
            "requiresRecipeSpecificApproval": True,
        })
    return {"foodKey": food_key, "preparationKey": preparation_key,
            "candidates": candidates, "autoApproved": False,
            "note": "Search hits are evidence leads, never automatic GI or GK approvals."}


def stats(source: Path, destination: Path) -> dict:
    with closing(_open_verified(destination, _digest(source.read_bytes()))) as db:
        meta = dict(db.execute("SELECT key, value FROM metadata"))
        category = dict(db.execute("SELECT quality_tier, COUNT(*) FROM gi_record GROUP BY quality_tier"))
    return {"sourceSha256": meta["source_sha256"], "sources": int(meta["source_count"]),
            "records": int(meta["record_count"]), "qualityTiers": category}


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("mode", choices=("build", "lookup", "lookup-batch", "stats"))
    parser.add_argument("--source", type=Path, default=DEFAULT_SOURCE)
    parser.add_argument("--db", type=Path, required=True)
    parser.add_argument("--queries", type=Path, help="JSON array for lookup-batch")
    parser.add_argument("--food-key")
    parser.add_argument("--preparation-key")
    parser.add_argument("--include-other-preparations", action="store_true")
    parser.add_argument("--limit", type=int, default=30)
    args = parser.parse_args()
    if args.mode == "build":
        result = build_index(args.source, args.db)
    elif args.mode == "stats":
        result = stats(args.source, args.db)
    elif args.mode == "lookup-batch":
        if args.queries is None:
            parser.error("lookup-batch requires --queries")
        try:
            result = lookup_batch(args.source, args.db, json.loads(args.queries.read_bytes()))
        except (ValueError, TypeError) as exc:
            parser.error(str(exc))
    else:
        if not args.food_key:
            parser.error("lookup requires --food-key")
        result = lookup(args.source, args.db, args.food_key, args.preparation_key,
                        args.include_other_preparations, args.limit)
    sys.stdout.reconfigure(encoding="utf-8")
    print(json.dumps(result, ensure_ascii=False, indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
