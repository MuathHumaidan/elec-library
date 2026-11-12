/* Unit 4 — تغذية المصانع وشبكات التوزيع (ص 81–99) — الأسلوب الرسمي */
(function(B){
"use strict";
/* أعطال «اكتشف العطل» المخفية (challenge.js): false دائماً خارج وضع التحدي */
const chF=f=>!!(B.chF&&B.chF(f));
/* =====================================================================
   CSS (مرة واحدة) — كل الألوان من متغيرات الصفحة فتعمل في الوضع الليلي
   ===================================================================== */
const CSS=`
.d4 .ln{stroke:var(--fg);stroke-width:1.8;fill:none;stroke-linecap:round;stroke-linejoin:round}
.d4 .ln.thin{stroke-width:1.2}
.d4 .ln.bus{stroke-width:3.4}
.d4 .ln.dash{stroke-dasharray:3 3}
.d4 .ln.dd{stroke-dasharray:10 4 2 4}
.d4 .ln.gray{stroke:var(--muted)}
.d4 .ln.on{stroke:var(--live)}
.d4 .ln.off{stroke:var(--muted);opacity:.5}
.d4 .ln.trip{stroke:var(--stop);opacity:1}
.d4 .ln.pe{stroke:var(--on)}
.d4 .fl{fill:var(--fg)}.d4 .fl.on{fill:var(--live)}.d4 .fl.off{fill:var(--muted);opacity:.5}
.d4 .bg{fill:var(--surface)}
.d4 .wall{fill:url(#d4hatch);stroke:var(--fg);stroke-width:1.2}
.d4 .wall2{fill:var(--surface);stroke:var(--fg);stroke-width:1.2}
.d4 .hatch{stroke:var(--muted);stroke-width:1}
.d4 .knob{stroke:var(--muted);stroke-width:3;fill:none;stroke-linecap:round}
.d4 .ring{fill:var(--surface);stroke:var(--muted);stroke-width:1.6}
.d4 .band{fill:var(--fg)}
.d4 .nw .ln{stroke:var(--blue)}.d4 .nw .fl{fill:var(--blue)}.d4 .nw .txt{fill:var(--blue-ink)}.d4 .nw .ln.bus{stroke:var(--blue)}
.d4 .hit{fill:transparent;cursor:pointer;stroke:none}
.d4 .hit:hover{fill:var(--blue);fill-opacity:.10}
.d4 .hitl{stroke:transparent;stroke-width:14;fill:none;cursor:pointer;pointer-events:stroke}
.d4 .hitl:hover{stroke:var(--blue);stroke-opacity:.15}
.d4 .selr{fill:var(--blue);fill-opacity:.16;stroke:var(--blue);stroke-width:1.6;stroke-dasharray:4 3}
.d4 .okr{fill:var(--on);fill-opacity:.18;stroke:var(--on);stroke-width:1.6}
.d4 .badr{fill:var(--stop);fill-opacity:.15;stroke:var(--stop);stroke-width:1.6}
.d4 .glow{fill:#ffd36b;opacity:.75}
.d4 .hot{fill:var(--stop-soft)}
.d4 .runbg{fill:var(--on-soft)}
.d4 .flt{fill:var(--stop)}
.d4 .ann{fill:var(--muted)}
.d4card{border:1px solid var(--line);border-radius:12px;padding:10px 14px;background:var(--surface-2);margin-top:10px;font-size:14.5px;line-height:1.8;min-height:64px}
.d4card h3{font-size:15.5px;margin:0 0 4px}
.d4card .ref{margin-inline-start:6px}
.d4row{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:8px}
.d4mt{display:grid;gap:8px;margin-top:10px}
.d4mt .it{border:1px solid var(--line);border-radius:10px;padding:8px 10px;background:var(--surface)}
.d4mt .it.ok{border-color:var(--on);background:var(--on-soft)}
.d4mt .it.no{border-color:var(--stop);background:var(--stop-soft)}
.d4mt .it p{margin:0 0 6px}
.d4mt .seg{flex-wrap:wrap}
.d4mt .seg button{padding:4px 12px}
.d4st{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
.d4st span{font-size:13px;border-radius:999px;padding:2px 10px;border:1px solid var(--line);background:var(--surface)}
.d4st span.on{border-color:var(--on);background:var(--on-soft)}
.d4st span.off{color:var(--muted);text-decoration:line-through}
.d4cmp td:first-child{text-align:right;font-weight:600}
.d4cmp button{font:inherit;font-size:13px}
`;
(function(){if(document.getElementById('d4-css'))return;const s=document.createElement('style');s.id='d4-css';s.textContent=CSS;document.head.appendChild(s)})();

/* =====================================================================
   SVG helpers
   ===================================================================== */
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const ARX=/[؀-ۿ]/;
const RUNX=/([A-Za-z0-9][A-Za-z0-9.,*×²~+\/\-: ]*[A-Za-z0-9²~]|[A-Za-z0-9])/;
/* نص في SVG. a: 'm' وسط، 'l' طرفه الأيسر عند x، 'r' طرفه الأيمن عند x. العربي: كل مقطع لاتيني/رقمي في tspan مستقل */
function T(x,y,s,o){o=o||{};s=String(s);const sz=o.sz||12,a=o.a||'m',c=o.c||'',ar=ARX.test(s);
 const anc=a==='m'?'middle':ar?(a==='r'?'start':'end'):(a==='r'?'end':'start');
 const st=`font-size:${sz}px${o.w?';font-weight:'+o.w:''}`;const tr=o.rot?` transform="rotate(${o.rot} ${x} ${y})"`:'';
 if(!ar)return `<text class="txt ${c}" x="${x}" y="${y}" text-anchor="${anc}" style="${st}"${tr}>${esc(s)}</text>`;
 const body=s.split(RUNX).map((p,i)=>!p?'':i%2?`<tspan direction="ltr" unicode-bidi="embed">${esc(p)}</tspan>`:esc(p)).join('');
 return `<text class="txt ar ${c}" x="${x}" y="${y}" text-anchor="${anc}" style="${st}"${tr}>${body}</text>`}
const L=(x1,y1,x2,y2,k,ex)=>`<line class="ln ${k||''} ${ex||''}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
const P=(d,k,ex)=>`<path class="ln ${k||''} ${ex||''}" d="${d}"/>`;
const DOT=(x,y,k,r)=>`<circle class="fl ${k||''}" cx="${x}" cy="${y}" r="${r||3.3}"/>`;
const ODOT=(x,y,k,r)=>`<circle class="ln ${k||''} thin" cx="${x}" cy="${y}" r="${r||3.6}" style="fill:var(--surface)"/>`;
const RECT=(x,y,w,h,k,ex,rx)=>`<rect class="ln ${k||''} ${ex||''}" x="${x}" y="${y}" width="${w}" height="${h}"${rx?` rx="${rx}"`:''}/>`;
const HIT=(k,x,y,w,h)=>`<rect class="hit" data-k="${k}" x="${x}" y="${y}" width="${w}" height="${h}" rx="5"/>`;
const HITL=(k,d)=>`<path class="hitl" data-k="${k}" d="${d}"/>`;
const SVG=(w,h,inner,extra)=>`<svg class="d4" viewBox="0 0 ${w} ${h}" role="img"${extra||''}><defs><pattern id="d4hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line class="hatch" x1="0" y1="0" x2="0" y2="7"/></pattern></defs>${inner}</svg>`;
const box=(h,mw)=>`<div class="svgbox" style="max-width:${mw||560}px;margin-inline:auto">${h}</div>`;
/* شرطة عدد الموصلات على خط رأسي / أفقي */
const TK=(x,y,n,k,side)=>P(`M${x-5} ${y+4.5} L${x+5} ${y-4.5}`,k)+(n!=null?T(side==='l'?x-8:x+8,y+1,String(n),{sz:11,a:side==='l'?'r':'l'}):'');
const TKH=(x,y,n,k)=>P(`M${x-4} ${y+5.5} L${x+4} ${y-5.5}`,k)+(n!=null?T(x+6,y-7,String(n),{sz:11,a:'l'}):'');
/* سهم (رأس) */
const AH=(x,y,dir,k)=>{const d={d:`M${x-4.5} ${y-8} L${x} ${y} L${x+4.5} ${y-8}`,u:`M${x-4.5} ${y+8} L${x} ${y} L${x+4.5} ${y+8}`,l:`M${x+8} ${y-4.5} L${x} ${y} L${x+8} ${y+4.5}`,r:`M${x-8} ${y-4.5} L${x} ${y} L${x-8} ${y+4.5}`}[dir];return P(d,k)};
const AHF=(x,y,dir)=>{const d={l:`M${x} ${y} L${x+11} ${y-5} L${x+11} ${y+5}Z`,d:`M${x} ${y} L${x-5} ${y-11} L${x+5} ${y-11}Z`}[dir];return `<path class="fl" d="${d}"/>`};

/* ---------- رموز المفاتيح على خط رأسي (y0 أعلى → y1 أسفل) ----------
   kind: 'cb' مفتاح قدرة أوتوماتيكي · 'ds' مفتاح فصل/قدرة · 'mcb' قاطع آلي · 'k' كونتاكتور · 'th' تلامس حراري · 'man' مفتاح بتشغيل يدوي
   st: undefined (رسم ثابت) | 'c' مغلق | 'o' مفتوح | 't' فصل بسبب عطل */
function SW(x,y0,y1,kind,st,kT,kB){const h=y1-y0,ya=y0+h*0.3,yb=y1-h*0.26,ym=(ya+yb)/2;const cl=st==='c';
 let s=L(x,y0,x,ya,kT)+L(x,yb,x,y1,kB);
 const tipx=cl?x-1.5:x-(yb-ya)*0.55,tipy=cl?ya:ya+2;
 s+=P(`M${x} ${yb} L${tipx} ${tipy}`,kB,st==='t'?'trip':'');
 s+=L(x-3.5,ya,x+3.5,ya,kT);
 if(kind==='cb')s+=P(`M${x-19} ${ym+4} h3.5 v-5 h4.5 v5 h3.5`,kB,'thin');
 if(kind==='mcb'||kind==='th')s+=P(`M${x-6} ${ym-5} h-5 v-5 h-6 v5 h-4`,kB,'thin');
 if(kind==='mcb')s+=P(`M${x-4} ${ym+3} H${x-25} M${x-20} ${ym-0.5} L${x-25} ${ym+3} L${x-20} ${ym+6.5}`,kB,'thin');
 if(kind==='k')s+=RECT(x-31,ym-4,9,8,kB,'thin')+P(`M${x-22} ${ym} H${x-5}`,kB,'thin dash');
 if(kind==='man')s+=P(`M${x-6} ${ym} H${x-20} M${x-20} ${ym-5} V${ym+5}`,kB,'thin');
 if(kind==='op')s+=P(`M${x-6} ${ym} H${x-14} M${x-14} ${ym-5} L${x-23} ${ym} L${x-14} ${ym+5}Z M${x-23} ${ym-5} V${ym+5}`,kB,'thin');
 return s}
/* مصهر رأسي: st 'x' = مُزال/منصهر */
function FU(x,y0,y1,st,kT,kB,slash){const ym=(y0+y1)/2,hh=Math.min(13,(y1-y0)/2-2);
 let s=RECT(x-5,ym-hh,10,2*hh,kB,st==='x'?'trip':'');
 s+=st==='x'?L(x,y0,x,ym-hh,kT)+L(x,ym+hh,x,y1,kB)+P(`M${x} ${ym-hh} L${x} ${ym-3} M${x} ${ym+3} L${x} ${ym+hh}`,'trip','thin'):L(x,y0,x,ym,kT)+L(x,ym,x,y1,kB);
 if(slash)s+=P(`M${x-8} ${ym+7} L${x+8} ${ym-7}`,kB,'thin');
 return s}
/* مصهر أفقي (التيار من اليمين لليسار) */
function FUH(xr,xl,y,st,kR,kL,slash){const xm=(xr+xl)/2,hw=Math.min(15,(xr-xl)/2-2);
 let s=RECT(xm-hw,y-5,2*hw,10,kL,st==='x'?'trip':'');
 s+=st==='x'?L(xr,y,xm+hw,y,kR)+L(xm-hw,y,xl,y,kL):L(xr,y,xm,y,kR)+L(xm,y,xl,y,kL);
 if(slash)s+=P(`M${xm-7} ${y+8} L${xm+7} ${y-8}`,kL,'thin');
 return s}
/* مفتاح بطرفين مفرغين على خط أفقي (الشكل 4-6) — x1 يمين (الدخل) → x2 يسار */
function SWH(xr,xl,y,st,kR,kL){const cl=st==='c';
 return L(xr+6,y,xr+3.6,y,kR)+ODOT(xr,y,kR)+ODOT(xl,y,kL)+P(cl?`M${xr-3.4} ${y-1} L${xl+3.4} ${y-1}`:`M${xr-3} ${y-2} L${xl+2} ${y-12}`,kL)+P(cl?`M${xl+8} ${y-1} v-6`:`M${xl+2} ${y-12} l-1 -6`,kL,'thin')}
/* مفتاح بطرفين على خط رأسي (من أسفل لأعلى) */
function SWV(x,yb,yt,st,kB,kT){const cl=st==='c';
 return ODOT(x,yb,kB)+ODOT(x,yt,kT)+P(cl?`M${x+1} ${yb-3.4} L${x+1} ${yt+3.4}`:`M${x+2} ${yb-3} L${x+12} ${yt+2}`,kT)+P(cl?`M${x+1} ${yt+8} h6`:`M${x+12} ${yt+2} h6`,kT,'thin')}

/* ---------- الأحمال ---------- */
function MOT(x,cy,k,on,r){r=r||15;let s='';
 if(on)s+=`<circle class="runbg" cx="${x}" cy="${cy}" r="${r+5}"/>`;
 s+=`<circle class="ln ${k||''}" cx="${x}" cy="${cy}" r="${r}" style="fill:var(--surface)"/>`+T(x,cy+0.5,'M',{sz:12})+T(x,cy+10.5,'3~',{sz:9});
 if(on)s+=`<g>${P(`M${x+r+3} ${cy} A${r+3} ${r+3} 0 0 1 ${x} ${cy+r+3}`,'on')}${AH(x,cy+r+3,'l','on')}<animateTransform attributeName="transform" type="rotate" from="0 ${x} ${cy}" to="360 ${x} ${cy}" dur="1.4s" repeatCount="indefinite"/></g>`;
 return s}
function LAMPX(x,cy,k,on,r){r=r||9;return (on?`<circle class="glow" cx="${x}" cy="${cy}" r="${r+6}"/>`:'')+P(`M${x-r} ${cy-r} L${x+r} ${cy+r} M${x-r} ${cy+r} L${x+r} ${cy-r}`,k)}
function SOCK(x,y,k,on){return (on?`<circle class="runbg" cx="${x}" cy="${y+8}" r="13"/>`:'')+P(`M${x-10} ${y+12} A10 10 0 0 1 ${x+10} ${y+12}`,k)}
function HEAT(x,y0,k,on,h){h=h||40;let s=(on?`<rect class="hot" x="${x-14}" y="${y0-4}" width="28" height="${h+8}" rx="4"/>`:'')+RECT(x-10,y0,20,h,k);for(let i=1;i<5;i++)s+=L(x-10,y0+h*i/5,x+10,y0+h*i/5,k,'thin');return s}
/* فلورسنت أفقي (كبسولة) */
function FLH(xc,y,w,k,on,txt){const h=14;return (on?`<rect class="glow" x="${xc-w/2-5}" y="${y-h/2-5}" width="${w+10}" height="${h+10}" rx="12"/>`:'')+RECT(xc-w/2,y-h/2,w,h,k,'',h/2)+P(`M${xc-5} ${y-5} L${xc+5} ${y+5} M${xc-5} ${y+5} L${xc+5} ${y-5}`,k,'thin')+(txt?T(xc-w/2+15,y+4,txt,{sz:9}):'')}
/* فلورسنت رأسي */
function FLV(x,yc,hgt,k,on){const w=14;return (on?`<rect class="glow" x="${x-w/2-5}" y="${yc-hgt/2-5}" width="${w+10}" height="${hgt+10}" rx="12"/>`:'')+RECT(x-w/2,yc-hgt/2,w,hgt,k,'',w/2)+P(`M${x-4} ${yc-hgt/2+5} l8 8 M${x-4} ${yc-hgt/2+13} l8 -8`,k,'thin')}
/* رمز «⊗» (مصباح/لمبة بيان) */
function OX(x,y,r,k,on,col){r=r||6;return (on?`<circle cx="${x}" cy="${y}" r="${r+1}" style="fill:${col||'#ffd36b'}"/>`:'')+`<circle class="ln ${k||''} thin" cx="${x}" cy="${y}" r="${r}"/>`+P(`M${x-r*0.7} ${y-r*0.7} L${x+r*0.7} ${y+r*0.7} M${x-r*0.7} ${y+r*0.7} L${x+r*0.7} ${y-r*0.7}`,k,'thin')}
/* محول (دائرتان متداخلتان رأسياً) */
const XF=(x,cy,k,r)=>{r=r||10;return `<circle class="ln ${k||''}" cx="${x}" cy="${cy-r*0.6}" r="${r}" style="fill:none"/><circle class="ln ${k||''}" cx="${x}" cy="${cy+r*0.6}" r="${r}" style="fill:none"/>`};
/* مفتاح مفرد في المسقط (دائرة صغيرة + ذراع مائلة + علم) */
function SW1(x,y,k,on,ang){ang=ang==null?-45:ang;const r=4,a=ang*Math.PI/180,x1=x+r*Math.cos(a),y1=y+r*Math.sin(a),x2=x+16*Math.cos(a),y2=y+16*Math.sin(a);const fa=a-Math.PI/2;
 return `<circle class="ln ${k||''} thin" cx="${x}" cy="${y}" r="${r}" style="fill:${on?'var(--live)':'var(--surface)'}"/>`+P(`M${x1} ${y1} L${x2} ${y2} l${5*Math.cos(fa)} ${5*Math.sin(fa)}`,k)}

/* stage helper للأمثلة المرسومة خطوة بخطوة: n < stage يرسم عادياً، n == stage أزرق (جديد)، n > stage لا يرسم */
const mkG=S=>(n,s)=>S.stage==null||n<S.stage?s:n===S.stage?`<g class="nw">${s}</g>`:'';

/* =====================================================================
   محرك الشبكة: devs [{id,p,c,prot}] — تغذية العقد من المصدر
   ===================================================================== */
function energize(devs,src,st){const en={};src.forEach(n=>en[n]=1);
 for(let it=0;it<6;it++)devs.forEach(d=>{if(en[d.p]&&!st.open[d.id]&&!st.trip[d.id]&&!chF('open:'+d.id))en[d.c]=1});return en}
/* قصر عند عقدة: يفصل أقرب جهاز وقاية (أوتوماتيكي أو مصهر) فوقه على كل مسار تغذية */
function tripUp(devs,node,st,en,out,seen){seen=seen||{};if(seen[node])return;seen[node]=1;
 devs.filter(d=>d.c===node).forEach(d=>{if(!en[d.p]||st.open[d.id]||st.trip[d.id]||chF('open:'+d.id))return;if(d.prot&&!chF('noprot:'+d.id)){st.trip[d.id]=1;out.push(d.id)}else tripUp(devs,d.p,st,en,out,seen)})}

/* =====================================================================
   UI helpers (كما في الدروس المرجعية)
   ===================================================================== */
function stepsUI(host,steps,getW){let i=0;
  const draw=()=>{host.innerHTML=steps.map((s,j)=>`<li class="${j<i?'done':j===i?'cur':''}"><span class="k">${j<i?'✓':j+1}</span><div><h4>${s.t}</h4><p>${s.x}</p>${j===i?`<div class="act">${s.done?'<span class="hint">بانتظار تنفيذك…</span> <button class="btn" data-next>تخطَّ</button>':'<button class="btn primary" data-next>التالي</button>'}</div>`:''}</div></li>`).join('')+
    (i>=steps.length?`<li class="cur"><span class="k">✓</span><div><h4>أحسنت، أنهيت التجربة</h4><p style="display:block">يمكنك إعادة التجربة من أولها.</p><div class="act"><button class="btn" data-restart>إعادة التجربة</button></div></div></li>`:'')};
  host.addEventListener('click',e=>{if(e.target.closest('[data-next]')){i++;draw()}if(e.target.closest('[data-restart]')){i=0;draw()}});draw();
  return {check(){const s=steps[i];if(s&&s.done&&s.done(getW())){i++;draw()}}}}
const segHTML=(attr,items,cur)=>`<div class="seg" role="group" style="flex-wrap:wrap">${items.map(([v,l])=>`<button data-${attr}="${v}" aria-pressed="${String(v)===String(cur)}">${l}</button>`).join('')}</div>`;
const tries=list=>`<h3 class="sm">جرّب</h3><ul class="sub" style="padding-inline-start:20px;margin-top:4px">${list.map(t=>`<li>${t}</li>`).join('')}</ul>`;
const lt=s=>`<span class="ltr">${s}</span>`;
/* نشاط مطابقة: items [[النص, المفتاح الصحيح]], keys [[مفتاح, تسمية]] */
function matchUI(host,items,keys,intro){const ans={};
 const draw=()=>{const ok=Object.keys(ans).filter(i=>ans[i]===items[i][1]).length;
  host.innerHTML=(intro?`<p class="sub">${intro}</p>`:'')+`<div class="d4mt">${items.map((it,i)=>{const a=ans[i];const cls=a==null?'':a===it[1]?'ok':'no';
   return `<div class="it ${cls}"><p>${it[0]}</p>${segHTML('m'+i,keys,a==null?'':a)}${a!=null?`<div class="sub" style="margin-top:4px">${a===it[1]?'صحيح.':'ليس هذا — حاول مرة أخرى.'}</div>`:''}</div>`}).join('')}</div><p class="sub" style="margin-top:8px"><b>${ok} / ${items.length}</b> ${ok===items.length?'— أحسنت، كلها صحيحة.':''} <button class="btn" data-mr>إعادة</button></p>`;
  items.forEach((it,i)=>host.querySelectorAll(`[data-m${i}]`).forEach(b=>b.addEventListener('click',()=>{ans[i]=b.getAttribute('data-m'+i);draw()})));
  host.querySelector('[data-mr]').addEventListener('click',()=>{Object.keys(ans).forEach(k=>delete ans[k]);draw()})};
 draw();return {score:()=>Object.keys(ans).filter(i=>ans[i]===items[i][1]).length}}
/* بطاقة معلومات */
const card=(I)=>I?`<h3>${I.t}${I.ref?` <span class="ref">${I.ref}</span>`:''}</h3><div>${B.ltrU(I.d)}</div>`:'<p class="sub">اضغط على أي جزء في الرسم لتعرف اسمه ومواصفاته.</p>';

/* =====================================================================
   الشكل (4-1) ص 84 — مخطط لتوزيع الطاقة الكهربائية داخل مصنع (شبكة شعاعية)
   ===================================================================== */
const D41=[
 {id:'A',p:'tx',c:'mb',prot:1},{id:'L0',p:'mb',c:'l0',prot:1},{id:'Bb',p:'mb',c:'bc',prot:1},{id:'C',p:'bc',c:'sb'},
 {id:'D1',p:'sb',c:'d1',prot:1},{id:'E1',p:'d1',c:'lb1'},{id:'D2',p:'sb',c:'d2',prot:1},{id:'E2',p:'d2',c:'lb2'},{id:'D3',p:'sb',c:'d3',prot:1},{id:'E3',p:'d3',c:'lb3'},
 {id:'F1',p:'lb1',c:'n1',prot:1},{id:'FU2',p:'lb1',c:'n2a',prot:1},{id:'K2',p:'n2a',c:'n2'},
 {id:'Q3',p:'lb2',c:'n3',prot:1},{id:'Q4',p:'lb2',c:'n4',prot:1},
 {id:'FU5',p:'lb3',c:'n5',prot:1},{id:'F6',p:'lb3',c:'n6a',prot:1},{id:'K6',p:'n6a',c:'n6'}];
const LOAD41=[['M1','n1','المحرك (1)'],['M2','n2','المحرك (2)'],['LMP','n3','الإضاءة (3)'],['SO','n4','المقبس (4)'],['HT','n5','السخان (5)'],['M6','n6','المحرك (6)'],['OUT','l0','المخرج الآخر (السهم)']];
const HB41={A:[180,90,40,46],L0:[110,172,40,46],Bb:[250,172,40,46],C:[250,230,40,46],
 D1:[110,306,40,46],E1:[110,364,40,46],D2:[250,306,40,46],E2:[250,364,40,46],D3:[390,306,40,46],E3:[390,364,40,46],
 F1:[65,448,40,46],FU2:[150,447,32,40],K2:[128,505,50,45],Q3:[196,450,44,55],Q4:[276,450,44,55],FU5:[355,447,32,40],F6:[430,448,40,46],K6:[413,508,50,42],
 M1:[65,572,40,40],M2:[145,572,40,40],LMP:[207,574,36,36],SO:[287,576,36,30],HT:[350,556,40,50],M6:[430,572,40,40],OUT:[115,222,30,34],
 tx:[184,20,32,38],mb:[105,150,200,12],sb:[95,286,360,12],lb1:[55,422,140,12],lb2:[200,422,140,12],lb3:[345,422,140,12]};
const NODE41={mb:[160,156],sb:[200,292],lb1:[100,428],lb2:[250,428],lb3:[395,428],M1:[85,592],M2:[165,592],LMP:[225,592],SO:[305,590],HT:[370,580],M6:[450,592]};
const FNODE41={mb:'mb',sb:'sb',lb1:'lb1',lb2:'lb2',lb3:'lb3',M1:'n1',M2:'n2',LMP:'n3',SO:'n4',HT:'n5',M6:'n6'};
/* سهم الحرف من اليمين (كما في الكتاب) */
const ARL=(xe,y,ch)=>L(xe+44,y,xe+5,y,'','thin')+AH(xe+5,y,'l','')+T(xe+52,y+4,ch,{sz:14,w:700,a:'l'});
const BOLT=(x,y)=>`<path class="flt" d="M${x+3} ${y-13} L${x-6} ${y+1} L${x} ${y+1} L${x-4} ${y+13} L${x+7} ${y-3} L${x+1} ${y-3} L${x+6} ${y-13}Z"/>`;
function fig41(S){S=S||{};const g=mkG(S),lv=!!S.live;
 const k=n=>lv?(S.en[n]?'on':'off'):'';
 const ds=id=>lv?(S.st.trip[id]?'t':S.st.open[id]?'o':'c'):undefined;
 const fs=id=>lv&&(S.st.trip[id]||S.st.open[id])?'x':'';
 const on=n=>lv&&S.en[n];
 const XA=200,XL=130,XB=270,XD=[130,270,410];let s='';
 if(S.sel&&HB41[S.sel]){const b=HB41[S.sel];s+=`<rect class="selr" x="${b[0]-3}" y="${b[1]-3}" width="${b[2]+6}" height="${b[3]+6}" rx="6"/>`}
 s+=g(1,L(XA,6,XA,22,k('in'))+TK(XA,13,3,k('in'))+XF(XA,38,k('in'))+L(XA,54,XA,90,k('tx'))+TK(XA,71,4,k('tx'))
  +RECT(XA-20,90,40,46,'','thin')+SW(XA,90,136,'cb',ds('A'),k('tx'),k('mb'))+TK(XA,100,3,k('tx'))+ARL(XA+20,113,'أ')
  +L(XA,136,XA,156,k('mb'))+L(110,156,300,156,k('mb'),'bus')+DOT(XA,156,k('mb')));
 s+=g(2,DOT(XL,156,k('mb'))+L(XL,156,XL,172,k('mb'))+RECT(XL-20,172,40,46,'','thin')+SW(XL,172,218,'cb',ds('L0'),k('mb'),k('l0'))+TK(XL,182,3,k('mb'))+L(XL,218,XL,242,k('l0'))+AHF(XL,254,'d')
  +DOT(XB,156,k('mb'))+L(XB,156,XB,172,k('mb'))+RECT(XB-20,172,40,46,'','thin')+SW(XB,172,218,'cb',ds('Bb'),k('mb'),k('bc'))+TK(XB,182,3,k('mb'))+ARL(XB+20,195,'ب')
  +L(XB,218,XB,230,k('bc'))+RECT(XB-20,230,40,46,'','thin')+SW(XB,230,276,'ds',ds('C'),k('bc'),k('sb'))+TK(XB,240,3,k('bc'))+ARL(XB+20,253,'ج')
  +L(XB,276,XB,292,k('sb'))+L(100,292,450,292,k('sb'),'bus')+DOT(XB,292,k('sb')));
 const LB=[[60,190],[205,335],[350,480]];
 s+=g(3,XD.map((x,i)=>{const d='d'+(i+1),lb='lb'+(i+1);return DOT(x,292,k('sb'))+L(x,292,x,306,k('sb'))+RECT(x-20,306,40,46,'','thin')+SW(x,306,352,'cb',ds('D'+(i+1)),k('sb'),k(d))+TK(x,316,3,k('sb'))
   +L(x,352,x,364,k(d))+RECT(x-20,364,40,46,'','thin')+SW(x,364,410,'ds',ds('E'+(i+1)),k(d),k(lb))+TK(x,374,3,k(d))+L(x,410,x,428,k(lb))+L(LB[i][0],428,LB[i][1],428,k(lb),'bus')+DOT(x,428,k(lb))}).join('')
  +TKH(72,428,5,k('lb1'))+TKH(217,428,5,k('lb2'))+ARL(430,329,'د')+ARL(430,387,'هـ'));
 /* الأحمال 1 و 2 */
 s+=g(4,DOT(85,428,k('lb1'))+L(85,428,85,448,k('lb1'))+TK(85,438,4,k('lb1'))+RECT(65,448,40,46,'','thin')+SW(85,448,494,'cb',ds('F1'),k('lb1'),k('n1'))+TK(85,458,3,k('lb1'))
  +L(85,494,85,577,k('n1'))+TK(85,520,4,k('n1'))+MOT(85,592,k('n1'),on('n1'))
  +DOT(165,428,k('lb1'))+L(165,428,165,448,k('lb1'))+TK(165,438,4,k('lb1'))+FU(165,448,486,fs('FU2'),k('lb1'),k('n2a'),true)+T(178,462,'3',{sz:11,a:'l'})
  +L(165,486,165,505,k('n2a'))+TK(165,496,3,k('n2a'))+SW(165,505,550,'k',ds('K2'),k('n2a'),k('n2'))+P('M171 532 h3.5 v-5 h4.5 v5 h3.5',k('n2'),'thin')
  +L(165,550,165,577,k('n2'))+TK(165,563,4,k('n2'))+MOT(165,592,k('n2'),on('n2')));
 /* الأحمال 3 و 4 */
 s+=g(5,[[225,'Q3','n3'],[305,'Q4','n4']].map(([x,id,n],j)=>DOT(x,428,k('lb2'))+L(x,428,x,450,k('lb2'))+TK(x,439,3,k('lb2'))+SW(x,450,505,'mcb',ds(id),k('lb2'),k(n))
   +L(x,505,x,j?584:583,k(n))+TK(x,540,3,k(n))+(j?SOCK(x,582,k(n),on(n)):LAMPX(x,592,k(n),on(n)))).join(''));
 /* الأحمال 5 و 6 */
 s+=g(6,DOT(370,428,k('lb3'))+L(370,428,370,448,k('lb3'))+FU(370,448,486,fs('FU5'),k('lb3'),k('n5'),true)+T(383,462,'3',{sz:11,a:'l'})+L(370,486,370,560,k('n5'))+TK(370,522,5,k('n5'))+HEAT(370,560,k('n5'),on('n5'),42)
  +DOT(450,428,k('lb3'))+L(450,428,450,448,k('lb3'))+TK(450,438,4,k('lb3'))+RECT(430,448,40,46,'','thin')+SW(450,448,494,'cb',ds('F6'),k('lb3'),k('n6a'))+TK(450,458,3,k('lb3'))+ARL(470,471,'و')
  +L(450,494,450,508,k('n6a'))+TK(450,501,3,k('n6a'))+SW(450,508,550,'k',ds('K6'),k('n6a'),k('n6'))+L(450,550,450,577,k('n6'))+TK(450,564,4,k('n6'))+MOT(450,592,k('n6'),on('n6')));
 if(S.nums)s+=[[85,'1'],[165,'2'],[225,'3'],[305,'4'],[370,'5'],[450,'6']].map(([x,n])=>T(x,622,'('+n+')',{sz:11,c:'m'})).join('');
 if(S.fault&&NODE41[S.fault]){const p=NODE41[S.fault];s+=BOLT(p[0]+(S.fault.length>3?0:18),p[1]-(S.fault.startsWith('lb')||S.fault==='mb'||S.fault==='sb'?14:0))}
 if(S.hits)s+=Object.entries(HB41).map(([kk,b])=>HIT(kk,...b)).join('');
 return SVG(540,S.nums?630:615,s)}

const I41={
 A:{t:'(أ) مفتاح قدرة أوتوماتيكي',ref:'ص 83',d:'«يعمل كمفتاح وقاية للمحول ووقاية لموصل تغذية الموزع الرئيس ووقاية للموزع الفرعي ويمكن عن طريقه فصل الكهرباء عن المنشأة بأكملها.»'},
 L0:{t:'مفتاح قدرة أوتوماتيكي لمخرج آخر',ref:'ص 84',d:'مخرج ثانٍ من الموزع الرئيس ينتهي بسهم إلى جزء آخر من المصنع غير مرسوم. (لا يسميه الكتاب بحرف.)'},
 Bb:{t:'(ب) مفتاح قدرة أوتوماتيكي',ref:'ص 83',d:'«يعمل كمفتاح وقاية لموصل تغذية الموزع الفرعي وللموزع الفرعي نفسه.»'},
 C:{t:'(جـ) مفتاح قدرة في مدخل الموزع الفرعي',ref:'ص 83',d:'«يعمل على فصل الموزع الفرعي.» رمزه ذراع فقط بلا علامة الفصل الأوتوماتيكي، فهو للفصل وليس للوقاية.'},
 D:{t:'(د) مفتاح قدرة أوتوماتيكي',ref:'ص 83',d:'«يعمل كمفتاح وقاية لموصل تغذية موزع الأحمال ولموزع الأحمال نفسه.» في الشكل ثلاثة منها، واحد لكل موزع أحمال.'},
 E:{t:'(هـ) مفتاح قدرة في مدخل موزع المستهلك',ref:'ص 84',d:'«يعمل على فصل موزع الأحمال.» للفصل فقط (ليس فيه علامة الفصل الأوتوماتيكي).'},
 F:{t:'(و) تجهيزات لوقاية الموصلات والأجهزة',ref:'ص 84',d:'«تجهيزات لوقاية الموصلات والأجهزة.» في الشكل يشير السهم (و) إلى مفتاح قدرة أوتوماتيكي قبل المحرك؛ ومثله على فرع المحرك الأول.'},
 FU:{t:'مصهر',ref:'ص 84',d:'مستطيل يقطعه خط مائل بجانبه «3» (ثلاثة أوجه). من تجهيزات وقاية الموصلات والأجهزة: ينصهر عند القصر فيفصل فرعه وحده.'},
 K:{t:'كونتاكتور (مفتاح تلامس بملف)',ref:'ص 84',d:'ذراع مع ملف صغير (مستطيل) موصول بخط متقطع. يشغّل المحرك ويوقفه. الكتاب لا يسميه في الشكل، والرمز من رموز الوحدة الثانية.'},
 Q:{t:'قاطع آلي',ref:'ص 84',d:'ذراع مع علامة الفصل الحراري/المغناطيسي وسهم. يحمي دائرة الإضاءة أو المقبس، و«3» عليها تعني ثلاثة موصلات.'},
 M:{t:'محرك ثلاثي الأوجه',ref:'ص 84',d:'دائرة فيها «M 3~». تصله أربعة موصلات (شرطة «4»).'},
 LMP:{t:'إضاءة',ref:'ص 84',d:'علامة × في نهاية الخط = مصباح، تغذيه ثلاثة موصلات (شرطة «3»).'},
 SO:{t:'مقبس',ref:'ص 84',d:'قوس نصف دائري في نهاية الخط = مقبس، تغذيه ثلاثة موصلات.'},
 HT:{t:'حمل حراري (سخان)',ref:'ص 84',d:'مستطيل قائم مقسوم بخطوط أفقية، غير مسمّى في الكتاب. <b>توضيح للمتدرب (ليس من نص الكتاب):</b> هو رمز «مقاومات تسخين» نفسه المطلوب في التمرين (1) ص 96، وتصله خمسة موصلات.'},
 OUT:{t:'سهم إلى جزء آخر',ref:'ص 84',d:'المخرج الأيسر من الموزع الرئيس يذهب إلى جزء آخر من المصنع غير مرسوم.'},
 tx:{t:'المحول',ref:'ص 84',d:'دائرتان متداخلتان. يدخله خط بثلاثة موصلات (شرطة «3»)، ويخرج منه خط بأربعة (ثلاثة أوجه وموصل التعادل).'},
 mb:{t:'قضيب الموزع الرئيس',ref:'ص 84',d:'يتغذى عبر (أ)، ومنه مخرجان.'},
 sb:{t:'قضيب الموزع الفرعي',ref:'ص 84',d:'يتغذى عبر (ب) ثم (جـ)، ومنه ثلاثة فروع متماثلة.'},
 lb:{t:'قضيب موزع الأحمال',ref:'ص 84',d:'يتغذى عبر (د) ثم (هـ)، ومنه الأحمال. الشرطة «5» على طرفه = خمسة موصلات.'}};
const info41=k=>I41[k]||I41[k.replace(/\d$/,'')]||(/^(M1|M2|M6)$/.test(k)?I41.M:/^FU/.test(k)?I41.FU:/^K/.test(k)?I41.K:/^Q[34]$/.test(k)?I41.Q:/^F[16]$/.test(k)?I41.F:/^lb/.test(k)?I41.lb:null);
const NAME41={A:'(أ)',L0:'مفتاح المخرج الأيسر',Bb:'(ب)',C:'(جـ)',D1:'(د) الأيسر',D2:'(د) الأوسط',D3:'(د) الأيمن',E1:'(هـ) الأيسر',E2:'(هـ) الأوسط',E3:'(هـ) الأيمن',F1:'(و) على المحرك 1',FU2:'مصهر المحرك 2',K2:'كونتاكتور المحرك 2',Q3:'قاطع الإضاءة',Q4:'قاطع المقبس',FU5:'مصهر السخان',F6:'(و) على المحرك 6',K6:'كونتاكتور المحرك 6',
 mb:'قضيب الموزع الرئيس',sb:'قضيب الموزع الفرعي',lb1:'موزع الأحمال الأيسر',lb2:'موزع الأحمال الأوسط',lb3:'موزع الأحمال الأيمن',M1:'المحرك (1)',M2:'المحرك (2)',LMP:'الإضاءة (3)',SO:'المقبس (4)',HT:'السخان (5)',M6:'المحرك (6)'};

function lab41(el){
 const st={open:{},trip:{}};let mode='sw',fault=null,sel=null;const w={};
 el.innerHTML=`<div class="grid">
  <div class="panel c7"><h2>الشبكة الشعاعية في المصنع <small>مبنية على الشكل (4-1) ص 84</small></h2>
   <div class="wrap-in" style="padding-bottom:0">${segHTML('md',[['sw','افصل / أعد التوصيل'],['ft','ضع قصراً (عطل)']],'sw')}<button class="btn" id="fx" hidden>أزل العطل</button><button class="btn" id="rs">أعد كل شيء</button></div>
   <p class="sub" id="hint"></p>
   <div class="svgbox" id="fg" style="max-width:540px;margin-inline:auto"></div>
   <div class="legend"><span><i style="background:var(--live)"></i>فيه تغذية</span><span><i style="background:var(--muted)"></i>انقطعت عنه التغذية</span><span><i style="background:var(--stop)"></i>جهاز فصل بسبب عطل</span></div></div>
  <div class="panel c5"><h2>ماذا حدث؟</h2><div class="callout" id="ms">كل المفاتيح مغلقة والمصنع كله يعمل.</div>
   <h3 class="sm" style="margin-top:12px">حالة الأحمال</h3><div class="d4st" id="ls"></div>
   <div class="d4card" id="cd"></div>
   ${tries(['افصل (و) على المحرك 6: يقف المحرك 6 وحده.','افصل (جـ): تنقطع الموزعات الثلاثة، ويبقى المخرج الأيسر (السهم) يعمل.','ضع قصراً على المصباح: يفصل قاطع الإضاءة وحده ويبقى الباقي يعمل.','ضع قصراً على قضيب الموزع الفرعي: من الذي يفصل؟'])}
   <div class="callout"><b>توضيح للمتدرب (ليس من نص الكتاب):</b> محاكاة منطقية بلا أرقام. عند القصر يفصل أقرب جهاز <b>وقاية</b> فوق مكان العطل (مفتاح أوتوماتيكي أو مصهر أو قاطع آلي)؛ أما (جـ) و(هـ) فهي للفصل فقط. هذا معنى قول الكتاب: «عند حدوث عطل في أي شعاع لا يتضرر باقي المصنع». (الانتقائية بالتفصيل في الوحدة السابعة.)</div></div>
  <div class="panel c12"><h2>التجربة خطوة بخطوة</h2><ol class="steps" id="gs"></ol></div>
  <div class="panel c12"><h2>نشاط: طابق الحرف بوظيفته <small>ص 83–84</small></h2><div id="mt"></div></div>
 </div>`;
 const $=s=>el.querySelector(s);
 let en=energize(D41,['in','tx'],st);
 const lostNow=(a,b)=>LOAD41.filter(([,n])=>a[n]&&!b[n]).map(x=>x[2]);
 const draw=()=>{en=energize(D41,['in','tx'],st);
  $('#fg').innerHTML=fig41({live:1,en,st,sel,hits:1,nums:1,fault});
  $('#ls').innerHTML=LOAD41.map(([,n,nm])=>`<span class="${en[n]?'on':'off'}">${nm}</span>`).join('');
  $('#cd').innerHTML=card(sel?info41(sel):null);
  $('#fx').hidden=!fault;
  $('#hint').textContent=mode==='sw'?'اضغط على أي مفتاح أو مصهر لتفصله أو تعيده. اضغط على أي جزء آخر لتعرف اسمه.':'اضغط على حمل أو قضيب لتضع عليه قصراً (عطل).';
  gs.check()};
 const act=k=>{sel=k;const before=en;let m='';
  const isDev=D41.some(d=>d.id===k);
  if(mode==='sw'&&isDev){
   if(st.trip[k]){delete st.trip[k];m=`أعدت ${NAME41[k]} بعد الفصل.`}
   else if(st.open[k]){delete st.open[k];m=`أغلقت ${NAME41[k]}.`}
   else{st.open[k]=1;m=`فتحت ${NAME41[k]}.`;w[k]=1}
   let after=energize(D41,['in','tx'],st);
   if(fault&&after[FNODE41[fault]]){const out=[];tripUp(D41,FNODE41[fault],st,after,out);if(out.length){m+=` لكن العطل ما زال موجوداً، ففصل ${out.map(x=>NAME41[x]).join(' و')} مرة أخرى.`;after=energize(D41,['in','tx'],st)}}
   const lost=lostNow(before,after),back=lostNow(after,before);
   if(lost.length)m+=` انقطعت التغذية عن: <b>${lost.join('، ')}</b>.`;
   if(back.length)m+=` عادت التغذية إلى: <b>${back.join('، ')}</b>.`;
   if(!lost.length&&!back.length&&/^K/.test(k))m+=st.open[k]?' الكونتاكتور مفتوح: المحرك متوقف لكن الموزع ما زال مغذّى.':'';
   else if(!lost.length&&!back.length)m+=' لم يتغير شيء في الأحمال.';
  } else if(mode==='ft'&&FNODE41[k]){
   const n=FNODE41[k];
   if(!en[n]){m=`${NAME41[k]} بلا تغذية الآن، فلا يمر فيه تيار قصر ولا يفصل شيء.`}
   else{const out=[];tripUp(D41,n,st,en,out);fault=k;const after=energize(D41,['in','tx'],st);const lost=lostNow(before,after);
    if(!out.length)m=`قصر عند ${NAME41[k]}، لكن الكونتاكتور مفتوح فلا يمر تيار قصر.`;
    else{m=`قصر عند <b>${NAME41[k]}</b>: فصل <b>${out.map(x=>NAME41[x]).join(' و')}</b> فقط.`+(lost.length?` انقطعت التغذية عن: ${lost.join('، ')}، وبقي باقي المصنع يعمل.`:'');
     out.forEach(x=>{if(/^Q3$/.test(x)&&k==='LMP')w.fLamp=1;if(/^D/.test(x)&&/^lb/.test(k))w.fBus=1})}}
  } else if(mode==='ft'){m='في وضع «ضع قصراً» اضغط على حمل أو قضيب. (أو عد إلى «افصل / أعد التوصيل» لتشغيل المفاتيح.)'}
  else m='';
  if(m)$('#ms').innerHTML=m;draw()};
 $('#fg').addEventListener('click',e=>{const h=e.target.closest('[data-k]');if(h)act(h.dataset.k)});
 el.querySelectorAll('[data-md]').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.md;el.querySelectorAll('[data-md]').forEach(x=>x.setAttribute('aria-pressed',x===b));draw()}));
 $('#rs').addEventListener('click',()=>{st.open={};st.trip={};fault=null;$('#ms').innerHTML='أعدت كل المفاتيح وأزلت العطل: المصنع كله يعمل.';draw()});
 $('#fx').addEventListener('click',()=>{fault=null;$('#ms').innerHTML='أزلت العطل. أعد الجهاز الذي فصل (اضغط عليه في وضع «افصل / أعد التوصيل»).';draw()});
 const gs=stepsUI($('#gs'),[
  {t:'افصل (و) على المحرك 6',x:'في وضع «افصل / أعد التوصيل» اضغط على المربع (و) في أقصى اليمين. يقف المحرك 6 وحده.',done:()=>st.open.F6},
  {t:'افصل (هـ) الأيمن',x:'أعد (و) ثم اضغط على (هـ) الأيمن: ينقطع موزع الأحمال الأيمن كله (السخان والمحرك 6).',done:()=>st.open.E3&&!st.open.F6},
  {t:'افصل (جـ)',x:'اضغط على (جـ): تنقطع الموزعات الثلاثة، ويبقى المخرج الأيسر (السهم) يعمل لأنه لا يمر بـ (جـ).',done:()=>st.open.C},
  {t:'افصل (أ)',x:'اضغط «أعد كل شيء» ثم افصل (أ): ينقطع المصنع كله — (أ) «يمكن عن طريقه فصل الكهرباء عن المنشأة بأكملها» (ص 83).',done:()=>st.open.A&&!st.open.C},
  {t:'قصر على المصباح',x:'اضغط «أعد كل شيء»، ثم اختر «ضع قصراً (عطل)» واضغط على المصباح (3). يفصل قاطع الإضاءة وحده.',done:()=>w.fLamp},
  {t:'قصر على موزع أحمال',x:'اضغط «أزل العطل» ثم «أعد كل شيء»، وضع قصراً على أحد قضبان موزعات الأحمال. يفصل (د) الخاص به فقط.',done:()=>w.fBus},
  {t:'أعد المصنع للعمل',x:'جرّب إعادة (د) قبل إزالة العطل: يفصل مرة أخرى. ثم اضغط «أزل العطل» وأعد (د).'}],()=>w);
 matchUI($('#mt'),[
  ['مفتاح قدرة في مدخل الموزع الفرعي: يعمل على فصل الموزع الفرعي.','c'],
  ['تجهيزات لوقاية الموصلات والأجهزة.','f'],
  ['مفتاح قدرة أوتوماتيكي يحمي المحول وموصل تغذية الموزع الرئيس، ويمكن عن طريقه فصل الكهرباء عن المنشأة بأكملها.','a'],
  ['مفتاح قدرة في مدخل موزع المستهلك: يعمل على فصل موزع الأحمال.','e'],
  ['مفتاح قدرة أوتوماتيكي: وقاية لموصل تغذية الموزع الفرعي وللموزع الفرعي نفسه.','b'],
  ['مفتاح قدرة أوتوماتيكي: وقاية لموصل تغذية موزع الأحمال ولموزع الأحمال نفسه.','d']],
  [['a','أ'],['b','ب'],['c','جـ'],['d','د'],['e','هـ'],['f','و']],'اختر الحرف الذي يدل عليه كل وصف في الشكل (4-1).');
 draw()}

/* =====================================================================
   LESSON u4-l1
   ===================================================================== */
B.lesson({
 id:'u4-l1',unit:4,order:1,pages:'81–84',
 title:'الشبكة الشعاعية ومخططات التغذية في المصانع',
 summary:'كيف تُوزَّع الطاقة داخل المصنع بشبكة شعاعية: من المحول إلى الموزع الرئيس ثم الفرعي ثم موزعات الأحمال، ووظيفة كل مفتاح في المخطط (4-1).',
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
})())/*DCML-END*/,(window.U4ST=window.U4ST||(function(){
/* أدوات صغيرة لمحطات الوحدة الرابعة: رسم المحطة بألوان ثابتة على خلفية الرسم الفاتحة، وتضمين أشكال الدرس نفسها */
const strip=s=>s.replace(/^<svg[^>]*>/,'').replace(/<\/svg>\s*$/,'');
const emb=(s,x,y,k)=>`<g transform="translate(${x} ${y}) scale(${k})">${strip(s)}</g>`;
const tip=(tx,b,inner)=>`<g data-tip="${tx}">${inner||''}<rect x="${b[0]}" y="${b[1]}" width="${b[2]}" height="${b[3]}" rx="8" fill="transparent"/></g>`;
/* منطقة تلميح فوق شكل مُضمَّن: b بإحداثيات الشكل الأصلي */
const tipIn=(tx,b,x,y,k)=>tip(tx,[+(x+b[0]*k).toFixed(1),+(y+b[1]*k).toFixed(1),+(b[2]*k).toFixed(1),+(b[3]*k).toFixed(1)]);
const art=(inner,aria,bg)=>`<svg class="d4" viewBox="0 0 360 320" role="img" aria-label="${aria}" style="font-family:var(--font);--fg:#2C4A40;--surface:#FBF6EE;--muted:#7d8a82;--live:#E8735A;--stop:#c8372d;--stop-soft:#f8dcd9;--on:#1d9460;--on-soft:#d7f0e3;--blue:#12855A;--blue-ink:#0d6b47" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" style="fill:${bg||'#DDEFE6'}"/>${inner}</svg>`;
return {strip,emb,tip,tipIn,art};
})()),{intro:true}),

  {st:1,short:'أهداف الوحدة',title:'الوحدة الرابعة: الدوائر الخطية والتنفيذية لتغذية المصانع وشبكات التوزيع',ref:'ص 81–82',
   q:'المصنع فيه محركات ومصابيح وسخانات كثيرة… كيف تصل الكهرباء إلى كل واحد منها من نقطة تغذية واحدة؟',
   art:U4ST.art(
     U4ST.tip('المحول: يأتي المصنعَ بالتغذية. رمزه في الدائرة الخطية دائرتان متداخلتان.',[160,14,40,58],L(180,14,180,28)+XF(180,44,'',11))
    +L(180,62,180,82)+U4ST.tip('مفتاح قدرة أوتوماتيكي بعد المحول: ذراع مائلة ومعها علامة الفصل الأوتوماتيكي.',[150,80,50,52],SW(180,82,128,'cb'))
    +L(180,128,180,142)+U4ST.tip('قضيب التوزيع: خط أفقي سميك تخرج منه الفروع.',[60,134,240,16],L(70,142,290,142,'','bus')+DOT(180,142))
    +[[90,'م'],[180,'ض'],[270,'س']].map(([x])=>DOT(x,142)+L(x,142,x,158)+SW(x,158,204,'cb')+L(x,204,x,226)).join('')
    +U4ST.tip('محرك ثلاثي الأوجه ⟦M 3~⟧ في نهاية فرعه.',[70,224,40,40],MOT(90,242,'',false,16))
    +U4ST.tip('إضاءة: علامة × في نهاية الخط.',[164,226,32,36],L(180,226,180,232)+LAMPX(180,244,'',false,10))
    +U4ST.tip('حمل حراري (سخان): مستطيل قائم مقسوم بخطوط.',[256,224,28,46],HEAT(270,226,'',false,40))
    +T(180,298,'مخطط تغذية بخط واحد',{sz:13,w:700}),
    'محول ومفتاح رئيس وقضيب توزيع تخرج منه ثلاثة فروع إلى محرك وإضاءة وسخان'),
   cap:'مخطط تغذية مبسّط من رموز هذه الوحدة (ليس شكلاً من الكتاب).<br><b>مرّر المؤشر على أي جزء (أو المسه في الجوال) لتعرف اسمه.</b>',
   side:[
    {predict:{q:'ماذا يُطلب منك أن تتمكن من رسمه في هذه الوحدة؟',opts:[
     ['مساقط المحركات وأبعادها',false,'المساقط في الوحدة الأولى.'],
     ['مخططات التغذية للمصانع ولوحات التوزيع داخلها',true,'هذان هدفا الوحدة التفصيليان (ص 82).'],
     ['رموز البوابات المنطقية',false,'هذه رموز الوحدة الثانية.']]}}
   ],
   body:[
    {book:String.raw`<p><b>الهدف العام للوحدة:</b> القدرة على رسم الدوائر الخطية والتنفيذية لتوصيلات المصانع.</p>
     <p><b>الأهداف التفصيلية:</b></p><ol><li>أن يتمكن المتدرب من رسم مخططات التغذية للمصانع.</li><li>أن يتمكن المتدرب من رسم لوحات التوزيع داخل المصانع.</li></ol>`,ref:'ص 82'},
    {tip:String.raw`<p><b>الدائرة الخطية</b> ترسم كل مسار بخط واحد يمثل الأوجه الثلاثة، وتكتب عدد الموصلات بشرطة مائلة ورقم (مثل «3» أو «4»). و<b>الدائرة التنفيذية</b> ترسم كل سلك على حدة: <span class="ltr">L1، L2، L3، N، PE</span>. هذه الوحدة تبدأ بالخطية لأنها تبيّن «من يغذي من» في المصنع كله.</p>`,title:'خطية وتنفيذية'},
    {title:'تحقق سريع: قبل أن تبدأ',widget:(el,B)=>DCML.tf(el,B,{intro:'عبارات عن الدائرتين الخطية والتنفيذية كما ستراهما في هذه الوحدة.',items:[
     ['في الدائرة الخطية يمثل الخط الواحد الأوجه الثلاثة معاً.',true,'لذلك يمثل رمز مصهر واحد على الخط ثلاثة مصاهر في الواقع.'],
     ['الشرطة المائلة وبجانبها «4» على خط تعني أربعة مفاتيح.',false,'تعني أربعة موصلات على هذا الخط.'],
     ['في الدائرة التنفيذية يُرسم كل سلك على حدة.',true,'ولهذا تُنفَّذ منها التوصيلات.']]})}
   ]},

  {st:2,short:'المقدمة',title:'٤-١ المقدمة',ref:'ص 83',
   q:'لا توجد «قاعدة واحدة» لتغذية كل المصانع… فما الذي يجب أن تعرفه عن الأحمال قبل أن ترسم؟',
   get art(){return U4ST.art(
     `<rect x="96" y="34" width="168" height="236" rx="8" style="fill:#FBF6EE;stroke:#2C4A40;stroke-width:2.5"/>`
    +U4ST.tip('أجهزة القياس (فولتميتر وأميترات) على واجهة لوحة التوزيع.',[110,46,140,34],AMB(130,62,'V')+AMB(170,62,'A')+AMB(200,62,'A')+AMB(230,62,'A'))
    +U4ST.tip('المفتاح الرئيس للوحة.',[156,92,48,74],MAINF(180,96,32,44))
    +U4ST.tip('مفاتيح الخروج: كل مفتاح يحمي ويتحكم في خط يذهب إلى حمل أو لوحة فرعية.',[110,180,140,80],[130,180,230].map(x=>SWF(x,214,22,'u')).join('')+[130,180,230].map(x=>SWF(x,250,22,'u')).join(''))
    +T(180,300,'لوحة توزيع',{sz:14,w:700}),
    'واجهة لوحة توزيع فيها أجهزة قياس ومفتاح رئيس ومفاتيح خروج')},
   cap:'واجهة لوحة توزيع مبسّطة على أسلوب أشكال الكتاب.<br><b>مرّر المؤشر على أجزائها (أو المسها في الجوال) لتعرف وظيفتها.</b>',
   side:[
    {predict:{q:'بحسب الكتاب، ماذا يجب أن تعرف عن الأحمال حتى توزّع عليها الطاقة؟',opts:[
     ['لونها ووزنها',false,'لا علاقة لهما بالتوزيع الكهربائي.'],
     ['عدد العمال الذين يشغلونها',false,'الكتاب لا يذكر ذلك.'],
     ['القدرة الكهربائية والجهد والتيار',true,'«وبالتالي يجب معرفة القدرة الكهربائية والجهد والتيار لهذه الأحمال» (ص 83).']]}}
   ],
   body:[
    {book:String.raw`<p>نظراً لأن كل منشأة صناعية لها ملامحها وخصائصها ومتطلباتها الخاصة من ناحية توزيع الطاقة الكهربائية فيها فإنه لا يمكن وضع قواعد قياسية عامة بهدف اتباعها في عمل مخططات التغذية داخل المصانع، ومع هذا فإن عمل التصميم متشابه إلى حد كبير في القواعد والمبادئ الأساسية. يتم توزيع الطاقة الكهربائية على الأحمال حسب توزيعها داخل المنشآت «المصانع»، وبالتالي يجب معرفة القدرة الكهربائية والجهد والتيار لهذه الأحمال. وقد جُمعت أجهزة الوقاية والتحكم على لوحات تُسمّى لوحات التوزيع.</p>`,ref:'ص 83'},
    {tip:String.raw`<p>كل مصنع يختلف عن غيره، لذلك لا يحفظ المصمم «مخططاً جاهزاً»، بل يطبق المبادئ نفسها: يعرف أين الأحمال وما قدرتها وجهدها وتيارها، ثم يجمع أجهزة الوقاية والتحكم على <b>لوحات التوزيع</b>.</p>`,title:'مبادئ لا قوالب'},
    {add:String.raw`<p>معرفة القدرة والجهد تعطي التيار، والتيار هو الذي يُختار على أساسه مقطع الكابل وسعة المصهر أو القاطع. سيذكر الكتاب ذلك صراحة في ص 85: «يمكن حساب التيار وبالتالي يمكن معرفة مقطع هذا السلك بالمليمتر المربع».</p>`,title:'لماذا القدرة والجهد والتيار؟'},
    {title:'تحقق سريع: المقدمة',widget:(el,B)=>DCML.tf(el,B,{intro:'احكم على كل عبارة بحسب نص ص 83.',items:[
     ['توجد قواعد قياسية عامة واحدة لمخططات التغذية في كل المصانع.',false,'«لا يمكن وضع قواعد قياسية عامة» لأن لكل منشأة متطلباتها، لكن التصميم «متشابه إلى حد كبير في القواعد والمبادئ الأساسية».'],
     ['توزَّع الطاقة على الأحمال حسب توزيعها داخل المصنع.',true,'«يتم توزيع الطاقة الكهربائية على الأحمال حسب توزيعها داخل المنشآت».'],
     ['أجهزة الوقاية والتحكم تُجمع على لوحات تسمى لوحات التوزيع.',true,'نص الكتاب (ص 83).']]})},
    {watch:String.raw`<p>في رأس الصفحة ص 83 عنوان الوحدة «الدوائر الخطية والتنفيذية لتغذية المصانع» بلا «وشبكات التوزيع» الموجودة في الغلاف ص 81. وفي ص 83 «تسمي» صحّحناها إلى «تُسمّى».</p>`,fix:1}
   ]},

  {st:3,short:'الشبكة الشعاعية',title:'٤-٢ مخططات التغذية في المصانع',ref:'ص 83–84',
   q:'حدث قصر في مصباح واحد… هل يجب أن يتوقف المصنع كله؟',
   art:U4ST.art(
     U4ST.tip('المحول: نقطة التغذية التي تنطلق منها الفروع.',[160,14,40,58],L(180,14,180,28,'on')+XF(180,44,'on',11))
    +L(180,62,180,82,'on')+U4ST.tip('مفتاح قدرة أوتوماتيكي رئيس: يبقى مغلقاً لأن العطل بعيد عنه.',[150,80,50,52],SW(180,82,128,'cb','c','on','on'))
    +L(180,128,180,142,'on')+L(70,142,290,142,'on','bus')+DOT(180,142,'on')
    +DOT(90,142,'on')+L(90,142,90,158,'on')+U4ST.tip('فرع سليم: يبقى يعمل.',[60,156,50,110],SW(90,158,204,'cb','c','on','on')+L(90,204,90,226,'on')+MOT(90,242,'on',true,16))
    +DOT(180,142,'on')+L(180,142,180,158,'on')+U4ST.tip('الفرع المعطوب: فصل جهاز الوقاية الذي فوقه، فانقطع هذا الفرع وحده.',[150,156,50,110],SW(180,158,204,'cb','t','on','off')+L(180,204,180,232,'off')+LAMPX(180,244,'off',false,10)+BOLT(200,244))
    +DOT(270,142,'on')+L(270,142,270,158,'on')+U4ST.tip('فرع سليم آخر: يبقى يعمل.',[244,156,50,116],SW(270,158,204,'cb','c','on','on')+L(270,204,270,226,'on')+HEAT(270,226,'on',true,40))
    +T(180,298,'عطل في شعاع واحد',{sz:13,w:700}),
    'شبكة شعاعية فيها قصر على فرع الإضاءة: فصل قاطعه وحده وبقي الفرعان الآخران يعملان'),
   cap:'شبكة شعاعية مبسّطة: البرتقالي فيه تغذية، والرمادي انقطعت عنه.<br><b>مرّر المؤشر على الفروع (أو المسها في الجوال) لتعرف ما حدث في كل منها.</b>',
   side:[
    {predict:{q:'وقع قصر في فرع الإضاءة من شبكة شعاعية. ماذا يحدث بحسب الكتاب؟',opts:[
     ['ينقطع المصنع كله',false,'هذا ما تتجنبه الشبكة الشعاعية.'],
     ['ينقطع ذلك الشعاع وحده ولا يتضرر باقي المصنع',true,'«عند حدوث عطل في أي شعاع لا يتضرر باقي المصنع من ذلك» (ص 83).'],
     ['ينقطع الفرعان المجاوران فقط',false,'كل فرع يمضي وحده من نقطة التغذية، فلا يتأثر جاره.']]}}
   ],
   body:[
    {book:String.raw`<p>تستخدم الشبكات الكهربائية الشعاعية في الصناعة، وهي تتميز بأن أفرع الموصلات تنطلق من نقطة التغذية بشكل شعاعي ويكون على كل جزء من الموصل عدة أحمال، وهذا النوع يستخدم في شبكات الجهد المنخفض والمتوسط، وتتميز الشبكات الشعاعية في المصانع بأنه عند حدوث عطل في أي شعاع لا يتضرر باقي المصنع من ذلك.</p>
     <p>وفي العادة لا يمكن تغذية المصانع من الشبكة المحلية بل تغذى من شبكة الجهد المتوسط وفي حالات عديدة من شبكة الجهد العالي. ويجب على المصانع أن تنشئ تجهيزات تحويل وتجهيزات مفاتيح خاصة بها وأن تعتني بها. وتوزيع الطاقة يعتمد على ترتيب الأحمال على أرض المصنع وعلى درجة الأمان المطلوبة للإمداد.</p>
     <p>الشكل (4-1) يبين مخططاً لتوزيع الطاقة الكهربائية داخل مصنع ويحتوي على الآتي:</p>
     <ol style="list-style:none;padding-inline-start:4px">
     <li>(أ) مفتاح قدرة أوتوماتيكي: يعمل كمفتاح وقاية للمحول ووقاية لموصل تغذية الموزع الرئيس ووقاية للموزع الفرعي ويمكن عن طريقه فصل الكهرباء عن المنشأة بأكملها.</li>
     <li>(ب) مفتاح قدرة أوتوماتيكي: يعمل كمفتاح وقاية لموصل تغذية الموزع الفرعي وللموزع الفرعي نفسه.</li>
     <li>(جـ) مفتاح قدرة في مدخل الموزع الفرعي: يعمل على فصل الموزع الفرعي.</li>
     <li>(د) مفتاح قدرة أوتوماتيكي: يعمل كمفتاح وقاية لموصل تغذية موزع الأحمال ولموزع الأحمال نفسه.</li>
     <li>(هـ) مفتاح قدرة في مدخل موزع المستهلك: يعمل على فصل موزع الأحمال. <span class="ref">ص 84</span></li>
     <li>(و) تجهيزات لوقاية الموصلات والأجهزة.</li></ol>
     <figure style="margin:12px 0 0">${box(fig41(),540)}<figcaption style="text-align:center;font-size:13px">الشكل <span class="ltr">(4-1)</span> مخطط لتوزيع الطاقة الكهربائية داخل مصنع <span class="ref">ص 84</span></figcaption></figure>`,ref:'ص 83–84'},
    {tip:String.raw`<ul><li>المخطط <b>خطي</b>: كل مسار يُرسم بخط واحد، و<b>الشرطة المائلة مع رقم</b> تبين عدد الموصلات أو الأقطاب: «3» قبل المحول، و«4» بعده، و«5» على موزعي الأحمال، و«3» على كل مفتاح.</li>
     <li>كل مفتاح داخل مربع. <b>مفتاح القدرة الأوتوماتيكي</b> (أ، ب، د، و) = ذراع مائلة ومعها علامة صغيرة للفصل الأوتوماتيكي. <b>مفتاح الفصل</b> (جـ، هـ) = ذراع مائلة فقط.</li>
     <li>لاحظ الترتيب المتكرر: <b>مفتاح أوتوماتيكي يحمي</b> الموصل الخارج من القضيب، ثم <b>مفتاح فصل</b> عند مدخل القضيب التالي (ب ثم جـ، د ثم هـ). مفتاح الفصل يُستعمل لعزل الموزع عند الصيانة.</li></ul>`,title:'كيف تقرأ الشكل (4-1)'},
    {title:'مختبر مصغّر: يحمي أم يفصل فقط؟',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل حرف في الشكل (4-1) اختر نوعه بحسب وصف الكتاب.',cats:['أوتوماتيكي: وقاية وفصل','فصل فقط'],items:[
     ['(أ)',0,'«مفتاح قدرة أوتوماتيكي: يعمل كمفتاح وقاية للمحول…».'],
     ['(جـ)',1,'«مفتاح قدرة في مدخل الموزع الفرعي: يعمل على فصل الموزع الفرعي».'],
     ['(د)',0,'«مفتاح قدرة أوتوماتيكي: يعمل كمفتاح وقاية لموصل تغذية موزع الأحمال…».'],
     ['(هـ)',1,'«مفتاح قدرة في مدخل موزع المستهلك: يعمل على فصل موزع الأحمال».'],
     ['(ب)',0,'«مفتاح قدرة أوتوماتيكي: يعمل كمفتاح وقاية لموصل تغذية الموزع الفرعي وللموزع الفرعي نفسه».']]})},
    {title:'مختبر مصغّر: ضع العطل وانظر من يفصل',widget:(el,B)=>DCML.lab(el,B,{intro:'اختر مكان القصر في الشكل (4-1). محاكاة منطقية بلا أرقام: يفصل أقرب جهاز <b>وقاية</b> فوق العطل.',
     predict:{q:'وقع قصر على قضيب الموزع الفرعي. أي جهاز يفصل؟',opts:[['(أ)',false,'(أ) أبعد؛ يوجد جهاز وقاية أقرب إلى العطل.'],['(جـ)',false,'(جـ) للفصل فقط وليس للوقاية.'],['(ب)',true,'(ب) «وقاية لموصل تغذية الموزع الفرعي وللموزع الفرعي نفسه»، و(جـ) بينهما للفصل فقط.']]},
     ins:[{k:'f',l:'مكان القصر',seg:[['LMP','المصباح (3)'],['M6','المحرك (6)'],['lb1','موزع الأحمال الأيسر'],['sb','قضيب الموزع الفرعي'],['mb','قضيب الموزع الرئيس']],v:'LMP'}],
     calc:s=>{const st={open:{},trip:{}};const en=energize(D41,['in','tx'],st),out=[];tripUp(D41,FNODE41[s.f],st,en,out);const en2=energize(D41,['in','tx'],st);
      const lost=LOAD41.filter(([,n])=>!en2[n]).map(x=>x[2]);
      return {pic:fig41({live:1,en:en2,st,nums:1,fault:s.f}),facts:[['فصل',out.map(x=>NAME41[x]).join('، '),'bad'],['أحمال انقطعت (من 7)',String(lost.length)]],
       msg:`قصر عند <b>${NAME41[s.f]}</b>: فصل <b>${out.map(x=>NAME41[x]).join(' و')}</b> فقط. ${lost.length?'انقطع: '+lost.join('، ')+'، وبقي الباقي يعمل.':''}`}}})},
    {watch:String.raw`<p>الكتاب لا يسمّي الحمل الحراري (المستطيل المقسوم بخطوط) ولا الكونتاكتور في الشكل (4-1)؛ ذكرنا اسميهما من رموز الكتاب في الوحدة الثانية.</p>`,fix:1}
   ]},

  {recap:[
   'تُغذّى المصانع في العادة من شبكة الجهد المتوسط، وفي حالات عديدة من الجهد العالي، ولها تجهيزات تحويل ومفاتيح خاصة بها (ص 83).',
   'لتوزيع الطاقة يجب معرفة القدرة والجهد والتيار للأحمال، وتُجمع أجهزة الوقاية والتحكم على لوحات التوزيع (ص 83).',
   'الشبكة الشعاعية: الفروع تنطلق من نقطة التغذية، وعطل في شعاع لا يضر باقي المصنع (ص 83).',
   'في الشكل (4-1): (أ)، (ب)، (د) أوتوماتيكية للوقاية؛ (جـ) و(هـ) للفصل فقط؛ (و) تجهيزات وقاية الموصلات والأجهزة.']}
],
 theory:[
  {h:'الوحدة الرابعة: الدوائر الخطية والتنفيذية لتغذية المصانع وشبكات التوزيع',ref:'ص 81–82',html:`<p><b>الهدف العام للوحدة:</b> القدرة على رسم الدوائر الخطية والتنفيذية لتوصيلات المصانع.</p>
   <p><b>الأهداف التفصيلية:</b></p><ol><li>أن يتمكن المتدرب من رسم مخططات التغذية للمصانع.</li><li>أن يتمكن المتدرب من رسم لوحات التوزيع داخل المصانع.</li></ol>`},
  {h:'٤-١ المقدمة',ref:'ص 83',html:`<p>نظراً لأن كل منشأة صناعية لها ملامحها وخصائصها ومتطلباتها الخاصة من ناحية توزيع الطاقة الكهربائية فيها فإنه لا يمكن وضع قواعد قياسية عامة بهدف اتباعها في عمل مخططات التغذية داخل المصانع، ومع هذا فإن عمل التصميم متشابه إلى حد كبير في القواعد والمبادئ الأساسية. يتم توزيع الطاقة الكهربائية على الأحمال حسب توزيعها داخل المنشآت «المصانع»، وبالتالي يجب معرفة <b>القدرة الكهربائية والجهد والتيار</b> لهذه الأحمال. وقد جُمعت أجهزة الوقاية والتحكم على لوحات تُسمّى <b>لوحات التوزيع</b>.</p>`},
  {h:'٤-٢ مخططات التغذية في المصانع',ref:'ص 83',html:`<p>تستخدم <b>الشبكات الكهربائية الشعاعية</b> في الصناعة، وهي تتميز بأن أفرع الموصلات تنطلق من نقطة التغذية بشكل شعاعي ويكون على كل جزء من الموصل عدة أحمال، وهذا النوع يستخدم في شبكات الجهد المنخفض والمتوسط، وتتميز الشبكات الشعاعية في المصانع بأنه <b>عند حدوث عطل في أي شعاع لا يتضرر باقي المصنع</b> من ذلك.</p>
   <p>وفي العادة لا يمكن تغذية المصانع من الشبكة المحلية بل تغذى من <b>شبكة الجهد المتوسط</b> وفي حالات عديدة من <b>شبكة الجهد العالي</b>. ويجب على المصانع أن تنشئ تجهيزات تحويل وتجهيزات مفاتيح خاصة بها وأن تعتني بها. وتوزيع الطاقة يعتمد على ترتيب الأحمال على أرض المصنع وعلى درجة الأمان المطلوبة للإمداد.</p>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> «شعاعية» تعني أن كل فرع يخرج من نقطة التغذية ويمضي وحده إلى أحماله مثل أشعة الشمس، ولا يعود فيلتقي بفرع آخر. لذلك إذا فصل جهاز الوقاية على فرع معطوب انقطع ذلك الفرع وحده. جرّب ذلك في تبويب «المختبر».'},
  {html:`<p>الشكل (4-1) يبين مخططاً لتوزيع الطاقة الكهربائية داخل مصنع ويحتوي على الآتي:</p>
   <ol style="list-style:none;padding-inline-start:4px">
   <li><b>(أ) مفتاح قدرة أوتوماتيكي:</b> يعمل كمفتاح وقاية للمحول ووقاية لموصل تغذية الموزع الرئيس ووقاية للموزع الفرعي، ويمكن عن طريقه فصل الكهرباء عن المنشأة بأكملها.</li>
   <li><b>(ب) مفتاح قدرة أوتوماتيكي:</b> يعمل كمفتاح وقاية لموصل تغذية الموزع الفرعي وللموزع الفرعي نفسه.</li>
   <li><b>(جـ) مفتاح قدرة في مدخل الموزع الفرعي:</b> يعمل على فصل الموزع الفرعي.</li>
   <li><b>(د) مفتاح قدرة أوتوماتيكي:</b> يعمل كمفتاح وقاية لموصل تغذية موزع الأحمال ولموزع الأحمال نفسه.</li>
   <li><b>(هـ) مفتاح قدرة في مدخل موزع المستهلك:</b> يعمل على فصل موزع الأحمال. <span class="ref">ص 84</span></li>
   <li><b>(و)</b> تجهيزات لوقاية الموصلات والأجهزة.</li></ol>`},
  {fig:'(4-1)',ref:'ص 84',caption:'مخطط لتوزيع الطاقة الكهربائية داخل مصنع',draw:()=>box(fig41(),540)},
  {h:'كيف تقرأ الشكل (4-1)',ref:'ص 84',html:`<ul>
   <li>المخطط <b>خطي</b> (الدائرة الخطية): كل مسار يُرسم بخط واحد، و<b>الشرطة المائلة مع رقم</b> تبين عدد الموصلات أو الأقطاب: «3» قبل المحول، و«4» بعده، و«5» على موزعي الأحمال، و«3» على كل مفتاح (ثلاثة أقطاب).</li>
   <li>كل مفتاح داخل مربع. <b>مفتاح القدرة الأوتوماتيكي</b> (أ، ب، د، و) = ذراع مائلة ومعها علامة صغيرة للفصل الأوتوماتيكي. <b>مفتاح الفصل</b> (جـ، هـ) = ذراع مائلة فقط.</li>
   <li>القضبان خطوط أفقية سميكة، والعُقد عليها نقاط مصمتة.</li>
   <li>الأحمال من اليسار: محرك عبر (و)؛ محرك عبر مصهر وكونتاكتور؛ إضاءة (×) عبر قاطع آلي؛ مقبس عبر قاطع آلي؛ حمل حراري (مستطيل مقسوم بخطوط) عبر مصهر؛ محرك عبر (و) وكونتاكتور.</li></ul>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> لاحظ الترتيب المتكرر في كل مستوى: <b>مفتاح أوتوماتيكي يحمي</b> الموصل الخارج من القضيب، ثم <b>مفتاح فصل</b> عند مدخل القضيب التالي (ب ثم جـ، د ثم هـ). مفتاح الفصل يُستعمل لعزل الموزع عند الصيانة.'},
  {err:'<span class="fixnote">في رأس الصفحة ص 83 عنوان الوحدة «الدوائر الخطية والتنفيذية لتغذية المصانع» بلا «وشبكات التوزيع» الموجودة في الغلاف ص 81. وفي ص 83 «تسمي» صحّحناها إلى «تُسمّى». الكتاب لا يسمّي الحمل الحراري (المستطيل المقسوم بخطوط) ولا الكونتاكتور في الشكل (4-1)؛ ذكرنا اسميهما من رموز الكتاب في الوحدة الثانية.</span>'}
 ],
 lab:(el)=>lab41(el),
 examples:[{title:'مثال مرسوم: بناء المخطط (4-1) من الأعلى إلى الأسفل',ref:'ص 84',
  q:'<p>ارسم مخطط توزيع الطاقة داخل المصنع (الشكل 4-1) خطوة بخطوة: من المحول في الأعلى إلى الأحمال في الأسفل. الجزء الجديد في كل خطوة بلون مميَّز.</p>',
  solve:()=>[
   ['نبدأ من الأعلى: خط الدخول (شرطة «3») ← <b>المحول</b> ← خط بأربعة موصلات (شرطة «4») ← المربع <b>(أ)</b> مفتاح قدرة أوتوماتيكي ← <b>قضيب الموزع الرئيس</b>.',1],
   ['من الموزع الرئيس مخرجان: على اليسار مفتاح أوتوماتيكي ينتهي بسهم إلى جزء آخر من المصنع، وعلى اليمين <b>(ب)</b> ثم <b>(جـ)</b> مفتاح الفصل ← <b>قضيب الموزع الفرعي</b>.',2],
   ['من الموزع الفرعي <b>ثلاثة فروع متماثلة</b>، كل فرع: <b>(د)</b> مفتاح أوتوماتيكي ← <b>(هـ)</b> مفتاح فصل ← قضيب موزع أحمال (شرطة «5» على الأيسر والأوسط).',3],
   ['أحمال الموزع الأيسر: محرك عبر مفتاح أوتوماتيكي (و) بأربعة موصلات؛ ومحرك عبر مصهر ثم كونتاكتور.',4],
   ['أحمال الموزع الأوسط: إضاءة (×) ومقبس، كل منهما عبر قاطع آلي بثلاثة موصلات.',5],
   ['أحمال الموزع الأيمن: حمل حراري عبر مصهر (خمسة موصلات)، ومحرك عبر (و) ثم كونتاكتور. ونضيف الأسهم والحروف.',6],
   ['اكتمل المخطط. راجع: كل مفتاح في مربع وعليه «3»، وعدد الشرط على كل خط كما في الكتاب.',7]
  ].map(([t,n],i,a)=>({t:t+box(fig41({stage:n}),460),final:i===a.length-1}))}],
 quiz:[
  {q:'ما نوع الشبكات الكهربائية المستخدمة في الصناعة كما يذكر الكتاب؟',o:['الحلقية','الشعاعية','الشبكية المغلقة','الهوائية'],c:1,e:'«تستخدم الشبكات الكهربائية الشعاعية في الصناعة» (ص 83).'},
  {q:'ما الميزة التي يذكرها الكتاب للشبكة الشعاعية في المصانع؟',o:['لا تحتاج مفاتيح','عند حدوث عطل في أي شعاع لا يتضرر باقي المصنع','لا تحتاج محولاً','تعمل بلا لوحات توزيع'],c:1,e:'(ص 83). جرّبه في المختبر: القصر يفصل فرعه فقط.'},
  {q:'من أي شبكة تُغذّى المصانع في العادة؟',o:['من الشبكة المحلية دائماً','من شبكة الجهد المتوسط، وفي حالات عديدة من شبكة الجهد العالي','من بطاريات','من مولد صغير فقط'],c:1,e:'«في العادة لا يمكن تغذية المصانع من الشبكة المحلية بل تغذى من شبكة الجهد المتوسط وفي حالات عديدة من شبكة الجهد العالي» (ص 83).'},
  {q:'أي مفتاح في الشكل (4-1) يمكن عن طريقه فصل الكهرباء عن المنشأة بأكملها؟',o:['(أ)','(ب)','(جـ)','(هـ)'],c:0,e:'(أ) مفتاح القدرة الأوتوماتيكي بعد المحول (ص 83).'},
  {q:'ما وظيفة المفتاح (جـ)؟',o:['وقاية المحول','فصل الموزع الفرعي','وقاية المحرك','قياس التيار'],c:1,e:'«مفتاح قدرة في مدخل الموزع الفرعي: يعمل على فصل الموزع الفرعي» (ص 83).'},
  {q:'ماذا تعني الشرطة المائلة وبجانبها «4» على الخط الخارج من المحول؟',o:['أربعة مفاتيح','أربعة موصلات','أربعة محولات','قدرة 4 kW'],c:1,e:'في الدائرة الخطية عدد الموصلات يُبيَّن بشرطة ورقم.'},
  {q:'وقع قصر على قضيب موزع الأحمال الأيسر. أي جهاز يفصل (في محاكاة المختبر)؟',o:['(أ)','(ب)','(د) الخاص بهذا الموزع','كل المفاتيح'],c:2,e:'(د) «وقاية لموصل تغذية موزع الأحمال ولموزع الأحمال نفسه» (ص 83)، فيفصل هو وحده ويبقى باقي المصنع يعمل.'}
 ]
});

/* =====================================================================
   الشكل (4-2) ص 86 — قطاع أفقي لورشة صغيرة فيها التوصيلات الكهربائية للإدارة والإضاءة
   ===================================================================== */
const D42=[{id:'F1',p:'bus',c:'m1',prot:1},{id:'Q1',p:'m1',c:'m2',prot:1},{id:'F2',p:'bus',c:'l1',prot:1},{id:'F3',p:'l1',c:'l2',prot:1},{id:'S1',p:'l2',c:'lp'}];
const HB42={IN:[488,96,72,28],BUS:[470,58,20,104],HL:[40,52,420,22],HT:[34,296,32,52],F1:[426,98,48,24],F2:[426,138,48,24],F3:[426,183,48,24],ML:[150,90,270,22],Q1:[132,166,40,62],MOT:[140,258,40,62],
 N1:[468,260,24,24],LL:[300,256,166,24],FL:[200,260,100,24],N2:[468,308,24,24],SW:[404,298,62,30],N3:[308,408,24,24],SO1:[134,356,32,36],SO2:[304,356,32,36],BL:[160,410,300,20]};
const SOCKU=(x,y,k,on)=>(on?`<circle class="runbg" cx="${x}" cy="${y-6}" r="13"/>`:'')+P(`M${x-10} ${y-11} A10 10 0 0 0 ${x+10} ${y-11}`,k)+L(x-7,y,x+7,y,k);
function fig42(S){S=S||{};const g=mkG(S),lv=!!S.live;const st=S.st||{open:{},trip:{}};
 const k=n=>lv?(S.en[n]?'on':'off'):'';const on=n=>lv&&S.en[n];
 const fs=id=>lv&&st.open[id]?'x':'';const ds=id=>lv?(st.open[id]?'o':'c'):undefined;
 let s='';
 if(S.sel&&HB42[S.sel]){const b=HB42[S.sel];s+=`<rect class="selr" x="${b[0]-2}" y="${b[1]-2}" width="${b[2]+4}" height="${b[3]+4}" rx="6"/>`}
 /* الجدران والنافذة والباب */
 s+=g(1,`<rect class="wall" x="0" y="10" width="520" height="12"/><rect class="wall" x="0" y="440" width="520" height="12"/><rect class="wall" x="508" y="10" width="12" height="280"/><rect class="wall" x="508" y="350" width="12" height="102"/>`
  +`<rect class="wall2" x="150" y="7" width="90" height="18"/>`+L(150,16,240,16,'','thin')
  +P('M508 290 A60 60 0 0 0 448 350','gray','thin')+L(448,350,508,350,'gray','thin')
  +L(560,110,494,110,k('in'))+AHF(484,110,'l')+TKH(538,110,5,k('in'))+L(480,62,480,160,k('bus'),'bus'));
 /* خط السخان (بلا مصهر مرسوم) */
 s+=g(2,L(480,64,50,64,k('bus'))+L(50,64,50,300,k('bus'))+T(290,57,'3*4mm² + 2.5mm²',{sz:11})+HEAT(50,300,k('bus'),on('bus'),44));
 /* خط المحرك */
 s+=g(3,FUH(480,426,110,fs('F1'),k('bus'),k('m1'),true)+T(456,99,'3',{sz:11})+T(452,129,'20A',{sz:11})+L(426,110,160,110,k('m1'))+T(290,103,'3*4mm² + 2.5mm²',{sz:11})
  +L(160,110,160,170,k('m1'))+SW(160,170,226,'mcb',ds('Q1'),k('m1'),k('m2'))+L(160,226,160,264,k('m2'))+MOT(160,280,k('m2'),on('m2'),16)+T(160,314,'3 Kw',{sz:11}));
 /* خط الإضاءة: مصهر 20A ثم مصهر 10A ثم علبة التفريع 1 والفلورسنت */
 s+=g(4,FUH(480,426,150,fs('F2'),k('bus'),k('l1'),true)+T(456,139,'3',{sz:11})+T(452,169,'20A',{sz:11})+L(426,150,405,150,k('l1'))+L(405,150,405,195,k('l1'))+L(405,195,428,195,k('l1'))
  +FUH(474,428,195,fs('F3'),k('l2'),k('l1'))+T(452,214,'10A',{sz:11})+L(474,195,480,195,k('l2'))+L(480,195,480,268,k('l2'))+ODOT(480,272,k('l2'),4)
  +L(476,272,295,272,k('l2'))+TKH(340,272,3,k('l2'))+T(400,262,'3*1.5mm²',{sz:11})+FLH(250,272,90,k('lp'),on('lp'),'60w'));
 /* المفتاح المفرد والمقابس */
 s+=g(5,L(480,276,480,316,k('l2'))+TK(480,296,4,k('l2'))+ODOT(480,320,k('l2'),4)+L(476,320,424,320,k('l2'))+TKH(462,320,null,k('l2'))+TKH(454,320,null,k('l2'))+SW1(420,320,k('l2'),lv&&!st.open.S1)
  +L(480,324,480,420,k('l2'))+TK(480,398,3,k('l2'))+L(480,420,324,420,k('l2'))+ODOT(320,420,k('l2'),4)+L(316,420,150,420,k('l2'))
  +L(320,416,320,372,k('l2'))+TK(320,398,3,k('l2'))+SOCKU(320,372,k('l2'),on('l2'))+L(150,420,150,372,k('l2'))+TK(150,398,3,k('l2'))+SOCKU(150,372,k('l2'),on('l2')));
 if(S.nums)s+=T(480,290,'1',{sz:10,c:'m',a:'r'})+T(497,338,'2',{sz:10,c:'m'})+T(320,438,'3',{sz:10,c:'m'});
 if(S.hits)s+=Object.entries(HB42).map(([kk,b])=>HIT(kk,...b)).join('');
 return SVG(560,460,s)}
const I42={
 IN:{t:'التغذية',ref:'ص 86',d:'خط من خارج الجدار عليه شرطة «5» (خمسة موصلات) ينتهي بسهم إلى قضيب التوزيع. <b>توضيح للمتدرب (ليس من نص الكتاب):</b> الأرجح ثلاثة أوجه وموصل تعادل وموصل حماية.'},
 BUS:{t:'قضيب التوزيع (علبة التوزيع «المصدر»)',ref:'ص 85–86',d:'منه تخرج ثلاثة خطوط. يقول الكتاب: «يحسب مقطع الكابل الذي يحمل الطاقة الكهربائية من علبة التوزيع "المصدر" حتى آلة التشغيل عندما تعرف قدرة هذه الآلة وضغط تشغيلها».'},
 HL:{t:'خط السخان «3*4mm² + 2.5mm²»',ref:'ص 86',d:'ثلاثة موصلات مقطع كل منها <span class="ltr">4 mm²</span> وموصل رابع مقطعه <span class="ltr">2.5 mm²</span>. في الشكل يخرج هذا الخط من القضيب <b>بلا مصهر مرسوم</b>.'},
 HT:{t:'السخان',ref:'ص 85',d:'«سخان خاص بماكينة تشكيل بلاستيك ٣٨٠ فولت قدرة ٣ كيلووات». رمزه مستطيل قائم مقسوم بخطوط أفقية.'},
 F1:{t:'مصهر 20A',ref:'ص 86',d:'مصهر ثلاثي (الشرطة «3») تحته «20A» على خط المحرك.'},
 ML:{t:'خط المحرك «3*4mm² + 2.5mm²»',ref:'ص 86',d:'ثلاثة موصلات <span class="ltr">4 mm²</span> وموصل <span class="ltr">2.5 mm²</span>. «وغالباً تستخدم كابلات معزولة توضع في باطن الأرض من أماكن لوحات التوزيع حتى المكان الموضوع فيه الآلة أو المحرك» (ص 85).'},
 Q1:{t:'قاطع آلي للمحرك',ref:'ص 86',d:'ذراع مائلة مع علامة الفصل الحراري وسهم: يشغّل المحرك ويفصله ويحميه.'},
 MOT:{t:'المحرك',ref:'ص 85',d:'«محرك ثلاثي الأوجه ٣٨٠ فولت قدرة ٣ كيلووات» — مكتوب تحته في الشكل «3 Kw».'},
 F2:{t:'مصهر 20A الثاني',ref:'ص 86',d:'مصهر ثلاثي «20A». من طرفه الأيسر ينزل خط إلى المصهر 10A.'},
 F3:{t:'مصهر 10A',ref:'ص 86',d:'يحمي دائرة الإضاءة والمقابس. من طرفه الأيمن ينزل الخط إلى علب التفريع.'},
 N1:{t:'علبة تفريع (1)',ref:'ص 86',d:'دائرة صغيرة مفرغة = علبة توزيع/تفريع (من اصطلاحات الوحدة الثالثة). منها خط إلى الفلورسنت، وخط لأسفل بأربعة موصلات.'},
 N2:{t:'علبة تفريع (2)',ref:'ص 86',d:'منها خط بسلكين (شرطتان) إلى المفتاح المفرد، وخط لأسفل بثلاثة موصلات إلى المقابس.'},
 N3:{t:'علبة تفريع (3)',ref:'ص 86',d:'منها خط بثلاثة موصلات إلى كل مقبس.'},
 LL:{t:'خط الإضاءة «3*1.5mm²»',ref:'ص 86',d:'ثلاثة موصلات (شرطة «3») مقطع كل منها <span class="ltr">1.5 mm²</span>.'},
 FL:{t:'مصباح الفلورسنت',ref:'ص 85–86',d:'النص: «مصباح فلورسانت للإضاءة»، والشكل يكتب داخله «60w».'},
 SW:{t:'مفتاح مفرد',ref:'ص 86',d:'دائرة صغيرة بذراع مائلة وعلم. يصله سلكان (شرطتان): الداخل إلى المفتاح والراجع منه إلى المصباح.'},
 SO1:{t:'مقبس',ref:'ص 85',d:'«مع (٢) مقبسين». تصله ثلاثة موصلات.'},
 SO2:{t:'مقبس',ref:'ص 85',d:'«مع (٢) مقبسين». تصله ثلاثة موصلات.'},
 BL:{t:'خط المقابس',ref:'ص 86',d:'ينزل من علبة التفريع 2 بثلاثة موصلات، ثم إلى العلبة 3 والمقبسين.'}};
function lab42(el){const st={open:{S1:1},trip:{}};let sup=1,sel=null;const w={};
 el.innerHTML=`<div class="grid">
  <div class="panel c7"><h2>ورشة صغيرة: القوى والإضاءة <small>مبنية على الشكل (4-2) ص 86</small></h2>
   <p class="sub">اضغط على مصهر لتنزعه أو تعيده، وعلى القاطع أو المفتاح لتشغّله، وعلى سهم التغذية لتفصلها. اضغط على أي شيء آخر لتعرف اسمه ومواصفاته.</p>
   <div class="svgbox" style="max-width:560px;margin-inline:auto" id="fg"></div>
   <div class="legend"><span><i style="background:var(--live)"></i>فيه تغذية</span><span><i style="background:var(--muted)"></i>بلا تغذية</span><span><i style="background:var(--stop)"></i>مصهر منزوع</span></div></div>
  <div class="panel c5"><h2>البطاقة</h2><div class="d4card" id="cd"></div><div class="callout" id="ms">المصباح مطفأ لأن المفتاح المفرد مفتوح. اضغط عليه.</div><div class="d4st" id="ls"></div>
   ${tries(['اضغط على المفتاح المفرد فيضيء الفلورسنت.','انزع المصهر 10A: ينطفئ المصباح وتنقطع المقابس، ويبقى المحرك والسخان.','انزع المصهر 20A العلوي: يقف المحرك وحده.','لاحظ أن السخان لا يتأثر بأي مصهر لأن خطه في الشكل بلا مصهر.'])}
   <div class="callout"><b>توضيح للمتدرب (ليس من نص الكتاب):</b> قرأنا الشكل هكذا: المصهر 20A العلوي للمحرك، والمصهر 20A الثاني ثم المصهر 10A لدائرة الإضاءة والمقابس، وخط السخان من القضيب مباشرة كما رُسم. انظر «ملاحظة على الكتاب» في الشرح.</div></div>
  <div class="panel c12"><h2>التجربة خطوة بخطوة</h2><ol class="steps" id="gs"></ol></div>
  <div class="panel c12"><h2>نشاط: اقرأ الرسم <small>عدد الموصلات ومقاطعها في الشكل (4-2)</small></h2><div id="mt"></div><div id="mt2" style="margin-top:14px"></div></div>
 </div>`;
 const $=s=>el.querySelector(s);let en={};
 const draw=()=>{en=energize(D42,sup?['in','bus']:[],st);
  $('#fg').innerHTML=fig42({live:1,en,st,sel,hits:1,nums:1});$('#cd').innerHTML=card(sel?I42[sel]:null);
  $('#ls').innerHTML=[['bus','السخان'],['m2','المحرك'],['lp','الفلورسنت'],['l2','المقبسان']].map(([n,t])=>`<span class="${en[n]?'on':'off'}">${t}</span>`).join('');gs.check()};
 $('#fg').addEventListener('click',e=>{const h=e.target.closest('[data-k]');if(!h)return;const k=h.dataset.k;sel=k;let m='';
  if(k==='IN'){sup=!sup;w.sup=!sup;m=sup?'أعدت التغذية.':'فصلت التغذية: انقطع كل شيء.'}
  else if(['F1','F2','F3'].includes(k)){if(st.open[k]){delete st.open[k];m='أعدت المصهر.'}else{st.open[k]=1;w[k]=1;m=k==='F1'?'نزعت مصهر المحرك: وقف المحرك وحده.':k==='F2'?'نزعت المصهر 20A الثاني: انقطعت الإضاءة والمقابس معاً لأن المصهر 10A يأتي بعده.':'نزعت المصهر 10A: انطفأ المصباح وانقطع المقبسان، وبقي المحرك والسخان.'}}
  else if(k==='Q1'){if(st.open.Q1){delete st.open.Q1;m='أغلقت القاطع الآلي: دار المحرك.'}else{st.open.Q1=1;w.Q1=1;m='فتحت القاطع الآلي: وقف المحرك.'}}
  else if(k==='SW'){if(st.open.S1){delete st.open.S1;w.S1=1;m='أغلقت المفتاح المفرد: أضاء الفلورسنت.'}else{st.open.S1=1;m='فتحت المفتاح المفرد: انطفأ الفلورسنت، وبقي المقبسان فيهما تيار.'}}
  if(m)$('#ms').innerHTML=m;draw()});
 const gs=stepsUI($('#gs'),[
  {t:'شغّل الإضاءة',x:'اضغط على المفتاح المفرد (قرب علبة التفريع 2). يضيء الفلورسنت 60w.',done:()=>!st.open.S1},
  {t:'افصل المحرك من قاطعه',x:'اضغط على القاطع الآلي فوق المحرك فيقف المحرك، ثم أعده.',done:()=>w.Q1&&!st.open.Q1},
  {t:'انزع المصهر 10A',x:'اضغط على المصهر 10A: تنقطع الإضاءة والمقابس معاً لأنها كلها خلفه.',done:()=>st.open.F3},
  {t:'انزع مصهر المحرك',x:'أعد المصهر 10A، ثم انزع المصهر 20A العلوي: يقف المحرك وحده.',done:()=>st.open.F1&&!st.open.F3},
  {t:'افصل التغذية',x:'أعد المصهر ثم اضغط على سهم التغذية (يمين الرسم): ينقطع كل شيء حتى السخان.',done:()=>!sup}],()=>w);
 matchUI($('#mt'),[['خط التغذية الداخل إلى القضيب','5'],['الخط بين علبة التفريع 1 وعلبة التفريع 2','4'],['الخط من علبة التفريع 1 إلى الفلورسنت','3'],['الخط من علبة التفريع 2 إلى المفتاح المفرد','2'],['الخط إلى كل مقبس','3']],
  [['2','2'],['3','3'],['4','4'],['5','5']],'كم موصلاً في كل خط؟ (عُدّ الشرطة أو اقرأ الرقم بجانبها.)');
 matchUI($('#mt2'),[['خط السخان','a'],['خط المحرك','a'],['خط الفلورسنت','b']],[['a','3*4mm² + 2.5mm²'],['b','3*1.5mm²']],'ما مقطع موصلات كل خط كما كُتب على الشكل؟');
 draw()}

B.lesson({
 id:'u4-l2',unit:4,order:2,pages:'85–86',
 title:'لوحات التوزيع وتوصيلات الورش للقوى والإضاءة',
 summary:'واجبا لوحة التوزيع في المصنع، وقراءة مخطط توصيلات ورشة صغيرة (4-2): محرك وسخان بقدرة 3 كيلووات، وفلورسنت ومقبسان، ومصاهر 20A و10A.',
 stations:[
  {intro:true},

  {st:1,short:'لوحات التوزيع',title:'٤-٣ لوحات التوزيع داخل المصانع',ref:'ص 85',
   q:'لوحة المصنع تعمل عادياً أغلب الوقت… فلماذا تُصمَّم لتتحمل أسوأ لحظة: الذروة والقصر؟',
   get art(){return U4ST.art(
     U4ST.tip('التغذية من المحول.',[160,14,40,58],L(180,14,180,28,'on')+XF(180,44,'on',11))
    +L(180,62,180,80,'on')
    +U4ST.tip('قاطع دورة ذو سعة عزل عالية: يجب أن يكون قادراً على تحمل قدرة القصر وإزالة الخطأ، وأن يعمل بسرعة عند حدوث الدورة القصيرة.',[146,78,56,58],RECT(158,80,44,52,'','thin')+SW(180,80,132,'cb','t','on','off'))
    +L(180,132,180,150,'off')+L(80,150,280,150,'off','bus')+[100,180,260].map(x=>DOT(x,150,'off')+L(x,150,x,176,'off')+FU(x,176,206,'','off','off')+L(x,206,x,228,'off')).join('')
    +MOT(100,244,'off',false,15)+LAMPX(180,244,'off',false,10)+SOCK(260,234,'off',false)
    +U4ST.tip('خطأ الدائرة القصيرة: يذكر الكتاب أنه ⟦25000 kVA⟧ تقريباً للوحات الأحمال الكبيرة.',[226,112,70,48],BOLT(250,136)+T(268,120,'25000 kVA',{sz:11,a:'l'}))
    +T(180,296,'القاطع الرئيس فصل عند القصر',{sz:13,w:700}),
    'لوحة توزيع: قاطع رئيس فصل عند حدوث قصر قدرته 25000 kVA تقريباً')},
   cap:'لحظة القصر: القاطع ذو سعة العزل العالية يفصل بسرعة.<br><b>مرّر المؤشر على القاطع والعطل (أو المسهما في الجوال) لتعرف المطلوب منهما.</b>',
   side:[
    {predict:{q:'بحسب الكتاب، كم يكون غالباً أقصى حمل يجب أن تتحمله مفاتيح وقواطع اللوحة عند الذروة؟',opts:[
     ['نصف الحمل الموجود في الموقع',false,'الكتاب يقول أكثر من ذلك بكثير.'],
     ['100% من الحمل الموجود في الموقع',true,'«وغالبا ما تكون 100% من الحمل الموجود في الموقع» مع الأخذ في الاعتبار التوسعات المستقبلية (ص 85).'],
     ['لا يهم الحمل عند الذروة',false,'الكتاب يبدأ الفقرة بوجوب تحمل أقصى حمل عند الذروة.']]}}
   ],
   body:[
    {book:String.raw`<p>تختلف لوحات التوزيع داخل المصانع، إذ يجب أن تتحمل المفاتيح وقواطع الدائرة الكهربائية أقصى حمل يحتمل استخدامه عند فترة الذروة، وغالباً ما تكون <span class="ltr">100%</span> من الحمل الموجود في الموقع، لذا يجب توفير لوحات ذات سعات كافية لتحمل تيار الأحمال الموجودة فعلاً مع الأخذ في الاعتبار التوسعات المستقبلية. وبصورة عامة يكون للوحات التوزيع واجبان:</p>
     <ol><li>عدم السماح بمرور تيار أكبر من قابلية الشبكة.</li><li>قطع الدائرة بسرعة مع تجنب حدوث دائرة قصيرة أو تسرب تيار أكثر من الطبيعي.</li></ol>
     <p>هناك ناحية أخرى تتميز بها لوحات التوزيع للأحمال الكبيرة وهي تحمل التيار عند حدوث خطأ قصر الدائرة، حيث إن خطأ الدائرة القصيرة <span class="ltr">25000 kVA</span> (٢٥٠٠٠ ك.ف.أ) تقريباً، وبما أن لوحات التوزيع بما تحتويه من قواطع دورة يجب أن تكون قادرة على تحمل هذه القدرة وإزالة مثل هذه الأخطاء، لذلك يفضل استخدام النوع المسمى بقواطع الدورة ذات سعات العزل العالية، إذ يجب أن تعمل بسرعة عند حدوث الدورة القصيرة، أما إذا كان الخطأ عابراً ولفترة قصيرة فيمكن أن تتحمل التيارات العابرة الناتجة عن ذلك.</p>
     <p><b>ملاحظة:</b> جميع الأمثلة على هذا الباب تختلف من مصنع إلى آخر ومن موقع إلى آخر. لذلك يتم تصميم لوحات التوزيع في المصانع بحسب المساحات والأحمال حسب التجهيزات والمسافات بينها.</p>`,ref:'ص 85'},
    {tip:String.raw`<p>اقرأ الفقرة على ثلاث حالات: <b>التشغيل العادي</b> (اللوحة تتحمل الحمل كله مع مكان للتوسعات)، <b>الحمل الزائد أو التسرب</b> (اللوحة تمنع تياراً أكبر من قابلية الشبكة وتقطع بسرعة)، و<b>القصر</b> (قواطع بسعة عزل عالية تتحمل قدرة القصر وتزيله، ولا تفصل بسبب خطأ عابر قصير).</p>`,title:'ثلاث حالات'},
    {add:String.raw`<p>«ك.ف.أ» = كيلو فولت أمبير <span class="ltr">(kVA)</span>، وهي وحدة القدرة الظاهرية. والقدرة هنا قدرة القصر التي قد تمر لحظة العطل، وهي أكبر بكثير من قدرة الأحمال العادية؛ لذلك تُذكر سعة القطع للقاطع منفصلة عن تياره المقنن.</p>`,title:'ما معنى ك.ف.أ؟'},
    {title:'مختبر مصغّر: واجبا لوحة التوزيع',widget:(el,B)=>DCML.sort(el,B,{intro:'أي هذه العبارات من «واجبَي» لوحة التوزيع كما في الكتاب؟',cats:['من الواجبين','ليس منهما'],items:[
     ['عدم السماح بمرور تيار أكبر من قابلية الشبكة.',0,'الواجب الأول (ص 85).'],
     ['رفع الجهد للأحمال البعيدة عن اللوحة.',1,'رفع الجهد عمل المحول، لا لوحة التوزيع.'],
     ['قطع الدائرة بسرعة مع تجنب حدوث دائرة قصيرة أو تسرب تيار أكثر من الطبيعي.',0,'الواجب الثاني (ص 85).'],
     ['الفصل عند كل خطأ عابر قصير مهما كان.',1,'الكتاب يقول العكس: «إذا كان الخطأ عابراً ولفترة قصيرة فيمكن أن تتحمل التيارات العابرة».']]})}
   ]},

  {st:2,short:'ورشة: قوى وإضاءة',title:'٤-٣-١ التوصيلات داخل المصانع والورش للقوى والإضاءة',ref:'ص 85–86',
   q:'محرك وسخان ومصباح ومقبسان في ورشة واحدة… هل يكفي خط واحد ومصهر واحد للجميع؟',
   get art(){return U4ST.art(
     U4ST.tip('قضيب التوزيع («علبة التوزيع المصدر»): منه تخرج الخطوط إلى الأحمال.',[288,52,24,180],L(300,60,300,226,'','bus'))
    +U4ST.tip('خط السخان: سخان ماكينة تشكيل البلاستيك ⟦380⟧ فولت قدرة ⟦3⟧ كيلووات. رسمه الكتاب يخرج من القضيب بلا مصهر.',[40,62,262,30],L(300,70,60,70)+L(60,70,60,96))+U4ST.tip('السخان: مستطيل قائم مقسوم بخطوط.',[44,94,32,50],HEAT(60,96,'',false,44))
    +U4ST.tip('مصهر ⟦20A⟧ على خط المحرك.',[244,112,58,32],FUH(300,250,128,'','','',true)+T(275,152,'20A',{sz:10}))+L(250,128,150,128)+L(150,128,150,152)+U4ST.tip('قاطع آلي للمحرك.',[120,150,40,52],SW(150,152,198,'mcb'))+L(150,198,150,214)+U4ST.tip('المحرك ثلاثي الأوجه ⟦380⟧ فولت قدرة ⟦3⟧ كيلووات.',[128,212,44,46],MOT(150,232,'',false,17))
    +U4ST.tip('مصهر ⟦20A⟧ ثم مصهر ⟦10A⟧: دائرة الإضاءة والمقابس.',[244,176,58,36],FUH(300,250,192,'','','',true)+T(275,216,'10A',{sz:10}))+L(250,192,234,192)+L(234,192,234,266)
    +L(234,266,212,266)+U4ST.tip('مصباح فلورسانت للإضاءة (يكتب الشكل داخله ⟦60w⟧).',[130,254,84,26],FLH(172,266,76,'',false,''))
    +T(180,300,'ثلاثة خطوط من قضيب واحد',{sz:13,w:700}),
    'قضيب توزيع يغذي سخاناً ومحركاً عبر مصهر وقاطع، ومصباحاً عبر مصهرين')},
   cap:'مخطط مبسّط من الشكل <span class="ltr">(4-2)</span> (المقبسان والمفتاح محذوفة هنا).<br><b>مرّر المؤشر على أي جزء (أو المسه في الجوال) لتعرف مواصفاته من الكتاب.</b>',
   side:[
    {predict:{q:'متى يمكن حساب مقطع الكابل من علبة التوزيع إلى الآلة بحسب الكتاب؟',opts:[
     ['عندما تُعرف قدرة الآلة وضغط تشغيلها',true,'«عندما تعرف قدرة هذه الآلة وضغط تشغيلها حيث يمكن حساب التيار وبالتالي يمكن معرفة مقطع هذا السلك» (ص 85).'],
     ['عندما يُعرف طول الورشة فقط',false,'الكتاب يربط المقطع بالتيار المحسوب من القدرة والجهد.'],
     ['لا يحتاج حساباً، يُختار دائماً 1.5 mm²',false,'في الشكل نفسه مقاطع مختلفة: 4 mm² للمحرك و1.5 mm² للإضاءة.']]}}
   ],
   body:[
    {book:String.raw`<p>عندما يراد توصيل الطاقة الكهربائية داخل المصانع والورش غالباً ما تستخدم محركات في إدارة الآلات أو معدات تسخين للصهر أو صناعة البلاستيك أو أي معدات أخرى تحتاج إلى الطاقة الكهربائية كقوة للتشغيل أو الإدارة. وفي هذه الحالة يحسب مقطع الكابل الذي يحمل الطاقة الكهربائية من علبة التوزيع «المصدر» حتى آلة التشغيل عندما تعرف قدرة هذه الآلة وضغط تشغيلها، حيث يمكن حساب التيار وبالتالي يمكن معرفة مقطع هذا السلك بالمليمتر المربع. وغالباً تستخدم كابلات معزولة توضع في باطن الأرض من أماكن لوحات التوزيع حتى المكان الموضوع فيه الآلة أو المحرك.</p>
     <p>والشكل (4-2) يبين قطاعاً أفقياً لورشة صغيرة بها محرك ثلاثي الأوجه <span class="ltr">380 V</span> قدرة <span class="ltr">3 kW</span> وسخان خاص بماكينة تشكيل بلاستيك <span class="ltr">380 V</span> قدرة <span class="ltr">3 kW</span> ومصباح فلورسانت للإضاءة مع (٢) مقبسين.</p>
     <figure style="margin:12px 0 0">${box(fig42(),560)}<figcaption style="text-align:center;font-size:13px">الشكل <span class="ltr">(4-2)</span> قطاع أفقي لورشة صغيرة فيها التوصيلات الكهربائية للإدارة والإضاءة <span class="ref">ص 86</span></figcaption></figure>`,ref:'ص 85–86'},
    {tip:String.raw`<ul><li><b>التغذية:</b> خط عليه شرطة «5» يدخل من خارج الجدار الأيمن إلى <b>قضيب توزيع</b> رأسي.</li>
     <li><b>الخط العلوي:</b> «3*4mm² + 2.5mm²» إلى السخان.</li>
     <li><b>الخط الثاني:</b> مصهر «20A» ← «3*4mm² + 2.5mm²» ← قاطع آلي ← محرك «M 3~» قدرته «3 Kw».</li>
     <li><b>الخط الثالث:</b> مصهر «20A» ← مصهر «10A» ← علبة تفريع (1): منها «3*1.5mm²» إلى الفلورسنت «60w»، ثم بأربعة موصلات إلى علبة (2): منها سلكان إلى المفتاح المفرد، ثم بثلاثة موصلات إلى علبة (3) والمقبسين.</li>
     <li>«3*4mm² + 2.5mm²» تُقرأ: ثلاثة موصلات مقطع كل منها <span class="ltr">4 mm²</span> وموصل رابع <span class="ltr">2.5 mm²</span>.</li></ul>`,title:'كيف تقرأ الشكل (4-2)'},
    {title:'مختبر مصغّر: انزع مصهراً',widget:(el,B)=>DCML.lab(el,B,{intro:'اختر المصهر الذي تنزعه وراقب الأحمال في الشكل (4-2). (الإضاءة هنا مضاءة: المفتاح المفرد مغلق.)',
     predict:{q:'نزعت المصهر 10A. ماذا يحدث للمحرك؟',opts:[['يقف المحرك',false,'المحرك على خط آخر خلف مصهر 20A الخاص به.'],['يبقى المحرك يعمل',true,'المصهر 10A يحمي دائرة الإضاءة والمقابس وحدها.'],['يقف المحرك والسخان',false,'السخان خطه من القضيب مباشرة كما رُسم.']]},
     ins:[{k:'f',l:'المصهر المنزوع',seg:[['n','لا شيء'],['F1','20A (المحرك)'],['F2','20A (الثاني)'],['F3','10A']],v:'n'}],
     calc:s=>{const st={open:{},trip:{}};if(s.f!=='n')st.open[s.f]=1;const en=energize(D42,['in','bus'],st);
      const L4=[['bus','السخان'],['m2','المحرك'],['lp','الفلورسنت'],['l2','المقبسان']];
      return {pic:fig42({live:1,en,st}),facts:L4.map(([n,t])=>[t,en[n]?'فيه تيار':'انقطع',en[n]?'hi':'bad']),
       msg:{n:'كل المصاهر في مكانها: كل الأحمال تعمل.',F1:'نزعت مصهر المحرك: وقف المحرك وحده.',F2:'نزعت المصهر 20A الثاني: انقطعت الإضاءة والمقابس معاً لأن المصهر 10A يأتي بعده.',F3:'نزعت المصهر 10A: انطفأ المصباح وانقطع المقبسان، وبقي المحرك والسخان.'}[s.f]}}})},
    {book:String.raw`<p><b>ملاحظة:</b> عند عمل التوصيلات داخل المصانع والورش يجب أن تحدد مواقع المحركات داخل المصنع والورشة وكذلك أماكن توزيع المصابيح للإضاءة، ويجب أن تخصص لوحة للإضاءة وأخرى للقوى حتى تكون الإضاءة منفصلة تماماً عن القوى، ويجب أن تحدد قدرة كل محرك حتى يمكن اختيار الكابل المناسب لكل محرك وكذلك الأسلاك المناسبة للإضاءة.</p>
     <p>فمثلاً عند عمل التوصيلات اللازمة لمصنع صغير به ٤ محركات تيار متغير ثلاثي الأوجه ومحركا تيارا متغيرا وجها واحد وكذلك الإضاءة لخمسة مصابيح فلورسانت فتجهز لوحة للقوى الرئيسة وكذلك لوحة للإضاءة، على أن تمد الكابلات من اللوحة الرئيسة حتى أماكن المحركات وكذلك تمد الأسلاك من لوحة الإضاءة حتى مواقع المصابيح.</p>`,ref:'ص 86'},
    {watch:String.raw`<p>في الشكل (4-2) ص 86: خط السخان العلوي يخرج من القضيب <b>بلا مصهر مرسوم</b> بينما على الخطين الآخرين مصهران 20A؛ ويبدو الخط النازل إلى علب التفريع في المطبوع ملتصقاً بالقضيب، فرسمناه يبدأ من خرج المصهر 10A (فتصير الإضاءة والمقابس خلف المصهر 20A الثاني ثم 10A). والنص يذكر «مصباح فلورسانت» بلا قدرة والشكل يكتب «60w». وفي ص 86 «محركا تيارا متغيرا وجها واحد» يُقصد بها — كما في ص 87 — محركان أحاديا الوجه.</p>`,fix:1}
   ]},

  {recap:[
   'تتحمل مفاتيح اللوحة وقواطعها أقصى حمل عند الذروة (غالباً 100% من الحمل الموجود) مع حساب التوسعات المستقبلية (ص 85).',
   'واجبا اللوحة: منع تيار أكبر من قابلية الشبكة، وقطع الدائرة بسرعة عند القصر أو التسرب (ص 85).',
   'للأحمال الكبيرة قواطع دورة بسعة عزل عالية لأن خطأ القصر نحو 25000 kVA (ص 85).',
   'مقطع الكابل يُعرف من التيار المحسوب من قدرة الآلة وجهدها؛ ولوحة للإضاءة وأخرى للقوى (ص 85–86).']}
],
 theory:[
  {h:'٤-٣ لوحات التوزيع داخل المصانع',ref:'ص 85',html:`<p>تختلف لوحات التوزيع داخل المصانع، إذ يجب أن تتحمل المفاتيح وقواطع الدائرة الكهربائية <b>أقصى حمل</b> يحتمل استخدامه عند فترة الذروة، وغالباً ما تكون <span class="ltr">100%</span> من الحمل الموجود في الموقع، لذا يجب توفير لوحات ذات سعات كافية لتحمل تيار الأحمال الموجودة فعلاً مع الأخذ في الاعتبار <b>التوسعات المستقبلية</b>. وبصورة عامة يكون للوحات التوزيع واجبان:</p>
   <ol><li>عدم السماح بمرور تيار أكبر من قابلية الشبكة.</li><li>قطع الدائرة بسرعة مع تجنب حدوث دائرة قصيرة أو تسرب تيار أكثر من الطبيعي.</li></ol>
   <p>هناك ناحية أخرى تتميز بها لوحات التوزيع للأحمال الكبيرة وهي تحمل التيار عند حدوث خطأ قصر الدائرة، حيث إن خطأ الدائرة القصيرة <span class="ltr">25000 kVA</span> (٢٥٠٠٠ ك.ف.أ) تقريباً، وبما أن لوحات التوزيع بما تحتويه من قواطع دورة يجب أن تكون قادرة على تحمل هذه القدرة وإزالة مثل هذه الأخطاء، لذلك يفضل استخدام النوع المسمى <b>بقواطع الدورة ذات سعات العزل العالية</b>، إذ يجب أن تعمل بسرعة عند حدوث الدورة القصيرة، أما إذا كان الخطأ عابراً ولفترة قصيرة فيمكن أن تتحمل التيارات العابرة الناتجة عن ذلك.</p>
   <p><b>ملاحظة:</b> جميع الأمثلة على هذا الباب تختلف من مصنع إلى آخر ومن موقع إلى آخر. لذلك يتم تصميم لوحات التوزيع في المصانع بحسب المساحات والأحمال حسب التجهيزات والمسافات بينها.</p>`},
  {h:'٤-٣-١ التوصيلات داخل المصانع والورش للقوى والإضاءة',ref:'ص 85',html:`<p>عندما يراد توصيل الطاقة الكهربائية داخل المصانع والورش غالباً ما تستخدم محركات في إدارة الآلات أو معدات تسخين للصهر أو صناعة البلاستيك أو أي معدات أخرى تحتاج إلى الطاقة الكهربائية كقوة للتشغيل أو الإدارة. وفي هذه الحالة <b>يحسب مقطع الكابل</b> الذي يحمل الطاقة الكهربائية من علبة التوزيع «المصدر» حتى آلة التشغيل عندما تعرف قدرة هذه الآلة وضغط تشغيلها، حيث يمكن حساب التيار وبالتالي يمكن معرفة مقطع هذا السلك بالمليمتر المربع. وغالباً تستخدم <b>كابلات معزولة توضع في باطن الأرض</b> من أماكن لوحات التوزيع حتى المكان الموضوع فيه الآلة أو المحرك.</p>
   <p>والشكل (4-2) يبين قطاعاً أفقياً لورشة صغيرة بها <b>محرك ثلاثي الأوجه <span class="ltr">380 V</span> قدرة <span class="ltr">3 kW</span></b> و<b>سخان خاص بماكينة تشكيل بلاستيك <span class="ltr">380 V</span> قدرة <span class="ltr">3 kW</span></b> و<b>مصباح فلورسانت</b> للإضاءة مع <b>(٢) مقبسين</b>.</p>`},
  {fig:'(4-2)',ref:'ص 86',caption:'قطاع أفقي لورشة صغيرة فيها التوصيلات الكهربائية للإدارة والإضاءة',draw:()=>box(fig42(),560)},
  {h:'كيف تقرأ الشكل (4-2)',ref:'ص 86',html:`<ul>
   <li><b>التغذية:</b> خط عليه شرطة «5» يدخل من خارج الجدار الأيمن إلى <b>قضيب توزيع</b> رأسي.</li>
   <li><b>الخط العلوي:</b> «3*4mm² + 2.5mm²» إلى السخان (مستطيل مقسوم بخطوط).</li>
   <li><b>الخط الثاني:</b> مصهر «20A» ← «3*4mm² + 2.5mm²» ← قاطع آلي ← محرك «M 3~» قدرته «3 Kw».</li>
   <li><b>الخط الثالث:</b> مصهر «20A» ← مصهر «10A» ← علبة تفريع (1): منها «3*1.5mm²» إلى الفلورسنت «60w»، ثم بأربعة موصلات إلى علبة (2): منها سلكان إلى المفتاح المفرد، ثم بثلاثة موصلات إلى علبة (3) والمقبسين.</li></ul>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> «3*4mm² + 2.5mm²» تُقرأ: ثلاثة موصلات مقطع كل منها <span class="ltr">4 mm²</span> (الأوجه الثلاثة) وموصل رابع <span class="ltr">2.5 mm²</span>. والرسم مسقط أفقي، فالخطوط تبين مسار الكابلات على أرض الورشة وجدرانها، والجدار المهشّر مقطوع أفقياً.'},
  {html:`<p><b>ملاحظة:</b> عند عمل التوصيلات داخل المصانع والورش يجب أن تحدد <b>مواقع المحركات</b> داخل المصنع والورشة وكذلك <b>أماكن توزيع المصابيح</b> للإضاءة، ويجب أن <b>تخصص لوحة للإضاءة وأخرى للقوى</b> حتى تكون الإضاءة منفصلة تماماً عن القوى، ويجب أن تحدد قدرة كل محرك حتى يمكن اختيار الكابل المناسب لكل محرك وكذلك الأسلاك المناسبة للإضاءة. <span class="ref">ص 86</span></p>
   <p>فمثلاً عند عمل التوصيلات اللازمة لمصنع صغير به <b>٤ محركات تيار متغير ثلاثي الأوجه</b> و«محركا تيارا متغيرا وجها واحد» وكذلك الإضاءة <b>لخمسة مصابيح فلورسانت</b> فتجهز لوحة للقوى الرئيسة وكذلك لوحة للإضاءة، على أن تمد الكابلات من اللوحة الرئيسة حتى أماكن المحركات وكذلك تمد الأسلاك من لوحة الإضاءة حتى مواقع المصابيح. (لوحة القوى في الدرس التالي، ولوحة الإضاءة في الدرس 4.4.)</p>`},
  {err:'<span class="fixnote">في الشكل (4-2) ص 86: خط السخان العلوي يخرج من القضيب <b>بلا مصهر مرسوم</b> بينما على الخطين الآخرين مصهران 20A؛ ويبدو الخط النازل إلى علب التفريع في المطبوع ملتصقاً بالقضيب، فرسمناه يبدأ من خرج المصهر 10A (فتصير الإضاءة والمقابس خلف المصهر 20A الثاني ثم 10A). والنص يذكر «مصباح فلورسانت» بلا قدرة والشكل يكتب «60w». وفي ص 86 «محركا تيارا متغيرا وجها واحد» يُقصد بها — كما في ص 87 — محركان أحاديا الوجه.</span>'}
 ],
 lab:(el)=>lab42(el),
 examples:[{title:'مثال مرسوم: رسم توصيلات الورشة (4-2) خطوة بخطوة',ref:'ص 86',
  q:'<p>ارسم القطاع الأفقي للورشة الصغيرة وعليه توصيلات القوى والإضاءة كما في الشكل (4-2). الجزء الجديد في كل خطوة بلون مميَّز.</p>',
  solve:()=>[
   ['نرسم الجدران (بخطين وتهشير)، والنافذة في الجدار العلوي، والباب في الجدار الأيمن. ثم خط <b>التغذية</b> بخمسة موصلات وسهمه إلى <b>قضيب التوزيع</b>.',1],
   ['الخط العلوي إلى <b>السخان</b> ونكتب فوقه «3*4mm² + 2.5mm²».',2],
   ['خط <b>المحرك</b>: مصهر «20A» ثم الخط «3*4mm² + 2.5mm²» ثم <b>القاطع الآلي</b> ثم المحرك «M 3~» ونكتب «3 Kw».',3],
   ['خط <b>الإضاءة</b>: مصهر «20A» ثم مصهر «10A» ثم علبة التفريع (1) والخط «3*1.5mm²» إلى <b>الفلورسنت 60w</b>.',4],
   ['من العلبة (1) بأربعة موصلات إلى العلبة (2) ومنها سلكان إلى <b>المفتاح المفرد</b>، ثم بثلاثة موصلات إلى العلبة (3) و<b>المقبسين</b>.',5],
   ['اكتمل الرسم. راجع عدد الشرط على كل خط ومقاطع الكابلات المكتوبة.',6]
  ].map(([t,n],i,a)=>({t:t+box(fig42({stage:n}),480),final:i===a.length-1}))}],
 quiz:[
  {q:'ما الواجبان العامان للوحات التوزيع كما في الكتاب؟',o:['الإنارة والتهوية','عدم السماح بمرور تيار أكبر من قابلية الشبكة، وقطع الدائرة بسرعة','رفع الجهد وخفضه','قياس القدرة وتخزينها'],c:1,e:'(ص 85).'},
  {q:'يجب أن تتحمل مفاتيح وقواطع لوحة المصنع أقصى حمل عند الذروة، وغالباً ما يكون:',o:['50% من الحمل الموجود','100% من الحمل الموجود في الموقع','200% من الحمل','10% من الحمل'],c:1,e:'«وغالبا ما تكون ١٠٠٪ من الحمل الموجود في الموقع» مع الأخذ في الاعتبار التوسعات المستقبلية (ص 85).'},
  {q:'أي نوع من قواطع الدورة يفضله الكتاب للوحات الأحمال الكبيرة؟',o:['قواطع الدورة ذات سعات العزل العالية','المصاهر العادية فقط','المفاتيح اليدوية','القواطع الحرارية الصغيرة'],c:0,e:'لأن خطأ الدائرة القصيرة نحو 25000 kVA تقريباً (ص 85).'},
  {q:'ما قدرة المحرك والسخان في ورشة الشكل (4-2)؟',o:['1 kW لكل منهما','3 kW لكل منهما','3 kW للمحرك و 6 kW للسخان','5 kW لكل منهما'],c:1,e:'محرك ثلاثي الأوجه 380 فولت 3 كيلووات، وسخان 380 فولت 3 كيلووات (ص 85).'},
  {q:'ماذا يعني «3*1.5mm²» على خط الفلورسنت؟',o:['ثلاثة مصابيح قدرة كل منها 1.5 W','ثلاثة موصلات مقطع كل منها 1.5 mm²','طول الخط 1.5 m','مصهر 1.5 A'],c:1,e:'مقطع الموصل بالمليمتر المربع، والشرطة «3» تؤكد عدد الموصلات.'},
  {q:'لماذا يطلب الكتاب لوحة للإضاءة وأخرى للقوى؟',o:['لتقليل الطول','حتى تكون الإضاءة منفصلة تماماً عن القوى','لأن الإضاءة تعمل بالتيار المستمر','لا يطلب ذلك'],c:1,e:'(ص 86).'},
  {q:'في المختبر نزعنا المصهر 10A. ما الذي انقطع؟',o:['المحرك فقط','السخان فقط','الإضاءة والمقبسان','كل الورشة'],c:2,e:'المصهر 10A يحمي دائرة الإضاءة والمقابس.'}
 ]
});

/* =====================================================================
   رسوم واجهات اللوحات (4-3، 4-4-أ، 4-5، 4-7-أ) والدوائر الخطية (4-4-ب، 4-7-ب)
   كل عنصر يُسجَّل بمفتاح k ليُضغط عليه ويُظلَّل
   ===================================================================== */
const AMB=(x,y,ch,s)=>{s=s||22;return RECT(x-s/2,y-s/2,s,s,'','')+T(x,y+4.5,ch,{sz:13,w:700})};
/* مفتاح صغير في الواجهة: مربع وذراع رمادية تبرز للأعلى/للأسفل/مائلة بحلقة */
function SWF(x,y,s,dir){const h=s/2;let x2=x,y2=dir==='d'?y+h+12:y-h-12;if(dir==='ul'){x2=x-9;y2=y-h-10}
 return RECT(x-h,y-h,s,s,'','')+`<line class="knob" x1="${x}" y1="${y+(dir==='d'?-2:2)}" x2="${x2}" y2="${y2}"/><circle class="ring" cx="${x2}" cy="${y2}" r="3.2"/>`}
const FUF=(x,y,h)=>RECT(x-3.5,y-h/2,7,h,'','thin')+L(x,y-h/2-4,x,y+h/2+4,'','thin');
function MAINF(x,y,w,h){return RECT(x-w/2,y,w,h,'','')+`<rect class="band" x="${x-w/2+4}" y="${y+h*0.22}" width="${w-8}" height="${h*0.24}"/>`+`<line class="knob" x1="${x}" y1="${y+h*0.55}" x2="${x}" y2="${y+h+16}"/><circle class="ring" cx="${x}" cy="${y+h+18}" r="3.4"/>`}
/* سهم الرقم «← 1» على يمين العنصر */
const NUM=(x,y,n)=>L(x+16,y,x+3,y,'','thin')+AH(x+3,y,'l','thin')+T(x+20,y+4.5,String(n),{sz:13,w:700,a:'l'});
function fin(S,it,s,W,H){const sel=S.sel?it.filter(b=>b[0]===S.sel).map(b=>`<rect class="${S.selCls||'selr'}" x="${b[1]-3}" y="${b[2]-3}" width="${b[3]+6}" height="${b[4]+6}" rx="5"/>`).join(''):'';
 return SVG(W,H,sel+s+(S.hits?it.map(b=>HIT(...b)).join(''):''))}

/* ---------- الشكل (4-3) ص 88 — لوحة توزيع القوى لورشة ---------- */
function fig43(S){S=S||{};const it=[],A=(k,x,y,w,h)=>it.push([k,x,y,w,h]);let s='';
 s+=RECT(40,20,200,400,'','')+L(262,20,262,420,'','thin')+AH(262,20,'u','thin')+AH(262,420,'d','thin')+L(244,20,268,20,'','thin')+L(244,420,268,420,'','thin')+T(276,220,'200cm',{sz:12,rot:-90})
  +L(40,442,240,442,'','thin')+AH(40,442,'l','thin')+AH(240,442,'r','thin')+L(40,424,40,448,'','thin')+L(240,424,240,448,'','thin')+T(140,460,'80cm',{sz:12});
 A('dim',248,24,40,392);A('dim',44,432,192,36);
 s+=`<circle class="ln" cx="140" cy="50" r="11" style="fill:none"/>`+NUM(152,50,1);A('v43',126,36,28,28);
 [85,140,195].forEach(x=>{s+=AMB(x,85,'A');A('a43',x-13,72,26,26);s+=OX(x,114,6);A('i43',x-9,105,18,18)});s+=NUM(207,85,2)+NUM(203,114,3);
 [122,140,158].forEach(x=>{s+=FUF(x,150,24);A('fu43',x-6,134,12,32)});s+=NUM(164,150,4);
 [70,210].forEach(x=>{s+=OX(x,170,7);A('pl43',x-10,160,20,20)});
 s+=SWF(140,203,36,'d');A('qm43',120,183,40,62);s+=NUM(160,203,5);
 [85,140,195].forEach(x=>{s+=SWF(x,282,22,'u');A('q3_43',x-13,256,26,40);s+=[-11,0,11].map(d=>OX(x+d,306,4.3)).join('');A('q3l43',x-17,300,34,13)});s+=NUM(208,282,6);
 [85,140,195].forEach(x=>{s+=SWF(x,356,22,'u');A('q1_43',x-13,330,26,40);s+=[-6,6].map(d=>OX(x+d,380,4.3)).join('');A('q1l43',x-12,374,24,13)});s+=NUM(208,356,7);
 return fin(S,it,s,300,470)}
const I43={
 dim:{t:'أبعاد اللوحة ومادتها',ref:'ص 87',d:'«تصنع اللوحة من صاج سمك ٢ مم بمقياس ٢٠٠X٨٠ سم وبعرض ٤٠ سم … ويكون الصاج ملحوما في خوص حديد كهيكل للوحة التوزيع الحر، ويمكن تثبيت هذه اللوحة على قاعدة خرسانية ترتفع عن أرضية الورشة ٢٠ سم ويكون مقطع الكابل الرئيس ٣X٥٠ مم٢ +٢٥مم٢ ألمينيوم.» <b>توضيح للمتدرب (ليس من نص الكتاب):</b> الارتفاع <span class="ltr">200 cm</span> والعرض <span class="ltr">80 cm</span> (كما في الشكل)، و«العرض ٤٠ سم» هو العمق.'},
 v43:{t:'الرقم 1 — دائرة أعلى اللوحة',ref:'ص 88',d:'<span class="fixnote">في الشكل رقم 1 دائرة مفرغة، لكن قائمة النص تبدأ بالبند (٢) فلا يوجد بند (١).</span> <b>توضيح للمتدرب (ليس من نص الكتاب):</b> الأرجح أنها <b>فولتميتر</b>، لأن المواصفات العامة تطلب «أجهزة أميتر لقياس شدة التيار وفولت ميتر لقياس الجهد» (ص 87 البند ٥).'},
 a43:{t:'الرقم 2 — ثلاثة أميترات',ref:'ص 88',d:'«ثلاثة أجهزة أميتر تيار متغير مدى ١٠٠ أمبير لقراءة التيار الرئيس عند تشغيل المحركات» (من البند ٢).'},
 i43:{t:'الرقم 3 — ثلاث لمبات إشارة',ref:'ص 88',d:'«(٣) ثلاثة لمبات إشارة لبيان تشغيل الأوجه الثلاثة للتيار المتغير الواصل إلى اللوحة.»'},
 fu43:{t:'الرقم 4 — ثلاثة مصاهر',ref:'ص 88',d:'«(٤) ثلاثة مصاهر سريعة القطع ١٠٠ أمبير لكل مصهر.»'},
 pl43:{t:'مصباحا إضاءة اللوحة',ref:'ص 88',d:'علامتا ⊗ على جانبي صف المصاهر بلا رقم. <b>توضيح للمتدرب (ليس من نص الكتاب):</b> الأرجح أنهما «مصباحا إضاءة للوحة أحدهما من الأمام والآخر من الخلف للإنارة عند الكشف عن أجزاء اللوحة أو عمل صيانة» (من البند ٢).'},
 qm43:{t:'الرقم 5 — المفتاح الأوتوماتيكي الرئيس',ref:'ص 88',d:'«(٥) مفتاح أوتوماتيكي للتحكم في الحمل الكامل للورشة مزود بملفات القطع عند زيادة التيار أو الضغط عن الحد الأقصى للمحركات جميعاً.»'},
 q3_43:{t:'الرقم 6 — ثلاثة مفاتيح ثلاثية الأوجه',ref:'ص 88',d:'«(٦) ثلاثة مفاتيح أوتوماتيكية ثلاثية الأوجه (باك سويتش) بقواطع أوتوماتيكية عند زيادة التيار إلى ٢٥ أمبير و٣٨٠ فولت.» — للمحركات ثلاثية الأوجه.'},
 q3l43:{t:'ثلاث علامات ⊗ تحت كل مفتاح ثلاثي',ref:'ص 88',d:'في الشكل فقط. <b>توضيح للمتدرب (ليس من نص الكتاب):</b> لمبات بيان لأوجه المفتاح الثلاثة.'},
 q1_43:{t:'الرقم 7 — ثلاثة مفاتيح وجه واحد',ref:'ص 88',d:'«(٧) ثلاثة مفاتيح أوتوماتيكية وجه واحد (باك سويتش) بقواطع أوتوماتيكية عند زيادة التيار إلى ١٥ أمبير و٢٢٠ فولت.» — للمحركات أحادية الوجه.'},
 q1l43:{t:'علامتا ⊗ تحت كل مفتاح أحادي',ref:'ص 88',d:'في الشكل فقط. <b>توضيح للمتدرب (ليس من نص الكتاب):</b> لمبتا بيان للمفتاح.'}};

/* ---------- الشكل (4-4-أ) ص 90 — الواجهة الأمامية للوحة التوزيع الخاصة بالمصنع ---------- */
function outCell(cx,side,cols,rows,A,o){o=o||{};let s='';const dx=o.dx||60,y0=o.y0||62,dy=o.dy||60;
 s+=OX(cx,26,7);A('ol'+o.tag,cx-10,16,20,20);
 for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const x=cx+(c-(cols-1)/2)*dx,y=y0+r*dy;s+=SWF(x,y,o.sw||20,'ul');A('qo'+side,x-12,y-24,24,36);
  s+=[-10,0,10].map(d=>OX(x+d,y+21,4)).join('');A('qol'+side,x-15,y+15,30,12)}
 return s}
function fig44a(S){S=S||{};const it=[],A=(k,x,y,w,h)=>it.push([k,x,y,w,h]);let s='';
 s+=RECT(10,10,460,260,'','')+L(163,10,163,270)+L(317,10,317,270)+L(10,180,470,180);
 [[10,163],[163,317],[317,470]].forEach(([a,b])=>{s+=RECT(a+9,188,b-a-18,74,'','thin')});
 s+=T(86,290,'خلية 2',{sz:13})+T(240,290,'خلية 1',{sz:13})+T(393,290,'خلية 3',{sz:13});A('cells44',40,276,400,20);
 /* خلية 1 (الدخول) */
 s+=OX(240,26,7);A('cl44',230,16,20,20);s+=AMB(186,58,'V');A('v44',173,45,26,26);
 [220,248,276].forEach(x=>{s+=AMB(x,58,'A',20);A('a44',x-12,46,24,24);s+=OX(x,86,6);A('i44',x-9,77,18,18)});
 s+=MAINF(240,100,36,48);A('qm44',220,98,40,90-18);
 [228,240,252].forEach(x=>{s+=FUF(x,225,26)});A('fi44',220,206,40,40);
 /* خليتا الخروج */
 s+=outCell(86.5,'L',2,2,A,{tag:'L'})+outCell(393.5,'R',2,2,A,{tag:'R'});
 [[86.5,'L'],[393.5,'R']].forEach(([cx,sd])=>{[[-30,206],[30,206],[-30,243],[30,243]].forEach(([dx,y])=>{[-9,0,9].forEach(d=>{s+=FUF(cx+dx+d,y,20)});A('fo'+sd,cx+dx-15,y-15,30,30)})});
 return fin(S,it,s,480,300)}

/* ---------- الدائرة الخطية (4-4-ب ص 91 و 4-7-ب ص 95): الجزء العلوي المشترك ---------- */
function slTop(S,it,g,X){X=X||110;const A=(k,x,y,w,h)=>it.push([k,x,y,w,h]);let s='';
 s+=g(1,L(20,20,300,20,'','bus')+DOT(X,20,'',4.2));A('feed',20,13,280,14);
 s+=g(2,FU(X,20,64)+L(X,64,X,66)+SW(X,66,112,'op')+(S.labels?T(X+14,46,'F',{sz:10,c:'m',a:'l'}):''));A('fi',X-10,28,20,36);A('qm',X-26,68,40,44);
 s+=g(3,L(X,112,X,151)+`<circle class="ln" cx="${X}" cy="140" r="10.5" style="fill:none"/>`+P(`M${X-5} ${127.5} A14 14 0 1 0 ${X-5} 152.5`)+L(X+10.5,140,X+92,140)+P(`M${X+42} 154 l6 -9 M${X+51} 154 l6 -9 M${X+60} 154 l6 -9`,'','thin'));A('ct',X-22,124,40,32);
 s+=g(4,L(X,151,X,177)+`<circle class="ln" cx="${X-6}" cy="186" r="9" style="fill:none"/><circle class="ln" cx="${X+6}" cy="186" r="9" style="fill:none"/>`+L(X+15,186,X+92,186)+P(`M${X+40} 192 l7 -12 M${X+49} 192 l7 -12 M${X+58} 192 l7 -12`,'','thin')+L(X,195,X,215));A('vt',X-18,174,36,24);
 s+=g(7,AMB(X+56,46,'V')+[X+96,X+126,X+156].map(x=>AMB(x,46,'A')+OX(x,76,6)).join(''));A('v',X+43,33,26,26);[X+96,X+126,X+156].forEach(x=>{A('a',x-13,33,26,26);A('i',x-9,67,18,18)});
 return s}
function fig44b(S){S=S||{};const it=[],A=(k,x,y,w,h)=>it.push([k,x,y,w,h]);const g=mkG(S);let s='';
 s+=slTop(S,it,g,110);
 s+=g(5,L(60,215,262,215,'','bus')+DOT(110,215,'',4.2)+DOT(85,215)+DOT(220,215));A('mb',55,208,212,14);
 s+=g(6,[[85,'L',[22,52,82,112],[10,142]],[220,'R',[178,208,238,268],[160,290]]].map(([x,sd,br,sb])=>{
   A('fout',x-8,224,16,30);A('qout',x-22,258,32,44);A('sb'+sd,sb[0],306,sb[1]-sb[0],12);
   return FU(x,215,255)+L(x,255,x,258)+SW(x,258,300,'ds')+L(x,300,x,312)+L(sb[0],312,sb[1],312,'','bus')+DOT(x,312)
    +br.map(bx=>{A('fo'+sd,bx-8,324,16,30);A('qo'+sd,bx-14,357,24,40);return L(bx,312,bx,322)+FU(bx,322,352)+L(bx,352,bx,356)+SW(bx,356,396,'ds')+L(bx,396,bx,408)}).join('')}).join(''));
 /* المفاتيح العامة في الدائرة تحمل أسماء الواجهة */
 it.forEach(b=>{if(b[0]==='fi')b[0]='fi44';if(b[0]==='qm')b[0]='qm44';if(b[0]==='v')b[0]='v44';if(b[0]==='a')b[0]='a44';if(b[0]==='i')b[0]='i44'});
 return fin(S,it,s,320,415)}
const I44={
 cells44:{t:'لوحة توزيع القوى للمصنع: ثلاث خلايا',ref:'ص 89',d:'«تتكون لوحة التوزيع من ثلاث خلايا: خلية للدخول واثنتين للخروج تتحمل اللوحة ١٠٠٠ أمبير وهي مجهزة من الداخل بالقضبان العمومية من النحاس الأحمر الكهربي ويجب ألا تزيد كثافة التيار عن ٤ أمبير/مم². والخلايا من النوع المغلق وتبعد عن الحائط مسافة متر للصيانة. وتزود كل خلية بلمبة إضاءة.» خلية 1 (الوسطى) هي خلية الدخول.'},
 cl44:{t:'لمبة إضاءة خلية الدخول',ref:'ص 89',d:'«لمبة إضاءة» — «وتزود كل خلية بلمبة إضاءة».'},
 v44:{t:'فولتميتر',ref:'ص 89',d:'«فولت ميتر سعة ٤٠٠ فولت» في خلية الدخول.'},
 a44:{t:'ثلاثة أميترات',ref:'ص 89',d:'«ثلاثة أميترات سعة ٦٠٠ أمبير.»'},
 i44:{t:'ثلاث لمبات بيان',ref:'ص 89',d:'«ثلاث لمبات بيان تشغيل بالألوان المميزة.»'},
 qm44:{t:'المفتاح الهوائي',ref:'ص 89',d:'«مفتاحاً هوائياً لتشغيل يدوي مزود بالحماية ضد زيادة الحمل.» في الدائرة الخطية: ذراع مائلة ومعها علامة التشغيل اليدوي.'},
 fi44:{t:'ثلاثة مصاهر (سعة عالية)',ref:'ص 89',d:'«ثلاثة مصاهر (سعة عالية).» في الدائرة الخطية يمثلها رمز مصهر واحد لأن الخط الواحد يمثل الأوجه الثلاثة.'},
 ct:{t:'محول التيار',ref:'ص 89',d:'من «محولات القياس (تيار ـ جهد) ثلاثة أوجه». في الدائرة الخطية دائرة يمر بها الخط مع قوس، ويخرج منها خط تحته ثلاث شرط (للأوجه الثلاثة). لا يظهر في الواجهة لأنه داخل الخلية.'},
 vt:{t:'محول الجهد',ref:'ص 89',d:'من «محولات القياس (تيار ـ جهد) ثلاثة أوجه». في الدائرة الخطية دائرتان متداخلتان ويخرج منهما خط عليه ثلاث شرط. لا يظهر في الواجهة.'},
 feed:{t:'قضيب التغذية',ref:'ص 91',d:'الخط الأفقي في أعلى الدائرة الخطية، ومنه ينزل الخط الرئيس إلى خلية الدخول.'},
 mb:{t:'قضيب التوزيع الرئيس',ref:'ص 89، 91',d:'«القضبان العمومية من النحاس الأحمر الكهربي»، ومنه مخرجان إلى خليتي الخروج.'},
 fout:{t:'مصهر المخرج',ref:'ص 91',d:'مصهر في بداية كل مخرج من القضيب الرئيس في الدائرة الخطية. لا يقابله عنصر ظاهر في الواجهة (4-4-أ).'},
 qout:{t:'مفتاح المخرج',ref:'ص 91',d:'مفتاح بعد مصهر المخرج يغذي القضيب الفرعي لخلية الخروج. لا يقابله عنصر ظاهر في الواجهة.'},
 sb:{t:'القضيب الفرعي لخلية الخروج',ref:'ص 91',d:'منه أربعة فروع، كل فرع مصهر ثم مفتاح ثم خط إلى لوحة فرعية.'},
 ol:{t:'لمبة بيان خلية الخروج',ref:'ص 89',d:'«لمبة بيان» — «وتزود كل خلية بلمبة إضاءة».'},
 qo:{t:'مفاتيح باك سويتش',ref:'ص 89',d:'«أربعة مفاتيح باك سويتش سعة ١٠٠ أمبير لتغذية اللوحات الفرعية» في كل خلية خروج. في الدائرة الخطية: المفاتيح الأربعة على القضيب الفرعي.'},
 qol:{t:'ثلاث لمبات صغيرة تحت كل مفتاح',ref:'ص 90',d:'<span class="fixnote">مرسومة في الشكل (4-4-أ) ولا يذكرها النص (النص يذكر لمبة بيان واحدة لخلية الخروج).</span> لا تظهر في الدائرة الخطية.'},
 fo:{t:'مصاهر خلية الخروج',ref:'ص 89',d:'«اثنا عشر مصهراً سعة ٣٦ أمبير» — ثلاثة لكل مفتاح. في الدائرة الخطية مصهر واحد لكل فرع يمثل الثلاثة.'}};
const info44=k=>I44[k]||I44[k.replace(/44$/,'')]||I44[k.replace(/[LR]$/,'')]||null;

/* ---------- مختبر الواجهات التفاعلية ---------- */
function panelLab(el,cfg){let vi=0,sel=null,find=-1,found=0,tries0=0;const w={view:cfg.views[0].id,sel:null,found:0,seen:{}};
 el.innerHTML=`<div class="grid">
  <div class="panel c12"><h2>${cfg.title} <small>${cfg.sub}</small></h2>
   <div class="wrap-in" style="padding-bottom:0">${segHTML('pv',cfg.views.map((v,i)=>[i,v.label]),0)}<button class="btn" id="fd">ابحث عن الجزء</button></div>
   <p class="sub" id="hint">اضغط على أي جزء في الواجهة${cfg.views.some(v=>v.sl)?' أو في الدائرة الخطية':''} لتعرف اسمه ومواصفاته من الكتاب.</p>
   <div class="callout" id="fq" hidden></div></div>
  <div class="panel c7" id="fp"><h2 id="ft"></h2><div class="svgbox" id="fs" style="margin-inline:auto"></div></div>
  <div class="panel c5" id="sp"><h2 id="st"></h2><div class="svgbox" id="ss" style="max-width:330px;margin-inline:auto"></div></div>
  <div class="panel c12"><h2>البطاقة</h2><div class="d4card" id="cd"></div><div class="sub" id="lk"></div>${cfg.tries?tries(cfg.tries):''}</div>
  ${cfg.steps?'<div class="panel c12"><h2>التجربة خطوة بخطوة</h2><ol class="steps" id="gs"></ol></div>':''}
 </div>`;
 const $=s=>el.querySelector(s);
 const V=()=>cfg.views[vi];
 const draw=()=>{const v=V();$('#ft').innerHTML=v.fTitle;$('#fs').style.maxWidth=(v.fw||480)+'px';$('#fs').innerHTML=v.front({sel,hits:1});
  $('#sp').hidden=!v.sl;$('#fp').className='panel '+(v.sl?'c7':'c12');if(v.sl){$('#st').innerHTML=v.sTitle;$('#ss').innerHTML=v.sl({sel,hits:1})}
  const I=sel?v.info(sel):null;$('#cd').innerHTML=card(I);
  let lk='';if(sel&&v.sl){const inF=!!$('#fs').querySelector(`[data-k="${sel}"]`),inS=!!$('#ss').querySelector(`[data-k="${sel}"]`);
   lk=inF&&inS?'مظلّل في الرسمين: الواجهة والدائرة الخطية.':inF?'هذا الجزء يظهر في الواجهة فقط، ولا يقابله رمز في الدائرة الخطية.':'هذا الجزء في الدائرة الخطية فقط، ولا يظهر في الواجهة.'}
  $('#lk').textContent=lk;
  if(find>=0){const F=v.find;$('#fq').hidden=false;$('#fq').innerHTML=find<F.length?`<b>ابحث عن:</b> ${F[find][0]} <span class="sub">(${find+1} من ${F.length} · صحيح ${found})</span>`:`<b>انتهى البحث:</b> وجدت ${found} من ${F.length} من أول محاولة. <button class="btn" id="fa">مرة أخرى</button>`;
   const fa=$('#fa');if(fa)fa.addEventListener('click',()=>{find=0;found=0;tries0=0;draw()})}else $('#fq').hidden=true;
  if(gs)gs.check()};
 const pick=k=>{sel=k;w.sel=k;w.seen[V().id+':'+k]=1;
  if(find>=0&&find<V().find.length){const want=V().find[find][1];const ok=k===want||(Array.isArray(want)&&want.includes(k));
   if(ok){if(!tries0)found++;find++;tries0=0;w.found=Math.max(w.found,found)}else tries0++;
   $('#hint').innerHTML=ok?'<b class="ok">صحيح.</b>':'<b class="no">ليس هذا.</b> اقرأ البطاقة ثم حاول مرة أخرى.'}
  draw()};
 ['#fs','#ss'].forEach(id=>$(id).addEventListener('click',e=>{const h=e.target.closest('[data-k]');if(h)pick(h.dataset.k)}));
 el.querySelectorAll('[data-pv]').forEach(b=>b.addEventListener('click',()=>{vi=+b.dataset.pv;w.view=V().id;sel=null;if(find>=0){find=0;found=0;tries0=0}el.querySelectorAll('[data-pv]').forEach(x=>x.setAttribute('aria-pressed',x===b));draw()}));
 $('#fd').addEventListener('click',()=>{if(find>=0){find=-1;$('#fd').textContent='ابحث عن الجزء'}else{find=0;found=0;tries0=0;$('#fd').textContent='أوقف البحث'}draw()});
 const gs=cfg.steps?stepsUI($('#gs'),cfg.steps,()=>w):null;
 draw()}

B.lesson({
 id:'u4-l3',unit:4,order:3,pages:'87–91',
 title:'لوحة توزيع القوى',
 summary:'المواصفات العامة للوحات التوزيع الرئيسة، ولوحة توزيع القوى لورشة (4-3)، ولوحة توزيع القوى لمصنع بواجهتها الأمامية (4-4-أ) ودائرتها الخطية (4-4-ب).',
 stations:[
  {intro:true},

  {st:1,short:'المواصفات العامة',title:'٤-٣-٢ المواصفات العامة للوحات التوزيع الرئيسة في المصانع والورش',ref:'ص 87',
   q:'لوحة التوزيع تحمي الأجهزة… ومن يحمي الفني الذي يقف أمامها؟',
   get art(){return U4ST.art(
     U4ST.tip('جسم اللوحة: صاج سمك ⟦2⟧ مم مدهون بدهان إلكتروستاتيكي (البند 1).',[100,30,160,206],`<rect x="104" y="34" width="152" height="198" rx="6" style="fill:#FBF6EE;stroke:#2C4A40;stroke-width:2.5"/>`)
    +U4ST.tip('أجهزة أميتر لقياس شدة التيار وفولت ميتر لقياس الجهد (البند 5).',[112,44,136,32],AMB(132,60,'V',20)+AMB(170,60,'A',20)+AMB(198,60,'A',20)+AMB(226,60,'A',20))
    +U4ST.tip('لمبات إشارة لبيان تشغيل الأوجه الثلاثة (البند 6).',[156,80,84,22],OX(170,90,6)+OX(198,90,6)+OX(226,90,6))
    +U4ST.tip('قاطع أوتوماتيكي رئيس للتحكم في الحمل الكامل، مزود بملفات القطع عند زيادة التيار أو الجهد (البند 8).',[162,106,36,76],MAINF(180,110,30,40))
    +U4ST.tip('قضيب أرضي للوقاية (البند 7).',[112,200,136,24],`<rect x="120" y="208" width="120" height="8" style="fill:#2C4A40"/>`+[132,156,180,204,228].map(x=>L(x,216,x,222,'','thin')).join(''))
    +U4ST.tip('قاعدة خرسانية بسمك ⟦20⟧ سم (البند 2).',[86,232,188,30],`<rect x="90" y="234" width="180" height="24" class="wall"/>`)
    +T(180,290,'اللوحة على قاعدتها',{sz:13,w:700}),
    'لوحة توزيع على قاعدة خرسانية فيها أجهزة قياس ولمبات إشارة وقاطع رئيس وقضيب أرضي')},
   cap:'المواصفات العامة على لوحة واحدة.<br><b>مرّر المؤشر على أي جزء (أو المسه في الجوال) لتعرف البند الذي يخصه.</b>',
   side:[
    {predict:{q:'بحسب المواصفات العامة، على أي شيء توضع لوحة التوزيع؟',opts:[
     ['على الأرض مباشرة',false,'الكتاب يطلب قاعدة.'],
     ['على قاعدة خرسانية بسمك 20 سم',true,'البند (٢) ص 87.'],
     ['على حامل خشبي',false,'لم يذكر الكتاب ذلك.']]}}
   ],
   body:[
    {book:String.raw`<p>يجب أن يؤخذ بنظر الاعتبار في تصميم لوحات التوزيع موضوع حماية النظام الكهربائي والأجهزة المتعلقة به، كذلك أخذ سلامة العاملين والفنيين من خطر الصدمة الكهربائية. لذا يجب أن تتوافر المواصفات الآتية في تصميم لوحات التوزيع:</p>
     <ol><li>أن تصنع اللوحة من صاج سمك <span class="ltr">2 mm</span> وتكون مدهونة بدهان إلكتروستاتيكي.</li><li>أن توضع على قاعدة خرسانية بسمك <span class="ltr">20 cm</span>.</li><li>أن يتطابق المستوى المقرر لكل قاطع دائرة مع الدائرة التي يقوم بحمايتها هذا القاطع.</li><li>أن تكون القواطع مناسبة من ناحية النوع والحجم مع اللوحة التي تركب فيها هذه القواطع.</li><li>أن تحتوي اللوحة على أجهزة أميتر لقياس شدة التيار وفولت ميتر لقياس الجهد.</li><li>أن تحتوي اللوحة على لمبات إشارة لبيان تشغيل الأوجه الثلاثة للتيار المتغير الواصل إلى اللوحة.</li><li>أن تحتوي على قضيب أرضي للوقاية.</li><li>أن تحتوي على قاطع أوتوماتيكي رئيس للتحكم في الحمل الكامل مزود بملفات القطع عند زيادة التيار أو الجهد عن الحد الأقصى.</li></ol>`,ref:'ص 87'},
    {tip:String.raw`<p>البنود الثمانية تخدم هدفين ذكرهما الكتاب في أول الفقرة: <b>حماية النظام والأجهزة</b> (القواطع المناسبة، والقاطع الرئيس، وأجهزة القياس ولمبات الإشارة لتعرف حالة اللوحة)، و<b>سلامة العاملين</b> من الصدمة (الصاج المعدني، والقضيب الأرضي).</p>`,title:'لماذا هذه البنود؟'},
    {title:'تحقق سريع: المواصفات العامة',widget:(el,B)=>DCML.tf(el,B,{intro:'احكم على كل عبارة بحسب بنود ص 87.',items:[
     ['تُصنع اللوحة من صاج سمك 2 مم مدهون بدهان إلكتروستاتيكي.',true,'البند (١).'],
     ['يكفي أن يكون في اللوحة أميتر، ولا حاجة إلى فولتميتر.',false,'البند (٥): أميتر لقياس شدة التيار وفولت ميتر لقياس الجهد.'],
     ['يجب أن يتطابق المستوى المقرر لكل قاطع مع الدائرة التي يحميها.',true,'البند (٣).'],
     ['القضيب الأرضي في اللوحة اختياري.',false,'البند (٧): «أن تحتوي على قضيب أرضي للوقاية».']]})}
   ]},

  {st:2,short:'لوحة القوى لورشة',title:'١- مواصفات لوحة توزيع القوى الرئيسة في الورش والمصانع',ref:'ص 87–89',
   q:'على واجهة اللوحة سبعة أرقام… أيها ترى أولاً وأنت واقف أمامها، وأيها تشغّل بيدك؟',
   get art(){const x=96,y=10,k=0.64;return U4ST.art(U4ST.emb(fig43(),x,y,k)
    +U4ST.tipIn('الرقم ⟦1⟧: دائرة في أعلى اللوحة غير مذكورة في النص؛ الأرجح أنها فولتميتر (توضيح منا).',[126,36,28,28],x,y,k)
    +U4ST.tipIn('الرقم ⟦2⟧: ثلاثة أجهزة أميتر مدى ⟦100⟧ أمبير.',[70,70,140,30],x,y,k)
    +U4ST.tipIn('الرقم ⟦3⟧: ثلاث لمبات إشارة لأوجه التيار الواصل إلى اللوحة.',[70,104,140,22],x,y,k)
    +U4ST.tipIn('الرقم ⟦4⟧: ثلاثة مصاهر سريعة القطع ⟦100⟧ أمبير.',[110,134,60,34],x,y,k)
    +U4ST.tipIn('الرقم ⟦5⟧: المفتاح الأوتوماتيكي الرئيس للحمل الكامل للورشة.',[118,182,44,64],x,y,k)
    +U4ST.tipIn('الرقم ⟦6⟧: ثلاثة مفاتيح ثلاثية الأوجه (باك سويتش) ⟦25⟧ أمبير و⟦380⟧ فولت.',[70,254,140,60],x,y,k)
    +U4ST.tipIn('الرقم ⟦7⟧: ثلاثة مفاتيح وجه واحد (باك سويتش) ⟦15⟧ أمبير و⟦220⟧ فولت.',[70,328,140,60],x,y,k),
    'الشكل 4-3: لوحة توزيع القوى لورشة')},
   cap:'الشكل <span class="ltr">(4-3)</span> لوحة توزيع القوى لورشة <span class="ltr">ص 88</span>.<br><b>مرّر المؤشر على كل رقم (أو المسه في الجوال) لتعرف ما هو.</b>',
   side:[
    {predict:{q:'كم مفتاحاً ثلاثي الأوجه تذكره قائمة أجهزة لوحة القوى للورشة؟',opts:[
     ['أربعة، بعدد المحركات ثلاثية الأوجه',false,'هذا ما نتوقعه، لكن القائمة تذكر عدداً آخر — وهذا تعارض في الكتاب.'],
     ['ثلاثة',true,'البند (٦): «ثلاثة مفاتيح أوتوماتيكية ثلاثية الأوجه» — مع أن الورشة فيها 4 محركات ثلاثية الأوجه (انظر «انتبه» بالأسفل).'],
     ['ستة',false,'ستة هو مجموع الثلاثية والأحادية في القائمة.']]}}
   ],
   body:[
    {book:String.raw`<p>يختلف حجم لوحة التوزيع حسب حجم أجهزة التشغيل والوقاية الموجودة بها. فعلى سبيل المثال لوحة توزيع القوى لورشة تحتوي على ٤ محركات تيار متغير ثلاثي الأوجه وعدد ٢ محرك تيار متغير وجه واحد تكون مواصفات اللوحة كالتالي:</p>
     <p>تصنع اللوحة من صاج سمك ٢ مم بمقياس <span class="ltr">200×80 cm</span> وبعرض <span class="ltr">40 cm</span> كما موضح في الشكل (4-3)، ويكون الصاج ملحوماً في خوص حديد كهيكل للوحة التوزيع الحر، ويمكن تثبيت هذه اللوحة على قاعدة خرسانية ترتفع عن أرضية الورشة <span class="ltr">20 cm</span>، ويكون مقطع الكابل الرئيس <span class="ltr">3×50 mm² + 25 mm²</span> ألمنيوم.</p>
     <p>ويركب على اللوحة السابقة أجهزة التشغيل والوقاية الآتية: <span class="ref">ص 88</span></p>
     <ol style="list-style:none;padding-inline-start:4px">
     <li>(٢) مصباحا إضاءة للوحة أحدهما من الأمام والآخر من الخلف للإنارة عند الكشف عن أجزاء اللوحة أو عمل صيانة؛ ثلاثة أجهزة أميتر تيار متغير مدى <span class="ltr">100 A</span> لقراءة التيار الرئيس عند تشغيل المحركات.</li>
     <li>(٣) ثلاث لمبات إشارة لبيان تشغيل الأوجه الثلاثة للتيار المتغير الواصل إلى اللوحة.</li>
     <li>(٤) ثلاثة مصاهر سريعة القطع <span class="ltr">100 A</span> لكل مصهر.</li>
     <li>(٥) مفتاح أوتوماتيكي للتحكم في الحمل الكامل للورشة مزود بملفات القطع عند زيادة التيار أو الضغط عن الحد الأقصى للمحركات جميعاً.</li>
     <li>(٦) ثلاثة مفاتيح أوتوماتيكية ثلاثية الأوجه (باك سويتش) بقواطع أوتوماتيكية عند زيادة التيار إلى <span class="ltr">25 A</span> و<span class="ltr">380 V</span>.</li>
     <li>(٧) ثلاثة مفاتيح أوتوماتيكية وجه واحد (باك سويتش) بقواطع أوتوماتيكية عند زيادة التيار إلى <span class="ltr">15 A</span> و<span class="ltr">220 V</span>.</li></ol>`,ref:'ص 87–88'},
    {watch:String.raw`<p>قائمة الأجهزة ص 88 تبدأ بالبند (٢) — <b>البند (١) ناقص</b>، والبند (٢) يجمع شيئين مختلفين: «مصباحا إضاءة للوحة» و«ثلاثة أجهزة أميتر» (والأميترات في الشكل هي الرقم 2). وفي الشكل (4-3) الرقم 1 دائرة في أعلى اللوحة غير مذكورة في النص، والأرجح أنها <b>فولتميتر</b> (المواصفات العامة ص 87 البند ٥ تطلب أميتر وفولتميتر). كذلك الورشة فيها 4 محركات ثلاثية الأوجه و2 أحادية، بينما اللوحة فيها 3 مفاتيح ثلاثية و3 أحادية.</p>`,fix:1},
    {tip:String.raw`<p>الواجهة الأمامية رسم لما يراه الفني وهو واقف أمام اللوحة: أجهزة القياس واللمبات في الأعلى، ثم المصاهر والمفتاح الرئيس، ثم مفاتيح الخروج في الأسفل. «باك سويتش» مفتاح تشغيل وفصل يدوي فيه قاطع أوتوماتيكي يفصل عند زيادة التيار.</p>`,title:'اقرأ الواجهة من الأعلى'},
    {title:'مختبر مصغّر: أين هذا الجزء في الواجهة؟',widget:(el,B)=>DCML.lab(el,B,{intro:'اختر جزءاً من القائمة، فيُظلَّل مكانه في الشكل (4-3) وتظهر مواصفته من الكتاب.',
     ins:[{k:'p',l:'الجزء',seg:[['v43','1'],['a43','2'],['i43','3'],['fu43','4'],['qm43','5'],['q3_43','6'],['q1_43','7'],['pl43','⊗ بلا رقم'],['dim','الأبعاد']],v:'qm43'}],
     calc:s=>{const I=I43[s.p];return {pic:fig43({sel:s.p}),msg:`<b>${I.t}</b> (${I.ref}). ${I.d}`}}})},
    {book:String.raw`<p>أما الطبلون الخاص بالإنارة فتحتوي التالي:</p><ol><li>عدد ١٢ مصهراً <span class="ltr">220 V</span> و<span class="ltr">15 A</span>.</li><li>عدد ٤ مصاهر <span class="ltr">220 V</span> و<span class="ltr">10 A</span>.</li></ol>`,ref:'ص 89'},
    {watch:String.raw`<p>فقرة «الطبلون الخاص بالإنارة» ص 89 تأتي وحدها بلا تمهيد، ولا تطابق مواصفات لوحة الإضاءة التي يشرحها الكتاب لاحقاً ص 92 (ثلاثة مصاهر <span class="ltr">5 A</span> وخمسة مفاتيح <span class="ltr">5 A</span>).</p>`,fix:1}
   ]},

  {st:3,short:'لوحة القوى لمصنع',title:'مثال: لوحة توزيع القوى لمصنع',ref:'ص 89–91',
   q:'ثلاث خلايا في الواجهة، وخط واحد في الدائرة الخطية… كيف يقابل كل رمز في الخطية جزءاً في الواجهة؟',
   get art(){const x=12,y=56,k=0.7;return U4ST.art(U4ST.emb(fig44a(),x,y,k)
    +U4ST.tipIn('خلية 1 (الوسطى) خلية الدخول: لمبة إضاءة، فولتميتر ⟦400⟧ فولت، ثلاثة أميترات ⟦600⟧ أمبير، ثلاث لمبات بيان، مفتاح هوائي، ثلاثة مصاهر.',[163,10,154,260],x,y,k)
    +U4ST.tipIn('خلية 2 خلية خروج: لمبة بيان، أربعة مفاتيح باك سويتش ⟦100⟧ أمبير، اثنا عشر مصهراً ⟦36⟧ أمبير.',[10,10,153,260],x,y,k)
    +U4ST.tipIn('خلية 3 خلية خروج مثل خلية 2.',[317,10,153,260],x,y,k)
    +T(180,282,'ثلاث خلايا: دخول في الوسط وخروج على الجانبين',{sz:12,w:700}),
    'الشكل 4-4-أ: الواجهة الأمامية للوحة توزيع القوى للمصنع')},
   cap:'الشكل <span class="ltr">(4-4-أ)</span> <span class="ltr">ص 90</span>.<br><b>مرّر المؤشر على كل خلية (أو المسها في الجوال) لتعرف محتواها.</b>',
   side:[
    {predict:{q:'كم مصهراً في خلية خروج واحدة بحسب النص؟',opts:[
     ['أربعة، مصهر لكل مفتاح',false,'كل مفتاح ثلاثي الأوجه يحتاج ثلاثة مصاهر.'],
     ['اثنا عشر',true,'«اثنا عشر مصهراً سعة 36 أمبير» = 4 مفاتيح × 3 (ص 89).'],
     ['ثلاثة',false,'الثلاثة في خلية الدخول.']]}}
   ],
   body:[
    {book:String.raw`<p>الشكل (4-4) يوضح لوحة توزيع القوى لمصنع شاملة أجهزة التحكم والقياس. وتتكون لوحة التوزيع من ثلاث خلايا: خلية للدخول واثنتين للخروج تتحمل اللوحة <span class="ltr">1000 A</span> وهي مجهزة من الداخل بالقضبان العمومية من النحاس الأحمر الكهربي، ويجب ألا تزيد كثافة التيار عن <span class="ltr">4 A/mm²</span>. والخلايا من النوع المغلق وتبعد عن الحائط مسافة متر للصيانة. وتزود كل خلية بلمبة إضاءة.</p>
     <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px">
     <div><p><b>وتحتوي خلية الدخول على الآتي:</b></p><ul><li>لمبة إضاءة — فولت ميتر سعة <span class="ltr">400 V</span>.</li><li>ثلاثة أميترات سعة <span class="ltr">600 A</span>.</li><li>ثلاث لمبات بيان تشغيل بالألوان المميزة.</li><li>مفتاحاً هوائياً لتشغيل يدوي مزود بالحماية ضد زيادة الحمل.</li><li>ثلاثة مصاهر (سعة عالية).</li><li>محولات القياس (تيار — جهد) ثلاثة أوجه.</li></ul></div>
     <div><p><b>تحتوي خلية الخروج على الآتي:</b></p><ul><li>لمبة بيان.</li><li>أربعة مفاتيح باك سويتش سعة <span class="ltr">100 A</span> لتغذية اللوحات الفرعية.</li><li>اثنا عشر مصهراً سعة <span class="ltr">36 A</span>.</li></ul></div></div>
     <p>الشكل (4-4-أ) يبين الواجهة الأمامية للوحة توزيع القوى، والشكل (4-4-ب) يبين الدائرة الخطية للوحة توزيع القوى.</p>
     <figure style="margin:12px 0 0">${box(fig44a(),480)}<figcaption style="text-align:center;font-size:13px">الشكل <span class="ltr">(4-4-أ)</span> الواجهة الأمامية للوحة التوزيع الخاصة بالمصنع <span class="ref">ص 90</span></figcaption></figure>
     <figure style="margin:12px 0 0">${box(fig44b(),320)}<figcaption style="text-align:center;font-size:13px">الشكل <span class="ltr">(4-4-ب)</span> الدائرة الخطية للوحة توزيع القوى الخاصة بالمصنع <span class="ref">ص 91</span></figcaption></figure>`,ref:'ص 89–91'},
    {tip:String.raw`<p>اقرأ الدائرة الخطية من الأعلى إلى الأسفل: <b>قضيب التغذية</b> ← <b>مصهر</b> ← <b>المفتاح الهوائي</b> ← <b>محول تيار</b> (دائرة مع قوس، يخرج منها خط إلى أجهزة القياس) ← <b>محول جهد</b> (دائرتان متداخلتان) ← <b>قضيب التوزيع الرئيس</b> ← مخرجان (لخليتي الخروج)، كل مخرج: مصهر ← مفتاح ← قضيب فرعي ← أربعة فروع، كل فرع مصهر ثم مفتاح. والخط الواحد يمثل الأوجه الثلاثة، لذلك يمثل رمز المصهر الواحد في كل فرع <b>ثلاثة مصاهر</b> في الواجهة (4 فروع × 3 = 12 مصهراً لكل خلية خروج).</p>`,title:'كيف تقرأ الدائرة الخطية (4-4-ب)'},
    {title:'مختبر مصغّر: الجزء نفسه في الرسمين',widget:(el,B)=>DCML.lab(el,B,{intro:'اختر جزءاً، فيُظلَّل في الواجهة (فوق) وفي الدائرة الخطية (تحت) إن كان فيهما.',
     ins:[{k:'p',l:'الجزء',seg:[['qm44','المفتاح الهوائي'],['fi44','مصاهر الدخول'],['v44','الفولتميتر'],['a44','الأميترات'],['qoL','مفاتيح خلية 2'],['foL','مصاهر خلية 2'],['ct','محول التيار'],['vt','محول الجهد']],v:'qm44'}],
     calc:s=>{const I=info44(s.p);const f=fig44a({sel:s.p}),g=fig44b({sel:s.p});const inF=f.includes('class="selr"'),inS=g.includes('class="selr"');
      return {pic:`<div style="max-width:420px;margin:auto">${f}</div><div style="max-width:260px;margin:10px auto 0">${g}</div>`,
       msg:`<b>${I.t}</b> (${I.ref}). ${I.d}<br>${inF&&inS?'مظلّل في الرسمين.':inF?'يظهر في الواجهة فقط.':'في الدائرة الخطية فقط، ولا يظهر في الواجهة.'}`}}})},
    {watch:String.raw`<p>الشكل (4-4-أ) يرسم ثلاث لمبات صغيرة تحت كل مفتاح في خليتي الخروج، والنص يذكر «لمبة بيان» واحدة لخلية الخروج. وفي الشكل (4-4-ب) أجهزة V وA ولمبات البيان غير موصولة بمحولات القياس.</p>`,fix:1}
   ]},

  {recap:[
   'المواصفات العامة: صاج 2 مم بدهان إلكتروستاتيكي على قاعدة خرسانية 20 سم، وأميتر وفولتميتر ولمبات إشارة وقضيب أرضي وقاطع رئيس (ص 87).',
   'لوحة قوى الورشة: 200×80 سم وعرض 40 سم، كابلها الرئيس 3×50 mm² + 25 mm² ألمنيوم، ومفاتيح 25 A و15 A (ص 87–88).',
   'لوحة قوى المصنع: ثلاث خلايا (دخول واثنتان للخروج) تتحمل 1000 A، وكثافة التيار في القضبان لا تزيد عن 4 A/mm² (ص 89).',
   'في الدائرة الخطية يمثل رمز واحد الأوجه الثلاثة: مصهر واحد في الفرع = ثلاثة مصاهر في الواجهة (ص 90–91).']}
],
 theory:[
  {h:'٤-٣-٢ المواصفات العامة للوحات التوزيع الرئيسة في المصانع والورش',ref:'ص 87',html:`<p>يجب أن يؤخذ بنظر الاعتبار في تصميم لوحات التوزيع موضوع <b>حماية النظام الكهربائي</b> والأجهزة المتعلقة به، كذلك أخذ <b>سلامة العاملين والفنيين</b> من خطر الصدمة الكهربائية. لذا يجب أن تتوافر المواصفات الآتية في تصميم لوحات التوزيع:</p>
   <ol><li>أن تصنع اللوحة من صاج سمك <span class="ltr">2 mm</span> وتكون مدهونة بدهان إلكتروستاتيكي.</li><li>أن توضع على قاعدة خرسانية بسمك <span class="ltr">20 cm</span>.</li><li>أن يتطابق المستوى المقرر لكل قاطع دائرة مع الدائرة التي يقوم بحمايتها هذا القاطع.</li><li>أن تكون القواطع مناسبة من ناحية النوع والحجم مع اللوحة التي تركب فيها هذه القواطع.</li><li>أن تحتوي اللوحة على أجهزة <b>أميتر</b> لقياس شدة التيار و<b>فولت ميتر</b> لقياس الجهد.</li><li>أن تحتوي اللوحة على <b>لمبات إشارة</b> لبيان تشغيل الأوجه الثلاثة للتيار المتغير الواصل إلى اللوحة.</li><li>أن تحتوي على <b>قضيب أرضي</b> للوقاية.</li><li>أن تحتوي على <b>قاطع أوتوماتيكي رئيس</b> للتحكم في الحمل الكامل مزود بملفات القطع عند زيادة التيار أو الجهد عن الحد الأقصى.</li></ol>`},
  {h:'١- مواصفات لوحة توزيع القوى الرئيسة في الورش والمصانع',ref:'ص 87–88',html:`<p>يختلف حجم لوحة التوزيع حسب حجم أجهزة التشغيل والوقاية الموجودة بها. فعلى سبيل المثال لوحة توزيع القوى لورشة تحتوي على <b>٤ محركات تيار متغير ثلاثي الأوجه وعدد ٢ محرك تيار متغير وجه واحد</b> تكون مواصفات اللوحة كالتالي:</p>
   <p>تصنع اللوحة من صاج سمك ٢ مم بمقياس <span class="ltr">200×80 cm</span> وبعرض <span class="ltr">40 cm</span> كما موضح في الشكل (4-3)، ويكون الصاج ملحوماً في خوص حديد كهيكل للوحة التوزيع الحر، ويمكن تثبيت هذه اللوحة على قاعدة خرسانية ترتفع عن أرضية الورشة <span class="ltr">20 cm</span>، ويكون مقطع الكابل الرئيس <span class="ltr">3×50 mm² + 25 mm²</span> ألمنيوم.</p>
   <p>ويركب على اللوحة السابقة أجهزة التشغيل والوقاية الآتية: <span class="ref">ص 88</span></p>
   <ol style="list-style:none;padding-inline-start:4px">
   <li>(٢) مصباحا إضاءة للوحة أحدهما من الأمام والآخر من الخلف للإنارة عند الكشف عن أجزاء اللوحة أو عمل صيانة؛ ثلاثة أجهزة أميتر تيار متغير مدى <span class="ltr">100 A</span> لقراءة التيار الرئيس عند تشغيل المحركات.</li>
   <li>(٣) ثلاث لمبات إشارة لبيان تشغيل الأوجه الثلاثة للتيار المتغير الواصل إلى اللوحة.</li>
   <li>(٤) ثلاثة مصاهر سريعة القطع <span class="ltr">100 A</span> لكل مصهر.</li>
   <li>(٥) مفتاح أوتوماتيكي للتحكم في الحمل الكامل للورشة مزود بملفات القطع عند زيادة التيار أو الضغط عن الحد الأقصى للمحركات جميعاً.</li>
   <li>(٦) ثلاثة مفاتيح أوتوماتيكية ثلاثية الأوجه (باك سويتش) بقواطع أوتوماتيكية عند زيادة التيار إلى <span class="ltr">25 A</span> و<span class="ltr">380 V</span>.</li>
   <li>(٧) ثلاثة مفاتيح أوتوماتيكية وجه واحد (باك سويتش) بقواطع أوتوماتيكية عند زيادة التيار إلى <span class="ltr">15 A</span> و<span class="ltr">220 V</span>.</li></ol>`},
  {err:'<span class="fixnote">قائمة الأجهزة ص 88 تبدأ بالبند (٢) — <b>البند (١) ناقص</b>، والبند (٢) يجمع شيئين مختلفين: «مصباحا إضاءة للوحة» و«ثلاثة أجهزة أميتر» (والأميترات في الشكل هي الرقم 2). وفي الشكل (4-3) الرقم 1 دائرة في أعلى اللوحة غير مذكورة في النص، والأرجح أنها <b>فولتميتر</b> (المواصفات العامة ص 87 البند ٥ تطلب أميتر وفولتميتر). كذلك الورشة فيها 4 محركات ثلاثية الأوجه و2 أحادية، بينما اللوحة فيها 3 مفاتيح ثلاثية و3 أحادية.</span>'},
  {fig:'(4-3)',ref:'ص 88',caption:'لوحة توزيع القوى لورشة',draw:()=>box(fig43(),300)},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> الواجهة الأمامية رسم لما يراه الفني وهو واقف أمام اللوحة: أجهزة القياس واللمبات في الأعلى، ثم المصاهر والمفتاح الرئيس، ثم مفاتيح الخروج في الأسفل. «باك سويتش» مفتاح تشغيل وفصل يدوي فيه قاطع أوتوماتيكي يفصل عند زيادة التيار.'},
  {html:`<p>أما الطبلون الخاص بالإنارة فتحتوي التالي: <span class="ref">ص 89</span></p><ol><li>عدد ١٢ مصهراً <span class="ltr">220 V</span> و<span class="ltr">15 A</span>.</li><li>عدد ٤ مصاهر <span class="ltr">220 V</span> و<span class="ltr">10 A</span>.</li></ol>`},
  {err:'<span class="fixnote">فقرة «الطبلون الخاص بالإنارة» ص 89 تأتي وحدها بلا تمهيد، ولا تطابق مواصفات لوحة الإضاءة التي يشرحها الكتاب لاحقاً ص 92 (ثلاثة مصاهر 5 A وخمسة مفاتيح 5 A).</span>'},
  {h:'مثال: لوحة توزيع القوى لمصنع',ref:'ص 89–90',html:`<p>الشكل (4-4) يوضح لوحة توزيع القوى لمصنع شاملة أجهزة التحكم والقياس. وتتكون لوحة التوزيع من <b>ثلاث خلايا: خلية للدخول واثنتين للخروج</b> تتحمل اللوحة <span class="ltr">1000 A</span> وهي مجهزة من الداخل بالقضبان العمومية من النحاس الأحمر الكهربي، ويجب ألا تزيد كثافة التيار عن <span class="ltr">4 A/mm²</span>. والخلايا من النوع المغلق وتبعد عن الحائط مسافة متر للصيانة. وتزود كل خلية بلمبة إضاءة.</p>
   <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px">
   <div><p><b>وتحتوي خلية الدخول على الآتي:</b></p><ul><li>لمبة إضاءة — فولت ميتر سعة <span class="ltr">400 V</span>.</li><li>ثلاثة أميترات سعة <span class="ltr">600 A</span>.</li><li>ثلاث لمبات بيان تشغيل بالألوان المميزة.</li><li>مفتاحاً هوائياً لتشغيل يدوي مزود بالحماية ضد زيادة الحمل.</li><li>ثلاثة مصاهر (سعة عالية).</li><li>محولات القياس (تيار — جهد) ثلاثة أوجه.</li></ul></div>
   <div><p><b>تحتوي خلية الخروج على الآتي:</b></p><ul><li>لمبة بيان.</li><li>أربعة مفاتيح باك سويتش سعة <span class="ltr">100 A</span> لتغذية اللوحات الفرعية.</li><li>اثنا عشر مصهراً سعة <span class="ltr">36 A</span>.</li></ul></div></div>
   <p>الشكل (4-4-أ) يبين الواجهة الأمامية للوحة توزيع القوى، والشكل (4-4-ب) يبين الدائرة الخطية للوحة توزيع القوى.</p>`},
  {fig:'(4-4-أ)',ref:'ص 90',caption:'الواجهة الأمامية للوحة التوزيع الخاصة بالمصنع',draw:()=>box(fig44a(),480)},
  {fig:'(4-4-ب)',ref:'ص 91',caption:'الدائرة الخطية للوحة توزيع القوى الخاصة بالمصنع',draw:()=>box(fig44b(),320)},
  {h:'كيف تقرأ الدائرة الخطية (4-4-ب)',ref:'ص 91',html:`<p>من الأعلى إلى الأسفل: <b>قضيب التغذية</b> ← <b>مصهر</b> ← <b>المفتاح الهوائي</b> (ذراع مع علامة التشغيل اليدوي) ← <b>محول تيار</b> (دائرة مع قوس، يخرج منها خط إلى أجهزة القياس، والشرط الثلاث للأوجه الثلاثة) ← <b>محول جهد</b> (دائرتان متداخلتان) ← <b>قضيب التوزيع الرئيس</b> ← مخرجان (لخليتي الخروج)، كل مخرج: مصهر ← مفتاح ← قضيب فرعي ← أربعة فروع، كل فرع مصهر ثم مفتاح. وعلى اليمين في الأعلى: فولتميتر «V» وثلاثة أميترات «A» تحت كل منها لمبة بيان.</p>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> الدائرة الخطية تُرسم بخط واحد للأوجه الثلاثة، لذلك يمثل رمز المصهر الواحد في كل فرع <b>ثلاثة مصاهر</b> في الواجهة (4 فروع × 3 = 12 مصهراً لكل خلية خروج، كما في النص). وأجهزة القياس في الخطية مرسومة منفصلة دون خطوط تصلها بمحولات القياس. قارن الرسمين في تبويب «المختبر».'},
  {err:'<span class="fixnote">الشكل (4-4-أ) يرسم ثلاث لمبات صغيرة تحت كل مفتاح في خليتي الخروج، والنص يذكر «لمبة بيان» واحدة لخلية الخروج. وفي الشكل (4-4-ب) أجهزة V وA ولمبات البيان غير موصولة بمحولات القياس.</span>'}
 ],
 lab:(el)=>panelLab(el,{title:'واجهات لوحات القوى التفاعلية',sub:'الشكل (4-3) ص 88 والشكلان (4-4-أ) ص 90 و(4-4-ب) ص 91',
  views:[
   {id:'43',label:'لوحة قوى لورشة (4-3)',fTitle:'لوحة توزيع القوى لورشة <small>الشكل (4-3)</small>',fw:300,front:fig43,info:k=>I43[k],
    find:[['الأميترات الثلاثة','a43'],['المفتاح الأوتوماتيكي الرئيس','qm43'],['المصاهر السريعة 100 A','fu43'],['مفاتيح 25 A و 380 V','q3_43'],['مفاتيح 15 A و 220 V','q1_43'],['لمبات الإشارة للأوجه الثلاثة','i43']]},
   {id:'44',label:'لوحة قوى لمصنع (4-4)',fTitle:'الواجهة الأمامية <small>الشكل (4-4-أ)</small>',fw:480,front:fig44a,sTitle:'الدائرة الخطية <small>الشكل (4-4-ب)</small>',sl:fig44b,info:info44,
    find:[['الفولتميتر 400 V','v44'],['المفتاح الهوائي','qm44'],['محول التيار (في الدائرة الخطية)','ct'],['مفاتيح باك سويتش 100 A في خلية 3','qoR'],['المصاهر الثلاثة في خلية الدخول','fi44'],['لمبة بيان خلية الخروج 2','olL'],['محول الجهد','vt']]}],
  tries:['في لوحة الورشة اضغط على الرقم 1 واقرأ لماذا هو غير مذكور في النص.','في لوحة المصنع اضغط على المفتاح الهوائي: يُظلَّل في الواجهة وفي الدائرة الخطية معاً.','اضغط على محول التيار في الخطية: لا يقابله شيء في الواجهة.','اضغط «ابحث عن الجزء» واختبر نفسك.'],
  steps:[
   {t:'الأميترات',x:'في «لوحة قوى لورشة» اضغط على أحد المربعات «A».',done:w=>w.seen['43:a43']},
   {t:'الرقم 1',x:'اضغط على الدائرة رقم 1 أعلى اللوحة واقرأ البطاقة: بند ناقص في الكتاب.',done:w=>w.seen['43:v43']},
   {t:'أبعاد اللوحة',x:'اضغط على خط البعد «200cm» أو «80cm».',done:w=>w.seen['43:dim']},
   {t:'لوحة المصنع',x:'اختر «لوحة قوى لمصنع (4-4)».',done:w=>w.view==='44'},
   {t:'المفتاح الهوائي في الرسمين',x:'اضغط على المفتاح الهوائي في خلية الدخول (الوسطى)، ولاحظ رمزه في الدائرة الخطية.',done:w=>w.seen['44:qm44']},
   {t:'مفاتيح الخروج',x:'اضغط على أحد مفاتيح خلية 2 أو خلية 3: تُظلَّل الفروع المقابلة في الخطية.',done:w=>w.seen['44:qoL']||w.seen['44:qoR']},
   {t:'محولات القياس',x:'اضغط على محول التيار أو محول الجهد في الدائرة الخطية.',done:w=>w.seen['44:ct']||w.seen['44:vt']},
   {t:'ابحث عن الجزء',x:'اضغط «ابحث عن الجزء» وأجب عن أربعة على الأقل من أول محاولة.',done:w=>w.found>=4}]}),
 examples:[{title:'مثال مرسوم: الدائرة الخطية للوحة توزيع القوى (4-4-ب)',ref:'ص 91',
  q:'<p>ارسم الدائرة الخطية للوحة توزيع القوى الخاصة بالمصنع خطوة بخطوة. الجزء الجديد في كل خطوة بلون مميَّز.</p>',
  solve:()=>[
   ['<b>قضيب التغذية</b>: خط أفقي في الأعلى عليه نقطة ينزل منها الخط الرئيس.',1],
   ['<b>مصهر</b> ثم <b>المفتاح الهوائي</b> (ذراع مائلة ومعها علامة التشغيل اليدوي على اليسار) — في خلية الدخول.',2],
   ['<b>محول التيار</b>: دائرة يمر بها الخط ومعها قوس، ويخرج منها خط إلى اليمين تحته ثلاث شرط.',3],
   ['<b>محول الجهد</b>: دائرتان متداخلتان، ويخرج منهما خط عليه ثلاث شرط.',4],
   ['<b>قضيب التوزيع الرئيس</b>: خط أفقي عليه ثلاث نقاط (الخط الرئيس والمخرجان).',5],
   ['<b>المخرجان</b> (خليتا الخروج): كل مخرج مصهر ← مفتاح ← قضيب فرعي ← أربعة فروع، كل فرع مصهر ثم مفتاح.',6],
   ['<b>أجهزة القياس</b> على اليمين في الأعلى: فولتميتر «V» وثلاثة أميترات «A» تحت كل منها لمبة بيان.',7],
   ['اكتملت الدائرة الخطية. قارنها بالواجهة (4-4-أ): خلية الدخول = من المصهر حتى محول الجهد؛ وكل مخرج = خلية خروج بأربعة مفاتيح.',8]
  ].map(([t,n],i,a)=>({t:t+box(fig44b({stage:n}),300),final:i===a.length-1}))}],
 quiz:[
  {q:'من أي مادة وبأي سمك تصنع لوحة التوزيع حسب المواصفات العامة؟',o:['ألمنيوم سمك 5 مم','صاج سمك 2 مم مدهون بدهان إلكتروستاتيكي','خشب سمك 2 سم','بلاستيك مقوى'],c:1,e:'(ص 87، البند ١).'},
  {q:'ما أبعاد لوحة توزيع القوى للورشة في الشكل (4-3)؟',o:['80×80 سم','200×80 سم (وعرض 40 سم)','100×50 سم','200×200 سم'],c:1,e:'«بمقياس ٢٠٠X٨٠ سم وبعرض ٤٠ سم» (ص 87).'},
  {q:'ما مقطع الكابل الرئيس للوحة قوى الورشة؟',o:['3×6 mm²','3×10 mm² + 6 mm²','3×50 mm² + 25 mm² ألمنيوم','3×1.5 mm²'],c:2,e:'(ص 87).'},
  {q:'ما البند الناقص في قائمة أجهزة لوحة القوى ص 88؟',o:['البند (١)','البند (٤)','البند (٦)','لا شيء ناقص'],c:0,e:'القائمة تبدأ بالبند (٢)؛ وفي الشكل الرقم 1 دائرة أعلى اللوحة (الأرجح فولتميتر).'},
  {q:'كم خلية في لوحة توزيع القوى للمصنع، وكم تتحمل؟',o:['خليتان، 500 A','ثلاث خلايا (دخول واثنتان للخروج)، 1000 A','أربع خلايا، 1000 A','خلية واحدة، 600 A'],c:1,e:'(ص 89).'},
  {q:'ما أقصى كثافة تيار في القضبان العمومية النحاسية؟',o:['1 A/mm²','4 A/mm²','10 A/mm²','36 A/mm²'],c:1,e:'«يجب ألا تزيد كثافة التيار عن ٤ أمبير/مم²» (ص 89).'},
  {q:'في الدائرة الخطية (4-4-ب) لماذا يوجد مصهر واحد في كل فرع بينما في الواجهة ثلاثة مصاهر لكل مفتاح؟',o:['خطأ في الرسم','لأن الخط الواحد في الدائرة الخطية يمثل الأوجه الثلاثة','لأن الفرع أحادي الوجه','لأن المصهر الواحد أكبر'],c:1,e:'الدائرة الخطية تمثل الأوجه الثلاثة بخط واحد ورمز واحد.'}
 ]
});

/* ---------- الشكل (4-5) ص 92 — لوحة توزيع الإضاءة لورشة ---------- */
function fig45(S){S=S||{};const it=[],A=(k,x,y,w,h)=>it.push([k,x,y,w,h]);let s='';
 A('panel45',20,10,220,220);
 s+=RECT(20,10,220,220,'','');
 s+=OX(130,32,8);A('lamp45',119,21,22,22);s+=NUM(140,32,1);
 s+=OX(75,64,8);A('xL45',64,53,22,22);s+=OX(185,64,8);A('x2_45',174,53,22,22);s+=NUM(195,64,2);
 s+=SWF(130,74,44,'d');A('qm45',106,50,48,64);s+=NUM(152,92,3);
 [95,130,165].forEach(x=>{s+=OX(x,136,8);A('f45',x-11,125,22,22)});s+=NUM(175,136,4);
 [50,90,130,170,210].forEach(x=>{s+=SWF(x,184,24,'d');A('q45',x-14,170,28,42)});s+=T(130,226,'5',{sz:13,w:700});
 return fin(S,it,s,260,240)}
const I45={
 panel45:{t:'لوحة توزيع الإضاءة لورشة',ref:'ص 92',d:'لورشة فيها خمسة مصابيح فلورسانت: «تصنع اللوحة من صاج سمك ٢ مم بمقياس ٨٠X٨٠ سم وبعرض ٤٠ سم … ويكون الصاج مدعماً من الداخل بخوص حديد، ويمكن تثبيت اللوحة في الحائط بخوص». <span class="fixnote">الشكل نفسه بلا أبعاد مكتوبة.</span>'},
 lamp45:{t:'الرقم 1 — مصباح إضاءة اللوحة',ref:'ص 92',d:'«(١) مصباحاً واحداً لإضاءة اللوحة من الأمام.»'},
 x2_45:{t:'الرقم 2 — علامة ⊗',ref:'ص 92',d:'<span class="fixnote">في النص البند (٢) هو المفتاح الرئيس، أما في الشكل فالرقم 2 يشير إلى علامة ⊗.</span> <b>توضيح للمتدرب (ليس من نص الكتاب):</b> الأرجح أنها «(٣) لمبة إشارة واحدة للتأكد من وجود التيار في اللوحة».'},
 xL45:{t:'علامة ⊗ بلا رقم',ref:'ص 92',d:'<span class="fixnote">مرسومة على يسار المفتاح الرئيس بلا رقم، ولا يقابلها بند في النص (النص يذكر لمبة إشارة واحدة).</span>'},
 qm45:{t:'الرقم 3 — المفتاح الرئيس',ref:'ص 92',d:'«(٢) مفتاحاً واحداً أوتوماتيكياً وجه واحد ٢٠ أمبير ٢٢٠ فولت.» <span class="fixnote">في الشكل يحمل الرقم 3 لا 2.</span>'},
 f45:{t:'الرقم 4 — ثلاثة عناصر',ref:'ص 92',d:'«(٤) ثلاثة مصاهر ٢٢٠ فولت ٥ أمبير.» <span class="fixnote">في الشكل مرسومة بعلامة ⊗ (رمز المصباح) لا برمز المصهر.</span>'},
 q45:{t:'الرقم 5 — خمسة مفاتيح',ref:'ص 92',d:'«(٥) خمسة مفاتيح أوتوماتيكية وجه واحد ٥ أمبير ٢٢٠ فولت.» <b>توضيح للمتدرب (ليس من نص الكتاب):</b> مفتاح لكل مصباح من الفلورسنت الخمسة، كما في الشكل (4-6).'}};

/* ---------- الشكل (4-7-أ) ص 94 — الواجهة الأمامية للوحة توزيع الإضاءة ---------- */
const OFU=(x,y)=>ODOT(x-4.5,y,'',2)+ODOT(x+4.5,y,'',2)+L(x-2.5,y,x+2.5,y,'','thin')+L(x-3,y+5,x+3,y+5,'','thin');
function fig47a(S){S=S||{};const it=[],A=(k,x,y,w,h)=>it.push([k,x,y,w,h]);let s='';
 A('cells47',10,10,360,260);
 s+=RECT(10,10,360,260,'','')+L(180,10,180,270)+L(10,190,370,190)+RECT(19,198,152,64,'','thin')+RECT(189,198,172,64,'','thin');
 s+=OX(95,26,7);A('cl47',85,16,20,20);s+=AMB(36,58,'V');A('v47',23,45,26,26);
 [72,102,132].forEach(x=>{s+=AMB(x,58,'A',20);A('a47',x-12,46,24,24);s+=OX(x,86,6);A('i47',x-9,77,18,18)});
 s+=MAINF(95,104,34,48);A('qm47',76,102,38,74);
 [83,95,107].forEach(x=>{s+=FUF(x,230,26)});A('fi47',74,212,42,38);
 s+=OX(275,24,7);A('ol47',265,14,20,20);
 [225,275,325].forEach(x=>[56,106,156].forEach(y=>{s+=SWF(x,y,18,'ul');A('qo47',x-11,y-22,22,32);s+=[-9,0,9].map(d=>OX(x+d,y+20,3.6)).join('');A('qol47',x-14,y+15,28,11)}));
 [225,275,325].forEach(x=>[210,230,250].forEach(y=>{[-13,0,13].forEach(d=>{s+=OFU(x+d,y)});A('fo47',x-20,y-7,40,15)}));
 return fin(S,it,s,380,280)}
function fig47b(S){S=S||{};const it=[],A=(k,x,y,w,h)=>it.push([k,x,y,w,h]);const g=mkG(S);let s='';
 s+=slTop(S,it,g,75);
 const BR=[45,75,105,135,165,195,225,255];
 s+=g(5,L(30,215,270,215,'','bus')+BR.map(x=>DOT(x,215,'',x===75?4.4:3)).join(''));A('mb',25,208,250,14);
 s+=g(6,BR.map(x=>{A('fo47',x-8,222,16,36);A('qo47',x-14,262,24,42);return FU(x,215,256)+L(x,256,x,262)+SW(x,262,302,'ds')+L(x,302,x,314)}).join(''));
 it.forEach(b=>{const m={fi:'fi47',qm:'qm47',v:'v47',a:'a47',i:'i47'};if(m[b[0]])b[0]=m[b[0]]});
 return fin(S,it,s,320,322)}
const I47={
 cells47:{t:'لوحة توزيع الإضاءة لمصنع: خليتان',ref:'ص 93',d:'«تتكون لوحة توزيع الإضاءة من خليتين: خلية للدخول وأخرى للخروج تتحمل اللوحة ٥٠٠ أمبير وهي مجهزة من الداخل بالقضبان العمومية من النحاس الأحمر الكهربي للأوجه الثلاثة المميزة (الأحمر - الأصفر - الأزرق) بمقطع مناسب حسب الأحمال الفعلية. يجب ألا تزيد كثافة التيار عن ٤ أمبير/مم². والخلايا من النوع المغلق وتبعد عن الحائط مسافة متر للصيانة، وتزود كل خلية بلمبة إضاءة.» اليسرى خلية الدخول واليمنى خلية الخروج.'},
 cl47:{t:'لمبة إضاءة خلية الدخول',ref:'ص 93',d:'«لمبة إضاءة».'},
 v47:{t:'فولتميتر',ref:'ص 93',d:'«جهاز فولت ميتر سعة ٤٠٠ فولت.»'},
 a47:{t:'ثلاثة أميترات',ref:'ص 94',d:'«ثلاثة (٣) أميترات سعة ٤٠٠ أمبير.»'},
 i47:{t:'ثلاث لمبات بيان',ref:'ص 94',d:'«ثلاثة (٣) لمبات بيان تشغيل بالألوان المميزة.»'},
 qm47:{t:'المفتاح الهوائي',ref:'ص 94',d:'«مفتاحاً هوائياً لتشغيل يدوي ثلاثة (٣) أوجه مزود بالحماية ضد زيادة الحمل ٤٠٠ أمبير.»'},
 fi47:{t:'مصاهر خلية الدخول',ref:'ص 94–95',d:'<span class="fixnote">الشكلان (4-7-أ) و(4-7-ب) يرسمان مصاهر في خلية الدخول، ونص لوحة الإضاءة لا يذكرها (بخلاف لوحة القوى: «ثلاثة مصاهر (سعة عالية)»).</span>'},
 ct:{t:'محول التيار',ref:'ص 94',d:'من «محولات القياس (تيار ـ جهد) ثلاثة (٣) أوجه». داخل الخلية فلا يظهر في الواجهة.'},
 vt:{t:'محول الجهد',ref:'ص 94',d:'من «محولات القياس (تيار ـ جهد) ثلاثة (٣) أوجه». داخل الخلية فلا يظهر في الواجهة.'},
 feed:{t:'قضيب التغذية',ref:'ص 95',d:'الخط الأفقي في أعلى الدائرة الخطية.'},
 mb:{t:'قضيب التوزيع',ref:'ص 95',d:'القضبان العمومية للأوجه الثلاثة، ومنه فروع الخروج.'},
 ol47:{t:'لمبة بيان خلية الخروج',ref:'ص 94',d:'«لمبة بيان.»'},
 qo47:{t:'مفاتيح باك سويتش',ref:'ص 94',d:'«تسعة (٩) مفاتيح باك سويتش سعة كل مفتاح ١٠٠ أمبير لتغذية اللوحات الفرعية.» <span class="fixnote">الواجهة فيها 9 مفاتيح، لكن الدائرة الخطية (4-7-ب) فيها 8 مخارج فقط.</span>'},
 qol47:{t:'ثلاث لمبات صغيرة تحت كل مفتاح',ref:'ص 94',d:'<span class="fixnote">مرسومة في الشكل ولا يذكرها النص.</span>'},
 fo47:{t:'المصاهر الأحادية الأوتوماتيكية',ref:'ص 94',d:'«ثمانية عشر مصهراً أحادياً أوتوماتيكياً.» <span class="fixnote">الواجهة (4-7-أ) ترسم 27 عنصراً (9 مجموعات × 3)، والنص يقول 18.</span> في الدائرة الخطية: مصهر في كل فرع.'}};
const info47=k=>I47[k]||null;

/* ---------- الشكل (4-6) ص 93 — قطاع أفقي في الورشة وعليه البيانات اللازمة للقوى والإضاءة ---------- */
const D46=[{id:'PF',p:'pin',c:'pf',prot:1},{id:'PQ',p:'pf',c:'pb'},{id:'O1',p:'pb',c:'o1'},{id:'O2',p:'pb',c:'o2'},{id:'O3',p:'pb',c:'o3'},{id:'O4',p:'pb',c:'o4'},{id:'O5',p:'pb',c:'o5'},
 {id:'MS2',p:'o2',c:'m2'},{id:'MS3',p:'o3',c:'m3'},{id:'MS4',p:'o4',c:'m4'},{id:'MS5',p:'o5',c:'m5'},
 {id:'LF',p:'lin',c:'lf',prot:1},{id:'LQ',p:'lf',c:'lb'},{id:'LS1',p:'lb',c:'l1'},{id:'LS2',p:'lb',c:'l2'},{id:'LS3',p:'lb',c:'l3'},{id:'LS4',p:'lb',c:'l4'},{id:'LS5',p:'lb',c:'l5'}];
const OY46=[55,73,91,109,127],MX46=[150,200,250,300],LX46=[110,170,230,290,350];
const SOCKR=(x,y,k,on)=>(on?`<circle class="runbg" cx="${x+7}" cy="${y}" r="13"/>`:'')+L(x,y-9,x,y+9,k)+P(`M${x+12} ${y-10} A10 10 0 0 0 ${x+12} ${y+10}`,k);
function fig46(S){S=S||{};const lv=!!S.live,st=S.st||{open:{},trip:{}},hl=S.hl||'all';
 const k=(n,gp)=>{if(lv&&hl!=='all'&&hl!==gp)return 'off';return lv?(S.en[n]?'on':'off'):''};
 const ds=id=>lv?(st.open[id]?'o':'c'):undefined,fs=id=>lv&&st.open[id]?'x':'';const on=n=>lv&&S.en[n];
 const pe=lv&&hl!=='all'&&hl!=='pe'?'off':hl==='pe'?'pe':'';
 let s='';
 const it=[],A=(kk,x,y,w,h)=>it.push([kk,x,y,w,h]);
 /* الجدران */
 s+=`<rect class="wall" x="0" y="20" width="500" height="12"/><rect class="wall" x="0" y="488" width="500" height="12"/><rect class="wall" x="0" y="20" width="12" height="480"/><rect class="wall" x="488" y="20" width="12" height="360"/><rect class="wall" x="488" y="440" width="12" height="60"/>`
  +`<rect class="wall2" x="205" y="17" width="90" height="18"/>`+L(205,26,295,26,'','thin')+`<rect class="wall2" x="-3" y="150" width="18" height="60"/><rect class="wall2" x="-3" y="330" width="18" height="60"/>`+L(6,150,6,210,'','thin')+L(6,330,6,390,'','thin')
  +P('M488 380 A60 60 0 0 0 428 440','gray','thin')+L(428,440,488,440,'gray','thin')+L(548,410,506,410,'','thin')+AH(506,410,'l','thin')+T(530,402,'مدخل',{sz:11})+L(478,42,478,200,'','thin');
 /* القوى */
 s+=L(530,0,530,110,k('pin','pow'))+L(530,110,470,110,k('pin','pow'))+T(548,58,'3*50 mm² +25 mm²',{sz:10,rot:-90})
  +FUH(470,440,110,fs('PF'),k('pin','pow'),k('pf','pow'),true)+T(456,98,'3',{sz:11})+SWH(432,404,110,ds('PQ'),k('pf','pow'),k('pb','pow'))+L(400,110,390,110,k('pb','pow'))+L(390,46,390,136,k('pb','pow'),'bus')+DOT(390,110,k('pb','pow'));
 A('PC',520,0,22,116);A('PF',440,100,32,20);A('PQ',400,94,36,24);A('BUSP',383,44,13,94);
 OY46.forEach((y,i)=>{const o='o'+(i+1);s+=SWH(385,360,y,ds('O'+(i+1)),k('pb','pow'),k(o,'pow'));A('O'+(i+1),355,y-13,34,18)});
 /* المخرج الأول: «3*6 mm²» إلى رمزين */
 s+=L(356,55,92,55,k('o1','pow'))+T(230,49,'3*6 mm²',{sz:10})+L(92,55,92,290,k('o1','pow'))+DOT(92,245,k('o1','pow'))+L(92,200,104,200,k('o1','pow'))+SOCKR(104,200,k('o1','pow'),on('o1')&&hl!=='lit'&&hl!=='pe')+L(92,290,104,290,k('o1','pow'))+SOCKR(104,290,k('o1','pow'),on('o1')&&hl!=='lit'&&hl!=='pe');
 s+=P('M92 245 H66 V355',pe,'dd');
 A('SO',98,186,30,28);A('SO',98,276,30,28);
 /* المخارج 2–5 إلى المحركات */
 MX46.forEach((x,i)=>{const y=OY46[i+1],o='o'+(i+2),m='m'+(i+2);
  s+=L(356,y,x,y,k(o,'pow'))+T((x+356)/2,y-5,'3*6mm² +4mm²',{sz:9.5})+L(x,y,x,250,k(o,'pow'))+SW(x,250,288,'man',ds('MS'+(i+2)),k(o,'pow'),k(m,'pow'))+L(x,288,x,304,k(m,'pow'))+MOT(x,320,k(m,'pow'),on(m)&&(hl==='all'||hl==='pow'),16)
   +L(x,336,x,355,pe,'dd')+DOT(x,355,pe==='off'?'off':'');
  A('MS'+(i+2),x-22,248,30,42);A('M'+(i+2),x-18,302,36,36)});
 s+=L(66,355,300,355,pe,'dd')+T(56,300,'سلك حماية 10 mm²',{sz:10,rot:-90});
 s+=HITL('PE','M66 355 H300')+HITL('Cm','M356 73 H150 V250')+HITL('C1','M356 55 H92 V290');
 /* الإضاءة */
 s+=L(530,300,530,180,k('lin','lit'))+L(530,180,470,180,k('lin','lit'))+T(548,240,'3*10mm² +6mm²',{sz:10,rot:-90})
  +FUH(470,440,180,fs('LF'),k('lin','lit'),k('lf','lit'),true)+T(456,168,'3',{sz:11})+SWH(432,404,180,ds('LQ'),k('lf','lit'),k('lb','lit'))+L(400,180,390,180,k('lb','lit'))+L(390,165,390,195,k('lb','lit'),'bus')+DOT(390,180,k('lb','lit'))
  +L(390,195,390,470,k('lb','lit'))+TK(390,330,3,k('lb','lit'))+L(390,470,104,470,k('lb','lit'));
 A('LC',520,176,22,128);A('LF',440,170,32,20);A('LQ',400,164,36,24);A('BUSL',383,162,13,36);
 s+=HITL('CL','M390 200 V470 H110');
 LX46.forEach((x,i)=>{const l='l'+(i+1);s+=DOT(x,470,k('lb','lit'))+L(x,470,x,456,k('lb','lit'))+SWV(x,456,436,ds('LS'+(i+1)),k('lb','lit'),k(l,'lit'))+L(x,432,x,414,k(l,'lit'))+TK(x,423,3,k(l,'lit'))+FLV(x,395,38,k(l,'lit'),on(l)&&(hl==='all'||hl==='lit'));
  A('LS'+(i+1),x-8,428,28,32);A('L'+(i+1),x-11,374,22,42)});
 s+=T(372,450,'1.5 mm²',{sz:10,rot:-90});
 const sel=S.sel?it.filter(b=>b[0]===S.sel).map(b=>`<rect class="selr" x="${b[1]-2}" y="${b[2]-2}" width="${b[3]+4}" height="${b[4]+4}" rx="5"/>`).join(''):'';
 return SVG(560,510,sel+s+(S.hits?it.map(b=>HIT(...b)).join(''):''))}
const I46={
 PC:{t:'كابل القوى «3*50 mm² +25 mm²»',ref:'ص 93',d:'الكابل الرئيس للوحة القوى — نفس مقطع الكابل الرئيس في مواصفات لوحة القوى (ص 87).'},
 PF:{t:'مصهر لوحة القوى',ref:'ص 93',d:'مصهر ثلاثي (الشرطة «3») على دخول كابل القوى.'},
 PQ:{t:'المفتاح الرئيس للقوى',ref:'ص 93',d:'طرفان مفرغان بينهما ذراع بعلم. يفصل كل دوائر القوى.'},
 BUSP:{t:'قضيب لوحة القوى',ref:'ص 93',d:'منه خمسة مخارج، كل مخرج عبر مفتاح.'},
 O1:{t:'مفتاح المخرج الأول',ref:'ص 93',d:'يغذي الخط «3*6 mm²».'},O2:{t:'مفتاح مخرج محرك',ref:'ص 93',d:'يغذي خط محرك «3*6mm² +4mm²».'},
 C1:{t:'المخرج الأول «3*6 mm²»',ref:'ص 93',d:'يمتد إلى أقصى اليسار ثم ينزل إلى عقدة يتفرع منها إلى رمزين، ومن العقدة يخرج سلك الحماية. <b>توضيح للمتدرب (ليس من نص الكتاب):</b> الرمزان غير مسميين في الكتاب، والأرجح أنهما مقبسان (أو مخرجا محركي الوجه الواحد).'},
 SO:{t:'رمز غير مسمّى',ref:'ص 93',d:'على المخرج الأول «3*6 mm²». الأرجح مقبس (توضيح منا).'},
 Cm:{t:'خطوط المحركات «3*6mm² +4mm²»',ref:'ص 92–93',d:'«تستخدم الكابلات الخاصة بنقل الطاقة الكهربية ذات أربعة أسلاك ثلاثة منها مساحة مقطع ٦ مم² والرابع ٤ مم² يستخدم كسلك أرضي.»'},
 MS:{t:'مفتاح المحرك',ref:'ص 93',d:'ذراع مائلة مع علامة تشغيل يدوي، قرب المحرك.'},
 M:{t:'محرك ثلاثي الأوجه',ref:'ص 93',d:'أربعة محركات «M 3~» متجاورة (الورشة فيها ٤ محركات ثلاثية الأوجه).'},
 PE:{t:'سلك الحماية «10مم²»',ref:'ص 92–93',d:'خط شرطة-نقطة يمر أسفل المحركات ويتصل بكل محرك. «يجب توصيل سلك أرضي عام للوقاية يتصل كهربيا بالأجزاء المعدنية بجسم المحرك ثم يتصل بالقضيب الأرضي في لوحة التوزيع.»'},
 LC:{t:'كابل الإضاءة «3*10mm² +6mm²»',ref:'ص 93',d:'كابل لوحة الإضاءة.'},
 LF:{t:'مصهر لوحة الإضاءة',ref:'ص 93',d:'مصهر ثلاثي على دخول كابل الإضاءة.'},
 LQ:{t:'المفتاح الرئيس للإضاءة',ref:'ص 93',d:'يفصل كل المصابيح دون أن يمس دوائر القوى.'},
 BUSL:{t:'قضيب لوحة الإضاءة',ref:'ص 93',d:'منه خط ينزل بثلاثة موصلات إلى أسفل الورشة.'},
 CL:{t:'خط الإضاءة',ref:'ص 93',d:'ثلاثة موصلات (شرطة «3») ينزل ثم يسير أفقياً وعليه خمس نقاط، من كل نقطة فرع إلى مصباح. مقطع الموصل «1.5مم²».'},
 LS:{t:'مفتاح المصباح',ref:'ص 93',d:'طرفان مفرغان وذراع؛ مفتاح لكل مصباح (يقابل «خمسة مفاتيح أوتوماتيكية وجه واحد ٥ أمبير» في لوحة الإضاءة ص 92).'},
 L:{t:'مصباح فلورسنت',ref:'ص 93',d:'كبسولة قائمة في أعلاها ×. خمسة مصابيح.'}};
const info46=k=>I46[k]||I46[k.replace(/\d$/,'')]||null;
function lab46(el){const st={open:{MS2:1,MS3:1,MS4:1,MS5:1,LS1:1,LS2:1,LS3:1,LS4:1,LS5:1},trip:{}};let hl='all',sel=null;const w={hl:{}};
 el.innerHTML=`<div class="grid">
  <div class="panel c7"><h2>الورشة: دوائر القوى والإضاءة <small>مبنية على الشكل (4-6) ص 93</small></h2>
   <div class="wrap-in" style="padding-bottom:0">${segHTML('hl',[['all','الكل'],['pow','دوائر القوى'],['lit','دوائر الإضاءة'],['pe','سلك الحماية']],'all')}</div>
   <p class="sub">اضغط على مفتاح لتغلقه أو تفتحه، وعلى مصهر لتنزعه. اضغط على أي شيء آخر لتعرف اسمه.</p>
   <div class="svgbox" id="fg" style="max-width:560px;margin-inline:auto"></div></div>
  <div class="panel c5"><h2>البطاقة</h2><div class="d4card" id="cd"></div><div class="callout" id="ms">مفاتيح المحركات والمصابيح مفتوحة. أغلقها لتشغيلها.</div><div class="d4st" id="ls"></div>
   ${tries(['اختر «دوائر القوى» ثم أغلق مفتاح محرك قرب المحرك.','اختر «دوائر الإضاءة» وأضئ المصابيح الخمسة.','افصل المفتاح الرئيس للقوى: تقف المحركات وتبقى الإضاءة — «تكون الإضاءة منفصلة تماماً عن القوى» (ص 86).','اختر «سلك الحماية» وتتبّعه من المحركات إلى المخرج الأول.'])}</div>
  <div class="panel c12"><h2>التجربة خطوة بخطوة</h2><ol class="steps" id="gs"></ol></div></div>`;
 const $=s=>el.querySelector(s);let en={};
 const draw=()=>{en=energize(D46,['pin','lin'],st);$('#fg').innerHTML=fig46({live:1,en,st,hl,sel,hits:1});$('#cd').innerHTML=card(sel?info46(sel):null);
  $('#ls').innerHTML=[2,3,4,5].map(i=>`<span class="${en['m'+i]?'on':'off'}">محرك ${i-1}</span>`).join('')+[1,2,3,4,5].map(i=>`<span class="${en['l'+i]?'on':'off'}">مصباح ${i}</span>`).join('');gs.check()};
 $('#fg').addEventListener('click',e=>{const h=e.target.closest('[data-k]');if(!h)return;const k=h.dataset.k;sel=k;
  if(D46.some(d=>d.id===k)){if(st.open[k])delete st.open[k];else st.open[k]=1;
   const m={PF:'مصهر القوى',PQ:'المفتاح الرئيس للقوى',LF:'مصهر الإضاءة',LQ:'المفتاح الرئيس للإضاءة'}[k];
   $('#ms').innerHTML=(m?`${st.open[k]?(/F$/.test(k)?'نزعت':'فتحت'):(/F$/.test(k)?'أعدت':'أغلقت')} ${m}.`:st.open[k]?'فتحت المفتاح.':'أغلقت المفتاح.')+(k==='PQ'&&st.open.PQ?' وقفت المحركات، والإضاءة لم تتأثر لأن لها لوحة وكابلاً مستقلين.':'')}
  draw()});
 el.querySelectorAll('[data-hl]').forEach(b=>b.addEventListener('click',()=>{hl=b.dataset.hl;w.hl[hl]=1;el.querySelectorAll('[data-hl]').forEach(x=>x.setAttribute('aria-pressed',x===b));draw()}));
 const gs=stepsUI($('#gs'),[
  {t:'دوائر القوى',x:'اختر «دوائر القوى»: تبقى خطوط القوى واضحة وتخفت الإضاءة.',done:()=>w.hl.pow},
  {t:'شغّل محركاً',x:'اضغط على مفتاح المحرك (الذراع فوق المحرك) فيدور.',done:()=>['MS2','MS3','MS4','MS5'].some(id=>!st.open[id])},
  {t:'أضئ المصابيح الخمسة',x:'اختر «دوائر الإضاءة» وأغلق مفاتيح المصابيح الخمسة (أسفل الورشة).',done:()=>[1,2,3,4,5].every(i=>!st.open['LS'+i])},
  {t:'افصل القوى وحدها',x:'اختر «الكل» ثم افتح المفتاح الرئيس للقوى (قرب الجدار الأيمن في الأعلى): تقف المحركات وتبقى المصابيح مضاءة.',done:()=>st.open.PQ&&en.l1},
  {t:'سلك الحماية',x:'اختر «سلك الحماية» واضغط عليه لتقرأ وظيفته.',done:()=>w.hl.pe&&sel==='PE'}],()=>w);
 draw()}

/* نشاط مقارنة لوحة القوى بلوحة الإضاءة (المصنع) */
const CMP=[['تيار اللوحة','1000 A','500 A','ص 89 / ص 93'],['عدد الخلايا','ثلاث: دخول واثنتان للخروج','اثنتان: دخول وخروج','ص 89 / ص 93'],['الفولتميتر','400 V','400 V','ص 89 / ص 93'],['الأميترات','ثلاثة، سعة 600 A','ثلاثة، سعة 400 A','ص 89 / ص 94'],['المفتاح الرئيس','هوائي يدوي بحماية ضد زيادة الحمل','هوائي يدوي ثلاثة أوجه بحماية 400 A','ص 89 / ص 94'],['مصاهر الدخول','ثلاثة (سعة عالية)','لا يذكرها النص (مرسومة في الشكلين)','ص 89 / ص 94'],['مفاتيح الخروج','أربعة باك سويتش 100 A في كل خلية خروج (8)','تسعة باك سويتش 100 A','ص 89 / ص 94'],['مصاهر الخروج','12 مصهراً 36 A لكل خلية','18 مصهراً أحادياً أوتوماتيكياً','ص 89 / ص 94'],['مخارج الدائرة الخطية','2 × 4 = 8','8','ص 91 / ص 95']];
function cmpWidget(el){const shown={};const draw=()=>{el.innerHTML=`<p class="sub">فكّر في الجواب ثم اضغط «اكشف». <button class="btn" data-all>اكشف الكل</button> <button class="btn" data-none>أخفِ الكل</button></p><div class="tablebox"><table class="tt d4cmp"><thead><tr><th>البند</th><th>لوحة القوى (4-4)</th><th>لوحة الإضاءة (4-7)</th></tr></thead><tbody>${CMP.map((r,i)=>`<tr><td>${r[0]}</td>${[1,2].map(j=>`<td>${shown[i+'-'+j]?B.ltrU(r[j]):`<button class="btn" data-c="${i}-${j}">اكشف</button>`}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p class="sub">المصادر: ${CMP.map(r=>r[3]).filter((v,i,a)=>a.indexOf(v)===i).join('، ')}.</p>`;
  el.querySelectorAll('[data-c]').forEach(b=>b.addEventListener('click',()=>{shown[b.dataset.c]=1;draw()}));
  el.querySelector('[data-all]').addEventListener('click',()=>{CMP.forEach((r,i)=>{shown[i+'-1']=1;shown[i+'-2']=1});draw()});
  el.querySelector('[data-none]').addEventListener('click',()=>{Object.keys(shown).forEach(k=>delete shown[k]);draw()})};draw()}

B.lesson({
 id:'u4-l4',unit:4,order:4,pages:'92–95',
 title:'لوحة توزيع الإضاءة',
 summary:'مواصفات لوحة توزيع الإضاءة لورشة (4-5)، وقطاع الورشة بدوائر القوى والإضاءة وسلك الحماية (4-6)، ولوحة توزيع الإضاءة لمصنع بواجهتها (4-7-أ) ودائرتها الخطية (4-7-ب).',
 stations:[
  {intro:true},

  {st:1,short:'لوحة الإضاءة لورشة',title:'٢- مواصفات لوحة توزيع الإضاءة الرئيسة للورش والمصانع',ref:'ص 92',
   q:'خمسة مصابيح فلورسانت في الورشة… فكم مفتاحاً تتوقع على لوحة إضاءتها؟',
   get art(){const x=50,y=36,k=1;return U4ST.art(U4ST.emb(fig45(),x,y,k)
    +U4ST.tipIn('الرقم ⟦1⟧: مصباح واحد لإضاءة اللوحة من الأمام.',[118,20,24,24],x,y,k)
    +U4ST.tipIn('الرقم ⟦2⟧ في الشكل: علامة ⊗. في النص البند (٢) هو المفتاح؛ الأرجح أن هذه لمبة الإشارة (البند ٣).',[172,52,26,24],x,y,k)
    +U4ST.tipIn('الرقم ⟦3⟧ في الشكل: المفتاح الرئيس — أوتوماتيكي وجه واحد ⟦20⟧ أمبير ⟦220⟧ فولت (البند ٢ في النص).',[106,50,48,64],x,y,k)
    +U4ST.tipIn('الرقم ⟦4⟧: في النص ثلاثة مصاهر ⟦220⟧ فولت ⟦5⟧ أمبير، والشكل يرسمها بعلامة ⊗.',[82,124,96,24],x,y,k)
    +U4ST.tipIn('الرقم ⟦5⟧: خمسة مفاتيح أوتوماتيكية وجه واحد ⟦5⟧ أمبير ⟦220⟧ فولت — مفتاح لكل مصباح.',[34,168,192,46],x,y,k),
    'الشكل 4-5: لوحة توزيع الإضاءة لورشة')},
   cap:'الشكل <span class="ltr">(4-5)</span> لوحة توزيع الإضاءة لورشة <span class="ltr">ص 92</span>.<br><b>مرّر المؤشر على كل رقم (أو المسه في الجوال) لتعرف ما هو.</b>',
   side:[
    {predict:{q:'لوحة إضاءة لورشة فيها خمسة مصابيح فلورسانت. كم مفتاحاً أوتوماتيكياً للخروج تذكر القائمة؟',opts:[
     ['خمسة',true,'«خمسة مفاتيح أوتوماتيكية وجه واحد 5 أمبير 220 فولت» — مفتاح لكل مصباح (ص 92).'],
     ['ثلاثة',false,'الثلاثة هي المصاهر (البند ٤).'],
     ['واحد',false,'الواحد هو المفتاح الرئيس 20 A.']]}}
   ],
   body:[
    {book:String.raw`<p>يختلف حجم لوحة التوزيع حسب حجم القواطع الموجودة بها. فعلى سبيل المثال لوحة توزيع الإضاءة لورشة تحتوي على خمسة مصابيح فلورسانت تكون مواصفات اللوحة كالتالي:</p>
     <p>تصنع اللوحة من صاج سمك ٢ مم بمقياس <span class="ltr">80×80 cm</span> وبعرض <span class="ltr">40 cm</span> كما هو موضح في الشكل (4-5)، ويكون الصاج مدعماً من الداخل بخوص حديد، ويمكن تثبيت اللوحة في الحائط بخوص، وتحتوي اللوحة على الأجهزة والمعدات الآتية:</p>
     <ol><li>مصباحاً واحداً لإضاءة اللوحة من الأمام.</li><li>مفتاحاً واحداً أوتوماتيكياً وجه واحد <span class="ltr">20 A</span> و<span class="ltr">220 V</span>.</li><li>لمبة إشارة واحدة للتأكد من وجود التيار في اللوحة.</li><li>ثلاثة مصاهر <span class="ltr">220 V</span> و<span class="ltr">5 A</span>.</li><li>خمسة مفاتيح أوتوماتيكية وجه واحد <span class="ltr">5 A</span> و<span class="ltr">220 V</span>.</li></ol>`,ref:'ص 92'},
    {watch:String.raw`<p>أرقام الشكل (4-5) لا تطابق قائمة النص: في النص (٢) المفتاح و(٣) لمبة الإشارة، وفي الشكل الرقم 2 علامة ⊗ والرقم 3 المفتاح. والنص (٤) «ثلاثة مصاهر» بينما الشكل يرسم عند الرقم 4 ثلاث علامات ⊗ (رمز المصباح)، وفي الشكل ⊗ رابعة بلا رقم على يسار المفتاح. والشكل بلا أبعاد مع أن النص يذكر <span class="ltr">80×80×40 cm</span>.</p>`,fix:1},
    {tip:String.raw`<p>قارن بلوحة القوى للورشة (ص 87–88): لوحة الإضاءة أصغر (<span class="ltr">80×80</span> سم بدل <span class="ltr">200×80</span>) وتُثبَّت في الحائط بدل القاعدة الخرسانية، ومفاتيحها كلها وجه واحد لأن المصابيح أحادية الوجه.</p>`,title:'أصغر من لوحة القوى'},
    {title:'مختبر مصغّر: النص أم الشكل؟',widget:(el,B)=>DCML.lab(el,B,{intro:'اختر رقماً في الشكل (4-5)، فيُظلَّل مكانه وتقرأ ما يقابله في النص.',
     ins:[{k:'p',l:'الجزء',seg:[['lamp45','1'],['x2_45','2'],['qm45','3'],['f45','4'],['q45','5'],['xL45','⊗ بلا رقم'],['panel45','اللوحة']],v:'qm45'}],
     calc:s=>{const I=I45[s.p];return {pic:`<div style="max-width:300px;margin:auto">${fig45({sel:s.p})}</div>`,msg:`<b>${I.t}</b> (${I.ref}). ${I.d}`}}})}
   ]},

  {st:2,short:'سلك الحماية والشكل (4-6)',title:'ملاحظة: سلك الأرضي العام والشكل (4-6)',ref:'ص 92–93',
   q:'جسم المحرك معدني… فإذا لمسه سلك مقشور، أين يذهب التيار قبل أن يصل إلى يد العامل؟',
   get art(){return U4ST.art(
     U4ST.tip('محرك ثلاثي الأوجه: يصله كابل من أربعة أسلاك؛ ثلاثة للأوجه والرابع سلك أرضي.',[86,96,60,60],MOT(116,126,'',false,24))
    +U4ST.tip('الكابل: ⟦3×6⟧ مم² للأوجه + ⟦4⟧ مم² سلك أرضي (ص 92).',[110,38,180,40],L(116,102,116,56)+L(116,56,290,56)+TKH(200,56,null)+T(212,46,'3*6mm² +4mm²',{sz:10,a:'l'}))
    +U4ST.tip('سلك الأرضي العام للوقاية: يتصل كهربياً بالأجزاء المعدنية بجسم المحرك (في الشكل 4-6 مقطعه ⟦10⟧ مم²).',[96,150,210,98],`<path class="ln pe dd" d="M116 150 V230 H290 V200"/>`+DOT(116,150))
    +U4ST.tip('القضيب الأرضي في لوحة التوزيع: إليه ينتهي سلك الأرضي العام.',[258,164,70,40],`<rect x="262" y="186" width="62" height="10" style="fill:#2C4A40"/>`+T(293,178,'PE',{sz:11}))
    +U4ST.tip('لوحة التوزيع.',[270,30,70,140],`<rect x="290" y="36" width="44" height="130" rx="4" style="fill:#FBF6EE;stroke:#2C4A40;stroke-width:2"/>`)
    +T(180,286,'جسم المحرك متصل بالأرضي',{sz:13,w:700}),
    'محرك يصله كابل أربعة أسلاك، وسلك أرضي عام من جسمه إلى القضيب الأرضي في اللوحة')},
   cap:'فكرة الملاحظة في رسم مبسّط (ليس شكلاً من الكتاب).<br><b>مرّر المؤشر على الأسلاك والقضيب (أو المسها في الجوال) لتعرف وظيفتها.</b>',
   side:[
    {predict:{q:'في كابل المحرك ذي الأسلاك الأربعة، ما وظيفة السلك الذي مقطعه 4 مم²؟',opts:[
     ['وجه رابع للمحرك',false,'المحرك ثلاثي الأوجه: الأوجه ثلاثة أسلاك 6 مم².'],
     ['سلك أرضي',true,'«ثلاثة منها مساحة مقطع 6 مم² والرابع 4 مم² يستخدم كسلك أرضي» (ص 92).'],
     ['سلك للإضاءة',false,'الإضاءة لها لوحة وأسلاك خاصة.']]}}
   ],
   body:[
    {book:String.raw`<p><b>ملاحظة:</b> يجب توصيل سلك أرضي عام للوقاية يتصل كهربياً بالأجزاء المعدنية بجسم المحرك ثم يتصل بالقضيب الأرضي في لوحة التوزيع. تستخدم الكابلات الخاصة بنقل الطاقة الكهربية ذات أربعة أسلاك: ثلاثة منها مساحة مقطع <span class="ltr">6 mm²</span> والرابع <span class="ltr">4 mm²</span> يستخدم كسلك أرضي.</p><p>الشكل (4-6) يبين قطاعاً أفقياً في الورشة وعليه البيانات اللازمة للقوى والإضاءة.</p>
     <figure style="margin:12px 0 0">${box(fig46(),560)}<figcaption style="text-align:center;font-size:13px">الشكل <span class="ltr">(4-6)</span> قطاع أفقي في الورشة وعليه البيانات اللازمة للقوى والإضاءة <span class="ref">ص 93</span></figcaption></figure>`,ref:'ص 92–93'},
    {tip:String.raw`<ul><li><b>كابل القوى</b> «3*50 mm² +25 mm²» ← مصهر ← مفتاح رئيس ← <b>قضيب لوحة القوى</b>، ومنه خمسة مخارج: الأول «3*6 mm²» إلى رمزين، والأربعة الباقية «3*6mm² +4mm²» إلى مفتاح محرك ثم <b>محرك «M 3~»</b>.</li>
     <li><b>سلك الحماية «10مم²»</b> (خط شرطة-نقطة) يمر أسفل المحركات ويتصل بكل محرك، ويصعد إلى عقدة المخرج الأول.</li>
     <li><b>كابل الإضاءة</b> «3*10mm² +6mm²» ← مصهر ← مفتاح ← <b>قضيب لوحة الإضاءة</b> ← خط بثلاثة موصلات عليه خمس نقاط، ومن كل نقطة مفتاح ثم <b>فلورسنت</b>. مقطع موصلات الإضاءة «1.5مم²».</li>
     <li>الشكل يطبق ما طلبه الكتاب ص 86: «يجب أن تخصص لوحة للإضاءة وأخرى للقوى» — لكل منهما كابل ومصهر ومفتاح وقضيب. الرمزان على المخرج الأول غير مسميين في الكتاب، والأرجح أنهما مقبسان.</li></ul>`,title:'كيف تقرأ الشكل (4-6)'},
    {title:'مختبر مصغّر: القوى منفصلة عن الإضاءة',widget:(el,B)=>DCML.lab(el,B,{intro:'كل مفاتيح المحركات والمصابيح مغلقة. افصل أحد المفتاحين الرئيسين وراقب الورشة.',
     predict:{q:'فتحت المفتاح الرئيس للقوى. هل تنطفئ المصابيح؟',opts:[['نعم، كل الورشة تنقطع',false,'الإضاءة لها كابل ومصهر ومفتاح وقضيب خاصة بها.'],['لا، تقف المحركات وتبقى المصابيح مضاءة',true,'«حتى تكون الإضاءة منفصلة تماماً عن القوى» (ص 86).']]},
     ins:[{k:'pq',l:'',sw:true,v:0,on:'المفتاح الرئيس للقوى: مفتوح',off:'المفتاح الرئيس للقوى: مغلق'},{k:'lq',l:'',sw:true,v:0,on:'المفتاح الرئيس للإضاءة: مفتوح',off:'المفتاح الرئيس للإضاءة: مغلق'},
      {k:'hl',l:'أظهر',seg:[['all','الكل'],['pow','دوائر القوى'],['lit','دوائر الإضاءة'],['pe','سلك الحماية']],v:'all'}],
     calc:s=>{const st={open:{},trip:{}};if(s.pq)st.open.PQ=1;if(s.lq)st.open.LQ=1;const en=energize(D46,['pin','lin'],st);
      const m=[2,3,4,5].filter(i=>en['m'+i]).length,l=[1,2,3,4,5].filter(i=>en['l'+i]).length;
      return {pic:fig46({live:1,en,st,hl:s.hl}),facts:[['المحركات العاملة',m+' / 4',m?'hi':'bad'],['المصابيح المضاءة',l+' / 5',l?'hi':'bad']],
       msg:s.hl==='pe'?'سلك الحماية (شرطة-نقطة) يمر أسفل المحركات ويتصل بجسم كل محرك.':s.pq&&!s.lq?'وقفت المحركات وبقيت المصابيح مضاءة: لكل منهما لوحة وكابل مستقلان.':!s.pq&&s.lq?'انطفأت المصابيح وبقيت المحركات تعمل.':s.pq?'فتحت المفتاحين: توقف كل شيء.':'المفتاحان الرئيسان مغلقان.'}}})}
   ]},

  {st:3,short:'لوحة الإضاءة لمصنع',title:'مثال: لوحة توزيع الإضاءة لمصنع',ref:'ص 93–95',
   q:'لوحة الإضاءة للمصنع تشبه لوحة القوى في أعلاها… فأين يظهر الفرق؟',
   get art(){const x=14,y=40,k=0.88;return U4ST.art(U4ST.emb(fig47a(),x,y,k)
    +U4ST.tipIn('خلية الدخول (اليسرى): لمبة إضاءة، فولتميتر ⟦400⟧ فولت، ثلاثة أميترات ⟦400⟧ أمبير، ثلاث لمبات بيان، مفتاح هوائي ⟦400⟧ أمبير.',[10,10,170,260],x,y,k)
    +U4ST.tipIn('خلية الخروج (اليمنى): لمبة بيان، تسعة مفاتيح باك سويتش ⟦100⟧ أمبير، ومصاهر أحادية أوتوماتيكية.',[180,10,190,260],x,y,k)
    +T(180,300,'خليتان: دخول وخروج',{sz:13,w:700}),
    'الشكل 4-7-أ: الواجهة الأمامية للوحة توزيع الإضاءة')},
   cap:'الشكل <span class="ltr">(4-7-أ)</span> <span class="ltr">ص 94</span>.<br><b>مرّر المؤشر على كل خلية (أو المسها في الجوال) لتعرف محتواها.</b>',
   side:[
    {predict:{q:'كم تتحمل لوحة توزيع الإضاءة للمصنع؟',opts:[
     ['1000 A',false,'هذه لوحة القوى للمصنع (ص 89).'],
     ['500 A',true,'«تتحمل اللوحة 500 أمبير» (ص 93).'],
     ['100 A',false,'100 A سعة كل مفتاح باك سويتش.']]}}
   ],
   body:[
    {book:String.raw`<p>الشكل (4-7) يوضح لوحة توزيع الإضاءة لمصنع شاملة أجهزة التحكم والقياس. تتكون لوحة توزيع الإضاءة من خليتين: خلية للدخول وأخرى للخروج تتحمل اللوحة <span class="ltr">500 A</span> وهي مجهزة من الداخل بالقضبان العمومية من النحاس الأحمر الكهربي للأوجه الثلاثة المميزة (الأحمر - الأصفر - الأزرق) بمقطع مناسب حسب الأحمال الفعلية. يجب ألا تزيد كثافة التيار عن <span class="ltr">4 A/mm²</span>. والخلايا من النوع المغلق وتبعد عن الحائط مسافة متر للصيانة، وتزود كل خلية بلمبة إضاءة.</p>
     <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px">
     <div><p><b>وتحتوي خلية الدخول على الآتي:</b></p><ul><li>لمبة إضاءة — جهاز فولت ميتر سعة <span class="ltr">400 V</span>.</li><li>ثلاثة (٣) أميترات سعة <span class="ltr">400 A</span>.</li><li>ثلاث (٣) لمبات بيان تشغيل بالألوان المميزة.</li><li>مفتاحاً هوائياً لتشغيل يدوي ثلاثة (٣) أوجه مزود بالحماية ضد زيادة الحمل <span class="ltr">400 A</span>.</li><li>محولات القياس (تيار — جهد) ثلاثة (٣) أوجه.</li></ul></div>
     <div><p><b>وتحتوي خلية الخروج على الآتي:</b></p><ul><li>لمبة بيان.</li><li>تسعة (٩) مفاتيح باك سويتش سعة كل مفتاح <span class="ltr">100 A</span> لتغذية اللوحات الفرعية.</li><li>ثمانية عشر مصهراً أحادياً أوتوماتيكياً.</li></ul></div></div>
     <p>الشكل (4-7-أ) يبين الواجهة الأمامية للوحة التوزيع، والشكل (4-7-ب) يبين الدائرة الخطية للوحة التوزيع مبيناً عليها الأجهزة والمعدات اللازمة.</p>
     <figure style="margin:12px 0 0">${box(fig47a(),380)}<figcaption style="text-align:center;font-size:13px">الشكل <span class="ltr">(4-7-أ)</span> الواجهة الأمامية للوحة توزيع الإضاءة <span class="ref">ص 94</span></figcaption></figure>
     <figure style="margin:12px 0 0">${box(fig47b(),320)}<figcaption style="text-align:center;font-size:13px">الشكل <span class="ltr">(4-7-ب)</span> الدائرة الخطية للوحة توزيع الإضاءة مبين عليها الأجهزة والمعدات اللازمة <span class="ref">ص 95</span></figcaption></figure>`,ref:'ص 93–95'},
    {watch:String.raw`<p>أعداد لوحة الإضاءة للمصنع غير متسقة: النص (ص 94) تسعة مفاتيح و<b>18</b> مصهراً، والواجهة (4-7-أ) تسعة مفاتيح و<b>27</b> عنصراً (9 مجموعات × 3)، والدائرة الخطية (4-7-ب) <b>8</b> مخارج فقط. وخلية الدخول في النص بلا مصاهر بينما يرسم الشكلان مصاهر فيها. والواجهة ترسم ثلاث لمبات صغيرة تحت كل مفتاح لا يذكرها النص.</p>`,fix:1},
    {tip:String.raw`<p>الجزء العلوي من الدائرة الخطية (4-7-ب) — التغذية والمصهر والمفتاح الهوائي ومحولا القياس — مثل لوحة القوى (4-4-ب) تماماً. الفرق في الخروج: هنا قضيب واحد بثمانية فروع، وهناك مخرجان كل منهما بقضيب فرعي وأربعة فروع.</p>`,title:'قارن بلوحة القوى'},
    {title:'نشاط: قارن لوحة القوى بلوحة الإضاءة',widget:(el,B)=>cmpWidget(el)},
    {title:'مختبر مصغّر: الجزء نفسه في الرسمين',widget:(el,B)=>DCML.lab(el,B,{intro:'اختر جزءاً، فيُظلَّل في الواجهة (فوق) وفي الدائرة الخطية (تحت) إن كان فيهما.',
     ins:[{k:'p',l:'الجزء',seg:[['qm47','المفتاح الهوائي'],['a47','الأميترات'],['qo47','مفاتيح الخروج'],['fo47','مصاهر الخروج'],['fi47','مصاهر الدخول'],['ct','محول التيار']],v:'qo47'}],
     calc:s=>{const I=info47(s.p);const f=fig47a({sel:s.p}),g=fig47b({sel:s.p});const inF=f.includes('class="selr"'),inS=g.includes('class="selr"');
      return {pic:`<div style="max-width:360px;margin:auto">${f}</div><div style="max-width:260px;margin:10px auto 0">${g}</div>`,
       msg:`<b>${I.t}</b> (${I.ref}). ${I.d}<br>${inF&&inS?'مظلّل في الرسمين.':inF?'يظهر في الواجهة فقط.':'في الدائرة الخطية فقط، ولا يظهر في الواجهة.'}`}}})}
   ]},

  {recap:[
   'لوحة إضاءة الورشة (خمسة مصابيح): 80×80 سم وعرض 40 سم، مفتاح رئيس 20 A وخمسة مفاتيح 5 A — مفتاح لكل مصباح (ص 92).',
   'سلك أرضي عام يصل الأجزاء المعدنية لجسم المحرك بالقضيب الأرضي؛ وكابل المحرك أربعة أسلاك: ثلاثة 6 مم² والرابع 4 مم² أرضي (ص 92).',
   'في الشكل (4-6) لكل من القوى والإضاءة كابل ومصهر ومفتاح وقضيب، ففصل أحدهما لا يمس الآخر (ص 93).',
   'لوحة إضاءة المصنع: خليتان تتحملان 500 A، وتسعة مفاتيح باك سويتش 100 A في خلية الخروج (ص 93–94).']}
],
 theory:[
  {h:'٢- مواصفات لوحة توزيع الإضاءة الرئيسة للورش والمصانع',ref:'ص 92',html:`<p>يختلف حجم لوحة التوزيع حسب حجم القواطع الموجودة بها. فعلى سبيل المثال لوحة توزيع الإضاءة لورشة تحتوي على <b>خمسة مصابيح فلورسانت</b> تكون مواصفات اللوحة كالتالي:</p>
   <p>تصنع اللوحة من صاج سمك ٢ مم بمقياس <span class="ltr">80×80 cm</span> وبعرض <span class="ltr">40 cm</span> كما هو موضح في الشكل (4-5)، ويكون الصاج مدعماً من الداخل بخوص حديد، ويمكن تثبيت اللوحة في الحائط بخوص، وتحتوي اللوحة على الأجهزة والمعدات الآتية:</p>
   <ol><li>مصباحاً واحداً لإضاءة اللوحة من الأمام.</li><li>مفتاحاً واحداً أوتوماتيكياً وجه واحد <span class="ltr">20 A</span> و<span class="ltr">220 V</span>.</li><li>لمبة إشارة واحدة للتأكد من وجود التيار في اللوحة.</li><li>ثلاثة مصاهر <span class="ltr">220 V</span> و<span class="ltr">5 A</span>.</li><li>خمسة مفاتيح أوتوماتيكية وجه واحد <span class="ltr">5 A</span> و<span class="ltr">220 V</span>.</li></ol>`},
  {fig:'(4-5)',ref:'ص 92',caption:'لوحة توزيع الإضاءة لورشة',draw:()=>box(fig45(),260)},
  {err:'<span class="fixnote">أرقام الشكل (4-5) لا تطابق قائمة النص: في النص (٢) المفتاح و(٣) لمبة الإشارة، وفي الشكل الرقم 2 علامة ⊗ والرقم 3 المفتاح. والنص (٤) «ثلاثة مصاهر» بينما الشكل يرسم عند الرقم 4 ثلاث علامات ⊗ (رمز المصباح)، وفي الشكل ⊗ رابعة بلا رقم على يسار المفتاح. والشكل بلا أبعاد مع أن النص يذكر <span class="ltr">80×80×40 cm</span>.</span>'},
  {html:`<p><b>ملاحظة:</b> يجب توصيل <b>سلك أرضي عام للوقاية</b> يتصل كهربياً بالأجزاء المعدنية بجسم المحرك ثم يتصل بالقضيب الأرضي في لوحة التوزيع. تستخدم الكابلات الخاصة بنقل الطاقة الكهربية ذات <b>أربعة أسلاك</b>: ثلاثة منها مساحة مقطع <span class="ltr">6 mm²</span> والرابع <span class="ltr">4 mm²</span> يستخدم كسلك أرضي. <span class="ref">ص 92</span></p><p>الشكل (4-6) يبين قطاعاً أفقياً في الورشة وعليه البيانات اللازمة للقوى والإضاءة.</p>`},
  {fig:'(4-6)',ref:'ص 93',caption:'قطاع أفقي في الورشة وعليه البيانات اللازمة للقوى والإضاءة',draw:()=>box(fig46(),560)},
  {h:'كيف تقرأ الشكل (4-6)',ref:'ص 93',html:`<ul>
   <li><b>كابل القوى</b> «3*50 mm² +25 mm²» ← مصهر ← مفتاح رئيس ← <b>قضيب لوحة القوى</b>، ومنه خمسة مخارج كل منها عبر مفتاح: الأول «3*6 mm²» إلى رمزين، والأربعة الباقية «3*6mm² +4mm²» إلى مفتاح محرك ثم <b>محرك «M 3~»</b>.</li>
   <li><b>سلك الحماية «10مم²»</b> (خط شرطة-نقطة) يمر أسفل المحركات ويتصل بكل محرك، ويصعد إلى عقدة المخرج الأول.</li>
   <li><b>كابل الإضاءة</b> «3*10mm² +6mm²» ← مصهر ← مفتاح ← <b>قضيب لوحة الإضاءة</b> ← خط بثلاثة موصلات عليه خمس نقاط، ومن كل نقطة مفتاح ثم <b>فلورسنت</b>. مقطع موصلات الإضاءة «1.5مم²».</li></ul>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> الشكل يطبق ما طلبه الكتاب ص 86: «يجب أن تخصص لوحة للإضاءة وأخرى للقوى حتى تكون الإضاءة منفصلة تماماً عن القوى» — لكل منهما كابل ومصهر ومفتاح وقضيب. الرمزان على المخرج الأول غير مسميين في الكتاب، والأرجح أنهما مقبسان.'},
  {h:'مثال: لوحة توزيع الإضاءة لمصنع',ref:'ص 93–94',html:`<p>الشكل (4-7) يوضح لوحة توزيع الإضاءة لمصنع شاملة أجهزة التحكم والقياس. تتكون لوحة توزيع الإضاءة من <b>خليتين: خلية للدخول وأخرى للخروج</b> تتحمل اللوحة <span class="ltr">500 A</span> وهي مجهزة من الداخل بالقضبان العمومية من النحاس الأحمر الكهربي للأوجه الثلاثة المميزة (الأحمر - الأصفر - الأزرق) بمقطع مناسب حسب الأحمال الفعلية. يجب ألا تزيد كثافة التيار عن <span class="ltr">4 A/mm²</span>. والخلايا من النوع المغلق وتبعد عن الحائط مسافة متر للصيانة، وتزود كل خلية بلمبة إضاءة.</p>
   <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px">
   <div><p><b>وتحتوي خلية الدخول على الآتي:</b></p><ul><li>لمبة إضاءة — جهاز فولت ميتر سعة <span class="ltr">400 V</span>.</li><li>ثلاثة (٣) أميترات سعة <span class="ltr">400 A</span>.</li><li>ثلاث (٣) لمبات بيان تشغيل بالألوان المميزة.</li><li>مفتاحاً هوائياً لتشغيل يدوي ثلاثة (٣) أوجه مزود بالحماية ضد زيادة الحمل <span class="ltr">400 A</span>.</li><li>محولات القياس (تيار — جهد) ثلاثة (٣) أوجه.</li></ul></div>
   <div><p><b>وتحتوي خلية الخروج على الآتي:</b></p><ul><li>لمبة بيان.</li><li>تسعة (٩) مفاتيح باك سويتش سعة كل مفتاح <span class="ltr">100 A</span> لتغذية اللوحات الفرعية.</li><li>ثمانية عشر مصهراً أحادياً أوتوماتيكياً.</li></ul></div></div>
   <p>الشكل (4-7-أ) يبين الواجهة الأمامية للوحة التوزيع، والشكل (4-7-ب) يبين الدائرة الخطية للوحة التوزيع مبيناً عليها الأجهزة والمعدات اللازمة.</p>`},
  {fig:'(4-7-أ)',ref:'ص 94',caption:'الواجهة الأمامية للوحة توزيع الإضاءة',draw:()=>box(fig47a(),380)},
  {fig:'(4-7-ب)',ref:'ص 95',caption:'الدائرة الخطية للوحة توزيع الإضاءة مبين عليها الأجهزة والمعدات اللازمة',draw:()=>box(fig47b(),320)},
  {err:'<span class="fixnote">أعداد لوحة الإضاءة للمصنع غير متسقة: النص (ص 94) تسعة مفاتيح و<b>18</b> مصهراً، والواجهة (4-7-أ) تسعة مفاتيح و<b>27</b> عنصراً (9 مجموعات × 3)، والدائرة الخطية (4-7-ب) <b>8</b> مخارج فقط. وخلية الدخول في النص بلا مصاهر بينما يرسم الشكلان مصاهر فيها. والواجهة ترسم ثلاث لمبات صغيرة تحت كل مفتاح لا يذكرها النص.</span>'},
  {h:'نشاط: قارن لوحة القوى بلوحة الإضاءة',ref:'ص 89–95',widget:(el)=>cmpWidget(el)}
 ],
 lab:(el)=>{el.innerHTML='<div id="p46"></div><div id="pnl" style="margin-top:16px"></div>';lab46(el.querySelector('#p46'));
  panelLab(el.querySelector('#pnl'),{title:'واجهات لوحات الإضاءة التفاعلية',sub:'الشكل (4-5) ص 92 والشكلان (4-7-أ) ص 94 و(4-7-ب) ص 95',
   views:[
    {id:'45',label:'لوحة إضاءة لورشة (4-5)',fTitle:'لوحة توزيع الإضاءة لورشة <small>الشكل (4-5)</small>',fw:300,front:fig45,info:k=>I45[k],
     find:[['مصباح إضاءة اللوحة','lamp45'],['المفتاح الأوتوماتيكي 20 A','qm45'],['المفاتيح الخمسة 5 A','q45'],['العنصر رقم 4 (المصاهر في النص)','f45']]},
    {id:'47',label:'لوحة إضاءة لمصنع (4-7)',fTitle:'الواجهة الأمامية <small>الشكل (4-7-أ)</small>',fw:400,front:fig47a,sTitle:'الدائرة الخطية <small>الشكل (4-7-ب)</small>',sl:fig47b,info:info47,
     find:[['الفولتميتر','v47'],['الأميترات 400 A','a47'],['المفتاح الهوائي 400 A','qm47'],['مفاتيح باك سويتش 100 A','qo47'],['المصاهر الأحادية الأوتوماتيكية','fo47'],['محول الجهد','vt']]}],
   tries:['في لوحة الورشة اضغط على الرقمين 2 و 3 وقارن بالنص.','في لوحة المصنع اضغط على مفتاح باك سويتش: تُظلَّل المخارج الثمانية في الخطية.','عُدّ المصاهر في الواجهة وقارن بالنص (18).'],
   steps:[
    {t:'المفتاح الرئيس',x:'في «لوحة إضاءة لورشة» اضغط على المربع الأوسط (الرقم 3).',done:w=>w.seen['45:qm45']},
    {t:'الرقم 4',x:'اضغط على صف العلامات رقم 4 واقرأ الفرق بين النص والشكل.',done:w=>w.seen['45:f45']},
    {t:'لوحة المصنع',x:'اختر «لوحة إضاءة لمصنع (4-7)» واضغط على المفتاح الهوائي.',done:w=>w.seen['47:qm47']},
    {t:'المخارج',x:'اضغط على أحد مفاتيح خلية الخروج، ثم عُدّ المخارج المظللة في الدائرة الخطية.',done:w=>w.seen['47:qo47']},
    {t:'ابحث عن الجزء',x:'اضغط «ابحث عن الجزء» وأجب عن أربعة على الأقل من أول محاولة.',done:w=>w.found>=4}]})},
 examples:[{title:'مثال مرسوم: الدائرة الخطية للوحة توزيع الإضاءة (4-7-ب)',ref:'ص 95',
  q:'<p>ارسم الدائرة الخطية للوحة توزيع الإضاءة للمصنع خطوة بخطوة. الجزء الجديد في كل خطوة بلون مميَّز.</p>',
  solve:()=>[
   ['<b>قضيب التغذية</b> في الأعلى ونقطة الخط الرئيس.',1],
   ['<b>مصهر</b> ثم <b>المفتاح الهوائي</b> بعلامة التشغيل اليدوي.',2],
   ['<b>محول التيار</b> وخطه إلى أجهزة القياس (ثلاث شرط).',3],
   ['<b>محول الجهد</b> وخطه (ثلاث شرط).',4],
   ['<b>قضيب التوزيع</b> وعليه ثماني نقاط (الخط الرئيس يصل عند النقطة الثانية).',5],
   ['<b>ثمانية فروع</b>، كل فرع مصهر ثم مفتاح ثم خط مفتوح إلى لوحة فرعية.',6],
   ['<b>أجهزة القياس</b>: «V» وثلاثة «A» تحت كل منها لمبة بيان.',7],
   ['اكتملت الدائرة. الجزء العلوي مثل لوحة القوى (4-4-ب) تماماً؛ الفرق أن الخروج هنا قضيب واحد بثمانية فروع.',8]
  ].map(([t,n],i,a)=>({t:t+box(fig47b({stage:n}),300),final:i===a.length-1}))}],
 quiz:[
  {q:'ما أبعاد لوحة توزيع الإضاءة للورشة؟',o:['200×80 سم وعرض 40 سم','80×80 سم وعرض 40 سم','100×100 سم','50×50 سم'],c:1,e:'(ص 92).'},
  {q:'كم مفتاحاً أوتوماتيكياً للخروج في لوحة إضاءة الورشة، وما سعتها؟',o:['ثلاثة، 20 A','خمسة، 5 A و 220 V','تسعة، 100 A','أربعة، 25 A'],c:1,e:'«خمسة مفاتيح أوتوماتيكية وجه واحد ٥ أمبير ٢٢٠ فولت» — مفتاح لكل فلورسنت (ص 92).'},
  {q:'ما الكابل المستخدم لنقل الطاقة إلى المحركات حسب ملاحظة ص 92؟',o:['سلكان 1.5 مم²','أربعة أسلاك: ثلاثة 6 مم² والرابع 4 مم² سلك أرضي','خمسة أسلاك 10 مم²','كابل واحد 50 مم²'],c:1,e:'(ص 92) — ومكتوب على الشكل (4-6) «3*6mm² +4mm²».'},
  {q:'ما مقطع سلك الحماية في الشكل (4-6)؟',o:['1.5 مم²','4 مم²','10 مم²','25 مم²'],c:2,e:'مكتوب تحته «سلك حماية 10مم²» (ص 93).'},
  {q:'كم تتحمل لوحة توزيع الإضاءة للمصنع؟',o:['1000 A','500 A','400 A','100 A'],c:1,e:'(ص 93).'},
  {q:'ما ألوان القضبان العمومية للأوجه الثلاثة في لوحة الإضاءة؟',o:['الأحمر - الأصفر - الأزرق','الأسود - الأبيض - الأخضر','الأحمر - الأسود - الأبيض','لا يذكر الكتاب ألواناً'],c:0,e:'(ص 93).'},
  {q:'كم مخرجاً في الدائرة الخطية (4-7-ب)؟',o:['9','8','18','27'],c:1,e:'ثمانية مخارج، مع أن النص والواجهة فيهما تسعة مفاتيح — تعارض في الكتاب.'}
 ]
});

/* =====================================================================
   التمرين (1): الشكل (4-8) ص 97 — توزيع الطاقة الكهربائية (هيكل) + حل مقترح
   ===================================================================== */
const D48=[{id:'Q1',p:'s1',c:'mb',prot:1},{id:'Q2',p:'s2',c:'mb',prot:1},{id:'Q3',p:'mb',c:'sd1',prot:1},{id:'Q5',p:'mb',c:'sd3',prot:1},{id:'Q4',p:'mb',c:'q4',prot:1},{id:'Q6',p:'q4',c:'b2'},
 {id:'Q7',p:'b2',c:'q7',prot:1},{id:'Q9',p:'q7',c:'lbL'},{id:'Q8',p:'b2',c:'q8',prot:1},{id:'Q10',p:'q8',c:'lbR'},
 {id:'C1',p:'lbL',c:'c1',prot:1},{id:'C2',p:'lbL',c:'c2',prot:1},{id:'C3',p:'lbL',c:'c3',prot:1},{id:'C4',p:'lbL',c:'c4',prot:1},{id:'C5',p:'lbR',c:'c5',prot:1},{id:'C6',p:'lbR',c:'c6',prot:1},
 {id:'F7',p:'lbR',c:'c7a',prot:1},{id:'TH7',p:'c7a',c:'c7'},{id:'F8',p:'lbR',c:'c8',prot:1}];
const CONS=['مقابس بملامسات وقاية','مصابيح تفريغ كهربائية','مصابيح توهج','محول جهد صغير','محرك ثلاثي الأوجه','مقابس ثلاثية الأوجه','مروحة بمحرك ثلاثي الأوجه','مقاومات تسخين'];
const LX48=[70,120,170,220,320,370,420,470];
function consSym(i,x,y,k,on){switch(i){
 case 0:return SOCK(x,y,k,on)+L(x-12,y+2,x+12,y+2,k,'thin');
 case 1:return FLV(x,y+16,30,k,on);
 case 2:return L(x,y,x,y+7,k)+LAMPX(x,y+16,k,on,8);
 case 3:return L(x,y,x,y+3,k)+XF(x,y+16,k,8);
 case 4:return L(x,y,x,y+3,k)+MOT(x,y+18,k,on,14);
 case 5:return SOCK(x,y,k,on)+T(x,y+26,'3~',{sz:9});
 case 6:return L(x,y,x,y+3,k)+MOT(x,y+18,k,on,14)+P(`M${x+14} ${y+8} q8 -6 10 2 q-4 6 -10 -2 M${x+14} ${y+28} q8 6 10 -2 q-4 -6 -10 2`,k,'thin');
 case 7:return HEAT(x,y,k,on,30);}}
function fig48(S){S=S||{};const sol=!!S.sol,g=mkG(S),lv=!!S.live,st=S.st||{open:{},trip:{}};
 const k=n=>lv?(S.en[n]?'on':'off'):'';const ds=id=>lv?(st.trip[id]?'t':st.open[id]?'o':'c'):undefined;const fs=id=>lv&&(st.trip[id]||st.open[id])?'x':'';const on=n=>lv&&S.en[n];
 const it=[],A=(kk,x,y,w,h)=>it.push([kk,x,y,w,h]);let s='';
 const lab=(x,y,t,a)=>T(x,y,t,{sz:12,w:700,a:a||'m'});
 /* المحولان والموزع الرئيس */
 s+=g(0,[[170,'T1','Q1','s1'],[370,'T2','Q2','s2']].map(([x,t,q,n])=>L(x,4,x,22,k(n))+XF(x,38,k(n),10)+lab(x-30,34,t)+L(x,54,x,sol?80:72,k(n))+lab(x+24,96,q,'l')).join('')
  +L(30,120,520,120,k('mb'),'bus')+T(70,105,'موزع رئيسي',{sz:11})+[70,170,270,370,470].map(x=>DOT(x,120,k('mb'))).join('')
  +[[70,'Q3'],[270,'Q4'],[470,'Q5']].map(([x,q])=>L(x,120,x,130,k('mb'))+lab(x-24,150,q,'r')).join('')
  +L(70,180,70,214,k('sd1'))+AHF(70,224,'d')+L(470,180,470,214,k('sd3'))+AHF(470,224,'d')
  +T(70,240,'الموزع الفرعي الأول',{sz:11})+T(470,240,'الموزع الفرعي الثالث',{sz:11})
  +L(30,270,520,270,k('b2'),'bus')+T(95,262,'موزع فرعي ثاني',{sz:11})+[170,270,370].map(x=>DOT(x,270,k('b2'))).join('')
  +L(270,270,270,(sol?262:258),k('b2'))+lab(298,248,'Q6','l')+L(170,270,170,282,k('b2'))+lab(146,300,'Q7','r')+L(370,270,370,282,k('b2'))+lab(394,300,'Q8','l')
  +L(40,410,250,410,k('lbL'),'bus')+L(290,410,520,410,k('lbR'),'bus')+LX48.map((x,i)=>DOT(x,410,k(i<4?'lbL':'lbR'))).join('')
  +L(170,410,170,396,k('lbL'))+lab(146,384,'Q9','r')+L(370,410,370,396,k('lbR'))+lab(394,384,'Q10','l')
  +T(95,400,'موزع الأحمال ( الإضاءة )',{sz:10})+T(305,400,'موزع الأحمال ( القدرة )',{sz:10})
  +LX48.map((x,i)=>{const n='c'+(i+1),kk=k(i<4?'lbL':'lbR'),kn=k(i===6?'c7a':n);
    if(i<6)return L(x,410,x,432,kk)+TK(x,421,3,kk)+SW(x,432,480,'mcb',ds('C'+(i+1)),kk,k(n))+L(x,480,x,sol?528:520,k(n));
    if(i===6)return L(x,410,x,432,kk)+TK(x,421,4,kk)+FU(x,432,468,fs('F7'),kk,kn,true)+T(x+13,446,'3',{sz:10,a:'l'})+L(x,468,x,486,kn)+TK(x,477,3,kn)+SW(x,486,516,'th',ds('TH7'),kn,k('c7'))+L(x,516,x,sol?528:524,k('c7'));
    return L(x,410,x,432,kk)+TK(x,421,5,kk)+FU(x,432,468,fs('F8'),kk,k(n),true)+T(x+13,446,'3',{sz:10,a:'l'})+L(x,468,x,sol?528:524,k(n))}).join(''));
 if(!sol)s+=LX48.map((x,i)=>T(x,544,String(i+1),{sz:12})).join('');
 /* الحل المقترح */
 if(sol){
  s+=g(1,[[170,'Q1','s1'],[370,'Q2','s2']].map(([x,q,n])=>SW(x,80,116,'cb',ds(q),k(n),k('mb'))+L(x,116,x,120,k('mb'))).join(''));
  s+=g(2,[[70,'Q3','sd1'],[470,'Q5','sd3'],[270,'Q4','q4']].map(([x,q,n])=>SW(x,130,170,'cb',ds(q),k('mb'),k(n))+L(x,170,x,x===270?222:180,k(n))).join(''));
  s+=g(3,SW(270,222,262,'ds',ds('Q6'),k('q4'),k('b2'))+SW(170,282,322,'cb',ds('Q7'),k('b2'),k('q7'))+L(170,322,170,356,k('q7'))+SW(170,356,396,'ds',ds('Q9'),k('q7'),k('lbL'))
   +SW(370,282,322,'cb',ds('Q8'),k('b2'),k('q8'))+L(370,322,370,356,k('q8'))+SW(370,356,396,'ds',ds('Q10'),k('q8'),k('lbR')));
  s+=g(4,LX48.slice(0,4).map((x,i)=>consSym(i,x,528,k('c'+(i+1)),on('c'+(i+1)))+T(x,590,'('+(i+1)+')',{sz:11,c:'m'})).join(''));
  s+=g(5,LX48.slice(4).map((x,j)=>{const i=j+4;return consSym(i,x,528,k('c'+(i+1)),on('c'+(i+1)))+T(x,590,'('+(i+1)+')',{sz:11,c:'m'})}).join(''));
  [['Q1',150,78,40,42],['Q2',350,78,40,42],['Q3',48,128,40,44],['Q4',248,128,40,44],['Q5',448,128,40,44],['Q6',248,220,40,44],['Q7',148,280,40,44],['Q8',348,280,40,44],['Q9',148,354,40,44],['Q10',348,354,40,44]].forEach(b=>A(...b));
  LX48.forEach((x,i)=>{A(i<6?'C'+(i+1):i===6?'F7':'F8',x-26,430,40,i<6?52:40);A('L'+(i+1),x-16,526,32,50)});A('TH7',400,486,30,32);
  [['mb',30,113,490,14],['b2',30,263,490,14],['lbL',40,403,210,14],['lbR',290,403,230,14]].forEach(b=>A(...b));}
 if(S.fault){const p={mb:[500,108],b2:[500,258],lbL:[240,398],lbR:[510,398]}[S.fault]||(/^L(\d)$/.test(S.fault)?[LX48[+S.fault[1]-1]+16,540]:null);if(p)s+=BOLT(p[0],p[1])}
 const sel=S.sel?it.filter(b=>b[0]===S.sel).map(b=>`<rect class="selr" x="${b[1]-2}" y="${b[2]-2}" width="${b[3]+4}" height="${b[4]+4}" rx="5"/>`).join(''):'';
 return SVG(550,sol?600:556,sel+s+(S.hits?it.map(b=>HIT(...b)).join(''):''))}
const QTXT={Q1:'مفتاح قدرة أوتوماتيكي للمحول T1',Q2:'مفتاح قدرة أوتوماتيكي للمحول T2',Q3:'مفتاح قدرة أوتوماتيكي للموزع الفرعي الأول',Q4:'مفتاح قدرة أوتوماتيكي للموزع الفرعي الثاني',Q5:'مفتاح قدرة أوتوماتيكي للموزع الفرعي الثالث',Q6:'مفتاح قدرة للموزع الفرعي الثاني',Q7:'مفتاح قدرة أوتوماتيكي لموزع المستهلك (الإضاءة)',Q8:'مفتاح قدرة أوتوماتيكي لموزع المستهلك (القدرة)',Q9:'مفتاح قدرة لموزع المستهلك (الإضاءة)',Q10:'مفتاح قدرة لموزع المستهلك (القدرة)'};
const NODE48={mb:'mb',b2:'b2',lbL:'lbL',lbR:'lbR',L1:'c1',L2:'c2',L3:'c3',L4:'c4',L5:'c5',L6:'c6',L7:'c7',L8:'c8'};
const NAME48=Object.assign({},QTXT,{C1:'قاطع المستهلك 1',C2:'قاطع المستهلك 2',C3:'قاطع المستهلك 3',C4:'قاطع المستهلك 4',C5:'قاطع المستهلك 5',C6:'قاطع المستهلك 6',F7:'مصهر المستهلك 7',TH7:'التلامس الحراري للمستهلك 7',F8:'مصهر المستهلك 8',mb:'الموزع الرئيسي',b2:'الموزع الفرعي الثاني',lbL:'موزع الأحمال (الإضاءة)',lbR:'موزع الأحمال (القدرة)'});
CONS.forEach((c,i)=>{NAME48['L'+(i+1)]=`(${i+1}) ${c}`});
const SHORT48={Q1:'Q1',Q2:'Q2',Q3:'Q3',Q4:'Q4',Q5:'Q5',Q6:'Q6',Q7:'Q7',Q8:'Q8',Q9:'Q9',Q10:'Q10'};
function info48(k){if(QTXT[k])return {t:k+' — '+QTXT[k],ref:'ص 96',d:(/أوتوماتيكي/.test(QTXT[k])?'رسمناه في الحل المقترح بذراع وعلامة الفصل الأوتوماتيكي (يحمي ويفصل).':'رسمناه في الحل المقترح بذراع فقط (للفصل، بلا علامة الفصل الأوتوماتيكي).')+(k==='Q1'||k==='Q2'?' المحولان T1 و T2 يغذيان الموزع الرئيسي معاً، فإذا فُتح أحدهما بقي الآخر يغذّي.':'')};
 if(/^L\d$/.test(k)){const i=+k[1]-1;return {t:`(${i+1}) ${CONS[i]}`,ref:'ص 96',d:'رمز المستهلك في نهاية خطه — من «مسار التيار في التوزيع للمستهلكات». الرمز في الحل المقترح من رموز الوحدة الثانية.'}}
 if(/^C\d$/.test(k))return {t:'قاطع آلي',ref:'ص 97',d:'مرسوم في الشكل (4-8): ذراع مع علامة حرارية وسهم، وقبله شرطة «3».'};
 if(k==='F7'||k==='F8')return {t:'مصهر',ref:'ص 97',d:'مصهر ثلاثي (الشرطة «3» عليه).'+(k==='F7'?' قبله شرطة «4» وبعده «3» ثم تلامس حراري.':' قبله شرطة «5».')};
 if(k==='TH7')return {t:'تلامس حراري',ref:'ص 97',d:'ذراع مع علامة حرارية بلا سهم — يفصل المروحة عند زيادة الحمل.'};
 return {t:NAME48[k]||k,ref:'ص 97',d:'قضيب في الشكل (4-8).'}}
function lab48(el){const st={open:{},trip:{}};let mode='sw',fault=null,sel=null;const w={};
 el.innerHTML=`<div class="grid">
  <div class="panel c7"><h2>تحقّق من حلك: الشبكة بعد إكمالها <small>الحل المقترح للتمرين (1) على الشكل (4-8) ص 97 — ليس من الكتاب</small></h2>
   <div class="wrap-in" style="padding-bottom:0">${segHTML('md',[['sw','افصل / أعد التوصيل'],['ft','ضع قصراً (عطل)']],'sw')}<button class="btn" id="fx" hidden>أزل العطل</button><button class="btn" id="rs">أعد كل شيء</button></div>
   <div class="svgbox" id="fg" style="max-width:550px;margin-inline:auto"></div>
   <div class="legend"><span><i style="background:var(--live)"></i>فيه تغذية</span><span><i style="background:var(--muted)"></i>بلا تغذية</span><span><i style="background:var(--stop)"></i>فصل بسبب عطل</span></div></div>
  <div class="panel c5"><h2>ماذا حدث؟</h2><div class="callout" id="ms">كل المفاتيح مغلقة.</div><div class="d4st" id="ls"></div><div class="d4card" id="cd"></div>
   ${tries(['افتح Q1 وحده: لا ينقطع شيء لأن T2 يغذي عبر Q2. ثم افتح Q2 أيضاً.','افتح Q6: ينقطع الموزع الفرعي الثاني بكل أحماله، ويبقى الموزعان الأول والثالث.','ضع قصراً على المروحة (7): يفصل مصهرها فقط.','ضع قصراً على الموزع الرئيسي: يفصل Q1 و Q2 معاً.'])}</div>
  <div class="panel c12"><h2>التجربة خطوة بخطوة</h2><ol class="steps" id="gs"></ol></div></div>`;
 const $=s=>el.querySelector(s);let en={};const EN=()=>energize(D48,['s1','s2'],st);
 const LO=CONS.map((c,i)=>['c'+(i+1),'('+(i+1)+')']).concat([['sd1','الفرعي الأول'],['sd3','الفرعي الثالث']]);
 const lost=(a,b)=>LO.filter(([n])=>a[n]&&!b[n]).map(x=>x[1]);
 const draw=()=>{en=EN();$('#fg').innerHTML=fig48({sol:1,live:1,en,st,sel,hits:1,fault});$('#cd').innerHTML=card(sel?info48(sel):null);$('#fx').hidden=!fault;
  $('#ls').innerHTML=LO.map(([n,t])=>`<span class="${en[n]?'on':'off'}">${t}</span>`).join('');gs.check()};
 $('#fg').addEventListener('click',e=>{const h=e.target.closest('[data-k]');if(!h)return;const k=h.dataset.k;sel=k;const before=en;let m='';
  if(mode==='sw'&&D48.some(d=>d.id===k)){if(st.trip[k]){delete st.trip[k];m=`أعدت ${SHORT48[k]||NAME48[k]}.`}else if(st.open[k]){delete st.open[k];m=`أغلقت ${SHORT48[k]||NAME48[k]}.`}else{st.open[k]=1;w[k]=1;m=`فتحت ${SHORT48[k]||NAME48[k]}.`}
   let after=EN();if(fault&&after[NODE48[fault]]){const out=[];tripUp(D48,NODE48[fault],st,after,out);if(out.length){m+=` العطل ما زال موجوداً ففصل ${out.join(' و')} مرة أخرى.`;after=EN()}}
   const ls=lost(before,after),bk=lost(after,before);m+=ls.length?` انقطعت التغذية عن: <b>${ls.join('، ')}</b>.`:bk.length?` عادت التغذية إلى: ${bk.join('، ')}.`:' لم ينقطع شيء.';
   if((k==='Q1'||k==='Q2')&&!ls.length&&st.open[k])m+=' المحول الآخر ما زال يغذي الموزع الرئيسي.'}
  else if(mode==='ft'&&NODE48[k]){const n=NODE48[k];if(!en[n])m='هذا الجزء بلا تغذية، فلا يمر تيار قصر.';else{const out=[];tripUp(D48,n,st,en,out);fault=k;const ls=lost(before,EN());
   m=out.length?`قصر عند <b>${NAME48[k]}</b>: فصل <b>${out.join(' و')}</b> فقط.`+(ls.length?` انقطع: ${ls.join('، ')}.`:''):'التلامس الحراري مفتوح فلا يمر تيار قصر.';if(k==='L7'&&out.includes('F7'))w.f7=1;if(k==='mb')w.fmb=1}}
  else if(mode==='ft')m='في وضع «ضع قصراً» اضغط على مستهلك أو قضيب.';
  if(m)$('#ms').innerHTML=m;draw()});
 el.querySelectorAll('[data-md]').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.md;el.querySelectorAll('[data-md]').forEach(x=>x.setAttribute('aria-pressed',x===b))}));
 $('#rs').addEventListener('click',()=>{st.open={};st.trip={};fault=null;$('#ms').innerHTML='أعدت كل شيء.';draw()});
 $('#fx').addEventListener('click',()=>{fault=null;$('#ms').innerHTML='أزلت العطل. أعد الجهاز الذي فصل.';draw()});
 const gs=stepsUI($('#gs'),[
  {t:'محولان على موزع واحد',x:'افتح Q1: لا ينقطع شيء. ثم افتح Q2: ينقطع المصنع كله.',done:()=>st.open.Q1&&st.open.Q2},
  {t:'الموزع الفرعي الثاني',x:'اضغط «أعد كل شيء» ثم افتح Q6.',done:()=>st.open.Q6&&!st.open.Q1},
  {t:'موزع الإضاءة وحده',x:'أعد Q6 وافتح Q9: تنقطع المستهلكات 1–4 فقط.',done:()=>st.open.Q9&&!st.open.Q6},
  {t:'قصر على المروحة',x:'أعد Q9، واختر «ضع قصراً» واضغط على المستهلك (7).',done:()=>w.f7},
  {t:'قصر على الموزع الرئيسي',x:'أزل العطل وأعد كل شيء، ثم ضع قصراً على الموزع الرئيسي: يفصل Q1 و Q2.',done:()=>w.fmb}],()=>w);
 draw()}

/* =====================================================================
   التمرين (2): الشكل (4-9) ص 98 — قطاع أفقي في مبنى ورشة + حل مقترح
   ===================================================================== */
function SOCKW(x,y,rot,earth){return `<g transform="rotate(${rot||0} ${x} ${y})">`+L(x,y,x,y+5)+L(x-7,y+5,x+7,y+5)+P(`M${x-8} ${y+15} A8 8 0 0 1 ${x+8} ${y+15}`)+(earth?DOT(x,y+19,'',2.2):'')+`</g>`}
const WIN=(x,y,w,h)=>`<rect class="wall2" x="${x}" y="${y}" width="${w}" height="${h}"/>`+(w>h?L(x,y+h/2,x+w,y+h/2,'','thin'):L(x+w/2,y,x+w/2,y+h,'','thin'));
function fig49(S){S=S||{};const g=mkG(S);let s='';
 /* الجدران */
 s+=`<path class="wall2" fill-rule="evenodd" d="M8 8H552V548H8Z M16 16H544V540H16Z"/>`
  +`<rect class="wall2" x="16" y="196" width="234" height="8"/><rect class="wall2" x="250" y="16" width="8" height="188"/><rect class="wall2" x="274" y="16" width="8" height="178"/><rect class="wall2" x="274" y="186" width="270" height="8"/>`
  +`<rect class="bg" x="207" y="195" width="40" height="10"/><rect class="bg" x="286" y="185" width="36" height="10"/><rect class="bg" x="249" y="28" width="10" height="34"/><rect class="bg" x="543" y="104" width="10" height="40"/><rect class="bg" x="238" y="538" width="96" height="12"/>`
  +P('M207 200 A40 40 0 0 0 247 240','gray','thin')+L(247,200,247,240,'gray','thin')+P('M322 190 A36 36 0 0 1 286 226','gray','thin')+L(286,190,286,226,'gray','thin')
  +P('M254 62 A34 34 0 0 1 220 28','gray','thin')+L(254,62,220,62,'gray','thin')+P('M548 144 A40 40 0 0 1 508 104','gray','thin')+L(548,144,508,144,'gray','thin')
  +P('M238 544 L262 503 M334 544 L310 503 M262 503 A48 48 0 0 1 286 544 M310 503 A48 48 0 0 0 286 544','gray','thin')+`<rect class="fl" x="230" y="536" width="8" height="10"/><rect class="fl" x="334" y="536" width="8" height="10"/>`
  +WIN(60,8,60,8)+WIN(400,8,60,8)+WIN(8,260,8,40)+WIN(8,400,8,40)+WIN(544,300,8,40)+WIN(544,430,8,40)
  +T(130,150,'مخزن',{sz:12})+T(430,140,'مكتب',{sz:12})+T(330,400,'ورشة',{sz:13})+T(470,566,'مقياس الرسم 1 : 50',{sz:11});
 /* اللوحة والتغذية */
 s+=ODOT(28,222,'',4)+T(44,246,'380/220V',{sz:9})+L(32,222,50,222)+RECT(50,212,30,20,'','')+L(50,218,80,218,'','thin')+T(65,230,'kWh',{sz:8})+L(80,222,95,222)+`<rect class="fl" x="95" y="207" width="80" height="8"/>`
  +[105,125,145].map((x,i)=>L(x,215,x,220)+SW(x,220,248,'th')+T(x+6,262,String(i+1),{sz:10,a:'l'})).join('')+L(165,207,165,186)+DOT(165,186)+T(172,200,'4',{sz:10,a:'l'})+DOT(105,256)+DOT(125,256);
 /* الرموز */
 const X=(x,y)=>LAMPX(x,y,'',false,8),SWS=(x,y,a)=>SW1(x,y,'',false,a);
 s+=X(75,90)+X(185,90)+SWS(215,178,-60)+SWS(232,76,-120)+SOCKW(120,16,0)+DOT(240,52);
 s+=X(360,70)+X(460,70)+SOCKW(385,16,0,1)+SOCKW(480,16,0)+SOCKW(282,95,-90,1)+SWS(526,92,-120)+SWS(330,174,-60)+DOT(330,160);
 s+=X(270,320)+X(270,445)+FLV(40,300,40)+FLV(40,430,40)+FLV(515,300,40)+FLV(515,430,40)
  +[270,350,470].map(y=>SOCKW(16,y,-90,1)).join('')+SOCKW(16,515,-90)+[270,350,470].map(y=>SOCKW(544,y,90,1)).join('')+SOCKW(544,515,90)
  +SWS(60,512,-60)+SWS(286,500,-60)+SWS(500,512,-120)+SWS(336,226,-60)+DOT(270,255)+DOT(345,250)+`<circle class="ln" cx="450" cy="240" r="13" style="fill:var(--surface)"/>`+T(450,240,'M',{sz:10})+T(450,250,'3~',{sz:8});
 /* الحل المقترح */
 if(S.sol){
  s+=g(2,P('M105 256 V270 H40 V280')+L(40,320,40,410)+P('M105 270 H270 V255')+L(270,255,270,311)+L(270,329,270,436)+P('M270 255 H515 V280')+L(515,320,515,410)
   +P('M40 450 V506 H56')+P('M270 454 V494 H282')+P('M515 450 V506 H504')+TK(40,365,3)+TK(185,270,3)+TK(270,290,3)+TK(270,385,3)+TK(420,255,3)+TK(515,365,3)+TK(40,480,2)+TK(270,475,2)+TK(515,480,2));
  s+=g(3,P('M125 256 V262 H28 V528 H532 V262 H520')+[270,350,470,515].map(y=>L(28,y,24,y)+L(532,y,536,y)).join('')+TK(28,410,3)+TK(140,528,3)+TK(420,528,3)+TK(532,410,3,'','l'));
  s+=g(4,P('M145 248 V290 H436 V249')+TK(300,290,4)+TK(436,268,4,'','l'));
  s+=g(5,P('M165 186 V150 H240')+DOT(240,150)+P('M240 150 V90 H194')+L(176,90,84,90)+L(120,90,120,32)+DOT(120,90)+P('M240 150 V60')+L(240,150,219,174)+L(240,60,236,70)
   +P('M240 150 H330 V160')+P('M330 160 V70 H351')+L(369,70,451,70)+L(385,70,385,32)+DOT(385,70)+P('M469 70 H480 V32')+P('M480 70 H520 V87')+P('M330 120 H298')+DOT(330,120)
   +TK(200,150,3)+TK(240,120,3)+TK(150,90,3)+TK(300,150,3)+TK(330,100,3)+TK(420,70,3)+TK(228,163,2)+TK(505,70,2));}
 return SVG(560,574,s)}

/* =====================================================================
   التمرين (3): الشكل (4-10) ص 99 — لوحة توزيع لورشة إنتاجية + حلان مقترحان (تنفيذية)
   ===================================================================== */
function fig410(){let s='';
 s+=L(40,30,300,30,'','bus')+TKH(62,30,4)+DOT(140,30)+FU(140,30,92,'','','',true)+T(156,56,'3',{sz:11,a:'l'})+L(140,92,140,100)+SW(140,100,150,'ds')+L(140,150,140,200)
  +L(140,165,230,165)+L(230,165,230,123)+AMB(230,110,'V',24)+L(60,200,300,200,'','bus')+DOT(140,200)+DOT(250,200)
  +[140,250].map(x=>L(x,200,x,212)+SW(x,212,262,'mcb')+L(x,262,x,296)+TK(x,276,3)).join('');
 return SVG(340,305,s)}
/* رموز التنفيذية */
const PBNO=(x,y0,y1,k)=>{const ya=y0+(y1-y0)*0.32,yb=y1-(y1-y0)*0.32,ym=(ya+yb)/2;return L(x,y0,x,ya,k)+L(x,yb,x,y1,k)+P(`M${x} ${yb} L${x-9} ${ya+2}`,k)+P(`M${x-5} ${ym} H${x-16} M${x-16} ${ym-5} V${ym+5}`,k,'thin dash')};
const PBNC=(x,y0,y1,k)=>{const ya=y0+(y1-y0)*0.32,yb=y1-(y1-y0)*0.32,ym=(ya+yb)/2;return L(x,y0,x,ya,k)+L(x,yb,x,y1,k)+L(x,ya,x+8,ya,k)+P(`M${x} ${yb} L${x+10} ${ya-3}`,k)+P(`M${x+4} ${ym} H${x-12} M${x-12} ${ym-5} V${ym+5}`,k,'thin dash')};
const NOC=(x,y0,y1,k)=>{const ya=y0+(y1-y0)*0.32,yb=y1-(y1-y0)*0.32;return L(x,y0,x,ya,k)+L(x,yb,x,y1,k)+P(`M${x} ${yb} L${x-9} ${ya+2}`,k)};
const NCTH=(x,y0,y1,k)=>{const ya=y0+(y1-y0)*0.32,yb=y1-(y1-y0)*0.32,ym=(ya+yb)/2;return L(x,y0,x,ya,k)+L(x,yb,x,y1,k)+L(x,ya,x+8,ya,k)+P(`M${x} ${yb} L${x+10} ${ya-3}`,k)+P(`M${x-4} ${ym} h-5 v-5 h-5 v5 h-4`,k,'thin')};
const COIL=(x,y,lbl)=>RECT(x-10,y-7,20,14,'','')+T(x-14,y+4,lbl,{sz:10,a:'r'});
function exec410(S){S=S||{};const g=mkG(S),txt=!!S.text;const W=txt?640:520;let s='';
 const PH=[['L1',20],['L2',32],['L3',44],['N',56],['PE',68]],XS=[150,170,190];
 s+=g(1,PH.map(([n,y])=>L(30,y,W-20,y,'',n==='PE'?'dd':'')+T(26,y+4,n,{sz:10,a:'r'})).join('')+XS.map((x,i)=>DOT(x,PH[i][1])+L(x,PH[i][1],x,96)+FU(x,96,130)).join('')+T(122,117,'F1',{sz:10,a:'r'}));
 s+=g(2,XS.map(x=>L(x,130,x,146)+(txt?NOC(x,146,186):SW(x,146,186,'ds'))+L(x,186,x,226)).join('')+P('M136 166 H196','','thin dash')+T(122,170,txt?'K1':'Q1',{sz:10,a:'r'})
  +DOT(150,206)+L(150,206,258,206)+DOT(170,218)+L(170,218,270,218)+`<circle class="ln" cx="270" cy="206" r="13" style="fill:var(--surface)"/>`+T(270,210,'V',{sz:12})+L(258,206,257,206));
 const G=[[90,105,120,'1'],[320,335,350,'2']];
 s+=g(3,L(80,240,370,240)+L(80,252,370,252)+L(80,264,370,264)+DOT(150,240)+DOT(170,252)+DOT(190,264)+L(150,226,150,240)+L(170,226,170,252)+L(190,226,190,264)
  +G.map(([a,b,c,n])=>[a,b,c].map((x,i)=>DOT(x,[240,252,264][i])+L(x,[240,252,264][i],x,296)+(txt?NOC(x,296,336):SW(x,296,346,'th'))+(txt?L(x,336,x,350)+RECT(x-5,350,10,22,'','thin')+L(x,372,x,430):L(x,346,x,430))).join('')
   +P(`M${a-12} ${txt?316:321} H${c+4}`,'','thin dash')+T(a-16,txt?320:325,txt?'K'+(+n+1):'Q'+(+n+1),{sz:10,a:'r'})+(txt?T(a-16,365,'F'+(+n+1),{sz:10,a:'r'})+P(`M${a-10} 361 H${c+6}`,'','thin dash'):'')
   +MOT(b,452,'',false,18)+T(b,490,'مجموعة محركات '+n,{sz:10})+P(`M${b+18} 452 H${W-60}`,'','dd')).join('')+L(W-60,68,W-60,452,'','dd')+DOT(W-60,68));
 if(txt){
  const R=[[440,'K1',null],[510,'K2','F2'],[580,'K3','F3']];
  s+=g(4,DOT(420,20)+L(420,20,420,96)+FU(420,96,124)+T(408,113,'F0',{sz:10,a:'r'})+L(420,124,420,130)+L(420,130,600,130)+DOT(612,56)+L(612,56,612,470)+L(440,470,612,470)
   +L(440,130,440,150)+PBNC(440,150,185,'')+T(456,170,'S0',{sz:10,a:'l'})+L(440,185,440,200)+DOT(440,200)+PBNO(440,200,240,'')+T(426,224,'S1',{sz:10,a:'r'})+L(440,200,466,200)+NOC(466,200,240,'')+T(478,224,'K1',{sz:10,a:'l'})+L(466,240,440,240)+DOT(440,240)+L(440,240,440,423)+COIL(440,430,'K1')+L(440,437,440,470));
  s+=g(5,R.slice(1).map(([x,kk,ff])=>L(x,130,x,146)+NOC(x,146,180,'')+T(x+12,166,'K1',{sz:9,a:'l'})+NCTH(x,180,216,'')+T(x+14,202,ff,{sz:9,a:'l'})+PBNC(x,216,250,'')+T(x+14,236,kk==='K2'?'S2':'S4',{sz:9,a:'l'})+DOT(x,262)+L(x,250,x,262)+PBNO(x,262,300,'')+T(x-14,285,kk==='K2'?'S3':'S5',{sz:9,a:'r'})+L(x,262,x+24,262)+NOC(x+24,262,300,'')+T(x+28,312,kk,{sz:9,a:'l'})+L(x+24,300,x,300)+DOT(x,300)+L(x,300,x,423)+COIL(x,430,kk)+L(x,437,x,470)).join(''));}
 return SVG(W,500,s)}

B.lesson({
 id:'u4-l5',unit:4,order:5,pages:'96–99',
 title:'تمارين الوحدة الرابعة',
 summary:'التمارين الثلاثة والواجب كما في الكتاب: إكمال شبكة شعاعية (4-8)، وتمديد الموصلات في مسقط ورشة (4-9)، ورسم الدائرة التنفيذية للوحة ورشة إنتاجية (4-10)، مع حلول مقترحة مرسومة خطوة بخطوة.',
 stations:[
  {intro:true},

  {st:1,short:'التمرين (1)',title:'٤-٤ تمارين — التمرين (1)',ref:'ص 96–97',
   q:'الشكل فيه القضبان والتسميات… والمفاتيح فارغة. كيف تعرف أي رمز ترسم في كل مكان؟',
   get art(){return U4ST.art(
     [[110,'T1','Q1'],[250,'T2','Q2']].map(([x,t,q])=>U4ST.tip(`المحول ⟦${t}⟧: يغذي الموزع الرئيسي عبر ⟦${q}⟧.`,[x-22,14,44,60],L(x,14,x,28)+XF(x,44,'',11))+T(x-30,44,t,{sz:12,w:700})+L(x,62,x,80)
      +U4ST.tip(`⟦${q}⟧ «مفتاح قدرة أوتوماتيكي للمحول»: مكانه فارغ في الشكل، وترسمه أنت بذراع وعلامة الفصل الأوتوماتيكي.`,[x-24,80,48,60],`<rect x="${x-20}" y="84" width="40" height="52" rx="4" style="fill:#FFF4D6;stroke:#E8735A;stroke-width:2;stroke-dasharray:5 4"/>`+T(x,116,'?',{sz:20,w:700}))
      +L(x,136,x,160)+T(x+30,112,q,{sz:12,w:700})).join('')
    +U4ST.tip('الموزع الرئيسي: منه المخارج Q3 وQ4 وQ5.',[60,152,240,16],L(70,160,290,160,'','bus')+DOT(110,160)+DOT(250,160)+DOT(180,160))
    +L(180,160,180,180)+U4ST.tip('⟦Q4⟧ «مفتاح قدرة أوتوماتيكي للموزع الفرعي الثاني» — ثم ⟦Q6⟧ «مفتاح قدرة» (ذراع فقط) في مدخله.',[156,180,48,60],`<rect x="160" y="184" width="40" height="52" rx="4" style="fill:#FFF4D6;stroke:#E8735A;stroke-width:2;stroke-dasharray:5 4"/>`+T(180,216,'?',{sz:20,w:700}))
    +L(180,236,180,256)+AHF(180,266,'d')+T(220,214,'Q4',{sz:12,w:700})
    +T(180,298,'أكمل المفاتيح Q1–Q10',{sz:13,w:700}),
    'جزء من هيكل الشكل 4-8: محولان ومكان مفاتيح فارغ يكمله المتدرب')},
   cap:'جزء من هيكل الشكل <span class="ltr">(4-8)</span>: المربعات الصفراء أماكن تكملها أنت.<br><b>مرّر المؤشر على أي جزء (أو المسه في الجوال) لتعرف ما يُرسم فيه.</b>',
   side:[
    {predict:{q:'Q6 في نص التمرين «مفتاح قدرة للموزع الفرعي الثاني» بلا كلمة «أوتوماتيكي». كيف ترسمه؟',opts:[
     ['ذراع مائلة فقط',true,'مثل (جـ) و(هـ) في الشكل (4-1): مفتاح فصل بلا علامة الفصل الأوتوماتيكي.'],
     ['ذراع مع علامة الفصل الأوتوماتيكي',false,'هذه لـ «مفتاح قدرة أوتوماتيكي» مثل Q4.'],
     ['مصهر',false,'النص يقول «مفتاح قدرة» لا مصهر.']]}}
   ],
   body:[
    {book:String.raw`<p>في شكل (4-8) ارسم لوحة التوصيلات اللازمة لبناء شبكة شعاعية تحتوي على الآتي:</p>
     <ul style="list-style:none;padding-inline-start:4px">${Object.entries(QTXT).map(([q,t])=>`<li><span class="ltr">${q}</span> ${t}</li>`).join('')}</ul>
     <p><b>مسار التيار في التوزيع للمستهلكات:</b></p><ol>${CONS.map(c=>`<li>${c}</li>`).join('')}</ol>
     <figure style="margin:12px 0 0">${box(fig48(),550)}<figcaption style="text-align:center;font-size:13px">الشكل <span class="ltr">(4-8)</span> توزيع الطاقة الكهربائية <span class="ref">ص 97</span></figcaption></figure>`,ref:'ص 96–97'},
    {tip:String.raw`<p>الشكل هيكل ناقص: القضبان والنقاط والتسميات موجودة، وأماكن المفاتيح <span class="ltr">Q1–Q10</span> فارغة. المطلوب رسم كل مفتاح في مكانه (المفتاح «الأوتوماتيكي» برمز الفصل الأوتوماتيكي، و«مفتاح القدرة» وحده بذراع فقط)، ثم رمز كل مستهلك في نهاية خطه (الأرقام 1–8 تقابل القائمة). الحل المقترح (ليس من الكتاب) في تبويب «الأمثلة المحلولة»، وتجربته في «المختبر».</p>`,title:'ما المطلوب؟'},
    {title:'مختبر مصغّر: أي رمز لكل مفتاح؟',widget:(el,B)=>DCML.sort(el,B,{intro:'اقرأ وصف كل مفتاح في نص التمرين، واختر الرمز الذي ترسمه.',cats:['ذراع + علامة الفصل الأوتوماتيكي','ذراع فقط (فصل)'],
     items:['Q1','Q3','Q6','Q7','Q9','Q10'].map(q=>[`<span class="ltr">${q}</span> ${QTXT[q]}`,/أوتوماتيكي/.test(QTXT[q])?0:1,/أوتوماتيكي/.test(QTXT[q])?'في النص «أوتوماتيكي»: يحمي ويفصل.':'في النص «مفتاح قدرة» فقط: للفصل.'])})},
    {title:'مختبر مصغّر: رمز كل مستهلك',widget:(el,B)=>DCML.cases(el,B,{intro:'اختر الرمز المناسب للمستهلك من رموز الوحدة الثانية (ص 96).',cases:[
     {q:'المستهلك (3) مصابيح توهج:',opts:[['دائرة بداخلها ×',true,'رمز المصباح.'],['دائرة فيها M و3~',false,'هذا المحرك ثلاثي الأوجه (5).'],['مستطيل مقسوم بخطوط',false,'هذا رمز مقاومات التسخين (8).']]},
     {q:'المستهلك (4) محول جهد صغير:',opts:[['قوس نصف دائري',false,'هذا المقبس.'],['دائرتان متداخلتان',true,'رمز المحول في الدائرة الخطية (ص 57).'],['كبسولة فيها ×',false,'هذا مصباح التفريغ (الفلورسنت).']]}]})},
    {watch:String.raw`<p>التمرين (1) يقول «في شكل (٣-٨)» والصحيح الشكل (4-8) ص 97؛ «Q10 مفتاح قدر» صحّحناها «مفتاح قدرة»؛ في الشكل (4-8) «المزع الفرعي الأول» صحّحناها «الموزع الفرعي الأول». وفي الشكل تسميات «الأول» و«الثالث» مطبوعة قريبة من القضيب الثاني فتربك القارئ: القضيب الثاني هو «الموزع الفرعي الثاني» (يتغذى عبر Q4 ثم Q6)، والسهمان تحت Q3 و Q5 يذهبان إلى الموزعين الأول والثالث (غير مرسومين).</p>`,fix:1}
   ]},

  {st:2,short:'التمرين (2)',title:'التمرين (2)',ref:'ص 98',
   q:'مخطط مبنى فيه ورشة ومكتب ومخزن… من أين تبدأ بمد الموصلات؟',
   get art(){return U4ST.art(
     `<rect x="44" y="40" width="272" height="240" style="fill:#FBF6EE;stroke:#2C4A40;stroke-width:4"/><path d="M44 120 H170 M170 40 V120 M190 40 V116 H316" style="fill:none;stroke:#2C4A40;stroke-width:3"/>`
    +U4ST.tip('المخزن: الدائرة الرابعة (إضاءة ومقابس).',[48,44,118,72],T(106,84,'مخزن',{sz:13,w:700}))
    +U4ST.tip('المكتب: الدائرة الرابعة أيضاً (إضاءة ومقابس).',[194,44,118,68],T(252,82,'مكتب',{sz:13,w:700}))
    +U4ST.tip('الورشة: الدائرة الأولى (الإضاءة)، والثانية (المقابس)، والثالثة (المحرك ثلاثي الأوجه).',[48,124,264,152],T(200,214,'ورشة',{sz:14,w:700}))
    +U4ST.tip('لوحة التوزيع على الجدار: تغذية ⟦380/220V⟧ ← عداد ⟦kWh⟧ ← قضيب ← قواطع الدوائر.',[48,124,64,40],`<rect x="52" y="128" width="54" height="14" style="fill:#2C4A40"/>`+[60,74,88,102].map((x,i)=>L(x,142,x,160,'','thin')+T(x,172,String(i+1),{sz:10})).join(''))
    +T(180,302,'مقياس الرسم 1 : 50',{sz:12,w:600}),
    'مخطط مبسّط لمبنى ورشة فيه مخزن ومكتب ولوحة توزيع بأربع دوائر')},
   cap:'مخطط مبسّط من الشكل <span class="ltr">(4-9)</span>.<br><b>مرّر المؤشر على كل غرفة واللوحة (أو المسها في الجوال) لتعرف الدوائر التي تخصها.</b>',
   side:[
    {predict:{q:'كم دائرة يطلب التمرين (2) تمديدها؟',opts:[
     ['ثلاث دوائر',false,'عُدّ مرة أخرى: إضاءة الورشة، مقابسها، المحرك، ثم المكتب والمخزن.'],
     ['أربع دوائر',true,'الأولى إضاءة الورشة، الثانية مقابسها، الثالثة المحرك، الرابعة إضاءة ومقابس المكتب والمخزن (ص 98).'],
     ['دائرة لكل غرفة فقط',false,'الورشة وحدها فيها ثلاث دوائر.']]}}
   ],
   body:[
    {book:String.raw`<p>في شكل (4-9) ارسم مسار الموصلات واكتب جميع البيانات عن طريق التمديد في مخطط التركيبات الموضح:</p><ul><li>الدائرة الأولى: إضاءة الورشة.</li><li>الدائرة الثانية: مقابس في الورشة.</li><li>الدائرة الثالثة: محرك ثلاثي الأوجه.</li><li>الدائرة الرابعة: إضاءة ومقابس في المكتب وفي المخزن.</li></ul>
     <figure style="margin:12px 0 0">${box(fig49(),560)}<figcaption style="text-align:center;font-size:13px">الشكل <span class="ltr">(4-9)</span> قطاع أفقي في مبنى ورشة <span class="ref">ص 98</span></figcaption></figure>`,ref:'ص 98'},
    {tip:String.raw`<p>مواضع الرموز في إعادة الرسم تقريبية (الشكل في الكتاب ممسوح بدقة متوسطة). اللوحة على الجدار بين المخزن والورشة: تغذية <span class="ltr">380/220V</span> ← عداد <span class="ltr">kWh</span> ← قضيب توزيع ← المخارج 1، 2، 3 عبر قواطع، والمخرج 4 يصعد نحو المخزن. ابدأ من القاطع وامشِ بالمسار على الجدران إلى الرموز، واكتب على كل مسار عدد موصلاته بالشرطات كما في الشكلين (4-2) و(4-6).</p>`,title:'من أين تبدأ؟'},
    {title:'مختبر مصغّر: إلى أي دائرة؟',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل حمل في المخطط اختر رقم الدائرة التي يتغذى منها بحسب نص التمرين.',cats:['1','2','3','4'],items:[
     ['مصابيح الورشة',0,'الدائرة الأولى: إضاءة الورشة.'],
     ['مقبس على جدار الورشة',1,'الدائرة الثانية: مقابس في الورشة.'],
     ['المحرك ثلاثي الأوجه',2,'الدائرة الثالثة.'],
     ['مقبس في المكتب',3,'الدائرة الرابعة: إضاءة ومقابس في المكتب وفي المخزن.'],
     ['مصباح المخزن',3,'الدائرة الرابعة أيضاً.']]})}
   ]},

  {st:3,short:'التمرين (3)',title:'التمرين (3)',ref:'ص 99',
   q:'الدائرة الخطية خط واحد… فكم سلكاً ستمد في الدائرة التنفيذية؟',
   get art(){const x=12,y=10,k=1;return U4ST.art(U4ST.emb(fig410(),x,y,k)
    +U4ST.tipIn('قضيب التغذية: الشرطة و«⟦4⟧» = أربعة موصلات.',[40,22,260,16],x,y,k)
    +U4ST.tipIn('مصهر ثلاثي («⟦3⟧») ثم مفتاح.',[126,32,40,120],x,y,k)
    +U4ST.tipIn('جهاز قياس الجهد ⟦V⟧ لقياس جهد الخط.',[214,94,32,32],x,y,k)
    +U4ST.tipIn('قاطعان آليان، كل منهما يغذي مجموعة محركات (ثلاثة موصلات).',[114,206,160,92],x,y,k),
    'الشكل 4-10: الدائرة الخطية للوحة توزيع لورشة إنتاجية')},
   cap:'الشكل <span class="ltr">(4-10)</span> <span class="ltr">ص 99</span>.<br><b>مرّر المؤشر على أجزاء الدائرة (أو المسها في الجوال) لتعرف ما هي.</b>',
   side:[
    {predict:{q:'ماذا يقيس الجهاز V في الشكل (4-10)؟',opts:[
     ['تيار المحركات',false,'جهاز التيار رمزه A.'],
     ['جهد الخط',true,'«واللوحة مزودة بجهاز قياس الجهد لقياس جهد الخط» (ص 99).'],
     ['قدرة الورشة',false,'جهاز القدرة رمزه W.']]}}
   ],
   body:[
    {book:String.raw`<p>ارسم الدائرة التنفيذية للدائرة الخطية الموضحة في الشكل (4-10) للوحة توزيع لورشة إنتاجية يتم التحكم فيها بواسطة مفتاح أوتوماتيكي بأزرار تشغيل (فتح — غلق) تغذي قاطعين مغناطيسيين يغذي كل منهما مجموعة محركات ويتم التحكم بمجموعة أزرار (فتح — غلق)، واللوحة مزودة بجهاز قياس الجهد لقياس جهد الخط.</p>
     <figure style="margin:12px 0 0">${box(fig410(),340)}<figcaption style="text-align:center;font-size:13px">الشكل <span class="ltr">(4-10)</span> لوحة توزيع لورشة إنتاجية <span class="ref">ص 99</span></figcaption></figure>`,ref:'ص 99'},
    {watch:String.raw`<p>نص التمرين (3) يذكر «مفتاح أوتوماتيكي بأزرار تشغيل (فتح — غلق)» و«قاطعين مغناطيسيين» يُتحكم فيهما بأزرار، بينما الشكل (4-10) يرسم مفتاحاً عادياً وقاطعين آليين بلا أزرار ولا ملفات. لذلك نعرض حلين مقترحين: حسب الشكل، وحسب نص التمرين. («مغناطيسين» في الكتاب صحّحناها «مغناطيسيين».)</p>`,fix:1},
    {title:'مختبر مصغّر: حلان مقترحان (ليسا من الكتاب)',widget:(el,B)=>DCML.lab(el,B,{intro:'بدّل بين الحلين وقارن. الخطوات كاملة في تبويب «الأمثلة المحلولة».',
     ins:[{k:'v',l:'الحل',seg:[['f','حسب الشكل'],['t','حسب نص التمرين']],v:'f'}],
     calc:s=>({pic:s.v==='f'?exec410({}):exec410({text:1}),
      msg:s.v==='f'?'<span class="ml-tag">حل مقترح</span> كما رُسمت الخطية: مصاهر <span class="ltr">F1</span> ← مفتاح ثلاثي <span class="ltr">Q1</span> ← فولتميتر بين <span class="ltr">L1</span> و<span class="ltr">L2</span> ← قضبان التوزيع ← قاطعان آليان <span class="ltr">Q2</span> و<span class="ltr">Q3</span>. أضفنا موصل الحماية <span class="ltr">PE</span> للمحركات.':'<span class="ml-tag">حل مقترح</span> حسب النص: كونتاكتور رئيس <span class="ltr">K1</span> بزري إيقاف <span class="ltr">S0</span> وتشغيل <span class="ltr">S1</span>، يغذي كونتاكتورين <span class="ltr">K2</span> و<span class="ltr">K3</span> لكل منهما زرّا إيقاف وتشغيل ومرحّل حراري. هذا تفسير منا لـ «الأزرار» و«القاطعين المغناطيسيين».'})})}
   ]},

  {st:4,short:'الواجب',title:'واجب',ref:'ص 99',
   q:'ورشة الكهرباء في كليتك أمامك كل يوم… هل تستطيع أن ترسم لوحتها؟',
   get art(){return U4ST.art(
     `<rect x="70" y="40" width="220" height="220" rx="8" style="fill:#FBF6EE;stroke:#2C4A40;stroke-width:2.5"/>`+L(180,40,180,260)
    +U4ST.tip('لوحة القوى: للمحركات. ارسمها بخط واحد أولاً (الخطية) ثم بكل سلك (التنفيذية).',[184,44,102,212],T(235,66,'القوى',{sz:13,w:700})+[100,150,200].map(y=>SW(235,y-30,y+10,'cb')).join(''))
    +U4ST.tip('لوحة الإضاءة: للمصابيح والمقابس — منفصلة تماماً عن القوى كما يطلب الكتاب ص 86.',[74,44,102,212],T(125,66,'الإضاءة',{sz:13,w:700})+[100,150,200].map(y=>SW(125,y-30,y+10,'mcb')).join(''))
    +T(180,292,'خطية ثم تنفيذية',{sz:13,w:700}),
    'لوحتان للقوى وللإضاءة في ورشة الكلية')},
   cap:'فكرة الواجب في رسم مبسّط (ليس من الكتاب).<br><b>مرّر المؤشر على كل نصف (أو المسه في الجوال) لتعرف ما ترسمه فيه.</b>',
   side:[
    {predict:{q:'الواجب يطلب رسمين للوحة ورشة الكهرباء. ما هما؟',opts:[
     ['الواجهة الأمامية والمسقط الجانبي',false,'الواجب يطلب نوعي الدائرة.'],
     ['الدائرة الخطية والدائرة التنفيذية',true,'«ارسم الدائرة الخطية والتنفيذية للوحة توزيع ورشة الكهرباء داخل كليتك» (ص 99).'],
     ['مخطط المبنى فقط',false,'المطلوب لوحة التوزيع.']]}}
   ],
   body:[
    {book:String.raw`<p>ارسم الدائرة الخطية والتنفيذية للوحة توزيع ورشة الكهرباء داخل كليتك.</p>`,ref:'ص 99'},
    {tip:String.raw`<p>للواجب: (1) اعرف كل الأحمال في الورشة (المحركات وقدرتها، المصابيح، المقابس) كما يطلب الكتاب ص 83 و 86؛ (2) افصل لوحة القوى عن لوحة الإضاءة؛ (3) ارسم الخطية أولاً بخط واحد وشُرَط عدد الموصلات، كما في (4-4-ب) و(4-7-ب)؛ (4) ثم التنفيذية بكل سلك على حدة: <span class="ltr">L1، L2، L3، N، PE</span>.</p>`,title:'خطة مقترحة'},
    {title:'مختبر مصغّر: رتّب خطوات الواجب',widget:(el,B)=>DCML.order(el,B,{intro:'رتّب خطوات الخطة المقترحة (ليست من الكتاب) كما تنفذها.',steps:[
     ['اعرف الأحمال: المحركات وقدرتها، والمصابيح، والمقابس','لا ترسم شيئاً قبل أن تعرف ما ستغذيه.'],
     ['افصل أحمال القوى عن أحمال الإضاءة في لوحتين','الفصل يحدد كم لوحة سترسم.'],
     ['ارسم الدائرة الخطية بخط واحد وشرطات عدد الموصلات','الخطية تأتي قبل التنفيذية لأنها تبين «من يغذي من».'],
     ['ارسم الدائرة التنفيذية بكل سلك على حدة','التنفيذية آخر خطوة، تُبنى على الخطية.']],done:'هذا ترتيب الرسوم في الوحدة نفسها: الخطية ثم التنفيذية.'})}
   ]},

  {recap:[
   'التمرين (1): «مفتاح قدرة أوتوماتيكي» = ذراع وعلامة الفصل الأوتوماتيكي، و«مفتاح قدرة» وحده = ذراع فقط (ص 96).',
   'التمرين (2): أربع دوائر — إضاءة الورشة، مقابسها، المحرك، ثم إضاءة ومقابس المكتب والمخزن (ص 98).',
   'التمرين (3): الشكل (4-10) والنص لا يتطابقان، فلكل قراءة حل مقترح؛ والجهاز V يقيس جهد الخط (ص 99).',
   'الواجب: لوحة ورشة كليتك بالدائرتين الخطية والتنفيذية (ص 99).']}
],
 theory:[
  {h:'٤-٤ تمارين — التمرين (1)',ref:'ص 96',html:`<p>في شكل (4-8) ارسم لوحة التوصيلات اللازمة لبناء شبكة شعاعية تحتوي على الآتي:</p>
   <ul style="list-style:none;padding-inline-start:4px">${Object.entries(QTXT).map(([q,t])=>`<li><span class="ltr">${q}</span> ${t}</li>`).join('')}</ul>
   <p><b>مسار التيار في التوزيع للمستهلكات:</b></p><ol>${CONS.map(c=>`<li>${c}</li>`).join('')}</ol>`},
  {fig:'(4-8)',ref:'ص 97',caption:'توزيع الطاقة الكهربائية',draw:()=>box(fig48(),550)},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> الشكل هيكل ناقص: القضبان والنقاط والتسميات موجودة، وأماكن المفاتيح Q1–Q10 فارغة. المطلوب رسم كل مفتاح في مكانه (المفتاح «الأوتوماتيكي» برمز الفصل الأوتوماتيكي، و«مفتاح القدرة» وحده بذراع فقط)، ثم رمز كل مستهلك في نهاية خطه (الأرقام 1–8 تقابل القائمة). الحل المقترح في تبويب «الأمثلة المحلولة»، وتجربته في «المختبر».'},
  {h:'التمرين (2)',ref:'ص 98',html:`<p>في شكل (4-9) ارسم مسار الموصلات واكتب جميع البيانات عن طريق التمديد في مخطط التركيبات الموضح:</p><ul><li>الدائرة الأولى: إضاءة الورشة.</li><li>الدائرة الثانية: مقابس في الورشة.</li><li>الدائرة الثالثة: محرك ثلاثي الأوجه.</li><li>الدائرة الرابعة: إضاءة ومقابس في المكتب وفي المخزن.</li></ul>`},
  {fig:'(4-9)',ref:'ص 98',caption:'قطاع أفقي في مبنى ورشة',draw:()=>box(fig49(),560)},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> مواضع الرموز في إعادة الرسم تقريبية (الشكل في الكتاب ممسوح بدقة متوسطة). اللوحة على الجدار بين المخزن والورشة: تغذية <span class="ltr">380/220V</span> ← عداد <span class="ltr">kWh</span> ← قضيب توزيع ← المخارج 1، 2، 3 عبر قواطع، والمخرج 4 يصعد نحو المخزن.'},
  {h:'التمرين (3)',ref:'ص 99',html:`<p>ارسم الدائرة التنفيذية للدائرة الخطية الموضحة في الشكل (4-10) للوحة توزيع لورشة إنتاجية يتم التحكم فيها بواسطة مفتاح أوتوماتيكي بأزرار تشغيل (فتح — غلق) تغذي قاطعين مغناطيسيين يغذي كل منهما مجموعة محركات ويتم التحكم بمجموعة أزرار (فتح — غلق)، واللوحة مزودة بجهاز قياس الجهد لقياس جهد الخط.</p>`},
  {fig:'(4-10)',ref:'ص 99',caption:'لوحة توزيع لورشة إنتاجية',draw:()=>box(fig410(),340)},
  {err:'<span class="fixnote">نص التمرين (3) يذكر «مفتاح أوتوماتيكي بأزرار تشغيل (فتح — غلق)» و«قاطعين مغناطيسيين» يُتحكم فيهما بأزرار، بينما الشكل (4-10) يرسم مفتاحاً عادياً وقاطعين آليين بلا أزرار ولا ملفات. لذلك في «الأمثلة المحلولة» حلان مقترحان: حسب الشكل، وحسب نص التمرين.</span>'},
  {h:'واجب',ref:'ص 99',html:'<p>ارسم الدائرة الخطية والتنفيذية للوحة توزيع ورشة الكهرباء داخل كليتك.</p>'},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> للواجب: (1) اعرف كل الأحمال في الورشة (المحركات وقدرتها، المصابيح، المقابس) كما يطلب الكتاب ص 83 و 86؛ (2) افصل لوحة القوى عن لوحة الإضاءة؛ (3) ارسم الخطية أولاً بخط واحد وشُرَط عدد الموصلات، كما في (4-4-ب) و(4-7-ب)؛ (4) ثم التنفيذية بكل سلك على حدة: L1، L2، L3، N، PE.'},
  {err:'<span class="fixnote">تصحيحات صغيرة في هذا الدرس: التمرين (1) يقول «في شكل (٣-٨)» والصحيح الشكل (4-8) ص 97؛ «Q10 مفتاح قدر» صحّحناها «مفتاح قدرة»؛ في الشكل (4-8) «المزع الفرعي الأول» صحّحناها «الموزع الفرعي الأول»؛ و«مغناطيسين» في التمرين (3) صحّحناها «مغناطيسيين». وفي الشكل (4-8) تسميات «الأول» و«الثالث» مطبوعة قريبة من القضيب الثاني فتربك القارئ: القضيب الثاني هو «الموزع الفرعي الثاني» (يتغذى عبر Q4 ثم Q6)، والسهمان تحت Q3 و Q5 يذهبان إلى الموزعين الأول والثالث (غير مرسومين).</span>'}
 ],
 lab:(el)=>lab48(el),
 examples:[
  {title:'التمرين (1) — حل مقترح (ليس من الكتاب): إكمال الشكل (4-8)',ref:'ص 96–97',
   q:'<p>أكمل الشبكة الشعاعية: ارسم المفاتيح Q1–Q10 في أماكنها، ثم رموز المستهلكات 1–8. الجزء الجديد في كل خطوة بلون مميَّز.</p>',
   solve:()=>[
    ['نبدأ بالهيكل كما في الكتاب: المحولان T1 و T2، والموزع الرئيسي، والموزع الفرعي الثاني، وموزعا الأحمال، وقواطع المستهلكات.',0],
    ['<b>Q1 و Q2</b>: مفتاحا قدرة أوتوماتيكيان تحت المحولين (ذراع وعلامة الفصل الأوتوماتيكي)، يصلان كل محول بالموزع الرئيسي.',1],
    ['<b>Q3 و Q4 و Q5</b>: مفاتيح قدرة أوتوماتيكية على مخارج الموزع الرئيسي: Q3 إلى الموزع الفرعي الأول، و Q5 إلى الثالث، و Q4 ينزل إلى الموزع الفرعي الثاني.',2],
    ['<b>Q6</b> مفتاح قدرة (ذراع فقط) في مدخل الموزع الفرعي الثاني. ثم <b>Q7</b> و<b>Q8</b> أوتوماتيكيان على مخرجيه، و<b>Q9</b> و<b>Q10</b> مفتاحا قدرة في مدخلي موزعي الأحمال.',3],
    ['رموز مستهلكات موزع الإضاءة: (1) مقابس بملامسات وقاية، (2) مصابيح تفريغ كهربائية، (3) مصابيح توهج، (4) محول جهد صغير.',4],
    ['رموز مستهلكات موزع القدرة: (5) محرك ثلاثي الأوجه، (6) مقابس ثلاثية الأوجه، (7) مروحة بمحرك ثلاثي الأوجه، (8) مقاومات تسخين.',5],
    ['اكتمل الحل. لاحظ الترتيب نفسه في الشكل (4-1): مفتاح أوتوماتيكي يحمي الخط الخارج، ثم مفتاح فصل عند مدخل الموزع التالي. جرّب الشبكة في «المختبر».',6]
   ].map(([t,n],i,a)=>({t:t+box(fig48({sol:1,stage:n}),500),final:i===a.length-1}))},
  {title:'التمرين (2) — حل مقترح (ليس من الكتاب): تمديد الموصلات في الشكل (4-9)',ref:'ص 98',
   q:'<p>ارسم مسار موصلات الدوائر الأربع على مخطط التركيبات، واكتب عدد الموصلات على كل مسار. الدائرة الجديدة في كل خطوة بلون مميَّز. (عدد الموصلات: ثلاثة للإضاءة والمقابس — وجه وتعادل وحماية — وسلكان من المصباح إلى مفتاحه، وأربعة للمحرك — ثلاثة أوجه وحماية؛ وهذا اختيار منا.)</p>',
   solve:()=>[
    ['المخطط كما في الكتاب: اللوحة (العداد والقضيب والقواطع 1–4) والرموز في المخزن والمكتب والورشة.',1],
    ['<b>الدائرة الأولى — إضاءة الورشة</b> (من القاطع 1): مسار بثلاثة موصلات إلى علبة التفريع في السقف، ومنها إلى المصباحين في الوسط وإلى الفلورسنت على الجدارين، ومن كل مجموعة سلكان إلى مفتاحها قرب الجدار السفلي.',2],
    ['<b>الدائرة الثانية — مقابس الورشة</b> (من القاطع 2): مسار بثلاثة موصلات يدور على الجدار الأيسر ثم السفلي ثم الأيمن، ويتفرع إلى كل مقبس.',3],
    ['<b>الدائرة الثالثة — المحرك ثلاثي الأوجه</b> (من القاطع 3): مسار بأربعة موصلات إلى المحرك.',4],
    ['<b>الدائرة الرابعة — المخزن والمكتب</b> (المخرج 4): يصعد إلى علبة في المخزن تغذي مصباحيه ومقبسه ومفتاحيه، ثم يعبر إلى علبة في المكتب تغذي مصباحيه ومقابسه الثلاثة ومفتاحيه.',5],
    ['اكتمل الحل المقترح. اكتب بجانب كل مسار مقطع موصلاته وقاطعه (البيانات يختارها المدرب حسب الأحمال، كما في الشكلين 4-2 و 4-6).',6]
   ].map(([t,n],i,a)=>({t:t+box(fig49({sol:1,stage:n}),560),final:i===a.length-1}))},
  {title:'التمرين (3) — حل مقترح (ليس من الكتاب) حسب الشكل (4-10)',ref:'ص 99',
   q:'<p>الدائرة التنفيذية كما رُسمت الخطية في الشكل (4-10): مصاهر ← مفتاح ثلاثي ← فولتميتر بين خطين ← قضبان التوزيع ← قاطعان آليان ثلاثيان لمجموعتي المحركات. كل سلك يُرسم على حدة.</p>',
   solve:()=>[
    ['خطوط التغذية <span class="ltr">L1، L2، L3، N، PE</span> (الشكل يكتب «4» على قضيب التغذية؛ أضفنا موصل الحماية <span class="ltr">PE</span> للمحركات)، ثم ثلاثة مصاهر <span class="ltr">F1</span>.',1],
    ['المفتاح الثلاثي <span class="ltr">Q1</span> (ثلاثة ملامس بربط ميكانيكي متقطع)، والفولتميتر بين <span class="ltr">L1</span> و<span class="ltr">L2</span> لقياس جهد الخط.',2],
    ['قضبان التوزيع الثلاثة، ومنها القاطعان الآليان <span class="ltr">Q2</span> و<span class="ltr">Q3</span> إلى مجموعتي المحركات، وموصل الحماية إلى جسم كل مجموعة.',3],
    ['اكتملت الدائرة التنفيذية حسب الشكل.',4]
   ].map(([t,n],i,a)=>({t:t+box(exec410({stage:n}),520),final:i===a.length-1}))},
  {title:'التمرين (3) — حل مقترح (ليس من الكتاب) حسب نص التمرين',ref:'ص 99',
   q:'<p>حسب النص: «مفتاح أوتوماتيكي بأزرار تشغيل (فتح — غلق)» = كونتاكتور رئيس <span class="ltr">K1</span> بزري إيقاف وتشغيل، يغذي «قاطعين مغناطيسيين» = كونتاكتورين <span class="ltr">K2</span> و<span class="ltr">K3</span> لكل منهما زرّا إيقاف وتشغيل ومرحّل حراري، و«جهاز قياس الجهد لقياس جهد الخط».</p>',
   solve:()=>[
    ['خطوط التغذية والمصاهر <span class="ltr">F1</span>.',1],
    ['ملامس القدرة للكونتاكتور الرئيس <span class="ltr">K1</span>، والفولتميتر بين <span class="ltr">L1</span> و<span class="ltr">L2</span>.',2],
    ['قضبان التوزيع، وملامس <span class="ltr">K2</span> و<span class="ltr">K3</span> ومرحّلاهما الحراريان <span class="ltr">F2</span> و<span class="ltr">F3</span> إلى مجموعتي المحركات.',3],
    ['دائرة التحكم في <span class="ltr">K1</span>: من <span class="ltr">L1</span> عبر مصهر التحكم <span class="ltr">F0</span> ← زر الإيقاف <span class="ltr">S0</span> (مغلق عادة) ← زر التشغيل <span class="ltr">S1</span> وعلى التوازي معه ملمس الإمساك <span class="ltr">K1</span> ← ملف <span class="ltr">K1</span> ← <span class="ltr">N</span>.',4],
    ['دائرتا <span class="ltr">K2</span> و<span class="ltr">K3</span>: كل منهما تمر بملمس مساعد من <span class="ltr">K1</span> (فلا تعمل مجموعة إلا والمفتاح الرئيس مغلق) ← تلامس المرحّل الحراري ← زر إيقاف ← زر تشغيل مع ملمس إمساك ← الملف.',5],
    ['اكتمل الحل حسب النص. هذا اختيار منا لتفسير «الأزرار» و«القاطعين المغناطيسيين»؛ والمدرب قد يعتمد أحد الحلين.',6]
   ].map(([t,n],i,a)=>({t:t+box(exec410({text:1,stage:n}),620),final:i===a.length-1}))}
 ],
 quiz:[
  {q:'في التمرين (1)، ما الفرق في الرسم بين Q4 و Q6؟',o:['لا فرق','Q4 أوتوماتيكي (ذراع وعلامة الفصل الأوتوماتيكي)، و Q6 مفتاح قدرة (ذراع فقط)','Q4 مصهر و Q6 قاطع آلي','Q6 محول'],c:1,e:'Q4 «مفتاح قدرة أوتوماتيكي للموزع الفرعي الثاني» و Q6 «مفتاح قدرة للموزع الفرعي الثاني» (ص 96).'},
  {q:'في الشبكة المكتملة (4-8)، فتحنا Q1 وحده. ماذا يحدث؟',o:['ينقطع المصنع كله','لا ينقطع شيء لأن T2 يغذي الموزع الرئيسي عبر Q2','ينقطع الموزع الفرعي الثاني فقط','ينقطع موزع الإضاءة فقط'],c:1,e:'المحولان يغذيان الموزع الرئيسي نفسه.'},
  {q:'أي مستهلك في التمرين (1) يتغذى عبر مصهر ثم تلامس حراري؟',o:['(1) المقابس','(3) مصابيح التوهج','(7) المروحة بمحرك ثلاثي الأوجه','(8) مقاومات التسخين'],c:2,e:'الخط (7) في الشكل: مصهر «3» ثم تلامس حراري — يناسب المحرك (ص 97).'},
  {q:'ما مقياس رسم مسقط الورشة في التمرين (2)؟',o:['1 : 10','1 : 50','1 : 100','1 : 500'],c:1,e:'مكتوب أسفل الشكل (4-9) «مقياس الرسم 1 : 50» (ص 98).'},
  {q:'كم دائرة يطلب التمرين (2) تمديدها؟',o:['دائرتين','ثلاث دوائر','أربع دوائر','خمس دوائر'],c:2,e:'إضاءة الورشة، مقابس الورشة، المحرك، إضاءة ومقابس المكتب والمخزن (ص 98).'},
  {q:'ما الذي يقيسه الجهاز «V» في الشكل (4-10)؟',o:['التيار','جهد الخط','القدرة','الطاقة'],c:1,e:'«واللوحة مزودة بجهاز قياس الجهد لقياس جهد الخط» (ص 99).'}
 ]
});

})(PLCBOOK);
