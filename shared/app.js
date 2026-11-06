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
  const tabs=[['theory','الشرح'],hasLab&&['lab','المختبر'],hasProg&&['plc','برنامج الـ PLC'],L.examples&&L.examples.length&&['examples','الأمثلة المحلولة'],L.quiz&&L.quiz.length&&['quiz','اختبر نفسك']].filter(Boolean);
  tab=tabs.find(t=>t[0]===tab)?tab:'theory';
  const seen=store.get(KK('seen'),{});const done=store.get(KK('done'),{});
  const ul=all.filter(x=>x.unit===L.unit);
  const ICON={theory:'<path d="M4 5h7a3 3 0 0 1 3 3v11a2 2 0 0 0-2-2H4zM20 5h-4" />',lab:'<path d="M9 3v6l-5 9a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-5-9V3M8 3h8"/>',plc:'<path d="M4 4v16M20 4v16M4 12h4M16 12h4M9 8v8M12 8v8"/>',examples:'<path d="M5 3h14v18H5zM8 7h8M8 11h3M13 11h3M8 15h3M13 15h3"/>',quiz:'<path d="M9 9a3 3 0 1 1 4 2.8c-.6.3-1 .9-1 1.5V14M12 18h.01"/><circle cx="12" cy="12" r="9"/>'};
  root.innerHTML=`<div class="lesson-layout">
   <aside class="lside" aria-label="دروس الوحدة"><a class="lside-back" href="#home">‹ فهرس المقرر</a>
    <div class="lside-unit"><span class="unum sm">${L.unit}</span><div><small>الوحدة ${AR[L.unit]}</small><b>${u.title}</b></div></div>
    <ol>${ul.map(x=>`<li><a href="#${x.id}" class="${x===L?'on':''} ${done[x.id]?'done':seen[x.id]?'seen':''}"><span class="k">${x.unit}.${x.order}</span><span>${x.title}</span></a></li>`).join('')}</ol>
    <details class="lside-more"><summary>الوحدات الأخرى</summary><ul>${B.UNITS.filter(x=>x.n!==L.unit).map(x=>{const f=all.find(y=>y.unit===x.n);return f?`<li><a href="#${f.id}"><span class="k">${x.n}</span>${x.title}</a></li>`:''}).join('')}</ul></details>
   </aside>
   <div class="lmain">
   <div class="crumbs"><a href="#home">الفهرس</a> › <a href="#home" data-unit="${L.unit}">الوحدة ${AR[L.unit]}</a></div>
   <header class="lesson-head"><div class="eyebrow">الدرس ${L.unit}.${L.order} · ص ${L.pages}</div><h1>${L.title}</h1>${L.summary?`<p class="lead">${L.summary}</p>`:''}</header>
   <nav class="ltabs" role="tablist">${tabs.map((t,k)=>`<button role="tab" data-tab="${t[0]}" aria-selected="${t[0]===tab}">${t[1]}</button>`).join('')}</nav>
   <div id="strip-host"></div>
   <div id="tab-body"></div>
   <div class="finish"><button class="fin-btn" id="finBtn" aria-pressed="${done[L.id]?'true':'false'}"></button><p class="sub" id="finNote"></p></div>
   <nav class="pager">${prev?`<a href="#${prev.id}" class="pg prev"><small>السابق</small>${prev.title}</a>`:'<span></span>'}${next?`<a href="#${next.id}" class="pg next"><small>التالي</small>${next.title}</a>`:'<span></span>'}</nav>
   </div></div>
   <nav class="bnav" role="tablist">${tabs.map(t=>`<button role="tab" data-tab="${t[0]}" aria-selected="${t[0]===tab}"><svg viewBox="0 0 24 24" aria-hidden="true">${ICON[t[0]]}</svg>${t[0]==='plc'?'البرنامج':t[0]==='quiz'?'اختبر':t[0]==='examples'?'الأمثلة':t[1]}</button>`).join('')}</nav>`;
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
function renderTheory(L,body){
  let h='<article class="theory">';
  (L.theory||[]).forEach(b=>{
    if(b.h) h+=`<h2 class="th">${b.h}${b.ref?` <span class="ref">${b.ref}</span>`:''}</h2>`;
    if(b.fig||b.draw) h+=figHTML(L,b);
    else if(b.note) h+=`<div class="callout">${b.note}</div>`;
    else if(b.err) h+=`<div class="callout err"><b>ملاحظة على الكتاب:</b> ${b.err}</div>`;
    else if(b.widget){h+=`<div class="widget" data-w="${(L.theory.indexOf(b))}"></div>`}
    else if(b.html) h+=`<div class="prose">${b.html}</div>`;
  });
  h+='</article>';
  body.innerHTML=h;
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
  const st={plc:P,plant,t,btn:id=>btn[id]?1:0,
    I:a=>P.get(a.replace(/\s+/g,'')),Q:a=>P.get(a.replace(/\s+/g,'')),M:a=>P.get(a.replace(/\s+/g,'')),
    T:a=>P.tim[a]||{q:0,el:0,tv:0,run:0},C:a=>P.cnt[a]||{v:0},
    get:a=>P.get(a.replace(/\s+/g,''))};
  // name resolution for control circuits: lesson.ctrlMap name -> 'btn:ID' | address | fn
  st.name=nm=>{const m=(L.ctrlMap||{})[nm];if(m===undefined){if(btn[nm]!==undefined)return btn[nm]?1:0;return 0}
    if(typeof m==='function')return m(st)?1:0; if(String(m).startsWith('btn:'))return btn[m.slice(4)]?1:0; return P.get(m)};
  st.variant=L._variant;
  return st;
}

