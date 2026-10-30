"""Allow-listed, offline portrait assets shared by the node and its gallery UI."""
import json
import os
import re
from functools import lru_cache
from pathlib import Path

ROOT = Path(__file__).resolve().parent
LIBRARY = Path(os.environ.get("COMFYUI_PORTRAIT_GALLERY_LIBRARY", ROOT / "library")).resolve()
FIELDS = {"full": ("full", ".png"), "thumb": ("thumb", ".webp")}
ID_PATTERN = re.compile(r"[a-z0-9_-]{1,80}")


@lru_cache(maxsize=1)
def records():
    source = LIBRARY / "data/portrait-zh.json"
    if not source.is_file():
        raise FileNotFoundError("人像索引缺失：library/data/portrait-zh.json，请安装完整 comfyui-portrait-gallery 素材库。")
    data = json.loads(source.read_text(encoding="utf-8"))
    if not isinstance(data, list) or not data:
        raise ValueError("人像索引为空或格式错误")
    ids = set()
    for row in data:
        identity = row.get("id") if isinstance(row, dict) else None
        if not isinstance(identity, str) or not ID_PATTERN.fullmatch(identity) or identity in ids:
            raise ValueError("人像索引含无效或重复 ID")
        ids.add(identity)
        if row.get("section") not in ("face", "styling"):
            raise ValueError("人像索引含未知参考类型")
        for kind, (field, suffix) in FIELDS.items():
            if row.get(field) != f"img/{kind}/{identity}{suffix}":
                raise ValueError("人像索引含无效图片路径")
    return data


@lru_cache(maxsize=1)
def index():
    return {row["id"]: row for row in records()}


def portrait(portrait_id):
    if not isinstance(portrait_id, str):
        raise ValueError("人像 ID 必须是字符串")
    try:
        return index()[portrait_id]
    except KeyError:
        raise ValueError(f"未知人像 ID：{portrait_id}") from None


def asset(kind, filename):
    if kind not in FIELDS or Path(filename).name != filename or "\\" in filename:
        raise ValueError("无效人像图片路径")
    row = portrait(Path(filename).stem)
    field, suffix = FIELDS[kind]
    relative = Path("img") / kind / filename
    target = (LIBRARY / relative).resolve()
    if Path(filename).suffix != suffix or row[field] != relative.as_posix() or not target.is_relative_to(LIBRARY):
        raise ValueError("图片不在人像图库允许范围内")
    if not target.is_file():
        raise FileNotFoundError(f"图片缺失：library/{relative}。请重新安装完整人像图库，确认 img/full 和 img/thumb 均已包含。")
    return target


def browser_payload():
    rows = []
    for row in records():
        rows.append(dict(row, full=f"assets/full/{row['id']}.png", thumb=f"assets/thumb/{row['id']}.webp"))
    meta = json.loads((LIBRARY / "data/meta-zh.json").read_text(encoding="utf-8"))
    ranking = json.loads((LIBRARY / "data/ranking.json").read_text(encoding="utf-8"))
    return {"records": rows, "meta": meta, "ranking": ranking}
