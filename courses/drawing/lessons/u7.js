/* Unit 7 — مخططات دوائر نظم القوى الكهربائية وعناصر حمايتها (ص 142–163)
   Lessons u7-l1 … u7-l6 (source: /home/claude/newc/ex/drw_c.md, unit 7).
   Drawings: every figure is redrawn as SVG from small local primitives. A drawing that is revealed step by step
   is a list of «stages» (functions of a class string) plus «groups» (which stages appear at each step); the newest
   group is drawn in blue (class nw).
   Labs: logic only (energised / current flowing / tripped), no numbers — except the time grading of figure (7-4),
   which uses the book's 180/120/60 ms. The «slow-motion» factor and the thermal heating bar are visual only. */
(function(B){
/* أعطال «اكتشف العطل» المخفية (challenge.js): false دائماً خارج وضع التحدي */
const chF=f=>!!(B.chF&&B.chF(f));
const lt=s=>`<span class="ltr">${s}</span>`;
const TIP='<span class="tg t-tip">توضيح للمتدرب — ليس من الكتاب</span> ';
const ADD='<span class="tg t-add">إضافة من خارج الكتاب</span> ';
const SOLT='<span class="tg t-add">حل مقترح (ليس من الكتاب)</span> ';

/* ---------- styles used only by this file (CSS variables only) ---------- */
(function css(){if(typeof document==='undefined'||document.getElementById('drw7-css'))return;const s=document.createElement('style');s.id='drw7-css';s.textContent=`
svg.d7 line,svg.d7 path,svg.d7 polyline,svg.d7 rect,svg.d7 circle,svg.d7 polygon{stroke:var(--fg);stroke-width:1.5;fill:none;stroke-linecap:round;stroke-linejoin:round}
svg.d7 .nw{stroke:var(--blue)}
svg.d7 .on{stroke:var(--live);stroke-width:2.2}
svg.d7 .fl{stroke:var(--live);stroke-width:3.2}
svg.d7 .off{stroke:var(--wire)}
svg.d7 .tr{stroke:var(--stop);stroke-width:2.2}
svg.d7 .F{fill:var(--fg);stroke:none}
svg.d7 .F.nw{fill:var(--blue)}
svg.d7 .F.on,svg.d7 .F.fl{fill:var(--live)}
svg.d7 .F.off{fill:var(--wire)}
svg.d7 .F.tr{fill:var(--stop)}
svg.d7 .ds{stroke-dasharray:7 5}
svg.d7 .dd{stroke-dasharray:11 3 2 3}
svg.d7 .dt{stroke-dasharray:1.5 3}
svg.d7 .th{stroke-width:1}
svg.d7 .tk{stroke-width:3}
svg.d7 .mu{stroke:var(--muted)}
svg.d7 .bg{fill:var(--surface)}
svg.d7 .hot{fill:var(--stop-soft)}
svg.d7 .glow{fill:var(--live-soft)}
svg.d7 .lampon{fill:#ffd23f;stroke:#b98510}
svg.d7 .hit{fill:transparent;stroke:none;cursor:pointer}
svg.d7 .fzone{fill:var(--stop-soft);stroke:var(--stop);stroke-width:1;cursor:pointer}
svg.d7 .fzone.sel{fill:var(--stop)}
svg.d7 text.txt.sm{font-size:10px}
svg.d7 text.txt.tiny{font-size:8.5px}
svg.d7 text.red{fill:var(--stop)}
svg.d7 text.lv{fill:var(--live)}
.svgbox.d7w svg{min-width:var(--mw)}
.d7pair{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px;align-items:end}
.d7pair figure,.d7pair>div{margin:0}
.d7cap{text-align:center;font-size:13px;color:var(--muted);margin-top:4px}
.d7lab .seg{flex-wrap:wrap;max-width:100%}
.d7row{display:flex;gap:8px 12px;flex-wrap:wrap;align-items:center;margin-top:10px}
.d7msg{margin-top:10px;font-size:14.5px;line-height:1.8;border-inline-start:3px solid var(--blue);background:var(--blue-soft);padding:8px 12px;border-radius:8px;min-height:2.2em}
.d7msg.bad{border-inline-start-color:var(--stop);background:var(--stop-soft)}
.d7msg.ok{border-inline-start-color:var(--on);background:var(--on-soft)}
.d7chips{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px;margin-top:10px}
.d7chip{background:var(--surface-2);border:1px solid var(--line);border-radius:10px;padding:6px 10px;font-size:13px}
.d7chip span{display:block;font-size:11.5px;color:var(--muted)}
.d7chip b{font-weight:700}
.d7chip.on{border-color:var(--live)}.d7chip.on b{color:var(--live)}
.d7chip.bad{border-color:var(--stop)}.d7chip.bad b{color:var(--stop)}
.d7chip.ok{border-color:var(--on)}.d7chip.ok b{color:var(--on)}
.d7heat{height:12px;border-radius:6px;background:var(--surface-2);border:1px solid var(--line);overflow:hidden;position:relative;margin-top:4px}
.d7heat i{position:absolute;inset:0 auto 0 0;background:var(--live);display:block;width:0}
.d7heat em{position:absolute;top:-2px;bottom:-2px;width:2px;background:var(--stop)}
.d7try{margin:6px 0 0;padding-inline-start:20px}
.d7q{border:1px solid var(--line);border-radius:12px;padding:10px 14px;margin:10px 0;background:var(--surface)}
.d7q summary{cursor:pointer;font-weight:600;line-height:1.7}
.d7rd{margin:8px 0}
html:not([data-r7="b"]) .r7b{display:none}
html[data-r7="b"] .r7a{display:none}
.d7tbl{border-collapse:collapse;font-size:13.5px;margin-top:8px}
.d7tbl th,.d7tbl td{border:1px solid var(--line);padding:4px 8px;text-align:center}
.d7tbl th{background:var(--surface-2)}
`;document.head.appendChild(s)})();

/* reading chooser for exercise 1 (Δ/Δ or <span class="ltr">Δ/Y</span>): one global switch, pure CSS (.r7a / .r7b) */
if(typeof document!=='undefined'&&!window.__r7){window.__r7=1;document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-r7]');if(!b)return;
  document.documentElement.setAttribute('data-r7',b.dataset.r7);document.querySelectorAll('[data-r7]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.r7===b.dataset.r7)))})}
const r7cur=()=>document.documentElement.getAttribute('data-r7')==='b'?'b':'a';
const r7ctl=()=>`<div class="d7rd"><span class="sub">اختر القراءة: </span><span class="seg" role="group"><button data-r7="a" aria-pressed="${r7cur()==='a'}">القراءة الأولى: دلتا / دلتا</button><button data-r7="b" aria-pressed="${r7cur()==='b'}">القراءة الثانية: Δ/Y</button></span></div>`;

/* ---------- small helpers (local copies, as in the other courses) ---------- */
function loopOn(el,fn){let last=performance.now();const f=now=>{if(!document.body.contains(el))return;const dt=Math.min(0.05,Math.max(0,(now-last)/1000));last=now;try{fn(dt)}catch(e){console.error(e);return}requestAnimationFrame(f)};requestAnimationFrame(f)}
function stepsUI(host,steps){let i=0;
  const draw=()=>{host.innerHTML=steps.map((s,j)=>`<li class="${j<i?'done':j===i?'cur':''}"><span class="k">${j<i?'✓':j+1}</span><div><h4>${B.ltrU(s.t)}</h4><p>${B.ltrU(s.x)}</p>${j===i?`<div class="act">${s.done?'<span class="hint">بانتظار تنفيذك…</span> <button class="btn" data-next>تخطَّ</button>':'<button class="btn primary" data-next>التالي</button>'}</div>`:''}</div></li>`).join('')+
    (i>=steps.length?`<li class="cur"><span class="k">✓</span><div><h4>أحسنت، أنهيت التجربة</h4><p style="display:block">جرّب حالات أخرى، أو أعد التجربة من أولها.</p><div class="act"><button class="btn" data-restart>إعادة التجربة</button></div></div></li>`:'')};
  host.addEventListener('click',e=>{if(e.target.closest('[data-next]')){i++;draw()}if(e.target.closest('[data-restart]')){i=0;draw()}});draw();
  return {check(){let m=0,moved=false;while(m++<steps.length){const s=steps[i];if(s&&s.done&&s.done()){i++;moved=true}else break}if(moved)draw()}}}
const segHTML=(attr,items,cur)=>`<div class="seg" role="group">${items.map(([v,l])=>`<button data-${attr}="${v}" aria-pressed="${String(v)===String(cur)}">${l}</button>`).join('')}</div>`;
const segSet=(el,attr,v)=>el.querySelectorAll(`[data-${attr}]`).forEach(b=>b.setAttribute('aria-pressed',String(String(b.dataset[attr])===String(v))));
const swHTML=(id,b,label,on)=>`<button class="sw" id="${id}" aria-pressed="${on?'true':'false'}"><span class="knob"></span><b>${b}</b><small>${label}</small></button>`;
const tryList=items=>`<div class="callout"><b>جرّب:</b><ol class="d7try">${items.map(x=>`<li>${x}</li>`).join('')}</ol></div>`;
const chip=(lbl,val,cls)=>`<div class="d7chip ${cls||''}"><span>${lbl}</span><b>${val}</b></div>`;
const Qd=(n,q,ans)=>`<details class="d7q"><summary>${n}: ${q}</summary><div class="callout"><b>إجابة مقترحة (ليست من الكتاب):</b> ${ans}</div></details>`;

/* ---------- SVG primitives ---------- */
const isNw=c=>/\bnw\b/.test(c||'');
const T=(x,y,s,c,o)=>{o=o||{};return `<text class="txt${isNw(c)?' b':''}${o.cl?' '+o.cl:''}" x="${x}" y="${y}" text-anchor="${o.a||'middle'}"${o.fs?` font-size="${o.fs}"`:''}>${s}</text>`};
const A=(x,y,s,c,o)=>{o=o||{};return `<text class="txt ar${isNw(c)?' b':''}${o.cl?' '+o.cl:''}" x="${x}" y="${y}" text-anchor="${o.a||'middle'}" font-size="${o.fs||11}">${s}</text>`};
const ln=(x1,y1,x2,y2,c)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${c||''}"/>`;
const pl=(pts,c)=>`<polyline points="${pts.map(p=>p.join(',')).join(' ')}" class="${c||''}"/>`;
const pa=(d,c)=>`<path d="${d}" class="${c||''}"/>`;
const ci=(x,y,r,c)=>`<circle cx="${x}" cy="${y}" r="${r}" class="${c||''}"/>`;
const rc=(x,y,w,h,c)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" class="${c||''}"/>`;
const cs=c=>String(c||'').replace(/\b(ds|dd|dt|th|tk|bg)\b/g,'').replace(/\s+/g,' ').trim();
const nd=(x,y,c)=>`<circle cx="${x}" cy="${y}" r="2.8" class="F ${cs(c)}"/>`;
const tm=(x,y,c)=>`<circle cx="${x}" cy="${y}" r="3.2" class="bg ${cs(c)}"/>`;
const arrowL=(x,y,c)=>`<polygon points="${x},${y} ${x+8},${y-4} ${x+8},${y+4}" class="F ${cs(c)}"/>`;
const arrowD=(x,y,c)=>`<polygon points="${x},${y} ${x-4},${y-8} ${x+4},${y-8}" class="F ${cs(c)}"/>`;
const arrowU=(x,y,c)=>`<polygon points="${x},${y} ${x-4},${y+8} ${x+4},${y+8}" class="F ${cs(c)}"/>`;
const arrowR=(x,y,c)=>`<polygon points="${x},${y} ${x-8},${y-4} ${x-8},${y+4}" class="F ${cs(c)}"/>`;
/* slash with conductor count on a vertical line */
const tick=(x,y,n,c)=>ln(x-6,y+5,x+6,y-5,cs(c))+(n?T(x+9,y-2,n,c,{a:'start',fs:10.5}):'');
const tickH=(x,y,n,c)=>ln(x-5,y+6,x+5,y-6,cs(c))+(n?T(x+2,y-9,n,c,{fs:10.5}):'');
/* vertical switching contact between y and y+h; open = blade drawn at an angle (as in the book's figures) */
const sw=(x,y,h,open,c)=>ln(x,y,x,y+8,c)+ln(x,y+h-8,x,y+h,c)+(open?ln(x,y+h-8,x-11,y+9,c):ln(x,y+h-8,x,y+8,c));
const swMid=(x,y,h,open)=>[open?x-5.5:x,y+h/2];
/* operators at the end of a dotted linkage: |⊞ (circuit breaker / protective switch), |-∨ (disconnector) */
const opCB=(x,y,c)=>ln(x-9,y-6,x-9,y+6,cs(c))+rc(x-6,y-5,10,10,cs(c))+ln(x-6,y,x+4,y,cs(c))+ln(x-1,y-5,x-1,y+5,cs(c));
const opDS=(x,y,c)=>ln(x-9,y-6,x-9,y+6,cs(c))+ln(x-9,y,x-5,y,cs(c))+pl([[x-5,y],[x-3,y+4],[x+1,y-4],[x+3,y]],cs(c));
const thermal=(x,y,c)=>pa(`M${x-8} ${y+3}h4v-6h8v6h4`,cs(c));
const fuse=(x,y,c,h)=>{h=h||22;return rc(x-5,y,10,h,cs(c))+ln(x,y,x,y+h,cs(c)+' th')};
const fuseH=(x,y,c,w)=>{w=w||22;return rc(x,y-5,w,10,cs(c))+ln(x,y,x+w,y,cs(c)+' th')};
const wd=(x,y,w,h,c)=>`<rect x="${x-w/2}" y="${y}" width="${w}" height="${h}" class="F ${cs(c)}"/>`;
const earth=(x,y,c)=>ln(x,y,x,y+6,cs(c))+ln(x-8,y+6,x+8,y+6,cs(c))+ln(x-5,y+9,x+5,y+9,cs(c))+ln(x-2,y+12,x+2,y+12,cs(c));
const earthL=(x,y,c)=>ln(x,y,x-6,y,cs(c))+ln(x-6,y-8,x-6,y+8,cs(c))+ln(x-9,y-5,x-9,y+5,cs(c))+ln(x-12,y-2,x-12,y+2,cs(c));
const motor=(x,y,r,a,b,c)=>ci(x,y,r,cs(c))+T(x,y-1,a,c,{fs:13})+(b?T(x,y+13,b,c,{fs:11}):'');
const meter=(x,y,s,c)=>ci(x,y,9,'bg '+cs(c))+T(x,y+4,s,c,{fs:10});
/* transformer glyphs in the single-line symbol */
const glyph=(x,y,k,c)=>{c=cs(c);return !k?'':k==='Y'?ln(x,y,x,y-7,c)+ln(x,y,x-6,y+4,c)+ln(x,y,x+6,y+4,c)
 :k==='D'?pa(`M${x} ${y-7}L${x+6.5} ${y+4.5}L${x-6.5} ${y+4.5}Z`,c)
 :ln(x,y,x,y-5,c)+ln(x,y-5,x+3,y-8,c)+ln(x,y,x-5,y+3,c)+ln(x-5,y+3,x-5,y+7,c)+ln(x,y,x+5,y+3,c)+ln(x+5,y+3,x+8,y+1,c)};
const trSL=(x,y,k1,k2,c,r)=>{r=r||13;const d=r*1.35;return ci(x,y,r,cs(c))+ci(x,y+d,r,cs(c))+glyph(x,y-1,k1,c)+glyph(x,y+d+1,k2,c)};
const trSLh=(x,y,c,r)=>{r=r||12;return ci(x,y,r,cs(c))+ci(x+r*1.35,y,r,cs(c))};
const ctSL=(x,y,c)=>ci(x,y,6.5,cs(c));
/* relay box of the single-line diagrams: thermal + I> */
const relay=(x,y,c)=>rc(x,y,26,30,'bg '+cs(c))+thermal(x+13,y+9,c)+ln(x,y+15,x+26,y+15,cs(c)+' th')+T(x+13,y+26,'I&gt;',c,{fs:9.5});
/* single-line thermal (⊓) + magnetic (arrow) release next to a trunk at x */
const releaseSL=(x,y,c,n)=>thermal(x-22,y,c)+ln(x,y+8,x-34,y+8,cs(c))+arrowL(x-40,y+8,c)+ln(x-30,y-3,x-30,y+3,cs(c))+(n?tick(x,y+4,n,c):'');
const sep=(y,w,c)=>ln(4,y,w-4,y,'ds mu th '+cs(c));
const SV=(vb,body,lbl)=>`<svg class="d7" viewBox="${vb}" role="img"${lbl?` aria-label="${lbl}"`:''}>${body}</svg>`;
const box=(svg,mw,minw)=>`<div class="svgbox${minw?' d7w':''}" style="max-width:${mw||560}px;margin-inline:auto${minw?`;--mw:${minw}px`:''}">${svg}</div>`;
/* staged drawing: groups[i] = stage indexes added at step i; step k draws groups 0..k, group k in blue when hl */
const seq=(stages,groups,k,hl)=>{let s='';groups.forEach((g,i)=>{if(i>k)return;g.forEach(j=>{s+=stages[j](i===k&&hl?'nw':'')})});return s};
const allG=st=>[st.map((_,i)=>i)];
/* drawn example (no given): each step = text + the drawing up to that step */
const drawEx=o=>({title:o.title,ref:o.ref,q:o.q,note:o.note,solve:()=>o.steps.map((s,i)=>({t:`<p>${s}</p>`+o.svg(i),final:i===o.steps.length-1}))});
const fig2=(a,b)=>`<div class="d7pair">${a}${b}</div>`;
const cap=(s)=>`<div class="d7cap">${s}</div>`;

/* =====================================================================================
   Figures (7-1) and (7-2): transformer substation and distribution transformer
   ===================================================================================== */
const X71=[130,160,190];
/* breaker section of the executive diagram (7-1): 3-pole breaker in a frame, 3 CTs, 3 overcurrent relays */
function brk71(y0,c){const X=X71;let s='';
 X.forEach((x,i)=>{s+=ln(x,y0,x,y0+14,c)+sw(x,y0+14,30,true,c)+ln(x,y0+44,x,y0+132,c)+T(x+6,y0+21,['1','3','5'][i],c,{a:'start',fs:9})+T(x+6,y0+43,['2','4','6'][i],c,{a:'start',fs:9});
  s+=wd(x,y0+64,7,26,c)+rc(x+6,y0+66,4,22,cs(c));
  const xv=98+i*4;s+=pl([[x+8,y0+88],[x+8,y0+98+i*7],[xv,y0+98+i*7],[xv,y0+64+i*14],[96,y0+64+i*14]],cs(c)+' th');
  s+=rc(64,y0+58+i*14,32,12,'bg '+cs(c))+pa(`M${67} ${y0+66+i*14}h3v-5h5v5h3`,cs(c)+' th')+T(88,y0+67+i*14,'I&gt;',c,{fs:7.5});});
 s+=rc(108,y0+10,100,40,'dd th '+cs(c));
 s+=ln(74,y0+29,X[2]-5.5,y0+29,'dt '+cs(c))+opCB(66,y0+29,c)+ln(70,y0+58,70,y0+35,'dt '+cs(c));
 return s}
function f71x(o){o=o||{};const X=X71,W=300;
 const st=[
  c=>[62,130,262,390,522].map(y=>sep(y,W)).join('')+[[31,1],[96,2],[196,3],[326,4],[456,5],[566,6]].map(([y,n])=>ci(291,y,7,'mu th')+T(291,y+4,n,'',{fs:10,cl:'m'})).join(''),
  c=>T(165,12,'13.8 kV 3~ 60 Hz',c)+[0,1,2].map(i=>ln(40,22+i*10,276,22+i*10,c)+T(36,26+i*10,'L'+(i+1),c,{a:'end',fs:10})+nd(X[i],22+i*10,c)+ln(X[i],22+i*10,X[i],62,c)).join(''),
  c=>X.map((x,i)=>ln(x,62,x,74,c)+sw(x,74,30,true,c)+ln(x,104,x,130,c)+T(x+6,81,['1','3','5'][i],c,{a:'start',fs:9})+T(x+6,103,['2','4','6'][i],c,{a:'start',fs:9})).join('')+ln(74,89,X[2]-5.5,89,'dt '+cs(c))+opDS(66,89,c),
  c=>brk71(130,c),
  c=>{let s='';X.forEach((x,i)=>{s+=ln(x,262,x,280,c)+T(x+6,276,['1U','1V','1W'][i],c,{a:'start',fs:9})+wd(x,280,10,28,c)+ln(x,308,x,316,c)+ln(x,322,x,326,c)+wd(x,326,10,14,c);const j=(i+1)%3;s+=pl([[x,340],[x,344],[X[j],350],[X[j],354]],cs(c)+' th')+wd(x,354,10,14,c)+ln(x,368,x,390,c)+T(x+6,384,['2U','2V','2W'][i],c,{a:'start',fs:9})});
   s+=ln(X[0],316,X[2],316,c)+ln(X[0],322,250,322,c)+nd(250,322,c)+ln(250,322,268,322,c)+earth(268,322,c)+T(250,276,'PE',c,{fs:10})+ln(250,282,250,390,'dd '+cs(c));
   s+=T(110,276,o.v15?'15000 V':'13800 V',c,{a:'end',fs:10})+T(110,302,'±4 %',c,{a:'end',fs:10})+T(110,334,'100 kVA',c,{a:'end',fs:10})+T(110,346,'60 Hz',c,{a:'end',fs:10})+T(110,362,'400/231 V',c,{a:'end',fs:10});return s},
  c=>brk71(390,c),
  c=>{let s='';X.forEach((x,i)=>{s+=ln(x,522,x,548+i*10,c)+nd(x,548+i*10,c)});[0,1,2].forEach(i=>{s+=ln(40,548+i*10,276,548+i*10,c)+T(36,552+i*10,'L'+(i+1),c,{a:'end',fs:10})});
   s+=ln(250,522,250,578,'dd '+cs(c))+nd(250,578,c)+ln(40,578,276,578,'dd '+cs(c))+T(36,582,'PE',c,{a:'end',fs:10})+T(165,600,'380/220 V 3/N ~ 60 Hz',c);return s}];
 return {st,W,H:610}}
function slBrk(x,y0,n,c){return ln(x,y0,x,y0+18,c)+rc(x-14,y0+14,24,38,cs(c))+sw(x,y0+18,30,true,c)+ln(x,y0+48,x,y0+132,c)
 +ln(x-40,y0+33,x-5.5,y0+33,'dt '+cs(c))+opCB(x-48,y0+33,c)+relay(x+44,y0+18,c)+ln(x+44,y0+33,x+14,y0+33,'dt '+cs(c))+arrowL(x+10,y0+33,c)
 +ctSL(x,y0+84,c)+ln(x+6.5,y0+84,x+57,y0+84,c)+ln(x+57,y0+84,x+57,y0+48,c)+tick(x+57,y0+68,'4',c)+tick(x,y0+112,n,c)}
function f71l(o){o=o||{};const x=80,W=200;
 const st=[
  c=>[62,130,262,390,522].map(y=>sep(y,W)).join(''),
  c=>T(100,28,'13.8 kV 3~ 60 Hz',c)+ln(20,40,180,40,'tk '+cs(c))+nd(x,40,c)+ln(x,40,x,62,c)+tick(x,52,'3',c),
  c=>ln(x,62,x,74,c)+sw(x,74,30,true,c)+ln(x,104,x,130,c)+tick(x,118,'3',c)+ln(x-40,89,x-5.5,89,'dt '+cs(c))+opDS(x-48,89,c),
  c=>slBrk(x,130,'3',c),
  c=>ln(x,262,x,287,c)+trSL(x,300,'Y','Z',c)+ln(x,330.5,x,390,c)+tick(x,360,'4',c)+T(100,286,o.v15?'15000 V':'13800 V',c,{a:'start',fs:10})+T(100,298,'±4 % 100 kVA',c,{a:'start',fs:10})+T(102,312,'3~ 60 Hz',c,{a:'start',fs:10})+T(100,340,'400/231 V',c,{a:'start',fs:10}),
  c=>slBrk(x,390,'4',c),
  c=>ln(x,522,x,560,c)+tick(x,540,'4',c)+nd(x,560,c)+ln(20,560,180,560,'tk '+cs(c))+T(100,580,'380/220 V 3/N ~ 60 Hz',c)];
 return {st,W,H:610}}
const svg71x=(k,hl,o)=>{const f=f71x(o);return SV(`0 0 ${f.W} ${f.H}`,seq(f.st,o&&o.groups||allG(f.st),k==null?99:k,hl),'الدائرة التنفيذية لمحطة المحولات')};
const svg71l=(k,hl,o)=>{const f=f71l(o);return SV(`0 0 ${f.W} ${f.H}`,seq(f.st,o&&o.groups||allG(f.st),k==null?99:k,hl),'الدائرة الخطية لمحطة المحولات')};
/* both parts side by side in one SVG (for the step-by-step example): executive at left, single-line at right */
const svg71both=(k,hl,o)=>{const a=f71x(o),b=f71l(o);const g=o&&o.groups||allG(a.st);return SV(`0 0 ${a.W+b.W+10} 610`,seq(a.st,g,k,hl)+`<g transform="translate(${a.W+10} 0)">${seq(b.st,o&&o.lgroups||g,k,hl)}</g>`+ln(a.W+5,10,a.W+5,600,'mu th'),'محطة المحولات')};

function f72x(book){const X=[120,150,180],W=300;
 const st=[
  c=>T(160,12,book?'380/220 V 3/N/PE ~ 60 Hz':'13.8 kV 3~ 60 Hz',c,book?{cl:'red'}:{})+(book?[['L1',24],['L2',34],['L3',44],['N',54]]:[['L1',24],['L2',34],['L3',44]]).map(([l,y])=>ln(40,y,290,y,c)+T(36,y+4,l,c,{a:'end',fs:10})).join('')+ln(40,64,290,64,'dd '+cs(c))+T(36,68,'PE',c,{a:'end',fs:10})+X.map((x,i)=>nd(x,24+i*10,c)+ln(x,24+i*10,x,82,c)).join(''),
  c=>X.map((x,i)=>sw(x,82,30,true,c)+T(x+6,89,['1','3','5'][i],c,{a:'start',fs:9})+T(x+6,111,['2','4','6'][i],c,{a:'start',fs:9})).join('')+ln(74,97,X[2]-5.5,97,'dt '+cs(c))+opDS(66,97,c),
  c=>X.map(x=>ln(x,112,x,124,c)+fuse(x,124,c,24)+T(x+8,130,'1',c,{a:'start',fs:8.5})+T(x+8,146,'2',c,{a:'start',fs:8.5})+ln(x,148,x,166,c)).join('')+T(98,140,'F1..3',c,{a:'end',fs:10}),
  c=>{let s='';X.forEach((x,i)=>{s+=T(x+6,163,['1U','1V','1W'][i],c,{a:'start',fs:9})+wd(x,166,10,26,c)+ln(x,192,x,198,c)+ln(x,206,x,210,c)+wd(x,210,10,26,c)+ln(x,236,x,264,c)+T(x+6,248,['2U','2V','2W'][i],c,{a:'start',fs:9})});
   return s+ln(X[0],198,X[2],198,c)+ln(X[0],206,250,206,c)+nd(250,206,c)+T(250,199,'PE/N',c,{fs:9.5})+ln(250,206,270,206,'dd '+cs(c))+earth(270,206,c)+ln(250,206,250,390,'dd '+cs(c))+T(98,206,'T1',c,{a:'end',fs:10})},
  c=>{let s=rc(104,256,92,82,'dd th '+cs(c));X.forEach((x,i)=>{s+=sw(x,264,28,true,c)+T(x+6,262,['1','3','5'][i],c,{a:'start',fs:9})+ln(x,292,x,356,c)+rc(x-11,298,22,14,'bg '+cs(c))+thermal(x,307,c)+rc(x-11,314,22,14,'bg '+cs(c))+T(x,325,'I&gt;',c,{fs:9})+T(x+6,348,['2','4','6'][i],c,{a:'start',fs:9})});
   return s+ln(72,278,X[2]-5.5,278,'dt '+cs(c))+opCB(64,278,c)+T(46,282,'Q1',c,{a:'end',fs:10})+pl([[X[0]-11,321],[86,321],[86,278]],'dt '+cs(c))+ln(X[0]-11,305,86,305,'dt '+cs(c))},
  c=>{let s='';[0,1,2].forEach(i=>{const y=360+i*10;s+=ln(40,y,290,y,c)+T(36,y+4,'L'+(i+1),c,{a:'end',fs:10})+ln(X[i],356,X[i],y,c)+nd(X[i],y,c)});
   return s+ln(40,390,290,390,'dd '+cs(c))+nd(250,390,c)+T(36,394,'PE/N',c,{a:'end',fs:10})+T(165,410,'380/220 V 3/N/PE ~ 60 Hz',c)}];
 return {st,W,H:418}}
function f72l(){const x=90,W=200;
 const st=[
  c=>T(100,28,'13.8 kV 3~ 60 Hz',c)+ln(20,40,180,40,'tk '+cs(c))+nd(x,40,c)+ln(x,40,x,66,c)+tick(x,54,'3',c),
  c=>sw(x,66,30,true,c)+ln(x-40,81,x-5.5,81,'dt '+cs(c))+opDS(x-48,81,c)+T(x-62,85,'Q1',c,{a:'end',fs:10})+ln(x,96,x,112,c)+tick(x,88,'3',c),
  c=>fuse(x,112,c,26)+T(x-14,130,'F1..3',c,{a:'end',fs:10})+ln(x,138,x,170,c)+tick(x,154,'3',c),
  c=>trSL(x,183,'Y','Z',c)+T(x-20,204,'400/231 V',c,{a:'end',fs:10})+ln(x,213.5,x,250,c)+tick(x,232,'4',c),
  c=>sw(x,250,28,true,c)+ln(x-40,264,x-5.5,264,'dt '+cs(c))+opCB(x-48,264,c)+T(x-62,268,'Q1',c,{a:'end',fs:10})+tick(x,270,'3',c)+ln(x,278,x,340,c)+releaseSL(x,298,c,'4')+tick(x,322,'4',c),
  c=>nd(x,340,c)+ln(20,340,180,340,'tk '+cs(c))+T(100,360,'380/220 V 3~/PE/N 60 Hz',c)];
 return {st,W,H:368}}
const svg72x=(book,k,hl)=>{const f=f72x(book);return SV(`0 0 ${f.W} ${f.H}`,seq(f.st,f.st.map((_,i)=>[i]),k==null?99:k,hl),'الدائرة التنفيذية لمحول التوزيع')};
const svg72l=(k,hl)=>{const f=f72l();return SV(`0 0 ${f.W} ${f.H}`,seq(f.st,f.st.map((_,i)=>[i]),k==null?99:k,hl),'الدائرة الخطية لمحول التوزيع')};

/* ---------- figure (7-2) with «كما في الكتاب / المصحح» (top label + swapped captions) ---------- */
function fig72Widget(el){let md='book';
 const draw=()=>{const bk=md==='book';
  el.innerHTML=`<div class="d7row"><span class="sub">الشكل (7-2):</span>${segHTML('m72',[['book','كما في الكتاب'],['fixed','المصحح']],md)}</div>`+
  fig2(`<div>${box(svg72l(),230)}${cap(bk?'الدائرة التنفيذية':'الدائرة الخطية')}</div>`,`<div>${box(svg72x(bk),330)}${cap(bk?'الدائرة الخطية':'الدائرة التنفيذية')}</div>`)+
  `<p class="d7cap"><b>الشكل (7-2)</b> محول توزيع ثلاثي الأوجه <span class="ref">ص 146</span></p>`+
  (bk?'<p class="sub">في الكتاب: القضبان العليا للدائرة التنفيذية مكتوب عليها <span class="ltr">380/220 V 3/N/PE</span> ومعها قضيب N، وتسمية «الدائرة الخطية» تحت الرسم متعدد الخطوط و«الدائرة التنفيذية» تحت الرسم أحادي الخط.</p>'
   :'<div class="callout err"><span class="fixnote">القضبان العليا تغذي الملف الابتدائي للمحول، فجهدها <span class="ltr">13.8 kV 3~ 60 Hz</span> كما في الرسم الخطي المجاور (لا <span class="ltr">380/220 V</span>، ولا موصل تعادل N في جهة الجهد العالي). والتسميتان تحت الرسمين معكوستان: الرسم متعدد الخطوط هو التنفيذي، وأحادي الخط هو الخطي.</span></div>');
  el.querySelectorAll('[data-m72]').forEach(b=>b.onclick=()=>{md=b.dataset.m72;draw()});};
 draw()}

/* ---------- lab u7-l1: the substation of figure (7-1), single-line, logic only ---------- */
function labSubstation(el){
 const S={q0:false,q1:false,q2:false,t1:false,t2:false,fault:null,warned:false,trips:0,cleared:false};
 el.innerHTML=`<div class="d7lab"><div class="grid">
  <section class="panel c7"><h2>محطة المحولات <small>مبنية على الشكل (7-1) ص 145 — الدائرة الخطية</small></h2><div id="ssv"></div>
   <div class="legend"><span><i style="background:var(--live)"></i>عليه جهد</span><span><i style="background:var(--live);height:5px"></i>يمر فيه تيار إلى المستهلكين</span><span><i style="background:var(--wire)"></i>بلا جهد</span></div></section>
  <section class="panel c5"><h2>لوحة التشغيل</h2>
   <div class="d7row">${swHTML('sq0','Q0','مفتاح الفصل',0)}${swHTML('sq1','Q1','قدرة الجهد العالي',0)}${swHTML('sq2','Q2','قدرة الجهد المنخفض',0)}</div>
   <div class="d7row"><button class="btn warn" id="flv">قصر في شبكة الجهد المنخفض</button><button class="btn warn" id="ftr">عطل داخل المحول</button><button class="btn" id="fclr">أزل العطل</button></div>
   <div class="d7chips" id="schips"></div><div class="d7msg" id="smsg">ابدأ بإغلاق مفتاح الفصل Q0.</div>
   ${tryList(['أغلق Q0 ثم Q1 ثم Q2 وتابع الجهد من شبكة <span class="ltr">13.8 kV</span> حتى المستهلكين.','والحمل يعمل، حاول فتح مفتاح الفصل Q0.','اصنع قصراً في شبكة الجهد المنخفض، ثم عطلاً داخل المحول: أي مفتاح يفصل؟','افصل المحطة بالترتيب: Q2 ثم Q1 ثم Q0.'])}
   <h3 class="sm">خطوات التجربة</h3><ol class="steps" id="ssteps"></ol></section></div></div>`;
 const $=s=>el.querySelector(s),msg=(t,k)=>{const m=$('#smsg');m.innerHTML=t;m.className='d7msg'+(k?' '+k:'')};
 const en=()=>{const e1=S.q0,e2=e1&&S.q1&&!chF('q1open'),e3=e2&&S.q2;return {e1,e2,e3}};
 const draw=()=>{const {e1,e2,e3}=en(),f=e3;const K=e=>e?(f?'fl':'on'):'off';const x=110;
  const hv=f?'fl':'on',c1=K(e1),c2=K(e2),c3=K(e3);
  let s=T(110,16,'13.8 kV 3~ 60 Hz','',{fs:11})+ln(20,28,210,28,'tk '+hv)+nd(x,28,hv)+ln(x,28,x,60,hv);
  /* Q0 disconnector */
  s+=ln(x,60,x,68,hv)+ln(x,82,x,90,c1)+(S.q0?ln(x,82,x,68,c1):ln(x,82,x-11,69,'off'))+ln(x-48,75,S.q0?x:x-5.5,75,'dt th mu')+opDS(x-56,75,'')+T(x-70,79,'Q0','',{a:'end',fs:11})+`<rect class="hit" data-k="q0" x="${x-70}" y="58" width="90" height="36"/>`;
  s+=ln(x,90,x,116,c1);
  /* Q1 breaker + CT + relay */
  const brk=(y,q,ca,cb,tr,key,lbl)=>ln(x,y,x,y+8,ca)+ln(x,y+22,x,y+30,cb)+(q?ln(x,y+22,x,y+8,cb):ln(x,y+22,x-11,y+9,'off'))+rc(x-14,y-4,28,38,'th '+(tr?'tr':''))+ln(x-48,y+15,q?x:x-5.5,y+15,'dt th mu')+opCB(x-56,y+15,'')+T(x-70,y+19,lbl,'',{a:'end',fs:11})+`<rect class="hit" data-k="${key}" x="${x-70}" y="${y-6}" width="90" height="42"/>`
   +rc(x+50,y,26,30,'bg '+(tr?'tr':''))+thermal(x+63,y+9,tr?'tr':'')+ln(x+50,y+15,x+76,y+15,'th')+T(x+63,y+26,'I&gt;',tr?'':'',{fs:9.5,cl:tr?'red':''})+ln(x+50,y+15,x+18,y+15,'dt th '+(tr?'tr':'mu'))+arrowL(x+14,y+15,tr?'tr':'');
  s+=brk(116,S.q1,c1,c2,S.t1,'q1','Q1')+ln(x,146,x,199,c2)+ctSL(x,170,c2)+pl([[x+6.5,170],[x+63,170],[x+63,146]],'th')+tick(x+63,160,'4','');
  /* transformer */
  s+=trSL(x,212,'Y','Z',c2)+T(x+22,206,'T1','',{a:'start',fs:11})+T(x+22,240,'400/231 V','',{a:'start',fs:9.5,cl:'m'})+ln(x,242.5,x,276,c2);
  if(S.fault==='tr')s+=pl([[x-30,205],[x-20,213],[x-26,216],[x-14,228]],'tr')+arrowR(x-12,230,'tr');
  s+=brk(276,S.q2,c2,c3,S.t2,'q2','Q2')+ln(x,306,x,370,c3)+ctSL(x,332,c3)+pl([[x+6.5,332],[x+63,332],[x+63,306]],'th')+tick(x+63,320,'4','');
  /* LV network + consumers */
  s+=ln(20,370,250,370,'tk '+c3)+nd(x,370,c3)+T(205,362,'380/220 V','',{fs:10});
  [45,175,230].forEach(lx=>{s+=ln(lx,370,lx,394,c3)+ci(lx,404,10,e3?'lampon':'bg')+ln(lx-7,397,lx+7,411,'th')+ln(lx+7,397,lx-7,411,'th')});
  if(S.fault==='lv')s+=pl([[60,382],[72,392],[66,395],[80,406]],'tr')+arrowR(82,408,'tr');
  $('#ssv').innerHTML=box(SV('0 0 270 425',s,'محطة المحولات: الدائرة الخطية الحية'),420);
  $('#ssv').querySelectorAll('[data-k]').forEach(r=>r.addEventListener('click',()=>act(r.dataset.k)));
  [['sq0','q0'],['sq1','q1'],['sq2','q2']].forEach(([id,k])=>$('#'+id).setAttribute('aria-pressed',String(S[k])));
  $('#schips').innerHTML=chip('شبكة <span class="ltr">13.8 kV</span>','موجودة','on')+chip('المحول T1',e2?'مغذّى':'مفصول',e2?'on':'')+chip('شبكة الجهد المنخفض',e3?'مغذّاة':'بلا جهد',e3?'ok':'bad')+chip('آخر فصل بالمرحل',S.t1?'Q1':S.t2?'Q2':'—',(S.t1||S.t2)?'bad':'');
  steps.check()};
 const protect=()=>{const {e2,e3}=en();
  /* أعطال مخفية (وضع التحدي فقط): قصر دائم في شبكة الجهد المنخفض / عطل داخل المحول / مرحل Q2 لا يعمل — برسالة محايدة لا تكشف السبب */
  const hlv=chF('hlv')&&!S.fault,htr=chF('htr')&&!S.fault;
  if((S.fault==='lv'||hlv)&&e3&&chF('q2relay')){S.q1=false;S.t1=true;S.trips++;msg('فصل المرحل المفتاح <b>Q1</b>.','bad');return true}
  if(hlv&&e3){S.q2=false;S.t2=true;S.trips++;msg('فصل المرحل المفتاح <b>Q2</b> فور إغلاقه.','bad');return true}
  if(htr&&e2){S.q1=false;S.t1=true;S.trips++;msg('فصل المرحل المفتاح <b>Q1</b> فور إغلاقه.','bad');return true}
  if(S.fault==='lv'&&e3){S.q2=false;S.t2=true;S.trips++;msg('القصر في شبكة الجهد المنخفض: تيار كبير في محول التيار → المرحل يفصل <b>Q2</b>. بقي المحول مغذّى، وانقطع الجهد عن المستهلكين فقط.','bad');return true}
  if(S.fault==='tr'&&e2){S.q1=false;S.t1=true;S.trips++;msg('العطل داخل المحول يمر تياره في محول التيار قبل المحول → المرحل يفصل <b>Q1</b> فينفصل المحول عن شبكة الجهد العالي.','bad');return true}
  return false};
 function act(k){const {e2}=en();
  if(k==='q0'){if(S.q1){S.warned=true;msg('<b>ممنوع!</b> مفتاح الفصل لا يُفتح ولا يُغلق والتيار يمكن أن يمر فيه (Q1 مغلق): يحدث قوس كهربائي. افتح مفتاح القدرة Q1 أولاً.','bad');draw();return}
   S.q0=!S.q0;msg(S.q0?'أُغلق مفتاح الفصل Q0 ولا تيار فيه (Q1 مفتوح). الآن أغلق Q1.':'فُتح Q0 بلا تيار: صار بين المحطة وشبكة الجهد العالي فاصل مرئي.')}
  else if(k==='q1'){S.q1=!S.q1;if(S.q1){S.t1=false;if(!S.q0)msg('أُغلق Q1 لكن لا جهد يصل إليه لأن مفتاح الفصل Q0 مفتوح.');else if(!protect())msg('أُغلق Q1: المحول مغذّى من جهة الجهد العالي. أغلق Q2 لتغذية المستهلكين.','ok')}else msg('فُتح Q1: انقطع التيار عن المحول. الآن يجوز فتح مفتاح الفصل Q0.')}
  else if(k==='q2'){S.q2=!S.q2;if(S.q2){S.t2=false;if(!e2)msg('أُغلق Q2 لكن المحول غير مغذّى.');else if(!protect())msg('أُغلق Q2: وصل الجهد <span class="ltr">380/220 V</span> إلى المستهلكين.','ok')}else msg('فُتح Q2: انقطع الجهد المنخفض، وما زال المحول مغذّى.')}
  draw()}
 [['sq0','q0'],['sq1','q1'],['sq2','q2']].forEach(([id,k])=>$('#'+id).addEventListener('click',()=>act(k)));
 $('#flv').addEventListener('click',()=>{S.fault='lv';if(!protect())msg('القصر موجود في شبكة الجهد المنخفض، لكن لا تيار يمر إليه الآن. أغلق المفاتيح وشاهد ما يحدث.');draw()});
 $('#ftr').addEventListener('click',()=>{S.fault='tr';if(!protect())msg('العطل موجود داخل المحول، لكن المحول غير مغذّى الآن.');draw()});
 $('#fclr').addEventListener('click',()=>{if(S.fault&&S.trips)S.cleared=true;S.fault=null;msg('أُزيل العطل. أعد إغلاق المفتاح الذي فصل.');draw()});
 const steps=stepsUI($('#ssteps'),[
  {t:'غذِّ المستهلكين',x:'أغلق Q0 ثم Q1 ثم Q2 (اضغط المفتاح في اللوحة أو على الرسم).',done:()=>en().e3},
  {t:'جرّب فتح مفتاح الفصل والحمل يعمل',x:'اضغط Q0 الآن. مفتاح الفصل لا يُشغَّل إلا بلا تيار.',done:()=>S.warned},
  {t:'قصر في شبكة الجهد المنخفض',x:'اضغط «قصر في شبكة الجهد المنخفض» ولاحظ أي مفتاح يفصل.',done:()=>S.t2},
  {t:'أزل العطل وأعد التغذية',x:'اضغط «أزل العطل» ثم أغلق Q2 من جديد.',done:()=>S.cleared&&en().e3},
  {t:'افصل المحطة بالترتيب الصحيح',x:'افتح Q2 ثم Q1 ثم Q0.',done:()=>!S.q0&&!S.q1&&!S.q2&&S.cleared}]);
 draw()}

B.lesson({
 id:'u7-l1',unit:7,order:1,pages:'142–146',
 title:'محطة المحولات ومحول التوزيع',
 summary:'المخطط الأحادي لمحطة محولات تربط شبكة <span class="ltr">13.8 kV</span> بشبكة <span class="ltr">380/220 V</span>: مفتاح الفصل، ومفتاح قدرة الجهد العالي بمحولات التيار والمرحلات، والمحول، ومفتاح قدرة الجهد المنخفض؛ ثم محول توزيع ثلاثي الأوجه بدائرتيه الخطية والتنفيذية.',
 stations:[
  (/*DCML-BEGIN*/(window.DCML=window.DCML||(function(){
/* «مختبر مصغّر» — أدوات صغيرة مشتركة لمحطات الأسلوب التفاعلي في مقرر آلات التيار المستمر والمحولات.
   تُعرَّف مرة واحدة (أول درس في كل ملف وحدة يحمل نسخة مطابقة، والأولى التي تُحمَّل هي المستعملة). */
const css=`
.ml{--mlh:42px}
.ml .ml-in{margin:0 0 10px;color:var(--muted);font-size:14px;line-height:1.8}
.ml .ml-b{font:inherit;font-size:14px;min-height:var(--mlh);padding:7px 14px;border-radius:12px;border:1.5px solid var(--line);background:var(--bg);color:var(--fg);cursor:pointer;line-height:1.5;text-align:start}
.ml .ml-b:hover:not(:disabled){border-color:var(--blue)}
.ml .ml-b:disabled{cursor:default}
.ml .ml-b[aria-pressed="true"]{background:var(--blue);border-color:var(--blue);color:#fff}
.ml .ml-b.ok{border-color:var(--on);background:var(--on-soft);color:var(--fg)}
.ml .ml-b.no{border-color:var(--stop);background:var(--stop-soft);color:var(--fg)}
.ml .ml-b.dim{opacity:.55}
.ml .ml-row{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:10px}
.ml .ml-fb{margin-top:10px;font-size:14.5px;line-height:1.8;border-inline-start:3px solid var(--blue);background:var(--blue-soft);padding:8px 12px;border-radius:8px}
.ml .ml-fb.bad{border-inline-start-color:var(--stop);background:var(--stop-soft)}
.ml .ml-fb.warn{border-inline-start-color:var(--live);background:var(--live-soft)}
.ml .ml-fb:empty,.ml [hidden]{display:none}
.ml .ml-it{border:1px solid var(--line);border-radius:12px;padding:10px 12px;margin-top:8px;background:var(--surface)}
.ml .ml-it p{margin:0 0 8px;line-height:1.75}
.ml .ml-it .ml-row{margin-top:0}
.ml .ml-why{margin-top:8px;font-size:14px;line-height:1.75}
.ml .ml-score{margin-top:10px;font-weight:700}
.ml .ml-ord{margin:10px 0 0;padding-inline-start:22px}
.ml .ml-ord li{margin:6px 0;padding:6px 10px;border-radius:10px;background:var(--on-soft);border:1px solid var(--on);line-height:1.6}
.ml .ml-pool{display:grid;gap:8px;margin-top:10px}
.ml .ml-sl{display:block;margin-top:12px;font-size:14px}
.ml .ml-sl .ml-h{display:flex;justify-content:space-between;gap:8px;align-items:baseline}
.ml .ml-sl b{font-family:var(--mono);direction:ltr;unicode-bidi:isolate;color:var(--blue-ink);font-size:15px;white-space:nowrap}
.ml .ml-sl input{width:100%;accent-color:var(--blue);direction:ltr;margin:6px 0 0;height:28px}
.ml .ml-seg{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}
.ml .ml-seg .ml-b{padding:6px 12px;min-height:40px}
.ml .ml-lbl{font-size:14px;margin-top:12px}
.ml .ml-facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(128px,1fr));gap:8px;margin-top:12px}
.ml .ml-facts div{background:var(--surface-2);border-radius:12px;padding:8px 10px;min-width:0}
.ml .ml-facts span{display:block;font-size:12.5px;color:var(--muted);line-height:1.5}
.ml .ml-facts b{display:block;font-family:var(--mono);font-size:17px;direction:ltr;text-align:end;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ml .ml-facts div.hi{background:var(--blue-soft)}
.ml .ml-facts div.bad{background:var(--stop-soft)}
.ml .ml-bar{margin-top:10px}
.ml .ml-bar .ml-h{display:flex;justify-content:space-between;gap:8px;font-size:13px;color:var(--muted)}
.ml .ml-bar .ml-h b{font-family:var(--mono);direction:ltr;unicode-bidi:isolate;color:var(--fg)}
.ml .ml-bar .ml-t{height:14px;border-radius:99px;background:var(--surface-2);overflow:hidden;margin-top:4px;direction:ltr}
.ml .ml-bar .ml-t i{display:block;height:100%;border-radius:99px;transition:width .2s}
.ml .ml-plot{margin-top:12px;max-width:440px;margin-inline:auto}
.ml .ml-plot svg{width:100%;height:auto;display:block;touch-action:pan-y}
.ml .ml-pic{margin-top:10px;max-width:520px;margin-inline:auto}
.ml .ml-pic svg{width:100%;height:auto;display:block}
.ml .ml-lock{opacity:.45;pointer-events:none;filter:grayscale(.4)}
.ml .ml-pd{border:1.5px dashed var(--blue);border-radius:12px;padding:10px 12px;background:var(--bg)}
.ml .ml-pd .ml-q{font-weight:600;margin-bottom:8px;line-height:1.7}
.ml .ml-pd .ml-pool{margin-top:0}
.ml .ml-tag{display:inline-block;font-size:12px;font-weight:700;padding:1px 9px;border-radius:999px;background:var(--live-soft);color:var(--live);margin-inline-end:6px}
.ml .ml-ill{font-size:12.5px;color:var(--muted);margin-top:8px}
.ml .ltr{direction:ltr;unicode-bidi:isolate;white-space:nowrap}
`;
const addCss=()=>{if(document.getElementById('dcml-css'))return;const s=document.createElement('style');s.id='dcml-css';s.textContent=css;document.head.appendChild(s)};
const lt=s=>`<span class="ltr">${s}</span>`;
const fm=(B,x,d)=>{const s=B.fmtN(x,d);return /^-0(\.0+)?$/.test(s)?s.slice(1):String(s).replace(/^-/,'−')};
const q=(el,s)=>el.querySelector(s),qa=(el,s)=>[...el.querySelectorAll(s)];
const start=(el,B,intro)=>{addCss();el.classList.add('ml');return intro?`<p class="ml-in">${intro}</p>`:''};
const RX=/(\(\d+-\d+\)|\d[\d.,]*\s?(?:rpm|kHz|Hz|kV|V|mA|A|kW|W|Ω|%|N\.m|VA)(?![A-Za-z]))/g;
/* يثبّت اتجاه «رقم + وحدة» داخل النص العربي (مثل 0.3 A و 1000 rpm) حتى لا ينقلب */
function bidi(root){if(!root)return;const tw=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>{const p=n.parentElement;if(!p||p.closest('svg,.katex,.ltr,.ml-facts b,.ml-sl b,.ml-bar b'))return 3;RX.lastIndex=0;return RX.test(n.data)?1:3}});const L=[];while(tw.nextNode())L.push(tw.currentNode);
 L.forEach(n=>{RX.lastIndex=0;const parts=n.data.split(RX);if(parts.length<2)return;const f=document.createDocumentFragment();parts.forEach((p,i)=>{if(!p)return;if(i%2){const sp=document.createElement('span');sp.className='ltr';sp.textContent=p;f.appendChild(sp)}else f.appendChild(document.createTextNode(p))});n.replaceWith(f)})}
const fin=(el,B)=>{try{B.math(el)}catch(e){}bidi(el)};
/* ترتيب ثابت «مخلوط» للعناصر (لا عشوائي حتى تبقى الصفحة نفسها في كل مرة)، ولا يساوي الترتيب الصحيح */
const mix=n=>{const a=[...Array(n).keys()];let s=n*7+3;for(let i=n-1;i>0;i--){s=(s*48271)%2147483647;const j=s%(i+1);[a[i],a[j]]=[a[j],a[i]]}
 if(a.every((v,i)=>v===i)&&n>1)a.push(a.shift());return a};

/* ---- صح أم خطأ: items [[العبارة, true|false, السبب], …] ---- */
function tf(el,B,o){let h=start(el,B,o.intro);
 h+=o.items.map((it,i)=>`<div class="ml-it" data-i="${i}"><p>${it[0]}</p><div class="ml-row"><button type="button" class="ml-b" data-a="1">صح</button><button type="button" class="ml-b" data-a="0">خطأ</button></div><div class="ml-why" hidden></div></div>`).join('');
 h+=`<div class="ml-score" hidden></div>`;el.innerHTML=h;fin(el,B);
 const done={};
 qa(el,'.ml-it').forEach(box=>{const i=+box.dataset.i,it=o.items[i],w=q(box,'.ml-why');
  qa(box,'[data-a]').forEach(b=>b.onclick=()=>{const ans=b.dataset.a==='1',ok=ans===!!it[1];
   qa(box,'[data-a]').forEach(x=>{x.disabled=true;x.classList.remove('ok','no','dim');if((x.dataset.a==='1')===!!it[1])x.classList.add('ok');else x.classList.add(x===b?'no':'dim')});
   w.innerHTML=`<b>${ok?'صحيح.':'ليس كذلك.'}</b> العبارة ${it[1]?'صحيحة':'خاطئة'}: ${it[2]||''}`;w.hidden=false;fin(w,B);done[i]=ok;
   const n=Object.keys(done).length;if(n===o.items.length){const s=q(el,'.ml-score');const k=Object.values(done).filter(Boolean).length;
    s.innerHTML=`أصبت ${lt(k+' / '+n)}. ${k===n?'ممتاز.':''} <button type="button" class="ml-b" data-rs>أعد المحاولة</button>`;s.hidden=false;
    q(s,'[data-rs]').onclick=()=>tf(el,B,o)}})})}

/* ---- رتّب الخطوات: steps [نص | [نص, لماذا ليست الآن]] بالترتيب الصحيح ---- */
function order(el,B,o){const S=o.steps.map(s=>Array.isArray(s)?s:[s,'']);const m=mix(S.length);let nx=0;
 el.innerHTML=start(el,B,o.intro||'اضغط الخطوات بالترتيب الذي تنفذها به.')+`<ol class="ml-ord"></ol><div class="ml-pool">${m.map(i=>`<button type="button" class="ml-b" data-i="${i}">${S[i][0]}</button>`).join('')}</div><div class="ml-fb"></div><div class="ml-row"><button type="button" class="ml-b" data-rs>ابدأ من جديد</button></div>`;
 fin(el,B);const ol=q(el,'.ml-ord'),fb=q(el,'.ml-fb');
 qa(el,'.ml-pool [data-i]').forEach(b=>b.onclick=()=>{const i=+b.dataset.i;
  if(i===nx){const li=document.createElement('li');li.innerHTML=S[i][0];ol.appendChild(li);fin(li,B);b.hidden=true;nx++;fb.className='ml-fb';
   fb.innerHTML=nx===S.length?`<b>أحسنت، الترتيب كامل.</b> ${o.done||''}`:(o.after&&o.after[i]?o.after[i]:'');fin(fb,B)}
  else{fb.className='ml-fb bad';fb.innerHTML=`<b>ليست هذه الخطوة التالية.</b> ${S[i][1]||''}${o.hint?' '+o.hint(nx):''}`;fin(fb,B)}});
 q(el,'[data-rs]').onclick=()=>order(el,B,o)}

/* ---- صنّف: cats [اسم, …]; items [[نص, رقم الصنف, السبب], …] ---- */
function sort(el,B,o){let h=start(el,B,o.intro);
 h+=o.items.map((it,i)=>`<div class="ml-it" data-i="${i}"><p>${it[0]}</p><div class="ml-row">${o.cats.map((c,j)=>`<button type="button" class="ml-b" data-c="${j}">${c}</button>`).join('')}</div><div class="ml-why" hidden></div></div>`).join('')+`<div class="ml-score" hidden></div>`;
 el.innerHTML=h;fin(el,B);const done={};
 qa(el,'.ml-it').forEach(box=>{const i=+box.dataset.i,it=o.items[i],w=q(box,'.ml-why');
  qa(box,'[data-c]').forEach(b=>b.onclick=()=>{const ok=+b.dataset.c===it[1];
   qa(box,'[data-c]').forEach(x=>{x.disabled=true;x.classList.remove('ok','no','dim');x.classList.add(+x.dataset.c===it[1]?'ok':x===b?'no':'dim')});
   w.innerHTML=`<b>${ok?'صحيح.':'ليس كذلك.'}</b> ${it[2]||''}`;w.hidden=false;fin(w,B);done[i]=ok;
   if(Object.keys(done).length===o.items.length){const s=q(el,'.ml-score'),k=Object.values(done).filter(Boolean).length;
    s.innerHTML=`أصبت ${lt(k+' / '+o.items.length)}. <button type="button" class="ml-b" data-rs>أعد المحاولة</button>`;s.hidden=false;q(s,'[data-rs]').onclick=()=>sort(el,B,o)}})})}

/* ---- مواقف قصيرة: cases [{q, opts:[[نص, صحيح؟, السبب]]}] ---- */
function cases(el,B,o){let h=start(el,B,o.intro);
 h+=o.cases.map((c,i)=>`<div class="ml-it" data-i="${i}"><p><b>${o.cases.length>1?(i+1)+'. ':''}</b>${c.q}</p><div class="ml-pool">${c.opts.map((x,j)=>`<button type="button" class="ml-b" data-j="${j}">${x[0]}</button>`).join('')}</div><div class="ml-why" hidden></div></div>`).join('');
 el.innerHTML=h;fin(el,B);
 qa(el,'.ml-it').forEach(box=>{const c=o.cases[+box.dataset.i],w=q(box,'.ml-why'),bs=qa(box,'[data-j]');
  bs.forEach(b=>b.onclick=()=>{const j=+b.dataset.j,ok=!!c.opts[j][1];
   bs.forEach(x=>{x.disabled=true;x.classList.remove('ok','no','dim');x.classList.add(c.opts[+x.dataset.j][1]?'ok':x===b?'no':'dim')});
   const right=c.opts.find(x=>x[1]);w.innerHTML=`<b>${ok?'صحيح.':'ليس هذا.'}</b> ${c.opts[j][2]||''}${!ok&&right&&right[2]?'<br>'+right[2]:''} <button type="button" class="ml-b" data-r style="min-height:34px;padding:3px 10px">حاول مرة أخرى</button>`;w.hidden=false;fin(w,B);
   q(w,'[data-r]').onclick=()=>{bs.forEach(x=>{x.disabled=false;x.classList.remove('ok','no','dim')});w.hidden=true}})})}

/* ---- رسم بياني صغير: {xr:[a,b], yr:[a,b], xl, yl, curves:[{f|pts, col, dash, w}], dots:[[x,y,col]], cur:[x,y], xt:[...], yt:[...], fx, fy} ---- */
function plot(B,o){const W=o.w||340,H=o.h||210,L=46,R=12,T=26,Bm=34,[x0,x1]=o.xr,[y0,y1]=o.yr;
 const X=x=>L+(x-x0)/((x1-x0)||1)*(W-L-R),Y=y=>H-Bm-(y-y0)/((y1-y0)||1)*(H-T-Bm);const f1=v=>(+v).toFixed(1);
 const tk=(a,b)=>{const sp=(b-a)||1,e=Math.pow(10,Math.floor(Math.log10(sp/4))),st=[1,2,2.5,5,10].map(k=>k*e).find(k=>sp/k<=5.01);const r=[];for(let v=Math.ceil(a/st-1e-9)*st;v<=b+1e-9;v+=st)r.push(+v.toFixed(10));return r};
 const xt=o.xt||tk(x0,x1),yt=o.yt||tk(y0,y1),fx=o.fx||(v=>fm(B,v)),fy=o.fy||(v=>fm(B,v));
 let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${o.aria||'رسم بياني'}" style="font-family:var(--font)" direction="ltr">`;
 s+=yt.map(v=>`<line x1="${L}" x2="${W-R}" y1="${f1(Y(v))}" y2="${f1(Y(v))}" stroke="var(--line)" stroke-width="1"/><text x="${L-6}" y="${f1(Y(v)+4)}" text-anchor="end" font-size="11" fill="var(--muted)" font-family="var(--mono)">${o.noYt?'':fy(v)}</text>`).join('');
 s+=xt.map(v=>`<text x="${f1(X(v))}" y="${H-Bm+15}" text-anchor="middle" font-size="11" fill="var(--muted)" font-family="var(--mono)">${o.noXt?'':fx(v)}</text>`).join('');
 s+=`<path d="M${L} ${T-4}V${H-Bm}H${W-R+4}" fill="none" stroke="var(--fg)" stroke-width="1.6"/>`;
 (o.curves||[]).forEach(c=>{let p=c.pts;if(!p){p=[];const n=c.n||80;for(let i=0;i<=n;i++){const x=x0+(x1-x0)*i/n,y=c.f(x);if(isFinite(y))p.push([x,y])}}
  const cl=v=>Math.max(y0-(y1-y0)*0.04,Math.min(y1+(y1-y0)*0.04,v));
  s+=`<path d="${p.map((q,i)=>(i?'L':'M')+f1(X(q[0]))+' '+f1(Y(cl(q[1])))).join('')}" fill="none" stroke="var(${c.col||'--blue'})" stroke-width="${c.w||2.6}" ${c.dash?`stroke-dasharray="${c.dash}"`:''} stroke-linejoin="round" stroke-linecap="round"/>`;
  if(c.lab){const q=p[p.length-1];s+=`<text x="${f1(X(q[0])-4)}" y="${f1(Y(cl(q[1]))-7)}" text-anchor="end" font-size="11.5" fill="var(${c.col||'--blue'})" font-weight="700" ${/[؀-ۿ]/.test(c.lab)?'direction="rtl"':''}>${c.lab}</text>`}});
 (o.dots||[]).forEach(d=>{s+=`<circle cx="${f1(X(d[0]))}" cy="${f1(Y(d[1]))}" r="3.6" fill="var(${d[2]||'--fg'})"/>`});
 if(o.cur){const [cx,cy]=o.cur;if(isFinite(cx)&&isFinite(cy)){const yy=Math.max(y0,Math.min(y1,cy));s+=`<path d="M${f1(X(cx))} ${H-Bm}V${f1(Y(yy))}H${L}" fill="none" stroke="var(--live)" stroke-width="1.4" stroke-dasharray="4 3"/><circle cx="${f1(X(cx))}" cy="${f1(Y(yy))}" r="6.5" fill="var(--live)" stroke="var(--surface)" stroke-width="2"/>`}}
 const ar=t=>/[\u0600-\u06FF]/.test(t||'');s+=`<text x="${W-R}" y="${H-4}" text-anchor="${ar(o.xl)?'start':'end'}" ${ar(o.xl)?'direction="rtl"':''} font-size="12" fill="var(--fg)" font-weight="600">${o.xl||''}</text>`;
 s+=`<text x="${L-40}" y="13" text-anchor="${ar(o.yl)?'end':'start'}" ${ar(o.yl)?'direction="rtl"':''} font-size="12" fill="var(--fg)" font-weight="600">${o.yl||''}</text>`;
 return s+'</svg>'}

/* ---- المختبر المصغّر: منزلقات/أزرار + نتيجة حية + «توقّع أولاً» ----
 o={intro, predict:{q,opts:[[t,ok,why]]}, ins:[{k,l,u,min,max,step,v,dp} | {k,l,seg:[[v,label]],v} | {k,l,sw:true,v,on,off}],
    tp:{id,defs} (قيم توضيحية من تبويب المختبر), ill:true (ينبّه أن القيم توضيحية), calc:(s,P,B)=>({facts:[[label,html,cls]], bars:[{l,v,max,u,dp,col}], plot:{…}, pic:svg, msg:html, cls:'bad'|'warn'})} */
function lab(el,B,o){let h=start(el,B,o.intro);let P={v:{},trainer:false};
 if(o.tp){const hid=document.createElement('div');const dfl=()=>({v:Object.fromEntries(o.tp.defs.map(d=>[d.k,d.value])),trainer:false});try{P=(B.chOn&&B.chOn())?dfl():B.params(hid,o.tp.id,o.tp.defs)}catch(e){P={v:Object.fromEntries(o.tp.defs.map(d=>[d.k,d.value])),trainer:false}}}
 const s={};o.ins.forEach(i=>s[i.k]=i.v);
 if(o.predict)h+=`<div class="ml-pd"><div class="ml-q"><span class="ml-tag">توقّع أولاً</span>${o.predict.q}</div><div class="ml-pool">${o.predict.opts.map((x,j)=>`<button type="button" class="ml-b" data-pj="${j}">${x[0]}</button>`).join('')}</div><div class="ml-fb" data-pfb hidden></div></div>`;
 h+=`<div class="ml-body${o.predict?' ml-lock':''}">`;
 h+=o.ins.map(i=>i.seg?`<div class="ml-lbl">${i.l}</div><div class="ml-seg" data-k="${i.k}">${i.seg.map(([v,l])=>`<button type="button" class="ml-b" data-v="${v}">${l}</button>`).join('')}</div>`
   :i.sw?`<div class="ml-row"><button type="button" class="ml-b" data-sw="${i.k}">${i.l}</button></div>`
   :`<label class="ml-sl"><span class="ml-h"><span>${i.l}</span><b data-ov="${i.k}"></b></span><input type="range" data-k="${i.k}" min="${i.min}" max="${i.max}" step="${i.step||'any'}" value="${i.v}" aria-label="${String(i.l).replace(/<[^>]+>/g,'')}"></label>`).join('');
 h+=`<div data-pic></div><div class="ml-facts" data-facts></div><div data-bars></div><div class="ml-plot" data-plot></div><div class="ml-fb" data-msg></div>`;
 h+=(o.tp||o.ill)?`<p class="ml-ill">${P.trainer?'الأرقام هنا <b>قيم المدرب</b> (من تبويب «المختبر»).':'الأرقام هنا <b>قيم توضيحية</b> ليست من الكتاب'+(o.tp?'، ويستطيع المدرب تغييرها من «قيم المدرب» في تبويب «المختبر».':'.')}</p>`:'';
 h+=`</div>`;el.innerHTML=h;fin(el,B);
 const body=q(el,'.ml-body');
 const draw=()=>{o.ins.forEach(i=>{if(i.seg)qa(el,`[data-k="${i.k}"] .ml-b`).forEach(b=>b.setAttribute('aria-pressed',String(String(b.dataset.v)===String(s[i.k]))));
   else if(i.sw){const b=q(el,`[data-sw="${i.k}"]`);b.setAttribute('aria-pressed',String(!!s[i.k]));if(i.on){b.innerHTML=s[i.k]?i.on:i.off;bidi(b)}}
   else{const ov=q(el,`[data-ov="${i.k}"]`);ov.textContent=(i.fmt?i.fmt(s[i.k]):fm(B,+s[i.k],i.dp))+(i.u?' '+i.u:'')}});
  let r={};try{r=o.calc(s,P.v,B)||{}}catch(e){console.error(e);r={msg:''}}
  q(el,'[data-pic]').innerHTML=r.pic?`<div class="ml-pic">${r.pic}</div>`:'';
  q(el,'[data-facts]').innerHTML=(r.facts||[]).map(f=>`<div class="${f[2]||''}"><span>${f[0]}</span><b>${f[1]}</b></div>`).join('');
  q(el,'[data-bars]').innerHTML=(r.bars||[]).map(b=>{const k=Math.max(0,Math.min(1,b.v/(b.max||1)));return `<div class="ml-bar"><div class="ml-h"><span>${b.l}</span><b>${b.txt!=null?b.txt:fm(B,b.v,b.dp)+(b.u?' '+b.u:'')}</b></div><div class="ml-t"><i style="width:${(k*100).toFixed(1)}%;background:var(${b.col||'--blue'})"></i></div></div>`}).join('');
  q(el,'[data-plot]').innerHTML=r.plot?plot(B,r.plot):'';
  const m=q(el,'[data-msg]');m.className='ml-fb'+(r.cls?' '+r.cls:'');m.innerHTML=r.msg||'';if(r.msg)fin(m,B);bidi(q(el,'[data-facts]'));bidi(q(el,'[data-bars]'))};
 qa(el,'input[data-k]').forEach(inp=>inp.oninput=()=>{s[inp.dataset.k]=+inp.value;draw()});
 o.ins.filter(i=>i.seg).forEach(i=>qa(el,`[data-k="${i.k}"] .ml-b`).forEach(b=>b.onclick=()=>{const v=b.dataset.v;s[i.k]=isNaN(+v)?v:+v;draw()}));
 qa(el,'[data-sw]').forEach(b=>b.onclick=()=>{const k=b.dataset.sw;s[k]=s[k]?0:1;draw()});
 if(o.predict){const bs=qa(el,'[data-pj]'),fb=q(el,'[data-pfb]');
  bs.forEach(b=>b.onclick=()=>{const j=+b.dataset.pj,op=o.predict.opts[j],ok=!!op[1],right=o.predict.opts.find(x=>x[1]);
   bs.forEach(x=>{x.disabled=true;x.classList.remove('ok','no','dim');x.classList.add(o.predict.opts[+x.dataset.pj][1]?'ok':x===b?'no':'dim')});
   fb.className='ml-fb'+(ok?'':' warn');fb.innerHTML=`<b>${ok?'توقّعك صحيح.':'ليس هذا.'}</b> ${op[2]||''}${!ok&&right[2]?'<br>'+right[2]:''}<br><b>الآن جرّب بنفسك في الأسفل وتأكد.</b> <button type="button" class="ml-b" data-pr style="min-height:34px;padding:3px 10px">غيّر توقّعك</button>`;fb.hidden=false;fin(fb,B);
   body.classList.remove('ml-lock');
   q(fb,'[data-pr]').onclick=()=>{bs.forEach(x=>{x.disabled=false;x.classList.remove('ok','no','dim')});fb.hidden=true}})}
 draw();return {s,draw,P}}

/* ---- جهاز قياس بمؤشر: {v, max, lab:'V', txt, zero:'c' (صفر في المنتصف للقطبية)} ---- */
function gauge(B,o){const cx=110,cy=104,r=82,c=o.zero==='c';const k=Math.max(c?-1.06:-0.03,Math.min(1.06,(o.v||0)/(o.max||1)));
 const a=c?(-90+k*60)*Math.PI/180:(-150+k*120)*Math.PI/180,a0=c?-150:-150,a1=-30;const P=(ang,R)=>[cx+R*Math.cos(ang*Math.PI/180),cy+R*Math.sin(ang*Math.PI/180)];
 const [x0,y0]=P(a0,r),[x1,y1]=P(a1,r);let t='';for(let i=0;i<=8;i++){const g=a0+(a1-a0)*i/8,[p,q]=P(g,r),[u,w]=P(g,r-(i%4?7:12));t+=`<line x1="${p.toFixed(1)}" y1="${q.toFixed(1)}" x2="${u.toFixed(1)}" y2="${w.toFixed(1)}" stroke="var(--fg)" stroke-width="1.4"/>`}
 const nx=cx+(r-10)*Math.cos(a),ny=cy+(r-10)*Math.sin(a);
 return `<svg viewBox="0 0 220 132" role="img" aria-label="جهاز قياس" style="font-family:var(--font);max-width:240px;display:block;margin-inline:auto" direction="ltr"><path d="M${x0.toFixed(1)} ${y0.toFixed(1)}A${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}" fill="none" stroke="var(--fg)" stroke-width="2"/>${t}${c?`<text x="${cx}" y="${cy-r-6}" text-anchor="middle" font-size="12" fill="var(--muted)" font-family="var(--mono)">0</text><text x="${(x0+8).toFixed(1)}" y="${(y0+16).toFixed(1)}" font-size="14" fill="var(--stop)" font-family="var(--mono)">−</text><text x="${(x1-16).toFixed(1)}" y="${(y1+16).toFixed(1)}" font-size="14" fill="var(--on)" font-family="var(--mono)">+</text>`:''}<line x1="${cx}" y1="${cy}" x2="${nx.toFixed(1)}" y2="${ny.toFixed(1)}" stroke="var(--live)" stroke-width="3.4" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="6" fill="var(--fg)"/><text x="${cx}" y="${cy+24}" text-anchor="middle" font-size="15" font-weight="700" fill="var(--fg)" font-family="var(--mono)">${o.lab||''}</text>${o.txt!=null?`<text x="${cx}" y="${cy-28}" text-anchor="middle" font-size="14" fill="var(--blue-ink)" font-family="var(--mono)" font-weight="700">${o.txt}</text>`:''}</svg>`}

return {tf,order,sort,cases,lab,plot,gauge,lt,fm,mix};
})())/*DCML-END*/,(/*DRA-BEGIN*/window.DRA=window.DRA||(function(){
/* رسوم المحطات لمقرر الرسم الفني (الوحدتان 6 و7): نعيد استعمال رسوم الدرس نفسه داخل إطار المحطة 360×320.
   ألوان ثابتة فاتحة داخل الرسم (خلفية الرسم فاتحة في الوضعين الفاتح والداكن). */
const V='--fg:#2C4A40;--muted:#66665A;--surface:#FBF6EE;--surface-2:#EEE5D3;--bg:#FBF6EE;--line:#CDBFA6;--wire:#7E8C80;--live:#C2620F;--live-soft:#F7DDBE;--blue:#2F6FB0;--blue-ink:#1F4E80;--blue-soft:#DCE8F5;--on:#12855A;--on-soft:#D3EEDF;--stop:#B8322A;--stop-soft:#F6D5CF';
const f1=v=>(+v).toFixed(1);
/* parts:[{svg, box:[x,y,w,h], vb:'x y w h' (اختياري: جزء من الرسم), tips:[[x,y,w,h,نص]] بإحداثيات الرسم الأصلي}] ; rt: تلميحات بإحداثيات الإطار ; extra: عناصر إضافية */
function art(o){let s=`<svg viewBox="0 0 360 320" role="img" aria-label="${o.aria||''}" style="font-family:var(--font);${V}" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="150" fill="${o.bg||'#DDEFE6'}"/>`;
 (o.parts||[]).forEach(p=>{let svg=p.svg;const m=/viewBox="([-\d.]+)[\s,]+([-\d.]+)[\s,]+([-\d.]+)[\s,]+([-\d.]+)"/.exec(svg);
  const vb=(p.vb||m.slice(1,5).join(' ')).split(/[\s,]+/).map(Number);const [vx,vy,vw,vh]=vb;const b=p.box;
  const k=Math.min(b[2]/vw,b[3]/vh),ox=b[0]+(b[2]-vw*k)/2,oy=b[1]+(b[3]-vh*k)/2;
  svg=svg.replace(/viewBox="[^"]*"/,`viewBox="${vb.join(' ')}"`).replace(/<svg\b/,`<svg x="${f1(ox)}" y="${f1(oy)}" width="${f1(vw*k)}" height="${f1(vh*k)}" preserveAspectRatio="xMidYMid meet" overflow="hidden"`);
  svg=svg.replace(/<svg\b([^>]*?)>/,(a,g)=>/style=/.test(g)?a:`<svg${g} style="width:${f1(vw*k)}px;height:${f1(vh*k)}px">`);
  s+=svg;
  (p.tips||[]).forEach(([x,y,w,h,t])=>{s+=`<rect x="${f1(ox+(x-vx)*k)}" y="${f1(oy+(y-vy)*k)}" width="${f1(w*k)}" height="${f1(h*k)}" rx="5" fill="transparent" data-tip="${t}"/>`})});
 (o.rt||[]).forEach(([x,y,w,h,t])=>{s+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="transparent" data-tip="${t}"/>`});
 return s+(o.extra||'')+'</svg>'}
/* نص عربي في الإطار */
const L=(x,y,t,fs,w,col)=>`<text x="${x}" y="${y}" text-anchor="middle" font-size="${fs||13}" fill="${col||'#2C4A40'}"${w?` font-weight="${w}"`:''}${/[0-9A-Za-z]/.test(t)?' direction="rtl"':''}>${t}</text>`;
return {art,L,V};
})()/*DRA-END*/),{intro:true}),

  {st:1,short:'أهداف الوحدة',title:'الوحدة السابعة: مخططات دوائر نظم القوى الكهربائية وعناصر حمايتها',ref:'ص 142–143',
   q:'كيف ترسم شبكة كاملة من محطة المحولات حتى المستهلك بخط واحد؟',
   art:DRA.art({aria:'يساراً جزء من مخطط أحادي الخط، ويميناً مفتاح قدرة مع محولات تيار ومرحلات حماية',
    parts:[{svg:svg71l(),vb:'10 0 190 262',box:[24,28,140,232],tips:[[10,0,190,262,'مخطط أحادي الخط: خط واحد يمثل كل الموصلات (الهدف الأول).']]},
           {svg:svg71x(),vb:'40 130 230 132',box:[176,70,166,110],tips:[[40,130,230,132,'دائرة حماية: مفتاح قدرة تفصله مرحلات تأخذ إشارتها من محولات التيار (الهدف الثاني).']]}],
    extra:DRA.L(94,288,'المخطط أحادي الخط',12.5,700)+DRA.L(259,206,'دوائر الحماية',12.5,700)}),
   cap:'<b>مرّر المؤشر على كل رسم (أو المسه في الجوال) لتعرف معناه.</b>',
   side:[{predict:{q:'ما الهدف العام للوحدة السابعة؟',opts:[
     ['رسم دوائر بدء المحركات',false,'هذا موضوع الوحدة السادسة.'],
     ['معرفة المخطط أحادي الخط لشبكة كهربائية ومعرفة دوائر الحماية',true,'نص الهدف العام (ص 143).'],
     ['حساب تيار القصر في الشبكة',false,'الكتاب لا يتناول الحسابات في هذه الوحدة.']]}}],
   body:[
    {book:'<p><b>الهدف العام للوحدة:</b> معرفة المخطط أحادي الخط لشبكة كهربائية ومعرفة دوائر الحماية.</p><p><b>الأهداف التفصيلية:</b></p><ol><li>أن يتمكن المتدرب من رسم المخطط أحادي الخط لشبكة كهربائية.</li><li>أن يتمكن المتدرب من رسم دوائر الحماية لعناصر الشبكة الكهربائية.</li></ol>',ref:'ص 143'},
    {tip:'<p>الوحدة ستة دروس: محطة المحولات ومحول التوزيع، الشبكة الشعاعية والانتقائية، وقاية المحركات، وقاية المحولات، وقاية المولدات والموصلات، ثم التمارين.</p>',title:'خريطة الوحدة'},
    {title:'مختبر مصغّر: صح أم خطأ؟',widget:(el,B)=>DCML.tf(el,B,{items:[
     ['المطلوب في هذه الوحدة أن ترسم دوائر الحماية لعناصر الشبكة.',true,'الهدف التفصيلي الثاني.'],
     ['المخطط أحادي الخط يرسم كل موصل بخط مستقل.',false,'خط واحد يمثل كل الموصلات، وعددها يُكتب بشرطة ورقم.']]})}
   ]},

  {st:2,short:'7-1 المقدمة',title:'7-1 المقدمة: المخطط الخطي والمخطط التنفيذي',ref:'ص 144',
   q:'لماذا نرسم الدائرة نفسها مرتين: مرة بخط واحد ومرة بكل أسلاكها؟',
   art:DRA.art({aria:'مفتاح وقاية الموصلات: الدائرة الخطية يساراً والدائرة التنفيذية يميناً',bg:'#E4ECF6',
    parts:[{svg:svg72l(),box:[22,26,130,226],tips:[[70,40,40,26,'الشرطة المائلة ومعها رقم = عدد الموصلات التي يمثلها الخط الواحد.'],[60,170,70,50,'المحول مرسوماً دائرتين متداخلتين.']]},
           {svg:svg72x(false),box:[160,26,186,226],tips:[[36,16,256,54,'في التنفيذي يُرسم كل قضيب وكل سلك كما يوصل فعلاً.'],[100,160,150,82,'ملفات المحول بأطرافها وتوصيلها الفعلي.']]}],
    extra:DRA.L(87,262,'خطية (رمزية)',13,700)+DRA.L(253,262,'تنفيذية',13,700)+DRA.L(180,292,'الدائرة نفسها برسمين',13,700)}),
   cap:'مثال: محول التوزيع في الشكل <span class="ltr">(7-2)</span>.<br><b>مرّر المؤشر على الرسمين (أو المسهما في الجوال) لتعرف معناهما.</b>',
   side:[{predict:{q:'ما المخطط الذي يمثل كل الموصلات بخط واحد؟',opts:[
     ['المخطط التنفيذي',false,'التنفيذي يرسم كل موصل كما يوصل فعلاً.'],
     ['المخطط الخطي (الرمزي)',true,'خط واحد وعليه شرطة وعدد الموصلات.'],
     ['مخطط الترتيب',false,'لم يرد هنا.']]}}],
   body:[
    {book:'<p>في هذا الباب سيتم عرض المخططات الخطية ( الرمزية ) والتنفيذية لنظم القوى الكهربائية وكذلك دوائر الحماية للمحركات والمحولات والموصلات والمولدات وخطوط النقل الكهربائية. ورسم المخطط أحادي الخط لشبكة شعاعية ومحطة محولات.</p>',ref:'ص 144'},
    {tip:'<p><b>الخطي</b> يعطي الصورة العامة بسرعة (ما الأجهزة وبأي ترتيب)، و<b>التنفيذي</b> يعطي الفني ما يحتاجه للتوصيل (كل طرف وكل سلك). والشرطة المائلة في الخطي وبجانبها رقم تعني عدد الموصلات: 3 = ثلاثة أوجه، 4 = ثلاثة أوجه وموصل تعادل.</p>',title:'متى أستعمل كلاً منهما؟'},
    {title:'مختبر مصغّر: خطي أم تنفيذي؟',widget:(el,B)=>DCML.sort(el,B,{cats:['خطي','تنفيذي'],items:[
     ['خط واحد عليه شرطة مائلة ورقم 4.',0,'الرقم عدد الموصلات التي يمثلها الخط.'],
     ['ثلاثة قضبان L1 و L2 و L3 وأرقام الأطراف 1 و 3 و 5.',1,'أرقام الأطراف تفصيل توصيل.'],
     ['محول مرسوم دائرتين متداخلتين.',0,'هذا رمز المحول المختصر.'],
     ['ملفات المحول 1U 1V 1W موصلة نجمة بأسلاكها.',1,'التوصيل الفعلي للملفات.']]})}
   ]},

  {st:3,short:'محطة المحولات',title:'7-2 المخطط أحادي الخط لشبكة كهربائية — 7-2-1 محطة المحولات',ref:'ص 144–145',
   q:'إذا أردت فصل المحول للصيانة، أي مفتاح تفتح أولاً؟',
   art:DRA.art({aria:'الشكل 7-1: الدائرة الخطية لمحطة المحولات في عمودين',bg:'#F7DCC8',
    parts:[{svg:svg71l(),vb:'10 0 190 262',box:[14,14,166,266],tips:[
     [14,8,172,54,'(1) شبكة الجهد العالي: ⟦13.8 kV⟧ ثلاثة أوجه ⟦60 Hz⟧.'],
     [26,64,100,64,'(2) مفتاح الفصل: لا يقطع تياراً؛ يُفتح ويُغلق والدائرة بلا تيار.'],
     [26,132,72,62,'(3) مفتاح قدرة الجهد العالي: يقطع تيار الحمل وتيار القصر.'],
     [100,140,90,120,'المرحل (⊓ و⟦I>⟧) يأخذ إشارته من محول التيار (الدائرة الصغيرة على الخط)، والسهم منه يفصل المفتاح.']]},
           {svg:svg71l(),vb:'10 262 190 348',box:[180,14,166,266],tips:[
     [40,264,150,124,'(4) المحول الخافض: نجمة / زجزاج، ⟦100 kVA⟧، ⟦400/231 V⟧.'],
     [26,392,170,128,'(5) مفتاح قدرة الجهد المنخفض مع محول تيار ومرحل.'],
     [14,524,172,80,'(6) شبكة الجهد المنخفض ⟦380/220 V⟧ بموصل تعادل.']]}],
    extra:'<path d="M180 30V290" stroke="#66665A" stroke-width="1" stroke-dasharray="4 4"/>'+DRA.L(180,306,'الشكل (7-1) — الدائرة الخطية في عمودين',12.5,700)}),
   cap:'العمود الأيسر (الأقسام 1–3) يكمل في العمود الأيمن (الأقسام 4–6).<br><b>مرّر المؤشر على كل قسم (أو المسه في الجوال) لتعرف معناه.</b>',
   side:[{predict:{q:'لماذا توصل قواطع التيار الزائد ودائرة القصر في جهة الجهد العالي عبر محولات التيار؟',opts:[
     ['لرفع الجهد',false,'محول التيار لا يرفع جهد الشبكة.'],
     ['بسبب الجهد العالي',true,'البند (3): «بسبب الجهد العالي، توصل قواطع التيار الزائد وقواطع دائرة القصر عبر محولات (محولات التيار)».'],
     ['لأن التيار في هذه الجهة صفر',false,'التيار يمر دائماً ما دام الحمل يعمل.']]}}],
   body:[
    {book:'<p>الشكل (7-1) يبين المخطط الأحادي لمحطة محولات تربط بين شبكة جهد عالٍ وشبكة جهد منخفض وتتكون من:</p><ol><li><b>شبكة الجهد العالي:</b> ثلاثة (3) أوجه جهد 13.8 كيلو فولت، تردد 60 هيرتز.</li><li><b>مفتاح الفصل:</b> يسمح بالتوصيل فقط في حالة عدم التشغيل أي انه عادة موصل ويفصل عند التشغيل.</li><li><b>مفتاح قدرة الجهد العالي:</b> بسبب الجهد العالي، توصل قواطع التيار الزائد وقواطع دائرة القصر عبر محولات (محولات التيار).</li><li><b>محول:</b> محول الخفض، الجهد الابتدائي 13.8 كيلو فولت ± 4٪، 100 كيلو فولت أمبير، تردد 60 هيرتز، الجهد الثانوي 400/231 فولت.</li><li><b>مفتاح قدرة الجهد:</b> بسبب التيارات العالية، توصل القواطع عبر محولات (محولات التيار).</li><li><b>شبكة الجهد المنخفض:</b> ثلاثة (3) أوجه وتحتوي على خط تعادل بجهد 220/380 فولت وتردد 60 هيرتز.</li></ol>',ref:'ص 144'},
    {tip:'<p><b>مفتاح الفصل</b> (البند 2) لا يقطع تياراً: يُفتح أو يُغلق والدائرة بلا تيار، أي بعد فتح مفتاح القدرة. لذلك يكون عادة مغلقاً، ونفتحه عند الصيانة ليصنع فاصلاً مرئياً عن الشبكة. أما <b>مفتاح القدرة</b> فهو الذي يقطع تيار الحمل وتيار القصر، ويفصله مرحل التيار الزائد الذي يأخذ إشارته من <b>محول التيار</b>. والبند (5) يقصد <b>مفتاح قدرة الجهد المنخفض</b>.</p>',title:'مفتاح الفصل ومفتاح القدرة'},
    {watch:'<ul style="margin:4px 0 0;padding-inline-start:18px"><li>صياغة البند (2) مضطربة؛ المقصود أن مفتاح الفصل يُشغَّل فقط والدائرة بلا تيار.</li><li>الرسم يكتب «<span class="ltr">14%</span>» والنص «± 4٪»، ويكتب «<span class="ltr">100Kv</span>» والمقصود <span class="ltr">100 kVA</span> كما في النص؛ رسمناهما كما في النص.</li><li>البند (6) يذكر <span class="ltr">220/380 V</span> والبند (4) يذكر الجهد الثانوي <span class="ltr">400/231 V</span>: الأول الجهد الاسمي لشبكة المستهلكين، والثاني جهد خرج المحول، وهو أعلى قليلاً ليعوّض هبوط الجهد في الموصلات.</li></ul>',fix:true},
    {html:`<figure class="fig" style="margin:10px 0">${fig2(`<div>${box(svg71l(),220)}${cap('الدائرة الخطية')}</div>`,`<div>${box(svg71x(),330)}${cap('الدائرة التنفيذية')}</div>`)}<figcaption><b>الشكل <span class="ltr">(7-1)</span></b> مخطط أحادي لمحطة محولات. أرقام الأقسام في الدوائر الصغيرة أضفناها لتربط الرسم بالبنود 1–6. <span class="ref">ص 145</span></figcaption></figure>`},
    {title:'مختبر مصغّر: رتّب أقسام المحطة',widget:(el,B)=>DCML.order(el,B,{intro:'اضغط أقسام المحطة بالترتيب من شبكة الجهد العالي إلى المستهلك.',steps:[
     ['شبكة الجهد العالي 13.8 kV','نبدأ من مصدر التغذية.'],['مفتاح الفصل','يأتي مباشرة بعد الشبكة ليفصل المحطة كلها فصلاً مرئياً.'],['مفتاح قدرة الجهد العالي مع محولات التيار','يحمي المحول من جهة الجهد العالي.'],['المحول الخافض','بين مفتاحي القدرة.'],['مفتاح قدرة الجهد المنخفض','بعد المحول.'],['شبكة الجهد المنخفض 380/220 V','نهاية المحطة.']]})},
    {title:'مختبر مصغّر: ماذا تفعل؟',widget:(el,B)=>DCML.cases(el,B,{cases:[
     {q:'المحطة تغذي المستهلكين، وتريد فصل مفتاح الفصل للصيانة.',opts:[['افتح مفتاح الفصل مباشرة',false,'مفتاح الفصل لا يقطع تياراً؛ فتحه تحت الحمل يصنع قوساً كهربائياً.'],['افتح مفتاحي القدرة أولاً، ثم مفتاح الفصل',true,'بعد زوال التيار يُفتح مفتاح الفصل فيصنع فاصلاً مرئياً.']]},
     {q:'حدث قصر في شبكة الجهد المنخفض. أي مفتاح يجب أن يفصل؟',opts:[['مفتاح قدرة الجهد العالي',false,'هذا يقطع المحول أيضاً بلا داعٍ.'],['مفتاح الفصل',false,'لا يقطع تيار القصر.'],['مفتاح قدرة الجهد المنخفض',true,'يفصل الجزء المعطوب ويبقى المحول مغذّى. جرّب ذلك في تبويب «المختبر».']]}]})}
   ]},

  {st:4,short:'محول التوزيع',title:'7-2-1 (تابع): محول توزيع ثلاثي الأوجه (الشكل 7-2)',ref:'ص 146',
   q:'ما الذي يحمي المحول الصغير إذا لم يكن له مفتاح قدرة في جهة الجهد العالي؟',
   art:DRA.art({aria:'الشكل 7-2: الدائرة الخطية والتنفيذية لمحول توزيع ثلاثي الأوجه',bg:'#E4ECF6',
    parts:[{svg:svg72l(),box:[20,14,140,262],tips:[[30,100,110,46,'المصاهر ⟦F1..3⟧ بعد مفتاح الفصل: تحمي المحول من القصر.'],[20,236,100,70,'مفتاح الوقاية ⟦Q1⟧ في جهة الجهد المنخفض: حراري ومغناطيسي.']]},
           {svg:svg72x(false),box:[166,14,180,262],tips:[[104,120,90,32,'ثلاثة مصاهر ⟦F1..3⟧ (كل مصهر طرفاه 1 و2).'],[100,160,150,82,'المحول ⟦T1⟧: الابتدائي ⟦1U 1V 1W⟧ والثانوي ⟦2U 2V 2W⟧، ونقطة النجمة إلى ⟦PE/N⟧ والأرضي.'],[100,254,100,86,'مفتاح الوقاية ⟦Q1⟧: قاطع حراري ومغناطيسي ⟦I>⟧.']]}],
    extra:DRA.L(90,298,'الخطية',13,700)+DRA.L(256,298,'التنفيذية',13,700)}),
   cap:'رسمنا التنفيذية هنا بجهد القضبان العليا المصحح؛ انظر الشرح.<br><b>مرّر المؤشر على المصاهر والمحول ومفتاح الوقاية (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[{predict:{q:'في الشكل (7-2)، ماذا وُضع بعد مفتاح الفصل بدل مفتاح قدرة الجهد العالي ومحولات التيار؟',opts:[
     ['مصاهر F1..3',true,'المصاهر تحمي المحول الصغير من القصر.'],
     ['مرحل فرقي',false,'لا يظهر في هذا الشكل.'],
     ['لا شيء',false,'انظر الرسم: ثلاثة مصاهر.']]}}],
   body:[
    {book:'<p>والشكل (7-2) يوضح المخطط الخطي والتنفيذي لمحول توزيع ثلاثي الأوجه.</p>',ref:'ص 146'},
    {tip:`<p>في جهة الجهد المنخفض <b>مفتاح وقاية Q1</b> فيه قاطع حراري (للتحميل الزائد) وقاطع مغناطيسي <span class="ltr">I&gt;</span> (للقصر). ونقطة النجمة في الثانوي تُوصَّل بالأرضي وبالموصل المشترك <span class="ltr">PE/N</span>.</p>`,title:'ماذا أضاف الشكل (7-2) على (7-1)؟'},
    {title:'جرّب الرسم: كما في الكتاب / المصحح',widget:(el,B)=>fig72Widget(el)},
    {watch:'<ul style="margin:4px 0 0;padding-inline-start:18px"><li>المفتاحان على جانبي المحول يحملان الاسم نفسه Q1 (الأدق Q1 وQ2).</li><li>رمز المحول في الدائرة الخطية يُظهر الثانوي <b>زجزاج</b>، بينما الدائرة التنفيذية ترسمه <b>نجمة</b> بسيطة.</li></ul>',fix:true},
    {title:'مختبر مصغّر: (7-1) أم (7-2)؟',widget:(el,B)=>DCML.sort(el,B,{intro:'لأي شكل ينتمي كل عنصر؟',cats:['محطة المحولات (7-1)','محول التوزيع (7-2)'],items:[
     ['مفتاح قدرة في جهة الجهد العالي مع ثلاثة محولات تيار ومرحلات.',0,'في (7-2) حلت المصاهر محله.'],
     ['مصاهر F1..3 بعد مفتاح الفصل.',1,'محول التوزيع يُحمى بالمصاهر من جهة الجهد العالي.'],
     ['مفتاح وقاية فيه قاطع حراري ومغناطيسي في جهة الجهد المنخفض.',1,'في (7-1) مفتاح قدرة مع محولات تيار.']]})}
   ]},

  {recap:[
   'المخطط الخطي يرسم الموصلات بخط واحد وعددها بشرطة ورقم؛ والتنفيذي يرسم كل سلك كما يوصل.',
   'محطة المحولات (7-1): شبكة 13.8 kV، مفتاح فصل، مفتاح قدرة بمحولات تيار، محول خافض، مفتاح قدرة منخفض، شبكة 380/220 V.',
   'مفتاح الفصل لا يقطع تياراً؛ يُفتح بعد مفتاح القدرة.',
   'محول التوزيع (7-2): مصاهر في جهة الجهد العالي ومفتاح وقاية حراري ومغناطيسي في جهة الجهد المنخفض.']}
],
 theory:[
  {h:'الوحدة السابعة: مخططات دوائر نظم القوى الكهربائية وعناصر حمايتها',ref:'ص 142–143',html:`<p><b>الهدف العام للوحدة:</b> معرفة المخطط أحادي الخط لشبكة كهربائية ومعرفة دوائر الحماية.</p><p><b>الأهداف التفصيلية:</b></p><ol><li>أن يتمكن المتدرب من رسم المخطط أحادي الخط لشبكة كهربائية.</li><li>أن يتمكن المتدرب من رسم دوائر الحماية لعناصر الشبكة الكهربائية.</li></ol>`},
  {h:'7-1 المقدمة',ref:'ص 144',html:'<p>في هذا الباب سيتم عرض المخططات الخطية ( الرمزية ) والتنفيذية لنظم القوى الكهربائية وكذلك دوائر الحماية للمحركات والمحولات والموصلات والمولدات وخطوط النقل الكهربائية. ورسم المخطط أحادي الخط لشبكة شعاعية ومحطة محولات.</p>'},
  {h:'7-2 المخطط أحادي الخط لشبكة كهربائية — 7-2-1 محطة المحولات',ref:'ص 144',html:`<p>الشكل (7-1) يبين المخطط الأحادي لمحطة محولات تربط بين شبكة جهد عالٍ وشبكة جهد منخفض وتتكون من:</p><ol>
   <li><b>شبكة الجهد العالي:</b> ثلاثة (3) أوجه جهد ${lt('13.8')} كيلو فولت، تردد ${lt('60')} هيرتز.</li>
   <li><b>مفتاح الفصل:</b> يسمح بالتوصيل فقط في حالة عدم التشغيل أي انه عادة موصل ويفصل عند التشغيل.</li>
   <li><b>مفتاح قدرة الجهد العالي:</b> بسبب الجهد العالي، توصل قواطع التيار الزائد وقواطع دائرة القصر عبر محولات (محولات التيار).</li>
   <li><b>محول:</b> محول الخفض، الجهد الابتدائي ${lt('13.8')} كيلو فولت ± ${lt('4')}٪، ${lt('100')} كيلو فولت أمبير، تردد ${lt('60')} هيرتز، الجهد الثانوي ${lt('400/231')} فولت.</li>
   <li><b>مفتاح قدرة الجهد:</b> بسبب التيارات العالية، توصل القواطع عبر محولات (محولات التيار).</li>
   <li><b>شبكة الجهد المنخفض:</b> ثلاثة (3) أوجه وتحتوي على خط تعادل بجهد ${lt('220/380')} فولت وتردد ${lt('60')} هيرتز.</li></ol>`},
  {note:`${TIP}<b>مفتاح الفصل</b> (البند 2) لا يقطع تياراً: يُفتح أو يُغلق والدائرة بلا تيار، أي بعد فتح مفتاح القدرة. لذلك يكون عادة مغلقاً، ونفتحه عند الصيانة ليصنع فاصلاً مرئياً عن الشبكة. أما <b>مفتاح القدرة</b> فهو الذي يقطع تيار الحمل وتيار القصر، ويفصله مرحل التيار الزائد الذي يأخذ إشارته من <b>محول التيار</b>. والبند (5) يقصد <b>مفتاح قدرة الجهد المنخفض</b>.`},
  {fig:'(7-1)',ref:'ص 145',caption:'مخطط أحادي لمحطة محولات تربط بين شبكة جهد عالٍ وشبكة جهد منخفض. يسار: الدائرة التنفيذية، يمين: الدائرة الخطية. الخطوط المتقطعة تفصل الأقسام الستة؛ أرقام الأقسام في الدوائر الصغيرة أضفناها لتربط الرسم بالبنود 1–6.',draw:()=>fig2(`<div>${box(svg71l(),220)}${cap('الدائرة الخطية')}</div>`,`<div>${box(svg71x(),330)}${cap('الدائرة التنفيذية')}</div>`)},
  {note:`${TIP}<b>كيف تقرأ الدائرة الخطية؟</b> خط واحد يمثل كل الموصلات، والشرطة المائلة وبجانبها رقم تعني عدد الموصلات: <b>3</b> = ثلاثة أوجه، <b>4</b> = ثلاثة أوجه وموصل تعادل. ومحول التيار دائرة صغيرة على الخط، والمرحل مستطيل فيه رمز الحراري و${lt('I&gt;')}، والسهم منه إلى المفتاح يعني أنه يفصله.`},
  {err:`<ul style="margin:4px 0 0;padding-inline-start:18px"><li>صياغة البند (2) مضطربة؛ المقصود أن مفتاح الفصل يُشغَّل فقط والدائرة بلا تيار (انظر التوضيح أعلاه).</li><li>الرسم يكتب «${lt('14%')}» والنص «± ${lt('4')}٪»، ويكتب «${lt('100Kv')}» والمقصود ${lt('100 kVA')} كما في النص؛ رسمناهما كما في النص.</li><li>البند (6) يذكر ${lt('220/380 V')} والبند (4) يذكر الجهد الثانوي ${lt('400/231 V')}: الأول الجهد الاسمي لشبكة المستهلكين، والثاني جهد خرج المحول، وهو أعلى قليلاً ليعوّض هبوط الجهد في الموصلات.</li></ul>`},
  {h:'7-2-1 (تابع): محول توزيع ثلاثي الأوجه',ref:'ص 146',html:'<p>والشكل (7-2) يوضح المخطط الخطي والتنفيذي لمحول توزيع ثلاثي الأوجه.</p>'},
  {widget:el=>fig72Widget(el)},
  {err:`<ul style="margin:4px 0 0;padding-inline-start:18px"><li>المفتاحان على جانبي المحول يحملان الاسم نفسه Q1 (الأدق Q1 وQ2).</li><li>رمز المحول في الدائرة الخطية يُظهر الثانوي <b>زجزاج</b>، بينما الدائرة التنفيذية ترسمه <b>نجمة</b> بسيطة.</li></ul>`},
  {note:`${TIP}<b>ماذا أضاف الشكل (7-2) على (7-1)؟</b> بدل مفتاح قدرة الجهد العالي ومحولات التيار وُضعت <b>مصاهر F1..3</b> بعد مفتاح الفصل، وفي جهة الجهد المنخفض <b>مفتاح وقاية Q1</b> فيه قاطع حراري (للتحميل الزائد) وقاطع مغناطيسي ${lt('I&gt;')} (للقصر). ونقطة النجمة في الثانوي تُوصَّل بالأرضي وبالموصل المشترك ${lt('PE/N')}.`}
 ],
 lab:(el)=>labSubstation(el),
 examples:[
  drawEx({title:'مثال مرسوم: الشكل (7-1) قسماً قسماً',ref:'ص 144–145',
   q:'<p>ارسم الدائرة التنفيذية والدائرة الخطية لمحطة المحولات في الشكل (7-1)، قسماً بعد قسم كما يعددها النص. الجزء الجديد في كل خطوة بالأزرق.</p>',
   steps:['نبدأ بالخطوط المتقطعة التي تقسم الرسم إلى ستة أقسام، ثم <b>شبكة الجهد العالي</b>: ثلاثة قضبان L1 وL2 وL3 مكتوب عليها <span class="ltr">13.8 kV 3~ 60 Hz</span>، وفي الخطي خط واحد عليه شرطة و3.',
    '<b>مفتاح الفصل</b>: ثلاثة تلامسات (1-2، 3-4، 5-6) يربطها خط منقط بذراع التشغيل اليدوي. في الخطي تلامس واحد وشرطة 3.',
    '<b>مفتاح قدرة الجهد العالي</b>: تلامسات في إطار، ذراع ⊞، وتحتها <b>ثلاثة محولات تيار</b> (ملف أسود على الخط وثانوي رفيع بجانبه) توصل إلى <b>ثلاثة مرحلات</b>، والخط المنقط من المرحلات إلى الذراع يعني أنها تفصل المفتاح. في الخطي: محول التيار دائرة، والمرحل مستطيل بسهم إلى المفتاح، وبينهما شرطة و4.',
    '<b>المحول</b>: الابتدائي 1U 1V 1W موصل نجمة، والثانوي 2U 2V 2W زجزاج، ونقطة النجمة توصل بخط الأرضي PE. في الخطي دائرتان متداخلتان: نجمة فوق وزجزاج تحت، ثم شرطة و4 لأن الخرج ثلاثة أوجه وموصل تعادل.',
    '<b>مفتاح قدرة الجهد المنخفض</b>: مثل مفتاح الجهد العالي تماماً (تلامسات، محولات تيار، مرحلات)، وشرطاته في الخطي 4.',
    '<b>شبكة الجهد المنخفض</b>: القضبان L1 وL2 وL3 وPE مكتوب عليها <span class="ltr">380/220 V 3/N ~ 60 Hz</span>. اكتمل الرسم.'],
   svg:i=>box(svg71both(i,true,{groups:[[0,1],[2],[3],[4],[5],[6]]}),540,470)})],
 quiz:[
  {q:'ما جهد شبكة الجهد العالي في محطة المحولات في الشكل (7-1)؟',o:['13.8 kV ثلاثة أوجه 60 Hz','<span class="ltr">380/220 V</span>','<span class="ltr">400/231 V</span>','100 kV'],c:0,e:'البند الأول: ثلاثة أوجه جهد 13.8 كيلو فولت، تردد 60 هيرتز.'},
  {q:'متى يُفتح مفتاح الفصل؟',o:['والدائرة بلا تيار، بعد فتح مفتاح القدرة','عند حدوث القصر ليقطع تياره','في أي وقت لأنه أسرع المفاتيح','عند زيادة الحمل فقط'],c:0,e:'مفتاح الفصل لا يقطع تياراً؛ يُشغَّل بلا حمل، ولذلك نفتح مفتاح القدرة أولاً.'},
  {q:'لماذا توصل قواطع التيار الزائد ودائرة القصر في جهة الجهد العالي عبر محولات التيار؟',o:['بسبب الجهد العالي','لأن التيار في هذه الجهة صفر','لرفع الجهد','لتغيير التردد'],c:0,e:'البند الثالث: «بسبب الجهد العالي، توصل قواطع التيار الزائد وقواطع دائرة القصر عبر محولات (محولات التيار)».'},
  {q:'في الدائرة الخطية، ماذا تعني الشرطة المائلة وبجانبها الرقم 4؟',o:['أربعة موصلات: ثلاثة أوجه وموصل تعادل','أربعة محولات','جهد 4 kV','أربعة مفاتيح على التوالي'],c:0,e:'الرقم بجانب الشرطة عدد الموصلات التي يمثلها الخط الواحد.'},
  {q:'ما قدرة محول الخفض في الشكل (7-1)؟',o:['100 kVA','13.8 kVA','400 kVA','60 kVA'],c:0,e:'البند الرابع: 100 كيلو فولت أمبير (الرسم يكتب 100Kv خطأً).'},
  {q:'حدث قصر في شبكة الجهد المنخفض. أي مفتاح يجب أن يفصل؟',o:['مفتاح قدرة الجهد المنخفض','مفتاح الفصل','مفتاح قدرة الجهد العالي','لا شيء'],c:0,e:'المرحل الذي يرى تيار القصر أولاً هو مرحل جهة الجهد المنخفض، فيفصل Q2 ويبقى المحول مغذّى (جرّب ذلك في المختبر).'}]
});

/* =====================================================================================
   7-2-2 Radial network (figure 7-3 redrawn from the text) and time grading (7-4)
   ===================================================================================== */
/* automatic breaker with time-delayed release (symbol of figure 7-4), vertical: contact y..y+30, release on the left */
const autoBr=(x,y,c,lim)=>sw(x,y,30,true,c)+ln(x-5.5,y+15,x-16,y+15,'dt '+cs(c))+thermal(x-26,y+18,c)+pa(`M${x-34} ${y+8}a8 8 0 0 1 16 0`,cs(c)+' th')+ln(x-30,y+6,x-22,y+12,cs(c)+' th')+(lim?ln(x+5,y+5,x+12,y+5,cs(c))+ln(x+5,y+25,x+12,y+25,cs(c)):'');
const autoBrH=(x,y,c)=>ln(x,y,x+8,y,c)+ln(x+22,y,x+30,y,c)+ln(x+22,y,x+9,y-11,c)+ln(x+15,y-5,x+15,y+8,'dt '+cs(c))+pa(`M${x+7} ${y+11}h4v6h8v-6h4`,cs(c))+pa(`M${x+8} ${y+26}a7 7 0 0 1 14 0`,cs(c)+' th')+ln(x+12,y+22,x+20,y+30,cs(c)+' th')+arrowD(x+21,y+33,c);
const num=(x,y,n,c)=>ci(x,y,8,'bg '+cs(c))+T(x,y+4,n,c,{fs:n>9?8.5:10});
function f73(){const x=110,W=320;
 const st=[
  c=>trSL(x,28,null,null,c)+num(150,40,1,c)+ln(x,58.5,x,80,c),
  c=>autoBr(x,80,c)+ln(x,110,x,140,c)+num(150,96,2,c),
  c=>ln(40,140,300,140,'tk '+cs(c))+nd(x,140,c)+num(290,124,3,c)+A(220,130,'الموزع الرئيس',c)+ln(260,140,260,165,cs(c))+arrowD(260,172,c)+A(260,186,'فروع أخرى',c,{fs:9}),
  c=>ln(x,140,x,160,c)+autoBr(x,160,c)+num(150,176,4,c),
  c=>ln(x,190,x,230,c)+sw(x,230,30,true,c)+ln(x-40,245,x-5.5,245,'dt '+cs(c))+opCB(x-48,245,c)+num(150,246,5,c)+ln(x,260,x,290,c),
  c=>ln(60,290,280,290,'tk '+cs(c))+nd(x,290,c)+num(270,274,6,c)+A(205,280,'الموزع الفرعي',c)+ln(240,290,240,312,cs(c))+arrowD(240,319,c),
  c=>ln(x,290,x,305,c)+autoBr(x,305,c)+num(150,321,7,c)+ln(x,335,x,370,c),
  c=>sw(x,370,30,true,c)+ln(x-40,385,x-5.5,385,'dt '+cs(c))+opCB(x-48,385,c)+num(150,386,8,c)+ln(x,400,x,420,c),
  c=>ln(50,420,280,420,'tk '+cs(c))+nd(x,420,c)+num(270,404,9,c)+A(210,410,'موزع المستهلك',c),
  c=>[60,160,250].map((fx,i)=>(fx===x?'':'')+nd(fx,420,c)+ln(fx,420,fx,432,c)+fuse(fx,432,c,20)+ln(fx,452,fx,466,c)).join('')+motor(60,484,16,'M','3~',c)+ci(160,478,10,cs(c))+ln(153,471,167,485,cs(c)+' th')+ln(167,471,153,485,cs(c)+' th')+pa('M238 470a12 12 0 0 1 24 0',cs(c))+ln(250,466,250,470,c)+num(210,442,10,c)];
 return {st,W,H:510}}
const G73=[[0],[1],[2],[3],[4],[5],[6],[7],[8],[9]];
const svg73=(k,hl)=>{const f=f73();return SV(`0 0 ${f.W} ${f.H}`,seq(f.st,G73,k==null?99:k,hl),'مخطط أحادي لشبكة شعاعية')};
function svg74(){let s='';
 s+=trSLh(30,50,'')+ln(46,50,95,50,'');
 const B1=[95,50],B2=[200,74],B3=[305,98],B4=[410,122];
 s+=autoBrH(B1[0],50,'')+ln(125,50,170,50,'')+ln(170,30,170,82,'tk')+nd(170,50,'')+nd(170,74,'');
 s+=ln(170,74,200,74,'')+autoBrH(200,74,'')+ln(230,74,275,74,'')+ln(275,54,275,106,'tk')+nd(275,74,'')+nd(275,98,'');
 s+=ln(275,98,305,98,'')+autoBrH(305,98,'')+ln(335,98,380,98,'')+ln(380,78,380,130,'tk')+nd(380,98,'')+nd(380,122,'');
 s+=ln(380,122,410,122,'')+autoBrH(410,122,'')+ln(440,122,544,122,'')+motor(560,122,16,'M','3~','');
 s+=ln(425,62,425,96,'')+arrowD(425,104,'')+A(425,40,'مفتاح قدرة',''  ,{fs:10})+A(425,54,'محدد التيار','',{fs:10});
 s+=ln(20,170,96,170,'')+arrowR(104,170,'')+T(110,174,'180 ms','',{a:'start',fs:11})+T(215,174,'120 ms','',{a:'start',fs:11})+T(320,174,'60 ms','',{a:'start',fs:11});
 return SV('0 0 600 190',s,'المفاتيح القدرة الأوتوماتيكية بتدرج زمني')}

/* ---------- lab u7-l2: time grading 180/120/<span class="ltr">60 ms</span> ---------- */
function labGrading(el){
 const SLOW=10;               /* visual only: <span class="ltr">1 ms</span> of the network = <span class="ltr">10 ms</span> on screen */
 const BR=['Q1','Q2','Q3','Q4'];
 const SET={graded:[180,120,60,0],flat:[60,60,60,0]};
 const FZ=[{k:'F1',n:'الموزع الرئيس',up:1,x:175,y:130},{k:'F2',n:'الموزع الفرعي',up:2,x:175,y:210},{k:'F3',n:'موزع المستهلك',up:3,x:175,y:290},{k:'F4',n:'موصل المحرك',up:4,x:130,y:358}];
 const S={mode:'graded',closed:[1,1,1,1],fault:null,t:0,run:false,pick:[],tripped:[],done:false,hist:[]};
 el.innerHTML=`<div class="d7lab"><div class="grid">
  <section class="panel c7"><h2>الانتقائية بالتدرّج الزمني <small>مبنية على الشكل (7-4) ص 149 والبنود 1–10 ص 147</small></h2>
   <div class="d7row">${segHTML('gm',[['graded',`متدرّج ${lt('180 / 120 / 60 ms')} (الشكل 7-4)`],['flat',`بلا تدرّج: كلها ${lt('60 ms')} (للمقارنة)`]],S.mode)}</div>
   <div class="d7row"><span class="sub">ضع القصر في:</span>${segHTML('gf',FZ.map(f=>[f.k,f.n]),'')}<button class="btn" id="grst">أعد التغذية</button></div>
   <div class="d7grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:12px;align-items:start">
    <div id="gnet"></div><div><h3 class="sm">مخطط الزمن</h3><div id="gtl"></div><p class="sub">العرض مبطأ ${SLOW} مرات حتى ترى الترتيب. الأزمنة من الشكل (7-4): <span class="ltr">180 ms</span> و120 ms و60 ms؛ المفتاح محدد التيار Q4 لحظي (الكتاب لا يعطيه زمناً).</p></div></div>
   <div class="d7msg" id="gmsg">اختر مكان القصر (أو اضغط إحدى الدوائر الحمراء على الرسم).</div></section>
  <section class="panel c5"><h2>جرّب</h2>
   ${tryList(['ضع القصر في موزع المستهلك: أي مفتاح يفصل؟ وماذا يبقى مغذّى؟','ضع القصر في موصل المحرك: لماذا يفصل Q4 قبل الجميع؟','ضع القصر في الموزع الرئيس: كم ينتظر Q1؟','اختر «بلا تدرّج» وضع القصر في موزع المستهلك: ماذا ينطفئ؟'])}
   <h3 class="sm">خطوات التجربة</h3><ol class="steps" id="gsteps"></ol>
   <p class="sub">${TIP}الوضع «بلا تدرّج» ليس من الكتاب؛ أضفناه لترى لماذا نحتاج التدرّج.</p></section></div></div>`;
 const $=s=>el.querySelector(s),msg=(t,k)=>{const m=$('#gmsg');m.innerHTML=t;m.className='d7msg'+(k?' '+k:'')};
 /* الأزمنة الفعلية للمرحلات: كما في الشكل، إلا في «اكتشف العطل» (ضبط خاطئ أو مرحل معطل = لا يفصل أبداً). مخطط الزمن يرسم دائماً أزمنة الشكل */
 const set=()=>{const t=SET[S.mode].slice();if(chF('q1fast'))t[0]=120;if(chF('q2fast'))t[1]=60;if(chF('q3dead'))t[2]=Infinity;if(chF('q4dead'))t[3]=Infinity;return t};
 const live=i=>S.closed.slice(0,i).every(v=>v);   /* bar i (1..3) / motor (4) energised? */
 const drawNet=()=>{const x=100,f=S.fault&&S.run?FZ.find(z=>z.k===S.fault):null;
  const onPath=i=>f&&i<=f.up;              /* segment after breaker i carries fault current */
  const cl=i=>i===0?(f?'fl':'on'):(live(i)?(onPath(i)?'fl':'on'):'off');
  let s=trSL(x,22,null,null,cl(0))+ln(x,52.5,x,70,cl(0));
  const br=(i,y)=>{const c0=cl(i),cb=S.closed[i]?cl(i+1):'off',open=!S.closed[i];
   return ln(x,y,x,y+8,c0)+ln(x,y+22,x,y+30,cb)+(open?ln(x,y+22,x-11,y+9,'tr'):ln(x,y+22,x,y+8,cb))+ln(x-5.5,y+15,x-16,y+15,'dt th mu')+thermal(x-26,y+18,open?'tr':'')+pa(`M${x-34} ${y+8}a8 8 0 0 1 16 0`,'th')+T(x+14,y+19,BR[i],'',{a:'start',fs:11,cl:open?'red':''})+(i===3?T(x+38,y+19,'I-lim','',{a:'start',fs:8.5,cl:'m'}):'')};
  s+=br(0,70)+ln(x,100,x,130,cl(1))+ln(30,130,280,130,'tk '+cl(1))+nd(x,130,cl(1))+A(250,122,'الموزع الرئيس','',{fs:10});
  const lamp=(lx,y,i)=>ln(lx,y,lx,y+18,cl(i))+ci(lx,y+28,9,live(i)?'lampon':'bg')+ln(lx-6,y+22,lx+6,y+34,'th')+ln(lx+6,y+22,lx-6,y+34,'th');
  s+=lamp(250,130,1)+ln(x,130,x,150,cl(1))+br(1,150)+ln(x,180,x,210,cl(2))+ln(30,210,280,210,'tk '+cl(2))+nd(x,210,cl(2))+A(250,202,'الموزع الفرعي','',{fs:10});
  s+=lamp(250,210,2)+ln(x,210,x,230,cl(2))+br(2,230)+ln(x,260,x,290,cl(3))+ln(30,290,280,290,'tk '+cl(3))+nd(x,290,cl(3))+A(250,282,'موزع المستهلك','',{fs:10});
  s+=lamp(250,290,3)+ln(x,290,x,310,cl(3))+br(3,310)+ln(x,340,x,374,cl(4))+motor(x,392,17,'M','3~',live(4)?'on':'off');
  FZ.forEach(z=>{s+=`<g data-fz="${z.k}" style="cursor:pointer">${ci(z.x,z.y,8,'fzone'+(S.fault===z.k?' sel':''))}${T(z.x,z.y+3.5,'F','',{fs:9})}</g>`});
  $('#gnet').innerHTML=box(SV('0 0 300 420',s,'شبكة شعاعية بتدرج زمني'),380);
  $('#gnet').querySelectorAll('[data-fz]').forEach(g=>g.addEventListener('click',()=>place(g.dataset.fz)))};
 const drawTL=()=>{const X0=56,sc=1.1,st=SET[S.mode],sa=set();let s=ln(X0,10,X0,136,'mu th')+ln(X0,136,X0+220,136,'mu th');
  [0,60,120,180].forEach(v=>{s+=ln(X0+v*sc,136,X0+v*sc,140,'mu th')+T(X0+v*sc,152,v,'',{fs:9,cl:'m'})});s+=T(X0+222,152,'ms','',{fs:9,cl:'m',a:'start'});
  BR.forEach((b,i)=>{const y=24+i*30,trp=S.tripped.includes(i),pk=S.pick.includes(i);
   s+=T(X0-8,y+4,b,'',{a:'end',fs:11,cl:trp?'red':''})+rc(X0,y-7,220,14,'th mu');
   if(st[i]>0)s+=ln(X0+st[i]*sc,y-10,X0+st[i]*sc,y+10,'tr')+T(X0+st[i]*sc+3,y-9,st[i]+' ms','',{a:'start',fs:8.5});else s+=A(X0+4,y-9,'لحظي','',{a:'end',fs:8.5});
   if(pk||trp){const tt=trp?sa[i]:Math.min(S.t,sa[i],220);s+=`<rect x="${X0}" y="${y-6}" width="${Math.max(2,tt*sc)}" height="12" style="fill:var(${trp?'--stop':'--live'});stroke:none;opacity:.85"/>`;
    if(trp)s+=A(X0+Math.max(2,tt*sc)+4,y+4,'فصل','',{a:'end',fs:9.5,cl:'red'});else if(S.done)s+=A(X0+tt*sc+4,y+4,'رجع','',{a:'end',fs:9,cl:'m'})}});
  $('#gtl').innerHTML=box(SV('0 0 300 160',s,'مخطط الزمن'),380)};
 const draw=()=>{drawNet();drawTL();segSet(el,'gm',S.mode);segSet(el,'gf',S.fault||'');steps.check()};
 function place(k){const z=FZ.find(f=>f.k===k);if(S.run)return;
  if(S.closed.some(v=>!v)){msg('بعض المفاتيح مفصولة من العطل السابق. اضغط «أعد التغذية» أولاً.','bad');return}
  S.fault=k;S.t=0;S.run=true;S.done=false;S.tripped=[];S.pick=[...Array(z.up).keys()];
  msg(`قصر في <b>${z.n}</b>: تيار القصر يمر في ${S.pick.map(i=>BR[i]).join(' و')}، فتبدأ مرحلاتها العدّ معاً…`);draw()}
 loopOn(el,dt=>{if(!S.run)return;S.t+=dt*1000/SLOW;const st=set();const due=S.pick.filter(i=>S.t>=st[i]);
  if(due.length){const tmin=Math.min(...due.map(i=>st[i]));const tr=S.pick.filter(i=>st[i]===tmin);S.t=tmin;S.tripped=tr;tr.forEach(i=>S.closed[i]=0);S.run=false;S.done=true;
   S.hist.push({mode:S.mode,f:S.fault,tr:tr.map(i=>BR[i])});
   const z=FZ.find(f=>f.k===S.fault),first=Math.min(...tr);const off=['الموزع الرئيس والفرعي وموزع المستهلك والمحرك','الموزع الفرعي وموزع المستهلك والمحرك','موزع المستهلك والمحرك','المحرك فقط'][first];
   const nearest=z.up-1;
   msg(tr.length>1?`فصل <b>${tr.map(i=>BR[i]).join(' و')}</b> معاً بعد ${lt(tmin+' ms')}! انطفأ ${off}، مع أن العطل في ${z.n} فقط. هذه هي «مشكلة الانتقائية».`
     :`فصل <b>${BR[tr[0]]}</b> ${tmin?`بعد ${lt(tmin+' ms')}`:'لحظياً'}${nearest===tr[0]?' — وهو أقرب مفتاح قبل العطل':''}. انقطع ${off}، وبقي ما قبله مغذّى. المفاتيح الأخرى رجعت قبل أن يكتمل زمنها لأن تيار القصر زال.`,tr.length>1?'bad':'ok');
   S.fault=S.fault;draw();return}
  drawTL()});
 el.querySelectorAll('[data-gf]').forEach(b=>b.addEventListener('click',()=>place(b.dataset.gf)));
 el.querySelectorAll('[data-gm]').forEach(b=>b.addEventListener('click',()=>{if(S.run)return;S.mode=b.dataset.gm;msg(S.mode==='flat'?'كل المفاتيح Q1 وQ2 وQ3 مضبوطة الآن على <span class="ltr">60 ms</span> (ليس من الكتاب). ضع قصراً وشاهد.':'رجعنا إلى أزمنة الشكل (7-4): 180 و120 و60 ms.');draw()}));
 $('#grst').addEventListener('click',()=>{if(S.run)return;S.closed=[1,1,1,1];S.fault=null;S.tripped=[];S.pick=[];S.done=false;S.t=0;msg('أُعيدت التغذية: كل المفاتيح مغلقة.');draw()});
 const had=(m,f,tr)=>S.hist.some(h=>h.mode===m&&h.f===f&&tr.every(x=>h.tr.includes(x))&&h.tr.length===tr.length);
 const steps=stepsUI($('#gsteps'),[
  {t:'قصر في موزع المستهلك',x:'ضع القصر F في «موزع المستهلك». Q1 وQ2 وQ3 كلها ترى التيار، فمن يفصل أولاً؟',done:()=>had('graded','F3',['Q3'])},
  {t:'قصر في موصل المحرك',x:'اضغط «أعد التغذية» ثم ضع القصر في «موصل المحرك».',done:()=>had('graded','F4',['Q4'])},
  {t:'قصر في الموزع الرئيس',x:'أعد التغذية وضع القصر في «الموزع الرئيس». لا يراه إلا Q1، فينتظر <span class="ltr">180 ms</span>.',done:()=>had('graded','F1',['Q1'])},
  {t:'بلا تدرّج',x:'اختر «بلا تدرّج»، أعد التغذية، وضع القصر في «موزع المستهلك».',done:()=>had('flat','F3',['Q1','Q2','Q3'])}]);
 draw()}

B.lesson({
 id:'u7-l2',unit:7,order:2,pages:'147–149',
 title:'الشبكات الشعاعية والانتقائية',
 summary:'شبكة شعاعية فيها موزع رئيس وموزع فرعي وموزع للمستهلك، ومفاتيح قدرة أوتوماتيكية بتدرّج زمني: <span class="ltr">180 ms</span> ثم <span class="ltr">120 ms</span> ثم <span class="ltr">60 ms</span>، حتى يفصل أقرب مفتاح إلى القصر وحده.',
 stations:[
  (window.RAD7=window.RAD7||function(o){o=o||{};const C='#2C4A40',R='#B8322A',x=110;
   const brk=(y,i,auto)=>{const tr=o.trip===i;return `<rect x="${x-9}" y="${y}" width="18" height="18" rx="2" fill="${tr?'#F6D5CF':auto?'#F2C14E':'#FBF6EE'}" stroke="${tr?R:C}" stroke-width="2.2"/>`+(auto?`<path d="M${x-5} ${y+13}h4v-8h6" stroke="${C}" stroke-width="1.6" fill="none"/>`:`<path d="M${x-5} ${y+14}L${x+5} ${y+4}" stroke="${C}" stroke-width="1.8"/>`)};
   const num=(cx,cy,n)=>`<circle cx="${cx}" cy="${cy}" r="9" fill="#FBF6EE" stroke="${C}" stroke-width="1.5"/><text x="${cx}" y="${cy+4}" text-anchor="middle" font-size="10" font-weight="700" fill="${C}">${n}</text>`;
   const bus=(y,t,n)=>`<path d="M40 ${y}H300" stroke="${C}" stroke-width="5"/>`+DRA.L(232,y-8,t,12,700)+num(312,y,n);
   const L=(y1,y2)=>`<path d="M${x} ${y1}V${y2}" stroke="${C}" stroke-width="2.2"/>`;
   let s=`<circle cx="${x}" cy="30" r="12" fill="none" stroke="${C}" stroke-width="2.2"/><circle cx="${x}" cy="46" r="12" fill="none" stroke="${C}" stroke-width="2.2"/>`+num(140,38,1)+L(58,74)+brk(74,0,1)+num(140,83,2)+L(92,110)+bus(110,'الموزع الرئيس',3)
    +L(110,124)+brk(124,1,1)+num(140,133,4)+L(142,150)+brk(150,-1,0)+num(140,159,5)+L(168,184)+bus(184,'الموزع الفرعي',6)
    +L(184,198)+brk(198,2,1)+num(140,207,7)+L(216,222)+brk(222,-1,0)+num(140,231,8)+L(240,256)+bus(256,'موزع المستهلك',9);
   [70,150,230].forEach((lx,i)=>{s+=`<path d="M${lx} 256V266" stroke="${C}" stroke-width="2"/>`+brk.call(null,266,i===0?3:-9,0).replace(/x="101"/,`x="${lx-9}"`).replace(/M105 (\d+)L115/,`M${lx-5} $1L${lx+5}`)+`<path d="M${lx} 284V290" stroke="${C}" stroke-width="2"/><circle cx="${lx}" cy="300" r="10" fill="#FBF6EE" stroke="${C}" stroke-width="2"/>`});
   s+=num(260,280,10);
   if(o.f){const Y={F1:[60,118],F2:[60,192],F3:[60,264],F4:[44,292]}[o.f];s+=`<path d="M${Y[0]} ${Y[1]-14}l8 8l-6 2l10 10" stroke="${R}" stroke-width="2.6" fill="none"/>`}
   return s},{intro:true}),

  {st:1,short:'الشبكة الشعاعية',title:'7-2-2 الشبكات الكهربائية: الشبكة الشعاعية',ref:'ص 147–148',
   q:'من المحول إلى مصباحك في البيت… كم مفتاحاً يمر به التيار؟',
   art:DRA.art({aria:'شبكة شعاعية: محول ثم الموزع الرئيس ثم الموزع الفرعي ثم موزع المستهلك، وبينها مفاتيح',
    extra:RAD7()+'<rect x="80" y="14" width="80" height="48" rx="6" fill="transparent" data-tip="(1) المحول."/><rect x="96" y="70" width="60" height="26" rx="6" fill="transparent" data-tip="(2) مفتاح القدرة الأوتوماتيكي (1) (أصفر = أوتوماتيكي): يحمي المحول وموصل تغذية الموزع الرئيس، ويفصل الشبكة كلها."/><rect x="96" y="120" width="60" height="26" rx="6" fill="transparent" data-tip="(4) مفتاح القدرة الأوتوماتيكي (2): يحمي موصل تغذية الموزع الفرعي والموزع الفرعي نفسه."/><rect x="96" y="146" width="60" height="26" rx="6" fill="transparent" data-tip="(5) مفتاح القدرة في مدخل الموزع الفرعي (أبيض = يدوي): لفصل الموزع الفرعي."/><rect x="96" y="194" width="60" height="26" rx="6" fill="transparent" data-tip="(7) مفتاح القدرة الأوتوماتيكي (3): يحمي موصل تغذية موزع المستهلك والموزع نفسه."/><rect x="96" y="218" width="60" height="26" rx="6" fill="transparent" data-tip="(8) مفتاح القدرة في مدخل موزع المستهلك."/><rect x="40" y="262" width="240" height="52" rx="6" fill="transparent" data-tip="(10) تجهيزات وقاية الموصلات والأجهزة الكهربائية قبل كل جهاز."/>'}),
   cap:'رسم مبسّط من البنود 1–10 (الأرقام في الدوائر أرقام البنود).<br><b>مرّر المؤشر على المحول والمفاتيح وتجهيزات الوقاية (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[{predict:{q:'أي مفتاح في الشبكة الشعاعية يستطيع فصل التيار عن الشبكة بأكملها؟',opts:[
     ['مفتاح القدرة الأوتوماتيكي (3)',false,'هذا يحمي موزع المستهلك فقط.'],
     ['مفتاح القدرة في مدخل الموزع الفرعي',false,'يفصل الموزع الفرعي وحده.'],
     ['مفتاح القدرة الأوتوماتيكي (1)',true,'البند 2: «ويمكن بواسطته فصل التيار عن الشبكة بأكملها».']]}}],
   body:[
    {book:'<p>الشكل (7-3) يوضح مخططاً أحادياً لشبكة شعاعيه تحتوي على موزع رئيس وموزع فرعي وموزع المستهلك وبيانات مكونات الشبكة كالتالي:</p><ol><li>المحول</li><li>مفتاح القدرة الأوتوماتيكي (1): كمفتاح وقاية للمحول، ومفتاح وقاية لموصل تغذية الموزع الرئيس ووقاية للموزع الفرعي، ويمكن بواسطته فصل التيار عن الشبكة بأكملها.</li><li>الموزع الرئيس</li><li>مفتاح القدرة الأوتوماتيكي (2): وهو مفتاح وقاية لموصل تغذية الموزع الفرعي وللموزع الفرعي نفسه.</li><li>مفتاح القدرة: وهو مفتاح القدرة في مدخل الموزع الفرعي لفصل الموزع الفرعي.</li><li>الموزع الفرعي.</li><li>مفتاح القدرة الأوتوماتيكي (3): وهو مفتاح وقاية لموصل تغذية موزع المستهلك ولموزع المستهلك نفسه.</li><li>مفتاح القدرة: في مدخل موزع المستهلك لفصل موزع المستهلك.</li><li>موزع المستهلك.</li><li>تجهيزات لوقاية الموصلات والأجهزة الكهربائية.</li></ol>',ref:'ص 147'},
    {watch:'<p>الشكل (7-3) المطبوع في ص 148 نسخة مكررة من الشكل (7-2) (محول التوزيع)، ولا يحتوي الموزعات ولا البنود 1–10 التي يصفها النص. الرسم أدناه أعدنا بناءه من وصف النص.</p>',fix:true},
    {html:`<figure class="fig" style="margin:10px 0">${box(svg73(),340)}<figcaption><b>الشكل <span class="ltr">(7-3)</span></b> مخطط أحادي لشبكة شعاعية — أعدنا رسمه من البنود 1–10 في النص. <span class="ref">ص 148</span></figcaption></figure>`},
    {tip:'<p>«شعاعية» لأن التيار يخرج من المحول في اتجاه واحد ويتفرع كأشعة: كل موزع يتغذى من طريق واحد فقط. لذلك يحمي كل مفتاح أوتوماتيكي الموصل الذي بعده والموزع الذي يغذيه.</p>',title:'لماذا «شعاعية»؟'},
    {title:'مختبر مصغّر: ماذا يحمي كل مفتاح؟',widget:(el,B)=>DCML.sort(el,B,{intro:'اختر المفتاح المسؤول عن كل جزء.',cats:['أوتوماتيكي (1)','أوتوماتيكي (2)','أوتوماتيكي (3)'],items:[
     ['المحول وموصل تغذية الموزع الرئيس.',0,'البند 2.'],
     ['موصل تغذية الموزع الفرعي والموزع الفرعي نفسه.',1,'البند 4.'],
     ['موصل تغذية موزع المستهلك وموزع المستهلك نفسه.',2,'البند 7.']]})}
   ]},

  {st:2,short:'الانتقائية',title:'الانتقائية: فصل الجزء المعطوب وحده',ref:'ص 147',
   q:'قصر في بيت واحد… هل يجب أن ينطفئ الحي كله؟',
   art:DRA.art({aria:'الشبكة الشعاعية وقصر في موزع المستهلك، ويفصل المفتاح الأوتوماتيكي 3 فقط',bg:'#F7DCC8',
    extra:RAD7({f:'F3',trip:2})+'<rect x="44" y="244" width="40" height="34" rx="6" fill="transparent" data-tip="قصر في موزع المستهلك."/><rect x="96" y="194" width="60" height="26" rx="6" fill="transparent" data-tip="المفتاح الأوتوماتيكي (3) (باللون الأحمر): أقرب مفتاح قبل القصر، فهو وحده يجب أن يفصل."/><rect x="40" y="96" width="270" height="100" rx="6" fill="transparent" data-tip="ما قبل المفتاح (3) يبقى مغذّى: الموزع الرئيس والفرعي."/>'}),
   cap:'<b>مرّر المؤشر على مكان القصر والمفتاح الأحمر والموزعين (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[{predict:{q:'أين يكون أبطأ المفاتيح وأين أسرعها؟',opts:[
     ['الأبطأ عند المستهلك والأسرع عند المحول',false,'هكذا يفصل مفتاح المحول أولاً فتنطفئ الشبكة كلها.'],
     ['الأبطأ قبل المحول والأسرع في موصل المستهلك',true,'نص الكتاب ص 147.'],
     ['كلها بالسرعة نفسها',false,'عندها تفصل معاً عند أي قصر، وهذه «مشكلة الانتقائية».']]}}],
   body:[
    {book:'<p>ويجب أن تكون الشبكة انتقائية، بحيث يمكن فصل جزء من الشبكة الذي حدث عنده دائرة قصر وتسمى هذه المشكلة (مشكلة انتقائية)، وللحصول على الانتقائية يجب أن تتواءم مفاتيح الفصل مع بعضها البعض من حيث سرعة عملها، فتكون أبطأ المفاتيح موجودة قبل المحول وأسرع المفاتيح موجودة في موصل المستهلك.</p>',ref:'ص 147'},
    {tip:'<p>تيار القصر يمر في <b>كل</b> المفاتيح التي بين المحول ومكان القصر، فكلها «ترى» العطل. لكي لا تفصل كلها، نجعل أقربها إلى العطل أسرعها؛ فيفصل هو ويزول التيار قبل أن تعمل المفاتيح الأبعد.</p>',title:'الفكرة'},
    {add:'<p>في البيت: إذا حدث قصر في مقبس يفصل قاطع ذلك المقبس في لوحة البيت، ولا ينقطع التيار عن الحي من المحطة. هذه انتقائية بين قاطع البيت وقواطع الشبكة.</p>',title:'من الواقع'},
    {title:'مختبر مصغّر: من يجب أن يفصل؟',widget:(el,B)=>DCML.cases(el,B,{cases:[
     {q:'قصر في الموزع الفرعي (بعد المفتاح الأوتوماتيكي 2).',opts:[['المفتاح الأوتوماتيكي (1)',false,'يفصل الشبكة كلها بلا داعٍ.'],['المفتاح الأوتوماتيكي (2)',true,'أقرب مفتاح أوتوماتيكي قبل العطل.'],['المفتاح الأوتوماتيكي (3)',false,'لا يمر فيه تيار القصر؛ العطل قبله.']]},
     {q:'قصر في الموزع الرئيس.',opts:[['المفتاح الأوتوماتيكي (2)',false,'العطل قبله، فلا يمر فيه تيار القصر.'],['المفتاح الأوتوماتيكي (1)',true,'هو الوحيد الذي يرى هذا القصر.']]}]})}
   ]},

  {st:3,short:'التدرّج الزمني',title:'مفاتيح القدرة الأوتوماتيكية بتدرّج زمني (الشكل 7-4)',ref:'ص 148–149',
   q:'كيف «يعرف» المفتاح البعيد أن عليه أن ينتظر؟',
   art:DRA.art({aria:'الشكل 7-4: محول وأربعة مفاتيح قدرة أوتوماتيكية بأزمنة 180 و120 و60 ميلي ثانية ثم محرك',bg:'#E4ECF6',
    parts:[{svg:svg74(),vb:'0 20 320 170',box:[16,22,328,134],tips:[[96,40,40,40,'مفتاح قدرة أوتوماتيكي بتأخير قصير: المرحل الحراري بالقوس والسهم = تأخير زمني.'],[160,24,24,70,'قضيب موزع (عقدة يدخل عندها الخط).'],[100,160,220,24,'الأزمنة: ⟦<span class="ltr">180 ms</span>⟧ للمفتاح الأول بعد المحول، ثم ⟦<span class="ltr">120 ms</span>⟧ ثم ⟦<span class="ltr">60 ms</span>⟧.']]},
           {svg:svg74(),vb:'290 20 310 170',box:[16,164,328,134],tips:[[400,30,60,80,'«مفتاح قدرة محدد التيار»: أسرع من المفاتيح العادية، بلا زمن في الشكل (لحظي).'],[540,100,40,44,'المحرك ⟦M 3~⟧.']]}],
    extra:'<path d="M30 160H330" stroke="#66665A" stroke-dasharray="4 4"/>'}),
   cap:'الشكل <span class="ltr">(7-4)</span> مقسوماً إلى سطرين (السطر الثاني تكملة الأول).<br><b>مرّر المؤشر على المفتاح والقضيب والأزمنة والمفتاح محدد التيار (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[{predict:{q:'في الشكل (7-4) ما زمن المفتاح الأول بعد المحول؟',opts:[
     ['<span class="ltr">60 ms</span>',false,'هذا زمن المفتاح الثالث، الأقرب إلى المستهلك.'],
     ['لحظي',false,'اللحظي هو المفتاح محدد التيار قبل المحرك.'],
     ['<span class="ltr">180 ms</span>',true,'الأبطأ قبل المحول (قريباً منه).']]}}],
   body:[
    {book:'<p>ويتم استخدام مفاتيح القدرة الأوتوماتيكية بتأخير قصير لعمل انتقائية جيدة للشبكة الشعاعية وذلك بضبط مدة التأخير، ويمكن جعل سرعة عمل فصل المفاتيح متدرجة زمنياً. ويمكن استخدام مفاتيح القدرة الأوتوماتيكية محددة التيار حيث إنها أسرع من المفاتيح العادية. والشكل (7-4) يبين مفاتيح قدرة أوتوماتيكية مرتبة بتأخير قصير (تدرج زمني) في الزمن لعمل انتقائية جيدة للشبكة عند الفصل.</p>',ref:'ص 148–149'},
    {watch:'<p>في النص «مفاتيح قدرة لاأوتوماتكية» وفي عنوان الشكل «لأوتوماتيكية»، والمقصود «أوتوماتيكية» (صحّحناها في النص أعلاه).</p>',fix:true},
    {tip:'<p>المفاتيح التي يمر فيها تيار القصر تبدأ العدّ معاً. المفتاح الأقرب إلى القصر ضُبط على أقصر زمن، فيفصل أولاً ويزول التيار، فترجع المرحلات الأخرى قبل أن يكتمل زمنها. هذا هو «التدرّج الزمني».</p>',title:'كيف يعمل التدرّج؟'},
    {title:'مختبر مصغّر: ضع القصر واقرأ الزمن',widget:(el,B)=>DCML.lab(el,B,{intro:'اختر مكان القصر وطريقة الضبط. الأزمنة من الشكل <span class="ltr">(7-4)</span>؛ والوضع «بلا تدرّج» ليس من الكتاب، أضفناه للمقارنة.',
     predict:{q:'قصر في موزع المستهلك (بعد مفتاح <span class="ltr">60 ms</span>). أي مفتاح يفصل؟',opts:[['مفتاح <span class="ltr">180 ms</span>',false,'يرى التيار لكنه أبطأ؛ يزول التيار قبل أن يكتمل زمنه.'],['مفتاح <span class="ltr">60 ms</span> وحده',true,'أسرع المفاتيح التي ترى القصر.'],['الثلاثة معاً',false,'هذا يحدث فقط لو ضُبطت على الزمن نفسه.']]},
     ins:[{k:'f',l:'مكان القصر',seg:[[1,'الموزع الرئيس'],[2,'الموزع الفرعي'],[3,'موزع المستهلك'],[4,'موصل المحرك']],v:3},
          {k:'m',l:'ضبط المفاتيح',seg:[['g','متدرّج (7-4)'],['x','بلا تدرّج (للمقارنة)']],v:'g'}],
     calc:(s)=>{const T=s.m==='g'?[180,120,60,0]:[60,60,60,0],see=[0,1,2,3].filter(i=>i<s.f),tm=Math.min(...see.map(i=>T[i])),tr=see.filter(i=>T[i]===tm),N=['Q1','Q2','Q3','Q4'];
      let p='<svg viewBox="0 0 330 150" role="img" aria-label="مخطط الزمن" style="font-family:var(--font)" direction="ltr">';
      [0,60,120,180].forEach(v=>{const X=50+v*1.4;p+=`<path d="M${X} 10V128" stroke="var(--line)"/><text x="${X}" y="142" text-anchor="middle" font-size="10" fill="var(--muted)">${v}</text>`});
      p+='<text x="328" y="126" text-anchor="end" font-size="10" fill="var(--muted)">ms</text>';
      N.forEach((n,i)=>{const y=14+i*28,sw=see.includes(i),t=tr.includes(i);p+=`<text x="40" y="${y+13}" text-anchor="end" font-size="12" font-weight="700" fill="var(${t?'--stop':'--fg'})">${n}</text><rect x="50" y="${y}" width="252" height="18" rx="4" fill="var(--surface-2)"/>`;
       if(T[i])p+=`<path d="M${50+T[i]*1.4} ${y-2}V${y+20}" stroke="var(--stop)" stroke-width="2"/>`;
       if(sw)p+=`<rect x="50" y="${y+3}" width="${Math.max(3,tm*1.4)}" height="12" rx="3" fill="var(${t?'--stop':'--live'})" opacity=".85"/>`});
      p+='</svg>';
      return {pic:p,facts:[['يرى تيار القصر',see.map(i=>N[i]).join(' و ')],['يفصل',tr.map(i=>N[i]).join(' و '),'hi'],['زمن الفصل',tm?tm+' ms':'لحظي']],
       msg:tr.length>1?'فصلت عدة مفاتيح معاً فانقطع جزء سليم من الشبكة: هذه «مشكلة الانتقائية».':'فصل أقرب مفتاح قبل القصر وحده، وبقي ما قبله مغذّى.',cls:tr.length>1?'bad':''}}})}
   ]},

  {recap:[
   'الشبكة الشعاعية: محول ثم موزع رئيس ثم فرعي ثم موزع المستهلك، ولكل منها مفتاح قدرة أوتوماتيكي يحميه.',
   'الانتقائية: يُفصل الجزء الذي حدث عنده القصر وحده.',
   'أبطأ المفاتيح قبل المحول وأسرعها في موصل المستهلك.',
   'التدرّج الزمني في الشكل (7-4): 180 ثم 120 ثم <span class="ltr">60 ms</span>، والمفتاح محدد التيار أسرعها.']}
],
 theory:[
  {h:'7-2-2 الشبكات الكهربائية',ref:'ص 147',html:`<p>الشكل (7-3) يوضح مخططاً أحادياً لشبكة شعاعيه تحتوي على موزع رئيس وموزع فرعي وموزع المستهلك وبيانات مكونات الشبكة كالتالي:</p><ol>
   <li>المحول</li><li>مفتاح القدرة الأوتوماتيكي (1): كمفتاح وقاية للمحول، ومفتاح وقاية لموصل تغذية الموزع الرئيس ووقاية للموزع الفرعي، ويمكن بواسطته فصل التيار عن الشبكة بأكملها.</li><li>الموزع الرئيس</li><li>مفتاح القدرة الأوتوماتيكي (2): وهو مفتاح وقاية لموصل تغذية الموزع الفرعي وللموزع الفرعي نفسه.</li><li>مفتاح القدرة: وهو مفتاح القدرة في مدخل الموزع الفرعي لفصل الموزع الفرعي.</li><li>الموزع الفرعي.</li><li>مفتاح القدرة الأوتوماتيكي (3): وهو مفتاح وقاية لموصل تغذية موزع المستهلك ولموزع المستهلك نفسه.</li><li>مفتاح القدرة: في مدخل موزع المستهلك لفصل موزع المستهلك.</li><li>موزع المستهلك.</li><li>تجهيزات لوقاية الموصلات والأجهزة الكهربائية.</li></ol>
   <p>ويجب أن تكون الشبكة انتقائية، بحيث يمكن فصل جزء من الشبكة الذي حدث عنده دائرة قصر وتسمى هذه المشكلة (مشكلة انتقائية)، وللحصول على الانتقائية يجب أن تتواءم مفاتيح الفصل مع بعضها البعض من حيث سرعة عملها، فتكون أبطأ المفاتيح موجودة قبل المحول وأسرع المفاتيح موجودة في موصل المستهلك.</p>`},
  {fig:'(7-3)',ref:'ص 148',caption:'مخطط أحادي لشبكة شعاعية — أعدنا رسمه من البنود 1–10 في النص (الأرقام في الدوائر هي أرقام البنود).',draw:()=>box(svg73(),360)},
  {err:'الشكل (7-3) المطبوع في ص 148 نسخة مكررة من الشكل (7-2) (محول التوزيع)، ولا يحتوي الموزعات ولا البنود 1–10 التي يصفها النص. الرسم أعلاه أعدنا بناءه من وصف النص.'},
  {h:'التدرّج الزمني',ref:'ص 148–149',html:'<p>ويتم استخدام مفاتيح القدرة الأوتوماتيكية بتأخير قصير لعمل انتقائية جيدة للشبكة الشعاعية وذلك بضبط مدة التأخير، ويمكن جعل سرعة عمل فصل المفاتيح متدرجة زمنياً. ويمكن استخدام مفاتيح القدرة الأوتوماتيكية محددة التيار حيث إنها أسرع من المفاتيح العادية. والشكل (7-4) يبين مفاتيح قدرة أوتوماتيكية مرتبة بتأخير قصير (تدرج زمني) في الزمن لعمل انتقائية جيدة للشبكة عند الفصل.</p>'},
  {fig:'(7-4)',ref:'ص 149',caption:'المفاتيح القدرة الأوتوماتيكية بتدرج زمني: <span class="ltr">180 ms</span> ثم <span class="ltr">120 ms</span> ثم <span class="ltr">60 ms</span>، والمفتاح الأخير قبل المحرك محدد التيار.',draw:()=>box(svg74(),640,520)},
  {err:'في النص «مفاتيح قدرة لاأوتوماتكية» وفي عنوان الشكل «لأوتوماتيكية»، والمقصود «أوتوماتيكية» (صحّحناها في النص أعلاه).'},
  {note:`${TIP}<b>كيف يعمل التدرّج؟</b> تيار القصر يمر في كل المفاتيح التي بين المحول ومكان القصر، فتبدأ مرحلاتها العدّ معاً. المفتاح الأقرب إلى القصر ضُبط على أقصر زمن (<span class="ltr">60 ms</span>)، فيفصل أولاً ويزول التيار، فترجع المرحلات الأخرى قبل أن يكتمل زمنها (<span class="ltr">120 ms</span> و180 ms). وهكذا ينقطع الجزء المعطوب وحده، وهذا معنى «الانتقائية». جرّب ذلك في المختبر.`}
 ],
 lab:(el)=>labGrading(el),
 examples:[
  drawEx({title:'مثال مرسوم: الشبكة الشعاعية من وصف النص',ref:'ص 147',
   q:'<p>ارسم المخطط أحادي الخط لشبكة شعاعية فيها البنود 1–10 الواردة في النص (الشكل 7-3). الجزء الجديد في كل خطوة بالأزرق.</p>',
   steps:['(1) <b>المحول</b>: دائرتان متداخلتان في أعلى الرسم.','(2) <b>مفتاح القدرة الأوتوماتيكي 1</b>: تلامس، وبجانبه مرحل بتأخير زمني. يحمي المحول وموصل الموزع الرئيس، ويفصل الشبكة كلها.','(3) <b>الموزع الرئيس</b>: قضيب أفقي سميك، تخرج منه فروع إلى مستهلكين آخرين.','(4) <b>مفتاح القدرة الأوتوماتيكي 2</b>: يحمي موصل تغذية الموزع الفرعي والموزع الفرعي نفسه.','(5) <b>مفتاح القدرة</b> في مدخل الموزع الفرعي (يدوي، لفصله فقط).','(6) <b>الموزع الفرعي</b>.','(7) <b>مفتاح القدرة الأوتوماتيكي 3</b>: يحمي موصل تغذية موزع المستهلك والموزع نفسه.','(8) <b>مفتاح القدرة</b> في مدخل موزع المستهلك.','(9) <b>موزع المستهلك</b>.','(10) <b>تجهيزات الوقاية</b> (مصاهر هنا) قبل كل جهاز: محرك، مصباح، مقبس.'],
   svg:i=>box(svg73(i,true),360)})],
 quiz:[
  {q:'ما معنى أن تكون الشبكة «انتقائية»؟',o:['أن يُفصل الجزء الذي حدث عنده القصر وحده','أن تُفصل الشبكة كلها عند أي عطل','أن تعمل المفاتيح كلها بالسرعة نفسها','أن يختار المستهلك مصدر التغذية'],c:0,e:'«يمكن فصل جزء من الشبكة الذي حدث عنده دائرة قصر» (ص 147).'},
  {q:'أين يكون أبطأ المفاتيح وأين أسرعها؟',o:['الأبطأ قبل المحول والأسرع في موصل المستهلك','الأبطأ عند المستهلك والأسرع عند المحول','كلها بالسرعة نفسها','الأسرع في الموزع الفرعي'],c:0,e:'نص الكتاب: «فتكون أبطأ المفاتيح موجودة قبل المحول وأسرع المفاتيح موجودة في موصل المستهلك».'},
  {q:'في الشكل (7-4) ما زمن المفتاح الأول بعد المحول؟',o:['<span class="ltr">180 ms</span>','<span class="ltr">120 ms</span>','<span class="ltr">60 ms</span>','لحظي'],c:0,e:'الأزمنة من المحول نحو المحرك: 180 ثم 120 ثم <span class="ltr">60 ms</span>.'},
  {q:'حدث قصر في موزع المستهلك (بعد المفتاح ذي <span class="ltr">60 ms</span>). ماذا يحدث؟',o:['يفصل مفتاح <span class="ltr">60 ms</span> وحده ويبقى ما قبله مغذّى','تفصل المفاتيح الثلاثة معاً','يفصل مفتاح <span class="ltr">180 ms</span> أولاً','لا يفصل شيء'],c:0,e:'الثلاثة ترى التيار، لكن <span class="ltr">60 ms</span> يكتمل أولاً فيزول التيار وترجع الأخرى.'},
  {q:'لماذا يوضع مفتاح قدرة «محدد التيار» قرب المستهلك؟',o:['لأنه أسرع من المفاتيح العادية','لأنه أبطأ','لأنه لا يفصل أبداً','ليرفع الجهد'],c:0,e:'«مفاتيح القدرة الأوتوماتيكية محددة التيار حيث إنها أسرع من المفاتيح العادية».'},
  {q:'أي مفتاح في الشبكة الشعاعية يستطيع فصل التيار عن الشبكة بأكملها؟',o:['مفتاح القدرة الأوتوماتيكي (1)','مفتاح القدرة الأوتوماتيكي (3)','مفتاح القدرة في مدخل موزع المستهلك','تجهيزات الوقاية (10)'],c:0,e:'البند 2: «ويمكن بواسطته فصل التيار عن الشبكة بأكملها».'}]
});

/* =====================================================================================
   7-3 Motor protection: figures (7-5) … (7-8)
   ===================================================================================== */
/* executive diagram of a motor protective switch. o: {n (N bar), busFuse, brFuse, mag, nums, delta, pe}
   stages: 0 busbars, 1 branch fuses, 2 Q1 contacts + handle, 3 releases, 4 terminals + motor, 5 PE */
function fMotX(o){const X=[130,160,190],W=290,yQ=o.brFuse?118:92,yM=yQ+150;
 const bars=o.n?[['L1',24],['L2',34],['L3',44],['N',54]]:[['L1',24],['L2',34],['L3',44]];
 const st=[
  c=>(o.title?T(160,12,o.title,c):'')+bars.map(([l,y])=>(o.busFuse?ln(40,y,58,y,c)+fuseH(58,y,c,24)+ln(82,y,270,y,c):ln(40,y,270,y,c))+T(36,y+4,l,c,{a:'end',fs:10})).join('')+(o.pe?ln(40,64,270,64,'dd '+cs(c))+T(36,68,'PE',c,{a:'end',fs:10}):'')+X.map((x,i)=>nd(x,24+i*10,c)+ln(x,24+i*10,x,o.brFuse?70:yQ,c)).join(''),
  c=>o.brFuse?X.map(x=>fuse(x,70,c,24)+ln(x,94,x,yQ,c)).join(''):'',
  c=>{let s=rc(112,yQ-6,96,o.mag?92:76,'dd th '+cs(c));X.forEach((x,i)=>{s+=sw(x,yQ+2,28,true,c)+(o.nums?T(x+6,yQ+4,['1','3','5'][i],c,{a:'start',fs:9}):'')});return s+ln(84,yQ+16,X[2]-5.5,yQ+16,'dt '+cs(c))+opCB(76,yQ+16,c)+T(58,yQ+20,'Q1',c,{a:'end',fs:10})},
  c=>{let s='';X.forEach((x,i)=>{s+=ln(x,yQ+30,x,yQ+(o.mag?82:66),c)+rc(x-11,yQ+36,22,14,'bg '+cs(c))+thermal(x,yQ+45,c)+(o.mag?rc(x-11,yQ+52,22,14,'bg '+cs(c))+T(x,yQ+63,'I&gt;',c,{fs:9}):'')+(o.nums?T(x+6,yQ+(o.mag?80:64),['2','4','6'][i],c,{a:'start',fs:9}):'')});
   return s+ln(X[0]-11,yQ+43,94,yQ+43,'dt '+cs(c))+(o.mag?pl([[X[0]-11,yQ+59],[94,yQ+59],[94,yQ+16]],'dt '+cs(c)):ln(94,yQ+43,94,yQ+16,'dt '+cs(c)))},
  c=>{const yT=yQ+104,yc=yM+20;let s='';X.forEach((x,i)=>{const yy=yc-Math.sqrt(36*36-(x-160)*(x-160));s+=ln(x,yQ+(o.mag?82:66),x,yT-3,c)+tm(x,yT,c)+T(x-8,yT-4,['U','V','W'][i],c,{a:'end',fs:9.5})+ln(x,yT+3,x,yy,c)});
   return s+motor(160,yc,36,'M',o.delta?'3~Δ':'3~',c)},
  c=>o.pe?ln(250,64,250,yM+20,'dd '+cs(c))+nd(250,64,c)+ln(250,yM+20,196,yM+20,'dd '+cs(c))+nd(196,yM+20,c)+(o.delta?T(240,yM+14,'PE',c,{fs:9.5}):''):''];
 return {st,W,H:yM+64}}
function fMotL(o){const x=90,W=190;
 const st=[
  c=>T(100,28,'380/220 V 3/N/PE ~ 60 Hz',c,{fs:10.5})+ln(15,40,185,40,'tk '+cs(c))+nd(x,40,c)+ln(x,40,x,70,c)+tick(x,54,'4',c),
  c=>o.brFuse?fuse(x,70,c,24)+tick(x,82,'3',c)+ln(x,94,x,118,c)+tick(x,108,'4',c):ln(x,70,x,118,c),
  c=>tick(x,126,'3',c)+ln(x,118,x,134,c)+sw(x,134,30,true,c)+ln(x-40,149,x-5.5,149,'dt '+cs(c))+opCB(x-48,149,c)+T(x-62,153,'Q1',c,{a:'end',fs:10}),
  c=>ln(x,164,x,214,c)+releaseSL(x,180,c,'3'),
  c=>tick(x,204,'4',c)+motor(x,240,24,'M',o.delta?'3~Δ':'3~',c)+ln(x,214,x,216,c)];
 return {st,W,H:272}}
const svgMotX=(o,k,hl,g)=>{const f=fMotX(o);return SV(`0 0 ${f.W} ${f.H}`,seq(f.st,g||f.st.map((_,i)=>[i]),k==null?99:k,hl),'الدائرة التنفيذية لمفتاح وقاية محرك')};
const svgMotL=(o,k,hl,g)=>{const f=fMotL(o);return SV(`0 0 ${f.W} ${f.H}`,seq(f.st,g||f.st.map((_,i)=>[i]),k==null?99:k,hl),'الدائرة الخطية لمفتاح وقاية محرك')};
const O75={n:1,pe:1,mag:1,nums:1,title:'380/220 V 3/N/PE ~ 60 Hz'},O78={n:1,pe:1,mag:1,nums:1,brFuse:1,delta:1,title:'380/220 V 3/N/PE ~ 60 Hz'};
const O76={busFuse:1,mag:1,nums:1},O77={busFuse:1,brFuse:1,mag:0};
function fig767Widget(el){let md='book';
 const draw=()=>{const bk=md==='book';const a=box(svgMotX(O76),300),b=box(svgMotX(O77),300);
  el.innerHTML=`<div class="d7row"><span class="sub">الشكلان (7-6) و(7-7):</span>${segHTML('m76',[['book','كما في الكتاب'],['fixed','المصحح']],md)}</div>`+
   fig2(`<div>${bk?a:b}${cap(`<b>الشكل (7-6)</b> الدائرة التنفيذية لمفتاح وقاية محرك${bk?'':' (بدون فصل مغناطيسي سريع، مع مصهرات على التوالي)'} <span class="ref">ص 151</span>`)}</div>`,`<div>${bk?b:a}${cap(`<b>الشكل (7-7)</b> الدائرة التنفيذية لمفتاح وقاية محرك مع فصل مغناطيسي سريع <span class="ref">ص 152</span>`)}</div>`)+
   (bk?'<p class="sub">في الكتاب: رسم (7-6) فيه قاطع مغناطيسي I&gt; بلا مصاهر فرعية، ورسم (7-7) فيه مصاهر فرعية وقاطع حراري فقط.</p>'
    :'<div class="callout err"><span class="fixnote">الرسمان متبادلان بالنسبة للنص: النص يجعل (7-6) مفتاحاً <b>بدون</b> فصل مغناطيسي سريع تحميه <b>مصهرات على التوالي</b> من القصر، و(7-7) مفتاحاً <b>مع</b> فصل مغناطيسي سريع. هنا وضعنا كل رسم تحت العنوان الذي يطابقه.</span></div>');
  el.querySelectorAll('[data-m76]').forEach(b=>b.onclick=()=>{md=b.dataset.m76;draw()})};
 draw()}

/* ---------- lab u7-l3: thermal (delayed) and magnetic (instant) release of a motor protective switch ---------- */
function labMotor(el){
 const S={model:'a',q1:false,load:'n',heat:0,trip:null,blown:false,ang:0,hist:{th:0,mag:0,blk:0,blown:0,rearm:0,fuse:0},msgT:''};
 el.innerHTML=`<div class="d7lab"><div class="grid">
  <section class="panel c7"><h2>وقاية المحرك <small>مبنية على الشكلين (7-5) و(7-7)</small></h2>
   <div class="d7row">${segHTML('mm',[['a','مفتاح وقاية بحراري ومغناطيسي (7-5)'],['b','حراري فقط + مصاهر (رسم 7-7)']],S.model)}</div>
   <div id="msv"></div>
   <div class="legend"><span><i style="background:var(--live)"></i>عليه جهد / يمر فيه تيار</span><span><i style="background:var(--wire)"></i>بلا جهد</span><span><i style="background:var(--stop)"></i>فصل / انصهر</span></div></section>
  <section class="panel c5"><h2>لوحة التشغيل</h2>
   <div class="d7row">${swHTML('mq1','Q1','مفتاح وقاية المحرك',0)}</div>
   <div class="d7row"><span class="sub">الحمل على عمود المحرك:</span>${segHTML('ml',[['n','عادي'],['o','زيادة حمل'],['s','قصر في الموصل']],S.load)}</div>
   <div class="d7row" id="mfz" hidden><button class="btn" id="mfuse">بدّل المصاهر</button></div>
   <div style="margin-top:10px"><span class="sub">حرارة العنصر الحراري (ثنائي المعدن) — بلا أرقام، والزمن للعرض فقط:</span><div class="d7heat"><i id="mheat"></i><em style="left:75%"></em></div><span class="sub" style="font-size:11.5px">الخط الأحمر: عنده يفصل القاطع الحراري.</span></div>
   <div class="d7chips" id="mchips"></div><div class="d7msg" id="mmsg">أغلق Q1 ليدور المحرك.</div>
   <h3 class="sm">خطوات التجربة</h3><ol class="steps" id="msteps"></ol></section></div></div>`;
 const $=s=>el.querySelector(s);let lastM='';const msg=(t,k)=>{if(t===lastM)return;lastM=t;const m=$('#mmsg');m.innerHTML=t;m.className='d7msg'+(k?' '+k:'')};
 const ener=()=>S.q1&&!S.blown, runs=()=>ener()&&S.load!=='s'&&!chF('phloss');
 /* «اكتشف العطل» فقط: قصر والمغناطيسي معطل، أو انقطاع وجه (المحرك واقف يسحب تياراً كبيراً) ⇐ يسخن العنصر الحراري بسرعة */
 const hot=()=>ener()&&((S.load==='s'&&chF('magdead'))||(chF('phloss')&&S.load!=='s'));
 const drawSV=()=>{const X=[130,160,190],a=S.model==='a',yQ=a?92:118,yM=yQ+150,yc=yM+20,yT=yQ+104;
  const en=ener(),fl=en;const c0=fl?'fl':'on',c1=S.blown?'off':c0,c2=en?'fl':'off';
  let s=[['L1',24],['L2',34],['L3',44]].map(([l,y])=>ln(40,y,270,y,'on')+T(36,y+4,l,'',{a:'end',fs:10})).join('');
  X.forEach((x,i)=>{s+=nd(x,24+i*10,'on')+ln(x,24+i*10,x,a?yQ:70,c0)});
  if(!a)X.forEach(x=>{s+=rc(x-5,70,10,24,'bg '+(S.blown?'tr':''))+(S.blown?ln(x-5,72,x+5,92,'tr')+ln(x+5,72,x-5,92,'tr'):ln(x,70,x,94,c0+' th'))+ln(x,94,x,yQ,c1)});
  s+=rc(112,yQ-6,96,a?92:76,'dd th');
  X.forEach(x=>{s+=ln(x,yQ+2,x,yQ+10,c1)+(S.q1?ln(x,yQ+22,x,yQ+10,c2):ln(x,yQ+22,x-11,yQ+11,S.trip?'tr':'off'))+ln(x,yQ+22,x,yQ+30,c2)+ln(x,yQ+30,x,yT-3,c2);
   s+=`<rect x="${x-11}" y="${yQ+36}" width="22" height="14" class="${S.trip==='th'?'tr':''}" style="fill:color-mix(in srgb,var(--stop) ${Math.round(Math.min(1,S.heat/1.33)*60)}%,var(--surface))"/>`+thermal(x,yQ+45,S.trip==='th'?'tr':'');
   if(a)s+=rc(x-11,yQ+52,22,14,'bg '+(S.trip==='mag'?'tr':''))+T(x,yQ+63,'I&gt;','',{fs:9,cl:S.trip==='mag'?'red':''});
   s+=tm(x,yT,c2)});
  s+=ln(84,yQ+16,S.q1?X[2]:X[2]-5.5,yQ+16,'dt mu')+opCB(76,yQ+16,S.trip?'tr':'')+T(58,yQ+20,'Q1','',{a:'end',fs:10})+`<rect class="hit" data-k="q1" x="40" y="${yQ}" width="70" height="34"/>`;
  X.forEach((x,i)=>{const yy=yc-Math.sqrt(36*36-(x-160)*(x-160));s+=T(x-8,yT-4,['U','V','W'][i],'',{a:'end',fs:9.5})+ln(x,yT+3,x,yy,c2)});
  s+=ci(160,yc,36,runs()?'on':'')+`<g id="mrot" transform="rotate(${S.ang} 160 ${yc})">${ln(160,yc-26,160,yc-16,'th mu')+ln(160,yc+16,160,yc+26,'th mu')}</g>`+T(160,yc-1,'M','',{fs:13})+T(160,yc+13,'3~','',{fs:11});
  if(S.load==='s')s+=pl([[200,yT+14],[214,yT+24],[206,yT+28],[222,yT+40]],'tr')+ln(190,yT+18,204,yT+18,'tr')+A(226,yT+50,'قصر','',{fs:10,cl:'red'});
  $('#msv').innerHTML=box(SV(`0 0 290 ${yM+64}`,s,'وقاية المحرك: الدائرة الحية'),380);
  const r=$('#msv').querySelector('[data-k]');r&&r.addEventListener('click',toggleQ1)};
 const chips=()=>{$('#mchips').innerHTML=chip('المحرك',runs()?(S.load==='o'?'يدور بحمل زائد':'يدور'):'متوقف',runs()?'on':'')+chip('القاطع الحراري',S.trip==='th'?'فصل':S.heat>0.5?'يسخن':'بارد',S.trip==='th'?'bad':S.heat>0.5?'on':'')+(S.model==='a'?chip('القاطع المغناطيسي',S.trip==='mag'?'فصل':'جاهز',S.trip==='mag'?'bad':''):chip('المصاهر',S.blown?'منصهرة':'سليمة',S.blown?'bad':'ok'));
  $('#mheat').style.width=Math.min(100,S.heat/1.33*100)+'%';$('#mq1').setAttribute('aria-pressed',String(S.q1));$('#mfz').hidden=!S.blown;segSet(el,'mm',S.model);segSet(el,'ml',S.load)};
 const short=()=>{if(!ener()||S.load!=='s')return;
  if(S.model==='a'&&chF('magdead')){msg('<b>قصر!</b>','bad')}
  else if(S.model==='a'){S.q1=false;S.trip='mag';S.hist.mag++;msg('<b>قصر!</b> التيار كبير جداً فيفصل القاطع المغناطيسي I&gt; <b>فوراً</b> قبل أن يتضرر الموصل أو المحرك.','bad')}
  else{S.blown=true;S.hist.blown++;msg('<b>قصر!</b> هذا المفتاح بلا قاطع مغناطيسي، والقاطع الحراري بطيء جداً على تيار القصر، فتنصهر <b>المصاهر</b> الموصلة على التوالي فوراً وتحمي المحرك والموصل والمفتاح.','bad')}};
 function toggleQ1(){if(S.q1){S.q1=false;S.trip=null;msg('فتحت Q1 يدوياً: توقف المحرك. مفتاح وقاية المحرك هو أيضاً مفتاح تشغيل (مفتاح أجهزة).');refresh();return}
  if(S.trip==='th'&&S.heat>0.5){S.hist.blk++;msg('لا يمكن إعادة التشغيل الآن: العنصر الحراري ما زال ساخناً. انتظر حتى يبرد (يهبط المؤشر).','bad');refresh();return}
  const wasTh=S.trip==='th';S.q1=true;S.trip=null;if(wasTh&&S.load==='n')S.hist.rearm++;
  if(S.load==='s')short();else if(S.blown)msg('Q1 مغلق لكن المصاهر منصهرة: لا جهد يصل إلى المحرك. بدّلها أولاً.','bad');else msg(S.load==='o'?'المحرك يدور بحمل زائد: يسحب تياراً أكبر من المضبوط فيسخن العنصر الحراري…':'المحرك يدور بحمله العادي.','ok');refresh()}
 const refresh=()=>{drawSV();chips();steps.check()};
 $('#mq1').addEventListener('click',toggleQ1);
 el.querySelectorAll('[data-ml]').forEach(b=>b.addEventListener('click',()=>{S.load=b.dataset.ml;if(S.load==='s')short();else if(runs())msg(S.load==='o'?'زيادة حمل: التيار أكبر من التيار الاسمي المضبوط عليه القاطع، فيسخن العنصر الحراري ببطء…':'رجع الحمل عادياً.');refresh()}));
 el.querySelectorAll('[data-mm]').forEach(b=>b.addEventListener('click',()=>{S.model=b.dataset.mm;S.blown=false;S.trip=null;S.q1=false;S.heat=0;msg(S.model==='a'?'مفتاح الوقاية في الشكل (7-5): قاطع حراري للتحميل الزائد وقاطع مغناطيسي I&gt; للقصر.':'الرسم (7-7): قاطع حراري فقط، ومصاهر على التوالي تحمي من القصر.');refresh()}));
 $('#mfuse').addEventListener('click',()=>{if(S.load==='s'){msg('أزل القصر أولاً (اختر حملاً عادياً) ثم بدّل المصاهر.','bad');return}S.blown=false;S.hist.fuse++;msg('بُدّلت المصاهر.'+(S.q1?' المحرك يدور.':''),'ok');refresh()});
 let acc=0;
 loopOn(el,dt=>{const target=hot()?(S.load==='s'?3:1.6):runs()?(S.load==='o'?1.6:0.3):0,tau=hot()?(S.load==='s'?1.5:4):runs()?(S.load==='o'?4:2):5;S.heat+=(target-S.heat)*(1-Math.exp(-dt/tau));
  if(((runs()&&(S.load==='o'||chF('thlow')))||hot())&&S.heat>=(chF('thlow')?0.25:1)&&!chF('thdead')){S.q1=false;S.trip='th';S.hist.th++;msg('فصل <b>القاطع الحراري</b> بعد مرور بعض الوقت: «عندما تتجاوز شدة التيار القيمة المضبوطة، يفصل القاطع الدائرة بعد مرور بعض الوقت».','bad');refresh()}
  if(runs())S.ang=(S.ang+dt*(S.load==='o'?260:420))%360;
  acc+=dt;const g=el.querySelector('#mrot');if(g){const yc=+g.getAttribute('transform').split(' ')[2].replace(')','');g.setAttribute('transform',`rotate(${S.ang} 160 ${yc})`)}
  if(acc>0.15){acc=0;chips()}});
 const steps=stepsUI($('#msteps'),[
  {t:'شغّل المحرك',x:'أغلق Q1 (المفتاح في اللوحة أو على الرسم).',done:()=>runs()},
  {t:'زيادة الحمل',x:'اختر «زيادة حمل» وراقب حرارة العنصر الحراري.',done:()=>S.hist.th>0},
  {t:'أعد التشغيل',x:'حاول إغلاق Q1 فوراً، ثم اختر حملاً «عادياً» وانتظر حتى يبرد العنصر وأغلق Q1.',done:()=>S.hist.rearm>0},
  {t:'قصر في الموصل',x:'والمحرك يدور، اختر «قصر في الموصل».',done:()=>S.hist.mag>0},
  {t:'مفتاح بلا قاطع مغناطيسي',x:'اختر «حراري فقط + مصاهر»، أغلق Q1، ثم اصنع قصراً.',done:()=>S.hist.blown>0},
  {t:'بدّل المصاهر',x:'اختر حملاً عادياً، ثم «بدّل المصاهر».',done:()=>S.hist.fuse>0}]);
 refresh()}

B.lesson({
 id:'u7-l3',unit:7,order:3,pages:'149–153',
 title:'وقاية المحركات',
 summary:'مفتاح وقاية المحرك: قاطع حراري يفصل بعد زمن عند زيادة الحمل، وقاطع مغناطيسي سريع يفصل فوراً عند القصر، أو مصاهر على التوالي حين لا يوجد فصل مغناطيسي؛ مع الدائرتين الخطية والتنفيذية.',
 stations:[
  {intro:true},

  {st:1,short:'مفتاح وقاية المحرك',title:'7-3 وقاية المحركات: مفتاح وقاية المحرك (الشكل 7-5)',ref:'ص 149–150',
   q:'المحرك يسحب تياراً زائداً لدقيقة بسبب حمل ثقيل، ومرة أخرى يحدث قصر في سلكه… هل يتصرف المفتاح بالطريقة نفسها؟',
   art:DRA.art({aria:'الشكل 7-5: الدائرة الخطية والتنفيذية لمفتاح وقاية محرك ثلاثي الأوجه',
    parts:[{svg:svgMotL(O75),box:[16,24,110,256],tips:[[54,166,40,22,'رمز القاطع الحراري ⊓ في الخطي.'],[44,180,50,16,'السهم: القاطع المغناطيسي السريع.']]},
           {svg:svgMotX(O75),box:[128,14,218,280],tips:[
     [56,100,60,32,'ذراع التشغيل ⊞ لمفتاح الوقاية ⟦Q1⟧: هو أيضاً مفتاح تشغيل (مفتاح أجهزة).'],
     [116,126,88,18,'القواطع الحرارية (⊓): تفصل بعد مرور بعض الوقت عند زيادة التيار على القيمة المضبوطة.'],
     [116,144,88,18,'القواطع المغناطيسية ⟦I>⟧: تفصل فوراً عند القصر.'],
     [120,210,80,90,'المحرك ⟦M 3~⟧ بأطرافه ⟦U⟧ و⟦V⟧ و⟦W⟧.'],
     [236,60,40,220,'موصل الوقاية ⟦PE⟧ إلى جسم المحرك.']]}],
    extra:DRA.L(72,300,'الخطية',12.5,700)+DRA.L(238,304,'التنفيذية',12.5,700)}),
   cap:'<b>مرّر المؤشر على الذراع والقواطع والمحرك وموصل الوقاية (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[{predict:{q:'على أي قيمة يُضبط القاطع في مفتاح وقاية المحرك؟',opts:[
     ['تيار القصر',false,'تيار القصر تتولاه القواطع المغناطيسية.'],
     ['نصف التيار الاسمي',false,'سيفصل المحرك وهو يعمل عادياً.'],
     ['التيار الاسمي للمحرك',true,'ص 149: «يتم ضبط القاطع على قيمة التيار الاسمي للمحرك».']]}}],
   body:[
    {book:'<p>يعتمد نوع الوقاية المستخدمة في حماية المحركات على حجم المحرك وطبيعة الحمل الميكانيكي المتصل بعمود الإدارة، وتستخدم المصهرات ومفاتيح الوقاية والمرحلات لوقاية المحرك.</p><p>ومفاتيح وقاية المحركات هي مفاتيح وقاية كما أنها مفاتيح أجهزة، ويتم ضبط القاطع على قيمة التيار الاسمي للمحرك وعندما تتجاوز شدة التيار القيمة المضبوطة، يفصل القاطع الدائرة بعد مرور بعض الوقت. وتتولى القواطع المغناطيسية السريعة الوقاية عند نشوء دائرة قصر. والشكل (7-5) يبين مفاتيح وقاية لمحرك ثلاثي الأوجه والدائرة الخطية والتنفيذية لها.</p>',ref:'ص 149'},
    {tip:'<p>المستطيل الذي فيه الخط المتعرج (⊓) هو <b>القاطع الحراري</b>: شريط من معدنين ينحني ببطء كلما سخن من تيار زائد، فيفصل «بعد مرور بعض الوقت». والمستطيل الذي فيه <span class="ltr">I&gt;</span> هو <b>القاطع المغناطيسي</b>: ملف يجذب فوراً عند تيار القصر الكبير. والخط المنقط منهما إلى الذراع ⊞ يعني أنهما يفتحان التلامسات الثلاثة معاً.</p>',title:'رمزا القاطعين'},
    {watch:'<p>كلمات تسميتي الدائرتين تحت الشكل (7-5) تفرقت في الطباعة؛ الأصل «الدائرة التنفيذية» تحت الرسم الأيسر و«الدائرة الخطية» تحت الأيمن.</p>',fix:true},
    {title:'مختبر مصغّر: أي قاطع يعمل؟',widget:(el,B)=>DCML.lab(el,B,{intro:'اختر حالة الحمل وانظر أي قاطع يفصل ومتى (منطق فقط بلا أرقام).',
     predict:{q:'حدث قصر في الموصل بين المفتاح والمحرك. ماذا يحدث؟',opts:[['يفصل القاطع الحراري بعد بعض الوقت',false,'الحراري بطيء؛ تيار القصر يحتاج فصلاً فورياً.'],['يفصل القاطع المغناطيسي فوراً',true,'«وتتولى القواطع المغناطيسية السريعة الوقاية عند نشوء دائرة قصر».']]},
     ins:[{k:'l',l:'حالة الحمل',seg:[['n','حمل عادي'],['o','تحميل زائد'],['s','قصر']],v:'n'}],
     calc:(s)=>({pic:`<div style="max-width:260px;margin:auto">${svgMotX(O75)}</div>`,
      facts:[['التيار',{n:'عند القيمة المضبوطة أو أقل',o:'أكبر من القيمة المضبوطة',s:'كبير جداً'}[s.l],s.l==='n'?'':'bad'],['القاطع الذي يعمل',{n:'لا شيء',o:'الحراري',s:'المغناطيسي'}[s.l],'hi'],['متى؟',{n:'—',o:'بعد مرور بعض الوقت',s:'فوراً'}[s.l]]],
      msg:{n:'المحرك يعمل والمفتاح مغلق.',o:'الحراري يسخن ببطء ثم يفصل الدائرة، فلا تحترق الملفات.',s:'المغناطيسي يفصل فوراً قبل أن يتضرر الموصل أو المحرك.'}[s.l],cls:s.l==='n'?'':'warn'})})}
   ]},

  {st:2,short:'بلا فصل مغناطيسي',title:'مفتاح وقاية بدون فصل مغناطيسي سريع ومعه (الشكلان 7-6 و7-7)',ref:'ص 150–152',
   q:'إذا لم يكن في مفتاح الوقاية قاطع مغناطيسي، فمن يحمي المحرك من القصر؟',
   art:DRA.art({aria:'رسما الشكلين 7-6 و7-7 كما في الكتاب',bg:'#F7DCC8',
    parts:[{svg:svgMotX(O76),box:[16,20,160,250],tips:[[40,18,50,40,'مصاهر أفقية على القضبان.'],[116,126,88,40,'في رسم (7-6) المطبوع: حراري ومغناطيسي ⟦I>⟧ بلا مصاهر فرعية.']]},
           {svg:svgMotX(O77),box:[184,20,160,250],tips:[[116,66,88,32,'ثلاثة مصاهر رأسية على التوالي.'],[116,150,88,20,'في رسم (7-7) المطبوع: صف حراري فقط بلا ⟦I>⟧.']]}],
    extra:DRA.L(96,288,'رسم (7-6) في الكتاب',12,700)+DRA.L(264,288,'رسم (7-7) في الكتاب',12,700)}),
   cap:'الرسمان كما طُبعا؛ قارنهما بالنص (انظر «انتبه»).<br><b>مرّر المؤشر على المصاهر والقواطع (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[{predict:{q:'مفتاح وقاية بلا فصل مغناطيسي سريع: ما الذي يحميه من القصر؟',opts:[
     ['مصهرات موصلة على التوالي',true,'النص: «المصهرات الموصلة على التوالٍ لوقاية المحرك والموصل ومفتاح وقاية المحرك من دائرة القصر».'],
     ['القاطع الحراري',false,'الحراري بطيء جداً على تيار القصر.'],
     ['موصل الأرضي PE',false,'PE للوقاية من لمس جسم المحرك، لا لقطع القصر.']]}}],
   body:[
    {book:'<p>وإذا تعرضت المحركات الثلاثية الأوجه إلى زيادة التحميل فإنها تسحب في هذه الحالة تياراً كبيراً جداً. ولمنع احتراق الملفات، يتم وقاية المحركات من التحميل الزائد. ويوضح الشكل (7-6) الدائرة التنفيذية لمفتاح وقاية محرك بدون فصل مغناطيسي سريع، المصهرات الموصلة على التوالٍ لوقاية المحرك والموصل ومفتاح وقاية المحرك من دائرة القصر. والشكل (7-7) يبين الدائرة التنفيذية لمفتاح وقاية محرك مع فصل مغناطيسي سريع.</p>',ref:'ص 150'},
    {watch:'<p>الرسمان (7-6) و(7-7) متبادلان بالنسبة للنص: النص يجعل (7-6) مفتاحاً <b>بدون</b> فصل مغناطيسي سريع تحميه <b>مصهرات على التوالي</b> من القصر، و(7-7) مفتاحاً <b>مع</b> فصل مغناطيسي سريع. استعمل الزر أدناه لترى كل رسم تحت العنوان الذي يطابقه.</p>',fix:true},
    {title:'جرّب الرسم: كما في الكتاب / المصحح',widget:(el,B)=>fig767Widget(el)},
    {title:'مختبر مصغّر: أي مفتاح؟',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل وصف، اختر نوع مفتاح الوقاية حسب النص.',cats:['بدون فصل مغناطيسي (7-6)','مع فصل مغناطيسي (7-7)'],items:[
     ['تحميه من القصر مصهرات موصلة على التوالي.',0,'لأنه لا يملك قاطعاً مغناطيسياً.'],
     ['فيه صف قواطع I> يفصل فوراً عند القصر.',1,'الفصل المغناطيسي السريع.'],
     ['فيه قاطع حراري للتحميل الزائد.',0,'كلا النوعين فيه قاطع حراري؛ لكن في هذا النوع هو القاطع الوحيد داخل المفتاح.']]})}
   ]},

  {st:3,short:'محرك مثلث',title:'محرك ثلاثي الأوجه في توصيل مثلثي مع مفتاح وقاية (الشكل 7-8)',ref:'ص 153',
   q:'ماذا يضيف الرمز Δ الصغير بجانب M 3~ إلى معلوماتك عن المحرك؟',
   art:DRA.art({aria:'الشكل 7-8: الدائرة الخطية والتنفيذية لمحرك مثلث مع مصاهر ومفتاح وقاية',bg:'#E4ECF6',
    parts:[{svg:svgMotL(O78),box:[16,24,110,256],tips:[[70,66,40,40,'المصهر في الخطي بشرطة 3.']]},
           {svg:svgMotX(O78),box:[128,10,218,284],tips:[[116,66,88,30,'ثلاثة مصاهر رأسية قبل المفتاح.'],[110,112,100,100,'مفتاح الوقاية ⟦Q1⟧: حراري ومغناطيسي، وهو مفتاح يدوي يُستعمل كمفتاح أجهزة.'],[120,240,80,90,'المحرك ⟦M 3~Δ⟧: ملفاته موصلة مثلثاً.']]}],
    extra:DRA.L(72,300,'الخطية',12.5,700)+DRA.L(238,308,'التنفيذية',12.5,700)}),
   cap:'<b>مرّر المؤشر على المصاهر ومفتاح الوقاية والمحرك (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[{predict:{q:'ماذا يعني الرمز Δ بجانب M 3~ في الشكل (7-8)؟',opts:[
     ['المحرك محمي بمصهر',false,'المصهر له رمزه الخاص.'],
     ['ملفات المحرك موصلة مثلثاً',true,'الشكل لمحرك ثلاثي الأوجه في توصيل مثلثي.'],
     ['المحرك أحادي الوجه',false,'3~ تعني ثلاثة أوجه.']]}}],
   body:[
    {book:'<p>والشكل (7-8) يوضح الدائرة الخطية والتنفيذية لمحرك تيار متردد ثلاثي الأوجه في توصيل مثلثي، مع مفتاح يدوي لوقاية المحرك كمفتاح أجهزة.</p>',ref:'ص 153'},
    {title:'مختبر مصغّر: صح أم خطأ؟',widget:(el,B)=>DCML.tf(el,B,{items:[
     ['مفتاح وقاية المحرك في الشكل (7-8) يُستعمل أيضاً لتشغيل المحرك وإيقافه.',true,'«مع مفتاح يدوي لوقاية المحرك كمفتاح أجهزة».'],
     ['في الشكل (7-8) المصاهر بعد مفتاح الوقاية.',false,'المصاهر قبله، بين القضبان والمفتاح.'],
     ['في الدائرة الخطية للشكل (7-8) يأتي المصهر قبل مفتاح الوقاية Q1.',true,'كما في التنفيذية: القضبان ثم المصاهر ثم Q1 ثم المحرك.']]})}
   ]},

  {recap:[
   'نوع وقاية المحرك يعتمد على حجمه وطبيعة حمله؛ وتستعمل المصهرات ومفاتيح الوقاية والمرحلات.',
   'القاطع الحراري يُضبط على التيار الاسمي ويفصل بعد بعض الوقت؛ والمغناطيسي يفصل فوراً عند القصر.',
   'بلا فصل مغناطيسي تحمي المصهرات على التوالي من القصر؛ ورسما (7-6) و(7-7) متبادلان بالنسبة للنص.',
   'الشكل (7-8): محرك مثلث M 3~Δ بمصاهر ومفتاح وقاية يدوي يعمل كمفتاح أجهزة.']}
],
 theory:[
  {h:'7-3 وقاية المحركات',ref:'ص 149',html:'<p>يعتمد نوع الوقاية المستخدمة في حماية المحركات على حجم المحرك وطبيعة الحمل الميكانيكي المتصل بعمود الإدارة، وتستخدم المصهرات ومفاتيح الوقاية والمرحلات لوقاية المحرك.</p><p>ومفاتيح وقاية المحركات هي مفاتيح وقاية كما أنها مفاتيح أجهزة، ويتم ضبط القاطع على قيمة التيار الاسمي للمحرك وعندما تتجاوز شدة التيار القيمة المضبوطة، يفصل القاطع الدائرة بعد مرور بعض الوقت. وتتولى القواطع المغناطيسية السريعة الوقاية عند نشوء دائرة قصر. والشكل (7-5) يبين مفاتيح وقاية لمحرك ثلاثي الأوجه والدائرة الخطية والتنفيذية لها.</p>'},
  {fig:'(7-5)',ref:'ص 150',caption:'الدائرة الخطية والتنفيذية لدائرة مفاتيح وقاية المحركات.',draw:()=>fig2(`<div>${box(svgMotL(O75),210)}${cap('الدائرة الخطية')}</div>`,`<div>${box(svgMotX(O75),320)}${cap('الدائرة التنفيذية')}</div>`)},
  {err:'كلمات تسميتي الدائرتين تحت الشكل (7-5) تفرقت في الطباعة («الدائرة» وحدها في سطر، ثم «الخطية» و«الدائرة التنفيذية»)؛ الأصل «الدائرة التنفيذية» تحت الرسم الأيسر و«الدائرة الخطية» تحت الأيمن، كما رسمناها.'},
  {note:`${TIP}<b>رمزا القاطعين:</b> المستطيل الذي فيه الخط المتعرج (⊓) هو <b>القاطع الحراري</b>: شريط من معدنين ينحني ببطء كلما سخن من تيار زائد، فيفصل «بعد مرور بعض الوقت». والمستطيل الذي فيه ${lt('I&gt;')} هو <b>القاطع المغناطيسي</b>: ملف يجذب فوراً عند تيار القصر الكبير. والخط المنقط منهما إلى الذراع ⊞ يعني أنهما يفتحان التلامسات الثلاثة معاً.`},
  {html:'<p>وإذا تعرضت المحركات الثلاثية الأوجه إلى زيادة التحميل فإنها تسحب في هذه الحالة تياراً كبيراً جداً. ولمنع احتراق الملفات، يتم وقاية المحركات من التحميل الزائد. ويوضح الشكل (7-6) الدائرة التنفيذية لمفتاح وقاية محرك بدون فصل مغناطيسي سريع، المصهرات الموصلة على التوالٍ لوقاية المحرك والموصل ومفتاح وقاية المحرك من دائرة القصر. والشكل (7-7) يبين الدائرة التنفيذية لمفتاح وقاية محرك مع فصل مغناطيسي سريع.</p>'},
  {widget:el=>fig767Widget(el)},
  {h:'محرك ثلاثي الأوجه في توصيل مثلثي مع مفتاح وقاية',ref:'ص 153',html:'<p>والشكل (7-8) يوضح الدائرة الخطية والتنفيذية لمحرك تيار متردد ثلاثي الأوجه في توصيل مثلثي، مع مفتاح يدوي لوقاية المحرك كمفتاح أجهزة.</p>'},
  {fig:'(7-8)',ref:'ص 153',caption:'الدائرة الخطية والتنفيذية لمحرك ثلاثي الأوجه في توصيل مثلثي، مع مفتاح وقاية.',draw:()=>fig2(`<div>${box(svgMotL(O78),210)}${cap('الدائرة الخطية')}</div>`,`<div>${box(svgMotX(O78),320)}${cap('الدائرة التنفيذية')}</div>`)}
 ],
 lab:(el)=>labMotor(el),
 examples:[
  drawEx({title:'مثال مرسوم: الشكل (7-5) — الدائرة التنفيذية ثم الخطية',ref:'ص 150',
   q:'<p>ارسم الدائرة التنفيذية لمفتاح وقاية محرك ثلاثي الأوجه (الشكل 7-5)، ثم الدائرة الخطية المقابلة. الجزء الجديد بالأزرق.</p>',
   steps:['القضبان L1 وL2 وL3 وN وPE (المتقطع بنقطة)، والعنوان <span class="ltr">380/220 V 3/N/PE ~ 60 Hz</span>، وثلاثة أسلاك تنزل من الأوجه.','تلامسات <b>Q1</b> الثلاثة (1-3-5) في إطار، وذراع التشغيل ⊞ بخط منقط.','القاطع <b>الحراري</b> (⊓) والقاطع <b>المغناطيسي</b> (I&gt;) في كل وجه، وخطوط منقطة منهما إلى الذراع، والأطراف 2-4-6.','أطراف المحرك U وV وW، ثم المحرك <span class="ltr">M 3~</span>.','موصل الوقاية PE من القضيب إلى جسم المحرك.','الدائرة الخطية: خط واحد بشرطة 4 من القضبان، ثم 3 إلى Q1، ورمز الحراري والسهم المغناطيسي، ثم المحرك.'],
   svg:i=>i<5?box(svgMotX(O75,i,true,[[0],[2],[3],[4],[5],[1]]),330):fig2(box(svgMotL(O75,0,true,[[0,1,2,3,4]]),210),box(svgMotX(O75),330))}),
  drawEx({title:'مثال مرسوم: الشكل (7-8) — محرك مثلث مع مفتاح وقاية',ref:'ص 153',
   q:'<p>ارسم الدائرة التنفيذية والخطية لمحرك ثلاثي الأوجه موصل مثلثاً مع مصاهر ومفتاح وقاية (الشكل 7-8).</p>',
   steps:['القضبان L1 وL2 وL3 وN وPE والعنوان.','ثلاثة <b>مصاهر</b> رأسية على الأوجه الثلاثة قبل المفتاح.','تلامسات Q1 في إطار متقطع مع ذراع ⊞.','القاطع الحراري والمغناطيسي والأطراف 2-4-6.','المحرك <span class="ltr">M 3~Δ</span> (الرمز Δ يعني أن ملفاته موصلة مثلثاً) وأطرافه U وV وW.','موصل PE إلى جسم المحرك.','الدائرة الخطية: شرطة 4، مصهر بشرطة 3، شرطة 4 ثم 3، Q1، الحراري والمغناطيسي، شرطة 4، والمحرك <span class="ltr">M 3~Δ</span>.'],
   svg:i=>i<6?box(svgMotX(O78,i,true),330):fig2(box(svgMotL(O78,0,true,[[0,1,2,3,4]]),210),box(svgMotX(O78),330))})],
 quiz:[
  {q:'على أي قيمة يُضبط القاطع (الحراري) في مفتاح وقاية المحرك؟',o:['التيار الاسمي للمحرك','تيار القصر','نصف التيار الاسمي','جهد المحرك'],c:0,e:'«يتم ضبط القاطع على قيمة التيار الاسمي للمحرك».'},
  {q:'ماذا يفعل القاطع الحراري إذا زاد التيار على القيمة المضبوطة؟',o:['يفصل بعد مرور بعض الوقت','يفصل فوراً','لا يفصل أبداً','يرفع السرعة'],c:0,e:'«يفصل القاطع الدائرة بعد مرور بعض الوقت».'},
  {q:'من يتولى الوقاية عند نشوء دائرة قصر؟',o:['القواطع المغناطيسية السريعة','القاطع الحراري وحده','مفتاح الفصل','المحرك نفسه'],c:0,e:'«وتتولى القواطع المغناطيسية السريعة الوقاية عند نشوء دائرة قصر».'},
  {q:'مفتاح وقاية بلا فصل مغناطيسي سريع: ما الذي يحميه من القصر؟',o:['مصهرات موصلة على التوالي','القاطع الحراري','الأرضي PE','لا شيء'],c:0,e:'النص: «المصهرات الموصلة على التوالي لوقاية المحرك والموصل ومفتاح وقاية المحرك من دائرة القصر».'},
  {q:'لماذا نحمي المحرك من التحميل الزائد؟',o:['لأنه يسحب تياراً كبيراً فتحترق ملفاته','لأنه يرفع الجهد','لأن سرعته تزيد','لأن التردد يتغير'],c:0,e:'«ولمنع احتراق الملفات، يتم وقاية المحركات من التحميل الزائد».'},
  {q:'ماذا يعني الرمز Δ بجانب M 3~ في الشكل (7-8)؟',o:['ملفات المحرك موصلة مثلثاً','المحرك أحادي الوجه','المحرك محمي بمصهر','المحرك تيار مستمر'],c:0,e:'الشكل (7-8) لمحرك ثلاثي الأوجه في توصيل مثلثي.'}]
});

/* =====================================================================================
   7-4 Transformer protection: differential (7-9) and balance / earth-leakage (7-10)
   ===================================================================================== */
/* three windings delta-connected; returns svg; junction points (output) at (xs[i], yTop+h+6) */
function deltaRow(xs,yT,w,h,c){const d=xs[1]-xs[0],yb=yT+h;let s=xs.map(x=>wd(x,yT,w,h,c)).join('');
 xs.forEach((x,i)=>{const j=(i+1)%3;s+=ln(x,yb,x,yb+6,c);
  if(j>i)s+=pl([[x,yb+6],[x+d/2,yb+6],[x+d/2,yT-6],[xs[j],yT-6],[xs[j],yT]],cs(c));
  else s+=pl([[x,yb+6],[x+d/2,yb+6],[x+d/2,yT-11],[xs[0],yT-11],[xs[0],yT]],cs(c))});return s}
function f79(o){o=o||{};const X=[50,76,102],M=[160,176,192],W=300;
 const st=[
  c=>X.map((x,i)=>T(x,12,'1L'+(i+1),c,{fs:9})+ln(x,18,x,112,c)+ln(x,194,x,312,c)+T(x,326,'2L'+(i+1),c,{fs:9})).join(''),
  c=>{let s=ln(X[0]+8,38,X[2]+8,38,cs(c))+nd(X[1]+8,38,c);X.forEach((x,i)=>{s+=wd(x,42,8,26,c)+rc(x+6,44,4,22,cs(c))+ln(x+8,38,x+8,44,cs(c))+pl([[x+8,66],[x+8,74+i*6],[M[i],74+i*6],[M[i],98]],cs(c)+' th')});return s},
  c=>{let s=rc(30,100,96,98,'dd th '+cs(c));X.forEach((x,i)=>{s+=T(x+7,111,['1U','1V','1W'][i],c,{a:'start',fs:7.5})+wd(x,112,10,24,c)+ln(x,136,x,142,c)});
   return s+ln(X[0],142,X[2],142,c)+deltaRow(X,158,10,22,c)+X.map((x,i)=>T(x+7,195,['2U','2V','2W'][i],c,{a:'start',fs:7.5})).join('')},
  c=>{let s=ln(X[0]+8,264,X[2]+8,264,cs(c))+nd(X[1]+8,264,c);X.forEach((x,i)=>{s+=wd(x,232,8,26,c)+rc(x+6,234,4,22,cs(c))+ln(x+8,256,x+8,264,cs(c))+pl([[x+8,234],[x+8,224-i*6],[M[i],224-i*6],[M[i],196]],cs(c)+' th')});return s},
  c=>M.map(x=>wd(x,98,7,10,c)).join('')+ln(M[0],108,M[2],108,cs(c))+deltaRow(M,118,7,12,c)+A(240,126,'محول مواءمة',c,{fs:9})+M.map(x=>ln(x,136,x,152,cs(c))).join(''),
  c=>rc(146,152,62,32,'bg '+cs(c))+T(177,173,'ΔI',c,{fs:13})+M.map(x=>ln(x,184,x,196,cs(c))).join('')+arrowD(M[2],150,c)+T(M[2]+8,148,'I1',c,{a:'start',fs:10})+arrowU(M[2],186,c)+T(M[2]+8,198,'I2',c,{a:'start',fs:10}),
  c=>ln(208,162,224,162,cs(c))+ln(208,174,224,174,cs(c))+rc(224,158,14,20,cs(c))+ln(238,168,264.5,168,'dt '+cs(c))+sw(270,148,36,true,c)];
 return {st,W,H:334}}
const svg79=(k,hl)=>{const f=f79();return SV(`0 0 ${f.W} ${f.H}`,seq(f.st,f.st.map((_,i)=>[i]),k==null?99:k,hl),'الوقاية الفرقية لمحول')};
/* figure (7-10): balance (core-balance ring) protection, upper half mirrored below */
function svg710(){const X=[120,145,170];let s='';
 const half=(m)=>{const Y=y=>m?530-y:y;let h='';
  const bus=[['L1',20],['L2',32],['L3',44]];
  bus.forEach(([l,y])=>{h+=ln(60,Y(y),330,Y(y),'')+T(56,Y(y)+4,l,'',{a:'end',fs:10})});
  X.forEach((x,i)=>{const yb=[20,32,44][i];h+=nd(x,Y(yb),'')+ln(x,Y(yb),x,Y(60),'')+ln(x,Y(60),x,Y(66),'')+ln(x,Y(80),x,Y(88),'')+ln(x,Y(80),x-9,Y(67),'')});
  h+=ln(111,Y(73)-2,296,Y(73)-2,'')+ln(111,Y(73)+2,296,Y(73)+2,'')+wd(300,Y(73)-8,10,16,'');
  h+=ci(145,Y(130),34,'')+ci(145,Y(130),27,'');
  X.forEach(x=>{h+=ln(x,Y(88),x,Y(178),'')});
  h+=earthL(80,Y(118),'')+pl([[80,Y(118)],[133,Y(118)],[133,Y(186)],[145,Y(196)]],'');
  h+=pa(`M179 ${Y(122)}c6 0 6 6 0 6c6 0 6 6 0 6c6 0 6 6 0 6`,'')+pl([[179,Y(122)],[200,Y(122)],[200,Y(116)],[226,Y(116)]],'')+pl([[179,Y(140)],[200,Y(140)],[200,Y(146)],[226,Y(146)]],'')+ln(200,Y(146),200,Y(150),'')+earth(200,Y(150)-(m?12:0),'');
  h+=wd(232,Y(m?150:112),10,38,'')+ln(226,Y(116),227,Y(116),'')+ln(226,Y(146),227,Y(146),'');
  h+=ln(232,Y(152),232,Y(164),'')+ln(212,Y(166),252,Y(166),'tk')+tm(212,Y(172),'')+tm(252,Y(172),'');
  /* primary / secondary star */
  const C=Y(225),dy=m?-1:1;h+=wd(145,m?C:C-30,10,30,'');
  const leg=(sx)=>{const ex=145+sx*26,ey=C+dy*15;return `<rect x="${(145+ex)/2-5}" y="${(C+ey)/2-15}" width="10" height="30" class="F" transform="rotate(${sx*dy*-60} ${(145+ex)/2} ${(C+ey)/2})"/>`+''};
  h+=leg(-1)+leg(1)+nd(145,C,'');
  h+=ln(120,Y(178),119,C+dy*15,'')+ln(170,Y(178),171,C+dy*15,'')+ln(145,Y(178),145,C-dy*30,'')+ln(133,Y(186),145,C,'');
  return h};
 s+=half(false)+half(true);
 s+=ln(296,60,296,470,'')+ln(304,60,304,470,'');
 s+=ln(212,Y0(172),212,358,'')+ln(252,172,252,358,'');
 function Y0(y){return y}
 s+=pl([[252,248],[268,248]],'')+tm(270,248,'')+ln(276,240,276,256,'')+ln(282,244,282,252,'tk')+tm(288,248,'')+ln(291,248,296,248,'');
 s+=pl([[212,282],[296,282]],'')+tm(296,282,'');
 return SV('0 0 340 530',s,'دائرة وقاية محول ثلاثي الأوجه من خطأ الاتصال بالأرض')}

/* ---------- lab u7-l4 ---------- */
function labTrafo(el){
 const S={mode:'diff',q:true,fault:'none',delay:0,trip:false,ef:false,qb:true,hist:{inT:0,outN:0,efT:0}};
 el.innerHTML=`<div class="d7lab"><div class="grid">
  <section class="panel c7"><h2>وقاية المحول</h2><div class="d7row">${segHTML('tm',[['diff','الوقاية الفرقية (7-9)'],['bal','الوقاية بالاتزان (7-10)']],S.mode)}</div>
   <div id="tsv"></div><div class="legend"><span><i style="background:var(--live)"></i>تيار</span><span><i style="background:var(--live);height:5px"></i>تيار كبير (قصر)</span><span><i style="background:var(--wire)"></i>بلا جهد</span><span><i style="background:var(--stop)"></i>فصل</span></div></section>
  <section class="panel c5"><h2>لوحة التشغيل</h2><div id="tctl"></div>
   <div class="d7chips" id="tchips"></div><div class="d7msg" id="tmsg"></div>
   <h3 class="sm">خطوات التجربة</h3><ol class="steps" id="tsteps"></ol>
   <p class="sub">الرسم هنا مبسّط لوجه واحد (الوقاية الفرقية) ولقلب حلقي واحد (الاتزان)، والكميات بلا أرقام.</p></section></div></div>`;
 const $=s=>el.querySelector(s),msg=(t,k)=>{const m=$('#tmsg');m.innerHTML=t;m.className='d7msg'+(k?' '+k:'')};
 /* ما يراه المرحل الفرقي: الفرق بين التيارين (في «اكتشف العطل»: محول تيار CT2 موصل بالعكس ⇐ يرى مجموعهما) */
 const dS=(i1,i2)=>chF('ctrev')?(i1>0||i2>0):i1!==i2;
 const cur=()=>{if(!S.q)return {i1:0,i2:0};if(S.fault==='in')return {i1:2,i2:0};if(S.fault==='out')return {i1:2,i2:2};return {i1:1,i2:1}};
 const word=v=>v===2?'كبير':v===1?'عادي':'صفر';
 const drawDiff=()=>{const {i1,i2}=cur(),x=110,on=S.q;const K=v=>v===2?'fl':v===1?'on':'off';
  const cA=on?K(i1):'off',cB=on?K(i2):'off',d=dS(i1,i2);
  let s=T(x,14,'1L','',{fs:11})+ln(x,20,x,40,i1===2?'fl':'on')+ln(x,40,x,48,i1===2?'fl':'on')+ln(x,62,x,70,cA)+(S.q?ln(x,62,x,48,cA):ln(x,62,x-11,49,'tr'))+T(x-18,58,'Q','',{a:'end',fs:11,cl:S.trip?'red':''});
  s+=ln(x,70,x,150,cA)+ctSL(x,100,cA)+T(x-12,104,'CT1','',{a:'end',fs:10});
  s+=rc(60,116,110,112,'ds th mu')+A(128,130,'منطقة الحماية','',{fs:8.5});
  s+=trSL(x,152,'Y','D',cA)+ln(x,139,x,140,cA);
  s+=ln(x,182,x,330,cB)+ctSL(x,214,cB)+T(x-12,218,'CT2','',{a:'end',fs:10});
  s+=ci(x,344,12,(on&&S.fault!=='out'&&i2)?'lampon':'bg')+ln(x-8,336,x+8,352,'th')+ln(x+8,336,x-8,352,'th')+T(x+18,348,'2L','',{a:'start',fs:11});
  s+=pl([[x+6.5,100],[226,100],[226,138]],i1?'on':'off')+arrowD(226,136,i1?'on':'off')+T(234,124,'I1','',{a:'start',fs:11})+A(234,112,word(i1),'',{a:'end',fs:9,cl:'m'});
  s+=pl([[x+6.5,214],[226,214],[226,180]],i2?'on':'off')+arrowU(226,182,i2?'on':'off')+T(234,200,'I2','',{a:'start',fs:11})+A(234,212,word(i2),'',{a:'end',fs:9,cl:'m'});
  s+=rc(200,138,52,42,'bg '+(S.trip||(d&&on)?'tr':''))+T(226,164,'ΔI','',{fs:14,cl:(d&&on)||S.trip?'red':''});
  s+=pl([[252,150],[270,150],[270,55],[150,55]],S.trip?'tr':'th')+rc(136,48,14,14,S.trip?'tr':'')+ln(136,55,x+4,55,'dt th mu');
  if(S.fault==='in')s+=pl([[66,150],[80,160],[72,163],[88,176]],'tr')+arrowR(90,178,'tr');
  if(S.fault==='out')s+=pl([[66,262],[80,272],[72,275],[88,288]],'tr')+arrowR(x-2,292,'tr');
  return SV('0 0 300 365',s,'الوقاية الفرقية: مبسطة لوجه واحد')};
 const drawBal=()=>{const on=S.qb,imb=on&&S.ef;const X=[95,120,145],cl=on?'on':'off';
  let s=['L1','L2','L3'].map((l,i)=>ln(40,18+i*10,240,18+i*10,'on')+T(36,22+i*10,l,'',{a:'end',fs:10})).join('');
  X.forEach((x,i)=>{s+=nd(x,18+i*10,'on')+ln(x,18+i*10,x,60,'on')+ln(x,74,x,82,cl)+(on?ln(x,74,x,60,cl):ln(x,74,x-11,61,'tr'))+ln(x,82,x,250,(imb&&i===0)?'fl':cl)});
  s+=ln(84,67,200,67,'th')+ln(84,71,200,71,'th')+rc(200,60,16,18,S.trip?'tr':'')+A(208,92,'ملف الفصل','',{fs:9});
  s+=ci(120,150,40,imb?'tr':'')+ci(120,150,33,imb?'tr':'');
  s+=pa('M160 140c6 0 6 6 0 6c6 0 6 6 0 6c6 0 6 6 0 6',imb?'tr':'')+pl([[160,140],[190,140],[190,132],[214,132]],imb?'tr':'th')+pl([[160,158],[190,158],[190,168],[214,168]],imb?'tr':'th');
  s+=wd(220,128,10,44,imb?'tr':'')+A(222,190,'المتمم','',{fs:9});
  const closed=S.trip||imb&&S.delay>0.25;
  s+=ln(220,172,220,206,'th')+(closed?ln(200,210,240,210,'tk tr'):ln(200,214,240,214,'tk'))+tm(200,206,'')+tm(240,206,'');
  s+=pl([[200,206],[180,206],[180,240],[262,240],[262,78]],closed?'tr':'th')+pl([[240,206],[254,206],[254,226]],closed?'tr':'th')+ln(248,226,260,226,'')+ln(251,232,257,232,'tk')+ln(254,232,254,240,closed?'tr':'th')+A(282,236,'بطارية','',{fs:9});
  s+=`<g>${[95,145].map(x=>ln(x-26*0,250,x,262,cl)).join('')}</g>`+ci(120,282,24,cl==='on'?'':'off')+T(120,287,'T','',{fs:12});
  s+=A(150,334,imb?'اختل الاتزان: فيض في الحلقة':'متزن: لا فيض في الحلقة','',{fs:10,cl:imb?'red':''});
  if(S.ef)s+=pl([[60,240],[95,240]],on?'fl':'off')+earthL(60,240,'tr')+A(46,226,'تأريض','',{fs:9,cl:'red'});
  return SV('0 0 310 344',s,'الوقاية بالاتزان: مبسطة')};
 const ctl=()=>{$('#tctl').innerHTML=S.mode==='diff'
   ?`<div class="d7row"><span class="sub">مكان العطل:</span>${segHTML('tf',[['none','بلا عطل'],['in','قصر داخل المحول'],['out','قصر خارج المحول']],S.fault)}</div><div class="d7row"><button class="btn" id="trst">أعد إغلاق Q</button></div>`
   :`<div class="d7row"><button class="btn warn" id="tef">تأريض أحد الأوجه (L1) داخل المحول</button><button class="btn" id="tclr">أزل العطل وأعد إغلاق المفتاح</button></div>`;
  el.querySelectorAll('[data-tf]').forEach(b=>b.addEventListener('click',()=>{S.fault=b.dataset.tf;S.delay=0;
   msg(S.fault==='in'?'قصر داخل المحول: التيار يدخل من CT1 ويذهب إلى العطل، فلا يصل مثله إلى CT2…':S.fault==='out'?'قصر خارج المحول: تيار القصر الكبير يمر في CT1 ثم في المحول ثم في CT2.':'بلا عطل: التيار الداخل يساوي الخارج (بعد المواءمة).');draw()}));
  const r=$('#trst');r&&r.addEventListener('click',()=>{if(S.fault==='in'){msg('العطل الداخلي ما زال موجوداً: لا تُعِد التغذية قبل إصلاح المحول. اختر «بلا عطل» أولاً.','bad');return}S.q=true;S.trip=false;msg('أُغلق Q.');draw()});
  const e=$('#tef');e&&e.addEventListener('click',()=>{S.ef=true;S.delay=0;msg('اتصل L1 بالأرض: تيار العطل يعود من الأرض، لا من الموصلات المارة في الحلقة…');draw()});
  const c=$('#tclr');c&&c.addEventListener('click',()=>{S.ef=false;S.qb=true;S.trip=false;S.delay=0;msg('أُزيل العطل وأُغلق المفتاح.');draw()})};
 const draw=()=>{$('#tsv').innerHTML=box(S.mode==='diff'?drawDiff():drawBal(),400);
  if(S.mode==='diff'){const {i1,i2}=cur();$('#tchips').innerHTML=chip('I1 (جهة التغذية)',word(i1),i1?'on':'')+chip('I2 (جهة الخروج)',word(i2),i2?'on':'')+chip('الفرق بين التيارين',lt(!dS(i1,i2)?'ΔI = 0':'ΔI ≠ 0'),!dS(i1,i2)?'ok':'bad')+chip('المفتاح Q',S.q?'مغلق':'فصل',S.q?'':'bad')}
  else $('#tchips').innerHTML=chip('الاتزان المغناطيسي',S.qb&&S.ef?'مختل':'متزن',S.qb&&S.ef?'bad':'ok')+chip('دائرة البطارية',S.trip?'مغلقة':'مفتوحة',S.trip?'bad':'')+chip('المفتاح الرئيس',S.qb?'مغلق':'فصل',S.qb?'':'bad');
  segSet(el,'tm',S.mode);segSet(el,'tf',S.fault);steps.check()};
 loopOn(el,dt=>{const c0=cur();if(S.mode==='diff'&&S.q&&S.fault!=='in'&&dS(c0.i1,c0.i2)){S.delay+=dt;if(S.delay>0.5){S.q=false;S.trip=true;msg('فصل المرحل الفرقي المفتاح Q.','bad');draw()}}
  if(S.mode==='diff'&&S.q&&S.fault==='in'&&!chF('tcopen')){S.delay+=dt;if(S.delay>0.5){S.q=false;S.trip=true;S.hist.inT++;msg('<b>'+lt('ΔI ≠ 0')+'</b>: المرحل الفرقي يغذي ملف الفصل فيفتح المفتاح Q ويُفصل المحول. العطل داخل منطقة الحماية.','bad');draw()}}
  if(S.mode==='diff'&&S.q&&S.fault==='out'){S.delay+=dt;if(S.delay>0.8&&S.delay-dt<=0.8){S.hist.outN++;msg('<b>'+lt('ΔI = 0')+'</b>: التيار الكبير نفسه يمر في CT1 وCT2، فلا يعمل المرحل الفرقي. العطل خارج منطقة الحماية، ويفصله جهاز وقاية آخر بعد المحول (توضيح، ليس من الكتاب).','ok');draw()}}
  if(S.mode==='bal'&&S.qb&&S.ef){const d0=S.delay;S.delay+=dt;if(d0<=0.25&&S.delay>0.25)draw();if(S.delay>0.6&&!chF('batflat')){S.qb=false;S.trip=true;S.hist.efT++;msg('اختل الاتزان → تيار في الملف الثانوي على الحلقة → المتمم يُغلق دائرة البطارية → ملفا الفصل يفتحان المفتاحين ويُفصل المحول.','bad');draw()}}});
 el.querySelectorAll('[data-tm]').forEach(b=>b.addEventListener('click',()=>{S.mode=b.dataset.tm;S.delay=0;ctl();msg(S.mode==='diff'?'اختر مكان العطل.':'المفتاح مغلق والأوجه الثلاثة تمر في الحلقة الحديدية.');draw()}));
 const steps=stepsUI($('#tsteps'),[
  {t:'قصر داخل المحول',x:'في «الوقاية الفرقية» اختر «قصر داخل المحول».',done:()=>S.hist.inT>0},
  {t:'قصر خارج المحول',x:'اختر «بلا عطل» ثم «أعد إغلاق Q»، ثم «قصر خارج المحول».',done:()=>S.hist.outN>0},
  {t:'الوقاية بالاتزان',x:'اختر «الوقاية بالاتزان» ثم «تأريض أحد الأوجه».',done:()=>S.hist.efT>0}]);
 ctl();msg('اختر مكان العطل.');draw()}

B.lesson({
 id:'u7-l4',unit:7,order:4,pages:'154–156',
 title:'وقاية المحولات',
 summary:'الوقاية الفرقية: المرحل يعمل عندما لا يساوي تيار الدخل تيار الخروج؛ والوقاية بالاتزان: حلقة حديدية تمر فيها الأطراف، يختل اتزانها عند اتصال وجه بالأرض فيُغلق المتمم دائرة البطارية ويفصل المحول.',
 stations:[
  {intro:true},

  {st:1,short:'الوقاية الفرقية',title:'7-4 وقاية المحولات — 7-4-1 متمم الوقاية الفرقية (الشكل 7-9)',ref:'ص 154',
   q:'كيف يعرف المرحل أن العطل داخل المحول نفسه لا في الشبكة بعده؟',
   art:DRA.art({aria:'الشكل 7-9: الوقاية الفرقية لمحول بمحولات تيار على الجهتين ومحول مواءمة ومرحل فرقي',
    parts:[{svg:svg79(),box:[30,8,300,300],tips:[
     [36,0,84,20,'جهة التغذية ⟦1L1⟧ ⟦1L2⟧ ⟦1L3⟧.'],
     [40,34,80,38,'محولات التيار العلوية: ملف عريض على الخط وثانوي رفيع بجانبه، والثانويات نجمة.'],
     [28,98,100,102,'محول القدرة (في الإطار): الابتدائي نجمة والثانوي مثلث.'],
     [40,226,80,42,'محولات التيار السفلية على جهة الخروج.'],
     [150,94,110,44,'محول المواءمة: يعوّض أن المحول نجمة/مثلث حتى يتساوى التياران في التشغيل العادي.'],
     [144,146,72,52,'المرحل الفرقي ⟦ΔI⟧: يدخله ⟦I1⟧ من أعلى و⟦I2⟧ من أسفل.'],
     [206,140,90,54,'ملف الفصل وتلامس مفتاح القدرة: يفتح عندما ⟦ΔI ≠ 0⟧.']]}]}),
   cap:'<b>مرّر المؤشر على محولات التيار ومحول القدرة ومحول المواءمة والمرحل وملف الفصل (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[{predict:{q:'متى يعمل المرحل الفرقي؟',opts:[
     ['عندما I1 = I2',false,'هذا هو التشغيل العادي: الفرق صفر.'],
     ['عندما ΔI = I1 − I2 ≠ 0',true,'ص 154: «يعمل المرحل عندما ΔI = I1 − I2 ≠ 0».'],
     ['عندما ينخفض الجهد',false,'المرحل الفرقي يقارن تيارين لا جهداً.']]}}],
   body:[
    {book:String.raw`<p>حماية المحولات الكهربائية تعتمد اعتماداً كلياً على وظيفة وموقع المحول في الشبكة، بالإضافة إلى مقنن المحول. وأهم نوع من أنواع وقاية المحولات هي الوقاية الفرقية، وهناك علاقة ثابتة بين شدة التيار في الملفات الابتدائية (موصل الدخل "التغذية") وشدة التيار في الملفات الثانوية (موصل الخروج)، والمرحل الفرقي يعمل عندما يكون الفرق بين \(I_1\) و \(I_2\) لا يساوي صفراً كما في الشكل (7-9).</p><p>أي يعمل المرحل عندما:</p><div class="eq">$$\Delta I = I_1 - I_2 \neq 0$$</div>`,ref:'ص 154'},
    {tip:'<p>محولات التيار ومحول المواءمة تجعل التيارين الصغيرين الذاهبين إلى المرحل متساويين ما دام كل ما يدخل المحول يخرج منه. فإذا حدث عطل <b>داخل</b> المنطقة التي بين محولات التيار ذهب جزء من التيار إلى العطل فاختلف <span class="ltr">I1</span> عن <span class="ltr">I2</span>. أما العطل <b>خارج</b> هذه المنطقة فيمر تياره في الجهتين معاً، فيبقى الفرق صفراً ولا يعمل المرحل.</p>',title:'لماذا يتساوى التياران عادة؟'},
    {title:'مختبر مصغّر: أين العطل؟',widget:(el,B)=>DCML.lab(el,B,{intro:'اختر مكان العطل، واقرأ التيارين الذاهبين إلى المرحل (منطق فقط بلا أرقام).',
     predict:{q:'قصر في الشبكة بعد محولات التيار السفلية (خارج المحول). هل يعمل المرحل الفرقي؟',opts:[['نعم فوراً',false,'التيار الكبير يمر في الجهتين معاً.'],['لا، لأن التيار نفسه يمر في الجهتين فيبقى الفرق صفراً',true,'العطل خارج منطقة الحماية؛ يفصله جهاز وقاية آخر.']]},
     ins:[{k:'f',l:'مكان العطل',seg:[['none','بلا عطل'],['in','قصر داخل المحول'],['out','قصر خارج المحول']],v:'none'}],
     calc:(s)=>{const I1={none:'عادي',in:'كبير',out:'كبير'}[s.f],I2={none:'عادي',in:'صغير / صفر',out:'كبير'}[s.f],d=s.f==='in';
      return {pic:`<div style="max-width:260px;margin:auto">${svg79()}</div>`,facts:[['I1 (جهة التغذية)',I1],['I2 (جهة الخروج)',I2],['الفرق',d?'ΔI ≠ 0':'ΔI = 0',d?'bad':'hi'],['مفتاح القدرة',d?'يفصل':'مغلق',d?'bad':'']],
       msg:d?'العطل داخل منطقة الحماية: المرحل يغذي ملف الفصل فيُفصل المحول.':s.f==='out'?'العطل خارج منطقة الحماية: المرحل الفرقي لا يعمل.':'التشغيل العادي: ما يدخل يخرج.',cls:d?'bad':''}}})}
   ]},

  {st:2,short:'الوقاية بالاتزان',title:'7-4-2 متمم الوقاية بالاتزان (الشكل 7-10)',ref:'ص 155–156',
   q:'كيف تكشف حلقة حديد واحدة أن أحد الأوجه لامس الأرض؟',
   art:DRA.art({aria:'النصف العلوي من الشكل 7-10: القضبان والمفتاح والحلقة الحديدية والملف الثانوي والمتمم',bg:'#F7DCC8',
    parts:[{svg:svg710(),vb:'40 0 290 270',box:[26,14,308,286],tips:[
     [56,12,276,40,'قضبان ⟦L1⟧ ⟦L2⟧ ⟦L3⟧.'],
     [100,56,90,36,'المفتاح الرئيس ثلاثي الأقطاب.'],
     [288,60,26,30,'ملف فصل المفتاح الرئيس.'],
     [104,92,82,78,'الحلقة الحديدية: تمر فيها أطراف المحول، فتكون الدائرة المغناطيسية متزنة في التشغيل العادي.'],
     [174,114,34,38,'الملف الثانوي على الحلقة.'],
     [222,106,22,52,'ملف المتمم.'],
     [204,158,58,22,'تلامس المتمم: يقفل دائرة البطارية على ملفات الفصل.'],
     [110,182,70,84,'ملفات المحول (نجمة)، ونقطة النجمة متصلة بسلك التأريض المار في الحلقة.']]}]}),
   cap:'النصف العلوي من الشكل <span class="ltr">(7-10)</span>؛ النصف السفلي مثله لجهة الثانوي.<br><b>مرّر المؤشر على الحلقة والملف الثانوي والمتمم والتلامس (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[{predict:{q:'ماذا يفعل متمم الاتزان عندما يتصل أحد الأوجه بالأرض؟',opts:[
     ['يفتح دائرة البطارية',false,'بل يقفلها.'],
     ['يقفل دائرة البطارية على ملفات فصل المفتاح الرئيس',true,'ص 155: «فيقفل دائرة البطارية على الملفات المغناطيسية المتحكمة في ملفات المفتاح الرئيس».'],
     ['يرفع جهد المحول',false,'المتمم جهاز حماية؛ لا يغيّر الجهد.']]}}],
   body:[
    {book:'<p>يستعمل هذا المتمم لحماية المحولات من الأخطار التي تقع على الشبكة أو داخل المحول نفسه وأهمها اتصال أطراف المحول بالأرض. والشكل (7-10) يبين هذه الطريقة، ويظهر من الرسم أن أطراف المحول الابتدائية والثانوية تمر في قلب مستدير (حلقة) من الحديد بحيث تكون الدائرة المغناطيسية متزنة عندما يكون المحول يعمل في الظروف العادية. ولكن إذا اتصل أحد الأوجه بالأرض أو حدث قصر بين وجهين فإن الاتزان المغناطيسي [يختل] ويتولد تياراً في دائرة الملف الثانوي الموضوع على القلب الحديدي يؤثر في ملف المتمم المتصل به فيقفل دائرة البطارية على الملفات المغناطيسية المتحكمة في ملفات المفتاح الرئيس التي تعمل على فصل المحول من الدائرة.</p>',ref:'ص 155'},
    {watch:'<p>في الكتاب «والشكل (٦ – ١٠)» والصحيح (7-10) (صُحّح في النص). والجملة «فإن الاتزان المغناطيسي ويولد» ناقصة؛ أكملناها بكلمة [يختل] بين قوسين.</p>',fix:true},
    {tip:'<p>التيارات المارة في الحلقة يُلغي بعضها بعضاً ما دام كل تيار يذهب في موصل يعود في موصل آخر داخل الحلقة؛ فلا يتكوّن فيض ولا يتولد تيار في الملف الثانوي. أما تيار التسرب إلى الأرض فيعود من خارج الحلقة، فيبقى فيض في الحديد ويتولد تيار يشغّل المتمم.</p>',title:'فكرة الحلقة'},
    {add:'<p>القاطع التفاضلي (قاطع التسرب الأرضي) في لوحات البيوت يعمل بالفكرة نفسها: حلقة يمر فيها موصل الوجه وموصل التعادل، وأي تسرب إلى الأرض يخل الاتزان فيفصل.</p>',title:'من الواقع'},
    {title:'مختبر مصغّر: رتّب سلسلة الفصل',widget:(el,B)=>DCML.order(el,B,{intro:'اتصل أحد الأوجه بالأرض. رتّب ما يحدث حتى يُفصل المحول.',steps:[
     ['يختل الاتزان المغناطيسي في الحلقة','أول نتيجة لتيار التسرب.'],['يتولد تيار في الملف الثانوي على الحلقة','بسبب الفيض الذي لم يعد صفراً.'],['يؤثر التيار في ملف المتمم','الملف الثانوي متصل بملف المتمم.'],['يقفل المتمم دائرة البطارية','تلامس المتمم يغلق.'],['تعمل ملفات الفصل فيُفصل المحول من الدائرة','النتيجة الأخيرة.']]})}
   ]},

  {recap:[
   'أهم وقاية للمحولات هي الوقاية الفرقية: يعمل المرحل عندما ΔI = I1 − I2 ≠ 0 ؛ أي عند عطل داخل منطقة الحماية.',
   'محول المواءمة يجعل التيارين متساويين في التشغيل العادي للمحول نجمة/مثلث.',
   'الوقاية بالاتزان: أطراف المحول تمر في حلقة حديدية متزنة عادة.',
   'التسرب إلى الأرض يخل الاتزان → تيار في الملف الثانوي → المتمم يقفل دائرة البطارية → فصل المحول.']}
],
 theory:[
  {h:'7-4 وقاية المحولات — 7-4-1 متمم الوقاية الفرقية',ref:'ص 154',html:String.raw`<p>حماية المحولات الكهربائية تعتمد اعتماداً كلياً على وظيفة وموقع المحول في الشبكة، بالإضافة إلى مقنن المحول. وأهم نوع من أنواع وقاية المحولات هي الوقاية الفرقية، وهناك علاقة ثابتة بين شدة التيار في الملفات الابتدائية (موصل الدخل "التغذية") وشدة التيار في الملفات الثانوية (موصل الخروج)، والمرحل الفرقي يعمل عندما يكون الفرق بين \(I_1\) و \(I_2\) لا يساوي صفراً كما في الشكل (7-9).</p><p>أي يعمل المرحل عندما:</p>$$\Delta I = I_1 - I_2 \neq 0$$`},
  {fig:'(7-9)',ref:'ص 154',caption:'الوقاية الفرقية لمحول: محولات تيار على جهتي المحول، ومحول مواءمة، والمرحل الفرقي ΔI يغذي ملف فصل مفتاح القدرة.',draw:()=>box(svg79(),400)},
  {note:`${TIP}<b>لماذا ${lt('I<sub>1</sub>')} و${lt('I<sub>2</sub>')} متساويان في التشغيل العادي؟</b> محولات التيار ومحول المواءمة تجعل التيارين الصغيرين الذاهبين إلى المرحل متساويين ما دام كل ما يدخل المحول يخرج منه. فإذا حدث عطل <b>داخل</b> المنطقة التي بين محولات التيار (في الملفات مثلاً)، ذهب جزء من التيار إلى العطل فاختلف ${lt('I<sub>1</sub>')} عن ${lt('I<sub>2</sub>')}. أما العطل <b>خارج</b> هذه المنطقة فيمر تياره في الجهتين معاً، فيبقى الفرق صفراً ولا يعمل المرحل. ومحول المواءمة الموصل مثلثاً في الشكل يعوّض أن المحول نفسه نجمة/مثلث.`},
  {h:'7-4-2 متمم الوقاية بالاتزان',ref:'ص 155',html:'<p>يستعمل هذا المتمم لحماية المحولات من الأخطار التي تقع على الشبكة أو داخل المحول نفسه وأهمها اتصال أطراف المحول بالأرض. والشكل (7-10) يبين هذه الطريقة، ويظهر من الرسم أن أطراف المحول الابتدائية والثانوية تمر في قلب مستدير (حلقة) من الحديد بحيث تكون الدائرة المغناطيسية متزنة عندما يكون المحول يعمل في الظروف العادية. ولكن إذا اتصل أحد الأوجه بالأرض أو حدث قصر بين وجهين فإن الاتزان المغناطيسي [يختل] ويتولد تياراً في دائرة الملف الثانوي الموضوع على القلب الحديدي يؤثر في ملف المتمم المتصل به فيقفل دائرة البطارية على الملفات المغناطيسية المتحكمة في ملفات المفتاح الرئيس التي تعمل على فصل المحول من الدائرة.</p>'},
  {err:'في الكتاب «والشكل (٦ – ١٠)» والصحيح (7-10) (صُحّح في النص). والجملة «فإن الاتزان المغناطيسي ويولد» ناقصة؛ أكملناها بكلمة [يختل] بين قوسين.'},
  {fig:'(7-10)',ref:'ص 156',caption:'دائرة وقاية محول ثلاثي الأوجه من خطأ الاتصال بالأرض: حلقة حديدية على كل جهة، وملف ثانوي عليها يغذي ملف المتمم، وتلامس المتمم يُغلق دائرة البطارية على ملفي فصل المفتاحين.',draw:()=>box(svg710(),380)},
  {note:`${TIP}<b>فكرة الحلقة:</b> التيارات المارة في الحلقة يُلغي بعضها بعضاً ما دام كل تيار يذهب في موصل يعود في موصل آخر داخل الحلقة؛ فلا يتكوّن فيض ولا يتولد تيار في الملف الثانوي. أما تيار التسرب إلى الأرض فيعود من خارج الحلقة، فيبقى فيض في الحديد ويتولد تيار يشغّل المتمم.`}
 ],
 lab:(el)=>labTrafo(el),
 examples:[
  drawEx({title:'مثال مرسوم: الوقاية الفرقية لمحول — الشكل (7-9)',ref:'ص 154',
   q:'<p>ارسم دائرة الوقاية الفرقية لمحول ثلاثي الأوجه كما في الشكل (7-9). الجزء الجديد بالأزرق.</p>',
   steps:['الخطوط الثلاثة من 1L1 و1L2 و1L3 (جهة التغذية) إلى 2L1 و2L2 و2L3 (جهة الخروج).','<b>محولات التيار العلوية</b>: ملف عريض على الخط وثانوي رفيع بجانبه، والثانويات موصلة <b>نجمة</b> من أعلى، وتخرج منها ثلاثة أسلاك.','<b>محول القدرة</b> في إطار: الابتدائي 1U 1V 1W نجمة، والثانوي 2U 2V 2W مثلث.','<b>محولات التيار السفلية</b>: ثانوياتها نجمة من أسفل، وأسلاكها تصعد نحو المرحل.','<b>محول المواءمة</b>: يستقبل أسلاك محولات التيار العلوية، وثانويه مثلث ليعوّض توصيل محول القدرة.','<b>المرحل الفرقي ΔI</b>: يدخله I1 من أعلى (من محول المواءمة) وI2 من أسفل (من محولات التيار السفلية).','من المرحل سلكان إلى <b>ملف الفصل</b>، المرتبط بخط منقط بتلامس <b>مفتاح القدرة</b>.'],
   svg:i=>box(svg79(i,true),400)})],
 quiz:[
  {q:'متى يعمل المرحل الفرقي؟',o:['عندما ΔI = I1 − I2 ≠ 0','عندما I1 = I2','عندما يزيد الحمل دائماً','عندما ينخفض الجهد'],c:0,e:'«يعمل المرحل عندما ΔI = I1 − I2 ≠ 0» (ص 154).'},
  {q:'قصر في الشبكة بعد محولات التيار السفلية (خارج المحول). هل يعمل المرحل الفرقي؟',o:['لا، لأن التيار نفسه يمر في الجهتين فيبقى الفرق صفراً','نعم فوراً','نعم بعد زمن','يعمل نصف المرحل'],c:0,e:'العطل الخارجي يمر تياره في CT1 وCT2 معاً، فـ ΔI = 0. جرّب في المختبر.'},
  {q:'ما أهم نوع من أنواع وقاية المحولات حسب الكتاب؟',o:['الوقاية الفرقية','المصهرات','الوقاية الحرارية','مانعات الصواعق'],c:0,e:'«وأهم نوع من أنواع وقاية المحولات هي الوقاية الفرقية».'},
  {q:'في الوقاية بالاتزان، ماذا تمر في الحلقة الحديدية؟',o:['أطراف المحول الابتدائية والثانوية','ملف المتمم فقط','البطارية','موصل الأرضي وحده'],c:0,e:'«أطراف المحول الابتدائية والثانوية تمر في قلب مستدير (حلقة) من الحديد».'},
  {q:'ماذا يفعل متمم الاتزان عندما يتصل أحد الأوجه بالأرض؟',o:['يُغلق دائرة البطارية على ملفات فصل المفتاح الرئيس','يرفع جهد المحول','يفتح دائرة البطارية','يغيّر توصيل المحول'],c:0,e:'«فيقفل دائرة البطارية على الملفات المغناطيسية المتحكمة في ملفات المفتاح الرئيس التي تعمل على فصل المحول».'},
  {q:'ما وظيفة محول المواءمة في الشكل (7-9)؟',o:['جعل التيارين الداخلين إلى المرحل متساويين في التشغيل العادي','رفع جهد الشبكة','تغذية الحمل','فصل المحول'],c:0,e:'توضيح: محول التوصيل نجمة/مثلث يغيّر طور التيار ومقداره، ومحول المواءمة يعوّض ذلك حتى يبقى ΔI = 0 في التشغيل العادي.'}]
});

/* =====================================================================================
   7-5 Generator protection (7-11) and 7-6 conductor protection (7-12)
   ===================================================================================== */
function svg711L(){const x=90;let s='';
 s+=T(100,14,'L1-L2-L3/ 3.3 kV 60 Hz','',{fs:10.5})+ln(15,26,185,26,'tk')+nd(x,26,'')+ln(x,26,x,40,'')+fuse(x,40,'',24)+tick(x,52,'3','')+ln(x,64,x,80,'')+sw(x,80,28,true,'')+tick(x,98,'3','')+ln(x,108,x,240,'');
 s+=ctSL(x,136,'')+pa(`M${x+6} ${131}a6 6 0 0 1 0 10`,'th')+ln(x+6.5,136,150,136,'')+tick(126,136,'','')+T(126,128,'6','',{fs:10})+T(160,122,'3','',{fs:9.5})+meter(160,136,'A','');
 s+=nd(x,160,'')+ln(x,160,112,160,'')+fuseH(112,160,'',18)+tickH(122,160,'','')+T(122,152,'3','',{fs:9.5})+ln(130,160,138,160,'')+ci(146,166,8,'')+pa('M142 176a6 6 0 0 0 10 0','th')+ln(146,174,146,190,'')+T(140,200,'3','',{a:'end',fs:9.5})+meter(156,198,'V','');
 s+=ctSL(x,212,'')+ln(x-6.5,212,38,212,'')+tick(56,212,'','')+T(56,206,'3','',{fs:9.5})+ln(38,212,38,226,'')+rc(26,226,24,52,'bg')+T(38,256,'Δ','',{fs:13})+ln(38,278,38,320,'')+ln(38,320,x-6.5,320,'')+tick(56,320,'','')+T(56,314,'3','',{fs:9.5});
 s+=T(x,232,'3~ Y','',{fs:10})+ci(x,262,22,'bg')+ci(x,262,15,'')+T(x,266,'G','',{fs:12})+ln(x,284,x,360,'')+ctSL(x,320,'')+T(x+10,376,'PE','',{a:'start',fs:10})+earth(x,360,'');
 s+=ln(x+15,262,140,262,'')+ln(140,262,140,290,'')+ci(140,302,11,'bg')+T(140,306,'G','',{fs:10})+ln(146,293,152,286,'th')+meter(120,330,'V','')+meter(162,330,'A','')+ln(131,302,120,321,'th')+ln(151,302,162,321,'th');
 return SV('0 0 200 390',s,'الدائرة الخطية لمجموعة المولد')}
function svg711X(){const X=[150,176,202];let s='';
 s+=T(170,10,'L1-L2-L3/ 3.3 kV 60 Hz','',{fs:10})+['L1','L2','L3'].map((l,i)=>ln(40,20+i*10,320,20+i*10,'')+T(36,24+i*10,l,'',{a:'end',fs:9.5})).join('');
 X.forEach((x,i)=>{s+=nd(x,20+i*10,'')+ln(x,20+i*10,x,52,'')+fuse(x,52,'',20)+ln(x,72,x,82,'')+sw(x,82,26,true,'')+ln(x,108,x,300,'')});
 s+=ln(98,93,X[2]-5.5,93,'')+ln(98,97,X[2]-5.5,97,'')+rc(82,87,16,16,'bg')+ln(84,101,96,89,'th');
 s+=ln(48,60,48,70,'')+ln(54,63,54,67,'tk')+ln(48,65,40,65,'')+ln(54,65,90,65,'')+ln(90,65,90,87,'')+pl([[40,65],[30,65],[30,250]],'th')+pl([[90,103],[90,120],[60,120],[60,250]],'th');
 X.forEach((x,i)=>{const y=118+i*16;s+=wd(x,y,7,12,'')+rc(x+5,y+1,4,10,'')+pl([[x+7,y+1],[x+7,y-2],[300,y-2]],'th')+pl([[x+7,y+11],[x+7,y+13],[278,y+13]],'th')+meter(306,y+6,'A','')});
 s+=ln(278,129,278,166,'th')+T(270,176,'PE','',{a:'end',fs:9})+earth(278,166,'');
 X.forEach((x,i)=>{const y=192+i*9;s+=nd(x,y,'')+ln(x,y,236,y,'th')+fuseH(214,y,'th',12)});
 s+=rc(236,186,22,34,'bg')+wd(244,190,5,26,'')+wd(252,190,5,26,'')+ln(247,220,247,226,'th')+earth(247,226,'');
 ['V','V','V','Hz'].forEach((m,i)=>{s+=ln(258,194+i*7,290,194+i*7,'th')+meter(300,186+i*20,m==='Hz'?'~':m,'')});
 X.forEach((x,i)=>{s+=wd(x,252,7,14,'')+rc(x+5,253,4,12,'')+pl([[x+7,254],[x+7,248],[118,248-i*5]],'th')+rc(104,244-i*5,14,8,'bg th')+pl([[104,248-i*5],[66+i*10,248-i*5],[66+i*10,250]],'th')});
 [0,1,2].forEach(i=>{s+=rc(24+i*14,250,10,40,'bg')+ln(26+i*14,286,32+i*14,254,'th')});
 X.forEach((x,i)=>{s+=wd(x,300,10,30,'')+T(x-8,314,['U','V','W'][i],'',{a:'end',fs:9.5})+ln(x,330,x,348,'')+wd(x,348,7,14,'')+rc(x-9,349,4,12,'')+ln(x,362,x,380,'')+pl([[x-7,361],[x-7,372],[66+i*10,372],[66+i*10,290]],'th')});
 s+=ln(X[0],380,X[2],380,'')+nd(176,380,'')+ln(176,380,176,392,'')+earth(176,392,'')+T(214,384,'PE','',{a:'start',fs:9})+A(262,318,'ملفات المولد (نجمة)','',{fs:9});
 s+=ci(268,400,20,'')+wd(268,392,22,6,'')+ln(256,395,240,395,'th')+ln(280,395,296,395,'th')+ln(240,395,240,420,'th')+ln(296,395,296,420,'th')+rc(232,420,16,8,'F')+rc(288,420,16,8,'F');
 s+=ci(266,452,10,'bg')+T(266,456,'G','',{fs:10})+ln(240,428,240,452,'th')+ln(240,452,256,452,'th')+ln(296,428,296,452,'th')+ln(296,452,276,452,'th')+meter(220,470,'V','')+meter(312,470,'A','')+wd(266,478,26,6,'')+rc(220,490,40,8,'')+ln(226,504,252,486,'th')+arrowU(252,486,'');
 return SV('0 0 330 512',s,'الدائرة التنفيذية لمجموعة المولد (مبسطة)')}
function f712x(){const X={L1:110,PE:150,N:190},W=270;
 const st=[
  c=>T(150,12,'380/220 V 3/N/PE ~ 60 Hz',c,{fs:10.5})+[['L1',24],['L2',34],['L3',44],['N',54]].map(([l,y])=>ln(40,y,260,y,c)+T(36,y+4,l,c,{a:'end',fs:10})).join('')+ln(40,64,260,64,'dd '+cs(c))+T(36,68,'PE',c,{a:'end',fs:10}),
  c=>nd(110,24,c)+ln(110,24,110,108,c)+rc(90,100,42,82,'ds th '+cs(c))+T(116,110,'1',c,{a:'start',fs:9})+sw(110,108,26,true,c)+ln(110,134,110,140,c)+ln(70,121,104.5,121,'dt '+cs(c))+opCB(62,121,c)+T(44,125,'Q1',c,{a:'end',fs:10}),
  c=>rc(99,140,22,14,'bg '+cs(c))+thermal(110,149,c)+rc(99,156,22,14,'bg '+cs(c))+T(110,167,'I&gt;',c,{fs:9})+pl([[99,163],[80,163],[80,121]],'dt '+cs(c))+ln(99,147,80,147,'dt '+cs(c))+T(116,180,'2',c,{a:'start',fs:9})+ln(110,170,110,236,c),
  c=>nd(150,64,c)+ln(150,64,150,236,'dd '+cs(c))+nd(190,54,c)+ln(190,54,190,236,c),
  c=>Object.entries(X).map(([l,x])=>tm(x,240,c)+T(x-6,232,l,c,{a:'end',fs:9.5})+ln(x,243,x,252,c)+pa(`M${x-10} 262a10 10 0 0 1 20 0`,cs(c))+(l==='PE'?ln(x-10,256,x+10,256,cs(c)):'')).join('')+ln(104,240,196,240,'ds th '+cs(c))];
 return {st,W,H:276}}
function f712l(){const x=90,W=180;
 const st=[c=>T(95,14,'380/220 V 3/N/PE ~ 60 Hz',c,{fs:10})+ln(15,26,175,26,'tk '+cs(c))+nd(x,26,c)+ln(x,26,x,80,c)+tick(x,56,'3',c),
  c=>sw(x,80,30,true,c)+ln(x-6,95,x-24,95,cs(c))+thermal(x-30,92,c)+ln(x-14,86,x-34,112,cs(c))+arrowL(x-38,114,c)+T(x-46,104,'16A',c,{a:'end',fs:10.5}),
  c=>ln(x,110,x,190,c)+tick(x,150,'3',c),
  c=>pa(`M${x-12} 204a12 12 0 0 1 24 0`,cs(c))+ln(x-12,196,x+12,196,cs(c))+ln(x,190,x,192,c)];
 return {st,W,H:216}}
const svg712x=(k,hl)=>{const f=f712x();return SV(`0 0 ${f.W} ${f.H}`,seq(f.st,f.st.map((_,i)=>[i]),k==null?99:k,hl),'الدائرة التنفيذية لمفتاح وقاية الموصلات')};
const svg712l=(k,hl)=>{const f=f712l();return SV(`0 0 ${f.W} ${f.H}`,seq(f.st,f.st.map((_,i)=>[i]),k==null?99:k,hl),'الدائرة الخطية لمفتاح وقاية الموصلات')};
/* single-line of the generator–transformer group as the TEXT describes it (6 kV Y, step-up <span class="ltr">Y/Δ</span> to 22 kV, arresters) */
const arrester=(x,y,c)=>rc(x-6,y,12,22,'bg '+cs(c))+ln(x,y+3,x,y+18,cs(c)+' th')+arrowD(x,y+19,c)+ln(x,y+22,x,y+30,cs(c))+earth(x,y+30,c);
function fGT(){const x=90,W=230;
 const st=[
  c=>T(x+30,386,'3~ Y',c,{a:'start',fs:10})+ci(x,372,22,'bg '+cs(c))+ci(x,372,15,cs(c))+T(x,376,'G',c,{fs:12})+T(x+30,368,'6 kV',c,{a:'start',fs:10.5})+ln(x,394,x,410,c)+ln(x,410,x,420,c)+earth(x,420,c)+ln(x,350,x,326,c),
  c=>ctSL(x,404,c)+ctSL(x,334,c),
  c=>ln(x,326,x,262,c)+trSL(x,234,'Y','D',c)+T(x+20,226,'Y/Δ',c,{a:'start',fs:10.5})+ln(x,221,x,170,c),
  c=>ctSL(x,182,c)+rc(170,250,26,60,'bg '+cs(c))+T(183,284,'ΔI',c,{fs:12})+pl([[x+6.5,182],[183,182],[183,250]],cs(c)+' th')+pl([[x+6.5,404],[183,404],[183,310]],cs(c)+' th')+tick(183,216,'3',c)+tick(183,356,'3',c),
  c=>sw(x,128,30,true,c)+ln(x,158,x,170,c)+ln(x,100,x,128,c)+pl([[196,280],[214,280],[214,143],[x+12,143]],'dt '+cs(c))+arrowL(x+6,143,c),
  c=>ln(x,40,x,100,c)+ln(20,40,210,40,'tk '+cs(c))+nd(x,40,c)+T(x+30,30,'22 kV',c,{a:'start',fs:10.5})+nd(x,76,c)+ln(x,76,40,76,c)+arrester(40,76,c)];
 return {st,W,H:440}}
const svgGT=(k,hl)=>{const f=fGT();return SV(`0 0 ${f.W} ${f.H}`,seq(f.st,f.st.map((_,i)=>[i]),k==null?99:k,hl),'مجموعة مولد ومحول رافع')};

/* ---------- lab u7-l5 ---------- */
function labGenLine(el){
 const S={mode:'gen',q:true,gf:'none',heat:0,trip:null,delay:0,ang:0,m:{q:true,load:'n',heat:0,trip:null},hist:{gin:0,gout:0,gth:0,mth:0,mmag:0,dev:0}};
 el.innerHTML=`<div class="d7lab"><div class="grid">
  <section class="panel c7"><h2>وقاية المولد والموصلات</h2><div class="d7row">${segHTML('gm5',[['gen','وقاية المولد (7-11)'],['mcb',`مفتاح وقاية الموصلات ${lt('16 A')} (7-12)`]],S.mode)}</div><div id="gsv"></div>
   <div class="legend"><span><i style="background:var(--live)"></i>عليه جهد / تيار</span><span><i style="background:var(--wire)"></i>بلا جهد</span><span><i style="background:var(--stop)"></i>فصل</span></div></section>
  <section class="panel c5"><h2>لوحة التشغيل</h2><div id="gctl"></div>
   <div style="margin-top:10px"><span class="sub">حرارة العنصر الحراري — بلا أرقام، والزمن للعرض فقط:</span><div class="d7heat"><i id="gheat"></i><em style="left:75%"></em></div></div>
   <div class="d7chips" id="gchips"></div><div class="d7msg" id="gmsg"></div>
   <h3 class="sm">خطوات التجربة</h3><ol class="steps" id="g5steps"></ol></section></div></div>`;
 const $=s=>el.querySelector(s);let lastM='';const msg=(t,k)=>{if(t===lastM)return;lastM=t;const m=$('#gmsg');m.innerHTML=t;m.className='d7msg'+(k?' '+k:'')};
 const drawGen=()=>{const x=120,on=S.q;const big=S.gf!=='none'&&on,K=on?(big?'fl':'on'):'off';
  const iL=on?(S.gf==='in'?0:1):0,iN=on?1:0,dG=chF('ctnrev')?(iL>0||iN>0):iL!==iN;
  let s=A(x,14,'الشبكة','',{fs:10})+ln(30,24,220,24,'tk on')+nd(x,24,'on')+ln(x,24,x,48,big&&S.gf==='out'?'on':K)+ln(x,70,x,78,K)+(S.q?ln(x,70,x,56,K):ln(x,70,x-11,57,'tr'))+ln(x,48,x,56,K)+T(x-18,66,'Q','',{a:'end',fs:11,cl:S.trip?'red':''})+rc(150,56,14,14,S.trip?'tr':'')+ln(150,63,x+4,63,'dt th mu');
  if(S.gf==='out')s+=pl([[150,30],[164,40],[156,43],[172,54]],'tr')+A(196,46,'قصر خارجي','',{fs:9,cl:'red'});
  s+=ln(x,78,x,200,K)+ctSL(x,110,K)+T(x+10,102,'CT','',{a:'start',fs:9.5});
  s+=rc(176,96,26,30,'bg '+(S.trip==='th'?'tr':''))+thermal(189,105,S.trip==='th'?'tr':'')+A(189,140,'حراري','',{fs:9})+ln(x+6.5,110,176,110,'th');
  s+=T(x,186,'3~ Y','',{fs:10})+ci(x,222,24,'bg '+(S.gf==='in'&&on?'tr':''))+ci(x,222,16,on?'on':'')+`<g id="grot" transform="rotate(${S.ang} ${x} 222)">${ln(x,206,x,212,'th mu')+ln(x,232,x,238,'th mu')}</g>`+T(x,226,'G','',{fs:12});
  if(S.gf==='in')s+=pl([[x+30,200],[x+40,210],[x+34,213],[x+46,226]],'tr')+A(x+64,238,'عطل داخلي','',{fs:9,cl:'red'});
  s+=ln(x,246,x,300,on?'on':'off')+ctSL(x,274,on?'on':'off')+earth(x,300,'');
  const d=dG;s+=rc(30,150,40,44,'bg '+(S.trip==='diff'||d?'tr':''))+T(50,178,'Δ','',{fs:15,cl:S.trip==='diff'||d?'red':''})+pl([[x-6.5,110],[50,110],[50,150]],iL?'on':'off')+pl([[x-6.5,274],[50,274],[50,194]],iN?'on':'off')+pl([[30,172],[16,172],[16,40],[150,40],[150,56]],S.trip==='diff'?'tr':'th');
  s+=A(50,140,'فرقي','',{fs:9});
  return SV('0 0 240 320',s,'وقاية المولد: مبسطة')};
 const M=S.m,mOn=()=>M.q&&M.load!=='s';
 const drawMcb=()=>{const en=M.q,K=en?'fl':'off';
  let s=T(140,12,'380/220 V 3/N/PE ~ 60 Hz','',{fs:10})+[['L1',24],['N',36]].map(([l,y])=>ln(40,y,260,y,'on')+T(36,y+4,l,'',{a:'end',fs:10})).join('')+ln(40,48,260,48,'dd')+T(36,52,'PE','',{a:'end',fs:10});
  s+=nd(110,24,'on')+ln(110,24,110,90,en?'fl':'on')+rc(90,84,42,80,'ds th')+ln(110,90,110,98,en?'fl':'on')+(M.q?ln(110,112,110,98,K):ln(110,112,99,99,'tr'))+ln(110,112,110,240,K)+ln(70,105,M.q?110:104.5,105,'dt mu')+opCB(62,105,M.trip?'tr':'')+T(44,109,'Q1','',{a:'end',fs:10})+T(44,126,'16 A','',{a:'end',fs:10})+`<rect class="hit" data-k="mq" x="40" y="88" width="72" height="34"/>`;
  s+=`<rect x="99" y="122" width="22" height="14" class="${M.trip==='th'?'tr':''}" style="fill:color-mix(in srgb,var(--stop) ${Math.round(Math.min(1,M.heat/1.33)*60)}%,var(--surface))"/>`+thermal(110,131,M.trip==='th'?'tr':'')+rc(99,140,22,14,'bg '+(M.trip==='mag'?'tr':''))+T(110,151,'I&gt;','',{fs:9,cl:M.trip==='mag'?'red':''});
  s+=nd(190,36,'on')+ln(190,36,190,240,K)+nd(150,48,'')+ln(150,48,150,240,'dd');
  [['L1',110],['PE',150],['N',190]].forEach(([l,x])=>{s+=tm(x,244,'')+T(x-6,236,l,'',{a:'end',fs:9})+ln(x,247,x,256,'')+pa(`M${x-10} 266a10 10 0 0 1 20 0`,'')+(l==='PE'?ln(x-10,260,x+10,260,''):'')});
  s+=rc(96,272,108,30,mOn()?'glow':'bg')+A(150,292,M.load==='s'?'الجهاز: قصر':M.load==='o'?'جهاز بحمل زائد':'جهاز كهربائي','',{fs:10,cl:M.load==='s'?'red':''});
  return SV('0 0 270 310',s,'مفتاح وقاية الموصلات: الدائرة الحية')};
 const ctl=()=>{$('#gctl').innerHTML=S.mode==='gen'
   ?`<div class="d7row"><span class="sub">الحالة:</span>${segHTML('gf',[['none','تشغيل عادي'],['in','عطل داخل المولد'],['out','قصر خارج المولد (في الشبكة)'],['ov','زيادة الحمل']],S.gf)}</div><div class="d7row"><button class="btn" id="grst">أعد إغلاق Q</button></div>`
   :`<div class="d7row">${swHTML('mq1','Q1','مفتاح وقاية الموصلات',M.q)}</div><div class="d7row"><span class="sub">الجهاز في المقبس:</span>${segHTML('ml5',[['n','عادي'],['o','زيادة حمل'],['s','قصر']],M.load)}</div>`;
  el.querySelectorAll('[data-gf]').forEach(b=>b.addEventListener('click',()=>{S.gf=b.dataset.gf;S.delay=0;msg({none:'المولد يغذي الشبكة عادياً.',in:'عطل بين ملفات العضو الثابت: التيار عند نقطة النجمة لا يساوي التيار عند الأطراف…',out:'قصر في الشبكة خارج المولد: التيار الكبير نفسه يمر في محولي التيار.',ov:'زيادة الحمل على المولد: التيار أكبر من المقنن فيسخن المتمم الحراري…'}[S.gf]);refresh()}));
  const r=$('#grst');r&&r.addEventListener('click',()=>{if(S.gf==='in'){msg('العطل الداخلي ما زال موجوداً: لا تُعِد التشغيل قبل إصلاح المولد. اختر «تشغيل عادي».','bad');return}if(S.trip==='th'&&S.heat>0.5){msg('انتظر حتى يبرد المتمم الحراري.','bad');return}S.q=true;S.trip=null;msg('أُغلق Q.');refresh()});
  const q=$('#mq1');q&&q.addEventListener('click',mToggle);
  el.querySelectorAll('[data-ml5]').forEach(b=>b.addEventListener('click',()=>{M.load=b.dataset.ml5;mShort();refresh()}))};
 const mShort=()=>{if(M.q&&M.load==='s'&&chF('mcbmag')){msg('<b>قصر!</b>','bad')}else if(M.q&&M.load==='s'){M.q=false;M.trip='mag';S.hist.mmag++;msg('<b>قصر!</b> «يفصل القاطع المغناطيسي الموصل عند نشوء دائرة قصر» — فوراً.','bad')}else if(M.q&&M.load==='o')msg('زيادة حمل: يسخن القاطع الحراري ببطء…');else if(M.q)msg('الجهاز يعمل عادياً.')};
 function mToggle(){if(M.q){M.q=false;M.trip=null;if(M.load!=='s'){S.hist.dev++;msg('فصلت Q1 يدوياً. هذا ممكن، لكن «مفاتيح وقاية الموصلات لا تستعمل للتشغيل الاعتيادي للأجهزة عند الوصل والفصل، أي أنها ليست مفاتيح أجهزة»؛ للجهاز مفتاحه الخاص.')}refresh();return}
  if(M.trip==='th'&&M.heat>0.5){msg('العنصر الحراري ما زال ساخناً؛ انتظر قليلاً ثم أعد الإغلاق.','bad');refresh();return}
  M.q=true;M.trip=null;mShort();refresh()}
 const chips=()=>{if(S.mode==='gen'){$('#gchips').innerHTML=chip('المولد',S.q?'متصل بالشبكة':'مفصول',S.q?'on':'bad')+chip('المتمم الفرقي',S.trip==='diff'?'فصل':'لم يعمل',S.trip==='diff'?'bad':'')+chip('المتمم الحراري',S.trip==='th'?'فصل':S.heat>0.5?'يسخن':'بارد',S.trip==='th'?'bad':S.heat>0.5?'on':'');$('#gheat').style.width=Math.min(100,S.heat/1.33*100)+'%'}
  else{$('#gchips').innerHTML=chip('الجهاز',mOn()?'يعمل':'متوقف',mOn()?'on':'')+chip('القاطع الحراري',M.trip==='th'?'فصل':M.heat>0.5?'يسخن':'بارد',M.trip==='th'?'bad':M.heat>0.5?'on':'')+chip('القاطع المغناطيسي',M.trip==='mag'?'فصل':'جاهز',M.trip==='mag'?'bad':'');$('#gheat').style.width=Math.min(100,M.heat/1.33*100)+'%';const q=$('#mq1');q&&q.setAttribute('aria-pressed',String(M.q))}};
 const refresh=()=>{$('#gsv').innerHTML=box(S.mode==='gen'?drawGen():drawMcb(),380);const h=$('#gsv').querySelector('[data-k]');h&&h.addEventListener('click',mToggle);chips();segSet(el,'gm5',S.mode);segSet(el,'gf',S.gf);segSet(el,'ml5',M.load);steps.check()};
 let acc=0;
 loopOn(el,dt=>{
  const gRun=S.q&&S.gf==='ov',tg=S.q?(S.gf==='ov'?1.6:0.3):0;S.heat+=(tg-S.heat)*(1-Math.exp(-dt/(gRun?4:3)));
  if(S.q&&S.gf!=='in'&&chF('ctnrev')&&!chF('diffdead')){S.delay+=dt;if(S.delay>0.5){S.q=false;S.trip='diff';msg('فصل المتمم الفرقي المولد عن الشبكة.','bad');refresh()}}
  if(S.q&&S.gf==='in'&&!chF('diffdead')){S.delay+=dt;if(S.delay>0.5){S.q=false;S.trip='diff';S.hist.gin++;msg('<b>المتمم الفرقي</b> رأى أن التيار عند بداية الأوجه لا يساوي التيار عند نهايتها، فيعمل على فصل المجموعة كلياً من الشبكة.','bad');refresh()}}
  if(S.q&&S.gf==='out'){S.delay+=dt;if(S.delay>1&&S.delay-dt<=1){S.hist.gout++;msg('المتمم الفرقي <b>لم يعمل</b>: العطل خارج المولد، فالتيار نفسه في محولي التيار. (يحمي المولد من الحمل الزائد المتمم الحراري، ويفصل القصر في الشبكة جهازُ وقاية الشبكة — توضيح.)','ok');refresh()}}
  if(gRun&&S.heat>=1){S.q=false;S.trip='th';S.hist.gth++;msg('فصل <b>المتمم الحراري</b> بعد زمن: «المتمم الحراري ضد زيادة الحمل».','bad');refresh()}
  const mHot=M.q&&M.load==='s'&&chF('mcbmag'),mt=mHot?3:M.q?(M.load==='o'?1.6:0.3):0;M.heat+=(mt-M.heat)*(1-Math.exp(-dt/(mHot?1.5:M.q&&M.load==='o'?4:3)));
  if(M.q&&(M.load==='o'||mHot)&&M.heat>=1&&!chF('mcbth')){M.q=false;M.trip='th';S.hist.mth++;msg('فصل <b>القاطع الحراري</b> بعد زمن: «يفصل القاطع الحراري عند التحميل الزائد».','bad');refresh()}
  if(S.q)S.ang=(S.ang+dt*360)%360;const g=el.querySelector('#grot');if(g)g.setAttribute('transform',`rotate(${S.ang} 120 222)`);
  acc+=dt;if(acc>0.15){acc=0;chips()}});
 el.querySelectorAll('[data-gm5]').forEach(b=>b.addEventListener('click',()=>{S.mode=b.dataset.gm5;ctl();msg(S.mode==='gen'?'اختر حالة المولد.':'Q1 مغلق والجهاز يعمل. جرّب زيادة الحمل ثم القصر.');refresh()}));
 const steps=stepsUI($('#g5steps'),[
  {t:'عطل داخل المولد',x:'في «وقاية المولد» اختر «عطل داخل المولد».',done:()=>S.hist.gin>0},
  {t:'قصر خارج المولد',x:'اختر «تشغيل عادي» ثم «أعد إغلاق Q»، ثم «قصر خارج المولد».',done:()=>S.hist.gout>0},
  {t:'زيادة الحمل على المولد',x:'اختر «تشغيل عادي»، أعد إغلاق Q، ثم «زيادة الحمل» وانتظر.',done:()=>S.hist.gth>0},
  {t:'مفتاح وقاية الموصلات: حمل زائد',x:'اختر «مفتاح وقاية الموصلات 16 A» ثم «زيادة حمل».',done:()=>S.hist.mth>0},
  {t:'مفتاح وقاية الموصلات: قصر',x:'اختر جهازاً «عادياً» وانتظر أن يبرد العنصر، أغلق Q1، ثم اختر «قصر».',done:()=>S.hist.mmag>0}]);
 ctl();msg('اختر حالة المولد.');refresh()}

B.lesson({
 id:'u7-l5',unit:7,order:5,pages:'156–159',
 title:'وقاية المولدات والموصلات',
 summary:'أخطاء المولد الخارجية والداخلية، ووقايته بالمتمم الفرقي ومتمم الاتزان الحلقي والمتمم الحراري (الشكل 7-11)؛ ثم مفتاح وقاية الموصلات: حراري للتحميل الزائد ومغناطيسي للقصر، وليس مفتاح أجهزة (الشكل 7-12).',
 stations:[
  {intro:true},

  {st:1,short:'أخطاء المولد',title:'7-5 وقاية مولدات التيار المتغير: الأخطاء ووسائل الوقاية',ref:'ص 156–157',
   q:'قصر في الحمل البعيد وقصر بين ملفات المولد… أيهما «خارجي» وأيهما «داخلي»؟',
   art:DRA.art({aria:'الشكل 7-11: الدائرة الخطية لمجموعة المولد بأجهزة القياس والمرحل الفرقي',
    parts:[{svg:svg711L(),box:[70,8,220,296],tips:[
     [76,36,30,32,'مصهر ثم مفتاح على خط ⟦3.3 kV⟧.'],
     [100,124,72,24,'محول تيار يغذي ثلاثة أميترات.'],
     [110,152,60,58,'محول جهد يغذي ثلاثة فولتميترات.'],
     [22,222,32,60,'المرحل الفرقي ⟦Δ⟧: يقارن تيار بداية الأوجه بتيار نهايتها (نقطة النجمة).'],
     [64,236,52,52,'المولد ⟦G 3~ Y⟧: ملفاته نجمة.'],
     [124,286,54,56,'المثير ⟦G⟧ (تيار مستمر) مع ⟦V⟧ و⟦A⟧.']]}]}),
   cap:'الدائرة الخطية للشكل <span class="ltr">(7-11)</span>.<br><b>مرّر المؤشر على المصهر ومحولي التيار والجهد والمرحل والمولد والمثير (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[{predict:{q:'ما المتمم المستخدم لحماية المولد ضد الأخطار الداخلية؟',opts:[
     ['المتمم الحراري',false,'الحراري ضد زيادة الحمل.'],
     ['مانع الصواعق',false,'مانعات الصواعق لخطوط الضغط العالي.'],
     ['المتمم الفرقي',true,'«ولحماية المولدات يتم استخدام المتمم الفرقي ضد الأخطار الداخلية».']]}}],
   body:[
    {book:'<p>تنقسم الأخطاء التي تتعرض لها مولدات التيار المتغير إلى أخطاء خارجية وأخطاء داخلية.</p><p>الأخطاء التي تحدث خارج المولد مثل قصر في دائرة الحمل، وزيادة الحمل على المولد، عدم اتزان الحمل على خطوط الأوجه أو انعكاس القدرة الكهربية. أما الأخطاء التي تحدث داخل الآلة نفسها مثل قصر بين أوجه العضو الثابت أو قصر بين ملفات الوجه الواحد أو تماس بين العضو الثابت والأرضي أو ارتفاع حرارة هواء التبريد أو احتراق العضو الثابت. ولحماية المولدات يتم استخدام المتمم الفرقي ضد الأخطار الداخلية. متمم الاتزان الحلقي للوقاية ضد التسرب الأرضي أو القصر. المتمم الحراري ضد زيادة الحمل.</p>',ref:'ص 156–157'},
    {tip:'<p>كل خطر له متممه: <b>الفرقي</b> للأخطار الداخلية، و<b>الاتزان الحلقي</b> للتسرب الأرضي أو القصر (الفكرة نفسها في وقاية المحولات، الدرس السابق)، و<b>الحراري</b> لزيادة الحمل.</p>',title:'ثلاثة متممات'},
    {title:'مختبر مصغّر: داخلي أم خارجي؟',widget:(el,B)=>DCML.sort(el,B,{cats:['خطأ خارجي','خطأ داخلي'],items:[
     ['قصر في دائرة الحمل.',0,'يحدث خارج المولد.'],['قصر بين ملفات الوجه الواحد.',1,'داخل الآلة نفسها.'],['انعكاس القدرة الكهربية.',0,'من الأخطاء الخارجية في الكتاب.'],['ارتفاع حرارة هواء التبريد.',1,'من الأخطاء الداخلية في الكتاب.'],['عدم اتزان الحمل على خطوط الأوجه.',0,'خارجي.'],['تماس بين العضو الثابت والأرضي.',1,'داخلي.']]})}
   ]},

  {st:2,short:'مجموعة مولد–محول',title:'وقاية مجموعة (مولد – محول) بالمتمم الفرقي ومانعات الصواعق',ref:'ص 157–158',
   q:'لماذا نضع محولي تيار عند طرفي المجموعة كلها لا عند المولد وحده؟',
   art:DRA.art({aria:'مخطط خطي مقترح لمجموعة مولد 6 كيلو فولت ومحول رافع إلى 22 كيلو فولت مع متمم فرقي ومانع صواعق',bg:'#E4ECF6',
    parts:[{svg:svgGT(),box:[60,6,240,306],tips:[
     [20,24,190,22,'قضبان ⟦22 kV⟧.'],
     [26,74,30,62,'مانع الصواعق بين الخط والأرض: يحمي المجموعة من الصواعق.'],
     [78,124,30,40,'مفتاح القدرة على جهة ⟦22 kV⟧؛ السهم من المتمم يفصله.'],
     [68,210,46,56,'المحول الرافع ⟦Y/Δ⟧ من ⟦6 kV⟧ إلى ⟦22 kV⟧.'],
     [80,174,20,18,'محول تيار عند آخر المجموعة (بعد المحول).'],
     [80,326,20,18,'محول تيار عند أطراف المولد.'],
     [166,246,34,68,'المتمم الفرقي ⟦ΔI⟧: محولات التيار موصلة به بالتضاد.'],
     [64,348,52,52,'المولد ⟦G 3~ Y⟧ بجهد ⟦6 kV⟧.']]}]}),
   cap:'مخطط مقترح (ليس من الكتاب) يتبع وصف النص؛ الشكل المطبوع لا يطابق النص.<br><b>مرّر المؤشر على الأجزاء (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[{predict:{q:'كيف توصل محولات التيار في الوقاية الفرقية للمجموعة؟',opts:[
     ['على التوازي مع الحمل',false,'محول التيار يوضع على الخط نفسه.'],
     ['معاً بالتضاد',true,'«بحيث توصل محولات التيار معاً بالتضاد».'],
     ['على التوالي مع البطارية',false,'لم يرد هذا.']]}}],
   body:[
    {book:'<p>والشكل (7-11) يوضح الدائرة الخطية والدائرة التنفيذية لمولد تيار متغير ذي منتج ثابت موصلة ملفاته على الشكل نجمة ذو جهد 6 ك. ف ويتصل بمحول قدرة رافع <span class="ltr">(Y / Δ)</span> حيث يتم رفع الجهد المتولد عن طريق المحول إلى 22 ك. ف، ولوقاية هذه المجموعة يتم تركيب المتمم الفرقي وذلك بمحولات تيار على كل من بدايات ونهايات أوجه المولد والمحول بحيث توصل محولات التيار معاً بالتضاد، فإذا حدث خلل داخل المجموعة فإن المتمم الفرقي يعمل على فصل المجموعة كلياً من الشبكة. علاوة على وقاية الخطوط ذات الضغط العالي (22 ك. ف) بها [مانعات] للصواعق لوقاية المجموعة من خطر الصواعق.</p>',ref:'ص 157'},
    {watch:'<ul style="margin:4px 0 0;padding-inline-start:18px"><li>الشكل (7-11) لا يطابق النص ولا عنوانه: النص يصف مولداً <span class="ltr">6 kV</span> مع محول رافع <span class="ltr">Y/Δ</span> إلى <span class="ltr">22 kV</span> ومانعات صواعق، والرسم لا يحتوي محولاً ولا مانعات صواعق، والقضبان مكتوب عليها <span class="ltr">3.3 kV</span>. الرسم في أعلى المحطة مقترح يتبع النص، والشكل المطبوع أدناه.</li><li>في النص «لفات للصواعق» والمقصود «مانعات الصواعق» (كما في عنوان الشكل).</li></ul>',fix:true},
    {html:`<figure class="fig" style="margin:10px 0">${fig2(`<div>${box(svg711L(),220)}${cap('الدائرة الخطية')}</div>`,`<div>${box(svg711X(),340)}${cap('الدائرة التنفيذية (مبسطة)')}</div>`)}<figcaption><b>الشكل <span class="ltr">(7-11)</span></b> كما طُبع: الدائرة الخطية والدائرة التنفيذية لمجموعة (مولد – محول). الدائرة التنفيذية هنا مبسطة. <span class="ref">ص 158</span></figcaption></figure>`},
    {tip:'<p>وضع محولات التيار على بداية المجموعة ونهايتها يجعل المولد والمحول معاً داخل «منطقة الحماية»، فأي خلل في أي منهما يجعل الفرق لا يساوي صفراً فيعمل المتمم.</p>',title:'منطقة حماية واحدة'},
    {title:'مختبر مصغّر: هل يعمل المتمم الفرقي؟',widget:(el,B)=>DCML.cases(el,B,{cases:[
     {q:'قصر بين ملفين داخل المحول الرافع.',opts:[['نعم، يفصل المجموعة كلياً من الشبكة',true,'الخلل داخل المجموعة (بين محولات التيار).'],['لا، لأن المتمم يحمي المولد فقط',false,'محولات التيار على بدايات ونهايات المولد والمحول معاً.']]},
     {q:'زيادة الحمل على المولد.',opts:[['يعمل المتمم الفرقي',false,'التيار نفسه يمر في محولات التيار في الجهتين.'],['يعمل المتمم الحراري',true,'«المتمم الحراري ضد زيادة الحمل».']]}]})}
   ]},

  {st:3,short:'7-6 وقاية الموصلات',title:'7-6 وقاية الموصلات (الشكل 7-12)',ref:'ص 159',
   q:'هل تطفئ المكيف من القاطع في لوحة البيت كل يوم؟',
   art:DRA.art({aria:'الشكل 7-12: الدائرة الخطية والتنفيذية لمفتاح وقاية الموصلات يغذي مقبساً',bg:'#F7DCC8',
    parts:[{svg:svg712l(),box:[14,40,120,200],tips:[[20,92,44,22,'⟦16A⟧: تيار مقنن المفتاح.'],[60,36,40,30,'الشرطة 3 = ثلاثة موصلات: ⟦L1⟧ و⟦N⟧ و⟦PE⟧.'],[74,188,32,24,'رمز المقبس.']]},
           {svg:svg712x(),box:[140,22,206,250],tips:[[88,96,48,90,'مفتاح وقاية الموصلات ⟦Q1⟧ أحادي القطب: قاطع حراري ومغناطيسي ⟦I>⟧.'],[144,60,14,176,'موصل الوقاية ⟦PE⟧.'],[94,232,116,40,'أطراف المقبس ⟦L1⟧ ⟦PE⟧ ⟦N⟧؛ الخط المتقطع يعني أنها مقبس واحد.']]}],
    extra:DRA.L(74,268,'الخطية',12.5,700)+DRA.L(243,296,'التنفيذية',12.5,700)}),
   cap:'<b>مرّر المؤشر على المفتاح وموصل الوقاية والمقبس والأرقام (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[{predict:{q:'هل يُستعمل مفتاح وقاية الموصلات لتشغيل الأجهزة وإطفائها يومياً؟',opts:[
     ['نعم، هذا عمله الأساسي',false,'الكتاب ينص على العكس.'],
     ['لا، فهو ليس مفتاح أجهزة',true,'«مفاتيح وقاية الموصلات لا تستعمل للتشغيل الاعتيادي للأجهزة عند الوصل والفصل».'],
     ['نعم، مع الأجهزة الصغيرة فقط',false,'لا استثناء في النص.']]}}],
   body:[
    {book:'<p>تتم وقاية الموصلات باستخدام مفاتيح وقاية الموصلات، وهي مفاتيح قابضة ذات فصل حراري وفصل كهر ومغناطيسي، يفصل القاطع الحراري عند التحميل الزائد، ويفصل القاطع المغناطيسي الموصل عند نشوء دائرة قصر. مفاتيح وقاية الموصلات لا تستعمل للتشغيل الاعتيادي للأجهزة عند الوصل والفصل، أي أنها ليست مفاتيح أجهزة. والشكل (7-12) يبين الدائرة الخطية والتنفيذية لوقاية الموصلات.</p>',ref:'ص 159'},
    {tip:'<p>في الدائرة الخطية للشكل (7-12) الشرطة مع الرقم 3 تعني ثلاثة موصلات: L1 وN وPE (لا ثلاثة أوجه). والمفتاح Q1 أحادي القطب على L1 وحده، ومقننه <span class="ltr">16 A</span>. قارنه بمفتاح وقاية المحرك: ذاك مفتاح وقاية ومفتاح أجهزة معاً.</p>',title:'اقرأ الشكل'},
    {add:'<p>هذا هو «القاطع» (<span class="ltr">MCB</span>) في لوحة توزيع البيت: لكل دائرة مقابس أو إنارة قاطع يحمي أسلاكها.</p>',title:'من الواقع'},
    {title:'مختبر مصغّر: حراري أم مغناطيسي؟',widget:(el,B)=>DCML.sort(el,B,{intro:'من يفصل في كل موقف؟',cats:['القاطع الحراري','القاطع المغناطيسي','لا يفصل'],items:[
     ['وُصلت أجهزة كثيرة في المقبس فزاد التيار على المقنن مدة.',0,'«يفصل القاطع الحراري عند التحميل الزائد».'],
     ['سلك الجهاز تلف فتلامس موصلاه.',1,'«ويفصل القاطع المغناطيسي الموصل عند نشوء دائرة قصر».'],
     ['جهاز يعمل بتيار أقل من المقنن.',2,'تشغيل عادي.']]})}
   ]},

  {recap:[
   'أخطاء المولد خارجية (قصر في الحمل، زيادة الحمل، عدم الاتزان، انعكاس القدرة) وداخلية (قصر بين الأوجه أو الملفات، تماس مع الأرضي، حرارة التبريد).',
   'المتمم الفرقي ضد الأخطار الداخلية، ومتمم الاتزان الحلقي ضد التسرب الأرضي، والمتمم الحراري ضد زيادة الحمل.',
   'في مجموعة مولد–محول: محولات تيار على بدايات ونهايات المجموعة موصلة بالتضاد، ومانعات صواعق على خطوط 22 kV.',
   'مفتاح وقاية الموصلات: حراري للتحميل الزائد ومغناطيسي للقصر، وليس مفتاح أجهزة.']}
],
 theory:[
  {h:'7-5 وقاية مولدات التيار المتغير',ref:'ص 156–157',html:'<p>تنقسم الأخطاء التي تتعرض لها مولدات التيار المتغير إلى أخطاء خارجية وأخطاء داخلية.</p><p>الأخطاء التي تحدث خارج المولد مثل قصر في دائرة الحمل، وزيادة الحمل على المولد، عدم اتزان الحمل على خطوط الأوجه أو انعكاس القدرة الكهربية. أما الأخطاء التي تحدث داخل الآلة نفسها مثل قصر بين أوجه العضو الثابت أو قصر بين ملفات الوجه الواحد أو تماس بين العضو الثابت والأرضي أو ارتفاع حرارة هواء التبريد أو احتراق العضو الثابت. ولحماية المولدات يتم استخدام المتمم الفرقي ضد الأخطار الداخلية. متمم الاتزان الحلقي للوقاية ضد التسرب الأرضي أو القصر. المتمم الحراري ضد زيادة الحمل.</p>'},
  {html:'<p>والشكل (7-11) يوضح الدائرة الخطية والدائرة التنفيذية لمولد تيار متغير ذي منتج ثابت موصلة ملفاته على الشكل نجمة ذو جهد 6 ك. ف ويتصل بمحول قدرة رافع <span class="ltr">(Y / Δ)</span> حيث يتم رفع الجهد المتولد عن طريق المحول إلى 22 ك. ف، ولوقاية هذه المجموعة يتم تركيب المتمم الفرقي وذلك بمحولات تيار على كل من بدايات ونهايات أوجه المولد والمحول بحيث توصل محولات التيار معاً بالتضاد، فإذا حدث خلل داخل المجموعة فإن المتمم الفرقي يعمل على فصل المجموعة كلياً من الشبكة. علاوة على وقاية الخطوط ذات الضغط العالي (22 ك. ف) بها [مانعات] للصواعق لوقاية المجموعة من خطر الصواعق.</p>'},
  {fig:'(7-11)',ref:'ص 158',caption:'الدائرة الخطية والدائرة التنفيذية لمجموعة (مولد – محول) في محطة توليد قوى كهربية ووقاية المجموعة بالمتمم الفرقي والوقاية بمانعات للصواعق. الدائرة التنفيذية هنا مبسطة: ملفات المولد مرسومة متجاورة لا على شكل نجمة، لتظهر محولات التيار على بداية كل وجه ونهايته.',draw:()=>fig2(`<div>${box(svg711L(),220)}${cap('الدائرة الخطية')}</div>`,`<div>${box(svg711X(),340)}${cap('الدائرة التنفيذية (مبسطة)')}</div>`)},
  {err:`<ul style="margin:4px 0 0;padding-inline-start:18px"><li>الشكل (7-11) لا يطابق النص ولا عنوانه: النص يصف مولداً <span class="ltr">6 kV</span> مع محول رافع <span class="ltr">Y/Δ</span> إلى <span class="ltr">22 kV</span> ومانعات صواعق، والرسم لا يحتوي محولاً ولا مانعات صواعق، والقضبان مكتوب عليها <span class="ltr">3.3 kV</span>. رسمنا الشكل كما طُبع، وفي «الأمثلة المحلولة» مخطط خطي مقترح للمجموعة كما يصفها النص.</li><li>في النص «لفات للصواعق» والمقصود «مانعات الصواعق» (كما في عنوان الشكل).</li></ul>`},
  {h:'7-6 وقاية الموصلات',ref:'ص 159',html:'<p>تتم وقاية الموصلات باستخدام مفاتيح وقاية الموصلات، وهي مفاتيح قابضة ذات فصل حراري وفصل كهر ومغناطيسي، يفصل القاطع الحراري عند التحميل الزائد، ويفصل القاطع المغناطيسي الموصل عند نشوء دائرة قصر. مفاتيح وقاية الموصلات لا تستعمل للتشغيل الاعتيادي للأجهزة عند الوصل والفصل، أي أنها ليست مفاتيح أجهزة. والشكل (7-12) يبين الدائرة الخطية والتنفيذية لوقاية الموصلات.</p>'},
  {fig:'(7-12)',ref:'ص 159',caption:'الدائرة الخطية والتنفيذية لمفتاح وقاية الموصلات.',draw:()=>fig2(`<div>${box(svg712l(),200)}${cap('الدائرة الخطية')}</div>`,`<div>${box(svg712x(),300)}${cap('الدائرة التنفيذية')}</div>`)},
  {note:`${TIP}في الدائرة الخطية للشكل (7-12) الشرطة مع الرقم 3 تعني ثلاثة موصلات: L1 وN وPE (لا ثلاثة أوجه). والمفتاح Q1 أحادي القطب على L1 وحده، ومقننه ${lt('16 A')}.`}
 ],
 lab:(el)=>labGenLine(el),
 examples:[
  drawEx({title:'مثال مرسوم: الشكل (7-12) — وقاية الموصلات',ref:'ص 159',
   q:'<p>ارسم الدائرة التنفيذية ثم الخطية لمفتاح وقاية موصلات يغذي مقبساً (الشكل 7-12).</p>',
   steps:['القضبان L1 وL2 وL3 وN وPE والعنوان <span class="ltr">380/220 V 3/N/PE ~ 60 Hz</span>.','من L1 سلك إلى الطرف 1 لمفتاح الوقاية <b>Q1</b> أحادي القطب (إطار متقطع، تلامس، ذراع ⊞).','القاطع الحراري والقاطع المغناطيسي I&gt; داخل الإطار، والطرف 2.','موصل الوقاية PE (متقطع بنقطة) وموصل التعادل N ينزلان من القضبان.','أطراف المقبس L1 وPE وN ورموز المقبس تحتها (والأوسط بخط الأرضي)، والخط المتقطع يعني أنها مقبس واحد.','الدائرة الخطية: شرطة 3 (L1 وN وPE)، القاطع بالحراري والسهم المغناطيسي و<span class="ltr">16A</span>، شرطة 3، ثم رمز المقبس.'],
   svg:i=>i<5?box(svg712x(i,true),300):fig2(box(svg712l(0,true),200),box(svg712x(),300))}),
  drawEx({title:'رسم مقترح: مجموعة المولد والمحول كما يصفها النص',ref:'ص 157',
   q:`<p>${SOLT}النص (ص 157) يصف مولداً نجمة <span class="ltr">6 kV</span> مع محول رافع <span class="ltr">Y/Δ</span> إلى <span class="ltr">22 kV</span>، ومتمماً فرقياً بمحولات تيار على بداية المجموعة ونهايتها، ومانعات صواعق على خطوط <span class="ltr">22 kV</span>. الشكل المطبوع لا يحتوي ذلك، فهذا مخطط خطي مقترح يتبع النص.</p>`,
   steps:['<b>المولد</b> <span class="ltr">G 3~ Y</span> بجهد <span class="ltr">6 kV</span>، ونقطة النجمة إلى الأرضي.','<b>محولا تيار</b>: واحد عند نقطة النجمة (نهايات الأوجه) وواحد عند أطراف المولد.','<b>المحول الرافع</b> <span class="ltr">Y/Δ</span> من <span class="ltr">6 kV</span> إلى <span class="ltr">22 kV</span>.','<b>المتمم الفرقي ΔI</b>: محول تيار ثانٍ بعد المحول، ومحولا التيار (أول المجموعة وآخرها) يوصلان بالتضاد إلى المتمم. أي خلل داخل المجموعة يجعل الفرق لا يساوي صفراً.','<b>مفتاح القدرة</b> على جهة <span class="ltr">22 kV</span>، والسهم من المتمم يعني أنه يفصل المجموعة كلياً من الشبكة.','قضبان <span class="ltr">22 kV</span> و<b>مانعات الصواعق</b> بين الخط والأرض.'],
   svg:i=>box(svgGT(i,true),300)})],
 quiz:[
  {q:'أي مما يلي خطأ <b>داخلي</b> في المولد؟',o:['قصر بين أوجه العضو الثابت','قصر في دائرة الحمل','زيادة الحمل على المولد','انعكاس القدرة الكهربية'],c:0,e:'القصر بين أوجه العضو الثابت يحدث داخل الآلة نفسها؛ والبقية أخطاء خارجية.'},
  {q:'ما المتمم المستخدم لحماية المولد ضد الأخطار الداخلية؟',o:['المتمم الفرقي','المتمم الحراري','مفتاح الفصل','مانع الصواعق'],c:0,e:'«ولحماية المولدات يتم استخدام المتمم الفرقي ضد الأخطار الداخلية».'},
  {q:'ما الذي يحمي المولد من زيادة الحمل؟',o:['المتمم الحراري','المتمم الفرقي','متمم الاتزان الحلقي','المصهر'],c:0,e:'«المتمم الحراري ضد زيادة الحمل».'},
  {q:'كيف توصل محولات التيار في وقاية مجموعة المولد والمحول الفرقية؟',o:['معاً بالتضاد','على التوازي مع الحمل','بلا اتصال','على التوالي مع البطارية'],c:0,e:'«بحيث توصل محولات التيار معاً بالتضاد».'},
  {q:'ماذا يفصل القاطع المغناطيسي في مفتاح وقاية الموصلات؟',o:['الموصل عند نشوء دائرة قصر','الموصل عند التحميل الزائد ببطء','الجهاز عند انتهاء العمل','لا يفصل'],c:0,e:'«ويفصل القاطع المغناطيسي الموصل عند نشوء دائرة قصر».'},
  {q:'هل يُستعمل مفتاح وقاية الموصلات لتشغيل الأجهزة وإطفائها يومياً؟',o:['لا، فهو ليس مفتاح أجهزة','نعم، هذا عمله الأساسي','نعم، مع الأجهزة الصغيرة فقط','نعم، في جهة الجهد العالي'],c:0,e:'«مفاتيح وقاية الموصلات لا تستعمل للتشغيل الاعتيادي للأجهزة عند الوصل والفصل، أي أنها ليست مفاتيح أجهزة».'}]
});

/* =====================================================================================
   7-7 Exercises (7-13 … 7-15) with suggested solutions drawn step by step
   ===================================================================================== */
function svg713(){const x=90;let s='';
 s+=T(100,16,'6000 V 3~ 60 Hz','',{fs:10.5})+ln(20,28,180,28,'tk')+nd(x,28,'')+ln(x,28,x,70,'')+tick(x,46,'3','');
 s+=sw(x,70,30,true,'')+ln(x-40,85,x-5.5,85,'dt')+opCB(x-48,85,'')+T(x-62,89,'Q1','',{a:'end',fs:10})+tick(x,92,'3','')+ln(x,100,x,150,'')+tick(x,128,'3','');
 s+=trSL(x,163,'D','Y','')+T(x-22,166,'6000 V','',{a:'end',fs:10})+T(x-22,184,'380 V','',{a:'end',fs:10})+ln(x,193.5,x,222,'')+tick(x,208,'4','');
 s+=sw(x,222,30,true,'')+ln(x-40,237,x-5.5,237,'dt')+opDS(x-48,237,'')+T(x-62,241,'Q1','',{a:'end',fs:10})+tick(x,244,'3','')+ln(x,252,x,262,'')+fuse(x,262,'',24)+T(x-14,278,'F1..3','',{a:'end',fs:10})+ln(x,286,x,316,'')+tick(x,300,'4','');
 s+=nd(x,316,'')+ln(20,316,180,316,'tk')+T(100,336,'380/220 V 3~/PE/N 60 Hz','',{fs:10});
 return SV('0 0 200 344',s,'الدائرة الخطية لمحول كهربائي')}
/* exercise 2 — suggested executive diagram of figure (7-13) */
function fEx2(){const X=[120,150,180],W=300;
 const st=[
  c=>T(160,12,'6000 V 3~ 60 Hz',c)+[0,1,2].map(i=>ln(40,24+i*10,280,24+i*10,c)+T(36,28+i*10,'L'+(i+1),c,{a:'end',fs:10})+nd(X[i],24+i*10,c)+ln(X[i],24+i*10,X[i],66,c)).join(''),
  c=>rc(102,60,96,42,'dd th '+cs(c))+X.map((x,i)=>sw(x,66,30,true,c)+T(x+6,72,['1','3','5'][i],c,{a:'start',fs:9})+T(x+6,95,['2','4','6'][i],c,{a:'start',fs:9})+ln(x,96,x,124,c)).join('')+ln(72,81,X[2]-5.5,81,'dt '+cs(c))+opCB(64,81,c)+T(46,85,'Q1',c,{a:'end',fs:10}),
  c=>X.map((x,i)=>T(x+7,124,['1U','1V','1W'][i],c,{a:'start',fs:8.5})).join('')+deltaRow(X,132,10,24,c)+X.map(x=>ln(x,124,x,132,c)).join('')+T(96,150,'6000 V',c,{a:'end',fs:9.5})
   +X.map((x,i)=>wd(x,184,10,24,c)+ln(x,208,x,236,c)+T(x+7,222,['2U','2V','2W'][i],c,{a:'start',fs:8.5})).join('')+ln(X[0],178,250,178,c)+X.map(x=>ln(x,178,x,184,c)).join('')+nd(250,178,c)+T(250,172,'PE/N',c,{fs:9})+ln(250,178,270,178,c)+earth(270,178,c)+T(96,200,'380 V',c,{a:'end',fs:9.5})+ln(250,178,250,350,'dd '+cs(c)),
  c=>X.map((x,i)=>sw(x,236,30,true,c)+T(x+6,242,['1','3','5'][i],c,{a:'start',fs:9})+T(x+6,265,['2','4','6'][i],c,{a:'start',fs:9})+ln(x,266,x,276,c)).join('')+ln(72,251,X[2]-5.5,251,'dt '+cs(c))+opDS(64,251,c)+T(46,255,'Q2',c,{a:'end',fs:10}),
  c=>X.map(x=>fuse(x,276,c,24)+ln(x,300,x,316,c)).join('')+T(98,292,'F1..3',c,{a:'end',fs:10}),
  c=>[0,1,2].map(i=>ln(40,330+i*10,280,330+i*10,c)+T(36,334+i*10,'L'+(i+1),c,{a:'end',fs:10})+ln(X[i],316,X[i],330+i*10,c)+nd(X[i],330+i*10,c)).join('')+ln(40,360,280,360,'dd '+cs(c))+ln(250,350,250,360,'dd '+cs(c))+nd(250,360,c)+T(36,364,'PE/N',c,{a:'end',fs:10})+T(160,380,'380/220 V 3~/PE/N 60 Hz',c)];
 return {st,W,H:388}}
const svgEx2=(k,hl)=>{const f=fEx2();return SV(`0 0 ${f.W} ${f.H}`,seq(f.st,f.st.map((_,i)=>[i]),k,hl),'حل مقترح: الدائرة التنفيذية للمحول')};
/* exercise 3 — completing (7-14): given = frame, HV bus, LV breaker, LV bus; then the missing sections + names */
const NAMES71=[[31,'شبكة الجهد العالي'],[96,'مفتاح الفصل'],[190,'مفتاح قدرة الجهد العالي'],[204,'ومحولات التيار والمرحلات'],[326,'المحول'],[450,'مفتاح قدرة الجهد المنخفض'],[566,'شبكة الجهد المنخفض']];
function svgEx3(k,hl){const f=f71x({});const nums=c=>X71.map((x,i)=>T(x+6,81,['1','3','5'][i],c,{a:'start',fs:9})+T(x+6,103,['2','4','6'][i],c,{a:'start',fs:9})).join('');
 const st=f.st.concat([nums,c=>NAMES71.map(([y,t])=>A(350,y+4,t,c,{fs:10})).join('')]);
 const G=[[0,1,5,6,7],[2],[3],[4],[8]];
 return SV('0 0 410 610',seq(st,G,k,hl),'حل مقترح: إكمال الدائرة التنفيذية للشكل (7-14)')}
const svg714given=()=>{const f=f71x({});const st=f.st.concat([c=>X71.map((x,i)=>T(x+6,81,['1','3','5'][i],c,{a:'start',fs:9})+T(x+6,103,['2','4','6'][i],c,{a:'start',fs:9})).join('')]);return SV('0 0 300 610',seq(st,[[0,1,5,6,7]],0,false),'الشكل (7-14): الدائرة التنفيذية الناقصة')};
/* figure (7-15) upright, book / corrected wiring */
function svg715(fixed){const P=[60,90,120],TN={N:30,U:70,V:100,W:130,A:175,C:205};let s='';
 s+=[['N',30],['L1',60],['L2',90],['L3',120]].map(([l,x])=>tm(x,16,'')+T(x,9,l,'',{fs:9.5})).join('');
 s+=ln(30,19,30,240,'ds')+rc(40,30,100,128,'dd th');
 P.forEach(x=>{s+=ln(x,19,x,44,'')+rc(x-10,44,20,14,'bg')+T(x,55,'I&gt;','',{fs:8.5})+ln(x,58,x,64,'')+rc(x-10,64,20,14,'bg')+thermal(x,73,'')+ln(x,78,x,94,'')+sw(x,94,30,true,'')+ln(x,124,x,168,'')});
 s+=ln(54.5,109,P[2]-5.5,109,'th')+ln(54.5,111,P[2]-5.5,111,'th')+ln(40,110,54,110,'th')+rc(20,104,12,12,'bg')+ln(20,110,8,110,'th');
 s+=nd(60,136,'')+nd(90,140,'')+ln(60,136,64,136,'th')+ln(86,140,90,140,'th')+rc(64,130,22,16,'bg')+T(75,142,'U&lt;','',{fs:8.5})+ln(75,130,75,111,'dt th');
 s+=ln(52,90,46,90,'dt th')+ln(52,68,46,68,'dt th')+ln(46,52,46,110,'dt th');
 P.forEach(x=>{s+=meter(x,178,'A','')+ln(x,187,x,206,'')});
 if(fixed)s+=nd(60,196,'')+nd(90,200,'')+nd(120,204,'')+pl([[60,196],[150,196],[150,176],[156,176]],'th')+pl([[90,200],[180,200],[180,176],[174,176]],'th')+meter(165,176,'V','')+pl([[180,200],[205,200],[205,176],[206,176]],'th')+pl([[120,204],[230,204],[230,176],[224,176]],'th')+meter(215,176,'Hz','');
 else s+=nd(90,166,'')+nd(90,192,'')+pl([[90,166],[160,166],[160,181]],'th')+pl([[90,192],[160,192],[160,199]],'th')+meter(160,190,'V','')+pl([[160,166],[205,166],[205,181]],'th')+pl([[160,192],[205,192],[205,199]],'th')+meter(205,190,'Hz','');
 const map=fixed?[['U',60],['V',90],['W',120]]:[['W',60],['V',90],['U',120]];
 map.forEach(([t,x])=>{s+=pl([[x,206],[x,214],[TN[t],226],[TN[t],240]],fixed?'':(t==='V'?'':'tr'))});
 Object.entries(TN).forEach(([l,x])=>{s+=tm(x,244,'')+T(x+8,240,l,'',{a:'start',fs:9})});
 s+=ln(30,247,108,292,'')+[70,100,130].map(x=>ln(x,247,x<100?112:x>100?148:130,x===100?270:280,'')).join('');
 s+=ci(130,300,32,'')+ci(130,300,24,'')+T(130,298,'G','',{fs:12})+T(130,312,'3~','',{fs:9.5})+rc(94,294,6,14,'F')+rc(160,294,6,14,'F');
 s+=pl([[97,308],[97,330],[175,330],[175,247]],'th')+pl([[163,294],[163,282],[190,282],[190,262],[205,262],[205,247]],'th');
 s+=rc(150,218,40,9,'bg')+ln(175,227,175,241,'th')+ln(205,241,205,234,'th')+pl([[205,234],[182,234],[182,229]],'th')+arrowU(182,227,'');
 return SV('0 0 240 340',s,'وقاية مولد كهربائي')}
function fig715Widget(el){let md='book';
 const draw=()=>{const bk=md==='book';
  el.innerHTML=`<div class="d7row"><span class="sub">الشكل (7-15):</span>${segHTML('m715',[['book','كما في الكتاب'],['fixed','المصحح']],md)}</div>${box(svg715(!bk),360)}<p class="d7cap"><b>الشكل (7-15)</b> وقاية مولد كهربائي <span class="ref">ص 163</span> — مطبوع في الكتاب مُداراً 90°، وأعدنا رسمه قائماً.</p>`+
   (bk?'<p class="sub">في الكتاب: الفولتميتر ومقياس التردد يأخذان طرفيهما من طرفي الأميتر الأوسط، والأطراف موصولة L1 → W وL3 → U (الخطان الأحمران).</p>'
    :'<div class="callout err"><span class="fixnote">الفولتميتر ومقياس التردد في الكتاب موصولان على طرفي الأميتر نفسه، أي على هبوط الجهد الصغير فيه، فلا يقيسان جهد المولد ولا تردده بشكل صحيح. الصحيح أن يوصل كل منهما بين وجهين: V بين L1 وL2، وHz بين L2 وL3. وصححنا ترتيب الأوجه: L1 → U، L2 → V، L3 → W.</span></div>');
  el.querySelectorAll('[data-m715]').forEach(b=>b.onclick=()=>{md=b.dataset.m715;draw()})};
 draw()}
/* exercise 4 — suggested single-line diagram of figure (7-15) */
function fEx4(){const x=100,W=240;
 const st=[
  c=>T(110,14,'L1 L2 L3 N  3/N ~',c,{fs:10.5})+ln(20,26,200,26,'tk '+cs(c))+nd(x,26,c)+ln(x,26,x,60,c)+tick(x,42,'4',c),
  c=>sw(x,60,30,true,c)+ln(x-40,75,x-5.5,75,'dt '+cs(c))+opCB(x-48,75,c)+T(x-62,79,'Q1',c,{a:'end',fs:10})+ln(x,90,x,140,c)+releaseSL(x,108,c,'3'),
  c=>nd(x,140,c)+ln(x,140,150,140,c)+tickH(130,140,'2',c)+rc(150,130,30,20,'bg '+cs(c))+T(165,144,'U&lt;',c,{fs:10})+pl([[165,130],[165,75],[x+6,75]],'dt '+cs(c)),
  c=>ln(x,140,x,236,c)+meter(x,170,'A',c)+T(x+14,166,'3',c,{a:'start',fs:9.5})+nd(x,200,c)+ln(x,200,170,200,c)+tickH(130,200,'2',c)+meter(180,200,'V',c)+nd(150,200,c)+ln(150,200,150,224,c)+meter(150,233,'Hz',c),
  c=>tick(x,250,'4',c)+ln(x,236,x,262,c)+T(x,262,'',c)+ci(x,290,26,'bg '+cs(c))+ci(x,290,19,cs(c))+T(x,288,'G',c,{fs:12})+T(x,301,'3~ Y',c,{fs:9}),
  c=>ln(x+26,290,170,290,cs(c))+rc(170,280,40,20,'bg '+cs(c))+ln(178,306,204,278,cs(c)+' th')+arrowU(204,276,c)+pl([[210,290],[222,290],[222,330],[x,330],[x,316]],cs(c))+T(190,322,'A',c,{fs:9.5})+T(232,294,'C',c,{fs:9.5})];
 return {st,W,H:344}}
const svgEx4=(k,hl)=>{const f=fEx4();return SV(`0 0 ${f.W} ${f.H}`,seq(f.st,f.st.map((_,i)=>[i]),k,hl),'حل مقترح: الدائرة الخطية للمولد')};
/* exercise 1 — 11/3.3 kV transformer: differential + earth-leakage protection, reading a (Δ/Δ) or b (<span class="ltr">Δ/Y</span>) */
function fEx1(rd){const X=[60,86,112],b=rd==='b',W=330;
 const st=[
  c=>T(86,12,'11 kV 3~',c,{fs:10.5})+X.map(x=>ln(x,18,x,36,c)+sw(x,36,26,true,c)+ln(x,62,x,128,c)).join('')+ln(54.5,49,X[2]-5.5,49,'dt '+cs(c))+rc(150,42,14,14,cs(c))+ln(112,49,150,49,'dt '+cs(c))+T(170,53,'Q1',c,{a:'start',fs:10})
   +X.map(x=>ln(x,212,x,350,c)+sw(x,350,26,true,c)+ln(x,376,x,396,c)).join('')+ln(54.5,363,X[2]-5.5,363,'dt '+cs(c))+rc(150,356,14,14,cs(c))+ln(112,363,150,363,'dt '+cs(c))+T(170,367,'Q2',c,{a:'start',fs:10})+T(86,410,'3.3 kV 3~',c,{fs:10.5})+(b?ln(140,200,140,396,'ds '+cs(c))+T(146,400,'N',c,{a:'start',fs:9.5}):''),
  c=>rc(40,116,120,98,'dd th '+cs(c))+deltaRow(X,134,10,20,c)+X.map(x=>ln(x,128,x,134,c)).join('')+T(150,146,'Δ',c,{fs:12})
   +(b?X.map(x=>wd(x,180,10,20,c)+ln(x,200,x,212,c)).join('')+ln(X[0],174,140,174,c)+X.map(x=>ln(x,174,x,180,c)).join('')+nd(140,174,c)+ln(140,174,140,200,c)+T(150,194,'Y',c,{fs:12})
       :deltaRow(X,180,10,20,c)+T(150,194,'Δ',c,{fs:12})),
  c=>{let s=ln(X[0]+8,70,X[2]+8,70,cs(c));X.forEach((x,i)=>{s+=wd(x,74,7,22,c)+rc(x+5,76,4,18,cs(c))+ln(x+7,70,x+7,76,cs(c))+pl([[x+7,94],[x+7,100+i*4],[200+i*12,100+i*4],[200+i*12,160]],cs(c)+' th')});
   s+=ln(X[0]+8,262,X[2]+8,262,cs(c));X.forEach((x,i)=>{s+=wd(x,232,7,22,c)+rc(x+5,234,4,18,cs(c))+ln(x+7,252,x+7,262,cs(c))+pl([[x+7,234],[x+7,226-i*4],[200+i*12,226-i*4],[200+i*12,b?210:200]],cs(c)+' th')});
   if(b)s+=X.map((x,i)=>wd(200+i*12,202,6,8,c)+ln(200+i*12,200,200+i*12,202,cs(c))).join('')+A(222,236,'محول مواءمة Δ',c,{fs:9});return s},
  c=>rc(190,160,58,40,'bg '+cs(c))+T(219,185,'ΔI',c,{fs:13})+T(256,158,'I1',c,{a:'start',fs:10})+T(256,212,'I2',c,{a:'start',fs:10})+pl([[248,170],[290,170],[290,49],[164,49]],'dt '+cs(c))+pl([[248,190],[300,190],[300,363],[164,363]],'dt '+cs(c)),
  c=>ci(b?100:86,300,b?52:40,cs(c))+ci(b?100:86,300,b?46:34,cs(c))+pa(`M${b?152:126} 292c6 0 6 5 0 5c6 0 6 5 0 5c6 0 6 5 0 5`,cs(c))+pl([[b?152:126,292],[214,292],[214,282]],cs(c)+' th')+pl([[b?152:126,307],[226,307],[226,282]],cs(c)+' th')+rc(206,252,40,30,'bg '+cs(c))+T(226,272,'ΣI',c,{fs:12})+pl([[246,267],[300,267]],'dt '+cs(c))
   +(b?ln(140,396,140,410,c)+earth(140,410,c):'')];
 return {st,W,H:430}}
const svgEx1=(rd,k,hl)=>{const f=fEx1(rd);return SV(`0 0 ${f.W} ${f.H}`,seq(f.st,[[0],[1],[2],[3],[4],[]],k,hl),'حل مقترح: وقاية محول 11/3.3 kV')};
const both=(i)=>`<div class="r7a">${box(svgEx1('a',i,true),380)}</div><div class="r7b">${box(svgEx1('b',i,true),380)}</div>`;

B.lesson({
 id:'u7-l6',unit:7,order:6,pages:'160–163',
 title:'تمارين الوحدة السابعة',
 summary:'أربعة تمارين: وقاية محول <span class="ltr">11/3.3 kV</span>، ورسم الدائرة التنفيذية لمحول من دائرته الخطية، وإكمال دائرة محطة المحولات، ورسم الدائرة الخطية لمولد بقاطع ومتمم هبوط جهد وأجهزة قياس — مع حلول مقترحة مرسومة خطوة بخطوة.',
 stations:[
  {intro:true},

  {st:1,short:'التمرين (1)',title:'التمرين (1): حماية محول 11/3.3 kV من التسرب الأرضي والقصر',ref:'ص 160',
   q:'خطران مختلفان: قصر داخل المحول وتسرب إلى الأرض… هل تكفيهما وقاية واحدة؟',
   art:DRA.art({aria:'محول ثلاثي الأوجه: الابتدائي 11 كيلو فولت مثلث، والثانوي 3.3 كيلو فولت مثلث أو نجمة حسب القراءة',bg:'#E4ECF6',
    extra:`<circle cx="180" cy="120" r="44" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><circle cx="180" cy="180" r="44" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M180 98L199 132H161Z" fill="none" stroke="#2C4A40" stroke-width="2.6"/><text x="180" y="196" text-anchor="middle" font-size="26" font-weight="700" fill="#B8322A">?</text><path d="M180 40V76M180 224V262" stroke="#2C4A40" stroke-width="3"/><text x="232" y="62" font-size="13" fill="#2C4A40" font-family="var(--mono)">11 kV</text><text x="232" y="256" font-size="13" fill="#2C4A40" font-family="var(--mono)">3.3 kV</text>`+DRA.L(180,294,'الثانوي: دلتا أم نجمة؟',13.5,700)
     +'<rect x="130" y="72" width="100" height="72" rx="8" fill="transparent" data-tip="الابتدائي: مثلث (دلتا) بجهد ⟦11 kV⟧."/><rect x="130" y="144" width="100" height="80" rx="8" fill="transparent" data-tip="الثانوي ⟦3.3 kV⟧: النص يقول «دلتا / دلتا» والرمز بجانبه ⟦(Δ /Y)⟧؛ لذلك نعرض القراءتين."/>'}),
   cap:'<b>مرّر المؤشر على الملفين (أو المسهما في الجوال) لتعرف معناهما.</b>',
   side:[{predict:{q:'أي وقاية من الدرس تناسب القصر داخل المحول؟',opts:[
     ['مفتاح وقاية الموصلات 16 A',false,'هذا لدوائر المقابس الصغيرة.'],
     ['الوقاية الفرقية',true,'تعمل عند ΔI ≠ 0، أي عند عطل داخل المحول (الشكل 7-9).'],
     ['مفتاح الفصل',false,'لا يقطع تياراً.']]}}],
   body:[
    {book:'<p>(1) محول القدرة الكهربائية ثلاثي الأوجه دلتا / دلتا <span class="ltr">(Δ /Y)</span> يراد حمايته من خطر التسرب الأرضي والقصر إذا علم أن جهد الملف الابتدائي 11 ك. ف وجهد الملف الثانوي 3.3 ك.ف</p>',ref:'ص 160'},
    {watch:'<p>نص التمرين يقول «دلتا / دلتا» والرمز بجانبه <span class="ltr">(Δ /Y)</span>، فلا يُعرف أي التوصيلين مقصود. لم نختر واحداً: الحل المقترح في «الأمثلة المحلولة» مرسوم بالقراءتين.</p>',fix:true},
    {html:`<div class="callout">${r7ctl()}<span class="sub">القراءة الأولى: الملفان مثلث (دلتا / دلتا). القراءة الثانية: الابتدائي مثلث والثانوي نجمة (<span class="ltr">Δ/Y</span>). يتغير الرسم في «الأمثلة المحلولة» حسب اختيارك.</span></div>`},
    {tip:'<p>استعمل ما في الدرس: <b>الوقاية الفرقية</b> (الشكل 7-9) ضد القصر داخل المحول، و<b>الوقاية بالاتزان</b> بحلقة حديدية (الشكل 7-10) ضد التسرب الأرضي.</p>',title:'من أين تبدأ؟'},
    {title:'مختبر مصغّر: اختر الوقاية',widget:(el,B)=>DCML.cases(el,B,{cases:[
     {q:'أي وقاية تناسب التسرب الأرضي؟',opts:[['التدرج الزمني',false,'هذا للانتقائية في الشبكة الشعاعية.'],['الوقاية بالاتزان (الحلقة الحديدية)',true,'تكشف اتصال أحد الأوجه بالأرض (7-10).'],['الوقاية الحرارية',false,'للتحميل الزائد.']]},
     {q:'في القراءة الثانية (Δ/Y)، ماذا نضيف على جهة النجمة لكي يعمل المرحل الفرقي سليماً؟',opts:[['محول مواءمة موصلاً مثلثاً',true,'كما في الشكل (7-9): يعوّض اختلاف الطور بين الجهتين.'],['مصهراً',false,'لا علاقة له بتساوي التيارين.']]}]})}
   ]},

  {st:2,short:'التمرين (2)',title:'التمرين (2): الدائرة التنفيذية لمحول من دائرته الخطية (الشكل 7-13)',ref:'ص 160',
   q:'الشرطة قبل المحول «3» وبعده «4»… من أين جاء الموصل الرابع؟',
   art:DRA.art({aria:'الشكل 7-13: الدائرة الخطية لمحول 6000 فولت إلى 380 فولت',
    parts:[{svg:svg713(),box:[60,8,240,296],tips:[
     [20,8,160,30,'قضبان ⟦6000 V 3~ 60 Hz⟧.'],
     [30,66,70,40,'⟦Q1⟧ بذراع ⊞: مفتاح قدرة.'],
     [64,146,52,52,'المحول: العليا △ (مثلث، ⟦6000 V⟧) والسفلى ⅄ (نجمة، ⟦380 V⟧).'],
     [84,200,30,18,'الشرطة 4: ثلاثة أوجه وموصل من نقطة النجمة.'],
     [30,218,70,40,'المفتاح الثاني بذراع |-∨ (مكتوب عليه ⟦Q1⟧ أيضاً).'],
     [70,260,40,30,'المصاهر ⟦F1..3⟧.']]}]}),
   cap:'<b>مرّر المؤشر على القضبان والمفتاحين والمحول والشرطة والمصاهر (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[{predict:{q:'لماذا تصبح الشرطة بعد المحول «4» بعد أن كانت «3»؟',opts:[
     ['لأن الجهد ارتفع',false,'المحول هنا خافض.'],
     ['لأن المصاهر أربعة',false,'المصاهر ثلاثة F1..3.'],
     ['لأن الثانوي نجمة يخرج منه موصل التعادل',true,'ثلاثة أوجه وموصل رابع من نقطة النجمة (PE/N).']]}}],
   body:[
    {book:'<p>(2) الشكل (7-13) يبين الدائرة الخطية لمحول كهربائي بالرموز المختصرة والمطلوب رسم الدائرة التنفيذية مع رموز التوصيل والمصطلحات الفعلية.</p>',ref:'ص 160'},
    {watch:'<p>عنوان الشكل (7-13) في الكتاب «الدائرة التنفيذية لمحول كهربائي»، والمرسوم دائرة خطية كما يقول نص التمرين. والمفتاحان على جانبي المحول يحملان الاسم نفسه Q1؛ في الحل المقترح سمّينا الثاني Q2.</p>',fix:true},
    {tip:'<p>كل رمز في الخطي يصبح في التنفيذي ثلاثة (أو أربعة) أسلاك: القضبان L1 L2 L3، والمفتاح بثلاثة تلامسات وأرقام 1–6، والمحول بملفاته الستة، ثم القضبان السفلى ومعها PE/N. الحل المقترح خطوة بخطوة في «الأمثلة المحلولة».</p>',title:'من الخطي إلى التنفيذي'},
    {title:'مختبر مصغّر: اقرأ الرموز',widget:(el,B)=>DCML.tf(el,B,{items:[
     ['الرمز △ في الدائرة العليا للمحول يعني أن الابتدائي مثلث.',true,'جهة 6000 V.'],
     ['الشرطة 3 فوق المحول تعني ثلاثة محولات.',false,'تعني ثلاثة موصلات.'],
     ['في التنفيذي يُرسم المفتاح ذو الذراع ⊞ بثلاثة تلامسات.',true,'لأن الخط الواحد يمثل ثلاثة موصلات.']]})}
   ]},

  {st:3,short:'التمرين (3)',title:'التمرين (3): إكمال الدائرة التنفيذية لمحطة المحولات (الشكل 7-14)',ref:'ص 161',
   q:'أي الأقسام مرسومة، وأيها عليك أن تضيفه؟',
   art:DRA.art({aria:'الشكل 7-14: الدائرة التنفيذية ناقصة، وجزء المحول من الدائرة الخطية',bg:'#F7DCC8',
    parts:[{svg:svg714given(),vb:'20 0 280 610',box:[20,6,150,284],tips:[[30,0,260,62,'المعطى: قضبان ⟦13.8 kV⟧ في الأعلى.'],[30,62,260,330,'فراغ: مفتاح الفصل ومفتاح قدرة الجهد العالي والمحول — المطلوب إكمالها.'],[30,392,260,130,'المعطى: مفتاح قدرة الجهد المنخفض مرسوم كاملاً.'],[30,522,260,80,'المعطى: قضبان الجهد المنخفض.']]},
           {svg:svg71l(null,false,{v15:true}),vb:'10 262 190 130',box:[186,90,160,110],tips:[[90,276,100,44,'في الخطي كُتب الجهد الابتدائي ⟦15000V⟧ بينما القضبان ⟦13.8 kV⟧.']]}],
    extra:DRA.L(95,306,'التنفيذية (ناقصة)',12,700)+DRA.L(266,214,'من الخطية: المحول',12,700)}),
   cap:'<b>مرّر المؤشر على أجزاء الورقة (أو المسها في الجوال) لتعرف ما هو معطى وما هو مطلوب.</b>',
   side:[{predict:{q:'على نمط أي شكل في الدرس تُكمل هذه الدائرة؟',opts:[
     ['الشكل (7-1) محطة المحولات',true,'الأقسام نفسها: الفصل، قدرة الجهد العالي، المحول، قدرة الجهد المنخفض.'],
     ['الشكل (7-9) الوقاية الفرقية',false,'لا يوجد مرحل فرقي في الخطي المعطى.'],
     ['الشكل (7-12) وقاية الموصلات',false,'ذاك مفتاح أحادي القطب لمقبس.']]}}],
   body:[
    {book:'<p>(3) الشكل (7-14) يوضح الدائرة الخطية لمحول كهربائي موضحة مكوناته مع أجهزة الوقاية الخاصة بالضغط العالي والمنخفض، والمطلوب تكملة رسم الدائرة التنفيذية وكتابة البيانات التوضيحية أمام كل من المكونات والمصطلحات الفنية المختلفة.</p>',ref:'ص 161'},
    {watch:'<p>في الدائرة الخطية للشكل (7-14) الجهد الابتدائي مكتوب «15000v» بينما القضبان <span class="ltr">13.8 kV</span> (وفي الشكل 7-1 كُتب 13800v)؛ رسمناه كما طُبع، والحل المقترح يكمل الدائرة على <span class="ltr">13.8 kV</span>.</p>',fix:true},
    {title:'مختبر مصغّر: رتّب ما تضيفه',widget:(el,B)=>DCML.order(el,B,{intro:'اضغط الأقسام الناقصة بالترتيب من الأعلى إلى الأسفل.',steps:[
     ['مفتاح الفصل: ثلاثة تلامسات وذراع يدوي','أول قسم تحت القضبان.'],['مفتاح قدرة الجهد العالي مع محولات التيار والمرحلات','بعد مفتاح الفصل.'],['المحول: 1U 1V 1W نجمة، و2U 2V 2W زجزاج، ونقطة النجمة إلى PE','قبل مفتاح قدرة الجهد المنخفض المعطى.'],['البيانات أمام كل قسم','بعد اكتمال الرسم.']]})}
   ]},

  {st:4,short:'التمرين (4)',title:'التمرين (4): الدائرة الخطية لمولد بقاطع ومتمم هبوط جهد (الشكل 7-15)',ref:'ص 162–163',
   q:'أين توصل الفولتميتر لتقيس جهد المولد؟',
   art:DRA.art({aria:'الشكل 7-15 كما في الكتاب معاداً رسمه قائماً: وقاية مولد كهربائي',
    parts:[{svg:svg715(false),box:[50,6,260,300],tips:[
     [40,30,100,128,'القاطع الأوتوماتيكي: لكل وجه ⟦I>⟧ (مغناطيسي) وحراري ثم تلامس.'],
     [62,128,26,20,'متمم هبوط الجهد ⟦U<⟧ بين ⟦L1⟧ و⟦L2⟧، يفصل القاطع.'],
     [48,166,84,24,'ثلاثة أميترات ⟦A⟧ على التوالي في الأوجه.'],
     [148,176,72,26,'الفولتميتر ومقياس التردد: في الكتاب على طرفي الأميتر الأوسط (خطأ).'],
     [24,236,190,16,'أطراف المولد ⟦N⟧ ⟦U⟧ ⟦V⟧ ⟦W⟧ ⟦A⟧ ⟦C⟧.'],
     [96,266,68,68,'المولد ⟦G 3~⟧.'],
     [148,214,46,16,'المقاومة المتغيرة في دائرة الأقطاب (بين ⟦A⟧ و⟦C⟧).']]}]}),
   cap:'رسم الكتاب (مطبوع مُداراً 90°، أعدنا رسمه قائماً).<br><b>مرّر المؤشر على القاطع والمتمم وأجهزة القياس والمولد (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[{predict:{q:'كيف يجب أن يُوصل الفولتميتر في دائرة المولد؟',opts:[
     ['على طرفي الأميتر',false,'هكذا يقيس هبوط الجهد الصغير في الأميتر فقط (كما في الشكل المطبوع).'],
     ['بين وجهين',true,'فيقيس جهد الخط للمولد.'],
     ['على التوالي في وجه',false,'هكذا يوصل الأميتر لا الفولتميتر.']]}}],
   body:[
    {book:'<p>(4) الشكل (7-15) يوضح الدائرة التنفيذية لمولد تيار متغير ثلاثي الأوجه موصل نجمة Y، ويتم التحكم في جهد المولد المتغير بمقاومة متغيرة موصلة بالتوالٍ مع الأقطاب، والمولد متصل بقاطع أوتوماتيكي ثلاثي الأوجه مزود بحماية حرارية وأخرى مغناطيسية ضد زيادة الحمل، مع متمم مغناطيسي ضد هبوط الجهد مع رسم أجهزة قياس (التيار- الجهد – التردد). والمطلوب: رسم الدائرة الخطية لهذا المولد.</p>',ref:'ص 162'},
    {title:'جرّب الرسم: كما في الكتاب / المصحح',widget:(el,B)=>fig715Widget(el)},
    {tip:'<p>في الشكل (7-15) لا يظهر من أين تتغذى دائرة الأقطاب (الطرفان A وC) بالتيار المستمر؛ والمقاومة المتغيرة على التوالي فيها تغيّر تيار الأقطاب فيتغير جهد المولد. الحل المقترح للدائرة الخطية في «الأمثلة المحلولة».</p>',title:'دائرة الأقطاب'},
    {title:'مختبر مصغّر: صح أم خطأ؟',widget:(el,B)=>DCML.tf(el,B,{items:[
     ['متمم هبوط الجهد U< يفصل القاطع إذا هبط الجهد.',true,'«متمم مغناطيسي ضد هبوط الجهد».'],
     ['الأميتر يوصل بين وجهين.',false,'الأميتر على التوالي في الوجه.'],
     ['في الخطي يُرسم الأميتر مرة واحدة وبجانبه 3.',true,'الرقم يبين أن في كل وجه أميتراً.']]})}
   ]},

  {recap:[
   'التمرين (1): وقاية فرقية ضد القصر الداخلي ووقاية بالاتزان ضد التسرب الأرضي؛ والحل بالقراءتين Δ/Δ و Δ/Y.',
   'التمرين (2): من الخطي إلى التنفيذي؛ الشرطة 4 بعد المحول لأن الثانوي نجمة يخرج منه PE/N.',
   'التمرين (3): أكمل على نمط الشكل (7-1): مفتاح فصل، مفتاح قدرة بمحولات تيار، المحول.',
   'التمرين (4): الفولتميتر ومقياس التردد بين وجهين، لا على طرفي الأميتر كما في الشكل المطبوع.']}
],
 theory:[
  {h:'7-7 تمارين',ref:'ص 160',html:`<p>(1) محول القدرة الكهربائية ثلاثي الأوجه دلتا / دلتا <span class="ltr">(Δ /Y)</span> يراد حمايته من خطر التسرب الأرضي والقصر إذا علم أن جهد الملف الابتدائي ${lt('11')} ك. ف وجهد الملف الثانوي ${lt('3.3')} ك.ف</p>`},
  {html:`<div class="callout"><span class="fixnote">نص التمرين يقول «دلتا / دلتا» والرمز بجانبه <span class="ltr">(Δ /Y)</span>، فلا يُعرف أي التوصيلين مقصود. لم نختر واحداً: رسمنا الحل المقترح بالقراءتين.</span>${r7ctl()}<span class="sub">القراءة الأولى: الملفان مثلث (دلتا / دلتا). القراءة الثانية: الابتدائي مثلث والثانوي نجمة (<span class="ltr">Δ/Y</span>). يتغير الرسم في «الأمثلة المحلولة» حسب اختيارك.</span></div>`},
  {html:'<p>(2) الشكل (7-13) يبين الدائرة الخطية لمحول كهربائي بالرموز المختصرة والمطلوب رسم الدائرة التنفيذية مع رموز التوصيل والمصطلحات الفعلية.</p>'},
  {fig:'(7-13)',ref:'ص 160',caption:'الدائرة الخطية لمحول كهربائي.',draw:()=>box(svg713(),230)},
  {err:'عنوان الشكل (7-13) في الكتاب «الدائرة التنفيذية لمحول كهربائي»، والمرسوم دائرة خطية كما يقول نص التمرين. والمفتاحان على جانبي المحول يحملان الاسم نفسه Q1؛ في الحل المقترح سمّينا الثاني Q2.'},
  {html:'<p>(3) الشكل (7-14) يوضح الدائرة الخطية لمحول كهربائي موضحة مكوناته مع أجهزة الوقاية الخاصة بالضغط العالي والمنخفض، والمطلوب تكملة رسم الدائرة التنفيذية وكتابة البيانات التوضيحية أمام كل من المكونات والمصطلحات الفنية المختلفة.</p>'},
  {fig:'(7-14)',ref:'ص 161',caption:'الدائرة التنفيذية (ناقصة) والخطية لمحول كهربائي.',draw:()=>fig2(`<div>${box(svg71l(null,false,{v15:true}),220)}${cap('الدائرة الخطية')}</div>`,`<div>${box(svg714given(),330)}${cap('الدائرة التنفيذية — المطلوب إكمالها')}</div>`)},
  {err:'في الدائرة الخطية للشكل (7-14) الجهد الابتدائي مكتوب «15000v» بينما القضبان <span class="ltr">13.8 kV</span> (وفي الشكل 7-1 كُتب 13800v)؛ رسمناه كما طُبع هنا، والحل المقترح يكمل الدائرة على <span class="ltr">13.8 kV</span>.'},
  {html:'<p>(4) الشكل (7-15) يوضح الدائرة التنفيذية لمولد تيار متغير ثلاثي الأوجه موصل نجمة Y، ويتم التحكم في جهد المولد المتغير بمقاومة متغيرة موصلة بالتوالٍ مع الأقطاب، والمولد متصل بقاطع أوتوماتيكي ثلاثي الأوجه مزود بحماية حرارية وأخرى مغناطيسية ضد زيادة الحمل، مع متمم مغناطيسي ضد هبوط الجهد مع رسم أجهزة قياس (التيار- الجهد – التردد). والمطلوب: رسم الدائرة الخطية لهذا المولد.</p>'},
  {widget:el=>fig715Widget(el)},
  {note:`${TIP}في الشكل (7-15) لا يظهر من أين تتغذى دائرة الأقطاب (الطرفان A وC) بالتيار المستمر؛ والمقاومة المتغيرة على التوالي فيها تغيّر تيار الأقطاب فيتغير جهد المولد.`},
  {note:'الحلول المقترحة للتمارين الأربعة مرسومة خطوة بخطوة في تبويب «الأمثلة المحلولة» (ليست من الكتاب؛ الكتاب لا يعطي إجابات).'}
 ],
 examples:[
  {title:'التمرين (1): وقاية محول <span class="ltr">11/3.3 kV</span> من التسرب الأرضي والقصر',ref:'ص 160',
   q:`<p>${SOLT}محول ثلاثي الأوجه، الابتدائي ${lt('11 kV')} والثانوي ${lt('3.3 kV')}، يراد حمايته من التسرب الأرضي والقصر.</p>${r7ctl()}<p class="sub">نستعمل ما في الدرس: <b>الوقاية الفرقية</b> (الشكل 7-9) ضد القصر داخل المحول، و<b>الوقاية بالاتزان</b> بحلقة حديدية (الشكل 7-10) ضد التسرب الأرضي.</p>`,
   solve:()=>[
    {t:'<p>خطوط الجهد العالي <span class="ltr">11 kV</span> بمفتاح القدرة <b>Q1</b>، وخطوط <span class="ltr">3.3 kV</span> بمفتاح القدرة <b>Q2</b>، ولكل مفتاح ملف فصل. <span class="r7b">في القراءة الثانية يخرج من نقطة النجمة موصل التعادل N.</span></p>'+both(0)},
    {t:'<p>ملفات المحول: <span class="r7a">الابتدائي مثلث والثانوي مثلث (دلتا / دلتا).</span><span class="r7b">الابتدائي مثلث، والثانوي نجمة ونقطتها موصلة بالموصل N.</span></p>'+both(1)},
    {t:`<p>محولات التيار على الجهتين، وثانوياتها نجمة. <span class="r7a">في دلتا / دلتا لا فرق في الطور بين الجهتين، فيكفي أن تُختار نسبتا محولي التيار بحسب ${lt('11/3.3')} حتى يتساوى التياران الذاهبان إلى المرحل.</span><span class="r7b">في <span class="ltr">Δ/Y</span> يختلف الطور بين الجهتين، فنضع على جهة النجمة <b>محول مواءمة</b> موصلاً مثلثاً كما في الشكل (7-9).</span></p>`+both(2)},
    {t:'<p><b>المرحل الفرقي ΔI</b>: يدخله I1 من محولات التيار العلوية وI2 من السفلية، ومنه خطان منقطان إلى ملفي فصل Q1 وQ2. يعمل عند القصر داخل المحول (ΔI ≠ 0).</p>'+both(3)},
    {t:'<p><b>الوقاية من التسرب الأرضي</b>: حلقة حديدية عليها ملف ثانوي يغذي متمماً (ΣI) يفصل المفتاحين. <span class="r7a">تمر في الحلقة الأوجه الثلاثة. ملاحظة: في دلتا / دلتا لا توجد عند المحول نقطة نجمة مؤرضة، فتيار التسرب يكون صغيراً إلا إذا كانت الشبكة مؤرضة في مكان آخر (توضيح).</span><span class="r7b">تمر في الحلقة الأوجه الثلاثة وموصل N، ونقطة النجمة مؤرضة أسفل الرسم؛ فأي تسرب إلى الأرض يعود من خارج الحلقة فيختل الاتزان.</span></p>'+both(4)},
    {t:'<p>اكتمل الحل المقترح. بدّل بين القراءتين (أعلى المثال) لترى الفرق: ملفات الثانوي، ومحول المواءمة، وموصل N في الحلقة.</p>'+both(5),final:true}]},
  drawEx({title:'التمرين (2): الدائرة التنفيذية للمحول في الشكل (7-13)',ref:'ص 160',
   q:`<p>${SOLT}ارسم الدائرة التنفيذية للدائرة الخطية في الشكل (7-13) مع رموز التوصيل والمصطلحات.</p>`,
   steps:['قضبان الجهد العالي L1 وL2 وL3: <span class="ltr">6000 V 3~ 60 Hz</span> (الشرطة 3 = ثلاثة موصلات).','مفتاح القدرة <b>Q1</b> ثلاثي الأقطاب (ذراع ⊞) بأطرافه 1–6.','المحول: الابتدائي <b>مثلث</b> (الرمز △) على <span class="ltr">6000 V</span>، والثانوي <b>نجمة</b> (⅄) على <span class="ltr">380 V</span>؛ نقطة النجمة تُؤرَّض وتخرج منها PE/N، لذلك صارت الشرطة بعد المحول 4.','المفتاح الثاني (ذراعه |-∨، سميناه Q2) ثلاثي الأقطاب.','المصاهر <b>F1..3</b>.','قضبان الجهد المنخفض L1 وL2 وL3 وPE/N: <span class="ltr">380/220 V 3~/PE/N 60 Hz</span>.'],
   svg:i=>box(svgEx2(i,true),340)}),
  drawEx({title:'التمرين (3): إكمال الدائرة التنفيذية للشكل (7-14)',ref:'ص 161',
   q:`<p>${SOLT}أكمل الدائرة التنفيذية للشكل (7-14) على نمط الشكل (7-1)، واكتب البيانات أمام كل مكوّن.</p>`,
   steps:['المعطى في الكتاب: قضبان <span class="ltr">13.8 kV</span>، وأرقام أطراف المفتاح العلوي، ومفتاح قدرة الجهد المنخفض، وقضبان <span class="ltr">380/220 V</span>.','نضيف <b>مفتاح الفصل</b>: ثلاثة تلامسات بين 1-2 و3-4 و5-6 وذراع يدوي.','نضيف <b>مفتاح قدرة الجهد العالي</b> بإطاره وذراعه ⊞، و<b>محولات التيار</b> الثلاثة و<b>المرحلات</b> التي تفصله.','نضيف <b>المحول</b>: 1U 1V 1W نجمة، و2U 2V 2W زجزاج، ونقطة النجمة إلى PE والأرضي، وبياناته <span class="ltr">13800 V ±4 % · 100 kVA · 60 Hz · 400/231 V</span>.','نكتب أسماء الأقسام أمامها.'],
   svg:i=>box(svgEx3(i,true),440,400)}),
  drawEx({title:'التمرين (4): الدائرة الخطية للمولد في الشكل (7-15)',ref:'ص 162–163',
   q:`<p>${SOLT}ارسم الدائرة الخطية لمولد ثلاثي الأوجه نجمة، بقاطع أوتوماتيكي حراري ومغناطيسي، ومتمم هبوط جهد، وأجهزة قياس التيار والجهد والتردد، ومقاومة متغيرة في دائرة الأقطاب.</p>`,
   steps:['أطراف الشبكة L1 وL2 وL3 وN: خط واحد بشرطة 4.','<b>القاطع الأوتوماتيكي Q1</b> ثلاثي الأوجه، ومعه رمز الحماية الحرارية (⊓) والمغناطيسية (السهم).','<b>متمم هبوط الجهد</b> <span class="ltr">U&lt;</span> يأخذ جهده بين وجهين (شرطة 2) ويفصل Q1 (الخط المنقط).','أجهزة القياس: <b>أميتر</b> في كل وجه (3)، و<b>فولتميتر</b> و<b>مقياس تردد</b> كل منهما بين وجهين (شرطة 2) — لا على طرفي الأميتر كما في الشكل المطبوع.','<b>المولد</b> <span class="ltr">G 3~ Y</span> بشرطة 4 (ثلاثة أوجه ونقطة النجمة N).','دائرة الأقطاب: من الطرف A إلى الطرف C عبر <b>المقاومة المتغيرة</b> على التوالي.'],
   svg:i=>box(svgEx4(i,true),300)})],
 quiz:[
  {q:'في التمرين (1) يُطلب حماية المحول من التسرب الأرضي والقصر. أي وقاية من الدرس تناسب القصر داخل المحول؟',o:['الوقاية الفرقية','مفتاح وقاية الموصلات 16 A','المصهر وحده','مفتاح الفصل'],c:0,e:'الوقاية الفرقية (7-9) تعمل عند ΔI ≠ 0، أي عند عطل داخل المحول.'},
  {q:'وأي وقاية تناسب التسرب الأرضي؟',o:['الوقاية بالاتزان (الحلقة الحديدية)','الوقاية الحرارية','مانع الصواعق','التدرج الزمني'],c:0,e:'الوقاية بالاتزان (7-10) تكشف اتصال أحد الأوجه بالأرض.'},
  {q:'في الشكل (7-13) رمز المحول △ فوق و⅄ تحت. ماذا يعني؟',o:['الابتدائي مثلث والثانوي نجمة','الابتدائي نجمة والثانوي مثلث','الملفان نجمة','الملفان مثلث'],c:0,e:'الدائرة العليا لجهة 6000 V (مثلث) والسفلى لجهة 380 V (نجمة).'},
  {q:'لماذا تصبح الشرطة بعد المحول في الشكل (7-13) «4» بعد أن كانت «3»؟',o:['لأن الثانوي نجمة يخرج منه موصل التعادل','لأن الجهد ارتفع','لأن المحول أحادي الوجه','لأن المصاهر أربعة'],c:0,e:'الثانوي النجمة يعطي ثلاثة أوجه وموصلاً رابعاً من نقطة النجمة (PE/N).'},
  {q:'كيف يجب أن يُوصل الفولتميتر في دائرة المولد (الشكل 7-15)؟',o:['بين وجهين','على طرفي الأميتر','على التوالي في وجه','بين الطرفين A وC'],c:0,e:'الكتاب يوصله على طرفي الأميتر، وهذا يقيس هبوط الجهد في الأميتر فقط؛ الصحيح بين وجهين.'},
  {q:'ما وظيفة متمم هبوط الجهد U< في التمرين (4)؟',o:['يفصل القاطع إذا هبط الجهد','يرفع الجهد','يقيس التردد','يحمي من القصر فقط'],c:0,e:'«متمم مغناطيسي ضد هبوط الجهد»: عند هبوط الجهد يفصل القاطع.'}]
});
})(PLCBOOK);
