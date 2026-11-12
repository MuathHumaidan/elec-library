/* السلامة الصناعية — الوحدة الأولى «القواعد العامة لسلامة المعدات الكهربائية والميكانيكية» (ص 1–8): u1-l1, u1-l2 */
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
    w.className='sf-fb'+(ok?'':' bad');w.innerHTML=`<b>${ok?'صحيح.':'ليس كذلك.'}</b> ${it[2]||''}`;w.hidden=false;done[i]=ok;
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

/* =====================================================================
   LESSON u1-l1 — مفهوم السلامة وأهدافها ومبادئها (ص 1–3)
   ===================================================================== */
const GOALS=['إنساني','اقتصادي','صحي'];
const PRINC=['قوة الإدارة الفاعلة في ترسيخ مفهوم السلامة.','إمكانية التنبؤ بوجود مصادر للخطر ربما تؤدي إلى إصابات وذلك للتحكم فيها والسيطرة عليها قبل حدوثها.','التخطيط للسلامة من خلال التنظيم والمتابعة والرقابة على متطلباتها.','تنظيم الهيكل الإداري للسلامة ومسؤولياتها وصلاحياتها.','تحديد الأخطاء وتحليل مسببات الحوادث للاستفادة من ذلك مستقبلاً في وضع أساليب المعالجة المناسبة.'];
const ORD=['الأول','الثاني','الثالث','الرابع','الخامس'];

function lab11(el){
 el.innerHTML=`<div class="grid sf-lab">
  <div class="panel c12"><h2>نشاط ١: صنّف الهدف <small>مبني على «أهداف السلامة» ص 2</small></h2>
   <p class="sub">المختبر في هذا الدرس نشاط: لكل موقف اختر الهدف الذي تحققه السلامة فيه أولاً. المواقف أمثلة من عندنا، والتصنيف من تعريف الأهداف في الكتاب.</p><div id="a1"></div></div>
  <div class="panel c7"><h2>نشاط ٢: رتّب المبادئ الخمسة <small>ص 3</small></h2><div id="a2"></div></div>
  <div class="panel c5"><h2>نشاط ٣: اكتشف الخطأ <small>ص 2–3</small></h2>
   <p class="sub">كتب متدرب هذه الفقرة من ذاكرته، وفيها <b>أربعة</b> أخطاء. اضغط كل عبارة تظنها خاطئة.</p><div id="a3"></div></div>
  <div class="panel c12"><h2>التجربة خطوة بخطوة</h2><ol class="steps" id="gs"></ol>${tries(['ابحث في كل موقف: من المتضرر أولاً؟ الإنسان (إنساني)، أم المنشأة والممتلكات (اقتصادي)، أم الصحة العامة والبيئة (صحي)؟','في الترتيب: المبدأ الأول عن الإدارة، والأخير عن تحليل الحوادث بعد وقوعها.','في الفقرة: قارن كل كلمة بنص الكتاب في تبويب «الشرح».'])}</div>
 </div>`;
 const $=s=>el.querySelector(s);const W={s:0,o:0,e:0};
 const S=stepsUI($('#gs'),[
  {t:'صنّف المواقف الثمانية',x:'أكمل نشاط ١ حتى تظهر نتيجتك.',done:()=>W.s},
  {t:'رتّب المبادئ الخمسة',x:'أكمل نشاط ٢ بالترتيب الذي ورد في الكتاب (ص 3).',done:()=>W.o},
  {t:'اكتشف الأخطاء الأربعة',x:'في نشاط ٣ اضغط العبارات الخاطئة حتى تجدها كلها.',done:()=>W.e>=4},
  {t:'راجع نفسك',x:'انتقل إلى «اختبر نفسك» وأجب عن أسئلة الدرس.'}]);
 sortAct($('#a1'),{cats:GOALS,items:[
  ['عامل يصعد إلى لوحة كهربائية، فنتأكد أن معه أدوات معزولة حتى لا يُصاب.',0,'حماية الإنسان من المخاطر المحيطة به وآثارها من إصابة أو وفاة = هدف إنساني.'],
  ['منع نشوب حريق في مستودع المصنع حتى لا تتلف البضائع والمعدات.',1,'حماية المنشآت والممتلكات بأنواعها، وهي قيم اقتصادية للمجتمع = هدف اقتصادي.'],
  ['منع تسرب مادة كيميائية من خزان إلى مياه الحي المجاور.',2,'المحافظة على الصحة العامة داخل بيئة العمل وخارجها من حادث يلوث البيئة = هدف صحي.'],
  ['تركيب حاجز حول آلة متحركة حتى لا تُقطع يد العامل.',0,'حماية الإنسان من الإصابة = هدف إنساني.'],
  ['حماية المحول الرئيس في المحطة من التلف بسبب قصر في الدائرة.',1,'المحول من ممتلكات المنشأة، وتلفه خسارة اقتصادية = هدف اقتصادي.'],
  ['تهوية الورشة حتى لا تتراكم أبخرة المذيبات فيمرض العمال على المدى الطويل.',2,'المحافظة على الصحة في بيئة العمل = هدف صحي.'],
  ['إخلاء المبنى سريعاً عند الحريق حتى لا يُتوفى أحد.',0,'منع الوفاة = هدف إنساني.'],
  ['صيانة دورية للمولدات حتى لا تتوقف ويتوقف الإنتاج.',1,'المحافظة على الممتلكات وقيمتها = هدف اقتصادي.']]},()=>{W.s=1;S.check()});
 orderAct($('#a2'),{intro:'اضغط المبادئ بترتيبها في الكتاب: الأول ثم الثاني … حتى الخامس.',steps:PRINC.map(p=>[p,'تذكّر: يبدأ الكتاب بالإدارة، ثم التنبؤ بالخطر، ثم التخطيط، ثم الهيكل الإداري، ثم تحليل الأخطاء والحوادث.']),done:'هذا ترتيب الكتاب: الإدارة ← التنبؤ ← التخطيط ← الهيكل الإداري ← تحليل الحوادث.'},()=>{W.o=1;S.check()});
 /* spot the error */
 const P=[['علم السلامة هو العلم الذي يسعى لحماية',0],['الإنسان',1,0],['من المخاطر والأضرار، والعمل على منع الخسائر في',0],['الممتلكات',1,0],['. وأهداف السلامة ثلاثة: إنسانية و',0],['استراتيجية',1,1,'الأهداف في الكتاب: إنسانية واقتصادية وصحية. «الأهداف الاستراتيجية» لم ترد في الشرح.'],['وصحية. والمبدأ الأول للسلامة',0],['قوة الإرادة الفاعلة',1,1,'الكتاب (ص 3): «قوة <b>الإدارة</b> الفاعلة في ترسيخ مفهوم السلامة».'],['في ترسيخ مفهوم السلامة، والمبدأ الثاني',0],['التنبؤ بمصادر الخطر',1,0],['للسيطرة عليها',0],['بعد حدوثها',1,1,'الكتاب: «للتحكم فيها والسيطرة عليها <b>قبل</b> حدوثها».'],['. ومن المبادئ أيضاً',0],['عدم تحليل مسببات الحوادث',1,1,'المبدأ الخامس هو «<b>تحديد</b> الأخطاء وتحليل مسببات الحوادث» للاستفادة منها مستقبلاً.'],['.',0]];
 const host=$('#a3');const draw3=()=>{W.e=0;host.innerHTML=`<div class="sf-para">${P.map((p,i)=>p[1]?`<button type="button" class="sf-ph" data-p="${i}">${p[0]}</button>`:p[0]).join(' ')}</div><div class="sf-fb" id="a3fb"></div><div class="sf-row"><button type="button" class="sf-b" data-rs>ابدأ من جديد</button></div>`;
  host.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{const p=P[+b.dataset.p],fb=host.querySelector('#a3fb');if(b.disabled)return;b.disabled=true;
   if(p[2]){b.classList.add('no');W.e++;fb.className='sf-fb';fb.innerHTML=`<b>وجدت خطأً (${W.e} من 4).</b> ${p[3]}`+(W.e===4?' <b>أحسنت، وجدت الأخطاء كلها.</b>':'');S.check()}
   else{b.classList.add('ok');fb.className='sf-fb warn';fb.innerHTML='<b>هذه العبارة صحيحة</b> كما في الكتاب. ابحث عن غيرها.'}});
  host.querySelector('[data-rs]').onclick=draw3};
 draw3()}

