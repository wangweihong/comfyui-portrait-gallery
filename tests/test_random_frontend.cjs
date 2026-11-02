const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..'),uid='u-'+'a'.repeat(32);
async function setup({fetchImpl,legacyI18n=false}={}){
  let extension,changes=0;
  class Element{constructor(){this.style={};this.children=[];this.attributes={};}append(...children){this.children.push(...children);}setAttribute(k,v){this.attributes[k]=v;}}
  const origin={name:'origin',value:'all'},language={name:'language',value:'zh'};
  class Node{constructor(){this.widgets=[origin,language];this.dom={};this.properties={};this.outputs=Array.from({length:7},()=>({}));this.title='RandomPortraitGallery';}addDOMWidget(name,type,el){this.dom[name]=el;}setSize(){}setDirtyCanvas(){}addOutput(name,type){this.outputs.push({name,type});}}
  const context=vm.createContext({...fetchImpl?{fetch:fetchImpl}:{},window:{},URLSearchParams,localStorage:{getItem:()=>null,setItem(){}},document:{createElement:()=>new Element()},api:{apiURL:p=>'/api'+p},app:{registerExtension:e=>{extension=e;},graph:{change(){changes++;}},queuePrompt(){throw Error('Must never enqueue a task');}}});
  vm.runInContext(fs.readFileSync(path.join(root,'web/i18n.mjs'),'utf8'),context);
  vm.runInContext(fs.readFileSync(path.join(root,'web/random_i18n.mjs'),'utf8'),context);
  if(legacyI18n){delete context.window.PortraitI18n.loadCatalog;delete context.window.RandomPortraitI18n.loadCatalog;}
  vm.runInContext(fs.readFileSync(path.join(root,'web/random_portrait_gallery.js'),'utf8').replace(/^import .*;\s*$/gm,''),context);
  class Original{}await extension.beforeRegisterNodeDef(Original,{name:'PortraitGallery'});assert.equal(Original.prototype.onNodeCreated,undefined);
  await extension.beforeRegisterNodeDef(Node,{name:'RandomPortraitGallery'});const node=new Node();node.onNodeCreated();
  return{node,origin,language,image:node.dom.random_portrait_preview.children[0],status:node.dom.random_portrait_preview.children[1],get changes(){return changes;}};
}
test('only new random node receives execution preview; origin and input values stay unchanged',async()=>{
  const s=await setup();s.node.onExecuted({portrait_id:[uid],name:['My portrait']});s.image.onload();
  assert.equal(s.image.src,`/api/portrait_gallery/assets/full/${uid}.png`);assert.equal(s.node.properties.last_portrait_id,uid);assert.equal(s.origin.value,'all');assert.equal(s.language.value,'zh');assert.match(s.status.textContent,/My portrait/);assert.equal(s.changes,1);
});
test('saved preview and English interface are restored without queuing or freezing the pool',async()=>{
  const s=await setup();s.node.properties={last_portrait_id:uid,last_portrait_name:'Saved hair'};s.node.onConfigure({widgets_values:['user','en']});s.image.onload();
  assert.equal(s.image.src,`/api/portrait_gallery/assets/full/${uid}.png`);assert.match(s.status.textContent,/Last execution result/);assert.equal(s.language.value,'en');assert.equal(s.changes,0);
});
test('stale image callbacks cannot replace a newer random result',async()=>{
  const s=await setup();s.node.onExecuted({portrait_id:[uid]});const stale=s.image.onerror;
  s.node.onExecuted({portrait_id:['h-next']});s.image.onload();stale();assert.equal(s.image.style.display,'block');assert.doesNotMatch(s.status.textContent,/失败/);
});

test('random preview names switch immediately with the selected output language',async()=>{
 const s=await setup();s.node.onExecuted({portrait_id:[uid],name:['我的参考'],name_zh:['我的参考'],name_en:['My reference']});
 s.language.callback('en');assert.match(s.status.textContent,/My reference/);assert.doesNotMatch(s.status.textContent,/[\u3400-\u9fff]/);
 s.language.callback('zh');assert.match(s.status.textContent,/我的参考/);
});

test('saved nodes gain the name output without changing existing connections',async()=>{
 const s=await setup();s.node.outputs.pop();s.node.outputs[4].links=[17];const original=s.node.outputs.slice();
 s.node.onConfigure({widgets_values:['all','en']});assert.equal(s.node.outputs.length,7);assert.equal(s.node.outputs[6].name,'portrait');
 assert.equal(s.node.outputs[6].label,'Portrait name');original.forEach((output,i)=>assert.equal(s.node.outputs[i],output));assert.deepEqual(s.node.outputs[4].links,[17]);
});

test('older cached translations cannot abort restoring a workflow with a saved preview',async()=>{
 const s=await setup({legacyI18n:true,fetchImpl:async()=>({ok:true,json:async()=>[{id:uid,name_zh:'旧名称',name_en:'Restored reference'}]})});
 s.node.properties={last_portrait_id:uid,last_portrait_name:'旧名称'};
 assert.doesNotThrow(()=>s.node.onConfigure({widgets_values:['all','en']}));
 await new Promise(resolve=>setImmediate(resolve));
 assert.match(s.status.textContent,/Restored reference/);assert.equal(s.changes,0);
});

test('preview catalog failures do not throw from workflow loading',async()=>{
 for(const fetchImpl of [()=>{throw Error('offline');},async()=>({ok:false}),async()=>({ok:true,json:async()=>({invalid:true})})]){
  const s=await setup({legacyI18n:true,fetchImpl});
  s.node.properties={last_portrait_id:uid,last_portrait_name:'Saved reference'};
  assert.doesNotThrow(()=>s.node.onConfigure({widgets_values:['all','en']}));
  await new Promise(resolve=>setImmediate(resolve));
  assert.match(s.status.textContent,/Saved reference/);assert.equal(s.node.properties.last_portrait_id,uid);assert.equal(s.changes,0);
 }
});
test('restoring previews shares one catalog request without changing node inputs',async()=>{
 let calls=0;const s=await setup({legacyI18n:true,fetchImpl:async()=>{calls++;return {ok:true,json:async()=>[{id:uid,name_zh:"旧名称",name_en:"Restored reference"}]};}});
 s.node.properties={last_portrait_id:uid,last_portrait_name:'旧名称'};
 s.node.onConfigure({widgets_values:['all','en']});s.node.onConfigure({widgets_values:['all','en']});
 await new Promise(resolve=>setImmediate(resolve));
 assert.equal(calls,1);assert.equal(s.origin.value,'all');assert.equal(s.language.value,'en');assert.equal(s.changes,0);
});
