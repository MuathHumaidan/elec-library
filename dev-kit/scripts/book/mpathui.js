// واجهة «مسار الطريقة» (shared/methods.js) مع خادم وهمي — usage: node mpathui.js [--shots]
const {chromium}=require('playwright');const path=require('path');const fs=require('fs');
const LIB=path.join(__dirname,'../lib'),SH=path.join(__dirname,'shots','mpath');const shots=process.argv.includes('--shots');if(shots)fs.mkdirSync(SH,{recursive:true});
let fails=0;const ok=(c,m)=>{console.log(c?'ok  ':'FAIL',m);if(!c)fails++};
(async()=>{const b=await chromium.launch();const calls=[];
async function mk(o={}){const ctx=await b.newContext({viewport:o.vp||{width:1280,height:900},colorScheme:o.dark?'dark':'light'});
  if(o.init)await ctx.addInitScript(o.init);
  await ctx.route('**/api/**',async r=>{const q=r.request(),u=new URL(q.url());calls.push(u.pathname);const H={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Authorization, Content-Type','Content-Type':'application/json'};
    if(q.method()==='OPTIONS')return r.fulfill({status:204,headers:H});
    if(u.pathname==='/api/login'){const d=JSON.parse(q.postData()||'{}');return d.password==='123456'?r.fulfill({status:200,headers:H,body:JSON.stringify({ok:true,token:'T1',user:{name:'أ. محمد'}})}):r.fulfill({status:401,headers:H,body:'{"error":"خطأ في كلمة المرور."}'})}
    if(u.pathname==='/api/me')return r.fulfill({status:200,headers:H,body:JSON.stringify({user:(q.headers().authorization==='Bearer T1')?{name:'أ. محمد'}:null})});
    r.fulfill({status:200,headers:H,body:'{"ok":true}'})});
  const p=await ctx.newPage();p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));return p}
const U=(c,h)=>'file://'+path.join(LIB,'courses/'+c+'/index.html#'+h);
const shot=async(p,n)=>{if(shots)await p.screenshot({path:path.join(SH,n+'.png')})};
const signed=()=>localStorage.setItem('elib-trainer',JSON.stringify({token:'T1',name:'أ. محمد'}));
/* 1. بدون دخول: لا شريط */
{const p=await mk();await p.goto(U('dc-machines','u1-l2'));await p.waitForTimeout(500);ok(!await p.$('.mpath'),'بدون دخول: لا شريط');ok(!!await p.$('#trBtn'),'زر دخول المدرب موجود');
 await p.click('.ltabs button[data-tab="acts"]');await p.waitForTimeout(200);ok(!!await p.$('.act-card[data-act="kwl"]'),'بطاقة K.W.L في الأنشطة');
 /* الدخول */
 await p.click('#trBtn');await p.fill('#trDlg input[name=u]','t');await p.fill('#trDlg input[name=p]','123456');await p.click('#trDlg [type=submit]');await p.waitForSelector('.mpath');ok(true,'بعد الدخول يظهر الشريط');
 ok((await p.textContent('.mpath')).includes('موصى بها'),'الشريط يعرض «موصى بها»');await shot(p,'01-bar-nomethod');
 await p.click('[data-pick]');await p.waitForSelector('.msheet');await p.waitForTimeout(400);const t=await p.textContent('.msheet');
 ok(t.includes('موصى بها')&&t.includes('مناسبة أيضاً')&&t.includes('مرحلة ثانية')&&t.includes('قريباً'),'لوحة الاختيار: المجموعات');await shot(p,'02-pick');
 await p.click('.msheet button[data-m="imitate"]');await p.waitForTimeout(600);
 ok((await p.textContent('.mpath')).includes('الخطوة 1 من 7'),'اختيار التقليد: الخطوة 1 من 7');
 ok(await p.$eval('.act-card[data-act="cloud"]',e=>e.classList.contains('mgo-hl')),'الخطوة 1 تميّز بطاقة السؤال المفتوح');await shot(p,'03-step1');
 await p.click('[data-next]');await p.waitForTimeout(400);ok((await p.textContent('.mpath')).includes('الخطوة 2 من 7'),'التالي: الخطوة 2');
 await p.click('[data-next]');await p.waitForTimeout(800);ok(await p.evaluate(()=>document.documentElement.getAttribute('data-style')==='stations'&&document.body.dataset.tab==='theory'),'الخطوة 3: الشرح التفاعلي');
 ok(await p.evaluate(()=>{const h=document.querySelector('.mgo-hl');return !!h&&/أهداف/.test(h.textContent)}),'الخطوة 3 تميّز محطة الأهداف');await shot(p,'04-step3');
 await p.click('[data-next]');await p.waitForTimeout(500);ok(await p.evaluate(()=>document.body.dataset.tab==='lab'),'الخطوة 4: المختبر');
 const top=await p.evaluate(()=>{const h=document.querySelector('.mgo-hl'),bar=document.querySelector('.mpath');return h&&bar?h.getBoundingClientRect().top>=bar.getBoundingClientRect().bottom-2:false});ok(top,'الجزء المميّز لا يختفي تحت الشريط');await shot(p,'05-step4-lab');
 await p.click('[data-list]');await p.waitForSelector('.mlistsh');await p.waitForTimeout(400);ok((await p.$$('.mlist li')).length===7,'قائمة الخطوات: 7');ok(await p.$eval('.mlist li.on',e=>e.dataset.i)==='3','الخطوة الحالية مميزة في القائمة');await shot(p,'06-list-desktop');
 await p.click('.mlist li[data-i="6"] button[data-go]');await p.waitForTimeout(500);ok((await p.textContent('.mpath')).includes('الخطوة 7 من 7'),'«اذهب» من القائمة');ok(await p.$eval('[data-next]',e=>e.disabled),'التالي معطّل في آخر خطوة');
 /* إعادة التحميل تحفظ الخطوة */
 await p.reload();await p.waitForTimeout(700);ok((await p.textContent('.mpath')).includes('الخطوة 7 من 7'),'بعد التحديث تبقى الخطوة');
 /* إخفاء */
 await p.click('[data-hide]');await p.waitForTimeout(200);ok(await p.$eval('.mpath',e=>e.hidden)&&!!await p.$('#mShow'),'إخفاء الشريط وزر الإظهار');await shot(p,'07-hidden');
 await p.click('#mShow');await p.waitForTimeout(200);ok(!await p.$eval('.mpath',e=>e.hidden),'إظهار الشريط');
 /* الخطة */
 await p.evaluate(()=>{window.print=()=>{window.__pr=1}});await p.click('[data-plan]');await p.waitForSelector('.mplan');
 const plan=await p.textContent('.mplan');ok(/14\. كيف سأنتقل/.test(plan),'الخطة: الأسئلة الـ14');
 const filled=await p.$$eval('.mp-qa td',t=>t.map((x,i)=>x.classList.contains('blank')?0:i+1).filter(Boolean));ok(JSON.stringify(filled)==='[3,6,7,9]','المعبّأ من الدرس: 3 و6 و7 و9 فقط → '+JSON.stringify(filled));
 ok(await p.$$eval('.mp-steps tbody td.mp-time',t=>t.every(x=>!x.textContent.trim())),'خانة الزمن فارغة');
 await p.click('[data-print]');ok(await p.evaluate(()=>window.__pr===1),'الطباعة');await p.emulateMedia({media:'print'});if(shots)await p.pdf({path:path.join(SH,'plan.pdf'),format:'A4'});await p.emulateMedia({media:'screen'});
 await p.click('.mplan-bar [data-close]');
 /* «لا تناسب» في u1-l1 */
 await p.goto(U('dc-machines','u1-l1'));await p.waitForTimeout(600);await p.click('[data-pick]');await p.waitForSelector('.msheet');
 ok(await p.$eval('.msheet',e=>e.textContent.includes('لا تناسب هذا الدرس')&&!e.querySelector('button[data-m="problem"]')),'u1-l1: حل المشكلات باهتة بلا زر');await shot(p,'08-pick-u1l1');
 await p.click('.msheet [data-close].mpath-ic');
 /* خروج */
 await p.click('[data-pick]');await p.click('.msheet [data-trout]');await p.waitForTimeout(300);ok(!await p.$('.mpath'),'الخروج يزيل الشريط');ok(calls.includes('/api/logout'),'الخروج يرسل logout');
 ok(!p.errs.length,'لا أخطاء: '+p.errs.join(' | '))}
/* 2. مقرر بلا ملف بيانات: لا زر ولا شريط حتى مع رمز */
{const p=await mk({init:signed});await p.goto(U('plc','u1-l1'));await p.waitForTimeout(500);ok(!await p.$('#trBtn')&&!await p.$('.mpath'),'مقرر بلا ملف بيانات: لا شيء');
 await p.click('.ltabs button[data-tab="acts"]').catch(()=>{});await p.waitForTimeout(200);ok(!await p.$('.act-card[data-act="kwl"]'),'لا بطاقة K.W.L في مقرر بلا ملف بيانات')}
/* 3. الجوال */
{const p=await mk({init:signed,vp:{width:390,height:844}});await p.goto(U('dc-machines','u2-l1'));await p.waitForTimeout(600);
 await p.click('[data-pick]');await p.waitForSelector('.msheet');await p.waitForTimeout(400);await shot(p,'09-m-pick');
 await p.click('.msheet button[data-m="problem"]');await p.waitForTimeout(600);
 const w=await p.evaluate(()=>{const b=document.querySelector('.mpath');return b.scrollWidth<=b.clientWidth+1&&b.offsetHeight<70});ok(w,'الجوال: الشريط سطر واحد بلا تمرير أفقي');await shot(p,'10-m-step1');
 await p.click('[data-next]');await p.waitForTimeout(800);await shot(p,'11-m-step2');
 await p.click('[data-list]');await p.waitForSelector('.mlistsh');await p.waitForTimeout(400);const sb=await p.$eval('.msheet-p',e=>{const r=e.getBoundingClientRect();return r.bottom>=window.innerHeight-1&&r.top>100});ok(sb,'الجوال: القائمة من الأسفل');await shot(p,'12-m-list');
 ok(!p.errs.length,'جوال بلا أخطاء: '+p.errs.join(' | '))}
/* 4. داكن + خط 125% */
{const p=await mk({init:()=>{localStorage.setItem('elib-trainer',JSON.stringify({token:'T1',name:'أ. محمد'}));document.documentElement.style.fontSize='125%'},dark:true});await p.goto(U('dc-machines','u3-l3'));await p.waitForTimeout(600);
 await p.click('[data-pick]');await p.click('.msheet button[data-m="discover"][data-lv="guided"]');await p.waitForTimeout(800);await shot(p,'13-dark');ok((await p.textContent('.mpath')).includes('الاكتشاف'),'الاكتشاف الموجّه')}
await b.close();console.log(fails?fails+' FAIL':'ALL OK');process.exit(fails?1:0)})();
