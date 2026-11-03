// Random-node messages extend the shared gallery vocabulary.
(function(root){
  const EN={
  "人像类型":"Reference type",
  "本次随机人像预览": "Random portrait preview",
  "随机人像预览加载失败，请检查素材原图。": "The random preview could not load. Check the original image.",
  "上次运行结果": "Last execution result",
  "运行工作流后自动抽取人像": "A portrait reference is drawn automatically when the workflow runs",
  "随机来源": "Random source",
  "点击骰子预览，或运行工作流自动抽取人像": "Click the dice to preview, or run the workflow to draw a portrait",
  "正在抽取人像…": "Drawing a portrait…",
  "🔒 已锁定": "🔒 Locked",
  "🎲 随机": "🎲 Random",
  "随机人像": "Draw a random portrait",
  "仅更新此节点预览，不运行工作流": "Update this preview without running the workflow",
  "当前人像编号": "Current portrait ID",
  "🔒 锁定随机": "🔒 Lock random selection",
  "随机失败，请重试": "Could not draw a portrait. Try again",
  "请先点击骰子选择人像，再锁定": "Draw a portrait before locking",
  "无效的人像编号": "Invalid portrait ID",
  "all：全部；builtin：内置；user：自定义。": "all: all references; builtin: bundled; user: custom uploads.",
  "控制界面与文本输出语言，随工作流保存。": "Controls the UI and text output language. Saved with the workflow.",
  "当前选择的人像，锁定后运行工作流使用此图。": "The selected portrait. Workflow runs keep this reference while locked.",
  "保持当前人像并禁用骰子。": "Keep the current portrait and disable the dice.",
  "界面与提示语言": "UI / error language",
  "图像": "Image",
  "宽度": "Width",
  "高度": "Height",
  "人像编号": "Portrait ID",
  "界面与输出语言": "UI / output language",
  "人像名称": "Portrait name",
  "描述": "Description",
  "参考类型": "Reference type",
  "英文关键词": "English keywords"
};
  const LANGUAGE_KEY="portrait-gallery-random-language";
  const normalize=value=>value==='en'?'en':'zh';
  function preferred(){try{return normalize(localStorage.getItem(LANGUAGE_KEY));}catch{return 'zh';}}
  function persist(value){try{localStorage.setItem(LANGUAGE_KEY,normalize(value));}catch{}}
  function translate(text,language){return language==='en'?(EN[text]??root.PortraitI18n?.translate(text,language)??text):text;}
  const api={preferred,persist,normalize,translate};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.RandomPortraitI18n=api;
})(typeof window!=='undefined'?window:globalThis);
