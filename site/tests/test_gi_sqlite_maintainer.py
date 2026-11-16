import json
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
            db.executemany("INSERT INTO maintainer_dependency VALUES (?,?,?,?,?)", [
                ("one", "gi", "r1", "audit-result", "original"), ("one", "gi", "r1", "public-original", "original"),
                ("one", "gi", "r2", "calculation-input", "original"), ("other", "gi", "r3", "public-original", "original"),
            ])
            first = pilot.lookup(db, "one", "impact", "gi", limit=1)
            second = pilot.lookup(db, "one", "impact", "gi", after=first["next"], limit=2)
            self.assertEqual([(r["recipe_id"], r["role"]) for r in first["rows"]], [("r1", "audit-result")])
            self.assertEqual([(r["recipe_id"], r["role"]) for r in second["rows"]], [
                ("r1", "public-original"), ("r2", "calculation-input"),
            ])
            self.assertIsNone(second["next"])

    def test_generated_array_keeps_null_and_zero(self):
        raw = b'export const example: Row[] = [{"gi": null}, {"gi": 0}];\n'
        self.assertEqual(pilot.generated_array(raw, "example"), [{"gi": None}, {"gi": 0}])
        with self.assertRaises(ValueError):
            pilot.generated_array(raw, "missing")

    def test_gk_calculation_and_publication_are_independent(self):
        def original(recipe, point, status="CALCULATED"):
            return {"recipeId": recipe, "glycemicLoadPerServing": point, "status": status}

        variant = {"recipeId": "missing", "versionId": "v1", "point": None, "level": "B",
                   "scenarioRange": {"min": 4, "max": 8}, "rangeKind": "NAMED_COMPARATOR_SCENARIOS",
                   "inputSha256": "variant-input", "evidenceSha256": "variant-evidence",
                   "sensitivity": {"min": 1, "max": 12, "kind": "ASSUMPTION_ONLY"}}
        study = {**variant, "studyServing": True, "versionId": "study", "point": 2,
                 "scenarioRange": {"min": 2, "max": 3}, "rangeKind": None}
        audit = {
            "calculationInputs": [], "results": [
                original("point", 5), original("zero", 0),
                original("missing", None, "INSUFFICIENT SOURCE DATA"), original("stale", 7),
            ],
            "sourceHashes": {"point": "recipe", "stale": "recipe"},
            "calculationInputHashes": {"point": "input", "stale": "input"},
            "calculationEvidenceHashes": {"point": "evidence", "stale": "evidence"},
            "recipeBindingMismatches": ["stale"],
            "gkOnlyVariants": [variant, study],
        }
        bindings = {key: {"point": value, "stale": value} for key, value in (
            ("recipes", "recipe"), ("calculationInputs", "input"), ("calculationEvidence", "evidence"),
        )}
        public = {"originals": [
            original("point", 5), original("zero", 0),
            {**original("missing", None, "INSUFFICIENT SOURCE DATA"), "incompleteReasons": [{"category": "GI"}]},
            original("stale", None, "INSUFFICIENT SOURCE DATA"),
        ], "variants": [variant]}
        with sqlite3.connect(":memory:") as db:
            db.executescript(pilot.INDEXED)
            pilot.collect(db, "test", {"records": []}, audit, public, bindings)

            def approval(recipe):
                return {r["version_id"]: r for r in pilot.lookup(db, "test", "approval", recipe)["rows"]}

            self.assertEqual(approval("point")["original"]["public_gk"], 5)
            self.assertEqual(approval("point")["original"]["approval"], "PUBLISHED_AND_BASELINE_BINDING_MATCHES")
            self.assertEqual(approval("zero")["original"]["public_gk"], 0)
            self.assertIsNone(approval("missing")["original"]["gk"])
            self.assertEqual(approval("missing")["original"]["blocker_categories"], "GI")
            self.assertEqual(approval("stale")["original"]["gk"], 7)
            self.assertIsNone(approval("stale")["original"]["public_gk"])
            self.assertEqual(approval("stale")["original"]["approval"], "NO_PUBLISHED_NUMERIC_ORIGINAL_BINDING_MISMATCH")
            published = approval("missing")["v1"]
            self.assertEqual(published["approval"], "PUBLISHED_VARIANT")
            self.assertIsNone(published["public_gk"])
            self.assertEqual((published["public_range_min"], published["public_range_max"],
                              published["public_range_kind"]), (4, 8, "NAMED_COMPARATOR_SCENARIOS"))
            self.assertEqual(published["evidence_sha256"], "variant-evidence")
            self.assertEqual(published["sensitivity_kind"], "ASSUMPTION_ONLY")
            unpublished = approval("missing")["study"]
            self.assertEqual(unpublished["approval"], "UNPUBLISHED_STUDY_COMPARISON")
            self.assertEqual((unpublished["gk"], unpublished["range_kind"]), (2, "UNKNOWN"))
            self.assertIsNone(unpublished["public_range_min"])

    def test_observation_aliases_require_the_same_source_evidence(self):
        registry = json.loads(pilot.index.DEFAULT_SOURCE.read_bytes())["records"]
        legacy = "tomato-cherry-raw-analogue-gi-22"
        ids = pilot.observation_ids(registry)
        self.assertEqual(ids[legacy], pilot.TOMATO)
        self.assertNotEqual(ids[pilot.CASES["preparation"]], ids["potato-fried-evoo-spunta-gi-83"])
        row = next(r for r in registry if r["id"] == legacy)
        self.assertEqual(pilot.observation_kind(row), "SECONDARY_REFERENCE")
        self.assertEqual(row["matchKind"], "ANALOG")
        row["source"]["table"] = "Unrelated table in the same publication"
        self.assertEqual(pilot.observation_ids(registry)[legacy], legacy)

    def test_portable_export_removes_value_bearing_ids_and_keeps_links(self):
        capture = {"revision": "test-revision", "tree": "test-tree", "activeInputs": {}}
        snapshot = pilot.digest(pilot.encode(capture))
        ids = pilot.CASES
        with TemporaryDirectory() as directory, sqlite3.connect(":memory:") as db:
            folder = Path(directory)
            db.executescript(pilot.INDEXED)
            for case, legacy in ids.items():
                observation = ids["direct"] if case == "analogue" else legacy
                preparation = legacy if case == "imputed" else "preparation"
                db.execute("INSERT INTO maintainer_source VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", (
                    snapshot, legacy, observation, pilot.PREVIEW_LINKS.get(legacy, "https://example.org/study"), "private locator",
                    "HUMAN_GI", None, 114, "GLUCOSE_100", "food", preparation, None, None, None, None,
                ))
            db.execute("INSERT INTO maintainer_dependency VALUES (?,?,?,?,?)", (
                snapshot, ids["analogue"], pilot.CHAIN_RECIPE, "public-original", "original",
            ))
            db.execute(
                f"INSERT INTO maintainer_calculation ({pilot.CALCULATION_COLUMNS},scope,calculation_reference,public_gk) "
                "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)", (
                snapshot, pilot.CHAIN_RECIPE, "original", "A", 1.0, None, None, None,
                "PUBLISHED_AND_BASELINE_BINDING_MATCHES", "private-approval", "ORIGINAL_RECIPE", "audit", 1.0,
            ))
            db.execute(
                f"INSERT INTO maintainer_calculation ({pilot.CALCULATION_COLUMNS},scope,calculation_reference,public_gk) "
                "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)", (
                    snapshot, pilot.VARIANT_RECIPE, "v1", "A", 0, None, "private-hash", None,
                    "PUBLISHED_VARIANT", "private-approval", "RECIPE_VARIANT", "audit", 0,
                ),
            )
            result = pilot.export_preview(db, snapshot, folder, capture)
            self.assertEqual(result["localReplayWrites"], 0)
            self.assertTrue(result["localInterruptionRolledBack"])
            output = folder / "d1-preview"
            manifest = json.loads((output / "manifest.json").read_bytes())
            self.assertIn("import.sql", pilot.read_preview(output, manifest))
            with self.assertRaisesRegex(ValueError, "does not match"):
                pilot.read_preview(output, {**manifest, "revision": "another-revision"})
            sql = (output / "import.sql").read_text(encoding="utf-8")
            (output / "import.sql").write_text("SELECT 1;", encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "checksum"):
                pilot.read_preview(output, manifest)
            (output / "manifest.json").write_text("nope", encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "Unreadable"):
                pilot.read_preview(output, manifest)
            for legacy in ids.values():
                self.assertNotIn(legacy, sql)
            self.assertNotIn("private locator", sql)
            self.assertNotIn("private-approval", sql)
            self.assertNotIn("private-hash", sql)
            self.assertIn("whole-tomato-raw", sql)
            self.assertIn("tomato-raw-cooked-sauce-analogue", sql)
