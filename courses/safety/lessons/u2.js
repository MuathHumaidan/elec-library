/* السلامة الصناعية — الوحدة الثانية «الصحة المهنية» (ص 9–24): u2-l1 … u2-l4 */
(function(B){
"use strict";
const lt=s=>`<span class="ltr">${s}</span>`;
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');

/* ---------- styles for this unit's labs (CSS variables only) ---------- */
(function css(){if(typeof document==='undefined'||document.getElementById('saf1-css'))return;const s=document.createElement('style');s.id='saf1-css';s.textContent=`
.sf-lab .seg{flex-wrap:wrap;max-width:100%}
.sf-it{border:1px solid var(--line);border-radius:12px;padding:10px 12px;margin-top:8px;background:var(--surface)}
.sf-it p{margin:0 0 8px;line-height:1.75}
.sf-row{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:8px}
.sf-b{font:inherit;font-size:14px;min-height:40px;padding:6px 12px;border-radius:12px;border:1.5px solid var(--line);background:var(--bg);color:var(--fg);cursor:pointer;line-height:1.5;text-align:start}
.sf-b:hover:not(:disabled){border-color:var(--blue)}
.sf-b:disabled{cursor:default}
.sf-b[aria-pressed="true"]{background:var(--blue);border-color:var(--blue);color:#fff}
.sf-b.ok{border-color:var(--on);background:var(--on-soft);color:var(--fg)}
.sf-b.no{border-color:var(--stop);background:var(--stop-soft);color:var(--fg)}
.sf-b.dim{opacity:.55}
.sf-fb{margin-top:8px;font-size:14px;line-height:1.8;border-inline-start:3px solid var(--blue);background:var(--blue-soft);padding:6px 12px;border-radius:8px}
.sf-fb.bad{border-inline-start-color:var(--stop);background:var(--stop-soft)}
.sf-fb.warn{border-inline-start-color:var(--live);background:var(--live-soft)}
.sf-fb:empty,.sf-lab [hidden]{display:none}
.sf-ord{margin:8px 0 0;padding-inline-start:22px}
.sf-ord li{margin:5px 0;padding:6px 10px;border-radius:10px;background:var(--on-soft);border:1px solid var(--on);line-height:1.6}
.sf-pool{display:grid;gap:8px;margin-top:8px}
.sf-score{margin-top:10px;font-weight:700}
.sf-para{line-height:2.3;font-size:15px;background:var(--surface-2);border-radius:12px;padding:10px 14px;margin-top:8px}
.sf-ph{border:none;border-bottom:2px dashed var(--muted);background:none;color:var(--fg);font:inherit;padding:0 2px;cursor:pointer;border-radius:4px}
.sf-ph.ok{background:var(--on-soft);border-bottom-color:var(--on)}
.sf-ph.no{background:var(--stop-soft);border-bottom-color:var(--stop);text-decoration:line-through}
.sf-sl{display:flex;flex-direction:column;gap:2px;font-size:13.5px;margin-top:10px;min-width:0}
.sf-sl .h{display:flex;justify-content:space-between;gap:8px;align-items:baseline}
.sf-sl b{font-family:var(--mono);direction:ltr;unicode-bidi:isolate;color:var(--blue-ink);font-size:14px;white-space:nowrap}
.sf-sl input[type=range]{width:100%;accent-color:var(--blue);direction:ltr;margin:4px 0}
.sf-req{list-style:none;padding:0;margin:8px 0 0}
.sf-req li{display:flex;gap:8px;align-items:flex-start;padding:6px 8px;border-radius:10px;margin-top:5px;background:var(--surface-2);line-height:1.65;font-size:14px}
.sf-req li i{font-style:normal;font-weight:700;min-width:20px;text-align:center}
.sf-req li.ok{background:var(--on-soft)} .sf-req li.ok i{color:var(--on)}
.sf-req li.no{background:var(--stop-soft)} .sf-req li.no i{color:var(--stop)}
.sf-req li.inf{background:var(--blue-soft)} .sf-req li.inf i{color:var(--blue-ink)}
.sf-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}
.sf-chip{display:inline-block;padding:3px 10px;border-radius:999px;font-size:13px;background:var(--live-soft);border:1px solid var(--live)}
.sf-try{margin:6px 0 0;padding-inline-start:20px}
.sf-q{border:1px solid var(--line);border-radius:12px;padding:8px 12px;margin-top:8px;background:var(--surface)}
.sf-q summary{cursor:pointer;font-weight:600;line-height:1.75}
.sf-ans{margin-top:8px;border-inline-start:3px solid var(--blue);padding:6px 12px;background:var(--blue-soft);border-radius:0 10px 10px 0;line-height:1.8}
.sf-badge{display:inline-block;font-size:12px;font-weight:700;padding:1px 9px;border-radius:999px;background:var(--live-soft);color:var(--fg);margin-inline-end:6px}
`;document.head.appendChild(s)})();

/* ---------- small helpers ---------- */
/* SVG text: Arabic in one run, every Latin/number run in its own LTR tspan */
const RUN=/([A-Za-z0-9][A-Za-z0-9 .,:×/%μ°\-–+=]*[A-Za-z0-9%μ°)]|[A-Za-z0-9])/;
function svT(x,y,s,o){o=o||{};const st=o.st?` style="${o.st}"`:'',an=o.a||'middle';
 if(!/[؀-ۿ]/.test(s))return `<text class="txt ${o.c||''}" x="${x}" y="${y}" text-anchor="${an}"${st}>${s}</text>`;
 const body=String(s).split(RUN).map((p,i)=>i%2?`<tspan direction="ltr" unicode-bidi="embed">${p}</tspan>`:p).join('');
 return `<text class="txt ar ${o.c||''}" x="${x}" y="${y}" text-anchor="${an}"${st}>${body}</text>`}
function stepsUI(host,steps){let i=0;
 const draw=()=>{host.innerHTML=steps.map((s,j)=>`<li class="${j<i?'done':j===i?'cur':''}"><span class="k">${j<i?'✓':j+1}</span><div><h4>${s.t}</h4><p>${s.x}</p>${j===i?`<div class="act">${s.done?'<span class="hint">بانتظار تنفيذك…</span> <button class="btn" data-next>تخطَّ</button>':'<button class="btn primary" data-next>التالي</button>'}</div>`:''}</div></li>`).join('')+
  (i>=steps.length?`<li class="cur"><span class="k">✓</span><div><h4>أحسنت، أنهيت التجربة</h4><p style="display:block">جرّب حالات أخرى، أو أعد التجربة من أولها.</p><div class="act"><button class="btn" data-restart>إعادة التجربة</button></div></div></li>`:'')};
 host.addEventListener('click',e=>{if(e.target.closest('[data-next]')){i++;draw()}if(e.target.closest('[data-restart]')){i=0;draw()}});draw();
 return {check(){const s=steps[i];if(s&&s.done&&s.done()){i++;draw()}}}}
const tries=list=>`<h3 class="sm">جرّب</h3><ul class="sub sf-try">${list.map(t=>`<li>${t}</li>`).join('')}</ul>`;
const det=(q,ans,extra)=>`<details class="sf-q"><summary>${q}</summary>${extra||''}<div class="sf-ans"><b>إجابة مقترحة (ليست من الكتاب):</b> ${ans}</div></details>`;
/* fixed «mixed» order (never equal to the right order) */
const mix=n=>{const a=[...Array(n).keys()];let s=n*7+3;for(let i=n-1;i>0;i--){s=(s*48271)%2147483647;const j=s%(i+1);[a[i],a[j]]=[a[j],a[i]]}if(a.every((v,i)=>v===i)&&n>1)a.push(a.shift());return a};

/* ---- activity: sort items into categories ---- */
function sortAct(el,o,onDone){
 const draw=()=>{el.innerHTML=(o.intro?`<p class="sub">${o.intro}</p>`:'')+o.items.map((it,i)=>`<div class="sf-it" data-i="${i}"><p>${it[0]}</p><div class="sf-row">${o.cats.map((c,j)=>`<button type="button" class="sf-b" data-c="${j}">${c}</button>`).join('')}</div><div class="sf-fb" hidden></div></div>`).join('')+`<div class="sf-score" hidden></div>`;
  const done={};
  el.querySelectorAll('.sf-it').forEach(box=>{const i=+box.dataset.i,it=o.items[i],w=box.querySelector('.sf-fb');
   box.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{const ok=+b.dataset.c===it[1];
    box.querySelectorAll('[data-c]').forEach(x=>{x.disabled=true;x.classList.add(+x.dataset.c===it[1]?'ok':x===b?'no':'dim')});
    w.className='sf-fb'+(ok?'':' bad');w.innerHTML=`<b>${ok?'صحيح.':'ليس كذلك.'}</b> ${it[2]||''}`;w.hidden=false;done[i]=ok;if(o.onPick)o.onPick(i,ok,+b.dataset.c);
    if(Object.keys(done).length===o.items.length){const s=el.querySelector('.sf-score'),k=Object.values(done).filter(Boolean).length;
     s.innerHTML=`أصبت ${lt(k+' / '+o.items.length)}. <button type="button" class="sf-b" data-rs>أعد المحاولة</button>`;s.hidden=false;s.querySelector('[data-rs]').onclick=draw;if(onDone)onDone(k,o.items.length)}})})};
 draw()}
/* ---- activity: press the steps in the right order ---- */
function orderAct(el,o,onDone){const S=o.steps.map(s=>Array.isArray(s)?s:[s,'']);
 const draw=()=>{const m=mix(S.length);let nx=0;
  el.innerHTML=`<p class="sub">${o.intro||'اضغط البنود بالترتيب الصحيح.'}</p><ol class="sf-ord"></ol><div class="sf-pool">${m.map(i=>`<button type="button" class="sf-b" data-i="${i}">${S[i][0]}</button>`).join('')}</div><div class="sf-fb"></div><div class="sf-row"><button type="button" class="sf-b" data-rs>ابدأ من جديد</button></div>`;
  const ol=el.querySelector('.sf-ord'),fb=el.querySelector('.sf-fb');
  el.querySelectorAll('.sf-pool [data-i]').forEach(b=>b.onclick=()=>{const i=+b.dataset.i;
   if(i===nx){const li=document.createElement('li');li.innerHTML=S[i][0];ol.appendChild(li);b.hidden=true;nx++;fb.className='sf-fb';fb.innerHTML=nx===S.length?`<b>أحسنت، الترتيب كامل.</b> ${o.done||''}`:'';if(nx===S.length&&onDone)onDone()}
   else{fb.className='sf-fb bad';fb.innerHTML=`<b>ليس هذا البند التالي.</b> ${S[i][1]||''}`}});
  el.querySelector('[data-rs]').onclick=draw};
 draw()}

/* ---- activity: short cases, one right option each (can retry) ---- */
function casesAct(el,o,onRight){
 el.innerHTML=(o.intro?`<p class="sub">${o.intro}</p>`:'')+o.cases.map((c,i)=>`<div class="sf-it" data-i="${i}"><p><b>${i+1}.</b> ${c.q}</p><div class="sf-pool">${c.opts.map((x,j)=>`<button type="button" class="sf-b" data-j="${j}">${x[0]}</button>`).join('')}</div><div class="sf-fb" hidden></div></div>`).join('');
 el.querySelectorAll('.sf-it').forEach(box=>{const c=o.cases[+box.dataset.i],w=box.querySelector('.sf-fb'),bs=[...box.querySelectorAll('[data-j]')];
  bs.forEach(b=>b.onclick=()=>{const j=+b.dataset.j,ok=!!c.opts[j][1];
   bs.forEach(x=>{x.disabled=true;x.classList.add(c.opts[+x.dataset.j][1]?'ok':x===b?'no':'dim')});
   w.className='sf-fb'+(ok?'':' bad');w.innerHTML=`<b>${ok?'صحيح.':'ليس هذا.'}</b> ${c.opts[j][2]||''} <button type="button" class="sf-b" data-r style="min-height:32px;padding:2px 10px">حاول مرة أخرى</button>`;w.hidden=false;
   if(ok&&onRight)onRight(+box.dataset.i);
   w.querySelector('[data-r]').onclick=()=>{bs.forEach(x=>{x.disabled=false;x.classList.remove('ok','no','dim')});w.hidden=true}})})}
function loopOn(el,fn){let last=performance.now();const f=now=>{if(!document.body.contains(el))return;const dt=Math.min(0.05,Math.max(0,(now-last)/1000));last=now;try{fn(dt)}catch(e){console.error(e);return}requestAnimationFrame(f)};requestAnimationFrame(f)}

const fm=(x,d)=>B.fmtN(B.round(x,d==null?2:d),undefined);
const fig=(svg,cap,ref,mw)=>`<figure class="fig"><div class="svgbox" style="max-width:${mw||560}px;margin-inline:auto">${svg}</div><figcaption>${cap}${ref?` <span class="ref">${ref}</span>`:''}</figcaption></figure>`;
const ADD='<span class="sf-badge">إضافة من خارج الكتاب</span>';

/* =====================================================================
   u2-l1 — المخاطر الكيميائية وأنواع الملوثات (ص 9–14)
   ===================================================================== */
function routesSVG(){const Q=[['Inhalation','الاستنشاق',0,0],['Ingestion','البلع',1,0],['Skin Absorption','الامتصاص خلال الجلد',0,1],['Skin Contact','ملامسة الجلد',1,1]];
 let s=`<svg viewBox="0 0 420 300" role="img" aria-label="طرق دخول المواد الكيميائية إلى الجسم"><rect x="0" y="0" width="420" height="300" rx="10" style="fill:var(--blue-soft);stroke:var(--blue)"/><path d="M210 0V300M0 150H420" style="stroke:var(--surface);stroke-width:3"/>`;
 Q.forEach(([en,ar,c,r])=>{const x=c?105:315,y=r?150:0;
  let ic='';
  if(en==='Inhalation')ic=`<path d="M${x} ${y+30}v22M${x} ${y+52}c-6 0-8 4-14 8M${x} ${y+52}c6 0 8 4 14 8" style="fill:none;stroke:var(--fg);stroke-width:2.5"/><path d="M${x-14} ${y+48}c-28 4-32 50-14 56c10 3 16-6 16-16V${y+58}zM${x+14} ${y+48}c28 4 32 50 14 56c-10 3-16-6-16-16V${y+58}z" style="fill:var(--stop-soft);stroke:var(--fg);stroke-width:1.6"/>`;
  if(en==='Ingestion')ic=`<circle cx="${x-8}" cy="${y+70}" r="28" style="fill:var(--surface);stroke:var(--fg);stroke-width:2"/><path d="M${x+14} ${y+78}h18" style="stroke:var(--fg);stroke-width:2"/><rect x="${x+30}" y="${y+60}" width="22" height="30" rx="3" style="fill:var(--live-soft);stroke:var(--fg)"/>`;
  if(en.startsWith('Skin')){ic=`<path d="M${x-50} ${y+80}h60c10 0 10-10 0-10h-40c-6-4 30-6 44-2c10 2 20-2 30-2c8 0 8 12 0 12h-20c10 2 12 12 0 12H${x-50}z" style="fill:var(--surface);stroke:var(--fg);stroke-width:1.8"/>`;
   if(en==='Skin Absorption')ic+=[0,1,2,3,4].map(i=>`<circle cx="${x-38+i*14}" cy="${y+84+(i%2)*6}" r="3" style="fill:var(--live)"/>`).join('')}
  s+=ic+`<text class="txt" x="${x}" y="${y+124}" text-anchor="middle" style="font-size:13px">${en}</text>`+svT(x,y+142,ar,{st:'font-size:12px'})});
 return s+'</svg>'}
/* the book figure (2-2) */
const LX=l=>60+(l+2)*110;
function rulerFig(){let s=`<svg viewBox="0 0 560 250" role="img" aria-label="أحجام الملوثات الكيميائية بالميكرون"><text class="txt" x="280" y="22" text-anchor="middle" style="font-size:15px">PARTICLE DIAMETERS</text>`;
 s+=`<path d="M${LX(-2)-20} 80H${LX(2)+20}" style="stroke:var(--fg);stroke-width:2"/>`;
 ['.01μ','.1μ','1μ','10μ','100μ'].forEach((t,i)=>{s+=`<path d="M${LX(i-2)} 74v12" style="stroke:var(--fg);stroke-width:2"/><text class="txt" x="${LX(i-2)}" y="100" text-anchor="middle">${t}</text>`});
 s+=`<path d="M${LX(1.48)} 50v12M${LX(1.48)} 56H${LX(2)+25}" style="stroke:var(--fg);stroke-width:2"/><path d="M${LX(2)+25} 51l8 5-8 5z" style="fill:var(--fg)"/><text class="txt" x="${LX(1.75)}" y="48" text-anchor="middle">Visible</text>`;
 for(let i=0;i<4;i++){const x=LX(-1.9)+i*22;s+=`<path d="M${x} 112c8 10-8 20 0 30s-8 20 0 30" style="fill:none;stroke:var(--muted);stroke-width:2"/>`}
 s+=`<text class="txt" x="${LX(-1.5)}" y="200" text-anchor="middle" style="font-size:13px">Fumes</text>`;
 s+=`<ellipse cx="${LX(0)}" cy="172" rx="${(LX(1.9)-LX(-2))/2}" ry="34" transform="translate(${(LX(-2)+LX(1.9))/2-LX(0)} 0)" style="fill:var(--surface-2);stroke:var(--fg);stroke-dasharray:4 3"/><text class="txt" x="${LX(0)}" y="178" text-anchor="middle" style="font-size:14px">Dusts</text>`;
 s+=`<ellipse cx="${LX(1.5)}" cy="132" rx="${(LX(2)-LX(1))/2}" ry="18" style="fill:var(--blue-soft);stroke:var(--blue)"/><text class="txt" x="${LX(1.5)}" y="137" text-anchor="middle">Mists</text>`;
 s+=`<text class="txt m" x="280" y="226" text-anchor="middle">1 Micron = 1μ = 1/1,000,000 Meter · 1 Red Blood Cell = 7μ · 1 Bacterium = 1μ</text>`;
 return s+'</svg>'}
function gasVapSVG(){let s=`<svg viewBox="0 0 440 220" role="img" aria-label="الغازات والأبخرة"><text class="txt" x="220" y="20" text-anchor="middle" style="font-size:14px">GAS VS. VAPOR</text>`;
 s+=`<rect x="30" y="110" width="110" height="40" style="fill:var(--blue-soft);stroke:var(--fg);stroke-width:1.6"/><path d="M30 118h110" style="stroke:var(--blue)"/>`;
 s+=`<rect x="330" y="70" width="40" height="80" rx="16" style="fill:var(--surface-2);stroke:var(--fg);stroke-width:1.6"/><rect x="342" y="56" width="16" height="14" style="fill:var(--fg)"/><circle cx="372" cy="60" r="8" style="fill:var(--surface);stroke:var(--fg)"/>`;
 s+=`<circle cx="220" cy="80" r="26" style="fill:var(--surface);stroke:var(--fg);stroke-width:2"/><path d="M208 76h6M226 76h6M210 94c6-4 14-4 20 0" style="stroke:var(--fg);stroke-width:2;fill:none"/>`;
 s+=`<path d="M85 105c0-20 20-20 20-40s30-10 80 5" style="fill:none;stroke:var(--live);stroke-width:2;stroke-dasharray:5 4"/><path d="M350 52c0-20-20-25-40-15s-40 30-62 30" style="fill:none;stroke:var(--stop);stroke-width:2;stroke-dasharray:5 4"/>`;
 s+=`<text class="txt" x="85" y="170" text-anchor="middle">Solvent Dip Tank</text><text class="txt" x="85" y="188" text-anchor="middle" style="font-size:14px">Vapors</text><text class="txt m" x="85" y="204" text-anchor="middle">Liquid at room Temperature</text>`;
 s+=`<text class="txt" x="350" y="170" text-anchor="middle">Gas Cylinder</text><text class="txt" x="350" y="188" text-anchor="middle" style="font-size:14px">Gases</text><text class="txt m" x="350" y="204" text-anchor="middle">Gas at room Temperature</text>`;
 return s+'</svg>'}
function threeSVG(){let s=`<svg viewBox="0 0 540 150" role="img" aria-label="الأتربة والأدخنة والرذاذ">`;
 s+=`<g transform="translate(90 70)">${[[-30,-10,22],[0,-20,26],[28,-6,22],[-10,14,20],[20,18,18]].map(c=>`<circle cx="${c[0]}" cy="${c[1]}" r="${c[2]}" style="fill:var(--surface-2);stroke:var(--fg)"/>`).join('')}${Array.from({length:14},(x,i)=>`<circle cx="${Math.cos(i)*60}" cy="${Math.sin(i*1.7)*45}" r="2" style="fill:var(--fg)"/>`).join('')}<text class="txt" x="0" y="6" text-anchor="middle" style="font-size:18px">DUST</text></g>`;
 s+=`<g transform="translate(270 70)">${[0,1,2].map(i=>`<path d="M${-30+i*30} 30c-14-14 14-24 0-40s14-20 0-34" style="fill:none;stroke:var(--muted);stroke-width:2.4"/>`).join('')}<text class="txt" x="0" y="52" text-anchor="middle" style="font-size:18px">FUMES</text></g>`;
 s+=`<g transform="translate(450 70)"><rect x="-56" y="-6" width="34" height="14" rx="3" style="fill:var(--blue)"/><path d="M-40 8v24" style="stroke:var(--fg);stroke-width:3"/><rect x="-50" y="30" width="20" height="16" style="fill:var(--live-soft);stroke:var(--fg)"/>${[-30,-15,0,15,30].map(a=>`<path d="M-20 0l${60*Math.cos(a*Math.PI/180)} ${60*Math.sin(a*Math.PI/180)}" style="stroke:var(--live);stroke-width:2;stroke-dasharray:2 4"/>`).join('')}</g>`;
 s+=svT(90,140,'الشكل (3-2)',{st:'font-size:11px'})+svT(270,140,'الشكل (4-2)',{st:'font-size:11px'})+svT(450,140,'الشكل (5-2)',{st:'font-size:11px'});
 return s+'</svg>'}

function rulerLab(d){const l=Math.log10(d),X=LX(l);
 let s=`<svg viewBox="0 0 560 230" role="img" aria-label="مسطرة حجم الجسيمات">`;
 const band=(a,b,y,h,col,lab)=>`<rect x="${LX(Math.log10(a))}" y="${y}" width="${LX(Math.log10(b))-LX(Math.log10(a))}" height="${h}" rx="6" style="fill:var(${col}-soft);stroke:var(${col})"/>`+svT((LX(Math.log10(a))+LX(Math.log10(b)))/2,y+h/2+4,lab,{st:'font-size:12px'});
 s+=band(0.01,1,14,24,'--stop','أدخنة: أقل من 1 μ')+band(0.1,25,44,24,'--blue','أتربة: من 0.1 إلى 25 μ')+band(10,100,74,24,'--live','رذاذ (من الشكل)');
 s+=`<rect x="${LX(-2)}" y="104" width="${LX(1)-LX(-2)}" height="18" style="fill:var(--on-soft)"/>`+svT((LX(-2)+LX(1))/2,117,'تُستنشق إلى الرئة: أقل من 10 μ',{st:'font-size:11.5px'});
 s+=`<rect x="${LX(1)}" y="104" width="${LX(2)-LX(1)}" height="18" style="fill:var(--surface-2)"/>`+svT((LX(1)+LX(2))/2,117,'غير مستنشقة',{st:'font-size:11.5px'});
 s+=`<path d="M${LX(-2)-10} 150H${LX(2)+10}" style="stroke:var(--fg);stroke-width:2"/>`;
 ['0.01','0.1','1','10','100'].forEach((t,i)=>{s+=`<path d="M${LX(i-2)} 144v12" style="stroke:var(--fg);stroke-width:2"/><text class="txt" x="${LX(i-2)}" y="172" text-anchor="middle">${t} μ</text>`});
 s+=`<path d="M${LX(0)} 156v4" style="stroke:var(--blue)"/>`+svT(LX(0),190,'بكتيريا 1 μ',{st:'font-size:11px;fill:var(--muted)'})+`<path d="M${LX(Math.log10(7))} 150v34" style="stroke:var(--stop);stroke-dasharray:2 2"/>`+svT(LX(Math.log10(7)),196,'خلية دم حمراء 7 μ',{st:'font-size:11px;fill:var(--muted)'});
 s+=`<path d="M${X} 8V150" style="stroke:var(--fg);stroke-width:2"/><circle cx="${X}" cy="150" r="7" style="fill:var(--live);stroke:var(--fg)"/>`;
 s+=svT(280,222,'المسطرة لوغاريتمية: كل قسم أكبر من الذي قبله 10 مرات',{st:'font-size:11px;fill:var(--muted)'});
 return s+'</svg>'}
function lab21(el){
 let d=5;const W={};
 el.innerHTML=`<div class="grid sf-lab">
  <div class="panel c7"><h2>مسطرة حجم الملوثات <small>مبنية على الشكل (2-2) ص 12 ونص ص 13</small></h2>
   <p class="sub">حرّك قطر الجسيم وانظر: ما الملوثات التي لها هذا الحجم؟ وهل يصل إلى الرئتين؟ الحدود من نص الكتاب، وحدود الرذاذ والرؤية بالعين تقريبية من الشكل.</p>
   <div class="svgbox" id="rv"></div>
   <label class="sf-sl"><span class="h"><span>قطر الجسيم</span><b id="dV"></b></span><input type="range" id="dR" min="-2" max="2" step="0.01" value="${Math.log10(d)}"></label>
   <div class="sf-row">${[0.05,0.5,5,15,50].map(v=>`<button class="sf-b" data-d="${v}">${lt(v+' μ')}</button>`).join('')}</div>
   <div class="facts" id="fx"></div><div class="sf-fb" id="msg"></div></div>
  <div class="panel c5"><h2>التجربة خطوة بخطوة</h2><ol class="steps" id="gs"></ol>${tries(['قارن 9 μ و 11 μ لغبار واحد: أيهما يصل إلى الحويصلات الهوائية؟','ضع المؤشر على حجم خلية الدم الحمراء (7 μ): هل يمكن رؤية جسيم بهذا الحجم بالعين؟'])}</div>
  <div class="panel c12"><h2>ما نوع الملوث؟ <small>ص 12–14</small></h2><div id="srt"></div></div>
 </div>`;
 const $=q=>el.querySelector(q);
 const S=stepsUI($('#gs'),[
  {t:'جسيم دقيق جداً',x:`اجعل القطر أقل من ${lt('1 μ')}: هذا حجم الأدخنة (مثل أدخنة اللحام).`,done:()=>W.d<1},
  {t:'غبار مستنشق',x:`اجعل القطر بين ${lt('1 μ')} و ${lt('10 μ')}: غبار يصل إلى الحويصلات ويسبب السيليكوزيس.`,done:()=>W.d>=1&&W.d<10},
  {t:'غبار غير مستنشق',x:`اجعل القطر ${lt('10 μ')} أو أكثر.`,done:()=>W.d>=10&&W.d<=25},
  {t:'خارج مدى الأتربة',x:`اجعل القطر أكبر من ${lt('25 μ')}: لم يعد في مدى الأتربة في النص، والرذاذ يظهر في هذا المدى في الشكل.`,done:()=>W.d>25},
  {t:'صنّف الملوثات',x:'أكمل نشاط «ما نوع الملوث؟» في الأسفل.',done:()=>W.sort}]);
 const draw=()=>{W.d=d;$('#rv').innerHTML=rulerLab(d);$('#dR').value=Math.log10(d);$('#dV').textContent=(d<0.1?d.toFixed(3):d<1?d.toFixed(2):d<10?d.toFixed(1):d.toFixed(0))+' μ';
  const types=[];if(d<1)types.push('أدخنة');if(d>=0.1&&d<=25)types.push('أتربة');if(d>=10)types.push('رذاذ (من الشكل)');
  const resp=d<10,vis=d>=30;
  $('#fx').innerHTML=`<div class="fact"><span>قد يكون</span><b style="font-family:var(--font);direction:rtl;font-size:15px">${types.join('، ')||'—'}</b></div><div class="fact"><span>${d>=0.1&&d<=25?'غبار بهذا الحجم':'لو كان غباراً'}</span><b style="font-family:var(--font);direction:rtl;font-size:15px;color:var(${resp?'--stop':'--on'})">${resp?'مستنشق Respirable':'غير مستنشق'}</b></div><div class="fact"><span>بالعين المجردة (من الشكل)</span><b style="font-family:var(--font);direction:rtl;font-size:15px">${vis?'يُرى تقريباً':'لا يُرى'}</b></div><div class="fact"><span>مقارنة بخلية الدم الحمراء</span><b>${d>=7?'× '+fm(d/7,1):'÷ '+fm(7/d,d>0.7?1:0)}</b></div>`;
  const m=$('#msg');m.className='sf-fb'+(resp?' warn':'');m.innerHTML=resp?`<b>خطر على الرئتين:</b> الأتربة التي قطرها أقل من ${lt('10 μ')} تسمى المستنشقة، وهي ضارة جداً بالصحة لأنها قد تترسب في الحويصلات الهوائية داخل الرئتين وتسبب السيليكوزيس (ص 13).`:`الأتربة التي قطرها ${lt('10 μ')} أو أكثر تسمى غير المستنشقة Non-Respirable (ص 13).`;
  S.check()};
 $('#dR').oninput=e=>{d=Math.pow(10,+e.target.value);draw()};
 el.querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>{d=+b.dataset.d;draw()});
 sortAct($('#srt'),{intro:'لكل مصدر في العمل اختر نوع الملوث الذي ينتج منه. الأمثلة من الكتاب.',cats:['أتربة','أدخنة','رذاذ','ألياف','أبخرة','غازات'],items:[
  ['طحن وتفتيت المواد (مثل الحجارة).',0,'الأتربة مواد صلبة تنتج من عمليات تفتيت وطحن المواد العضوية وغير العضوية (ص 13).'],
  ['لحام المعادن: انصهار المعدن ثم تكثف ما تبخر منه.',1,'الأدخنة تتكون من تكثيف المواد الناتجة من تبخر المواد الصلبة، وتنتج من عمليات اللحام (ص 13).'],
  ['رش الدهان بالمسدس، أو أحماض الطلاء الكهربائي.',2,'الرذاذ قطرات من السوائل العالقة بالجو، ومن أمثلته رذاذ الأحماض في الطلاء الكهربائي ورش الدهان (ص 14).'],
  ['عزل قديم من الأسبستوس أو الفايبرجلاس.',3,'الألياف مواد صلبة طولها عدة مرات أكثر من قطرها، ومن أمثلتها الأسبستوس والفايبرجلاس (ص 14).'],
  ['حوض غمس فيه مذيب سائل في درجة حرارة الغرفة.',4,'المادة سائلة في درجة حرارة الغرفة وتتصاعد منها أبخرة (الشكل 2-6).'],
  ['أسطوانة غاز يتسرب منها.',5,'المادة غاز في درجة حرارة الغرفة (الشكل 2-6).']]},()=>{W.sort=1;S.check()});
 draw()}

