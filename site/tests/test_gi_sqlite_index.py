"""No dependencies beyond Python stdlib. Run: python3 -m unittest discover -s site/tests -p 'test_gi_sqlite_index.py'"""

import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

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