B.lesson({
 id:'u1-l1',unit:1,order:1,pages:'1–3',
 title:'مفهوم السلامة وأهدافها ومبادئها',
 summary:'تعريف علم السلامة، وأهدافه الثلاثة (إنسانية واقتصادية وصحية)، والمبادئ الخمسة التي تتحقق بها السلامة في المنشآت.',
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

  {st:1,short:'تمهيد الحقيبة',title:'تمهيد: لماذا ندرس السلامة الصناعية؟',ref:'قبل ص 1',
   q:'حرائق وانفجارات وإصابات كثيرة… هل كانت قدَراً لا مفر منه، أم كان يمكن تفاديها؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="التثقيف والتوعية مفتاح السلامة والأمان" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="السلامة والأمان: الغاية التي يقصدها التمهيد؛ فحياة الإنسان أغلى ما في الوجود، وسلامته هي الغاية بذاتها."><path d="M180 64 L236 86 V136 C236 176 210 200 180 214 C150 200 124 176 124 136 V86 Z" fill="#4FB3A9" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round"/><circle cx="180" cy="126" r="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M173 136 h14 l4 34 h-22 z" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round"/></g><g data-tip="التثقيف والتوعية: يقول التمهيد إنهما «مفتاح السلامة والأمان»؛ أي أن معرفة الخطر وطريقة تجنبه تفتح باب السلامة."><circle cx="76" cy="190" r="20" fill="#F2C14E" stroke="#2C4A40" stroke-width="3"/><circle cx="76" cy="190" r="7" fill="#DDEFE6" stroke="#2C4A40" stroke-width="2"/><path d="M94 181 L148 154" stroke="#2C4A40" stroke-width="9" stroke-linecap="round"/><path d="M94 181 L148 154" stroke="#F2C14E" stroke-width="4.5" stroke-linecap="round"/><path d="M128 164 l7 11 M139 158 l6 9" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/></g><g data-tip="مكامن الخطورة: الحريق والانفجارات والإصابات التي كان يمكن تفاديها لو أحسن المتعاملون مع الشبكة والمعدات الكهربائية التعامل معها."><path d="M284 146 L320 210 H248 Z" fill="#F2C14E" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round"/><path d="M288 160 L273 186 H285 L277 204 L298 176 H286 L294 160 Z" fill="#2C4A40"/></g><text x="76" y="240" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">التثقيف والتوعية</text><text x="180" y="240" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">السلامة والأمان</text><text x="284" y="240" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">مكامن الخطورة</text><text x="180" y="276" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">المعرفة تفتح باب السلامة</text></svg>`,
   cap:'التثقيف والتوعية هما مفتاح السلامة والأمان.<br><b>مرّر المؤشر على المفتاح والدرع والمثلث (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'يقول التمهيد إن كثيراً من حالات الحريق والانفجارات والإصابات كان يمكن تفاديها. متى؟',opts:[
     ['لو قلّ استخدام الأجهزة الكهربائية في البيوت والمصانع',false,'التمهيد لا يدعو إلى ترك الكهرباء؛ فهي «أكثر مظاهر التقدم شمولية».'],
     ['لو أحسن المتعاملون مع الشبكة والمعدات الكهربائية التعامل معها',true,'هذا نص التمهيد: بتأمين شروط سلامتها وتجنب مكامن خطورتها.'],
     ['لو اشترى الناس أجهزة أغلى ثمناً',false,'التمهيد يربط تفادي الحوادث بحسن التعامل والمعرفة، لا بثمن الجهاز.']]}}
   ],
   body:[
    {book:`<p>لقد دخلت الكهرباء كل مجالات الحياة العصرية، وهي أكثر مظاهر التقدم شمولية. وقد تنامى استخدام الأجهزة الكهربائية في شتى المجالات الصناعية والزراعية والصحية، وخصوصاً في المجالات المنزلية. ولكي يستطيع الإنسان اختيار واستخدام الأجهزة الكهربائية بالشكل الأمثل ويحافظ على سلامة الآخرين يزداد الشعور بالحاجة إلى الأمن وخاصة عند حدوث حالات مأساوية وقاضية؛ فإنه لابد له أن يكون على دراية بالحد الأدنى الضروري من أساسيات الكهرباء والسلامة الكهربائية.</p>
     <p>إن الكثير من حالات الحريق والانفجارات والإصابات المختلفة، كان يمكن تفاديها لو أحسن المتعاملون مع الشبكة والمعدات الكهربائية التعامل معها. من خلال تأمين شروط سلامتها، وتجنب مكامن خطورتها.</p>
     <p>لذلك فإن التثقيف والتوعية هما مفتاح السلامة والأمان.</p>
     <p>ولما كانت حياة الإنسان أغلى ما في الوجود، وسلامته هي الغاية بذاتها؛ فإن هذه الحقيبة تقدم دليلاً تفصيلياً لتبيين مواقع الأخطار الكهربائية وسبل تجنبها والآثار الناجمة عنها ومعالجتها، ومعرفة أنظمة الإنذار من الحرائق وإرشادات الصحة والسلامة المهنية.</p>`,ref:'قبل ص 1'},
    {tip:`<p>الحقيبة ست وحدات (من الفهرس وأغلفة الوحدات): (١) القواعد العامة لسلامة المعدات الكهربائية والميكانيكية، (٢) الصحة المهنية، (٣) مهمات السلامة للوقاية الشخصية، (٤) العدد اليدوية، (٥) الخطر الكهربائي على جسم الإنسان، (٦) أنظمة الإنذار من الحريق وإطفاء الحرائق.</p>`,title:'وحدات الحقيبة'},
    {watch:`<p>يقول التمهيد إن الحقيبة «أربع وحدات تدريبية» ويصف الثانية بأنها «الخطر الكهربائي» والثالثة «أنظمة الإنذار» والرابعة «الصحة والسلامة المهنية». هذا لا يطابق الحقيبة؛ فيها ست وحدات بالترتيب المذكور أعلاه (من الفهرس وأغلفة الوحدات).</p>`,fix:true},
    {title:'مختبر مصغّر: صح أم خطأ؟',widget:(el,B)=>DCML.tf(el,B,{intro:'اقرأ كل عبارة وقرّر: هل تطابق ما في التمهيد؟',items:[
     ['التثقيف والتوعية هما مفتاح السلامة والأمان.',true,'هذا نص التمهيد حرفياً.'],
     ['يكفي أن يعرف الفني الكهرباء؛ أما المستخدم في البيت فلا يحتاج شيئاً من السلامة الكهربائية.',false,'التمهيد يقول إن الإنسان لكي يستخدم الأجهزة بالشكل الأمثل ويحافظ على سلامة الآخرين لابد أن يكون على دراية بالحد الأدنى من أساسيات الكهرباء والسلامة الكهربائية.'],
     ['الحقيبة تعلّم مواقع الأخطار الكهربائية وسبل تجنبها، وأنظمة الإنذار من الحرائق، وإرشادات الصحة والسلامة المهنية.',true,'هذا ما يذكره التمهيد عن محتوى الحقيبة.'],
     ['الحقيبة أربع وحدات تدريبية.',false,'هكذا يقول التمهيد، لكن الحقيبة فعلاً ست وحدات (انظر «انتبه» أعلاه).']]})}
   ]},

  {st:2,short:'أهداف الوحدة',title:'الهدف العام والأهداف التفصيلية للوحدة الأولى',ref:'ص 1',
   q:'ماذا يجب أن تستطيع فعله بعد هذه الوحدة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="هدفا الوحدة الأولى" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E3ECF7"/><g data-tip="الهدف العام للوحدة: الإنجازات الأساسية لمعرفة القواعد العامة لسلامة المعدات الكهربائية والميكانيكية."><circle cx="180" cy="128" r="66" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><circle cx="180" cy="128" r="44" fill="#E8735A" stroke="#2C4A40" stroke-width="3"/><circle cx="180" cy="128" r="22" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><circle cx="180" cy="128" r="7" fill="#2C4A40"/></g><g data-tip="الهدف التفصيلي الأول: أن يحدد المتدرب الهدف من السلامة ومفهومها والمبادئ الأساسية للسلامة — هذا الدرس."><path d="M62 70 L170 122" stroke="#2C4A40" stroke-width="4" stroke-linecap="round"/><path d="M170 122 l-14 -2 M170 122 l-6 -12" stroke="#2C4A40" stroke-width="4" stroke-linecap="round"/><circle cx="56" cy="92" r="14" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><text x="56" y="97" text-anchor="middle" font-size="14" font-weight="700" fill="#FBF6EE">١</text></g><g data-tip="الهدف التفصيلي الثاني: أن يذكر المتدرب القواعد العامة في تركيب وصيانة الأجهزة — الدرس التالي."><path d="M298 70 L190 122" stroke="#2C4A40" stroke-width="4" stroke-linecap="round"/><path d="M190 122 l14 -2 M190 122 l6 -12" stroke="#2C4A40" stroke-width="4" stroke-linecap="round"/><circle cx="304" cy="92" r="14" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><text x="304" y="97" text-anchor="middle" font-size="14" font-weight="700" fill="#2C4A40">٢</text></g><text x="100" y="230" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">مفهوم السلامة</text><text x="100" y="248" text-anchor="middle" font-size="12" fill="#2C4A40">وأهدافها ومبادئها</text><text x="260" y="230" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">قواعد التركيب</text><text x="260" y="248" text-anchor="middle" font-size="12" fill="#2C4A40">والصيانة</text><text x="180" y="286" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">هدف عام وهدفان تفصيليان</text></svg>`,
   cap:'للوحدة الأولى هدف عام واحد وهدفان تفصيليان.<br><b>مرّر المؤشر على الهدف والسهمين (أو المسها في الجوال) لتعرف كل هدف.</b>',
   side:[
    {predict:{q:'أي مما يلي <b>ليس</b> من الأهداف التفصيلية للوحدة الأولى؟',opts:[
     ['أن يحدد المتدرب الهدف من السلامة ومفهومها ومبادئها',false,'هذا الهدف التفصيلي الأول.'],
     ['أن يذكر المتدرب القواعد العامة في تركيب وصيانة الأجهزة',false,'هذا الهدف التفصيلي الثاني.'],
     ['أن يسعف المتدرب مصاباً بصدمة كهربائية',true,'الإسعاف موضوع الوحدة الخامسة، لا الأولى.']]}}
   ],
   body:[
    {book:`<p><b>الهدف العام للوحدة:</b><br>الإنجازات الأساسية لمعرفة القواعد العامة لسلامة المعدات الكهربائية والميكانيكية</p>
     <p><b>الأهداف التفصيلية:</b></p><ol><li>أن يحدد المتدرب الهدف من السلامة ومفهومها والمبادئ الأساسية للسلامة.</li><li>أن يذكر المتدرب القواعد العامة في تركيب وصيانة الأجهزة</li></ol>`,ref:'ص 1'},
    {tip:`<p>الهدف الأول هو موضوع هذا الدرس (المحطات من ٣ إلى ٥). والهدف الثاني موضوع الدرس التالي «قواعد التركيب والفحص والتأريض والتعريف».</p>`}
   ]},

  {st:3,short:'مفهوم السلامة',title:'مفهوم السلامة',ref:'ص 2',
   q:'إذا حمينا العامل وتركنا الآلة تحترق… هل حققنا السلامة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="السلامة تحمي الإنسان والممتلكات من الخطر" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="مظلة السلامة: مجموعة التدابير والإجراءات الوقائية، والأساليب الهندسية والتنظيمية والتثقيفية، التي تحمي الإنسان والممتلكات معاً."><path d="M70 130 Q180 30 290 130 Z" fill="#4FB3A9" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round"/><path d="M180 130 V150" stroke="#2C4A40" stroke-width="3"/></g><g data-tip="الإنسان: أول ما يسعى علم السلامة إلى حمايته من المخاطر والأضرار."><circle cx="130" cy="166" r="13" fill="#E8735A" stroke="#2C4A40" stroke-width="3"/><path d="M110 236 V198 a20 18 0 0 1 40 0 V236 Z" fill="#E8735A" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round"/></g><g data-tip="الممتلكات: المباني والآلات والمعدات؛ يعمل علم السلامة على منع الخسائر فيها."><path d="M196 236 V186 L218 170 V186 L240 170 V186 L262 170 V236 Z" fill="#F2C14E" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round"/><rect x="220" y="208" width="18" height="28" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/></g><g data-tip="مصدر الخطر: كل ما قد يسبب إصابة أو خسارة. من تعريفات السلامة: التحرر من وجود مصدر الخطر، وهي الدرجة النسبية للحماية منه."><path d="M300 60 L284 92 H298 L288 118 L316 82 H302 L312 60 Z" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round"/></g><text x="130" y="258" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">الإنسان</text><text x="229" y="258" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">الممتلكات</text><text x="180" y="290" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">السلامة تحمي الاثنين معاً</text></svg>`,
   cap:'تعريفات السلامة كلها تذكر الإنسان والممتلكات معاً.<br><b>مرّر المؤشر على المظلة والإنسان والمبنى والصاعقة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'علم السلامة هو العلم الذي يسعى إلى…',opts:[
     ['حماية الإنسان من المخاطر والأضرار، ومنع الخسائر في الممتلكات',true,'هذا تعريف الكتاب (ص 2): الإنسان والممتلكات معاً.'],
     ['حماية الإنسان فقط',false,'التعريف يضيف «والعمل على منع الخسائر في الممتلكات».'],
     ['زيادة الإنتاج في المصنع',false,'زيادة الإنتاج ليست تعريف السلامة، وإن كانت السلامة تحمي الإنتاج من التوقف.']]}}
   ],
   body:[
    {book:`<p><b>تعريف علم السلامة:</b><br>هو العلم الذي يسعى لحماية الإنسان من المخاطر والأضرار، والعمل على منع الخسائر في الممتلكات.</p>
     <p>وهناك عدة تعريفات منها:</p><ol><li>هي مجموعة التدابير والإجراءات الوقائية والقصد منها حماية الأرواح والممتلكات من المخاطر المحيطة.</li><li>هي مجموعة الأساليب الهندسية والتنظيمية والتثقيفية التي تهدف إلى حماية الإنسان والممتلكات.</li><li>تعرف عادة بالتحرر من وجود مصدر الخطر، وهي الدرجة النسبية للحماية من الخطر.</li></ol>`,ref:'ص 2'},
    {tip:`<p>لاحظ أن التعريفات كلها تذكر شيئين معاً: <b>الإنسان</b> و<b>الممتلكات</b>. فالسلامة لا تعني حماية العامل فقط، بل حماية الآلات والمباني أيضاً، ومنها جاءت الأهداف الثلاثة في المحطة التالية.</p><p>وفي التعريف الثاني ثلاث وسائل: <b>هندسية</b> (مثل حاجز حول آلة)، و<b>تنظيمية</b> (مثل قواعد وتصاريح عمل)، و<b>تثقيفية</b> (مثل تدريب العمال).</p>`},
    {add:`<p>كلمة «الدرجة النسبية» في التعريف الثالث تعني أن الخطر نادراً ما يصل إلى الصفر؛ فالمطلوب أن نقلله قدر الإمكان. لذلك نقارن بين طريقتين للعمل فنقول: هذه «أكثر أماناً» من تلك.</p>`},
    {title:'مختبر مصغّر: صح أم خطأ؟',widget:(el,B)=>DCML.tf(el,B,{intro:'قارن كل عبارة بتعريفات الكتاب.',items:[
     ['السلامة تعني حماية العامل فقط، أما الآلات والمباني فليست من شأنها.',false,'التعريف يقول: «والعمل على منع الخسائر في الممتلكات».'],
     ['من تعريفات السلامة: مجموعة الأساليب الهندسية والتنظيمية والتثقيفية التي تهدف إلى حماية الإنسان والممتلكات.',true,'هذا التعريف الثاني في الكتاب.'],
     ['التدابير في تعريف السلامة إجراءات نتخذها بعد وقوع الحادث فقط.',false,'التعريف الأول يقول «التدابير والإجراءات <b>الوقائية</b>»، والوقاية تكون قبل وقوع الحادث.'],
     ['تعرف السلامة أيضاً بالتحرر من وجود مصدر الخطر، وهي الدرجة النسبية للحماية منه.',true,'هذا التعريف الثالث في الكتاب.']]})}
   ]},

  {st:4,short:'أهداف السلامة',title:'أهداف السلامة',ref:'ص 2',
   q:'حريق في مستودع لم يُصب فيه أحد… فلماذا نعدّه فشلاً في السلامة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="أهداف السلامة الثلاثة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBEBDD"/><g data-tip="أهداف إنسانية: تهدف السلامة بالدرجة الأولى إلى حماية الإنسان من المخاطر المحيطة به، وآثارها المترتبة على الإصابات أو الوفاة."><circle cx="180" cy="66" r="13" fill="#E8735A" stroke="#2C4A40" stroke-width="3"/><path d="M160 130 V98 a20 18 0 0 1 40 0 V130 Z" fill="#E8735A" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round"/></g><g data-tip="أهداف اقتصادية: حماية المنشآت والممتلكات بأنواعها، والتي تشكل بحد ذاتها قيماً اقتصادية للمجتمع وأفراده."><path d="M62 236 V190 L82 176 V190 L102 176 V190 L122 176 V236 Z" fill="#F2C14E" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round"/><rect x="108" y="150" width="9" height="30" fill="#2C4A40"/><rect x="84" y="210" width="16" height="26" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/></g><g data-tip="أهداف صحية: المحافظة على الصحة العامة سواء في بيئة العمل أو خارجه من جراء وقوع حادث قد يتسبب في تلوث البيئة أو إصابة الأفراد."><path d="M268 168 C248 196 244 210 244 220 a24 24 0 0 0 48 0 C292 210 288 196 268 168 Z" fill="#4FB3A9" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round"/><path d="M256 222 h24 M268 210 v24" stroke="#FBF6EE" stroke-width="5" stroke-linecap="round"/></g><text x="180" y="150" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">إنسانية</text><text x="92" y="262" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">اقتصادية</text><text x="268" y="262" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">صحية</text><text x="180" y="290" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">ثلاثة أهداف للسلامة</text></svg>`,
   cap:'الإنسان أولاً، ثم الممتلكات، ثم الصحة العامة والبيئة.<br><b>مرّر المؤشر على الإنسان والمصنع والقطرة (أو المسها في الجوال) لتعرف كل هدف.</b>',
   side:[
    {predict:{q:'حماية المنشآت والممتلكات بأنواعها من أهداف السلامة…',opts:[
     ['الصحية',false,'الأهداف الصحية عن الصحة العامة وتلوث البيئة.'],
     ['الإنسانية',false,'الأهداف الإنسانية عن حماية الإنسان من الإصابة والوفاة.'],
     ['الاقتصادية',true,'الكتاب (ص 2): «أهداف اقتصادية: ويقصد بها حماية المنشآت والممتلكات بأنواعها».']]}}
   ],
   body:[
    {book:`<ol><li>أهداف إنسانية: تهدف السلامة بالدرجة الأولى إلى حماية الإنسان من المخاطر المحيطة به، وآثارها المترتبة على الإصابات أو الوفاة لا قدر الله.</li>
     <li>أهداف اقتصادية: ويقصد بها حماية المنشآت والممتلكات بأنواعها، والتي تشكل بحد ذاتها قيماً اقتصادية للمجتمع وأفراده.</li>
     <li>أهداف صحية: ويقصد بها المحافظة على الصحة العامة سواء في بيئة العمل أو خارجه من جراء وقوع حادث قد يتسبب في تلوث البيئة أو إصابة الأفراد.</li></ol>`,ref:'ص 2'},
    {tip:`<p>كلمة «بالدرجة الأولى» تعني أن الإنسان مقدَّم على كل شيء. والهدف الصحي ينظر أبعد من الورشة: حادث داخل المصنع قد يلوث البيئة خارجه فيضر أناساً لا يعملون فيه.</p>`},
    {watch:`<p>في أسئلة الوحدة (ص 8) عبارة عن «الأهداف الإستراتيجية»؛ هذه لم ترد في الشرح أصلاً. الأهداف في الكتاب ثلاثة فقط: إنسانية واقتصادية وصحية.</p>`},
    {title:'مختبر مصغّر: صنّف الهدف',widget:(el,B)=>DCML.sort(el,B,{intro:'المواقف أمثلة من عندنا، والتصنيف من تعريف الأهداف في الكتاب. لكل موقف: ما الهدف الذي يتحقق أولاً؟',cats:['إنساني','اقتصادي','صحي'],items:[
     ['فصل التيار قبل إصلاح الإنارة حتى لا يُصعق الفني.',0,'حماية الإنسان من الإصابة أو الوفاة = هدف إنساني.'],
     ['التخلص الآمن من زيوت المحولات القديمة حتى لا تلوث التربة والمياه.',2,'منع تلوث البيئة والمحافظة على الصحة العامة خارج بيئة العمل = هدف صحي.'],
     ['تركيب طفاية بجوار لوحة التوزيع حتى لا يمتد حريق صغير إلى المبنى ومعداته.',1,'حماية المنشأة والممتلكات = هدف اقتصادي.'],
     ['منع وصول غاز متسرب من المصنع إلى سكان الحي المجاور.',2,'المحافظة على الصحة العامة خارج بيئة العمل = هدف صحي.'],
     ['حماية مضخات المحطة من التلف حتى لا يتوقف العمل ويخسر المصنع.',1,'المضخات ممتلكات، وتلفها خسارة اقتصادية = هدف اقتصادي.']]})}
   ]},

  {st:5,short:'المبادئ الخمسة',title:'١-١ المبادئ الأساسية للسلامة العامة',ref:'ص 3',
   q:'من أين تبدأ السلامة في المصنع: من العامل، أم من المدير؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="المبادئ الخمسة للسلامة درجات سلم" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E3ECF7"/><g data-tip="المبدأ الأول: قوة الإدارة الفاعلة في ترسيخ مفهوم السلامة."><rect x="256" y="214" width="52" height="34" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><text x="282" y="237" text-anchor="middle" font-size="15" font-weight="700" fill="#FBF6EE">١</text></g><g data-tip="المبدأ الثاني: إمكانية التنبؤ بوجود مصادر للخطر ربما تؤدي إلى إصابات، للتحكم فيها والسيطرة عليها قبل حدوثها."><rect x="204" y="184" width="52" height="64" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><text x="230" y="207" text-anchor="middle" font-size="15" font-weight="700" fill="#2C4A40">٢</text></g><g data-tip="المبدأ الثالث: التخطيط للسلامة من خلال التنظيم والمتابعة والرقابة على متطلباتها."><rect x="152" y="154" width="52" height="94" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5"/><text x="178" y="177" text-anchor="middle" font-size="15" font-weight="700" fill="#FBF6EE">٣</text></g><g data-tip="المبدأ الرابع: تنظيم الهيكل الإداري للسلامة ومسؤولياتها وصلاحياتها."><rect x="100" y="124" width="52" height="124" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><text x="126" y="147" text-anchor="middle" font-size="15" font-weight="700" fill="#FBF6EE">٤</text></g><g data-tip="المبدأ الخامس: تحديد الأخطاء وتحليل مسببات الحوادث للاستفادة من ذلك مستقبلاً في وضع أساليب المعالجة المناسبة."><rect x="48" y="94" width="52" height="154" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><text x="74" y="117" text-anchor="middle" font-size="15" font-weight="700" fill="#2C4A40">٥</text></g><text x="282" y="270" text-anchor="middle" font-size="12" fill="#2C4A40">الإدارة</text><text x="230" y="270" text-anchor="middle" font-size="12" fill="#2C4A40">التنبؤ</text><text x="178" y="270" text-anchor="middle" font-size="12" fill="#2C4A40">التخطيط</text><text x="126" y="270" text-anchor="middle" font-size="12" fill="#2C4A40">الهيكل</text><text x="74" y="270" text-anchor="middle" font-size="12" fill="#2C4A40">التحليل</text><text x="214" y="86" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">خمسة مبادئ أساسية</text></svg>`,
   cap:'المبادئ الخمسة بترتيبها في الكتاب، من الإدارة إلى تحليل الحوادث.<br><b>مرّر المؤشر على كل درجة (أو المسها في الجوال) لتقرأ المبدأ.</b>',
   side:[
    {predict:{q:'المبدأ الثاني يطلب التنبؤ بمصادر الخطر للسيطرة عليها…',opts:[
     ['بعد وقوع الإصابة',false,'التنبؤ معناه أن نتوقع الخطر قبل أن يقع.'],
     ['أثناء التحقيق في الحادث',false,'التحقيق وتحليل الحوادث هو المبدأ الخامس.'],
     ['قبل حدوثها',true,'الكتاب (ص 3): «للتحكم فيها والسيطرة عليها قبل حدوثها».']]}}
   ],
   body:[
    {book:`<p>بعد استعراض تعريف السلامة وأهدافها فإنه يجدر بنا أن نلقي الضوء على المبادئ الأساسية التي من خلالها تتحقق أهداف السلامة العامة في المنشآت العامة والخاصة، وذلك من خلال الأساليب المتطورة التي تستلزم السعي الجاد لمعرفة كل ما يستجد في مجال السلامة ومتطلباتها الحديثة ولهذا فإن هناك خمسة مبادئ أساسية للسلامة العامة وهي:</p>
     <ol><li>المبدأ الأول: قوة الإدارة الفاعلة في ترسيخ مفهوم السلامة.</li><li>المبدأ الثاني: إمكانية التنبؤ بوجود مصادر للخطر ربما تؤدي إلى إصابات وذلك للتحكم فيها والسيطرة عليها قبل حدوثها.</li><li>المبدأ الثالث: التخطيط للسلامة من خلال التنظيم والمتابعة والرقابة على متطلباتها.</li><li>المبدأ الرابع: تنظيم الهيكل الإداري للسلامة ومسؤولياتها وصلاحياتها.</li><li>المبدأ الخامس: تحديد الأخطاء وتحليل مسببات الحوادث للاستفادة من ذلك مستقبلاً في وضع أساليب المعالجة المناسبة.</li></ol>`,ref:'ص 3'},
    {tip:`<p>يمكن تذكّر المبادئ بهذا التسلسل: <b>إدارة</b> مقتنعة بالسلامة ← <b>تتنبأ</b> بالخطر قبل وقوعه ← <b>تخطط</b> وتتابع ← <b>توزع المسؤوليات</b> في هيكل إداري ← <b>تتعلم</b> من الأخطاء والحوادث.</p>`},
    {watch:`<p>في أسئلة الوحدة (ص 8) عبارة «قوة <b>الإرادة</b> الفاعلة»؛ والمبدأ في الشرح «قوة <b>الإدارة</b> الفاعلة». انتبه للفرق بين الكلمتين.</p>`},
    {add:`<p>مثال من الواقع على المبدأ الخامس: كثير من المصانع تسجّل «الحوادث الوشيكة» أيضاً، أي المواقف التي كادت تسبب إصابة ولم تسببها؛ لأن تحليلها يكشف الخطر قبل أن يقع حادث حقيقي.</p>`},
    {title:'مختبر مصغّر: أي مبدأ هذا؟',widget:(el,B)=>DCML.cases(el,B,{intro:'المواقف أمثلة من عندنا. اختر المبدأ الذي يطبقه كل موقف.',cases:[
     {q:'مدير المصنع يحضر اجتماعات السلامة بنفسه، ويُلزم جميع الأقسام بقواعدها.',opts:[['المبدأ الأول: قوة الإدارة الفاعلة',true,'الإدارة هي التي ترسّخ مفهوم السلامة.'],['المبدأ الثالث: التخطيط',false,'لا يوجد هنا خطة أو جدول متابعة، بل التزام الإدارة نفسها.'],['المبدأ الخامس: تحليل الحوادث',false,'لم يقع حادث يُحلَّل.']]},
     {q:'قبل تشغيل خط إنتاج جديد، يتجول فريق في الموقع ويكتب كل ما قد يسبب إصابة.',opts:[['المبدأ الرابع: الهيكل الإداري',false,'لا يتحدث الموقف عن توزيع مسؤوليات.'],['المبدأ الثاني: التنبؤ بمصادر الخطر',true,'يتوقعون الخطر للسيطرة عليه قبل حدوثه.'],['المبدأ الخامس: تحليل الحوادث',false,'التحليل يكون لحادث وقع؛ وهنا لم يقع شيء بعد.']]},
     {q:'تعيين مسؤول سلامة لكل قسم، وتحديد ما يحق له أن يوقفه من أعمال.',opts:[['المبدأ الثاني: التنبؤ',false,'الموقف عن تنظيم المسؤوليات، لا عن توقع الخطر.'],['المبدأ الأول: قوة الإدارة',false,'الأقرب هنا تنظيم الهيكل ومسؤولياته وصلاحياته.'],['المبدأ الرابع: تنظيم الهيكل الإداري ومسؤولياته وصلاحياته',true,'مسؤول لكل قسم + صلاحيات محددة = هيكل إداري للسلامة.']]},
     {q:'بعد سقوط عامل من سلّم، درست اللجنة أسباب الحادث وكتبت توصيات حتى لا يتكرر.',opts:[['المبدأ الخامس: تحديد الأخطاء وتحليل مسببات الحوادث',true,'للاستفادة من ذلك مستقبلاً في وضع أساليب المعالجة المناسبة.'],['المبدأ الثاني: التنبؤ',false,'الحادث وقع فعلاً، فهذا تحليل لا تنبؤ.'],['المبدأ الثالث: التخطيط',false,'التوصيات قد تدخل الخطة لاحقاً، لكن العمل نفسه تحليل للحادث.']]}]})}
   ]},

  {recap:[
   'علم السلامة: يسعى لحماية الإنسان من المخاطر والأضرار، والعمل على منع الخسائر في الممتلكات (ص 2).',
   'للسلامة ثلاثة أهداف: إنسانية (الإنسان أولاً)، واقتصادية (المنشآت والممتلكات)، وصحية (الصحة العامة والبيئة) (ص 2).',
   'خمسة مبادئ: الإدارة الفاعلة ← التنبؤ بالخطر قبل حدوثه ← التخطيط والمتابعة والرقابة ← الهيكل الإداري ومسؤولياته ← تحليل الأخطاء والحوادث (ص 3).',
   'التثقيف والتوعية هما مفتاح السلامة والأمان (التمهيد).']}
],
 theory:[
  {h:'تمهيد الحقيبة',ref:'قبل ص 1',html:`<p>لقد دخلت الكهرباء كل مجالات الحياة العصرية، وهي أكثر مظاهر التقدم شمولية. وقد تنامى استخدام الأجهزة الكهربائية في شتى المجالات الصناعية والزراعية والصحية، وخصوصاً في المجالات المنزلية. ولكي يستطيع الإنسان اختيار واستخدام الأجهزة الكهربائية بالشكل الأمثل ويحافظ على سلامة الآخرين … فإنه لابد له أن يكون على دراية بالحد الأدنى الضروري من أساسيات الكهرباء والسلامة الكهربائية.</p>
   <p>إن الكثير من حالات الحريق والانفجارات والإصابات المختلفة، كان يمكن تفاديها لو أحسن المتعاملون مع الشبكة والمعدات الكهربائية التعامل معها، من خلال تأمين شروط سلامتها، وتجنب مكامن خطورتها. لذلك فإن <b>التثقيف والتوعية هما مفتاح السلامة والأمان</b>.</p>
   <p>ولما كانت حياة الإنسان أغلى ما في الوجود، وسلامته هي الغاية بذاتها؛ فإن هذه الحقيبة تقدم دليلاً تفصيلياً لتبيين مواقع الأخطار الكهربائية وسبل تجنبها والآثار الناجمة عنها ومعالجتها، ومعرفة أنظمة الإنذار من الحرائق وإرشادات الصحة والسلامة المهنية.</p>
   <p>والحقيبة ست وحدات: (١) القواعد العامة لسلامة المعدات الكهربائية والميكانيكية، (٢) الصحة المهنية، (٣) مهمات السلامة للوقاية الشخصية، (٤) العدد اليدوية، (٥) الخطر الكهربائي على جسم الإنسان، (٦) أنظمة الإنذار من الحريق وإطفاء الحرائق.</p>`},
  {err:'<span class="fixnote">يقول التمهيد إن الحقيبة «أربع وحدات تدريبية» ويصف الثانية بأنها «الخطر الكهربائي» والثالثة «أنظمة الإنذار» والرابعة «الصحة والسلامة المهنية». هذا لا يطابق الحقيبة؛ فيها ست وحدات بالترتيب المذكور أعلاه (من الفهرس وأغلفة الوحدات).</span>'},
  {h:'الهدف العام والأهداف التفصيلية للوحدة الأولى',ref:'ص 1',html:`<p><b>الهدف العام للوحدة:</b> الإنجازات الأساسية لمعرفة القواعد العامة لسلامة المعدات الكهربائية والميكانيكية.</p>
   <p><b>الأهداف التفصيلية:</b></p><ol><li>أن يحدد المتدرب الهدف من السلامة ومفهومها والمبادئ الأساسية للسلامة.</li><li>أن يذكر المتدرب القواعد العامة في تركيب وصيانة الأجهزة.</li></ol>`},
  {h:'مفهوم السلامة',ref:'ص 2',html:`<p><b>تعريف علم السلامة:</b> هو العلم الذي يسعى <b>لحماية الإنسان من المخاطر والأضرار</b>، والعمل على <b>منع الخسائر في الممتلكات</b>.</p>
   <p>وهناك عدة تعريفات منها:</p><ol><li>هي مجموعة التدابير والإجراءات الوقائية والقصد منها حماية الأرواح والممتلكات من المخاطر المحيطة.</li><li>هي مجموعة الأساليب الهندسية والتنظيمية والتثقيفية التي تهدف إلى حماية الإنسان والممتلكات.</li><li>تعرف عادة بالتحرر من وجود مصدر الخطر، وهي الدرجة النسبية للحماية من الخطر.</li></ol>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> لاحظ أن التعريفات كلها تذكر شيئين معاً: <b>الإنسان</b> و<b>الممتلكات</b>. فالسلامة لا تعني حماية العامل فقط، بل حماية الآلات والمباني أيضاً، ومنها جاءت الأهداف الثلاثة التالية.'},
  {h:'أهداف السلامة',ref:'ص 2',html:`<ol><li><b>أهداف إنسانية:</b> تهدف السلامة بالدرجة الأولى إلى حماية الإنسان من المخاطر المحيطة به، وآثارها المترتبة على الإصابات أو الوفاة لا قدر الله.</li>
   <li><b>أهداف اقتصادية:</b> ويقصد بها حماية المنشآت والممتلكات بأنواعها، والتي تشكل بحد ذاتها قيماً اقتصادية للمجتمع وأفراده.</li>
   <li><b>أهداف صحية:</b> ويقصد بها المحافظة على الصحة العامة سواء في بيئة العمل أو خارجه من جراء وقوع حادث قد يتسبب في تلوث البيئة أو إصابة الأفراد.</li></ol>`},
  {widget:el=>{el.innerHTML=`<figure class="fig"><div class="svgbox" style="max-width:520px;margin-inline:auto">${goalsSVG()}</div><figcaption>رسم توضيحي (ليس من الكتاب): أهداف السلامة الثلاثة كما يعددها الكتاب <span class="ref">ص 2</span></figcaption></figure>`}},
  {h:'١-١ المبادئ الأساسية للسلامة العامة',ref:'ص 3',html:`<p>بعد استعراض تعريف السلامة وأهدافها فإنه يجدر بنا أن نلقي الضوء على المبادئ الأساسية التي من خلالها تتحقق أهداف السلامة العامة في المنشآت العامة والخاصة، وذلك من خلال الأساليب المتطورة التي تستلزم السعي الجاد لمعرفة كل ما يستجد في مجال السلامة ومتطلباتها الحديثة، ولهذا فإن هناك <b>خمسة مبادئ أساسية</b> للسلامة العامة وهي:</p>
   <ol>${PRINC.map((p,i)=>`<li><b>المبدأ ${ORD[i]}:</b> ${p}</li>`).join('')}</ol>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> يمكن تذكّر المبادئ بهذا التسلسل: <b>إدارة</b> مقتنعة بالسلامة ← <b>تتنبأ</b> بالخطر قبل وقوعه ← <b>تخطط</b> وتتابع ← <b>توزع المسؤوليات</b> في هيكل إداري ← <b>تتعلم</b> من الأخطاء والحوادث.'}
 ],
 lab:(el)=>lab11(el),
 quiz:[
  {q:'علم السلامة هو العلم الذي يسعى إلى:',o:['زيادة الإنتاج فقط','حماية الإنسان من المخاطر والأضرار ومنع الخسائر في الممتلكات','حماية الآلات فقط','وضع العقوبات على العمال'],c:1,e:'هذا تعريف الكتاب (ص 2).'},
  {q:'حماية المنشآت والممتلكات بأنواعها من أهداف السلامة:',o:['الإنسانية','الاقتصادية','الصحية','الاستراتيجية'],c:1,e:'«أهداف اقتصادية: ويقصد بها حماية المنشآت والممتلكات بأنواعها» (ص 2).'},
  {q:'منع تلوث البيئة بعد حادث في المصنع يحقق هدفاً:',o:['إنسانياً','اقتصادياً','صحياً','إدارياً'],c:2,e:'الأهداف الصحية: المحافظة على الصحة العامة في بيئة العمل أو خارجها من حادث قد يلوث البيئة (ص 2).'},
  {q:'كم عدد المبادئ الأساسية للسلامة العامة في الكتاب؟',o:['ثلاثة','أربعة','خمسة','سبعة'],c:2,e:'«هناك خمسة مبادئ أساسية للسلامة العامة» (ص 3).'},
  {q:'المبدأ الأول من مبادئ السلامة هو:',o:['تحليل مسببات الحوادث','قوة الإدارة الفاعلة في ترسيخ مفهوم السلامة','التخطيط للسلامة','تنظيم الهيكل الإداري'],c:1,e:'المبدأ الأول: قوة الإدارة الفاعلة في ترسيخ مفهوم السلامة (ص 3).'},
  {q:'التنبؤ بوجود مصادر للخطر يكون للسيطرة عليها:',o:['بعد وقوع الإصابة','قبل حدوثها','أثناء التحقيق في الحادث','عند شراء المعدات فقط'],c:1,e:'المبدأ الثاني: «للتحكم فيها والسيطرة عليها قبل حدوثها» (ص 3).'}
 ]
});
function goalsSVG(){const C=[['--blue','إنسانية','حماية الإنسان من الإصابة والوفاة'],['--live','اقتصادية','حماية المنشآت والممتلكات'],['--on','صحية','الصحة العامة وعدم تلوث البيئة']];
 let s=`<svg viewBox="0 0 520 200" role="img" aria-label="أهداف السلامة الثلاثة">`;
 s+=`<rect x="185" y="10" width="150" height="40" rx="10" style="fill:var(--head)"/>${svT(260,36,'أهداف السلامة',{c:'',st:'fill:#fff;font-size:15px'})}`;
 C.forEach((c,i)=>{const x=90+i*170;s+=`<path d="M260 50V70H${x}V92" style="fill:none;stroke:var(--muted);stroke-width:1.5"/><rect x="${x-80}" y="92" width="160" height="96" rx="12" style="fill:var(--surface-2);stroke:var(${c[0]});stroke-width:2"/>${svT(x,122,c[1],{st:`font-size:15px;fill:var(${c[0]})`})}${svT(x,150,c[2].split(' ').slice(0,3).join(' '),{st:'font-size:12px'})}${svT(x,170,c[2].split(' ').slice(3).join(' '),{st:'font-size:12px'})}`});
 return s+'</svg>'}

