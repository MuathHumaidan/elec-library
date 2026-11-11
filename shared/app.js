/* =====================================================================
   PLC Book — app shell: home index, lesson pages, lab runtime
   Lessons register with PLCBOOK.lesson({...}) (see API.md)
   ===================================================================== */
(function(G){
"use strict";
const B=G.PLCBOOK; const {createPLC,ctrlCircuit,ladNetwork,fbdNetwork,stlTable,W,esc,fmtTime}=B;
const $=(s,r)=>(r||document).querySelector(s), $$=(s,r)=>[...(r||document).querySelectorAll(s)];
const AR=['','الأولى','الثانية','الثالثة','الرابعة','الخامسة','السادسة','السابعة','الثامنة','التاسعة','العاشرة'];

B.UNITS=[];  // {n,title,pages,blurb}
B.COURSE={key:'plcbook',code:'205 كهر',title:'تقنية التحكم المبرمج',sub:'(عملي)',eyebrow:'205 كهر · القوى الكهربائية — الآلات والمعدات الكهربائية',lead:'',source:''};
B.course=c=>{Object.assign(B.COURSE,c)};
const KK=n=>B.COURSE.key+'-'+n;
B.unit=u=>{B.UNITS.push(u)};
B.lesson=L=>{B.LESSONS.push(L)};
/* محتوى «الأنشطة التفاعلية» الجاهز لكل درس (ملف courses/<id>/activities.js، اختياري):
   PLCBOOK.acts({'u1-l1':{open:['سؤال مفتوح',…], exit:[{q,o:[4 خيارات],c,e},…]}, …})
   يُدمج حسب رقم الدرس؛ المقرر الذي ليس له ملف لا يكون فيه محتوى جاهز. */
B.ACTS={};
/* self-study data (study.js) and «اكتشف الخطأ» variants (errors.js) per course */
B.STUDY={units:{},lessons:{}};B.study=o=>{o=o||{};Object.assign(B.STUDY.units,o.units||{});Object.assign(B.STUDY.lessons,o.lessons||{})};
B.ERRS={};B.errs=o=>{Object.assign(B.ERRS,o||{})};
/* «اكتشف العطل» و«تحدي المحاكاة» (courses/<id>/challenge.js، اختياري): لكل درس فيه مختبر
   PLCBOOK.chal({'u2-l1':{outputs:[{k,label,unit,dp,m:'#meters|label'}],inputs:[{k,label,kind:'range'|'switch'|'pick',sel,ctl,...}],
     faults:[{id,t,sym,how,p:{key:['*',x]|['=',x]},x:'hook flags',io:{'I0.1':0|1|'inv','Q4.1':0|1}}],ref:[{id,keys}],hide:[css],hideFault:[css],hideSim:[css],
     refTitle:'عنوان لوحة المقارنة', variant:'نسخة البرنامج لمختبرات منضدة البرنامج', variants:true}}, {refTitle:'للمقرر كله'})
   القراءة: m:'حاوية|اسم' أو m:{box,label,exact} أو sel:'css' أو read:(B,root)=>قيمة؛ unit للتحويل من البادئات (انظر chRead / chParse أدناه).
   io: أعطال عامة لمختبرات «منضدة البرنامج» (انظر chIOmap). المختبرات المخصصة (L.lab) و«منضدة البرنامج» (L.program / L.plant) كلاهما يعمل في وضع التحدي.
   تعمل الأعطال فقط في «وضع التحدي» (الصفحة تُفتح من خادم النشاط بـ ?ch=1)؛ خارجها B.chF() دائماً false فلا يتغير المختبر. */
B.CHAL={};B.CHALCFG={};B.chal=(o,cfg)=>{Object.assign(B.CHAL,o||{});if(cfg&&typeof cfg==='object')Object.assign(B.CHALCFG,cfg)};
const CH={on:false,mode:'',fault:null,defs:{},mv:null,healthy:{}};
/* قيم الآلة للنشاط (يرسلها خادم النشاط في رسالة init: mv = {معرف B.params: {k: رقم}}، القيم التي غيّرها المدرب فقط) — لكل الجوالات نفسها، ولا تُحفظ على الجهاز */
const chMV=mv=>{const o={};if(mv&&typeof mv==='object')Object.keys(mv).forEach(id=>{const g=mv[id];if(!g||typeof g!=='object')return;const x={};Object.keys(g).forEach(k=>{const v=+g[k];if(g[k]!==null&&g[k]!==''&&isFinite(v))x[k]=v});if(Object.keys(x).length)o[id]=x});return Object.keys(o).length?o:null};
B.chOn=()=>CH.on;
/* أعطال عامة لمختبرات «منضدة البرنامج» (المداخل في لوحة التشغيل + البرنامج الحي)، بلا كود في الدرس:
   fault.io = {'I0.1':0 | 1 | 'inv', 'Q4.1':0 | 1}
     مدخل: 0 = عالق على 0 (سلك أو حساس مقطوع)، 1 = عالق على 1 (قصر / حساس عالق)، 'inv' = موصّل N.O. بدل N.C. أو العكس (الإشارة معكوسة)
     مخرج: 0 = الحمل لا يعمل (ملف المتمم أو اللمبة مقطوع: الـ CPU تكتب 1 والمشغّل لا يعمل)، 1 = يعمل دائماً (تلامس المتمم ملتحم)
   الـ PLC (البرنامج وجدول المداخل والمخارج) يرى ما يصل إلى مداخله وما يكتبه في مخارجه؛ الجهاز والدائرة الرئيسة ولمبات لوحة التشغيل ترى حالة المشغّل الفعلية. */
const chIOmap=pre=>{const f=CH.on&&CH.fault&&CH.fault.io;if(!f||typeof f!=='object')return null;const o={};let n=0;
  Object.keys(f).forEach(k=>{const a=String(k).replace(/\s+/g,'').toUpperCase();if(a[0]!==pre)return;const v=f[k];o[a]=v==='inv'?'inv':v?1:0;n++});return n?o:null};
const chInIO=()=>chIOmap('I'),chOutIO=()=>chIOmap('Q');
B.chF=f=>!!(CH.on&&CH.fault&&String(CH.fault.x||'').split(/\s+/).includes(f));
B.acts=o=>{Object.keys(o||{}).forEach(id=>{const v=o[id]||{},cur=B.ACTS[id]||(B.ACTS[id]={});['open','exit'].forEach(k=>{if(Array.isArray(v[k]))cur[k]=(cur[k]||[]).concat(v[k])})})};

/* ---------------- motor plant helper ----------------
   B.motorPlant(fn) : fn(st) -> {target: rpm signed, tau, I: (n)=>current} | null (no supply) */
B.motorPlant=function(fn,o){o=o||{};
  return {
    init:()=>({n:0,I:0,ang:0,mode:'off',label:'متوقف'}),
    step(dt,st,p){const m=fn(st)||{target:0,tau:o.coast||2.4,I:()=>0,label:'متوقف',mode:'off'};
      p.n+=(m.target-p.n)*(1-Math.exp(-dt/(m.tau||1)));if(Math.abs(p.n)<0.5&&!m.target)p.n=0;
      const Ii=m.I?m.I(p.n):0;p.I+=(Ii-p.I)*(1-Math.exp(-dt/0.05));p.ang=(p.ang+p.n/60*360*dt*0.12)%360;p.mode=m.mode||'off';p.label=m.label||'';},
    view:'motor',
    readouts:[{l:'التوصيل',chip:p=>[p.label||'متوقف',p.mode]},{l:'السرعة',v:p=>Math.round(Math.abs(p.n))+' rpm'+(p.n<-1?' ⟲':p.n>1?' ⟳':'')},{l:'تيار الخط',v:p=>p.I.toFixed(1)+' A'}],
    chart:o.chart===false?null:{key:'I',ymax:o.ymax||65,ticks:o.ticks||[0,20,40,60],unit:'A',refs:o.refs||[{v:10,color:'--muted'}],label:'تيار الخط مع الزمن'},
    nameplate:o.nameplate||'3~ MOTOR 5.5 kW<br>380 v Δ · 10 A<br>1450 rpm · 50 Hz'
  };
};

/* ---------------- HOME ---------------- */
const store={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
B.store=store;
const RUNG=`<svg viewBox="0 0 360 120" role="img" aria-label="سلّم برمجي بسيط يعمل">
 <style>.rr{stroke:#5f8f78;stroke-width:3;fill:none;stroke-linecap:round}.rl{stroke:#f3a33f;stroke-width:3.4;fill:none;stroke-linecap:round;stroke-dasharray:8 7;animation:rf .6s linear infinite}
 .rt{fill:#d3ecdf;font:600 12px "IBM Plex Mono",monospace}.on1{animation:blink 4s steps(1) infinite}.off1{animation:blink2 4s steps(1) infinite}
 @keyframes rf{to{stroke-dashoffset:-15}}@keyframes blink{0%,45%{opacity:0}50%,100%{opacity:1}}@keyframes blink2{0%,45%{opacity:1}50%,100%{opacity:0}}
 @media (prefers-reduced-motion:reduce){.rl{animation:none}.on1{animation:none;opacity:1}.off1{animation:none;opacity:0}}</style>
 <path class="rr" d="M14 12V108M346 12V108"/><path class="rl" d="M14 12V108" style="animation:none;stroke-dasharray:none"/>
 <text class="rt" x="78" y="30" text-anchor="middle">I0.1</text><text class="rt" x="178" y="30" text-anchor="middle">I0.0</text><text class="rt" x="290" y="30" text-anchor="middle">Q4.1</text>
 <g class="off1"><path class="rr" d="M14 52H70M86 52H340"/><path class="rr" d="M70 40V64M86 40V64"/><path class="rr" d="M170 40V64M186 40V64M166 64L190 40"/><path class="rr" d="M282 40q-9 12 0 24M298 40q9 12 0 24"/></g>
 <g class="on1"><path class="rl" d="M14 52H70M86 52H170M186 52H280M300 52H340"/><rect x="70" y="40" width="16" height="24" fill="#3cc486" opacity=".35"/><path class="rr" d="M70 40V64M86 40V64" style="stroke:#f3a33f"/>
  <rect x="170" y="40" width="16" height="24" fill="#3cc486" opacity=".35"/><path class="rr" d="M170 40V64M186 40V64M166 64L190 40" style="stroke:#f3a33f"/><path class="rr" d="M282 40q-9 12 0 24M298 40q9 12 0 24" style="stroke:#3cc486"/><circle cx="290" cy="52" r="6" fill="#3cc486"/></g>
 <text class="rt" x="78" y="86" text-anchor="middle" style="fill:#93bba6">S1</text><text class="rt" x="178" y="86" text-anchor="middle" style="fill:#93bba6">S0</text><text class="rt" x="290" y="86" text-anchor="middle" style="fill:#93bba6">K1</text>
</svg>`;
function renderHome(){
  const root=$('#view');const C=B.COURSE;document.title=C.title+' — الكتاب التفاعلي';
  const seen=store.get(KK('seen'),{}),last=store.get(KK('last'),null);
  const lastL=last&&B.LESSONS.find(l=>l.id===last);const first=B.LESSONS.slice().sort((a,b)=>a.unit-b.unit||a.order-b.order)[0];
  const done=store.get(KK('done'),{});const nSeen=B.LESSONS.filter(l=>done[l.id]).length;
  const pct=Math.round(nSeen/B.LESSONS.length*100);
  let h=`<section class="cover">
   <div class="cover-txt"><div class="eyebrow">${C.eyebrow}</div>
   <h1>${C.title} ${C.sub?`<span>${C.sub}</span>`:''}</h1>
   <p class="lead">${C.lead||'الكتاب كاملاً: شرح مطابق للمذكرة بأرقام صفحاتها وأشكالها، ومحاكاة حية لكل درس.'}</p>
   <div class="hero-actions">${lastL?`<a class="cta pri" href="#${lastL.id}">تابع من حيث توقفت</a><span class="cta-note">${lastL.unit}.${lastL.order} ${lastL.title}</span>`:(first?`<a class="cta pri" href="#${first.id}">ابدأ الدرس الأول</a>`:'<span class="cta-note">الدروس قيد الإعداد.</span>')}</div></div>
   <div class="cover-meta"><div class="meta-num"><b>${B.UNITS.length}</b><span>وحدات</span></div><div class="meta-num"><b>${B.LESSONS.length}</b><span>درساً</span></div><div class="meta-num"><b>${pct}%</b><span>أنجزت</span></div>
   <div class="meta-bar"><i style="width:${pct}%"></i></div></div></section>
   <div class="search"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" stroke-width="2" fill="none"/><path d="M15.5 15.5L21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
   <input id="q" type="search" placeholder="${C.hint||'ابحث عن درس…'}" aria-label="ابحث عن درس"></div>`;
  h+=`<div class="toc" id="units">`;
  B.UNITS.sort((a,b)=>a.n-b.n).forEach(u=>{
    const ls=B.LESSONS.filter(l=>l.unit===u.n).sort((a,b)=>a.order-b.order);const sn=ls.filter(l=>done[l.id]).length;
    const open=false;
    h+=`<details class="unit" id="unit-${u.n}" ${open?'open':''}><summary><span class="un">${String(u.n).padStart(2,'0')}</span><span class="ut"><b>${u.title}</b><small>${ls.length} دروس · ص ${u.pages}</small></span><span class="up"><span class="uprog"><i style="width:${ls.length?Math.round(sn/ls.length*100):0}%"></i></span><small>${sn}/${ls.length}</small></span><span class="chev" aria-hidden="true"></span></summary>
     ${u.blurb?`<p class="ublurb">${u.blurb}</p>`:''}<ol class="lessons">${ls.map(l=>`<li data-s="${esc((l.title+' '+(l.summary||'')).toLowerCase())}"><a href="#${l.id}" class="${done[l.id]?'done':seen[l.id]?'seen':''}"><span class="vk" title="${done[l.id]?'أنجزته':seen[l.id]?'فتحته':''}"></span><span class="ln">${u.n}.${l.order}</span><span class="lt">${l.title}</span><span class="lp">ص ${l.pages}</span></a></li>`).join('')}</ol></details>`;
  });
  h+=`</div><p class="nores" id="nores" hidden>لا يوجد درس بهذا الاسم.</p><p class="src">${C.source||('المصدر: الحقيبة التدريبية «'+C.title+'»، المؤسسة العامة للتدريب التقني والمهني. أرقام الصفحات هي المطبوعة في الكتاب.')}</p>`;
  root.innerHTML=h;window.scrollTo(0,0);
  $('#q').addEventListener('input',e=>{const q=e.target.value.trim().toLowerCase();let any=0;
    $$('.unit',root).forEach(u=>{let k=0;$$('li',u).forEach(li=>{const m=!q||li.dataset.s.includes(q)||u.querySelector('.ut b').textContent.toLowerCase().includes(q);li.hidden=!m;if(m)k++});u.hidden=!k;if(q&&k)u.open=true;any+=k});
    $('#nores').hidden=!!any});
}

/* ---------------- LESSON ---------------- */
let RUN=null; // active lab runtime
function stopRun(){if(RUN){RUN.stop();RUN=null}}

function renderLesson(L,tab){
  {const sn=store.get(KK('seen'),{});sn[L.id]=1;store.set(KK('seen'),sn);store.set(KK('last'),L.id)}
  const root=$('#view');document.title=L.title+' — '+B.COURSE.title;
  const u=B.UNITS.find(x=>x.n===L.unit)||{title:''};
  const all=B.LESSONS.slice().sort((a,b)=>a.unit-b.unit||a.order-b.order);const i=all.indexOf(L);
  const prev=all[i-1],next=all[i+1];
  const hasLab=!!(L.program||L.lab||L.plant);const hasProg=!!(L.program||L.variants);
  const tabs=[['theory','الشرح'],hasLab&&['lab','المختبر'],hasProg&&['plc','برنامج الـ PLC'],L.examples&&L.examples.length&&['examples','الأمثلة المحلولة'],L.quiz&&L.quiz.length&&['quiz','اختبر نفسك'],['acts','الأنشطة التفاعلية']].filter(Boolean);
  tab=tabs.find(t=>t[0]===tab)?tab:'theory';
  const seen=store.get(KK('seen'),{});const done=store.get(KK('done'),{});
  const ul=all.filter(x=>x.unit===L.unit);
  const ICON={theory:'<path d="M4 5h7a3 3 0 0 1 3 3v11a2 2 0 0 0-2-2H4zM20 5h-4" />',lab:'<path d="M9 3v6l-5 9a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-5-9V3M8 3h8"/>',plc:'<path d="M4 4v16M20 4v16M4 12h4M16 12h4M9 8v8M12 8v8"/>',examples:'<path d="M5 3h14v18H5zM8 7h8M8 11h3M13 11h3M8 15h3M13 15h3"/>',quiz:'<path d="M9 9a3 3 0 1 1 4 2.8c-.6.3-1 .9-1 1.5V14M12 18h.01"/><circle cx="12" cy="12" r="9"/>',acts:'<path d="M4 5h16v11H9l-5 4z"/><path d="M9 10.5h.01M12 10.5h.01M15 10.5h.01"/>'};
  root.innerHTML=`<div class="lesson-layout">
   <aside class="lside" aria-label="دروس الوحدة"><a class="lside-back" href="#home">‹ فهرس المقرر</a>
    <div class="lside-unit"><span class="unum sm">${L.unit}</span><div><small>الوحدة ${AR[L.unit]}</small><b>${u.title}</b></div></div>
    <ol>${ul.map(x=>`<li><a href="#${x.id}" class="${x===L?'on':''} ${done[x.id]?'done':seen[x.id]?'seen':''}"><span class="k">${x.unit}.${x.order}</span><span>${x.title}</span></a></li>`).join('')}</ol>
    <details class="lside-more"><summary>الوحدات الأخرى</summary><ul>${B.UNITS.filter(x=>x.n!==L.unit).map(x=>{const f=all.find(y=>y.unit===x.n);return f?`<li><a href="#${f.id}"><span class="k">${x.n}</span>${x.title}</a></li>`:''}).join('')}</ul></details>
   </aside>
   <div class="lmain">
   <div class="crumbs"><a href="#home">الفهرس</a> › <a href="#home" data-unit="${L.unit}">الوحدة ${AR[L.unit]}</a></div>
   <header class="lesson-head"><div class="eyebrow">الدرس ${L.unit}.${L.order} · ص ${L.pages}</div><h1>${L.title}</h1>${L.summary?`<p class="lead">${B.ltrU(L.summary)}</p>`:''}</header>
   <nav class="ltabs" role="tablist">${tabs.map((t,k)=>`<button role="tab" data-tab="${t[0]}" aria-selected="${t[0]===tab}">${t[1]}</button>`).join('')}</nav>
   <div id="strip-host"></div>
   <div id="tab-body"></div>
   <div class="finish"><button class="fin-btn" id="finBtn" aria-pressed="${done[L.id]?'true':'false'}"></button><p class="sub" id="finNote"></p></div>
   <nav class="pager">${prev?`<a href="#${prev.id}" class="pg prev"><small>السابق</small>${prev.title}</a>`:'<span></span>'}${next?`<a href="#${next.id}" class="pg next"><small>التالي</small>${next.title}</a>`:'<span></span>'}</nav>
   </div></div>
   <nav class="bnav" role="tablist">${tabs.map(t=>`<button role="tab" data-tab="${t[0]}" aria-selected="${t[0]===tab}"><svg viewBox="0 0 24 24" aria-hidden="true">${ICON[t[0]]}</svg>${t[0]==='plc'?'البرنامج':t[0]==='quiz'?'اختبر':t[0]==='acts'?'الأنشطة':t[0]==='examples'?'الأمثلة':t[1]}</button>`).join('')}</nav>`;
  document.body.classList.add('in-lesson');
  const fb=$('#finBtn',root),fn=$('#finNote',root);
  const paint=()=>{const d=!!store.get(KK('done'),{})[L.id];fb.setAttribute('aria-pressed',d);fb.innerHTML=d?'✓ أنجزت هذا الدرس':'أنهيت الدرس';fn.textContent=d?'يُحسب في نسبة إنجازك. اضغط مرة أخرى للتراجع.':'اضغطه بعد ما تقرأ الشرح وتجرّب المختبر وتحل الأسئلة.';
    const a=root.querySelector(`.lside a[href="#${L.id}"]`);if(a){a.classList.toggle('done',d);a.classList.toggle('seen',!d)}};
  fb.addEventListener('click',()=>{const dn=store.get(KK('done'),{});if(dn[L.id])delete dn[L.id];else dn[L.id]=1;store.set(KK('done'),dn);paint()});paint();
  $$('[data-unit]',root).forEach(a=>a.addEventListener('click',e=>{e.preventDefault();location.hash='home';setTimeout(()=>{const el=document.getElementById('unit-'+a.dataset.unit);el&&el.scrollIntoView()},60)}));
  // runtime is shared by lab & plc tabs
  stopRun();
  if(hasLab&&!L.lab||L.program) RUN=createRuntime(L);
  const show=t=>{tab=t;$$('.ltabs button,.bnav button',root).forEach(b=>b.setAttribute('aria-selected',b.dataset.tab===t));document.body.dataset.tab=t;
    try{sessionStorage.setItem('tab-'+L.id,t)}catch(e){}
    const body=$('#tab-body');const strip=$('#strip-host');
    if(RUN){RUN.detach()}
    strip.innerHTML='';
    if(t==='theory')renderTheory(L,body);
    else if(t==='lab'){if(L.lab&&!L.program&&!L.plant){body.innerHTML='<div id="custom-lab"></div>';L.lab($('#custom-lab'),B)}else{RUN.attach('lab',body,strip)}}
    else if(t==='plc'){RUN.attach('plc',body,strip)}
    else if(t==='quiz')renderQuiz(L,body);
    else if(t==='acts')renderActs(L,body);
    else if(t==='examples')renderExamples(L,body);
    B.math(body);
  };
  $$('.ltabs button,.bnav button',root).forEach(b=>b.addEventListener('click',()=>{show(b.dataset.tab);const tb=$('.ltabs',root);if(tb&&tb.getBoundingClientRect().top<0)window.scrollTo(0,root.querySelector('.lesson-head').offsetTop+root.querySelector('.lesson-head').offsetHeight-10)}));
  let t0=tab;try{t0=sessionStorage.getItem('tab-'+L.id)||tab}catch(e){}
  show(tabs.find(t=>t[0]===t0)?t0:'theory');
  window.scrollTo(0,0);
}

/* ---------------- THEORY ---------------- */
function figHTML(L,b){
  let inner='';
  const P=RUN?RUN.plc:createPLC(curProgram(L));
  if(typeof b.draw==='function') inner=b.draw(B);
  else if(b.draw==='power'&&L.power) inner=`<div class="svgbox">${L.power(idleState(L,P),B)}</div>`;
  else if(b.draw==='ctrl'&&L.ctrl) inner=`<div class="svgbox ctrlbox">${ctrlCircuit(L.ctrl,()=>0,()=>0)}</div>`;
  else if(b.draw==='io') inner=ioTableHTML(L,null);
  else if(b.draw&&/^(lad|fbd|stl)(:\d+)?$/.test(b.draw)){const [v,k]=b.draw.split(':');const nets=P.nets.filter((n,j)=>k===undefined||j===+k-1);
    inner=nets.map(n=>`<div class="net static"><header><h3>${n.title||('Network '+(n.i+1))}</h3></header>${v==='stl'?stlTable(n,{trace:[],get:()=>0}):`<div class="svgbox fixed">${(v==='lad'?ladNetwork:fbdNetwork)(n,P,L._names)}</div>`}</div>`).join('');}
  else if(b.html) inner=b.html;
  return `<figure class="fig">${inner}<figcaption>${b.fig?`<b>الشكل ${b.fig}</b> `:''}${b.caption||''}${b.ref?` <span class="ref">${b.ref}</span>`:''}</figcaption></figure>`;
}
/* ---------------- THEORY: أسلوب المحطات ----------------
 L.stations = true و L.theory = [{intro:true}, {st:1,title,q,ref,art,cap,side:[blocks],body:[blocks]}, {recap:[...]}]
 الكتل: {book,ref} نص الكتاب · {tip,title} توضيح للمتدرب · {add,title} إضافة من خارج الكتاب
        {watch,fix?} انتبه (fix:true = شرح خطأ في الكتاب، يُخفى بزر «إخفاء الشرح») · {predict:{q,opts:[[نص,صح؟,سبب]]}} جرّب · {widget(el,B),title} جرّب · {html} */
const TG={book:['نص الكتاب','t-book'],tip:['توضيح للمتدرب','t-tip'],add:['إضافة من خارج الكتاب','t-add'],try:['جرّب','t-try'],watch:['انتبه','t-watch']};
const tagH=k=>`<span class="tg ${TG[k][1]}">${TG[k][0]}</span>`;
const ORDW=['','الأولى','الثانية','الثالثة','الرابعة','الخامسة','السادسة','السابعة','الثامنة','التاسعة','العاشرة'];
function renderStations(L,body){
  const W=[];
  const blk=b=>B.ltrU(blk0(b));
  const blk0=b=>{
    if(b.book!=null) return `<div class="sb sb-book"><div class="sb-h">${tagH('book')}${b.ref?`<span class="ref">${b.ref}</span>`:''}</div><div class="prose">${b.book}</div></div>`;
    if(b.tip!=null) return `<div class="sb sb-tip"><div class="sb-h">${tagH('tip')}${b.title?`<b>${b.title}</b>`:''}</div><div class="prose">${b.tip}</div></div>`;
    if(b.add!=null) return `<div class="sb sb-add"><div class="sb-h">${tagH('add')}${b.title?`<b>${b.title}</b>`:''}</div><div class="prose">${b.add}</div></div>`;
    if(b.watch!=null) return `<div class="sb sb-watch${b.fix?' fixnote':''}"><div class="sb-h">${tagH('watch')}</div><div class="prose">${b.watch}</div></div>`;
    if(b.predict){const p=b.predict;return `<div class="sb sb-try pd"><div class="sb-h">${tagH('try')}<b>توقّع قبل أن تكمل</b></div><div class="pd-q">${p.q}</div><div class="pd-o">${p.opts.map((o,j)=>`<button type="button" data-j="${j}" data-ok="${o[1]?1:0}">${o[0]}</button>`).join('')}</div><div class="pd-fb" hidden></div></div>`}
    if(b.widget){W.push(b.widget);return `<div class="sb sb-try"><div class="sb-h">${tagH('try')}${b.title?`<b>${b.title}</b>`:''}</div><div class="sw-host" data-w="${W.length-1}"></div></div>`}
    if(b.html) return `<div class="prose">${b.html}</div>`;
    return '';
  };
  const sts=(L.theory||[]).filter(b=>b.st);
  let h='<article class="theory stations">';
  (L.theory||[]).forEach(b=>{
    if(b.intro){
      h+=`<div class="legend"><b>كيف تقرأ هذا الدرس؟</b><div class="lg">
        <div>${tagH('book')}<br>منقول من المذكرة كما هو، مع رقم الصفحة.</div>
        <div>${tagH('tip')}<br>شرح مبسّط منا لتقريب الفكرة، وليس من الكتاب.</div>
        <div>${tagH('add')}<br>مثال من الواقع أو معلومة تساعد على الفهم.</div>
        <div>${tagH('try')}<br>سؤال أو تجربة قصيرة قبل أن تكمل القراءة.</div></div></div>`;
      h+=`<nav class="stmap" aria-label="محطات الدرس">${sts.map(s=>`<button type="button" data-go="${s.st}"><i>${s.st}</i>${s.short||s.title}</button>`).join('')}</nav>`;
    } else if(b.st){
      h+=`<section class="st" id="st-${b.st}"><header class="st-h"><span class="st-n">${b.st}</span><div><small>المحطة ${ORDW[b.st]||b.st}${b.ref?` · ${b.ref}`:''}</small><h2>${b.title}</h2>${b.q?`<p class="st-q">${B.ltrU(b.q)}</p>`:''}</div></header>`;
      if(b.art) h+=`<div class="st-hero"><div>${(b.side||[]).map(blk).join('')}</div><figure class="st-art">${b.art}${b.cap?`<figcaption>${b.cap}</figcaption>`:''}</figure></div>`;
      else h+=(b.side||[]).map(blk).join('');
      h+=(b.body||[]).map(blk).join('')+'</section>';
    } else if(b.recap){
      h+=`<section class="st"><div class="sb sb-tip recap"><div class="sb-h">${tagH('tip')}<b>خلاصة الدرس في ${b.recap.length} أسطر</b></div><ol>${b.recap.map(x=>`<li>${B.ltrU(x)}</li>`).join('')}</ol></div></section>`;
    } else h+=blk(b);
  });
  h+='</article>';
  body.innerHTML=h;
  $$('.st-art',body).forEach(fig=>{
    if(!fig.querySelector('[data-tip]'))return;
    const tp=document.createElement('div');tp.className='art-tip';tp.hidden=true;fig.appendChild(tp);let cur=null;
    const place=e=>{const R=fig.getBoundingClientRect(),x=e.clientX-R.left,y=e.clientY-R.top,w=tp.offsetWidth,h=tp.offsetHeight;
      tp.style.left=Math.max(8,Math.min(R.width-w-8,x-w/2))+'px';tp.style.top=(y-h-12<0?y+18:y-h-12)+'px'};
    const show=(el,e)=>{if(cur&&cur!==el)cur.classList.remove('tip-on');cur=el;el.classList.add('tip-on');tp.innerHTML=B.ltrU(el.dataset.tip.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'})[c])).replace(/⟦(.*?)⟧/g,'<span class="ltr">$1</span>');tp.hidden=false;place(e)};
    const hide=()=>{if(cur)cur.classList.remove('tip-on');cur=null;tp.hidden=true};
    fig.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;const el=e.target.closest('[data-tip]');if(el)show(el,e);else hide()});
    fig.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse')hide()});
    fig.addEventListener('click',e=>{const el=e.target.closest('[data-tip]');if(el&&el!==cur)show(el,e);else hide()});
  });
  $$('.sw-host',body).forEach(el=>{try{W[+el.dataset.w](el,B)}catch(e){console.error(e)}});
  $$('.stmap button',body).forEach(bt=>bt.addEventListener('click',()=>{const t=document.getElementById('st-'+bt.dataset.go);if(t)t.scrollIntoView({behavior:'smooth',block:'start'})}));
  $$('.pd',body).forEach(pd=>{
    const fb=$('.pd-fb',pd),bs=$$('.pd-o button',pd),blkI=(L.theory||[]).flatMap(s=>[...(s.side||[]),...(s.body||[]),s]).filter(x=>x.predict);
    const P=blkI[$$('.pd',body).indexOf(pd)].predict;
    bs.forEach(bt=>bt.addEventListener('click',()=>{const j=+bt.dataset.j,ok=bt.dataset.ok==='1';
      bs.forEach(x=>{x.disabled=true;if(x.dataset.ok==='1')x.classList.add('ok');else if(x===bt)x.classList.add('no');else x.classList.add('dim')});
      fb.innerHTML=B.ltrU(`<b>${ok?'إجابة صحيحة.':'ليست هذه.'}</b> ${P.opts[j][2]||''}${!ok?` <br>${P.opts.find(o=>o[1])[2]||''}`:''} <button class="btn" type="button" data-r>حاول مرة أخرى</button>`);
      fb.hidden=false;B.math(fb);
      $('[data-r]',fb).addEventListener('click',()=>{bs.forEach(x=>{x.disabled=false;x.classList.remove('ok','no','dim')});fb.hidden=true});
    }));
  });
}

/* داخل رسومات SVG: نص عربي فيه «(1-3)» أو «5 V» قد ينعكس ترتيبه؛ نضع كل مقطع لاتيني/رقمي في tspan باتجاه LTR */
function fixSvgBidi(root){const NS='http://www.w3.org/2000/svg',re=/(\(\d+-\d+\)|\d+(?:[.,]\d+)?\s?(?:kV|V|mA|A|kW|W|Ω|Hz|rpm|%|s)?(?![\w\u0600-\u06FF]))/g;
 root.querySelectorAll('svg text').forEach(t=>{if(t.children.length)return;const txt=t.textContent;if(!/[\u0600-\u06FF]/.test(txt)||!/\d/.test(txt))return;
  const parts=txt.split(re);if(parts.length<2)return;t.textContent='';
  parts.forEach((p,i)=>{if(!p)return;if(i%2){const ts=document.createElementNS(NS,'tspan');ts.setAttribute('direction','ltr');ts.setAttribute('unicode-bidi','embed');ts.textContent=p;t.appendChild(ts)}else t.appendChild(document.createTextNode(p))})})}
function renderTheory(L,body){
  /* أسلوب الشرح يختاره المستخدم من الزر في الأعلى: «رسمي» أو «التفاعلي». L.stations = مصفوفة محتوى المحطات */
  if(B.styleMode()==='stations'){
    if(Array.isArray(L.stations)&&L.stations.length){const r=renderStations(Object.assign({},L,{theory:L.stations}),body);fixSvgBidi(body);return r}
    body.innerHTML='<div class="st-missing">هذا الدرس لم يُجهَّز بالأسلوب «التفاعلي» بعد، فيظهر بالأسلوب الرسمي.</div>';
    const host=document.createElement('div');body.appendChild(host);body=host;
  }
  let h='<article class="theory">';
  (L.theory||[]).forEach(b=>{
    if(b.h) h+=`<h2 class="th">${b.h}${b.ref?` <span class="ref">${b.ref}</span>`:''}</h2>`;
    if(b.fig||b.draw) h+=figHTML(L,b);
    else if(b.note) h+=`<div class="callout">${b.note}</div>`;
    else if(b.err) h+=`<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> ${String(b.err).replace(/^<(div|span) class="fixnote">/,'<$1>')}</div>`;
    else if(b.widget){h+=`<div class="widget" data-w="${(L.theory.indexOf(b))}"></div>`}
    else if(b.html) h+=`<div class="prose">${b.html}</div>`;
  });
  h+='</article>';
  body.innerHTML=B.ltrFig(h);
  $$('.widget',body).forEach(el=>{const b=L.theory[+el.dataset.w];try{b.widget(el,B)}catch(e){console.error(e)}});
}
function idleState(L,P){return makeState(L,P||createPLC(curProgram(L)),{},L.plant&&L.plant.init?L.plant.init():{},0)}
function curProgram(L){if(L.variants){const k=L._variant||L.variants.default||Object.keys(L.variants).filter(x=>x!=='default'&&x!=='note'&&x!=='title')[0];return L.variants[k].program||L.program}return L.program||[]}

/* ---------------- I/O table ---------------- */
function ioTableHTML(L,P){
  const rows=(L.io||[]);
  return `<div class="tablebox"><table class="io"><thead><tr><th>الرمز</th><th>الوصف</th><th>العنوان</th>${P?'<th>الحالة</th>':''}</tr></thead><tbody>`+
   rows.map(r=>{const v=P&&r.addr?P.get(r.addr.replace(/\s+/g,'')):0;return `<tr class="${P&&v?'hi':''}"><td class="mono">${r.sym||''}</td><td>${r.desc||''}</td><td class="mono">${r.addr||''}</td>${P?`<td><span class="bit ${v?'one':''}">${v}</span></td>`:''}</tr>`}).join('')+`</tbody></table></div>`;
}

/* ---------------- state API passed to lesson functions ---------------- */
function makeState(L,P,btn,plant,t){
  /* وضع التحدي: عطل في مخرج (حمل لا يعمل / تلامس ملتحم) — العالم الفعلي (الحمل، الدائرة الرئيسة، الجهاز) يرى حالة المشغّل، والـ PLC (البرنامج وجدول المداخل والمخارج) يرى ما كتبه */
  const ph=chOutIO(),g=ph?(a=>{a=a.replace(/\s+/g,'');return ph[a]!=null?ph[a]:P.get(a)}):(a=>P.get(a.replace(/\s+/g,'')));
  const st={plc:P,plant,t,btn:id=>btn[id]?1:0,
    I:g,Q:g,M:g,
    T:a=>P.tim[a]||{q:0,el:0,tv:0,run:0},C:a=>P.cnt[a]||{v:0},
    get:g};
  // name resolution for control circuits: lesson.ctrlMap name -> 'btn:ID' | address | fn
  st.name=nm=>{const m=(L.ctrlMap||{})[nm];if(m===undefined){if(btn[nm]!==undefined)return btn[nm]?1:0;return 0}
    if(typeof m==='function')return m(st)?1:0; if(String(m).startsWith('btn:'))return btn[m.slice(4)]?1:0; return g(m)};
  st.variant=L._variant;
  return st;
}

/* ---------------- RUNTIME (lab + plc tabs) ---------------- */
function createRuntime(L){
  const R={};let P=createPLC(curProgram(L));R.plc=P;const chIn=chInIO(),CHM=()=>mode==='ch';
  L._names={};(L.io||[]).forEach(r=>{if(r.addr)L._names[r.addr.replace(/\s+/g,'')]=r.sym});
  const btn={},latch={},pressT={};(L.inputs||[]).forEach(i=>{btn[i.id]=i.initial?1:0});
  let plant=L.plant&&L.plant.init?L.plant.init():{};
  let t=0,hist=[],histT=0,slow=false,phase=-1,phaseT=0,view='lad',raf=0,mode=null,el=null,stripEl=null,lastSig='',stepI=0;
  const st=()=>makeState(L,P,Object.assign({},btn,latchOn()),plant,t);
  function latchOn(){const o={};for(const k in latch)if(latch[k])o[k]=1;return o}
  function writeInputs(){
    (L.inputs||[]).forEach(i=>{if(!i.addr)return;let v=(btn[i.id]||latch[i.id])?1:0;
      if(i.type==='sensor'&&i.from){v=i.from(st())?1:0;if(btn['__ovr_'+i.id]!==undefined)v=btn['__ovr_'+i.id]}
      if(i.invert)v=1-v;const a=i.addr.replace(/\s+/g,'');
      if(chIn){const f=chIn[a];if(f!=null)v=f==='inv'?1-v:+f}   /* وضع التحدي: عطل في مدخل (عالق على 0 / على 1 / N.O.↔N.C. معكوس) */
      P.set(a,v)});
    for(const k in latch)if(!btn[k])latch[k]=0;
  }
  function tick(dt){
    if(!slow){writeInputs();P.scan(dt);phase=-1}
    else{phaseT+=dt;if(phaseT>=0.85){phaseT=0;phase=(phase+1)%(P.nets.length+2);
        if(phase===0)writeInputs();else if(phase<=P.nets.length){P.dt=0.85;P.runNet(phase-1)}}}
    if(L.plant&&L.plant.step)L.plant.step(dt,st(),plant);
    t+=dt;histT+=dt;
    if(L.plant&&L.plant.chart&&histT>=0.05){histT=0;const rec={t};rec[L.plant.chart.key]=plant[L.plant.chart.key]||0;(L.plant.chart.series||[]).forEach(s=>rec[s.key]=plant[s.key]||0);hist.push(rec);while(hist.length&&t-hist[0].t>(L.plant.chart.span||12)+0.3)hist.shift()}
  }
  function sig(){return JSON.stringify([P.mem,Object.entries(P.tim).map(([k,v])=>[k,v.q,v.run,v.run?Math.ceil((v.tv-v.el)*2):0]),Object.entries(P.cnt).map(([k,v])=>[k,v.v]),btn,latch,phase,view,L._variant,L.plant&&L.plant.sig?L.plant.sig(plant):0])}
  function loop(now){const dt=Math.min(0.05,(now-(R._last||now))/1000);R._last=now;tick(dt);if(el)render(false);raf=requestAnimationFrame(loop)}
  R.start=()=>{if(!raf){R._last=performance.now();raf=requestAnimationFrame(loop)}};
  R.stop=()=>{cancelAnimationFrame(raf);raf=0};
  R.detach=()=>{el=null;stripEl=null};
  R.setVariant=k=>{L._variant=k;P=createPLC(curProgram(L));R.plc=P;plant=L.plant&&L.plant.init?L.plant.init():{};hist=[];lastSig='';if(el)build()};
  R.attach=(m,body,strip)=>{mode=m;el=body;stripEl=strip;build();R.start()};

  function build(){
    variantSeg.done=0;stripEl.innerHTML=stripHTML();wireStrip();
    if(mode==='lab') el.innerHTML=labHTML(); else if(mode==='ch') el.innerHTML=labHTML()+plcHTML(); else el.innerHTML=plcHTML();
    wireBody();lastSig='';renderSteps();render(true);
  }
  function variantSeg(){if(!L.variants||(CHM()&&(!CH.varSel||variantSeg.done)))return '';if(CHM())variantSeg.done=1;const ks=Object.keys(L.variants).filter(k=>k!=='default'&&k!=='note'&&k!=='title');const cur=L._variant||L.variants.default||ks[0];
    return `<div class="variant"><span>${L.variants.title||'نسخة البرنامج:'}</span><div class="seg" role="group">${ks.map(k=>`<button data-var="${k}" aria-pressed="${k===cur}">${L.variants[k].label}</button>`).join('')}</div>${L.variants.note?`<p class="sub">${L.variants.note}</p>`:''}${L.variants[cur].note?`<div class="callout err">${L.variants[cur].note}</div>`:''}</div>`}
  function stripHTML(){
    const ins=(L.inputs||[]).filter(i=>i.type!=='sensor'||i.manual);
    const outs=(L.io||[]).filter(r=>r.addr&&/^Q/.test(r.addr.replace(/\s+/g,'')));
    return `<div class="strip console"><div class="con-head"><span>لوحة التشغيل</span>${L.steps&&L.steps.length&&!CHM()?'<span class="task" id="taskNow"></span>':''}</div><div class="wrap-in">
      <div class="pbs">${ins.map(i=>{
        if(i.type==='push') return `<button class="pb ${i.color||'black'}" data-in="${i.id}" aria-label="${esc(i.label||i.id)}"><span class="cap">${i.id}</span><small>${i.label||''}</small></button>`;
        if(i.type==='fault') return `<button class="btn warn tg" data-tg="${i.id}" aria-pressed="false">${i.label||('فصل '+i.id)}</button>`;
        return `<button class="sw" data-tg="${i.id}" aria-pressed="${btn[i.id]?'true':'false'}"><span class="knob"></span><b>${i.id}</b><small>${i.label||''}</small></button>`;}).join('')}</div>
      <div class="lamps">${outs.map(r=>`<div class="lamp" data-q="${r.addr.replace(/\s+/g,'')}"><i></i><b>${r.sym||r.addr}</b><span class="mono">${r.addr}</span></div>`).join('')}</div>
      <div class="reads" id="reads"></div></div></div>`;
  }
  function wireStrip(){
    $$('.pb',stripEl).forEach(b=>{const k=b.dataset.in;
      const press=()=>{btn[k]=1;latch[k]=1;pressT[k]=performance.now();b.classList.add('down')};
      const rel=()=>{if(!btn[k])return;const w=Math.max(0,260-(performance.now()-(pressT[k]||0)));setTimeout(()=>{btn[k]=0;b.classList.remove('down')},w)};
      b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture&&b.setPointerCapture(e.pointerId);press()});
      ['pointerup','pointercancel','lostpointercapture'].forEach(ev=>b.addEventListener(ev,rel));
      b.addEventListener('keydown',e=>{if((e.key===' '||e.key==='Enter')&&!e.repeat){e.preventDefault();press()}});
      b.addEventListener('keyup',e=>{if(e.key===' '||e.key==='Enter')rel()});
      b.addEventListener('contextmenu',e=>e.preventDefault());});
    $$('[data-tg]',stripEl).forEach(b=>b.addEventListener('click',()=>{const k=b.dataset.tg;btn[k]=btn[k]?0:1;b.setAttribute('aria-pressed',btn[k]?'true':'false');
      const i=(L.inputs||[]).find(x=>x.id===k);if(i&&i.type==='fault')b.textContent=btn[k]?(i.resetLabel||('إعادة ضبط '+k)):(i.label||('فصل '+k))}));
  }
  function labHTML(){
    const p=L.plant;let h=variantSeg()+'<div class="grid">';
    const tb=(ref)=>`<div class="tblock"><span>${ref||''}</span><span>${(B.COURSE&&B.COURSE.code)||'205 كهر'}</span><span>الدرس ${L.unit}.${L.order}</span></div>`;
    if(L.power) h+=`<div class="panel sheet ${p?'c7':'c12'}"><h2>الدائرة الرئيسة (القدرة)</h2><p class="sub">الخط البرتقالي = عليه جهد. المتقطع المتحرك = يمر فيه تيار.</p><div class="svgbox" id="powerSvg"></div>${tb(L.powerRef)}</div>`;
    if(p){h+=`<div class="panel ${L.power?'c5':'c12'}"><h2>${p.title||'الجهاز'} <small id="plantLabel"></small></h2>`;
      if(p.view==='motor')h+=`<div class="motor-row"><div>${W.motor('rotor',150)}${p.nameplate?`<div class="nameplate">${p.nameplate}</div>`:''}</div><div id="plantExtra"></div></div>`;
      else h+=`<div id="plantView" class="plant-view"></div>`;
      if(p.chart)h+=`<h3 class="sm">${p.chart.label||''}</h3><div class="chart"><canvas id="plantChart"></canvas></div>${p.chart.legend?`<div class="legend">${p.chart.legend}</div>`:''}`;
      h+=`</div>`}
    if(L.ctrl&&!CHM()) h+=`<div class="panel sheet c7"><h2>دائرة التحكم التقليدية</h2><p class="sub">تابع أين يصل الجهد مع كل ضغطة.</p><div class="svgbox ctrlbox" id="ctrlSvg"></div>${tb(L.ctrlRef)}</div>`;
    if(L.steps&&L.steps.length&&!CHM()) h+=`<div class="panel ${L.ctrl?'c5':'c12'}"><h2>التجربة خطوة بخطوة</h2><p class="sub">استخدم ضواغط لوحة التشغيل. اضغط مطوّلاً أو انقر.</p><ol class="steps" id="steps"></ol></div>`;
    if(!L.ctrl&&!L.power&&!p&&!CHM()) h+=`<div class="panel c12"><h2>البرنامج يعمل الآن</h2><div id="miniLad"></div></div>`;
    return h+'</div>';
  }
  function plcHTML(){
    return variantSeg()+`<div class="grid"><div class="panel c8"><div class="viewseg"><h2>البرنامج يعمل الآن <small>بنفس ضواغط لوحة التشغيل</small></h2>
      <div class="seg" role="group"><button data-view="lad" aria-pressed="${view==='lad'}">LAD</button><button data-view="fbd" aria-pressed="${view==='fbd'}">FBD</button><button data-view="stl" aria-pressed="${view==='stl'}">STL</button></div></div>
      <p class="sub" id="viewNote">${VIEWNOTE[view]}</p><div class="scan" id="scan"></div><div id="nets"></div></div>
      <div class="panel c4"><h2>جدول المداخل والمخارج</h2><div id="ioLive"></div>
      <label class="toggle"><input type="checkbox" id="slowScan" ${slow?'checked':''}> تشغيل المسح ببطء (لرؤية ترتيب التنفيذ)</label>
      <p class="sub">الـ PLC يقرأ المداخل، ثم ينفذ الـ Networks بالترتيب، ثم يكتب المخارج، ويكرر ذلك كل بضعة أجزاء من الثانية.</p>${L.plcNote?`<div class="callout">${L.plcNote}</div>`:''}</div></div>`;
  }
  function wireBody(){
    $$('[data-view]',el).forEach(b=>b.addEventListener('click',()=>{view=b.dataset.view;$$('[data-view]',el).forEach(x=>x.setAttribute('aria-pressed',x===b));$('#viewNote',el).innerHTML=VIEWNOTE[view];lastSig=''}));
    const ss=$('#slowScan',el);if(ss)ss.addEventListener('change',e=>{slow=e.target.checked;phase=0;phaseT=0});
    $$('[data-var]',el).forEach(b=>b.addEventListener('click',()=>R.setVariant(b.dataset.var)));
    const stEl=$('#steps',el);if(stEl){stEl.addEventListener('click',e=>{if(e.target.closest('[data-next]')){stepI++;renderSteps()}if(e.target.closest('[data-restart]')){stepI=0;renderSteps()}});renderSteps()}
  }
  function renderSteps(){const S=L.steps;const tn=stripEl&&$('#taskNow',stripEl);if(tn&&S){tn.innerHTML=stepI<S.length?`<b>مهمتك الآن (${stepI+1}/${S.length}):</b> ${S[stepI].t}`:'<b>أحسنت:</b> أنهيت التجربة'}
    const sEl=el&&$('#steps',el);if(!sEl)return;
    sEl.innerHTML=S.map((s,i)=>`<li class="${i<stepI?'done':i===stepI?'cur':''}"><span class="k">${i<stepI?'✓':i+1}</span><div><h4>${s.t}</h4><p>${s.x}</p>${i===stepI?`<div class="act">${s.done?'<span class="hint">بانتظار تنفيذك…</span>':'<button class="btn primary" data-next>التالي</button>'}</div>`:''}</div></li>`).join('')+
    (stepI>=S.length?`<li class="cur"><span class="k">✓</span><div><h4>أحسنت، أنهيت التجربة</h4><p style="display:block">انتقل إلى تبويب «برنامج الـ PLC» وكرر الخطوات لترى البرنامج نفسه وهو ينفذ.</p><div class="act"><button class="btn" data-restart>إعادة التجربة</button></div></div></li>`:'')}
  function render(force){
    const s=st();
    // strip lamps & readouts every frame
    if(stripEl){$$('.lamp',stripEl).forEach(l=>l.classList.toggle('on',!!s.Q(l.dataset.q)));
      const rd=$('#reads',stripEl);if(rd&&L.plant&&L.plant.readouts){rd.innerHTML=L.plant.readouts.map(r=>{if(r.chip){const [txt,cls]=r.chip(plant,s);return `<div class="read"><span>${r.l}</span><em class="mode-chip ${cls||''}">${txt}</em></div>`}return `<div class="read"><span>${r.l}</span><b>${r.v(plant,s)}</b></div>`}).join('')}}
    if(!el)return;
    const mL=mode==='lab'||mode==='ch',mP=mode==='plc'||mode==='ch';
    if(mL){
      if(L.plant&&L.plant.view==='motor'){const r=$('#rotor',el);if(r)r.setAttribute('transform',`rotate(${(plant.ang||0).toFixed(1)} 75 75)`)}
      if(L.plant&&L.plant.frame)L.plant.frame($('#plantView',el)||$('#plantExtra',el),s,plant,B);
      if(L.plant&&L.plant.chart){const c=$('#plantChart',el);if(c)W.chart(c,hist,Object.assign({now:t,series:[{key:L.plant.chart.key,color:'--blue'}].concat(L.plant.chart.series||[])},L.plant.chart))}
      if(L.steps&&!CHM()){const cur=L.steps[stepI];if(cur&&cur.done&&cur.done(s)){stepI++;renderSteps()}}
    }
    const sg=sig();if(sg===lastSig&&!force)return;lastSig=sg;
    if(mL){
      const pw=$('#powerSvg',el);if(pw&&L.power)pw.innerHTML=L.power(s,B);
      const cs=$('#ctrlSvg',el);if(cs&&L.ctrl)cs.innerHTML=ctrlCircuit(L.ctrl,s.name,L.ctrlCoil?((nm,f)=>L.ctrlCoil(nm,f,s)):null);
      if(L.plant&&L.plant.render){const pv=$('#plantView',el)||$('#plantExtra',el);if(pv)L.plant.render(pv,s,plant,B)}
      const lb=$('#plantLabel',el);if(lb&&L.plant&&L.plant.label)lb.textContent=L.plant.label(plant,s);
      const ml=$('#miniLad',el);if(ml)ml.innerHTML=P.nets.map(n=>`<div class="net"><header><h3>${n.title||'Network '+(n.i+1)}</h3></header><div class="svgbox fixed">${ladNetwork(n,P,L._names)}</div></div>`).join('');
    }
    if(mP){
      const N=P.nets.length;const ph=['قراءة المداخل'].concat(P.nets.map((n,i)=>'Network '+(i+1)),['كتابة المخارج']);
      $('#scan',el).innerHTML=ph.map((p,i)=>`<span class="ph ${slow&&phase===i?'cur':''}">${p}</span>`).join('<span class="arr">→</span>')+(slow?'':'<span class="arr loop">↻ يتكرر باستمرار</span>');
      $('#nets',el).innerHTML=P.nets.map((n,i)=>{const cur=slow&&phase===i+1;const body=view==='lad'?`<div class="svgbox fixed">${ladNetwork(n,P,L._names)}</div>`:view==='fbd'?`<div class="svgbox fixed">${fbdNetwork(n,P,L._names)}</div>`:stlTable(n,P);
        return `<div class="net ${cur?'cur':''}"><header><h3>${n.title||('Network '+(i+1))}</h3>${n.ref?`<span class="ref">${n.ref}</span>`:''}</header>${n.read?`<p class="read-as">${n.read}</p>`:''}${body}</div>`}).join('');
      $('#ioLive',el).innerHTML=ioTableHTML(L,P);
    }
  }
  return R;
}
const VIEWNOTE={
  lad:'LAD (السلّم): الأخضر خلف التلامس = التلامس موصّل، والخط البرتقالي = وصلت الإشارة. حرف داخل الملف يعني نوعه: S تثبيت، R إلغاء، SD/SE/SP/SS/SF مزمن، CU/CD عدّاد.',
  fbd:'FBD (المخطط الصندوقي): البوابة &amp; تعني «و» (كل المداخل لازم 1)، والبوابة &gt;=1 تعني «أو». الدائرة الصغيرة على المدخل = عكس (NOT).',
  stl:'STL (قائمة الأوامر): A = و، AN = و-ليس، O = أو، ON = أو-ليس، A( … ) = قوس، = اكتب النتيجة، S تثبيت، R إلغاء. RLO هي نتيجة المنطق بعد كل سطر.'
};

/* ---------------- MATH ---------------- */
B.math=function(el){try{if(window.renderMathInElement)renderMathInElement(el,{delimiters:[{left:'$$',right:'$$',display:true},{left:'\\(',right:'\\)',display:false}],throwOnError:false})}catch(e){}};
B.tex=(src,display)=>{try{return window.katex?katex.renderToString(src,{throwOnError:false,displayMode:!!display}):esc(src)}catch(e){return esc(src)}};
/* ===== قيم المدرب: مفتاح «قيم توضيحية / قيم المدرب» لأي محاكاة فيها أرقام ليست من الكتاب =====
 B.params(host, id, defs, onChange) → P
   host: عنصر DOM يُرسم فيه الشريط. id: معرف فريد داخل المقرر (مثل 'u1-l3-wave').
   defs: [{k,label,unit,value,min,max,step}]  value = القيمة التوضيحية الافتراضية.
   onChange(v): تُستدعى عند أي تغيير (v = القيم الحالية).
   P.v: القيم الحالية (توضيحية أو قيم المدرب). P.trainer: true إذا كانت قيم المدرب مفعلة.
 تُحفظ قيم المدرب على هذا الجهاز فقط. */
B.params=function(host,id,defs,onChange){
 const key=`${(B.COURSE&&B.COURSE.key)||'lib'}-tp-${id}`;
 const st=store.get(key,{on:false,vals:{}});
 const P={v:{},trainer:false};
 const dflt=()=>Object.fromEntries(defs.map(d=>[d.k,d.value]));
 const rng=d=>d.min!=null&&d.max!=null?`المسموح: من <span class="ltr">${fmtN(d.min)}</span> إلى <span class="ltr">${fmtN(d.max)}</span>`:d.min!=null?`المسموح: <span class="ltr">${fmtN(d.min)}</span> فأكثر`:d.max!=null?`المسموح: حتى <span class="ltr">${fmtN(d.max)}</span>`:'';
 const clampD=(d,x)=>{x=+x;if(!isFinite(x))return d.value;if(d.min!=null&&x<d.min)x=d.min;if(d.max!=null&&x>d.max)x=d.max;return x};
 const compute=()=>{P.trainer=!!st.on;P.v=dflt();if(st.on)defs.forEach(d=>{if(st.vals[d.k]!=null)P.v[d.k]=clampD(d,st.vals[d.k])});
  /* وضع التحدي: كل الجوالات بالقيم نفسها — التوضيحية، أو قيم الآلة التي حددها المدرب لهذا النشاط (CH.mv، بالحدود نفسها) —
     وهي «الآلة السليمة» (CH.healthy)، ثم يُطبَّق العطل المخفي (إن وُجد) على أرقام الآلة */
  if(CH.on){P.trainer=false;P.v=dflt();const m=CH.mv&&CH.mv[id];if(m)defs.forEach(d=>{if(m[d.k]!=null)P.v[d.k]=clampD(d,m[d.k])});CH.healthy[id]=Object.assign({},P.v);
   const p=CH.fault&&CH.fault.p;if(p)Object.keys(p).forEach(k=>{if(!(k in P.v))return;const o=p[k];P.v[k]=o[0]==='*'?P.v[k]*o[1]:o[1]})}};
 if(CH.on){CH.defs[id]=defs;host.hidden=true;compute();P.warn=()=>{};return P}
 const fire=()=>{compute();store.set(key,st);try{onChange&&onChange(P.v)}catch(e){console.error(e)}};
 const render=()=>{
  host.classList.add('tp');
  host.innerHTML=`<div class="tp-head"><span class="tp-lbl">أرقام المحاكاة:</span><div class="seg" role="group"><button data-tp="0" aria-pressed="${!st.on}">قيم توضيحية</button><button data-tp="1" aria-pressed="${!!st.on}">قيم المدرب</button></div>${st.on?'<button class="btn tp-reset" type="button">رجّع القيم التوضيحية</button>':''}</div>`+
   (st.on?`<div class="tp-grid">${defs.map(d=>`<label class="tp-f"><span>${d.label}${d.unit?` <i class="ltr">(${d.unit})</i>`:''}</span><input type="number" inputmode="decimal" data-tpk="${d.k}" value="${d.dp!=null?fmtN(P.v[d.k],d.dp):P.v[d.k]}" ${d.min!=null?`min="${d.min}"`:''} ${d.max!=null?`max="${d.max}"`:''} step="${d.step||'any'}">${d.hint?`<small class="tp-rng">${d.hint}</small>`:''}<small class="tp-rng">${rng(d)}</small><small class="tp-err" data-tperr="${d.k}" hidden></small></label>`).join('')}</div><p class="tp-err" data-tpwarn hidden></p><p class="tp-note">هذه الأرقام محفوظة على هذا الجهاز فقط ولا تتغير عند الطلاب.</p>`
   :`<p class="tp-note">أرقام توضيحية ليست من الكتاب. يستطيع المدرب وضع أرقامه باختيار «قيم المدرب».</p>`);
  host.querySelectorAll('[data-tp]').forEach(b=>b.onclick=()=>{st.on=b.dataset.tp==='1';compute();render();fire()});
  const r=host.querySelector('.tp-reset');if(r)r.onclick=()=>{st.vals={};compute();render();fire()};
  host.querySelectorAll('[data-tpk]').forEach(inp=>{
   inp.oninput=()=>{if(inp.value===''||!isFinite(+inp.value))return;st.vals[inp.dataset.tpk]=+inp.value;fire()};
   inp.onchange=()=>{const d=defs.find(x=>x.k===inp.dataset.tpk);const raw=+inp.value,v=clampD(d,inp.value);const em=host.querySelector(`[data-tperr="${d.k}"]`);
    if(inp.value===''||!isFinite(raw)){em.textContent=`اكتب رقماً. رجّعناها إلى ${fmtN(v)}.`;em.hidden=false}
    else if(v!==raw){em.textContent=`${raw<v?'أقل':'أعلى'} قيمة مسموحة ${fmtN(v)} حتى تبقى المحاكاة صحيحة، فرجّعناها لها.`;em.hidden=false}else em.hidden=true;
    inp.value=v;st.vals[d.k]=v;fire()};});
 };
 /* P.warn(msg): رسالة حمراء أسفل الخانات (مثلاً عند تصحيح ترتيب قيم مترابطة)؛ P.warn('') يخفيها */
 P.warn=msg=>{const w=host.querySelector('[data-tpwarn]');if(!w)return;w.innerHTML=msg||'';w.hidden=!msg};
 compute();render();
 return P;
};
/* يثبّت اتجاه «رقم + وحدة» داخل النص العربي حتى لا تنقلب: 1500 rpm لا rpm 1500 */
B.ltrU=t=>String(t).split(/(<svg[\s\S]*?<\/svg>|\$\$[\s\S]*?\$\$|\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\])/).map((p,i)=>i%2?p:p.replace(/(\(\d+-\d+\)|\d[\d.,]*\s?(?:rpm|kHz|Hz|kV|V|mA|A|kW|W|Ω|%))(?![^<]*>)/g,'<span class="ltr">$1</span>')).join('');  /* لا يلمس ما داخل رسومات SVG ولا المعادلات */
/* أرقام الأشكال والمعادلات مثل (2-1) داخل النص العربي في الشرح الرسمي: نثبّت اتجاهها (خارج SVG والمعادلات) */
B.ltrFig=t=>String(t).split(/(<svg[\s\S]*?<\/svg>|\$\$[\s\S]*?\$\$|\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]|<span class="ltr">[\s\S]*?<\/span>)/).map((p,i)=>i%2?p:p.replace(/(\(\d+-\d+(?:-\d+)?\))(?![^<]*>)/g,'<span class="ltr">$1</span>')).join('');
B.styleMode=()=>{try{return localStorage.getItem('elib-style')==='stations'?'stations':'formal'}catch(e){return 'formal'}};
B.round=(x,dp)=>{const p=Math.pow(10,dp||0);return Math.round(x*p)/p};
const fmtN=(v,dp)=>{if(typeof v!=='number'||!isFinite(v))return v==null?'':String(v);return (dp==null?+v.toPrecision(6):B.round(v,dp)).toLocaleString('en-US',{useGrouping:false,maximumFractionDigits:dp==null?6:dp,minimumFractionDigits:dp==null?0:dp})};
B.fmtN=fmtN;
/* ---------------- WORKED EXAMPLES ----------------
 L.examples=[{title,ref,q:html,given:[{id,label,sym,unit,value,step,min,max}],solve:(g,B)=>[{t:html,f:latex,v:number|string,unit,dp,final:bool}],note}] */
