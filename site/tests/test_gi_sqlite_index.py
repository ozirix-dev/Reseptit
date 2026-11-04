"""No dependencies beyond Python stdlib. Run: python3 -m unittest discover -s site/tests -p 'test_gi_sqlite_index.py'"""

import importlib.util
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch

SCRIPT = Path(__file__).resolve().parents[1] / "scripts/gi_sqlite_index.py"
spec = importlib.util.spec_from_file_location("gi_sqlite_index", SCRIPT)
index = importlib.util.module_from_spec(spec)
spec.loader.exec_module(index)


class GiSqliteIndexTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.source = Path(self.tmp.name) / "gi.json"
        self.db = Path(self.tmp.name) / "gi.sqlite"
        self.data = {
            "sourcePolicy": "Source evidence only; never auto-approve.",
            "sources": [{"id": "study", "title": "Study", "url": "https://example.org/gi"}],
            "records": [
                {"id": "raw", "foodKey": "potato", "preparationKey": "raw", "gi": 50,
                 "qualityTier": "SUPPLEMENTARY", "referenceScale": "GLUCOSE_100",
                 "matchKind": "ANALOG", "source": {"url": "https://example.org/raw", "table": "A"}},
                {"id": "boiled", "foodKey": "potato", "preparationKey": "boiled", "gi": 101,
                 "qualityTier": "STRONG", "referenceScale": "GLUCOSE_100",
                 "source": {"url": "https://example.org/boiled", "table": "B"}},
            ],
        }
        self.write()

    def write(self):
        self.source.write_text(json.dumps(self.data, ensure_ascii=False), encoding="utf-8")

    def test_build_query_preparation_isolation_and_provenance(self):
        first = index.build_index(self.source, self.db)
        self.assertEqual(first["records"], 2)
        self.assertEqual(index.stats(self.source, self.db)["qualityTiers"], {"STRONG": 1, "SUPPLEMENTARY": 1})
        result = index.lookup(self.source, self.db, "potato", "boiled")
        self.assertEqual([r["recordId"] for r in result["candidates"]], ["boiled"])
        self.assertEqual(result["candidates"][0]["gi"], 101)
        self.assertEqual(result["candidates"][0]["sourceUrl"], "https://example.org/boiled")
        self.assertTrue(result["candidates"][0]["requiresRecipeSpecificApproval"])
        self.assertFalse(result["autoApproved"])
        comparison = index.lookup(self.source, self.db, "potato", "boiled", include_other_preparations=True)
        self.assertEqual(len(comparison["candidates"]), 2)
        self.assertEqual(comparison["candidates"][1]["matchAssessment"], "PREPARATION_NOT_ESTABLISHED")
        self.assertEqual(index.lookup(self.source, self.db, "potato", "roasted")["candidates"], [])
        self.assertEqual(index.lookup(self.source, self.db, "banana", "boiled")["candidates"], [])

    def test_batch_preserves_results_and_verifies_once(self):
        queries = [
            {"food_key": "potato", "preparation_key": "raw"},
            {"food_key": "banana"},
            {"food_key": "potato", "preparation_key": "boiled", "include_other_preparations": True, "limit": 1},
            {"food_key": "potato", "preparation_key": "raw"},
        ]
        index.build_index(self.source, self.db)
        expected = [index.lookup(self.source, self.db, **query) for query in queries]
        with patch.object(index, "_digest", wraps=index._digest) as digest, \
             patch.object(index.sqlite3, "connect", wraps=index.sqlite3.connect) as connect:
            self.assertEqual(index.lookup_batch(self.source, self.db, queries), expected)
            digest.assert_called_once()
            connect.assert_called_once()

    def test_batch_builds_and_refreshes_index(self):
        queries = [{"food_key": "potato", "preparation_key": "raw"}]
        with patch.object(index, "_digest", wraps=index._digest) as digest:
            self.assertEqual(index.lookup_batch(self.source, self.db, queries)[0]["candidates"][0]["gi"], 50)
            digest.assert_called_once()
        self.data["records"][0]["gi"] = 58
        self.write()
        with patch.object(index, "_digest", wraps=index._digest) as digest:
            self.assertEqual(index.lookup_batch(self.source, self.db, queries)[0]["candidates"][0]["gi"], 58)
            digest.assert_called_once()

    def test_batch_cli_writes_utf8_json(self):
        self.data["records"][0]["source"]["table"] = "Table ± 1"
        self.write()
        query_file = self.source.with_name("queries.json")
        query_file.write_text(json.dumps([{"food_key": "potato", "preparation_key": "raw"}]), encoding="utf-8")
        output = subprocess.check_output([
            sys.executable, "-B", str(SCRIPT), "lookup-batch", "--source", str(self.source),
            "--db", str(self.db), "--queries", str(query_file),
        ], env={**os.environ, "PYTHONIOENCODING": "cp1252"})
        self.assertEqual(json.loads(output)[0]["candidates"][0]["sourceLocator"], "Table ± 1")

    def test_batch_preserves_non_index_file(self):
        self.db.write_bytes(b"not a generated GI index")
        with self.assertRaises(index.sqlite3.DatabaseError):
            index.lookup_batch(self.source, self.db, [{"food_key": "potato"}])
        self.assertEqual(self.db.read_bytes(), b"not a generated GI index")

    def test_stale_source_and_rebuild(self):
        index.build_index(self.source, self.db)
        self.data["records"][0]["gi"] = 58
        self.write()
        with self.assertRaisesRegex(ValueError, "stale"):
            index.lookup(self.source, self.db, "potato")
        index.build_index(self.source, self.db)
        self.assertEqual(index.lookup(self.source, self.db, "potato", "raw")["candidates"][0]["gi"], 58)

    def test_duplicate_and_bad_gi_fail_without_replacing_good_index(self):
        index.build_index(self.source, self.db)
        original = self.db.read_bytes()
        self.data["records"].append(dict(self.data["records"][0]))
        self.write()
        with self.assertRaisesRegex(ValueError, "Duplicate"):
            index.build_index(self.source, self.db)
        self.assertEqual(original, self.db.read_bytes())
        self.data["records"].pop()
        self.data["records"][0]["gi"] = -1
        self.write()
        with self.assertRaisesRegex(ValueError, "invalid GI"):
            index.build_index(self.source, self.db)


if __name__ == "__main__":
    unittest.main()