/* ---------------- RUNTIME (lab + plc tabs) ---------------- */
function createRuntime(L){
  const R={};let P=createPLC(curProgram(L));R.plc=P;
  L._names={};(L.io||[]).forEach(r=>{if(r.addr)L._names[r.addr.replace(/\s+/g,'')]=r.sym});
  const btn={},latch={},pressT={};(L.inputs||[]).forEach(i=>{btn[i.id]=i.initial?1:0});
  let plant=L.plant&&L.plant.init?L.plant.init():{};
  let t=0,hist=[],histT=0,slow=false,phase=-1,phaseT=0,view='lad',raf=0,mode=null,el=null,stripEl=null,lastSig='',stepI=0;
  const st=()=>makeState(L,P,Object.assign({},btn,latchOn()),plant,t);
  function latchOn(){const o={};for(const k in latch)if(latch[k])o[k]=1;return o}
  function writeInputs(){
    (L.inputs||[]).forEach(i=>{if(!i.addr)return;let v=(btn[i.id]||latch[i.id])?1:0;
      if(i.type==='sensor'&&i.from){v=i.from(st())?1:0;if(btn['__ovr_'+i.id]!==undefined)v=btn['__ovr_'+i.id]}
      if(i.invert)v=1-v;P.set(i.addr.replace(/\s+/g,''),v)});
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
    stripEl.innerHTML=stripHTML();wireStrip();
    if(mode==='lab') el.innerHTML=labHTML(); else el.innerHTML=plcHTML();
    wireBody();lastSig='';renderSteps();render(true);
  }
  function variantSeg(){if(!L.variants)return '';const ks=Object.keys(L.variants).filter(k=>k!=='default'&&k!=='note'&&k!=='title');const cur=L._variant||L.variants.default||ks[0];
    return `<div class="variant"><span>${L.variants.title||'نسخة البرنامج:'}</span><div class="seg" role="group">${ks.map(k=>`<button data-var="${k}" aria-pressed="${k===cur}">${L.variants[k].label}</button>`).join('')}</div>${L.variants.note?`<p class="sub">${L.variants.note}</p>`:''}${L.variants[cur].note?`<div class="callout err">${L.variants[cur].note}</div>`:''}</div>`}
  function stripHTML(){
    const ins=(L.inputs||[]).filter(i=>i.type!=='sensor'||i.manual);
    const outs=(L.io||[]).filter(r=>r.addr&&/^Q/.test(r.addr.replace(/\s+/g,'')));
    return `<div class="strip console"><div class="con-head"><span>لوحة التشغيل</span>${L.steps&&L.steps.length?'<span class="task" id="taskNow"></span>':''}</div><div class="wrap-in">
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
    if(L.ctrl) h+=`<div class="panel sheet c7"><h2>دائرة التحكم التقليدية</h2><p class="sub">تابع أين يصل الجهد مع كل ضغطة.</p><div class="svgbox ctrlbox" id="ctrlSvg"></div>${tb(L.ctrlRef)}</div>`;
    if(L.steps&&L.steps.length) h+=`<div class="panel ${L.ctrl?'c5':'c12'}"><h2>التجربة خطوة بخطوة</h2><p class="sub">استخدم ضواغط لوحة التشغيل. اضغط مطوّلاً أو انقر.</p><ol class="steps" id="steps"></ol></div>`;
    if(!L.ctrl&&!L.power&&!p) h+=`<div class="panel c12"><h2>البرنامج يعمل الآن</h2><div id="miniLad"></div></div>`;
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
    if(stripEl){$$('.lamp',stripEl).forEach(l=>l.classList.toggle('on',!!P.get(l.dataset.q)));
      const rd=$('#reads',stripEl);if(rd&&L.plant&&L.plant.readouts){rd.innerHTML=L.plant.readouts.map(r=>{if(r.chip){const [txt,cls]=r.chip(plant,s);return `<div class="read"><span>${r.l}</span><em class="mode-chip ${cls||''}">${txt}</em></div>`}return `<div class="read"><span>${r.l}</span><b>${r.v(plant,s)}</b></div>`}).join('')}}
    if(!el)return;
    if(mode==='lab'){
      if(L.plant&&L.plant.view==='motor'){const r=$('#rotor',el);if(r)r.setAttribute('transform',`rotate(${(plant.ang||0).toFixed(1)} 75 75)`)}
      if(L.plant&&L.plant.frame)L.plant.frame($('#plantView',el)||$('#plantExtra',el),s,plant,B);
      if(L.plant&&L.plant.chart){const c=$('#plantChart',el);if(c)W.chart(c,hist,Object.assign({now:t,series:[{key:L.plant.chart.key,color:'--blue'}].concat(L.plant.chart.series||[])},L.plant.chart))}
      if(L.steps){const cur=L.steps[stepI];if(cur&&cur.done&&cur.done(s)){stepI++;renderSteps()}}
    }
    const sg=sig();if(sg===lastSig&&!force)return;lastSig=sg;
    if(mode==='lab'){
      const pw=$('#powerSvg',el);if(pw&&L.power)pw.innerHTML=L.power(s,B);
      const cs=$('#ctrlSvg',el);if(cs&&L.ctrl)cs.innerHTML=ctrlCircuit(L.ctrl,s.name,L.ctrlCoil?((nm,f)=>L.ctrlCoil(nm,f,s)):null);
      if(L.plant&&L.plant.render){const pv=$('#plantView',el)||$('#plantExtra',el);if(pv)L.plant.render(pv,s,plant,B)}
      const lb=$('#plantLabel',el);if(lb&&L.plant&&L.plant.label)lb.textContent=L.plant.label(plant,s);
      const ml=$('#miniLad',el);if(ml)ml.innerHTML=P.nets.map(n=>`<div class="net"><header><h3>${n.title||'Network '+(n.i+1)}</h3></header><div class="svgbox fixed">${ladNetwork(n,P,L._names)}</div></div>`).join('');
    } else {
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
 const compute=()=>{P.trainer=!!st.on;P.v=dflt();if(st.on)defs.forEach(d=>{if(st.vals[d.k]!=null)P.v[d.k]=clampD(d,st.vals[d.k])})};
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
B.round=(x,dp)=>{const p=Math.pow(10,dp||0);return Math.round(x*p)/p};
const fmtN=(v,dp)=>{if(typeof v!=='number'||!isFinite(v))return v==null?'':String(v);return (dp==null?+v.toPrecision(6):B.round(v,dp)).toLocaleString('en-US',{useGrouping:false,maximumFractionDigits:dp==null?6:dp,minimumFractionDigits:dp==null?0:dp})};
B.fmtN=fmtN;
/* ---------------- WORKED EXAMPLES ----------------
 L.examples=[{title,ref,q:html,given:[{id,label,sym,unit,value,step,min,max}],solve:(g,B)=>[{t:html,f:latex,v:number|string,unit,dp,final:bool}],note}] */
function renderExamples(L,body){
  body.innerHTML='<div class="exs">'+L.examples.map((x,i)=>`<section class="ex" data-i="${i}"><header><h2>${x.title}</h2>${x.ref?`<span class="ref">${x.ref}</span>`:''}</header>
   <div class="ex-q">${x.q||''}</div>
   ${x.given&&x.given.length?`<div class="ex-given"><div class="ex-gh"><b>المعطيات</b><span class="sub">غيّر الأرقام وشاهد الحل يتغير</span><button class="btn" data-reset>قيم الكتاب</button></div><div class="ex-grid">${x.given.map(g=>`<label class="ex-in"><span>${g.label}${g.sym?` <span class="ltr">${B.tex(g.sym)}</span>`:''}</span><span class="ex-inbox"><input type="number" inputmode="decimal" step="${g.step||'any'}" ${g.min!=null?`min="${g.min}"`:''} ${g.max!=null?`max="${g.max}"`:''} data-g="${g.id}" value="${g.value}" id="ex${i}-${g.id}"><em>${g.unit||''}</em></span></label>`).join('')}</div></div>`:''}
   <ol class="ex-steps"></ol>${x.note?`<div class="callout">${x.note}</div>`:''}</section>`).join('')+'</div>';
  $$('.ex',body).forEach(sec=>{const x=L.examples[+sec.dataset.i];
    const run=()=>{const g={};$$('[data-g]',sec).forEach(inp=>{g[inp.dataset.g]=parseFloat(inp.value)});
      const book=x.given?x.given.every(q=>g[q.id]===q.value):true;let steps=[];
      try{steps=x.solve(g,B,book)||[]}catch(e){steps=[{t:'تعذّر الحساب بهذه القيم.'}]}
      $('.ex-steps',sec).innerHTML=steps.map(st=>`<li class="${st.final?'final':''}">${st.t?`<div class="ex-t">${st.t}</div>`:''}${st.f?`<div class="ex-f">${B.tex(st.f,true)}</div>`:''}${st.v!=null?`<div class="ex-v"><span class="ltr">${fmtN(st.v,st.dp)} ${st.unit||''}</span></div>`:''}</li>`).join('')+(book?'':'<li class="ex-mine"><div class="ex-t">الأرقام الآن من عندك وليست من الكتاب.</div></li>');
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
    L.quiz.map((q,i)=>{const a=ans[i];return `<div class="qq"><h3>${i+1}. ${q.q}</h3><div class="opts">`+q.o.map((o,j)=>{let c='';if(a!=null){if(j===q.c)c='right';else if(j===a)c='wrong'}
      return `<button class="opt ${c}" data-q="${i}" data-o="${j}" ${a!=null?'disabled':''}>${o}</button>`}).join('')+`</div><div class="fb ${a!=null?'show':''}">${a!=null?(a===q.c?'<b class="ok">إجابة صحيحة.</b> ':'<b class="no">ليست هذه.</b> ')+(q.e||''):''}</div></div>`}).join('')+'</div>';
    $$('.opt',body).forEach(b=>b.addEventListener('click',()=>{ans[b.dataset.q]=+b.dataset.o;draw()}));
    $('#qreset',body).addEventListener('click',()=>{ans={};draw()});B.math(body);};
  draw();
}

/* ---------------- ROUTER ---------------- */
function route(){
  const h=(location.hash||'').replace('#','');
  const L=B.LESSONS.find(l=>l.id===h);
  if(L){renderLesson(L)}else{stopRun();document.body.classList.remove('in-lesson');delete document.body.dataset.tab;renderHome()}
}
B.start=function(){window.addEventListener('hashchange',route);route()};
})(window);