function renderExamples(L,body){
  body.innerHTML='<div class="exs">'+L.examples.map((x,i)=>`<section class="ex" data-i="${i}"><header><h2>${x.title}</h2>${x.ref?`<span class="ref">${x.ref}</span>`:''}</header>
   <div class="ex-q">${x.q||''}</div>
   ${x.given&&x.given.length?`<div class="ex-given"><div class="ex-gh"><b>المعطيات</b><span class="sub">غيّر الأرقام وشاهد الحل يتغير</span><button class="btn" data-reset>قيم الكتاب</button></div><div class="ex-grid">${x.given.map(g=>`<label class="ex-in"><span>${g.label}${g.sym?` <span class="ltr">${B.tex(g.sym)}</span>`:''}</span><span class="ex-inbox"><input type="number" inputmode="decimal" step="${g.step||'any'}" ${g.min!=null?`min="${g.min}"`:''} ${g.max!=null?`max="${g.max}"`:''} data-g="${g.id}" value="${g.value}" id="ex${i}-${g.id}"><em>${g.unit||''}</em></span></label>`).join('')}</div></div>`:''}
   <ol class="ex-steps"></ol><div class="ex-ctl"></div><div class="ex-pred" hidden></div>${x.note?`<div class="callout">${x.note}</div>`:''}</section>`).join('')+'</div>';
  $$('.ex',body).forEach(sec=>{const x=L.examples[+sec.dataset.i];
    /* الحل مخفي ويُكشف خطوة خطوة؛ «اعرض الحل كاملاً» يكشفه مرة واحدة؛ «توقّع» يقارن توقع المتدرب بناتج الخطوة التالية بعد التقريب */
    let shown=0,steps=[],book=true;
    const ctl=$('.ex-ctl',sec),pred=$('.ex-pred',sec);
    const decs=s=>{const m=String(s).trim().match(/\.(\d+)$/);return m?m[1].length:0};
    const draw=()=>{const N=steps.length;if(shown>N)shown=N;
      $('.ex-steps',sec).innerHTML=steps.map((st,k)=>`<li class="${st.final?'final':''}${k>=shown?' ex-hid':''}">${st.t?`<div class="ex-t">${st.t}</div>`:''}${st.f?`<div class="ex-f">${B.tex(st.f,true)}</div>`:''}${st.v!=null?`<div class="ex-v"><span class="ltr">${fmtN(st.v,st.dp)} ${st.unit||''}</span></div>`:''}</li>`).join('')+(book||!shown?'':'<li class="ex-mine"><div class="ex-t">الأرقام الآن من عندك وليست من الكتاب.</div></li>');
      const nx=steps[shown],canP=nx&&typeof nx.v==='number'&&isFinite(nx.v);
      ctl.innerHTML=shown<N?`<button class="btn pri" data-next>الخطوة التالية <span class="sub">(${shown+1} من ${N})</span></button>${canP?'<button class="btn" data-pred>توقّع الناتج</button>':''}<button class="btn" data-all>اعرض الحل كاملاً</button>${shown?'<button class="btn" data-hide>إخفاء الحل</button>':''}`:(N?'<button class="btn" data-hide>إخفاء الحل</button>':'');
      if(!canP||shown>=N)pred.hidden=true;
      const q=s=>$(s,ctl);
      q('[data-next]')&&q('[data-next]').addEventListener('click',()=>{shown++;pred.hidden=true;draw()});
      q('[data-all]')&&q('[data-all]').addEventListener('click',()=>{shown=N;pred.hidden=true;draw()});
      q('[data-hide]')&&q('[data-hide]').addEventListener('click',()=>{shown=0;pred.hidden=true;draw()});
      q('[data-pred]')&&q('[data-pred]').addEventListener('click',()=>{
        pred.hidden=false;
        pred.innerHTML=`<div class="ex-pq"><b>توقّع ناتج الخطوة التالية:</b> ${nx.t||''}${nx.f?`<div class="ex-f">${B.tex(nx.f,true)}</div>`:''}</div><div class="ex-pin"><input type="number" inputmode="decimal" step="any" aria-label="توقعك"><em>${nx.unit||''}</em><button class="btn pri" data-chk>تحقّق</button></div><div class="ex-pfb"></div>`;
        B.math&&B.math(pred);const inp=$('input',pred);inp.focus();
        const chk=()=>{const raw=inp.value;if(raw.trim()==='')return;const p=parseFloat(raw);if(!isFinite(p))return;
          const shownTxt=fmtN(nx.v,nx.dp),d=Math.min(decs(raw),decs(shownTxt));
          const ok=B.round(p,d)===B.round(parseFloat(shownTxt),d);
          $('.ex-pfb',pred).innerHTML=ok?`<b class="ok">توقعك صحيح.</b> الناتج <span class="ltr">${shownTxt} ${nx.unit||''}</span>`:`<b class="no">ليس هذا.</b> توقعك <span class="ltr">${raw} ${nx.unit||''}</span> والناتج الصحيح <span class="ltr">${shownTxt} ${nx.unit||''}</span>`;
          const fb=$('.ex-pfb',pred).innerHTML;shown++;draw();pred.hidden=false;pred.innerHTML=`<div class="ex-pfb">${fb}</div>`;};
        $('[data-chk]',pred).addEventListener('click',chk);
        inp.addEventListener('keydown',e=>{if(e.key==='Enter')chk()});
      });
      B.math&&B.math($('.ex-steps',sec));
    };
    const run=()=>{const g={};$$('[data-g]',sec).forEach(inp=>{g[inp.dataset.g]=parseFloat(inp.value)});
      book=x.given?x.given.every(q=>g[q.id]===q.value):true;steps=[];
      try{steps=x.solve(g,B,book)||[]}catch(e){steps=[{t:'تعذّر الحساب بهذه القيم.'}]}
      draw();
    };
    $$('[data-g]',sec).forEach(inp=>inp.addEventListener('input',run));
    const rb=$('[data-reset]',sec);if(rb)rb.addEventListener('click',()=>{x.given.forEach(q=>{$(`[data-g="${q.id}"]`,sec).value=q.value});run()});
    run();});
}

