/* Unit 5 — الخطر الكهربائي على جسم الإنسان، وأنواع الإصابات والإغاثة منها (ص 75–110) — مقرر السلامة الصناعية */
(function(B){

/* أعطال «اكتشف العطل» المخفية (challenge.js): false دائماً خارج وضع التحدي */
const chF=f=>!!(B.chF&&B.chF(f));
/* ---------- small helpers (local to this file) ---------- */
const lt=s=>`<span class="ltr">${s}</span>`;
const box=(h,mw)=>`<div class="svgbox" style="max-width:${mw||560}px;margin-inline:auto">${h}</div>`;
function loopOn(el,fn){let last=performance.now();const f=now=>{if(!document.body.contains(el))return;const dt=Math.min(0.05,Math.max(0,(now-last)/1000));last=now;try{fn(dt)}catch(e){console.error(e);return}requestAnimationFrame(f)};requestAnimationFrame(f)}
function stepsUI(host,steps,getW){let i=0;
  const draw=()=>{host.innerHTML=steps.map((s,j)=>`<li class="${j<i?'done':j===i?'cur':''}"><span class="k">${j<i?'✓':j+1}</span><div><h4>${s.t}</h4><p>${s.x}</p>${j===i?`<div class="act">${s.done?'<span class="hint">بانتظار تنفيذك…</span> <button class="btn" data-next>تخطَّ</button>':'<button class="btn primary" data-next>التالي</button>'}</div>`:''}</div></li>`).join('')+
    (i>=steps.length?`<li class="cur"><span class="k">✓</span><div><h4>أحسنت، أنهيت التجربة</h4><p style="display:block">يمكنك إعادة التجربة متى شئت.</p><div class="act"><button class="btn" data-restart>إعادة التجربة</button></div></div></li>`:'')};
  host.addEventListener('click',e=>{if(e.target.closest('[data-next]')){i++;draw()}if(e.target.closest('[data-restart]')){i=0;draw()}});draw();
  return {check(){const s=steps[i];if(s&&s.done&&s.done(getW())){i++;draw()}}}}
const segHTML=(attr,items,cur)=>`<div class="seg" role="group" style="flex-wrap:wrap">${items.map(([v,l])=>`<button data-${attr}="${v}" aria-pressed="${String(v)===String(cur)}">${l}</button>`).join('')}</div>`;
const segSet=(el,attr,v)=>el.querySelectorAll(`[data-${attr}]`).forEach(b=>b.setAttribute('aria-pressed',String(b.dataset[attr]===String(v))));
const rangeHTML=(id,lbl,min,max,step,v,unit)=>`<label class="sub" style="display:flex;flex-direction:column;gap:2px;min-width:170px;flex:1 1 200px"><span>${lbl}:</span> <b id="${id}V" class="ltr" style="color:var(--fg)">${v} ${unit}</b><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${v}" style="accent-color:var(--blue);width:100%"></label>`;
const pbHTML=(id,color,cap,label)=>`<button class="pb ${color}" id="${id}" aria-label="${label}"><span class="cap">${cap}</span><small>${label}</small></button>`;
const tries=list=>`<h3 class="sm">جرّب</h3><ul class="sub" style="padding-inline-start:20px;margin-top:4px">${list.map(t=>`<li>${t}</li>`).join('')}</ul>`;
const mix=(n,seed)=>{const a=[...Array(n).keys()];let s=(seed||7)*7919+n*31+3;for(let i=n-1;i>0;i--){s=(s*48271)%2147483647;const j=s%(i+1);[a[i],a[j]]=[a[j],a[i]]}return a};
const fmt=(x,d)=>B.fmtN?B.fmtN(x,d):(+x).toFixed(d);
/* SVG text: Arabic and Latin/digits always in separate <text> elements */
const ta=(x,y,s,o)=>`<text class="txt ar${o&&o.m?' m':''}" x="${x}" y="${y}" text-anchor="${(o&&o.a)||'middle'}"${o&&o.st?` style="${o.st}"`:''}>${s}</text>`;
const tl=(x,y,s,o)=>`<text class="txt${o&&o.m?' m':''}" x="${x}" y="${y}" text-anchor="${(o&&o.a)||'middle'}"${o&&o.st?` style="${o.st}"`:''}>${s}</text>`;
const ADD='<b>إضافة من خارج الكتاب:</b> ';
const TIP='<b>توضيح للمتدرب (ليس من نص الكتاب):</b> ';

/* local styles for the activities of this unit */
const CSS=`
.s5-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:10px;margin-top:10px}
.s5-card{border:1.5px solid var(--line);border-radius:12px;padding:10px 12px;background:var(--surface);min-width:0}
.s5-card p{margin:0 0 8px;font-size:14.5px;line-height:1.7}
.s5-card .seg button{font-size:13px;padding:5px 10px}
.s5-card.ok{border-color:var(--on);background:var(--on-soft)}
.s5-card.no{border-color:var(--stop);background:var(--stop-soft)}
.s5-fb{font-size:13px;color:var(--fg);margin-top:6px;line-height:1.7}
.s5-score{font-weight:700;color:var(--blue-ink)}
.s5-pool{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}
.s5-pool button{font:inherit;font-size:14px;text-align:start;line-height:1.6;border:1.5px solid var(--line);background:var(--surface);color:var(--fg);border-radius:10px;padding:7px 12px;cursor:pointer;max-width:100%}
.s5-pool button:hover{border-color:var(--blue)}
.s5-pool button.no{border-color:var(--stop);background:var(--stop-soft)}
.s5-done{margin:8px 0 0;padding-inline-start:22px}
.s5-done li{margin:4px 0;line-height:1.7}
.s5-found{margin:6px 0 0;padding-inline-start:22px}
.s5-found li{margin:4px 0;line-height:1.7;font-size:14px}
.s5-hot{cursor:pointer}
.s5-hot:focus{outline:none}
.s5-hot:focus-visible .s5-hit{stroke:var(--blue);stroke-width:2;stroke-dasharray:4 3}
.s5-zone tr.hi td{background:var(--live-soft);font-weight:700}
.s5-check{list-style:none;margin:6px 0 0;padding:0}
.s5-check li{display:grid;grid-template-columns:24px minmax(0,1fr);gap:8px;padding:5px 6px;border-radius:8px;font-size:14px;line-height:1.6;color:var(--muted)}
.s5-check li.ok{color:var(--fg)}
.s5-check li.cur{background:var(--blue-soft);color:var(--fg)}
.s5-check li i{font-style:normal;font-weight:700;text-align:center}
.s5-ctl{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:8px}
.s5-ctl .btn[aria-pressed="true"]{background:var(--blue-soft);border-color:var(--blue)}
.s5-grp{border:1px solid var(--line);border-radius:12px;padding:8px 10px;margin-top:8px}
.s5-grp>b{display:block;font-size:13.5px;margin-bottom:4px}
.s5-big{font-size:28px;font-weight:800;font-family:var(--mono);direction:ltr;unicode-bidi:isolate}
`;
const addCss=()=>{if(document.getElementById('saf5-css'))return;const s=document.createElement('style');s.id='saf5-css';s.textContent=CSS;document.head.appendChild(s)};

/* stick figure: feet at (x,y); arms end at hands lh (person's left = viewer's right) / rh */
function man(x,y,o){o=o||{};const s=o.s||1,hy=y-112*s,sh=[x,hy+24*s],hip=[x,y-48*s];
  const rh=o.rh||[x-26*s,y-50*s],lh=o.lh||[x+26*s,y-50*s];
  const st=`stroke:var(--fg);stroke-width:${(2.6*s).toFixed(1)};fill:none;stroke-linecap:round;stroke-linejoin:round`;
  const lf=o.lf||[x+14*s,y],rf=o.rf||[x-14*s,y];
  return `<g style="${st}"><circle cx="${x}" cy="${hy}" r="${11*s}" style="fill:var(--surface)"/><path d="M${sh[0]} ${hy+11*s}L${hip[0]} ${hip[1]}M${hip[0]} ${hip[1]}L${rf[0]} ${rf[1]}M${hip[0]} ${hip[1]}L${lf[0]} ${lf[1]}M${sh[0]} ${sh[1]}L${rh[0]} ${rh[1]}M${sh[0]} ${sh[1]}L${lh[0]} ${lh[1]}"/></g>`}
const earth=(x,y,s)=>{s=s||1;return `<path d="M${x} ${y}v${8*s}M${x-11*s} ${y+8*s}h${22*s}M${x-7*s} ${y+12*s}h${14*s}M${x-3*s} ${y+16*s}h${6*s}" style="stroke:var(--fg);stroke-width:1.6;fill:none"/>`};
const zig=(x1,y1,x2,y2,n,a)=>{let d=`M${x1} ${y1}`;for(let i=1;i<=n;i++){const t=i/n,x=x1+(x2-x1)*t,y=y1+(y2-y1)*t,nx=-(y2-y1),ny=x2-x1,L=Math.hypot(nx,ny)||1,k=i===n?0:(i%2?1:-1)*a;d+=`L${(x+nx/L*k).toFixed(1)} ${(y+ny/L*k).toFixed(1)}`}return d};

/* ---------- figures of lesson 1 ---------- */
const fig51=()=>{let s=`<svg viewBox="0 0 300 200" role="img" aria-label="شخص يمسك موصلين بيديه فيمر التيار من يد إلى يد">`;
  s+=man(150,170,{s:1.1,rh:[100,120],lh:[200,120]});
  s+=`<path d="M100 120C80 140 70 170 90 182H200" style="fill:none;stroke:var(--stop);stroke-width:3"/><path d="M200 120C222 140 236 160 220 178C214 186 204 184 200 182" style="fill:none;stroke:var(--on);stroke-width:3"/>`;
  s+=`<path d="M100 120L150 72L200 120" style="fill:none;stroke:var(--live);stroke-width:5;stroke-dasharray:7 6;opacity:.85"/>`;
  s+=ta(150,22,'يمر التيار من يد إلى يد')+`</svg>`;return s};
const fig52=()=>{let s=`<svg viewBox="0 0 320 200" role="img" aria-label="شخص واقف على الأرض يلمس هيكل محرك مكهرب">`;
  s+=`<ellipse cx="200" cy="182" rx="70" ry="10" style="fill:var(--on-soft);stroke:var(--on)"/>`;
  s+=`<rect x="40" y="130" width="90" height="16" rx="3" style="fill:var(--stop-soft);stroke:var(--stop);stroke-width:2"/><circle cx="85" cy="104" r="28" style="fill:var(--surface);stroke:var(--stop);stroke-width:3"/><circle cx="85" cy="104" r="21" style="fill:none;stroke:var(--stop);stroke-width:1.5"/>`+tl(85,109,'M');
  s+=man(200,180,{s:1.1,rh:[120,104],lh:[230,130]});
  s+=`<path d="M120 104L200 80L200 128L186 180" style="fill:none;stroke:var(--live);stroke-width:5;stroke-dasharray:7 6;opacity:.85"/>`;
  s+=ta(85,30,'هيكل المحرك تحت التوتر')+ta(200,198,'الأرض',{m:1})+`</svg>`;return s};
const fig53=()=>{let s=`<svg viewBox="0 0 360 210" role="img" aria-label="قوس كهربائي بين موصلين وعامل يسقط من السلم">`;
  [60,130].forEach(x=>{s+=`<rect x="${x-8}" y="40" width="16" height="70" rx="6" style="fill:var(--surface-2);stroke:var(--fg)"/>`;for(let k=0;k<5;k++)s+=`<path d="M${x-13} ${50+k*12}h26" style="stroke:var(--fg);stroke-width:1.4"/>`});
  s+=`<path d="M60 40V20M130 40V20" style="stroke:var(--fg);stroke-width:2"/><path d="${zig(68,60,122,62,9,7)}" style="fill:none;stroke:var(--live);stroke-width:3"/><path d="${zig(68,80,122,84,9,6)}" style="fill:none;stroke:var(--blue);stroke-width:2"/>`;
  s+=`<path d="M220 200L260 60M250 200L290 60" style="stroke:var(--muted);stroke-width:3"/>`;for(let k=0;k<6;k++){const y=185-k*24;s+=`<path d="M${224+k*6.7} ${y}H${254+k*6.7}" style="stroke:var(--muted);stroke-width:2.4"/>`}
  s+=`<path d="M285 40H350" style="stroke:var(--fg);stroke-width:4"/><circle cx="292" cy="52" r="16" style="fill:var(--live-soft);stroke:var(--live);stroke-width:2"/><path d="${zig(282,44,300,62,5,5)}" style="fill:none;stroke:var(--live);stroke-width:2.4"/>`;
  s+=`<g transform="rotate(-28 300 150)">${man(300,170,{s:.85,rh:[270,90],lh:[318,98]})}</g>`;
  s+=ta(95,138,'قوس كهربائي')+ta(300,200,'سقوط مفاجئ',{m:1})+`</svg>`;return s};

/* ---------- lesson 1 activity data ---------- */
const STG={d:'التصميم',e:'التنفيذ',u:'الاستخدام'};
const SORT=[
 ['عدم ملاءمة قواطع الحماية مع مقاطع الأسلاك والكيابل وشدة التيار المار بها.','d','ص 77'],
 ['عدم استخدام قواطع مزودة بحماية ضد تيار التسرب الأرضي (E.L.C.B) للمآخذ في الحمامات والمطابخ.','d','ص 77'],
 ['عدم توازن الأحمال على الأطوار الثلاثة.','d','ص 77'],
 ['نقص عدد دوائر المآخذ الكهربائية، فيضطر المستهلك إلى توصيل عدة أجهزة على مأخذ واحد.','d','ص 77'],
 ['عدم وجود نظام لمانعات الصواعق في المناطق المعرضة لذلك.','d','ص 77'],
 ['عدم التقيد بالمخططات والرسومات الكهربائية أثناء العمل.','e','ص 77'],
 ['عدم استعمال المرابط الخاصة لتوصيل وربط الأسلاك ببعضها.','e','ص 77'],
 ['زيادة عدد الأسلاك في الماسورة الواحدة عن الحد المسموح به.','e','ص 77'],
 ['ربط موصل الطور بقاعدة اللمبة وخط التعادل بمفتاح الإنارة.','e','ص 77'],
 ['عدم إبعاد التمديدات الكهربائية عن تمديدات المياه والغاز.','e','ص 78'],
 ['نزع القابس من المقبس بعنف.','u','ص 78 — أ: سوء الاستخدام'],
 ['لمس المفاتيح الكهربائية والأيدي مبتلة بالماء.','u','ص 78 — أ: سوء الاستخدام'],
 ['تمديد الأسلاك تحت السجاد أو قرب النوافذ والمقاعد.','u','ص 78 — أ: سوء الاستخدام'],
 ['عدم فصل التيار الكهربائي أثناء إجراء أعمال الصيانة والإصلاح.','u','ص 78 — ب: إهمال الصيانة'],
 ['عدم استبدال وسيلة القطع والوصل عند ملاحظة خروج شرر منها أثناء عملها.','u','ص 78 — ب: إهمال الصيانة'],
 ['عدم إجراء الكشف والاختبار الدوري على التمديدات والأجهزة.','u','ص 78 — ب: إهمال الصيانة']
];
/* hotspots of the «find the errors» scene: [id, cx, cy, r, title, explanation, stage] */
const HOT=[
 ['sock',92,214,30,'مقبس واحد عليه عدة أجهزة','«توصيل عدة أجهزة كهربائية بمقبس واحد في نفس الوقت» — من سوء الاستخدام (ص 78).','u'],
 ['rug',170,318,34,'سلك ممدود تحت السجادة','«تمديد الأسلاك والكابلات تحت السجاد… مما يعرضها للاهتراء وحدوث القصر» — من سوء الاستخدام (ص 78).','u'],
 ['wet',318,196,40,'يد مبتلة وأرض رطبة عند المفتاح','«لمس الأجهزة والمفاتيح الكهربائية والأيدي مبتلة بالماء أو تشغيل الأجهزة مع الوقوف على أرض رطبة» (ص 78).','u'],
 ['jbox',208,62,28,'أسلاك مجدولة بلا مرابط في علبة مكشوفة','«عدم استعمال المرابط الخاصة لتوصيل وربط الأسلاك ببعضها» — من أخطاء التنفيذ (ص 77).','e'],
 ['pipe',420,38,30,'التمديد الكهربائي ملاصق لأنبوب الماء','«عدم إبعاد التمديدات الكهربائية عن تمديدات المياه والغاز» — من أخطاء التنفيذ (ص 78).','e'],
 ['wash',548,232,36,'غسالة معدنية سلك أرضيها مقطوع','«عدم ربط موصلات التأريض بمرابطها المخصصة في الأجهزة» (ص 77)، و«عدم توصيل سلك التأريض للأجهزة بصورة جيدة» (ص 78).','e'],
 ['panel',600,92,32,'لوحة الحمام بلا قاطع تسرب أرضي ELCB','«عدم استخدام قواطع مزودة بحماية ضد تيار التسرب الأرضي (E.L.C.B) للمآخذ الكهربائية في الحمامات والمطابخ والأماكن المعرضة للرطوبة» — من أخطاء التصميم (ص 77).','d'],
 ['child',452,262,30,'مقبس منخفض بلا غطاء وطفل يعبث به','«عدم وضع وسيلة حماية مناسبة للمقابس الكهربائية لحماية الأطفال من العبث بها» (ص 78).','u'],
 ['spark',250,170,24,'مفتاح يخرج منه شرر ولم يُستبدل','«عدم استبدال وسيلة القطع والوصل (الحماية) عند ملاحظة خروج شرر منها أثناء عملها» — من إهمال الصيانة (ص 78).','u']
];
function sceneSVG(found){let s=`<svg viewBox="0 0 640 350" role="img" aria-label="مشهد منزل فيه أخطاء كهربائية: اضغط على كل خطأ تجده">`;
  s+=`<rect x="0" y="0" width="640" height="300" style="fill:var(--surface-2)"/><rect x="0" y="300" width="640" height="50" style="fill:var(--surface);stroke:var(--line)"/>`;
  /* ceiling services: water pipe + conduit touching */
  s+=`<path d="M300 30H640" style="stroke:#3a86d0;stroke-width:10"/><path d="M300 42H640" style="stroke:var(--muted);stroke-width:6"/>`;
  s+=`<circle cx="430" cy="52" r="3" style="fill:#3a86d0"/><circle cx="445" cy="60" r="2.4" style="fill:#3a86d0"/>`;
  s+=ta(330,22,'ماء',{m:1})+ta(330,60,'تمديد كهربائي',{m:1});
  /* junction box with twisted wires */
  s+=`<rect x="186" y="44" width="44" height="36" rx="3" style="fill:var(--surface);stroke:var(--fg);stroke-width:1.4"/><path d="M196 54c6 6 10-4 16 2s8 8 12 2M196 66c6-4 12 6 18 0s6-6 10 0" style="fill:none;stroke:var(--stop);stroke-width:2"/><path d="M196 58c8 2 14 0 26 4" style="fill:none;stroke:var(--fg);stroke-width:2"/><path d="M208 80V140" style="stroke:var(--muted);stroke-width:3"/><path d="M208 0V44" style="stroke:var(--muted);stroke-width:3"/>`;
  /* sparking switch */
  s+=`<rect x="240" y="150" width="22" height="34" rx="3" style="fill:var(--surface);stroke:var(--fg)"/><rect x="246" y="160" width="10" height="14" style="fill:var(--surface-2);stroke:var(--fg)"/><path d="M263 156l12-8M264 166l14 0M263 176l12 8" style="stroke:var(--live);stroke-width:2.4"/><path d="M208 140H251V150" style="fill:none;stroke:var(--muted);stroke-width:3"/>`;
  /* overloaded socket */
  s+=`<rect x="78" y="200" width="28" height="28" rx="3" style="fill:var(--surface);stroke:var(--fg)"/>`;
  [[60,170],[70,250],[110,250],[124,176]].forEach(([x,y],i)=>{s+=`<path d="M92 214Q${(92+x)/2} ${y} ${x} ${y}" style="fill:none;stroke:${['#d23b2f','#2f6fd0','#3a3a3a','#c99512'][i]};stroke-width:3"/><rect x="${x-6}" y="${y-6}" width="12" height="12" rx="2" style="fill:var(--fg)"/>`});
  /* rug with cable under it */
  s+=`<path d="M70 250Q80 300 60 312H290" style="fill:none;stroke:#2f6fd0;stroke-width:3;stroke-dasharray:6 4"/><rect x="40" y="304" width="240" height="16" rx="4" style="fill:var(--live-soft);stroke:var(--live);opacity:.9"/>`;
  s+=ta(160,340,'سجادة',{m:1});
  /* person with wet hand at a switch, puddle */
  s+=`<rect x="290" y="170" width="18" height="28" rx="3" style="fill:var(--surface);stroke:var(--fg)"/>`;
  s+=`<ellipse cx="350" cy="300" rx="44" ry="8" style="fill:rgba(58,134,208,.25);stroke:#3a86d0"/>`;
  s+=man(350,298,{s:1,rh:[306,186],lh:[372,250]});
  [[300,200],[306,210],[296,214]].forEach(([x,y])=>{s+=`<path d="M${x} ${y}q-3 5 0 7q3-2 0-7z" style="fill:#3a86d0"/>`});
  /* low socket + child */
  s+=`<rect x="440" y="252" width="22" height="22" rx="3" style="fill:var(--surface);stroke:var(--fg)"/><circle cx="447" cy="263" r="2" style="fill:var(--fg)"/><circle cx="455" cy="263" r="2" style="fill:var(--fg)"/>`;
  s+=man(488,298,{s:.55,rh:[464,262],lh:[500,270]});
  /* washing machine with broken earth wire */
  s+=`<rect x="516" y="196" width="66" height="102" rx="6" style="fill:var(--surface);stroke:var(--fg);stroke-width:1.6"/><circle cx="549" cy="252" r="24" style="fill:var(--surface-2);stroke:var(--fg);stroke-width:1.6"/><rect x="524" y="204" width="50" height="10" rx="2" style="fill:var(--surface-2);stroke:var(--fg)"/>`;
  s+=`<path d="M582 280H600V262" style="fill:none;stroke:#2e9b4f;stroke-width:3;stroke-dasharray:7 3"/><path d="M600 252V232" style="stroke:#2e9b4f;stroke-width:3;stroke-dasharray:7 3"/><path d="M594 260l12-6" style="stroke:var(--stop);stroke-width:2"/>`;
  /* panel feeding the bathroom: MCBs only */
  s+=`<rect x="568" y="66" width="64" height="56" rx="4" style="fill:var(--surface);stroke:var(--fg);stroke-width:1.4"/>`;for(let k=0;k<3;k++)s+=`<rect x="${576+k*18}" y="78" width="12" height="26" rx="2" style="fill:var(--surface-2);stroke:var(--fg)"/>`;
  s+=tl(600,116,'MCB MCB MCB',{m:1,st:'font-size:7px'})+ta(600,138,'لوحة الحمام',{m:1});
  s+=`<path d="M490 120V80H514V120Z" style="fill:var(--blue-soft);stroke:var(--blue)"/>`+ta(502,74,'حمام',{m:1});
  /* hotspots */
  HOT.forEach(([id,x,y,r],i)=>{const f=found.has(id);s+=`<g class="s5-hot" data-h="${id}" tabindex="0" role="button" aria-label="موضع ${i+1}"><circle class="s5-hit" cx="${x}" cy="${y}" r="${r}" style="fill:transparent;stroke:${f?'var(--stop)':'transparent'};stroke-width:${f?3:0}"/>${f?`<circle cx="${x+r*0.72}" cy="${y-r*0.72}" r="10" style="fill:var(--stop)"/>`+tl(x+r*0.72,y-r*0.72+4,String([...found].indexOf(id)+1),{st:'fill:#fff'}):''}</g>`});
  return s+'</svg>'}

function lab1(el){addCss();const ans={},found=new Set();let ord=mix(SORT.length,3),miss=0;
  el.innerHTML=`<div class="grid">
   <div class="panel c12"><h2>نشاط ١: في أي مرحلة وقع الخطأ؟ <small>نشاط فرز مبني على البنود 5-1 و5-2 و5-3 ص 77–78</small></h2>
    <p class="sub">يقسّم الكتاب الأخطاء التي تسبب الخطر الكهربائي على ثلاث مراحل: التصميم ثم التنفيذ ثم الاستخدام. اقرأ كل بطاقة واختر مرحلتها.</p>
    <div class="s5-ctl"><span class="s5-score" id="sc"></span><button class="btn" id="shuf">أعد خلط البطاقات</button><button class="btn" id="solv">أظهر الإجابات</button></div>
    <div class="s5-cards" id="cards"></div></div>
   <div class="panel c8"><h2>نشاط ٢: اكتشف الأخطاء في هذا المنزل <small>مبني على قوائم الأخطاء ص 77–78</small></h2>
    <p class="sub">في الرسم ${HOT.length} أخطاء من قوائم الكتاب. اضغط على كل خطأ تراه.</p>
    <div class="svgbox" id="scene" style="max-width:640px;margin-inline:auto"></div>
    <div class="s5-ctl"><span class="s5-score" id="fc"></span><button class="btn" id="showall">أظهر كل الأخطاء</button><button class="btn" id="clr">ابدأ من جديد</button></div></div>
   <div class="panel c4"><h2>ما وجدته</h2><ol class="s5-found" id="flist"></ol><div class="callout" id="fmsg">اضغط على موضع في الرسم.</div>
    ${tries(['ابدأ بالبطاقات التي تعرف مرحلتها، ثم ارجع إلى الشرح في الباقي.','لاحظ أن خطأ التأريض يظهر في أكثر من مرحلة: غيابه في التصميم، وعدم ربطه في التنفيذ، وسوء توصيله في الاستخدام.','في الرسم: ابحث عن الماء قرب الكهرباء، والأسلاك المخفية، والأشياء التي يصل إليها الطفل.'])}</div>
  </div>`;
  const $=s=>el.querySelector(s);
  const drawCards=()=>{let ok=0,n=0;$('#cards').innerHTML=ord.map(i=>{const [t,st,ref]=SORT[i],a=ans[i];if(a){n++;if(a===st)ok++}
    return `<div class="s5-card${a?(a===st?' ok':' no'):''}"><p>${t}</p>${segHTML('a'+i,Object.entries(STG),a||'')}${a?`<div class="s5-fb">${a===st?'<b>صحيح.</b> ':'<b>ليس هذا.</b> '}من أخطاء مرحلة <b>${STG[st]}</b> (${ref}).</div>`:''}</div>`}).join('');
    $('#sc').textContent=`صحيح ${ok} من ${SORT.length}`+(n<SORT.length?` — بقي ${SORT.length-n}`:ok===SORT.length?' — ممتاز!':'');
    el.querySelectorAll('#cards [class*="seg"] button').forEach(b=>b.addEventListener('click',()=>{const k=Object.keys(b.dataset)[0];ans[+k.slice(1)]=b.dataset[k];drawCards()}))};
  const drawScene=()=>{$('#scene').innerHTML=sceneSVG(found);$('#fc').textContent=`وجدت ${found.size} من ${HOT.length}`+(found.size===HOT.length?' — أحسنت!':'');
    $('#flist').innerHTML=[...found].map(id=>{const h=HOT.find(x=>x[0]===id);return `<li><b>${h[4]}</b> <span class="sub">(${STG[h[6]]})</span></li>`}).join('');
    el.querySelectorAll('.s5-hot').forEach(g=>{const act=()=>{const id=g.dataset.h,h=HOT.find(x=>x[0]===id);found.add(id);$('#fmsg').innerHTML=`<b>${h[4]}</b><br>${h[5]}`;drawScene()};g.addEventListener('click',act);g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();act()}})})};
  $('#scene').addEventListener('click',e=>{if(!e.target.closest('.s5-hot')){miss++;$('#fmsg').innerHTML='لا خطأ في هذا الموضع. دقق في الأسلاك والمقابس والماء.'}});
  $('#shuf').addEventListener('click',()=>{ord=mix(SORT.length,Date.now()%997);Object.keys(ans).forEach(k=>delete ans[k]);drawCards()});
  $('#solv').addEventListener('click',()=>{SORT.forEach((r,i)=>ans[i]=r[1]);drawCards()});
  $('#showall').addEventListener('click',()=>{HOT.forEach(h=>found.add(h[0]));$('#fmsg').innerHTML='هذه كل الأخطاء المرسومة. اضغط على أي واحد لقراءة سببه من الكتاب.';drawScene()});
  $('#clr').addEventListener('click',()=>{found.clear();$('#fmsg').innerHTML='اضغط على موضع في الرسم.';drawScene()});
  drawCards();drawScene()}

/* =====================================================================
   LESSON 1 — الأخطاء في التصميم والتنفيذ والاستخدام، وأسباب الإصابة
   ===================================================================== */
B.lesson({
 id:'u5-l1',unit:5,order:1,pages:'75–80',
 title:'الأخطاء في التصميم والتنفيذ والاستخدام، وأسباب الإصابة',
 summary:'المخاطر الكهربائية تنشأ من أخطاء في التصميم ثم التنفيذ ثم الاستخدام، وللإصابة بالتيار خمسة أسباب: ملامسة التوصيلات، وملامسة الأجزاء التي تكهربت بعطل، والقوس الكهربائي، ووقوع الجهد المنخفض تحت أثر الجهد العالي، والكهرباء الساكنة.',
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
})())/*DCML-END*/,(window.S5=window.S5||(function(){
/* رسوم محطات الوحدة الخامسة (السلامة): لوحة ألوان ثابتة على خلفية الرسم الفاتحة، وأدوات نص عربي/لاتيني منفصلة */
const PAL='--fg:#2C4A40;--surface:#FBF6EE;--surface-2:#EDE3D2;--muted:#5E7268;--line:#BFB29C;--live:#D9822B;--live-soft:#F8E1C2;--stop:#C8372D;--stop-soft:#F4D3CC;--on:#12855A;--on-soft:#CFE6DB;--blue:#2F6FD0;--blue-soft:#D6E4F7;--blue-ink:#1F4E9A';
const svg=(aria,bg,inner)=>`<svg viewBox="0 0 360 320" role="img" aria-label="${aria}" style="font-family:var(--font);${PAL}" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="${bg}"/>${inner}</svg>`;
const nest=(s,x,y,w,h)=>s.replace(/^<svg /,`<svg x="${x}" y="${y}" width="${w}" height="${h}" `);
const ar=(x,y,s,o)=>{o=o||{};return `<text x="${x}" y="${y}" text-anchor="${o.a||'middle'}" font-size="${o.fs||13}" fill="${o.c||'#2C4A40'}"${o.b?' font-weight="700"':''} direction="rtl">${s}</text>`};
const la=(x,y,s,o)=>{o=o||{};return `<text x="${x}" y="${y}" text-anchor="${o.a||'middle'}" font-size="${o.fs||12}" fill="${o.c||'#2C4A40'}"${o.b?' font-weight="700"':''} font-family="var(--mono)" direction="ltr">${s}</text>`};
const tip=(t,inner)=>`<g data-tip="${t}">${inner}</g>`;
const hot=(x,y,w,h,t)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="transparent" data-tip="${t}"/>`;
return {PAL,svg,nest,ar,la,tip,hot};
})()),{intro:true}),

  {st:1,short:'أهداف الوحدة',title:'الوحدة الخامسة: الهدف العام والأهداف التفصيلية',ref:'ص <span class="ltr">75–76</span>',
   q:'قبل أن تلمس أي سلك: ما الذي ستعرفه بعد هذه الوحدة عن الخطر الكهربائي على جسمك؟',
   art:S5.svg('خمس محطات للوحدة من أسباب الإصابة إلى الإغاثة','#DDEFE6',(()=>{const P=[[260,70,'أسباب الإصابة','الهدف 1: أن يقوم المتدرب بحصر أسباب الإصابة بالتيار الكهربائي.'],[110,112,'آثار التيار في الجسم','الهدف 2: أن يصف المتدرب آثار مرور التيار الكهربائي في جسم الإنسان.'],[250,168,'المرور إلى الأرض','الهدف 3: أن يعدد المتدرب الآثار الناجمة عن مرور التيار الكهربائي إلى الأرض عبر جسم الإنسان.'],[110,222,'أنواع الإصابات','الهدف 4: أن يشرح المتدرب أنواع الإصابات الكهربائية.'],[250,268,'إغاثة المصاب','الهدف 5: أن يطبق المتدرب طرق إغاثة المصاب بالتيار الكهربائي.']];
     let s=`<path d="M260 70L110 112L250 168L110 222L250 268" fill="none" stroke="#2C4A40" stroke-width="3" stroke-dasharray="7 6"/>`;
     P.forEach(([x,y,t,d],i)=>{s+=S5.tip(d,`<rect x="${x-78}" y="${y-19}" width="156" height="38" rx="19" fill="${i===4?'#F2C14E':'#FBF6EE'}" stroke="#2C4A40" stroke-width="2.5"/><circle cx="${x+60}" cy="${y}" r="13" fill="#E8735A"/>`+S5.la(x+60,y+5,String(i+1),{c:'#FBF6EE',b:1,fs:14})+S5.ar(x-14,y+5,t,{fs:12,b:1}))});
     return s+S5.ar(180,30,'الوحدة في خمس خطوات',{fs:15,b:1})})()),
   cap:'الأهداف التفصيلية الخمسة الأولى كطريق تمشي فيه دروس الوحدة.<br><b>مرّر المؤشر على أي محطة (أو المسها في الجوال) لتقرأ الهدف كما في الكتاب.</b>',
   side:[
    {predict:{q:'بمَ تنتهي الوحدة حسب أهدافها؟',opts:[
     ['بتصميم التمديدات الكهربائية للمنزل',false,'التصميم يُذكر في أول الوحدة كمصدر للأخطاء، وليس هدفاً تتعلمه.'],
     ['بأن يطبق المتدرب طرق إغاثة المصاب بالتيار الكهربائي',true,'هذا الهدف 5 (ص 76): الوحدة تبدأ بالأسباب وتنتهي بالإغاثة.'],
     ['بحساب مقاطع الأسلاك والكابلات',false,'لا يوجد هذا في أهداف الوحدة.']]}}
   ],
   body:[
    {book:"<p><b>الهدف العام للوحدة:</b> الإنجازات الأساسية لمعرفة القواعد العامة للسلامة من الخطر الكهربائي والآثار الناجمة عنه وإرشادات السلامة الصناعية.</p>\n<p><b>الأهداف التفصيلية:</b></p>\n<ol><li>أن يقوم المتدرب بحصر أسباب الإصابة بالتيار الكهربائي.</li><li>أن يصف المتدرب آثار مرور التيار الكهربائي في جسم الإنسان.</li><li>أن يعدد المتدرب الآثار الناجمة عن مرور التيار الكهربائي إلى الأرض عبر جسم الإنسان.</li><li>أن يشرح المتدرب أنواع الإصابات الكهربائية.</li><li>أن يطبق المتدرب طرق إغاثة المصاب بالتيار الكهربائي.</li><li>أن يُعرِّف المتدرب أسباب الإصابة بالتيار الكهربائي.</li><li>أن يصف المتدرب آثار مرور التيار الكهربائي في جسم الإنسان.</li><li>أن يعدد المتدرب الحالات الناجمة عن مرور التيار الكهربائي إلى الأرض عبر جسم الإنسان.</li></ol>",ref:'ص 76'},
    {watch:"الأهداف 6–8 (ص 76) تكرار للأهداف 1–3 بألفاظ متقاربة: الهدف 7 يطابق الهدف 2 حرفياً.",fix:true},
    {tip:'<p>اقرأ الأهداف كسؤال واحد كبير: <b>لماذا</b> يصاب الإنسان بالكهرباء (الأسباب)، و<b>ماذا</b> يحدث في جسمه (الآثار، والمرور إلى الأرض، وأنواع الإصابات)، ثم <b>كيف</b> تنقذه (الإغاثة).</p>',title:'ثلاثة أسئلة: لماذا؟ ماذا؟ كيف؟'},
    {title:'مختبر مصغّر: رتّب موضوعات الوحدة',widget:(el,B)=>DCML.order(el,B,{intro:'اضغط موضوعات الوحدة بالترتيب الذي جاءت به أهدافها (1 إلى 5).',steps:[
     ['أسباب الإصابة بالتيار الكهربائي','قبل أن نعرف الأثر نعرف السبب: هذا الهدف 1.'],
     ['آثار مرور التيار في جسم الإنسان','الهدف 2 يأتي بعد الأسباب.'],
     ['مرور التيار إلى الأرض عبر الجسم','الهدف 3: بعد آثار التيار في الجسم.'],
     ['أنواع الإصابات الكهربائية','الهدف 4: قبل الإغاثة مباشرة.'],
     ['إغاثة المصاب','الهدف 5 هو آخر الأهداف.']],done:'هذا ترتيب الدروس الخمسة في الوحدة أيضاً.'})}
   ]},

  {st:2,short:'تمهيد',title:'تمهيد: الخطر الكهربائي يبدأ من مراحل العمل',ref:'ص 77',
   q:'المصباح يعمل الآن… لكن هل يمكن أن يكون الخطأ قد وقع قبل سنة، في ورقة التصميم؟',
   art:S5.svg('ثلاث مراحل: التصميم ثم التنفيذ ثم الاستخدام','#FBE6C4',
     S5.tip('مرحلة التصميم: إعداد المخططات واختيار القواطع والأسلاك والحماية. خطأ هنا ينتقل إلى ما بعده.',`<rect x="232" y="70" width="96" height="120" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><rect x="248" y="90" width="64" height="48" fill="#D6E4F7" stroke="#2F6FD0" stroke-width="2"/><path d="M256 100h20v28h28M276 114h28" fill="none" stroke="#2F6FD0" stroke-width="2"/>`+S5.ar(280,170,'التصميم',{b:1,fs:15}))
    +S5.tip('مرحلة التنفيذ: تمديد الأسلاك وتركيب اللوحات والمفاتيح حسب المخططات.',`<rect x="132" y="70" width="96" height="120" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M160 140l34-34" stroke="#2C4A40" stroke-width="7" stroke-linecap="round"/><path d="M192 108l12-12" stroke="#E8735A" stroke-width="10" stroke-linecap="round"/>`+S5.ar(180,170,'التنفيذ',{b:1,fs:15}))
    +S5.tip('مرحلة الاستخدام: طريقة استعمال الأجهزة والمقابس، وصيانتها.',`<rect x="32" y="70" width="96" height="120" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><rect x="62" y="94" width="36" height="30" rx="6" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><path d="M72 94v-12M88 94v-12M80 124v22" stroke="#2C4A40" stroke-width="3.5"/>`+S5.ar(80,170,'الاستخدام',{b:1,fs:15}))
    +`<path d="M228 130h-6M128 130h-6" stroke="#2C4A40" stroke-width="3"/><polygon points="226,124 214,130 226,136" fill="#2C4A40"/><polygon points="126,124 114,130 126,136" fill="#2C4A40"/>`
    +S5.ar(180,232,'لكل مرحلة أخطاء تسبب خطراً',{fs:14,b:1})+S5.ar(180,256,'تبدأ بالتصميم وتنتهي بالاستخدام',{fs:13})),
   cap:'المراحل الثلاث كما رتبها الكتاب، من اليمين إلى اليسار.<br><b>مرّر المؤشر على كل مرحلة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'حسب التمهيد، ماذا يجب أن نفعل أولاً للحد من الخطر الكهربائي؟',opts:[
     ['نتعرف على مكامن الخطر ثم نتخذ التدابير الوقائية',true,'«وللحد من هذا الخطر يجب التعرف على مكامنه، واتخاذ التدابير الوقائية اللازمة» (ص 77).'],
     ['نتجنب استعمال الكهرباء قدر الإمكان',false,'الكتاب يصف الكهرباء بأنها «طاقة هامة في حياتنا اليومية»؛ المطلوب الاستخدام الآمن لا الترك.'],
     ['ننتظر حتى يقع العطل ثم نصلحه',false,'التدابير «وقائية»: تُتخذ قبل الحادث.']]}}
   ],
   body:[
    {book:"<p>أثناء عمل الإنسان على الأجهزة الكهربائية المختلفة، يحتمل تعرضه للخطر الكهربائي الناجم عن أسباب عدة، وللحد من هذا الخطر يجب التعرف على مكامنه، واتخاذ التدابير الوقائية اللازمة، لضمان الاستخدام الآمن لهذه الطاقة الهامة في حياتنا اليومية.</p>\n<p>وهناك مخاطر عدة تنشأ في المراحل المختلفة بدءاً <b>بالتصميم</b> ثم <b>التنفيذ</b> وانتهاءً <b>بالاستخدام</b>، ومنها ما يلي:</p>",ref:'ص 77'},
    {add:'<p>في المباني الحديثة يُراجَع التصميم قبل التنفيذ، ويُفحص التنفيذ قبل توصيل التيار، ويُفحص الاستخدام بالصيانة الدورية؛ أي أن كل مرحلة لها من يراجعها. هذا يوافق تقسيم الكتاب للأخطاء على المراحل الثلاث.</p>',title:'من يراجع كل مرحلة؟'},
    {title:'تحقق سريع',widget:(el,B)=>DCML.tf(el,B,{intro:'احكم على كل عبارة بحسب التمهيد.',items:[
     ['الخطر الكهربائي ينشأ في مرحلة الاستخدام فقط.',false,'المخاطر «تنشأ في المراحل المختلفة بدءاً بالتصميم ثم التنفيذ وانتهاءً بالاستخدام» (ص 77).'],
     ['يحتمل أن يتعرض الإنسان للخطر الكهربائي أثناء عمله على الأجهزة الكهربائية لأسباب عدة.',true,'هذا أول التمهيد (ص 77).'],
     ['الهدف من معرفة مكامن الخطر هو الاستخدام الآمن للكهرباء.',true,'«لضمان الاستخدام الآمن لهذه الطاقة الهامة في حياتنا اليومية» (ص 77).']]})}
   ]},

  {st:3,short:'أخطاء التصميم',title:'<span class="ltr">5-1</span> أخطاء في مرحلة التصميم',ref:'ص 77',
   q:'مهندس صمّم حماماً بلا قاطع تسرب أرضي… متى سيظهر خطؤه؟',
   art:S5.svg('مخطط تصميم: لوحة توزيع وقاطع تسرب أرضي للحمام وثلاثة أطوار وأرضي ومانع صواعق','#E6E2F8',
     S5.tip('مانع الصواعق: عدم وجود نظام لمانعات الصواعق في المناطق المعرضة لذلك من أخطاء التصميم.',`<path d="M300 40v40" stroke="#2C4A40" stroke-width="4"/><path d="M292 40l8-16 8 16z" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><path d="M300 80v150" stroke="#2C4A40" stroke-width="2" stroke-dasharray="5 4"/>`)
    +`<rect x="60" y="70" width="210" height="160" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/>`
    +S5.tip('لوحة التوزيع: اختيار مكانها المناسب، وعدد الدوائر والمآخذ المناسب لكل دائرة، من مسؤولية التصميم.',`<rect x="80" y="90" width="70" height="90" rx="6" fill="#EDE3D2" stroke="#2C4A40" stroke-width="2"/><rect x="90" y="100" width="12" height="26" rx="2" fill="#4FB3A9"/><rect x="108" y="100" width="12" height="26" rx="2" fill="#4FB3A9"/><rect x="126" y="100" width="12" height="26" rx="2" fill="#4FB3A9"/>`+S5.ar(115,166,'لوحة التوزيع',{fs:11}))
    +S5.tip('قاطع التسرب الأرضي ⟦E.L.C.B⟧: يجب أن تُحمى به مآخذ الحمامات والمطابخ والأماكن الرطبة. عدم استخدامه هناك خطأ تصميم.',`<rect x="176" y="96" width="74" height="40" rx="6" fill="#F4D3CC" stroke="#C8372D" stroke-width="2.5"/>`+S5.la(213,121,'E.L.C.B',{fs:12,b:1,c:'#C8372D'}))
    +S5.tip('الحمام: مكان معرض للرطوبة والماء، فمآخذه تحتاج حماية ضد تيار التسرب الأرضي.',`<path d="M190 150h50v40h-50z" fill="#D6E4F7" stroke="#2F6FD0" stroke-width="2"/>`+S5.ar(215,175,'حمام',{fs:12}))
    +S5.tip('الأطوار الثلاثة ⟦L1 L2 L3⟧: يجب أن تتوزع الأحمال عليها بتوازن؛ عدم توازن الأحمال خطأ تصميم.',`<path d="M80 200h40M80 212h40M80 224h40" stroke="#2C4A40" stroke-width="2.5"/>`+S5.la(140,204,'L1',{fs:10})+S5.la(140,216,'L2',{fs:10})+S5.la(140,228,'L3',{fs:10}))
    +S5.tip('موصل التأريض والأرضي العام للمبنى: عدم وجودهما في الدوائر الكهربائية من أخطاء التصميم.',`<path d="M300 230v20M286 250h28M291 257h18M296 264h8" stroke="#12855A" stroke-width="3"/>`)
    +S5.ar(165,282,'كل هذا يُقرَّر على الورق',{fs:14,b:1})),
   cap:'مخطط مبسّط فيه أهم عناصر التصميم في البند <span class="ltr">5-1</span>.<br><b>مرّر المؤشر على القاطع والأطوار والأرضي ومانع الصواعق (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'أي القواطع يطلبه الكتاب لمآخذ الحمامات والمطابخ؟',opts:[
     ['قاطع عادي بأي قيمة',false,'الكتاب يعدّ «عدم مناسبة وسيلة الحماية مع المكان» خطأ تصميم.'],
     ['لا يحتاج الحمام إلى قاطع',false,'الحمام من أكثر الأماكن حاجة للحماية لوجود الماء.'],
     ['قاطع مزود بحماية ضد تيار التسرب الأرضي (E.L.C.B)',true,'«كعدم استخدام قواطع مزودة بحماية ضد تيار التسرب الأرضي (E.L.C.B) للمآخذ الكهربائية في الحمامات والمطابخ والأماكن المعرضة للرطوبة والماء» (ص 77).']]}}
   ],
   body:[
    {book:"<ul><li>عدم قيام مهندس كهرباء متخصص بإعداد التصميم اللازم للأعمال الكهربائية.</li><li>عدم ملاءمة قواطع الحماية مع مقاطع الأسلاك والكيابل وشدة التيار المار بها.</li><li>عدم مناسبة وسيلة الحماية المستخدمة مع المكان الذي ستركب فيه، كعدم استخدام قواطع مزودة بحماية ضد تيار التسرب الأرضي <span class=\"ltr\">(E.L.C.B)</span> للمآخذ الكهربائية في الحمامات والمطابخ والأماكن المعرضة للرطوبة والماء.</li><li>عدم توازن الأحمال على الأطوار الثلاثة.</li><li>عدم اختيار الأماكن المناسبة لوضع لوحات التوزيع الكهربائية، وكذلك المآخذ والأعداد المناسبة لكل دائرة.</li><li>نقص عدد دوائر المآخذ الكهربائية مما يضطر المستهلك إلى استخدام مأخذ واحد لتوصيل عدة أجهزة عليه، أو اللجوء إلى التمديدات الخارجية الظاهرة.</li><li>عدم وجود موصل التأريض في الدوائر الكهربائية، وكذلك الأراضي العامة للمبنى.</li><li>عدم وجود نظام لمانعات الصواعق في المناطق المعرضة لذلك.</li></ul>",ref:'ص 77'},
    {tip:'<p>خطأ التصميم «مخفي»: لا يراه المستخدم، لكنه يدفعه إلى أخطاء أخرى. مثال من القائمة نفسها: إذا نقصت دوائر المآخذ اضطر المستهلك إلى توصيل عدة أجهزة بمأخذ واحد — وهذا يصير خطأ استخدام.</p>',title:'خطأ يجرّ خطأ'},
    {title:'مختبر مصغّر: وزّع الأحمال على الأطوار الثلاثة',widget:(el,B)=>DCML.lab(el,B,{intro:'عندك أحمال متساوية (مثل مكيفات من النوع نفسه). اختر عدد الأحمال على كل طور، وراقب هل التوزيع متوازن.',
     predict:{q:'عندك ستة أحمال متساوية. أي توزيع متوازن؟',opts:[['ستة على <span class="ltr">L1</span>، ولا شيء على الطورين الآخرين',false,'كل الحمل على طور واحد: أشد حالات عدم التوازن.'],['اثنان على كل طور',true,'الأطوار الثلاثة تحمل الحمل نفسه.'],['ثلاثة على <span class="ltr">L1</span>، وثلاثة على <span class="ltr">L2</span>',false,'الطور <span class="ltr">L3</span> فارغ والطوران الآخران محمّلان.']]},
     ins:[{k:'a',l:'عدد الأحمال على L1',min:0,max:6,step:1,v:4,dp:0},{k:'b',l:'عدد الأحمال على L2',min:0,max:6,step:1,v:1,dp:0},{k:'c',l:'عدد الأحمال على L3',min:0,max:6,step:1,v:1,dp:0}],
     calc:(s)=>{const v=[s.a,s.b,s.c],mx=Math.max(...v),mn=Math.min(...v),ok=mx===mn;
      return {bars:v.map((x,i)=>({l:'عدد الأحمال على الطور L'+(i+1),v:x,max:6,txt:String(x),col:x===mx&&!ok?'--stop':'--blue'})),
       msg:ok?'<b>متوازن:</b> الأطوار الثلاثة تحمل الحمل نفسه.':`<b>غير متوازن:</b> الطور <span class="ltr">L${v.indexOf(mx)+1}</span> يحمل أكثر من غيره. «عدم توازن الأحمال على الأطوار الثلاثة» من أخطاء التصميم (ص 77).<br><span class="ml-tag">إضافة من خارج الكتاب</span> الطور الأكثر حملاً يمر فيه تيار أكبر فتسخن أسلاكه وقاطعه، ويمر تيار في موصل التعادل.`,cls:ok?'':'warn'}},
     ill:false})},
    {watch:'<p>عدد الأحمال هنا أرقام تختارها أنت للتوضيح، ولا يعطي الكتاب أرقاماً لهذا البند.</p>'}
   ]},

  {st:4,short:'أخطاء التنفيذ',title:'<span class="ltr">5-2</span> أخطاء في مرحلة التنفيذ',ref:'ص <span class="ltr">77–78</span>',
   q:'المفتاح مطفأ واللمبة مطفأة… فهل يمكن أن تصعقك قاعدة اللمبة؟',
   art:S5.svg('دائرة لمبة: المفتاح على الطور أو على التعادل','#F7DCC8',
     S5.tip('موصل الطور ⟦L⟧: الموصل الذي يحمل الجهد. يجب أن يمر عبر المفتاح حتى يقطعه المفتاح.',`<path d="M40 90H300" stroke="#C8372D" stroke-width="4"/>`+S5.la(28,95,'L',{b:1,c:'#C8372D',fs:15}))
    +S5.tip('خط التعادل ⟦N⟧: الموصل الراجع. في الخطأ المرسوم وُضع المفتاح عليه.',`<path d="M40 240H300" stroke="#2F6FD0" stroke-width="4"/>`+S5.la(28,245,'N',{b:1,c:'#2F6FD0',fs:15}))
    +S5.tip('قاعدة اللمبة: في الخطأ المرسوم تبقى متصلة بالطور حتى والمفتاح مفتوح.',`<path d="M180 90V130" stroke="#C8372D" stroke-width="4"/><rect x="160" y="130" width="40" height="22" rx="4" fill="#F4D3CC" stroke="#C8372D" stroke-width="3"/><circle cx="180" cy="176" r="24" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M180 200V214" stroke="#2C4A40" stroke-width="3"/>`)
    +S5.tip('مفتاح الإنارة موصول على خط التعادل ⟦N⟧ (خطأ تنفيذ): يطفئ اللمبة لكنه لا يفصل الجهد عن القاعدة.',`<circle cx="180" cy="214" r="4" fill="#2C4A40"/><path d="M180 214L204 200" stroke="#2C4A40" stroke-width="4" stroke-linecap="round"/><circle cx="206" cy="240" r="4" fill="#2C4A40"/><path d="M180 214V218M206 236V240" stroke="#2C4A40" stroke-width="3"/>`+S5.ar(250,214,'المفتاح',{fs:12}))
    +S5.ar(180,40,'ربط الطور بالقاعدة والتعادل بالمفتاح',{fs:13,b:1})+S5.ar(180,290,'المفتاح مفتوح والقاعدة ما زالت مكهربة',{fs:13,c:'#C8372D',b:1})),
   cap:'أحد أخطاء التنفيذ في القائمة مرسوماً.<br><b>مرّر المؤشر على الموصلين والقاعدة والمفتاح (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'عامل يغيّر لمبة والمفتاح مطفأ، والمفتاح موصول على خط التعادل. هل هو آمن؟',opts:[
     ['آمن تماماً لأن اللمبة مطفأة',false,'إطفاء اللمبة لا يعني فصل الجهد: القاعدة متصلة بالطور مباشرة.'],
     ['غير آمن: قاعدة اللمبة ما زالت متصلة بالطور',true,'لذلك يعدّ الكتاب «ربط موصل الطور بقاعدة اللمبة وخط التعادل بمفتاح الإنارة» خطأ تنفيذ (ص 77).'],
     ['آمن إذا كانت اللمبة جديدة',false,'نوع اللمبة لا يغيّر مكان الطور.']]}}
   ],
   body:[
    {book:"<ul><li>عدم وجود مهندس كهربائي يشرف على تنفيذ الأعمال الكهربائية، وعدم تنفيذ تلك الأعمال من قبل فنيين متخصصين ذوي خبرة في هذا المجال.</li><li>عدم التقيد بالمخططات والرسومات الكهربائية أثناء التنفيذ.</li><li>عدم استعمال المرابط الخاصة لتوصيل وربط الأسلاك ببعضها.</li><li>عدم ربط موصلات التأريض بمرابطها المخصصة في الأجهزة الكهربائية والمآخذ والمفاتيح.</li><li>زيادة عدد الأسلاك في الماسورة الواحدة عن الحد المسموح به.</li><li>ربط موصل الطور بقاعدة اللمبة وخط التعادل بمفتاح الإنارة.</li><li>عدم إحكام ربط الأسلاك والكيابل بقواطع الحماية بصورة جيدة، مما ينتج عنه شرارة كهربائية تتسبب في تلف القاطع وحدوث حرائق.</li><li>عدم إبعاد التمديدات الكهربائية عن تمديدات المياه والغاز.</li><li>عدم المحافظة على استمرارية موصل سلك التأريض.</li></ul>",ref:'ص <span class="ltr">77–78</span>'},
    {tip:"في البند «ربط موصل الطور بقاعدة اللمبة وخط التعادل بمفتاح الإنارة» يبقى جسم القاعدة متصلاً بالطور حتى والمفتاح مفتوح؛ فمن يغيّر اللمبة وهي «مطفأة» قد يلمس الطور. الصواب أن يقطع المفتاح الطور.",title:'لماذا هذا خطأ؟'},
    {title:'مختبر مصغّر: أين نضع المفتاح؟',widget:(el,B)=>DCML.lab(el,B,{intro:'اختر الموصل الذي يمر عبر المفتاح، ثم افتح المفتاح وأغلقه، وراقب اللمبة وقاعدتها.',
     ins:[{k:'w',l:'المفتاح موصول على',seg:[['L','الطور L'],['N','التعادل N']],v:'N'},{k:'on',l:'المفتاح',sw:true,v:0,on:'المفتاح مغلق (اللمبة تعمل)',off:'المفتاح مفتوح (اللمبة مطفأة)'}],
     calc:(s)=>{const lit=!!s.on,live=s.w==='N'||s.on;
      const pic=`<svg viewBox="0 0 320 150" role="img" aria-label="دائرة اللمبة والمفتاح" style="font-family:var(--font)"><path d="M20 30H300" stroke="#C8372D" stroke-width="3"/><path d="M20 130H300" stroke="#2F6FD0" stroke-width="3"/><text x="10" y="35" font-size="13" fill="#C8372D" font-family="var(--mono)" font-weight="700">L</text><text x="10" y="135" font-size="13" fill="#2F6FD0" font-family="var(--mono)" font-weight="700">N</text>`+
       (s.w==='L'?`<path d="M160 30V44" stroke="var(--stop)" stroke-width="3"/><circle cx="160" cy="46" r="3" fill="var(--fg)"/><path d="M160 46L${s.on?160:176} ${s.on?62:56}" stroke="var(--fg)" stroke-width="3"/><circle cx="160" cy="62" r="3" fill="var(--fg)"/><path d="M160 62V72" stroke="${s.on?'var(--stop)':'var(--muted)'}" stroke-width="3"/>`:`<path d="M160 30V72" stroke="var(--stop)" stroke-width="3"/>`)+
       `<rect x="146" y="72" width="28" height="14" rx="3" fill="${live?'var(--stop-soft)':'var(--surface-2)'}" stroke="${live?'var(--stop)':'var(--muted)'}" stroke-width="2.5"/><circle cx="160" cy="98" r="12" fill="${lit?'#F2C14E':'var(--surface)'}" stroke="var(--fg)" stroke-width="2"/>`+
       (s.w==='N'?`<path d="M160 110V112" stroke="var(--fg)" stroke-width="3"/><circle cx="160" cy="112" r="3" fill="var(--fg)"/><path d="M160 112L${s.on?160:176} ${s.on?126:120}" stroke="var(--fg)" stroke-width="3"/><circle cx="160" cy="126" r="3" fill="var(--fg)"/><path d="M160 126V130" stroke="var(--fg)" stroke-width="3"/>`:`<path d="M160 110V130" stroke="var(--fg)" stroke-width="3"/>`)+`</svg>`;
      return {pic,facts:[['اللمبة',lit?'مضاءة':'مطفأة',lit?'hi':''],['قاعدة اللمبة',live?'مكهربة':'بلا جهد',live?'bad':'hi']],
       msg:s.w==='N'?(s.on?'اللمبة تعمل. القاعدة متصلة بالطور كما هو متوقع أثناء التشغيل.':'<b>خطر:</b> اللمبة مطفأة لكن القاعدة ما زالت متصلة بالطور. من يلمسها وهو يغيّر اللمبة قد يُصعق. هذا هو الخطأ الذي يذكره الكتاب.'):(s.on?'اللمبة تعمل والقاعدة مكهربة أثناء التشغيل.':'<b>صحيح:</b> المفتاح قطع الطور، فالقاعدة بلا جهد ويمكن تغيير اللمبة بأمان أكبر.'),cls:s.w==='N'&&!s.on?'bad':''}}})},
    {watch:'<p>حتى مع توصيل المفتاح الصحيح، الأسلم عند الصيانة فصل القاطع لا المفتاح فقط؛ فالكتاب يعدّ «عدم فصل التيار الكهربائي أثناء إجراء أعمال الصيانة والإصلاح» من الأخطاء (ص 78).</p>'}
   ]},

  {st:5,short:'أخطاء الاستخدام',title:'<span class="ltr">5-3</span> أخطاء في مرحلة الاستخدام',ref:'ص 78',
   q:'مقبس واحد عليه أربعة أجهزة، وسلك تحت السجادة… أيهما سوء استخدام وأيهما إهمال صيانة؟',
   art:S5.svg('مقبس عليه عدة قوابس، وسلك تحت سجادة، ومفتاح يخرج منه شرر','#FBE6C4',
     S5.tip('توصيل عدة أجهزة كهربائية بمقبس واحد في نفس الوقت: من سوء الاستخدام.',`<rect x="214" y="70" width="60" height="60" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><circle cx="234" cy="100" r="4" fill="#2C4A40"/><circle cx="254" cy="100" r="4" fill="#2C4A40"/>`+[[300,60],[310,120],[200,150],[300,160]].map(([x,y],i)=>`<path d="M244 100Q${(244+x)/2} ${y-20} ${x} ${y}" fill="none" stroke="${['#E8735A','#2F6FD0','#2C4A40','#12855A'][i]}" stroke-width="3"/><rect x="${x-7}" y="${y-7}" width="14" height="14" rx="3" fill="#2C4A40"/>`).join(''))
    +S5.tip('تمديد الأسلاك والكابلات تحت السجاد يعرضها للاهتراء وحدوث القصر: من سوء الاستخدام.',`<path d="M70 236Q110 210 160 240H300" fill="none" stroke="#2F6FD0" stroke-width="3" stroke-dasharray="6 4"/><rect x="120" y="230" width="190" height="22" rx="6" fill="#E8735A" opacity=".85"/>`+S5.ar(215,246,'سجادة',{fs:12,c:'#FBF6EE',b:1}))
    +S5.tip('مفتاح يخرج منه شرر ولم يُستبدل: من إهمال الصيانة.',`<rect x="72" y="80" width="40" height="56" rx="6" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><rect x="84" y="94" width="16" height="24" rx="3" fill="#EDE3D2" stroke="#2C4A40" stroke-width="2"/><path d="M116 88l16-10M118 106h18M116 124l16 10" stroke="#D9822B" stroke-width="3"/>`)
    +S5.ar(92,166,'إهمال الصيانة',{fs:13,b:1})+S5.ar(244,194,'سوء الاستخدام',{fs:13,b:1})),
   cap:'ثلاثة أخطاء من قائمتي البند <span class="ltr">5-3</span>.<br><b>مرّر المؤشر على المقبس والسجادة والمفتاح (أو المسها في الجوال) لتعرف نوع كل خطأ.</b>',
   side:[
    {predict:{q:'«عدم فصل التيار الكهربائي أثناء إجراء أعمال الصيانة والإصلاح» من أي قسم؟',opts:[
     ['من سوء الاستخدام',false,'الكتاب وضعه في القسم الثاني من أخطاء الاستخدام.'],
     ['من أخطاء التصميم',false,'لا علاقة له بالمخطط؛ هو تصرف أثناء الصيانة.'],
     ['من إهمال الصيانة',true,'هو في قائمة «ب- إهمال الصيانة» (ص 78).']]}}
   ],
   body:[
    {book:"<p><b>أ- سوء الاستخدام:</b></p>\n<ul><li>توصيل عدة أجهزة كهربائية بمقبس واحد في نفس الوقت.</li><li>لمس الأجهزة والمفاتيح الكهربائية والأيدي مبتلة بالماء، أو تشغيل الأجهزة مع الوقوف على أرض رطبة.</li><li>اختيار أجهزة كهربائية غير جيدة.</li><li>نزع القابس من المقبس بعنف.</li><li>استخدام التوصيلات الخارجية الظاهرة، وكذلك غير المباشرة للأجهزة الكهربائية.</li><li>عدم وضع وسيلة حماية مناسبة للمقابس الكهربائية لحماية الأطفال من العبث بها.</li><li>عدم توصيل سلك التأريض للأجهزة بصورة جيدة.</li><li>تمديد الأسلاك والكابلات تحت السجاد أو قرب النوافذ والمقاعد مما يعرضها للاهتراء وحدوث القصر.</li></ul>\n<p><b>ب- إهمال الصيانة:</b></p>\n<ul><li>عدم إجراء الكشف والاختبار الدوري على التمديدات والأجهزة الكهربائية.</li><li>عدم تنظيف وصيانة الأجهزة والمواد الكهربائية.</li><li>عدم فصل التيار الكهربائي أثناء إجراء أعمال الصيانة والإصلاح.</li><li>عدم استبدال وسيلة القطع والوصل (الحماية) عند ملاحظة خروج شرر منها أثناء عملها.</li><li>عدم مراجعة الأحمال الكهربائية والتأكد من ملاءمة القواطع والأسلاك.</li><li>عدم إحكام ربط نهاية الأسلاك بمآخذ التيار أو المفاتيح أو القواطع مما يسبب حدوث شرر يؤدي لتلفها.</li></ul>",ref:'ص 78'},
    {tip:"خطأ التأريض يتكرر في المراحل الثلاث بصور مختلفة: غياب موصل التأريض في <b>التصميم</b>، وعدم ربطه بمرابطه أو انقطاع استمراريته في <b>التنفيذ</b>، وسوء توصيله للأجهزة في <b>الاستخدام</b>. جرّب نشاط الفرز في تبويب «المختبر»."},
    {title:'مختبر مصغّر: سوء استخدام أم إهمال صيانة؟',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل خطأ اضغط القسم الذي وضعه فيه الكتاب.',cats:['سوء الاستخدام','إهمال الصيانة'],items:[
     ['نزع القابس من المقبس بعنف.',0,'من قائمة «أ- سوء الاستخدام» (ص 78).'],
     ['عدم تنظيف وصيانة الأجهزة والمواد الكهربائية.',1,'من قائمة «ب- إهمال الصيانة» (ص 78).'],
     ['اختيار أجهزة كهربائية غير جيدة.',0,'من قائمة «أ- سوء الاستخدام».'],
     ['عدم مراجعة الأحمال الكهربائية والتأكد من ملاءمة القواطع والأسلاك.',1,'من قائمة «ب- إهمال الصيانة».'],
     ['عدم وضع وسيلة حماية مناسبة للمقابس لحماية الأطفال من العبث بها.',0,'من قائمة «أ- سوء الاستخدام».'],
     ['عدم إحكام ربط نهاية الأسلاك بمآخذ التيار أو المفاتيح أو القواطع.',1,'من قائمة «ب- إهمال الصيانة»: يسبب شرراً يؤدي لتلفها.']]})}
   ]},

  {st:6,short:'ملامسة التوصيلات',title:'<span class="ltr">5-4</span> أسباب الإصابة — أ: ملامسة التوصيلات الكهربائية',ref:'ص 79',
   q:'هل يجب أن تلمس السلك بيدك حتى تُصاب؟',
   art:S5.svg('شخص يمسك موصلين بيديه فيمر التيار من يد إلى يد','#DDEFE6',S5.nest(fig51(),30,60,300,200)
    +S5.hot(40,150,90,90,'موصل أول تحت الجهد تمسكه اليد اليمنى: اللمس المباشر باليد.')+S5.hot(230,150,90,90,'موصل ثانٍ تمسكه اليد اليسرى: يكتمل المسار من يد إلى يد.')
    +S5.hot(130,90,100,60,'مسار التيار (الخط المتقطع البرتقالي): يدخل من يد ويخرج من الأخرى عبر الصدر.')+S5.ar(180,290,'اللمس المباشر باليد',{fs:14,b:1})),
   cap:'رسم مبسّط للشكل <span class="ltr">(5-1)</span>.<br><b>مرّر المؤشر على الموصلين ومسار التيار (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'أي مما يلي يذكره الكتاب طريقةً «غير مباشرة» للإصابة بملامسة التوصيلات؟',opts:[
     ['التفريغ الكهربائي دون لمس الموصل',true,'«أو بصورة غير مباشرة عن طريق التفريغ الكهربائي» (ص 79).'],
     ['الإمساك بالسلك باليد',false,'هذا لمس مباشر باليد (الشكل <span class="ltr">5-1</span>).'],
     ['لمس السلك بالكتف أو الركبة',false,'هذا لمس مباشر «بأحد أجزاء الجسم».']]}}
   ],
   body:[
    {book:"<p><b>أ- ملامسة التوصيلات الكهربائية:</b> إن التوصيلات الكهربائية هي جميع النواقل للتيار الكهربائي، حيث يمكن أن يحدث اللمس بصورة مباشرة باليد (الشكل 5-1)، أو بأحد أجزاء الجسم، أو بصورة غير مباشرة عن طريق التفريغ الكهربائي.</p>",ref:'ص 79'},
    {tip:'<p>«التوصيلات الكهربائية» في الكتاب تعني <b>كل ناقل للتيار</b>: السلك المكشوف، وطرف المفتاح، ومربط اللوحة. واللمس له ثلاث صور: باليد، أو بأي جزء آخر من الجسم، أو دون لمس عن طريق التفريغ.</p>',title:'ثلاث صور للمس'},
    {title:'مختبر مصغّر: مباشر أم غير مباشر؟',widget:(el,B)=>DCML.cases(el,B,{intro:'موقفان؛ اختر وصف الكتاب لكل منهما.',cases:[
     {q:'فني أمسك بيده طرفاً مكشوفاً في لوحة توزيع وهو يعمل.',opts:[['لمس مباشر باليد',true,'هذا ما يرسمه الشكل (<span class="ltr">5-1</span>).'],['لمس غير مباشر',false,'هو لمس الموصل نفسه، فهو مباشر.']]},
     {q:'عامل اقترب جداً من موصل تحت الجهد فحدث تفريغ كهربائي إليه دون أن يلمسه.',opts:[['لمس مباشر بأحد أجزاء الجسم',false,'لم يلمس الموصل.'],['إصابة بصورة غير مباشرة عن طريق التفريغ الكهربائي',true,'هذه الصورة الثالثة في الكتاب (ص 79).']]}]})}
   ]},

  {st:7,short:'الأجزاء غير الحاملة',title:'ب: ملامسة الأجزاء الناقلة وغير الحاملة للتيار',ref:'ص 79',
   q:'هيكل المحرك المعدني لا يحمل تياراً في الأحوال العادية… فمتى يصير خطراً؟',
   art:S5.svg('شخص واقف على الأرض يلمس هيكل محرك وقع تحت التوتر','#F7DCC8',S5.nest(fig52(),20,60,320,200)
    +S5.hot(40,110,100,90,'هيكل المحرك المعدني ⟦M⟧: ليس تحت التوتر في حالته الطبيعية، لكنه يقع تحت التوتر إذا انهار العازل أو وقع عليه موصل.')
    +S5.hot(150,90,90,110,'مسار التيار من اليد إلى القدمين عبر الجسم.')+S5.hot(170,225,130,30,'الأرض: الشخص واقف عليها فيكتمل مسار التيار من الهيكل إلى الأرض عبر جسمه.')
    +S5.ar(180,300,'هيكل تكهرب بعطل',{fs:14,b:1})),
   cap:'رسم مبسّط للشكل <span class="ltr">(5-2)</span>.<br><b>مرّر المؤشر على الهيكل والمسار والأرض (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'لماذا يسمي الكتاب هيكل المحرك «جزءاً ناقلاً وغير حامل للتيار»؟',opts:[
     ['لأنه من البلاستيك',false,'الهيكل معدني، والمعدن ناقل.'],
     ['لأنه مؤرض دائماً',false,'الكتاب لا يقول ذلك هنا؛ الحديث عن الخطر إذا تكهرب.'],
     ['لأنه ناقل (معدن) لكنه لا يحمل تياراً في حالته الطبيعية',true,'«ليست تحت التوتر في حالتها الطبيعية، ولكنها يمكن أن تنقل التيار الكهربائي إذا ما وقعت تحت التوتر نتيجة عطل» (ص 79).']]}}
   ],
   body:[
    {book:"<p><b>ب- ملامسة الأجزاء الناقلة، وغير الحاملة للتيار:</b> وهي أجزاء المعدات والتجهيزات التي ليست تحت التوتر في حالتها الطبيعية، ولكنها يمكن أن تنقل التيار الكهربائي إذا ما وقعت تحت التوتر نتيجة عطل كهربائي ما (مثال: الهياكل المعدنية للتجهيزات والمحركات والمحولات… إلخ لدى حدوث انهيار العازل الكهربائي أو وقوع الموصل الكهربائي مباشرة عليها) (الشكل 5-2).</p>",ref:'ص 79'},
    {title:'مختبر مصغّر: متى يصير الهيكل خطراً؟',widget:(el,B)=>DCML.lab(el,B,{intro:'غيّر حالة العازل داخل المحرك، وقرر هل يلمس الشخص الهيكل.',
     ins:[{k:'ins',l:'العازل داخل المحرك',seg:[['ok','سليم'],['bad','منهار (عطل)']],v:'ok'},{k:'t',l:'الشخص',seg:[['no','لا يلمس الهيكل'],['yes','يلمس الهيكل وهو واقف على الأرض']],v:'yes'}],
     calc:(s)=>{const live=s.ins==='bad',hurt=live&&s.t==='yes';
      return {facts:[['الهيكل',live?'تحت التوتر':'ليس تحت التوتر',live?'bad':'hi'],['تيار في جسم الشخص',hurt?'يمر':'لا يمر',hurt?'bad':'hi']],
       msg:hurt?'<b>إصابة:</b> الهيكل وقع تحت التوتر بسبب انهيار العازل، والشخص يلمسه ويقف على الأرض، فيمر التيار في جسمه (الشكل <span class="ltr">5-2</span>).':live?'الهيكل تحت التوتر وينتظر من يلمسه: هذا خطر كامن لا يُرى.':'في الحالة الطبيعية الهيكل ليس تحت التوتر، فلمسه لا يسبب إصابة.',cls:hurt?'bad':live?'warn':''}}})},
    {add:'<p>لهذا الخطر الكامن يطلب الكتاب في أخطاء التصميم والتنفيذ وجود <b>موصل التأريض</b> وربطه بمرابطه في الأجهزة (ص 77): التأريض يجعل تيار العطل يذهب إلى الأرض عبر السلك، فتفصل الحماية الدائرة.</p>',title:'لماذا نؤرض الهياكل؟'}
   ]},

  {st:8,short:'القوس الكهربائي',title:'ج: حدوث القوس الكهربائي',ref:'ص <span class="ltr">79–80</span>',
   q:'القوس قد يصيبك دون أن تلمس شيئاً… فكيف؟',
   art:S5.svg('قوس كهربائي بين موصلين وعامل يسقط بسببه','#FBE6C4',S5.nest(fig53(),0,60,360,210)
    +S5.hot(40,90,120,110,'القوس الكهربائي: يظهر عند دائرة قصر أو عند الفصل الخاطئ لقواطع السكين، ويرافقه انتشار كمية كبيرة من الحرارة.')
    +S5.hot(220,100,130,170,'السقوط المفاجئ من الأماكن العالية: من نتائج القوس التي يذكرها الكتاب.')+S5.ar(180,300,'حرارة شديدة وضوء وسقوط',{fs:14,b:1})),
   cap:'رسم مبسّط للشكل <span class="ltr">(5-3)</span> (الأصل صور فوتوغرافية ورسم ملوّن).<br><b>مرّر المؤشر على القوس والعامل (أو المسها في الجوال) لتعرف معناهما.</b>',
   side:[
    {predict:{q:'متى يظهر القوس الكهربائي حسب الكتاب؟',opts:[
     ['عند تشغيل مصباح عادي',false,'لا يذكره الكتاب.'],
     ['عند دائرة قصر، أو عند الفصل الخاطئ لقواطع السكين',true,'«ويظهر عبر حدوث دائرة قصر، أو عند الفصل الخاطئ لقواطع السكين ذات الجهد العالي أو المنخفض» (ص 79).'],
     ['في الجهد العالي فقط',false,'الكتاب يذكر قواطع السكين «ذات الجهد العالي أو المنخفض».']]}}
   ],
   body:[
    {book:"<p><b>ج- حدوث القوس الكهربائي:</b> ويظهر عبر حدوث دائرة قصر، أو عند الفصل الخاطئ لقواطع السكين ذات الجهد العالي أو المنخفض، حيث يرافق ظهور القوس انتشار كمية كبيرة من الحرارة تؤدي أحياناً إلى العمى والحروق، وحدوث الحرائق، أو السقوط المفاجئ من الأماكن العالية (الشكل 5-3).</p>",ref:'ص <span class="ltr">79–80</span>'},
    {tip:'<p>القوس يؤذي بثلاث طرق: <b>الحرارة</b> (حروق وحرائق)، و<b>الضوء الشديد</b> (العمى)، و<b>المفاجأة</b> (السقوط من مكان عالٍ). لذلك هو خطر حتى لمن لم يمر التيار في جسمه.</p>',title:'ثلاث طرق للأذى'},
    {title:'تحقق سريع: القوس الكهربائي',widget:(el,B)=>DCML.tf(el,B,{intro:'احكم على كل عبارة بحسب نص الكتاب.',items:[
     ['يرافق ظهور القوس انتشار كمية كبيرة من الحرارة.',true,'نص الكتاب (ص <span class="ltr">79–80</span>).'],
     ['القوس لا يسبب إلا الحروق.',false,'يذكر الكتاب أيضاً العمى والحرائق والسقوط المفاجئ من الأماكن العالية.'],
     ['الفصل الخاطئ لقاطع سكين ذي جهد منخفض قد يسبب قوساً.',true,'«ذات الجهد العالي أو المنخفض».']]})}
   ]},

  {st:9,short:'المنخفض تحت أثر العالي',title:'د: وقوع التجهيزات ذات الجهد المنخفض تحت أثر الجهد العالي',ref:'ص 80',
   q:'تعمل على جهاز «منخفض الجهد» فقط… فمن أين يأتيه الجهد العالي فجأة؟',
   art:S5.svg('محول فيه قصر بين ملف الجهد العالي وملف الجهد المنخفض','#E6E2F8',
     S5.tip('ملف الجهد العالي في المحول.',`<rect x="214" y="80" width="40" height="150" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/>`+[0,1,2,3,4,5].map(k=>`<path d="M208 ${96+k*22}h52" stroke="#C8372D" stroke-width="4"/>`).join('')+S5.ar(234,256,'جهد عالٍ',{fs:13,b:1}))
    +S5.tip('ملف الجهد المنخفض في المحول، تتغذى منه التجهيزات المنخفضة الجهد.',`<rect x="106" y="80" width="40" height="150" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/>`+[0,1,2,3,4,5].map(k=>`<path d="M100 ${96+k*22}h52" stroke="#2F6FD0" stroke-width="4"/>`).join('')+S5.ar(126,256,'جهد منخفض',{fs:13,b:1}))
    +S5.tip('قصر بين ملفات الجهد العالي وملفات الجهد المنخفض: ينتقل الجهد العالي إلى جهة الجهد المنخفض.',`<path d="M152 150L170 140L176 160L194 150L208 150" fill="none" stroke="#D9822B" stroke-width="4"/>`)
    +S5.tip('عامل على تجهيزات منخفضة الجهد: يرتفع الجهد فيها فيصير خطراً عليه.',`<circle cx="60" cy="140" r="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M60 152v44M60 196l-12 30M60 196l12 30M60 166l34-6" stroke="#2C4A40" stroke-width="3" fill="none"/>`)
    +S5.ar(180,48,'قصر داخل المحول',{fs:14,b:1})),
   cap:'رسم مبسّط لمثال الكتاب: المحول.<br><b>مرّر المؤشر على الملفين ومكان القصر والعامل (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'يذكر الكتاب سببين لوقوع التجهيزات المنخفضة الجهد تحت أثر الجهد العالي. ما هما؟',opts:[
     ['قصر بين ملفات الجهد العالي والمنخفض، أو توترات فجائية في الشبكة',true,'هذان السببان في نص البند د (ص 80).'],
     ['انقطاع التيار أو ضعف الإنارة',false,'كلاهما يُنقص الجهد ولا يرفعه.'],
     ['استعمال أسلاك طويلة',false,'لا يذكره الكتاب سبباً.']]}}
   ],
   body:[
    {book:"<p><b>د- وقوع التجهيزات ذات الجهد المنخفض تحت أثر الجهد العالي:</b> وذلك نتيجة حدوث قصر بين ملفات الجهد العالي وملفات الجهد المنخفض (في المحولات مثلاً)، أو نتيجة ظهور توترات فجائية في الشبكة، حيث يؤدي ذلك لارتفاع الجهد في التجهيزات المنخفضة الجهد مشكلاً خطراً على الأشخاص العاملين عليها.</p>",ref:'ص 80'},
    {title:'مختبر مصغّر: ماذا يرفع الجهد في التجهيزات المنخفضة؟',widget:(el,B)=>DCML.lab(el,B,{intro:'شغّل أحد السببين اللذين يذكرهما الكتاب، وراقب حالة التجهيزات المنخفضة الجهد.',
     ins:[{k:'sc',l:'قصر بين الملفين',sw:true,v:0,on:'يوجد قصر بين ملفي العالي والمنخفض',off:'لا قصر بين الملفين'},{k:'sg',l:'توتر فجائي',sw:true,v:0,on:'ظهر توتر فجائي في الشبكة',off:'لا توتر فجائي في الشبكة'}],
     calc:(s)=>{const bad=s.sc||s.sg;return {facts:[['جهد التجهيزات المنخفضة',bad?'مرتفع: خطر':'عادي',bad?'bad':'hi'],['العامل عليها',bad?'في خطر':'في أمان من هذا السبب',bad?'bad':'hi']],
      msg:bad?'<b>خطر:</b> «يؤدي ذلك لارتفاع الجهد في التجهيزات المنخفضة الجهد مشكلاً خطراً على الأشخاص العاملين عليها» (ص 80).':'التجهيزات على جهدها المنخفض العادي.',cls:bad?'bad':''}}})},
    {add:'<p>لهذا تُؤرَّض الأجزاء المعدنية في المحولات وتُركَّب أجهزة حماية من الارتفاع المفاجئ للجهد (مانعات الصواعق وأجهزة الحماية من التوترات)، فلا يبقى الجهد العالي على التجهيزات المنخفضة.</p>',title:'كيف نحمي التجهيزات؟'}
   ]},

  {st:10,short:'الكهرباء الساكنة',title:'هـ: آثار الكهرباء الساكنة',ref:'ص 80',
   q:'لا أسلاك ولا مصدر كهرباء… فكيف تسبب الكهرباء انفجاراً؟',
   art:S5.svg('سير متحرك تتراكم عليه شحنات فتفرغ بشرارة قرب غازات','#DDEFE6',
     S5.tip('تحريك أو سحب المواد (مثل سير ناقل أو سائل في أنبوب) يولّد شحنات تتراكم على سطح المادة.',`<rect x="60" y="150" width="200" height="34" rx="17" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><circle cx="77" cy="167" r="13" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/><circle cx="243" cy="167" r="13" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/><path d="M130 140h50m-10-6l10 6-10 6" fill="none" stroke="#2C4A40" stroke-width="2.5"/>`)
    +S5.tip('الشحنات المتراكمة على سطح المادة المكهربة.',[100,130,160,190,220].map(x=>S5.la(x,163,'+',{fs:16,b:1,c:'#C8372D'})).join(''))
    +S5.tip('الشرارة: تفرغ الشحنة دفعة واحدة، وقوتها تتناسب وقيمة الشحنة.',`<path d="M262 150L280 128L272 126L292 100" fill="none" stroke="#D9822B" stroke-width="4"/>`)
    +S5.tip('غازات أو أبخرة قابلة للاشتعال: إن وُجدت سببت الشرارة انفجاراً.',`<ellipse cx="292" cy="78" rx="44" ry="26" fill="#F2C14E" opacity=".55" stroke="#2C4A40" stroke-width="2" stroke-dasharray="5 4"/>`+S5.ar(292,83,'أبخرة',{fs:13,b:1}))
    +S5.ar(170,232,'تراكم الشحنة ثم تفريغها دفعة واحدة',{fs:14,b:1})),
   cap:'رسم مبسّط لتولد الكهرباء الساكنة وتفريغها.<br><b>مرّر المؤشر على السير والشحنات والشرارة والأبخرة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'متى تسبب شرارة الكهرباء الساكنة انفجاراً حسب الكتاب؟',opts:[
     ['كلما تحرك أي شيء',false,'الحركة تولّد الشحنة، أما الانفجار فيحتاج شرطاً آخر.'],
     ['إذا كانت هناك غازات أو أبخرة',true,'«مما يسبب الانفجار إذا كانت هناك غازات أو أبخرة» (ص 80).'],
     ['إذا كان التيار متناوباً',false,'الكهرباء الساكنة ليست تياراً متناوباً.']]}}
   ],
   body:[
    {book:"<p><b>هـ- آثار الكهرباء الساكنة:</b> والتي تتولد من تراكم شحنات على سطح المادة المكهربة نتيجة لتحريك أو سحب المواد أو الاتصال أو الانفصال، وتفرغ شحنتها دفعة واحدة محدثة شرارة كهربائية تتناسب وقيمة هذه الشحنة، مما يسبب الانفجار إذا كانت هناك غازات أو أبخرة، وكذلك الصعقة الكهربائية.</p>",ref:'ص 80'},
    {title:'مختبر مصغّر: سلسلة السبب والنتيجة',widget:(el,B)=>DCML.lab(el,B,{intro:'شغّل الأسباب واحداً واحداً وراقب النتيجة.',
     ins:[{k:'m',l:'الحركة',sw:true,v:0,on:'تحريك أو سحب المواد: تتراكم الشحنات',off:'لا تحريك ولا سحب للمواد'},{k:'g',l:'الجو',sw:true,v:0,on:'في المكان غازات أو أبخرة',off:'لا غازات ولا أبخرة في المكان'}],
     calc:(s)=>({facts:[['الشحنة',s.m?'متراكمة':'لا شحنة',s.m?'bad':'hi'],['الشرارة',s.m?'ممكنة عند التفريغ':'لا شرارة',s.m?'bad':'hi'],['النتيجة',s.m?(s.g?'انفجار':'صعقة كهربائية'):'لا خطر',s.m?'bad':'hi']],
      msg:!s.m?'بلا تراكم شحنات لا شرارة.':s.g?'<b>انفجار:</b> الشرارة في وجود الغازات أو الأبخرة «تسبب الانفجار» (ص 80).':'الشحنة تفرغ دفعة واحدة بشرارة تسبب «الصعقة الكهربائية» لمن يلمس المادة (ص 80).',cls:s.m?(s.g?'bad':'warn'):''})})},
    {watch:"ترقيم عناوين هذه الوحدة في الكتاب مضطرب: 5-1، 5-2، 5-3 (الاستخدام)، 5-4 (أسباب الإصابة)، ثم يعود 5-3 (الآثار) و5-4 (الحالات الناجمة)، ثم 5-5، ثم 5-8 (الإغاثة) و5-7 (الوقاية) و5-8 مرة ثانية (Lock-out)، ولا يوجد 5-6. أبقينا الأرقام المطبوعة في العناوين لتسهل مطابقتها مع الكتاب.",fix:true}
   ]},

  {recap:[
   'تنشأ المخاطر الكهربائية في ثلاث مراحل: التصميم ثم التنفيذ ثم الاستخدام (سوء الاستخدام وإهمال الصيانة).',
   'خطأ التأريض يظهر في المراحل الثلاث، وربط الطور بقاعدة اللمبة والتعادل بالمفتاح يترك القاعدة مكهربة والمفتاح مفتوح.',
   'أسباب الإصابة خمسة: ملامسة التوصيلات، وملامسة الأجزاء غير الحاملة التي تكهربت بعطل، والقوس الكهربائي.',
   'ومنها أيضاً: وقوع التجهيزات المنخفضة الجهد تحت أثر الجهد العالي، وآثار الكهرباء الساكنة التي قد تسبب انفجاراً مع الغازات أو الأبخرة.']}
],
 theory:[
  {h:'الوحدة الخامسة: الخطر الكهربائي على جسم الإنسان، وأنواع الإصابات والإغاثة منها',ref:'ص 75–76',html:`<p><b>الهدف العام للوحدة:</b> الإنجازات الأساسية لمعرفة القواعد العامة للسلامة من الخطر الكهربائي والآثار الناجمة عنه وإرشادات السلامة الصناعية.</p>
   <p><b>الأهداف التفصيلية:</b></p><ol><li>أن يقوم المتدرب بحصر أسباب الإصابة بالتيار الكهربائي.</li><li>أن يصف المتدرب آثار مرور التيار الكهربائي في جسم الإنسان.</li><li>أن يعدد المتدرب الآثار الناجمة عن مرور التيار الكهربائي إلى الأرض عبر جسم الإنسان.</li><li>أن يشرح المتدرب أنواع الإصابات الكهربائية.</li><li>أن يطبق المتدرب طرق إغاثة المصاب بالتيار الكهربائي.</li><li>أن يُعرِّف المتدرب أسباب الإصابة بالتيار الكهربائي.</li><li>أن يصف المتدرب آثار مرور التيار الكهربائي في جسم الإنسان.</li><li>أن يعدد المتدرب الحالات الناجمة عن مرور التيار الكهربائي إلى الأرض عبر جسم الإنسان.</li></ol>`},
  {err:'الأهداف 6–8 (ص 76) تكرار للأهداف 1–3 بألفاظ متقاربة: الهدف 7 يطابق الهدف 2 حرفياً.'},
  {h:'تمهيد',ref:'ص 77',html:`<p>أثناء عمل الإنسان على الأجهزة الكهربائية المختلفة، يحتمل تعرضه للخطر الكهربائي الناجم عن أسباب عدة، وللحد من هذا الخطر يجب التعرف على مكامنه، واتخاذ التدابير الوقائية اللازمة، لضمان الاستخدام الآمن لهذه الطاقة الهامة في حياتنا اليومية.</p>
   <p>وهناك مخاطر عدة تنشأ في المراحل المختلفة بدءاً <b>بالتصميم</b> ثم <b>التنفيذ</b> وانتهاءً <b>بالاستخدام</b>، ومنها ما يلي:</p>`},
  {h:'5-1 أخطاء في مرحلة التصميم',ref:'ص 77',html:`<ul><li>عدم قيام مهندس كهرباء متخصص بإعداد التصميم اللازم للأعمال الكهربائية.</li><li>عدم ملاءمة قواطع الحماية مع مقاطع الأسلاك والكيابل وشدة التيار المار بها.</li><li>عدم مناسبة وسيلة الحماية المستخدمة مع المكان الذي ستركب فيه، كعدم استخدام قواطع مزودة بحماية ضد تيار التسرب الأرضي ${lt('(E.L.C.B)')} للمآخذ الكهربائية في الحمامات والمطابخ والأماكن المعرضة للرطوبة والماء.</li><li>عدم توازن الأحمال على الأطوار الثلاثة.</li><li>عدم اختيار الأماكن المناسبة لوضع لوحات التوزيع الكهربائية، وكذلك المآخذ والأعداد المناسبة لكل دائرة.</li><li>نقص عدد دوائر المآخذ الكهربائية مما يضطر المستهلك إلى استخدام مأخذ واحد لتوصيل عدة أجهزة عليه، أو اللجوء إلى التمديدات الخارجية الظاهرة.</li><li>عدم وجود موصل التأريض في الدوائر الكهربائية، وكذلك الأراضي العامة للمبنى.</li><li>عدم وجود نظام لمانعات الصواعق في المناطق المعرضة لذلك.</li></ul>`},
  {h:'5-2 أخطاء في مرحلة التنفيذ',ref:'ص 77–78',html:`<ul><li>عدم وجود مهندس كهربائي يشرف على تنفيذ الأعمال الكهربائية، وعدم تنفيذ تلك الأعمال من قبل فنيين متخصصين ذوي خبرة في هذا المجال.</li><li>عدم التقيد بالمخططات والرسومات الكهربائية أثناء التنفيذ.</li><li>عدم استعمال المرابط الخاصة لتوصيل وربط الأسلاك ببعضها.</li><li>عدم ربط موصلات التأريض بمرابطها المخصصة في الأجهزة الكهربائية والمآخذ والمفاتيح.</li><li>زيادة عدد الأسلاك في الماسورة الواحدة عن الحد المسموح به.</li><li>ربط موصل الطور بقاعدة اللمبة وخط التعادل بمفتاح الإنارة.</li><li>عدم إحكام ربط الأسلاك والكيابل بقواطع الحماية بصورة جيدة، مما ينتج عنه شرارة كهربائية تتسبب في تلف القاطع وحدوث حرائق.</li><li>عدم إبعاد التمديدات الكهربائية عن تمديدات المياه والغاز.</li><li>عدم المحافظة على استمرارية موصل سلك التأريض.</li></ul>`},
  {note:TIP+'في البند «ربط موصل الطور بقاعدة اللمبة وخط التعادل بمفتاح الإنارة» يبقى جسم القاعدة متصلاً بالطور حتى والمفتاح مفتوح؛ فمن يغيّر اللمبة وهي «مطفأة» قد يلمس الطور. الصواب أن يقطع المفتاح الطور.'},
  {h:'5-3 أخطاء في مرحلة الاستخدام',ref:'ص 78',html:`<p><b>أ- سوء الاستخدام:</b></p><ul><li>توصيل عدة أجهزة كهربائية بمقبس واحد في نفس الوقت.</li><li>لمس الأجهزة والمفاتيح الكهربائية والأيدي مبتلة بالماء، أو تشغيل الأجهزة مع الوقوف على أرض رطبة.</li><li>اختيار أجهزة كهربائية غير جيدة.</li><li>نزع القابس من المقبس بعنف.</li><li>استخدام التوصيلات الخارجية الظاهرة، وكذلك غير المباشرة للأجهزة الكهربائية.</li><li>عدم وضع وسيلة حماية مناسبة للمقابس الكهربائية لحماية الأطفال من العبث بها.</li><li>عدم توصيل سلك التأريض للأجهزة بصورة جيدة.</li><li>تمديد الأسلاك والكابلات تحت السجاد أو قرب النوافذ والمقاعد مما يعرضها للاهتراء وحدوث القصر.</li></ul>
   <p><b>ب- إهمال الصيانة:</b></p><ul><li>عدم إجراء الكشف والاختبار الدوري على التمديدات والأجهزة الكهربائية.</li><li>عدم تنظيف وصيانة الأجهزة والمواد الكهربائية.</li><li>عدم فصل التيار الكهربائي أثناء إجراء أعمال الصيانة والإصلاح.</li><li>عدم استبدال وسيلة القطع والوصل (الحماية) عند ملاحظة خروج شرر منها أثناء عملها.</li><li>عدم مراجعة الأحمال الكهربائية والتأكد من ملاءمة القواطع والأسلاك.</li><li>عدم إحكام ربط نهاية الأسلاك بمآخذ التيار أو المفاتيح أو القواطع مما يسبب حدوث شرر يؤدي لتلفها.</li></ul>`},
  {note:TIP+'خطأ التأريض يتكرر في المراحل الثلاث بصور مختلفة: غياب موصل التأريض في <b>التصميم</b>، وعدم ربطه بمرابطه أو انقطاع استمراريته في <b>التنفيذ</b>، وسوء توصيله للأجهزة في <b>الاستخدام</b>. جرّب نشاط الفرز في تبويب «المختبر».'},
  {h:'5-4 أسباب الإصابة بالتيار الكهربائي',ref:'ص 79–80',html:`<p><b>أ- ملامسة التوصيلات الكهربائية:</b> إن التوصيلات الكهربائية هي جميع النواقل للتيار الكهربائي، حيث يمكن أن يحدث اللمس بصورة مباشرة باليد (الشكل 5-1)، أو بأحد أجزاء الجسم، أو بصورة غير مباشرة عن طريق التفريغ الكهربائي.</p>`},
  {fig:'(5-1)',ref:'ص 79',caption:'ملامسة التوصيلات الكهربائية مباشرة باليدين — رسم مبسّط',draw:()=>box(fig51(),360)},
  {html:`<p><b>ب- ملامسة الأجزاء الناقلة، وغير الحاملة للتيار:</b> وهي أجزاء المعدات والتجهيزات التي ليست تحت التوتر في حالتها الطبيعية، ولكنها يمكن أن تنقل التيار الكهربائي إذا ما وقعت تحت التوتر نتيجة عطل كهربائي ما (مثال: الهياكل المعدنية للتجهيزات والمحركات والمحولات… إلخ لدى حدوث انهيار العازل الكهربائي أو وقوع الموصل الكهربائي مباشرة عليها) (الشكل 5-2).</p>`},
  {fig:'(5-2)',ref:'ص 79',caption:'لمس هيكل معدني لمحرك وقع تحت التوتر مع الوقوف على الأرض — رسم مبسّط',draw:()=>box(fig52(),380)},
  {html:`<p><b>ج- حدوث القوس الكهربائي:</b> ويظهر عبر حدوث دائرة قصر، أو عند الفصل الخاطئ لقواطع السكين ذات الجهد العالي أو المنخفض، حيث يرافق ظهور القوس انتشار كمية كبيرة من الحرارة تؤدي أحياناً إلى العمى والحروق، وحدوث الحرائق، أو السقوط المفاجئ من الأماكن العالية (الشكل 5-3).</p>`},
  {fig:'(5-3)',ref:'ص 80',caption:'القوس الكهربائي بين موصلات، وعامل يسقط بسببه — رسم توضيحي مبسّط (الأصل صور فوتوغرافية ورسم ملوّن)',draw:()=>box(fig53(),420)},
  {html:`<p><b>د- وقوع التجهيزات ذات الجهد المنخفض تحت أثر الجهد العالي:</b> وذلك نتيجة حدوث قصر بين ملفات الجهد العالي وملفات الجهد المنخفض (في المحولات مثلاً)، أو نتيجة ظهور توترات فجائية في الشبكة، حيث يؤدي ذلك لارتفاع الجهد في التجهيزات المنخفضة الجهد مشكلاً خطراً على الأشخاص العاملين عليها.</p>
   <p><b>هـ- آثار الكهرباء الساكنة:</b> والتي تتولد من تراكم شحنات على سطح المادة المكهربة نتيجة لتحريك أو سحب المواد أو الاتصال أو الانفصال، وتفرغ شحنتها دفعة واحدة محدثة شرارة كهربائية تتناسب وقيمة هذه الشحنة، مما يسبب الانفجار إذا كانت هناك غازات أو أبخرة، وكذلك الصعقة الكهربائية.</p>`},
  {err:'ترقيم عناوين هذه الوحدة في الكتاب مضطرب: 5-1، 5-2، 5-3 (الاستخدام)، 5-4 (أسباب الإصابة)، ثم يعود 5-3 (الآثار) و5-4 (الحالات الناجمة)، ثم 5-5، ثم 5-8 (الإغاثة) و5-7 (الوقاية) و5-8 مرة ثانية (Lock-out)، ولا يوجد 5-6. أبقينا الأرقام المطبوعة في العناوين لتسهل مطابقتها مع الكتاب.'}
 ],
 lab:(el)=>lab1(el),
 quiz:[
  {q:'أيٌّ مما يلي من أخطاء مرحلة <b>التصميم</b>؟',o:['عدم توازن الأحمال على الأطوار الثلاثة','عدم التقيد بالمخططات أثناء التنفيذ','نزع القابس من المقبس بعنف','عدم تنظيف الأجهزة وصيانتها'],c:0,e:'عدم توازن الأحمال على الأطوار الثلاثة من أخطاء التصميم (ص 77). والباقية من التنفيذ والاستخدام.'},
  {q:'«ربط موصل الطور بقاعدة اللمبة وخط التعادل بمفتاح الإنارة» من أخطاء أي مرحلة؟',o:['التصميم','التنفيذ','سوء الاستخدام','إهمال الصيانة'],c:1,e:'من أخطاء مرحلة التنفيذ (ص 77).'},
  {q:'إلى أي قسمين يقسم الكتاب أخطاء مرحلة الاستخدام؟',o:['أخطاء المهندس وأخطاء الفني','سوء الاستخدام وإهمال الصيانة','الأخطاء الداخلية والخارجية','الجهد المنخفض والجهد العالي'],c:1,e:'أ- سوء الاستخدام، ب- إهمال الصيانة (ص 78).'},
  {q:'عامل لمس هيكل محرك معدني تكهرب بسبب انهيار العازل. ما سبب الإصابة حسب الكتاب؟',o:['ملامسة التوصيلات الكهربائية','ملامسة الأجزاء الناقلة وغير الحاملة للتيار','الكهرباء الساكنة','وقوع الجهد المنخفض تحت أثر الجهد العالي'],c:1,e:'الهياكل المعدنية ليست تحت التوتر في حالتها الطبيعية لكنها تنقل التيار إذا وقعت تحت التوتر بعطل (ص 79، الشكل 5-2).'},
  {q:'ما الذي قد يسببه القوس الكهربائي حسب الكتاب؟',o:['العمى والحروق والحرائق والسقوط المفاجئ من الأماكن العالية','زيادة مقاومة الجسم فقط','تبريد الموصلات','لا خطر منه في الجهد المنخفض'],c:0,e:'يرافق القوس انتشار حرارة كبيرة تؤدي أحياناً إلى العمى والحروق والحرائق أو السقوط المفاجئ (ص 79–80).'},
  {q:'متى تكون شرارة الكهرباء الساكنة سبباً للانفجار؟',o:['دائماً','إذا كانت هناك غازات أو أبخرة','إذا كان الجو بارداً فقط','إذا كان التيار متناوباً'],c:1,e:'تفرغ الشحنة دفعة واحدة بشرارة «مما يسبب الانفجار إذا كانت هناك غازات أو أبخرة» (ص 80).'}
 ]
});

/* =====================================================================
   LESSON 2 — آثار التيار وعوامله (ص 81–85)
   ===================================================================== */
/* table p.83: [from mA, to mA, effect] */
const ZT=[[0,1,'لا يتأثر.'],[1,8,'التقلص غير المؤلم للعضلات، ويمكن التخلص من مصدر التيار المسبب للصدمة من قبل الشخص المصاب ذاته.'],[8,15,'التقلص مؤلم ولكن التحكم في العضلات ما يزال موجوداً، ويمكن التخلص بدون مساعدة خارجية.'],[15,20,'يشتد الألم، ويفقد المصاب التحكم في العضلات، ويحتاج لمساعدة خارجية.'],[20,50,'يصبح الألم شديداً، ويكون تقلص العضلات شديداً، والتنفس صعب جداً.'],[50,100,'يحدث اختلال في وظيفة القلب، يمكن أن يؤدي إلى الوفاة لدى بعض المصابين.'],[100,200,'توقف القلب عن العمل، والمساعدة الطبية لا تجدي غالباً.'],[200,Infinity,'حروق شديدة، وتقلص تام لعضلة القلب.']];
const zLbl=z=>z[0]===0?'أقل من 1':z[1]===Infinity?'أكبر من 200':`من ${z[0]} إلى ${z[1]}`;
const zoneIdx=mA=>{for(let i=0;i<ZT.length;i++)if(mA<ZT[i][1])return i;return ZT.length-1};
const zoneTable=hi=>`<table class="tt s5-zone"><thead><tr><th>قيمة التيار (مللي أمبير)</th><th>تأثير التيار على جسم الإنسان</th></tr></thead><tbody>${ZT.map((z,i)=>`<tr class="${i===hi?'hi':''}"><td style="white-space:nowrap">${zLbl(z)}</td><td style="text-align:right">${z[2]}</td></tr>`).join('')}</tbody></table>`;
/* figure 5-4: ruler 1..100 mA */
const R54=[1,5,10,20,30,40,50,60,70,80,90,100];
const r54y=(mA,y0,dy)=>{if(mA<=1)return y0;if(mA>=100)return y0+dy*11;for(let i=0;i<11;i++)if(mA<=R54[i+1])return y0+dy*(i+(mA-R54[i])/(R54[i+1]-R54[i]));return y0+dy*11};
function fig54(mA){const y0=34,dy=21,X=150;let s=`<svg viewBox="0 0 360 300" role="img" aria-label="مدى تحمل جسم الإنسان للتيار بالمللي أمبير">`;
  s+=tl(12,16,'Range of body tolerance',{a:'start',st:'fill:var(--stop)'})+tl(X+16,30,'mA',{m:1,a:'start'});
  s+=`<path d="M${X} ${y0}V${y0+dy*11}" style="stroke:var(--fg);stroke-width:2"/>`;
  R54.forEach((v,i)=>{const y=y0+dy*i;s+=`<path d="M${X-6} ${y}H${X}" style="stroke:var(--fg)"/>`+tl(X-10,y+4,String(v),{a:'end',m:1})});
  const BR=[[1,5,'Can feel it','يُحَس به'],[5,10,"Can't let go",'لا يستطيع الإفلات'],[10,50,'Increasing pain; breathing may become difficult','ألم متزايد؛ قد يصعب التنفس'],[50,100,'Probably fatal','مميت غالباً']];
  BR.forEach(([a,b,en,ar],k)=>{const ya=r54y(a,y0,dy)+2,yb=r54y(b,y0,dy)-2,ym=(ya+yb)/2,hi=mA!=null&&mA>=a&&(mA<b||(k===3&&mA>=100));
    const c=['var(--muted)','var(--live)','var(--stop)','var(--stop)'][k];
    s+=`<path d="M${X+8} ${ya}h6V${yb}h-6M${X+14} ${ym}h6" style="fill:none;stroke:${c};stroke-width:${hi?3:1.6}"/>`;
    s+=`<path d="M20 ${ym}L${X-30} ${ya}L${X-30} ${yb}Z" style="fill:${c};opacity:${hi?.35:.12}"/>`;
    s+=tl(X+24,ym-1,en.length>20?'Increasing pain;':en,{a:'start',st:`font-size:10px;fill:${c}`});if(en.length>20)s+=tl(X+24,ym+11,'breathing may become difficult',{a:'start',st:`font-size:10px;fill:${c}`});
    s+=ta(X+24,ym+(en.length>20?25:13),ar,{a:'end',m:1})});
  if(mA!=null){const y=r54y(Math.max(mA,0.5),y0,dy);s+=`<path d="M${X-40} ${y}H${X}" style="stroke:var(--blue);stroke-width:3"/><circle cx="${X}" cy="${y}" r="5" style="fill:var(--blue)"/>`+(mA>100?tl(X-44,y0+dy*11+18,'> 100 mA',{a:'start',st:'fill:var(--blue)'}):'')}
  return s+'</svg>'}
/* body (front view): person's right = viewer's left */
const BODY={hd:[150,42],rh:[78,196],lh:[222,196],rf:[124,312],lf:[176,312],ht:[163,112]};
const PATHS={
 rf:{l:'يد يمنى – قدمين',p:6.7,d:'M78 196L112 82L150 104L152 196L124 312M152 196L176 312',src:'rh',gnd:['rf','lf']},
 lf:{l:'يد يسرى – قدمين',p:3.7,d:'M222 196L188 82L163 112L152 196L124 312M152 196L176 312',src:'lh',gnd:['rf','lf']},
 hh:{l:'يد – يد',p:3.2,d:'M78 196L112 82L150 98L188 82L222 196',src:'rh',gnd:['lh']},
 ff:{l:'قدم – قدم',p:0.4,d:'M124 312L134 200L152 206L166 200L176 312',src:'rf',gnd:['lf']}};
function bodySVG(pk,on,off){const P=PATHS[pk];let s=`<svg viewBox="0 0 300 350" role="img" aria-label="جسم الإنسان ومسار التيار">`;
  const st='stroke:var(--fg);stroke-width:2;fill:var(--surface-2)';
  s+=`<circle cx="150" cy="42" r="24" style="${st}"/><path d="M114 70H186L190 200H110Z" style="${st}"/><path d="M114 72L74 196L84 200L120 110M186 72L226 196L216 200L180 110" style="${st}"/><path d="M118 198L118 314H134L148 206L152 206L166 314H182L182 198Z" style="${st}"/>`;
  s+=`<circle cx="163" cy="112" r="10" style="fill:var(--stop-soft);stroke:var(--stop);stroke-width:2"/>`;
  s+=`<path d="${P.d}" style="fill:none;stroke:${on?'var(--live)':'var(--muted)'};stroke-width:${on?6:4};stroke-linejoin:round;stroke-dasharray:10 7;stroke-dashoffset:${(-off).toFixed(1)};opacity:${on?1:.55}"/>`;
  const S=BODY[P.src];s+=`<circle cx="${S[0]}" cy="${S[1]}" r="9" style="fill:var(--live);stroke:var(--fg);stroke-width:1.5"/>`;
  P.gnd.forEach(k=>{const G=BODY[k];s+=earth(G[0],G[1]+2,1)});
  s+=ta(S[0]+(S[0]<150?-6:6),S[1]+(P.src[1]==='f'?-14:24),'المصدر',{a:S[0]<150?'start':'end',m:1});
  s+=ta(60,30,'يمنى',{m:1})+ta(240,30,'يسرى',{m:1})+ta(180,116,'القلب',{a:'end',st:'font-size:11px;fill:var(--stop)'});
  return s+'</svg>'}

function lab2(el){addCss();
  const w={U:220,mode:'dry',Rd:3000,Rm:500,pk:'rf',T:1,seen:{},touched:0,maxI:0};let on=false,t=0,off=0;
  el.innerHTML=`<div class="grid">
   <div class="panel c12"><h2>مختبر جسم الإنسان <small>مبني على مقاومة الجسم ص 81، والجدول ص 83، والشكل (5-4) ص 82، والمسارات ص 85 والشكل (5-5)</small></h2>
    <p class="sub">اختر الجهد الذي يلمسه الشخص، وحالة جلده، ومسار التيار في جسمه، ومدة التلامس، ثم اضغط «المس». يحسب المختبر التيار بقانون أوم \\(I_h=U/R_h\\) (وهو صيغة أخرى للقانون \\(U_t=I_h\\cdot R_h\\) ص 88) ويقرأ أثره من الجدول ص 83.</p>
    <div class="wrap-in" style="align-items:flex-end">
     ${rangeHTML('uu','الجهد الذي يلمسه الشخص U',0,400,1,220,'V')}
     <div><div class="sub">جهود من الكتاب</div>${segHTML('up',[[12,'12 V (آمن، ص 84)'],[50,'50 V (حد جهد اللمس، ص 84)'],[220,'220 V'],[380,'380 V (ص 92)']],220)}</div>
    </div>
    <div class="wrap-in" style="align-items:flex-end">
     <div><div class="sub">مقاومة جسم الإنسان (ص 81)</div>${segHTML('md',[['dry','جلد جاف ونظيف وغير ممزق: 3000–100000 Ω'],['min','القيمة الدنيا: 300–500 Ω']],'dry')}</div>
     <div id="rbox" style="flex:1 1 220px"></div>
    </div>
    <div class="wrap-in" style="align-items:flex-end">
     <div><div class="sub">مسار التيار في الجسم (ص 85)</div>${segHTML('pk',Object.entries(PATHS).map(([k,v])=>[k,v.l]),'rf')}</div>
     ${rangeHTML('tt','مدة التلامس',0.1,5,0.1,1,'s')}
     <div class="pbs">${pbHTML('touch','red','المس','المس الآن')}</div>
    </div>
    <div class="wrap-in" style="padding-top:0"><div class="reads" style="margin-inline-start:0">
     <div class="read"><span>مقاومة الجسم R<sub>h</sub></span><b id="rR"></b></div><div class="read"><span>التيار في الجسم I<sub>h</sub></span><b id="rI"></b></div>
     <div class="read"><span>نسبة ما يمر في القلب</span><b id="rP"></b></div><div class="read"><span>التيار المار في القلب</span><b id="rH"></b></div><div class="read"><span>زمن التلامس</span><b id="rT">0.0 s</b></div></div></div>
    <div class="callout" id="say"></div></div>
   <div class="panel c5"><h2>الجسم ومسار التيار <small>الشكل (5-5) ص 85</small></h2><div class="svgbox" id="bv" style="max-width:300px;margin-inline:auto"></div>
    <p class="sub">الدائرة الحمراء على الصدر = القلب (في الجهة اليسرى من الجسم). كلمتا «يمنى/يسرى» بالنسبة إلى الشخص المرسوم.</p></div>
   <div class="panel c7"><h2>مدى تحمل الجسم <small>الشكل (5-4) ص 82</small></h2><div class="svgbox" id="rv" style="max-width:360px;margin-inline:auto"></div>
    <p class="sub">حدود الشكل (1، 5، 10، 50، 100) تختلف عن حدود الجدول، فهما مصدران مختلفان. المختبر يحكم بالجدول.</p></div>
   <div class="panel c12"><h2>تأثير شدة التيار <small>الجدول ص 83</small></h2><div class="tablebox" id="zt"></div></div>
   <div class="panel c12"><h2>التجربة خطوة بخطوة</h2><ol class="steps" id="gs"></ol>
    ${tries(['اجعل الجهد 12 V ثم 50 V: ما الصف الذي يقع فيه التيار؟','بجهد 220 V قارن بين الجلد الجاف (3000 Ω) والقيمة الدنيا (500 Ω).','بدّل المسار وراقب التيار المار في القلب: أي مسار أخطر حسب أرقام الكتاب؟','اجعل التيار بين 80 و90 mA (مثلاً 260 V مع 3000 Ω) والمدة 1 ثانية أو أكثر.'])}
    <div class="callout">${TIP}الكتاب لا يعطي مقاومة لكل حالة بدقة؛ فهو يذكر مدى الجلد الجاف (3000–100000 Ω عند جهد 20 V) والقيمة الدنيا (300–500 Ω) التي تهبط إليها المقاومة بزيادة الجهد ومدة مرور التيار. لذلك يترك لك المختبر اختيار القيمة داخل هذين المديين. ومع الجهود الأعلى من 20 V تهبط المقاومة الحقيقية، فالأحوط أن تختار أصغر قيمة. المختبر لا يغيّر المقاومة مع الزمن، لأن الكتاب يذكر ذلك وصفاً بلا أرقام.</div></div>
  </div>`;
  const $=s=>el.querySelector(s);B.math&&B.math(el.querySelector('.panel'));
  const R=()=>w.mode==='dry'?w.Rd:w.Rm;
  const rbox=()=>{$('#rbox').innerHTML=w.mode==='dry'?rangeHTML('rd','اختر مقاومة الجلد الجاف',3000,100000,500,w.Rd,'Ω'):rangeHTML('rm','اختر القيمة الدنيا',300,500,10,w.Rm,'Ω');
    const r=$('#rd')||$('#rm');r.addEventListener('input',e=>{if(w.mode==='dry')w.Rd=+e.target.value;else w.Rm=+e.target.value;e.target.previousElementSibling.textContent=e.target.value+' Ω';upd()})};
  const upd=()=>{const I=w.U/R()*1000,P=PATHS[w.pk],zi=zoneIdx(I),Ih=I*P.p/100;w.I=I;
    $('#rR').textContent=R()+' Ω';$('#rI').textContent=fmt(I,I<10?2:1)+' mA';$('#rP').textContent=P.p+' %';$('#rH').textContent=fmt(Ih,Ih<1?2:1)+' mA';
    $('#zt').innerHTML=zoneTable(zi);$('#rv').innerHTML=fig54(I);
    let m=`<b>${fmt(w.U,0)} V ÷ ${R()} Ω = ${fmt(I,I<10?2:1)} mA</b> — من الجدول (${zLbl(ZT[zi])}): ${ZT[zi][2]}`;
    if(w.U<=15&&w.U>0)m+=' <br>والكتاب يعدّ الجهد 12–15 فولت «لا يؤثر على الإنسان ويعتبر جهداً آمناً» (ص 84).';
    if(I>=80&&w.T>=1)m+=` <br><b style="color:var(--stop)">انتبه:</b> «إن مرور تيار قدره 80–90 مللي أمبير ولمدة 1–3 ثوانٍ يؤدي لتوقف القلب وحدوث الوفاة» (ص 84).`;
    if(I>=100)m+=' <br>والكتاب يقول: «تياراً بشدة 0.1 أمبير هو مميت في جميع الأحوال» (ص 84).';
    if(w.T>1&&I>=1)m+=' <br>كلما طالت المدة هبطت مقاومة الجلد بسبب ارتفاع حرارته وتعرقه، فيكبر التيار الحقيقي عن المحسوب هنا (ص 84).';
    m+=` <br>المسار «${P.l}»: يمر في القلب ${P.p} % من التيار الكلي = ${fmt(Ih,Ih<1?2:1)} mA.`;
    $('#say').innerHTML=m;B.math&&B.math($('#say'))};
  const drawBody=()=>{$('#bv').innerHTML=bodySVG(w.pk,on,off)};
  $('#uu').addEventListener('input',e=>{w.U=+e.target.value;$('#uuV').textContent=w.U+' V';segSet(el,'up',w.U);upd()});
  el.querySelectorAll('[data-up]').forEach(b=>b.addEventListener('click',()=>{w.U=+b.dataset.up;$('#uu').value=w.U;$('#uuV').textContent=w.U+' V';segSet(el,'up',w.U);upd()}));
  el.querySelectorAll('[data-md]').forEach(b=>b.addEventListener('click',()=>{w.mode=b.dataset.md;segSet(el,'md',w.mode);rbox();upd()}));
  el.querySelectorAll('[data-pk]').forEach(b=>b.addEventListener('click',()=>{w.pk=b.dataset.pk;w.seen[w.pk]=1;segSet(el,'pk',w.pk);drawBody();upd()}));
  $('#tt').addEventListener('input',e=>{w.T=+e.target.value;$('#ttV').textContent=w.T+' s';upd()});
  $('#touch').addEventListener('click',()=>{on=true;t=0;w.touched++;w.maxI=Math.max(w.maxI,w.I||0)});
  const gs=stepsUI($('#gs'),[
   {t:'جهد آمن',x:'اختر «12 V» مع الجلد الجاف (3000 Ω): التيار 4 mA في صف «1–8»، والكتاب يعدّ 12–15 V جهداً آمناً.',done:w=>w.U<=15&&w.U>0&&w.mode==='dry'},
   {t:'جهد المنازل والجلد الجاف',x:'اختر «220 V» واجعل المقاومة 3000 Ω: التيار 73.3 mA في صف «50–100»: اختلال في وظيفة القلب.',done:w=>w.U===220&&w.mode==='dry'&&w.Rd===3000},
   {t:'المقاومة في قيمتها الدنيا',x:'اختر «القيمة الدنيا» (500 Ω) مع 220 V: التيار 440 mA أكبر من 200: حروق شديدة وتقلص تام لعضلة القلب.',done:w=>w.mode==='min'&&w.U>=220},
   {t:'المسار',x:'جرّب المسارات الأربعة. أكبر نسبة في القلب حسب الكتاب «يد يمنى – قدمين» 6.7 %، وأصغرها «قدم – قدم» 0.4 %.',done:w=>Object.keys(w.seen).length>=3},
   {t:'المدة',x:'اجعل المدة 1 ثانية أو أكثر مع تيار 80 mA أو أكثر، ثم اضغط «المس»: يظهر تحذير الكتاب (80–90 mA لمدة 1–3 ثوانٍ).',done:w=>w.touched>0&&w.maxI>=80&&w.T>=1}
  ],()=>w);
  rbox();drawBody();upd();
  loopOn(el,dt=>{if(on){t+=dt;off+=dt*60;if(t>=w.T){on=false;t=w.T}$('#rT').textContent=fmt(t,1)+' s';drawBody()}gs.check()})}

/* examples (all added, built from book numbers) */
const zoneSteps=mA=>{const zi=zoneIdx(mA);return {t:`نقرأ الجدول (ص 83): ${fmt(mA,mA%1?1:0)} mA تقع في الصف «${zLbl(ZT[zi])}»: ${ZT[zi][2]}`,final:true}};
const exI=(o)=>({title:o.title,ref:o.ref,q:o.q,
  given:[{id:'U',label:'الجهد',sym:'U',unit:'V',value:o.U,step:'any',min:0},{id:'R',label:'مقاومة جسم الإنسان',sym:'R_h',unit:'Ω',value:o.R,step:'any',min:1}],
  solve:(g)=>{const I=B.round(g.U/g.R,4),mA=B.round(g.U/g.R*1000,1);return [
   {t:'نطبّق قانون أوم على جسم الإنسان:',f:`I_h=\\frac{U}{R_h}=\\frac{${g.U}}{${g.R}}`,v:I,unit:'A',dp:4},
   {t:'نحوّل إلى مللي أمبير (نضرب في 1000):',v:mA,unit:'mA',dp:1},zoneSteps(mA)]},note:o.note});

B.lesson({
 id:'u5-l2',unit:5,order:2,pages:'81–85',
 title:'آثار التيار الكهربائي في جسم الإنسان وعوامله',
 summary:'آثار التيار حرارية وتحليلية وبيولوجية، وشدة الإصابة تتوقف على شدة التيار، وهي بدورها تتوقف على مقاومة الجسم والجهد، ثم على مدة التأثير وتردد التيار وطريقه في الجسم.',
 stations:[
  {intro:true},

  {st:1,short:'ماهية الآثار',title:'<span class="ltr">5-3</span> آثار مرور التيار الكهربائي في جسم الإنسان — أ: ماهية الآثار',ref:'ص 81',
   q:'التيار يمر في الجسم ثانية واحدة… فما الذي يتغير فيه: الجلد فقط، أم الدم، أم القلب؟',
   art:S5.svg('جسم الإنسان وثلاثة آثار للتيار: حراري وتحليلي وبيولوجي','#F7DCC8',
     `<circle cx="180" cy="74" r="22" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M150 100h60l8 92h-76z" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round"/><path d="M150 104l-30 70M210 104l30 70M160 192l-6 70M200 192l6 70" stroke="#2C4A40" stroke-width="6" stroke-linecap="round"/>`
    +S5.tip('الأثر الحراري: الاحتراق الذي يصيب الأجزاء الخارجية من الجسم، وسخونة الأوعية الدموية مع الدم.',`<rect x="232" y="70" width="104" height="54" rx="12" fill="#FBF6EE" stroke="#E8735A" stroke-width="3"/><path d="M252 112c-10-10 0-20 4-28c4 10 12 12 8 22c6-2 6-8 6-8c6 8 2 16-4 16z" fill="#E8735A"/>`+S5.ar(304,103,'حراري',{fs:14,b:1})+`<path d="M232 110L212 150" stroke="#E8735A" stroke-width="2" stroke-dasharray="4 3"/>`)
    +S5.tip('الأثر التحليلي: تحليل الدم والسوائل الحيوية الأخرى وتخريب تركيبها الفيزيائي والكيميائي، وتخريب الأنسجة عموماً.',`<rect x="24" y="70" width="104" height="54" rx="12" fill="#FBF6EE" stroke="#2F6FD0" stroke-width="3"/><path d="M48 84c-8 12-10 18-10 22a10 10 0 0 0 20 0c0-4-2-10-10-22z" fill="#2F6FD0"/>`+S5.ar(92,103,'تحليلي',{fs:14,b:1})+`<path d="M128 110L160 150" stroke="#2F6FD0" stroke-width="2" stroke-dasharray="4 3"/>`)
    +S5.tip('الأثر البيولوجي: تهييج الأنسجة الحية مع تقلصات تشنجية غير إرادية للعضلات، بما فيها عضلات القلب والرئتين.',`<rect x="128" y="250" width="104" height="50" rx="12" fill="#FBF6EE" stroke="#12855A" stroke-width="3"/><path d="M150 268c-6-8 6-14 8-4c2-10 14-4 8 4l-8 10z" fill="#C8372D"/>`+S5.ar(198,281,'بيولوجي',{fs:14,b:1})+`<circle cx="190" cy="132" r="8" fill="#C8372D" opacity=".8"/>`)
    +S5.ar(180,34,'ثلاثة آثار في الجسم نفسه',{fs:14,b:1})),
   cap:'الآثار الثلاثة التي يذكرها الكتاب.<br><b>مرّر المؤشر على كل بطاقة (أو المسها في الجوال) لتقرأ معنى الأثر.</b>',
   side:[
    {predict:{q:'تقلص عضلات القلب والرئتين تقلصاً تشنجياً غير إرادي من أي أثر؟',opts:[
     ['الأثر الحراري',false,'الأثر الحراري احتراق وسخونة.'],
     ['الأثر البيولوجي',true,'«ويتمثل الأثر البيولوجي في تهييج الأنسجة الحية الذي يمكن أن يترافق مع تقلصات تشنجية غير إرادية للعضلات بما فيها عضلات القلب والرئتين» (ص 81).'],
     ['الأثر التحليلي',false,'التحليلي تحليل للدم والسوائل الحيوية.']]}}
   ],
   body:[
    {book:"<p><b>أ- ماهية الآثار:</b> تظهر على جسم الإنسان المصاب بمرور تيار كهربائي آثار <b>حرارية</b>، و<b>تحليلية</b>، و<b>بيولوجية</b>.</p>\n<ul><li>يتمثل <b>الأثر الحراري</b> في الاحتراق الذي يصيب الأجزاء الخارجية من الجسم، وكذلك سخونة الأوعية الدموية مع الدم… مما يؤدي لتعطل كبير في وظائف الأجهزة.</li>\n   <li>ويتمثل <b>الأثر التحليلي</b> في تحليل الدم والسوائل الحيوية الأخرى، مما يؤدي إلى تخريب تركيبها الفيزيائي والكيميائي، وفي تخريب الأنسجة عموماً.</li>\n   <li>ويتمثل <b>الأثر البيولوجي</b> في تهييج الأنسجة الحية الذي يمكن أن يترافق مع تقلصات تشنجية غير إرادية للعضلات بما فيها عضلات القلب والرئتين، وعندها تظهر اختلاطات مختلفة تؤدي لتمزق الأنسجة واختلال عمليتي التنفس ودوران الدم.</li></ul>",ref:'ص 81'},
    {title:'مختبر مصغّر: صنّف الأثر',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل وصف اضغط نوع الأثر الذي يذكره الكتاب.',cats:['حراري','تحليلي','بيولوجي'],items:[
     ['احتراق الأجزاء الخارجية من الجسم.',0,'هذا الأثر الحراري.'],
     ['تخريب التركيب الفيزيائي والكيميائي للدم.',1,'تحليل الدم والسوائل الحيوية: الأثر التحليلي.'],
     ['اختلال عمليتي التنفس ودوران الدم بعد تقلصات تشنجية.',2,'تهييج الأنسجة الحية: الأثر البيولوجي.'],
     ['سخونة الأوعية الدموية مع الدم.',0,'من الأثر الحراري.']]})}
   ]},

  {st:2,short:'مقاومة الجسم',title:'ب: مقاومة جسم الإنسان الكهربائية',ref:'ص 81',
   q:'اليد الجافة واليد المبللة تلمسان الجهد نفسه… أيهما يمر فيها تيار أكبر، ولماذا؟',
   art:S5.svg('مقطع في جلد الإنسان: البشرة والطبقة القرنية والأدمة، ومقاومة الجسم','#DDEFE6',
     S5.tip('الطبقة القرنية: الطبقات الخارجية من البشرة، صفوف من الخلايا الميتة، سمكها كبير في باطن الكف والقدم، ومقاومتها النوعية كبيرة (عازلة).',`<rect x="40" y="80" width="280" height="34" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/>`+S5.ar(180,102,'الطبقة القرنية',{fs:13,b:1}))
    +S5.tip('البشرة: الطبقة الخارجية للجلد، وتتألف من عدة طبقات.',`<rect x="40" y="114" width="280" height="40" fill="#F8E1C2" stroke="#2C4A40" stroke-width="2.5"/>`+S5.ar(180,139,'البشرة',{fs:13,b:1}))
    +S5.tip('الأدمة: الطبقة الداخلية من الجلد، نسيج حي فيه أوعية دموية وأعصاب وجذور الشعر والغدد العرقية والغدد الشحمية، ومقاومتها قليلة نسبياً.',`<rect x="40" y="154" width="280" height="70" fill="#F4D3CC" stroke="#2C4A40" stroke-width="2.5"/><path d="M70 200c20-14 40 14 60 0s40 14 60 0s40 14 60 0s30 10 40 0" fill="none" stroke="#C8372D" stroke-width="3"/>`+S5.ar(180,180,'الأدمة',{fs:13,b:1}))
    +S5.tip('جلد جاف ونظيف وغير ممزق: مقاومة الجسم من ⟦3000⟧ إلى ⟦100000⟧ أوم عند جهد ⟦20 V⟧.',`<rect x="40" y="236" width="136" height="44" rx="10" fill="#FBF6EE" stroke="#12855A" stroke-width="2.5"/>`+S5.ar(108,254,'جلد جاف',{fs:12,b:1})+S5.la(108,272,'3000–100000 Ω',{fs:11}))
    +S5.tip('القيمة الدنيا: تتناقص المقاومة بزيادة الجهد وقيمة التيار ومدة مروره حتى تصل إلى ⟦300–500⟧ أوم.',`<rect x="184" y="236" width="136" height="44" rx="10" fill="#FBF6EE" stroke="#C8372D" stroke-width="2.5"/>`+S5.ar(252,254,'القيمة الدنيا',{fs:12,b:1})+S5.la(252,272,'300–500 Ω',{fs:11}))
    +S5.ar(180,58,'كلما اخترق التيار الطبقات قلّت المقاومة',{fs:13,b:1})),
   cap:'مقطع مبسّط للجلد كما وصفه الكتاب، مع رقمي المقاومة.<br><b>مرّر المؤشر على الطبقات والرقمين (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'زاد الجهد المطبق على جسم الإنسان. ماذا يحدث لمقاومة جسمه حسب الكتاب؟',opts:[
     ['تنقص حتى تصل إلى قيمتها الدنيا (<span class="ltr">300–500</span> أوم)',true,'نص الكتاب (ص 81).'],
     ['تزيد',false,'العكس: «زيادة الجهد المطبق على جسم الإنسان» تنقص مقاومة الجلد.'],
     ['لا تتغير',false,'الكتاب يصفها بأنها «قيمة متغيرة لها علاقة غير خطية».']]}}
   ],
   body:[
    {book:"<p>إن جسم الإنسان يعتبر ناقلاً للتيار الكهربائي، مع أن بعض أنسجة الجسم تبدي مقاومة كبيرة مثل (الجلد، والعظام، والنسيج الشحمي)، فإن النسيج العضلي والدم والنخاع الشوكي والمخ تبدي مقاومة صغيرة.</p>\n<p>إن الطبقة الخارجية للجلد، والمسماة بالبشرة، تتألف من عدة طبقات بدورها، وتسمى الطبقات الخارجية منها بالطبقة القرنية، والتي تتألف من عدة صفوف من الخلايا الميتة. ويبلغ سمك هذه الطبقة في باطن الكف والقدم قيماً كبيرة، ومقاومة نوعية كبيرة (عازلة). في حين تتألف الطبقة الداخلية من الجلد والمسماة بالأدمة من نسيج حي يوجد في داخله أوعية دموية وأعصاب وجذور الشعر والغدد العرقية والغدد الشحمية، وتكون مقاومتها قليلة نسبياً.</p>\n<p>وعندما يكون الجلد جافاً ونظيفاً وغير ممزق، تكون مقاومة جسم الإنسان عند جهد <span class=\"ltr\">20 V</span> هي من <b><span class=\"ltr\">3000</span> إلى <span class=\"ltr\">100000</span> أوم</b>، وهي في الحقيقة قيمة متغيرة لها علاقة غير خطية متعلقة بحالة الجلد وعناصر الدائرة الكهربائية والعوامل الفيزيائية ووضع الوسط المحيط. وتؤثر قيمة التيار ومدة مروره خلال الجسم بشكل مباشر على قيمة المقاومة الكلية لجسم الإنسان؛ فمع زيادتها تتناقص المقاومة ويتزايد احتراق الجلد، مما يؤدي لتوسع الأوعية وزيادة كمية الدم في هذا الجزء، وبالتالي ازدياد إفرازات العرق. كذلك تؤدي زيادة الجهد المطبق على جسم الإنسان إلى نقصان مقاومة الجلد، وبالتالي إنقاص مقاومة الجسم الكلية حتى تصل إلى قيمتها الدنيا <b>(<span class=\"ltr\">300–500</span> أوم)</b>.</p>",ref:'ص 81'},
    {watch:"في وصف الأدمة يكتب الكتاب (ص 81) «والغدد الدرقية»، والصواب «الغدد العرقية» كما كتبناها؛ فالغدة الدرقية في الرقبة وليست في الجلد.",fix:true},
    {tip:"التيار المار في الجسم يُحسب بقانون أوم: \\(I_h=\\dfrac{U}{R_h}\\). فكلما قلّت المقاومة (جلد مبلل أو ممزق، أو جهد أعلى، أو مدة أطول) كبر التيار بالجهد نفسه. مثال: \\(220\\,\\text{V}\\div 3000\\,\\Omega\\approx 73\\,\\text{mA}\\)، أما \\(220\\,\\text{V}\\div 500\\,\\Omega=440\\,\\text{mA}\\).",title:'قانون أوم على جسم الإنسان'},
    {title:'مختبر مصغّر: الجهد والمقاومة والتيار',widget:(el,B)=>DCML.lab(el,B,{intro:'اختر جهداً من جهود الكتاب ومقاومة من حدود الكتاب، واقرأ التيار وأثره من جدول ص 83.',
     predict:{q:'الجهد 220 V ثابت، وهبطت مقاومة الجسم من 3000 Ω إلى 500 Ω. التيار…',opts:[['يقل',false,'المقاومة أصغر فالتيار أكبر.'],['يكبر ست مرات',true,'3000 ÷ 500 = 6؛ فالتيار يصير ستة أضعاف بالجهد نفسه.'],['لا يتغير',false,'التيار يتغير مع المقاومة حسب قانون أوم.']]},
     ins:[{k:'U',l:'الجهد الذي يلمسه الشخص',seg:[[12,'12 V'],[50,'50 V'],[220,'220 V'],[380,'380 V']],v:220},{k:'R',l:'مقاومة جسم الإنسان (حدود ص 81)',seg:[[100000,'100000 Ω'],[3000,'3000 Ω'],[500,'500 Ω'],[300,'300 Ω']],v:3000}],
     calc:(s,P,B)=>{const I=s.U/s.R*1000,zi=zoneIdx(I);
      return {facts:[['التيار في الجسم',DCML.fm(B,I,I<10?2:1)+' mA',zi>=4?'bad':'hi'],['صف الجدول (ص 83)',(z=>z[0]===0?'< 1':z[1]===Infinity?'> 200':z[0]+'–'+z[1])(ZT[zi])+' mA','']],bars:[{l:'التيار (حتى 250 mA)',v:I,max:250,txt:DCML.fm(B,I,I<10?2:1)+' mA',col:zi>=5?'--stop':zi>=3?'--live':'--blue'}],
       msg:`\\(I_h=\\dfrac{U}{R_h}=\\dfrac{${s.U}}{${s.R}}\\)، والأثر من الجدول: ${ZT[zi][2]}`,cls:zi>=5?'bad':zi>=3?'warn':''}}})},
    {watch:'<p>مدى <span class="ltr">3000–100000 Ω</span> مقيس عند <span class="ltr">20 V</span>؛ ومع الجهود الأعلى تهبط المقاومة الحقيقية. لذلك اختيار <span class="ltr">3000 Ω</span> مع <span class="ltr">220 V</span> يعطي تياراً أقل من الحقيقة غالباً.</p>'}
   ]},

  {st:3,short:'شدة التيار',title:'ج: شدة التيار الكهربائي المار في جسم الإنسان',ref:'ص <span class="ltr">82–84</span>',
   q:'مصباح بيتك يسحب تياراً أكبر بكثير مما يقتل الإنسان… فكم «مللي أمبير» يكفي؟',
   art:S5.svg('مدى تحمل جسم الإنسان للتيار بالمللي أمبير','#FBE6C4',S5.nest(fig54(null),0,14,360,300)
    +S5.hot(160,46,200,22,'من ⟦1⟧ إلى ⟦5 mA⟧: يُحَسّ به ⟦(Can feel it)⟧.')+S5.hot(160,68,200,22,'من ⟦5⟧ إلى ⟦10 mA⟧: لا يستطيع الإفلات ⟦(Can&#39;t let go)⟧.')
    +S5.hot(160,92,200,86,'من ⟦10⟧ إلى ⟦50 mA⟧: ألم متزايد، وقد يصعب التنفس.')+S5.hot(160,178,200,104,'من ⟦50⟧ إلى ⟦100 mA⟧: مميت غالباً ⟦(Probably fatal)⟧.')),
   cap:'رسم مبسّط للشكل <span class="ltr">(5-4)</span> بعباراته الإنجليزية وترجمتها.<br><b>مرّر المؤشر على المجالات الأربعة (أو المسها في الجوال) لتقرأ معناها.</b>',
   side:[
    {predict:{q:'ما أصغر تيار متناوب (60 Hz) يتحسس به جسم الإنسان؟',opts:[
     ['خمسة مللي أمبير',false,'هذا للتيار المستمر.'],
     ['مئة مللي أمبير',false,'هذا تيار مميت (ص 84).'],
     ['واحد مللي أمبير',true,'«أصغر تيار كهربائي يتحسس به جسم الإنسان هو واحد مللي أمبير للتيار المتناوب ذي تردد 60 Hz» (ص 82).']]}}
   ],
   body:[
    {book:"<p>دلت التجارب على أن أصغر تيار كهربائي يتحسس به جسم الإنسان هو <b>واحد مللي أمبير</b> للتيار المتناوب ذي تردد <span class=\"ltr\">60 Hz</span>، و<b><span class=\"ltr\">5</span> مللي أمبير</b> للتيار المستمر، حيث تؤدي التيارات الأكبر إلى تشنج العضلات وإلى الإحساس بالألم. وفي الواقع إن <b>شدة التيار هي العامل الحاسم</b> الذي يعتبر قياسياً لشدة الصدمة، وبالتالي لخطورة الإصابة. والشكل (5-4) والجدول التاليان يوضحان تأثير شدة التيار على جسم الإنسان.</p>",ref:'ص 82'},
    {book:"<p><b>جدول تأثير شدة التيار على جسم الإنسان</b> <span class=\"ref\">ص 83</span></p>\n<table class=\"tt s5-zone\"><thead><tr><th>قيمة التيار (مللي أمبير)</th><th>تأثير التيار على جسم الإنسان</th></tr></thead><tbody><tr class=\"\"><td style=\"white-space:nowrap\">أقل من 1</td><td style=\"text-align:right\">لا يتأثر.</td></tr><tr class=\"\"><td style=\"white-space:nowrap\">من 1 إلى 8</td><td style=\"text-align:right\">التقلص غير المؤلم للعضلات، ويمكن التخلص من مصدر التيار المسبب للصدمة من قبل الشخص المصاب ذاته.</td></tr><tr class=\"\"><td style=\"white-space:nowrap\">من 8 إلى 15</td><td style=\"text-align:right\">التقلص مؤلم ولكن التحكم في العضلات ما يزال موجوداً، ويمكن التخلص بدون مساعدة خارجية.</td></tr><tr class=\"\"><td style=\"white-space:nowrap\">من 15 إلى 20</td><td style=\"text-align:right\">يشتد الألم، ويفقد المصاب التحكم في العضلات، ويحتاج لمساعدة خارجية.</td></tr><tr class=\"\"><td style=\"white-space:nowrap\">من 20 إلى 50</td><td style=\"text-align:right\">يصبح الألم شديداً، ويكون تقلص العضلات شديداً، والتنفس صعب جداً.</td></tr><tr class=\"\"><td style=\"white-space:nowrap\">من 50 إلى 100</td><td style=\"text-align:right\">يحدث اختلال في وظيفة القلب، يمكن أن يؤدي إلى الوفاة لدى بعض المصابين.</td></tr><tr class=\"\"><td style=\"white-space:nowrap\">من 100 إلى 200</td><td style=\"text-align:right\">توقف القلب عن العمل، والمساعدة الطبية لا تجدي غالباً.</td></tr><tr class=\"\"><td style=\"white-space:nowrap\">أكبر من 200</td><td style=\"text-align:right\">حروق شديدة، وتقلص تام لعضلة القلب.</td></tr></tbody></table>\n<p>إن مرور تيار قدره <b><span class=\"ltr\">80–90</span> مللي أمبير ولمدة <span class=\"ltr\">1–3</span> ثوانٍ</b> يؤدي لتوقف القلب وحدوث الوفاة، وعلى كلٍّ فإن تياراً بشدة <b><span class=\"ltr\">0.1</span> أمبير</b> هو مميت في جميع الأحوال إذا شاء الله ذلك. <span class=\"ref\">ص 84</span></p>",ref:'ص <span class="ltr">83–84</span>'},
    {watch:"حدود الشكل (5-4) (1، 5، 10، 50، 100 مللي أمبير) لا تطابق حدود الجدول ص 83 (1، 8، 15، 20، 50، 100، 200)، فهما مصدران مختلفان؛ والمختبر يعتمد الجدول. وفي ص 84 يقول الكتاب إن 0.1 أمبير (100 مللي أمبير) «مميت في جميع الأحوال»، بينما يقول الجدول عن المجال 50–100 إنه «يمكن أن يؤدي إلى الوفاة لدى بعض المصابين». والعبارة الإنجليزية تحت الشكل «مصباح 100 W يستهلك 1000 mA» تصح على جهد 100 V تقريباً؛ أما على 220 V فيستهلك نحو 455 mA.",fix:true},
    {title:'مختبر مصغّر: اقرأ أثر التيار من الجدول',widget:(el,B)=>DCML.lab(el,B,{intro:'حرّك شدة التيار (أرقام تختارها أنت) واقرأ صف الجدول والموضع على الشكل <span class="ltr">(5-4)</span>.',
     ins:[{k:'I',l:'شدة التيار في الجسم',u:'mA',min:0,max:250,step:1,v:12,dp:0}],
     calc:(s)=>{const zi=zoneIdx(s.I);return {facts:[['صف الجدول',(z=>z[0]===0?'< 1':z[1]===Infinity?'> 200':z[0]+'–'+z[1])(ZT[zi])+' mA',zi>=5?'bad':'hi']],pic:fig54(Math.min(s.I,120)),
      msg:`<b>${ZT[zi][2]}</b>`+(s.I>=80&&s.I<=90?'<br>والكتاب: مرور <span class="ltr">80–90 mA</span> لمدة <span class="ltr">1–3</span> ثوانٍ يؤدي لتوقف القلب (ص 84).':'')+(s.I>=100?'<br>والكتاب: تيار بشدة 0.1 A (100 mA) مميت في جميع الأحوال (ص 84).':''),cls:zi>=5?'bad':zi>=3?'warn':''}}})}
   ]},

  {st:4,short:'مدة التأثير',title:'د: مدة تأثير التيار الكهربائي',ref:'ص 84',
   q:'التيار نفسه لثانية أو لعشر ثوانٍ… هل يتغير الخطر؟',
   art:S5.svg('مقاومة الجلد عالية في البداية وتتناقص مع الزمن','#E6E2F8',
     S5.tip('الزمن: كلما طال مرور التيار ارتفعت حرارة الجلد وتعرّق وتأين.',`<circle cx="90" cy="110" r="46" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M90 110V78M90 110l22 12" stroke="#2C4A40" stroke-width="4" stroke-linecap="round"/>`+S5.ar(90,180,'مرور الزمن',{fs:13,b:1}))
    +S5.tip('مقاومة الجلد: عالية في البداية وتتناقص مع مرور الزمن، فيكبر التيار.',`<path d="M170 80V230H320" fill="none" stroke="#2C4A40" stroke-width="2.5"/><path d="M176 92C210 96 230 150 260 190S300 214 316 216" fill="none" stroke="#12855A" stroke-width="4"/>`+S5.ar(250,80,'مقاومة الجلد',{fs:12,b:1})+S5.ar(245,252,'الزمن',{fs:12}))
    +S5.tip('العرق: مرور التيار يؤدي لتعرق الجلد وتأينه، مما يخفض مقاومته.',[0,1,2].map(k=>`<path d="M${70+k*20} ${226+k*6}c-5 8-6 12-6 14a6 6 0 0 0 12 0c0-2-1-6-6-14z" fill="#2F6FD0"/>`).join(''))
    +S5.ar(180,290,'كلما طالت المدة صار الخطر أكبر',{fs:13,b:1})),
   cap:'رسم وصفي بلا أرقام (الكتاب يصف التناقص دون قيم).<br><b>مرّر المؤشر على الساعة والمنحنى وقطرات العرق (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'لماذا قد لا يموت مصاب بتيار يزيد على 10 A في شبكة ضغط عالٍ؟',opts:[
     ['لأن التيار الكبير لا يؤذي',false,'الكتاب يقول إنه يؤدي «لحروق خطيرة قد تؤدي للوفاة».'],
     ['لقصر زمن تأثيره: ردود الفعل الانعكاسية تبعده فوراً فينطفئ القوس',true,'«ولكنها يمكن ألا تؤدي إلى الوفاة نظراً لقصر زمن تأثيرها» (ص 84).'],
     ['لأن مقاومة الجسم في الضغط العالي كبيرة جداً',false,'الكتاب لا يذكر ذلك؛ بل يقول إن المقاومة تتناقص بازدياد الجهد.']]}}
   ],
   body:[
    {book:"<p>تتعلق مقاومة جلد الإنسان بزمن التأثير الكهربائي المار عليه، فهي <b>عالية في البداية وتتناقص مع مرور الزمن</b>، إذ يؤدي مرور التيار لارتفاع حرارة الجلد وتعرقه وتأينه، مما يؤدي لحرق الجلد وانخفاض مقاومته. وهذه الظواهر يمكن ملاحظتها في شبكات الجهد المنخفض، أما في شبكات الضغط العالي فإن معظم الحوادث تتم قبل لمس المصاب لموصلات التيار، حيث يقع المصاب تحت تأثير الجهد العالي نتيجة التفريغ وظهور القوس الكهربائي، ومع ذلك فإن ردود الفعل الانعكاسية لدى المصاب تبعده فوراً نتيجة تأثير المراكز العصبية، مما يؤدي لانطفاء القوس الكهربائي. والتيارات المارة يمكن أن تكون كبيرة (تزيد عن <span class=\"ltr\">10 A</span>) ولكنها يمكن ألا تؤدي إلى الوفاة نظراً لقصر زمن تأثيرها، مع أنها تؤدي لحروق خطيرة قد تؤدي للوفاة.</p>",ref:'ص 84'},
    {title:'مختبر مصغّر: جهد منخفض أم ضغط عالٍ؟',widget:(el,B)=>DCML.cases(el,B,{intro:'موقفان من الفقرة نفسها؛ اختر وصف الكتاب.',cases:[
     {q:'شخص بقيت يده ملتصقة بموصل في شبكة جهد منخفض عدة ثوانٍ. ماذا يحدث لمقاومة جلده؟',opts:[['تبقى كما هي',false,'الكتاب: «عالية في البداية وتتناقص مع مرور الزمن».'],['تتناقص مع الزمن فيكبر التيار',true,'ارتفاع حرارة الجلد وتعرقه وتأينه يخفض مقاومته (ص 84).']]},
     {q:'عامل اقترب من موصل ضغط عالٍ فظهر قوس كهربائي قبل أن يلمسه. ماذا يحدث غالباً حسب الكتاب؟',opts:[['يلتصق بالموصل حتى يُفصل التيار',false,'هذا وصف أقرب للجهد المنخفض.'],['ردود الفعل الانعكاسية تبعده فوراً فينطفئ القوس، لكن قد تبقى حروق خطيرة',true,'نص الكتاب (ص 84).']]}]})}
   ]},

  {st:5,short:'تأثير الجهد',title:'هـ: تأثير الجهد الكهربائي',ref:'ص 84',
   q:'بطارية سيارة لا تؤذيك إذا لمستها… فأين يبدأ الجهد الخطر؟',
   art:S5.svg('مقياس جهد: الجهد الآمن وجهد اللمس المسموح','#DDEFE6',
     `<rect x="150" y="50" width="60" height="230" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/>`
    +S5.tip('الجهد الآمن: ⟦12–15⟧ فولت لا يؤثر على الإنسان ويعتبر جهداً آمناً.',`<rect x="150" y="236" width="60" height="44" rx="10" fill="#12855A"/>`+S5.la(180,264,'12–15 V',{fs:12,b:1,c:'#FBF6EE'})+S5.ar(280,264,'جهد آمن',{fs:14,b:1}))
    +S5.tip('جهود اللمس المسموح بها: بين ⟦40–50⟧ فولت ضمن شروط معينة.',`<rect x="150" y="178" width="60" height="40" fill="#F2C14E"/>`+S5.la(180,203,'40–50 V',{fs:12,b:1})+S5.ar(282,196,'جهد اللمس المسموح',{fs:13,b:1})+S5.ar(282,214,'(ضمن شروط معينة)',{fs:11}))
    +S5.tip('فوق ذلك: تتناقص مقاومة الجسم بازدياد الجهد، فيزداد الخطر.',`<rect x="150" y="50" width="60" height="110" rx="10" fill="#F4D3CC"/><path d="M180 70v60m-10-50l10-12l10 12" fill="none" stroke="#C8372D" stroke-width="4"/>`+S5.ar(84,104,'خطر يزداد',{fs:14,b:1,c:'#C8372D'}))),
   cap:'المقياس للتوضيح وليس بنسب حقيقية؛ الأرقام من الكتاب.<br><b>مرّر المؤشر على المناطق الثلاث (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'ما الجهد الذي يعدّه الكتاب «جهداً آمناً»؟',opts:[
     ['220 فولت',false,'هذا جهد المنازل، وهو خطر.'],
     ['<span class="ltr">40–50</span> فولت',false,'هذه «جهود اللمس المسموح بها ضمن شروط معينة»، لا الجهد الآمن.'],
     ['<span class="ltr">12–15</span> فولت',true,'«الجهد <span class="ltr">12–15</span> فولت لا يؤثر على الإنسان ويعتبر جهداً آمناً» (ص 84).']]}}
   ],
   body:[
    {book:"<p>وجدنا أعلاه أن مقاومة جسم الإنسان تتناقص بازدياد الجهد الكهربائي المطبق عليه، وقد دلت التجارب على أن الجهد <b><span class=\"ltr\">12–15</span> فولت</b> لا يؤثر على الإنسان ويعتبر <b>جهداً آمناً</b>. وتتراوح جهود اللمس المسموح بها بين <b>(<span class=\"ltr\">40–50</span>) فولت</b> ضمن شروط معينة.</p>",ref:'ص 84'},
    {tip:'<p>الجهد يؤثر بطريقتين معاً: هو الذي «يدفع» التيار في الجسم (قانون أوم)، وزيادته أيضاً <b>تنقص مقاومة الجلد</b> كما قرأت في المحطة الثانية. فالتيار يكبر أسرع من الجهد.</p>',title:'أثر مضاعف'},
    {title:'تحقق سريع: الجهد',widget:(el,B)=>DCML.tf(el,B,{intro:'احكم على كل عبارة بحسب نص الكتاب.',items:[
     ['تتناقص مقاومة جسم الإنسان بازدياد الجهد المطبق عليه.',true,'«وجدنا أعلاه أن مقاومة جسم الإنسان تتناقص بازدياد الجهد الكهربائي المطبق عليه» (ص 84).'],
     ['جهد اللمس المسموح به <span class="ltr">40–50</span> فولت في كل الظروف.',false,'الكتاب يقول: «ضمن شروط معينة».'],
     ['جهد 12 فولت يعدّه الكتاب جهداً آمناً.',true,'يقع ضمن <span class="ltr">12–15</span> فولت.']]})}
   ]},

  {st:6,short:'تردد التيار',title:'و: تأثير تردد التيار',ref:'ص <span class="ltr">84–85</span>',
   q:'لماذا يكون تيار البيت بالذات (التردد الصناعي) أخطر من التيار المستمر ومن الترددات العالية جداً؟',
   art:S5.svg('محور التردد: التيار المستمر، والتردد الصناعي، والترددات العالية جداً','#F7DCC8',
     `<path d="M30 200H330" stroke="#2C4A40" stroke-width="3"/><path d="M320 192l12 8-12 8" fill="#2C4A40"/>`
    +S5.tip('التيار المستمر: أقل خطراً من المتناوب ذي التردد الصناعي، للتوترات المنخفضة حتى ⟦250–300 V⟧.',`<circle cx="60" cy="200" r="12" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/>`+S5.ar(60,234,'تيار مستمر',{fs:12,b:1}))
    +S5.tip('التردد الصناعي ⟦60 Hz⟧: يحمل أكبر الخطر على جسم الإنسان؛ حركة الأيونات في الخلية عظمى عند ⟦40–60 Hz⟧.',`<path d="M120 150h80v100h-80z" fill="#F4D3CC" stroke="#C8372D" stroke-width="3" rx="10"/><path d="M128 200c8-30 16-30 24 0s16 30 24 0s16-30 20 0" fill="none" stroke="#C8372D" stroke-width="3"/>`+S5.la(160,272,'40–60 Hz',{fs:12,b:1,c:'#C8372D'})+S5.ar(160,138,'الأخطر',{fs:14,b:1,c:'#C8372D'}))
    +S5.tip('الترددات العالية جداً: يختفي الضرر عند ⟦450–500 kHz⟧، مع بقاء خطر الحريق (الحروق) عند مرور هذه التيارات.',`<circle cx="290" cy="200" r="12" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/>`+S5.la(290,234,'450–500 kHz',{fs:11,b:1})+S5.ar(290,254,'يختفي الضرر',{fs:12}))
    +S5.ar(180,60,'الخطر حسب التردد',{fs:15,b:1})+S5.ar(180,82,'(المحور للتوضيح وليس بمقياس)',{fs:11})),
   cap:'ثلاث نقاط من نص الكتاب على محور التردد.<br><b>مرّر المؤشر على النقاط الثلاث (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'عند أي تردد تكون حركة الأيونات داخل الخلية أكبر ما يمكن حسب الكتاب؟',opts:[
     ['عند <span class="ltr">40–60 Hz</span>',true,'«وتأخذ هذه الحركة… قيمتها العظمى عند التردد <span class="ltr">40–60 Hz</span>» (ص 85).'],
     ['في التيار المستمر',false,'الكتاب: تقل الحركة في التيار المستمر.'],
     ['عند <span class="ltr">450–500 kHz</span>',false,'عند ارتفاع التردد «فإن الحركة تقل».']]}}
   ],
   body:[
    {book:"<p>لقد أظهرت التجارب أن <b>التيار المستمر أقل خطراً من التيار المتناوب</b> ذي التردد الصناعي <span class=\"ltr\">60 Hz</span>، وللتوترات المنخفضة حتى <span class=\"ltr\">250–300 V</span>. ومع زيادة تردد التيار المتناوب تتناقص ممانعة جسم الإنسان (بسبب وجود مركبة سعوية) مما يؤدي لزيادة شدة التيار المار، ولكن ذلك في الواقع يبقى صحيحاً في مجال الترددات من <span class=\"ltr\">50 Hz</span> إلى <span class=\"ltr\">60 Hz</span> فقط؛ بحيث إن زيادة التردد واقعياً تتوافق مع تناقص خطورة الضرر، حيث يختفي الضرر عند تردد <span class=\"ltr\">450–500 kHz</span> (مع بقاء هذه التيارات مشكلةً خطر الحريق عند مرورها في جسم الإنسان كما يظهر عند القوس الكهربائي). وعلى كلٍّ تلعب الخصائص الفردية للإنسان دوراً أساسياً في تطور الضرر الحاصل.</p>\n<p>وهناك نظريات عديدة تفسر تأثير تردد التيار على الجسم، وأكثرها انتشاراً ومطابقة للواقع تقول بأن مرور التيار الكهربائي يؤدي إلى تحلل الأجزاء المشكلة للخلايا في الجسم وتحولها في كل خلية إلى أيونات ذات قطبية مختلفة، تتجه بالاتجاه المعاكس لقطبيها حتى وصولها لجدار الخلية، فتؤدي هذه الحركة إلى تفكك الخلية، وتظهر بشكل واضح في الخلايا العصبية. وتأخذ هذه الحركة ضمن الخلية، وبالتالي المسافة التي تقطعها الأيونات، قيمتها العظمى عند التردد <span class=\"ltr\">40–60 Hz</span>. أما عند ارتفاع التردد فإن الحركة تقل، ولا تستطيع الأيونات الانتقال من طرف إلى آخر في الخلية نفسها، وتلاحظ نفس الظاهرة عند انخفاض التردد عن القيم المذكورة أعلاه، وكذلك في التيار المستمر. إن تياراً بتردد صناعي <span class=\"ltr\">60 Hz</span> يحمل أكبر الخطر على جسم الإنسان.</p>",ref:'ص <span class="ltr">84–85</span>'},
    {watch:"يكتب الكتاب (ص 84) «تتناقص مناعة جسم الإنسان»، والمقصود «ممانعة» جسم الإنسان (معاوقته للتيار المتناوب) كما كتبناها.",fix:true},
    {title:'مختبر مصغّر: الأيونات داخل الخلية',widget:(el,B)=>DCML.lab(el,B,{intro:'اختر نوع التيار وراقب مسافة حركة الأيونات داخل الخلية كما تصفها النظرية التي يذكرها الكتاب (رسم وصفي بلا أرقام).',
     ins:[{k:'f',l:'التيار',seg:[['dc','تيار مستمر'],['lf','60 Hz (التردد الصناعي)'],['hf','<span class="ltr">450–500 kHz</span>']],v:'lf'}],
     calc:(s)=>{const a={dc:12,lf:62,hf:8}[s.f];
      const pic=`<svg viewBox="0 0 320 140" role="img" aria-label="خلية وأيونات" style="font-family:var(--font)"><ellipse cx="160" cy="70" rx="140" ry="56" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2.5"/>`+
       [-1,1].map(k=>`<circle cx="${160+k*a}" cy="${70-k*14}" r="13" fill="${k>0?'var(--stop-soft)':'var(--blue-soft)'}" stroke="var(--fg)" stroke-width="2"/><text x="${160+k*a}" y="${75-k*14}" text-anchor="middle" font-size="16" font-weight="700" fill="var(--fg)" font-family="var(--mono)">${k>0?'+':'−'}</text><path d="M160 ${70-k*14}H${160+k*(a-15)}" stroke="var(--live)" stroke-width="3" ${a>20?'':'opacity=".3"'}/>`).join('')+`</svg>`;
      return {pic,facts:[['حركة الأيونات في الخلية',s.f==='lf'?'عظمى':'قليلة',s.f==='lf'?'bad':'hi'],['الخطر على الجسم',s.f==='lf'?'الأكبر':s.f==='dc'?'أقل من المتناوب':'يختفي الضرر',s.f==='lf'?'bad':'hi']],
       msg:s.f==='lf'?'الأيونات تنتقل إلى جدار الخلية فتؤدي إلى تفككها، وخاصة في الخلايا العصبية: «إن تياراً بتردد صناعي 60 Hz يحمل أكبر الخطر على جسم الإنسان» (ص 85).':s.f==='dc'?'في التيار المستمر تقل الحركة؛ والكتاب: «التيار المستمر أقل خطراً من التيار المتناوب ذي التردد الصناعي 60 Hz» للتوترات المنخفضة حتى <span class="ltr">250–300 V</span>.':'عند ارتفاع التردد لا تستطيع الأيونات الانتقال من طرف إلى آخر في الخلية، ويختفي الضرر عند <span class="ltr">450–500 kHz</span>، لكن يبقى خطر الحريق (الحروق).',cls:s.f==='lf'?'bad':''}}})}
   ]},

  {st:7,short:'طريق التيار',title:'ز: الطريق الذي يمر فيه التيار بجسم الإنسان',ref:'ص 85',
   q:'التيار نفسه يدخل من اليد اليمنى أو من القدم… هل يهم من أين دخل؟',
   art:S5.svg('مسار التيار من اليد اليمنى إلى القدمين مروراً بالصدر','#DDEFE6',S5.nest(bodySVG('rf',true,0),60,6,240,280)
    +S5.hot(150,90,40,40,'القلب: في الجهة اليسرى من الصدر. نسبة التيار المار فيه تحدد خطورة المسار.')
    +S5.hot(66,150,40,40,'المصدر عند اليد اليمنى للشخص (يسار الرسم).')+S5.hot(140,250,80,40,'القدمان على الأرض: يخرج التيار منهما.')
    +S5.ar(180,306,'يد يمنى – قدمين: 6.7 % في القلب',{fs:13,b:1})),
   cap:'رسم مبسّط لأحد مسارات الشكل <span class="ltr">(5-5)</span>.<br><b>مرّر المؤشر على القلب والمصدر والقدمين (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'أي المسارات يعدّه الكتاب أخطرها؟',opts:[
     ['يد – يد',false,'نسبته في القلب 3.2 %.'],
     ['قدم – قدم',false,'أقلها: 0.4 %.'],
     ['يد يمنى – قدمين',true,'«وأخطر الحالات هي مرور التيار بطريق يد يمنى – قدمين» لأن 6.7 % من التيار يمر في القلب (ص 85).']]}}
   ],
   body:[
    {book:"<p>هناك طرق كثيرة يمكن أن يسلكها التيار لدى مروره بجسم الإنسان، وأكثرها مصادفة هي (الشكل 5-5): (1) يد – يد، (2) يد – قدم أو قدمين، (3) قدم – قدم، (4) رأس – يد، أو رأس – قدم، وهذه أقل الحالات حدوثاً.</p>\n<p>وأخطر الحالات هي مرور التيار بطريق <b>يد يمنى – قدمين</b>، لأن قيمة التيار المار خلال قلب الإنسان (كنسبة مئوية من قيمة التيار الكلي المار خلال الجسم) يشكل في هذا الطريق نسبة <span class=\"ltr\">6.7%</span>، في حين أنها لطريق يد يسرى – قدمين <span class=\"ltr\">3.7%</span>، وطريق يد إلى يد <span class=\"ltr\">3.2%</span>، وطريق من قدم إلى قدم <span class=\"ltr\">0.4%</span>.</p>\n<table class=\"tt\" style=\"max-width:420px;margin-inline:auto\"><thead><tr><th>المسار</th><th>نسبة التيار المار في القلب</th></tr></thead><tbody><tr><td>يد يمنى – قدمين</td><td><span class=\"ltr\">6.7 %</span></td></tr><tr><td>يد يسرى – قدمين</td><td><span class=\"ltr\">3.7 %</span></td></tr><tr><td>يد – يد</td><td><span class=\"ltr\">3.2 %</span></td></tr><tr><td>قدم – قدم</td><td><span class=\"ltr\">0.4 %</span></td></tr></tbody></table>\n<p class=\"sub\" style=\"text-align:center\">الجدول تجميع لأرقام النص في ص 85.</p>",ref:'ص 85'},
    {tip:"في الشكل (5-5) يصل التيار في (C) و(D) إلى قدم واحدة، أما النسب في النص فهي لمسار «يد – قدمين». وتختلف المراجع في أي اليدين أخطر: الكتاب يجعل «يد يمنى – قدمين» الأخطر (6.7 %)، وبعض المواصفات الحديثة (مثل IEC 60479) تجعل مسار اليد اليسرى إلى القدمين هو الأخطر لقربه من القلب. المختبر يعتمد أرقام الكتاب.",title:'يد يمنى أم يسرى؟'},
    {title:'مختبر مصغّر: كم من التيار يمر في القلب؟',widget:(el,B)=>DCML.lab(el,B,{intro:'اختر المسار، وقارن نسبة التيار المار في القلب (أرقام الكتاب ص 85).',
     ins:[{k:'p',l:'مسار التيار',seg:Object.entries(PATHS).map(([k,v])=>[k,v.l]),v:'hh'}],
     calc:(s)=>{const P=PATHS[s.p];return {pic:`<div style="max-width:220px;margin-inline:auto">${bodySVG(s.p,true,0)}</div>`,
      bars:Object.entries(PATHS).map(([k,v])=>({l:v.l,v:v.p,max:6.7,txt:v.p+' %',col:k===s.p?'--stop':'--blue'})),
      msg:`المسار «${P.l}»: يمر في القلب ${P.p} % من التيار الكلي.`+(s.p==='rf'?' هذا أخطر المسارات حسب الكتاب.':s.p==='ff'?' أقل المسارات خطراً على القلب (جهد الخطوة)، لكن المصاب قد يسقط فيتغير المسار.':''),cls:s.p==='rf'?'bad':''}}})}
   ]},

  {recap:[
   'آثار التيار في الجسم ثلاثة: حرارية، وتحليلية، وبيولوجية.',
   'مقاومة الجسم للجلد الجاف <span class="ltr">3000–100000 Ω</span> (عند 20 V)، وتهبط إلى <span class="ltr">300–500 Ω</span> بزيادة الجهد والتيار والمدة؛ والتيار في الجسم = الجهد ÷ المقاومة.',
   'شدة التيار هي العامل الحاسم: يُحس بواحد مللي أمبير (متناوب)، و<span class="ltr">80–90 mA</span> لمدة <span class="ltr">1–3</span> ثوانٍ توقف القلب، و0.1 A مميت في جميع الأحوال.',
   'الجهد <span class="ltr">12–15 V</span> آمن، والتردد الصناعي 60 Hz أخطر من المستمر ومن الترددات العالية جداً.',
   'أخطر طريق: يد يمنى – قدمين (6.7 % في القلب)، وأقلها قدم – قدم (0.4 %).']}
],
 theory:[
  {h:'5-3 آثار مرور التيار الكهربائي في جسم الإنسان',ref:'ص 81–85',html:`<p><b>أ- ماهية الآثار:</b> تظهر على جسم الإنسان المصاب بمرور تيار كهربائي آثار <b>حرارية</b>، و<b>تحليلية</b>، و<b>بيولوجية</b>.</p>
   <ul><li>يتمثل <b>الأثر الحراري</b> في الاحتراق الذي يصيب الأجزاء الخارجية من الجسم، وكذلك سخونة الأوعية الدموية مع الدم… مما يؤدي لتعطل كبير في وظائف الأجهزة.</li>
   <li>ويتمثل <b>الأثر التحليلي</b> في تحليل الدم والسوائل الحيوية الأخرى، مما يؤدي إلى تخريب تركيبها الفيزيائي والكيميائي، وفي تخريب الأنسجة عموماً.</li>
   <li>ويتمثل <b>الأثر البيولوجي</b> في تهييج الأنسجة الحية الذي يمكن أن يترافق مع تقلصات تشنجية غير إرادية للعضلات بما فيها عضلات القلب والرئتين، وعندها تظهر اختلاطات مختلفة تؤدي لتمزق الأنسجة واختلال عمليتي التنفس ودوران الدم.</li></ul>`},
  {h:'ب- مقاومة جسم الإنسان الكهربائية',ref:'ص 81',html:`<p>إن جسم الإنسان يعتبر ناقلاً للتيار الكهربائي، مع أن بعض أنسجة الجسم تبدي مقاومة كبيرة مثل (الجلد، والعظام، والنسيج الشحمي)، فإن النسيج العضلي والدم والنخاع الشوكي والمخ تبدي مقاومة صغيرة.</p>
   <p>إن الطبقة الخارجية للجلد، والمسماة بالبشرة، تتألف من عدة طبقات بدورها، وتسمى الطبقات الخارجية منها بالطبقة القرنية، والتي تتألف من عدة صفوف من الخلايا الميتة. ويبلغ سمك هذه الطبقة في باطن الكف والقدم قيماً كبيرة، ومقاومة نوعية كبيرة (عازلة). في حين تتألف الطبقة الداخلية من الجلد والمسماة بالأدمة من نسيج حي يوجد في داخله أوعية دموية وأعصاب وجذور الشعر والغدد العرقية والغدد الشحمية، وتكون مقاومتها قليلة نسبياً.</p>
   <p>وعندما يكون الجلد جافاً ونظيفاً وغير ممزق، تكون مقاومة جسم الإنسان عند جهد ${lt('20 V')} هي من <b>${lt('3000')} إلى ${lt('100000')} أوم</b>، وهي في الحقيقة قيمة متغيرة لها علاقة غير خطية متعلقة بحالة الجلد وعناصر الدائرة الكهربائية والعوامل الفيزيائية ووضع الوسط المحيط. وتؤثر قيمة التيار ومدة مروره خلال الجسم بشكل مباشر على قيمة المقاومة الكلية لجسم الإنسان؛ فمع زيادتها تتناقص المقاومة ويتزايد احتراق الجلد، مما يؤدي لتوسع الأوعية وزيادة كمية الدم في هذا الجزء، وبالتالي ازدياد إفرازات العرق. كذلك تؤدي زيادة الجهد المطبق على جسم الإنسان إلى نقصان مقاومة الجلد، وبالتالي إنقاص مقاومة الجسم الكلية حتى تصل إلى قيمتها الدنيا <b>(${lt('300–500')} أوم)</b>.</p>`},
  {err:'<span class="fixnote">في وصف الأدمة يكتب الكتاب (ص 81) «والغدد الدرقية»، والصواب «الغدد العرقية» كما كتبناها؛ فالغدة الدرقية في الرقبة وليست في الجلد.</span>'},
  {note:TIP+'التيار المار في الجسم يُحسب بقانون أوم: \\(I_h=\\dfrac{U}{R_h}\\). فكلما قلّت المقاومة (جلد مبلل أو ممزق، أو جهد أعلى، أو مدة أطول) كبر التيار بالجهد نفسه. مثال: \\(220\\,\\text{V}\\div 3000\\,\\Omega\\approx 73\\,\\text{mA}\\)، أما \\(220\\,\\text{V}\\div 500\\,\\Omega=440\\,\\text{mA}\\).'},
  {h:'ج- شدة التيار الكهربائي المار في جسم الإنسان',ref:'ص 82–84',html:`<p>دلت التجارب على أن أصغر تيار كهربائي يتحسس به جسم الإنسان هو <b>واحد مللي أمبير</b> للتيار المتناوب ذي تردد ${lt('60 Hz')}، و<b>${lt('5')} مللي أمبير</b> للتيار المستمر، حيث تؤدي التيارات الأكبر إلى تشنج العضلات وإلى الإحساس بالألم. وفي الواقع إن <b>شدة التيار هي العامل الحاسم</b> الذي يعتبر قياسياً لشدة الصدمة، وبالتالي لخطورة الإصابة. والشكل (5-4) والجدول التاليان يوضحان تأثير شدة التيار على جسم الإنسان.</p>`},
  {fig:'(5-4)',ref:'ص 82',caption:'مدى تحمل جسم الإنسان للتيار (Range of body tolerance) — العبارات الإنجليزية من الشكل وتحتها ترجمتها',draw:()=>box(fig54(null),380)+`<p class="sub" style="text-align:center">وتحت الشكل في الكتاب عبارة إنجليزية معناها: مصباح ${lt('100 W')} يستهلك ${lt('1000 mA')}، ويكفي ${lt('5 mA')} لفصل قاطع التسرب الأرضي ${lt('(GFCI)')}، وتيار صغير يمر في الجسم بضع ثوانٍ يمكن أن يُحدث الآثار المبينة في الجدول.</p>`},
  {html:`<p><b>جدول تأثير شدة التيار على جسم الإنسان</b> <span class="ref">ص 83</span></p>${zoneTable(-1)}
   <p>إن مرور تيار قدره <b>${lt('80–90')} مللي أمبير ولمدة ${lt('1–3')} ثوانٍ</b> يؤدي لتوقف القلب وحدوث الوفاة، وعلى كلٍّ فإن تياراً بشدة <b>${lt('0.1')} أمبير</b> هو مميت في جميع الأحوال إذا شاء الله ذلك. <span class="ref">ص 84</span></p>`},
  {err:'<span class="fixnote">حدود الشكل (5-4) (1، 5، 10، 50، 100 مللي أمبير) لا تطابق حدود الجدول ص 83 (1، 8، 15، 20، 50، 100، 200)، فهما مصدران مختلفان؛ والمختبر يعتمد الجدول. وفي ص 84 يقول الكتاب إن 0.1 أمبير (100 مللي أمبير) «مميت في جميع الأحوال»، بينما يقول الجدول عن المجال 50–100 إنه «يمكن أن يؤدي إلى الوفاة لدى بعض المصابين». والعبارة الإنجليزية تحت الشكل «مصباح 100 W يستهلك 1000 mA» تصح على جهد 100 V تقريباً؛ أما على 220 V فيستهلك نحو 455 mA.</span>'},
  {h:'د- مدة تأثير التيار الكهربائي',ref:'ص 84',html:`<p>تتعلق مقاومة جلد الإنسان بزمن التأثير الكهربائي المار عليه، فهي <b>عالية في البداية وتتناقص مع مرور الزمن</b>، إذ يؤدي مرور التيار لارتفاع حرارة الجلد وتعرقه وتأينه، مما يؤدي لحرق الجلد وانخفاض مقاومته. وهذه الظواهر يمكن ملاحظتها في شبكات الجهد المنخفض، أما في شبكات الضغط العالي فإن معظم الحوادث تتم قبل لمس المصاب لموصلات التيار، حيث يقع المصاب تحت تأثير الجهد العالي نتيجة التفريغ وظهور القوس الكهربائي، ومع ذلك فإن ردود الفعل الانعكاسية لدى المصاب تبعده فوراً نتيجة تأثير المراكز العصبية، مما يؤدي لانطفاء القوس الكهربائي. والتيارات المارة يمكن أن تكون كبيرة (تزيد عن ${lt('10 A')}) ولكنها يمكن ألا تؤدي إلى الوفاة نظراً لقصر زمن تأثيرها، مع أنها تؤدي لحروق خطيرة قد تؤدي للوفاة.</p>`},
  {h:'هـ- تأثير الجهد الكهربائي',ref:'ص 84',html:`<p>وجدنا أعلاه أن مقاومة جسم الإنسان تتناقص بازدياد الجهد الكهربائي المطبق عليه، وقد دلت التجارب على أن الجهد <b>${lt('12–15')} فولت</b> لا يؤثر على الإنسان ويعتبر <b>جهداً آمناً</b>. وتتراوح جهود اللمس المسموح بها بين <b>(${lt('40–50')}) فولت</b> ضمن شروط معينة.</p>`},
  {h:'و- تأثير تردد التيار',ref:'ص 84–85',html:`<p>لقد أظهرت التجارب أن <b>التيار المستمر أقل خطراً من التيار المتناوب</b> ذي التردد الصناعي ${lt('60 Hz')}، وللتوترات المنخفضة حتى ${lt('250–300 V')}. ومع زيادة تردد التيار المتناوب تتناقص ممانعة جسم الإنسان (بسبب وجود مركبة سعوية) مما يؤدي لزيادة شدة التيار المار، ولكن ذلك في الواقع يبقى صحيحاً في مجال الترددات من ${lt('50 Hz')} إلى ${lt('60 Hz')} فقط؛ بحيث إن زيادة التردد واقعياً تتوافق مع تناقص خطورة الضرر، حيث يختفي الضرر عند تردد ${lt('450–500 kHz')} (مع بقاء هذه التيارات مشكلةً خطر الحريق عند مرورها في جسم الإنسان كما يظهر عند القوس الكهربائي). وعلى كلٍّ تلعب الخصائص الفردية للإنسان دوراً أساسياً في تطور الضرر الحاصل.</p>
   <p>وهناك نظريات عديدة تفسر تأثير تردد التيار على الجسم، وأكثرها انتشاراً ومطابقة للواقع تقول بأن مرور التيار الكهربائي يؤدي إلى تحلل الأجزاء المشكلة للخلايا في الجسم وتحولها في كل خلية إلى أيونات ذات قطبية مختلفة، تتجه بالاتجاه المعاكس لقطبيها حتى وصولها لجدار الخلية، فتؤدي هذه الحركة إلى تفكك الخلية، وتظهر بشكل واضح في الخلايا العصبية. وتأخذ هذه الحركة ضمن الخلية، وبالتالي المسافة التي تقطعها الأيونات، قيمتها العظمى عند التردد ${lt('40–60 Hz')}. أما عند ارتفاع التردد فإن الحركة تقل، ولا تستطيع الأيونات الانتقال من طرف إلى آخر في الخلية نفسها، وتلاحظ نفس الظاهرة عند انخفاض التردد عن القيم المذكورة أعلاه، وكذلك في التيار المستمر. إن تياراً بتردد صناعي ${lt('60 Hz')} يحمل أكبر الخطر على جسم الإنسان.</p>`},
  {err:'<span class="fixnote">يكتب الكتاب (ص 84) «تتناقص مناعة جسم الإنسان»، والمقصود «ممانعة» جسم الإنسان (معاوقته للتيار المتناوب) كما كتبناها.</span>'},
  {h:'ز- الطريق الذي يمر فيه التيار بجسم الإنسان',ref:'ص 85',html:`<p>هناك طرق كثيرة يمكن أن يسلكها التيار لدى مروره بجسم الإنسان، وأكثرها مصادفة هي (الشكل 5-5): (1) يد – يد، (2) يد – قدم أو قدمين، (3) قدم – قدم، (4) رأس – يد، أو رأس – قدم، وهذه أقل الحالات حدوثاً.</p>
   <p>وأخطر الحالات هي مرور التيار بطريق <b>يد يمنى – قدمين</b>، لأن قيمة التيار المار خلال قلب الإنسان (كنسبة مئوية من قيمة التيار الكلي المار خلال الجسم) يشكل في هذا الطريق نسبة ${lt('6.7%')}، في حين أنها لطريق يد يسرى – قدمين ${lt('3.7%')}، وطريق يد إلى يد ${lt('3.2%')}، وطريق من قدم إلى قدم ${lt('0.4%')}.</p>
   <table class="tt" style="max-width:420px;margin-inline:auto"><thead><tr><th>المسار</th><th>نسبة التيار المار في القلب</th></tr></thead><tbody>${Object.values(PATHS).map(p=>`<tr><td>${p.l}</td><td>${lt(p.p+' %')}</td></tr>`).join('')}</tbody></table>
   <p class="sub" style="text-align:center">الجدول تجميع لأرقام النص في ص 85.</p>`},
  {fig:'(5-5)',ref:'ص 85',caption:'مسارات التيار الكهربائي خلال الجسم (Current Pathways Through the Body): (A) يد–يد عبر القلب، (B) قدم–قدم (جهد الخطوة)، (C) يد يمنى–قدم، (D) يد يسرى–قدم — رسم مبسّط',draw:()=>`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px">${[['hh','(A)'],['ff','(B)'],['rf','(C)'],['lf','(D)']].map(([k,c])=>`<div><div class="svgbox" style="margin-top:0">${bodySVG(k,true,0)}</div><p class="sub" style="text-align:center"><span class="ltr">${c}</span> ${PATHS[k].l}</p></div>`).join('')}</div>`},
  {note:TIP+'في الشكل (5-5) يصل التيار في (C) و(D) إلى قدم واحدة، أما النسب في النص فهي لمسار «يد – قدمين». وتختلف المراجع في أي اليدين أخطر: الكتاب يجعل «يد يمنى – قدمين» الأخطر (6.7 %)، وبعض المواصفات الحديثة (مثل IEC 60479) تجعل مسار اليد اليسرى إلى القدمين هو الأخطر لقربه من القلب. المختبر يعتمد أرقام الكتاب.'}
 ],
 lab:(el)=>lab2(el),
 examples:[
  exI({title:'مثال (1) — إضافة من خارج الكتاب: لمس جهد 220 V بجلد جاف',ref:'مبني على ص 81 وص 83',U:220,R:3000,
   q:'<p>شخص جلده جاف ونظيف لمس بيده موصلاً جهده <span class="ltr">220 V</span> وقدماه على الأرض. خذ لمقاومة جسمه أصغر قيمة يذكرها الكتاب للجلد الجاف (<span class="ltr">3000 Ω</span>، ص 81). احسب التيار المار في جسمه، واقرأ أثره من الجدول (ص 83).</p>',
   note:ADD+'الكتاب لا يحل مثالاً هنا؛ بنينا المثال من أرقامه. والمقاومة الحقيقية عند 220 V أقل من 3000 Ω لأن مدى 3000–100000 Ω مقيس عند 20 V.'}),
  exI({title:'مثال (2) — إضافة من خارج الكتاب: مقاومة الجسم في قيمتها الدنيا',ref:'مبني على ص 81 وص 83',U:220,R:500,
   q:'<p>الشخص نفسه، لكن مقاومة جسمه هبطت إلى قيمتها الدنيا التي يذكرها الكتاب (300–500 Ω، ص 81) — نأخذ <span class="ltr">500 Ω</span>. احسب التيار واقرأ أثره من الجدول.</p>',
   note:ADD+'قارن بالمثال (1): الجهد نفسه، والتيار صار نحو ستة أضعاف لأن المقاومة صارت أصغر بست مرات.'}),
  exI({title:'مثال (3) — إضافة من خارج الكتاب: الجهد الآمن',ref:'مبني على ص 81 وص 83–84',U:12,R:3000,
   q:'<p>لمس شخص جلده جاف (<span class="ltr">3000 Ω</span>) جهداً قدره <span class="ltr">12 V</span>، وهو من الجهد الذي يعدّه الكتاب آمناً (12–15 فولت، ص 84). احسب التيار واقرأ أثره من الجدول.</p>',
   note:ADD+'التيار 4 mA في صف «1–8»: تقلص غير مؤلم ويستطيع المصاب التخلص بنفسه، وهذا يوافق قول الكتاب إن هذا الجهد آمن.'}),
  {title:'مثال (4) — إضافة من خارج الكتاب: التيار المار في القلب حسب المسار',ref:'مبني على نسب ص 85',
   q:'<p>مرّ في جسم شخص تيار كلي قدره <span class="ltr">73.3 mA</span> (نتيجة المثال 1). احسب التيار المار في قلبه إذا كان المسار «يد يمنى – قدمين» (6.7 %)، ثم إذا كان «قدم – قدم» (0.4 %). كم مرة يكبر الأول عن الثاني؟</p>',
   given:[{id:'I',label:'التيار الكلي في الجسم',sym:'I_h',unit:'mA',value:73.3,step:'any',min:0},{id:'p1',label:'نسبة المسار الأول (يد يمنى – قدمين)',sym:'',unit:'%',value:6.7,step:'any',min:0},{id:'p2',label:'نسبة المسار الثاني (قدم – قدم)',sym:'',unit:'%',value:0.4,step:'any',min:0.01}],
   solve:(g)=>{const a=B.round(g.I*g.p1/100,2),b=B.round(g.I*g.p2/100,2),r=B.round(g.p1/g.p2,2);return [
    {t:'التيار في القلب للمسار الأول:',f:`I_1=I_h\\times\\frac{${g.p1}}{100}=${g.I}\\times${B.round(g.p1/100,4)}`,v:a,unit:'mA',dp:2},
    {t:'التيار في القلب للمسار الثاني:',f:`I_2=I_h\\times\\frac{${g.p2}}{100}=${g.I}\\times${B.round(g.p2/100,4)}`,v:b,unit:'mA',dp:2},
    {t:'المسار الأول أخطر بعدد من المرات يساوي:',f:`\\frac{I_1}{I_2}=\\frac{${g.p1}}{${g.p2}}`,v:r,unit:'مرة',dp:2,final:true}]},
   note:ADD+'لذلك يعدّ الكتاب مسار «قدم – قدم» (جهد الخطوة) أقل المسارات خطراً على القلب، ومع ذلك يبقى خطيراً لأن المصاب قد يسقط فيصير المسار عبر جسمه كله.'}
 ],
 quiz:[
  {q:'ما الآثار الثلاثة لمرور التيار في جسم الإنسان حسب الكتاب؟',o:['حرارية وتحليلية وبيولوجية','ضوئية وصوتية وحرارية','مغناطيسية وكيميائية وضوئية','ميكانيكية فقط'],c:0,e:'«آثار حرارية، وتحليلية، وبيولوجية» (ص 81).'},
  {q:'كم مقاومة جسم الإنسان عندما يكون الجلد جافاً ونظيفاً وغير ممزق (عند 20 V)؟',o:['من 30 إلى 100 أوم','من 3000 إلى 100000 أوم','مليون أوم ثابتة','صفر تقريباً'],c:1,e:'من 3000 إلى 100000 أوم، وتهبط إلى قيمتها الدنيا 300–500 أوم (ص 81).'},
  {q:'ما أصغر تيار متناوب (60 Hz) يتحسس به الإنسان؟',o:['0.1 مللي أمبير','1 مللي أمبير','5 مللي أمبير','50 مللي أمبير'],c:1,e:'واحد مللي أمبير للمتناوب، و5 مللي أمبير للمستمر (ص 82).'},
  {q:'حسب الجدول ص 83، ماذا يحدث عند تيار بين 15 و20 مللي أمبير؟',o:['لا يتأثر','تقلص غير مؤلم','يشتد الألم ويفقد المصاب التحكم في العضلات ويحتاج لمساعدة خارجية','توقف القلب'],c:2,e:'صف «من 15–20» في الجدول ص 83.'},
  {q:'ما الجهد الذي يعدّه الكتاب آمناً؟',o:['12–15 فولت','40–50 فولت','220 فولت','380 فولت'],c:0,e:'«الجهد 12–15 فولت لا يؤثر على الإنسان ويعتبر جهداً آمناً»، وجهود اللمس المسموح بها 40–50 فولت ضمن شروط معينة (ص 84).'},
  {q:'أي مسار للتيار يعدّه الكتاب الأخطر، ولماذا؟',o:['قدم – قدم، لأن الساقين طويلتان','يد – يد، لأن اليدين قريبتان','يد يمنى – قدمين، لأن 6.7 % من التيار يمر في القلب','رأس – قدم، لأنه أكثر الحالات حدوثاً'],c:2,e:'يد يمنى – قدمين: 6.7 % من التيار الكلي يمر خلال القلب (ص 85).'}
 ]
});

/* =====================================================================
   LESSON 3 — حالات المرور إلى الأرض، وجهد التماس والخطوة، والضغط العالي (ص 86–92)
   ===================================================================== */
/* approximate reading of figure 5-11: [distance ft, % of electrode voltage] */
const C511=[[0,80],[1,64],[2,50],[3,41],[4,34],[5,27],[6,23],[7,20.5],[8,18],[10,14],[12,11.5],[14,10.5],[16,10]];
const pAt=x=>{x=Math.max(0,Math.min(16,x));for(let i=0;i<C511.length-1;i++){const [a,pa]=C511[i],[b,pb]=C511[i+1];if(x<=b)return pa+(pb-pa)*(x-a)/(b-a)}return 10};
function curve511(o){o=o||{};const W=560,H=300,L=56,Rm=14,T=18,Bm=50,X=x=>L+x/16*(W-L-Rm),Y=y=>T+(100-y)/100*(H-T-Bm);
  let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="الجهد على سطح الأرض مع البعد عن قطب التأريض">`;
  for(let v=0;v<=100;v+=10)s+=`<path d="M${L} ${Y(v)}H${W-Rm}" style="stroke:var(--line);stroke-width:${v%50?0.6:1}"/>`+tl(L-6,Y(v)+4,String(v),{a:'end',m:1});
  for(let x=0;x<=16;x+=2)s+=`<path d="M${X(x)} ${Y(0)}v5" style="stroke:var(--fg)"/>`+tl(X(x),Y(0)+17,String(x),{m:1});
  s+=`<path d="M${L} ${T}V${Y(0)}H${W-Rm}" style="fill:none;stroke:var(--fg);stroke-width:1.4"/>`;
  s+=tl((L+W)/2,H-6,'Distance from rod (ft)',{m:1})+`<text class="txt m" transform="translate(14 ${(T+Y(0))/2}) rotate(-90)" text-anchor="middle">Voltage remote from electrode (%)</text>`;
  let d='';for(let x=0;x<=16.001;x+=0.25)d+=(x?'L':'M')+X(x).toFixed(1)+' '+Y(pAt(x)).toFixed(1);
  s+=`<path d="${d}" style="fill:none;stroke:var(--blue);stroke-width:2.6"/>`;
  if(o.feet){const [x1,x2]=o.feet,y1=Y(pAt(x1)),y2=Y(pAt(x2));
    if(o.mode==='touch'){s+=`<path d="M${X(x1)} ${Y(100)}V${y1}" style="stroke:var(--stop);stroke-width:4"/><path d="M${L} ${Y(100)}H${X(x1)}" style="stroke:var(--stop);stroke-width:1.2;stroke-dasharray:4 3"/>`+tl(L+4,Y(100)-5,'100 % (rod / frame)',{a:'start',st:'fill:var(--stop);font-size:10px'})}
    else{s+=`<path d="M${X(x1)} ${y1}H${X(x2)}" style="stroke:var(--line);stroke-dasharray:3 3"/><path d="M${X(x2)} ${y1}V${y2}" style="stroke:var(--stop);stroke-width:4"/>`}
    [[x1,y1],[x2,y2]].forEach(([x,y],k)=>{if(o.mode==='touch'&&k)return;s+=`<path d="M${X(x)} ${y}V${Y(0)}" style="stroke:var(--muted);stroke-dasharray:3 3"/><circle cx="${X(x)}" cy="${y}" r="5.5" style="fill:var(--live);stroke:var(--fg)"/><rect x="${X(x)-9}" y="${Y(0)-7}" width="18" height="7" rx="3" style="fill:var(--fg)"/>`});}
  if(o.rod){s+=`<path d="M${X(0)} ${Y(0)}v-14" style="stroke:var(--fg);stroke-width:5"/>`}
  return s+'</svg>'}
/* rings of figs 5-12 / 5-13 */
const RINGS={a:{fig:'(5-12)',ref:'ص 89',src:'12.7 kV',r:[[12700,'12.7 kV'],[10000,'10 kV'],[8000,'8 kV'],[6000,'6 kV']]},
 b:{fig:'(5-13)',ref:'ص 89',src:'Contact Point',r:[[5000,'A — 5000 V'],[2500,'B — 2500 V']]}};
function ringsSVG(k,f1,f2){const R=RINGS[k],n=R.r.length,cx=250,cy=150;let s=`<svg viewBox="0 0 500 275" role="img" aria-label="حلقات تساوي الجهد حول نقطة سقوط الموصل">`;
  const rad=i=>k==='a'?30+i*44:50+i*70;
  for(let i=n-1;i>=0;i--){s+=`<ellipse cx="${cx}" cy="${cy}" rx="${rad(i)*1.45}" ry="${rad(i)*0.62}" style="fill:${k==='b'?['var(--stop-soft)','var(--live-soft)'][i]:'none'};stroke:var(--fg);stroke-width:1.4;stroke-dasharray:${k==='a'?'7 5':'0'}"/>`}
  R.r.forEach(([v,l],i)=>{s+=tl(cx+(k==='a'?0:30),cy+rad(i)*0.62-4,l,{st:'font-size:11px;fill:var(--blue-ink)'})});
  s+=`<rect x="${cx-62}" y="20" width="16" height="${cy-20}" rx="6" style="fill:var(--surface-2);stroke:var(--fg)"/><path d="M${cx-46} 40C${cx-30} 70 ${cx-10} 120 ${cx} ${cy}" style="fill:none;stroke:var(--fg);stroke-width:2.4"/><circle cx="${cx}" cy="${cy}" r="5" style="fill:var(--live)"/>`+tl(cx+8,cy-8,R.src,{a:'start',st:'font-size:11px'});
  const fx=i=>cx+rad(i)*1.45,X1=fx(f1),X2=fx(f2)+(f1===f2?16:0),fy=cy+6;
  s+=`<path d="M${X1} ${fy}L${(X1+X2)/2} ${fy-70}L${X2} ${fy}" style="fill:none;stroke:var(--live);stroke-width:4;stroke-linejoin:round"/><circle cx="${(X1+X2)/2}" cy="${fy-82}" r="11" style="fill:var(--surface);stroke:var(--fg);stroke-width:2"/><path d="M${(X1+X2)/2} ${fy-70}V${fy-110}" style="stroke:var(--fg);stroke-width:0"/>`;
  [X1,X2].forEach(x=>{s+=`<rect x="${x-9}" y="${fy-4}" width="18" height="8" rx="3" style="fill:var(--fg)"/>`});
  return s+'</svg>'}

function lab3(el){addCss();
  const w={mode:'step',x:1,st:2,UE:12700,Rh:3000,ins:false,rk:'a',f1:1,f2:2,seen:{}};
  el.innerHTML=`<div class="grid">
   <div class="panel c12"><h2>مختبر جهد الخطوة وجهد التماس <small>مبني على المنحنى في الشكل (5-11) ص 88</small></h2>
    <p class="sub">يسري تيار عطل إلى الأرض من قطب التأريض (المربط الأرضي). جهد سطح الأرض يكون أعلى ما يكون عند القطب ويقل كلما ابتعدنا عنه (المنحنى). حرّك الشخص وغيّر طول خطوته، وانظر الفرق بين قدميه (جهد الخطوة)، أو الفرق بين يده التي تلمس هيكلاً متصلاً بالقطب وقدميه (جهد التماس).</p>
    <div class="wrap-in" style="align-items:flex-end">
     <div><div class="sub">الحالة</div>${segHTML('md',[['step','جهد الخطوة (القدمان على الأرض)'],['touch','جهد التماس (يلمس هيكلاً متصلاً بالقطب)']],'step')}</div>
     ${rangeHTML('xx','بُعد القدم الأقرب عن القطب',0,16,0.5,1,'ft')}
     ${rangeHTML('ss','طول الخطوة (المسافة بين القدمين)',0,4,0.5,2,'ft')}
    </div>
    <div class="wrap-in" style="align-items:flex-end">
     ${rangeHTML('ue','جهد القطب بالنسبة للأرض البعيدة U<sub>E</sub>',100,20000,100,12700,'V')}
     ${rangeHTML('rh','مقاومة جسم الإنسان R<sub>h</sub> (ص 81)',300,100000,100,3000,'Ω')}
     <div class="s5-ctl"><button class="btn" id="jump">قفز بقدمين متلاصقتين</button><button class="btn" id="ins" aria-pressed="false">سلم خشبي / ألواح خشبية تحت القدمين</button></div>
    </div>
    <div class="wrap-in" style="padding-top:0"><div class="reads" style="margin-inline-start:0">
     <div class="read"><span>جهد موضع القدم الأولى</span><b id="r1"></b></div><div class="read"><span>جهد موضع القدم الثانية</span><b id="r2"></b></div>
     <div class="read"><span id="rdl">جهد الخطوة</span><b id="rd"></b></div><div class="read"><span>التيار في الجسم I<sub>h</sub></span><b id="ri"></b></div></div></div>
    <div class="callout" id="say"></div></div>
   <div class="panel c8"><h2>الجهد مع البعد عن القطب <small>الشكل (5-11) ص 88 — قراءة تقريبية للمنحنى</small></h2><div class="svgbox" id="cv" style="max-width:560px;margin-inline:auto"></div>
    <p class="sub">المحور الرأسي: جهد النقطة بالنسبة لأرض بعيدة كنسبة مئوية من جهد القطب (الكتاب لا يكتب وحدته). النقطتان البرتقاليتان = موضعا القدمين، والخط الأحمر = الفرق الذي يقع على جسم الشخص.</p></div>
   <div class="panel c4"><h2>التجربة خطوة بخطوة</h2><ol class="steps" id="gs"></ol></div>
   <div class="panel c12"><h2>حلقات الجهد حول موصل ساقط <small>الشكلان (5-12) و(5-13) ص 89</small></h2>
    <div class="wrap-in" style="align-items:flex-end"><div><div class="sub">الشكل</div>${segHTML('rk',[['a','الشكل (5-12): موصل 12.7 kV'],['b','الشكل (5-13): Step Potential']],'a')}</div></div>
    <div class="wrap-in" style="align-items:flex-end"><div><div class="sub">القدم الأولى على الحلقة</div><div id="f1s"></div></div><div><div class="sub">القدم الثانية على الحلقة</div><div id="f2s"></div></div>
     <div class="reads"><div class="read"><span>فرق الجهد بين القدمين</span><b id="rr"></b></div></div></div>
    <div class="svgbox" id="rgv" style="max-width:500px;margin-inline:auto"></div><div class="callout" id="rsay"></div>
    ${tries(['قف قرب القطب بخطوة 2 ft ثم ابتعد إلى 12 ft: كيف تغيّر جهد الخطوة؟','في حالة «جهد التماس» افعل العكس: كلما ابتعدت عن القطب كبر جهد التماس.','اضغط «قفز بقدمين متلاصقتين» أو «ألواح خشبية» كما ينصح الكتاب عند إنقاذ مصاب بجهد الخطوة.','في الشكل (5-12) ضع القدمين على حلقتي 10 kV و8 kV.'])}</div>
  </div>`;
  const $=s=>el.querySelector(s);B.math&&B.math(el);
  const V=p=>w.UE*p/100,fV=v=>v>=1000?fmt(v/1000,2)+' kV':fmt(v,0)+' V';
  const upd=()=>{const x1=w.x,x2=Math.min(16,w.x+w.st),p1=pAt(x1),p2=pAt(x2);let dU,lbl;
    if(w.mode==='step'){dU=V(p1-p2);lbl='جهد الخطوة'}else{dU=V(100-p1);lbl='جهد التماس'}
    const I=w.ins?0:dU/w.Rh*1000;w.dU=dU;w.p1=p1;
    $('#rdl').textContent=lbl;$('#r1').textContent=fmt(p1,1)+' % = '+fV(V(p1));$('#r2').textContent=w.mode==='touch'?'يده: 100 % = '+fV(w.UE):fmt(p2,1)+' % = '+fV(V(p2));
    $('#rd').textContent=fV(dU)+' ('+fmt(w.mode==='step'?p1-p2:100-p1,1)+' %)';$('#ri').textContent=w.ins?'≈ 0 (معزول)':(I>=1000?fmt(I/1000,2)+' A':fmt(I,1)+' mA');
    $('#cv').innerHTML=curve511({feet:[x1,x2],mode:w.mode,rod:1});
    let m=w.mode==='step'?`القدمان عند ${fmt(x1,1)} ft و${fmt(x2,1)} ft (${fmt(x1*0.3048,2)} م و${fmt(x2*0.3048,2)} م). جهد الخطوة = الفرق بين جهدي الموضعين = <b>${fV(dU)}</b>. «جهد الخطوة يقل تدريجياً بمقدار ما يزداد البعد عن المربط الأرضي» (ص 88).`
      :`يده على هيكل متصل بالقطب (جهده 100 %)، وقدماه عند ${fmt(x1,1)} ft (${fmt(p1,1)} %). جهد التماس = الفرق بينهما = <b>${fV(dU)}</b>. لذلك «يكبر [جهد التماس] بمقدار ابتعاد الشخص عن المربط الأرضي» (ص 88).`;
    if(w.ins)m+=' <br>الألواح الخشبية الجافة تعزل القدمين عن الأرض فلا يمر تيار تقريباً — وهي الأفضل عند الوصول إلى مصاب (ص 89).';
    else if(w.mode==='step'&&w.st===0)m+=' <br>القدمان في موضع واحد فلا فرق جهد بينهما؛ لذلك ينصح الكتاب بعدم الخطو بخطوات كبيرة، ويفضّل القفز (ص 89).';
    else{const zi=zoneIdx(I);m+=` <br>التيار في الجسم = ${fV(dU)} ÷ ${w.Rh} Ω — من الجدول ص 83 (${zLbl(ZT[zi])}): ${ZT[zi][2]}`}
    $('#say').innerHTML=m};
  const updR=()=>{const R=RINGS[w.rk],n=R.r.length;w.f1=Math.min(w.f1,n-1);w.f2=Math.min(w.f2,n-1);
    $('#f1s').innerHTML=segHTML('fa',R.r.map(([v,l],i)=>[i,l]),w.f1);$('#f2s').innerHTML=segHTML('fb',R.r.map(([v,l],i)=>[i,l]),w.f2);
    el.querySelectorAll('[data-fa]').forEach(b=>b.addEventListener('click',()=>{w.f1=+b.dataset.fa;updR()}));
    el.querySelectorAll('[data-fb]').forEach(b=>b.addEventListener('click',()=>{w.f2=+b.dataset.fb;updR()}));
    const d=Math.abs(R.r[w.f1][0]-R.r[w.f2][0]);w.rd=d;$('#rr').textContent=fV(d);$('#rgv').innerHTML=ringsSVG(w.rk,w.f1,w.f2);
    $('#rsay').innerHTML=(w.rk==='a'?'الشكل (5-12): موصل جهده 12.7 kV سقط على الأرض، وحوله حلقات تساوي الجهد 10 و8 و6 kV. الشخص الذي تقع قدماه على حلقتين مختلفتين يتعرض لفرق جهدهما؛ والكتاب يقول إنه «قد يتعرض لجهد قدره 2 kV» (بين 10 و8 kV).':'الشكل (5-13): قدم الشخص الأمامية عند A (5000 V) والخلفية عند B (2500 V)، فيتعرض لجهد قدره 2.5 kV (ص 89).')+` <br>القدمان الآن: ${R.r[w.f1][1]} و${R.r[w.f2][1]} ⇐ الفرق <b>${fV(d)}</b>.`};
  const on=(id,f)=>$(id).addEventListener('input',e=>{f(+e.target.value);upd()});
  on('#xx',v=>{w.x=v;$('#xxV').textContent=v+' ft';if(v<=1)w.near=1;if(v>=10&&w.near)w.far=1;if(w.mode==='touch'&&v>=10)w.tfar=1});
  on('#ss',v=>{w.st=v;$('#ssV').textContent=v+' ft'});
  on('#ue',v=>{w.UE=v;$('#ueV').textContent=v+' V'});on('#rh',v=>{w.Rh=v;$('#rhV').textContent=v+' Ω'});
  el.querySelectorAll('[data-md]').forEach(b=>b.addEventListener('click',()=>{w.mode=b.dataset.md;segSet(el,'md',w.mode);if(w.mode==='touch'&&w.x>=10)w.tfar=1;upd()}));
  $('#jump').addEventListener('click',()=>{w.st=0;$('#ss').value=0;$('#ssV').textContent='0 ft';w.jumped=1;upd()});
  $('#ins').addEventListener('click',e=>{w.ins=!w.ins;e.currentTarget.setAttribute('aria-pressed',String(w.ins));if(w.ins)w.jumped=1;upd()});
  el.querySelectorAll('[data-rk]').forEach(b=>b.addEventListener('click',()=>{w.rk=b.dataset.rk;segSet(el,'rk',w.rk);if(w.rk==='b'){w.f1=0;w.f2=1}else{w.f1=1;w.f2=2}w.seen[w.rk]=1;updR()}));
  const gs=stepsUI($('#gs'),[
   {t:'قرب القطب',x:'في «جهد الخطوة» اجعل القدم الأقرب عند 1 ft أو أقل وطول الخطوة 2 ft: الفرق كبير لأن المنحنى شديد الانحدار قرب القطب.',done:w=>w.mode==='step'&&w.x<=1&&w.st>=2},
   {t:'ابتعد',x:'حرّك الشخص إلى 10 ft أو أبعد بالخطوة نفسها: جهد الخطوة صار أصغر بكثير.',done:w=>w.far&&w.mode==='step'&&w.x>=10&&w.st>=2},
   {t:'القفز أو الألواح',x:'اضغط «قفز بقدمين متلاصقتين» أو «ألواح خشبية»: لا يمر تيار في الجسم تقريباً.',done:w=>w.jumped},
   {t:'جهد التماس',x:'اختر «جهد التماس» ثم ابتعد إلى 10 ft أو أكثر: جهد التماس يكبر بالابتعاد عن القطب.',done:w=>w.tfar},
   {t:'الشكل (5-12)',x:'في لوحة الحلقات ضع القدمين على 10 kV و8 kV: الفرق 2 kV كما في الكتاب.',done:w=>w.rk==='a'&&w.rd===2000},
   {t:'الشكل (5-13)',x:'اختر الشكل (5-13) والقدمان على A وB: الفرق 2.5 kV.',done:w=>w.rk==='b'&&w.rd===2500}
  ],()=>w);
  upd();updR();loopOn(el,()=>gs.check())}

/* figures of lesson 3 */
const fig56=(one)=>{let s=`<svg viewBox="0 0 300 220" role="img" aria-label="${one?'شخص يقف على الأرض ويمسك موصلاً واحداً':'شخص يمسك بيديه موصلين من شبكة ثلاثية الأطوار'}">`;
  s+=`<rect x="0" y="0" width="300" height="220" rx="10" style="fill:var(--live-soft)"/>`;
  if(one)s+=`<ellipse cx="150" cy="200" rx="80" ry="10" style="fill:var(--on-soft);stroke:var(--on)"/>`;
  s+=man(150,198,{s:1.25,rh:[96,140],lh:one?[184,150]:[204,140]});
  s+=`<path d="M96 140Q70 170 40 214" style="fill:none;stroke:var(--stop);stroke-width:7;stroke-linecap:round"/><circle cx="96" cy="140" r="4" style="fill:#c99512"/>`;
  if(!one)s+=`<path d="M204 140Q230 170 260 214" style="fill:none;stroke:var(--stop);stroke-width:7;stroke-linecap:round"/><circle cx="204" cy="140" r="4" style="fill:#c99512"/>`;
  s+=`<path d="${one?'M96 140L150 86L150 150L136 198':'M96 140L150 86L204 140'}" style="fill:none;stroke:var(--live);stroke-width:4;stroke-dasharray:7 5"/>`;
  return s+'</svg>'};
const fig57=()=>{let s=`<svg viewBox="0 0 460 250" role="img" aria-label="شبكة ثلاثية الأطوار معزولة عن الأرض وشخص يلمس الخط A">`;
  [['C',40],['B',70],['A',100]].forEach(([n,y])=>{s+=`<path d="M30 ${y}c4-8 8-8 12 0s8 8 12 0 8-8 12 0M66 ${y}H420" style="fill:none;stroke:var(--fg);stroke-width:1.8"/>`+tl(432,y+4,n,{a:'start'})});
  s+=`<path d="M10 210H450" style="stroke:var(--fg);stroke-width:3"/>`;for(let x=14;x<450;x+=12)s+=`<path d="M${x} 212l-8 10" style="stroke:var(--muted)"/>`;
  [['a',100,110],['b',70,190],['c',40,270]].forEach(([k,y,x])=>{s+=`<circle cx="${x}" cy="${y}" r="3" style="fill:var(--fg)"/><circle cx="${x+40}" cy="${y}" r="3" style="fill:var(--fg)"/><path d="M${x} ${y}V140M${x} 166V210M${x+40} ${y}V170M${x+28} 170h24M${x+28} 178h24M${x+40} 178V210" style="stroke:var(--fg);stroke-width:1.6;fill:none"/><rect x="${x-6}" y="140" width="12" height="26" style="fill:var(--surface);stroke:var(--fg);stroke-width:1.6"/>`+tl(x-10,156,'r'+k,{a:'end',st:'font-size:11px'})+tl(x+56,176,'C'+k,{a:'start',st:'font-size:11px'})});
  s+=man(380,208,{s:.9,rh:[360,100],lh:[400,160]})+`<circle cx="360" cy="100" r="4" style="fill:var(--stop)"/>`;
  s+=`<path d="M392 120V196" style="stroke:var(--live);stroke-width:2;stroke-dasharray:5 4"/><path d="M386 188l6 10 6-10" style="fill:none;stroke:var(--live);stroke-width:2"/>`+tl(398,140,'Ih',{a:'start',st:'fill:var(--live)'});
  s+=`<path d="M380 226Q250 250 130 226" style="fill:none;stroke:var(--live);stroke-width:1.6;stroke-dasharray:5 4"/>`;
  return s+'</svg>'};
const fig59=()=>{let s=`<svg viewBox="0 0 460 230" role="img" aria-label="جهاز هيكله المعدني تكهرب وشخص يلمسه فيمر التيار عبره إلى الأرض">`;
  s+=`<rect x="0" y="196" width="460" height="34" style="fill:var(--blue-soft)"/>`+tl(230,220,'GROUND',{m:1});
  s+=`<rect x="250" y="150" width="140" height="10" style="fill:var(--blue-soft);stroke:var(--fg)"/><path d="M262 160V196M378 160V196" style="stroke:var(--fg);stroke-width:4"/>`+tl(320,180,'Non-Conductive Insulated Table',{st:'font-size:9px'});
  s+=`<rect x="262" y="70" width="116" height="80" rx="4" style="fill:var(--surface-2);stroke:var(--fg);stroke-width:2"/><path d="M370 80L350 120" style="stroke:var(--stop);stroke-width:4"/>`+tl(320,64,'live rod touching the chassis',{st:'font-size:9px'});
  s+=`<rect x="420" y="90" width="26" height="40" rx="3" style="fill:var(--surface);stroke:var(--on);stroke-width:2"/><path d="M433 130V196" style="stroke:var(--fg);stroke-width:3"/><path d="M420 110H378" style="stroke:var(--fg);stroke-width:2"/>`+tl(433,84,'AC outlet',{st:'font-size:9px'});
  s+=man(200,196,{s:1,rh:[150,100],lh:[262,96]});
  s+=`<rect x="70" y="80" width="70" height="40" rx="4" style="fill:var(--surface);stroke:var(--fg)"/><path d="M105 120V196" style="stroke:var(--fg);stroke-width:3"/>`+tl(105,74,'grounded chassis',{st:'font-size:9px'});
  s+=`<path d="M350 120L262 96L200 108L188 196M200 108L150 100L140 100" style="fill:none;stroke:var(--live);stroke-width:3;stroke-dasharray:4 4"/>`;
  return s+'</svg>'};
const fig510=()=>{let s=`<svg viewBox="0 0 460 260" role="img" aria-label="جهاز من الفئة الأولى انقطع موصل أرضيه فيمر تيار العطل عبر الشخص إلى الأرض">`;
  s+=`<path d="M150 30c6-10 12-10 18 0s12 10 18 0 12-10 18 0 12 10 18 0" style="fill:none;stroke:var(--fg);stroke-width:2"/>`+tl(196,18,'Supply transformer',{st:'font-size:10px'});
  s+=`<path d="M150 30H110V60" style="fill:none;stroke:var(--fg);stroke-width:1.6"/>`+earth(110,60)+tl(110,92,'Source earth',{st:'font-size:9px'});
  s+=`<path d="M150 30H140V150M168 40V150M222 30H240V150" style="fill:none;stroke:var(--fg);stroke-width:1.6"/>`;
  s+=tl(132,120,'Earth',{a:'end',st:'font-size:9px'})+tl(174,120,'N',{a:'start',st:'font-size:9px'})+tl(246,90,'Live',{a:'start',st:'font-size:9px'});
  s+=`<rect x="232" y="64" width="16" height="22" rx="3" style="fill:var(--surface);stroke:var(--fg)"/>`+tl(254,80,'Fuse',{a:'start',st:'font-size:9px'});
  s+=`<path d="M134 110l12-8" style="stroke:var(--stop);stroke-width:2.4"/>`+tl(130,104,'break',{a:'end',st:'font-size:9px;fill:var(--stop)'});
  s+=`<rect x="120" y="150" width="140" height="56" rx="4" style="fill:var(--surface-2);stroke:var(--fg);stroke-width:2"/><path d="M168 150V164l6 6-12 6 12 6-12 6 6 6V150" style="fill:none;stroke:var(--fg);stroke-width:1.4"/><path d="M240 150V172L262 182" style="fill:none;stroke:var(--stop);stroke-width:2.4"/>`+tl(190,224,'Class I appliance',{st:'font-size:10px'});
  s+=man(320,240,{s:1,rh:[262,176],lh:[372,150]})+`<path d="M372 150V240" style="stroke:var(--fg);stroke-width:6"/>`+earth(372,240)+tl(392,140,'Path to earth',{a:'start',st:'font-size:9px'});
  s+=`<path d="M240 40V150M262 180L320 152L372 150V250H90V80" style="fill:none;stroke:var(--live);stroke-width:2.4;stroke-dasharray:8 3 2 3"/>`;
  return s+'</svg>'};

B.lesson({
 id:'u5-l3',unit:5,order:3,pages:'86–92',
 title:'مرور التيار إلى الأرض عبر الجسم: جهد التماس وجهد الخطوة، وخطوط الضغط العالي',
 summary:'يتضرر الإنسان إذا لمس في وقت واحد نقطتين بينهما فرق جهد: خطين، أو خطاً والأرض، أو هيكلاً تكهرب بعطل. وحول نقطة التأريض يقل جهد الأرض بالبعد عنها، فيظهر جهد التماس وجهد الخطوة.',
 stations:[
  {intro:true},

  {st:1,short:'لمس خطين',title:'<span class="ltr">5-4</span> الحالات الناجمة عن مرور التيار إلى الأرض عبر الجسم — أ: لمس خطين معاً',ref:'ص 86',
   q:'لماذا يكون الإمساك بخطين من الشبكة أخطر من الإمساك بخط واحد، والجهد في البيت هو نفسه؟',
   art:S5.svg('شخص يمسك بيديه موصلين من شبكة ثلاثية الأطوار','#F7DCC8',S5.nest(fig56(false).replace('style="fill:var(--live-soft)"','style="fill:none"'),30,40,300,220)
    +S5.hot(40,150,80,110,'الخط الأول تحت الجهد تمسكه اليد اليمنى.')+S5.hot(240,150,80,110,'الخط الثاني تحت الجهد تمسكه اليد اليسرى.')
    +S5.hot(120,90,120,70,'مسار التيار من يد إلى يد عبر الصدر. الجهد بين اليدين = جهد الخط ⟦√3·U⟧.')
    +S5.ar(180,292,'نقطتان بينهما فرق في الجهد',{fs:14,b:1})),
   cap:'رسم مبسّط للشكل <span class="ltr">(5-6)</span>.<br><b>مرّر المؤشر على الخطين ومسار التيار (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'متى يتضرر الإنسان حسب البند <span class="ltr">5-4</span>؟',opts:[
     ['عندما يلمس نقطة واحدة تحت الجهد وهو معزول تماماً',false,'لا يكتمل مسار للتيار عبر جسمه.'],
     ['عندما يلامس في وقت واحد نقطتين بينهما فرق في الجهد',true,'«الحالات التي يتضرر بها الإنسان عندما يلامس في وقت واحد نقطتين يوجد بينهما فرق في الجهد» (ص 86).'],
     ['عندما يقترب من لوحة كهرباء مغلقة',false,'الاقتراب وحده لا يُكمل مساراً للتيار.']]}}
   ],
   body:[
    {book:"<p>الحالات التي يتضرر بها الإنسان عندما يلامس في وقت واحد نقطتين يوجد بينهما فرق في الجهد، وهي الحالات التالية:</p>\n<p><b>أ- لمس خطين معاً ناقلين للتيار:</b> يبين الشكل (5-6) تلامس يدي الإنسان لخطين من شبكة ثلاثية الأوجه. ويتعلق التيار المار في جسم الإنسان بجهد الشبكة ومقاومة جسم الإنسان، أي:</p>\n$$I_h=\\frac{\\sqrt{3}\\,U}{R_h}$$",ref:'ص 86'},
    {tip:"الكتاب لا يعرّف الرموز هنا: \\(I_h\\) التيار المار في جسم الإنسان، و\\(R_h\\) مقاومة جسم الإنسان، و\\(U\\) <b>جهد الطور</b>؛ فيكون \\(\\sqrt3\\,U\\) هو جهد الخط الذي يقع بين اليدين. مثلاً في شبكة 220/380 V: \\(\\sqrt3\\times220\\approx381\\) V.",title:'ما معنى الرموز؟'},
    {title:'مختبر مصغّر: التيار عند لمس خطين',widget:(el,B)=>DCML.lab(el,B,{intro:'جهد الطور من شبكة الكتاب (<span class="ltr">220–380 V</span>، ص 92)، والمقاومة من حدود ص 81. احسب التيار بالقانون واقرأ أثره من الجدول ص 83.',
     predict:{q:'جهد الطور 220 V. ما الجهد الواقع بين اليدين عند لمس خطين؟',opts:[['220 V',false,'هذا جهد الطور، أي بين خط واحد والتعادل.'],['نحو 381 V (√3 × 220)',true,'بين خطين يقع جهد الخط = √3 × جهد الطور.'],['صفر',false,'بين الخطين فرق جهد كبير.']]},
     ins:[{k:'U',l:'جهد الطور U',seg:[[220,'220 V']],v:220},{k:'R',l:'مقاومة جسم الإنسان R<sub>h</sub>',seg:[[3000,'3000 Ω'],[500,'500 Ω']],v:3000}],
     calc:(s,P,B)=>{const UL=Math.sqrt(3)*s.U,I=UL/s.R*1000,zi=zoneIdx(I);
      return {facts:[['الجهد بين اليدين √3·U',DCML.fm(B,UL,0)+' V',''],['التيار في الجسم',DCML.fm(B,I,1)+' mA','bad'],['صف الجدول',(z=>z[0]===0?'< 1':z[1]===Infinity?'> 200':z[0]+'–'+z[1])(ZT[zi])+' mA','']],
       msg:`\\(I_h=\\dfrac{\\sqrt3\\,U}{R_h}=\\dfrac{${DCML.fm(B,UL,0)}}{${s.R}}\\) — من الجدول: ${ZT[zi][2]}`,cls:'bad'}}})}
   ]},

  {st:2,short:'لمس خط واحد',title:'ب: لمس خط واحد ناقل للتيار',ref:'ص 86',
   q:'لمست خطاً واحداً فقط وأنت واقف على الأرض… من أين يكمل التيار دائرته؟',
   art:S5.svg('شخص يقف على الأرض ويمسك موصلاً واحداً','#DDEFE6',S5.nest(fig56(true).replace('style="fill:var(--live-soft)"','style="fill:none"'),30,40,300,220)
    +S5.hot(40,150,80,110,'خط واحد تحت الجهد تمسكه اليد.')+S5.hot(110,230,140,40,'الأرض: يكمل التيار دائرته عبرها إلى نقطة التعادل المؤرضة (الشكل ⟦5-8⟧)، أو عبر ممانعة الخطوط مع الأرض إذا كانت الشبكة معزولة (الشكل ⟦5-7⟧).')
    +S5.ar(180,292,'خط واحد + الأرض = دائرة كاملة',{fs:14,b:1})),
   cap:'رسم مبسّط للشكل <span class="ltr">(5-8)</span>.<br><b>مرّر المؤشر على الخط والأرض (أو المسهما في الجوال) لتعرف معناهما.</b>',
   side:[
    {predict:{q:'في شبكة نقطة تعادلها مؤرضة، لمس شخص خطاً واحداً وهو واقف على الأرض. عبر ماذا تُقصر دائرة التيار؟',opts:[
     ['عبر جسم الإنسان والأرض وقطب التأريض',true,'«فيتم في هذا التلامس قصر دائرة التيار من خلال جسم الإنسان والأرض وقطب التأريض» (الشكل <span class="ltr">5-8</span>، ص 86).'],
     ['لا يمر تيار لأنه لمس خطاً واحداً',false,'الأرض متصلة بنقطة التعادل، فيكتمل المسار.'],
     ['عبر الممانعة المتشكلة بين الخطوط والأرض فقط',false,'هذا وصف الشبكة المعزولة (الشكل <span class="ltr">5-7</span>).']]}}
   ],
   body:[
    {book:"<p><b>ب- لمس خط واحد ناقل للتيار:</b> إذا كانت الشبكة ذات نقطة تعادل معزولة تماماً عن الأرض، يتم في هذا التلامس قصر دائرة التيار من خلال جسم الإنسان والممانعة المتشكلة بين خطوط الشبكة والأرض (الشكل 5-7). أما إذا كانت الشبكة ذات نقطة تعادل مؤرضة، فيتم في هذا التلامس قصر دائرة التيار من خلال جسم الإنسان والأرض وقطب التأريض (الشكل 5-8).</p>",ref:'ص 86'},
    {watch:"يكتب الكتاب (ص 86) «إذا كانت الشبكة ذات قطب معزولة… ذات قطب مؤرض»، والمقصود نقطة التعادل (نقطة النجمة) للشبكة، معزولة عن الأرض أو مؤرضة، كما كتبناها.",fix:true},
    {title:'مختبر مصغّر: شبكة معزولة أم مؤرضة؟',widget:(el,B)=>DCML.lab(el,B,{intro:'اختر نوع نقطة التعادل للشبكة، وانظر كيف يعود التيار من جسم الشخص.',
     ins:[{k:'n',l:'نقطة التعادل للشبكة',seg:[['iso','معزولة عن الأرض'],['gnd','مؤرضة']],v:'iso'}],
     calc:(s)=>s.n==='iso'?{pic:fig57(),facts:[['مسار عودة التيار','الممانعة بين الخطوط والأرض','']],msg:'الشكل <span class="ltr">(5-7)</span>: يعود التيار من جسم الشخص عبر الممانعة المتشكلة بين خطوط الشبكة والأرض (مقاومات العزل وسعات الخطوط). الشبكة «معزولة» لا تعني أن لمسها آمن.',cls:'warn'}
      :{pic:fig56(true),facts:[['مسار عودة التيار','الأرض وقطب التأريض','bad']],msg:'الشكل <span class="ltr">(5-8)</span>: نقطة التعادل متصلة بالأرض، فيكتمل المسار مباشرة: جسم الإنسان ← الأرض ← قطب التأريض.',cls:'bad'}})},
    {add:'<p>أغلب شبكات المباني والمصانع لها نقطة تعادل مؤرضة عند المحول؛ لذلك يكفي لمس خط واحد مع الوقوف على أرض موصلة أو رطبة لتمر الصدمة. ومن هنا أهمية الأحذية العازلة والبُسُط العازلة.</p>',title:'أي الحالتين أشيع؟'}
   ]},

  {st:3,short:'هيكل تحت خطأ',title:'ج: لمس مادة ناقلة وغير حاملة للتيار، لكنها واقعة تحت تأثير خطأ',ref:'ص 87',
   q:'جهاز هيكله معدني انهار عازله… هل يحميك سلك التأريض حماية كاملة؟',
   art:S5.svg('جهاز هيكله المعدني لمسه قضيب حي، وشخص يلمسه فيمر التيار عبره إلى الأرض','#FBE6C4',S5.nest(fig59(),10,70,340,170)
    +S5.hot(195,115,90,65,'هيكل الجهاز المعدني: وقع تحت التوتر صدفة نتيجة فشل العازل (قضيب حي يلمس الهيكل).')
    +S5.hot(120,115,70,110,'الشخص يلمس الهيكل: يمر تيار القصر عبر جسمه إلى الأرض إذا لم يكن الهيكل مؤرضاً.')
    +S5.hot(10,210,340,30,'الأرض ⟦(GROUND)⟧.')+S5.ar(180,272,'العازل انهار والهيكل تكهرب',{fs:14,b:1})),
   cap:'رسم مبسّط للشكل <span class="ltr">(5-9)</span> بعباراته الإنجليزية.<br><b>مرّر المؤشر على الهيكل والشخص والأرض (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'الأجزاء المعدنية مؤرضة والشبكة غير مؤرضة، ولمس شخص الهيكل المتكهرب. أين يذهب تيار القصر؟',opts:[
     ['كله عبر جسم الإنسان',false,'هذا إذا كانت الأجزاء المعدنية غير مؤرضة.'],
     ['لا شيء عبر جسم الإنسان',false,'الكتاب يقول إن جزءاً يمر عبر الجسم في هذه الحالة.'],
     ['جزء عبر جسم الإنسان، والجزء الثاني عبر أسلاك التأريض',true,'«فإن جزءاً من تيار القصر يمر عبر جسم الإنسان إلى الأرض، والجزء الثاني يمر عبر أسلاك التأريض» (ص 87).']]}}
   ],
   body:[
    {book:"<p><b>ج- لمس مادة ناقلة وغير حاملة للتيار، ولكنها واقعة تحت تأثير خطأ:</b> <span class=\"ref\">ص 87</span> وذلك عند لمس الأجزاء المعدنية التي وقعت تحت التوتر صدفة نتيجة لفشل العازل (انهيار عازل)، مثل الجسم الخارجي للآلات، وعلب توصيل الكابلات… إلخ؛ فإذا كانت هذه الأجزاء المعدنية غير مؤرضة والشبكة غير مؤرضة، فإن تيار القصر يمر عبر جسم الإنسان إلى الأرض، ويتعلق هذا التيار بقيمة تيار القصر إلى الأرض (الشكل 5-9).</p>",ref:'ص 87'},
    {book:"<p>وأما إذا كانت هذه الأجزاء المعدنية مؤرضة والشبكة غير مؤرضة، فإن جزءاً من تيار القصر يمر عبر جسم الإنسان إلى الأرض، والجزء الثاني يمر عبر أسلاك التأريض (الشكل 5-10).</p>",ref:'ص 87'},
    {watch:"الشكل (5-10) لا يطابق نص الفقرة تماماً: النص عن أجزاء معدنية مؤرضة وشبكة غير مؤرضة، أما الشكل فيُظهر مصدراً مؤرضاً (Source earth) وجهازاً انقطع موصل أرضيه (Break in earth conductor)، فيمر تيار الصدمة كله عبر الشخص. الشكل مفيد لأنه يبين لماذا يجب «المحافظة على استمرارية موصل سلك التأريض» (ص 78).",fix:true},
    {title:'مختبر مصغّر: هل الهيكل مؤرض؟',widget:(el,B)=>DCML.lab(el,B,{intro:'الشبكة غير مؤرضة في الحالتين (كما في نص الكتاب). غيّر حالة تأريض الأجزاء المعدنية وراقب أين يذهب تيار القصر.',
     ins:[{k:'g',l:'الأجزاء المعدنية',seg:[['no','غير مؤرضة'],['yes','مؤرضة']],v:'no'}],
     calc:(s)=>{const g=s.g==='yes';
      const pic=`<svg viewBox="0 0 320 170" role="img" aria-label="توزع تيار القصر" style="font-family:var(--font)"><rect x="0" y="140" width="320" height="30" fill="var(--blue-soft)"/><rect x="150" y="40" width="90" height="70" rx="6" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2"/><path d="M230 46L210 80" stroke="var(--stop)" stroke-width="4"/>`+man(100,140,{s:.9,rh:[70,100],lh:[150,70]})+
       `<path d="M150 74L110 66L100 140" fill="none" stroke="var(--live)" stroke-width="${g?2:5}" stroke-dasharray="6 4"/>`+(g?`<path d="M240 90H280V140" fill="none" stroke="var(--on)" stroke-width="5"/><path d="M270 140h20M274 146h12M278 152h4" stroke="var(--fg)" stroke-width="2"/>`:'')+`</svg>`;
      return {pic,bars:[{l:'نصيب جسم الإنسان من تيار القصر',v:g?0.4:1,max:1,txt:g?'جزء':'كله',col:'--stop'},{l:'نصيب أسلاك التأريض',v:g?0.6:0,max:1,txt:g?'الجزء الثاني':'لا شيء',col:'--on'}],
       msg:g?'جزء من تيار القصر يمر عبر جسم الإنسان، والجزء الثاني عبر أسلاك التأريض (ص 87). (طول الأشرطة وصفي، فالكتاب لا يعطي نسبة).':'كل تيار القصر يمر عبر جسم الإنسان إلى الأرض، ويتعلق بقيمة تيار القصر إلى الأرض (الشكل <span class="ltr">5-9</span>، ص 87).',cls:g?'warn':'bad'}}})},
    {tip:'<p>الشكل <span class="ltr">(5-10)</span> يبين حالة قريبة: موصل التأريض <b>مقطوع</b>، فيرجع تيار الصدمة كله عبر الشخص. لذلك يذكر الكتاب في أخطاء التنفيذ «عدم المحافظة على استمرارية موصل سلك التأريض» (ص 78): التأريض المقطوع كأنه غير موجود.</p>',title:'تأريض موجود لكنه مقطوع'}
   ]},

  {st:4,short:'جهد التماس',title:'د: تأثير جهد التماس',ref:'ص 88',
   q:'كلما ابتعدت عن قطب التأريض قلّ جهد الأرض تحت قدميك… فلماذا يكبر جهد التماس؟',
   art:S5.svg('الجهد على سطح الأرض مع البعد عن قطب التأريض','#E6E2F8',S5.nest(curve511({rod:1}),4,70,352,189)
    +S5.hot(36,80,80,60,'قرب القطب: جهد سطح الأرض عالٍ (قريب من جهد القطب).')+S5.hot(180,180,170,50,'بعيداً عن القطب: جهد سطح الأرض منخفض.')
    +S5.hot(20,240,330,24,'المحور الأفقي: البعد عن القطب بالقدم ⟦(Distance from rod, ft)⟧.')
    +S5.ar(180,52,'جهد الأرض يقل بالابتعاد عن الأرضي',{fs:14,b:1})+S5.ar(180,290,'قراءة تقريبية لنقاط الشكل',{fs:12})),
   cap:'إعادة رسم للمنحنى في الشكل <span class="ltr">(5-11)</span> من قراءة تقريبية لنقاطه.<br><b>مرّر المؤشر على طرفي المنحنى والمحور (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'شخص يلمس بيده هيكلاً متصلاً بقطب التأريض، وقدماه على الأرض. ابتعد خطوات عن القطب ويده ما زالت على الهيكل (بسلك طويل). جهد التماس…',opts:[
     ['يقل',false,'جهد الأرض تحت قدميه هو الذي يقل، أما الفرق بين يده وقدميه فيكبر.'],
     ['يكبر',true,'«جهد التماس… يكبر بمقدار ابتعاد الشخص عن المربط الأرضي» (ص 88).'],
     ['يبقى ثابتاً',false,'الجهد تحت قدميه يتغير مع البعد، فيتغير الفرق.']]}}
   ],
   body:[
    {book:"<p>الجهد عند نقطة التفريغ الأرضي بالأرض يساوي القيمة العظمى له، ويقل كلما ابتعدنا عن الأرضي (الشكل 5-11). و<b>جهد التماس</b> هو فرق الجهد الحاصل بين نقطتين من جسم الإنسان، والذي يؤدي لمرور تيار كهربائي فيه، أي:</p>\n$$U_t=I_h\\cdot R_h$$\n<p>حيث \\(I_h\\) التيار المار في جسم الإنسان، و\\(R_h\\) مقاومة جسم الإنسان. ويبين الشكل (5-11) جهد التماس في عدة نقاط، حيث يظهر أن هذا الجهد يكبر بمقدار ابتعاد الشخص عن المربط الأرضي.</p>",ref:'ص 88'},
    {watch:"يكتب الكتاب (ص 88) «وهو فرق نقطة التعادل الحاصل بين نقطتين من جسم الإنسان»، والمقصود «فرق الجهد» كما كتبناه.",fix:true},
    {tip:"قد تبدو الفقرة متناقضة: «الجهد يقل كلما ابتعدنا عن الأرضي» ثم «جهد التماس يكبر بمقدار ابتعاد الشخص». الأولى عن <b>جهد سطح الأرض</b> (المنحنى). والثانية عن <b>جهد التماس</b>: الشخص يلمس بيده هيكلاً متصلاً بالقطب (جهده أعلى قيمة)، وقدماه على أرض جهدها أقل كلما ابتعد؛ فالفرق بين يده وقدميه يكبر بالابتعاد. جرّب الحالتين في المختبر.",title:'ليس تناقضاً'},
    {title:'مختبر مصغّر: ابتعد عن القطب وراقب جهد التماس',widget:(el,B)=>DCML.lab(el,B,{intro:'يد الشخص على هيكل متصل بالقطب (جهده 100 % من جهد القطب). حرّك موضع قدميه على المنحنى (قراءة تقريبية للشكل <span class="ltr">5-11</span>).',
     ins:[{k:'x',l:'بُعد القدمين عن القطب',u:'ft',min:0,max:16,step:0.5,v:2,dp:1}],
     calc:(s,P,B)=>{const p=pAt(s.x),t=100-p;return {pic:curve511({feet:[s.x,s.x],mode:'touch',rod:1}),
      facts:[['جهد الأرض تحت القدمين',DCML.fm(B,p,0)+' %',''],['جهد التماس (اليد − القدمان)',DCML.fm(B,t,0)+' %',t>70?'bad':'hi']],
      msg:`كلما ابتعدت قلّ جهد الأرض تحت القدمين (المنحنى ينزل)، فكبر الفرق بينه وبين جهد اليد. النسب من جهد القطب، والكتاب لا يعطي جهد القطب نفسه.`}}})}
   ]},

  {st:5,short:'جهد الخطوة',title:'هـ: جهد الخطوة',ref:'ص <span class="ltr">88–89</span>',
   q:'موصل ضغط عالٍ سقط على الأرض أمامك… لماذا يُنصح بالقفز بدل المشي؟',
   art:S5.svg('موصل ساقط وحوله حلقات تساوي الجهد وشخص قدماه على حلقتين','#DDEFE6',S5.nest(ringsSVG('a',1,2),0,58,360,198)
    +S5.hot(150,150,60,40,'نقطة سقوط الموصل ⟦12.7 kV⟧: أعلى جهد على الأرض.')
    +S5.hot(250,100,100,90,'قدما الشخص على حلقتين مختلفتين: ⟦10 kV⟧ و⟦8 kV⟧، فيقع بينهما جهد خطوة نحو ⟦2 kV⟧.')
    +S5.ar(180,282,'فرق الجهد بين القدمين',{fs:14,b:1})),
   cap:'رسم مبسّط للشكل <span class="ltr">(5-12)</span>.<br><b>مرّر المؤشر على نقطة السقوط والقدمين (أو المسهما في الجوال) لتعرف معناهما.</b>',
   side:[
    {predict:{q:'جهد الخطوة… من أي نوع من الجهود حسب الكتاب؟',opts:[
     ['جهد المصدر نفسه',false,'جهد الخطوة فرق بين موضعي القدمين فقط.'],
     ['جهد لا علاقة له بالبعد عن الأرضي',false,'«جهد الخطوة يقل تدريجياً بمقدار ما يزداد البعد عن المربط الأرضي».'],
     ['من إحدى حالات جهد التماس',true,'«وهو من إحدى حالات جهد التماس، نتيجة فرق الجهد الحاصل بين القدمين» (ص 88).']]}}
   ],
   body:[
    {book:"<p>وهو من إحدى حالات جهد التماس، نتيجة فرق الجهد الحاصل بين القدمين، أي إن جهد الخطوة يقل تدريجياً بمقدار ما يزداد البعد عن المربط الأرضي. هذا وقد يأخذ جهد الخطوة قيماً خطيرة على جسم الإنسان في بعض الأحيان، وخاصة في محطات الجهد العالي التي يجب أن تكون مؤرضة تأريضاً فعالاً، إذ يلعب جهد الخطوة دوراً رئيساً وهاماً في تصميم الأرضي في المحطات.</p>\n<p>أما في شبكات الجهد المنخفض، فإن جهد الخطوة مهم فقط لحماية الحيوانات الكبيرة (الخيول والأبقار) بسبب خطوتها الكبيرة بين قدميها الأماميتين والخلفيتين، وقد يؤدي هذا التوتر إلى ارتفاع ضغط الدم وتصلب الشرايين، وفي بعض الحالات يؤدي إلى الموت.</p>\n<p>وعند إنقاذ مصاب بجهد الخطوة يجب أن نكون حذرين، وألا نخطو بخطوات كبيرة، ويفضل عندها القفز، والأفضل من ذلك إلقاء سلم خشبي أو ألواح خشبية في مكان الخطر والسير عليها للوصول إلى المصاب. والشكل (5-12) يبين أن الشخص الواقف قد يتعرض لجهد قدره <span class=\"ltr\">2 kV</span>، والشكل (5-13) يبين أن الشخص الواقف قد يتعرض إلى جهد قدره <span class=\"ltr\">2.5 kV</span>.</p>",ref:'ص <span class="ltr">88–89</span>'},
    {title:'مختبر مصغّر: ضع قدميك على الحلقات',widget:(el,B)=>DCML.lab(el,B,{intro:'جهود الحلقات من الشكل <span class="ltr">(5-12)</span>. اختر الحلقة التي تقف عليها كل قدم، أو اقفز بقدمين متلاصقتين.',
     predict:{q:'الشخص قدماه على حلقتي 10 kV و8 kV. كم جهد الخطوة؟',opts:[['18 kV',false,'جهد الخطوة فرق لا مجموع.'],['2 kV',true,'10 − 8 = 2 kV كما يقول الكتاب (ص 89).'],['10 kV',false,'هذا جهد موضع قدم واحدة بالنسبة لأرض بعيدة.']]},
     ins:[{k:'a',l:'القدم الأولى على',seg:RINGS.a.r.map((r,i)=>[i,r[1]]),v:1},{k:'b',l:'القدم الثانية على',seg:RINGS.a.r.map((r,i)=>[i,r[1]]),v:2},{k:'j',l:'قفز',sw:true,v:0,on:'القدمان متلاصقتان (قفز)',off:'خطوة عادية'}],
     calc:(s,P,B)=>{const b=s.j?s.a:s.b,d=Math.abs(RINGS.a.r[s.a][0]-RINGS.a.r[b][0])/1000;
      return {pic:ringsSVG('a',s.a,b),facts:[['جهد الخطوة',DCML.fm(B,d,1)+' kV',d>0?'bad':'hi']],
       msg:s.j?'القدمان في موضع واحد فلا فرق جهد بينهما: لذلك «يفضل عندها القفز» (ص 89)، والأفضل إلقاء سلم خشبي أو ألواح خشبية والسير عليها.':d===0?'القدمان على حلقة واحدة: لا فرق جهد بينهما.':`فرق الجهد بين القدمين ${DCML.fm(B,d,1)} kV — كلما كانت الخطوة أكبر (القدمان على حلقتين أبعد) كبر جهد الخطوة.`,cls:d>0?'bad':''}}})},
    {tip:'<p>الشكل <span class="ltr">(5-13)</span> يعطي مثالاً ثانياً: القدم الأمامية عند <span class="ltr">A (5000 V)</span> والخلفية عند <span class="ltr">B (2500 V)</span>، فجهد الخطوة <span class="ltr">2500 V = 2.5 kV</span>.</p>',title:'المثال الثاني في الكتاب'}
   ]},

  {st:6,short:'خطوط الضغط العالي',title:'ز: خطوط الضغط العالي… قنابل بيئية موقوتة',ref:'ص <span class="ltr">90–92</span>',
   q:'برج ضغط عالٍ قرب حي سكني: ما الخطر المؤكد فعلاً، وما الذي ما زال ادعاءً؟',
   art:S5.svg('برج ضغط عالٍ ومنزل قريب، مع المجالين الكهربائي والمغناطيسي','#F7DCC8',
     S5.tip('برج الضغط العالي وأسلاكه: يصدر المجال الكهربائي لمجرد وجود جهد على الأسلاك، ويزداد بزيادة الجهد.',`<path d="M110 280L140 70L170 280M118 220h44M124 170h32M130 120h20M100 90h80" fill="none" stroke="#2C4A40" stroke-width="4" stroke-linejoin="round"/><path d="M20 92Q100 110 180 92T340 92" fill="none" stroke="#2C4A40" stroke-width="2.5"/>`)
    +S5.tip('المجال المغناطيسي: يصاحب مرور التيار في الأسلاك، ويزداد بزيادة التيار.',`<ellipse cx="260" cy="96" rx="40" ry="16" fill="none" stroke="#2F6FD0" stroke-width="2.5" stroke-dasharray="6 4"/><ellipse cx="260" cy="96" rx="64" ry="28" fill="none" stroke="#2F6FD0" stroke-width="2" stroke-dasharray="6 4"/>`)
    +S5.tip('المنزل القريب: يطالب الكتاب بأن تكون مسارات الخطوط بعيدة عن التجمعات السكنية، ورفع الأبراج أو دفن الخطوط يقلل ضررها.',`<path d="M230 280V210L270 180L310 210V280Z" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round"/><rect x="258" y="240" width="24" height="40" fill="#E8735A"/>`)
    +S5.tip('لافتة تحذير: يطالب الكتاب بإلزام شركات الكهرباء بوضع لافتات تحذر من خطورة خطوط الضغط العالي.',`<path d="M60 230l24-42 24 42z" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><path d="M86 200l-6 14h6l-4 12 10-16h-6l4-10z" fill="#2C4A40"/><path d="M84 230v40" stroke="#2C4A40" stroke-width="3"/>`)),
   cap:'رسم توضيحي لعناصر البند.<br><b>مرّر المؤشر على البرج والمجال والمنزل واللافتة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'حسب الكتاب، بمَ يزداد المجال المغناطيسي حول خطوط الضغط العالي؟',opts:[
     ['بزيادة التيار',true,'«أما المجال المغناطيسي فيزداد بزيادة التيار» (ص 91).'],
     ['بزيادة الجهد',false,'المجال الكهربائي هو الذي يزداد بزيادة الجهد.'],
     ['بزيادة ارتفاع البرج',false,'رفع الأبراج يقلل ضررها على السكان حسب الكتاب.']]}}
   ],
   body:[
    {book:"<p>تنتشر في العديد من المدن العربية خطوط الكهرباء ذات الضغط العالي وسط التجمعات السكنية، إما جهلاً أو تجاهلاً لآثارها الصحية الخطيرة على الإنسان، وعلى الرغم من تحذير العديد من الدراسات من مخاطر إقامة هذه الخطوط بالقرب من المساكن، فإن القوانين في معظم البلدان العربية لا تجرم ذلك، كما أن شركات الكهرباء لا تجد من يلزمها باتخاذ الاحتياطات اللازمة للحد من مخاطر هذه الخطوط.</p>\n<p>دراسات طبية عديدة في علوم الطب الوبائي أكدت أن الإرهاق النفسي والعصبي هو الظاهرة الأولى التي تنتاب المعرضين لأسلاك ومحطات الضغط الكهربائي العالي، يليها السهر والأرق، لأن زيادة إيقاع العمل بالمخ يحول دون استرخاء الجسم ويحرم الفرد من النوم، وبالتالي استرداد قواه ونشاطه.</p>\n<p>وقد لاحظ الباحثون على المدى الطويل زيادة الإصابة بسرطان الدم عند الأطفال الذين تقع منازلهم بالقرب من أبراج وخطوط الضغط العالي، وتبين لهم من دراستهم لأربع مئة ألف شخص يسكنون بالقرب من خطوط وأبراج الضغط العالي إصابة العديد منهم بعدد من الأمراض والاضطرابات، من بينها بعض الأورام وسرطانات الدم والدماغ، والتي وضعت جميعها تحت اسم أمراض العصر أو أمراض المدنية، كما وجد أن معدل الإصابة بسرطان الدم اللمفاوي هو أعلى من المعدل المتوقع لدى العاملين في مجال صناعات الطاقة الكهربائية وبعض الصناعات المشابهة لها.</p>\n<p>وكشفت دراسة للمركز القومي للبحوث بالقاهرة أن خطوط الضغط العالي للكهرباء تؤدي إلى جملة من الأمراض الخطيرة، على رأسها أمراض القلب، وتشوه الأجنة، وسرطان الثدي، إضافة إلى تدمير البناء الكيميائي لخلايا الجسم، وتعطيل وظائف الخلايا، واضطراب إفراز الإنزيمات في الجسم، واضطراب الدماغ، والخمول والكسل وعدم الرغبة في العمل، واضطراب معدلات الكالسيوم، والشرود، والهذيان.</p>\n<p>إن مصدر الخطر في خطوط الضغط العالي الكهربائية يكمن في زيادة المجالات الكهرومغناطيسية، حيث تصدر المجالات الكهربائية لمجرد وجود جهد كهربائي على الأسلاك، أما المجالات المغناطيسية فهي تصاحب مرور التيار في الأسلاك، ويزداد المجال الكهربائي بزيادة الجهد، أما المجال المغناطيسي فيزداد بزيادة التيار. ونظراً لخطورة المجالات الكهرومغناطيسية على صحة البشر، فقد قامت بعض الدول الأوروبية بسن التشريعات التي تحدد حد الأمان بالنسبة للموجات الكهرومغناطيسية التي يتعرض لها الإنسان، وهو <span class=\"ltr\">200</span> «ميكروات»، وهذا هو الحد الأقصى المسموح به. <span class=\"ref\">ص 91</span></p>\n<p>الدراسات أوضحت أن تأثر الجسم بالموجات الكهرومغناطيسية الصادرة عن خطوط الضغط العالي يزداد في حالة زيادة الذبذبات الخاصة بالإشعاع، وزيادة فترة التعرض له، كما يتفاوت التأثير وفقاً لنوع الملابس التي يرتديها الشخص، حيث تعمل بعض الملابس كعاكس للموجات. كما وجد أن زيادة حركة الهواء المحيط بالجسم يقلل من تأثير الإشعاع، وأن تأثير الإشعاع يتزايد مع ارتفاع نسبة الرطوبة في الجو وزيادة درجة حرارة الجو المحيط، كما يزداد تأثير الإشعاع في الأعضاء أو الأنسجة التي تقل فيها كمية الدم بصفة عامة مثل العين، وكلما قل عمر الشخص زاد امتصاص جسمه للإشعاع، فالكمية التي يمتصها الطفل أكبر من التي يمتصها البالغ بمعدلات كبيرة. وشركات الكهرباء من جانبها تنفي دائماً وجود أية أخطار مؤكدة من خطوط الضغط العالي، ولا تحاول البحث عن حلول للتعامل مع خطوط الضغط العالي وتقليل الحقل المغناطيسي الناتج عن خطوط الكهرباء والمحطات والمحولات، وتتمثل أهم هذه الحلول في وضع درع حماية يتكون من صفائح من النيكل والحديد والنحاس حول أسلاك الضغط العالي، ولكنها طريقة باهظة التكاليف، ولا توفر الحماية إلا لمنطقة محدودة، كما يمكن لهذه الشركات زيادة ارتفاع أبراج الضغط العالي، مما يقلل ضررها على السكان القاطنين بالقرب منها.</p>\n<p>وبمقدور هذه الشركات أيضاً دفن خطوط الضغط العالي تحت الأرض وتغطيتها بالمطاط أو البلاستيك، بما يقلل من خطرها، ولكن تلك العملية ما زالت مرتفعة التكلفة ويستغرق تنفيذها وقتاً، كما أن تكلفة الإصلاح في حالة العطل تكون مرتفعة. وهكذا فإن التكلفة المرتفعة هي السبب الوحيد الذي تحاول شركات الكهرباء أن تتفاداه.</p>\n<p>ولتجنب الأضرار الناجمة عن خطوط الضغط العالي، يجب على السلطات المعنية تحديد مسارات خطوط وأبراج الضغط العالي بحيث تكون بعيدة عن التجمعات السكنية، وألا تسمح للعمران بأن يزحف إلى هذه المسارات، وأن تقوم بمراقبة تطور صحة القاطنين في المناطق القريبة من خطوط وأبراج الضغط العالي الكهربائية، وذلك من خلال الرصد المستمر للإشعاعات الكهرومغناطيسية ومدى تأثر صحة الإنسان بها، عبر قياس فترة التعرض وشدة تركيز الإشعاع الصادر، مع إلزام شركات الكهرباء بوضع اللافتات التي تحذر المواطنين من خطورة خطوط وشبكات الضغط العالي. كما يجب على وسائل الإعلام توعية المواطنين بالمخاطر الصحية الناجمة عن السكنى بالقرب من أبراج ومحطات وخطوط الضغط العالي. <span class=\"ref\">ص 91–92</span></p>",ref:'ص <span class="ltr">90–92</span>'},
    {watch:"هذا البند (ص 90–92) مقال صحفي أكثر منه مادة علمية، وأغلب ادعاءاته الصحية (سرطان الثدي، وتشوه الأجنة، وأمراض القلب، والهذيان، والأرق…) <b>غير مثبتة علمياً</b>. فمنظمة الصحة العالمية تصنّف المجالات المغناطيسية منخفضة التردد في الفئة «ربما مسرطنة للإنسان» (2B) فقط، بسبب ارتباط ضعيف وغير مؤكد بسرطان الدم عند الأطفال، ولم تثبت لها الأضرار الأخرى المذكورة. أما خطر الصعق والقوس الكهربائي من خطوط الضغط العالي فخطر حقيقي ومؤكد. وفي النص أيضاً: «بزيارة التيار» والصواب «بزيادة» (صححناها)، و«200 ميكروات» بلا وحدة كاملة. وترقيم البنود يقفز من (هـ) إلى (ز) بلا (و).",fix:true},
    {title:'مختبر مصغّر: حقيقة مؤكدة أم ادعاء غير مثبت؟',widget:(el,B)=>DCML.sort(el,B,{intro:'صنّف كل عبارة. التصنيف مبني على الملاحظة المكتوبة تحت نص الكتاب (منظمة الصحة العالمية).',cats:['خطر أو حقيقة مؤكدة','ادعاء غير مثبت علمياً'],items:[
     ['الاقتراب الشديد من أسلاك الضغط العالي قد يسبب قوساً كهربائياً وصعقاً.',0,'خطر الصعق والقوس من خطوط الضغط العالي خطر حقيقي ومؤكد.'],
     ['المجال الكهربائي يزداد بزيادة الجهد، والمجال المغناطيسي يزداد بزيادة التيار.',0,'معلومة فيزيائية صحيحة في نص الكتاب (ص 91).'],
     ['السكن قرب خطوط الضغط العالي يسبب سرطان الثدي وتشوه الأجنة وأمراض القلب.',1,'لم تثبت هذه الأضرار علمياً.'],
     ['السكن قرب خطوط الضغط العالي يسبب الأرق والهذيان والخمول.',1,'ادعاءات صحية غير مثبتة علمياً.'],
     ['يضعف المجال كلما ابتعدنا عن الأسلاك؛ لذلك رفع الأبراج يقلل المجال عند المساكن.',0,'صحيح فيزيائياً، ويوافق قول الكتاب إن رفع الأبراج يقلل ضررها.']]})}
   ]},

  {recap:[
   'يتضرر الإنسان عندما يلامس في وقت واحد نقطتين بينهما فرق في الجهد: خطين معاً، أو خطاً والأرض، أو هيكلاً تكهرب بعطل.',
   'لمس خطين: يقع على الجسم جهد الخط (√3 مرة جهد الطور)، فالتيار أكبر من لمس خط واحد.',
   'في الشبكة المؤرضة يعود التيار عبر الأرض وقطب التأريض، وفي المعزولة عبر ممانعة الخطوط مع الأرض؛ والهيكل المؤرض يأخذ جزءاً من تيار القصر بعيداً عن الجسم.',
   'جهد الأرض يقل بالبعد عن الأرضي؛ فجهد التماس (يد – قدمين) يكبر بالابتعاد، وجهد الخطوة (قدم – قدم) يقل بالابتعاد.',
   'عند الوصول إلى مصاب بجهد الخطوة: لا خطوات كبيرة، ويفضّل القفز، والأفضل السير على سلم أو ألواح خشبية.']}
],
 theory:[
  {h:'5-4 الحالات الناجمة عن مرور التيار الكهربائي إلى الأرض عبر جسم الإنسان',ref:'ص 86',html:`<p>الحالات التي يتضرر بها الإنسان عندما يلامس في وقت واحد نقطتين يوجد بينهما فرق في الجهد، وهي الحالات التالية:</p>
   <p><b>أ- لمس خطين معاً ناقلين للتيار:</b> يبين الشكل (5-6) تلامس يدي الإنسان لخطين من شبكة ثلاثية الأوجه. ويتعلق التيار المار في جسم الإنسان بجهد الشبكة ومقاومة جسم الإنسان، أي:</p>
   $$I_h=\\frac{\\sqrt{3}\\,U}{R_h}$$`},
  {note:TIP+'الكتاب لا يعرّف الرموز هنا: \\(I_h\\) التيار المار في جسم الإنسان، و\\(R_h\\) مقاومة جسم الإنسان، و\\(U\\) <b>جهد الطور</b>؛ فيكون \\(\\sqrt3\\,U\\) هو جهد الخط الذي يقع بين اليدين. مثلاً في شبكة 220/380 V: \\(\\sqrt3\\times220\\approx381\\) V.'},
  {fig:'(5-6)',ref:'ص 86',caption:'لمس خطين معاً — رسم مبسّط',draw:()=>box(fig56(false),320)},
  {html:`<p><b>ب- لمس خط واحد ناقل للتيار:</b> إذا كانت الشبكة ذات نقطة تعادل معزولة تماماً عن الأرض، يتم في هذا التلامس قصر دائرة التيار من خلال جسم الإنسان والممانعة المتشكلة بين خطوط الشبكة والأرض (الشكل 5-7). أما إذا كانت الشبكة ذات نقطة تعادل مؤرضة، فيتم في هذا التلامس قصر دائرة التيار من خلال جسم الإنسان والأرض وقطب التأريض (الشكل 5-8).</p>`},
  {err:'<span class="fixnote">يكتب الكتاب (ص 86) «إذا كانت الشبكة ذات قطب معزولة… ذات قطب مؤرض»، والمقصود نقطة التعادل (نقطة النجمة) للشبكة، معزولة عن الأرض أو مؤرضة، كما كتبناها.</span>'},
  {fig:'(5-7)',ref:'ص 86',caption:'لمس خط واحد في شبكة معزولة عن الأرض: يعود التيار عبر مقاومات العزل r ومكثفات الخطوط C مع الأرض — رسم مبسّط',draw:()=>box(fig57(),480)},
  {fig:'(5-8)',ref:'ص 86',caption:'لمس خط واحد مع الوقوف على الأرض في شبكة مؤرضة — رسم مبسّط',draw:()=>box(fig56(true),320)},
  {html:`<p><b>ج- لمس مادة ناقلة وغير حاملة للتيار، ولكنها واقعة تحت تأثير خطأ:</b> <span class="ref">ص 87</span> وذلك عند لمس الأجزاء المعدنية التي وقعت تحت التوتر صدفة نتيجة لفشل العازل (انهيار عازل)، مثل الجسم الخارجي للآلات، وعلب توصيل الكابلات… إلخ؛ فإذا كانت هذه الأجزاء المعدنية غير مؤرضة والشبكة غير مؤرضة، فإن تيار القصر يمر عبر جسم الإنسان إلى الأرض، ويتعلق هذا التيار بقيمة تيار القصر إلى الأرض (الشكل 5-9).</p>`},
  {fig:'(5-9)',ref:'ص 87',caption:'جهاز هيكله المعدني «عائم» لمسه قضيب حي، وشخص يلمسه فيمر التيار عبره إلى الأرض — رسم مبسّط بعبارات الشكل الإنجليزية',draw:()=>box(fig59(),480)},
  {html:`<p>وأما إذا كانت هذه الأجزاء المعدنية مؤرضة والشبكة غير مؤرضة، فإن جزءاً من تيار القصر يمر عبر جسم الإنسان إلى الأرض، والجزء الثاني يمر عبر أسلاك التأريض (الشكل 5-10).</p>`},
  {fig:'(5-10)',ref:'ص 87',caption:'جهاز من الفئة الأولى (Class I) فيه عطل أرضي وموصل الأرض مقطوع: يعود تيار الصدمة عبر الشخص والأرض إلى أرضي المصدر — رسم مبسّط',draw:()=>box(fig510(),480)},
  {err:'<span class="fixnote">الشكل (5-10) لا يطابق نص الفقرة تماماً: النص عن أجزاء معدنية مؤرضة وشبكة غير مؤرضة، أما الشكل فيُظهر مصدراً مؤرضاً (Source earth) وجهازاً انقطع موصل أرضيه (Break in earth conductor)، فيمر تيار الصدمة كله عبر الشخص. الشكل مفيد لأنه يبين لماذا يجب «المحافظة على استمرارية موصل سلك التأريض» (ص 78).</span>'},
  {h:'د- تأثير جهد التماس',ref:'ص 88',html:`<p>الجهد عند نقطة التفريغ الأرضي بالأرض يساوي القيمة العظمى له، ويقل كلما ابتعدنا عن الأرضي (الشكل 5-11). و<b>جهد التماس</b> هو فرق الجهد الحاصل بين نقطتين من جسم الإنسان، والذي يؤدي لمرور تيار كهربائي فيه، أي:</p>
   $$U_t=I_h\\cdot R_h$$
   <p>حيث \\(I_h\\) التيار المار في جسم الإنسان، و\\(R_h\\) مقاومة جسم الإنسان. ويبين الشكل (5-11) جهد التماس في عدة نقاط، حيث يظهر أن هذا الجهد يكبر بمقدار ابتعاد الشخص عن المربط الأرضي.</p>`},
  {fig:'(5-11)',ref:'ص 88',caption:'الجهد على سطح الأرض بالنسبة لأرض بعيدة مع البعد عن قطب التأريض (Distance from rod) — أعيد رسمه من قراءة تقريبية لنقاط المنحنى',draw:()=>box(curve511({rod:1}),560)},
  {err:'<span class="fixnote">يكتب الكتاب (ص 88) «وهو فرق نقطة التعادل الحاصل بين نقطتين من جسم الإنسان»، والمقصود «فرق الجهد» كما كتبناه.</span>'},
  {note:TIP+'قد تبدو الفقرة متناقضة: «الجهد يقل كلما ابتعدنا عن الأرضي» ثم «جهد التماس يكبر بمقدار ابتعاد الشخص». الأولى عن <b>جهد سطح الأرض</b> (المنحنى). والثانية عن <b>جهد التماس</b>: الشخص يلمس بيده هيكلاً متصلاً بالقطب (جهده أعلى قيمة)، وقدماه على أرض جهدها أقل كلما ابتعد؛ فالفرق بين يده وقدميه يكبر بالابتعاد. جرّب الحالتين في المختبر.'},
  {h:'هـ- جهد الخطوة',ref:'ص 88–89',html:`<p>وهو من إحدى حالات جهد التماس، نتيجة فرق الجهد الحاصل بين القدمين، أي إن جهد الخطوة يقل تدريجياً بمقدار ما يزداد البعد عن المربط الأرضي. هذا وقد يأخذ جهد الخطوة قيماً خطيرة على جسم الإنسان في بعض الأحيان، وخاصة في محطات الجهد العالي التي يجب أن تكون مؤرضة تأريضاً فعالاً، إذ يلعب جهد الخطوة دوراً رئيساً وهاماً في تصميم الأرضي في المحطات.</p>
   <p>أما في شبكات الجهد المنخفض، فإن جهد الخطوة مهم فقط لحماية الحيوانات الكبيرة (الخيول والأبقار) بسبب خطوتها الكبيرة بين قدميها الأماميتين والخلفيتين، وقد يؤدي هذا التوتر إلى ارتفاع ضغط الدم وتصلب الشرايين، وفي بعض الحالات يؤدي إلى الموت.</p>
   <p>وعند إنقاذ مصاب بجهد الخطوة يجب أن نكون حذرين، وألا نخطو بخطوات كبيرة، ويفضل عندها القفز، والأفضل من ذلك إلقاء سلم خشبي أو ألواح خشبية في مكان الخطر والسير عليها للوصول إلى المصاب. والشكل (5-12) يبين أن الشخص الواقف قد يتعرض لجهد قدره ${lt('2 kV')}، والشكل (5-13) يبين أن الشخص الواقف قد يتعرض إلى جهد قدره ${lt('2.5 kV')}.</p>`},
  {fig:'(5-12)',ref:'ص 89',caption:'موصل 12.7 kV ساقط وحوله حلقات تساوي الجهد 10 و8 و6 kV؛ الشخص بين حلقتي 10 و8 kV «يتعرض لنحو 2 kV» (This person would receive approx 2 kV) — رسم مبسّط',draw:()=>box(ringsSVG('a',1,2),500)},
  {fig:'(5-13)',ref:'ص 89',caption:'جهد الخطوة (Step Potential): القدم الأمامية عند A (5000 V) والخلفية عند B (2500 V) — رسم مبسّط',draw:()=>box(ringsSVG('b',0,1),500)},
  {h:'ز- خطوط الضغط العالي… قنابل بيئية موقوتة',ref:'ص 90–92',html:`<p>تنتشر في العديد من المدن العربية خطوط الكهرباء ذات الضغط العالي وسط التجمعات السكنية، إما جهلاً أو تجاهلاً لآثارها الصحية الخطيرة على الإنسان، وعلى الرغم من تحذير العديد من الدراسات من مخاطر إقامة هذه الخطوط بالقرب من المساكن، فإن القوانين في معظم البلدان العربية لا تجرم ذلك، كما أن شركات الكهرباء لا تجد من يلزمها باتخاذ الاحتياطات اللازمة للحد من مخاطر هذه الخطوط.</p>
   <p>دراسات طبية عديدة في علوم الطب الوبائي أكدت أن الإرهاق النفسي والعصبي هو الظاهرة الأولى التي تنتاب المعرضين لأسلاك ومحطات الضغط الكهربائي العالي، يليها السهر والأرق، لأن زيادة إيقاع العمل بالمخ يحول دون استرخاء الجسم ويحرم الفرد من النوم، وبالتالي استرداد قواه ونشاطه.</p>
   <p>وقد لاحظ الباحثون على المدى الطويل زيادة الإصابة بسرطان الدم عند الأطفال الذين تقع منازلهم بالقرب من أبراج وخطوط الضغط العالي، وتبين لهم من دراستهم لأربع مئة ألف شخص يسكنون بالقرب من خطوط وأبراج الضغط العالي إصابة العديد منهم بعدد من الأمراض والاضطرابات، من بينها بعض الأورام وسرطانات الدم والدماغ، والتي وضعت جميعها تحت اسم أمراض العصر أو أمراض المدنية، كما وجد أن معدل الإصابة بسرطان الدم اللمفاوي هو أعلى من المعدل المتوقع لدى العاملين في مجال صناعات الطاقة الكهربائية وبعض الصناعات المشابهة لها.</p>
   <p>وكشفت دراسة للمركز القومي للبحوث بالقاهرة أن خطوط الضغط العالي للكهرباء تؤدي إلى جملة من الأمراض الخطيرة، على رأسها أمراض القلب، وتشوه الأجنة، وسرطان الثدي، إضافة إلى تدمير البناء الكيميائي لخلايا الجسم، وتعطيل وظائف الخلايا، واضطراب إفراز الإنزيمات في الجسم، واضطراب الدماغ، والخمول والكسل وعدم الرغبة في العمل، واضطراب معدلات الكالسيوم، والشرود، والهذيان.</p>
   <p>إن مصدر الخطر في خطوط الضغط العالي الكهربائية يكمن في زيادة المجالات الكهرومغناطيسية، حيث تصدر المجالات الكهربائية لمجرد وجود جهد كهربائي على الأسلاك، أما المجالات المغناطيسية فهي تصاحب مرور التيار في الأسلاك، ويزداد المجال الكهربائي بزيادة الجهد، أما المجال المغناطيسي فيزداد بزيادة التيار. ونظراً لخطورة المجالات الكهرومغناطيسية على صحة البشر، فقد قامت بعض الدول الأوروبية بسن التشريعات التي تحدد حد الأمان بالنسبة للموجات الكهرومغناطيسية التي يتعرض لها الإنسان، وهو ${lt('200')} «ميكروات»، وهذا هو الحد الأقصى المسموح به. <span class="ref">ص 91</span></p>
   <p>الدراسات أوضحت أن تأثر الجسم بالموجات الكهرومغناطيسية الصادرة عن خطوط الضغط العالي يزداد في حالة زيادة الذبذبات الخاصة بالإشعاع، وزيادة فترة التعرض له، كما يتفاوت التأثير وفقاً لنوع الملابس التي يرتديها الشخص، حيث تعمل بعض الملابس كعاكس للموجات. كما وجد أن زيادة حركة الهواء المحيط بالجسم يقلل من تأثير الإشعاع، وأن تأثير الإشعاع يتزايد مع ارتفاع نسبة الرطوبة في الجو وزيادة درجة حرارة الجو المحيط، كما يزداد تأثير الإشعاع في الأعضاء أو الأنسجة التي تقل فيها كمية الدم بصفة عامة مثل العين، وكلما قل عمر الشخص زاد امتصاص جسمه للإشعاع، فالكمية التي يمتصها الطفل أكبر من التي يمتصها البالغ بمعدلات كبيرة. وشركات الكهرباء من جانبها تنفي دائماً وجود أية أخطار مؤكدة من خطوط الضغط العالي، ولا تحاول البحث عن حلول للتعامل مع خطوط الضغط العالي وتقليل الحقل المغناطيسي الناتج عن خطوط الكهرباء والمحطات والمحولات، وتتمثل أهم هذه الحلول في وضع درع حماية يتكون من صفائح من النيكل والحديد والنحاس حول أسلاك الضغط العالي، ولكنها طريقة باهظة التكاليف، ولا توفر الحماية إلا لمنطقة محدودة، كما يمكن لهذه الشركات زيادة ارتفاع أبراج الضغط العالي، مما يقلل ضررها على السكان القاطنين بالقرب منها.</p>
   <p>وبمقدور هذه الشركات أيضاً دفن خطوط الضغط العالي تحت الأرض وتغطيتها بالمطاط أو البلاستيك، بما يقلل من خطرها، ولكن تلك العملية ما زالت مرتفعة التكلفة ويستغرق تنفيذها وقتاً، كما أن تكلفة الإصلاح في حالة العطل تكون مرتفعة. وهكذا فإن التكلفة المرتفعة هي السبب الوحيد الذي تحاول شركات الكهرباء أن تتفاداه.</p>
   <p>ولتجنب الأضرار الناجمة عن خطوط الضغط العالي، يجب على السلطات المعنية تحديد مسارات خطوط وأبراج الضغط العالي بحيث تكون بعيدة عن التجمعات السكنية، وألا تسمح للعمران بأن يزحف إلى هذه المسارات، وأن تقوم بمراقبة تطور صحة القاطنين في المناطق القريبة من خطوط وأبراج الضغط العالي الكهربائية، وذلك من خلال الرصد المستمر للإشعاعات الكهرومغناطيسية ومدى تأثر صحة الإنسان بها، عبر قياس فترة التعرض وشدة تركيز الإشعاع الصادر، مع إلزام شركات الكهرباء بوضع اللافتات التي تحذر المواطنين من خطورة خطوط وشبكات الضغط العالي. كما يجب على وسائل الإعلام توعية المواطنين بالمخاطر الصحية الناجمة عن السكنى بالقرب من أبراج ومحطات وخطوط الضغط العالي. <span class="ref">ص 91–92</span></p>`},
  {err:'<span class="fixnote">هذا البند (ص 90–92) مقال صحفي أكثر منه مادة علمية، وأغلب ادعاءاته الصحية (سرطان الثدي، وتشوه الأجنة، وأمراض القلب، والهذيان، والأرق…) <b>غير مثبتة علمياً</b>. فمنظمة الصحة العالمية تصنّف المجالات المغناطيسية منخفضة التردد في الفئة «ربما مسرطنة للإنسان» (2B) فقط، بسبب ارتباط ضعيف وغير مؤكد بسرطان الدم عند الأطفال، ولم تثبت لها الأضرار الأخرى المذكورة. أما خطر الصعق والقوس الكهربائي من خطوط الضغط العالي فخطر حقيقي ومؤكد. وفي النص أيضاً: «بزيارة التيار» والصواب «بزيادة» (صححناها)، و«200 ميكروات» بلا وحدة كاملة. وترقيم البنود يقفز من (هـ) إلى (ز) بلا (و).</span>'}
 ],
 lab:(el)=>lab3(el),
 examples:[
  {title:'مثال (1) — إضافة من خارج الكتاب: جهد الخطوة في الشكل (5-12)',ref:'مبني على الشكل (5-12) ص 89',
   q:'<p>في الشكل (5-12) تقع إحدى قدمي الشخص على حلقة الجهد <span class="ltr">10 kV</span> والأخرى على حلقة <span class="ltr">8 kV</span>. كم جهد الخطوة الذي يتعرض له؟</p>',
   given:[{id:'U1',label:'جهد موضع القدم الأولى',sym:'U_1',unit:'kV',value:10,step:'any'},{id:'U2',label:'جهد موضع القدم الثانية',sym:'U_2',unit:'kV',value:8,step:'any'}],
   solve:(g)=>{const d=B.round(Math.abs(g.U1-g.U2),3);return [{t:'جهد الخطوة = فرق الجهد بين موضعي القدمين:',f:`U_s=U_1-U_2=${g.U1}-${g.U2}`,v:d,unit:'kV',dp:d%1?1:0},{t:'وبالفولت:',v:B.round(d*1000,0),unit:'V',dp:0,final:true}]},
   note:ADD+'الكتاب يذكر النتيجة فقط («قد يتعرض لجهد قدره 2 kV»)؛ هنا خطوات الوصول إليها.'},
  {title:'مثال (2) — إضافة من خارج الكتاب: جهد الخطوة في الشكل (5-13)',ref:'مبني على الشكل (5-13) ص 89',
   q:'<p>في الشكل (5-13) قدم الشخص الأمامية عند النقطة A وجهدها <span class="ltr">5000 V</span>، والخلفية عند B وجهدها <span class="ltr">2500 V</span>. كم جهد الخطوة؟</p>',
   given:[{id:'UA',label:'جهد النقطة A',sym:'U_A',unit:'V',value:5000,step:'any'},{id:'UB',label:'جهد النقطة B',sym:'U_B',unit:'V',value:2500,step:'any'}],
   solve:(g)=>{const d=B.round(Math.abs(g.UA-g.UB),1);return [{t:'جهد الخطوة:',f:`U_s=U_A-U_B=${g.UA}-${g.UB}`,v:d,unit:'V',dp:0},{t:'وبالكيلوفولت:',v:B.round(d/1000,3),unit:'kV',dp:1,final:true}]},
   note:ADD+'يوافق قول الكتاب «قد يتعرض إلى جهد قدره 2.5 kV» (ص 89).'},
  {title:'مثال (3) — إضافة من خارج الكتاب: لمس خطين معاً',ref:'مبني على القانون ص 86 ومقاومة الجسم ص 81 والجدول ص 83',
   q:'<p>عامل لمس بيديه خطين من شبكة ثلاثية الأطوار جهد الطور فيها <span class="ltr">220 V</span> (شبكة 220–380 V، ص 92). خذ مقاومة جسمه <span class="ltr">3000 Ω</span> (ص 81). احسب التيار المار في جسمه بالقانون \\(I_h=\\sqrt3\\,U/R_h\\) واقرأ أثره من الجدول.</p>',
   given:[{id:'U',label:'جهد الطور',sym:'U',unit:'V',value:220,step:'any',min:0},{id:'R',label:'مقاومة جسم الإنسان',sym:'R_h',unit:'Ω',value:3000,step:'any',min:1}],
   solve:(g)=>{const UL=B.round(Math.sqrt(3)*g.U,2),I=B.round(UL/g.R,4),mA=B.round(UL/g.R*1000,1);return [
    {t:'الجهد بين اليدين = جهد الخط:',f:`\\sqrt3\\,U=1.732\\times${g.U}`,v:UL,unit:'V',dp:2},
    {t:'التيار المار في الجسم:',f:`I_h=\\frac{\\sqrt3\\,U}{R_h}=\\frac{${UL}}{${g.R}}`,v:I,unit:'A',dp:4},
    {t:'بالمللي أمبير:',v:mA,unit:'mA',dp:1},zoneSteps(mA)]},
   note:ADD+'لمس خطين أخطر من لمس خط واحد بالجهد نفسه، لأن الجهد الواقع على الجسم هو جهد الخط (أكبر بـ √3 مرة من جهد الطور).'}
 ],
 quiz:[
  {q:'متى يتضرر الإنسان حسب البند 5-4؟',o:['عندما يلمس نقطة واحدة معزولة','عندما يلامس في وقت واحد نقطتين بينهما فرق في الجهد','عندما يقترب من مصباح مضاء','عندما يلبس حذاءً عازلاً'],c:1,e:'«عندما يلامس في وقت واحد نقطتين يوجد بينهما فرق في الجهد» (ص 86).'},
  {q:'في القانون \\(I_h=\\sqrt3\\,U/R_h\\) لمس خطين، ماذا يمثل \\(\\sqrt3\\,U\\)؟',o:['جهد الطور','جهد الخط بين اليدين','مقاومة الجسم','تيار القصر'],c:1,e:'U جهد الطور، و√3·U جهد الخط الذي يقع بين اليدين (توضيح للقانون ص 86).'},
  {q:'كيف يتغير جهد سطح الأرض مع البعد عن قطب التأريض (الشكل 5-11)؟',o:['يزيد','يقل','ثابت','يصير سالباً'],c:1,e:'«الجهد عند نقطة التفريغ الأرضي… يساوي القيمة العظمى له ويقل كلما ابتعدنا عن الأرضي» (ص 88).'},
  {q:'ما العلاقة بين جهد الخطوة وجهد التماس حسب الكتاب؟',o:['جهد التماس حالة من جهد الخطوة','جهد الخطوة من إحدى حالات جهد التماس','لا علاقة بينهما','هما الشيء نفسه دائماً'],c:1,e:'«وهو [جهد الخطوة] من إحدى حالات جهد التماس» (ص 88).'},
  {q:'ماذا ينصح الكتاب عند الوصول إلى مصاب بجهد الخطوة؟',o:['الجري بخطوات واسعة','عدم الخطو بخطوات كبيرة، ويفضّل القفز، والأفضل إلقاء سلم أو ألواح خشبية والسير عليها','لمس المصاب بسرعة','الوقوف قرب نقطة سقوط الموصل'],c:1,e:'كما في ص 89.'},
  {q:'في الشكل (5-13) القدمان عند A (5000 V) وB (2500 V). كم جهد الخطوة؟',o:['7500 V','5000 V','2500 V','0 V'],c:2,e:'5000 − 2500 = 2500 V = 2.5 kV (ص 89).'}
 ]
});

/* =====================================================================
   LESSON 4 — أنواع الإصابات والإسعاف (ص 92–100)
   ===================================================================== */
const BK='safcpr';
const CPR_SRC='إرشادات الإنعاش القلبي الرئوي الحالية (جمعية القلب الأمريكية)';
const fig514=()=>{let s=`<svg viewBox="0 0 420 260" role="img" aria-label="بعض آثار الإصابات الكهربائية">`;
  const cell=(x,y)=>`<rect x="${x}" y="${y}" width="200" height="120" rx="8" style="fill:var(--surface-2);stroke:var(--line)"/>`;
  s+=cell(5,5)+cell(215,5)+cell(5,135)+cell(215,135);
  s+=`<path d="M60 100V60q0-12 10-12t10 12V40q0-10 9-10t9 10v20q0-9 9-9t9 9v40" style="fill:var(--surface);stroke:var(--fg);stroke-width:1.6"/><circle cx="74" cy="80" r="9" style="fill:var(--fg);opacity:.75"/>`+ta(150,64,'حرق في اليد',{m:1})+ta(150,82,'(صورة طبية)',{m:1});
  s+=`<path d="M260 100q-10-40 20-60q30 10 26 60z" style="fill:var(--surface);stroke:var(--fg);stroke-width:1.6"/><circle cx="286" cy="88" r="7" style="fill:var(--fg);opacity:.75"/>`+ta(360,64,'حرق في القدم',{m:1})+ta(360,82,'(صورة طبية)',{m:1});
  s+=`<rect x="40" y="172" width="34" height="34" rx="4" style="fill:var(--surface);stroke:var(--fg)"/>`;[['#d23b2f',20,150],['#2f6fd0',110,160],['#3a3a3a',30,240],['#7a4bd0',120,236]].forEach(([c,x,y])=>{s+=`<path d="M57 189Q${(57+x)/2} ${y-20} ${x} ${y}" style="fill:none;stroke:${c};stroke-width:3"/>`});s+=ta(160,206,'تحميل زائد',{m:1});
  s+=`<path d="M315 150L380 245H250Z" style="fill:var(--live-soft);stroke:var(--fg);stroke-width:2"/><path d="M318 178l-12 26h12l-8 26 20-32h-12l8-20z" style="fill:var(--fg)"/>`;
  return s+'</svg>'};
const fig515=()=>{let s=`<svg viewBox="0 0 420 220" role="img" aria-label="منقذ يقف على بساط عازل ويبعد السلك عن المصاب بعصا خشبية">`;
  s+=`<ellipse cx="140" cy="176" rx="120" ry="30" style="fill:var(--blue-soft)"/><path d="M40 168h170" style="stroke:var(--fg);stroke-width:14;stroke-linecap:round;opacity:.7"/><circle cx="220" cy="164" r="14" style="fill:var(--surface);stroke:var(--fg);stroke-width:2"/>`;
  s+=`<path d="M100 10C110 80 140 120 170 156" style="fill:none;stroke:var(--fg);stroke-width:3"/><path d="M170 156l6 6M170 156l8 -2" style="stroke:var(--live);stroke-width:2.4"/>`;
  s+=`<rect x="300" y="196" width="90" height="10" rx="2" style="fill:var(--muted)"/>`+man(345,196,{s:1.05,rh:[300,128],lh:[318,134]});
  s+=`<path d="M318 134L176 150" style="stroke:#a0703a;stroke-width:5;stroke-linecap:round"/>`;
  s+=ta(345,216,'بساط عازل',{m:1})+ta(240,110,'عصا خشبية',{m:1})+ta(110,212,'منطقة الخطر',{m:1});
  return s+'</svg>'};
const fig516=()=>{let s=`<svg viewBox="0 0 420 150" role="img" aria-label="الطريقة اليدوية القديمة: المصاب على بطنه والمنقذ يضغط على ظهره ثم يرفع ذراعيه">`;
  [0,1,2].forEach(k=>{const x=10+k*138;s+=`<rect x="${x}" y="8" width="130" height="134" rx="8" style="fill:var(--surface-2);stroke:var(--line)"/><path d="M${x+30} 110h86" style="stroke:var(--fg);stroke-width:12;stroke-linecap:round"/><circle cx="${x+22}" cy="108" r="9" style="fill:var(--surface);stroke:var(--fg);stroke-width:2"/>`;
   const hx=x+50;s+=k===2?`<path d="M${x+14} 78l14 24M${x+8} 70q20-10 40 6" style="stroke:var(--fg);stroke-width:2.4;fill:none"/>`:'';
   s+=`<circle cx="${x+(k===1?40:30)}" cy="${k===1?52:60}" r="8" style="fill:var(--surface);stroke:var(--fg);stroke-width:2"/><path d="M${x+(k===1?40:30)} ${k===1?60:68}L${x+20} 96M${x+(k===1?40:30)} ${k===1?62:70}L${hx} 100" style="stroke:var(--fg);stroke-width:2.4"/>`;
   if(k===1)s+=`<path d="M${x+80} 30v30m-8-8l8 10 8-10" style="fill:none;stroke:var(--live);stroke-width:3"/>`;if(k===2)s+=`<path d="M${x+80} 60v-30m-8 8l8-10 8 10" style="fill:none;stroke:var(--blue);stroke-width:3"/>`;
   s+=tl(x+118,26,String(k+1),{m:1})});return s+'</svg>'};
const head=(x,y,good)=>`<g><path d="M${x} ${y}q-34 0-38 30q0 20 18 26l${good?-2:6} ${good?14:10}h28" style="fill:var(--surface);stroke:var(--fg);stroke-width:2" transform="rotate(${good?-18:14} ${x} ${y+30})"/><path d="M${x-6} ${y+38}q${good?-4:8} ${good?6:14} ${good?14:4} ${good?10:20}" style="fill:none;stroke:var(--stop);stroke-width:5;stroke-linecap:round"/><path d="M${x+10} ${y+28}v40" style="stroke:${good?'var(--on)':'var(--stop)'};stroke-width:3;stroke-dasharray:4 3"/></g>`;
const fig517=()=>{let s=`<svg viewBox="0 0 420 150" role="img" aria-label="وضعية الرأس السيئة والصحيحة للنفخ">`;
  s+=`<rect x="5" y="5" width="200" height="140" rx="8" style="fill:var(--surface-2);stroke:var(--line)"/><rect x="215" y="5" width="200" height="140" rx="8" style="fill:var(--surface-2);stroke:var(--line)"/>`;
  s+=head(110,30,false)+head(320,30,true)+ta(105,136,'الوضعية السيئة للرأس')+ta(315,136,'الوضعية الصحيحة للرأس');
  return s+'</svg>'};
const fig518=()=>{let s=`<svg viewBox="0 0 420 170" role="img" aria-label="الضغط على منتصف الصدر بذراعين مستقيمتين">`;
  s+=`<path d="M40 140h300" style="stroke:var(--fg);stroke-width:22;stroke-linecap:round;opacity:.25"/><circle cx="40" cy="132" r="16" style="fill:var(--surface);stroke:var(--fg);stroke-width:2"/><path d="M60 128h120" style="stroke:var(--fg);stroke-width:2"/>`;
  s+=`<circle cx="190" cy="38" r="13" style="fill:var(--surface);stroke:var(--fg);stroke-width:2"/><path d="M196 50L240 110L280 110L300 150M200 54L150 118M206 56L150 118" style="fill:none;stroke:var(--fg);stroke-width:3;stroke-linecap:round"/>`;
  s+=`<rect x="138" y="116" width="26" height="9" rx="3" style="fill:var(--live)"/><path d="M151 70v34m-8-8l8 10 8-10" style="fill:none;stroke:var(--live);stroke-width:3"/>`;
  s+=ta(110,24,'الذراعان مستقيمتان',{m:1})+ta(151,160,'منتصف الصدر',{m:1});
  return s+'</svg>'};

const BOOKCPR=`<div class="bkb" data-bk="${BK}">
 <p><b>ب- التنفس الاصطناعي:</b> <span class="ref">ص 95</span> يتم أولاً بالطريقة اليدوية بمعدل ${lt('12–15')} ضغطة في الدقيقة، مع مراعاة نزع الملابس التي تعيق تنفس المصاب، وفك طوق الرقبة والحزام، وإبقاء الفم مفتوحاً جيداً، ويفضل أن يتم ذلك بواسطة أداة فتح الفم الخشبية، والتأكد من أن اللسان لا يسد الحلق. وعند وصول جهاز التنفس الاصطناعي يتابع العمل به بنفس المعدل السابق حتى استفاقة المصاب من غيبوبته بعد ساعات وبدون توقف، وتتم تدفئة المصاب ببطانية أو غيرها، ويمتنع إعطاؤه أية سوائل بالفم. وتتم عملية تدليك الأطراف في اتجاه القلب حتى يساعد في وصول أكبر كمية من الدم لتنشيط الدورة الدموية. وهنالك طريقتان للتنفس الاصطناعي هما:</p>
 <p><b>1- الطريقة اليدوية (الشكل 5-16):</b> وتقوم على استخدام القوة للضغط على الجسم، وفيها يضغط المنقذ على صدر المصاب بكلتا راحتيه ليطرد هواء الزفير، ثم يخفف الضغط ويطلق يديه ليتيح الفرصة لدخول الشهيق، ويكرر هذا الفعل بالتناوب لتحدث عملية الشهيق أوتوماتيكياً نتيجة المرونة الطبيعية التي يتميز بها الصدر.</p>
 <figure class="fig">${box(fig516(),420)}<figcaption><b>الشكل (5-16)</b> الطريقة اليدوية: المصاب على بطنه، والمنقذ يضغط على ظهره (زفير) ثم يرفع ذراعيه (شهيق) — رسم مبسّط <span class="ref">ص 96</span></figcaption></figure>
 <p><b>2- طريقة النفخ، وهي أفضل الطرق:</b> وتسمى قبلة الحياة، وفيها ينفخ المنقذ الهواء بفيه في فم المصاب، ويجب أن يكون رأس المصاب مائلاً إلى الخلف حتى لا يتسبب اللسان في سد طريق التنفس (الشكل 5-17).</p>
 <ol><li>بعد وضع المصاب على ظهره، وإخراج أية مواد غريبة من فيه، ضع إحدى اليدين تحت رقبة المصاب، واجعل الرقبة مقوسة إلى أعلى، واضغط باليد على جبهة المصاب في الاتجاه إلى أسفل، وهذا الوضع سيؤدي إلى فتح فم المصاب.</li>
 <li>خذ نفساً عميقاً لتملأ صدرك، وافتح فاك وضعه بإحكام على فم المصاب المفتوح، وأغلق أنف المصاب بالسبابة وإبهام يدك التي تضغط على الجبهة، وانفخ في فيه كمية كافية من الهواء لتجعل صدره يرتفع.</li>
 <li>أبعد فاك وراقب انخفاض صدر المصاب، وكرر عملية النفخ بمعدل نفخة كل أربع ثوانٍ.</li>
 <li>إذا لم يكن هناك تبادل للهواء، بمعنى أن صدر المصاب لا يرتفع عند النفخ، يفحص فم المصاب وينظف جيداً من أية أجسام غريبة تعوق دخول الهواء، واستأنف عملية التنفس من الفم بنفخ الهواء بقوة بمعدل مرة كل ${lt('4–5')} ثوانٍ بالنسبة للبالغين، وبقوة أقل بواقع مرة كل ثلاث ثوانٍ للأطفال بعد رفع ذقن المصاب إلى أعلى والأمام. ولا تتوقف حتى يبدأ المصاب في التنفس، إذ تم إعادة بعض المصابين للحياة بعد ساعات من التنفس الاصطناعي المتواصل.</li>
 <li>حتى يحضر الإسعاف أو الطبيب ضع بطانية أو معطفاً تحت المصاب وفوقه لتدفئته، وعندما يستعيد أنفاسه لا تدعه ينهض قبل مرور ساعة على الأقل.</li></ol>
 <figure class="fig">${box(fig517(),420)}<figcaption><b>الشكل (5-17)</b> وضعية الرأس للنفخ: في الوضعية السيئة يسد اللسان مجرى الهواء — رسم مبسّط <span class="ref">ص 97</span></figcaption></figure>
 <p><b>ج- التدليك الخارجي للقلب:</b> <span class="ref">ص 97–99</span> استخدم طريقة التدليك الخارجي للقلب مع عملية التنفس الاصطناعي، ويجب مراعاة عدم تعارض التدليك الخارجي للقلب مع عملية النفخ في فم المصاب، كما يجب أن تكون عملية النفخ في فم المصاب سريعة، ثم يبعد المنقذ فاه عن المصاب ويتركه لتفريغ الهواء من داخله، مع إجراء عملية تدليك خارجي للقلب لضمان استمرار مرور الدم الحامل للأوكسجين لأعضاء الجسم المختلفة مثل المخ والكليتين والقلب (الشكل 5-18).</p>
 <ol><li>هذا إذا كان يقوم بالإجراءات الإسعافية شخص واحد، أما إذا توافر شخصان يجيدان الإسعافات الأولية فيقوم أحدهما بالتنفس الاصطناعي والآخر بتدليك القلب من الخارج.</li>
 <li>لعمل تدليك القلب من الخارج يجب أن يكون المصاب ملقى على ظهره فوق أرض صلبة.</li>
 <li>تحسس صدر المصاب حتى تحدد الطرف السفلي من القفص الصدري، وضع أحد أصابع يدك اليسرى على هذا الطرف، وحرك نهاية كعب اليد اليمنى وليس الكف نحو هذا الإصبع، وضع نهاية راحة اليد اليمنى على الثلث الأسفل من عظمة القفص الصدري، وضع اليد اليسرى فوق اليد اليمنى، وارفع أصابع اليدين عن صدر المصاب كما هو مبين بالشكل.</li>
 <li>إذا لم يكن هناك تبادل للهواء، بمعنى أن صدر المصاب لا يرتفع عند النفخ، يفحص فم المصاب وينظف جيداً من أية أجسام غريبة تعوق دخول الهواء، واستأنف عملية التنفس من الفم بنفخ الهواء بقوة بمعدل مرة كل ${lt('4–5')} ثوانٍ بالنسبة للبالغين، وبقوة أقل بواقع مرة كل ثلاث ثوانٍ للأطفال بعد رفع ذقن المصاب إلى أعلى والأمام. ولا تتوقف حتى يبدأ المصاب في التنفس، إذ تم إعادة بعض المصابين للحياة بعد ساعات من التنفس الاصطناعي المتواصل.</li></ol>
 <figure class="fig">${box(fig518(),420)}<figcaption><b>الشكل (5-18)</b> فحص النبض، والتخلص من الفضلات في الفم، وإرجاع الرأس، والضغط على الصدر، والنفخ — رسم مبسّط لوضع الضغط <span class="ref">ص 98</span></figcaption></figure>
 <p>اضغط لأسفل بسرعة لا تقل عن مرة في الثانية، ويكون الضغط بكلتا اليدين، واستخدم قوة كافية لتضغط اليد السفلى على الثلث السفلي للقفص الصدري بحيث ينخفض مسافة <b>${lt('3–5')} سم</b>، وذلك بأن تبقي ذراعيك مستقيمتين ولا تثنيهما عند الكوع، مستخدماً وزن جسمك كله للضغط من الكتفين، وهذا مما يسهل عليك أداء هذه المهمة لوقت أطول دون تعب كبير. ثم ارفع ثقلك مع بقاء وضع كفيك على صدر المصاب، وكرر هذه العملية بصفة منتظمة… اضغط وارفع الضغط… اضغط وارفع الضغط… وفي كل مرة تضغط على قلب المصاب بين عظمة القفص الصدري والعمود الفقري، فتدفع الدم إلى جسم المصاب، أي أنك تقوم بعمل القلب. <span class="ref">ص 99</span></p>
 <ol start="5"><li>يراعى أن يستمر النفخ في الفم بحيث يتخلل عملية التدليك الخارجي للقلب بمعدل <b>نفس واحد كل خمس ضغطات</b> خارجية.</li></ol>
 <p>ونستخلص من ذلك أنه إذا كان هناك شخص واحد يقوم بعملية التنفس وإسعاف القلب فعليه الآتي: ينفخ في فم المصاب بالطريقة الصحيحة <b>مرتين أو ثلاث مرات</b> متتالية، يتبعها عمل تدليك خارجي للقلب لمدة <b>${lt('12')} ضغطة</b> متتالية، ويستمر ذلك بالتناوب (الشكل 5-18). أما إذا تواجد شخص آخر فاجعله يجلس عند رأس المصاب ويقوم بعملية التنفس الاصطناعي بمعدل مرة واحدة كل خمس ضغطات خارجية على القلب تقوم بها أنت، واستمر في عمل ذلك حتى يستعيد المصاب أنفاسه والقلب نبضاته، ولا بد من أن تستمر هذه الجهود أثناء نقل المصاب بسيارة الإسعاف إلى أقرب نقطة طبية. هذا ويجب المحافظة على نبض القلب، وذلك بتدليكه عن طريق الضغط على الصدر براحتي اليد ثم إعتاقه بمعدل <b>${lt('60')} إلى ${lt('80')} مرة في الدقيقة</b>، وبذلك تتقلص عضلة القلب فتدفع الدم في الدورة الدموية.</p>
 <p>وتظهر علامات الحياة مثل: (1) يتغير لون الوجه من الأزرق إلى الأحمر، (2) يبدأ التنفس الطبيعي، (3) اتساع حدقة العين يبدأ في الضيق، (4) تأكد ظهور النبضات الطبيعية وتلمسها باليد. وعند عدم بدء التنفس الطبيعي واستمرار اتساع حدقة العين رغم مرور أكثر من ساعة على تدليك القلب يدوياً فتكون هذه علامات الوفاة. <span class="ref">ص 100</span></p>
 <div class="callout err"><b>انتبه:</b> هذه الطريقة كما طُبعت في الكتاب قديمة ومخالفة للإرشادات الحالية. اختر «المصحح» في الزر أعلاه لترى الطريقة المعتمدة اليوم.</div>
</div>`;
const FIXCPR=`<div class="bkf blk" data-bk="${BK}">
 <div class="callout"><b>${CPR_SRC}</b> — للبالغ، ويطبّقها أي منقذ تدرّب عليها. بعد خطوة «أ» (فصل التيار وإبعاد المصاب) تسير الإغاثة هكذا:</div>
 <ol><li><b>تأكد من الأمان:</b> لا تلمس المصاب قبل فصل التيار أو إبعاده بأداة عازلة (كما في البند أ).</li>
 <li><b>تحقق من الاستجابة:</b> نادِه بصوت عالٍ واربت على كتفه.</li>
 <li><b>اطلب المساعدة فوراً:</b> اتصل بالإسعاف (أو كلّف شخصاً بذلك)، واطلب إحضار <b>جهاز الصدمات الكهربائية الآلي ${lt('(AED)')}</b>.</li>
 <li><b>تحقق من التنفس</b> في أقل من 10 ثوانٍ: إن كان لا يتنفس، أو يشهق شهقات متقطعة فقط، فابدأ الإنعاش فوراً.</li>
 <li><b>الضغطات على الصدر:</b> المصاب على ظهره فوق سطح صلب، كعب يدك على منتصف الصدر (النصف السفلي من عظمة القص) واليد الأخرى فوقها، والذراعان مستقيمتان. اضغط بعمق <b>${lt('5–6')} سم</b>، وبسرعة <b>${lt('100–120')} ضغطة في الدقيقة</b>، واترك الصدر يرتد كاملاً بعد كل ضغطة، وقلّل التوقف بين الضغطات (أقل من 10 ثوانٍ).</li>
 <li><b>${lt('30')} ضغطة : نفختان</b> — سواء كان المنقذ واحداً أو اثنين. للنفخ: أمل الرأس إلى الخلف وارفع الذقن، وانفخ نحو ثانية واحدة لكل نفخة حتى يرتفع الصدر. من لم يتدرب على النفخ أو لا يستطيعه يكتفي <b>بالضغطات المستمرة</b> دون توقف.</li>
 <li><b>جهاز ${lt('AED')}:</b> شغّله فور وصوله واتبع تعليماته الصوتية، ولا يلمس أحد المصاب عند إعطاء الصدمة، ثم عُد إلى الضغطات فوراً.</li>
 <li><b>استمر</b> حتى يتسلم المسعفون، أو يبدأ المصاب بالتنفس الطبيعي والحركة. إن كان منقذان فليتبادلا الضغطات كل دقيقتين تقريباً لأن التعب يضعف الضغط. وإذا عاد التنفس الطبيعي فضعه على جنبه (وضعية الإفاقة) وراقبه حتى يصل الإسعاف.</li></ol>
 <figure class="fig">${box(fig518(),420)}<figcaption><b>وضع اليدين للضغطات</b>: منتصف الصدر، والذراعان مستقيمتان، والضغط من الكتفين بوزن الجسم <span class="ref">مبني على الشكل (5-18) ص 98</span></figcaption></figure>
 <div class="callout err fixnote"><b>ما الذي تغيّر عن الكتاب (ص 95–100):</b> الطريقة اليدوية بالضغط على الظهر ورفع الذراعين (الشكل 5-16) لم تعد مستعملة. النسبة اليوم <b>30 ضغطة : 2 نفخة</b> لمنقذ واحد أو اثنين، لا «2–3 نفخات : 12 ضغطة» ولا «نفخة : 5 ضغطات». السرعة <b>100–120 ضغطة في الدقيقة</b> لا «60–80» (والكتاب نفسه يقول في الصفحة نفسها «لا تقل عن مرة في الثانية»). العمق <b>5–6 سم</b> لا «3–5 سم». يُستعمل جهاز الصدمات AED فور وصوله، ولا يحكم المنقذ بالوفاة بعد ساعة من التدليك بل يستمر حتى يتسلم المسعفون. وفي نص الكتاب أيضاً: البند 4 في التدليك (ص 98) تكرار حرفي للبند 4 في طريقة النفخ وُضع مكان خطوة الضغط، وخطوة الضغط جاءت بلا رقم بعد الشكل؛ والإحالة «(شكل 2-12)» في ص 99 يقصد بها الشكل (5-18).</div>
</div>`;

/* ---------- lesson 4 lab ---------- */
const RES={
 book:{seq:[['اقطع التيار فوراً (وإن تعذّر ضع النواقل في دائرة قصر)','ص 94'],['اعزل نفسك (سطح عازل أو بساط مطاطي أو خشب جاف) وأبعد المصاب بأداة لها مقبض عازل','ص 94–95'],['استدعِ الطبيب فوراً ولا تترك المصاب وحده','ص 95'],['ضع المصاب على ظهره، وأخرج المواد الغريبة من فمه، وأمِل رأسه إلى الخلف','ص 96'],['انفخ في فمه مرتين أو ثلاثاً','ص 99'],['دلّك القلب 12 ضغطة متتالية','ص 99'],['كرّر النفخ والتدليك بالتناوب حتى يتنفس ويعود النبض','ص 99']],
  n:12,b:[2,3],lo:60,hi:80,depth:'3–5 سم'},
 fixed:{seq:[['افصل التيار وتأكد أن المكان آمن لك','البند أ ص 94'],['إن تعذّر الفصل: قف على سطح عازل وأبعد المصاب بأداة عازلة','البند أ ص 94–95'],['نادِه واربت على كتفه، وانظر هل يتنفس طبيعياً (أقل من 10 ثوانٍ)',CPR_SRC],['اتصل بالإسعاف واطلب إحضار جهاز الصدمات الآلي AED',CPR_SRC],['30 ضغطة على منتصف الصدر (100–120 في الدقيقة، بعمق 5–6 سم)',CPR_SRC],['نفختان (إمالة الرأس ورفع الذقن)',CPR_SRC],['شغّل جهاز AED فور وصوله واتبع تعليماته، ثم استمر في الإنعاش',CPR_SRC]],
  n:30,b:[2,2],lo:100,hi:120,depth:'5–6 سم'}};
const WRONG=[['اسحب المصاب بيدك العارية فوراً','خطر عليك: سيمر التيار في جسمك أنت أيضاً. افصل التيار أولاً، أو اعزل نفسك واستعمل أداة لها مقبض عازل (ص 94–95).'],['اسكب الماء على المصاب لتبريده','الماء يوصل التيار. لا تقترب من المصاب قبل فصل التيار.'],['أعطِ المصاب ماءً ليشرب','الكتاب يقول: «ويمتنع إعطاؤه أية سوائل بالفم» (ص 95).']];
function lab4(el){addCss();
  const md=()=>B.bkOn(BK)?'fixed':'book';let mode=md(),ordN=0,pool=[],msg='',cnt=0,ph='c',br=0,taps=[],cyc=0,lastMode=mode,flash=0;
  const w={orderDone:{},goodSet:0,cycles:0,modes:{[mode]:1}};
  el.innerHTML=`<div class="grid">
   <div class="panel c12"><h2>مختبر إنقاذ المصاب بالتيار الكهربائي <small>مبني على البند 5-8 «إغاثة المصاب» ص 94–100 والأشكال (5-15) إلى (5-18)</small></h2>
    <div class="s5-ctl">${B.bkCtl(BK,'طريقة الإسعاف:')}</div><div class="callout" id="mnote"></div></div>
   <div class="panel c7"><h2>رتّب خطوات الإنقاذ <small id="oref"></small></h2>
    <p class="sub">اضغط على الخطوات بترتيبها الصحيح. بين البطاقات تصرفات خاطئة، فانتبه لها.</p>
    <ol class="s5-done" id="odone"></ol><div class="s5-pool" id="opool"></div><div class="callout" id="omsg">ابدأ بأول ما تفعله عندما ترى شخصاً ملتصقاً بسلك كهربائي.</div>
    <div class="s5-ctl"><button class="btn" id="orst">ابدأ الترتيب من جديد</button></div>
    <figure class="fig">${box(fig515(),420)}<figcaption><b>الشكل (5-15)</b> المنقذ يقف على بساط عازل ويبعد السلك بعصا خشبية <span class="ref">ص 95</span></figcaption></figure></div>
   <div class="panel c5"><h2>إيقاع الضغطات والنفخ <small id="rref"></small></h2>
    <p class="sub">اضغط زر «ضغطة» بإيقاع منتظم كأنك تضغط على صدر المصاب، ثم «نفخة» عندما يحين وقتها. يقيس المختبر سرعتك بالضغطات في الدقيقة.</p>
    <div class="pbs" style="justify-content:center;margin-top:8px">${pbHTML('cmp','red','ضغطة','ضغطة على الصدر')}${pbHTML('brt','blue','نفخة','نفخة في الفم')}</div>
    <div style="text-align:center;margin-top:10px"><div class="sub">الآن</div><div id="now" style="font-size:18px;font-weight:700"></div></div>
    <div class="svgbox" id="rv" style="max-width:360px;margin-inline:auto"></div>
    <div class="wrap-in" style="padding-top:0;justify-content:center"><div class="reads" style="margin-inline-start:0"><div class="read"><span>سرعتك</span><b id="rate">—</b></div><div class="read"><span>المطلوب</span><b id="band"></b></div><div class="read"><span>الدورات المكتملة</span><b id="cyc">0</b></div></div></div>
    <div class="s5-ctl" style="justify-content:center"><button class="btn" id="metro" aria-pressed="false">مؤشر الإيقاع</button><button class="btn" id="rrst">ابدأ العد من جديد</button></div>
    <div class="callout" id="rmsg"></div></div>
   <div class="panel c12"><h2>التجربة خطوة بخطوة</h2><ol class="steps" id="gs"></ol>
    ${tries(['رتّب الخطوات بطريقة الكتاب، ثم بدّل إلى «المصحح» ورتّبها مرة أخرى: ما الذي تغيّر؟','جرّب أن تضغط بسرعة 70 في الدقيقة ثم 110: أيهما تقبله كل طريقة؟','شغّل «مؤشر الإيقاع» واضغط مع وميضه.','اضغط «نفخة» قبل إكمال عدد الضغطات وانظر ما يحدث.'])}
    <div class="callout">${TIP}هذا المختبر لفهم الترتيب والإيقاع فقط، ولا يغني عن التدريب العملي على دمية الإنعاش. والكتاب نفسه يحذّر: «تتطلب عملية تدليك القلب فهماً دقيقاً وتدريباً عملياً حتى تؤدى بطريقة صحيحة» (ص 100).</div></div>
  </div>`;
  const $=s=>el.querySelector(s);let metro=false,mt=0;
  const R=()=>RES[mode];
  const newPool=()=>{const S=R().seq.map((s,i)=>({k:'s'+i,t:s[0]})).concat(WRONG.map((x,i)=>({k:'w'+i,t:x[0]})));pool=mix(S.length,mode==='book'?5:11).map(i=>S[i]);ordN=0};
  const drawOrd=()=>{const S=R().seq;$('#oref').textContent=mode==='book'?'كما في الكتاب ص 94–99':'المصحح';
    $('#odone').innerHTML=S.slice(0,ordN).map(s=>`<li>${s[0]} <span class="sub">(${s[1]})</span></li>`).join('');
    $('#opool').innerHTML=pool.filter(p=>!(p.k[0]==='s'&&+p.k.slice(1)<ordN)).map(p=>`<button data-o="${p.k}">${p.t}</button>`).join('');
    if(ordN>=S.length){$('#omsg').innerHTML='<b>أحسنت، الترتيب كامل.</b> '+(mode==='book'?'هذا ترتيب الكتاب. بدّل إلى «المصحح» لترى الترتيب المعتمد اليوم.':'هذا هو الترتيب المعتمد اليوم: الأمان أولاً، ثم طلب المساعدة وجهاز AED، ثم 30 ضغطة ونفختان.');w.orderDone[mode]=1}
    el.querySelectorAll('[data-o]').forEach(b=>b.addEventListener('click',()=>{const k=b.dataset.o;
      if(k[0]==='w'){const x=WRONG[+k.slice(1)];b.classList.add('no');$('#omsg').innerHTML=`<b>تصرّف خاطئ:</b> ${x[1]}`;return}
      const i=+k.slice(1);if(i===ordN){ordN++;$('#omsg').innerHTML=`<b>صحيح.</b> ${S[i][0]}.`;drawOrd()}
      else{b.classList.add('no');setTimeout(()=>b.classList.remove('no'),700);$('#omsg').innerHTML=`<b>ليس الآن.</b> قبل هذه الخطوة خطوة أخرى لم تختَرها بعد.`}}))};
  const resetR=()=>{cnt=0;ph='c';br=0;taps=[];cyc=0;msg=''};
  const rateNow=()=>{if(taps.length<3)return null;const a=taps.slice(-6),d=(a[a.length-1]-a[0])/(a.length-1);return d>0?60/d:null};
  const drawR=()=>{const r=R(),rt=rateNow();$('#band').textContent=r.lo+'–'+r.hi+' /min';$('#cyc').textContent=cyc;$('#rate').textContent=rt?Math.round(rt)+' /min':'—';
    $('#rref').textContent=mode==='book'?'الكتاب: 12 ضغطة ثم 2–3 نفخات، 60–80 في الدقيقة':'المصحح: 30 ضغطة ثم نفختان، 100–120 في الدقيقة';
    $('#now').innerHTML=ph==='c'?`اضغط: <span class="ltr">${cnt} / ${r.n}</span>`:`انفخ: <span class="ltr">${br} / ${r.b[0]===r.b[1]?r.b[0]:r.b[0]+'–'+r.b[1]}</span>`;
    const W=360,H=70,x0=20,x1=340,sc=v=>x0+(Math.min(Math.max(v,30),150)-30)/120*(x1-x0);
    let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="مقياس سرعة الضغطات"><rect x="${x0}" y="22" width="${x1-x0}" height="14" rx="7" style="fill:var(--surface-2);stroke:var(--line)"/><rect x="${sc(r.lo)}" y="22" width="${sc(r.hi)-sc(r.lo)}" height="14" style="fill:var(--on-soft);stroke:var(--on)"/>`;
    [30,60,80,100,120,150].forEach(v=>{s+=tl(sc(v),54,String(v),{m:1})});
    if(rt)s+=`<path d="M${sc(rt)} 14V44" style="stroke:${rt>=r.lo&&rt<=r.hi?'var(--on)':'var(--stop)'};stroke-width:4"/>`;
    if(metro)s+=`<circle cx="${W-14}" cy="12" r="${7+5*flash}" style="fill:var(--live);opacity:${(.3+.7*flash).toFixed(2)}"/>`;
    $('#rv').innerHTML=s+tl(x0,12,'/min',{a:'start',m:1})+'</svg>';$('#rmsg').innerHTML=msg||(mode==='book'?'عمق الضغط في الكتاب 3–5 سم.':'العمق 5–6 سم، واترك الصدر يرتد كاملاً بعد كل ضغطة.')};
  $('#cmp').addEventListener('click',()=>{const r=R(),t=performance.now()/1000;
    if(ph!=='c'){msg=`<b>ليس الآن:</b> أكمل ${r.b[0]===r.b[1]?'نفختين':'نفختين أو ثلاثاً'} أولاً.`;drawR();return}
    taps.push(t);if(taps.length>12)taps.shift();cnt++;msg='';
    if(cnt>=r.n){const rt=rateNow();ph='b';br=0;const ok=rt&&rt>=r.lo&&rt<=r.hi;if(ok)w.goodSet++;
      msg=rt?(ok?`<b>إيقاع مناسب</b> (${Math.round(rt)} في الدقيقة). الآن النفخ.`:`سرعتك ${Math.round(rt)} في الدقيقة، والمطلوب ${r.lo}–${r.hi}. الآن النفخ.`):'الآن النفخ.'}
    drawR()});
  $('#brt').addEventListener('click',()=>{const r=R();if(ph!=='b'){msg=`<b>ليس الآن:</b> أكمل ${r.n} ضغطة أولاً (بقي ${r.n-cnt}).`;drawR();return}
    br++;if(br>=r.b[0]){ph='c';cnt=0;taps=[];cyc++;w.cycles=cyc;msg=`<b>دورة ${cyc} اكتملت.</b> عُد إلى الضغطات.`}drawR()});
  $('#metro').addEventListener('click',e=>{metro=!metro;e.currentTarget.setAttribute('aria-pressed',String(metro));drawR()});
  $('#rrst').addEventListener('click',()=>{resetR();drawR()});
  $('#orst').addEventListener('click',()=>{newPool();$('#omsg').innerHTML='ابدأ بأول ما تفعله.';drawOrd()});
  const setMode=()=>{mode=md();if(mode===lastMode)return;lastMode=mode;w.modes[mode]=1;
    $('#mnote').innerHTML=mode==='book'?'<b>كما في الكتاب:</b> طريقة النفخ ثم 12 ضغطة، والسرعة 60–80 ضغطة في الدقيقة (ص 99). هذه الطريقة قديمة؛ بدّل إلى «المصحح» لترى المعتمد اليوم.':`<b>المصحح — ${CPR_SRC}:</b> 30 ضغطة ثم نفختان، والسرعة 100–120 ضغطة في الدقيقة، بعمق 5–6 سم، مع جهاز AED فور وصوله.`;
    newPool();drawOrd();resetR();drawR()};
  lastMode='';setMode();
  const gs=stepsUI($('#gs'),[
   {t:'رتّب خطوات الإنقاذ',x:'أكمل الترتيب في اللوحة الأولى (بالطريقة المختارة الآن).',done:w=>Object.keys(w.orderDone).length>=1},
   {t:'الإيقاع',x:'أكمل مجموعة ضغطات كاملة بسرعة داخل المجال الأخضر.',done:w=>w.goodSet>=1},
   {t:'دورتان',x:'أكمل دورتين كاملتين (ضغطات ثم نفخ).',done:w=>w.cycles>=2},
   {t:'قارن الطريقتين',x:'بدّل بين «كما في الكتاب» و«المصحح» ورتّب الخطوات في الثانية أيضاً.',done:w=>Object.keys(w.orderDone).length>=2}
  ],()=>w);
  loopOn(el,dt=>{if(md()!==mode)setMode();if(metro){const r=R(),per=60/((r.lo+r.hi)/2);mt+=dt;const ph2=(mt%per)/per;const f=ph2<0.18?1-ph2/0.18:0;if(Math.abs(f-flash)>0.05||(f===0&&flash!==0)){flash=f;drawR()}}gs.check()})}

B.lesson({
 id:'u5-l4',unit:5,order:4,pages:'92–100',
 title:'أنواع الإصابات الكهربائية وإغاثة المصاب',
 summary:'الإصابة الكهربائية صنفان: الصدمة (حروق وندبات وتمعدن وأضرار فيزيائية) والصعقة (تهيج الأنسجة بتقلص تشنجي قد ينتهي بتوقف التنفس والقلب). وإغاثة المصاب تبدأ بفصل التيار دون تعريض المنقذ للخطر، ثم الإنعاش.',
 stations:[
  {intro:true},

  {st:1,short:'أنواع الإصابات',title:'<span class="ltr">5-5</span> أنواع الإصابات الكهربائية — <span class="ltr">5-5-1</span> الصدمة الكهربائية',ref:'ص 92',
   q:'مصاب احترقت يده ومات بعد أيام، ولم يتوقف قلبه لحظة الحادث… فما الذي قتله؟',
   art:S5.svg('الإصابات الكهربائية صنفان: الصدمة والصعقة','#E6E2F8',
     `<rect x="110" y="40" width="140" height="44" rx="14" fill="#2C4A40"/>`+S5.ar(180,68,'الإصابات الكهربائية',{fs:14,b:1,c:'#FBF6EE'})+`<path d="M180 84v26M100 110h160M100 110v20M260 110v20" fill="none" stroke="#2C4A40" stroke-width="3"/>`
    +S5.tip('الصدمة الكهربائية: ضرر يصيب أنسجة الجسم نتيجة تيار القصر أو القوس الكهربائي، وغالباً يكون سطحياً (الجلد، وأحياناً الأنسجة الرخوة والأربطة والعظام).',`<rect x="198" y="130" width="124" height="150" rx="14" fill="#FBF6EE" stroke="#E8735A" stroke-width="3"/>`+S5.ar(260,156,'الصدمة',{fs:15,b:1})+['حروق','ندبات','تمعدن الجلد','أضرار فيزيائية'].map((t,i)=>S5.ar(260,184+i*24,t,{fs:12})).join(''))
    +S5.tip('الصعقة الكهربائية: تهيج يصيب الأنسجة الحية بسبب مرور التيار خلال الجسم، مع تقلص تشنجي غير إرادي للعضلات.',`<rect x="38" y="130" width="124" height="150" rx="14" fill="#FBF6EE" stroke="#2F6FD0" stroke-width="3"/>`+S5.ar(100,156,'الصعقة',{fs:15,b:1})+S5.ar(100,190,'تهيج الأنسجة',{fs:12})+S5.ar(100,212,'تقلص تشنجي',{fs:12})+S5.ar(100,234,'قد يتوقف التنفس',{fs:12})+S5.ar(100,256,'أو القلب',{fs:12}))),
   cap:'تقسيم الكتاب للإصابات إلى صنفين رئيسين.<br><b>مرّر المؤشر على كل صنف (أو المسه في الجوال) لتقرأ تعريفه.</b>',
   side:[
    {predict:{q:'إذا كانت حروق الصدمة الكهربائية شديدة ومات الإنسان، فبسبب ماذا يموت حسب الكتاب؟',opts:[
     ['بسبب التكهرب من مرور التيار',false,'الكتاب ينفي ذلك صراحة في هذه الحالة.'],
     ['بنتيجة التضرر المحلي للعضوية',true,'«يموت عندها الإنسان، ليس بسبب التكهرب من مرور التيار الكهربائي، ولكن بنتيجة التضرر المحلي للعضوية» (ص 92).'],
     ['بسبب الخوف',false,'لا يذكره الكتاب.']]}}
   ],
   body:[
    {book:"<p>ويمكن تقسيم الإصابات الكهربائية إلى صنفين رئيسين:</p>\n<p><b>5-5-1 الصدمة الكهربائية:</b> وتتجلى بالضرر الذي يصيب أنسجة الجسم نتيجة تأثير تيار القصر أو القوس الكهربائي، وغالباً يكون سطحياً، أي يتضرر الجلد وأحياناً الأنسجة الرخوة مع الأربطة والعظام، حيث تتعلق خطورة الصدمة وصعوبة معالجتها بنوع ومميزات ودرجة تضرر الأنسجة، ورد فعل الأعضاء على هذا التضرر. وإذا ما كانت الحروق شديدة يموت عندها الإنسان، ليس بسبب التكهرب من مرور التيار الكهربائي، ولكن بنتيجة التضرر المحلي للعضوية. وهناك عدة مظاهر للصدمة الكهربائية هي:</p>",ref:'ص 92'},
    {title:'مختبر مصغّر: صدمة أم صعقة؟',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل وصف اضغط الصنف الذي يناسبه حسب تعريف الكتاب.',cats:['صدمة','صعقة'],items:[
     ['احتراق جلد اليد عند لمس موصل.',0,'ضرر سطحي في الأنسجة: من مظاهر الصدمة.'],
     ['تقلص تشنجي للعضلات مع فقدان الوعي.',1,'تهيج الأنسجة الحية بمرور التيار: صعقة.'],
     ['بقعة جلدية صغيرة فضية أو صفراء بعد الحادث.',0,'الندبات من مظاهر الصدمة.'],
     ['توقف التنفس والدورة الدموية.',1,'آخر درجات الصعقة (د).']]})}
   ]},

  {st:2,short:'الحروق',title:'أ: الحروق الكهربائية',ref:'ص 92',
   q:'عامل احترقت يده من قوس ولم يمر في جسمه تيار… فهل حرقه «كهربائي»؟',
   art:S5.svg('ثلاثة أنواع من الحروق: تياري وقوسي ومختلط','#F7DCC8',
     S5.tip('الحرق التياري أو التلامسي: التيار يمر مباشرة عبر الجسم عند ملامسة الأجزاء الموصلة، في منشآت توترها أقل من ⟦1 kV⟧، ويتمثل باحتراق الجلد.',`<rect x="236" y="70" width="96" height="140" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M262 96h44" stroke="#C8372D" stroke-width="5"/><path d="M284 96v30" stroke="#D9822B" stroke-width="4" stroke-dasharray="5 4"/><circle cx="284" cy="140" r="14" fill="#F4D3CC" stroke="#2C4A40" stroke-width="2.5"/>`+S5.ar(284,186,'تياري',{fs:14,b:1})+S5.la(284,232,'< 1 kV',{fs:12}))
    +S5.tip('الحرق القوسي: بتأثير القوس الكهربائي دون مرور التيار في الجسم، في منشآت الجهد المنخفض ⟦220–380 V⟧ عند دائرة قصر مفاجئة، أثناء العمل تحت الجهد أو القياس بأجهزة متنقلة.',`<rect x="132" y="70" width="96" height="140" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M152 100L166 112L158 118L174 132L166 138L184 152" fill="none" stroke="#D9822B" stroke-width="4"/><circle cx="200" cy="140" r="14" fill="#F4D3CC" stroke="#2C4A40" stroke-width="2.5"/>`+S5.ar(180,186,'قوسي',{fs:14,b:1})+S5.la(180,232,'220–380 V',{fs:12}))
    +S5.tip('الحروق المختلطة: مرور التيار وتأثير القوس معاً، في منشآت جهدها أعلى من ⟦1 kV⟧؛ التيار المار بالجسم (بضع أمبيرات) يؤدي إلى الوفاة.',`<rect x="28" y="70" width="96" height="140" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M48 96h44" stroke="#C8372D" stroke-width="5"/><path d="M60 100L70 112L64 118L76 132" fill="none" stroke="#D9822B" stroke-width="4"/><path d="M84 100v26" stroke="#D9822B" stroke-width="4" stroke-dasharray="5 4"/><circle cx="76" cy="140" r="14" fill="#F4D3CC" stroke="#2C4A40" stroke-width="2.5"/>`+S5.ar(76,186,'مختلط',{fs:14,b:1})+S5.la(76,232,'> 1 kV',{fs:12}))
    +S5.ar(180,282,'أكثر أنواع الصدمات انتشاراً',{fs:14,b:1})),
   cap:'أقسام الحروق حسب شروط حدوثها، والجهود من نص الكتاب.<br><b>مرّر المؤشر على كل بطاقة (أو المسها في الجوال) لتعرف شروط حدوثها.</b>',
   side:[
    {predict:{q:'أي حرق يحدث بتأثير القوس الكهربائي دون مرور التيار في جسم الإنسان؟',opts:[
     ['الحرق القوسي',true,'«نتيجة تأثير القوس الكهربائي على جسم الإنسان، ولكن بدون مرور التيار من خلال جسمه» (ص 92).'],
     ['الحرق التياري',false,'التياري يعني أن التيار مرّ مباشرة عبر الجسم.'],
     ['الحروق المختلطة',false,'المختلطة فيها مرور تيار وقوس معاً.']]}}
   ],
   body:[
    {book:"<p><b>أ- الحروق الكهربائية:</b> وهي أكثر أنواع الصدمات الكهربائية انتشاراً، إذ تظهر عند أغلب المتضررين بالتيار الكهربائي، ويمكن تقسيم الحروق حسب شروط حدوثها إلى الأقسام التالية:</p>\n<ul><li><b>الحرق التياري أو التلامسي:</b> وذلك عند مرور التيار مباشرة عبر جسم الإنسان عند ملامسته للأجزاء الموصلة للتيار، وذلك في المنشآت الكهربائية ذات التوتر الأقل من <span class=\"ltr\">1 kV</span>، ويتمثل باحتراق الجلد، والذي هو السطح الخارجي من الجسم.</li>\n   <li><b>الحرق القوسي:</b> وذلك نتيجة تأثير القوس الكهربائي على جسم الإنسان، ولكن بدون مرور التيار من خلال جسمه، وذلك في المنشآت الكهربائية ذات الجهد المنخفض <span class=\"ltr\">220–380 V</span> أثناء حدوث دائرة قصر مفاجئة، وذلك عند العمل تحت الجهد عند إجراء القياسات بأجهزة متنقلة.</li>\n   <li><b>الحروق المختلطة:</b> وذلك نتيجة لأثر العاملين السابقين معاً، أي مرور التيار وتأثير القوس الكهربائي، وذلك في المنشآت الكهربائية ذات الجهد الأعلى من <span class=\"ltr\">1 kV</span>، حيث يظهر القوس الكهربائي بين الأجزاء الحاملة للتيار الكهربائي وبين الإنسان، إذ يؤدي التيار المار بجسم الإنسان (بضع أمبيرات) إلى وفاة المصاب.</li></ul>",ref:'ص 92'},
    {title:'مختبر مصغّر: ما نوع الحرق؟',widget:(el,B)=>DCML.lab(el,B,{intro:'حدد ما حدث للمصاب، واقرأ نوع الحرق حسب تقسيم الكتاب.',
     ins:[{k:'c',l:'هل مرّ التيار في جسمه؟',seg:[[1,'نعم'],[0,'لا']],v:1},{k:'a',l:'هل ظهر قوس كهربائي؟',seg:[[1,'نعم'],[0,'لا']],v:0}],
     calc:(s)=>{const t=s.c&&s.a?['الحروق المختلطة','في المنشآت ذات الجهد الأعلى من 1 kV؛ والتيار المار بالجسم (بضع أمبيرات) يؤدي إلى الوفاة.','bad']:s.c?['الحرق التياري أو التلامسي','في المنشآت ذات التوتر الأقل من 1 kV، ويتمثل باحتراق الجلد.','warn']:s.a?['الحرق القوسي','في منشآت الجهد المنخفض <span class="ltr">220–380 V</span> أثناء دائرة قصر مفاجئة، كالعمل تحت الجهد أو القياس بأجهزة متنقلة.','warn']:['لا حرق كهربائي','لا تيار ولا قوس: لا ينطبق أي قسم من أقسام الحروق الكهربائية.',''];
      return {facts:[['نوع الحرق',t[0],t[2]==='bad'?'bad':'hi']],msg:`<b>${t[0]}:</b> ${t[1]}`,cls:t[2]}}})}
   ]},

  {st:3,short:'الندبات',title:'ب: الندبات الكهربائية',ref:'ص 93',
   q:'بقعة صغيرة على الجلد بعد الحادث… هل هي خطيرة؟',
   art:S5.svg('بقعة جلدية دائرية فضية أو صفراء غامقة المركز','#FBE6C4',
     `<path d="M60 230C80 120 280 120 300 230Z" fill="#F8E1C2" stroke="#2C4A40" stroke-width="3"/>`
    +S5.tip('الندبة الكهربائية: بقعة جلدية صغيرة لونها فضي أو أصفر، شكلها دائري أو قطاعي، غامقة في مركزها.',`<circle cx="180" cy="186" r="26" fill="#E9E4C9" stroke="#B59A3A" stroke-width="3"/><circle cx="180" cy="186" r="9" fill="#6B5A2A"/>`)
    +S5.tip('أحياناً يشبه شكل الندبة شكل الجزء الحامل للتيار الذي لامسه المصاب.',`<rect x="240" y="176" width="24" height="16" rx="3" fill="#E9E4C9" stroke="#B59A3A" stroke-width="2.5"/>`)
    +S5.tip('تظهر الندبات عند حوالي ⟦20%⟧ من المصابين بالتيار الكهربائي.',`<circle cx="92" cy="96" r="34" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/>`+S5.la(92,102,'20%',{fs:16,b:1}))
    +S5.ar(180,270,'ليست ضارة، وتشفى مع الزمن',{fs:14,b:1})),
   cap:'رسم مبسّط لوصف الكتاب للندبة.<br><b>مرّر المؤشر على الندبتين والنسبة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'كيف تشفى الندبة الكهربائية حسب الكتاب؟',opts:[
     ['لا تشفى أبداً',false,'الكتاب يقول إنها تشفى مع مرور الزمن.'],
     ['تحتاج دائماً إلى عملية جراحية',false,'لا يذكره الكتاب.'],
     ['تشفى مع مرور الزمن بسقوط طبقات الجلد العليا',true,'«وإن الندبات ليست ضارة، وتشفى مع مرور الزمن بسقوط طبقات الجلد العليا» (ص 93).']]}}
   ],
   body:[
    {book:"<p><b>ب- الندبات الكهربائية:</b> <span class=\"ref\">ص 93</span> وهي بقع جلدية صغيرة لونها إما فضي أو أصفر، ولها شكل دائري أو قطاعي، وذات لون غامق في مركزها، وأحياناً يكون شكلها مشابهاً لشكل الجزء الحامل للتيار الذي لامسه المصاب. وإن الندبات ليست ضارة، وتشفى مع مرور الزمن بسقوط طبقات الجلد العليا. وإن هذه الندبات تظهر عند حوالي <b><span class=\"ltr\">20%</span></b> من المصابين بالتيار الكهربائي.</p>",ref:'ص 93'},
    {title:'تحقق سريع: الندبات',widget:(el,B)=>DCML.tf(el,B,{intro:'احكم على كل عبارة بحسب الكتاب.',items:[
     ['قد يشبه شكل الندبة شكل الجزء الحامل للتيار الذي لامسه المصاب.',true,'نص الكتاب (ص 93).'],
     ['تظهر الندبات عند حوالي 50% من المصابين.',false,'حوالي 20%.'],
     ['الندبة غامقة اللون في مركزها.',true,'«وذات لون غامق في مركزها».']]})}
   ]},

  {st:4,short:'تمعدن الجلد',title:'ج: تمعدن الجلد',ref:'ص 93',
   q:'معدن ينصهر من القوس ويتطاير… ما الذي يصيبه أولاً؟',
   art:S5.svg('قوس كهربائي يطاير ذرات معدن منصهر نحو الجلد والعين','#DDEFE6',
     S5.tip('القوس الكهربائي عند دائرة القصر أو عند فتح الفواصل والقواطع وإغلاقها تحت الحمل.',`<rect x="240" y="90" width="80" height="120" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M262 120L276 136L266 142L284 160" fill="none" stroke="#D9822B" stroke-width="4"/>`)
    +S5.tip('ذرات المعدن المنصهر المتطاير: تحرق الجلد فيحمرّ ويتهيج ويتألم بسبب هذه الأجسام الخارجية.',[[220,120],[200,140],[210,170],[180,128],[170,160]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="5" fill="#D9822B" stroke="#2C4A40" stroke-width="1.5"/>`).join(''))
    +S5.tip('العين: عند إصابتها بالمعدن المنصهر يفقد المصاب نظره.',`<path d="M60 130Q100 96 140 130Q100 164 60 130Z" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><circle cx="100" cy="130" r="14" fill="#2F6FD0"/><circle cx="100" cy="130" r="6" fill="#2C4A40"/>`)
    +S5.tip('يظهر تمعدن الجلد عند حوالي ⟦10%⟧ من المصابين.',`<circle cx="100" cy="228" r="30" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/>`+S5.la(100,234,'10%',{fs:16,b:1}))
    +S5.ar(250,250,'الجلد يشفى بسقوطه',{fs:13,b:1})+S5.ar(250,272,'والعين قد تفقد البصر',{fs:13,b:1,c:'#C8372D'})),
   cap:'رسم مبسّط لسبب تمعدن الجلد.<br><b>مرّر المؤشر على القوس والذرات والعين والنسبة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'ماذا يحدث إذا أصاب المعدن المنصهر العين حسب الكتاب؟',opts:[
     ['تحمرّ فقط ثم تشفى',false,'هذا يحدث للجلد.'],
     ['يفقد المصاب نظره',true,'«أما عند إصابة العين فيفقد المصاب نظره» (ص 93).'],
     ['لا تتأثر العين',false,'الكتاب يذكر فقدان النظر.']]}}
   ],
   body:[
    {book:"<p><b>ج- تمعدن الجلد:</b> وذلك نتيجة احتراق الجلد من قبل ذرات المعدن المنصهر والمتطاير عند ظهور القوس الكهربائي — وذلك عند حدوث دائرة القصر، وعند فتح أو إغلاق الفواصل والقواطع تحت الحمل — يظهر احمرار في الجلد نتيجة الحرارة التي ينقلها المعدن المنصهر إلى الجلد، ويتهيج الجلد ويتألم بسبب وجود هذه الأجسام الخارجية، ويشفى الجلد بسقوطه على مرور الزمن، أما عند إصابة العين فيفقد المصاب نظره. ويظهر تمعدن الجلد عند حوالي <b><span class=\"ltr\">10%</span></b> من المصابين بالتيار الكهربائي.</p>",ref:'ص 93'},
    {add:'<p>لهذا يُلبس واقي الوجه أو النظارة الواقية عند فتح القواطع أو إغلاقها تحت الحمل وعند العمل قرب الأجزاء الحية، كما في وحدة مهمات الوقاية الشخصية.</p>',title:'كيف نحمي العين؟'},
    {title:'مختبر مصغّر: متى يحدث التمعدن؟',widget:(el,B)=>DCML.cases(el,B,{intro:'اختر وصف الكتاب لكل موقف.',cases:[
     {q:'فني أغلق قاطعاً تحت الحمل فظهر قوس وتطايرت منه ذرات معدن على ذراعه.',opts:[['تمعدن الجلد',true,'«احتراق الجلد من قبل ذرات المعدن المنصهر والمتطاير عند ظهور القوس… وعند فتح أو إغلاق الفواصل والقواطع تحت الحمل» (ص 93).'],['ندبة كهربائية',false,'الندبة بقعة تظهر بعد ملامسة الجزء الحامل للتيار، لا من المعدن المتطاير.']]},
     {q:'بعد أيام سقطت طبقة الجلد المحترقة من ذراعه. ماذا يعني ذلك؟',opts:[['أن الإصابة ساءت',false,'الكتاب يصف هذا بأنه طريق الشفاء.'],['أن الجلد يشفى بسقوطه على مرور الزمن',true,'«ويشفى الجلد بسقوطه على مرور الزمن» (ص 93).']]}]})}
   ]},

  {st:5,short:'الأضرار الفيزيائية',title:'د: الأضرار الفيزيائية',ref:'ص 93',
   q:'كيف يكسر التيار عظمة لم يلمسها شيء؟',
   art:S5.svg('تقلص عضلي حاد يسبب تمزقاً وكسراً','#F7DCC8',
     S5.tip('التقلص الحاد وغير الإرادي للعضلات تحت تأثير التيار المار في الجسم: هو سبب الأضرار الفيزيائية.',`<path d="M80 150C110 110 170 110 200 150C170 190 110 190 80 150Z" fill="#E8735A" stroke="#2C4A40" stroke-width="3"/><path d="M96 150h88M110 136l-10 14 10 14M170 136l10 14-10 14" fill="none" stroke="#FBF6EE" stroke-width="3"/>`+S5.ar(140,104,'تقلص حاد',{fs:13,b:1}))
    +S5.tip('من الأضرار: تشققات في الجلد، وانفجار الشرايين، وتمزق الأعصاب، وكسر العظام.',`<path d="M230 120h70l-12 14 16 8-18 10h44" fill="none" stroke="#2C4A40" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`+S5.ar(282,182,'كسر العظام',{fs:13,b:1}))
    +S5.tip('تظهر الأضرار الفيزيائية لحوالي ⟦3%⟧ من المصابين — أقل من الندبات ⟦(20%)⟧ وتمعدن الجلد ⟦(10%)⟧.',[[20,'ندبات'],[10,'تمعدن'],[3,'أضرار فيزيائية']].map(([v,t],i)=>`<rect x="${210}" y="${214+i*24}" width="${v*5}" height="16" rx="4" fill="${['#B59A3A','#D9822B','#C8372D'][i]}"/>`+S5.la(204,227+i*24,v+'%',{fs:11,a:'end'})+S5.ar(156,227+i*24,t,{fs:11})).join(''))),
   cap:'رسم مبسّط، والنسب الثلاث من الكتاب (ص 93).<br><b>مرّر المؤشر على العضلة والعظم والأشرطة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'ما سبب الأضرار الفيزيائية مثل كسر العظام؟',opts:[
     ['سقوط المصاب على الأرض فقط',false,'الكتاب يربطها بالتقلص العضلي.'],
     ['حرارة القوس الكهربائي',false,'هذا سبب الحروق القوسية وتمعدن الجلد.'],
     ['التقلص الحاد غير الإرادي للعضلات تحت تأثير التيار',true,'نص الكتاب (ص 93).']]}}
   ],
   body:[
    {book:"<p><b>د- الأضرار الفيزيائية:</b> وذلك نتيجة التقلص الحاد وغير الإرادي للعضلات تحت تأثير التيار المار في جسم الإنسان، وبالتالي ظهور تشققات في الجلد، وانفجار الشرايين، وتمزق الأعصاب، وكسر العظام. وتظهر هذه الأضرار لحوالي <b><span class=\"ltr\">3%</span></b> من المصابين بالتيار الكهربائي.</p>",ref:'ص 93'},
    {title:'مختبر مصغّر: رتّب المظاهر حسب انتشارها',widget:(el,B)=>DCML.order(el,B,{intro:'اضغط المظاهر الثلاثة من الأكثر انتشاراً إلى الأقل (حسب نسب الكتاب).',steps:[
     ['الندبات الكهربائية','الندبات أكثرها: حوالي 20%.'],['تمعدن الجلد','حوالي 10%: بعد الندبات.'],['الأضرار الفيزيائية','أقلها: حوالي 3%.']],done:'وأما الحروق فيصفها الكتاب بأنها «أكثر أنواع الصدمات الكهربائية انتشاراً» دون نسبة.'})}
   ]},

  {st:6,short:'الصعقة',title:'<span class="ltr">5-5-2</span> الصعقة الكهربائية',ref:'ص 94',
   q:'التيار لم يمر في القلب… فهل يمكن أن يتوقف القلب مع ذلك؟',
   art:S5.svg('درجات الصعقة الأربع من الأخف إلى الأشد','#E6E2F8',
     [['أ','تقلص بلا فقدان وعي','التقلص التشنجي للعضلات بدون فقدان الوعي','#F2C14E'],['ب','مع فقدان الوعي','التقلص التشنجي للعضلات مع فقدان الوعي، مع المحافظة على التنفس وعلى عمل القلب','#E8A04E'],['ج','اختلال القلب أو التنفس','فقدان الوعي واختلال عمل القلب أو التنفس أو كليهما','#E8735A'],['د','الموت','الموت بتوقف التنفس والدورة الدموية','#C8372D']].map(([k,sh,t,c],i)=>S5.tip('الدرجة '+k+': '+t+'.',`<rect x="${60+i*18}" y="${70+i*52}" width="${240-i*36}" height="42" rx="10" fill="${c}" stroke="#2C4A40" stroke-width="2"/>`+S5.ar(180,97+i*52,k+'- '+sh,{fs:13,b:1,c:i>1?'#FBF6EE':'#2C4A40'}))).join('')
    +S5.ar(180,52,'من الأخف إلى الأشد',{fs:14,b:1})+`<path d="M320 70v200m-8-12l8 14 8-14" fill="none" stroke="#2C4A40" stroke-width="3"/>`),
   cap:'تصنيف الصعقة بعد تصحيح ترقيم الكتاب (أ، ب، ج، د).<br><b>مرّر المؤشر على كل درجة (أو المسها في الجوال) لتقرأ نصها كاملاً.</b>',
   side:[
    {predict:{q:'عند أي تيار يبدأ الإنسان بالشعور بصعوبة التنفس (60 Hz) حسب هذا البند؟',opts:[
     ['<span class="ltr">20–25 mA</span>',true,'«يبدأ بالشعور بصعوبة التنفس عندما يبلغ التيار المار في جسمه شدة <span class="ltr">20–25 mA</span> عند تردد 60 Hz» (ص 94).'],
     ['1 mA',false,'هذا أصغر تيار يُحس به.'],
     ['0.1 A',false,'هذا تيار مميت في جميع الأحوال (ص 84).']]}}
   ],
   body:[
    {book:"<p>وهي التهيج الذي يصيب الأنسجة الحية بسبب مرور التيار الكهربائي خلال جسم الإنسان، والذي يترافق مع التقلص التشنجي غير الإرادي للعضلات، وتصنف إلى:</p>\n<ul style=\"list-style:none;padding-inline-start:8px\"><li>أ- التقلص التشنجي للعضلات بدون فقدان الوعي.</li><li>ب- التقلص التشنجي للعضلات مع فقدان الوعي، مع المحافظة على التنفس وعلى عمل القلب.</li><li>ج- فقدان الوعي واختلال عمل القلب أو التنفس أو كليهما.</li><li>د- الموت بتوقف التنفس والدورة الدموية.</li></ul>\n<p>أي إن الإنسان يبدأ بالشعور بصعوبة التنفس عندما يبلغ التيار المار في جسمه شدة <b><span class=\"ltr\">20–25 mA</span></b> عند تردد <span class=\"ltr\">60 Hz</span>، وتزداد الصعوبة مع زيادة التيار. وعند استمرار تأثير التيار يمكن أن يظهر الاختناق نتيجة نقص الأوكسجين وزيادة غاز ثاني أوكسيد الكربون. كما أن تأثير التيار الكهربائي على عضلة القلب يمكن أن يكون مباشراً (عندما يمر التيار مباشرة عبر منطقة القلب)، أو غير مباشر أي عبر المنطقة العصبية المركزية عندما لا يمر التيار عبر منطقة القلب. في كلتا الحالتين يمكن أن يتوقف القلب، أو يرتجف بحيث يتوقف عن العمل كمضخة للدم.</p>\n<p>هذا وتتميز الإصابة الكهربائية برد فعل عصبي شديد للعضوية جواباً على التهيج القوي للتيار الكهربائي، والمترافق بخطر تعطل دوران الدم والتنفس، وتدوم هذه الحالة الحرجة من بضع عشرات من الدقائق حتى يوم كامل، يمكن أن يموت الإنسان بعدها أو يشفى كاملاً.</p>",ref:'ص 94'},
    {watch:"درجات الصعقة الأربع مرقمة في الكتاب (ص 94) «أ، ب، أ، ب»، والصواب «أ، ب، ج، د» كما كتبناها.",fix:true},
    {tip:'<p>القلب قد يتأثر <b>مباشرة</b> (التيار يمر عبر منطقة القلب) أو <b>بطريق غير مباشر</b> عبر الجهاز العصبي المركزي حتى لو لم يمر التيار في منطقة القلب. وفي الحالتين قد يتوقف القلب أو «يرتجف» فلا يضخ الدم.</p>',title:'طريقان إلى القلب'},
    {title:'مختبر مصغّر: رتّب درجات الصعقة',widget:(el,B)=>DCML.order(el,B,{intro:'اضغط الدرجات من الأخف إلى الأشد.',steps:[
     ['تقلص تشنجي للعضلات بدون فقدان الوعي','هذه أخف الدرجات (أ).'],['تقلص تشنجي مع فقدان الوعي، مع المحافظة على التنفس وعمل القلب','الدرجة (ب): فقد الوعي لكن التنفس والقلب يعملان.'],['فقدان الوعي واختلال عمل القلب أو التنفس أو كليهما','الدرجة (ج).'],['الموت بتوقف التنفس والدورة الدموية','أشد الدرجات (د).']]})}
   ]},

  {st:7,short:'تخليص المصاب',title:'<span class="ltr">5-8</span> إغاثة المصاب بالتيار الكهربائي — أ: تخليص المصاب',ref:'ص <span class="ltr">94–95</span>',
   q:'زميلك ملتصق بسلك ويبدو بلا حياة… ما أول ما تفعله، وما الذي يجب ألا تفعله أبداً؟',
   art:S5.svg('منقذ يقف على بساط عازل ويبعد السلك عن المصاب بعصا خشبية','#DDEFE6',S5.nest(fig515(),0,60,360,189)
    +S5.hot(250,130,100,120,'المنقذ يعزل نفسه من جهة الأرض: يقف على سطح عازل أو بساط مطاطي أو أخشاب جافة.')
    +S5.hot(150,130,110,40,'أداة لها مقبض عازل (عصا خشبية جافة): يبعد بها المصاب عن التماس الكهربائي دون أن يلمسه.')
    +S5.hot(20,170,180,70,'منطقة الخطر: المصاب والموصل. لا يُلمس المصاب باليد العارية قبل فصل التيار.')
    +S5.ar(180,286,'المنقذ لا يعرّض نفسه للخطر',{fs:14,b:1})),
   cap:'رسم مبسّط للشكل <span class="ltr">(5-15)</span>.<br><b>مرّر المؤشر على المنقذ والعصا ومنطقة الخطر (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'ما أول ما يفعله المنقذ حسب الكتاب؟',opts:[
     ['يسحب المصاب بيده بسرعة',false,'سيمر التيار في جسم المنقذ أيضاً.'],
     ['يبدأ التنفس الاصطناعي فوراً',false,'لا يُلمس المصاب قبل تخليصه من التماس.'],
     ['يقطع التيار فوراً',true,'«قطع التيار فوراً، وإذا تعذر ذلك…» (ص 94).']]}}
   ],
   body:[
    {book:"<p>يجب أن يتم بأسرع ما يمكن تخليص المصاب من التماس الذي سبب الحادث وإسعافه وفق ما يلي، حتى ولو ظهرت عليه علامات الموت، إذ إن ذلك غالباً ما يكون موتاً ظاهرياً فقط.</p>\n<p><b>أ- تخليص المصاب مع مراعاة ما يلي، حتى لا يتعرض المنقذ للخطر:</b> قطع التيار فوراً، وإذا تعذر ذلك توضع النواقل في دائرة قصر للحصول على ذات النتيجة، وإذا لم يتمكن ذلك يقوم المنقذ بعزل نفسه من جهة التيار ومن جهة الأرض في آن واحد، ويستعمل الأدوات التي لها مقابض عازلة، ويقف على سطح عازل أو بساط مطاطي أو أخشاب جافة، ويبعد المصاب عن كل تماس كهربائي (الشكل 5-15)، ويُستدعى الطبيب إلى مكان الحادث فوراً، وعلى ألا يترك المصاب لوحده نظراً إلى إجراء التنفس الاصطناعي في خلال دقائق وقوع الحادث.</p>",ref:'ص <span class="ltr">94–95</span>'},
    {tip:'<p>اقرأ البند أ كسلّم بدائل: <b>اقطع التيار</b> ← فإن تعذّر <b>ضع النواقل في دائرة قصر</b> ← فإن تعذّر <b>اعزل نفسك</b> (من جهة التيار ومن جهة الأرض) وأبعد المصاب بأداة عازلة. ثم استدعِ الطبيب ولا تترك المصاب وحده.</p>',title:'سلّم البدائل'},
    {title:'مختبر مصغّر: ماذا تفعل؟',widget:(el,B)=>DCML.cases(el,B,{intro:'ثلاثة مواقف؛ اختر ما يقوله الكتاب.',cases:[
     {q:'لوحة القواطع بجانبك ويمكنك الوصول إليها.',opts:[['أقطع التيار فوراً',true,'هذا أول ما يطلبه الكتاب.'],['أبعد المصاب بعصا أولاً ثم أقطع التيار',false,'إن أمكن قطع التيار فهو أولى من كل شيء.']]},
     {q:'لا يمكن قطع التيار، وفي يدك عصا خشبية جافة، والأرض مبللة.',opts:[['أقف على سطح عازل أو بساط مطاطي أو خشب جاف، ثم أبعد المصاب بالعصا',true,'«يقوم المنقذ بعزل نفسه من جهة التيار ومن جهة الأرض في آن واحد» (ص <span class="ltr">94–95</span>).'],['أبعده بالعصا وأنا واقف على الأرض المبللة',false,'المنقذ يجب أن يعزل نفسه من جهة الأرض أيضاً.']]},
     {q:'بعد تخليصه، المصاب لا يتحرك وتظهر عليه علامات الموت.',opts:[['أتركه لأنه مات',false,'الكتاب: «حتى ولو ظهرت عليه علامات الموت، إذ إن ذلك غالباً ما يكون موتاً ظاهرياً فقط».'],['أبدأ إسعافه فوراً وأستدعي الطبيب، ولا أتركه وحده',true,'نص الكتاب (ص <span class="ltr">94–95</span>).']]}]})}
   ]},

  {st:8,short:'التنفس الاصطناعي',title:'ب: التنفس الاصطناعي',ref:'ص <span class="ltr">95–97</span>',
   q:'هل ما زالت طريقة «قبلة الحياة» كما في الكتاب هي الطريقة المعتمدة اليوم؟',
   art:S5.svg('وضعية الرأس السيئة والصحيحة للنفخ','#FBE6C4',S5.nest(fig517(),0,90,360,129)
    +S5.hot(180,94,176,120,'الوضعية السيئة للرأس: الرأس غير مائل إلى الخلف، فيسد اللسان مجرى الهواء.')
    +S5.hot(4,94,176,120,'الوضعية الصحيحة للرأس: مائل إلى الخلف حتى لا يسد اللسان مجرى الهواء.')
    +S5.ar(180,60,'الرأس مائل إلى الخلف',{fs:14,b:1})+S5.ar(180,256,'ما زالت صحيحة اليوم: إمالة الرأس ورفع الذقن',{fs:12})),
   cap:'رسم مبسّط للشكل <span class="ltr">(5-17)</span>.<br><b>مرّر المؤشر على الوضعيتين (أو المسهما في الجوال) لتعرف الفرق.</b>',
   side:[
    {predict:{q:'لماذا يجب أن يكون رأس المصاب مائلاً إلى الخلف عند النفخ؟',opts:[
     ['حتى يرى المنقذ عينيه',false,'لا يذكره الكتاب.'],
     ['حتى لا يسد اللسان مجرى الهواء',true,'«ويجب أن يكون رأس المصاب مائلاً إلى الخلف حتى لا يتسبب اللسان في سد مجرى الهواء» (ص 96).'],
     ['حتى يسهل نقله',false,'الوضعية للنفخ لا للنقل.']]}}
   ],
   body:[
    {html:'<p class="sub">طرق الإسعاف في الكتاب (ص <span class="ltr">95–100</span>) قديمة، وبعض أرقامها تخالف الإرشادات المعتمدة اليوم. اختر ما تريد عرضه:</p>'+B.bkCtl(BK,'طريقة الإسعاف:')},
    {book:'<div class="bkb" data-bk="'+BK+'">'+"<p><b>ب- التنفس الاصطناعي:</b> <span class=\"ref\">ص 95</span> يتم أولاً بالطريقة اليدوية بمعدل <span class=\"ltr\">12–15</span> ضغطة في الدقيقة، مع مراعاة نزع الملابس التي تعيق تنفس المصاب، وفك طوق الرقبة والحزام، وإبقاء الفم مفتوحاً جيداً، ويفضل أن يتم ذلك بواسطة أداة فتح الفم الخشبية، والتأكد من أن اللسان لا يسد الحلق. وعند وصول جهاز التنفس الاصطناعي يتابع العمل به بنفس المعدل السابق حتى استفاقة المصاب من غيبوبته بعد ساعات وبدون توقف، وتتم تدفئة المصاب ببطانية أو غيرها، ويمتنع إعطاؤه أية سوائل بالفم. وتتم عملية تدليك الأطراف في اتجاه القلب حتى يساعد في وصول أكبر كمية من الدم لتنشيط الدورة الدموية. وهنالك طريقتان للتنفس الاصطناعي هما:</p>\n<p><b>1- الطريقة اليدوية (الشكل 5-16):</b> وتقوم على استخدام القوة للضغط على الجسم، وفيها يضغط المنقذ على صدر المصاب بكلتا راحتيه ليطرد هواء الزفير، ثم يخفف الضغط ويطلق يديه ليتيح الفرصة لدخول الشهيق، ويكرر هذا الفعل بالتناوب لتحدث عملية الشهيق أوتوماتيكياً نتيجة المرونة الطبيعية التي يتميز بها الصدر.</p>\n<figure class=\"fig\"><div class=\"svgbox\" style=\"max-width:420px;margin-inline:auto\"><svg viewBox=\"0 0 420 150\" role=\"img\" aria-label=\"الطريقة اليدوية القديمة: المصاب على بطنه والمنقذ يضغط على ظهره ثم يرفع ذراعيه\"><rect x=\"10\" y=\"8\" width=\"130\" height=\"134\" rx=\"8\" style=\"fill:var(--surface-2);stroke:var(--line)\"/><path d=\"M40 110h86\" style=\"stroke:var(--fg);stroke-width:12;stroke-linecap:round\"/><circle cx=\"32\" cy=\"108\" r=\"9\" style=\"fill:var(--surface);stroke:var(--fg);stroke-width:2\"/><circle cx=\"40\" cy=\"60\" r=\"8\" style=\"fill:var(--surface);stroke:var(--fg);stroke-width:2\"/><path d=\"M40 68L30 96M40 70L60 100\" style=\"stroke:var(--fg);stroke-width:2.4\"/><text class=\"txt m\" x=\"128\" y=\"26\" text-anchor=\"middle\">1</text><rect x=\"148\" y=\"8\" width=\"130\" height=\"134\" rx=\"8\" style=\"fill:var(--surface-2);stroke:var(--line)\"/><path d=\"M178 110h86\" style=\"stroke:var(--fg);stroke-width:12;stroke-linecap:round\"/><circle cx=\"170\" cy=\"108\" r=\"9\" style=\"fill:var(--surface);stroke:var(--fg);stroke-width:2\"/><circle cx=\"188\" cy=\"52\" r=\"8\" style=\"fill:var(--surface);stroke:var(--fg);stroke-width:2\"/><path d=\"M188 60L168 96M188 62L198 100\" style=\"stroke:var(--fg);stroke-width:2.4\"/><path d=\"M228 30v30m-8-8l8 10 8-10\" style=\"fill:none;stroke:var(--live);stroke-width:3\"/><text class=\"txt m\" x=\"266\" y=\"26\" text-anchor=\"middle\">2</text><rect x=\"286\" y=\"8\" width=\"130\" height=\"134\" rx=\"8\" style=\"fill:var(--surface-2);stroke:var(--line)\"/><path d=\"M316 110h86\" style=\"stroke:var(--fg);stroke-width:12;stroke-linecap:round\"/><circle cx=\"308\" cy=\"108\" r=\"9\" style=\"fill:var(--surface);stroke:var(--fg);stroke-width:2\"/><path d=\"M300 78l14 24M294 70q20-10 40 6\" style=\"stroke:var(--fg);stroke-width:2.4;fill:none\"/><circle cx=\"316\" cy=\"60\" r=\"8\" style=\"fill:var(--surface);stroke:var(--fg);stroke-width:2\"/><path d=\"M316 68L306 96M316 70L336 100\" style=\"stroke:var(--fg);stroke-width:2.4\"/><path d=\"M366 60v-30m-8 8l8-10 8 10\" style=\"fill:none;stroke:var(--blue);stroke-width:3\"/><text class=\"txt m\" x=\"404\" y=\"26\" text-anchor=\"middle\">3</text></svg></div><figcaption><b>الشكل (5-16)</b> الطريقة اليدوية: المصاب على بطنه، والمنقذ يضغط على ظهره (زفير) ثم يرفع ذراعيه (شهيق) — رسم مبسّط <span class=\"ref\">ص 96</span></figcaption></figure>\n<p><b>2- طريقة النفخ، وهي أفضل الطرق:</b> وتسمى قبلة الحياة، وفيها ينفخ المنقذ الهواء بفيه في فم المصاب، ويجب أن يكون رأس المصاب مائلاً إلى الخلف حتى لا يتسبب اللسان في سد طريق التنفس (الشكل 5-17).</p>\n<ol><li>بعد وضع المصاب على ظهره، وإخراج أية مواد غريبة من فيه، ضع إحدى اليدين تحت رقبة المصاب، واجعل الرقبة مقوسة إلى أعلى، واضغط باليد على جبهة المصاب في الاتجاه إلى أسفل، وهذا الوضع سيؤدي إلى فتح فم المصاب.</li>\n <li>خذ نفساً عميقاً لتملأ صدرك، وافتح فاك وضعه بإحكام على فم المصاب المفتوح، وأغلق أنف المصاب بالسبابة وإبهام يدك التي تضغط على الجبهة، وانفخ في فيه كمية كافية من الهواء لتجعل صدره يرتفع.</li>\n <li>أبعد فاك وراقب انخفاض صدر المصاب، وكرر عملية النفخ بمعدل نفخة كل أربع ثوانٍ.</li>\n <li>إذا لم يكن هناك تبادل للهواء، بمعنى أن صدر المصاب لا يرتفع عند النفخ، يفحص فم المصاب وينظف جيداً من أية أجسام غريبة تعوق دخول الهواء، واستأنف عملية التنفس من الفم بنفخ الهواء بقوة بمعدل مرة كل <span class=\"ltr\">4–5</span> ثوانٍ بالنسبة للبالغين، وبقوة أقل بواقع مرة كل ثلاث ثوانٍ للأطفال بعد رفع ذقن المصاب إلى أعلى والأمام. ولا تتوقف حتى يبدأ المصاب في التنفس، إذ تم إعادة بعض المصابين للحياة بعد ساعات من التنفس الاصطناعي المتواصل.</li>\n <li>حتى يحضر الإسعاف أو الطبيب ضع بطانية أو معطفاً تحت المصاب وفوقه لتدفئته، وعندما يستعيد أنفاسه لا تدعه ينهض قبل مرور ساعة على الأقل.</li></ol>\n<figure class=\"fig\"><div class=\"svgbox\" style=\"max-width:420px;margin-inline:auto\"><svg viewBox=\"0 0 420 150\" role=\"img\" aria-label=\"وضعية الرأس السيئة والصحيحة للنفخ\"><rect x=\"5\" y=\"5\" width=\"200\" height=\"140\" rx=\"8\" style=\"fill:var(--surface-2);stroke:var(--line)\"/><rect x=\"215\" y=\"5\" width=\"200\" height=\"140\" rx=\"8\" style=\"fill:var(--surface-2);stroke:var(--line)\"/><g><path d=\"M110 30q-34 0-38 30q0 20 18 26l6 10h28\" style=\"fill:var(--surface);stroke:var(--fg);stroke-width:2\" transform=\"rotate(14 110 60)\"/><path d=\"M104 68q8 14 4 20\" style=\"fill:none;stroke:var(--stop);stroke-width:5;stroke-linecap:round\"/><path d=\"M120 58v40\" style=\"stroke:var(--stop);stroke-width:3;stroke-dasharray:4 3\"/></g><g><path d=\"M320 30q-34 0-38 30q0 20 18 26l-2 14h28\" style=\"fill:var(--surface);stroke:var(--fg);stroke-width:2\" transform=\"rotate(-18 320 60)\"/><path d=\"M314 68q-4 6 14 10\" style=\"fill:none;stroke:var(--stop);stroke-width:5;stroke-linecap:round\"/><path d=\"M330 58v40\" style=\"stroke:var(--on);stroke-width:3;stroke-dasharray:4 3\"/></g><text class=\"txt ar\" x=\"105\" y=\"136\" text-anchor=\"middle\">الوضعية السيئة للرأس</text><text class=\"txt ar\" x=\"315\" y=\"136\" text-anchor=\"middle\">الوضعية الصحيحة للرأس</text></svg></div><figcaption><b>الشكل (5-17)</b> وضعية الرأس للنفخ: في الوضعية السيئة يسد اللسان مجرى الهواء — رسم مبسّط <span class=\"ref\">ص 97</span></figcaption></figure>"+'</div><div class="bkf blk" data-bk="'+BK+'"><p class="sub">اخترت «المصحح»، فأُخفي نص الكتاب لهذه الفقرة لأنه قديم. اضغط «كما في الكتاب» لعرضه.</p></div>',ref:'ص <span class="ltr">95–97</span>'},
    {add:'<div class="bkb" data-bk="'+BK+'"><p><b>انتبه:</b> هذه الطريقة كما طُبعت في الكتاب قديمة ومخالفة للإرشادات الحالية، والطريقة اليدوية (الشكل <span class="ltr">5-16</span>) لم تعد مستعملة. اختر «المصحح» في الزر أعلاه لترى الإرشادات المعتمدة اليوم.</p></div><div class="bkf blk" data-bk="'+BK+'">'+"<div class=\"callout\"><b>إرشادات الإنعاش القلبي الرئوي الحالية (جمعية القلب الأمريكية)</b> — للبالغ، ويطبّقها أي منقذ تدرّب عليها. بعد خطوة «أ» (فصل التيار وإبعاد المصاب) تسير الإغاثة هكذا:</div>\n<ol><li><b>تأكد من الأمان:</b> لا تلمس المصاب قبل فصل التيار أو إبعاده بأداة عازلة (كما في البند أ).</li>\n <li><b>تحقق من الاستجابة:</b> نادِه بصوت عالٍ واربت على كتفه.</li>\n <li><b>اطلب المساعدة فوراً:</b> اتصل بالإسعاف (أو كلّف شخصاً بذلك)، واطلب إحضار <b>جهاز الصدمات الكهربائية الآلي <span class=\"ltr\">(AED)</span></b>.</li>\n <li><b>تحقق من التنفس</b> في أقل من 10 ثوانٍ: إن كان لا يتنفس، أو يشهق شهقات متقطعة فقط، فابدأ الإنعاش فوراً.</li>\n <li><b>الضغطات على الصدر:</b> المصاب على ظهره فوق سطح صلب، كعب يدك على منتصف الصدر (النصف السفلي من عظمة القص) واليد الأخرى فوقها، والذراعان مستقيمتان. اضغط بعمق <b><span class=\"ltr\">5–6</span> سم</b>، وبسرعة <b><span class=\"ltr\">100–120</span> ضغطة في الدقيقة</b>، واترك الصدر يرتد كاملاً بعد كل ضغطة، وقلّل التوقف بين الضغطات (أقل من 10 ثوانٍ).</li>\n <li><b><span class=\"ltr\">30</span> ضغطة : نفختان</b> — سواء كان المنقذ واحداً أو اثنين. للنفخ: أمل الرأس إلى الخلف وارفع الذقن، وانفخ نحو ثانية واحدة لكل نفخة حتى يرتفع الصدر. من لم يتدرب على النفخ أو لا يستطيعه يكتفي <b>بالضغطات المستمرة</b> دون توقف.</li>\n <li><b>جهاز <span class=\"ltr\">AED</span>:</b> شغّله فور وصوله واتبع تعليماته الصوتية، ولا يلمس أحد المصاب عند إعطاء الصدمة، ثم عُد إلى الضغطات فوراً.</li>\n <li><b>استمر</b> حتى يتسلم المسعفون، أو يبدأ المصاب بالتنفس الطبيعي والحركة. إن كان منقذان فليتبادلا الضغطات كل دقيقتين تقريباً لأن التعب يضعف الضغط. وإذا عاد التنفس الطبيعي فضعه على جنبه (وضعية الإفاقة) وراقبه حتى يصل الإسعاف.</li></ol>"+'</div>',title:'الإرشادات الحالية'},
    {title:'مختبر مصغّر: قديم أم معتمد اليوم؟',widget:(el,B)=>DCML.sort(el,B,{intro:'صنّف كل إجراء: هل هو من طريقة الكتاب القديمة، أم من الإرشادات الحالية (جمعية القلب الأمريكية)؟',cats:['طريقة الكتاب (قديمة)','الإرشادات الحالية'],items:[
     ['الطريقة اليدوية: الضغط على ظهر المصاب ثم رفع ذراعيه.',0,'لم تعد مستعملة (الشكل <span class="ltr">5-16</span>).'],
     ['نفختان بعد كل 30 ضغطة على الصدر.',1,'النسبة الحالية 30 : 2، سواء كان المنقذ واحداً أو اثنين.'],
     ['نفختان أو ثلاث ثم 12 ضغطة.',0,'هذا ما يذكره الكتاب لمنقذ واحد (ص 99).'],
     ['الاتصال بالإسعاف وطلب جهاز الصدمات الكهربائية الآلي (AED) فوراً.',1,'من أول خطوات الإرشادات الحالية.']]})}
   ]},

  {st:9,short:'تدليك القلب',title:'ج: التدليك الخارجي للقلب',ref:'ص <span class="ltr">97–100</span>',
   q:'كم ضغطة في الدقيقة؟ وبأي عمق؟ الكتاب يجيب بأرقام… فهل ما زالت صحيحة؟',
   art:S5.svg('الضغط على منتصف الصدر بذراعين مستقيمتين','#F7DCC8',S5.nest(fig518(),0,90,360,146)
    +S5.hot(150,96,110,90,'الذراعان مستقيمتان، والضغط من الكتفين بوزن الجسم كله.')
    +S5.hot(100,170,90,60,'موضع اليدين: منتصف الصدر (النصف السفلي من عظمة القص)، والمصاب على ظهره فوق أرض صلبة.')
    +S5.ar(180,62,'اضغط ثم ارفع الضغط',{fs:14,b:1})+S5.ar(180,262,'الكتاب: 60–80 في الدقيقة، بعمق 3–5 سم',{fs:12})+S5.ar(180,284,'اليوم: 100–120 في الدقيقة، بعمق 5–6 سم',{fs:12,b:1,c:'#12855A'})),
   cap:'رسم مبسّط للشكل <span class="ltr">(5-18)</span>، مع أرقام الكتاب والأرقام الحالية.<br><b>مرّر المؤشر على الذراعين وموضع اليدين (أو المسهما في الجوال) لتعرف معناهما.</b>',
   side:[
    {predict:{q:'حسب الإرشادات الحالية، كم سرعة الضغطات على صدر البالغ؟',opts:[
     ['<span class="ltr">100–120</span> في الدقيقة',true,'إرشادات الإنعاش القلبي الرئوي الحالية (جمعية القلب الأمريكية).'],
     ['<span class="ltr">60–80</span> في الدقيقة',false,'هذا رقم الكتاب القديم (ص 99).'],
     ['<span class="ltr">12–15</span> في الدقيقة',false,'هذا معدل الطريقة اليدوية للتنفس في الكتاب (ص 95).']]}}
   ],
   body:[
    {html:B.bkCtl(BK,'طريقة الإسعاف:')},
    {book:'<div class="bkb" data-bk="'+BK+'">'+"<p><b>ج- التدليك الخارجي للقلب:</b> <span class=\"ref\">ص 97–99</span> استخدم طريقة التدليك الخارجي للقلب مع عملية التنفس الاصطناعي، ويجب مراعاة عدم تعارض التدليك الخارجي للقلب مع عملية النفخ في فم المصاب، كما يجب أن تكون عملية النفخ في فم المصاب سريعة، ثم يبعد المنقذ فاه عن المصاب ويتركه لتفريغ الهواء من داخله، مع إجراء عملية تدليك خارجي للقلب لضمان استمرار مرور الدم الحامل للأوكسجين لأعضاء الجسم المختلفة مثل المخ والكليتين والقلب (الشكل 5-18).</p>\n<ol><li>هذا إذا كان يقوم بالإجراءات الإسعافية شخص واحد، أما إذا توافر شخصان يجيدان الإسعافات الأولية فيقوم أحدهما بالتنفس الاصطناعي والآخر بتدليك القلب من الخارج.</li>\n <li>لعمل تدليك القلب من الخارج يجب أن يكون المصاب ملقى على ظهره فوق أرض صلبة.</li>\n <li>تحسس صدر المصاب حتى تحدد الطرف السفلي من القفص الصدري، وضع أحد أصابع يدك اليسرى على هذا الطرف، وحرك نهاية كعب اليد اليمنى وليس الكف نحو هذا الإصبع، وضع نهاية راحة اليد اليمنى على الثلث الأسفل من عظمة القفص الصدري، وضع اليد اليسرى فوق اليد اليمنى، وارفع أصابع اليدين عن صدر المصاب كما هو مبين بالشكل.</li>\n <li>إذا لم يكن هناك تبادل للهواء، بمعنى أن صدر المصاب لا يرتفع عند النفخ، يفحص فم المصاب وينظف جيداً من أية أجسام غريبة تعوق دخول الهواء، واستأنف عملية التنفس من الفم بنفخ الهواء بقوة بمعدل مرة كل <span class=\"ltr\">4–5</span> ثوانٍ بالنسبة للبالغين، وبقوة أقل بواقع مرة كل ثلاث ثوانٍ للأطفال بعد رفع ذقن المصاب إلى أعلى والأمام. ولا تتوقف حتى يبدأ المصاب في التنفس، إذ تم إعادة بعض المصابين للحياة بعد ساعات من التنفس الاصطناعي المتواصل.</li></ol>\n<figure class=\"fig\"><div class=\"svgbox\" style=\"max-width:420px;margin-inline:auto\"><svg viewBox=\"0 0 420 170\" role=\"img\" aria-label=\"الضغط على منتصف الصدر بذراعين مستقيمتين\"><path d=\"M40 140h300\" style=\"stroke:var(--fg);stroke-width:22;stroke-linecap:round;opacity:.25\"/><circle cx=\"40\" cy=\"132\" r=\"16\" style=\"fill:var(--surface);stroke:var(--fg);stroke-width:2\"/><path d=\"M60 128h120\" style=\"stroke:var(--fg);stroke-width:2\"/><circle cx=\"190\" cy=\"38\" r=\"13\" style=\"fill:var(--surface);stroke:var(--fg);stroke-width:2\"/><path d=\"M196 50L240 110L280 110L300 150M200 54L150 118M206 56L150 118\" style=\"fill:none;stroke:var(--fg);stroke-width:3;stroke-linecap:round\"/><rect x=\"138\" y=\"116\" width=\"26\" height=\"9\" rx=\"3\" style=\"fill:var(--live)\"/><path d=\"M151 70v34m-8-8l8 10 8-10\" style=\"fill:none;stroke:var(--live);stroke-width:3\"/><text class=\"txt ar m\" x=\"110\" y=\"24\" text-anchor=\"middle\">الذراعان مستقيمتان</text><text class=\"txt ar m\" x=\"151\" y=\"160\" text-anchor=\"middle\">منتصف الصدر</text></svg></div><figcaption><b>الشكل (5-18)</b> فحص النبض، والتخلص من الفضلات في الفم، وإرجاع الرأس، والضغط على الصدر، والنفخ — رسم مبسّط لوضع الضغط <span class=\"ref\">ص 98</span></figcaption></figure>\n<p>اضغط لأسفل بسرعة لا تقل عن مرة في الثانية، ويكون الضغط بكلتا اليدين، واستخدم قوة كافية لتضغط اليد السفلى على الثلث السفلي للقفص الصدري بحيث ينخفض مسافة <b><span class=\"ltr\">3–5</span> سم</b>، وذلك بأن تبقي ذراعيك مستقيمتين ولا تثنيهما عند الكوع، مستخدماً وزن جسمك كله للضغط من الكتفين، وهذا مما يسهل عليك أداء هذه المهمة لوقت أطول دون تعب كبير. ثم ارفع ثقلك مع بقاء وضع كفيك على صدر المصاب، وكرر هذه العملية بصفة منتظمة… اضغط وارفع الضغط… اضغط وارفع الضغط… وفي كل مرة تضغط على قلب المصاب بين عظمة القفص الصدري والعمود الفقري، فتدفع الدم إلى جسم المصاب، أي أنك تقوم بعمل القلب. <span class=\"ref\">ص 99</span></p>\n<ol start=\"5\"><li>يراعى أن يستمر النفخ في الفم بحيث يتخلل عملية التدليك الخارجي للقلب بمعدل <b>نفس واحد كل خمس ضغطات</b> خارجية.</li></ol>\n<p>ونستخلص من ذلك أنه إذا كان هناك شخص واحد يقوم بعملية التنفس وإسعاف القلب فعليه الآتي: ينفخ في فم المصاب بالطريقة الصحيحة <b>مرتين أو ثلاث مرات</b> متتالية، يتبعها عمل تدليك خارجي للقلب لمدة <b><span class=\"ltr\">12</span> ضغطة</b> متتالية، ويستمر ذلك بالتناوب (الشكل 5-18). أما إذا تواجد شخص آخر فاجعله يجلس عند رأس المصاب ويقوم بعملية التنفس الاصطناعي بمعدل مرة واحدة كل خمس ضغطات خارجية على القلب تقوم بها أنت، واستمر في عمل ذلك حتى يستعيد المصاب أنفاسه والقلب نبضاته، ولا بد من أن تستمر هذه الجهود أثناء نقل المصاب بسيارة الإسعاف إلى أقرب نقطة طبية. هذا ويجب المحافظة على نبض القلب، وذلك بتدليكه عن طريق الضغط على الصدر براحتي اليد ثم إعتاقه بمعدل <b><span class=\"ltr\">60</span> إلى <span class=\"ltr\">80</span> مرة في الدقيقة</b>، وبذلك تتقلص عضلة القلب فتدفع الدم في الدورة الدموية.</p>\n<p>وتظهر علامات الحياة مثل: (1) يتغير لون الوجه من الأزرق إلى الأحمر، (2) يبدأ التنفس الطبيعي، (3) اتساع حدقة العين يبدأ في الضيق، (4) تأكد ظهور النبضات الطبيعية وتلمسها باليد. وعند عدم بدء التنفس الطبيعي واستمرار اتساع حدقة العين رغم مرور أكثر من ساعة على تدليك القلب يدوياً فتكون هذه علامات الوفاة. <span class=\"ref\">ص 100</span></p>"+'</div><div class="bkf blk" data-bk="'+BK+'"><p class="sub">اخترت «المصحح»، فأُخفي نص الكتاب لهذه الفقرة لأنه قديم. اضغط «كما في الكتاب» لعرضه.</p></div>',ref:'ص <span class="ltr">97–99</span>'},
    {add:'<div class="bkb" data-bk="'+BK+'"><p><b>انتبه:</b> أرقام هذه الفقرة قديمة: <span class="ltr">60–80</span> ضغطة في الدقيقة، وعمق <span class="ltr">3–5 سم</span>، ونفس كل خمس ضغطات. اختر «المصحح» لترى الأرقام المعتمدة اليوم.</p></div><div class="bkf blk" data-bk="'+BK+'"><p><b>'+CPR_SRC+':</b> الضغطات على منتصف الصدر بعمق <span class="ltr">5–6</span> سم وبسرعة <span class="ltr">100–120</span> ضغطة في الدقيقة، مع ترك الصدر يرتد كاملاً بعد كل ضغطة، وأقل توقف ممكن؛ ثم نفختان بعد كل <span class="ltr">30</span> ضغطة (انظر القائمة الكاملة في المحطة السابقة).</p>'+"<div class=\"callout err fixnote\"><b>ما الذي تغيّر عن الكتاب (ص 95–100):</b> الطريقة اليدوية بالضغط على الظهر ورفع الذراعين (الشكل 5-16) لم تعد مستعملة. النسبة اليوم <b>30 ضغطة : 2 نفخة</b> لمنقذ واحد أو اثنين، لا «2–3 نفخات : 12 ضغطة» ولا «نفخة : 5 ضغطات». السرعة <b>100–120 ضغطة في الدقيقة</b> لا «60–80» (والكتاب نفسه يقول في الصفحة نفسها «لا تقل عن مرة في الثانية»). العمق <b>5–6 سم</b> لا «3–5 سم». يُستعمل جهاز الصدمات AED فور وصوله، ولا يحكم المنقذ بالوفاة بعد ساعة من التدليك بل يستمر حتى يتسلم المسعفون. وفي نص الكتاب أيضاً: البند 4 في التدليك (ص 98) تكرار حرفي للبند 4 في طريقة النفخ وُضع مكان خطوة الضغط، وخطوة الضغط جاءت بلا رقم بعد الشكل؛ والإحالة «(شكل 2-12)» في ص 99 يقصد بها الشكل (5-18).</div>"+'</div>',title:'الأرقام الحالية'},
    {book:"<b>تحذير هام</b> <span class=\"ref\">ص 100</span>: تتطلب عملية تدليك القلب فهماً دقيقاً وتدريباً عملياً حتى تؤدى بطريقة صحيحة، وعندما تتم بطريقة غير سليمة فإنه ينتج عن ذلك مضاعفات كثيرة. واستعداداً للطوارئ يجب تدريب شخصين على الأقل في كل وردية مناوبة ليستطيعا تأدية هذه العملية بطريقة سليمة.",ref:'ص 100'},
    {title:'تحقق سريع: الضغطات اليوم',widget:(el,B)=>DCML.tf(el,B,{intro:'احكم على كل عبارة بحسب الإرشادات الحالية للبالغ (جمعية القلب الأمريكية).',items:[
     ['السرعة المطلوبة <span class="ltr">100–120</span> ضغطة في الدقيقة.',true,'هذا هو المعتمد اليوم؛ والكتاب يذكر <span class="ltr">60–80.</span>'],
     ['يكفي أن ينخفض الصدر 3 سم.',false,'العمق اليوم نحو <span class="ltr">5–6 سم</span>؛ و<span class="ltr">3–5 سم</span> رقم الكتاب القديم.'],
     ['تُترك فترات توقف طويلة بين الضغطات لراحة المنقذ.',false,'المطلوب تقليل التوقف إلى أقل حد؛ والمنقذان يتبادلان الضغطات كل دقيقتين تقريباً.'],
     ['الذراعان مستقيمتان والضغط بوزن الجسم من الكتفين.',true,'هذا في الكتاب (ص 99) وما زال صحيحاً.']]})},
    {watch:'<p>هذه المحطة لفهم الخطوات والأرقام فقط، ولا تغني عن التدريب العملي على دمية الإنعاش، كما يحذّر الكتاب نفسه (ص 100).</p>'}
   ]},

  {recap:[
   'الإصابات الكهربائية صنفان: الصدمة (حروق، وندبات 20%، وتمعدن الجلد 10%، وأضرار فيزيائية 3%) والصعقة (تهيج الأنسجة بتقلص تشنجي).',
   'الحروق تيارية (أقل من 1 kV) أو قوسية (<span class="ltr">220–380 V</span> بلا تيار في الجسم) أو مختلطة (أعلى من 1 kV).',
   'درجات الصعقة: تقلص بلا فقدان وعي ← مع فقدان الوعي ← اختلال القلب أو التنفس ← الموت بتوقفهما.',
   'الإغاثة: اقطع التيار، أو ضع النواقل في دائرة قصر، أو اعزل نفسك وأبعد المصاب بأداة عازلة؛ ولا تتركه ولو بدا ميتاً.',
   'الإنعاش اليوم (جمعية القلب الأمريكية): اطلب الإسعاف وجهاز AED، و30 ضغطة : 2 نفخة، بسرعة <span class="ltr">100–120</span> في الدقيقة وعمق <span class="ltr">5–6 سم</span>.']}
],
 theory:[
  {h:'5-5 أنواع الإصابات الكهربائية',ref:'ص 92–94',html:`<p>ويمكن تقسيم الإصابات الكهربائية إلى صنفين رئيسين:</p>
   <p><b>5-5-1 الصدمة الكهربائية:</b> وتتجلى بالضرر الذي يصيب أنسجة الجسم نتيجة تأثير تيار القصر أو القوس الكهربائي، وغالباً يكون سطحياً، أي يتضرر الجلد وأحياناً الأنسجة الرخوة مع الأربطة والعظام، حيث تتعلق خطورة الصدمة وصعوبة معالجتها بنوع ومميزات ودرجة تضرر الأنسجة، ورد فعل الأعضاء على هذا التضرر. وإذا ما كانت الحروق شديدة يموت عندها الإنسان، ليس بسبب التكهرب من مرور التيار الكهربائي، ولكن بنتيجة التضرر المحلي للعضوية. وهناك عدة مظاهر للصدمة الكهربائية هي:</p>
   <p><b>أ- الحروق الكهربائية:</b> وهي أكثر أنواع الصدمات الكهربائية انتشاراً، إذ تظهر عند أغلب المتضررين بالتيار الكهربائي، ويمكن تقسيم الحروق حسب شروط حدوثها إلى الأقسام التالية:</p>
   <ul><li><b>الحرق التياري أو التلامسي:</b> وذلك عند مرور التيار مباشرة عبر جسم الإنسان عند ملامسته للأجزاء الموصلة للتيار، وذلك في المنشآت الكهربائية ذات التوتر الأقل من ${lt('1 kV')}، ويتمثل باحتراق الجلد، والذي هو السطح الخارجي من الجسم.</li>
   <li><b>الحرق القوسي:</b> وذلك نتيجة تأثير القوس الكهربائي على جسم الإنسان، ولكن بدون مرور التيار من خلال جسمه، وذلك في المنشآت الكهربائية ذات الجهد المنخفض ${lt('220–380 V')} أثناء حدوث دائرة قصر مفاجئة، وذلك عند العمل تحت الجهد عند إجراء القياسات بأجهزة متنقلة.</li>
   <li><b>الحروق المختلطة:</b> وذلك نتيجة لأثر العاملين السابقين معاً، أي مرور التيار وتأثير القوس الكهربائي، وذلك في المنشآت الكهربائية ذات الجهد الأعلى من ${lt('1 kV')}، حيث يظهر القوس الكهربائي بين الأجزاء الحاملة للتيار الكهربائي وبين الإنسان، إذ يؤدي التيار المار بجسم الإنسان (بضع أمبيرات) إلى وفاة المصاب.</li></ul>
   <p><b>ب- الندبات الكهربائية:</b> <span class="ref">ص 93</span> وهي بقع جلدية صغيرة لونها إما فضي أو أصفر، ولها شكل دائري أو قطاعي، وذات لون غامق في مركزها، وأحياناً يكون شكلها مشابهاً لشكل الجزء الحامل للتيار الذي لامسه المصاب. وإن الندبات ليست ضارة، وتشفى مع مرور الزمن بسقوط طبقات الجلد العليا. وإن هذه الندبات تظهر عند حوالي <b>${lt('20%')}</b> من المصابين بالتيار الكهربائي.</p>
   <p><b>ج- تمعدن الجلد:</b> وذلك نتيجة احتراق الجلد من قبل ذرات المعدن المنصهر والمتطاير عند ظهور القوس الكهربائي — وذلك عند حدوث دائرة القصر، وعند فتح أو إغلاق الفواصل والقواطع تحت الحمل — يظهر احمرار في الجلد نتيجة الحرارة التي ينقلها المعدن المنصهر إلى الجلد، ويتهيج الجلد ويتألم بسبب وجود هذه الأجسام الخارجية، ويشفى الجلد بسقوطه على مرور الزمن، أما عند إصابة العين فيفقد المصاب نظره. ويظهر تمعدن الجلد عند حوالي <b>${lt('10%')}</b> من المصابين بالتيار الكهربائي.</p>
   <p><b>د- الأضرار الفيزيائية:</b> وذلك نتيجة التقلص الحاد وغير الإرادي للعضلات تحت تأثير التيار المار في جسم الإنسان، وبالتالي ظهور تشققات في الجلد، وانفجار الشرايين، وتمزق الأعصاب، وكسر العظام. وتظهر هذه الأضرار لحوالي <b>${lt('3%')}</b> من المصابين بالتيار الكهربائي.</p>`},
  {fig:'(5-14)',ref:'ص 93',caption:'بعض آثار الإصابات الكهربائية: حرق كهربائي في اليد، وحرق في باطن القدم (صورتان طبيتان في الكتاب)، ومقبس محمّل بعدة قوابس، ورمز تحذير من الصعق — رسم مبسّط',draw:()=>box(fig514(),440)},
  {h:'5-5-2 الصعقة الكهربائية',ref:'ص 94',html:`<p>وهي التهيج الذي يصيب الأنسجة الحية بسبب مرور التيار الكهربائي خلال جسم الإنسان، والذي يترافق مع التقلص التشنجي غير الإرادي للعضلات، وتصنف إلى:</p>
   <ul style="list-style:none;padding-inline-start:8px"><li>أ- التقلص التشنجي للعضلات بدون فقدان الوعي.</li><li>ب- التقلص التشنجي للعضلات مع فقدان الوعي، مع المحافظة على التنفس وعلى عمل القلب.</li><li>ج- فقدان الوعي واختلال عمل القلب أو التنفس أو كليهما.</li><li>د- الموت بتوقف التنفس والدورة الدموية.</li></ul>
   <p>أي إن الإنسان يبدأ بالشعور بصعوبة التنفس عندما يبلغ التيار المار في جسمه شدة <b>${lt('20–25 mA')}</b> عند تردد ${lt('60 Hz')}، وتزداد الصعوبة مع زيادة التيار. وعند استمرار تأثير التيار يمكن أن يظهر الاختناق نتيجة نقص الأوكسجين وزيادة غاز ثاني أوكسيد الكربون. كما أن تأثير التيار الكهربائي على عضلة القلب يمكن أن يكون مباشراً (عندما يمر التيار مباشرة عبر منطقة القلب)، أو غير مباشر أي عبر المنطقة العصبية المركزية عندما لا يمر التيار عبر منطقة القلب. في كلتا الحالتين يمكن أن يتوقف القلب، أو يرتجف بحيث يتوقف عن العمل كمضخة للدم.</p>
   <p>هذا وتتميز الإصابة الكهربائية برد فعل عصبي شديد للعضوية جواباً على التهيج القوي للتيار الكهربائي، والمترافق بخطر تعطل دوران الدم والتنفس، وتدوم هذه الحالة الحرجة من بضع عشرات من الدقائق حتى يوم كامل، يمكن أن يموت الإنسان بعدها أو يشفى كاملاً.</p>`},
  {err:'<span class="fixnote">درجات الصعقة الأربع مرقمة في الكتاب (ص 94) «أ، ب، أ، ب»، والصواب «أ، ب، ج، د» كما كتبناها.</span>'},
  {h:'5-8 إغاثة المصاب بالتيار الكهربائي',ref:'ص 94–95',html:`<p>يجب أن يتم بأسرع ما يمكن تخليص المصاب من التماس الذي سبب الحادث وإسعافه وفق ما يلي، حتى ولو ظهرت عليه علامات الموت، إذ إن ذلك غالباً ما يكون موتاً ظاهرياً فقط.</p>
   <p><b>أ- تخليص المصاب مع مراعاة ما يلي، حتى لا يتعرض المنقذ للخطر:</b> قطع التيار فوراً، وإذا تعذر ذلك توضع النواقل في دائرة قصر للحصول على ذات النتيجة، وإذا لم يتمكن ذلك يقوم المنقذ بعزل نفسه من جهة التيار ومن جهة الأرض في آن واحد، ويستعمل الأدوات التي لها مقابض عازلة، ويقف على سطح عازل أو بساط مطاطي أو أخشاب جافة، ويبعد المصاب عن كل تماس كهربائي (الشكل 5-15)، ويُستدعى الطبيب إلى مكان الحادث فوراً، وعلى ألا يترك المصاب لوحده نظراً إلى إجراء التنفس الاصطناعي في خلال دقائق وقوع الحادث.</p>`},
  {fig:'(5-15)',ref:'ص 95',caption:'المنقذ يقف على بساط عازل خارج منطقة الخطر ويبعد السلك عن المصاب بعصا خشبية — رسم مبسّط',draw:()=>box(fig515(),420)},
  {h:'التنفس الاصطناعي وتدليك القلب',ref:'ص 95–100',html:`<p>طرق الإسعاف التي في الكتاب (ص 95–100) قديمة، وبعض أرقامها تخالف الإرشادات المعتمدة اليوم. اختر ما تريد عرضه:</p>
`},
  {widget:(el)=>{el.innerHTML=B.bkCtl(BK,'طريقة الإسعاف:')}},
  {html:BOOKCPR+FIXCPR},
  {note:'<b>تحذير هام</b> <span class="ref">ص 100</span>: تتطلب عملية تدليك القلب فهماً دقيقاً وتدريباً عملياً حتى تؤدى بطريقة صحيحة، وعندما تتم بطريقة غير سليمة فإنه ينتج عن ذلك مضاعفات كثيرة. واستعداداً للطوارئ يجب تدريب شخصين على الأقل في كل وردية مناوبة ليستطيعا تأدية هذه العملية بطريقة سليمة.'}
 ],
 lab:(el)=>lab4(el),
 quiz:[
  {q:'ما الصنفان الرئيسان للإصابات الكهربائية؟',o:['الحروق والكسور','الصدمة الكهربائية والصعقة الكهربائية','الصرع والانهيار العصبي','الجروح والكدمات'],c:1,e:'«ويمكن تقسيم الإصابات الكهربائية إلى صنفين رئيسين»: الصدمة والصعقة (ص 92–94).'},
  {q:'ما الحرق الذي يحدث بتأثير القوس الكهربائي دون مرور التيار في الجسم؟',o:['الحرق التياري','الحرق القوسي','الحرق المختلط','تمعدن الجلد'],c:1,e:'الحرق القوسي: «نتيجة تأثير القوس الكهربائي على جسم الإنسان ولكن بدون مرور التيار من خلال جسمه» (ص 92).'},
  {q:'عند كم في المئة من المصابين تظهر الندبات الكهربائية؟',o:['3%','10%','20%','50%'],c:2,e:'الندبات عند حوالي 20%، وتمعدن الجلد 10%، والأضرار الفيزيائية 3% (ص 93).'},
  {q:'ما أول ما يفعله المنقذ عند رؤية مصاب ملتصق بموصل كهربائي؟',o:['يسحبه بيده فوراً','يقطع التيار فوراً','يبدأ النفخ في فمه','يسكب عليه الماء'],c:1,e:'«قطع التيار فوراً، وإذا تعذر ذلك…» حتى لا يتعرض المنقذ للخطر (ص 94).'},
  {q:'حسب الإرشادات الحالية للإنعاش القلبي الرئوي للبالغ، ما نسبة الضغطات إلى النفخات؟',o:['12 ضغطة : 2–3 نفخات','5 ضغطات : نفخة','30 ضغطة : نفختان','60 ضغطة : نفخة'],c:2,e:'الإرشادات الحالية (جمعية القلب الأمريكية): 30 : 2. أما 12 : 2–3 و5 : 1 فهي أرقام الكتاب القديمة (ص 99).'},
  {q:'كم سرعة الضغطات على الصدر في الإرشادات الحالية؟',o:['12–15 في الدقيقة','60–80 في الدقيقة','100–120 في الدقيقة','200 في الدقيقة'],c:2,e:'100–120 ضغطة في الدقيقة بعمق 5–6 سم. والكتاب يذكر 60–80 (ص 99)، وهو رقم قديم.'}
 ]
});

/* =====================================================================
   LESSON 5 — الوقاية، والعزل وتعليق اللافتات (ص 100–107) + أسئلة الوحدة (ص 108–110)
   ===================================================================== */
const padlock=(x,y,c)=>`<g><path d="M${x-5} ${y}v-6a5 5 0 0 1 10 0v6" style="fill:none;stroke:var(--fg);stroke-width:2"/><rect x="${x-7}" y="${y}" width="14" height="11" rx="2" style="fill:${c};stroke:var(--fg)"/></g>`;
const tagG=(x,y)=>`<g><path d="M${x} ${y-14}V${y}" style="stroke:var(--fg)"/><rect x="${x-24}" y="${y}" width="48" height="34" rx="3" style="fill:#fff;stroke:var(--fg)"/><rect x="${x-24}" y="${y}" width="48" height="10" style="fill:#c8372d"/><text x="${x}" y="${y+8}" text-anchor="middle" style="font:700 7px sans-serif;fill:#fff">DANGER</text><text x="${x}" y="${y+20}" text-anchor="middle" style="font:700 6px sans-serif;fill:#222">DO NOT</text><text x="${x}" y="${y+28}" text-anchor="middle" style="font:700 6px sans-serif;fill:#222">OPERATE</text></g>`;
const LKC={s:'var(--blue)',m:'var(--live)'};
function lotoSVG(S,ang,cl){let s=`<svg viewBox="0 0 640 300" role="img" aria-label="لوحة كهرباء وخط هواء مضغوط ومعدة: نفّذ خطوات العزل وتعليق اللافتات">`;
  const live=S.brk,air=S.press>0.02;
  /* electrical panel */
  s+=`<rect x="20" y="40" width="150" height="200" rx="8" style="fill:var(--surface-2);stroke:var(--fg);stroke-width:1.6"/>`+ta(95,30,'لوحة الكهرباء');
  s+=`<path d="M95 0V40" style="stroke:var(--live);stroke-width:4"/>`;
  s+=`<rect x="70" y="80" width="50" height="90" rx="6" style="fill:var(--surface);stroke:var(--fg)"/>`+tl(95,76,'ON',{m:1})+tl(95,184,'OFF',{m:1});
  s+=`<rect x="84" y="${live?90:130}" width="22" height="30" rx="4" style="fill:${live?'var(--on)':'var(--muted)'};stroke:var(--fg)"/>`;
  const nl=(S.lk.bs?1:0)+(S.lk.bm?1:0);if(nl){s+=`<path d="M106 150h18v26h-18" style="fill:none;stroke:var(--fg);stroke-width:3"/>`;let k=0;if(S.lk.bs)s+=padlock(130+k++*16,170,LKC.s);if(S.lk.bm)s+=padlock(130+k*16,170,LKC.m)}
  if(S.tg.b)s+=tagG(60,196);
  /* cable to motor */
  s+=`<path d="M150 240V280H390V248" style="fill:none;stroke:${live?'var(--live)':'var(--muted)'};stroke-width:${live?4:3}"/>`;
  /* air line */
  s+=ta(320,22,'خط الهواء المضغوط');
  s+=`<path d="M230 40V100M230 122V250H300" style="fill:none;stroke:var(--blue);stroke-width:8;opacity:.35"/><path d="M230 0V100" style="stroke:var(--blue);stroke-width:8"/>`;
  s+=`<path d="M230 122V250H300M300 250V60H470V64" style="fill:none;stroke:${air?'var(--blue)':'var(--muted)'};stroke-width:8;stroke-linejoin:round;opacity:${air?1:.5}"/>`;
  s+=`<circle cx="230" cy="111" r="16" style="fill:var(--surface);stroke:var(--fg);stroke-width:2"/>`;for(let k=0;k<4;k++){const a=k*45+(S.vlv?0:90);s+=`<path d="M${230-15*Math.cos(a*Math.PI/180)} ${111-15*Math.sin(a*Math.PI/180)}L${230+15*Math.cos(a*Math.PI/180)} ${111+15*Math.sin(a*Math.PI/180)}" style="stroke:var(--fg);stroke-width:2"/>`}
  s+=tl(258,104,S.vlv?'OPEN':'CLOSED',{a:'start',st:`font-size:10px;fill:${S.vlv?'var(--blue)':'var(--muted)'}`});
  const nv=(S.lk.vs?1:0)+(S.lk.vm?1:0);if(nv){s+=`<circle cx="230" cy="111" r="20" style="fill:var(--stop);opacity:.35;stroke:var(--stop);stroke-width:2"/>`;let k=0;if(S.lk.vs)s+=padlock(196-k++*16,136,LKC.s);if(S.lk.vm)s+=padlock(196-k*16,136,LKC.m)}
  if(S.tg.v)s+=tagG(196,154);
  /* gauge + bleed */
  s+=`<circle cx="260" cy="200" r="20" style="fill:var(--surface);stroke:var(--fg);stroke-width:1.6"/><path d="M243 207A18 18 0 1 1 277 207" style="fill:none;stroke:var(--line);stroke-width:3"/>`;
  const ga=(-210+(chF('gauge0')?0:S.press)*240)*Math.PI/180;s+=`<path d="M260 200L${(260+15*Math.cos(ga)).toFixed(1)} ${(200+15*Math.sin(ga)).toFixed(1)}" style="stroke:var(--stop);stroke-width:2.4"/><path d="M240 200H230" style="stroke:var(--fg);stroke-width:3"/>`;
  s+=ta(262,236,'ضغط متبقٍ',{m:1});
  s+=`<path d="M300 180h18" style="stroke:var(--fg);stroke-width:4"/><rect x="318" y="174" width="10" height="12" style="fill:${S.bleed?'var(--live)':'var(--surface)'};stroke:var(--fg)"/>`;
  if(S.bleed&&S.press>0.02&&!chF('bleedBlk'))for(let k=0;k<3;k++)s+=`<circle cx="${338+k*10}" cy="${180-k*6}" r="${3+k*1.5}" style="fill:var(--blue-soft);stroke:var(--blue)"/>`;
  s+=ta(330,206,'صمام التفريغ',{m:1});
  /* machine */
  s+=`<rect x="350" y="62" width="270" height="200" rx="10" style="fill:none;stroke:var(--fg);stroke-width:1.6;stroke-dasharray:6 4"/>`+ta(560,56,'المعدة');
  s+=`<circle cx="390" cy="222" r="26" style="fill:var(--surface);stroke:var(--fg);stroke-width:2"/>`;for(let k=0;k<3;k++){const a=ang+k*120;s+=`<path d="M390 222L${(390+20*Math.cos(a)).toFixed(1)} ${(222+20*Math.sin(a)).toFixed(1)}" style="stroke:${S.run&&(live||chF('weld'))?'var(--on)':'var(--fg)'};stroke-width:3"/>`}s+=tl(390,258,'M',{m:1});
  s+=`<path d="M416 222H600" style="stroke:var(--fg);stroke-width:2"/>`;[440,520,600].forEach(x=>{s+=`<circle cx="${x}" cy="222" r="9" style="fill:var(--surface-2);stroke:var(--fg)"/>`});
  s+=`<rect x="455" y="64" width="30" height="40" rx="4" style="fill:var(--surface-2);stroke:var(--fg)"/><path d="M470 104V${130+cl*50}" style="stroke:var(--fg);stroke-width:5"/><rect x="448" y="${130+cl*50}" width="44" height="12" rx="3" style="fill:var(--muted);stroke:var(--fg)"/>`;
  s+=ta(530,86,'مكبس هوائي',{m:1,a:'end'});
  /* push buttons on the machine (fig 5-20) */
  s+=`<rect x="560" y="120" width="44" height="64" rx="6" style="fill:var(--surface);stroke:var(--fg)"/><circle cx="582" cy="138" r="9" style="fill:#1d8a57"/><circle cx="582" cy="166" r="9" style="fill:#c8372d"/>`;
  if(S.work&&!S.workDone)s+=man(520,214,{s:.7,rh:[478,150],lh:[540,170]});
  if(S.acc)s+=`<rect x="350" y="62" width="270" height="200" rx="10" style="fill:var(--stop);opacity:.18"/>`+ta(485,40,'حادث!',{st:'fill:var(--stop);font-size:16px;font-weight:800'});
  return s+'</svg>'}

function lab5(el){addCss();
  const S0=()=>({notified:0,run:1,brk:1,vlv:1,press:1,bleed:0,lk:{bs:0,bm:0,vs:0,vm:0},tg:{b:0,v:0},permit:0,work:0,workDone:0,clear:0,acc:'',ev:{}});
  let S=S0(),prog=0,ang=0,cl=0,clt=0,log=[];
  const T=[
   ['1- إبلاغ قسم الصيانة عن الخلل في المعدة',()=>S.notified],
   ['2- إيقاف المعدة بالطريقة المعتادة: زر الإيقاف Stop (الشكل 5-20)',()=>S.ev.stop],
   ['3- فصل التيار الكهربائي وإغلاق محبس الهواء المضغوط',()=>!S.brk&&!S.vlv],
   ['4- محاولة التشغيل بعد العزل للتأكد من عدم عملها، ثم إعادة مفاتيح التشغيل إلى الإيقاف',()=>S.ev.t1&&S.ev.t1off],
   ['5- تفريغ الطاقة المتبقية في المواسير (الشكل 5-21)',()=>S.press<=0.01],
   ['6- تأمين المفتاح والمحبس بالأقفال: قفل مسؤول الموقع وقفل مسؤول الصيانة، وكلٌّ يحتفظ بمفتاحه',()=>S.lk.bs&&S.lk.bm&&S.lk.vs&&S.lk.vm],
   ['7- تعليق لافتة بجوار المفتاح والمحبس المغلقين (الشكل 5-23)',()=>S.tg.b&&S.tg.v],
   ['8- تعبئة تصريح عزل الطاقة وتوقيعه من مسؤول الصيانة ومسؤول الموقع',()=>S.permit],
   ['9- محاولة تشغيل أخيرة، ثم إعادة مفاتيح التشغيل إلى الإيقاف، والبدء بالعمل',()=>S.ev.fin&&S.ev.finOff&&S.work],
   ['انتهاء أعمال الصيانة',()=>S.workDone],
   ['13- التأكد من عدم وجود أي شخص بجوار المعدة',()=>S.clear],
   ['13- فك الأقفال، وإعادة التيار، وفتح المحبس، وإزالة اللافتات',()=>!S.lk.bs&&!S.lk.bm&&!S.lk.vs&&!S.lk.vm&&S.brk&&S.vlv&&!S.tg.b&&!S.tg.v],
   ['14- تشغيل المعدة من مفاتيحها بحضور مسؤول الموقع ومسؤول الصيانة',()=>S.ev.restart]];
  el.innerHTML=`<div class="grid">
   <div class="panel c12"><h2>مختبر العزل وتعليق اللافتات (Lock-out / Tag-out) <small>مبني على إجراءات البند 5-10 ص 104–107 والأشكال (5-20) إلى (5-23)</small></h2>
    <p class="sub">معدة فيها محرك كهربائي ومكبس يعمل بالهواء المضغوط تحتاج صيانة. نفّذ الخطوات بترتيب الكتاب. لا يُسمح ببدء الصيانة إلا بعد اكتمال العزل، ولا تعود المعدة للعمل إلا بعد فك العزل بترتيبه.</p>
    <div class="svgbox" id="lv" style="max-width:640px;margin-inline:auto"></div>
    <div class="legend" style="margin-top:8px;padding:8px 12px"><span><i style="background:var(--blue)"></i>قفل مسؤول الموقع</span> · <span><i style="background:var(--live)"></i>قفل مسؤول الصيانة</span></div>
    <div class="callout" id="say"></div></div>
   <div class="panel c7"><h2>أدوات التحكم</h2>
    <div class="s5-grp"><b>المعدة (الشكل 5-20)</b><div class="pbs">${pbHTML('st','green','I','تشغيل Start')}${pbHTML('sp','red','O','إيقاف Stop')}</div></div>
    <div class="s5-grp"><b>لوحة الكهرباء</b><div class="s5-ctl"><button class="btn" id="brk"></button><button class="btn" id="lbs"></button><button class="btn" id="lbm"></button><button class="btn" id="tgb"></button></div></div>
    <div class="s5-grp"><b>خط الهواء المضغوط</b><div class="s5-ctl"><button class="btn" id="vlv"></button><button class="btn" id="bld"></button><button class="btn" id="lvs"></button><button class="btn" id="lvm"></button><button class="btn" id="tgv"></button></div></div>
    <div class="s5-grp"><b>الإجراءات</b><div class="s5-ctl"><button class="btn" id="ntf">أبلغ قسم الصيانة</button><button class="btn" id="prm">املأ تصريح العزل ووقّعه</button><button class="btn primary" id="wrk">ابدأ الصيانة</button><button class="btn" id="wdn">انتهى العمل</button><button class="btn" id="clr">تأكد من خلو المكان</button></div></div>
    <div class="s5-grp"><b>اختبر قيمة الأقفال</b><div class="s5-ctl"><button class="btn warn" id="col">زميل لا يعلم بالصيانة يحاول تشغيل المعدة</button><button class="btn" id="rst">ابدأ من جديد</button></div></div>
    <h3 class="sm">ما حدث</h3><ul class="s5-found" id="log"></ul></div>
   <div class="panel c5"><h2>خطوات الكتاب <small>ص 104–107</small></h2><ul class="s5-check" id="chk"></ul>
    <p class="sub">أرقام الخطوات بعد تصحيح ترقيم الكتاب (انظر الشرح). الخطوات 10–12 (أعمال المقاولين، والتسليم بين الورديات، وجولات السلامة) لا تظهر في المختبر.</p>
    ${tries(['قبل العزل اضغط «ابدأ الصيانة»: لماذا يرفض المختبر؟','بعد الأقفال اضغط «زميل… يحاول تشغيل المعدة».','جرّب بلافتة فقط دون أقفال، ثم بلا شيء: ماذا يحدث؟','لا تنسَ الضغط المتبقي: أغلق المحبس ولاحظ أن العداد لا ينزل حتى تفتح صمام التفريغ.'])}</div>
  </div>`;
  const $=s=>el.querySelector(s);
  const say=(h,bad)=>{log.unshift((bad?'<b style="color:var(--stop)">':'')+h+(bad?'</b>':''));log=log.slice(0,7);$('#log').innerHTML=log.map(x=>`<li>${x}</li>`).join('')};
  const iso=()=>!S.brk&&!S.vlv;
  const working=()=>S.work&&!S.workDone;
  const hazard=()=>{if(working()&&((S.run&&(S.brk||chF('weld')))||S.press>0.05)){S.acc='1';say('حادث! المعدة تحركت والعامل بداخلها. هذا ما يمنعه نظام العزل وتعليق اللافتات.',1);S.work=0}};
  const lockBlocked=(k)=>{if(S.work&&!(S.workDone&&S.clear)){say('لا تُفك الأقفال قبل انتهاء العمل والتأكد من عدم وجود أي شخص بجوار المعدة (الخطوة 13).',1);return true}return false};
  const btn=(id,f)=>$(id).addEventListener('click',()=>{f();upd()});
  btn('#ntf',()=>{S.notified=1;say('أبلغ مسؤول الموقع قسم الصيانة عن الخلل.')});
  btn('#st',()=>{if(S.acc)return;
    if(S.brk){S.run=1;if(prog===12){S.ev.restart=1;say('عادت المعدة للعمل بحضور مسؤول الموقع ومسؤول الصيانة.')}else say('ضغطت زر التشغيل: المعدة تعمل.')}
    else if(chF('weld')){S.run=1;say('ضغطت زر التشغيل: <b>المعدة تعمل</b> مع أن مفتاح الكهرباء على OFF.',1)}
    else{S.run=0;if(prog===3&&iso())S.ev.t1=1;if(prog===8)S.ev.fin=1;say('ضغطت زر التشغيل: المعدة لا تعمل — الطاقة معزولة عنها.')}
    hazard()});
  btn('#sp',()=>{if(prog===1)S.ev.stop=1;if(S.run&&S.brk){say(prog===0?'توقفت المعدة. لكن الخطوة 1 أولاً: أبلغ قسم الصيانة، ثم أوقفها.':'ضغطت زر الإيقاف: توقفت المعدة.')}else say('ضغطت زر الإيقاف: مفاتيح التشغيل على الإيقاف.');S.run=0;if(S.ev.t1)S.ev.t1off=1;if(S.ev.fin)S.ev.finOff=1});
  btn('#brk',()=>{if(S.lk.bs||S.lk.bm){say('المفتاح مقفل بالأقفال؛ لا يمكن تحريكه.',1);return}S.brk=S.brk?0:1;say(S.brk?'أعدت التيار إلى المعدة (ON).':'فصلت التيار الكهربائي عن المعدة (OFF).');hazard()});
  btn('#vlv',()=>{if(S.lk.vs||S.lk.vm){say('المحبس مقفل؛ لا يمكن فتحه.',1);return}S.vlv=S.vlv?0:1;say(S.vlv?'فتحت محبس الهواء المضغوط.':'أغلقت محبس الهواء المضغوط.');hazard()});
  btn('#bld',()=>{S.bleed=S.bleed?0:1;say(S.bleed?(S.vlv?'فتحت صمام التفريغ والمحبس مفتوح: الهواء يتسرب ولا ينزل الضغط. أغلق المحبس أولاً.':chF('bleedBlk')?'فتحت صمام التفريغ.':'فتحت صمام التفريغ: يخرج الهواء المحبوس في المواسير.'):'أغلقت صمام التفريغ.')});
  const lk=(k,dev,who)=>()=>{if(S.lk[k]){if(lockBlocked(k))return;S.lk[k]=0;say(`فكّ ${who} قفله بمفتاحه.`);return}
    if(dev==='b'&&S.brk){say('لا يُقفل المفتاح وهو على ON. افصل التيار أولاً.',1);return}if(dev==='v'&&S.vlv){say('أغلق المحبس أولاً ثم أقفله.',1);return}
    S.lk[k]=1;say(`وضع ${who} قفله على ${dev==='b'?'مفتاح الكهرباء':'المحبس'} واحتفظ بمفتاحه.`)};
  btn('#lbs',lk('bs','b','مسؤول الموقع'));btn('#lbm',lk('bm','b','مسؤول الصيانة'));btn('#lvs',lk('vs','v','مسؤول الموقع'));btn('#lvm',lk('vm','v','مسؤول الصيانة'));
  const tg=(k)=>()=>{if(S.tg[k]){if(working()){say('لا تُزال اللافتات أثناء العمل.',1);return}S.tg[k]=0;say('أزلت اللافتة.');return}S.tg[k]=1;say(`علّقت لافتة «خطر — لا تشغّل» على ${k==='b'?'مفتاح الكهرباء':'المحبس'}.`)};
  btn('#tgb',tg('b'));btn('#tgv',tg('v'));
  btn('#prm',()=>{if(prog<7){say('التصريح يُملأ بعد تركيب الأقفال وتعليق اللافتات (الخطوة 8 تأتي بعد 6 و7).',1);return}S.permit=1;say('مُلئ تصريح عزل الطاقة ووقّعه المسؤولان (نسخة للموقع، ونسخة للصيانة، ونسخة للسلامة).')});
  btn('#wrk',()=>{if(S.acc)return;if(working())return;
    if(prog<8||!(S.ev.fin&&S.ev.finOff)){const miss=T.slice(prog,8).map(t=>t[0]);const energy=S.brk||S.press>0.05;
      say((energy?'لا يجوز بدء الصيانة: المعدة ما زالت متصلة بمصدر طاقة. ':'لم يكتمل العزل بعد. ')+'الناقص: '+miss.map(x=>'«'+x.replace(/^\d+- /,'')+'»').join('، ')+'.',1);return}
    S.work=1;say('بدأ فريق الصيانة العمل بأمان: كل مصادر الطاقة معزولة ومقفلة.')});
  btn('#wdn',()=>{if(!working()){say('لم يبدأ العمل بعد.',1);return}S.workDone=1;say('انتهى العمل. قبل فك الأقفال تأكد من خلو المكان.')});
  btn('#clr',()=>{if(!S.workDone){say('هذه الخطوة بعد انتهاء العمل.',1);return}S.clear=1;say('تأكد المسؤولان من عدم وجود أي شخص بجوار المعدة.')});
  btn('#col',()=>{if(S.lk.bs||S.lk.bm){say('جاء زميل ليشغّل المعدة فوجد الأقفال على المفتاح، ولا يملك مفاتيحها، فلم يستطع. هذه فائدة القفل.');return}
    if(S.tg.b){say('جاء زميل ليشغّل المعدة فقرأ اللافتة «خطر — لا تشغّل» فتراجع. لكن اللافتة تنبيه فقط ولا تمنع من لا ينتبه لها؛ لذلك يفضّل الكتاب الأقفال كلما أمكن.');return}
    S.brk=1;if(!S.lk.vs&&!S.lk.vm)S.vlv=1;S.run=1;say(working()?'زميل أعاد التيار وضغط التشغيل وهو لا يعلم أن أحداً يعمل داخل المعدة!':'زميل أعاد التيار وشغّل المعدة: لا قفل ولا لافتة يمنعانه.',1);hazard()});
  btn('#rst',()=>{S=S0();prog=0;log=[];$('#log').innerHTML='';say('بدأت من جديد: المعدة تعمل وتحتاج صيانة.')});
  const lbl=(on,a,b)=>on?a:b;
  const upd=()=>{while(prog<T.length&&T[prog][1]())prog++;
    $('#brk').textContent=lbl(S.brk,'المفتاح ON — افصل التيار','المفتاح OFF — أعد التيار');
    $('#vlv').textContent=lbl(S.vlv,'المحبس مفتوح — أغلقه','المحبس مغلق — افتحه');
    $('#bld').textContent=lbl(S.bleed,'أغلق صمام التفريغ','افتح صمام التفريغ');
    [['#lbs','bs','قفل الموقع'],['#lbm','bm','قفل الصيانة'],['#lvs','vs','قفل الموقع'],['#lvm','vm','قفل الصيانة']].forEach(([id,k,n])=>{$(id).textContent=(S.lk[k]?'فكّ ':'ضع ')+n;$(id).setAttribute('aria-pressed',String(!!S.lk[k]))});
    $('#tgb').textContent=S.tg.b?'أزل اللافتة':'علّق لافتة';$('#tgv').textContent=S.tg.v?'أزل اللافتة':'علّق لافتة';
    $('#chk').innerHTML=T.map((t,i)=>`<li class="${i<prog?'ok':i===prog?'cur':''}"><i>${i<prog?'✓':i===prog?'←':'·'}</i><span>${t[0]}</span></li>`).join('');
    $('#say').innerHTML=S.acc?'<b style="color:var(--stop)">وقع حادث.</b> اضغط «ابدأ من جديد» ونفّذ الخطوات كلها قبل بدء الصيانة.':prog>=T.length?'<b>أحسنت.</b> نفّذت إجراءات العزل وتعليق اللافتات كلها بترتيب الكتاب، ثم أعدت المعدة للعمل بأمان.':`<b>الخطوة الحالية:</b> ${T[prog][0]}`};
  say('المعدة تعمل وتحتاج صيانة. ابدأ بالخطوة 1.');upd();
  let sig='';
  loopOn(el,dt=>{if(chF('pass')&&!S.vlv)S.press=S.bleed?Math.max(0.3,S.press-dt*0.6):Math.min(1,S.press+dt*0.12);
    else if(!S.vlv&&S.bleed&&!chF('bleedBlk'))S.press=Math.max(0,S.press-dt*0.6);else if(S.vlv)S.press=Math.min(1,S.press+dt*2);
    const mv=S.run&&(S.brk||chF('weld'));if(mv)ang+=dt*6;if(S.run&&S.press>0.05){clt+=dt*2.5;cl=(1-Math.cos(clt))/2}else cl=Math.max(0,cl-dt);
    const k=[S.press.toFixed(2),mv?ang.toFixed(1):0,cl.toFixed(2),JSON.stringify(S)].join('|');if(k!==sig){sig=k;$('#lv').innerHTML=lotoSVG(S,ang,cl)}
    if(prog<T.length&&T[prog][1]())upd()})}

/* figures of lesson 5 */
const fig519=()=>{const L=[['ELECTRICITY','كهرباء'],['COMPRESSED AIR','هواء مضغوط'],['HYDRAULIC PRESSURE','ضغط هيدروليكي'],['GAS','غاز'],['STEAM','بخار']];
  let s=`<svg viewBox="0 0 500 150" role="img" aria-label="مصادر الطاقة: كهرباء، هواء مضغوط، ضغط هيدروليكي، غاز، بخار">`;
  L.forEach(([en,ar],i)=>{const x=50+i*100;s+=`<rect x="${x-46}" y="6" width="92" height="138" rx="8" style="fill:var(--surface-2);stroke:var(--line)"/>`;
   if(i===0)s+=`<rect x="${x-12}" y="34" width="24" height="36" rx="3" style="fill:var(--surface);stroke:var(--fg)"/><path d="M${x+14} 40l10-6M${x+14} 52h12M${x+14} 64l10 6" style="stroke:var(--live);stroke-width:2"/>`;
   if(i===1)s+=`<rect x="${x-16}" y="30" width="32" height="48" rx="14" style="fill:var(--surface);stroke:var(--fg)"/>`;
   if(i===2)s+=`<rect x="${x-14}" y="40" width="28" height="36" style="fill:var(--surface);stroke:var(--fg)"/><path d="M${x} 22v14m-6-6l6 8 6-8" style="fill:none;stroke:var(--stop);stroke-width:2.4"/>`;
   if(i===3)s+=`<path d="M${x-36} 60H${x+36}" style="stroke:var(--fg);stroke-width:8"/><circle cx="${x}" cy="44" r="12" style="fill:none;stroke:var(--fg);stroke-width:2"/><path d="M${x} 44V56" style="stroke:var(--fg);stroke-width:3"/>`;
   if(i===4)s+=`<path d="M${x-20} 80V50q20-24 40 0V80Z" style="fill:var(--surface);stroke:var(--fg)"/><path d="M${x} 30q-8-8 0-16q8-8 0-16" style="fill:none;stroke:var(--muted);stroke-width:2"/>`;
   s+=tl(x,104,en,{st:'font-size:8.5px'})+ta(x,126,ar,{m:1})});
  return s+'</svg>'};
const fig520=()=>`<svg viewBox="0 0 200 130" role="img" aria-label="يد تضغط زر الإيقاف الأحمر"><circle cx="120" cy="34" r="18" style="fill:#1d8a57;stroke:var(--fg);stroke-width:2"/><circle cx="120" cy="88" r="18" style="fill:#c8372d;stroke:var(--fg);stroke-width:2"/><path d="M14 80h70q12 0 12 8t-12 8H60v18H20z" style="fill:var(--fg)"/>`+tl(150,38,'I',{a:'start'})+tl(150,92,'O',{a:'start'})+`</svg>`;
const fig105=()=>{let s=`<svg viewBox="0 0 440 180" role="img" aria-label="غطاء قفل لعجلة محبس، ومفتاح فصل على وضع الإيقاف عليه مشبك أقفال ولافتة">`;
  s+=`<rect x="5" y="5" width="210" height="170" rx="8" style="fill:var(--surface-2);stroke:var(--line)"/><rect x="225" y="5" width="210" height="170" rx="8" style="fill:var(--surface-2);stroke:var(--line)"/>`;
  [60,160].forEach((x,k)=>{s+=`<path d="M${x} 10V170" style="stroke:var(--muted);stroke-width:12"/>`;
   if(!k){s+=`<circle cx="${x}" cy="80" r="26" style="fill:none;stroke:var(--blue);stroke-width:3"/><path d="M${x-32} 80a32 32 0 0 1 64 0" style="fill:var(--stop);opacity:.8"/><path d="M${x-32} 84a32 32 0 0 0 64 0" style="fill:var(--stop);opacity:.8" transform="rotate(30 ${x-32} 84)"/>`}
   else{s+=`<ellipse cx="${x}" cy="80" rx="34" ry="30" style="fill:var(--stop);opacity:.85"/><circle cx="${x}" cy="80" r="5" style="fill:var(--surface)"/>`+padlock(x+40,96,'var(--muted)')}});
  s+=`<rect x="290" y="30" width="60" height="110" rx="6" style="fill:var(--surface);stroke:var(--fg)"/><path d="M320 70V120" style="stroke:var(--fg);stroke-width:8;stroke-linecap:round"/>`+tl(320,24,'ON',{m:1})+tl(320,156,'OFF',{m:1});
  s+=`<path d="M326 120h30v20h-30" style="fill:none;stroke:var(--fg);stroke-width:3"/>`+padlock(366,140,'var(--blue)')+padlock(382,140,'var(--live)')+padlock(398,140,'var(--on)')+tagG(392,40);
  return s+'</svg>'};

const QA=(q,a)=>`<details style="margin:6px 0"><summary>${q}</summary><div style="padding:6px 10px 2px"><p><b>إجابة مقترحة (ليست من الكتاب):</b> ${a}</p></div></details>`;
const TF=[
 ['إن من أسباب الإصابة بالتيار الكهربائي عدم ملامسة التوصيلات الكهربية.','×','السبب هو الملامسة لا عدمها (ص 79).'],
 ['إن من أسباب الإصابة بالتيار الكهربائي ملامسة التوصيلات الكهربية.','√','البند أ من أسباب الإصابة (ص 79).'],
 ['من آثار مرور التيار الكهربائي [في] جسم الإنسان تأثير فرق الجهد.','√','«هـ- تأثير الجهد الكهربائي» من بنود عنوان الآثار (ص 84).','<span class="fixnote">صياغة العبارتين 3 و4 لا تطابق تقسيم الآثار في الشرح (حرارية وتحليلية وبيولوجية، ص 81)؛ وعددناها صحيحة لأن «تأثير الجهد» بند تحت عنوان الآثار.</span>'],
 ['من آثار مرور التيار الكهربائي [في] جسم الإنسان عدم تأثير فرق الجهد.','×','عكس العبارة السابقة.'],
 ['تحدث الوفاة للإنسان عندما يمر في جسمه 200 مللي أمبير.','√','الجدول: 100–200 «توقف القلب»، وأكثر من 200 «تقلص تام لعضلة القلب» (ص 83).','<span class="fixnote">العبارتان 5 و6 بُنيتا زوجاً تكون فيه واحدة صحيحة، لكن الكتاب يجعل كلتيهما صحيحة: فهو يقول إن 0.1 أمبير (100 مللي أمبير) «مميت في جميع الأحوال» (ص 84).</span>'],
 ['تحدث الوفاة للإنسان عندما يمر في جسمه 100 مللي أمبير.','√','«تياراً بشدة 0.1 أمبير هو مميت في جميع الأحوال» (ص 84).'],
 ['يجري التنفس الصناعي للشخص المصاب وهو في وضع استرخاء.','√','يوضع المصاب على ظهره (ص 96).'],
 ['يجري التنفس الصناعي للشخص المصاب وهو في وضع وقوف على الأرض.','×','عكس العبارة السابقة.'],
 ['من الحالات الناتجة عن مرور تيار في جسم الإنسان لمس الأرض.','×','لمس الأرض وحده لا يسبب مرور تيار؛ يلزم لمس نقطتين بينهما فرق جهد (ص 86).'],
 ['من الحالات الناتجة عن مرور تيار في جسم الإنسان لمس سلك الكهرباء.','√','لمس خط واحد أو خطين (ص 86).'],
 ['جهد التماس هو أحد حالات جهد الخطوة.','×','الكتاب يقول العكس: «جهد الخطوة من إحدى حالات جهد التماس» (ص 88).','<span class="fixnote">العبارتان 11 و12 كلتاهما خاطئة حسب الكتاب، فلا عبارة صحيحة في هذا الزوج. العبارة الصحيحة: «جهد الخطوة هو أحد حالات جهد التماس».</span>'],
 ['جهد التماس هو أحد حالات جهد المصدر الكهربائي.','×','جهد التماس فرق جهد بين نقطتين من جسم الإنسان (ص 88).'],
 ['من أنواع الإصابات بالكهرباء الصدمة والصاعقة الكهربائية.','√','الصدمة والصعقة (ص 92–94).'],
 ['أنواع الإصابات بالكهرباء الصرع والانهيار العصبي.','×','ليسا من تقسيم الكتاب.'],
 ['تنقسم الحروق حسب حدوثها إلى تيارية وقوسية ومختلطة.','√','(ص 92).'],
 ['تنقسم الحروق حسب حدوثها إلى حروق بسيطة وحروق مركبة.','×','عكس العبارة السابقة.'],
 ['يصنف التقلص التشنجي إلى أربعة أقسام أساسية.','√','الأقسام الأربعة (أ–د) هي تصنيف الصعقة الكهربائية، والتقلص التشنجي جزء من تعريفها (ص 94).','<span class="fixnote">العبارة تنسب التصنيف إلى «التقلص التشنجي»، والكتاب يصنّف «الصعقة الكهربائية» إلى أربعة أقسام.</span>'],
 ['يصنف التقلص التشنجي إلى عشرة أقسام أساسية.','×','أربعة لا عشرة.'],
 ['الندبات الكهربية تحدث [عند] حوالي 20٪ من المصابين بالتيار الكهربي.','√','(ص 93).'],
 ['الندبات الكهربية تحدث [عند] حوالي 50٪ من المصابين بالتيار الكهربي.','×','20٪ لا 50٪.'],
 ['تمعدن الجلد يحدث في حوالي 10٪ من المصابين بالتيار الكهربي.','√','(ص 93).'],
 ['تمعدن الجلد يحدث في حوالي 80٪ من المصابين بالتيار الكهربي.','×','10٪ لا 80٪.']];
const ESSAY=[
 ['ما الحالات الناجمة عن مرور التيار الكهربائي إلى الأرض عن طريق جسم الإنسان؟','لمس خطين معاً ناقلين للتيار؛ ولمس خط واحد ناقل للتيار (في شبكة معزولة عن الأرض أو مؤرضة)؛ ولمس مادة ناقلة غير حاملة للتيار وقعت تحت تأثير خطأ؛ وجهد التماس؛ وجهد الخطوة (ص 86–89).'],
 ['ما آثار مرور التيار الكهربائي في جسم الإنسان؟','آثار حرارية (احتراق الجلد وسخونة الأوعية والدم)، وتحليلية (تحليل الدم والسوائل الحيوية وتخريب الأنسجة)، وبيولوجية (تهييج الأنسجة الحية مع تقلصات تشنجية للعضلات ومنها القلب والرئتان) (ص 81).'],
 ['ما أسباب الإصابة بالتيار الكهربائي؟','ملامسة التوصيلات الكهربائية؛ وملامسة الأجزاء الناقلة غير الحاملة للتيار؛ وحدوث القوس الكهربائي؛ ووقوع التجهيزات ذات الجهد المنخفض تحت أثر الجهد العالي؛ وآثار الكهرباء الساكنة (ص 79–80).'],
 ['عدِّد الإصابات الناتجة عن مرور التيار الكهربائي في جسم الإنسان.','الصدمة الكهربائية (الحروق، والندبات، وتمعدن الجلد، والأضرار الفيزيائية)، والصعقة الكهربائية (ص 92–94).'],
 ['ما الشروط الواجب مراعاتها عند إغاثة مصاب بالتيار الكهربائي؟','قطع التيار فوراً، فإن تعذّر توضع النواقل في دائرة قصر، فإن تعذّر يعزل المنقذ نفسه من جهة التيار ومن جهة الأرض، ويستعمل أدوات لها مقابض عازلة، ويقف على سطح عازل أو بساط مطاطي أو أخشاب جافة، ويبعد المصاب عن كل تماس كهربائي، ويُستدعى الطبيب فوراً، ولا يُترك المصاب وحده (ص 94–95).'],
 ['عرِّف كلاً من: جهد الخطوة – جهد التماس.','<b>جهد التماس:</b> فرق الجهد الحاصل بين نقطتين من جسم الإنسان، والذي يؤدي لمرور تيار فيه \\(U_t=I_h\\cdot R_h\\). <b>جهد الخطوة:</b> إحدى حالات جهد التماس، وهو فرق الجهد الحاصل بين القدمين، ويقل بالابتعاد عن المربط الأرضي (ص 88).'],
 ['عدِّد أنواع الإصابة الكهربائية للإنسان عند مرور تيار كهربائي به.','الصدمة الكهربائية والصعقة الكهربائية (ص 92–94).'],
 ['هناك عدة مظاهر للصدمة الكهربائية على جسم الإنسان [اذكرها].','الحروق الكهربائية، والندبات الكهربائية، وتمعدن الجلد، والأضرار الفيزيائية (ص 92–93).'],
 ['اذكر باختصار أضرار الصعقة الكهربائية على جسم الإنسان.','تقلص تشنجي للعضلات بدون فقدان الوعي؛ ثم مع فقدان الوعي مع بقاء التنفس وعمل القلب؛ ثم فقدان الوعي واختلال عمل القلب أو التنفس أو كليهما؛ ثم الموت بتوقف التنفس والدورة الدموية. ويبدأ صعوبة التنفس عند 20–25 مللي أمبير، وقد يتوقف القلب أو يرتجف (ص 94).'],
 ['ما طرق التنفس الصناعي المتبعة عند إغاثة المصاب بالتيار الكهربائي؟','حسب الكتاب: الطريقة اليدوية، وطريقة النفخ (قبلة الحياة) وهي أفضلها، مع التدليك الخارجي للقلب (ص 95–99). <span class="fixnote">والمعتمد اليوم: لا تُستعمل الطريقة اليدوية، والإنعاش 30 ضغطة : نفختان بسرعة 100–120 في الدقيقة مع جهاز AED (انظر الدرس السابق، «المصحح»).</span>'],
 ['ما العوامل التي تتوقف عليها درجة الإصابة بالتيار الكهربي؟','شدة التيار (العامل الحاسم)، ومقاومة جسم الإنسان، ومدة تأثير التيار، والجهد، وتردد التيار، والطريق الذي يمر فيه التيار بالجسم (ص 81–85).'],
 ['هناك نقاط يجب مراعاتها عند إغاثة إنسان مصاب بالتيار الكهربي، وذلك حفاظاً على المنقذ؛ اذكرها.','قطع التيار أولاً؛ أو وضع النواقل في دائرة قصر؛ أو أن يعزل المنقذ نفسه من جهة التيار ومن جهة الأرض في آن واحد؛ وأن يستعمل أدوات لها مقابض عازلة؛ وأن يقف على سطح عازل أو بساط مطاطي أو أخشاب جافة (ص 94–95). وفي جهد الخطوة: لا يخطو خطوات كبيرة، ويفضّل القفز أو السير على ألواح خشبية (ص 89).'],
 ['ما أنواع الحروق المختلفة الناتجة عن مرور التيار الكهربي في جسم الإنسان؟','الحرق التياري أو التلامسي، والحرق القوسي، والحروق المختلطة (ص 92).']];
const FILL=[
 ['من أسباب الإصابة بالتيار الكهربي: ملامسة …… وغير …… للتيار؛ حدوث …… الكهربي؛ وقوع …… ذات جهد …… تحت تأثير ……؛ آثار …… الساكنة.','ملامسة <b>الأجزاء الناقلة</b> وغير <b>الحاملة</b> للتيار؛ حدوث <b>القوس</b> الكهربي؛ وقوع <b>التجهيزات</b> ذات جهد <b>منخفض</b> تحت تأثير <b>الجهد العالي</b>؛ آثار <b>الكهرباء</b> الساكنة.'],
 ['من آثار مرور التيار الكهربي في جسم الإنسان …… و…… و……','<b>حرارية</b> و<b>تحليلية</b> و<b>بيولوجية</b>.'],
 ['يعرف جهد التماس أنه فرق نقطة …… الحاصلة بين …… من جسم ……','فرق نقطة <b>التعادل</b> (والمقصود فرق الجهد) الحاصل بين <b>نقطتين</b> من جسم <b>الإنسان</b>.'],
 ['يعتبر جهد الخطوة إحدى حالات …… نتيجة فرق الجهد في نقطة التعادل الحاصل بين ……','<b>جهد التماس</b>؛ <b>القدمين</b>.'],
 ['من أنواع الإصابات الكهربية …… و……','<b>الصدمة الكهربائية</b> و<b>الصعقة الكهربائية</b>.'],
 ['الصدمة الكهربية تتجلى بالضرر الذي يصيب جسم الإنسان نتيجة تأثير …… أو ……','<b>تيار القصر</b> أو <b>القوس الكهربائي</b>.'],
 ['تنقسم الحروق حسب شروط حدوثها إلى ثلاثة أقسام …… و…… و……','<b>الحرق التياري (التلامسي)</b> و<b>الحرق القوسي</b> و<b>الحروق المختلطة</b>.'],
 ['الندبات الكهربائية هي …… جلدية صغيرة لونها …… أو …… ولها شكل …… ذات لون …… في مركزها، وتصيب حوالي ……٪ من المصابين.','<b>بقع</b>؛ <b>فضي</b> أو <b>أصفر</b>؛ <b>دائري أو قطاعي</b>؛ <b>غامق</b>؛ <b>20</b>٪.'],
 ['تمعدن الجلد يحدث نتيجة …… الجلد من قبل ذرات المعدن …… و…… عند ظهور …… وذلك عند حدوث دائرة ……، ويصيب حوالي ……٪ من المصابين.','<b>احتراق</b>؛ <b>المنصهر</b> و<b>المتطاير</b>؛ <b>القوس الكهربائي</b>؛ <b>القصر</b>؛ <b>10</b>٪.'],
 ['الأضرار الفيزيائية نتيجة …… الحاد غير الإرادي لا …… تحدث تحت تأثير …… المار في جسم الإنسان، ويصيب حوالي ……٪.','<b>التقلص</b>؛ <b>للعضلات</b>؛ <b>التيار</b>؛ <b>3</b>٪. <span class="fixnote">في الكتاب «لا ……» وهي بقية خطأ طباعي، والمقصود «للعضلات».</span>'],
 ['الصعقة الكهربائية هي …… الذي يصيب …… الحية بسبب مرور …… خلال جسم الإنسان، ويصنف إلى تقلص تشنجي للعضلات وبدون ……، وتقلص مع ……، وفقدان …… واختلال عمل …… أو …… أو كليهما، وكذلك قد يحدث …… وبذلك يتوقف التنفس أو …… الدموية.','<b>التهيج</b>؛ <b>الأنسجة</b>؛ <b>التيار الكهربائي</b>؛ <b>فقدان الوعي</b>؛ <b>فقدان الوعي</b>؛ <b>الوعي</b>؛ <b>القلب</b> أو <b>التنفس</b>؛ <b>الموت</b>؛ <b>الدورة</b> الدموية.'],
 ['من أفضل الطرق للتنفس الصناعي …… الحياة، وفيها ينفخ في فم ……، ويجب أن يكون رأس المصاب …… إلى الخلف حتى لا يتسبب …… في سد طريق ……','<b>قبلة</b> الحياة؛ <b>المصاب</b>؛ <b>مائلاً</b>؛ <b>اللسان</b>؛ <b>التنفس</b>.']];

B.lesson({
 id:'u5-l5',unit:5,order:5,pages:'100–110',
 title:'الوقاية من مخاطر الكهرباء، والعزل وتعليق اللافتات (Lock-out / Tag-out)',
 summary:'قواعد الوقاية من مخاطر الكهرباء، ونظام العزل وتعليق اللافتات: تُفصل كل مصادر الطاقة عن المعدة وتُقفل ويُعلّق عليها تحذير قبل صيانتها، ولا تعود إلا بيد من أقفلها. وفي آخر الدرس أسئلة الوحدة.',
 stations:[
  {intro:true},

  {st:1,short:'الوقاية',title:'<span class="ltr">5-7</span> الوقاية من مخاطر الكهرباء',ref:'ص <span class="ltr">100–101</span>',
   q:'انقطع التيار عن البيت فجأة… لماذا يطلب الكتاب أن تطفئ المكيف والثلاجة قبل أن يعود؟',
   art:S5.svg('لوحة قواعد الوقاية: التصميم والتنفيذ والدوائر المستقلة والتأريض وعلب التوصيل والصيانة','#DDEFE6',
     `<rect x="60" y="40" width="240" height="250" rx="16" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/>`+S5.ar(180,68,'قواعد الوقاية',{fs:15,b:1})
    +[['مهندس يصمم وفني يُنفّذ','البندان 1 و2: التصميم من مهندسين متخصصين، والتنفيذ من فنيين أكفاء تحت إشراف مهندسين ومطابق للمواصفات.'],['دوائر مستقلة','البنود <span class="ltr">5–7</span>: لوحات توزيع رئيسة وفرعية، ودوائر خاصة للأجهزة الكبيرة، وفصل دوائر الإنارة والقوى والجهد الفائق الانخفاض في مواسير وعلب منفصلة.'],['تأريض جيد ودائم','البند 8: تأريض الأجهزة وجميع الأجزاء المعدنية غير الحاملة للتيار والقريبة من الموصلات.'],['علب توصيل مغلقة','البندان 10 و11: ربط الأسلاك بمرابط داخل علب قوية ذات أغطية محكمة، ولا تُترك مكشوفة أبداً.'],['صيانة دورية','البند 13: القيام بأعمال الصيانة الدورية مع إجراء الاختبارات المناسبة.']].map(([t,d],i)=>S5.tip(d,`<rect x="78" y="${84+i*40}" width="204" height="32" rx="8" fill="${['#D6E4F7','#F8E1C2','#CFE6DB','#F4D3CC','#EDE3D2'][i]}" stroke="#2C4A40" stroke-width="1.5"/><path d="M262 ${94+i*40}l5 6 9-11" fill="none" stroke="#12855A" stroke-width="3"/>`+S5.ar(160,105+i*40,t,{fs:13,b:1}))).join('')),
   cap:'خمس مجموعات من قواعد البند <span class="ltr">5-7</span>.<br><b>مرّر المؤشر على أي قاعدة (أو المسها في الجوال) لتعرف البنود التي تجمعها.</b>',
   side:[
    {predict:{q:'لماذا يطلب الكتاب إطفاء الأجهزة ذات المحركات عند انقطاع التيار؟',opts:[
     ['لتوفير الكهرباء',false,'السبب الذي يذكره الكتاب هو حماية الأجهزة.'],
     ['حتى لا تتلف عند عودة التيار الفجائية للخدمة',true,'«حتى لا تتعرض تلك الأجهزة للتلف عند عودة التيار الفجائية للخدمة» (ص 100).'],
     ['لأن انقطاع التيار يكهرب هياكلها',false,'لا يذكره الكتاب.']]}}
   ],
   body:[
    {book:"<p>للوقاية من مخاطر الكهرباء عموماً يجب مراعاة ما يلي:</p>\n<ol><li>تصمم الأعمال الكهربائية من قبل مهندسين كهربائيين متخصصين ذوي خبرة، وتراعى الأصول الفنية في التصميم الذي يشمل إعداد المواصفات الفنية والمخططات اللازمة لتنفيذ المشروع.</li>\n   <li>تنفيذ الأعمال الكهربائية من قبل فنيين متخصصين أكفاء ومهرة وتحت إشراف مهندسين مختصين، وأن تكون هذه الأعمال مطابقة للمواصفات القياسية أو ما يعادلها من المواصفات العالمية المعترف بها.</li>\n   <li>التقيد بالتعليمات الواردة في النشرات الفنية المرفقة بالأجهزة الكهربائية، والتي يتم إعدادها من قبل الشركات الصانعة للأجهزة، وتوضح طريقة الفك والتركيب والتشغيل والصيانة وشروط التغذية الكهربائية وأنواع الأعطال المحتملة وطرق إصلاحها، كما تتضمن المواصفات الفنية استهلاك الوقود أو الكهرباء وقدرة الجهاز وكفاءته والجهد والتردد اللذين يعمل عليهما، بالإضافة لبعض المعلومات الأخرى. ويجب مراعاة التعليمات الخاصة بمكان العمل المناسب للجهاز من تهوية وحرارة ورطوبة وأجهزة وقاية شخصية وعامة.</li>\n   <li>عند انقطاع التيار الكهربائي يلزم إطفاء جميع الأجهزة ذات المحركات مثل المكيفات والثلاجات والغسالات، وغيرها من الأجهزة الأخرى الحساسة مثل أجهزة الحاسب الآلي، حتى لا تتعرض تلك الأجهزة للتلف عند عودة التيار الفجائية للخدمة.</li>\n   <li>تغذية التجهيزات والآلات الكهربائية بواسطة لوحات توزيع رئيسة وفرعية لتسهيل عملية التحكم والحماية.</li>\n   <li>عمل دوائر خاصة ومستقلة للأجهزة الكبيرة الثابتة مثل المكيفات والغسالات.</li>\n   <li>فصل كل من دوائر التوصيل الآتية عن بعضها، ويجري تمديدها في مواسير مستقلة وعلب منفصلة:<ul><li>دوائر الإنارة والمراوح.</li><li>دوائر القوى والمكيفات.</li><li>أنظمة الجهد الفائق الانخفاض مثل هوائي التلفاز والهاتف والأجراس وأنظمة إنذار الحريق… إلخ.</li></ul>ويراعى موازنة الأحمال الكهربائية على الأوجه الثلاثة بالتساوي قدر الإمكان.</li>\n   <li>التأريض الجيد والدائم للأجهزة الكهربائية، وكذلك تأريض جميع الأجزاء المعدنية غير الحاملة للتيار والقريبة من الموصلات الكهربائية.</li>\n   <li>المواد العازلة المستخدمة في الآلات والتمديدات واللوحات الكهربائية تكون من أجود الأنواع وذات درجة عزل جيدة وكافية.</li>\n   <li>جميع التمديدات الكهربائية تربط بإحكام، ويتم ربط الأسلاك ببعضها داخل علب التوصيل بواسطة مرابط نهايات توصيل مجهزة ببراغٍ من النحاس الأصفر، على أن تعزل عزلاً إضافياً بشريط عازل إذا تطلب الأمر.</li>\n   <li>أن تكون علب التوصيل قوية وواسعة وذات أغطية محكمة، ولا يسمح بتركها مكشوفة بأي حال من الأحوال.</li>\n   <li>استخدام المعدات والأدوات الكهربائية الجيدة والمناسبة في تنفيذ الأعمال الكهربائية.</li>\n   <li>القيام بأعمال الصيانة الدورية مع إجراء الاختبارات المناسبة.</li></ol>",ref:'ص <span class="ltr">100–101</span>'},
    {watch:"في الكتاب (ص 100–101) رُقّمت الدوائر الثلاث التي تُفصل (الإنارة، والقوى، والجهد الفائق الانخفاض) بنوداً مستقلة 8 و9 و10، وهي فروع للبند 7؛ لذلك صارت عندنا تحت البند 7، وصار عدد البنود 13 بدل 16.",fix:true},
    {tip:'<p>قارن هذه القائمة بأخطاء الدرس الأول: كل قاعدة هنا علاج لخطأ هناك. مثلاً «عمل دوائر خاصة ومستقلة للأجهزة الكبيرة» يعالج «نقص عدد دوائر المآخذ»، و«علب التوصيل ذات الأغطية المحكمة» تعالج «عدم استعمال المرابط الخاصة لتوصيل الأسلاك».</p>',title:'القاعدة علاج للخطأ'},
    {title:'مختبر مصغّر: ماذا تقول القاعدة؟',widget:(el,B)=>DCML.cases(el,B,{intro:'ثلاثة مواقف؛ اختر ما تقوله قواعد الكتاب.',cases:[
     {q:'تركيب مكيف كبير ثابت في غرفة: على أي دائرة يوصل؟',opts:[['على دائرة خاصة ومستقلة له',true,'«عمل دوائر خاصة ومستقلة للأجهزة الكبيرة الثابتة مثل المكيفات والغسالات» (ص 100).'],['على دائرة الإنارة في الغرفة',false,'دوائر الإنارة والمراوح تُفصل عن دوائر القوى والمكيفات.']]},
     {q:'فني انتهى من ربط الأسلاك في علبة توصيل، وغطاؤها مفقود.',opts:[['يتركها مكشوفة مؤقتاً',false,'«ولا يسمح بتركها مكشوفة بأي حال من الأحوال» (ص 101).'],['لا يتركها مكشوفة؛ يركّب غطاءً محكماً',true,'«أن تكون علب التوصيل قوية وواسعة وذات أغطية محكمة» (ص 101).']]},
     {q:'أين تُمدّد أسلاك جرس الباب (جهد فائق الانخفاض)؟',opts:[['مع أسلاك الإنارة في الماسورة نفسها',false,'الكتاب يطلب فصلها.'],['في مواسير مستقلة وعلب منفصلة عن دوائر الإنارة والقوى',true,'أنظمة الجهد الفائق الانخفاض «مثل هوائي التلفاز والهاتف والأجراس» تُفصل (ص 100).']]}]})}
   ]},

  {st:2,short:'الإغلاق واللافتات',title:'<span class="ltr">5-8</span> إغلاق مصادر الطاقة ووضع لافتات عليها <span class="ltr">(Lock-out / Tag-out)</span>',ref:'ص 102',
   q:'فصلت القاطع لتصلح المعدة… ما الذي يمنع زميلاً لا يعرف بوجودك من إعادته؟',
   art:S5.svg('غطاء قفل لعجلة محبس، ومفتاح فصل على الإيقاف عليه أقفال ولافتة','#FBE6C4',S5.nest(fig105(),0,80,360,147)
    +S5.hot(10,90,160,120,'غطاء قفل حول عجلة المحبس يُقفل بقفل: يمنع فتح المحبس.')
    +S5.hot(232,100,70,110,'مفتاح فصل على الوضع ⟦OFF⟧ عليه مشبك تُعلّق فيه عدة أقفال، لكل شخص قفله.')
    +S5.hot(296,100,60,60,'لافتة ⟦DANGER — DO NOT OPERATE⟧: تبين أن المعدة خارج الخدمة لوجود أعمال صيانة.')
    +S5.ar(180,58,'قفل يمنع، ولافتة تُنبّه',{fs:14,b:1})+S5.la(180,262,'Lock-out / Tag-out',{fs:13,b:1})),
   cap:'رسم مبسّط للشكل غير المرقم في ص 105.<br><b>مرّر المؤشر على غطاء المحبس والمفتاح واللافتة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'ما الغرض من نظام الإغلاق ووضع اللافتات حسب الكتاب؟',opts:[
     ['منع أية حوادث قد تقع بسبب المعدة أثناء العمل بها',true,'«وذلك لمنع أية حوادث قد تقع بسبب المعدة أثناء العمل بها» (ص 102).'],
     ['تسريع أعمال الصيانة',false,'الكتاب لا يذكر السرعة؛ الغرض الأمان.'],
     ['حماية المعدة من السرقة',false,'لا علاقة له بالسرقة.']]}}
   ],
   body:[
    {book:"<p><b>الغرض:</b> وضع نظام عمل آمن لعزل مصادر القوى أو الأجزاء المتحركة عن المعدات والآلات في حالات التركيب أو الصيانة، وذلك لمنع أية حوادث قد تقع بسبب المعدة أثناء العمل بها.</p>\n<p><b>تعريفات:</b></p>\n<p><b>1- الإغلاق <span class=\"ltr\">Lock-Out</span> – وضع اللافتات <span class=\"ltr\">Tag-Out</span>:</b> استعمال جهاز معين لعزل مصادر الطاقة عن المعدات المراد العمل بها، ووضع لافتات على أماكن فصل مصادر الطاقة لهذه المعدات تبين أنها خارج الخدمة لوجود أعمال صيانة بها، وأنه قد تم فصل القوى المحركة عنها، حتى لا يتم إعادة تشغيلها إلا بعد الانتهاء من العمل بها وبمعرفة الأشخاص الذين قاموا بإغلاقها.</p>\n<p><b>2- أجهزة الإغلاق والعزل <span class=\"ltr\">Energy Isolation Devices</span>:</b> هي أجهزة تستخدم لعزل القوى المحركة عن الآلات والمعدات، وبعض الأمثلة لذلك:</p>\n<ul><li>جهاز فصل التيار الكهربائي الموجود في لوحات الكهرباء <span class=\"ltr\">Manually Operated Electrical Circuit Breakers</span>.</li><li>الفلانجات ذات الوجوه العمياء لعزل المواسير <span class=\"ltr\">Blind Flanges</span>.</li><li>السلاسل والأقفال لتأمين إغلاق المحابس والصمامات.</li><li>مفاتيح الإيقاف والفصل <span class=\"ltr\">Disconnect Switches</span>.</li><li>الأقفال <span class=\"ltr\">Padlocks</span> (تستخدم لإغلاق بعض أنواع لوحات الكهرباء).</li></ul>",ref:'ص 102'},
    {tip:'<p><b>القفل</b> يمنع إعادة الطاقة فعلاً، لأن مفتاحه مع من أغلقه. و<b>اللافتة</b> تخبر الآخرين لماذا المعدة مفصولة ومن فصلها. الكتاب يطلب الاثنين معاً.</p>',title:'القفل واللافتة'},
    {title:'مختبر مصغّر: جهاز عزل أم لا؟',widget:(el,B)=>DCML.sort(el,B,{intro:'صنّف كل أداة: هل هي من «أجهزة الإغلاق والعزل» التي يذكرها الكتاب؟',cats:['جهاز إغلاق وعزل','ليس جهاز عزل'],items:[
     ['قاطع التيار اليدوي في لوحة الكهرباء (Manually Operated Circuit Breaker).',0,'أول مثال في قائمة الكتاب.'],
     ['الفلانجة ذات الوجه الأعمى (Blind Flange) لعزل المواسير.',0,'من أمثلة الكتاب.'],
     ['زر الإيقاف (Stop) على المعدة.',1,'يوقف المعدة بالطريقة المعتادة (الخطوة 2) لكنه لا يعزل الطاقة عنها؛ يمكن لأي شخص أن يضغط زر التشغيل بعده. العزل في الخطوة 3.'],
     ['السلاسل والأقفال لتأمين إغلاق المحابس والصمامات.',0,'من أمثلة الكتاب.'],
     ['اللافتة وحدها.',1,'اللافتة تنبّه ولا تعزل؛ العزل بالمفتاح أو المحبس، والقفل يؤمّنه.']]})}
   ]},

  {st:3,short:'مصادر الطاقة',title:'<span class="ltr">5-9</span> مصادر الطاقة <span class="ltr">(Energy Resources)</span>',ref:'ص <span class="ltr">102–103</span>',
   q:'فصلت الكهرباء عن مكبس هوائي… فهل صار آمناً؟',
   art:S5.svg('مصادر الطاقة كما رسمها الكتاب: كهرباء وهواء مضغوط وضغط هيدروليكي وغاز وبخار','#E6E2F8',S5.nest(fig519(),0,100,360,108)
    +S5.hot(4,104,66,100,'الكهرباء ⟦(Electrical)⟧.')+S5.hot(76,104,66,100,'الهواء المضغوط ⟦(Pneumatic)⟧: يبقى في المواسير بعد فصل الكهرباء.')
    +S5.hot(148,104,66,100,'الضغط الهيدروليكي ⟦(Hydraulic)⟧.')+S5.hot(220,104,66,100,'الغاز ⟦(Gases)⟧.')+S5.hot(292,104,66,100,'البخار: من الطاقة الحرارية ⟦(Thermal)⟧.')
    +S5.ar(180,70,'كل مصدر يحتاج عزله الخاص',{fs:14,b:1})+S5.ar(180,250,'والقائمة تضيف: الميكانيكية والكيميائية',{fs:12})),
   cap:'رسم مبسّط للشكل <span class="ltr">(5-19)</span>.<br><b>مرّر المؤشر على كل مصدر (أو المسه في الجوال) لتعرف اسمه في القائمة.</b>',
   side:[
    {predict:{q:'كم مصدراً للطاقة تذكر قائمة الكتاب؟',opts:[
     ['خمسة، كما في الشكل',false,'الشكل يرسم خمسة، لكن القائمة أطول.'],
     ['مصدراً واحداً: الكهرباء',false,'الكتاب يقول «جميع مصادر الطاقة» قد تسبب إصابة العاملين.'],
     ['سبعة',true,'الكهربائية، والميكانيكية، والهيدروليكية، والهوائية، والكيميائية، والحرارية، والغازات (ص <span class="ltr">102–103</span>).']]}}
   ],
   body:[
    {book:"<p>جميع مصادر الطاقة (الشكل 5-19) قد تسبب إصابة وأذى العاملين، وهي على النحو التالي: المصادر الكهربائية <span class=\"ltr\">Electrical</span>، والمصادر الميكانيكية <span class=\"ltr\">Mechanical</span>، والمصادر الهيدروليكية <span class=\"ltr\">Hydraulic</span>، والمصادر الهوائية <span class=\"ltr\">Pneumatic</span>، والمصادر الكيميائية <span class=\"ltr\">Chemical</span>، والمصادر الحرارية <span class=\"ltr\">Thermal</span>، والغازات <span class=\"ltr\">Gases</span>.</p>",ref:'ص <span class="ltr">102–103</span>'},
    {watch:"الشكل (5-19) يرسم خمسة مصادر (كهرباء، وهواء مضغوط، وضغط هيدروليكي، وغاز، وبخار)، والقائمة سبعة: لا رسم للمصادر الميكانيكية والكيميائية والحرارية، والبخار المرسوم ليس في القائمة (وهو من الطاقة الحرارية).",fix:true},
    {title:'مختبر مصغّر: من أي مصدر هذه الطاقة؟',widget:(el,B)=>DCML.sort(el,B,{intro:'أمثلة من خارج الكتاب على مصادر القائمة؛ صنّف كل مثال.',cats:['كهربائية','ميكانيكية','هيدروليكية','هوائية','حرارية'],items:[
     ['مكثف ما زال مشحوناً في لوحة إلكترونية.',0,'شحنة كهربائية متبقية؛ والكتاب يذكر تفريغ «الشحنات الكهربائية المتبقية بالمكثفات» (ص 105).'],
     ['زيت تحت ضغط في أسطوانة مكبس.',2,'ضغط سائل: طاقة هيدروليكية.'],
     ['هواء مضغوط بقي في مواسير المعدة.',3,'طاقة هوائية؛ وهو مثال الكتاب للضغط المتبقي (ص 104).'],
     ['بخار ساخن في خط التسخين.',4,'البخار من الطاقة الحرارية.'],
     ['نابض مضغوط أو حذافة ما زالت تدور.',1,'طاقة حركة أو طاقة مخزنة في جسم: ميكانيكية.']]})}
   ]},

  {st:4,short:'الأشخاص المعرضون',title:'<span class="ltr">5-10</span> الأشخاص المعرضون للإصابة <span class="ltr">(Affected Employees)</span>',ref:'ص <span class="ltr">103–104</span>',
   q:'عاملان يصلحان معدة واحدة… لماذا يضع كل منهما قفله الخاص؟',
   art:S5.svg('عاملان، لكل منهما قفل سلامة ومفتاحه، على مفتاح فصل واحد','#F7DCC8',
     S5.tip('مفتاح الفصل على الوضع ⟦OFF⟧ وعليه مشبك يتسع لعدة أقفال.',`<rect x="150" y="60" width="60" height="110" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M180 90V140" stroke="#2C4A40" stroke-width="8" stroke-linecap="round"/><path d="M186 140h34v24h-34" fill="none" stroke="#2C4A40" stroke-width="3"/>`+S5.la(180,80,'OFF',{fs:11,b:1}))
    +S5.tip('قفل السلامة ⟦(Safety Padlock)⟧: له مفتاح واحد فقط، يبقى مع الشخص الذي عزل مصدر الطاقة؛ فلا تعود الطاقة إلا بواسطته.',`<g transform="translate(215 168) scale(1.6)">${padlock(0,0,'#2F6FD0')}</g><g transform="translate(245 168) scale(1.6)">${padlock(0,0,'#D9822B')}</g>`)
    +S5.tip('العامل الأول (مسؤول الموقع) ومعه مفتاح قفله الأزرق.',`<circle cx="70" cy="196" r="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M70 210v40M70 250l-12 30M70 250l12 30M70 222l-20 20M70 222l24 14" stroke="#2C4A40" stroke-width="3" fill="none"/><path d="M96 238h14l4-4" stroke="#2F6FD0" stroke-width="4" fill="none"/>`)
    +S5.tip('العامل الثاني (مسؤول الصيانة) ومعه مفتاح قفله البرتقالي. كل منهما يحتفظ بمفتاحه.',`<circle cx="300" cy="196" r="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M300 210v40M300 250l-12 30M300 250l12 30M300 222l20 20M300 222l-24 14" stroke="#2C4A40" stroke-width="3" fill="none"/><path d="M274 238h-14l-4-4" stroke="#D9822B" stroke-width="4" fill="none"/>`)
    +S5.ar(180,290,'لا تعود الطاقة إلا بالمفتاحين',{fs:14,b:1})),
   cap:'رسم توضيحي لفكرة «قفل السلامة» (لكل شخص قفله ومفتاحه).<br><b>مرّر المؤشر على المفتاح والقفلين والعاملين (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'كم مفتاحاً لقفل السلامة حسب تعريف الكتاب؟',opts:[
     ['مفتاحان: واحد معه وواحد في المكتب',false,'المفتاح الثاني يسمح لغيره بإعادة الطاقة، وهذا ما يمنعه التعريف.'],
     ['مفتاح واحد فقط، مع الشخص الذي عزل مصدر الطاقة',true,'«هو نوع من الأقفال يكون له مفتاح واحد فقط… بحيث يكون هذا المفتاح مع الشخص المسؤول الذي قام بعزل مصدر الطاقة» (ص 104).'],
     ['لا مفتاح له',false,'له مفتاح واحد يبقى مع من أغلقه.']]}}
   ],
   body:[
    {book:"<p>هم العاملون الذين تتطلب مهامهم الوظيفية العمل على تشغيل واستعمال المعدات والآلات التي تدار بواسطة مصادر الطاقة المختلفة، ويجب العمل على صيانة هذه المعدات والآلات تحت نظام العزل وتثبيت اللافتات التحذيرية <span class=\"ltr\">(Lockout / Tagout Procedure)</span>.</p>\n<ul><li><b>الموظف المسؤول <span class=\"ltr\">Authorized Employee</span>:</b> هو الموظف المسؤول عن إغلاق مصادر الطاقة عن المعدات والآلات التي سوف يتم عمل الصيانة والإصلاح عليها، كذلك وضع اللافتات التحذيرية <span class=\"ltr\">(Tags)</span> التي تفيد ذلك.</li>\n   <li><b>قفل السلامة <span class=\"ltr\">Safety Padlock</span>:</b> هو نوع من الأقفال يكون له مفتاح واحد فقط، يستخدم لتأمين عزل الطاقة المحركة عن الأجهزة والمعدات، بحيث يكون هذا المفتاح مع الشخص المسؤول الذي قام بعزل مصدر الطاقة، حتى لا يتم إعادة الطاقة للأجهزة إلا بواسطة هذا الشخص فقط.</li>\n   <li><b>العزل <span class=\"ltr\">Disconnects</span>:</b> عزل الطاقة عن المعدات بواسطة المحابس، والمفاتيح الكهربائية، والأجهزة الميكانيكية التي تتسبب في تشغيل المعدة.</li>\n   <li><b>الضغط المتبقي <span class=\"ltr\">Residual Pressure</span>:</b> هي الطاقة المتبقية في التوصيلات الخاصة بالمعدة أو الآلة بعد عزل الطاقة المحركة عنها (مثال ذلك الهواء المضغوط داخل المواسير بعد قفل المحبس).</li></ul>",ref:'ص <span class="ltr">103–104</span>'},
    {watch:"تعريف «العزل» في الكتاب (ص 104): «الأجهزة الميكانيكية التي عند عزلها تسبب تشغيل المعدة» عبارة مقلوبة المعنى؛ والمقصود الأجهزة التي تتسبب في تشغيل المعدة، فنعزل الطاقة بها، كما كتبناها.",fix:true},
    {title:'مختبر مصغّر: ما المصطلح؟',widget:(el,B)=>DCML.cases(el,B,{intro:'اختر المصطلح الذي يطابق كل وصف من تعريفات الكتاب.',cases:[
     {q:'الهواء المضغوط الباقي داخل المواسير بعد قفل المحبس.',opts:[['الضغط المتبقي (Residual Pressure)',true,'هذا مثال الكتاب بنصه (ص 104).'],['العزل (Disconnects)',false,'العزل هو فصل الطاقة بالمحابس والمفاتيح، أما الباقي بعده فهو الضغط المتبقي.']]},
     {q:'الموظف الذي يغلق مصادر الطاقة عن المعدة ويضع اللافتات التحذيرية.',opts:[['الموظف المسؤول (Authorized Employee)',true,'تعريف الكتاب (ص 103).'],['أي عامل يمر بجوار المعدة',false,'الإغلاق مسؤولية الموظف المسؤول.']]}]})}
   ]},

  {st:5,short:'الإجراءات',title:'الإجراءات: خطوات العزل والصيانة وإعادة التشغيل',ref:'ص <span class="ltr">104–107</span>',
   q:'فصلت الكهرباء وأغلقت محبس الهواء… فلماذا ما زال المكبس قادراً على الحركة؟',
   art:S5.svg('معدة معزولة: القاطع مفصول ومقفل، والمحبس مغلق ومقفل، والضغط مفرّغ، ولافتتان معلقتان','#DDEFE6',S5.nest(lotoSVG({notified:1,run:0,brk:0,vlv:0,press:0,bleed:1,lk:{bs:1,bm:1,vs:1,vm:1},tg:{b:1,v:1},permit:1,work:0,workDone:0,clear:0,acc:'',ev:{}},0,0),0,80,360,169)
    +S5.hot(8,96,92,130,'لوحة الكهرباء: المفتاح على ⟦OFF⟧ وعليه قفلان (الموقع والصيانة) ولافتة — الخطوات 3 و6 و7.')
    +S5.hot(104,90,52,90,'محبس الهواء المضغوط: مغلق ومقفل بقفلين ومعلّق عليه لافتة.')
    +S5.hot(150,170,50,50,'مقياس الضغط المتبقي وصمام التفريغ: الخطوة 5 تفرّغ الطاقة المتبقية في المواسير.')
    +S5.hot(196,110,160,140,'المعدة (محرك ومكبس هوائي): لا يبدأ العمل عليها إلا بعد عزل كل مصادر طاقتها.')
    +S5.ar(180,60,'معدة معزولة جاهزة للصيانة',{fs:14,b:1})),
   cap:'المعدة بعد تنفيذ خطوات العزل (رسم المختبر نفسه).<br><b>مرّر المؤشر على اللوحة والمحبس والمقياس والمعدة (أو المسها في الجوال) لتعرف الخطوة المقابلة.</b>',
   side:[
    {predict:{q:'متى يُملأ تصريح عزل الطاقة (النموذج 1) ويوقَّع؟',opts:[
     ['قبل إيقاف المعدة',false,'التصريح يوثّق عزلاً تم فعلاً.'],
     ['بعد انتهاء الصيانة',false,'التصريح يسبق بدء العمل.'],
     ['بعد تأمين الأقفال (الخطوة 6) وتعليق اللافتات (الخطوة 7)',true,'«بعد إجراء الخطوتين 6 و7 أعلاه يتم تعبئة النموذج رقم 1» (ص 106).']]}}
   ],
   body:[
    {book:"<p>في حالة ضرورة إجراء أعمال الإصلاح والصيانة على أي معدة أو جهاز في أي موقع من مواقع المنشأة المختلفة، يتم اتباع الخطوات التالية:</p>\n<ol><li>يقوم المسؤول بالموقع الموجود به هذه المعدة بإبلاغ قسم الصيانة عن الخلل الموجود بالمعدة، وأنها تحتاج للإصلاح والصيانة.</li>\n   <li>يقوم المسؤول بالموقع بإيقافها عن العمل بالطريقة المعتادة، وذلك بالضغط على مفاتيح الإيقاف بها <span class=\"ltr\">Stop Buttons</span> (الشكل 5-20).</li>\n   <li>يقوم مسؤول الموقع بفصل التيار الكهربائي – إغلاق محابس الغاز – إغلاق محابس الهواء المضغوط والبخار عن المعدة المراد إجراء أعمال الصيانة عليها.</li>\n   <li>يقوم مسؤول الموقع بالتأكد أن عزل الطاقة المحركة عن المعدة قد تم بصورة سليمة، وذلك بمحاولة تشغيلها بعد العزل للتأكد من عدم عملها مرة أخرى، ومن ثم يتم إعادة مفاتيح التشغيل على الوضع <span class=\"ltr\">Off</span>.</li>\n   <li>يقوم العاملون بقسم الصيانة بتفريغ الطاقة المتبقية والمتجمعة في المواسير، مثل الهواء المضغوط – البخار – الغازات المضغوطة، أو الشحنات الكهربائية المتبقية بالمكثفات (الشكل 5-21).</li>\n   <li>يقوم مسؤول قسم الصيانة أو من ينوب عنه، بالتنسيق مع مسؤول الموقع الموجود به المعدة وحسب الإمكان، بتأمين إغلاق مصادر الطاقة المحركة عن المعدة بواسطة سلاسل وأقفال، كل قفل مختلف عن الآخر، ويحتفظ كل منهما بالمفتاح الخاص به (الشكل 5-22)، إذا توفرت الإمكانية لعمل ذلك، وإذا لم يكن ذلك ممكناً يتم إجراء ما يلي:<ul style=\"list-style:none;padding-inline-start:10px\"><li>أ- إغلاق المفتاح الكهربائي الخاص بتشغيل المعدة ووضعه على الوضع <span class=\"ltr\">Off</span> من لوحة المفاتيح الكهربائية.</li><li>ب- إغلاق المحابس الخاصة بالهواء والغازات المضغوطة والبخار.</li></ul></li>\n   <li>يقوم مسؤول الصيانة بالتعاون مع مسؤول الموقع بوضع لوحة <span class=\"ltr\">(Tag)</span> بجوار لوحة المفاتيح الكهربائية أو المحابس التي تم إغلاقها ووضعها على الوضع <span class=\"ltr\">(Off)</span>، تفيد بأن هذه المفاتيح والمحابس قد تم إغلاقها بسبب وجود أعمال صيانة على المعدة، وعدم إعادة الطاقة المحركة لهذه المعدة أو فتح المحابس إلا بواسطة الأشخاص المصرح لهم بذلك (الشكل 5-23).</li>\n   <li>بعد إجراء الخطوتين 6 و7 أعلاه يتم تعبئة النموذج رقم 1 (تصريح عزل الطاقة المحركة عن المعدات والآلات) بواسطة مسؤول الصيانة ومسؤول الموقع والتوقيع عليه، ويحتفظ مسؤول الموقع بنسخة، ونسخة تسلم لقسم الصيانة، ونسخة لقسم السلامة والصحة المهنية.</li>\n   <li>بعد ذلك يبدأ العاملون في قسم الصيانة في الإصلاح وصيانة المعدة، وقبل قيامهم بذلك يتم محاولة تشغيل المعدة للتأكد للمرة الأخيرة أن مصادر الطاقة المحركة معزولة عنها، ومن ثم يتم إعادة مفاتيح التشغيل إلى الوضع <span class=\"ltr\">(Off)</span> والبدء بالعمل.</li>\n   <li>يتم إجراء الخطوات أعلاه أيضاً وتحت إشراف قسم الصيانة في حالة قيام أحد المقاولين بالعمل بالمعدات.</li>\n   <li>في حالة عدم اكتمال العمل خلال وردية واحدة وسوف يستمر إلى الوردية التي تليها، يتم إعلام العاملين بالوردية التالية بالخطوات المتبعة، ويقوم مسؤول الموقع ومسؤول الصيانة في الوردية التالية بالتوقيع على النموذج (1) ويستمر العمل.</li>\n   <li>يقوم مسؤول السلامة والصحة المهنية أثناء جولات السلامة اليومية بالتأكد من تنفيذ الخطوات أعلاه في حالة وجود أية أعمال صيانة وإصلاح بالمعدات.</li>\n   <li>بعد الانتهاء من العمل يقوم مسؤول الموقع، بالتنسيق مع مسؤول الصيانة وبعد التأكد من عدم وجود أي شخص بجوار المعدة، بفتح الأقفال (إذا تم استخدام أقفال)، وإعادة التيار الكهربائي بوضع المفاتيح في اللوحات الكهربائية على الوضع <span class=\"ltr\">(On)</span>، وفتح محابس الغاز / الهواء / البخار، كذلك إزالة اللافتات <span class=\"ltr\">(Tags)</span>.</li>\n   <li>يتم تشغيل المعدة من مفاتيح التشغيل الخاصة بها في وجود مسؤول الموقع ومسؤول الصيانة.</li></ol>",ref:'ص <span class="ltr">104–107</span>'},
    {watch:"ترقيم الخطوات في الكتاب (ص 104–107) مضطرب: بعد الخطوة 6 يقفز إلى 8 و9 (وهما البديلان في الخطوة 6 إذا لم تتوفر الأقفال)، ثم 10 إلى 15، ثم يبدأ من جديد «3.» و«4.». جعلنا البديلين (أ، ب) تحت الخطوة 6 فصار الترقيم متصلاً من 1 إلى 14؛ وبهذا يصح قول الكتاب «بعد إجراء الخطوات 6، 7» (الأقفال واللافتات). أما «النموذج رقم 1» فمذكور ولا يوجد في الكتاب.",fix:true},
    {title:'مختبر مصغّر: ماذا لو تخطّيت هذه الخطوة؟',widget:(el,B)=>DCML.cases(el,B,{intro:'لكل خطوة متروكة اختر ما قد يحدث. (للتنفيذ الكامل خطوة بخطوة جرّب تبويب «المختبر».)',cases:[
     {q:'تخطّيت الخطوة 5: لم تفرّغ الهواء المضغوط المتبقي في المواسير.',opts:[['لا شيء، فالمحبس مغلق',false,'إغلاق المحبس يمنع هواءً جديداً، لكن الهواء المحبوس بعده يبقى.'],['قد يتحرك المكبس فجأة بالضغط المتبقي ويصيب العامل',true,'لذلك يطلب الكتاب «تفريغ الطاقة المتبقية والمتجمعة في المواسير» (الخطوة 5، ص 105).']]},
     {q:'تخطّيت الخطوة 4: لم تحاول تشغيل المعدة بعد العزل.',opts:[['قد تكون فصلت المفتاح الخطأ ولا تعرف ذلك',true,'محاولة التشغيل تتأكد «أن عزل الطاقة المحركة عن المعدة قد تم بصورة سليمة» (ص 105).'],['لا فرق؛ الفصل يكفي دائماً',false,'الكتاب يطلب التأكد بمحاولة التشغيل ثم إعادة المفاتيح إلى Off.']]},
     {q:'علّقت اللافتة ولم تضع الأقفال مع أنها متوفرة.',opts:[['اللافتة كافية دائماً',false,'اللافتة تنبيه فقط؛ من لا ينتبه لها قد يعيد التيار.'],['قد يعيد زميل التيار وهو لا يعلم بوجود عامل داخل المعدة',true,'الأقفال تمنع ذلك، لأن مفتاح كل قفل مع صاحبه (الخطوة 6).']]}]})}
   ]},

  {st:6,short:'أسئلة الوحدة',title:'أسئلة الوحدة الخامسة',ref:'ص <span class="ltr">108–110</span>',
   q:'هل تستطيع أن تجيب عن أسئلة الكتاب قبل أن تفتح الإجابة المقترحة؟',
   art:S5.svg('بطاقة أسئلة: مقالية وأكمل وصح أو خطأ','#FBE6C4',
     S5.tip('الأسئلة المقالية: ⟦13⟧ سؤالاً من الكتاب (ص ⟦108⟧).',`<rect x="80" y="54" width="200" height="60" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/>`+S5.ar(180,90,'أسئلة مقالية',{fs:15,b:1}))
    +S5.tip('أكمل مكان النقط: ⟦12⟧ عبارة (ص ⟦108–110⟧).',`<rect x="80" y="130" width="200" height="60" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/>`+S5.ar(180,166,'أكمل الفراغ',{fs:15,b:1}))
    +S5.tip('ضع علامة صح أو خطأ: ⟦22⟧ عبارة (ص ⟦110⟧).',`<rect x="80" y="206" width="200" height="60" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/>`+S5.ar(200,242,'صح أم خطأ',{fs:15,b:1})+`<path d="M110 236l6 8 12-14" fill="none" stroke="#12855A" stroke-width="4"/><path d="M134 230l12 12M146 230l-12 12" stroke="#C8372D" stroke-width="4"/>`)),
   cap:'أنواع أسئلة الوحدة في الكتاب.<br><b>مرّر المؤشر على كل بطاقة (أو المسها في الجوال) لتعرف عدد أسئلتها.</b>',
   side:[
    {predict:{q:'في أسئلة صح/خطأ: «جهد التماس هو أحد حالات جهد الخطوة». ما الصحيح حسب نص الكتاب؟',opts:[
     ['خاطئة: جهد الخطوة هو من إحدى حالات جهد التماس',true,'«وهو [جهد الخطوة] من إحدى حالات جهد التماس» (ص 88).'],
     ['صحيحة',false,'الكتاب يقول العكس.'],
     ['لا علاقة بين الجهدين',false,'بينهما علاقة يذكرها الكتاب صراحة.']]}}
   ],
   body:[
    {html:"<p>الكتاب لا يضع إجابات للأسئلة؛ الإجابات المقترحة هنا مكتوبة من نص الكتاب. اضغط على السؤال لترى إجابته.</p>\n<h3 class=\"sm\">أولاً: الأسئلة المقالية</h3>\n<details style=\"margin:6px 0\"><summary>س1: ما الحالات الناجمة عن مرور التيار الكهربائي إلى الأرض عن طريق جسم الإنسان؟</summary><div style=\"padding:6px 10px 2px\"><p><b>إجابة مقترحة (ليست من الكتاب):</b> لمس خطين معاً ناقلين للتيار؛ ولمس خط واحد ناقل للتيار (في شبكة معزولة عن الأرض أو مؤرضة)؛ ولمس مادة ناقلة غير حاملة للتيار وقعت تحت تأثير خطأ؛ وجهد التماس؛ وجهد الخطوة (ص 86–89).</p></div></details>\n<details style=\"margin:6px 0\"><summary>س2: ما آثار مرور التيار الكهربائي في جسم الإنسان؟</summary><div style=\"padding:6px 10px 2px\"><p><b>إجابة مقترحة (ليست من الكتاب):</b> آثار حرارية (احتراق الجلد وسخونة الأوعية والدم)، وتحليلية (تحليل الدم والسوائل الحيوية وتخريب الأنسجة)، وبيولوجية (تهييج الأنسجة الحية مع تقلصات تشنجية للعضلات ومنها القلب والرئتان) (ص 81).</p></div></details>\n<details style=\"margin:6px 0\"><summary>س3: ما أسباب الإصابة بالتيار الكهربائي؟</summary><div style=\"padding:6px 10px 2px\"><p><b>إجابة مقترحة (ليست من الكتاب):</b> ملامسة التوصيلات الكهربائية؛ وملامسة الأجزاء الناقلة غير الحاملة للتيار؛ وحدوث القوس الكهربائي؛ ووقوع التجهيزات ذات الجهد المنخفض تحت أثر الجهد العالي؛ وآثار الكهرباء الساكنة (ص 79–80).</p></div></details>\n<details style=\"margin:6px 0\"><summary>س4: عدِّد الإصابات الناتجة عن مرور التيار الكهربائي في جسم الإنسان.</summary><div style=\"padding:6px 10px 2px\"><p><b>إجابة مقترحة (ليست من الكتاب):</b> الصدمة الكهربائية (الحروق، والندبات، وتمعدن الجلد، والأضرار الفيزيائية)، والصعقة الكهربائية (ص 92–94).</p></div></details>\n<details style=\"margin:6px 0\"><summary>س5: ما الشروط الواجب مراعاتها عند إغاثة مصاب بالتيار الكهربائي؟</summary><div style=\"padding:6px 10px 2px\"><p><b>إجابة مقترحة (ليست من الكتاب):</b> قطع التيار فوراً، فإن تعذّر توضع النواقل في دائرة قصر، فإن تعذّر يعزل المنقذ نفسه من جهة التيار ومن جهة الأرض، ويستعمل أدوات لها مقابض عازلة، ويقف على سطح عازل أو بساط مطاطي أو أخشاب جافة، ويبعد المصاب عن كل تماس كهربائي، ويُستدعى الطبيب فوراً، ولا يُترك المصاب وحده (ص 94–95).</p></div></details>\n<details style=\"margin:6px 0\"><summary>س6: عرِّف كلاً من: جهد الخطوة – جهد التماس.</summary><div style=\"padding:6px 10px 2px\"><p><b>إجابة مقترحة (ليست من الكتاب):</b> <b>جهد التماس:</b> فرق الجهد الحاصل بين نقطتين من جسم الإنسان، والذي يؤدي لمرور تيار فيه \\(U_t=I_h\\cdot R_h\\). <b>جهد الخطوة:</b> إحدى حالات جهد التماس، وهو فرق الجهد الحاصل بين القدمين، ويقل بالابتعاد عن المربط الأرضي (ص 88).</p></div></details>\n<details style=\"margin:6px 0\"><summary>س7: عدِّد أنواع الإصابة الكهربائية للإنسان عند مرور تيار كهربائي به.</summary><div style=\"padding:6px 10px 2px\"><p><b>إجابة مقترحة (ليست من الكتاب):</b> الصدمة الكهربائية والصعقة الكهربائية (ص 92–94).</p></div></details>\n<details style=\"margin:6px 0\"><summary>س8: هناك عدة مظاهر للصدمة الكهربائية على جسم الإنسان [اذكرها].</summary><div style=\"padding:6px 10px 2px\"><p><b>إجابة مقترحة (ليست من الكتاب):</b> الحروق الكهربائية، والندبات الكهربائية، وتمعدن الجلد، والأضرار الفيزيائية (ص 92–93).</p></div></details>\n<details style=\"margin:6px 0\"><summary>س9: اذكر باختصار أضرار الصعقة الكهربائية على جسم الإنسان.</summary><div style=\"padding:6px 10px 2px\"><p><b>إجابة مقترحة (ليست من الكتاب):</b> تقلص تشنجي للعضلات بدون فقدان الوعي؛ ثم مع فقدان الوعي مع بقاء التنفس وعمل القلب؛ ثم فقدان الوعي واختلال عمل القلب أو التنفس أو كليهما؛ ثم الموت بتوقف التنفس والدورة الدموية. ويبدأ صعوبة التنفس عند 20–25 مللي أمبير، وقد يتوقف القلب أو يرتجف (ص 94).</p></div></details>\n<details style=\"margin:6px 0\"><summary>س10: ما طرق التنفس الصناعي المتبعة عند إغاثة المصاب بالتيار الكهربائي؟</summary><div style=\"padding:6px 10px 2px\"><p><b>إجابة مقترحة (ليست من الكتاب):</b> حسب الكتاب: الطريقة اليدوية، وطريقة النفخ (قبلة الحياة) وهي أفضلها، مع التدليك الخارجي للقلب (ص 95–99). <span class=\"fixnote\">والمعتمد اليوم: لا تُستعمل الطريقة اليدوية، والإنعاش 30 ضغطة : نفختان بسرعة 100–120 في الدقيقة مع جهاز AED (انظر الدرس السابق، «المصحح»).</span></p></div></details>\n<details style=\"margin:6px 0\"><summary>س11: ما العوامل التي تتوقف عليها درجة الإصابة بالتيار الكهربي؟</summary><div style=\"padding:6px 10px 2px\"><p><b>إجابة مقترحة (ليست من الكتاب):</b> شدة التيار (العامل الحاسم)، ومقاومة جسم الإنسان، ومدة تأثير التيار، والجهد، وتردد التيار، والطريق الذي يمر فيه التيار بالجسم (ص 81–85).</p></div></details>\n<details style=\"margin:6px 0\"><summary>س12: هناك نقاط يجب مراعاتها عند إغاثة إنسان مصاب بالتيار الكهربي، وذلك حفاظاً على المنقذ؛ اذكرها.</summary><div style=\"padding:6px 10px 2px\"><p><b>إجابة مقترحة (ليست من الكتاب):</b> قطع التيار أولاً؛ أو وضع النواقل في دائرة قصر؛ أو أن يعزل المنقذ نفسه من جهة التيار ومن جهة الأرض في آن واحد؛ وأن يستعمل أدوات لها مقابض عازلة؛ وأن يقف على سطح عازل أو بساط مطاطي أو أخشاب جافة (ص 94–95). وفي جهد الخطوة: لا يخطو خطوات كبيرة، ويفضّل القفز أو السير على ألواح خشبية (ص 89).</p></div></details>\n<details style=\"margin:6px 0\"><summary>س13: ما أنواع الحروق المختلفة الناتجة عن مرور التيار الكهربي في جسم الإنسان؟</summary><div style=\"padding:6px 10px 2px\"><p><b>إجابة مقترحة (ليست من الكتاب):</b> الحرق التياري أو التلامسي، والحرق القوسي، والحروق المختلطة (ص 92).</p></div></details>\n<h3 class=\"sm\">أكمل مكان النقط بكلمة مناسبة <span class=\"ref\">ص 108–110</span></h3>\n<details style=\"margin:6px 0\"><summary>1: من أسباب الإصابة بالتيار الكهربي: ملامسة …… وغير …… للتيار؛ حدوث …… الكهربي؛ وقوع …… ذات جهد …… تحت تأثير ……؛ آثار …… الساكنة.</summary><div style=\"padding:6px 10px 2px\"><p><b>إجابة مقترحة (ليست من الكتاب):</b> ملامسة <b>الأجزاء الناقلة</b> وغير <b>الحاملة</b> للتيار؛ حدوث <b>القوس</b> الكهربي؛ وقوع <b>التجهيزات</b> ذات جهد <b>منخفض</b> تحت تأثير <b>الجهد العالي</b>؛ آثار <b>الكهرباء</b> الساكنة.</p></div></details>\n<details style=\"margin:6px 0\"><summary>2: من آثار مرور التيار الكهربي في جسم الإنسان …… و…… و……</summary><div style=\"padding:6px 10px 2px\"><p><b>إجابة مقترحة (ليست من الكتاب):</b> <b>حرارية</b> و<b>تحليلية</b> و<b>بيولوجية</b>.</p></div></details>\n<details style=\"margin:6px 0\"><summary>3: يعرف جهد التماس أنه فرق نقطة …… الحاصلة بين …… من جسم ……</summary><div style=\"padding:6px 10px 2px\"><p><b>إجابة مقترحة (ليست من الكتاب):</b> فرق نقطة <b>التعادل</b> (والمقصود فرق الجهد) الحاصل بين <b>نقطتين</b> من جسم <b>الإنسان</b>.</p></div></details>\n<details style=\"margin:6px 0\"><summary>4: يعتبر جهد الخطوة إحدى حالات …… نتيجة فرق الجهد في نقطة التعادل الحاصل بين ……</summary><div style=\"padding:6px 10px 2px\"><p><b>إجابة مقترحة (ليست من الكتاب):</b> <b>جهد التماس</b>؛ <b>القدمين</b>.</p></div></details>\n<details style=\"margin:6px 0\"><summary>5: من أنواع الإصابات الكهربية …… و……</summary><div style=\"padding:6px 10px 2px\"><p><b>إجابة مقترحة (ليست من الكتاب):</b> <b>الصدمة الكهربائية</b> و<b>الصعقة الكهربائية</b>.</p></div></details>\n<details style=\"margin:6px 0\"><summary>6: الصدمة الكهربية تتجلى بالضرر الذي يصيب جسم الإنسان نتيجة تأثير …… أو ……</summary><div style=\"padding:6px 10px 2px\"><p><b>إجابة مقترحة (ليست من الكتاب):</b> <b>تيار القصر</b> أو <b>القوس الكهربائي</b>.</p></div></details>\n<details style=\"margin:6px 0\"><summary>7: تنقسم الحروق حسب شروط حدوثها إلى ثلاثة أقسام …… و…… و……</summary><div style=\"padding:6px 10px 2px\"><p><b>إجابة مقترحة (ليست من الكتاب):</b> <b>الحرق التياري (التلامسي)</b> و<b>الحرق القوسي</b> و<b>الحروق المختلطة</b>.</p></div></details>\n<details style=\"margin:6px 0\"><summary>8: الندبات الكهربائية هي …… جلدية صغيرة لونها …… أو …… ولها شكل …… ذات لون …… في مركزها، وتصيب حوالي ……٪ من المصابين.</summary><div style=\"padding:6px 10px 2px\"><p><b>إجابة مقترحة (ليست من الكتاب):</b> <b>بقع</b>؛ <b>فضي</b> أو <b>أصفر</b>؛ <b>دائري أو قطاعي</b>؛ <b>غامق</b>؛ <b>20</b>٪.</p></div></details>\n<details style=\"margin:6px 0\"><summary>9: تمعدن الجلد يحدث نتيجة …… الجلد من قبل ذرات المعدن …… و…… عند ظهور …… وذلك عند حدوث دائرة ……، ويصيب حوالي ……٪ من المصابين.</summary><div style=\"padding:6px 10px 2px\"><p><b>إجابة مقترحة (ليست من الكتاب):</b> <b>احتراق</b>؛ <b>المنصهر</b> و<b>المتطاير</b>؛ <b>القوس الكهربائي</b>؛ <b>القصر</b>؛ <b>10</b>٪.</p></div></details>\n<details style=\"margin:6px 0\"><summary>10: الأضرار الفيزيائية نتيجة …… الحاد غير الإرادي لا …… تحدث تحت تأثير …… المار في جسم الإنسان، ويصيب حوالي ……٪.</summary><div style=\"padding:6px 10px 2px\"><p><b>إجابة مقترحة (ليست من الكتاب):</b> <b>التقلص</b>؛ <b>للعضلات</b>؛ <b>التيار</b>؛ <b>3</b>٪. <span class=\"fixnote\">في الكتاب «لا ……» وهي بقية خطأ طباعي، والمقصود «للعضلات».</span></p></div></details>\n<details style=\"margin:6px 0\"><summary>11: الصعقة الكهربائية هي …… الذي يصيب …… الحية بسبب مرور …… خلال جسم الإنسان، ويصنف إلى تقلص تشنجي للعضلات وبدون ……، وتقلص مع ……، وفقدان …… واختلال عمل …… أو …… أو كليهما، وكذلك قد يحدث …… وبذلك يتوقف التنفس أو …… الدموية.</summary><div style=\"padding:6px 10px 2px\"><p><b>إجابة مقترحة (ليست من الكتاب):</b> <b>التهيج</b>؛ <b>الأنسجة</b>؛ <b>التيار الكهربائي</b>؛ <b>فقدان الوعي</b>؛ <b>فقدان الوعي</b>؛ <b>الوعي</b>؛ <b>القلب</b> أو <b>التنفس</b>؛ <b>الموت</b>؛ <b>الدورة</b> الدموية.</p></div></details>\n<details style=\"margin:6px 0\"><summary>12: من أفضل الطرق للتنفس الصناعي …… الحياة، وفيها ينفخ في فم ……، ويجب أن يكون رأس المصاب …… إلى الخلف حتى لا يتسبب …… في سد طريق ……</summary><div style=\"padding:6px 10px 2px\"><p><b>إجابة مقترحة (ليست من الكتاب):</b> <b>قبلة</b> الحياة؛ <b>المصاب</b>؛ <b>مائلاً</b>؛ <b>اللسان</b>؛ <b>التنفس</b>.</p></div></details>\n<h3 class=\"sm\">ضع علامة (√) أمام العبارة الصحيحة و(×) أمام العبارة غير الصحيحة <span class=\"ref\">ص 110</span></h3>\n<details style=\"margin:6px 0\"><summary>1: إن من أسباب الإصابة بالتيار الكهربائي عدم ملامسة التوصيلات الكهربية.</summary><div style=\"padding:6px 10px 2px\"><p><b>إجابة مقترحة (ليست من الكتاب):</b> <b>(×)</b> السبب هو الملامسة لا عدمها (ص 79).</p></div></details>\n<details style=\"margin:6px 0\"><summary>2: إن من أسباب الإصابة بالتيار الكهربائي ملامسة التوصيلات الكهربية.</summary><div style=\"padding:6px 10px 2px\"><p><b>إجابة مقترحة (ليست من الكتاب):</b> <b>(√)</b> البند أ من أسباب الإصابة (ص 79).</p></div></details>\n<details style=\"margin:6px 0\"><summary>3: من آثار مرور التيار الكهربائي [في] جسم الإنسان تأثير فرق الجهد.</summary><div style=\"padding:6px 10px 2px\"><p><b>إجابة مقترحة (ليست من الكتاب):</b> <b>(√)</b> «هـ- تأثير الجهد الكهربائي» من بنود عنوان الآثار (ص 84). <br><span class=\"fixnote\">صياغة العبارتين 3 و4 لا تطابق تقسيم الآثار في الشرح (حرارية وتحليلية وبيولوجية، ص 81)؛ وعددناها صحيحة لأن «تأثير الجهد» بند تحت عنوان الآثار.</span></p></div></details>\n<details style=\"margin:6px 0\"><summary>4: من آثار مرور التيار الكهربائي [في] جسم الإنسان عدم تأثير فرق الجهد.</summary><div style=\"padding:6px 10px 2px\"><p><b>إجابة مقترحة (ليست من الكتاب):</b> <b>(×)</b> عكس العبارة السابقة.</p></div></details>\n<details style=\"margin:6px 0\"><summary>5: تحدث الوفاة للإنسان عندما يمر في جسمه 200 مللي أمبير.</summary><div style=\"padding:6px 10px 2px\"><p><b>إجابة مقترحة (ليست من الكتاب):</b> <b>(√)</b> الجدول: 100–200 «توقف القلب»، وأكثر من 200 «تقلص تام لعضلة القلب» (ص 83). <br><span class=\"fixnote\">العبارتان 5 و6 بُنيتا زوجاً تكون فيه واحدة صحيحة، لكن الكتاب يجعل كلتيهما صحيحة: فهو يقول إن 0.1 أمبير (100 مللي أمبير) «مميت في جميع الأحوال» (ص 84).</span></p></div></details>\n<details style=\"margin:6px 0\"><summary>6: تحدث الوفاة للإنسان عندما يمر في جسمه 100 مللي أمبير.</summary><div style=\"padding:6px 10px 2px\"><p><b>إجابة مقترحة (ليست من الكتاب):</b> <b>(√)</b> «تياراً بشدة 0.1 أمبير هو مميت في جميع الأحوال» (ص 84).</p></div></details>\n<details style=\"margin:6px 0\"><summary>7: يجري التنفس الصناعي للشخص المصاب وهو في وضع استرخاء.</summary><div style=\"padding:6px 10px 2px\"><p><b>إجابة مقترحة (ليست من الكتاب):</b> <b>(√)</b> يوضع المصاب على ظهره (ص 96).</p></div></details>\n<details style=\"margin:6px 0\"><summary>8: يجري التنفس الصناعي للشخص المصاب وهو في وضع وقوف على الأرض.</summary><div style=\"padding:6px 10px 2px\"><p><b>إجابة مقترحة (ليست من الكتاب):</b> <b>(×)</b> عكس العبارة السابقة.</p></div></details>\n<details style=\"margin:6px 0\"><summary>9: من الحالات الناتجة عن مرور تيار في جسم الإنسان لمس الأرض.</summary><div style=\"padding:6px 10px 2px\"><p><b>إجابة مقترحة (ليست من الكتاب):</b> <b>(×)</b> لمس الأرض وحده لا يسبب مرور تيار؛ يلزم لمس نقطتين بينهما فرق جهد (ص 86).</p></div></details>\n<details style=\"margin:6px 0\"><summary>10: من الحالات الناتجة عن مرور تيار في جسم الإنسان لمس سلك الكهرباء.</summary><div style=\"padding:6px 10px 2px\"><p><b>إجابة مقترحة (ليست من الكتاب):</b> <b>(√)</b> لمس خط واحد أو خطين (ص 86).</p></div></details>\n<details style=\"margin:6px 0\"><summary>11: جهد التماس هو أحد حالات جهد الخطوة.</summary><div style=\"padding:6px 10px 2px\"><p><b>إجابة مقترحة (ليست من الكتاب):</b> <b>(×)</b> الكتاب يقول العكس: «جهد الخطوة من إحدى حالات جهد التماس» (ص 88). <br><span class=\"fixnote\">العبارتان 11 و12 كلتاهما خاطئة حسب الكتاب، فلا عبارة صحيحة في هذا الزوج. العبارة الصحيحة: «جهد الخطوة هو أحد حالات جهد التماس».</span></p></div></details>\n<details style=\"margin:6px 0\"><summary>12: جهد التماس هو أحد حالات جهد المصدر الكهربائي.</summary><div style=\"padding:6px 10px 2px\"><p><b>إجابة مقترحة (ليست من الكتاب):</b> <b>(×)</b> جهد التماس فرق جهد بين نقطتين من جسم الإنسان (ص 88).</p></div></details>\n<details style=\"margin:6px 0\"><summary>13: من أنواع الإصابات بالكهرباء الصدمة والصاعقة الكهربائية.</summary><div style=\"padding:6px 10px 2px\"><p><b>إجابة مقترحة (ليست من الكتاب):</b> <b>(√)</b> الصدمة والصعقة (ص 92–94).</p></div></details>\n<details style=\"margin:6px 0\"><summary>14: أنواع الإصابات بالكهرباء الصرع والانهيار العصبي.</summary><div style=\"padding:6px 10px 2px\"><p><b>إجابة مقترحة (ليست من الكتاب):</b> <b>(×)</b> ليسا من تقسيم الكتاب.</p></div></details>\n<details style=\"margin:6px 0\"><summary>15: تنقسم الحروق حسب حدوثها إلى تيارية وقوسية ومختلطة.</summary><div style=\"padding:6px 10px 2px\"><p><b>إجابة مقترحة (ليست من الكتاب):</b> <b>(√)</b> (ص 92).</p></div></details>\n<details style=\"margin:6px 0\"><summary>16: تنقسم الحروق حسب حدوثها إلى حروق بسيطة وحروق مركبة.</summary><div style=\"padding:6px 10px 2px\"><p><b>إجابة مقترحة (ليست من الكتاب):</b> <b>(×)</b> عكس العبارة السابقة.</p></div></details>\n<details style=\"margin:6px 0\"><summary>17: يصنف التقلص التشنجي إلى أربعة أقسام أساسية.</summary><div style=\"padding:6px 10px 2px\"><p><b>إجابة مقترحة (ليست من الكتاب):</b> <b>(√)</b> الأقسام الأربعة (أ–د) هي تصنيف الصعقة الكهربائية، والتقلص التشنجي جزء من تعريفها (ص 94). <br><span class=\"fixnote\">العبارة تنسب التصنيف إلى «التقلص التشنجي»، والكتاب يصنّف «الصعقة الكهربائية» إلى أربعة أقسام.</span></p></div></details>\n<details style=\"margin:6px 0\"><summary>18: يصنف التقلص التشنجي إلى عشرة أقسام أساسية.</summary><div style=\"padding:6px 10px 2px\"><p><b>إجابة مقترحة (ليست من الكتاب):</b> <b>(×)</b> أربعة لا عشرة.</p></div></details>\n<details style=\"margin:6px 0\"><summary>19: الندبات الكهربية تحدث [عند] حوالي 20٪ من المصابين بالتيار الكهربي.</summary><div style=\"padding:6px 10px 2px\"><p><b>إجابة مقترحة (ليست من الكتاب):</b> <b>(√)</b> (ص 93).</p></div></details>\n<details style=\"margin:6px 0\"><summary>20: الندبات الكهربية تحدث [عند] حوالي 50٪ من المصابين بالتيار الكهربي.</summary><div style=\"padding:6px 10px 2px\"><p><b>إجابة مقترحة (ليست من الكتاب):</b> <b>(×)</b> 20٪ لا 50٪.</p></div></details>\n<details style=\"margin:6px 0\"><summary>21: تمعدن الجلد يحدث في حوالي 10٪ من المصابين بالتيار الكهربي.</summary><div style=\"padding:6px 10px 2px\"><p><b>إجابة مقترحة (ليست من الكتاب):</b> <b>(√)</b> (ص 93).</p></div></details>\n<details style=\"margin:6px 0\"><summary>22: تمعدن الجلد يحدث في حوالي 80٪ من المصابين بالتيار الكهربي.</summary><div style=\"padding:6px 10px 2px\"><p><b>إجابة مقترحة (ليست من الكتاب):</b> <b>(×)</b> 10٪ لا 80٪.</p></div></details>\n<p class=\"sub\">ما بين القوسين المعقوفين [ ] زيادة منا لتوضيح العبارة.</p>"},
    {title:'تحقق سريع من أسئلة الكتاب',widget:(el,B)=>DCML.tf(el,B,{intro:'عبارات من أسئلة صح/خطأ في الكتاب (ص 110)، والحكم والسبب من نص الكتاب.',items:TF.filter((x,i)=>[0,5,8,13,14,19].includes(i)).map(x=>[x[0],x[1]==='√',x[2]])})}
   ]},

  {recap:[
   'الوقاية: تصميم وتنفيذ من متخصصين، ولوحات توزيع ودوائر مستقلة، وتأريض جيد ودائم، وعلب توصيل مغلقة، وصيانة دورية.',
   'الإغلاق ووضع اللافتات (Lock-out / Tag-out): عزل كل مصادر الطاقة عن المعدة وقفلها، ولافتة تبين أنها خارج الخدمة، لمنع الحوادث أثناء العمل.',
   'مصادر الطاقة سبعة (كهربائية، ميكانيكية، هيدروليكية، هوائية، كيميائية، حرارية، غازات)، والضغط المتبقي يجب تفريغه بعد العزل.',
   'قفل السلامة له مفتاح واحد مع من عزل الطاقة؛ ولا تُفك الأقفال إلا بعد انتهاء العمل والتأكد من عدم وجود أي شخص بجوار المعدة.']}
],
 theory:[
  {h:'5-7 الوقاية من مخاطر الكهرباء',ref:'ص 100–101',html:`<p>للوقاية من مخاطر الكهرباء عموماً يجب مراعاة ما يلي:</p>
   <ol><li>تصمم الأعمال الكهربائية من قبل مهندسين كهربائيين متخصصين ذوي خبرة، وتراعى الأصول الفنية في التصميم الذي يشمل إعداد المواصفات الفنية والمخططات اللازمة لتنفيذ المشروع.</li>
   <li>تنفيذ الأعمال الكهربائية من قبل فنيين متخصصين أكفاء ومهرة وتحت إشراف مهندسين مختصين، وأن تكون هذه الأعمال مطابقة للمواصفات القياسية أو ما يعادلها من المواصفات العالمية المعترف بها.</li>
   <li>التقيد بالتعليمات الواردة في النشرات الفنية المرفقة بالأجهزة الكهربائية، والتي يتم إعدادها من قبل الشركات الصانعة للأجهزة، وتوضح طريقة الفك والتركيب والتشغيل والصيانة وشروط التغذية الكهربائية وأنواع الأعطال المحتملة وطرق إصلاحها، كما تتضمن المواصفات الفنية استهلاك الوقود أو الكهرباء وقدرة الجهاز وكفاءته والجهد والتردد اللذين يعمل عليهما، بالإضافة لبعض المعلومات الأخرى. ويجب مراعاة التعليمات الخاصة بمكان العمل المناسب للجهاز من تهوية وحرارة ورطوبة وأجهزة وقاية شخصية وعامة.</li>
   <li>عند انقطاع التيار الكهربائي يلزم إطفاء جميع الأجهزة ذات المحركات مثل المكيفات والثلاجات والغسالات، وغيرها من الأجهزة الأخرى الحساسة مثل أجهزة الحاسب الآلي، حتى لا تتعرض تلك الأجهزة للتلف عند عودة التيار الفجائية للخدمة.</li>
   <li>تغذية التجهيزات والآلات الكهربائية بواسطة لوحات توزيع رئيسة وفرعية لتسهيل عملية التحكم والحماية.</li>
   <li>عمل دوائر خاصة ومستقلة للأجهزة الكبيرة الثابتة مثل المكيفات والغسالات.</li>
   <li>فصل كل من دوائر التوصيل الآتية عن بعضها، ويجري تمديدها في مواسير مستقلة وعلب منفصلة:<ul><li>دوائر الإنارة والمراوح.</li><li>دوائر القوى والمكيفات.</li><li>أنظمة الجهد الفائق الانخفاض مثل هوائي التلفاز والهاتف والأجراس وأنظمة إنذار الحريق… إلخ.</li></ul>ويراعى موازنة الأحمال الكهربائية على الأوجه الثلاثة بالتساوي قدر الإمكان.</li>
   <li>التأريض الجيد والدائم للأجهزة الكهربائية، وكذلك تأريض جميع الأجزاء المعدنية غير الحاملة للتيار والقريبة من الموصلات الكهربائية.</li>
   <li>المواد العازلة المستخدمة في الآلات والتمديدات واللوحات الكهربائية تكون من أجود الأنواع وذات درجة عزل جيدة وكافية.</li>
   <li>جميع التمديدات الكهربائية تربط بإحكام، ويتم ربط الأسلاك ببعضها داخل علب التوصيل بواسطة مرابط نهايات توصيل مجهزة ببراغٍ من النحاس الأصفر، على أن تعزل عزلاً إضافياً بشريط عازل إذا تطلب الأمر.</li>
   <li>أن تكون علب التوصيل قوية وواسعة وذات أغطية محكمة، ولا يسمح بتركها مكشوفة بأي حال من الأحوال.</li>
   <li>استخدام المعدات والأدوات الكهربائية الجيدة والمناسبة في تنفيذ الأعمال الكهربائية.</li>
   <li>القيام بأعمال الصيانة الدورية مع إجراء الاختبارات المناسبة.</li></ol>`},
  {err:'<span class="fixnote">في الكتاب (ص 100–101) رُقّمت الدوائر الثلاث التي تُفصل (الإنارة، والقوى، والجهد الفائق الانخفاض) بنوداً مستقلة 8 و9 و10، وهي فروع للبند 7؛ لذلك صارت عندنا تحت البند 7، وصار عدد البنود 13 بدل 16.</span>'},
  {h:'5-8 إغلاق مصادر الطاقة ووضع لافتات عليها (Lock-out / Tag-out)',ref:'ص 102',html:`<p><b>الغرض:</b> وضع نظام عمل آمن لعزل مصادر القوى أو الأجزاء المتحركة عن المعدات والآلات في حالات التركيب أو الصيانة، وذلك لمنع أية حوادث قد تقع بسبب المعدة أثناء العمل بها.</p>
   <p><b>تعريفات:</b></p>
   <p><b>1- الإغلاق ${lt('Lock-Out')} – وضع اللافتات ${lt('Tag-Out')}:</b> استعمال جهاز معين لعزل مصادر الطاقة عن المعدات المراد العمل بها، ووضع لافتات على أماكن فصل مصادر الطاقة لهذه المعدات تبين أنها خارج الخدمة لوجود أعمال صيانة بها، وأنه قد تم فصل القوى المحركة عنها، حتى لا يتم إعادة تشغيلها إلا بعد الانتهاء من العمل بها وبمعرفة الأشخاص الذين قاموا بإغلاقها.</p>
   <p><b>2- أجهزة الإغلاق والعزل ${lt('Energy Isolation Devices')}:</b> هي أجهزة تستخدم لعزل القوى المحركة عن الآلات والمعدات، وبعض الأمثلة لذلك:</p>
   <ul><li>جهاز فصل التيار الكهربائي الموجود في لوحات الكهرباء ${lt('Manually Operated Electrical Circuit Breakers')}.</li><li>الفلانجات ذات الوجوه العمياء لعزل المواسير ${lt('Blind Flanges')}.</li><li>السلاسل والأقفال لتأمين إغلاق المحابس والصمامات.</li><li>مفاتيح الإيقاف والفصل ${lt('Disconnect Switches')}.</li><li>الأقفال ${lt('Padlocks')} (تستخدم لإغلاق بعض أنواع لوحات الكهرباء).</li></ul>`},
  {h:'5-9 مصادر الطاقة (Energy Resources)',ref:'ص 102–103',html:`<p>جميع مصادر الطاقة (الشكل 5-19) قد تسبب إصابة وأذى العاملين، وهي على النحو التالي: المصادر الكهربائية ${lt('Electrical')}، والمصادر الميكانيكية ${lt('Mechanical')}، والمصادر الهيدروليكية ${lt('Hydraulic')}، والمصادر الهوائية ${lt('Pneumatic')}، والمصادر الكيميائية ${lt('Chemical')}، والمصادر الحرارية ${lt('Thermal')}، والغازات ${lt('Gases')}.</p>`},
  {fig:'(5-19)',ref:'ص 103',caption:'مصادر الطاقة كما رسمها الكتاب — رسم مبسّط',draw:()=>box(fig519(),520)},
  {err:'<span class="fixnote">الشكل (5-19) يرسم خمسة مصادر (كهرباء، وهواء مضغوط، وضغط هيدروليكي، وغاز، وبخار)، والقائمة سبعة: لا رسم للمصادر الميكانيكية والكيميائية والحرارية، والبخار المرسوم ليس في القائمة (وهو من الطاقة الحرارية).</span>'},
  {h:'5-10 الأشخاص المعرضون للإصابة (Affected Employees)',ref:'ص 103–104',html:`<p>هم العاملون الذين تتطلب مهامهم الوظيفية العمل على تشغيل واستعمال المعدات والآلات التي تدار بواسطة مصادر الطاقة المختلفة، ويجب العمل على صيانة هذه المعدات والآلات تحت نظام العزل وتثبيت اللافتات التحذيرية ${lt('(Lockout / Tagout Procedure)')}.</p>
   <ul><li><b>الموظف المسؤول ${lt('Authorized Employee')}:</b> هو الموظف المسؤول عن إغلاق مصادر الطاقة عن المعدات والآلات التي سوف يتم عمل الصيانة والإصلاح عليها، كذلك وضع اللافتات التحذيرية ${lt('(Tags)')} التي تفيد ذلك.</li>
   <li><b>قفل السلامة ${lt('Safety Padlock')}:</b> هو نوع من الأقفال يكون له مفتاح واحد فقط، يستخدم لتأمين عزل الطاقة المحركة عن الأجهزة والمعدات، بحيث يكون هذا المفتاح مع الشخص المسؤول الذي قام بعزل مصدر الطاقة، حتى لا يتم إعادة الطاقة للأجهزة إلا بواسطة هذا الشخص فقط.</li>
   <li><b>العزل ${lt('Disconnects')}:</b> عزل الطاقة عن المعدات بواسطة المحابس، والمفاتيح الكهربائية، والأجهزة الميكانيكية التي تتسبب في تشغيل المعدة.</li>
   <li><b>الضغط المتبقي ${lt('Residual Pressure')}:</b> هي الطاقة المتبقية في التوصيلات الخاصة بالمعدة أو الآلة بعد عزل الطاقة المحركة عنها (مثال ذلك الهواء المضغوط داخل المواسير بعد قفل المحبس).</li></ul>`},
  {err:'<span class="fixnote">تعريف «العزل» في الكتاب (ص 104): «الأجهزة الميكانيكية التي عند عزلها تسبب تشغيل المعدة» عبارة مقلوبة المعنى؛ والمقصود الأجهزة التي تتسبب في تشغيل المعدة، فنعزل الطاقة بها، كما كتبناها.</span>'},
  {h:'الإجراءات',ref:'ص 104–107',html:`<p>في حالة ضرورة إجراء أعمال الإصلاح والصيانة على أي معدة أو جهاز في أي موقع من مواقع المنشأة المختلفة، يتم اتباع الخطوات التالية:</p>
   <ol><li>يقوم المسؤول بالموقع الموجود به هذه المعدة بإبلاغ قسم الصيانة عن الخلل الموجود بالمعدة، وأنها تحتاج للإصلاح والصيانة.</li>
   <li>يقوم المسؤول بالموقع بإيقافها عن العمل بالطريقة المعتادة، وذلك بالضغط على مفاتيح الإيقاف بها ${lt('Stop Buttons')} (الشكل 5-20).</li>
   <li>يقوم مسؤول الموقع بفصل التيار الكهربائي – إغلاق محابس الغاز – إغلاق محابس الهواء المضغوط والبخار عن المعدة المراد إجراء أعمال الصيانة عليها.</li>
   <li>يقوم مسؤول الموقع بالتأكد أن عزل الطاقة المحركة عن المعدة قد تم بصورة سليمة، وذلك بمحاولة تشغيلها بعد العزل للتأكد من عدم عملها مرة أخرى، ومن ثم يتم إعادة مفاتيح التشغيل على الوضع ${lt('Off')}.</li>
   <li>يقوم العاملون بقسم الصيانة بتفريغ الطاقة المتبقية والمتجمعة في المواسير، مثل الهواء المضغوط – البخار – الغازات المضغوطة، أو الشحنات الكهربائية المتبقية بالمكثفات (الشكل 5-21).</li>
   <li>يقوم مسؤول قسم الصيانة أو من ينوب عنه، بالتنسيق مع مسؤول الموقع الموجود به المعدة وحسب الإمكان، بتأمين إغلاق مصادر الطاقة المحركة عن المعدة بواسطة سلاسل وأقفال، كل قفل مختلف عن الآخر، ويحتفظ كل منهما بالمفتاح الخاص به (الشكل 5-22)، إذا توفرت الإمكانية لعمل ذلك، وإذا لم يكن ذلك ممكناً يتم إجراء ما يلي:<ul style="list-style:none;padding-inline-start:10px"><li>أ- إغلاق المفتاح الكهربائي الخاص بتشغيل المعدة ووضعه على الوضع ${lt('Off')} من لوحة المفاتيح الكهربائية.</li><li>ب- إغلاق المحابس الخاصة بالهواء والغازات المضغوطة والبخار.</li></ul></li>
   <li>يقوم مسؤول الصيانة بالتعاون مع مسؤول الموقع بوضع لوحة ${lt('(Tag)')} بجوار لوحة المفاتيح الكهربائية أو المحابس التي تم إغلاقها ووضعها على الوضع ${lt('(Off)')}، تفيد بأن هذه المفاتيح والمحابس قد تم إغلاقها بسبب وجود أعمال صيانة على المعدة، وعدم إعادة الطاقة المحركة لهذه المعدة أو فتح المحابس إلا بواسطة الأشخاص المصرح لهم بذلك (الشكل 5-23).</li>
   <li>بعد إجراء الخطوتين 6 و7 أعلاه يتم تعبئة النموذج رقم 1 (تصريح عزل الطاقة المحركة عن المعدات والآلات) بواسطة مسؤول الصيانة ومسؤول الموقع والتوقيع عليه، ويحتفظ مسؤول الموقع بنسخة، ونسخة تسلم لقسم الصيانة، ونسخة لقسم السلامة والصحة المهنية.</li>
   <li>بعد ذلك يبدأ العاملون في قسم الصيانة في الإصلاح وصيانة المعدة، وقبل قيامهم بذلك يتم محاولة تشغيل المعدة للتأكد للمرة الأخيرة أن مصادر الطاقة المحركة معزولة عنها، ومن ثم يتم إعادة مفاتيح التشغيل إلى الوضع ${lt('(Off)')} والبدء بالعمل.</li>
   <li>يتم إجراء الخطوات أعلاه أيضاً وتحت إشراف قسم الصيانة في حالة قيام أحد المقاولين بالعمل بالمعدات.</li>
   <li>في حالة عدم اكتمال العمل خلال وردية واحدة وسوف يستمر إلى الوردية التي تليها، يتم إعلام العاملين بالوردية التالية بالخطوات المتبعة، ويقوم مسؤول الموقع ومسؤول الصيانة في الوردية التالية بالتوقيع على النموذج (1) ويستمر العمل.</li>
   <li>يقوم مسؤول السلامة والصحة المهنية أثناء جولات السلامة اليومية بالتأكد من تنفيذ الخطوات أعلاه في حالة وجود أية أعمال صيانة وإصلاح بالمعدات.</li>
   <li>بعد الانتهاء من العمل يقوم مسؤول الموقع، بالتنسيق مع مسؤول الصيانة وبعد التأكد من عدم وجود أي شخص بجوار المعدة، بفتح الأقفال (إذا تم استخدام أقفال)، وإعادة التيار الكهربائي بوضع المفاتيح في اللوحات الكهربائية على الوضع ${lt('(On)')}، وفتح محابس الغاز / الهواء / البخار، كذلك إزالة اللافتات ${lt('(Tags)')}.</li>
   <li>يتم تشغيل المعدة من مفاتيح التشغيل الخاصة بها في وجود مسؤول الموقع ومسؤول الصيانة.</li></ol>`},
  {err:'<span class="fixnote">ترقيم الخطوات في الكتاب (ص 104–107) مضطرب: بعد الخطوة 6 يقفز إلى 8 و9 (وهما البديلان في الخطوة 6 إذا لم تتوفر الأقفال)، ثم 10 إلى 15، ثم يبدأ من جديد «3.» و«4.». جعلنا البديلين (أ، ب) تحت الخطوة 6 فصار الترقيم متصلاً من 1 إلى 14؛ وبهذا يصح قول الكتاب «بعد إجراء الخطوات 6، 7» (الأقفال واللافتات). أما «النموذج رقم 1» فمذكور ولا يوجد في الكتاب.</span>'},
  {fig:'(5-20)',ref:'ص 104',caption:'إيقاف المعدة بالطريقة المعتادة: الضغط على زر الإيقاف الأحمر — رسم مبسّط',draw:()=>box(fig520(),220)},
  {fig:'(5-21)',ref:'ص 105',caption:'تفريغ الطاقة المتبقية: فتح صمام لتفريغ الهواء أو البخار من المواسير، وتفريغ شحنة المكثف في لوحة إلكترونية (صورتان في الكتاب). جرّب تفريغ الضغط المتبقي في المختبر.',draw:()=>''},
  {fig:'',ref:'ص 105',caption:'شكل بلا رقم في الكتاب: غطاء قفل أحمر يُركّب حول عجلة المحبس ويُقفل، ومفتاح فصل على الوضع OFF عليه مشبك تُعلّق فيه عدة أقفال (لكل شخص قفله) ولافتة «DANGER / DO NOT OPERATE» — رسم مبسّط',draw:()=>box(fig105(),440)},
  {fig:'(5-22)',ref:'ص 106',caption:'عاملان يفصلان ويقفلان قواطع في لوحة توزيع وفي صندوق فصل على الجدار بجانب لافتة تحذير (صورتان في الكتاب).',draw:()=>''},
  {fig:'(5-23)',ref:'ص 106',caption:'لافتة «DANGER — DO NOT OPERATE THIS SWITCH» مع قفل، وغطاء قفل على صمام معلّق به لافتة — رسم مبسّط للافتة',draw:()=>box(`<svg viewBox="0 0 120 70" role="img" aria-label="لافتة خطر لا تشغّل">${tagG(60,18)}${padlock(96,40,'var(--muted)')}</svg>`,160)},
  {h:'أسئلة الوحدة الخامسة',ref:'ص 108–110',html:`<p>الكتاب لا يضع إجابات للأسئلة؛ الإجابات المقترحة هنا مكتوبة من نص الكتاب. اضغط على السؤال لترى إجابته.</p>
   <h3 class="sm">أولاً: الأسئلة المقالية</h3>${ESSAY.map((x,i)=>QA(`س${i+1}: ${x[0]}`,x[1])).join('')}
   <h3 class="sm">أكمل مكان النقط بكلمة مناسبة <span class="ref">ص 108–110</span></h3>${FILL.map((x,i)=>QA(`${i+1}: ${x[0]}`,x[1])).join('')}
   <h3 class="sm">ضع علامة (√) أمام العبارة الصحيحة و(×) أمام العبارة غير الصحيحة <span class="ref">ص 110</span></h3>${TF.map((x,i)=>QA(`${i+1}: ${x[0]}`,`<b>(${x[1]})</b> ${x[2]}${x[3]?' <br>'+x[3]:''}`)).join('')}
   <p class="sub">ما بين القوسين المعقوفين [ ] زيادة منا لتوضيح العبارة.</p>`}
 ],
 lab:(el)=>lab5(el),
 quiz:[
  {q:'ما الغرض من نظام العزل وتعليق اللافتات (Lock-out / Tag-out)؟',o:['تسريع الصيانة','منع الحوادث التي قد تقع بسبب المعدة أثناء العمل بها بعزل مصادر الطاقة عنها','توفير الكهرباء','تشغيل المعدة عن بعد'],c:1,e:'«وضع نظام عمل آمن لعزل مصادر القوى… لمنع أية حوادث قد تقع بسبب المعدة أثناء العمل بها» (ص 102).'},
  {q:'ما «قفل السلامة» حسب الكتاب؟',o:['قفل له عدة مفاتيح يحملها كل العاملين','قفل له مفتاح واحد يبقى مع الشخص الذي عزل مصدر الطاقة','قفل يُفتح بالرقم السري لأي شخص','لافتة ورقية'],c:1,e:'له مفتاح واحد فقط يبقى مع المسؤول الذي عزل المصدر، فلا تعود الطاقة إلا بواسطته (ص 103).'},
  {q:'ما «الضغط المتبقي»؟',o:['ضغط الماء في الخزان','الطاقة المتبقية في توصيلات المعدة بعد عزل الطاقة المحركة عنها، مثل الهواء المضغوط في المواسير بعد قفل المحبس','ضغط الدم عند المصاب','ضغط زر الإيقاف'],c:1,e:'كما في تعريف الكتاب (ص 104)، ولذلك تأتي خطوة تفريغ الطاقة المتبقية (الخطوة 5).'},
  {q:'كيف يتأكد مسؤول الموقع أن العزل تم بصورة سليمة؟',o:['ينظر إلى اللوحة فقط','يحاول تشغيل المعدة بعد العزل للتأكد من عدم عملها، ثم يعيد مفاتيح التشغيل إلى Off','يسأل زميله','يلمس المحرك'],c:1,e:'الخطوة 4 (ص 104).'},
  {q:'إذا لم تتوفر الأقفال والسلاسل، ماذا يفعل حسب الكتاب؟',o:['يبدأ العمل مباشرة','يضع المفتاح الكهربائي على Off ويغلق المحابس، ويعلّق اللافتات','يلغي الصيانة','يقطع الأسلاك'],c:1,e:'البديلان في الخطوة 6: المفتاح على Off وإغلاق المحابس (ص 105)، ثم تعليق اللافتة (الخطوة 7).'},
  {q:'متى تُفك الأقفال وتُعاد الطاقة؟',o:['في أي وقت يطلبه العامل','بعد الانتهاء من العمل والتأكد من عدم وجود أي شخص بجوار المعدة','قبل تعبئة التصريح','عند بداية الوردية التالية فقط'],c:1,e:'الخطوة 13: بعد الانتهاء من العمل والتأكد من خلو المكان (ص 107).'}
 ]
});

})(PLCBOOK);
