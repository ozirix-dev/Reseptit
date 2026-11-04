"""No dependencies beyond Python stdlib. Run: python3 -m unittest discover -s site/tests -p 'test_gi_sqlite_index.py'"""

from contextlib import closing
import errno
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
                 "matchKind": "ANALOG", "evidenceKind": "PUBLISHED_IMPUTATION",
                 "note": "Only for reviewed low-carbohydrate compositions.",
                 "source": {"url": "https://example.org/raw", "table": "A"}},
                {"id": "boiled", "foodKey": "potato", "preparationKey": "boiled", "gi": 101,
                 "qualityTier": "STRONG", "referenceScale": "GLUCOSE_100",
                 "calculationUse": "REFERENCE_ONLY",
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
        self.assertEqual(result["candidates"][0]["calculationUse"], "REFERENCE_ONLY")
        self.assertEqual(result["candidates"][0]["sourceUrl"], "https://example.org/boiled")
        self.assertTrue(result["candidates"][0]["requiresRecipeSpecificApproval"])
        self.assertFalse(result["autoApproved"])
        comparison = index.lookup(self.source, self.db, "potato", "boiled", include_other_preparations=True)
        self.assertEqual(len(comparison["candidates"]), 2)
        self.assertEqual(comparison["candidates"][1]["matchAssessment"], "PREPARATION_NOT_ESTABLISHED")
        self.assertEqual(comparison["candidates"][1]["evidenceKind"], "PUBLISHED_IMPUTATION")
        self.assertEqual(comparison["candidates"][1]["note"], "Only for reviewed low-carbohydrate compositions.")
        limited = index.lookup(self.source, self.db, "potato", "raw", include_other_preparations=True, limit=1)
        self.assertEqual([r["recordId"] for r in limited["candidates"]], ["raw"])
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

    def test_build_and_batch_preserve_unrelated_sqlite_database(self):
        with closing(index.sqlite3.connect(self.db)) as db, db:
            db.execute("CREATE TABLE metadata (key TEXT PRIMARY KEY, value TEXT NOT NULL)")
            db.executemany("INSERT INTO metadata VALUES (?, ?)", [
                ("schema_version", "1"), ("source_sha256", "unrelated"),
                ("source_count", "1"), ("record_count", "1"),
            ])
        original = self.db.read_bytes()
        with self.assertRaisesRegex(ValueError, "not a GI index"):
            index.build_index(self.source, self.db)
        with self.assertRaisesRegex(ValueError, "not a GI index"):
            index.lookup_batch(self.source, self.db, [{"food_key": "potato"}])
        self.assertEqual(self.db.read_bytes(), original)

    def test_build_preserves_file_created_during_publication(self):
        publication_call = "rename" if os.name == "nt" else "link"
        publish = getattr(os, publication_call)

        def create_conflict(temporary, destination):
            destination.write_bytes(b"other application's data")
            publish(temporary, destination)

        with patch.object(index.os, publication_call, side_effect=create_conflict):
            with self.assertRaises(index.sqlite3.DatabaseError):
                index.build_index(self.source, self.db)
        self.assertEqual(self.db.read_bytes(), b"other application's data")

    @unittest.skipUnless(importlib.util.find_spec("_ctypes"), "Native FFI unavailable")
    def test_publication_falls_back_to_exclusive_rename_without_hard_links(self):
        import ctypes

        # Keep the simulated errno values distinct even on hosts where they alias.
        unsupported, operation_not_supported = 45, 102
        for platform, link_error, function, args in (
            ("linux", unsupported, "renameat2", (-100, b"staging", -100, b"target", 1)),
            ("darwin", operation_not_supported, "renamex_np", (b"staging", b"target", 4)),
        ):
            with self.subTest(platform=platform), \
                 patch.object(index.os, "name", "posix"), \
                 patch.object(index.sys, "platform", platform), \
                 patch.object(index.errno, "ENOTSUP", unsupported), \
                 patch.object(index.errno, "EOPNOTSUPP", operation_not_supported), \
                 patch.object(index.os, "link", side_effect=OSError(link_error, "no hard links")), \
                 patch.object(ctypes, "CDLL") as load:
                rename = getattr(load.return_value, function)
                rename.return_value = 0
                index._create_index_file("staging", "target")
                rename.assert_called_once_with(*args)
                rename.return_value = -1
                with patch.object(ctypes, "get_errno", return_value=errno.EEXIST):
                    with self.assertRaises(FileExistsError):
                        index._create_index_file("staging", "target")

    def test_unc_path_uses_empty_sqlite_uri_authority(self):
        with patch.object(Path, "resolve") as resolve, patch.object(index.sqlite3, "connect") as connect:
            resolve.return_value.as_uri.return_value = "file://fileserver/share/cache%20%231.sqlite"
            index._open_index(self.db)
        connect.assert_called_once_with("file:////fileserver/share/cache%20%231.sqlite?mode=ro", uri=True)

    def test_legacy_index_is_readable_and_gets_marker_on_rebuild(self):
        index.build_index(self.source, self.db)
        with closing(index.sqlite3.connect(self.db)) as db, db:
            db.execute("PRAGMA application_id = 0")
        self.assertEqual(index.lookup(self.source, self.db, "potato", "raw")["candidates"][0]["gi"], 50)
        self.data["records"][0]["gi"] = 58
        self.write()
        result = index.lookup_batch(self.source, self.db, [{"food_key": "potato", "preparation_key": "raw"}])
        self.assertEqual(result[0]["candidates"][0]["gi"], 58)
        with closing(index.sqlite3.connect(self.db)) as db:
            self.assertEqual(db.execute("PRAGMA application_id").fetchone()[0], index.APPLICATION_ID)

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
