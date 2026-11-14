// self-study section check (dc-machines): node studytest.js
const {chromium}=require('playwright');const path=require('path');const assert=(c,m)=>{if(!c)throw new Error('FAIL: '+m);console.log('  ok -',m)};
const URL='file://'+path.join('/home/claude/lib/courses/dc-machines/index.html');
(async()=>{const b=await chromium.launch();const errs=[];
const open=async(ctx,id)=>{const p=await ctx.newPage();p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/Failed to load/.test(m.text()))errs.push(m.text())});
  await p.goto(URL+'#'+id);await p.waitForTimeout(300);await p.evaluate(()=>{sessionStorage.clear()});
  const w=p.viewportSize().width;await p.click((w>760?'.ltabs':'.bnav')+' button[data-tab="acts"]');await p.waitForTimeout(250);return p};
for(const style of ['formal','stations'])for(const w of [1280,390]){console.log(style,w);
  const ctx=await b.newContext({viewport:{width:w,height:w>500?900:844},deviceScaleFactor:w>500?1:2,hasTouch:w<500});
  await ctx.addInitScript(s=>{if(!sessionStorage.getItem('init')){sessionStorage.setItem('init',1);localStorage.setItem('elib-style',s)}},style);
  let p=await open(ctx,'u1-l2');
  // live card errs: u1-l2 has none, u2-l1 has
  assert(!(await p.$('[data-act="errs"]')),'no «اكتشف الخطأ» card without variants');
  // ---- cards
  const fc='[data-sb="cards"]';
  const prog=async()=>p.$eval(fc+' .fc-prog',e=>e.textContent.trim());
  assert(/عرفت 0 من 25/.test(await prog()),'progress starts 0 of 25: '+await prog());
  const front1=await p.$eval(fc+' .fc-f',e=>e.textContent);
  await p.click(fc+' .fc-card');assert(await p.$(fc+' .fc-card.back'),'card flips on click');
  await p.click(fc+' [data-a="no"]');
  const seen=[front1];let back=-1;
  for(let k=1;k<=5;k++){const f=await p.$eval(fc+' .fc-f',e=>e.textContent);if(f===front1){back=k;break}seen.push(f);
    await p.focus(fc+' .fc-card');await p.keyboard.press('Space');assert(await p.$(fc+' .fc-card.back'),'space flips');await p.click(fc+' [data-a="yes"]')}
  assert(back>0,'unknown card came back after '+back+' cards');
  assert(back===4&&/عرفت 3 من 25/.test(await prog()),'progress 3 of 25 (card re-queued 3 later)');
  if(w===1280&&style==='formal'){await p.click(fc+' .fc-card');await p.screenshot({path:path.join(__dirname,'shots/study/card-back.png'),clip:await (await p.$(fc)).boundingBox()})}
  // filter chips
  const chips=await p.$$eval(fc+' .chip',bs=>bs.map(b=>b.textContent.trim()));assert(chips.length===5,'chips: '+chips.join(' | '));
  await p.click(fc+' .chip[data-k="law"]');assert(/من 5/.test(await prog()),'law filter: '+await prog());await p.click(fc+' .chip[data-k="all"]');
  // reload persists
  await p.reload();await p.waitForTimeout(300);await p.click((w>760?'.ltabs':'.bnav')+' button[data-tab="acts"]');await p.waitForTimeout(250);
  assert(/عرفت 3 من 25/.test(await prog()),'progress persists after reload');
  // ---- order (tap)
  const od='[data-sb="order"] .stb-item';
  const correct=await p.evaluate(()=>PLCBOOK.STUDY.lessons['u1-l2'].order[0].steps.map(s=>{const d=document.createElement('div');d.innerHTML=s;return d.textContent.trim()}));
  const cur=async()=>p.$$eval(od+' .ord-t',bs=>bs.map(b=>b.textContent.trim()));
  let c0=await cur();assert(c0.join()!==correct.join(),'steps start shuffled');
  for(let i=0;i<correct.length;i++){c0=await cur();const j=c0.indexOf(correct[i]);if(j!==i){await p.click(`${od} .ord-t[data-p="${j}"]`);assert(await p.$(`${od} .ord-i.sel`),'tap selects');await p.click(`${od} .ord-t[data-p="${i}"]`)}}
  assert((await cur()).join()===correct.join(),'tap-to-move reorders to correct');
  await p.click(od+' [data-up="1"]');await p.click(od+' [data-a="check"]');
  const nb=await p.$$eval(od+' .ord-i.bad',x=>x.length);assert(nb===2,'check marks 2 wrong after one swap');
  if(w===390)await (await p.$('[data-sb="order"]')).screenshot({path:path.join(__dirname,`shots/study/order-${style}-${w}.png`)});
  await p.click(od+' [data-a="show"]');assert((await cur()).join()===correct.join()&&(await p.$$(od+' .ord-i.ok')).length===correct.length,'show correct order');
  if(w===1280){await p.click(od+' [data-a="mix"]');const s1=await cur();await p.dragAndDrop(od+' .ord-i[data-p="0"] .ord-n',od+` .ord-i[data-p="${correct.length-1}"] .ord-n`);const s2=await cur();assert(s2[correct.length-1]===s1[0],'drag moves on desktop')}
  // ---- match
  const mt='[data-sb="match"] .stb-item';
  const pairs=await p.evaluate(()=>PLCBOOK.STUDY.lessons['u1-l2'].match[0].pairs.length);
  for(let i=0;i<pairs;i++){const j=i===0?1:i===1?0:i;await p.click(`${mt} [data-l="${i}"]`);await p.click(`${mt} [data-r="${j}"]`)}
  assert((await p.$$(mt+' .mt-i.on')).length===pairs*2,'all pairs connected');
  await p.click(mt+' [data-a="check"]');assert((await p.$$(mt+' .mt-i.bad')).length===2,'2 wrong pairs marked');
  if(w===390||style==='formal')await (await p.$('[data-sb="match"]')).screenshot({path:path.join(__dirname,`shots/study/match-${style}-${w}.png`)});
  await p.click(`${mt} [data-l="0"]`);await p.click(`${mt} [data-r="0"]`);await p.click(`${mt} [data-l="1"]`);await p.click(`${mt} [data-r="1"]`);await p.click(mt+' [data-a="check"]');
  assert(/كل التوصيلات صحيحة/.test(await p.$eval(mt+' .stb-msg',e=>e.textContent)),'fixed → all correct');
  await p.click(mt+' [data-a="reset"]');assert((await p.$$(mt+' .mt-i.on')).length===0,'reset clears');
  // ---- pre/post
  const pp='[data-sb="prepost"]';
  const quiz=await p.evaluate(()=>PLCBOOK.LESSONS.find(l=>l.id==='u1-l2').quiz.slice(0,5).map(q=>q.c));
  await p.click(pp+' [data-m="pre"]');assert((await p.$$(pp+' .qq')).length===quiz.length,'pre shows '+quiz.length+' questions');
  const qs1=await p.$$eval(pp+' .qq h3',x=>x.map(e=>e.textContent));
  for(let i=0;i<quiz.length;i++)await p.click(`${pp} [data-q="${i}"][data-o="${i<2?quiz[i]:(quiz[i]+1)%4}"]`);
  await p.click(pp+' [data-a="submit"]');assert(!(await p.$(pp+' .opt.right')),'pre does not reveal answers');
  assert(/2 من 5/.test(await p.$eval(pp+' .pp-sum',e=>e.textContent)),'pre score 2/5');await p.click(pp+' [data-a="back"]');
  await p.reload();await p.waitForTimeout(300);await p.click((w>760?'.ltabs':'.bnav')+' button[data-tab="acts"]');await p.waitForTimeout(250);
  assert(/قبل الدرس/.test(await p.$eval(pp+' .pp-res',e=>e.textContent)),'pre score persists');
  await p.click(pp+' [data-m="post"]');const qs2=await p.$$eval(pp+' .qq h3',x=>x.map(e=>e.textContent));assert(qs1.join()===qs2.join(),'post uses same questions');
  for(let i=0;i<quiz.length;i++)await p.click(`${pp} [data-q="${i}"][data-o="${i<4?quiz[i]:(quiz[i]+1)%4}"]`);
  await p.click(pp+' [data-a="submit"]');assert(await p.$(pp+' .opt.right'),'post reveals answers');
  await p.click(pp+' [data-a="back"]');const sum=await p.$eval(pp+' .pp-sum',e=>e.textContent);assert(/قبل: 2 من 5 — بعد: 4 من 5/.test(sum),sum);
  if(w===390||style==='formal')await (await p.$(pp)).screenshot({path:path.join(__dirname,`shots/study/prepost-${style}-${w}.png`)});
  assert(!(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth)),'no horizontal overflow');
  await p.screenshot({path:path.join(__dirname,`shots/study/full-${style}-${w}.png`),fullPage:true});
  // errs card on u2-l1
  await p.evaluate(()=>{location.hash='u2-l1'});await p.waitForTimeout(300);await p.click((w>760?'.ltabs':'.bnav')+' button[data-tab="acts"]');await p.waitForTimeout(250);
  const ec=await p.$('[data-act="errs"]');assert(ec,'«اكتشف الخطأ» card on u2-l1');
  const href=await ec.$eval('a',a=>a.getAttribute('href'));assert(/\/host\?course=dc-machines&lesson=u2-l1&type=errs$/.test(href),href);
  console.log('  ',await ec.$eval('.act-ready',e=>e.textContent));
  if(w===1280&&style==='formal')await p.screenshot({path:path.join(__dirname,'shots/study/live-errs.png'),fullPage:false,clip:await (await p.$('.acts-sec')).boundingBox()});
  // dark mode quick shot
  if(style==='stations'&&w===390){await p.evaluate(()=>{document.documentElement.setAttribute('data-theme','dark');location.hash='u1-l2'});await p.waitForTimeout(300);await p.click('.bnav button[data-tab="acts"]');await p.waitForTimeout(250);await p.click(fc+' .fc-card');await p.click(`[data-sb="match"] [data-l="0"]`);await p.click(`[data-sb="match"] [data-r="2"]`);await p.screenshot({path:path.join(__dirname,'shots/study/dark-390.png'),fullPage:true})}
  await ctx.close();}
