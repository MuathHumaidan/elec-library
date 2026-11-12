/* Unit 3 — مهمات السلامة للوقاية الشخصية (ص 25–56) — u3-l1 … u3-l6 */
(function(B){
"use strict";
/* «اكتشف العطل» و«تحدي المحاكاة» (challenge.js): chOn() = وضع التحدي (false دائماً خارج ?ch=1) */
const chOn=()=>!!(B.chOn&&B.chOn());
/* =====================================================================
   small helpers (local to this file)
   ===================================================================== */
const box=(h,mw)=>`<div class="svgbox" style="max-width:${mw||560}px;margin-inline:auto">${h}</div>`;
const tries=list=>`<h3 class="sm">جرّب</h3><ul class="sub" style="padding-inline-start:20px;margin-top:4px">${list.map(t=>`<li>${t}</li>`).join('')}</ul>`;
const segHTML=(attr,items,cur,wrap)=>`<div class="seg" role="group"${wrap?' style="flex-wrap:wrap"':''}>${items.map(([v,l])=>`<button data-${attr}="${v}" aria-pressed="${String(v)===String(cur)}">${l}</button>`).join('')}</div>`;
const setSeg=(root,attr,cur)=>root.querySelectorAll(`[data-${attr}]`).forEach(b=>b.setAttribute('aria-pressed',String(b.dataset[attr]===String(cur))));
const L_=t=>`<span class="ltr">${t}</span>`;
const ADD='<b>إضافة من خارج الكتاب:</b> ';
const TIP='<b>توضيح للمتدرب (ليس من نص الكتاب):</b> ';
function loopOn(el,fn){let last=performance.now();const f=now=>{if(!document.body.contains(el))return;const dt=Math.min(0.05,Math.max(0,(now-last)/1000));last=now;try{fn(dt,now/1000)}catch(e){console.error(e);return}requestAnimationFrame(f)};requestAnimationFrame(f)}
/* «جرّب» step list with auto-check */
function stepsUI(host,steps,getW){let i=0;
  const draw=()=>{host.innerHTML=steps.map((s,j)=>`<li class="${j<i?'done':j===i?'cur':''}"><span class="k">${j<i?'✓':j+1}</span><div><h4>${s.t}</h4><p>${s.x}</p>${j===i?`<div class="act">${s.done?'<span class="hint">بانتظار تنفيذك…</span> <button class="btn" data-next>تخطَّ</button>':'<button class="btn primary" data-next>التالي</button>'}</div>`:''}</div></li>`).join('')+
    (i>=steps.length?`<li class="cur"><span class="k">✓</span><div><h4>أحسنت، أنهيت المهام</h4><p style="display:block">يمكنك إعادة المحاولة بأرقام أخرى.</p><div class="act"><button class="btn" data-restart>إعادة</button></div></div></li>`:'')};
  host.addEventListener('click',e=>{if(e.target.closest('[data-next]')){i++;draw()}if(e.target.closest('[data-restart]')){i=0;draw()}});draw();
  return {check(){const s=steps[i];if(s&&s.done&&s.done(getW())){i++;draw()}}}}
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
/* SVG text: Arabic and Latin/digits are always separate elements */
const ar=(x,y,t,o)=>{o=o||{};return `<text class="txt ar${o.m?' m':''}" x="${x}" y="${y}" text-anchor="${o.a||'middle'}" style="font-size:${o.fs||12}px${o.fill?';fill:'+o.fill:''}${o.w?';font-weight:'+o.w:''}">${t}</text>`};
const lt=(x,y,t,o)=>{o=o||{};return `<text class="txt${o.m?' m':''}" x="${x}" y="${y}" text-anchor="${o.a||'middle'}" style="font-size:${o.fs||11}px${o.fill?';fill:'+o.fill:''}${o.w?';font-weight:'+o.w:''}">${t}</text>`};
const S=(f,s,w)=>`style="fill:${f||'none'};stroke:${s||'var(--fg)'};stroke-width:${w||1.4};stroke-linejoin:round;stroke-linecap:round"`;
const svg=(w,h,body,lbl)=>`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${lbl||''}">${body}</svg>`;
/* real safety colours (sign/pipe colours are physical colours, like lamp colours) */
const SC={red:'#c62828',orange:'#ef6c00',fluo:'#ff4f1a',yellow:'#f5c400',green:'#2e7d32',blue:'#1565c0',magenta:'#b5179e',black:'#111',white:'#fff',purple:'#7b2d9e'};

/* =====================================================================
   PPE icon library — each item drawn in a 60×60 box
   ===================================================================== */
const ICON={
 glasses:()=>`<path d="M5 25H55" ${S('', 'var(--fg)',2)}/><rect x="8" y="22" width="19" height="15" rx="6" ${S('var(--blue-soft)')}/><rect x="33" y="22" width="19" height="15" rx="6" ${S('var(--blue-soft)')}/><path d="M27 28q3-4 6 0" ${S()}/><path d="M8 24L2 27V35L8 33M52 24L58 27V35L52 33" ${S('var(--surface-2)')}/>`,
 goggle:()=>`<path d="M2 31H8M52 31H58" ${S('','var(--fg)',4)}/><rect x="7" y="19" width="46" height="23" rx="10" ${S('var(--blue-soft)','var(--fg)',1.8)}/><path d="M27 41q3-5 6 0" ${S('var(--surface)')}/><circle cx="12" cy="25" r="1.6" style="fill:var(--fg)"/><circle cx="48" cy="25" r="1.6" style="fill:var(--fg)"/>`,
 shield:()=>`<path d="M9 13Q30 3 51 13" ${S('','var(--fg)',4)}/><path d="M9 15H51L48 50Q30 58 12 50Z" style="fill:var(--blue-soft);fill-opacity:.75;stroke:var(--blue);stroke-width:1.6"/><path d="M15 20L18 46" style="stroke:var(--surface);stroke-width:2;opacity:.8"/>`,
 gloves:()=>`<path d="M20 57V40L12 29Q10 25 14 24T20 28L23 33V15Q23 12 26 12T29 15V30V10Q29 7 32 7T35 10V30V13Q35 10 38 10T41 13V31V18Q41 15 44 15T47 18V40Q47 50 41 57Z" style="fill:var(--fg)"/><path d="M21 50L46 46" style="stroke:var(--surface);stroke-width:2.4"/>`,
 apron:()=>`<path d="M22 13Q30 2 38 13" ${S('','var(--fg)',3)}/><path d="M22 13H38L41 24H52V28H42L47 57H13L18 28H8V24H19Z" style="fill:var(--fg)"/>`,
 dust:()=>`<ellipse cx="30" cy="28" rx="17" ry="22" ${S('var(--surface-2)')}/><circle cx="24" cy="22" r="1.8" style="fill:var(--fg)"/><circle cx="36" cy="22" r="1.8" style="fill:var(--fg)"/><path d="M16 33Q30 22 44 33Q42 48 30 50Q18 48 16 33Z" ${S('var(--surface)','var(--fg)',1.6)}/><path d="M16 33L11 26M44 33L49 26" ${S()}/><path d="M22 38H38M23 43H37" ${S('','var(--muted)',1)}/>`,
 vapor:()=>`<ellipse cx="30" cy="28" rx="17" ry="22" ${S('var(--surface-2)')}/><circle cx="24" cy="21" r="1.8" style="fill:var(--fg)"/><circle cx="36" cy="21" r="1.8" style="fill:var(--fg)"/><path d="M19 31Q30 24 41 31L39 46Q30 51 21 46Z" ${S('var(--wire)','var(--fg)',1.6)}/><circle cx="16" cy="41" r="8" ${S('var(--surface)','var(--fg)',1.6)}/><circle cx="44" cy="41" r="8" ${S('var(--surface)','var(--fg)',1.6)}/><path d="M11 41H21M16 36V46M39 41H49M44 36V46" ${S('','var(--muted)',1)}/>`,
 dv:()=>`<ellipse cx="30" cy="28" rx="17" ry="22" ${S('var(--surface-2)')}/><circle cx="24" cy="21" r="1.8" style="fill:var(--fg)"/><circle cx="36" cy="21" r="1.8" style="fill:var(--fg)"/><path d="M19 31Q30 24 41 31L39 46Q30 51 21 46Z" ${S('var(--wire)','var(--fg)',1.6)}/><rect x="6" y="33" width="20" height="16" rx="4" ${S('var(--live-soft)','var(--fg)',1.6)}/><rect x="34" y="33" width="20" height="16" rx="4" ${S('var(--live-soft)','var(--fg)',1.6)}/><path d="M9 38H23M9 43H23M37 38H51M37 43H51" ${S('','var(--live)',1.2)}/>`,
 airline:()=>`<ellipse cx="26" cy="29" rx="18" ry="23" ${S('var(--wire)','var(--fg)',1.8)}/><ellipse cx="26" cy="22" rx="12" ry="8" ${S('var(--blue-soft)')}/><circle cx="26" cy="42" r="5" ${S('var(--surface)')}/><path d="M31 44Q44 52 48 40T58 34" ${S('','var(--fg)',4)}/><path d="M31 44Q44 52 48 40T58 34" ${S('','var(--surface-2)',1.5)}/>`,
 suit:()=>`<circle cx="30" cy="12" r="8" ${S('var(--live-soft)','var(--fg)',1.6)}/><rect x="25" y="9" width="10" height="6" rx="2" ${S('var(--blue-soft)')}/><path d="M18 22H42L48 40L43 42L40 32V56H32V40H28V56H20V32L17 42L12 40Z" ${S('var(--live-soft)','var(--fg)',1.6)}/>`,
 boot:()=>`<path d="M14 6H30V40L48 46Q53 48 53 53V56H14Z" style="fill:var(--fg)"/><path d="M14 11H30" style="stroke:var(--surface);stroke-width:2"/>`,
 helmet:()=>`<path d="M10 38Q10 12 30 12T50 38Z" ${S('var(--live)','var(--fg)',1.6)}/><path d="M4 38H56V43H4Z" ${S('var(--live)','var(--fg)',1.6)}/><path d="M30 12V38" ${S('','var(--fg)',1)}/>`,
 muffs:()=>`<path d="M14 32Q14 6 30 6T46 32" ${S('','var(--fg)',3.5)}/><rect x="6" y="27" width="14" height="24" rx="6" ${S('var(--stop)')}/><rect x="40" y="27" width="14" height="24" rx="6" ${S('var(--stop)')}/>`,
 plugs:()=>`<path d="M16 30Q30 56 44 30" ${S('','var(--blue)',1.6)}/><rect x="9" y="14" width="13" height="18" rx="6" ${S('var(--live)')}/><rect x="38" y="14" width="13" height="18" rx="6" ${S('var(--live)')}/>`,
 shoe:()=>`<path d="M8 22H26V34L48 39Q55 41 55 47V52H8Z" ${S('var(--fg)','var(--fg)')}/><path d="M28 36Q40 34 48 39Q55 41 55 47H28Z" style="fill:var(--wire)"/>`
};
const icon=(k,sz)=>`<svg viewBox="0 0 60 60" width="${sz||46}" height="${sz||46}" aria-hidden="true">${ICON[k]()}</svg>`;

/* =====================================================================
   PPE items used in the letter table (ص 44–47)
   ===================================================================== */
const PPE={
 glassG:{ic:'glasses',ar:'نظارة زجاجية',en:'Safety Glasses'},
 glassP:{ic:'glasses',ar:'نظارة بلاستيك',en:'Safety Glasses'},
 gogP:{ic:'goggle',ar:'نظارة بلاستيك',en:'Safety Goggle'},
 shield:{ic:'shield',ar:'حامي الوجه',en:'Face Shield'},
 gloves:{ic:'gloves',ar:'قفازات',en:'Gloves'},
 apron:{ic:'apron',ar:'مريلة بلاستيك',en:'Apron'},
 dust:{ic:'dust',ar:'كمامة أتربة',en:'Dust Mask'},
 vapor:{ic:'vapor',ar:'كمامة ضد الأبخرة',en:'Vapor Resp.'},
 dv:{ic:'dv',ar:'كمامة ضد الأبخرة والأتربة',en:'Dust &amp; Vapor Resp.'},
 airline:{ic:'airline',ar:'قناع تنفس مع خرطوم تزويد هواء',en:'Mask + Airline'},
 suit:{ic:'suit',ar:'بدلة حماية كاملة',en:'Full Suit'},
 boot:{ic:'boot',ar:'حذاء طويل',en:'Long Boot'}
};
const LETTERS={A:['glassG'],B:['glassG','gloves'],C:['glassP','gloves','apron'],D:['shield','gloves','apron'],E:['glassP','gloves','dust'],F:['glassG','gloves','apron','dust'],
 G:['glassP','gloves','vapor'],H:['gogP','gloves','apron','vapor'],I:['glassP','gloves','dv'],J:['gogP','gloves','apron','dv'],K:['airline','gloves','suit','boot'],X:[]};
const LPAGE={A:'ص 44',B:'ص 45',C:'ص 45',D:'ص 45',E:'ص 45',F:'ص 45',G:'ص 46',H:'ص 46',I:'ص 46',J:'ص 46',K:'ص 47',X:'ص 47'};

/* =====================================================================
   the worker (front view) used by «جهّز العامل» and the respirator lab
   items: set of keys among glasses, goggle, shield, gloves, apron, dust, vapor, dv, airline, suit, boot, helmet, plugs, muffs
   ===================================================================== */
function workerSVG(on,o){o=o||{};const has=k=>on.has(k);let s='';
  const body=has('suit')?'var(--live-soft)':'var(--blue-soft)';
  // legs + shoes
  s+=`<rect x="82" y="226" width="34" height="122" rx="6" ${S(has('suit')?body:'var(--surface-2)')}/><rect x="124" y="226" width="34" height="122" rx="6" ${S(has('suit')?body:'var(--surface-2)')}/>`;
  s+=`<path d="M78 348H118V362H74Q72 352 78 348ZM122 348H162Q168 352 166 362H122Z" ${S('var(--fg)')}/>`;
  if(has('boot'))s+=`<path d="M80 282H118V362H72Q70 350 80 346ZM122 282H160V346Q170 350 168 362H122Z" style="fill:var(--fg)"/><path d="M80 290H118M122 290H160" style="stroke:var(--surface);stroke-width:2"/>`;
  // arms
  [[84,122,56,238],[156,122,184,238]].forEach(([x1,y1,x2,y2])=>{s+=`<path d="M${x1} ${y1}L${x2} ${y2}" style="stroke:var(--fg);stroke-width:25;stroke-linecap:round"/><path d="M${x1} ${y1}L${x2} ${y2}" style="stroke:${body};stroke-width:22;stroke-linecap:round"/>`});
  // torso
  s+=`<path d="M80 114Q120 104 160 114L166 232H74Z" ${S(body,'var(--fg)',1.6)}/>`;
  if(!has('suit'))s+=`<path d="M120 112V230" ${S('','var(--muted)',1)}/><circle cx="120" cy="140" r="2" style="fill:var(--muted)"/><circle cx="120" cy="170" r="2" style="fill:var(--muted)"/><circle cx="120" cy="200" r="2" style="fill:var(--muted)"/>`;
  // hands
  [[54,248],[186,248]].forEach(([x,y])=>{s+=has('gloves')?`<rect x="${x-14}" y="${y-22}" width="28" height="38" rx="9" style="fill:var(--fg)"/><path d="M${x-12} ${y-14}H${x+12}" style="stroke:var(--surface);stroke-width:2"/>`:`<circle cx="${x}" cy="${y}" r="11" ${S('var(--surface-2)')}/>`});
  // apron
  if(has('apron'))s+=`<path d="M96 116Q120 92 144 116" ${S('','var(--fg)',3)}/><path d="M96 118H144L150 160H164V166H150L158 300H82L90 166H76V160H90Z" style="fill:var(--surface);stroke:var(--fg);stroke-width:1.6;opacity:.96"/>`+lt(120,214,'APRON',{m:1,fs:9});
  // neck + head
  s+=`<rect x="110" y="98" width="20" height="16" ${S('var(--surface-2)')}/>`;
  if(has('suit'))s+=`<path d="M78 76Q78 24 120 24T162 76V114H78Z" ${S(body,'var(--fg)',1.6)}/>`;
  s+=`<circle cx="120" cy="68" r="32" ${S('var(--surface-2)','var(--fg)',1.6)}/>`;
  s+=`<circle cx="107" cy="63" r="3" style="fill:var(--fg)"/><circle cx="133" cy="63" r="3" style="fill:var(--fg)"/><path d="M111 86Q120 91 129 86" ${S()}/><path d="M120 66V77" ${S('','var(--muted)',1.2)}/>`;
  if(!has('suit'))s+=`<path d="M89 56Q92 34 120 34T151 56Q140 44 120 44T89 56Z" style="fill:var(--fg)"/>`;
  // ears / hearing
  if(has('plugs'))s+=`<circle cx="88" cy="70" r="5" style="fill:var(--live)"/><circle cx="152" cy="70" r="5" style="fill:var(--live)"/>`;
  if(has('muffs'))s+=`<path d="M88 66Q88 26 120 26T152 66" ${S('','var(--fg)',4)}/><rect x="78" y="56" width="16" height="28" rx="7" style="fill:var(--stop)"/><rect x="146" y="56" width="16" height="28" rx="7" style="fill:var(--stop)"/>`;
  // respiratory
  if(has('dust'))s+=`<path d="M102 80Q120 68 138 80Q136 98 120 100Q104 98 102 80Z" ${S('var(--surface)','var(--fg)',1.6)}/><path d="M102 80L89 70M138 80L151 70" ${S()}/>`;
  if(has('vapor')||has('dv')){s+=`<path d="M104 78Q120 70 136 78L134 96Q120 103 106 96Z" ${S('var(--wire)','var(--fg)',1.6)}/><path d="M104 80L89 70M136 80L151 70" ${S()}/>`;
    s+=has('dv')?`<rect x="88" y="84" width="20" height="16" rx="4" ${S('var(--live-soft)','var(--fg)',1.4)}/><rect x="132" y="84" width="20" height="16" rx="4" ${S('var(--live-soft)','var(--fg)',1.4)}/><path d="M91 89H105M91 94H105M135 89H149M135 94H149" ${S('','var(--live)',1.1)}/>`:`<circle cx="99" cy="92" r="8" ${S('var(--surface)')}/><circle cx="141" cy="92" r="8" ${S('var(--surface)')}/>`}
  if(has('airline'))s+=`<ellipse cx="120" cy="70" rx="30" ry="36" style="fill:var(--wire);stroke:var(--fg);stroke-width:1.8;opacity:.97"/><ellipse cx="120" cy="60" rx="21" ry="13" ${S('var(--blue-soft)')}/><circle cx="107" cy="61" r="3" style="fill:var(--fg)"/><circle cx="133" cy="61" r="3" style="fill:var(--fg)"/><circle cx="120" cy="90" r="7" ${S('var(--surface)')}/>`+
    `<path d="M125 96Q150 120 196 110T232 150" ${S('','var(--fg)',6)}/><path d="M125 96Q150 120 196 110T232 150" ${S('','var(--surface-2)',2.5)}/>`+ar(206,172,o.airLbl!=null?o.airLbl:'هواء من الضاغطة',{m:1,fs:10.5});
  // eyes / face
  if(has('glasses'))s+=`<path d="M92 60H148" ${S('','var(--fg)',2)}/><rect x="96" y="56" width="20" height="14" rx="5" style="fill:var(--blue-soft);stroke:var(--fg);stroke-width:1.4;opacity:.9"/><rect x="124" y="56" width="20" height="14" rx="5" style="fill:var(--blue-soft);stroke:var(--fg);stroke-width:1.4;opacity:.9"/>`;
  if(has('goggle'))s+=`<path d="M88 63H152" ${S('','var(--fg)',5)}/><rect x="94" y="52" width="52" height="22" rx="10" style="fill:var(--blue-soft);stroke:var(--fg);stroke-width:1.8;opacity:.92"/>`;
  if(has('shield'))s+=`<path d="M88 46Q120 32 152 46" ${S('','var(--fg)',5)}/><path d="M86 48H154L150 110Q120 124 90 110Z" style="fill:var(--blue-soft);fill-opacity:.55;stroke:var(--blue);stroke-width:1.8"/>`;
  if(has('helmet'))s+=`<path d="M86 52Q86 18 120 18T154 52Z" ${S('var(--live)','var(--fg)',1.6)}/><path d="M80 50H160V56H80Z" ${S('var(--live)','var(--fg)',1.4)}/>`;
  return svg(240,370,s,o.lbl||'عامل يرتدي مهمات الوقاية');
}

/* =====================================================================
   LESSON 1 — general guidelines, head, eye & face protection (ص 25–31)
   ===================================================================== */
/* helmet side view; type 1 = full brim, type 2 = peak */
function helmetG(cx,cy,sc,type,fill){const k=sc;const f=fill||'var(--live)';
  const brim=type===1?`<path d="M${cx-62*k} ${cy}Q${cx} ${cy+14*k} ${cx+62*k} ${cy}Q${cx} ${cy+5*k} ${cx-62*k} ${cy}Z" ${S(f,'var(--fg)',1.5)}/>`:`<path d="M${cx+30*k} ${cy-4*k}Q${cx+56*k} ${cy-3*k} ${cx+64*k} ${cy+5*k}Q${cx+44*k} ${cy+6*k} ${cx+30*k} ${cy+3*k}Z" ${S(f,'var(--fg)',1.5)}/>`;
  return `<path d="M${cx-44*k} ${cy}Q${cx-46*k} ${cy-58*k} ${cx} ${cy-60*k}Q${cx+46*k} ${cy-58*k} ${cx+44*k} ${cy}Z" ${S(f,'var(--fg)',1.6)}/><path d="M${cx} ${cy-60*k}Q${cx+4*k} ${cy-30*k} ${cx} ${cy}" ${S('','var(--fg)',1)}/>`+brim}
function fig31(){let s='';
  // cut-away section (right panel in the book)
  s+=`<path d="M60 190Q58 70 180 62Q300 70 300 178L352 184Q360 192 346 196L300 194Z" ${S('var(--surface-2)','var(--fg)',2.2)}/>`;
  s+=`<path d="M76 186Q76 84 180 78Q284 84 286 180" ${S('','var(--muted)',1)}/>`;
  s+=`<path d="M92 176Q96 104 180 98Q262 104 268 172" ${S('','var(--blue)',3)}/><path d="M120 178Q140 120 180 98Q222 120 240 176" ${S('','var(--blue)',3)}/><circle cx="180" cy="98" r="6" ${S('var(--surface)','var(--blue)',2)}/>`;
  s+=`<path d="M92 176Q180 196 268 172" ${S('','var(--blue-ink)',6)}/>`;
  s+=`<path d="M86 184L96 172L100 186Z" style="fill:var(--fg)"/>`;
  [[150,66],[180,63],[210,66]].forEach(([x,y])=>{s+=`<circle cx="${x}" cy="${y}" r="3.2" ${S('var(--surface)','var(--fg)',1.2)}/>`});
  s+=`<path d="M180 66V96" ${S('','var(--stop)',1.4)}/><path d="M176 72L180 66L184 72M176 90L180 96L184 90" ${S('','var(--stop)',1.4)}/>`;
  const lab=(x1,y1,x2,y2,t,a)=>`<path d="M${x1} ${y1}L${x2} ${y2}" ${S('','var(--muted)',1)}/>`+lt(x2+(a==='end'?-3:3),y2+4,t,{a:a||'start',fs:11});
  s+=lab(184,80,330,40,'Vertical clearance')+lab(182,104,330,70,'Level of top of head')+lab(212,66,330,14,'Ventilation holes')+lab(258,178,340,222,'Sweatband')+lab(250,130,330,100,'Harness')+lab(96,180,30,226,'Fastening')+lab(340,190,384,160,'Peak');
  // inverted helmet (suspension visible)
  s+=`<g transform="translate(470 120)"><ellipse cx="0" cy="0" rx="58" ry="34" ${S('var(--surface-2)','var(--fg)',1.8)}/><path d="M-50 -2Q0 30 50 -2M-40 -16Q0 24 40 18M-30 20L30 -20M30 20L-30 -20" ${S('','var(--fg)',2.2)}/><ellipse cx="0" cy="0" rx="40" ry="20" ${S('','var(--blue-ink)',3)}/></g>`;
  s+=`<g transform="translate(470 230)">${helmetG(0,0,0.85,2,'var(--surface)')}</g>`;
  return svg(560,260,s,'مقطع في الخوذة الواقية وأجزاؤها')}
function fig32(){const man=(cx)=>`<path d="M${cx-70} 200Q${cx-66} 150 ${cx-30} 140H${cx+30}Q${cx+66} 150 ${cx+70} 200Z" ${S('var(--surface-2)')}/><rect x="${cx-12}" y="122" width="24" height="22" ${S('var(--surface-2)')}/><circle cx="${cx}" cy="100" r="28" ${S('var(--surface-2)')}/><path d="M${cx-28} 96Q${cx} 64 ${cx+28} 96Q${cx} 80 ${cx-28} 96Z" style="fill:var(--fg)"/>`;
  let s=`<rect x="10" y="10" width="250" height="196" rx="10" style="fill:var(--live-soft)"/><rect x="290" y="10" width="250" height="196" rx="10" style="fill:var(--fg);opacity:.9"/>`;
  s+=man(135)+man(415);
  s+=`<g transform="translate(135 30) rotate(-20)"><rect x="-6" y="-4" width="12" height="40" rx="3" ${S('var(--live)')}/><rect x="-18" y="-14" width="36" height="14" rx="3" ${S('var(--wire)')}/></g><path d="M135 58V66M128 60L135 68L142 60" ${S('','var(--stop)',2)}/>`;
  s+=`<path d="M380 14L398 52L386 54L412 96M450 14L434 50L446 52L420 98M415 12V40L408 42L420 70" ${S('','#7fd3ff',3)}/>`;
  return svg(550,216,s,'المخاطر على الرأس: الأجسام الساقطة والكهرباء')}
function fig33(){let s='';
  s+=`<g transform="translate(140 120)">${helmetG(0,0,1.3,1,SC.yellow)}</g>`+lt(140,160,'Type 1 – Full Brim',{fs:12});
  s+=`<g transform="translate(400 120)">${helmetG(0,0,1.3,2,'var(--surface)')}</g>`+lt(400,160,'Type 2 - Peak',{fs:12});
  return svg(540,175,s,'نوعا الخوذات')}
/* the eleven protectors of figure (3-5) */
const PROT={
 1:`<path d="M4 30H86" ${S('','var(--fg)',3)}/><rect x="14" y="16" width="62" height="26" rx="12" ${S('var(--blue-soft)','var(--fg)',1.8)}/>${[22,30,38,52,60,68].map(x=>`<circle cx="${x}" cy="20" r="1.5" style="fill:var(--fg)"/>`).join('')}`,
 2:`<path d="M4 30H86" ${S('','var(--fg)',3)}/><rect x="14" y="16" width="62" height="26" rx="12" ${S('var(--blue-soft)','var(--fg)',1.8)}/><rect x="22" y="11" width="10" height="7" rx="2" ${S('var(--surface-2)')}/><rect x="58" y="11" width="10" height="7" rx="2" ${S('var(--surface-2)')}/>`,
 3:`<path d="M4 30H86" ${S('','var(--fg)',3)}/><rect x="12" y="14" width="66" height="30" rx="10" ${S('var(--surface-2)','var(--fg)',1.8)}/><rect x="18" y="19" width="54" height="20" rx="7" ${S('var(--blue-soft)')}/>`,
 4:`<path d="M10 24H80" ${S('','var(--fg)',1.2)}/><circle cx="30" cy="30" r="12" ${S('var(--blue-soft)','var(--fg)',1.2)}/><circle cx="60" cy="30" r="12" ${S('var(--blue-soft)','var(--fg)',1.2)}/><path d="M18 24L6 26V38L18 36M72 24L84 26V38L72 36" ${S('var(--surface-2)','var(--fg)',1)}/>`,
 5:`<rect x="16" y="19" width="26" height="22" rx="8" ${S('var(--blue-soft)','var(--fg)',3)}/><rect x="48" y="19" width="26" height="22" rx="8" ${S('var(--blue-soft)','var(--fg)',3)}/><path d="M42 26q3-3 6 0" ${S('','var(--fg)',3)}/><path d="M16 22L5 25V37L16 36M74 22L85 25V37L74 36" ${S('var(--surface-2)','var(--fg)',1.2)}/>`,
 6:`<path d="M12 22H78" ${S('','var(--fg)',3)}/><rect x="16" y="20" width="26" height="20" rx="6" ${S('var(--blue-soft)','var(--fg)',1.3)}/><rect x="48" y="20" width="26" height="20" rx="6" ${S('var(--blue-soft)','var(--fg)',1.3)}/><rect x="3" y="21" width="12" height="16" ${S('var(--surface-2)','var(--fg)',1)}/><rect x="75" y="21" width="12" height="16" ${S('var(--surface-2)','var(--fg)',1)}/>`,
 7:`<path d="M4 30H86" ${S('','var(--fg)',3)}/><circle cx="30" cy="30" r="14" style="fill:var(--fg);opacity:.85;stroke:var(--fg);stroke-width:2"/><circle cx="60" cy="30" r="14" style="fill:var(--fg);opacity:.85;stroke:var(--fg);stroke-width:2"/><path d="M44 30H46" ${S('','var(--fg)',3)}/>`,
 8:`<rect x="8" y="14" width="74" height="32" rx="12" ${S('var(--surface-2)','var(--fg)',1.6)}/><ellipse cx="30" cy="30" rx="13" ry="10" style="fill:var(--fg);opacity:.85"/><ellipse cx="60" cy="30" rx="13" ry="10" style="fill:var(--fg);opacity:.85"/>`,
 9:`<rect x="8" y="14" width="74" height="32" rx="12" ${S('var(--surface-2)','var(--fg)',1.6)}/><rect x="18" y="21" width="54" height="18" rx="4" style="fill:var(--fg);opacity:.85"/>`,
 10:`<path d="M18 8Q45 0 72 8" ${S('','var(--fg)',3)}/><path d="M16 10H74L70 50Q45 58 20 50Z" style="fill:var(--blue-soft);fill-opacity:.7;stroke:var(--blue);stroke-width:1.6"/>`,
 11:`<path d="M18 52V20Q18 4 45 4T72 20V52Q45 60 18 52Z" style="fill:var(--fg);opacity:.9"/><rect x="34" y="20" width="22" height="10" rx="2" style="fill:var(--live)"/>`
};
const PROTEN={1:'Goggles, flexible fitting, regular ventilation',2:'Goggles, flexible fitting, hooded ventilation',3:'Goggles, cushioned fitting, rigid body',4:'Spectacles, metal frame, with side shields*',5:'Spectacles, plastic frame, with side shields*',6:'Spectacles, metal-plastic frame, with flatfold side shields*',7:'Welding Goggles, eyecup type, tinted lenses**','7A':'Chipping Goggles, eyecup type, clear safety lenses (not illustrated)',8:'Welding Goggles, coverspec type, tinted lens**','8A':'Chipping Goggles, coverspec type, clear safety lenses (not illustrated)',9:'Welding Goggles, coverspec type, tinted plate lens**',10:'Face Shield (available with plastic or mesh window, tinted/transparent)',11:'Welding Helmets**'};
const PROTAR={1:'نظارة محكمة مرنة، تهوية عادية',2:'نظارة محكمة مرنة، تهوية مغطاة',3:'نظارة محكمة مبطنة بجسم صلب',4:'نظارة بإطار معدني وواقيات جانبية',5:'نظارة بإطار بلاستيكي وواقيات جانبية',6:'نظارة بإطار معدني بلاستيكي وواقيات جانبية مسطحة',7:'نظارة لحام بكوبين وعدسات داكنة','7A':'نظارة جلخ بكوبين وعدسات شفافة (غير مرسومة)',8:'نظارة لحام تُلبس فوق النظارة، عدسة داكنة','8A':'نظارة جلخ تُلبس فوق النظارة، عدسة شفافة (غير مرسومة)',9:'نظارة لحام تُلبس فوق النظارة، لوح داكن',10:'واقي الوجه',11:'خوذة اللحام'};
const protSVG=(n,w)=>`<svg viewBox="0 0 90 60" width="${w||90}" height="${(w||90)*60/90}" aria-hidden="true">${PROT[n]||`<rect x="6" y="10" width="78" height="40" rx="8" style="fill:none;stroke:var(--line);stroke-dasharray:4 3"/>`+lt(45,35,'n/a',{m:1})}</svg>`;
function fig35(){return `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:8px;direction:ltr">${[1,2,3,4,5,6,7,8,9,10,11].map(n=>`<div style="text-align:center;background:var(--surface-2);border-radius:10px;padding:6px 2px"><b class="ltr">${n}</b><div>${protSVG(n,88)}</div></div>`).join('')}</div>
 <div class="ltr" style="display:block;font-size:12.5px;line-height:1.6;margin-top:10px;text-align:left"><b>Figure 1. Recommended Eye and Face Protectors</b><br>Eye and face protectors are identified below by number and type. Refer to <i>Table 1</i> for recommended usage applications.<br>${Object.keys(PROTEN).map(k=>`${k}. ${PROTEN[k]}`).join('<br>')}</div>`}
const EYEJOBS=[
 {k:'gas',job:'أعمال القطع واللحام بالأسيتيلين',hz:'شرر، أشعة ضارة، أجزاء صلبة متطايرة، معدن منصهر',row:'رقم 7، 8، 9',sets:[['7'],['8'],['9']]},
 {k:'chem',job:'مناولة المواد الكيميائية',hz:'تطاير مواد كيميائية، أبخرة ضارة، مواد حارقة',row:'رقم 2، 10 (ويمكن استعمال 10 مع 2 في حالات التعرض الخطرة)',sets:[['2'],['10'],['2','10']]},
 {k:'arc',job:'أعمال اللحام الكهربائي',hz:'شرر، أشعة شديدة الخطورة، معدن منصهر',row:'9، 11',sets:[['9'],['11']]},
 {k:'furn',job:'أعمال الأفران',hz:'ضوء مبهر، حرارة عالية، معدن منصهر',row:'7، 8، 9 ويمكن إضافة 10 في حالات التعرض شديدة الخطورة',sets:[['7'],['8'],['9'],['7','10'],['8','10'],['9','10']]},
 {k:'grind',job:'أعمال الجلخ',hz:'مواد صلبة متطايرة',row:'1، 3، 4، 5، 6، 7A، 8A، 10',sets:[['1'],['3'],['4'],['5'],['6'],['7A'],['8A'],['10']]},
 {k:'lab',job:'أعمال المعامل',hz:'تطاير مواد كيميائية، تطاير زجاج مكسور',row:'2 (10 مع 4، 5، 6)',sets:[['2'],['4','10'],['5','10'],['6','10']]}
];
const eyeTable=()=>`<div class="tablebox"><table class="tt"><thead><tr><th>الأعمال</th><th>المخاطر</th><th>الوسيلة المقترحة للحماية (أرقام الشكل <span class="ltr">(3-5)</span>)</th></tr></thead><tbody>${EYEJOBS.map(j=>`<tr><td>${j.job}</td><td>${j.hz}</td><td>${j.row.replace(/(\d+A?)/g,'<span class="ltr">$1</span>')}</td></tr>`).join('')}</tbody></table></div>`;
const HCLS={A:{n:'الدرجة أ',en:'Class A (or G)',use:'الأعمال الخفيفة',imp:'محدودة',el:2200,elT:'محدودة (2200 فولت لمدة دقيقة واحدة فقط)',fill:SC.yellow},
 B:{n:'الدرجة ب',en:'Class B (or E)',use:'الأعمال الشاقة',imp:'كبيرة',el:20000,elT:'كبيرة (20000 فولت لمدة 3 دقائق)',fill:'var(--surface)'},
 C:{n:'الدرجة ج',en:'Class C',use:'— تصنع من الألمنيوم',imp:'جيدة',el:0,elT:'لا توفر أية حماية',fill:'var(--wire)'}};
const helmetTable=()=>`<div class="tablebox"><table class="tt"><thead><tr><th>الدرجة</th><th>الاستخدام</th><th>الحماية من الصدمات</th><th>الحماية الكهربائية</th></tr></thead><tbody>${Object.values(HCLS).map(c=>`<tr><td>${c.n}<br><span class="ltr">${c.en}</span></td><td>${c.use}</td><td>${c.imp}</td><td>${c.elT.replace(/(\d+)/g,'<span class="ltr">$1</span>')}</td></tr>`).join('')}</tbody></table></div>`;

function helmetLab(host){
  const w={V:0,work:'light',type:2,pick:'',tried:{}};
  host.innerHTML=`<div class="panel c12"><h2>اختر الخوذة حسب الجهد ونوع العمل <small>مبني على درجات الخوذات ص 29 والشكل <span class="ltr">(3-3)</span></small></h2>
   <p class="sub">حرّك الجهد الموجود قرب مكان العمل، واختر نوع العمل، ثم اختر درجة الخوذة. الأرقام من الكتاب: الدرجة أ تتحمل <span class="ltr">2200 V</span> لمدة دقيقة واحدة فقط، والدرجة ب <span class="ltr">20000 V</span> لمدة 3 دقائق، والدرجة ج لا تحمي من الكهرباء.</p>
   <div class="wrap-in" style="align-items:flex-end">
    <label class="sub" style="display:flex;flex-direction:column;gap:2px;min-width:220px;flex:1">الجهد قرب مكان العمل: <b id="hV" class="ltr" style="color:var(--fg)"></b><input type="range" id="hVr" min="0" max="30000" step="100" value="0" style="accent-color:var(--blue);width:100%"></label>
    <div><div class="sub">نوع العمل</div>${segHTML('wk',[['light','خفيف'],['heavy','شاق']],'light')}</div>
    <div><div class="sub">نوع الخوذة (الشكل <span class="ltr">3-3</span>)</div>${segHTML('ty',[['1','Type 1 بحافة كاملة'],['2','Type 2 برفرف أمامي']],'2',1)}</div>
   </div>
   <div class="wrap-in"><div><div class="sub">اختر درجة الخوذة</div>${segHTML('hc',[['A','الدرجة أ (A/G)'],['B','الدرجة ب (B/E)'],['C','الدرجة ج (C)']],'',1)}</div></div>
   <div class="grid" style="margin-top:0"><div class="c6"><div class="svgbox" id="hSvg" style="max-width:380px;margin-inline:auto"></div></div><div class="c6"><div class="tablebox" id="hTb"></div><div class="callout" id="hSay"></div></div></div></div>
   <div class="panel c12"><h2>مهام</h2><ol class="steps" id="hSt"></ol></div>`;
  const $=s=>host.querySelector(s);
  const ev=k=>{const c=HCLS[k];const el=w.V===0?true:w.V<=c.el;const wk=k==='A'?w.work==='light':true;return {el,wk,ok:el&&wk}};
  const st=stepsUI($('#hSt'),[
   {t:'جهد منخفض وعمل خفيف',x:'اجعل الجهد بين 500 و 2200 فولت، والعمل «خفيف»، ثم اختر الدرجة أ.',done:w=>w.V>=500&&w.V<=2200&&w.work==='light'&&w.pick==='A'},
   {t:'ارفع الجهد فوق 2200 فولت',x:'لاحظ أن الدرجة أ لم تعد تحمي. اختر الدرجة التي تحمي الآن.',done:w=>w.V>2200&&w.V<=20000&&w.pick==='B'},
   {t:'جرّب خوذة الألمنيوم',x:'اختر الدرجة ج مع أي جهد أكبر من صفر، وانظر ماذا يحدث للتيار.',done:w=>w.V>0&&w.pick==='C'},
   {t:'عمل شاق بلا كهرباء',x:'اجعل الجهد صفراً والعمل «شاق»، ثم اختر الدرجة أ. لماذا لا تناسب؟',done:w=>w.V===0&&w.work==='heavy'&&w.pick==='A'},
   {t:'جهد أعلى من 20000 فولت',x:'ارفع الجهد فوق 20000 فولت وجرّب الدرجات الثلاث.',done:w=>w.V>20000&&w.tried.over>=2}
  ],()=>w);
  function draw(){
    $('#hV').textContent=w.V+' V';
    let s=`<rect x="0" y="0" width="360" height="300" rx="12" style="fill:var(--surface-2)"/>`;
    // overhead conductor
    if(w.V>0)s+=`<path d="M10 30H350" ${S('','var(--stop)',4)}/>`+lt(330,22,w.V+' V',{fs:12,a:'end',fill:'var(--stop)'});
    // head + shoulders
    s+=`<path d="M70 300Q74 236 130 226H230Q286 236 290 300Z" ${S('var(--blue-soft)')}/><rect x="166" y="196" width="28" height="34" ${S('var(--surface-2)')}/><ellipse cx="180" cy="170" rx="44" ry="50" ${S('var(--surface-2)','var(--fg)',1.6)}/><circle cx="196" cy="166" r="3.5" style="fill:var(--fg)"/><path d="M214 176L222 186L212 188" ${S()}/>`;
    if(w.pick){const c=HCLS[w.pick],e=ev(w.pick);
      s+=`<g transform="translate(180 146)">${helmetG(0,0,1.15,w.type,c.fill)}</g>`+lt(180,120,w.pick,{fs:18,fill:'var(--fg)'});
      if(w.V>0){const col=e.el?'var(--on)':'var(--stop)';
        s+=e.el?`<path d="M150 34L170 60L158 62L178 76" ${S('','var(--live)',3.5)}/><path d="M138 84L218 84" ${S('','var(--on)',3)}/>`:`<path d="M150 34L170 60L158 62L186 110L176 112L196 150" ${S('','var(--stop)',3.5)}/>`;
        s+=ar(80,60,e.el?'الخوذة عزلت الجهد':'التيار يصل إلى الرأس',{fs:13,fill:col,w:700})}
      if(w.work==='heavy'){s+=`<g transform="translate(250 40) rotate(25)"><rect x="-8" y="-6" width="16" height="40" rx="3" ${S('var(--live)')}/><rect x="-20" y="-16" width="40" height="14" rx="3" ${S('var(--wire)')}/></g>`;
        s+=ar(300,110,e.wk?'تتحمل الصدمة':'حماية محدودة',{fs:12,fill:e.wk?'var(--on)':'var(--stop)',w:700})}
    } else s+=ar(180,100,'اختر درجة الخوذة',{fs:14,m:1});
    $('#hSvg').innerHTML=svg(360,300,s,'رأس العامل والخوذة المختارة');
    const mark=b=>b?'<b style="color:var(--on)">✓</b>':'<b style="color:var(--stop)">✗</b>';
    $('#hTb').innerHTML=`<table class="tt"><thead><tr><th>الدرجة</th><th>الكهرباء</th><th>نوع العمل</th></tr></thead><tbody>${['A','B','C'].map(k=>{const e=ev(k);return `<tr${w.pick===k?' style="background:var(--blue-soft);font-weight:700"':''}><td>${HCLS[k].n}</td><td>${w.V===0?'—':mark(e.el)}</td><td>${mark(e.wk)}</td></tr>`}).join('')}</tbody></table>`;
    let say='';
    if(!w.pick)say='اختر درجة لترى هل تحمي العامل في هذه الحالة.';
    else{const c=HCLS[w.pick],e=ev(w.pick);
      say=`<b>${c.n}:</b> `+(w.V===0?'لا يوجد جهد قريب، فلا يهم هنا العزل الكهربائي. ':e.el?`تعزل حتى <span class="ltr">${c.el} V</span>، والجهد هنا <span class="ltr">${w.V} V</span>، فهي مناسبة كهربائياً. `:(w.pick==='C'?'مصنوعة من الألمنيوم و«لا توفر أية حماية ضد التيار الكهربائي» (ص 29). ':`حدّها <span class="ltr">${c.el} V</span> فقط والجهد هنا <span class="ltr">${w.V} V</span>، فلا تحمي. `)) +
       (e.wk?'':'وهي «مصممة للأعمال الخفيفة» وتوفر «حماية محدودة ضد مخاطر الصدمات»، فلا تناسب العمل الشاق. ');
      if(w.V>20000)say+='<br><b>لاحظ:</b> لا توجد في الكتاب درجة خوذة تعزل أكثر من <span class="ltr">20000 V</span>. '+'<span class="sub">'+TIP+'الخوذة لا تكفي وحدها عند الجهود العالية؛ راجع معدات العمل فوق الأجزاء المكهربة في الوحدة الأولى.</span>';}
    $('#hSay').innerHTML=say;st.check()}
  $('#hVr').addEventListener('input',e=>{w.V=+e.target.value;draw()});
  host.addEventListener('click',e=>{const b=e.target.closest('[data-wk],[data-ty],[data-hc]');if(!b)return;
    if(b.dataset.wk){w.work=b.dataset.wk;setSeg(host,'wk',w.work)}
    if(b.dataset.ty){w.type=+b.dataset.ty;setSeg(host,'ty',w.ty=b.dataset.ty)}
    if(b.dataset.hc){w.pick=b.dataset.hc;setSeg(host,'hc',w.pick);if(w.V>20000){w.tried[w.pick]=1;w.tried.over=Object.keys(w.tried).filter(k=>k!=='over').length}}
    draw()});
  draw()}

function eyeLab(host){
  let job=0,sel=new Set(),res=null;const solved=new Set();
  host.innerHTML=`<div class="panel c12"><h2>طابق العمل بواقي العين المناسب <small>مبني على جدول ص 30 والشكل <span class="ltr">(3-5)</span> ص 31</small></h2>
   <p class="sub">اختر العمل، ثم اضغط على الواقي (أو الواقيين معاً عندما يسمح الجدول بذلك) واضغط «تحقّق».</p>
   <div id="eJobs" style="margin-top:8px"></div><div class="callout" id="eJob"></div>
   <div id="eGrid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(98px,1fr));gap:8px;margin-top:10px"></div>
   <div class="wrap-in"><button class="btn primary" id="eChk">تحقّق</button><button class="btn" id="eSol">أظهر المقترح في الجدول</button><button class="btn" id="eClr">مسح الاختيار</button><span class="sub" id="eScore"></span></div>
   <div class="callout" id="eRes" hidden></div></div>`;
  const $=s=>host.querySelector(s);
  const keys=['1','2','3','4','5','6','7','7A','8','8A','9','10','11'];
  function draw(){
    $('#eJobs').innerHTML=segHTML('job',EYEJOBS.map((j,i)=>[i,(solved.has(i)?'✓ ':'')+j.job]),job,1);
    const J=EYEJOBS[job];$('#eJob').innerHTML=`<b>العمل:</b> ${J.job}<br><b>المخاطر:</b> ${J.hz}`;
    $('#eGrid').innerHTML=keys.map(k=>`<button class="btn" data-pr="${k}" aria-pressed="${sel.has(k)}" style="display:flex;flex-direction:column;align-items:center;gap:2px;padding:6px 4px;${sel.has(k)?'background:var(--blue-soft);border-color:var(--blue)':''}"><b class="ltr">${k}</b>${protSVG(k,72)}<small style="font-weight:500;font-size:11px;line-height:1.35">${PROTAR[k]}</small></button>`).join('');
    $('#eScore').textContent=`حللت ${solved.size} من ${EYEJOBS.length} أعمال`;
    const r=$('#eRes');if(!res){r.hidden=true}else{r.hidden=false;r.className='callout'+(res.ok?'':' err');r.innerHTML=res.msg}}
  host.addEventListener('click',e=>{const b=e.target.closest('[data-job]');if(b){job=+b.dataset.job;sel.clear();res=null;draw();return}
    const p=e.target.closest('[data-pr]');if(p){const k=p.dataset.pr;sel.has(k)?sel.delete(k):sel.add(k);if(sel.size>2){const f=[...sel][0];sel.delete(f)}res=null;draw()}});
  $('#eChk').addEventListener('click',()=>{const J=EYEJOBS[job];if(!sel.size){res={ok:false,msg:'اختر واقياً واحداً على الأقل.'};draw();return}
    const pick=[...sel].sort(),ok=J.sets.some(s=>s.length===pick.length&&s.slice().sort().every((x,i)=>x===pick[i]));
    if(ok)solved.add(job);
    const bad=pick.filter(k=>!J.sets.some(s=>s.includes(k)));
    res={ok,msg:ok?`<b style="color:var(--on)">صحيح.</b> الجدول يقترح لهذا العمل: ${J.row}.`:(bad.length?`<b>غير مناسب:</b> الواقي ${bad.map(L_).join('، ')} لا يقترحه الجدول لهذا العمل. `+(bad.some(k=>['7','8','9','11'].includes(k))?'العدسات الداكنة للحام تحجب الرؤية في الأعمال العادية. ':bad.some(k=>['4','5','6','1','3','7A','8A'].includes(k))&&/لحام|أفران/.test(J.job)?'العدسات الشفافة لا تحمي من الأشعة والضوء المبهر. ':''):'<b>ليس بهذه الطريقة:</b> كل واقٍ اخترته مذكور، لكن الجدول لا يجمعها هكذا. ')+'راجع الصف في الجدول ثم حاول مرة أخرى.'};draw()});
  $('#eSol').addEventListener('click',()=>{const J=EYEJOBS[job];res={ok:true,msg:`<b>المقترح في جدول ص 30:</b> ${J.row}.`};draw()});
  $('#eClr').addEventListener('click',()=>{sel.clear();res=null;draw()});
  draw()}

B.lesson({
 id:'u3-l1',unit:3,order:1,pages:'25–31',
 title:'الإرشادات العامة ووقاية الرأس والعين والوجه',
 summary:'الغرض من مهمات الوقاية الشخصية وإرشاداتها العامة، والخوذة وأنواعها ودرجاتها، ووسائل وقاية العين والوجه وكيف نختار المناسب لكل عمل.',
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
})())/*DCML-END*/,
  (window.U3S=window.U3S||(function(){
/* أدوات رسم صغيرة لمحطات الوحدة الثالثة (السلامة الصناعية): إطار الرسمة 360×320 بألوان ثابتة فاتحة،
   وتضمين رسومات الدرس نفسه (أيقونات المهمات، العامل، اللافتات…) داخل الإطار مع ثبات ألوانها في الوضع الداكن. */
const D='#2C4A40',P='#FBF6EE';
const PAL='--fg:#2C4A40;--surface:#FBF6EE;--surface-2:#E9E4D6;--muted:#5f665c;--line:#cfc6b4;--blue:#12855A;--blue-ink:#0d6b47;--blue-soft:#cfeee0;--live:#d9801a;--live-soft:#fbe0bd;--on:#1d9460;--on-soft:#d7f0e3;--stop:#c8372d;--stop-soft:#f8dcd9;--wire:#a6b5be;--ink-dim:#c3ced5';
const art=(lbl,bg,body)=>`<svg viewBox="0 0 360 320" role="img" aria-label="${lbl}" style="font-family:var(--font);${PAL}" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="${bg}"/>${body}</svg>`;
/* يضع رسمة SVG جاهزة (من دوال الدرس) داخل مستطيل؛ o.vb لقص جزء منها، o.extra عناصر تُضاف بإحداثيات الرسمة الأصلية */
const nest=(s,x,y,w,h,o)=>{o=o||{};return String(s).replace(/^\s*<svg\b[^>]*>/,m=>{const vb=o.vb||(m.match(/viewBox="([^"]*)"/)||[])[1]||'0 0 100 100';return `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${vb}"${o.clip?'':' overflow="visible"'}>`}).replace(/<\/svg>\s*$/,(o.extra||'')+'</svg>')};
const hot=(x,y,w,h,tip,r)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r==null?8:r}" fill="transparent" data-tip="${tip}"/>`;
const tx=(x,y,t,o)=>{o=o||{};const a=/[؀-ۿ]/.test(t);return `<text x="${x}" y="${y}" text-anchor="${o.a||'middle'}" font-size="${o.fs||13}" fill="${o.fill||D}"${o.w?` font-weight="${o.w}"`:''} direction="${a?'rtl':'ltr'}"${o.mono?' font-family="var(--mono)"':''}>${t}</text>`};
const card=(x,y,w,h,o)=>{o=o||{};return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.r||12}" fill="${o.fill||P}" stroke="${o.st||D}" stroke-width="${o.sw||2.5}"/>`};
return {art,nest,hot,tx,card,D,P,C:{mint:'#DDEFE6',peach:'#F7DCC8',sand:'#FBE6C4',lilac:'#E6E2F8',teal:'#4FB3A9',yellow:'#F2C14E',coral:'#E8735A'}};
})()),{intro:true}),

  {st:1,short:'أهداف الوحدة',title:'الوحدة الثالثة: مهمات السلامة للوقاية الشخصية — الأهداف',ref:'ص 25–26',
   q:'من الرأس إلى القدم… كم قطعة وقاية يحتاجها عامل واحد، ومن يقرر أيها يلبس؟',
   art:(()=>{const {art,nest,hot,tx,C}=U3S;const w=workerSVG(new Set(['helmet','glasses','plugs','dust','gloves','boot']),{lbl:'عامل يرتدي مهمات الوقاية'});
    const ex=hot(76,116,88,108,'حماية الجسم: الأوفرهولات والمرايل والبدل الواقية (ص 44).')+hot(72,280,96,84,'وقاية القدم: أحذية السلامة (ص 36).')+hot(40,226,28,40,'وقاية اليد: القفازات الواقية (ص 43).')+hot(172,226,28,40,'وقاية اليد: القفازات الواقية (ص 43).')
     +hot(100,76,40,26,'وقاية الجهاز التنفسي: الكمامات وأجهزة التنفس (ص 37–42).')+hot(78,60,18,20,'وقاية الأذن: سدادات الأذن وأغطيتها (ص 31–32).')+hot(144,60,18,20,'وقاية الأذن: سدادات الأذن وأغطيتها (ص 31–32).')
     +hot(94,54,52,18,'وقاية العين والوجه: النظارات الواقية وحامي الوجه (ص 29–31).')+hot(82,14,76,40,'وقاية الرأس: الخوذة الصلبة (ص 27–29).');
    return art('عامل يرتدي الخوذة والنظارة وسدادات الأذن والكمامة والقفازات وحذاء السلامة',C.mint,nest(w,104,22,152,234,{extra:ex})+tx(180,282,'مهمات الوقاية الشخصية',{fs:15,w:700})+tx(180,302,'Personal Protective Equipment (PPE)',{fs:11.5,mono:1}))})(),
   cap:'كل جزء من الجسم له مهمة وقاية تخصه، وكلها في هذه الوحدة.<br><b>مرّر المؤشر على أجزاء العامل (أو المسها في الجوال) لتعرف مهمة كل جزء وصفحتها.</b>',
   side:[
    {predict:{q:'أي هذه الأمور يذكره الكتاب ضمن أهداف الوحدة؟',opts:[
     ['أن يصنع المتدرب معدات الوقاية بنفسه',false,'الوحدة عن معرفة المعدات واستخدامها وفحصها، لا عن صناعتها.'],
     ['أن يعرف المتدرب طريقة فحص أجهزة التنفس بأنواعها',true,'هذا الهدف السادس في ص 26.'],
     ['أن يحسب المتدرب ثمن كل معدة',false,'لا يذكر الكتاب ذلك؛ بل يقول في الإرشادات إن المعدات تُوفَّر بلا تكلفة على العاملين (ص 27).']]}}
   ],
   body:[
    {book:`<p><b>الهدف العام للوحدة:</b> الإنجازات الأساسية لمعرفة معدات السلامة الشخصية وطرق استخدامها، وكذلك فحصها والمحافظة عليها.</p>
     <p><b>الأهداف التفصيلية:</b></p><ol><li>أن يذكر المتدرب الإرشادات العامة لمهمات السلامة الشخصية.</li><li>أن يقوم المتدرب بحصر معدات الوقاية الشخصية.</li><li>أن يصنف المتدرب كل معدة من معدات الوقاية الشخصية.</li><li>أن يلم المتدرب بوظائف كل معدة من معدات الوقاية الشخصية.</li><li>أن يختار المتدرب المعدة المناسبة للوقاية لكل عمل مطلوب.</li><li>أن يعرف المتدرب طريقة فحص أجهزة التنفس بأنواعها.</li><li>أن يلم المتدرب بأنواع اللوحات الإرشادية ويصنفها.</li></ol>`,ref:'ص 26'},
    {tip:`<p>الوحدة تسير من الرأس إلى القدم: الرأس، ثم العين والوجه، ثم الأذن، ثم القدم، ثم الجهاز التنفسي، ثم الحزام الواقي واليد والجسم، ثم رموز المهمات ولافتات التحذير وألوانها. في كل محطة اسأل نفسك: <b>ما الخطر؟</b> و<b>ما المعدة التي تقي منه؟</b></p>`,title:'كيف تذاكر هذه الوحدة؟'},
    {title:'مختبر مصغّر: صنّف المعدة',widget:(el,B)=>DCML.sort(el,B,{intro:'«أن يصنف المتدرب كل معدة» من أهداف الوحدة. لكل معدة اضغط الجزء الذي تقيه.',cats:['الرأس','العين والوجه','الأذن','القدم'],items:[
 ['الخوذة الصلبة المعالجة بالبلاستيك',0,'تستخدم لحماية الرأس ومقاومة الصدمات الثقيلة (ص 27).'],
 ['حامي الوجه <span class="ltr">Face Shield</span>',1,'من وسائل وقاية العين والوجه (ص 29).'],
 ['سدادات الأذن <span class="ltr">Ear Plugs</span>',2,'توضع داخل قناة الأذن لتقليل الضوضاء (ص 32).'],
 ['حذاء جلدي مقدمته مغطاة بالصلب',3,'يحمي الأصابع من خطر الأشياء الساقطة (ص 36).'],
 ['النظارات الواقية <span class="ltr">Safety Goggles</span>',1,'من وسائل وقاية العين والوجه من المخاطر الكيميائية والميكانيكية (ص 29).'],
 ['أغطية الأذن <span class="ltr">Ear Muffs</span>',2,'تغطي الأذن الخارجية وتكون حاجزاً للصوت (ص 32).']]})}
   ]},

  {st:2,short:'الغرض',title:'مهمات السلامة للوقاية الشخصية — الغرض',ref:'ص 27',
   q:'لماذا لا يكفي أن «يلبس العامل أي خوذة»؟',
   art:(()=>{const {art,nest,hot,tx,card,C}=U3S;let s='';
    const T=[[188,46,'helmet','أهميتها','لسلامة العاملين','«ومدى أهميتها في المحافظة على سلامة العاملين».'],[40,46,'glasses','وصف كامل','للمعدات','«تقديم وصف كامل لمعدات الوقاية الشخصية».'],[188,170,'gloves','الاستعمال','والمحافظة','«والطريقة الصحيحة لاستعمالها والمحافظة عليها».'],[40,170,'shield','الاختيار','حسب الخطر','«وكيفية اختيار الجهاز أو المعدة المناسبة لتناسب نوع المخاطر التي يتعرض لها الشخص».']];
    T.forEach(([x,y,ic,a,b,tip])=>{s+=`<g data-tip="${tip}">${card(x,y,132,110)}${nest(icon(ic,60),x+40,y+8,52,52)}${tx(x+66,y+80,a,{fs:14,w:700})}${tx(x+66,y+99,b,{fs:12})}</g>`});
    return art('أربع بطاقات: وصف المعدات، وأهميتها، وطريقة استعمالها والمحافظة عليها، واختيارها حسب الخطر',C.peach,s+tx(180,306,'غرض الوحدة في أربع كلمات',{fs:13,w:600}))})(),
   cap:'غرض الوحدة كما في ص 27، مقسّماً على أربع بطاقات.<br><b>مرّر المؤشر على أي بطاقة (أو المسها في الجوال) لتقرأ الجزء الذي يخصها من نص الكتاب.</b>',
   side:[
    {predict:{q:'عامل في ورشة لحام أُعطي نظارة شفافة عادية. أي جزء من «الغرض» لم يتحقق؟',opts:[
     ['الوصف الكامل للمعدة',false,'النظارة معروفة الوصف؛ المشكلة أنها لا تناسب خطر اللحام.'],
     ['المحافظة على المعدة',false,'لا علاقة لحفظ النظارة بأنها غير مناسبة للعمل.'],
     ['اختيار المعدة المناسبة لنوع المخاطر',true,'الغرض يشمل «كيفية اختيار الجهاز أو المعدة المناسبة لتناسب نوع المخاطر»، وستعرف في المحطة الثامنة أن اللحام يحتاج واقياً بعدسة داكنة.']]}}
   ],
   body:[
    {book:`<p><b>3-1 الغرض:</b> تقديم وصف كامل لمعدات الوقاية الشخصية ومدى أهميتها في المحافظة على سلامة العاملين والطريقة الصحيحة لاستعمالها والمحافظة عليها وكيفية اختيار الجهاز أو المعدة المناسبة لتناسب نوع المخاطر التي يتعرض لها الشخص.</p>`,ref:'ص 27'},
    {tip:`<p>معدات الوقاية الشخصية <span class="ltr">(PPE)</span> هي ما يلبسه العامل على جسمه ليقف بينه وبين الخطر. لكنها لا تحمي إلا إذا كانت <b>مناسبة للخطر</b>، و<b>ملبوسة بطريقة صحيحة</b>، و<b>سليمة</b>.</p>`,title:'الفكرة في سطرين'},
    {title:'مختبر مصغّر: أين الخلل؟',widget:(el,B)=>DCML.cases(el,B,{intro:'لكل موقف اختر الجزء من «الغرض» الذي لم يتحقق.',cases:[
 {q:'فني يلبس الخوذة مقلوبة الاتجاه لأنه لا يعرف كيف تُضبط بطانتها.',opts:[
  ['الطريقة الصحيحة للاستعمال',true,'الغرض يشمل «الطريقة الصحيحة لاستعمالها».'],
  ['اختيار المعدة حسب الخطر',false,'الخوذة مناسبة لخطر الرأس؛ الخلل في طريقة لبسها.']]},
 {q:'قفازات تُرمى بعد العمل على الأرض المتسخة حتى اليوم التالي.',opts:[
  ['الوصف الكامل للمعدة',false,'المعدة معروفة؛ الخلل في حفظها.'],
  ['المحافظة على المعدة',true,'الغرض يشمل «المحافظة عليها»، وفي الإرشادات العامة: تُحفظ في أكياس من البلاستيك في حالة نظيفة (ص 27).']]}]})}
   ]},

  {st:3,short:'إرشادات عامة',title:'إرشادات عامة لمعدات الوقاية الشخصية',ref:'ص 27',
   q:'من يدفع ثمن معدات الوقاية؟ ومتى يجب أن يزور العامل الطبيب؟',
   art:(()=>{const {art,nest,tx,card,D,C}=U3S;let s='';
    const sym={
     hz:`<path d="M0 -15L15 12H-15Z" fill="${C.yellow}" stroke="${D}" stroke-width="2.4" stroke-linejoin="round"/><path d="M0 -6V3" stroke="${D}" stroke-width="2.6" stroke-linecap="round"/><circle cx="0" cy="8" r="1.8" fill="${D}"/>`,
     ansi:`<circle cx="0" cy="0" r="15" fill="${C.teal}" stroke="${D}" stroke-width="2.4"/><path d="M-7 0l5 5l9 -10" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`,
     fit:`<path d="M-15 8Q-15 -14 0 -14T15 8Z" fill="${C.coral}" stroke="${D}" stroke-width="2.2"/><path d="M-19 8H19" stroke="${D}" stroke-width="3.2" stroke-linecap="round"/>`,
     med:`<rect x="-14" y="-14" width="28" height="28" rx="6" fill="#fff" stroke="${D}" stroke-width="2.2"/><path d="M0 -8V8M-8 0H8" stroke="${C.coral}" stroke-width="4.5" stroke-linecap="round"/>`,
     tr:`<rect x="-16" y="-13" width="32" height="20" rx="3" fill="${C.teal}" stroke="${D}" stroke-width="2.2"/><path d="M-6 7L-10 15M6 7L10 15" stroke="${D}" stroke-width="2.2"/><path d="M-9 -5H6M-9 0H2" stroke="#fff" stroke-width="2"/>`,
     bag:`<path d="M-13 -8H13L15 15H-15Z" fill="#fff" fill-opacity=".6" stroke="${D}" stroke-width="2.2" stroke-linejoin="round"/><path d="M-6 -8Q0 -18 6 -8" fill="none" stroke="${D}" stroke-width="2.2"/>`};
    const T=[[188,34,'hz','حدّد الخطر أولاً','يجب تحديد نوع المخاطر في أماكن العمل أولاً، ثم يتم بعد ذلك تحديد معدات الوقاية المطلوب استعمالها، وتُوفَّر بدون تحميل أية تكلفة مادية للعاملين.'],[40,34,'ansi','معتمدة','معدات معتمدة من السلطات المحلية ومتوافقة مع ⟦ANSI⟧ (المعهد الأمريكي الوطني للمواصفات القياسية).'],
     [188,118,'fit','تلائم الشخص','تُلبس بطريقة تلائم الشخص المستعمل لها ⟦Properly Fitting⟧.'],[40,118,'med','فحص طبي سنوي','فحص طبي للعاملين الذين تستدعي طبيعة عملهم استخدام أجهزة التنفس، ويتكرر سنوياً.'],
     [188,202,'tr','التدريب','تدريب جميع العاملين على الطريقة الصحيحة لاستعمال المعدات بواسطة المسئولين المباشرين لهم.'],[40,202,'bag','الحفظ نظيفة','في حالة عدم الاستخدام توضع في أكياس من البلاستيك وتُحفظ في حالة نظيفة.']];
    T.forEach(([x,y,k,l,tip])=>{s+=`<g data-tip="${tip}">${card(x,y,132,72)}<g transform="translate(${x+66} ${y+24})">${sym[k]}</g>${tx(x+66,y+60,l,{fs:13,w:700})}</g>`});
    return art('ست بطاقات للإرشادات العامة: تحديد الخطر، الاعتماد، الملاءمة، الفحص الطبي، التدريب، الحفظ',C.sand,s+tx(180,300,'ست قواعد قبل أن تلبس أي معدة',{fs:13,w:600}))})(),
   cap:'الإرشادات العامة الست في ص 27.<br><b>مرّر المؤشر على أي بطاقة (أو المسها في الجوال) لتقرأ القاعدة كاملة.</b>',
   side:[
    {predict:{q:'عامل يستعمل جهاز تنفس في عمله، وأجرى فحصاً طبياً عند تعيينه قبل سنتين. ماذا يقول الكتاب؟',opts:[
     ['يكفيه ذلك الفحص ما دام سليماً',false,'الكتاب لا يكتفي بفحص واحد.'],
     ['يجب أن يتكرر الفحص سنوياً',true,'«يجب إجراء فحص طبي للعاملين الذين تستدعي طبيعة عملهم استخدام أجهزة التنفس، ويتم تكرار هذا الفحص سنوياً» (ص 27).'],
     ['يُفحص فقط إذا شعر بتعب',false,'الفحص دوري سنوي، لا عند الشكوى فقط.']]}}
   ],
   body:[
    {book:`<p><b>إرشادات عامة:</b></p><ul>
     <li>يجب تحديد نوع المخاطر في أماكن العمل أولاً ثم يتم بعد ذلك تحديد معدات الوقاية المطلوب استعمالها. ويتم توفير هذه المعدات بدون تحميل أية تكلفة مادية للعاملين.</li>
     <li>يجب استخدام معدات الوقاية الشخصية المعتمدة من السلطات المحلية وتكون متوافقة مع <span class="ltr">American National Standards Institute (ANSI)</span>.</li>
     <li>يجب ارتداء معدات السلامة للوقاية الشخصية بطريقة تلائم الشخص المستعمل لها <span class="ltr">Properly Fitting</span>.</li>
     <li>يجب إجراء فحص طبي للعاملين الذين تستدعي طبيعة عملهم استخدام أجهزة التنفس، ويتم تكرار هذا الفحص سنوياً.</li>
     <li>يجب تدريب جميع العاملين الذين يطلب منهم استعمال معدات الوقاية الشخصية على الطريقة الصحيحة لاستعمال هذه المعدات وذلك بواسطة المسئولين المباشرين لهم.</li>
     <li>في حالة عدم استخدام معدات الوقاية الشخصية يتم وضعها في أكياس من البلاستيك وحفظها في حالة نظيفة.</li></ul>`,ref:'ص 27'},
    {watch:`<p>في ص 27 كُتب اسم <span class="ltr">ANSI</span> «<span class="ltr">American National Safety Institute</span>»، والصواب <span class="ltr">Standards</span> (كما كُتب صحيحاً في ص 49)، فكتبناه مصححاً.</p>`,fix:true},
    {add:`<p>«تلائم الشخص» معناها عملياً: الخوذة مضبوطة البطانة على رأسه، والقفاز بمقاس يده، والكمامة محكمة على وجهه. المعدة الواسعة أو الضيقة قد تسقط أو تترك فراغاً يدخل منه الخطر، فلا تؤدي عملها.</p>`,title:'مثال من الواقع'},
    {title:'تحقق سريع: الإرشادات العامة',widget:(el,B)=>DCML.tf(el,B,{intro:'احكم على كل عبارة بحسب نص الكتاب (ص 27).',items:[
 ['نشتري معدات الوقاية أولاً، ثم نبحث عن المخاطر في مكان العمل.',false,'العكس: «يجب تحديد نوع المخاطر في أماكن العمل أولاً ثم يتم بعد ذلك تحديد معدات الوقاية».'],
 ['يُخصم ثمن معدات الوقاية من راتب العامل.',false,'«ويتم توفير هذه المعدات بدون تحميل أية تكلفة مادية للعاملين».'],
 ['تدريب العاملين على استعمال المعدات يكون بواسطة المسئولين المباشرين لهم.',true,'هذا نص الإرشاد الخامس.'],
 ['المعدات غير المستعملة تُحفظ نظيفة في أكياس من البلاستيك.',true,'هذا نص الإرشاد الأخير.']]})}
   ]},

  {st:4,short:'وقاية الرأس',title:'3-3-1 وقاية الرأس (<span class="ltr">Head Protection</span>)',ref:'ص 27–28',
   q:'الخوذة قشرة صلبة… فلماذا لا تلتصق برأسك مباشرة؟',
   art:(()=>{const {art,tx,D,P,C}=U3S;let s='';
    s+=`<g data-tip="جسم الخوذة: «الخوذة الصلبة المعالجة بالبلاستيك» تحمي الرأس وتقاوم الصدمات الثقيلة دون أن تتكسر، وتقاوم الاختراق بواسطة الأجسام الساقطة."><path d="M62 212Q60 76 180 68Q300 76 298 206L340 212Q348 220 334 224L298 222Q240 216 62 212Z" fill="${C.yellow}" stroke="${D}" stroke-width="3.5" stroke-linejoin="round"/><path d="M76 210Q76 90 180 82Q284 90 284 206Z" fill="#FFF6E2"/></g>`;
    s+=`<path d="M112 250Q114 158 180 152Q246 158 248 250" fill="#F3D9C4" fill-opacity=".7" stroke="${D}" stroke-width="2" stroke-dasharray="5 4"/>`;
    s+=`<g data-tip="الرباط والبطانة البلاستيكية داخل الخوذة ⟦Harness⟧: تُضبط لتناسب حجم الرأس، وفائدتها أنها تمتص صدمة الأجسام الساقطة على الخوذة من الخارج."><path d="M92 204Q96 124 180 116Q264 124 268 200" fill="none" stroke="${C.teal}" stroke-width="7" stroke-linecap="round"/><path d="M128 206Q144 140 180 116Q216 140 232 204" fill="none" stroke="${C.teal}" stroke-width="5" stroke-linecap="round"/></g>`;
    s+=`<g data-tip="حزام الرأس ⟦Sweatband⟧: الجزء من البطانة الذي يلامس الرأس (من الشكل ⟦3-1⟧)."><path d="M96 206Q180 226 266 204" fill="none" stroke="#1f6f68" stroke-width="9" stroke-linecap="round"/></g>`;
    s+=`<g data-tip="مسافة الأمان ⟦Vertical clearance⟧: فراغ بين البطانة وجسم الخوذة؛ بفضلها لا تنتقل صدمة الجسم الساقط إلى الرأس مباشرة."><rect x="166" y="72" width="28" height="44" fill="transparent"/><path d="M180 78V110" stroke="${C.coral}" stroke-width="3"/><path d="M174 86L180 78L186 86M174 102L180 110L186 102" fill="none" stroke="${C.coral}" stroke-width="3" stroke-linejoin="round"/></g>`;
    s+=`<g data-tip="فتحات التهوية ⟦Ventilation holes⟧ في جسم الخوذة (من الشكل ⟦3-1⟧).">${[[132,84],[228,84]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="5.5" fill="${P}" stroke="${D}" stroke-width="2"/>`).join('')}</g>`;
    s+=`<g data-tip="الرفرف الأمامي ⟦Peak⟧ (من الشكل ⟦3-1⟧)."><rect x="296" y="200" width="50" height="28" fill="transparent"/></g>`;
    return art('مقطع مبسّط في الخوذة: جسم صلب، وبطانة وحزام رأس، وبينهما مسافة أمان',C.lilac,s+tx(180,272,'مقطع مبسّط في الخوذة',{fs:14,w:700})+tx(180,292,'عن الشكل',{fs:12})+`<text x="180" y="308" text-anchor="middle" font-size="12" fill="${D}" font-family="var(--mono)">(3-1)</text>`)})(),
   cap:'رسم مبسّط عن الشكل <span class="ltr">(3-1)</span> ص 28؛ الرأس مرسوم بخط متقطع.<br><b>مرّر المؤشر على أجزاء الخوذة والسهم (أو المسها في الجوال) لتعرف اسم كل جزء ووظيفته.</b>',
   side:[
    {predict:{q:'سقط مفتاح ربط على خوذة عامل. ما الذي يمنع الصدمة من الوصول إلى رأسه مباشرة؟',opts:[
     ['لون الخوذة الأصفر',false,'اللون لا يمتص الصدمة.'],
     ['فتحات التهوية',false,'فتحات التهوية للتهوية، لا لامتصاص الصدمة.'],
     ['البطانة ومسافة الأمان بينها وبين جسم الخوذة',true,'«فائدة هذه البطانة أنها تمتص صدمة الأجسام الساقطة… حيث توجد مسافة أمان بين هذه البطانة وجسم الخوذة» (ص 28).']]}}
   ],
   body:[
    {book:`<p><b>3-3 معدات الوقاية الشخصية <span class="ltr">Personal Protective Equipment (PPE)</span></b></p>
     <p><b>3-3-1 وقاية الرأس <span class="ltr">Head Protection</span>:</b> تستخدم الخوذة الصلبة المعالجة بالبلاستيك لحماية الرأس ومقاومة الصدمات الثقيلة دون أن تتكسر كذلك تقاوم الاختراق بواسطة الأجسام الساقطة. كما أن الخوذة مزودة من الداخل برباط وبطانة بلاستيكية يتم ضبطها لتناسب حجم الرأس وفائدة هذه البطانة أنها تمتص صدمة الأجسام الساقطة على الخوذة من الخارج حيث توجد مسافة أمان بين هذه البطانة وجسم الخوذة (شكل <span class="ltr">3-1</span>).</p>
     <p>قبل استخدام الخوذة يجب التأكد من سلامتها وعدم وجود تشققات أو صدمات بها وأن الأربطة والبطانة غير ممزقة.</p>`,ref:'ص 27–28'},
    {tip:`<p>الخوذة طبقتان: <b>قشرة صلبة</b> تتلقى الضربة وتوزعها، و<b>بطانة</b> معلقة تحتها تمسك الرأس. مسافة الأمان بينهما تعمل مثل «وسادة هواء»: القشرة تنثني قليلاً نحو الداخل دون أن تلمس الرأس.</p>`,title:'لماذا طبقتان؟'},
    {watch:`<p>لا تضع شيئاً (قبعة أو أدوات) بين البطانة وجسم الخوذة؛ فهذا يلغي مسافة الأمان. ولا تستعمل خوذة سقطت أو تلقت ضربة قوية قبل فحصها.</p>`},
    {title:'مختبر مصغّر: افحص الخوذة قبل لبسها',widget:(el,B)=>DCML.cases(el,B,{intro:'قبل الاستخدام «يجب التأكد من سلامتها» (ص 28). ماذا تفعل في كل حالة؟',cases:[
 {q:'وجدت شقاً رفيعاً في جسم الخوذة فوق الجبهة.',opts:[
  ['ألبسها، فالشق صغير',false,'الكتاب يشترط «عدم وجود تشققات» قبل الاستخدام.'],
  ['لا أستعملها وأطلب خوذة سليمة',true,'«قبل استخدام الخوذة يجب التأكد من سلامتها وعدم وجود تشققات أو صدمات بها».']]},
 {q:'جسم الخوذة سليم، لكن أحد أربطة البطانة ممزق.',opts:[
  ['لا أستعملها حتى تُصلح البطانة أو تُستبدل',true,'الشرط أيضاً «أن الأربطة والبطانة غير ممزقة»؛ فالبطانة هي التي تمتص الصدمة.'],
  ['ألبسها، فالمهم أن القشرة سليمة',false,'بلا بطانة سليمة تضيع مسافة الأمان، فتصل الصدمة إلى الرأس.']]}]})}
   ]},

  {st:5,short:'المخاطر على الرأس',title:'أ- المخاطر على الرأس',ref:'ص 28',
   q:'ما الذي قد يصيب رأس عامل في مصنع؟ وهل الكهرباء منها؟',
   art:(()=>{const {art,tx,D,P,C}=U3S;let s='';
    const head=cx=>`<path d="M${cx-34} 232Q${cx-32} 200 ${cx-14} 196H${cx+14}Q${cx+32} 200 ${cx+34} 232Z" fill="${P}" stroke="${D}" stroke-width="2.4"/><circle cx="${cx}" cy="176" r="20" fill="#F3D9C4" stroke="${D}" stroke-width="2.4"/>`;
    s+=`<g data-tip="المعدات المتساقطة: أداة أو جسم يسقط من مكان مرتفع على الرأس (الصورة اليمنى في الشكل ⟦3-2⟧).">${head(270)}<g transform="translate(270 96) rotate(-18)"><rect x="-4" y="-4" width="8" height="34" rx="2" fill="${C.coral}" stroke="${D}" stroke-width="2"/><rect x="-14" y="-14" width="28" height="12" rx="2" fill="#9aa5a0" stroke="${D}" stroke-width="2"/></g><path d="M270 132V148M264 142L270 150L276 142" fill="none" stroke="${D}" stroke-width="2.4"/></g>`;
    s+=`<g data-tip="الاصطدام بأجسام صلبة: الرأس يرتطم بجسم ثابت، مثل أنبوب أو عارضة منخفضة.">${head(180)}<rect x="132" y="140" width="96" height="14" rx="3" fill="#9aa5a0" stroke="${D}" stroke-width="2.4"/><path d="M180 160V154" stroke="${C.coral}" stroke-width="3"/><path d="M168 164L162 158M192 164L198 158" stroke="${C.coral}" stroke-width="2.4" stroke-linecap="round"/></g>`;
    s+=`<g data-tip="المخاطر الكهربائية: للعاملين في مجال الكهرباء (الصورة اليسرى في الشكل ⟦3-2⟧)."><rect x="44" y="70" width="84" height="170" rx="12" fill="${D}"/>${head(86)}<path d="M74 78L64 112L78 114L66 150M100 80L92 108L104 110L94 138" fill="none" stroke="${C.yellow}" stroke-width="3.4" stroke-linejoin="round"/></g>`;
    [[270,'المعدات','المتساقطة'],[180,'الاصطدام','بجسم صلب'],[86,'المخاطر','الكهربائية']].forEach(([x,a,b])=>{s+=tx(x,260,a,{fs:13,w:700})+tx(x,278,b,{fs:13,w:700})});
    return art('ثلاثة مخاطر على الرأس: المعدات المتساقطة، والاصطدام بأجسام صلبة، والمخاطر الكهربائية',C.mint,s)})(),
   cap:'المخاطر الثلاثة التي يذكرها الكتاب، مبسّطة عن الشكل <span class="ltr">(3-2)</span>.<br><b>مرّر المؤشر على كل رسم (أو المسه في الجوال) لتعرف نوع الخطر.</b>',
   side:[
    {predict:{q:'لماذا يهتم عامل الكهرباء بالخوذة أكثر من غيره؟',opts:[
     ['لأن الخوذة المناسبة تحميه أيضاً من المخاطر الكهربائية',true,'الكتاب يذكر «المخاطر الكهربائية بالنسبة للعاملين في مجال الكهرباء» ضمن مخاطر الرأس (ص 28)، وفي المحطة التالية سترى أي درجة خوذة تحمي منها.'],
     ['لأنه لا يتعرض لسقوط الأجسام',false,'قد يتعرض لها مثل غيره؛ لكنه يضيف عليها خطر الكهرباء.'],
     ['لأن الخوذة تعزل الضوضاء',false,'الخوذة لا تقي من الضوضاء؛ للأذن واقياتها الخاصة.']]}}
   ],
   body:[
    {book:`<p><b>أ- المخاطر على الرأس:</b> تنحصر المخاطر التي من الممكن أن يتعرض إليها الرأس في المعدات المتساقطة أو الاصطدام بأجسام صلبة أو المخاطر الكهربائية بالنسبة للعاملين في مجال الكهرباء كما هو موضح في الشكل <span class="ltr">(3-2)</span>.</p>`,ref:'ص 28'},
    {add:`<p>في مواقع البناء والمستودعات: أدوات تسقط من السقالات والرفوف، وأنابيب وعوارض منخفضة في الممرات. وفي المحطات الكهربائية: الاقتراب من الموصلات المكهربة فوق مستوى الرأس.</p>`,title:'أين تقابل هذه المخاطر؟'},
    {title:'مختبر مصغّر: ما نوع الخطر؟',widget:(el,B)=>DCML.sort(el,B,{intro:'صنّف كل موقف إلى أحد مخاطر الرأس الثلاثة.',cats:['معدات متساقطة','اصطدام بجسم صلب','مخاطر كهربائية'],items:[
 ['مطرقة تسقط من يد عامل على سقالة فوقك.',0,'جسم يسقط من أعلى = المعدات المتساقطة.'],
 ['تمر تحت أنبوب منخفض في ممر المصنع ولم تنتبه له.',1,'الرأس هو الذي يتحرك ويرتطم بجسم ثابت = الاصطدام بأجسام صلبة.'],
 ['فني يعمل في لوحة توزيع وفوق رأسه قضبان مكهربة.',2,'هذا خطر «المخاطر الكهربائية بالنسبة للعاملين في مجال الكهرباء».'],
 ['صندوق ينزلق من رف عالٍ في المستودع.',0,'جسم يسقط من مكان مرتفع.']]})}
   ]},

  {st:6,short:'أنواع الخوذات',title:'ب- أنواع الخوذات ودرجاتها',ref:'ص 29',
   q:'خوذتان تبدوان متشابهتين… فكيف تعرف أيهما تحميك من الكهرباء؟',
   art:(()=>{const {art,tx,card,D,C}=U3S;let s='';
    s+=`<g data-tip="النوع 1 ⟦Type 1 – Full Brim⟧: خوذة ذات حافة كاملة حول الرأس."><rect x="190" y="40" width="140" height="110" fill="transparent"/><g transform="translate(262 112)">${helmetG(0,0,0.95,1,C.yellow)}</g></g>`;
    s+=`<g data-tip="النوع 2 ⟦Type 2 – Peak⟧: خوذة ذات رفرف أمامي فقط."><rect x="30" y="40" width="150" height="110" fill="transparent"/><g transform="translate(100 112)">${helmetG(0,0,0.95,2,'#FBF6EE')}</g></g>`;
    s+=tx(262,140,'النوع 1',{fs:13,w:700})+tx(262,156,'Full Brim',{fs:11,mono:1})+tx(100,140,'النوع 2',{fs:13,w:700})+tx(100,156,'Peak',{fs:11,mono:1});
    const K=[[236,'أ','Class A (or G)','الدرجة أ ⟦Class A (or G)⟧: للأعمال الخفيفة؛ حماية محدودة ضد الصدمات، وحماية محدودة للتيار الكهربائي ⟦2200⟧ فولت لمدة دقيقة واحدة فقط.',C.sand],[180,'ب','Class B (or E)','الدرجة ب ⟦Class B (or E)⟧: للأعمال الشاقة؛ حماية كبيرة ضد الصدمات، وحماية كبيرة للتيار الكهربائي ⟦20000⟧ فولت لمدة ⟦3⟧ دقائق.',C.mint],[124,'ج','Class C','الدرجة ج ⟦Class C⟧: تُصنع من الألمنيوم؛ حماية جيدة ضد الصدمات، ولا توفر أية حماية ضد التيار الكهربائي.','#E3E7EA']];
    K.forEach(([cx,a,en,tip,f])=>{s+=`<g data-tip="${tip}">${card(cx-26,182,52,74,{fill:f})}${tx(cx,218,a,{fs:24,w:700})}${tx(cx,244,en.split(' ')[1],{fs:13,mono:1,w:700})}</g>`});
    s+=tx(180,280,'كل نوع ينقسم إلى ثلاث درجات',{fs:13,w:600})+tx(180,298,'Classes',{fs:11,mono:1});
    return art('نوعا الخوذات (حافة كاملة ورفرف أمامي) وبطاقات الدرجات أ وب وج',C.peach,s)})(),
   cap:'النوعان من الشكل <span class="ltr">(3-3)</span>، والبطاقات الثلاث للدرجات.<br><b>مرّر المؤشر على الخوذتين والبطاقات (أو المسها في الجوال) لتعرف كل نوع ودرجة.</b>',
   side:[
    {predict:{q:'خوذة من الألمنيوم قوية جداً ضد الصدمات. هل تناسب فني كهرباء يعمل قرب أجزاء مكهربة؟',opts:[
     ['نعم، لأنها الأقوى ضد الصدمات',false,'قوتها ضد الصدمات لا تعني أنها تعزل الكهرباء.'],
     ['نعم، إذا لبسها لمدة دقيقة واحدة فقط',false,'«دقيقة واحدة» تخص جهد اختبار الدرجة أ، لا خوذة الألمنيوم.'],
     ['لا، فالدرجة ج لا توفر أية حماية ضد التيار الكهربائي',true,'الدرجة ج «تصنع من الألمنيوم… ولكن لا توفر أية حماية ضد التيار الكهربائي» (ص 29).']]}}
   ],
   body:[
    {book:`<p><b>ب- أنواع الخوذات:</b> يوجد نوعان للخوذات النوع 1 <span class="ltr">(Type 1)</span> والنوع 2 <span class="ltr">(Type 2)</span> (شكل <span class="ltr">3-3</span>).</p>
     <p>كل نوع من النوعين أعلاه ينقسم إلى ثلاث درجات <span class="ltr">Classes</span>:</p>
     <ul><li><b>أ- الدرجة أ – <span class="ltr">Class A (or G)</span>:</b> هذا النوع مصمم للأعمال الخفيفة ويوفر حماية محدودة ضد مخاطر الصدمات وحماية محدودة للتيار الكهربائي (<span class="ltr">2200</span> فولت لمدة دقيقة واحدة فقط).</li>
     <li><b>ب- الدرجة ب – <span class="ltr">Class B (or E)</span>:</b> هذا النوع مصمم للأعمال الشاقة ويوفر حماية كبيرة ضد مخاطر الصدمات، كذلك حماية كبيرة للتيار الكهربائي (<span class="ltr">20000</span> فولت لمدة 3 دقائق).</li>
     <li><b>ج- الدرجة ج – <span class="ltr">Class C</span>:</b> هذا النوع يصنع من الألمنيوم ويوفر حماية جيدة ضد الصدمات ولكن لا يوفر أية حماية ضد التيار الكهربائي.</li></ul>`,ref:'ص 29'},
    {html:helmetTable()+'<p class="sub">جدول ملخص من نص الكتاب؛ خانة «الاستخدام» للدرجة ج فارغة في الكتاب.</p>'},
    {tip:`<p><b>النوع</b> يصف شكل الخوذة (حافة كاملة أو رفرف أمامي)، و<b>الدرجة</b> تصف قوة حمايتها. رقم الجهد في الدرجة هو جهد <b>الاختبار</b> الذي تتحمله الخوذة لمدة محددة: الدرجة ب أعلى بكثير من أ، والدرجة ج لا تعزل أبداً لأن الألمنيوم موصل للكهرباء.</p>`,title:'النوع غير الدرجة'},
    {title:'مختبر مصغّر: أي درجة؟',widget:(el,B)=>DCML.sort(el,B,{intro:'اختر درجة الخوذة التي يصفها كل موقف (ص 29).',cats:['الدرجة أ','الدرجة ب','الدرجة ج'],items:[
 ['عامل في عمل خفيف، يكفيه حماية محدودة من الصدمات.',0,'الدرجة أ «مصمم للأعمال الخفيفة».'],
 ['عامل في أعمال شاقة يحتاج حماية كبيرة ضد الصدمات.',1,'الدرجة ب «مصمم للأعمال الشاقة ويوفر حماية كبيرة ضد مخاطر الصدمات».'],
 ['خوذة تتحمل <span class="ltr">20000</span> فولت لمدة 3 دقائق.',1,'هذه حماية الدرجة ب الكهربائية.'],
 ['خوذة مصنوعة من الألمنيوم.',2,'الدرجة ج «يصنع من الألمنيوم» ولا يحمي من التيار الكهربائي.'],
 ['حمايتها الكهربائية <span class="ltr">2200</span> فولت لمدة دقيقة واحدة فقط.',0,'هذه الحماية «المحدودة» للدرجة أ.']]})},
    {tip:`<p>تجربة أطول (تغيير الجهد ونوع العمل ومقارنة الدرجات الثلاث) تجدها في تبويب «المختبر».</p>`}
   ]},

  {st:7,short:'وقاية العين والوجه',title:'3-3-2 وقاية العين والوجه (<span class="ltr">Face &amp; Eye Protection</span>)',ref:'ص 29',
   q:'شرارة صغيرة من الجلخ قد تكفي لإتلاف العين… فما الذي يقف بينها وبين عينك؟',
   art:(()=>{const {art,nest,tx,C}=U3S;let s='';
    const T=[[270,'glasses','نظارة زجاجية','Safety Glasses','النظارات الزجاجية الواقية ⟦Safety Glasses⟧: نظارة بإطار وواقيات جانبية (الصورة اليمنى في الشكل ⟦3-4⟧).'],[180,'goggle','نظارة واقية','Safety Goggles','النظارات الواقية ⟦Safety Goggles⟧: مرنة تحيط بالعين وتُثبت بحزام مطاطي (الصورة الوسطى في الشكل ⟦3-4⟧).'],[90,'shield','حامي الوجه','Face Shield','حامي الوجه ⟦Face Shield⟧: حاجب شفاف كبير يغطي الوجه ويُثبت بحزام رأس (الصورة اليسرى في الشكل ⟦3-4⟧).']];
    T.forEach(([cx,ic,a,en,tip])=>{s+=`<g data-tip="${tip}"><rect x="${cx-44}" y="86" width="88" height="150" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/>${nest(icon(ic,60),cx-38,100,76,76)}${tx(cx,204,a,{fs:12.5,w:700})}${tx(cx,222,en,{fs:9.5,mono:1})}</g>`});
    s+=tx(180,64,'من المخاطر الكيميائية والميكانيكية',{fs:13,w:600});
    return art('ثلاث وسائل لوقاية العين والوجه: نظارة زجاجية واقية، ونظارة واقية محكمة، وحامي الوجه',C.lilac,s+tx(180,272,'ثلاث وسائل للوقاية',{fs:14,w:700}))})(),
   cap:'الوسائل الثلاث في الشكل <span class="ltr">(3-4)</span> ص 29، رسم مبسّط.<br><b>مرّر المؤشر على كل وسيلة (أو المسها في الجوال) لتعرف اسمها ووصفها.</b>',
   side:[
    {predict:{q:'أي هذه الأعمال <b>ليس</b> في قائمة الكتاب للأعمال التي تتطلب وقاية العين والوجه؟',opts:[
     ['أعمال الجلخ والتقطيع',false,'«أعمال الجلخ / التقطيع <span class="ltr">Chipping / Grinding</span>» أول القائمة.'],
     ['كتابة التقارير في المكتب',true,'القائمة: الجلخ/التقطيع، تداول المواد الكيميائية، عمليات الأفران، الأعمال التي ينشأ عنها غبار، أعمال اللحام (ص 29).'],
     ['الأعمال التي ينشأ عنها غبار',false,'«الأعمال التي ينشأ عنها غبار <span class="ltr">Dust Generation</span>» في القائمة.']]}}
   ],
   body:[
    {book:`<p><b>3-3-2 وقاية العين والوجه <span class="ltr">Face &amp; Eye Protection</span>:</b> لوقاية العين والوجه من المخاطر الكيميائية والميكانيكية يجب ارتداء النظارات الواقية <span class="ltr">Safety Goggles</span> أو النظارات الزجاجية الواقية <span class="ltr">Safety Glasses</span> أو حامي الوجه <span class="ltr">Face Shield</span> (شكل <span class="ltr">3-4</span>).</p>
     <p>ومن أمثلة الأعمال التي تتطلب استخدام أجهزة وقاية العين والوجه:</p><div class="tablebox"><table class="tt"><thead><tr><th>العمل</th><th>بالإنجليزية</th></tr></thead><tbody>
     <tr><td>أعمال الجلخ / التقطيع</td><td><span class="ltr">Chipping / Grinding</span></td></tr><tr><td>تداول المواد الكيميائية</td><td><span class="ltr">Chemicals Handling</span></td></tr><tr><td>عمليات الأفران</td><td><span class="ltr">Furnaces Operations</span></td></tr><tr><td>الأعمال التي ينشأ عنها غبار</td><td><span class="ltr">Dust Generation</span></td></tr><tr><td>أعمال اللحام</td><td><span class="ltr">Welding Operations</span></td></tr></tbody></table></div>`,ref:'ص 29'},
    {tip:`<p><b>المخاطر الميكانيكية</b>: أجزاء صلبة تتطاير (شظايا الجلخ، الغبار). <b>المخاطر الكيميائية</b>: رذاذ أو أبخرة مواد كيميائية. النظارة تحمي العين وحدها، أما حامي الوجه فيحمي الوجه كله، لذلك يُضاف عند الخطر الشديد (ستراه في المحطة التالية).</p>`,title:'ميكانيكية أم كيميائية؟'},
    {title:'مختبر مصغّر: ميكانيكي أم كيميائي؟',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل عمل من قائمة الكتاب: ما نوع الخطر الغالب على العين؟',cats:['ميكانيكي (أجزاء متطايرة)','كيميائي (رذاذ وأبخرة)'],items:[
 ['أعمال الجلخ / التقطيع',0,'جدول ص 30: الجلخ خطره «مواد صلبة متطايرة».'],
 ['تداول المواد الكيميائية',1,'جدول ص 30: «تطاير مواد كيميائية، أبخرة ضارة، مواد حارقة».'],
 ['الأعمال التي ينشأ عنها غبار',0,'الغبار جسيمات صلبة تدخل العين.']]})}
   ]},

  {st:8,short:'اختيار واقي العين',title:'أ- اختيار وسيلة حماية العين المناسبة',ref:'ص 30–31',
   q:'نظارة شفافة أم عدسة داكنة؟ ومتى نضيف حامي الوجه فوق النظارة؟',
   art:(()=>{const {art,nest,tx,C}=U3S;let s='';
    const N=[['1',270,72],['2',180,72],['5',90,72],['7',270,170],['9',180,170],['11',90,170]];
    N.forEach(([n,cx,y])=>{s+=`<g data-tip="الواقي رقم ⟦${n}⟧ في الشكل ⟦3-5⟧: ${PROTAR[n]} — ⟦${PROTEN[n].replace(/\*/g,'')}⟧."><rect x="${cx-42}" y="${y}" width="84" height="86" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.2"/>${nest(protSVG(n,90),cx-36,y+10,72,48)}<text x="${cx}" y="${y+76}" text-anchor="middle" font-size="15" font-weight="700" fill="#2C4A40" font-family="var(--mono)">${n}</text></g>`});
    s+=tx(180,52,'من واقيات الشكل',{fs:13,w:600})+tx(180,290,'شفافة للأجزاء المتطايرة، داكنة للحام',{fs:12.5,w:600});
    return art('ستة واقيات من الشكل 3-5 بأرقامها: 1 و2 و5 شفافة، و7 و9 و11 داكنة للحام',C.sand,s)})(),
   cap:'ستة من الواقيات المرقمة في الشكل <span class="ltr">(3-5)</span> ص 31؛ الأرقام أرقام الشكل نفسه.<br><b>مرّر المؤشر على أي واقٍ (أو المسه في الجوال) لتعرف اسمه.</b>',
   side:[
    {predict:{q:'حسب جدول ص 30، ما الواقي المقترح لأعمال اللحام الكهربائي؟',opts:[
     ['1 أو 3 (نظارات شفافة)',false,'الشفافة للجلخ؛ اللحام فيه «أشعة شديدة الخطورة» تحتاج عدسة داكنة.'],
     ['10 وحده (حامي الوجه)',false,'حامي الوجه في الشكل يكون شفافاً أو داكناً، والجدول لم يذكره للحام الكهربائي.'],
     ['9 أو 11',true,'اللحام الكهربائي: «شرر، أشعة شديدة الخطورة، معدن منصهر» ← 9، 11 (نظارة لحام بلوح داكن، أو خوذة اللحام).']]}}
   ],
   body:[
    {book:`<p><b>أ- اختيار وسيلة حماية العين المناسبة:</b> الجدول التالي يوضح الوسيلة المناسبة لحماية العينين خلال الأعمال المختلفة بالإضافة للشكل <span class="ltr">(3-5)</span>:</p>${eyeTable()}`,ref:'ص 30'},
    {watch:`<p>عنوان العمود الأخير في جدول ص 30 «حسب جدول رقم ١»، والأرقام فيه هي في الحقيقة أرقام الواقيات في الشكل <span class="ltr">(3-5)</span> المعنون بالإنجليزية <span class="ltr">Figure 1</span>، والشكل نفسه يحيل إلى <span class="ltr">Table 1</span> غير الموجود في الكتاب؛ لذلك كتبنا عنوان العمود «أرقام الشكل <span class="ltr">(3-5)</span>». وصححنا «شرز» = شرر، و«الخلخ» = الجلخ.</p>`,fix:true},
    {html:`<p><b>الشكل <span class="ltr">(3-5)</span></b> الواقيات الموصى بها للعين والوجه (<span class="ltr">7A</span> و<span class="ltr">8A</span> غير مرسومتين) — رسم مبسّط، <span class="ref">ص 31</span>:</p>${fig35()}`},
    {tip:`<p>اقرأ الجدول هكذا: <b>العمل ← خطره ← رقم الواقي</b>. العدسات <b>الداكنة</b> (7، 8، 9، 11) لأعمال اللحام والقطع والأفران لأنها تحجب الأشعة والضوء المبهر. العدسات <b>الشفافة</b> للجلخ والمعامل لأنها تمنع الأجزاء المتطايرة دون أن تحجب الرؤية. وحامي الوجه (10) يُضاف عند التعرض الخطر ليحمي الوجه كله.</p>`,title:'كيف تقرأ الجدول؟'},
    {title:'مختبر مصغّر: اختر الواقي من الجدول',widget:(el,B)=>DCML.cases(el,B,{intro:'ثلاثة أعمال من جدول ص 30. اختر الوسيلة المقترحة لكل عمل.',cases:[
 {q:'أعمال الجلخ — الخطر: مواد صلبة متطايرة.',opts:[
  ['7 أو 9 فقط (عدسات لحام داكنة)',false,'الداكنة تحجب الرؤية بلا حاجة؛ خطر الجلخ أجزاء متطايرة لا أشعة.'],
  ['1، 3، 4، 5، 6، <span class="ltr">7A</span>، <span class="ltr">8A</span>، 10',true,'هذا صف الجلخ في الجدول: نظارات وواقيات شفافة أو حامي الوجه.']]},
 {q:'مناولة المواد الكيميائية — الخطر: تطاير مواد كيميائية، أبخرة ضارة، مواد حارقة.',opts:[
  ['2 أو 10، ويمكن استعمال 10 مع 2 في حالات التعرض الخطرة',true,'هذا صف مناولة المواد الكيميائية في الجدول.'],
  ['11 (خوذة اللحام)',false,'خوذة اللحام للأشعة الشديدة، لا لرذاذ المواد الكيميائية.']]},
 {q:'أعمال الأفران — الخطر: ضوء مبهر، حرارة عالية، معدن منصهر.',opts:[
  ['4 أو 5 (نظارات بإطار وواقيات جانبية)',false,'عدساتها شفافة لا تحجب الضوء المبهر.'],
  ['7، 8، 9، ويمكن إضافة 10 في حالات التعرض شديدة الخطورة',true,'هذا صف أعمال الأفران في الجدول.']]}]})},
    {tip:`<p>مطابقة كل الأعمال الستة بالواقيات (بما فيها الجمع بين واقيين) تجدها في تبويب «المختبر».</p>`}
   ]},

  {recap:[
   'حدّد نوع المخاطر أولاً، ثم اختر معدات وقاية معتمدة تلائم الشخص، وتُوفَّر بلا تكلفة على العامل، ويتكرر الفحص الطبي لمستعملي أجهزة التنفس سنوياً.',
   'الخوذة: جسم صلب وبطانة بينهما مسافة أمان تمتص الصدمة، وتُفحص قبل الاستعمال (لا تشققات ولا بطانة ممزقة).',
   'مخاطر الرأس: المعدات المتساقطة، والاصطدام بأجسام صلبة، والمخاطر الكهربائية.',
   'نوعا الخوذة: حافة كاملة ورفرف أمامي؛ ودرجاتها: أ خفيفة (<span class="ltr">2200</span> فولت لدقيقة)، ب شاقة (<span class="ltr">20000</span> فولت لـ 3 دقائق)، ج ألمنيوم لا تحمي من الكهرباء.',
   'وقاية العين والوجه بالنظارات الواقية أو الزجاجية أو حامي الوجه، ويُختار الواقي لكل عمل من جدول ص 30 بأرقام الشكل <span class="ltr">(3-5)</span>.']}
],
 theory:[
  {h:'الهدف العام والأهداف التفصيلية للوحدة',ref:'ص 26',html:`<p><b>الهدف العام للوحدة:</b> الإنجازات الأساسية لمعرفة معدات السلامة الشخصية وطرق استخدامها، وكذلك فحصها والمحافظة عليها.</p>
   <p><b>الأهداف التفصيلية:</b></p><ol><li>أن يذكر المتدرب الإرشادات العامة لمهمات السلامة الشخصية.</li><li>أن يقوم المتدرب بحصر معدات الوقاية الشخصية.</li><li>أن يصنف المتدرب كل معدة من معدات الوقاية الشخصية.</li><li>أن يلم المتدرب بوظائف كل معدة من معدات الوقاية الشخصية.</li><li>أن يختار المتدرب المعدة المناسبة للوقاية لكل عمل مطلوب.</li><li>أن يعرف المتدرب طريقة فحص أجهزة التنفس بأنواعها.</li><li>أن يلم المتدرب بأنواع اللوحات الإرشادية ويصنفها.</li></ol>`},
  {h:'مهمات السلامة للوقاية الشخصية (<span class="ltr">Personal Protective Equipment</span>)',ref:'ص 27',html:`<p><b>3-1 الغرض:</b> تقديم وصف كامل لمعدات الوقاية الشخصية ومدى أهميتها في المحافظة على سلامة العاملين، والطريقة الصحيحة لاستعمالها والمحافظة عليها، وكيفية اختيار الجهاز أو المعدة المناسبة لتناسب نوع المخاطر التي يتعرض لها الشخص.</p>`},
  {h:'إرشادات عامة',ref:'ص 27',html:`<ul><li>يجب <b>تحديد نوع المخاطر</b> في أماكن العمل أولاً، ثم يتم بعد ذلك تحديد معدات الوقاية المطلوب استعمالها. ويتم توفير هذه المعدات <b>بدون تحميل أية تكلفة مادية للعاملين</b>.</li>
   <li>يجب استخدام معدات الوقاية الشخصية <b>المعتمدة من السلطات المحلية</b> وتكون متوافقة مع <span class="ltr">American National Standards Institute (ANSI)</span>.</li>
   <li>يجب ارتداء معدات السلامة للوقاية الشخصية بطريقة <b>تلائم الشخص</b> المستعمل لها <span class="ltr">Properly Fitting</span>.</li>
   <li>يجب إجراء <b>فحص طبي</b> للعاملين الذين تستدعي طبيعة عملهم استخدام أجهزة التنفس، ويتم تكرار هذا الفحص <b>سنوياً</b>.</li>
   <li>يجب <b>تدريب</b> جميع العاملين الذين يطلب منهم استعمال معدات الوقاية الشخصية على الطريقة الصحيحة لاستعمال هذه المعدات، وذلك بواسطة المسئولين المباشرين لهم.</li>
   <li>في حالة عدم استخدام معدات الوقاية الشخصية يتم وضعها في <b>أكياس من البلاستيك</b> وحفظها في حالة نظيفة.</li></ul>`},
  {h:'3-3-1 وقاية الرأس (<span class="ltr">Head Protection</span>)',ref:'ص 27–28',html:`<p>تستخدم <b>الخوذة الصلبة</b> المعالجة بالبلاستيك لحماية الرأس ومقاومة الصدمات الثقيلة دون أن تتكسر، كذلك تقاوم الاختراق بواسطة الأجسام الساقطة. كما أن الخوذة مزودة من الداخل <b>برباط وبطانة بلاستيكية</b> يتم ضبطها لتناسب حجم الرأس، وفائدة هذه البطانة أنها <b>تمتص صدمة</b> الأجسام الساقطة على الخوذة من الخارج، حيث توجد <b>مسافة أمان</b> بين هذه البطانة وجسم الخوذة (شكل <span class="ltr">3-1</span>).</p>`},
  {fig:'(3-1)',ref:'ص 28',caption:'الخوذة: مقطع يوضح أجزاءها (يمين)، وخوذة مقلوبة يظهر بداخلها نظام الحمالة، وخوذة ذات رفرف أمامي — رسم توضيحي مبسّط للصور (ليس الصور الأصلية). Vertical clearance: مسافة الأمان الرأسية · Harness: الحمالة · Sweatband: حزام الرأس · Ventilation holes: فتحات التهوية · Peak: الرفرف.',draw:()=>box(fig31(),620)},
  {html:`<p>قبل استخدام الخوذة يجب التأكد من سلامتها وعدم وجود <b>تشققات أو صدمات</b> بها، وأن الأربطة والبطانة غير ممزقة.</p>`},
  {h:'أ- المخاطر على الرأس',ref:'ص 28',html:`<p>تنحصر المخاطر التي من الممكن أن يتعرض إليها الرأس في <b>المعدات المتساقطة</b> أو <b>الاصطدام بأجسام صلبة</b> أو <b>المخاطر الكهربائية</b> بالنسبة للعاملين في مجال الكهرباء، كما هو موضح في الشكل <span class="ltr">(3-2)</span>.</p>`},
  {fig:'(3-2)',ref:'ص 28',caption:'يمين: «المعدات الساقطة أو الاصطدام». يسار: «مخاطر الكهرباء». رسم توضيحي مبسّط للصورتين.',draw:()=>box(fig32(),560)},
  {h:'ب- أنواع الخوذات',ref:'ص 29',html:`<p>يوجد نوعان للخوذات: <b>النوع 1</b> <span class="ltr">(Type 1)</span> ذو الحافة الكاملة حول الرأس، و<b>النوع 2</b> <span class="ltr">(Type 2)</span> ذو الرفرف الأمامي (شكل <span class="ltr">3-3</span>). كل نوع من النوعين ينقسم إلى ثلاث درجات <span class="ltr">Classes</span>:</p>
   <ul><li><b>الدرجة أ – <span class="ltr">Class A (or G)</span>:</b> مصمم للأعمال الخفيفة، ويوفر حماية محدودة ضد مخاطر الصدمات، وحماية محدودة للتيار الكهربائي (<span class="ltr">2200</span> فولت لمدة دقيقة واحدة فقط).</li>
   <li><b>الدرجة ب – <span class="ltr">Class B (or E)</span>:</b> مصمم للأعمال الشاقة، ويوفر حماية كبيرة ضد مخاطر الصدمات، كذلك حماية كبيرة للتيار الكهربائي (<span class="ltr">20000</span> فولت لمدة 3 دقائق).</li>
   <li><b>الدرجة ج – <span class="ltr">Class C</span>:</b> يصنع من الألمنيوم، ويوفر حماية جيدة ضد الصدمات، ولكن <b>لا يوفر أية حماية ضد التيار الكهربائي</b>.</li></ul>`},
  {fig:'(3-3)',ref:'ص 29',caption:'نوعا الخوذات: <span class="ltr">Type 1 – Full Brim</span> (حافة كاملة) و<span class="ltr">Type 2 – Peak</span> (رفرف أمامي). رسم توضيحي مبسّط.',draw:()=>box(fig33(),520)},
  {html:`<p><b>ملخص درجات الخوذات</b> (من نص الكتاب):</p>${helmetTable()}<p class="sub">خانة «الاستخدام» للدرجة ج فارغة في الكتاب.</p>`},
  {note:TIP+'رقم الجهد في درجة الخوذة هو جهد <b>الاختبار</b> الذي تتحمله لمدة محددة. عامل الكهرباء يختار الدرجة ب، أما خوذة الألمنيوم (ج) فتوصل التيار ولا تُلبس قرب الأجزاء المكهربة. جرّب ذلك في «المختبر».'},
  {h:'3-3-2 وقاية العين والوجه (<span class="ltr">Face &amp; Eye Protection</span>)',ref:'ص 29',html:`<p>لوقاية العين والوجه من المخاطر الكيميائية والميكانيكية يجب ارتداء <b>النظارات الواقية</b> <span class="ltr">Safety Goggles</span> أو <b>النظارات الزجاجية الواقية</b> <span class="ltr">Safety Glasses</span> أو <b>حامي الوجه</b> <span class="ltr">Face Shield</span> (شكل <span class="ltr">3-4</span>).</p>`},
  {fig:'(3-4)',ref:'ص 29',caption:'من اليمين: نظارة سلامة بواقيات جانبية <span class="ltr">(Safety Glasses)</span>، ونظارة واقية مرنة بحزام <span class="ltr">(Goggles)</span>، وواقي وجه شفاف بحزام رأس <span class="ltr">(Face Shield)</span>. رسم توضيحي مبسّط.',draw:()=>`<div style="display:flex;justify-content:center;gap:28px;flex-wrap:wrap">${['glasses','goggle','shield'].map(k=>icon(k,110)).join('')}</div>`},
  {html:`<p>ومن أمثلة الأعمال التي تتطلب استخدام أجهزة وقاية العين والوجه:</p><div class="tablebox"><table class="tt"><thead><tr><th>العمل</th><th>بالإنجليزية</th></tr></thead><tbody>
   <tr><td>أعمال الجلخ / التقطيع</td><td><span class="ltr">Chipping / Grinding</span></td></tr><tr><td>تداول المواد الكيميائية</td><td><span class="ltr">Chemicals Handling</span></td></tr><tr><td>عمليات الأفران</td><td><span class="ltr">Furnaces Operations</span></td></tr><tr><td>الأعمال التي ينشأ عنها غبار</td><td><span class="ltr">Dust Generation</span></td></tr><tr><td>أعمال اللحام</td><td><span class="ltr">Welding Operations</span></td></tr></tbody></table></div>`},
  {h:'أ- اختيار وسيلة حماية العين المناسبة',ref:'ص 30',html:`<p>الجدول التالي يوضح الوسيلة المناسبة لحماية العينين خلال الأعمال المختلفة، بالإضافة للشكل <span class="ltr">(3-5)</span>:</p>${eyeTable()}`},
  {fig:'(3-5)',ref:'ص 31',caption:'الواقيات الموصى بها للعين والوجه، مرقمة من 1 إلى 11 (و<span class="ltr">7A</span> و<span class="ltr">8A</span> غير مرسومتين). رسم توضيحي مبسّط، والقائمة الإنجليزية منقولة من الشكل.',draw:()=>fig35()},
  {note:TIP+'الأرقام في عمود «الوسيلة المقترحة» هي أرقام الواقيات في الشكل <span class="ltr">(3-5)</span>. العدسات <b>الداكنة</b> (7، 8، 9، 11) للحام والأفران لأنها تحجب الأشعة والضوء المبهر، والعدسات <b>الشفافة</b> للجلخ والمعامل لأنها تحمي من الأجزاء المتطايرة دون أن تحجب الرؤية.'},
  {err:`عمود الجدول في ص 30 عنوانه «حسب جدول رقم ١»، والأرقام فيه هي في الحقيقة أرقام الواقيات في الشكل <span class="ltr">(3-5)</span> المعنون بالإنجليزية <span class="ltr">Figure 1</span>، والشكل نفسه يحيل إلى <span class="ltr">Table 1</span> غير الموجود في الكتاب؛ لذلك كتبنا عنوان العمود «أرقام الشكل <span class="ltr">(3-5)</span>». وصححنا في النص دون تنبيه أخطاء طباعية: «شرز» = شرر، «أعمال الخلخ» = الجلخ، «ألراس» = الرأس، «لتتاسب» = لتناسب، «من النوعان» = من النوعين. وفي ص 27 كُتب اسم <span class="ltr">ANSI</span> «<span class="ltr">American National Safety Institute</span>» والصواب <span class="ltr">Standards</span> (كما كُتب صحيحاً في ص 49).`}
 ],
 lab:(el)=>{el.innerHTML='<div class="grid" id="l1a"></div><div class="grid" id="l1b" style="margin-top:16px"></div>'+`<div class="panel" style="margin-top:16px">${tries(['اجعل الجهد 2000 فولت واختر الدرجة أ، ثم ارفعه إلى 3000 فولت.','غيّر نوع العمل إلى «شاق» مع الدرجة أ.','في مطابقة الواقيات: اختر «أعمال اللحام الكهربائي» وجرّب واقياً شفافاً، ثم واقياً داكناً.','في «أعمال المعامل» جرّب الواقي 10 وحده، ثم 10 مع 5.'])}</div>`;helmetLab(el.querySelector('#l1a'));eyeLab(el.querySelector('#l1b'))},
 quiz:[
  {q:'ما أول خطوة قبل تحديد معدات الوقاية الشخصية المطلوبة؟',o:['شراء المعدات الأرخص','تحديد نوع المخاطر في أماكن العمل','تدريب العاملين','إجراء الفحص الطبي'],c:1,e:'«يجب تحديد نوع المخاطر في أماكن العمل أولاً ثم يتم بعد ذلك تحديد معدات الوقاية» (ص 27).'},
  {q:'كم مرة يتكرر الفحص الطبي للعاملين الذين يستخدمون أجهزة التنفس؟',o:['مرة واحدة فقط','كل ستة أشهر','سنوياً','كل خمس سنوات'],c:2,e:'«ويتم تكرار هذا الفحص سنوياً» (ص 27).'},
  {q:'ما فائدة البطانة البلاستيكية داخل الخوذة؟',o:['تجعلها أخف وزناً','تمتص صدمة الأجسام الساقطة لوجود مسافة أمان بينها وبين جسم الخوذة','تعزل الكهرباء','تحمي الأذن من الضوضاء'],c:1,e:'(ص 28) والشكل (3-1).'},
  {q:'فني كهرباء يعمل قرب جهد 11000 فولت. أي درجة خوذة تناسبه؟',o:['الدرجة أ','الدرجة ب','الدرجة ج','أي درجة'],c:1,e:'الدرجة ب تتحمل 20000 فولت لمدة 3 دقائق، أما أ فـ 2200 فولت فقط، وج لا تحمي من الكهرباء (ص 29).'},
  {q:'خوذة الدرجة ج (الألمنيوم):',o:['تحمي من الكهرباء حتى 2200 فولت','توفر حماية جيدة ضد الصدمات ولا تحمي من التيار الكهربائي','مصممة للأعمال الخفيفة فقط','لا تحمي من الصدمات'],c:1,e:'(ص 29).'},
  {q:'حسب جدول ص 30، ما الواقي المقترح لأعمال اللحام الكهربائي؟',o:['1 أو 3','9 أو 11 (عدسة لحام داكنة أو خوذة لحام)','2 فقط','4 أو 5'],c:1,e:'اللحام الكهربائي: شرر وأشعة شديدة الخطورة ومعدن منصهر ← 9، 11.'}
 ]
});

/* =====================================================================
   LESSON 2 — ear protection & hearing conservation (ص 31–36)
   ===================================================================== */
const NOISE=[[90,8],[92,6],[95,4],[97,3],[100,2],[102,1.5],[105,1],[107,0.75],[110,0.5],[115,0.25]];
const Tof=L=>{const r=NOISE.find(x=>x[0]===+L);return r?r[1]:null};
const hrs=h=>{const m={0.25:'¼',0.5:'½',0.75:'¾',1.5:'1½'};return m[h]||String(h)};
const noiseTable=()=>`<div class="tablebox" style="max-width:420px;margin-inline:auto"><table class="tt"><thead><tr><th>مستوى الضوضاء <span class="ltr">Sound Level dBA</span></th><th>الفترة الزمنية <span class="ltr">Duration Per Day, Hours</span></th></tr></thead><tbody>${NOISE.map(r=>`<tr><td><span class="ltr">${r[0]}</span></td><td><span class="ltr">${hrs(r[1])}</span></td></tr>`).join('')}</tbody></table></div>`;
function fig36(){let s='';
  // a: earmuffs
  s+=`<g transform="translate(90 0)"><path d="M-46 92Q-46 24 0 24T46 92" ${S('','var(--fg)',6)}/><rect x="-66" y="80" width="38" height="66" rx="16" style="fill:#7b1f2a;stroke:var(--fg);stroke-width:1.5"/><rect x="28" y="80" width="38" height="66" rx="16" style="fill:#7b1f2a;stroke:var(--fg);stroke-width:1.5"/><rect x="-34" y="86" width="8" height="54" rx="4" style="fill:var(--fg)"/><rect x="26" y="86" width="8" height="54" rx="4" style="fill:var(--fg)"/></g>`+lt(90,18,'Earmuffs',{fs:12});
  // b: PVC and foam earplugs
  s+=`<g transform="translate(270 0)">${[0,1].map(i=>`<path d="M${-34+i*40} 42l8-10l8 10l-8 8z M${-34+i*40} 52l8-8l8 8l-8 8z M${-31+i*40} 62h10v14h-10z" style="fill:#d32f2f;stroke:var(--fg);stroke-width:1"/>`).join('')}<path d="M-21 76Q0 96 19 76" ${S('','#d32f2f',1.6)}/>${[0,1].map(i=>`<rect x="${-36+i*44}" y="112" width="18" height="30" rx="8" style="fill:${SC.yellow};stroke:var(--fg);stroke-width:1"/>`).join('')}<path d="M-27 142Q0 164 17 142" ${S('','var(--blue)',1.6)}/></g>`+lt(330,60,'PVC Earplugs',{fs:11,a:'start'})+lt(330,130,'Foam Earplugs',{fs:11,a:'start'});
  // c: banded earplugs
  s+=`<g transform="translate(500 0)"><path d="M-48 120Q-48 40 0 40T48 120" ${S('','var(--blue)',6)}/><path d="M-54 116l10 26l8-4z M54 116l-10 26l-8-4z" style="fill:${SC.yellow};stroke:var(--fg);stroke-width:1"/></g>`;
  s+=lt(90,172,'a',{fs:13})+lt(270,172,'b',{fs:13})+lt(500,172,'c',{fs:13});
  return svg(580,180,s,'أغطية الأذن وسدادات الأذن')}
/* the human ear (figure 3-7) — parts keyed for the widget */
const EARP=[
 ['pinna','صيوان الأذن','الأذن الخارجية: «تقوم بتجميع الموجات الصوتية (ذبذبات الصوت) ونقلها خلال القناة السمعية إلى طبلة الأذن».'],
 ['canal','القناة السمعية','تنقل الموجات الصوتية من الصيوان إلى طبلة الأذن (ص 33).'],
 ['drum','طبلة الأذن','«تقوم طبلة الأذن بنقل ذبذبات الصوت إلى» عظيمات الأذن الوسطى، وتتصل بها المطرقة (ص 33).'],
 ['mal','المطرقة','أول عظيمات الأذن الوسطى، «تتصل المطرقة بطبلة الأذن» (ص 33).'],
 ['inc','السندان','العظيمة الوسطى بين المطرقة والركاب.'],
 ['sta','الركاب','آخر العظيمات؛ تنقل الاهتزاز إلى الأذن الداخلية عند النافذة البيضاوية (انظر ملاحظة الكتاب أدناه).'],
 ['coch','القوقعة («إنسان الأذن»)','«يحتوي إنسان الأذن على عدد كبير جداً من الشعيرات الدقيقة جداً»، وهي التي تتلف من التعرض للضوضاء لفترات طويلة دون أن يشعر الشخص (ص 33–34).'],
 ['semi','القنوات الدائرية','جزء من الأذن الداخلية (ص 33).'],
 ['nerve','العصب السمعي','«يقوم بنقل نبضات الصوت إلى المخ» (ص 33).'],
 ['eust','قناة استاكيوس','تظهر في الرسم تحت الأذن الوسطى (لم يذكرها نص الكتاب).']];
function earSVG(hl,lbl){const H=k=>hl===k?'var(--live)':'var(--fg)',W=k=>hl===k?3.2:1.6,F=(k,f)=>hl===k?'var(--live-soft)':f;let s='';
  s+=`<path d="M150 20H520V290H150Q190 150 150 20Z" style="fill:var(--surface-2)"/>`;
  s+=`<g data-ep="pinna"><path d="M100 40Q30 30 24 110Q20 190 70 240Q90 262 112 240Q118 220 104 206Q86 190 96 168Q104 156 116 160" style="fill:${F('pinna','#f3c9b8')};stroke:${H('pinna')};stroke-width:${W('pinna')}"/><path d="M90 70Q54 76 52 120Q52 150 72 170" ${S('','var(--muted)',1.4)}/></g>`;
  s+=`<g data-ep="canal"><path d="M112 140H252V168H112Q100 154 112 140Z" style="fill:${F('canal','var(--wire)')};stroke:${H('canal')};stroke-width:${W('canal')}"/></g>`;
  s+=`<g data-ep="drum"><ellipse cx="254" cy="154" rx="5" ry="24" style="fill:${F('drum','var(--surface)')};stroke:${H('drum')};stroke-width:${W('drum')}"/></g>`;
  s+=`<g data-ep="mal"><path d="M258 150L272 132Q278 124 284 130L280 140L262 160Z" style="fill:${F('mal','var(--surface)')};stroke:${H('mal')};stroke-width:${W('mal')}"/></g>`;
  s+=`<g data-ep="inc"><path d="M282 126Q296 118 302 128L300 150L292 152L290 136L284 136Z" style="fill:${F('inc','var(--surface)')};stroke:${H('inc')};stroke-width:${W('inc')}"/></g>`;
  s+=`<g data-ep="sta"><path d="M296 150H318M300 146V156Q308 164 316 156V146" style="fill:none;stroke:${H('sta')};stroke-width:${W('sta')+0.6}"/><rect x="318" y="144" width="5" height="16" style="fill:${F('sta','var(--surface)')};stroke:${H('sta')};stroke-width:${W('sta')}"/></g>`;
  s+=`<g data-ep="semi">${[[350,82,22,14],[372,72,14,24],[382,98,22,12]].map(([cx,cy,rx,ry])=>`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" style="fill:none;stroke:${hl==='semi'?'var(--live)':SC.yellow};stroke-width:${hl==='semi'?6:5}"/>`).join('')}</g>`;
  s+=`<g data-ep="coch"><path d="M326 150Q330 118 366 118Q404 120 404 156Q402 190 368 192Q340 190 340 164Q342 142 366 142Q386 144 386 160Q384 176 368 176Q356 174 358 162" style="fill:none;stroke:${hl==='coch'?'var(--live)':SC.yellow};stroke-width:${hl==='coch'?9:8};stroke-linecap:round"/></g>`;
  s+=`<g data-ep="nerve"><path d="M404 150Q450 140 510 128M404 160Q450 152 510 144" style="fill:none;stroke:${hl==='nerve'?'var(--live)':'var(--blue)'};stroke-width:${hl==='nerve'?4:2.5}"/></g>`;
  s+=`<g data-ep="eust"><path d="M300 176Q320 230 380 272" style="fill:none;stroke:${H('eust')};stroke-width:${hl==='eust'?9:7};opacity:.55"/></g>`;
  if(lbl){
    const tag=(x,y,lx,ly,t,a)=>`<path d="M${x} ${y}L${lx} ${ly}" ${S('','var(--muted)',1)}/>`+ar(lx+(a==='start'?3:a==='end'?-3:0),ly+(ly<y?-4:14),t,{fs:11.5,a:a||'middle'});
    s+=tag(60,60,40,20,'صيوان الأذن')+tag(180,154,190,214,'القناة السمعية')+tag(254,178,236,262,'طبلة الأذن')+tag(274,132,250,40,'المطرقة')+tag(296,122,300,24,'السندان')+tag(316,148,330,236,'الركاب','start')
      +tag(372,192,420,250,'القوقعة','start')+tag(372,60,430,40,'القنوات الدائرية','start')+tag(470,136,478,96,'العصب السمعي')+tag(340,250,300,282,'قناة استاكيوس','end');
    s+=`<path d="M20 296H246M256 296H324M330 296H514" ${S('','var(--blue)',3)}/>`;}
  return svg(530,310,s,'مقطع في الأذن البشرية')}
const EARPATH=['pinna','canal','drum','mal','inc','sta','coch','nerve'];
function earWidget(el){let hl='',lbl=true,tm=null;
  const draw=()=>{const P=EARP.find(p=>p[0]===hl);
    el.innerHTML=`<figure class="fig"><div class="wrap-in" style="padding-top:0"><button class="btn primary" data-trace>تتبّع مسار الصوت</button><button class="btn" data-lbl aria-pressed="${lbl}">${lbl?'إخفاء الأسماء (الشكل في الكتاب بلا أسماء)':'إظهار الأسماء'}</button></div>
     ${box(earSVG(hl,lbl),600)}<div class="callout" style="min-height:3.2em">${P?`<b>${P[1]}:</b> ${P[2]}`:'اضغط على أي جزء في الرسم، أو اضغط «تتبّع مسار الصوت».'}</div>
     <figcaption><b>الشكل <span class="ltr">(3-7)</span></b> مقطع في الأذن البشرية: الأذن الخارجية والوسطى والداخلية — رسم توضيحي مبسّط. <b>الأسماء على الرسم إضافة من خارج الكتاب</b> (الشكل في الكتاب بلا أي كتابة). <span class="ref">ص 33</span></figcaption></figure>`;
    el.querySelectorAll('[data-ep]').forEach(g=>{g.style.cursor='pointer';g.addEventListener('click',()=>{clearInterval(tm);hl=g.dataset.ep;draw()})});
    el.querySelector('[data-lbl]').onclick=()=>{lbl=!lbl;draw()};
    el.querySelector('[data-trace]').onclick=()=>{clearInterval(tm);let i=0;hl=EARPATH[0];draw();tm=setInterval(()=>{if(!document.body.contains(el)){clearInterval(tm);return}i++;if(i>=EARPATH.length){clearInterval(tm);return}hl=EARPATH[i];draw()},1300)};};
  draw()}

function noiseLab(el){
  /* وضع التحدي: القانون المصحح دائماً (زر «كما في الكتاب» مخفي هناك) */
  let book=chOn()?false:!B.bkOn('noise');
  const per=[{L:90,C:4},{L:95,C:2},{L:100,C:1}];
  const w={D:0,Db:0,n:3,book,touchedBook:false,flip:false,prot:{L:100,dev:'muff'},protOK:false};
  el.innerHTML=`<div class="grid">
   <div class="panel c12"><h2>مقياس جرعة الضوضاء (معامل التعرض) <small>مبني على جدول ص 34 وقاعدة ص 34–35</small></h2>
    <p class="sub">قسّم يوم العامل إلى فترات: لكل فترة مستوى الضوضاء والمدة الفعلية. يأخذ البرنامج المدة المسموحة لكل مستوى من الجدول ويحسب معامل التعرض.</p>
    <div class="wrap-in">${B.bkCtl('noise','قانون معامل التعرض:')}</div>
    <div id="nP"></div>
    <div class="wrap-in"><button class="btn" id="nAdd">+ أضف فترة</button><span class="sub">أمثلة جاهزة:</span><button class="btn" data-pre="0">8 ساعات عند 90</button><button class="btn" data-pre="1">مثال 1</button><button class="btn" data-pre="2">مثال 2</button></div>
   </div>
   <div class="panel c7"><h2>يوم العامل وحساب المعامل</h2><div class="svgbox" id="nDay"></div><div class="tablebox" id="nTb"></div></div>
   <div class="panel c5"><h2>النتيجة</h2><div class="svgbox" id="nG"></div><div class="callout" id="nSay"></div><div id="nWarn"></div></div>
   <div class="panel c7"><h2>هل يكفي واقي الأذن؟ <small>من أرقام ص 32</small></h2>
    <div class="wrap-in" style="align-items:flex-end"><label class="sub" style="display:flex;flex-direction:column;gap:2px;min-width:200px;flex:1">شدة الضوضاء في مكان العمل: <b id="pLv" class="ltr" style="color:var(--fg)"></b><input type="range" id="pL" min="80" max="135" step="1" value="100" style="accent-color:var(--blue);width:100%"></label>
    <div><div class="sub">الواقي</div>${segHTML('dev',[['none','بلا واقٍ'],['muff','أغطية الأذن'],['plug','سدادات الأذن'],['both','السدادات مع الأغطية']],'muff',1)}</div></div>
    <div class="grid" style="margin-top:0"><div class="c5"><div class="svgbox" id="pSvg" style="max-width:220px;margin-inline:auto"></div></div><div class="c7"><div class="callout" id="pSay"></div></div></div></div>
   <div class="panel c5"><h2>مهام</h2><ol class="steps" id="nSt"></ol></div>
   <div class="panel c12">${tries(['اجعل فترة واحدة: 8 ساعات عند 90 dB — المعامل يساوي 1 تماماً (الحد المسموح).','زد المستوى إلى 95 dB مع بقاء 8 ساعات، ولاحظ كيف تضاعف المعامل.','بدّل إلى «كما في الكتاب» في المثال 2: الكتاب يقول «تجاوز» والعامل في الحقيقة تحت الحد.','في لوحة الواقي: اجعل الضوضاء 125 dB وجرّب كل واقٍ.'])}</div>
  </div>`;
  const $=s=>el.querySelector(s);
  const st=stepsUI($('#nSt'),[
   {t:'اختر القانون المصحح',x:'اضغط «المصحح» في أعلى المختبر (القانون المطبوع في الكتاب مقلوب).',done:w=>!w.book},
   {t:'الحد المسموح بالضبط',x:'اجعل فترة واحدة فقط: 8 ساعات عند 90 dB (أو اضغط «8 ساعات عند 90»).',done:w=>!w.book&&w.n===1&&Math.abs(w.D-1)<1e-9},
   {t:'تجاوز الحد',x:'أضف فترة أو غيّر المستوى حتى يصبح المعامل أكبر من 1.',done:w=>!w.book&&w.D>1},
   {t:'حكمان متعاكسان',x:'كوّن يوماً من فترتين يكون فيه المعامل الصحيح أقل من 1 ونتيجة قانون الكتاب أكبر من 1 (جرّب «مثال 2» ثم بدّل بين الزرين).',done:w=>w.n>=2&&w.D<1&&w.Db>1},
   {t:'اختر الواقي',x:'في لوحة الواقي: اجعل الضوضاء 125 dB واختر الواقي الذي يذكر الكتاب أنه يُستعمل عند هذه الشدة.',done:w=>w.prot.L>=121&&w.prot.dev==='both'}
  ],()=>w);
  const lvOpts=c=>`<option value="0"${c===0?' selected':''}>أقل من 90</option>`+NOISE.map(r=>`<option value="${r[0]}"${r[0]===c?' selected':''}>${r[0]} ديسيبل</option>`).join('');
  function rows(){$('#nP').innerHTML=per.map((p,i)=>`<div class="wrap-in" style="padding:6px 4px;border-top:1px solid var(--line);align-items:flex-end">
     <b style="min-width:62px">الفترة ${i+1}</b>
     <label class="sub" style="display:flex;flex-direction:column;gap:2px">المستوى<select data-lv="${i}" style="font:inherit;padding:4px 8px;border-radius:8px;border:1px solid var(--line);background:var(--surface);color:var(--fg)">${lvOpts(p.L)}</select></label>
     <label class="sub" style="display:flex;flex-direction:column;gap:2px;min-width:170px;flex:1">المدة الفعلية C: <b class="ltr" style="color:var(--fg)" data-cv="${i}">${p.C} h</b><input type="range" data-c="${i}" min="0" max="10" step="0.25" value="${p.C}" style="accent-color:var(--blue);width:100%"></label>
     ${per.length>1?`<button class="btn warn" data-del="${i}" aria-label="احذف الفترة ${i+1}">حذف</button>`:''}</div>`).join('')}
  function calc(){let D=0,Db=0;const r=per.map(p=>{const T=p.L?Tof(p.L):null,ok=T&&p.C>0;const a=ok?p.C/T:0,b=ok?T/p.C:0;D+=a;Db+=b;return {p,T,a,b,ok}});return {r,D,Db}}
  const f3=x=>B.fmtN(B.round(x,3));
  function draw(){const {r,D,Db}=calc();w.D=D;w.Db=Db;w.n=per.filter(p=>p.C>0).length;w.book=book;
    const V=book?Db:D;
    // day bar
    const tot=per.reduce((a,p)=>a+p.C,0),Hmax=Math.max(8,Math.ceil(tot));let x=40,s='';const sc=500/Hmax;
    s+=`<rect x="40" y="20" width="500" height="34" rx="4" style="fill:var(--surface-2)"/>`;
    per.forEach((p,i)=>{if(!(p.C>0))return;const wd=p.C*sc,col=!p.L?'var(--on)':p.L<95?'var(--live)':'var(--stop)';s+=`<rect x="${x.toFixed(1)}" y="20" width="${wd.toFixed(1)}" height="34" style="fill:${col};opacity:.8;stroke:var(--surface);stroke-width:2"/>`;if(wd>34)s+=lt(x+wd/2,42,p.L?p.L+' dB':'<90',{fs:10.5,fill:'#fff'});x+=wd});
    for(let h=0;h<=Hmax;h++)s+=`<path d="M${40+h*sc} 56V62" ${S('','var(--muted)',1)}/>`+(h%2===0||Hmax<=10?lt(40+h*sc,74,String(h),{m:1,fs:10}):'');
    s+=`<path d="M${40+8*sc} 12V60" ${S('','var(--blue)',1.5)} stroke-dasharray="4 3"/>`+lt(40+8*sc,10,'8 h',{fs:10,fill:'var(--blue)'});
    $('#nDay').innerHTML=svg(560,80,s,'توزيع ساعات التعرض خلال اليوم');
    $('#nTb').innerHTML=`<table class="tt"><thead><tr><th>الفترة</th><th>المستوى</th><th>المدة الفعلية <span class="ltr">C</span></th><th>المسموحة من الجدول <span class="ltr">T</span></th><th>${book?'<span class="ltr">T ÷ C</span>':'<span class="ltr">C ÷ T</span>'}</th></tr></thead><tbody>${r.map((q,i)=>`<tr><td>${i+1}</td><td>${q.p.L?`<span class="ltr">${q.p.L} dB</span>`:'أقل من 90'}</td><td><span class="ltr">${q.p.C} h</span></td><td>${q.T?`<span class="ltr">${q.T} h</span>`:'— (لا يُحسب)'}</td><td><span class="ltr">${q.ok?f3(book?q.b:q.a):'0'}</span></td></tr>`).join('')}<tr style="font-weight:700"><td colspan="4">المجموع = معامل التعرض</td><td><span class="ltr">${f3(V)}</span></td></tr></tbody></table>`;
    // gauge
    const gmax=Math.max(2,Math.ceil(V*1.15*2)/2),gx=v=>30+Math.min(v,gmax)/gmax*480;let g=`<rect x="30" y="26" width="480" height="26" rx="6" style="fill:var(--surface-2)"/>`;
    g+=`<rect x="30" y="26" width="${(gx(1)-30).toFixed(1)}" height="26" rx="6" style="fill:var(--on-soft)"/><rect x="${gx(1).toFixed(1)}" y="26" width="${(510-gx(1)).toFixed(1)}" height="26" rx="6" style="fill:var(--stop-soft)"/>`;
    g+=`<rect x="30" y="31" width="${(gx(V)-30).toFixed(1)}" height="16" rx="4" style="fill:${V>1+1e-9?'var(--stop)':'var(--on)'}"/>`;
    g+=`<path d="M${gx(1)} 18V60" ${S('','var(--fg)',2)}/>`+lt(gx(1),14,'1',{fs:12})+lt(30,74,'0',{m:1})+lt(510,74,String(gmax),{m:1});
    $('#nG').innerHTML=svg(540,80,g,'مقياس معامل التعرض');
    const verdict=v=>v>1+1e-9?'<b style="color:var(--stop)">أكثر من الحد المسموح به</b>':v<1-1e-9?'<b style="color:var(--on)">أقل من الحد المسموح به</b>':'<b>يساوي الحد المسموح به تماماً</b>';
    $('#nSay').innerHTML=w.n?`معامل التعرض = <b class="ltr">${f3(V)}</b>${book?'':` (<span class="ltr">${B.fmtN(B.round(D*100,1))}%</span> من الجرعة اليومية)`}<br>${V>1+1e-9?'أكبر من الواحد الصحيح':V<1-1e-9?'أقل من الواحد الصحيح':'يساوي الواحد الصحيح'} ← التعرض ${verdict(V)} (90 dB لمدة 8 ساعات).`:'لا توجد فترة تعرض محسوبة (كل الفترات أقل من 90 dB أو مدتها صفر).';
    const flip=w.n&&((D>1+1e-9)!==(Db>1+1e-9));
    $('#nWarn').innerHTML=book&&w.n?`<div class="callout err"><span class="fixnote">هذا الرقم من القانون كما طُبع في ص 34 (المسموحة ÷ الفعلية)، وهو مقلوب. بالقانون الصحيح (الفعلية ÷ المسموحة) يكون المعامل <b class="ltr">${f3(D)}</b> والحكم: ${verdict(D)}.${flip?' <b>لاحظ أن الحكمين متعاكسان هنا.</b>':''}</span></div>`:'';
    drawProt();st.check()}
  function drawProt(){const L=w.prot.L,d=w.prot.dev;$('#pLv').textContent=L+' dB';
    const R={muff:[15,35,90,120,'أغطية الأذن'],plug:[20,30,85,115,'سدادات الأذن'],both:[50,50,0,130,'السدادات مع الأغطية']}[d];
    let say='',lo=L,hi=L;
    if(d==='none'){say=L>85?`الشدة <span class="ltr">${L} dB</span> أعلى من <span class="ltr">85 dB</span>: «يجب على جميع العاملين الذين يعملون في أماكن عالية الضوضاء وتزيد شدتها عن 85 ديسيبل ارتداء معدات وقاية الأذن» (ص 31).`:`الشدة لا تزيد عن <span class="ltr">85 dB</span>، والكتاب يوجب الواقي فوق <span class="ltr">85 dB</span>.`;}
    else{const inR=L>=R[2]&&L<=R[3];lo=L-R[1];hi=L-R[0];
      say=`<b>${R[4]}:</b> ${d==='both'?'تُستعمل في الأماكن التي تكون فيها الشدة عالية جداً قد تصل إلى <span class="ltr">130 dB</span>، وتقلل الضوضاء <span class="ltr">بحدود 50 dB</span>.':`تقلل الضوضاء <span class="ltr">${R[0]}–${R[1]} dB</span>، وتستعمل عندما تكون الشدة من <span class="ltr">${R[2]}</span> إلى <span class="ltr">${R[3]} dB</span>.`}<br>`+
        (L>R[3]?`<b style="color:var(--stop)">لا يناسب:</b> الشدة <span class="ltr">${L} dB</span> أعلى مما يُستعمل فيه هذا الواقي.`:inR?`<b style="color:var(--on)">يُستعمل في هذه الشدة.</b>`:`الشدة أقل من مجال استعماله المذكور في الكتاب.`)+
        `<br>الضوضاء التي تصل إلى الأذن تقريباً: <b class="ltr">${d==='both'?'≈ '+lo:lo+' – '+hi} dB</b>. <span class="sub">(${TIP.replace(/<\/?b>/g,'')}الشدة في المكان ناقص قيمة التخفيض المكتوبة على الواقي.)</span>`;}
    w.protOK=d!=='none'&&L<=R[3]&&L>=R[2];
    $('#pSay').innerHTML=say;
    const on=new Set(d==='both'?['plugs','muffs']:d==='muff'?['muffs']:d==='plug'?['plugs']:[]);
    const lv=Math.max(0,Math.min(1,((d==='none'?L:hi)-70)/60));
    let s=`<rect x="0" y="0" width="240" height="230" rx="10" style="fill:var(--surface-2)"/>`;
    s+=`<g transform="translate(0 -20) scale(1)"><g transform="translate(0 0)">${workerSVG(on).replace(/^<svg[^>]*>|<\/svg>$/g,'')}</g></g>`;
    const arcs=Math.round(1+lv*4);for(let i=0;i<arcs;i++)s+=`<path d="M${30-i*6} ${30+i*10}Q${18-i*6} ${50+i*10} ${30-i*6} ${70+i*10}" ${S('',lv>0.4?'var(--stop)':'var(--live)',2)}/>`;
    $('#pSvg').innerHTML=`<svg viewBox="0 0 240 200" role="img" aria-label="العامل وواقي الأذن">${s}</svg>`}
  function pre(k){per.length=0;[[[90,8]],[[90,4],[95,2],[100,1]],[[92,2],[97,1]]][k].forEach(([L,C])=>per.push({L,C}));rows();draw()}
  el.addEventListener('input',e=>{const t=e.target;if(t.dataset.c!=null){const i=+t.dataset.c;per[i].C=+t.value;el.querySelector(`[data-cv="${i}"]`).textContent=per[i].C+' h';draw()}
    if(t.id==='pL'){w.prot.L=+t.value;drawProt();st.check()}});
  el.addEventListener('change',e=>{const t=e.target;if(t.dataset.lv!=null){per[+t.dataset.lv].L=+t.value;draw()}});
  el.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
    if(b.dataset.bkfix==='noise'){book=b.dataset.bkv==='book';draw();return}
    if(b.dataset.del!=null){per.splice(+b.dataset.del,1);rows();draw()}
    if(b.id==='nAdd'&&per.length<5){per.push({L:90,C:1});rows();draw()}
    if(b.dataset.pre!=null)pre(+b.dataset.pre);
    if(b.dataset.dev){w.prot.dev=b.dataset.dev;setSeg(el,'dev',w.prot.dev);drawProt();st.check()}});
  rows();draw()}

/* worked examples (added — not in the book) */
function noiseEx(o){const n=o.per.length;const given=[];o.per.forEach((p,i)=>{given.push({id:'L'+(i+1),label:`مستوى الفترة ${i+1}`,sym:`L_${i+1}`,unit:'dB',value:p[0],step:'any'});given.push({id:'C'+(i+1),label:`المدة الفعلية للفترة ${i+1}`,sym:`C_${i+1}`,unit:'h',value:p[1],step:'any',min:0})});
  return {title:o.title,ref:'إضافة من خارج الكتاب — مبني على جدول ص 34',q:o.q,given,
   solve:(g)=>{const S_=[];let D=0,Db=0;const terms=[],tb=[];
     for(let i=1;i<=n;i++){const L=g['L'+i],C=g['C'+i],T=Tof(L);
       if(T==null)return [{t:`المستوى <span class="ltr">${L} dB</span> غير موجود في جدول ص 34. استعمل أحد مستويات الجدول: <span class="ltr">90، 92، 95، 97، 100، 102، 105، 107، 110، 115</span>.`}];
       if(!(C>=0))return [{t:'المدة يجب أن تكون صفراً أو أكثر.'}];
       S_.push({t:`من جدول ص 34: المدة المسموحة عند <span class="ltr">${L} dB</span> هي`,f:`T_${i}`,v:T,unit:'h'});
       D+=C/T;Db+=C>0?T/C:0;terms.push(`\\frac{${C}}{${T}}`);if(C>0)tb.push(`\\frac{${T}}{${C}}`)}
     S_.push({t:'معامل التعرض = مجموع (المدة الفعلية ÷ المدة المسموحة) لكل فترة:',f:`D=${terms.join('+')}`,v:B.round(D,2),dp:2});
     S_.push({t:'نسبة الجرعة اليومية:',f:'D\\times 100\\%',v:B.round(D*100,1),unit:'%',dp:1});
     S_.push({t:D>1+1e-9?'المعامل أكبر من الواحد الصحيح ← <b>التعرض أكثر من الحد المسموح به</b>؛ يلزم تقليل مدة التعرض أو الضوضاء، أو استعمال واقي الأذن.':D<1-1e-9?'المعامل أقل من الواحد الصحيح ← <b>التعرض أقل من الحد المسموح به</b>.':'المعامل يساوي الواحد الصحيح ← التعرض عند الحد المسموح به تماماً.',v:B.round(D,2),dp:2,final:true});
     if(tb.length)S_.push({t:'للمقارنة فقط (خطأ): لو طبّقنا القانون المقلوب المطبوع في ص 34 (المسموحة ÷ الفعلية):',f:`${tb.join('+')}`,v:B.round(Db,2),dp:2});
     return S_},note:o.note}}

B.lesson({
 id:'u3-l2',unit:3,order:2,pages:'31–36',
 title:'وقاية الأذن وبرنامج حماية السمع',
 summary:'متى يلبس العامل واقي الأذن، والفرق بين الأغطية والسدادات، وتركيب الأذن، والحد المسموح من الضوضاء ومعامل التعرض، وبرنامج حماية القوى السمعية.',
 stations:[
  {intro:true},

  {st:1,short:'واقي الأذن',title:'3-3-3 واقي الأذن (<span class="ltr">Ear Protection</span>)',ref:'ص 31',
   q:'الضوضاء لا تؤلم في البداية… فكيف تسرق السمع دون أن يشعر العامل؟',
   art:(()=>{const {art,nest,hot,tx,D,P,C}=U3S;let s='';
    s+=`<g data-tip="مصدر الضوضاء في مكان العمل (آلة)."><rect x="40" y="150" width="78" height="72" rx="8" fill="#9aa5a0" stroke="${D}" stroke-width="2.5"/><circle cx="79" cy="186" r="20" fill="${P}" stroke="${D}" stroke-width="2.5"/><circle cx="79" cy="186" r="6" fill="${D}"/>${[0,1,2].map(i=>`<path d="M${128+i*12} ${166-i*6}Q${138+i*14} 186 ${128+i*12} ${206+i*6}" fill="none" stroke="${C.coral}" stroke-width="3" stroke-linecap="round"/>`).join('')}</g>`;
    s+=`<g data-tip="مسئول قسم السلامة والصحة المهنية يقيس درجة الضوضاء في مكان العمل، وعلى ضوء نتائج القياس يتم اختيار المعدة المناسبة لوقاية الأذن."><rect x="160" y="72" width="44" height="168" rx="10" fill="${P}" stroke="${D}" stroke-width="2.5"/><rect x="170" y="84" width="24" height="144" rx="5" fill="#E3E7EA"/><rect x="170" y="150" width="24" height="78" rx="5" fill="${C.teal}"/><rect x="170" y="98" width="24" height="52" fill="${C.coral}"/><path d="M164 150H200" stroke="${D}" stroke-width="3"/></g>`;
    s+=tx(182,62,'dB',{fs:13,mono:1,w:700})+`<g data-tip="⟦85⟧ ديسيبل: فوقها يجب على جميع العاملين ارتداء معدات وقاية الأذن (ص 31).">${tx(226,155,'85',{fs:14,mono:1,w:700,a:'start'})}<rect x="204" y="138" width="36" height="24" fill="transparent"/></g>`;
    const w=workerSVG(new Set(['muffs','helmet']),{lbl:'رأس عامل يلبس أغطية الأذن'});
    s+=`<g data-tip="العامل في مكان تزيد ضوضاؤه عن ⟦85⟧ ديسيبل يلبس واقي الأذن حتى لا يفقد حساسية السمع تدريجياً.">${nest(w,232,92,118,118,{vb:'66 10 108 108',clip:1})}</g>`;
    s+=tx(180,284,'فوق 85 ديسيبل: واقي الأذن واجب',{fs:14,w:700});
    return art('آلة تصدر ضوضاء، ومقياس عليه حد 85 ديسيبل، وعامل يلبس أغطية الأذن',C.mint,s)})(),
   cap:'المقياس: الجزء الأحمر فوق الحد. الرقم من ص 31.<br><b>مرّر المؤشر على الآلة والمقياس والرقم والعامل (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'لماذا يصر الكتاب على واقي الأذن ما دام العامل لا يشعر بألم؟',opts:[
     ['لأن فقد حساسية السمع يحدث تدريجياً مع طول فترة التعرض',true,'«حتى لا يتعرضوا لفقد حساسية السمع لديهم تدريجياً مع طول فترة التعرض… حتى يمكن أن يصلوا إلى درجة يفقدون فيها سمعهم نهائياً» (ص 31).'],
     ['لأن الواقي يمنع الصداع فقط',false,'الكتاب يتحدث عن فقد السمع، لا الصداع.'],
     ['لأن الضوضاء تؤلم من أول يوم',false,'عدم الشعور بالألم هو سبب الخطر: الضرر يتراكم بصمت.']]}}
   ],
   body:[
    {book:`<p><b>3-3-3 واقي الأذن <span class="ltr">Ear Protection</span>:</b> يجب على جميع العاملين الذين يعملون في أماكن عالية الضوضاء وتزيد شدتها عن <span class="ltr">85</span> ديسيبل ارتداء معدات وقاية الأذن حتى لا يتعرضوا لفقد حساسية السمع لديهم تدريجياً مع طول فترة التعرض لهذه الضوضاء حتى يمكن أن يصلوا إلى درجة يفقدون فيها سمعهم نهائياً.</p>
     <p>يقوم مسئول قسم السلامة والصحة المهنية بقياس درجة الضوضاء في مكان العمل وعلى ضوء نتائج القياس يتم اختيار المعدة المناسبة لوقاية الأذن.</p>`,ref:'ص 31'},
    {tip:`<p>الترتيب في الكتاب: <b>قياس أولاً</b> ثم اختيار الواقي. لا يُختار الواقي بالتخمين، بل على ضوء نتيجة القياس.</p>`,title:'القياس قبل الواقي'},
    {title:'مختبر مصغّر: هل يلزم واقي الأذن؟',widget:(el,B)=>DCML.lab(el,B,{intro:'حرّك شدة الضوضاء في مكان العمل (أرقام تختارها أنت)، والحد من الكتاب.',
     predict:{q:'قيس مكان العمل فكانت الضوضاء <span class="ltr">88 dB</span>. هل يجب ارتداء واقي الأذن؟',opts:[['لا، لأنها أقل من <span class="ltr">90 dB</span>',false,'الـ <span class="ltr">90 dB</span> حد التعرض 8 ساعات (ص 34)، أما وجوب الواقي فيبدأ فوق <span class="ltr">85 dB</span>.'],['نعم، لأنها تزيد عن <span class="ltr">85 dB</span>',true,'«…وتزيد شدتها عن 85 ديسيبل ارتداء معدات وقاية الأذن» (ص 31).']]},
     ins:[{k:'L',l:'شدة الضوضاء في المكان',u:'dB',min:70,max:130,step:1,v:80,dp:0}],
     calc:s=>{const on=s.L>85;return {facts:[['الشدة المقيسة',s.L+' dB',on?'bad':''],['الحد في الكتاب','85 dB'],['واقي الأذن',on?'واجب':'غير واجب',on?'bad':'hi']],bars:[{l:'الشدة',v:s.L,max:130,txt:s.L+' dB',col:on?'--stop':'--on'}],msg:on?'الشدة تزيد عن <span class="ltr">85 dB</span>: يجب ارتداء معدات وقاية الأذن، ويُختار نوعها على ضوء نتيجة القياس (ص 31).':'الشدة لا تزيد عن <span class="ltr">85 dB</span>، فلا يوجب الكتاب واقي الأذن هنا.',cls:on?'warn':''}}})}
   ]},

  {st:2,short:'معدات وقاية الأذن',title:'أ- معدات وقاية الأذن',ref:'ص 31',
   q:'واقيان للأذن متشابهان في الشكل… كيف تعرف أيهما يخفض الضوضاء أكثر؟',
   art:(()=>{const {art,nest,tx,D,P,C}=U3S;let s='';
    s+=`<g data-tip="ضوضاء مكان العمل قبل الواقي: شدتها عالية.">${[0,1,2,3].map(i=>`<path d="M${46+i*16} ${120-i*10}Q${62+i*18} 160 ${46+i*16} ${200+i*10}" fill="none" stroke="${C.coral}" stroke-width="4" stroke-linecap="round"/>`).join('')}</g>`;
    s+=`<g data-tip="معدة وقاية الأذن: تخفض درجة الضوضاء إلى حد أقل من الحد المسموح التعرض له.">${nest(icon('muffs',60),126,92,120,120)}</g>`;
    s+=`<g data-tip="بعد الواقي: الضوضاء التي تصل إلى الأذن أقل.">${[0,1].map(i=>`<path d="M${262+i*14} ${140-i*4}Q${270+i*14} 160 ${262+i*14} ${180+i*4}" fill="none" stroke="${C.teal}" stroke-width="3" stroke-linecap="round"/>`).join('')}</g>`;
    s+=`<g data-tip="«ويكتب على كل معدة منها قيمة التخفيض في شدة الضوضاء التي يمكنها أن تخفضها» (ص 31)."><path d="M186 214L196 236" stroke="${D}" stroke-width="2"/><rect x="132" y="236" width="128" height="36" rx="8" fill="${P}" stroke="${D}" stroke-width="2.5"/>${tx(196,259,'قيمة التخفيض',{fs:13,w:700})}</g>`;
    s+=tx(80,240,'قبل',{fs:13,w:700})+tx(282,240,'بعد',{fs:13,w:700});
    return art('ضوضاء عالية قبل واقي الأذن وأقل بعده، وبطاقة قيمة التخفيض المكتوبة على الواقي',C.lilac,s)})(),
   cap:'الواقي يخفض الضوضاء، ومقدار التخفيض مكتوب عليه.<br><b>مرّر المؤشر على الموجات والواقي والبطاقة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'ما الهدف من معدة وقاية الأذن حسب الكتاب؟',opts:[
     ['أن تمنع الصوت تماماً فلا يسمع العامل شيئاً',false,'الكتاب يقول «تخفيض» إلى حد أقل من المسموح، لا منع الصوت تماماً.'],
     ['أن تخفض الضوضاء إلى حد أقل من الحد المسموح التعرض له',true,'«تقوم بتخفيض درجة الضوضاء في مكان العمل إلى حد أقل من الحد المسموح التعرض له» (ص 31).'],
     ['أن تقيس الضوضاء في مكان العمل',false,'القياس عمل مسئول السلامة بجهاز قياس، لا عمل الواقي.']]}}
   ],
   body:[
    {book:`<p><b>أ- معدات وقاية الأذن:</b> مهمات الوقاية الخاصة بالأذن تقوم بتخفيض درجة الضوضاء في مكان العمل إلى حد أقل من الحد المسموح التعرض له، ويكتب على كل معدة منها قيمة التخفيض في شدة الضوضاء التي يمكنها أن تخفضها.</p>`,ref:'ص 31'},
    {add:`<p>على عبوات واقيات الأذن في الأسواق يُكتب غالباً رقم التخفيض بالديسيبل مع الحروف <span class="ltr">NRR</span> أو <span class="ltr">SNR</span>؛ هذا هو «قيمة التخفيض» التي يذكرها الكتاب.</p>`,title:'أين تجد قيمة التخفيض؟'},
    {title:'تحقق سريع',widget:(el,B)=>DCML.tf(el,B,{intro:'احكم على كل عبارة بحسب نص ص 31.',items:[
 ['قيمة التخفيض مكتوبة على كل معدة من معدات وقاية الأذن.',true,'«ويكتب على كل معدة منها قيمة التخفيض في شدة الضوضاء».'],
 ['يُختار واقي الأذن قبل قياس الضوضاء في المكان.',false,'«على ضوء نتائج القياس يتم اختيار المعدة المناسبة لوقاية الأذن».'],
 ['الغرض من الواقي أن تصل الضوضاء إلى الأذن أقل من الحد المسموح.',true,'«…إلى حد أقل من الحد المسموح التعرض له».']]})}
   ]},

  {st:3,short:'أغطية الأذن',title:'ب- أغطية الأذن (<span class="ltr">Ear Muffs</span>)',ref:'ص 32',
   q:'غطاء يحيط بالأذن من الخارج… متى يكفي، ومتى لا يكفي؟',
   art:(()=>{const {art,nest,tx,card,D,C}=U3S;let s='';
    s+=`<g data-tip="أغطية الأذن ⟦Ear Muffs⟧: تغطي الأذن الخارجية وتكون حاجزاً للصوت (الشكل ⟦3-6-أ⟧).">${nest(icon('muffs',60),104,34,152,152)}</g>`;
    s+=`<g data-tip="مقدار التخفيض: تقلل شدة الضوضاء في حدود ⟦15 – 35⟧ ديسيبل (ص 32).">${card(190,196,130,62,{fill:'#FBF6EE'})}${tx(255,220,'تخفّض',{fs:13,w:700})}${tx(255,244,'15 – 35 dB',{fs:13,mono:1,w:700})}</g>`;
    s+=`<g data-tip="مجال الاستعمال: عندما تكون شدة الضوضاء في مكان العمل من ⟦90⟧ إلى ⟦120⟧ ديسيبل (ص 32).">${card(40,196,130,62,{fill:'#FBF6EE'})}${tx(105,220,'تُستعمل عند',{fs:13,w:700})}${tx(105,244,'90 – 120 dB',{fs:13,mono:1,w:700})}</g>`;
    return art('أغطية الأذن، وبطاقتان: تخفض 15–35 ديسيبل، وتستعمل عند 90–120 ديسيبل',C.sand,s+tx(180,292,'Ear Muffs',{fs:13,mono:1,w:700}))})(),
   cap:'رسم مبسّط عن الشكل <span class="ltr">(3-6-أ)</span>؛ الأرقام من ص 32.<br><b>مرّر المؤشر على الغطاء والبطاقتين (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'مكان عمل ضوضاؤه <span class="ltr">125 dB</span>. هل تكفي أغطية الأذن وحدها حسب الكتاب؟',opts:[
     ['نعم، لأنها تخفض حتى <span class="ltr">35 dB</span>',false,'الكتاب يحدد مجال استعمالها من <span class="ltr">90</span> إلى <span class="ltr">120 dB</span> فقط.'],
     ['لا، لأن الكتاب يستعملها حتى <span class="ltr">120 dB</span> فقط',true,'«وتستعمل عندما تكون شدة الضوضاء في مكان العمل من 90 إلى 120 ديسيبل» (ص 32). وسترى في المحطة التالية ماذا يُلبس فوق ذلك.']]}}
   ],
   body:[
    {book:`<p><b>ب- أغطية الأذن <span class="ltr">Ear Muffs</span>:</b> تغطي الأذن الخارجية وتكون حاجزاً للصوت وهي توفر حماية للأذن من خطر التعرض للضوضاء العالية حيث تقوم بتقليل شدة الضوضاء في حدود <span class="ltr">15 – 35</span> ديسيبل، وتستعمل عندما تكون شدة الضوضاء في مكان العمل من <span class="ltr">90</span> إلى <span class="ltr">120</span> ديسيبل (شكل <span class="ltr">3-6-أ</span>).</p>`,ref:'ص 32'},
    {tip:`<p>رقمان لا تخلط بينهما: <b>مقدار التخفيض</b> (<span class="ltr">15–35 dB</span>) هو ما يطرحه الغطاء من الضوضاء، و<b>مجال الاستعمال</b> (<span class="ltr">90–120 dB</span>) هو شدة الضوضاء في المكان التي يُستعمل فيها.</p>`,title:'رقمان مختلفان'},
    {title:'تحقق سريع: أغطية الأذن',widget:(el,B)=>DCML.tf(el,B,{intro:'احكم بحسب ص 32.',items:[
 ['أغطية الأذن توضع داخل قناة الأذن.',false,'«تغطي الأذن الخارجية»؛ التي توضع داخل القناة هي السدادات.'],
 ['تقلل أغطية الأذن شدة الضوضاء في حدود <span class="ltr">15 – 35</span> ديسيبل.',true,'هذا نص الكتاب، وهو أيضاً العبارة 6 في أسئلة الوحدة.'],
 ['تستعمل أغطية الأذن عندما تكون الضوضاء من <span class="ltr">90</span> إلى <span class="ltr">120</span> ديسيبل.',true,'نص ص 32.']]})}
   ]},

  {st:4,short:'سدادات الأذن',title:'ج- سدادات الأذن (<span class="ltr">Ear Plugs</span>)',ref:'ص 32',
   q:'سدادة صغيرة داخل الأذن… وماذا لو كانت الضوضاء أشد من أن تكفيها السدادة أو الغطاء وحده؟',
   art:(()=>{const {art,nest,hot,tx,card,D,C}=U3S;let s='';
    s+=nest(fig36(),14,56,332,103,{extra:hot(4,4,176,172,'(أ) أغطية الأذن ⟦Earmuffs⟧.')+hot(186,4,214,172,'(ب) سدادات الأذن: من ⟦PVC⟧ (حمراء) وإسفنجية ⟦Foam⟧ (صفراء).')+hot(440,4,136,172,'(ج) سدادات أذن بطوق.')});
    s+=`<g data-tip="سدادات الأذن: تقلل الضوضاء ⟦20 – 30⟧ ديسيبل، وتستعمل عندما تكون الشدة ⟦85 – 115⟧ ديسيبل.">${card(190,184,140,74)}${tx(260,204,'السدادات',{fs:13,w:700})}${tx(260,224,'−20…30 dB',{fs:12,mono:1})}${tx(260,246,'85 – 115 dB',{fs:12,mono:1})}</g>`;
    s+=`<g data-tip="السدادات مع الأغطية معاً: في الأماكن التي قد تصل ضوضاؤها إلى ⟦130⟧ ديسيبل، ويقل الضوضاء بحدود ⟦50⟧ ديسيبل.">${card(30,184,140,74)}${tx(100,204,'السدادات + الأغطية',{fs:12.5,w:700})}${tx(100,224,'≈ −50 dB',{fs:12,mono:1})}${tx(100,246,'130 dB',{fs:12,mono:1})}</g>`;
    s+=tx(180,286,'السطر الأوسط: التخفيض · الأخير: شدة الاستعمال',{fs:11.5});
    return art('أغطية الأذن والسدادات، وبطاقتان: السدادات تخفض 20–30 ديسيبل للشدة 85–115، ومعاً بحدود 50 ديسيبل حتى 130',C.peach,s)})(),
   cap:'رسم مبسّط عن الشكل <span class="ltr">(3-6)</span> بأجزائه أ، ب، ج؛ الأرقام من ص 32.<br><b>مرّر المؤشر على الصور والبطاقتين (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'مكان عمل قد تصل ضوضاؤه إلى <span class="ltr">130 dB</span>. ماذا يلبس العامل حسب الكتاب؟',opts:[
     ['سدادات الأذن فقط',false,'السدادات تُستعمل حتى <span class="ltr">115 dB</span>.'],
     ['سدادات الأذن مع أغطية الأذن معاً',true,'«قد تصل إلى 130 ديسيبل يتم ارتداء سدادات الأذن مع أغطية الأذن حيث يتم تقليل الضوضاء في هذه الحالة بحدود 50 ديسيبل» (ص 32).'],
     ['أغطية الأذن فقط',false,'الأغطية تُستعمل حتى <span class="ltr">120 dB</span>.']]}}
   ],
   body:[
    {book:`<p><b>ج- سدادات الأذن <span class="ltr">Ear Plugs</span>:</b> توضع داخل قناة الأذن وتصنع من البلاستيك أو المطاط ويمكنها تقليل الضوضاء التي تصل إلى الأذن في حدود <span class="ltr">20 – 30</span> ديسيبل وتستعمل في الأماكن التي تبلغ فيها شدة الضوضاء من <span class="ltr">85 – 115</span> ديسيبل (شكل <span class="ltr">3-6-ب</span>، <span class="ltr">3-6-ج</span>).</p>
     <p>في بعض الأماكن التي تكون فيها شدة الضوضاء عالية جداً قد تصل إلى <span class="ltr">130</span> ديسيبل يتم ارتداء سدادات الأذن مع أغطية الأذن حيث يتم تقليل الضوضاء في هذه الحالة بحدود <span class="ltr">50</span> ديسيبل.</p>`,ref:'ص 32'},
    {watch:`<p>إحالة السدادات في الكتاب «(شكل ٦-٣-أ-ب-ج)» تشمل «أ» وهي أغطية الأذن، فكتبناها «ب، ج».</p>`,fix:true},
    {html:`<div class="tablebox"><table class="tt"><thead><tr><th>الوسيلة</th><th>مقدار التخفيض</th><th>شدة الضوضاء التي تستعمل فيها</th></tr></thead><tbody>
     <tr><td>أغطية الأذن <span class="ltr">Ear Muffs</span></td><td><span class="ltr">15 – 35 dB</span></td><td><span class="ltr">90 – 120 dB</span></td></tr>
     <tr><td>سدادات الأذن <span class="ltr">Ear Plugs</span></td><td><span class="ltr">20 – 30 dB</span></td><td><span class="ltr">85 – 115 dB</span></td></tr>
     <tr><td>السدادات مع الأغطية معاً</td><td>بحدود <span class="ltr">50 dB</span></td><td>حتى <span class="ltr">130 dB</span></td></tr></tbody></table></div><p class="sub">جدول ملخص من نص الكتاب (ص 32).</p>`},
    {title:'مختبر مصغّر: أي واقٍ يذكره الكتاب؟',widget:(el,B)=>DCML.sort(el,B,{intro:'شدة الضوضاء في كل مكان من اختيارنا، والمجالات من جدول ص 32. اختر الواقي الذي يقع المكان في مجال استعماله وحده.',cats:['السدادات','الأغطية','الاثنان معاً'],items:[
 ['ضوضاء المكان <span class="ltr">87 dB</span>.',0,'السدادات تُستعمل من <span class="ltr">85</span> إلى <span class="ltr">115 dB</span>، أما الأغطية فتبدأ من <span class="ltr">90 dB</span>.'],
 ['ضوضاء المكان <span class="ltr">118 dB</span>.',1,'الأغطية حتى <span class="ltr">120 dB</span>، والسدادات حتى <span class="ltr">115 dB</span> فقط.'],
 ['ضوضاء المكان <span class="ltr">128 dB</span>.',2,'فوق مجال الأغطية <span class="ltr">(120)</span> والسدادات <span class="ltr">(115)</span>؛ الكتاب يذكر الاثنين معاً للأماكن التي قد تصل إلى <span class="ltr">130 dB</span>.']]})},
    {tip:`<p>في تبويب «المختبر» لوحة «هل يكفي واقي الأذن؟»: غيّر الشدة وجرّب كل واقٍ.</p>`}
   ]},

  {st:5,short:'الضوضاء',title:'3-3-4 برنامج حماية القوى السمعية (<span class="ltr">OSHA Hearing Conservation Program</span>)',ref:'ص 32',
   q:'صوت الموسيقى الذي تحبه قد يكون ضوضاء لغيرك… فما الضوضاء أصلاً؟',
   art:(()=>{const {art,tx,D,P,C}=U3S;let s='';
    const wv=(x,y)=>[0,1,2].map(i=>`<path d="M${x+i*9} ${y-8-i*4}Q${x+6+i*10} ${y} ${x+i*9} ${y+8+i*4}" fill="none" stroke="${C.coral}" stroke-width="2.6" stroke-linecap="round"/>`).join('');
    s+=`<g data-tip="في المنزل: نتعرض للضوضاء بصفة مستمرة (ص 32)."><rect x="236" y="70" width="90" height="76" rx="10" fill="${P}" stroke="${D}" stroke-width="2.5"/><path d="M252 112L281 88L310 112V136H252Z" fill="${C.yellow}" stroke="${D}" stroke-width="2.2" stroke-linejoin="round"/><rect x="274" y="118" width="14" height="18" fill="${D}"/>${wv(298,100)}</g>`;
    s+=`<g data-tip="في الطريق: أصوات السيارات والمركبات."><rect x="34" y="70" width="90" height="76" rx="10" fill="${P}" stroke="${D}" stroke-width="2.5"/><path d="M48 122H110V108L98 96H62L54 108H48Z" fill="${C.teal}" stroke="${D}" stroke-width="2.2" stroke-linejoin="round"/><circle cx="64" cy="124" r="7" fill="${D}"/><circle cx="96" cy="124" r="7" fill="${D}"/>${wv(110,92)}</g>`;
    s+=`<g data-tip="في مواقع العمل: التعرض للضوضاء من أكثر مسببات المخاطر الصحية في المواقع الصناعية."><rect x="120" y="164" width="120" height="86" rx="10" fill="${P}" stroke="${D}" stroke-width="2.5"/><path d="M138 236V196L158 182V196L178 182V196L198 182V236Z" fill="${C.coral}" stroke="${D}" stroke-width="2.2" stroke-linejoin="round"/><rect x="186" y="170" width="10" height="26" fill="${D}"/>${wv(206,214)}</g>`;
    s+=tx(281,164,'المنزل',{fs:13,w:700})+tx(79,164,'الطريق',{fs:13,w:700})+tx(180,270,'مواقع العمل',{fs:13,w:700});
    return art('ضوضاء في المنزل والطريق ومواقع العمل',C.lilac,s+tx(180,296,'الضوضاء = صوت غير مرغوب فيه',{fs:13.5,w:700}))})(),
   cap:'ثلاثة أماكن يذكرها الكتاب نتعرض فيها للضوضاء.<br><b>مرّر المؤشر على كل مكان (أو المسه في الجوال) لتقرأ ما يخصه.</b>',
   side:[
    {predict:{q:'كيف يعرّف الكتاب الضوضاء؟',opts:[
     ['كل صوت أعلى من <span class="ltr">90 dB</span>',false,'هذا حد التعرض في ص 34، لا تعريف الضوضاء.'],
     ['صوت الآلات فقط',false,'الكتاب يذكر المنزل والطريق أيضاً.'],
     ['الصوت غير المرغوب فيه',true,'«وتعرف الضوضاء بأنها الصوت غير المرغوب فيه والذي نتعرض له بصفة مستمرة في المنزل، في الطريق وفي مواقع العمل المختلفة» (ص 32).']]}}
   ],
   body:[
    {book:`<p><b>3-3-4 برنامج حماية القوى السمعية <span class="ltr">OSHA Hearing Conservation Program</span>:</b> يعتبر التعرض للضوضاء من أكثر مسببات المخاطر الصحية التي يتعرض لها العاملون في المواقع الصناعية، وتعرف الضوضاء بأنها الصوت غير المرغوب فيه والذي نتعرض له بصفة مستمرة في المنزل، في الطريق وفي مواقع العمل المختلفة.</p>`,ref:'ص 32'},
    {tip:`<p>هذا القسم من الكتاب (حتى ص 36) يبني «برنامجاً» كاملاً: نعرف الأذن (المحطة 6)، ثم كيف يُقاس الصوت (7)، ثم الحد المسموح (8)، ثم خطوات البرنامج: القياس والفحص الطبي (9).</p>`,title:'خريطة القسم'},
    {title:'تحقق سريع',widget:(el,B)=>DCML.tf(el,B,{intro:'احكم بحسب نص ص 32.',items:[
 ['الضوضاء موجودة في مواقع العمل فقط.',false,'«نتعرض له بصفة مستمرة في المنزل، في الطريق وفي مواقع العمل المختلفة».'],
 ['التعرض للضوضاء من أكثر مسببات المخاطر الصحية للعاملين في المواقع الصناعية.',true,'نص أول جملة في القسم.']]})}
   ]},

  {st:6,short:'الأذن البشرية',title:'1- الأذن البشرية',ref:'ص 33–34',
   q:'الصوت يدخل من الصيوان… فأين بالضبط يحدث التلف الذي لا علاج له؟',
   art:(()=>{const {art,nest,hot,tx,C}=U3S;
    const ex=hot(14,30,110,232,'الأذن الخارجية: تجمع الموجات الصوتية وتنقلها خلال القناة السمعية إلى طبلة الأذن.')+hot(240,40,90,180,'الأذن الوسطى: طبلة الأذن ثم العظيمات الثلاث (المطرقة، السندان، الركاب).')+hot(330,30,180,180,'الأذن الداخلية: القنوات الدائرية والقوقعة («إنسان الأذن») وفيها الشعيرات الدقيقة التي تتلف من الضوضاء، ثم العصب السمعي إلى المخ.');
    return art('مقطع في الأذن البشرية بأجزائها الثلاثة',C.mint,nest(earSVG('',true),12,62,336,197,{extra:ex})+tx(180,48,'الخارجية ← الوسطى ← الداخلية',{fs:13,w:700})+tx(180,286,'رسم مبسّط عن الشكل',{fs:12})+`<text x="180" y="304" text-anchor="middle" font-size="12" fill="#2C4A40" font-family="var(--mono)">(3-7)</text>`)})(),
   cap:'الأسماء على الرسم إضافة منا (الشكل في الكتاب بلا كتابة).<br><b>مرّر المؤشر على الأذن الخارجية والوسطى والداخلية (أو المسها في الجوال) لتعرف عمل كل منها.</b>',
   side:[
    {predict:{q:'أين يحدث تلف السمع من التعرض للضوضاء لفترات طويلة؟',opts:[
     ['في صيوان الأذن',false,'الصيوان يجمع الموجات فقط.'],
     ['في الشعيرات الدقيقة داخل القوقعة («إنسان الأذن»)',true,'«وهذه الشعيرات هي التي تتعرض للتلف من جراء التعرض للضوضاء لفترات طويلة… الأمر الذي لا علاج له» (ص 33–34).'],
     ['في طبلة الأذن فقط',false,'الكتاب يحدد الشعيرات الدقيقة في الأذن الداخلية.']]}}
   ],
   body:[
    {book:`<p><b>1- الأذن البشرية:</b> تتكون الأذن البشرية من ثلاثة أجزاء، هي الأذن الخارجية، الأذن الوسطى، الأذن الداخلية (شكل <span class="ltr">3-7</span>).</p>
     <p><b>أ- الأذن الخارجية:</b> تقوم بتجميع الموجات الصوتية (ذبذبات الصوت) ونقلها خلال القناة السمعية إلى طبلة الأذن.</p>
     <p><b>ب- الأذن الوسطى:</b> تتكون من ثلاثة أجزاء هي: المطرقة والركاب والسندان. حيث تتصل المطرقة بطبلة الأذن ويتصل السندان بالأذن الداخلية. تقوم طبلة الأذن بنقل ذبذبات الصوت إلى المطرقة والركاب والسندان والتي بدورها تنقلها إلى الأذن الداخلية.</p>
     <p><b>ج- الأذن الداخلية:</b> تتكون من قنوات دائرية وإنسان الأذن الذي يتصل بدوره بالعصب السمعي (الذي يقوم بنقل نبضات الصوت إلى المخ). يحتوي إنسان الأذن على عدد كبير جداً من الشعيرات الدقيقة جداً وهي التي تتصل بالمخ. وهذه الشعيرات هي التي تتعرض للتلف من جراء التعرض للضوضاء لفترات طويلة (ويحدث ذلك بدون أن يشعر الشخص به) حتى نصل إلى مرحلة يفقد الإنسان فيها سمعه تماماً، الأمر الذي لا علاج له.</p>`,ref:'ص 33–34'},
    {watch:`<p>يقول الكتاب إن الأذن الوسطى «المطرقة والركاب والسندان» وإن «السندان يتصل بالأذن الداخلية». الصحيح علمياً أن ترتيب العظيمات من الطبلة إلى الداخل: <b>المطرقة ← السندان ← الركاب</b>، و<b>الركاب</b> (لا السندان) هو المتصل بالأذن الداخلية. و«إنسان الأذن» المقصود به <b>القوقعة</b>. الرسم والتمرين هنا بالترتيب الصحيح.</p>`,fix:true},
    {title:'الشكل (3-7) تفاعلياً: اضغط أي جزء',widget:(el)=>earWidget(el)},
    {title:'مختبر مصغّر: رتّب مسار الصوت',widget:(el,B)=>DCML.order(el,B,{intro:'اضغط أجزاء الأذن بالترتيب الذي يمر به الصوت، من الخارج إلى المخ (بالترتيب العلمي الصحيح للعظيمات).',steps:[
 ['صيوان الأذن','الصوت يبدأ من الأذن الخارجية التي تجمع الموجات.'],
 ['القناة السمعية','بعد الصيوان تنتقل الموجات خلال القناة إلى الطبلة.'],
 ['طبلة الأذن','الطبلة نهاية القناة السمعية وأول الأذن الوسطى.'],
 ['المطرقة','«تتصل المطرقة بطبلة الأذن».'],
 ['السندان','السندان بين المطرقة والركاب.'],
 ['الركاب','الركاب آخر العظيمات، وهو المتصل بالأذن الداخلية.'],
 ['القوقعة («إنسان الأذن») وشعيراتها','بعد العظيمات يصل الاهتزاز إلى الأذن الداخلية.'],
 ['العصب السمعي إلى المخ','العصب «يقوم بنقل نبضات الصوت إلى المخ».']],done:'والشعيرات في القوقعة هي التي تتلف من الضوضاء، دون أن يشعر الشخص.'})}
   ]},

  {st:7,short:'قياسات الصوت',title:'2- قياسات الصوت',ref:'ص 34',
   q:'رقمان قريبان: <span class="ltr">85</span> و<span class="ltr">90</span> ديسيبل… ما الفرق بينهما؟',
   art:(()=>{const {art,tx,card,D,P,C}=U3S;let s='';
    s+=`<rect x="40" y="128" width="280" height="26" rx="13" fill="#E3E7EA" stroke="${D}" stroke-width="2"/><rect x="40" y="128" width="150" height="26" rx="13" fill="${C.teal}"/><rect x="176" y="128" width="40" height="26" fill="${C.yellow}"/><rect x="216" y="128" width="104" height="26" rx="13" fill="${C.coral}"/><rect x="216" y="128" width="20" height="26" fill="${C.coral}"/>`;
    s+=`<g data-tip="⟦85⟧ ديسيبل: «الحد الواجب البدء باتخاذ خطوات لحماية القوى السمعية للعاملين عند بلوغه»."><path d="M176 112V170" stroke="${D}" stroke-width="3"/><rect x="156" y="78" width="40" height="96" fill="transparent"/>${tx(176,104,'85',{fs:15,mono:1,w:700})}</g>`;
    s+=`<g data-tip="⟦90⟧ ديسيبل: الحد المسموح التعرض له لمدة ⟦8⟧ ساعات باليوم، خمسة أيام بالأسبوع، بدون ضرر."><path d="M216 112V170" stroke="${D}" stroke-width="3"/><rect x="200" y="78" width="40" height="96" fill="transparent"/>${tx(220,104,'90',{fs:15,mono:1,w:700})}</g>`;
    s+=tx(330,148,'dB',{fs:12,mono:1,a:'start'});
    s+=`<g data-tip="الحد المسموح ⟦90⟧ ديسيبل محسوب ليوم عمل ⟦8⟧ ساعات.">${card(196,200,112,70)}<circle cx="226" cy="235" r="18" fill="${P}" stroke="${D}" stroke-width="2.5"/><path d="M226 235V223M226 235L235 240" stroke="${D}" stroke-width="2.5" stroke-linecap="round"/>${tx(278,242,'8 h',{fs:16,mono:1,w:700})}</g>`;
    s+=`<g data-tip="…لمدة خمسة أيام بالأسبوع.">${card(52,200,112,70)}<rect x="66" y="218" width="36" height="34" rx="4" fill="${P}" stroke="${D}" stroke-width="2.5"/><path d="M66 228H102" stroke="${C.coral}" stroke-width="5"/>${tx(132,234,'5',{fs:16,mono:1,w:700})}${tx(132,254,'أيام',{fs:12})}</g>`;
    s+=tx(108,192,'بدء الحماية',{fs:12,w:700})+tx(262,192,'الحد المسموح',{fs:12,w:700});
    return art('مسطرة ديسيبل عليها 85 (بدء خطوات الحماية) و90 (الحد المسموح لـ 8 ساعات يومياً، 5 أيام بالأسبوع)',C.sand,s+tx(180,58,'الديسيبل (dB): وحدة لوغاريتمية',{fs:13,w:700}))})(),
   cap:'رقما ص 34 على مسطرة واحدة؛ الألوان للتوضيح فقط.<br><b>مرّر المؤشر على الرقمين والبطاقتين (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'عند أي مستوى يجب البدء باتخاذ خطوات لحماية القوى السمعية للعاملين؟',opts:[
     ['<span class="ltr">85 dB</span>',true,'«كما تعتبر أن 85 ديسيبل هو الحد الواجب البدء باتخاذ خطوات لحماية القوى السمعية للعاملين عند بلوغه» (ص 34).'],
     ['<span class="ltr">90 dB</span>',false,'<span class="ltr">90 dB</span> هو الحد المسموح لـ 8 ساعات؛ الحماية تبدأ قبله.'],
     ['<span class="ltr">130 dB</span>',false,'هذه أعلى شدة يذكرها الكتاب للسدادات مع الأغطية.']]}}
   ],
   body:[
    {book:`<p><b>2- قياسات الصوت:</b> يتم قياس ضغط الصوت بوحدة تسمى الديسيبل <span class="ltr">(dB)</span> وهي وحدات لوغاريتمية لقياس مستويات ضغط الصوت.</p>
     <p>تنص المواصفات العالمية على اعتبار <span class="ltr">90</span> ديسيبل هو الحد المسموح التعرض له من الضوضاء لمدة 8 ساعات باليوم لمدة خمسة أيام بالأسبوع بدون ضرر، كما تعتبر أن <span class="ltr">85</span> ديسيبل هو الحد الواجب البدء باتخاذ خطوات لحماية القوى السمعية للعاملين عند بلوغه.</p>`,ref:'ص 34'},
    {tip:`<p>«لوغاريتمية» تعني أن الديسيبلات لا تُجمع جمعاً عادياً: زيادة بضع ديسيبلات تعني ضغط صوت أكبر بكثير. لذلك سترى في الجدول التالي أن كل زيادة صغيرة في الديسيبل تقصّر المدة المسموحة كثيراً.</p>`,title:'ماذا تعني «لوغاريتمية»؟'},
    {title:'تحقق سريع: رقما ص 34',widget:(el,B)=>DCML.tf(el,B,{intro:'احكم بحسب نص ص 34.',items:[
 ['<span class="ltr">90 dB</span> مسموح بها 8 ساعات يومياً لمدة خمسة أيام بالأسبوع بدون ضرر.',true,'نص الكتاب.'],
 ['<span class="ltr">85 dB</span> هو الحد المسموح التعرض له 8 ساعات.',false,'<span class="ltr">85</span> حد البدء بخطوات حماية السمع؛ الحد المسموح لـ 8 ساعات <span class="ltr">90</span>.'],
 ['الديسيبل وحدة لوغاريتمية لقياس مستويات ضغط الصوت.',true,'نص الكتاب.']]})}
   ]},

  {st:8,short:'المستويات المسموحة',title:'3- مستويات الضوضاء المسموح بها، ومعامل التعرض',ref:'ص 34–35',
   q:'إذا ارتفعت الضوضاء <span class="ltr">5 dB</span> فقط… كم ساعة تبقى لك في اليوم؟',
   art:(()=>{const {art,tx,D,C}=U3S;let s='';const x0=52,y0=246,sx=26,sy=22;
    s+=`<path d="M${x0-6} ${y0}H330M${x0} ${y0+4}V60" stroke="${D}" stroke-width="2.4" fill="none"/>`;
    NOISE.forEach(([L,T],i)=>{const x=x0+8+i*sx,h=T*sy;s+=`<g data-tip="عند ⟦${L}⟧ ديسيبل: المدة المسموحة ⟦${hrs(T)}⟧ ساعة في اليوم (جدول ص 34)."><rect x="${x}" y="${y0-h}" width="${sx-6}" height="${h}" rx="3" fill="${L<95?C.teal:L<105?C.yellow:C.coral}" stroke="${D}" stroke-width="1.6"/><rect x="${x-2}" y="60" width="${sx-2}" height="${y0-60}" fill="transparent"/></g>`;s+=tx(x+(sx-6)/2,y0+16,String(L),{fs:10,mono:1});if(T>=1)s+=tx(x+(sx-6)/2,y0-h-5,hrs(T),{fs:10.5,mono:1,w:700})});
    s+=tx(x0+4,52,'h',{fs:12,mono:1,w:700})+tx(300,y0+34,'dBA',{fs:12,mono:1,w:700})+tx(188,292,'المدة المسموحة في اليوم',{fs:13,w:700});
    return art('أعمدة جدول ص 34: المدة المسموحة تقصر كلما زاد مستوى الضوضاء، من 8 ساعات عند 90 إلى ربع ساعة عند 115',C.lilac,s)})(),
   cap:'أعمدة جدول ص 34 (الأرقام من الكتاب)؛ الألوان للتوضيح فقط.<br><b>مرّر المؤشر على أي عمود (أو المسه في الجوال) لتقرأ مستواه ومدته.</b>',
   side:[
    {predict:{q:'عامل يقضي 8 ساعات يومياً عند <span class="ltr">95 dB</span>. ماذا يقول جدول ص 34؟',opts:[
     ['مسموح، لأن الفرق عن 90 خمس ديسيبلات فقط',false,'الجدول يسمح عند <span class="ltr">95 dB</span> بـ 4 ساعات فقط.'],
     ['تجاوز الحد: المسموح عند <span class="ltr">95 dB</span> أربع ساعات فقط',true,'من الجدول: <span class="ltr">95 → 4 h</span>؛ والعامل قضى ضعفها.'],
     ['مسموح إذا كانت على فترتين',false,'الفترات تُجمع تأثيراتها (التأثير التراكمي)، فلا يتغير الحكم.']]}}
   ],
   body:[
    {book:`<p><b>3- مستويات الضوضاء المسموح بها مبينة في الجدول التالي:</b></p>${noiseTable()}
     <p>عندما يكون التعرض للضوضاء خلال اليوم على فترات (فترتين أو أكثر بحيث تكون قياسات الضوضاء بها مختلفة) يتم حساب التأثير التراكمي وليس التأثير الفردي لأي منها. ويتم حساب ذلك على النحو التالي:</p>
     <p>معامل التعرض = الفترة الزمنية المقابلة لقياس الضوضاء حسب الجدول أعلاه مقسومة على المدة الفعلية للتعرض (للفترة الأولى) + الفترة الزمنية المقابلة لقياس الضوضاء حسب الجدول أعلاه مقسومة على المدة الفعلية للتعرض (الفترة الثانية) ......... وهكذا</p>
     <p>إذا زاد معامل التعرض عن الواحد الصحيح يكون التعرض أكثر من الحد المسموح به، وإذا قل عن الواحد الصحيح يكون التعرض أقل من الحد المسموح به (<span class="ltr">90</span> ديسيبل).</p>`,ref:'ص 34–35'},
    {html:String.raw`<p>القانون بالرموز (<span class="ltr">C</span> المدة الفعلية للتعرض، و<span class="ltr">T</span> الفترة المسموحة المقابلة للمستوى من الجدول): ${B.bkCtl('noise','القانون:')}</p>
     <div class="bkb" data-bk="noise"><div class="eq">$$\text{معامل التعرض}=\frac{T_1}{C_1}+\frac{T_2}{C_2}+\cdots$$</div></div>
     <div class="bkf blk" data-bk="noise"><div class="eq">$$D=\frac{C_1}{T_1}+\frac{C_2}{T_2}+\cdots$$</div><p>وإذا كان <span class="ltr">D &gt; 1</span> فالتعرض أكثر من الحد المسموح.</p></div>`},
    {watch:`<p>الكتاب قلب الكسر؛ كتب «الفترة المسموحة من الجدول مقسومة على المدة الفعلية». الصحيح (قاعدة <span class="ltr">OSHA 1910.95</span>) أن نقسم <b>المدة الفعلية على المدة المسموحة</b>. بقانون الكتاب ينعكس الحكم: عامل يقضي ساعتين فقط عند <span class="ltr">90 dB</span> يعطي <span class="ltr">8 ÷ 2 = 4</span> فيبدو «متجاوزاً»، وهو في الحقيقة استهلك ربع الجرعة فقط <span class="ltr">(2 ÷ 8 = 0.25)</span>. وعبارة «إذا زاد المعامل عن الواحد يكون التعرض أكثر من المسموح» صحيحة مع القانون المصحح.</p>`,fix:true},
    {tip:`<p>كل زيادة <span class="ltr">5 dB</span> في الجدول تقسم المدة المسموحة على 2: <span class="ltr">90 → 8 h</span>، <span class="ltr">95 → 4 h</span>، <span class="ltr">100 → 2 h</span>، <span class="ltr">105 → 1 h</span>، <span class="ltr">110 → ½ h</span>. ومعامل التعرض الصحيح هو «كم استهلك العامل من مدته المسموحة»: <span class="ltr">1</span> يعني الحد تماماً.</p>`,title:'اقرأ الجدول بسرعة'},
    {title:'مختبر مصغّر: فترة واحدة في اليوم',widget:(el,B)=>DCML.lab(el,B,{intro:'اختر مستوى من جدول ص 34 وحرّك المدة الفعلية (أرقام تختارها أنت). الحساب بالقانون المصحح <span class="ltr">D = C ÷ T</span>.',
     predict:{q:'عامل عند <span class="ltr">100 dB</span> لمدة ساعة واحدة. كم معامل التعرض الصحيح؟',opts:[['<span class="ltr">2</span>',false,'هذا ناتج القانون المقلوب المطبوع (المسموحة ÷ الفعلية = <span class="ltr">2 ÷ 1</span>).'],['<span class="ltr">0.5</span>',true,'المسموح عند <span class="ltr">100 dB</span> ساعتان، فالمعامل <span class="ltr">1 ÷ 2 = 0.5</span>: استهلك نصف مدته المسموحة.'],['<span class="ltr">1</span>',false,'المعامل 1 يعني أنه قضى المدة المسموحة كلها (ساعتين).']]},
     ins:[{k:'L',l:'مستوى الضوضاء (من الجدول)',seg:NOISE.map(r=>[r[0],r[0]+' dB']),v:100},{k:'C',l:'المدة الفعلية <span class="ltr">C</span>',u:'h',min:0.25,max:8,step:0.25,v:1,dp:2}],
     calc:(s,P,B)=>{const T=Tof(s.L),D=s.C/T,bk=T/s.C,over=D>1+1e-9,eq=Math.abs(D-1)<1e-9;
      return {facts:[['المسموحة <span class="ltr">T</span> من الجدول',B.fmtN(T)+' h'],['المعامل الصحيح <span class="ltr">C ÷ T</span>',B.fmtN(B.round(D,3)),over?'bad':'hi'],['المطبوع في الكتاب <span class="ltr">T ÷ C</span>',B.fmtN(B.round(bk,3))]],
       bars:[{l:'نسبة الجرعة اليومية',v:D,max:Math.max(2,D),txt:B.fmtN(B.round(D*100,1))+' %',col:over?'--stop':'--on'}],
       msg:(eq?'المعامل يساوي الواحد الصحيح: التعرض عند الحد المسموح تماماً.':over?'المعامل أكبر من الواحد الصحيح: <b>التعرض أكثر من الحد المسموح به</b>.':'المعامل أقل من الواحد الصحيح: التعرض أقل من الحد المسموح به.')+((bk>1+1e-9)!==over&&!eq?' <br><span class="sub">لاحظ: رقم القانون المطبوع يعطي الحكم المعاكس.</span>':''),cls:over?'warn':''}}})},
    {add:`<p>الكتاب لا يعطي مثالاً محلولاً لمعامل التعرض؛ أضفنا مثالين (يوم من ثلاث فترات، ويوم من فترتين) في تبويب «الأمثلة المحلولة» من أرقام جدول ص 34، وفي تبويب «المختبر» تستطيع تكوين يوم كامل من عدة فترات.</p>`,title:'أمثلة محلولة'}
   ]},

  {st:9,short:'خطوات البرنامج',title:'4- برنامج حماية القوى السمعية',ref:'ص 35–36',
   q:'العامل الجديد في ورشة صاخبة… متى يُفحص سمعه، ومتى نعرف أن البرنامج فشل؟',
   art:(()=>{const {art,tx,D,P,C}=U3S;let s='';
    const R=[[52,'أ- القياس والتسجيل','متوسط 8 ساعات','85 dB','يقوم صاحب العمل بقياس الضوضاء في جميع المواقع، ويسجل أسماء العاملين في المواقع التي يبلغ متوسط شدة الضوضاء بها خلال الساعات الثمانية ⟦85⟧ ديسيبل أو أكثر.',C.teal],
     [110,'ب- الفحص الابتدائي','خلال 6 أشهر','Baseline','فحص طبي خاص بالقدرة السمعية في مستشفى معتمد، خلال مدة لا تتجاوز ستة أشهر من تاريخ التعيين، وبعد راحة لا تقل عن ⟦14⟧ ساعة في يوم الفحص. يسمى ⟦Baseline Audiograms⟧.',C.yellow],
     [168,'ج- الفحص السنوي','بعد سنة','Annual','بعد سنة من الفحص الابتدائي يُعاد الفحص لنفس الأشخاص ⟦Annual Audiograms⟧ وتُقارن القراءتان.',C.yellow],
     [226,'انحراف 10 dB أو أكثر','2000 · 3000 · 4000 Hz','30 يوماً','انحراف ⟦10⟧ ديسيبل أو أكثر عند ⟦2000⟧ و⟦3000⟧ و⟦4000⟧ هيرتز = خلل في البرنامج: يُزوَّد العامل بمهمات حماية السمع ويُعاد الفحص خلال ⟦30⟧ يوماً، فإن تأكد الانحراف تُتخذ خطوات السيطرة.',C.coral]];
    R.forEach(([y,a,b,c,tip,f],i)=>{s+=`<g data-tip="${tip}"><rect x="40" y="${y}" width="280" height="48" rx="10" fill="${P}" stroke="${D}" stroke-width="2.2"/><rect x="292" y="${y}" width="28" height="48" rx="10" fill="${f}" stroke="${D}" stroke-width="2.2"/>${tx(200,y+21,a,{fs:13,w:700})}${tx(200,y+39,b,{fs:11.5})}${tx(90,y+30,c,{fs:11.5,mono:!/[؀-ۿ]/.test(c),w:700})}</g>`;if(i<3)s+=`<path d="M306 ${y+50}V${y+56}" stroke="${D}" stroke-width="2.4"/>`});
    return art('أربع بطاقات متتالية: القياس والتسجيل عند 85، الفحص الابتدائي خلال 6 أشهر، الفحص السنوي، ثم الانحراف 10 ديسيبل وإعادة الفحص خلال 30 يوماً',C.peach,s+tx(180,300,'خطوات البرنامج',{fs:13.5,w:700}))})(),
   cap:'خطوات البرنامج بالترتيب؛ كل الأرقام من ص 35–36.<br><b>مرّر المؤشر على أي بطاقة (أو المسها في الجوال) لتقرأ تفاصيلها.</b>',
   side:[
    {predict:{q:'في الفحص السنوي ظهر انحراف <span class="ltr">10 dB</span> عند <span class="ltr">4000 Hz</span> مقارنة بالفحص الابتدائي. ما أول إجراء؟',opts:[
     ['فصل العامل من العمل فوراً',false,'الكتاب لا يذكر ذلك.'],
     ['لا شيء، فالانحراف صغير',false,'<span class="ltr">10 dB</span> أو أكثر عند هذه الذبذبات يعني خللاً في البرنامج.'],
     ['تزويده بمهمات حماية السمع وإعادة الفحص خلال 30 يوماً',true,'«يتم في هذه الحالة تزويد العاملين الذين لديهم هذا الانحراف بمهمات الوقاية الشخصية لحماية السمع لحين إجراء الفحص مرة أخرى خلال 30 يوماً» (ص 35).']]}}
   ],
   body:[
    {book:`<p><b>4- برنامج حماية القوى السمعية:</b></p>
     <p><b>أ- المتابعة والفحص:</b> يقوم صاحب العمل بإجراء قياسات للضوضاء في جميع مواقع العمل المختلفة، ويتم تسجيل أسماء العاملين الذين يعملون في المواقع التي تبلغ متوسط شدة الضوضاء بها خلال الساعات الثمانية <span class="ltr">85</span> ديسيبل أو أكثر.</p>
     <p><b>ب- فحص القوى السمعية:</b> يتم إجراء فحص طبي خاص بالقدرة السمعية لهؤلاء العاملين في مستشفى طبي معتمد لإجراء مثل هذا النوع من الفحص. يتم إجراء هذا الفحص خلال مدة لا تتجاوز ستة أشهر من تاريخ تعيين العامل، كذلك يتم إعطاء العامل راحة لمدة لا تقل عن <span class="ltr">14</span> ساعة في اليوم الذي سوف يتم فيه الفحص. يتم الاحتفاظ بنتائج الفحص والذي يسمى الفحص الابتدائي (الأساسي) <span class="ltr">Baseline Audiograms</span>.</p>
     <p><b>ج- فحص القوى السمعية السنوي:</b> يتم بعد سنة من الفحص الابتدائي، يتم إجراء فحص طبي آخر لمستوى القوى السمعية لنفس الأشخاص الذين تم فحصهم سابقاً. يتم مقارنة القراءات الأولى في الفحص الابتدائي <span class="ltr">Baseline Audiograms</span> مع القراءات الثانية في الفحص السنوي <span class="ltr">Annual Audiograms</span>.</p>
     <p>في حالة وجود تغيير أو انحراف بين القراءتين يكون مساوياً <span class="ltr">10</span> ديسيبل أو أكثر عند الذبذبات: <span class="ltr">2000</span> هيرتز، <span class="ltr">3000</span> هيرتز، <span class="ltr">4000</span> هيرتز يعني ذلك وجود خلل في نظام برنامج حماية القوى السمعية. يتم في هذه الحالة تزويد العاملين الذين لديهم هذا الانحراف بمهمات الوقاية الشخصية لحماية السمع لحين إجراء الفحص مرة أخرى خلال <span class="ltr">30</span> يوماً.</p>
     <p>في حالة تأكد وجود هذا الانحراف والتغيير بعد الفحص للمرة الثانية، يتم اتخاذ خطوات للسيطرة ومنها التحكم والحلول الهندسية، التحكم الإداري واستخدام مهمات الوقاية الشخصية.</p>`,ref:'ص 35–36'},
    {watch:`<p>عنوان «برنامج حماية القوى السمعية» يتكرر في الكتاب للقسم كله (ص 32) وللبند الرابع منه (ص 35). وصححنا: «الثمانة» = الثمانية، و«القرائتين» = القراءتين.</p>`,fix:true},
    {tip:`<p>لماذا راحة <span class="ltr">14</span> ساعة قبل الفحص؟ لأن الأذن بعد يوم صاخب قد تضعف مؤقتاً، فتأتي القراءة أسوأ من حقيقتها. الفحص الابتدائي يجب أن يكون صورة صادقة لسمع العامل حتى تُقارن به الفحوص اللاحقة.</p>`,title:'لماذا الراحة؟'},
    {title:'مختبر مصغّر: رتّب خطوات البرنامج',widget:(el,B)=>DCML.order(el,B,{intro:'اضغط خطوات برنامج حماية القوى السمعية بالترتيب الذي يذكره الكتاب.',steps:[
 ['قياس الضوضاء في جميع المواقع وتسجيل أسماء العاملين في مواقع <span class="ltr">85 dB</span> أو أكثر','لا نعرف من نفحص قبل القياس والتسجيل.'],
 ['الفحص الابتدائي <span class="ltr">Baseline</span> خلال ستة أشهر من التعيين','هذا أول فحص طبي للعامل المسجل.'],
 ['الفحص السنوي <span class="ltr">Annual</span> ومقارنته بالابتدائي','يأتي بعد سنة من الفحص الابتدائي.'],
 ['عند انحراف <span class="ltr">10 dB</span> أو أكثر: مهمات حماية السمع وإعادة الفحص خلال 30 يوماً','هذا الإجراء بعد ظهور الانحراف في المقارنة.'],
 ['إذا تأكد الانحراف: خطوات السيطرة (الحلول الهندسية، التحكم الإداري، مهمات الوقاية)','السيطرة بعد التأكد في الفحص الثاني.']]})}
   ]},

  {recap:[
   'واقي الأذن واجب فوق <span class="ltr">85 dB</span>، ويُختار على ضوء قياس مسئول السلامة، وقيمة تخفيضه مكتوبة عليه.',
   'الأغطية: تخفض <span class="ltr">15–35 dB</span> للشدة <span class="ltr">90–120</span>؛ السدادات: <span class="ltr">20–30 dB</span> للشدة <span class="ltr">85–115</span>؛ والاثنان معاً بحدود <span class="ltr">50 dB</span> حتى <span class="ltr">130</span>.',
   'الضوضاء صوت غير مرغوب فيه، وتتلف شعيرات القوقعة دون أن يشعر الشخص، والتلف لا علاج له.',
   '<span class="ltr">90 dB</span> مسموح 8 ساعات، وكل <span class="ltr">5 dB</span> زيادة تنصّف المدة؛ ومعامل التعرض الصحيح <span class="ltr">D = Σ C ÷ T</span>، وأكبر من 1 يعني تجاوز الحد.',
   'البرنامج: قياس وتسجيل (<span class="ltr">85 dB</span>)، فحص ابتدائي خلال 6 أشهر، فحص سنوي، وانحراف <span class="ltr">10 dB</span> عند <span class="ltr">2000–4000 Hz</span> يعني خللاً.']}
],
 theory:[
  {h:'3-3-3 واقي الأذن (<span class="ltr">Ear Protection</span>)',ref:'ص 31',html:`<p>يجب على جميع العاملين الذين يعملون في أماكن عالية الضوضاء وتزيد شدتها عن <span class="ltr">85</span> ديسيبل ارتداء معدات وقاية الأذن، حتى لا يتعرضوا لفقد حساسية السمع لديهم تدريجياً مع طول فترة التعرض لهذه الضوضاء، حتى يمكن أن يصلوا إلى درجة يفقدون فيها سمعهم نهائياً.</p>
   <p>يقوم مسئول قسم السلامة والصحة المهنية بقياس درجة الضوضاء في مكان العمل، وعلى ضوء نتائج القياس يتم اختيار المعدة المناسبة لوقاية الأذن.</p>`},
  {h:'أ- معدات وقاية الأذن',ref:'ص 31',html:`<p>مهمات الوقاية الخاصة بالأذن تقوم بتخفيض درجة الضوضاء في مكان العمل إلى حد أقل من الحد المسموح التعرض له، و<b>يكتب على كل معدة منها قيمة التخفيض</b> في شدة الضوضاء التي يمكنها أن تخفضها.</p>`},
  {h:'ب- أغطية الأذن (<span class="ltr">Ear Muffs</span>) و ج- سدادات الأذن (<span class="ltr">Ear Plugs</span>)',ref:'ص 32',html:`<p><b>أغطية الأذن</b> تغطي الأذن الخارجية وتكون حاجزاً للصوت، وهي توفر حماية للأذن من خطر التعرض للضوضاء العالية، حيث تقوم بتقليل شدة الضوضاء في حدود <span class="ltr">15 – 35</span> ديسيبل، وتستعمل عندما تكون شدة الضوضاء في مكان العمل من <span class="ltr">90</span> إلى <span class="ltr">120</span> ديسيبل (شكل <span class="ltr">3-6-أ</span>).</p>
   <p><b>سدادات الأذن</b> توضع داخل قناة الأذن، وتصنع من البلاستيك أو المطاط، ويمكنها تقليل الضوضاء التي تصل إلى الأذن في حدود <span class="ltr">20 – 30</span> ديسيبل، وتستعمل في الأماكن التي تبلغ فيها شدة الضوضاء من <span class="ltr">85 – 115</span> ديسيبل (شكل <span class="ltr">3-6-ب</span> و<span class="ltr">3-6-ج</span>).</p>
   <p>في بعض الأماكن التي تكون فيها شدة الضوضاء عالية جداً قد تصل إلى <span class="ltr">130</span> ديسيبل، يتم ارتداء <b>سدادات الأذن مع أغطية الأذن</b>، حيث يتم تقليل الضوضاء في هذه الحالة بحدود <span class="ltr">50</span> ديسيبل.</p>
   <div class="tablebox"><table class="tt"><thead><tr><th>الوسيلة</th><th>مقدار التخفيض</th><th>شدة الضوضاء التي تستعمل فيها</th></tr></thead><tbody>
   <tr><td>أغطية الأذن <span class="ltr">Ear Muffs</span></td><td><span class="ltr">15 – 35 dB</span></td><td><span class="ltr">90 – 120 dB</span></td></tr>
   <tr><td>سدادات الأذن <span class="ltr">Ear Plugs</span></td><td><span class="ltr">20 – 30 dB</span></td><td><span class="ltr">85 – 115 dB</span></td></tr>
   <tr><td>السدادات مع الأغطية معاً</td><td>بحدود <span class="ltr">50 dB</span></td><td>حتى <span class="ltr">130 dB</span></td></tr></tbody></table></div><p class="sub">جدول ملخص من نص الكتاب.</p>`},
  {fig:'(3-6)',ref:'ص 32',caption:'(أ) أغطية الأذن <span class="ltr">Earmuffs</span>، (ب) سدادات أذن من <span class="ltr">PVC</span> وسدادات إسفنجية <span class="ltr">Foam</span>، (ج) سدادات أذن بطوق. رسم توضيحي مبسّط للصور.',draw:()=>box(fig36(),600)},
  {h:'3-3-4 برنامج حماية القوى السمعية (<span class="ltr">OSHA Hearing Conservation Program</span>)',ref:'ص 32',html:`<p>يعتبر التعرض للضوضاء من أكثر مسببات المخاطر الصحية التي يتعرض لها العاملون في المواقع الصناعية. وتعرف <b>الضوضاء</b> بأنها الصوت غير المرغوب فيه، والذي نتعرض له بصفة مستمرة في المنزل، وفي الطريق، وفي مواقع العمل المختلفة.</p>`},
  {h:'1- الأذن البشرية',ref:'ص 33',html:`<p>تتكون الأذن البشرية من ثلاثة أجزاء، هي: الأذن الخارجية، والأذن الوسطى، والأذن الداخلية (شكل <span class="ltr">3-7</span>).</p>
   <ul><li><b>أ- الأذن الخارجية:</b> تقوم بتجميع الموجات الصوتية (ذبذبات الصوت) ونقلها خلال القناة السمعية إلى طبلة الأذن.</li>
   <li><b>ب- الأذن الوسطى:</b> تتكون من ثلاثة أجزاء هي: المطرقة والركاب والسندان، حيث تتصل المطرقة بطبلة الأذن ويتصل السندان بالأذن الداخلية. تقوم طبلة الأذن بنقل ذبذبات الصوت إلى المطرقة والركاب والسندان، والتي بدورها تنقلها إلى الأذن الداخلية.</li>
   <li><b>ج- الأذن الداخلية:</b> تتكون من قنوات دائرية و<b>إنسان الأذن</b> الذي يتصل بدوره بالعصب السمعي (الذي يقوم بنقل نبضات الصوت إلى المخ). يحتوي إنسان الأذن على عدد كبير جداً من <b>الشعيرات الدقيقة جداً</b>، وهي التي تتصل بالمخ. وهذه الشعيرات هي التي تتعرض للتلف من جراء التعرض للضوضاء لفترات طويلة (ويحدث ذلك <b>بدون أن يشعر الشخص به</b>)، حتى نصل إلى مرحلة يفقد الإنسان فيها سمعه تماماً، الأمر الذي <b>لا علاج له</b>.</li></ul>`},
  {err:`يقول الكتاب (ص 33) إن الأذن الوسطى «المطرقة والركاب والسندان» وإن «السندان يتصل بالأذن الداخلية». الصحيح علمياً أن ترتيب العظيمات من الطبلة إلى الداخل هو: <b>المطرقة ← السندان ← الركاب</b>، و<b>الركاب</b> (لا السندان) هو المتصل بالأذن الداخلية عند النافذة البيضاوية. و«إنسان الأذن» في الكتاب المقصود به <b>القوقعة</b>. رسمنا الشكل ومسار الصوت بالترتيب الصحيح.`},
  {widget:(el)=>earWidget(el)},
  {h:'2- قياسات الصوت',ref:'ص 34',html:`<p>يتم قياس ضغط الصوت بوحدة تسمى <b>الديسيبل</b> <span class="ltr">(dB)</span>، وهي وحدات لوغاريتمية لقياس مستويات ضغط الصوت.</p>
   <p>تنص المواصفات العالمية على اعتبار <b><span class="ltr">90</span> ديسيبل</b> هو الحد المسموح التعرض له من الضوضاء لمدة <b>8 ساعات باليوم</b> لمدة خمسة أيام بالأسبوع بدون ضرر، كما تعتبر أن <b><span class="ltr">85</span> ديسيبل</b> هو الحد الواجب البدء باتخاذ خطوات لحماية القوى السمعية للعاملين عند بلوغه.</p>`},
  {h:'3- مستويات الضوضاء المسموح بها',ref:'ص 34',html:noiseTable()},
  {note:TIP+'كل زيادة <span class="ltr">5 dB</span> في الجدول تقسم المدة المسموحة على 2: <span class="ltr">90 → 8 h</span>، <span class="ltr">95 → 4 h</span>، <span class="ltr">100 → 2 h</span>، <span class="ltr">105 → 1 h</span>، <span class="ltr">110 → ½ h</span>. لذلك الزيادة القليلة في الديسيبل خطرة جداً.'},
  {h:'حساب التأثير التراكمي (معامل التعرض)',ref:'ص 34–35',html:`<p>عندما يكون التعرض للضوضاء خلال اليوم على فترات (فترتين أو أكثر بحيث تكون قياسات الضوضاء بها مختلفة) يتم حساب <b>التأثير التراكمي</b> وليس التأثير الفردي لأي منها. ويتم حساب ذلك على النحو التالي:</p>
   <p>«معامل التعرض = الفترة الزمنية المقابلة لقياس الضوضاء حسب الجدول أعلاه مقسومة على المدة الفعلية للتعرض (للفترة الأولى) + الفترة الزمنية المقابلة لقياس الضوضاء حسب الجدول أعلاه مقسومة على المدة الفعلية للتعرض (الفترة الثانية) ... وهكذا».</p>
   <p>إذا زاد معامل التعرض عن الواحد الصحيح يكون التعرض أكثر من الحد المسموح به، وإذا قل عن الواحد الصحيح يكون التعرض أقل من الحد المسموح به (<span class="ltr">90</span> ديسيبل).</p>
   <p>${B.bkCtl('noise','القانون:')}</p>
   <p class="sub">حيث <span class="ltr">C</span> المدة الفعلية للتعرض، و<span class="ltr">T</span> الفترة المسموحة المقابلة للمستوى من الجدول.</p>
   <span class="bkb" data-bk="noise">معامل التعرض = $$\\frac{T_1}{C_1}+\\frac{T_2}{C_2}+\\cdots$$</span>
   <span class="bkf blk" data-bk="noise">معامل التعرض $$D=\\frac{C_1}{T_1}+\\frac{C_2}{T_2}+\\cdots$$ وإذا كان <span class="ltr">D &gt; 1</span> فالتعرض أكثر من الحد المسموح.</span>
   <span class="bkf blk sub fixnote" data-bk="noise">المصحح: الكتاب قلب الكسر؛ كتب «الفترة المسموحة من الجدول مقسومة على المدة الفعلية». الصحيح (قاعدة <span class="ltr">OSHA 1910.95</span>) أن نقسم <b>المدة الفعلية على المدة المسموحة</b>. بقانون الكتاب ينعكس الحكم: عامل يقضي ساعتين فقط عند <span class="ltr">90 dB</span> يعطي <span class="ltr">8 ÷ 2 = 4</span> فيبدو «متجاوزاً»، وهو في الحقيقة استهلك ربع الجرعة فقط <span class="ltr">(2 ÷ 8 = 0.25)</span>. وعبارة «إذا زاد المعامل عن الواحد يكون التعرض أكثر من المسموح» صحيحة مع القانون المصحح.</span>`},
  {note:ADD+'لا يوجد في الكتاب مثال محلول لمعامل التعرض؛ أضفنا مثالين في تبويب «الأمثلة المحلولة» من أرقام جدول ص 34، ويمكنك تجربة أي يوم عمل في «المختبر».'},
  {h:'4- برنامج حماية القوى السمعية',ref:'ص 35–36',html:`<ul><li><b>أ- المتابعة والفحص:</b> يقوم صاحب العمل بإجراء قياسات للضوضاء في جميع مواقع العمل المختلفة، ويتم تسجيل أسماء العاملين الذين يعملون في المواقع التي يبلغ متوسط شدة الضوضاء بها خلال الساعات الثمانية <span class="ltr">85</span> ديسيبل أو أكثر.</li>
   <li><b>ب- فحص القوى السمعية:</b> يتم إجراء فحص طبي خاص بالقدرة السمعية لهؤلاء العاملين في مستشفى طبي معتمد لإجراء مثل هذا النوع من الفحص. يتم إجراء هذا الفحص خلال مدة لا تتجاوز <b>ستة أشهر</b> من تاريخ تعيين العامل، كذلك يتم إعطاء العامل راحة لمدة لا تقل عن <b><span class="ltr">14</span> ساعة</b> في اليوم الذي سوف يتم فيه الفحص. يتم الاحتفاظ بنتائج الفحص، والذي يسمى الفحص الابتدائي (الأساسي) <span class="ltr">Baseline Audiograms</span>.</li>
   <li><b>ج- فحص القوى السمعية السنوي:</b> بعد سنة من الفحص الابتدائي يتم إجراء فحص طبي آخر لمستوى القوى السمعية لنفس الأشخاص. يتم مقارنة القراءات الأولى في الفحص الابتدائي <span class="ltr">Baseline Audiograms</span> مع القراءات الثانية في الفحص السنوي <span class="ltr">Annual Audiograms</span>.
   في حالة وجود تغيير أو انحراف بين القراءتين يكون مساوياً <b><span class="ltr">10</span> ديسيبل أو أكثر</b> عند الذبذبات: <span class="ltr">2000 Hz</span>، <span class="ltr">3000 Hz</span>، <span class="ltr">4000 Hz</span> يعني ذلك وجود خلل في نظام برنامج حماية القوى السمعية. يتم في هذه الحالة تزويد العاملين الذين لديهم هذا الانحراف بمهمات الوقاية الشخصية لحماية السمع لحين إجراء الفحص مرة أخرى خلال <b><span class="ltr">30</span> يوماً</b>.
   في حالة تأكد وجود هذا الانحراف والتغيير بعد الفحص للمرة الثانية، يتم اتخاذ خطوات للسيطرة ومنها: التحكم والحلول الهندسية، والتحكم الإداري، واستخدام مهمات الوقاية الشخصية.</li></ul>`},
  {err:`صححنا في النص دون تنبيه: إحالة السدادات في ص 32 «شكل ٦-٣-أ-ب-ج» تشمل «أ» وهي أغطية الأذن، والصواب «ب، ج»؛ «تنص مواصفات العالمية» = المواصفات العالمية؛ «الثمانة» = الثمانية؛ «القرائتين» = القراءتين. وعنوان «برنامج حماية القوى السمعية» يتكرر في الكتاب للقسم كله (ص 32) وللبند الرابع منه (ص 35).`}
 ],
 lab:(el)=>noiseLab(el),
 examples:[
  noiseEx({title:'مثال 1 (إضافة من خارج الكتاب): عامل في ورشة على ثلاث فترات',per:[[90,4],[95,2],[100,1]],
   q:'<p>عامل يتعرض في يوم عمله إلى: <span class="ltr">90 dB</span> لمدة 4 ساعات، ثم <span class="ltr">95 dB</span> لمدة ساعتين، ثم <span class="ltr">100 dB</span> لمدة ساعة. احسب معامل التعرض، وهل تعرضه ضمن الحد المسموح؟</p>',
   note:'هذا المثال ليس من الكتاب؛ بنيناه من جدول ص 34 بالقانون الصحيح <span class="ltr">D = Σ C/T</span>. لاحظ أن كل فترة وحدها أقل من مدتها المسموحة، ومع ذلك مجموعها يتجاوز الحد — لذلك يحسب الكتاب «التأثير التراكمي».'}),
  noiseEx({title:'مثال 2 (إضافة من خارج الكتاب): فترتان قصيرتان',per:[[92,2],[97,1]],
   q:'<p>عامل صيانة يتعرض إلى <span class="ltr">92 dB</span> لمدة ساعتين، ثم <span class="ltr">97 dB</span> لمدة ساعة، وبقية يومه في مكان هادئ (أقل من <span class="ltr">90 dB</span>). هل تعرضه ضمن الحد المسموح؟</p>',
   note:'بالقانون الصحيح التعرض أقل من الحد. أما القانون المقلوب المطبوع في ص 34 فيعطي رقماً أكبر من 1 فيحكم خطأً بأنه تجاوز الحد — انظر الخطوة الأخيرة.'})
 ],
 quiz:[
  {q:'فوق أي شدة ضوضاء يجب على العامل ارتداء واقي الأذن؟',o:['70 ديسيبل','85 ديسيبل','100 ديسيبل','130 ديسيبل'],c:1,e:'«…وتزيد شدتها عن 85 ديسيبل ارتداء معدات وقاية الأذن» (ص 31).'},
  {q:'مكان عمل شدة الضوضاء فيه 125 ديسيبل. ما الواقي الذي يذكره الكتاب؟',o:['سدادات الأذن وحدها','أغطية الأذن وحدها','السدادات مع الأغطية معاً','لا يلزم واقٍ'],c:2,e:'الأغطية حتى 120 والسدادات حتى 115، أما المكان الذي قد يصل إلى 130 فتُلبس فيه السدادات مع الأغطية (ص 32).'},
  {q:'حسب جدول ص 34، كم ساعة يُسمح بالتعرض لضوضاء 100 dBA في اليوم؟',o:['8','4','2','1'],c:2,e:'100 dBA ← ساعتان.'},
  {q:'عامل تعرض 4 ساعات عند 95 dB وساعتين عند 100 dB. معامل التعرض الصحيح يساوي:',o:['0.5','1','2','4'],c:2,e:'4/4 + 2/2 = 2 أكبر من 1 ← تجاوز الحد (القانون المصحح: الفعلية ÷ المسموحة).'},
  {q:'ما الخطأ في قانون معامل التعرض المطبوع في ص 34؟',o:['لا خطأ فيه','قلب الكسر: قسم المدة المسموحة على الفعلية والصحيح الفعلية على المسموحة','استعمل 85 بدل 90','جمع الفترات بدل ضربها'],c:1,e:'الصحيح D = Σ C/T؛ بصيغة الكتاب ينعكس الحكم.'},
  {q:'متى يدل الفحص السمعي السنوي على خلل في برنامج حماية السمع؟',o:['إذا تغيرت القراءة 3 ديسيبل','إذا تغيرت القراءة 10 ديسيبل أو أكثر عند 2000 و3000 و4000 هيرتز','إذا لم يحضر العامل','إذا كانت الضوضاء 85 ديسيبل'],c:1,e:'(ص 35).'}
 ]
});

/* =====================================================================
   LESSON 3 — foot protection, respiratory protection types (ص 36–38)
   ===================================================================== */
function fig38(){let s='';
  // left panel: safety shoe side view
  s+=`<path d="M40 60V30H120V60" ${S('var(--surface-2)','var(--fg)',1.2)}/>${[46,58,70,82,94,106].map(x=>`<path d="M${x} 30V60" ${S('','var(--muted)',1)}/>`).join('')}`;
  s+=`<path d="M36 60H124V96L210 110Q236 116 238 134V146H36Z" ${S('var(--surface)','var(--fg)',1.8)}/><path d="M36 146H238V158H36Z" ${S('var(--wire)','var(--fg)',1.6)}/>`;
  s+=`<path d="M170 104Q214 108 232 130V140H170Z" ${S('','var(--fg)',1.4)} stroke-dasharray="4 3"/><path d="M42 151H232" ${S('','var(--fg)',1.4)} stroke-dasharray="5 3"/>`;
  s+=`<path d="M210 112L250 40" ${S('','var(--muted)',1)}/>`+lt(252,36,'STEEL CAP',{a:'start',fs:11})+`<path d="M200 154L250 186" ${S('','var(--muted)',1)}/>`+lt(252,190,'PUNCTURE RESISTANT SOLE',{a:'start',fs:10});
  // right panel: high boot + falling hammer
  s+=`<g transform="translate(440 0)"><path d="M-40 40H20V112L76 124Q96 130 96 146V158H-40Z" ${S('var(--surface)','var(--fg)',1.8)}/>${[54,70,86,102].map(y=>`<path d="M-6 ${y}L14 ${y+6}M14 ${y}L-6 ${y+6}" ${S('','var(--fg)',1.2)}/>`).join('')}<path d="M-40 158H96V168H-40Z" ${S('var(--wire)','var(--fg)',1.4)}/>
   <g transform="translate(70 40) rotate(30)"><rect x="-5" y="0" width="10" height="56" rx="3" ${S('var(--live)')}/><rect x="-22" y="-12" width="44" height="16" rx="3" ${S('var(--wire)')}/></g><path d="M40 20L60 110M60 14L76 108" ${S('','var(--muted)',1)} stroke-dasharray="5 4"/></g>`;
  return svg(560,200,s,'حذاء السلامة: الغطاء الفولاذي والنعل المقاوم للثقب')}
const head=(cx,cy,r)=>`<circle cx="${cx}" cy="${cy}" r="${r}" ${S('var(--surface-2)','var(--fg)',1.4)}/>`;
function fig39(){let s='';
  // SCBA wearer (front-ish) + cylinder
  s+=`<g transform="translate(100 0)"><rect x="34" y="70" width="28" height="90" rx="12" ${S(SC.yellow,'var(--fg)',1.5)}/><path d="M-36 210V110Q-36 90 0 88Q36 90 36 110V210Z" ${S('var(--surface)','var(--fg)',1.4)}/>${head(0,60,28)}<ellipse cx="0" cy="62" rx="22" ry="26" ${S('var(--fg)','var(--fg)')}/><ellipse cx="0" cy="54" rx="15" ry="10" ${S('var(--blue-soft)')}/><path d="M0 84Q10 120 26 130T48 120" ${S('','var(--fg)',5)}/><path d="M-30 100L30 190M30 100L-30 190" ${S('','var(--muted)',3)}/></g>`+lt(100,230,'SCBA',{fs:12});
  // line drawing SCBA hose to regulator on belt
  s+=`<g transform="translate(270 0)"><path d="M-36 210V110Q-36 90 0 88Q36 90 36 110V210Z" ${S('var(--surface)','var(--fg)',1.4)}/>${head(0,60,28)}<ellipse cx="0" cy="62" rx="22" ry="26" ${S('var(--wire)','var(--fg)',1.6)}/><ellipse cx="0" cy="54" rx="15" ry="10" ${S('var(--blue-soft)')}/><path d="M0 88Q-6 120 4 150" ${S('','var(--fg)',6)}/><path d="M0 88Q-6 120 4 150" ${S('','var(--surface)',2.4)} stroke-dasharray="3 3"/><rect x="-8" y="148" width="24" height="14" rx="3" ${S('var(--wire)')}/><path d="M-26 92L-30 200M26 92L30 200" ${S('','var(--fg)',3)}/></g>`+lt(270,230,'SCBA',{fs:12});
  // airline respirator
  s+=`<g transform="translate(430 0)"><path d="M-26 200V110Q-26 92 0 90Q26 92 26 110V200Z" ${S('var(--surface)','var(--fg)',1.4)}/>${head(0,62,24)}<path d="M-24 50Q-24 30 0 30T24 50Z" ${S(SC.yellow,'var(--fg)',1.4)}/><ellipse cx="0" cy="66" rx="16" ry="18" ${S('var(--wire)','var(--fg)',1.4)}/><path d="M-26 140H26" ${S('','var(--fg)',4)}/>
   <path d="M20 142Q60 150 50 190T90 214" ${S('','var(--fg)',3)}/><path d="M30 214H150" ${S('','var(--fg)',6)}/><rect x="84" y="196" width="40" height="22" rx="4" ${S('var(--surface-2)')}/><path d="M150 214l-10-6v12z" style="fill:var(--fg)"/></g>`+lt(520,190,'air',{fs:10,a:'end'});
  return svg(600,240,s,'أجهزة التنفس المزودة للهواء')}
function fig310a(){let s='';
  s+=`<g transform="translate(70 70)">${ICON.dust().replace(/<ellipse[^>]*\/>/,'')}</g>`+lt(100,150,'Disposable Gas/Vapour Mask',{fs:9.5});
  s+=`<g transform="translate(200 30)"><path d="M0 40Q30 20 60 40L54 80Q30 92 6 80Z" ${S('var(--wire)','var(--fg)',1.6)}/><circle cx="30" cy="66" r="20" ${S('var(--surface)','var(--fg)',1.6)}/><circle cx="30" cy="66" r="12" ${S('','var(--muted)',1)}/><circle cx="30" cy="66" r="5" ${S('','var(--muted)',1)}/><path d="M0 44L-14 20M60 44L74 20" ${S()}/></g>`;
  s+=`<g transform="translate(330 20)"><ellipse cx="30" cy="54" rx="34" ry="46" ${S('var(--wire)','var(--fg)',1.8)}/><ellipse cx="30" cy="40" rx="24" ry="18" ${S('var(--blue-soft)')}/><circle cx="12" cy="84" r="9" ${S('var(--surface)')}/><circle cx="48" cy="84" r="9" ${S('var(--surface)')}/><path d="M-4 30L-16 14M64 30L76 14M-4 60H-18M64 60H78" ${S()}/></g>`;
  s+=`<g transform="translate(460 10)"><ellipse cx="30" cy="40" rx="24" ry="32" ${S('var(--wire)','var(--fg)',1.6)}/><ellipse cx="30" cy="30" rx="16" ry="12" ${S('var(--blue-soft)')}/><path d="M30 72Q40 120 70 128" ${S('','var(--fg)',5)}/><rect x="62" y="118" width="54" height="30" rx="4" ${S('var(--fg)','var(--fg)')}/></g>`+lt(560,175,'Battery Pack, Blower',{fs:9,a:'end'})+lt(560,186,'and Filter Housing',{fs:9,a:'end'})+lt(520,204,'POWERED AIR-PURIFYING RESPIRATOR',{fs:10,w:700,a:'end'});
  return svg(580,214,s,'أجهزة التنفس المنقية للهواء')}
function fig310b(){let s='';
  s+=`<g transform="translate(40 10)">${head(50,60,40)}<ellipse cx="50" cy="62" rx="34" ry="42" ${S('var(--fg)','var(--fg)')}/><ellipse cx="50" cy="48" rx="24" ry="14" ${S('var(--blue-soft)')}/><ellipse cx="22" cy="92" rx="10" ry="14" ${S('var(--surface)')}/><ellipse cx="78" cy="92" rx="10" ry="14" ${S('var(--surface)')}/></g>`;
  s+=`<g transform="translate(200 20)"><path d="M10 40Q50 0 90 40Q86 96 50 104Q14 96 10 40Z" ${S('var(--surface)','var(--fg)',1.8)}/><circle cx="50" cy="66" r="12" ${S('var(--surface-2)','var(--fg)',1.4)}/><path d="M50 10V100" ${S('','var(--muted)',1)}/>`+lt(50,30,'3M',{fs:10,m:1})+`</g>`;
  [0,1,2].forEach(i=>{const x=360+i*72;s+=`<g transform="translate(${x} 30)"><rect x="-30" y="-20" width="64" height="120" rx="8" style="fill:var(--blue-soft)"/>${head(2,30,18)}<path d="M-8 ${i===0?38:36}Q2 30 12 ${i===0?38:36}L10 48Q2 52 -6 48Z" ${S('var(--surface)')}/>${i>0?`<path d="M-16 ${i===1?14:24}Q2 ${i===1?0:16} 20 ${i===1?14:24}" ${S('','var(--fg)',1.6)}/>`:''}${i===2?`<path d="M-18 26L-26 46M22 26L30 46" ${S('','var(--fg)',3)}/>`:i===0?`<path d="M-22 70L-6 44M26 70L10 44" ${S('','var(--fg)',3)}/>`:`<path d="M-22 70L-18 10M26 70L22 10" ${S('','var(--fg)',3)}/>`}<path d="M-22 100V70H26V100" ${S('var(--surface)')}/></g>`+lt(x+2,22,String(i+1),{fs:13,fill:'var(--on)'})});
  return svg(580,160,s,'أجهزة التنفس المنقية للهواء وطريقة لبس الكمامة')}

function respLab(el){
  const w={dev:'apr',filt:'dust',cont:'dust',o2:'ok',age:2,cyl:60,left:60,run:false,whistled:false,sym:'',ok:false,stuck:0,passed:0};
  el.innerHTML=`<div class="grid">
   <div class="panel c12"><h2>من أين يأتي هواء التنفس؟ <small>مبني على الشكلين <span class="ltr">(3-9)</span> و<span class="ltr">(3-10)</span> ونص ص 37–38</small></h2>
    <p class="sub">اختر الجهاز، ثم غيّر حالة المكان، وشاهد ما يصل إلى فم العامل.</p>
    <div class="wrap-in" style="align-items:flex-start">
     <div><div class="sub">الجهاز</div>${segHTML('dev',[['scba','مزوّد للهواء: أسطوانة على الظهر (SCBA)'],['line','مزوّد للهواء: خرطوم من ضاغطة'],['apr','منقٍّ للهواء (بفلتر)']],w.dev,1)}</div>
     <div id="fBox"><div class="sub">نوع الفلتر</div>${segHTML('filt',[['dust','لاصطياد الأتربة'],['gas','للأبخرة والغازات'],['both','للأبخرة والغازات والأتربة']],w.filt,1)}</div>
    </div>
    <div class="wrap-in" style="align-items:flex-start">
     <div><div class="sub">الملوث في المكان</div>${segHTML('cont',[['dust','أتربة'],['gas','غازات وأبخرة'],['both','الاثنان']],w.cont,1)}</div>
     <div><div class="sub">نسبة الأكسجين</div>${segHTML('o2',[['ok','19.5% أو أكثر'],['low','أقل من 19.5%']],w.o2,1)}</div>
     <label class="sub" id="ageBox" style="display:flex;flex-direction:column;gap:2px;min-width:200px">مدة استعمال الفلتر منذ فتحه: <b id="ageV" class="ltr" style="color:var(--fg)"></b><input type="range" id="age" min="0" max="12" step="1" value="${w.age}" style="accent-color:var(--blue);width:100%"></label>
    </div>
    <div class="wrap-in" id="cylBox" style="align-items:flex-end"><div><div class="sub">حجم الأسطوانة</div>${segHTML('cyl',[['30','نصف ساعة'],['60','ساعة']],'60')}</div><button class="btn primary" id="run">▶ ابدأ العمل</button><button class="btn" id="refill">أسطوانة جديدة</button><span class="sub">الوقت مسرَّع: كل ثانية على الشاشة = دقيقة.</span></div>
   </div>
   <div class="panel c7"><h2>العامل في المكان</h2><div class="svgbox" id="rv"></div><div class="legend"><span><i style="background:var(--blue)"></i>أكسجين/هواء نظيف</span><span><i style="background:var(--live)"></i>أتربة</span><span><i style="background:var(--stop)"></i>غازات وأبخرة</span></div></div>
   <div class="panel c5"><h2>الحكم حسب الكتاب</h2><div class="reads" style="margin:6px 0 0" id="rr"></div><div class="callout" id="rSay"></div>
    <div id="symBox"><h3 class="sm">أثناء العمل بالجهاز المنقي شعر العامل بـ:</h3><div style="display:flex;flex-wrap:wrap;gap:6px">${[['b','صعوبة التنفس'],['s','رائحة أو طعم المواد'],['d','الدوار'],['x','تلف بالجهاز']].map(([k,t])=>`<button class="chip" data-sym="${k}">${t}</button>`).join('')}</div><div class="callout err" id="symSay" hidden></div></div></div>
   <div class="panel c7"><h2>مهام</h2><ol class="steps" id="rSt"></ol></div>
   <div class="panel c5">${tries(['جهاز منقٍّ بفلتر أتربة في مكان فيه غازات: تابع النقاط الحمراء.','اجعل الأكسجين أقل من 19.5% مع الجهاز المنقي.','شغّل أسطوانة نصف ساعة وانتظر الصفير.','اجعل عمر الفلتر 7 أشهر.'])}</div>
  </div>`;
  const $=s=>el.querySelector(s);
  const st=stepsUI($('#rSt'),[
   {t:'فلتر مناسب',x:'اختر الجهاز المنقي وفلتر الأتربة، والملوث «أتربة» والأكسجين طبيعي.',done:w=>w.dev==='apr'&&w.cont==='dust'&&w.filt==='dust'&&w.o2==='ok'&&w.age<=6},
   {t:'فلتر غير مناسب',x:'غيّر الملوث إلى «غازات وأبخرة» دون تغيير الفلتر، ثم اختر الفلتر الذي يناسب.',done:w=>w.dev==='apr'&&w.cont==='gas'&&(w.filt==='gas'||w.filt==='both')},
   {t:'نقص الأكسجين',x:'اجعل الأكسجين أقل من 19.5%، وابحث عن الجهاز الذي يناسب.',done:w=>w.o2==='low'&&w.dev!=='apr'},
   {t:'صفير الأسطوانة',x:'اختر SCBA وشغّل العمل حتى يصفر الجهاز.',done:w=>w.dev==='scba'&&w.whistled},
   {t:'فلتر قديم',x:'مع الجهاز المنقي اجعل مدة استعمال الفلتر أكثر من 6 أشهر.',done:w=>w.dev==='apr'&&w.age>6}
  ],()=>w);
  const parts=[];const N=34;
  const spawn=p=>{p.x=Math.random()*-60;p.y=40+Math.random()*200;const r=Math.random();
    const o2frac=w.o2==='low'?0.18:0.45;p.k=r<o2frac?'o':(w.cont==='both'?(Math.random()<.5?'d':'g'):w.cont==='dust'?'d':'g');p.st=0;p.v=60+Math.random()*50;p.vy=(Math.random()-.5)*16};
  for(let i=0;i<N;i++){const p={};spawn(p);p.x=Math.random()*330;parts.push(p)}
  const MX=388,MY=146; // mouth position
  const caught=k=>{if(w.age>6)return false;return w.filt==='both'||(w.filt==='dust'&&k==='d')||(w.filt==='gas'&&k==='g')};
  function verdict(){let ok=true,msg=[];
    if(w.dev==='apr'){
      if(w.o2==='low'){ok=false;msg.push('<b>لا يناسب:</b> «لا تستعمل هذه الأجهزة على الإطلاق في الأماكن التي تقل بها نسبة الأوكسجين عن 19.5%»؛ فهي «تنقي الهواء… ولكنها لا تستطيع إمداده بالهواء اللازم لعملية التنفس».')}
      const need=w.cont==='both'?['d','g']:[w.cont==='dust'?'d':'g'];
      if(w.age>6){ok=false;msg.push('<b>الفلتر منتهٍ:</b> «في حالة فتح الفلتر واستعماله يتم تسجيل تاريخ الاستعمال عليه ويتم التخلص منه بعد ستة أشهر».')}
      else if(!need.every(caught)){ok=false;msg.push('<b>الفلتر لا يناسب الخطر:</b> «لا يتم استخدام الفلاتر الخاصة بالأتربة في الأماكن الموجود بها غازات وأبخرة سامة والعكس صحيح».')}
      if(ok)msg.push('<b>مناسب:</b> الأكسجين كافٍ والفلتر يناسب نوع الملوث.')}
    else if(w.dev==='scba'){msg.push('<b>حماية كاملة</b> ضد الغازات السامة والخطرة وفي الأماكن التي تقل بها نسبة الأوكسجين، لكن لمدة محدودة: الأسطوانة تكفي <b>'+(w.cyl===60?'ساعة':'نصف ساعة')+'</b> حسب حجمها، وجهاز الصفير ينبه قبل انتهاء الهواء بخمس دقائق.');
      if(w.left<=0){ok=false;msg.push('<b style="color:var(--stop)">نفد الهواء!</b> كان يجب الخروج عند الصفير.')}}
    else msg.push('<b>للعمل لمدد طويلة:</b> «يتم استخدام ضاغطة هواء توصل بفلاتر ومنظمات للضغط، ومن ثم خراطيم طويلة تصل إلى قناع التنفس». الهواء لا ينفد، لكن العامل مربوط بطول الخرطوم.');
    w.ok=ok;return {ok,msg:msg.join('<br>')}}
  function ui(){const sh=(id,v)=>{$(id).style.display=v?'':'none'};sh('#fBox',w.dev==='apr');sh('#ageBox',w.dev==='apr');sh('#symBox',w.dev==='apr');sh('#cylBox',w.dev==='scba');$('#ageV').textContent=w.age+(w.age===1?' شهر':' أشهر');
    ['dev','filt','cont','o2'].forEach(k=>setSeg(el,k,w[k]));setSeg(el,'cyl',String(w.cyl));$('#run').textContent=w.run?'⏸ أوقف':'▶ ابدأ العمل';
    const v=verdict();$('#rSay').className='callout'+(v.ok?'':' err');$('#rSay').innerHTML=v.msg;
    $('#rr').innerHTML=`<div class="read"><span>مصدر الهواء</span><b style="font-family:var(--font);font-size:14px">${w.dev==='apr'?'هواء المكان بعد الفلتر':w.dev==='scba'?'أسطوانة هواء مضغوط':'ضاغطة هواء'}</b></div>`+(w.dev==='scba'?`<div class="read"><span>الهواء المتبقي</span><b>${Math.max(0,Math.ceil(w.left))} min</b></div>`:'')+(w.dev==='apr'?`<div class="read"><span>وصل إلى الفم من الملوث</span><b>${w.passed}</b></div><div class="read"><span>احتجزه الفلتر</span><b>${w.stuck}</b></div>`:'');
    st.check()}
  function scene(t){let s=`<rect x="0" y="0" width="560" height="300" rx="10" style="fill:var(--surface-2)"/>`+ar(80,24,'هواء المكان',{m:1,fs:12});
    if(w.o2==='low')s+=ar(80,286,'أكسجين أقل من 19.5%',{fs:12,fill:'var(--stop)',w:700});
    // worker head (profile facing left) + body
    s+=`<path d="M380 300Q384 214 430 204H520Q556 214 560 300Z" ${S('var(--blue-soft)')}/><ellipse cx="440" cy="140" rx="54" ry="62" ${S('var(--surface-2)','var(--fg)',1.6)}/><path d="M392 120Q384 132 392 138" ${S()}/><circle cx="414" cy="118" r="4" style="fill:var(--fg)"/>`;
    const sealed=w.dev!=='apr';
    if(w.dev==='apr'){s+=`<path d="M396 128Q382 146 396 170L430 172Q436 148 428 128Z" ${S('var(--wire)','var(--fg)',1.6)}/><rect x="356" y="132" width="34" height="34" rx="8" ${S(w.age>6?'var(--stop-soft)':'var(--surface)','var(--fg)',1.8)}/>`+lt(373,184,w.filt==='dust'?'P':w.filt==='gas'?'G':'P+G',{fs:10,m:1})}
    else{s+=`<ellipse cx="420" cy="138" rx="34" ry="48" ${S('var(--wire)','var(--fg)',1.8)}/><ellipse cx="412" cy="118" rx="20" ry="14" ${S('var(--blue-soft)')}/>`;
      if(w.dev==='scba'){const fr=Math.max(0,w.left)/w.cyl;s+=`<rect x="500" y="80" width="40" height="${w.cyl===60?120:84}" rx="16" ${S(SC.yellow,'var(--fg)',1.6)}/><rect x="506" y="${(80+(w.cyl===60?120:84)*(1-fr)+6).toFixed(1)}" width="28" height="${Math.max(0,(w.cyl===60?120:84)*fr-12).toFixed(1)}" rx="8" style="fill:var(--blue);opacity:.35"/><path id="hose" d="M520 80L478 46L440 90L420 180" ${S('','var(--fg)',6)}/>`;
        if(w.left<=5&&w.left>0&&Math.floor(t*3)%2===0)s+=ar(470,30,'صفير! بقي 5 دقائق',{fs:14,fill:'var(--stop)',w:700})}
      else s+=`<path id="hose" d="M90 268L260 268L380 240L410 186" ${S('','var(--fg)',6)}/><rect x="20" y="250" width="70" height="40" rx="6" ${S('var(--surface)','var(--fg)',1.6)}/>`+ar(55,244,'ضاغطة وفلاتر',{fs:11,m:1})}
    // particles
    parts.forEach(p=>{const c=p.k==='o'?'var(--blue)':p.k==='d'?'var(--live)':'var(--stop)';if(p.st===3)return;
      s+=p.k==='d'?`<rect x="${(p.x-3).toFixed(1)}" y="${(p.y-3).toFixed(1)}" width="6" height="6" style="fill:${c};opacity:${p.st===1?.5:.9}"/>`:`<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${p.k==='o'?3:3.4}" style="fill:${c};opacity:${p.st===1?.5:.9}"/>`});
    // supplied air particles along hose
    if(sealed&&!(w.dev==='scba'&&w.left<=0)){const P=w.dev==='scba'?[[520,80],[478,46],[440,90],[420,180]]:[[90,268],[260,268],[380,240],[410,186]];
      const along=f=>{const seg=P.length-1,x=f*seg,i=Math.min(seg-1,Math.floor(x)),u=x-i;return [P[i][0]+(P[i+1][0]-P[i][0])*u,P[i][1]+(P[i+1][1]-P[i][1])*u]};
      for(let i=0;i<6;i++){const pt=along((t*0.5+i/6)%1);s+=`<circle cx="${pt[0].toFixed(1)}" cy="${pt[1].toFixed(1)}" r="3.4" style="fill:var(--blue)"/>`}}
    // verdict badge near mouth
    const bad=w.dev==='apr'&&(w.o2==='low'||w.passFlash>0);
    if(bad)s+=`<circle cx="${MX+8}" cy="${MY+8}" r="18" style="fill:none;stroke:var(--stop);stroke-width:3;opacity:.8"/>`;
    $('#rv').innerHTML=svg(560,300,s,'العامل وجهاز التنفس في المكان الملوث')}
  let tick=0;w.passFlash=0;
  loopOn(el,(dt,t)=>{
    parts.forEach(p=>{if(p.st===3){spawn(p);return}
      if(p.st===2){p.x+=40*dt;p.y+=(MY+8-p.y)*dt*3;if(p.x>MX+20){p.st=3}return}
      if(p.st===1){p.life=(p.life||0)+dt;if(p.life>1.2){p.st=3;p.life=0}return}
      p.x+=p.v*dt;p.y+=p.vy*dt;if(p.y<36||p.y>250)p.vy*=-1;
      if(w.dev==='apr'){if(p.x>=350&&p.y>110&&p.y<190){if(p.k!=='o'&&caught(p.k)){p.st=1;w.stuck++}else{p.st=2;if(p.k!=='o'){w.passed++;w.passFlash=1}}}
        else if(p.x>=376)p.st=3}
      else if(p.x>=376){p.st=3}
      if(p.x>560)p.st=3});
    // steer particles toward the filter when using APR
    if(w.dev==='apr')parts.forEach(p=>{if(p.st===0&&p.x>250)p.y+=(MY-p.y)*dt*1.4});
    w.passFlash=Math.max(0,w.passFlash-dt);
    if(w.dev==='scba'&&w.run){w.left-=dt;if(w.left<=5&&!w.whistled){w.whistled=true}if(w.left<=0){w.left=0;w.run=false}}
    tick+=dt;scene(t);if(tick>0.25){tick=0;ui()}});
  el.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
    ['dev','filt','cont','o2'].forEach(k=>{if(b.dataset[k]){w[k]=b.dataset[k];if(k!=='dev'){w.stuck=0;w.passed=0}}});
    if(b.dataset.cyl){w.cyl=+b.dataset.cyl;w.left=w.cyl;w.run=false;w.whistled=false}
    if(b.id==='run'){if(w.left<=0)w.left=w.cyl;w.run=!w.run}
    if(b.id==='refill'){w.left=w.cyl;w.run=false;w.whistled=false}
    if(b.dataset.sym){el.querySelectorAll('[data-sym]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));const ss=$('#symSay');ss.hidden=false;ss.innerHTML='<b>اترك المكان فوراً.</b> «في حالة استخدام أجهزة التنفس المنقية للهواء ينصح بترك المكان فوراً» عند: صعوبة التنفس، أو شم رائحة أو طعم المواد الموجودة بالمكان، أو الشعور بالدوار، أو حدوث تلف بالجهاز (ص 38).'}
    ui()});
  el.addEventListener('input',e=>{if(e.target.id==='age'){w.age=+e.target.value;w.stuck=0;w.passed=0;ui()}});
  ui()}

B.lesson({
 id:'u3-l3',unit:3,order:3,pages:'36–38',
 title:'وقاية القدم والجهاز التنفسي',
 summary:'أحذية السلامة وأنواعها، ونوعا أجهزة التنفس: المزودة للهواء (الأسطوانة والضاغطة) والمنقية للهواء (الفلاتر) ومتى لا تُستعمل.',
 stations:[
  {intro:true},

  {st:1,short:'وقاية القدم',title:'3-3-5 وقاية القدم (<span class="ltr">Foot Protection</span>)',ref:'ص 36',
   q:'مطرقة تسقط على قدمك، أو مسمار في الأرض… أيهما يحميك منه حذاء السلامة؟',
   art:(()=>{const {art,nest,hot,tx,C}=U3S;
    const ex=hot(160,96,84,56,'الغطاء الفولاذي في المقدمة ⟦STEEL CAP⟧: يحمي الأصابع من خطر الأشياء الساقطة.')+hot(30,140,212,24,'النعل المقاوم للثقب ⟦PUNCTURE RESISTANT SOLE⟧: قطعة فولاذ في النعل تحمي من الاختراق بالمواد الحادة مثل المسامير.')+hot(390,0,170,200,'حذاء برقبة عالية تسقط على مقدمته مطرقة: المقدمة الفولاذية تتلقى الضربة بدل الأصابع.');
    return art('حذاء السلامة: غطاء فولاذي في المقدمة ونعل مقاوم للثقب، وحذاء تسقط عليه مطرقة',C.peach,nest(fig38(),10,70,340,121,{extra:ex})+tx(180,232,'حذاء السلامة',{fs:15,w:700})+tx(180,254,'رسم مبسّط عن الشكل',{fs:12})+`<text x="180" y="272" text-anchor="middle" font-size="12" fill="#2C4A40" font-family="var(--mono)">(3-8)</text>`)})(),
   cap:'رسم مبسّط عن الشكل <span class="ltr">(3-8)</span> ص 36.<br><b>مرّر المؤشر على مقدمة الحذاء ونعله والحذاء الآخر (أو المسها في الجوال) لتعرف وظيفة كل جزء.</b>',
   side:[
    {predict:{q:'ما الإصابات التي يقول الكتاب إنها «من أكثر الإصابات» في الأماكن الصناعية؟',opts:[
     ['إصابات العين',false,'العين مهمة، لكن الكتاب في ص 36 يذكر القدم.'],
     ['إصابات الأذن',false,'الأذن تتضرر بالضوضاء، لكن العبارة في الكتاب عن القدم.'],
     ['إصابات القدم',true,'«من أكثر الإصابات التي يتعرض لها العاملون في الأماكن الصناعية هي إصابات القدم» (ص 36).']]}}
   ],
   body:[
    {book:`<p><b>3-3-5 وقاية القدم <span class="ltr">Foot Protection</span>:</b> من أكثر الإصابات التي يتعرض لها العاملون في الأماكن الصناعية هي إصابات القدم، لذلك يجب استمرار ارتداء أحذية السلامة لحماية القدم حيث يبين الشكل <span class="ltr">(3-8)</span> كيفية حماية أحذية السلامة للقدم.</p>`,ref:'ص 36'},
    {tip:`<p>كلمة «استمرار» مهمة: حذاء السلامة لا يُلبس عند الخطر فقط، لأن الجسم الساقط أو المسمار لا ينبه قبل أن يصيب. الحذاء يحمي من الأعلى (الغطاء الفولاذي) ومن الأسفل (النعل المقاوم للثقب).</p>`,title:'من الأعلى ومن الأسفل'},
    {title:'تحقق سريع',widget:(el,B)=>DCML.tf(el,B,{intro:'احكم بحسب ص 36 والشكل <span class="ltr">(3-8)</span>.',items:[
 ['يكفي لبس حذاء السلامة في الأيام التي فيها أعمال رفع ثقيلة.',false,'الكتاب: «يجب استمرار ارتداء أحذية السلامة».'],
 ['الغطاء الفولاذي في مقدمة الحذاء يحمي الأصابع من الأشياء الساقطة.',true,'هذا معنى <span class="ltr">STEEL CAP</span> في الشكل، ونص ص 36.'],
 ['النعل المقاوم للثقب يحمي من المسامير في الأرض.',true,'«قطعة من الفولاذ بين النعل للحماية من مخاطر الاختراق بواسطة المواد الحادة مثل المسامير».']]})}
   ]},

  {st:2,short:'أنواع الأحذية',title:'أنواع أحذية السلامة',ref:'ص 36',
   q:'رجل إطفاء، وفني كهرباء، وعامل في مخزن وقود… هل يلبسون الحذاء نفسه؟',
   art:(()=>{const {art,nest,tx,card,D,C}=U3S;let s='';
    const T=[[188,40,'shoe','جلدي بمقدمة صلب','أحذية سلامة جلدية: مقدمتها مغطاة بالصلب لحماية الأصابع، وقطعة فولاذ بين النعل ضد الاختراق، وتمنع الانزلاق.'],[40,40,'boot','مطاطي طويل','أحذية سلامة مطاطية طويلة: للعمل بالأماكن المبتلة بالمياه دائماً، ويستعملها رجال الإطفاء.'],
     [188,162,'boot','مطاطي للكهرباء','أحذية سلامة مطاطية مخصصة للعاملين في مجال الكهرباء: توفر حماية كبيرة ضد الصعق بالتيار الكهربائي.'],[40,162,'boot','لا يولّد الكهربائية الساكنة','أحذية سلامة مطاطية لا تتسبب في حدوث الكهربائية الساكنة ⟦Antistatic⟧: تستعمل في الأماكن الموجود بها مواد قابلة للاشتعال حتى لا تسبب الشحنات حريقاً.']];
    const mark=[``,`<path d="M0 -8Q-6 0 0 6Q6 0 0 -8Z" fill="#4FB3A9" stroke="${D}" stroke-width="1.4"/>`,`<path d="M2 -10L-5 1H1L-2 10L6 -2H0Z" fill="#F2C14E" stroke="${D}" stroke-width="1.4"/>`,`<path d="M0 -10Q8 -2 4 4Q8 2 6 -2Q12 6 4 10H-4Q-10 4 -4 -4Q-4 2 0 2Q-4 -4 0 -10Z" fill="#E8735A" stroke="${D}" stroke-width="1.2"/>`];
    T.forEach(([x,y,ic,l,tip],i)=>{s+=`<g data-tip="${tip}">${card(x,y,132,108)}${nest(icon(ic,60),x+38,y+8,56,56)}${i?`<g transform="translate(${x+112} ${y+22})">${mark[i]}</g>`:''}${tx(x+66,y+84,l,{fs:i===3?10.5:12.5,w:700})}</g>`});
    return art('أربعة أنواع لأحذية السلامة: جلدي بمقدمة صلب، ومطاطي طويل، ومطاطي للكهرباء، ومطاطي لا يولد الكهربائية الساكنة',C.mint,s+tx(180,298,'أربعة أنواع في ص 36',{fs:13,w:600}))})(),
   cap:'الأنواع الأربعة في ص 36؛ الرموز الصغيرة (قطرة، صاعقة، لهب) للتوضيح.<br><b>مرّر المؤشر على أي بطاقة (أو المسها في الجوال) لتقرأ وصف النوع واستعماله.</b>',
   side:[
    {predict:{q:'أي حذاء يُلبس في مكان فيه مواد قابلة للاشتعال؟',opts:[
     ['الحذاء الجلدي العادي',false,'الجلدي يحمي من السقوط والثقب، والكتاب لم يخصصه لهذه الأماكن.'],
     ['الحذاء المطاطي الذي لا يسبب الكهربائية الساكنة <span class="ltr">Antistatic</span>',true,'«…وتستعمل في الأماكن الموجود بها مواد قابلة للاشتعال حتى لا تتسبب شحنات الكهربائية الساكنة في حدوث حريق» (ص 36).'],
     ['الحذاء المطاطي الطويل',false,'هذا للأماكن المبتلة ورجال الإطفاء.']]}}
   ],
   body:[
    {book:`<p><b>أنواع أحذية السلامة:</b></p><ol>
     <li>أحذية سلامة جلدية تكون مقدمتها مغطاة بالصلب لحماية الأصابع من خطر الأشياء الساقطة كذلك توجد قطعة من الفولاذ بين النعل للحماية من مخاطر الاختراق بواسطة المواد الحادة مثل المسامير وهذه الأنواع أيضاً تمنع الانزلاق في أماكن العمل.</li>
     <li>أحذية سلامة مطاطية طويلة للعمل بالأماكن المبتلة بالمياه دائماً ويستعملها كذلك رجال الإطفاء.</li>
     <li>أحذية سلامة مطاطية مخصصة للعاملين في مجال الكهرباء حيث توفر لهم حماية كبيرة ضد الصعق بالتيار الكهربائي.</li>
     <li>أحذية سلامة مطاطية لا تتسبب في حدوث الكهربائية الساكنة <span class="ltr">Antistatic</span> وتستعمل في الأماكن الموجود بها مواد قابلة للاشتعال حتى لا تتسبب شحنات الكهربائية الساكنة في حدوث حريق في هذه المواد.</li></ol>`,ref:'ص 36'},
    {watch:`<p>في الكتاب وردت «أحذية السلامة المطاطية المخصصة للعاملين في مجال الكهرباء» بلا رقم بين البندين 2 و3، فرقّمناها 3 وصار البند الأخير 4.</p>`,fix:true},
    {add:`<p>الكهربائية الساكنة شحنة تتجمع على الجسم من الاحتكاك (مثل الشرارة الصغيرة حين تلمس مقبض الباب في يوم جاف). في مخازن الوقود والمذيبات قد تكفي هذه الشرارة لإشعال الأبخرة، لذلك يُلبس حذاء يسرّب الشحنة إلى الأرض بهدوء.</p>`,title:'ما الكهربائية الساكنة؟'},
    {title:'مختبر مصغّر: أي حذاء؟',widget:(el,B)=>DCML.sort(el,B,{intro:'اختر نوع حذاء السلامة المناسب لكل عامل (ص 36).',cats:['جلدي بمقدمة صلب','مطاطي طويل','مطاطي للكهرباء','Antistatic'],items:[
 ['عامل في ورشة نجارة فيها مسامير وأخشاب ثقيلة.',0,'الجلدي بمقدمة صلب وقطعة فولاذ في النعل يحمي من الأشياء الساقطة والمسامير.'],
 ['رجل إطفاء.',1,'«ويستعملها كذلك رجال الإطفاء».'],
 ['فني يعمل في لوحات كهربائية.',2,'«مخصصة للعاملين في مجال الكهرباء… ضد الصعق».'],
 ['عامل في مخزن مواد قابلة للاشتعال.',3,'حتى لا تسبب شحنات الكهربائية الساكنة حريقاً.'],
 ['عامل في مغسلة أرضها مبتلة دائماً.',1,'«للعمل بالأماكن المبتلة بالمياه دائماً».']]})}
   ]},

  {st:3,short:'الجهاز التنفسي',title:'3-3-6 وقاية الجهاز التنفسي (<span class="ltr">Respiratory Protection</span>)',ref:'ص 37',
   q:'كمامة على وجهك في غرفة بلا أكسجين… هل تنقذك؟',
   art:(()=>{const {art,nest,tx,card,D,C}=U3S;let s='';
    s+=`<g data-tip="أجهزة التنفس المزودة للهواء ⟦Air-Supplying Respirators⟧: تمد مرتديها بهواء نظيف من أسطوانة أو ضاغطة.">${card(188,50,140,186)}${nest(workerSVG(new Set(['airline']),{airLbl:''}),198,62,120,120,{vb:'70 10 140 140',clip:1})}<rect x="290" y="96" width="22" height="64" rx="9" fill="#F2C14E" stroke="${D}" stroke-width="2"/>${tx(258,204,'المزودة للهواء',{fs:13,w:700})}${tx(258,224,'Air-Supplying',{fs:10.5,mono:1})}</g>`;
    s+=`<g data-tip="أجهزة التنفس المنقية للهواء ⟦Air-Purifying Respirators⟧: تنقي هواء المكان نفسه بالفلتر، ولا تمد بالهواء.">${card(32,50,140,186)}${nest(workerSVG(new Set(['vapor']),{}),42,62,120,120,{vb:'60 10 120 120',clip:1})}${tx(102,204,'المنقية للهواء',{fs:13,w:700})}${tx(102,224,'Air-Purifying',{fs:10.5,mono:1})}</g>`;
    s+=tx(180,272,'قسمان لأجهزة التنفس',{fs:14,w:700})+tx(180,292,'الفرق: من أين يأتي الهواء؟',{fs:12.5});
    return art('قسما أجهزة التنفس: المزودة للهواء والمنقية للهواء',C.lilac,s)})(),
   cap:'قسما أجهزة التنفس في ص 37، رسم توضيحي.<br><b>مرّر المؤشر على كل بطاقة (أو المسها في الجوال) لتعرف الفرق.</b>',
   side:[
    {predict:{q:'متى يتم اختيار جهاز التنفس المناسب حسب الكتاب؟',opts:[
     ['بعد التعرف على طبيعة المواد ودرجة خطورتها، وبعد قياس نسبة الأوكسجين',true,'«ويتم اختيار أجهزة التنفس المناسبة للعمل بعد التعرف على طبيعة المواد… ودرجة خطورتها وبعد إجراء القياسات اللازمة لنسبة الأوكسجين» (ص 37).'],
     ['قبل دخول المكان بأي جهاز متوفر',false,'الكتاب يشترط التعرف على المواد وقياس الأوكسجين أولاً.'],
     ['بعد أن يشعر العامل بالدوار',false,'الاختيار قبل العمل؛ الدوار علامة للخروج فوراً (المحطة 5).']]}}
   ],
   body:[
    {book:`<p><b>3-3-6 وقاية الجهاز التنفسي <span class="ltr">Respiratory Protection</span>:</b> تستعمل أجهزة التنفس المختلفة لتمكين الشخص الذي يرتديها من العمل في أماكن تكون نسبة الأوكسجين فيها غير كافية لعملية التنفس وتسبب خطراً على الحياة، أو أماكن بها غازات سامة أو أتربة تضر بالصحة، ويتم اختيار أجهزة التنفس المناسبة للعمل بعد التعرف على طبيعة المواد التي يتعرض لها العاملون ودرجة خطورتها وبعد إجراء القياسات اللازمة لنسبة الأوكسجين.</p>
     <p><b>أنواع أجهزة التنفس:</b> تنقسم أجهزة التنفس إلى قسمين:</p><ol><li>أجهزة التنفس المزودة للهواء <span class="ltr">Air-Supplying Respirators</span></li><li>أجهزة التنفس المنقية للهواء <span class="ltr">Air-Purifying Respirators</span></li></ol>`,ref:'ص 37'},
    {tip:`<p>الفرق كله في <b>مصدر الهواء</b>: الجهاز المزوّد للهواء يعطيك هواءً نظيفاً من أسطوانة أو ضاغطة، فيصلح حتى لو كان المكان بلا أكسجين. أما الجهاز المنقّي فيأخذ هواء المكان نفسه وينظفه بالفلتر؛ فإذا كان هواء المكان ناقص الأكسجين بقي ناقصاً بعد الفلتر.</p>`,title:'من أين يأتي الهواء؟'},
    {title:'مختبر مصغّر: مزوّد أم منقٍّ؟',widget:(el,B)=>DCML.sort(el,B,{intro:'صنّف كل وصف إلى أحد قسمي أجهزة التنفس.',cats:['مزوّد للهواء','منقٍّ للهواء'],items:[
 ['أسطوانة هواء مضغوط على الظهر <span class="ltr">(SCBA)</span>.',0,'من أمثلة الأجهزة المزودة للهواء (ص 37).'],
 ['كمامة لاصطياد الأتربة.',1,'من أنواع الأجهزة المنقية للهواء (ص 38).'],
 ['قناع متصل بخرطوم طويل من ضاغطة هواء.',0,'يستعمل للعمل مدة طويلة، وهو مزوّد للهواء (ص 37).'],
 ['جهاز بمروحة (شفاط) يدفع هواء المكان خلال فلتر.',1,'النوع الخامس من المنقية للهواء (ص 38).']]})}
   ]},

  {st:4,short:'المزودة للهواء',title:'1- أجهزة التنفس المزودة للهواء',ref:'ص 37–38',
   q:'أسطوانة على ظهرك تكفي ساعة… وماذا لو احتاج العمل نصف يوم؟',
   art:(()=>{const {art,nest,hot,tx,C}=U3S;
    const ex=hot(40,0,140,240,'جهاز التنفس الذاتي ⟦SCBA⟧: أسطوانة هواء مضغوط على الظهر، يخرج منها الهواء عبر منظم الضغط إلى القناع.')+hot(200,0,140,240,'رسم خطي لجهاز ⟦SCBA⟧: قناع وجه كامل وخرطوم إلى منظم الضغط، والأسطوانة محمولة على الظهر.')+hot(370,0,230,240,'للعمل مدة طويلة: ضاغطة هواء توصل بفلاتر ومنظمات للضغط ثم خراطيم طويلة تصل إلى قناع التنفس.');
    return art('أجهزة التنفس المزودة للهواء: جهاز SCBA بأسطوانة على الظهر، وقناع متصل بخط هواء من ضاغطة',C.sand,nest(fig39(),10,66,340,136,{extra:ex})+tx(180,236,'المزودة للهواء',{fs:15,w:700})+tx(180,258,'رسم مبسّط عن الشكل',{fs:12})+`<text x="180" y="276" text-anchor="middle" font-size="12" fill="#2C4A40" font-family="var(--mono)">(3-9)</text>`)})(),
   cap:'رسم مبسّط عن الشكل <span class="ltr">(3-9)</span> ص 38.<br><b>مرّر المؤشر على كل رسم (أو المسه في الجوال) لتعرف نوع الجهاز.</b>',
   side:[
    {predict:{q:'متى يصفر جهاز التنبيه المركب على أسطوانة <span class="ltr">SCBA</span>؟',opts:[
     ['عند بداية العمل',false,'الصفير تنبيه لقرب نفاد الهواء.'],
     ['كل ربع ساعة',false,'لا يذكر الكتاب ذلك.'],
     ['قبل انتهاء كمية الهواء بخمس دقائق',true,'«ويركب على الأسطوانة جهاز يطلق صفيراً ينبه مستعملها قبل انتهاء كمية الهواء بها بخمس دقائق» (ص 37).']]}}
   ],
   body:[
    {book:`<p><b>1- أجهزة التنفس المزودة للهواء:</b> من أمثلتها أجهزة التنفس الذاتية <span class="ltr">Self Contained Breathing Apparatus (SCBA)</span> (شكل <span class="ltr">3-9</span>)، ويتكون الجهاز من أسطوانة بها كمية من الهواء المضغوط تكفي لمدة ساعة أو نصف ساعة (حسب حجم الأسطوانة) ويركب عليها منظم للضغط يخرج منه الهواء خلال خرطوم متصل بالقناع الواقي ويتم حمل الأسطوانة على الظهر والتنقل بها من مكان إلى مكان ويركب على الأسطوانة جهاز يطلق صفيراً ينبه مستعملها قبل انتهاء كمية الهواء بها بخمس دقائق.</p>
     <p>توفر هذه الأنواع من أجهزة التنفس حماية كاملة لمرتديها ضد الغازات السامة والخطرة وفي الأماكن التي تقل بها نسبة الأوكسجين اللازم لعملية التنفس. وهذا النوع من أجهزة التنفس يوفر حماية لمدة محدودة لا تزيد عن ساعة واحدة، وفي حالة ما يتطلب العمل التواجد لمدة طويلة في مكان العمل يتم استخدام ضاغطة هواء توصل بفلاتر ومنظمات للضغط ومن ثم خراطيم طويلة تصل إلى قناع التنفس وبالتالي يستطيع الشخص العمل لمدد طويلة.</p>`,ref:'ص 37'},
    {watch:`<p>صححنا «علىي» = على (ص 37).</p>`,fix:true},
    {watch:`<p>العبارة 8 في أسئلة الوحدة تقول «ساعة ونصف»؛ والمتن يقول «ساعة <b>أو</b> نصف ساعة» حسب حجم الأسطوانة. لا تخلط بينهما.</p>`},
    {title:'مختبر مصغّر: أسطوانة الـ SCBA',widget:(el,B)=>DCML.lab(el,B,{intro:'اختر حجم الأسطوانة (مدتها من الكتاب) وحرّك الوقت منذ بدء العمل (رقم تختاره أنت).',
     predict:{q:'أسطوانة تكفي نصف ساعة. بعد كم دقيقة من البدء يصفر المنبه؟',opts:[['بعد 25 دقيقة',true,'المنبه يصفر قبل انتهاء الهواء بخمس دقائق: <span class="ltr">30 − 5 = 25</span> دقيقة.'],['بعد 30 دقيقة',false,'عند 30 دقيقة يكون الهواء قد انتهى؛ المنبه قبلها بخمس دقائق.'],['بعد 5 دقائق',false,'الخمس دقائق هي المهلة الباقية عند الصفير، لا وقت الصفير.']]},
     ins:[{k:'M',l:'مدة الأسطوانة',seg:[[60,'ساعة'],[30,'نصف ساعة']],v:30},{k:'t',l:'الوقت منذ بدء العمل',u:'min',min:0,max:60,step:1,v:10,dp:0}],
     calc:s=>{const left=Math.max(0,s.M-s.t),wh=left<=5&&left>0,out=left<=0;
      return {facts:[['مدة الأسطوانة',s.M+' min'],['الهواء الباقي تقريباً',left+' min',out||wh?'bad':'hi'],['المنبه',out?'انتهى الهواء':wh?'يصفر':'صامت',wh||out?'bad':'']],
       bars:[{l:'الهواء في الأسطوانة',v:left,max:s.M,txt:left+' / '+s.M+' min',col:out||wh?'--stop':'--on'}],
       msg:out?'انتهت كمية الهواء: كان يجب الخروج عند سماع الصفير. للعمل مدة طويلة يستخدم الكتاب ضاغطة هواء بخراطيم طويلة.':wh?'<b>الصفير:</b> باقٍ أقل من خمس دقائق من الهواء — اخرج من المكان الآن.':'الأسطوانة تعمل، والمنبه سيصفر قبل انتهاء الهواء بخمس دقائق.',cls:out||wh?'warn':''}}})}
   ]},

  {st:5,short:'المنقية للهواء',title:'2- أجهزة التنفس المنقية للهواء',ref:'ص 38–39',
   q:'الفلتر ينظف الهواء… فمتى يصبح الاعتماد عليه خطراً على الحياة؟',
   art:(()=>{const {art,nest,hot,tx,C}=U3S;
    const ex=hot(40,40,120,140,'كمامة غازات وأبخرة تُستعمل مرة واحدة ⟦Disposable Gas/Vapour Mask⟧.')+hot(190,20,110,120,'قناع نصف وجه بخرطوشة فلتر.')+hot(320,10,90,160,'قناع وجه كامل بخرطوشتين صغيرتين.')+hot(440,0,140,210,'جهاز منقٍّ للهواء بمروحة: قناع وجه كامل وخرطوم إلى وحدة البطارية والمروحة والفلتر على الحزام ⟦POWERED AIR-PURIFYING RESPIRATOR⟧.');
    return art('أجهزة التنفس المنقية للهواء: كمامة، وقناع نصف وجه، وقناع وجه كامل، وجهاز بمروحة',C.mint,nest(fig310a(),10,70,340,125,{extra:ex})+tx(180,232,'المنقية للهواء: خمسة أنواع',{fs:15,w:700})+tx(180,256,'رسم مبسّط عن الشكل (3-10) أ',{fs:12}))})(),
   cap:'رسم مبسّط عن الشكل <span class="ltr">(3-10-أ)</span> ص 38.<br><b>مرّر المؤشر على كل جهاز (أو المسه في الجوال) لتعرف اسمه.</b>',
   side:[
    {predict:{q:'نسبة الأوكسجين في خزان <span class="ltr">17%</span>. هل يصلح قناع بفلتر ممتاز؟',opts:[
     ['نعم إذا كان الفلتر جديداً',false,'الفلتر لا يضيف أكسجيناً.'],
     ['لا، فالمنقية لا تستعمل على الإطلاق إذا قلت نسبة الأوكسجين عن <span class="ltr">19.5%</span>',true,'«لا تستعمل هذه الأجهزة على الإطلاق في الأماكن التي تقل بها نسبة الأوكسجين عن 19.5%» (ص 38).'],
     ['نعم إذا كان قناع وجه كامل',false,'نوع القناع لا يغيّر أن الجهاز لا يمد بالهواء.']]}}
   ],
   body:[
    {book:`<p><b>2- أجهزة التنفس المنقية للهواء:</b> توجد خمسة (5) أنواع من هذه الأجهزة كما هو مبين في الشكل <span class="ltr">3-10-أ</span>، <span class="ltr">3-10-ب</span>:</p>
     <ol><li>أجهزة التنفس الخاصة بالأبخرة والغازات.</li><li>أجهزة التنفس لاصطياد الأتربة.</li><li>أجهزة التنفس الخاصة بالأبخرة والغازات واصطياد الأتربة.</li><li>أجهزة التنفس الخاصة بالغازات السامة.</li><li>أجهزة التنفس المنقية للهواء بواسطة مروحة (شفاط).</li></ol>
     <ul><li>هذه الأنواع من أجهزة التنفس يمكنها تنقية الهواء الذي يتنفسه الإنسان من المواد الخطرة ولكنها لا تستطيع إمداده بالهواء اللازم لعملية التنفس.</li>
     <li>لا تستعمل هذه الأجهزة على الإطلاق في الأماكن التي تقل بها نسبة الأوكسجين عن <span class="ltr">19.5%</span>.</li>
     <li>لا تستعمل هذه الأجهزة في الأماكن غير المعروف تركيز المواد السامة بها أو حينما تكون تركيزات هذه المواد عالية بحيث تصل إلى الحد الوشيك الخطر على الحياة أو الصحة <span class="ltr">(IDLH)</span>.</li>
     <li>يجب التأكد من نوع الفلتر المستخدم مع هذه الأجهزة وأنه يناسب الخطر الموجود بالمكان بحيث لا يتم استخدام الفلاتر الخاصة بالأتربة في الأماكن الموجود بها غازات وأبخرة سامة والعكس صحيح.</li>
     <li>يتم التخلص من الفلاتر في حالة انتهاء تاريخ الصلاحية الخاص بها – وفي حالة فتح الفلتر واستعماله يتم تسجيل تاريخ الاستعمال عليه ويتم التخلص منه بعد ستة أشهر.</li></ul>
     <p>في حالة استخدام أجهزة التنفس المنقية للهواء ينصح بترك المكان فوراً في الحالات التالية:</p><ol><li>الشعور بصعوبة التنفس.</li><li>في حالة شم رائحة أو طعم المواد الموجودة بالمكان.</li><li>في حالة الشعور بالدوار.</li><li>في حالة حدوث تلف بالجهاز.</li></ol>`,ref:'ص 38'},
    {html:`<p><b>الشكل <span class="ltr">(3-10-ب)</span></b> قناع وجه كامل بخرطوشتي فلتر، وكمامة غبار بصمام زفير، وطريقة لبس الكمامة في ثلاث خطوات — رسم مبسّط، <span class="ref">ص 39</span>:</p>${box(fig310b(),620)}`},
    {tip:`<p>«شم رائحة المادة أو طعمها» يعني أن المادة تمر من الفلتر أو من حول القناع؛ فالجهاز لم يعد يحميك، لذلك تترك المكان فوراً ولا تكمل العمل.</p>`,title:'لماذا الرائحة علامة خطر؟'},
    {title:'مختبر مصغّر: تبقى أم تخرج؟',widget:(el,B)=>DCML.cases(el,B,{intro:'عامل يلبس جهازاً منقياً للهواء. ماذا يفعل؟',cases:[
 {q:'بدأ يشم رائحة المذيب الذي يعمل به.',opts:[
  ['يشد الأربطة ويكمل العمل',false,'الكتاب ينصح بترك المكان فوراً عند شم رائحة المواد أو طعمها.'],
  ['يترك المكان فوراً',true,'الحالة 2 في قائمة ص 38.']]},
 {q:'المكان فيه غازات سامة، والفلتر المتاح فلتر أتربة.',opts:[
  ['لا يستعمله؛ يجب فلتر يناسب الخطر الموجود',true,'«لا يتم استخدام الفلاتر الخاصة بالأتربة في الأماكن الموجود بها غازات وأبخرة سامة والعكس صحيح».'],
  ['يستعمله، فأي فلتر أفضل من لا شيء',false,'الفلتر غير المناسب يعطي أماناً كاذباً.']]},
 {q:'فلتر فُتح واستُعمل قبل سبعة أشهر، وتاريخ صلاحيته لم ينته.',opts:[
  ['يستعمله ما دام تاريخ الصلاحية باقياً',false,'بعد الفتح والاستعمال يُسجل التاريخ ويُتخلص منه بعد ستة أشهر.'],
  ['يتخلص منه',true,'«…يتم تسجيل تاريخ الاستعمال عليه ويتم التخلص منه بعد ستة أشهر» (ص 38).']]}]})},
    {tip:`<p>مقارنة الجهازين في أماكن مختلفة (نسبة الأوكسجين ونوع الخطر) تجدها في تبويب «المختبر».</p>`}
   ]},

  {recap:[
   'إصابات القدم من أكثر الإصابات، فيجب استمرار لبس حذاء السلامة: غطاء فولاذي للأصابع ونعل مقاوم للثقب.',
   'الأحذية أربعة: جلدية بمقدمة صلب، مطاطية طويلة للأماكن المبتلة والإطفاء، مطاطية للكهرباء، ومطاطية <span class="ltr">Antistatic</span> للأماكن القابلة للاشتعال.',
   'أجهزة التنفس قسمان: مزودة للهواء (أسطوانة <span class="ltr">SCBA</span> ساعة أو نصف ساعة وصفير قبل النفاد بخمس دقائق، أو ضاغطة للمدد الطويلة) ومنقية للهواء (خمسة أنواع).',
   'المنقية لا تمد بالهواء: لا تُستعمل تحت <span class="ltr">19.5%</span> أكسجين ولا عند تركيز مجهول أو <span class="ltr">IDLH</span>، والفلتر يناسب الخطر ويُرمى بعد ستة أشهر من فتحه.',
   'اترك المكان فوراً عند صعوبة التنفس، أو شم الرائحة أو الطعم، أو الدوار، أو تلف الجهاز.']}
],
 theory:[
  {h:'3-3-5 وقاية القدم (<span class="ltr">Foot Protection</span>)',ref:'ص 36',html:`<p>من أكثر الإصابات التي يتعرض لها العاملون في الأماكن الصناعية هي <b>إصابات القدم</b>، لذلك يجب استمرار ارتداء أحذية السلامة لحماية القدم، حيث يبين الشكل <span class="ltr">(3-8)</span> كيفية حماية أحذية السلامة للقدم.</p>`},
  {fig:'(3-8)',ref:'ص 36',caption:'حذاء السلامة: غطاء فولاذي في المقدمة <span class="ltr">(STEEL CAP)</span> ونعل مقاوم للثقب <span class="ltr">(PUNCTURE RESISTANT SOLE)</span>، وحذاء برقبة عالية تسقط على مقدمته مطرقة. رسم توضيحي مبسّط.',draw:()=>box(fig38(),600)},
  {h:'أنواع أحذية السلامة',ref:'ص 36',html:`<ol><li><b>أحذية سلامة جلدية</b> تكون مقدمتها مغطاة بالصلب لحماية الأصابع من خطر الأشياء الساقطة، كذلك توجد قطعة من الفولاذ بين النعل للحماية من مخاطر الاختراق بواسطة المواد الحادة مثل المسامير، وهذه الأنواع أيضاً تمنع الانزلاق في أماكن العمل.</li>
   <li><b>أحذية سلامة مطاطية طويلة</b> للعمل بالأماكن المبتلة بالمياه دائماً، ويستعملها كذلك رجال الإطفاء.</li>
   <li><b>أحذية سلامة مطاطية مخصصة للعاملين في مجال الكهرباء</b>، حيث توفر لهم حماية كبيرة ضد الصعق بالتيار الكهربائي.</li>
   <li><b>أحذية سلامة مطاطية لا تتسبب في حدوث الكهربائية الساكنة</b> <span class="ltr">Antistatic</span>، وتستعمل في الأماكن الموجود بها مواد قابلة للاشتعال، حتى لا تتسبب شحنات الكهربائية الساكنة في حدوث حريق في هذه المواد.</li></ol>`},
  {h:'3-3-6 وقاية الجهاز التنفسي (<span class="ltr">Respiratory Protection</span>)',ref:'ص 37',html:`<p>تستعمل أجهزة التنفس المختلفة لتمكين الشخص الذي يرتديها من العمل في أماكن تكون <b>نسبة الأوكسجين فيها غير كافية</b> لعملية التنفس وتسبب خطراً على الحياة، أو أماكن بها <b>غازات سامة أو أتربة</b> تضر بالصحة. ويتم اختيار أجهزة التنفس المناسبة للعمل بعد التعرف على طبيعة المواد التي يتعرض لها العاملون ودرجة خطورتها، وبعد إجراء القياسات اللازمة لنسبة الأوكسجين.</p>
   <p><b>أنواع أجهزة التنفس:</b> تنقسم أجهزة التنفس إلى قسمين:</p><ol><li>أجهزة التنفس <b>المزودة للهواء</b> <span class="ltr">Air-Supplying Respirators</span>.</li><li>أجهزة التنفس <b>المنقية للهواء</b> <span class="ltr">Air-Purifying Respirators</span>.</li></ol>`},
  {h:'1- أجهزة التنفس المزودة للهواء',ref:'ص 37',html:`<p>من أمثلتها أجهزة التنفس الذاتية <span class="ltr">Self Contained Breathing Apparatus (SCBA)</span> (شكل <span class="ltr">3-9</span>). ويتكون الجهاز من <b>أسطوانة بها كمية من الهواء المضغوط تكفي لمدة ساعة أو نصف ساعة</b> (حسب حجم الأسطوانة)، ويركب عليها منظم للضغط يخرج منه الهواء خلال خرطوم متصل بالقناع الواقي. ويتم حمل الأسطوانة على الظهر والتنقل بها من مكان إلى مكان، ويركب على الأسطوانة جهاز <b>يطلق صفيراً ينبه مستعملها قبل انتهاء كمية الهواء بها بخمس دقائق</b>.</p>
   <p>توفر هذه الأنواع من أجهزة التنفس <b>حماية كاملة</b> لمرتديها ضد الغازات السامة والخطرة، وفي الأماكن التي تقل بها نسبة الأوكسجين اللازم لعملية التنفس. وهذا النوع يوفر حماية لمدة محدودة لا تزيد عن ساعة واحدة. وفي حالة ما يتطلب العمل التواجد لمدة طويلة في مكان العمل يتم استخدام <b>ضاغطة هواء</b> توصل بفلاتر ومنظمات للضغط، ومن ثم خراطيم طويلة تصل إلى قناع التنفس، وبالتالي يستطيع الشخص العمل لمدد طويلة.</p>`},
  {fig:'(3-9)',ref:'ص 38',caption:'من اليمين: عامل يرتدي جهاز <span class="ltr">SCBA</span> وأسطوانة الهواء على ظهره، ورسم خطي لجهاز <span class="ltr">SCBA</span>، وعامل يتصل قناعه بخرطوم طويل من خط هواء مضغوط عبر وحدة فلاتر ومنظمات. رسم توضيحي مبسّط.',draw:()=>box(fig39(),620)},
  {h:'2- أجهزة التنفس المنقية للهواء',ref:'ص 38',html:`<p>توجد خمسة أنواع من هذه الأجهزة كما هو مبين في الشكلين <span class="ltr">(3-10-أ)</span> و<span class="ltr">(3-10-ب)</span>:</p><ol><li>أجهزة التنفس الخاصة بالأبخرة والغازات.</li><li>أجهزة التنفس لاصطياد الأتربة.</li><li>أجهزة التنفس الخاصة بالأبخرة والغازات واصطياد الأتربة.</li><li>أجهزة التنفس الخاصة بالغازات السامة.</li><li>أجهزة التنفس المنقية للهواء بواسطة مروحة (شفاط).</li></ol>`},
  {fig:'(3-10-أ)',ref:'ص 38',caption:'كمامة غازات وأبخرة تُستعمل مرة واحدة، وقناع نصف وجه بخرطوشة فلتر، وقناع وجه كامل بخرطوشتين، وجهاز منقٍّ للهواء بمروحة وبطارية على الحزام <span class="ltr">(PAPR)</span>. رسم توضيحي مبسّط.',draw:()=>box(fig310a(),620)},
  {fig:'(3-10-ب)',ref:'ص 39',caption:'قناع وجه كامل بخرطوشتي فلتر، وكمامة غبار قابلة للطي بصمام زفير، وطريقة لبس الكمامة: (1) توضع على الأنف والفم، (2) يُسحب الحزام فوق الرأس، (3) يُضبط الحزامان خلف الرأس. رسم توضيحي مبسّط.',draw:()=>box(fig310b(),620)},
  {html:`<ul><li>هذه الأنواع من أجهزة التنفس يمكنها تنقية الهواء الذي يتنفسه الإنسان من المواد الخطرة، ولكنها <b>لا تستطيع إمداده بالهواء</b> اللازم لعملية التنفس.</li>
   <li>لا تستعمل هذه الأجهزة على الإطلاق في الأماكن التي <b>تقل بها نسبة الأوكسجين عن <span class="ltr">19.5%</span></b>.</li>
   <li>لا تستعمل هذه الأجهزة في الأماكن <b>غير المعروف تركيز المواد السامة بها</b>، أو حينما تكون تركيزات هذه المواد عالية بحيث تصل إلى الحد الوشيك الخطر على الحياة أو الصحة <span class="ltr">(IDLH)</span>.</li>
   <li>يجب التأكد من <b>نوع الفلتر</b> المستخدم مع هذه الأجهزة وأنه يناسب الخطر الموجود بالمكان، بحيث لا يتم استخدام الفلاتر الخاصة بالأتربة في الأماكن الموجود بها غازات وأبخرة سامة، والعكس صحيح.</li>
   <li>يتم التخلص من الفلاتر في حالة انتهاء تاريخ الصلاحية الخاص بها، وفي حالة فتح الفلتر واستعماله يتم تسجيل تاريخ الاستعمال عليه ويتم <b>التخلص منه بعد ستة أشهر</b>.</li></ul>
   <p>في حالة استخدام أجهزة التنفس المنقية للهواء ينصح <b>بترك المكان فوراً</b> في الحالات التالية:</p><ol><li>الشعور بصعوبة التنفس.</li><li>في حالة شم رائحة أو طعم المواد الموجودة بالمكان.</li><li>في حالة الشعور بالدوار.</li><li>في حالة حدوث تلف بالجهاز.</li></ol>`},
  {note:TIP+'الفرق كله في <b>مصدر الهواء</b>: الجهاز المزوّد للهواء يعطيك هواءً نظيفاً من أسطوانة أو ضاغطة، فيصلح حتى لو كان المكان بلا أكسجين. أما الجهاز المنقّي فيأخذ هواء المكان نفسه وينظفه بالفلتر، فإذا كان هواء المكان ناقص الأكسجين بقي ناقصاً بعد الفلتر.'},
  {err:`في ص 36 وردت «أحذية السلامة المطاطية المخصصة للعاملين في مجال الكهرباء» بلا رقم بين البندين 2 و3، فرقّمناها هنا 3 وصار البند الأخير 4. وصححنا «علىي» = على (ص 37).`}
 ],
 lab:(el)=>respLab(el),
 quiz:[
  {q:'ما فائدة قطعة الفولاذ داخل نعل حذاء السلامة الجلدي؟',o:['تمنع الكهرباء الساكنة','تحمي من الاختراق بالمواد الحادة مثل المسامير','تجعل الحذاء أخف','تحمي من الماء'],c:1,e:'(ص 36).'},
  {q:'أي حذاء يُلبس في مكان فيه مواد قابلة للاشتعال؟',o:['الحذاء الجلدي العادي','الحذاء المطاطي الطويل','الحذاء المطاطي الذي لا يسبب الكهربائية الساكنة (Antistatic)','أي حذاء'],c:2,e:'حتى لا تسبب شحنات الكهربائية الساكنة حريقاً (ص 36).'},
  {q:'كم تكفي أسطوانة جهاز SCBA؟',o:['ساعة أو نصف ساعة حسب حجمها','ساعة ونصف','يوم عمل كامل','عشر دقائق'],c:0,e:'«تكفي لمدة ساعة أو نصف ساعة (حسب حجم الأسطوانة)» (ص 37).'},
  {q:'متى يصفر جهاز التنبيه في أسطوانة SCBA؟',o:['عند بداية العمل','قبل انتهاء الهواء بخمس دقائق','عند امتلاء الأسطوانة','كل ربع ساعة'],c:1,e:'(ص 37).'},
  {q:'لماذا لا يُستعمل الجهاز المنقي للهواء إذا قلت نسبة الأكسجين عن 19.5%؟',o:['لأن الفلتر يسد','لأنه ينقي هواء المكان ولا يمده بالهواء اللازم للتنفس','لأنه ثقيل','لأنه يحتاج كهرباء'],c:1,e:'(ص 38).'},
  {q:'فُتح فلتر جهاز التنفس واستُعمل. متى يتم التخلص منه؟',o:['بعد شهر','بعد ستة أشهر من تاريخ الاستعمال المسجل عليه','بعد سنة','لا يتم التخلص منه'],c:1,e:'(ص 38).'}
 ]
});

/* =====================================================================
   LESSON 4 — respirator selection, fit checks, cleaning; belts, hands, body (ص 39–44)
   ===================================================================== */
/* worker with half-mask for the seal checks — o:{test:'neg'|'pos', hands:0..1, press:-1..1, leak:bool, t, static:1} */
function sealSVG(o){const hp=o.hands||0,pr=o.press||0;let s='';
  s+=`<rect x="0" y="0" width="400" height="330" rx="12" style="fill:var(--surface-2)"/>`;
  s+=`<path d="M70 330Q76 252 150 240H250Q324 252 330 330Z" ${S(SC.blue,'var(--fg)',1.4)}/><rect x="182" y="214" width="36" height="30" ${S('var(--surface-2)')}/>`;
  s+=`<ellipse cx="200" cy="150" rx="70" ry="84" ${S('var(--surface)','var(--fg)',1.6)}/>`;
  s+=`<path d="M128 112Q128 54 200 52T272 112Z" ${S(SC.yellow,'var(--fg)',1.6)}/><path d="M118 110H282V120H118Z" ${S(SC.yellow,'var(--fg)',1.4)}/>`;
  s+=`<circle cx="176" cy="140" r="5" style="fill:var(--fg)"/><circle cx="224" cy="140" r="5" style="fill:var(--fg)"/>`;
  // mask: depth changes with pressure (collapse inward for negative, bulge for positive)
  const d=18+pr*10;
  s+=`<path d="M152 168Q200 ${148-pr*4} 248 168L${242+pr*3} ${206+pr*3}Q200 ${226+d} ${158-pr*3} ${206+pr*3}Z" style="fill:${pr<-0.3?'var(--ink-dim)':'var(--wire)'};stroke:var(--fg);stroke-width:1.8"/>`;
  s+=`<path d="M152 172L130 150M248 172L270 150M158 200L132 214M242 200L268 214" ${S('','var(--fg)',2)}/>`;
  s+=`<circle cx="144" cy="196" r="20" ${S('var(--surface)','var(--fg)',1.8)}/><circle cx="256" cy="196" r="20" ${S('var(--surface)','var(--fg)',1.8)}/><path d="M134 196H154M266 196H246" ${S('','var(--muted)',1.2)}/>`;
  s+=`<circle cx="200" cy="${206+d*0.5}" r="9" ${S('var(--surface)','var(--fg)',1.6)}/>`;
  if(o.leak&&o.t!=null){const k=(o.t*2)%1;[[152,180,-1],[248,180,1],[200,154,0]].forEach(([x,y,sx])=>{const dir=o.test==='neg'?-1:1,dd=(6+k*14)*dir;s+=`<path d="M${x+sx*dd} ${y-(sx===0?dd:0)}l${sx===0?-4:sx*-5*dir} ${sx===0?5*dir:-4}m${sx===0?4:sx*5*dir} ${sx===0?-5*dir:4}l${sx===0?4:sx*-5*dir} ${sx===0?5*dir:4}" ${S('','var(--stop)',2.4)}/>`})}
  // hands
  const hand=(x,y)=>`<g transform="translate(${x} ${y})"><ellipse cx="0" cy="0" rx="26" ry="30" ${S('var(--live-soft)','var(--fg)',1.6)}/>${[-15,-5,5,15].map(fx=>`<path d="M${fx} -24V-36" style="stroke:var(--fg);stroke-width:1.2"/>`).join('')}</g>`;
  const lerp=(a,b)=>a+(b-a)*hp;
  if(o.test==='neg'){s+=hand(lerp(110,144),lerp(330,196))+hand(lerp(290,256),lerp(330,196))}
  else if(o.test==='pos'){s+=hand(lerp(300,200),lerp(330,214))}
  return svg(400,330,s,o.test==='pos'?'فحص الضغط الموجب: راحة اليد على صمام الزفير':'فحص الضغط السالب: راحتا اليدين على فتحتي دخول الهواء')}
function fig313(){let s='';
  // full body harness (back view)
  s+=`<g transform="translate(150 0)">${head(0,40,22)}<path d="M-22 30Q-22 12 0 12T22 30Z" style="fill:var(--surface);stroke:var(--fg);stroke-width:1.2"/><path d="M-40 70Q0 58 40 70L44 170H-44Z" ${S('var(--surface-2)')}/><path d="M-30 170V250M30 170V250" ${S('','var(--fg)',22)}/><path d="M-30 170V250M30 170V250" ${S('','var(--surface-2)',19)}/>
   <path d="M-26 66L26 150M26 66L-26 150M-40 118H40M-40 170Q-30 196 -10 186M40 170Q30 196 10 186" ${S('','#6db3e0',5)}/><circle cx="0" cy="92" r="7" ${S('','var(--fg)',2.4)}/>
   <rect x="-6" y="98" width="12" height="26" rx="2" ${S(SC.yellow)}/><path d="M0 124Q40 150 60 120T110 130" ${S('','#d4a017',4)}/><circle cx="114" cy="130" r="5" ${S('','var(--fg)',2)}/><rect x="120" y="120" width="10" height="22" rx="2" ${S('var(--wire)')}/><path d="M138 10V260" ${S('','#d4a017',6)}/></g>`;
  const lab=(x1,y1,x2,y2,t)=>`<path d="M${x1} ${y1}L${x2} ${y2}" ${S('','var(--muted)',1)}/>`+lt(x2+3,y2+4,t,{a:'start',fs:10.5});
  s+=lab(150,92,20,20,'Locking Snap Hook').replace('text-anchor="start"','text-anchor="start"')+lab(275,130,300,90,'Rope Grab')+lab(264,130,300,150,'D-Clip')+lab(200,140,300,200,'Lanyard with Shock Absorber')+lab(288,240,300,250,'Lifeline');
  // waist belt
  s+=`<g transform="translate(480 130)"><ellipse cx="0" cy="0" rx="62" ry="26" ${S('','#8d5a2b',12)}/>${[-40,-20,0,20,40].map(x=>`<circle cx="${x}" cy="24" r="2.4" style="fill:var(--fg)"/>`).join('')}<rect x="-8" y="16" width="16" height="16" rx="2" ${S('','var(--fg)',2)}/><path d="M-50 10Q-80 60 -40 90M50 10Q80 60 40 90" ${S('','var(--wire)',6)}/><path d="M-44 84l-6 14h10zM44 84l6 14h-10z" ${S('var(--wire)','var(--fg)',1.6)}/></g>`+lt(480,250,'Locking Snap Hooks',{fs:10.5});
  return svg(600,270,s,'حزام الباراشوت وحبل الإنقاذ، والحزام العادي')}
const glovesPhoto=(k)=>{let s='';
  if(k==='leather')s=`<path d="M40 150V100L24 76Q20 66 30 64T44 74L50 86V40Q50 32 58 32T66 40V80V30Q66 22 74 22T82 30V80V36Q82 28 90 28T98 36V82V48Q98 40 106 40T114 48V104Q114 130 100 150Z" ${S('#cdb49a','var(--fg)',1.4)}/><path d="M40 150H100V180H40Z" style="fill:${SC.red};opacity:.75"/><path d="M40 160H100M40 170H100" style="stroke:${SC.blue};stroke-width:3"/>`;
  if(k==='rubber')s=`<path d="M40 180V100L24 76Q20 66 30 64T44 74L50 86V40Q50 32 58 32T66 40V80V30Q66 22 74 22T82 30V80V36Q82 28 90 28T98 36V82V48Q98 40 106 40T114 48V104Q114 140 104 180Z" style="fill:#222;stroke:var(--fg);stroke-width:1.2"/><path d="M60 60Q64 120 56 170" style="stroke:#666;stroke-width:3"/>`;
  if(k==='heat')s=`<path d="M40 160V100L24 76Q20 66 30 64T44 74L50 86V40Q50 32 58 32T66 40V80V30Q66 22 74 22T82 30V80V36Q82 28 90 28T98 36V82V48Q98 40 106 40T114 48V104Q114 140 104 160Z" ${S('#a0662f','var(--fg)',1.4)}/><path d="M44 140Q72 132 108 140" style="stroke:#6e4320;stroke-width:3;fill:none"/>`;
  if(k==='coverall')s=`${head(70,30,16)}<path d="M44 52H96L108 120L98 124L92 92V180H74V112H66V180H48V92L42 124L32 120Z" ${S(SC.blue,'var(--fg)',1.4)}/><path d="M40 112L50 108M100 112L90 108M48 160H66M74 160H92" style="stroke:#ccc;stroke-width:4"/>`;
  if(k==='apron')s=`<path d="M52 20Q70 4 88 20" ${S('','#222',4)}/><path d="M50 22H90L94 60H112V66H94L104 180H36L46 66H28V60H46Z" ${S('#e8e8e8','var(--fg)',1.4)}/>`;
  return `<svg viewBox="0 0 140 190" width="120" height="163" aria-hidden="true">${s}</svg>`};
const photoRow=items=>`<div style="display:flex;justify-content:center;gap:22px;flex-wrap:wrap">${items.map(([k,c])=>`<div style="text-align:center">${glovesPhoto(k)}<div class="sub">${c}</div></div>`).join('')}</div>`;

/* decision tree — book steps ص 39–40 */
function selLab(host){
  const w={o2:20.9,type:'gas',conc:'mid',eye:'no',res:'',case:0,score:0,answered:{}};
  host.innerHTML=`<div class="panel c12"><h2>شجرة اختيار جهاز التنفس <small>مبنية على «طريقة اختيار جهاز التنفس المناسب» ص 39–40</small></h2>
    <p class="sub">غيّر قياسات المكان، وتابع الخطوات المضيئة حتى تصل إلى الجهاز المناسب.</p>
    <div class="wrap-in" style="align-items:flex-end">
     <label class="sub" style="display:flex;flex-direction:column;gap:2px;min-width:220px;flex:1">1- نسبة الأوكسجين المقيسة: <b id="sO" class="ltr" style="color:var(--fg)"></b><input type="range" id="sOr" min="10" max="23" step="0.1" value="20.9" style="accent-color:var(--blue);width:100%"></label>
     <div><div class="sub">2- نوع المادة</div>${segHTML('ty',[['gas','غازات وأبخرة'],['dust','أتربة سامة'],['both','الاثنان']],w.type,1)}</div>
    </div>
    <div class="wrap-in" style="align-items:flex-end">
     <div><div class="sub">3- تركيز المادة</div>${segHTML('cc',[['lo','أقل من TLV'],['mid','بين TLV و IDLH'],['hi','IDLH أو أكثر'],['unk','غير معروف']],w.conc,1)}</div>
     <div><div class="sub">5- هل تسبب المادة حساسية للعين؟</div>${segHTML('ey',[['no','لا'],['yes','نعم']],w.eye)}</div>
    </div>
    <div class="grid" style="margin-top:0"><div class="c7" id="tree"></div><div class="c5"><div class="svgbox" id="sW" style="max-width:220px;margin-inline:auto"></div><div class="callout" id="sRes"></div></div></div></div>
   <div class="panel c12"><h2>اختبر نفسك: ماذا يلبس العامل؟</h2><div id="cases"></div></div>`;
  const $=s=>host.querySelector(s);
  const CASES=[
   {t:'خزان مغلق قيست فيه نسبة الأوكسجين 17%.',a:'scba',e:'الأكسجين أقل من 19.5% ← جهاز تنفس مزود للهواء (SCBA) — البند 1.'},
   {t:'ورشة نجارة: الأكسجين 20.9%، وغبار الخشب تركيزه أعلى من TLV وأقل من IDLH، ولا يسبب حساسية للعين.',a:'half',e:'البند 4: جهاز منقٍّ بفلتر أتربة، والبند 5: المادة لا تهيج العين ← نصف وجه.'},
   {t:'مخزن مذيبات: الأكسجين 20.5%، وأبخرة تركيزها بين TLV و IDLH، وتسبب حساسية للعين.',a:'full',e:'البند 4: جهاز منقٍّ بفلتر أبخرة وغازات، والبند 5: المادة تهيج العين ← قناع يغطي الوجه بالكامل.'},
   {t:'مكان أكسجينه 20.9%، وتركيز المادة أقل من TLV.',a:'none',e:'البند 3: يمكن السماح بالعمل بدون استخدام أجهزة التنفس.'},
   {t:'تسرب غاز في مكان أكسجينه 20%، ولا يُعرف تركيز الغاز.',a:'scba',e:'الجهاز المنقي «لا يستعمل في الأماكن غير المعروف تركيز المواد السامة بها» (ص 38) ← جهاز مزود للهواء.'}];
  const OPT=[['scba','جهاز مزوّد للهواء (SCBA)'],['half','جهاز منقٍّ نصف وجه (Half Mask)'],['full','جهاز منقٍّ للوجه كاملاً (Full Face)'],['none','بدون جهاز تنفس']];
  function path(){const o2low=w.o2<19.5;if(o2low)return {n:[1],res:'scba'};
    if(w.conc==='lo')return {n:[1,2,3],res:'none'};
    if(w.conc==='hi'||w.conc==='unk')return {n:[1,2,3,'x'],res:'scba'};
    return {n:[1,2,3,4,5],res:w.eye==='yes'?'full':'half'}}
  function draw(){$('#sO').textContent=w.o2.toFixed(1)+' %';const P=path();w.res=P.res;
    const on=k=>P.n.includes(k);
    const node=(k,t,leaf)=>`<div style="border:2px solid ${on(k)?'var(--blue)':'var(--line)'};background:${on(k)?'var(--blue-soft)':'var(--surface)'};border-radius:10px;padding:8px 10px;font-size:14px;line-height:1.6;${on(k)?'':'opacity:.6'}">${t}${leaf?`<div style="margin-top:4px">${leaf}</div>`:''}</div>`;
    const arrow=k=>`<div style="text-align:center;color:${on(k)?'var(--blue)':'var(--line)'};font-size:18px;line-height:1">↓</div>`;
    const out=(cond,txt,good)=>`<span style="display:inline-block;margin:2px 4px 0 0;padding:2px 8px;border-radius:8px;font-size:13px;${cond?`background:${good?'var(--on-soft)':'var(--live-soft)'};border:1.5px solid ${good?'var(--on)':'var(--live)'};font-weight:700`:'border:1px dashed var(--line);color:var(--muted)'}">${txt}</span>`;
    const o2low=w.o2<19.5;
    $('#tree').innerHTML=node(1,`<b>1- قِس نسبة الأوكسجين.</b>`,out(o2low,'أقل من 19.5% ← جهاز مزود للهواء (SCBA)')+out(!o2low,'أكثر من 19.5% ← تابع',1))+arrow(2)+
     node(2,`<b>2- حدّد نوع المواد السامة والخطرة:</b> ${w.type==='gas'?'غازات وأبخرة':w.type==='dust'?'أتربة سامة':'غازات وأبخرة وأتربة'}.`)+arrow(3)+
     node(3,`<b>3- قِس درجة تركيزها.</b>`,out(on(3)&&w.conc==='lo','أقل من TLV ← العمل بدون جهاز تنفس',1)+out(on(3)&&w.conc==='mid','بين TLV و IDLH ← تابع',1)+out(on(3)&&(w.conc==='hi'||w.conc==='unk'),'IDLH أو أكثر، أو غير معروف ← جهاز مزود للهواء *'))+arrow(4)+
     node(4,`<b>4- اختر جهازاً منقياً</b> للأبخرة والغازات أو للأتربة، و<b>فلتراً</b> يناسب نوع المادة.`,on(4)?out(1,'الفلتر: '+(w.type==='gas'?'للأبخرة والغازات':w.type==='dust'?'لاصطياد الأتربة':'للأبخرة والغازات والأتربة'),1):'')+arrow(5)+
     node(5,`<b>5- هل تسبب المادة حساسية للعين؟</b>`,out(on(5)&&w.eye==='no','لا ← نصف وجه Half Mask',1)+out(on(5)&&w.eye==='yes','نعم ← وجه كامل Full Face-Piece',1))+
     `<p class="sub" style="margin-top:6px">* حالة «IDLH أو أكثر / غير معروف» لا يذكرها الكتاب في خطوات الاختيار؛ أخذناها من شرط ص 38: الجهاز المنقي «لا يستعمل في الأماكن غير المعروف تركيز المواد السامة بها أو حينما تصل إلى IDLH».</p>`;
    const items={scba:['airline'],half:[w.type==='dust'?'dust':w.type==='gas'?'vapor':'dv'],full:['airline'],none:[]}[P.res];
    $('#sW').innerHTML=workerSVG(new Set(P.res==='full'?[]:items),{airLbl:P.res==='scba'?'هواء من الأسطوانة':''}).replace('viewBox="0 0 240 370"','viewBox="0 0 240 200"').replace(/<\/svg>$/,(P.res==='full'?`<ellipse cx="120" cy="70" rx="30" ry="36" style="fill:var(--wire);stroke:var(--fg);stroke-width:1.8;opacity:.97"/><ellipse cx="120" cy="60" rx="21" ry="13" style="fill:var(--blue-soft);stroke:var(--fg);stroke-width:1.4"/><circle cx="94" cy="96" r="9" style="fill:var(--surface);stroke:var(--fg);stroke-width:1.4"/><circle cx="146" cy="96" r="9" style="fill:var(--surface);stroke:var(--fg);stroke-width:1.4"/>`:'')+'</svg>');
    $('#sRes').innerHTML={scba:'<b>جهاز تنفس مزوّد للهواء (SCBA).</b>'+(o2low?' لأن الأكسجين أقل من 19.5%.':' لأن الجهاز المنقي لا يُستعمل عند IDLH أو عند عدم معرفة التركيز (ص 38).'),none:'<b>يمكن العمل بدون جهاز تنفس</b>، لأن التركيز أقل من الحد المسموح (TLV).',half:'<b>جهاز منقٍّ نصفي (Half Mask)</b> بفلتر '+(w.type==='gas'?'للأبخرة والغازات':w.type==='dust'?'لاصطياد الأتربة':'للأبخرة والغازات والأتربة')+'.',full:'<b>جهاز منقٍّ يغطي الوجه بالكامل (Full Face-Piece Mask)</b> بفلتر '+(w.type==='gas'?'للأبخرة والغازات':w.type==='dust'?'لاصطياد الأتربة':'للأبخرة والغازات والأتربة')+'، لأن المادة تسبب حساسية للعين.'}[P.res];
    const C=CASES[w.case],ans=w.answered[w.case];
    $('#cases').innerHTML=`<p><b>الحالة ${w.case+1} من ${CASES.length}:</b> ${C.t}</p><div style="display:flex;flex-wrap:wrap;gap:6px">${OPT.map(([k,t])=>`<button class="chip" data-ans="${k}" aria-pressed="${ans===k}">${t}</button>`).join('')}</div>`+
     (ans?`<div class="callout${ans===C.a?'':' err'}">${ans===C.a?'<b style="color:var(--on)">صحيح.</b> ':'<b>ليس هذا.</b> الصحيح: '+OPT.find(o=>o[0]===C.a)[1]+'. '}${C.e}</div>`:'')+
     `<div class="wrap-in"><button class="btn" data-cs="-1">السابقة</button><button class="btn" data-cs="1">التالية</button><span class="sub">إجاباتك الصحيحة: ${Object.keys(w.answered).filter(k=>w.answered[k]===CASES[k].a).length} من ${CASES.length}</span></div>`}
  $('#sOr').addEventListener('input',e=>{w.o2=+e.target.value;draw()});
  host.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
    if(b.dataset.ty){w.type=b.dataset.ty;setSeg(host,'ty',w.type)}if(b.dataset.cc){w.conc=b.dataset.cc;setSeg(host,'cc',w.conc)}if(b.dataset.ey){w.eye=b.dataset.ey;setSeg(host,'ey',w.eye)}
    if(b.dataset.ans){w.answered[w.case]=b.dataset.ans}if(b.dataset.cs){w.case=(w.case+(+b.dataset.cs)+CASES.length)%CASES.length}draw()});
  draw()}

function sealLab(host){
  const w={test:'neg',leak:false,ph:-1,t0:0,hands:0,press:0,res:'',done:{}};
  host.innerHTML=`<div class="panel c7"><h2>فحص إحكام القناع <small>مبني على الشكلين <span class="ltr">(3-11)</span> و<span class="ltr">(3-12)</span> ص 40–41</small></h2>
    <div class="wrap-in" style="align-items:flex-start"><div><div class="sub">الفحص</div>${segHTML('ts',[['neg','الضغط السالب'],['pos','الضغط الموجب']],w.test)}</div>
     <div><div class="sub">حالة ربط القناع</div>${segHTML('lk',[['0','مربوط جيداً'],['1','فيه تسرب']],'0')}</div></div>
    <div class="wrap-in"><button class="btn primary" id="go">▶ ابدأ الفحص</button><button class="btn" id="fix">أعد وضع القناع واربطه جيداً</button></div>
    <div class="svgbox" id="sv" style="max-width:420px;margin-inline:auto"></div>
    <div class="legend"><span><i style="background:var(--stop)"></i>تسرب هواء من بين الوجه والقناع</span></div></div>
   <div class="panel c5"><h2>ماذا يحدث؟</h2><div class="reads" id="sr" style="margin:6px 0"></div><div class="callout" id="say"></div><div id="sres"></div>
    ${tries(['الضغط السالب مع قناع مربوط جيداً: يبقى منبعجاً 10 ثوانٍ.','اجعل الربط «فيه تسرب» وأعد الفحص.','الضغط الموجب: لاحظ أن اليد تغطي صمام الزفير في المقدمة.','بعد التسرب اضغط «أعد وضع القناع» ثم أعد الفحص.'])}</div>`;
  const $=s=>host.querySelector(s);
  const PH={neg:[['تغطية الفتحتين','يغلق فتحتي دخول الهواء في الفلتر براحتي اليد.',1],['الشهيق','يبدأ في التنفس (شهيق) حتى يبدأ القناع في الانبعاج (Collapsed).',1.6],['إيقاف التنفس','يوقف التنفس لمدة 10 ثوانٍ ويراقب القناع.',10]],
            pos:[['تغطية صمام الزفير','يتم إغلاق فتحة خروج الهواء.',1],['الزفير بهدوء','يتم الزفير بهدوء لتوليد كمية قليلة من الضغط الموجب داخل القناع.',1.6],['المراقبة','يُراقَب هل يتسرب الهواء من بين الوجه والقناع.',3]]};
  function result(){if(w.test==='neg')return w.leak?'<b style="color:var(--stop)">لم يبقَ القناع منبعجاً</b> ← الهواء يدخل من بين الوجه والقناع؛ الجهاز غير مربوط جيداً. يُعاد وضعه ويُربط ثم يُعاد الفحص.':'<b style="color:var(--on)">بقي الجهاز على نفس حالة الانبعاج (Collapsed)</b> ← «يؤكد ذلك أن الجهاز مربوط جيداً (Sealed)».';
    return w.leak?'<b style="color:var(--stop)">حدث تسرب للهواء</b> ← «يتم تغيير وضع القناع على الوجه وربطه جيداً وإجراء الفحص مرة أخرى».':'<b style="color:var(--on)">لم يحدث تسرب للهواء من بين الوجه والقناع</b> ← «يعتبر القناع مربوطاً جيداً».'}
  let last=0;
  loopOn(host,(dt,t)=>{const P=PH[w.test];
    if(w.ph>=0&&w.ph<3){const el=t-w.t0,dur=P[w.ph][2];
      if(w.ph===0)w.hands=Math.min(1,el/dur);
      if(w.ph===1){const g=Math.min(1,el/dur);w.press=w.test==='neg'?-g:0.6*g}
      if(w.ph===2&&w.leak){const g=Math.min(1,el/(w.test==='neg'?3:1.5));w.press=w.test==='neg'?-(1-g):0.6*(1-g)}
      if(el>=dur){w.ph++;w.t0=t;if(w.ph===3){w.res=result();w.done[w.test+(w.leak?'L':'G')]=1}}}
    if(t-last>0.05){last=t;
      $('#sv').innerHTML=sealSVG({test:w.test,hands:w.hands,press:w.press,leak:w.leak&&w.ph>=2,t});
      const P2=w.ph>=0&&w.ph<3?P[w.ph]:null;
      $('#sr').innerHTML=`<div class="read"><span>الخطوة</span><b style="font-family:var(--font);font-size:14px">${P2?P2[0]:w.ph===3?'انتهى الفحص':'—'}</b></div>`+(w.ph===2?`<div class="read"><span>الوقت المتبقي</span><b>${Math.max(0,P[2][2]-(t-w.t0)).toFixed(1)} s</b></div>`:'')+`<div class="read"><span>الضغط داخل القناع</span><b style="font-family:var(--font);font-size:14px">${w.press<-0.2?'سالب (أقل من الخارج)':w.press>0.2?'موجب (أعلى من الخارج)':'مثل الخارج'}</b></div>`;
      $('#say').innerHTML=P2?P2[1]:w.ph===3?'':(w.test==='neg'?'فحص الضغط السالب يُجرى قبل الدخول لمكان العمل الملوث مباشرة. اضغط «ابدأ الفحص».':'فحص الضغط الموجب: اضغط «ابدأ الفحص».');
      $('#sres').innerHTML=w.ph===3?`<div class="callout${w.leak?' err':''}">${w.res}</div>`:''}});
  host.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
    if(b.dataset.ts){w.test=b.dataset.ts;setSeg(host,'ts',w.test);w.ph=-1;w.hands=0;w.press=0}
    if(b.dataset.lk){w.leak=b.dataset.lk==='1';setSeg(host,'lk',b.dataset.lk);w.ph=-1;w.hands=0;w.press=0}
    if(b.id==='go'){w.ph=0;w.t0=performance.now()/1000;w.hands=0;w.press=0;w.res=''}
    if(b.id==='fix'){w.leak=false;setSeg(host,'lk','0');w.ph=-1;w.hands=0;w.press=0}});
}

B.lesson({
 id:'u3-l4',unit:3,order:4,pages:'39–44',
 title:'اختيار جهاز التنفس وفحصه وتنظيفه، والحزام الواقي، واليد، والجسم',
 summary:'خطوات اختيار جهاز التنفس المناسب، وفحصا الضغط السالب والموجب، والفحص الطبي، والتنظيف والتخزين، ثم حزام السلامة وحبل الإنقاذ، والقفازات، وملابس الحماية.',
 stations:[
  {intro:true},

  {st:1,short:'اختيار جهاز التنفس',title:'3- طريقة اختيار جهاز التنفس المناسب (<span class="ltr">Respirator Selection</span>)',ref:'ص 39–40',
   q:'قبل أن تختار أي جهاز… ما أول شيء تقيسه في المكان؟',
   art:(()=>{const {art,tx,D,P,C}=U3S;let s='';
    const box=(x,y,w,h,t1,t2,f,tip)=>`<g data-tip="${tip}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${f||P}" stroke="${D}" stroke-width="2.2"/>${tx(x+w/2,y+(t2?h/2-3:h/2+5),t1,{fs:12.5,w:700})}${t2?tx(x+w/2,y+h/2+14,t2,{fs:11,mono:/^[A-Z<>≥ ]/.test(t2)}):''}</g>`;
    const ar=(x1,y1,x2,y2)=>`<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${D}" stroke-width="2.2"/><circle cx="${x2}" cy="${y2}" r="3" fill="${D}"/>`;
    s+=box(110,30,140,40,'قِس الأوكسجين أولاً','',null,'البند 1: يتم أولاً قياس نسبة الأوكسجين في المكان المراد العمل به.');
    s+=ar(160,70,96,96)+ar(200,70,262,96);
    s+=box(36,96,120,48,'أقل من 19.5%','جهاز مزوّد SCBA',C.coral,'إذا كانت نسبة الأوكسجين أقل من ⟦19.5%⟧ يجب استخدام جهاز تنفس مزود للهواء ⟦SCBA⟧.');
    s+=box(196,96,130,48,'أكثر من 19.5%','حدّد نوع المادة','#E3E7EA','البند 2: يتم تحديد نوع المواد السامة والخطرة: غازات وأبخرة أم أتربة سامة.');
    s+=ar(261,144,261,158);
    s+=box(196,158,130,40,'قِس التركيز','',null,'البند 3: قياس درجة تركيز المواد السامة ومقارنته بالحدين ⟦TLV⟧ و⟦IDLH⟧.');
    s+=ar(220,198,100,216)+ar(261,198,262,216);
    s+=box(36,216,120,48,'أقل من TLV','بدون جهاز تنفس',C.teal,'إذا كان التركيز أقل من النسب المسموح بالتعرض لها ⟦TLV⟧ يمكن السماح بالعمل بدون أجهزة التنفس.');
    s+=box(196,216,130,48,'بين TLV و IDLH','جهاز منقٍّ + فلتر',C.yellow,'البند 4: أكثر من ⟦TLV⟧ وأقل من ⟦IDLH⟧: جهاز منقٍّ للأبخرة والغازات أو الأتربة، وفلتر مناسب لنوع المادة.');
    s+=box(196,272,130,36,'العين؟ نصف أم كامل','',null,'البند 5: لا تسبب حساسية للعين ← نصف وجه ⟦Half Mask⟧؛ تسبب حساسية للعين ← وجه كامل ⟦Full Face-Piece Mask⟧.')+ar(261,264,261,272);
    return art('شجرة اختيار جهاز التنفس: قياس الأوكسجين، ثم نوع المادة، ثم التركيز بين TLV وIDLH، ثم حساسية العين',C.lilac,s)})(),
   cap:'خطوات ص 39–40 في شجرة؛ <span class="ltr">19.5%</span> و<span class="ltr">TLV</span> و<span class="ltr">IDLH</span> من الكتاب.<br><b>مرّر المؤشر على أي مربع (أو المسه في الجوال) لتقرأ البند كاملاً.</b>',
   side:[
    {predict:{q:'الأوكسجين كافٍ، والمادة تركيزها أقل من <span class="ltr">TLV</span>. ماذا يقول الكتاب؟',opts:[
     ['يجب جهاز <span class="ltr">SCBA</span>',false,'<span class="ltr">SCBA</span> عند نقص الأوكسجين.'],
     ['يجب قناع وجه كامل',false,'القناع يُختار فقط إذا احتجنا جهازاً أصلاً.'],
     ['يمكن السماح بالعمل بدون أجهزة التنفس',true,'البند 3: «…فإذا كانت أقل من النسب المسموح بالتعرض لها (TLV) يمكن السماح بالعمل في هذه الأماكن بدون استخدام أجهزة التنفس».']]}}
   ],
   body:[
    {book:`<p><b>3- طريقة اختيار جهاز التنفس المناسب <span class="ltr">Respirator Selection</span>:</b></p><ol>
     <li>يتم أولاً قياس نسبة الأوكسجين في المكان المراد العمل به، فإذا كانت هذه النسبة أقل من <span class="ltr">19.5%</span> يجب في هذه الحالة استخدام جهاز تنفس مزود للهواء <span class="ltr">(SCBA)</span>.</li>
     <li>إذا كانت نسبة الأوكسجين في المكان أكثر من <span class="ltr">19.5%</span>، يتم تحديد نوع المواد السامة والخطرة بالموقع وهل هي غازات وأبخرة أم أتربة سامة.</li>
     <li>يتم قياس درجة تركيز هذه المواد فإذا كانت أقل من النسب المسموح بالتعرض لها <span class="ltr">(TLV)</span> يمكن السماح بالعمل في هذه الأماكن بدون استخدام أجهزة التنفس.</li>
     <li>إذا كانت درجة تركيز هذه المواد السامة في المكان المراد العمل به أكثر من الحد المسموح به <span class="ltr">(TLV)</span> وأقل من الجرعة وشيكة الخطر على الحياة أو الصحة <span class="ltr">(IDLH)</span>، يتم اختيار جهاز التنفس المناسب والمنقي للأبخرة والغازات السامة أو الأتربة من جدول أنواع أجهزة التنفس كذلك نوع الفلتر المناسب حسب نوع المادة السامة وذلك بالرجوع إلى جدول أنواع الفلاتر.</li>
     <li>في حالة ما كانت المادة السامة المراد الحماية منها لا تسبب أي حساسية للعين يمكن استخدام أجهزة التنفس النصفية <span class="ltr">Half Mask</span> أما إذا كانت المادة تسبب حساسية للعين فيجب في هذه الحالة استخدام جهاز تنفس يغطي الوجه بالكامل <span class="ltr">Full Face-Piece Mask</span>.</li></ol>`,ref:'ص 39–40'},
    {watch:`<p>البند 4 يحيل إلى «جدول أنواع أجهزة التنفس» و«جدول أنواع الفلاتر»، ولا يوجد أي منهما في الكتاب. والخطوات لا تذكر ماذا نفعل إذا كان التركيز يساوي <span class="ltr">IDLH</span> أو أكثر أو كان غير معروف؛ والكتاب نفسه يقول في ص 38 إن الأجهزة المنقية لا تُستعمل في هذه الحالة، فيبقى الجهاز المزوّد للهواء. وصححنا «الوجة» = الوجه.</p>`,fix:true},
    {tip:`<p><span class="ltr">TLV</span> هو الحد المسموح بالتعرض له (درسته في الوحدة الثانية)، و<span class="ltr">IDLH</span> هو التركيز الوشيك الخطر على الحياة أو الصحة. بينهما فقط يصلح الجهاز المنقي.</p>`,title:'حدّان'},
    {title:'مختبر مصغّر: اختر الجهاز',widget:(el,B)=>DCML.cases(el,B,{intro:'ثلاثة مواقع. طبّق خطوات ص 39–40 بالترتيب.',cases:[
 {q:'خزان مغلق، نسبة الأوكسجين فيه أقل من <span class="ltr">19.5%</span>.',opts:[
  ['قناع نصف وجه بفلتر أبخرة',false,'المنقي لا يمد بالهواء؛ لا يُستعمل تحت <span class="ltr">19.5%</span>.'],
  ['جهاز تنفس مزود للهواء <span class="ltr">(SCBA)</span>',true,'البند 1.']]},
 {q:'الأوكسجين كافٍ، وأبخرة مادة تركيزها بين <span class="ltr">TLV</span> و<span class="ltr">IDLH</span>، والمادة تسبب حساسية للعين.',opts:[
  ['جهاز منقٍّ يغطي الوجه بالكامل بفلتر أبخرة مناسب',true,'البندان 4 و5.'],
  ['قناع نصف وجه بفلتر أتربة',false,'فلتر الأتربة لا يناسب الأبخرة، ونصف الوجه لا يحمي العين.']]},
 {q:'الأوكسجين كافٍ، وأتربة تركيزها بين <span class="ltr">TLV</span> و<span class="ltr">IDLH</span>، ولا تسبب حساسية للعين.',opts:[
  ['جهاز <span class="ltr">SCBA</span>',false,'الأوكسجين كافٍ والتركيز تحت <span class="ltr">IDLH</span>؛ الكتاب يختار هنا الجهاز المنقي.'],
  ['جهاز منقٍّ نصفي <span class="ltr">Half Mask</span> بفلتر أتربة',true,'البندان 4 و5.']]}]})},
    {tip:`<p>شجرة اختيار تفاعلية كاملة تجدها في تبويب «المختبر».</p>`}
   ]},

  {st:2,short:'اختبار الملاءمة',title:'4- اختبار ملاءمة جهاز التنفس للشخص (<span class="ltr">Fit Testing</span>)',ref:'ص 40',
   q:'اخترت الجهاز الصحيح تماماً… فلماذا قد يتسرب الغاز السام إليك رغم ذلك؟',
   art:(()=>{const {art,nest,hot,tx,C}=U3S;
    return art('قناع على وجه عامل، وأسهم حمراء تمثل تسرباً محتملاً من حواف القناع',C.peach,nest(sealSVG({test:'neg',hands:0,press:0,leak:1,t:0.3}),40,40,280,231,{clip:1,extra:hot(130,150,140,80,'أربطة القناع وحوافه ⟦Seals⟧: إذا لم يكن القناع ملائماً للوجه تدخل المواد السامة من هنا (الأسهم الحمراء).')})+tx(180,296,'التسرب من حواف القناع',{fs:14,w:700}))})(),
   cap:'رسم توضيحي: الأسهم الحمراء تسرب محتمل من حواف القناع.<br><b>مرّر المؤشر على حواف القناع (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'متى تُجرى فحوصات ملاءمة القناع حسب الكتاب؟',opts:[
     ['مرة واحدة عند شراء الجهاز',false,'الكتاب يقول قبل الدخول لمكان العمل مباشرة.'],
     ['قبل الدخول لمكان العمل مباشرة',true,'«(هذه الفحوصات يتم إجراؤها قبل الدخول لمكان العمل مباشرة)» (ص 40).'],
     ['بعد الخروج من مكان العمل',false,'بعد الخروج لا تفيد؛ التسرب يكون قد حدث.']]}}
   ],
   body:[
    {book:`<p><b>4- اختبار ملاءمة جهاز التنفس للشخص <span class="ltr">Fit Testing</span>:</b> بعد أن يتم اختيار جهاز التنفس المناسب لنوع الخطر في مكان العمل، يجب إجراء اختبار للتأكد من ملاءمة هذا الجهاز للشخص الذي سوف يستعمله والتأكد من عدم دخول المواد السامة من خلال أربطة القناع <span class="ltr">(Seals)</span> وهذه الفحوصات تكون على الوجه التالي: (هذه الفحوصات يتم إجراؤها قبل الدخول لمكان العمل مباشرة)</p>`,ref:'ص 40'},
    {add:`<p>اللحية أو شعر الوجه تحت حافة القناع من أشهر أسباب فشل اختبار الملاءمة، لأنها تترك فراغات صغيرة يمر منها الهواء الملوث.</p>`,title:'مثال من الواقع'},
    {title:'تحقق سريع',widget:(el,B)=>DCML.tf(el,B,{intro:'احكم بحسب ص 40.',items:[
 ['اختبار الملاءمة يأتي بعد اختيار الجهاز المناسب لنوع الخطر.',true,'«بعد أن يتم اختيار جهاز التنفس المناسب… يجب إجراء اختبار للتأكد من ملاءمة هذا الجهاز للشخص».'],
 ['الغرض منه التأكد من عدم دخول المواد السامة من خلال أربطة القناع.',true,'نص الكتاب: «…من خلال أربطة القناع (Seals)».'],
 ['يكفي أن يُختبر القناع على زميل له المقاس نفسه.',false,'الاختبار للشخص «الذي سوف يستعمله».']]})}
   ]},

  {st:3,short:'الضغط السالب',title:'5- فحص الضغط السالب (<span class="ltr">Negative Pressure Testing</span>)',ref:'ص 40–41',
   q:'تغلق فتحتي الفلتر بيديك وتشهق… فماذا يجب أن يحدث للقناع؟',
   art:(()=>{const {art,nest,hot,tx,C}=U3S;
    return art('فحص الضغط السالب: العامل يغطي فتحتي دخول الهواء في الفلتر براحتي يديه',C.mint,nest(sealSVG({test:'neg',hands:1,press:-1}),40,36,280,231,{clip:1,extra:hot(110,166,70,64,'راحة اليد تغلق فتحة دخول الهواء في الفلتر.')+hot(222,166,70,64,'راحة اليد تغلق فتحة دخول الهواء في الفلتر.')+hot(150,150,100,70,'القناع منبعج للداخل ⟦Collapsed⟧: إذا بقي هكذا ⟦10⟧ ثوانٍ فهو مربوط جيداً ⟦Sealed⟧.')})+tx(180,292,'رسم مبسّط عن الشكل',{fs:12})+`<text x="180" y="310" text-anchor="middle" font-size="12" fill="#2C4A40" font-family="var(--mono)">(3-11)</text>`)})(),
   cap:'رسم مبسّط عن الشكل <span class="ltr">(3-11)</span> ص 41.<br><b>مرّر المؤشر على اليدين والقناع (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'أغلقت الفتحتين وشهقت فانبعج القناع، ثم أوقفت التنفس 10 ثوانٍ فعاد القناع إلى شكله. ماذا يعني؟',opts:[
     ['القناع مربوط جيداً',false,'المربوط جيداً يبقى منبعجاً.'],
     ['يدخل الهواء من مكان ما؛ القناع غير محكم',true,'«إذا بقي الجهاز على نفس حالة الانبعاج… يؤكد ذلك أن الجهاز مربوط جيداً»؛ وعودته تعني دخول هواء من الحواف.'],
     ['الفلتر انتهت صلاحيته',false,'الفتحتان مغلقتان باليدين، فالهواء لم يأت من الفلتر.']]}}
   ],
   body:[
    {book:`<p><b>5- فحص الضغط السالب <span class="ltr">Negative Pressure Testing</span>:</b></p><ul>
     <li>يتم إجراء هذا الفحص قبل الدخول لمكان العمل الملوث بالمواد السامة والخطرة ويتم ذلك بإغلاق فتحتي دخول الهواء في الفلتر براحتي اليد (كما هو موضح بالشكل <span class="ltr">3-11</span>) ويبدأ في التنفس حتى يبدأ القناع في الانبعاج <span class="ltr">(Collapsed)</span> ويتم إيقاف التنفس لمدة <span class="ltr">10</span> ثوانٍ.</li>
     <li>إذا بقي الجهاز على نفس حالة الانبعاج <span class="ltr">(Collapsed)</span>، يؤكد ذلك أن الجهاز مربوط جيداً <span class="ltr">(Sealed)</span>.</li></ul>`,ref:'ص 40'},
    {tip:`<p>عندما تشهق والفتحتان مغلقتان يقل الضغط داخل القناع («سالب») فيُسحب القناع نحو الوجه. إن كان محكماً بقي منبعجاً لأنه لا هواء يدخل، وإن عاد منتفخاً فهناك هواء يتسرب من الحواف.</p>`,title:'لماذا «سالب»؟'},
    {title:'مختبر مصغّر: رتّب خطوات الفحص',widget:(el,B)=>DCML.order(el,B,{intro:'اضغط خطوات فحص الضغط السالب بالترتيب (ص 40).',steps:[
 ['ألبس القناع قبل الدخول لمكان العمل الملوث','الفحص يُجرى قبل الدخول.'],
 ['أغلق فتحتي دخول الهواء في الفلتر براحتي اليد','لا يمكن أن ينبعج القناع والفتحتان مفتوحتان.'],
 ['أتنفس (شهيق) حتى يبدأ القناع في الانبعاج','الانبعاج يأتي من التنفس والفتحتان مغلقتان.'],
 ['أوقف التنفس لمدة <span class="ltr">10</span> ثوانٍ','بعد الانبعاج نوقف التنفس ونراقب.'],
 ['إذا بقي منبعجاً فالقناع مربوط جيداً','الحكم آخر خطوة.']]})},
    {tip:`<p>حركة الفحصين السالب والموجب مع التسرب تجدها في تبويب «المختبر».</p>`}
   ]},

  {st:4,short:'الضغط الموجب',title:'6- فحص الضغط الموجب (<span class="ltr">Positive Pressure Testing</span>)',ref:'ص 41',
   q:'هذه المرة تغلق فتحة الخروج وتزفر… أين تبحث عن التسرب؟',
   art:(()=>{const {art,nest,hot,tx,C}=U3S;
    return art('فحص الضغط الموجب: العامل يغطي صمام الزفير براحة يده ويزفر بهدوء',C.sand,nest(sealSVG({test:'pos',hands:1,press:0.6}),40,36,280,231,{clip:1,extra:hot(166,180,70,70,'راحة اليد تغلق فتحة خروج الهواء (صمام الزفير).')+hot(130,140,140,40,'حواف القناع: يعتبر القناع مربوطاً جيداً إذا لم يحدث تسرب للهواء من بين الوجه والقناع.')})+tx(180,292,'رسم مبسّط عن الشكل',{fs:12})+`<text x="180" y="310" text-anchor="middle" font-size="12" fill="#2C4A40" font-family="var(--mono)">(3-12)</text>`)})(),
   cap:'رسم مبسّط عن الشكل <span class="ltr">(3-12)</span> ص 41.<br><b>مرّر المؤشر على اليد وحواف القناع (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'في فحص الضغط الموجب، ماذا يُغلق؟',opts:[
     ['فتحتا دخول الهواء في الفلتر',false,'هذا في فحص الضغط السالب.'],
     ['الأنف والفم',false,'لا يذكر الكتاب ذلك.'],
     ['فتحة خروج الهواء',true,'«يتم إغلاق فتحة خروج الهواء» ثم «الزفير بهدوء» (ص 41).']]}}
   ],
   body:[
    {book:`<p><b>6- فحص الضغط الموجب <span class="ltr">Positive Pressure Testing</span>:</b></p><ul>
     <li>يتم إغلاق فتحة خروج الهواء.</li><li>يتم الزفير بهدوء لتوليد كمية قليلة من الضغط الموجب داخل القناع.</li>
     <li>يعتبر القناع مربوطاً جيداً إذا لم يحدث تسرب للهواء من بين الوجه والقناع (كما هو موضح بالشكل <span class="ltr">3-12</span>).</li>
     <li>في حالة حدوث أي تسرب للهواء يتم تغيير وضع القناع على الوجه وربطه جيداً وإجراء الفحص مرة أخرى.</li></ul>`,ref:'ص 41'},
    {watch:`<p>في الكتاب جاءت الإحالة «(كما هو موضح بالشكل ١٢-٣)» في نهاية جملة إعادة وضع القناع، بينما الشكل يوضح فحص الضغط الموجب نفسه (اليد على صمام الزفير)، فنقلنا الإحالة إلى جملة الفحص.</p>`,fix:true},
    {tip:`<p>السالب: تغلق <b>الدخول</b> وتشهق ← القناع ينبعج للداخل. الموجب: تغلق <b>الخروج</b> وتزفر بهدوء ← القناع ينتفخ قليلاً. في الحالتين القناع المحكم لا يسرّب.</p>`,title:'الفحصان معاً'},
    {title:'مختبر مصغّر: سالب أم موجب؟',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل وصف اختر الفحص الذي يخصه.',cats:['الضغط السالب','الضغط الموجب'],items:[
 ['إغلاق فتحتي دخول الهواء في الفلتر براحتي اليد.',0,'ص 40 والشكل (3-11).'],
 ['الزفير بهدوء لتوليد ضغط قليل داخل القناع.',1,'ص 41.'],
 ['إيقاف التنفس <span class="ltr">10</span> ثوانٍ ومراقبة بقاء الانبعاج.',0,'ص 40.'],
 ['إغلاق فتحة خروج الهواء.',1,'ص 41 والشكل (3-12).']]})},
    {title:'وإذا تسرب الهواء؟',widget:(el,B)=>DCML.cases(el,B,{cases:[{q:'زفرت وفتحة الخروج مغلقة، فشعرت بالهواء يخرج من جانب القناع عند الخد.',opts:[
  ['أغيّر وضع القناع وأربطه جيداً وأعيد الفحص',true,'«في حالة حدوث أي تسرب للهواء يتم تغيير وضع القناع على الوجه وربطه جيداً وإجراء الفحص مرة أخرى».'],
  ['أدخل مكان العمل فالتسرب بسيط',false,'التسرب يعني أن المواد السامة ستدخل من الموضع نفسه.']]}]})}
   ]},

  {st:5,short:'الفحص الطبي',title:'7- الفحص الطبي (<span class="ltr">Medical Consideration</span>)',ref:'ص 41',
   q:'جهاز التنفس يتعب صاحبه… فمن لا يُسمح له باستعماله؟',
   art:(()=>{const {art,tx,card,D,P,C}=U3S;let s='';
    s+=`<g data-tip="الطبيب: يحدد حسب نتيجة الفحص الأشخاص الذين يصلحون لاستعمال أجهزة التنفس والذين لا يصلحون."><circle cx="180" cy="92" r="30" fill="#F3D9C4" stroke="${D}" stroke-width="2.5"/><path d="M134 176Q138 130 180 126Q222 130 226 176Z" fill="#fff" stroke="${D}" stroke-width="2.5"/><path d="M164 130Q160 156 172 160M196 130Q204 150 190 160" fill="none" stroke="${D}" stroke-width="2.4"/><circle cx="181" cy="162" r="5" fill="${C.teal}" stroke="${D}" stroke-width="1.6"/><rect x="172" y="140" width="16" height="16" rx="3" fill="${C.coral}"/><path d="M180 143V153M175 148H185" stroke="#fff" stroke-width="2.4"/></g>`;
    const K=[[272,'أمراض الصدر المزمنة'],[180,'أمراض القلب'],[88,'ضيق التنفس']];
    K.forEach(([x,t])=>{s+=`<g data-tip="يُستبعد من استعمال أجهزة التنفس من يشتكي من: ${t}.">${card(x-46,196,92,44,{fill:'#FBE3DF'})}${tx(x,223,t,{fs:t.length>12?10.5:12,w:700})}</g>`});
    s+=`<g data-tip="يُستبعد أيضاً من يشتكي من ضعف السمع.">${card(134,248,92,40,{fill:'#FBE3DF'})}${tx(180,273,'ضعف السمع',{fs:12,w:700})}</g>`;
    return art('الطبيب يفحص، وأربع بطاقات للحالات المستبعدة: أمراض الصدر المزمنة، والقلب، وضيق التنفس، وضعف السمع',C.lilac,s+tx(180,46,'يُستبعد من يشتكي من',{fs:13,w:700}))})(),
   cap:'الحالات الأربع المستبعدة في ص 41.<br><b>مرّر المؤشر على الطبيب والبطاقات (أو المسها في الجوال) لتقرأ ما يخصها.</b>',
   side:[
    {predict:{q:'أي هذه الحالات يذكرها الكتاب ضمن أسباب الاستبعاد من استعمال أجهزة التنفس؟',opts:[
     ['قصر النظر',false,'غير مذكور.'],
     ['ضعف السمع',true,'«…أمراض الصدر المزمنة، أمراض القلب، أمراض ضيق التنفس، ضعف السمع» (ص 41).'],
     ['الطول الزائد',false,'غير مذكور.']]}}
   ],
   body:[
    {book:`<p><b>7- الفحص الطبي <span class="ltr">Medical Consideration</span>:</b></p><ul>
     <li>يجب إجراء فحص طبي على جميع العاملين الذين تستدعي طبيعة عملهم استخدام أجهزة التنفس ويتم استبعاد الأشخاص الذين يشتكون من (أمراض الصدر المزمنة، أمراض القلب، أمراض ضيق التنفس، ضعف السمع).</li>
     <li>يقوم الطبيب وحسب نتيجة الفحص الطبي بتحديد الأشخاص الذين يصلحون لاستعمال أجهزة التنفس والأشخاص الذين لا يصلحون لذلك.</li></ul>`,ref:'ص 41'},
    {tip:`<p>تذكّر من الإرشادات العامة (ص 27) أن هذا الفحص <b>يتكرر سنوياً</b>. والقرار للطبيب حسب نتيجة الفحص، لا للعامل ولا لمشرفه.</p>`,title:'اربطها بما سبق'},
    {title:'تحقق سريع',widget:(el,B)=>DCML.tf(el,B,{intro:'احكم بحسب ص 41 وص 27.',items:[
 ['الطبيب هو من يحدد من يصلح لاستعمال أجهزة التنفس.',true,'«يقوم الطبيب وحسب نتيجة الفحص الطبي بتحديد الأشخاص الذين يصلحون…».'],
 ['يكفي فحص طبي واحد طوال مدة العمل.',false,'الفحص يتكرر سنوياً (ص 27)، وهذه العبارة 3 في أسئلة الوحدة.'],
 ['مريض القلب يُستبعد من استعمال أجهزة التنفس.',true,'«أمراض القلب» من الحالات المستبعدة.']]})}
   ]},

  {st:6,short:'التنظيف والتخزين',title:'8- تنظيف وتخزين أجهزة التنفس',ref:'ص 41–42',
   q:'ماء دافئ ثم بارد… ولماذا يُمنع المذيب القوي رغم أنه ينظف أسرع؟',
   art:(()=>{const {art,nest,tx,D,P,C}=U3S;let s='';
    const T=[[296,'فك وتنظيف','ماء دافئ ومنظف وفرشاة','#F7C9A8','1- فك أجزاء الجهاز وتنظيفها بالمنظفات مع الماء الدافئ وفرشاة التنظيف.'],[220,'شطف','ماء بارد','#BFE3F2','1 و3- وضع الجهاز في ماء بارد وشطفه جيداً لإزالة أية آثار للصابون حتى لا يسبب حساسية للمستعمل.'],[144,'تجفيف','مكان جاف نظيف','#E3E7EA','1- يُترك الجهاز ليجف في مكان جاف نظيف.'],[68,'تخزين','كيس بلاستيك مغلق','#FBF6EE','4 و5- التخزين في مكان نظيف بعيداً عن الأتربة، في أكياس بلاستيك تُغلق جيداً ⟦Sealable Plastic Bags⟧.']];
    T.forEach(([cx,a,b,f,tip],i)=>{s+=`<g data-tip="${tip}"><circle cx="${cx}" cy="140" r="32" fill="${f}" stroke="${D}" stroke-width="2.5"/>${nest(icon(i===3?'dust':'vapor',60),cx-22,118,44,44)}${tx(cx,194,a,{fs:13,w:700})}${tx(cx,212,b,{fs:10})}</g>`;if(i<3)s+=`<path d="M${cx-38} 140H${cx-70}M${cx-64} 134L${cx-72} 140L${cx-64} 146" fill="none" stroke="${D}" stroke-width="2.4"/>`});
    s+=`<g data-tip="2- يجب عدم استخدام المذيبات العضوية ⟦Organic Solvents⟧ في التنظيف حتى لا تؤثر على الأجزاء البلاستيكية من الجهاز."><rect x="140" y="232" width="80" height="50" rx="8" fill="${P}" stroke="${D}" stroke-width="2.2"/>${tx(180,254,'مذيبات عضوية',{fs:11.5,w:700})}${tx(180,272,'Solvents',{fs:10,mono:1})}<path d="M138 230L222 284M222 230L138 284" stroke="${C.coral}" stroke-width="4" stroke-linecap="round"/></g>`;
    return art('خطوات التنظيف: فك وتنظيف بماء دافئ، شطف بماء بارد، تجفيف، تخزين في كيس، ولا مذيبات عضوية',C.mint,s+tx(180,62,'من اليمين إلى اليسار',{fs:12}))})(),
   cap:'بنود ص 41–42 في خطوات، وممنوع المذيبات العضوية.<br><b>مرّر المؤشر على أي خطوة (أو المسها في الجوال) لتقرأ البند.</b>',
   side:[
    {predict:{q:'لماذا يجب شطف الجهاز جيداً لإزالة آثار الصابون؟',opts:[
     ['حتى لا يسبب حساسية لمستعمل الجهاز',true,'«يجب التأكد من شطف الأجهزة جيداً بالماء لإزالة أية آثار للصابون حتى لا يسبب ذلك حساسية لمستعمل الجهاز» (ص 42).'],
     ['حتى لا يتلف الفلتر',false,'السبب في الكتاب حساسية المستعمل.'],
     ['حتى يجف أسرع',false,'ليس هذا ما يذكره الكتاب.']]}}
   ],
   body:[
    {book:`<p><b>8- تنظيف وتخزين أجهزة التنفس:</b></p><ol>
     <li>يتم فك أجزاء أجهزة التنفس وتنظيفها بالمنظفات مع استعمال الماء الدافئ وفرشاة التنظيف وبعد ذلك يتم وضع الجهاز في ماء بارد وشطفه ثم يتم تركه ليجف في مكان جاف نظيف.</li>
     <li>يجب عدم استخدام المذيبات العضوية <span class="ltr">Organic Solvents</span> في عملية التنظيف حتى لا تؤثر على الأجزاء البلاستيكية من الجهاز.</li>
     <li>يجب التأكد من شطف الأجهزة جيداً بالماء لإزالة أية آثار للصابون حتى لا يسبب ذلك حساسية لمستعمل الجهاز.</li>
     <li>يجب تخزين أجهزة التنفس في مكان نظيف لحمايتها من الاتساخ بالأتربة.</li>
     <li>يجب وضع أجهزة التنفس بعد تنظيفها في أكياس بلاستيك وإغلاقها جيداً <span class="ltr">Sealable Plastic Bags</span>.</li></ol>`,ref:'ص 41–42'},
    {add:`<p>من أمثلة المذيبات العضوية: الثنر (التنر) والأسيتون والبنزين. قد تُذيب البلاستيك والمطاط أو تجعلهما هشّين، فيتشقق القناع أو تفقد حوافه إحكامها.</p>`,title:'ما المذيبات العضوية؟'},
    {title:'مختبر مصغّر: رتّب التنظيف والتخزين',widget:(el,B)=>DCML.order(el,B,{intro:'اضغط الخطوات بالترتيب الذي يذكره الكتاب.',steps:[
 ['فك أجزاء الجهاز','لا يمكن تنظيف الأجزاء جيداً قبل فكها.'],
 ['التنظيف بالمنظفات والماء الدافئ وفرشاة التنظيف','التنظيف بعد الفك.'],
 ['الوضع في ماء بارد والشطف جيداً لإزالة الصابون','الشطف بعد التنظيف بالمنظف.'],
 ['التجفيف في مكان جاف نظيف','لا يُخزن الجهاز مبتلاً.'],
 ['الوضع في كيس بلاستيك يُغلق جيداً وتخزينه في مكان نظيف','التخزين آخر خطوة.']]})}
   ]},

  {st:7,short:'الحزام الواقي',title:'3-3-7 الحزام الواقي وحبل الإنقاذ (<span class="ltr">Safety Belts and Life Line</span>)',ref:'ص 42',
   q:'عامل فوق برج، وآخر داخل خزان… هل يلبسان الحزام نفسه للسبب نفسه؟',
   art:(()=>{const {art,nest,hot,tx,C}=U3S;
    const ex=hot(0,0,330,270,'حزام الباراشوت ⟦Full body harness⟧: أشرطة على الكتفين والصدر والفخذين، وحلقة على الظهر يتصل بها حبل وصل بممتص صدمات ⟦Lanyard with Shock Absorber⟧ وماسك حبل ⟦Rope Grab⟧ على خط الحياة ⟦Lifeline⟧.')+hot(340,0,260,270,'الحزام العادي (حزام خصر) بخطافين ⟦Locking Snap Hooks⟧: يُستخدم حالياً حزام الباراشوت بدلاً منه.');
    return art('حزام الباراشوت وخط الحياة، والحزام العادي بخطافين',C.peach,nest(fig313(),10,64,340,153,{extra:ex})+tx(180,250,'رسم مبسّط عن الشكل',{fs:12})+`<text x="180" y="268" text-anchor="middle" font-size="12" fill="#2C4A40" font-family="var(--mono)">(3-13)</text>`+tx(180,46,'الباراشوت بدل الحزام العادي',{fs:14,w:700}))})(),
   cap:'رسم مبسّط عن الشكل <span class="ltr">(3-13)</span> ص 42.<br><b>مرّر المؤشر على كل حزام (أو المسه في الجوال) لتعرف أجزاءه.</b>',
   side:[
    {predict:{q:'لماذا يُستعمل حزام سلامة خاص <span class="ltr">Safety Harness</span> وحبل إنقاذ داخل الخزانات؟',opts:[
     ['لأنه أرخص من الحزام العادي',false,'السبب في الكتاب ليس الثمن.'],
     ['حتى يمكن إخراج العامل في وضع مستقيم لا يعرضه للإصابة في حالات الطوارئ',true,'نص ص 42.'],
     ['لحمايته من الكهرباء',false,'غير مذكور.']]}}
   ],
   body:[
    {book:`<p><b>3-3-7 الحزام الواقي وحبل الإنقاذ <span class="ltr">Safety Belts and Life Line</span>:</b> تستخدم أحزمة السلامة وحبل الإنقاذ عند العمل في أماكن مرتفعة وذلك لتأمين العامل من خطر السقوط، ويتم حالياً استخدام حزام الباراشوت بدلاً من استخدام الحزام العادي (شكل <span class="ltr">3-13</span>).</p>
     <p>في حالة العمل داخل الأماكن المغلقة أو الخزانات يتم استخدام حزام سلامة خاص <span class="ltr">Safety Harness</span> وحبل إنقاذ وذلك حتى يمكن إخراج العامل في وضع مستقيم لا يعرضه للإصابة عند إخراجه في حالات الطوارئ.</p>`,ref:'ص 42'},
    {tip:`<p>الحزام العادي حول الخصر وحده: إذا سقط العامل تتركز القوة كلها على بطنه وظهره، وقد ينقلب. حزام الباراشوت يوزع القوة على الكتفين والصدر والفخذين ويبقي الجسم في وضع مستقيم.</p>`,title:'لماذا الباراشوت؟'},
    {title:'مختبر مصغّر: أين يُستعمل؟',widget:(el,B)=>DCML.sort(el,B,{intro:'اختر الاستعمال الذي يذكره الكتاب لكل حالة (ص 42).',cats:['مكان مرتفع: ضد السقوط','مكان مغلق أو خزان: للإخراج'],items:[
 ['فني يعمل على عمود إنارة.',0,'«عند العمل في أماكن مرتفعة… لتأمين العامل من خطر السقوط».'],
 ['عامل ينظف خزاناً من الداخل.',1,'«داخل الأماكن المغلقة أو الخزانات… حتى يمكن إخراج العامل في وضع مستقيم».'],
 ['عامل على سقالة عالية في موقع بناء.',0,'مكان مرتفع: الحماية من السقوط بحزام الباراشوت.']]})}
   ]},

  {st:8,short:'وقاية اليد',title:'3-3-8 وقاية اليد (<span class="ltr">Hand Protection</span>)',ref:'ص 43',
   q:'قفاز جلدي في يدك… هل يصلح لنقل حمض؟',
   art:(()=>{const {art,nest,tx,C}=U3S;let s='';
    const T=[[270,'leather','قماش وجلد مدبوغ','(3-14)','القفازات من القماش والجلد المدبوغ: لحماية الأيدي من الشظايا والأجسام الحادة عند مناولة المواد التي بها أطراف حادة.'],[180,'rubber','مطاط أو بلاستيك','(3-15)','قفازات المطاط أو البلاستيك ⟦PVC or LATEX⟧ وقفازات ⟦NEOPRENE⟧: لمناولة المواد الكيميائية كالأحماض والقلويات.'],[90,'heat','مقاومة للحرارة','(3-16)','القفازات المقاومة للحرارة ⟦Heat Resistance Gloves⟧: للمعدات الساخنة مثل أنابيب البخار، والأواني الزجاجية الساخنة بالمعامل، وعمليات اللحام.']];
    T.forEach(([cx,k,a,f,tip])=>{s+=`<g data-tip="${tip}"><rect x="${cx-42}" y="58" width="84" height="196" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.2"/>${nest(glovesPhoto(k),cx-38,66,76,103)}${tx(cx,196,a,{fs:11,w:700})}<text x="${cx}" y="226" text-anchor="middle" font-size="12" fill="#2C4A40" font-family="var(--mono)">${f}</text></g>`});
    return art('ثلاثة أنواع من القفازات: قماش وجلد مدبوغ، ومطاط أو بلاستيك، ومقاومة للحرارة',C.sand,s+tx(180,290,'لكل خطر قفازه',{fs:14,w:700}))})(),
   cap:'رسم مبسّط عن الأشكال <span class="ltr">(3-14)</span> و<span class="ltr">(3-15)</span> و<span class="ltr">(3-16)</span> ص 43.<br><b>مرّر المؤشر على كل قفاز (أو المسه في الجوال) لتعرف استعماله.</b>',
   side:[
    {predict:{q:'عامل يمسك أنبوب بخار ساخناً. أي قفاز؟',opts:[
     ['قفاز مطاطي <span class="ltr">LATEX</span>',false,'المطاط للمواد الكيميائية.'],
     ['قفاز من القماش والجلد المدبوغ',false,'هذا للأجسام الحادة والشظايا.'],
     ['قفاز مقاوم للحرارة',true,'«تستخدم القفازات المقاومة للحرارة عند العمل على المعدات الساخنة مثل أنابيب البخار» (ص 43).']]}}
   ],
   body:[
    {book:`<p><b>3-3-8 وقاية اليد <span class="ltr">Hand Protection</span>:</b> يستخدم لحماية الأيدي القفازات الواقية <span class="ltr">Safety Gloves</span> وهناك عدة أنواع منها على النحو التالي:</p>
     <p>أ- القفازات الواقية المصنوعة من القماش والجلد المدبوغ وتستخدم لحماية الأيدي من الشظايا والأجسام الحادة عند مناولة المواد التي بها أطراف حادة (شكل <span class="ltr">3-14</span>).</p>
     <p>ب- القفازات الواقية المصنوعة من المطاط أو البلاستيك <span class="ltr">PVC or LATEX Gloves</span> وتستعمل لحماية الأيدي أثناء مناولة المواد الكيميائية كالأحماض والقلويات كذلك قفازات <span class="ltr">NEOPRENE</span> (شكل <span class="ltr">3-15</span>).</p>
     <p>ج- تستخدم القفازات المقاومة للحرارة <span class="ltr">Heat Resistance Gloves</span> عند العمل على المعدات الساخنة مثل أنابيب البخار أو لإمساك الأواني الزجاجية الساخنة بالمعامل وأثناء عمليات اللحام (شكل <span class="ltr">3-16</span>).</p>`,ref:'ص 43'},
    {watch:`<p>ترقيم أنواع القفازات في الكتاب «أ، ب، ت» فكتبناه «أ، ب، ج». ورقم الشكل <span class="ltr">(3-16)</span> هنا مكرر في الكتاب: استُعمل مرة ثانية في ص 50 للافتة الخطر.</p>`,fix:true},
    {watch:`<p>قفازات المطاط أو البلاستيك في هذه الفقرة للمواد الكيميائية، لا لأعمال الكهرباء (العبارة 11 في أسئلة الوحدة خاطئة لهذا السبب).</p>`},
    {title:'مختبر مصغّر: أي قفاز؟',widget:(el,B)=>DCML.sort(el,B,{intro:'اختر نوع القفاز لكل عمل (ص 43).',cats:['قماش وجلد مدبوغ','مطاط أو بلاستيك','مقاوم للحرارة'],items:[
 ['نقل ألواح صاج حوافها حادة.',0,'للشظايا والأجسام الحادة.'],
 ['صب حمض في وعاء.',1,'لمناولة المواد الكيميائية كالأحماض والقلويات.'],
 ['أعمال اللحام.',2,'«وأثناء عمليات اللحام».'],
 ['إمساك كأس زجاجي ساخن في المعمل.',2,'«أو لإمساك الأواني الزجاجية الساخنة بالمعامل».']]})}
   ]},

  {st:9,short:'حماية الجسم',title:'3-3-9 حماية الجسم (<span class="ltr">Body Protection</span>)',ref:'ص 44',
   q:'أوفرهول القماش يكفي في الورشة… فماذا تلبس فوقه عند الأحماض؟',
   art:(()=>{const {art,nest,tx,C}=U3S;let s='';
    const T=[[250,'coverall','أوفرهول','(3-17)','الأوفرهولات والمرايل الواقية: عند العمل بالقرب من الماكينات وفي الورش (الشكل ⟦3-17⟧: أوفرهول بأشرطة عاكسة).'],[110,'apron','مريلة واقية','(3-18)','المعاطف والبدل الواقية المصنوعة من البلاستيك: للحماية من المواد الكيميائية مثل الأحماض والقلويات (الشكل ⟦3-18⟧: مريلة طويلة).']];
    T.forEach(([cx,k,a,f,tip])=>{s+=`<g data-tip="${tip}"><rect x="${cx-62}" y="50" width="124" height="214" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.2"/>${nest(glovesPhoto(k),cx-52,58,104,141)}${tx(cx,224,a,{fs:13,w:700})}<text x="${cx}" y="248" text-anchor="middle" font-size="12" fill="#2C4A40" font-family="var(--mono)">${f}</text></g>`});
    return art('أوفرهول عمل بأشرطة عاكسة، ومريلة واقية طويلة',C.lilac,s+tx(180,292,'الورشة أم المواد الكيميائية؟',{fs:13.5,w:700}))})(),
   cap:'رسم مبسّط عن الشكلين <span class="ltr">(3-17)</span> و<span class="ltr">(3-18)</span> ص 44.<br><b>مرّر المؤشر على كل قطعة (أو المسها في الجوال) لتعرف استعمالها.</b>',
   side:[
    {predict:{q:'عامل ينقل عبوات قلويات. ماذا يلبس لحماية جسمه حسب الكتاب؟',opts:[
     ['معطفاً أو بدلة واقية من البلاستيك',true,'«تستخدم المعاطف والبدل الواقية المصنوعة من البلاستيك للحماية من مخاطر المواد الكيميائية مثل الأحماض والقلويات» (ص 44).'],
     ['أوفرهول قماش فقط',false,'الأوفرهول للعمل قرب الماكينات وفي الورش.'],
     ['لا شيء إذا لبس قفازات',false,'القفازات تحمي اليد فقط.']]}}
   ],
   body:[
    {book:`<p><b>3-3-9 حماية الجسم <span class="ltr">Body Protection</span>:</b></p><ol><li>تستخدم الأوفرهولات والمرايل الواقية عند العمل بالقرب من الماكينات وفي الورش شكل <span class="ltr">(3-17)</span>.</li><li>تستخدم المعاطف والبدل الواقية المصنوعة من البلاستيك للحماية من مخاطر المواد الكيميائية مثل الأحماض والقلويات شكل <span class="ltr">(3-18)</span>.</li></ol>`,ref:'ص 44'},
    {watch:`<p>الشكل <span class="ltr">(3-18)</span> في ص 44 مريلة واحدة، بينما النص يحيل إليه في «المعاطف والبدل الواقية من البلاستيك». ورقما الشكلين <span class="ltr">(3-17)</span> و<span class="ltr">(3-18)</span> مكرران في الكتاب (استُعملا ثانية في ص 51 للافتات).</p>`,fix:true},
    {title:'تحقق سريع',widget:(el,B)=>DCML.tf(el,B,{intro:'احكم بحسب ص 44.',items:[
 ['الأوفرهولات تُستخدم عند العمل بالقرب من الماكينات وفي الورش.',true,'البند 1.'],
 ['المعاطف والبدل البلاستيكية للحماية من الأحماض والقلويات.',true,'البند 2.'],
 ['الأوفرهول القماش يحمي من الأحماض مثل البدلة البلاستيكية.',false,'الكتاب يخص البلاستيك بالمواد الكيميائية.']]})}
   ]},

  {recap:[
   'اختيار جهاز التنفس: قِس الأوكسجين (أقل من <span class="ltr">19.5%</span> ← <span class="ltr">SCBA</span>)، ثم نوع المادة، ثم التركيز (تحت <span class="ltr">TLV</span> بلا جهاز؛ بين <span class="ltr">TLV</span> و<span class="ltr">IDLH</span> جهاز منقٍّ وفلتر مناسب)، ثم العين (نصف وجه أو وجه كامل).',
   'قبل الدخول مباشرة: فحص الضغط السالب (أغلق الدخول، اشهق، أوقف التنفس 10 ثوانٍ) والموجب (أغلق الخروج، ازفر بهدوء)؛ والتسرب يعني إعادة الوضع والفحص.',
   'يُستبعد مرضى الصدر المزمن والقلب وضيق التنفس وضعف السمع؛ والتنظيف بماء دافئ ثم بارد، بلا مذيبات عضوية، والتخزين في أكياس مغلقة.',
   'حزام الباراشوت للأماكن المرتفعة، وحزام سلامة خاص وحبل إنقاذ للأماكن المغلقة والخزانات لإخراج العامل مستقيماً.',
   'القفازات: جلد وقماش للحواف الحادة، مطاط أو بلاستيك للكيماويات، ومقاومة للحرارة؛ والأوفرهول للورش، والبدل البلاستيكية للأحماض والقلويات.']}
],
 theory:[
  {h:'3- طريقة اختيار جهاز التنفس المناسب (<span class="ltr">Respirator Selection</span>)',ref:'ص 39–40',html:`<ol><li>يتم أولاً <b>قياس نسبة الأوكسجين</b> في المكان المراد العمل به، فإذا كانت هذه النسبة <b>أقل من <span class="ltr">19.5%</span></b> يجب في هذه الحالة استخدام <b>جهاز تنفس مزود للهواء</b> <span class="ltr">(SCBA)</span>.</li>
   <li>إذا كانت نسبة الأوكسجين في المكان أكثر من <span class="ltr">19.5%</span>، يتم <b>تحديد نوع المواد السامة والخطرة</b> بالموقع، وهل هي غازات وأبخرة أم أتربة سامة.</li>
   <li>يتم <b>قياس درجة تركيز</b> هذه المواد، فإذا كانت <b>أقل من النسب المسموح بالتعرض لها <span class="ltr">(TLV)</span></b> يمكن السماح بالعمل في هذه الأماكن بدون استخدام أجهزة التنفس.</li>
   <li>إذا كانت درجة تركيز هذه المواد السامة في المكان المراد العمل به <b>أكثر من الحد المسموح به <span class="ltr">(TLV)</span> وأقل من الجرعة وشيكة الخطر على الحياة أو الصحة <span class="ltr">(IDLH)</span></b>، يتم اختيار جهاز التنفس المناسب والمنقي للأبخرة والغازات السامة أو الأتربة من جدول أنواع أجهزة التنفس، كذلك نوع الفلتر المناسب حسب نوع المادة السامة، وذلك بالرجوع إلى جدول أنواع الفلاتر.</li>
   <li>في حالة ما كانت المادة السامة المراد الحماية منها <b>لا تسبب أي حساسية للعين</b> يمكن استخدام أجهزة التنفس النصفية <span class="ltr">Half Mask</span>، أما إذا كانت المادة <b>تسبب حساسية للعين</b> فيجب في هذه الحالة استخدام جهاز تنفس يغطي الوجه بالكامل <span class="ltr">Full Face-Piece Mask</span>.</li></ol>`},
  {err:`يحيل البند 4 إلى «جدول أنواع أجهزة التنفس» و«جدول أنواع الفلاتر»، ولا يوجد أي منهما في الكتاب. كذلك لا تذكر الخطوات ماذا نفعل إذا كان التركيز يساوي <span class="ltr">IDLH</span> أو أكثر أو كان غير معروف؛ والكتاب نفسه يقول في ص 38 إن الأجهزة المنقية لا تُستعمل في هذه الحالة، فيبقى الجهاز المزوّد للهواء — وهكذا بنينا شجرة الاختيار في «المختبر».`},
  {note:TIP+'<span class="ltr">TLV</span> هو الحد المسموح بالتعرض له (درسناه في الوحدة الثانية)، و<span class="ltr">IDLH</span> هو التركيز الوشيك الخطر على الحياة أو الصحة. بينهما فقط يصلح الجهاز المنقي.'},
  {h:'4- اختبار ملاءمة جهاز التنفس للشخص (<span class="ltr">Fit Testing</span>)',ref:'ص 40',html:`<p>بعد أن يتم اختيار جهاز التنفس المناسب لنوع الخطر في مكان العمل، يجب إجراء اختبار للتأكد من ملاءمة هذا الجهاز للشخص الذي سوف يستعمله، والتأكد من عدم دخول المواد السامة من خلال أربطة القناع <span class="ltr">(Seals)</span>. وهذه الفحوصات تكون على الوجه التالي (هذه الفحوصات يتم إجراؤها <b>قبل الدخول لمكان العمل مباشرة</b>):</p>`},
  {h:'5- فحص الضغط السالب (<span class="ltr">Negative Pressure Testing</span>)',ref:'ص 40',html:`<ul><li>يتم إجراء هذا الفحص قبل الدخول لمكان العمل الملوث بالمواد السامة والخطرة، ويتم ذلك <b>بإغلاق فتحتي دخول الهواء في الفلتر براحتي اليد</b> (كما هو موضح بالشكل <span class="ltr">3-11</span>)، ويبدأ في التنفس حتى يبدأ القناع في الانبعاج <span class="ltr">(Collapsed)</span>، ويتم <b>إيقاف التنفس لمدة <span class="ltr">10</span> ثوانٍ</b>.</li>
   <li>إذا بقي الجهاز على نفس حالة الانبعاج <span class="ltr">(Collapsed)</span>، يؤكد ذلك أن الجهاز <b>مربوط جيداً</b> <span class="ltr">(Sealed)</span>.</li></ul>`},
  {fig:'(3-11)',ref:'ص 41',caption:'فحص الضغط السالب: العامل يضع راحتي يديه على خرطوشتي القناع فيغطي فتحتي دخول الهواء. رسم توضيحي مبسّط.',draw:()=>box(sealSVG({test:'neg',hands:1,press:-1}),360)},
  {h:'6- فحص الضغط الموجب (<span class="ltr">Positive Pressure Testing</span>)',ref:'ص 41',html:`<ul><li>يتم <b>إغلاق فتحة خروج الهواء</b>.</li><li>يتم <b>الزفير بهدوء</b> لتوليد كمية قليلة من الضغط الموجب داخل القناع.</li><li>يعتبر القناع مربوطاً جيداً إذا <b>لم يحدث تسرب للهواء</b> من بين الوجه والقناع (كما هو موضح بالشكل <span class="ltr">3-12</span>).</li><li>في حالة حدوث أي تسرب للهواء يتم تغيير وضع القناع على الوجه وربطه جيداً وإجراء الفحص مرة أخرى.</li></ul>`},
  {fig:'(3-12)',ref:'ص 41',caption:'فحص الضغط الموجب: العامل يضع راحة يد واحدة على مقدمة القناع فيغطي صمام الزفير. رسم توضيحي مبسّط.',draw:()=>box(sealSVG({test:'pos',hands:1,press:0.6}),360)},
  {err:`في ص 41 جاءت الإحالة «(كما هو موضح بالشكل ١٢-٣)» في نهاية جملة «إعادة وضع القناع وربطه»، بينما الشكل يوضح فحص الضغط الموجب نفسه (اليد على صمام الزفير)، فنقلنا الإحالة إلى جملة الفحص.`},
  {h:'7- الفحص الطبي (<span class="ltr">Medical Consideration</span>)',ref:'ص 41',html:`<ul><li>يجب إجراء فحص طبي على جميع العاملين الذين تستدعي طبيعة عملهم استخدام أجهزة التنفس، ويتم استبعاد الأشخاص الذين يشتكون من (أمراض الصدر المزمنة، أمراض القلب، أمراض ضيق التنفس، ضعف السمع).</li><li>يقوم الطبيب وحسب نتيجة الفحص الطبي بتحديد الأشخاص الذين يصلحون لاستعمال أجهزة التنفس والأشخاص الذين لا يصلحون لذلك.</li></ul>`},
  {h:'8- تنظيف وتخزين أجهزة التنفس',ref:'ص 41–42',html:`<ol><li>يتم فك أجزاء أجهزة التنفس وتنظيفها بالمنظفات مع استعمال <b>الماء الدافئ</b> وفرشاة التنظيف، وبعد ذلك يتم وضع الجهاز في <b>ماء بارد</b> وشطفه، ثم يتم تركه ليجف في مكان جاف نظيف.</li>
   <li>يجب <b>عدم استخدام المذيبات العضوية</b> <span class="ltr">Organic Solvents</span> في عملية التنظيف حتى لا تؤثر على الأجزاء البلاستيكية من الجهاز.</li>
   <li>يجب التأكد من شطف الأجهزة جيداً بالماء لإزالة أية آثار للصابون حتى لا يسبب ذلك حساسية لمستعمل الجهاز.</li>
   <li>يجب تخزين أجهزة التنفس في مكان نظيف لحمايتها من الاتساخ بالأتربة.</li>
   <li>يجب وضع أجهزة التنفس بعد تنظيفها في أكياس بلاستيك وإغلاقها جيداً <span class="ltr">Sealable Plastic Bags</span>.</li></ol>`},
  {h:'3-3-7 الحزام الواقي وحبل الإنقاذ (<span class="ltr">Safety Belts and Life Line</span>)',ref:'ص 42',html:`<p>تستخدم أحزمة السلامة وحبل الإنقاذ عند العمل في <b>أماكن مرتفعة</b>، وذلك لتأمين العامل من خطر السقوط، ويتم حالياً استخدام <b>حزام الباراشوت</b> بدلاً من استخدام الحزام العادي (شكل <span class="ltr">3-13</span>).</p>
   <p>في حالة العمل داخل <b>الأماكن المغلقة أو الخزانات</b> يتم استخدام حزام سلامة خاص <span class="ltr">Safety Harness</span> وحبل إنقاذ، وذلك حتى يمكن إخراج العامل في <b>وضع مستقيم</b> لا يعرضه للإصابة عند إخراجه في حالات الطوارئ.</p>`},
  {fig:'(3-13)',ref:'ص 42',caption:'يسار: حزام الباراشوت (حمالة الجسم الكاملة) وحبل وصل بممتص صدمات وماسك حبل على خط الحياة. يمين: الحزام العادي بخطافين. رسم توضيحي مبسّط.',draw:()=>box(fig313(),620)},
  {h:'3-3-8 وقاية اليد (<span class="ltr">Hand Protection</span>)',ref:'ص 43',html:`<p>يستخدم لحماية الأيدي القفازات الواقية <span class="ltr">Safety Gloves</span>، وهناك عدة أنواع منها على النحو التالي:</p>
   <ul><li><b>أ-</b> القفازات الواقية المصنوعة من <b>القماش والجلد المدبوغ</b>، وتستخدم لحماية الأيدي من الشظايا والأجسام الحادة عند مناولة المواد التي بها أطراف حادة (شكل <span class="ltr">3-14</span>).</li>
   <li><b>ب-</b> القفازات الواقية المصنوعة من <b>المطاط أو البلاستيك</b> <span class="ltr">PVC or LATEX Gloves</span>، وتستعمل لحماية الأيدي أثناء مناولة <b>المواد الكيميائية</b> كالأحماض والقلويات، كذلك قفازات <span class="ltr">NEOPRENE</span> (شكل <span class="ltr">3-15</span>).</li>
   <li><b>ج-</b> تستخدم <b>القفازات المقاومة للحرارة</b> <span class="ltr">Heat Resistance Gloves</span> عند العمل على المعدات الساخنة مثل أنابيب البخار، أو لإمساك الأواني الزجاجية الساخنة بالمعامل، وأثناء عمليات اللحام (شكل <span class="ltr">3-16</span>).</li></ul>`},
  {fig:'(3-14) و(3-15) و(3-16)',ref:'ص 43',caption:'قفازات من الجلد المدبوغ والقماش، وقفاز مطاطي طويل، وقفازات جلدية مقاومة للحرارة. رسم توضيحي مبسّط للصور.',draw:()=>photoRow([['leather','(3-14)'],['rubber','(3-15)'],['heat','(3-16)']])},
  {h:'3-3-9 حماية الجسم (<span class="ltr">Body Protection</span>)',ref:'ص 44',html:`<ol><li>تستخدم <b>الأوفرهولات والمرايل الواقية</b> عند العمل بالقرب من الماكينات وفي الورش (شكل <span class="ltr">3-17</span>).</li><li>تستخدم <b>المعاطف والبدل الواقية المصنوعة من البلاستيك</b> للحماية من مخاطر المواد الكيميائية مثل الأحماض والقلويات (شكل <span class="ltr">3-18</span>).</li></ol>`},
  {fig:'(3-17) و(3-18)',ref:'ص 44',caption:'أوفرهول عمل بأشرطة عاكسة (3-17)، ومريلة واقية طويلة (3-18). رسم توضيحي مبسّط للصورتين.',draw:()=>photoRow([['coverall','(3-17)'],['apron','(3-18)']])},
  {err:`أرقام الأشكال <span class="ltr">(3-16)</span> و<span class="ltr">(3-17)</span> و<span class="ltr">(3-18)</span> مكررة في الوحدة: هنا (ص 43–44) للقفازات المقاومة للحرارة والأوفرهول والمريلة، ومرة ثانية (ص 50–51) للافتات الخطر والتحذير والإرشادات في الدرس 3.6؛ لذلك نذكر رقم الصفحة مع رقم الشكل. وفي ص 44 الشكل <span class="ltr">(3-18)</span> مريلة واحدة بينما النص يحيل إليه في «المعاطف والبدل الواقية من البلاستيك». وترقيم أنواع القفازات في الكتاب «أ، ب، ت» فكتبناه «أ، ب، ج»، وصححنا «الوجة» = الوجه.`}
 ],
 lab:(el)=>{el.innerHTML='<div class="grid" id="l4a"></div><div class="grid" id="l4b" style="margin-top:16px"></div>';selLab(el.querySelector('#l4a'));sealLab(el.querySelector('#l4b'))},
 quiz:[
  {q:'ما أول خطوة في اختيار جهاز التنفس المناسب؟',o:['تحديد نوع الفلتر','قياس نسبة الأوكسجين في المكان','قياس التركيز','اختيار القناع النصفي'],c:1,e:'البند 1 (ص 39).'},
  {q:'تركيز المادة السامة أقل من TLV. ماذا يقول الكتاب؟',o:['يجب جهاز SCBA','يمكن السماح بالعمل بدون استخدام أجهزة التنفس','يجب قناع وجه كامل','يُمنع العمل'],c:1,e:'البند 3 (ص 39).'},
  {q:'المادة تسبب حساسية للعين، وتركيزها بين TLV و IDLH. أي جهاز؟',o:['نصف وجه Half Mask','جهاز يغطي الوجه بالكامل Full Face-Piece','لا جهاز','نظارة فقط'],c:1,e:'البند 5 (ص 40).'},
  {q:'في فحص الضغط السالب، كم ثانية يوقف العامل التنفس؟',o:['3','5','10','30'],c:2,e:'«ويتم إيقاف التنفس لمدة 10 ثواني» (ص 40).'},
  {q:'في فحص الضغط الموجب، ماذا يُغلق؟',o:['فتحتا دخول الهواء في الفلتر','فتحة خروج الهواء (صمام الزفير)','الأنف','لا شيء'],c:1,e:'(ص 41) والشكل (3-12).'},
  {q:'لماذا يُستعمل حزام سلامة خاص (Safety Harness) وحبل إنقاذ داخل الخزانات؟',o:['لأنه أرخص','لإخراج العامل في وضع مستقيم لا يعرضه للإصابة في الطوارئ','لحمايته من الكهرباء','لتدفئته'],c:1,e:'(ص 42).'}
 ]
});

/* =====================================================================
   LESSON 5 — PPE letter codes A–K, X and warning labels (ص 44–48)
   ===================================================================== */
const LAB_ITEMS=[['glasses','نظارة سلامة','Safety Glasses'],['goggle','نظارة محكمة','Safety Goggle'],['shield','حامي الوجه','Face Shield'],['gloves','قفازات','Gloves'],['apron','مريلة بلاستيك','Apron'],['dust','كمامة أتربة','Dust Mask'],['vapor','كمامة ضد الأبخرة','Vapor Resp.'],['dv','كمامة ضد الأبخرة والأتربة','Dust &amp; Vapor Resp.'],['airline','قناع مع خرطوم هواء','Mask + Airline'],['suit','بدلة حماية كاملة','Full Suit'],['boot','حذاء طويل','Long Boot'],['helmet','خوذة','Helmet'],['plugs','سدادات أذن','Ear Plugs']];
const toLab=k=>({glassG:'glasses',glassP:'glasses',gogP:'goggle'}[k]||k);
const needOf=L=>new Set(LETTERS[L].map(toLab));
function letterRow(L){const it=LETTERS[L];
  return `<tr><td style="font-size:30px;font-weight:800;font-family:var(--mono);width:56px"><span class="ltr">${L}</span></td><td style="text-align:start">${L==='X'?'الاستفسار من المشرف عن نوع مهمات الوقاية الشخصية المطلوبة للحماية من مخاطر هذه المادة<br><span class="ltr" style="font-weight:700">Ask Your Supervisor For Special Handling Instructions</span>':`<div style="display:flex;flex-wrap:wrap;gap:10px">${it.map(k=>`<div style="text-align:center;min-width:84px">${icon(PPE[k].ic,44)}<div style="font-size:12.5px;line-height:1.4">${PPE[k].ar}<br><b class="ltr">${PPE[k].en}</b></div></div>`).join('')}</div>`}</td><td><span class="ref">${LPAGE[L]}</span></td></tr>`}
const letterTable=keys=>`<div class="tablebox"><table class="tt"><thead><tr><th>الحرف</th><th>المهمات المطلوبة</th><th></th></tr></thead><tbody>${keys.map(letterRow).join('')}</tbody></table></div>`;
/* warning labels ص 48 */
const SIGNS=[
 {k:'cor',en:'CORROSIVE',ar:'مادة حارقة',draw:()=>`<rect x="4" y="4" width="112" height="112" style="fill:${SC.orange};stroke:#111;stroke-width:2"/><path d="M28 18L46 46M84 18L66 46" style="stroke:#111;stroke-width:8;stroke-linecap:round"/><path d="M46 50l-3 10M66 50l3 10" style="stroke:#111;stroke-width:2.5"/><path d="M26 78H62Q70 78 70 72V66L58 70H26Z" style="fill:#111"/><rect x="74" y="66" width="22" height="12" style="fill:#111"/><path d="M78 62q4-6 8 0M30 62q4-6 8 0" style="fill:none;stroke:#111;stroke-width:1.5"/><text x="60" y="104" text-anchor="middle" style="font:700 12px Arial,sans-serif;fill:#111">CORROSIVE</text>`},
 {k:'exp',en:'EXPLOSIVE',ar:'مادة متفجرة',draw:()=>`<rect x="4" y="4" width="112" height="112" style="fill:${SC.orange};stroke:#111;stroke-width:2"/><circle cx="60" cy="50" r="12" style="fill:#111"/>${[0,40,80,120,160,200,240,280,320].map(a=>{const r=a*Math.PI/180;return `<path d="M${(60+18*Math.cos(r)).toFixed(1)} ${(50+18*Math.sin(r)).toFixed(1)}L${(60+34*Math.cos(r)).toFixed(1)} ${(50+34*Math.sin(r)).toFixed(1)}" style="stroke:#111;stroke-width:4"/>`}).join('')}<text x="60" y="104" text-anchor="middle" style="font:700 12px Arial,sans-serif;fill:#111">EXPLOSIVE</text>`},
 {k:'fla',en:'HIGHLY FLAMMABLE',ar:'مادة شديدة الاشتعال',draw:()=>`<rect x="4" y="4" width="112" height="112" style="fill:${SC.orange};stroke:#111;stroke-width:2"/><path d="M60 16Q80 40 72 56Q84 50 82 40Q96 64 78 80H42Q26 64 40 44Q42 56 50 58Q42 36 60 16Z" style="fill:#111"/><path d="M30 84H90" style="stroke:#111;stroke-width:4"/><text x="60" y="103" text-anchor="middle" style="font:700 10px Arial,sans-serif;fill:#111">HIGHLY</text><text x="60" y="113" text-anchor="middle" style="font:700 10px Arial,sans-serif;fill:#111">FLAMMABLE</text>`},
 {k:'rad',en:'RADIO ACTIVE',ar:'مادة مشعة',draw:()=>`<rect x="4" y="4" width="112" height="112" rx="14" style="fill:${SC.yellow};stroke:#111;stroke-width:2"/><circle cx="60" cy="60" r="7" style="fill:${SC.purple}"/>${[90,210,330].map(a=>{const r1=a*Math.PI/180,r0=(a-30)*Math.PI/180,r2=(a+30)*Math.PI/180;return `<path d="M${(60+12*Math.cos(r0)).toFixed(1)} ${(60-12*Math.sin(r0)).toFixed(1)}L${(60+34*Math.cos(r0)).toFixed(1)} ${(60-34*Math.sin(r0)).toFixed(1)}A34 34 0 0 1 ${(60+34*Math.cos(r2)).toFixed(1)} ${(60-34*Math.sin(r2)).toFixed(1)}L${(60+12*Math.cos(r2)).toFixed(1)} ${(60-12*Math.sin(r2)).toFixed(1)}A12 12 0 0 0 ${(60+12*Math.cos(r0)).toFixed(1)} ${(60-12*Math.sin(r0)).toFixed(1)}Z" style="fill:${SC.purple}"/>`}).join('')}<text x="60" y="16" text-anchor="middle" style="font:700 8px Arial,sans-serif;fill:${SC.purple}">CAUTION</text><text x="60" y="110" text-anchor="middle" style="font:700 8px Arial,sans-serif;fill:${SC.purple}">RADIOACTIVE MATERIAL</text>`},
 {k:'rea',en:'REACTIVE',ar:'مادة سريعة التفاعل',draw:()=>`<rect x="4" y="30" width="112" height="60" style="fill:${SC.yellow};stroke:#111;stroke-width:3"/><rect x="12" y="44" width="30" height="32" style="fill:#fff;stroke:#111;stroke-width:2"/><text x="27" y="70" text-anchor="middle" style="font:700 24px Arial,sans-serif;fill:#111">4</text><text x="80" y="66" text-anchor="middle" style="font:700 12px Arial,sans-serif;fill:#111">REACTIVITY</text>`},
 {k:'tox',en:'TOXIC',ar:'مادة سامة',draw:()=>`<rect x="4" y="4" width="112" height="112" style="fill:${SC.orange};stroke:#111;stroke-width:2"/><path d="M30 76L90 92M30 92L90 76" style="stroke:#111;stroke-width:7;stroke-linecap:round"/><path d="M42 50Q42 22 60 22T78 50Q78 62 70 64V72H50V64Q42 62 42 50Z" style="fill:#111"/><circle cx="52" cy="48" r="5" style="fill:${SC.orange}"/><circle cx="68" cy="48" r="5" style="fill:${SC.orange}"/><text x="60" y="110" text-anchor="middle" style="font:700 12px Arial,sans-serif;fill:#111">TOXIC</text>`}];
const signSVG=(S_,w)=>`<svg viewBox="0 0 120 120" width="${w||100}" height="${w||100}" role="img" aria-label="${S_.en}">${S_.draw()}</svg>`;

function equipLab(host){
  const w={L:'C',on:new Set(),res:null,solved:new Set(),asked:false};
  host.innerHTML=`<div class="panel c12"><h2>جهّز العامل <small>مبني على جدول الحروف ص 44–47</small></h2>
    <p class="sub">على ملصق التحذير لكل مادة كيميائية حرف واحد. اختر الحرف (أو اضغط «حرف عشوائي»)، ثم ألبس العامل المهمات المطلوبة لهذا الحرف واضغط «تحقّق».</p>
    <div style="margin-top:6px" id="eqL"></div>
    <div class="wrap-in"><button class="btn" id="rnd">حرف عشوائي</button><span class="sub" id="eqScore"></span></div></div>
   <div class="panel c5"><h2>ملصق المادة</h2><div id="lbl"></div><div class="svgbox" id="wk" style="max-width:240px;margin-inline:auto"></div></div>
   <div class="panel c7"><h2>رف المهمات</h2><div id="shelf" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(104px,1fr));gap:8px;margin-top:8px"></div>
    <div class="wrap-in"><button class="btn primary" id="chk">تحقّق</button><button class="btn" id="ask">اسأل المشرف</button><button class="btn" id="clr">اخلع الكل</button></div><div id="eqRes"></div></div>`;
  const $=s=>host.querySelector(s);
  const nm=k=>LAB_ITEMS.find(i=>i[0]===k)[1];
  function draw(){
    $('#eqL').innerHTML=segHTML('lt',Object.keys(LETTERS).map(k=>[k,(w.solved.has(k)?'✓':'')+k]),w.L,1);
    $('#eqScore').textContent=`أنجزت ${w.solved.size} من ${Object.keys(LETTERS).length} حروف`;
    $('#lbl').innerHTML=`<div style="display:flex;align-items:center;gap:12px;border:3px solid var(--fg);border-radius:10px;padding:8px 12px;max-width:300px;margin-inline:auto;background:var(--surface)"><div style="font:800 46px var(--mono);line-height:1;border:2px solid var(--fg);border-radius:8px;padding:2px 12px" class="ltr">${w.L}</div><div class="sub" style="line-height:1.5">مهمات الوقاية الشخصية<br><span class="ltr">PERSONAL PROTECTION</span></div></div>`;
    $('#wk').innerHTML=workerSVG(w.on);
    $('#shelf').innerHTML=LAB_ITEMS.map(([k,a,e])=>`<button class="btn" data-it="${k}" aria-pressed="${w.on.has(k)}" style="display:flex;flex-direction:column;align-items:center;gap:2px;padding:6px 4px;${w.on.has(k)?'background:var(--blue-soft);border-color:var(--blue)':''}">${icon(ICON[k]?k:'glasses',40)}<small style="font-weight:600;font-size:11.5px;line-height:1.35">${a}</small><small class="ltr" style="font-weight:500;font-size:10.5px;color:var(--muted)">${e}</small></button>`).join('');
    $('#eqRes').innerHTML=w.res?`<div class="callout${w.res.ok?'':' err'}">${w.res.msg}</div>${w.res.show?letterTable([w.L]):''}`:''}
  function check(){const need=needOf(w.L);
    if(w.L==='X'){w.res=w.asked&&!w.on.size?{ok:true,show:1,msg:'<b style="color:var(--on)">صحيح.</b> الحرف X لا يحدد مهمات؛ يجب «الاستفسار من المشرف عن نوع مهمات الوقاية الشخصية المطلوبة للحماية من مخاطر هذه المادة».'}:{ok:false,show:0,msg:'الحرف X لا يذكر مهمات محددة. ماذا يقول الجدول أن تفعل؟ (اخلع ما ألبسته واستعمل الزر المناسب).'};if(w.res.ok)w.solved.add('X');return}
    const miss=[...need].filter(k=>!w.on.has(k)),extra=[...w.on].filter(k=>!need.has(k));
    if(!miss.length&&!extra.length){w.solved.add(w.L);w.res={ok:true,show:1,msg:`<b style="color:var(--on)">صحيح.</b> هذه مهمات الحرف <span class="ltr">${w.L}</span> كما في الجدول:`};return}
    w.res={ok:false,show:0,msg:(miss.length?`<b>ينقصه:</b> ${miss.map(nm).join('، ')}. `:'')+(extra.length?`<b>ليس مطلوباً في هذا الحرف:</b> ${extra.map(nm).join('، ')}.`:'')}}
  host.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
    if(b.dataset.lt){w.L=b.dataset.lt;w.on.clear();w.res=null;w.asked=false}
    if(b.dataset.it){const k=b.dataset.it;w.on.has(k)?w.on.delete(k):w.on.add(k);w.res=null}
    if(b.id==='rnd'){const left=Object.keys(LETTERS).filter(k=>!w.solved.has(k)&&k!==w.L);const pool=left.length?left:Object.keys(LETTERS);w.L=pool[Math.floor(Math.random()*pool.length)];w.on.clear();w.res=null;w.asked=false}
    if(b.id==='clr'){w.on.clear();w.res=null}
    if(b.id==='ask'){w.asked=true;if(w.L==='X'){w.on.clear();check()}else w.res={ok:false,show:0,msg:`الحرف <span class="ltr">${w.L}</span> يحدد المهمات بنفسه في الجدول؛ لا تحتاج إلى السؤال. ألبس العامل ما يطلبه الحرف.`}}
    if(b.id==='chk')check();
    draw()});
  draw()}
function signLab(host){let pick=null;const done=new Set();let msg='';const order=shuffle(SIGNS.map(s=>s.k));
  host.innerHTML=`<div class="panel c12"><h2>طابق اللافتة بمعناها <small>لافتات التحذير ص 48</small></h2><p class="sub">اضغط على لافتة، ثم على معناها بالعربية (المعاني من ص 48). اقرأ الكلمة الإنجليزية والرمز معاً.</p><div id="sg" style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-top:8px"></div><div id="mn" style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:12px"></div><div class="callout" id="sm" style="min-height:2.4em"></div></div>`;
  const $=s=>host.querySelector(s);
  function draw(){$('#sg').innerHTML=SIGNS.map(S_=>`<button class="btn" data-sg="${S_.k}" style="padding:6px;${done.has(S_.k)?'background:var(--on-soft);border-color:var(--on)':pick===S_.k?'background:var(--blue-soft);border-color:var(--blue)':''}">${signSVG(S_,88)}</button>`).join('');
    $('#mn').innerHTML=order.map(k=>{const S_=SIGNS.find(s=>s.k===k);return `<button class="chip" data-mn="${k}" ${done.has(k)?'disabled style="opacity:.55"':''}>${S_.ar}</button>`}).join('');
    $('#sm').innerHTML=msg||`طابقت ${done.size} من ${SIGNS.length}.`}
  host.addEventListener('click',e=>{const a=e.target.closest('[data-sg]');if(a&&!done.has(a.dataset.sg)){pick=a.dataset.sg;msg='اختر الآن المعنى.';draw();return}
    const m=e.target.closest('[data-mn]');if(m&&pick){if(m.dataset.mn===pick){done.add(pick);msg=`<b style="color:var(--on)">صحيح.</b> `+(pick==='cor'?'«CORROSIVE» ترجمها الكتاب «مادة حارقة»، والأدق «مادة أكّالة» (تأكل الجلد والمعادن).':'')+(done.size===SIGNS.length?' أحسنت، طابقت كل اللافتات.':'');pick=null}else msg='ليس هذا المعنى. انظر إلى الرمز داخل اللافتة مرة أخرى.';draw()}});
  draw()}

B.lesson({
 id:'u3-l5',unit:3,order:5,pages:'44–48',
 title:'رموز مهمات الوقاية A–K ولافتات التحذير',
 summary:'جدول الحروف الذي يحدد مهمات الوقاية من المواد الكيميائية (A إلى K و X)، ولافتات التحذير الست ومعانيها.',
 stations:[
  {intro:true},

  {st:1,short:'الحروف على الملصق',title:'3-3-10 مهمات السلامة للوقاية الشخصية (<span class="ltr">PPE</span>) للحماية من المواد الكيميائية',ref:'ص 44',
   q:'على عبوة المادة الكيميائية حرف واحد فقط… كيف يخبرك بكل ما يجب أن تلبسه؟',
   art:(()=>{const {art,tx,D,P,C}=U3S;let s='';
    s+=`<g data-tip="عبوة مادة كيميائية عليها ملصق التحذير."><path d="M120 92H240V266Q240 276 230 276H130Q120 276 120 266Z" fill="#E3E7EA" stroke="${D}" stroke-width="3"/><rect x="156" y="62" width="48" height="30" rx="4" fill="${C.teal}" stroke="${D}" stroke-width="3"/></g>`;
    s+=`<g data-tip="ملصق التحذير لكل مادة: فيه خانة مخصصة لمهمات الوقاية الشخصية."><rect x="132" y="116" width="96" height="140" rx="6" fill="${P}" stroke="${D}" stroke-width="2.4"/><rect x="132" y="116" width="96" height="26" rx="6" fill="${C.coral}"/>${tx(180,134,'تحذير',{fs:12,w:700,fill:'#fff'})}<path d="M142 156H218M142 168H206M142 180H214" stroke="#9aa5a0" stroke-width="3"/></g>`;
    s+=`<g data-tip="خانة مهمات الوقاية الشخصية: يُكتب فيها الحرف المناسب لنوع الخطر (هنا ⟦H⟧ مثالاً)، وبالرجوع إلى جدول الحروف تُعرف المهمات المطلوبة."><rect x="146" y="194" width="68" height="52" rx="6" fill="#fff" stroke="${D}" stroke-width="2.4"/>${tx(180,208,'PPE',{fs:9.5,mono:1})}${tx(180,240,'H',{fs:28,mono:1,w:700})}</g>`;
    s+=`<g data-tip="جدول الحروف ⟦A⟧ إلى ⟦K⟧ و⟦X⟧: كل حرف يشمل مجموعة من مهمات الوقاية المطلوب استعمالها."><path d="M232 220Q262 220 266 186" fill="none" stroke="${D}" stroke-width="2.4" stroke-dasharray="5 4"/><rect x="250" y="96" width="82" height="88" rx="8" fill="${P}" stroke="${D}" stroke-width="2.4"/>${['A','B','C','…','H','K'].map((l,i)=>tx(270+(i%2)*40,124+Math.floor(i/2)*24,l,{fs:13,mono:1,w:700,fill:l==='H'?C.coral:D})).join('')}</g>`;
    return art('عبوة مادة كيميائية على ملصقها خانة مهمات الوقاية فيها حرف، وجدول الحروف بجانبها',C.sand,s+tx(180,300,'الحرف على الملصق ← الجدول ← المهمات',{fs:13,w:700}))})(),
   cap:'رسم توضيحي؛ الحرف <span class="ltr">H</span> مثال فقط.<br><b>مرّر المؤشر على العبوة والملصق والخانة والجدول (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'أين يُكتب حرف مهمات الوقاية لكل مادة كيميائية؟',opts:[
     ['على باب المخزن',false,'الكتاب يذكر ملصق التحذير لكل مادة.'],
     ['على ملصق التحذير للمادة في الخانة المخصصة لمهمات الوقاية الشخصية',true,'نص ص 44.'],
     ['على خوذة العامل',false,'غير مذكور.']]}}
   ],
   body:[
    {book:`<p><b>3-3-10 مهمات السلامة للوقاية الشخصية <span class="ltr">PPE</span> للحماية من المواد الكيميائية:</b> فيما يلي جدول يوضح معدات الوقاية الشخصية الواجب استخدامها للحماية من مخاطر المواد الكيميائية وهي مدرجة على شكل حروف اللغة الإنجليزية بحيث يشمل كل حرف مجموعة من مهمات الوقاية المطلوب استعمالها ويذكر على ملصق التحذير لكل مادة في الخانة المخصصة لمهمات الوقاية الشخصية الحرف المناسب لنوع الخطر وبالرجوع لهذا الجدول يتم تحديد المهمات المناسبة المطلوب استخدامها:</p>`,ref:'ص 44'},
    {tip:`<p>الفكرة مثل «الشفرة»: بدل أن يُكتب على كل عبوة قائمة طويلة، يُكتب حرف واحد، والجدول (المحطة التالية) يفك الشفرة. لذلك يجب أن يكون الجدول معروفاً لكل من يتعامل مع المواد.</p>`,title:'حرف بدل قائمة'},
    {title:'تحقق سريع',widget:(el,B)=>DCML.tf(el,B,{intro:'احكم بحسب ص 44.',items:[
 ['كل حرف في الجدول يدل على مجموعة من مهمات الوقاية.',true,'«بحيث يشمل كل حرف مجموعة من مهمات الوقاية المطلوب استعمالها».'],
 ['الحرف يُختار حسب نوع الخطر في المادة.',true,'«الحرف المناسب لنوع الخطر».'],
 ['الحروف تدل على درجة حرارة المادة.',false,'تدل على مهمات الوقاية المطلوبة.']]})}
   ]},

  {st:2,short:'جدول الحروف',title:'جدول الحروف <span class="ltr">A – K</span> و<span class="ltr">X</span>',ref:'ص 44–47',
   q:'من نظارة وحدها حتى بدلة كاملة بخط هواء… كيف تتدرج الحروف؟',
   art:(()=>{const {art,nest,hot,tx,C}=U3S;
    const w=workerSVG(new Set(['airline','gloves','suit','boot']),{airLbl:'',lbl:'عامل بمهمات الحرف K'});
    const ex=hot(84,30,72,80,'قناع تنفس مع خرطوم تزويد هواء ⟦Mask + Airline⟧.')+hot(76,112,88,170,'بدلة حماية كاملة ⟦Full Suit⟧.')+hot(38,224,32,44,'قفازات ⟦Gloves⟧.')+hot(170,224,32,44,'قفازات ⟦Gloves⟧.')+hot(70,282,100,84,'حذاء طويل ⟦Long Boot⟧.');
    return art('عامل بمهمات الحرف K: قناع بخط هواء وقفازات وبدلة كاملة وحذاء طويل',C.peach,nest(w,96,24,152,234,{extra:ex})+`<g data-tip="الحرف ⟦K⟧ أشد الحروف (ص 47)."><rect x="262" y="40" width="58" height="58" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/>${tx(291,82,'K',{fs:34,mono:1,w:700})}</g>`+tx(180,284,'أشد الحروف',{fs:14,w:700}))})(),
   cap:'العامل بمهمات الحرف <span class="ltr">K</span> (ص 47)، رسم توضيحي.<br><b>مرّر المؤشر على المهمات (أو المسها في الجوال) لتعرف اسم كل منها.</b>',
   side:[
    {predict:{q:'أي حرف يستخدم حامي الوجه <span class="ltr">Face Shield</span> بدل النظارة؟',opts:[
     ['<span class="ltr">C</span>',false,'<span class="ltr">C</span>: نظارة بلاستيك وقفازات ومريلة.'],
     ['<span class="ltr">G</span>',false,'<span class="ltr">G</span>: نظارة وقفازات وكمامة ضد الأبخرة.'],
     ['<span class="ltr">D</span>',true,'<span class="ltr">D</span>: حامي الوجه وقفازات ومريلة بلاستيك (ص 45).']]}}
   ],
   body:[
    {book:letterTable(Object.keys(LETTERS))+'<p class="sub">الرسوم أيقونات توضيحية مبسّطة عن أيقونات الكتاب.</p>',ref:'ص 44–47'},
    {watch:`<p>في جدول الحروف سُمّيت النظارة في <span class="ltr">A</span> و<span class="ltr">B</span> و<span class="ltr">F</span> «نظارة زجاجية» وفي <span class="ltr">C، E، G، I</span> «نظارة بلاستيك» والاسم الإنجليزي في الحالتين <span class="ltr">Safety Glasses</span>، وفي <span class="ltr">H</span> و<span class="ltr">J</span> «نظارة بلاستيك» بالإنجليزية <span class="ltr">Safety Goggle</span> (أي نظارة محكمة). وصححنا «الوقية» = الوقاية في الحرف <span class="ltr">X</span>.</p>`,fix:true},
    {tip:`<p>الحروف تتدرج: <span class="ltr">A</span> نظارة فقط، ثم تُضاف القفازات <span class="ltr">(B)</span>، ثم المريلة <span class="ltr">(C)</span>، و<span class="ltr">D</span> مثل <span class="ltr">C</span> لكن بحامي الوجه، ثم حماية التنفس من الأتربة <span class="ltr">(E، F)</span> أو الأبخرة <span class="ltr">(G، H)</span> أو الاثنين <span class="ltr">(I، J)</span>، وأشدها <span class="ltr">K</span>. و<span class="ltr">X</span> تعني: لا تبدأ قبل أن تسأل المشرف.</p>`,title:'كيف تحفظ الجدول؟'},
    {title:'مختبر مصغّر: فك الشفرة',widget:(el,B)=>DCML.cases(el,B,{intro:'استعن بالجدول أعلاه.',cases:[
 {q:'ما الذي يضيفه الحرف <span class="ltr">H</span> على الحرف <span class="ltr">G</span>؟',opts:[
  ['مريلة بلاستيك، والنظارة فيه <span class="ltr">Safety Goggle</span>',true,'<span class="ltr">G</span>: نظارة + قفازات + كمامة أبخرة؛ <span class="ltr">H</span>: نظارة <span class="ltr">Goggle</span> + قفازات + مريلة + كمامة أبخرة.'],
  ['كمامة أتربة',false,'كمامة الأتربة في <span class="ltr">E</span> و<span class="ltr">F</span>.']]},
 {q:'ملصق مادة عليه الحرف <span class="ltr">F</span>. ماذا تلبس؟',opts:[
  ['نظارة زجاجية وقفازات ومريلة بلاستيك وكمامة أتربة',true,'هذا صف <span class="ltr">F</span> (ص 45).'],
  ['نظارة وقفازات وكمامة ضد الأبخرة',false,'هذا الحرف <span class="ltr">G</span>.']]},
 {q:'ملصق مادة عليه الحرف <span class="ltr">X</span>.',opts:[
  ['ألبس مهمات الحرف <span class="ltr">K</span> احتياطاً',false,'الكتاب لا يقول ذلك.'],
  ['أستفسر من المشرف عن نوع المهمات المطلوبة',true,'الحرف <span class="ltr">X</span>: <bdi dir="ltr">Ask Your Supervisor For Special Handling Instructions</bdi> (ص 47).']]}]})},
    {tip:`<p>في تبويب «المختبر» نشاط «جهّز العامل»: يظهر لك حرف فتُلبس العامل مهماته.</p>`}
   ]},

  {st:3,short:'لافتات التحذير',title:'3-3-11 بعض لافتات التحذير',ref:'ص 48',
   q:'جمجمة، لهب، انفجار… هل تعرف معنى كل لافتة قبل أن تقرأ كلمتها؟',
   art:(()=>{const {art,nest,tx,C}=U3S;let s='';
    SIGNS.forEach((S_,i)=>{const x=40+(i%3)*96,y=46+Math.floor(i/3)*118;s+=`<g data-tip="${S_.ar} ⟦${S_.en}⟧${S_.k==='cor'?' — والأدق: مادة أكّالة (تُتلف الجلد والمعادن بالتفاعل الكيميائي).':''}">${nest(signSVG(S_,100),x,y,88,88)}${tx(x+44,y+104,S_.ar.replace('مادة ',''),{fs:11.5,w:700})}</g>`});
    return art('ست لافتات تحذير: حارقة، متفجرة، شديدة الاشتعال، مشعة، سريعة التفاعل، سامة',C.lilac,s)})(),
   cap:'رسم مبسّط للافتات ص 48؛ المعاني من الكتاب.<br><b>مرّر المؤشر على أي لافتة (أو المسها في الجوال) لتقرأ معناها بالعربية والإنجليزية.</b>',
   side:[
    {predict:{q:'لافتة برتقالية عليها جمجمة وعظمتان متقاطعتان تعني:',opts:[
     ['مادة متفجرة',false,'المتفجرة رمزها انفجار تخرج منه أشعة.'],
     ['مادة سامة <span class="ltr">TOXIC</span>',true,'(ص 48).'],
     ['مادة مشعة',false,'المشعة رمزها ثلاث شفرات حول نقطة على خلفية صفراء.']]}}
   ],
   body:[
    {book:`<p><b>3-3-11 بعض لافتات التحذير:</b></p><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px;margin-top:8px">${SIGNS.map(S_=>`<div style="text-align:center;background:var(--surface-2);border-radius:10px;padding:8px">${signSVG(S_,90)}<div style="margin-top:4px">${S_.ar}<br><b class="ltr">${S_.en}</b></div></div>`).join('')}</div>`,ref:'ص 48'},
    {watch:`<p>ترجم الكتاب <span class="ltr">CORROSIVE</span> «مادة حارقة»، والأدق «<b>مادة أكّالة</b>»: أي مادة تُتلف الجلد والمعادن بالتفاعل الكيميائي (مثل الأحماض والقلويات القوية)، وليست مادة تشتعل.</p>`,fix:true},
    {add:`<p>هذه الرموز تراها على شاحنات نقل المواد الخطرة وعلى عبوات المنظفات القوية في البيت أيضاً؛ الرمز يُفهم حتى لمن لا يقرأ اللغة المكتوبة.</p>`,title:'أين تراها؟'},
    {title:'مختبر مصغّر: ما الخطر؟',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل وصف للافتة اختر نوع الخطر.',cats:['تشتعل أو تنفجر','تسمم أو تشع','تأكل الجلد والمعادن'],items:[
 ['لهب أسود فوق خط: <span class="ltr">HIGHLY FLAMMABLE</span>',0,'مادة شديدة الاشتعال.'],
 ['جمجمة وعظمتان: <span class="ltr">TOXIC</span>',1,'مادة سامة.'],
 ['سائل يُسكب على يد وقضيب: <span class="ltr">CORROSIVE</span>',2,'مادة حارقة كما في الكتاب، والأدق أكّالة.'],
 ['ثلاث شفرات حول نقطة: <span class="ltr">RADIO ACTIVE</span>',1,'مادة مشعة.'],
 ['انفجار تخرج منه أشعة: <span class="ltr">EXPLOSIVE</span>',0,'مادة متفجرة.']]})},
    {tip:`<p>مطابقة اللافتات الست بمعانيها تجدها في تبويب «المختبر».</p>`}
   ]},

  {recap:[
   'مهمات الوقاية من المواد الكيميائية مرمزة بحروف إنجليزية، ويُكتب الحرف على ملصق التحذير لكل مادة.',
   'الحروف تتدرج: <span class="ltr">A</span> نظارة، <span class="ltr">B</span> + قفازات، <span class="ltr">C</span> + مريلة، <span class="ltr">D</span> حامي الوجه، <span class="ltr">E/F</span> كمامة أتربة، <span class="ltr">G/H</span> أبخرة، <span class="ltr">I/J</span> الاثنان.',
   '<span class="ltr">K</span>: قناع بخط هواء وقفازات وبدلة كاملة وحذاء طويل؛ و<span class="ltr">X</span>: اسأل المشرف.',
   'لافتات التحذير: حارقة (أكّالة)، متفجرة، شديدة الاشتعال، مشعة، سريعة التفاعل، سامة.']}
],
 theory:[
  {h:'3-3-10 مهمات السلامة للوقاية الشخصية (PPE) للحماية من المواد الكيميائية',ref:'ص 44',html:`<p>فيما يلي جدول يوضح معدات الوقاية الشخصية الواجب استخدامها للحماية من مخاطر المواد الكيميائية، وهي <b>مدرجة على شكل حروف اللغة الإنجليزية</b> بحيث يشمل كل حرف مجموعة من مهمات الوقاية المطلوب استعمالها، ويذكر على <b>ملصق التحذير لكل مادة</b> في الخانة المخصصة لمهمات الوقاية الشخصية <b>الحرف المناسب لنوع الخطر</b>، وبالرجوع لهذا الجدول يتم تحديد المهمات المناسبة المطلوب استخدامها:</p>`},
  {h:'جدول الحروف A – K و X',ref:'ص 44–47',html:letterTable(Object.keys(LETTERS))+'<p class="sub">الرسوم أيقونات توضيحية مبسّطة عن أيقونات الكتاب.</p>'},
  {note:TIP+'لاحظ أن الحروف تتدرج: <span class="ltr">A</span> نظارة فقط، ثم تُضاف القفازات <span class="ltr">(B)</span>، ثم المريلة <span class="ltr">(C)</span>، ثم حماية التنفس من الأتربة <span class="ltr">(E، F)</span> أو الأبخرة <span class="ltr">(G، H)</span> أو الاثنين <span class="ltr">(I، J)</span>، وأشدها <span class="ltr">K</span>: قناع بخط هواء وبدلة كاملة وحذاء طويل. و<span class="ltr">X</span> تعني: لا تبدأ قبل أن تسأل المشرف.'},
  {err:`في جدول الحروف سُمّيت النظارة في <span class="ltr">A</span> و<span class="ltr">B</span> و<span class="ltr">F</span> «نظارة زجاجية» وفي <span class="ltr">C، E، G، I</span> «نظارة بلاستيك» والاسم الإنجليزي في الحالتين <span class="ltr">Safety Glasses</span>، وفي <span class="ltr">H</span> و<span class="ltr">J</span> «نظارة بلاستيك» بالإنجليزية <span class="ltr">Safety Goggle</span> (أي نظارة محكمة). في نشاط «جهّز العامل» جمعنا الزجاجية والبلاستيكية في «نظارة سلامة»، وجعلنا <span class="ltr">Safety Goggle</span> «نظارة محكمة». وصححنا «الوقية» = الوقاية في الحرف <span class="ltr">X</span>.`},
  {h:'3-3-11 بعض لافتات التحذير',ref:'ص 48',html:`<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px;margin-top:8px">${SIGNS.map(S_=>`<div style="text-align:center;background:var(--surface-2);border-radius:10px;padding:8px">${signSVG(S_,100)}<div style="margin-top:4px">${S_.ar}<br><b class="ltr">${S_.en}</b></div></div>`).join('')}</div><p class="sub">رسم توضيحي مبسّط للافتات؛ المعاني بالعربية والإنجليزية من الكتاب.</p>`},
  {err:`ترجم الكتاب <span class="ltr">CORROSIVE</span> «مادة حارقة»، والأدق «<b>مادة أكّالة</b>»: أي مادة تُتلف الجلد والمعادن بالتفاعل الكيميائي (مثل الأحماض والقلويات القوية)، وليست مادة تشتعل.`}
 ],
 lab:(el)=>{el.innerHTML='<div class="grid" id="l5a"></div><div class="grid" id="l5b" style="margin-top:16px"></div>'+`<div class="panel" style="margin-top:16px">${tries(['جرّب الحرف K: ما الذي يميزه عن بقية الحروف؟','قارن الحرفين G و H: ما الفرق في المهمات؟','جرّب الحرف X.','طابق لافتة الجمجمة ولافتة اللهب بمعنييهما.'])}</div>`;equipLab(el.querySelector('#l5a'));signLab(el.querySelector('#l5b'))},
 quiz:[
  {q:'أين يُكتب حرف مهمات الوقاية لكل مادة كيميائية؟',o:['على باب المخزن','على ملصق التحذير للمادة في الخانة المخصصة لمهمات الوقاية الشخصية','في دفتر العامل','على الخوذة'],c:1,e:'(ص 44).'},
  {q:'ما المهمات المطلوبة للحرف B؟',o:['نظارة فقط','نظارة وقفازات','نظارة وقفازات ومريلة','حامي الوجه وقفازات ومريلة'],c:1,e:'B: نظارة زجاجية Safety Glasses + قفازات Gloves (ص 45).'},
  {q:'أي حرف يستخدم حامي الوجه (Face Shield) بدل النظارة؟',o:['C','D','E','G'],c:1,e:'D: حامي الوجه + قفازات + مريلة بلاستيك (ص 45).'},
  {q:'ماذا يطلب الحرف K؟',o:['نظارة وكمامة أتربة','قناع تنفس مع خرطوم تزويد هواء، وقفازات، وبدلة حماية كاملة، وحذاء طويل','قفازات فقط','حامي الوجه ومريلة'],c:1,e:'(ص 47).'},
  {q:'وجدت على ملصق المادة الحرف X. ماذا تفعل؟',o:['ألبس كل المهمات','لا ألبس شيئاً','أستفسر من المشرف عن المهمات المطلوبة','ألبس نظارة فقط'],c:2,e:'«Ask Your Supervisor For Special Handling Instructions» (ص 47).'},
  {q:'لافتة برتقالية عليها جمجمة وعظمتان متقاطعتان تعني:',o:['مادة متفجرة','مادة سامة TOXIC','مادة مشعة','مادة شديدة الاشتعال'],c:1,e:'(ص 48).'}
 ]
});

/* =====================================================================
   LESSON 6 — safety colours, OSHA/ANSI signs, pipe marking + unit questions (ص 49–56)
   ===================================================================== */
const STRIPES=`repeating-linear-gradient(45deg,#111 0 8px,${SC.yellow} 8px 16px,#111 16px 24px,#fff 24px 32px)`;
const COLORS=[
 {k:'r1',sw:SC.red,c:'الأحمر <span class="ltr">RED</span>',m:'خطر <span class="ltr">DANGER</span>',a:'اللافتات الإرشادية، الحاويات المأمونة',g:'red'},
 {k:'r2',sw:SC.red,c:'الأحمر <span class="ltr">RED</span>',m:'قف <span class="ltr">STOP</span>',a:'أزرار الإيقاف في حالات الطوارئ والتعرف على معدات الحريق',g:'red'},
 {k:'fo',sw:SC.fluo,c:'البرتقالي الفلورسنت <span class="ltr">Fluorescent Orange</span>، البرتقالي والأحمر <span class="ltr">Orange-Red</span>',m:'المخاطر البيولوجية <span class="ltr">BIOSAFETY</span>',a:'اللافتات الخاصة بمخلفات المواد المعدنية',g:'fluo'},
 {k:'ye',sw:SC.yellow,c:'الأصفر <span class="ltr">Yellow</span>',m:'التحذير <span class="ltr">CAUTION</span>',a:'للتحذير من مخاطر القفز والسقوط – الحاويات المأمونة للمواد المتفجرة والمواد الآكلة',g:'yellow'},
 {k:'or',sw:SC.orange,c:'البرتقالي <span class="ltr">Orange</span>',m:'التحذير <span class="ltr">WARNING</span>',a:'أجزاء من المعدات – المعدات الدوارة التي قد تسبب الجروح والسحق',g:'orange'},
 {k:'gr',sw:SC.green,c:'الأخضر <span class="ltr">Green</span>',m:'الأمان <span class="ltr">SAFETY</span>',a:'أماكن معدات الإسعافات الأولية، أماكن معدات السلامة: أدشاش السلامة – أجهزة التنفس',g:'green'},
 {k:'bl',sw:SC.blue,c:'الأزرق <span class="ltr">Blue</span>',m:'معلومات <span class="ltr">Information</span>',a:'اللافتات – لوح الإعلانات',g:'blue'},
 {k:'bw',sw:STRIPES,c:'الأسود، الأبيض / الأصفر أو خليط من الأسود مع الأبيض أو الأصفر',m:'الحدود <span class="ltr">Boundaries</span>',a:'علامات المرور، السلالم، الاتجاهات',g:'stripe'},
 {k:'ma',sw:SC.magenta,c:'اللون البنفسجي <span class="ltr">Magenta</span>',m:'التحذير من الإشعاع <span class="ltr">Radiation Caution</span>',a:'الأشعة السينية، ألفا، بيتا، جاما، المواد المشعة',g:'magenta'}];
const swatch=(bg,sz)=>`<span style="display:inline-block;width:${sz||26}px;height:${sz||26}px;border-radius:6px;border:1px solid var(--fg);background:${bg};vertical-align:middle"></span>`;
const colorTable=()=>`<div class="tablebox"><table class="tt"><thead><tr><th></th><th>اللون</th><th>المعنى</th><th>التطبيق</th></tr></thead><tbody>${COLORS.map(r=>`<tr><td>${swatch(r.sw)}</td><td>${r.c}</td><td>${r.m}</td><td style="text-align:start">${r.a}</td></tr>`).join('')}</tbody></table></div>`;
/* OSHA / ANSI signs (second figures 3-16 … 3-18 and the unnumbered ANSI panel) */
const F='font-family:Arial,sans-serif;font-weight:700';
function oshaSign(k){let s='';
  if(k==='danger')s=`<rect x="3" y="3" width="234" height="134" rx="6" style="fill:#fff;stroke:#111;stroke-width:3"/><rect x="12" y="12" width="216" height="44" rx="8" style="fill:#111"/><ellipse cx="120" cy="34" rx="70" ry="17" style="fill:${SC.red};stroke:#fff;stroke-width:3"/><text x="120" y="41" text-anchor="middle" style="${F};font-size:20px;fill:#fff">DANGER</text><text x="110" y="104" text-anchor="middle" style="${F};font-size:22px;fill:#111">EXPLOSIVE</text><path d="M196 92l6 -10l2 10l10-4l-6 9l10 4l-11 2l3 10l-8-7l-6 8l-1-10l-10 1l8-6z" style="fill:#111"/>`;
  if(k==='caution')s=`<rect x="3" y="3" width="164" height="214" rx="6" style="fill:${SC.yellow};stroke:#111;stroke-width:3"/><rect x="14" y="14" width="142" height="40" rx="8" style="fill:#111"/><text x="85" y="42" text-anchor="middle" style="${F};font-size:20px;fill:${SC.yellow}">CAUTION</text><circle cx="85" cy="118" r="7" style="fill:${SC.purple}"/>${[90,210,330].map(a=>{const r0=(a-30)*Math.PI/180,r2=(a+30)*Math.PI/180,c=[85,118];return `<path d="M${(c[0]+11*Math.cos(r0)).toFixed(1)} ${(c[1]-11*Math.sin(r0)).toFixed(1)}L${(c[0]+38*Math.cos(r0)).toFixed(1)} ${(c[1]-38*Math.sin(r0)).toFixed(1)}A38 38 0 0 1 ${(c[0]+38*Math.cos(r2)).toFixed(1)} ${(c[1]-38*Math.sin(r2)).toFixed(1)}L${(c[0]+11*Math.cos(r2)).toFixed(1)} ${(c[1]-11*Math.sin(r2)).toFixed(1)}Z" style="fill:${SC.purple}"/>`}).join('')}<text x="85" y="182" text-anchor="middle" style="${F};font-size:14px;fill:#111">RADIOACTIVE</text><text x="85" y="200" text-anchor="middle" style="${F};font-size:14px;fill:#111">MATERIALS</text>`;
  if(k==='safety')s=`<rect x="3" y="3" width="234" height="164" rx="6" style="fill:#fff;stroke:#111;stroke-width:3"/><rect x="9" y="9" width="222" height="152" rx="4" style="fill:none;stroke:#111;stroke-width:1.5"/><rect x="18" y="16" width="204" height="56" rx="8" style="fill:${SC.green}"/><text x="120" y="40" text-anchor="middle" style="${F};font-size:18px;fill:#fff">SAFETY</text><text x="120" y="62" text-anchor="middle" style="${F};font-size:18px;fill:#fff">FIRST</text><text x="120" y="98" text-anchor="middle" style="${F};font-size:15px;fill:#111">Climb ladders</text><text x="120" y="120" text-anchor="middle" style="${F};font-size:15px;fill:#111">slowly and use</text><text x="120" y="142" text-anchor="middle" style="${F};font-size:15px;fill:#111">both hands</text>`;
  const vb={danger:'0 0 240 140',caution:'0 0 170 220',safety:'0 0 240 170'}[k];
  return `<svg viewBox="${vb}" style="max-width:${k==='caution'?150:220}px;width:100%" role="img" aria-label="${k}">${s}</svg>`}
function ansiSign(k){let s='',vb='0 0 200 130';
  const top=(bg,shape,txt,tc)=>`<rect x="3" y="3" width="194" height="124" rx="6" style="fill:${bg};stroke:#111;stroke-width:3"/>`+(shape==='oval'?`<rect x="10" y="10" width="180" height="36" rx="6" style="fill:#111"/><ellipse cx="100" cy="28" rx="56" ry="14" style="fill:${SC.red};stroke:#fff;stroke-width:2.5"/>`:shape==='hex'?`<rect x="10" y="10" width="180" height="36" rx="6" style="fill:#111"/><path d="M48 28L60 15H140L152 28L140 41H60Z" style="fill:${SC.orange}"/>`:shape==='win'?`<rect x="16" y="10" width="168" height="36" rx="8" style="fill:#111"/>`:`<rect x="10" y="10" width="180" height="36" style="fill:${SC.blue}"/>`)+`<text x="100" y="35" text-anchor="middle" style="${F};font-size:17px;fill:${tc}">${txt}</text>`;
  const lines=(arr,fs,x)=>arr.map((t,i)=>`<text x="${x||100}" y="${72+i*(fs+5)}" text-anchor="middle" style="${F};font-size:${fs}px;fill:#111">${t}</text>`).join('');
  if(k==='danger')s=top('#fff','oval','DANGER','#fff')+lines(['EYE PROTECTION','REQUIRED BEYOND','THIS POINT'],13);
  if(k==='warning')s=top(SC.orange,'hex','WARNING','#111')+lines(['CORROSIVE','MATERIAL WEAR','PROTECTIVE','CLOTHING'],11,80)+`<path d="M160 100Q150 80 160 70Q172 80 180 100Z" style="fill:#111"/><path d="M164 60v6M172 58v6" style="stroke:#111;stroke-width:3"/>`;
  if(k==='caution')s=top(SC.yellow,'win','CAUTION',SC.yellow)+lines(['CARCINOGENS','Authorized','personnel only'],14);
  if(k==='notice')s=top('#fff','band','NOTICE','#fff')+lines(['REMOVE GLOVES','BEFORE EXITING','LABORATORY'],13);
  if(k==='general'){vb='0 0 130 130';s=`<rect x="3" y="3" width="124" height="124" rx="12" style="fill:#fff;stroke:#111;stroke-width:3"/><rect x="11" y="11" width="108" height="108" rx="6" style="fill:${SC.green}"/><path d="M40 40Q65 22 90 40Q65 58 40 40Z" style="fill:#fff"/><circle cx="65" cy="40" r="7" style="fill:${SC.green}"/><path d="M52 96L65 72L78 96Z" style="fill:#fff"/>${[56,65,74].map(x=>`<circle cx="${x}" cy="62" r="2.5" style="fill:#fff"/>`).join('')}`}
  if(k==='fire'){vb='0 0 240 130';s=[0,1].map(i=>`<g transform="translate(${i*122} 0)"><rect x="3" y="3" width="114" height="124" rx="6" style="fill:${SC.red};stroke:#fff;stroke-width:3"/>${i?`${[30,42,54,66,78].map(x=>`<rect x="${x}" y="18" width="9" height="62" rx="3" style="fill:#fff"/>`).join('')}<circle cx="96" cy="50" r="9" style="fill:none;stroke:#fff;stroke-width:3"/>`:`${[30,22,14].map(r=>`<circle cx="58" cy="50" r="${r}" style="fill:none;stroke:#fff;stroke-width:4"/>`).join('')}<path d="M88 50h18" style="stroke:#fff;stroke-width:5"/>`}<rect x="12" y="94" width="96" height="24" style="fill:#fff"/><text x="60" y="111" text-anchor="middle" style="${F};font-size:13px;fill:${SC.red}">${i?'HOSE REEL':'FIRE HOSE'}</text></g>`).join('')}
  return `<svg viewBox="${vb}" style="width:100%;max-width:${k==='fire'?240:k==='general'?130:200}px" role="img" aria-label="ANSI ${k}">${s}</svg>`}
const ansiPanel=()=>`<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;align-items:end">${[['danger','أ- خطر <span class="ltr">Danger</span>'],['warning','ب- تنبيه <span class="ltr">Warning</span>'],['caution','ج- تحذير <span class="ltr">Caution</span>'],['notice','ملاحظات <span class="ltr">Notice</span>'],['general','إرشادات عامة <span class="ltr">General Safety</span>'],['fire','معدات الإطفاء <span class="ltr">Fire Safety</span>']].map(([k,c])=>`<div style="text-align:center">${ansiSign(k)}<div class="sub">${c}</div></div>`).join('')}</div>`;
/* pipe marking */
const PCAT={high:{ar:'مواد عالية الخطورة',bg:SC.yellow,fg:'#111',bgN:'أصفر',fgN:'أسود',fig:'(3-19)'},liq:{ar:'منخفضة الخطورة — سائلة',bg:SC.green,fg:'#fff',bgN:'أخضر',fgN:'أبيض',fig:'(3-20)'},gas:{ar:'منخفضة الخطورة — غازية',bg:SC.blue,fg:'#fff',bgN:'أزرق',fgN:'أبيض',fig:''},fire:{ar:'مواد إطفاء الحرائق',bg:SC.red,fg:'#fff',bgN:'أحمر',fgN:'أبيض',fig:'(3-20)'}};
const PRESET={high:['NITRIC ACID','STEAM 100 PSIG'],liq:['CHILLED WATER RETURN'],gas:['COMPRESSED AIR'],fire:['SPRINKLER-FIRE']};
const HROWS=[[0.75,1.25,0.5,'0.75 – 1.25'],[1.5,2,0.75,'1.50 – 2'],[2.5,6,1.25,'2.50 – 6'],[8,10,2.5,'8 – 10'],[10,Infinity,3.5,'أكثر من 10']];
function letterH(d){if(d<0.75)return {h:0.5,row:'أقل من 0.75',low:1};
  for(let i=0;i<HROWS.length;i++){const r=HROWS[i];if(i===4?d>10:(d>=r[0]&&d<=r[1]))return {h:r[2],row:r[3],i}
    if(i<4&&d>r[1]&&d<HROWS[i+1][0])return {h:HROWS[i+1][2],row:HROWS[i+1][3],gap:[r[1],HROWS[i+1][0]],i:i+1}}
  return {h:3.5,row:'أكثر من 10',i:4}}
const hTable=()=>`<div class="tablebox" style="max-width:420px;margin-inline:auto"><table class="tt"><thead><tr><th>قطر الأنبوب</th><th>ارتفاع الحروف</th></tr></thead><tbody>${HROWS.map(r=>`<tr><td>${r[3].replace(/([\d.]+ – [\d.]+|10)/,'<span class="ltr">$1</span>')} بوصة</td><td><span class="ltr">${r[2].toFixed(2).replace(/0$/,'')}</span> بوصة</td></tr>`).join('')}</tbody></table></div>`;
function pipeSVG(o){const cat=PCAT[o.cat],H=90,y0=70,lh=o.h/o.d*H,fs=lh/0.716;let s='';
  s+=`<rect x="0" y="0" width="600" height="230" rx="10" style="fill:var(--surface-2)"/>`;
  s+=`<rect x="20" y="${y0}" width="560" height="${H}" style="fill:var(--wire);stroke:var(--fg);stroke-width:1.4"/><path d="M20 ${y0+12}H580" style="stroke:var(--surface);stroke-width:4;opacity:.5"/>`;
  s+=`<path d="M14 ${y0}q8 ${H/4} 0 ${H/2}t0 ${H/2}M586 ${y0}q-8 ${H/4} 0 ${H/2}t0 ${H/2}" ${S('var(--surface-2)','var(--fg)',1.4)}/>`;
  const x1=110,x2=510,avail=x2-x1-80,txtW=Math.min(avail,o.txt.length*fs*0.6);
  s+=`<rect x="${x1}" y="${y0}" width="${x2-x1}" height="${H}" style="fill:${cat.bg};stroke:var(--fg);stroke-width:1.2"/>`;
  const tx=o.dir>0?x1+12:x1+80,ax=o.dir>0?x2-58:x1+12;
  s+=`<text x="${tx}" y="${(y0+H/2+lh/2).toFixed(1)}" textLength="${txtW.toFixed(1)}" lengthAdjust="spacingAndGlyphs" style="font-family:Arial,sans-serif;font-weight:700;font-size:${fs.toFixed(1)}px;fill:${cat.fg}">${o.txt}</text>`;
  const ay=y0+H/2,ah=Math.min(36,H*0.4);s+=o.dir>0?`<path d="M${ax} ${ay-ah/4}H${ax+30}V${ay-ah/2}L${ax+48} ${ay}L${ax+30} ${ay+ah/2}V${ay+ah/4}H${ax}Z" style="fill:${cat.fg}"/>`:`<path d="M${ax+48} ${ay-ah/4}H${ax+18}V${ay-ah/2}L${ax} ${ay}L${ax+18} ${ay+ah/2}V${ay+ah/4}H${ax+48}Z" style="fill:${cat.fg}"/>`;
  // dimensions
  s+=`<path d="M60 ${y0}V${y0+H}M54 ${y0}H66M54 ${y0+H}H66" ${S('','var(--blue-ink)',1.6)}/>`+lt(60,y0-8,'D = '+o.d+' in',{fs:12,fill:'var(--blue-ink)'});
  const ly=y0+H/2-lh/2;s+=`<path d="M${x1-10} ${ly.toFixed(1)}V${(ly+lh).toFixed(1)}M${x1-15} ${ly.toFixed(1)}H${x1-5}M${x1-15} ${(ly+lh).toFixed(1)}H${x1-5}" ${S('','var(--stop)',1.6)}/>`+lt(x1+120,y0+H+28,'h = '+o.h+' in',{fs:12,fill:'var(--stop)'});
  s+=`<path d="M${x1-10} ${(ly+lh).toFixed(1)}L${x1+80} ${y0+H+22}" ${S('','var(--stop)',1)} stroke-dasharray="3 3"/>`;
  return svg(600,230,s,'لافتة على أنبوب')}
function sightSVG(pos){let s=`<rect x="0" y="0" width="300" height="230" rx="10" style="fill:var(--surface-2)"/>`;
  // man (side view) on the right looking left
  s+=`<circle cx="240" cy="60" r="16" ${S('var(--surface)')}/><path d="M240 76V150M240 150L226 214M240 150L254 214M240 96L220 128M240 96L256 128" ${S('','var(--fg)',3)}/><circle cx="232" cy="57" r="2" style="fill:var(--fg)"/>`;
  const P={up:[60,30],eye:[60,90],down:[60,190]};
  Object.entries(P).forEach(([k,[x,y]])=>{const on=k===pos;s+=`<circle cx="${x}" cy="${y}" r="22" style="fill:var(--wire);stroke:${on?'var(--blue)':'var(--fg)'};stroke-width:${on?3:1.4}"/>`;
    s+=`<path d="M232 58L${x+26} ${y}" style="stroke:${on?'var(--blue)':'var(--muted)'};stroke-width:${on?2:1};stroke-dasharray:4 4"/>`;
    const a=k==='up'?[x+18,y+14,x+4,y+22]:k==='eye'?[x+22,y-8,x+22,y+8]:[x+4,y-22,x+18,y-14];
    s+=`<path d="M${a[0]} ${a[1]}Q${k==='eye'?x+26:x+14} ${y+(k==='up'?22:k==='down'?-22:0)} ${a[2]} ${a[3]}" style="fill:none;stroke:${on?'var(--live)':'var(--fg)'};stroke-width:6"/>`});
  return svg(300,230,s,'مكان اللافتة حسب خط النظر')}
function teeSVG(){let s=`<rect x="0" y="0" width="420" height="220" rx="10" style="fill:var(--surface-2)"/>`;
  s+=`<rect x="20" y="60" width="380" height="30" style="fill:var(--wire);stroke:var(--fg);stroke-width:1.4"/><rect x="195" y="90" width="30" height="120" style="fill:var(--wire);stroke:var(--fg);stroke-width:1.4"/>`;
  const valve=(x,y,v)=>v?`<path d="M${x-14} ${y-10}L${x+14} ${y+10}M${x-14} ${y+10}L${x+14} ${y-10}" style="stroke:var(--fg);stroke-width:0"/><rect x="${x-14}" y="${y-12}" width="28" height="24" style="fill:var(--surface-2);stroke:var(--fg);stroke-width:1.4"/><path d="M${x} ${y-12}V${y-26}" ${S('','var(--fg)',2)}/><circle cx="${x}" cy="${y-30}" r="9" ${S('','var(--fg)',2)}/>`:'';
  s+=valve(160,75,1)+valve(260,75,1)+`<rect x="198" y="118" width="24" height="26" style="fill:var(--surface-2);stroke:var(--fg);stroke-width:1.4"/><path d="M222 131H236" ${S('','var(--fg)',2)}/><circle cx="240" cy="131" r="8" ${S('','var(--fg)',2)}/>`;
  s+=`<rect x="70" y="64" width="60" height="22" style="fill:#fff;stroke:#111"/><text x="100" y="79" text-anchor="middle" style="font:700 10px Arial,sans-serif;fill:#111">LEGEND</text><path d="M60 75H30M36 70L30 75L36 80" ${S('','var(--fg)',1.4)} stroke-dasharray="4 3"/>`;
  s+=`<rect x="290" y="64" width="60" height="22" style="fill:#fff;stroke:#111"/><text x="320" y="79" text-anchor="middle" style="font:700 10px Arial,sans-serif;fill:#111">LEGEND</text><path d="M390 75H360M366 70L360 75L366 80" ${S('','var(--fg)',1.4)} stroke-dasharray="4 3"/>`;
  s+=`<rect x="199" y="150" width="22" height="50" style="fill:#fff;stroke:#111"/><text x="214" y="175" text-anchor="middle" transform="rotate(-90 214 175)" style="font:700 9px Arial,sans-serif;fill:#111">LEGEND</text><path d="M180 160V196M175 190L180 196L185 190" ${S('','var(--fg)',1.4)} stroke-dasharray="4 3"/>`;
  return svg(420,220,s,'تثبيت اللافتات قرب المحابس والتفريعات')}

function colorLab(host){let order=shuffle(COLORS.map(c=>c.k)),i=0,msg='',score=0;const done=new Set();
  const groups=[['red',SC.red,'أحمر'],['fluo',SC.fluo,'برتقالي فلورسنت'],['yellow',SC.yellow,'أصفر'],['orange',SC.orange,'برتقالي'],['green',SC.green,'أخضر'],['blue',SC.blue,'أزرق'],['stripe',STRIPES,'أسود/أبيض/أصفر'],['magenta',SC.magenta,'بنفسجي']];
  host.innerHTML=`<div class="panel c12"><h2>ما لون هذه العلامة؟ <small>جدول ألوان ANSI و OSHA ص 49–50</small></h2><div class="callout" id="cq"></div><div id="cs" style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px"></div><div class="callout" id="cm" style="min-height:2.4em"></div><div class="wrap-in"><button class="btn" id="cn">التالية</button><button class="btn" id="cr">ابدأ من جديد</button></div></div>`;
  const $=s=>host.querySelector(s);
  function draw(){const C=COLORS.find(c=>c.k===order[i]);
    $('#cq').innerHTML=done.size===COLORS.length?`<b>أحسنت!</b> أجبت عن كل الصفوف (${score} من ${COLORS.length} من أول محاولة).`:`<b>المعنى:</b> ${C.m}<br><b>التطبيق:</b> ${C.a}`;
    $('#cs').innerHTML=groups.map(([g,bg,n])=>`<button class="btn" data-cg="${g}" style="display:flex;flex-direction:column;align-items:center;gap:4px;min-width:88px">${swatch(bg,40)}<small>${n}</small></button>`).join('');
    $('#cm').innerHTML=msg}
  let first=true;
  host.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
    if(b.dataset.cg){const C=COLORS.find(c=>c.k===order[i]);if(done.size===COLORS.length)return;
      if(b.dataset.cg===C.g){if(first)score++;done.add(C.k);msg=`<b style="color:var(--on)">صحيح:</b> ${C.c} = ${C.m}.`+(C.k==='r1'||C.k==='r2'?' (للأحمر معنيان في الجدول: خطر، وقف).':'');i=(i+1)%COLORS.length;let guard=0;while(done.has(order[i])&&guard++<20)i=(i+1)%COLORS.length;first=true}
      else{first=false;msg='ليس هذا اللون. فكّر: هل المعنى خطر، أم تحذير، أم أمان، أم معلومات؟'}}
    if(b.id==='cn'){i=(i+1)%COLORS.length;let guard=0;while(done.has(order[i])&&guard++<20)i=(i+1)%COLORS.length;msg='';first=true}
    if(b.id==='cr'){done.clear();score=0;order=shuffle(order);i=0;msg='';first=true}
    draw()});
  draw()}

function pipeLab(host){
  const w={d:4,cat:'liq',txt:'CHILLED WATER RETURN',dir:1,pos:'eye',h:1.25};
  host.innerHTML=`<div class="panel c12"><h2>أداة تعليم الأنبوب <small>مبنية على ص 52–54 وجدول ارتفاع الحروف ص 53</small></h2>
    <p class="sub">اختر قطر الأنبوب ونوع المادة: تظهر ألوان اللافتة وأقل ارتفاع لأطول حروفها. النسبة بين ارتفاع الحروف وقطر الأنبوب مرسومة بمقياس حقيقي.</p>
    <div class="wrap-in" style="align-items:flex-end">
     <label class="sub" style="display:flex;flex-direction:column;gap:2px;min-width:220px;flex:1">قطر الأنبوب: <b id="pdV" class="ltr" style="color:var(--fg)"></b><input type="range" id="pd" min="0.5" max="16" step="0.25" value="${w.d}" style="accent-color:var(--blue);width:100%"></label>
     <div><div class="sub">اتجاه السريان</div>${segHTML('dir',[['1','→'],['-1','←']],'1')}</div></div>
    <div class="wrap-in" style="align-items:flex-start"><div><div class="sub">درجة خطورة المادة</div>${segHTML('cat',Object.entries(PCAT).map(([k,c])=>[k,c.ar]),w.cat,1)}</div></div>
    <div class="wrap-in" style="align-items:flex-end"><div><div class="sub">المحتوى</div><div id="pPre"></div></div><label class="sub" style="display:flex;flex-direction:column;gap:2px">أو اكتب اسماً (بالإنجليزية)<input id="pTxt" maxlength="24" value="${w.txt}" class="ltr" style="font:inherit;padding:4px 8px;border-radius:8px;border:1px solid var(--line);background:var(--surface);color:var(--fg);width:200px"></label></div>
    <div class="svgbox" id="pv"></div><div class="facts" id="pf"></div><div id="pNote"></div></div>
   <div class="panel c5"><h2>أين تُثبت اللافتة؟ <small>ص 54</small></h2>${segHTML('pos',[['up','الأنبوب أعلى من النظر'],['eye','في مستوى النظر'],['down','أسفل من النظر']],w.pos,1)}<div class="svgbox" id="ps" style="max-width:300px;margin-inline:auto"></div><div class="callout" id="psay"></div></div>
   <div class="panel c7"><h2>مهام</h2><ol class="steps" id="pSt"></ol></div>`;
  const $=s=>host.querySelector(s);
  const st=stepsUI($('#pSt'),[
   {t:'حمض في أنبوب صغير',x:'أنبوب قطره 1 بوصة ينقل NITRIC ACID: اختر درجة الخطورة الصحيحة.',done:w=>w.d===1&&w.cat==='high'&&/NITRIC/.test(w.txt)},
   {t:'ماء تبريد',x:'أنبوب قطره 4 بوصات ينقل CHILLED WATER RETURN. ما ارتفاع الحروف؟',done:w=>w.d===4&&w.cat==='liq'},
   {t:'خط إطفاء كبير',x:'أنبوب قطره 12 بوصة لمرشات الحريق (SPRINKLER-FIRE).',done:w=>w.d===12&&w.cat==='fire'},
   {t:'قطر خارج الجدول',x:'اجعل القطر 7 بوصات، واقرأ الملاحظة تحت الرسم.',done:w=>w.d>6&&w.d<8},
   {t:'أنبوب فوق الرأس',x:'اختر «الأنبوب أعلى من النظر» ولاحظ أين توضع اللافتة.',done:w=>w.pos==='up'}
  ],()=>w);
  function draw(){const L=letterH(w.d),cat=PCAT[w.cat];w.h=L.h;$('#pdV').textContent=w.d+' in ≈ '+B.fmtN(B.round(w.d*25.4,0))+' mm';
    $('#pPre').innerHTML=segHTML('pre',PRESET[w.cat].map(t=>[t,t]),w.txt,1);
    $('#pv').innerHTML=pipeSVG({d:w.d,h:L.h,cat:w.cat,txt:(w.txt||' ').toUpperCase(),dir:w.dir});
    $('#pf').innerHTML=`<div class="fact"><span>لون الخلفية</span><b style="font-family:var(--font);font-size:15px">${swatch(cat.bg,18)} ${cat.bgN}</b></div><div class="fact"><span>لون الحروف</span><b style="font-family:var(--font);font-size:15px">${swatch(cat.fg,18)} ${cat.fgN}</b></div><div class="fact"><span>صف الجدول (قطر الأنبوب)</span><b style="font-family:var(--font);font-size:15px">${L.row.replace(/([\d.]+ – [\d.]+|[\d.]+)/,'<span class="ltr">$1</span>')} بوصة</b></div><div class="fact"><span>أقل ارتفاع لأطول الحروف</span><b>${L.h} in</b><span class="ltr">≈ ${B.fmtN(B.round(L.h*25.4,1))} mm</span></div>`;
    $('#pNote').innerHTML=L.gap?`<div class="callout err"><span class="fixnote">القطر <span class="ltr">${w.d}</span> بوصة غير مذكور في جدول ص 53 (الجدول يقفز من <span class="ltr">${L.gap[0]}</span> إلى <span class="ltr">${L.gap[1]}</span> بوصة).</span> ${TIP}أخذنا الصف الأعلى التالي (<span class="ltr">${L.h}</span> بوصة) احتياطاً، لأن الحروف الأكبر أسهل قراءة.</div>`:L.low?`<div class="callout">القطر أصغر من أول صف في الجدول؛ والكتاب يقول: «يجب ألا يقل أطول الحروف على هذه اللافتات عن نصف بوصة».</div>`:'';
    $('#ps').innerHTML=sightSVG(w.pos);
    $('#psay').innerHTML={up:'«يتم وضع اللافتة في الجزء الأسفل من الأنبوب في حالة ضرورة النظر إلى أعلى لرؤية الأنبوب».',eye:'«وتكون مواجهة للشخص إذا كان خط الأنابيب في نفس مستوى النظر».',down:'«وتثبت اللافتات أعلى الأنبوب في حالة ضرورة النظر إلى أسفل لرؤيتها».'}[w.pos];
    st.check()}
  $('#pd').addEventListener('input',e=>{w.d=+e.target.value;draw()});
  $('#pTxt').addEventListener('input',e=>{w.txt=e.target.value.replace(/[^\x20-\x7e]/g,'').toUpperCase();draw()});
  host.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
    if(b.dataset.cat){w.cat=b.dataset.cat;setSeg(host,'cat',w.cat);w.txt=PRESET[w.cat][0];$('#pTxt').value=w.txt}
    if(b.dataset.pre){w.txt=b.dataset.pre;$('#pTxt').value=w.txt}
    if(b.dataset.dir){w.dir=+b.dataset.dir;setSeg(host,'dir',b.dataset.dir)}
    if(b.dataset.pos){w.pos=b.dataset.pos;setSeg(host,'pos',w.pos)}
    draw()});
  draw()}

function pipeEx(o){return {title:o.title,ref:'إضافة من خارج الكتاب — مبني على جدول ص 53',q:o.q,
  given:[{id:'d',label:'قطر الأنبوب',sym:'D',unit:'in',value:o.d,step:'any',min:0.25}],
  solve:(g)=>{const d=g.d;if(!(d>0))return [{t:'اكتب قطراً أكبر من صفر.'}];const L=letterH(d);const cat=PCAT[o.cat];const S_=[];
    S_.push({t:`المادة <b>${cat.ar}</b> ← الخلفية <b>${cat.bgN}</b> والحروف <b>${cat.fgN}</b> (ص 53).`});
    if(L.low)S_.push({t:'القطر أصغر من أول صف في الجدول؛ والكتاب: «يجب ألا يقل أطول الحروف … عن نصف بوصة».'});
    else if(L.gap)S_.push({t:`القطر <span class="ltr">${d}</span> بوصة يقع في فجوة بين صفوف الجدول (<span class="ltr">${L.gap[0]}</span> و<span class="ltr">${L.gap[1]}</span>)؛ <b>توضيح (ليس من الكتاب):</b> نأخذ الصف الأعلى التالي احتياطاً:`,v:L.row.replace('أكثر من 10','> 10'),unit:'in'});
    else S_.push({t:'نبحث عن صف القطر في جدول ص 53:',v:L.row.replace('أكثر من 10','> 10'),unit:'in'});
    S_.push({t:'أقل ارتفاع لأطول الحروف على اللافتة:',v:L.h,unit:'in',dp:2,final:true});
    S_.push({t:'بالمليمتر (توضيح: 1 بوصة = 25.4 مم):',f:`${L.h}\\times 25.4`,v:B.round(L.h*25.4,1),unit:'mm',dp:1});
    return S_},note:o.note}}

B.lesson({
 id:'u3-l6',unit:3,order:6,pages:'49–56',
 title:'ألوان العلامات واللافتات وتعليم الأنابيب',
 summary:'معاني ألوان السلامة، وأنواع العلامات حسب OSHA و ANSI، وكيف نعلّم خطوط الأنابيب بالألوان وارتفاع الحروف ومكان اللافتة، ثم أسئلة الوحدة.',
 stations:[
  {intro:true},

  {st:1,short:'العلامات الإرشادية',title:'3-4 العلامات الإرشادية والتحذيرية (<span class="ltr">Safety Signs &amp; Signals</span>)',ref:'ص 49',
   q:'لماذا زر الطوارئ أحمر دائماً، في كل مصنع تقريباً؟',
   art:(()=>{const {art,tx,card,D,P,C}=U3S;let s='';
    s+=`<g data-tip="الألوان المميزة: توضح وتعرف نوع الخطر، فتساعد العامل على التعرف على درجة الخطورة.">${['#c62828','#ef6c00','#f5c400','#2e7d32','#1565c0'].map((c,i)=>`<rect x="${72+i*44}" y="60" width="40" height="40" rx="8" fill="${c}" stroke="${D}" stroke-width="2"/>`).join('')}</g>`;
    s+=tx(180,124,'ألوان مميزة',{fs:13,w:700});
    s+=`<g data-tip="العلامات الإرشادية المميزة: لوحات تنبه العاملين للخطر الناتج في مكان العمل.">${oshaSign('caution').replace(/^<svg[^>]*>/,'<svg x="150" y="138" width="60" height="78" viewBox="0 0 170 220">')}</g>`+tx(180,232,'علامات مميزة',{fs:13,w:700});
    s+=`<g data-tip="إدارة السلامة والصحة المهنية الأمريكية ⟦OSHA⟧.">${card(40,246,120,40)}${tx(100,272,'OSHA',{fs:15,mono:1,w:700})}</g>`;
    s+=`<g data-tip="المعهد الأمريكي الوطني للمواصفات القياسية ⟦ANSI⟧ ⟦The American National Standards Institute⟧.">${card(200,246,120,40)}${tx(260,272,'ANSI',{fs:15,mono:1,w:700})}</g>`;
    return art('ألوان مميزة وعلامات مميزة، ومصدرا التشريعات OSHA وANSI',C.mint,s)})(),
   cap:'وسيلتا تعريف الخطر، ومصدرا التشريعات في ص 49.<br><b>مرّر المؤشر على الألوان واللافتة والاسمين (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'ما الفائدة التي يذكرها الكتاب للألوان المميزة؟',opts:[
     ['تجميل مكان العمل',false,'غير مذكور.'],
     ['توضح نوع الخطر فتساعد العامل على معرفة درجة الخطورة، فتقل احتمالات الإصابة',true,'نص ص 49.'],
     ['تقلل تكلفة اللافتات',false,'غير مذكور.']]}}
   ],
   body:[
    {book:`<p><b>3-4 العلامات الإرشادية والتحذيرية <span class="ltr">Safety Signs &amp; Signals</span></b></p><p><b>المقدمة:</b> المخاطر في مكان العمل تحتاج إلى تعريفها وتوضيحها لتنبيه العاملين للخطر الناتج عنها ويتم ذلك بواسطة الألوان المميزة والعلامات الإرشادية المميزة.</p>
     <p>وهناك تشريعات عديدة في هذا الشأن منها تشريعات إدارة السلامة والصحة المهنية الأمريكية <span class="ltr">(OSHA)</span> كذلك المعهد الأمريكي الوطني للمواصفات القياسية <span class="ltr">The American National Standards Institute (ANSI)</span>.</p>
     <p>والألوان المميزة توضح وتعرف نوع الخطر وبالتالي تساعد العامل على التعرف على درجة الخطورة ويقود ذلك إلى تقليل احتمالات الإصابة. والجدول التالي يوضح رمز الألوان الإرشادية لكل من <span class="ltr">ANSI</span> و<span class="ltr">OSHA</span>.</p>`,ref:'ص 49'},
    {tip:`<p>اللون يُرى من بعيد وقبل قراءة أي كلمة. لذلك توحّد التشريعات معاني الألوان: العامل الذي تعلّم أن الأحمر «خطر/قف» يفهمه في أي مصنع.</p>`,title:'لماذا اللون؟'},
    {title:'تحقق سريع',widget:(el,B)=>DCML.tf(el,B,{intro:'احكم بحسب ص 49.',items:[
 ['تعريف المخاطر يتم بالألوان المميزة والعلامات الإرشادية المميزة.',true,'نص المقدمة.'],
 ['<span class="ltr">ANSI</span> هو إدارة السلامة والصحة المهنية الأمريكية.',false,'تلك <span class="ltr">OSHA</span>؛ و<span class="ltr">ANSI</span> المعهد الأمريكي الوطني للمواصفات القياسية.']]})}
   ]},

  {st:2,short:'جدول الألوان',title:'جدول الألوان الإرشادية',ref:'ص 49–50',
   q:'برتقالي أم أصفر؟ كلاهما «تحذير»… فما الفرق؟',
   art:(()=>{const {art,tx,D,C}=U3S;let s='';
    COLORS.forEach((r,i)=>{const x=46+(i%3)*96,y=40+Math.floor(i/3)*82,strip=r.g==='stripe';
     const tip=(r.c+': '+r.m+' — '+r.a).replace(/<span class="ltr">(.*?)<\/span>/g,'⟦$1⟧');
     s+=`<g data-tip="${tip}">${strip?`<defs><pattern id="u3st" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="16" fill="#111"/><rect x="8" width="8" height="16" fill="#f5c400"/></pattern></defs>`:''}<rect x="${x}" y="${y}" width="76" height="46" rx="8" fill="${strip?'url(#u3st)':r.sw}" stroke="${D}" stroke-width="2"/>${tx(x+38,y+64,r.m.replace(/<span class="ltr">.*?<\/span>/,'').trim(),{fs:11,w:700})}</g>`});
    return art('تسعة ألوان إرشادية ومعانيها: خطر، قف، مخاطر بيولوجية، تحذير، تنبيه، أمان، معلومات، حدود، إشعاع',C.sand,s)})(),
   cap:'ألوان جدول ص 49–50 ومعانيها؛ المربعات الملونة للتوضيح.<br><b>مرّر المؤشر على أي لون (أو المسه في الجوال) لتقرأ معناه وتطبيقه من الجدول.</b>',
   side:[
    {predict:{q:'زر إيقاف الطوارئ في آلة. ما لونه حسب الجدول؟',opts:[
     ['الأخضر',false,'الأخضر للأمان: أماكن الإسعافات ومعدات السلامة.'],
     ['الأحمر (قف <span class="ltr">STOP</span>)',true,'«الأحمر RED — قف STOP — أزرار الإيقاف في حالات الطوارئ والتعرف على معدات الحريق» (ص 49).'],
     ['الأزرق',false,'الأزرق للمعلومات.']]}}
   ],
   body:[
    {book:colorTable(),ref:'ص 49–50'},
    {watch:`<p>في جدول الألوان: «اللافتات الخاصة بمخلفات المواد <b>المعدنية</b>» والمقصود غالباً المواد <b>المعدية</b> (المخاطر البيولوجية <span class="ltr">Biohazard</span>)، و«مخاطر <b>القفز</b> والسقوط» والمقصود <b>التعثر</b> والسقوط. تركنا نص الجدول كما هو ونبهنا هنا. وعمود المربعات الملونة إضافة للتوضيح.</p>`,fix:true},
    {tip:`<p><b>الأصفر <span class="ltr">CAUTION</span></b> للتحذير من التعثر والسقوط وحاويات المواد المتفجرة والآكلة. <b>البرتقالي <span class="ltr">WARNING</span></b> لأجزاء المعدات الدوارة التي قد تسبب الجروح والسحق.</p>`,title:'الأصفر غير البرتقالي'},
    {title:'مختبر مصغّر: أي لون؟',widget:(el,B)=>DCML.cases(el,B,{intro:'من جدول ص 49–50.',cases:[
 {q:'غطاء بكرة دوارة في آلة قد تسحق الأصابع.',opts:[['البرتقالي (<span class="ltr">WARNING</span>)',true,'«المعدات الدوارة التي قد تسبب الجروح والسحق».'],['الأزرق (معلومات)',false,'الأزرق للافتات ولوح الإعلانات.']]},
 {q:'مكان دش السلامة وأجهزة التنفس.',opts:[['الأحمر',false,'الأحمر للخطر والإيقاف ومعدات الحريق.'],['الأخضر (الأمان <span class="ltr">SAFETY</span>)',true,'«أماكن معدات السلامة: أدشاش السلامة – أجهزة التنفس».']]},
 {q:'مكان فيه أجهزة أشعة سينية.',opts:[['البنفسجي (<span class="ltr">Magenta</span>)',true,'التحذير من الإشعاع.'],['الأصفر وحده',false,'الإشعاع في الجدول له اللون البنفسجي.']]}]})},
    {tip:`<p>لعبة مطابقة كل لون بمعناه تجدها في تبويب «المختبر».</p>`}
   ]},

  {st:3,short:'تقسيم الأوشا',title:'3-4-1 تقسيم الأوشا للعلامات التحذيرية',ref:'ص 50–51',
   q:'ثلاث لافتات: حمراء، صفراء، خضراء… أيها يقول «خطر الآن» وأيها «انتبه» وأيها «نصيحة»؟',
   art:(()=>{const {art,tx,C}=U3S;let s='';
    const put=(k,x,y,w,h,vb,tip)=>`<g data-tip="${tip}">${oshaSign(k).replace(/^<svg[^>]*>/,`<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${vb}">`)}</g>`;
    s+=put('danger',190,46,140,82,'0 0 240 140','أ- علامات الخطر ⟦Danger Signs⟧: خطر وشيك وضرورة إجراءات احترازية؛ الألوان الأحمر والأسود والأبيض (الشكل ⟦3-16⟧ ص 50).');
    s+=put('safety',30,46,140,99,'0 0 240 170','ج- علامات الإرشادات ⟦Safety Instruction Signs⟧: خلفية بيضاء ونافذة خضراء وحروف بيضاء (الشكل ⟦3-18⟧ ص 51).');
    s+=put('caution',135,150,90,116,'0 0 170 220','ب- علامات التحذير ⟦Caution Signs⟧: مخاطر كامنة أو تصرفات غير آمنة؛ خلفية صفراء ونافذة سوداء بحروف صفراء (الشكل ⟦3-17⟧ ص 51).');
    s+=tx(260,146,'خطر',{fs:13,w:700})+tx(100,164,'إرشادات',{fs:13,w:700})+tx(180,286,'تحذير',{fs:13,w:700});
    return art('ثلاث لافتات حسب الأوشا: خطر DANGER، تحذير CAUTION، إرشادات SAFETY FIRST',C.lilac,s)})(),
   cap:'رسم مبسّط عن الأشكال <span class="ltr">(3-16)</span> و<span class="ltr">(3-17)</span> و<span class="ltr">(3-18)</span> ص 50–51.<br><b>مرّر المؤشر على كل لافتة (أو المسها في الجوال) لتعرف نوعها وألوانها.</b>',
   side:[
    {predict:{q:'أي نوع من علامات الأوشا يحذر من «مخاطر كامنة» أو تصرفات غير آمنة؟',opts:[
     ['علامات الخطر',false,'علامات الخطر لخطر وشيك.'],
     ['علامات التحذير <span class="ltr">Caution</span>',true,'«تحذر من مخاطر كامنة Potential Hazards أو من تصرفات غير آمنة» (ص 51).'],
     ['علامات الإرشادات',false,'الإرشادات للنصائح العامة.']]}}
   ],
   body:[
    {book:`<p><b>3-4-1 تقسيم الأوشا للعلامات التحذيرية:</b> يتم تقسيم العلامات التحذيرية والإرشادية في مواصفات الأوشا إلى ثلاثة أنواع: أ- علامات الخطر <span class="ltr">Danger Signs</span>، ب- علامات التحذير <span class="ltr">Caution Signs</span>، ج- علامات الإرشادات <span class="ltr">Safety Instruction Signs</span>.</p>
     <p><b>أ- علامات الخطر <span class="ltr">Danger Signs</span>:</b> توضح وجود خطر وشيك وضرورة اتخاذ إجراءات احترازية. تنص مواصفات الأوشا على استخدام اللون الأحمر، اللون الأسود، اللون الأبيض في هذه اللوحات حسب الشكل <span class="ltr">(3-16)</span>.</p>
     <p><b>ب- علامات التحذير <span class="ltr">Caution Signs</span>:</b></p><ul><li>تحذر من مخاطر كامنة <span class="ltr">Potential Hazards</span> أو من تصرفات غير آمنة.</li><li>اللون الأساسي لهذه العلامات هو اللون الأصفر (خلفية اللوحة) واللون الأسود (النافذة) واللون الأصفر لكتابة الحروف في حالة الكتابة داخل النافذة ذات اللون الأسود، ويتم كتابة الحروف باللون الأسود في الخلفية الصفراء، وحسب الشكل <span class="ltr">(3-17)</span>.</li></ul>
     <p><b>ج- علامات الإرشادات:</b></p><ul><li>يتم استخدامها عندما تكون هناك حاجة للإرشادات العامة والاقتراحات الخاصة بأمور السلامة.</li><li>تحدد الأوشا بأن تكون الخلفية باللون الأبيض، نافذة باللون الأخضر والحروف باللون الأبيض حسب الشكل <span class="ltr">(3-18)</span>.</li></ul>`,ref:'ص 50–51'},
    {watch:`<p>أرقام هذه الأشكال الثلاثة مكررة في الكتاب: <span class="ltr">(3-16)</span> و<span class="ltr">(3-17)</span> و<span class="ltr">(3-18)</span> استُعملت قبلها في ص 43–44 للقفازات والأوفرهول والمريلة؛ لذلك نذكر الصفحة مع الرقم. وفي الكتاب قائمة الأنواع مرقمة «أ، ب، ت» والعناوين «أ، ب، ج».</p>`,fix:true},
    {title:'مختبر مصغّر: أي نوع؟',widget:(el,B)=>DCML.sort(el,B,{intro:'صنّف كل لافتة حسب تقسيم الأوشا.',cats:['خطر','تحذير','إرشادات'],items:[
 ['لافتة بيضاء ونافذتها خضراء: «اصعد السلالم ببطء واستعمل يديك».',2,'خلفية بيضاء ونافذة خضراء وحروف بيضاء = إرشادات (الشكل 3-18).'],
 ['لافتة صفراء بنافذة سوداء: <span class="ltr">CAUTION</span>.',1,'الأصفر مع النافذة السوداء = تحذير.'],
 ['لافتة بيضاء أعلاها بيضاوي أحمر: <span class="ltr">DANGER — EXPLOSIVE</span>.',0,'الأحمر والأسود والأبيض لخطر وشيك.']]})}
   ]},

  {st:4,short:'علامات ANSI',title:'3-4-2 العلامات التحذيرية الخاصة بـ <span class="ltr">ANSI</span>',ref:'ص 51–52',
   q:'الأوشا ثلاثة أنواع… فكم نوعاً عند <span class="ltr">ANSI</span>؟',
   art:(()=>{const {art,nest,tx,C}=U3S;let s='';
    const K=[['danger','أ- خطر ⟦Danger⟧: «EYE PROTECTION REQUIRED BEYOND THIS POINT».'],['warning','ب- تنبيه ⟦Warning⟧: برتقالية؛ «CORROSIVE MATERIAL WEAR PROTECTIVE CLOTHING».'],['caution','ج- تحذير ⟦Caution⟧: صفراء بنافذة سوداء؛ «CARCINOGENS Authorized personnel only».'],['notice','د- ملاحظات ⟦Notice⟧: شريط أزرق؛ «REMOVE GLOVES BEFORE EXITING LABORATORY».'],['general','هـ- إرشادات عامة ⟦General Safety⟧: خضراء؛ رمز غسيل العين.'],['fire','و- معدات الإطفاء ⟦Fire Safety⟧: حمراء؛ ⟦FIRE HOSE⟧ و⟦HOSE REEL⟧.']];
    K.forEach(([k,tip],i)=>{const x=232-(i%3)*100,y=46+Math.floor(i/3)*112,w=k==='general'?70:96,h=k==='general'?70:(k==='fire'?52:62);s+=`<g data-tip="${tip}">${nest(ansiSign(k),x+(96-w)/2,y,w,h)}${tx(x+48,y+92,['خطر','تنبيه','تحذير','ملاحظات','إرشادات عامة','معدات الإطفاء'][i],{fs:12,w:700})}</g>`});
    return art('ست علامات ANSI: خطر، تنبيه، تحذير، ملاحظات، إرشادات عامة، معدات الإطفاء',C.peach,s+tx(180,296,'ستة أنواع عند ANSI',{fs:13.5,w:700}))})(),
   cap:'رسم مبسّط عن لوحة أمثلة <span class="ltr">ANSI</span> ص 52 (بلا رقم شكل).<br><b>مرّر المؤشر على أي علامة (أو المسها في الجوال) لتعرف نوعها ونصها.</b>',
   side:[
    {predict:{q:'أي نوع موجود عند <span class="ltr">ANSI</span> وليس في تقسيم الأوشا؟',opts:[
     ['علامات التنبيه <span class="ltr">Warning</span>',true,'قائمة <span class="ltr">ANSI</span> فيها التنبيه والملاحظات ومعدات الإطفاء، وليست في تقسيم الأوشا الثلاثي.'],
     ['علامات الخطر <span class="ltr">Danger</span>',false,'موجودة في التقسيمين.'],
     ['علامات التحذير <span class="ltr">Caution</span>',false,'موجودة في التقسيمين.']]}}
   ],
   body:[
    {book:`<p><b>3-4-2 العلامات التحذيرية الخاصة بـ <span class="ltr">ANSI</span>:</b></p><div class="tablebox"><table class="tt"><thead><tr><th>النوع</th><th>بالإنجليزية</th></tr></thead><tbody>
     <tr><td>أ- علامات الخطر</td><td><span class="ltr">Danger Signs</span></td></tr><tr><td>ب- علامات التنبيه</td><td><span class="ltr">Warning Signs</span></td></tr><tr><td>ج- علامات التحذير</td><td><span class="ltr">Caution Signs</span></td></tr><tr><td>د- علامات الملاحظات</td><td><span class="ltr">Notice Signs</span></td></tr><tr><td>هـ- علامات الإرشادات العامة</td><td><span class="ltr">General Safety Signs</span></td></tr><tr><td>و- علامات معدات الإطفاء</td><td><span class="ltr">Fire Safety Signs</span></td></tr></tbody></table></div>`,ref:'ص 51–52'},
    {html:`<p><b>أمثلة لعلامات <span class="ltr">ANSI</span></b> (لوحة بلا رقم شكل؛ الكتاب يكتب «أ، ب، ج» تحت الصف الأول فقط) — رسم مبسّط، <span class="ref">ص 52</span>:</p>${ansiPanel()}`},
    {title:'تحقق سريع',widget:(el,B)=>DCML.tf(el,B,{intro:'احكم بحسب ص 51–52.',items:[
 ['علامات <span class="ltr">ANSI</span> ستة أنواع.',true,'من الخطر حتى معدات الإطفاء.'],
 ['<span class="ltr">Notice</span> تعني علامات الملاحظات.',true,'د- علامات الملاحظات <span class="ltr">Notice Signs</span>.'],
 ['<span class="ltr">Warning</span> و<span class="ltr">Caution</span> عند <span class="ltr">ANSI</span> نوع واحد.',false,'نوعان: التنبيه <span class="ltr">Warning</span> والتحذير <span class="ltr">Caution</span>.']]})}
   ]},

  {st:5,short:'التعرف على الأنابيب',title:'3-4-3 التعرف على الأنابيب',ref:'ص 52',
   q:'أنبوبان متشابهان في سقف المصنع: واحد ماء وآخر حمض… كيف تفرق بينهما قبل أن تفتح أي محبس؟',
   art:(()=>{const {art,tx,D,C}=U3S;let s='';
    const R=[[60,'#f5c400','#111','NITRIC ACID','المواد العالية الخطورة ⟦High Hazard Materials⟧: الآكلة والسامة والملتهبة والمتطايرة والمشعة، أو ما يسبب خطورة كبيرة لارتفاع حرارته وضغطه.'],[140,'#2e7d32','#fff','CHILLED WATER','المواد منخفضة الخطورة ⟦Low Hazard Materials⟧: غير خطرة ودرجة خطورتها قليلة جداً.'],[220,'#c62828','#fff','SPRINKLER-FIRE','المواد المستخدمة في إطفاء الحرائق ⟦Fire Suppression Materials⟧: مثل الرغاوي وثاني أكسيد الكربون والهالون والماء.']];
    R.forEach(([y,bg,fg,t,tip])=>{s+=`<g data-tip="${tip}"><rect x="30" y="${y}" width="300" height="44" fill="#a6b5be" stroke="${D}" stroke-width="2"/><rect x="70" y="${y}" width="220" height="44" fill="${bg}" stroke="${D}" stroke-width="1.6"/><text x="160" y="${y+28}" text-anchor="middle" font-size="15" font-weight="700" fill="${fg}" font-family="Arial,sans-serif" direction="ltr">${t}</text><path d="M240 ${y+16}H262V${y+10}L276 ${y+22}L262 ${y+34}V${y+28}H240Z" fill="${fg}"/></g>`});
    s+=tx(180,48,'ثلاثة أقسام حسب درجة الخطورة',{fs:13,w:700})+tx(180,292,'كل لافتة: المحتوى + سهم الاتجاه',{fs:12.5});
    return art('ثلاثة أنابيب: أصفر لمادة عالية الخطورة، وأخضر لمادة منخفضة الخطورة، وأحمر لمواد الإطفاء',C.mint,s)})(),
   cap:'الأقسام الثلاثة في ص 52 (والألوان من ص 53).<br><b>مرّر المؤشر على كل أنبوب (أو المسه في الجوال) لتعرف القسم.</b>',
   side:[
    {predict:{q:'إلى أي قسم ينتمي ثاني أكسيد الكربون في أنابيب الإطفاء؟',opts:[
     ['المواد العالية الخطورة',false,'الكتاب يضعه صراحة في قسم الإطفاء.'],
     ['المواد منخفضة الخطورة',false,'الكتاب يضعه صراحة في قسم الإطفاء.'],
     ['المواد المستخدمة في إطفاء الحرائق',true,'«مثل الرغاوي وثاني أكسيد الكربون والهالون والماء» (ص 52).']]}}
   ],
   body:[
    {book:`<p><b>3-4-3 التعرف على الأنابيب:</b> حسب تشريعات <span class="ltr">ANSI</span> يتم تقسيم المواد داخل خطوط الأنابيب إلى ثلاثة أقسام حسب درجة خطورتها:</p>
     <p><b>1- المواد العالية الخطورة <span class="ltr">High Hazard Materials</span>:</b> مثل المواد الآكلة والمواد السامة، المواد الملتهبة والمتطايرة والمواد المشعة كذلك المواد التي لو تسربت من الأنابيب تتسبب في خطورة كبيرة لارتفاع درجة حرارتها وضغطها.</p>
     <p><b>2- المواد منخفضة الخطورة <span class="ltr">Low Hazard Materials</span>:</b> المواد غير الخطرة ودرجة خطورتها قليلة جداً.</p>
     <p><b>3- المواد المستخدمة في إطفاء الحرائق <span class="ltr">Fire Suppression Materials</span>:</b> مثل الرغاوي وثاني أكسيد الكربون والهالون والماء. يجب وضع علامات على الأنابيب بطريقة ما بحيث توضح محتويات الأنابيب كذلك تبين المخاطر الخاصة بهذه المواد.</p>
     <p>وعلى سبيل المثال اللوحة الخاصة بضغط البخار <span class="ltr">100</span> رطل/بوصة² <span class="ltr">(STEAM 100 PSIG)</span> توضح محتوى الأنبوب (البخار) كذلك درجة الضغط (<span class="ltr">100</span>) كذلك يجب تثبيت سهم يوضح اتجاه المواد داخل الأنابيب.</p>`,ref:'ص 52'},
    {watch:`<p>«المتغيرة» في وصف المواد عالية الخطورة كتبناها «المتطايرة» (وهو المقصود غالباً).</p>`,fix:true},
    {tip:`<p>البخار <span class="ltr">100 PSIG</span> ليس سماً، لكنه في قسم «عالية الخطورة» لأنه لو تسرب يسبب خطورة كبيرة «لارتفاع درجة حرارته وضغطه». القسم يحدده الخطر عند التسرب، لا اسم المادة فقط.</p>`,title:'البخار عالي الخطورة؟'},
    {title:'مختبر مصغّر: صنّف ما في الأنبوب',widget:(el,B)=>DCML.sort(el,B,{intro:'صنّف كل مادة حسب أقسام ص 52.',cats:['عالية الخطورة','منخفضة الخطورة','إطفاء الحرائق'],items:[
 ['حمض النيتريك <span class="ltr">NITRIC ACID</span>',0,'مادة آكلة، وهو مثال الشكل (3-19).'],
 ['بخار بضغط <span class="ltr">100 PSIG</span>',0,'خطورة كبيرة عند التسرب لارتفاع حرارته وضغطه.'],
 ['ماء تبريد راجع <span class="ltr">CHILLED WATER RETURN</span>',1,'مادة غير خطرة (الشكل 3-20).'],
 ['الهالون في شبكة الإطفاء',2,'من أمثلة مواد الإطفاء في الكتاب.']]})}
   ]},

  {st:6,short:'ألوان الأنابيب',title:'ألوان لافتات الأنابيب',ref:'ص 53',
   q:'حروف سوداء على أصفر، أو بيضاء على أخضر… ماذا يقول لك لون اللافتة؟',
   art:(()=>{const {art,tx,D,C}=U3S;let s='';
    Object.entries(PCAT).forEach(([k,c],i)=>{const y=44+i*62;s+=`<g data-tip="${c.ar}: خلفية ${c.bgN} وحروف ${c.fgN}${c.fig?' (الشكل ⟦'+c.fig.replace(/[()]/g,'')+'⟧)':' (لا شكل لها في الكتاب)'}."><rect x="40" y="${y}" width="280" height="42" rx="6" fill="${c.bg}" stroke="${D}" stroke-width="2"/><text x="180" y="${y+28}" text-anchor="middle" font-size="16" font-weight="700" fill="${c.fg}" font-family="Arial,sans-serif" direction="ltr">${PRESET[k][0]}</text></g>`});
    s+=tx(180,300,'لون الخلفية = درجة الخطورة',{fs:13,w:700});
    return art('أربع لافتات أنابيب: أصفر بحروف سوداء، أخضر بحروف بيضاء، أزرق بحروف بيضاء، أحمر بحروف بيضاء',C.sand,s)})(),
   cap:'ألوان ص 53؛ نصوص اللافتات من أمثلة الكتاب.<br><b>مرّر المؤشر على كل لافتة (أو المسها في الجوال) لتعرف فئتها.</b>',
   side:[
    {predict:{q:'لافتة على أنبوب هواء مضغوط (غاز منخفض الخطورة). ما لونها؟',opts:[
     ['حروف سوداء على أصفر',false,'هذا للمواد عالية الخطورة.'],
     ['حروف بيضاء على أخضر',false,'الأخضر للسوائل منخفضة الخطورة.'],
     ['حروف بيضاء على أزرق',true,'«المواد الغازية: يتم استخدام حروف باللون الأبيض على خلفية باللون الأزرق» (ص 53).']]}}
   ],
   body:[
    {book:`<p>وحسب تقسيم المخاطر الثلاث أعلاه لكل منها لون مميز.</p>
     <p><b>المواد عالية الخطورة:</b> يتم استخدام حروف باللون الأسود على خلفية باللون الأصفر (شكل <span class="ltr">3-19</span>).</p>
     <p><b>المواد منخفضة الخطورة تنقسم إلى قسمين:</b> المواد السائلة: يتم استخدام حروف باللون الأبيض والخلفية باللون الأخضر (شكل <span class="ltr">3-20</span>). المواد الغازية: يتم استخدام حروف باللون الأبيض على خلفية باللون الأزرق.</p>
     <p><b>المواد المستخدمة في إطفاء الحرائق:</b> يتم استخدام حروف باللون الأبيض والخلفية باللون الأحمر (شكل <span class="ltr">3-20</span>).</p>`,ref:'ص 53'},
    {html:`<div class="tablebox"><table class="tt"><thead><tr><th>فئة المادة</th><th>لون الخلفية</th><th>لون الحروف</th><th>الشكل</th></tr></thead><tbody>${Object.values(PCAT).map(c=>`<tr><td>${c.ar}</td><td>${swatch(c.bg,18)} ${c.bgN}</td><td>${swatch(c.fg,18)} ${c.fgN}</td><td>${c.fig?`<span class="ltr">${c.fig}</span>`:'—'}</td></tr>`).join('')}</tbody></table></div><p class="sub">جدول ملخص من نص الكتاب (ص 53)؛ المواد الغازية (الأزرق) ليس لها شكل في الكتاب.</p>`},
    {watch:`<p>صححنا «تتقسم» = تنقسم.</p>`,fix:true},
    {title:'مختبر مصغّر: لوّن اللافتة',widget:(el,B)=>DCML.sort(el,B,{intro:'اختر لون خلفية لافتة كل أنبوب (ص 53).',cats:['أصفر','أخضر','أزرق','أحمر'],items:[
 ['<span class="ltr">NITRIC ACID</span>',0,'عالية الخطورة: حروف سوداء على أصفر.'],
 ['<span class="ltr">SPRINKLER-FIRE</span>',3,'مواد الإطفاء: حروف بيضاء على أحمر.'],
 ['<span class="ltr">COMPRESSED AIR</span>',2,'غاز منخفض الخطورة: حروف بيضاء على أزرق.'],
 ['<span class="ltr">CHILLED WATER RETURN</span>',1,'سائل منخفض الخطورة: حروف بيضاء على أخضر.']]})}
   ]},

  {st:7,short:'ارتفاع الحروف',title:'ارتفاع الحروف على لافتات الأنابيب',ref:'ص 53',
   q:'أنبوب ضخم ولافتة بحروف صغيرة… هل تُقرأ من أرض المصنع؟',
   art:(()=>{const {art,tx,D,C}=U3S;let s='';
    HROWS.forEach((r,i)=>{const d=[44,62,92,130,166][i],x=300-i*62,cy=200-d/2;const lab=i===4?'> 10':r[3].replace(/\s/g,'');
     s+=`<g data-tip="قطر الأنبوب ${i===4?'أكثر من ⟦10⟧':'⟦'+r[3]+'⟧'} بوصة ← ارتفاع الحروف ⟦${r[2].toFixed(2).replace(/0$/,'')}⟧ بوصة (جدول ص 53)."><rect x="${x-24}" y="${200-d}" width="48" height="${d}" rx="6" fill="#a6b5be" stroke="${D}" stroke-width="2"/><rect x="${x-24}" y="${cy-d*0.16}" width="48" height="${d*0.32}" fill="${C.yellow}" stroke="${D}" stroke-width="1.2"/><rect x="${x-14}" y="${cy-d*0.09}" width="28" height="${d*0.18}" fill="#111"/>${tx(x,226,lab,{fs:10,mono:1,w:700})}${tx(x,246,String(r[2]),{fs:11,mono:1,w:700,fill:C.coral})}</g>`});
    s+=tx(180,272,'السطر الأعلى: القطر · الأحمر: ارتفاع الحروف (بوصة)',{fs:11.5})+tx(180,56,'كلما كبر القطر كبرت الحروف',{fs:13,w:700});
    return art('خمسة أنابيب يزداد قطرها، وعلى كل منها لافتة يزداد ارتفاع حروفها حسب جدول ص 53',C.lilac,s)})(),
   cap:'صفوف جدول ص 53 (القياسات بالبوصة)؛ الرسم غير مقيس.<br><b>مرّر المؤشر على أي أنبوب (أو المسه في الجوال) لتقرأ صفه في الجدول.</b>',
   side:[
    {predict:{q:'ما أقل ارتفاع لأطول الحروف على لافتة أنبوب حسب الكتاب؟',opts:[
     ['نصف بوصة',true,'«يجب ألا يقل أطول الحروف على هذه اللافتات عن نصف بوصة» (ص 53).'],
     ['بوصة واحدة',false,'البوصة غير مذكورة كحد أدنى.'],
     ['لا يوجد حد',false,'الحد نصف بوصة ويزيد مع القطر.']]}}
   ],
   body:[
    {book:`<p>كما يجب ألا يقل أطول الحروف على هذه اللافتات عن نصف بوصة ويزيد حسب زيادة قطر الأنبوب حسب الجدول التالي:</p>${hTable()}`,ref:'ص 53'},
    {watch:`<p>الجدول لا يغطي كل الأقطار: لا يذكر الأقطار بين <span class="ltr">1.25</span> و<span class="ltr">1.5</span>، ولا بين <span class="ltr">2</span> و<span class="ltr">2.5</span>، ولا بين <span class="ltr">6</span> و<span class="ltr">8</span> بوصة. في المختبر المصغّر وتبويب «المختبر» نأخذ للقطر الواقع في فجوة الصفَّ الأعلى التالي احتياطاً، ونكتب ذلك بجانب الناتج. وفي الكتاب كُتبت الأرقام بفاصلة عربية بعد الرقم («٧٥،» و«٥،») ومعناها <span class="ltr">0.75</span> و<span class="ltr">0.5</span>.</p>`,fix:true},
    {title:'مختبر مصغّر: من القطر إلى ارتفاع الحروف',widget:(el,B)=>DCML.lab(el,B,{intro:'حرّك قطر الأنبوب (رقم تختاره أنت) واقرأ صف الجدول وارتفاع الحروف.',
     predict:{q:'أنبوب قطره <span class="ltr">4</span> بوصات. ما ارتفاع الحروف من الجدول؟',opts:[['<span class="ltr">0.75</span> بوصة',false,'هذا لصف <span class="ltr">1.50 – 2</span>.'],['<span class="ltr">1.25</span> بوصة',true,'القطر <span class="ltr">4</span> يقع في صف <span class="ltr">2.50 – 6</span> ← <span class="ltr">1.25</span> بوصة.'],['<span class="ltr">2.50</span> بوصة',false,'هذا لصف <span class="ltr">8 – 10</span>.']]},
     ins:[{k:'d',l:'قطر الأنبوب',u:'in',min:0.75,max:14,step:0.25,v:4,dp:2}],
     calc:(s,P,B)=>{const r=letterH(s.d);return {facts:[['صف الجدول',r.row+(r.row.indexOf('أ')<0?' in':''),r.gap?'bad':''],['ارتفاع الحروف',r.h+' in','hi']],bars:[{l:'ارتفاع الحروف',v:r.h,max:3.5,txt:r.h+' in'}],
      msg:r.gap?`القطر <span class="ltr">${B.fmtN(s.d)}</span> في فجوة بين صفين (<span class="ltr">${r.gap[0]}</span> و<span class="ltr">${r.gap[1]}</span>) لا يذكرها الكتاب؛ أخذنا الصف الأعلى التالي احتياطاً.`:'القطر يقع في صف من صفوف جدول ص 53.',cls:r.gap?'warn':''}}})},
    {add:`<p>لا يوجد في الكتاب مثال محلول لارتفاع الحروف؛ أضفنا أمثلة في تبويب «الأمثلة المحلولة» من جدول ص 53.</p>`,title:'أمثلة محلولة'}
   ]},

  {st:8,short:'أماكن اللافتات',title:'أماكن تثبيت اللافتات على خطوط الأنابيب',ref:'ص 54',
   q:'أنبوب فوق رأسك: هل تلصق لافتته من أعلاه أم من أسفله؟',
   art:(()=>{const {art,nest,hot,tx,C}=U3S;
    const ex=hot(30,4,60,52,'أنبوب أعلى من النظر: اللافتة في الجزء الأسفل من الأنبوب.')+hot(30,64,60,52,'أنبوب في مستوى النظر: اللافتة مواجهة للشخص.')+hot(30,164,60,52,'أنبوب أسفل النظر: اللافتة أعلى الأنبوب.');
    return art('رجل ينظر إلى ثلاثة أنابيب على ارتفاعات مختلفة، واللافتة في الجهة المواجهة لخط نظره',C.peach,nest(sightSVG(''),30,40,300,230,{extra:ex})+tx(180,296,'اللافتة حيث يقع نظرك',{fs:14,w:700}))})(),
   cap:'رسم مبسّط عن شكل ص 54 (بلا رقم في الكتاب)؛ الخط البرتقالي السميك هو اللافتة.<br><b>مرّر المؤشر على كل أنبوب (أو المسه في الجوال) لتعرف مكان لافتته.</b>',
   side:[
    {predict:{q:'خط أنابيب يمر قرب الأرض وتنظر إليه من أعلى. أين تُثبت اللافتة؟',opts:[
     ['في الجزء الأسفل من الأنبوب',false,'هذا للأنبوب الذي تنظر إليه لأعلى.'],
     ['أعلى الأنبوب',true,'«وتثبت اللافتات أعلى الأنبوب في حالة ضرورة النظر إلى أسفل لرؤيتها» (ص 54).'],
     ['لا تُثبت عليه لافتة',false,'كل الأنابيب تُعلّم.']]}}
   ],
   body:[
    {book:`<p><b>أماكن تثبيت اللافتات على خطوط الأنابيب:</b></p><ul><li>يجب تثبيت اللافتات على خطوط الأنابيب بحيث يمكن قراءتها بسهولة.</li><li>ويتم وضع اللافتة في الجزء الأسفل من الأنبوب في حالة ضرورة النظر إلى أعلى لرؤية الأنبوب.</li><li>وتكون مواجهة للشخص إذا كان خط الأنابيب في نفس مستوى النظر.</li><li>وتثبت اللافتات أعلى الأنبوب في حالة ضرورة النظر إلى أسفل لرؤيتها.</li><li>كذلك يجب تثبيت اللوحات بالقرب من المحابس والتفريعات كذلك عند المداخل والمخارج كما هو موضح في الشكل التالي:</li></ul>`,ref:'ص 54'},
    {html:`<p><b>اللافتات قرب المحابس والتفريعات</b> (شكل بلا رقم في الكتاب) — رسم مبسّط، <span class="ref">ص 54</span>:</p>${box(teeSVG(),460)}`},
    {title:'مختبر مصغّر: أين اللافتة؟',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل أنبوب اختر مكان اللافتة (ص 54).',cats:['أسفل الأنبوب','مواجهة للشخص','أعلى الأنبوب'],items:[
 ['أنبوب في سقف الورشة.',0,'تنظر إليه لأعلى، فاللافتة في الجزء الأسفل.'],
 ['أنبوب على الجدار بمستوى العين.',1,'في نفس مستوى النظر: مواجهة للشخص.'],
 ['أنبوب في خندق على الأرض.',2,'تنظر إليه لأسفل، فاللافتة أعلاه.']]})},
    {tip:`<p>مع المكان، تذكّر: لافتة <b>قرب كل محبس وتفريعة</b>، وعند <b>المداخل والمخارج</b>، ومعها <b>سهم اتجاه</b> المادة.</p>`,title:'لا تنسَ'}
   ]},

  {st:9,short:'أسئلة الوحدة',title:'أسئلة الوحدة الثالثة',ref:'ص 55–56',
   q:'هل تستطيع الإجابة دون الرجوع إلى المحطات؟ جرّب أولاً ثم افتح الإجابة المقترحة.',
   art:(()=>{const {art,nest,tx,C}=U3S;let s='';
    const ks=['helmet','glasses','muffs','shoe','vapor','gloves'];
    ks.forEach((k,i)=>{const a=-Math.PI/2+i*Math.PI/3,x=180+96*Math.cos(a),y=150+96*Math.sin(a);s+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="32" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.2"/>${nest(icon(k,60),(x-24).toFixed(1),(y-24).toFixed(1),48,48)}`});
    s+=`<g data-tip="أسئلة الوحدة: ثمانية أسئلة مقالية واثنتا عشرة عبارة صح أو خطأ (ص 55–56)."><circle cx="180" cy="150" r="40" fill="#F2C14E" stroke="#2C4A40" stroke-width="3"/>${tx(180,166,'؟',{fs:44,w:700})}</g>`;
    return art('علامة استفهام تحيط بها أيقونات مهمات الوقاية',C.mint,s+tx(180,290,'راجع الوحدة كلها',{fs:14,w:700}))})(),
   cap:'مراجعة الوحدة الثالثة.<br><b>مرّر المؤشر على علامة الاستفهام (أو المسها في الجوال) لتعرف عدد الأسئلة.</b>',
   side:[
    {predict:{q:'العبارة: «يستخدم حزام الباراشوت عند العمل في الأماكن المغلقة». صح أم خطأ؟',opts:[
     ['صح',false,'الباراشوت للأماكن المرتفعة.'],
     ['خطأ',true,'الأماكن المغلقة والخزانات: «حزام سلامة خاص Safety Harness وحبل إنقاذ» (ص 42).']]}}
   ],
   body:[
    {book:[
     ['السؤال الأول – اذكر أربعة من معدات الوقاية الشخصية مع ذكر الهدف من استخدامها؟','الخوذة: حماية الرأس من الأجسام الساقطة والاصطدام والكهرباء (ص 27–28). النظارات الواقية وحامي الوجه: وقاية العين والوجه من المخاطر الكيميائية والميكانيكية (ص 29). أغطية الأذن والسدادات: تقليل شدة الضوضاء حتى لا يفقد العامل حساسية السمع (ص 31–32). حذاء السلامة: حماية القدم من الأشياء الساقطة والاختراق والانزلاق (ص 36). وكذلك أجهزة التنفس والقفازات والحزام الواقي.'],
     ['السؤال الثاني – ما الأعمال التي تتطلب استخدام واقيات العين؟','أعمال الجلخ والتقطيع، وتداول المواد الكيميائية، وعمليات الأفران، والأعمال التي ينشأ عنها غبار، وأعمال اللحام (ص 29)، ومنها أيضاً القطع واللحام بالأسيتيلين وأعمال المعامل (جدول ص 30).'],
     ['السؤال الثالث – ما الحد المسموح به للتعرض للضوضاء لعدة ساعات حسب مواصفات الأوشا؟','<span class="ltr">90</span> ديسيبل لمدة 8 ساعات في اليوم، خمسة أيام في الأسبوع، و<span class="ltr">85</span> ديسيبل هو حد البدء بخطوات حماية السمع (ص 34). ولكل مستوى أعلى مدة أقصر في جدول ص 34: <span class="ltr">92 dB</span> ← 6 ساعات، <span class="ltr">95</span> ← 4، <span class="ltr">97</span> ← 3، <span class="ltr">100</span> ← 2، <span class="ltr">102</span> ← 1½، <span class="ltr">105</span> ← 1، <span class="ltr">107</span> ← ¾، <span class="ltr">110</span> ← ½، <span class="ltr">115</span> ← ¼ ساعة.'],
     ['السؤال الرابع – اذكر أنواع أحذية السلامة، ونوع الحماية المستخدمة له؟','جلدية بمقدمة فولاذية وقطعة فولاذ في النعل: للأشياء الساقطة والاختراق وتمنع الانزلاق. مطاطية طويلة: للأماكن المبتلة ولرجال الإطفاء. مطاطية للعاملين في الكهرباء: ضد الصعق. مطاطية لا تسبب الكهربائية الساكنة <span class="ltr">Antistatic</span>: للأماكن التي بها مواد قابلة للاشتعال (ص 36).'],
     ['السؤال الخامس – اذكر أنواع أجهزة التنفس؟','قسمان: (1) المزودة للهواء مثل <span class="ltr">SCBA</span> وجهاز الضاغطة بخراطيم طويلة، (2) المنقية للهواء وأنواعها خمسة: للأبخرة والغازات، ولاصطياد الأتربة، وللأبخرة والغازات والأتربة، وللغازات السامة، والمنقية بمروحة (ص 37–38).'],
     ['السؤال السادس – اذكر الحالات التي ينصح بترك المكان فيها عند استخدام أجهزة التنفس المنقية للهواء؟','الشعور بصعوبة التنفس، وشم رائحة أو طعم المواد الموجودة بالمكان، والشعور بالدوار، وحدوث تلف بالجهاز (ص 38).'],
     ['السؤال السابع – اذكر طريقة اختيار جهاز التنفس المناسب؟','قياس الأوكسجين (أقل من <span class="ltr">19.5%</span> ← SCBA)، ثم تحديد نوع المادة، ثم قياس التركيز (أقل من <span class="ltr">TLV</span> ← بدون جهاز؛ بين <span class="ltr">TLV</span> و<span class="ltr">IDLH</span> ← جهاز منقٍّ وفلتر مناسب)، ثم: إذا لم تسبب حساسية للعين ← نصف وجه، وإذا سببت ← وجه كامل (ص 39–40).'],
     ['السؤال الثامن – اشرح عملية فحص الضغط السالب لجهاز التنفس المنقي للهواء؟','قبل دخول المكان الملوث يغلق العامل فتحتي دخول الهواء في الفلتر براحتي يديه، ويتنفس حتى ينبعج القناع، ثم يوقف التنفس 10 ثوانٍ؛ إذا بقي القناع منبعجاً فهو مربوط جيداً (ص 40).']
    ].map(([q,a])=>`<details style="padding:8px 0;border-bottom:1px solid var(--line)"><summary style="cursor:pointer;font-weight:600">${q}</summary><p style="margin-top:8px"><b>إجابة مقترحة (ليست من الكتاب):</b> ${a}</p></details>`).join(''),ref:'ص 55'},
    {title:'ضع علامة (✓) أو (×) — عبارات الكتاب، والحكم «إجابة مقترحة (ليست من الكتاب)»',widget:(el,B)=>DCML.tf(el,B,{intro:'عبارات ص 55–56 كما وردت (مع تصحيح الأخطاء الطباعية). اضغط حكمك، ثم اقرأ الإجابة المقترحة (ليست من الكتاب).',items:[
 ['1) يجب تحديد نوع الخطر في أماكن العمل أولاً ثم تحديد معدات الوقاية المطلوبة.',true,'الإرشادات العامة (ص 27).'],
 ['2) يجب استخدام معدات الوقاية المعتمدة دولياً.',false,'النص يقول: «المعتمدة من السلطات المحلية وتكون متوافقة مع <span class="ltr">ANSI</span>» (ص 27)، فالعبارة بصيغتها هذه لا تطابق النص. وقد يقبلها بعض المدربين صحيحة بمعنى «معتمدة».'],
 ['3) لاستخدام أجهزة التنفس لا بد من عمل فحص طبي لمرة واحدة فقط ويعتبر كافياً.',false,'الفحص يتكرر سنوياً (ص 27).'],
 ['4) خوذة الرأس من الدرجة ب مصممة للأعمال الخفيفة.',false,'الدرجة ب للأعمال الشاقة، والدرجة أ للخفيفة (ص 29).'],
 ['5) تستخدم واقيات الأذن في الأماكن التي تزيد الضوضاء فيها عن <span class="ltr">85</span> ديسيبل.',true,'(ص 31).'],
 ['6) أغطية الأذن تقلل نسبة الضوضاء في حدود <span class="ltr">15–35</span> ديسيبل.',true,'(ص 32).'],
 ['7) تعتبر إصابات القدم أكثر الإصابات شيوعاً.',true,'«من أكثر الإصابات التي يتعرض لها العاملون في الأماكن الصناعية هي إصابات القدم» (ص 36).'],
 ['8) كمية الهواء الموجودة في أجهزة التنفس الذاتية تكفي للاستخدام لمدة ساعة ونصف.',false,'تكفي «ساعة أو نصف ساعة» حسب حجم الأسطوانة (ص 37).'],
 ['9) أجهزة التنفس المنقية للهواء لا تستطيع إمداد العاملين بالهواء اللازم لعملية التنفس.',true,'(ص 38).'],
 ['10) يستخدم حزام الباراشوت عند العمل في الأماكن المغلقة.',false,'الباراشوت للأماكن المرتفعة، أما الأماكن المغلقة والخزانات فـ «حزام سلامة خاص <span class="ltr">Safety Harness</span> وحبل إنقاذ» (ص 42).'],
 ['11) تستخدم القفازات الواقية المصنوعة من المطاط أو البلاستيك لحماية الأيدي في أعمال الكهرباء.',false,'تستعمل أثناء مناولة المواد الكيميائية كالأحماض والقلويات (ص 43).'],
 ['12) اللون الأحمر في العلامات الإرشادية يدل على التحذير.',false,'الأحمر = خطر <span class="ltr">DANGER</span> أو قف <span class="ltr">STOP</span>؛ التحذير <span class="ltr">CAUTION</span> أصفر، و<span class="ltr">WARNING</span> برتقالي (ص 49).']]})},
    {watch:`<p>في أسئلة ص 55–56 صححنا: «أإطية» = أغطية (العبارة 6)، و«البارشوات» = الباراشوت (العبارة 10). والعبارة 8 تقول «ساعة ونصف» والمتن «ساعة أو نصف ساعة». والعبارة 2 تقول «المعتمدة دولياً» والمتن «المعتمدة من السلطات المحلية ومتوافقة مع <span class="ltr">ANSI</span>». ولا توجد في هذه الوحدة أسئلة إكمال.</p>`,fix:true}
   ]},

  {recap:[
   'المخاطر تُعرَّف بالألوان والعلامات المميزة حسب <span class="ltr">OSHA</span> و<span class="ltr">ANSI</span>: الأحمر خطر/قف، الأصفر تحذير، البرتقالي تنبيه، الأخضر أمان، الأزرق معلومات، البنفسجي إشعاع.',
   'الأوشا: خطر (أحمر/أسود/أبيض)، تحذير (أصفر ونافذة سوداء)، إرشادات (أبيض ونافذة خضراء)؛ و<span class="ltr">ANSI</span> ستة أنواع.',
   'الأنابيب: عالية الخطورة أسود على أصفر، سائل منخفض الخطورة أبيض على أخضر، غاز أبيض على أزرق، الإطفاء أبيض على أحمر، مع المحتوى وسهم الاتجاه.',
   'أطول الحروف لا يقل عن نصف بوصة ويكبر مع القطر (جدول ص 53)، واللافتة حيث يقع النظر وقرب المحابس والتفريعات والمداخل والمخارج.']}
],
 theory:[
  {h:'3-4 العلامات الإرشادية والتحذيرية (<span class="ltr">Safety Signs &amp; Signals</span>)',ref:'ص 49',html:`<p><b>المقدمة:</b> المخاطر في مكان العمل تحتاج إلى تعريفها وتوضيحها لتنبيه العاملين للخطر الناتج عنها، ويتم ذلك بواسطة <b>الألوان المميزة</b> و<b>العلامات الإرشادية المميزة</b>.</p>
   <p>وهناك تشريعات عديدة في هذا الشأن منها تشريعات إدارة السلامة والصحة المهنية الأمريكية <span class="ltr">(OSHA)</span>، كذلك المعهد الأمريكي الوطني للمواصفات القياسية <span class="ltr">The American National Standards Institute (ANSI)</span>.</p>
   <p>والألوان المميزة توضح وتعرف نوع الخطر، وبالتالي تساعد العامل على التعرف على درجة الخطورة، ويقود ذلك إلى تقليل احتمالات الإصابة. والجدول التالي يوضح رمز الألوان الإرشادية لكل من <span class="ltr">ANSI</span> و<span class="ltr">OSHA</span>:</p>`},
  {h:'جدول الألوان',ref:'ص 49–50',html:colorTable()+'<p class="sub">عمود المربعات الملونة إضافة للتوضيح.</p>'},
  {err:`في جدول الألوان: «اللافتات الخاصة بمخلفات المواد <b>المعدنية</b>» والمقصود غالباً المواد <b>المعدية</b> (المخاطر البيولوجية <span class="ltr">Biohazard</span>)، و«مخاطر <b>القفز</b> والسقوط» والمقصود <b>التعثر</b> والسقوط. تركنا نص الجدول كما هو ونبهنا هنا.`},
  {h:'3-4-1 تقسيم الأوشا للعلامات التحذيرية',ref:'ص 50–51',html:`<p>يتم تقسيم العلامات التحذيرية والإرشادية في مواصفات الأوشا إلى ثلاثة أنواع: <b>أ- علامات الخطر</b> <span class="ltr">Danger Signs</span>، <b>ب- علامات التحذير</b> <span class="ltr">Caution Signs</span>، <b>ج- علامات الإرشادات</b> <span class="ltr">Safety Instruction Signs</span>.</p>
   <ul><li><b>أ- علامات الخطر:</b> توضح وجود <b>خطر وشيك</b> وضرورة اتخاذ إجراءات احترازية. تنص مواصفات الأوشا على استخدام اللون <b>الأحمر</b> واللون <b>الأسود</b> واللون <b>الأبيض</b> في هذه اللوحات (الشكل <span class="ltr">3-16</span> ص 50).</li>
   <li><b>ب- علامات التحذير:</b> تحذر من <b>مخاطر كامنة</b> <span class="ltr">Potential Hazards</span> أو من تصرفات غير آمنة. اللون الأساسي لهذه العلامات هو اللون <b>الأصفر</b> (خلفية اللوحة) واللون <b>الأسود</b> (النافذة)، واللون الأصفر لكتابة الحروف في حالة الكتابة داخل النافذة ذات اللون الأسود، ويتم كتابة الحروف باللون الأسود في الخلفية الصفراء (الشكل <span class="ltr">3-17</span> ص 51).</li>
   <li><b>ج- علامات الإرشادات:</b> يتم استخدامها عندما تكون هناك حاجة للإرشادات العامة والاقتراحات الخاصة بأمور السلامة. وتحدد الأوشا بأن تكون <b>الخلفية باللون الأبيض</b>، و<b>نافذة باللون الأخضر</b>، و<b>الحروف باللون الأبيض</b> (الشكل <span class="ltr">3-18</span> ص 51).</li></ul>`},
  {fig:'(3-16) و(3-17) و(3-18) — ص 50–51',ref:'ص 50–51',caption:'لافتة خطر <span class="ltr">DANGER</span> (أحمر وأسود وأبيض)، ولافتة تحذير <span class="ltr">CAUTION</span> (أصفر ونافذة سوداء)، ولافتة إرشادات <span class="ltr">SAFETY FIRST</span> (أبيض ونافذة خضراء). رسم توضيحي مبسّط.',draw:()=>`<div style="display:flex;flex-wrap:wrap;gap:16px;justify-content:center;align-items:center">${oshaSign('danger')}${oshaSign('caution')}${oshaSign('safety')}</div>`},
  {err:`أرقام هذه الأشكال الثلاثة مكررة في الكتاب: الأرقام <span class="ltr">(3-16)</span> و<span class="ltr">(3-17)</span> و<span class="ltr">(3-18)</span> استُعملت قبلها في ص 43–44 للقفازات المقاومة للحرارة والأوفرهول والمريلة (الدرس 3.4)؛ لذلك نذكر الصفحة مع الرقم. وفي الكتاب قائمة الأنواع مرقمة «أ، ب، ت» والعناوين «أ، ب، ج».`},
  {h:'3-4-2 العلامات التحذيرية الخاصة بـ ANSI',ref:'ص 51–52',html:`<p>أ- علامات الخطر <span class="ltr">Danger Signs</span>، ب- علامات التنبيه <span class="ltr">Warning Signs</span>، ج- علامات التحذير <span class="ltr">Caution Signs</span>، د- علامات الملاحظات <span class="ltr">Notice Signs</span>، هـ- علامات الإرشادات العامة <span class="ltr">General Safety Signs</span>، و- علامات معدات الإطفاء <span class="ltr">Fire Safety Signs</span>.</p>`},
  {fig:'',ref:'ص 52',caption:'أمثلة لعلامات <span class="ltr">ANSI</span> (لوحة بلا رقم شكل في الكتاب؛ الكتاب يكتب «أ، ب، ج» تحت الصف الأول فقط، والتسميات تحت الصف الثاني من عندنا). رسم توضيحي مبسّط.',draw:()=>ansiPanel()},
  {h:'3-4-3 التعرف على الأنابيب',ref:'ص 52',html:`<p>حسب تشريعات <span class="ltr">ANSI</span> يتم تقسيم المواد داخل خطوط الأنابيب إلى ثلاثة أقسام حسب درجة خطورتها:</p>
   <ol><li><b>المواد العالية الخطورة</b> <span class="ltr">High Hazard Materials</span>: مثل المواد الآكلة والمواد السامة، والمواد الملتهبة والمتطايرة والمواد المشعة، كذلك المواد التي لو تسربت من الأنابيب تتسبب في خطورة كبيرة لارتفاع درجة حرارتها وضغطها.</li>
   <li><b>المواد منخفضة الخطورة</b> <span class="ltr">Low Hazard Materials</span>: المواد غير الخطرة ودرجة خطورتها قليلة جداً.</li>
   <li><b>المواد المستخدمة في إطفاء الحرائق</b> <span class="ltr">Fire Suppression Materials</span>: مثل الرغاوي وثاني أكسيد الكربون والهالون والماء.</li></ol>
   <p>يجب وضع علامات على الأنابيب بطريقة ما بحيث توضح <b>محتويات الأنابيب</b> كذلك تبين <b>المخاطر</b> الخاصة بهذه المواد. وعلى سبيل المثال اللوحة الخاصة بضغط البخار <span class="ltr">100</span> رطل/بوصة² <span class="ltr">(STEAM 100 PSIG)</span> توضح محتوى الأنبوب (البخار) كذلك درجة الضغط (<span class="ltr">100</span>)، كذلك يجب تثبيت <b>سهم يوضح اتجاه المواد</b> داخل الأنابيب.</p>`},
  {h:'ألوان لافتات الأنابيب',ref:'ص 53',html:`<p>وحسب تقسيم المخاطر الثلاث أعلاه لكل منها لون مميز:</p><ul><li><b>المواد عالية الخطورة:</b> حروف باللون <b>الأسود</b> على خلفية باللون <b>الأصفر</b> (شكل <span class="ltr">3-19</span>).</li><li><b>المواد منخفضة الخطورة تنقسم إلى قسمين:</b> المواد <b>السائلة</b>: حروف باللون الأبيض والخلفية باللون <b>الأخضر</b> (شكل <span class="ltr">3-20</span>)؛ المواد <b>الغازية</b>: حروف باللون الأبيض على خلفية باللون <b>الأزرق</b>.</li><li><b>المواد المستخدمة في إطفاء الحرائق:</b> حروف باللون الأبيض والخلفية باللون <b>الأحمر</b> (شكل <span class="ltr">3-20</span>).</li></ul>
   <div class="tablebox"><table class="tt"><thead><tr><th>فئة المادة</th><th>لون الخلفية</th><th>لون الحروف</th><th>الشكل</th></tr></thead><tbody>${Object.values(PCAT).map(c=>`<tr><td>${c.ar}</td><td>${swatch(c.bg,18)} ${c.bgN}</td><td>${swatch(c.fg,18)} ${c.fgN}</td><td>${c.fig?`<span class="ltr">${c.fig}</span>`:'—'}</td></tr>`).join('')}</tbody></table></div><p class="sub">جدول ملخص من نص الكتاب.</p>`},
  {fig:'(3-19)',ref:'ص 53',caption:'أنبوب أصفر لمادة عالية الخطورة <span class="ltr">NITRIC ACID</span> بحروف سوداء ورمز التآكل وأسهم الاتجاه، وعليه محبس <span class="ltr">(valve)</span>. رسم توضيحي مبسّط.',draw:()=>box(svg(600,120,`<rect x="10" y="40" width="580" height="40" style="fill:${SC.yellow};stroke:#111;stroke-width:1.4"/><text x="30" y="68" style="font:700 18px Arial,sans-serif;fill:#111">NITRIC ACID</text><circle cx="180" cy="60" r="15" style="fill:#fff;stroke:#111;stroke-width:2"/><path d="M172 52l6 8M188 52l-6 8M172 66h16" style="stroke:#111;stroke-width:2"/><path d="M210 52H250V44L268 60L250 76V68H210Z" style="fill:#111"/><path d="M380 44L420 60L380 76ZM460 44L420 60L460 76Z" style="fill:${SC.yellow};stroke:#111;stroke-width:2"/><path d="M420 60V28H440" style="stroke:#111;stroke-width:2;fill:none"/><text x="446" y="32" style="font:italic 12px Arial,sans-serif;fill:var(--fg)">valve</text><path d="M490 52H530V44L548 60L530 76V68H490Z" style="fill:#111"/>`,'أنبوب مادة عالية الخطورة'),620)},
  {fig:'(3-20)',ref:'ص 53',caption:'ملصق أخضر بحروف بيضاء <span class="ltr">CHILLED WATER RETURN</span> (سائل منخفض الخطورة)، وملصق أحمر بحروف بيضاء <span class="ltr">SPRINKLER-FIRE</span> (مواد إطفاء). رسم توضيحي مبسّط للصورة.',draw:()=>box(svg(600,140,`<rect x="10" y="14" width="580" height="44" style="fill:#eee;stroke:var(--fg)"/><rect x="120" y="14" width="440" height="44" style="fill:${SC.green}"/><text x="140" y="45" style="font:700 22px Arial,sans-serif;fill:#fff">CHILLED WATER RETURN</text>${[0,1,2].map(i=>`<path d="M40 ${22+i*11}h30l8 4l-8 4h-30z" style="fill:${SC.green}"/>`).join('')}<rect x="10" y="78" width="580" height="44" style="fill:#eee;stroke:var(--fg)"/><rect x="120" y="78" width="440" height="44" style="fill:${SC.red}"/><text x="140" y="109" style="font:700 22px Arial,sans-serif;fill:#fff">SPRINKLER-FIRE</text>${[0,1,2].map(i=>`<path d="M40 ${86+i*11}h30l8 4l-8 4h-30z" style="fill:${SC.red}"/>`).join('')}`,'ملصقا أنبوبين'),620)},
  {h:'ارتفاع الحروف على لافتات الأنابيب',ref:'ص 53',html:`<p>كما يجب <b>ألا يقل أطول الحروف</b> على هذه اللافتات <b>عن نصف بوصة</b>، ويزيد حسب زيادة قطر الأنبوب حسب الجدول التالي:</p>${hTable()}`},
  {err:`الجدول لا يغطي كل الأقطار: لا يذكر الأقطار بين <span class="ltr">1.25</span> و<span class="ltr">1.5</span>، ولا بين <span class="ltr">2</span> و<span class="ltr">2.5</span>، ولا بين <span class="ltr">6</span> و<span class="ltr">8</span> بوصة. في أداة المختبر والأمثلة نأخذ للقطر الواقع في فجوة الصفَّ الأعلى التالي احتياطاً، ونكتب ذلك بجانب الناتج. وفي الكتاب كُتبت الأرقام بفاصلة عربية بعد الرقم («٧٥،» و«٥،») ومعناها <span class="ltr">0.75</span> و<span class="ltr">0.5</span>.`},
  {h:'أماكن تثبيت اللافتات على خطوط الأنابيب',ref:'ص 54',html:`<ul><li>يجب تثبيت اللافتات على خطوط الأنابيب بحيث يمكن <b>قراءتها بسهولة</b>.</li><li>ويتم وضع اللافتة في <b>الجزء الأسفل</b> من الأنبوب في حالة ضرورة النظر إلى أعلى لرؤية الأنبوب.</li><li>وتكون <b>مواجهة للشخص</b> إذا كان خط الأنابيب في نفس مستوى النظر.</li><li>وتثبت اللافتات <b>أعلى الأنبوب</b> في حالة ضرورة النظر إلى أسفل لرؤيتها.</li></ul>`},
  {fig:'',ref:'ص 54',caption:'مكان اللافتة على الأنبوب حسب خط النظر (شكل بلا رقم في الكتاب). رسم توضيحي مبسّط.',draw:()=>box(sightSVG(''),320)},
  {html:`<ul><li>كذلك يجب تثبيت اللوحات <b>بالقرب من المحابس والتفريعات</b>، كذلك <b>عند المداخل والمخارج</b>، كما هو موضح في الشكل التالي:</li></ul>`},
  {fig:'',ref:'ص 54',caption:'لافتات <span class="ltr">LEGEND</span> على كل فرع قرب المحابس عند تفريعة على شكل T، مع أسهم الاتجاه (شكل بلا رقم في الكتاب). رسم توضيحي مبسّط.',draw:()=>box(teeSVG(),460)},
  {err:`صححنا في النص: «تتقسم» = تنقسم، و«المتغيرة» في وصف المواد عالية الخطورة كتبناها «المتطايرة» (وهو المقصود غالباً). والمواد الغازية منخفضة الخطورة (الأزرق) ليس لها شكل في الكتاب، والشكلان في ص 54 بلا رقم.`},
  {h:'أسئلة الوحدة الثالثة',ref:'ص 55–56',html:`<p class="sub">أسئلة الكتاب كما وردت، وتحت كل سؤال «إجابة مقترحة (ليست من الكتاب)» مكتوبة من نص الوحدة؛ اضغط على السؤال لإظهارها.</p>
   ${[
    ['السؤال الأول – اذكر أربعة من معدات الوقاية الشخصية مع ذكر الهدف من استخدامها؟','الخوذة: حماية الرأس من الأجسام الساقطة والاصطدام والكهرباء (ص 27–28). النظارات الواقية وحامي الوجه: وقاية العين والوجه من المخاطر الكيميائية والميكانيكية (ص 29). أغطية الأذن والسدادات: تقليل شدة الضوضاء حتى لا يفقد العامل حساسية السمع (ص 31–32). حذاء السلامة: حماية القدم من الأشياء الساقطة والاختراق والانزلاق (ص 36). وكذلك أجهزة التنفس والقفازات والحزام الواقي.'],
    ['السؤال الثاني – ما الأعمال التي تتطلب استخدام واقيات العين؟','أعمال الجلخ والتقطيع، وتداول المواد الكيميائية، وعمليات الأفران، والأعمال التي ينشأ عنها غبار، وأعمال اللحام (ص 29)، ومنها أيضاً القطع واللحام بالأسيتيلين وأعمال المعامل (جدول ص 30).'],
    ['السؤال الثالث – ما الحد المسموح به للتعرض للضوضاء لعدة ساعات حسب مواصفات الأوشا؟','<span class="ltr">90</span> ديسيبل لمدة 8 ساعات في اليوم، خمسة أيام في الأسبوع، و<span class="ltr">85</span> ديسيبل هو حد البدء بخطوات حماية السمع (ص 34). ولكل مستوى أعلى مدة أقصر في جدول ص 34: <span class="ltr">92 dB</span> ← 6 ساعات، <span class="ltr">95</span> ← 4، <span class="ltr">97</span> ← 3، <span class="ltr">100</span> ← 2، <span class="ltr">102</span> ← 1½، <span class="ltr">105</span> ← 1، <span class="ltr">107</span> ← ¾، <span class="ltr">110</span> ← ½، <span class="ltr">115</span> ← ¼ ساعة.'],
    ['السؤال الرابع – اذكر أنواع أحذية السلامة، ونوع الحماية المستخدمة له؟','جلدية بمقدمة فولاذية وقطعة فولاذ في النعل: للأشياء الساقطة والاختراق وتمنع الانزلاق. مطاطية طويلة: للأماكن المبتلة ولرجال الإطفاء. مطاطية للعاملين في الكهرباء: ضد الصعق. مطاطية لا تسبب الكهربائية الساكنة <span class="ltr">Antistatic</span>: للأماكن التي بها مواد قابلة للاشتعال (ص 36).'],
    ['السؤال الخامس – اذكر أنواع أجهزة التنفس؟','قسمان: (1) المزودة للهواء مثل <span class="ltr">SCBA</span> وجهاز الضاغطة بخراطيم طويلة، (2) المنقية للهواء وأنواعها خمسة: للأبخرة والغازات، ولاصطياد الأتربة، وللأبخرة والغازات والأتربة، وللغازات السامة، والمنقية بمروحة (ص 37–38).'],
    ['السؤال السادس – اذكر الحالات التي ينصح بترك المكان فيها عند استخدام أجهزة التنفس المنقية للهواء؟','الشعور بصعوبة التنفس، وشم رائحة أو طعم المواد الموجودة بالمكان، والشعور بالدوار، وحدوث تلف بالجهاز (ص 38).'],
    ['السؤال السابع – اذكر طريقة اختيار جهاز التنفس المناسب؟','قياس الأوكسجين (أقل من <span class="ltr">19.5%</span> ← SCBA)، ثم تحديد نوع المادة، ثم قياس التركيز (أقل من <span class="ltr">TLV</span> ← بدون جهاز؛ بين <span class="ltr">TLV</span> و<span class="ltr">IDLH</span> ← جهاز منقٍّ وفلتر مناسب)، ثم: إذا لم تسبب حساسية للعين ← نصف وجه، وإذا سببت ← وجه كامل (ص 39–40).'],
    ['السؤال الثامن – اشرح عملية فحص الضغط السالب لجهاز التنفس المنقي للهواء؟','قبل دخول المكان الملوث يغلق العامل فتحتي دخول الهواء في الفلتر براحتي يديه، ويتنفس حتى ينبعج القناع، ثم يوقف التنفس 10 ثوانٍ؛ إذا بقي القناع منبعجاً فهو مربوط جيداً (ص 40).']
   ].map(([q,a])=>`<details class="fig" style="padding:10px 12px"><summary style="cursor:pointer;font-weight:600">${q}</summary><p style="margin-top:8px"><b>إجابة مقترحة (ليست من الكتاب):</b> ${a}</p></details>`).join('')}
   <h3 class="sm" style="margin-top:14px">ضع علامة (✓) أو (×)</h3>
   ${[
    ['1) يجب تحديد نوع الخطر في أماكن العمل أولاً ثم تحديد معدات الوقاية المطلوبة.','✓','الإرشادات العامة (ص 27).'],
    ['2) يجب استخدام معدات الوقاية المعتمدة دولياً.','×','النص يقول: «المعتمدة من السلطات المحلية وتكون متوافقة مع ANSI» (ص 27)، فالعبارة بصيغتها هذه لا تطابق النص. وقد يقبلها بعض المدربين صحيحة بمعنى «معتمدة».'],
    ['3) لاستخدام أجهزة التنفس لا بد من عمل فحص طبي لمرة واحدة فقط ويعتبر كافياً.','×','الفحص يتكرر سنوياً (ص 27).'],
    ['4) خوذة الرأس من الدرجة ب مصممة للأعمال الخفيفة.','×','الدرجة ب للأعمال الشاقة، والدرجة أ للخفيفة (ص 29).'],
    ['5) تستخدم واقيات الأذن في الأماكن التي تزيد الضوضاء فيها عن 85 ديسيبل.','✓','(ص 31).'],
    ['6) أغطية الأذن تقلل نسبة الضوضاء في حدود 15–35 ديسيبل.','✓','(ص 32).'],
    ['7) تعتبر إصابات القدم أكثر الإصابات شيوعاً.','✓','«من أكثر الإصابات التي يتعرض لها العاملون في الأماكن الصناعية هي إصابات القدم» (ص 36).'],
    ['8) كمية الهواء الموجودة في أجهزة التنفس الذاتية تكفي للاستخدام لمدة ساعة ونصف.','×','تكفي «ساعة أو نصف ساعة» حسب حجم الأسطوانة (ص 37).'],
    ['9) أجهزة التنفس المنقية للهواء لا تستطيع إمداد العاملين بالهواء اللازم لعملية التنفس.','✓','(ص 38).'],
    ['10) يستخدم حزام الباراشوت عند العمل في الأماكن المغلقة.','×','حزام الباراشوت للعمل في الأماكن المرتفعة، أما الأماكن المغلقة والخزانات فـ «حزام سلامة خاص Safety Harness وحبل إنقاذ» (ص 42).'],
    ['11) تستخدم القفازات الواقية المصنوعة من المطاط أو البلاستيك لحماية الأيدي في أعمال الكهرباء.','×','تستعمل أثناء مناولة المواد الكيميائية كالأحماض والقلويات (ص 43).'],
    ['12) اللون الأحمر في العلامات الإرشادية يدل على التحذير.','×','الأحمر = خطر DANGER أو قف STOP؛ التحذير CAUTION أصفر، وWARNING برتقالي (ص 49).']
   ].map(([q,a,e])=>`<details class="fig" style="padding:10px 12px"><summary style="cursor:pointer;font-weight:600">${q}</summary><p style="margin-top:8px"><b>إجابة مقترحة (ليست من الكتاب):</b> <b>${a}</b> — ${e}</p></details>`).join('')}`},
  {err:`في أسئلة ص 55–56 صححنا: «أإطية» = أغطية (العبارة 6)، و«البارشوات» = الباراشوت (العبارة 10). والعبارة 8 تقول «ساعة ونصف» والمتن «ساعة أو نصف ساعة». والعبارة 2 تقول «المعتمدة دولياً» والمتن «المعتمدة من السلطات المحلية ومتوافقة مع ANSI». ولا توجد في هذه الوحدة أسئلة إكمال.`}
 ],
 lab:(el)=>{el.innerHTML='<div class="grid" id="l6a"></div><div class="grid" id="l6b" style="margin-top:16px"></div>'+`<div class="panel" style="margin-top:16px">${tries(['في الألوان: ما الفرق بين الأصفر (CAUTION) والبرتقالي (WARNING)؟','في الأنابيب: غيّر القطر من 1 إلى 12 بوصة وراقب كيف يكبر ارتفاع الحروف بخطوات.','اختر «مواد إطفاء الحرائق» ثم «منخفضة الخطورة — غازية»: ما الذي يتغير وما الذي يبقى؟','جرّب قطراً في فجوة الجدول (مثلاً 2.25 أو 7 بوصات).'])}</div>`;colorLab(el.querySelector('#l6a'));pipeLab(el.querySelector('#l6b'))},
 examples:[
  pipeEx({title:'مثال 1 (إضافة من خارج الكتاب): أنبوب ماء تبريد',d:4,cat:'liq',q:'<p>أنبوب قطره <span class="ltr">4</span> بوصات ينقل ماء تبريد راجعاً <span class="ltr">(CHILLED WATER RETURN)</span>، وهو سائل منخفض الخطورة. ما ألوان لافتته، وما أقل ارتفاع لأطول حروفها؟</p>',note:'مبني على جدول ص 53 وألوان ص 53؛ المثال نفسه ليس من الكتاب. غيّر القطر لترى صفاً آخر من الجدول.'}),
  pipeEx({title:'مثال 2 (إضافة من خارج الكتاب): خط إطفاء رئيسي',d:12,cat:'fire',q:'<p>خط رئيسي لمرشات الحريق <span class="ltr">(SPRINKLER-FIRE)</span> قطره <span class="ltr">12</span> بوصة. ما ألوان لافتته، وما أقل ارتفاع لأطول حروفها؟</p>',note:'جرّب القطر <span class="ltr">7</span> بوصات: يقع في فجوة بين صفوف الجدول.'})
 ],
 quiz:[
  {q:'ما معنى اللون الأخضر في جدول الألوان؟',o:['خطر','الأمان SAFETY — أماكن الإسعافات ومعدات السلامة','التحذير','الإشعاع'],c:1,e:'(ص 49–50).'},
  {q:'ما ألوان علامة الخطر Danger حسب الأوشا؟',o:['الأصفر والأسود','الأحمر والأسود والأبيض','الأبيض والأخضر','الأزرق والأبيض'],c:1,e:'(ص 50) والشكل (3-16) ص 50.'},
  {q:'علامات الإرشادات حسب الأوشا:',o:['خلفية صفراء ونافذة سوداء','خلفية بيضاء ونافذة خضراء وحروف بيضاء','خلفية حمراء','خلفية زرقاء'],c:1,e:'(ص 51) والشكل (3-18) ص 51.'},
  {q:'لافتة أنبوب حروفها سوداء على خلفية صفراء تعني أن المادة:',o:['منخفضة الخطورة سائلة','عالية الخطورة','للإطفاء','غازية منخفضة الخطورة'],c:1,e:'(ص 53) والشكل (3-19).'},
  {q:'أنبوب قطره 4 بوصات. ما أقل ارتفاع لأطول حروف لافتته؟',o:['0.5 بوصة','0.75 بوصة','1.25 بوصة','2.5 بوصة'],c:2,e:'القطر 2.50–6 بوصة ← 1.25 بوصة (ص 53).'},
  {q:'أنبوب يمر فوق رأس العامل فينظر إليه إلى أعلى. أين توضع اللافتة؟',o:['في أعلى الأنبوب','في الجزء الأسفل من الأنبوب','لا توضع لافتة','على الجدار'],c:1,e:'(ص 54).'}
 ]
});

})(PLCBOOK);