B.lesson({
 id:'u2-l1',unit:2,order:1,pages:'9–14',
 title:'المخاطر الكيميائية وأنواع الملوثات',
 summary:'ما الصحة المهنية، وأنواع المخاطر الأربعة، وطرق دخول المواد الكيميائية إلى الجسم، وأنواع الملوثات: الأتربة والأدخنة والرذاذ والألياف والغازات والأبخرة.',
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
})())/*DCML-END*/,{intro:true}),

  {st:1,short:'أهداف الوحدة',title:'الهدف العام والأهداف التفصيلية للوحدة الثانية',ref:'ص 10',
   q:'ما الذي يهدد صحة العامل في مكان عمله غير الكهرباء؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الأهداف التفصيلية السبعة للوحدة الثانية" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E3ECF7"/><rect x="92" y="40" width="176" height="236" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><rect x="152" y="32" width="56" height="16" rx="4" fill="#2C4A40"/><g data-tip="الهدف ١: أن يتعرف المتدرب على أنواع المخاطر البيئية أثناء العمل."><circle cx="246" cy="72" r="10" fill="#4FB3A9"/><text x="246" y="77" text-anchor="middle" font-size="12" font-weight="700" fill="#FBF6EE">١</text><path d="M114 72 h118" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/></g><g data-tip="الهدف ٢: أن يعرف المتدرب نسب وزمن التعرض للملوثات البيئية المسموح بها في بيئة العمل."><circle cx="246" cy="100" r="10" fill="#4FB3A9"/><text x="246" y="105" text-anchor="middle" font-size="12" font-weight="700" fill="#FBF6EE">٢</text><path d="M134 100 h98" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/></g><g data-tip="الهدف ٣: أن يعرف المتدرب أنواع المخاطر الطبيعية."><circle cx="246" cy="128" r="10" fill="#F2C14E"/><text x="246" y="133" text-anchor="middle" font-size="12" font-weight="700" fill="#2C4A40">٣</text><path d="M124 128 h108" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/></g><g data-tip="الهدف ٤: أن يقيم المتدرب المخاطر في بيئة العمل ودرجة خطورتها."><circle cx="246" cy="156" r="10" fill="#F2C14E"/><text x="246" y="161" text-anchor="middle" font-size="12" font-weight="700" fill="#2C4A40">٤</text><path d="M144 156 h88" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/></g><g data-tip="الهدف ٥: أن يتعرف المتدرب على هرم السيطرة على المخاطر البيئية والطبيعية."><circle cx="246" cy="184" r="10" fill="#F2C14E"/><text x="246" y="189" text-anchor="middle" font-size="12" font-weight="700" fill="#2C4A40">٥</text><path d="M118 184 h114" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/></g><g data-tip="الهدف ٦: أن يتعرف المتدرب على تصنيف المناطق الخطرة."><circle cx="246" cy="212" r="10" fill="#E8735A"/><text x="246" y="217" text-anchor="middle" font-size="12" font-weight="700" fill="#FBF6EE">٦</text><path d="M138 212 h94" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/></g><g data-tip="الهدف ٧: أن يتعرف المتدرب على نوعية الأجهزة الكهربائية المستخدمة في الأماكن الخطرة."><circle cx="246" cy="240" r="10" fill="#E8735A"/><text x="246" y="245" text-anchor="middle" font-size="12" font-weight="700" fill="#FBF6EE">٧</text><path d="M110 240 h122" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/></g><text x="180" y="300" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">سبعة أهداف في أربعة دروس</text></svg>`,
   cap:'الألوان: الأخضر للدرسين 2.1 و2.2، والأصفر للدرس 2.3، والأحمر للدرس 2.4.<br><b>مرّر المؤشر على كل سطر (أو المسه في الجوال) لتقرأ الهدف.</b>',
   side:[
    {predict:{q:'أي هذه من أهداف الوحدة الثانية؟',opts:[
     ['أن يعرف المتدرب نسب وزمن التعرض للملوثات المسموح بها',true,'هذا الهدف التفصيلي الثاني، وهو موضوع الدرس 2.2.'],
     ['أن يركّب المتدرب لوحة توزيع',false,'التركيب ليس من أهداف هذه الوحدة.'],
     ['أن يطفئ المتدرب حريقاً بالطفاية',false,'الطفايات في الوحدة السادسة.']]}}
   ],
   body:[
    {book:`<p><b>الهدف العام للوحدة:</b><br>الإنجازات الأساسية لمعرفة القواعد للصحة المهنية والأخطار الناتجة عن بعض الملوثات</p>
     <p><b>الأهداف التفصيلية:</b></p><ol><li>أن يتعرف المتدرب على أنواع المخاطر البيئية أثناء العمل.</li><li>أن يعرف المتدرب نسب وزمن التعرض للملوثات البيئية المسموح بها في بيئة العمل.</li><li>أن يعرف المتدرب أنواع المخاطر الطبيعية.</li><li>أن يقيم المتدرب المخاطر في بيئة العمل ودرجة خطورتها.</li><li>أن يتعرف المتدرب على هرم السيطرة على المخاطر البيئية والطبيعية.</li><li>أن يتعرف المتدرب على تصنيف المناطق الخطرة.</li><li>أن يتعرف المتدرب على نوعية الأجهزة الكهربائية المستخدمة في الأماكن الخطرة.</li></ol>`,ref:'ص 10'},
    {tip:`<p>الأهداف ١ و٢ في هذا الدرس والدرس التالي (المخاطر الكيميائية وحدود التعرض)، والأهداف ٣ و٤ و٥ في الدرس 2.3، والهدفان ٦ و٧ في الدرس 2.4.</p>`}
   ]},

  {st:2,short:'الصحة المهنية',title:'٢-١ مقدمة: الصحة المهنية <bdi dir="ltr">Industrial Hygiene</bdi>',ref:'ص 11',
   q:'كيف نحمي عاملاً من خطر لم نعرف بوجوده بعد؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="التعرف ثم التقييم ثم السيطرة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="التعرف: معرفة وفهم أنواع المخاطر في بيئة العمل وتأثيرها على صحة العاملين."><circle cx="270" cy="110" r="42" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><circle cx="264" cy="104" r="16" fill="#E3ECF7" stroke="#2C4A40" stroke-width="3.5"/><path d="M276 116 L290 130" stroke="#2C4A40" stroke-width="6" stroke-linecap="round"/></g><g data-tip="التقييم: تحديد درجة خطورة المخاطر، وتقييم وسائل التحكم الموجودة، وأخذ العينات وتحليلها ومقارنتها بالمواصفات القياسية."><circle cx="180" cy="220" r="42" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M152 230 a28 28 0 0 1 56 0" fill="none" stroke="#2C4A40" stroke-width="4"/><path d="M152 230 a28 28 0 0 1 18 -26" fill="none" stroke="#12855A" stroke-width="4"/><path d="M190 206 a28 28 0 0 1 18 24" fill="none" stroke="#C0392B" stroke-width="4"/><path d="M180 230 L194 210" stroke="#2C4A40" stroke-width="3.5" stroke-linecap="round"/><circle cx="180" cy="230" r="4" fill="#2C4A40"/></g><g data-tip="السيطرة: استخدام طرق السيطرة المختلفة على المخاطر ومنع تعرض العاملين لها."><circle cx="90" cy="110" r="42" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M90 82 L112 92 V112 C112 128 102 136 90 142 C78 136 68 128 68 112 V92 Z" fill="#4FB3A9" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round"/><path d="M80 112 l7 7 l13 -14" fill="none" stroke="#FBF6EE" stroke-width="3.5"/></g><path d="M246 146 L214 186" stroke="#2C4A40" stroke-width="3"/><path d="M214 186 l2 -12 M214 186 l11 -5" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><path d="M146 186 L114 146" stroke="#2C4A40" stroke-width="3"/><path d="M114 146 l11 5 M114 146 l2 12" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><text x="270" y="172" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">١ التعرف</text><text x="180" y="282" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">٢ التقييم</text><text x="90" y="172" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">٣ السيطرة</text></svg>`,
   cap:'الصحة المهنية في ثلاث خطوات.<br><b>مرّر المؤشر على العدسة والمقياس والدرع (أو المسها في الجوال) لتعرف كل خطوة.</b>',
   side:[
    {predict:{q:'الصحة المهنية علم يتعلق بثلاثة أشياء. ما هي؟',opts:[
     ['التصميم والتصنيع والبيع',false,'هذه مراحل إنتاج، لا الصحة المهنية.'],
     ['التعرف والتقييم والسيطرة',true,'الكتاب (ص 11): «العلم الذي يتعلق بالتعرف و التقييم والسيطرة على ظروف العمل المختلفة».'],
     ['العلاج والتأمين والتعويض',false,'الصحة المهنية تمنع الإصابة قبل وقوعها، لا تعالجها بعدها.']]}}
   ],
   body:[
    {book:`<p>الصحة المهنية هي العلم الذي يتعلق بالتعرف و التقييم والسيطرة على ظروف العمل المختلفة التي قد تؤدي إلى إصابة العاملين وتعرض صحتهم للخطر.<br>ويستخدم أخصائي الصحة المهنية القياسات البيئية والطرق التحليلية لتحديد مدى تعرض العاملين لمخاطر العمل ومن ثم يقومون باستخدام طرق السيطرة المختلفة للسيطرة على هذه المخاطر ومنع تعرض العاملين لمخاطرها.</p>`,ref:'ص 11'},
    {tip:`<p>الترتيب مهم: لا نستطيع أن <b>نقيّم</b> خطراً لم <b>نتعرّف</b> عليه، ولا أن <b>نسيطر</b> عليه قبل أن نعرف حجمه. وهذا ترتيب عناوين الوحدة نفسها: ٢-٢ التعرف، ثم ٢-٣ التقييم، ثم ٢-٤ السيطرة.</p>`},
    {title:'مختبر مصغّر: رتّب عمل أخصائي الصحة المهنية',widget:(el,B)=>DCML.order(el,B,{intro:'اضغط الخطوات بالترتيب الذي يعمل به أخصائي الصحة المهنية.',steps:[
     ['يتعرف على أنواع المخاطر في بيئة العمل','لا يمكن قياس خطر قبل معرفة وجوده؛ التعرف أولاً.'],
     ['يقيس ويحلل ليحدد مدى تعرض العاملين (التقييم)','القياس يأتي بعد معرفة الخطر، وقبل اختيار طريقة السيطرة.'],
     ['يستخدم طرق السيطرة ليمنع تعرض العاملين للمخاطر','السيطرة آخر خطوة، بعد معرفة الخطر وحجمه.']],done:'التعرف ← التقييم ← السيطرة، كما في تعريف الكتاب.'})}
   ]},

  {st:3,short:'التعرف',title:'٢-٢ التعرف <bdi dir="ltr">Recognition</bdi>',ref:'ص 11',
   q:'الضجيج، والجراثيم، والأبخرة، والآلة الدوّارة… هل هي من نوع واحد؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="أربع مجموعات لمخاطر العمل" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBEBDD"/><g data-tip="المخاطر الكيميائية: مواد على شكل أبخرة أو غازات أو أتربة أو أدخنة أو رذاذ أو ألياف."><rect x="74" y="58" width="100" height="96" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M114 74 h20 M118 74 v24 L102 132 h44 L130 98 v-24" fill="#BFE3DC" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round"/></g><text x="124" y="148" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">كيميائية</text><g data-tip="المخاطر الطبيعية: الحرارة، والضوء، والضوضاء، والإشعاع، والضغط الجوي، والاهتزازات (الدرس 2.3)."><rect x="186" y="58" width="100" height="96" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="226" y="72" width="12" height="44" rx="6" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="232" cy="120" r="10" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5"/><path d="M232 92 v24" stroke="#E8735A" stroke-width="5"/><path d="M252 82 q8 12 0 24 M260 76 q12 18 0 36" fill="none" stroke="#2C4A40" stroke-width="2.5"/></g><text x="236" y="148" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">طبيعية</text><g data-tip="المخاطر البيولوجية: البكتيريا والفيروسات ودخولها إلى الجسم (الدرس 2.3)."><rect x="74" y="166" width="100" height="96" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><ellipse cx="124" cy="204" rx="26" ry="14" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><path d="M98 204 h-10 M150 204 h10 M112 190 l-4 -8 M136 190 l4 -8 M112 218 l-4 8 M136 218 l4 8" stroke="#2C4A40" stroke-width="2.5"/></g><text x="124" y="256" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">بيولوجية</text><g data-tip="المخاطر الهندسية: ميكانيكية من الآلات، وكهربية من التوصيلات، وإيرجنومكس من عدم ملاءمة ظروف العمل (الدرس 2.3)."><rect x="186" y="166" width="100" height="96" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="222" cy="206" r="16" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><circle cx="222" cy="206" r="5" fill="#2C4A40"/><path d="M222 186 v-4 M222 226 v4 M202 206 h-4 M242 206 h4" stroke="#2C4A40" stroke-width="5"/><path d="M262 186 L252 204 H260 L254 222 L270 200 H262 L268 186 Z" fill="#2C4A40"/></g><text x="236" y="256" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">هندسية</text><text x="180" y="292" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">أربع مجموعات لمخاطر العمل</text></svg>`,
   cap:'تقسيم الكتاب لمخاطر العمل.<br><b>مرّر المؤشر على كل مربع (أو المسه في الجوال) لتعرف ما فيه.</b>',
   side:[
    {predict:{q:'كم مجموعة تُقسم إليها مخاطر العمل في الكتاب؟',opts:[
     ['مجموعتان: كهربائية وميكانيكية',false,'هاتان معاً داخل مجموعة واحدة هي «الهندسية».'],
     ['ثلاث مجموعات',false,'الكتاب يذكر أربعاً.'],
     ['أربع: كيميائية وطبيعية وبيولوجية وهندسية',true,'الكتاب (ص 11): «ويتم تقسيم مخاطر العمل إلى أربع مجموعات».']]}}
   ],
   body:[
    {book:`<p>معرفة وفهم أنواع المخاطر المختلفة في بيئة العمل وتأثير هذه المخاطر على صحة العاملين. ويتم تقسيم مخاطر العمل إلى أربع مجموعات هي:</p><ol><li>المخاطر الكيميائية</li><li>المخاطر الطبيعية</li><li>المخاطر البيولوجية</li><li>المخاطر الهندسية</li></ol>`,ref:'ص 11'},
    {title:'مختبر مصغّر: صنّف الخطر',widget:(el,B)=>DCML.sort(el,B,{intro:'المواقف أمثلة من عندنا، والمجموعات من الكتاب (تفاصيلها في هذا الدرس والدرس 2.3).',cats:['كيميائية','طبيعية','بيولوجية','هندسية'],items:[
     ['أبخرة مذيب تتصاعد من حوض تنظيف القطع.',0,'الأبخرة من المخاطر الكيميائية.'],
     ['ضجيج مكبس يعمل طوال اليوم.',1,'الضوضاء من المخاطر الطبيعية.'],
     ['عامل في مختبر تحاليل يتعامل مع عينات فيها بكتيريا.',2,'البكتيريا والفيروسات = مخاطر بيولوجية.'],
     ['كابل كهربائي تالف العزل في الورشة.',3,'المخاطر الكهربية من المخاطر الهندسية.'],
     ['كرسي عمل لا يناسب طول العامل فيؤلم ظهره.',3,'الإيرجنومكس (عدم ملاءمة ظروف العمل للعاملين) من المخاطر الهندسية.'],
     ['حرارة شديدة قرب فرن صهر.',1,'الحرارة من المخاطر الطبيعية.']]})}
   ]},

  {st:4,short:'المخاطر الكيميائية',title:'٢-٢-١ المخاطر الكيميائية',ref:'ص 11–12',
   q:'من أي باب تدخل المادة الكيميائية إلى جسمك… وأي باب هو الأسرع؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="أربع طرق لدخول المواد الكيميائية إلى الجسم" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E3ECF7"/><path d="M196 60 C150 60 128 92 128 128 C128 146 120 152 112 166 C108 174 116 178 124 178 C124 196 126 208 140 212 C152 214 158 220 158 250 H236 C236 220 250 196 250 150 C250 96 230 60 196 60 Z" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round"/><g data-tip="الاستنشاق ⟦Inhalation⟧: دخول المادة مع هواء التنفس. يعدّه الكتاب أسرع طريق لدخول المواد الكيميائية الضارة إلى جسم الإنسان."><path d="M60 150 H110" stroke="#C0392B" stroke-width="5"/><path d="M110 150 l-12 -8 M110 150 l-12 8" stroke="#C0392B" stroke-width="5" stroke-linecap="round"/><text x="62" y="138" font-size="12" fill="#C0392B" font-weight="700">الاستنشاق</text><text x="62" y="172" font-size="11" fill="#C0392B">الأسرع</text></g><g data-tip="البلع ⟦Ingestion⟧: دخول المادة عن طريق الفم، مثل الأكل بيد ملوثة."><path d="M64 196 H116" stroke="#2C4A40" stroke-width="4"/><path d="M116 196 l-10 -7 M116 196 l-10 7" stroke="#2C4A40" stroke-width="4" stroke-linecap="round"/><text x="70" y="214" font-size="12" fill="#2C4A40" font-weight="700">البلع</text></g><g data-tip="الامتصاص خلال الجلد والعينين ⟦Absorption⟧: تمر المادة من الجلد أو العين إلى الجسم."><circle cx="176" cy="114" r="6" fill="#2C4A40"/><path d="M226 116 c10 -4 18 -4 26 2" fill="none" stroke="#2C4A40" stroke-width="2"/><circle cx="262" cy="98" r="4" fill="#4FB3A9"/><circle cx="274" cy="112" r="4" fill="#4FB3A9"/><circle cx="266" cy="126" r="4" fill="#4FB3A9"/><text x="290" y="92" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">الجلد</text><text x="290" y="108" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">والعينان</text></g><g data-tip="الحقن الخاطئ ⟦Accidental Injection⟧: دخول المادة عبر جرح أو وخز بأداة حادة ملوثة."><path d="M270 214 L232 196" stroke="#2C4A40" stroke-width="5" stroke-linecap="round"/><rect x="270" y="206" width="30" height="14" rx="3" fill="#F2C14E" stroke="#2C4A40" stroke-width="2" transform="rotate(25 270 214)"/><text x="292" y="250" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">الحقن الخاطئ</text></g><text x="180" y="290" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">أربعة أبواب إلى الجسم</text></svg>`,
   cap:'طرق دخول المواد الكيميائية إلى الجسم (رسم توضيحي، والطرق من الكتاب).<br><b>مرّر المؤشر على كل سهم وعلى النقاط والإبرة (أو المسها في الجوال) لتعرف الطريق.</b>',
   side:[
    {predict:{q:'أسرع طريق لدخول المواد الكيميائية الضارة إلى جسم الإنسان هو…',opts:[
     ['البلع',false,'البلع طريق ممكن، لكن الكتاب يذكر طريقاً أسرع.'],
     ['الامتصاص خلال الجلد',false,'الجلد حاجز يبطئ دخول كثير من المواد.'],
     ['الاستنشاق',true,'الكتاب (ص 12): «ويعتبر الاستنشاق Inhalation هو أسرع طريق لدخول المواد الكيميائية الضارة إلى جسم الإنسان».']]}}
   ],
   body:[
    {book:`<p>معظم المخاطر الصحية تنتج من استنشاق مواد كيميائية على شكل أبخرة، غازات، أتربة، أدخنة، رذاذ، أو من ملامسة الجلد لهذه المواد (كما هو مبين في الشكل <span class="ltr">(1-2)</span>).<br>كما تعتمد درجة الخطورة للتعرض للمواد الكيميائية على درجة تركيز المادة، ومدة التعرض لها. وتدخل المواد الكيميائية لجسم الإنسان عن طريق أربع طرق هي:</p>
     <ul><li>الاستنشاق Inhalation</li><li>الامتصاص خلال الجلد والعينين Absorption</li><li>البلع Ingestion</li><li>الحقن الخاطئ Accidental Injection</li></ul>
     <p>ويعتبر الاستنشاق Inhalation هو أسرع طريق لدخول المواد الكيميائية الضارة إلى جسم الإنسان.</p>`,ref:'ص 11–12'},
    {tip:`<p>درجة الخطورة تعتمد على شيئين <b>معاً</b>: <b>التركيز</b> (كم من المادة في الهواء) و<b>المدة</b> (كم من الوقت تعرّض لها العامل). تركيز عالٍ لدقائق قد يكون أقل ضرراً من تركيز متوسط طوال اليوم — ومن هنا جاء حساب متوسط التركيز في الدرس التالي.</p>`},
    {html:fig(routesSVG(),'الشكل <span class="ltr">(1-2)</span>: طرق دخول المواد الكيميائية (رسم مبسّط للشكل)','ص 12',380)},
    {title:'مختبر مصغّر: من أي طريق دخلت؟',widget:(el,B)=>DCML.sort(el,B,{intro:'المواقف أمثلة من عندنا، والطرق الأربع من الكتاب.',cats:['الاستنشاق','الامتصاص خلال الجلد والعينين','البلع','الحقن الخاطئ'],items:[
     ['عامل يدهن بالرش في غرفة بلا تهوية ولا كمامة.',0,'الرذاذ والأبخرة في هواء التنفس = استنشاق.'],
     ['عامل يأكل شطيرة في الورشة بيدين لم يغسلهما بعد العمل بالرصاص.',2,'المادة على اليد تنتقل إلى الطعام ثم الفم = بلع.'],
     ['تطاير مذيب على ذراع عامل وعينه.',1,'دخول المادة من الجلد والعين = امتصاص.'],
     ['وخز إصبع عامل بإبرة ملوثة أثناء تنظيف مختبر.',3,'دخول المادة عبر جرح بأداة حادة = حقن خاطئ.']]})}
   ]},

  {st:5,short:'أنواع الملوثات',title:'أنواع الملوثات الكيميائية بالهواء',ref:'ص 12',
   q:'هل كل ما يلوث الهواء غاز؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="تقسيم الملوثات الكيميائية بالهواء" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><rect x="110" y="44" width="140" height="40" rx="10" fill="#2C4A40"/><text x="180" y="70" text-anchor="middle" font-size="14" fill="#FBF6EE" font-weight="700">الملوثات بالهواء</text><path d="M180 84 V104 M110 104 H250 M110 104 V120 M250 104 V120" fill="none" stroke="#2C4A40" stroke-width="2.5"/><g data-tip="أ- مواد صلبة ⟦Particulate Matters⟧: أتربة، وأدخنة، ورذاذ، وألياف."><rect x="50" y="120" width="120" height="38" rx="10" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><text x="110" y="144" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">أ- مواد صلبة</text></g><g data-tip="ب- غازات وأبخرة ⟦Gases and Vapors⟧: موضوع آخر محطة في هذا الدرس."><rect x="190" y="120" width="120" height="38" rx="10" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><text x="250" y="144" text-anchor="middle" font-size="13" fill="#FBF6EE" font-weight="700">ب- غازات وأبخرة</text></g><path d="M110 158 V176 M64 176 H156 M64 176 V190 M95 176 V190 M126 176 V190 M156 176 V190" fill="none" stroke="#2C4A40" stroke-width="2"/><g data-tip="أتربة ⟦Dusts⟧"><circle cx="64" cy="204" r="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><circle cx="58" cy="200" r="3" fill="#2C4A40"/><circle cx="68" cy="206" r="4" fill="#2C4A40"/><circle cx="62" cy="211" r="2" fill="#2C4A40"/></g><g data-tip="أدخنة ⟦Fumes⟧"><circle cx="95" cy="204" r="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><path d="M91 214 q-6 -6 0 -10 q6 -4 0 -10 M99 214 q-6 -6 0 -10 q6 -4 0 -10" fill="none" stroke="#2C4A40" stroke-width="1.8"/></g><g data-tip="رذاذ ⟦Mists⟧"><circle cx="126" cy="204" r="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><path d="M120 198 q2 4 0 6 q-2 -2 0 -6 M130 202 q2 4 0 6 q-2 -2 0 -6 M124 208 q2 4 0 6 q-2 -2 0 -6" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1"/></g><g data-tip="ألياف ⟦Fibers⟧"><circle cx="156" cy="204" r="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><path d="M146 198 L166 204 M146 206 L166 210 M148 212 L164 198" stroke="#2C4A40" stroke-width="1.8"/></g><text x="64" y="236" text-anchor="middle" font-size="11" fill="#2C4A40">أتربة</text><text x="95" y="236" text-anchor="middle" font-size="11" fill="#2C4A40">أدخنة</text><text x="126" y="236" text-anchor="middle" font-size="11" fill="#2C4A40">رذاذ</text><text x="156" y="236" text-anchor="middle" font-size="11" fill="#2C4A40">ألياف</text><path d="M250 158 V190" stroke="#2C4A40" stroke-width="2"/><g data-tip="غازات وأبخرة: جزيئات منتشرة في الهواء، لا جسيمات."><circle cx="250" cy="204" r="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><path d="M244 214 q-5 -5 0 -10 q5 -5 0 -10 M256 214 q-5 -5 0 -10 q5 -5 0 -10" fill="none" stroke="#2C4A40" stroke-width="1.8" stroke-dasharray="3 2"/></g><text x="250" y="236" text-anchor="middle" font-size="11" fill="#2C4A40">غاز · بخار</text><text x="180" y="282" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">صلبة، أو غازات وأبخرة</text></svg>`,
   cap:'تقسيم الكتاب للملوثات الكيميائية بالهواء.<br><b>مرّر المؤشر على كل مربع ودائرة (أو المسها في الجوال) لتعرف اسمها.</b>',
   side:[
    {predict:{q:'الرذاذ قطرات سائلة. في أي قسم يضعه الكتاب؟',opts:[
     ['مع الغازات والأبخرة',false,'الرذاذ قطرات، لا غاز.'],
     ['مع المواد الصلبة (الجسيمات)',true,'الكتاب (ص 12) يضع الرذاذ ثالثاً تحت «أ- المواد الصلبة Particulate Matters».'],
     ['لا يذكره الكتاب',false,'يذكره في القسم (أ).']]}}
   ],
   body:[
    {book:`<p><b>أنواع الملوثات الكيميائية بالهواء:</b><br>أ- مواد صلبة Particulate Matters<br>ب- غازات وأبخرة Gases and Vapors</p>
     <p><b>أ- المواد الصلبة:</b></p><ol><li>أتربة Dusts</li><li>أدخنة Fumes</li><li>رذاذ Mists</li><li>ألياف Fibers</li></ol>`,ref:'ص 12'},
    {tip:`<p>كلمة <span class="ltr">Particulate</span> تعني «جسيمات»: قطع صغيرة جداً لها حجم، سواء كانت صلبة (أتربة، أدخنة، ألياف) أو قطرات سائلة (رذاذ). أما الغاز والبخار فجزيئات منتشرة في الهواء بلا جسيمات. لذلك وضع الكتاب الرذاذ مع الجسيمات.</p>`},
    {html:fig(rulerFig(),'الشكل <span class="ltr">(2-2)</span> يبين حجم الملوثات الكيميائية بالميكرون','ص 12',560)},
    {watch:`<p>تسمية الشكل <span class="ltr">(2-2)</span> في الكتاب «بالمايكرو»، والمقصود «بالميكرون» <span class="ltr">(μ)</span>: جزء من مليون من المتر، كما هو مكتوب أسفل الشكل.</p>`,fix:true},
    {title:'مختبر مصغّر: جسيمات أم غازات وأبخرة؟',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل ملوث: في أي قسم من قسمي الكتاب يقع؟',cats:['أ- مواد صلبة (جسيمات)','ب- غازات وأبخرة'],items:[
     ['غبار الطحن',0,'الأتربة أول المواد الصلبة.'],
     ['أدخنة اللحام',0,'الأدخنة جسيمات دقيقة جداً (ثاني المواد الصلبة).'],
     ['بخار مذيب يتصاعد من حوض',1,'البخار من القسم (ب).'],
     ['رذاذ الدهان',0,'الرذاذ قطرات، ووضعه الكتاب مع المواد الصلبة.'],
     ['غاز يتسرب من أسطوانة',1,'الغاز من القسم (ب).'],
     ['ألياف الأسبستوس',0,'الألياف رابع المواد الصلبة.']]})}
   ]},

  {st:6,short:'الأتربة',title:'١- الأتربة <bdi dir="ltr">Dusts</bdi>',ref:'ص 13',
   q:'غبار لا تراه العين… هل هو أخطر أم أقل خطراً من الغبار الذي تراه؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="حجم الأتربة وحد العشرة ميكرون" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBEBDD"/><g data-tip="الرئتان: الأتربة المستنشقة (أقل من ⟦10 μ⟧) قد تترسب في الحويصلات الهوائية داخلهما وتسبب السيليكوزيس."><path d="M180 50 V92" stroke="#2C4A40" stroke-width="5"/><path d="M180 92 c-8 0 -10 6 -18 10 M180 92 c8 0 10 6 18 10" fill="none" stroke="#2C4A40" stroke-width="4"/><path d="M162 98 c-34 6 -40 64 -18 72 c12 4 20 -8 20 -20 V106 z M198 98 c34 6 40 64 18 72 c-12 4 -20 -8 -20 -20 V106 z" fill="#F6C6BC" stroke="#2C4A40" stroke-width="2.5"/><circle cx="150" cy="150" r="3" fill="#2C4A40"/><circle cx="156" cy="140" r="2.5" fill="#2C4A40"/><circle cx="210" cy="146" r="3" fill="#2C4A40"/></g><g data-tip="مدى حجم الأتربة في الكتاب: من ⟦0.1⟧ ميكرون حتى ⟦25⟧ ميكرون."><path d="M50 230 H310" stroke="#2C4A40" stroke-width="3"/><path d="M50 222 v16 M310 222 v16" stroke="#2C4A40" stroke-width="3"/></g><g data-tip="الأتربة المستنشقة ⟦Respirable⟧: قطرها أقل من ⟦10⟧ ميكرون، وهي ضارة جداً بالصحة."><rect x="50" y="204" width="134" height="20" rx="4" fill="#F6C6BC" stroke="#C0392B" stroke-width="2"/><text x="117" y="219" text-anchor="middle" font-size="12" fill="#C0392B" font-weight="700">مستنشقة</text></g><g data-tip="الأتربة غير المستنشقة ⟦Non-Respirable⟧: قطرها ⟦10⟧ ميكرون أو أكثر."><rect x="184" y="204" width="126" height="20" rx="4" fill="#BFE3DC" stroke="#12855A" stroke-width="2"/><text x="247" y="219" text-anchor="middle" font-size="12" fill="#12855A" font-weight="700">غير مستنشقة</text></g><path d="M184 196 V240" stroke="#2C4A40" stroke-width="3"/><text x="50" y="256" text-anchor="middle" font-size="13" fill="#2C4A40" font-family="var(--mono)" direction="ltr">0.1 μ</text><text x="184" y="256" text-anchor="middle" font-size="13" fill="#2C4A40" font-family="var(--mono)" font-weight="700" direction="ltr">10 μ</text><text x="310" y="256" text-anchor="middle" font-size="13" fill="#2C4A40" font-family="var(--mono)" direction="ltr">25 μ</text><text x="180" y="288" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="600">الحد الفاصل عشرة ميكرون</text></svg>`,
   cap:'المسطرة تقسيم توضيحي لأرقام الكتاب (ليست بمقياس رسم).<br><b>مرّر المؤشر على الرئتين والشريطين والمسطرة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'غبار قطره أقل من <span class="ltr">10 μ</span>. ماذا يسمى؟',opts:[
     ['أتربة غير مستنشقة',false,'هذه للقطر <span class="ltr">10 μ</span> أو أكثر.'],
     ['أتربة مستنشقة Respirable',true,'الكتاب (ص 13): «الأتربة التى يبلغ قطرها أقل من ١٠ ميكرون تسمى الأتربة المستنشقة».'],
     ['أدخنة',false,'الأدخنة أصغر من <span class="ltr">1 μ</span> وتنتج من تكثف أبخرة المعادن، لا من الطحن.']]}}
   ],
   body:[
    {book:`<p>مواد صلبة تنتج من عمليات تفتيت وطحن المواد العضوية وغير العضوية (الشكل <span class="ltr">(3-2)</span>).<br>يتراوح حجم الأتربة من <span class="ltr">0.1</span> ميكرون حتى <span class="ltr">25</span> ميكرون.<br>الأتربة التي يبلغ قطرها <span class="ltr">10</span> ميكرون أو أكثر تسمى الأتربة غير المستنشقة Non – Respirable<br>أما الأتربة التي يبلغ قطرها أقل من <span class="ltr">10</span> ميكرون تسمى الأتربة المستنشقة Respirable وهي ضارة جداً بالصحة حيث من الممكن أن تترسب في الحويصلات الهوائية داخل الرئتين وتسبب السيليكوزيس.</p>`,ref:'ص 13'},
    {tip:`<p>المفاجأة هنا: الغبار <b>الأصغر</b> هو <b>الأخطر</b>. الحبيبات الكبيرة يوقفها الأنف والحلق، أما الصغيرة (أقل من <span class="ltr">10 μ</span>) فتصل إلى عمق الرئتين وتستقر في الحويصلات الهوائية. وللمقارنة: خلية الدم الحمراء <span class="ltr">7 μ</span> كما في الشكل <span class="ltr">(2-2)</span>.</p>`},
    {add:`<p>السيليكوزيس مرض يصيب الرئتين من استنشاق غبار السيليكا (الرمل والحجر والخرسانة) سنوات طويلة، فتتليف أنسجة الرئة ويضيق التنفس. يكثر عند عمال قطع الحجر والمحاجر وصناعة الزجاج والسفع الرملي.</p>`},
    {title:'مختبر مصغّر: حرّك قطر حبيبة الغبار',widget:(el,B)=>DCML.lab(el,B,{intro:'حرّك قطر الحبيبة (أرقام تختارها أنت) داخل مدى الأتربة في الكتاب، وانظر: هل تصل إلى الرئتين؟',
     predict:{q:'حبيبتان من الغبار نفسه: <span class="ltr">9 μ</span> و <span class="ltr">11 μ</span>. أيهما المستنشقة؟',opts:[
      ['حبيبة <span class="ltr">11 μ</span> لأنها أكبر',false,'الأكبر يوقفها الأنف والحلق غالباً؛ الحد في الكتاب «أقل من 10 ميكرون».'],
      ['حبيبة <span class="ltr">9 μ</span>',true,'قطرها أقل من <span class="ltr">10 μ</span>، فهي من الأتربة المستنشقة.'],
      ['الاثنتان لا تُستنشقان',false,'الأصغر من <span class="ltr">10 μ</span> مستنشقة.']]},
     ins:[{k:'d',l:'قطر الحبيبة',min:0.1,max:25,step:0.1,v:5,dp:1,u:'μ'}],
     calc:(s,P,B)=>{const d=s.d,r=d<10,x=30+(d-0.1)/(24.9)*240;
      const pic=`<svg viewBox="0 0 300 90" role="img" aria-label="موضع الحبيبة على مدى الأتربة" style="font-family:var(--font)"><rect x="0" y="0" width="100%" height="100%" rx="12" fill="#F3E8D8"/><rect x="30" y="30" width="96.4" height="20" fill="#F6C6BC" stroke="#C0392B"/><rect x="126.4" y="30" width="143.6" height="20" fill="#BFE3DC" stroke="#12855A"/><path d="M126.4 22 V58" stroke="#2C4A40" stroke-width="2.5"/><text x="30" y="74" text-anchor="middle" font-size="11" font-family="var(--mono)" fill="#2C4A40" direction="ltr">0.1</text><text x="126.4" y="74" text-anchor="middle" font-size="12" font-family="var(--mono)" font-weight="700" fill="#2C4A40" direction="ltr">10 μ</text><text x="270" y="74" text-anchor="middle" font-size="11" font-family="var(--mono)" fill="#2C4A40" direction="ltr">25</text><path d="M${x.toFixed(1)} 8 V54" stroke="#2C4A40" stroke-width="2"/><circle cx="${x.toFixed(1)}" cy="40" r="${(3+d/3).toFixed(1)}" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/></svg>`;
      return {pic,facts:[['القطر',B.fmtN(d,1)+' μ','hi'],['التسمية',r?'Respirable':'Non-Respirable',r?'bad':'']],
       msg:r?'<b>أتربة مستنشقة:</b> قطرها أقل من <span class="ltr">10 μ</span>، فقد تترسب في الحويصلات الهوائية داخل الرئتين وتسبب السيليكوزيس.':'<b>أتربة غير مستنشقة:</b> قطرها <span class="ltr">10 μ</span> أو أكثر.',cls:r?'bad':''}}})}
   ]},

  {st:7,short:'الأدخنة',title:'٢- الأدخنة <bdi dir="ltr">Fumes</bdi>',ref:'ص 13',
   q:'اللحام يصهر المعدن… فإلى أين يذهب المعدن الذي «تبخّر»؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="تكوّن أدخنة اللحام" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E3ECF7"/><g data-tip="قطعة معدن تُلحم: ينصهر المعدن في نقطة اللحام."><rect x="70" y="214" width="220" height="24" fill="#9AA5A0" stroke="#2C4A40" stroke-width="2.5"/></g><g data-tip="القوس الكهربائي أو اللهب: حرارته تصهر المعدن وتبخّر جزءاً منه."><path d="M180 214 L172 196 L186 200 L178 182" fill="none" stroke="#F2C14E" stroke-width="4" stroke-linejoin="round"/><circle cx="180" cy="214" r="8" fill="#F2C14E"/></g><g data-tip="مسك اللحام (الإلكترود)."><path d="M178 182 L230 120" stroke="#2C4A40" stroke-width="6" stroke-linecap="round"/><rect x="226" y="96" width="22" height="34" rx="4" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5" transform="rotate(40 237 113)"/></g><g data-tip="الأدخنة: بخار المعدن يبرد فيتكثف إلى جسيمات صلبة دقيقة جداً، قطرها أقل من ⟦1⟧ ميكرون."><path d="M168 190 q-14 -16 0 -30 q14 -14 0 -30 M152 196 q-16 -18 -4 -34 q12 -16 -2 -34" fill="none" stroke="#2C4A40" stroke-width="2.2"/><circle cx="140" cy="110" r="2" fill="#2C4A40"/><circle cx="152" cy="100" r="2" fill="#2C4A40"/><circle cx="166" cy="96" r="2" fill="#2C4A40"/><circle cx="130" cy="96" r="2" fill="#2C4A40"/><circle cx="146" cy="86" r="2" fill="#2C4A40"/><circle cx="160" cy="80" r="2" fill="#2C4A40"/><circle cx="136" cy="76" r="2" fill="#2C4A40"/></g><text x="96" y="70" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="rtl">أقل من <tspan direction="ltr" unicode-bidi="embed" font-family="var(--mono)">1 μ</tspan></text><text x="180" y="270" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">صهر ← تبخر ← تكثف</text></svg>`,
   cap:'الأدخنة جسيمات صلبة دقيقة تتكوّن من تكثف بخار المعدن.<br><b>مرّر المؤشر على المعدن والقوس والمسك والدخان (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'قطر جسيمات الأدخنة حسب الكتاب…',opts:[
     ['أقل من <span class="ltr">1 μ</span>',true,'الكتاب (ص 13): «دقيقة جداً ويبلغ قطرها أقل من ١ ميكرون».'],
     ['من <span class="ltr">10</span> إلى <span class="ltr">25 μ</span>',false,'هذا جزء من مدى الأتربة غير المستنشقة.'],
     ['أكبر من <span class="ltr">100 μ</span>',false,'هذا حجم يُرى بالعين في الشكل <span class="ltr">(2-2)</span>، والأدخنة لا تُرى حبيباتها.']]}}
   ],
   body:[
    {book:`<ol><li>تتكون نتيجة تعرض المواد الناتجة من تبخر المواد الصلبة للتكثيف (الشكل <span class="ltr">(4-2)</span>).</li><li>دقيقة جداً ويبلغ قطرها أقل من <span class="ltr">1</span> ميكرون.</li><li>لا تعتبر الأبخرة والغازات من هذا النوع من الأدخنة</li><li>تنتج من عمليات اللحام نتيجة لانصهار المعادن</li></ol>`,ref:'ص 13'},
    {tip:`<p>كلمة «دخان» في حياتنا تعني أشياء كثيرة، لكن «الأدخنة <span class="ltr">Fumes</span>» في الصحة المهنية معناها محدد: <b>جسيمات صلبة</b> تكونت من بخار مادة صلبة (معدن غالباً) ثم بردت وتكثفت. لذلك يقول الكتاب إن الأبخرة والغازات ليست من هذا النوع.</p>`},
    {title:'مختبر مصغّر: صح أم خطأ؟',widget:(el,B)=>DCML.tf(el,B,{items:[
     ['الأدخنة تنتج من عمليات اللحام نتيجة لانصهار المعادن.',true,'البند ٤ في الكتاب.'],
     ['بخار البنزين المتصاعد من وعاء مفتوح يُعدّ من الأدخنة.',false,'«لا تعتبر الأبخرة والغازات من هذا النوع من الأدخنة».'],
     ['جسيمات الأدخنة أكبر من جسيمات الأتربة المستنشقة.',false,'الأدخنة أقل من <span class="ltr">1 μ</span>، فهي أصغر من معظم الأتربة.'],
     ['تتكون الأدخنة من تكثف ما تبخر من المواد الصلبة.',true,'البند ١ في الكتاب.']]})}
   ]},

  {st:8,short:'الرذاذ',title:'٣- الرذاذ <bdi dir="ltr">Mists</bdi>',ref:'ص 14',
   q:'مسدس رش الدهان لا يُخرج غازاً… فماذا يُخرج إلى الهواء؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="رذاذ من مسدس رش الدهان" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="مسدس رش الدهان: من أمثلة الكتاب على مصادر الرذاذ."><rect x="70" y="126" width="74" height="26" rx="6" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><path d="M144 132 h22 v14 h-22" fill="#2C4A40"/><path d="M96 152 L88 196 H110 L114 152" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round"/><rect x="96" y="158" width="32" height="40" rx="4" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/></g><g data-tip="الرذاذ: قطرات من السوائل العالقة بالجو."><g fill="#F2C14E" stroke="#2C4A40" stroke-width="1"><circle cx="190" cy="120" r="4"/><circle cx="206" cy="134" r="3.5"/><circle cx="220" cy="118" r="4"/><circle cx="236" cy="142" r="3"/><circle cx="246" cy="124" r="4"/><circle cx="198" cy="148" r="3"/><circle cx="262" cy="110" r="3.5"/><circle cx="266" cy="148" r="3"/><circle cx="280" cy="128" r="4"/><circle cx="226" cy="100" r="3"/><circle cx="254" cy="96" r="3"/><circle cx="292" cy="146" r="3"/></g></g><g data-tip="حوض طلاء كهربائي: يتصاعد منه رذاذ الأحماض، من أمثلة الكتاب."><rect x="190" y="208" width="100" height="44" fill="#BFE3DC" stroke="#2C4A40" stroke-width="2.5"/><path d="M190 218 h100" stroke="#4FB3A9" stroke-width="3"/><g fill="#4FB3A9"><circle cx="210" cy="196" r="3"/><circle cx="234" cy="188" r="3"/><circle cx="256" cy="198" r="3"/><circle cx="276" cy="186" r="3"/></g></g><text x="104" y="226" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">رش الدهان</text><text x="240" y="272" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">الطلاء الكهربائي</text><text x="150" y="290" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="600">قطرات سائلة عالقة</text></svg>`,
   cap:'مثالا الكتاب على الرذاذ.<br><b>مرّر المؤشر على المسدس والقطرات والحوض (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'الرذاذ هو…',opts:[
     ['جسيمات صلبة من الطحن',false,'هذه الأتربة.'],
     ['قطرات من السوائل العالقة بالجو',true,'الكتاب (ص 14): «هي عبارة عن قطرات من السوائل العالقة بالجو».'],
     ['غاز في درجة حرارة الغرفة',false,'هذا وصف الغازات.']]}}
   ],
   body:[
    {book:`<p>هي عبارة عن قطرات من السوائل العالقة بالجو وتنتج من تكثيف الأبخرة الناتجة من السوائل ومن أمثلتها رذاذ الأحماض في عمليات الطلاء الكهربائي وعمليات رش الدهان (الشكل <span class="ltr">(5-2)</span>).</p>`,ref:'ص 14'},
    {tip:`<p>قارن بالأدخنة: الأدخنة من تكثف بخار <b>مادة صلبة</b> فتصير جسيمات صلبة، والرذاذ من تكثف بخار <b>سائل</b> فيصير قطرات سائلة. كلاهما «تكثيف»، والفرق في المادة الأصلية.</p>`},
    {html:fig(threeSVG(),'الأتربة، والأدخنة، والرذاذ من مسدس رش الدهان — الأشكال <span class="ltr">(3-2)</span> و<span class="ltr">(4-2)</span> و<span class="ltr">(5-2)</span> (رسوم مبسّطة)','ص 13–14',540)},
    {title:'مختبر مصغّر: أتربة أم أدخنة أم رذاذ؟',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل مصدر: ما نوع الجسيمات التي تنتج منه؟',cats:['أتربة','أدخنة','رذاذ'],items:[
     ['رش الدهان بالمسدس.',2,'من أمثلة الكتاب على الرذاذ.'],
     ['لحام قطع الحديد.',1,'الأدخنة تنتج من عمليات اللحام نتيجة لانصهار المعادن.'],
     ['طحن الحجارة.',0,'الأتربة تنتج من عمليات تفتيت وطحن المواد.'],
     ['قطرات حمض فوق حوض طلاء كهربائي.',2,'«رذاذ الأحماض في عمليات الطلاء الكهربائي».']]})}
   ]},

  {st:9,short:'الألياف',title:'٤- الألياف <bdi dir="ltr">Fibers</bdi>',ref:'ص 14',
   q:'ما الذي يميز الليف عن حبيبة الغبار؟ الحجم… أم الشكل؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الليف طوله أضعاف قطره" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBEBDD"/><g data-tip="حبيبة غبار: طولها وعرضها متقاربان تقريباً."><circle cx="96" cy="140" r="18" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/></g><text x="96" y="186" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">حبيبة</text><g data-tip="ليف: مادة صلبة طولها يبلغ عدة مرات أكثر من قطرها."><rect x="150" y="132" width="160" height="14" rx="7" fill="#9AA5A0" stroke="#2C4A40" stroke-width="2.5"/></g><g data-tip="الطول: أضعاف القطر."><path d="M150 166 H310 M150 160 v12 M310 160 v12" stroke="#2C4A40" stroke-width="2"/><text x="230" y="186" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">الطول</text></g><g data-tip="القطر: صغير جداً مقارنة بالطول."><path d="M318 132 V146 M314 132 h8 M314 146 h8" stroke="#2C4A40" stroke-width="2"/><text x="326" y="122" text-anchor="middle" font-size="11" fill="#2C4A40">القطر</text></g><g data-tip="أمثلة الكتاب: ألياف الأسبستوس والفايبرجلاس."><path d="M120 222 L240 236 M128 240 L236 220 M140 214 L224 248 M118 232 L246 228" stroke="#9AA5A0" stroke-width="3" stroke-linecap="round"/></g><text x="180" y="276" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">أسبستوس · فايبرجلاس</text></svg>`,
   cap:'الفرق بين الحبيبة والليف في الشكل.<br><b>مرّر المؤشر على الحبيبة والليف والبعدين (أو المسها في الجوال) لتعرف الفرق.</b>',
   side:[
    {predict:{q:'أي هذه من أمثلة الكتاب على الألياف؟',opts:[
     ['الدقيق',false,'الدقيق غبار (حبيبات)، يأتي في تصنيف المناطق الخطرة.'],
     ['الأسبستوس والفايبرجلاس',true,'الكتاب (ص 14): «ومن أمثلتها ألياف الأسبستوس والفايبرجلاس».'],
     ['أدخنة اللحام',false,'الأدخنة جسيمات دقيقة جداً، لا ألياف.']]}}
   ],
   body:[
    {book:`<p>مواد صلبة طولها يبلغ عدة مرات أكثر من قطرها ومن أمثلتها ألياف الأسبستوس والفايبرجلاس.</p>`,ref:'ص 14'},
    {watch:`<p>في فقرة الألياف (ص 14) يحيل الكتاب إلى «الشكل ٦-٢»، وهذا الشكل للغازات والأبخرة؛ ولا يوجد في الكتاب شكل للألياف، فحذفنا الإحالة.</p>`,fix:true},
    {add:`<p>الأسبستوس كان يُستعمل كثيراً في العوازل الحرارية وأسقف المباني القديمة، ثم مُنع في دول كثيرة لأن استنشاق أليافه يسبب أمراضاً خطيرة في الرئة. لذلك لا يُكسر ولا يُقص عزل قديم مجهول النوع دون فحص ووقاية مناسبة.</p>`},
    {title:'مختبر مصغّر: صح أم خطأ؟',widget:(el,B)=>DCML.tf(el,B,{items:[
     ['الألياف من المواد الصلبة في تقسيم الكتاب.',true,'هي الرابعة تحت «أ- المواد الصلبة».'],
     ['الليف قطره أكبر من طوله.',false,'العكس: «طولها يبلغ عدة مرات أكثر من قطرها».'],
     ['الفايبرجلاس من أمثلة الكتاب على الألياف.',true,'«ألياف الأسبستوس والفايبرجلاس».']]})}
   ]},

  {st:10,short:'الغازات والأبخرة',title:'ب- الغازات والأبخرة <bdi dir="ltr">Gases and Vapors</bdi>',ref:'ص 14',
   q:'البنزين في الوعاء سائل، والأكسجين في الأسطوانة غاز… فما الفرق بين ما يتصاعد من كل منهما؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الأبخرة من سائل والغازات من أسطوانة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E3ECF7"/><g data-tip="حوض غمس فيه مذيب ⟦Solvent Dip Tank⟧: المادة سائلة في درجة حرارة الغرفة، ويتصاعد منها بخار يسمى الأبخرة ⟦Vapors⟧."><rect x="52" y="178" width="110" height="52" fill="#BFE3DC" stroke="#2C4A40" stroke-width="2.5"/><path d="M52 190 h110" stroke="#4FB3A9" stroke-width="3"/><path d="M80 170 q-8 -12 0 -24 q8 -12 0 -24 M106 170 q-8 -12 0 -24 q8 -12 0 -24 M132 170 q-8 -12 0 -24 q8 -12 0 -24" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-dasharray="5 4"/></g><g data-tip="أسطوانة غاز ⟦Gas Cylinder⟧: المادة غاز في درجة حرارة الغرفة، وما يتسرب منها يسمى الغازات ⟦Gases⟧."><rect x="232" y="110" width="50" height="120" rx="20" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><rect x="248" y="94" width="18" height="18" fill="#2C4A40"/><circle cx="280" cy="98" r="9" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><path d="M258 90 q-12 -16 4 -26 q14 -10 -2 -24" fill="none" stroke="#C0392B" stroke-width="2.2" stroke-dasharray="5 4"/></g><text x="107" y="252" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">أبخرة</text><text x="107" y="270" text-anchor="middle" font-size="11" fill="#2C4A40">من سائل</text><text x="257" y="252" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">غازات</text><text x="257" y="270" text-anchor="middle" font-size="11" fill="#2C4A40">غاز أصلاً</text><text x="180" y="298" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="600">في درجة حرارة الغرفة</text></svg>`,
   cap:'الفرق في حالة المادة في درجة حرارة الغرفة (من الشكل <span class="ltr">(6-2)</span>).<br><b>مرّر المؤشر على الحوض والأسطوانة (أو المسهما في الجوال) لتعرف الفرق.</b>',
   side:[
    {predict:{q:'مذيب سائل في حوض مفتوح، وتتصاعد منه رائحة. ماذا نسمي ما يتصاعد؟',opts:[
     ['غازات',false,'الغاز في الشكل <span class="ltr">(6-2)</span> مادة غازية أصلاً في درجة حرارة الغرفة (أسطوانة الغاز).'],
     ['أبخرة Vapors',true,'في الشكل <span class="ltr">(6-2)</span>: حوض غمس المذيب، والمادة سائلة في درجة حرارة الغرفة، وما يتصاعد منها أبخرة.'],
     ['أدخنة',false,'الأدخنة جسيمات صلبة من تكثف أبخرة المواد الصلبة.']]}}
   ],
   body:[
    {book:`<p>يبين الشكل <span class="ltr">(6-2)</span> طبيعة الغازات والأبخرة في الحالة الطبيعية تحت تأثير درجة حرارة الغرفة الطبيعية</p>`,ref:'ص 14'},
    {tip:`<p>الكتاب يشرح الفرق بالشكل <span class="ltr">(6-2)</span>: <b>الأبخرة</b> <span class="ltr">Vapors</span> تتصاعد من مادة <b>سائلة</b> في درجة حرارة الغرفة (مثل حوض غمس المذيبات)، و<b>الغازات</b> <span class="ltr">Gases</span> مادة <b>غازية</b> في درجة حرارة الغرفة (مثل أسطوانة الغاز).</p>`},
    {html:fig(gasVapSVG(),'الشكل <span class="ltr">(6-2)</span>: الغازات والأبخرة (رسم مبسّط)','ص 14',440)},
    {title:'مختبر مصغّر: أبخرة أم غازات؟',widget:(el,B)=>DCML.sort(el,B,{intro:'المواد أمثلة من عندنا. اسأل نفسك: ما حالة المادة في درجة حرارة الغرفة؟',cats:['أبخرة (من سائل)','غازات (غاز أصلاً)'],items:[
     ['رائحة البنزين من خزان سيارة مفتوح.',0,'البنزين سائل في درجة حرارة الغرفة، فما يتصاعد منه أبخرة.'],
     ['تسرب من أسطوانة أكسجين.',1,'الأكسجين غاز في درجة حرارة الغرفة.'],
     ['تنر الدهان في علبة مفتوحة.',0,'التنر سائل، فما يتصاعد منه أبخرة.'],
     ['تسرب من أسطوانة أستيلين في ورشة لحام.',1,'الأستيلين غاز في درجة حرارة الغرفة.']]})}
   ]},

  {recap:[
   'الصحة المهنية: التعرف والتقييم والسيطرة على ظروف العمل التي قد تؤدي إلى إصابة العاملين (ص 11).',
   'مخاطر العمل أربع مجموعات: كيميائية وطبيعية وبيولوجية وهندسية؛ والخطورة الكيميائية تعتمد على التركيز ومدة التعرض (ص 11).',
   'تدخل المواد الكيميائية بالاستنشاق (الأسرع) والامتصاص خلال الجلد والعينين والبلع والحقن الخاطئ (ص 12).',
   'الملوثات: مواد صلبة (أتربة <span class="ltr">0.1–25 μ</span>، المستنشقة منها أقل من <span class="ltr">10 μ</span>؛ أدخنة أقل من <span class="ltr">1 μ</span>؛ رذاذ؛ ألياف) وغازات وأبخرة (ص 12–14).']}
],
 theory:[
  {h:'الهدف العام والأهداف التفصيلية للوحدة الثانية',ref:'ص 10',html:`<p><b>الهدف العام للوحدة:</b> الإنجازات الأساسية لمعرفة القواعد للصحة المهنية والأخطار الناتجة عن بعض الملوثات.</p>
   <p><b>الأهداف التفصيلية:</b></p><ol><li>أن يتعرف المتدرب على أنواع المخاطر البيئية أثناء العمل.</li><li>أن يعرف المتدرب نسب وزمن التعرض للملوثات البيئية المسموح بها في بيئة العمل.</li><li>أن يعرف المتدرب أنواع المخاطر الطبيعية.</li><li>أن يقيم المتدرب المخاطر في بيئة العمل ودرجة خطورتها.</li><li>أن يتعرف المتدرب على هرم السيطرة على المخاطر البيئية والطبيعية.</li><li>أن يتعرف المتدرب على تصنيف المناطق الخطرة.</li><li>أن يتعرف المتدرب على نوعية الأجهزة الكهربائية المستخدمة في الأماكن الخطرة.</li></ol>`},
  {h:'٢-١ مقدمة: الصحة المهنية Industrial Hygiene',ref:'ص 11',html:`<p>الصحة المهنية هي العلم الذي يتعلق <b>بالتعرف والتقييم والسيطرة</b> على ظروف العمل المختلفة التي قد تؤدي إلى إصابة العاملين وتعرض صحتهم للخطر.</p><p>ويستخدم أخصائي الصحة المهنية القياسات البيئية والطرق التحليلية لتحديد مدى تعرض العاملين لمخاطر العمل، ومن ثم يقومون باستخدام طرق السيطرة المختلفة للسيطرة على هذه المخاطر ومنع تعرض العاملين لمخاطرها.</p>`},
  {h:'٢-٢ التعرف Recognition',ref:'ص 11',html:`<p>معرفة وفهم أنواع المخاطر المختلفة في بيئة العمل وتأثير هذه المخاطر على صحة العاملين. ويتم تقسيم مخاطر العمل إلى أربع مجموعات هي:</p><ol><li>المخاطر الكيميائية</li><li>المخاطر الطبيعية</li><li>المخاطر البيولوجية</li><li>المخاطر الهندسية</li></ol>`},
  {h:'٢-٢-١ المخاطر الكيميائية',ref:'ص 11–12',html:`<p>معظم المخاطر الصحية تنتج من استنشاق مواد كيميائية على شكل أبخرة، غازات، أتربة، أدخنة، رذاذ، أو من ملامسة الجلد لهذه المواد (كما هو مبين في الشكل (1-2)). كما تعتمد درجة الخطورة للتعرض للمواد الكيميائية على <b>درجة تركيز المادة، ومدة التعرض لها</b>. وتدخل المواد الكيميائية لجسم الإنسان عن طريق أربع طرق هي:</p>
   <ul><li>الاستنشاق ${lt('Inhalation')}</li><li>الامتصاص خلال الجلد والعينين ${lt('Absorption')}</li><li>البلع ${lt('Ingestion')}</li><li>الحقن الخاطئ ${lt('Accidental Injection')}</li></ul>
   <p>ويعتبر <b>الاستنشاق</b> هو أسرع طريق لدخول المواد الكيميائية الضارة إلى جسم الإنسان.</p>`},
  {fig:'(1-2)',ref:'ص 12',caption:'طرق دخول المواد الكيميائية (رسم مبسّط للشكل)',draw:()=>`<div class="svgbox" style="max-width:420px;margin-inline:auto">${routesSVG()}</div>`},
  {h:'أنواع الملوثات الكيميائية بالهواء',ref:'ص 12',html:`<p>أ- مواد صلبة ${lt('Particulate Matters')}: (1) أتربة ${lt('Dusts')}، (2) أدخنة ${lt('Fumes')}، (3) رذاذ ${lt('Mists')}، (4) ألياف ${lt('Fibers')}.<br>ب- غازات وأبخرة ${lt('Gases and Vapors')}.</p>`},
  {fig:'(2-2)',ref:'ص 12',caption:'يبين حجم الملوثات الكيميائية بالميكرون',draw:()=>`<div class="svgbox" style="max-width:560px;margin-inline:auto">${rulerFig()}</div>`},
  {h:'١- الأتربة',ref:'ص 13',html:`<p>مواد صلبة تنتج من عمليات تفتيت وطحن المواد العضوية وغير العضوية (الشكل (3-2)). يتراوح حجم الأتربة من ${lt('0.1')} ميكرون حتى ${lt('25')} ميكرون.</p><ul><li>الأتربة التي يبلغ قطرها ${lt('10')} ميكرون أو أكثر تسمى <b>الأتربة غير المستنشقة</b> ${lt('Non-Respirable')}.</li><li>أما الأتربة التي يبلغ قطرها أقل من ${lt('10')} ميكرون تسمى <b>الأتربة المستنشقة</b> ${lt('Respirable')} وهي ضارة جداً بالصحة حيث من الممكن أن تترسب في الحويصلات الهوائية داخل الرئتين وتسبب <b>السيليكوزيس</b>.</li></ul>`},
  {h:'٢- الأدخنة',ref:'ص 13',html:`<ol><li>تتكون نتيجة تعرض المواد الناتجة من تبخر المواد الصلبة للتكثيف (الشكل (4-2)).</li><li>دقيقة جداً ويبلغ قطرها أقل من ${lt('1')} ميكرون.</li><li>لا تعتبر الأبخرة والغازات من هذا النوع من الأدخنة.</li><li>تنتج من عمليات اللحام نتيجة لانصهار المعادن.</li></ol>`},
  {h:'٣- الرذاذ',ref:'ص 14',html:`<p>هي عبارة عن قطرات من السوائل العالقة بالجو وتنتج من تكثيف الأبخرة الناتجة من السوائل، ومن أمثلتها رذاذ الأحماض في عمليات الطلاء الكهربائي وعمليات رش الدهان (الشكل (5-2)).</p>`},
  {fig:'(3-2) و (4-2) و (5-2)',ref:'ص 13–14',caption:'الأتربة، والأدخنة، والرذاذ من مسدس رش الدهان (رسوم مبسّطة)',draw:()=>`<div class="svgbox" style="max-width:540px;margin-inline:auto">${threeSVG()}</div>`},
  {h:'٤- الألياف',ref:'ص 14',html:`<p>مواد صلبة طولها يبلغ عدة مرات أكثر من قطرها، ومن أمثلتها ألياف الأسبستوس والفايبرجلاس.</p>`},
  {h:'ب- الغازات والأبخرة',ref:'ص 14',html:`<p>يبين الشكل (6-2) طبيعة الغازات والأبخرة في الحالة الطبيعية تحت تأثير درجة حرارة الغرفة الطبيعية: <b>الأبخرة</b> تتصاعد من مادة سائلة في درجة حرارة الغرفة (مثل حوض غمس المذيبات)، و<b>الغازات</b> مادة غازية في درجة حرارة الغرفة (مثل أسطوانة الغاز).</p>`},
  {fig:'(6-2)',ref:'ص 14',caption:'الغازات والأبخرة (رسم مبسّط)',draw:()=>`<div class="svgbox" style="max-width:440px;margin-inline:auto">${gasVapSVG()}</div>`},
  {err:'<span class="fixnote">في فقرة الألياف (ص 14) يحيل الكتاب إلى «الشكل ٦-٢»، وهذا الشكل للغازات والأبخرة؛ ولا يوجد في الكتاب شكل للألياف، فحذفنا الإحالة. وتسمية الشكل (2-2) «بالمايكرو»، والمقصود «بالميكرون».</span>'}
 ],
 lab:(el)=>lab21(el),
 quiz:[
  {q:'أسرع طريق لدخول المواد الكيميائية الضارة إلى جسم الإنسان:',o:['البلع','الاستنشاق','الامتصاص خلال الجلد','الحقن الخاطئ'],c:1,e:'«ويعتبر الاستنشاق هو أسرع طريق» (ص 12).'},
  {q:'تعتمد درجة خطورة التعرض للمواد الكيميائية على:',o:['تركيز المادة فقط','مدة التعرض فقط','تركيز المادة ومدة التعرض لها','لون المادة'],c:2,e:'(ص 11–12).'},
  {q:'الأتربة التي قطرها أقل من 10 ميكرون تسمى:',o:['غير المستنشقة','المستنشقة، وقد تسبب السيليكوزيس','أدخنة','ألياف'],c:1,e:'(ص 13).'},
  {q:'الأدخنة الناتجة من اللحام قطرها:',o:['أقل من 1 ميكرون','من 10 إلى 25 ميكرون','أكثر من 100 ميكرون','مثل خلية الدم الحمراء'],c:0,e:'«دقيقة جداً ويبلغ قطرها أقل من 1 ميكرون» (ص 13).'},
  {q:'قطرات سوائل عالقة بالجو تنتج من تكثيف أبخرة السوائل، مثل رش الدهان:',o:['الأتربة','الألياف','الرذاذ','الغازات'],c:2,e:'(ص 14).'},
  {q:'مخاطر العمل تقسم إلى أربع مجموعات هي:',o:['كيميائية وطبيعية وبيولوجية وهندسية','كهربائية وميكانيكية فقط','حريق وانفجار وتسمم وضوضاء','إدارية وفنية ومالية وقانونية'],c:0,e:'(ص 11).'}
 ]
});