// ACT_OFF hides blocks
{const ctx=await b.newContext();const p=await ctx.newPage();p.on('pageerror',e=>errs.push(e.message));await p.addInitScript(()=>{Object.defineProperty(window,'ACT_OFF',{get:()=>['cards','order','match','prepost','errs'],set(){} ,configurable:true})});
 await p.goto(URL+'#u2-l1');await p.waitForTimeout(300);await p.click('.ltabs button[data-tab="acts"]');await p.waitForTimeout(200);
 assert((await p.$$('.stb')).length===0&&!(await p.$('[data-act="errs"]'))&&await p.$('.act-soon'),'ACT_OFF hides all study blocks and errs');await ctx.close()}
// a course without study data: only pre/post
{const ctx=await b.newContext();const p=await ctx.newPage();p.on('pageerror',e=>errs.push(e.message));await p.goto('file:///home/claude/lib/courses/circuits-1/index.html');await p.waitForTimeout(300);
 const id=await p.evaluate(()=>PLCBOOK.LESSONS.find(l=>l.quiz&&l.quiz.length).id);await p.evaluate(id=>location.hash=id,id);await p.waitForTimeout(300);await p.click('.ltabs button[data-tab="acts"]');await p.waitForTimeout(200);
 const ks=await p.$$eval('.stb',x=>x.map(e=>e.dataset.sb));assert(ks.join()==='prepost','circuits-1 shows only prepost: '+ks.join());await ctx.close()}
console.log(errs.length?'PAGE ERRORS\n'+errs.join('\n'):'no page errors');await b.close();if(errs.length)process.exit(1)})().catch(e=>{console.error(e.message);process.exit(1)});