/* ---------------- QUIZ ---------------- */
function renderQuiz(L,body){
  let ans={};
  const draw=()=>{const sc=Object.entries(ans).filter(([i,a])=>L.quiz[i].c===a).length;
    body.innerHTML=`<div class="viewseg"><h2 class="qtitle">اختبر فهمك للدرس</h2><div><span class="score">${sc} / ${L.quiz.length}</span> <button class="btn" id="qreset">إعادة</button></div></div><div class="quiz">`+
    L.quiz.map((q,i)=>{const a=ans[i];return `<div class="qq"><h3>${i+1}. ${B.ltrU(q.q)}</h3><div class="opts">`+q.o.map((o,j)=>{let c='';if(a!=null){if(j===q.c)c='right';else if(j===a)c='wrong'}
      return `<button class="opt ${c}" data-q="${i}" data-o="${j}" ${a!=null?'disabled':''}>${B.ltrU(o)}</button>`}).join('')+`</div><div class="fb ${a!=null?'show':''}">${a!=null?(a===q.c?'<b class="ok">إجابة صحيحة.</b> ':'<b class="no">ليست هذه.</b> ')+(q.e||''):''}</div></div>`}).join('')+'</div>';
    $$('.opt',body).forEach(b=>b.addEventListener('click',()=>{ans[b.dataset.q]=+b.dataset.o;draw()}));
    $('#qreset',body).addEventListener('click',()=>{ans={};draw()});B.math(body);};
  draw();
}

