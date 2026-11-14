// screenshots of the «الأنشطة التفاعلية» tab: node actshot.js [course] [lesson]
const {chromium}=require('playwright');const path=require('path');
(async()=>{const C=process.argv[2]||'dc-machines',LID=process.argv[3];const stub=process.argv.includes('--stub');
const b=await chromium.launch();const errs=[];
for(const style of ['formal','stations'])for(const w of [1280,390]){
  const ctx=await b.newContext({viewport:{width:w,height:w>500?900:844},deviceScaleFactor:1});const p=await ctx.newPage();
  p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/Failed to load/.test(m.text()))errs.push(m.text())});
  await p.addInitScript(s=>{localStorage.setItem('elib-style',s)},style);
  await p.goto('file://'+path.join('/home/claude/lib/courses',C,'index.html'));await p.waitForTimeout(300);
  const id=LID||await p.evaluate(()=>PLCBOOK.LESSONS.slice().sort((a,b)=>a.unit-b.unit||a.order-b.order)[0].id);
  if(stub)await p.evaluate(id=>PLCBOOK.acts({[id]:{open:['س1','س2','س3'],exit:[{q:'q',o:['a','b','c','d'],c:0,e:''}]}}),id);
  await p.evaluate(id=>{location.hash=id},id);await p.waitForTimeout(300);
  const tabs=await p.$$eval(w>760?'.ltabs button':'.bnav button',bs=>bs.map(b=>b.textContent.trim()));
  await p.click((w>760?'.ltabs':'.bnav')+' button[data-tab="acts"]');await p.waitForTimeout(250);
  const info=await p.evaluate(()=>({cards:[...document.querySelectorAll('.act-card')].map(c=>c.dataset.act+':'+c.querySelector('.act-ready').textContent),links:[...document.querySelectorAll('.acts a')].map(a=>a.getAttribute('href')),quizBox:!!document.querySelector('.classquiz'),overflow:document.documentElement.scrollWidth>innerWidth}));
  console.log(style,w,id,'tabs:',tabs.join('|'));console.log('  ',JSON.stringify(info));
  await p.screenshot({path:path.join(__dirname,'shots/acts',`${C}-${style}-${w}.png`),fullPage:true});await ctx.close();}
console.log(errs.length?'ERRORS\n'+errs.join('\n'):'no errors');await b.close()})();