/* =====================================================================
   u2-l2 — حدود التعرض ومتوسط التركيز (ص 15–16)
   ===================================================================== */
function limitsFig(){let s=`<svg viewBox="0 0 460 250" role="img" aria-label="ثلاثة أنواع من حدود التعرض">`;
 const X=t=>70+t*45,Y=k=>200-k*160;
 s+=`<path d="M70 30V200H${X(8)+10}" style="fill:none;stroke:var(--fg);stroke-width:2.4"/>`;
 [[1,'C',''],[0.85,'STEL','10 5'],[0.55,'TWA','5 4']].forEach(([k,l,da])=>{s+=`<path d="M70 ${Y(k)}H${X(8)}" style="stroke:var(--fg);stroke-width:1.6;${da?'stroke-dasharray:'+da:''}"/><text class="txt" x="64" y="${Y(k)+4}" text-anchor="end">${l}</text>`});
 const pts=[[0,.15],[1.2,.75],[1.5,.72],[2.5,.38],[3.6,.55],[4,.5],[5,.78],[6.3,.17],[7.4,.55]];
 s+=`<path d="${pts.map((p,i)=>(i?'L':'M')+X(p[0]).toFixed(1)+' '+Y(p[1]).toFixed(1)).join('')}" style="fill:none;stroke:var(--blue);stroke-width:3;stroke-linejoin:round"/>`;
 s+=`<text class="txt" x="${X(0)}" y="216" text-anchor="middle">0</text><text class="txt" x="${X(4)}" y="216" text-anchor="middle">4 hrs.</text><text class="txt" x="${X(8)}" y="216" text-anchor="middle">8 hrs.</text><text class="txt m" x="${X(4)}" y="232" text-anchor="middle">Time</text>`;
 s+=`<text class="txt m" x="20" y="120" text-anchor="middle" transform="rotate(-90 20 120)">Airborne concentration</text><text class="txt" x="${X(4)}" y="248" text-anchor="middle">THREE TYPES OF EXPOSURE LIMIT</text>`;
 return s+'</svg>'}
const PRESETS={ex:{n:'مثال ص 16',rows:[[2,150],[2,75],[4,50]]},q6:{n:'السؤال السادس ص 23',rows:[[2,100],[2,150],[4,50]]}};
function twaSVG(rows,lim,stel,ceil,avg){
 const tot=rows.reduce((a,r)=>a+r[0],0),mx=Math.max(ceil,stel,lim,...rows.map(r=>r[1]),avg)*1.12||1;
 const L=56,R=16,T=20,Bt=40,Wd=560,H=270,X=t=>L+t/8*(Wd-L-R),Y=c=>H-Bt-c/mx*(H-T-Bt);
 let s=`<svg viewBox="0 0 ${Wd} ${H}" role="img" aria-label="التركيز على مدى 8 ساعات">`;
 for(let t=0;t<=8;t++)s+=`<path d="M${X(t)} ${T}V${H-Bt}" style="stroke:var(--line)"/><text class="txt m" x="${X(t)}" y="${H-Bt+15}" text-anchor="middle">${t}</text>`;
 s+=svT((L+Wd)/2,H-6,'الزمن (ساعة)',{st:'font-size:12px'});
 const yt=[0,mx/4,mx/2,3*mx/4].map(v=>Math.round(v/10)*10);yt.forEach(v=>{s+=`<text class="txt m" x="${L-6}" y="${Y(v)+4}" text-anchor="end">${v}</text>`});
 s+=`<text class="txt m" x="${L-6}" y="${T-6}" text-anchor="end">ppm</text>`;
 let t=0;rows.forEach((r,i)=>{if(t>=8)return;const t1=Math.min(8,t+r[0]),c=r[1],col=c>ceil?'--stop':c>stel?'--live':'--blue';
  s+=`<rect x="${X(t)}" y="${Y(c)}" width="${Math.max(0,X(t1)-X(t))}" height="${Y(0)-Y(c)}" style="fill:var(${col}-soft);stroke:var(${col});stroke-width:2"/>`;
  if(X(t1)-X(t)>30)s+=`<text class="txt" x="${(X(t)+X(t1))/2}" y="${Math.min(Y(c)+16,Y(0)-4)}" text-anchor="middle" style="font-size:11px">${fm(c,1)}×${fm(r[0],2)}</text>`;t=t1});
 if(tot<8)s+=`<rect x="${X(tot)}" y="${T}" width="${X(8)-X(tot)}" height="${Y(0)-T}" style="fill:var(--surface-2);opacity:.6"/>`+svT((X(tot)+X(8))/2,T+16,'بلا قياس = صفر',{st:'font-size:11px;fill:var(--muted)'});
 const line=(v,col,da,lab)=>`<path d="M${L} ${Y(v)}H${Wd-R}" style="stroke:var(${col});stroke-width:2;stroke-dasharray:${da}"/><text class="txt" x="${Wd-R-2}" y="${Y(v)-4}" text-anchor="end" style="fill:var(${col})">${lab}</text>`;
 s+=line(ceil,'--stop','2 0','C '+fm(ceil,0))+line(stel,'--live','10 5','STEL '+fm(stel,0))+line(lim,'--fg','5 4','PEL-TWA '+fm(lim,0));
 s+=`<path d="M${L} ${Y(avg)}H${Wd-R}" style="stroke:var(--on);stroke-width:3"/><text class="txt" x="${L+6}" y="${Y(avg)-5}" style="fill:var(--on)">TWA = ${fm(avg,2)}</text>`;
 s+=`<path d="M${L} ${T}V${H-Bt}H${Wd-R}" style="fill:none;stroke:var(--fg);stroke-width:1.6"/>`;
 return s+'</svg>'}
function lab22(el){
 let rows=PRESETS.ex.rows.map(r=>r.slice()),lim=100;const W={};
 el.innerHTML=`<div id="tptwa"></div><div class="grid sf-lab">
  <div class="panel c12"><h2>حاسبة متوسط التركيز خلال 8 ساعات <small>مبنية على قانون ص 16 والشكل (7-2) ص 15</small></h2>
   <p class="sub">اكتب فترات القياس (المدة والتركيز). يُضرب كل تركيز في مدته، ثم يُقسم المجموع على 8. الخط الأخضر = المتوسط.</p>
   <div class="sf-row"><span class="sub">نماذج من الكتاب:</span>${Object.entries(PRESETS).map(([k,p])=>`<button class="sf-b" data-p="${k}">${p.n}</button>`).join('')}</div>
   <div class="svgbox" id="cv"></div>
   <div class="grid" style="margin-top:6px"><div class="c7"><div class="tablebox"><table class="tt" id="tb"></table></div>
    <div class="sf-row"><button class="sf-b" id="add">+ فترة</button><button class="sf-b" id="rm">− آخر فترة</button></div>
    <label class="sf-sl"><span class="h"><span>التركيز المسموح خلال 8 ساعات PEL-TWA</span><b id="lV"></b></span><input type="range" id="lR" min="10" max="500" step="5" value="${lim}"></label></div>
    <div class="c5"><div id="calc"></div><div class="sf-fb" id="msg"></div></div></div></div>
  <div class="panel c12"><h2>التجربة خطوة بخطوة</h2><ol class="steps" id="gs"></ol>${tries(['اجعل الفترة الأولى 150 ppm لمدة 4 ساعات (كما يقول نص الكتاب خطأً) وانظر كيف يتغير المتوسط.','احذف فترة حتى يصير المجموع أقل من 8 ساعات: الكتاب يقسم على 8 دائماً.'])}</div>
 </div>`;
 const $=q=>el.querySelector(q);
 const TP=B.params($('#tptwa'),'u2-l2',[{k:'stel',label:'حد التعرض القصير STEL للمادة',unit:'ppm',value:200,min:1,max:5000},{k:'ceil',label:'الحد الأقصى C للمادة',unit:'ppm',value:250,min:1,max:5000}],()=>draw());
 const S=stepsUI($('#gs'),[
  {t:'مثال الكتاب',x:`اضغط «مثال ص 16»: المتوسط ${lt('81.25 ppm')} أقل من ${lt('100 ppm')} رغم أن التركيز كان ${lt('150 ppm')} لمدة ساعتين.`,done:()=>W.ex},
  {t:'سؤال الوحدة',x:`اضغط «السؤال السادس ص 23» واقرأ الجواب (${lt('87.5 ppm')}).`,done:()=>W.q6},
  {t:'تجاوز الحد',x:'غيّر التركيزات أو المدد حتى يصير المتوسط أكبر من التركيز المسموح.',done:()=>W.over},
  {t:'قمة قصيرة',x:'اجعل فترة ما أعلى من خط STEL (البرتقالي) ولاحظ أن المتوسط قد يبقى مقبولاً لكن هذه الفترة مخالفة.',done:()=>W.stel}]);
 function draw(){const st=TP.v.stel,ce=Math.max(TP.v.ceil,0);
  const tot=rows.reduce((a,r)=>a+r[0],0),sum=rows.reduce((a,r)=>a+r[0]*r[1],0),avg=sum/8;
  $('#lV').textContent=lim+' ppm';$('#lR').value=lim;
  $('#cv').innerHTML=twaSVG(rows,lim,st,ce,avg);
  $('#tb').innerHTML=`<thead><tr><th>الفترة</th><th>المدة (ساعة)</th><th>التركيز (ppm)</th><th>C × T</th></tr></thead><tbody>${rows.map((r,i)=>`<tr><td>${i+1}</td><td><input type="number" min="0.25" max="8" step="0.25" data-r="${i}" data-c="0" value="${r[0]}" style="width:76px;font:inherit"></td><td><input type="number" min="0" max="5000" step="any" data-r="${i}" data-c="1" value="${r[1]}" style="width:86px;font:inherit"></td><td>${lt(fm(r[0]*r[1],2))}</td></tr>`).join('')}<tr><td colspan="3">المجموع</td><td>${lt(fm(sum,2))}</td></tr></tbody>`;
  $('#tb').querySelectorAll('input').forEach(inp=>inp.onchange=()=>{let v=+inp.value;if(!isFinite(v))v=0;const c=+inp.dataset.c;v=c?Math.max(0,Math.min(5000,v)):Math.max(0.25,Math.min(8,Math.round(v*4)/4));rows[+inp.dataset.r][c]=v;draw()});
  $('#calc').innerHTML=`<div class="sf-ans" style="direction:ltr;text-align:left;overflow-x:auto">${B.tex(`\\text{PEL-TWA}=\\frac{${rows.map(r=>fm(r[1],2)+'\\times'+fm(r[0],2)).join('+')}}{8}`,true)}${B.tex(`=\\frac{${fm(sum,2)}}{8}=${fm(avg,2)}\\ \\text{ppm}`,true)}</div><div class="facts"><div class="fact"><span>مجموع المدد</span><b>${fm(tot,2)} h</b></div><div class="fact"><span>المتوسط TWA</span><b>${fm(avg,2)} ppm</b></div></div>`;
  const over=avg>lim,hiS=rows.some(r=>r[1]>st),hiC=rows.some(r=>r[1]>ce);
  let m=tot>8?`<b>مجموع المدد أكثر من 8 ساعات.</b> القانون لفترات «لا تتجاوز 8 ساعات»؛ قلّل المدد. `:'';
  m+=over?`<b>المتوسط ${lt(fm(avg,2)+' ppm')} أكبر من المسموح ${lt(lim+' ppm')}:</b> العامل تعرّض أكثر من الحد خلال اليوم.`:`<b>المتوسط ${lt(fm(avg,2)+' ppm')} أقل من المسموح ${lt(lim+' ppm')} أو يساويه</b> حسب طريقة الكتاب.`;
  if(hiC)m+=`<br><b>فترة فيها تركيز أعلى من C:</b> «التركيز الذي لا يمكن تجاوزه بأي حال من الأحوال».`;
  else if(hiS)m+=`<br><b>فترة فيها تركيز أعلى من STEL:</b> STEL هو المسموح لفترات قصيرة لا تتجاوز 15 دقيقة، 4 مرات في اليوم، بينها ساعة راحة؛ فتركيز أعلى منه مخالفة حتى لو كان المتوسط مقبولاً.`;
  if(tot<8)m+=`<br>المدد المقاسة ${lt(fm(tot,2)+' h')} فقط، والقسمة على 8 تعدّ باقي اليوم بلا تعرض.`;
  const mm=$('#msg');mm.className='sf-fb'+(over||hiC||hiS||tot>8?' bad':'');mm.innerHTML=m;B.math(mm);
  const same=k=>JSON.stringify(rows)===JSON.stringify(PRESETS[k].rows)&&lim===100;
  if(same('ex'))W.ex=1;if(same('q6')&&W.ex)W.q6=1;if(over&&tot<=8)W.over=1;if(hiS)W.stel=1;S.check()}
 el.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{rows=PRESETS[b.dataset.p].rows.map(r=>r.slice());lim=100;draw()});
 $('#add').onclick=()=>{if(rows.length<6){rows.push([0.25,50]);draw()}};
 $('#rm').onclick=()=>{if(rows.length>1){rows.pop();draw()}};
 $('#lR').oninput=e=>{lim=+e.target.value;draw()};
 const tpn=document.createElement('p');tpn.className='sub';tpn.innerHTML='حدّا STEL و C للمادة في هذه الحاسبة قيم توضيحية (الكتاب لا يذكر لهما أرقاماً)؛ أما التركيز المسموح 100 ppm وبيانات النموذجين فمن الكتاب.';$('#tptwa').appendChild(tpn);
 draw()}
const twaSolve=(book)=>(g,B)=>{const p=[g.C1*g.T1,g.C2*g.T2,g.C3*g.T3],sum=p[0]+p[1]+p[2],avg=sum/8,tot=g.T1+g.T2+g.T3;
 const out=[{t:'القانون (ص 16): نضرب تركيز كل فترة في مدتها، ونجمع، ثم نقسم على 8:',f:'\\text{PEL-TWA}=\\frac{C_aT_a+C_bT_b+C_cT_c}{8}'},
  {t:'نعوّض بالقيم:',f:`\\text{PEL-TWA}=\\frac{${g.C1}\\times ${g.T1}+${g.C2}\\times ${g.T2}+${g.C3}\\times ${g.T3}}{8}`},
  {t:'حواصل الضرب:',f:`=\\frac{${fm(p[0],2)}+${fm(p[1],2)}+${fm(p[2],2)}}{8}=\\frac{${fm(sum,2)}}{8}`},
  {t:'متوسط التركيز خلال 8 ساعات:',v:B.round(avg,2),unit:'ppm',dp:2,final:true},
  {t:avg<=g.L?`نقارن بالتركيز المسموح: ${lt(fm(avg,2)+' ppm')} أقل من ${lt(g.L+' ppm')} (أو يساويه)، فالتعرض مقبول.`:`نقارن بالتركيز المسموح: ${lt(fm(avg,2)+' ppm')} أكبر من ${lt(g.L+' ppm')}، فالتعرض أعلى من المسموح.`}];
 if(tot>8)out.push({t:'تنبيه: مجموع المدد أكثر من 8 ساعات؛ القانون لفترات لا تتجاوز 8 ساعات.'});
 return out};
const gv=(a)=>[{id:'C1',label:'تركيز الفترة الأولى',sym:'C_a',unit:'ppm',value:a[0]},{id:'T1',label:'مدة الفترة الأولى',sym:'T_a',unit:'h',value:a[1]},{id:'C2',label:'تركيز الفترة الثانية',sym:'C_b',unit:'ppm',value:a[2]},{id:'T2',label:'مدة الفترة الثانية',sym:'T_b',unit:'h',value:a[3]},{id:'C3',label:'تركيز الفترة الثالثة',sym:'C_c',unit:'ppm',value:a[4]},{id:'T3',label:'مدة الفترة الثالثة',sym:'T_c',unit:'h',value:a[5]},{id:'L',label:'التركيز المسموح خلال 8 ساعات',sym:'',unit:'ppm',value:100}];

