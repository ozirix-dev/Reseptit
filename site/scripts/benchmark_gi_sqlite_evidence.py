#!/usr/bin/env python3
"""Compare 73 searches from 30 GK pilot recipes against the same registry."""
from collections import defaultdict
from contextlib import closing
import argparse
import json
import math
from pathlib import Path
import statistics
import subprocess
import sys
import tempfile
from time import perf_counter

import gi_sqlite_evidence as evidence
import gi_sqlite_index as v1


def workloads(records):
    keys = {row["id"]: (row["foodKey"], row["preparationKey"]) for row in records}
    pilot = json.loads(v1.DEFAULT_SOURCE.with_name("glycemic-load-pilot-input.json").read_bytes())
    recipes = []
    for row in sorted(pilot["recipes"], key=lambda item: item["recipeId"]):
        recipe_keys = tuple(dict.fromkeys(keys[item["giRecordId"]] for item in row["ingredients"]
                                          if item.get("giRecordId") in keys))
        if recipe_keys:
            recipes.append(recipe_keys)
    cases = [key for recipe in recipes[:30] for key in recipe]
    if len(recipes) < 30 or len(cases) != 73:
        raise ValueError(f"The historical 30-recipe benchmark now has {len(cases)} queries")
    return cases


def json_index(raw):
    mapping = defaultdict(list)
    for row in json.loads(raw)["records"]:
        mapping[row["foodKey"], row["preparationKey"]].append(row["id"])
    return {key: tuple(sorted(ids)) for key, ids in mapping.items()}


def summarize(timings):
    ordered = sorted(timings)
    return {"median": round(statistics.median(ordered), 3),
            "p95": round(ordered[math.ceil(len(ordered) * .95) - 1], 3)}


def benchmark(repeats, directory):
    source, composition = v1.DEFAULT_SOURCE, evidence.DEFAULT_COMPOSITION
    raw, composition_raw = source.read_bytes(), composition.read_bytes()
    source_sha, composition_sha = v1._digest(raw), v1._digest(composition_raw)
    cases = workloads(json.loads(raw)["records"])
    queries = [{"id": str(i), "foodKey": food, "preparationKey": prep} for i, (food, prep) in enumerate(cases)]
    query_file = directory / "queries.json"
    query_file.write_text(json.dumps(queries), encoding="utf-8")
    v1_db, v2_db = directory / "v1.sqlite", directory / "v2.sqlite"
    script = Path(evidence.__file__).resolve()
    mapping = json_index(raw)
    expected = [mapping.get(key, ()) for key in cases]
    results = {}

    def measure(label, task, validate=None):
        timings = []
        for _ in range(repeats):
            start = perf_counter()
            result = task()
            timings.append((perf_counter() - start) * 1000)
            if validate is not None and not validate(result):
                raise ValueError(f"Search result mismatch: {label}")
        results[label] = summarize(timings)

    def build():
        v2_db.unlink(missing_ok=True)
        with evidence.evidence_snapshot(source, composition, v2_db) as (_, meta):
            return meta["text_engine"]

    def cli():
        completed = subprocess.run([sys.executable, "-B", str(script), "--db", str(v2_db), "--requests",
                                    str(query_file)], check=True, stdout=subprocess.PIPE)
        return exact_ids(json.loads(completed.stdout))

    def exact_ids(report):
        return [tuple(row["recordId"] for row in result["gi"] if row["retrieval"] == "EXACT_KEY_MATCH")
                for result in report["results"]]

    def v1_individual():
        return [tuple(item["recordId"] for item in v1.lookup(source, v1_db, *key)["candidates"]) for key in cases]

    def verified_connection():
        with closing(v1._open_index(v2_db)) as db:
            return evidence._verify(db, source_sha, composition_sha)

    v1.build_index(source, v1_db)
    measure("python_process_start", lambda: subprocess.run([sys.executable, "-B", "-c", "pass"], check=True))
    measure("read_and_sha_both_sources", lambda: (v1._digest(source.read_bytes()), v1._digest(composition.read_bytes())))
    measure("json_load_index_and_73", lambda: [m.get(key, ()) for m in [json_index(source.read_bytes())] for key in cases],
            lambda ids: ids == expected)
    measure("json_warm_73", lambda: [mapping.get(key, ()) for key in cases], lambda ids: ids == expected)
    measure("v1_individual_73", v1_individual, lambda ids: ids == expected)
    measure("v1_batch_73", lambda: [tuple(item["recordId"] for item in result["candidates"])
                                    for result in v1.lookup_batch(source, v1_db,
                                        [{"food_key": food, "preparation_key": prep} for food, prep in cases])],
            lambda ids: ids == expected)
    measure("v2_build_and_open", build)
    measure("v2_open_verify_close", verified_connection)
    first, remaining = [], []
    for _ in range(repeats):
        with closing(v1._open_index(v2_db)) as db:
            evidence._verify(db, source_sha, composition_sha)
            start = perf_counter()
            initial = v1._lookup(db, *cases[0])
            middle = perf_counter()
            rest = [v1._lookup(db, *key) for key in cases[1:]]
            end = perf_counter()
            if [tuple(hit["recordId"] for hit in result["candidates"]) for result in [initial, *rest]] != expected:
                raise ValueError("Search result mismatch in SQL query timing")
            first.append((middle - start) * 1000)
            remaining.append((end - middle) * 1000)
    results["v2_first_exact_sql_and_format"] = summarize(first)
    results["v2_next_72_exact_sql_and_format"] = summarize(remaining)
    measure("v2_batch_73", lambda: exact_ids(evidence.lookup_gi_batch(queries, destination=v2_db)),
            lambda ids: ids == expected)
    terms = [{"id": "potato", "text": "boiled potato"}, {"id": "rice", "text": "rice noodles"},
             {"id": "coconut", "text": "coconut milk"}]
    measure("v2_text_search_3", lambda: evidence.lookup_gi_batch(terms, destination=v2_db),
            lambda report: all(row["gi"] or row["composition"] for row in report["results"]))
    measure("v2_cli_73", cli, lambda ids: ids == expected)
    return {"recipes": 30, "queries": len(cases), "uniqueKeys": len(set(cases)), "repeats": repeats,
            "textEngine": verified_connection()["text_engine"], "milliseconds": results}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repeats", type=int, default=15)
    args = parser.parse_args()
    if not 3 <= args.repeats <= 100:
        parser.error("choose 3 to 100 repeats")
    with tempfile.TemporaryDirectory(prefix="sqlite-v2-benchmark-") as temp:
        print(json.dumps(benchmark(args.repeats, Path(temp)), indent=2))


if __name__ == "__main__":
    main()
