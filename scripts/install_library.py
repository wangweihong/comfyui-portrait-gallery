"""Install a complete local portrait snapshot without copying deployment archives."""
import argparse
import json
import os
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parents[1]


def link_or_copy(source, destination):
    try:
        os.link(source, destination)
    except FileExistsError:
        return
    except OSError:
        shutil.copy2(source, destination)


def install(source, destination):
    source = source.resolve()
    rows = json.loads((source / "data/portrait-zh.json").read_text())
    for row in rows:
        for field in ("full", "thumb"):
            path = (source / row[field]).resolve()
            if not path.is_relative_to(source) or not path.is_file():
                raise ValueError(f"图库缺失或路径无效：{row[field]}")
    (destination / "data").mkdir(parents=True, exist_ok=True)
    for name in ["portrait.json", "portrait-zh.json", "meta-zh.json", "ranking.json", "translations.csv", "asset-manifest.json"]:
        shutil.copy2(source / "data" / name, destination / "data" / name)
    for kind in ("full", "thumb"):
        target = destination / "img" / kind
        target.mkdir(parents=True, exist_ok=True)
        for row in rows:
            path = source / row[kind]
            link_or_copy(path, target / path.name)
    (destination / "SOURCE.json").write_text(json.dumps({"source": "https://ai-portrait-gallery.pages.dev/",
        "local_project": "ai-portrait-gallery-zh", "snapshot_date": "2026-10-30", "records": len(rows),
        "images": 2 * len(rows), "license_notice": "CC0 1.0 标注与原站附带请求见 THIRD_PARTY_NOTICES.md"}, ensure_ascii=False, indent=2)+"\n")
    print(f"已安装 {len(rows)} 张原图和 {len(rows)} 张缩略图：{destination}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, required=True)
    parser.add_argument("--destination", type=Path, default=ROOT / "library")
    args = parser.parse_args()
    install(args.source, args.destination)
