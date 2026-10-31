"""ComfyUI portrait selector: offline browsing and original PNG tensor output."""
import asyncio
import logging
import hashlib
import json
from pathlib import Path

import numpy as np
import torch
from PIL import Image, ImageOps
from aiohttp import web
from server import PromptServer

from .uploads import import_image, UploadError, MAX_BYTES
from .catalog import USER_LIBRARY, metadata, browser_payload, ROOT, records, portrait, asset


class PortraitGallery:
    @classmethod
    def INPUT_TYPES(cls):
        return {"required": {"portrait_id": ("STRING", {"default": "f71f980dde3", "multiline": False,
                "tooltip": "点击浏览人像图库，选择正脸或造型参考；只写回当前节点，不会自动运行。"})}}

    RETURN_TYPES = ("IMAGE", "INT", "INT", "STRING", "STRING", "STRING")
    RETURN_NAMES = ("image", "width", "height", "portrait_id", "description", "section")
    FUNCTION = "load_portrait"
    CATEGORY = "image/Portrait Gallery"
    DESCRIPTION = '本地人像图库：正脸/造型筛选、收藏和单张自定义上传，输出完整参考图。'

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
        description = " / ".join(value for value in (row["section_zh"], row["hair_zh"], row.get("name_zh", "") if row["origin"] == "user" else row["style_zh"]) if value)
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
    if name not in ("style.css", "core.mjs", "app.mjs", "icon.svg", "custom_upload.mjs", "custom_upload.css"):
        raise web.HTTPNotFound()
    return web.FileResponse(ROOT / "web" / name, headers={"Cache-Control": "no-cache"})


@routes.get("/portrait_gallery/gallery")
async def gallery_route(request):
    return web.FileResponse(ROOT / "web/gallery.html", headers={"Cache-Control": "no-cache"})


@routes.post("/portrait_gallery/upload")
async def upload_route(request):
    try:
        multipart = await request.multipart()
        fields, data, filename = {}, None, None
        async for part in multipart:
            if part.filename is not None:
                if part.name != "image" or data is not None:
                    raise UploadError("single_image_only")
                chunks, size = [], 0
                while chunk := await part.read_chunk():
                    size += len(chunk)
                    if size > MAX_BYTES:
                        raise UploadError("file_too_large", 413)
                    chunks.append(chunk)
                data, filename = b"".join(chunks), part.filename
            else:
                if part.name not in {"name", "other_name", "language", "hair", "category", "section", "angle"} or part.name in fields:
                    raise UploadError("invalid_metadata")
                chunks, size = [], 0
                while chunk := await part.read_chunk():
                    size += len(chunk)
                    if size > 2048:
                        raise UploadError("invalid_metadata")
                    chunks.append(chunk)
                fields[part.name] = b"".join(chunks).decode("utf-8")
        if data is None:
            raise UploadError("image_required")
        try:
            await asyncio.to_thread(records)
        except (ValueError, OSError) as exc:
            raise UploadError("storage_error", 500) from exc
        row = await asyncio.to_thread(import_image, data, name=fields.get("name", ""),
            other_name=fields.get("other_name", ""), language=fields.get("language", "zh"),
            hair=fields.get("hair", "unknown"), filename=filename, root=USER_LIBRARY, category=fields.get("category", ""),
            section=fields.get("section", "custom"), angle=fields.get("angle", "unknown"))
        # Reuse the existing allow-listed, browser-relative catalog representation.
        payload = browser_payload()
        selected = next(item for item in payload["records"] if item["id"] == row["id"])
        return web.json_response({"record": selected, "catalog": payload}, status=201,
                                 headers={"Cache-Control": "no-store"})
    except UploadError as exc:
        return web.json_response({"error": exc.code}, status=exc.status)
    except (ValueError, UnicodeError, AssertionError):
        return web.json_response({"error": "invalid_request"}, status=400)
    except OSError:
        logging.exception("Unable to save a custom hairstyle")
        return web.json_response({"error": "storage_error"}, status=500)


@routes.get("/portrait_gallery/meta")
async def metadata_route(request):
    try:
        return web.json_response(metadata(), headers={"Cache-Control":"no-store"})
    except (ValueError, OSError):
        return web.json_response({"error":"storage_error"}, status=503)


NODE_CLASS_MAPPINGS = {"PortraitGallery": PortraitGallery}
NODE_DISPLAY_NAME_MAPPINGS = {"PortraitGallery": "Portrait Gallery 人像图库"}
WEB_DIRECTORY = "./web"
__all__ = ["NODE_CLASS_MAPPINGS", "NODE_DISPLAY_NAME_MAPPINGS", "WEB_DIRECTORY"]