/* =====================================================================
   LESSON u1-l2 — قواعد التركيب والفحص والتأريض والتعريف (ص 3–8)
   ===================================================================== */
const LIST_A=['قفازات المطاط','أكمام المطاط','العدد اليدوية المعزولة','حصير المطاط المتنقل','غلاف المطاط','العصا العازلة','قابضات المصهرات المعزولة','أدوات التأريض','المركبات ذات الأرضية المعزولة'];
const LIST_B=['أدوات الاختبار','أدوات التأريض','العصا اللازمة لتحريك السكاكين الكهربائية','قابضات المصهرات','العدد اليدوية المعزولة','المركبات ذات الأرضيات العازلة'];
const VOLTS=[220,380,600,4160,13800,15000,33000,132000];

function panelSVG(s){
 /* scene 520×300: floor y=260; panel at x 330..450; clearance zone in front (to the left) */
 const W=520,fy=262,px=290,pw=120,ph=190,py=fy-ph,cm=1.25,zw=Math.max(20,s.w*cm),zh=s.h*100*0.95/1.0*0.95;
 const zH=Math.min(210,s.h*80),zx=px-zw,zy=fy-zH,okW=s.w>=90,okH=s.h>=2;
 let g=`<svg viewBox="0 50 ${W} 250" role="img" aria-label="لوحة كهربائية ومكان العمل أمامها">`;
 g+=`<rect x="0" y="${fy}" width="${W}" height="38" style="fill:var(--surface-2)"/><path d="M0 ${fy}H${W}" style="stroke:var(--fg);stroke-width:1.5"/>`;
 /* clearance zone */
 g+=`<rect x="${zx.toFixed(1)}" y="${zy.toFixed(1)}" width="${zw.toFixed(1)}" height="${zH.toFixed(1)}" style="fill:${okW&&okH?'var(--on-soft)':'var(--stop-soft)'};stroke:${okW&&okH?'var(--on)':'var(--stop)'};stroke-width:1.6;stroke-dasharray:6 4"/>`;
 g+=`<path d="M${zx.toFixed(1)} ${fy+16}H${px}" style="stroke:var(--fg);stroke-width:1"/><path d="M${zx.toFixed(1)} ${fy+11}v10M${px} ${fy+11}v10" style="stroke:var(--fg)"/>`;
 g+=svT((zx+px)/2,fy+32,'العرض '+s.w+' cm',{st:`font-size:12px;fill:${okW?'var(--on)':'var(--stop)'}`});
 g+=`<path d="M${(zx-10).toFixed(1)} ${zy.toFixed(1)}V${fy}" style="stroke:var(--fg);stroke-width:1"/>`;
 g+=svT(zx-14,zy+zH/2,s.h.toFixed(1)+' m',{a:'end',st:`font-size:12px;fill:${okH?'var(--on)':'var(--stop)'}`});
 /* worker */
 const wx=zx+zw/2;g+=`<g style="stroke:var(--fg);stroke-width:3;fill:none;stroke-linecap:round"><circle cx="${wx}" cy="${fy-150}" r="13" style="fill:var(--surface)"/><path d="M${wx} ${fy-137}V${fy-70}M${wx} ${fy-70}L${wx-14} ${fy}M${wx} ${fy-70}L${wx+12} ${fy}M${wx} ${fy-120}L${wx+30} ${fy-100}M${wx} ${fy-120}L${wx-20} ${fy-95}"/></g>`;
 g+=`<path d="M${wx-15} ${fy-160}a15 12 0 0 1 30 0z" style="fill:var(--live)"/>`;
 /* panel */
 g+=`<rect x="${px}" y="${py}" width="${pw}" height="${ph}" rx="4" style="fill:var(--surface);stroke:var(--fg);stroke-width:2"/>`;
 for(let i=0;i<3;i++)g+=`<rect x="${px+16+i*32}" y="${py+30}" width="22" height="44" rx="3" style="fill:var(--surface-2);stroke:var(--fg)"/><path d="M${px+27+i*32} ${py+40}v14" style="stroke:var(--fg);stroke-width:3"/>`;
 g+=`<path d="M${px+60} ${py+86}v34" style="stroke:var(--live);stroke-width:3"/>${svT(px+pw/2,py+20,s.V+' V',{st:'font-size:13px;fill:var(--live)'})}`;
 /* danger sign */
 g+=`<path d="M${px+60} ${py+128}l14 24h-28z" style="fill:var(--live);stroke:var(--fg)"/><text class="txt" x="${px+60}" y="${py+149}" text-anchor="middle" style="font-size:14px">!</text>`;
 /* nameplate */
 if(s.np)g+=`<rect x="${px+20}" y="${py+160}" width="80" height="20" rx="2" style="fill:var(--blue-soft);stroke:var(--blue)"/>${svT(px+60,py+174,'لوحة البيان',{st:'font-size:11px'})}`;
 else g+=`<rect x="${px+20}" y="${py+160}" width="80" height="20" rx="2" style="fill:none;stroke:var(--stop);stroke-dasharray:3 3"/>${svT(px+60,py+174,'لا لوحة بيان',{st:'font-size:11px;fill:var(--stop)'})}`;
 /* ID mark */
 g+=s.idDoor?`<rect x="${px+pw-30}" y="${py+96}" width="24" height="16" style="fill:var(--stop-soft);stroke:var(--stop)"/><text class="txt" x="${px+pw-18}" y="${py+108}" text-anchor="middle" style="font-size:10px">ID</text>`:`<rect x="${px+pw+4}" y="${py+4}" width="24" height="16" style="fill:var(--blue-soft);stroke:var(--blue)"/><text class="txt" x="${px+pw+16}" y="${py+16}" text-anchor="middle" style="font-size:10px">ID</text>`;
 /* earthing of frame */
 const ec=s.gF?'var(--on)':'var(--stop)';
 g+=`<path d="M${px+pw} ${fy-20}H${px+pw+30}V${fy+6}" style="fill:none;stroke:${ec};stroke-width:2.4;${s.gF?'':'stroke-dasharray:5 4'}"/>`;
 g+=`<path d="M${px+pw+18} ${fy+6}h24M${px+pw+22} ${fy+11}h16M${px+pw+26} ${fy+16}h8" style="stroke:${ec};stroke-width:2"/>`;
 /* fence */
 const fx0=px+pw+62;g+=`<g style="stroke:var(--muted);stroke-width:2">${[0,1,2].map(i=>`<path d="M${fx0+i*18} ${fy-70}V${fy}"/>`).join('')}<path d="M${fx0} ${fy-60}H${fx0+36}M${fx0} ${fy-30}H${fx0+36}"/></g>`;
 const ec2=s.gK?'var(--on)':'var(--stop)';g+=`<path d="M${fx0+36} ${fy-10}H${fx0+44}V${fy+6}" style="fill:none;stroke:${ec2};stroke-width:2.4;${s.gK?'':'stroke-dasharray:5 4'}"/><path d="M${fx0+34} ${fy+6}h20M${fx0+38} ${fy+11}h12" style="stroke:${ec2};stroke-width:2"/>`;
 g+=svT(fx0+18,fy-78,'سور معدني',{st:'font-size:11px'});
 return g+'</svg>'}

