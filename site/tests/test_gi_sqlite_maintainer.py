import sqlite3
import sys
import unittest
from pathlib import Path

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

