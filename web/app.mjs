(function () {
  'use strict';
  const {records, meta, ranking} = window.PORTRAIT_DATA;
  const {filterRecords, readState, sectionLabels, hairLabels} = window.PortraitCore;
  const $ = selector => document.querySelector(selector);
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const fmt = number => Number(number).toLocaleString('zh-CN');
  const mb = bytes => (bytes / 1048576).toFixed(1) + ' MiB';
  const byId = new Map(records.map(item => [item.id, item]));
  const paths = {
    'arrow-right':'M4 12h16m-6-6 6 6-6 6', 'arrow-down':'M12 4v16m-6-6 6 6 6-6',
    search:'m21 21-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
    heart:'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z',
    download:'M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5',
    close:'m6 6 12 12M6 18 18 6', 'chevron-left':'m15 5-7 7 7 7', 'chevron-right':'m9 5 7 7-7 7',
    moon:'M21 13A9 9 0 0 1 11 3a9 9 0 1 0 10 10Z', sun:'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5',
    reset:'M3 10a9 9 0 1 1 2.6 8.4M3 4v6h6', sliders:'M4 7h5m5 0h6M4 17h10m5 0h1M9 4v6m5-6v6m0 4v6m5-6v6'
  };
  function icon(name) {return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[name] || paths['arrow-right']}"/></svg>`;}
  document.querySelectorAll('[data-icon]').forEach(node => {node.innerHTML = icon(node.dataset.icon);});
  function stored(key, fallback) {try {return JSON.parse(localStorage.getItem(key)) ?? fallback;} catch {return fallback;}}
  function save(key, value) {try {localStorage.setItem(key, JSON.stringify(value));return true;} catch {return false;}}
  const savedFavorites = stored('portrait-atlas-favorites-v1', []);
  const favorites = new Set(Array.isArray(savedFavorites) ? savedFavorites.filter(id => byId.has(id)) : []);
  const state = {...readState(location.hash, records), limit:40};
  let filtered = [], shown = 0, rankCategory = '総合', viewerList = [], viewerIndex = -1, imageVersion = 0, lastFocus = null, toastTimer;
  let selectedId = '';
  const viewer = $('#viewer');
  const info = $('#info-dialog');
  const themePreference = stored('portrait-atlas-theme', 'system');
  let theme = ['light','dark'].includes(themePreference) ? themePreference : (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  function applyTheme() {
    document.documentElement.dataset.theme = theme;
    $('#theme').innerHTML = icon(theme === 'dark' ? 'sun' : 'moon');
    $('#theme').setAttribute('aria-label', theme === 'dark' ? '切换浅色模式' : '切换深色模式');
    $('#theme').title = $('#theme').getAttribute('aria-label');
  }
  applyTheme();
  $('#theme').addEventListener('click', () => {theme = theme === 'dark' ? 'light' : 'dark';save('portrait-atlas-theme', theme);applyTheme();});

  function toast(message) {clearTimeout(toastTimer);$('#toast').textContent = message;$('#toast').hidden = false;toastTimer = setTimeout(() => {$('#toast').hidden = true;}, 2400);}
  function writeURL(id = '') {
    const p = new URLSearchParams();
    if (state.section !== 'face') p.set('sec', state.section);
    if (state.hair) p.set('hair', state.hair);
    if (state.style) p.set('style', state.style);
    if (state.q) p.set('q', state.q);
    if (state.favorites) p.set('fav', '1');
    if (state.sort !== 'default') p.set('sort', state.sort);
    if (id) p.set('id', id);
    const hash = p.size ? '#' + p.toString() : '';
    try {history.replaceState(null, '', location.pathname + location.search + hash);} catch {if (location.hash !== hash) location.hash = hash;}
  }

  function buildHero() {
    const picks = [records.find(item => item.section === 'face')];
    records.filter(item => item.hero).sort((a,b) => a.hero-b.hero).forEach(item => {if (!picks.includes(item)) picks.push(item);});
    $('#hero-art').innerHTML = picks.slice(0,3).map((item,i) => `<figure class="hero-portrait"><img src="${escape(item.thumb)}" width="${item.thumb_w}" height="${item.thumb_h}" alt="${escape(item.hair_zh)}人像参考" ${i ? 'loading="eager"' : 'fetchpriority="high"'}><figcaption>${escape(item.hair_zh)} / FACE REFERENCE</figcaption></figure>`).join('');
  }
  function renderRanking() {
    $('#rank-tabs').innerHTML = ranking.cats.map(key => `<button type="button" data-rank="${escape(key)}" aria-pressed="${key === rankCategory}">${escape(ranking.labels[key])}</button>`).join('');
    const list = (ranking.top[rankCategory] || []).map(id => byId.get(id)).filter(Boolean);
    $('#rank-list').innerHTML = list.map((item,i) => `<li class="rank-item"><button type="button" data-rank-id="${escape(item.id)}" aria-label="榜单第 ${i+1} 名：${escape(item.title)}"><div class="rank-image"><img src="${escape(item.thumb)}" width="${item.thumb_w}" height="${item.thumb_h}" alt="${escape(item.title)}" loading="lazy" decoding="async"></div><span class="rank-no">${String(i+1).padStart(2,'0')}</span><span class="rank-label">${escape(item.hair_zh)} · ${escape(item.id)}</span></button></li>`).join('');
  }
  $('#rank-tabs').addEventListener('click', event => {const button=event.target.closest('[data-rank]');if(button){rankCategory=button.dataset.rank;renderRanking();}});
  $('#rank-list').addEventListener('click', event => {const button=event.target.closest('[data-rank-id]');if(button){const list=ranking.top[rankCategory].map(id=>byId.get(id)).filter(Boolean);openViewer(list,list.findIndex(item=>item.id===button.dataset.rankId));}});

  function renderControls() {
    $('#section-tabs').innerHTML = ['all','face','styling'].map(section => `<button id="tab-${section}" type="button" role="tab" class="section-tab" data-section="${section}" aria-controls="grid" aria-selected="${state.section===section}" tabindex="${state.section===section?0:-1}">${sectionLabels[section]} <small>${fmt(section==='all'?meta.total:meta.sections[section])}</small></button>`).join('');
    $('#grid').setAttribute('aria-labelledby', 'tab-' + state.section);
    const base = filterRecords(records, {...state, hair:'', style:''}, favorites);
    $('#hair-filters').innerHTML = [['','全部发型'], ...Object.entries(hairLabels)].map(([hair,label]) => `<button type="button" class="hair-chip" data-hair="${escape(hair)}" aria-pressed="${state.hair===hair}">${label}<small>${fmt(hair ? base.filter(item=>item.hair===hair).length : base.length)}</small></button>`).join('');
    const styleBase = filterRecords(records, {...state, style:'', q:''}, favorites);
    const styles = [...new Map(styleBase.filter(item=>item.style).map(item=>[item.style,item.style_zh])).entries()];
    $('#style-filter').innerHTML = '<option value="">全部风格</option>' + styles.map(([key,label]) => `<option value="${escape(key)}">${escape(label)}</option>`).join('');
    $('#style-filter').value = state.style;
    $('#search').value = state.q;
    $('#sort').value = state.sort;
    $('#favorite-count').textContent = favorites.size;
    $('#favorite-filter').setAttribute('aria-pressed', String(state.favorites));
    $('#section-note').textContent = {all:'正脸与造型独立收录，图片之间不保证人物对应',face:'面部特征与角色一致性参考',styling:'服饰、发质与整体气质参考'}[state.section];
    const active = [['hair',state.hair && hairLabels[state.hair]], ['style',state.style && records.find(item=>item.style===state.style)?.style_zh], ['q',state.q && '搜索：'+state.q], ['favorites',state.favorites && '我的收藏']].filter(([,value])=>value);
    $('#active-filters').innerHTML = active.map(([key,value])=>`<button type="button" class="active-chip" data-clear="${key}" aria-label="移除筛选：${escape(value)}">${escape(value)}<span aria-hidden="true">×</span></button>`).join('');
    const n = active.length;
    $('#filter-toggle').innerHTML = icon('sliders') + ' 筛选' + (n ? ` (${n})` : '');
  }
  function card(item) {
    const liked = favorites.has(item.id);
    return `<article class="portrait-card" data-id="${escape(item.id)}" aria-current="${item.id === selectedId}"><div class="card-image"><button class="card-open" type="button" data-open="${escape(item.id)}" aria-label="查看大图：${escape(item.title)}"><img src="${escape(item.thumb)}" alt="${escape(item.section_zh+' · '+item.title)}" loading="lazy" decoding="async" width="${item.thumb_w}" height="${item.thumb_h}"></button><button type="button" class="card-favorite" data-favorite="${escape(item.id)}" aria-pressed="${liked}" aria-label="${liked?'取消收藏':'收藏'}：${escape(item.id)}">${icon('heart')}</button><span class="card-type">${escape(item.section_zh)}</span></div><div class="card-body"><div class="card-heading"><h3>${escape(item.title)}</h3><a class="card-download" href="${escape(item.full)}" download="${escape(item.id)}.png" aria-label="下载 ${escape(item.id)} PNG 原图，${mb(item.bytes)}" title="${item.w}×${item.h} · ${mb(item.bytes)}">${icon('download')}<span>PNG</span></a></div><div class="card-meta"><span>${escape(item.hair_zh)}</span><span>·</span><code>${escape(item.id)}</code></div></div></article>`;
  }
  function updateResult() {
    $('#result-count').innerHTML = `共 <strong>${fmt(filtered.length)}</strong> 张${state.favorites?'收藏':''}参考 <span>· 已加载 ${fmt(shown)} 张</span>`;
    $('#empty').hidden = filtered.length > 0;
    $('#more').hidden = shown >= filtered.length;
    $('#more').innerHTML = `加载更多（剩余 ${fmt(filtered.length-shown)} 张）` + icon('arrow-down');
    $('#end-note').hidden = filtered.length===0 || shown<filtered.length;
    if (state.favorites && favorites.size===0) {
      $('#empty h3').textContent = '收藏夹还没有人像';
      $('#empty p').textContent = '点击图片右上角的爱心，将喜欢的人像留在这里。';
    } else {
      $('#empty h3').textContent = '还没有找到合适的人像';
      $('#empty p').textContent = '换个关键词，或清除筛选再看看。';
    }
  }
  function showMore() {
    const next = Math.min(shown+state.limit, filtered.length);
    $('#grid').insertAdjacentHTML('beforeend', filtered.slice(shown,next).map(card).join(''));
    shown = next;updateResult();
  }
  function render(updateURL=true) {
    filtered = filterRecords(records,state,favorites);
    $('#grid').replaceChildren();shown=0;
    renderControls();showMore();
    if (updateURL) writeURL(viewer.open && viewerList[viewerIndex] ? viewerList[viewerIndex].id : '');
  }
  function reset() {clearTimeout(searchTimer);Object.assign(state,{section:'all',hair:'',style:'',q:'',favorites:false,sort:'default'});render();}
  function setSection(section) {state.section=section;state.style='';render();}
  $('#section-tabs').addEventListener('click',event=>{const button=event.target.closest('[data-section]');if(button)setSection(button.dataset.section);});
  $('#section-tabs').addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    event.preventDefault();const sections=['all','face','styling'];const i=sections.indexOf(state.section);
    const next=event.key==='Home'?0:event.key==='End'?2:(i+(event.key==='ArrowRight'?1:2))%3;
    setSection(sections[next]);$('#tab-'+sections[next]).focus();
  });
  $('#hair-filters').addEventListener('click',event=>{const button=event.target.closest('[data-hair]');if(button){state.hair=button.dataset.hair;state.style='';render();}});
  $('#style-filter').addEventListener('change',event=>{state.style=event.target.value;render();});
  $('#sort').addEventListener('change',event=>{state.sort=event.target.value;render();});
  let searchTimer;
  $('#search').addEventListener('input',event=>{const value=event.target.value;clearTimeout(searchTimer);searchTimer=setTimeout(()=>{state.q=value.trim();render();},120);});
  $('#reset').addEventListener('click',reset);$('#empty-reset').addEventListener('click',reset);
  $('#active-filters').addEventListener('click',event=>{const button=event.target.closest('[data-clear]');if(button){state[button.dataset.clear]=button.dataset.clear==='favorites'?false:'';if(button.dataset.clear==='hair')state.style='';render();}});
  $('#favorite-filter').addEventListener('click',()=>{state.favorites=!state.favorites;render();});
  $('#filter-toggle').addEventListener('click',()=>{const open=$('#filter-toggle').getAttribute('aria-expanded')!=='true';$('#filter-toggle').setAttribute('aria-expanded',String(open));$('#filter-panel').classList.toggle('is-open',open);});
  $('#more').addEventListener('click',showMore);
  // Keep keyboard access predictable: automatic loading follows the first user scroll.
  let hasScrolled=false;
  addEventListener('scroll',()=>{hasScrolled=true;},{passive:true});
  if ('IntersectionObserver' in window) new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)&&hasScrolled&&shown<filtered.length)showMore();},{rootMargin:'180px'}).observe($('#sentinel'));
  $('#grid').addEventListener('click',event=>{
    const favorite=event.target.closest('[data-favorite]');if(favorite){toggleFavorite(favorite.dataset.favorite);return;}
    const open=event.target.closest('[data-open]');if(open)openViewer(filtered,filtered.findIndex(item=>item.id===open.dataset.open));
  });
  $('#grid').addEventListener('error',event=>{if(event.target.tagName==='IMG')event.target.closest('.card-image')?.classList.add('image-error');},true);

  function toggleFavorite(id) {
    if(favorites.has(id))favorites.delete(id);else favorites.add(id);
    const persisted=save('portrait-atlas-favorites-v1',[...favorites]);
    const liked=favorites.has(id);
    document.querySelectorAll('[data-favorite]').forEach(button=>{if(button.dataset.favorite===id){button.setAttribute('aria-pressed',String(liked));button.setAttribute('aria-label',(liked?'取消收藏':'收藏')+'：'+id);}});
    $('#favorite-count').textContent=favorites.size;
    if(viewer.open)updateViewerFavorite();
    if(state.favorites)render();
    if(!persisted)toast('当前浏览器无法保存收藏，关闭页面后将不会保留');
  }
  function updateViewerFavorite() {
    const item=viewerList[viewerIndex];if(!item)return;
    const liked=favorites.has(item.id);
    $('#viewer-favorite').innerHTML=icon('heart')+(liked?' 已收藏 · 取消收藏':' 收藏这张人像');
    $('#viewer-favorite').setAttribute('aria-pressed',String(liked));
  }
  function showViewer(index) {
    const item=viewerList[index];if(!item)return;
    viewerIndex=index;const request=++imageVersion;
    const image=$('#viewer-image');image.src=item.thumb;image.alt=item.section_zh+' · '+item.title;
    $('#image-status').hidden=false;$('#image-status').textContent='正在加载 PNG 原图…';
    const full=new Image();full.onload=()=>{if(request===imageVersion&&viewer.open){image.src=item.full;$('#image-status').hidden=true;}};
    full.onerror=()=>{if(request===imageVersion){$('#image-status').hidden=false;$('#image-status').textContent='原图加载失败，可尝试新窗口打开';}};full.src=item.full;
    $('#viewer-section').textContent=item.section_zh+' / '+item.section.toUpperCase()+' REFERENCE';
    $('#viewer-title').textContent=item.title;$('#viewer-id').textContent=item.id;
    $('#viewer-position').textContent=`${fmt(index+1)} / ${fmt(viewerList.length)}`;
    $('#viewer-meta').innerHTML=[['参考类型',item.section_zh],['发型长度',item.hair_zh],['原图尺寸',item.w+' × '+item.h],['文件大小',mb(item.bytes)]].map(([key,value])=>`<dt>${escape(key)}</dt><dd>${escape(value)}</dd>`).join('');
    $('#viewer-original-style').textContent=item.style?'原始描述：'+item.style:'原站未提供更细的发型描述。';
    $('#viewer-download').href=item.full;$('#viewer-download').download=item.id+'.png';$('#viewer-open').href=item.full;
    $('#viewer-prev').disabled=index===0;$('#viewer-next').disabled=index===viewerList.length-1;
    $('#use-portrait').disabled = window.parent === window;
    $('#use-portrait').textContent = window.parent === window ? '请从 ComfyUI 节点打开以使用人像' : '使用此人像 → ComfyUI';
    updateViewerFavorite();writeURL(item.id);
  }
  function openViewer(list,index) {
    if(!list[index])return;lastFocus=document.activeElement;viewerList=[...list];
    if(!viewer.open)viewer.showModal();document.body.classList.add('modal-open');
    showViewer(index);$('#viewer-close').focus();
  }
  function closeViewer() {if(viewer.open)viewer.close();}
  viewer.addEventListener('close',()=>{imageVersion++;$('#viewer-image').removeAttribute('src');viewerIndex=-1;if(!info.open)document.body.classList.remove('modal-open');writeURL();if(lastFocus?.isConnected)lastFocus.focus();});
  $('#viewer-close').addEventListener('click',closeViewer);
  $('#viewer-prev').addEventListener('click',()=>showViewer(viewerIndex-1));
  $('#viewer-next').addEventListener('click',()=>showViewer(viewerIndex+1));
  $('#viewer-favorite').addEventListener('click',()=>{const item=viewerList[viewerIndex];if(item)toggleFavorite(item.id);});
  viewer.addEventListener('click',event=>{if(event.target===viewer){const rect=viewer.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)closeViewer();}});
  $('#copy-id').addEventListener('click',async()=>{
    const text=viewerList[viewerIndex]?.id;if(!text)return;
    try {if(navigator.clipboard?.writeText)await navigator.clipboard.writeText(text);else {const input=document.createElement('textarea');input.value=text;input.style.position='fixed';input.style.opacity='0';viewer.appendChild(input);input.select();if(!document.execCommand('copy'))throw Error();input.remove();}$('#copy-id').textContent='已复制';setTimeout(()=>{$('#copy-id').textContent='复制 ID';},1800);} catch {$('#copy-id').textContent='请手动复制';}
  });
  let touchStart=null;
  $('#viewer-stage').addEventListener('touchstart',event=>{if(event.touches.length===1)touchStart=[event.touches[0].clientX,event.touches[0].clientY];else touchStart=null;},{passive:true});
  $('#viewer-stage').addEventListener('touchend',event=>{if(!touchStart)return;const dx=event.changedTouches[0].clientX-touchStart[0],dy=event.changedTouches[0].clientY-touchStart[1];if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.3)showViewer(viewerIndex+(dx<0?1:-1));touchStart=null;},{passive:true});
  document.addEventListener('keydown',event=>{
    if(viewer.open){if(['ArrowLeft','ArrowRight'].includes(event.key)&&!['INPUT','TEXTAREA'].includes(event.target.tagName)){event.preventDefault();showViewer(viewerIndex+(event.key==='ArrowRight'?1:-1));}return;}
    if(!info.open&&event.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(event.target.tagName)){event.preventDefault();$('#search').focus();}
    if(event.key==='Escape'&&document.activeElement===$('#search')){$('#search').value='';state.q='';render();$('#search').blur();}
  });
  const infoContent={
    tips:`<p class="eyebrow">A LITTLE GUIDE</p><h2 id="info-title">从参考图，到同一个角色。</h2><h3>正脸与造型，怎么选？</h3><ul><li><strong>正脸参考：</strong>以正面面部特征为重点，适合支持角色参考、面部参考的创作工具。</li><li><strong>造型参考：</strong>包含服饰、发质与整体氛围，适合建立造型方向；角度各不相同。</li><li>两类图片独立收录，不保证相同人物一一对应。原站没有提供描述的条目，仅显示发型长度与类型。</li></ul><h3>更快找到喜欢的人像</h3><ul><li>类型、发型、风格和关键词可以组合筛选。搜索支持中文、日文、ID，多关键词按“同时包含”匹配。</li><li>按 <kbd>/</kbd> 聚焦搜索。大图中按 <kbd>←</kbd> <kbd>→</kbd> 切换，按 <kbd>Esc</kbd> 关闭；手机支持左右滑动。</li><li>点击爱心收藏。收藏仅存于当前浏览器，清除浏览器数据会丢失；不会上传到服务器。</li><li>下载 PNG 原图可保留细节。参考效果由模型、提示词及设置共同决定。</li></ul><h3>关于榜单</h3><p>“原站下载榜”来自 2026 年 10 月 30 日保存的原站榜单，不是本站实时统计。本站没有浏览、下载追踪接口。</p>`,
    rules:`<p class="eyebrow">SOURCE & CREDITS</p><h2 id="info-title">来源与许可</h2><p>图片与原始元数据来自 <a href="https://ai-portrait-gallery.pages.dev/" target="_blank" rel="noopener noreferrer">AI モデル顔データベース</a>，原作者 <a href="https://x.com/agi_aibusi" target="_blank" rel="noopener noreferrer">あぎ（@agi_aibusi）</a>。本项目是独立中文整理版，不代表原作者的官方版本或背书。</p><h3>原站公开说明</h3><ul><li>原站标注 <a href="https://creativecommons.org/publicdomain/zero/1.0/deed.zh-hans" target="_blank" rel="noopener noreferrer">CC0 1.0</a>，允许商业作品、编辑与参考使用，不强制署名。</li><li>图片为 AI 生成的虚构人物，并非真实人物。</li><li>原站同时说明：请勿用于冒充真实人物或违反公序良俗的用途；并请求避免直接再分发、转载图片数据本身。</li><li>原站注明图片元数据已删除，按现状提供，不作保证。</li></ul><p>以上保留原站公开标注与请求，请结合原始页面了解完整说明。本站页面程序的 MIT 许可不改变第三方素材的适用条款。</p><p>数据快照：2026-10-30。共 1,499 张人像，包含 893 张正脸、606 张造型参考。完整来源和原站快照保存在项目文档中。</p>`
  };
  document.querySelectorAll('[data-info]').forEach(button=>button.addEventListener('click',()=>{$('#info-content').innerHTML=infoContent[button.dataset.info];if(!info.open)info.showModal();document.body.classList.add('modal-open');$('#info-close').focus();}));
  $('#info-close').addEventListener('click',()=>info.close());
  info.addEventListener('close',()=>{if(!viewer.open)document.body.classList.remove('modal-open');});
  info.addEventListener('click',event=>{if(event.target===info){const rect=info.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)info.close();}});
  window.addEventListener('hashchange',()=>{
    if(['#gallery','', '#'].includes(location.hash))return;
    Object.assign(state,readState(location.hash,records));render(false);
    const id=new URLSearchParams(location.hash.slice(1)).get('id');
    if(id&&byId.has(id)){const list=filtered.some(item=>item.id===id)?filtered:records;openViewer(list,list.findIndex(item=>item.id===id));}
  });
  $('#use-portrait').addEventListener('click', () => {
    const item = viewerList[viewerIndex];
    if (item && window.parent !== window) window.parent.postMessage({type:'portrait-gallery-select', id:item.id}, location.origin);
  });
  window.addEventListener('message', event => {
    if (event.origin !== location.origin || event.source !== window.parent || event.data?.type !== 'portrait-gallery-current') return;
    if (typeof event.data.id !== 'string' || !byId.has(event.data.id)) return;
    selectedId = event.data.id;
    $('#current-portrait').textContent = '当前节点人像：' + selectedId;
    render(false);
  });
  buildHero();renderRanking();render(false);
  if (window.parent !== window) window.parent.postMessage({type:'portrait-gallery-ready'}, location.origin);
  const initialId=new URLSearchParams(location.hash.slice(1)).get('id');
  if(initialId&&byId.has(initialId)){const list=filtered.some(item=>item.id===initialId)?filtered:records;openViewer(list,list.findIndex(item=>item.id===initialId));}
})();