B.lesson({
 id:'u2-l2',unit:2,order:2,pages:'15–16',
 title:'حدود التعرض ومتوسط التركيز',
 summary:'وحدات قياس التركيز (PPM و mg/m³ و F/cc)، وحدود التعرض TWA وSTEL وC، وطريقة حساب متوسط التركيز خلال 8 ساعات بمثال الكتاب.',
 stations:[
  {intro:true},

  {st:1,short:'وحدات القياس',title:'وحدات قياس تركيز المواد الكيميائية',ref:'ص 15',
   q:'هل نقيس الغاز والغبار والألياف بالوحدة نفسها؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ثلاث وحدات لقياس التركيز" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="⟦PPM⟧: جزء بالمليون، لقياس تركيز المواد الغازية والأبخرة."><rect x="52" y="96" width="36" height="84" rx="14" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><rect x="62" y="84" width="16" height="14" fill="#2C4A40"/><path d="M70 78 q-10 -12 2 -22 q10 -8 -2 -18" fill="none" stroke="#2C4A40" stroke-width="2" stroke-dasharray="4 3"/><rect x="34" y="200" width="72" height="30" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="70" y="221" text-anchor="middle" font-size="15" font-weight="700" fill="#2C4A40" font-family="var(--mono)" direction="ltr">PPM</text></g><g data-tip="⟦mg/m³⟧: مليجرام من المادة في كل متر مكعب من الهواء، لقياس تركيز الأتربة والأدخنة."><path d="M150 110 L210 110 L210 170 L150 170 Z" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M150 110 L166 96 L226 96 L210 110 M210 170 L226 156 L226 96" fill="none" stroke="#2C4A40" stroke-width="2.5"/><g fill="#2C4A40"><circle cx="164" cy="128" r="2.5"/><circle cx="180" cy="142" r="3"/><circle cx="196" cy="124" r="2"/><circle cx="170" cy="156" r="2.5"/><circle cx="198" cy="152" r="3"/></g><rect x="144" y="200" width="72" height="30" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="180" y="221" text-anchor="middle" font-size="15" font-weight="700" fill="#2C4A40" font-family="var(--mono)" direction="ltr">mg/m³</text></g><g data-tip="⟦F/cc⟧: عدد الألياف في كل سنتيمتر مكعب من الهواء، لقياس الألياف مثل الأسبستوس."><rect x="262" y="110" width="50" height="60" rx="6" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M270 124 L300 132 M272 146 L304 140 M276 160 L298 150" stroke="#9AA5A0" stroke-width="3" stroke-linecap="round"/><rect x="250" y="200" width="72" height="30" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="286" y="221" text-anchor="middle" font-size="15" font-weight="700" fill="#2C4A40" font-family="var(--mono)" direction="ltr">F/cc</text></g><text x="70" y="252" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">غازات وأبخرة</text><text x="180" y="252" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">أتربة وأدخنة</text><text x="286" y="252" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">ألياف</text><text x="180" y="284" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">لكل نوع وحدته</text></svg>`,
   cap:'وحدة لكل نوع من الملوثات.<br><b>مرّر المؤشر على كل رمز (أو المسه في الجوال) لتعرف معنى الوحدة.</b>',
   side:[
    {predict:{q:'بأي وحدة نقيس ألياف الأسبستوس في الهواء؟',opts:[
     ['<span class="ltr">PPM</span>',false,'جزء بالمليون للغازات والأبخرة.'],
     ['<span class="ltr">mg/m³</span>',false,'للأتربة والأدخنة.'],
     ['<span class="ltr">F/cc</span>',true,'الكتاب (ص 15): «عدد الألياف في كل سنتيمتر مكعب من الهواء وتستخدم لقياس الألياف مثل الأسبستوس».']]}}
   ],
   body:[
    {book:`<div class="tablebox"><table class="tt"><thead><tr><th>الوحدة</th><th>المعنى</th></tr></thead><tbody>
     <tr><td><span class="ltr">PPM</span></td><td>جزء بالمليون وتستخدم لقياس تركيز المواد الغازية والأبخرة</td></tr>
     <tr><td><span class="ltr">mg/m³</span></td><td>مليجرام من المادة في كل متر مكعب من الهواء وتستخدم لقياس تركيز الأتربة والأدخنة</td></tr>
     <tr><td><span class="ltr">F/cc</span></td><td>عدد الألياف في كل سنتيمتر مكعب من الهواء وتستخدم لقياس الألياف مثل الأسبستوس</td></tr></tbody></table></div>`,ref:'ص 15'},
    {watch:`<p>في الجدول «ميل جرام» والمقصود مليجرام، فكتبناها مليجرام.</p>`,fix:true},
    {tip:`<p>لماذا ثلاث وحدات؟ الغاز يمتزج بالهواء فنقيس <b>نسبته</b> (أجزاء من مليون)، والغبار والدخان جسيمات فنقيس <b>وزنها</b> في حجم من الهواء، والألياف خطرها في <b>عددها</b> فنعدّها.</p>`},
    {title:'مختبر مصغّر: اختر الوحدة',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل ملوث: بأي وحدة يُقاس تركيزه في الكتاب؟',cats:['PPM','mg/m³','F/cc'],items:[
     ['أبخرة مذيب في ورشة دهان',0,'PPM للمواد الغازية والأبخرة.'],
     ['غبار طحن الحجارة',1,'mg/m³ للأتربة والأدخنة.'],
     ['أدخنة اللحام',1,'mg/m³ للأتربة والأدخنة.'],
     ['ألياف عزل قديم من الأسبستوس',2,'F/cc لعدّ الألياف.'],
     ['غاز يتسرب من أسطوانة',0,'PPM للمواد الغازية.']]})}
   ]},

  {st:2,short:'حدود TLV',title:'الجرعات المقررة (حسب نظام المؤتمر الحكومي الأمريكي لأخصائيي الصحة المهنية)',ref:'ص 15',
   q:'هل يكفي أن نعرف متوسط اليوم… أم قد تؤذي العامل دقائق قليلة من تركيز عالٍ؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ثلاثة أنواع من حدود التعرض" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E3ECF7"/><g data-tip="⟦TWA⟧: متوسط التركيز المسموح التعرض له خلال ⟦8⟧ ساعات باليوم لمدة ⟦40⟧ ساعة بالأسبوع."><circle cx="270" cy="120" r="40" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M270 120 V92 M270 120 L290 132" stroke="#2C4A40" stroke-width="4" stroke-linecap="round"/><text x="270" y="190" text-anchor="middle" font-size="15" font-weight="700" fill="#12855A" font-family="var(--mono)" direction="ltr">TWA</text><text x="270" y="208" text-anchor="middle" font-size="11" fill="#2C4A40">متوسط اليوم</text></g><g data-tip="⟦STEL⟧: التركيز المسموح التعرض له خلال فترات قصيرة لا تتجاوز ⟦15⟧ دقيقة، ⟦4⟧ مرات باليوم، وتتخلل كل فترة ساعة راحة."><circle cx="180" cy="128" r="32" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><rect x="172" y="88" width="16" height="10" fill="#2C4A40"/><path d="M180 128 V104" stroke="#2C4A40" stroke-width="4" stroke-linecap="round"/><path d="M180 96 A32 32 0 0 1 212 128 L180 128 Z" fill="#F2C14E" opacity=".8"/><text x="180" y="190" text-anchor="middle" font-size="15" font-weight="700" fill="#E0A800" font-family="var(--mono)" direction="ltr">STEL</text><text x="180" y="208" text-anchor="middle" font-size="11" fill="#2C4A40">فترات قصيرة</text></g><g data-tip="⟦C⟧ (السقف): التركيز الذي لا يمكن تجاوزه بأي حال من الأحوال."><path d="M60 92 H124" stroke="#C0392B" stroke-width="6" stroke-linecap="round"/><path d="M92 156 V100 M80 112 L92 100 L104 112" fill="none" stroke="#2C4A40" stroke-width="3.5" stroke-linecap="round"/><text x="92" y="190" text-anchor="middle" font-size="15" font-weight="700" fill="#C0392B" font-family="var(--mono)" direction="ltr">C</text><text x="92" y="208" text-anchor="middle" font-size="11" fill="#2C4A40">سقف لا يُتجاوز</text></g><text x="180" y="258" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">ثلاثة حدود لكل مادة</text></svg>`,
   cap:'ساعة اليوم، وساعة الإيقاف للفترات القصيرة، والسقف.<br><b>مرّر المؤشر على كل رمز (أو المسه في الجوال) لتعرف معنى الحد.</b>',
   side:[
    {predict:{q:'أي الحدود الثلاثة لا يجوز تجاوزه ولو للحظة؟',opts:[
     ['<span class="ltr">TLV-TWA</span>',false,'هذا متوسط اليوم؛ قد يرتفع التركيز فوقه أحياناً ويبقى المتوسط مقبولاً.'],
     ['<span class="ltr">TLV-STEL</span>',false,'هذا يُسمح به لفترات قصيرة محددة.'],
     ['<span class="ltr">TLV-C</span>',true,'الكتاب (ص 15): «التركيز الذي لا يمكن تجاوزه بأي حال من الأحوال».']]}}
   ],
   body:[
    {book:`<div class="tablebox"><table class="tt"><thead><tr><th>الرمز</th><th>المعنى</th></tr></thead><tbody>
     <tr><td><span class="ltr">TLV-TWA</span></td><td>متوسط تركيز المواد الكيميائية المسموح التعرض له خلال <span class="ltr">8</span> ساعات باليوم لمدة <span class="ltr">40</span> ساعة بالأسبوع</td></tr>
     <tr><td><span class="ltr">TLV-STEL</span></td><td>التركيز المسموح التعرض له خلال فترات قصيرة لا تتجاوز <span class="ltr">15</span> دقيقة باليوم – <span class="ltr">4</span> مرات باليوم وتتخلل كل فترة ساعة راحة.</td></tr>
     <tr><td><span class="ltr">TLV-C</span></td><td>التركيز الذي لا يمكن تجاوزه بأي حال من الأحوال.</td></tr></tbody></table></div>`,ref:'ص 15'},
    {html:fig(limitsFig(),'الشكل <span class="ltr">(7-2)</span> يبين حدود التعرض المسموح بها: ثلاثة أنواع من الحدود (<span class="ltr">TWA</span> و<span class="ltr">STEL</span> و<span class="ltr">C</span>) لمادة واحدة','ص 15',460)},
    {watch:`<p>تسمية الشكل <span class="ltr">(7-2)</span> في الكتاب «لثلاث مواد مختلفة»، والرسم يبين ثلاثة أنواع من حدود التعرض لمادة واحدة كما يقول عنوانه <span class="ltr">THREE TYPES OF EXPOSURE LIMIT</span>، فصححنا التسمية.</p>`,fix:true},
    {tip:`<p>اقرأ الشكل <span class="ltr">(7-2)</span>: منحنى التركيز يصعد وينزل خلال اليوم. يتجاوز خط <span class="ltr">TWA</span> أحياناً (وهذا مسموح ما دام <b>المتوسط</b> لا يتجاوزه)، لكنه لا يصل إلى <span class="ltr">STEL</span>، ولا يقترب من <span class="ltr">C</span> أبداً.</p>`},
    {title:'مختبر مصغّر: هل خالف حد STEL؟',widget:(el,B)=>DCML.cases(el,B,{intro:'المواقف من عندنا، والحكم من تعريف <span class="ltr">STEL</span> في الكتاب: فترات لا تتجاوز <span class="ltr">15</span> دقيقة، <span class="ltr">4</span> مرات باليوم، بين كل فترتين ساعة راحة. في كل موقف التركيز أعلى من <span class="ltr">TWA</span> وعند حد <span class="ltr">STEL</span>، ولا يصل إلى <span class="ltr">C</span>.',cases:[
     {q:'أربع فترات في اليوم، كل منها <span class="ltr">15</span> دقيقة، وبين كل فترتين ساعة أو أكثر.',opts:[['ضمن شروط STEL',true,'المدة والعدد والراحة كلها ضمن التعريف.'],['مخالفة',false,'لم يتجاوز أي شرط من الشروط الثلاثة.']]},
     {q:'فترة واحدة متصلة مدتها نصف ساعة.',opts:[['ضمن شروط STEL',false,'الفترة الواحدة لا تتجاوز <span class="ltr">15</span> دقيقة.'],['مخالفة',true,'نصف ساعة أطول من <span class="ltr">15</span> دقيقة.']]},
     {q:'ست فترات في اليوم، كل منها عشر دقائق، وبينها ساعة راحة.',opts:[['مخالفة',true,'عدد الفترات أكثر من <span class="ltr">4</span> مرات باليوم.'],['ضمن شروط STEL',false,'المدة مقبولة، لكن العدد تجاوز <span class="ltr">4</span> مرات.']]}]})}
   ]},

  {st:3,short:'حدود PEL',title:'الجرعات المقررة حسب مواصفات الأوشا',ref:'ص 15',
   q:'جدولان بأسماء مختلفة… فهل يختلف المعنى؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="جدولا TLV و PEL بالمعاني نفسها" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBEBDD"/><g data-tip="⟦TLV⟧: حدود المؤتمر الحكومي الأمريكي لأخصائيي الصحة المهنية ⟦(ACGIH)⟧."><rect x="196" y="70" width="110" height="170" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><rect x="196" y="70" width="110" height="34" rx="10" fill="#4FB3A9" stroke="#2C4A40" stroke-width="3"/><text x="251" y="93" text-anchor="middle" font-size="16" font-weight="700" fill="#FBF6EE" font-family="var(--mono)">TLV</text></g><g data-tip="⟦PEL⟧: حدود الأوشا ⟦(OSHA)⟧، إدارة السلامة والصحة المهنية الأمريكية."><rect x="54" y="70" width="110" height="170" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><rect x="54" y="70" width="110" height="34" rx="10" fill="#F2C14E" stroke="#2C4A40" stroke-width="3"/><text x="109" y="93" text-anchor="middle" font-size="16" font-weight="700" fill="#2C4A40" font-family="var(--mono)">PEL</text></g><g font-family="var(--mono)" font-size="14" font-weight="700" text-anchor="middle"><text x="251" y="138" fill="#12855A">TWA</text><text x="251" y="178" fill="#E0A800">STEL</text><text x="251" y="218" fill="#C0392B">C</text><text x="109" y="138" fill="#12855A">TWA</text><text x="109" y="178" fill="#E0A800">STEL</text><text x="109" y="218" fill="#C0392B">C</text></g><g data-tip="المعنى نفسه في الجدولين: ⟦TWA⟧ متوسط اليوم، و⟦STEL⟧ الفترات القصيرة، و⟦C⟧ السقف."><path d="M168 133 H192 M168 173 H192 M168 213 H192" stroke="#2C4A40" stroke-width="3" stroke-dasharray="4 3"/><text x="180" y="122" text-anchor="middle" font-size="16" font-weight="700" fill="#2C4A40">=</text></g><text x="180" y="276" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">جهتان، والمعاني واحدة</text></svg>`,
   cap:'جدول الأوشا يكرر المعاني الثلاث بأسماء تبدأ بـ <span class="ltr">PEL</span>.<br><b>مرّر المؤشر على الجدولين والخطوط بينهما (أو المسها في الجوال) لتعرف الفرق.</b>',
   side:[
    {predict:{q:'ما معنى <span class="ltr">PEL-STEL</span>؟',opts:[
     ['متوسط التركيز خلال <span class="ltr">8</span> ساعات',false,'هذا <span class="ltr">PEL-TWA</span>.'],
     ['التركيز المسموح لفترات قصيرة لا تتجاوز <span class="ltr">15</span> دقيقة، <span class="ltr">4</span> مرات باليوم، بينها ساعة راحة',true,'الكتاب (ص 15) يعطي <span class="ltr">PEL-STEL</span> المعنى نفسه الذي أعطاه لـ <span class="ltr">TLV-STEL</span>.'],
     ['التركيز الذي لا يمكن تجاوزه',false,'هذا <span class="ltr">PEL-C</span>.']]}}
   ],
   body:[
    {book:`<div class="tablebox"><table class="tt"><thead><tr><th>الرمز</th><th>المعنى</th></tr></thead><tbody>
     <tr><td><span class="ltr">PEL - TWA</span></td><td>متوسط التركيز المسموح التعرض له خلال <span class="ltr">8</span> ساعات باليوم لمدة <span class="ltr">40</span> ساعة بالأسبوع.</td></tr>
     <tr><td><span class="ltr">PEL – STEL</span></td><td>التركيز المسموح التعرض له خلال فترات قصيرة لا تتجاوز <span class="ltr">15</span> دقيقة باليوم – <span class="ltr">4</span> مرات باليوم وتتخلل كل فترة ساعة راحة.</td></tr>
     <tr><td><span class="ltr">PEL - C</span></td><td>التركيز الذي لا يمكن تجاوزه بأي حال من الأحوال.</td></tr></tbody></table></div>`,ref:'ص 15'},
    {tip:`<p><span class="ltr">TLV</span> حدود جهة علمية أمريكية <span class="ltr">(ACGIH)</span>، و<span class="ltr">PEL</span> حدود إدارة السلامة والصحة المهنية الأمريكية <span class="ltr">(OSHA)</span>. المعاني الثلاثة واحدة في الجدولين: <b>TWA</b> متوسط اليوم، و<b>STEL</b> حد الفترات القصيرة، و<b>C</b> سقف لا يُتجاوز أبداً. والأرقام نفسها (الحدود الفعلية لكل مادة) قد تختلف بين الجهتين.</p>`},
    {title:'مختبر مصغّر: طابق الرمز بمعناه',widget:(el,B)=>DCML.sort(el,B,{intro:'الاسم الأول (<span class="ltr">TLV</span> أو <span class="ltr">PEL</span>) يدل على الجهة، والثاني يدل على المعنى.',cats:['متوسط 8 ساعات','فترات قصيرة','سقف لا يُتجاوز'],items:[
     ['<span class="ltr">PEL-C</span>',2,'C = التركيز الذي لا يمكن تجاوزه بأي حال.'],
     ['<span class="ltr">TLV-TWA</span>',0,'TWA = متوسط التركيز خلال 8 ساعات باليوم.'],
     ['<span class="ltr">PEL-STEL</span>',1,'STEL = فترات لا تتجاوز 15 دقيقة، 4 مرات باليوم.'],
     ['<span class="ltr">PEL-TWA</span>',0,'TWA في الجدولين بالمعنى نفسه.'],
     ['<span class="ltr">TLV-C</span>',2,'C في الجدولين بالمعنى نفسه.']]})}
   ]},

  {st:4,short:'حساب متوسط التركيز',title:'طريقة حساب متوسط التركيز خلال 8 ساعات',ref:'ص 16',
   q:'التركيز وصل إلى <span class="ltr">150 ppm</span> والمسموح <span class="ltr">100 ppm</span>… فهل تجاوز العامل الحد؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مثال الكتاب: ثلاث فترات ومتوسطها" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><path d="M60 236 H312 M60 236 V64" stroke="#2C4A40" stroke-width="2.5"/><g data-tip="الفترة الأولى: ⟦150 ppm⟧ خلال ساعتين. حاصل الضرب ⟦150 × 2 = 300⟧."><rect x="60" y="86" width="60" height="150" fill="#F6C6BC" stroke="#C0392B" stroke-width="2"/><text x="90" y="108" text-anchor="middle" font-size="13" font-weight="700" fill="#2C4A40" font-family="var(--mono)">150</text></g><g data-tip="الفترة الثانية: ⟦75 ppm⟧ خلال ساعتين متتاليتين. حاصل الضرب ⟦75 × 2 = 150⟧."><rect x="120" y="161" width="60" height="75" fill="#FCE9B8" stroke="#E0A800" stroke-width="2"/><text x="150" y="183" text-anchor="middle" font-size="13" font-weight="700" fill="#2C4A40" font-family="var(--mono)">75</text></g><g data-tip="الفترة الثالثة: ⟦50 ppm⟧ خلال ⟦4⟧ ساعات متتالية. حاصل الضرب ⟦50 × 4 = 200⟧."><rect x="180" y="186" width="120" height="50" fill="#BFE3DC" stroke="#12855A" stroke-width="2"/><text x="240" y="208" text-anchor="middle" font-size="13" font-weight="700" fill="#2C4A40" font-family="var(--mono)">50</text></g><g data-tip="التركيز المسموح خلال ⟦8⟧ ساعات: ⟦100 ppm⟧."><path d="M60 136 H312" stroke="#2C4A40" stroke-width="2" stroke-dasharray="8 5"/><text x="314" y="132" text-anchor="end" font-size="11" fill="#2C4A40" font-family="var(--mono)">100</text></g><g data-tip="متوسط التركيز خلال ⟦8⟧ ساعات: ⟦(300 + 150 + 200) ÷ 8 = 81.25 ppm⟧، أقل من المسموح."><path d="M60 154 H312" stroke="#12855A" stroke-width="3.5"/><text x="314" y="170" text-anchor="end" font-size="12" font-weight="700" fill="#12855A" font-family="var(--mono)">81.25</text></g><text x="44" y="70" text-anchor="middle" font-size="11" fill="#2C4A40" font-family="var(--mono)">ppm</text><g font-family="var(--mono)" font-size="11" fill="#2C4A40" text-anchor="middle"><text x="60" y="252">0</text><text x="120" y="252">2</text><text x="180" y="252">4</text><text x="300" y="252">8</text></g><text x="186" y="276" text-anchor="middle" font-size="12" fill="#2C4A40">الزمن (ساعة)</text></svg>`,
   cap:'مثال الكتاب (ص 16): مساحة كل مستطيل = التركيز × المدة.<br><b>مرّر المؤشر على المستطيلات والخطين (أو المسها في الجوال) لترى الحساب.</b>',
   side:[
    {predict:{q:'في مثال الكتاب كان التركيز <span class="ltr">150 ppm</span> لمدة ساعتين، والمسموح خلال <span class="ltr">8</span> ساعات <span class="ltr">100 ppm</span>. هل تجاوز المتوسط المسموح؟',opts:[
     ['نعم، لأن <span class="ltr">150</span> أكبر من <span class="ltr">100</span>',false,'الحد هنا للمتوسط خلال اليوم، لا لكل لحظة.'],
     ['لا، المتوسط <span class="ltr">81.25 ppm</span> أقل من المسموح',true,'الكتاب (ص 16): «وبمقارنة هذا التركيز مع التركيز المسموح … نجده أقل منه (<span class="ltr">100 PPM</span>) على الرغم من أن التركيز كان <span class="ltr">150 PPM</span>».'],
     ['لا نستطيع الحكم دون جهاز قياس',false,'القياسات معطاة؛ يكفي أن نحسب المتوسط بقانون الكتاب.']]}}
   ],
   body:[
    {book:String.raw`<p>يتم قياس التركيز خلال فترات زمنية لا تتجاوز <span class="ltr">8</span> ساعات ويتم ضرب قيمة التركيز في كل فترة × قيمة الفترة الزمنية وهكذا، وبعد ذلك يتم قسمة الناتج على <span class="ltr">8</span> للحصول على متوسط تركيز المادة الكيميائية خلال مدة الساعات الثمانية.</p>
     <div class="eq">$$\text{PEL-TWA}=\frac{C_aT_a+C_bT_b+\dots+C_nT_n}{8}$$</div>
     <p><b>مثال:</b><br>مادة يبلغ التركيز المسموح لها خلال <span class="ltr">8</span> ساعات <span class="ltr">100 ppm</span> تم قياس التركيز لهذه المادة خلال مدة ثمان ساعات وكان كالتالي:</p>
     <div class="tablebox"><table class="tt"><thead><tr><th>الفترة</th><th>التركيز</th></tr></thead><tbody><tr><td>خلال ساعتين</td><td><span class="ltr">150 ppm</span></td></tr><tr><td>خلال ساعتين متتاليتين</td><td><span class="ltr">75 ppm</span></td></tr><tr><td>خلال <span class="ltr">4</span> ساعات متتالية</td><td><span class="ltr">50 ppm</span></td></tr></tbody></table></div>
     <p>ولحساب متوسط التركيز لهذه المادة خلال ثمان ساعات:</p>
     <div class="eq">$$\text{PEL-TWA}=\frac{150\times2+75\times2+50\times4}{8}=81.25$$</div>
     <p>وبمقارنة هذا التركيز مع التركيز المسموح التعرض له خلال ثمان ساعات نجده أقل منه (<span class="ltr">100 PPM</span>) على الرغم من أن التركيز كان <span class="ltr">150 PPM</span> خلال مدة ساعتين.</p>`,ref:'ص 16'},
    {watch:`<p>في الجملة الأخيرة من المثال يقول الكتاب «<span class="ltr">150 PPM</span> خلال مدة ٤ ساعات»، والمعطى في الجدول «خلال ساعتين»، فكتبناها «ساعتين». الحساب نفسه (<span class="ltr">81.25</span>) صحيح.</p>`,fix:true},
    {tip:`<p>فكرة القانون: كل فترة «تحمل» حاصل ضرب تركيزها في مدتها (مساحة المستطيل في الرسم). نجمع المساحات ونوزعها على <span class="ltr">8</span> ساعات، فنحصل على تركيز ثابت «مكافئ» طوال اليوم. ولاحظ أننا نقسم على <span class="ltr">8</span> دائماً، لا على عدد الفترات. الحل خطوة بخطوة في تبويب «الأمثلة المحلولة».</p>`},
    {watch:`<p>متوسط مقبول لا يعني أن كل شيء مقبول: إذا تجاوز التركيز في فترة ما حد <span class="ltr">STEL</span> أو <span class="ltr">C</span> للمادة فهذه مخالفة مستقلة، حتى لو كان متوسط اليوم أقل من <span class="ltr">TWA</span>.</p>`},
    {title:'مختبر مصغّر: احسب المتوسط',widget:(el,B)=>DCML.lab(el,B,{intro:'اختر بيانات من الكتاب، وتتبّع الحساب: نضرب كل تركيز في مدته، ونجمع، ونقسم على <span class="ltr">8</span>.',
     predict:{q:'في السؤال السادس (ص 23) تبدّلت الفترتان الأوليان: <span class="ltr">100 ppm</span> لساعتين ثم <span class="ltr">150 ppm</span> لساعتين، ثم <span class="ltr">50 ppm</span> لأربع ساعات. هل يزيد المتوسط عن مثال الكتاب؟',opts:[
      ['لا يتغير، لأن الفترات نفسها',false,'التركيز <span class="ltr">75</span> في المثال صار <span class="ltr">100</span>؛ فالمجموع تغيّر.'],
      ['نعم، يصير <span class="ltr">87.5 ppm</span>',true,'<bdi dir="ltr">(100×2 + 150×2 + 50×4) ÷ 8 = 700 ÷ 8 = 87.5 ppm</bdi>، وهو ما زال أقل من <span class="ltr">100 ppm</span>.'],
      ['يصير أكثر من <span class="ltr">100 ppm</span>',false,'المجموع <span class="ltr">700</span> مقسوماً على <span class="ltr">8</span> أقل من <span class="ltr">100</span>.']]},
     ins:[{k:'p',l:'البيانات',seg:[['ex','مثال الكتاب ص 16'],['q6','السؤال السادس ص 23']],v:'ex'}],
     calc:(s,P,B)=>{const rows=PRESETS[s.p].rows,pr=rows.map(r=>r[0]*r[1]),sum=pr.reduce((a,b)=>a+b,0),avg=sum/8;
      const facts=rows.map((r,i)=>[['الأولى','الثانية','الثالثة'][i]+': <span class="ltr">'+B.fmtN(r[1],0)+' × '+r[0]+'</span>',B.fmtN(pr[i],0)]);
      facts.push(['المجموع',B.fmtN(sum,0)]);facts.push(['المتوسط = المجموع ÷ 8',B.fmtN(avg,2)+' ppm','hi']);
      return {facts,bars:[{l:'المتوسط خلال 8 ساعات',v:avg,max:150,u:'ppm',dp:2,col:'--on'},{l:'التركيز المسموح (من الكتاب)',v:100,max:150,u:'ppm',dp:0,col:'--muted'}],
       msg:'المتوسط <span class="ltr">'+B.fmtN(avg,2)+' ppm</span> أقل من المسموح <span class="ltr">100 ppm</span>، رغم أن التركيز في إحدى الفترات كان <span class="ltr">150 ppm</span>.'}}})}
   ]},

  {recap:[
   'الوحدات: <span class="ltr">PPM</span> للغازات والأبخرة، و<span class="ltr">mg/m³</span> للأتربة والأدخنة، و<span class="ltr">F/cc</span> للألياف (ص 15).',
   '<span class="ltr">TWA</span> متوسط <span class="ltr">8</span> ساعات باليوم (<span class="ltr">40</span> بالأسبوع)، و<span class="ltr">STEL</span> فترات لا تتجاوز <span class="ltr">15</span> دقيقة <span class="ltr">4</span> مرات باليوم بينها ساعة راحة، و<span class="ltr">C</span> سقف لا يُتجاوز (ص 15).',
   '<span class="ltr">TLV</span> و<span class="ltr">PEL</span> جدولان من جهتين بالمعاني نفسها (ص 15).',
   'متوسط التركيز = مجموع (التركيز × المدة) ÷ <span class="ltr">8</span>؛ مثال الكتاب <span class="ltr">81.25 ppm</span>، والسؤال السادس <span class="ltr">87.5 ppm</span> (ص 16 و23).']}
],
 theory:[
  {h:'وحدات قياس تركيز المواد الكيميائية',ref:'ص 15',html:`<div class="tablebox"><table class="tt"><thead><tr><th>الوحدة</th><th>المعنى</th></tr></thead><tbody>
   <tr><td>${lt('PPM')}</td><td>جزء بالمليون، وتستخدم لقياس تركيز المواد الغازية والأبخرة</td></tr>
   <tr><td>${lt('mg/m³')}</td><td>مليجرام من المادة في كل متر مكعب من الهواء، وتستخدم لقياس تركيز الأتربة والأدخنة</td></tr>
   <tr><td>${lt('F/cc')}</td><td>عدد الألياف في كل سنتيمتر مكعب من الهواء، وتستخدم لقياس الألياف مثل الأسبستوس</td></tr></tbody></table></div>`},
  {h:'الجرعات المقررة',ref:'ص 15',html:`<p><b>حسب نظام المؤتمر الحكومي الأمريكي لأخصائيي الصحة المهنية:</b></p><div class="tablebox"><table class="tt"><thead><tr><th>الرمز</th><th>المعنى</th></tr></thead><tbody>
   <tr><td>${lt('TLV-TWA')}</td><td>متوسط تركيز المواد الكيميائية المسموح التعرض له خلال 8 ساعات باليوم لمدة 40 ساعة بالأسبوع</td></tr>
   <tr><td>${lt('TLV-STEL')}</td><td>التركيز المسموح التعرض له خلال فترات قصيرة لا تتجاوز 15 دقيقة باليوم – 4 مرات باليوم وتتخلل كل فترة ساعة راحة</td></tr>
   <tr><td>${lt('TLV-C')}</td><td>التركيز الذي لا يمكن تجاوزه بأي حال من الأحوال</td></tr></tbody></table></div>
   <p><b>حسب مواصفات الأوشا:</b> الرموز ${lt('PEL-TWA')} و ${lt('PEL-STEL')} و ${lt('PEL-C')} بالمعاني نفسها.</p>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> TLV حدود جهة علمية أمريكية (ACGIH)، وPEL حدود إدارة السلامة والصحة المهنية الأمريكية (OSHA). المعاني الثلاثة واحدة في الجدولين: <b>TWA</b> متوسط اليوم، و<b>STEL</b> حد الفترات القصيرة، و<b>C</b> سقف لا يُتجاوز أبداً.'},
  {fig:'(7-2)',ref:'ص 15',caption:'يبين حدود التعرض المسموح بها: ثلاثة أنواع من الحدود (TWA وSTEL وC) لمادة واحدة',draw:()=>`<div class="svgbox" style="max-width:460px;margin-inline:auto">${limitsFig()}</div>`},
  {err:'<span class="fixnote">تسمية الشكل (7-2) في الكتاب «لثلاث مواد مختلفة»، والرسم يبين ثلاثة أنواع من حدود التعرض لمادة واحدة كما يقول عنوانه THREE TYPES OF EXPOSURE LIMIT، فصححنا التسمية. وفي الجدول «ميل جرام» والمقصود مليجرام.</span>'},
  {h:'طريقة حساب متوسط التركيز خلال 8 ساعات',ref:'ص 16',html:`<p>يتم قياس التركيز خلال فترات زمنية لا تتجاوز 8 ساعات، ويتم ضرب قيمة التركيز في كل فترة × قيمة الفترة الزمنية وهكذا، وبعد ذلك يتم قسمة الناتج على 8 للحصول على متوسط تركيز المادة الكيميائية خلال مدة الساعات الثمانية.</p>
   $$\\text{PEL-TWA}=\\frac{C_aT_a+C_bT_b+\\dots+C_nT_n}{8}$$
   <p><b>مثال:</b> مادة يبلغ التركيز المسموح لها خلال 8 ساعات ${lt('100 ppm')}، تم قياس التركيز لهذه المادة خلال مدة ثمان ساعات وكان: ${lt('150 ppm')} خلال ساعتين، ثم ${lt('75 ppm')} خلال ساعتين متتاليتين، ثم ${lt('50 ppm')} خلال 4 ساعات متتالية.</p>
   $$\\text{PEL-TWA}=\\frac{150\\times2+75\\times2+50\\times4}{8}=81.25\\ \\text{ppm}$$
   <p>وبمقارنة هذا التركيز مع التركيز المسموح التعرض له خلال ثمان ساعات نجده أقل منه (${lt('100 ppm')}) على الرغم من أن التركيز كان ${lt('150 ppm')} خلال مدة ساعتين.</p>
   <p class="sub">الحل خطوة بخطوة في تبويب «الأمثلة المحلولة».</p>`},
  {err:'<span class="fixnote">في الجملة الأخيرة من المثال يقول الكتاب «150 PPM خلال مدة ٤ ساعات»، والمعطى في الجدول «خلال ساعتين»، فكتبناها «ساعتين». الحساب نفسه (81.25) صحيح.</span>'}
 ],
 lab:(el)=>lab22(el),
 examples:[
  {title:'مثال: متوسط التركيز خلال 8 ساعات',ref:'ص 16',q:'<p>مادة يبلغ التركيز المسموح لها خلال 8 ساعات 100 ppm، تم قياس التركيز لهذه المادة خلال مدة ثمان ساعات وكان كالتالي: 150 ppm خلال ساعتين، و 75 ppm خلال ساعتين متتاليتين، و 50 ppm خلال 4 ساعات متتالية. احسب متوسط التركيز لهذه المادة خلال ثمان ساعات.</p>',
   given:gv([150,2,75,2,50,4]),solve:twaSolve(),note:'<span class="fixnote">يقول نص الكتاب بعد الحل «150 PPM خلال مدة ٤ ساعات»، والمعطى ساعتان؛ الحساب 81.25 ppm صحيح.</span>'},
  {title:'السؤال السادس من أسئلة الوحدة',ref:'ص 23',q:'<p>احسب متوسط التركيز عادة خلال ثمان ساعات إذا كان التركيز المسموح لها هو 100 PPM، حيث تم قياس التركيز لها خلال الساعات الثمانية كالتالي: 100 خلال ساعتين، و 150 خلال ساعتين تاليتين، و 50 خلال 4 ساعات التالية.</p><p class="sub">الكتاب لا يعطي الجواب؛ الحل التالي إجابة مقترحة (ليست من الكتاب) بقانون ص 16.</p>',
   given:gv([100,2,150,2,50,4]),solve:twaSolve()}
 ],
 quiz:[
  {q:'الوحدة المستخدمة لقياس تركيز الغازات والأبخرة:',o:['F/cc','mg/m³','PPM','ميكرون'],c:2,e:'(ص 15).'},
  {q:'وحدة قياس ألياف الأسبستوس في الهواء:',o:['PPM','F/cc','mg/m³','dB'],c:1,e:'عدد الألياف في كل سنتيمتر مكعب (ص 15).'},
  {q:'التركيز الذي لا يمكن تجاوزه بأي حال من الأحوال:',o:['TWA','STEL','C','PEL-TWA'],c:2,e:'(ص 15).'},
  {q:'STEL هو التركيز المسموح لفترات قصيرة لا تتجاوز:',o:['15 دقيقة، 4 مرات باليوم بينها ساعة راحة','ساعة واحدة','8 ساعات','40 ساعة بالأسبوع'],c:0,e:'(ص 15).'},
  {q:'في مثال الكتاب كان متوسط التركيز:',o:['91.67 ppm','81.25 ppm','100 ppm','150 ppm'],c:1,e:'(150×2 + 75×2 + 50×4) ÷ 8 = 650 ÷ 8 = 81.25 ppm.'},
  {q:'في قانون الكتاب نقسم مجموع (التركيز × المدة) على:',o:['عدد الفترات','8','40','مجموع التركيزات'],c:1,e:'(ص 16).'}
 ]
});

/* =====================================================================
   u2-l3 — المخاطر الطبيعية والبيولوجية والهندسية، والتقييم، والسيطرة (ص 16–18)
   ===================================================================== */
const HIER=[['الإزالة','Elimination'],['التعويض','Substitution'],['العزل','Isolation'],['التحكم الهندسي','Engineering Control'],['التحكم الإداري','Administration Control'],['استخدام مهمات الوقاية الشخصية','Use PPE']];
function pyrSVG(n){let s=`<svg viewBox="0 0 420 260" role="img" aria-label="هرم السيطرة">`;
 HIER.forEach((h,i)=>{const y=10+i*40,w0=60+i*60,w1=w0+60,c=210,on=i<n;
  s+=`<path d="M${c-w0/2} ${y}H${c+w0/2}L${c+w1/2} ${y+38}H${c-w1/2}Z" style="fill:${on?'var(--blue-soft)':'var(--surface-2)'};stroke:${on?'var(--blue)':'var(--line)'};stroke-width:1.6"/>`;
  if(on)s+=svT(c,y+18,h[0],{st:'font-size:12.5px'})+`<text class="txt m" x="${c}" y="${y+32}" text-anchor="middle">${h[1]}</text>`;else s+=`<text class="txt m" x="${c}" y="${y+24}" text-anchor="middle">?</text>`});
 s+=`<path d="M396 14V246" style="stroke:var(--muted);stroke-width:1.6"/><path d="M391 22l5-10 5 10z" style="fill:var(--muted)"/>`+svT(404,130,'أكثر فاعلية',{a:'middle',st:'font-size:11px;fill:var(--muted);writing-mode:tb'});
 return s+'</svg>'}
const CTRL=[
 ['SUBSTITUTION WITH A LESS HARMFUL MATERIAL (WATER IN PLACE OF ORGANIC SOLVENT)','استبدال المادة بمادة أقل ضرراً (ماء بدل المذيب العضوي)',0],
 ['CHANGE OF PROCESS (AIRLESS PAINT SPRAYING)','تغيير طريقة العمل (رش الدهان بلا هواء)',0],
 ['ENCLOSURE OF PROCESS (GLOVE-BOX)','حجز العملية في صندوق مغلق (صندوق القفازات)',0],
 ['LOCAL EXHAUST VENTILATION (CAPTURE AT SOURCE)','شفط موضعي يلتقط الملوث عند مصدره',0],
 ['WET METHODS (HYDRO BLAST)','الطرق الرطبة (التنظيف بالماء المضغوط)',0],
 ['HOUSEKEEPING (IMMEDIATE CLEANUP)','النظافة والترتيب (التنظيف الفوري)',1],
 ['GENERAL EXHAUST VENTILATION (ROOF FANS)','تهوية عامة (مراوح السقف)',1],
 ['DILUTION VENTILATION (SUPPLIED AIR)','تهوية تخفيف (إدخال هواء نقي)',1],
 ['INCREASE DISTANCE BETWEEN SOURCE AND RECEIVER (REMOTE CONTROL)','زيادة المسافة بين المصدر والعامل (التحكم عن بعد)',1],
 ['CONTINUOUS AREA MONITORING (PRE-SET ALARMS)','مراقبة مستمرة للمكان (إنذارات مضبوطة مسبقاً)',1],
 ['TRAINING & EDUCATION (MOST IMPORTANT)','التدريب والتثقيف (الأهم)',2],
 ['ROTATION OF WORKERS (SPLIT UP DOSE)','تدوير العمال (تقسيم الجرعة)',2],
 ['ENCLOSURE OF WORKER (AIR CONDITIONED CRANE CABS)','حجز العامل (كابينة رافعة مكيفة)',2],
 ['PERSONAL MONITORING DEVICES (DOSIMETERS)','أجهزة قياس شخصية (مقاييس الجرعة)',2],
 ['PERSONAL PROTECTIVE DEVICES (RESPIRATORS)','أدوات الوقاية الشخصية (أجهزة التنفس)',2]];
function spr(marks){/* fig 2-8: marks = counts per column [s,p,r] */
 let s=`<svg viewBox="0 0 560 230" role="img" aria-label="مخطط عام لنظرية السيطرة"><text class="txt" x="280" y="18" text-anchor="middle">GENERALIZED DIAGRAM OF METHODS OF CONTROL</text>`;
 s+=`<path d="M20 40H540" style="stroke:var(--fg);stroke-width:2"/><path d="M20 40l10-5v10zM540 40l-10-5v10z" style="fill:var(--fg)"/><path d="M200 30V220M360 30V220" style="stroke:var(--fg);stroke-width:1.4;stroke-dasharray:6 4"/>`;
 ['SOURCE','AIR PATH','RECEIVER'].forEach((t,i)=>{s+=`<text class="txt" x="${110+i*170}" y="62" text-anchor="middle" style="font-size:13px">${t}</text>`+svT(110+i*170,80,['المصدر','المسار في الهواء','المستقبِل (العامل)'][i],{st:'font-size:12px'})});
 const k=[1,1,1];marks.forEach((m,i)=>{k[i]=Math.max(0.15,1-0.28*m)});
 const a1=k[0],a2=a1*k[1],a3=a2*k[2];
 s+=`<rect x="50" y="150" width="110" height="50" style="fill:var(--blue-soft);stroke:var(--fg);stroke-width:1.6"/><text class="txt" x="105" y="215" text-anchor="middle">Dip Tank</text><path d="M70 110H140M105 110V140" style="stroke:var(--fg);stroke-width:2"/><rect x="95" y="138" width="20" height="18" style="fill:var(--surface-2);stroke:var(--fg)"/>`;
 const wave=(x0,x1,op)=>`<path d="M${x0} 150c15-15 25 10 40-5s25 10 40-5s25 10 40-5" transform="translate(0 0)" style="fill:none;stroke:var(--stop);stroke-width:${(1+5*op).toFixed(1)};opacity:${(0.2+0.8*op).toFixed(2)}"/>`;
 s+=`<path d="M130 150C160 120 190 140 200 130" style="fill:none;stroke:var(--stop);stroke-width:${(1+5*a1).toFixed(1)};opacity:${(0.2+0.8*a1).toFixed(2)}"/>`+`<path d="M200 130C240 115 300 145 360 130" style="fill:none;stroke:var(--stop);stroke-width:${(1+5*a2).toFixed(1)};opacity:${(0.2+0.8*a2).toFixed(2)}"/>`+`<path d="M360 130C390 120 420 130 448 128" style="fill:none;stroke:var(--stop);stroke-width:${(1+5*a3).toFixed(1)};opacity:${(0.2+0.8*a3).toFixed(2)}"/>`;
 s+=[240,280,320].map(x=>`<path d="M${x} 170h22l-6-4M${x+22} 170l-6 4" style="fill:none;stroke:var(--muted);stroke-width:1.6"/>`).join('');
 s+=`<circle cx="470" cy="120" r="18" style="fill:var(--surface);stroke:var(--fg);stroke-width:2"/><path d="M452 124l-6 4 6 2" style="fill:none;stroke:var(--fg);stroke-width:2"/><path d="M450 200c0-40 10-55 20-60s30 20 30 60" style="fill:var(--surface-2);stroke:var(--fg);stroke-width:2"/>`;
 marks.forEach((m,i)=>{for(let j=0;j<m&&j<6;j++)s+=`<rect x="${120+i*170-50+j*18}" y="88" width="14" height="14" rx="3" style="fill:var(--on-soft);stroke:var(--on)"/>`});
 s+=svT(280,226,'سمك الخط الأحمر = ما يصل من الملوث (تمثيل وصفي)',{st:'font-size:11px;fill:var(--muted)'});
 return s+'</svg>'}
function lab23(el){const W={pyr:0};const marks=[0,0,0];
 el.innerHTML=`<div class="grid sf-lab">
  <div class="panel c5"><h2>رتّب هرم السيطرة <small>ص 17</small></h2><div class="svgbox" id="py" style="max-width:380px;margin-inline:auto"></div><div id="ord"></div></div>
  <div class="panel c7"><h2>المصدر ← المسار ← المستقبِل <small>مبني على الشكل (8-2) ص 18</small></h2>
   <p class="sub">بخار يتصاعد من حوض غمس ويصل إلى أنف العامل. لكل وسيلة سيطرة من الشكل حدّد: أين تعمل؟ كل إجابة صحيحة تضع حاجزاً أخضر في مكانه وتخفف ما يصل إلى العامل.</p>
   <div class="svgbox" id="sp" style="position:sticky;top:60px;background:var(--surface);z-index:1"></div><div id="srt"></div></div>
  <div class="panel c7"><h2>مواقف: أي وسيلة أعلى في الهرم؟</h2><div id="cs"></div></div>
  <div class="panel c5"><h2>التجربة خطوة بخطوة</h2><ol class="steps" id="gs"></ol>${tries(['لاحظ أن «مهمات الوقاية الشخصية» في قاعدة الهرم: نلجأ إليها بعد الوسائل الأخرى.','في الشكل (8-2) تتكرر «برنامج صيانة مناسب» في الأعمدة الثلاثة.'])}</div>
 </div>`;
 const $=q=>el.querySelector(q);
 const S=stepsUI($('#gs'),[
  {t:'ابنِ الهرم',x:'اضغط الوسائل الست من الأكثر فاعلية (القمة) إلى الأقل.',done:()=>W.pyr},
  {t:'صنّف وسائل السيطرة',x:'أكمل تصنيف الوسائل في المخطط: مصدر أو مسار أو مستقبِل.',done:()=>W.srt},
  {t:'المواقف',x:'أجب عن المواقف الثلاثة صحيحاً.',done:()=>(W.cs||0)>=3}]);
 const dpy=n=>{$('#py').innerHTML=pyrSVG(n)};dpy(0);
 const ordHost=$('#ord');
 orderAct(ordHost,{intro:'اضغط بالترتيب التنازلي (من القمة):',steps:HIER.map(h=>[h[0]+' '+lt(h[1]),'الترتيب التنازلي في الكتاب: الإزالة ← التعويض ← العزل ← التحكم الهندسي ← التحكم الإداري ← مهمات الوقاية الشخصية.']),done:'إزالة الخطر أفضل من كل شيء، ومهمات الوقاية الشخصية آخر الحلول.'},()=>{W.pyr=1;dpy(6);S.check()});
 ordHost.addEventListener('click',()=>{dpy(ordHost.querySelectorAll('.sf-ord li').length)});
 const dsp=()=>{$('#sp').innerHTML=spr(marks)};dsp();
 sortAct($('#srt'),{cats:['المصدر SOURCE','المسار AIR PATH','المستقبِل RECEIVER'],items:CTRL.map(c=>[`${c[1]}<br><span class="ltr sub" style="white-space:normal">${c[0]}</span>`,c[2],`في الشكل (8-2) هذه الوسيلة تحت عمود ${['المصدر SOURCE','المسار AIR PATH','المستقبِل RECEIVER'][c[2]]}.`]),onPick:(i,ok,c)=>{if(ok){marks[c]++;dsp()}}},()=>{W.srt=1;S.check()});
 casesAct($('#cs'),{intro:'اختر الوسيلة التي تقع في مرتبة أعلى من هرم السيطرة.',cases:[
  {q:'عامل ينظف قطعاً بمذيب عضوي سام في حوض غمس.',opts:[['استبدال المذيب بمحلول مائي أقل ضرراً',1,'هذا «التعويض»، وهو ثاني الهرم بعد الإزالة، وفي الشكل (8-2) «الماء بدل المذيب العضوي».'],['إعطاء العامل جهاز تنفس',0,'مهمات الوقاية الشخصية في قاعدة الهرم.'],['تقليل ساعات عمله في الحوض',0,'هذا تحكم إداري، وهو أدنى من التعويض.']]},
  {q:'آلة جلخ تنشر غباراً في الورشة.',opts:[['تركيب شفط موضعي عند الحجر',1,'تحكم هندسي عند المصدر (LOCAL EXHAUST VENTILATION).'],['لوحة تحذير على الآلة',0,'تحكم إداري، أدنى من التحكم الهندسي.'],['كمامة للعامل فقط',0,'مهمات الوقاية الشخصية آخر الحلول.']]},
  {q:'عملية تنتج غازاً ساماً ويمكن الاستغناء عنها كلياً بطريقة أخرى لا تنتجه.',opts:[['الاستغناء عنها (إزالة الخطر)',1,'الإزالة Elimination قمة الهرم.'],['عزل العملية في غرفة',0,'العزل ثالث الهرم، والإزالة أفضل.'],['تدريب العمال',0,'التدريب مهم جداً لكنه لا يزيل الخطر.']]}]},()=>{W.cs=(W.cs||0)+1;S.check()});
}

B.lesson({
 id:'u2-l3',unit:2,order:3,pages:'16–18',
 title:'المخاطر الطبيعية والبيولوجية والهندسية، والتقييم، وهرم السيطرة',
 summary:'بقية أنواع المخاطر في بيئة العمل، وكيف تُقيَّم، وهرم السيطرة عليها بالترتيب التنازلي، ومخطط المصدر والمسار والمستقبِل.',
 stations:[
  {intro:true},

  {st:1,short:'المخاطر الطبيعية',title:'٢-٢-٢ المخاطر الطبيعية <bdi dir="ltr">Physical Hazards</bdi>',ref:'ص 16',
   q:'الضجيج والحرارة ليسا مادة كيميائية ولا جرثومة… فكيف يؤذيان العامل؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ستة أنواع من المخاطر الطبيعية" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBEBDD"/><text x="180" y="156" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">المخاطر</text><text x="180" y="176" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">الطبيعية</text><g data-tip="١- الحرارة ⟦Heat⟧ وارتباطها بالرطوبة وسرعة الهواء."><circle cx="180" cy="66" r="30" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="175" y="46" width="10" height="30" rx="5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><circle cx="180" cy="80" r="8" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><path d="M180 60 v16" stroke="#E8735A" stroke-width="4"/></g><text x="230" y="50" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700">الحرارة</text><g data-tip="٢- الضوء ⟦Light⟧: الإضاءة الشديدة أو الضعيفة."><circle cx="270" cy="116" r="30" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="270" cy="110" r="12" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><rect x="264" y="122" width="12" height="8" fill="#2C4A40"/></g><text x="318" y="88" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700">الضوء</text><g data-tip="٣- الضوضاء ⟦Noise⟧: تفصيلها ووقاية الأذن منها في الوحدة الثالثة."><circle cx="270" cy="210" r="30" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M254 202 h8 l10 -9 v34 l-10 -9 h-8 z" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2" stroke-linejoin="round"/><path d="M278 202 q6 8 0 16 M284 196 q10 14 0 28" fill="none" stroke="#2C4A40" stroke-width="2"/></g><text x="322" y="248" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700">الضوضاء</text><g data-tip="٤- الإشعاع ⟦Radiation⟧."><circle cx="180" cy="256" r="30" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="180" cy="256" r="5" fill="#2C4A40"/><path d="M180 256 L170 238 A20 20 0 0 1 190 238 Z M180 256 L200 256 A20 20 0 0 1 190 273 Z M180 256 L170 273 A20 20 0 0 1 160 256 Z" fill="#F2C14E" stroke="#2C4A40" stroke-width="1.5"/></g><text x="126" y="296" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700">الإشعاع</text><g data-tip="٥- الضغط الجوي ⟦Atmospheric Pressure⟧."><circle cx="90" cy="210" r="30" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M72 218 a18 18 0 0 1 36 0" fill="none" stroke="#2C4A40" stroke-width="3"/><path d="M90 218 L100 202" stroke="#C0392B" stroke-width="3" stroke-linecap="round"/><circle cx="90" cy="218" r="3" fill="#2C4A40"/></g><text x="40" y="250" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700">الضغط</text><g data-tip="٦- الاهتزازات ⟦Vibration⟧."><circle cx="90" cy="116" r="30" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M70 116 l6 -10 l8 20 l8 -20 l8 20 l8 -20 l6 10" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round"/></g><text x="40" y="88" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700">الاهتزازات</text></svg>`,
   cap:'المخاطر الطبيعية الست في الكتاب.<br><b>مرّر المؤشر على كل دائرة (أو المسها في الجوال) لتعرف اسمها.</b>',
   side:[
    {predict:{q:'أي مما يلي من المخاطر الطبيعية؟',opts:[
     ['البكتيريا',false,'البكتيريا من المخاطر البيولوجية.'],
     ['الأتربة',false,'الأتربة من المخاطر الكيميائية.'],
     ['الضوضاء',true,'الضوضاء ثالث المخاطر الطبيعية في جدول الكتاب (ص 16).']]}}
   ],
   body:[
    {book:`<p>وهي بدورها تنقسم إلى الأضرار الناتجة من التعرض إلى:</p><div class="tablebox"><table class="tt"><thead><tr><th>#</th><th>العربية</th><th>الإنجليزية</th></tr></thead><tbody>
     <tr><td>١-</td><td>الحرارة وارتباطها بالرطوبة وسرعة الهواء.</td><td><span class="ltr">Heat</span></td></tr><tr><td>٢-</td><td>الضوء</td><td><span class="ltr">Light</span></td></tr><tr><td>٣-</td><td>الضوضاء</td><td><span class="ltr">Noise</span></td></tr><tr><td>٤-</td><td>الإشعاع</td><td><span class="ltr">Radiation</span></td></tr><tr><td>٥-</td><td>الضغط الجوي</td><td><span class="ltr">Atmospheric Pressure</span></td></tr><tr><td>٦-</td><td>الاهتزازات</td><td><span class="ltr">Vibration</span></td></tr></tbody></table></div>`,ref:'ص 16'},
    {tip:`<p>المخاطر الطبيعية «طاقة» تصل إلى الجسم، لا مادة تدخله: حرارة، أو ضوء، أو صوت، أو إشعاع، أو ضغط، أو اهتزاز. ولاحظ أن الكتاب يربط الحرارة <b>بالرطوبة وسرعة الهواء</b>؛ فالحر نفسه أصعب على الجسم في جو رطب ساكن منه في جو جاف متحرك.</p>`},
    {title:'مختبر مصغّر: أي خطر طبيعي هذا؟',widget:(el,B)=>DCML.sort(el,B,{intro:'المواقف أمثلة من عندنا، والأنواع الستة من الكتاب.',cats:['الحرارة','الضوء','الضوضاء','الإشعاع','الضغط الجوي','الاهتزازات'],items:[
     ['عامل يقف ساعات قرب فرن صهر في جو رطب.',0,'الحرارة وارتباطها بالرطوبة وسرعة الهواء.'],
     ['عامل يمسك مطرقة هوائية لتكسير الخرسانة.',5,'الأداة تهتز في يديه طوال العمل.'],
     ['فني يفحص اللحامات بجهاز أشعة سينية.',3,'الأشعة السينية إشعاع.'],
     ['غوّاص يصلح أنبوباً تحت الماء على عمق كبير.',4,'يتغير الضغط على الجسم مع العمق.'],
     ['عامل بجوار ضاغط هواء صاخب طوال اليوم.',2,'الصوت العالي ضوضاء.'],
     ['فني يقرأ مخططات دقيقة في ورشة إنارتها ضعيفة.',1,'الإضاءة غير المناسبة من مخاطر الضوء.']]})}
   ]},

  {st:2,short:'المخاطر البيولوجية',title:'٢-٢-٣ المخاطر البيولوجية',ref:'ص 17',
   q:'جرح صغير في اليد… لماذا يهم في مختبر أو مطبخ أو مزرعة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="المخاطر البيولوجية ومن يتعرض لها" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="البكتيريا والفيروسات: مصدر المخاطر البيولوجية حين تدخل إلى الجسم."><ellipse cx="180" cy="92" rx="34" ry="18" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><path d="M146 92 h-12 M214 92 h12 M164 76 l-6 -10 M196 76 l6 -10 M164 108 l-6 10 M196 108 l6 10" stroke="#2C4A40" stroke-width="2.5"/><circle cx="170" cy="90" r="3" fill="#2C4A40"/><circle cx="188" cy="96" r="3" fill="#2C4A40"/></g><g data-tip="جرح في الجسم: يساعد على دخول البكتيريا والفيروسات."><path d="M110 196 h120 c10 0 10 -12 0 -12 h-60 c-8 -6 40 -10 62 -4 c14 3 28 -2 40 -2 c10 0 10 16 0 16 h-26 c12 2 14 16 0 16 H110 Z" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round"/><path d="M150 196 l14 -6" stroke="#C0392B" stroke-width="3.5" stroke-linecap="round"/><path d="M178 112 L160 186" stroke="#C0392B" stroke-width="2.5" stroke-dasharray="5 4"/><path d="M156 178 l4 9 l7 -7" fill="none" stroke="#C0392B" stroke-width="2.5"/></g><g data-tip="العاملون بالمعامل: من أكثر العاملين تعرضاً للمخاطر البيولوجية."><path d="M60 236 h14 M64 236 v14 L54 272 h30 L72 250 v-14" fill="#BFE3DC" stroke="#2C4A40" stroke-width="2.2" stroke-linejoin="round"/></g><g data-tip="العاملون بالتغذية: من أكثر العاملين تعرضاً للمخاطر البيولوجية."><ellipse cx="180" cy="262" rx="28" ry="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.2"/><path d="M168 240 q12 -12 24 0" fill="none" stroke="#2C4A40" stroke-width="2.2"/></g><g data-tip="العاملون بالمزارع: من أكثر العاملين تعرضاً للمخاطر البيولوجية."><path d="M290 272 V240 M290 252 q-14 -4 -16 -16 q14 2 16 16 M290 246 q14 -4 16 -16 q-14 2 -16 16" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.2"/></g><text x="66" y="292" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700">المعامل</text><text x="180" y="292" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700">التغذية</text><text x="290" y="292" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700">المزارع</text></svg>`,
   cap:'الجراثيم تدخل بسهولة أكبر من الجروح.<br><b>مرّر المؤشر على الجرثومة واليد والرموز الثلاثة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'تنشأ المخاطر البيولوجية من…',opts:[
     ['الكهرباء',false,'هذه عبارة خاطئة في أسئلة الوحدة نفسها؛ الكهرباء من المخاطر الهندسية.'],
     ['البكتيريا والفيروسات ودخولها إلى الجسم',true,'الكتاب (ص 17): «تنشأ من البكتريا والفيروسات ودخولها إلى الجسم».'],
     ['الضوضاء والاهتزاز',false,'هذه مخاطر طبيعية.']]}}
   ],
   body:[
    {book:`<p>تنشأ من البكتيريا والفيروسات ودخولها إلى الجسم، وفي حالة وجود جروح بالجسم يساعد على دخولها. ومن أكثر العاملين تعرضاً للمخاطر البيولوجية العاملين بالمعامل، التغذية، المزارع</p>`,ref:'ص 17'},
    {add:`<p>من الوقاية في هذه الأعمال: تغطية الجروح بضماد لا ينفذ منه الماء، ولبس القفازات، وغسل اليدين بالماء والصابون بعد العمل وقبل الأكل، وأخذ التطعيمات التي تطلبها جهة العمل.</p>`},
    {title:'مختبر مصغّر: صح أم خطأ؟',widget:(el,B)=>DCML.tf(el,B,{items:[
     ['وجود جرح في الجسم يساعد على دخول البكتيريا والفيروسات.',true,'نص الكتاب.'],
     ['العاملون في التغذية من أكثر العاملين تعرضاً للمخاطر البيولوجية.',true,'الكتاب يذكر المعامل والتغذية والمزارع.'],
     ['تنشأ المخاطر البيولوجية بسبب الكهرباء.',false,'من عبارات أسئلة الوحدة (ص 24)؛ تنشأ من البكتيريا والفيروسات.'],
     ['عامل المختبر الذي يتعامل مع العينات لا يتعرض لمخاطر بيولوجية.',false,'العاملون بالمعامل من أكثر العاملين تعرضاً لها.']]})}
   ]},

  {st:3,short:'المخاطر الهندسية',title:'٢-٢-٤ المخاطر الهندسية <bdi dir="ltr">Engineering Hazards</bdi>',ref:'ص 17',
   q:'كرسي غير مريح… هل يُعدّ خطراً مثل آلة دوّارة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ثلاثة أنواع من المخاطر الهندسية" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E3ECF7"/><g data-tip="المخاطر الميكانيكية ⟦Mechanical Hazards⟧: الناتجة من تشغيل العدد والآلات والماكينات."><circle cx="270" cy="120" r="44" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="262" cy="124" r="20" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><circle cx="262" cy="124" r="6" fill="#2C4A40"/><path d="M262 98 v-6 M262 150 v6 M236 124 h-6 M288 124 h6 M244 106 l-4 -4 M280 142 l4 4 M280 106 l4 -4 M244 142 l-4 4" stroke="#2C4A40" stroke-width="5"/></g><text x="270" y="190" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">ميكانيكية</text><g data-tip="المخاطر الكهربية ⟦Electrical Hazards⟧: الناتجة من التوصيلات الكهربائية وخلافه."><circle cx="90" cy="120" r="44" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M96 90 L76 124 H92 L82 152 L108 114 H92 L102 90 Z" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round"/></g><text x="90" y="190" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">كهربية</text><g data-tip="الإيرجنومكس ⟦Ergonomics Hazards⟧: تنشأ من عدم ملاءمة ظروف العمل للعاملين، مثل وضعية جلوس أو حمل غير مناسبة."><circle cx="180" cy="226" r="44" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="176" cy="200" r="8" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><path d="M178 208 Q170 222 176 236 H196 V256" fill="none" stroke="#2C4A40" stroke-width="5" stroke-linecap="round"/><path d="M162 236 H202 M168 236 V258 M196 236 V258" stroke="#4FB3A9" stroke-width="4"/><path d="M178 214 L196 222" stroke="#2C4A40" stroke-width="4" stroke-linecap="round"/></g><text x="180" y="290" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">إيرجنومكس</text></svg>`,
   cap:'المخاطر الهندسية ثلاثة أنواع.<br><b>مرّر المؤشر على الترس والصاعقة والجالس (أو المسها في الجوال) لتعرف كل نوع.</b>',
   side:[
    {predict:{q:'عامل يحمل صناديق ثقيلة وهو منحنٍ طوال اليوم فيؤلمه ظهره. أي نوع من المخاطر؟',opts:[
     ['المخاطر الميكانيكية',false,'لا توجد آلة أو عدة تسبب الإصابة هنا.'],
     ['الإيرجنومكس',true,'الكتاب (ص 17): «تنشأ من عدم ملاءمة ظروف العمل للعاملين».'],
     ['المخاطر البيولوجية',false,'لا بكتيريا ولا فيروسات في الموقف.']]}}
   ],
   body:[
    {book:`<p>وهي بدورها تنقسم إلى:</p><ul><li>المخاطر الميكانيكية: Mechanical Hazards الناتجة من تشغيل العدد والآلات والماكينات.</li><li>المخاطر الكهربية: Electrical Hazards الناتجة من التوصيلات الكهربائية وخلافه.</li><li>الإيرجنومكس: Ergonomics Hazards وتنشأ من عدم ملاءمة ظروف العمل للعاملين.</li></ul>`,ref:'ص 17'},
    {tip:`<p>كلمة الإيرجنومكس تعني «ملاءمة العمل للإنسان»: ارتفاع الطاولة، ووضعية الجلوس، ووزن ما يُحمل، وتكرار الحركة. الإصابة هنا لا تأتي فجأة كالجرح، بل تتراكم مع الأيام (آلام الظهر والرقبة والمعصم).</p>`},
    {title:'مختبر مصغّر: صنّف الخطر الهندسي',widget:(el,B)=>DCML.sort(el,B,{intro:'المواقف أمثلة من عندنا.',cats:['ميكانيكي','كهربي','إيرجنومكس'],items:[
     ['يد عامل قريبة من سير ناقل وبكرة تدور بلا حاجز.',0,'ناتج من تشغيل الآلات.'],
     ['تمديدة مؤقتة بكابل مقطوع العزل على أرض مبللة.',1,'ناتج من التوصيلات الكهربائية.'],
     ['شاشة حاسب منخفضة جداً فينحني الفني ساعات.',2,'عدم ملاءمة ظروف العمل للعامل.'],
     ['حجر جلخ يدور بسرعة عالية.',0,'العدد والآلات والماكينات.'],
     ['قاطع في لوحة غطاؤه مكسور فتظهر أطرافه.',1,'من التوصيلات الكهربائية.']]})}
   ]},

  {st:4,short:'التقييم',title:'٢-٣ التقييم <bdi dir="ltr">Evaluation</bdi>',ref:'ص 17',
   q:'عرفنا أن في الورشة غباراً… فكيف نعرف هل هو كثير أم قليل؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ثلاث خطوات للتقييم" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBEBDD"/><g data-tip="١- تقييم المخاطر وتحديد مدى درجة خطورتها على صحة العاملين نتيجة التعرض لها."><circle cx="270" cy="110" r="40" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M246 120 a24 24 0 0 1 48 0" fill="none" stroke="#2C4A40" stroke-width="4"/><path d="M246 120 a24 24 0 0 1 12 -20" fill="none" stroke="#12855A" stroke-width="4"/><path d="M282 100 a24 24 0 0 1 12 20" fill="none" stroke="#C0392B" stroke-width="4"/><path d="M270 120 L284 104" stroke="#2C4A40" stroke-width="3.5" stroke-linecap="round"/></g><text x="270" y="170" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">١ درجة الخطورة</text><g data-tip="٢- تقييم وسائل التحكم الموجودة فعلياً وهل هي كافية أم لا."><circle cx="180" cy="210" r="40" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="164" y="186" width="32" height="44" rx="3" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M170 200 l4 4 l7 -7 M170 216 l4 4 l7 -7" fill="none" stroke="#12855A" stroke-width="2.4"/><text x="190" y="206" font-size="13" font-weight="700" fill="#C0392B">؟</text></g><text x="180" y="272" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">٢ هل الوسائل كافية؟</text><g data-tip="٣- أخذ العينات وتحليلها ومقارنتها بالمواصفات القياسية (مثل حدود التعرض في الدرس السابق)."><circle cx="90" cy="110" r="40" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M74 88 v34 a8 8 0 0 0 16 0 v-34 z" fill="#BFE3DC" stroke="#2C4A40" stroke-width="2.2"/><text x="100" y="114" font-size="16" font-weight="700" fill="#2C4A40">=</text><rect x="104" y="96" width="14" height="26" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/></g><text x="90" y="170" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">٣ العينات والمقارنة</text></svg>`,
   cap:'التقييم ثلاث خطوات بعد التعرف على المخاطر.<br><b>مرّر المؤشر على المقياس والقائمة والأنبوب (أو المسها في الجوال) لتعرف كل خطوة.</b>',
   side:[
    {predict:{q:'متى يبدأ التقييم؟',opts:[
     ['بعد التعرف على المخاطر الموجودة في بيئة العمل',true,'الكتاب (ص 17): «بعد التعرف على المخاطر الموجودة فى بيئة العمل يتم…».'],
     ['قبل أن نعرف ما المخاطر',false,'لا نستطيع تقييم خطر لم نتعرف عليه.'],
     ['بعد وقوع الإصابة فقط',false,'التقييم وقائي، يجري قبل الإصابة.']]}}
   ],
   body:[
    {book:`<p>بعد التعرف على المخاطر الموجودة في بيئة العمل يتم:</p><ol><li>تقييم هذه المخاطر وتحديد مدى درجة خطورتها على صحة العاملين نتيجة التعرض لها.</li><li>يتم كذلك تقييم وسائل التحكم الموجودة فعلياً وهل هي كافية أم لا.</li><li>يتم أخذ العينات وتحليلها ومقارنتها بالمواصفات القياسية.</li></ol>`,ref:'ص 17'},
    {tip:`<p>الخطوة الثالثة هي ما فعلناه في الدرس السابق: نقيس تركيز المادة خلال اليوم، ونحسب المتوسط، ثم نقارنه بالحد المسموح (<span class="ltr">TWA</span>). النتيجة تخبرنا هل وسائل التحكم الحالية كافية (الخطوة الثانية).</p>`},
    {title:'مختبر مصغّر: رتّب العمل',widget:(el,B)=>DCML.order(el,B,{intro:'اضغط الخطوات بالترتيب: التعرف أولاً، ثم خطوات التقييم الثلاث كما في الكتاب.',steps:[
     ['التعرف على المخاطر الموجودة في بيئة العمل','التقييم يبدأ «بعد التعرف على المخاطر».'],
     ['تقييم المخاطر وتحديد درجة خطورتها على صحة العاملين','هذه الخطوة الأولى من التقييم في الكتاب.'],
     ['تقييم وسائل التحكم الموجودة فعلياً: هل هي كافية؟','هذه الخطوة الثانية.'],
     ['أخذ العينات وتحليلها ومقارنتها بالمواصفات القياسية','هذه الخطوة الثالثة.']],done:'تعرّف ← قيّم الخطورة ← قيّم الوسائل ← قِس وقارن.'})}
   ]},

  {st:5,short:'هرم السيطرة',title:'٢-٤ السيطرة <bdi dir="ltr">Control</bdi>',ref:'ص 17',
   q:'لماذا تأتي الكمامة والقفازات في آخر القائمة لا في أولها؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="هرم السيطرة بالترتيب التنازلي" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="١- الإزالة ⟦Elimination⟧: إزالة مصدر الخطر نهائياً. قمة الهرم وأكثر الوسائل فاعلية."><path d="M150 44 H210 L226 80 H134 Z" fill="#12855A" stroke="#2C4A40" stroke-width="2"/><text x="180" y="68" text-anchor="middle" font-size="12" font-weight="700" fill="#FBF6EE">الإزالة</text></g><g data-tip="٢- التعويض ⟦Substitution⟧: استبدال المادة أو العملية بأخرى أقل ضرراً."><path d="M134 80 H226 L242 116 H118 Z" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/><text x="180" y="104" text-anchor="middle" font-size="12" font-weight="700" fill="#FBF6EE">التعويض</text></g><g data-tip="٣- العزل ⟦Isolation⟧: فصل الخطر عن العاملين مكاناً أو زماناً."><path d="M118 116 H242 L258 152 H102 Z" fill="#9ED3C8" stroke="#2C4A40" stroke-width="2"/><text x="180" y="140" text-anchor="middle" font-size="12" font-weight="700" fill="#2C4A40">العزل</text></g><g data-tip="٤- التحكم الهندسي ⟦Engineering Control⟧: تعديل المعدات أو المكان، مثل الشفط الموضعي والحواجز."><path d="M102 152 H258 L274 188 H86 Z" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="180" y="176" text-anchor="middle" font-size="12" font-weight="700" fill="#2C4A40">التحكم الهندسي</text></g><g data-tip="٥- التحكم الإداري ⟦Administration Control⟧: إجراءات وتعليمات وتدريب وتنظيم أوقات العمل."><path d="M86 188 H274 L290 224 H70 Z" fill="#F6B48F" stroke="#2C4A40" stroke-width="2"/><text x="180" y="212" text-anchor="middle" font-size="12" font-weight="700" fill="#2C4A40">التحكم الإداري</text></g><g data-tip="٦- استخدام مهمات الوقاية الشخصية ⟦Use PPE⟧: آخر الحلول، تحمي من يلبسها فقط وبشرط أن يلبسها صحيحاً."><path d="M70 224 H290 L306 260 H54 Z" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><text x="180" y="248" text-anchor="middle" font-size="12" font-weight="700" fill="#FBF6EE">مهمات الوقاية الشخصية</text></g><g data-tip="الترتيب التنازلي: من الأعلى (الأكثر فاعلية) إلى الأسفل (الأقل فاعلية)."><path d="M318 60 V250" stroke="#2C4A40" stroke-width="2.5"/><path d="M318 250 l-6 -10 h12 z" fill="#2C4A40"/></g><text x="180" y="286" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="600">من الأكثر فاعلية إلى الأقل</text></svg>`,
   cap:'هرم السيطرة (رسم توضيحي؛ الكتاب يذكر الترتيب في جدول ولا يرسم الهرم).<br><b>مرّر المؤشر على كل طبقة والسهم (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'ما قمة هرم السيطرة (أكثر الوسائل فاعلية)؟',opts:[
     ['استخدام مهمات الوقاية الشخصية',false,'هذه آخر الهرم في الكتاب.'],
     ['التحكم الإداري',false,'هذا الخامس في الترتيب.'],
     ['الإزالة Elimination',true,'الترتيب التنازلي في الكتاب (ص 17) يبدأ بالإزالة.']]}}
   ],
   body:[
    {book:`<p>يتم اتباع نظام هرم السيطرة بالترتيب التنازلي وذلك للتحكم والسيطرة (الشكل <span class="ltr">(8-2)</span>) على هذه المخاطر وذلك بالترتيب الآتي:</p><div class="tablebox"><table class="tt"><thead><tr><th>العربية</th><th>الإنجليزية</th></tr></thead><tbody>
     <tr><td>- الإزالة</td><td><span class="ltr">Elimination</span></td></tr><tr><td>- التعويض</td><td><span class="ltr">Substitution</span></td></tr><tr><td>- العزل</td><td><span class="ltr">Isolation</span></td></tr><tr><td>- التحكم الهندسي</td><td><span class="ltr">Engineering Control</span></td></tr><tr><td>- التحكم الإداري</td><td><span class="ltr">Administration Control</span></td></tr><tr><td>- استخدام مهمات الوقاية الشخصية</td><td><span class="ltr">Use PPE</span></td></tr></tbody></table></div>`,ref:'ص 17'},
    {watch:`<p>يحيل الكتاب هنا إلى «الشكل ٢-٧»، وهو شكل حدود التعرض؛ والمقصود الشكل <span class="ltr">(8-2)</span> «مخطط عام لنظرية السيطرة»، فصححنا الإحالة. وفي الجدول «<span class="ltr">Use PP</span>» والمقصود <span class="ltr">Use PPE</span> (مهمات الوقاية الشخصية).</p>`,fix:true},
    {tip:`<p>كلما صعدنا في الهرم صار الحل <b>أقوى وأقل اعتماداً على سلوك العامل</b>: الإزالة تُنهي الخطر، والتعويض يخففه من أصله، والعزل والتحكم الهندسي يحجزانه. أما التحكم الإداري ومهمات الوقاية فتعتمد على أن يلتزم العامل بالتعليمات ويلبس المهمات صحيحاً كل مرة.</p>`},
    {title:'مختبر مصغّر: في أي طبقة من الهرم؟',widget:(el,B)=>DCML.sort(el,B,{intro:'الوسائل أمثلة من عندنا، والطبقات من الكتاب.',cats:['الإزالة','التعويض','العزل','التحكم الهندسي','التحكم الإداري','مهمات الوقاية'],items:[
     ['إلغاء خطوة التنظيف بالمذيب نهائياً بعد تغيير تصميم القطعة.',0,'الخطر لم يعد موجوداً = إزالة.'],
     ['استعمال دهان مائي بدل الدهان الزيتي المذيب.',1,'مادة أقل ضرراً مكان الأخرى = تعويض.'],
     ['وضع المولد الصاخب في غرفة منفصلة بعيداً عن العمال.',2,'فصل الخطر عن العاملين مكاناً = عزل.'],
     ['تركيب شفاط موضعي فوق طاولة اللحام.',3,'تعديل في المعدات يلتقط الملوث = تحكم هندسي.'],
     ['جدول يبدّل العمال بين المهام حتى لا يطول تعرّض أحدهم.',4,'تنظيم أوقات العمل = تحكم إداري.'],
     ['سدادات أذن للعمال قرب المكبس.',5,'تحمي من يلبسها فقط = مهمات الوقاية الشخصية.']]})}
   ]},

  {st:6,short:'المصدر والمسار والمستقبِل',title:'الشكل (8-2): مخطط عام لنظرية السيطرة',ref:'ص 18',
   q:'أين نوقف البخار: عند الحوض الذي يخرج منه، أم في الهواء، أم عند أنف العامل؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="المصدر والمسار والمستقبل" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E3ECF7"/><g data-tip="المصدر ⟦SOURCE⟧: حوض الغمس ⟦Dip Tank⟧ الذي يخرج منه الملوث. السيطرة هنا تمنع الملوث من أصله."><rect x="44" y="168" width="84" height="48" fill="#BFE3DC" stroke="#2C4A40" stroke-width="2.5"/><path d="M44 178 h84" stroke="#4FB3A9" stroke-width="3"/><path d="M60 132 H108 M86 132 V160" stroke="#2C4A40" stroke-width="3"/><rect x="78" y="156" width="16" height="16" fill="#9AA5A0" stroke="#2C4A40" stroke-width="2"/></g><g data-tip="المسار في الهواء ⟦AIR PATH⟧: الطريق الذي يسير فيه الملوث من المصدر إلى العامل. السيطرة هنا تخففه أو تبعده."><path d="M110 162 C140 130 164 150 188 136 C210 124 228 140 246 132" fill="none" stroke="#C0392B" stroke-width="3" stroke-dasharray="6 4"/><path d="M160 110 h20 M174 104 l6 6 l-6 6" fill="none" stroke="#2C4A40" stroke-width="2"/></g><g data-tip="المستقبِل ⟦RECEIVER⟧: العامل الذي يصل إليه الملوث. السيطرة هنا تحميه هو، مثل التدريب وتدوير العمال وأجهزة التنفس."><circle cx="266" cy="130" r="18" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5"/><path d="M240 216 V176 a26 24 0 0 1 52 0 V216 Z" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5"/></g><path d="M40 244 H320" stroke="#2C4A40" stroke-width="2"/><path d="M136 236 V252 M214 236 V252" stroke="#2C4A40" stroke-width="2"/><text x="86" y="268" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">المصدر</text><text x="175" y="268" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">المسار</text><text x="266" y="268" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">المستقبِل</text><g font-family="var(--mono)" font-size="10" fill="#2C4A40" text-anchor="middle"><text x="86" y="284">SOURCE</text><text x="175" y="284">AIR PATH</text><text x="266" y="284">RECEIVER</text></g></svg>`,
   cap:'كما في الشكل <span class="ltr">(8-2)</span>: الملوث يخرج من الحوض (يسار)، ويمر في الهواء، ويصل إلى العامل (يمين).<br><b>مرّر المؤشر على الحوض والخط الأحمر والعامل (أو المسها في الجوال) لتعرف كل جزء.</b>',
   side:[
    {predict:{q:'«التدريب والتثقيف» وسيلة سيطرة تعمل عند…',opts:[
     ['المصدر',false,'التدريب لا يغيّر الحوض ولا المادة.'],
     ['المسار في الهواء',false,'التدريب لا يغيّر طريق الملوث في الهواء.'],
     ['المستقبِل (العامل)',true,'في الشكل <span class="ltr">(8-2)</span> هو أول بنود عمود <span class="ltr">RECEIVER</span>، ومكتوب بجانبه <span class="ltr">MOST IMPORTANT</span>.']]}}
   ],
   body:[
    {book:`<p>عنوان الشكل: <span class="ltr">GENERALIZED DIAGRAM OF METHODS OF CONTROL</span> — «الشكل ٨-٢ (مخطط عام لنظرية السيطرة)». وبنوده كما في الكتاب (بالإنجليزية فقط):</p>
     <div dir="ltr" style="text-align:left;font-size:13px;line-height:1.7"><p><b>SOURCE:</b> 1. SUBSTITUTION WITH A LESS HARMFUL MATERIAL (WATER IN PLACE OF ORGANIC SOLVENT) · 2. CHANGE OF PROCESS (AIRLESS PAINT SPRAYING) · 3. ENCLOSURE OF PROCESS (GLOVE-BOX) · 4. ISOLATION OF PROCESS (SPACE OR TIME) · 5. WET METHODS (HYDRO BLAST) · 6. LOCAL EXHAUST VENTILATION (CAPTURE AT SOURCE) · 7. ADEQUATE MAINTENANCE PROGRAM</p>
     <p><b>AIR PATH:</b> 1. HOUSEKEEPING (IMMEDIATE CLEANUP) · 2. GENERAL EXHAUST VENTILATION (ROOF FANS) · 3. DILUTION VENTILATION (SUPPLIED AIR) · 4. INCREASE DISTANCE BETWEEN SOURCE AND RECEIVER (SEMI-AUTOMATIC OR REMOTE CONTROL) · 5. CONTINUOUS AREA MONITORING (PRE-SET ALARMS) · 6. ADEQUATE MAINTENANCE PROGRAM</p>
     <p><b>RECEIVER:</b> 1. TRAINING &amp; EDUCATION (MOST IMPORTANT) · 2. ROTATION OF WORKERS (SPLIT UP DOSE) · 3. ENCLOSURE OF WORKER (AIR CONDITIONED CRANE CABS) · 4. PERSONAL MONITORING DEVICES (DOSIMETERS) · 5. PERSONAL PROTECTIVE DEVICES (RESPIRATORS) · 6. ADEQUATE MAINTENANCE PROGRAM</p></div>`,ref:'ص 18'},
    {tip:`<p>كلما كانت السيطرة <b>أقرب إلى المصدر</b> كانت أفضل، لأنها تمنع الملوث قبل أن ينتشر. أما وسائل المستقبِل (مثل جهاز التنفس) فتحمي عاملاً واحداً فقط، وتعتمد على التزامه باستعمالها. ولاحظ أن «برنامج صيانة مناسب» يتكرر في الأعمدة الثلاثة: كل وسيلة تفقد فائدتها إذا لم تُصَن.</p>`},
    {title:'مختبر مصغّر: افتح كل عمود',widget:(el,B)=>DCML.lab(el,B,{intro:'اختر مكان السيطرة، فترى وسائله من الشكل (الترجمة من عندنا)، وكيف يخف ما يصل إلى العامل في الرسم (تمثيل وصفي بلا أرقام).',
     ins:[{k:'c',l:'أين نسيطر على الملوث؟',seg:[[0,'عند المصدر'],[1,'في المسار'],[2,'عند المستقبِل']],v:0}],
     calc:(s)=>{const c=s.c,m=[0,0,0];m[c]=3;
      const it=c===0?[CTRL[0][1],CTRL[1][1],CTRL[2][1],'عزل العملية مكاناً أو زماناً',CTRL[4][1],CTRL[3][1]]:CTRL.filter(x=>x[2]===c).map(x=>x[1]);const list=it.concat(['برنامج صيانة مناسب']).map(x=>`<li>${x}</li>`).join('');
      const why=['تمنع الملوث من أصله أو تلتقطه قبل أن ينتشر، فتحمي كل من في المكان.','تخفف الملوث في الهواء أو تبعده عن العامل، بعد أن خرج من المصدر.','تحمي العامل نفسه أو تقلل جرعته، والملوث ما زال في المكان.'][c];
      return {pic:`<div style="max-width:520px;margin:auto">${spr(m)}</div><ul style="margin:8px 0 0;padding-inline-start:22px;line-height:1.8">${list}</ul>`,msg:why}}})}
   ]},

  {recap:[
   'المخاطر الطبيعية: الحرارة (مع الرطوبة وسرعة الهواء)، والضوء، والضوضاء، والإشعاع، والضغط الجوي، والاهتزازات (ص 16).',
   'البيولوجية من البكتيريا والفيروسات، وتساعد الجروح على دخولها؛ وأكثر المعرّضين: المعامل والتغذية والمزارع (ص 17).',
   'الهندسية: ميكانيكية (الآلات)، وكهربية (التوصيلات)، وإيرجنومكس (عدم ملاءمة ظروف العمل) (ص 17).',
   'التقييم بعد التعرف: درجة الخطورة، وكفاية وسائل التحكم، والعينات والمقارنة بالمواصفات (ص 17).',
   'هرم السيطرة تنازلياً: الإزالة ← التعويض ← العزل ← التحكم الهندسي ← التحكم الإداري ← مهمات الوقاية الشخصية؛ والسيطرة عند المصدر أو المسار أو المستقبِل (ص 17–18).']}
],
 theory:[
  {h:'٢-٢-٢ المخاطر الطبيعية Physical Hazards',ref:'ص 16',html:`<p>وهي بدورها تنقسم إلى الأضرار الناتجة من التعرض إلى:</p><div class="tablebox"><table class="tt"><thead><tr><th>#</th><th>الخطر</th><th>بالإنجليزية</th></tr></thead><tbody>${[['الحرارة وارتباطها بالرطوبة وسرعة الهواء','Heat'],['الضوء','Light'],['الضوضاء','Noise'],['الإشعاع','Radiation'],['الضغط الجوي','Atmospheric Pressure'],['الاهتزازات','Vibration']].map((r,i)=>`<tr><td>${i+1}</td><td>${r[0]}</td><td>${lt(r[1])}</td></tr>`).join('')}</tbody></table></div>`},
  {h:'٢-٢-٣ المخاطر البيولوجية',ref:'ص 17',html:`<p>تنشأ من البكتيريا والفيروسات ودخولها إلى الجسم، وفي حالة وجود جروح بالجسم يساعد على دخولها. ومن أكثر العاملين تعرضاً للمخاطر البيولوجية العاملين بالمعامل، والتغذية، والمزارع.</p>`},
  {h:'٢-٢-٤ المخاطر الهندسية Engineering Hazards',ref:'ص 17',html:`<p>وهي بدورها تنقسم إلى:</p><ul><li><b>المخاطر الميكانيكية</b> ${lt('Mechanical Hazards')}: الناتجة من تشغيل العدد والآلات والماكينات.</li><li><b>المخاطر الكهربية</b> ${lt('Electrical Hazards')}: الناتجة من التوصيلات الكهربائية وخلافه.</li><li><b>الإيرجنومكس</b> ${lt('Ergonomics Hazards')}: وتنشأ من عدم ملاءمة ظروف العمل للعاملين.</li></ul>`},
  {h:'٢-٣ التقييم Evaluation',ref:'ص 17',html:`<p>بعد التعرف على المخاطر الموجودة في بيئة العمل يتم:</p><ol><li>تقييم هذه المخاطر وتحديد مدى درجة خطورتها على صحة العاملين نتيجة التعرض لها.</li><li>تقييم وسائل التحكم الموجودة فعلياً وهل هي كافية أم لا.</li><li>أخذ العينات وتحليلها ومقارنتها بالمواصفات القياسية.</li></ol>`},
  {h:'٢-٤ السيطرة Control',ref:'ص 17',html:`<p>يتم اتباع نظام <b>هرم السيطرة بالترتيب التنازلي</b> وذلك للتحكم والسيطرة على هذه المخاطر (الشكل (8-2))، وذلك بالترتيب الآتي:</p><ol>${HIER.map(h=>`<li>${h[0]} ${lt(h[1])}</li>`).join('')}</ol>`},
  {widget:el=>{el.innerHTML=fig(pyrSVG(6),'رسم توضيحي (ليس من الكتاب): هرم السيطرة بالترتيب التنازلي؛ الكتاب يذكر الترتيب في جدول ولا يرسم الهرم','ص 17',420)}},
  {err:'<span class="fixnote">يحيل الكتاب هنا إلى «الشكل ٢-٧»، وهو شكل حدود التعرض؛ والمقصود الشكل (8-2) «مخطط عام لنظرية السيطرة»، فصححنا الإحالة. وفي الجدول «Use PP» والمقصود Use PPE (مهمات الوقاية الشخصية).</span>'},
  {fig:'(8-2)',ref:'ص 18',caption:'مخطط عام لنظرية السيطرة: وسائل عند المصدر، وفي المسار، وعند المستقبِل',draw:()=>`<div class="svgbox" style="max-width:560px;margin-inline:auto">${spr([0,0,0])}</div>
   <div class="tablebox"><table class="tt"><thead><tr><th>SOURCE المصدر</th><th>AIR PATH المسار</th><th>RECEIVER المستقبِل</th></tr></thead><tbody><tr>${[0,1,2].map(c=>`<td style="vertical-align:top"><ol style="padding-inline-start:18px;margin:0">${CTRL.filter(x=>x[2]===c).map(x=>`<li>${x[1]}</li>`).join('')}<li>برنامج صيانة مناسب (ADEQUATE MAINTENANCE PROGRAM)</li></ol></td>`).join('')}</tr></tbody></table></div><p class="sub">عناوين البنود في الشكل بالإنجليزية فقط؛ الترجمة من عندنا. ومن بنود المصدر أيضاً «4. ISOLATION OF PROCESS (SPACE OR TIME)» عزل العملية مكاناً أو زماناً.</p>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> كلما كانت السيطرة <b>أقرب إلى المصدر</b> كانت أفضل، لأنها تمنع الملوث قبل أن ينتشر. أما وسائل المستقبِل (مثل جهاز التنفس) فتحمي عاملاً واحداً فقط، وتعتمد على التزامه باستعمالها.'}
 ],
 lab:(el)=>lab23(el),
 quiz:[
  {q:'أي مما يلي من المخاطر الطبيعية؟',o:['البكتيريا','الضوضاء','التوصيلات الكهربائية','الأتربة'],c:1,e:'المخاطر الطبيعية: الحرارة، الضوء، الضوضاء، الإشعاع، الضغط الجوي، الاهتزازات (ص 16).'},
  {q:'المخاطر البيولوجية تنشأ من:',o:['الكهرباء','البكتيريا والفيروسات','الآلات','الضوضاء'],c:1,e:'(ص 17).'},
  {q:'الإيرجنومكس من المخاطر الهندسية، وتنشأ من:',o:['عدم ملاءمة ظروف العمل للعاملين','الإشعاع','المواد الكيميائية','الجراثيم'],c:0,e:'(ص 17).'},
  {q:'قمة هرم السيطرة (أكثر الوسائل فاعلية):',o:['مهمات الوقاية الشخصية','التحكم الإداري','الإزالة','العزل'],c:2,e:'الترتيب التنازلي يبدأ بالإزالة Elimination (ص 17).'},
  {q:'آخر وسيلة في هرم السيطرة:',o:['التعويض','استخدام مهمات الوقاية الشخصية','التحكم الهندسي','العزل'],c:1,e:'(ص 17).'},
  {q:'في الشكل (8-2) «التهوية العامة بمراوح السقف» وسيلة تعمل عند:',o:['المصدر','المسار في الهواء','المستقبِل','لا شيء مما سبق'],c:1,e:'تحت عمود AIR PATH (ص 18).'}
 ]
});

/* =====================================================================
   u2-l4 — تصنيف المناطق الخطرة والأجهزة المقاومة للانفجار (ص 18–24)
   ===================================================================== */
const GROUPS=[['A','(أ)','I','الأجواء التي تحتوي على غاز الاستيلين'],['B','(ب)','I','الأجواء التي تحتوي على غاز الهيدروجين'],['C','(ج)','I','الأجواء التي تحتوي على الإثيل إثير'],['D','(د)','I','الأجواء التي تحتوي على المواد البترولية (الجازولين ..)'],['E','(هـ)','II','الأتربة المعدنية (الألومنيوم – الماغنسيوم)'],['F','(و)','II','أتربة الكربون (الفحم …)'],['G','(ز)','II','الدقيق والنشا']];
const wrapT=(t,n)=>{const w=t.split(' '),L=[''];w.forEach(x=>{if((L[L.length-1]+' '+x).trim().length>n)L.push(x);else L[L.length-1]=(L[L.length-1]+' '+x).trim()});return L};
function twoPanel(title,a,b,foot){/* a/b: {icon, cls, txt} */
 let s=`<svg viewBox="0 0 560 ${foot?256:240}" role="img" aria-label="${title}"><text class="txt" x="280" y="18" text-anchor="middle">${title}</text><rect x="10" y="28" width="540" height="150" style="fill:none;stroke:var(--fg)"/><path d="M280 28V178" style="stroke:var(--fg)"/>`;
 [a,b].forEach((p,i)=>{const x0=10+i*270;s+=`<g transform="translate(${x0} 28)">${p.icon}</g><text class="txt" x="${x0+135}" y="196" text-anchor="middle" style="font-size:12.5px">${p.cls}</text>`+wrapT(p.txt,44).map((ln,k)=>`<text class="txt m" x="${x0+135}" y="${211+k*12}" text-anchor="middle" style="font-size:9.5px">${ln}</text>`).join('')});
 if(foot)s+=`<text class="txt" x="280" y="${foot?248:228}" text-anchor="middle">${foot}</text>`;
 return s+'</svg>'}
const man=(x,y)=>`<g style="stroke:var(--fg);stroke-width:2.4;fill:none;stroke-linecap:round"><circle cx="${x}" cy="${y}" r="8" style="fill:var(--surface)"/><path d="M${x} ${y+8}v34l-8 26M${x} ${y+42}l8 26M${x} ${y+18}l16 10M${x} ${y+18}l-12 12"/></g><path d="M${x-9} ${y-3}a9 8 0 0 1 18 0z" style="fill:var(--live)"/>`;
const ICON={
 spray:`<path d="M30 20v100" style="stroke:var(--fg)"/>${[0,1,2,3].map(i=>`<path d="M${50+i*10} 30c6 10-6 20 0 30s-6 20 0 30" style="fill:none;stroke:var(--live);stroke-width:1.6"/>`).join('')}<path d="M140 50h80l-20 50h-40z" style="fill:var(--surface-2);stroke:var(--fg)"/>${man(110,60)}<text class="txt m" x="20" y="146">SPRAY AREA</text>`,
 store:`<rect x="150" y="30" width="96" height="110" style="fill:none;stroke:var(--fg)"/>${[0,1,2].map(i=>`<path d="M150 ${58+i*28}h96" style="stroke:var(--fg)"/>`).join('')}${[0,1,2,3].map(r=>[0,1,2].map(c=>`<rect x="${156+c*30}" y="${34+r*28}" width="20" height="20" rx="4" style="fill:var(--live-soft);stroke:var(--fg)"/>`).join('')).join('')}<text class="txt m" x="20" y="60">FLAMMABLE LIQUIDS</text><text class="txt m" x="20" y="146">STORAGE</text>`,
 dust1:`<rect x="30" y="40" width="60" height="100" style="fill:var(--surface-2);stroke:var(--fg)"/>${Array.from({length:22},(x,i)=>`<circle cx="${90+(i*37)%80}" cy="${40+(i*23)%50}" r="2" style="fill:var(--muted)"/>`).join('')}${man(120,70)}<rect x="170" y="110" width="70" height="30" style="fill:var(--surface-2);stroke:var(--fg)"/><text class="txt m" x="150" y="30">DUST CLOUDS IN AIR</text><text class="txt m" x="20" y="148">EQUIPMENT</text>`,
 dust2:`<rect x="30" y="40" width="50" height="100" style="fill:var(--surface-2);stroke:var(--fg)"/><rect x="110" y="104" width="140" height="10" style="fill:var(--fg)"/><path d="M120 114v26M240 114v26" style="stroke:var(--fg)"/>${man(180,48)}<text class="txt m" x="20" y="148">PROCESSING EQUIPMENT</text><text class="txt m" x="150" y="30">CONVEYOR SYSTEMS</text>`,
 fib1:`<path d="M30 30h60v40" style="fill:none;stroke:var(--fg);stroke-width:8"/><path d="M75 70h30l-15 20z" style="fill:var(--surface-2);stroke:var(--fg)"/><rect x="50" y="100" width="90" height="30" style="fill:var(--surface);stroke:var(--fg)"/><circle cx="65" cy="134" r="6" style="fill:var(--fg)"/><circle cx="125" cy="134" r="6" style="fill:var(--fg)"/>${Array.from({length:14},(x,i)=>`<circle cx="${56+(i*13)%80}" cy="${96+(i%3)*3}" r="4" style="fill:var(--surface-2);stroke:var(--muted)"/>`).join('')}${man(190,60)}<rect x="215" y="50" width="30" height="40" style="fill:var(--surface-2);stroke:var(--fg)"/><text class="txt m" x="20" y="22">COTTON GIN</text><text class="txt m" x="200" y="146">CONTROL PANEL</text>`,
 fib2:`<rect x="30" y="60" width="40" height="80" style="fill:var(--surface-2);stroke:var(--fg)"/><rect x="76" y="60" width="40" height="80" style="fill:var(--surface-2);stroke:var(--fg)"/><rect x="160" y="100" width="90" height="40" style="fill:var(--surface);stroke:var(--fg)"/>${man(200,40)}<text class="txt m" x="20" y="22">FIBERS STORED OR HANDLED</text>`};
const F29=()=>twoPanel('GASES OR VAPORS',{icon:ICON.spray,cls:'CLASS I, DIVISION 1',txt:'FLAMMABLE GASES AND VAPORS EXIST UNDER NORMAL OPERATING CONDITIONS'},{icon:ICON.store,cls:'CLASS I, DIVISION 2',txt:'FLAMMABLE LIQUIDS AND GASES ARE CONTAINED IN ENCLOSED CONTAINERS OR SYSTEMS'},'GROUPS A, B, C, AND D — FAMILY OF CHEMICALS');
const F210=()=>twoPanel('COMBUSTIBLE DUSTS',{icon:ICON.dust1,cls:'CLASS II, DIVISION 1',txt:'COMBUSTIBLE DUSTS ARE PRESENT IN THE AIR UNDER NORMAL OPERATING CONDITIONS'},{icon:ICON.dust2,cls:'CLASS II, DIVISION 2',txt:'COMBUSTIBLE DUSTS ARE NOT PRESENT IN THE AIR UNDER NORMAL OPERATING CONDITIONS'});
const F211=()=>twoPanel('IGNITABLE FIBERS OR FLYINGS',{icon:ICON.fib1,cls:'CLASS III, DIVISION 1',txt:'WHERE IGNITIBLE FIBERS OR FLYINGS ARE USED OR MANUFACTURED'},{icon:ICON.fib2,cls:'CLASS III, DIVISION 2',txt:'WHERE IGNITIBLE FIBERS OR FLYINGS ARE STORED OR HANDLED'});
function dSymbol(){return `<svg viewBox="0 0 260 150" role="img" aria-label="رمز الغلاف المقاوم للهب d"><rect x="80" y="20" width="100" height="80" style="fill:var(--surface);stroke:var(--fg);stroke-width:5"/><path d="M40 52H80M40 68H80M180 52H220M180 68H220" style="stroke:var(--fg);stroke-width:6"/><path d="M130 34l8 18 18-6-10 16 16 10-20 2 2 20-14-14-14 14 2-20-20-2 16-10-10-16 18 6z" style="fill:#f3c623;stroke:var(--fg)"/><text class="txt" x="40" y="132" style="font-size:22px;fill:var(--stop)">d =</text><text class="txt m" x="92" y="126">Flameproof enclosure</text><text class="txt m" x="92" y="140">acc. VDE 0170/0171, DIN 50018</text></svg>`}
function jointFig(){return `<svg viewBox="0 0 560 220" role="img" aria-label="الوصلات في الصناديق المقاومة للانفجار"><rect x="4" y="4" width="552" height="212" style="fill:none;stroke:var(--fg)"/><path d="M280 4V216" style="stroke:var(--fg)"/>
 <path d="M20 130H260M20 150H260" style="stroke:var(--fg);stroke-width:2"/><path d="M90 130V100q50-40 100 0V130" style="fill:var(--surface);stroke:var(--fg);stroke-width:2"/><path d="M90 100l6 5-6 5 6 5-6 5 6 5-6 5M190 100l-6 5 6 5-6 5 6 5-6 5 6 5" style="fill:none;stroke:var(--fg)"/><path d="M140 104l5 10 11-3-6 9 9 6-11 1 1 11-9-8-8 8 1-11-11-1 9-6-6-9 11 3z" style="fill:#f3c623;stroke:var(--fg)"/><path d="M196 104c10-6 20-4 30-14M84 104c-10-6-16-4-24-12" style="fill:none;stroke:var(--muted);stroke-dasharray:3 3"/><text class="txt m" x="140" y="40" text-anchor="middle">Hot gases escape through openings</text><text class="txt m" x="140" y="54" text-anchor="middle">designed into threaded joint</text><text class="txt" x="140" y="196" text-anchor="middle" style="font-size:10.5px">OPENINGS DESIGNED INTO THREADED JOINT</text>
 <path d="M340 110l40-50h80l40 50z" style="fill:var(--surface);stroke:var(--fg);stroke-width:2"/><path d="M320 112H520" style="stroke:var(--fg);stroke-width:3"/><path d="M340 114V170H500V114" style="fill:var(--surface);stroke:var(--fg);stroke-width:2"/><path d="M420 92l6 12 13-4-8 11 11 7-13 1 1 13-10-9-9 9 1-13-13-1 10-7-7-11 12 4z" style="fill:#f3c623;stroke:var(--fg)"/><path d="M520 108c10-8 16 0 26-8M320 108c-10-8-16 0-26-8" style="fill:none;stroke:var(--blue);stroke-dasharray:3 3"/><text class="txt m" x="300" y="30">Explosion-Proof Enclosure</text><text class="txt m" x="550" y="30" text-anchor="end">Ground-Joint of Flange,</text><text class="txt m" x="550" y="44" text-anchor="end">Maximum Gap 0.0015 in.</text><text class="txt m" x="296" y="140">Min. Flame Path</text><text class="txt m" x="296" y="154">Length 3/8 Inch</text><text class="txt m" x="540" y="140" text-anchor="end">Cool Gases</text><text class="txt m" x="420" y="186" text-anchor="middle">Hot Gases</text><text class="txt" x="420" y="206" text-anchor="middle" style="font-size:10.5px">OPENINGS DESIGNED INTO GROUND JOINT</text></svg>`}

const SITES=[
 {q:'غرفة رش دهان السيارات، ومذيب الدهان من المواد البترولية، والرش يحدث يومياً في التشغيل العادي.',c:'I',d:'1',g:'D',w:'غازات وأبخرة قابلة للاشتعال (Class I) موجودة في الظروف العادية أثناء الرش (Division 1، الشكل 9-2)، والمادة بترولية (Group D).'},
 {q:'مخزن براميل جازولين مغلقة، ولا تتسرب الأبخرة إلا عند حادث.',c:'I',d:'2',g:'D',w:'السوائل في أوعية مغلقة، ولا توجد الأبخرة إلا في ظروف غير عادية (Division 2، الشكل 9-2)، والمادة بترولية (Group D).'},
 {q:'غرفة إنتاج الهيدروجين، والغاز موجود في الجو أثناء العمل اليومي.',c:'I',d:'1',g:'B',w:'غاز قابل للاشتعال في الظروف العادية، والهيدروجين في المجموعة (ب) Group B.'},
 {q:'مخزن أسطوانات الأستيلين المغلقة.',c:'I',d:'2',g:'A',w:'الغاز داخل أسطوانات مغلقة (Division 2)، والأستيلين في المجموعة (أ) Group A.'},
 {q:'مختبر يُستعمل فيه الإثيل إثير مكشوفاً وتنتشر أبخرته أثناء العمل العادي.',c:'I',d:'1',g:'C',w:'أبخرة في الظروف العادية، والإثيل إثير في المجموعة (ج) Group C.'},
 {q:'مطحنة دقيق، وغبار الدقيق عالق في الهواء أثناء التشغيل العادي.',c:'II',d:'1',g:'G',w:'غبار قابل للاشتعال (Class II، مطاحن الدقيق مثال الكتاب) في الهواء في الظروف العادية (Division 1)، والدقيق والنشا في المجموعة (ز) Group G.'},
 {q:'مصنع يستعمل بودرة الألومنيوم في نظام مغلق، ولا يخرج الغبار إلا عند عطل.',c:'II',d:'2',g:'E',w:'غبار معدني (Group E) لا يوجد في الهواء في الظروف العادية (Division 2، الشكل 10-2).'},
 {q:'ساحة طحن الفحم، وغبار الفحم في الهواء أثناء العمل العادي.',c:'II',d:'1',g:'F',w:'أتربة الكربون (Group F) في الهواء في الظروف العادية (Division 1).'},
 {q:'محلج أقطان تُصنع فيه الألياف وتُستعمل.',c:'III',d:'1',g:'-',w:'ألياف قابلة للاشتعال (Class III، حلج الأقطان مثال الكتاب) تُستعمل أو تُصنع (Division 1، الشكل 11-2). والمجموعات في الكتاب للتصنيفين الأول والثاني فقط.'},
 {q:'مستودع مصنع نسيج تُخزَّن فيه الألياف وتُناول.',c:'III',d:'2',g:'-',w:'ألياف تُخزن أو تُناول (Division 2، الشكل 11-2)، ولا مجموعة للتصنيف الثالث في الكتاب.'}];
const EQUIP={I:'أجهزة داخل صناديق حديدية مقاومة للانفجار Explosion proof (الشكلان 12-2 و13-2).',II:'أجهزة عازلة للأتربة حتى لا تدخل الأتربة إليها، ولا تحدث زيادة في درجة الحرارة داخلها.',III:'أجهزة مصممة لمنع وصول الألياف القابلة للاشتعال إلى صناديقها (Housing).'};

function jointSVG(o){/* o:{gap,len,thr,parts:[{p,h}],state,outside} */
 const gx0=150,gx1=gx0+Math.min(330,o.len*560),gy=110,gpx=Math.max(1.5,o.gap*6000);
 let s=`<svg viewBox="0 0 560 240" role="img" aria-label="وصلة صندوق مقاوم للانفجار">`;
 /* outside atmosphere */
 s+=`<rect x="${gx1+4}" y="20" width="${556-gx1}" height="200" rx="10" style="fill:${o.outside==='fire'?'var(--stop-soft)':'var(--blue-soft)'};opacity:.7"/>`+svT((gx1+556)/2+2,40,o.outside==='fire'?'اشتعل الجو المحيط!':'جو محيط قابل للاشتعال',{st:'font-size:11.5px'});
 /* enclosure body */
 s+=`<rect x="20" y="30" width="${gx0-20}" height="180" style="fill:var(--surface-2);stroke:var(--fg);stroke-width:2"/>`;
 s+=`<rect x="34" y="44" width="${gx0-48}" height="152" style="fill:${o.state>0?'var(--stop-soft)':'var(--surface)'};stroke:var(--fg)"/>`;
 if(o.state>0){const r=10+30*Math.min(1,o.state);s+=`<circle cx="${(gx0+20)/2}" cy="120" r="${r.toFixed(1)}" style="fill:#f3c623;opacity:${(1.1-o.state*0.6).toFixed(2)};stroke:var(--stop)"/>`}
 /* flange: two plates with a gap */
 if(!o.thr){s+=`<rect x="${gx0}" y="${gy-30}" width="${gx1-gx0}" height="${30-gpx/2}" style="fill:var(--wire);stroke:var(--fg)"/><rect x="${gx0}" y="${gy+gpx/2}" width="${gx1-gx0}" height="${30-gpx/2}" style="fill:var(--wire);stroke:var(--fg)"/>`}
 else{let up='',dn='';const n=Math.max(2,Math.round((gx1-gx0)/18));for(let i=0;i<=n;i++){const x=gx0+(gx1-gx0)*i/n,yy=gy+(i%2?8:-8);up+=(i?'L':'M')+x.toFixed(1)+' '+(yy-gpx/2).toFixed(1);dn+=(i?'L':'M')+x.toFixed(1)+' '+(yy+gpx/2).toFixed(1)}
  s+=`<path d="${up}L${gx1} ${gy-40}H${gx0}Z" style="fill:var(--wire);stroke:var(--fg)"/><path d="${dn}L${gx1} ${gy+40}H${gx0}Z" style="fill:var(--wire);stroke:var(--fg)"/>`}
 /* gases */
 const nz=Math.max(2,Math.round((gx1-gx0)/18)),zy=x=>{if(!o.thr||x<=gx0||x>=gx1)return 0;const f=(x-gx0)/((gx1-gx0)/nz),i=Math.floor(f),a=i%2?8:-8,b=(i+1)%2?8:-8;return a+(b-a)*(f-i)};
 (o.parts||[]).forEach(p=>{const x=gx0-10+(gx1-gx0+40)*p.p,ry=zy(x);
  const h=p.h,col=`rgb(${Math.round(60+190*h)},${Math.round(110+60*h-60*h*h)},${Math.round(230-200*h)})`;s+=`<circle cx="${x.toFixed(1)}" cy="${(gy+ry+p.dy).toFixed(1)}" r="3.4" style="fill:${col}"/>`});
 s+=`<path d="M${gx0} ${gy+48}H${gx1}" style="stroke:var(--fg)"/><path d="M${gx0} ${gy+43}v10M${gx1} ${gy+43}v10" style="stroke:var(--fg)"/>`+svT((gx0+gx1)/2,gy+66,'طول مسار اللهب '+o.len.toFixed(3)+' in',{st:'font-size:12px'});
 s+=svT((gx0+20)/2,226,'داخل الصندوق',{st:'font-size:12px'});
 s+=`<text class="txt m" x="${gx0+4}" y="${gy-46}">gap ${o.gap.toFixed(4)} in</text>`;
 return s+'</svg>'}
function lab24(el){
 const W={ok:0,cnt:0};let cur=0,ans={c:null,d:null,g:null};
 el.innerHTML=`<div class="grid sf-lab">
  <div class="panel c7"><h2>صنّف الموقع <small>مبني على ص 18–21 والأشكال (9-2) إلى (11-2)</small></h2>
   <div class="sf-it"><p id="sq"></p>
    <div class="sub">التصنيف Class</div><div class="seg" role="group" data-k="c">${['I','II','III'].map(v=>`<button data-v="${v}">${lt('Class '+v)}</button>`).join('')}</div>
    <div class="sub" style="margin-top:6px">القسم Division</div><div class="seg" role="group" data-k="d">${['1','2'].map(v=>`<button data-v="${v}">${lt('Division '+v)}</button>`).join('')}</div>
    <div class="sub" style="margin-top:6px">المجموعة Group</div><div class="seg" role="group" data-k="g">${GROUPS.map(g=>`<button data-v="${g[0]}">${lt(g[0])}</button>`).join('')}<button data-v="-">لا مجموعة</button></div>
    <div class="sf-row"><button class="btn primary" id="chk">تحقّق</button><button class="btn" id="nx">الموقف التالي</button><span class="sub" id="cnt"></span></div>
    <div class="sf-fb" id="fb"></div></div></div>
  <div class="panel c5"><h2>التجربة خطوة بخطوة</h2><ol class="steps" id="gs"></ol>${tries(['السؤال الأول دائماً: ما المادة؟ غاز وبخار ← I، غبار ← II، ألياف ← III.','ثم: هل المادة في الجو في التشغيل العادي (1) أم عند عطل أو تسرب فقط (2)؟','ثم المجموعة من نوع المادة.'])}</div>
  <div class="panel c12"><h2>كيف تمنع الوصلة المقاومة للانفجار خروج اللهب؟ <small>مبني على الشكل (13-2) ص 22</small></h2>
   <p class="sub">إذا دخلت أبخرة قابلة للاشتعال إلى الصندوق واشتعلت، تخرج الغازات الحارة من الفجوة الضيقة بين الشفتين، فتبرد أثناء مرورها في المسار الطويل، وتخرج باردة لا تشعل الجو المحيط. الحدّان من الشكل: <b>أقصى فجوة ${lt('0.0015 in')}</b> و<b>أقل طول لمسار اللهب ${lt('3/8 in')}</b>. التبريد في الحركة وصفي (لا أرقام حرارة فيه).</p>
   <div class="svgbox" id="jv" style="max-width:600px;margin-inline:auto"></div>
   <div class="sf-row"><div class="seg" role="group" id="jt"><button data-t="0">وصلة مستوية (Ground joint)</button><button data-t="1">وصلة ملولبة (Threaded joint)</button></div><button class="btn primary" id="fire">أشعل الخليط داخل الصندوق</button></div>
   <div class="grid" style="margin-top:0"><div class="c6"><label class="sf-sl"><span class="h"><span>الفجوة بين الشفتين</span><b id="gV"></b></span><input type="range" id="gR" min="0.0005" max="0.004" step="0.0001" value="0.0015"></label></div>
   <div class="c6"><label class="sf-sl"><span class="h"><span>طول مسار اللهب</span><b id="lV"></b></span><input type="range" id="lR" min="0.125" max="0.5" step="0.0625" value="0.375"></label></div></div>
   <div class="sf-fb" id="jfb"></div></div>
 </div>`;
 const $=q=>el.querySelector(q);
 const S=stepsUI($('#gs'),[
  {t:'صنّف موقفاً صحيحاً',x:'اختر التصنيف والقسم والمجموعة ثم «تحقّق».',done:()=>W.ok>=1},
  {t:'صنّف خمسة مواقف',x:'استمر حتى تصيب خمسة مواقف.',done:()=>W.ok>=5},
  {t:'أشعل داخل صندوق سليم',x:`بالقيم ${lt('0.0015 in')} و ${lt('3/8 in')} اضغط «أشعل»: تخرج الغازات باردة.`,done:()=>W.safe},
  {t:'فجوة واسعة',x:`وسّع الفجوة فوق ${lt('0.0015 in')} وأشعل مرة أخرى.`,done:()=>W.wide},
  {t:'مسار قصير',x:`أرجع الفجوة، وقصّر المسار عن ${lt('3/8 in')}، وأشعل.`,done:()=>W.short}]);
 const showQ=()=>{ans={c:null,d:null,g:null};$('#sq').innerHTML=`<b>الموقف ${cur+1} من ${SITES.length}:</b> ${SITES[cur].q}`;$('#fb').hidden=true;$('#fb').innerHTML='';paint()};
 const paint=()=>el.querySelectorAll('.sf-it [data-k]').forEach(g=>g.querySelectorAll('[data-v]').forEach(b=>b.setAttribute('aria-pressed',String(ans[g.dataset.k]===b.dataset.v))));
 el.querySelectorAll('.sf-it [data-k]').forEach(g=>g.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>{ans[g.dataset.k]=b.dataset.v;paint()}));
 $('#chk').onclick=()=>{const s=SITES[cur],fb=$('#fb');fb.hidden=false;
  if(!ans.c||!ans.d||!ans.g){fb.className='sf-fb warn';fb.innerHTML='اختر التصنيف والقسم والمجموعة أولاً.';return}
  const okc=ans.c===s.c,okd=ans.d===s.d,okg=ans.g===s.g,all=okc&&okd&&okg;
  fb.className='sf-fb'+(all?'':' bad');
  fb.innerHTML=(all?'<b>صحيح.</b> ':`<b>ليس كذلك.</b> ${[okc?'':'التصنيف',okd?'':'القسم',okg?'':'المجموعة'].filter(Boolean).join(' و')} غير صحيح. `)+`الجواب: ${lt('Class '+s.c+', Division '+s.d+(s.g!=='-'?', Group '+s.g:''))}. ${s.w}<br><b>الأجهزة المناسبة:</b> ${EQUIP[s.c]}`;
  if(all&&!s.done){s.done=1;W.ok++;}$('#cnt').textContent='أصبت '+W.ok+' من '+SITES.length;S.check()};
 $('#nx').onclick=()=>{cur=(cur+1)%SITES.length;showQ()};
 showQ();
 /* explosion-proof joint animation */
 let gap=0.0015,len=0.375,thr=0,t=-1,parts=[],out='';
 const safe=()=>gap<=0.0015+1e-9&&len>=0.375-1e-9;
 const jfb=()=>{const f=$('#jfb'),ok=safe();f.className='sf-fb'+(ok?'':' bad');
  f.innerHTML=ok?`<b>الوصلة ضمن الحدين:</b> الفجوة ${lt(gap.toFixed(4)+' in')} لا تزيد عن ${lt('0.0015 in')}، والمسار ${lt(len.toFixed(3)+' in')} لا يقل عن ${lt('3/8 in = 0.375 in')}؛ فتخرج الغازات باردة.`:`<b>الوصلة خارج الحدين:</b> ${gap>0.0015+1e-9?'الفجوة أوسع من '+lt('0.0015 in')+'. ':''}${len<0.375-1e-9?'المسار أقصر من '+lt('3/8 in')+'. ':''}الغازات قد تخرج وهي ما زالت حارة فتشعل الجو المحيط بالجهاز.`};
 const upd=()=>{$('#gV').textContent=gap.toFixed(4)+' in';$('#lV').textContent=len.toFixed(4).replace(/0+$/,'')+' in'+(Math.abs(len-0.375)<1e-6?' (3/8)':'');
  $('#jt').querySelectorAll('[data-t]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.t===thr)));jfb();render()};
 const render=()=>{$('#jv').innerHTML=jointSVG({gap,len,thr,parts,state:t<0?0:Math.min(1,t/0.6),outside:out})};
 $('#gR').oninput=e=>{gap=+e.target.value;upd()};$('#lR').oninput=e=>{len=+e.target.value;upd()};
 $('#jt').querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{thr=+b.dataset.t;upd()});
 $('#fire').onclick=()=>{t=0;out='';parts=[];for(let i=0;i<26;i++)parts.push({p:-i*0.04,h:1,dy:(Math.random()-0.5)*Math.max(1,gap*4000)})};
 /* cooling: a «cooling capacity» k = (len/0.375)·(0.0015/gap); exits cool (h→0) when k ≥ 1 — descriptive only */
 loopOn(el,dt=>{if(t<0)return;t+=dt;const k=(len/0.375)*(0.0015/gap);
  parts.forEach(p=>{p.p+=dt*0.45;const inPath=Math.max(0,Math.min(1,p.p));p.h=Math.max(0,1-inPath*Math.min(1,k)*(k>=1?1.15:0.8));if(p.p>1)p.h=Math.max(p.h,0)});
  if(parts.some(p=>p.p>1.02&&p.h>0.25)){out='fire'}
  if(t>4.5){t=-1;const ok=out!=='fire';if(ok&&safe())W.safe=1;if(!ok&&gap>0.0015+1e-9)W.wide=1;if(!ok&&len<0.375-1e-9&&gap<=0.0015+1e-9)W.short=1;parts=[];S.check()}
  render()});
 upd()}

const QU2=()=>{const e=[
  ['السؤال الأول – عرّف الصحة المهنية؟','هي العلم الذي يتعلق بالتعرف والتقييم والسيطرة على ظروف العمل المختلفة التي قد تؤدي إلى إصابة العاملين وتعرض صحتهم للخطر (ص 11).'],
  ['السؤال الثاني – ما مفهوم التعرف؟','معرفة وفهم أنواع المخاطر المختلفة في بيئة العمل وتأثير هذه المخاطر على صحة العاملين (ص 11).'],
  ['السؤال الثالث – اذكر المخاطر التي قد يتعرض لها العاملون في مجال عملهم.','المخاطر الكيميائية، والطبيعية، والبيولوجية، والهندسية (ص 11).'],
  ['السؤال الرابع – ما الطرق التي تدخل بها المواد الكيميائية إلى جسم الإنسان؟','الاستنشاق، والامتصاص خلال الجلد والعينين، والبلع، والحقن الخاطئ (ص 12).'],
  ['السؤال الخامس – اذكر أنواع الملوثات الكيميائية؟','مواد صلبة (أتربة، أدخنة، رذاذ، ألياف)، وغازات وأبخرة (ص 12).'],
  ['السؤال السادس – احسب متوسط التركيز خلال ثمان ساعات إذا كان التركيز المسموح لها هو 100 PPM، حيث تم قياس التركيز لها: 100 خلال ساعتين، 150 خلال ساعتين تاليتين، 50 خلال 4 ساعات التالية.',`(100×2 + 150×2 + 50×4) ÷ 8 = 700 ÷ 8 = ${lt('87.5 ppm')}، وهو أقل من المسموح ${lt('100 ppm')}. الحل خطوة بخطوة في «الأمثلة المحلولة» في الدرس 2.2.`],
  ['السؤال السابع – عدّد المخاطر الطبيعية؟','الحرارة (وارتباطها بالرطوبة وسرعة الهواء)، والضوء، والضوضاء، والإشعاع، والضغط الجوي، والاهتزازات (ص 16).'],
  ['السؤال الثامن – ما التصنيف المتبع للمناطق الخطرة؟','تقسم إلى تصنيفات (Classes): الأول للغازات والأبخرة، والثاني للغبار والأتربة، والثالث للألياف والأنسجة؛ وكل تصنيف إلى قسمين (Divisions): القسم 1 للظروف العادية، والقسم 2 للظروف غير العادية؛ والمواد إلى مجموعات من A إلى G (ص 19–21).'],
  ['السؤال التاسع – اذكر الخواص الاشتعالية للمجموعات التالية: Group A، Group C، Group D','Group A: أجواء فيها غاز الاستيلين. Group C: أجواء فيها الإثيل إثير. Group D: أجواء فيها المواد البترولية (الجازولين) (ص 20–21).'],
  ['السؤال العاشر – اذكر مثالاً لكل مجموعة من المجموعات التالية: Group E، Group F','Group E: الأتربة المعدنية (الألومنيوم، الماغنسيوم). Group F: أتربة الكربون (الفحم) (ص 21).'],
  ['السؤال الحادي عشر – ما مواصفات الأجهزة الكهربائية الخاصة بالصنف الأول (Class I)؟','أجهزة تحفظ داخل صناديق حديدية مقاومة للانفجار؛ فإذا تسربت الأبخرة أو الغازات إلى داخل الصندوق واشتعلت، يمنع الصندوق تسرب الانفجار أو الغازات الحارة إلى الجو المحيط (ص 21).']];
 const t=[
  ['تعتمد درجة خطورة المواد الكيميائية على درجة تركيز المادة فقط','✗ — على درجة التركيز ومدة التعرض (ص 11–12).'],
  ['الأتربة التي يزيد قطرها عن ١٠ ميكرون تسمى الأتربة غير المستنشقة','✓ (ص 13).'],
  ['الرذاذ ينتج من تكثيف الأبخرة الناتجة من السوائل','✓ (ص 14).'],
  ['تنشأ المخاطر البيولوجية بسبب الكهرباء','✗ — من البكتيريا والفيروسات (ص 17).'],
  ['تعتبر المواقع المشبعة بالغبار والأتربة القابلة للاشتعال تابعة للتصنيف الثاني للمناطق الخطرة','✓ (ص 19).'],
  ['القسم الأول هو للمناطق التي يفترض فيها غازات وأبخرة قابلة للاشتعال','✓ — في الظروف العادية وخلال العمليات اليومية (ص 19).'],
  ['الأجهزة الكهربائية الخاصة بالصنف الثالث تكون مصممة لمنع وصول الأتربة إليها','✗ — أجهزة الصنف الثالث تمنع وصول <b>الألياف</b>؛ أما الأجهزة العازلة للأتربة فللصنف الثاني (ص 22).']];
 return `<h3>الأسئلة <span class="ref">ص 23</span></h3>${e.map(x=>det(x[0],x[1])).join('')}<h3>ضع علامة (✓) أو (×) <span class="ref">ص 23–24</span></h3>${t.map(x=>det(x[0],x[1])).join('')}`};

B.lesson({
 id:'u2-l4',unit:2,order:4,pages:'18–24',
 title:'تصنيف المناطق الخطرة والأجهزة المقاومة للانفجار',
 summary:'تقسيم المناطق الخطرة إلى تصنيفات وأقسام ومجموعات، ونوع الأجهزة الكهربائية المناسبة لكل تصنيف، وكيف يعمل الصندوق المقاوم للانفجار، ثم أسئلة الوحدة.',
 stations:[
  {intro:true},

  {st:1,short:'المناطق الخطرة',title:'٢-٥ تقسيم وتصنيف المناطق الخطرة <bdi dir="ltr">HAZARDOUS (CLASSIFIED) LOCATIONS</bdi> — المقدمة',ref:'ص 18–19',
   q:'شرارة صغيرة من مفتاح إنارة… متى تصير سبب انفجار؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ما يجعل المكان منطقة خطرة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBEBDD"/><g data-tip="خطر حدوث حريق أو انفجار كبير: هذا ما يجعل المنطقة خطرة."><path d="M180 52 L226 132 H134 Z" fill="#F2C14E" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round"/><path d="M180 78 C168 94 170 108 180 116 C190 108 192 94 180 78 Z" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/></g><g data-tip="غازات أو أبخرة قابلة للاشتعال، أو سوائل مشتعلة."><circle cx="82" cy="190" r="34" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M70 208 q-8 -10 0 -20 q8 -10 0 -20 M84 208 q-8 -10 0 -20 q8 -10 0 -20 M98 208 q-8 -10 0 -20 q8 -10 0 -20" fill="none" stroke="#C0392B" stroke-width="2" stroke-dasharray="4 3"/></g><g data-tip="أتربة وغبار قابل للاشتعال."><circle cx="180" cy="214" r="34" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><g fill="#9AA5A0"><circle cx="166" cy="204" r="4"/><circle cx="182" cy="198" r="3"/><circle cx="194" cy="210" r="4"/><circle cx="172" cy="222" r="3"/><circle cx="188" cy="226" r="4"/><circle cx="160" cy="216" r="2.5"/><circle cx="200" cy="222" r="2.5"/></g></g><g data-tip="ألياف وأنسجة صناعية قابلة للاشتعال."><circle cx="278" cy="190" r="34" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M258 178 L298 190 M260 196 L296 182 M264 204 L294 200 M262 186 L292 206" stroke="#9AA5A0" stroke-width="2.5" stroke-linecap="round"/></g><text x="82" y="246" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">غازات وأبخرة</text><text x="180" y="268" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">غبار</text><text x="278" y="246" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">ألياف</text><text x="180" y="296" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="600">ثلاثة أنواع من المواد القابلة للاشتعال</text></svg>`,
   cap:'المادة القابلة للاشتعال هي التي تجعل المكان خطراً.<br><b>مرّر المؤشر على المثلث والدوائر الثلاث (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'ما الذي يجعل منطقة ما «منطقة خطرة» في تعريف الكتاب؟',opts:[
     ['وجود آلات كثيرة فيها',false,'الآلات من المخاطر الهندسية، لا أساس التصنيف هنا.'],
     ['خطر حدوث حريق أو انفجار كبير لوجود مواد قابلة للاشتعال',true,'الكتاب (ص 18): «المناطق التي يكون خطر حدوث حريق أو انفجار بها كبيراً نظراً لوجود…».'],
     ['ارتفاع درجة الحرارة فيها فقط',false,'الحرارة وحدها لا تجعلها «منطقة خطرة» بهذا المعنى.']]}}
   ],
   body:[
    {book:`<p><b>المقدمة:</b><br>تعرف المناطق الخطرة بأنها المناطق التي يكون خطر حدوث حريق أو انفجار بها كبيراً نظراً لوجود غازات أو أبخرة قابلة للاشتعال أو سوائل مشتعلة أو أتربة وغبار قابل للاشتعال أو ألياف وأنسجة صناعية قابلة للاشتعال.</p><p>وقد تم تقسيم المناطق الخطرة بحسب المواصفات العالمية كما يلي:</p>`,ref:'ص 18–19'},
    {tip:`<p>التصنيف يجيب عن ثلاثة أسئلة متتالية: <b>ما نوع المادة؟</b> (التصنيف <span class="ltr">Class</span>: غاز وبخار، أو غبار، أو ألياف) ← <b>متى توجد في الجو؟</b> (القسم <span class="ltr">Division</span>: في الظروف العادية أم عند العطل) ← <b>أي مادة بالضبط؟</b> (المجموعة <span class="ltr">Group</span>). المحطات التالية تشرحها بالترتيب.</p>`},
    {title:'مختبر مصغّر: صح أم خطأ؟',widget:(el,B)=>DCML.tf(el,B,{items:[
     ['المكان الذي فيه ألياف وأنسجة صناعية قابلة للاشتعال قد يكون منطقة خطرة.',true,'الألياف من المواد المذكورة في التعريف.'],
     ['الغبار لا يشتعل، فلا يجعل المكان منطقة خطرة.',false,'التعريف يذكر «أتربة وغبار قابل للاشتعال».'],
     ['تقسيم المناطق الخطرة في الكتاب بحسب المواصفات العالمية.',true,'«وقد تم تقسيم المناطق الخطرة بحسب المواصفات العالمية».']]})}
   ]},

  {st:2,short:'التصنيف الأول',title:'٢-٥-١ التصنيف الأول <bdi dir="ltr">CLASS I LOCATION</bdi>',ref:'ص 19',
   q:'محطة البنزين ومصفاة البترول… ما الذي يجمعهما؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="أمثلة التصنيف الأول" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E3ECF7"/><g data-tip="محطات البنزين: من أمثلة الكتاب على التصنيف الأول."><rect x="210" y="118" width="56" height="104" rx="6" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5"/><rect x="220" y="130" width="36" height="24" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><path d="M266 150 h14 v50 q0 10 -10 10" fill="none" stroke="#2C4A40" stroke-width="3"/></g><g data-tip="مصافي البترول ومعامل الغاز: من أمثلة الكتاب على التصنيف الأول."><rect x="88" y="90" width="26" height="132" fill="#9AA5A0" stroke="#2C4A40" stroke-width="2.5"/><rect x="124" y="140" width="40" height="82" rx="18" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M88 120 h26 M88 150 h26 M88 180 h26" stroke="#2C4A40" stroke-width="2"/></g><g data-tip="غازات وأبخرة قابلة للاشتعال: الموقع «مشبع» بها."><path d="M100 82 q-10 -12 0 -24 q10 -12 0 -24 M236 110 q-10 -12 0 -24 q10 -12 0 -24" fill="none" stroke="#C0392B" stroke-width="2.2" stroke-dasharray="5 4"/></g><path d="M60 222 H300" stroke="#2C4A40" stroke-width="3"/><text x="238" y="244" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">محطة بنزين</text><text x="124" y="244" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">مصفاة بترول</text><text x="180" y="274" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)">CLASS I</text><text x="180" y="294" text-anchor="middle" font-size="12" fill="#2C4A40">غازات وأبخرة</text></svg>`,
   cap:'التصنيف الأول: غازات وأبخرة قابلة للاشتعال.<br><b>مرّر المؤشر على المحطة والمصفاة والخطوط الحمراء (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'محطة بنزين تتبع…',opts:[
     ['التصنيف الثاني Class II',false,'الثاني للغبار والأتربة.'],
     ['التصنيف الأول Class I',true,'الكتاب (ص 19): «موقع مشبع بالغازات والأبخرة القابلة للاشتعال ومثال على هذه المواقع (مصافي البترول – معامل الغاز – محطات البنزين...)».'],
     ['التصنيف الثالث Class III',false,'الثالث للألياف.']]}}
   ],
   body:[
    {book:`<p>موقع مشبع بالغازات والأبخرة القابلة للاشتعال ومثال على هذه المواقع ( مصافي البترول – معامل الغاز – محطات البنزين ...)( شكل <span class="ltr">(9-2)</span>)</p>`,ref:'ص 19'},
    {html:fig(F29(),'الشكل <span class="ltr">(9-2)</span>: الغازات والأبخرة — القسم 1 (منطقة الرش) والقسم 2 (التخزين) (رسم مبسّط)','ص 19',560)},
    {title:'مختبر مصغّر: صح أم خطأ؟',widget:(el,B)=>DCML.tf(el,B,{items:[
     ['معامل الغاز من أمثلة التصنيف الأول.',true,'من أمثلة الكتاب: مصافي البترول – معامل الغاز – محطات البنزين.'],
     ['مطحنة الدقيق من أمثلة التصنيف الأول.',false,'مطاحن الدقيق مثال التصنيف الثاني (غبار).'],
     ['أساس التصنيف الأول وجود غازات وأبخرة قابلة للاشتعال.',true,'«موقع مشبع بالغازات والأبخرة القابلة للاشتعال».']]})}
   ]},

  {st:3,short:'التصنيف الثاني',title:'٢-٥-٢ التصنيف الثاني <bdi dir="ltr">CLASS II LOCATIONS</bdi>',ref:'ص 19',
   q:'الدقيق طعام… فكيف يجعل مطحنة الدقيق منطقة خطرة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="أمثلة التصنيف الثاني" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="مطاحن الدقيق: من أمثلة الكتاب على التصنيف الثاني."><path d="M76 222 V120 L118 92 L160 120 V222 Z" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round"/><circle cx="118" cy="150" r="22" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M118 128 V172 M96 150 H140 M102 134 L134 166 M134 134 L102 166" stroke="#2C4A40" stroke-width="2"/></g><g data-tip="المصانع التي تستعمل بودرة الألومنيوم والماغنسيوم: من أمثلة الكتاب."><rect x="200" y="160" width="44" height="62" rx="4" fill="#9AA5A0" stroke="#2C4A40" stroke-width="2.5"/><rect x="196" y="150" width="52" height="12" rx="3" fill="#2C4A40"/><text x="222" y="196" text-anchor="middle" font-size="13" font-weight="700" fill="#FBF6EE" font-family="var(--mono)">Al</text></g><g data-tip="مصانع البلاستيك: من أمثلة الكتاب على التصنيف الثاني."><rect x="256" y="176" width="44" height="46" rx="4" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/></g><g data-tip="غبار وأتربة قابلة للاشتعال في الجو."><g fill="#9AA5A0"><circle cx="186" cy="100" r="4"/><circle cx="204" cy="88" r="3"/><circle cx="222" cy="110" r="4"/><circle cx="242" cy="94" r="3"/><circle cx="260" cy="120" r="4"/><circle cx="276" cy="100" r="3"/><circle cx="196" cy="126" r="3"/><circle cx="234" cy="132" r="2.5"/></g></g><path d="M60 222 H310" stroke="#2C4A40" stroke-width="3"/><text x="118" y="244" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">مطحنة دقيق</text><text x="250" y="244" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">بودرة معادن · بلاستيك</text><text x="180" y="274" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)">CLASS II</text><text x="180" y="294" text-anchor="middle" font-size="12" fill="#2C4A40">غبار وأتربة</text></svg>`,
   cap:'التصنيف الثاني: غبار وأتربة قابلة للاشتعال.<br><b>مرّر المؤشر على المطحنة والعلب والنقاط (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'أي هذه من أمثلة الكتاب على التصنيف الثاني؟',opts:[
     ['مصانع النسيج',false,'النسيج مثال التصنيف الثالث (ألياف).'],
     ['محطات البنزين',false,'مثال التصنيف الأول (غازات وأبخرة).'],
     ['المصانع التي تستعمل بودرة الألومنيوم والماغنسيوم',true,'الكتاب (ص 19) يذكرها مع مطاحن الدقيق ومصانع البلاستيك.']]}}
   ],
   body:[
    {book:`<p>موقع مشبع لغبار وأتربة قابلة للاشتعال ومثال ذلك ( مطاحن الدقيق – المصانع التي تستعمل بودرة الألومنيوم والماغنسيوم – مصانع البلاستيك ...)(شكل <span class="ltr">(10-2)</span>)</p>`,ref:'ص 19'},
    {add:`<p>الغبار الناعم المعلّق في الهواء يحترق بسرعة كبيرة لأن سطحه المعرّض للهواء كبير جداً، فقد يحدث «انفجار غبار». وقد وقعت حوادث معروفة من هذا النوع في مطاحن الحبوب وصوامعها ومصانع السكر.</p>`},
    {html:fig(F210(),'الشكل <span class="ltr">(10-2)</span>: الأتربة القابلة للاشتعال — القسم 1 والقسم 2 (رسم مبسّط)','ص 20',560)},
    {title:'مختبر مصغّر: صح أم خطأ؟',widget:(el,B)=>DCML.tf(el,B,{items:[
     ['مصانع البلاستيك من أمثلة التصنيف الثاني.',true,'من أمثلة الكتاب.'],
     ['أساس التصنيف الثاني وجود غبار وأتربة قابلة للاشتعال.',true,'«موقع مشبع لغبار وأتربة قابلة للاشتعال».'],
     ['الغبار المعدني مثل بودرة الماغنسيوم لا يشتعل لأنه معدن.',false,'الكتاب يذكر بودرة الألومنيوم والماغنسيوم مثالاً على الغبار القابل للاشتعال.']]})}
   ]},

  {st:4,short:'التصنيف الثالث',title:'٢-٥-٣ التصنيف الثالث <bdi dir="ltr">CLASS III LOCATIONS</bdi>',ref:'ص 19',
   q:'كومة قطن في محلج… هل تختلف عن غبار الدقيق؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="أمثلة التصنيف الثالث" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBEBDD"/><g data-tip="حلج الأقطان: من أمثلة الكتاب على التصنيف الثالث."><rect x="70" y="160" width="100" height="62" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M70 180 h100 M70 200 h100" stroke="#2C4A40" stroke-width="2"/><g fill="#FBF6EE" stroke="#9AA5A0" stroke-width="2"><circle cx="92" cy="146" r="14"/><circle cx="118" cy="140" r="16"/><circle cx="146" cy="148" r="13"/></g></g><g data-tip="مصانع النسيج: من أمثلة الكتاب على التصنيف الثالث."><rect x="196" y="120" width="96" height="102" rx="6" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><path d="M210 136 V206 M226 136 V206 M242 136 V206 M258 136 V206 M274 136 V206" stroke="#FBF6EE" stroke-width="2"/><path d="M204 170 H284" stroke="#E8735A" stroke-width="4"/></g><g data-tip="ألياف وأنسجة صناعية قابلة للاشتعال."><path d="M200 96 L236 104 M216 86 L250 98 M240 92 L272 104" stroke="#9AA5A0" stroke-width="2.5" stroke-linecap="round"/></g><path d="M60 222 H310" stroke="#2C4A40" stroke-width="3"/><text x="120" y="244" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">حلج الأقطان</text><text x="244" y="244" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">مصنع نسيج</text><text x="180" y="274" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)">CLASS III</text><text x="180" y="294" text-anchor="middle" font-size="12" fill="#2C4A40">ألياف وأنسجة</text></svg>`,
   cap:'التصنيف الثالث: ألياف وأنسجة صناعية قابلة للاشتعال.<br><b>مرّر المؤشر على المحلج والنول والألياف (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'محلج أقطان يتبع…',opts:[
     ['التصنيف الثالث Class III',true,'الكتاب (ص 19): «موقع به مواد كالألياف والأنسجة الصناعية القابلة للاشتعال مثال ذلك (مصانع النسيج – حلج الأقطان...)».'],
     ['التصنيف الثاني Class II',false,'الثاني للغبار والأتربة، والقطن ألياف.'],
     ['لا يُصنف',false,'القطن ألياف قابلة للاشتعال.']]}}
   ],
   body:[
    {book:`<p>موقع به مواد كالألياف والأنسجة الصناعية القابلة للاشتعال مثال ذلك ( مصانع النسيج – حلج الأقطان ...)( شكل <span class="ltr">(11-2)</span>)</p>`,ref:'ص 19'},
    {html:fig(F211(),'الشكل <span class="ltr">(11-2)</span>: الألياف القابلة للاشتعال — القسم 1 (تُستعمل أو تُصنع) والقسم 2 (تُخزن أو تُناول) (رسم مبسّط)','ص 20',560)},
    {title:'مختبر مصغّر: صنّف أمثلة الكتاب',widget:(el,B)=>DCML.sort(el,B,{intro:'كل الأمثلة من الكتاب (ص 19). اسأل: ما المادة القابلة للاشتعال؟',cats:['Class I','Class II','Class III'],items:[
     ['مصافي البترول',0,'غازات وأبخرة قابلة للاشتعال.'],
     ['مطاحن الدقيق',1,'غبار وأتربة قابلة للاشتعال.'],
     ['مصانع النسيج',2,'ألياف وأنسجة صناعية.'],
     ['محطات البنزين',0,'غازات وأبخرة.'],
     ['مصانع البلاستيك',1,'غبار وأتربة.'],
     ['حلج الأقطان',2,'ألياف.'],
     ['معامل الغاز',0,'غازات.'],
     ['المصانع التي تستعمل بودرة الألومنيوم والماغنسيوم',1,'غبار معدني.']]})}
   ]},

  {st:5,short:'القسم الأول',title:'١- قسم (١) <bdi dir="ltr">DIVISION I</bdi>',ref:'ص 19',
   q:'غرفة رش السيارات: هل الأبخرة فيها «حادث نادر» أم «عمل كل يوم»؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="منطقة رش: الأبخرة موجودة في الظروف العادية" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E3ECF7"/><g data-tip="غرفة رش ودهان السيارات: مثال الكتاب على القسم الأول."><path d="M60 236 V100 H300 V236" fill="none" stroke="#2C4A40" stroke-width="3"/><path d="M190 230 H290 L276 176 H204 Z" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round"/><rect x="206" y="196" width="68" height="20" rx="8" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/></g><g data-tip="عامل يرش الدهان: العمل اليومي العادي نفسه يملأ الجو بالأبخرة."><circle cx="110" cy="146" r="12" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5"/><path d="M96 230 V176 a14 16 0 0 1 28 0 V230 Z" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><path d="M124 180 L150 178" stroke="#2C4A40" stroke-width="5" stroke-linecap="round"/><rect x="148" y="170" width="22" height="12" rx="3" fill="#2C4A40"/></g><g data-tip="غازات وأبخرة قابلة للاشتعال موجودة في الظروف العادية ⟦Normal Conditions⟧ وخلال العمليات اليومية."><g fill="#F2C14E" stroke="#C0392B" stroke-width="1"><circle cx="180" cy="176" r="3"/><circle cx="190" cy="168" r="3"/><circle cx="200" cy="180" r="3"/><circle cx="196" cy="160" r="2.5"/></g><path d="M150 140 q-10 -12 0 -24 M190 140 q-10 -12 0 -24 M230 150 q-10 -12 0 -24 M270 140 q-10 -12 0 -24" fill="none" stroke="#C0392B" stroke-width="2" stroke-dasharray="4 3"/></g><text x="180" y="262" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">الأبخرة موجودة في العمل العادي</text><text x="180" y="286" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)">DIVISION 1</text></svg>`,
   cap:'منطقة الرش في الشكل <span class="ltr">(9-2)</span>.<br><b>مرّر المؤشر على الغرفة والعامل والأبخرة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'القسم الأول Division I للمناطق التي توجد فيها المواد القابلة للاشتعال…',opts:[
     ['في الظروف العادية وخلال العمليات اليومية',true,'الكتاب (ص 19): «في الظروف العادية Normal Conditions وخلال العمليات اليومية العادية في هذا المكان».'],
     ['عند حوادث التسرب فقط',false,'هذا وصف القسم الثاني.'],
     ['لا توجد أبداً',false,'لو لم توجد أبداً لما كانت منطقة خطرة.']]}}
   ],
   body:[
    {book:`<p>بخلاف تقسيم المناطق الخطرة إلي درجات (Classes) فقد تم تقسيم الدرجات إلى أقسام (Divisions)</p><p>وهي المناطق التي تفترض وجود غازات وأبخرة قابلة للاشتعال أو غبار قابل للاشتعال في الظروف العادية Normal Conditions وخلال العمليات اليومية العادية في هذا المكان وعلى سبيل المثال أثناء رش ودهان السيارات. (شكل <span class="ltr">(9-2)</span>)</p>`,ref:'ص 19'},
    {tip:`<p>كلمة «قسم» هنا تعني <b>كم مرة توجد المادة في الجو</b>. في القسم الأول وجودها عادي ومتوقع كل يوم، فالشرارة فيه خطيرة في أي لحظة.</p>`},
    {title:'مختبر مصغّر: صح أم خطأ؟',widget:(el,B)=>DCML.tf(el,B,{items:[
     ['رش ودهان السيارات مثال الكتاب على القسم الأول.',true,'«وعلى سبيل المثال أثناء رش ودهان السيارات».'],
     ['التقسيم إلى أقسام (Divisions) يكون داخل كل تصنيف (Class).',true,'«فقد تم تقسيم الدرجات إلى أقسام».'],
     ['القسم الأول خاص بالغازات فقط ولا يشمل الغبار.',false,'التعريف يقول «غازات وأبخرة قابلة للاشتعال أو غبار قابل للاشتعال».']]})}
   ]},

  {st:6,short:'القسم الثاني',title:'٢- قسم (٢) <bdi dir="ltr">DIVISION II</bdi>',ref:'ص 20',
   q:'براميل وقود مغلقة في مخزن… متى يصير المخزن خطراً؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مخزن: المواد في أوعية مغلقة ولا تخرج إلا عند عطل" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="سوائل أو غازات قابلة للاشتعال محفوظة في أوعية أو أنظمة مغلقة: لا توجد في الجو في الظروف العادية."><g fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"><rect x="80" y="150" width="44" height="80" rx="6"/><rect x="132" y="150" width="44" height="80" rx="6"/><rect x="184" y="150" width="44" height="80" rx="6"/></g><path d="M80 176 h44 M132 176 h44 M184 176 h44 M80 204 h44 M132 204 h44 M184 204 h44" stroke="#2C4A40" stroke-width="2"/></g><g data-tip="ظرف غير عادي: تسرب من وعاء نتيجة عطل؛ عندها فقط توجد الأبخرة في الجو. هذا هو القسم الثاني."><rect x="244" y="150" width="44" height="80" rx="6" fill="#F2C14E" stroke="#C0392B" stroke-width="2.5"/><path d="M250 230 q-6 6 -2 12" fill="none" stroke="#C0392B" stroke-width="2.5"/><ellipse cx="244" cy="246" rx="12" ry="3" fill="#C0392B" opacity=".6"/><path d="M276 140 q-10 -12 0 -24 q10 -12 0 -24" fill="none" stroke="#C0392B" stroke-width="2" stroke-dasharray="4 3"/><path d="M268 168 l10 10 M278 168 l-10 10" stroke="#C0392B" stroke-width="2.5"/></g><path d="M60 230 H310" stroke="#2C4A40" stroke-width="3"/><text x="154" y="264" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">مغلقة: لا أبخرة</text><text x="256" y="272" text-anchor="middle" font-size="12" fill="#C0392B" font-weight="700">عطل: تسرب</text><text x="180" y="296" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)">DIVISION 2</text></svg>`,
   cap:'مخزن السوائل في الشكل <span class="ltr">(9-2)</span>.<br><b>مرّر المؤشر على البراميل المغلقة والبرميل المتسرب (أو المسها في الجوال) لتعرف الفرق.</b>',
   side:[
    {predict:{q:'مصنع يستعمل بودرة الألومنيوم في نظام مغلق، ولا يخرج الغبار إلا عند عطل. أي قسم؟',opts:[
     ['القسم الأول',false,'الغبار لا يوجد في الهواء في الظروف العادية هنا.'],
     ['القسم الثاني',true,'الكتاب (ص 20): القسم الثاني للمناطق التي توجد فيها المواد «في ظروف غير عادية (حوادث تسرب مثلا)… نتيجة لأية أعطال بالمعدات».'],
     ['لا قسم له',false,'هو منطقة خطرة لأن الغبار قد يخرج عند العطل.']]}}
   ],
   body:[
    {book:`<p>وهي المناطق التي تفترض تواجد الغازات والأبخرة القابلة للاشتعال كذلك الغبار القابل للاشتعال في ظروف غير عادية (حوادث تسرب مثلا) وذلك نتيجة لأية أعطال بالمعدات تنشأ عنها تسرب للمواد القابلة للاشتعال. (شكل <span class="ltr">(10-2)</span>)</p>`,ref:'ص 20'},
    {tip:`<p>القسم الثاني ليس «آمناً»؛ هو مكان المادة فيه محبوسة عادة. الخطر يظهر عند العطل أو التسرب. لذلك تبقى الأجهزة فيه خاضعة لشروط المناطق الخطرة.</p>`},
    {title:'مختبر مصغّر: صنّف الموقع',widget:(el,B)=>DCML.lab(el,B,{intro:'اختر نوع المادة ومتى توجد في الجو، فترى التصنيف والقسم ومثاله في أشكال الكتاب.',
     ins:[{k:'m',l:'المادة القابلة للاشتعال',seg:[[1,'غازات وأبخرة'],[2,'غبار وأتربة'],[3,'ألياف']],v:1},{k:'d',l:'متى توجد في الجو؟',seg:[[1,'في التشغيل العادي يومياً'],[2,'عند عطل أو تسرب فقط']],v:1}],
     calc:(s)=>{const C=['','I','II','III'][s.m],D=s.d;
      const ex={'1-1':'منطقة رش الدهان (الشكل 9-2): الغازات والأبخرة موجودة في ظروف التشغيل العادية.','1-2':'مخزن السوائل القابلة للاشتعال في أوعية أو أنظمة مغلقة (الشكل 9-2).','2-1':'غبار في الهواء حول المعدات أثناء التشغيل العادي (الشكل 10-2).','2-2':'معدات معالجة وسيور ناقلة لا يوجد غبار في هوائها في التشغيل العادي (الشكل 10-2).','3-1':'مكان تُستعمل فيه الألياف أو تُصنع، مثل محلج القطن (الشكل 11-2).','3-2':'مكان تُخزن فيه الألياف أو تُناول (الشكل 11-2).'}[s.m+'-'+D];
      return {facts:[['التصنيف','Class '+C,'hi'],['القسم','Division '+D,'hi']],msg:'<b>مثال من أشكال الكتاب:</b> '+ex}}})}
   ]},

  {st:7,short:'المجموعات',title:'المجموعات <bdi dir="ltr">Groups</bdi>',ref:'ص 20–21',
   q:'الهيدروجين والجازولين كلاهما غاز أو بخار قابل للاشتعال… فلماذا وضعهما الكتاب في مجموعتين؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="المجموعات من A إلى G" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBEBDD"/><rect x="190" y="62" width="120" height="200" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="50" y="62" width="120" height="200" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="250" y="88" text-anchor="middle" font-size="14" font-weight="700" fill="#2C4A40" font-family="var(--mono)">Class I</text><text x="110" y="88" text-anchor="middle" font-size="14" font-weight="700" fill="#2C4A40" font-family="var(--mono)">Class II</text><g font-family="var(--mono)" font-size="16" font-weight="700" text-anchor="middle"><g data-tip="مجموعة (أ) ⟦Group A⟧: الأجواء التي تحتوي على غاز الاستيلين."><rect x="220" y="102" width="60" height="30" rx="8" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><text x="250" y="123" fill="#FBF6EE">A</text></g><g data-tip="مجموعة (ب) ⟦Group B⟧: الأجواء التي تحتوي على غاز الهيدروجين."><rect x="220" y="140" width="60" height="30" rx="8" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><text x="250" y="161" fill="#FBF6EE">B</text></g><g data-tip="مجموعة (ج) ⟦Group C⟧: الأجواء التي تحتوي على الإثيل إثير."><rect x="220" y="178" width="60" height="30" rx="8" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><text x="250" y="199" fill="#FBF6EE">C</text></g><g data-tip="مجموعة (د) ⟦Group D⟧: الأجواء التي تحتوي على المواد البترولية (الجازولين)."><rect x="220" y="216" width="60" height="30" rx="8" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><text x="250" y="237" fill="#FBF6EE">D</text></g><g data-tip="مجموعة (هـ) ⟦Group E⟧: الأتربة المعدنية (الألومنيوم – الماغنسيوم)."><rect x="80" y="102" width="60" height="30" rx="8" fill="#9AA5A0" stroke="#2C4A40" stroke-width="2"/><text x="110" y="123" fill="#FBF6EE">E</text></g><g data-tip="مجموعة (و) ⟦Group F⟧: أتربة الكربون (الفحم)."><rect x="80" y="140" width="60" height="30" rx="8" fill="#9AA5A0" stroke="#2C4A40" stroke-width="2"/><text x="110" y="161" fill="#FBF6EE">F</text></g><g data-tip="مجموعة (ز) ⟦Group G⟧: الدقيق والنشا. (في الكتاب مكتوبة ⟦Group E⟧ خطأً.)"><rect x="80" y="178" width="60" height="30" rx="8" fill="#9AA5A0" stroke="#2C4A40" stroke-width="2"/><text x="110" y="199" fill="#FBF6EE">G</text></g></g><text x="250" y="284" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">غازات وأبخرة</text><text x="110" y="284" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">أتربة</text></svg>`,
   cap:'سبع مجموعات: أربع للتصنيف الأول، وثلاث للتصنيف الثاني.<br><b>مرّر المؤشر على كل حرف (أو المسه في الجوال) لتعرف مادته.</b>',
   side:[
    {predict:{q:'المجموعة التي تضم أجواء غاز الهيدروجين…',opts:[
     ['<span class="ltr">Group A</span>',false,'A للاستيلين.'],
     ['<span class="ltr">Group D</span>',false,'D للمواد البترولية (الجازولين).'],
     ['<span class="ltr">Group B</span>',true,'الكتاب (ص 20): «مجموعة (ب) Group B الأجواء التي تحتوي على غاز الهيدروجين».']]}}
   ],
   body:[
    {book:`<p>كذلك بالإضافة للمناطق والدرجات Classes والأقسام Divisions يتم تقسيم المواد الكيميائية القابلة للاشتعال إلى مجموعات وذلك على النحو الآتي:<br>المجموعات من (أ) إلى (د) تابعة للتصنيف الأول Class I وقسمت هذه المجموعات حسب درجات الاشتعال – الخواص الاشتعالية لكل مادة</p>
     <ul><li>مجموعة (أ) Group A الأجواء التي تحتوي على غاز الاستيلين</li><li>مجموعة (ب) Group B الأجواء التي تحتوي على غاز الهيدروجين</li><li>مجموعة (ج) Group C الأجواء التي تحتوي على الإثيل إثير</li><li>مجموعة (د) Group D الأجواء التي تحتوي على المواد البترولية (الجازولين ..)</li></ul>
     <p>المجموعات من (هـ) إلى (ز) تابعة للمنطقة الثانية Class II وقسمت هذه المجموعات حسب درجة الاشتعال كذلك والتوصيل الكهربائي Conductivity</p>
     <ul><li>مجموعة (هـ) Group E مثل الأتربة المعدنية (الألومنيوم – الماغنسيوم )</li><li>مجموعة (و) Group F مثل أتربة الكربون ( الفحم ...)</li><li>مجموعة (ز) Group G مثل الدقيق والنشا</li></ul>`,ref:'ص 20–21'},
    {watch:`<p>في الكتاب (ص 21) المجموعة (ز) مكتوبة «Group E» مرة ثانية، والصواب <b>Group G</b> (المجموعات من A إلى G)، فصححناها. وفي الكتاب «حسب درجة الاستعمال» والمقصود «درجة الاشتعال».</p>`,fix:true},
    {tip:`<p>المواد القابلة للاشتعال لا تشتعل بالسهولة نفسها: بعضها يشتعل بشرارة أضعف أو ينتشر لهبه أسرع. لذلك قسمها الكتاب إلى مجموعات حسب <b>خواصها الاشتعالية</b>، وأضاف للأتربة <b>التوصيل الكهربائي</b> لأن الغبار المعدني والكربوني يوصل الكهرباء.</p>`},
    {title:'مختبر مصغّر: في أي مجموعة؟',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل مادة: اختر مجموعتها من الكتاب.',cats:['A','B','C','D','E','F','G'],items:[
     ['غاز الاستيلين',0,'Group A.'],
     ['الجازولين (المواد البترولية)',3,'Group D.'],
     ['غبار الفحم (أتربة الكربون)',5,'Group F.'],
     ['النشا',6,'Group G (مكتوبة في الكتاب Group E خطأً).'],
     ['غاز الهيدروجين',1,'Group B.'],
     ['بودرة الماغنسيوم (أتربة معدنية)',4,'Group E.'],
     ['الإثيل إثير',2,'Group C.']]})}
   ]},

  {st:8,short:'مصادر الاشتعال',title:'٢-٦ نوعية الأجهزة الكهربائية التي يتم تركيبها في المناطق الخطرة',ref:'ص 21',
   q:'المصباح لا يُصدر شرراً… فكيف يُشعل الأبخرة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ثلاث طرق تجعل الجهاز مصدراً للاشتعال" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E3ECF7"/><g data-tip="(أ) حدوث شرر أثناء التشغيل: مثل فتح مفتاح وإغلاقه."><rect x="232" y="84" width="60" height="80" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="252" y="102" width="20" height="36" rx="4" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/><path d="M296 92 l14 -8 M298 106 l16 0 M296 120 l14 8" stroke="#F2C14E" stroke-width="3.5" stroke-linecap="round"/></g><text x="262" y="186" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">أ- شرر</text><g data-tip="(ب) درجات الحرارة العالية: بعض الأجهزة مثل مصابيح الإضاءة تسخن فقد تشعل المواد القابلة للاشتعال."><path d="M150 72 V92" stroke="#2C4A40" stroke-width="3"/><path d="M128 92 h44 l-8 20 h-28 z" fill="#2C4A40"/><circle cx="150" cy="128" r="18" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><path d="M126 156 q-6 -8 0 -16 M150 162 q-6 -8 0 -16 M174 156 q-6 -8 0 -16" fill="none" stroke="#C0392B" stroke-width="2.5"/></g><text x="150" y="186" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">ب- حرارة</text><g data-tip="(ج) حدوث خلل في الأجهزة: مثل عزل تالف يؤدي إلى شرر يسبب الاشتعال."><path d="M40 118 H76" stroke="#2C4A40" stroke-width="7" stroke-linecap="round"/><path d="M96 118 H118" stroke="#2C4A40" stroke-width="7" stroke-linecap="round"/><path d="M76 118 H96" stroke="#C0392B" stroke-width="3"/><path d="M86 104 l-6 10 h8 l-6 12" fill="none" stroke="#F2C14E" stroke-width="3"/></g><text x="80" y="186" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">ج- خلل</text><g data-tip="جو فيه مواد قابلة للاشتعال: أي مصدر من الثلاثة قد يشعله."><path d="M120 262 q-10 -12 0 -24 q10 -12 0 -24 M180 262 q-10 -12 0 -24 q10 -12 0 -24 M240 262 q-10 -12 0 -24 q10 -12 0 -24" fill="none" stroke="#C0392B" stroke-width="2" stroke-dasharray="4 3"/></g><text x="180" y="290" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="600">ثلاث طرق للاشتعال من الأجهزة</text></svg>`,
   cap:'ثلاث طرق تجعل الجهاز الكهربائي مصدراً للاشتعال.<br><b>مرّر المؤشر على المفتاح والمصباح والكابل والأبخرة (أو المسها في الجوال) لتعرف كل طريقة.</b>',
   side:[
    {predict:{q:'مصباح إضاءة سليم لا يُصدر شرراً. هل يمكن أن يكون مصدراً للاشتعال؟',opts:[
     ['لا، الشرر وحده يُشعل',false,'الكتاب يذكر الحرارة طريقاً ثانياً.'],
     ['نعم، لأن سطحه يسخن وترتفع حرارته',true,'الكتاب (ص 21): «مصابيح الإضاءة تصبح ساخنة وترتفع درجة حرارتها مما قد يسبب اشتعال المواد القابلة للاشتعال».'],
     ['نعم، لكن فقط إذا انكسر',false,'حتى السليم يسخن؛ والانكسار «خلل»، وهو طريق ثالث.']]}}
   ],
   body:[
    {book:`<p>الطريقة التي تجعل الأجهزة الكهربائية مصدراً للاشتعال هي:</p><p>أ- حدوث شرر: أثناء التشغيل<br>ب- درجات الحرارة العالية: لبعض الأجهزة مثل مصابيح الإضاءة تصبح ساخنة وترتفع درجة حرارتها مما قد يسبب اشتعال المواد القابلة للاشتعال<br>ج- حدوث خلل في الأجهزة الكهربائية قد يؤدي لحدوث شرر يسبب الاشتعال ولتجنب الأخطار الناتجة عن الأجهزة الكهربائية لمصدر الحرائق في المناطق المصنفة خطرة، يجب اختيار المعدات والأجهزة المناسبة لكل منطقة من المناطق الخطرة وذلك على النحو التالي:</p>`,ref:'ص 21'},
    {title:'مختبر مصغّر: أي طريق للاشتعال؟',widget:(el,B)=>DCML.sort(el,B,{intro:'المواقف أمثلة من عندنا، والطرق الثلاث من الكتاب.',cats:['أ- شرر أثناء التشغيل','ب- حرارة عالية','ج- خلل في الجهاز'],items:[
     ['مفتاح إنارة عادي يُفتح ويُغلق في غرفة رش الدهان.',0,'المفتاح يُصدر شرراً صغيراً عند كل تشغيل وإيقاف.'],
     ['كشاف قوي يسخن زجاجه كثيراً بجوار براميل مذيبات.',1,'سطح المصباح الساخن قد يشعل الأبخرة.'],
     ['كابل محرك تآكل عزله فحدث تماس.',2,'خلل في الجهاز أدى إلى شرر.'],
     ['محرك فرشه (فحماته) تُصدر شرراً وهو يعمل.',0,'شرر أثناء التشغيل العادي.']]})}
   ]},

  {st:9,short:'أجهزة التصنيف الأول',title:'١- الأجهزة الكهربائية الخاصة بالتصنيف الأول <bdi dir="ltr">Class I</bdi>',ref:'ص 21–22',
   q:'صندوق «مقاوم للانفجار»… هل يمنع الانفجار أم يحبسه؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="صندوق مقاوم للانفجار وفجوة الشفة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBEBDD"/><g data-tip="صندوق حديدي مقاوم للانفجار ⟦Explosion proof⟧: يتحمل الانفجار داخله."><path d="M100 128 L130 84 H230 L260 128 Z" fill="#9AA5A0" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round"/><rect x="100" y="134" width="160" height="80" fill="#9AA5A0" stroke="#2C4A40" stroke-width="3"/></g><g data-tip="انفجار داخل الصندوق: إذا تسربت الأبخرة أو الغازات إلى داخله واشتعلت، يبقى الانفجار محبوساً فيه."><path d="M180 140 l8 16 l18 -6 l-10 16 l16 10 l-18 2 l2 18 l-14 -12 l-14 12 l2 -18 l-18 -2 l16 -10 l-10 -16 l18 6 z" fill="#F2C14E" stroke="#C0392B" stroke-width="2"/></g><g data-tip="الشفة والفجوة بينهما: في الشكل ⟦(13-2)⟧ أقصى فجوة ⟦0.0015 in⟧، وأقل طول لمسار اللهب ⟦3/8 in⟧. تمر الغازات الحارة فيها فتبرد."><path d="M84 128 H276 M84 134 H276" stroke="#2C4A40" stroke-width="4"/></g><g data-tip="غازات حارة داخل الصندوق."><path d="M150 132 H100" stroke="#C0392B" stroke-width="2.5"/><path d="M210 132 H260" stroke="#C0392B" stroke-width="2.5"/></g><g data-tip="غازات خرجت باردة: لا تشعل الجو المحيط بالجهاز ⟦Cool Gases⟧."><path d="M80 131 q-14 -10 -26 0 M280 131 q14 -10 26 0" fill="none" stroke="#3B7DD8" stroke-width="3"/><path d="M58 124 l-6 7 l8 3 M302 124 l6 7 l-8 3" fill="none" stroke="#3B7DD8" stroke-width="2.5"/></g><text x="180" y="244" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="rtl">فجوة <tspan direction="ltr" unicode-bidi="embed" font-family="var(--mono)">≤ 0.0015 in</tspan></text><text x="180" y="264" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="rtl">مسار <tspan direction="ltr" unicode-bidi="embed" font-family="var(--mono)">≥ 3/8 in</tspan></text><text x="180" y="292" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="600">يحبس الانفجار ويبرّد الغازات</text></svg>`,
   cap:'فكرة الصندوق المقاوم للانفجار من الشكل <span class="ltr">(13-2)</span>.<br><b>مرّر المؤشر على الصندوق والنجمة والشفة والأسهم (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'ماذا يفعل الصندوق الحديدي المقاوم للانفجار إذا اشتعلت الأبخرة داخله؟',opts:[
     ['يمنع الأبخرة من الدخول إليه أصلاً',false,'الكتاب يذكر «احتمال تسرب الأبخرة والغازات القابلة للاشتعال إلى داخل صندوق الأجهزة».'],
     ['يمنع تسرب الانفجار أو الغازات الحارة إلى الجو المحيط',true,'الكتاب (ص 21): «فإن الصندوق الحديدي يمنع تسرب الانفجار أو الغازات الحارة إلى الجو المحيط بالجهاز الكهربائي».'],
     ['يفصل الكهرباء فقط',false,'الكتاب لا يذكر فصلاً؛ الصندوق يحبس الانفجار.']]}}
   ],
   body:[
    {book:`<p>يتم استخدام الأجهزة الكهربائية التي تحفظ داخل صناديق حديدية مقاومة للانفجار Explosion proof (الشكلان <span class="ltr">(12-2)</span> و<span class="ltr">(13-2)</span>) وذلك لاحتمال تسرب الأبخرة والغازات القابلة للاشتعال إلى داخل صندوق الأجهزة الكهربائية وفي حالة اشتعال أو انفجار هذه الأبخرة أو الغازات فإن الصندوق الحديدي يمنع تسرب الانفجار أو الغازات الحارة إلى الجو المحيط بالجهاز الكهربائي.</p>`,ref:'ص 21'},
    {html:fig(dSymbol(),'الشكل <span class="ltr">(12-2)</span>: رمز الغلاف المقاوم للهب <span class="ltr">(d)</span>','ص 21',300)+fig(jointFig(),'الشكل <span class="ltr">(13-2)</span>: فتحات مصممة في الوصلة الملولبة (يسار) وفي الوصلة المستوية (يمين): تخرج الغازات من الوصلة وقد بردت','ص 22',560)},
    {tip:`<p>الصندوق المقاوم للانفجار <b>لا يمنع</b> دخول الغاز ولا الانفجار داخله؛ بل يتحمل الانفجار، ويجعل الغازات الحارة تمر في فجوة ضيقة جداً وطويلة بين الشفتين (أقصاها <span class="ltr">0.0015 in</span> ≈ <span class="ltr">0.04 mm</span>، وأقل طول <span class="ltr">3/8 in</span> ≈ <span class="ltr">9.5 mm</span> كما في الشكل)، فتفقد حرارتها في المعدن وتخرج باردة لا تشعل ما حول الجهاز. وفي «المختبر» حركة توضح ذلك.</p>`},
    {title:'مختبر مصغّر: هل تخرج الغازات باردة؟',widget:(el,B)=>DCML.lab(el,B,{intro:'غيّر حالة الوصلة وقارنها بحدّي الشكل <span class="ltr">(13-2)</span>. النتيجة منطقية فقط (بلا أرقام حرارة).',
     predict:{q:'فني فتح الصندوق للصيانة، ثم أغلقه وترك بين الشفتين فجوة أوسع من الحد. ماذا تتوقع عند اشتعال داخلي؟',opts:[
      ['لا مشكلة، الصندوق ما زال حديدياً',false,'قوة الحديد لا تكفي إذا كان طريق الغازات واسعاً؛ التبريد يحتاج فجوة ضيقة.'],
      ['قد تخرج الغازات وهي ما زالت حارة فتشعل الجو المحيط',true,'الفجوة الواسعة لا تبرّد الغازات بما يكفي.'],
      ['لن يحدث اشتعال داخلي أبداً',false,'الكتاب نفسه يفترض احتمال تسرب الأبخرة إلى الداخل واشتعالها.']]},
     ins:[{k:'g',l:'الفجوة بين الشفتين',seg:[[1,'لا تزيد عن <span class="ltr">0.0015 in</span>'],[0,'أوسع من <span class="ltr">0.0015 in</span>']],v:0},{k:'p',l:'طول مسار اللهب',seg:[[1,'لا يقل عن <span class="ltr">3/8 in</span>'],[0,'أقصر من <span class="ltr">3/8 in</span>']],v:1}],
     calc:(s)=>{const ok=s.g&&s.p;
      const pic=`<svg viewBox="0 0 300 120" role="img" aria-label="الغازات عبر الشفة" style="font-family:var(--font)"><rect x="0" y="0" width="100%" height="100%" rx="12" fill="#F3E8D8"/><rect x="20" y="20" width="90" height="80" fill="#F6C6BC" stroke="#2C4A40" stroke-width="2.5"/><path d="M65 44 l5 10 l11 -4 l-6 10 l10 6 l-11 1 l1 11 l-9 -8 l-9 8 l1 -11 l-11 -1 l10 -6 l-6 -10 l11 4 z" fill="#F2C14E" stroke="#C0392B" stroke-width="1.5"/><path d="M110 ${s.g?52:44} H${s.p?230:170} M110 ${s.g?60:68} H${s.p?230:170}" stroke="#2C4A40" stroke-width="5"/><path d="M110 56 H${s.p?170:140}" stroke="#C0392B" stroke-width="${s.g?3:10}"/><path d="M${s.p?170:140} 56 H${s.p?230:170}" stroke="${ok?'#3B7DD8':'#E8735A'}" stroke-width="${s.g?3:10}"/><path d="M${s.p?234:174} 56 q14 -12 30 -4" fill="none" stroke="${ok?'#3B7DD8':'#C0392B'}" stroke-width="3"/>${ok?'':`<path d="M${s.p?262:202} 56 c-8 -10 -4 -20 4 -26 c2 10 10 12 6 26 z" fill="#F2C14E" stroke="#C0392B" stroke-width="1.5"/>`}</svg>`;
      return {pic,msg:ok?'<b>ضمن حدّي الشكل:</b> الغازات تمر في فجوة ضيقة وطويلة فتفقد حرارتها، وتخرج باردة لا تشعل الجو المحيط.':'<b>خارج حدّي الشكل:</b> '+(s.g?'':'الفجوة أوسع من <span class="ltr">0.0015 in</span>. ')+(s.p?'':'المسار أقصر من <span class="ltr">3/8 in</span>. ')+'قد تخرج الغازات وهي ما زالت حارة فتشعل الجو المحيط بالجهاز.',cls:ok?'':'bad'}}})}
   ]},

  {st:10,short:'أجهزة التصنيف الثاني',title:'٢- الأجهزة الكهربائية الخاصة بالتصنيف الثاني <bdi dir="ltr">Class II</bdi>',ref:'ص 22',
   q:'غبار الدقيق يتراكم على مصباح ساخن… ما المشكلتان؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="جهاز عازل للأتربة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="غلاف الجهاز العازل للأتربة: محكم حتى لا تدخل الأتربة إلى داخل الجهاز الكهربائي."><rect x="110" y="96" width="140" height="120" rx="14" fill="#9AA5A0" stroke="#2C4A40" stroke-width="3"/><rect x="128" y="114" width="104" height="84" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><circle cx="180" cy="156" r="20" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/></g><g data-tip="الحشية (الجوان): تسد الفتحات بين الغطاء والجسم فلا يدخل الغبار."><rect x="110" y="96" width="140" height="120" rx="14" fill="none" stroke="#12855A" stroke-width="3" stroke-dasharray="8 5"/></g><g data-tip="غبار قابل للاشتعال خارج الجهاز: يبقى خارجه."><g fill="#9AA5A0"><circle cx="76" cy="110" r="4"/><circle cx="90" cy="140" r="3"/><circle cx="70" cy="170" r="4"/><circle cx="94" cy="200" r="3"/><circle cx="276" cy="120" r="4"/><circle cx="292" cy="150" r="3"/><circle cx="270" cy="186" r="4"/><circle cx="288" cy="210" r="3"/><circle cx="150" cy="78" r="3"/><circle cx="206" cy="72" r="4"/></g></g><text x="180" y="248" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">لا يدخله الغبار</text><text x="180" y="268" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">ولا ترتفع حرارته</text></svg>`,
   cap:'جهاز للتصنيف الثاني (رسم توضيحي).<br><b>مرّر المؤشر على الغلاف والإطار الأخضر والغبار (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'ما الشرطان في أجهزة التصنيف الثاني حسب الكتاب؟',opts:[
     ['صندوق مقاوم للانفجار وفجوة ضيقة',false,'هذه أجهزة التصنيف الأول.'],
     ['عازلة للأتربة، ولا تحدث زيادة في درجة الحرارة داخلها',true,'الكتاب (ص 22): «أجهزة كهربائية عازلة للأتربة حتى لا تدخل الأتربة… كذلك لا يحدث زيادة في درجة الحرارة داخل هذه الأجهزة».'],
     ['تمنع وصول الألياف فقط',false,'هذه أجهزة التصنيف الثالث.']]}}
   ],
   body:[
    {book:`<p>يتم استخدام أجهزة كهربائية عازلة للأتربة حتى لا تدخل الأتربة إلى داخل الجهاز الكهربائي، كذلك لا يحدث زيادة في درجة الحرارة داخل هذه الأجهزة</p>`,ref:'ص 22'},
    {tip:`<p>تذكّر مصادر الاشتعال في المحطة الثامنة: <b>الشرر</b> و<b>الحرارة</b>. الغلاف العازل يمنع الغبار من الوصول إلى الشرر داخل الجهاز، وعدم زيادة الحرارة يمنع الغبار المتراكم على سطحه من الاشتعال.</p>`},
    {title:'مختبر مصغّر: صح أم خطأ؟',widget:(el,B)=>DCML.tf(el,B,{items:[
     ['أجهزة التصنيف الثاني تكون عازلة للأتربة.',true,'نص الكتاب.'],
     ['يكفي أن يكون الجهاز عازلاً للأتربة حتى لو ارتفعت حرارته كثيراً.',false,'الكتاب يشترط أيضاً ألا تحدث زيادة في درجة الحرارة داخلها.'],
     ['الأجهزة الكهربائية الخاصة بالصنف الثالث تكون مصممة لمنع وصول الأتربة إليها.',false,'عبارة من أسئلة الوحدة (ص 24): العازلة للأتربة هي أجهزة الصنف الثاني؛ أما الثالث فيمنع الألياف.']]})}
   ]},

  {st:11,short:'أجهزة التصنيف الثالث',title:'٣- الأجهزة الكهربائية الخاصة بالتصنيف الثالث <bdi dir="ltr">Class III</bdi>',ref:'ص 22',
   q:'ليف قطن طائر يدخل محركاً ساخناً… ماذا يحدث؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="جهاز يمنع دخول الألياف إلى صندوقه" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E3ECF7"/><g data-tip="الصندوق الخاص بالجهاز ⟦Housing⟧: مصمم لمنع وصول الألياف القابلة للاشتعال إلى داخله."><rect x="104" y="104" width="152" height="104" rx="12" fill="#4FB3A9" stroke="#2C4A40" stroke-width="3"/><circle cx="180" cy="156" r="28" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="180" cy="156" r="8" fill="#2C4A40"/></g><g data-tip="ألياف قابلة للاشتعال في الجو: تبقى خارج الصندوق."><path d="M60 110 L92 120 M62 132 L90 126 M66 180 L94 190 M270 98 L300 110 M272 200 L304 192 M268 150 L298 160" stroke="#9AA5A0" stroke-width="3" stroke-linecap="round"/></g><g data-tip="الألياف تصطدم بالغلاف ولا تدخل."><path d="M96 124 l8 0 M256 156 l8 0" stroke="#C0392B" stroke-width="3"/><path d="M100 118 l-6 6 l6 6 M260 150 l6 6 l-6 6" fill="none" stroke="#C0392B" stroke-width="2.5"/></g><text x="180" y="244" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">الألياف تبقى خارج الصندوق</text><text x="180" y="268" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)">Housing</text></svg>`,
   cap:'جهاز للتصنيف الثالث (رسم توضيحي).<br><b>مرّر المؤشر على الصندوق والألياف والأسهم (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'أجهزة التصنيف الثالث مصممة لمنع…',opts:[
     ['وصول الألياف القابلة للاشتعال إلى صناديقها',true,'الكتاب (ص 22): «مصممة لمنع وصول الألياف القابلة للاشتعال من الدخول إلى الصناديق الخاصة بها (Housing)».'],
     ['وصول الغازات',false,'الغازات للتصنيف الأول، وأجهزته صناديق مقاومة للانفجار.'],
     ['الانفجار داخلها',false,'هذا وصف الصندوق المقاوم للانفجار.']]}}
   ],
   body:[
    {book:`<p>يتم استخدام أجهزة كهربائية مصممة لمنع وصول الألياف القابلة للاشتعال من الدخول إلى الصناديق الخاصة بها (Housing)</p>`,ref:'ص 22'},
    {title:'مختبر مصغّر: الجهاز المناسب لكل تصنيف',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل وصف جهاز: لأي تصنيف يناسب حسب الكتاب؟',cats:['Class I','Class II','Class III'],items:[
     ['صندوق حديدي مقاوم للانفجار، يمنع خروج الغازات الحارة.',0,'أجهزة التصنيف الأول (ص 21).'],
     ['جهاز مصمم لمنع وصول الألياف إلى صندوقه.',2,'أجهزة التصنيف الثالث (ص 22).'],
     ['جهاز عازل للأتربة لا تزيد حرارته من الداخل.',1,'أجهزة التصنيف الثاني (ص 22).'],
     ['مصباح لمحطة بنزين.',0,'محطات البنزين من التصنيف الأول، فالمصباح داخل صندوق مقاوم للانفجار.'],
     ['محرك في مطحنة دقيق.',1,'مطاحن الدقيق من التصنيف الثاني، فالمحرك عازل للأتربة.'],
     ['مفتاح في محلج أقطان.',2,'حلج الأقطان من التصنيف الثالث، فالمفتاح يمنع دخول الألياف.']]})}
   ]},

  {st:12,short:'أسئلة الوحدة',title:'أسئلة الوحدة الثانية',ref:'ص 23–24',
   q:'هل تستطيع الإجابة قبل أن تفتح الإجابة المقترحة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="نوعان من أسئلة الوحدة الثانية" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBEBDD"/><rect x="96" y="54" width="168" height="214" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><g data-tip="الأسئلة من الأول إلى الحادي عشر (ص 23): أسئلة مقالية، ومنها سؤال حسابي (السادس) عن متوسط التركيز."><circle cx="238" cy="88" r="11" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/><text x="238" y="93" text-anchor="middle" font-size="13" font-weight="700" fill="#FBF6EE">؟</text><path d="M120 84 h96 M120 98 h72 M120 112 h88" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><rect x="120" y="128" width="96" height="30" rx="4" fill="#E3ECF7" stroke="#2C4A40" stroke-width="2"/><text x="168" y="148" text-anchor="middle" font-size="12" fill="#2C4A40" font-family="var(--mono)">÷ 8</text></g><g data-tip="ضع علامة ✓ أو × (ص 23–24): سبع عبارات."><rect x="120" y="186" width="20" height="20" rx="3" fill="#BFE3DC" stroke="#12855A" stroke-width="2"/><path d="M124 196 l4 4 l8 -8" fill="none" stroke="#12855A" stroke-width="2.5"/><path d="M150 196 h70" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><rect x="120" y="218" width="20" height="20" rx="3" fill="#F6C6BC" stroke="#C0392B" stroke-width="2"/><path d="M125 223 l10 10 M135 223 l-10 10" stroke="#C0392B" stroke-width="2.5"/><path d="M150 228 h54" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/></g><text x="180" y="296" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">مقالي وحسابي · صح وخطأ</text></svg>`,
   cap:'أسئلة الوحدة نوعان.<br><b>مرّر المؤشر على كل جزء من الورقة (أو المسه في الجوال) لتعرف نوعه.</b>',
   side:[
    {predict:{q:'العبارة: «الأجهزة الكهربائية الخاصة بالصنف الثالث تكون مصممة لمنع وصول الأتربة إليها». صح أم خطأ؟',opts:[
     ['صح',false,'الكتاب يقول إن أجهزة الصنف الثالث تمنع وصول الألياف.'],
     ['خطأ',true,'أجهزة الصنف الثالث تمنع وصول <b>الألياف</b>؛ أما العازلة للأتربة فهي أجهزة الصنف الثاني (ص 22).']]}}
   ],
   body:[
    {tip:`<p>اضغط على السؤال لترى إجابة مقترحة. الكتاب لا يعطي إجابات. وحل السؤال السادس خطوة بخطوة في تبويب «الأمثلة المحلولة» في الدرس 2.2.</p>`},
    {html:QU2()},
    {watch:`<p>في الكتاب سؤالان يحملان رقم «الثامن» (ما التصنيف المتبع… / ضع علامة)، فرقّمنا الأسئلة بالتسلسل. وفي نص السؤال السادس أخطاء طباعية («الثمانة»، «تالييتين»، «سعات») صححناها.</p>`,fix:true}
   ]},

  {recap:[
   'المنطقة الخطرة: خطر حريق أو انفجار كبير لوجود غازات وأبخرة، أو غبار، أو ألياف قابلة للاشتعال (ص 18).',
   'التصنيف: <span class="ltr">Class I</span> غازات وأبخرة، و<span class="ltr">Class II</span> غبار وأتربة، و<span class="ltr">Class III</span> ألياف وأنسجة؛ والقسم: <span class="ltr">Division 1</span> في الظروف العادية، و<span class="ltr">Division 2</span> عند العطل والتسرب (ص 19–20).',
   'المجموعات: <span class="ltr">A–D</span> للتصنيف الأول (استيلين، هيدروجين، إثيل إثير، جازولين)، و<span class="ltr">E–G</span> للثاني (أتربة معدنية، كربون، دقيق ونشا) (ص 20–21).',
   'الأجهزة تشعل بالشرر أو الحرارة أو الخلل؛ فللتصنيف الأول صناديق مقاومة للانفجار، وللثاني أجهزة عازلة للأتربة لا تسخن، وللثالث أجهزة تمنع دخول الألياف (ص 21–22).']}
],
 theory:[
  {h:'٢-٥ تقسيم وتصنيف المناطق الخطرة HAZARDOUS (CLASSIFIED) LOCATIONS',ref:'ص 18–19',html:`<p><b>المقدمة:</b> تعرف المناطق الخطرة بأنها المناطق التي يكون خطر حدوث حريق أو انفجار بها كبيراً نظراً لوجود غازات أو أبخرة قابلة للاشتعال أو سوائل مشتعلة أو أتربة وغبار قابل للاشتعال أو ألياف وأنسجة صناعية قابلة للاشتعال. وقد تم تقسيم المناطق الخطرة بحسب المواصفات العالمية كما يلي:</p>
   <ul><li><b>التصنيف الأول ${lt('CLASS I')}:</b> موقع مشبع بالغازات والأبخرة القابلة للاشتعال، ومثال على هذه المواقع (مصافي البترول – معامل الغاز – محطات البنزين …) (شكل (9-2)).</li>
   <li><b>التصنيف الثاني ${lt('CLASS II')}:</b> موقع مشبع لغبار وأتربة قابلة للاشتعال، ومثال ذلك (مطاحن الدقيق – المصانع التي تستعمل بودرة الألومنيوم والماغنسيوم – مصانع البلاستيك …) (شكل (10-2)).</li>
   <li><b>التصنيف الثالث ${lt('CLASS III')}:</b> موقع به مواد كالألياف والأنسجة الصناعية القابلة للاشتعال، مثال ذلك (مصانع النسيج – حلج الأقطان …) (شكل (11-2)).</li></ul>
   <p>بخلاف تقسيم المناطق الخطرة إلى درجات (Classes) فقد تم تقسيم الدرجات إلى أقسام (Divisions):</p>
   <ul><li><b>قسم (1) ${lt('DIVISION I')}:</b> وهي المناطق التي تفترض وجود غازات وأبخرة قابلة للاشتعال أو غبار قابل للاشتعال <b>في الظروف العادية</b> ${lt('Normal Conditions')} وخلال العمليات اليومية العادية في هذا المكان، وعلى سبيل المثال أثناء رش ودهان السيارات (شكل (9-2)).</li>
   <li><b>قسم (2) ${lt('DIVISION II')}:</b> <span class="ref">ص 20</span> وهي المناطق التي تفترض تواجد الغازات والأبخرة القابلة للاشتعال كذلك الغبار القابل للاشتعال <b>في ظروف غير عادية</b> (حوادث تسرب مثلاً)، وذلك نتيجة لأية أعطال بالمعدات تنشأ عنها تسرب للمواد القابلة للاشتعال (شكل (10-2)).</li></ul>`},
  {fig:'(9-2)',ref:'ص 19',caption:'الغازات والأبخرة: القسم 1 (منطقة الرش) والقسم 2 (التخزين) — رسم مبسّط',draw:()=>`<div class="svgbox" style="max-width:560px;margin-inline:auto">${F29()}</div>`},
  {fig:'(10-2)',ref:'ص 20',caption:'الأتربة القابلة للاشتعال: القسم 1 والقسم 2 — رسم مبسّط',draw:()=>`<div class="svgbox" style="max-width:560px;margin-inline:auto">${F210()}</div>`},
  {fig:'(11-2)',ref:'ص 20',caption:'الألياف القابلة للاشتعال: القسم 1 (تُستعمل أو تُصنع) والقسم 2 (تُخزن أو تُناول) — رسم مبسّط',draw:()=>`<div class="svgbox" style="max-width:560px;margin-inline:auto">${F211()}</div>`},
  {h:'المجموعات Groups',ref:'ص 20–21',html:`<p>كذلك بالإضافة للمناطق والدرجات ${lt('Classes')} والأقسام ${lt('Divisions')} يتم تقسيم المواد الكيميائية القابلة للاشتعال إلى مجموعات: المجموعات من (أ) إلى (د) تابعة للتصنيف الأول ${lt('Class I')} وقسمت حسب <b>الخواص الاشتعالية لكل مادة</b>، والمجموعات من (هـ) إلى (ز) تابعة للتصنيف الثاني ${lt('Class II')} وقسمت حسب درجة الاشتعال كذلك والتوصيل الكهربائي ${lt('Conductivity')}.</p>
   <div class="tablebox"><table class="tt"><thead><tr><th>المجموعة</th><th>التصنيف</th><th>المادة / المثال</th></tr></thead><tbody>${GROUPS.map(g=>`<tr><td>${g[1]} ${lt('Group '+g[0])}</td><td>${lt('Class '+g[2])}</td><td>${g[3]}</td></tr>`).join('')}</tbody></table></div>`},
  {err:'<span class="fixnote">في الكتاب (ص 21) المجموعة (ز) مكتوبة «Group E» مرة ثانية، والصواب <b>Group G</b> (المجموعات من A إلى G)، فصححناها في الجدول. وفي الكتاب «حسب درجة الاستعمال» والمقصود «درجة الاشتعال».</span>'},
  {h:'٢-٦ نوعية الأجهزة الكهربائية التي يتم تركيبها في المناطق الخطرة',ref:'ص 21',html:`<p>الطريقة التي تجعل الأجهزة الكهربائية مصدراً للاشتعال هي:</p><ol><li><b>حدوث شرر</b> أثناء التشغيل.</li><li><b>درجات الحرارة العالية</b> لبعض الأجهزة مثل مصابيح الإضاءة تصبح ساخنة وترتفع درجة حرارتها مما قد يسبب اشتعال المواد القابلة للاشتعال.</li><li><b>حدوث خلل</b> في الأجهزة الكهربائية قد يؤدي لحدوث شرر يسبب الاشتعال.</li></ol>
   <p>ولتجنب الأخطار الناتجة عن الأجهزة الكهربائية كمصدر للحرائق في المناطق المصنفة خطرة، يجب اختيار المعدات والأجهزة المناسبة لكل منطقة:</p>
   <ol><li><b>الأجهزة الخاصة بالتصنيف الأول ${lt('Class I')}:</b> يتم استخدام الأجهزة الكهربائية التي تحفظ داخل <b>صناديق حديدية مقاومة للانفجار</b> ${lt('Explosion proof')} (الشكلان (12-2) و(13-2))، وذلك لاحتمال تسرب الأبخرة والغازات القابلة للاشتعال إلى داخل صندوق الأجهزة الكهربائية، وفي حالة اشتعال أو انفجار هذه الأبخرة أو الغازات فإن الصندوق الحديدي يمنع تسرب الانفجار أو الغازات الحارة إلى الجو المحيط بالجهاز الكهربائي.</li>
   <li><b>الأجهزة الخاصة بالتصنيف الثاني ${lt('Class II')}:</b> <span class="ref">ص 22</span> يتم استخدام أجهزة كهربائية <b>عازلة للأتربة</b> حتى لا تدخل الأتربة إلى داخل الجهاز الكهربائي، كذلك لا يحدث زيادة في درجة الحرارة داخل هذه الأجهزة.</li>
   <li><b>الأجهزة الخاصة بالتصنيف الثالث ${lt('Class III')}:</b> يتم استخدام أجهزة كهربائية مصممة لمنع وصول <b>الألياف</b> القابلة للاشتعال من الدخول إلى الصناديق الخاصة بها ${lt('(Housing)')}.</li></ol>`},
  {fig:'(12-2)',ref:'ص 21',caption:'رمز الغلاف المقاوم للهب (d)',draw:()=>`<div class="svgbox" style="max-width:300px;margin-inline:auto">${dSymbol()}</div>`},
  {fig:'(13-2)',ref:'ص 22',caption:'فتحات مصممة في الوصلة الملولبة (يسار) وفي الوصلة المستوية المخروطة (يمين): تخرج الغازات الحارة من الوصلة وقد بردت',draw:()=>`<div class="svgbox" style="max-width:560px;margin-inline:auto">${jointFig()}</div>`},
  {note:`<b>توضيح للمتدرب (ليس من نص الكتاب):</b> الصندوق المقاوم للانفجار <b>لا يمنع</b> دخول الغاز ولا الانفجار داخله؛ بل يتحمل الانفجار، ويجعل الغازات الحارة تمر في فجوة ضيقة جداً وطويلة بين الشفتين (أقصاها ${lt('0.0015 in')} ≈ ${lt('0.04 mm')}، وأقل طول ${lt('3/8 in')} ≈ ${lt('9.5 mm')} كما في الشكل)، فتفقد حرارتها في المعدن وتخرج باردة لا تشعل ما حول الجهاز. جرّب ذلك في «المختبر».`},
  {h:'أسئلة الوحدة الثانية',ref:'ص 23–24',html:`<p class="sub">اضغط على السؤال لترى إجابة مقترحة. الكتاب لا يعطي إجابات.</p>`+QU2()+`<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> في الكتاب سؤالان يحملان رقم «الثامن» (ما التصنيف المتبع… / ضع علامة)، فرقّمنا الأسئلة بالتسلسل. وفي نص السؤال السادس أخطاء طباعية («الثمانة»، «تالييتين»، «سعات») صححناها.</div>`}
 ],
 lab:(el)=>lab24(el),
 quiz:[
  {q:'موقع مشبع بالغازات والأبخرة القابلة للاشتعال مثل محطات البنزين يتبع:',o:['Class I','Class II','Class III','لا يصنف'],c:0,e:'(ص 19).'},
  {q:'مطاحن الدقيق مثال على:',o:['Class I','Class II','Class III','Group A'],c:1,e:'غبار وأتربة قابلة للاشتعال (ص 19).'},
  {q:'القسم (Division 2) هو للمناطق التي توجد فيها المواد القابلة للاشتعال:',o:['في الظروف العادية يومياً','في ظروف غير عادية مثل حوادث التسرب','دائماً بتركيز عال','لا توجد أبداً'],c:1,e:'(ص 20).'},
  {q:'المجموعة التي تضم أجواء غاز الهيدروجين:',o:['Group A','Group B','Group D','Group E'],c:1,e:'(ص 20).'},
  {q:'الأجهزة المناسبة للتصنيف الأول Class I:',o:['أجهزة عازلة للأتربة','صناديق حديدية مقاومة للانفجار','أجهزة تمنع دخول الألياف','أي جهاز عادي'],c:1,e:'(ص 21).'},
  {q:'في الشكل (13-2) أقصى فجوة في الوصلة المستوية للشفّة:',o:['0.0015 in','3/8 in','1 mm','0.15 in'],c:0,e:'«Maximum Gap 0.0015 in.»؛ و3/8 in هو أقل طول لمسار اللهب.'}
 ]
});
})(PLCBOOK);
