// المنضدة الافتراضية — الدرس 1.2: توصيل كامل وتشغيل وتسجيل الجدولين وإنهاء بلا أخطاء، ثم محاولة بأخطاء
const {chromium}=require('playwright');const path=require('path');
let fails=0;const ok=(c,m)=>{console.log(c?'ok  ':'FAIL',m);if(!c)fails++};
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1280,height:900}});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.join(__dirname,'../lib/courses/dc-machines/index.html#u1-l2'));await p.waitForTimeout(600);
ok(!!await p.$('.ltabs button[data-tab="bench"]'),'تبويب المنضدة');
await p.click('.ltabs button[data-tab="bench"]');await p.waitForTimeout(500);
ok(!!await p.$('.bn-svg .bn-term[data-t="P1+"]'),'المنضدة مرسومة');
if(process.argv.includes('--shot'))await p.screenshot({path:'shots/bench-empty.png',fullPage:false});
const wire=async(a,b2)=>{const A=await p.$(`.bn-term[data-t="${a}"]`),Bb=await p.$(`.bn-term[data-t="${b2}"]`);await A.scrollIntoViewIfNeeded();const ra=await A.boundingBox();const rb=await Bb.boundingBox();
  await p.mouse.move(ra.x+ra.width/2,ra.y+ra.height/2);await p.mouse.down();await p.mouse.move((ra.x+rb.x)/2+20,(ra.y+rb.y)/2,{steps:4});await p.mouse.move(rb.x+rb.width/2,rb.y+rb.height/2,{steps:4});await p.mouse.up()};
await p.click('[data-mode="drag"]');
for(const [a,c] of [['P1+','M.1B1'],['P1-','M.2B2'],['M.1B1','M.E1'],['M.2B2','M.E2'],['P2+','A+'],['A-','G.E1'],['G.E2','P2-'],['V+','G.1B1'],['V-','G.2B2']])await wire(a,c);
ok(await p.$$eval('.bn-wire',w=>w.length)===9,'9 أسلاك بالسحب');
ok(await p.$eval('.bn-steps li:nth-child(1)',e=>e.classList.contains('ok')),'خطوة التوصيل تمت');
const api=()=>p.evaluate(()=>0);
// helper to set knob via keyboard: focus + Home + ArrowUp n times is slow → use evaluate on knob via synthetic drag-free API
const setK=async(id,val)=>{await p.focus(`.bn-knob[data-knob="${id}"]`);await p.keyboard.press('Home');for(let i=0;i<val;i++)await p.keyboard.press('ArrowUp')};
await p.click('.bn-sw[data-sw="S1"]');await p.waitForTimeout(200);
await p.waitForTimeout(600);ok(await p.$eval('.bn-steps li:nth-child(2)',e=>e.classList.contains('ok')),'شُغّل المصدر على الصفر');
// raise V1 gradually
const speed=()=>p.$eval('.bn-meter[data-meter="N"] text',t=>parseFloat(t.textContent));
const amps=()=>p.evaluate(()=>{const t=[...document.querySelectorAll('[data-meter="A"]')][0];return 0});
let v=0;const step=async(n)=>{for(let i=0;i<n;i++){await p.focus('.bn-knob[data-knob="V1"]');await p.keyboard.press('ArrowUp');v++;await p.waitForTimeout(25)}};
const tune=async(target)=>{for(let k=0;k<200;k++){await p.waitForTimeout(150);const n=await speed();if(Math.abs(n-target)<=6)return n;await p.focus('.bn-knob[data-knob="V1"]');await p.keyboard.press(n<target?'ArrowUp':'ArrowDown')}return speed()};
await step(60);await p.waitForTimeout(2500);let n=await tune(1000);await p.waitForTimeout(2500);n=await tune(1000);
ok(Math.abs(n-1000)<=10,'السرعة 1000 rpm ('+n+')');
// table 1: If values
await p.click('.bn-sw[data-sw="S2"]');
const ifr=async()=>p.evaluate(()=>window.__benchIf);
// set range ammeter 0.5 A and voltmeter 300 V
await p.click('.bn-rng[data-rng="A"][data-i="0"]');await p.click('.bn-rng[data-rng="V"][data-i="1"]');
const rec=async()=>{await p.click('[data-rec]');return p.textContent('[data-recmsg]')};
const tuneIf=async(target)=>{// V2 ≈ If*Rsh (650) → steps of 1 V = 1.5 mA
 const want=Math.round(target*650);await p.focus('.bn-knob[data-knob="V2"]');await p.keyboard.press('Home');for(let i=0;i<want;i++)await p.keyboard.press('ArrowUp');await p.waitForTimeout(300)};
