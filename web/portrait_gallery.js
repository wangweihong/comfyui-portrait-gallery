import { app } from "../../scripts/app.js";
import { api } from "../../scripts/api.js";

app.registerExtension({
  name: "comfyui-portrait-gallery.browser",
  async beforeRegisterNodeDef(nodeType, nodeData) {
    if (nodeData.name !== "PortraitGallery") return;
    const originalCreated = nodeType.prototype.onNodeCreated;
    nodeType.prototype.onNodeCreated = function () {
      originalCreated?.apply(this, arguments);
      const node = this;
      const widget = node.widgets.find(value => value.name === "portrait_id");
      let dialog = null, frame = null, requestId = 0;
      const box = document.createElement("div");
      box.style.cssText = "position:relative;width:100%;height:100%;background:#f7f5f0;border-radius:8px;overflow:hidden;";
      const image = document.createElement("img");
      image.alt = "所选人像原图预览";
      image.style.cssText = "display:block;width:100%;height:100%;object-fit:contain;";
      const error = document.createElement("div");
      error.setAttribute("role", "status");
      error.style.cssText = "display:none;position:absolute;inset:15px;place-items:center;color:#9a493c;font:13px/1.7 sans-serif;overflow-wrap:anywhere;";
      box.append(image, error);
      const update = () => {
        const current = ++requestId, id = String(widget.value);
        image.style.display = "block"; error.style.display = "none";
        image.onload = () => { if(current === requestId) {image.style.display = "block";error.style.display = "none";} };
        image.onerror = () => { if(current === requestId) {image.style.display = "none";error.textContent = `人像原图加载失败：library/img/full/${id}.png。请检查完整素材库，重启 ComfyUI 并刷新页面。`;error.style.display = "grid";} };
        image.src = api.apiURL(`/portrait_gallery/assets/full/${encodeURIComponent(id)}.png`);
        image.title = id;
      };
      const close = () => {window.removeEventListener("message", receive);dialog?.remove();dialog = null;frame = null;};
      const receive = event => {
        if (event.origin !== location.origin || event.source !== frame?.contentWindow) return;
        if (event.data?.type === "portrait-gallery-ready") frame.contentWindow.postMessage({type:"portrait-gallery-current", id:widget.value}, location.origin);
        if (event.data?.type !== "portrait-gallery-select" || typeof event.data.id !== "string" || !/^[a-z0-9_-]{1,80}$/.test(event.data.id)) return;
        widget.value = event.data.id;widget.callback?.(widget.value);
        node.setDirtyCanvas(true,true);app.graph.change();close();
      };
      const callback = widget.callback;
      widget.callback = function () {callback?.apply(this,arguments);update();};
      const browse = document.createElement("button");
      browse.type = "button";
      browse.textContent = "浏览人像图库 · 正脸 / 造型 / 发型 / 搜索";
      browse.style.cssText = "width:100%;height:36px;border:1px solid #b6c1aa;background:#e9ecdf;color:#343c2d;border-radius:6px;cursor:pointer;font:12px sans-serif;";
      browse.addEventListener("click", () => {
        if (dialog) return;
        dialog = document.createElement("dialog");
        dialog.style.cssText = "width:96vw;height:94vh;max-width:1800px;max-height:96vh;padding:0;border:1px solid #c6c9bb;border-radius:12px;background:#f7f5f0;";
        const header = document.createElement("div");
        header.style.cssText = "height:46px;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:0 18px;color:#343c2d;background:#e9ecdf;font:13px sans-serif;";
        const title = document.createElement("strong");title.textContent = "Portrait Gallery · 选择人像后点击「使用此人像 → ComfyUI」";
        const done = document.createElement("button");done.textContent = "关闭";done.onclick = close;
        done.style.cssText = "padding:5px 13px;border:1px solid #bdc5ae;background:#fff;color:#343c2d;border-radius:5px;cursor:pointer;";
        header.append(title,done);
        frame = document.createElement("iframe");frame.src = api.apiURL("/portrait_gallery/gallery");frame.title = "中文人像参考图库";
        frame.style.cssText = "width:100%;height:calc(100% - 46px);border:0;";
        dialog.append(header,frame);window.addEventListener("message",receive);
        dialog.addEventListener("cancel",event=>{event.preventDefault();close();});
        dialog.addEventListener("click",event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)close();}});
        document.body.append(dialog);dialog.showModal();
      });
      const toolbar = document.createElement("div");
      toolbar.style.cssText = "width:100%;height:42px;display:flex;align-items:center;";
      toolbar.append(browse);
      node.addDOMWidget("portrait_browser","button",toolbar,{serialize:false,hideOnZoom:false,getMinHeight:()=>42,getMaxHeight:()=>42});
      node.addDOMWidget("portrait_preview","image",box,{serialize:false,hideOnZoom:false,getMinHeight:()=>300,getMaxHeight:()=>500});
      const configured = node.onConfigure;
      node.onConfigure = function () {configured?.apply(this,arguments);update();};
      const removed = node.onRemoved;
      node.onRemoved = function () {close();removed?.apply(this,arguments);};
      node.setSize([370,530]);update();
    };
  },
});
