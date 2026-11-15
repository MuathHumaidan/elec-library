/* =====================================================================
   «المنضدة الافتراضية» — محاكي توصيل حقيقي لتجارب المعمل (shared، عام لكل المقررات)
   - المتدرب يوصّل الأسلاك بنفسه (سحب أو لمس)، ويدير المقابض، ويختار مدى الأجهزة، ويشغّل بترتيب المعمل.
   - الدائرة تُحَل كهربائياً (تحليل العقد) من التوصيل الفعلي، فأي توصيل خاطئ يعطي نتيجته الحقيقية.
   - شكل المنضدة (layout) منفصل عن التجربة (exp): لمطابقة منضدة الكلية يُستبدل ملف الشكل فقط.
   - «جاهز للمعمل» بعد إكمال التجربة بلا أي خطأ، مع تقرير بأخطاء المحاولات السابقة، ورمز يتحقق منه المدرب.
   الاستعمال: B.BENCH.mount(el,{key,course,title,layout,exp,params}) — الشكل والتفاصيل: API_BENCH.md
   ===================================================================== */
(function(G){
"use strict";
const B=G.PLCBOOK;if(!B)return;
const $=(s,r)=>(r||document).querySelector(s),$$=(s,r)=>[...(r||document).querySelectorAll(s)];
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
const LS={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const fmt=(x,dp)=>{if(!isFinite(x))return '—';const s=(Math.round(x*Math.pow(10,dp))/Math.pow(10,dp)).toFixed(dp);return s==='-0'||/^-0\.0*$/.test(s)?s.slice(1):s};
const WCOL={red:'#C8382E',black:'#2B2B2B',blue:'#2563B8',yellow:'#D9A400'};
const WNAME={red:'أحمر',black:'أسود',blue:'أزرق',yellow:'أصفر'};

/* ---------- رمز «جاهز للمعمل» (FNV-1a) ---------- */
const normName=s=>String(s||'').trim().replace(/\s+/g,' ').replace(/[أإآ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي');
function readyCode(name,course,key,date){const s=normName(name)+'|'+course+'|'+key+'|'+date+'|elec-bench-1';let h=0x811c9dc5;
  for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,0x01000193)>>>0}
  const A='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let c='';for(let i=0;i<6;i++){c+=A[h%32];h=Math.floor(h/32)^(i*2654435761>>>0)%997}return c}
const today=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};

/* ---------- حل الدائرة: تحليل العقد بمكافئ نورتن ---------- */
function solveDC(nNodes,els){/* els: {a,b,g,i} — توصيلية g بين a و b، ومصدر تيار i من b إلى a (يدخل a) */
  const N=nNodes;if(!N)return [];const M=Array.from({length:N},()=>new Float64Array(N+1));
  for(let k=0;k<N;k++)M[k][k]+=1e-9;
  for(const e of els){const {a,b,g,i}=e;if(a===b)continue;
    if(a>=0){M[a][a]+=g;M[a][N]+=i}if(b>=0){M[b][b]+=g;M[b][N]-=i}if(a>=0&&b>=0){M[a][b]-=g;M[b][a]-=g}}
  for(let c=0;c<N;c++){let p=c;for(let r=c+1;r<N;r++)if(Math.abs(M[r][c])>Math.abs(M[p][c]))p=r;
    if(p!==c){const t=M[c];M[c]=M[p];M[p]=t}const d=M[c][c]||1e-18;
    for(let r=0;r<N;r++){if(r===c)continue;const f=M[r][c]/d;if(!f)continue;for(let k=c;k<=N;k++)M[r][k]-=f*M[c][k]}}
  return M.map((row,k)=>row[N]/(row[k]||1e-18));
}

/* ---------- حل دوائر التيار المتردد بالمطاورات: عناصر بسيطة ومنافذ ثنائية (للمحولات) ---------- */
const C={add:(a,b)=>[a[0]+b[0],a[1]+b[1]],sub:(a,b)=>[a[0]-b[0],a[1]-b[1]],mul:(a,b)=>[a[0]*b[0]-a[1]*b[1],a[0]*b[1]+a[1]*b[0]],
  div:(a,b)=>{const d=b[0]*b[0]+b[1]*b[1]||1e-30;return [(a[0]*b[0]+a[1]*b[1])/d,(a[1]*b[0]-a[0]*b[1])/d]},abs:a=>Math.hypot(a[0],a[1]),pol:(m,deg)=>[m*Math.cos(deg*Math.PI/180),m*Math.sin(deg*Math.PI/180)],conj:a=>[a[0],-a[1]],neg:a=>[-a[0],-a[1]]};
function solveAC(N,st){if(!N)return [];const M=Array.from({length:N},()=>Array.from({length:N+1},()=>[0,0]));
  const ad=(r,c,v)=>{if(r<0||c<0)return;M[r][c]=C.add(M[r][c],v)};
  for(let k=0;k<N;k++)ad(k,k,[1e-9,0]);
  for(const e of st){if(e.Y){const [a,b]=e.p,[c,d]=e.q,P=[[a,b,e.Y[0][0],a,b],[a,b,e.Y[0][1],c,d],[c,d,e.Y[1][0],a,b],[c,d,e.Y[1][1],c,d]];
      for(const [r1,r2,y,c1,c2] of P){ad(r1,c1,y);ad(r1,c2,C.neg(y));ad(r2,c1,C.neg(y));ad(r2,c2,y)}continue}
    const {a,b,y}=e,i=e.i||[0,0];if(a===b)continue;ad(a,a,y);ad(b,b,y);ad(a,b,C.neg(y));ad(b,a,C.neg(y));if(a>=0)M[a][N]=C.add(M[a][N],i);if(b>=0)M[b][N]=C.sub(M[b][N],i)}
  for(let c=0;c<N;c++){let p=c;for(let r=c+1;r<N;r++)if(C.abs(M[r][c])>C.abs(M[p][c]))p=r;if(p!==c){const t=M[c];M[c]=M[p];M[p]=t}
    const d=C.abs(M[c][c])?M[c][c]:[1e-18,0];for(let r=0;r<N;r++){if(r===c)continue;const f=C.div(M[r][c],d);if(!f[0]&&!f[1])continue;for(let k=c;k<=N;k++)M[r][k]=C.sub(M[r][k],C.mul(f,M[c][k]))}}
  return M.map((row,k)=>C.div(row[N],C.abs(row[k])?row[k]:[1e-18,0]))}
/* ---------- رسم ---------- */
const svgNS='http://www.w3.org/2000/svg';
const AR=t=>/[\u0600-\u06FF]/.test(String(t))?' direction="rtl"':'';
function gaugeSVG(d,val,range,unit){/* مقياس بمؤشر */
  const w=d.w||150,h=d.h||96,cx=w/2,cy=h-14,r=h-30;const fr=isFinite(val)?val/range:0,ang=Math.PI*(1-clamp(fr,-0.04,1.04));
  const nx=cx+r*Math.cos(ang),ny=cy-r*Math.sin(ang);let tk='';
  for(let k=0;k<=10;k++){const a=Math.PI*(1-k/10),x1=cx+(r-2)*Math.cos(a),y1=cy-(r-2)*Math.sin(a),x2=cx+(r-(k%5?7:12))*Math.cos(a),y2=cy-(r-(k%5?7:12))*Math.sin(a);tk+=`<path d="M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="#333" stroke-width="${k%5?1:1.6}"/>`}
  const bad=fr>1.02||fr<-0.02;
  return `<rect x="0" y="0" width="${w}" height="${h}" rx="8" fill="#FBFAF5" stroke="#8a8a80"/>${tk}
   <text x="10" y="${cy+2}" font-size="10" fill="#555">0</text><text x="${w-10}" y="${cy+2}" font-size="10" fill="#555" text-anchor="end">${range}</text>
   <text x="${cx}" y="${cy-r*0.45}" font-size="13" font-weight="700" fill="#333" text-anchor="middle">${unit}</text>
   <path d="M${cx} ${cy}L${nx.toFixed(1)} ${ny.toFixed(1)}" stroke="${bad?'#C8382E':'#1d1d1d'}" stroke-width="2.4" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="4" fill="#1d1d1d"/>`}
function digitalSVG(d,txt){const w=d.w||150,h=d.h||50;return `<rect x="0" y="0" width="${w}" height="${h}" rx="6" fill="#1E2A22"/><text x="${w/2}" y="${h/2+8}" font-size="22" font-family="monospace" fill="#8CF5B0" text-anchor="middle">${esc(txt)}</text>`}
function knobSVG(k,val){const r=k.r||26,fr=clamp(val/k.max,0,1),a=(-135+270*fr)*Math.PI/180;const x=Math.sin(a)*(r-7),y=-Math.cos(a)*(r-7);
  return `<circle r="${r}" fill="#3a3f45" stroke="#1d1f22" stroke-width="2"/><circle r="${r-6}" fill="#50565d"/><path d="M0 0L${x.toFixed(1)} ${y.toFixed(1)}" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/>
   <path d="M${(-0.7071*(r+5)).toFixed(1)} ${(0.7071*(r+5)).toFixed(1)}A${r+5} ${r+5} 0 1 1 ${(0.7071*(r+5)).toFixed(1)} ${(0.7071*(r+5)).toFixed(1)}" fill="none" stroke="#9aa094" stroke-width="2.5"/>
   <path d="M${(-0.7071*(r+5)).toFixed(1)} ${(0.7071*(r+5)).toFixed(1)}A${r+5} ${r+5} 0 ${fr>2/3?1:0} 1 ${(Math.sin(a)*(r+5)).toFixed(1)} ${(-Math.cos(a)*(r+5)).toFixed(1)}" fill="none" stroke="#2563B8" stroke-width="3" ${fr<0.004?'opacity="0"':''}/>`}
function switchSVG(on){return `<rect x="-20" y="-14" width="40" height="28" rx="5" fill="${on?'#1f7a4d':'#5b5f63'}" stroke="#222"/><rect x="${on?2:-18}" y="-11" width="16" height="22" rx="3" fill="#f2f2ee"/><text x="${on?-10:10}" y="5" font-size="11" fill="#fff" text-anchor="middle" font-weight="700">${on?'I':'O'}</text>`}

const PBC={red:'#c8382e',green:'#1f9a55',black:'#2b2b2b',blue:'#2457b5',yellow:'#e0b21c',white:'#eee'};
function pushSVG(on,col){const c=PBC[col]||PBC.black;return `<circle r="19" fill="#c9ccc4" stroke="#555"/><circle r="${on?13:15}" fill="${c}" stroke="#111" stroke-width="1.5"/>${on?'':'<circle r="15" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="2" cy="-1.5"/>'}`}
/* ---------- المنضدة ---------- */
B.BENCH={readyCode,today,solveDC,solveAC,C,mount};
function mount(el,cfg){
  const {layout:LY,exp:X}=cfg;const course=cfg.course||(B.COURSE&&B.COURSE.key)||'lib',KEY=course+'-bench-'+cfg.key;
  const P=cfg.params||{v:{}};
  /* الحالة */
  const S={wires:[],knob:{},sw:{},range:{},sel:null,tapFrom:null,mode:LS.get('bench-mode',null)||(matchMedia('(pointer:coarse)').matches?'tap':'drag'),color:'red',zoom:null,t:0,
    mistakes:[],once:{},timers:{},trip:null,rec:{},done:false,finished:false,phys:X.init?X.init(P.v):{}};
  (LY.modules||[]).forEach(m=>{(m.knobs||[]).forEach(k=>S.knob[k.id]=k.init||0);(m.switches||[]).forEach(s=>S.sw[s.id]=!!s.init);(m.meters||[]).forEach(d=>{if(d.ranges)S.range[d.id]=d.ranges.length-1})});
  const SWD={};(LY.modules||[]).forEach(m=>(m.switches||[]).forEach(s=>SWD[s.id]=s));
  const hist=LS.get(KEY,{attempts:[],name:''});
  /* أطراف */
  const TERM={};(LY.modules||[]).forEach(m=>(m.terms||[]).forEach(t=>{TERM[t.id]=Object.assign({mod:m},t,{X:m.x+t.x,Y:m.y+t.y})}));
  /* DOM */
  el.innerHTML=`<section class="bench" dir="rtl">
   <div class="bn-intro panel"><h2>${esc(cfg.title||'المنضدة الافتراضية')}</h2>
    <p>${cfg.intro||'وصّل التجربة بنفسك، ثم شغّلها بنفس ترتيب المعمل. أي خطأ يكشفه المحاكي ويشرح ما كان سيحدث في المعمل.'}</p>
    ${X.note?`<div class="bn-note">${X.note}</div>`:''}${LY.generic?'<p class="sub">شكل المنضدة عام ويتبع أسماء الأطراف في الكتاب، وقد يختلف ترتيبها عن منضدة كليتك.</p>':''}
    <label class="bn-name">اسمك (يظهر في «جاهز للمعمل»): <input type="text" maxlength="60" value="${esc(hist.name||'')}" data-name></label></div>
   <div class="bn-tools" role="toolbar" aria-label="أدوات التوصيل">
    <div class="seg" role="group" aria-label="طريقة التوصيل"><button type="button" data-mode="drag">السحب</button><button type="button" data-mode="tap">اللمس</button>${X.probe?'<button type="button" data-mode="probe">جهاز القياس</button>':''}</div>
    <span class="bn-colors" role="group" aria-label="لون السلك">${Object.keys(WCOL).map(c=>`<button type="button" class="bn-c" data-color="${c}" style="--c:${WCOL[c]}" aria-label="سلك ${WNAME[c]}" title="سلك ${WNAME[c]}"></button>`).join('')}</span>
    <button type="button" class="btn" data-del disabled>احذف السلك المحدد</button>
    <button type="button" class="btn" data-fig>مخطط التوصيل</button>
    <span class="bn-sp"></span>
    <button type="button" class="btn" data-zoom="-1" aria-label="تصغير">−</button><button type="button" class="btn" data-zoom="1" aria-label="تكبير">+</button>
    <button type="button" class="btn" data-reset>ابدأ من جديد</button></div>
   <p class="bn-hint sub" aria-live="polite"></p>
   <div class="bn-wrap"><svg class="bn-svg" dir="ltr" xmlns="${svgNS}" viewBox="0 0 ${LY.w} ${LY.h}" role="application" aria-label="المنضدة الافتراضية"></svg></div>
   <div class="bn-alert" role="alert" hidden></div>
   <div class="bn-grid">
    <div class="panel bn-steps"><h3>خطوات التجربة</h3><ol></ol></div>
    ${X.view?`<div class="panel bn-view"><h3>${X.view.title||'الجهاز'}</h3><div data-view></div></div>`:''}
    <div class="panel bn-tables"${X.tables?'':' hidden'}><h3>القراءات</h3><div data-tables></div>${(X.actions||[]).map((a,i)=>`<button type="button" class="btn" data-act="${i}">${a.label}</button>`).join('')}<button type="button" class="btn primary" data-rec>سجّل القراءة</button><p class="sub" data-recmsg aria-live="polite"></p><div data-plot></div></div>
   </div>
   <div class="panel bn-log"><h3>أخطاء هذه المحاولة <span data-mcount>0</span></h3><ol data-mlist></ol><p class="sub" data-mnone>لا أخطاء حتى الآن.</p></div>
   <div class="bn-result" hidden></div>
   <details class="panel bn-history"><summary>تقرير محاولاتك السابقة</summary><div data-hist></div></details>
   <details class="panel bn-verify"><summary>للمدرب: التحقق من رمز «جاهز للمعمل»</summary>
    <form class="bn-vf"><label>اسم المتدرب <input name="n" required></label><label>التاريخ <input name="d" type="date" required value="${today()}" dir="ltr"></label><label>الرمز <input name="c" required dir="ltr" autocapitalize="characters" maxlength="6"></label><button class="btn primary">تحقق</button><p class="bn-vr" aria-live="polite"></p></form></details>
   <div class="bn-fig" hidden></div>
  </section>`;
  const svg=$('.bn-svg',el),hint=$('.bn-hint',el),alertEl=$('.bn-alert',el),wrap=$('.bn-wrap',el);
  /* ---- رسم الوحدات الثابتة ---- */
  let g='<defs><filter id="bnglow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><filter id="bnsh" x="-5%" y="-5%" width="110%" height="115%"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity=".18"/></filter></defs>';
  g+=`<rect width="${LY.w}" height="${LY.h}" fill="${LY.bg||'#D9DCD4'}"/>`;
  if(LY.draw)g+=LY.draw();
  (LY.modules||[]).forEach(m=>{
    g+=`<g class="bn-mod" transform="translate(${m.x} ${m.y})"><rect width="${m.w}" height="${m.h}" rx="10" fill="${m.fill||'#EEF0EA'}" stroke="#7b8078" stroke-width="1.5" filter="url(#bnsh)"/>`;
    if(m.title)g+=`<text x="${m.w/2}" y="20" font-size="13" font-weight="700" fill="#22312a" text-anchor="middle"${AR(m.title)}>${esc(m.title)}</text>`;
    if(m.sub)g+=`<text x="${m.w/2}" y="36" font-size="11" fill="#4b5a52" text-anchor="middle"${AR(m.sub)}>${esc(m.sub)}</text>`;
    if(m.art)g+=m.art;
    (m.labels||[]).forEach(l=>g+=`<text x="${l.x}" y="${l.y}" font-size="${l.s||11}" fill="${l.c||'#33403a'}" text-anchor="${l.a||'middle'}" ${l.b?'font-weight="700"':''}${AR(l.t)}>${esc(l.t)}</text>`);
    (m.meters||[]).forEach(d=>{g+=`<g class="bn-meter" data-meter="${d.id}" transform="translate(${d.x} ${d.y})"></g>`;
      if(d.ranges)g+=`<g transform="translate(${d.x} ${d.y+(d.h||96)+8})">${d.ranges.map((r,i)=>`<g class="bn-rng" data-rng="${d.id}" data-i="${i}" role="button" tabindex="0" aria-label="مدى ${r} ${d.unit}" transform="translate(${i*((d.w||150)/d.ranges.length)} 0)"><rect width="${(d.w||150)/d.ranges.length-4}" height="22" rx="4"/><text x="${((d.w||150)/d.ranges.length-4)/2}" y="15" font-size="11" text-anchor="middle">${r} ${d.unit}</text></g>`).join('')}</g>`});
    (m.knobs||[]).forEach(k=>{g+=`<g class="bn-knob" data-knob="${k.id}" transform="translate(${k.x} ${k.y})" role="slider" tabindex="0" aria-label="${esc(k.lbl)}" aria-valuemin="0" aria-valuemax="${k.max}"></g><text x="${k.x}" y="${k.y+(k.r||26)+22}" font-size="11" text-anchor="middle" fill="#33403a"${AR(k.lbl)}>${esc(k.lbl)}</text>`});
    (m.switches||[]).forEach(s=>{g+=`<g class="bn-sw" data-sw="${s.id}" transform="translate(${s.x} ${s.y})" role="${s.push?'button':'switch'}" tabindex="0" aria-label="${esc(s.lbl)}"></g><text x="${s.x}" y="${s.y+(s.push?34:30)}" font-size="11" text-anchor="middle" fill="#33403a"${AR(s.lbl)}>${esc(s.lbl)}</text>`});
    (m.leds||[]).forEach(d=>{g+=`<circle class="bn-led" data-led="${d.id}" data-col="${d.color||'#ffb000'}" cx="${d.x}" cy="${d.y}" r="${d.r||6}" fill="#4a4f4c" stroke="#222"/>`;if(d.lbl)g+=`<text x="${d.x}" y="${d.y-(d.r||6)-4}" font-size="${d.s||9}" text-anchor="middle" fill="#33403a">${esc(d.lbl)}</text>`});
    g+='</g>'});
  g+='<g class="bn-wires"></g><g class="bn-terms"></g><path class="bn-temp" d="" fill="none" stroke-width="5" stroke-linecap="round" opacity=".7"/>';
  svg.innerHTML=g;
  const gW=$('.bn-wires',svg),gT=$('.bn-terms',svg),temp=$('.bn-temp',svg);
  gT.innerHTML=Object.values(TERM).map(t=>`<g class="bn-term" data-t="${t.id}" transform="translate(${t.X} ${t.Y})" role="button" tabindex="0" aria-label="الطرف ${esc(t.lbl)}${t.mod.title?' — '+esc(t.mod.title):''}">
     <circle class="bn-hit" r="18" fill="transparent"/><circle r="9.5" fill="${t.pol==='+'?'#C8382E':t.pol==='-'?'#2B2B2B':t.col||'#C9A227'}" stroke="#1d1d1d" stroke-width="1.5"/><circle r="4" fill="#111"/>
     <text y="${t.ly||-15}" font-size="11.5" font-weight="700" text-anchor="middle" fill="#1f2a24">${esc(t.lbl)}</text></g>`).join('');
  /* ---- المكونات المتغيرة ---- */
  const curve=(a,b)=>{const dy=Math.abs(b.X-a.X)*0.15+40;return `M${a.X} ${a.Y}C${a.X} ${a.Y+dy} ${b.X} ${b.Y+dy} ${b.X} ${b.Y}`};
  function drawWires(){gW.innerHTML=S.wires.map((w,i)=>{const a=TERM[w.a],b=TERM[w.b];return `<g class="bn-wire${S.sel===i?' sel':''}" data-w="${i}" role="button" tabindex="0" aria-label="سلك ${WNAME[w.c]} من ${esc(a.lbl)} إلى ${esc(b.lbl)}"><path d="${curve(a,b)}" stroke="transparent" stroke-width="16" fill="none"/><path d="${curve(a,b)}" stroke="${WCOL[w.c]}" stroke-width="4.5" fill="none" stroke-linecap="round"/></g>`}).join('');
    $('[data-del]',el).disabled=S.sel==null;$$('.bn-term',gT).forEach(t=>t.classList.toggle('from',S.tapFrom===t.dataset.t))}
  function drawCtl(){$$('.bn-knob',svg).forEach(k=>{const d=findKnob(k.dataset.knob);k.innerHTML=knobSVG(d,S.knob[d.id]);k.setAttribute('aria-valuenow',fmt(S.knob[d.id],d.dp||0));k.setAttribute('aria-valuetext',fmt(S.knob[d.id],d.dp||0)+' '+(d.unit||''))});
    $$('.bn-sw',svg).forEach(s=>{const d=SWD[s.dataset.sw]||{};s.innerHTML=d.push?pushSVG(S.sw[s.dataset.sw],d.color):switchSVG(S.sw[s.dataset.sw]);s.setAttribute('aria-checked',S.sw[s.dataset.sw])});
    $$('.bn-rng',svg).forEach(r=>r.classList.toggle('on',S.range[r.dataset.rng]===+r.dataset.i))}
  const knobs={},meters={};(LY.modules||[]).forEach(m=>{(m.knobs||[]).forEach(k=>knobs[k.id]=k);(m.meters||[]).forEach(d=>meters[d.id]=d)});
  const findKnob=id=>knobs[id];
  /* ---- الشبكات من الأسلاك ---- */
  function nets(){const par={};const f=x=>{while(par[x]!==x){par[x]=par[par[x]];x=par[x]}return x};Object.keys(TERM).forEach(t=>par[t]=t);
    (LY.bridges||[]).forEach(([a,b])=>{if(par[a]!=null&&par[b]!=null)par[f(a)]=f(b)});/* وصلات داخلية ثابتة (قضبان توزيع) */
    S.wires.forEach(w=>{if(!w.open)par[f(w.a)]=f(w.b)});/* open: سلك مقطوع من الداخل (عطل مخفي) */const id={};let n=0;Object.keys(TERM).forEach(t=>{const r=f(t);if(!(r in id))id[r]=n++;});
    const of={};Object.keys(TERM).forEach(t=>of[t]=id[f(t)]);return {of,n}}
  let NET=nets();
  const conn=(a,b)=>NET.of[a]===NET.of[b];
  /* ---- الأخطاء ---- */
  function mistake(id,info){const def=Object.assign({},(X.mistakes||{})[id]||GENERIC[id]||{t:id},info||{});
    S.mistakes.push({id,t:def.t,why:def.why||'',at:S.t});persist();
    paintLog();showAlert(def.t,def.why,def.fatal);
    if(def.fatal){S.trip=def.t;(def.off||Object.keys(S.sw)).forEach(k=>S.sw[k]=false);drawCtl()}}
  const GENERIC={
   'live-wiring':{t:'غيّرت التوصيل والمصدر يعمل',why:'في المعمل لا يُركّب سلك ولا يُفك والدائرة تحت الجهد: افصل المصدر أولاً. قد تتعرض لصدمة أو شرارة تتلف الأطراف.'},
   'start-not-zero':{t:'شغّلت المصدر ومقبضه ليس على الصفر',why:'يجب أن يكون مقبض المصدر على الصفر قبل تشغيله، ثم يُرفع تدريجياً. التشغيل على جهد مرتفع يسحب تياراً كبيراً فجأة.'},
   'over-range':{t:'القراءة تجاوزت مدى جهاز القياس',why:'المؤشر ضرب نهاية التدريج، وهذا يتلف الجهاز. ابدأ بأكبر مدى ثم انزل للمدى المناسب.'},
   'reverse':{t:'جهاز القياس موصّل بقطبية معكوسة',why:'المؤشر يحاول التحرك تحت الصفر. الطرف + للجهاز يوصل جهة الطرف الموجب في الدائرة.'},
   'overcurrent':{t:'تيار كبير جداً: فصلت حماية المصدر',why:'في الدائرة قصر أو تيار بدء كبير. افحص التوصيل، وارفع الجهد تدريجياً من الصفر.',fatal:true},
   'amm-parallel':{t:'الأميتر موصّل على التوازي',why:'الأميتر مقاومته صغيرة جداً، فإذا وُصّل على التوازي مع المصدر أو مع حمل صار قصراً ومر فيه تيار كبير يحرقه. الأميتر يوصل دائماً على التوالي.',fatal:true}};
  /* ---- التنبيه ---- */
  let alertT=null;function showAlert(t,why,fatal){alertEl.hidden=false;alertEl.className='bn-alert'+(fatal?' fatal':'');alertEl.innerHTML=`<b>${fatal?'⚡ ':''}${esc(t)}</b>${why?`<p>${esc(why)}</p>`:''}`;clearTimeout(alertT);alertT=setTimeout(()=>{alertEl.hidden=true},9000)}
  function paintLog(){const L=$('[data-mlist]',el);L.innerHTML=S.mistakes.map(m=>`<li><b>${esc(m.t)}</b>${m.why?`<span>${esc(m.why)}</span>`:''}</li>`).join('');$('[data-mcount]',el).textContent=S.mistakes.length;$('[data-mnone]',el).hidden=S.mistakes.length>0}
  /* ---- التفاعل ---- */
  const H=msg=>{hint.textContent=msg||''};
  const pt=e=>{const r=svg.getBoundingClientRect();return {X:(e.clientX-r.left)/r.width*LY.w,Y:(e.clientY-r.top)/r.height*LY.h}};
  const anyOn=()=>X.powerSw?X.powerSw.some(id=>S.sw[id]):Object.values(S.sw).some(Boolean);
  function addWire(a,b){if(a===b||!TERM[a]||!TERM[b])return;if(S.wires.some(w=>(w.a===a&&w.b===b)||(w.a===b&&w.b===a))){H('بين هذين الطرفين سلك من قبل.');return}
    const cnt=t=>S.wires.filter(w=>w.a===t||w.b===t).length;if(cnt(a)>=3||cnt(b)>=3){H('الطرف لا يتسع لأكثر من ثلاثة أسلاك.');return}
    if(anyOn())mistake('live-wiring');
    S.wires.push({a,b,c:S.color});NET=nets();S.sel=null;drawWires();H('وصّلت '+TERM[a].lbl+' ← '+TERM[b].lbl+'.');onWiring()}
  function delWire(i){if(i==null)return;if(anyOn())mistake('live-wiring');const w=S.wires.splice(i,1)[0];NET=nets();S.sel=null;drawWires();H('فككت السلك '+TERM[w.a].lbl+' – '+TERM[w.b].lbl+'.');onWiring()}
  function persist(){LS.set(KEY+'-w',{wires:S.wires,mistakes:S.mistakes,rec:S.rec,once:S.once})}
  function onWiring(){persist();paintSteps()}
  let drag=null;
  svg.addEventListener('pointerdown',e=>{let t=e.target.closest('.bn-term'),k=e.target.closest('.bn-knob'),sw=e.target.closest('.bn-sw'),rg=e.target.closest('.bn-rng'),w=e.target.closest('.bn-wire');
    if(w&&!t){/* سلك فوق مقبض أو ضاغط: الأولوية للعنصر الذي تحته */const under=document.elementsFromPoint(e.clientX,e.clientY);const f=c=>under.map(x=>x.closest&&x.closest(c)).find(Boolean);const s2=f('.bn-sw'),k2=f('.bn-knob'),r2=f('.bn-rng');if(s2||k2||r2){sw=s2;k=k2;rg=r2;w=null}}
    if(k){e.preventDefault();k.setPointerCapture(e.pointerId);drag={knob:k.dataset.knob,x:e.clientX,y:e.clientY,v0:S.knob[k.dataset.knob]};return}
    if(sw){const d=SWD[sw.dataset.sw]||{};if(d.push){e.preventDefault();pressSw(sw.dataset.sw,true);pushHeld=sw.dataset.sw;return}toggleSw(sw.dataset.sw);return}
    if(rg){S.range[rg.dataset.rng]=+rg.dataset.i;drawCtl();return}
    if(t){const id=t.dataset.t;
      if(S.mode==='probe'){if(!S.tapFrom){S.tapFrom=id;drawWires();H('جهاز القياس: المس الطرف الثاني.')}else{const a=S.tapFrom;S.tapFrom=null;drawWires();if(a!==id){S.probe=[a,id];H(X.probe(a,id,api))}}return}
      if(S.mode==='tap'){if(!S.tapFrom){S.tapFrom=id;drawWires();H('اختر الطرف الثاني للسلك (أو المس الطرف نفسه للإلغاء).')}else{const a=S.tapFrom;S.tapFrom=null;if(a===id){drawWires();H('')}else addWire(a,id)}return}
      e.preventDefault();svg.setPointerCapture(e.pointerId);drag={from:id};temp.setAttribute('stroke',WCOL[S.color]);return}
    if(w){S.sel=+w.dataset.w;drawWires();H('حدّدت سلكاً: اضغط «احذف السلك المحدد» لفكه.');return}
    if(S.sel!=null){S.sel=null;drawWires()}});
  svg.addEventListener('pointermove',e=>{if(!drag)return;
    if(drag.knob){const d=findKnob(drag.knob),dv=((e.clientX-drag.x)-(e.clientY-drag.y))*(d.max/260);setKnob(drag.knob,drag.v0+dv);return}
    if(drag.from){const a=TERM[drag.from],p=pt(e);temp.setAttribute('d',curve(a,p))}});
  const endDrag=e=>{if(pushHeld){pressSw(pushHeld,false);pushHeld=null}if(!drag)return;const d=drag;drag=null;temp.setAttribute('d','');
    if(d.from){const p=pt(e);let best=null,bd=26;Object.values(TERM).forEach(t=>{const dd=Math.hypot(t.X-p.X,t.Y-p.Y);if(dd<bd){bd=dd;best=t}});if(best&&best.id!==d.from)addWire(d.from,best.id)}};
  svg.addEventListener('pointerup',endDrag);svg.addEventListener('pointercancel',()=>{if(pushHeld){pressSw(pushHeld,false);pushHeld=null}drag=null;temp.setAttribute('d','')});
  svg.addEventListener('pointerleave',()=>{if(pushHeld){pressSw(pushHeld,false);pushHeld=null}});
  svg.addEventListener('keyup',e=>{const sw=e.target.closest('.bn-sw');if(sw&&(SWD[sw.dataset.sw]||{}).push&&(e.key===' '||e.key==='Enter'))pressSw(sw.dataset.sw,false)});
  svg.addEventListener('keydown',e=>{const k=e.target.closest('.bn-knob'),sw=e.target.closest('.bn-sw'),t=e.target.closest('.bn-term'),w=e.target.closest('.bn-wire'),rg=e.target.closest('.bn-rng');
    if(k){const d=findKnob(k.dataset.knob),st=d.step||d.max/100;if(e.key==='ArrowUp'||e.key==='ArrowRight'){setKnob(d.id,S.knob[d.id]+st);e.preventDefault()}if(e.key==='ArrowDown'||e.key==='ArrowLeft'){setKnob(d.id,S.knob[d.id]-st);e.preventDefault()}if(e.key==='Home'){setKnob(d.id,d.min||0);e.preventDefault()}if(e.key==='End'){setKnob(d.id,d.max);e.preventDefault()}return}
    if((e.key==='Enter'||e.key===' ')&&(sw||t||rg)){e.preventDefault();if(sw){if((SWD[sw.dataset.sw]||{}).push){if(!e.repeat)pressSw(sw.dataset.sw,true)}else toggleSw(sw.dataset.sw)}else if(rg){S.range[rg.dataset.rng]=+rg.dataset.i;drawCtl()}else{const id=t.dataset.t;if(!S.tapFrom){S.tapFrom=id;drawWires();H('اختر الطرف الثاني ثم اضغط Enter.')}else{const a=S.tapFrom;S.tapFrom=null;a===id?drawWires():addWire(a,id)}}}
    if(w&&(e.key==='Delete'||e.key==='Backspace')){delWire(+w.dataset.w);e.preventDefault()}});
  function setKnob(id,v){const d=findKnob(id),st=d.step||d.max/500;S.knob[id]=clamp(+(Math.round(v/st)*st).toFixed(6),d.min||0,d.max);drawCtl()}
  let pushHeld=null;const pushT={};
  /* ضاغط لحظي: يبقى مضغوطاً ما دام الإصبع عليه، وأقل مدة 0.26 ث حتى تلتقطها دورة المسح */
  function pressSw(id,on){if(on){pushT[id]=performance.now();S.sw[id]=true;drawCtl();if(X.onSwitchOn)X.onSwitchOn(id,api);return}
    const w=Math.max(0,260-(performance.now()-(pushT[id]||0)));setTimeout(()=>{S.sw[id]=false;drawCtl();if(X.onSwitchOff)X.onSwitchOff(id,api)},w)}
  function toggleSw(id){const on=!S.sw[id];
    if(on){const ks=(X.swKnob||{})[id];if(ks&&S.knob[ks]>(findKnob(ks).min||0)+findKnob(ks).max*0.02)mistake('start-not-zero');S.trip=null;if(X.onSwitchOn)X.onSwitchOn(id,api)}
    else if(X.onSwitchOff)X.onSwitchOff(id,api);
    S.sw[id]=on;drawCtl();paintSteps()}
  /* الأدوات */
  $$('[data-mode]',el).forEach(b=>b.addEventListener('click',()=>{S.mode=b.dataset.mode;if(S.mode!=='probe')LS.set('bench-mode',S.mode);S.tapFrom=null;paintTools();H(S.mode==='probe'?'جهاز القياس: المس طرفين لقراءة الجهد بينهما.':S.mode==='tap'?'اللمس: المس طرفاً ثم الطرف الآخر.':'السحب: اسحب من طرف وأفلت على الطرف الآخر.')}));
  $$('[data-color]',el).forEach(b=>b.addEventListener('click',()=>{S.color=b.dataset.color;paintTools()}));
  $('[data-del]',el).addEventListener('click',()=>delWire(S.sel));
  $$('[data-zoom]',el).forEach(b=>b.addEventListener('click',()=>{setZoom((S.zoom||fitZ())*(b.dataset.zoom>0?1.25:0.8))}));
  function paintTools(){$$('[data-mode]',el).forEach(b=>b.setAttribute('aria-pressed',b.dataset.mode===S.mode));$$('[data-color]',el).forEach(b=>b.setAttribute('aria-pressed',b.dataset.color===S.color))}
  const fitZ=()=>Math.min(1,wrap.clientWidth/LY.w)||1;
  function setZoom(z){S.zoom=clamp(z,0.3,2.2);svg.style.width=(LY.w*S.zoom)+'px';svg.style.height=(LY.h*S.zoom)+'px'}
  const minZ=()=>matchMedia('(max-width:760px)').matches?0.62:0;
  setZoom(Math.max(fitZ(),minZ()));
  $('[data-name]',el).addEventListener('input',e=>{hist.name=e.target.value;LS.set(KEY,hist)});
  $('[data-reset]',el).addEventListener('click',()=>{if(S.mistakes.length||Object.keys(S.rec).length)saveAttempt(false);resetAll()});
  $('[data-fig]',el).addEventListener('click',()=>{const f=$('.bn-fig',el);if(!X.figure)return;f.hidden=!f.hidden;if(!f.hidden){f.innerHTML=`<div class="panel"><h3>${esc(X.figureTitle||'مخطط التوصيل')}</h3>${X.figure()}</div>`;f.scrollIntoView({block:'nearest'})}});
  $('.bn-vf',el).addEventListener('submit',e=>{e.preventDefault();const f=e.target,ok=readyCode(f.n.value,course,cfg.key,f.d.value)===f.c.value.trim().toUpperCase();
    $('.bn-vr',el).innerHTML=ok?'<b class="ok">✓ الرمز صحيح: المتدرب أكمل التجربة على المنضدة الافتراضية بلا أخطاء في هذا التاريخ.</b>':'<b class="bad">✗ الرمز لا يطابق هذا الاسم وهذا التاريخ.</b>'});
  /* ---- الجداول ---- */
  const rowsOf=T=>T.rows||[{k:'v',h:T.yh,dp:T.dp||1}];
  const cellV=(T,i,k)=>{const v=(S.rec[T.id]||{})[i];return v==null?null:(typeof v==='object'?v[k]:v)};
  function paintTables(){$('[data-tables]',el).innerHTML=(X.tables||[]).map(T=>`<div class="bn-tbl"><p><b>${T.title}</b></p><div class="tblwrap"><table class="data"><tr><th>${T.xh}</th>${T.cols.map(c=>`<td>${T.fx?T.fx(c):c}</td>`).join('')}</tr>${rowsOf(T).map(R=>`<tr><th>${R.h}</th>${T.cols.map((c,i)=>{const v=cellV(T,i,R.k);return `<td class="${v!=null?'rec':''}">${v!=null?fmt(v,R.dp!=null?R.dp:1):''}</td>`}).join('')}</tr>`).join('')}</table></div></div>`).join('');
    const pl=$('[data-plot]',el);pl.innerHTML=(X.tables||[]).filter(T=>T.plot!==false).map(T=>{const yk=T.py||rowsOf(T)[0].k;const pts=T.cols.map((c,i)=>[T.px?cellV(T,i,T.px):(typeof c==='number'?c:null),cellV(T,i,yk)]).filter(p=>p[0]!=null&&p[1]!=null&&isFinite(p[0])).sort((a,b)=>a[0]-b[0]);return pts.length>=2?plot(T,pts):''}).join('')}
  function plot(T,pts){const W=360,Hh=210,L=44,Rm=10,Tp=24,Bm=32,xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]),x1=Math.max(...xs)*1.05||1,y1=Math.max(...ys)*1.15||1;
    const Xf=x=>L+x/x1*(W-L-Rm),Yf=y=>Hh-Bm-y/y1*(Hh-Tp-Bm);
    return `<figure class="bn-plot"><svg viewBox="0 0 ${W} ${Hh}" dir="ltr" role="img" aria-label="منحنى ${esc(T.title)}"><rect x="${L}" y="${Tp}" width="${W-L-Rm}" height="${Hh-Tp-Bm}" fill="none" stroke="#bbb"/>
     <path d="${pts.map((p,i)=>(i?'L':'M')+Xf(p[0]).toFixed(1)+' '+Yf(p[1]).toFixed(1)).join('')}" fill="none" stroke="#2563B8" stroke-width="2"/>${pts.map(p=>`<circle cx="${Xf(p[0]).toFixed(1)}" cy="${Yf(p[1]).toFixed(1)}" r="3.5" fill="#2563B8"/>`).join('')}
     <text x="${(L+W)/2}" y="${Hh-6}" font-size="11" text-anchor="middle">${T.xu||''}</text><text x="${L}" y="14" font-size="11">${T.yu||''}</text>
     <text x="${L}" y="${Hh-Bm+13}" font-size="10" text-anchor="middle">0</text><text x="${W-Rm}" y="${Hh-Bm+13}" font-size="10" text-anchor="end">${fmt(x1/1.05,T.xdp||0)}</text><text x="${L-4}" y="${Tp+10}" font-size="10" text-anchor="end">${fmt(y1/1.15,T.ydp||0)}</text></svg></figure>`}
  $$('[data-act]',el).forEach(b=>b.addEventListener('click',()=>{const a=X.actions[+b.dataset.act];const r=a.run(api);if(r&&r.msg){const m=$('[data-recmsg]',el);m.textContent=r.msg;m.className='sub'}paintTables();paintSteps()}));
  $('[data-rec]',el).addEventListener('click',()=>{const m=$('[data-recmsg]',el);const r=X.record?X.record(api):null;
    if(!r){return}if(r.msg){m.textContent=r.msg;m.className='sub'+(r.ok?' ok':' warn')}
    if(r.ok&&r.multi)r.multi.forEach(x=>{(S.rec[x.table]=S.rec[x.table]||{})[x.col]=x.val});if(r.ok&&!r.multi){(S.rec[r.table]=S.rec[r.table]||{})[r.col]=r.val}if(r.ok){persist();paintTables();paintSteps()}if(r.clear){delete S.rec[r.clear];persist();paintTables();paintSteps()}});
  /* ---- الخطوات ---- */
  let stepSig='';
  function paintSteps(){const ds=(X.steps||[]).map(s=>!!(s.done&&s.done(api))),lv=(X.steps||[]).map((s,i)=>!ds[i]&&s.live?s.live(api):''),sig=ds.join()+lv.join('|');if(sig!==stepSig){stepSig=sig;$('.bn-steps ol',el).innerHTML=(X.steps||[]).map((s,i)=>`<li class="${ds[i]?'ok':''}">${ds[i]?'<span class="bn-ck" aria-label="تم">✓</span>':''}${s.t}${lv[i]?`<br><small class="sub">${lv[i]}</small>`:''}</li>`).join('')}
    if(!S.finished&&X.complete&&X.complete(api))finish()}
  /* ---- النهاية ---- */
  function saveAttempt(completed){hist.attempts.push({date:new Date().toISOString(),completed,mistakes:S.mistakes.map(m=>({id:m.id,t:m.t}))});if(hist.attempts.length>40)hist.attempts=hist.attempts.slice(-40);LS.set(KEY,hist);paintHist()}
  function paintHist(){const h=$('[data-hist]',el);if(!hist.attempts.length){h.innerHTML='<p class="sub">لا محاولات سابقة.</p>';return}
    const agg={};hist.attempts.forEach(a=>a.mistakes.forEach(m=>{agg[m.t]=(agg[m.t]||0)+1}));
    h.innerHTML=`<p>${hist.attempts.length} محاولة، منها ${hist.attempts.filter(a=>a.completed&&!a.mistakes.length).length} بلا أخطاء.</p>
     ${Object.keys(agg).length?`<p><b>الأخطاء التي تكررت:</b></p><ul>${Object.entries(agg).sort((a,b)=>b[1]-a[1]).map(([t,n])=>`<li>${esc(t)} <span class="sub">(${n})</span></li>`).join('')}</ul>`:''}
     <ol class="bn-att">${hist.attempts.slice().reverse().map(a=>`<li><span class="ltr">${new Date(a.date).toLocaleString('ar-SA-u-nu-latn',{dateStyle:'medium',timeStyle:'short'})}</span> — ${a.completed?'أكمل التجربة':'لم يكمل'}، ${a.mistakes.length?a.mistakes.length+' أخطاء':'بلا أخطاء'}</li>`).join('')}</ol>`}
  function finish(){S.finished=true;const ok=!S.mistakes.length;saveAttempt(true);const R=$('.bn-result',el);R.hidden=false;
    if(ok){const d=today();
      R.innerHTML=`<div class="bn-ready"><p class="bn-big">✓ جاهز للمعمل</p><p><b data-rn></b></p><p>${esc(cfg.title||'')}</p><p class="ltr">${d}</p><p class="bn-code ltr" data-rc aria-label="الرمز"></p><p class="sub" data-rnone>اكتب اسمك في خانة «اسمك» أعلى المنضدة ليظهر الرمز.</p>
       <p class="sub">أكملت التجربة كاملة بلا أي خطأ. اعرض هذه الشاشة على المدرب قبل التوصيل على المنضدة الحقيقية.</p>${hist.attempts.length>1?'<p class="sub">في «تقرير محاولاتك السابقة» أسفل الصفحة الأخطاء التي وقعت فيها قبل هذه المحاولة.</p>':''}</div>`;
      const upd=()=>{const nm=(hist.name||'').trim();$('[data-rn]',R).textContent=nm;$('[data-rc]',R).textContent=nm?readyCode(nm,course,cfg.key,d):'';$('[data-rnone]',R).hidden=!!nm};upd();
      $('[data-name]',el).addEventListener('input',upd)}
    else{R.innerHTML=`<div class="bn-notready"><p class="bn-big">أكملت التجربة، مع ${S.mistakes.length} ${S.mistakes.length===1?'خطأ':'أخطاء'}</p><p>لتحصل على «جاهز للمعمل» أعد التجربة من البداية وأكملها بلا أي خطأ. راجع قائمة الأخطاء أعلاه.</p><button type="button" class="btn primary" data-again>أعد المحاولة</button></div>`;
      $('[data-again]',R).addEventListener('click',resetAll)}
    R.scrollIntoView({block:'nearest',behavior:'smooth'})}
  function resetAll(){S.wires=[];NET=nets();Object.keys(S.knob).forEach(k=>S.knob[k]=findKnob(k).init||0);Object.keys(S.sw).forEach(k=>S.sw[k]=!!(SWD[k]||{}).init);S.mistakes=[];S.once={};S.timers={};S.rec={};S.trip=null;S.finished=false;S.sel=null;S.tapFrom=null;S.phys=X.init?X.init(P.v):{};if(X.prewire){S.wires=X.prewire(api);NET=nets()}
    persist();$('.bn-result',el).hidden=true;alertEl.hidden=true;$('[data-recmsg]',el).textContent='';drawWires();drawCtl();paintLog();paintTables();stepSig='';paintSteps();H('بدأت محاولة جديدة.')}
  /* ---- واجهة للتجربة ---- */
  const api={S,P:()=>P.v,conn,nets:()=>NET,TERM,mistake,once:(id,info)=>{if(S.once[id])return;S.once[id]=1;mistake(id,info)},rearm:id=>{delete S.once[id]},
    hold:(id,cond,sec)=>{if(cond){S.timers[id]=(S.timers[id]||0)+api.dt;return S.timers[id]>=sec}S.timers[id]=0;return false},dt:0,
    range:id=>meters[id].ranges[S.range[id]],ranges:id=>meters[id].ranges.slice(),maxRange:id=>Math.max(...meters[id].ranges),maxIdx:id=>meters[id].ranges.indexOf(Math.max(...meters[id].ranges)),
    has:id=>!!(TERM[id]||knobs[id]||(id in S.sw)),P2:cfg.params2?()=>cfg.params2.v:null,knob:id=>S.knob[id],sw:id=>S.sw[id],rec:S.rec,setSw:(id,v)=>{S.sw[id]=v;drawCtl()},solveDC,fmt,
    /* يحوّل عناصر بأسماء أطراف إلى عقد */
    solve(els){const N=NET.n;const E=els.map(e=>({a:NET.of[e.p],b:NET.of[e.n],g:e.g,i:e.i||0,src:e}));const V=solveDC(N,E);
      const vt=t=>V[NET.of[t]]||0;const cur=e=>(vt(e.p)-vt(e.n))*e.g-(e.i||0);/* التيار من p إلى n خلال العنصر */
      return {vt,cur,V}},
    solveAC(els){const N=NET.n,o=t=>NET.of[t];const st=els.map(e=>e.Y?{p:[o(e.p[0]),o(e.p[1])],q:[o(e.q[0]),o(e.q[1])],Y:e.Y}:{a:o(e.p),b:o(e.n),y:e.y,i:e.i});const V=solveAC(N,st);
      const vt=t=>V[o(t)]||[0,0],vd=(a,b)=>C.sub(vt(a),vt(b));const cur=e=>C.sub(C.mul(vd(e.p,e.n),e.y),e.i||[0,0]);return {vt,vd,cur,V}},C};
  /* ---- الحلقة ---- */
  let last=performance.now(),readings={};
  function loop(now){if(!document.body.contains(el))return;api.dt=Math.min(0.05,(now-last)/1000);last=now;S.t+=api.dt;
    try{readings=X.tick?X.tick(api)||{}:{}}catch(err){console.error(err)}
    $$('.bn-meter',svg).forEach(gm=>{const d=meters[gm.dataset.meter],r=readings[d.id];
      if(d.kind==='digital')gm.innerHTML=digitalSVG(d,r==null?'---':fmt(r,d.dp||0)+(d.unit?' '+d.unit:''));
      else{const rg=d.ranges?d.ranges[S.range[d.id]]:d.max;gm.innerHTML=gaugeSVG(d,r==null?0:r,rg,d.unit);
        if(r!=null){const fr=r/rg;if(api.hold('or-'+d.id,fr>1.03,0.25))api.once('over-range-'+d.id,{t:'القراءة تجاوزت مدى '+(d.name||d.unit),why:GENERIC['over-range'].why});else if(fr<0.9)api.rearm('over-range-'+d.id);
          if(!d.ac&&api.hold('rv-'+d.id,fr<-0.03,0.4))api.once('reverse-'+d.id,{t:(d.name||d.unit)+' موصّل بقطبية معكوسة',why:GENERIC.reverse.why});else if(fr>-0.01)api.rearm('reverse-'+d.id)}}});
    $$('.bn-led',svg).forEach(c=>{const on=!!readings[c.dataset.led];if(c.__on!==on){c.__on=on;c.setAttribute('fill',on?c.dataset.col:'#4a4f4c');c.setAttribute('filter',on?'url(#bnglow)':'')}});
    if(X.view&&X.view.frame)try{X.view.frame($('[data-view]',el),api)}catch(err){console.error(err)}
    stepT+=api.dt;if(stepT>0.4){stepT=0;paintSteps();if(S.mode==='probe'&&S.probe&&X.probe)H(X.probe(S.probe[0],S.probe[1],api))}
    requestAnimationFrame(loop)}
  let stepT=0;
  /* للاختبار الآلي فقط */
  el.__bench={api,wire:addWire,unwire:(a,b)=>{const i=S.wires.findIndex(w=>(w.a===a&&w.b===b)||(w.a===b&&w.b===a));if(i>=0)delWire(i)},knob:setKnob,sw:id=>toggleSw(id),press:(id,on)=>{S.sw[id]=!!on;drawCtl();if(on&&X.onSwitchOn)X.onSwitchOn(id,api);if(!on&&X.onSwitchOff)X.onSwitchOff(id,api)},range:(id,i)=>{S.range[id]=i;drawCtl()},rec:()=>{$('[data-rec]',el).click();return $('[data-recmsg]',el).textContent},act:i=>$$('[data-act]',el)[i].click(),read:()=>readings,reset:resetAll,
    tickN(n,dt){dt=dt||0.05;for(let i=0;i<n;i++){api.dt=dt;S.t+=dt;try{readings=X.tick?X.tick(api)||{}:{}}catch(err){console.error(err);throw err}}paintSteps();return readings},S};
  /* ---- البداية ---- */
  {const sv=LS.get(KEY+'-w',null);if(sv&&!Array.isArray(sv)){S.wires=(sv.wires||[]).filter(w=>TERM[w.a]&&TERM[w.b]);S.mistakes=sv.mistakes||[];S.rec=sv.rec||{};S.once=sv.once||{}}if(X.prewire&&!S.wires.length)S.wires=X.prewire(api);}NET=nets();
  drawWires();drawCtl();paintTools();paintLog();paintTables();paintSteps();paintHist();
  if(X.view&&X.view.mount)try{X.view.mount($('[data-view]',el),api)}catch(err){console.error(err)}
  requestAnimationFrame(loop);
  return api;
}
})(window);