for(const If of [0,0.1,0.15,0.2,0.25,0.3]){await tuneIf(If);n=await tune(1000);await p.waitForTimeout(1500);n=await tune(1000);const m=await rec();if(!/سجّلت/.test(m))console.log('   rec:',If,n,m)}
ok(await p.$eval('.bn-steps li:nth-child(4)',e=>e.classList.contains('ok')),'جدول (1-1) كامل');
await p.click('.bn-rng[data-rng="V"][data-i="2"]');
for(const N of [300,600,900,1200,1600]){n=await tune(N);await p.waitForTimeout(2500);n=await tune(N);const m=await rec();if(!/سجّلت/.test(m))console.log('   rec:',N,n,m)}
ok(await p.$eval('.bn-steps li:nth-child(5)',e=>e.classList.contains('ok')),'جدول (1-2) كامل');
// shutdown
await p.focus('.bn-knob[data-knob="V2"]');await p.keyboard.press('Home');await p.click('.bn-sw[data-sw="S2"]');
await p.focus('.bn-knob[data-knob="V1"]');await p.keyboard.press('Home');await p.waitForTimeout(4000);await p.click('.bn-sw[data-sw="S1"]');await p.waitForTimeout(800);
await p.waitForTimeout(800);const mc=await p.textContent('[data-mcount]');ok(mc==='0','بلا أخطاء ('+mc+') '+(mc!=='0'?await p.textContent('[data-mlist]'):''));
await p.waitForSelector('.bn-result:not([hidden])',{timeout:15000}).catch(()=>{});await p.fill('[data-name]','محمد أحمد');await p.waitForTimeout(300);
{const h=await p.$eval('.bn-result',e=>e.hidden),tx=await p.textContent('.bn-result');ok(!h&&/جاهز للمعمل/.test(tx),'«جاهز للمعمل» '+h+' '+tx.slice(0,40))}
const code=await p.textContent('[data-rc]');ok(/^[A-Z2-9]{6}$/.test(code),'الرمز '+code);
if(process.argv.includes('--shot'))await p.screenshot({path:'shots/bench-done.png',fullPage:true});
// verify form
await p.click('.bn-verify summary');await p.fill('.bn-vf input[name=n]','محمد احمد');await p.fill('.bn-vf input[name=c]',code);await p.click('.bn-vf button');ok(/صحيح/.test(await p.textContent('.bn-vr')),'تحقق المدرب يقبل الرمز (مع اختلاف الهمزة)');
await p.fill('.bn-vf input[name=n]','خالد');await p.click('.bn-vf button');ok(/لا يطابق/.test(await p.textContent('.bn-vr')),'ويرفض اسماً آخر');
// mistakes attempt
await p.click('[data-reset]');await p.waitForTimeout(300);
ok(await p.$$eval('.bn-wire',w=>w.length)===0,'ابدأ من جديد يفك الأسلاك');
// ammeter across PSU2 -> fuse
await wire('A+','P2+');await wire('A-','P2-');await p.click('.bn-sw[data-sw="S2"]');await p.focus('.bn-knob[data-knob="V2"]');for(let i=0;i<20;i++)await p.keyboard.press('ArrowUp');await p.waitForTimeout(600);
let ml=await p.textContent('[data-mlist]');ok(/الأميتر/.test(ml),'أميتر على التوازي يُكشف: '+ml.slice(0,60));
ok(!await p.$eval('.bn-sw[data-sw="S2"]',e=>e.getAttribute('aria-checked')==='true'),'وفصلت الحماية المصدر');
// motor armature without field
await p.click('[data-reset]');await wire('P1+','M.1B1');await wire('P1-','M.2B2');await p.click('.bn-sw[data-sw="S1"]');await p.focus('.bn-knob[data-knob="V1"]');for(let i=0;i<30;i++)await p.keyboard.press('ArrowUp');await p.waitForTimeout(800);
ml=await p.textContent('[data-mlist]');ok(/مجاله/.test(ml),'محرك بلا مجال يُكشف');
// start not zero
await p.click('[data-reset]');await p.focus('.bn-knob[data-knob="V1"]');for(let i=0;i<30;i++)await p.keyboard.press('ArrowUp');await p.click('.bn-sw[data-sw="S1"]');await p.waitForTimeout(200);
ml=await p.textContent('[data-mlist]');ok(/الصفر/.test(ml),'تشغيل على غير الصفر يُكشف');
// live wiring
await wire('P1+','M.1B1');await p.waitForTimeout(200);ml=await p.textContent('[data-mlist]');ok(/التوصيل والمصدر يعمل/.test(ml),'توصيل والمصدر يعمل يُكشف');
// reload keeps mistakes
await p.reload();await p.waitForTimeout(600);await p.click('.ltabs button[data-tab="bench"]');await p.waitForTimeout(400);ok(+await p.textContent('[data-mcount]')>=2,'التحديث لا يمسح الأخطاء');
await p.click('.bn-history summary');ok(/محاولة/.test(await p.textContent('[data-hist]')),'تقرير المحاولات');
// mobile tap mode
const m=await b.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});const q=await m.newPage();q.on('pageerror',e=>errs.push(e.message));
await q.goto('file://'+path.join(__dirname,'../lib/courses/dc-machines/index.html#u1-l2'));await q.waitForTimeout(600);await q.click('.bnav button[data-tab="bench"]');await q.waitForTimeout(500);
ok(await q.$eval('[data-mode="tap"]',e=>e.getAttribute('aria-pressed')==='true'),'الجوال يبدأ باللمس');
const tap=async(t)=>{const e=await q.$(`.bn-term[data-t="${t}"]`);await e.scrollIntoViewIfNeeded();await e.tap()};
await tap('P1+');await tap('M.1B1');ok(await q.$$eval('.bn-wire',w=>w.length)===1,'سلك باللمس');
await q.click('[data-mode="drag"]');ok(await q.$eval('[data-mode="drag"]',e=>e.getAttribute('aria-pressed')==='true'),'زر التبديل للسحب');
if(process.argv.includes('--shot'))await q.screenshot({path:'shots/bench-mobile.png'});
ok(!errs.length,'لا أخطاء صفحة '+errs.join(' | '));
await b.close();console.log(fails?fails+' FAIL':'ALL OK');process.exit(fails?1:0)})();
