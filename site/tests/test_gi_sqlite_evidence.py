"""GI/GK evidence search compatibility and read-only workflow tests."""
from contextlib import closing
import json
from pathlib import Path
import sqlite3
import sys
import tempfile
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
import gi_sqlite_evidence as evidence
import gi_sqlite_index as index


class GiEvidenceTests(unittest.TestCase):
    def setUp(self):
        scratch = tempfile.TemporaryDirectory(prefix="gk100 sqlite v2 ")
        self.addCleanup(scratch.cleanup)
        self.root = Path(scratch.name)
        self.source = self.root / "GI.json"
        self.composition = self.root / "CHO.json"
        self.db = self.root / "index #1.sqlite"
        self.context = {"source": self.source, "composition": self.composition, "destination": self.db}
        self.registry = {
            "sources": [{"id": "study", "title": "Cooled potato study", "url": "https://example.org/study",
                         "use": "Review only"}],
            "records": [
                {"id": "boiled", "foodKey": "potato", "preparationKey": "boiled", "food": "Keitetty peruna",
                 "preparation": "Jäähdytetty", "gi": 65, "qualityTier": "STRONG", "referenceScale": "GLUCOSE_100",
                 "calculationUse": "REFERENCE_ONLY", "evidenceKind": "HUMAN_GI", "matchKind": "EXACT",
                 "note": "Use limited to the study preparation.", "source": {"url": "https://example.org/study",
                                                                              "table": "Table 1"}},
                {"id": "steamed", "foodKey": "potato", "preparationKey": "steamed", "food": "Höyrytetty peruna",
                 "gi": 55, "qualityTier": "SUPPLEMENTARY", "referenceScale": "GLUCOSE_100",
                 "matchKind": "ANALOG", "source": {"url": "https://example.org/unregistered"}},
            ],
        }
        self.foods = [{"id": "food-1", "name": "Jäähdytetty peruna", "sourceUrl": "https://example.org/composition",
                       "basis": "per100g-edible", "state": "boiled", "carbohydrateDefinition": "EU_AVAILABLE",
                       "licence": "CC BY 4.0", "per100g": {"carbohydrate": 15}}]
        self.write_sources()

    def write_sources(self):
        for path, data in ((self.source, self.registry), (self.composition, self.foods)):
            path.write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")

    def search(self, *requests):
        return evidence.lookup_gi_batch(list(requests), **self.context)

    def test_warm_batch_uses_one_connection_and_matches_v1_for_73_requests(self):
        index.build_index(self.source, self.db)
        queries = [{"food_key": "potato", "preparation_key": "steamed"}] * 73
        expected = index.lookup_batch(self.source, self.db, queries)
        requests = [{"id": str(i), "foodKey": "potato", "preparationKey": "steamed"} for i in range(73)]
        self.search(*requests)
        with patch.object(index, "_open_index", wraps=index._open_index) as open_index, \
             patch.object(index, "_digest", wraps=index._digest) as digest, \
             patch.object(evidence, "_request", wraps=evidence._request) as search:
            actual = self.search(*requests)
            open_index.assert_called_once()
            search.assert_called_once()
            hashed = [call.args[0] for call in digest.call_args_list]
            self.assertEqual(hashed.count(self.source.read_bytes()), 1)
            self.assertEqual(hashed.count(self.composition.read_bytes()), 1)
        self.assertEqual([row["id"] for row in actual["results"]], [str(i) for i in range(73)])
        for row, v1 in zip(actual["results"], expected, strict=True):
            self.assertEqual([i["recordId"] for i in row["gi"] if i["retrieval"] == "EXACT_KEY_MATCH"],
                             [i["recordId"] for i in v1["candidates"]])
            self.assertIn("PREPARATION_MISMATCH", row["gi"][1]["warnings"])
        self.assertEqual(index.lookup_batch(self.source, self.db, queries), expected)

    def test_unicode_fts_search_keeps_provenance_and_does_not_elevate_text_match(self):
        report = self.search({"id": "text", "text": "JÄÄHDYTETTY peruna"},
                             {"id": "fts-literal", "text": 'potato" OR "*" --'},
                             {"id": "source-title", "text": "cooled potato study"})
        hit, unsafe, title = report["results"]
        self.assertIn(report["textEngine"], {"FTS5", "SQLITE_TOKEN_SCAN"})
        self.assertFalse(report["autoApproved"])
        self.assertEqual(hit["review"], "UNSUPPORTED")
        gi = hit["gi"][0]
        self.assertEqual(gi["retrieval"], "TEXT_MATCH")
        self.assertEqual(gi["sourceRegistryIds"], ["study"])
        self.assertEqual(gi["registrySources"][0]["use"], "Review only")
        self.assertEqual(gi["evidenceKind"], "HUMAN_GI")
        self.assertIn("REFERENCE_ONLY", gi["warnings"])
        self.assertEqual(hit["composition"][0]["licence"], "CC BY 4.0")
        self.assertEqual(unsafe["gi"], [])
        self.assertEqual(title["gi"][0]["recordId"], "boiled")

    def test_sqlite_text_fallback_uses_bound_words(self):
        with closing(sqlite3.connect(":memory:")) as db:
            db.execute("CREATE TABLE evidence_text(kind, record_id, text)")
            db.execute("INSERT INTO evidence_text VALUES ('GI', 'one', 'jaahdytetty peruna')")
            self.assertEqual(evidence._text_ids(db, "SQLITE_TOKEN_SCAN", "Jäähdytetty peruna", "GI", 2), ["one"])
            self.assertEqual(evidence._text_ids(db, "SQLITE_TOKEN_SCAN", 'peruna OR "*"', "GI", 2), [])

    def test_reference_only_alternative_does_not_invalidate_usable_binding(self):
        self.registry["records"].append({**self.registry["records"][0], "id": "usable", "calculationUse": None})
        self.write_sources()
        keys = {"foodKey": "potato", "preparationKey": "boiled", "compositionRecordId": "food-1"}
        bound, exact, restricted = self.search(
            {"id": "bound", "giRecordId": "usable", **keys},
            {"id": "exact", "limit": 1, **keys},
            {"id": "restricted", "giRecordId": "boiled", **keys},
        )["results"]
        self.assertNotIn("GI_REFERENCE_ONLY", bound["gaps"])
        self.assertNotIn("GI_REFERENCE_ONLY", exact["gaps"])
        self.assertIn("GI_REFERENCE_ONLY", restricted["gaps"])

    def test_text_search_rejects_excess_terms_instead_of_ignoring_them(self):
        words = " ".join(f"term{i}" for i in range(65))
        with self.assertRaisesRegex(ValueError, "at most 64 distinct words"):
            self.search({"id": "overlong", "text": words})

    def test_conflicting_composition_rows_are_reported_and_stale_data_is_rebuilt(self):
        requests = {"id": "conflict", "compositionRecordId": "food-1", "giRecordId": "steamed", "limit": 1}
        prior = self.search(requests)
        self.foods.append({**self.foods[0], "state": "raw"})
        self.write_sources()
        actual = self.search(requests)
        self.assertNotEqual(prior["compositionSha256"], actual["compositionSha256"])
        result = actual["results"][0]
        self.assertIn("AMBIGUOUS_COMPOSITION_ID", result["gaps"])
        self.assertEqual({r["state"] for r in result["composition"]}, {"boiled", "raw"})
        self.assertEqual(len({r["recordSha256"] for r in result["composition"]}), 2)
        self.assertIn("SOURCE_REGISTRY_ID_NOT_LINKED", result["gi"][0]["warnings"])
        old_index = self.db.read_bytes()
        self.composition.write_text("[] corrupt", encoding="utf-8")
        with self.assertRaises(ValueError):
            self.search(requests)
        self.assertEqual(self.db.read_bytes(), old_index)

    def test_foreign_database_is_preserved(self):
        with closing(sqlite3.connect(self.db)) as db:
            db.execute("CREATE TABLE unrelated (data TEXT)")
        original = self.db.read_bytes()
        with self.assertRaisesRegex(ValueError, "not a GI index"):
            self.search({"id": "one", "text": "potato"})
        self.assertEqual(self.db.read_bytes(), original)

    def test_open_reader_is_snapshot_bound_during_rebuild(self):
        self.search({"id": "one", "giRecordId": "boiled"})
        with evidence.evidence_snapshot(**self.context) as (reader, meta):
            self.registry["records"][0]["gi"] = 80
            self.write_sources()
            if sys.platform == "win32":
                with self.assertRaisesRegex(ValueError, "file in use or access denied"):
                    self.search({"id": "two", "giRecordId": "boiled"})
            else:
                report = self.search({"id": "two", "giRecordId": "boiled"})
                self.assertNotEqual(report["sourceSha256"], meta["source_sha256"])
            self.assertEqual(evidence._gi_record(reader, "boiled")["gi"], 65)
        fresh = self.search({"id": "two", "giRecordId": "boiled"})
        self.assertEqual(fresh["results"][0]["gi"][0]["gi"], 80)

    def test_inventory_adapter_keeps_scope_existing_decisions_and_prioritizes_real_blockers(self):
        queue = self.root / "queue.jsonl"
        header = {"schemaVersion": 1, "main": "base", "priorityTargets": [{"target": "potato", "recipeIds": ["x", "y"]}]}
        rows = [
            {"recipeId": "x", "status": "NO_PUBLISHED_NUMERIC_GK", "queueState": "SOURCE_BLOCKED",
             "recipeSha256": "recipe", "inputSha256": "inputs", "blockers": [["E2", "Jauho: GI missing"]],
             "ingredients": [{"name": "Jauho", "grams": 100}, {"name": "Suola", "cho": 0}]},
            {"recipeId": "y", "status": "PUBLISHED_NUMERIC_GK", "ingredients": []},
        ]
        queue.write_text("\n".join(json.dumps(row) for row in (header, *rows)), encoding="utf-8")
        report = evidence.review_queue(queue, **self.context)
        self.assertEqual(report["queueMain"], "base")
        self.assertEqual(report["recipes"][0]["queueState"], "SOURCE_BLOCKED")
        self.assertEqual(report["recipes"][0]["inputSha256"], "inputs")
        self.assertEqual(report["priorityGaps"], [
            {"blockerCode": "E2", "ingredientTerm": "jauho", "recipeCount": 1, "recipeIds": ["x"]},
        ])
        self.assertEqual(report["inventoryPriorityTargets"][0]["recipeIds"], ["x"])
        self.assertEqual(report["results"][0]["review"], "UNSUPPORTED")
        self.assertEqual(report["results"][1]["giRequirement"], "NOT_NEEDED_FOR_DOCUMENTED_ZERO_CHO")
        self.assertNotIn("NO_GI_LEAD", report["results"][1]["gaps"])
        self.assertFalse(report["autoApproved"])