function lab12(el){
 const s={V:380,work:'op',w:70,h:2.0,gF:0,gK:0,np:1,idDoor:1,pV:380,pG:0,flam:0,fp:0};
 el.innerHTML=`<div class="grid sf-lab">
  <div class="panel c7"><h2>مختبر فحص لوحة <small>مبني على ص 4–6 (التأريض، وأماكن العمل، ومعدات السلامة، والتعريف)</small></h2>
   <p class="sub">غيّر الجهد ونوع العمل، وأصلح ما في اللوحة من مخالفات، وراقب قائمة المتطلبات. كل الأرقام من الكتاب.</p>
   <div class="svgbox" id="pv"></div>
   <div class="sub" style="margin-top:8px">الجهد بين الأوجه</div><div class="seg" role="group" id="vs">${VOLTS.map(v=>`<button data-v="${v}">${lt(v.toLocaleString('en-US')+' V')}</button>`).join('')}</div>
   <div class="sub" style="margin-top:8px">نوع العمل</div><div class="seg" role="group" id="ws"><button data-w="op">ضبط أو فحص دوري (اللوحة مغلقة)</button><button data-w="live">عمل قرب أجزاء مكهربة غير محمية</button><button data-w="dead">صيانة بعد الفصل بمفتاح أو سكينة</button></div>
   <label class="sf-sl"><span class="h"><span>عرض مكان العمل أمام اللوحة</span><b id="wV"></b></span><input type="range" id="wR" min="40" max="150" step="5" value="${s.w}"></label>
   <label class="sf-sl"><span class="h"><span>ارتفاع مكان العمل خارج منطقة الخطر</span><b id="hV"></b></span><input type="range" id="hR" min="1.4" max="2.6" step="0.1" value="${s.h}"></label>
   <div class="sf-row" id="tg"></div></div>
  <div class="panel c5"><h2>ما يلزم لهذه الحالة</h2><ul class="sf-req" id="req"></ul><div class="sf-fb" id="verd"></div></div>
  <div class="panel c7"><h2>معدة كهربائية متنقلة <small>ص 5</small></h2>
   <p class="sub">مثل مثقاب أو صاروخ قطع بهيكل معدني مكشوف.</p>
   <label class="sf-sl"><span class="h"><span>الجهد بين أي موصل والأرض</span><b id="pVV"></b></span><input type="range" id="pR" min="0" max="440" step="10" value="${s.pV}"></label>
   <div class="sf-row" id="ptg"></div><ul class="sf-req" id="preq"></ul><div class="sf-fb" id="pverd"></div></div>
  <div class="panel c5"><h2>التجربة خطوة بخطوة</h2><ol class="steps" id="gs"></ol>${tries(['اجعل عرض المكان أقل من 90 سم ولاحظ لون المنطقة.',`قارن قائمة المعدات عند ${lt('13800 V')} وعند ${lt('33000 V')}.`,`في المعدة المتنقلة جرّب ${lt('380 V')} ثم ${lt('220 V')}.`])}</div>
 </div>`;
 const $=q=>el.querySelector(q);
 const TG=[['gF','تأريض هيكل اللوحة'],['gK','تأريض السور المعدني'],['np','لوحة البيان مثبتة'],['idDoor','علامة التعريف على الباب (يُنزع)']];
 const PTG=[['pG','الهيكل المعدني مؤرّض'],['flam','المكان فيه مواد قابلة للاشتعال'],['fp','المعدة من النوع المانع للهب أو المأمون']];
 const tgl=(host,list)=>{host.innerHTML=list.map(([k,l])=>`<button type="button" class="sw" data-k="${k}" aria-pressed="${!!s[k]}"><span class="knob"></span><small>${l}</small></button>`).join('');
  host.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{s[b.dataset.k]=s[b.dataset.k]?0:1;draw()})};
 tgl($('#tg'),TG);tgl($('#ptg'),PTG);
 $('#vs').querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>{s.V=+b.dataset.v;draw()});
 $('#ws').querySelectorAll('[data-w]').forEach(b=>b.onclick=()=>{s.work=b.dataset.w;draw()});
 $('#wR').oninput=e=>{s.w=+e.target.value;draw()};$('#hR').oninput=e=>{s.h=+e.target.value;draw()};$('#pR').oninput=e=>{s.pV=+e.target.value;draw()};
 const li=(cls,t)=>`<li class="${cls}"><i>${cls==='ok'?'✓':cls==='no'?'✗':'•'}</i><span>${t}</span></li>`;
 const W={};
 function draw(){
  $('#pv').innerHTML=panelSVG(s);
  $('#vs').querySelectorAll('[data-v]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.v===s.V)));
  $('#ws').querySelectorAll('[data-w]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.w===s.work)));
  el.querySelectorAll('[data-k]').forEach(b=>b.setAttribute('aria-pressed',String(!!s[b.dataset.k])));
  $('#wV').textContent=s.w+' cm';$('#hV').textContent=s.h.toFixed(1)+' m';$('#pVV').textContent=s.pV+' V';
  let r='',bad=0;const ck=(ok,t)=>{if(!ok)bad++;r+=li(ok?'ok':'no',t)};
  ck(s.w>=90&&s.h>=2,`مكان العمل: عرض لا يقل عن ${lt('90 cm')} وارتفاع ${lt('2 m')} خارج منطقة الخطر، وأرضية راسخة ومأمونة (ص 5). الآن: ${lt(s.w+' cm × '+s.h.toFixed(1)+' m')}.`);
  ck(s.gF,'تأريض الأجزاء المعدنية غير الحاملة للتيار مثل لوحات المفاتيح (ص 4).');
  ck(s.gK,'تأريض العوارض المعدنية المقامة حول المعدات، بما فيها الحواجز والأسوار (ص 4).');
  ck(s.np,'تزويد المعدة بلوحة بيان للمواصفات القياسية الخاصة بها (ص 6).');
  ck(!s.idDoor,'علامات التعريف لا توضع على أغطية أو أبواب قابلة للنزع، لأنها قد تُبدَّل من أماكنها (ص 6).');
  if(s.work==='live'){
   if(s.V>=600&&s.V<=15000)r+=li('inf',`الجهد من ${lt('600 V')} إلى ${lt('15000 V')} بين الأوجه (ص 5): يلزم توفر معدات السلامة المناسبة:<div class="sf-chips">${LIST_A.map(x=>`<span class="sf-chip">${x}</span>`).join('')}</div>مع فحصها واختبارها بصفة دورية، وأن تكون سليمة ومناسبة للجهد المستخدم.`);
   else if(s.V>15000)r+=li('inf',`الجهد أعلى من ${lt('15000 V')} بين الأوجه (ص 6): يلزم توفير معدات الحماية المناسبة:<div class="sf-chips">${LIST_B.map(x=>`<span class="sf-chip">${x}</span>`).join('')}</div>وأن توفر درجة كافية من السلامة، وأن يكون جهدها المقنن مناسباً للدوائر الموجودة.`);
   else r+=li('inf',`الجهد أقل من ${lt('600 V')}: الكتاب لا يذكر قائمة معدات خاصة بهذا المدى في هذا الجزء؛ قائمتاه تبدآن من ${lt('600 V')}.`);
  } else if(s.work==='dead'){
   if(s.V>600)r+=li('inf',`صيانة معدة جهدها أعلى من ${lt('600 V')} بعد فصلها بمفاتيح أو سكينة فقط (ص 5): لابد من توفير <b>وسائل القصر التأريضي الفعالة</b> (توصيل الخطوط بالأرض) بأسلاك خاصة تُزال بعد إتمام العمل.`);
   else r+=li('inf',`الجهد ${lt(s.V+' V')} (ليس أعلى من ${lt('600 V')}): شرط القصر التأريضي في الكتاب (ص 5) خاص بالجهد الأعلى من ${lt('600 V')}.`);
  } else r+=li('inf','لا عمل قرب أجزاء مكهربة الآن. اختر «عمل قرب أجزاء مكهربة» أو «صيانة» لترى المعدات اللازمة.');
  $('#req').innerHTML=r;
  const v=$('#verd');v.className='sf-fb'+(bad?' bad':'');v.innerHTML=bad?`<b>في اللوحة ${lt(String(bad))} ${bad===1?'مخالفة':bad===2?'مخالفتان':'مخالفات'}.</b> أصلحها من الأزرار والمنزلقات.`:'<b>اللوحة ومكان العمل سليمان</b> حسب قواعد الكتاب.';
  /* portable */
  let pr='',pb=0;const pk=(ok,t)=>{if(!ok)pb++;pr+=li(ok?'ok':'no',t)};
  pk(s.pG,'يجب تأريض الهياكل المعدنية المكشوفة بطريقة فعالة، سواء كانت تعمل على التيار المتغير أو المستمر.');
  pk(s.pV<=250,`يجب ألا يزيد الجهد عن ${lt('250 V')} بين أي موصل والأرض. الآن: ${lt(s.pV+' V')}.`);
  if(s.flam)pk(s.fp,'لا يجوز استخدامها في الأماكن التي تحتوي على مواد قابلة للاشتعال ما لم تكن من النوع المانع للهب أو النوع المأمون.');
  else pr+=li('inf','المكان خالٍ من المواد القابلة للاشتعال، فلا يلزم النوع المانع للهب هنا.');
  $('#preq').innerHTML=pr;const pv=$('#pverd');pv.className='sf-fb'+(pb?' bad':'');pv.innerHTML=pb?'<b>لا تستخدم هذه المعدة بهذه الحالة.</b>':'<b>يجوز استخدام المعدة</b> حسب شروط ص 5.';
  W.zone=s.w>=90&&s.h>=2;W.ground=s.gF&&s.gK;W.all=!bad;W.a=s.work==='live'&&s.V>=600&&s.V<=15000;W.b=s.work==='live'&&s.V>15000;W.dead=s.work==='dead'&&s.V>600;W.p=!pb&&s.pV>0;
  if(S)S.check()}
 let S=null;
 S=stepsUI($('#gs'),[
  {t:'أصلح مكان العمل',x:`حرّك المنزلقين حتى يصير العرض ${lt('90 cm')} أو أكثر والارتفاع ${lt('2 m')} أو أكثر.`,done:()=>W.zone},
  {t:'أرّض الهيكل والسور',x:'شغّل «تأريض هيكل اللوحة» و«تأريض السور المعدني».',done:()=>W.ground},
  {t:'أكمل التعريف',x:'انقل علامة التعريف من الباب (أطفئ المفتاح)، وتأكد من لوحة البيان، حتى تصير اللوحة سليمة.',done:()=>W.all},
  {t:'عمل قرب أجزاء مكهربة',x:`اختر «عمل قرب أجزاء مكهربة» والجهد ${lt('13800 V')} واقرأ القائمة (أ).`,done:()=>W.a},
  {t:'جهد أعلى من '+lt('15000 V'),x:`غيّر الجهد إلى ${lt('33000 V')} أو أعلى، وقارن القائمة (ب) بالقائمة السابقة.`,done:()=>W.b},
  {t:'الصيانة بعد الفصل',x:`اختر «صيانة بعد الفصل» بجهد أعلى من ${lt('600 V')}، واقرأ شرط القصر التأريضي.`,done:()=>W.dead},
  {t:'المعدة المتنقلة',x:`اجعل المعدة المتنقلة صالحة: أرّض هيكلها، واجعل جهدها ${lt('250 V')} أو أقل.`,done:()=>W.p}]);
 draw()}

/* unit-1 questions (ص 7–8) */
const QU1=()=>{const e=[
  ['س١: هناك تعاريف مختلفة للسلامة الصناعية؟ اذكر اثنين منها؟','(1) مجموعة التدابير والإجراءات الوقائية والقصد منها حماية الأرواح والممتلكات من المخاطر المحيطة. (2) مجموعة الأساليب الهندسية والتنظيمية والتثقيفية التي تهدف إلى حماية الإنسان والممتلكات. (ويصح أيضاً: التحرر من وجود مصدر الخطر، وهي الدرجة النسبية للحماية من الخطر.) — ص 2.'],
  ['س٢: اذكر الأهداف المختلفة للسلامة الصناعية؟','أهداف إنسانية (حماية الإنسان من الإصابة والوفاة)، وأهداف اقتصادية (حماية المنشآت والممتلكات)، وأهداف صحية (المحافظة على الصحة العامة داخل بيئة العمل وخارجها) — ص 2.'],
  ['س٣: للسلامة الصناعية مبادئ عديدة اذكر خمسة منها فقط؟','قوة الإدارة الفاعلة في ترسيخ مفهوم السلامة؛ إمكانية التنبؤ بمصادر الخطر للسيطرة عليها قبل حدوثها؛ التخطيط للسلامة بالتنظيم والمتابعة والرقابة؛ تنظيم الهيكل الإداري للسلامة ومسؤولياتها وصلاحياتها؛ تحديد الأخطاء وتحليل مسببات الحوادث — ص 3.'],
  ['س٤: عند تركيب أو صيانة المعدات والأجهزة الكهربية يجب اتباع القواعد العامة للسلامة اذكر سبع نقاط منها فقط؟','(1) تركيب المعدات على نحو يمنع تماسها مع الموصلات المكهربة مع احتياطات منع الحرائق. (2) اختيار المواد على أساس جهد التشغيل والحمل وشروط السلامة، ومطابقتها للمواصفات الموحدة. (3) لا يقوم بالتركيب أو الضبط أو الفحص أو الإصلاح إلا المستوفون لشروط الخبرة والمعرفة الفنية. (4) فحص التركيبات الجديدة أو التوسعات واختبارها قبل تشغيلها. (5) تزويد العمال بكتيب متطلبات السلامة الرئيسة. (6) تأريض الأجزاء المعدنية غير الحاملة للتيار والأسوار والحواجز. (7) حماية وعزل أجزاء الماكينات التي تتحرك فجأة. — ص 3–5.'],
  ['س٥: للسلامة الصناعية عدة مفاهيم اذكر اثنين منها؟','المفهوم هو التعريف: علم يسعى لحماية الإنسان من المخاطر والأضرار ومنع الخسائر في الممتلكات؛ ومجموعة التدابير والإجراءات الوقائية لحماية الأرواح والممتلكات — ص 2.'],
  ['س٦: من مبادئ السلامة التعرف على المعدات، تكلم باختصار عن ذلك؟','يتعين التعريف بالمعدات الكهربائية بطريقة مناسبة لمقتضيات السلامة: بتعريف المكان أو اللون أو الرقم أو التصميم أو لوحة بيان أو وسيلة أخرى، بشرط أن تكون الطريقة موحدة لنفس النظام، وألا توضع العلامات على أغطية أو أبواب قابلة للنزع. وتُزوَّد جميع المعدات بلوحة بيان لمواصفاتها القياسية — ص 6.'],
  ['س٧: ما هو مفهومك للسلامة من واقع دراستك للسلامة الصناعية؟','إجابة شخصية؛ مثلاً: السلامة أن أعرف مصادر الخطر في عملي وأتخذ الإجراءات قبل وقوع الحادث، لأحمي نفسي وزملائي والمعدات والبيئة.']];
 const f=[
  ['س١: علم السلامة هو ذلك العلم الذي يسعى لحماية ……… من ……… وَ ………','الإنسان — المخاطر — الأضرار (ص 2).'],
  ['س٢: هناك عدة أهداف للسلامة هي أهداف ……… و أهداف ……… و أهداف ………','إنسانية — اقتصادية — صحية (ص 2).'],
  ['س٣: ينبغي تأريض جميع الأجزاء المعدنية للمعدات الكهربية الغير حاملة للتيار الكهربي مثل ……… و ……… و كذلك أغطية المحولات و ……… و ……… الرافعة','هياكل المولدات الكهربائية — لوحات المفاتيح — المفاتيح الكهربائية — المحركات (ص 4). <span class="fixnote">في السؤال «الرافعة»، والمتن «المحركات <b>الدافعة</b> للمولدات».</span>'],
  ['س٤: يراعى تأريض جميع العوارض المعدنية ( بما فيها ……… و ……… )','الحواجز — الأسوار (ص 4).'],
  ['س٥: معدات السلامة المستخدمة للعمل فوق الأجزاء المكهربة من جهد ٦٠٠ فولت إلى ١٥٠٠ هي ……… و ……… و ……… مع مراعاة ضرورة ……… و اختبارها بصفة ………','ثلاثة من: قفازات المطاط، أكمام المطاط، العدد اليدوية المعزولة، حصير المطاط المتنقل، العصا العازلة … — فحصها — دورية (ص 5). <span class="fixnote">في السؤال «إلى ١٥٠٠»، والصواب حسب ص 5 «إلى <b>١٥٠٠٠</b> فولت».</span>'],
  ['س٦: من معدات السلامة للعمل في الجهود أعلى من ١٥٠٠٠ فولت أدوات ……… و ……… و ……… اللازمة لتحريك ……… الكهربية.','الاختبار — التأريض — العصا — السكاكين (ص 6).'],
  ['س٧: يجب تزويد المعدات بـ ……… للمواصفات القياسية الخاصة بها.','لوحة بيان (ص 6).'],
  ['س٨: لابد من توفير أمكنة العمل المناسبة والتي تسهل الوصول لأجزاء ……… يجب إلا يقل عرض هذا المكان عن ……… سم و ارتفاعها ……… متر خارج منطقة الحصار.','المعدات الكهربائية — 90 — 2 (ص 5). <span class="fixnote">في السؤال «منطقة الحصار»، والمتن «منطقة <b>الخطر</b>».</span>']];
 const t=[
  ['س١: علم السلامة هو العلم الذي لا يسعى لحماية الإنسان من المخاطر والأضرار','✗ — هو يسعى لحمايته (ص 2).'],
  ['س٢: علم السلامة هو العلم الذي يسعى لحماية الإنسان من المخاطر والأضرار','✓ (ص 2).'],
  ['س٣: الأهداف الإستراتيجية من أهداف السلامة الصناعية','✗ — الأهداف في الكتاب إنسانية واقتصادية وصحية (ص 2). <span class="fixnote">«الأهداف الإستراتيجية» لم ترد في الشرح أصلاً.</span>'],
  ['س٤: الأهداف الصحية من أهداف السلامة الصناعية','✓ (ص 2).'],
  ['س٥: من المبادئ الأساسية للسلامة قوة الإرادة الفاعلة في ترسيخ مفهوم السلامة','✓ بالمقصود — <span class="fixnote">المبدأ في المتن (ص 3) «قوة <b>الإدارة</b> الفاعلة»، و«الإرادة» في السؤال خطأ مطبعي على الأرجح.</span>'],
  ['س٦: من المبادئ الأساسية للسلامة عدم تنظيم هيكل إداري للسلامة وتحديد مسؤولياتها وصلاحياتها','✗ (ص 3).'],
  ['س٧: من المبادئ الأساسية للسلامة تنظيم هيكل إداري للسلامة وتحديد مسؤولياتها وصلاحياتها','✓ (ص 3).'],
  ['س٨: من المبادئ الأساسية للسلامة عدم تحديد الأخطاء وتحليل مسببات الحوادث','✗ (ص 3).'],
  ['س٩: من المبادئ الأساسية للسلامة تحديد الأخطاء وتحليل مسببات الحوادث','✓ (ص 3).'],
  ['س١٠: من المبادئ الأساسية للسلامة التخطيط السليم والتنظيم والمتابعة والرقابة','✓ (ص 3).'],
  ['س١١: من المبادئ الأساسية للسلامة عدم التخطيط السليم والتنظيم والمتابعة والرقابة','✗ (ص 3).']];
 return `<h3>أسئلة مقالية <span class="ref">ص 7</span></h3>${e.map(x=>det(x[0],x[1])).join('')}
  <h3>أكمل مكان النقاط بكلمات مناسبة <span class="ref">ص 7</span></h3>${f.map(x=>det(x[0],x[1])).join('')}
  <h3>ضع علامة (√) أمام العبارة الصحيحة وعلامة (X) أمام العبارة غير الصحيحة <span class="ref">ص 8</span></h3>${t.map(x=>det(x[0],x[1])).join('')}`};

B.lesson({
 id:'u1-l2',unit:1,order:2,pages:'3–8',
 title:'قواعد التركيب والفحص والتأريض والتعريف',
 summary:'القواعد العامة في تركيب المعدات الكهربائية وصيانتها، وفحص المعدات، والتأريض، والمعدات المتنقلة، وأماكن العمل، ومعدات العمل فوق الأجزاء المكهربة، والتعريف بالمعدات، ثم أسئلة الوحدة.',
 stations:[
  {intro:true},

  {st:1,short:'القواعد العامة',title:'١-٢ القواعد العامة المطلوبة في تركيب وصيانة المعدات الكهربائية',ref:'ص 3–4',
   q:'تمديدات جديدة انتهت اليوم… هل نشغّلها فوراً؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="القواعد الخمس في تركيب المعدات الكهربائية وصيانتها" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><text x="180" y="156" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">قواعد التركيب</text><text x="180" y="176" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">والصيانة</text><g data-tip="القاعدة (أ): تُركَّب المعدات على نحو يمنع تماسها مع الموصلات المكهربة، مع الاحتياطات الكفيلة بمنع نشوب الحرائق."><circle cx="180" cy="72" r="34" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="164" y="52" width="32" height="40" rx="3" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><path d="M172 62 v10 M180 62 v10 M188 62 v10" stroke="#2C4A40" stroke-width="3"/><path d="M168 80 h24" stroke="#FBF6EE" stroke-width="3"/></g><text x="180" y="30" text-anchor="middle" font-size="15" font-weight="700" fill="#2C4A40">أ</text><g data-tip="القاعدة (ب): تُختار مواد المعدات على أساس جهد التشغيل والحمل وشروط السلامة، وتكون مطابقة للمواصفات الموحدة وتحمل العلامات المبينة لذلك."><circle cx="284" cy="128" r="34" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="276" cy="128" r="18" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><circle cx="276" cy="128" r="6" fill="#2C4A40"/><path d="M292 112 h12 v12 h-12 z" fill="#FBF6EE" stroke="#12855A" stroke-width="2"/><path d="M294 118 l3 3 l6 -6" fill="none" stroke="#12855A" stroke-width="2"/></g><text x="330" y="96" text-anchor="middle" font-size="15" font-weight="700" fill="#2C4A40">ب</text><g data-tip="القاعدة (ج): لا يقوم بتركيب المعدات أو ضبطها أو فحصها أو إصلاحها إلا الأفراد المستوفون لشروط الخبرة والمعرفة الفنية التي تحددها الهيئات المختصة."><circle cx="246" cy="236" r="34" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="246" cy="222" r="9" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5"/><path d="M230 258 v-14 a16 12 0 0 1 32 0 v14 z" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round"/><rect x="249" y="242" width="10" height="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.5"/></g><text x="294" y="280" text-anchor="middle" font-size="15" font-weight="700" fill="#2C4A40">ج</text><g data-tip="القاعدة (د): بعد إتمام التركيبات الجديدة أو توسعة القائمة يجب فحصها واختبارها قبل تشغيلها."><circle cx="114" cy="236" r="34" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="100" y="216" width="28" height="38" rx="3" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="108" y="212" width="12" height="7" fill="#2C4A40"/><path d="M106 230 l4 4 l8 -8 M106 244 l4 4 l8 -8" fill="none" stroke="#12855A" stroke-width="2.4"/></g><text x="66" y="280" text-anchor="middle" font-size="15" font-weight="700" fill="#2C4A40">د</text><g data-tip="القاعدة (هـ): يزوّد المشرفون العمال الذين يشغّلون المعدات أو يقتربون منها بكتيب يتضمن متطلبات السلامة الرئيسة المتعلقة بهم."><circle cx="76" cy="128" r="34" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M58 114 q9 -5 18 0 v28 q-9 -5 -18 0 z M76 114 q9 -5 18 0 v28 q-9 -5 -18 0 z" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.2" stroke-linejoin="round"/></g><text x="30" y="96" text-anchor="middle" font-size="15" font-weight="700" fill="#2C4A40">هـ</text></svg>`,
   cap:'خمس قواعد عامة (أ إلى هـ) في تركيب المعدات وصيانتها.<br><b>مرّر المؤشر على كل رمز (أو المسه في الجوال) لتقرأ قاعدته.</b>',
   side:[
    {predict:{q:'انتهى فني من توسعة تمديدات ورشة. ماذا يجب قبل تشغيلها؟',opts:[
     ['تشغيلها مباشرة ما دام الفني ماهراً',false,'مهارة الفني لا تغني عن الفحص؛ القاعدة (د) تطلب الفحص والاختبار قبل التشغيل.'],
     ['فحصها واختبارها من قبل شخص مختص',true,'القاعدة (د): «بعد إتمام التركيبات الجديدة أو توسعة التركيبات القائمة يجب أن يتم فحصها واختبارها … قبل تشغيل تلك التركيبات».'],
     ['الانتظار أسبوعاً حتى تستقر التمديدات',false,'الكتاب لا يذكر انتظاراً؛ المطلوب فحص واختبار.']]}}
   ],
   body:[
    {book:`<ol style="list-style:none;padding-inline-start:4px">
     <li>أ- يراعى في إنشاء و تركيب وصيانة جميع المعدات الكهربائية أن تركب على نحو يمنع حدوث تماسها مع الموصلات المكهربة كما يلزم اتخاذ الاحتياطات الكفيلة بمنع نشوب الحرائق.</li>
     <li>ب- يتم اختيار المواد الخاصة بجميع المعدات الكهربائية على أساس جهد التشغيل والحمل وأية شروط أخرى خاصة متعلقة بسلامة التشغيل. ويجب أن تكون هذه المعدات مطابقة للمواصفات الموحدة التي تقررها الهيئة المختصة وأن تحمل العلامات المبينة لذلك</li>
     <li>ج- لا يجوز لغير الأفراد المستوفين لشروط الخبرة والمعرفة الفنية وغير ذلك من المتطلبات التي تحددها الهيئات المختصة القيام بتركيب أو ضبط أو فحص أو إصلاح المعدات أو الدوائر الكهربائية.</li>
     <li>د- بعد إتمام التركيبات الجديدة أو توسعة التركيبات القائمة يجب أن يتم فحصها واختبارها من قبل شخص [مختص] وذلك قبل تشغيل تلك التركيبات أو التوسعات. <span class="ref">ص 4</span></li>
     <li>هـ- العمال الذين يقومون بتشغيل المعدات الكهربائية أو الذين ينبغي تواجدهم على مقربة من تلك المعدات يجب تزويدهم من قبل المشرفين على العمال بكتيب يتضمن متطلبات السلامة الرئيسة المتعلقة بهم.</li></ol>`,ref:'ص 3–4'},
    {watch:`<p>في البند (د) يقول الكتاب «من قبل شخص» وتنقصه صفة؛ والمقصود شخص مختص، فأضفناها بين قوسين.</p>`,fix:true},
    {tip:`<p>القواعد الخمس تغطي الرحلة كلها: <b>كيف</b> نركّب (أ)، و<b>بماذا</b> نركّب (ب)، و<b>من</b> يركّب (ج)، و<b>متى</b> نشغّل (د)، و<b>ماذا يعرف</b> من يعمل بجوار المعدات (هـ).</p>`},
    {title:'مختبر مصغّر: أي قاعدة خُولفت؟',widget:(el,B)=>DCML.sort(el,B,{intro:'المواقف أمثلة من عندنا. لكل موقف اختر القاعدة التي خالفها.',cats:['(أ) منع التماس والحريق','(ب) اختيار المواد','(ج) الأفراد المؤهلون','(د) الفحص قبل التشغيل','(هـ) كتيب السلامة'],items:[
     ['طُلب من عامل نظافة أن يغيّر قاطعاً في لوحة التوزيع.',2,'القاعدة (ج): لا يقوم بالتركيب أو الإصلاح إلا المستوفون لشروط الخبرة والمعرفة الفنية.'],
     ['وُسّعت تمديدات الورشة وشُغّلت في اليوم نفسه دون اختبار.',3,'القاعدة (د): الفحص والاختبار قبل تشغيل التوسعات.'],
     ['اشترى المقاول كابلاً أرخص لا يحمل علامة المطابقة، ومقطعه أصغر مما يتطلبه الحمل.',1,'القاعدة (ب): المواد تُختار على أساس الجهد والحمل، وتطابق المواصفات وتحمل علاماتها.'],
     ['عامل جديد بدأ العمل بجوار المحولات ولم يُعطَ أي تعليمات مكتوبة.',4,'القاعدة (هـ): يُزوَّد العمال القريبون من المعدات بكتيب متطلبات السلامة.'],
     ['تُركت أطراف موصلات مكشوفة قريبة من الغطاء المعدني للوحة.',0,'القاعدة (أ): التركيب على نحو يمنع التماس مع الموصلات المكهربة.']]})}
   ]},

  {st:2,short:'فحص المعدات',title:'١-٣ فحص المعدات',ref:'ص 4',
   q:'مولد احتياطي لم يعمل منذ سنة… متى نعرف أنه صالح؟ يوم الطوارئ؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="أربع حالات لفحص المعدات" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E3ECF7"/><g data-tip="(أ) المعدات بداخل الخدمة: تُفحص عند إدخالها ثم تدخل الفحص والصيانة الدورية، والمعطوبة منها تُفصل نهائياً وتُصلح."><rect x="64" y="58" width="108" height="96" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="118" cy="98" r="20" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><circle cx="118" cy="98" r="7" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><path d="M118 72 v-6 M118 124 v6 M92 98 h-6 M144 98 h6" stroke="#2C4A40" stroke-width="4" stroke-linecap="round"/></g><text x="118" y="146" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">أ- داخل الخدمة</text><g data-tip="(ب) المعدات الجاهزة للتشغيل في وقت الطوارئ (مثل مولد احتياطي): يجب فحصها واختبارها بصفة دورية لتقدير صلاحيتها للعمل."><rect x="188" y="58" width="108" height="96" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="210" y="80" width="64" height="36" rx="4" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><path d="M246 84 L236 100 H244 L238 112 L252 96 H244 L250 84 Z" fill="#2C4A40"/></g><text x="242" y="146" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">ب- الجاهزة للطوارئ</text><g data-tip="(ج) المعدات الجديدة: يراعى فحصها كاملاً واختبارها قبل وضعها بالخدمة."><rect x="64" y="166" width="108" height="96" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M92 196 L118 184 L144 196 V226 L118 238 L92 226 Z" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round"/><path d="M92 196 L118 208 L144 196 M118 208 V238" fill="none" stroke="#2C4A40" stroke-width="2.5"/></g><text x="118" y="254" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">ج- الجديدة</text><g data-tip="(د) حماية الأجزاء التي تتحرك بطريقة فجائية: يجب حمايتها وعزلها لأنها قد تصيب الأشخاص القريبين منها بسبب هذه الحركة."><rect x="188" y="166" width="108" height="96" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="226" y="178" width="32" height="14" fill="#2C4A40"/><rect x="236" y="192" width="12" height="20" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/><path d="M242 214 v6 M236 218 l6 6 l6 -6" fill="none" stroke="#E8735A" stroke-width="2.5"/><rect x="210" y="186" width="64" height="44" rx="4" fill="none" stroke="#12855A" stroke-width="2.5" stroke-dasharray="6 3"/></g><text x="242" y="254" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">د- الأجزاء المتحركة</text><text x="180" y="290" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">لكل حالة طريقة فحص</text></svg>`,
   cap:'أربع حالات يذكرها الكتاب تحت «فحص المعدات».<br><b>مرّر المؤشر على كل مربع (أو المسه في الجوال) لتعرف ما يُفعل فيه.</b>',
   side:[
    {predict:{q:'مولد احتياطي لا يعمل إلا عند انقطاع الكهرباء. متى يُفحص ويُختبر؟',opts:[
     ['عند انقطاع الكهرباء فقط',false,'إن كان معطوباً اكتشفنا ذلك متأخرين، وقت الحاجة إليه.'],
     ['بصفة دورية لتقدير صلاحيته للعمل',true,'الكتاب (ص 4): المعدات الجاهزة للعمل في وقت الطوارئ يجب فحصها واختبارها بصفة دورية.'],
     ['مرة واحدة عند شرائه',false,'الفحص عند الشراء للمعدات الجديدة؛ أما الجاهزة للطوارئ فدورياً.']]}}
   ],
   body:[
    {book:`<p><b>أ- المعدات بداخل الخدمة:</b><br>ينبغي إتباع قواعد السلامة الواردة بهذا الجزء عند فحص المعدات الكهربائية المراد إدخالها بالخدمة، وبعد ذلك تدخل ضمن الفحص والصيانة الدورية وبالنسبة للمعدات والدوائر الكهربائية المعطوبة فينبغي فصلها نهائياً وإصلاحها.</p>
     <p><b>ب المعدات الجاهزة للتشغيل:</b><br>بالنسبة للمعدات والدوائر الكهربائية الجاهزة للعمل في وقت الطوارئ، فإنها يجب فحصها واختبارها بصفة دورية لتقدير صلاحياتها للعمل.</p>
     <p><b>ج- المعدات الجديدة:</b><br>وبالنسبة للمعدات الجديدة فإنه يراعى فحصها كاملاً واختبارها قبل وضعها بالخدمة.</p>
     <p><b>د- حماية الأجزاء التي تتحرك بطريقة فجائية:</b><br>يجب حماية وعزل أجزاء الماكينات التي تتحرك بطريقة فجائية والتي من المحتمل أن تتسبب في إصابة الأشخاص القريبين منها بسبب هذه الحركة</p>`,ref:'ص 4'},
    {tip:`<p>الفكرة المشتركة: <b>لا نثق بمعدة لم تُفحص</b>. الجديدة تُفحص قبل الخدمة، والعاملة تُفحص دورياً، وتلك التي تنتظر الطوارئ تُختبر دورياً حتى لا تخذلنا وقت الحاجة، والمعطوبة تُفصل نهائياً حتى تُصلح.</p>`},
    {title:'مختبر مصغّر: أي حالة هذه؟',widget:(el,B)=>DCML.sort(el,B,{intro:'المعدات أمثلة من عندنا. اختر الحالة التي تنطبق على كل معدة في الكتاب.',cats:['أ- داخل الخدمة','ب- الجاهزة للطوارئ','ج- الجديدة','د- الأجزاء المتحركة فجائياً'],items:[
     ['محرك وصل اليوم من المورد ولم يُركَّب بعد.',2,'المعدات الجديدة: فحص كامل واختبار قبل وضعها بالخدمة.'],
     ['مضخة حريق لا تعمل إلا عند نشوب حريق.',1,'جاهزة للعمل في وقت الطوارئ: تُفحص وتُختبر بصفة دورية.'],
     ['دائرة إنارة في الورشة تعطلت وظهر منها شرر.',0,'معدة في الخدمة أصبحت معطوبة: تُفصل نهائياً وتُصلح.'],
     ['ذراع مكبس ينزل فجأة عند بدء كل دورة.',3,'جزء يتحرك بطريقة فجائية: تجب حمايته وعزله.'],
     ['ضاغط هواء يعمل في المصنع منذ سنتين.',0,'معدة داخل الخدمة: تدخل ضمن الفحص والصيانة الدورية.']]})}
   ]},

  {st:3,short:'تأريض الأجزاء المعدنية',title:'هـ- التأريض: أ- تأريض الأجزاء المعدنية غير الحاملة للتيار الكهربائي',ref:'ص 4',
   q:'هيكل اللوحة لا يمر فيه تيار أصلاً… فلماذا نوصله بالأرض؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="أجزاء معدنية غير حاملة للتيار موصولة بالأرض" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="هيكل المولد الكهربائي: جزء معدني لا يحمل تياراً في التشغيل العادي، فيجب تأريضه."><rect x="46" y="140" width="62" height="56" rx="6" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><circle cx="77" cy="168" r="17" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="77" y="174" text-anchor="middle" font-size="15" font-weight="700" fill="#2C4A40" font-family="var(--mono)">G</text></g><g data-tip="لوحة المفاتيح: هيكلها المعدني يجب تأريضه."><rect x="122" y="112" width="50" height="84" rx="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M134 128 v14 M147 128 v14 M160 128 v14" stroke="#2C4A40" stroke-width="4"/><rect x="132" y="156" width="30" height="8" fill="#F2C14E" stroke="#2C4A40" stroke-width="1.5"/></g><g data-tip="غطاء المحول: من الأجزاء المعدنية غير الحاملة للتيار التي ينص الكتاب على تأريضها."><rect x="186" y="128" width="56" height="68" rx="6" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><path d="M196 122 v6 M214 122 v6 M232 122 v6" stroke="#2C4A40" stroke-width="5"/><path d="M194 146 h40 M194 160 h40 M194 174 h40" stroke="#2C4A40" stroke-width="2"/></g><g data-tip="العوارض المعدنية حول المعدات، بما فيها الحواجز والأسوار: تُؤرَّض تأريضاً فعالاً."><path d="M258 120 V196 M280 120 V196 M302 120 V196 M258 136 H302 M258 172 H302" stroke="#2C4A40" stroke-width="3"/></g><g data-tip="خط التأريض: يوصل كل هذه الأجزاء بالأرض بطريقة فعالة."><path d="M77 196 V222 M147 196 V222 M214 196 V222 M302 196 V222 M77 222 H302" fill="none" stroke="#12855A" stroke-width="3.5"/><path d="M180 222 V238 M164 238 H196 M170 245 H190 M176 252 H184" stroke="#12855A" stroke-width="3.5" stroke-linecap="round"/></g><text x="77" y="104" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">هيكل المولد</text><text x="147" y="100" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">لوحة المفاتيح</text><text x="214" y="114" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">غطاء المحول</text><text x="282" y="110" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">السور</text><text x="180" y="282" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">كل معدن مكشوف يُوصل بالأرض</text></svg>`,
   cap:'أمثلة الكتاب على الأجزاء المعدنية التي تُؤرَّض.<br><b>مرّر المؤشر على كل جزء وعلى الخط الأخضر (أو المسه في الجوال) لتعرف دوره.</b>',
   side:[
    {predict:{q:'سور معدني مقام حول محطة محولات. هل يُؤرَّض؟',opts:[
     ['لا، لأنه بعيد عن الأسلاك',false,'الكتاب ينص على تأريض العوارض المعدنية المقامة حول المعدات، بما فيها الحواجز والأسوار.'],
     ['نعم، تأريضاً فعالاً',true,'الكتاب (ص 4): «ويراعى تأريض جميع العوارض المعدنية (بما فيها الحواجز والأسوار) المقامة حول المعدات الكهربائية تأريضاً فعالاً».'],
     ['فقط إذا كان مطلياً',false,'الطلاء لا علاقة له بالقاعدة.']]}}
   ],
   body:[
    {book:`<p>ينبغي تأريض جميع الأجزاء المعدنية للمعدات الكهربائية غير الحاملة للتيار الكهربائي مثل هياكل المولدات الكهربائية ولوحات المفاتيح وكذلك أغطية المحولات والمفاتيح الكهربائية والمحركات الدافعة للمولدات. ويراعى تأريض جميع العوارض المعدنية (بما فيها الحواجز والأسوار ) المقامة حول المعدات الكهربائية تأريضاً فعالاً.</p>`,ref:'ص 4'},
    {tip:`<p>«غير الحاملة للتيار» تعني أن التيار لا يمر فيها في التشغيل العادي. لكنها قريبة من أسلاك مكهربة، فإذا انهار العزل قد يلمسها سلك ويصير المعدن مكهرباً. التأريض يجعل هذا الخطر يذهب إلى الأرض بدلاً من جسم من يلمسها — وهذا موضوع المحطة التالية.</p>`},
    {watch:`<p>في أسئلة الوحدة (ص 7، الإكمال س٣) كلمة «الرافعة»؛ والمتن يقول «المحركات <b>الدافعة</b> للمولدات».</p>`},
    {title:'مختبر مصغّر: يُؤرَّض أم لا؟',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل جزء: هل هو جزء معدني غير حامل للتيار فيُؤرَّض، أم موصل يحمل التيار نفسه؟',cats:['يُؤرَّض: معدن غير حامل للتيار','لا: موصل يحمل التيار'],items:[
     ['هيكل المولد الكهربائي.',0,'من أمثلة الكتاب على الأجزاء التي تُؤرَّض.'],
     ['الغطاء المعدني للمحول.',0,'«وكذلك أغطية المحولات».'],
     ['سلك الطور الذي يغذي المحرك.',1,'هذا موصل يحمل تيار الحمل؛ لو وصلناه بالأرض لحدث قصر. التأريض للأجزاء المعدنية <b>غير</b> الحاملة للتيار.'],
     ['الحاجز المعدني حول لوحة التوزيع.',0,'العوارض المعدنية بما فيها الحواجز والأسوار تُؤرَّض تأريضاً فعالاً.'],
     ['هيكل المحرك الدافع للمولد.',0,'«والمحركات الدافعة للمولدات».']]})}
   ]},

  {st:4,short:'موصلات التأريض',title:'هـ- التأريض: ب- موصلات التأريض',ref:'ص 4',
   q:'سلك التأريض لا يحمل شيئاً طوال العام… فلماذا نهتم بسُمكه ومقاومته؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="تيار القصر يمر في موصل التأريض إلى الأرض بدلاً من جسم الإنسان" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBEBDD"/><g data-tip="هيكل المعدة: معدني غير حامل للتيار في التشغيل العادي."><rect x="96" y="96" width="120" height="96" rx="8" fill="#4FB3A9" stroke="#2C4A40" stroke-width="3"/></g><g data-tip="سلك مكهرب داخل المعدة."><path d="M40 120 H150" stroke="#C0392B" stroke-width="4"/></g><g data-tip="انهيار العزل: يلمس السلك المكهرب الهيكل المعدني فيصير الهيكل مكهرباً."><path d="M150 120 L162 132 L154 136 L170 150" fill="none" stroke="#F2C14E" stroke-width="4" stroke-linejoin="round"/><circle cx="170" cy="150" r="6" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/></g><g data-tip="موصل التأريض: يجب أن تكون مقاومته منخفضة كافية لكي ينقل على نحو مأمون أعلى تيار قصر ينتج عند انهيار العزل."><path d="M196 192 V246" stroke="#12855A" stroke-width="7"/><path d="M196 192 V246" stroke="#F2C14E" stroke-width="3" stroke-dasharray="6 6"/><path d="M176 246 H216 M182 254 H210 M189 262 H203" stroke="#2C4A40" stroke-width="3.5" stroke-linecap="round"/></g><g data-tip="مسار تيار القصر: يمر في موصل التأريض المنخفض المقاومة إلى الأرض."><path d="M206 200 V236" stroke="#C0392B" stroke-width="2.5" stroke-dasharray="4 3"/><path d="M200 232 l6 8 l6 -8" fill="none" stroke="#C0392B" stroke-width="2.5"/></g><g data-tip="شخص يلمس الهيكل: إذا كان التأريض سليماً لا يمر التيار في جسمه، لأن التيار يجد طريقاً أسهل بكثير في الموصل."><circle cx="262" cy="108" r="13" fill="#E8735A" stroke="#2C4A40" stroke-width="3"/><path d="M246 192 V146 a16 18 0 0 1 32 0 V192 Z" fill="#E8735A" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round"/><path d="M248 150 L216 150" stroke="#2C4A40" stroke-width="5" stroke-linecap="round"/><path d="M252 192 v52 M272 192 v52" stroke="#2C4A40" stroke-width="5" stroke-linecap="round"/></g><text x="156" y="88" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">هيكل المعدة</text><text x="118" y="232" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">موصل التأريض</text><text x="180" y="292" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">طريق سهل لتيار القصر إلى الأرض</text></svg>`,
   cap:'عند انهيار العزل يذهب تيار القصر في موصل التأريض.<br><b>مرّر المؤشر على الشرارة والموصل الأخضر والسهم والشخص (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'لماذا يجب أن تكون مقاومة موصل التأريض منخفضة؟',opts:[
     ['حتى يسخن ويحذّرنا من العطل',false,'المطلوب أن ينقل التيار «على نحو مأمون»، لا أن يسخن.'],
     ['حتى يوفّر في استهلاك الكهرباء',false,'موصل التأريض لا يحمل تياراً في التشغيل العادي، فلا علاقة له بالاستهلاك.'],
     ['لكي ينقل بأمان أعلى تيار قصر ينتج عند انهيار العزل',true,'الكتاب (ص 4): «ذات مقاومة منخفضة كافية؛ لكي تنقل على نحو مأمون أعلى تيار قصر قد ينتج عند حدوث انهيار في عزل المعدات».']]}}
   ],
   body:[
    {book:`<p>يجب أن تكون موصلات التأريض ذات مقاومة منخفضة كافية؛ لكي تنقل على نحو مأمون أعلى تيار قصر قد ينتج عند حدوث انهيار في عزل المعدات المطلوبة ووقايتها.</p>`,ref:'ص 4'},
    {tip:`<p>لماذا نؤرّض هيكلاً لا يحمل تياراً؟ لأن العزل قد ينهار فيلمس سلك مكهرب الهيكل. إن كان الهيكل مؤرّضاً بموصل منخفض المقاومة مرّ تيار القصر في الموصل إلى الأرض وفصلت الحماية، بدلاً من أن يمر في جسم من يلمس الهيكل.</p>`},
    {title:'مختبر مصغّر: أين يذهب تيار العطل؟',widget:(el,B)=>DCML.lab(el,B,{intro:'غيّر حالة العزل وموصل التأريض، وانظر إلى طريق التيار. لا أرقام هنا؛ المهم الطريق.',
     predict:{q:'انهار العزل، وموصل التأريض مقطوع، وعامل يلمس الهيكل. ماذا تتوقع؟',opts:[
      ['لا شيء؛ الهيكل لا يحمل تياراً',false,'بعد انهيار العزل صار الهيكل مكهرباً بالسلك الذي يلمسه.'],
      ['يمر التيار في جسم العامل إلى الأرض',true,'لا يوجد طريق آخر إلى الأرض غير جسمه، فهو في خطر الصعق.'],
      ['تفصل الحماية فوراً',false,'من غير موصل تأريض لا يمر تيار قصر كبير يجعل الحماية تفصل بسرعة.']]},
     ins:[{k:'f',l:'العزل',sw:true,v:1,on:'العزل منهار: السلك يلمس الهيكل (اضغط لإصلاحه)',off:'العزل سليم (اضغط لتجعله ينهار)'},
      {k:'e',l:'موصل التأريض',seg:[[1,'سليم ومنخفض المقاومة'],[0,'مقطوع']],v:0},
      {k:'t',l:'العامل',seg:[[1,'يلمس الهيكل'],[0,'لا يلمسه']],v:1}],
     calc:(s)=>{const f=s.f,e=s.e,t=s.t,live=f&&!e,body=live&&t,gnd=f&&e;
      const pic=`<svg viewBox="0 0 320 170" role="img" aria-label="طريق تيار العطل" style="font-family:var(--font)"><rect x="0" y="0" width="100%" height="100%" rx="12" fill="#F3E8D8"/><rect x="70" y="40" width="100" height="70" rx="6" fill="${live?'#F6C6BC':'#BFE3DC'}" stroke="#2C4A40" stroke-width="2.5"/><path d="M10 58 H110" stroke="#C0392B" stroke-width="3.5"/>${f?'<path d="M110 58 L122 70 L114 74 L128 88" fill="none" stroke="#E0A800" stroke-width="3.5"/>':''}<path d="M150 110 V${e?150:128}" stroke="#12855A" stroke-width="5"/>${e?'':'<path d="M150 136 V150" stroke="#12855A" stroke-width="5"/><path d="M142 128 l16 6" stroke="#C0392B" stroke-width="2.5"/>'}<path d="M134 150 H166 M139 156 H161 M145 162 H155" stroke="#2C4A40" stroke-width="2.5"/>${gnd?'<path d="M160 116 V146" stroke="#C0392B" stroke-width="2.5" stroke-dasharray="4 3"/><path d="M155 140 l5 7 l5 -7" fill="none" stroke="#C0392B" stroke-width="2.5"/>':''}<circle cx="240" cy="44" r="11" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5"/><path d="M226 120 V78 a14 15 0 0 1 28 0 V120 Z" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5"/>${t?'<path d="M228 82 L170 82" stroke="#2C4A40" stroke-width="4" stroke-linecap="round"/>':''}<path d="M232 120 v36 M248 120 v36" stroke="#2C4A40" stroke-width="4"/><path d="M220 160 H262" stroke="#2C4A40" stroke-width="2"/>${body?'<path d="M200 76 L240 100 L240 156" fill="none" stroke="#C0392B" stroke-width="3" stroke-dasharray="5 3"/><circle cx="240" cy="100" r="22" fill="none" stroke="#C0392B" stroke-width="2.5"/>':''}</svg>`;
      let msg,cls='';
      if(!f){msg='<b>العزل سليم:</b> الهيكل غير مكهرب، ولا يمر تيار في موصل التأريض ولا في العامل.'}
      else if(e){msg='<b>العزل منهار والتأريض سليم:</b> تيار القصر يمر في موصل التأريض المنخفض المقاومة إلى الأرض (السهم الأحمر)، فتفصل الحماية'+(t?'، ولا يمر التيار في جسم العامل.':'.')}
      else if(t){msg='<b>خطر صعق!</b> الهيكل مكهرب ولا طريق للتيار إلى الأرض إلا جسم العامل الذي يلمسه.';cls='bad'}
      else{msg='<b>خطر كامن:</b> الهيكل صار مكهرباً ولا يوجد ما يفصل التيار؛ أول من يلمسه سيُصعق.';cls='warn'}
      return {pic,msg,cls}}})}
   ]},

  {st:5,short:'المعدات المتنقلة',title:'هـ- التأريض: ج- المعدات الكهربائية المتنقلة',ref:'ص 5',
   q:'مثقاب بهيكل معدني ينتقل معك من مكان إلى مكان… ما الذي يجعله أخطر من الآلة الثابتة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="احتياطات المعدات الكهربائية المتنقلة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E3ECF7"/><g data-tip="معدة متنقلة ذات أجزاء معدنية مكشوفة (مثل مثقاب): يجب تأريض هيكلها المعدني بطريقة فعالة، سواء كانت تعمل على التيار المتغير أو المستمر."><rect x="70" y="96" width="120" height="44" rx="10" fill="#9AA5A0" stroke="#2C4A40" stroke-width="3"/><rect x="190" y="110" width="44" height="14" fill="#2C4A40"/><path d="M234 117 H262" stroke="#2C4A40" stroke-width="5" stroke-linecap="round"/><path d="M100 140 L92 196 H128 L134 140 Z" fill="#9AA5A0" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round"/></g><g data-tip="الكابل والقابس: فيه موصل خاص بالتأريض (الطرف الثالث) يوصل الهيكل المعدني بالأرض."><path d="M110 196 C110 240 150 250 176 238" fill="none" stroke="#2C4A40" stroke-width="4"/><rect x="176" y="226" width="34" height="26" rx="4" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><path d="M210 232 h12 M210 246 h12" stroke="#2C4A40" stroke-width="3"/><path d="M210 239 h16" stroke="#12855A" stroke-width="4"/></g><g data-tip="الحد الأعلى للجهد: يجب ألا يزيد الجهد المستخدم عن ⟦250 V⟧ بين أي موصل والأرض، في نظام التيار المتغير أو المستمر."><rect x="238" y="52" width="92" height="40" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="284" y="70" text-anchor="middle" font-size="11" fill="#2C4A40">لا يزيد عن</text><text x="284" y="86" text-anchor="middle" font-size="14" font-weight="700" fill="#C0392B" font-family="var(--mono)" direction="ltr">250 V</text></g><g data-tip="مكان فيه مواد قابلة للاشتعال: لا يجوز استخدام المعدة المتنقلة فيه ما لم تكن من النوع المانع للهب أو النوع المأمون."><rect x="262" y="176" width="44" height="58" rx="6" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5"/><rect x="270" y="168" width="14" height="10" fill="#2C4A40"/><path d="M284 192 C276 202 278 212 284 216 C290 212 292 202 284 192 Z" fill="#F2C14E" stroke="#2C4A40" stroke-width="1.5"/></g><text x="130" y="84" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">هيكل معدني مؤرّض</text><text x="284" y="252" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">مواد قابلة للاشتعال</text><text x="180" y="290" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">تأريض وجهد محدود ونوع مناسب للمكان</text></svg>`,
   cap:'ثلاثة احتياطات للمعدة المتنقلة.<br><b>مرّر المؤشر على المثقاب والقابس واللافتة والعلبة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'ما أقصى جهد مسموح بين أي موصل والأرض في المعدات الكهربائية المتنقلة؟',opts:[
     ['<span class="ltr">600 V</span>',false,'الرقم 600 فولت في الكتاب حدّ لشرط القصر التأريضي أثناء الصيانة، لا للمعدات المتنقلة.'],
     ['<span class="ltr">15000 V</span>',false,'هذا حد معدات العمل فوق الأجزاء المكهربة.'],
     ['<span class="ltr">250 V</span>',true,'الكتاب (ص 5): «يجب ألا يزيد الجهد المستخدم عن 250 فولت بين أي موصل والأرض».']]}}
   ],
   body:[
    {book:`<p>عند استعمال المعدات الكهربائية المتنقلة ذات الأجزاء المعدنية المكشوفة لابد من اتخاذ الاحتياطات التالية:</p>
     <ol><li>يجب تأريض الهياكل المعدنية المكشوفة من هذه المعدات (سواء كانت تعمل على نظام التيار المتغير أو المستمر) بطريقة فعالة.</li>
     <li>يجب ألا يزيد الجهد المستخدم عن <span class="ltr">250</span> فولت بين أي موصل والأرض سواء في نظام التيار المتغير أو المستمر.</li>
     <li>لا يجوز استخدام تلك المعدات في الأماكن التي تحتوي على مواد قابلة للاشتعال ما لم تكن من النوع المانع للهب أو النوع المأمون.</li>
     <li>يجب توفير معدات التأريض أثناء الصيانة للمعدات الكهربائية أو الموصلات التي تعمل على جهد أعلى من <span class="ltr">600</span> فولت والتي يتم العمل بها أو حولها بعد فصلها عن مصدر التيار الكهربائي باستخدام مفاتيح أو سكينة فقط، فلا بد من توفير وسائل القصر التأريضي الفعالة ( توصيل الخطوط بالأرض) بواسطة أسلاك خاصة تزال بعد إتمام العمل.</li></ol>`,ref:'ص 5'},
    {tip:`<p>المعدة المتنقلة تُمسك باليد، فإن صار هيكلها مكهرباً مرّ التيار في يد العامل مباشرة؛ لذلك نؤرّضها ونحدّ جهدها. والبند ٤ يخص الصيانة: الفصل بمفتاح أو سكينة وحده لا يكفي فوق <span class="ltr">600</span> فولت، بل نوصل الخطوط بالأرض بأسلاك خاصة، ثم نزيلها بعد انتهاء العمل.</p>`},
    {title:'مختبر مصغّر: يجوز أم لا يجوز؟',widget:(el,B)=>DCML.cases(el,B,{intro:'المواقف أمثلة من عندنا، والحكم من شروط الكتاب (ص 5).',cases:[
     {q:'صاروخ قطع بهيكل معدني مؤرّض، جهده لا يزيد عن <span class="ltr">250 V</span> بين الموصل والأرض، يُستخدم في مخزن وقود، وهو ليس من النوع المانع للهب.',opts:[['يجوز، لأن هيكله مؤرّض وجهده مقبول',false,'الشرطان الأولان متحققان، لكن الشرط الثالث لا.'],['لا يجوز، لأن المكان فيه مواد قابلة للاشتعال والمعدة ليست مانعة للهب ولا مأمونة',true,'البند ٣: لا يجوز استخدامها في هذه الأماكن ما لم تكن من النوع المانع للهب أو المأمون.']]},
     {q:'مثقاب بهيكل معدني مكشوف يعمل على جهد أعلى من <span class="ltr">250 V</span> بين الموصل والأرض.',opts:[['لا يجوز',true,'البند ٢: يجب ألا يزيد الجهد عن <span class="ltr">250 V</span> بين أي موصل والأرض.'],['يجوز إذا كان التيار مستمراً',false,'الكتاب يقول «سواء في نظام التيار المتغير أو المستمر».']]},
     {q:'فُصل خط جهده أعلى من <span class="ltr">600 V</span> بسكينة فقط، وسيعمل الفنيون عليه. ماذا يلزم؟',opts:[['يكفي فتح السكينة',false,'البند ٤ يطلب أكثر من الفصل حين يكون الفصل بمفاتيح أو سكينة فقط.'],['توصيل الخطوط بالأرض بأسلاك خاصة تُزال بعد إتمام العمل',true,'هذه «وسائل القصر التأريضي الفعالة» في البند ٤.'],['ارتداء القفازات فقط',false,'القفازات مهمة، لكن الشرط هنا هو القصر التأريضي.']]}]})}
   ]},

  {st:6,short:'أماكن العمل',title:'٥- أماكن العمل حول المعدات الكهربائية',ref:'ص 5',
   q:'لوحة تحتاج فحصاً دورياً، وأمامها رفوف بضاعة تترك ممراً ضيقاً… أين المشكلة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مكان العمل أمام لوحة عرضه 90 سم وارتفاعه 2 متر" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="مكان العمل أمام المعدة: لا يقل عرضه عن ⟦90 cm⟧ وارتفاعه ⟦2 m⟧ خارج منطقة الخطر، وأرضيته راسخة ومأمونة."><rect x="92" y="70" width="140" height="170" fill="#BFE3DC" stroke="#12855A" stroke-width="2.5" stroke-dasharray="8 5"/></g><g data-tip="لوحة تحتاج إلى ضبط أو فحص دوري."><rect x="232" y="84" width="58" height="156" rx="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M246 104 v20 M261 104 v20 M276 104 v20" stroke="#2C4A40" stroke-width="5"/><path d="M261 150 l12 20 h-24 z" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/></g><circle cx="162" cy="120" r="12" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5"/><path d="M148 196 V150 a14 16 0 0 1 28 0 V196 Z" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5"/><path d="M152 196 v42 M172 196 v42" stroke="#2C4A40" stroke-width="5"/><path d="M60 240 H300" stroke="#2C4A40" stroke-width="3"/><g data-tip="العرض: لا يقل عن ⟦90 cm⟧."><path d="M92 256 H232 M92 250 v12 M232 250 v12" stroke="#2C4A40" stroke-width="2"/><text x="162" y="276" text-anchor="middle" font-size="14" font-weight="700" fill="#2C4A40" font-family="var(--mono)" direction="ltr">90 cm</text></g><g data-tip="الارتفاع: ⟦2 m⟧ خارج منطقة الخطر."><path d="M76 70 V240 M70 70 h12 M70 240 h12" stroke="#2C4A40" stroke-width="2"/><text x="66" y="160" text-anchor="end" font-size="14" font-weight="700" fill="#2C4A40" font-family="var(--mono)" direction="ltr">2 m</text></g></svg>`,
   cap:'منطقة العمل الخضراء أمام اللوحة.<br><b>مرّر المؤشر على المنطقة واللوحة والبعدين (أو المسها في الجوال) لتعرف الشروط.</b>',
   side:[
    {predict:{q:'ممر أمام لوحة عرضه <span class="ltr">80 cm</span> وارتفاعه <span class="ltr">2.2 m</span>. هل يكفي؟',opts:[
     ['نعم، لأن الارتفاع أكثر من المطلوب',false,'زيادة الارتفاع لا تعوّض نقص العرض؛ الشرطان معاً.'],
     ['لا، لأن العرض أقل من <span class="ltr">90 cm</span>',true,'الكتاب (ص 5): «بحيث لا يقل عرض هذه الأماكن عن 90 سم وارتفاعها 2 متر خارج منطقة الخطر».'],
     ['نعم، الكتاب لا يحدد عرضاً',false,'الكتاب يحدد عرضاً لا يقل عن <span class="ltr">90 cm</span>.']]}}
   ],
   body:[
    {book:`<p>لا بد من وجود أماكن العمل المناسبة حول المعدات لكي يسهل الوصول إليها، وأن تكون أرضياتها راسخة ومأمونة حول جميع المعدات الكهربائية التي تحتاج إلى ضبط أو فحص دوري بحيث لا يقل عرض هذه الأماكن عن <span class="ltr">90</span> سم وارتفاعها <span class="ltr">2</span> متر خارج منطقة الخطر.</p>`,ref:'ص 5'},
    {tip:`<p>في المكان الضيق يقترب جسم الفني من الأجزاء المكهربة دون قصد، ولا يستطيع الابتعاد سريعاً إن حدث شرر. لذلك يشترط الكتاب ثلاثة أشياء معاً: <b>عرض</b> لا يقل عن <span class="ltr">90 cm</span>، و<b>ارتفاع</b> <span class="ltr">2 m</span>، و<b>أرضية</b> راسخة ومأمونة.</p>`},
    {watch:`<p>في أسئلة الوحدة (ص 7، الإكمال س٨) عبارة «منطقة الحصار»؛ والمتن يقول «منطقة <b>الخطر</b>».</p>`},
    {title:'مختبر مصغّر: افحص الممر',widget:(el,B)=>DCML.lab(el,B,{intro:'حرّك العرض والارتفاع (أرقام تختارها أنت) وقارنهما بشرط الكتاب.',
     ins:[{k:'w',l:'عرض المكان أمام اللوحة',min:50,max:150,step:10,v:70,dp:0,u:'cm'},{k:'h',l:'الارتفاع خارج منطقة الخطر',min:1.5,max:2.5,step:0.1,v:1.8,dp:1,u:'m'}],
     calc:(s,P,B)=>{const okW=s.w>=90,okH=s.h>=2-1e-9,ok=okW&&okH,zw=s.w*1.1,zh=s.h*55,x0=210-zw;
      const pic=`<svg viewBox="0 0 300 175" role="img" aria-label="مكان العمل أمام اللوحة" style="font-family:var(--font)"><rect x="0" y="0" width="100%" height="100%" rx="12" fill="#F3E8D8"/><path d="M10 150 H290" stroke="#2C4A40" stroke-width="2.5"/><rect x="${x0.toFixed(1)}" y="${(150-zh).toFixed(1)}" width="${zw.toFixed(1)}" height="${zh.toFixed(1)}" fill="${ok?'#BFE3DC':'#F6C6BC'}" stroke="${ok?'#12855A':'#C0392B'}" stroke-width="2" stroke-dasharray="6 4"/><rect x="210" y="40" width="44" height="110" rx="3" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M221 56 v14 M232 56 v14 M243 56 v14" stroke="#2C4A40" stroke-width="4"/><path d="M${x0.toFixed(1)} 162 H210" stroke="${okW?'#12855A':'#C0392B'}" stroke-width="2"/><text x="${(x0+zw/2).toFixed(1)}" y="174" text-anchor="middle" font-size="12" font-weight="700" fill="${okW?'#12855A':'#C0392B'}" font-family="var(--mono)" direction="ltr">${s.w} cm</text><text x="${(x0-6).toFixed(1)}" y="${(150-zh/2).toFixed(1)}" text-anchor="end" font-size="12" font-weight="700" fill="${okH?'#12855A':'#C0392B'}" font-family="var(--mono)" direction="ltr">${B.fmtN(s.h,1)} m</text></svg>`;
      const msg=ok?'<b>المكان مطابق</b>: العرض لا يقل عن <span class="ltr">90 cm</span> والارتفاع <span class="ltr">2 m</span> أو أكثر. تأكد أيضاً أن الأرضية راسخة ومأمونة.':`<b>المكان غير مطابق:</b> ${okW?'':'العرض أقل من <span class="ltr">90 cm</span>. '}${okH?'':'الارتفاع أقل من <span class="ltr">2 m</span>.'}`;
      return {pic,msg,cls:ok?'':'bad'}}})}
   ]},

  {st:7,short:'من 600 إلى 15000 فولت',title:'٦- معدات السلامة للعمل فوق الأجزاء المكهربة: أ- عندما يكون الجهد من 600 فولت إلى 15000 فولت بين الأوجه',ref:'ص 5',
   q:'ما الذي يقف بين يد الفني وجزء مكهرب غير محمي؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="عامل بمعدات السلامة قرب جزء مكهرب" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBEBDD"/><g data-tip="جزء مكهرب غير محمي: جهده من ⟦600 V⟧ إلى ⟦15000 V⟧ بين الأوجه. منطقة الخطر حوله."><path d="M250 40 V120" stroke="#2C4A40" stroke-width="5"/><rect x="236" y="70" width="28" height="12" rx="3" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><rect x="236" y="88" width="28" height="12" rx="3" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><path d="M200 120 H300" stroke="#C0392B" stroke-width="5"/><circle cx="250" cy="120" r="44" fill="none" stroke="#C0392B" stroke-width="2" stroke-dasharray="6 5"/></g><g data-tip="العصا العازلة: تُبعد يد العامل عن الجزء المكهرب."><path d="M146 152 L226 124" stroke="#F2C14E" stroke-width="7" stroke-linecap="round"/><path d="M146 152 L226 124" stroke="#2C4A40" stroke-width="1.5" stroke-dasharray="3 9"/></g><circle cx="110" cy="104" r="14" fill="#E8735A" stroke="#2C4A40" stroke-width="3"/><path d="M92 208 V146 a18 20 0 0 1 36 0 V208 Z" fill="#4FB3A9" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round"/><g data-tip="أكمام المطاط: تحمي الذراع من الملامسة."><path d="M124 140 L146 152" stroke="#2C4A40" stroke-width="13" stroke-linecap="round"/><path d="M124 140 L146 152" stroke="#E8735A" stroke-width="8" stroke-linecap="round"/></g><g data-tip="قفازات المطاط: عازلة للكهرباء، تُفحص وتُختبر دورياً وتكون مناسبة للجهد المستخدم."><circle cx="150" cy="154" r="9" fill="#2C4A40"/></g><path d="M100 208 v38 M120 208 v38" stroke="#2C4A40" stroke-width="6"/><g data-tip="حصير المطاط المتنقل: يعزل العامل عن الأرض تحت قدميه."><rect x="70" y="244" width="84" height="12" rx="3" fill="#2C4A40"/></g><text x="112" y="280" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">حصير المطاط</text><text x="250" y="190" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">جزء مكهرب</text><text x="250" y="210" text-anchor="middle" font-size="13" fill="#C0392B" font-weight="700" font-family="var(--mono)" direction="ltr">600 – 15000 V</text></svg>`,
   cap:'بعض معدات القائمة (أ).<br><b>مرّر المؤشر على العصا والكم والقفاز والحصير والجزء المكهرب (أو المسها في الجوال) لتعرف دور كل منها.</b>',
   side:[
    {predict:{q:'أي مما يلي <b>ليس</b> من معدات القائمة (أ) في الكتاب؟',opts:[
     ['قفازات المطاط',false,'من القائمة (أ).'],
     ['حصير المطاط المتنقل',false,'من القائمة (أ).'],
     ['سلّم من الألومنيوم',true,'ليس في القائمة؛ والقائمة كلها أدوات عازلة، والألومنيوم موصل للكهرباء.'],
     ['قابضات المصهرات المعزولة',false,'من القائمة (أ).']]}}
   ],
   body:[
    {book:`<p>عندما تستدعي ظروف العمل اقتراب الأشخاص العاملين بأجسامهم أو بأية عدد يدوية إلى داخل منطقة الخطر، حول الأجزاء المكهربة غير المحمية، فلا بد من توفر معدات السلامة المناسبة مثل:( قفازات المطاط، و أكمام المطاط، والعدد اليدوية المعزولة، وحصير المطاط المتنقل، غلاف المطاط، والعصا العازلة، وقابضات المصهرات المعزولة، وأدوات التأريض، والمركبات ذات الأرضية المعزولة) وما شابه هذه الأدوات مع مراعاة ضرورة فحصها واختبارها بصفة دورية كما يجب الإبقاء عليها بحالة سليمة وأن تكون مناسبة للجهد المستخدم.</p>`,ref:'ص 5'},
    {tip:`<p>لاحظ أن أغلب القائمة من <b>المطاط</b> أو <b>معزول</b>: الفكرة أن نضع عازلاً بين الإنسان والجزء المكهرب، من يديه (القفازات) إلى ذراعيه (الأكمام) إلى قدميه (الحصير). والشروط الثلاثة في آخر النص مهمة بالقدر نفسه: <b>فحص واختبار دوري</b>، و<b>حالة سليمة</b>، و<b>مناسبة للجهد</b>.</p>`},
    {watch:`<p>في أسئلة الوحدة (ص 7، الإكمال س٥) «من جهد ٦٠٠ فولت إلى ١٥٠٠»؛ والصواب حسب ص 5 «إلى <span class="ltr">15000</span> فولت».</p>`},
    {title:'مختبر مصغّر: من القائمة أم لا؟',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل أداة: هل هي من معدات القائمة (أ) في الكتاب؟ الأدوات غير المذكورة أمثلة من عندنا.',cats:['من القائمة (أ)','ليست منها'],items:[
     ['العصا العازلة',0,'مذكورة في القائمة.'],
     ['مفك عادي بمقبض معدني مكشوف',1,'القائمة تذكر «العدد اليدوية <b>المعزولة</b>».'],
     ['غلاف المطاط',0,'مذكور في القائمة.'],
     ['المركبات ذات الأرضية المعزولة',0,'مذكورة في القائمة.'],
     ['قفازات قماش عادية',1,'القائمة تذكر «قفازات <b>المطاط</b>»؛ القماش لا يعزل.'],
     ['أدوات التأريض',0,'مذكورة في القائمة.']]})}
   ]},

  {st:8,short:'أعلى من 15000 فولت',title:'٦- معدات السلامة: ب- الجهد الأعلى من 15000 فولت بين الأوجه',ref:'ص 6',
   q:'كيف تفتح سكينة كهربائية جهدها أعلى من 15000 فولت دون أن تقترب منها؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="تحريك سكينة كهربائية بعصا عازلة من بعيد" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E3ECF7"/><g data-tip="السكينة الكهربائية: مفتاح فصل على الجهد العالي يُحرَّك بعصا خاصة من بعيد."><path d="M220 70 H310" stroke="#2C4A40" stroke-width="4"/><rect x="236" y="70" width="12" height="22" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><rect x="286" y="70" width="12" height="22" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><path d="M242 92 L284 70" stroke="#C0392B" stroke-width="5" stroke-linecap="round"/><circle cx="242" cy="92" r="5" fill="#2C4A40"/><path d="M242 92 V196 M292 92 V196" stroke="#2C4A40" stroke-width="3"/></g><g data-tip="العصا اللازمة لتحريك السكاكين الكهربائية: طويلة وعازلة، تُبقي العامل بعيداً عن الجزء المكهرب."><path d="M118 186 L262 84" stroke="#F2C14E" stroke-width="7" stroke-linecap="round"/><path d="M118 186 L262 84" stroke="#2C4A40" stroke-width="1.5" stroke-dasharray="3 10"/></g><circle cx="96" cy="150" r="13" fill="#E8735A" stroke="#2C4A40" stroke-width="3"/><path d="M80 246 V190 a16 18 0 0 1 32 0 V246 Z" fill="#4FB3A9" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round"/><path d="M106 188 L118 186" stroke="#2C4A40" stroke-width="6" stroke-linecap="round"/><g data-tip="أدوات الاختبار: للتأكد من وجود الجهد أو غيابه قبل لمس أي جزء."><rect x="150" y="214" width="30" height="44" rx="5" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><rect x="156" y="220" width="18" height="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.5"/><path d="M165 258 V272" stroke="#2C4A40" stroke-width="3"/></g><g data-tip="أدوات التأريض: أسلاك ومشابك توصل الخطوط بالأرض بعد الفصل."><path d="M214 196 V232 M270 196 V232 M214 232 H270" stroke="#12855A" stroke-width="4"/><path d="M228 246 H256 M233 253 H251 M238 260 H246" stroke="#12855A" stroke-width="3.5" stroke-linecap="round"/><path d="M242 232 V246" stroke="#12855A" stroke-width="4"/></g><text x="270" y="56" text-anchor="middle" font-size="13" fill="#C0392B" font-weight="700" direction="rtl">أعلى من <tspan direction="ltr" unicode-bidi="embed" font-family="var(--mono)">15000 V</tspan></text><text x="96" y="276" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">العامل بعيد</text></svg>`,
   cap:'معدات الحماية للجهد الأعلى من <span class="ltr">15000 V</span>.<br><b>مرّر المؤشر على السكينة والعصا وجهاز الاختبار وأدوات التأريض (أو المسها في الجوال) لتعرف دورها.</b>',
   side:[
    {predict:{q:'ما الأداة التي تظهر في القائمة (ب) ولا تظهر في القائمة (أ)؟',opts:[
     ['العدد اليدوية المعزولة',false,'هذه في القائمتين.'],
     ['أدوات الاختبار',true,'القائمة (ب) تبدأ بها: «أدوات الاختبار و التأريض والعصا اللازمة لتحريك السكاكين الكهربائية».'],
     ['أدوات التأريض',false,'هذه في القائمتين.']]}}
   ],
   body:[
    {book:`<p>في هذه الحالة يلزم توفير معدات الحماية المناسبة، مثل أدوات الاختبار و التأريض والعصا اللازمة لتحريك السكاكين الكهربائية، وقابضات المصهرات والعدد اليدوية المعزولة، والمركبات ذات الأرضيات العازلة.<br>كما ينبغي أن توفر هذه المعدات درجة كافية من السلامة وأن يكون الجهد المقنن لها مناسباً للاستخدام في الدوائر الموجودة.</p>`,ref:'ص 6'},
    {tip:`<p>كلما ارتفع الجهد زادت المسافة التي يقفز فيها الشرر، فيصير «اللمس المعزول» وحده غير كافٍ؛ لذلك تميل القائمة (ب) إلى أدوات <b>تُبعد</b> العامل (العصا لتحريك السكاكين) وأدوات <b>تتأكد</b> قبل العمل (أدوات الاختبار). وكل أداة يجب أن يكون <b>جهدها المقنن</b> مناسباً للدائرة.</p>`},
    {title:'مختبر مصغّر: قارن القائمتين',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل أداة: في أي قائمة ذكرها الكتاب؟ (أ) للجهد من <span class="ltr">600</span> إلى <span class="ltr">15000 V</span>، و(ب) لما فوق <span class="ltr">15000 V</span>.',cats:['القائمة (أ) فقط','القائمة (ب) فقط','في القائمتين'],items:[
     ['قفازات المطاط',0,'مذكورة في (أ) فقط.'],
     ['أدوات الاختبار',1,'مذكورة في (ب) فقط.'],
     ['أدوات التأريض',2,'(أ): «وأدوات التأريض»، و(ب): «أدوات الاختبار و التأريض».'],
     ['العصا اللازمة لتحريك السكاكين الكهربائية',1,'في (ب). أما (أ) ففيها «العصا العازلة».'],
     ['حصير المطاط المتنقل',0,'مذكور في (أ) فقط.'],
     ['العدد اليدوية المعزولة',2,'مذكورة في القائمتين.'],
     ['المركبات ذات الأرضيات العازلة',2,'في (أ) «ذات الأرضية المعزولة»، وفي (ب) «ذات الأرضيات العازلة».']]})}
   ]},

  {st:9,short:'التعريف بالمعدات',title:'٧- التعريف بالمعدات: أ- الطريقة',ref:'ص 6',
   q:'غطاء لوحة كُتب عليه اسمها… ثم نُزع وركّبه فني على لوحة أخرى. ماذا يحدث؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="طرق التعريف بالمعدات" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="التعريف باللون: لكل نظام لون موحد. شرط الكتاب أن تكون طريقة التعريف موحدة لنفس النظام."><rect x="58" y="96" width="70" height="140" rx="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="58" y="96" width="70" height="16" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/></g><g data-tip="التعريف بالمكان أو بلوحة مثبتة على الهيكل الثابت: لا تضيع لأنها لا تُنزع."><rect x="145" y="96" width="70" height="140" rx="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="145" y="96" width="70" height="16" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><rect x="160" y="76" width="40" height="16" rx="2" fill="#E3ECF7" stroke="#2C4A40" stroke-width="2"/><path d="M168 84 h24" stroke="#2C4A40" stroke-width="2"/></g><g data-tip="خطأ: علامة التعريف على باب أو غطاء قابل للنزع؛ قد يُبدَّل الباب من مكانه فتصير العلامة على اللوحة الخطأ."><rect x="250" y="112" width="58" height="124" rx="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5" transform="rotate(8 250 236)"/><rect x="262" y="140" width="34" height="14" fill="#F6C6BC" stroke="#C0392B" stroke-width="2" transform="rotate(8 250 236)"/><path d="M254 104 L314 168 M314 104 L254 168" stroke="#C0392B" stroke-width="4" stroke-linecap="round"/></g><path d="M40 236 H320" stroke="#2C4A40" stroke-width="3"/><text x="93" y="262" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">اللون</text><text x="180" y="262" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">لوحة ثابتة</text><text x="280" y="262" text-anchor="middle" font-size="12" fill="#C0392B" font-weight="700">باب يُنزع</text><text x="180" y="290" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">طريقة موحدة وعلى جزء ثابت</text></svg>`,
   cap:'طرق صحيحة للتعريف، وموضع خاطئ للعلامة.<br><b>مرّر المؤشر على اللوحات الثلاث (أو المسها في الجوال) لتعرف السبب.</b>',
   side:[
    {predict:{q:'أين <b>لا</b> توضع علامة تعريف المعدة؟',opts:[
     ['على أغطية أو أبواب قابلة للنزع',true,'الكتاب (ص 6): لأنه «يحتمل أن تبدل هذه الأغطية والأبواب من أماكنها».'],
     ['في لوحة بيان مثبتة',false,'لوحة البيان من طرق التعريف المذكورة.'],
     ['على الهيكل الثابت للمعدة',false,'الهيكل الثابت لا يُبدَّل، فالعلامة عليه تبقى صحيحة.']]}}
   ],
   body:[
    {book:`<p>يتعين التعريف بالمعدات الكهربائية بالطريقة المناسبة وذلك لمقتضيات السلامة، ويمكن أن يكون ذلك بتعريف المكان، أو اللون، أو الرقم، أو التصميم، أو لوحة بيان، أو وسيلة أخرى بشرط أن تكون طريقة التعريف موحدة لنفس النظام، ويراعى ألا توضع علامات التعريف على أغطية أو أبواب قابلة للنزع حيث يحتمل أن تبدل هذه الأغطية والأبواب من أماكنها.</p>`,ref:'ص 6'},
    {tip:`<p>لماذا التعريف «لمقتضيات السلامة»؟ لأن الفني الذي يفصل دائرة ليعمل عليها يجب أن يكون متأكداً أنه فصل الدائرة الصحيحة. علامة خاطئة أو طريقتان مختلفتان في النظام نفسه قد تجعله يفصل لوحة ويعمل على أخرى ما زالت مكهربة.</p>`},
    {title:'مختبر مصغّر: صح أم خطأ؟',widget:(el,B)=>DCML.tf(el,B,{items:[
     ['اللون والرقم والتصميم وتعريف المكان كلها طرق مقبولة للتعريف.',true,'كلها مذكورة في الكتاب، ومعها لوحة البيان أو وسيلة أخرى.'],
     ['يجوز في النظام الواحد أن نعرّف بعض اللوحات بالألوان وبعضها بطريقة أخرى مختلفة.',false,'الشرط: «أن تكون طريقة التعريف موحدة لنفس النظام».'],
     ['أنسب مكان لعلامة التعريف هو باب اللوحة لأنه أول ما يراه الفني.',false,'الأبواب القابلة للنزع قد تُبدَّل من أماكنها، فلا توضع عليها العلامات.']]})}
   ]},

  {st:10,short:'لوحة البيان',title:'٧- التعريف بالمعدات: ب- لوحة البيان',ref:'ص 6',
   q:'محرك قديم في المستودع بلا أي كتابة عليه… هل تعرف جهده قبل أن توصله؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="محرك عليه لوحة بيان" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBEBDD"/><g data-tip="المعدة: محرك كهربائي مثلاً."><rect x="60" y="150" width="130" height="80" rx="14" fill="#4FB3A9" stroke="#2C4A40" stroke-width="3"/><path d="M76 150 v80 M92 150 v80 M108 150 v80" stroke="#2C4A40" stroke-width="2"/><rect x="190" y="182" width="30" height="14" fill="#2C4A40"/><path d="M80 230 l-8 16 h108 l-8 -16" fill="#9AA5A0" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round"/></g><g data-tip="لوحة البيان: لوحة مثبتة على المعدة تبين المواصفات القياسية الخاصة بها. الخطوط هنا رمز للبيانات، لا أرقام فعلية."><rect x="132" y="162" width="44" height="28" rx="2" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><path d="M176 176 L218 102" stroke="#2C4A40" stroke-width="1.5" stroke-dasharray="4 3"/><rect x="200" y="52" width="110" height="78" rx="6" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M214 72 h82 M214 88 h60 M214 104 h72 M214 118 h48" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/></g><text x="255" y="148" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">لوحة البيان</text><text x="180" y="282" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">لكل معدة لوحة بيان</text></svg>`,
   cap:'لوحة البيان مكبّرة فوق المحرك.<br><b>مرّر المؤشر على المحرك واللوحة (أو المسها في الجوال) لتعرف معناهما.</b>',
   side:[
    {predict:{q:'أي المعدات تُزوَّد بلوحة بيان حسب الكتاب؟',opts:[
     ['المعدات الكبيرة فقط',false,'الكتاب يقول «جميع المعدات».'],
     ['جميع المعدات',true,'الكتاب (ص 6): «وينبغي تزويد جميع المعدات بلوحة بيان للمواصفات القياسية الخاصة بها».'],
     ['المعدات المستوردة فقط',false,'لم يفرّق الكتاب بين مستورد ومحلي.']]}}
   ],
   body:[
    {book:`<p>وينبغي تزويد جميع المعدات بلوحة بيان للمواصفات القياسية الخاصة بها.</p>`,ref:'ص 6'},
    {add:`<p>تحمل لوحة البيان عادة: اسم الشركة الصانعة، والرقم التسلسلي، والجهد المقنن، والتيار المقنن، والقدرة، والتردد، وللمحركات السرعة. من غيرها لا يعرف الفني الجهد المناسب للمعدة ولا حمايتها المناسبة.</p>`},
    {title:'مختبر مصغّر: لماذا لوحة البيان؟',widget:(el,B)=>DCML.cases(el,B,{cases:[
     {q:'وجدت محركاً بلا لوحة بيان، وتريد تشغيله. ما أكبر خطر؟',opts:[['أن يكون لونه غير مناسب',false,'اللون لا يغير شيئاً في التشغيل.'],['أن توصله على جهد غير جهده فيتلف أو يسبب حادثاً',true,'لوحة البيان تبين المواصفات القياسية، ومنها الجهد الذي صُمم له.'],['لا خطر ما دام المحرك يدور باليد',false,'دورانه باليد لا يخبرك بجهده ولا بقدرته.']]}]})}
   ]},

  {st:11,short:'أسئلة الوحدة',title:'أسئلة الوحدة الأولى',ref:'ص 7–8',
   q:'هل تستطيع الإجابة قبل أن تفتح الإجابة المقترحة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ثلاثة أنواع من أسئلة الوحدة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E3ECF7"/><rect x="96" y="54" width="168" height="214" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><g data-tip="أسئلة مقالية (س١ إلى س٧، ص 7): اكتب الإجابة بكلماتك."><circle cx="238" cy="88" r="11" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/><text x="238" y="93" text-anchor="middle" font-size="13" font-weight="700" fill="#FBF6EE">؟</text><path d="M120 84 h96 M120 98 h72" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/></g><g data-tip="أكمل مكان النقاط (س١ إلى س٨، ص 7): ضع الكلمة الناقصة."><path d="M150 140 h76" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><path d="M120 140 h22" stroke="#E8735A" stroke-width="3" stroke-dasharray="3 3"/><path d="M120 156 h48" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><path d="M176 156 h40" stroke="#E8735A" stroke-width="3" stroke-dasharray="3 3"/></g><g data-tip="صح أو خطأ (س١ إلى س١١، ص 8): ضع علامة ✓ أو ✗."><rect x="120" y="196" width="20" height="20" rx="3" fill="#BFE3DC" stroke="#12855A" stroke-width="2"/><path d="M124 206 l4 4 l8 -8" fill="none" stroke="#12855A" stroke-width="2.5"/><path d="M150 206 h70" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><rect x="120" y="226" width="20" height="20" rx="3" fill="#F6C6BC" stroke="#C0392B" stroke-width="2"/><path d="M125 231 l10 10 M135 231 l-10 10" stroke="#C0392B" stroke-width="2.5"/><path d="M150 236 h54" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/></g><text x="180" y="296" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">مقالي · إكمال · صح وخطأ</text></svg>`,
   cap:'أسئلة الوحدة ثلاثة أنواع.<br><b>مرّر المؤشر على كل جزء من الورقة (أو المسه في الجوال) لتعرف نوعه.</b>',
   side:[
    {predict:{q:'في سؤال الإكمال س٥: «من جهد ٦٠٠ فولت إلى ١٥٠٠». ما الصواب حسب الشرح؟',opts:[
     ['إلى <span class="ltr">1500</span> فولت كما في السؤال',false,'الشرح في ص 5 يذكر رقماً آخر.'],
     ['إلى <span class="ltr">15000</span> فولت',true,'ص 5: «عندما يكون الجهد من 600 فولت إلى 15000 فولت بين الأوجه».'],
     ['إلى <span class="ltr">250</span> فولت',false,'<span class="ltr">250 V</span> حد المعدات المتنقلة.']]}}
   ],
   body:[
    {tip:`<p>اضغط على السؤال لترى إجابة مقترحة. الكتاب لا يعطي إجابات. حاول أولاً أن تجيب بنفسك، ثم قارن.</p>`},
    {html:QU1()}
   ]},

  {recap:[
   'القواعد العامة: تركيب يمنع التماس والحريق، ومواد مطابقة للجهد والحمل والمواصفات، وأفراد مؤهلون، وفحص قبل التشغيل، وكتيب سلامة للعمال (ص 3–4).',
   'تُؤرَّض الأجزاء المعدنية غير الحاملة للتيار والأسوار والحواجز، بموصلات منخفضة المقاومة تنقل تيار القصر بأمان (ص 4).',
   'المعدات المتنقلة: هيكل مؤرّض، وجهد لا يزيد عن <span class="ltr">250 V</span> بين أي موصل والأرض، ونوع مانع للهب في الأماكن القابلة للاشتعال؛ وفوق <span class="ltr">600 V</span> قصر تأريضي أثناء الصيانة (ص 5).',
   'مكان العمل: عرض لا يقل عن <span class="ltr">90 cm</span> وارتفاع <span class="ltr">2 m</span>؛ والقائمة (أ) من <span class="ltr">600</span> إلى <span class="ltr">15000 V</span>، والقائمة (ب) لما فوق <span class="ltr">15000 V</span> (ص 5–6).',
   'التعريف بطريقة موحدة وليس على أبواب تُنزع، ولوحة بيان لكل معدة (ص 6).']}
],
 theory:[
  {h:'١-٢ القواعد العامة المطلوبة في تركيب وصيانة المعدات الكهربائية',ref:'ص 3–4',html:`<ol style="list-style:none;padding-inline-start:4px">
   <li><b>أ-</b> يراعى في إنشاء وتركيب وصيانة جميع المعدات الكهربائية أن تركب على نحو يمنع حدوث تماسها مع الموصلات المكهربة، كما يلزم اتخاذ الاحتياطات الكفيلة بمنع نشوب الحرائق.</li>
   <li><b>ب-</b> يتم اختيار المواد الخاصة بجميع المعدات الكهربائية على أساس جهد التشغيل والحمل وأية شروط أخرى خاصة متعلقة بسلامة التشغيل. ويجب أن تكون هذه المعدات مطابقة للمواصفات الموحدة التي تقررها الهيئة المختصة وأن تحمل العلامات المبينة لذلك.</li>
   <li><b>ج-</b> لا يجوز لغير الأفراد المستوفين لشروط الخبرة والمعرفة الفنية وغير ذلك من المتطلبات التي تحددها الهيئات المختصة القيام بتركيب أو ضبط أو فحص أو إصلاح المعدات أو الدوائر الكهربائية.</li>
   <li><b>د-</b> بعد إتمام التركيبات الجديدة أو توسعة التركيبات القائمة يجب أن يتم فحصها واختبارها من قبل شخص [مختص] وذلك قبل تشغيل تلك التركيبات أو التوسعات. <span class="ref">ص 4</span></li>
   <li><b>هـ-</b> العمال الذين يقومون بتشغيل المعدات الكهربائية أو الذين ينبغي تواجدهم على مقربة من تلك المعدات يجب تزويدهم من قبل المشرفين على العمال بكتيب يتضمن متطلبات السلامة الرئيسة المتعلقة بهم.</li></ol>`},
  {err:'<span class="fixnote">في البند (د) يقول الكتاب «من قبل شخص» وتنقصه صفة؛ والمقصود شخص مختص، فأضفناها بين قوسين.</span>'},
  {h:'١-٣ فحص المعدات',ref:'ص 4',html:`<ul><li><b>أ- المعدات بداخل الخدمة:</b> ينبغي اتباع قواعد السلامة الواردة بهذا الجزء عند فحص المعدات الكهربائية المراد إدخالها بالخدمة، وبعد ذلك تدخل ضمن الفحص والصيانة الدورية. وبالنسبة للمعدات والدوائر الكهربائية المعطوبة فينبغي فصلها نهائياً وإصلاحها.</li>
   <li><b>ب- المعدات الجاهزة للتشغيل:</b> المعدات والدوائر الجاهزة للعمل في وقت الطوارئ يجب فحصها واختبارها بصفة دورية لتقدير صلاحيتها للعمل.</li>
   <li><b>ج- المعدات الجديدة:</b> يراعى فحصها كاملاً واختبارها قبل وضعها بالخدمة.</li>
   <li><b>د- حماية الأجزاء التي تتحرك بطريقة فجائية:</b> يجب حماية وعزل أجزاء الماكينات التي تتحرك بطريقة فجائية والتي من المحتمل أن تتسبب في إصابة الأشخاص القريبين منها بسبب هذه الحركة.</li></ul>`},
  {h:'هـ- التأريض',ref:'ص 4–5',html:`<p><b>أ- تأريض الأجزاء المعدنية غير الحاملة للتيار الكهربائي:</b> ينبغي تأريض جميع الأجزاء المعدنية للمعدات الكهربائية غير الحاملة للتيار مثل <b>هياكل المولدات</b> الكهربائية و<b>لوحات المفاتيح</b> وكذلك <b>أغطية المحولات والمفاتيح الكهربائية والمحركات الدافعة للمولدات</b>. ويراعى تأريض جميع العوارض المعدنية (بما فيها <b>الحواجز والأسوار</b>) المقامة حول المعدات الكهربائية تأريضاً فعالاً.</p>
   <p><b>ب- موصلات التأريض:</b> يجب أن تكون موصلات التأريض ذات مقاومة منخفضة كافية؛ لكي تنقل على نحو مأمون أعلى تيار قصر قد ينتج عند حدوث انهيار في عزل المعدات المطلوبة ووقايتها.</p>
   <p><b>ج- المعدات الكهربائية المتنقلة:</b> <span class="ref">ص 5</span> عند استعمال المعدات الكهربائية المتنقلة ذات الأجزاء المعدنية المكشوفة لابد من اتخاذ الاحتياطات التالية:</p>
   <ol><li>يجب تأريض الهياكل المعدنية المكشوفة من هذه المعدات (سواء كانت تعمل على نظام التيار المتغير أو المستمر) بطريقة فعالة.</li>
   <li>يجب ألا يزيد الجهد المستخدم عن ${lt('250 V')} بين أي موصل والأرض سواء في نظام التيار المتغير أو المستمر.</li>
   <li>لا يجوز استخدام تلك المعدات في الأماكن التي تحتوي على مواد قابلة للاشتعال ما لم تكن من النوع المانع للهب أو النوع المأمون.</li>
   <li>يجب توفير معدات التأريض أثناء الصيانة للمعدات الكهربائية أو الموصلات التي تعمل على جهد أعلى من ${lt('600 V')} والتي يتم العمل بها أو حولها بعد فصلها عن مصدر التيار الكهربائي باستخدام مفاتيح أو سكينة فقط، فلا بد من توفير وسائل القصر التأريضي الفعالة (توصيل الخطوط بالأرض) بواسطة أسلاك خاصة تزال بعد إتمام العمل.</li></ol>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> لماذا نؤرّض هيكلاً لا يحمل تياراً؟ لأن العزل قد ينهار فيلمس سلك مكهرب الهيكل. إن كان الهيكل مؤرّضاً بموصل منخفض المقاومة مرّ تيار القصر في الموصل إلى الأرض وفصلت الحماية، بدلاً من أن يمر في جسم من يلمس الهيكل.'},
  {h:'٥- أماكن العمل حول المعدات الكهربائية',ref:'ص 5',html:`<p>لابد من وجود أماكن العمل المناسبة حول المعدات لكي يسهل الوصول إليها، وأن تكون أرضياتها راسخة ومأمونة حول جميع المعدات الكهربائية التي تحتاج إلى ضبط أو فحص دوري، بحيث <b>لا يقل عرض هذه الأماكن عن ${lt('90 cm')} وارتفاعها ${lt('2 m')}</b> خارج منطقة الخطر.</p>`},
  {widget:el=>{el.innerHTML=`<figure class="fig"><div class="svgbox" style="max-width:520px;margin-inline:auto">${panelSVG({V:380,w:90,h:2,gF:1,gK:1,np:1,idDoor:0})}</div><figcaption>رسم توضيحي (ليس من الكتاب): مكان العمل أمام لوحة: عرض ${lt('90 cm')} على الأقل وارتفاع ${lt('2 m')} <span class="ref">ص 5</span></figcaption></figure>`}},
  {h:'٦- معدات السلامة المستخدمة للعمل فوق الأجزاء المكهربة',ref:'ص 5–6',html:`<p><b>أ- عندما يكون الجهد من ${lt('600 V')} إلى ${lt('15000 V')} بين الأوجه:</b> عندما تستدعي ظروف العمل اقتراب الأشخاص العاملين بأجسامهم أو بأية عدد يدوية إلى داخل منطقة الخطر حول الأجزاء المكهربة غير المحمية، فلا بد من توفر معدات السلامة المناسبة مثل: (${LIST_A.join('، ')}) وما شابه هذه الأدوات، مع مراعاة ضرورة فحصها واختبارها بصفة دورية، كما يجب الإبقاء عليها بحالة سليمة وأن تكون مناسبة للجهد المستخدم.</p>
   <p><b>ب- الجهد الأعلى من ${lt('15000 V')} بين الأوجه:</b> <span class="ref">ص 6</span> في هذه الحالة يلزم توفير معدات الحماية المناسبة، مثل أدوات الاختبار والتأريض والعصا اللازمة لتحريك السكاكين الكهربائية، وقابضات المصهرات والعدد اليدوية المعزولة، والمركبات ذات الأرضيات العازلة. كما ينبغي أن توفر هذه المعدات درجة كافية من السلامة وأن يكون الجهد المقنن لها مناسباً للاستخدام في الدوائر الموجودة.</p>`},
  {html:`<div class="tablebox"><table class="tt"><thead><tr><th>الحالة</th><th>ما يذكره الكتاب</th><th>الصفحة</th></tr></thead><tbody>
   <tr><td>معدة متنقلة</td><td>الجهد لا يزيد عن ${lt('250 V')} بين أي موصل والأرض، وتأريض الهيكل</td><td>ص 5</td></tr>
   <tr><td>صيانة بعد الفصل بمفاتيح أو سكينة، والجهد أعلى من ${lt('600 V')}</td><td>وسائل القصر التأريضي بأسلاك خاصة تُزال بعد العمل</td><td>ص 5</td></tr>
   <tr><td>عمل قرب أجزاء مكهربة: من ${lt('600 V')} إلى ${lt('15000 V')}</td><td>القائمة (أ): قفازات وأكمام المطاط، عدد معزولة، حصير مطاط، عصا عازلة …</td><td>ص 5</td></tr>
   <tr><td>عمل قرب أجزاء مكهربة: أعلى من ${lt('15000 V')}</td><td>القائمة (ب): أدوات الاختبار والتأريض، العصا لتحريك السكاكين، قابضات المصهرات …</td><td>ص 6</td></tr></tbody></table></div><p class="sub">جدول تلخيص من عندنا لأرقام الكتاب.</p>`},
  {h:'٧- التعريف بالمعدات',ref:'ص 6',html:`<p><b>أ- الطريقة:</b> يتعين التعريف بالمعدات الكهربائية بالطريقة المناسبة وذلك لمقتضيات السلامة، ويمكن أن يكون ذلك بتعريف <b>المكان، أو اللون، أو الرقم، أو التصميم، أو لوحة بيان</b>، أو وسيلة أخرى، بشرط أن تكون طريقة التعريف موحدة لنفس النظام، ويراعى ألا توضع علامات التعريف على أغطية أو أبواب قابلة للنزع حيث يحتمل أن تبدل هذه الأغطية والأبواب من أماكنها.</p>
   <p><b>ب- لوحة البيان:</b> وينبغي تزويد جميع المعدات بلوحة بيان للمواصفات القياسية الخاصة بها.</p>`},
  {err:'<span class="fixnote">ترقيم القسم ١-٣ في الكتاب مضطرب (أ … هـ، ثم أ، ب، ج تحت التأريض، ثم ينتقل إلى ٥، ٦، ٧). أبقينا عناوين الكتاب كما هي. وفي البند (ج-٣) «ما لم يكن» والصواب «ما لم تكن» (صححناها).</span>'},
  {h:'أسئلة الوحدة الأولى',ref:'ص 7–8',html:`<p class="sub">اضغط على السؤال لترى إجابة مقترحة. الكتاب لا يعطي إجابات.</p>`+QU1()}
 ],
 lab:(el)=>lab12(el),
 quiz:[
  {q:'أقل عرض لمكان العمل حول المعدات الكهربائية التي تحتاج ضبطاً أو فحصاً دورياً هو:',o:['60 سم','90 سم','120 سم','2 متر'],c:1,e:'«لا يقل عرض هذه الأماكن عن 90 سم وارتفاعها 2 متر خارج منطقة الخطر» (ص 5).'},
  {q:'أقصى جهد بين أي موصل والأرض للمعدات الكهربائية المتنقلة:',o:['110 فولت','250 فولت','600 فولت','15000 فولت'],c:1,e:'«يجب ألا يزيد الجهد المستخدم عن 250 فولت بين أي موصل والأرض» (ص 5).'},
  {q:'متى تلزم وسائل القصر التأريضي (توصيل الخطوط بالأرض) أثناء الصيانة؟',o:['دائماً مهما كان الجهد','للجهد الأعلى من 600 فولت بعد الفصل بمفاتيح أو سكينة فقط','للمعدات المتنقلة فقط','للجهد الأقل من 250 فولت'],c:1,e:'(ص 5) البند 4 من احتياطات المعدات.'},
  {q:'قفازات المطاط وأكمام المطاط وحصير المطاط المتنقل من معدات العمل قرب الأجزاء المكهربة في المدى:',o:['أقل من 250 فولت','من 600 إلى 15000 فولت بين الأوجه','أعلى من 15000 فولت فقط','لا علاقة لها بالجهد'],c:1,e:'القائمة (أ) في ص 5.'},
  {q:'لماذا لا توضع علامات التعريف على الأغطية والأبواب القابلة للنزع؟',o:['لأنها تتسخ بسرعة','لأنه يحتمل أن تُبدَّل هذه الأغطية والأبواب من أماكنها','لأن ذلك أغلى','لأن اللون يتغير'],c:1,e:'(ص 6).'},
  {q:'يجب أن تكون موصلات التأريض:',o:['ذات مقاومة عالية','ذات مقاومة منخفضة كافية لنقل أعلى تيار قصر بأمان','رفيعة قدر الإمكان','معزولة عن الأرض'],c:1,e:'(ص 4) «ذات مقاومة منخفضة كافية؛ لكي تنقل على نحو مأمون أعلى تيار قصر».'}
 ]
});
})(PLCBOOK);
