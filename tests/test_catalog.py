import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location("portrait_catalog", Path(__file__).resolve().parents[1] / "catalog.py")
catalog = importlib.util.module_from_spec(spec)
spec.loader.exec_module(catalog)


class CatalogTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.original_library = catalog.LIBRARY
        catalog.LIBRARY = Path(self.temp.name)
        (catalog.LIBRARY / "data").mkdir()
        self.row = {"id": "f123", "section": "face", "full": "img/full/f123.png", "thumb": "img/thumb/f123.webp"}
        self.write_rows([self.row])
        for field in ("full", "thumb"):
            path = catalog.LIBRARY / self.row[field]
            path.parent.mkdir(parents=True)
            path.write_bytes(b"fixture")

    def write_rows(self, rows):
        (catalog.LIBRARY / "data/portrait-zh.json").write_text(json.dumps(rows))
        catalog.records.cache_clear()
        catalog.index.cache_clear()

    def tearDown(self):
        catalog.LIBRARY = self.original_library
        catalog.records.cache_clear()
        catalog.index.cache_clear()
        self.temp.cleanup()

    def test_original_and_thumbnail_are_allowlisted(self):
        self.assertEqual(catalog.asset("full", "f123.png").read_bytes(), b"fixture")
        self.assertEqual(catalog.asset("thumb", "f123.webp").read_bytes(), b"fixture")

    def test_invalid_paths_ids_extensions_and_kinds_are_rejected(self):
        for kind, name in [("full", "../f123.png"), ("full", "..\\f123.png"), ("full", "/etc/passwd"),
                           ("full", "f123.webp"), ("thumb", "missing.webp"), ("data", "portrait-zh.json")]:
            with self.subTest(kind=kind, name=name), self.assertRaises(ValueError):
                catalog.asset(kind, name)

    def test_missing_original_has_repair_guidance(self):
        (catalog.LIBRARY / "img/full/f123.png").unlink()
        with self.assertRaisesRegex(FileNotFoundError, "library/img/full/f123.png.*完整"):
            catalog.asset("full", "f123.png")

    def test_symlink_outside_the_library_is_rejected(self):
        path = catalog.LIBRARY / "img/full/f123.png"
        path.unlink()
        path.symlink_to("/etc/passwd")
        with self.assertRaises(ValueError):
            catalog.asset("full", "f123.png")

    def test_catalog_cannot_authorize_external_paths_or_duplicate_ids(self):
        for rows in [[dict(self.row, full="../secret.png")], [self.row, self.row], [dict(self.row, id="../x")]]:
            self.write_rows(rows)
            with self.assertRaises(ValueError):
                catalog.records()


class BundledLibraryTests(unittest.TestCase):
    def test_all_originals_and_thumbnails_are_bundled(self):
        rows = catalog.records()
        self.assertEqual(len(rows), 1499)
        self.assertEqual(sum(r["section"] == "face" for r in rows), 893)
        self.assertEqual(sum(r["section"] == "styling" for r in rows), 606)
        for row in rows:
            for kind, (field, _) in catalog.FIELDS.items():
                with self.subTest(id=row["id"], kind=kind):
                    self.assertTrue(catalog.asset(kind, Path(row[field]).name).is_file())


if __name__ == "__main__":
    unittest.main()
