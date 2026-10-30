"""ComfyUI portrait selector: offline browsing and original PNG tensor output."""
import hashlib
import json
from pathlib import Path

import numpy as np
import torch
from PIL import Image, ImageOps
from aiohttp import web
from server import PromptServer

from .catalog import ROOT, records, portrait, asset, browser_payload


class PortraitGallery:
    @classmethod
    def INPUT_TYPES(cls):
        return {"required": {"portrait_id": ("STRING", {"default": "f71f980dde3", "multiline": False,
                "tooltip": "点击浏览人像图库，选择正脸或造型参考；只写回当前节点，不会自动运行。"})}}

    RETURN_TYPES = ("IMAGE", "INT", "INT", "STRING", "STRING", "STRING")
    RETURN_NAMES = ("image", "width", "height", "portrait_id", "description", "section")
    FUNCTION = "load_portrait"
    CATEGORY = "image/Portrait Gallery"
    DESCRIPTION = "本地中文人像图库：1499张原图，正脸/造型、发型/风格筛选、收藏与预览；输出完整PNG。"

    @classmethod
    def VALIDATE_INPUTS(cls, portrait_id):
        try:
            row = portrait(portrait_id)
            asset("full", Path(row["full"]).name)
        except (ValueError, FileNotFoundError) as exc:
            return str(exc)
        return True

    @classmethod
    def IS_CHANGED(cls, portrait_id):
        row = portrait(portrait_id)
        return hashlib.sha256(asset("full", Path(row["full"]).name).read_bytes()).hexdigest()

    def load_portrait(self, portrait_id):
        row = portrait(portrait_id)
        with Image.open(asset("full", Path(row["full"]).name)) as source:
            image = ImageOps.exif_transpose(source).convert("RGBA")
            image = Image.alpha_composite(Image.new("RGBA", image.size, "white"), image).convert("RGB")
            width, height = image.size
            tensor = torch.from_numpy(np.asarray(image).astype(np.float32) / 255.0).unsqueeze(0)
        description = " / ".join(value for value in (row["section_zh"], row["hair_zh"], row["style_zh"]) if value)
        return tensor, width, height, portrait_id, description, row["section_zh"]


routes = PromptServer.instance.routes


@routes.get("/portrait_gallery/catalog")
async def catalog_route(request):
    try:
        return web.json_response(records())
    except (ValueError, FileNotFoundError) as exc:
        return web.json_response({"error": str(exc)}, status=503)


@routes.get("/portrait_gallery/data.js")
async def data_route(request):
    try:
        payload = json.dumps(browser_payload(), ensure_ascii=False, separators=(",", ":"))
        return web.Response(text="window.PORTRAIT_DATA = " + payload + ";\n", content_type="application/javascript",
                            headers={"Cache-Control": "no-cache", "X-Content-Type-Options": "nosniff"})
    except (ValueError, FileNotFoundError) as exc:
        return web.Response(text="console.error(" + json.dumps(str(exc)) + ");", status=503,
                            content_type="application/javascript")


@routes.get("/portrait_gallery/assets/{kind}/{filename}")
async def asset_route(request):
    try:
        return web.FileResponse(asset(request.match_info["kind"], request.match_info["filename"]),
                                headers={"Cache-Control": "private, max-age=3600", "X-Content-Type-Options": "nosniff"})
    except (ValueError, FileNotFoundError):
        raise web.HTTPNotFound()


@routes.get("/portrait_gallery/ui/{filename}")
async def ui_route(request):
    name = request.match_info["filename"]
    if name not in ("style.css", "core.mjs", "app.mjs", "icon.svg"):
        raise web.HTTPNotFound()
    return web.FileResponse(ROOT / "web" / name, headers={"Cache-Control": "no-cache"})


@routes.get("/portrait_gallery/gallery")
async def gallery_route(request):
    return web.FileResponse(ROOT / "web/gallery.html", headers={"Cache-Control": "no-cache"})


NODE_CLASS_MAPPINGS = {"PortraitGallery": PortraitGallery}
NODE_DISPLAY_NAME_MAPPINGS = {"PortraitGallery": "Portrait Gallery 人像图库"}
WEB_DIRECTORY = "./web"
__all__ = ["NODE_CLASS_MAPPINGS", "NODE_DISPLAY_NAME_MAPPINGS", "WEB_DIRECTORY"]
