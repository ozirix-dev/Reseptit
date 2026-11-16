import sqlite3
import sys
import unittest
from pathlib import Path
from tempfile import TemporaryDirectory

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))

import gi_gk_maintainer as pilot


class MaintainerQueries(unittest.TestCase):
    def test_pagination_keeps_distinct_roles_and_revision(self):
        with sqlite3.connect(":memory:") as db:
            db.executescript(pilot.INDEXED)
            db.executemany("INSERT INTO maintainer_dependency VALUES (?,?,?,?)", [
                ("one", "gi", "r1", "audit-result"), ("one", "gi", "r1", "public-original"),
                ("one", "gi", "r2", "calculation-input"), ("other", "gi", "r3", "public-original"),
            ])
            first = pilot.lookup(db, "one", "impact", "gi", limit=1)
            second = pilot.lookup(db, "one", "impact", "gi", after=first["next"], limit=2)
            self.assertEqual(first["rows"], [{"recipe_id": "r1", "role": "audit-result"}])
            self.assertEqual(second["rows"], [
                {"recipe_id": "r1", "role": "public-original"},
                {"recipe_id": "r2", "role": "calculation-input"},
            ])
            self.assertIsNone(second["next"])

    def test_generated_array_keeps_null_and_zero(self):
        raw = b'export const example: Row[] = [{"gi": null}, {"gi": 0}];\n'
        self.assertEqual(pilot.generated_array(raw, "example"), [{"gi": None}, {"gi": 0}])
        with self.assertRaises(ValueError):
            pilot.generated_array(raw, "missing")

    def test_portable_export_removes_value_bearing_ids_and_keeps_links(self):
        snapshot = "test-snapshot"
        ids = pilot.CASES
        with TemporaryDirectory() as directory, sqlite3.connect(":memory:") as db:
            folder = Path(directory)
            pilot.save(folder / "manifest.json", {"revision": "test-revision"})
            db.executescript(pilot.INDEXED)
            for case, legacy in ids.items():
                observation = ids["direct"] if case == "analogue" else legacy
                preparation = legacy if case == "imputed" else "preparation"
                db.execute("INSERT INTO maintainer_source VALUES (?,?,?,?,?,?,?,?,?,?,?)", (
                    snapshot, legacy, observation, "https://example.org/study", "private locator",
                    "HUMAN_GI", None, 114, "GLUCOSE_100", "food", preparation,
                ))
            db.execute("INSERT INTO maintainer_dependency VALUES (?,?,?,?)", (
                snapshot, ids["analogue"], pilot.CHAIN_RECIPE, "public-original",
            ))
            db.execute("INSERT INTO maintainer_calculation VALUES (?,?,?,?,?,?,?,?,?,?)", (
                snapshot, pilot.CHAIN_RECIPE, "original", "A", 1.0, None, None, None,
                "PUBLISHED_AND_BASELINE_BINDING_MATCHES", None,
            ))
            self.assertEqual(pilot.export_preview(db, snapshot, folder)["localReplayWrites"], 0)
            sql = (folder / "d1-preview/import.sql").read_text(encoding="utf-8")
            for legacy in ids.values():
                self.assertNotIn(legacy, sql)
            self.assertNotIn("private locator", sql)
            self.assertIn("whole-tomato-raw", sql)
            self.assertIn("tomato-raw-cooked-sauce-analogue", sql)