/* ---------------- الأنشطة التفاعلية ----------------
 القسم 1 «داخل المحاضرة»: أنشطة حية على خادم المسابقة (shared/quiz-config.js) يطلقها المدرب، ويدخل الطلاب برمز من الشاشة.
 القسم 2 «للمذاكرة الذاتية»: أنشطة داخل الكتاب نفسه، بلا خادم وبلا إنترنت؛ التقدم محفوظ على هذا الجهاز فقط (localStorage).
   بطاقات المراجعة (study.js → units[<وحدة>].cards) · رتّب خطوات التجربة (lessons[<درس>].order) · وصّل أطراف الدائرة (lessons[<درس>].match)
   · اختبار قبل وبعد الدرس (أول 5 أسئلة من L.quiz، الأسئلة نفسها قبل وبعد).
 إخفاء نشاط من الموقع كله: shared/activities-config.js (window.ACT_OFF). */
const AR_N=(n,one,two,few,many)=>n===1?one:n===2?two:n<=10?few:many;
const LIVE_ACTS=[
  {k:'quiz',t:'المسابقة',d:'أسئلة اختيار من متعدد على الشاشة، ويجيب الطلاب من جوالاتهم، مع نقاط وترتيب.',b:'ابدأ المسابقة',n:L=>(L.quiz||[]).length,none:'أضف أسئلتك عند البدء'},
  {k:'cloud',t:'سؤال مفتوح وسحابة كلمات',d:'اطرح سؤالاً قصيراً، ويكتب كل طالب إجابته، فتظهر الإجابات على الشاشة سحابة كلمات بلا أسماء.',b:'ابدأ السؤال المفتوح',type:'cloud',n:L=>((B.ACTS[L.id]||{}).open||[]).length,none:'اكتب سؤالك عند البدء'},
  {k:'exit',t:'تذكرة خروج',d:'في آخر المحاضرة: سؤال اختيار واحد، وأكثر نقطة لم تتضح، وتقييم الطالب لفهمه من 1 إلى 5. الملخص يظهر للمدرب فقط.',b:'ابدأ تذكرة الخروج',type:'exit',n:L=>((B.ACTS[L.id]||{}).exit||[]).length,none:'اكتب سؤالك عند البدء'},
  {k:'errs',t:'اكتشف الخطأ',d:'حل مكتوب لمثال من الدرس بأرقام جديدة، وفيه خطوة واحدة خاطئة. يختار الطلاب من جوالاتهم الخطوة الخاطئة، ثم يظهر سبب الخطأ وتصحيحه.',b:'ابدأ اكتشف الخطأ',type:'errs',only:true,n:L=>(B.ERRS[L.id]||[]).length,unit:n=>AR_N(n,'مثال','مثالان','أمثلة','مثالاً')},
  /* المختبرات فقط (courses/<id>/challenge.js): يفتح كل طالب مختبر الدرس على جواله */
  {k:'fault',t:'اكتشف العطل',d:'يعمل مختبر الدرس على جوال كل طالب وفيه العطل المخفي نفسه. يفحص الطالب القراءات ويغيّر المدخلات، ثم يختار العطل من قائمة، ثم يظهر العطل وأعراضه وكيف يُكتشف.',b:'ابدأ اكتشف العطل',type:'fault',only:true,n:L=>B.chLab(L)&&B.CHAL[L.id]?(B.CHAL[L.id].faults||[]).length:0,unit:n=>AR_N(n,'عطل','عطلان','أعطال','عطلاً')},
  {k:'sim',t:'تحدي المحاكاة',d:'يحدد المدرب قراءة مستهدفة (مثل سرعة أو جهد) ونسبة سماح، ويضبط كل طالب المختبر على جواله حتى يصل إليها ثم يرسل. تظهر على الشاشة أسماء من وصل وتوزيع القيم.',b:'ابدأ تحدي المحاكاة',type:'sim',only:true,n:L=>B.chLab(L)&&B.CHAL[L.id]?(B.CHAL[L.id].outputs||[]).length:0,unit:n=>AR_N(n,'قراءة يمكن استهدافها','قراءتان يمكن استهدافهما','قراءات يمكن استهدافها','قراءة يمكن استهدافها')}];
