// Shared translations for the gallery and node UI. Original catalog IDs remain stable.
(function(root){
 'use strict';
 const EN={
"人像原图加载失败：{path}。请检查完整素材库，重启 ComfyUI 并刷新页面。":"Portrait image failed to load: {path}. Check the complete library, restart ComfyUI, and refresh the page.",
  "本次随机发型预览": "Random hairstyle preview",
  "随机发型预览加载失败，请检查素材原图。": "The random preview could not load. Check the original image.",
  "上次运行结果": "Last execution result",
  "运行工作流后自动抽取发型": "A hairstyle is drawn automatically when the workflow runs",
  "随机来源": "Random source",
  "AI 假人发型参考库 · HAIRSTYLE Atlas": "AI Mannequin Hairstyle Gallery · HAIRSTYLE Atlas",
  "HAIRSTYLE Atlas 首页": "HAIRSTYLE Atlas home",
  "跳到发型图库": "Skip to hairstyle gallery",
  "主导航": "Main navigation",
  "发型图库": "Hairstyles",
  "使用指南": "Guide",
  "来源与许可": "Sources & license",
  "中文": "English",
  "切换深色模式": "Switch to dark mode",
  "切换浅色模式": "Switch to light mode",
  "为你的下一个角色，": "For your next character,",
  "挑选一款": "find your ",
  "合适的发型。": "perfect hairstyle.",
  "从人物参考中提取头发，呈现在假人头模上。": "Hairstyles extracted from portraits and displayed on mannequin heads.",
  "按长度与名称挑选，让发型成为独立的创作参考。": "Browse by length and name to use hair as a separate creative reference.",
  "探索发型图库": "Explore hairstyles",
  "如何使用": "How it works",
  "已生成发型": "Generated hairstyles",
  "来源正脸": "Source portraits",
  "发型长度": "Hair length",
  "完整生成图": "Full-size images",
  "不同发型的发型参考预览": "Preview of different hairstyle lengths",
  "从节点打开可选择发型": "Open from a node to select a hairstyle",
  "本地生成素材": "Locally generated assets",
  "假人发型参考，仅供创作参考": "Mannequin hairstyles for creative reference",
  "灵感，从这里开始": "Start with inspiration ",
  "四种长度 · 发型速览": "Four lengths · Quick preview",
  "本地生成 · 按原始素材顺序": "Locally generated · Source order",
  "发型速览分类": "Hairstyle preview categories",
  "你的发型参考库": "Your hairstyle collection ",
  "按名称、发长与风格找到合适的参考": "Find a reference by name, length, and style",
  "我的收藏": "Favorites",
  "参考类型": "Reference type",
  "搜索发型、风格或 ID…": "Search hairstyles, styles, or IDs…",
  "搜索发型、风格或 ID": "Search hairstyles, styles, or IDs",
  "筛选": "Filters",
  "发型风格": "Hair style",
  "全部风格": "All styles",
  "全部发型": "All hairstyles",
  "假人发型": "Mannequin hairstyle",
  "短发": "Short",
  "中发": "Medium",
  "中长发": "Medium-long",
  "长发": "Long",
  "重置筛选": "Reset filters",
  "排序": "Sort",
  "排序方式": "Sort order",
  "来源顺序": "Source order",
  "编号 A–Z": "ID A–Z",
  "原图尺寸优先": "Largest images first",
  "参考图片列表": "Reference images",
  "还没有找到合适的发型": "No matching hairstyles",
  "换个关键词，或清除筛选再看看。": "Try another keyword or clear your filters.",
  "清除全部筛选": "Clear all filters",
  "加载更多": "Load more",
  "你已看完当前筛选下的全部发型。": "You have seen all hairstyles matching these filters.",
  "让灵感，成为你的角色。": "Turn inspiration into your character.",
  "将参考图带进熟悉的创作工具，": "Bring references into your creative tools,",
  "将头发与人物身份分开参考。": "and reference hair separately from character identity.",
  "找到喜欢的发型": "Find a hairstyle",
  "按发型和风格筛选。查看假人头模上的发型轮廓。中文与日文名称沿用来源数据。": "Filter by length and style. Inspect the silhouette on a mannequin head. Chinese and Japanese names are retained from the source; English names are translations.",
  "下载 PNG 原图": "Download full-size PNG",
  "打开大图查看细节，下载完整分辨率生成图，也可收藏发型，方便下次回来继续创作。": "Inspect the details, download the full-resolution image, and save favorites for your next visit.",
  "带入你的创作流程": "Use in your workflow",
  "在 ComfyUI 中将发型输出接入支持参考图的工作流。输出假人发型PNG和名称，供支持参考图的模型使用。": "Connect the hairstyle image and name to a ComfyUI workflow that supports image references.",
  "为角色挑选发型，让参考各司其职。": "Choose hair for your character and give each reference a clear role.",
  "本地工作流生成项目。来源人物素材：": "Generated with a local workflow. Source portraits:",
  "AI モデル顔データベース ↗": "AI Model Face Database ↗",
  "原作者 あぎ ↗": "Original creator: Agi ↗",
  "中文数据 JSON ↓": "Bilingual catalog JSON ↓",
  "张假人发型 · 来源为 893 张正脸参考": "mannequin hairstyles · Based on 893 source portraits",
  "本站不收集浏览或下载数据；收藏仅保存在当前浏览器。": "No browsing or download tracking. Favorites stay in this browser.",
  "正在加载原图…": "Loading full-size image…",
  "上一张": "Previous image",
  "下一张": "Next image",
  "复制 ID": "Copy ID",
  "使用此发型 → ComfyUI": "Use hairstyle → ComfyUI",
  "新窗口打开原图": "Open full-size image in a new tab",
  "收藏这张发型": "Favorite this hairstyle",
  "← → 切换发型 · Esc 关闭": "← → Browse hairstyles · Esc Close",
  "触屏支持左右滑动": "Swipe left or right on touch screens",
  "FLUX.2 Klein 生成的假人发型": "Mannequin hairstyle generated with FLUX.2 Klein",
  "人物来源：あぎ 的人像数据库": "Portrait source: Agi's face database",
  "关闭大图": "Close image viewer",
  "关闭说明": "Close information",
  "请启用 JavaScript 以浏览图库。全部原图保存在 img/full/，原始与中文清单保存在 data/。": "Enable JavaScript to browse the gallery. Full-size images are in img/full/; catalogs are in data/.",
  "本地假人发型图库，按长度、中文名称、日文名称及来源ID检索。": "Offline mannequin hairstyle gallery. Search by length, English, Chinese or Japanese names, and source ID.",
  "界面语言": "Interface language",
  "大图界面语言": "Viewer language",
  "由正脸参考提取的假人发型；人物身份与发型分开参考": "Extracted from portraits; reference hair separately from identity",
  "发型速览第 {n} 张：{name}": "Hairstyle preview {n}: {name}",
  "发型参考": "Hairstyle reference",
  "搜索：{query}": "Search: {query}",
  "移除筛选：{value}": "Remove filter: {value}",
  "查看大图：{name}": "View full-size image: {name}",
  "收藏": "Favorite",
  "取消收藏": "Unfavorite",
  "下载 {id} PNG 原图，{size}": "Download {id} full-size PNG, {size}",
  "共 <strong>{total}</strong> 张{favorites}参考 <span>· 已加载 {shown} 张</span>": "{favorites}References: <strong>{total}</strong> <span>· Loaded: {shown}</span>",
  "加载更多（剩余 {count} 张）": "Load more ({count} remaining)",
  "收藏夹还没有发型": "No favorite hairstyles yet",
  "点击图片右上角的爱心，将喜欢的发型留在这里。": "Click the heart on an image to save it here.",
  "当前浏览器无法保存收藏，关闭页面后将不会保留": "This browser cannot save favorites; they will be lost when the page closes.",
  "已收藏 · 取消收藏": "Saved · Remove favorite",
  "正在加载 PNG 原图…": "Loading full-size PNG…",
  "原图加载失败，可尝试新窗口打开": "Image could not load. Try opening it in a new tab.",
  "来源编号": "Source ID",
  "原图尺寸": "Image dimensions",
  "文件大小": "File size",
  "原始日文名称：{name}": "Original Japanese name: {name}",
  "原始素材没有细分发型名称，以发长类别命名。": "No detailed style name was provided; the name uses the source hair-length category.",
  "请从 ComfyUI 节点打开以使用发型": "Open from a ComfyUI node to use this hairstyle",
  "已复制": "Copied",
  "请手动复制": "Copy manually",
  "当前节点发型：{id}": "Current node hairstyle: {id}",
  "{count} 张正脸已全部转换": "All {count} source portraits have been converted",
  "已生成 {count} / {target} 张，刷新查看新增素材": "Generated {count} / {target}. Refresh to see new items.",
  "浏览发型图库 · 长度 / 风格 / 名称 / 搜索": "Browse hairstyles · Length / Style / Name / Search",
  "所选发型原图预览": "Selected hairstyle preview",
  "发型原图加载失败：{path}。请检查完整素材库，重启 ComfyUI 并刷新页面。": "Cannot load hairstyle: {path}. Check the library, restart ComfyUI, and refresh the page.",
  "Hairstyle Gallery · 选择发型后点击「使用此发型 → ComfyUI」": "Hairstyle Gallery · Select a hairstyle, then click “Use hairstyle → ComfyUI”",
  "关闭": "Close",
  "中文发型参考图库": "Hairstyle reference gallery",
  "发型编号": "Hairstyle ID",
  "界面与文本语言": "UI / text language",
  "图像": "Image",
  "宽度": "Width",
  "高度": "Height",
  "名称": "Name",
  "描述": "Description",
  "上传发型": "Upload hairstyle",
  "浏览内置假人发型，或上传自己的发型参考。": "Browse built-in mannequin hairstyles or upload your own hairstyle reference.",
  "可用发型": "Available hairstyles",
  "内置": "Built-in",
  "自定义": "Custom",
  "全部来源": "All sources",
  "未分类": "Unspecified",
  "素材来源": "Asset source",
  "按发长速览": "Quick preview by length",
  "本地素材 · 按入库顺序": "Local assets · Catalog order",
  "内置库未安装，可上传自定义发型继续使用。": "The built-in library is not installed. Upload custom hairstyles to continue.",
  "内置 {builtin} · 自定义 {user}": "Built-in {builtin} · Custom {user}",
  "张可用参考 · 内置": "available references · Built-in",
  "/ 自定义": "/ Custom",
  "直接导入图片，不自动提取头发或去除人物面部。": "Images are imported directly. Hair extraction and face removal are not performed.",
  "支持静态 PNG、JPEG、WebP；单张不超过 20 MiB、3200 万像素。": "Static PNG, JPEG, or WebP. Up to 20 MiB and 32 megapixels per image.",
  "选择图片": "Choose image",
  "尚未选择图片": "No image selected",
  "待上传发型预览": "Preview of the hairstyle to upload",
  "名称（必填）": "Name (required)",
  "中文名称（必填）": "Chinese name (required)",
  "英文名称（必填）": "English name (required)",
  "中文名称（可选）": "Chinese name (optional)",
  "英文名称（可选）": "English name (optional)",
  "取消": "Cancel",
  "保存到图库": "Save to gallery",
  "正在保存…": "Saving…",
  "请选择一张图片。": "Choose an image.",
  "每次只能上传一张图片。": "Upload one image at a time.",
  "图片超过 20 MiB 限制。": "The image exceeds the 20 MiB limit.",
  "图片超过 3200 万像素限制。": "The image exceeds the 32-megapixel limit.",
  "仅支持静态 PNG、JPEG、WebP 图片。": "Only static PNG, JPEG, and WebP images are supported.",
  "暂不支持动画图片。": "Animated images are not supported.",
  "图片损坏或无法读取，请重新选择。": "The image is damaged or cannot be read. Choose another image.",
  "文件名无效，请重命名后重试。": "The filename is invalid. Rename the file and try again.",
  "请填写名称。": "Enter a name.",
  "请检查名称和发长选项，名称最多 120 个字符。": "Check the name and hair length. Names are limited to 120 characters.",
  "上传请求无效，请重新选择图片后重试。": "Invalid upload request. Select the image again and retry.",
  "无法保存到用户素材目录，请检查写入权限后重试。": "Cannot save to the user library. Check write permissions and retry.",
  "上传失败，请重试。": "Upload failed. Please retry.",
  "发型已保存，可点击“使用此发型”写回节点。": "Saved. Click “Use hairstyle” to update the node.",
  "自定义上传，没有原始日文名称。": "Custom upload; no original Japanese name.",
  "用户上传：{filename}\n上传时间：{time}": "User upload: {filename}\nUploaded at: {time}",
  "界面与输出语言": "UI / output language",
  "界面与提示语言": "UI / output language",
  "人像类型": "Reference type",
  "人像名称": "Portrait name",
  "服装名称": "Costume name",
  "所有": "All",
  "分类": "Category",
  "AI 人像参考库｜1,499 张正脸与造型参考 · PORTRAIT Atlas": "AI Portrait Gallery · Face and Styling References · PORTRAIT Atlas",
  "跳到人像图库": "Skip to portrait gallery",
  "PORTRAIT Atlas 首页": "PORTRAIT Atlas home",
  "人像图库": "Portraits",
  "找到一张": "find a",
  "熟悉的脸。": "familiar face.",
  "一张脸，一个故事的起点。": "A face is the start of a story.",
  "从正脸到造型，探索内置 1,499 张 AI 人像参考，": "Explore 1,499 AI portraits, from face references to styling,",
  "让角色的每一次出场，都有迹可循。": "and give your character a consistent starting point.",
  "探索人像图库": "Explore portraits",
  "内置正脸参考": "Built-in face references",
  "内置造型参考": "Built-in styling references",
  "原站标注许可": "Source license",
  "不同发型的人像参考预览": "Portrait previews with different hairstyles",
  "从节点打开可选择人像": "Open from a node to select a portrait",
  "完整中文整理 · 原图本地收录": "Bilingual catalog · Local full-size images",
  "AI 生成的虚构人物，仅供创作参考": "AI-generated fictional people for creative reference",
  "原站下载榜 TOP 10": "Source download ranking · Top 10",
  "榜单快照 · 2026.10.30": "Ranking snapshot · 2026-10-30",
  "下载榜分类": "Download ranking categories",
  "你的角色灵感库": "Your character reference collection",
  "每一种风格，都值得被看见": "Explore every style",
  "原站顺序": "Source order",
  "还没有找到合适的人像": "No matching portraits",
  "你已看完当前筛选下的全部人像。": "You have seen all portraits matching these filters.",
  "从一张稳定的脸，延展出更多故事。": "Build more stories from a consistent face reference.",
  "找到喜欢的人像": "Find a portrait",
  "按发型和风格筛选。正脸用于角色面部参考，造型图用于服饰、发质和整体气质参考。": "Filter by hairstyle and style. Face images guide facial features; styling images guide clothing, hair, and overall appearance.",
  "打开大图查看细节，下载完整分辨率原图，也可收藏人像，方便下次回来继续创作。": "Inspect details, download full-resolution images, and save portraits to favorites.",
  "在 ComfyUI 中将人像输出接入支持参考图的工作流。同一张参考图有助于稳定角色特征，效果随模型和设置而变化。": "Connect the portrait to a ComfyUI workflow that supports image references. Consistency depends on the model and settings.",
  "为每一个想象中的角色，留下一张清晰的脸。": "Give each character a clear face reference.",
  "独立中文整理项目。图片与原始数据来源：": "Independent catalog. Images and original data:",
  "1,499 张内置参考 · 893 正脸 / 606 造型": "1,499 built-in references · 893 face / 606 styling",
  "使用此人像 → ComfyUI": "Use portrait → ComfyUI",
  "收藏这张人像": "Favorite this portrait",
  "← → 切换人像 · Esc 关闭": "← → Browse portraits · Esc Close",
  "AI 生成的虚构人物": "AI-generated fictional people",
  "原始素材来自 あぎ 的人像数据库": "Original assets from Agi's portrait database",
  "全部人像": "All portraits",
  "正脸参考": "Face reference",
  "造型参考": "Styling reference",
  "未分类人像": "Custom portraits",
  "总榜": "Overall",
  "综合": "Overall",
  "总合": "Overall",
  "総合": "Overall",
  "正脸与造型独立收录，图片之间不保证人物对应": "Face and styling images are independent; identities may differ.",
  "面部特征与角色一致性参考": "Facial features and character consistency reference",
  "服饰、发质与整体气质参考": "Clothing, hair texture, and styling reference",
  "用户直接上传的人像参考，类型未分类": "User-uploaded portrait references",
  "收藏夹还没有人像": "No favorite portraits yet",
  "点击图片右上角的爱心，将喜欢的人像留在这里。": "Click the heart on an image to save it here.",
  "请从 ComfyUI 节点打开以使用人像": "Open from a ComfyUI node to use this portrait",
  "当前节点人像：{id}": "Current node portrait: {id}",
  "原始描述：{name}": "Original description: {name}",
  "原站未提供更细的发型描述。": "No detailed hairstyle description was provided.",
  "榜单第 {n} 名：{name}": "Rank {n}: {name}",
  "{hair}人像参考": "{hair} portrait reference",
  "共": "Total",
  "张参考": "references",
  "张收藏参考": "favorite references",
  "· 已加载 {count} 张": "· Loaded {count}",
  "{count} 张参考 · 内置 {builtin} / 自定义 {user}": "{count} references · Built-in {builtin} / Custom {user}",
  "所选人像原图预览": "Selected portrait preview",
  "浏览人像图库 · 正脸 / 造型 / 发型 / 搜索": "Browse portraits · Face / Styling / Hair / Search",
  "Portrait Gallery · 选择人像后点击「使用此人像 → ComfyUI」": "Portrait Gallery · Choose a portrait, then click Use portrait",
  "中文人像参考图库": "Portrait reference gallery",
  "人像编号": "Portrait ID",
  "运行工作流后自动抽取人像": "A portrait is drawn automatically when the workflow runs",
  "本次随机人像预览": "Random portrait preview",
  "随机人像预览加载失败，请检查素材原图。": "The random preview could not load. Check the original image.",
  "用户上传": "Uploaded file",
  "短发发型": "Short hairstyle",
  "收腰短发（长后颈·空气刘海）": "Waisted short cut (long nape, wispy bangs)",
  "湿发感短波波（长刘海）": "Wet-look short bob (long bangs)",
  "短狼尾（迷你狼尾剪）": "Short wolf cut (mini wolf cut)",
  "螺旋烫短波波（黑发）": "Spiral-permed short bob (black hair)",
  "浅奶茶色短波波": "Light milk-tea short bob",
  "弧形短发（挑染）": "Rounded short cut (highlights)",
  "蘑菇短发（长刘海）": "Mushroom short cut (long bangs)",
  "迷你波波烫（自然卷感）": "Mini bob perm (natural curls)",
  "迷你波波（眉上齐刘海）": "Mini bob (blunt above-brow bangs)",
  "层次短波波（修颜层次）": "Layered short bob (face-framing layers)",
  "圆弧短波波（空气刘海·深棕色）": "Rounded short bob (wispy bangs, dark brown)",
  "发尾内卷波波（薰衣草灰）": "Inward-curled bob (lavender ash)",
  "一刀切直波波（无刘海）": "Blunt straight bob (no bangs)",
  "前长后短菱形短波波（黑发）": "Diamond-shaped angled short bob (black hair)",
  "外翘波波（深发色）": "Flipped-out bob (dark hair)",
  "露耳利落短发（无刘海）": "Neat ear-revealing short cut (no bangs)",
  "韩式流苏波波（侧刘海）": "Korean tassel bob (side bangs)",
  "双向刘海·发尾内卷中波波": "Two-way bangs with an inward-curled medium bob",
  "收腰波波头（内层挑染）": "Waisted bob (inner highlights)",
  "紧密小卷中发": "Medium hair with tight curls",
  "齐刘海·中长直发": "Medium-long straight hair with blunt bangs",
  "浅奶茶灰米色中发": "Medium hair in light milk-tea ash beige",
  "Hush轻羽层次剪（韩式发型）": "Hush feathered layers (Korean cut)",
  "蝴蝶层次剪（榛果色）": "Butterfly layers (hazelnut)",
  "酒红色·轻透层次剪": "Airy layered cut (burgundy)",
  "中长狼尾烫": "Medium-long wolf-cut perm",
  "中发自然微卷（卷发棒造型感）": "Medium hair with soft styled waves",
  "中发层次内卷（柔和米色）": "Medium inward-curled layers (soft beige)",
  "层次长波波（薄荷米色）": "Layered long bob (mint beige)",
  "一刀切外翘中波波": "Blunt medium bob with flipped-out ends",
  "前长后短中波波（栗子米色）": "Angled medium bob (chestnut beige)",
  "柔亮中长直波波（无刘海）": "Glossy medium-long straight bob (no bangs)",
  "厚重感中发层次剪（巴黎画染）": "Full medium layered cut (balayage)",
  "锁骨层次波波（冷灰米色）": "Collarbone-length layered bob (cool ash beige)",
  "双向刘海·韩式层次剪": "Two-way bangs with Korean layers",
  "收腰中长发（通透发色）": "Waisted medium-long hair (translucent color)",
  "丰富层次剪（薰衣草灰米色）": "Rich layered cut (lavender ash beige)",
  "轻薄齐刘海·碎剪层次": "Light blunt bangs with choppy layers",
  "韩式螺旋烫中长发": "Korean spiral-permed medium-long hair",
  "中长狼尾（樱桃红）": "Medium-long wolf cut (cherry red)",
  "中长直发（有刘海·深发色）": "Medium-long straight hair (bangs, dark color)",
  "中长自然微卷烫": "Medium-long soft-wave perm",
  "中长修颜层次剪（奶茶米色）": "Medium-long face-framing layers (milk-tea beige)",
  "中长黑发·光泽层次剪": "Glossy medium-long black layers",
  "高层次剪×发尾染（金色）": "High layers with blonde dip-dyed ends",
  "Hush轻羽层次剪（灰米色）": "Hush feathered layers (ash beige)",
  "蝴蝶层次剪（薄荷米色·空气刘海）": "Butterfly layers (mint beige, wispy bangs)",
  "长狼尾（水母头）": "Long wolf cut (jellyfish cut)",
  "层次内卷与鬓边碎发（巧克力棕）": "Inward layers and wispy side strands (chocolate brown)",
  "斜刘海·轻盈空气卷": "Side-swept bangs with airy curls",
  "中发发型": "Medium hairstyle",
  "中长发发型": "Medium-long hairstyle",
  "长发发型": "Long hairstyle"
};
 const LANGUAGE_KEY='portrait-gallery-language';
 const normalize=value=>value==='en'?'en':'zh';
 function preferred(search=root.location?.search||'') {
  const value=new URLSearchParams(search).get('lang');
  if(value==='en'||value==='zh')return value;
  try{return normalize(root.localStorage?.getItem(LANGUAGE_KEY)||root.localStorage?.getItem('gallery-upload-language'));}catch{return 'zh';}
 }
 function persist(value){try{root.localStorage?.setItem(LANGUAGE_KEY,normalize(value));}catch{}}
 function translate(source,language,values,depth=0){
  source=String(source??'');let template=source,params=values||{};
  if(language==='en'){
   template=EN[source]??source;
   if(template===source && values===undefined && depth<2 && /[\u3400-\u9fff]/.test(source)){
    for(const [key,en] of Object.entries(EN)){
     if(!key.includes('{')||!/[\u3400-\u9fff]/.test(key))continue;
     const names=[];let pattern='',last=0;
     for(const match of key.matchAll(/\{(\w+)\}/g)){
      pattern+=key.slice(last,match.index).replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(.+?)';names.push(match[1]);last=match.index+match[0].length;
     }
     pattern+=key.slice(last).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
     const found=source.match(new RegExp('^'+pattern+'$'));
     if(found){template=en;params=Object.fromEntries(names.map((name,i)=>[name,translate(found[i+1],language,undefined,depth+1)]));break;}
    }
   }
  }
  if(language==='en'&&template===source&&depth<2&&/[\u3400-\u9fff]/.test(source)&&/[\n·・]/.test(source)) template=source.split(/([\n·・])/).map(part=>/[\n·・]/.test(part)?part:translate(part.trim(),language,undefined,depth+1)).join('');
  return template.replace(/\{(\w+)\}/g,(match,key)=>params[key]??match);
 }
 function registerRows(rows){
  rows.forEach(row=>{
   for(const [zh,en] of [[row.title,row.name_en],[row.name_zh,row.name_en],[row.style_zh,row.style_en],[row.hair_zh,row.hair_en],[row.section_zh,row.section_en]])if(zh&&en)EN[zh]=en;
   if(row['关键词']&&row.keywords_list_en){
    EN[row['关键词'].join(' · ')]=row.keywords_list_en.join(' · ');
    EN[row['关键词'].join('、')]=row.keywords_list_en.join(',');
   }
  });
 }
 // Remember both the original text and our last rendering so dynamic updates can be translated again.
 function watchPage(getLanguage){
  const texts=new WeakMap(),attributes=new WeakMap(),title=document.title;
  function apply(){
   const language=getLanguage();document.documentElement.lang=language==='en'?'en':'zh-CN';document.title=translate(title,language);
   const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
   while(walker.nextNode()){
    const node=walker.currentNode,parent=node.parentElement;
    if(!parent||parent.closest('script,style,textarea,input')||(parent.tagName==='OPTION'&&parent.closest('#gallery-language')))continue;
    let saved=texts.get(node);
    if(!saved||saved.output!==node.nodeValue)saved={source:node.nodeValue};
    const source=saved.source,trimmed=source.trim();
    const output=trimmed?source.replace(trimmed,translate(trimmed,language)):source;
    if(node.nodeValue!==output)node.nodeValue=output;
    saved.output=output;texts.set(node,saved);
   }
   for(const el of document.body.querySelectorAll('*')){
    const saved=attributes.get(el)||{};
    for(const key of ['aria-label','placeholder','title','alt']){
     const value=el.getAttribute(key);if(value===null)continue;
     if(!saved[key]||saved[key].output!==value)saved[key]={source:value};
     const output=translate(saved[key].source,language);
     if(value!==output)el.setAttribute(key,output);saved[key].output=output;
    }
    attributes.set(el,saved);
   }
  }
  const observer=new MutationObserver(apply);observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','placeholder','title','alt']});
  apply();return apply;
 }
 let catalogPromise;
 function loadCatalog(url){
  if(!catalogPromise)catalogPromise=fetch(url).then(response=>{if(!response.ok)throw Error('Cannot load catalog');return response.json();}).catch(error=>{catalogPromise=null;throw error;});
  return catalogPromise;
 }
 const api={loadCatalog,EN,normalize,preferred,persist,translate,registerRows,watchPage,LANGUAGE_KEY};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.PortraitI18n=api;
})(typeof window!=='undefined'?window:globalThis);
