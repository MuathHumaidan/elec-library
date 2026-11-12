/* Unit 6 — أنظمة الإنذار من الحريق وإطفاء الحرائق (ص 112–135)
   u6-l1 لوحة الإنذار · u6-l2 الكواشف · u6-l3 هرم الاشتعال وأنواع الحرائق · u6-l4 الطفايات وطرق الإطفاء وPASS (+ أسئلة الوحدة) */
(function(B){
"use strict";
/* أعطال «اكتشف العطل» المخفية (challenge.js): false دائماً خارج وضع التحدي */
const chF=f=>!!(B.chF&&B.chF(f));
const lt=s=>`<span class="ltr">${s}</span>`;
const ADDT='<b>إضافة من خارج الكتاب:</b> ';
const TIP='<b>توضيح للمتدرب (ليس من نص الكتاب):</b> ';
const RED='#c8372d',FL1='#e8590c',FL2='#ffd43b';
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const f1=v=>(+v).toFixed(1),f0=v=>String(Math.round(v));
/* keep figure numbers «(6-4)» and «57 °C», «3–5 m», «20 %» left-to-right inside Arabic lab text (outside tags/SVG) */
const fx=t=>B.ltrFig(String(t)).split(/(<svg[\s\S]*?<\/svg>|<span class="ltr">[\s\S]*?<\/span>)/).map((p,i)=>i%2?p:p.replace(/(\d[\d.]*(?:\s?[–-]\s?\d[\d.]*)?\s?(?:°C\/min|°C|%|min|m|s)(?![A-Za-z]))(?![^<]*>)/g,'<span class="ltr">$1</span>')).join('');

/* ---------- styles used only by this file (CSS variables only) ---------- */
(function css(){if(typeof document==='undefined'||document.getElementById('saf6-css'))return;const s=document.createElement('style');s.id='saf6-css';s.textContent=`
.s6 .seg{flex-wrap:wrap;max-width:100%}
.s6-row{display:flex;flex-wrap:wrap;gap:10px 14px;align-items:flex-end;margin-top:10px}
.s6-row .sub{margin:0}
.s6-sws{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px 8px;margin-top:10px}
.s6-sws .sw small{white-space:normal;text-align:center;line-height:1.4}
.s6-sl{display:flex;flex-direction:column;gap:2px;font-size:13.5px;min-width:210px;flex:1 1 210px}
.s6-sl .h{display:flex;justify-content:space-between;gap:8px}
.s6-sl b{font-family:var(--mono);direction:ltr;unicode-bidi:isolate;color:var(--blue-ink)}
.s6-sl input{width:100%;accent-color:var(--blue);direction:ltr}
.s6-chip{display:inline-block;font-size:12px;font-weight:700;padding:1px 9px;border-radius:999px;background:var(--surface-2);color:var(--muted);white-space:nowrap}
.s6-chip.ok{background:var(--on-soft);color:var(--on)}.s6-chip.bad{background:var(--stop-soft);color:var(--stop)}.s6-chip.warn{background:var(--live-soft);color:var(--live)}
.s6-chip.add{background:var(--blue-soft);color:var(--blue-ink)}
.s6-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px;margin-top:8px}
.s6-card{font:inherit;font-size:13.5px;text-align:start;border:1.5px solid var(--line);border-radius:12px;background:var(--surface);color:var(--fg);padding:8px 10px;cursor:pointer;line-height:1.5;display:flex;gap:8px;align-items:center;min-height:52px}
.s6-card svg{flex:0 0 auto}
.s6-card[aria-pressed="true"]{border-color:var(--blue);background:var(--blue-soft)}
.s6-card.ok{border-color:var(--on);background:var(--on-soft)}.s6-card.bad{border-color:var(--stop);background:var(--stop-soft)}.s6-card.warn{border-color:var(--live);background:var(--live-soft)}
.s6-res{margin-top:10px;border-radius:10px;padding:10px 12px;border-inline-start:4px solid var(--blue);background:var(--blue-soft);font-size:14.5px;line-height:1.8}
.s6-res.ok{border-inline-start-color:var(--on);background:var(--on-soft)}.s6-res.bad{border-inline-start-color:var(--stop);background:var(--stop-soft)}.s6-res.warn{border-inline-start-color:var(--live);background:var(--live-soft)}
.s6-tl{list-style:none;padding:0;margin:8px 0 0;display:grid;gap:4px;font-size:13.5px}
.s6-tl li{padding:4px 8px;border-radius:8px;background:var(--surface-2)}
.s6-tl li.bad{background:var(--stop-soft)}
.s6-ord{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;margin-top:8px}
.s6-ord button{font:inherit;font-size:13.5px;border:1.5px solid var(--line);border-radius:12px;background:var(--surface);color:var(--fg);padding:8px 10px;cursor:pointer;text-align:start;line-height:1.5}
.s6-ord button.done{border-color:var(--on);background:var(--on-soft)}
.s6-ord button.no{border-color:var(--stop);background:var(--stop-soft)}
.s6-tbl{overflow-x:auto}
.s6-tbl table{border-collapse:collapse;font-size:13.5px;width:100%}
.s6-tbl th,.s6-tbl td{border:1px solid var(--line);padding:5px 8px;vertical-align:top;text-align:start}
.s6-tbl th{background:var(--surface-2)}
.s6 details,.s6q details{border:1px solid var(--line);border-radius:10px;padding:6px 12px;margin-top:8px;background:var(--surface)}
.s6q details summary{cursor:pointer;font-weight:600;line-height:1.7}
.s6q details .ans{margin-top:6px;border-inline-start:3px solid var(--blue);padding-inline-start:10px}
@keyframes s6ring{0%,100%{transform:rotate(0)}25%{transform:rotate(-9deg)}75%{transform:rotate(9deg)}}
.s6-ring{animation:s6ring .18s linear infinite;transform-box:fill-box;transform-origin:50% 20%}
@keyframes s6blink{0%,49%{opacity:1}50%,100%{opacity:.18}}
.s6-blink{animation:s6blink .8s steps(1) infinite}
@media (prefers-reduced-motion:reduce){.s6-ring,.s6-blink{animation:none}}
`;document.head.appendChild(s)})();

/* ---------- small UI helpers ---------- */
function loopOn(el,fn){let last=performance.now();const f=now=>{if(!document.body.contains(el))return;const dt=Math.min(0.05,Math.max(0,(now-last)/1000));last=now;try{fn(dt)}catch(e){console.error(e);return}requestAnimationFrame(f)};requestAnimationFrame(f)}
function stepsUI(host,steps,getW){let i=0;
  const draw=()=>{host.innerHTML=steps.map((s,j)=>`<li class="${j<i?'done':j===i?'cur':''}"><span class="k">${j<i?'✓':j+1}</span><div><h4>${fx(s.t)}</h4><p>${fx(typeof s.x==='function'?s.x():s.x)}</p>${j===i?`<div class="act">${s.done?'<span class="hint">بانتظار تنفيذك…</span> <button class="btn" data-next>تخطَّ</button>':'<button class="btn primary" data-next>التالي</button>'}</div>`:''}</div></li>`).join('')+
    (i>=steps.length?`<li class="cur"><span class="k">✓</span><div><h4>أحسنت، أنهيت التجربة</h4><p style="display:block">يمكنك إعادة التجربة.</p><div class="act"><button class="btn" data-restart>إعادة التجربة</button></div></div></li>`:'')};
  host.addEventListener('click',e=>{if(e.target.closest('[data-next]')){i++;draw()}if(e.target.closest('[data-restart]')){i=0;draw()}});draw();
  return {check(){const s=steps[i];if(s&&s.done&&s.done(getW())){i++;draw()}},redraw:draw}}
const segHTML=(attr,items,cur)=>`<div class="seg" role="group">${items.map(([v,l])=>`<button data-${attr}="${v}" aria-pressed="${String(v)===String(cur)}">${l}</button>`).join('')}</div>`;
const segSet=(el,attr,v)=>el.querySelectorAll(`[data-${attr}]`).forEach(b=>b.setAttribute('aria-pressed',String(b.dataset[attr])===String(v)));
const swHTML=(id,b,label,on)=>`<button class="sw" id="${id}" aria-pressed="${on?'true':'false'}"><span class="knob"></span><b>${b}</b><small>${label}</small></button>`;
const pbHTML=(id,color,cap,label)=>`<button class="pb ${color}" id="${id}" aria-label="${label}"><span class="cap">${cap}</span><small>${label}</small></button>`;
const slHTML=(id,lbl,min,max,step,v,unit)=>`<label class="s6-sl"><span class="h"><span>${lbl}</span><b id="${id}V">${v} ${unit}</b></span><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${v}"></label>`;
const tries=list=>`<h3 class="sm">جرّب</h3><ul class="sub" style="padding-inline-start:20px;margin-top:4px">${list.map(t=>`<li>${t}</li>`).join('')}</ul>`;
const box=(h,mw)=>`<div class="svgbox" style="max-width:${mw||560}px;margin-inline:auto">${h}</div>`;
/* SVG text: Arabic in its own <text>; a Latin/number run inside Arabic goes into its own ltr tspan */
const tA=(x,y,t,o)=>{o=o||{};return `<text class="txt ar${o.m?' m':''}" x="${x}" y="${y}" text-anchor="${o.a||'middle'}" style="font-size:${o.fs||11.5}px${o.fill?';fill:'+o.fill:''}${o.w?';font-weight:'+o.w:''}">${String(t).replace(/([A-Za-z0-9][A-Za-z0-9.,%°+\-–/ ]*[A-Za-z0-9%°]|[A-Za-z0-9])/g,'<tspan direction="ltr" unicode-bidi="embed">$1</tspan>')}</text>`};
const tL=(x,y,t,o)=>{o=o||{};return `<text class="txt${o.m?' m':''}" x="${x}" y="${y}" text-anchor="${o.a||'middle'}" style="font-size:${o.fs||10.5}px${o.fill?';fill:'+o.fill:''}">${t}</text>`};
const flame=(cx,cy,s,id)=>`<g${id?` id="${id}"`:''} transform="translate(${cx} ${cy}) scale(${s})"><path d="M0 0C-22 0-30-18-22-34C-17-44-8-48-6-62C4-52 2-44 8-40C10-48 16-52 18-58C28-44 30-30 26-18C22-6 14 0 0 0Z" style="fill:${FL1}"/><path d="M0 0C-11 0-15-9-11-18C-8-24-3-26-2-34C4-28 6-22 7-16C10-20 12-22 13-25C17-17 15-8 12-4C9-1 5 0 0 0Z" style="fill:${FL2}"/></g>`;

/* ---------- fire-alarm component icons (fig 6-1 / 6-2), centred at (x,y), about 44 px ---------- */
function ico(k,x,y,o){o=o||{};const g=s=>`<g transform="translate(${x} ${y})"${o.id?` id="${o.id}"`:''}>${s}</g>`;const ST='stroke:var(--fg);stroke-width:1.2';
 switch(k){
 case 'facp':return g(`<rect x="-15" y="-22" width="30" height="44" rx="3" style="fill:var(--surface-2);${ST}"/><rect x="-9" y="-12" width="18" height="10" rx="1.5" style="fill:var(--on)"/><path d="M-10 -17h20M-10 8h20M-10 12h20M-10 16h20" style="stroke:var(--muted);stroke-width:1"/>`);
 case 'smoke':return g(`<rect x="-18" y="-9" width="36" height="6" rx="1.5" style="fill:var(--surface-2);${ST}"/><rect x="-11" y="-3" width="22" height="10" rx="4" style="fill:var(--surface);${ST}"/>${o.on?`<circle cx="0" cy="11" r="3" style="fill:${RED}"/>`:''}`);
 case 'manual':return g(`<rect x="-13" y="-16" width="26" height="32" rx="2" style="fill:${RED};stroke:var(--fg);stroke-width:1"/><text x="0" y="-7" text-anchor="middle" style="font:700 7px var(--mono);fill:#fff">FIRE</text><path d="${o.on?'M-7 4h14M0 4v8':'M-7 -1h14M0 -1v9'}" style="stroke:#fff;stroke-width:2.6;stroke-linecap:round"/>`);
 case 'wf':return g(`<path d="M-20 10h40" style="stroke:var(--muted);stroke-width:7"/><rect x="-8" y="-14" width="16" height="16" rx="2" style="fill:${RED};stroke:var(--fg);stroke-width:1"/><circle cx="0" cy="-6" r="5" style="fill:#fff"/><text x="0" y="-4" text-anchor="middle" style="font:700 5.5px var(--mono);fill:${RED}">WF</text>${o.on?'<path d="M-16 10h8M2 10h8" style="stroke:var(--blue);stroke-width:3;stroke-dasharray:3 3"/>':''}`);
 case 'spr':return g(`<path d="M-18 8h36" style="stroke:var(--muted);stroke-width:6"/><path d="M-9 -2l18 14v-14l-18 14z" style="fill:${RED};stroke:var(--fg);stroke-width:1"/><path d="M0 5v-14M-6 -9h12" style="stroke:var(--fg);stroke-width:1.6"/><text x="0" y="-12" text-anchor="middle" style="font:600 6px var(--mono);fill:var(--fg)">open</text>`);
 case 'horn':return g(`<g class="${o.on?'s6-ring':''}"><rect x="-14" y="-8" width="10" height="16" style="fill:${RED};stroke:var(--fg);stroke-width:1"/><path d="M-4 -8L12 -16V16L-4 8Z" style="fill:${RED};stroke:var(--fg);stroke-width:1"/></g>${o.on?'<path d="M16 -10q6 10 0 20M21 -15q9 15 0 30" style="fill:none;stroke:var(--live);stroke-width:1.8"/>':''}`);
 case 'strobe':return g(`<rect x="-16" y="-11" width="32" height="22" rx="2" style="fill:${RED};stroke:var(--fg);stroke-width:1"/><ellipse cx="0" cy="0" rx="11" ry="6.5" class="${o.on?'s6-blink':''}" style="fill:${o.on?FL2:'#fff'}"/><text x="0" y="2.5" text-anchor="middle" style="font:700 6.5px var(--mono);fill:${RED}">FIRE</text>`);
 case 'fan':return g(`<circle r="16" style="fill:var(--surface);${ST}"/><g ${o.fid?`id="${o.fid}"`:''}>${[0,90,180,270].map(a=>`<path transform="rotate(${a})" d="M0 0C3 -5 9 -12 3 -14C-2 -14 -2 -6 0 0Z" style="fill:${o.on===false?'var(--muted)':'var(--blue)'}"/>`).join('')}</g><circle r="2.2" style="fill:var(--fg)"/>`);
 case 'door':return g(`<rect x="-11" y="-18" width="22" height="36" style="fill:var(--surface-2);${ST}"/>${o.open?`<path d="M-11 -18L4 -12V24L-11 18Z" style="fill:var(--live-soft);${ST}"/>`:`<rect x="-8" y="-15" width="16" height="31" style="fill:var(--live-soft);stroke:var(--fg);stroke-width:1"/>`}<circle cx="${o.open?1:5}" cy="2" r="1.8" style="fill:var(--fg)"/>`);
 case 'truck':return g(`<rect x="-22" y="-10" width="30" height="16" rx="2" style="fill:${RED};stroke:var(--fg);stroke-width:1"/><path d="M8 -6h8l6 6v6H8z" style="fill:${RED};stroke:var(--fg);stroke-width:1"/><path d="M-20 -13h26" style="stroke:var(--muted);stroke-width:2"/><circle cx="-12" cy="8" r="4" style="fill:var(--fg)"/><circle cx="14" cy="8" r="4" style="fill:var(--fg)"/>${o.on?`<circle cx="-8" cy="-14" r="2.5" class="s6-blink" style="fill:${FL2}"/>`:''}`);
 case 'kbd':return g(`<rect x="-14" y="-18" width="28" height="20" rx="2" style="fill:var(--surface-2);${ST}"/><rect x="-10" y="-14" width="20" height="12" style="fill:var(--fg)"/><text x="0" y="-5" text-anchor="middle" style="font:700 5px var(--mono);fill:var(--surface)">CRT</text><rect x="-18" y="6" width="36" height="9" rx="1.5" style="fill:var(--surface-2);${ST}"/>`);
 case 'printer':return g(`<rect x="-16" y="-6" width="32" height="16" rx="2" style="fill:var(--surface-2);${ST}"/><rect x="-10" y="-16" width="20" height="10" style="fill:var(--surface);stroke:var(--fg);stroke-width:1"/><rect x="-9" y="10" width="18" height="6" style="fill:var(--surface);stroke:var(--fg);stroke-width:1"/>`);
 case 'annun':return g(`<rect x="-20" y="-16" width="40" height="32" rx="2" style="fill:var(--surface-2);${ST}"/>${[0,1,2,3].map(i=>`<rect x="-16" y="${-12+i*6}" width="14" height="4" style="fill:var(--surface);stroke:var(--muted);stroke-width:.6"/>`).join('')}<rect x="6" y="-8" width="6" height="5" style="fill:var(--fg)"/><rect x="6" y="3" width="6" height="5" style="fill:var(--fg)"/>`);
 case 'batt':return g(`<rect x="-12" y="-8" width="24" height="16" rx="2" style="fill:var(--surface);${ST}"/><path d="M-6 -11v3M6 -11v3" style="stroke:var(--fg);stroke-width:2"/><text x="0" y="3" text-anchor="middle" style="font:700 6.5px var(--mono);fill:var(--fg)">BATT</text>`);
 }
 return ''}

/* ---------- fig 6-1 ---------- */
function fig61(){const C=[['facp','FACP','لوحة التحكم',75,95],['smoke','Smoke Detectors','كواشف الدخان',215,60],['manual','Manual Stations','نقاط الإنذار اليدوي',215,150],['horn','Audible Devices','أجهزة التنبيه الصوتي',355,60],['strobe','Visible Devices','أجهزة التنبيه الضوئي',355,150],['fan','HVAC Fans &amp; Dampers','مراوح التكييف وبواباته',495,60],['door','Door Locks &amp; Hold Open','أقفال الأبواب وماسكاتها',495,150],['kbd','Keyboards','لوحة المفاتيح والشاشة',635,60],['printer','Printers','الطابعات',635,150]];
 let s=`<svg viewBox="0 0 710 210" role="img" aria-label="مكونات لوحة الإنذار من الحريق">`+tL(355,16,'Fire Alarm Control Panel Components',{fs:13})+`<path d="M200 22H510" style="stroke:var(--live);stroke-width:2"/>`;
 C.forEach(([k,en,ar,x,y])=>{s+=ico(k,x,y)+tL(x,y+32,en,{fs:9.5})+tA(x,y+45,ar,{fs:10.5,m:1})});return s+'</svg>'}

/* ---------- fig 6-2 (block diagram) ---------- */
function fig62(){let s=`<svg viewBox="0 0 760 450" role="img" aria-label="المخطط الصندوقي للوحة الإنذار من الحريق">`;
 s+=tL(380,16,'Fire Alarm Control Panel Components',{fs:13});
 s+=tL(70,36,'Inputs → Initiating Devices',{fs:10})+tA(70,50,'المداخل: أجهزة البدء',{fs:10.5,m:1})+tL(380,36,'Logic / Control',{fs:10})+tA(380,50,'المنطق والتحكم',{fs:10.5,m:1})+tL(680,36,'Outputs → Notification & Controls',{fs:10})+tA(680,50,'المخارج: التنبيه والتحكم في الطوارئ',{fs:10.5,m:1});
 const IN=[['smoke','Smoke Detectors',85],['manual','Manual Stations',160],['wf','Waterflow Switches',235],['spr','Sprinkler Supervisory',310]];
 IN.forEach(([k,en,y])=>{s+=ico(k,60,y)+tL(60,y+30,en,{fs:9})+`<path d="M86 ${y}H${200}" class="w"/><path d="M196 ${y-4}l6 4l-6 4z" style="fill:var(--wire)"/>`});
 s+=tL(60,372,'120 VAC',{fs:10})+`<path d="M60 378V395H200" class="w"/><path d="M120 390l8 -8M126 390l8 -8" style="stroke:var(--fg);stroke-width:1.3"/>`;
 s+=`<rect x="205" y="62" width="350" height="350" rx="8" style="fill:var(--surface-2);stroke:var(--fg);stroke-width:1.4"/>`+tL(380,80,'FIRE ALARM CONTROL PANEL',{fs:11});
 const bx=(x,y,w,h,t,sub)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" style="fill:var(--surface);stroke:var(--fg);stroke-width:1.1"/>`+tL(x+w/2,y+h/2+(sub?-2:4),t,{fs:10})+(sub?tL(x+w/2,y+h/2+10,sub,{fs:8.5,m:1}):'');
 s+=bx(218,150,70,110,"IDC's")+bx(218,280,70,40,'Power Supply')+bx(218,340,70,36,'BATT');
 s+=bx(318,100,124,46,'User Interface')+bx(318,190,124,70,'Program /','Distribution HW/SW');
 s+=bx(472,110,70,60,"NAC's")+bx(472,200,70,60,'AUX Relays')+bx(472,290,70,60,'City CKT');
 s+=`<path d="M380 146V190M374 182l6 8l6 -8M374 154l6 -8l6 8" style="fill:none;stroke:var(--fg);stroke-width:1.2"/><path d="M288 205H318M288 300H300V245H318M253 340V320" class="w"/><path d="M442 225H458V140H472M458 230H472M458 225V320H472" class="w"/>`;
 [['kbd','Keyboards',265],['annun','Annunciators',380],['printer','Printers',495]].forEach(([k,en,x])=>{s+=`<path d="M${x} 412V${428-10}" style="stroke:var(--fg);stroke-width:1.2"/>`+ico(k,x,425-0)+tL(x,449,en,{fs:9})});
 const OUT=[['horn','Audible Devices',90,140],['strobe','Visible Devices',160,140],['fan','HVAC Fans & Dampers',230,230],['door','Door Locks & Hold Open',300,230],['truck','Fire Department',375,320]];
 OUT.forEach(([k,en,y,fy])=>{s+=`<path d="M542 ${fy}H585V${y}H645" class="w"/><path d="M641 ${y-4}l6 4l-6 4z" style="fill:var(--wire)"/>`+ico(k,680,y)+tL(680,y+30,en,{fs:9})});
 return s.replace('<path d="M60 378V395H200" class="w"/>','<path d="M60 378V395H210V300H218" class="w"/>')+'</svg>'}

/* =====================================================================
   LAB u6-l1 — fire alarm panel (fig 6-2)
   ===================================================================== */
function alarmLab(el){
 const S={z1:0,z2:0,z3:0,z4:0,cut:0,acf:0,lat:[0,0,0,0],sil:0,silF:0,test:null,testT:0,checked:-1};
 const w={alarm:0,z:[0,0,0,0],sil:0,reAlarm:0,cleared:0,falseSeen:0,fault:0,testCut:0,batt:0,everAl:0};
 const ZN=['دخان حريق عند كاشف المنطقة Z1','نقطة الإنذار اليدوي في المنطقة Z2','مفتاح تدفق الماء (الرشاشات) في المنطقة Z3','كاشف الدخان في المنطقة Z4'];
 el.innerHTML=fx(`<div class="grid s6">
  <div class="panel c12"><h2>مختبر لوحة الإنذار الآلي من الحريق <small>مبني على الشكل (6-2) ص 115</small></h2>
   <p class="sub">أجهزة البدء في المبنى (يسار الرسم كما في الشكل) ترسل إشارتها إلى اللوحة (الوسط)، واللوحة تشغّل المخارج: الجرس والضوء الوامض، وتوقف مراوح التكييف، وتحرر الأبواب لتنغلق، وتتصل بالدفاع المدني. الخط المتقطع المتحرك = إشارة تسري الآن.</p>
   <div class="svgbox" id="fv" style="max-width:760px;margin-inline:auto"></div>
   <div class="wrap-in" style="padding-top:4px"><div class="reads" style="margin-inline-start:0">
    <div class="read"><span>حالة اللوحة</span><em class="mode-chip" id="rS">—</em></div><div class="read"><span>المناطق في إنذار</span><b id="rZ">—</b></div>
    <div class="read"><span>الجرس</span><b id="rB">—</b></div><div class="read"><span>مراوح التكييف</span><b id="rH">—</b></div><div class="read"><span>التغذية</span><b id="rP">—</b></div></div></div>
   <div class="callout" id="say"></div></div>
  <div class="panel c7"><h2>ما يحدث في المبنى</h2><p class="sub">كل مفتاح يمثل حدثًا في مكان ما من المبنى.</p>
   <div class="s6-sws">${swHTML('e1','Z1','دخان حريق في المنطقة Z1')}${swHTML('e2','Z2','سحب زر الإنذار اليدوي في Z2')}${swHTML('e3','Z3','رشاش يعمل (تدفق ماء) في Z3')}${swHTML('e4','Z4','بخار أو غبار عند كاشف Z4 (بلا حريق)')}${swHTML('ec','Z4','قطع سلك كاشف المنطقة Z4')}${swHTML('ea',lt('120 VAC'),'انقطاع تغذية اللوحة')}</div></div>
  <div class="panel c5"><h2>أزرار لوحة التحكم <small>«Silence» و«Reset» على لوحة البيان في الشكل (6-2)</small></h2>
   <div class="pbs" style="margin-top:8px">${pbHTML('bSil','yellow','SIL','إسكات الجرس')}${pbHTML('bRst','blue','RST','إعادة الضبط')}${pbHTML('bTst','black','TEST','تجربة التوصيلات')}</div>
   <div id="chk" style="margin-top:10px"></div><div id="tres"></div>
   <div class="callout">${TIP}«الإسكات» يوقف الجرس فقط وتبقى اللوحة في حالة إنذار حتى يُزال السبب ثم يُضغط «إعادة الضبط». إذا ضغطت «إعادة الضبط» والسبب ما زال موجودًا (دخان، أو زر يدوي لم يُرجع) يعود الإنذار فورًا.</div></div>
  <div class="panel c12"><h2>التجربة خطوة بخطوة</h2><ol class="steps" id="gs"></ol>${tries(['شغّل حدثين في منطقتين: لاحظ أن لوحة البيان تبيّن كل منطقة وحدها، فيعرف المسؤول أين الحريق.','اقطع سلك Z4 ثم شغّل البخار عند كاشفها: لا يصل أي إنذار من هذه المنطقة — لهذا تنبّه اللوحة إلى العطل فورًا.','اقطع التغذية أثناء الإنذار: يستمر النظام على البطارية.'])}</div>
 </div>`);
 const $=s=>el.querySelector(s);
 /* dead(): البطارية الاحتياطية تالفة والتغذية منقطعة ⇐ اللوحة بلا طاقة (وضع التحدي فقط) */
 const dead=()=>!!(S.acf&&chF('batt0'));
 const inZ=i=>i===0?S.z1&&!chF('zopen'):i===1?S.z2||chF('mcp'):i===2?S.z3:((S.z4||S.dz)&&!S.cut);
 const alarm=()=>S.lat.some(Boolean),fault=()=>!!(S.cut||S.acf||S.bF||chF('zopen')||chF('nac'));
 let say=fault()?'<b>مصباح «عطل» مضيء</b> وصفّارة العطل في اللوحة تصفّر. شغّل حدثًا من «ما يحدث في المبنى»، أو اضغط «تجربة التوصيلات».':'اللوحة في حالة المراقبة العادية: كل المناطق سليمة، والتغذية موجودة. شغّل حدثًا من «ما يحدث في المبنى».';
 function scan(){if(dead())return -1;let nw=-1;S.lat.forEach((v,i)=>{if(!v&&inZ(i)){S.lat[i]=1;nw=i}});if(nw>=0){S.sil=0;w.everAl=1;w.z[nw]=1;
   say=nw===3?'<b>إنذار في المنطقة Z4.</b> اللوحة لا تعرف هل هو حريق حقيقي أم لا. قبل أي شيء: <b>تحقّق من المكان</b> (الزر تحت أزرار اللوحة).':`<b>إنذار حريق في المنطقة Z${nw+1}</b> (${ZN[nw]}). ${chF('nac')?'':'دق الجرس و'}أضاء الضوء الوامض، وتوقفت مراوح التكييف حتى لا ينقل الدخان، وتحررت الأبواب لتنغلق، واتصلت اللوحة بالدفاع المدني.`}
  return nw}
 function render(){const dd=dead(),al=alarm()&&!dd,fl=fault()&&!dd,bell=al&&!S.sil&&!chF('nac'),lt0=S.testT>0&&!dd;
  const wcls=on=>on?'w flow':'w';const YS=[70,150,230,310];
  let s=`<svg viewBox="0 0 760 400" role="img" aria-label="لوحة الإنذار وأجهزتها">`;
  s+=tA(85,22,'أجهزة البدء (المداخل)',{fs:11.5,w:700})+tA(380,22,'لوحة التحكم',{fs:11.5,w:700})+tA(675,22,'المخارج',{fs:11.5,w:700});
  ['smoke','manual','wf','smoke'].forEach((k,i)=>{const y=YS[i],on=i===0?S.z1:i===1?S.z2:i===2?S.z3:S.z4;
   s+=ico(k,85,y,{on})+tL(40,y+4,'Z'+(i+1),{fs:11})+tA(85,y+32,['كاشف دخان','زر يدوي','تدفق ماء','كاشف دخان'][i],{fs:10.5,m:1});
   if(i===0&&S.z1)s+=flame(120,y+18,.35);
   if(i===3&&S.z4)s+=`<g style="opacity:.75">${[0,1,2].map(j=>`<path d="M${108+j*8} ${y+16}q-5 -8 0 -14q5 -6 0 -14" style="fill:none;stroke:var(--muted);stroke-width:2"/>`).join('')}</g>`;
   const sig=inZ(i);
   if(i===3&&S.cut)s+=`<path d="M112 ${y}H165" class="w"/><path d="M185 ${y}H232" class="w"/><path d="M165 ${y-6}l6 12M179 ${y-6}l6 12" style="stroke:var(--stop);stroke-width:2"/>`+tA(175,y-12,'سلك مقطوع',{fs:10,fill:'var(--stop)'});
   else s+=`<path d="M112 ${y}H232" class="${wcls(sig)}"/>`});
  s+=`<rect x="232" y="40" width="296" height="345" rx="10" style="fill:var(--surface-2);stroke:var(--fg);stroke-width:1.5"/>`+tL(380,58,'FIRE ALARM CONTROL PANEL',{fs:10.5});
  // annunciator zones
  s+=`<rect x="248" y="68" width="150" height="160" rx="6" style="fill:var(--surface);stroke:var(--line)"/>`+tA(323,86,'لوحة البيان (المناطق)',{fs:10.5,m:1});
  [0,1,2,3].forEach(i=>{const y=108+i*30,on=(S.lat[i]&&!dd)||lt0;s+=`<circle cx="270" cy="${y}" r="8" class="${S.lat[i]&&!S.sil&&!dd?'s6-blink':''}" style="fill:${on?RED:'var(--lamp-off)'};stroke:var(--fg);stroke-width:1"/>`+tL(300,y+4,'Zone '+(i+1),{fs:10.5,a:'start'})});
  const lamp=(x,y,on,col,ar,blink)=>`<circle cx="${x}" cy="${y}" r="9" class="${blink?'s6-blink':''}" style="fill:${on?col:'var(--lamp-off)'};stroke:var(--fg);stroke-width:1"/>`+tA(x,y+24,ar,{fs:10,m:1});
  s+=lamp(430,95,al||lt0,RED,'حريق',al&&!S.sil)+lamp(490,95,fl||lt0,'#e0a800','عطل',fl&&!S.silF)+lamp(430,150,!S.acf||lt0,'#2fb344','تغذية')+lamp(490,150,(S.acf&&!dd)||lt0,'#e0a800','بطارية');
  const buz=(fl&&!S.silF)||(al&&S.sil&&false);
  s+=`<g transform="translate(462 205)"><circle r="13" style="fill:var(--surface);stroke:var(--fg);stroke-width:1.1"/><circle r="5" style="fill:${buz?'var(--live)':'var(--muted)'}"/>${buz?'<path d="M16 -8q5 8 0 16M-16 -8q-5 8 0 16" style="fill:none;stroke:var(--live);stroke-width:1.6"/>':''}</g>`+tA(462,236,'صفّارة العطل في اللوحة',{fs:9.5,m:1});
  // power + battery
  s+=ico('batt',300,330)+tA(300,355,'بطارية احتياطية',{fs:9.5,m:1})+`<path d="M232 372H262V344" class="${S.acf?'w':'w live'}"/>`+tL(175,364,'120 VAC',{fs:10})+`<path d="M130 372H232" class="${S.acf?'w':'w live'}"/>`+(S.acf?`<path d="M180 364l10 16" style="stroke:var(--stop);stroke-width:2"/>`:'')+`<path d="M312 330H340V305H360" class="${S.acf&&!dd?'w live':'w'}"/>`;
  s+=`<rect x="360" y="262" width="150" height="70" rx="6" style="fill:var(--surface);stroke:var(--line)"/>`+tA(435,282,'المعالج والبرنامج',{fs:10.5,m:1})+tA(435,302,dd?'متوقف — لا طاقة':al?'يوجد إنذار: شغّل المخارج':fl?'عطل: نبّه المسؤول':'مراقبة عادية',{fs:10.5,w:700,fill:dd?'var(--muted)':al?RED:fl?'var(--live)':'var(--on)'});
  // outputs
  const O=[['horn',60,bell,'جرس / بوق الإنذار'],['strobe',135,al,'ضوء وامض'],['fan',210,!al,al?'مراوح التكييف: متوقفة':'مراوح التكييف: تعمل'],['door',285,al||dd,al||dd?'الأبواب: تحررت فانغلقت':'الأبواب: ممسوكة مفتوحة'],['truck',360,al,al?'تم إبلاغ الدفاع المدني':'الدفاع المدني']];
  O.forEach(([k,y,on,ar])=>{const sig=k==='fan'||k==='door'?al:on;s+=`<path d="M528 ${y}H640" class="${wcls(sig)}"/>`+ico(k,675,y,k==='fan'?{on:on,fid:'fanR'}:k==='door'?{open:!al&&!dd}:{on})+tA(675,y+31,ar,{fs:10,m:1,fill:k!=='fan'&&on?RED:undefined})});
  $('#fv').innerHTML=s+'</svg>';
  const zs=S.lat.map((v,i)=>v?'Z'+(i+1):null).filter(Boolean);
  $('#rS').textContent=dd?'مطفأة':al?'إنذار حريق':fl?'عطل':'مراقبة عادية';$('#rS').className='mode-chip '+(dd?'':al?'trip':fl?'warn':'run');
  $('#rZ').textContent=zs.length&&!dd?zs.join(' ، '):'لا شيء';$('#rB').textContent=bell?'يدق':al&&!S.sil?'لا يدق':al?'أُسكت':'صامت';$('#rH').textContent=al?'متوقفة':'تعمل';$('#rP').textContent=S.acf?(dd?'لا شيء':'البطارية'):'120 VAC';
  $('#say').innerHTML=fx(say);
  $('#chk').innerHTML=S.lat[3]&&!dd?`<button class="btn" id="bChk">تحقّق من المنطقة Z4 (اذهب إلى المكان)</button>`:'';
  const c=$('#bChk');if(c)c.onclick=()=>{S.checked=1;w.falseSeen=S.z4?1:w.falseSeen;say=S.z4?'<b>لا يوجد حريق في Z4:</b> بخار (أو غبار) كثيف وصل إلى الكاشف فأطلق الإنذار. هذا <b>إنذار كاذب</b> — «إنذار مع عدم وجود حريق» (ص 115). أزل السبب (أطفئ مفتاح البخار) ثم اضغط «إعادة الضبط».':'لا يوجد في Z4 الآن حريق ولا بخار. اضغط «إعادة الضبط» لتعود اللوحة إلى المراقبة.';render()};
  $('#tres').innerHTML=S.test?`<ul class="s6-tl">${S.test.map(([t,b])=>`<li class="${b?'bad':''}">${t}</li>`).join('')}</ul>`:'';
  gs.check()}
 const tg=(id,k)=>$('#'+id).addEventListener('click',e=>{S[k]=S[k]?0:1;e.currentTarget.setAttribute('aria-pressed',!!S[k]);S.test=null;
   if(k==='cut'){if(S.cut){w.fault=1;S.silF=0;say='<b>عطل في المنطقة Z4:</b> انقطع سلك الكاشف فلم تعد اللوحة «تسمعه». أضاء مصباح «عطل» وصفّرت اللوحة (لا يدق جرس الإنذار، فهذا ليس حريقًا). اضغط «تجربة التوصيلات» لتعرف مكان العطل.'}else say='أُصلح سلك المنطقة Z4 وعادت مراقبتها.'}
   if(k==='acf'&&S.acf&&dead()){w.batt=1;say='<b>انقطعت تغذية اللوحة (120 VAC)</b>.'}
   else if(k==='acf'){if(S.acf){w.batt=1;S.silF=0;say='<b>انقطعت تغذية اللوحة (120 VAC)</b>: انتقلت اللوحة إلى البطارية الاحتياطية وتستمر في العمل، مع تنبيه «عطل» حتى تعود التغذية.'+(alarm()?' لاحظ أن الإنذار ما زال يعمل.':'')}else say='عادت تغذية اللوحة الرئيسية وتُشحن البطارية.'}
   if(k==='z4'&&S.z4&&S.cut)say='يوجد بخار عند كاشف Z4، لكن <b>لا يصل أي إشارة</b> لأن السلك مقطوع: هذه المنطقة غير محمية الآن. لهذا تنبّه اللوحة إلى العطل فورًا.';
   if(k==='z1'&&!S.z1&&S.lat[0])say='انتهى الدخان في Z1، لكن الإنذار <b>يبقى</b> حتى تضغط «إعادة الضبط».';
   if(k==='z2'&&!S.z2&&S.lat[1])say='أُرجع الزر اليدوي إلى وضعه. اضغط «إعادة الضبط» لإنهاء الإنذار.';
   if(!fault())S.silF=0;
   scan();render()});
 tg('e1','z1');tg('e2','z2');tg('e3','z3');tg('e4','z4');tg('ec','cut');tg('ea','acf');
 $('#bSil').addEventListener('click',()=>{if(dead()){say='لا تستجيب اللوحة.';render();return}if(alarm()){S.sil=1;w.sil=1;say='أُسكت الجرس. لاحظ أن مصباح «حريق» ومصباح المنطقة ما زالا مضيئين، والمراوح ما زالت متوقفة: اللوحة ما زالت في حالة إنذار.'}else if(fault()){S.silF=1;say='أُسكتت صفّارة العطل، ومصباح «عطل» يبقى مضيئًا حتى يُصلح العطل.'}else say='لا يوجد ما يُسكت: اللوحة في المراقبة العادية.';render()});
 $('#bRst').addEventListener('click',()=>{if(dead()){say='لا تستجيب اللوحة.';render();return}const had=alarm();S.lat=[0,0,0,0];S.sil=0;S.checked=-1;const nw=scan();
   if(nw>=0){w.reAlarm=1;say='<b>عاد الإنذار فورًا</b> لأن سببه ما زال موجودًا ('+S.lat.map((v,i)=>v?'Z'+(i+1):'').filter(Boolean).join('، ')+'). أزل السبب أولاً ثم أعد الضبط.'}
   else if(had){w.cleared=1;say='أُعيد ضبط اللوحة: انطفأت مصابيح الإنذار، وعادت المراوح تعمل، وعادت الأبواب ممسوكة مفتوحة.'+(fault()?' ما زال هناك عطل يجب إصلاحه.':'')}
   else say='اللوحة أصلاً في المراقبة العادية.';render()});
 $('#bTst').addEventListener('click',()=>{if(dead()){say='لا تستجيب اللوحة.';render();return}S.testT=1.5;S.test=[[chF('zopen')?'دائرة المنطقة Z1: مفتوحة — سلك مقطوع':'دائرة المنطقة Z1: سليمة',chF('zopen')?1:0],['دائرة المنطقة Z2: سليمة',0],['دائرة المنطقة Z3: سليمة',0],[S.cut?'دائرة المنطقة Z4: مفتوحة — سلك مقطوع':'دائرة المنطقة Z4: سليمة',S.cut],[chF('nac')?'دائرة الجرس: مفتوحة — سلك مقطوع أو جرس تالف':'دوائر أجهزة التنبيه (الجرس والضوء): سليمة',chF('nac')?1:0],[S.acf?'التغذية الرئيسية: منقطعة — تعمل على البطارية':'التغذية الرئيسية: موجودة',S.acf]];
   if(chF('batt0')){S.test.push(['البطارية الاحتياطية: جهدها منخفض — لا تصلح',1]);S.bF=1;S.silF=0}
   if(S.cut)w.testCut=1;say='«تجربة التوصيلات الخاصة بالنظام للتأكد من سلامتها وصلاحيتها» (ص 115): أضاءت كل المصابيح لحظة (للتأكد منها)، والنتيجة في القائمة.';render()});
 const gs=stepsUI($('#gs'),[
  {t:'المراقبة العادية',x:'اللوحة تراقب أربع مناطق. مصباح «تغذية» أخضر، ولا إنذار ولا عطل. مراوح التكييف تعمل.'},
  {t:'كاشف دخان يكتشف حريقًا',x:'شغّل «دخان حريق في المنطقة Z1». تابع الإشارة: الكاشف ← اللوحة ← المخارج.',done:w=>w.z[0]},
  {t:'أسكت الجرس',x:'اضغط «إسكات الجرس». يتوقف الجرس فقط، وتبقى بقية المخارج كما هي.',done:w=>w.sil},
  {t:'أعد الضبط والدخان ما زال موجودًا',x:'اضغط «إعادة الضبط» دون أن تطفئ دخان Z1.',done:w=>w.reAlarm},
  {t:'أزل السبب ثم أعد الضبط',x:'أطفئ «دخان حريق في Z1» ثم اضغط «إعادة الضبط».',done:w=>w.cleared&&!S.z1&&!alarm()},
  {t:'الإنذار اليدوي',x:'شغّل «سحب زر الإنذار اليدوي في Z2»: شخص رأى الحريق قبل الكواشف.',done:w=>w.z[1]},
  {t:'إنذار كاذب',x:'أرجع الزر وأعد الضبط، ثم شغّل «بخار أو غبار عند كاشف Z4» واضغط «تحقّق من المنطقة Z4».',done:w=>w.falseSeen},
  {t:'عطل في التوصيلات',x:'أطفئ البخار وأعد الضبط، ثم شغّل «قطع سلك كاشف Z4» واضغط «تجربة التوصيلات».',done:w=>w.testCut},
  {t:'انقطاع التغذية',x:'شغّل «انقطاع تغذية اللوحة»: تنتقل اللوحة إلى البطارية.',done:w=>w.batt}
 ],()=>w);
 let ang=0,last='';
 loopOn(el,dt=>{if(S.testT>0){S.testT-=dt;if(S.testT<=0){S.testT=0;render()}}
  /* كاشف Z4 متسخ (وضع التحدي فقط): ينذر وحده كل بضع ثوانٍ بلا دخان ولا بخار */
  if(chF('dirty')&&!S.lat[3]&&!S.cut&&!dead()){S.dT=(S.dT||0)+dt;if(S.dT>7){S.dT=0;S.dz=1;scan();S.dz=0;render()}}
  if(!alarm()){ang=(ang+dt*400)%360;const f=el.querySelector('#fanR');if(f)f.setAttribute('transform',`rotate(${ang.toFixed(1)})`)}});
 scan();render();
}

/* =====================================================================
   u6-l2 — detector drawings
   ===================================================================== */
/* fig 6-3 (static): spot-type rate-compensation detector */
function fig63(){let s=`<svg viewBox="0 0 560 200" role="img" aria-label="مقطع في كاشف حراري نقطي">`;
 s+=`<rect x="70" y="60" width="380" height="70" rx="10" style="fill:var(--on-soft);stroke:var(--on);stroke-width:2"/><rect x="82" y="70" width="356" height="50" rx="6" style="fill:var(--blue-soft);stroke:var(--blue);stroke-width:1"/>`;
 s+=`<rect x="40" y="62" width="34" height="66" rx="4" style="fill:var(--surface-2);stroke:var(--fg);stroke-width:1.2"/><circle cx="57" cy="82" r="4" style="fill:var(--muted)"/><circle cx="57" cy="108" r="4" style="fill:var(--muted)"/>`;
 s+=`<path d="M74 82Q170 74 250 92" style="fill:none;stroke:${FL1};stroke-width:4"/><path d="M74 108Q170 116 250 98" style="fill:none;stroke:${FL1};stroke-width:4"/><circle cx="252" cy="92" r="4" style="fill:${FL2};stroke:var(--fg)"/><circle cx="252" cy="98" r="4" style="fill:${FL2};stroke:var(--fg)"/>`;
 s+=`<path d="M256 92H440M256 98H440" style="stroke:var(--wire);stroke-width:1.5"/><rect x="440" y="78" width="26" height="34" rx="3" style="fill:var(--surface);stroke:var(--fg)"/><rect x="466" y="84" width="22" height="22" rx="3" style="fill:var(--surface-2);stroke:var(--fg)"/><path d="M488 90H540M488 100H540" style="stroke:var(--on);stroke-width:3"/>`;
 s+=tL(57,52,'Adjusting Screws',{fs:9.5})+tL(57,148,'Sealed End',{fs:9.5})+tL(160,52,'Low Expansion Struts',{fs:9.5})+tL(252,148,'Contact Points',{fs:9.5})+tL(330,52,'Expanding Outer Shell',{fs:9.5})+tL(350,148,'Wall Insulation',{fs:9.5})+tL(453,148,'Glass Beads Hermetic Seal',{fs:9.5})+tL(478,70,'Insulator',{fs:9.5})+tL(515,120,'Electrical Leads',{fs:9.5});
 s+=tL(280,190,'Section of spot type rate compensation detector',{fs:10.5});
 return s+'</svg>'}
/* fig 6-4 — bimetal snap-disk heat detector; k = 0 (cold, disk concave) … 1 (snapped, contacts closed) */
function snapSVG(k,T,Tset){const bY=118-22*k,dY=196-44*k;
 let s=`<svg viewBox="0 0 330 250" role="img" aria-label="كاشف حراري بقرص ثنائي المعدن">`;
 s+=`<path d="M40 40H70V210M290 40H260V210" style="fill:none;stroke:var(--muted);stroke-width:8"/>`;
 s+=`<rect x="64" y="${bY+2}" width="202" height="8" rx="2" style="fill:var(--fg)"/>`;
 s+=`<path d="M70 92h24M260 92h-24" style="stroke:var(--fg);stroke-width:7"/><circle cx="92" cy="86" r="4" style="fill:var(--muted)"/><circle cx="238" cy="86" r="4" style="fill:var(--muted)"/>`;
 s+=`<path d="M165 ${bY}V48" style="stroke:var(--on);stroke-width:2.2;fill:none"/><path d="M165 48 ${[...Array(8)].map((_,i)=>`L${i%2?159:171} ${48+(bY-48)*(i+1)/9}`).join(' ')} L165 ${bY}" style="fill:none;stroke:var(--on);stroke-width:2"/>`;
 s+=`<rect x="160" y="${bY+10}" width="10" height="${Math.max(4,dY-bY-12)}" style="fill:var(--surface-2);stroke:var(--fg);stroke-width:1"/>`;
 s+=`<path d="M100 196Q165 ${dY*2-196} 230 196" style="fill:none;stroke:${RED};stroke-width:5"/><path d="M100 196Q165 ${dY*2-196} 230 196" style="fill:none;stroke:var(--fg);stroke-width:1.5;stroke-dasharray:4 4"/>`;
 s+=`<path d="M30 212H130Q165 222 200 212H300" style="fill:none;stroke:var(--fg);stroke-width:5"/><path d="M30 218H300" style="stroke:var(--blue);stroke-width:3"/>`;
 if(k>0.95)s+=`<circle cx="92" cy="${bY+3}" r="5" style="fill:${FL2};stroke:var(--fg)"/><circle cx="238" cy="${bY+3}" r="5" style="fill:${FL2};stroke:var(--fg)"/>`;
 s+=tL(165,28,'Contact Closing Spring',{fs:9.5})+tL(60,72,'Normally Open',{fs:9})+tL(270,72,'Alarm Contacts',{fs:9})+tL(165,240,'Heat Collector',{fs:9.5})+tL(262,186,'Bi-Metallic',{fs:9})+tL(262,197,'Snap Disk',{fs:9})+tL(62,150,'Nonconducting',{fs:9})+tL(62,161,'Standoff',{fs:9})+`<path d="M95 156H158" style="stroke:var(--muted);stroke-width:1"/>`;
 return s+'</svg>'}
/* fig 6-5 — combination rate-of-rise / fixed temperature; d = diaphragm lift 0…1, melt = eutectic solder melted, air = vent flow 0…1 */
function combSVG(d,melt,air){const dy=150-26*clamp(d,0,1);
 let s=`<svg viewBox="0 0 360 270" role="img" aria-label="كاشف حراري مركب: معدل الارتفاع ودرجة الحرارة الثابتة">`;
 s+=`<path d="M40 30H320" style="stroke:var(--muted);stroke-width:6"/><path d="M60 34H300L240 226H120Z" style="fill:var(--surface-2);stroke:var(--fg);stroke-width:2"/>`;
 s+=`<path d="M80 50H280L262 150H98Z" style="fill:var(--surface);stroke:var(--fg);stroke-width:1.2"/>`;
 s+=`<rect x="76" y="62" width="12" height="7" style="fill:var(--on)"/>`;
 if(air>0.02)for(let i=0;i<3;i++)s+=`<path d="M74 ${62+i*5}h${-10-22*air}" style="stroke:var(--blue);stroke-width:1.6"/><path d="M${64-22*air} ${59+i*5}l-5 3l5 3" style="fill:none;stroke:var(--blue);stroke-width:1.4"/>`;
 s+=`<path d="M180 50V118" style="stroke:var(--fg);stroke-width:4"/><circle cx="180" cy="120" r="4" style="fill:${d>=0.98||melt?FL2:'var(--muted)'};stroke:var(--fg)"/>`;
 s+=`<path d="M98 ${dy}${[...Array(10)].map((_,i)=>`Q${106+i*16.4} ${dy+(i%2?6:-6)} ${114+i*16.4} ${dy}`).join('')}" style="fill:none;stroke:#e0a800;stroke-width:3"/>`;
 const sp0=dy+4,sp1=melt?200:186;
 s+=`<path d="M180 ${sp0}${[...Array(10)].map((_,i)=>`L${i%2?172:188} ${sp0+(sp1-sp0)*(i+1)/11}`).join('')}L180 ${sp1}" style="fill:none;stroke:var(--on);stroke-width:2"/>`;
 s+=`<rect x="168" y="200" width="24" height="10" rx="2" style="fill:${melt?'var(--live-soft)':'var(--muted)'};stroke:var(--fg)"/>`+(melt?tL(180,207,'×',{fs:10,fill:'var(--stop)'}):'');
 s+=`<ellipse cx="180" cy="226" rx="62" ry="9" style="fill:var(--blue);stroke:var(--fg)"/>`;
 s+=tL(54,92,'Vent',{fs:9.5,a:'end'})+tL(232,66,'Alarm Contact (D)',{fs:9.5})+tL(48,152,'Diaphragm (C)',{fs:9.5,a:'end'})+tL(232,192,'Spring (G)',{fs:9.5,a:'start'})+tL(110,214,'Eutectic Solder',{fs:9.5,a:'end'})+tL(180,252,'Fixed Temperature Heat Collector',{fs:9.5});
 s+=tA(330,140,'G وC وD',{fs:9.5,m:1,a:'end'})+tA(330,154,'حروف أضفناها',{fs:9.5,m:1,a:'end'});
 return s+'</svg>'}
/* fig 6-6 — ionisation chamber circuit; I = 0…100 % of clean-air current, n = smoke particles */
function ionSVG(I,n,alarm){const ang=-60+(I/100)*1.6/2*120;
 let s=`<svg viewBox="0 0 320 240" role="img" aria-label="دائرة حجرة التأين">`;
 s+=`<path d="M40 70V40H140M180 40H280V180H210M110 180H40V120" class="w ${I>2?'live':''}" style="stroke-width:2.6"/>`;
 s+=`<path d="M28 98H52M34 106H46M28 114H52" style="stroke:var(--fg);stroke-width:2.4"/><path d="M40 70V98M40 114V120" class="w"/>`;
 s+=`<rect x="130" y="10" width="60" height="50" rx="4" style="fill:var(--surface-2);stroke:var(--fg);stroke-width:1.3"/><path d="M140 48A22 22 0 0 1 180 48" style="fill:none;stroke:var(--muted)"/>`+tL(140,56,'0',{fs:8})+tL(160,30,'1',{fs:8})+tL(181,56,'2',{fs:8});
 s+=`<path d="M160 52L${(160+22*Math.sin(ang*Math.PI/180)).toFixed(1)} ${(52-22*Math.cos(ang*Math.PI/180)).toFixed(1)}" style="stroke:${RED};stroke-width:2"/>`;
 s+=`<rect x="110" y="150" width="100" height="60" rx="4" style="fill:var(--surface);stroke:var(--fg);stroke-width:1.5"/><path d="M110 180H122M198 180H210" style="stroke:var(--fg);stroke-width:3"/>`;
 const ions=[[128,162],[146,172],[168,160],[186,170],[132,192],[154,198],[176,190],[192,200],[140,182],[182,182]];
 ions.forEach(([x,y],i)=>{s+=tL(x,y,i%2?'+':'−',{fs:12,fill:i%2?'var(--stop)':'var(--blue)'})});
 for(let i=0;i<n;i++){const x=122+((i*37)%78),y=158+((i*23)%44);s+=`<circle cx="${x}" cy="${y}" r="5.5" style="fill:var(--muted);opacity:.8"/>`}
 s+=`<path d="M150 222v-8M160 222v-8M170 222v-8" style="stroke:var(--on);stroke-width:1.6"/>`+tL(160,236,'Radioactive Material',{fs:9});
 s+=tL(240,26,I>2?'Current':'',{fs:9.5})+tL(160,140,'Ionization Chamber',{fs:9.5});
 if(alarm)s+=`<circle cx="280" cy="120" r="12" class="s6-blink" style="fill:${RED}"/>`+tA(280,148,'إنذار',{fs:10.5,fill:RED,w:700});
 return s+'</svg>'}
/* fig 6-7 — light obscuration; L = light at sensor % */
function obsSVG(L,n,alarm){let s=`<svg viewBox="0 0 340 200" role="img" aria-label="كاشف دخان ضوئي بحجب الضوء">`;
 s+=`<rect x="14" y="70" width="28" height="40" rx="4" style="fill:var(--muted)"/><rect x="18" y="108" width="20" height="10" style="fill:${RED}"/><path d="M42 90L72 72M42 90L72 108M42 90H72" style="stroke:${FL1};stroke-width:1.6"/>`;
 s+=`<path d="M78 56Q90 90 78 124Q66 90 78 56Z" style="fill:var(--blue-soft);stroke:var(--blue)"/>`;
 const reach=Math.round(7*L/100);
 for(let i=0;i<7;i++){const y=66+i*8,ok=i>=(7-reach)/2&&i<(7+reach)/2;s+=ok?`<path d="M80 ${y}H286" style="stroke:${FL1};stroke-width:1.6"/><path d="M286 ${y-3}l6 3l-6 3z" style="fill:${FL1}"/>`:`<path d="M80 ${y}H${150+i*9}" style="stroke:${FL1};stroke-width:1.6"/><path d="M${150+i*9} ${y}l14 ${i<3?-14:14}" style="stroke:${FL1};stroke-width:1.2;stroke-dasharray:3 2"/>`}
 for(let i=0;i<n;i++)s+=`<circle cx="${130+((i*41)%120)}" cy="${62+((i*17)%58)}" r="3.5" style="fill:var(--muted)"/>`;
 s+=`<rect x="294" y="58" width="20" height="64" rx="3" style="fill:var(--muted)"/><path d="M28 120V150H304V122" style="fill:none;stroke:${RED};stroke-width:1.4;stroke-dasharray:5 4"/>`;
 s+=tL(4,62,'Light Source',{fs:9,a:'start'})+tL(78,48,'Lens',{fs:9})+tL(304,48,'Light Sensor',{fs:9})+tL(190,40,n?'Smoke Particles':'Clear Air',{fs:9.5});
 if(alarm)s+=`<circle cx="304" cy="176" r="10" class="s6-blink" style="fill:${RED}"/>`+tA(270,180,'إنذار',{fs:10.5,fill:RED,w:700});
 return s+'</svg>'}
/* fig 6-8 — light scattering; S = scattered light reaching the sensor % */
function scaSVG(S,n,alarm){let s=`<svg viewBox="0 0 340 220" role="img" aria-label="كاشف دخان ضوئي بتشتت الضوء">`;
 s+=`<path d="M14 50H326V100H226L270 170H238L196 100H14Z" style="fill:var(--surface);stroke:var(--muted);stroke-width:3"/>`;
 s+=`<rect x="18" y="62" width="22" height="26" rx="3" style="fill:var(--muted)"/><rect x="20" y="86" width="18" height="8" style="fill:${RED}"/>`;
 for(let i=0;i<6;i++){const y=54+i*8;s+=`<path d="M40 75L322 ${y}" style="stroke:${FL1};stroke-width:1.2;opacity:.85"/>`}
 const pts=[[120,64],[170,82],[200,60],[150,90],[240,72],[260,88],[100,80],[220,92]];
 for(let i=0;i<n;i++){const [x,y]=pts[i%pts.length];s+=`<circle cx="${x}" cy="${y}" r="3.5" style="fill:var(--fg)"/>`}
 const r=Math.round(S/12);for(let i=0;i<Math.min(r,n);i++){const [x,y]=pts[i%pts.length];s+=`<path d="M${x} ${y}L250 160" style="stroke:${FL1};stroke-width:1.6;stroke-dasharray:4 2"/>`}
 s+=`<rect x="236" y="164" width="34" height="22" rx="4" transform="rotate(-33 253 175)" style="fill:${S>0.5?FL2:'var(--muted)'};stroke:var(--fg)"/>`;
 s+=tL(6,40,'Light Emitting Diode',{fs:9,a:'start'})+tL(290,202,'Light Sensor',{fs:9})+(n?tL(300,124,'Reflected Light',{fs:9}):'');
 if(alarm)s+=`<circle cx="70" cy="170" r="10" class="s6-blink" style="fill:${RED}"/>`+tA(70,198,'إنذار',{fs:10.5,fill:RED,w:700});
 return s+'</svg>'}

function chartT(hist,Tset,T0){const W=320,H=150,X0=36,Y0=128;const tmax=Math.max(5,hist.length?hist[hist.length-1][0]:0);const ymax=Math.max(Tset+20,...hist.map(h=>h[1]))+2,ymin=Math.min(T0-5,0+T0-5);
 const X=t=>X0+(t/tmax)*(W-X0-10),Y=v=>Y0-(v-ymin)/(ymax-ymin)*(Y0-12);
 let s=`<svg viewBox="0 0 ${W} ${H+8}" role="img" aria-label="درجة الحرارة مع الزمن">`;
 s+=`<path d="M${X0} 10V${Y0}H${W-6}" style="fill:none;stroke:var(--muted)"/>`;
 [0,.5,1].forEach(f=>{const v=ymin+f*(ymax-ymin);s+=tL(X0-4,Y(v)+4,f0(v),{fs:9,a:'end',m:1})});
 s+=tL(X0,Y0+14,'0',{fs:9,m:1})+tL(W-10,Y0+14,f0(tmax)+' min',{fs:9,m:1,a:'end'})+tL(X0+4,10,'°C',{fs:9,m:1,a:'start'});
 s+=`<path d="M${X0} ${Y(Tset).toFixed(1)}H${W-6}" style="stroke:var(--stop);stroke-dasharray:5 4"/>`+tL(W-8,Y(Tset)-4,f0(Tset)+' °C',{fs:9,a:'end',fill:'var(--stop)'});
 if(hist.length>1)s+=`<polyline points="${hist.map(h=>X(h[0]).toFixed(1)+','+Y(h[1]).toFixed(1)).join(' ')}" style="fill:none;stroke:var(--live);stroke-width:2.2"/>`;
 return s+'</svg>'}

/* =====================================================================
   LAB u6-l2 — heat detectors (figs 6-4, 6-5) + smoke detectors (figs 6-6 … 6-8)
   ===================================================================== */
function detLab(el){
 const w={bimA:0,bimBack:0,rorFirst:0,fixOnly:0,ionA:0,smallIon:0,obA:0,scA:0,scClean:0};
 el.innerHTML=fx(`<div class="grid s6">
  <div class="c12" id="tpH"></div>
  <div class="panel c12"><h2>الكاشفات الحرارية <small>مبنية على الشكلين (6-4) ص 118 و(6-5) ص 120 — العرض مسرّع: كل ثانية = دقيقة</small></h2>
   <div class="s6-row">${segHTML('hd',[['bim','ثنائي المعدن — الشكل (6-4)'],['comb','معدل الارتفاع + الثابت — الشكل (6-5)']],'bim')}
    <div><div class="sub">درجة الإنذار الثابتة (ص 119: من 57 إلى 82 °C)</div>${segHTML('ts',[[57,'57 °C'],[82,'82 °C']],57)}</div></div>
   <div class="s6-row">${slHTML('rate','سرعة ارتفاع حرارة المكان',1,30,1,10,'°C/min')}
    <div class="pbs">${pbHTML('hOn','red','نار','ابدأ التسخين')}${pbHTML('hOff','blue','برّد','أوقف التسخين')}${pbHTML('hRs','black','↺','من البداية')}</div></div>
   <div class="grid" style="margin-top:6px"><div class="c6"><div class="svgbox" id="hv" style="max-width:380px;margin-inline:auto"></div></div>
    <div class="c6"><div class="svgbox" id="hc"></div><div class="reads" style="margin-inline-start:0;margin-top:6px">
     <div class="read"><span>حرارة المكان</span><b id="hT"></b></div><div class="read"><span>الزمن</span><b id="ht"></b></div><div class="read"><span>الكاشف</span><em class="mode-chip" id="hS"></em></div></div>
     <div id="hP"></div></div></div>
   <div class="callout" id="hSay"></div></div>
  <div class="c12" id="tpS"></div>
  <div class="panel c12"><h2>الكاشفات الدخانية <small>مبنية على الأشكال (6-6) ص 121 و(6-7) ص 121 و(6-8) ص 122</small></h2>
   <div class="s6-row">${segHTML('sd',[['ion','الأيوني — (6-6)'],['obs','الضوئي بحجب الضوء — (6-7)'],['sca','الضوئي بتشتت الضوء — (6-8)']],'ion')}</div>
   <div class="s6-row">${slHTML('dens','كثافة الدخان (نسبية)',0,100,1,0,'%')}
    <div><div class="sub">نوع الدخان (ص 120–121)</div>${segHTML('sz',[['big','مرئي بجسيمات كبيرة'],['small','غير مرئي بجسيمات صغيرة']],'big')}</div></div>
   <div class="grid" style="margin-top:6px"><div class="c7"><div class="svgbox" id="sv" style="max-width:420px;margin-inline:auto"></div></div>
    <div class="c5"><div class="reads" style="margin-inline-start:0"><div class="read"><span id="sQl">القراءة</span><b id="sQ"></b></div><div class="read"><span>حد الإنذار</span><b id="sTh"></b></div><div class="read"><span>الكاشف</span><em class="mode-chip" id="sS"></em></div></div>
     <div class="callout" id="sSay"></div></div></div></div>
  <div class="panel c12"><h2>التجربة خطوة بخطوة</h2><ol class="steps" id="gs"></ol>${tries(['في الكاشف المركب جرّب سرعة تساوي حد معدل الارتفاع تقريبًا: يتأخر الإنذار أو لا يأتي من معدل الارتفاع، فيكمل الجزء الثابت الحماية.','في الكاشف الضوئي بالتشتت: بلا دخان لا يصل ضوء إلى الحساس إطلاقًا، وهذا عكس الكاشف بالحجب.','غيّر درجة الإنذار الثابتة إلى 82 °C ولاحظ تأخر الإنذار.'])}</div>
 </div>`);
 const $=s=>el.querySelector(s);
 const TH=B.params($('#tpH'),'u6-l2-a',[
  {k:'T0',label:'حرارة المكان في البداية',unit:'°C',value:25,min:-10,max:50},
  {k:'Rth',label:'سرعة الارتفاع التي يُطلق عندها جزء «معدل الارتفاع» الإنذار',unit:'°C/min',value:8,min:1,max:25,step:0.5},
  {k:'tau',label:'زمن تسرّب الهواء من فتحة التنفيس',unit:'s',value:30,min:5,max:300},
  {k:'hys',label:'انخفاض الحرارة تحت درجة الإنذار الذي يعود عنده القرص',unit:'°C',value:5,min:1,max:20}],()=>{reset();gs.redraw()});
 const TS=B.params($('#tpS'),'u6-l2-b',[
  {k:'ionTh',label:'الكاشف الأيوني: ينذر إذا هبط التيار تحت (نسبة من تياره في الهواء النقي)',unit:'%',value:70,min:5,max:99},
  {k:'obsTh',label:'الكاشف بالحجب: ينذر إذا هبط الضوء الواصل للحساس تحت',unit:'%',value:80,min:5,max:99},
  {k:'scaTh',label:'الكاشف بالتشتت: ينذر إذا زاد الضوء المنعكس إلى الحساس على',unit:'%',value:15,min:1,max:60},
  {k:'small',label:'حساسية الكاشفين الضوئيين للجسيمات الصغيرة (نسبة من حساسيتهما للكبيرة)',unit:'%',value:15,min:0,max:100}],()=>{sRender();gs.redraw()});
 /* heat model (sim time = 60 × real): dT/dt = rate (heating) or cooling toward T0; chamber over-pressure p: dp = dT − p·dt/τ ; rate alarm when p ≥ Rth·τ/60 */
 let hd='bim',Tset=57,rate=10,heat=0,T=0,p=0,t=0,hist=[],k=0,snap=0,melt=0,ror=0,firstBy='',air=0,lastSig='';
 /* وضع التحدي فقط: Te حرارة عنصر الكاشف (تتأخر عن حرارة المكان إذا كان الكاشف مغطى)، TsD درجة إنذار الكاشف المركَّب فعلاً */
 let Te=0;const cov=()=>chF('hCover'),TsD=()=>chF('h82')?Math.max(Tset,82):Tset;
 function reset(){Te=TH.v.T0;T=TH.v.T0;p=0;t=0;hist=[[0,T]];heat=0;snap=0;melt=0;ror=0;firstBy='';k=0;lastSig='';hSay('اختر الكاشف وسرعة ارتفاع الحرارة، ثم «ابدأ التسخين».')}
 const hSay=h=>{$('#hSay').innerHTML=fx(h)};
 function hRender(){const al=hd==='bim'?snap:(ror||melt);
  $('#hv').innerHTML=hd==='bim'?snapSVG(k,T,Tset):combSVG(melt?1:(TH.v.Rth>0?p/(TH.v.Rth*TH.v.tau/60):0),melt,air);
  $('#hc').innerHTML=chartT(hist,Tset,TH.v.T0);
  $('#hT').textContent=f1(T)+' °C';$('#ht').textContent=f1(t/60)+' min';
  $('#hS').textContent=al?'إنذار — التلامس مغلق':'لا إنذار';$('#hS').className='mode-chip '+(al?'trip':'run');
  const pth=TH.v.Rth*TH.v.tau/60;
  $('#hP').innerHTML=hd==='comb'?`<div class="sub" style="margin-top:8px">ضغط الهواء في الحجرة (يدفع الغشاء C): <b class="ltr">${f0(clamp(p/pth,0,9.99)*100)} %</b> من الضغط اللازم لإغلاق التلامس</div><div style="height:12px;border-radius:99px;background:var(--surface-2);overflow:hidden;direction:ltr;margin-top:4px"><i style="display:block;height:100%;width:${clamp(p/pth,0,1)*100}%;background:${p>=pth?RED:'var(--blue)'}"></i></div>`:''}
 const ctl=()=>{$('#rate').value=rate;$('#rateV').textContent=rate+' °C/min'};
 el.querySelectorAll('[data-hd]').forEach(b=>b.onclick=()=>{hd=b.dataset.hd;segSet(el,'hd',hd);reset();hRender()});
 el.querySelectorAll('[data-ts]').forEach(b=>b.onclick=()=>{Tset=+b.dataset.ts;segSet(el,'ts',Tset);reset();hRender()});
 $('#rate').addEventListener('input',e=>{rate=+e.target.value;ctl()});
 $('#hOn').addEventListener('click',()=>{heat=1;hSay(`تسخين بسرعة <b class="ltr">${rate} °C/min</b>…`)});
 $('#hOff').addEventListener('click',()=>{heat=0;hSay('توقف التسخين: يبرد المكان تدريجيًا.')});
 $('#hRs').addEventListener('click',()=>{reset();hRender()});
 /* smoke model: effective smoke e = density × (optical & small particles ? small% : 1) */
 let sd='ion',dens=0,sz='big';
 function sRender(){const d=chF('sCover')?0:dens/100,eo=d*(sz==='small'?TS.v.small/100:1),n=Math.round(10*d);let al=0,q='',ql='',th='',say='';
  if(sd==='ion'){const I=100*(1-0.6*d);al=I<TS.v.ionTh;ql='التيار في حجرة التأين';q=f0(I)+' %';th='أقل من '+f0(TS.v.ionTh)+' %';$('#sv').innerHTML=ionSVG(I,n,al);
   say=d<0.01?'الهواء نقي: الأيونات (+ و −) تتحرك بين القطبين فيمر تيار ضعيف ثابت — الشكل (6-6) ب.':'الدخان يلتصق بالأيونات فيبطئ حركتها، <b>فيقل التيار</b> — الشكل (6-6) أ. '+(al?'هبط التيار تحت الحد فعملت دائرة الإنذار.':'لم يهبط التيار بعد إلى حد الإنذار.')+(sz==='small'&&d>0?' والكاشف الأيوني «يتحسس الدخان المرئي وغير المرئي» (ص 120).':'');
   if(al)w.ionA=1;if(al&&sz==='small')w.smallIon=1}
  else if(sd==='obs'){const L=100*(1-0.5*eo);al=L<TS.v.obsTh;ql='الضوء الواصل إلى الحساس';q=f0(L)+' %';th='أقل من '+f0(TS.v.obsTh)+' %';$('#sv').innerHTML=obsSVG(L,n,al);
   say=d<0.01?'بلا دخان: كل الأشعة تصل إلى الحساس — الشكل (6-7) أ.':'جسيمات الدخان تقطع جزءًا من الأشعة <b>فيقل الضوء الواصل</b> إلى الحساس — الشكل (6-7) ب. '+(al?'نقص الضوء عن الحد فعمل الإنذار.':'لم ينقص الضوء بعد إلى حد الإنذار.')+(sz==='small'&&d>0?' هذا الكاشف «يتحسس الدخان المرئي والمعلقات الكبيرة» (ص 121)، فالجسيمات الصغيرة تكاد لا تؤثر فيه.':'');if(al)w.obA=1}
  else {const Sv=50*eo+(chF('sDust')?12:0);al=Sv>TS.v.scaTh;ql='الضوء المنعكس إلى الحساس';q=f0(Sv)+' %';th='أكثر من '+f0(TS.v.scaTh)+' %';$('#sv').innerHTML=scaSVG(Sv,n,al);
   say=d<0.01&&chF('sDust')?'لا يوجد دخان.':d<0.01?'هواء نقي: الحساس في فرع جانبي خارج طريق الضوء، <b>فلا يصله ضوء</b> — الشكل (6-8) أ.':'جسيمات الدخان تعكس جزءًا من الضوء إلى الفرع الجانبي <b>فيزيد الضوء الواصل</b> إلى الحساس — الشكل (6-8) ب. '+(al?'زاد الضوء على الحد فعمل الإنذار.':'لم يزد الضوء بعد إلى حد الإنذار.')+(sz==='small'&&d>0?' الجسيمات الصغيرة تعكس ضوءًا قليلاً.':'');
   if(d<0.01)w.scClean=1;if(al&&w.scClean)w.scA=1}
  $('#sQl').textContent=ql;$('#sQ').textContent=q;$('#sTh').textContent=th;$('#sS').textContent=al?'إنذار':'لا إنذار';$('#sS').className='mode-chip '+(al?'trip':'run');$('#sSay').innerHTML=fx(say);gs.check()}
 el.querySelectorAll('[data-sd]').forEach(b=>b.onclick=()=>{sd=b.dataset.sd;segSet(el,'sd',sd);sRender()});
 el.querySelectorAll('[data-sz]').forEach(b=>b.onclick=()=>{sz=b.dataset.sz;segSet(el,'sz',sz);sRender()});
 $('#dens').addEventListener('input',e=>{dens=+e.target.value;$('#densV').textContent=dens+' %';sRender()});
 const gs=stepsUI($('#gs'),[
  {t:'الكاشف ثنائي المعدن',x:()=>`اختر «ثنائي المعدن» واضغط «ابدأ التسخين». عندما تصل الحرارة إلى ${Tset} °C ينقلب القرص فيدفع الجسر ويغلق التلامسين المفتوحين عادة.`,done:w=>w.bimA},
  {t:'يعود وحده',x:()=>`اضغط «أوقف التسخين». عندما تنخفض الحرارة إلى ${f0(Tset-TH.v.hys)} °C يعود القرص إلى شكله فيفتح التلامس: «يعود إلى وضعيته الأصلية تلقائياً» (ص 118).`,done:w=>w.bimBack},
  {t:'حريق سريع وكاشف معدل الارتفاع',x:()=>`اختر الشكل (6-5)، واجعل السرعة أكبر من ${TH.v.Rth} °C/min (مثلاً 20)، ثم «ابدأ التسخين». يتمدد الهواء أسرع مما تصرفه فتحة التنفيس فيرتفع الغشاء ويغلق التلامس <b>قبل</b> أن تصل الحرارة إلى ${Tset} °C.`,done:w=>w.rorFirst},
  {t:'حريق بطيء والجزء الثابت',x:()=>`اضغط «من البداية»، واجعل السرعة أقل من ${TH.v.Rth} °C/min (مثلاً 3)، ثم «ابدأ التسخين». الهواء يخرج من الفتحة فلا يتحرك الغشاء، لكن عند ${Tset} °C ينصهر اللحام فيدفع النابض G الغشاء C إلى التلامس D.`,done:w=>w.fixOnly},
  {t:'الكاشف الأيوني',x:()=>`في الكاشفات الدخانية اختر «الأيوني» وارفع كثافة الدخان: يقل التيار حتى يهبط تحت ${f0(TS.v.ionTh)} % فيعمل الإنذار.`,done:w=>w.ionA},
  {t:'دخان غير مرئي',x:'اختر «غير مرئي بجسيمات صغيرة» مع الكاشف الأيوني وارفع الكثافة حتى الإنذار، ثم جرّب الكاشف بالحجب على الكثافة نفسها.',done:w=>w.smallIon},
  {t:'الكاشف بحجب الضوء',x:()=>`اختر «الضوئي بحجب الضوء» و«مرئي بجسيمات كبيرة» وارفع الكثافة: يقل الضوء الواصل للحساس تحت ${f0(TS.v.obsTh)} % فيعمل الإنذار.`,done:w=>w.obA},
  {t:'الكاشف بتشتت الضوء',x:()=>`اختر «الضوئي بتشتت الضوء» وابدأ بكثافة 0: الحساس مظلم. ارفع الكثافة: يزيد الضوء المنعكس إليه على ${f0(TS.v.scaTh)} % فيعمل الإنذار.`,done:w=>w.scA}
 ],()=>w);
 loopOn(el,dtR=>{const dt=dtR*60;let dT=0;
  if(heat)dT=rate/60*dt;else if(T>TH.v.T0+0.01)dT=(TH.v.T0-T)*dt/120;
  if(dT!==0||heat){T+=dT;t+=dt;
   /* الكاشف المغطى: حرارة عنصره تلحق حرارة المكان ببطء (ثابت زمني 10 دقائق) */
   let dE=dT;if(cov()){const e0=Te;Te+=(T-Te)*(1-Math.exp(-dt/600));dE=Te-e0}
   const TT=cov()?Te:T,TSd=TsD();
   p=Math.max(0,p+dE-p*dt/TH.v.tau);air=clamp(p/(TH.v.Rth*TH.v.tau/60)*0.8,0,1);
   if(!hist.length||t/60-hist[hist.length-1][0]>=0.1){hist.push([t/60,T]);if(hist.length>400)hist.shift()}
   const pth=TH.v.Rth*TH.v.tau/60;
   if(hd==='bim'){if(!snap&&TT>=TSd){snap=1;w.bimA=1;hSay(`<b>إنذار:</b> وصلت الحرارة إلى ${TSd} °C فانقلب القرص من مقعر إلى محدب، ودفع الدبوس العازل جسر التلامس فأغلق التلامسين.`)}
    if(snap&&TT<=TSd-TH.v.hys){snap=0;if(w.bimA){w.bimBack=1}hSay('انخفضت الحرارة فعاد القرص إلى شكله المقعر وانفتح التلامس: الكاشف جاهز من جديد دون أن نغيّر فيه شيئًا.')}}
   else{const r0=ror;ror=p>=pth?1:(p<pth*0.9?0:ror);
    if(ror&&!r0){if(!melt&&T<Tset){w.rorFirst=1;firstBy='ror'}if(cov())hSay('<b>إنذار من جزء «معدل الارتفاع»:</b> ارتفع ضغط الهواء في الحجرة فأغلق الغشاء التلامس.');else hSay(`<b>إنذار من جزء «معدل الارتفاع»</b> والحرارة ${f1(T)} °C فقط (أقل من ${Tset} °C): الهواء في الحجرة تمدد بسرعة أكبر من قدرة فتحة التنفيس على تصريفه، فانضغط الغشاء وأغلق التلامس.`)}
    if(!ror&&r0&&!melt)hSay('انخفض ضغط الهواء في الحجرة فعاد الغشاء: جزء معدل الارتفاع يعود وحده.');
    if(!melt&&TT>=TSd&&!chF('rorOnly')){melt=1;if(!firstBy){firstBy='fix';w.fixOnly=1}hSay(`<b>إنذار من الجزء الثابت:</b> وصلت الحرارة إلى ${TSd} °C فانصهر اللحام، فتمدد النابض G ودفع الغشاء C ليصل التلامس D. ${firstBy==='fix'?'لاحظ أن جزء معدل الارتفاع لم يعمل لأن الحرارة ترتفع ببطء: «يمكنه التنبيه بالحرائق البطيئة الاشتعال» (ص 119).':''}`)}}
   k+= ((hd==='bim'?snap:0)-k)*Math.min(1,dtR*12);
  } else k+=((hd==='bim'?snap:0)-k)*Math.min(1,dtR*12);
  const sig=[f1(T),snap,melt,ror,hd,Math.round(k*20),Math.round(air*10),hist.length].join('|');if(sig!==lastSig){lastSig=sig;hRender();gs.check()}});
 reset();ctl();hRender();sRender();
}

/* =====================================================================
   u6-l3 — fire tetrahedron + class symbols
   ===================================================================== */
const CLS={A:{c:'#1d8a57',sh:'tri',txt:'#fff'},B:{c:RED,sh:'sq',txt:'#fff'},C:{c:'#1c6dd0',sh:'cir',txt:'#fff'},D:{c:'#e0b000',sh:'star',txt:'#3a2a00'},K:{c:'#1c6dd0',sh:'k',txt:'#1c6dd0'}};
function clsSym(L,x,y,r){const o=CLS[L];r=r||18;let s='';
 if(o.sh==='tri')s=`<path d="M${x} ${y-r}L${x+r*1.05} ${y+r*.8}H${x-r*1.05}Z" style="fill:${o.c}"/>`;
 if(o.sh==='sq')s=`<rect x="${x-r*.85}" y="${y-r*.85}" width="${r*1.7}" height="${r*1.7}" style="fill:${o.c}"/>`;
 if(o.sh==='cir')s=`<circle cx="${x}" cy="${y}" r="${r*.9}" style="fill:${o.c}"/>`;
 if(o.sh==='star'){let d='';for(let i=0;i<10;i++){const a=Math.PI/5*i-Math.PI/2,rr=i%2?r*.45:r;d+=(i?'L':'M')+(x+rr*Math.cos(a)).toFixed(1)+' '+(y+rr*Math.sin(a)).toFixed(1)}s=`<path d="${d}Z" style="fill:${o.c}"/>`}
 if(o.sh==='k')s=`<rect x="${x-r*.85}" y="${y-r*.85}" width="${r*1.7}" height="${r*1.7}" rx="3" style="fill:#fff;stroke:${o.c};stroke-width:1.5"/>`;
 return s+`<text x="${x}" y="${y+r*(o.sh==='tri'?.55:.38)}" text-anchor="middle" style="font:800 ${r*(o.sh==='star'?.8:1)}px var(--mono);fill:${o.txt}">${L}</text>`}
function pict(L,x,y){/* simplified pictograms of figs 6-10 … 6-14 */
 let s=`<rect x="${x-26}" y="${y-24}" width="52" height="48" rx="3" style="fill:var(--surface);stroke:${L==='K'?'#1c6dd0':RED};stroke-width:2.5"/>`;
 if(L==='A')s+=`<rect x="${x-12}" y="${y-2}" width="14" height="18" style="fill:var(--fg)"/><path d="M${x+2} ${y+16}l14 -6M${x+2} ${y+12}l16 0" style="stroke:var(--muted);stroke-width:4"/>`+flame(x-4,y-1,.32);
 if(L==='B')s+=`<path d="M${x-16} ${y+2}l10 -14h12v16l-10 6z" style="fill:#1d8a57"/><path d="M${x-2} ${y+10}q10 4 18 6H${x-4}z" style="fill:${FL2}"/>`+flame(x+8,y+14,.3);
 if(L==='C')s+=`<rect x="${x-14}" y="${y-12}" width="22" height="26" rx="3" style="fill:var(--surface-2);stroke:var(--fg)"/><circle cx="${x-3}" cy="${y-4}" r="2" style="fill:var(--fg)"/><circle cx="${x-3}" cy="${y+7}" r="2" style="fill:var(--fg)"/><path d="M${x+8} ${y}q8 0 10 12" style="fill:none;stroke:var(--fg);stroke-width:2"/>`+flame(x-14,y+4,.25)+flame(x+8,y-4,.22);
 if(L==='D')s+=`<path d="M${x-16} ${y+16}h32v-6h-10v-10h10v-6h-32v6h10v10h-10z" style="fill:var(--muted);stroke:var(--fg)"/>`+flame(x,y-6,.25);
 if(L==='K')s+=`<ellipse cx="${x-2}" cy="${y+10}" rx="14" ry="4" style="fill:var(--fg)"/><path d="M${x+12} ${y+9}h12" style="stroke:var(--fg);stroke-width:3"/>`+flame(x-2,y+8,.3);
 return s}
function figClasses(){const L=[['A','(6-10)','ص 127','المواد الصلبة'],['B','(6-11)','ص 127','السوائل والغازات'],['C','(6-12)','ص 128','الأجهزة الكهربائية'],['D','(6-13)','ص 128','المعادن'],['K','(6-14)','ص 129','زيوت المطابخ']];
 let s=`<svg viewBox="0 0 640 150" role="img" aria-label="رموز أنواع الحرائق">`;
 L.forEach(([k,f,p,ar],i)=>{const x=64+i*128;s+=clsSym(k,x-30,52,20)+pict(k,x+24,52)+tL(x,104,f,{fs:10.5})+tA(x,122,ar,{fs:11})+tA(x,140,p,{fs:10,m:1})});return s+'</svg>'}
function tetraSVG(on,lvl){/* on: {fuel,ox,heat,chain} */const A=[190,24],L=[44,236],R=[336,236],F=[214,196];const P=a=>a.map(p=>p.join(',')).join(' ');
 const face=(pts,k,col)=>`<polygon points="${P(pts)}" data-face="${k}" style="cursor:pointer;fill:${on[k]?col:'transparent'};fill-opacity:.32;stroke:${on[k]?'var(--fg)':'var(--muted)'};stroke-width:${on[k]?2:1.2};${on[k]?'':'stroke-dasharray:6 5'}"/>`;
 let s=`<svg viewBox="0 0 380 270" role="img" aria-label="هرم الاشتعال">`;
 s+=`<polygon points="${P([A,L,R])}" data-face="chain" style="cursor:pointer;fill:${on.chain?'var(--live-soft)':'transparent'};stroke:${on.chain?'var(--fg)':'var(--muted)'};stroke-width:${on.chain?2:1.2};${on.chain?'':'stroke-dasharray:6 5'}"/>`;
 s+=face([A,L,F],'ox','#1c9ad0')+face([A,F,R],'heat',RED)+face([L,F,R],'fuel','#8a6d3b');
 if(lvl>0.02)s+=flame(196,190,1.25*lvl,'fl');
 s+=tA(96,130,'الأكسجين',{fs:13,w:700,fill:on.ox?'var(--fg)':'var(--muted)'})+tA(290,130,'الحرارة',{fs:13,w:700,fill:on.heat?'var(--fg)':'var(--muted)'})+tA(190,256,'الوقود',{fs:13,w:700,fill:on.fuel?'var(--fg)':'var(--muted)'})+tA(300,46,'التفاعل المتسلسل',{fs:12,w:700,fill:on.chain?'var(--live)':'var(--muted)'})+`<path d="M246 52L222 70" style="stroke:var(--muted)"/>`;
 return s+'</svg>'}
function fig69(){return tetraSVG({fuel:1,ox:1,heat:1,chain:1},1).replace('</svg>',tL(190,232,'FIRE',{fs:12,fill:'#fff'})+'</svg>')}

/* =====================================================================
   LAB u6-l3 — remove an element; petrol flammability range
   ===================================================================== */
function tetraLab(el){
 const on={fuel:1,ox:1,heat:1,chain:1};let o2=21,lvl=1,pv=1.0,flash=0,lastRes='';
 const w={rm:{},o2out:0,lean:0,ign:0,rich:0,lit:1};
 const M={fuel:['الوقود','<b>تجويع الحريق</b>: نقل المواد القابلة للاشتعال بعيدًا أو سحب السوائل من الصهاريج (ص 132).'],ox:['الأكسجين','<b>خنق الحريق</b>: تغطية الحريق بالرغاوى، أو بغاز ثاني أكسيد الكربون الذي يحل محل الأكسجين، أو بالهالون أو البودرة (ص 132).'],heat:['الحرارة','<b>تبريد الحريق</b>: باستخدام المياه التي تمتص حرارة المواد المشتعلة — الطريقة الأكثر شيوعًا (ص 133).'],chain:['التفاعل الكيميائي المتسلسل','<b>إيقاف التفاعل المتسلسل</b>: البودرة والهالون تمتص الشقوق الطليقة فيتوقف التفاعل (ص 133).']};
 el.innerHTML=fx(`<div class="grid s6">
  <div class="panel c7"><h2>هرم الاشتعال <small>مبني على الشكل (6-9) ص 124 وص 124–126</small></h2>
   <p class="sub">اضغط على أي وجه من وجوه الهرم (أو الأزرار) لتزيل عنصرًا أو تعيده.</p>
   <div class="svgbox" id="tv" style="max-width:380px;margin-inline:auto"></div>
   <div class="s6-sws">${swHTML('kf','الوقود','وقود',1)}${swHTML('ko','الأكسجين','هواء',1)}${swHTML('kh','الحرارة','مصدر اشتعال',1)}${swHTML('kc','التفاعل','التفاعل المتسلسل',1)}</div>
   <div class="s6-row">${slHTML('o2','نسبة الأكسجين في الجو',10,21,0.5,21,'%')}</div></div>
  <div class="panel c5"><h2>حالة الحريق</h2><div class="reads" style="margin-inline-start:0"><div class="read"><span>الحريق</span><em class="mode-chip" id="fS"></em></div><div class="read"><span>الأكسجين</span><b id="fO"></b></div></div>
   <div class="callout" id="fSay"></div>
   <div class="callout">${TIP}طرق الإطفاء الأربع في الدرس التالي (ص 131–133) هي نفسها «إزالة عنصر من الهرم»: يظهر اسم الطريقة هنا كلما أزلت عنصرًا.</div></div>
  <div class="panel c12"><h2>حدود الاشتعال لبنزين السيارات <small>ص 125: الأدنى 1.6 % والأعلى 7 %</small></h2>
   <p class="sub">حرّك نسبة أبخرة البنزين في الخليط، ثم اضغط «شرارة».</p>
   <div class="s6-row">${slHTML('pv','نسبة أبخرة البنزين في الخليط',0,12,0.1,1,'%')}<div class="pbs">${pbHTML('spk','yellow','⚡','شرارة')}</div></div>
   <div class="svgbox" id="pvv" style="max-width:700px;margin-inline:auto"></div><p class="sub" id="pmix" style="text-align:center"></p>
   <div class="callout" id="pSay"></div></div>
  <div class="panel c12"><h2>التجربة خطوة بخطوة</h2><ol class="steps" id="gs"></ol>${tries(['أزل عنصرين معًا ثم أعد واحدًا: يبقى الحريق مطفأ ما دام عنصر واحد ناقصًا.','اجعل البنزين 1.6 % بالضبط ثم 7 % بالضبط: كلاهما خليط قابل للاشتعال كما يقول الكتاب.','لاحظ نسبة الهواء: عند 1.6 % أبخرة يكون الهواء 98.4 %، وعند 7 % يكون 93 % (ص 125).'])}</div>
 </div>`);
 const $=s=>el.querySelector(s);
 const burning=()=>on.fuel&&on.heat&&on.chain&&on.ox&&o2>=16;
 let say='الحريق مشتعل: العناصر الأربعة موجودة، والأكسجين 21 % (نسبته في الجو، ص 125).';
 const SWS={fuel:'kf',ox:'ko',heat:'kh',chain:'kc'};
 function tog(k){on[k]=on[k]?0:1;$('#'+SWS[k]).setAttribute('aria-pressed',!!on[k]);
  if(!on[k]){w.rm[k]=1;say=`أزلت <b>${M[k][0]}</b>: ${burning()?'':'انطفأ الحريق. '}هذه طريقة ${M[k][1]}`}
  else say=burning()?'عادت العناصر الأربعة كلها فعاد الحريق يشتعل.':`أعدت ${M[k][0]}، لكن ما زال عنصر ناقص فلا يشتعل الحريق.`;if(burning())w.lit=1;tRender()}
 Object.entries(SWS).forEach(([k,id])=>$('#'+id).addEventListener('click',()=>tog(k)));
 $('#tv').addEventListener('click',e=>{const f=e.target.closest('[data-face]');if(f)tog(f.dataset.face)});
 $('#o2').addEventListener('input',e=>{const was=burning();o2=+e.target.value;$('#o2V').textContent=o2+' %';
  if(o2<16){if(on.fuel&&on.heat&&on.chain&&on.ox)w.o2out=1;say=`الأكسجين ${o2} %: أقل من 16 %، و«يجب ألا تقل نسبة الأوكسيجين عن 16 % حتى يستمر الحريق» (ص 125) — انطفأ الحريق. وهذه فكرة ${M.ox[1]}`}
  else if(!was&&burning())say='عاد الأكسجين إلى 16 % أو أكثر فعاد الحريق يشتعل.';tRender()});
 function tRender(){$('#tv').innerHTML=tetraSVG(on,lvl);const b=burning();$('#fS').textContent=b?'مشتعل':'مطفأ';$('#fS').className='mode-chip '+(b?'trip':'run');$('#fO').textContent=o2+' %';$('#fSay').innerHTML=fx(say);gs.check()}
 function pRender(){const X=v=>40+v/12*620;let s=`<svg viewBox="0 0 700 115" role="img" aria-label="حدود الاشتعال">`;
  s+=`<rect x="${X(0)}" y="40" width="${X(1.6)-X(0)}" height="30" style="fill:var(--blue-soft)"/><rect x="${X(1.6)}" y="40" width="${X(7)-X(1.6)}" height="30" style="fill:var(--stop-soft)"/><rect x="${X(7)}" y="40" width="${X(12)-X(7)}" height="30" style="fill:var(--surface-2)"/><rect x="${X(0)}" y="40" width="${X(12)-X(0)}" height="30" style="fill:none;stroke:var(--fg)"/>`;
  s+=tA((X(0)+X(1.6))/2,32,'فقير',{fs:11})+tA((X(1.6)+X(7))/2,32,'قابل للاشتعال',{fs:11.5,w:700,fill:'var(--stop)'})+tA((X(7)+X(12))/2,32,'غني',{fs:11});
  [[1.6,'LEL 1.6 %'],[7,'UEL 7 %']].forEach(([v,t])=>{s+=`<path d="M${X(v)} 36V76" style="stroke:var(--stop);stroke-width:2"/>`+tL(X(v),90,t,{fs:10.5,fill:'var(--stop)'})});
  [0,2,4,6,8,10,12].forEach(v=>{s+=tL(X(v),106,v+'%',{fs:9,m:1})});
  s+=`<path d="M${X(pv)} 72l-7 12h14z" style="fill:var(--blue)"/><path d="M${X(pv)} 40V72" style="stroke:var(--blue);stroke-width:3"/>`;
  if(flash>0)s+=`<g style="opacity:${flash.toFixed(2)}">${flame(X(pv),70,.9)}</g>`;
  $('#pvv').innerHTML=s+'</svg>';$('#pmix').innerHTML=`الخليط: أبخرة بنزين ${lt(f1(pv)+' %')} + هواء ${lt(f1(100-pv)+' %')}`}
 $('#pv').addEventListener('input',e=>{pv=+e.target.value;$('#pvV').textContent=f1(pv)+' %';flash=0;pRender()});
 $('#spk').addEventListener('click',()=>{const ok=pv>=1.6-1e-9&&pv<=7+1e-9;
  if(ok){flash=1;w.ign=1;lastRes=`<b>اشتعل الخليط!</b> ${f1(pv)} % أبخرة بنزين مع ${f1(100-pv)} % هواء تقع بين 1.6 % و7 %، و«أي نسبة خلط … تقع بين هذين الرقمين سوف يتكون خليط قابل للاشتعال إذا وجد مصدر للاشتعال لاشتعل» (ص 125).`}
  else if(pv<1.6){w.lean=1;lastRes=`<b>لم يشتعل:</b> ${f1(pv)} % أقل من أدنى مدى للاشتعال (LEL = 1.6 %). الأبخرة قليلة جدًا في الهواء (خليط «فقير»).`}
  else {w.rich=1;lastRes=`<b>لم يشتعل:</b> ${f1(pv)} % أكثر من أعلى مدى للاشتعال (UEL = 7 %). الأبخرة كثيرة والهواء (الأكسجين) قليل (خليط «غني»).`}
  $('#pSay').innerHTML=fx(lastRes)+(ok?'':' <span class="sub">'+TIP+'كلمتا «فقير» و«غني» للتوضيح.</span>');pRender();gs.check()});
 const gs=stepsUI($('#gs'),[
  {t:'حريق مشتعل',x:'العناصر الأربعة موجودة: وقود، وأكسجين، وحرارة، وتفاعل متسلسل — هرم الاشتعال (ص 124).'},
  {t:'أزل الوقود',x:'اضغط وجه «الوقود» (أو مفتاحه). انطفأ الحريق؟ ثم أعده.',done:w=>w.rm.fuel&&on.fuel},
  {t:'قلّل الأكسجين',x:'أنزل نسبة الأكسجين تحت 16 % مع بقاء العناصر الأخرى، ثم أعدها إلى 21 %.',done:w=>w.o2out&&o2>=16},
  {t:'أزل الحرارة',x:'أزل «الحرارة» ثم أعدها.',done:w=>w.rm.heat&&on.heat},
  {t:'أوقف التفاعل المتسلسل',x:'أزل «التفاعل المتسلسل» (الوجه الخلفي للهرم) ثم أعده.',done:w=>w.rm.chain&&on.chain},
  {t:'خليط فقير',x:'في حدود الاشتعال اجعل الأبخرة 1 % واضغط «شرارة».',done:w=>w.lean},
  {t:'خليط قابل للاشتعال',x:'اجعل الأبخرة بين 1.6 % و7 % (مثلاً 4 %) واضغط «شرارة».',done:w=>w.ign},
  {t:'خليط غني',x:'اجعل الأبخرة أكثر من 7 % (مثلاً 10 %) واضغط «شرارة».',done:w=>w.rich}
 ],()=>w);
 let ls='';
 loopOn(el,dt=>{const tg=burning()?1:0;lvl+=(tg-lvl)*Math.min(1,dt*3);if(flash>0)flash=Math.max(0,flash-dt*0.6);
  const f=el.querySelector('#fl');const flick=tg?1+0.06*Math.sin(performance.now()/90):1;
  const sig=Math.round(lvl*30)+'|'+(flash>0?Math.round(flash*20):0);if(sig!==ls){ls=sig;tRender();if(flash>0||sig.endsWith('|0'))pRender()}
  else if(f&&tg){const tr=f.getAttribute('transform').replace(/scale\([^)]*\)/,`scale(${(1.25*lvl*flick).toFixed(3)})`);f.setAttribute('transform',tr)}});
 tRender();pRender();$('#pSay').innerHTML='اختر نسبة ثم اضغط «شرارة».';
}

/* =====================================================================
   u6-l4 — extinguishers, methods, PASS
   ===================================================================== */
function extSVG(kind,x,y,s){s=s||1;/* simple extinguisher: body + gauge(if any) + hose/horn */
 let g=`<g transform="translate(${x} ${y}) scale(${s})"><rect x="-16" y="-40" width="32" height="88" rx="14" style="fill:${RED};stroke:var(--fg);stroke-width:1.2"/><rect x="-7" y="-52" width="14" height="14" style="fill:var(--fg)"/><path d="M-4 -52h26" style="stroke:var(--fg);stroke-width:4"/><path d="M-10 -9h20v22h-20z" style="fill:#fff"/>`;
 if(kind==='co2')g+=`<text x="0" y="6" text-anchor="middle" style="font:700 9px var(--mono);fill:var(--fg)">CO₂</text><path d="M7 -46q24 6 26 40l10 12" style="fill:none;stroke:var(--fg);stroke-width:3"/><path d="M38 0l14 18l-12 4z" style="fill:var(--fg)"/>`;
 else g+=`<text x="0" y="6" text-anchor="middle" style="font:700 9px var(--mono);fill:var(--fg)">${kind==='pow'?'ABC':kind==='h'?'BCF':kind.toUpperCase()}</text><circle cx="0" cy="-26" r="7" style="fill:#fff;stroke:var(--fg)"/><path d="M0 -26l4 -4" style="stroke:#2fb344;stroke-width:2"/><path d="M14 -46q22 10 18 56" style="fill:none;stroke:var(--fg);stroke-width:2.6"/>`;
 return g+'</g>'}
function fig615(){let s=`<svg viewBox="0 0 340 170" role="img" aria-label="طفاية البودرة">`+tL(170,16,'Dry Chemical Extinguisher (ABC)',{fs:11.5,fill:'var(--blue-ink)'});
 s+=extSVG('pow',80,95,1);s+=`<g transform="translate(220 95)"><rect x="-16" y="-40" width="32" height="88" rx="14" style="fill:var(--surface);stroke:${RED};stroke-width:2"/><path d="M-14 0h28v34q0 12 -14 12q-14 0 -14 -12z" style="fill:${FL2}"/><text x="0" y="-18" text-anchor="middle" style="font:700 9px var(--mono);fill:var(--fg)">N↓</text><rect x="-7" y="-52" width="14" height="14" style="fill:var(--fg)"/><circle cx="12" cy="-50" r="6" style="fill:#fff;stroke:var(--fg)"/></g>`;
 s+=tL(282,62,'Will have gauge',{fs:9.5,a:'start'})+tL(270,128,'Fine Powder',{fs:9.5,a:'start'})+tL(130,150,'May have hose',{fs:9.5,a:'start'});return s+'</svg>'}
function fig616(){let s=`<svg viewBox="0 0 340 170" role="img" aria-label="طفاية ثاني أكسيد الكربون">`+tL(170,16,'Carbon Dioxide Extinguisher',{fs:11.5,fill:'var(--blue-ink)'});
 s+=extSVG('co2',90,95,1)+`<path d="M90 70v-16M90 120v16" style="stroke:var(--fg);stroke-width:1.5"/>`+extSVG('co2',240,95,1)+`<path d="M292 112l26 16M292 118l30 6M292 106l22 22" style="stroke:var(--muted);stroke-width:1.5"/>`;
 s+=tL(20,48,'No Gauge',{fs:9.5,a:'start'})+tL(118,156,'Hard Horn (may be on end of hose)',{fs:9.5,a:'start'});return s+'</svg>'}
function methodSVG(miss,word){/* figs 6-17 … 6-19: fire triangle with one side missing */const A=[60,14],L=[14,96],R=[106,96];
 const side=(p,q,k,col,t)=>miss===k?'':`<path d="M${p[0]} ${p[1]}L${q[0]} ${q[1]}" style="stroke:${col};stroke-width:8;stroke-linecap:round"/>`;
 let s=`<svg viewBox="0 0 250 120" role="img" aria-label="${word}"><g transform="translate(10 6)">`+side(A,L,'ox','#1c9ad0')+side(A,R,'heat',RED)+side(L,R,'fuel','var(--fg)');
 s+=(miss!=='ox'?tL(16,46,'OXYGEN',{fs:9,a:'start'}):'')+(miss!=='heat'?tL(104,46,'HEAT',{fs:9,a:'end'}):'')+(miss!=='fuel'?tL(60,112,'FUEL',{fs:9}):'')+`</g>`+tL(190,40,word,{fs:12})+flame(190,96,.75*(1))+`<path d="M160 104h60" style="stroke:var(--muted);stroke-width:3"/>`;
 return s+'</svg>'}
function fig620(){let s=`<svg viewBox="0 0 320 120" role="img" aria-label="حبيبات البودرة توقف التفاعل المتسلسل">`;
 s+=`<ellipse cx="80" cy="60" rx="66" ry="40" style="fill:var(--surface);stroke:var(--fg)"/><path d="M80 20a66 40 0 0 1 0 80z" style="fill:${FL1}"/>`;for(let i=0;i<22;i++)s+=`<circle cx="${24+(i*13)%56}" cy="${30+(i*17)%60}" r="3" style="fill:var(--blue)"/>`;
 s+=`<ellipse cx="240" cy="60" rx="66" ry="40" style="fill:${FL1}"/>`;for(let i=0;i<10;i++){const a=i/10*Math.PI*2;s+=`<path d="M240 60L${(240+30*Math.cos(a)).toFixed(1)} ${(60+22*Math.sin(a)).toFixed(1)}" style="stroke:var(--blue);stroke-width:3"/><circle cx="${(240+30*Math.cos(a)).toFixed(1)}" cy="${(60+22*Math.sin(a)).toFixed(1)}" r="4" style="fill:var(--blue)"/>`}
 return s+'</svg>'}

/* «اختر الطفاية»: scenario × extinguisher → [verdict ok|warn|bad, reason, source] ; source 'ص N' or 'add' */
const SCN=[['A','سلة أوراق وأخشاب مشتعلة','A'],['B','بنزين منسكب يشتعل','B'],['C','لوحة كهربائية ما زالت موصولة بالتيار','C'],['C2','حريق في غرفة أجهزة حاسب','C'],['D','برادة مغنيسيوم تشتعل','D'],['K','زيت طبخ يشتعل في مقلاة','K']];
const EXT=[['water','الماء'],['foam','الرغوة'],['pow','البودرة الجافة ABC'],['co2','ثاني أكسيد الكربون CO₂'],['dpow','البودرة الخاصة بالمعادن'],['wet','الكيميائية الرطبة (للمطابخ K)'],['halon','الهالون']];
const HAL=['warn','الهالون يطفئ بإيقاف التفاعل المتسلسل، لكن «تم إيقاف استخدامها» لضرره بطبقة الأوزون، وتستخدم الآن مواد بديلة.','ص 131'];
const MX={
 A:{water:['ok','الماء من أفضل مواد إطفاء حرائق المواد الصلبة، ويطفئ بالتبريد.','ص 127'],foam:['ok','الرغوة تحتوي ماءً فتبرد وتغطي سطح المواد الصلبة.','add'],pow:['ok','«كذلك بعض طفايات البودرة الجافة نوع (ABC)».','ص 127'],co2:['warn','الغاز يطرد الأكسجين لحظة ثم يتبدد ولا يبرد الجمر، فقد يعود الاشتعال في الخشب والورق.','add'],dpow:['warn','هذه البودرة مخصصة لحرائق المعادن، وليست الاختيار المناسب للمواد الصلبة العادية.','add'],wet:['warn','مخصصة لزيوت المطابخ؛ تطفئ النار الصغيرة في الورق لكنها ليست طفاية هذا النوع.','add'],halon:HAL},
 B:{water:['bad','«لا يفضل استخدام الماء … حيث يتسبب في زيادة انتشار الحريق»: يطفو البنزين المشتعل فوق الماء وينتشر معه.','ص 127'],foam:['ok','الرغاوى من أفضل مواد إطفاء حرائق السوائل: تغطي السطح فتخنق الحريق.','ص 127'],pow:['ok','البودرة من مواد إطفاء النوع B.','ص 127'],co2:['ok','ثاني أكسيد الكربون من مواد إطفاء النوع B: يحل محل الأكسجين.','ص 127'],dpow:['warn','مخصصة لحرائق المعادن.','add'],wet:['warn','مخصصة لزيوت المطابخ، وليست لحرائق البنزين.','add'],halon:HAL},
 C:{water:['bad','«لا يستخدم الماء … على الإطلاق … حيث أن الماء موصل جيد للكهرباء لذلك من الممكن أن يتسبب في صعق الشخص المستعمل للطفاية».','ص 128'],foam:['bad','الرغاوى تحتوي ماءً، فلا تستخدم «على الإطلاق» في حرائق الكهرباء: خطر الصعق.','ص 128'],pow:['ok','البودرة نوع ABC تستخدم لإطفاء حرائق الأجهزة الكهربائية.','ص 128'],co2:['ok','ثاني أكسيد الكربون يستخدم لإطفاء حرائق الأجهزة الكهربائية.','ص 128'],dpow:['warn','مخصصة لحرائق المعادن.','add'],wet:['bad','محلول مائي يوصل الكهرباء: خطر الصعق.','add'],halon:HAL},
 C2:{water:['bad','الماء موصل للكهرباء: خطر الصعق، ويتلف الأجهزة.','ص 128'],foam:['bad','الرغاوى تحتوي ماءً: خطر الصعق.','ص 128'],pow:['warn','«لا يفضل استخدام طفايات البودرة في … الأجهزة الكهربائية الحساسة مثل أجهزة الكومبيوتر حيث أن جزيئات البودرة قد تتسبب في تلف هذه الأجهزة».','ص 129'],co2:['ok','ثاني أكسيد الكربون لا يوصل الكهرباء، وغاز لا يترك أثرًا على الأجهزة.','ص 128'],dpow:['warn','مخصصة لحرائق المعادن، وتترك مسحوقًا يتلف الأجهزة.','add'],wet:['bad','محلول مائي يوصل الكهرباء: خطر الصعق.','add'],halon:HAL},
 D:{water:['bad','الماء يتفاعل بعنف مع المعادن المشتعلة (مثل الصوديوم والمغنيسيوم) فيزيد الحريق وقد يسبب انفجارًا.','add'],foam:['bad','تحتوي ماءً، فخطرها مثل خطر الماء على المعادن المشتعلة.','add'],pow:['warn','الكتاب يذكر لحرائق المعادن «نوعًا خاصًا من البودرة الجافة»، وبودرة ABC العادية ليست هي.','ص 128'],co2:['bad','المغنيسيوم المشتعل يستمر في التفاعل مع ثاني أكسيد الكربون، فلا يطفئه وقد يزيده.','add'],dpow:['ok','«يستعمل نوع خاص من البودرة الجافة لإطفاء هذا النوع من الحرائق».','ص 128'],wet:['bad','تحتوي ماءً: خطر على المعادن المشتعلة.','add'],halon:['warn','ليست لحرائق المعادن، وأوقف استخدامها أصلاً (ص 131).','add']},
 K:{water:['bad','الماء يغلي فجأة تحت الزيت الساخن فيقذف الزيت المشتعل ويوسع الحريق.','add'],foam:['warn','ليست المخصصة لزيوت المطابخ، وقد يعود الاشتعال لأن الزيت يبقى ساخنًا جدًا.','add'],pow:['warn','قد تخمد اللهب لحظة، لكن الزيت يبقى ساخنًا فيعود الاشتعال.','add'],co2:['warn','قد يدفع الزيت المشتعل خارج المقلاة، ولا يبرد الزيت فيعود الاشتعال.','add'],dpow:['warn','مخصصة لحرائق المعادن.','add'],wet:['ok','طفاية المطابخ (يسميها الكتاب «البودرة السائلة للمطابخ» ص 129): ترش محلولاً يكوّن على سطح الزيت طبقة عازلة تشبه الصابون ويبرّده، فلا يعود الاشتعال.','add'],halon:HAL}};
const VERD={ok:'مناسبة',warn:'غير مفضلة / محدودة',bad:'خطرة — ممنوعة'};
const srcTag=s=>s==='add'?'<span class="s6-chip add">إضافة من خارج الكتاب</span>':`<span class="s6-chip">${s}</span>`;
function miniCls(L){return `<svg viewBox="0 0 40 40" width="34" height="34" aria-hidden="true">${clsSym(L,20,21,16)}</svg>`}

function extLab(el){
 let sc='A',ex='',dist=6,wind='back',pin=0,aim='high',sq=0,sweep=0,fire=1,agent=1,ordered=0,ordIdx=0,sw=0,lastMsg='';
 const w={tries:{},okPick:0,badPick:0,ordered:0,pos:0,pin:0,aim:0,out:0,high:0};
 const ORD=[['P','<b>P</b>ULL — اسحب مسمار الأمان'],['A','<b>A</b>IM — وجّه الخرطوم إلى قاعدة الحريق'],['S1','<b>S</b>QUEEZE — اضغط على المفتاح (الذراع)'],['S2','<b>S</b>WEEP — حرّك الطفاية من جانب لآخر']];const MIXO=[2,0,3,1];
 el.innerHTML=fx(`<div class="grid s6">
  <div class="panel c12"><h2>اختر الطفاية <small>مبني على ص 127–131</small></h2>
   <p class="sub">١) اختر الحريق. ٢) اختر الطفاية. ستعرف هل هي مناسبة أو غير مفضلة أو خطرة، ولماذا، ومن أين جاء الحكم: من الكتاب (برقم الصفحة) أو <span class="s6-chip add">إضافة من خارج الكتاب</span>.</p>
   <h3 class="sm">الحريق</h3><div class="s6-cards" id="scs"></div>
   <h3 class="sm" style="margin-top:10px">الطفاية</h3><div class="s6-cards" id="exs"></div>
   <div id="xres"></div></div>
  <div class="c12" id="tpX"></div>
  <div class="panel c12"><h2>طريقة PASS لاستعمال الطفاية <small>ص 134 والقواعد العامة ص 133</small></h2>
   <p class="sub">أولاً رتّب الخطوات الأربع، ثم استعمل الطفاية (بودرة ABC على حريق من النوع A).</p>
   <div class="s6-ord" id="ord"></div><div class="sub" id="ordMsg" style="margin-top:6px"></div>
   <div id="sim" style="margin-top:10px">
    <div class="s6-row">${slHTML('dst','بعدك عن الحريق',1,8,0.5,6,'m')}<div><div class="sub">اتجاه الريح</div>${segHTML('wd',[['back','الريح من خلفك'],['face','الريح في وجهك']],'back')}</div><div><div class="sub">التوجيه</div>${segHTML('aim',[['high','أعلى اللهب'],['base','قاعدة الحريق']],'high')}</div></div>
    <div class="s6-row"><div class="pbs">${pbHTML('pp','black','P','اسحب المسمار')}${pbHTML('sqz','red','S','اضغط الذراع (استمر)')}</div>${swHTML('swp','S','حرّك يمينًا ويسارًا',0)}<button class="btn" id="xr">طفاية جديدة وحريق جديد</button></div>
    <div class="svgbox" id="xv" style="max-width:640px;margin-inline:auto"></div>
    <div class="reads" style="margin-inline-start:0"><div class="read"><span>الحريق</span><b id="xF"></b></div><div class="read"><span>ما بقي في الطفاية</span><b id="xA"></b></div><div class="read"><span>المسمار</span><b id="xP"></b></div></div>
    <div class="callout" id="xSay"></div></div></div>
  <div class="panel c12"><h2>التجربة خطوة بخطوة</h2><ol class="steps" id="gs"></ol>${tries(['جرّب الماء على لوحة كهربائية موصولة وعلى زيت المقلاة: اقرأ سبب الخطر في كل حالة.','في PASS قف على بعد 1 m ثم 8 m ولاحظ الفرق، ثم اجعل الريح في وجهك.','صوّب على أعلى اللهب وأنت تضغط: تفرغ الطفاية والحريق باقٍ تقريبًا.'])}</div>
 </div>`);
 const $=s=>el.querySelector(s);
 const TP=B.params($('#tpX'),'u6-l4',[{k:'dur',label:'زمن تفريغ الطفاية كاملة عند الضغط المستمر',unit:'s',value:15,min:4,max:60},{k:'kill',label:'زمن إطفاء الحريق إذا استُعملت الطفاية بالطريقة الصحيحة',unit:'s',value:6,min:1,max:60}],()=>{xRender();gs.redraw()});
 function cards(){$('#scs').innerHTML=SCN.map(([k,t,L])=>`<button class="s6-card" data-sc="${k}" aria-pressed="${k===sc}">${miniCls(L)}<span>${t}<br><small class="sub">النوع ${L}</small></span></button>`).join('');
  $('#exs').innerHTML=EXT.map(([k,t])=>{const v=ex===k?MX[sc][k][0]:'';return `<button class="s6-card ${v}" data-ex="${k}" aria-pressed="${k===ex}">${t}</button>`}).join('');
  if(ex){const [v,r,s]=MX[sc][ex];$('#xres').innerHTML=fx(`<div class="s6-res ${v}"><b>${EXT.find(e=>e[0]===ex)[1]} على «${SCN.find(s=>s[0]===sc)[1]}»: ${VERD[v]}.</b> ${r} ${srcTag(s)}</div>`)}else $('#xres').innerHTML='<div class="s6-res">اختر طفاية.</div>';
  el.querySelectorAll('[data-sc]').forEach(b=>b.onclick=()=>{sc=b.dataset.sc;ex='';cards()});
  el.querySelectorAll('[data-ex]').forEach(b=>b.onclick=()=>{ex=b.dataset.ex;const v=MX[sc][ex][0];w.tries[sc+ex]=1;if(v==='ok')w.okPick++;if(v==='bad')w.badPick++;cards();gs.check()})}
 function ordUI(){$('#ord').innerHTML=MIXO.map(i=>{const d=i<ordIdx;return `<button data-o="${i}" class="${d?'done':''}">${d?(i+1)+'. ':''}${ORD[i][1]}</button>`}).join('');
  el.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>{const i=+b.dataset.o;if(i<ordIdx)return;if(i===ordIdx){ordIdx++;$('#ordMsg').innerHTML=ordIdx===4?'<b style="color:var(--on)">أحسنت: P ثم A ثم S ثم S.</b> الآن استعمل الطفاية في المحاكاة.':'صحيح. ما الخطوة التالية؟';if(ordIdx===4){ordered=1;w.ordered=1}ordUI();gs.check()}
   else{b.classList.add('no');$('#ordMsg').innerHTML='ليست هذه الخطوة التالية. '+(ordIdx===0?'لا يمكن فعل شيء قبل نزع مسمار الأمان: هو الذي يقفل الذراع.':ordIdx===1?'قبل الضغط وجّه الخرطوم أولاً، حتى لا تضيع المادة.':'');setTimeout(()=>b.classList.remove('no'),600)}})}
 const eff=()=>{if(!pin||!sq||agent<=0)return 0;let e=1;if(aim!=='base')e*=0.12;if(!sweep)e*=0.5;if(wind!=='back')e*=0.2;if(dist>5)e*=0.3;else if(dist<3)e*=0.6;return e};
 function xRender(){const px=560-dist*55,on=pin&&sq&&agent>0;const nz=[px+34,198];const ay=aim==='base'?226:150+0*sw;const ax=545+(sweep?14*Math.sin(sw):0);
  let s=`<svg viewBox="0 0 640 250" role="img" aria-label="استعمال الطفاية">`;
  s+=`<path d="M0 238H640" style="stroke:var(--muted);stroke-width:2"/>`;
  [3,5].forEach(d=>{const x=560-d*55;s+=`<path d="M${x} 238v8" style="stroke:var(--on);stroke-width:2"/>`+tL(x,232,d+' m',{fs:9.5,fill:'var(--on)'})});
  s+=`<path d="M${560-5*55} 243H${560-3*55}" style="stroke:var(--on);stroke-width:4"/>`;
  const wx=wind==='back'?1:-1;s+=`<g transform="translate(${wind==='back'?40:600} 30)"><path d="M0 0h${wx*60}M${wx*60} 0l${-wx*10} -6M${wx*60} 0l${-wx*10} 6" style="stroke:var(--blue);stroke-width:2.5;fill:none"/></g>`+tA(wind==='back'?70:570,56,'الريح',{fs:11,fill:'var(--blue)'});
  // person
  s+=`<g transform="translate(${px} 0)"><circle cx="0" cy="128" r="12" style="fill:var(--surface-2);stroke:var(--fg);stroke-width:1.5"/><path d="M0 140V196M0 196l-12 42M0 196l12 42M0 156l26 26" style="stroke:var(--fg);stroke-width:3;fill:none"/></g>`;
  s+=extSVG('pow',px-18,200,.55);
  if(pin)s+=`<path d="M${px-10} 165l-10 -6" style="stroke:var(--muted);stroke-width:2"/>`;else s+=`<circle cx="${px-14}" cy="171" r="3.5" style="fill:none;stroke:#e0a800;stroke-width:2"/>`;
  s+=`<path d="M${px-8} 178Q${px+20} 196 ${nz[0]} ${nz[1]}" style="fill:none;stroke:var(--fg);stroke-width:2.5"/>`;
  if(on)s+=`<path d="M${nz[0]} ${nz[1]-3}L${ax} ${ay-14}L${ax} ${ay+10}L${nz[0]} ${nz[1]+3}Z" style="fill:var(--surface-2);stroke:var(--muted);opacity:.85"/>`;
  if(fire>0.01)s+=flame(545,236,0.35+1.1*fire);else s+=tA(545,220,'انطفأ',{fs:13,w:700,fill:'var(--on)'});
  s+=`<rect x="505" y="232" width="80" height="6" style="fill:var(--fg)"/>`;
  $('#xv').innerHTML=s+'</svg>';
  $('#xF').textContent=fire>0.01?f0(fire*100)+' %':'مطفأ';$('#xA').textContent=f0(agent*100)+' %';$('#xP').textContent=pin?'مسحوب':'في مكانه'}
 function msg(){let m='';
  if(!ordered)m='رتّب خطوات PASS أولاً (الأزرار في الأعلى) — يمكنك أيضًا التجريب مباشرة.';
  if(fire<=0.01)m='<b>انطفأ الحريق.</b> «لا تترك مكان الحريق قبل التأكد من إطفائه تماماً» (ص 133).';
  else if(sq&&!pin)m='الذراع مقفل: <b>اسحب مسمار الأمان أولاً (P)</b> — «this unlocks the lever».';
  else if(sq&&agent<=0)m='<b>فرغت الطفاية</b> والحريق باقٍ. اضغط «طفاية جديدة وحريق جديد» وجرّب بالطريقة الصحيحة.';
  else if(sq){const p=[];if(aim!=='base')p.push('أنت توجّه إلى أعلى اللهب: «وجّه الخرطوم إلى قاعدة الحريق» (A)');if(!sweep)p.push('حرّك الطفاية من جانب لآخر (SWEEP)');if(wind!=='back')p.push('الريح في وجهك: «يجب أن تكافح الحريق مع اتجاه الريح وليس عكسها» (ص 133)');if(dist>5)p.push('أنت بعيد: المادة تضعف قبل أن تصل');if(dist<3)p.push('أنت قريب جدًا من النار: ابتعد إلى 3–5 أمتار (ص 133)');m=p.length?'الحريق لا يخمد جيدًا: '+p.join('؛ ')+'.':'<b>ممتاز:</b> المادة تصل إلى قاعدة الحريق وأنت تحرك الطفاية والريح من خلفك — الحريق يخمد.'}
  else if(pin)m='المسمار مسحوب. وجّه إلى قاعدة الحريق ثم اضغط الذراع واستمر.';
  else if(dist>=3&&dist<=5&&wind==='back')m='مكانك صحيح: بين 3 و5 أمتار والريح من خلفك. اسحب المسمار.';
  else m='قف على بعد 3–5 أمتار من الحريق، والريح من خلفك (القواعد العامة ص 133).';
  if(m!==lastMsg){lastMsg=m;$('#xSay').innerHTML=fx(m)}}
 $('#dst').addEventListener('input',e=>{dist=+e.target.value;$('#dstV').textContent=dist+' m';if(dist>=3&&dist<=5&&wind==='back')w.pos=1});
 el.querySelectorAll('[data-wd]').forEach(b=>b.onclick=()=>{wind=b.dataset.wd;segSet(el,'wd',wind);if(dist>=3&&dist<=5&&wind==='back')w.pos=1});
 el.querySelectorAll('[data-aim]').forEach(b=>b.onclick=()=>{aim=b.dataset.aim;segSet(el,'aim',aim);if(aim==='base'&&pin)w.aim=1});
 $('#pp').addEventListener('click',()=>{pin=1;w.pin=1});
 const sqb=$('#sqz');const down=e=>{e.preventDefault();sq=1;sqb.classList.add('down')},up=()=>{sq=0;sqb.classList.remove('down')};
 sqb.addEventListener('pointerdown',down);['pointerup','pointerleave','pointercancel'].forEach(t=>sqb.addEventListener(t,up));sqb.addEventListener('keydown',e=>{if(e.key===' '||e.key==='Enter'){sq=1}});sqb.addEventListener('keyup',up);
 $('#swp').addEventListener('click',e=>{sweep=sweep?0:1;e.currentTarget.setAttribute('aria-pressed',!!sweep)});
 $('#xr').addEventListener('click',()=>{fire=1;agent=1;pin=0;sq=0});
 const gs=stepsUI($('#gs'),[
  {t:'طفاية مناسبة',x:'اختر حريقًا ثم طفاية «مناسبة» له.',done:w=>w.okPick>0},
  {t:'طفاية خطرة',x:'اختر الماء على «لوحة كهربائية موصولة» أو على «زيت طبخ في مقلاة» واقرأ السبب.',done:w=>w.badPick>0},
  {t:'رتّب PASS',x:'رتّب الخطوات الأربع: P ثم A ثم S ثم S.',done:w=>w.ordered},
  {t:'خذ مكانك',x:'اجعل بعدك بين 3 و5 أمتار، والريح من خلفك.',done:w=>w.pos},
  {t:'P: اسحب المسمار',x:'اضغط «اسحب المسمار».',done:w=>w.pin},
  {t:'A: صوّب على القاعدة',x:'اختر «قاعدة الحريق» في التوجيه.',done:w=>w.aim||(w.pin&&aim==='base')},
  {t:'S وS: اضغط وحرّك',x:()=>`شغّل «حرّك يمينًا ويسارًا» ثم اضغط زر الذراع واستمر حتى ينطفئ الحريق (بالقيم الحالية نحو ${f0(TP.v.kill)} ثوانٍ من الضغط الصحيح، والطفاية تفرغ في ${f0(TP.v.dur)} ثانية).`,done:w=>w.out}
 ],()=>w);
 let lsig='';
 loopOn(el,dt=>{if(sweep)sw+=dt*5;
  if(pin&&sq&&agent>0){agent=Math.max(0,agent-dt/TP.v.dur);const e=eff();fire=Math.max(0,fire-e*dt/TP.v.kill);if(aim!=='base')w.high=1}
  else if(fire>0.01&&fire<1)fire=Math.min(1,fire+dt*0.02);
  if(fire<=0.01&&w.pin){fire=0;w.out=1}
  const sig=[dist,wind,aim,pin,sq,sweep?Math.round(sw*4):0,Math.round(fire*200),Math.round(agent*200)].join('|');if(sig!==lsig){lsig=sig;xRender();msg();gs.check()}});
 cards();ordUI();xRender();msg();
}

/* ---------- unit questions (ص 135) ---------- */
const QS=[
 ['س1: ماذا يقصد بأنظمة إنذار الحريق؟ وما أنواعه؟','وسيلة إعلان وإخطار عن الحريق داخل المباني والمنشآت، تُعلم الأشخاص المتواجدين وتنذرهم بمجرد وقوع الحريق حتى يغادروا قبل أن تمتد النيران (ص 114). أنواعه: <b>نظام الإنذار اليدوي</b> (البسيط كالأجراس التي تدق يدويًا، والكهربائي بالأزرار أو بشبكة اتصال داخلية)، و<b>نظام الإنذار الآلي</b> الذي يكشف الحريق بتحسس آثاره (ص 114).'],
 ['س2: ما الهدف الرئيس من استخدام أنظمة إطفاء الحريق؟','الوحدة لا تشرح «أنظمة إطفاء» ثابتة (انظر الملاحظة أدناه). من نص الوحدة: الهدف إنقاذ أرواح الأشخاص المتواجدين وحفظ الممتلكات، والسيطرة على الحريق وإخماده في أسرع وقت بأقل الخسائر (ص 114 وص 123).'],
 ['س3: ما المكونات الأساسية لنظام الإنذار من الحريق؟','يقول الكتاب إنه يتكون من خمسة عناصر رئيسة ويكتفي بوحدة التحكم الرئيسية وعناصر الإدخال (ص 114). من الشكلين (6-1) و(6-2): لوحة التحكم، وأجهزة البدء (كواشف الدخان ونقاط الإنذار اليدوي ومفاتيح تدفق الماء)، وأجهزة التنبيه الصوتي والضوئي، ووسائل التحكم في الطوارئ (مراوح التكييف والأبواب)، والربط مع الدفاع المدني، ومعها لوحة المفاتيح ولوحة البيان والطابعة.'],
 ['س4: ما الشروط الواجب توافرها في مكان لوحة التحكم (للإنذار عن الحريق)؟','مكان قليل الخطر بالنسبة للحريق؛ درجة حرارته معتدلة، مرتب وجيد التهوية؛ فيه أجهزة كشف وإنذار؛ في الدور الأرضي سهل الدخول والخروج وفي مكان متوسط وأقرب ما يمكن للخروج؛ مأهول وإلا حُوّلت الإشارات إلى مكان مأهول؛ وإذا كان في مكان عام فبقفل. ويُثبت قربها مخطط إرشادي للمناطق ومخارج الطوارئ وأماكن الطفايات (ص 116).'],
 ['س5: عدِّد أنواع أجهزة الكشف الآلي ذات الرؤوس الكاشفة.','كاشفات الحريق (اللهب)، والكاشفات الحرارية، والكاشفات الدخانية (ص 116–122).'],
 ['س6: ما العوامل التي تؤثر على أداء جهاز كشف الحريق (اللهب)؟','أشعة الشمس (ويمكن عمل تدابير لتفادي تأثره بها)، والبرق، وأشعة إكس، والكشافات القوية (ص 117).'],
 ['س7: عدِّد أنواع الكاشفات الحرارية.','الصنف الأول: ذو الدرجة الحرارية الثابتة (الثرموستات ذات الصفيحة المزدوجة، وذات القرص سريع الحركة، والخطي). الصنف الثاني: كاشف معدل تغير درجة الحرارة. الصنف الثالث: ذو درجة الحرارة الثابتة وسرعة محددة لارتفاعها (ص 117–119).'],
 ['س8: ما العوامل التي تؤثر على أداء جهاز كشف الحريق؟','السؤال يكاد يكرر س6؛ والأقرب أن المقصود كاشف <b>الحرارة</b> (ص 120): ارتفاع درجة حرارة المكان أو انخفاضها الشديد بسبب وسيلة تدفئة، وارتفاع السقف، وعدم إعطاء إنذار عند الحرائق التي تنتشر ببطء شديد.'],
 ['س9: عدِّد أنواع الكاشفات الدخانية.','الأيوني، والكهربائي الضوئي (بحجب الضوء)، والذي يعمل بالضوء المنعكس (يسميه الكتاب «بتأثير الأمواج الإشعاعية»)، وذو الحساسات «الاختيارية» أي كواشف سحب الهواء بالأنابيب (ص 120–122).'],
 ['س10: ما العوامل التي تؤثر على أداء جهاز كشف الدخان؟','الأبخرة أو الغبار، والتدخين المفرط، وارتفاع السقف، وأبخرة الدهان أو المنظفات أو المواد الكيميائية، والأماكن المفتوحة الخارجية (ص 122).']];

/* =====================================================================
   LESSONS
   ===================================================================== */
B.lesson({
 id:'u6-l1',unit:6,order:1,pages:'114–116',
 title:'أنظمة الإنذار ولوحة التحكم',
 summary:'إنذار الحريق يدويًا أو آليًا: الكواشف ونقاط الإنذار ترسل إشارتها إلى لوحة التحكم، واللوحة تدق الأجراس وتشغّل التنبيه وتتحكم في التكييف والأبواب، وتنبّه إلى العطل والإنذار الكاذب.',
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
})())/*DCML-END*/,(window.SFA=window.SFA||(function(){
/* رسومات المحطات في مقرر السلامة الصناعية: خلفية الرسم فاتحة في الوضعين، فنثبّت ألوان الوضع الفاتح داخل الرسم،
   ونضمّن أشكال الدرس نفسها (دوال الشكل في ملف الوحدة) بدل إعادة رسمها. نسخة مطابقة في أول درس من كل ملف وحدة. */
const PAL='--fg:#14231c;--muted:#5a6b62;--surface:#ffffff;--surface-2:#e8f0ec;--line:#cfdcd5;--blue:#12855A;--blue-ink:#0d6b47;--blue-soft:#dcf1e6;--live:#d9801a;--live-soft:#fbe8cf;--on:#1d9460;--on-soft:#d7f0e3;--stop:#c8372d;--stop-soft:#f8dcd9;--wire:#a6b5be;--ink-dim:#c3ced5;--lamp-off:#dfe5e9';
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const art=(aria,body,bg)=>`<svg viewBox="0 0 360 320" role="img" aria-label="${esc(aria)}" style="font-family:var(--font);${PAL}" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="${bg||'#DDEFE6'}"/>${body}</svg>`;
const hot=(x,y,w,h,tip)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="transparent" data-tip="${esc(tip)}"/>`;
/* يضمّن شكلاً من أشكال الدرس: crop = الجزء المعروض منه [x,y,w,h]، dest = مكانه في الرسم [x,y,w,h] */
const emb=(svg,crop,dest)=>String(svg).replace(/^\s*<svg[^>]*>/,`<svg x="${dest[0]}" y="${dest[1]}" width="${dest[2]}" height="${dest[3]}" viewBox="${crop.join(' ')}" preserveAspectRatio="xMidYMid meet">`);
/* نص عربي في الرسم: كل مقطع لاتيني أو رقمي في tspan مستقل باتجاه LTR */
const ar=(x,y,t,o)=>{o=o||{};return `<text x="${x}" y="${y}" text-anchor="${o.a||'middle'}" direction="rtl" font-size="${o.fs||13}" font-weight="${o.w||600}" fill="${o.c||'#14231c'}" style="font-family:var(--font)">${String(t).replace(/([A-Za-z0-9][A-Za-z0-9.,%°+\-–/() ]*[A-Za-z0-9%°)]|[A-Za-z0-9])/g,'<tspan direction="ltr" unicode-bidi="bidi-override">$1</tspan>')}</text>`};
const la=(x,y,t,o)=>{o=o||{};return `<text x="${x}" y="${y}" text-anchor="${o.a||'middle'}" direction="ltr" font-size="${o.fs||11}" font-weight="${o.w||600}" fill="${o.c||'#14231c'}" style="font-family:var(--mono)">${t}</text>`};
/* شكل الكتاب داخل نص المحطة (بألوان الموقع، يعمل في الوضع الداكن) */
const fig=(svg,cap,mw)=>`<figure style="margin:12px auto 4px;max-width:${mw||560}px"><div class="svgbox" style="margin:0">${svg}</div><figcaption style="text-align:center;margin-top:6px;font-size:13px;color:var(--muted);line-height:1.7">${cap}</figcaption></figure>`;
/* سهم مستقيم، وشخص بسيط (قدماه عند y) — لملفات الوحدات التي ليس فيها دوال رسم مماثلة */
const arr=(x1,y1,x2,y2,c,w)=>{c=c||'var(--stop)';w=w||2.4;const a=Math.atan2(y2-y1,x2-x1),h=6+w*1.6,bx=x2-h*Math.cos(a),by=y2-h*Math.sin(a),px=Math.sin(a)*h*.55,py=-Math.cos(a)*h*.55,f=v=>v.toFixed(1);
 return `<path d="M${f(x1)} ${f(y1)}L${f(bx)} ${f(by)}" stroke="${c}" stroke-width="${w}" fill="none" stroke-linecap="round"/><polygon points="${f(x2)},${f(y2)} ${f(bx+px)},${f(by+py)} ${f(bx-px)},${f(by-py)}" fill="${c}"/>`};
const man=(x,y,o)=>{o=o||{};const c=o.c||'var(--blue)';return `<g><path d="M${x-5} ${y-26}L${x-8} ${y}M${x+5} ${y-26}L${x+8} ${y}" stroke="var(--fg)" stroke-width="5" stroke-linecap="round"/><rect x="${x-10}" y="${y-62}" width="20" height="38" rx="6" fill="${o.cs||'var(--blue-soft)'}" stroke="${c}" stroke-width="1.5"/>${(o.hands||[[x-14,y-30],[x+14,y-30]]).map(h=>`<path d="M${x} ${y-56}L${h[0]} ${h[1]}" stroke="var(--fg)" stroke-width="4" stroke-linecap="round"/>`).join('')}<circle cx="${x}" cy="${y-72}" r="9" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.5"/>${o.helmet?`<path d="M${x-11} ${y-74}a11 10 0 0 1 22 0z" fill="var(--live)" stroke="var(--fg)"/>`:''}</g>`};
return {PAL,esc,art,hot,emb,ar,la,fig,arr,man};
})()),{intro:true}),
{st:1,short:'أهداف الوحدة',title:'الوحدة السادسة: أنظمة الإنذار من الحريق وإطفاء الحرائق — الهدف العام والأهداف التفصيلية',ref:'ص 112–113',
   q:'حريق صغير في مبنى كبير… من يكتشفه أولاً؟ ومن يُنذر الناس؟ وبماذا يُطفأ؟',
   art:SFA.art('الوحدة السادسة: إنذار من الحريق وإطفاؤه',
    `<g transform="translate(270 150) scale(1.9)">${ico('smoke',0,-30)}${ico('horn',0,8,{on:1})}</g>`+
    `<g transform="translate(180 168)">${flame(0,40,1.3)}</g>`+
    extSVG('pow',96,160,1.25)+
    SFA.ar(180,62,'الوحدة السادسة',{fs:17,w:700})+SFA.ar(270,256,'الإنذار',{fs:14.5})+SFA.ar(180,256,'الحريق',{fs:14.5})+SFA.ar(96,256,'الإطفاء',{fs:14.5})+
    SFA.hot(224,80,94,150,'أنظمة الإنذار: كاشف على السقف يكتشف الحريق، وجهاز تنبيه يُنذر من في المبنى — الدرسان الأول والثاني.')+
    SFA.hot(146,110,70,120,'الحريق: ما هو، وعناصره، وأنواعه — الدرس الثالث.')+
    SFA.hot(48,90,90,150,'طفايات الحريق وطرق الإطفاء وطريقة الاستعمال — الدرس الرابع.')),
   cap:'الوحدة في أربعة دروس.<br><b>مرّر المؤشر على كل رمز (أو المسه في الجوال) لتعرف ما يخصه من الوحدة.</b>',
   side:[
    {predict:{q:'أي هدف من أهداف الوحدة يخص «لوحة التحكم والكواشف»؟',opts:[
     ['أن يتعرف المتدرب على أنواع الحرائق وطرق إطفائها',false,'هذا عن الحريق وإطفائه (الدرسان الثالث والرابع).'],
     ['أن يحصي المتدرب المكونات الأساسية لنظام الإنذار عن الحريق',true,'لوحة التحكم والكواشف من مكونات نظام الإنذار (ص 113).'],
     ['أن يدرس المتدرب أنظمة وسائل الإطفاء للحرائق',false,'هذا عن الإطفاء.']]}}
   ],
   body:[
    {book:`<p><b>الهدف العام للوحدة:</b> الإنجازات الأساسية لمعرفة أنظمة الإنذار من الحريق واستخدام طفايات الحريق وإرشادات السلامة الصناعية.</p>
     <p><b>الأهداف التفصيلية:</b></p><ol><li>أن يحصي المتدرب المكونات الأساسية لنظام الإنذار عن الحريق.</li><li>أن يتعرف المتدرب على أنواع الحرائق وطرق إطفائها.</li><li>أن يدرس المتدرب أنظمة وسائل الإطفاء للحرائق.</li></ol>`,ref:'ص 113'},
    {tip:`<p>الوحدة نصفان: <b>أولاً</b> الإنذار (كيف نعرف بالحريق مبكراً ونُنذر الناس)، و<b>ثانياً</b> الحرائق وطرق إطفائها (ما الحريق، وأنواعه، وبماذا يُطفأ كل نوع).</p>`,title:'نصفا الوحدة'},
    {title:'مختبر مصغّر: إنذار أم إطفاء؟',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل موضوع اضغط النصف الذي يأتي فيه من الوحدة.',cats:['أولاً: الإنذار','ثانياً: الحرائق وإطفاؤها'],items:[
 ['كواشف الدخان والحرارة واللهب.',0,'رؤوس الكشف الآلي من مكونات نظام الإنذار (ص 116–122).'],
 ['هرم الاشتعال.',1,'من «ما الحريق؟» (ص 124).'],
 ['لوحة التحكم ومكانها.',0,'(ص 115–116).'],
 ['طريقة PASS.',1,'طريقة استعمال الطفايات (ص 134).']]})}
   ]},

  {st:2,short:'أنظمة الإنذار',title:'أولاً: أنظمة الإنذار من الحريق',ref:'ص 114',
   q:'لماذا يأتي «الإنذار» قبل «الإطفاء» في هذه الوحدة؟',
   art:SFA.art('مبنى فيه حريق، والإنذار يدق، والناس يغادرون',
    `<rect x="70" y="80" width="150" height="190" fill="var(--surface)" stroke="var(--fg)" stroke-width="2.4"/>`+[[86,100],[150,100],[86,160],[150,160]].map(([x,y])=>`<rect x="${x}" y="${y}" width="50" height="40" fill="var(--blue-soft)" stroke="var(--fg)" stroke-width="1.6"/>`).join('')+flame(111,140,.6)+
    `<rect x="124" y="220" width="40" height="50" fill="var(--live-soft)" stroke="var(--fg)" stroke-width="2"/><g transform="translate(250 96) scale(1.6)">${ico('horn',0,0,{on:1})}</g>`+
    SFA.man(250,270,{hands:[[236,236],[266,224]]})+SFA.man(296,270,{hands:[[282,232],[312,222]]})+SFA.arr(260,284,320,284,'var(--on)',2.6)+
    SFA.ar(180,62,'إنقاذ الأرواح أولاً',{fs:16,w:700})+
    SFA.hot(84,98,56,44,'حريق بدأ في غرفة واحدة.')+SFA.hot(224,72,60,52,'وسيلة إعلان وإخطار: تُنذر من في المبنى «بمجرد وقوع الحريق».')+SFA.hot(228,170,100,110,'الناس يغادرون المبنى «قبل أن تمتد النيران وتشتد ويتعذر عليهم الهرب».')),
   cap:'الهدف الأول من الإنذار.<br><b>مرّر المؤشر على الحريق والجرس والناس (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'ما «الاعتبار الأول» عند وقوع الحريق داخل المباني؟',opts:[
     ['حماية الأجهزة والممتلكات',false,'حفظ الممتلكات هدف أيضاً، لكنه ليس الأول.'],
     ['إطفاء الحريق بأي طريقة',false,'الكتاب يبدأ بإنذار الناس ليغادروا.'],
     ['إنقاذ الأرواح',true,'«إنقاذ الأرواح هو الاعتبار الأول عند وقوع الحريق داخل المباني» (ص 114).']]}}
   ],
   body:[
    {book:`<p>إنقاذ الأرواح هو الاعتبار الأول عند وقوع الحريق داخل المباني؛ لذا يتطلب الأمر إعلام الأشخاص المتواجدين داخل المبنى، وإنذارهم بمجرد وقوع الحريق حتى يستطيعوا مغادرته قبل أن تمتد النيران وتشتد ويتعذر عليهم الهرب، لذلك يتعين وجود وسيلة إعلان وإخطار عن الحريق داخل المباني والمنشآت.</p>`,ref:'ص 114'},
    {title:'تحقق سريع: صح أم خطأ؟',widget:(el,B)=>DCML.tf(el,B,{items:[
 ['الغرض من الإنذار أن يغادر الناس المبنى قبل أن تمتد النيران.',true,'(ص 114).'],
 ['يكفي أن يعرف حارس المبنى بالحريق، ولا داعي لإنذار الجميع.',false,'المطلوب «إعلام الأشخاص المتواجدين داخل المبنى، وإنذارهم».']]})}
   ]},

  {st:3,short:'الإنذار اليدوي',title:'6-1 نظام الإنذار اليدوي',ref:'ص 114',
   q:'إذا كان الإنذار ينتظر إنساناً يشغّله… فما نقطة ضعفه؟',
   art:SFA.art('يد تضغط زر إنذار يدوي على الحائط',
    `<rect x="60" y="70" width="240" height="200" rx="6" fill="var(--surface)" stroke="var(--line)" stroke-width="2"/><g transform="translate(180 150) scale(2.6)">${ico('manual',0,0,{on:1})}</g>`+
    `<path d="M282 236L222 186" stroke="var(--fg)" stroke-width="20" stroke-linecap="round"/><path d="M282 236L222 186" stroke="var(--surface)" stroke-width="15" stroke-linecap="round"/><ellipse cx="214" cy="178" rx="14" ry="10" fill="var(--surface)" stroke="var(--fg)" stroke-width="2" transform="rotate(40 214 178)"/>`+
    SFA.ar(180,58,'يعتمد على الإنسان',{fs:16,w:700})+SFA.ar(120,262,'زر إنذار يدوي',{fs:14})+
    SFA.hot(144,104,72,86,'نقطة إنذار يدوي: لا تعمل حتى يضغطها أو يسحبها إنسان.')+SFA.hot(200,166,90,80,'العنصر البشري: الشخص الذي رأى الحريق هو من يشغّل الإنذار.')),
   cap:'النظام اليدوي يحتاج إنساناً يشغّله.<br><b>مرّر المؤشر على الزر واليد (أو المسهما في الجوال) لتعرف معناهما.</b>',
   side:[
    {predict:{q:'على ماذا يعتمد نظام الإنذار اليدوي بشكل رئيس؟',opts:[
     ['على الكواشف الآلية',false,'هذه في نظام الإنذار الآلي.'],
     ['على العنصر البشري في تشغيله',true,'(ص 114).'],
     ['على الطفايات',false,'الطفايات للإطفاء لا للإنذار.']]}}
   ],
   body:[
    {book:`<p>هذا النظام يعتمد بشكل رئيس على العنصر البشري في تشغيله وينقسم إلى نوعين هما:</p>`,ref:'ص 114'},
    {tip:`<p>النوعان هما المحطتان التاليتان: <b>الإنذار البسيط</b> (أجراس تدق يدوياً) و<b>الإنذار الكهربائي</b> (أزرار في أرجاء المبنى أو شبكة اتصال داخلية). وفي الحالتين يجب أن يرى أحدٌ الحريق أولاً.</p>`,title:'نوعان'},
    {title:'مختبر مصغّر: يدوي أم آلي؟',widget:(el,B)=>DCML.sort(el,B,{cats:['إنذار يدوي','إنذار آلي'],items:[
 ['جرس يدقه حارس بيده.',0,'«الأجراس التي تدق يدوياً» — الإنذار البسيط (ص 114).'],
 ['زر على الحائط يضغطه من رأى الحريق فتدق الأجراس.',0,'الإنذار الكهربائي بالأزرار — ما زال يحتاج إنساناً يضغط (ص 114).'],
 ['كاشف دخان على السقف يرسل إشارة إلى اللوحة وحده.',1,'الكشف بتحسس آثار الحريق دون إنسان — الإنذار الآلي (ص 114).']]})}
   ]},

  {st:4,short:'الإنذار البسيط',title:'6-1-1 نظام الإنذار البسيط',ref:'ص 114',
   q:'جرس يدوي في ممر مليء بالدخان… هل سيستمر من يدقه في دقه؟',
   art:SFA.art('جرس يدوي يدقه شخص والدخان يقترب',
    `<path d="M150 104Q150 74 180 74Q210 74 210 104L218 150H142Z" fill="var(--live)" stroke="var(--fg)" stroke-width="2.4"/><circle cx="180" cy="156" r="7" fill="var(--fg)"/><path d="M180 74V60" stroke="var(--fg)" stroke-width="5"/><path d="M226 92q10 14 0 28M236 84q16 22 0 44" fill="none" stroke="var(--live)" stroke-width="2.4"/>`+
    SFA.man(110,270,{hands:[[148,152],[96,236]]})+
    [[230,220,34],[270,190,40],[300,236,30],[250,252,26]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="var(--muted)" opacity=".35"/>`).join('')+flame(290,282,.7)+
    SFA.ar(180,46,'جرس يُدق يدوياً',{fs:15,w:700})+SFA.ar(260,180,'دخان',{fs:14})+
    SFA.hot(140,58,80,104,'جرس يدق يدوياً: أبسط أجهزة الإنذار، تأثيره محدود ويؤدي الغرض في مساحة بسيطة ومحدودة.')+SFA.hot(196,150,140,140,'الدخان واللهب «قد يعوق… أي شخص من الاستمرار في تشغيله».')),
   cap:'أبسط أنواع الإنذار ومشكلته.<br><b>مرّر المؤشر على الجرس والدخان (أو المسهما في الجوال) لتعرف معناهما.</b>',
   side:[
    {predict:{q:'ما المشكلة التي يذكرها الكتاب في الأجراس التي تدق يدوياً؟',opts:[
     ['أن صوتها مزعج',false,'لا يذكر الكتاب ذلك.'],
     ['أن الدخان أو اللهب قد يعوق الشخص عن الاستمرار في تشغيلها',true,'«فقد يعوق الدخان أو اللهب أي شخص من الاستمرار في تشغيله» (ص 114).'],
     ['أنها تحتاج كهرباء',false,'هي تُدق يدوياً.']]}}
   ],
   body:[
    {book:`<p>وهو أبسط أنواع أجهزة الإنذار وهي الأجهزة البسيطة المحدثة للأصوات مثل الأجراس التي تدق يدوياً غير أن هذا النوع من الأجهزة تأثيرها محدود وتؤدي الغرض المطلوب في مساحة بسيطة ومحدودة يعترضها بعض المشاكل عند استخدامها فقد يعوق الدخان أو اللهب أي شخص من الاستمرار في تشغيله، ويمنعه من القيام بأية محاولة لمكافحة الحريق.</p>`,ref:'ص 114'},
    {title:'مختبر مصغّر: هل يكفي الجرس هنا؟',widget:(el,B)=>DCML.cases(el,B,{cases:[
     {q:'ورشة صغيرة من غرفة واحدة.',opts:[['قد يؤدي الجرس اليدوي الغرض',true,'«تؤدي الغرض المطلوب في مساحة بسيطة ومحدودة».'],['لا يصلح أبداً',false,'الكتاب يقول إنه يؤدي الغرض في المساحة المحدودة.']]},
     {q:'مصنع كبير من عدة مبانٍ.',opts:[['يكفي جرس يدوي واحد',false,'«تأثيرها محدود»؛ لن يسمعه الجميع، وقد يعجز من يدقه بسبب الدخان.'],['يحتاج نظاماً أوسع من الجرس اليدوي',true,'مثل الإنذار الكهربائي بالأزرار أو الإنذار الآلي.']]}]})}
   ]},

  {st:5,short:'الإنذار الكهربائي',title:'6-1-2 نظام الإنذار الكهربائي',ref:'ص 114',
   q:'تضغط زراً واحداً في الطابق الثاني… فتدق الأجراس في المبنى كله. كيف؟',
   art:SFA.art('زر إنذار على الحائط موصول بأجراس الإنذار في المبنى',
    `<g transform="translate(90 160) scale(2.2)">${ico('manual',0,0,{on:1})}</g>`+`<path d="M122 160H200V96H250M200 160H250M200 160V224H250" fill="none" stroke="var(--wire)" stroke-width="3"/>`+
    [96,160,224].map(y=>`<g transform="translate(270 ${y}) scale(1.3)">${ico('horn',0,0,{on:1})}</g>`).join('')+
    SFA.ar(180,58,'زر واحد ← أجراس المبنى',{fs:15,w:700})+SFA.ar(90,228,'زر الإنذار',{fs:14})+SFA.ar(270,272,'أجراس الإنذار',{fs:14})+
    SFA.hot(56,112,68,96,'زر من «أزرار تركب بأرجاء المبنى».')+SFA.hot(124,90,120,140,'أسلاك تصل الأزرار بأجراس الإنذار.')+SFA.hot(244,72,64,176,'«يترتب على ضغط أحدها إطلاق أجراس الإنذار بالموقع معلنة عن الخطر».')),
   cap:'النوع الأول من الإنذار الكهربائي.<br><b>مرّر المؤشر على الزر والأسلاك والأجراس (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'ما النوع الآخر من نظام الإنذار الكهربائي غير الأزرار؟',opts:[
     ['شبكة اتصال داخلية خاصة بالمبنى',true,'«والنوع الآخر يعتمد تشغيله على تركيب شبكة اتصال داخلية خاصة بالمبنى» (ص 114).'],
     ['كاشف الدخان الأيوني',false,'الكواشف من الإنذار الآلي.'],
     ['الجرس الذي يدق يدوياً',false,'هذا الإنذار البسيط.']]}}
   ],
   body:[
    {book:`<p>ويعتمد هذا النظام على نوعين الأول يتم تشغيله بواسطة أزرار تركب بأرجاء المبنى، ويترتب على ضغط أحدها إطلاق أجراس الإنذار بالموقع معلنة عن الخطر. والنوع الآخر يعتمد تشغيله على تركيب شبكة اتصال داخلية خاصة بالمبنى.</p>`,ref:'ص 114'},
    {title:'مختبر مصغّر: اضغط الزر',widget:(el,B)=>DCML.lab(el,B,{intro:'اضغط زر الإنذار وانظر إلى الأجراس.',ins:[{k:'p',l:'زر الإنذار',seg:[[0,'لم يُضغط'],[1,'اضغط الزر']],v:0}],
     calc:(s)=>({pic:`<svg viewBox="0 0 320 120" role="img" aria-label="زر إنذار وأجراس" style="font-family:var(--font)">${ico('manual',50,60,{on:s.p})}<path d="M70 60H150V30H230M150 60H230M150 60V90H230" class="w${s.p?' live':''}" style="stroke-width:2.4"/>${[30,60,90].map(y=>ico('horn',255,y,{on:s.p})).join('')}</svg>`,
      msg:s.p?'ضغطة واحدة أطلقت أجراس الإنذار في الموقع «معلنة عن الخطر». لاحظ أن أحداً اضطر أن يرى الحريق ويضغط: النظام ما زال يدوياً.':'الأجراس صامتة حتى يضغط أحدٌ الزر.'})})}
   ]},

  {st:6,short:'الإنذار الآلي',title:'6-2 نظام الإنذار الآلي من الحريق',ref:'ص 114',
   q:'الساعة الثالثة فجراً والمصنع خالٍ… من سيرى الحريق؟',
   art:SFA.art('كاشف على السقف يكتشف الحريق ويرسل إشارة إلى لوحة التحكم',
    `<path d="M40 80H320" stroke="var(--fg)" stroke-width="5"/><g transform="translate(110 94) scale(1.8)">${ico('smoke',0,0,{on:1})}</g>`+[[96,150,20],[118,176,26],[104,206,30]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="var(--muted)" opacity=".3"/>`).join('')+flame(110,268,.8)+
    `<path d="M140 96H250V150" fill="none" stroke="var(--wire)" stroke-width="3" stroke-dasharray="7 5"/><g transform="translate(250 190) scale(2)">${ico('facp',0,0)}</g>`+
    SFA.ar(180,58,'كشف مبكر دون انتظار أحد',{fs:15,w:700})+SFA.ar(250,262,'لوحة التحكم',{fs:14})+
    SFA.hot(74,80,72,36,'كاشف آلي على السقف يتحسس أثر الحريق (هنا الدخان).')+SFA.hot(220,140,62,100,'لوحة التحكم تتلقى الإشارة وتطلق الإنذار.')+SFA.hot(66,130,90,160,'الحريق في بدايته: «السرعة في اكتشاف الحريق منذ البداية عامل مهم في تقليل الخسائر».')),
   cap:'النظام الآلي لا ينتظر من يرى الحريق.<br><b>مرّر المؤشر على الكاشف والحريق واللوحة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'ما الوظيفة الأساسية لنظام الكشف والإنذار الآلي حسب الكتاب؟',opts:[
     ['إطفاء الحريق تلقائياً',false,'وظيفته الكشف والإنذار؛ الإطفاء موضوع آخر.'],
     ['الكشف المبكر عند حدوث حريق',true,'«وظيفته الأساسية الكشف المبكر عند حدوث حريق» (ص 114).'],
     ['تهوية المبنى',false,'لا يذكر الكتاب ذلك.']]}}
   ],
   body:[
    {book:`<p>إن نظام الكشف والإنذار عن الحريق عبارة عن نظام كهربائي إلكتروني وظيفته الأساسية الكشف المبكر عند حدوث حريق في مكان ما ضمن المجال المطبق فيه هذا النظام، والهدف منه إنقاذ أرواح الأشخاص المتواجدين في ذلك المكان إضافة إلى حفظ ووقاية الممتلكات. وإن السرعة في اكتشاف الحريق منذ البداية عامل مهم في تقليل الخسائر المترتبة على ذلك، من خلال إيجاد الإجراءات اللازمة للسيطرة واحتواء الخطر قبل انتشاره في المكان.</p>`,ref:'ص 114'},
    {title:'تحقق سريع: صح أم خطأ؟',widget:(el,B)=>DCML.tf(el,B,{items:[
 ['الإنذار الآلي يهدف إلى إنقاذ الأرواح وحفظ الممتلكات معاً.',true,'«إنقاذ أرواح الأشخاص… إضافة إلى حفظ ووقاية الممتلكات» (ص 114).'],
 ['سرعة اكتشاف الحريق لا تغير حجم الخسائر.',false,'«السرعة في اكتشاف الحريق منذ البداية عامل مهم في تقليل الخسائر».']]})}
   ]},

  {st:7,short:'المكونات الأساسية',title:'6-2-1 المكونات الأساسية لنظام الإنذار الآلي من الحريق',ref:'ص 114–115',
   q:'يتحسس، ثم ينذر، ثم يبلّغ… ما الترتيب؟',
   art:SFA.art('الفكرة الأساسية: يتحسس أثر الحريق، فيطلق الإنذار، فيخلي الناس المبنى، ويبلّغ المختصين',
    [['smoke','يتحسس',260,100],['horn','ينذر',100,100],['door','يخلون',100,214],['truck','يبلّغ',260,214]].map(([k,t,x,y])=>`<circle cx="${x}" cy="${y}" r="42" fill="var(--surface)" stroke="var(--blue)" stroke-width="2.2"/><g transform="translate(${x} ${y-12}) scale(1.3)">${ico(k,0,0,{on:1,open:1})}</g>`+SFA.ar(x,y+32,t,{fs:14,w:700})).join('')+
    SFA.arr(214,100,146,100,'var(--blue)',2.6)+SFA.arr(100,146,100,168,'var(--blue)',2.6)+SFA.arr(146,214,214,214,'var(--blue)',2.6)+
    SFA.ar(180,46,'فكرة النظام في أربع خطوات',{fs:15,w:700})+
    SFA.hot(218,58,84,84,'الكشف عن وجود حريق «بواسطة تحسس أي من آثاره» (الدخان أو الحرارة أو اللهب).')+SFA.hot(58,58,84,84,'«إطلاق أجهزة الإنذار».')+SFA.hot(58,172,84,84,'«لإتاحة الفرصة لشاغلي المبنى لإخلائه».')+SFA.hot(218,172,84,84,'«ولإعطاء إشارة إلى المختصين لمكافحة الحريق» (الدفاع المدني).')),
   cap:'اقرأ الدوائر من اليمين العلوي مع الأسهم.<br><b>مرّر المؤشر على كل دائرة (أو المسها في الجوال) لتقرأ نص الكتاب عنها.</b>',
   side:[
    {predict:{q:'بماذا يكشف النظام الآلي وجود الحريق؟',opts:[
     ['بتحسس أي من آثاره',true,'«الكشف عن وجود حريق بواسطة تحسس أي من آثاره» (ص 114).'],
     ['بشخص يضغط زراً',false,'هذا الإنذار اليدوي.'],
     ['بكاميرا يراقبها حارس',false,'لا يذكر الكتاب ذلك.']]}}
   ],
   body:[
    {book:`<p>إن الفكرة الأساسية للنظام هي الكشف عن وجود حريق بواسطة تحسس أي من آثاره، ومن ثم إطلاق أجهزة الإنذار لإتاحة الفرصة لشاغلي المبنى لإخلائه، ولإعطاء إشارة إلى المختصين لمكافحة الحريق (الشكل 6-1)، حيث تتكون من خمسة عناصر رئيسة سوف نكتفي بالتطرق إلى وحدة التحكم الرئيسية وإلى عناصر الإدخال فقط.</p>`,ref:'ص 114'},
    {html:SFA.fig(fig61(),'الشكل <span class="ltr">(6-1)</span> ص 115 — مكونات لوحة الإنذار من الحريق <span class="ltr">(Fire Alarm Control Panel Components)</span>؛ الأسماء العربية تحت الرموز ترجمة منّا.',720)},
    {watch:`<p>يقول الكتاب (ص 114) إن النظام «يتكون من خمسة عناصر رئيسة» ولا يسميها. من الشكلين <span class="ltr">(6-1)</span> و<span class="ltr">(6-2)</span> يمكن أن تُفهم هكذا: أجهزة البدء (المداخل)، ولوحة التحكم، وأجهزة التنبيه الصوتي والضوئي، ووسائل التحكم في الطوارئ (التكييف والأبواب)، والربط مع الدفاع المدني — وهذه قراءة منّا للشكل، لا نص الكتاب.</p>`,fix:1},
    {title:'مختبر مصغّر: رتّب عمل النظام',widget:(el,B)=>DCML.order(el,B,{steps:[
 ['يتحسس الكاشف أثراً من آثار الحريق',''],['تُطلق أجهزة الإنذار','الإنذار يأتي بعد الكشف: لا ينذر النظام قبل أن يعرف بالحريق.'],['يُخلي شاغلو المبنى المبنى','الإخلاء يأتي بعد سماع الإنذار.'],['يكافح المختصون الحريق بعد وصول الإشارة إليهم','']],done:'هذا ترتيب الفكرة الأساسية في الكتاب (ص 114). في الواقع تُرسل الإشارة إلى المختصين مع الإنذار نفسه تقريباً.'})}
   ]},

  {st:8,short:'وحدة التحكم',title:'1- وحدة التحكم والإنذار الآلي من الحريق',ref:'ص 115',
   q:'كاشف على السقف يرسل إشارة… فمن يقرر أن تدق الأجراس وتتوقف مراوح التكييف؟',
   art:SFA.art('لوحة التحكم في الوسط: المداخل إلى يمينها والمخارج إلى يسارها',
    `<rect x="140" y="96" width="80" height="130" rx="8" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2.4"/><g transform="translate(180 150) scale(1.6)">${ico('facp',0,0)}</g>`+
    `<g transform="translate(300 104) scale(1.2)">${ico('smoke',0,0,{on:1})}</g><g transform="translate(300 170) scale(1.2)">${ico('manual',0,0)}</g><g transform="translate(300 234) scale(1.2)">${ico('wf',0,0)}</g>`+
    `<g transform="translate(60 100) scale(1.2)">${ico('horn',0,0,{on:1})}</g><g transform="translate(60 158) scale(1.2)">${ico('fan',0,0,{on:false})}</g><g transform="translate(60 222) scale(1.2)">${ico('truck',0,0,{on:1})}</g>`+
    SFA.arr(278,170,224,170,'var(--blue)',2.4)+SFA.arr(136,160,84,160,'var(--blue)',2.4)+
    SFA.ar(180,62,'عقل النظام',{fs:16,w:700})+SFA.ar(300,282,'المداخل',{fs:14})+SFA.ar(60,282,'المخارج',{fs:14})+SFA.ar(180,252,'لوحة التحكم',{fs:13.5})+
    SFA.hot(140,96,80,130,'لوحة التحكم ⟦FACP⟧: «تتلقى إشارة بدء الحريق من المكشفات وتعطي إشارة التشغيل لأجهزة الإنذار والإطفاء».')+
    SFA.hot(272,80,58,180,'المداخل (أجهزة البدء): كاشف الدخان، ونقطة الإنذار اليدوي، ومفتاح تدفق الماء في أنابيب الرشاشات ⟦WF⟧.')+
    SFA.hot(30,78,60,48,'جهاز تنبيه صوتي (بوق).')+SFA.hot(30,134,60,48,'مراوح التكييف ⟦HVAC⟧: توقفها اللوحة عند الحريق حتى لا تنقل الدخان.')+SFA.hot(30,198,60,48,'الربط مع الدفاع المدني ⟦City CKT⟧.')),
   cap:'فكرة الشكل <span class="ltr">(6-2)</span>.<br><b>مرّر المؤشر على اللوحة والمداخل والمخارج (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'ما المقصود بالإنذار الكاذب؟',opts:[
     ['إنذار يدوي يطلقه شخص للمزاح',false,'قد يحدث، لكن الكتاب يقصد شيئاً آخر.'],
     ['إنذار مع عدم وجود حريق، يحدث أحياناً لوجود خلل في النظام',true,'«الإنذار الكاذب (إنذار مع عدم وجود حريق) والذي يحدث أحياناً، لوجود خلل في النظام» (ص 115).'],
     ['إنذار يتأخر بعد الحريق',false,'هذا ليس تعريف الكتاب.']]}}
   ],
   body:[
    {book:`<p>تجهز المباني الكبيرة الحديثة، مثل المباني الخاصة بالمكاتب والفنادق والمستشفيات والعمارات السكنية والمنشآت الصناعية، بلوحات لتعطي تنبيهاً بالاتصال فوراً بالمطافئ أو الشرطة في حالة وجود حريق بالمبنى. وهي عقل النظام وتتكون من لوحة كهربائية للتحكم في النظام تتلقى إشارة بدء الحريق من المكشفات وتعطي إشارة التشغيل لأجهزة الإنذار والإطفاء وغيرها من مكونات النظام، وتحتوي على مفاتيح التشغيل وأجهزة التحكم الميكانيكية والكهربائية اللازمة، واللوحة أيضاً مزودة بوسيلة لتجربة التوصيلات الخاصة بالنظام للتأكد من سلامتها وصلاحيتها، وأيضاً لتوضيح الإنذار الكاذب (إنذار مع عدم وجود حريق) والذي يحدث أحياناً، لوجود خلل في النظام فقد زودت بوسيلة تحذير صوتي، الذي يصدره في حالة الإنذار عن الحريق. انظر الشكل (6-2)</p>`,ref:'ص 115'},
    {html:SFA.fig(fig62(),'الشكل <span class="ltr">(6-2)</span> ص 115 — المداخل (أجهزة البدء) ← المنطق والتحكم ← المخارج (أجهزة التنبيه والتحكم في الطوارئ).',780)},
    {tip:`<div class="tablebox"><table class="tt"><thead><tr><th>البطاقة في الشكل</th><th>معناها</th></tr></thead><tbody>
     <tr><td><span class="ltr">IDC's</span></td><td>دوائر أجهزة البدء (تصل الكواشف والأزرار باللوحة)</td></tr>
     <tr><td><span class="ltr">NAC's</span></td><td>دوائر أجهزة التنبيه (الأبواق والأضواء الوامضة)</td></tr>
     <tr><td><span class="ltr">AUX Relays</span></td><td>مرحلات مساعدة: توقف مراوح التكييف وتتحكم في أقفال الأبواب وماسكاتها</td></tr>
     <tr><td><span class="ltr">City CKT</span></td><td>دائرة الربط مع الجهة المختصة (الدفاع المدني)</td></tr>
     <tr><td><span class="ltr">Power Supply / BATT</span></td><td>مصدر التغذية / البطارية الاحتياطية</td></tr></tbody></table></div><p>لماذا توقف اللوحة مراوح التكييف؟ لأن مجاري الهواء تنقل الدخان إلى بقية الغرف. ولماذا تحرر الأبواب؟ الأبواب المقاومة للحريق تبقى مفتوحة بماسكات، فإذا جاء الإنذار تُحرَّر فتنغلق وتحصر الدخان.</p>`,title:'بطاقات الشكل (ترجمة منّا)'},
    {title:'مختبر مصغّر: ماذا تفعل اللوحة؟',widget:(el,B)=>DCML.lab(el,B,{intro:'اختر إشارة الدخول، وحالة التوصيلات، وانظر إلى المخارج.',
     predict:{q:'وصلت إلى اللوحة إشارة من كاشف دخان. أي مما يلي لا تفعله اللوحة في الشكل (6-2)؟',opts:[['تشغّل الأبواق والأضواء',false,'هذه عبر دوائر NAC\'s.'],['تطفئ الحريق بنفسها بمياه من اللوحة',true,'اللوحة تعطي إشارة التشغيل لأجهزة الإنذار والإطفاء، لكنها لا تطفئ بنفسها.'],['تبلّغ الدفاع المدني',false,'عبر City CKT.']]},
     ins:[{k:'in',l:'إشارة الدخول',seg:[['none','لا شيء'],['smoke','كاشف دخان'],['manual','نقطة إنذار يدوي'],['wf','تدفق ماء في الرشاشات']],v:'none'},{k:'f',l:'التوصيلات',seg:[[0,'سليمة'],[1,'فيها خلل']],v:0}],
     calc:(s)=>{const al=s.in!=='none'&&!s.f,tr=!!s.f;let v=`<svg viewBox="0 0 360 170" role="img" aria-label="مداخل ومخارج لوحة الإنذار" style="font-family:var(--font)">`;
      [['smoke',30],['manual',85],['wf',140]].forEach(([k,y])=>{v+=ico(k,40,y,{on:s.in===k})});v+=`<path d="M64 85H140" class="w${s.in!=='none'?' live':''}" style="stroke-width:2.4"/>`+ico('facp',170,85)+(tr?tA(170,140,'عطل',{fs:12,fill:'var(--live)',w:700}):'')+`<path d="M196 85H250" class="w${al?' live':''}" style="stroke-width:2.4"/>`;
      v+=ico('horn',290,22,{on:al})+ico('strobe',290,62,{on:al})+ico('fan',290,104,{on:!al})+ico('truck',290,146,{on:al})+'</svg>';
      return {pic:v,msg:tr?'<b>خلل في التوصيلات:</b> اللوحة «مزودة بوسيلة لتجربة التوصيلات… للتأكد من سلامتها»؛ والخلل قد يسبب إنذاراً كاذباً أو يمنع الإنذار، لذلك تنبّه إليه اللوحة بتحذير صوتي. أصلح التوصيلات.':al?'وصلت إشارة بدء الحريق: الأبواق والأضواء تعمل، ومراوح التكييف توقفت، وأُبلغ الدفاع المدني.':'لا إشارة: اللوحة في المراقبة العادية، ومراوح التكييف تعمل.',cls:tr?'warn':''}}})}
   ]},

  {st:9,short:'مكان لوحة التحكم',title:'الشروط الواجب توافرها في مكان لوحة التحكم (الإنذار الآلي من الحريق)',ref:'ص 116',
   q:'أين تضع «عقل النظام»: في القبو بجانب المولد، أم في السطح، أم قرب المدخل؟',
   art:SFA.art('مسقط للدور الأرضي: لوحة التحكم قرب المخرج وبجانبها مخطط إرشادي',
    `<rect x="50" y="80" width="260" height="180" fill="var(--surface)" stroke="var(--fg)" stroke-width="3"/><path d="M50 170H150M210 170H310M180 80V140" stroke="var(--fg)" stroke-width="2"/><rect x="150" y="252" width="60" height="16" fill="var(--on-soft)" stroke="var(--on)" stroke-width="2"/>`+
    `<g transform="translate(180 220) scale(1.3)">${ico('facp',0,0)}</g><rect x="214" y="200" width="40" height="30" rx="3" fill="var(--blue-soft)" stroke="var(--blue)" stroke-width="2"/><path d="M220 210H248M220 218H240" stroke="var(--blue)" stroke-width="2"/><circle cx="194" cy="200" r="5" fill="var(--live)"/>`+
    SFA.arr(180,262,180,298,'var(--on)',2.6)+SFA.ar(180,60,'الدور الأرضي',{fs:15,w:700})+SFA.ar(110,130,'غرف',{fs:13,w:500})+SFA.ar(260,130,'غرف',{fs:13,w:500})+SFA.ar(250,300,'المخرج',{fs:14,c:'var(--on)'})+
    SFA.hot(158,190,44,58,'لوحة التحكم: في الدور الأرضي، في مكان متوسط وأقرب ما يمكن للخروج، ومجهزة بقفل إذا كانت في مكان عام.')+SFA.hot(212,196,46,38,'مخطط إرشادي قرب اللوحة: يبين المنطقة المحمية وتقسيم المناطق، ومخارج الطوارئ، وأماكن الطفايات.')+SFA.hot(186,192,16,16,'القفل.')+SFA.hot(148,250,64,22,'المخرج: المكان سهل الدخول والخروج.')),
   cap:'شروط الكتاب في مسقط واحد.<br><b>مرّر المؤشر على اللوحة والمخطط والقفل والمخرج (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'إذا كان المكان الذي فيه اللوحة غير مأهول، فماذا يجب؟',opts:[
     ['تُطفأ اللوحة ليلاً',false,'اللوحة لا تُطفأ.'],
     ['تُجهز اللوحة بآلية لتحويل جميع الإشارات (الأعطال – الإنذار) إلى مكان آخر مأهول',true,'الشرط (هـ) ص 116.'],
     ['يُكتفى بالأجراس اليدوية',false,'لا يقول الكتاب ذلك.']]}}
   ],
   body:[
    {book:`<ol style="list-style:none;padding-inline-start:4px"><li>أ- مكان قليل الخطر بالنسبة للحريق.</li><li>ب- المكان ذو درجة حرارة معتدلة ومرتب وجيد التهوية.</li><li>ج- يجب أن يحتوي هذا المكان على أجهزة كشف وإنذار عن الحريق.</li><li>د- المكان يكون في الدور الأرضي من مبنى عام سهل الدخول والخروج منه، وفي مكان متوسط وأقرب ما يمكن للخروج.</li><li>هـ- يجب أن يكون المكان الذي فيه اللوحة مأهولاً، وإلا وجب أن تجهز اللوحة بآلية لتحويل جميع الإشارة (الأعطال – الإنذار) إلى مكان آخر مأهول.</li><li>و- إذا كانت اللوحة في مكان عام وجب أن تكون مجهزة بقفل.</li></ol>
     <p>إضافة إلى ما ذكر يجب أن يثبت بالقرب من اللوحة، مخطط إرشادي يبين المنطقة المحمية وتقسيم المناطق، ومخارج الطوارئ وأماكن طفايات وأجهزة مكافحة الحريق.</p>`,ref:'ص 116'},
    {title:'مختبر مصغّر: اختر مكان اللوحة',widget:(el,B)=>DCML.cases(el,B,{cases:[
     {q:'ثلاثة أماكن مقترحة. أيها يحقق شروط الكتاب؟',opts:[['غرفة في القبو بجانب خزان الوقود والمولد',false,'المكان يجب أن يكون «قليل الخطر بالنسبة للحريق» وفي الدور الأرضي.'],['غرفة الاستقبال في الدور الأرضي قرب المدخل، فيها موظف دائماً',true,'دور أرضي، سهل الدخول والخروج، قريب من الخروج، ومأهول (الشروط د وهـ).'],['غرفة مغلقة في السطح لا يدخلها أحد',false,'بعيدة عن الخروج وغير مأهولة.']]},
     {q:'اللوحة في ممر عام يمر به الزوار. ماذا يلزم؟',opts:[['أن تكون مجهزة بقفل',true,'الشرط (و): «إذا كانت اللوحة في مكان عام وجب أن تكون مجهزة بقفل».'],['أن تُغطى بقماش',false,'لا يذكر الكتاب ذلك، وقد يخفي التحذيرات.']]}]})}
   ]},

  {recap:[
   'إنقاذ الأرواح هو الاعتبار الأول؛ لذلك يلزم إنذار من في المبنى بمجرد وقوع الحريق (ص 114).',
   'الإنذار اليدوي يعتمد على الإنسان: بسيط (أجراس تدق يدوياً) أو كهربائي (أزرار، أو شبكة اتصال داخلية) (ص 114).',
   'الإنذار الآلي يتحسس آثار الحريق، فيطلق الإنذار للإخلاء ويعطي إشارة للمختصين (ص 114).',
   'لوحة التحكم «عقل النظام»: تتلقى الإشارة من الكواشف، وتشغّل أجهزة الإنذار، وتجرب التوصيلات وتنبه إلى الخلل — الشكل (6-2).',
   'مكان اللوحة: قليل الخطر، في الدور الأرضي قرب الخروج، مأهول، وبقفل في الأماكن العامة، وبجانبها مخطط إرشادي (ص 116).']}
],
 theory:[
  {h:'الوحدة السادسة: أنظمة الإنذار من الحريق وإطفاء الحرائق',ref:'ص 112–113',html:`<p><b>الهدف العام للوحدة:</b> الإنجازات الأساسية لمعرفة أنظمة الإنذار من الحريق واستخدام طفايات الحريق وإرشادات السلامة الصناعية.</p>
   <p><b>الأهداف التفصيلية:</b></p><ol><li>أن يحصي المتدرب المكونات الأساسية لنظام الإنذار عن الحريق.</li><li>أن يتعرف المتدرب على أنواع الحرائق وطرق إطفائها.</li><li>أن يدرس المتدرب أنظمة وسائل الإطفاء للحرائق.</li></ol>`},
  {h:'أولاً: أنظمة الإنذار من الحريق',ref:'ص 114',html:`<p>«إنقاذ الأرواح هو الاعتبار الأول عند وقوع الحريق داخل المباني؛ لذا يتطلب الأمر إعلام الأشخاص المتواجدين داخل المبنى، وإنذارهم بمجرد وقوع الحريق حتى يستطيعوا مغادرته قبل أن تمتد النيران وتشتد ويتعذر عليهم الهرب، لذلك يتعين وجود وسيلة إعلان وإخطار عن الحريق داخل المباني والمنشآت.»</p>`},
  {h:'6-1 نظام الإنذار اليدوي',ref:'ص 114',html:`<p>يعتمد هذا النظام بشكل رئيس على <b>العنصر البشري</b> في تشغيله، وينقسم إلى نوعين:</p>
   <ol><li><b>6-1-1 نظام الإنذار البسيط:</b> أبسط أنواع أجهزة الإنذار، وهي الأجهزة البسيطة المحدثة للأصوات مثل <b>الأجراس التي تدق يدويًا</b>. تأثيرها محدود وتؤدي الغرض في مساحة بسيطة، ويعترضها بعض المشاكل: «فقد يعوق الدخان أو اللهب أي شخص من الاستمرار في تشغيله، ويمنعه من القيام بأية محاولة لمكافحة الحريق».</li>
   <li><b>6-1-2 نظام الإنذار الكهربائي:</b> نوعان: الأول يُشغَّل بواسطة <b>أزرار تُركّب بأرجاء المبنى</b>، ويترتب على ضغط أحدها إطلاق أجراس الإنذار بالموقع معلنة عن الخطر. والآخر يعتمد تشغيله على تركيب <b>شبكة اتصال داخلية</b> خاصة بالمبنى.</li></ol>`},
  {h:'6-2 نظام الإنذار الآلي من الحريق',ref:'ص 114',html:`<p>نظام الكشف والإنذار عن الحريق «عبارة عن نظام كهربائي إلكتروني وظيفته الأساسية <b>الكشف المبكر</b> عند حدوث حريق في مكان ما ضمن المجال المطبق فيه هذا النظام». والهدف منه <b>إنقاذ أرواح</b> الأشخاص المتواجدين في ذلك المكان، إضافة إلى <b>حفظ ووقاية الممتلكات</b>. والسرعة في اكتشاف الحريق منذ البداية عامل مهم في تقليل الخسائر، من خلال إيجاد الإجراءات اللازمة للسيطرة واحتواء الخطر قبل انتشاره.</p>
   <h3>6-2-1 المكونات الأساسية لنظام الإنذار الآلي من الحريق</h3>
   <p>الفكرة الأساسية للنظام هي <b>الكشف عن وجود حريق بواسطة تحسس أي من آثاره</b>، ثم <b>إطلاق أجهزة الإنذار</b> لإتاحة الفرصة لشاغلي المبنى لإخلائه، و<b>إعطاء إشارة إلى المختصين</b> لمكافحة الحريق (الشكل 6-1). ويتكون من خمسة عناصر رئيسة، ويكتفي الكتاب بوحدة التحكم الرئيسية وعناصر الإدخال.</p>`},
  {err:'<span class="fixnote">يقول الكتاب (ص 114) إن النظام «يتكون من خمسة عناصر رئيسة» ولا يسميها. من الشكلين (6-1) و(6-2) يمكن أن تُفهم هكذا: أجهزة البدء (المداخل)، ولوحة التحكم، وأجهزة التنبيه الصوتي والضوئي، ووسائل التحكم في الطوارئ (التكييف والأبواب)، والربط مع الدفاع المدني — وهذه قراءة منّا للشكل، لا نص الكتاب.</span>'},
  {fig:'(6-1)',ref:'ص 115',caption:'مكونات لوحة الإنذار من الحريق (Fire Alarm Control Panel Components) — الأسماء العربية تحت الرموز ترجمة منّا.',draw:()=>box(fig61(),720)},
  {h:'1- وحدة التحكم والإنذار الآلي من الحريق',ref:'ص 115',html:`<p>تُجهَّز المباني الكبيرة الحديثة (المكاتب والفنادق والمستشفيات والعمارات السكنية والمنشآت الصناعية) بلوحات تعطي تنبيهًا بالاتصال فورًا بالمطافئ أو الشرطة في حالة وجود حريق. وهي <b>«عقل النظام»</b>، وتتكون من:</p>
   <ul><li>لوحة كهربائية للتحكم في النظام <b>تتلقى إشارة بدء الحريق من المكشفات</b>، و<b>تعطي إشارة التشغيل لأجهزة الإنذار والإطفاء</b> وغيرها من مكونات النظام.</li>
   <li>مفاتيح التشغيل وأجهزة التحكم الميكانيكية والكهربائية اللازمة.</li>
   <li>وسيلة <b>لتجربة التوصيلات</b> الخاصة بالنظام للتأكد من سلامتها وصلاحيتها.</li>
   <li>وسيلة لتوضيح <b>الإنذار الكاذب</b> (إنذار مع عدم وجود حريق) والذي يحدث أحيانًا لوجود خلل في النظام، ولذلك زُوّدت بوسيلة <b>تحذير صوتي</b>.</li></ul>`},
  {fig:'(6-2)',ref:'ص 115',caption:'مكونات لوحة الإنذار: المداخل (أجهزة البدء) ← المنطق والتحكم ← المخارج (أجهزة التنبيه والتحكم في الطوارئ).',draw:()=>box(fig62(),780)},
  {html:`<div class="tablebox"><table class="tt"><thead><tr><th>البطاقة في الشكل</th><th>معناها (ترجمة منّا)</th></tr></thead><tbody>
   <tr><td><span class="ltr">Smoke Detectors / Manual Stations</span></td><td>كواشف الدخان / نقاط الإنذار اليدوي (زر أو مقبض يُسحب)</td></tr>
   <tr><td><span class="ltr">Waterflow Switches / Sprinkler Supervisory Switches</span></td><td>مفاتيح تدفق الماء في أنابيب الرشاشات / مفاتيح مراقبة صمامات الرشاشات</td></tr>
   <tr><td><span class="ltr">IDC's</span></td><td>دوائر أجهزة البدء (تصل الكواشف والأزرار باللوحة)</td></tr>
   <tr><td><span class="ltr">Power Supply / BATT / 120 VAC</span></td><td>مصدر التغذية / البطارية الاحتياطية / التغذية الرئيسية</td></tr>
   <tr><td><span class="ltr">User Interface / Program</span></td><td>واجهة المستخدم / البرنامج الذي يقرر ماذا يُشغَّل</td></tr>
   <tr><td><span class="ltr">NAC's</span></td><td>دوائر أجهزة التنبيه (الأبواق والأضواء الوامضة)</td></tr>
   <tr><td><span class="ltr">AUX Relays</span></td><td>مرحلات مساعدة: توقف مراوح التكييف وتغلق بواباته، وتتحكم في أقفال الأبواب وماسكاتها</td></tr>
   <tr><td><span class="ltr">City CKT</span></td><td>دائرة الربط مع الجهة المختصة (الدفاع المدني)</td></tr>
   <tr><td><span class="ltr">Keyboards / Annunciators / Printers</span></td><td>لوحة المفاتيح والشاشة / لوحة البيان (المناطق، وزرّا Reset وSilence) / الطابعة</td></tr></tbody></table></div>`},
  {note:TIP+'لماذا توقف اللوحة <b>مراوح التكييف</b>؟ لأن مجاري الهواء تنقل الدخان بسرعة إلى بقية الطوابق والغرف. ولماذا <b>تحرر الأبواب</b>؟ الأبواب المقاومة للحريق تبقى مفتوحة في الأيام العادية بماسكات مغناطيسية، فإذا جاء الإنذار تُحرَّر فتنغلق وتحصر الدخان والنار. جرّب ذلك في «المختبر».'},
  {h:'الشروط الواجب توافرها في مكان لوحة التحكم (الإنذار الآلي من الحريق)',ref:'ص 116',html:`<ol style="list-style:arabic-indic"><li>أ- مكان قليل الخطر بالنسبة للحريق.</li><li>ب- المكان ذو درجة حرارة معتدلة ومرتب وجيد التهوية.</li><li>ج- يجب أن يحتوي هذا المكان على أجهزة كشف وإنذار عن الحريق.</li><li>د- المكان يكون في الدور الأرضي من مبنى عام سهل الدخول والخروج منه، وفي مكان متوسط وأقرب ما يمكن للخروج.</li><li>هـ- يجب أن يكون المكان الذي فيه اللوحة مأهولاً، وإلا وجب أن تجهز اللوحة بآلية لتحويل جميع الإشارة (الأعطال – الإنذار) إلى مكان آخر مأهول.</li><li>و- إذا كانت اللوحة في مكان عام وجب أن تكون مجهزة بقفل.</li></ol>
   <p>إضافة إلى ما ذكر يجب أن يثبت بالقرب من اللوحة <b>مخطط إرشادي</b> يبين المنطقة المحمية وتقسيم المناطق، ومخارج الطوارئ، وأماكن طفايات وأجهزة مكافحة الحريق.</p>`}
 ],
 lab:(el)=>alarmLab(el),
 quiz:[
  {q:'ما «الاعتبار الأول» عند وقوع الحريق داخل المباني؟',o:['حماية الأجهزة','إنقاذ الأرواح','إطفاء الحريق بأي طريقة','الاتصال بشركة التأمين'],c:1,e:'«إنقاذ الأرواح هو الاعتبار الأول عند وقوع الحريق داخل المباني» (ص 114).'},
  {q:'نظام الإنذار الذي يعتمد بشكل رئيس على العنصر البشري هو:',o:['نظام الإنذار الآلي','نظام الإنذار اليدوي','كاشف الدخان الأيوني','الرشاشات'],c:1,e:'نظام الإنذار اليدوي (البسيط والكهربائي) يعتمد على الإنسان في تشغيله (ص 114).'},
  {q:'ما مشكلة الأجراس التي تدق يدويًا؟',o:['صوتها مرتفع جدًا','تأثيرها محدود، وقد يعوق الدخان أو اللهب الشخص عن الاستمرار في تشغيلها','تحتاج كهرباء دائمًا','لا تعمل إلا في الليل'],c:1,e:'(ص 114).'},
  {q:'«عقل» نظام الإنذار الآلي الذي يتلقى إشارة بدء الحريق ويعطي إشارة التشغيل لأجهزة الإنذار هو:',o:['كاشف الدخان','لوحة التحكم (وحدة التحكم والإنذار)','الجرس','مفتاح تدفق الماء'],c:1,e:'«وهي عقل النظام» (ص 115).'},
  {q:'إذا كان المكان الذي فيه لوحة التحكم غير مأهول فإنه يجب:',o:['نقل اللوحة إلى السطح','تجهيز اللوحة بآلية تحوّل جميع إشارات الأعطال والإنذار إلى مكان آخر مأهول','إطفاء اللوحة ليلاً','الاكتفاء بالأجراس اليدوية'],c:1,e:'الشرط (هـ) ص 116.'},
  {q:'في المختبر: ضغطت «إعادة الضبط» ودخان الحريق ما زال عند الكاشف. ماذا يحدث؟',o:['تعود اللوحة إلى المراقبة العادية','يعود الإنذار فورًا لأن السبب ما زال موجودًا','يتعطل الكاشف','تنقطع التغذية'],c:1,e:'إعادة الضبط تمسح الإنذار المحفوظ، لكن الكاشف ما زال يرسل إشارته فيعود الإنذار. أزل السبب أولاً.'}
 ]
});

B.lesson({
 id:'u6-l2',unit:6,order:2,pages:'116–122',
 title:'الكواشف: اللهب والحرارة والدخان',
 summary:'رؤوس الكشف الآلي ثلاث مجموعات: كاشفات اللهب، والكاشفات الحرارية (ثابتة الدرجة، ومعدل الارتفاع، والمركبة)، والكاشفات الدخانية (الأيونية، والضوئية بالحجب وبالتشتت، وكواشف سحب الهواء).',
 stations:[
  {intro:true},
{st:1,short:'رؤوس الكشف',title:'2- أجهزة كشف آلية (رؤوس كاشفة)',ref:'ص 116',
   q:'الحريق يُصدر ضوءاً وحرارة ودخاناً… فأي أثر يتحسسه كل كاشف؟',
   art:SFA.art('ثلاثة رؤوس كاشفة على السقف: للهب، وللحرارة، وللدخان',
    `<path d="M30 92H330" stroke="var(--fg)" stroke-width="5"/>`+
    `<rect x="248" y="96" width="44" height="26" rx="6" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2"/><circle cx="270" cy="122" r="11" fill="var(--blue-soft)" stroke="var(--fg)" stroke-width="2"/><circle cx="270" cy="122" r="4" fill="var(--fg)"/>`+
    `<rect x="160" y="96" width="40" height="18" rx="4" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2"/><rect x="175" y="114" width="10" height="38" rx="5" fill="var(--surface)" stroke="var(--fg)" stroke-width="2"/><circle cx="180" cy="156" r="9" fill="var(--stop)" stroke="var(--fg)" stroke-width="2"/>`+
    `<g transform="translate(90 108) scale(1.6)">${ico('smoke',0,0)}</g>`+
    [[90,170,16],[78,196,20],[96,222,24]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="var(--muted)" opacity=".3"/>`).join('')+flame(180,282,1)+
    `<path d="M262 136L210 210" stroke="var(--live)" stroke-width="2" stroke-dasharray="6 4"/><path d="M180 168V200" stroke="var(--stop)" stroke-width="2" stroke-dasharray="4 4"/>`+
    SFA.ar(270,68,'اللهب',{fs:14.5,w:700})+SFA.ar(180,68,'الحرارة',{fs:14.5,w:700})+SFA.ar(90,68,'الدخان',{fs:14.5,w:700})+
    SFA.hot(240,94,60,44,'كاشف اللهب: «ينظر» إلى الحريق ويتحسس الأشعة التي يصدرها اللهب (الخط المتقطع).')+SFA.hot(154,94,52,74,'الكاشف الحراري: يتأثر بالارتفاع غير العادي في درجة الحرارة.')+SFA.hot(56,94,68,40,'كاشف الدخان: يتحسس الدخان المتصاعد إلى السقف.')),
   cap:'المجموعات الثلاث التي تعرضها الحقيبة.<br><b>مرّر المؤشر على كل كاشف (أو المسه في الجوال) لتعرف ما يتحسسه.</b>',
   side:[
    {predict:{q:'كم مجموعة من الرؤوس الكاشفة تعرض الحقيبة؟',opts:[
     ['اثنتان: الدخان والحرارة',false,'ينقص كاشفات اللهب.'],
     ['ثلاث: اللهب، والحرارة، والدخان',true,'«1- كاشفات الحريق (اللهب)»، «2- الكاشفات الحرارية»، «3- الكاشفات الدخانية» (ص 116–122).'],
     ['خمس',false,'الخمسة هي عناصر النظام الرئيسة التي لم يسمها الكتاب.']]}}
   ],
   body:[
    {book:`<p><b>2- أجهزة كشف آلية (رؤوس كاشفة)</b></p>`,ref:'ص 116'},
    {tip:`<p>العنوان في الكتاب تتبعه مباشرة ثلاث مجموعات، ولكل منها محطة: <b>كاشفات الحريق (اللهب)</b>، و<b>الكاشفات الحرارية</b>، و<b>الكاشفات الدخانية</b>. كل كاشف يتحسس أثراً واحداً من آثار الحريق.</p>`,title:'ثلاث مجموعات'},
    {title:'مختبر مصغّر: أي كاشف يتحسس هذا الأثر؟',widget:(el,B)=>DCML.sort(el,B,{cats:['كاشف اللهب','الكاشف الحراري','كاشف الدخان'],items:[
 ['أشعة غير مرئية (تحت حمراء أو فوق بنفسجية) يصدرها اللهب.',0,'(ص 116).'],
 ['ارتفاع غير عادي في درجة الحرارة.',1,'(ص 117).'],
 ['دخان مرئي وغير مرئي يتصاعد قبل أن يندلع اللهب.',2,'(ص 120).']]})}
   ]},

  {st:2,short:'كاشفات اللهب',title:'1- كاشفات الحريق (اللهب)',ref:'ص 116–117',
   q:'في هنجر طائرات سقفه عالٍ جداً… هل يصل الدخان إلى الكاشف في الوقت المناسب؟',
   art:SFA.art('كاشف لهب ينظر إلى حريق، والشمس قد تؤثر عليه',
    `<rect x="250" y="70" width="60" height="40" rx="8" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2.2"/><circle cx="262" cy="110" r="14" fill="var(--blue-soft)" stroke="var(--fg)" stroke-width="2"/><circle cx="262" cy="110" r="5" fill="var(--fg)"/>`+
    `<path d="M252 122L150 236M262 124L190 240" stroke="var(--live)" stroke-width="2" stroke-dasharray="7 5"/>`+flame(160,268,1.1)+
    `<circle cx="80" cy="96" r="24" fill="var(--live)" stroke="var(--fg)" stroke-width="1.5"/>`+[0,45,90,135,180,225,270,315].map(a=>{const r=a*Math.PI/180;return `<path d="M${(80+30*Math.cos(r)).toFixed(1)} ${(96+30*Math.sin(r)).toFixed(1)}L${(80+40*Math.cos(r)).toFixed(1)} ${(96+40*Math.sin(r)).toFixed(1)}" stroke="var(--live)" stroke-width="3"/>`}).join('')+SFA.arr(118,108,236,112,'var(--live)',1.6)+
    SFA.ar(280,58,'كاشف اللهب',{fs:14.5,w:700})+SFA.ar(80,160,'أشعة الشمس',{fs:13.5})+SFA.ar(240,286,'لهب',{fs:13.5})+
    SFA.hot(246,66,68,62,'كاشف اللهب: يحوي عناصر تتحسس الأشعة غير المرئية (تحت الحمراء أو فوق البنفسجية) التي يصدرها اللهب.')+SFA.hot(40,56,80,80,'أشعة الشمس من العوامل التي تؤثر على أداء كاشف اللهب، «ويمكن عمل بعض التدابير الخاصة لتفادي تأثره بها». ومثلها البرق وأشعة إكس والكشافات القوية.')+SFA.hot(130,200,70,80,'الحريق: الأشعة التي يصدرها اللهب تصل إلى الكاشف مباشرة (الخط المتقطع).')),
   cap:'كاشف اللهب «يرى» الحريق.<br><b>مرّر المؤشر على الكاشف والشمس واللهب (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'أين يُستخدم كاشف اللهب حسب الكتاب؟',opts:[
     ['في غرف النوم والمكاتب الصغيرة فقط',false,'لا يذكر الكتاب ذلك.'],
     ['في الأماكن الخارجية المفتوحة، والأسقف العالية، والأماكن المعرضة لحريق سريع وكبير',true,'مثل هناجر الطائرات ومحطات الوقود (ص 116–117).'],
     ['داخل لوحة التحكم',false,'لا.']]}}
   ],
   body:[
    {book:`<p>تستخدم في الأماكن الخارجية المفتوحة، حيث لا يمكن لأجهزة كشف الدخان أو الحرارة العمل، أو في الأماكن التي فيها غبار وأبخرة، أو في الأماكن ذات الأسقف العالية، مثل هناجر الطائرات حيث يتم استخدام أجهزة كشف الدخان واللهب معاً، حيث تقل استجابة جهاز كشف الدخان بسبب كبر حجم المكان.</p>
     <p>كذلك تستخدم في الأماكن المعرضة لحريق سريع وكبير، مثل محطات الوقود، وتتنوع أصنافها بتنوع الوقود المحتمل للحريق. وهناك أربعة أنواع رئيسة لكواشف اللهب وهي:</p>
     <ol><li>كواشف تعمل بالأشعة تحت الحمراء وكواشف تعمل بالأشعة فوق البنفسجية تعتمد على أساس أن الكثير من المواد تصدر عند تسخينها أشعة معينة غير مرئية، وهذه الكواشف تحتوي على عناصر تتحسس بالأشعة غير المرئية فتعطي إشارة لدائرة الإنذار كي تعمل.</li>
     <li>كواشف كهروضوئية: وهي كواشف تحوي حساسات كهربائية ضوئية بحيث تعتمد على مبدأ تغير الناقلية الكهربائية لبعض المواد عند تعرضها للضوء.</li>
     <li>كواشف تعمل بوميض اللهب: هي أحد نماذج الحساسات الكهروضوئية التي لا تتأثر إلا بالأشعة الضوئية الصادرة عن وميض اللهب تحديداً.</li></ol>
     <p><b>العوامل التي تؤثر على أداء جهاز كشف الحريق (اللهب):</b></p><ul><li>أشعة الشمس ويمكن عمل بعض التدابير الخاصة لتفادي تأثره بها.</li><li>البرق.</li><li>أشعة إكس.</li><li>الكشافات القوية.</li></ul>`,ref:'ص 116–117'},
    {watch:`<p>يقول الكتاب (ص 116) «هناك أربعة أنواع رئيسة لكواشف اللهب» ثم يعدد ثلاثة بنود فقط؛ ويبدو أن البند الأول يجمع نوعين (الأشعة تحت الحمراء والأشعة فوق البنفسجية)، فتصبح أربعة.</p>`,fix:1},
    {tip:`<p>لاحظ أن كل العوامل المؤثرة على كاشف اللهب <b>مصادر ضوء أو أشعة قوية</b> غير الحريق (الشمس، البرق، أشعة إكس، الكشافات)، لأن الكاشف يتحسس الأشعة؛ لذلك قد تخدعه فيعطي إنذاراً كاذباً.</p>`,title:'لماذا هذه العوامل؟'},
    {title:'مختبر مصغّر: هل يناسب كاشف اللهب؟',widget:(el,B)=>DCML.cases(el,B,{cases:[
     {q:'محطة وقود مكشوفة.',opts:[['نعم، كاشف لهب',true,'مكان خارجي مفتوح ومعرض «لحريق سريع وكبير، مثل محطات الوقود».'],['لا، يكفي كاشف دخان',false,'في الأماكن المفتوحة يتبدد الدخان، «حيث لا يمكن لأجهزة كشف الدخان أو الحرارة العمل».']]},
     {q:'كاشف لهب يعطي إنذاراً كل يوم عند الظهر دون حريق، والشمس تدخل من نافذة أمامه.',opts:[['الكاشف معطل ويجب رميه',false,'ليس بالضرورة.'],['أشعة الشمس من العوامل المؤثرة على أدائه، ويمكن عمل تدابير لتفادي تأثره بها',true,'(ص 117).']]}]})}
   ]},

  {st:3,short:'الكاشفات الحرارية',title:'2- الكاشفات الحرارية',ref:'ص 117',
   q:'في مطبخ مطعم مليء بالبخار… لماذا يُفضل كاشف الحرارة على كاشف الدخان؟',
   art:SFA.art('أربع وسائل يعمل بها الكاشف الحراري',
    [[105,100],[255,100],[105,214],[255,214]].map(([x,y])=>`<rect x="${x-62}" y="${y-44}" width="124" height="82" rx="12" fill="var(--surface)" stroke="var(--line)" stroke-width="2"/>`).join('')+
    `<path d="M205 92H305" stroke="var(--live)" stroke-width="5"/><path d="M205 98Q255 80 305 70" stroke="var(--blue)" stroke-width="5" fill="none"/>`+
    `<rect x="70" y="84" width="70" height="12" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.6"/><path d="M105 96Q100 108 105 116Q110 108 105 96Z" fill="var(--live)"/>`+
    `<path d="M210 210h14l5-10l10 20l10-20l10 20l10-20l5 10h14" fill="none" stroke="var(--fg)" stroke-width="2.4"/>`+
    `<rect x="62" y="202" width="86" height="16" rx="8" fill="var(--blue-soft)" stroke="var(--fg)" stroke-width="2"/><path d="M70 210H118" stroke="var(--blue)" stroke-width="7" stroke-linecap="round"/>`+
    SFA.ar(255,130,'(أ) معدن يتمدد',{fs:12.5})+SFA.ar(105,130,'(ب) سبيكة تنصهر',{fs:12.5})+SFA.ar(255,244,'(ج) مقاومة تتغير',{fs:12.5})+SFA.ar(105,244,'(د) سائل يتمدد',{fs:12.5})+SFA.ar(180,46,'وسائل الكشف الحراري',{fs:15,w:700})+
    SFA.hot(193,56,124,82,'أ- شرائح أو أسلاك معدنية تتمدد عند الارتفاع في درجة الحرارة (الشريحة الزرقاء انحنت).')+SFA.hot(43,56,124,82,'ب- انصهار سبيكة من مادة معدنية عند الارتفاع في درجة الحرارة.')+SFA.hot(193,170,124,82,'ج- موصلات كهربائية تتغير مقاومتها عند الارتفاع في درجة الحرارة.')+SFA.hot(43,170,124,82,'د- أنابيب تحتوي على غازات وسوائل تتمدد عند الارتفاع في درجة الحرارة.')),
   cap:'الوسائل الأربع (أ–د) في الكتاب.<br><b>مرّر المؤشر على كل مربع (أو المسه في الجوال) لتقرأ الوسيلة.</b>',
   side:[
    {predict:{q:'لماذا يُركّب الكاشف الحراري في الأماكن التي فيها كثير من الأبخرة والغازات؟',opts:[
     ['لأنه أرخص',false,'لا يذكر الكتاب الثمن.'],
     ['لأن كاشف الدخان قد يعطي فيها إنذارات كاذبة',true,'«مما قد ينتج عنه إنذارات كاذبة، في حالة استخدام أجهزة كشف الدخان» (ص 117).'],
     ['لأن الأبخرة ترفع الحرارة دائماً',false,'ليس هذا سبب الكتاب.']]}}
   ],
   body:[
    {book:`<p>وهي تتأثر بالارتفاع غير العادي في درجة الحرارة وتعمل بإحدى الوسائل التالية:</p>
     <ol style="list-style:none;padding-inline-start:4px"><li>أ- شرائح أو أسلاك معدنية تتمدد عند الارتفاع في درجة الحرارة.</li><li>ب- انصهار سبيكة من مادة معدنية عند الارتفاع في درجة الحرارة.</li><li>ج- موصلات كهربائية تتغير مقاومتها عند الارتفاع في درجة الحرارة.</li><li>د- أنابيب تحتوي على غازات وسوائل تتمدد عند الارتفاع في درجة الحرارة.</li></ol>
     <p>ويركب هذا الجهاز في الأماكن المعرضة إلى إحدى العوامل التي لا تسمح باستخدام جهاز كشف الدخان، خاصة في الأماكن التي ينتج فيها الكثير من الأبخرة والغازات مما قد ينتج عنه إنذارات كاذبة، في حالة استخدام أجهزة كشف الدخان، كذلك يستخدم كشف الحرارة في الأماكن التي يمكن أن يحدث منها حرائق سريعة الاشتعال وبدون دخان تقريباً.</p>
     <p>وهناك ثلاثة أصناف من هذه الأجهزة هي:</p>`,ref:'ص 117'},
    {title:'مختبر مصغّر: حرارة أم دخان؟',widget:(el,B)=>DCML.sort(el,B,{intro:'حسب نص الكتاب، أي كاشف يناسب المكان؟',cats:['كاشف حراري','كاشف دخان'],items:[
 ['غرفة غسيل فيها بخار كثير.',0,'الأبخرة قد تسبب «إنذارات كاذبة» لكاشف الدخان (ص 117).'],
 ['أرشيف ملفات وأوراق.',1,'الحريق فيه يبدأ ببطء ويتصاعد منه دخان قبل اللهب؛ والكاشف الأيوني «يستخدم في مواقع الملفات والأوراق» (ص 120).'],
 ['مخزن مواد قد تحترق بسرعة وبدون دخان تقريباً.',0,'«حرائق سريعة الاشتعال وبدون دخان تقريباً» (ص 117).']]})}
   ]},

  {st:4,short:'الصنف الأول: الثابتة',title:'الصنف الأول: ذو الدرجة الحرارية الثابتة',ref:'ص 117–118',
   q:'القرص الصغير ينقلب عند درجة معينة… فهل يرجع وحده إذا بردت الغرفة؟',
   art:SFA.art('كاشف حراري بقرص ثنائي المعدن سريع الانقلاب، والتلامس مغلق',
    SFA.emb(snapSVG(1,0,0),[10,10,310,240],[24,64,312,242])+SFA.ar(180,52,'القرص انقلب فأغلق التلامس',{fs:14.5,w:700})+
    SFA.hot(100,214,160,40,'القرص ثنائي المعدن ⟦Bi-Metallic Snap Disk⟧: مقعر في الحالة العادية، ويصبح محدباً عند ارتفاع الحرارة إلى درجة معينة.')+SFA.hot(160,140,40,74,'دبوس غير موصل ⟦Nonconducting Standoff⟧: ينقل حركة القرص إلى الجسر.')+SFA.hot(60,104,240,40,'تلامسا الإنذار المفتوحان عادة ⟦Normally Open Alarm Contacts⟧: يُغلقهما الجسر (الأصفر) فتصل الإشارة إلى اللوحة.')+SFA.hot(30,256,300,30,'مجمع الحرارة ⟦Heat Collector⟧: يجمع حرارة الهواء ويوصلها إلى القرص.')),
   cap:'الشكل <span class="ltr">(6-4)</span> بعد التسخين.<br><b>مرّر المؤشر على القرص والدبوس والتلامسين والمجمع (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'ما عيب الثرموستات الخطي؟',opts:[
     ['يعمل بالأشعة فوق البنفسجية',false,'هذا من كواشف اللهب.'],
     ['لا يعود إلى وضعيته الأصلية تلقائياً، ويجب فصل السلكين',true,'(ص 118).'],
     ['لا يستجيب للحرارة',false,'يستجيب: ينصهر الغطاء ويتلامس السلكان.']]}}
   ],
   body:[
    {book:`<p>حيث يستجيب الجهاز عند تجاوز حرارة المكان درجة الحرارة المضبوطة عليها الجهاز. وهي على أنواع:</p>
     <p><b>1- الثرموستات ذات الصفيحة المزدوجة:</b> وهو أكثر أنواع الثرموستات شيوعاً حيث يعتمد على اختلاف معامل التمدد الحراري لمعدنين مختلفين مثبتين مع بعضهما بحيث يسبب ذلك حركة لعنصر مربوط معهما بحيث يقطع التيار الكهربائي ضمن الثرموستات وبالتالي يفصل التيار الكهربائي القادم من المنبع. انظر الشكل (6-3)</p>`,ref:'ص 117–118'},
    {html:SFA.fig(fig63(),'الشكل <span class="ltr">(6-3)</span> ص 118 — مقطع في كاشف نقطي <span class="ltr">(Section of spot type rate compensation detector)</span>.',560)},
    {watch:`<p>الشكل <span class="ltr">(6-3)</span> ليس ثرموستات بصفيحة مزدوجة بسيطة كما يقول النص، بل «كاشف نقطي تعويضي للمعدل»: غلاف خارجي يتمدد بالحرارة فيقرّب دعامتين قليلتي التمدد حتى تتلامسا. كذلك يقول النص إن الثرموستات «يقطع التيار»، أما كاشف الإنذار فيُغلق تلامساً مفتوحاً عادةً كما في الشكل <span class="ltr">(6-4)</span> <span class="ltr">(Normally Open Alarm Contacts)</span>، فيصل الإشارة إلى اللوحة.</p>`,fix:1},
    {book:`<p><b>2- الترموستات ذات القرص سريع الحركة:</b> عبارة عن جهاز يحتوي على قرص معدني حساس للحرارة ذي شكل مقعر في الحالة العادية، بحيث يتغير شكله إلى محدب عند ارتفاع الحرارة إلى درجة حرارة معينة، ومن ميزات هذا الجهاز أنه يعود إلى وضعيته الأصلية تلقائياً عند انخفاض درجة الحرارة. انظر الشكل (6-4)</p>
     <p><b>3- الثرموستات الخطي:</b> يتألف العنصر الحساس فيه من سلك مزدوج مصنوع من معدنين مختلفين يفصل بينهما غطاء حساس للحرارة موصل مباشرة مع كلا السلكين. فعندما ترتفع درجة الحرارة المعيّر عليها مسبقاً عندئذ ينصهر الغطاء بينهما ويتلامس كل من السلكين بحيث يتم تشغيل الإنذار. ومن سيئات هذا الجهاز أنه لا يعود إلى وضعيته الأصلية تلقائياً وإنما يجب فصل السلكين عن بعضهما.</p>`,ref:'ص 118'},
    {title:'مختبر مصغّر: سخّن ثم برّد',widget:(el,B)=>DCML.lab(el,B,{intro:'اختر الكاشف، ثم غيّر حرارة المكان بالترتيب.',
     predict:{q:'سخّنت الكاشفين حتى أعطيا إنذاراً، ثم بردت الغرفة. أيهما يعود جاهزاً وحده؟',opts:[['الثرموستات الخطي',false,'غطاؤه انصهر والسلكان تلامسا؛ «يجب فصل السلكين عن بعضهما».'],['القرص سريع الحركة',true,'«يعود إلى وضعيته الأصلية تلقائياً عند انخفاض درجة الحرارة» (ص 118).'],['كلاهما',false,'الخطي لا يعود تلقائياً.']]},
     ins:[{k:'t',l:'الكاشف',seg:[['disk','القرص سريع الحركة (6-4)'],['lin','الثرموستات الخطي']],v:'disk'},{k:'h',l:'حرارة المكان',seg:[[0,'عادية'],[1,'تجاوزت الدرجة المضبوطة'],[2,'بردت مرة أخرى']],v:0}],
     calc:(s)=>{const hot=s.h===1,al=s.t==='disk'?hot:s.h>=1;let pic;
      if(s.t==='disk')pic=snapSVG(hot?1:0,0,0);
      else{const m=s.h>=1;pic=`<svg viewBox="0 0 330 150" role="img" aria-label="ثرموستات خطي: سلكان بينهما غطاء حساس للحرارة" style="font-family:var(--font)"><path d="M20 ${m?72:60}H310" style="stroke:var(--live);stroke-width:5"/><path d="M20 ${m?78:90}H310" style="stroke:var(--blue);stroke-width:5"/>`+(m?`<circle cx="165" cy="75" r="7" style="fill:#ffd43b;stroke:var(--fg)"/>`:`<rect x="20" y="66" width="290" height="18" rx="9" style="fill:var(--surface-2);stroke:var(--muted);stroke-dasharray:4 3"/>`)+tA(165,130,m?'الغطاء انصهر والسلكان متلامسان':'غطاء حساس للحرارة يفصل السلكين',{fs:12,m:1})+'</svg>'}
      return {pic,msg:(al?'<b>إنذار:</b> التلامس مغلق. ':'لا إنذار. ')+(s.h===2?(s.t==='disk'?'بردت الغرفة فعاد القرص مقعراً وانفتح التلامس: الكاشف جاهز من جديد.':'بردت الغرفة لكن السلكين ما زالا متلامسين: «لا يعود إلى وضعيته الأصلية تلقائياً وإنما يجب فصل السلكين».'):''),cls:s.h===2&&s.t==='lin'?'warn':''}}})}
   ]},

  {st:5,short:'الصنف الثاني: المعدل',title:'الصنف الثاني: جهاز كشف معدل تغير مقدار درجة الحرارة خلال فترة زمنية محدودة',ref:'ص 119',
   q:'الغرفة تسخن ببطء من الشمس، أو تسخن فجأة من حريق… هل يفرق الكاشف بينهما؟',
   art:SFA.art('ارتفاع سريع في درجة الحرارة يعطي إنذاراً، والارتفاع البطيء يؤخره',
    `<path d="M70 250V70M70 250H300" stroke="var(--fg)" stroke-width="2.4"/><path d="M70 236Q190 226 300 196" fill="none" stroke="var(--on)" stroke-width="4"/><path d="M70 236Q110 230 150 90" fill="none" stroke="var(--stop)" stroke-width="4"/><circle cx="142" cy="120" r="9" fill="var(--stop)"/>`+
    SFA.ar(232,174,'ارتفاع بطيء',{fs:14,c:'var(--on)'})+SFA.ar(190,98,'ارتفاع سريع ← إنذار',{fs:14,c:'var(--stop)'})+SFA.ar(186,276,'الزمن',{fs:13.5})+SFA.ar(50,60,'الحرارة',{fs:13.5})+SFA.ar(180,46,'سرعة الارتفاع هي المهمة',{fs:15,w:700})+
    SFA.hot(74,80,100,170,'ارتفاع سريع: العنصر الأول «يعطي إنذاراً عند ارتفاع درجة الحرارة بسرعة».')+SFA.hot(176,170,128,60,'ارتفاع بطيء: العنصر الثاني «يعمل على تأخير إعطاء الإنذار عند السرعات المنخفضة».')),
   cap:'منحنيان توضيحيان بلا أرقام (ليسا من الكتاب).<br><b>مرّر المؤشر على كل منحنى (أو المسه في الجوال) لتعرف ما يفعله الكاشف.</b>',
   side:[
    {predict:{q:'معظم الكواشف الحرارية مصممة على الاستجابة إذا تجاوزت درجة الحرارة:',opts:[
     ['من 57 °C إلى 82 °C',true,'«من 57م إلى 82م» (ص 119)، وهناك أنواع تتأثر بدرجات أقل.'],
     ['من 20 °C إلى 30 °C',false,'هذه حرارة الغرفة العادية.'],
     ['أكثر من 500 °C',false,'متأخر جداً لكشف مبكر.']]}}
   ],
   body:[
    {book:`<p>يعتمد تشغيل هذه الحساسات على سرعة ارتفاع درجة الحرارة إلى سرعة محددة مسبقاً، والحساسات من هذا النوع تحتوي على عنصري تشغيل أو تحكم أحدهما يعطي إنذاراً عند ارتفاع درجة الحرارة بسرعة، والثاني يعمل على تأخير إعطاء الإنذار عند السرعات المنخفضة لدرجة الحرارة [أقل من السرعة المعيّر عليها الجهاز]. ومعظم الكواشف الحرارية مصممة على التأثير والاستجابة إذا تجاوزت درجة الحرارة من ${lt('57 °C')} إلى ${lt('82 °C')} وهناك أنواع أخرى تتأثر بدرجات حرارة أقل حسب طبيعة الموجودات ومدى قابليتها للاشتعال.</p>
     <p>إن مميزات هذه الأجهزة كثيرة ومتعددة:</p><ol><li>يمكن أن تعيّر بحيث تعمل بشكل أسرع من الأجهزة ذات درجة الحرارة الثابتة، ضمن كل الظروف.</li><li>يمكن استخدامها وتكون فعالة ضمن مجال كبير من درجات الحرارة.</li><li>يمكن إعادة تشغيلها وتعييرها بسرعة.</li><li>يمكن إعطاؤها تسامحاً محدداً في اختلاف درجة الحرارة.</li></ol>`,ref:'ص 119'},
    {tip:`<p>الكاشف الثابت ينتظر أن تصل الحرارة إلى درجة معينة. أما كاشف <b>المعدل</b> فينظر إلى <b>سرعة</b> الارتفاع: الحريق يرفع الحرارة بسرعة فينذر مبكراً، والتسخين البطيء العادي (شمس، تدفئة) لا يجعله ينذر.</p>`,title:'الفرق عن الصنف الأول'},
    {title:'مختبر مصغّر: هل ينذر كاشف المعدل؟',widget:(el,B)=>DCML.cases(el,B,{cases:[
     {q:'حريق في سلة أوراق يرفع حرارة الغرفة بسرعة كبيرة.',opts:[['ينذر مبكراً',true,'العنصر الأول «يعطي إنذاراً عند ارتفاع درجة الحرارة بسرعة».'],['لا ينذر حتى تصل الحرارة إلى درجة ثابتة',false,'هذا سلوك الصنف الأول.']]},
     {q:'الشمس تدفئ مخزناً ببطء طوال الصباح.',opts:[['ينذر فوراً',false,'التغير بطيء.'],['يؤخر الإنذار لأن الارتفاع أبطأ من السرعة المعيّر عليها',true,'العنصر الثاني «يعمل على تأخير إعطاء الإنذار عند السرعات المنخفضة».']]}]})}
   ]},

  {st:6,short:'الصنف الثالث: المركب',title:'الصنف الثالث: الحساسات ذات درجة الحرارة الثابتة وسرعة محددة لارتفاع درجة الحرارة',ref:'ص 119–120',
   q:'حريق بطيء جداً لا يرفع الحرارة بسرعة… هل يفلت من كاشف المعدل؟',
   art:SFA.art('كاشف حراري مركب: غشاء يرتفع بتمدد الهواء، ولحام ينصهر عند الحرارة العالية',
    SFA.emb(combSVG(1,0,0.5),[0,10,360,260],[8,60,344,240])+SFA.ar(180,48,'كاشف مركّب',{fs:15,w:700})+
    SFA.hot(36,82,70,40,'فتحة التنفيس ⟦Vent⟧: يخرج منها الهواء المتمدد ببطء عند التسخين البطيء.')+SFA.hot(80,170,200,30,'الغشاء المرن ⟦C⟧: إذا تمدد الهواء أسرع مما تصرفه الفتحة انضغط الغشاء وأغلق الدائرة.')+SFA.hot(150,74,60,90,'نقطة التلامس ⟦D⟧ (القاطعة الكهربائية).')+SFA.hot(140,220,80,50,'اللحام سهل الانصهار والنابض ⟦G⟧: إذا انصهر اللحام بالحرارة العالية تمدد النابض ودفع الغشاء — الجزء الثابت الدرجة.')),
   cap:'الشكل <span class="ltr">(6-5)</span> والغشاء مرتفع.<br><b>مرّر المؤشر على الفتحة والغشاء والتلامس واللحام (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'ما الذي يضيفه الجزء ذو الدرجة الثابتة في هذا الصنف؟',opts:[
     ['التنبيه بالحرائق البطيئة الاشتعال',true,'يغطي «الحالة التي تكون فيها سرعة ازدياد درجة الحرارة منخفضة، وبالتالي يمكنه التنبيه بالحرائق البطيئة الاشتعال» (ص 119).'],
     ['تحسس الدخان',false,'هذا كاشف حراري.'],
     ['تحسس أشعة اللهب',false,'هذا كاشف اللهب.']]}}
   ],
   body:[
    {book:`<p>تم تطوير أنواع من الترموستات بحيث تعتمد على التحسس بسرعة ارتفاع درجة الحرارة بحيث يقوم الجزء الذي يتحسس بدرجة الحرارة الثابتة بتغطية الحالة التي تكون فيها سرعة ازدياد درجة الحرارة منخفضة، وبالتالي يمكنه التنبيه بالحرائق البطيئة الاشتعال.</p>
     <p>يتألف هذا النوع من الحساسات من علبة معدنية تحوي فتحة تنفيس للهواء صغيرة جداً وغشاء مرناً يحمل صفيحة توصيل معدنية، فعندما تتعرض هذه العلبة للحرارة يسخن الهواء الذي بداخلها ويتمدد فإذا زادت عن مقدرة فتحة التنفيس في تصريف الهواء، عندئذ ينضغط الغشاء المرن والذي بدوره يحرك الصفيحة المرنة لتغلق الدائرة الكهربائية، أما عندما يكون التغير في درجة الحرارة بسيطاً فعندئذٍ يتمدد الهواء ببطء مما يسمح بخروجه من الفتحة الصغيرة دون أن يؤدي ذلك إلى تحريك الغشاء. ويعمل هذا الحساس كحساس ذي درجة ثابتة وعندما تنصهر الحلقة المعدنية بارتفاع درجة الحرارة يتمدد النابض G مما يؤدي إلى دفع الغشاء C لوصل القاطعة الكهربائية D. انظر الشكل (6-5)</p>`,ref:'ص 119'},
    {html:SFA.fig(combSVG(0,0,0),'الشكل <span class="ltr">(6-5)</span> ص 120 — كاشف مركب: معدل الارتفاع ودرجة الحرارة الثابتة <span class="ltr">(Combination of Rate-of-Rise / Fixed Temperature)</span>.',380)},
    {watch:`<p>يذكر النص (ص 119) الحروف <span class="ltr">G</span> (النابض) و<span class="ltr">C</span> (الغشاء) و<span class="ltr">D</span> (القاطعة)، لكنها غير مكتوبة على الشكل <span class="ltr">(6-5)</span> في الكتاب؛ أضفناها على رسمنا في مواضعها.</p>`,fix:1},
    {title:'مختبر مصغّر: ثلاث طرق للتسخين',widget:(el,B)=>DCML.lab(el,B,{intro:'اختر كيف ترتفع حرارة المكان، وانظر إلى الغشاء واللحام.',
     ins:[{k:'m',l:'التسخين',seg:[['slow','بطيء وبسيط'],['fast','سريع (حريق مشتعل)'],['high','بطيء لكنه وصل إلى حرارة عالية']],v:'slow'}],
     calc:(s)=>{const d=s.m==='slow'?0:1,melt=s.m==='high'?1:0,air=s.m==='slow'?0.8:0.25;
      return {pic:combSVG(d,melt,air),msg:s.m==='slow'?'الهواء يتمدد ببطء ويخرج من فتحة التنفيس، فلا يتحرك الغشاء: لا إنذار.':s.m==='fast'?'<b>إنذار (معدل الارتفاع):</b> الهواء يتمدد أسرع مما تصرفه الفتحة، فينضغط الغشاء ويغلق الدائرة.':'<b>إنذار (الدرجة الثابتة):</b> انصهر اللحام فتمدد النابض G ودفع الغشاء C لوصل القاطعة D — هكذا لا يفلت الحريق البطيء.',cls:s.m==='slow'?'':'warn'}}})},
    {book:`<p><b>العوامل المؤثرة على أداء جهاز كشف الحرارة:</b></p><ul><li>ارتفاع درجة حرارة المكان أو انخفاضها الشديد، ناتجاً عن تشغيل وسيلة تدفئة.</li><li>ارتفاع السقف.</li><li>عدم إعطاء إنذار عند اشتعال الحرائق التي تنتشر بشكل بطيء جداً.</li></ul>`,ref:'ص 120'}
   ]},

  {st:7,short:'الكاشفات الدخانية',title:'3- الكاشفات الدخانية',ref:'ص 120',
   q:'سلك كهربائي يسخن ويدخن ساعة قبل أن يشتعل… أي كاشف يلتقط هذه الساعة؟',
   art:SFA.art('جهاز كهربائي يدخن قبل أن يندلع اللهب، والدخان يصل إلى كاشف السقف',
    `<path d="M30 80H330" stroke="var(--fg)" stroke-width="5"/><g transform="translate(180 96) scale(1.8)">${ico('smoke',0,0,{on:1})}</g>`+
    [[170,140,16],[188,170,20],[174,204,22],[190,232,18]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="var(--muted)" opacity=".3"/>`).join('')+
    `<rect x="132" y="250" width="96" height="40" rx="6" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2.2"/><path d="M228 270Q262 270 268 296" fill="none" stroke="var(--fg)" stroke-width="3"/>`+
    SFA.ar(180,58,'يكشف الحريق في بدايته',{fs:15,w:700})+SFA.ar(84,180,'غازات ودخان',{fs:14})+SFA.ar(84,198,'قبل اللهب',{fs:14})+
    SFA.hot(140,80,80,40,'كاشف الدخان على السقف: «إمكانية كشف معظم أنواع الحرائق وهي في بدايتها».')+SFA.hot(150,124,60,124,'الدخان والغازات تتصاعد «قبل أن يندلع فيها اللهب».')+SFA.hot(128,246,104,48,'جهاز كهربائي: من المواقع التي ينتشر فيها الحريق ببطء نسبياً.')),
   cap:'لماذا يُستخدم كاشف الدخان بنسبة عالية.<br><b>مرّر المؤشر على الكاشف والدخان والجهاز (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'لماذا تُستخدم الكاشفات الدخانية بنسبة عالية جداً في أنظمة الكشف؟',opts:[
     ['لأنها تكشف معظم أنواع الحرائق وهي في بدايتها',true,'(ص 120).'],
     ['لأنها لا تتأثر بأي شيء',false,'لها عوامل تؤثر على أدائها (ص 122).'],
     ['لأنها تطفئ الحريق',false,'الكواشف لا تطفئ.']]}}
   ],
   body:[
    {book:`<p>وهو جهاز يستخدم بنسبة عالية جداً في أنظمة الكشف عن الحريق نظراً لتميزه بإمكانية كشف معظم أنواع الحرائق وهي في بدايتها، ويخصص هذا الجهاز للمواقع التي تنتشر فيها الحرائق ببطء نسبياً، والتي يتصاعد من موادها كميات من الغازات قبل أن يندلع فيها اللهب مثل مواقع الأجهزة الكهربائية أو المواد الخشبية أو المنتجات القطنية.</p><p>وتصنف هذه الأجهزة إلى أربعة أصناف:</p>`,ref:'ص 120'},
    {title:'تحقق سريع: صح أم خطأ؟',widget:(el,B)=>DCML.tf(el,B,{items:[
 ['كاشف الدخان مناسب لمخزن منتجات قطنية.',true,'من أمثلة الكتاب «المنتجات القطنية» (ص 120).'],
 ['كاشف الدخان أفضل اختيار لمحطة وقود مكشوفة.',false,'في الأماكن المفتوحة يُستخدم كاشف اللهب (ص 116)، و«الأماكن المفتوحة الخارجية» من العوامل المؤثرة على كاشف الدخان (ص 122).']]})}
   ]},

  {st:8,short:'الأيوني',title:'الصنف الأول: جهاز كشف الدخان ذو الحساسات الأيونية',ref:'ص 120–121',
   q:'تيار ضعيف جداً يمر في الهواء داخل الكاشف… فماذا يفعل به الدخان؟',
   art:SFA.art('دائرة حجرة التأين في الهواء النقي',
    SFA.emb(ionSVG(100,0,0),[0,0,320,240],[20,62,320,240])+SFA.ar(180,52,'حجرة التأين — هواء نقي',{fs:15,w:700})+
    SFA.hot(140,62,80,58,'جهاز قياس التيار: المؤشر بين 1 و2 في الهواء النقي (الشكل ب).')+SFA.hot(126,170,114,84,'حجرة التأين ⟦Ionization Chamber⟧: المادة المشعة تجعل الهواء متأيناً (الأيونات + و−) فيمر تيار ضعيف جداً.')+SFA.hot(40,130,40,60,'البطارية: فرق الجهد المطبق على طرفي الحجرة.')+SFA.hot(130,262,104,32,'مادة مشعة ⟦Radioactive Material⟧ في أسفل الحجرة.')),
   cap:'الشكل <span class="ltr">(6-6)</span>-ب: في حالة نقاوة الهواء من الدخان.<br><b>مرّر المؤشر على الجهاز والحجرة والبطارية والمادة المشعة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'ماذا يحدث للتيار في حجرة التأين عند دخول الدخان؟',opts:[
     ['يزيد',false,'الدخان يرتبط بالأيونات فيقل عدد الأيونات الحرة التي تحمل التيار.'],
     ['يقل',true,'في الشكل (6-6)-أ المؤشر بين 0 و1 مع الدخان بدل ما بين 1 و2.'],
     ['لا يتغير',false,'لو لم يتغير لما عرف الكاشف بوجود الدخان.']]}}
   ],
   body:[
    {book:`<p>وهو يتحسس الدخان المرئي وغير المرئي كما يتحسس بالمعلقات الصغيرة التي تتطاير إلى الأعلى بسبب الحرارة ويستخدم في مواقع الملفات والأوراق. انظر الشكل (6-6 أ وب)</p>
     <p>وتتألف هذه الحساسات من حجرتي تأيين أو أكثر ودائرات تكبير الإشارة المرتبطة بهذه الحجرات، ويعتمد عمل هذه الحساسات الأيونية على تحولها إلى مصدر للمواد النشطة إشعاعياً، حيث يتأين الهواء ضمن حجرة التأيين ويصبح ناقلاً للتيار الكهربائي بحيث يسمح فرق الجهد المطبق على طرفي حجرة التأيين لتيار كهربائي ضعيف جداً بالتدفق بسبب انتقال الأيونات إلى قطب ذي إشارة كهربائية معاكسة، وعند دخول الدخان إلى داخل هذه الحجرة يرتبط بالأيونات وبالتالي يصل الجهد إلى حد معين يؤدي ذلك إلى تشغيل دائرة الإنذار.</p>`,ref:'ص 120'},
    {watch:`<p>في الكتاب (ص 120) «حجرتي تأمين» و«حجرة التأمين»، والصواب «التأيين» <span class="ltr">(Ionization Chamber)</span> فكتبناها مصححة؛ وقوله «تحولها إلى مصدر للمواد النشطة إشعاعياً» المقصود به احتواؤها على مصدر لمادة مشعة كما في الشكل <span class="ltr">(Radioactive Material)</span>.</p>`,fix:1},
    {tip:`<p>النص يقول «يصل الجهد إلى حد معين»، والشكل يبيّن أن <b>التيار يقل</b> بوجود الدخان. الفكرتان متفقتان: الدائرة الإلكترونية تراقب هبوط التيار (أو تغير الجهد الذي يسببه) فإذا تجاوز حداً معيناً أعطت الإنذار.</p>`,title:'الجهد أم التيار؟'},
    {title:'مختبر مصغّر: أدخل الدخان إلى الحجرة',widget:(el,B)=>DCML.lab(el,B,{intro:'غيّر كمية الدخان وراقب مؤشر التيار. مواضع المؤشر كما في الشكل (6-6)؛ والدرجة الوسطى توضيحية.',
     ins:[{k:'n',l:'الدخان في الحجرة',seg:[[0,'هواء نقي'],[1,'قليل'],[2,'كثيف']],v:0}],
     calc:(s)=>({pic:ionSVG([100,72,40][s.n],[0,4,9][s.n],s.n===2),msg:['هواء نقي: التيار أكبر (المؤشر بين 1 و2) — الشكل (6-6)-ب.','دخان قليل: بعض الأيونات ارتبطت بجسيمات الدخان فقل التيار، ولم يصل إلى حد الإنذار بعد.','<b>إنذار:</b> دخان كثيف ارتبط بالأيونات فهبط التيار (المؤشر قرب 0–1) — الشكل (6-6)-أ.'][s.n],cls:s.n===2?'warn':''})})},
    {html:`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px">${SFA.fig(ionSVG(40,8,0),'الشكل <span class="ltr">(6-6)</span>-أ ص 121 — في حالة وجود الدخان <span class="ltr">(Current With Smoke)</span>.',320)}${SFA.fig(ionSVG(100,0,0),'الشكل <span class="ltr">(6-6)</span>-ب ص 121 — في حالة نقاوة الهواء <span class="ltr">(Current With Clean Air)</span>.',320)}</div>`}
   ]},

  {st:9,short:'الكهروضوئي',title:'الصنف الثاني: جهاز كشف الدخان الكهربائي الضوئي',ref:'ص 121',
   q:'شعاع ضوء يعبر الكاشف إلى حساس في الجهة المقابلة… ماذا يحدث له حين يمر الدخان؟',
   art:SFA.art('كاشف دخان ضوئي بحجب الضوء: الدخان يحجب جزءاً من الأشعة',
    SFA.emb(obsSVG(43,8,0),[0,30,340,170],[14,90,332,166])+SFA.ar(180,66,'الدخان يحجب الضوء',{fs:15,w:700})+SFA.ar(180,276,'ضوء أقل يصل إلى الحساس',{fs:14,c:'var(--stop)'})+
    SFA.hot(14,140,44,60,'مصدر الضوء ⟦Light Source⟧ وأمامه عدسة ⟦Lens⟧ تجعل الأشعة متوازية.')+SFA.hot(120,110,120,90,'جسيمات الدخان ⟦Smoke Particles⟧ تقطع بعض الأشعة فتنحرف ولا تصل.')+SFA.hot(290,120,40,90,'الحساس الضوئي ⟦Light Sensor⟧: يقيس الضوء الواصل؛ إذا قل إلى حد معين عمل الإنذار.')),
   cap:'الشكل <span class="ltr">(6-7)</span>-ب: نظرية العمل عند وجود الدخان.<br><b>مرّر المؤشر على المصدر والدخان والحساس (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'أين يُستخدم كاشف الدخان الكهربائي الضوئي حسب الكتاب؟',opts:[
     ['في مواقع الملفات والأوراق',false,'هذا الكاشف الأيوني.'],
     ['في أماكن وجود الكابلات',true,'(ص 121).'],
     ['في الأماكن الخارجية المفتوحة',false,'هذه لكواشف اللهب.']]}}
   ],
   body:[
    {book:`<p>وهو يتحسس الدخان المرئي والمعلقات الكبيرة التي تتطاير للأعلى بفعل الحرارة، ويستخدم في أماكن وجود الكابلات.</p>
     <p>وتعمل هذه الحساسات بتأثير الأشعة بحيث يؤدي مرور الدخان من خلالها إلى قطع الأشعة الضوئية الواردة من عاكس ضوئي خاص في الحساس، وبالتالي تقل الكثافة الضوئية إلى حد معين، وبذلك يتم تشغيل جهاز الإنذار الموصل مع الحساس عند وصول كثافة الدخان إلى كثافة محددة. انظر الشكل (6-7 أ وب)</p>`,ref:'ص 121'},
    {title:'مختبر مصغّر: كم ضوءاً يصل؟',widget:(el,B)=>DCML.lab(el,B,{intro:'غيّر كمية الدخان وانظر كم شعاعاً يصل إلى الحساس. الدرجة الوسطى توضيحية.',
     ins:[{k:'n',l:'الدخان',seg:[[0,'هواء نقي'],[1,'قليل'],[2,'كثيف']],v:0}],
     calc:(s)=>({pic:obsSVG([100,72,43][s.n],[0,4,9][s.n],s.n===2),msg:['هواء نقي: كل الأشعة تصل إلى الحساس — الشكل (6-7)-أ.','دخان قليل: بعض الأشعة انقطعت، والكثافة الضوئية لم تقل بعد إلى حد الإنذار.','<b>إنذار:</b> «تقل الكثافة الضوئية إلى حد معين» فيعمل جهاز الإنذار — الشكل (6-7)-ب.'][s.n],cls:s.n===2?'warn':''})})}
   ]},

  {st:10,short:'الضوء المنعكس',title:'الصنف الثالث: جهاز كشف الدخان الذي يعمل بتأثير الأمواج الإشعاعية',ref:'ص 121–122',
   q:'هنا الحساس مختبئ في ركن مظلم لا يصله الضوء… فكيف يكتشف الدخان؟',
   art:SFA.art('كاشف دخان بتشتت الضوء: الدخان يعكس الضوء إلى الحساس في الفرع الجانبي',
    SFA.emb(scaSVG(60,8,0),[0,30,340,180],[14,74,332,176])+SFA.ar(180,60,'الدخان يعكس الضوء إلى الحساس',{fs:14.5,w:700})+
    SFA.hot(14,100,44,46,'الثنائي الباعث للضوء ⟦Light Emitting Diode⟧.')+SFA.hot(80,92,240,60,'في الهواء النقي يمر الضوء في الحجرة ولا يدخل الفرع الجانبي. جسيمات الدخان تعكس جزءاً منه ⟦Reflected Light⟧.')+SFA.hot(220,190,80,60,'الحساس الضوئي ⟦Light Sensor⟧ في نهاية الفرع المائل، «ضمن المجال المظلم للجهاز».')),
   cap:'الشكل <span class="ltr">(6-8)</span>-ب: نظرية العمل عند وجود الدخان.<br><b>مرّر المؤشر على المصدر والحجرة والحساس (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'في الشكل (6-8)، ماذا يصل إلى الحساس في الهواء النقي؟',opts:[
     ['كل الضوء',false,'الحساس في فرع جانبي خارج طريق الضوء.'],
     ['لا يصله ضوء تقريباً',true,'الحساس «ضمن المجال المظلم للجهاز»؛ الدخان هو الذي يعكس الضوء إليه.'],
     ['نصف الضوء',false,'لا شيء يحرف الضوء إليه في الهواء النقي.']]}}
   ],
   body:[
    {book:`<p>ويستخدم في الأماكن المغلقة ذات التكييف المركزي.</p>
     <p>وتستخدم هذه الحساسات الأشعة الضوئية المنعكسة على عنصر تحسس ضوئي ضمن حيز الجهاز شبه المغلق والموضوع ضمن المجال المظلم للجهاز.</p>
     <p>والجهاز عبارة عن علبة شبه مغلقة تحوي مصدراً وعنصر تحسس ضوئي مقابله، موضوع ضمن علبة الجهاز. عند دخول الدخان من فتحة الجهاز عندئذٍ ستقل كمية الأشعة الواردة إلى عنصر التحسس الضوئي، لأن ذرات الدخان سوف تعكس كمية من الأشعة الضوئية الواردة إلى عنصر التحسس الضوئي، وعندما تصل كثافة الدخان وبالتالي كثافة الضوء إلى درجة معينة، يتوقف تأثير العنصر الحساس بالضوء وبالتالي يشتغل نظام الإنذار. كما في الشكل (6-8 أ وب)</p>`,ref:'ص 121–122'},
    {watch:`<p>نص الكتاب لهذا الصنف يقول إن الأشعة الواصلة إلى عنصر التحسس <b>تقل</b> عند دخول الدخان، وإن الإنذار يعمل عندما «يتوقف تأثير العنصر الحساس بالضوء». وهذا يخالف الشكل <span class="ltr">(6-8)</span> نفسه: الحساس في فرع جانبي خارج طريق الضوء، فلا يصله ضوء في الهواء النقي، والدخان يعكس الضوء <b>إليه</b> فيزيد ما يصله <span class="ltr">(Reflected Light)</span>. الصحيح ما في الشكل، وعليه بنينا الشرح والمختبر. كذلك عنوان الصنف «بتأثير الأمواج الإشعاعية» لا يطابق شرحه، فهو كاشف ضوئي بالانعكاس (التشتت).</p>`,fix:1},
    {title:'مختبر مصغّر: الدخان يضيء الحساس',widget:(el,B)=>DCML.lab(el,B,{intro:'غيّر كمية الدخان وانظر إلى الحساس في الفرع المائل. الدرجة الوسطى توضيحية.',
     predict:{q:'زدت الدخان في الحجرة. ماذا يحدث للضوء الواصل إلى الحساس في الشكل (6-8)؟',opts:[['يزيد',true,'ذرات الدخان تعكس جزءاً من الضوء إلى الحساس (Reflected Light).'],['يقل',false,'هذا ما يحدث في كاشف حجب الضوء (6-7)، لا هنا.'],['لا يتغير',false,'الضوء المنعكس يصل إلى الحساس.']]},
     ins:[{k:'n',l:'الدخان',seg:[[0,'هواء نقي'],[1,'قليل'],[2,'كثيف']],v:0}],
     calc:(s)=>({pic:scaSVG([0,25,70][s.n],[0,3,8][s.n],s.n===2),msg:['هواء نقي: الضوء يمر في الحجرة ولا يصل إلى الحساس — الشكل (6-8)-أ.','دخان قليل: قليل من الضوء المنعكس يصل إلى الحساس، دون حد الإنذار.','<b>إنذار:</b> ضوء منعكس كافٍ وصل إلى الحساس — الشكل (6-8)-ب.'][s.n],cls:s.n===2?'warn':''})})},
    {html:`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px">${SFA.fig(scaSVG(0,0,0),'الشكل <span class="ltr">(6-8)</span>-أ ص 122 — هواء نقي <span class="ltr">(Clean Air)</span>.',340)}${SFA.fig(scaSVG(40,8,0),'الشكل <span class="ltr">(6-8)</span>-ب ص 122 — مع دخان <span class="ltr">(Reflected Light)</span>.',340)}</div>`}
   ]},

  {st:11,short:'الحساسات الاختيارية',title:'الصنف الرابع: أجهزة كشف الدخان ذات الحساسات الاختيارية',ref:'ص 122',
   q:'بدل أن ينتظر الكاشف وصول الدخان إليه… ماذا لو سحب هو الهواء من الغرف؟',
   art:SFA.art('شبكة أنابيب تسحب الهواء من الغرف إلى جهاز يقيس الدخان',
    `<path d="M40 100H300V200" fill="none" stroke="var(--fg)" stroke-width="7"/>`+[80,140,200,260].map(x=>`<circle cx="${x}" cy="100" r="4" fill="var(--surface)" stroke="var(--fg)" stroke-width="2"/>`+SFA.arr(x,124,x,108,'var(--blue)',2)).join('')+
    `<rect x="262" y="200" width="76" height="76" rx="8" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2.4"/><circle cx="300" cy="238" r="20" fill="var(--blue-soft)" stroke="var(--fg)" stroke-width="2"/><circle cx="296" cy="236" r="10" fill="var(--muted)" opacity=".5"/><circle cx="306" cy="242" r="8" fill="var(--muted)" opacity=".5"/>`+
    `<path d="M40 150H240M40 210H240" stroke="var(--line)" stroke-width="2" stroke-dasharray="5 5"/>`+[[110,160,14],[124,140,10]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="var(--muted)" opacity=".35"/>`).join('')+
    SFA.ar(170,70,'شبكة أنابيب تسحب الهواء',{fs:15,w:700})+SFA.ar(150,250,'الأماكن المحمية',{fs:14})+SFA.ar(300,298,'جهاز السحب',{fs:13.5})+
    SFA.hot(40,90,264,24,'شبكة الأنابيب موصلة إلى الأماكن المراد حمايتها، وفيها فتحات يدخل منها الهواء.')+SFA.hot(262,200,76,76,'جهاز ضخ الهواء والحجرة العائمة: حجرة صغيرة عالية الرطوبة ضغطها منخفض؛ الدخان يتكاثف فيها كغيمة صغيرة تُقاس كثافتها كهروضوئياً.')),
   cap:'رسم توضيحي للفكرة (لا شكل لها في الكتاب).<br><b>مرّر المؤشر على الأنابيب والجهاز (أو المسهما في الجوال) لتعرف معناهما.</b>',
   side:[
    {predict:{q:'متى ينقل جهاز قياس الكثافة الإشارة إلى دائرة الإنذار؟',opts:[
     ['عندما تكون الكثافة المقاسة تساوي أو أكبر من الكثافة المحددة مسبقاً',true,'(ص 122).'],
     ['عند أي أثر للرطوبة',false,'الرطوبة موجودة دائماً في الحجرة.'],
     ['كل ساعة',false,'لا.']]}}
   ],
   body:[
    {book:`<p>وهي عبارة عن شبكة من الأنابيب موصلة إلى الأماكن المراد حمايتها ومزودة بجهاز ضخ الهواء، يقوم بسحب الهواء من هذه الأماكن. ويعتبر الحساس ذو الحجرة العائمة أحد نماذج هذا النوع من الحساسات، حيث يقوم جهاز سحب الهواء بضخ كمية محدودة من الهواء من الأماكن إلى حجرة صغيرة عالية الرطوبة وذات ضغط داخلي منخفض، فعند وجود دخان يتكاثف الدخان مع الرطوبة العالية مشكلاً شبه غيمة صغيرة ضمن الحجرة، حيث يتم قياس كثافتها بوسيلة كهروضوئية، وعندما تكون الكثافة المقاسة تساوي أو أكبر من الكثافة المحددة مسبقاً للحساس، يتم نقل الإشارة من جهاز قياس الكثافة إلى دائرة الإنذار، حيث تبدأ بإعطاء إشارة الإنذار.</p>
     <p><b>العوامل التي تؤثر على أداء جهاز كشف الدخان:</b></p><ul><li>الأبخرة أو الغبار.</li><li>التدخين المفرط.</li><li>ارتفاع السقف.</li><li>أبخرة الدهان أو المنظفات أو المواد الكيميائية.</li><li>الأماكن المفتوحة الخارجية.</li></ul>`,ref:'ص 122'},
    {tip:`<p>كلمة «الاختيارية» في الكتاب يقصد بها كواشف <b>سحب الهواء</b> <span class="ltr">(Aspirating)</span>؛ الوصف كله عن أنابيب تسحب عينات الهواء إلى الجهاز.</p>`,title:'ما معنى «الاختيارية»؟'},
    {title:'مختبر مصغّر: لأي كاشف هذا العامل؟',widget:(el,B)=>DCML.sort(el,B,{intro:'مراجعة: العوامل المؤثرة على الكواشف الثلاثة في الكتاب.',cats:['كاشف اللهب','الكاشف الحراري','كاشف الدخان'],items:[
 ['البرق والكشافات القوية.',0,'(ص 117).'],
 ['تشغيل وسيلة تدفئة ترفع حرارة المكان أو تخفضها بشدة.',1,'(ص 120).'],
 ['أبخرة الدهان أو المنظفات.',2,'(ص 122).'],
 ['الحرائق التي تنتشر بشكل بطيء جداً فلا يعطي إنذاراً.',1,'(ص 120).'],
 ['التدخين المفرط.',2,'(ص 122).']]})}
   ]},

  {recap:[
   'رؤوس الكشف الآلي ثلاث مجموعات: كاشفات اللهب، والكاشفات الحرارية، والكاشفات الدخانية (ص 116–122).',
   'كاشف اللهب للأماكن المفتوحة والأسقف العالية والحرائق السريعة، ويتأثر بالشمس والبرق وأشعة إكس والكشافات (ص 116–117).',
   'الحرارية ثلاثة أصناف: ثابتة الدرجة (القرص يعود تلقائياً، والخطي لا يعود)، ومعدل الارتفاع، والمركب — الشكلان (6-4) و(6-5).',
   'الدخانية: الأيوني (الدخان يُنقص التيار)، والضوئي بالحجب (ضوء أقل يصل)، وبالتشتت (ضوء منعكس يصل إلى الحساس)، وسحب الهواء بالأنابيب — الأشكال (6-6) إلى (6-8).']}
],
 theory:[
  {h:'2- أجهزة كشف آلية (رؤوس كاشفة)',ref:'ص 116',html:'<p>تعرض الحقيبة ثلاث مجموعات من الرؤوس الكاشفة: <b>كاشفات الحريق (اللهب)</b>، و<b>الكاشفات الحرارية</b>، و<b>الكاشفات الدخانية</b>.</p>'},
  {h:'1- كاشفات الحريق (اللهب)',ref:'ص 116–117',html:`<p>تستخدم في <b>الأماكن الخارجية المفتوحة</b> حيث لا يمكن لأجهزة كشف الدخان أو الحرارة العمل، أو في الأماكن التي فيها <b>غبار وأبخرة</b>، أو في الأماكن ذات <b>الأسقف العالية</b> مثل هناجر الطائرات، حيث يُستخدم كشف الدخان واللهب معًا لأن استجابة كاشف الدخان تقل بسبب كبر حجم المكان. وتستخدم كذلك في الأماكن المعرضة <b>لحريق سريع وكبير</b> مثل محطات الوقود، وتتنوع أصنافها بتنوع الوقود المحتمل للحريق.</p>
   <ol><li><b>كواشف تعمل بالأشعة تحت الحمراء وكواشف تعمل بالأشعة فوق البنفسجية:</b> تعتمد على أن الكثير من المواد تصدر عند تسخينها أشعة معينة غير مرئية، وهذه الكواشف تحتوي على عناصر تتحسس بالأشعة غير المرئية فتعطي إشارة لدائرة الإنذار كي تعمل.</li>
   <li><b>كواشف كهروضوئية:</b> تحوي حساسات كهربائية ضوئية تعتمد على مبدأ تغير الناقلية الكهربائية لبعض المواد عند تعرضها للضوء.</li>
   <li><b>كواشف تعمل بوميض اللهب:</b> أحد نماذج الحساسات الكهروضوئية التي لا تتأثر إلا بالأشعة الضوئية الصادرة عن وميض اللهب تحديدًا.</li></ol>
   <p><b>العوامل التي تؤثر على أداء جهاز كشف الحريق (اللهب):</b> أشعة الشمس (ويمكن عمل بعض التدابير الخاصة لتفادي تأثره بها)، والبرق، وأشعة إكس، والكشافات القوية.</p>`},
  {err:'<span class="fixnote">يقول الكتاب (ص 116) «هناك أربعة أنواع رئيسة لكواشف اللهب» ثم يعدد ثلاثة بنود فقط؛ ويبدو أن البند الأول يجمع نوعين (الأشعة تحت الحمراء والأشعة فوق البنفسجية)، فتصبح أربعة.</span>'},
  {h:'2- الكاشفات الحرارية',ref:'ص 117',html:`<p>تتأثر بالارتفاع غير العادي في درجة الحرارة، وتعمل بإحدى الوسائل التالية:</p>
   <ol><li>أ- شرائح أو أسلاك معدنية تتمدد عند الارتفاع في درجة الحرارة.</li><li>ب- انصهار سبيكة من مادة معدنية عند الارتفاع في درجة الحرارة.</li><li>ج- موصلات كهربائية تتغير مقاومتها عند الارتفاع في درجة الحرارة.</li><li>د- أنابيب تحتوي على غازات وسوائل تتمدد عند الارتفاع في درجة الحرارة.</li></ol>
   <p>ويُركّب في الأماكن التي لا تسمح باستخدام كاشف الدخان، خاصة الأماكن التي ينتج فيها الكثير من <b>الأبخرة والغازات</b> مما قد ينتج عنه <b>إنذارات كاذبة</b> لو استُخدم كاشف الدخان، وفي الأماكن التي يمكن أن تحدث فيها حرائق سريعة الاشتعال <b>وبدون دخان تقريبًا</b>. وهناك ثلاثة أصناف:</p>`},
  {h:'الصنف الأول: ذو الدرجة الحرارية الثابتة',ref:'ص 117–118',html:`<p>يستجيب الجهاز عند تجاوز حرارة المكان <b>درجة الحرارة المضبوطة</b> عليها. وهو على أنواع:</p>
   <p><b>1- الثرموستات ذات الصفيحة المزدوجة:</b> أكثر الأنواع شيوعًا، يعتمد على <b>اختلاف معامل التمدد الحراري لمعدنين مختلفين</b> مثبتين مع بعضهما، بحيث يسبب ذلك حركة لعنصر مربوط معهما يقطع التيار الكهربائي ضمن الثرموستات (الشكل 6-3).</p>`},
  {fig:'(6-3)',ref:'ص 118',caption:'مقطع في كاشف نقطي (Section of spot type rate compensation detector).',draw:()=>box(fig63(),560)},
  {err:'<span class="fixnote">الشكل (6-3) ليس ثرموستات بصفيحة مزدوجة بسيطة كما يقول النص، بل «كاشف نقطي تعويضي للمعدل»: غلاف خارجي يتمدد بالحرارة فيقرّب دعامتين قليلتي التمدد حتى تتلامسا. كذلك يقول النص إن الثرموستات «يقطع التيار»، أما كاشف الإنذار فيُغلق تلامسًا مفتوحًا عادةً كما في الشكل (6-4) (Normally Open Alarm Contacts)، فيصل الإشارة إلى اللوحة.</span>'},
  {html:`<p><b>2- الترموستات ذات القرص سريع الحركة:</b> جهاز يحتوي على <b>قرص معدني حساس للحرارة ذي شكل مقعر</b> في الحالة العادية، يتغير شكله إلى <b>محدب</b> عند ارتفاع الحرارة إلى درجة معينة. ومن ميزاته أنه <b>يعود إلى وضعيته الأصلية تلقائيًا</b> عند انخفاض درجة الحرارة (الشكل 6-4).</p>`},
  {fig:'(6-4)',ref:'ص 118',caption:'كاشف حراري بقرص ثنائي المعدن سريع الانقلاب (الحالة الباردة). في «المختبر» تراه ينقلب ويغلق التلامس.',draw:()=>box(snapSVG(0,25,57),360)},
  {html:`<p><b>3- الثرموستات الخطي:</b> العنصر الحساس فيه <b>سلك مزدوج</b> من معدنين مختلفين يفصل بينهما غطاء حساس للحرارة. فعندما ترتفع الحرارة إلى الدرجة المعيّر عليها ينصهر الغطاء ويتلامس السلكان فيعمل الإنذار. ومن سيئاته أنه <b>لا يعود إلى وضعيته الأصلية تلقائيًا</b> وإنما يجب فصل السلكين عن بعضهما.</p>`},
  {h:'الصنف الثاني: كاشف معدل تغير درجة الحرارة',ref:'ص 119',html:`<p>يعتمد تشغيله على <b>سرعة ارتفاع درجة الحرارة</b> إلى سرعة محددة مسبقًا. ويحتوي على عنصري تشغيل: أحدهما يعطي إنذارًا عند ارتفاع الحرارة بسرعة، والثاني يؤخر إعطاء الإنذار عند السرعات المنخفضة (أقل من السرعة المعيّر عليها الجهاز). ومعظم الكواشف الحرارية مصممة على الاستجابة إذا تجاوزت الحرارة <b>من ${lt('57 °C')} إلى ${lt('82 °C')}</b>، وهناك أنواع تتأثر بدرجات أقل حسب طبيعة الموجودات ومدى قابليتها للاشتعال.</p>
   <p><b>مميزاته:</b></p><ol><li>يمكن أن تُعيّر بحيث تعمل بشكل أسرع من الأجهزة ذات درجة الحرارة الثابتة، ضمن كل الظروف.</li><li>يمكن استخدامها وتكون فعالة ضمن مجال كبير من درجات الحرارة.</li><li>يمكن إعادة تشغيلها وتعييرها بسرعة.</li><li>يمكن إعطاؤها تسامحًا محددًا في اختلاف درجة الحرارة.</li></ol>`},
  {h:'الصنف الثالث: الحساسات ذات درجة الحرارة الثابتة وسرعة محددة لارتفاعها',ref:'ص 119',html:`<p>يجمع الطريقتين: الجزء ذو الدرجة الثابتة يغطي الحالة التي تكون فيها سرعة ازدياد الحرارة منخفضة، فيمكنه <b>التنبيه بالحرائق البطيئة الاشتعال</b>.</p>
   <p>يتألف من <b>علبة معدنية فيها فتحة تنفيس صغيرة جدًا</b> و<b>غشاء مرن</b> يحمل صفيحة توصيل معدنية. عندما تتعرض العلبة للحرارة يسخن الهواء داخلها ويتمدد، فإذا زاد عن مقدرة فتحة التنفيس على تصريفه <b>ينضغط الغشاء</b> فيحرك الصفيحة لتغلق الدائرة. أما إذا كان التغير في الحرارة بسيطًا فيتمدد الهواء ببطء ويخرج من الفتحة دون أن يحرك الغشاء. ويعمل كحساس ذي درجة ثابتة أيضًا: عندما <b>تنصهر الحلقة المعدنية</b> بارتفاع الحرارة يتمدد النابض G فيدفع الغشاء C لوصل القاطعة الكهربائية D (الشكل 6-5).</p>`},
  {fig:'(6-5)',ref:'ص 120',caption:'كاشف مركب: معدل الارتفاع ودرجة الحرارة الثابتة (Combination of Rate-of-Rise / Fixed Temperature).',draw:()=>box(combSVG(0,0,0),380)},
  {err:'<span class="fixnote">يذكر النص (ص 119) الحروف G (النابض) وC (الغشاء) وD (القاطعة)، لكنها غير مكتوبة على الشكل (6-5) في الكتاب؛ أضفناها على رسمنا في مواضعها.</span>'},
  {html:`<p><b>العوامل المؤثرة على أداء جهاز كشف الحرارة</b> (ص 120): ارتفاع درجة حرارة المكان أو انخفاضها الشديد ناتجًا عن تشغيل وسيلة تدفئة؛ وارتفاع السقف؛ وعدم إعطاء إنذار عند اشتعال الحرائق التي تنتشر بشكل بطيء جدًا.</p>`},
  {h:'3- الكاشفات الدخانية',ref:'ص 120',html:`<p>تُستخدم بنسبة عالية جدًا في أنظمة الكشف لأنها تكشف <b>معظم أنواع الحرائق وهي في بدايتها</b>، وتخصص للمواقع التي تنتشر فيها الحرائق ببطء نسبيًا ويتصاعد من موادها كميات من الغازات قبل أن يندلع اللهب، مثل مواقع الأجهزة الكهربائية أو المواد الخشبية أو المنتجات القطنية. وتصنف إلى أربعة أصناف:</p>`},
  {h:'الصنف الأول: كاشف الدخان ذو الحساسات الأيونية',ref:'ص 120',html:`<p>يتحسس <b>الدخان المرئي وغير المرئي</b>، والمعلقات الصغيرة التي تتطاير إلى الأعلى بسبب الحرارة، ويستخدم في مواقع الملفات والأوراق (الشكل 6-6). يتألف من حجرتي تأيين أو أكثر ودائرات تكبير الإشارة. يحتوي على <b>مصدر لمادة مشعة</b> يجعل الهواء في حجرة التأيين متأينًا وناقلاً للتيار، فيسمح فرق الجهد المطبق على طرفيها لتيار ضعيف جدًا بالتدفق. وعند دخول الدخان إلى الحجرة <b>يرتبط بالأيونات</b>، فيصل الجهد إلى حد معين يؤدي إلى تشغيل دائرة الإنذار.</p>`},
  {err:'<span class="fixnote">في الكتاب (ص 120) «حجرتي تأمين» و«حجرة التأمين»، والصواب «التأيين» (Ionization Chamber)؛ و«تحولها إلى مصدر للمواد النشطة إشعاعياً» والمقصود احتواؤها على مصدر لمادة مشعة كما في الشكل (Radioactive Material). وصححناهما في النص أعلاه.</span>'},
  {fig:'(6-6)',ref:'ص 121',caption:'أ- في حالة وجود الدخان (Current With Smoke) · ب- في حالة نقاوة الهواء من الدخان (Current With Clean Air).',draw:()=>`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px">${[['أ — دخان: التيار أقل',ionSVG(40,8,0)],['ب — هواء نقي: التيار أكبر',ionSVG(100,0,0)]].map(([c,s])=>`<div><div class="svgbox" style="margin-top:0">${s}</div><p class="sub" style="text-align:center">${c}</p></div>`).join('')}</div>`},
  {note:TIP+'النص يقول «يصل الجهد إلى حد معين»، والشكل يبيّن أن <b>التيار يقل</b> بوجود الدخان (المؤشر بين 0 و1 بدل ما بين 1 و2). الفكرتان متفقتان: الدائرة الإلكترونية تراقب هبوط التيار (أو تغير الجهد الذي يسببه) فإذا تجاوز حدًا معينًا أعطت الإنذار.'},
  {h:'الصنف الثاني: كاشف الدخان الكهربائي الضوئي',ref:'ص 121',html:`<p>يتحسس <b>الدخان المرئي والمعلقات الكبيرة</b> التي تتطاير للأعلى بفعل الحرارة، ويستخدم في أماكن وجود الكابلات. يؤدي مرور الدخان إلى <b>قطع الأشعة الضوئية</b> الواردة إلى الحساس، فتقل الكثافة الضوئية إلى حد معين، فيعمل الإنذار عند وصول كثافة الدخان إلى كثافة محددة (الشكل 6-7).</p>`},
  {fig:'(6-7)',ref:'ص 121',caption:'نوع حجب الضوء (Light Obscuration Type): أ- عند عدم وجود الدخان · ب- نظرية العمل عند وجود الدخان.',draw:()=>`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px">${[['أ — بلا دخان',obsSVG(100,0,0)],['ب — مع دخان: ضوء أقل يصل',obsSVG(43,8,0)]].map(([c,s])=>`<div><div class="svgbox" style="margin-top:0">${s}</div><p class="sub" style="text-align:center">${c}</p></div>`).join('')}</div>`},
  {h:'الصنف الثالث: كاشف الدخان بالضوء المنعكس',ref:'ص 121–122',html:`<p>يسميه الكتاب «جهاز كشف الدخان الذي يعمل بتأثير الأمواج الإشعاعية»، ويستخدم في الأماكن المغلقة ذات التكييف المركزي. يستخدم <b>الأشعة الضوئية المنعكسة</b> على عنصر تحسس ضوئي داخل حيز الجهاز شبه المغلق «والموضوع ضمن المجال المظلم للجهاز». الجهاز علبة شبه مغلقة فيها مصدر ضوء وعنصر تحسس ضوئي. كما في الشكل (6-8): في الهواء النقي يمر الضوء ولا يصل إلى الحساس الموضوع في فرع جانبي، فإذا دخل الدخان <b>عكست ذراته جزءًا من الضوء إلى الحساس</b>، وعندما تصل كثافة الدخان (وبالتالي الضوء الواصل) إلى درجة معينة يشتغل نظام الإنذار.</p>`},
  {fig:'(6-8)',ref:'ص 122',caption:'نوع تشتت الضوء (Light-Scattering Type): أ- عند عدم وجود الدخان (Clean Air) · ب- نظرية العمل عند وجود الدخان (Reflected Light).',draw:()=>`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px">${[['أ — هواء نقي: لا ضوء عند الحساس',scaSVG(0,0,0)],['ب — مع دخان: ضوء منعكس يصل إلى الحساس',scaSVG(40,8,0)]].map(([c,s])=>`<div><div class="svgbox" style="margin-top:0">${s}</div><p class="sub" style="text-align:center">${c}</p></div>`).join('')}</div>`},
  {err:'<span class="fixnote">نص الكتاب لهذا الصنف (ص 121–122) يقول إن الأشعة الواصلة إلى عنصر التحسس <b>تقل</b> عند دخول الدخان «لأن ذرات الدخان سوف تعكس كمية من الأشعة»، وإن الإنذار يعمل عندما «يتوقف تأثير العنصر الحساس بالضوء». وهذا يخالف الشكل (6-8) نفسه: الحساس في فرع جانبي خارج طريق الضوء، فلا يصله ضوء في الهواء النقي، والدخان يعكس الضوء <b>إليه</b> فيزيد ما يصله (Reflected Light). الصحيح ما في الشكل، وعليه بنينا الشرح أعلاه والمختبر. كذلك عنوان الصنف «بتأثير الأمواج الإشعاعية» لا يطابق شرحه، فهو كاشف ضوئي بالانعكاس (التشتت).</span>'},
  {h:'الصنف الرابع: أجهزة كشف الدخان ذات الحساسات «الاختيارية»',ref:'ص 122',html:`<p>شبكة من <b>الأنابيب</b> موصلة إلى الأماكن المراد حمايتها ومزودة بجهاز ضخ الهواء يسحب الهواء منها. ومن نماذجها الحساس ذو <b>الحجرة العائمة</b>: يضخ جهاز السحب كمية محدودة من الهواء إلى حجرة صغيرة عالية الرطوبة وذات ضغط داخلي منخفض، فعند وجود دخان يتكاثف مع الرطوبة مشكلاً شبه غيمة صغيرة تقاس كثافتها بوسيلة كهروضوئية، فإذا ساوت الكثافة المحددة مسبقًا أو زادت عليها نُقلت الإشارة إلى دائرة الإنذار.</p>
   <p><b>العوامل التي تؤثر على أداء جهاز كشف الدخان:</b> الأبخرة أو الغبار؛ والتدخين المفرط؛ وارتفاع السقف؛ وأبخرة الدهان أو المنظفات أو المواد الكيميائية؛ والأماكن المفتوحة الخارجية.</p>`},
  {note:TIP+'كلمة «الاختيارية» في الكتاب يقصد بها كواشف <b>سحب الهواء</b> (Aspirating) — الوصف كله عن أنابيب تسحب عينات الهواء إلى الجهاز.'}
 ],
 lab:(el)=>detLab(el),
 quiz:[
  {q:'أين تُستخدم كاشفات اللهب؟',o:['في غرف النوم فقط','في الأماكن الخارجية المفتوحة والأسقف العالية والأماكن المعرضة لحريق سريع كمحطات الوقود','في مواقع الملفات والأوراق فقط','داخل لوحة التحكم'],c:1,e:'(ص 116).'},
  {q:'ما ميزة الثرموستات ذات القرص سريع الحركة؟',o:['يعمل بالأشعة فوق البنفسجية','يعود إلى وضعيته الأصلية تلقائيًا عند انخفاض الحرارة','يجب استبداله بعد كل إنذار','لا يتأثر بالحرارة'],c:1,e:'(ص 118).'},
  {q:'ما عيب الثرموستات الخطي؟',o:['لا يعود إلى وضعيته الأصلية تلقائيًا ويجب فصل السلكين','يعمل فقط مع الدخان','صوته مرتفع','يحتاج مادة مشعة'],c:0,e:'(ص 118).'},
  {q:'معظم الكواشف الحرارية مصممة على الاستجابة إذا تجاوزت الحرارة:',o:['من 20 إلى 30 °C','من 57 إلى 82 °C','من 100 إلى 150 °C','أكثر من 500 °C'],c:1,e:'(ص 119).'},
  {q:'في كاشف الدخان الأيوني، ماذا يحدث للتيار في حجرة التأيين عند دخول الدخان؟',o:['يزيد','يقل','لا يتغير','ينعكس اتجاهه'],c:1,e:'الدخان يرتبط بالأيونات فيقل التيار — الشكل (6-6).'},
  {q:'في الكاشف الضوئي بالتشتت (الشكل 6-8)، ما الذي يصل إلى الحساس في الهواء النقي؟',o:['كل الضوء','نصف الضوء','لا يصله ضوء تقريبًا','دخان فقط'],c:2,e:'الحساس خارج طريق الضوء؛ الدخان هو الذي يعكس الضوء إليه.'}
 ]
});

B.lesson({
 id:'u6-l3',unit:6,order:3,pages:'123–128',
 title:'الحريق وهرم الاشتعال وأنواع الحرائق',
 summary:'مخاطر الحريق الثلاثة، والحريق تفاعل أكسدة سريع يحتاج أربعة عناصر (هرم الاشتعال)، وحدود الاشتعال، ومصادر الاشتعال، وأنواع الحرائق A وB وC وD وK.',
 stations:[
  {intro:true},
{st:1,short:'مخاطر الحريق',title:'ثانياً: الحرائق وطرق إطفائها',ref:'ص 123–124',
   q:'الحريق في مبنى واحد… فلماذا قد يخاف منه سكان المبنى المجاور؟',
   art:SFA.art('ثلاثة أنواع من مخاطر الحريق: على الأفراد، وعلى المبنى نفسه، وعلى المجاورات',
    `<rect x="120" y="110" width="100" height="160" fill="var(--surface)" stroke="var(--fg)" stroke-width="2.4"/><path d="M150 140L160 170L148 196" fill="none" stroke="var(--fg)" stroke-width="2"/>`+flame(176,176,.8)+flame(200,236,.5)+
    `<rect x="260" y="150" width="64" height="120" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2.2"/>`+SFA.arr(222,170,256,170,'var(--stop)',2.4)+SFA.arr(222,200,256,200,'var(--stop)',2.4)+
    SFA.man(70,270,{hands:[[50,226],[92,214]]})+SFA.arr(96,270,40,270,'var(--on)',2.4)+
    SFA.ar(70,150,'الخطر',{fs:14,w:700})+SFA.ar(70,168,'الشخصي',{fs:14,w:700})+SFA.ar(170,96,'الخطر التدميري',{fs:14,w:700})+SFA.ar(292,130,'الخطر',{fs:14,w:700})+SFA.ar(292,148,'التعرضي',{fs:14,w:700})+
    SFA.hot(36,180,74,100,'الخطر الشخصي (على الأفراد): يعرض حياة الأفراد للإصابات، فيستوجب تدابير للنجاة.')+SFA.hot(118,80,106,192,'الخطر التدميري: الدمار في المبنى نفسه؛ تتحكم فيه «كمية وطبيعة مكونات المبنى».')+SFA.hot(256,120,74,152,'الخطر التعرضي (على المجاورات، الخطر الخارجي): يهدد المواقع القريبة بحرارة الحريق ولهبه، دون اتصال مباشر.')),
   cap:'مخاطر الحريق الثلاثة.<br><b>مرّر المؤشر على الشخص والمبنى المحترق والمبنى المجاور (أو المسها في الجوال) لتعرف كل نوع.</b>',
   side:[
    {predict:{q:'لماذا تُنشأ محطات الوقود في منطقة غير سكنية أو على بعد مسافة معينة من المباني السكنية؟',opts:[
     ['بسبب الخطر التعرضي على المجاورات',true,'«وهذا هو ما يطلق عليه الخطر التعرضي» (ص 123–124).'],
     ['بسبب الخطر الشخصي على عمال المحطة فقط',false,'المسافة تحمي المباني المجاورة.'],
     ['بسبب الضوضاء',false,'الكتاب يتحدث عن خطر الحريق.']]}}
   ],
   body:[
    {book:`<p>تبدأ الحرائق عادة على نطاق ضيق لأن معظمها ينشأ من مستصغر الشرر بسبب إهمال في اتباع طرق الوقاية من الحرائق ولكنها سرعان ما تنتشر إذا لم يبادر بإطفائها مخلفة خسائر ومخاطر فادحة في الأرواح والمتاع والأموال والمنشآت، ونظراً لتواجد كميات كبيرة من المواد القابلة للاشتعال في كل ما يحيط بنا من أشياء وفي مختلف مواقع تواجدنا والبيئة المحيطة بنا في البيت والشارع والمدرسة ومكان العمل وفي أماكن النزهة والاستجمام وغيرها من المواقع؛ والتي لو توفرت لها بقية عناصر الحريق لألحقت بنا وبممتلكاتنا خسائر باهظة التكاليف. لذلك يجب علينا اتخاذ التدابير الوقائية من أخطار نشوب الحرائق لمنع حدوثها والقضاء على مسبباتها، وتحقيق إمكانية السيطرة عليها وإخمادها في حالة نشوبها في أسرع وقت ممكن بأقل الخسائر، ويمكن تلخيص المخاطر التي قد تنتج عن الحريق في الثلاثة الأنواع التالية:</p>
     <ol><li><b>الخطر الشخصي:</b> (الخطر على الأفراد) وهي المخاطر التي تعرض حياة الأفراد للإصابات مما يستوجب توفير تدابير للنجاة من الأخطار عند حدوث الحريق.</li>
     <li><b>الخطر التدميري:</b> المقصود بالخطر التدميري هو ما يحدث من دمار في المباني والمنشآت نتيجة للحريق وتختلف شدة هذا التدمير باختلاف ما يحويه المبنى نفسه من مواد قابلة للاشتعال، فالخطر الناتج في المبنى المخصص للتخزين يكون غير المنتظر في حالة المباني المستخدمة كمكاتب أو للسكن، هذا بالإضافة إلى أن المباني المخصصة لغرض معين تختلف درجة تأثير الحريق فيها نتيجة عوامل كثيرة منها نوع المواد الموجودة بها ومدى قابليتها للاحتراق وطريقة توزيعها في داخل المبنى إلى جانب قيمتها الاقتصادية. هذا كله يعني أن كمية وطبيعة مكونات المبنى هي التي تتحكم في مدى خطورة الحريق واستمراره والأثر التدميري الذي ينتج عنه.</li>
     <li><b>الخطر التعرضي:</b> (الخطر على المجاورات) وهي المخاطر التي تهدد المواقع القريبة لمكان الحريق ولذلك يطلق عليه الخطر الخارجي، ولا يشترط أن يكون هناك اتصال مباشر بين الحريق والمبنى المعرض للخطر. هذا وتنشأ هذه الخطورة عادة نتيجة لتعرض المواد القابلة للاحتراق التي يتكون منها أو التي يحويها المبنى لحرارة ولهب الحريق الخارجي. لذلك فعند التخطيط لإنشاء محطة للتزود بالوقود فمن المراعى عند إنشائها أن تكون في منطقة غير سكنية أو يراعى أن تكون المباني السكنية على بعد مسافة معينة حيث يفترض تعرض هذه المباني لخطر كبير في حالة وقوع حريق ما بهذه المحطة وهذا هو ما يطلق عليه الخطر التعرضي.</li></ol>`,ref:'ص 123–124'},
    {watch:`<p>في الكتاب (ص 123) «مواد قابلة للانتشار» والمقصود «للاشتعال» فكتبناها مصححة؛ وعبارة «يكون غير المنتظر» معناها: الخطر في مبنى التخزين غير الخطر المنتظر في مباني المكاتب أو السكن.</p>`,fix:1},
    {title:'مختبر مصغّر: أي خطر؟',widget:(el,B)=>DCML.sort(el,B,{cats:['الشخصي','التدميري','التعرضي'],items:[
 ['حريق في مستودع يتلف البضائع وينهار سقفه.',1,'دمار في المبنى نفسه حسب ما يحويه من مواد (ص 123).'],
 ['موظف محاصر بالدخان في الطابق الثالث.',0,'خطر على حياة الأفراد يستوجب تدابير للنجاة (ص 123).'],
 ['حرارة حريق في محطة وقود تشعل نوافذ مبنى سكني مجاور.',2,'المواقع القريبة دون اتصال مباشر (ص 123–124).']]})}
   ]},

  {st:2,short:'الحرائق والطفايات',title:'6-3 الحرائق وطفايات الحريق <span class="ltr">(FIRE SAFETY)</span>',ref:'ص 124',
   q:'قبل أن تختار طفاية… ماذا يجب أن تعرف عن الحريق نفسه؟',
   art:SFA.art('خطة هذا الجزء: ما الحريق، وأسبابه، وأنواعه، ثم الطفايات',
    [['ما الحريق؟',282,110],['أسبابه',180,110],['أنواعه',78,110],['الطفايات وطرق استعمالها',180,226]].map(([t,x,y])=>`<rect x="${x-(t.length>10?96:46)}" y="${y-22}" width="${t.length>10?192:92}" height="40" rx="12" fill="var(--surface)" stroke="var(--blue)" stroke-width="2"/>`+SFA.ar(x,y+5,t,{fs:14})).join('')+
    SFA.arr(234,110,228,110,'var(--blue)',2)+SFA.arr(132,110,126,110,'var(--blue)',2)+`<path d="M78 130V170H180V202" fill="none" stroke="var(--blue)" stroke-width="2"/>`+SFA.arr(180,190,180,202,'var(--blue)',2)+flame(282,82,.45)+
    SFA.ar(180,58,'نفهم الحريق ثم نطفئه',{fs:15,w:700})),
   cap:'ترتيب الموضوعات في هذا الجزء: من اليمين ثم إلى الأسفل.',
   side:[
    {predict:{q:'ما الذي يتناوله هذا الجزء أولاً قبل الطفايات؟',opts:[
     ['طرق إخلاء المبنى',false,'تناولها الكتاب ضمناً في الإنذار.'],
     ['ما الحرائق؟ وما أسبابها؟ وأنواعها المختلفة',true,'(ص 124).'],
     ['صيانة لوحة الإنذار',false,'هذا من الجزء الأول.']]}}
   ],
   body:[
    {book:`<p><b>المقدمة:</b> تشرح هذه المحاضرة باختصار ما الحرائق؟ وما هي أسبابها؟ كذلك أنواع الحرائق المختلفة. كما تتحدث عن طفايات الحريق المختلفة وطرق استعمالها.</p>`,ref:'ص 124'},
    {tip:`<p>عبارة «هذه المحاضرة» باقية من مصدر الأصل. في موقعنا: الحريق وعناصره وأنواعه في هذا الدرس، والطفايات وطرق الإطفاء وطريقة الاستعمال في الدرس التالي.</p>`,title:'أين تجد كل موضوع؟'}
   ]},

  {st:3,short:'ما الحريق؟',title:'6-3-1 ما الحريق؟',ref:'ص 124',
   q:'كنا نقول «مثلث» الاشتعال… فلماذا صار «هرماً»؟',
   art:SFA.art('هرم الاشتعال بعناصره الأربعة',
    SFA.emb(tetraSVG({fuel:1,ox:1,heat:1,chain:1},1),[20,10,350,260],[16,52,328,258])+SFA.ar(180,42,'هرم الاشتعال',{fs:16,w:700})+
    SFA.hot(60,120,90,100,'الأكسجين ⟦Air (Oxygen)⟧.')+SFA.hot(210,120,90,100,'الحرارة ⟦Heat⟧: مصادر الاشتعال.')+SFA.hot(110,240,140,40,'الوقود ⟦Fuel⟧: المادة القابلة للاشتعال.')+SFA.hot(230,52,100,40,'التفاعل الكيميائي المتسلسل ⟦Chemical Chain Reaction⟧: العنصر الرابع الذي حوّل المثلث إلى هرم.')),
   cap:'أسماء العناصر على الأوجه إضافة منّا؛ الشكل <span class="ltr">(6-9)</span> في الكتاب بلا أسماء.<br><b>مرّر المؤشر على كل وجه (أو المسه في الجوال) لتعرف العنصر.</b>',
   side:[
    {predict:{q:'ما العنصر الرابع الذي أُضيف إلى مثلث الاشتعال فصار هرماً؟',opts:[
     ['الماء',false,'الماء وسيلة إطفاء.'],
     ['التفاعل الكيميائي المتسلسل',true,'(ص 124).'],
     ['ثاني أكسيد الكربون',false,'هذا غاز إطفاء.']]}}
   ],
   body:[
    {book:`<p>ببساطة شديدة الحريق هو عبارة عن تفاعل كيميائي يشمل الأكسدة السريعة للمواد القابلة للاشتعال. في الماضي كنا نعرف ما يسمى بمثلث الاشتعال الذي يتكون من: المادة، الأكسجين، مصدر الاشتعال، ولكن حديثاً تغير هذا المفهوم لتصبح عناصر الاشتعال أربعة عناصر بدلاً من ثلاثة، وتم إضافة العنصر الرابع: التفاعل الكيميائي المتسلسل للحريق <span class="ltr">(Chemical Chain Reaction)</span> الأمر الذي أدى لتكوين هرم الاشتعال <span class="ltr">(Fire Tetrahedron)</span> بدلاً من مثلث الاشتعال كما هو موضح بالشكل رقم (6-9)</p>
     <p>لذلك فإن عناصر الاشتعال الأربعة هي:</p><ol style="list-style:none;padding-inline-start:4px"><li>أ- المادة القابلة للاشتعال <span class="ltr">Fuel (Combustible Substances)</span></li><li>ب- الهواء (الأكسجين) <span class="ltr">Air (Oxygen)</span></li><li>ج- الحرارة (مصادر الاشتعال) <span class="ltr">Heat (Sources of Ignition)</span></li><li>د- التفاعل الكيميائي المتسلسل <span class="ltr">Chain Chemical Reaction</span></li></ol>`,ref:'ص 124'},
    {html:SFA.fig(fig69(),'الشكل <span class="ltr">(6-9)</span> ص 124 — هرم الاشتعال (أسماء العناصر إضافة منّا).',330)},
    {title:'مختبر مصغّر: إلى أي عنصر ينتمي؟',widget:(el,B)=>DCML.sort(el,B,{cats:['الوقود','الأكسجين','الحرارة','التفاعل المتسلسل'],items:[
 ['قطعة كرتون.',0,'مادة صلبة قابلة للاشتعال (ص 124–125).'],
 ['شرارة من سلك تالف.',2,'مصدر اشتعال: الكهرباء (ص 125).'],
 ['هواء الغرفة.',1,'الأكسجين نحو 21 % من الجو (ص 125).'],
 ['الشقوق الطليقة (Free Radicals).',3,'«مواد كيميائية فعالة تعرف بالشقوق الطليقة» (ص 126).']]})}
   ]},

  {st:4,short:'أ- الوقود',title:'أ- الوقود (المادة القابلة للاشتعال)',ref:'ص 124–125',
   q:'هل يحترق البنزين نفسه… أم شيء آخر يخرج منه؟',
   art:SFA.art('مواد صلبة وسائلة وغازية، والأبخرة هي التي تحترق',
    `<rect x="236" y="214" width="80" height="22" rx="11" fill="var(--live-soft)" stroke="var(--fg)" stroke-width="2"/><rect x="246" y="192" width="64" height="22" rx="11" fill="var(--live-soft)" stroke="var(--fg)" stroke-width="2"/>`+
    `<path d="M142 236V188L156 172H204V236Z" fill="var(--on-soft)" stroke="var(--fg)" stroke-width="2.2"/><rect x="164" y="160" width="24" height="12" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2"/>`+
    `<rect x="52" y="168" width="56" height="70" rx="18" fill="var(--blue-soft)" stroke="var(--fg)" stroke-width="2.2"/><rect x="70" y="152" width="20" height="16" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2"/>`+
    [[276,180],[176,148],[80,140]].map(([x,y])=>`<path d="M${x-8} ${y}q-8 -14 0 -26q8 -12 0 -26M${x+8} ${y}q-8 -14 0 -26q8 -12 0 -26" fill="none" stroke="var(--muted)" stroke-width="2.4"/>`).join('')+flame(176,96,.55)+
    SFA.ar(276,264,'صلبة',{fs:14.5})+SFA.ar(176,264,'سائلة',{fs:14.5})+SFA.ar(80,264,'غازية',{fs:14.5})+SFA.ar(180,52,'الأبخرة هي التي تحترق',{fs:15,w:700})+
    SFA.hot(230,160,96,84,'مواد صلبة: الأخشاب، القماش، الأوراق، الكرتون.')+SFA.hot(136,120,80,124,'مواد سائلة: بنزين السيارات، المذيبات، الكحولات. الأبخرة فوقها تشتعل (اللهب فوق الأبخرة لا داخل السائل).')+SFA.hot(46,110,72,134,'مواد غازية: البوتاجاز، الأسيتيلين، الهيدروجين.')),
   cap:'أمثلة الكتاب للأنواع الثلاثة.<br><b>مرّر المؤشر على كل مادة (أو المسها في الجوال) لتقرأ أمثلتها.</b>',
   side:[
    {predict:{q:'ما الشيء الذي يحترق من الوقود؟',opts:[
     ['الأبخرة التي ينتجها',true,'«الشيء الذي يحترق من الوقود هو الأبخرة التي ينتجها» (ص 125).'],
     ['السائل نفسه وهو بارد',false,'السائل يحتاج أن يتبخر أولاً.'],
     ['الوعاء الذي فيه الوقود',false,'لا.']]}}
   ],
   body:[
    {book:`<p>المواد القابلة للاشتعال تكون على هيئة: مواد صلبة، مواد سائلة، مواد غازية.</p><ul><li>المواد الصلبة: مثل الأخشاب، القماش، الأوراق، الكرتون</li><li>المواد السائلة: مثل بنزين السيارات، المذيبات، الكحولات</li><li>المواد الغازية: البوتاجاز، الأسيتيلين، الهيدروجين</li></ul><p>الشيء الذي يحترق من الوقود هو الأبخرة التي ينتجها، وهذه الأبخرة إذا اتحدت مع الهواء بالنسب الصحيحة لكل مادة ووجدت مصدراً للاشتعال لاشتعلت.</p>`,ref:'ص 124–125'},
    {title:'مختبر مصغّر: صلب أم سائل أم غاز؟',widget:(el,B)=>DCML.sort(el,B,{cats:['صلبة','سائلة','غازية'],items:[
 ['الأسيتيلين.',2,'(ص 125).'],['الكحولات.',1,'(ص 125).'],['القماش.',0,'(ص 125).'],['البوتاجاز.',2,'(ص 125).'],['المذيبات.',1,'(ص 125).']]})}
   ]},

  {st:5,short:'ب- الهواء',title:'ب- الهواء (الأكسجين)',ref:'ص 125',
   q:'خليط فيه بنزين كثير جداً… هل هو أخطر أم أقل خطراً؟',
   art:SFA.art('نسبة الأكسجين في الجو وحد استمرار الحريق، وحدود اشتعال بنزين السيارات',
    `<rect x="60" y="92" width="240" height="26" rx="6" fill="var(--surface)" stroke="var(--fg)" stroke-width="2"/><rect x="60" y="92" width="${(240*21/25).toFixed(0)}" height="26" rx="6" fill="var(--blue-soft)" stroke="var(--blue)" stroke-width="2"/><path d="M${(60+240*16/25).toFixed(0)} 84V126" stroke="var(--stop)" stroke-width="3"/>`+
    SFA.la((60+240*21/25).toFixed(0),140,'21 %',{fs:13,c:'var(--blue-ink)'})+SFA.la((60+240*16/25).toFixed(0),78,'16 %',{fs:13,c:'var(--stop)'})+
    `<rect x="60" y="206" width="240" height="26" rx="6" fill="var(--surface)" stroke="var(--fg)" stroke-width="2"/><rect x="${(60+240*1.6/10).toFixed(0)}" y="206" width="${(240*5.4/10).toFixed(0)}" height="26" fill="var(--stop-soft)" stroke="var(--stop)" stroke-width="2"/>`+flame(60+240*4.3/10,204,.35)+
    SFA.la((60+240*1.6/10).toFixed(0),250,'1.6 %',{fs:13,c:'var(--stop)'})+SFA.la((60+240*7/10).toFixed(0),250,'7 %',{fs:13,c:'var(--stop)'})+
    SFA.ar(180,62,'الأكسجين في الجو',{fs:14.5,w:700})+SFA.ar(180,176,'أبخرة البنزين في الهواء',{fs:14.5,w:700})+SFA.ar(180,280,'بينهما فقط: خليط قابل للاشتعال',{fs:13.5,c:'var(--stop)'})+
    SFA.hot(56,86,250,46,'«تبلغ نسبة الأكسجين في الجو حوالي 21 %، ويجب ألا تقل نسبة الأكسجين عن 16 % حتى يستمر الحريق» (الخط الأحمر).')+SFA.hot(56,196,250,64,'حدود الاشتعال لبنزين السيارات: أدنى مدى ⟦LEL⟧ 1.6 % وأعلى مدى ⟦UEL⟧ 7 %. أي نسبة بينهما خليط قابل للاشتعال إذا وجد مصدراً للاشتعال.')),
   cap:'أرقام الكتاب على شريطين.<br><b>مرّر المؤشر على كل شريط (أو المسه في الجوال) لتقرأ نص الكتاب.</b>',
   side:[
    {predict:{q:'خليط فيه 4 % أبخرة بنزين و96 % هواء، ووُجدت شرارة. ماذا يحدث؟',opts:[
     ['لا يشتعل لأنه أقل من 7 %',false,'7 % هو الحد الأعلى، وما تحته حتى 1.6 % قابل للاشتعال.'],
     ['لا يشتعل لأنه أكثر من 1.6 %',false,'1.6 % هو الحد الأدنى للاشتعال.'],
     ['يشتعل لأن 4 % بين 1.6 % و7 %',true,'«وأي نسبة خلط… تقع بين هذين الرقمين… سوف يتكون خليط قابل للاشتعال» (ص 125).']]}}
   ],
   body:[
    {book:`<p>جميع المواد تحتاج للأكسجين لكي تشتعل، وتبلغ نسبة الأكسجين في الجو حوالي ${lt('21 %')}، ويجب ألا تقل نسبة الأكسجين عن ${lt('16 %')} حتى يستمر الحريق.</p>
     <p>ويجب أن تتحد كل مادة مع الأكسجين بنسب معينة خاصة بها بما يسمى حدود الاشتعال <span class="ltr">(Flammability Limits)</span>، ولكل مادة ما يسمى بأدنى مدى للاشتعال <span class="ltr">(LEL)</span> وأعلى مدى للاشتعال <span class="ltr">(UEL)</span> وعلى سبيل المثال فإن أدنى مدى للاشتعال لبنزين السيارات هو ${lt('1.6 %')} وأعلى مدى له ${lt('7 %')}، لذلك إذا اتحد ${lt('1.6 %')} من أبخرة البنزين مع ${lt('98.4 %')} من الهواء لتكون خليط قابل للاشتعال إذا وجد مصدر للاشتعال لاشتعل. وإذا اتحد ${lt('7 %')} من أبخرة البنزين مع ${lt('93 %')} من الهواء لتكون أيضاً خليط قابل للاشتعال إذا وجد مصدراً للاشتعال لاشتعل. وأي نسبة خلط بين أبخرة بنزين السيارات وبين الهواء تقع بين هذين الرقمين (${lt('1.6 %')}، ${lt('7 %')}) سوف يتكون خليط قابل للاشتعال إذا وجد مصدر للاشتعال لاشتعل.</p>`,ref:'ص 125'},
    {tip:`<p>ما دون ${lt('1.6 %')} لا يشتعل لأن الأبخرة قليلة جداً (خليط «فقير»)، وما فوق ${lt('7 %')} لا يشتعل لأن الأكسجين لا يكفي (خليط «غني»). لكن الخليط الغني خطر أيضاً: إذا دخله هواء انخفضت نسبته فدخل منطقة الاشتعال.</p>`,title:'الفقير والغني'},
    {title:'مختبر مصغّر: نسبة أبخرة البنزين',widget:(el,B)=>DCML.lab(el,B,{intro:'حرّك المنزلق. النسبة رقم تختاره أنت؛ والحدّان (1.6 % و7 %) من الكتاب.',
     ins:[{k:'p',l:'أبخرة البنزين في الخليط',min:0,max:12,step:0.2,v:0.8,u:'%',dp:1}],
     calc:(s,P,B)=>{const z=s.p<1.6?0:s.p<=7?1:2;
      return {facts:[['أبخرة البنزين',DCML.fm(B,s.p,1)+' %',z===1?'bad':''],['الهواء',DCML.fm(B,100-s.p,1)+' %','']],
       bars:[{l:'موقع الخليط بين 0 و12 %',v:s.p,max:12,txt:DCML.fm(B,s.p,1)+' %',col:z===1?'--stop':'--blue'}],
       msg:['أقل من 1.6 %: الأبخرة قليلة جداً، فلا يشتعل الخليط حتى مع شرارة.','<b>خليط قابل للاشتعال:</b> بين 1.6 % و7 %؛ «إذا وجد مصدراً للاشتعال لاشتعل».','أكثر من 7 %: الأكسجين لا يكفي فلا يشتعل الآن — لكن إذا دخله هواء نزلت النسبة إلى منطقة الاشتعال.'][z],cls:z===1?'bad':z===2?'warn':''}}})}
   ]},

  {st:6,short:'ج- الحرارة',title:'ج- الحرارة (مصادر الاشتعال)',ref:'ص 125–126',
   q:'قطعة قماش فيها زيت تُركت في ركن الورشة… كيف تشتعل دون نار قريبة؟',
   art:SFA.art('مصادر الاشتعال الثمانية في الكتاب حول اللهب',
    flame(180,196,1.1)+
    [['الكهرباء',282,74],['التدخين',312,128],['القطع واللحام',306,190],['اللهب المباشر',270,246],['الأسطح الساخنة',90,246],['الاشتعال الذاتي',54,190],['الاستاتيكية',48,128],['الاحتكاك',78,74]].map(([t,x,y])=>`<rect x="${x-48}" y="${y-16}" width="96" height="28" rx="14" fill="var(--surface)" stroke="var(--live)" stroke-width="1.8"/>`+SFA.ar(x,y+4,t,{fs:12.5})).join('')+
    SFA.hot(234,58,96,28,'1- الكهرباء: التحميل الزائد، وعدم توصيل الأسلاك بطريقة سليمة، وتلف الأسلاك أو عازلها، وتلف المعدات. أكثر مصادر الاشتعال تسبباً في الحرائق.')+SFA.hot(264,112,96,28,'2- التدخين: في المركز الثاني بعد الكهرباء.')+SFA.hot(258,174,96,28,'3- الأعمال الساخنة (القطع واللحام): الشرر المتطاير أو المعدن المنصهر.')+SFA.hot(222,230,96,28,'4- اللهب المباشر: السجائر والولاعات والكبريت والسخانات والدفايات.')+
    SFA.hot(42,230,96,28,'5- الأسطح الساخنة: كالأفران والغلايات؛ تنتقل الحرارة بالتوصيل.')+SFA.hot(6,174,96,28,'6- الاشتعال الذاتي: أكسدة في الزيوت وبقايا الدهان ترفع حرارة قطع القماش حتى تشتعل.')+SFA.hot(0,112,96,28,'7- الكهرباء الاستاتيكية: شحنات من الاحتكاك تخرج شرراً.')+SFA.hot(30,58,96,28,'8- الاحتكاك بين أجزاء الماكينات.')),
   cap:'المصادر الثمانية بترتيب الكتاب، من الأعلى يميناً.<br><b>مرّر المؤشر على كل مصدر (أو المسه في الجوال) لتقرأ شرحه المختصر.</b>',
   side:[
    {predict:{q:'ما أكثر مصادر الاشتعال تسبباً في الحرائق حسب الكتاب؟',opts:[
     ['التدخين',false,'التدخين في المركز الثاني.'],
     ['الاحتكاك',false,'آخر القائمة.'],
     ['الكهرباء',true,'«من أكثر مصادر الاشتعال تسبباً لحدوث الحرائق هي الكهرباء» (ص 125).']]}}
   ],
   body:[
    {book:`<p>الحرارة هي الطاقة المطلوبة لزيادة درجة حرارة المادة القابلة للاشتعال لدرجة أن تتولد منها كمية كافية من الأبخرة لحدوث الاشتعال، ومصادر الاشتعال كثيرة ومتعددة منها:</p>
     <ol><li><b>الكهرباء:</b> من أكثر مصادر الاشتعال تسبباً لحدوث الحرائق هي الكهرباء، وذلك عن طريق: التحميل الزائد؛ عدم توصيل الأسلاك بطريقة سليمة؛ تلف الأسلاك الكهربائية أو تلف العازل الخاص بها؛ تلف المعدات والأجهزة الكهربائية.</li>
     <li><b>التدخين:</b> يأتي التدخين في المركز الثاني بعد الكهرباء تسبباً في الحرائق. وتحدث معظم هذه الحرائق بسبب سقوط السجائر أو بقايا السجاير المشتعلة على الأثاث أو عند التدخين أثناء النوم.</li>
     <li><b>الأعمال الساخنة (أعمال القطع واللحام):</b> تحدث الحرائق بسبب أعمال اللحام والقطع في أماكن تحتوي على مواد قابلة للاشتعال بسبب الشرر المتطاير، أو بسبب المعدن المنصهر وذلك في حالة إجراء عمليات اللحام والقطع بدون اتخاذ إجراءات السلامة اللازمة.</li>
     <li><b>اللهب المباشر:</b> تشمل السجائر، الولاعات، الكبريت، السخانات والدفايات التي قد تسبب في إشعال المواد القابلة للاشتعال المجاورة.</li>
     <li><b>الأسطح الساخنة:</b> مثل الأفران والغلايات والأسطح الساخنة حيث تنتقل الحرارة منها إلى المواد القريبة أو الملاصقة لها عن طريق التوصيل الحراري وتتسبب في اشتعال هذه المواد.</li>
     <li><b>الاشتعال الذاتي:</b> بعض المواد يحدث بها تفاعل كيميائي (أكسدة) يسبب ارتفاع درجة الحرارة وهذه المواد تحتفظ بدرجات الحرارة ولا تسمح بتسربها للجو المحيط وهذه المواد هي: الزيوت النباتية والحيوانية وبقايا الدهان، وعندما يتم استخدام قطع من القماش في تنظيف هذه المواد وترك قطع القماش لمدد طويلة، وبسبب الأكسدة وارتفاع درجة الحرارة والاستمرار في ارتفاع درجة الحرارة وعدم تسربها للجو إلى أن تصل إلى درجة اشتعال قطع القماش وبالتالي تشتعل هذه القطع مسببة حدوث حريق.</li>
     <li><b>الكهرباء الاستاتيكية:</b> تنتج الكهرباء الاستاتيكية نتيجة لاحتكاك بين شيئين (مثل سريان المواد البترولية في أنابيب البترول) وتتراكم هذه الشحنات إلى أن تصل إلى حد تخرج فيه على هيئة شرر حيث من الممكن أن يتسبب هذا الشرر في حدوث حريق في أية مواد ملتهبة مجاورة.</li>
     <li><b>الاحتكاك:</b> في حالة حدوث احتكاك بين أجزاء الماكينات ببعضها قد يحدث ارتفاع في درجات الحرارة من الممكن أن يسبب اشتعال المواد القابلة للاشتعال القريبة من هذه المعدات والماكينات.</li></ol>`,ref:'ص 125–126'},
    {title:'مختبر مصغّر: ما مصدر الاشتعال؟',widget:(el,B)=>DCML.sort(el,B,{cats:['الكهرباء','التدخين','الأعمال الساخنة','الاشتعال الذاتي','الاستاتيكية','الاحتكاك'],items:[
 ['مشترك كهربائي عليه أجهزة كثيرة فوق طاقته.',0,'«التحميل الزائد» (ص 125).'],
 ['شرر لحام يسقط على كرتون في المخزن.',2,'«بسبب الشرر المتطاير» (ص 126).'],
 ['قطع قماش فيها بقايا دهان تُركت أياماً في ركن.',3,'(ص 126).'],
 ['بنزين يسري في أنبوب فتتراكم شحنات تخرج شرراً.',4,'(ص 126).'],
 ['محمل آلة جاف يسخن من الاحتكاك قرب خرق زيتية.',5,'(ص 126).'],
 ['سيجارة سقطت على الأثاث.',1,'(ص 125).']]})}
   ]},

  {st:7,short:'د- التفاعل المتسلسل',title:'د- التفاعل الكيميائي المتسلسل',ref:'ص 126',
   q:'من أين يأتي الحريق بالطاقة ليستمر وحده؟',
   art:SFA.art('الوقود والحرارة والأكسجين تنتج شقوقاً طليقة تُبقي التفاعل مستمراً',
    `<circle cx="180" cy="170" r="88" fill="none" stroke="var(--live)" stroke-width="3" stroke-dasharray="10 7"/>`+
    [['الوقود',180,82],['الحرارة',256,214],['الأكسجين',104,214]].map(([t,x,y])=>`<circle cx="${x}" cy="${y}" r="30" fill="var(--surface)" stroke="var(--fg)" stroke-width="2"/>`+SFA.ar(x,y+5,t,{fs:13})).join('')+
    SFA.arr(226,114,244,140,'var(--live)',2.4)+SFA.arr(212,232,148,232,'var(--live)',2.4)+SFA.arr(114,176,140,112,'var(--live)',2.4)+
    flame(180,186,.5)+[[166,198],[194,198],[180,212]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="5" fill="var(--stop)"/>`).join('')+
    SFA.ar(180,282,'حلقة تستمر وحدها',{fs:15,w:700})+
    SFA.hot(140,150,80,72,'الشقوق الطليقة ⟦Free Radicals⟧ (النقاط الحمراء): «مواد كيميائية فعالة» تنتج من العناصر الثلاثة.')+SFA.hot(92,64,176,40,'الحلقة المتقطعة: ما دامت العناصر الثلاثة بالنسب الصحيحة يستمر الحريق.')),
   cap:'رسم توضيحي للفكرة (ليس شكلاً في الكتاب).<br><b>مرّر المؤشر على النقاط الحمراء والحلقة (أو المسهما في الجوال) لتعرف معناهما.</b>',
   side:[
    {predict:{q:'ما اسم المواد الكيميائية الفعالة التي تنتج من عناصر الحريق الثلاثة؟',opts:[
     ['الشقوق الطليقة (Free Radicals)',true,'(ص 126).'],
     ['البودرة الجافة',false,'هذه مادة إطفاء.'],
     ['الهالون',false,'مادة إطفاء أوقف استخدامها.']]}}
   ],
   body:[
    {book:`<p>يستمر الحريق في الاشتعال طالما العناصر الثلاثة (المادة، الحرارة، والأكسجين) موجودة بالنسب الصحيحة، وينتج من هذه العناصر مواد كيميائية فعالة تعرف بالشقوق الطليقة <span class="ltr">Free Radicals</span>، والحريق يستمر ويعرف بالتفاعل الكيميائي المتسلسل.</p>`,ref:'ص 126'},
    {tip:`<p>هذا العنصر الرابع هو ما تستهدفه البودرة والهالون: تمتص الشقوق الطليقة فتقطع الحلقة ويتوقف الحريق — كما سترى في «إطفاء الحرائق» في الدرس التالي.</p>`,title:'لماذا يهمنا؟'},
    {title:'تحقق سريع: صح أم خطأ؟',widget:(el,B)=>DCML.tf(el,B,{items:[
 ['يستمر الحريق ما دامت العناصر الثلاثة موجودة بالنسب الصحيحة.',true,'(ص 126).'],
 ['التفاعل المتسلسل مادة نضيفها نحن إلى الحريق.',false,'ينتج من العناصر الثلاثة نفسها (ص 126).']]})}
   ]},

  {st:8,short:'أنواع الحرائق',title:'6-3-2 أنواع الحرائق <span class="ltr">(Fire Classes)</span>',ref:'ص 127–129',
   q:'حريق في لوحة كهربائية وحريق في مقلاة زيت… هل يطفآن بالطريقة نفسها؟',
   art:SFA.art('رموز أنواع الحرائق الخمسة',
    `<g transform="translate(0 0)">${clsSym('A',264,104,30)}${clsSym('B',180,104,30)}${clsSym('C',96,104,30)}${clsSym('D',228,214,30)}${clsSym('K',132,214,30)}</g>`+
    SFA.ar(264,156,'صلبة',{fs:14})+SFA.ar(180,156,'سوائل وغازات',{fs:14})+SFA.ar(96,156,'كهربائية',{fs:14})+SFA.ar(228,266,'معادن',{fs:14})+SFA.ar(132,266,'زيوت المطابخ',{fs:14})+SFA.ar(180,48,'نوع الحريق = نوع الوقود',{fs:15,w:700})+
    SFA.hot(230,70,68,70,'النوع A (مثلث أخضر): المواد الصلبة كالأخشاب والأوراق والملابس والمطاط.')+SFA.hot(146,70,68,70,'النوع B (مربع أحمر): السوائل والغازات الملتهبة كالبنزين والكيروسين.')+SFA.hot(62,70,68,70,'النوع C (دائرة زرقاء): المعدات والأجهزة والتجهيزات الكهربائية.')+SFA.hot(194,180,68,70,'النوع D (نجمة صفراء): المعادن كالصوديوم والبوتاسيوم والمغنيسيوم.')+SFA.hot(98,180,68,70,'النوع K: الزيوت النباتية في المطابخ — نوع أُضيف حديثاً.')),
   cap:'رموز الأشكال <span class="ltr">(6-10)</span> إلى <span class="ltr">(6-14)</span>.<br><b>مرّر المؤشر على كل رمز (أو المسه في الجوال) لتعرف نوعه.</b>',
   side:[
    {predict:{q:'لماذا لا يُفضّل استخدام الماء في حرائق النوع B؟',opts:[
     ['لأنه غالٍ',false,'لا.'],
     ['لأنه يتسبب في زيادة انتشار الحريق',true,'(ص 127).'],
     ['لأنه لا يبرد',false,'الماء يبرد، لكن السائل المشتعل يطفو عليه وينتشر.']]}}
   ],
   body:[
    {book:`<p>يتم تقسيم الحرائق إلى أنواع حسب نوع الوقود المشتعل، وتوجد خمسة أنواع للحرائق حسب النظام الأمريكي هي:</p>
     <ol><li><b>حرائق النوع (A):</b> هي الحرائق التي تحدث في المواد الصلبة كالأخشاب والأوراق والملابس والمطاط وبعض أنواع البلاستيك (الشكل 6-10) ومن أفضل مواد الإطفاء التي تستخدم لإطفاء هذا النوع من الحرائق هي الماء، كذلك بعض طفايات البودرة الجافة نوع (ABC).</li>
     <li><b>حرائق النوع (B):</b> هي الحرائق التي تحدث في المواد السائلة والغازية الملتهبة مثل بنزين السيارات، الكيروسين، المذيبات، الكحولات (الشكل 6-11). ومن أفضل مواد الإطفاء المستخدمة لإطفاء هذا النوع من الحرائق هي: الرغاوى، ثاني أكسيد الكربون، الهالون، البودرة. ولا يفضل استخدام الماء لمكافحة هذا النوع من الحرائق حيث يتسبب في زيادة انتشار الحريق.</li>
     <li><b>حرائق النوع (C):</b> هي الحرائق التي تنشأ في المعدات والأجهزة والتجهيزات الكهربائية (الشكل 6-12)، ويستخدم ثاني أكسيد الكربون والهالون والبودرة نوع (ABC) لإطفاء هذه الحرائق. ولا يستخدم الماء أو أية مواد إطفاء أخرى تحتوي على الماء مثل الرغاوى على الإطلاق لإطفاء هذا النوع من الحرائق، حيث أن الماء موصل جيد للكهرباء لذلك من الممكن أن يتسبب في صعق الشخص المستعمل للطفاية.</li>
     <li><b>حرائق النوع (D):</b> هي الحرائق التي تنشأ في المعادن مثل الصوديوم والبوتاسيوم والمغنيسيوم (الشكل 6-13) ويستعمل نوع خاص من البودرة الجافة لإطفاء هذا النوع من الحرائق.</li>
     <li><b>حرائق النوع (K):</b> هو نوع حديث من الحرائق تم إضافته حديثاً لأنواع الحرائق ويختص بالحرائق التي تحدث بالزيوت النباتية بالمطابخ كما هو مبين في الشكل 6-14.</li></ol>`,ref:'ص 127–129'},
    {html:SFA.fig(figClasses(),'الأشكال <span class="ltr">(6-10)</span> إلى <span class="ltr">(6-14)</span> ص 127–129 — رموز أنواع الحرائق (الصور المجاورة مبسّطة).',660)},
    {watch:`<p>في الشكل <span class="ltr">(6-11)</span> ص 127 رمز النوع <span class="ltr">B</span> الكبير مربع أحمر، والرمز الصغير فوق الصورة مستطيل أزرق فاتح؛ اعتمدنا المربع الأحمر. ولا يذكر الكتاب مواد إطفاء حرائق النوع <span class="ltr">K</span>؛ انظر الإضافة في الدرس التالي.</p>`},
    {title:'مختبر مصغّر: ما نوع الحريق؟',widget:(el,B)=>DCML.sort(el,B,{cats:['A','B','C','D','K'],items:[
 ['سلة مهملات فيها أوراق.',0,'مواد صلبة (ص 127).'],
 ['كيروسين منسكب يشتعل.',1,'سوائل ملتهبة (ص 127).'],
 ['محرك كهربائي موصول يحترق.',2,'معدات كهربائية (ص 128).'],
 ['برادة مغنيسيوم تشتعل.',3,'معادن (ص 128).'],
 ['زيت قلي يشتعل في مطبخ مطعم.',4,'الزيوت النباتية بالمطابخ (ص 129).'],
 ['إطار مطاط يحترق.',0,'المطاط من أمثلة النوع A (ص 127).']]})}
   ]},

  {recap:[
   'مخاطر الحريق ثلاثة: شخصي (على الأفراد)، وتدميري (على المبنى)، وتعرضي (على المجاورات) (ص 123–124).',
   'الحريق تفاعل كيميائي يشمل الأكسدة السريعة؛ عناصره أربعة (هرم الاشتعال): الوقود والأكسجين والحرارة والتفاعل المتسلسل — الشكل (6-9).',
   'الذي يحترق من الوقود أبخرته؛ والأكسجين في الجو نحو 21 % ولا يستمر الحريق تحت 16 %؛ والبنزين يشتعل بين 1.6 % و7 % (ص 125).',
   'أكثر مصادر الاشتعال الكهرباء ثم التدخين، ومنها اللحام والأسطح الساخنة والاشتعال الذاتي والكهرباء الاستاتيكية والاحتكاك (ص 125–126).',
   'أنواع الحرائق: A صلبة، B سوائل وغازات، C كهربائية، D معادن، K زيوت المطابخ (ص 127–129).']}
],
 theory:[
  {h:'ثانياً: الحرائق وطرق إطفائها',ref:'ص 123',html:`<p>تبدأ الحرائق عادة على نطاق ضيق، لأن معظمها ينشأ <b>من مستصغر الشرر</b> بسبب إهمال في اتباع طرق الوقاية، لكنها سرعان ما تنتشر إذا لم يبادر بإطفائها. ولأن المواد القابلة للاشتعال موجودة حولنا في البيت والشارع والمدرسة ومكان العمل، يجب اتخاذ التدابير الوقائية لمنع حدوث الحرائق والقضاء على مسبباتها، والسيطرة عليها وإخمادها في أسرع وقت بأقل الخسائر. وتُلخَّص مخاطر الحريق في ثلاثة أنواع:</p>
   <ol><li><b>الخطر الشخصي</b> (الخطر على الأفراد): المخاطر التي تعرض حياة الأفراد للإصابات، مما يستوجب توفير تدابير للنجاة عند حدوث الحريق.</li>
   <li><b>الخطر التدميري:</b> ما يحدث من دمار في المباني والمنشآت. وتختلف شدته باختلاف ما يحويه المبنى من مواد قابلة للاشتعال، ونوعها ومدى قابليتها للاحتراق وطريقة توزيعها وقيمتها الاقتصادية؛ فالمبنى المخصص للتخزين خطره غير الخطر المنتظر في مباني المكاتب أو السكن. «كمية وطبيعة مكونات المبنى هي التي تتحكم في مدى خطورة الحريق واستمراره والأثر التدميري الذي ينتج عنه».</li>
   <li><b>الخطر التعرضي</b> (الخطر على المجاورات، ويسمى الخطر الخارجي): المخاطر التي تهدد المواقع القريبة من مكان الحريق، ولا يشترط اتصال مباشر بين الحريق والمبنى المعرض للخطر. ولذلك تُنشأ محطات الوقود في منطقة غير سكنية، أو على بعد مسافة معينة من المباني السكنية.</li></ol>`},
  {err:'<span class="fixnote">في الكتاب (ص 123) «مواد قابلة للانتشار» والمقصود «للاشتعال»، و«يكون غير المنتظر» عبارة غامضة؛ عرضناهما أعلاه بالمعنى المقصود.</span>'},
  {h:'6-3 الحرائق وطفايات الحريق FIRE SAFETY',ref:'ص 124',html:`<p>يتناول هذا الجزء باختصار: ما الحرائق؟ وما أسبابها؟ وأنواعها المختلفة، ثم طفايات الحريق المختلفة وطرق استعمالها (الدرس التالي).</p>`},
  {note:'الكتاب يكتب هنا «تشرح هذه المحاضرة» (ص 124)، وفي ص 130 «في هذه المحاضرة» — عبارتان باقيتان من مصدر الأصل.'},
  {h:'6-3-1 ما الحريق؟',ref:'ص 124',html:`<p>«ببساطة شديدة الحريق هو عبارة عن <b>تفاعل كيميائي يشمل الأكسدة السريعة للمواد القابلة للاشتعال</b>». في الماضي كنا نعرف ما يسمى <b>مثلث الاشتعال</b> (المادة، والأكسجين، ومصدر الاشتعال)، ثم تغير المفهوم لتصبح عناصر الاشتعال <b>أربعة</b>، وأُضيف العنصر الرابع: <b>التفاعل الكيميائي المتسلسل</b> للحريق (Chemical Chain Reaction)، فتكوّن <b>هرم الاشتعال</b> (Fire Tetrahedron) بدلاً من مثلث الاشتعال.</p>`},
  {fig:'(6-9)',ref:'ص 124',caption:'هرم الاشتعال. (أسماء العناصر على الأوجه إضافة منّا؛ الشكل في الكتاب بلا أسماء.)',draw:()=>box(fig69(),330)},
  {html:`<p>عناصر الاشتعال الأربعة:</p><ol style="list-style:none;padding-inline-start:4px"><li>أ- المادة القابلة للاشتعال <span class="ltr">Fuel (Combustible Substances)</span></li><li>ب- الهواء (الأكسجين) <span class="ltr">Air (Oxygen)</span></li><li>ج- الحرارة (مصادر الاشتعال) <span class="ltr">Heat (Sources of Ignition)</span></li><li>د- التفاعل الكيميائي المتسلسل <span class="ltr">Chain Chemical Reaction</span></li></ol>`},
  {h:'أ- الوقود (المادة القابلة للاشتعال)',ref:'ص 124–125',html:`<ul><li><b>المواد الصلبة:</b> مثل الأخشاب، والقماش، والأوراق، والكرتون.</li><li><b>المواد السائلة:</b> مثل بنزين السيارات، والمذيبات، والكحولات.</li><li><b>المواد الغازية:</b> البوتاجاز، والأسيتيلين، والهيدروجين.</li></ul>
   <p>«الشيء الذي يحترق من الوقود هو <b>الأبخرة</b> التي ينتجها، وهذه الأبخرة إذا اتحدت مع الهواء بالنسب الصحيحة لكل مادة ووجدت مصدرًا للاشتعال لاشتعلت.»</p>`},
  {h:'ب- الهواء (الأكسجين)',ref:'ص 125',html:`<p>جميع المواد تحتاج للأكسجين لكي تشتعل. تبلغ نسبة الأكسجين في الجو حوالي <b>${lt('21 %')}</b>، و<b>يجب ألا تقل عن ${lt('16 %')} حتى يستمر الحريق</b>.</p>
   <p>ويجب أن تتحد كل مادة مع الأكسجين بنسب معينة خاصة بها تسمى <b>حدود الاشتعال</b> (Flammability Limits): لكل مادة <b>أدنى مدى للاشتعال (LEL)</b> و<b>أعلى مدى للاشتعال (UEL)</b>. فمثلاً أدنى مدى لبنزين السيارات <b>${lt('1.6 %')}</b> وأعلاه <b>${lt('7 %')}</b>:</p>
   <ul><li>إذا اتحد ${lt('1.6 %')} من أبخرة البنزين مع ${lt('98.4 %')} من الهواء تكوّن خليط قابل للاشتعال إذا وجد مصدرًا للاشتعال.</li><li>وإذا اتحد ${lt('7 %')} من أبخرة البنزين مع ${lt('93 %')} من الهواء تكوّن أيضًا خليط قابل للاشتعال.</li><li>وأي نسبة خلط بين هذين الرقمين (${lt('1.6 %')} و${lt('7 %')}) يتكوّن منها خليط قابل للاشتعال إذا وجد مصدر للاشتعال.</li></ul>`},
  {note:TIP+'ما دون <span class="ltr">1.6 %</span> لا يشتعل لأن الأبخرة قليلة جدًا، وما فوق <span class="ltr">7 %</span> لا يشتعل لأن الأكسجين لا يكفي. لكن الخليط «الغني» خطر أيضًا: إذا دخله هواء انخفضت نسبته فدخل منطقة الاشتعال. جرّب الشريط في «المختبر».'},
  {h:'ج- الحرارة (مصادر الاشتعال)',ref:'ص 125–126',html:`<p>الحرارة هي الطاقة المطلوبة لرفع درجة حرارة المادة القابلة للاشتعال حتى يتولد منها كمية كافية من الأبخرة لحدوث الاشتعال. ومصادر الاشتعال كثيرة منها:</p>
   <ol><li><b>الكهرباء:</b> من أكثر مصادر الاشتعال تسببًا في الحرائق، عن طريق: التحميل الزائد، وعدم توصيل الأسلاك بطريقة سليمة، وتلف الأسلاك أو عازلها، وتلف المعدات والأجهزة الكهربائية.</li>
   <li><b>التدخين:</b> في المركز الثاني بعد الكهرباء؛ معظمها بسبب سقوط السجائر أو بقاياها المشتعلة على الأثاث، أو التدخين أثناء النوم.</li>
   <li><b>الأعمال الساخنة (القطع واللحام):</b> في أماكن فيها مواد قابلة للاشتعال، بسبب الشرر المتطاير أو المعدن المنصهر، إذا لم تتخذ إجراءات السلامة.</li>
   <li><b>اللهب المباشر:</b> السجائر والولاعات والكبريت والسخانات والدفايات.</li>
   <li><b>الأسطح الساخنة:</b> كالأفران والغلايات؛ تنتقل الحرارة منها بالتوصيل إلى المواد القريبة أو الملاصقة فتشعلها.</li>
   <li><b>الاشتعال الذاتي:</b> مواد يحدث فيها تفاعل أكسدة يرفع حرارتها ولا تسمح بتسربها، مثل الزيوت النباتية والحيوانية وبقايا الدهان؛ فقطع القماش المستخدمة في تنظيفها إذا تُركت مدة طويلة ترتفع حرارتها حتى تشتعل.</li>
   <li><b>الكهرباء الاستاتيكية:</b> تنتج من الاحتكاك بين شيئين (مثل سريان المواد البترولية في الأنابيب) وتتراكم حتى تخرج شررًا قد يشعل المواد الملتهبة المجاورة.</li>
   <li><b>الاحتكاك:</b> بين أجزاء الماكينات، فترتفع الحرارة وقد تشتعل المواد القريبة.</li></ol>`},
  {h:'د- التفاعل الكيميائي المتسلسل',ref:'ص 126',html:`<p>يستمر الحريق ما دامت العناصر الثلاثة (المادة والحرارة والأكسجين) موجودة بالنسب الصحيحة، وينتج من هذه العناصر مواد كيميائية فعالة تعرف <b>بالشقوق الطليقة</b> (Free Radicals)، والحريق يستمر ويعرف <b>بالتفاعل الكيميائي المتسلسل</b>.</p>`},
  {h:'6-3-2 أنواع الحرائق Fire Classes',ref:'ص 127–129',html:`<p>تُقسَّم الحرائق حسب <b>نوع الوقود المشتعل</b>، وتوجد خمسة أنواع حسب النظام الأمريكي:</p>`},
  {fig:'(6-10) إلى (6-14)',ref:'ص 127–129',caption:'رموز أنواع الحرائق A وB وC وD وK (الصور المجاورة لها مبسّطة).',draw:()=>box(figClasses(),660)},
  {html:`<ol><li><b>حرائق النوع (A):</b> في المواد الصلبة كالأخشاب والأوراق والملابس والمطاط وبعض أنواع البلاستيك. ومن أفضل مواد إطفائها <b>الماء</b>، وكذلك بعض طفايات <b>البودرة الجافة نوع (ABC)</b>.</li>
   <li><b>حرائق النوع (B):</b> في المواد السائلة والغازية الملتهبة مثل بنزين السيارات والكيروسين والمذيبات والكحولات. ومن أفضل مواد إطفائها: <b>الرغاوى، وثاني أكسيد الكربون، والهالون، والبودرة</b>. و<b>لا يُفضّل استخدام الماء</b> لأنه يتسبب في زيادة انتشار الحريق.</li>
   <li><b>حرائق النوع (C):</b> في المعدات والأجهزة والتجهيزات الكهربائية. ويُستخدم <b>ثاني أكسيد الكربون والهالون والبودرة نوع (ABC)</b>. و«<b>لا يستخدم الماء أو أية مواد إطفاء أخرى تحتوي على الماء مثل الرغاوى على الإطلاق</b> … حيث أن الماء موصل جيد للكهرباء لذلك من الممكن أن يتسبب في صعق الشخص المستعمل للطفاية».</li>
   <li><b>حرائق النوع (D):</b> في المعادن مثل الصوديوم والبوتاسيوم والمغنيسيوم، ويُستعمل <b>نوع خاص من البودرة الجافة</b>.</li>
   <li><b>حرائق النوع (K):</b> نوع أُضيف حديثًا، ويختص بالحرائق التي تحدث <b>بالزيوت النباتية بالمطابخ</b>.</li></ol>
   <div class="tablebox"><table class="tt"><thead><tr><th>النوع</th><th>المادة المشتعلة</th><th>مواد الإطفاء المناسبة</th><th>الممنوع أو غير المفضل</th></tr></thead><tbody>
   <tr><td>A</td><td>المواد الصلبة</td><td>الماء، والبودرة ABC</td><td>—</td></tr><tr><td>B</td><td>السوائل والغازات الملتهبة</td><td>الرغاوى، وثاني أكسيد الكربون، والهالون، والبودرة</td><td>الماء (يزيد انتشار الحريق)</td></tr>
   <tr><td>C</td><td>الأجهزة والتجهيزات الكهربائية</td><td>ثاني أكسيد الكربون، والهالون، والبودرة ABC</td><td>الماء وكل ما يحتوي ماءً كالرغاوى (خطر الصعق)</td></tr><tr><td>D</td><td>المعادن</td><td>نوع خاص من البودرة الجافة</td><td>—</td></tr><tr><td>K</td><td>زيوت المطابخ</td><td colspan="2">لا يذكر الكتاب مواد إطفائها؛ انظر الإضافة في الدرس التالي</td></tr></tbody></table></div>
   <p class="sub">الجدول تجميع منّا لنص ص 127–129، وليس جدولاً في الكتاب.</p>`},
  {note:'في الشكل (6-11) ص 127 رمز النوع B الكبير مربع أحمر، والرمز الصغير فوق الصورة مستطيل أزرق فاتح؛ اعتمدنا المربع الأحمر.'}
 ],
 lab:(el)=>tetraLab(el),
 quiz:[
  {q:'ما العنصر الرابع الذي أُضيف إلى مثلث الاشتعال فصار هرمًا؟',o:['الماء','التفاعل الكيميائي المتسلسل','ثاني أكسيد الكربون','الضغط'],c:1,e:'(ص 124).'},
  {q:'كم يجب ألا تقل نسبة الأكسجين حتى يستمر الحريق؟',o:['5 %','16 %','21 %','50 %'],c:1,e:'«ويجب ألا تقل نسبة الأوكسيجين عن 16 % حتى يستمر الحريق» (ص 125).'},
  {q:'خليط فيه 4 % أبخرة بنزين و96 % هواء، ووُجدت شرارة. ماذا يحدث؟',o:['لا يشتعل لأنه أقل من 7 %','يشتعل لأنه بين 1.6 % و7 %','لا يشتعل لأنه أكثر من 1.6 %','يتجمد'],c:1,e:'أي نسبة بين LEL = 1.6 % وUEL = 7 % قابلة للاشتعال (ص 125).'},
  {q:'ما أكثر مصادر الاشتعال تسببًا في الحرائق حسب الكتاب؟',o:['التدخين','الكهرباء','الاحتكاك','الاشتعال الذاتي'],c:1,e:'الكهرباء أولاً، ثم التدخين في المركز الثاني (ص 125).'},
  {q:'حريق في لوحة توزيع كهربائية من أي نوع؟',o:['A','B','C','D'],c:2,e:'النوع C: المعدات والأجهزة والتجهيزات الكهربائية (ص 128).'},
  {q:'لماذا لا يُفضَّل الماء في حرائق النوع B؟',o:['لأنه غالٍ','لأنه يتسبب في زيادة انتشار الحريق','لأنه يتجمد','لأنه يوصل الحرارة'],c:1,e:'(ص 127).'}
 ]
});

B.lesson({
 id:'u6-l4',unit:6,order:4,pages:'128–134',
 title:'الطفايات وطرق الإطفاء وطريقة PASS',
 summary:'أنواع طفايات الحريق (البودرة، وثاني أكسيد الكربون، والهالون، ومع إضافة قصيرة للماء والرغوة وطفاية المطابخ K)، وطرق الإطفاء الأربع، والقواعد العامة، وطريقة PASS، وأسئلة الوحدة.',
 stations:[
  {intro:true},
{st:1,short:'أنواع الطفايات',title:'6-3-3 أنواع طفايات الحريق',ref:'ص 129',
   q:'ست طفايات حمراء متشابهة… كيف تعرف أيها يصلح لحريقك؟',
   art:SFA.art('ستة أنواع من طفايات الحريق',
    [['water',62,'الماء'],['foam',122,'الرغاوى'],['pow',182,'البودرة'],['co2',242,'CO₂'],['h',302,'الهالون']].map(([k,x,t])=>extSVG(k==='water'?'H2O':k==='foam'?'FOAM':k,x-6,160,0.9)+SFA.ar(x,236,t,{fs:13})).join('')+
    SFA.ar(180,272,'+ طفاية المطابخ (البودرة السائلة)',{fs:13})+SFA.ar(180,58,'ستة أنواع للطفايات',{fs:15,w:700})+
    SFA.hot(36,100,52,150,'طفاية الماء: لا يشرحها الكتاب — انظر الإضافة.')+SFA.hot(96,100,52,150,'طفاية الرغاوى: لا يشرحها الكتاب — انظر الإضافة.')+SFA.hot(156,100,52,150,'طفاية البودرة الجافة: يشرحها الكتاب.')+SFA.hot(216,100,52,150,'طفاية ثاني أكسيد الكربون: يشرحها الكتاب.')+SFA.hot(276,100,52,150,'طفاية الهالون: يشرحها الكتاب، وقد أُوقف استخدامها.')),
   cap:'الرموز على الطفايات توضيحية.<br><b>مرّر المؤشر على كل طفاية (أو المسها في الجوال) لتعرف هل يشرحها الكتاب.</b>',
   side:[
    {predict:{q:'كم نوعاً من الطفايات يعدد الكتاب، وكم يشرح؟',opts:[
     ['يعدد ستة ويشرح ثلاثة',true,'يشرح البودرة وثاني أكسيد الكربون والهالون فقط (ص 129).'],
     ['يعدد ثلاثة ويشرحها كلها',false,'يعدد ستة.'],
     ['يعدد خمسة ويشرح خمسة',false,'لا.']]}}
   ],
   body:[
    {book:`<p>يوجد ستة أنواع لطفايات الحريق هي:</p><ol><li>طفايات الماء</li><li>طفايات الرغاوى</li><li>طفايات البودرة الجافة</li><li>طفايات ثاني أكسيد الكربون</li><li>طفايات الهالون</li><li>طفايات البودرة السائلة (للمطابخ)</li></ol><p>ونظراً لعدم انتشار النوعين الأولين (الماء والرغاوى) سوف نقوم بإلقاء الضوء على الأنواع الأخرى (البودرة، ثاني أكسيد الكربون، الهالون)</p>`,ref:'ص 129'},
    {watch:`<p>يعدد الكتاب ستة أنواع ويشرح ثلاثة فقط، فلا يشرح الماء ولا الرغوة ولا طفاية المطابخ <span class="ltr">(K)</span>. وقوله «عدم انتشار» الماء والرغاوى غير دقيق: الماء أكثر وسائل الإطفاء شيوعاً كما يقول الكتاب نفسه في طريقة التبريد (ص 133).</p>`,fix:1},
    {add:`<p><b>طفاية الماء:</b> أسطوانة فيها ماء يُدفع بغاز مضغوط. <b>تطفئ بالتبريد</b>، وتناسب حرائق <b>النوع <span class="ltr">A</span></b>. <b>لا تُستخدم</b> على الكهرباء الموصولة (خطر الصعق)، ولا على البنزين والزيوت (تنشر الحريق)، ولا على المعادن المشتعلة.</p>
     <p><b>طفاية الرغوة:</b> ماء مخلوط بمادة رغوية تطفو على السطح. <b>تطفئ بالخنق والتبريد</b>، وتناسب حرائق <b>النوع <span class="ltr">B</span></b> و<span class="ltr">A</span>. <b>لا تُستخدم</b> على الكهرباء الموصولة لأنها تحتوي ماءً (ص 128).</p>
     <p><b>طفاية المطابخ (النوع <span class="ltr">K</span>)</b> — يسميها الكتاب «البودرة السائلة (للمطابخ)»، وتعرف بالمادة الكيميائية الرطبة <span class="ltr">(Wet Chemical)</span>: ترش محلولاً يكوّن على سطح الزيت الساخن طبقة عازلة تشبه الصابون ويبرّده فلا يعود الاشتعال. <b>لا يُستخدم الماء أبداً على زيت مشتعل</b>: يغلي تحته فجأة فيقذفه مشتعلاً.</p>`,title:'الأنواع الثلاثة التي لا يشرحها الكتاب'},
    {title:'تحقق سريع: صح أم خطأ؟',widget:(el,B)=>DCML.tf(el,B,{items:[
 ['طفاية الرغوة آمنة على لوحة كهربائية موصولة.',false,'الرغاوى تحتوي ماءً، ولا تستخدم «على الإطلاق» في حرائق النوع C (ص 128).'],
 ['يمكن إطفاء زيت مقلاة مشتعل بالماء.',false,'إضافة من خارج الكتاب: الماء يغلي تحت الزيت فيقذفه مشتعلاً؛ تستخدم طفاية المطابخ.'],
 ['الماء من أفضل مواد إطفاء النوع A.',true,'(ص 127).']]})}
   ]},

  {st:2,short:'1- البودرة',title:'1- طفايات البودرة',ref:'ص 129–130',
   q:'البودرة تطفئ معظم الحرائق بسرعة… فلماذا لا نستعملها في غرفة الحاسبات؟',
   art:SFA.art('سحابة بودرة تغطي الوقود المشتعل فتفصله عن الأكسجين',
    extSVG('pow',70,170,1.2)+`<path d="M110 120Q180 110 230 170" fill="none" stroke="var(--fg)" stroke-width="3"/>`+
    [...Array(40)].map((_,i)=>`<circle cx="${(200+(i*37)%110).toFixed(0)}" cy="${(150+(i*23)%90).toFixed(0)}" r="3" fill="var(--blue)"/>`).join('')+flame(260,262,.7)+
    `<rect x="210" y="262" width="110" height="10" fill="var(--fg)"/>`+SFA.ar(260,120,'طبقة بودرة',{fs:14})+SFA.ar(180,58,'تعزل الوقود وتوقف التفاعل',{fs:15,w:700})+
    SFA.hot(36,100,74,140,'طفاية البودرة ⟦ABC⟧: يكون موضحاً عليها أنواع الحرائق التي تصلح لها.')+SFA.hot(196,140,128,110,'البودرة «تحيط الوقود المشتعل بطبقة… تفصل الوقود عن الأكسجين»، و«تمتص الشقوق الطليقة» فتوقف التفاعل المتسلسل.')),
   cap:'كيف تطفئ البودرة.<br><b>مرّر المؤشر على الطفاية والسحابة (أو المسهما في الجوال) لتعرف معناهما.</b>',
   side:[
    {predict:{q:'لماذا لا يُفضل استخدام طفاية البودرة على أجهزة الحاسب؟',opts:[
     ['لأنها لا تطفئ حرائق الكهرباء',false,'تطفئ النوع C، لكن المشكلة في أثرها على الأجهزة.'],
     ['لأن جزيئات البودرة قد تتسبب في تلف هذه الأجهزة',true,'(ص 129).'],
     ['لأنها تضر بطبقة الأوزون',false,'هذا الهالون.']]}}
   ],
   body:[
    {book:`<p>تستعمل طفايات البودرة وحسب نوع البودرة داخلها في إطفاء الحرائق التي تنشأ في المواد الصلبة (A)، والسوائل والغازات (B) كذلك في إطفاء الحرائق التي تنشأ في الأجهزة والمعدات الكهربائية (C) وعادة ما يكون موضحاً على الطفاية أنواع الحرائق التي تصلح لإطفائها.</p>
     <p>لا يفضل استخدام طفايات البودرة في إطفاء الحرائق التي تنشأ في الأجهزة الكهربائية الحساسة مثل أجهزة الكمبيوتر حيث أن جزيئات البودرة قد تتسبب في تلف هذه الأجهزة.</p>
     <p>تطفئ طفايات البودرة الحرائق بأن تقوم بإحاطة الوقود المشتعل بطبقة من البودرة تفصل الوقود عن الأكسجين في الهواء، كذلك تتداخل مع التفاعل الكيميائي المتسلسل وتقوم بامتصاص الشقوق الطليقة <span class="ltr">Free Radicals</span> على السطح وبالتالي توقف هذا التفاعل المتسلسل وتطفئ الحريق. لذلك تعتبر مادة البودرة من أسرع مواد الإطفاء.</p>
     <p>يوجد نوعان من طفايات البودرة، هما طفايات البودرة المضغوطة بواسطة الهواء وطفايات البودرة المضغوطة بواسطة اسطوانة لغاز ثاني أكسيد الكربون، وسوف نتطرق في هذه المحاضرة للنوع المضغوط بواسطة الهواء حيث إنه الأكثر انتشاراً.</p>`,ref:'ص 129–130'},
    {tip:`<p>البودرة تهاجم عنصرين من هرم الاشتعال معاً: <b>الأكسجين</b> (بالطبقة العازلة) و<b>التفاعل المتسلسل</b> (بامتصاص الشقوق الطليقة)؛ لذلك هي «من أسرع مواد الإطفاء».</p>`,title:'لماذا هي سريعة؟'},
    {title:'مختبر مصغّر: هل تستعمل البودرة؟',widget:(el,B)=>DCML.cases(el,B,{cases:[
     {q:'حريق في غرفة خوادم وحاسبات.',opts:[['البودرة أفضل اختيار',false,'«لا يفضل… مثل أجهزة الكمبيوتر» (ص 129).'],['يُفضّل غيرها لأن جزيئاتها قد تتلف الأجهزة',true,'(ص 129). ثاني أكسيد الكربون غاز لا يترك أثراً (ص 128).']]},
     {q:'حريق بنزين منسكب في موقف.',opts:[['البودرة تصلح',true,'البودرة من مواد إطفاء النوع B (ص 127، 129).'],['البودرة لا تصلح إلا للخشب',false,'تصلح حسب نوعها لـ A وB وC.']]}]})}
   ]},

  {st:3,short:'البودرة المضغوطة بالهواء',title:'طفايات البودرة المضغوطة بالهواء',ref:'ص 130',
   q:'كيف تعرف قبل الحريق أن الطفاية جاهزة؟',
   art:SFA.art('طفاية بودرة: ساعة الضغط على الأخضر، ومسمار الأمان، ويد التشغيل، ومدى الرش',
    `<g transform="translate(100 176) scale(1.9)">${extSVG('pow',0,0,1)}</g>`+`<circle cx="100" cy="126" r="16" fill="#fff" stroke="var(--fg)" stroke-width="2"/><path d="M88 120A14 14 0 0 1 112 120" fill="none" stroke="var(--on)" stroke-width="5"/><path d="M100 126L106 116" stroke="var(--fg)" stroke-width="2"/>`+
    SFA.arr(170,150,320,150,'var(--blue)',2.6)+SFA.ar(250,140,'6 أمتار أو أكثر',{fs:14,c:'var(--blue-ink)'})+
    SFA.ar(180,58,'جاهزة: المؤشر على الأخضر',{fs:15,w:700})+SFA.ar(100,290,'طفاية البودرة',{fs:14})+
    SFA.hot(80,106,40,40,'ساعة الضغط: تُضغط الطفاية بالهواء «حتى يشير المؤشر… إلى اللون الأخضر».')+SFA.hot(84,66,70,30,'مسمار الأمان ويد التشغيل: يُنزع المسمار ويُضغط على اليد.')+SFA.hot(176,124,150,40,'المدى: يدفع الهواء البودرة «إلى مسافة قد تصل إلى ستة (6) أمتار أو أكثر».')),
   cap:'رسم توضيحي (الألوان والرموز للتوضيح).<br><b>مرّر المؤشر على الساعة والمسمار والسهم (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'ما الذي يدل على أن طفاية البودرة المضغوطة بالهواء جاهزة؟',opts:[
     ['وزنها خفيف',false,'لا يذكره الكتاب.'],
     ['مسمار الأمان منزوع',false,'المسمار يُنزع عند الاستعمال فقط.'],
     ['مؤشر ساعة الضغط على اللون الأخضر',true,'(ص 130).']]}}
   ],
   body:[
    {book:`<p>تملأ الطفاية بمادة البودرة (الشكل 6-15) وعادة ما تكون: بيكربونات الصوديوم أو بيكربونات البوتاسيوم أو النوع ABC أو بودرة المونيكس وذلك حسب سعة الطفاية ثم بعد ذلك يتم ضغط الطفاية بواسطة الهواء المضغوط حتى يشير المؤشر في ساعة الضغط الموجودة عليها إلى اللون الأخضر.</p>
     <p>عند استخدام الطفاية، يتم نزع مسمار الأمان والضغط على يد التشغيل التي بدورها تسمح للهواء المضغوط داخل الطفاية بالخروج بقوة دافعاً مادة البودرة إلى خارج الطفاية إلى مسافة قد تصل إلى ستة (6) أمتار أو أكثر.</p>`,ref:'ص 130'},
    {html:SFA.fig(fig615(),'الشكل <span class="ltr">(6-15)</span> ص 130 — طفاية البودرة الجافة <span class="ltr">ABC</span>: لها ساعة ضغط، وقد يكون لها خرطوم، وفي داخلها مسحوق ناعم.',360)},
    {watch:`<p>رقّم الكتاب «2- طفايات البودرة المضغوطة بالهواء» كأنها نوع مستقل، وهي فرع من طفايات البودرة (البند 1)؛ لذلك لم نضع لها رقماً.</p>`},
    {title:'مختبر مصغّر: رتّب خطوات الاستعمال',widget:(el,B)=>DCML.order(el,B,{steps:[
 ['تأكد أن مؤشر ساعة الضغط على اللون الأخضر',''],['انزع مسمار الأمان','المسمار يمنع الضغط على اليد، فلا يمكن التشغيل قبل نزعه.'],['اضغط على يد التشغيل','اليد لا تعمل والمسمار في مكانه.'],['يخرج الهواء المضغوط دافعاً البودرة إلى مسافة قد تصل إلى 6 أمتار','هذا نتيجة الضغط على اليد.']],done:'هذا ما يصفه الكتاب (ص 130)، وسترى الخطوات نفسها في طريقة PASS.'})}
   ]},

  {st:4,short:'3- ثاني أكسيد الكربون',title:'3- طفايات غاز ثاني أكسيد الكربون',ref:'ص 131',
   q:'طفاية بلا ساعة ضغط… كيف تختلف عن طفاية البودرة؟',
   art:SFA.art('طفاية ثاني أكسيد الكربون: بلا ساعة ضغط، ولها بوق صلب',
    `<g transform="translate(130 200) scale(1.55)">${extSVG('co2',0,0,1)}</g>`+[[260,226],[270,240],[256,250]].map(([x,y])=>`<path d="M${x-30} ${y-20}L${x} ${y}" stroke="var(--muted)" stroke-width="2"/>`).join('')+
    SFA.ar(180,58,'تُعبأ تحت ضغط قد يصل إلى',{fs:14.5,w:700})+SFA.ar(180,80,'800 رطل على البوصة المربعة',{fs:14.5,w:700,c:'var(--stop)'})+SFA.ar(110,290,'لا ساعة ضغط',{fs:14})+SFA.ar(262,290,'بوق صلب',{fs:14})+
    SFA.hot(100,84,60,40,'لا يوجد عليها مقياس ضغط ⟦No Gauge⟧ كما في الشكل.')+SFA.hot(200,150,110,110,'البوق الصلب ⟦Hard Horn⟧: يُوجّه إلى الحريق فيخرج منه الغاز مضغوطاً.')+SFA.hot(96,120,70,140,'جسم الطفاية: غاز ثاني أكسيد الكربون مضغوط.')),
   cap:'فكرة الشكل <span class="ltr">(6-16)</span>.<br><b>مرّر المؤشر على الرأس والبوق والجسم (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'تحت أي ضغط قد تُعبأ طفاية ثاني أكسيد الكربون حسب الكتاب؟',opts:[
     ['حتى 800 رطل على البوصة المربعة',true,'(ص 131).'],
     ['حتى يصل المؤشر إلى الأخضر',false,'هذا في البودرة والهالون؛ طفاية CO₂ في الشكل بلا ساعة ضغط.'],
     ['ضغط الجو العادي',false,'الغاز مضغوط.']]}}
   ],
   body:[
    {book:`<p>يتم تعبئة الطفاية بواسطة غاز ثاني أكسيد الكربون تحت ضغط قد يصل إلى ${lt('800')} رطل على البوصة المربعة، وعند الاستعمال يتم سحب مسمار الأمان والضغط على يد التشغيل (أو فتح المحبس للنوع المزود بمحبس علوي) فيخرج الغاز مضغوطاً إلى خارج الطفاية كما هو مبين في الشكل 6-16.</p>`,ref:'ص 131'},
    {html:SFA.fig(fig616(),'الشكل <span class="ltr">(6-16)</span> ص 131 — طفاية ثاني أكسيد الكربون <span class="ltr">(No Gauge, Hard Horn)</span>.',360)},
    {title:'مختبر مصغّر: بودرة أم ثاني أكسيد الكربون؟',widget:(el,B)=>DCML.sort(el,B,{cats:['البودرة المضغوطة بالهواء','ثاني أكسيد الكربون'],items:[
 ['لها ساعة ضغط مؤشرها على الأخضر.',0,'(ص 130) والشكل (6-15).'],
 ['بلا ساعة ضغط، ولها بوق صلب.',1,'الشكل (6-16).'],
 ['تعزل الوقود بطبقة وتمتص الشقوق الطليقة.',0,'(ص 129).'],
 ['غاز يحل محل الأكسجين.',1,'«غاز ثاني أكسيد الكربون الذي يحل محل الأكسجين» (ص 132).']]})}
   ]},

  {st:5,short:'4- الهالون',title:'4- طفايات الهالون',ref:'ص 131',
   q:'مادة إطفاء ممتازة… فلماذا توقف استخدامها؟',
   art:SFA.art('طفاية هالون تطفئ الحريق، لكنها تضر بطبقة الأوزون',
    `<path d="M30 92Q180 40 330 92" fill="none" stroke="var(--blue)" stroke-width="10" opacity=".55"/><path d="M150 72l10 10M170 66l-6 14" stroke="var(--stop)" stroke-width="3"/>`+
    `<circle cx="300" cy="54" r="16" fill="var(--live)"/>`+SFA.arr(292,74,262,112,'var(--live)',2)+
    `<g transform="translate(110 200) scale(1.5)">${extSVG('h',0,0,1)}</g>`+flame(270,276,.7)+SFA.arr(170,190,236,236,'var(--blue)',2.4)+
    SFA.ar(180,130,'طبقة الأوزون',{fs:14,c:'var(--blue-ink)'})+SFA.ar(110,300,'الهالون BCF',{fs:14})+
    SFA.hot(30,40,300,60,'طبقة الأوزون «التي تحمينا من خطر الأشعة فوق البنفسجية من الشمس». الهالون يضرها (الشق الأحمر)، لذلك «تم إيقاف استخدامها».')+SFA.hot(80,130,70,150,'طفاية الهالون: تُضغط بالنيتروجين حتى يشير المؤشر إلى الأخضر، ومداها قد يصل إلى 6 أمتار أو أكثر.')+SFA.hot(236,220,70,70,'الهالون «يتفاعل مع الشقوق الطليقة» فيطفئ الحريق في الحال.')),
   cap:'لماذا أوقف الهالون.<br><b>مرّر المؤشر على الأوزون والطفاية واللهب (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'لماذا أوقف استخدام الهالون؟',opts:[
     ['لأنه بطيء الإطفاء',false,'بالعكس: «يطفئه في الحال».'],
     ['لأنه يوصل الكهرباء',false,'لا يذكر الكتاب ذلك؛ وهو من مواد إطفاء النوع C.'],
     ['لتأثيره الضار على طبقة الأوزون',true,'(ص 131).']]}}
   ],
   body:[
    {book:`<p>تملأ الطفاية بمادة الهالون <span class="ltr">(BCF)</span> وهي مادة متبخرة لها قدرة كبيرة على إطفاء الحرائق ويتم ضغطها بواسطة مادة النيتروجين حتى يشير المؤشر في ساعة الضغط المثبتة على الطفاية إلى اللون الأخضر، وعند الاستعمال يتم سحب مسمار الأمان والضغط على يد التشغيل فيقوم غاز النيتروجين بدفع مادة الهالون إلى خارج الطفاية إلى مسافة قد تصل إلى ${lt('6')} أمتار أو أكثر، ويقوم الهالون بالتفاعل مع الشقوق الطليقة المكونة للتفاعل الكيميائي المتسلسل للحريق ويطفئه في الحال.</p>
     <p>نظراً لأن مادة الهالون من المواد التي لها تأثير ضار على طبقة الأوزون التي تحمينا من خطر الأشعة فوق البنفسجية من الشمس لذلك تم إيقاف استخدامها وحالياً يتم استخدام مواد بديلة غير ضارة بالأوزون.</p>`,ref:'ص 131'},
    {tip:`<div class="tablebox"><table class="tt"><thead><tr><th>الطفاية</th><th>كيف تطفئ</th><th>تناسب</th><th>لا تُستخدم على</th></tr></thead><tbody>
     <tr><td>الماء*</td><td>التبريد</td><td><span class="ltr">A</span></td><td>الكهرباء، والسوائل، والمعادن، والزيوت</td></tr>
     <tr><td>الرغوة*</td><td>الخنق والتبريد</td><td><span class="ltr">B</span> و<span class="ltr">A</span></td><td>الكهرباء (تحتوي ماءً)</td></tr>
     <tr><td>البودرة <span class="ltr">ABC</span></td><td>العزل وإيقاف التفاعل المتسلسل</td><td><span class="ltr">A</span> و<span class="ltr">B</span> و<span class="ltr">C</span></td><td>لا يفضل على الأجهزة الحساسة</td></tr>
     <tr><td>ثاني أكسيد الكربون</td><td>يحل محل الأكسجين (الخنق)</td><td><span class="ltr">B</span> و<span class="ltr">C</span></td><td>—</td></tr>
     <tr><td>الهالون</td><td>إيقاف التفاعل المتسلسل</td><td><span class="ltr">B</span> و<span class="ltr">C</span></td><td>أوقف استخدامه (الأوزون)</td></tr>
     <tr><td>طفاية المطابخ*</td><td>طبقة عازلة على الزيت وتبريده</td><td><span class="ltr">K</span></td><td>—</td></tr></tbody></table></div><p>تجميع منّا من ص 127–133. ما عليه * إضافة من خارج الكتاب.</p>`,title:'جدول تجميعي للطفايات'},
    {title:'تحقق سريع: صح أم خطأ؟',widget:(el,B)=>DCML.tf(el,B,{items:[
 ['الهالون يطفئ بالتفاعل مع الشقوق الطليقة.',true,'(ص 131).'],
 ['طفايات الهالون تُضغط بالهواء العادي.',false,'«يتم ضغطها بواسطة مادة النيتروجين» (ص 131).']]})}
   ]},

  {st:6,short:'إطفاء الحرائق',title:'6-3-4 إطفاء الحرائق',ref:'ص 131–133',
   q:'الحريق يحتاج أربعة عناصر… فكم عنصراً يكفي أن تزيله لتطفئه؟',
   art:SFA.art('هرم الاشتعال وطرق الإطفاء الأربع: كل طريقة تزيل عنصراً',
    SFA.emb(tetraSVG({fuel:0,ox:1,heat:1,chain:1},0),[20,10,350,260],[30,60,300,236])+
    SFA.ar(180,46,'أزل عنصراً واحداً فينطفئ',{fs:15,w:700})+SFA.ar(180,300,'هنا أُزيل الوقود: التجويع',{fs:14,c:'var(--stop)'})+
    SFA.hot(110,230,140,40,'الوقود أُزيل (الوجه المتقطع) — تجويع الحريق، فلا لهب.')+SFA.hot(64,120,80,90,'الأكسجين: يُزال بالخنق.')+SFA.hot(214,120,80,90,'الحرارة: تُزال بالتبريد.')+SFA.hot(220,54,100,40,'التفاعل المتسلسل: يوقفه البودرة والهالون.')),
   cap:'فكرة الأشكال <span class="ltr">(6-17)</span> إلى <span class="ltr">(6-20)</span>.<br><b>مرّر المؤشر على كل وجه (أو المسه في الجوال) لتعرف طريقة إزالته.</b>',
   side:[
    {predict:{q:'ما طريقة الإطفاء الأكثر شيوعاً حسب الكتاب؟',opts:[
     ['التجويع',false,'التجويع بنقل المواد أو سحب السوائل.'],
     ['التبريد باستخدام المياه',true,'«وتعتبر هذه الطريقة الأكثر شيوعاً في إطفاء الحرائق» (ص 133).'],
     ['إيقاف التفاعل المتسلسل',false,'بالبودرة والهالون فقط.']]}}
   ],
   body:[
    {book:`<p>لإطفاء أي نوع من أنواع الحرائق يجب إزالة عامل من العوامل الأربعة التي تسبب الحريق وهي: الوقود، الأكسجين، الحرارة، التفاعل الكيميائي المتسلسل والتي تكون الهرم الرباعي للحريق ويتم ذلك باتباع إحدى الطرق الأربعة الآتية:</p>
     <ol><li><b>تجويع الحريق:</b> تجويع الحريق بحرمانه من المواد القابلة للاشتعال (الشكل 6-17) التي تعتبر وقوداً مغذياً للحريق وذلك بنقل البضائع والمواد المتوفرة بمكان الحريق بعيداً عن تأثير الحرارة واللهب. كما يمكن سحب السوائل القابلة للاشتعال من الصهاريج الموجود بها الحريق.</li>
     <li><b>خنق الحريق:</b> خنق الحريق لكتم النيران ومنع وصول الأكسجين لها (الشكل 6-18)، ويتم ذلك إما بتغطية الحريق بالرغاوى أو استعمال غاز ثاني أكسيد الكربون الذي يحل محل الأكسجين كذلك باستخدام الهالون أو البودرة.</li>
     <li><b>تبريد الحريق:</b> تبريد الحريق لتخفيض درجة الحرارة (الشكل 6-19) وتعتبر هذه الطريقة الأكثر شيوعاً في إطفاء الحرائق وذلك باستخدام المياه وتعتمد هذه الطريقة أساساً على قدرة امتصاص الماء لحرارة المواد المشتعلة.</li>
     <li><b>إيقاف التفاعل المتسلسل للحريق:</b> لبعض مواد الإطفاء المقدرة على إيقاف التفاعل المتسلسل للحريق، وهذه المواد هي البودرة والهالون (الشكل 6-20).</li></ol>`,ref:'ص 131–133'},
    {html:`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:8px">${[['fuel','STARVATION','(6-17) تجويع الحريق'],['ox','SMOTHERING','(6-18) خنق الحريق'],['heat','COOLING','(6-19) تبريد الحريق']].map(([m,w,c])=>SFA.fig(methodSVG(m,w),'الشكل '+c.replace(/^(\(\d+-\d+\))/,'<span class="ltr">$1</span>'),260)).join('')}</div>`+SFA.fig(fig620(),'الشكل <span class="ltr">(6-20)</span> ص 133 — حبيبات البودرة تمتص الشقوق الطليقة للتفاعل المتسلسل للحريق وتوقفه.',340)},
    {title:'مختبر مصغّر: اختر طريقة الإطفاء',widget:(el,B)=>DCML.lab(el,B,{intro:'اختر الطريقة وانظر أي وجه من هرم الاشتعال يختفي.',
     ins:[{k:'m',l:'الطريقة',seg:[['none','لا شيء'],['fuel','التجويع'],['ox','الخنق'],['heat','التبريد'],['chain','إيقاف التفاعل']],v:'none'}],
     calc:(s)=>{const on={fuel:1,ox:1,heat:1,chain:1};if(s.m!=='none')on[s.m]=0;
      const T={none:'العناصر الأربعة موجودة: الحريق مستمر.',fuel:'<b>التجويع:</b> نقل البضائع والمواد بعيداً، أو سحب السوائل من الصهاريج — الشكل (6-17).',ox:'<b>الخنق:</b> بالرغاوى، أو ثاني أكسيد الكربون الذي يحل محل الأكسجين، أو الهالون أو البودرة — الشكل (6-18).',heat:'<b>التبريد:</b> بالمياه، وهي الطريقة الأكثر شيوعاً؛ الماء يمتص حرارة المواد المشتعلة — الشكل (6-19).',chain:'<b>إيقاف التفاعل المتسلسل:</b> بالبودرة والهالون — الشكل (6-20).'};
      return {pic:tetraSVG(on,s.m==='none'?1:0),msg:T[s.m]}}})},
    {title:'مختبر مصغّر: أي طريقة هذه؟',widget:(el,B)=>DCML.sort(el,B,{cats:['التجويع','الخنق','التبريد','إيقاف التفاعل'],items:[
 ['إغلاق صمام خط الغاز المغذي للحريق.',0,'حرمان الحريق من المادة القابلة للاشتعال (ص 132).'],
 ['تغطية مقلاة مشتعلة بغطائها.',1,'منع وصول الأكسجين (ص 132).'],
 ['رش الخشب المشتعل بالماء.',2,'الماء يمتص الحرارة (ص 133).'],
 ['رش البودرة على الحريق.',3,'البودرة توقف التفاعل المتسلسل (ص 133)، وتخنقه أيضاً.']]})}
   ]},

  {st:7,short:'قواعد عامة',title:'6-3-5 قواعد عامة لإطفاء الحرائق',ref:'ص 133',
   q:'الريح تهب نحوك والحريق أمامك… من أين تقترب؟',
   art:SFA.art('منظر من أعلى: الريح من خلف الشخص، والمسافة 3 – 5 أمتار، والطفاية تتحرك يميناً ويساراً نحو قاعدة الحريق',
    SFA.arr(330,70,250,70,'var(--blue)',3)+SFA.ar(300,58,'اتجاه الريح',{fs:13.5,c:'var(--blue-ink)'})+
    `<circle cx="290" cy="170" r="16" fill="var(--blue-soft)" stroke="var(--fg)" stroke-width="2"/><path d="M276 170H236" stroke="var(--fg)" stroke-width="4"/>`+
    `<path d="M236 170L120 130M236 170L120 210" stroke="var(--blue)" stroke-width="2" stroke-dasharray="6 5"/><path d="M128 134Q104 170 128 206" fill="none" stroke="var(--blue)" stroke-width="3"/>`+SFA.arr(122,150,126,138,'var(--blue)',2)+SFA.arr(122,190,126,202,'var(--blue)',2)+
    flame(84,196,.9)+`<path d="M236 252H120" stroke="var(--fg)" stroke-width="1.6"/><path d="M236 246V258M120 246V258" stroke="var(--fg)" stroke-width="1.6"/>`+SFA.ar(178,276,'3 – 5 أمتار',{fs:14,w:700})+
    SFA.hot(240,52,100,36,'«يجب أن تكافح الحريق مع اتجاه الريح وليس عكسها»: الريح من خلفك تبعد عنك الحرارة والدخان.')+SFA.hot(118,240,122,46,'«ابتعد عن الحريق بحوالي 3 – 5 أمتار وابدأ بالمكافحة».')+SFA.hot(100,126,140,90,'حرّك الطفاية لليمين واليسار، وابدأ من الأمام للخلف، ومن أسفل إلى أعلى (قاعدة الحريق).')+SFA.hot(270,150,40,40,'أنت (من أعلى).')),
   cap:'رسم توضيحي للقواعد من أعلى.<br><b>مرّر المؤشر على الريح والمسافة والرش والشخص (أو المسها في الجوال) لتقرأ القاعدة.</b>',
   side:[
    {predict:{q:'من أين تكافح الحريق؟',opts:[
     ['من منتصفه',false,'«لا تكافح الحريق من منتصفه».'],
     ['من الأمام للخلف',true,'(القاعدة 3، ص 133).'],
     ['من الخلف للأمام',false,'تبدأ بالجزء الأقرب إليك ثم تتقدم.']]}}
   ],
   body:[
    {book:`<ol><li>يجب أن تكافح الحريق مع اتجاه الريح وليس عكسها.</li><li>ابتعد عن الحريق بحوالي ${lt('3 – 5')} أمتار وابدأ بالمكافحة.</li><li>لا تكافح الحريق من منتصفه بل من الأمام للخلف.</li><li>حرك الطفاية لليمين واليسار أثناء المكافحة.</li><li>كافح الحريق دائماً من أسفل إلى أعلى.</li><li>لا تترك مكان الحريق قبل التأكد من إطفائه تماماً.</li></ol>`,ref:'ص 133'},
    {tip:`<p>القاعدة 5 «من أسفل إلى أعلى» معناها: ابدأ بقاعدة الحريق حيث الوقود يحترق، لا بأعلى اللهب — وهي الخطوة <span class="ltr">A</span> في <span class="ltr">PASS</span>. (وفي الكتاب «ابعد» والصواب «ابتعد».)</p>`,title:'من أسفل إلى أعلى'},
    {title:'مختبر مصغّر: طبّق القواعد',widget:(el,B)=>DCML.cases(el,B,{cases:[
     {q:'الريح تهب من الشرق إلى الغرب، والحريق في الغرب. أين تقف؟',opts:[['في الشرق: الريح من خلفك نحو الحريق',true,'«مع اتجاه الريح وليس عكسها».'],['في الغرب خلف الحريق: الريح في وجهك',false,'الريح ستدفع الحرارة والدخان واللهب نحوك.']]},
     {q:'انطفأ اللهب الظاهر. ماذا تفعل؟',opts:[['تغادر فوراً',false,'«لا تترك مكان الحريق قبل التأكد من إطفائه تماماً».'],['تبقى حتى تتأكد من إطفائه تماماً',true,'الجمر قد يعيد الاشتعال (القاعدة 6).']]}]})}
   ]},

  {st:8,short:'طريقة PASS',title:'طريقة استعمال طفايات الحريق — <span class="ltr">PASS</span>',ref:'ص 134',
   q:'أربعة حروف تحفظ بها خطوات الطفاية… ما الحرف الأول؟',
   art:SFA.art('خطوات PASS الأربع',
    [['P','اسحب المسمار',264,110],['A','وجّه إلى القاعدة',96,110],['S','اضغط المفتاح',264,226],['S','حرّك جانبياً',96,226]].map(([L,t,x,y],i)=>`<rect x="${x-70}" y="${y-50}" width="140" height="92" rx="14" fill="var(--surface)" stroke="var(--stop)" stroke-width="2"/>`+SFA.la(x,y-6,L,{fs:30,w:800,c:'var(--stop)'})+SFA.ar(x,y+28,t,{fs:13.5})+`<circle cx="${x+54}" cy="${y-34}" r="11" fill="var(--stop)"/>`+SFA.la(x+54,y-30,String(i+1),{fs:12,c:'#fff'})).join('')+
    SFA.hot(194,60,140,92,'P — PULL the pin: اسحب مسمار الأمان؛ «this unlocks the lever».')+SFA.hot(26,60,140,92,'A — AIM low: وجّه الخرطوم إلى قاعدة الحريق.')+SFA.hot(194,176,140,92,'S — SQUEEZE the lever: اضغط على المفتاح فتخرج مادة الإطفاء.')+SFA.hot(26,176,140,92,'S — SWEEP from side to side: حرّك الطفاية من جانب لآخر وأنت تتقدم بحذر نحو الحريق.')),
   cap:'اقرأ البطاقات بالأرقام.<br><b>مرّر المؤشر على كل بطاقة (أو المسها في الجوال) لتقرأ نص الكتاب الإنجليزي.</b>',
   side:[
    {predict:{q:'ما الحرف A في PASS؟',opts:[
     ['اسحب المسمار',false,'هذا P.'],
     ['اضغط على المفتاح',false,'هذا S الأول.'],
     ['وجّه الخرطوم إلى قاعدة الحريق',true,'AIM low (ص 134).']]}}
   ],
   body:[
    {book:`<p>يتم استخدام الأحرف الأولى من الكلمة الإنجليزية <span class="ltr">PASS</span> للتعبير عن خطوات استعمال طفايات الحريق كما هو مبين من خلال الجدول التالي:</p>
     <div class="tablebox"><table class="tt"><thead><tr><th>الحرف</th><th>الخطوة</th></tr></thead><tbody>
     <tr><td><b class="ltr">P</b></td><td><span class="ltr">PULL the pin, this unlocks the lever and allows you to discharge the extinguisher</span><br><b>اسحب مسمار الأمان</b></td></tr>
     <tr><td><b class="ltr">A</b></td><td><span class="ltr">AIM low: point the extinguisher nozzle (or hose) at the base of the fire</span><br><b>وجه الخرطوم إلى قاعدة الحريق</b></td></tr>
     <tr><td><b class="ltr">S</b></td><td><span class="ltr">SQUEEZE the lever above the handle: this discharges the extinguishing agent</span><br><b>اضغط على المفتاح</b></td></tr>
     <tr><td><b class="ltr">S</b></td><td><span class="ltr">SWEEP from side to side moving carefully toward the fire</span><br><b>حرك الطفاية من جانب لآخر</b></td></tr></tbody></table></div>`,ref:'ص 134'},
    {title:'مختبر مصغّر: رتّب خطوات PASS',widget:(el,B)=>DCML.order(el,B,{steps:[
 ['P — اسحب مسمار الأمان',''],['A — وجّه الخرطوم إلى قاعدة الحريق','لا يمكن التشغيل والمسمار في مكانه؛ اسحبه أولاً.'],['S — اضغط على المفتاح','وجّه أولاً حتى لا تضيع مادة الإطفاء في الهواء.'],['S — حرّك الطفاية من جانب لآخر وأنت تتقدم','تحرّك بعد أن تبدأ مادة الإطفاء بالخروج.']],done:'PULL ثم AIM ثم SQUEEZE ثم SWEEP (ص 134).'})}
   ]},

  {st:9,short:'أسئلة الوحدة',title:'أسئلة عامة على الوحدة السادسة',ref:'ص 135',
   q:'هل تستطيع أن تجيب عن أسئلة الكتاب دون أن ترجع إلى المحطات؟',
   art:SFA.art('ورقة أسئلة الوحدة السادسة',
    `<rect x="110" y="62" width="140" height="200" rx="10" fill="var(--surface)" stroke="var(--fg)" stroke-width="2.4"/><rect x="150" y="52" width="60" height="22" rx="6" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2"/>`+
    [96,124,152,180,208,236].map(y=>`<circle cx="232" cy="${y}" r="5" fill="var(--stop)"/><path d="M128 ${y}H218" stroke="var(--muted)" stroke-width="3" stroke-linecap="round"/>`).join('')+SFA.ar(180,292,'عشرة أسئلة مقالية',{fs:15,w:700})),
   cap:'أسئلة الكتاب كلها عن الجزء الأول (الإنذار والكواشف).',
   side:[
    {predict:{q:'السؤال 5: عدِّد أنواع أجهزة الكشف الآلي ذات الرؤوس الكاشفة. أي إجابة صحيحة؟',opts:[
     ['اليدوي والكهربائي',false,'هذان نوعا الإنذار اليدوي.'],
     ['كاشفات اللهب، والكاشفات الحرارية، والكاشفات الدخانية',true,'(ص 116–122).'],
     ['البودرة وثاني أكسيد الكربون والهالون',false,'هذه طفايات.']]}}
   ],
   body:[
    {html:`<p>اضغط على السؤال لترى إجابة مقترحة.</p><div class="s6q">${QS.map(([q,a])=>`<details><summary>${q}</summary><div class="ans"><b>إجابة مقترحة (ليست من الكتاب):</b> ${a}</div></details>`).join('')}</div>`},
    {watch:`<p>أسئلة الوحدة في الكتاب كلها عن الجزء الأول (الإنذار والكواشف)، ولا سؤال فيها عن هرم الاشتعال وأنواع الحرائق والطفايات و<span class="ltr">PASS</span> — راجع هذه في «اختبر نفسك» في الدرسين الثالث والرابع. والسؤال 8 يكاد يكرر السؤال 6، والسؤال 2 عن «أنظمة إطفاء الحريق» ولا تشرح الوحدة أنظمة إطفاء ثابتة.</p>`}
   ]},

  {recap:[
   'يعدد الكتاب ستة أنواع للطفايات ويشرح ثلاثة: البودرة، وثاني أكسيد الكربون، والهالون (ص 129–131).',
   'البودرة تعزل الوقود وتمتص الشقوق الطليقة، ولا تفضل على الأجهزة الحساسة؛ وتكون جاهزة والمؤشر على الأخضر (ص 129–130).',
   'ثاني أكسيد الكربون بلا ساعة ضغط وببوق صلب — الشكل (6-16)؛ والهالون أوقف لضرره بالأوزون (ص 131).',
   'الإطفاء بإزالة عنصر واحد: التجويع، والخنق، والتبريد (الأكثر شيوعاً)، وإيقاف التفاعل المتسلسل (ص 131–133).',
   'كافح مع الريح، على بعد 3 – 5 أمتار، من الأمام للخلف ومن أسفل، واستعمل PASS: اسحب، وجّه، اضغط، حرّك (ص 133–134).']}
],
 theory:[
  {h:'6-3-3 أنواع طفايات الحريق',ref:'ص 129',html:`<p>يوجد ستة أنواع لطفايات الحريق:</p><ol><li>طفايات الماء</li><li>طفايات الرغاوى</li><li>طفايات البودرة الجافة</li><li>طفايات ثاني أكسيد الكربون</li><li>طفايات الهالون</li><li>طفايات البودرة السائلة (للمطابخ)</li></ol>
   <p>ويكتفي الكتاب بإلقاء الضوء على البودرة وثاني أكسيد الكربون والهالون، «نظرًا لعدم انتشار النوعين الأولين (الماء والرغاوى)».</p>`},
  {err:'<span class="fixnote">يعدد الكتاب (ص 129) ستة أنواع ويشرح ثلاثة فقط، فلا يشرح الماء ولا الرغوة ولا طفاية المطابخ (K)، ولا يذكر مادة إطفاء لحرائق النوع K. وقوله «عدم انتشار» الماء والرغاوى غير دقيق: الماء أكثر وسائل الإطفاء شيوعًا كما يقول الكتاب نفسه في طريقة التبريد (ص 133). أضفنا شرحًا قصيرًا للأنواع الثلاثة الناقصة أدناه.</span>'},
  {html:`<div class="callout">${ADDT}<b>طفاية الماء:</b> أسطوانة فيها ماء يُدفع بغاز مضغوط. <b>تطفئ بالتبريد</b> (تمتص الحرارة)، وتناسب حرائق <b>النوع A</b> (الخشب والورق والقماش). <b>لا تُستخدم</b> على الكهرباء الموصولة (خطر الصعق)، ولا على البنزين والزيوت (تنشر الحريق)، ولا على المعادن المشتعلة (تتفاعل معها بعنف).</div>
   <div class="callout">${ADDT}<b>طفاية الرغوة:</b> ماء مخلوط بمادة رغوية تخرج رغوة تطفو على السطح. <b>تطفئ بالخنق والتبريد</b>: تغطي سطح السائل المشتعل فتعزله عن الأكسجين وتمنع خروج الأبخرة. تناسب حرائق <b>النوع B</b> (السوائل الملتهبة) و<b>النوع A</b>. <b>لا تُستخدم</b> على الكهرباء الموصولة لأنها تحتوي ماءً (ص 128).</div>
   <div class="callout">${ADDT}<b>طفاية المطابخ (النوع K)</b> — يسميها الكتاب «البودرة السائلة (للمطابخ)»، وتعرف بالمادة الكيميائية الرطبة (Wet Chemical): ترش رذاذًا من محلول يتفاعل مع سطح الزيت الساخن فيكوّن <b>طبقة عازلة تشبه الصابون</b> تخنق الحريق، ويبرّد الزيت فلا يعود الاشتعال. تُستخدم لحرائق زيوت الطبخ ودهونه. <b>لا تُستخدم أبدًا طفاية الماء على زيت مشتعل</b>: يغلي الماء فجأة تحت الزيت فيقذفه مشتعلاً.</div>`},
  {h:'1- طفايات البودرة',ref:'ص 129–130',html:`<p>تستعمل حسب نوع البودرة داخلها في إطفاء حرائق المواد الصلبة <b>(A)</b>، والسوائل والغازات <b>(B)</b>، والأجهزة والمعدات الكهربائية <b>(C)</b>، وعادة يكون موضحًا على الطفاية أنواع الحرائق التي تصلح لإطفائها.</p>
   <p><b>لا يفضل</b> استخدامها في الأجهزة الكهربائية الحساسة مثل <b>أجهزة الحاسب</b>، لأن جزيئات البودرة قد تتلف هذه الأجهزة.</p>
   <p>تطفئ البودرة الحريق بأن <b>تحيط الوقود المشتعل بطبقة تفصله عن الأكسجين</b>، وكذلك <b>تتداخل مع التفاعل الكيميائي المتسلسل</b> وتمتص الشقوق الطليقة على السطح فتوقفه. لذلك تعتبر البودرة <b>من أسرع مواد الإطفاء</b>. ويوجد نوعان: المضغوطة بالهواء، والمضغوطة بأسطوانة غاز ثاني أكسيد الكربون، ويتناول الكتاب المضغوطة بالهواء لأنها الأكثر انتشارًا.</p>`},
  {h:'طفايات البودرة المضغوطة بالهواء',ref:'ص 130',html:`<p>تُملأ الطفاية بمادة البودرة (الشكل 6-15)، وعادة تكون بيكربونات الصوديوم أو بيكربونات البوتاسيوم أو النوع ABC أو بودرة المونيكس حسب سعة الطفاية، ثم تُضغط بالهواء المضغوط <b>حتى يشير مؤشر ساعة الضغط إلى اللون الأخضر</b>. وعند الاستخدام يُنزع <b>مسمار الأمان</b> ويُضغط على <b>يد التشغيل</b>، فيخرج الهواء المضغوط بقوة دافعًا البودرة إلى مسافة قد تصل إلى <b>${lt('6 m')} أو أكثر</b>.</p>`},
  {note:'رقّم الكتاب «2- طفايات البودرة المضغوطة بالهواء» كأنها نوع مستقل، وهي فرع من طفايات البودرة (البند 1)؛ لذلك جعلناها تحته.'},
  {fig:'(6-15)',ref:'ص 130',caption:'طفاية البودرة الجافة ABC: لها ساعة ضغط، وقد يكون لها خرطوم، وفي داخلها مسحوق ناعم.',draw:()=>box(fig615(),360)},
  {h:'3- طفايات غاز ثاني أكسيد الكربون',ref:'ص 131',html:`<p>تُعبأ الطفاية بغاز ثاني أكسيد الكربون تحت ضغط قد يصل إلى <b>${lt('800')} رطل على البوصة المربعة</b>. وعند الاستعمال يُسحب مسمار الأمان ويُضغط على يد التشغيل (أو يُفتح المحبس للنوع المزود بمحبس علوي) فيخرج الغاز مضغوطًا (الشكل 6-16). في الشكل: لا يوجد عليها مقياس ضغط (No Gauge)، ولها بوق صلب (Hard Horn).</p>`},
  {fig:'(6-16)',ref:'ص 131',caption:'طفاية ثاني أكسيد الكربون: بلا ساعة ضغط، وبوق صلب يُوجَّه إلى الحريق.',draw:()=>box(fig616(),360)},
  {h:'4- طفايات الهالون',ref:'ص 131',html:`<p>تُملأ بمادة <b>الهالون (BCF)</b>، وهي مادة متبخرة لها قدرة كبيرة على إطفاء الحرائق، وتُضغط بالنيتروجين حتى يشير المؤشر إلى اللون الأخضر. وعند الاستعمال يدفع النيتروجين الهالون إلى مسافة قد تصل إلى ${lt('6 m')} أو أكثر، و<b>يتفاعل الهالون مع الشقوق الطليقة</b> فيطفئ الحريق في الحال. ونظرًا لأن الهالون له تأثير ضار على <b>طبقة الأوزون</b> التي تحمينا من الأشعة فوق البنفسجية، <b>تم إيقاف استخدامه</b>، ويُستخدم حاليًا مواد بديلة غير ضارة بالأوزون.</p>`},
  {html:`<div class="tablebox"><table class="tt"><thead><tr><th>الطفاية</th><th>كيف تطفئ</th><th>تناسب</th><th>لا تُستخدم على</th><th>المصدر</th></tr></thead><tbody>
   <tr><td>الماء</td><td>التبريد</td><td>A</td><td>C (الكهرباء)، B، D، K</td><td><span class="s6-chip add">إضافة من خارج الكتاب</span> (ومنع الماء على B وC من ص 127–128)</td></tr>
   <tr><td>الرغوة</td><td>الخنق والتبريد</td><td>B وA</td><td>C (تحتوي ماءً)، D</td><td><span class="s6-chip add">إضافة من خارج الكتاب</span> (B ومنعها على C من ص 127–128)</td></tr>
   <tr><td>البودرة ABC</td><td>عزل الوقود عن الأكسجين وإيقاف التفاعل المتسلسل</td><td>A وB وC</td><td>لا يفضل على الأجهزة الحساسة</td><td>ص 129–130</td></tr>
   <tr><td>ثاني أكسيد الكربون</td><td>يحل محل الأكسجين (الخنق)</td><td>B وC</td><td>—</td><td>ص 127–128 و132</td></tr>
   <tr><td>الهالون</td><td>إيقاف التفاعل المتسلسل</td><td>B وC</td><td>أوقف استخدامه (الأوزون)</td><td>ص 127–128 و131</td></tr>
   <tr><td>طفاية المطابخ K</td><td>طبقة عازلة على الزيت وتبريده</td><td>K</td><td>—</td><td><span class="s6-chip add">إضافة من خارج الكتاب</span></td></tr></tbody></table></div><p class="sub">الجدول تجميع منّا.</p>`},
  {h:'6-3-4 إطفاء الحرائق',ref:'ص 131–133',html:`<p>«لإطفاء أي نوع من أنواع الحرائق يجب <b>إزالة عامل من العوامل الأربعة</b> التي تسبب الحريق وهي: الوقود، والأكسجين، والحرارة، والتفاعل الكيميائي المتسلسل، والتي تكوّن الهرم الرباعي للحريق». ويتم ذلك بإحدى الطرق الأربع:</p>`},
  {fig:'(6-17) إلى (6-19)',ref:'ص 132–133',caption:'التجويع (يُزال الوقود) · الخنق (يُزال الأكسجين) · التبريد (تُزال الحرارة) — مثلث الاشتعال بضلع ناقص، كما في أشكال الكتاب.',draw:()=>`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:8px">${[['fuel','STARVATION','(6-17) تجويع الحريق'],['ox','SMOTHERING','(6-18) خنق الحريق'],['heat','COOLING','(6-19) تبريد الحريق']].map(([m,wd,c])=>`<div><div class="svgbox" style="margin-top:0">${methodSVG(m,wd)}</div><p class="sub" style="text-align:center">${c}</p></div>`).join('')}</div>`},
  {html:`<ol><li><b>تجويع الحريق</b> (ص 132): بحرمانه من المواد القابلة للاشتعال التي تغذيه، بنقل البضائع والمواد المتوفرة بمكان الحريق بعيدًا عن تأثير الحرارة واللهب، أو سحب السوائل القابلة للاشتعال من الصهاريج الموجود بها الحريق.</li>
   <li><b>خنق الحريق</b> (ص 132): لكتم النيران ومنع وصول الأكسجين لها، بتغطية الحريق بالرغاوى، أو بغاز ثاني أكسيد الكربون الذي يحل محل الأكسجين، أو بالهالون أو البودرة.</li>
   <li><b>تبريد الحريق</b> (ص 133): لتخفيض درجة الحرارة، وهي <b>الطريقة الأكثر شيوعًا</b>، باستخدام المياه، وتعتمد على قدرة الماء على امتصاص حرارة المواد المشتعلة.</li>
   <li><b>إيقاف التفاعل المتسلسل</b> (ص 133): بعض مواد الإطفاء قادرة على إيقافه، وهي <b>البودرة والهالون</b> (الشكل 6-20).</li></ol>`},
  {fig:'(6-20)',ref:'ص 133',caption:'حبيبات البودرة تمتص الشقوق الطليقة للتفاعل المتسلسل للحريق وتوقفه.',draw:()=>box(fig620(),340)},
  {h:'6-3-5 قواعد عامة لإطفاء الحرائق',ref:'ص 133',html:`<ol><li>يجب أن تكافح الحريق <b>مع اتجاه الريح</b> وليس عكسها.</li><li>ابتعد عن الحريق بحوالي <b>${lt('3 – 5')} أمتار</b> وابدأ بالمكافحة.</li><li>لا تكافح الحريق من منتصفه بل <b>من الأمام للخلف</b>.</li><li>حرّك الطفاية <b>لليمين واليسار</b> أثناء المكافحة.</li><li>كافح الحريق دائمًا <b>من أسفل إلى أعلى</b>.</li><li><b>لا تترك مكان الحريق قبل التأكد من إطفائه تمامًا.</b></li></ol>`},
  {note:TIP+'القاعدة 5 «من أسفل إلى أعلى» معناها: ابدأ بقاعدة الحريق حيث الوقود يحترق، لا بأعلى اللهب — وهي الخطوة A في PASS. (وفي الكتاب «ابعد» والصواب «ابتعد».)'},
  {h:'طريقة استعمال طفايات الحريق — PASS',ref:'ص 134',html:`<p>تُستخدم الأحرف الأولى من الكلمة الإنجليزية <b>PASS</b> للتعبير عن خطوات استعمال الطفاية:</p>
   <div class="tablebox"><table class="tt"><thead><tr><th>الحرف</th><th>الخطوة</th></tr></thead><tbody>
   <tr><td><b>P</b></td><td><span class="ltr">PULL the pin, this unlocks the lever and allows you to discharge the extinguisher</span><br><b>اسحب مسمار الأمان</b></td></tr>
   <tr><td><b>A</b></td><td><span class="ltr">AIM low: point the extinguisher nozzle (or hose) at the base of the fire</span><br><b>وجّه الخرطوم إلى قاعدة الحريق</b></td></tr>
   <tr><td><b>S</b></td><td><span class="ltr">SQUEEZE the lever above the handle: this discharges the extinguishing agent</span><br><b>اضغط على المفتاح</b></td></tr>
   <tr><td><b>S</b></td><td><span class="ltr">SWEEP from side to side moving carefully toward the fire</span><br><b>حرّك الطفاية من جانب لآخر</b></td></tr></tbody></table></div>`},
  {h:'أسئلة عامة على الوحدة السادسة',ref:'ص 135',html:`<div class="s6q">${QS.map(([q,a])=>`<details><summary>${q}</summary><div class="ans"><b>إجابة مقترحة (ليست من الكتاب):</b> ${a}</div></details>`).join('')}</div>`},
  {note:'أسئلة الوحدة في الكتاب كلها عن الجزء الأول (الإنذار والكواشف)، ولا سؤال فيها عن هرم الاشتعال وأنواع الحرائق والطفايات وPASS — راجع هذه في «اختبر نفسك» في الدرسين 6.3 و6.4. والسؤال 8 يكاد يكرر السؤال 6، والسؤال 2 عن «أنظمة إطفاء الحريق» ولا تشرح الوحدة أنظمة إطفاء ثابتة.'}
 ],
 lab:(el)=>extLab(el),
 quiz:[
  {q:'لماذا لا يُفضَّل استخدام طفاية البودرة على أجهزة الحاسب؟',o:['لأنها لا تطفئ','لأن جزيئات البودرة قد تتلف هذه الأجهزة','لأنها توصل الكهرباء','لأنها تضر بطبقة الأوزون'],c:1,e:'(ص 129).'},
  {q:'ما الذي يدل على أن طفاية البودرة المضغوطة بالهواء جاهزة؟',o:['مؤشر ساعة الضغط على اللون الأخضر','وزنها خفيف','لونها أحمر','مسمار الأمان مسحوب'],c:0,e:'تُضغط «حتى يشير المؤشر في ساعة الضغط … إلى اللون الأخضر» (ص 130).'},
  {q:'لماذا أوقف استخدام الهالون؟',o:['لأنه بطيء','لضرره بطبقة الأوزون','لأنه يوصل الكهرباء','لأنه غالٍ'],c:1,e:'(ص 131).'},
  {q:'طريقة الإطفاء الأكثر شيوعًا، وتعتمد على الماء، هي:',o:['التجويع','الخنق','التبريد','إيقاف التفاعل المتسلسل'],c:2,e:'(ص 133).'},
  {q:'ما الحرف A في PASS؟',o:['اسحب المسمار','وجّه الخرطوم إلى قاعدة الحريق','اضغط على المفتاح','حرّك الطفاية من جانب لآخر'],c:1,e:'AIM low: at the base of the fire (ص 134).'},
  {q:'زيت طبخ يشتعل في مقلاة. ما الطفاية المناسبة؟',o:['طفاية الماء','طفاية المطابخ (النوع K)','لا شيء، اتركه','طفاية الرغوة دائمًا'],c:1,e:'إضافة من خارج الكتاب: طفاية المطابخ K تكوّن طبقة عازلة على الزيت وتبرده؛ والماء خطر جدًا على الزيت المشتعل.'}
 ]
});

})(PLCBOOK);