const ACT_ICON={quiz:'<path d="M9 9a3 3 0 1 1 4 2.8c-.6.3-1 .9-1 1.5V14M12 18h.01"/><circle cx="12" cy="12" r="9"/>',cloud:'<path d="M7 18a4 4 0 0 1-.6-7.96A6 6 0 0 1 18 9.5a4.25 4.25 0 0 1-.5 8.5z"/>',exit:'<path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z"/><path d="M14 5v12" stroke-dasharray="2 2.5"/>',
  errs:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21M8.3 8.3l4.4 4.4M12.7 8.3l-4.4 4.4"/>',
  fault:'<path d="M12 3l9 16H3z"/><path d="M12 10v4M12 17h.01"/>',
  sim:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>',
  cards:'<rect x="3" y="6" width="14" height="14" rx="2"/><path d="M7 3h12a2 2 0 0 1 2 2v12"/>',
  order:'<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 5v3M3.2 18h1.8l-1.8 2.2h1.8M3.5 11.2a.9.9 0 1 1 1.3 1.1L3.2 14h1.8"/>',
  match:'<circle cx="5" cy="6" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="19" cy="18" r="2"/><path d="M7 6.5l10 11M7 17.5l10-11"/>',
  prepost:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'};
function renderActs(L,body){
  const off=new Set((Array.isArray(G.ACT_OFF)?G.ACT_OFF:[]).map(String));
  const u=String(G.QUIZ_URL||'').trim().replace(/\/+$/,'');
  const cid=(location.pathname.match(/\/courses\/([^/]+)\//)||[])[1];
  const live=u&&cid?LIVE_ACTS.filter(a=>!off.has(a.k)&&!(a.only&&!a.n(L))):[];
  const join=u&&!off.has('join');
  const href=a=>u+'/host?course='+encodeURIComponent(cid)+'&lesson='+encodeURIComponent(L.id)+(a.type?'&type='+a.type:'');
  let h='<div class="acts">';
  if(live.length||join){
    h+=`<section class="acts-sec"><header class="acts-h"><h2>داخل المحاضرة <small>(يطلقها المدرب)</small></h2><p class="sub">تُفتح على شاشة العرض من حساب المدرب، ويدخل الطلاب من جوالاتهم برمز يظهر على الشاشة.</p></header>`;
    if(live.length)h+=`<div class="act-grid">${live.map(a=>{const n=a.n(L);return `<article class="act-card" data-act="${a.k}"><div class="act-top"><span class="act-ic" aria-hidden="true"><svg viewBox="0 0 24 24">${ACT_ICON[a.k]}</svg></span><h3>${a.t}</h3></div>
      <p>${a.d}</p><p class="act-ready">${n?`جاهز لهذا الدرس: <b>${n}</b> ${a.unit?a.unit(n):AR_N(n,'سؤال','سؤالان','أسئلة','سؤالاً')}`:a.none}</p>
      <a class="btn primary" target="_blank" rel="noopener" href="${esc(href(a))}">${a.b}</a></article>`}).join('')}</div>`;
    if(join)h+=`<p class="act-join">أنت طالب؟ <a target="_blank" rel="noopener" href="${esc(u+'/play')}">دخول نشاط برمز</a></p>`;
    h+='</section>';
  }
  /* ---- للمذاكرة الذاتية ---- */
  const SD=B.STUDY||{units:{},lessons:{}},uid=studyUnit(L.id),U=(SD.units||{})[uid],SL=(SD.lessons||{})[L.id]||{};
  const blocks=[];
  if(!off.has('cards')&&U&&Array.isArray(U.cards)&&U.cards.length)blocks.push({k:'cards',t:'بطاقات المراجعة',d:`بطاقات الوحدة${U.title?`: ${U.title}`:''}. اقرأ الوجه، وتذكّر الجواب، ثم اقلب البطاقة.`});
  if(!off.has('order')&&Array.isArray(SL.order)&&SL.order.length)blocks.push({k:'order',t:'رتّب خطوات التجربة',d:'رتّب الخطوات كما يجب أن تُنفَّذ، ثم اضغط «تحقّق».'});
  if(!off.has('match')&&Array.isArray(SL.match)&&SL.match.length)blocks.push({k:'match',t:'وصّل أطراف الدائرة',d:'صِل كل عنصر في العمود الأول بما يقابله في العمود الثاني.'});
  if(!off.has('prepost')&&Array.isArray(L.quiz)&&L.quiz.length)blocks.push({k:'prepost',t:'اختبار قبل وبعد الدرس',d:'اختياري: نفس الأسئلة قبل الدرس وبعده، لترى كم تحسّن فهمك.',side:1});
  h+=`<section class="acts-sec study"><header class="acts-h"><h2>للمذاكرة الذاتية</h2>${blocks.length?'<p class="sub">تعمل بدون إنترنت، وتقدّمك محفوظ على هذا الجهاز فقط.</p>':''}</header>`;
  if(blocks.length)h+=blocks.map(b=>`<div class="stb${b.side?' side':''}" data-sb="${b.k}"><header class="stb-h"><span class="act-ic" aria-hidden="true"><svg viewBox="0 0 24 24">${ACT_ICON[b.k]}</svg></span><div><h3>${b.t}</h3><p class="sub">${B.ltrU(b.d)}</p></div></header><div class="stb-body"></div></div>`).join('');
  else h+='<div class="act-soon"><b>قريباً</b><span>أنشطة تذاكر بها وحدك داخل الكتاب.</span></div>';
  h+='</section></div>';
  body.innerHTML=h;
  const host=k=>$(`[data-sb="${k}"] .stb-body`,body);
  const run=(k,f)=>{const el=host(k);if(el)try{f(el)}catch(e){console.error(e)}};
  run('cards',el=>studyCards(el,uid,U));
  run('order',el=>SL.order.forEach(it=>{const d=document.createElement('div');d.className='stb-item';el.appendChild(d);studyOrder(d,it,SL.order.length>1)}));
  run('match',el=>SL.match.forEach(it=>{const d=document.createElement('div');d.className='stb-item';el.appendChild(d);studyMatch(d,it,SL.match.length>1)}));
  run('prepost',el=>studyPrePost(el,L));
}
/* رقم الوحدة من رقم الدرس: 'u1-l3' → 'u1'، 'u3b-l1' → 'u3b' */
const studyUnit=id=>{const m=String(id).match(/^(.+?)-l\d+/);return m?m[1]:String(id).split('-')[0]};
const shuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
/* خلط لا يعطي الترتيب الأصلي (إذا كان هناك أكثر من عنصر) */
const shufNew=n=>{const id=[...Array(n).keys()];if(n<2)return id;let a;do{a=shuf(id)}while(a.every((x,i)=>x===i));return a};
/* نص الأنشطة: كل مقطع لاتيني/رقمي فيه رقم (مثل «0-240V / 0-6A» أو «1000 rpm») يُثبَّت LTR كقطعة واحدة؛ لا يلمس SVG ولا المعادلات ولا الوسوم */
const T=s=>String(s==null?'':s).split(/(<svg[\s\S]*?<\/svg>|\$\$[\s\S]*?\$\$|\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]|<[^>]*>)/).map((p,i)=>i%2?p:p.replace(/[A-Za-z0-9(][A-Za-z0-9 .,\/\-–+×()Ω%~]*[A-Za-z0-9)Ω%]/g,m=>/\d/.test(m)&&!/^\(\d+-\d+\)$/.test(m)||/^\(\d+-\d+\)$/.test(m)?`<span class="ltr">${m}</span>`:m)).join('');
const FC_KINDS=[['law','قوانين','قانون'],['symbol','رموز','رمز'],['def','تعاريف','تعريف'],['circuit','رموز دوائر','رمز دائرة']];

/* ---- 6. بطاقات المراجعة ---- */
function studyCards(el,uid,U){
  const KEY=KK('cards-'+uid);
  const cards=U.cards.map(c=>Object.assign({id:(c.k||'')+'|'+c.f},c));
  const kinds=FC_KINDS.filter(([k])=>cards.some(c=>c.k===k));
  let known=new Set((store.get(KEY,[])||[]).filter(x=>typeof x==='string'));
  let filt='all',queue=[],cur=null,flipped=false,armed=0,fresh=false;
  const pool=()=>cards.filter(c=>filt==='all'||c.k===filt);
  const save=()=>store.set(KEY,[...known]);
  const build=()=>{queue=pool().filter(c=>!known.has(c.id));cur=queue.shift()||null;flipped=false};
  const kname=k=>(FC_KINDS.find(x=>x[0]===k)||[])[2]||'';
  const draw=focus=>{
    const P=pool(),nk=P.filter(c=>known.has(c.id)).length,pct=P.length?Math.round(nk/P.length*100):0;
    let h=`<div class="fc">`;
    if(kinds.length>1)h+=`<div class="fc-chips" role="group" aria-label="نوع البطاقات">${[['all','الكل']].concat(kinds).map(([k,t])=>`<button type="button" class="chip" data-k="${k}" aria-pressed="${filt===k}">${t} <small>${k==='all'?cards.length:cards.filter(c=>c.k===k).length}</small></button>`).join('')}</div>`;
    h+=`<div class="fc-prog" aria-live="polite"><span>عرفت <b>${nk}</b> من ${P.length}</span><span class="pbar"><i style="width:${pct}%"></i></span></div>`;
    if(cur){
      h+=`<div class="fc-card${flipped?' back':''}${fresh?' anim':''}" role="button" tabindex="0" aria-label="${flipped?'الوجه الخلفي للبطاقة':'بطاقة: اضغط لقلبها'}">
        <div class="fc-face"><div class="fc-meta"><span class="fc-k">${kname(cur.k)}</span>${flipped&&cur.ref?`<span class="ref">${esc(cur.ref)}</span>`:''}</div>
        ${flipped?`<div class="fc-q">${T(cur.f)}</div><div class="fc-b">${T(cur.b)}</div>`:`<div class="fc-f">${T(cur.f)}</div><p class="fc-hint">اضغط البطاقة (أو مسافة) لترى الجواب</p>`}</div></div>
        <div class="fc-acts">${flipped?`<button type="button" class="btn no" data-a="no">ما عرفتها</button><button type="button" class="btn yes" data-a="yes">عرفتها</button>`:`<button type="button" class="btn primary" data-a="flip">اقلب البطاقة</button>`}</div>
        <p class="fc-left">باقي في هذه الجولة: ${queue.length+1}</p>`;
    } else if(P.length) h+=`<div class="fc-done"><b>أحسنت، عرفت كل البطاقات${filt==='all'?'':' في هذا النوع'}.</b><span>اضغط «ابدأ من جديد» لتراجعها مرة أخرى.</span></div>`;
    h+=`<div class="fc-foot"><button type="button" class="btn" data-a="reset">${armed?'متأكد؟ اضغط مرة ثانية':'ابدأ من جديد'}</button></div></div>`;
    el.innerHTML=h;B.math(el);fresh=false;
    if(focus){const c=$('.fc-card',el)||$('[data-a="reset"]',el);if(c)c.focus({preventScroll:true})}
  };
  const flip=()=>{if(!cur)return;flipped=!flipped;fresh=true;draw(true)};
  const answer=ok=>{if(!cur)return;if(ok){known.add(cur.id);save()}else queue.splice(Math.min(3,queue.length),0,cur);cur=queue.shift()||null;flipped=false;fresh=true;draw(true)};
  el.addEventListener('click',e=>{const t=e.target.closest('[data-k],[data-a],.fc-card');if(!t||!el.contains(t))return;
    if(t.dataset.k){filt=t.dataset.k;armed=0;build();draw();return}
    const a=t.dataset.a;
    if(a==='reset'){if(!armed){armed=1;draw();setTimeout(()=>{if(armed){armed=0;if(el.isConnected)draw()}},3500);return}
      armed=0;pool().forEach(c=>known.delete(c.id));save();build();draw(true);return}
    if(a==='yes')return answer(true);if(a==='no')return answer(false);
    if(a==='flip'||t.classList.contains('fc-card'))flip()});
  el.addEventListener('keydown',e=>{const c=e.target.closest&&e.target.closest('.fc-card');if(c&&(e.key===' '||e.key==='Enter')){e.preventDefault();flip()}});
  build();draw();
}

/* ---- 7أ. رتّب خطوات التجربة ---- */
function studyOrder(el,it,showTitle){
  const S=it.steps||[],n=S.length;let cur=shufNew(n),sel=-1,marks=null,msg='',drag=-1;
  const move=(a,b)=>{if(a===b||a<0||b<0||b>=n)return;const x=cur.splice(a,1)[0];cur.splice(b,0,x);marks=null;msg=''};
  const draw=fp=>{
    el.innerHTML=`${showTitle||it.title?`<h4 class="stb-t">${T(it.title||'')}</h4>`:''}<p class="stb-hint">اضغط خطوة ثم اضغط المكان الذي تريده لها، أو استخدم السهمين<span class="hide-touch">، أو اسحبها بالفأرة</span>.</p>
     <ol class="ord">${cur.map((si,p)=>`<li class="ord-i${sel===p?' sel':''}${marks?marks[p]?' ok':' bad':''}" draggable="true" data-p="${p}">
      <span class="ord-n" aria-hidden="true">${marks?marks[p]?'✓':'✗':p+1}</span><button type="button" class="ord-t" data-p="${p}" aria-pressed="${sel===p}">${T(S[si])}</button>
      <span class="ord-mv"><button type="button" class="ib" data-up="${p}" aria-label="انقلها خطوة لأعلى" ${p===0?'disabled':''}><svg viewBox="0 0 24 24"><path d="M6 15l6-6 6 6"/></svg></button><button type="button" class="ib" data-dn="${p}" aria-label="انقلها خطوة لأسفل" ${p===n-1?'disabled':''}><svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg></button></span></li>`).join('')}</ol>
     <div class="stb-acts"><button type="button" class="btn primary" data-a="check">تحقّق</button><button type="button" class="btn" data-a="show">أظهر الترتيب الصحيح</button><button type="button" class="btn" data-a="mix">أعد الخلط</button></div>
     <p class="stb-msg" aria-live="polite">${msg}</p>`;
    B.math(el);
    if(fp!=null){const b=el.querySelector(fp);if(b)b.focus({preventScroll:true})}
  };
  el.addEventListener('click',e=>{const t=e.target.closest('button');if(!t||!el.contains(t))return;
    if(t.dataset.up!=null){const p=+t.dataset.up;move(p,p-1);sel=-1;draw(`[data-up="${Math.max(1,p-1)}"]`);return}
    if(t.dataset.dn!=null){const p=+t.dataset.dn;move(p,p+1);sel=-1;draw(`[data-dn="${Math.min(n-2,p+1)}"]`);return}
    if(t.classList.contains('ord-t')){const p=+t.dataset.p;if(sel<0)sel=p;else if(sel===p)sel=-1;else{move(sel,p);sel=-1}draw(`.ord-t[data-p="${p}"]`);return}
    const a=t.dataset.a;
    if(a==='check'){marks=cur.map((x,p)=>x===p);const k=marks.filter(Boolean).length;msg=k===n?'<b class="ok">ممتاز، الترتيب كله صحيح.</b>':`<b>${k} من ${n}</b> في مكانها الصحيح. الخطوات المعلّمة بـ ✗ في غير مكانها.`;sel=-1;draw()}
    else if(a==='show'){cur=[...Array(n).keys()];marks=cur.map(()=>true);msg='هذا هو الترتيب الصحيح.';sel=-1;draw()}
    else if(a==='mix'){cur=shufNew(n);marks=null;msg='';sel=-1;draw()}});
  el.addEventListener('dragstart',e=>{const li=e.target.closest&&e.target.closest('.ord-i');if(!li)return;drag=+li.dataset.p;li.classList.add('drag');try{e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',String(drag))}catch(x){}});
  el.addEventListener('dragover',e=>{const li=e.target.closest&&e.target.closest('.ord-i');if(li&&drag>=0){e.preventDefault();$$('.ord-i',el).forEach(x=>x.classList.toggle('over',x===li))}});
  el.addEventListener('drop',e=>{const li=e.target.closest&&e.target.closest('.ord-i');if(li&&drag>=0){e.preventDefault();move(drag,+li.dataset.p);drag=-1;sel=-1;draw()}});
  el.addEventListener('dragend',()=>{drag=-1;$$('.ord-i',el).forEach(x=>x.classList.remove('drag','over'))});
  draw();
}

/* ---- 7ب. وصّل أطراف الدائرة ---- */
const MC=['#2f7dd1','#d9801a','#8a4fd0','#1d9460','#c8372d','#0f8f9a','#a8761b','#c2447a'];
function studyMatch(el,it,showTitle){
  const P=it.pairs||[],n=P.length;let right=shufNew(n),link={},selL=-1,selR=-1,marks=null,msg='';
  const owner=j=>{for(const i in link)if(link[i]===j)return +i;return -1};
  const connect=(i,j)=>{const o=owner(j);if(o>=0)delete link[o];if(link[i]===j&&o===i){delete link[i]}else link[i]=j;selL=selR=-1;marks=null;msg=''};
  const draw=fp=>{const nl=Object.keys(link).length;
    el.innerHTML=`${showTitle||it.title?`<h4 class="stb-t">${T(it.title||'')}</h4>`:''}<p class="stb-hint">اضغط عنصراً من العمود الأول، ثم ما يقابله في العمود الثاني. تأخذ القطعتان المتصلتان اللون والرقم نفسيهما.</p>
     <div class="mt"><div class="mt-col">${P.map((p,i)=>{const j=link[i];const on=j!=null;return `<button type="button" class="mt-i${selL===i?' sel':''}${on?' on':''}${marks?marks[i]?' ok':' bad':''}" data-l="${i}" aria-pressed="${selL===i}" ${on?`style="--mc:${MC[i%MC.length]}"`:''}><span class="mt-n">${i+1}</span><span>${T(p[0])}</span></button>`}).join('')}</div>
     <div class="mt-col">${right.map(j=>{const o=owner(j);const on=o>=0;return `<button type="button" class="mt-i${selR===j?' sel':''}${on?' on':''}" data-r="${j}" aria-pressed="${selR===j}" ${on?`style="--mc:${MC[o%MC.length]}"`:''}><span class="mt-n">${on?o+1:''}</span><span>${T(P[j][1])}</span></button>`}).join('')}</div></div>
     <div class="stb-acts"><button type="button" class="btn primary" data-a="check" ${nl?'':'disabled'}>تحقّق</button><button type="button" class="btn" data-a="reset">إعادة</button><span class="stb-cnt">وصّلت ${nl} من ${n}</span></div>
     <p class="stb-msg" aria-live="polite">${msg}</p>`;
    B.math(el);if(fp){const b=el.querySelector(fp);if(b)b.focus({preventScroll:true})}};
  el.addEventListener('click',e=>{const t=e.target.closest('button');if(!t||!el.contains(t))return;
    if(t.dataset.l!=null){const i=+t.dataset.l;if(selR>=0)connect(i,selR);else selL=selL===i?-1:i;draw(`[data-l="${i}"]`);return}
    if(t.dataset.r!=null){const j=+t.dataset.r;if(selL>=0)connect(selL,j);else selR=selR===j?-1:j;draw(`[data-r="${j}"]`);return}
    if(t.dataset.a==='check'){marks=P.map((p,i)=>link[i]===i);const k=marks.filter(Boolean).length;
      msg=k===n?'<b class="ok">ممتاز، كل التوصيلات صحيحة.</b>':`<b>${k} من ${n}</b> صحيحة.${Object.keys(link).length<n?' بقيت عناصر لم توصلها.':''} العناصر المعلّمة بالأحمر تحتاج تصحيحاً: اضغطها ثم اختر ما يقابلها.`;draw()}
    else if(t.dataset.a==='reset'){link={};selL=selR=-1;marks=null;msg='';right=shufNew(n);draw()}});
  draw();
}

/* ---- 8. اختبار قبل وبعد الدرس ---- */
function studyPrePost(el,L){
  const Q=L.quiz.slice(0,5),N=Q.length,KEY=KK('prepost-'+L.id);
  let st=store.get(KEY,{})||{},mode=null,ans={},done=false;
  const bar=(lab,r)=>`<div class="pp-row"><span class="pp-l">${lab}</span><span class="pbar"><i style="width:${Math.round(r.s/r.n*100)}%"></i></span><b class="pp-s">${r.s} من ${r.n}</b></div>`;
  const draw=()=>{let h='';
    if(!mode){
      if(st.pre||st.post){h+=`<div class="pp-res">${st.pre&&st.post?`<p class="pp-sum">قبل: ${st.pre.s} من ${st.pre.n} — بعد: ${st.post.s} من ${st.post.n}</p>`:''}${st.pre?bar('قبل الدرس',st.pre):''}${st.post?bar('بعد الدرس',st.post):''}
        ${st.pre&&st.post?`<p class="sub">${st.post.s>st.pre.s?`تحسّنت ${(d=>d===1?'بسؤال واحد':d===2?'بسؤالين':`بـ ${d} ${AR_N(d,'','','أسئلة','سؤالاً')}`)(st.post.s-st.pre.s)}.`:st.post.s===st.pre.s?'النتيجة نفسها. راجع الشرح ثم أعد «بعد الدرس».':'النتيجة أقل من قبل. راجع الشرح ثم أعد «بعد الدرس».'}</p>`:st.pre?'<p class="sub">اقرأ الدرس، ثم ارجع هنا وحل «بعد الدرس»: الأسئلة نفسها.</p>':'<p class="sub">لم تحل «قبل الدرس»، فلا توجد مقارنة.</p>'}</div>`}
      else h+=`<p class="pp-intro">${N} ${AR_N(N,'سؤال','سؤالان','أسئلة','سؤالاً')} من «اختبر نفسك». حلها قبل أن تقرأ الدرس، ثم حل الأسئلة نفسها بعد ما تنتهي. لا تظهر الإجابات الصحيحة في «قبل الدرس».</p>`;
      h+=`<div class="stb-acts"><button type="button" class="btn${st.pre?'':' primary'}" data-m="pre">${st.pre?'أعد «قبل الدرس»':'ابدأ: قبل الدرس'}</button><button type="button" class="btn${st.pre&&!st.post?' primary':''}" data-m="post">${st.post?'أعد «بعد الدرس»':'بعد الدرس'}</button>${st.pre||st.post?'<button type="button" class="btn" data-a="clear">امسح النتائج</button>':''}</div>`;
    } else {
      const sc=Q.filter((q,i)=>ans[i]===q.c).length,all=Object.keys(ans).length===N,rev=done&&mode==='post';
      h+=`<p class="pp-mode"><b>${mode==='pre'?'قبل الدرس':'بعد الدرس'}</b> · أجبت ${Object.keys(ans).length} من ${N}</p><div class="quiz pp-q">`+Q.map((q,i)=>`<div class="qq"><h3>${i+1}. ${T(q.q)}</h3><div class="opts">${q.o.map((o,j)=>{let c='';if(rev){if(j===q.c)c=' right';else if(j===ans[i])c=' wrong'}else if(ans[i]===j)c=' picked';
        return `<button type="button" class="opt${c}" data-q="${i}" data-o="${j}" aria-pressed="${ans[i]===j}" ${done?'disabled':''}>${T(o)}</button>`}).join('')}</div>${rev?`<div class="fb show">${ans[i]===q.c?'<b class="ok">صحيحة.</b> ':'<b class="no">ليست هذه.</b> '}${T(q.e||'')}</div>`:''}</div>`).join('')+'</div>';
      if(!done)h+=`<div class="stb-acts"><button type="button" class="btn primary" data-a="submit" ${all?'':'disabled'}>أنهِ وأظهر النتيجة</button><button type="button" class="btn" data-a="cancel">إلغاء</button></div>`;
      else h+=`<div class="pp-res">${mode==='pre'?`<p class="pp-sum">نتيجتك قبل الدرس: ${sc} من ${N}</p><p class="sub">لن نعرض الإجابات الآن حتى تبقى المقارنة صادقة. اقرأ الدرس ثم حل «بعد الدرس».</p>`:`${st.pre?`<p class="pp-sum">قبل: ${st.pre.s} من ${st.pre.n} — بعد: ${sc} من ${N}</p>${bar('قبل الدرس',st.pre)}`:''}${bar('بعد الدرس',{s:sc,n:N})}`}</div><div class="stb-acts"><button type="button" class="btn primary" data-a="back">تم</button></div>`;
    }
    el.innerHTML=h;B.math(el)};
  el.addEventListener('click',e=>{const t=e.target.closest('button');if(!t||!el.contains(t))return;
    if(t.dataset.m){mode=t.dataset.m;ans={};done=false;draw();el.closest('.stb').scrollIntoView({block:'start',behavior:'smooth'});return}
    if(t.dataset.q!=null){ans[+t.dataset.q]=+t.dataset.o;draw();return}
    const a=t.dataset.a;
    if(a==='submit'){const sc=Q.filter((q,i)=>ans[i]===q.c).length;st[mode]={s:sc,n:N,t:Date.now()};store.set(KEY,st);done=true;draw()}
    else if(a==='cancel'||a==='back'){mode=null;done=false;draw()}
    else if(a==='clear'){st={};store.set(KEY,st);draw()}});
  draw();
}

/* ---------------- وضع التحدي: المختبر وحده داخل صفحة النشاط على جوال الطالب ----------------
 تفتحه صفحة الطالب في خادم النشاط داخل iframe: courses/<id>/index.html?ch=1#<lesson>
 الرسائل (postMessage) بين الصفحتين:
   المختبر ← {ch:'hello',lesson}            عند التحميل
   الأب   → {ch:'init',mode:'fault'|'sim',fault:id|null,lock:[{k,v}],mv:{معرف:{k:رقم}}|null}   مرة واحدة: يُرسم المختبر بقيم الآلة (mv: ما غيّره المدرب، وإلا القيم التوضيحية) ويُطبَّق العطل والقيم الثابتة
   المختبر ← {ch:'ready',outputs:[{k,label,unit,dp}]}
   الأب   → {ch:'get',id}  ⇒  المختبر ← {ch:'vals',id,vals:{k:رقم أو null}}   القراءات كما تظهر على أجهزة القياس
 لا شيء من هذا يحدث خارج ?ch=1. */
const CHQ=(()=>{try{return new URLSearchParams(location.search).get('ch')==='1'}catch(e){return false}})();
/* قراءة رقم كما يظهر على جهاز القياس: أرقام عربية-هندية، فاصلة الآلاف، «× 10ⁿ» و ×10^n و e-notation، ثم البادئة مع الوحدة
   (p n µ/μ/u m k M G) تُحوَّل إلى وحدة القراءة في challenge.js (unit): «12.5 nF» مع unit:'pF' ⇐ 12500. بلا وحدة مكتوبة أو بوحدة أخرى ⇐ الرقم كما هو. */
const CH_PFX={p:-12,n:-9,'µ':-6,'μ':-6,u:-6,m:-3,k:3,K:3,M:6,G:9};
const CH_SUP={'⁰':0,'¹':1,'²':2,'³':3,'⁴':4,'⁵':5,'⁶':6,'⁷':7,'⁸':8,'⁹':9};
const chClean=t=>String(t==null?'':t).replace(/[‎‏‪-‮⁦-⁩   ]/g,' ').replace(/[−–]/g,'-').replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/٫/g,'.').replace(/٬/g,',');
function chParse(t,unit){
  t=chClean(t);
  const m=t.match(/(-?)(\d{1,3}(?:,\d{3})+(?!\d)|\d+(?:\.\d+)?|\.\d+)/);if(!m)return null;
  let v=+(m[2].replace(/,/g,''));if(m[1]==='-')v=-v;
  let rest=t.slice(m.index+m[0].length);
  const sup=s=>{let x=0;for(const c of s)x=x*10+CH_SUP[c];return x};
  let e;
  if((e=rest.match(/^\s*[×x✕*·]\s*10\s*(?:\^\s*\(?\s*([+-]?)\s*(\d+)\s*\)?|([⁻⁺]?)([⁰¹²³⁴⁵⁶⁷⁸⁹]+))/))){const n=e[2]!=null?(e[1]==='-'?-1:1)*+e[2]:(e[3]==='⁻'?-1:1)*sup(e[4]);v*=Math.pow(10,n);rest=rest.slice(e[0].length)}
  else if((e=rest.match(/^[eE]([+-]?\d+)(?![A-Za-z])/))){v*=Math.pow(10,+e[1]);rest=rest.slice(e[0].length)}
  else if(m[2]==='10'&&(e=rest.match(/^([⁻⁺]?)([⁰¹²³⁴⁵⁶⁷⁸⁹]+)/))){v=(v<0?-1:1)*Math.pow(10,(e[1]==='⁻'?-1:1)*sup(e[2]));rest=rest.slice(e[0].length)}
  const u=String(unit==null?'':unit).trim();
  if(u){const tk=(rest.match(/^\s*([^\s\d()\[\]{},،;:=<>]+)/)||[])[1];
    if(tk&&tk!==u){const nu=x=>x.replace(/μ/g,'µ'),T=nu(tk),U=nu(u);
      if(T!==U){const pe=x=>CH_PFX[x[0]]!=null&&x.length>1?[CH_PFX[x[0]],x.slice(1)]:[0,x];
        const [a,ba]=pe(T),[c,bc]=pe(U);
        if(ba===bc&&a!==c)v*=Math.pow(10,a-c);
        else if(ba===U&&a)v*=Math.pow(10,a);          // «2.5 kΩ» ووحدة القراءة Ω
        else if(T===bc&&c)v*=Math.pow(10,-c)}}}         // «0.025 A» ووحدة القراءة mA
  return isFinite(v)?+v.toPrecision(12):null}
const chNum=t=>chParse(t,'');
const chNorm=t=>String(t||'').replace(/[‎‏⁦-⁩]/g,'').replace(/\s+/g,' ').trim();
/* مكان القراءة في challenge.js (لكل قراءة واحد منها):
     m:'حاوية|بداية اسم القراءة'  ('=' أول الاسم للاسم الكامل؛ يُقسم عند أول «|» فقط، فالاسم نفسه قد يحتوي «|»)
     m:{box,label,exact}         الشكل نفسه كائناً (للأسماء التي فيها رموز)
     sel:'#id' أو أي CSS          العنصر نفسه (نصه، أو قيمته إن كان حقلاً) — للقراءات التي يتغير اسمها (متقدم/متأخر، أسهم…)
     read:(B,root)=>رقم|نص       دالة قراءة خاصة بالدرس (الأولوية لها)
   unit: وحدة القراءة (يُحوَّل إليها «k/m/µ…» المكتوب على الجهاز)، conv:false = بلا تحويل */
function chRead(o){
  const root=document.getElementById('view')||document;
  const val=x=>x==null?null:typeof x==='number'?(isFinite(x)?x:null):chParse(x,o.conv===false?'':o.unit);
  if(typeof o.read==='function'){try{return val(o.read(B,root))}catch(e){console.error(e);return null}}
  const txt=el=>el?(/^(INPUT|SELECT|TEXTAREA|OUTPUT)$/.test(el.tagName)?el.value:el.textContent):null;
  if(o.sel){const el=document.querySelector(o.sel);return el?val(txt(el)):null}
  let c,lb,ex=false;
  if(o.m&&typeof o.m==='object'){c=o.m.box;lb=o.m.label;ex=!!o.m.exact}
  else{const s=String(o.m||''),i=s.indexOf('|');if(i<0)return null;c=s.slice(0,i);lb=s.slice(i+1);if(lb[0]==='='){ex=true;lb=lb.slice(1)}}
  const box=c&&document.querySelector(c);if(!box||lb==null)return null;
  const want=chNorm(lb);
  for(const mt of box.children){const s=mt.querySelector('span'),b=mt.querySelector('b');if(!s||!b)continue;const t=chNorm(s.textContent);if(ex?t===want:t.startsWith(want))return val(b.textContent)}
  return null}
/* عنوان لوحة المقارنة («بيانات الآلة السليمة»…): refTitle للدرس في challenge.js، أو للمقرر (PLCBOOK.chal({...},{refTitle})), وإلا حسب نوع المقرر */
const CH_REFT={'circuits-1':'قراءات الدائرة السليمة','circuits-2':'قراءات الدائرة السليمة','control-lab':'قراءات النظام السليم','plc':'قراءات النظام السليم'};
B.chCourse=()=>(location.pathname.match(/\/courses\/([^/]+)\//)||[])[1]||'';
B.chRefTitle=id=>{const sp=B.CHAL[id]||{};return sp.refTitle||B.CHALCFG.refTitle||CH_REFT[B.chCourse()]||'بيانات الآلة السليمة'};
/* المختبر الذي يصلح لوضع التحدي: مختبر مخصص (L.lab) أو «منضدة البرنامج» العامة (البرنامج / الجهاز) */
B.chLab=L=>!!(L&&(L.lab||L.program||L.plant||L.variants));
function renderChallenge(L){
  stopRun();document.body.classList.add('ch-mode');document.body.classList.remove('in-lesson');document.body.dataset.tab='lab';
  const root=$('#view'),spec=B.chLab(L)&&B.CHAL[L.id];
  const par=window.parent!==window?window.parent:null;
  const post=(m,o)=>{if(par)try{par.postMessage(m,o||'*')}catch(e){}};
  if(!spec){root.innerHTML='<div class="ch-msg"><b>هذا الدرس ليس له مختبر لهذا النشاط.</b></div>';post({ch:'error',msg:'nolab'});return}
  if(renderChallenge.done)return;renderChallenge.done=true;   // صفحة واحدة لكل نشاط: لا نعيد الرسم عند تغير العنوان
  root.innerHTML=`<div class="ch-msg"><span class="ch-spin" aria-hidden="true"></span>جارٍ تجهيز المختبر…</div>`;
  if(!par){root.innerHTML='<div class="ch-msg"><b>هذه الصفحة تُفتح من نشاط المدرب</b><span>ادخل النشاط برمز من شاشة المدرب.</span></div>';return}
  const custom=!!L.lab&&!L.program&&!L.plant;
  let started=false;
  const start=(m,origin)=>{
    CH.on=true;CH.mv=chMV(m.mv);CH.mode=m.mode==='fault'?'fault':'sim';CH.fault=CH.mode==='fault'?(spec.faults||[]).find(f=>f.id===m.fault)||null:null;
    root.innerHTML=`<div class="ch-top"><span class="ch-k">${L.unit}.${L.order}</span><b>${L.title}</b></div><div id="ch-ref"></div>${custom?'':'<div id="ch-strip"></div>'}<div id="custom-lab"${custom?'':' class="ch-std"'}></div>`;
    /* hide: في النشاطين · hideFault: في «اكتشف العطل» فقط · hideSim: في «تحدي المحاكاة» فقط */
    const css=[...(spec.hide||[]),...(CH.mode==='fault'?spec.hideFault||[]:spec.hideSim||[])].map(s=>s+'{display:none!important}');
    if(custom){try{L.lab($('#custom-lab'),B)}catch(e){console.error(e)}}
    else{ /* «منضدة البرنامج»: لوحة التشغيل + الجهاز + البرنامج الحي معاً. spec.variant = نسخة البرنامج (مثل المصحح)، spec.variants:true = يبقى اختيار النسخة ظاهراً */
      if(L.variants){const ks=Object.keys(L.variants).filter(k=>!['default','note','title'].includes(k));if(spec.variant&&ks.includes(spec.variant))L._variant=spec.variant}
      CH.varSel=!!spec.variants;
      try{RUN=createRuntime(L);RUN.attach('ch',$('#custom-lab'),$('#ch-strip'))}catch(e){console.error(e)}}
    B.math(root);
    /* بيانات الآلة السليمة للمقارنة: من نموذج المختبر نفسه (CH.healthy = أرقام الآلة قبل العطل) بقيم هذا النشاط */
    const refs=(spec.ref||[]).map(r=>{const D=CH.defs[r.id]||[],H=CH.healthy[r.id]||{};return r.keys.map(k=>D.find(d=>d.k===k)).filter(Boolean).map(d=>({d,v:H[d.k]!=null?H[d.k]:d.value}))}).flat();
    if(refs.length)$('#ch-ref').innerHTML=`<details class="ch-ref"><summary>${esc(B.chRefTitle(L.id))} (للمقارنة)</summary><table>${refs.map(({d,v})=>`<tr><th>${d.label}</th><td><span class="ltr">${fmtN(v)}${d.unit?' '+d.unit:''}</span></td></tr>`).join('')}</table><p class="sub">${CH.mv?'أرقام حددها المدرب لهذا النشاط: هي الأرقام في المختبر وهي سليمة.':'أرقام توضيحية: هي الأرقام في المختبر وهي سليمة.'}</p></details>`;
    /* المدخلات الثابتة بقرار المدرب: تُضبط ثم تُقفل. الترتيب: الأزرار والاختيارات والمفاتيح أولاً (قد تغيّر حدود المنزلقات أو خطوتها)، ثم المنزلقات والحقول الرقمية،
       ثم تُعاد المنزلقات والحقول بعد لحظة (إذا أعاد المختبر رسمها أو قصّ قيمتها بعد تغيير الوضع) */
    const lock=(Array.isArray(m.lock)?m.lock:[]).map(x=>({x,inp:(spec.inputs||[]).find(i=>i.k===x.k)})).filter(o=>o.inp);
    const ord={pick:0,switch:1,range:2};
    const fire=(el,v)=>{if(el.tagName==='SELECT'){el.value=String(v)}else el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}))};
    /* منزلق خطوته في هذا الوضع أكبر من خطوة المدخل في challenge.js (فيقص القيمة الثابتة): نعطيه خطوة challenge.js، ولا نغيّر حدوده */
    const fitStep=(r,inp,v)=>{if(r.type==='range'&&inp.step&&r.step!=='any'){r.value=v;if(Math.abs(+r.value-+v)>1e-9&&+v>=+(r.min||0)&&+v<=+(r.max||100))r.step=String(inp.step)}};
    const setRange=(inp,x)=>{const r=$(inp.sel);if(r){fitStep(r,inp,x.v);fire(r,x.v)}};
    lock.sort((a,b)=>(ord[a.inp.kind]||0)-(ord[b.inp.kind]||0)).forEach(({x,inp})=>{try{
      if(inp.noset){}   // مدخل يُقفل على حاله فقط (مثل أزرار عكس الأطراف)
      else if(inp.kind==='range')setRange(inp,x);
      else if(inp.kind==='switch'){const b=$(inp.sel);if(b){if(b.tagName==='INPUT'&&/checkbox|radio/.test(b.type)){if(b.checked!==!!x.v)b.click()}else if((b.getAttribute('aria-pressed')==='true')!==!!x.v)b.click()}}
      else if(inp.kind==='pick'){const s=String(inp.sel);
        if(!s.includes('{v}')){const e=$(s);if(e&&(e.tagName==='SELECT'||e.tagName==='INPUT'))fire(e,x.v)}
        else{const b=$(s.replace('{v}',String(x.v)));if(b){if(b.tagName==='OPTION'){const se=b.closest('select');if(se)fire(se,b.value)}else if(b.tagName==='INPUT'&&/checkbox|radio/.test(b.type)){if(!b.checked)b.click()}else b.click()}}}
      css.push(String(inp.ctl||inp.sel).split(',').map(s=>'#custom-lab '+s.trim().replace('{v}','')).join(',')+'{pointer-events:none!important;opacity:.42;filter:grayscale(1)}');
    }catch(e){console.error(e)}});
    const again=()=>lock.filter(o=>o.inp.kind==='range'&&!o.inp.noset).forEach(({x,inp})=>{try{const r=$(inp.sel);if(r&&Math.abs(+r.value-+x.v)>1e-9){fitStep(r,inp,x.v);fire(r,x.v)}}catch(e){console.error(e)}});
    if(lock.some(o=>o.inp.kind==='range')){setTimeout(again,60);setTimeout(again,400)}
    const st=document.createElement('style');st.textContent=css.join('\n');document.head.appendChild(st);
    if(lock.length){const n=document.createElement('p');n.className='ch-locknote';n.textContent='المدخلات الباهتة ثابتة بقرار المدرب.';$('#custom-lab').prepend(n)}
    post({ch:'ready',outputs:(spec.outputs||[]).map(o=>({k:o.k,label:o.label,unit:o.unit||'',dp:o.dp|0}))},origin);
  };
  window.addEventListener('message',e=>{if(e.source!==par)return;const m=e.data;if(!m||typeof m!=='object')return;
    if(m.ch==='init'&&!started){started=true;start(m,e.origin)}
    else if(m.ch==='get'&&started){const vals={};(spec.outputs||[]).forEach(o=>{const v=chRead(o);vals[o.k]=v!=null&&isFinite(v)?v:null});post({ch:'vals',id:m.id,vals},e.origin)}});
  post({ch:'hello',lesson:L.id});
}
B.chParse=chParse;

/* ---------------- ROUTER ---------------- */
function route(){
  const h=(location.hash||'').replace('#','');
  const L=B.LESSONS.find(l=>l.id===h);
  if(CHQ)return renderChallenge(L);
  if(L){renderLesson(L)}else{stopRun();document.body.classList.remove('in-lesson');delete document.body.dataset.tab;renderHome()}
}
/* book-vs-corrected inline switch: <div class="seg"><button data-bkfix="k" data-bkv="book">…<button data-bkfix="k" data-bkv="fixed">…</div>; content: class bkb / bkf with data-bk="k" */
B.bkOn=k=>document.documentElement.getAttribute('data-bk-'+k)==='fixed';
B.bkCtl=(k,lbl)=>{const f=B.bkOn(k);return `<span class="bkctl">${lbl?`<span class="sub">${lbl}</span>`:''}<span class="seg" role="group"><button data-bkfix="${k}" data-bkv="book" aria-pressed="${!f}">كما في الكتاب</button><button data-bkfix="${k}" data-bkv="fixed" aria-pressed="${f}">المصحح</button></span></span>`};
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-bkfix]');if(!b)return;const k=b.dataset.bkfix,f=b.dataset.bkv==='fixed';
  if(!document.getElementById('bkst-'+k)){const st=document.createElement('style');st.id='bkst-'+k;const h=`html[data-bk-${k}="fixed"]`;
    st.textContent=`${h} .bkf:not(.fx-chip)[data-bk="${k}"]{display:inline}${h} .bkf.blk:not(.fx-chip)[data-bk="${k}"]{display:block}${h} .bkb[data-bk="${k}"]{display:none}html[data-hidefix][data-bk-${k}="fixed"] .fx-chip.bkf[data-bk="${k}"]{display:block}html[data-hidefix][data-bk-${k}="fixed"] span.fx-chip.bkf:not(.blk)[data-bk="${k}"]{display:inline-block}${h} .seg button[data-bkfix="${k}"][data-bkv="fixed"]{background:var(--blue);color:#fff}${h} .seg button[data-bkfix="${k}"][data-bkv="book"]{background:var(--surface);color:var(--muted)}`;document.head.appendChild(st)}
  document.documentElement.setAttribute('data-bk-'+k,f?'fixed':'book');
  document.querySelectorAll(`[data-bkfix="${k}"]`).forEach(x=>x.setAttribute('aria-pressed',String((x.dataset.bkv==='fixed')===f)))});
/* hideable correction notes: any element with class "fixnote" (the explanation that the book is wrong, shown in «المصحح»)
   gets a small «إخفاء الشرح» button; when hidden (remembered on this device for the whole site) a small «لماذا؟» chip shows instead */
(function(){
  const KEY='elib-hidefix';let hid=false;try{hid=localStorage.getItem(KEY)==='1'}catch(e){}
  const apply=()=>document.documentElement.toggleAttribute('data-hidefix',hid);apply();
  const deco=root=>{(root.querySelectorAll?root:document).querySelectorAll('.fixnote:not([data-fx])').forEach(n=>{n.setAttribute('data-fx','1');
    const b=document.createElement('button');b.type='button';b.className='fx-hide';b.textContent='إخفاء الشرح';b.title='إخفاء شروح التصحيح في كل الموقع';n.appendChild(b);
    const c=document.createElement(n.tagName==='SPAN'?'span':'div');c.className='fx-chip';c.innerHTML='<button type="button" class="fx-show">لماذا؟</button>';if(n.classList.contains('bkf')){c.classList.add('bkf');if(n.classList.contains('blk'))c.classList.add('blk');c.dataset.bk=n.dataset.bk}n.parentNode.insertBefore(c,n)})};
  const set=v=>{hid=v;try{localStorage.setItem(KEY,v?'1':'0')}catch(e){}apply()};
  document.addEventListener('click',e=>{if(!e.target.closest)return;if(e.target.closest('.fx-hide')){set(true)}else if(e.target.closest('.fx-show')){set(false)}});
  new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes)if(n.nodeType===1){if(n.matches&&n.matches('.fixnote'))deco(n.parentNode||document);else if(n.querySelector&&n.querySelector('.fixnote'))deco(n)}}).observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('DOMContentLoaded',()=>deco(document));
})();
/* mini-lab facts: Arabic-only values read right-to-left (values are styled ltr for numbers) */
(function(){
  const AR=/[؀-ۿ]/,DG=/[0-9٠-٩]/;
  function fix(root){(root.querySelectorAll?root:document).querySelectorAll('.ml-facts b').forEach(b=>{const t=b.textContent;const r=AR.test(t)&&!DG.test(t);if(r&&b.dir!=='rtl')b.dir='rtl';else if(!r&&b.dir==='rtl')b.removeAttribute('dir')})}
  let q=0;new MutationObserver(()=>{if(q)return;q=1;requestAnimationFrame(()=>{q=0;fix(document)})}).observe(document.documentElement,{childList:true,subtree:true,characterData:true});
})();
B.start=function(){window.addEventListener('hashchange',route);route()};
})(window);
