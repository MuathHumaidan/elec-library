/* Unit 1 — أساسيات الهندسة الميكانيكية (ص 2، 7–16)
   Lessons u1-l1 (الحركة الخطية — مع المقدمة والتمهيد وأهداف الوحدة) and u1-l2 (الحركة الدورانية والعلاقة بين الحركتين). */
(function(B){
const {S}=B;
const PI=Math.PI;
const fm=(x,d)=>B.fmtN(x,d);
const fx=v=>(+v).toFixed(1);
const lt=s=>`<span class="ltr">${s}</span>`;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));

/* ---------- styles used only by this course's lesson files (CSS variables only) ---------- */
(function css(){if(typeof document==='undefined'||document.getElementById('ed1-css'))return;const s=document.createElement('style');s.id='ed1-css';s.textContent=`
.ed-sl{display:flex;flex-direction:column;gap:2px;font-size:13.5px;margin-top:10px;min-width:0}
.ed-sl .ed-h{display:flex;justify-content:space-between;gap:8px;align-items:baseline}
.ed-sl b{font-family:var(--mono);direction:ltr;unicode-bidi:isolate;color:var(--blue-ink);font-size:14px;white-space:nowrap}
.ed-sl input[type=range]{width:100%;accent-color:var(--blue);direction:ltr;margin:4px 0}
.ed-row{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;align-items:center}
.ed-row .sub{margin:0}
.ed-q{border:1px solid var(--line);border-radius:12px;padding:10px 14px;margin:10px 0;background:var(--surface)}
.ed-q summary{cursor:pointer;font-weight:600;line-height:1.7}
.ed-ans{margin-top:8px;border-inline-start:3px solid var(--blue);padding:6px 12px;background:var(--blue-soft);border-radius:0 10px 10px 0}
.ed-chip{display:inline-block;padding:2px 10px;border-radius:999px;font-size:12.5px;font-weight:700;background:var(--surface-2);color:var(--muted)}
.ed-chip.ok{background:var(--on-soft);color:var(--on)}
.ed-chip.ld{background:var(--blue-soft);color:var(--blue-ink)}
.ed-chip.warn{background:var(--stop-soft);color:var(--stop)}
.ed-chip.hot{background:var(--live-soft);color:var(--live)}
.ed-plots{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr));gap:10px}
.ed-chk{width:100%;border-collapse:collapse;font-size:13.5px}
.ed-chk th,.ed-chk td{border-bottom:1px solid var(--line);padding:6px 6px;text-align:center}
.ed-chk td.l{font-family:var(--mono);direction:ltr}
.ed-tbl{overflow-x:auto}
.ed-lab .seg{flex-wrap:wrap;max-width:100%}
.ed-lab .seg button{white-space:nowrap}
.ed-lab .facts{grid-template-columns:repeat(auto-fit,minmax(min(100%,130px),1fr))}
.ed-try{margin:6px 0 0;padding-inline-start:20px}
`;document.head.appendChild(s)})();

/* ---------- small lab helpers (local copies) ---------- */
function loopOn(el,fn){let last=performance.now();const f=now=>{if(!document.body.contains(el))return;const dt=Math.min(0.05,Math.max(0,(now-last)/1000));last=now;try{fn(dt)}catch(e){console.error(e);return}requestAnimationFrame(f)};requestAnimationFrame(f)}
function stepsUI(host,steps){let i=0;
  const draw=()=>{host.innerHTML=steps.map((s,j)=>`<li class="${j<i?'done':j===i?'cur':''}"><span class="k">${j<i?'✓':j+1}</span><div><h4>${s.t}</h4><p>${s.x}</p>${j===i?`<div class="act">${s.done?'<span class="hint">بانتظار تنفيذك…</span> <button class="btn" data-next>تخطَّ</button>':'<button class="btn primary" data-next>التالي</button>'}</div>`:''}</div></li>`).join('')+
    (i>=steps.length?`<li class="cur"><span class="k">✓</span><div><h4>أحسنت، أنهيت التجربة</h4><p style="display:block">جرّب قيماً أخرى، أو أعد التجربة من أولها.</p><div class="act"><button class="btn" data-restart>إعادة التجربة</button></div></div></li>`:'');B.math(host)};
  host.addEventListener('click',e=>{if(e.target.closest('[data-next]')){i++;draw()}if(e.target.closest('[data-restart]')){i=0;draw()}});draw();
  return {check(){const s=steps[i];if(s&&s.done&&s.done()){i++;draw()}},redraw:draw};}
const sl=(id,label,min,max,step,val)=>`<label class="ed-sl"><span class="ed-h"><span>${label}</span><b id="${id}-v"></b></span><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}" aria-label="${label.replace(/<[^>]+>/g,'')}"></label>`;
const segHTML=(attr,items,cur)=>`<div class="seg" role="group">${items.map(([v,l])=>`<button data-${attr}="${v}" aria-pressed="${String(v)===String(cur)}">${l}</button>`).join('')}</div>`;
const segSet=(el,attr,v)=>el.querySelectorAll(`[data-${attr}]`).forEach(b=>b.setAttribute('aria-pressed',String(String(b.dataset[attr])===String(v))));
const segBind=(el,attr,fn)=>el.querySelectorAll(`[data-${attr}]`).forEach(b=>b.addEventListener('click',()=>{segSet(el,attr,b.dataset[attr]);fn(b.dataset[attr])}));
const swHTML=(id,b,label,on)=>`<button class="sw" id="${id}" aria-pressed="${on?'true':'false'}"><span class="knob"></span><b>${b}</b><small>${label}</small></button>`;
const factsHTML=list=>list.map(([l,v])=>`<div class="fact"><span>${l}</span><b>${v}</b></div>`).join('');
const arT=(x,y,s,o)=>{o=o||{};return `<text class="txt ar" x="${x}" y="${y}" text-anchor="${o.a||'middle'}"${o.fs?` font-size="${o.fs}"`:''}${o.col?` style="fill:var(${o.col})"`:''}>${s}</text>`};
const box=(svg,max)=>`<div class="svgbox" style="margin-inline:auto;${max?`max-width:${max}px`:''}">${svg}</div>`;
function arrow(x1,y1,x2,y2,col,w){w=w||2.4;const a=Math.atan2(y2-y1,x2-x1),L=Math.hypot(x2-x1,y2-y1);if(L<3)return '';const h=Math.min(11,L*0.7)+w;
  const bx=x2-h*Math.cos(a),by=y2-h*Math.sin(a),px=-Math.sin(a)*h*0.45,py=Math.cos(a)*h*0.45;
  return `<path d="M${fx(x1)} ${fx(y1)}L${fx(bx)} ${fx(by)}" stroke="var(${col})" stroke-width="${w}" fill="none" stroke-linecap="round"/><path d="M${fx(x2)} ${fx(y2)}L${fx(bx+px)} ${fx(by+py)}L${fx(bx-px)} ${fx(by-py)}Z" fill="var(${col})"/>`}
/* simple SVG x-y plot */
function plotSVG(o){const W=o.w||520,H=o.h||260,L=o.left||50,R=14,T=14,Bm=38;
  const X=x=>L+(x-o.x0)/(o.x1-o.x0)*(W-L-R),Y=y=>H-Bm-(y-o.y0)/(o.y1-o.y0)*(H-T-Bm);
  let s='';(o.yt||[]).forEach(v=>{s+=`<path d="M${L} ${fx(Y(v))}H${W-R}" stroke="var(--line)"/>`+S.t(L-6,fx(Y(v)+4),o.yf?o.yf(v):fm(v),'m','end')});
  (o.xt||[]).forEach(v=>{s+=`<path d="M${fx(X(v))} ${T}V${H-Bm}" stroke="var(--line)" stroke-dasharray="3 3"/>`+S.t(fx(X(v)),H-Bm+15,o.xf?o.xf(v):fm(v),'m')});
  s+=`<path d="M${L} ${T}V${H-Bm}H${W-R}" stroke="var(--fg)" fill="none" stroke-width="1.4"/>`;
  if(o.y0<0&&o.y1>0)s+=`<path d="M${L} ${fx(Y(0))}H${W-R}" stroke="var(--fg)" stroke-width="1"/>`;
  if(o.xl)s+=S.t(W-R,H-4,o.xl,'','end');if(o.yl)s+=S.t(L+4,T+10,o.yl,'','start');
  (o.series||[]).forEach(se=>{if(!se.pts.length)return;s+=`<path d="${se.pts.map((p,i)=>(i?'L':'M')+fx(X(p[0]))+' '+fx(Y(clamp(p[1],o.y0-1e6,o.y1+1e6)))).join('')}" fill="none" stroke="var(${se.col})" stroke-width="${se.w||2.4}" ${se.dash?`stroke-dasharray="${se.dash}"`:''} stroke-linejoin="round"/>`});
  if(o.extra)s+=o.extra(X,Y);
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${o.aria||'منحنى'}">${s}</svg>`}
/* nice axis max */
const niceMax=v=>{v=Math.max(Math.abs(v),1e-6);const e=Math.pow(10,Math.floor(Math.log10(v)));return [1,2,4,8,10].map(k=>k*e).find(k=>k>=v*1.0001)||10*e};
const ticks=(a,b,n)=>{const r=[];for(let i=0;i<=n;i++)r.push(+(a+(b-a)*i/n).toPrecision(6));return r};
const Q=(n,q,ans)=>`<details class="ed-q"><summary>${n}: ${q}</summary><div class="ed-ans"><b>إجابة مقترحة (ليست من الكتاب):</b> ${ans}</div></details>`;
const NOANS='<p class="sub" style="margin-top:0">الكتاب لا يعطي إجابات للأسئلة. اضغط على السؤال لترى إجابة مقترحة.</p>';

/* ======================================================================
   Lesson 1 — الحركة الخطية (مع المقدمة والتمهيد وأهداف الوحدة الأولى)
   ====================================================================== */
const G=9.81;
function linSceneSVG(o){const W=760,H=170,cx=380,k=8,gy=124;let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="عربة على مسار أفقي">`;
  s+=`<rect x="0" y="${gy}" width="${W}" height="${H-gy}" fill="var(--surface-2)"/><path d="M0 ${gy}H${W}" stroke="var(--fg)" stroke-width="1.6"/>`;
  const x=o.x,first=Math.floor((x-cx/k)/5)*5;
  for(let d=first;d<=x+cx/k+5;d+=5){const px=cx+(d-x)*k;if(px<-20||px>W+20)continue;s+=`<path d="M${fx(px)} ${gy}v${d%10===0?12:6}" stroke="var(--fg)" stroke-width="1.2"/>`;if(d%10===0)s+=S.t(fx(px),gy+28,d+' m','m')}
  // start marker
  const p0=cx-x*k;if(p0>-10&&p0<W+10)s+=`<path d="M${fx(p0)} ${gy-70}V${gy}" stroke="var(--on)" stroke-width="2" stroke-dasharray="5 4"/>`+arT(fx(p0),gy-76,'نقطة البداية',{fs:11.5,col:'--on'});
  // cart
  s+=`<rect x="${cx-46}" y="${gy-52}" width="92" height="38" rx="6" fill="var(--blue-soft)" stroke="var(--blue)" stroke-width="2"/>`+S.t(cx,gy-28,'m = '+fm(o.m)+' kg','b');
  [cx-28,cx+28].forEach(wx=>{const a=(o.x/0.18)%(2*PI);s+=`<circle cx="${wx}" cy="${gy-9}" r="9" fill="var(--surface)" stroke="var(--fg)" stroke-width="2"/><path d="M${wx} ${gy-9}L${fx(wx+8*Math.cos(a))} ${fx(gy-9+8*Math.sin(a))}" stroke="var(--fg)" stroke-width="1.6"/>`});
  // force arrows
  const fl=v=>clamp(v/2000*110,-130,130);
  if(Math.abs(o.F)>0.5){const L=fl(o.F),x0=o.F>0?cx+46:cx-46;s+=arrow(x0,gy-38,x0+L,gy-38,'--live',3.4)+S.t(fx(x0+L+(o.F>0?8:-8)),gy-42,'F',o.F>0?'':'','middle')}
  if(o.Ffr>0.5){const L=fl(o.Ffr),dir=-Math.sign(o.v||o.F||1),x0=dir>0?cx+46:cx-46;s+=arrow(x0,gy-20,x0+dir*L,gy-20,'--stop',2.6)+S.t(fx(x0+dir*(L+14)),gy-16,'Ffr','m')}
  // velocity arrow
  if(Math.abs(o.v)>0.01){const L=clamp(o.v*6,-150,150);s+=arrow(cx,gy-66,cx+L,gy-66,'--blue',2.4)+S.t(fx(cx+L+(o.v>0?10:-10)),gy-62,'v','b')}
  return s+'</svg>'}
function vertSceneSVG(o){const W=760,H=260,cx=380,top=40,bot=226;let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="رفع ثقل رأسياً بحبل وأسطوانة">`;
  s+=`<path d="M${cx-150} ${top-14}H${cx+150}" stroke="var(--fg)" stroke-width="4"/><path d="M0 ${bot+18}H${W}" stroke="var(--fg)" stroke-width="1.6"/><rect x="0" y="${bot+18}" width="${W}" height="${H-bot-18}" fill="var(--surface-2)"/>`;
  const a=o.h/0.3;s+=`<circle cx="${cx}" cy="${top+6}" r="18" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2"/><path d="M${cx} ${top+6}L${fx(cx+16*Math.cos(a))} ${fx(top+6+16*Math.sin(a))}" stroke="var(--fg)" stroke-width="2"/>`;
  const frac=o.hmax>0?clamp(o.h/o.hmax,0,1):0,by=bot-frac*(bot-top-70);
  s+=`<path d="M${cx+18} ${top+6}V${fx(by-30)}" stroke="var(--fg)" stroke-width="2"/>`;
  s+=`<rect x="${cx+18-30}" y="${fx(by-30)}" width="60" height="44" rx="4" fill="var(--blue-soft)" stroke="var(--blue)" stroke-width="2"/>`+S.t(cx+18,fx(by-4),fm(o.m)+' kg','b');
  s+=arrow(cx+18,by-30,cx+18,by-30-clamp(o.F/60000*90+20,24,90),'--live',3.2)+S.t(cx+40,fx(by-60),'F = mg','');
  s+=arrow(cx+56,by-8,cx+56,by-8+40,'--stop',2.4)+S.t(cx+90,fx(by+24),'mg','m');
  if(o.v>0)s+=arrow(cx-30,by,cx-30,by-46,'--blue',2.2)+S.t(cx-44,fx(by-20),'v','b','end');
  // height scale
  s+=`<path d="M${cx-120} ${bot+14}V${top+40}" stroke="var(--muted)" stroke-width="1"/>`;
  s+=S.t(cx-128,bot+12,'0','m','end')+S.t(cx-128,top+44,fm(o.hmax,1)+' m','m','end');
  s+=`<path d="M${cx-126} ${fx(by+14)}H${cx-114}" stroke="var(--live)" stroke-width="2"/>`+S.t(cx-108,fx(by+18),'h = '+fm(o.h,2)+' m','','start');
  return s+'</svg>'}

B.lesson({
 id:'u1-l1',unit:1,order:1,pages:'2، 7–12، 16',
 title:'الحركة الخطية: السرعة والتسارع والقوة والقدرة',
 summary:'مقدمة الحقيبة وتمهيدها وأهداف الوحدة الأولى، ثم أساسيات الحركة الخطية: القانون الأول للحركة، السرعة الخطية والتسارع، علاقات الحركة بتسارع منتظم، القانون الثاني F = m·a، القوة في الحركة الرأسية F = m·g، والقدرة اللازمة للتحريك P = F·v.',
 stations:[
  {intro:true},

  {st:1,short:'مقدمة الحقيبة',title:'مقدمة الحقيبة: لمن كُتبت هذه الحقيبة؟',ref:'ص 2',
   q:'قبل أن تبدأ: ما اسم هذه الحقيبة، ولأي تخصص كُتبت؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="غلاف الحقيبة: التحريك الكهربائي، تخصص آلات ومعدات كهربائية، الكليات التقنية" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><rect x="92" y="36" width="180" height="236" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><rect x="92" y="36" width="20" height="236" rx="6" fill="#2C4A40"/><text x="192" y="70" text-anchor="middle" font-size="11.5" fill="#2C4A40" direction="rtl">المؤسسة العامة للتدريب</text><text x="192" y="86" text-anchor="middle" font-size="11.5" fill="#2C4A40" direction="rtl">التقني والمهني</text><g data-tip="اسم الحقيبة: موضوعها كيف يحرّك المحرك الكهربائي الآلات ويُتحكم في حركتها."><rect x="124" y="108" width="136" height="46" rx="9" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="192" y="137" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700" direction="rtl">التحريك الكهربائي</text></g><g data-tip="التخصص الذي كُتبت له الحقيبة."><rect x="124" y="168" width="136" height="50" rx="9" fill="#DDEFE6" stroke="#2C4A40" stroke-width="1.6"/><text x="192" y="188" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="600" direction="rtl">تخصص</text><text x="192" y="207" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="600" direction="rtl">آلات ومعدات كهربائية</text></g><text x="192" y="248" text-anchor="middle" font-size="12.5" fill="#2C4A40" direction="rtl">الكليات التقنية</text><text x="180" y="300" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">سبع وحدات تدريبية</text></svg>`,
   cap:'غلاف الحقيبة كما يصفه الكتاب: اسمها والتخصص الذي كُتبت له.<br><b>مرّر المؤشر على البطاقتين الملونتين (أو المسهما في الجوال) لتعرف معناهما.</b>',
   side:[
    {predict:{q:'لمتدربي أي تخصص كُتبت حقيبة «التحريك الكهربائي»؟',opts:[
     ['تخصص الإلكترونيات الصناعية',false,'الكتاب لم يذكر هذا التخصص.'],
     ['تخصص آلات ومعدات كهربائية',true,'نص المقدمة ص 2: «لمتدربي تخصص "آلات ومعدات كهربائية" للكليات التقنية».'],
     ['تخصص التبريد والتكييف',false,'الكتاب لم يذكر هذا التخصص.']]}}
   ],
   body:[
    {book:String.raw`<p>تسعى المؤسسة العامة للتدريب التقني والمهني لتأهيل الكوادر الوطنية المدربة القادرة على شغل الوظائف التقنية والفنية والمهنية المتوفرة في سوق العمل، ويأتي هذا الاهتمام نتيجة للتوجهات السديدة من لدن قادة هذا الوطن التي تصب في مجملها نحو إيجاد وطن متكامل يعتمد ذاتياً على الله ثم على موارده وعلى قوة شبابه المسلح بالعلم والإيمان من أجل الاستمرار قدماً في دفع عجلة التقدم التنموي: لتصل بعون الله تعالى لمصاف الدول المتقدمة صناعياً.</p>
     <p>وتتناول هذه الحقيبة التدريبية "<b>التحريك الكهربائي</b>" لمتدربي تخصص "<b>آلات ومعدات كهربائية</b>" للكليات التقنية موضوعات حيوية تتناول كيفية اكتساب المهارات اللازمة لهذا التخصص.</p>
     <p>والإدارة العامة لتصميم وتطوير المناهج وهي تضع بين يديك هذه الحقيبة التدريبية تأمل من الله عز وجلّ أن تسهم بشكل مباشر في تأصيل المهارات الضرورية اللازمة، بأسلوب مبسط يخلو من التعقيد، مدعم بالتطبيقات والأشكال التي تدعم عملية اكتساب هذه المهارات.</p>`,ref:'ص 2'},
    {tip:String.raw`<p>«التحريك الكهربائي» يعني: كيف نستعمل المحرك الكهربائي لتحريك آلة (مضخة، مروحة، ونش، قطار…)، وكيف نحسب القدرة التي يحتاجها المحرك لذلك. لهذا تبدأ الحقيبة بقوانين الحركة نفسها قبل الحديث عن المحركات.</p>`}
   ]},

  {st:2,short:'تمهيد',title:'تمهيد: ما القيادة الكهربائية؟',ref:'ص 7–8',
   q:'المحرك وحده لا يكفي لتشغيل مضخة أو ونش. ما الحلقات التي تربط المحرك بالآلة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="القيادة الكهربائية: المحرك ثم وسيلة نقل الحركة ثم الآلة، ومعها التحكم في شكل الحركة وسرعتها" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="التحكم: يُضبط شكل الحركة وسرعتها بما يتناسب مع عمل الآلة، وقد يكون عن بعد."><rect x="58" y="50" width="244" height="36" rx="10" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="180" y="73" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">التحكم في شكل الحركة وسرعتها</text></g><line x1="292" y1="86" x2="292" y2="126" stroke="#2C4A40" stroke-width="2" stroke-dasharray="5 4"/><line x1="180" y1="86" x2="180" y2="128" stroke="#2C4A40" stroke-width="2" stroke-dasharray="5 4"/><line x1="76" y1="86" x2="76" y2="124" stroke="#2C4A40" stroke-width="2" stroke-dasharray="5 4"/><g data-tip="المحرك الكهربائي: أداة لتحويل الطاقة الكهربائية إلى طاقة ميكانيكية."><rect x="262" y="130" width="62" height="54" rx="10" fill="#4FB3A9" stroke="#2C4A40" stroke-width="3"/><rect x="250" y="148" width="12" height="18" rx="2" fill="#2C4A40"/><rect x="268" y="184" width="50" height="8" rx="2" fill="#2C4A40"/></g><line x1="250" y1="157" x2="222" y2="157" stroke="#2C4A40" stroke-width="5" stroke-linecap="round"/><g data-tip="وسيلة نقل الحركة: سير بين بكرتين (كما هنا) أو صندوق تروس، ينقل الحركة من المحرك إلى الآلة."><circle cx="210" cy="157" r="13" fill="#8FA39B" stroke="#2C4A40" stroke-width="2.5"/><circle cx="150" cy="157" r="23" fill="#8FA39B" stroke="#2C4A40" stroke-width="2.5"/><line x1="210" y1="144" x2="150" y2="134" stroke="#2C4A40" stroke-width="3"/><line x1="210" y1="170" x2="150" y2="180" stroke="#2C4A40" stroke-width="3"/><circle cx="210" cy="157" r="3" fill="#2C4A40"/><circle cx="150" cy="157" r="4" fill="#2C4A40"/></g><line x1="127" y1="157" x2="104" y2="157" stroke="#2C4A40" stroke-width="5" stroke-linecap="round"/><g data-tip="الآلة أو الجهاز الميكانيكي الذي يُدار: بسيط كمروحة أو مضخة، أو كثير التعقيد كونش كهربائي أو خط إنتاج آلي."><circle cx="76" cy="157" r="30" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M76 157 Q60 140 70 128 Q82 138 76 157Z" fill="#E8735A" stroke="#2C4A40" stroke-width="1.5"/><path d="M76 157 Q98 154 101 168 Q86 172 76 157Z" fill="#E8735A" stroke="#2C4A40" stroke-width="1.5"/><path d="M76 157 Q66 178 52 174 Q58 160 76 157Z" fill="#E8735A" stroke="#2C4A40" stroke-width="1.5"/><circle cx="76" cy="157" r="5" fill="#2C4A40"/></g><text x="293" y="216" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700" direction="rtl">المحرك</text><text x="180" y="216" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700" direction="rtl">نقل الحركة</text><text x="76" y="216" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700" direction="rtl">الآلة</text><text x="180" y="234" text-anchor="middle" font-size="11.5" fill="#2C4A40" direction="rtl">سير أو تروس</text><text x="76" y="234" text-anchor="middle" font-size="11.5" fill="#2C4A40" direction="rtl">مروحة، مضخة…</text><path d="M52 250 v10 h256 v-10" fill="none" stroke="#2C4A40" stroke-width="2"/><text x="180" y="288" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" direction="rtl">القيادة الكهربائية</text></svg>`,
   cap:'القيادة الكهربائية: المحرك ووسيلة نقل الحركة والآلة المُدارة، ومعها التحكم في شكل الحركة وسرعتها.<br><b>مرّر المؤشر على أجزاء الرسمة (أو المسها في الجوال) لتعرف دور كل جزء.</b>',
   side:[
    {predict:{q:'حسب التمهيد، القيادة الكهربائية تمثل العلاقة بين المحرك الكهربائي وبين…',opts:[
     ['شبكة الكهرباء التي تغذيه فقط',false,'التمهيد يتكلم عن العلاقة بين المحرك و<b>الآلة التي يديرها</b>، لا عن الشبكة.'],
     ['المولد الذي ينتج الكهرباء',false,'المولد لا يُذكر هنا؛ الحديث عن الآلة التي يحركها المحرك.'],
     ['الآلة التي يديرها، وما بينهما من أجهزة لنقل الحركة',true,'نص التمهيد ص 7: «العلاقة بين المحرك الكهربائي… وبين الآلة التي يديرها… وكذلك كل ما يتصل بهذه العلاقة من أجهزة لنقل الحركة مثل السيور أو صناديق التروس».']]}}
   ],
   body:[
    {book:String.raw`<p>تعتبر <b>القيادة الكهربائية</b> إحدى الحلقات الرئيسة في علم الطاقة الكهربائية إذ أنها تمثل العلاقة بين المحرك الكهربائي كأداة لتحويل الطاقة الكهربائية إلى طاقة ميكانيكية وبين الآلة التي يديرها أو الجهاز الميكانيكي الذي يحركه وكذلك كل ما يتصل بهذه العلاقة من أجهزة لنقل الحركة مثل السيور أو صناديق التروس. حيث يتم التحكم في شكل وسرعة هذه الحركة بما يتناسب وعمل الآلة سواء أكانت هذه الآلة أو الجهاز الميكانيكي بسيطاً كمروحة أو مضخة مثلاً أو كان كثير التعقيد كونش كهربائي أو خط إنتاج آلي.</p>
     <p>وتكمن أهمية القيادة الكهربائية في أهمية الآلة ودورها في كل من الصناعة بمختلف أنواعها وفي نقل الركاب والبضائع، اللذين يعتبران أساس التنمية الاقتصادية في جميع أرجاء العالم.</p>
     <p>وقد ساعد تطور علم القيادة الكهربائية في تطوير تصميم وأداء الآلة وزيادة إنتاجيتها إلى حد كبير وكذلك تخفيف العمل الجسماني للإنسان أو الاستغناء عنه كلياً في الأوساط الضارة بصحته إذ أمكن التحكم في الآلة عن بعد، ووضعت طرق لاختيار نوع وقدرة المحرك الكهربائي المطلوب لعمل الآلة، وكذلك دراسة خواص عمله وأدائه في مختلف نظم القيادة الكهربائية.</p>`,ref:'ص 7–8'},
    {tip:String.raw`<p>«القيادة الكهربائية» و«التحريك الكهربائي» اسمان لشيء واحد: <b>المحرك + وسيلة نقل الحركة + الآلة المُدارة</b>، مع التحكم في الحركة. فإذا تعطل أي جزء من الثلاثة توقفت الآلة.</p>`},
    {add:String.raw`<p>مضخة ماء في مزرعة: محرك كهربائي، ووصلة أو سير ينقل الدوران، ومضخة ترفع الماء، ولوحة تشغيل فيها مفاتيح التشغيل والإيقاف. هذه كلها معاً «قيادة كهربائية».</p>`,title:'مثال من الواقع'},
    {book:String.raw`<p>هذه الحقيبة تحتوي على سبع وحدات تدريبية، في الوحدة الأولى تم استعراض أساسيات الهندسة الميكانيكية لكل من الحركة الخطية والدورانية والعلاقة بينهما. وفي الوحدة الثانية تم تناول أنواع وطبيعة الأحمال الميكانيكية وكيفية تحديد نقطة التشغيل المستقرة بين المحرك الكهربائي والحمل الميكانيكي وأمثلة لكيفية حساب قدرة المحرك المطلوبة لحمل معين. وتتناول الوحدة الثالثة الخواص الكهربائية لمحركات التيار المستمر والمتردد المستخدمة في التحريك الكهربائي. أما الوحدة الرابعة فستعرض الخواص العامة لمحركات التحريك الكهربائي وطرق الوقاية من ظروف الجو المحيط بها وكذلك فكرة عامة عن كيفية تبريد المحركات. بينما الوحدة الخامسة تتعرض لميزات وعيوب التحريك الكهربائي ونظم تغذية شبكات التحريك. في حين تناولت الوحدة السادسة التعرف على أنواع الفرامل الكهربائية وكيفية تطبيقها على المحركات المختلفة. وأخيراً الوحدة السابعة استعرضت العوامل التي يجب مراعاتها عند اختيار المحرك الكهربائي المناسب لحمل معين.</p>`,ref:'ص 8'},
    {tip:String.raw`<table class="tt"><thead><tr><th>الوحدة</th><th>موضوعها باختصار</th></tr></thead><tbody>
     <tr><td>الأولى</td><td>الحركة الخطية والدورانية والعلاقة بينهما (هذا الدرس والذي يليه)</td></tr>
     <tr><td>الثانية</td><td>الأحمال الميكانيكية ونقطة التشغيل وحساب قدرة المحرك</td></tr>
     <tr><td>الثالثة</td><td>خواص محركات التيار المستمر والمتردد في التحريك</td></tr>
     <tr><td>الرابعة</td><td>الخواص العامة للمحركات ووقايتها وتبريدها</td></tr>
     <tr><td>الخامسة</td><td>ميزات التحريك الكهربائي وعيوبه ونظم تغذيته</td></tr>
     <tr><td>السادسة</td><td>الفرامل الكهربائية</td></tr>
     <tr><td>السابعة</td><td>اختيار المحرك المناسب لحمل معين</td></tr></tbody></table>`,title:'الوحدات السبع في جدول'}
   ]},

  {st:3,short:'أهداف الوحدة',title:'الوحدة الأولى: الهدف العام والأهداف التفصيلية',ref:'ص 9–10',
   q:'ما الذي يُنتظر منك أن تعرفه حين تنتهي من الوحدة الأولى؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="أهداف الوحدة الأولى الثلاثة، والأول مظلل لأنه موضوع هذا الدرس" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><text x="180" y="44" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" direction="rtl">أهداف الوحدة الأولى</text><g data-tip="الهدف الأول: يُدرس في هذا الدرس."><rect x="48" y="64" width="264" height="54" rx="12" fill="#F2C14E" stroke="#2C4A40" stroke-width="3"/><circle cx="290" cy="91" r="13" fill="#2C4A40"/><text x="290" y="96" text-anchor="middle" font-size="13" fill="#FBF6EE" font-weight="700" direction="rtl">1</text><text x="168" y="96" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700" direction="rtl">ديناميكا الحركة الخطية</text></g><g data-tip="الهدف الثاني: يُدرس في الدرس التالي."><rect x="48" y="132" width="264" height="54" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="290" cy="159" r="13" fill="#2C4A40"/><text x="290" y="164" text-anchor="middle" font-size="13" fill="#FBF6EE" font-weight="700" direction="rtl">2</text><text x="168" y="164" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="600" direction="rtl">ديناميكا الحركة الدورانية</text></g><g data-tip="الهدف الثالث: يُدرس في الدرس التالي."><rect x="48" y="200" width="264" height="54" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="290" cy="227" r="13" fill="#2C4A40"/><text x="290" y="232" text-anchor="middle" font-size="13" fill="#FBF6EE" font-weight="700" direction="rtl">3</text><text x="168" y="232" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="600" direction="rtl">العلاقة بين الحركتين</text></g><rect x="232" y="278" width="16" height="16" rx="4" fill="#F2C14E" stroke="#2C4A40" stroke-width="1.5"/><text x="172" y="291" text-anchor="middle" font-size="12.5" fill="#2C4A40" direction="rtl">موضوع هذا الدرس</text></svg>`,
   cap:'الأهداف الثلاثة مختصرة في كلمات، والبطاقة الصفراء هي موضوع هذا الدرس.<br><b>مرّر المؤشر على البطاقات (أو المسها في الجوال) لتعرف أين يُدرس كل هدف.</b>',
   side:[
    {predict:{q:'هذا الدرس عن السرعة والتسارع والقوة في خط مستقيم. أي هدف يخدمه؟',opts:[
     ['الهدف الثالث: العلاقة بين الحركتين',false,'هذا في الدرس التالي، بعد دراسة الحركة الدورانية.'],
     ['الهدف الأول: العلاقات الأساسية لديناميكا الحركة الخطية',true,'الدرس كله عن الحركة الخطية، وهذا هو الهدف الأول.'],
     ['الهدف الثاني: ديناميكا الحركة الدورانية',false,'الحركة الدورانية موضوع الدرس التالي.']]}}
   ],
   body:[
    {book:String.raw`<p><b>الهدف العام للوحدة:</b> معرفة العلاقات الأساسية لديناميكا الحركة سواء أكانت الحركة خطية أم دورانية.</p>
     <p><b>الأهداف التفصيلية:</b></p>
     <ol><li>أن يعرف المتدرب العلاقات الأساسية لديناميكا الحركة الخطية.</li><li>أن يعرف المتدرب العلاقات الأساسية لديناميكا الحركة الدورانية.</li><li>أن يعرف المتدرب العلاقة بين الحركة الخطية والحركة الدورانية.</li></ol>`,ref:'ص 10'},
    {tip:String.raw`<p>«ديناميكا الحركة» تعني: القوانين التي تربط الحركة (السرعة والتسارع) بالقوة التي تسببها. هذا الدرس يغطي الهدف الأول، والدرس التالي يغطي الهدفين الثاني والثالث.</p>`}
   ]},

  {st:4,short:'العلاقات الأساسية',title:'العلاقات الأساسية في التحريك الكهربائي',ref:'ص 11',
   q:'المحرك يدور دائماً… فلماذا نحتاج قوانين للحركة الخطية أيضاً؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="المحرك يبذل الطاقة لحمل حركته خطية أو لحمل حركته دورانية" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><g data-tip="المحرك الكهربائي: يبذل الطاقة اللازمة لتأدية التحريك المطلوب."><rect x="140" y="40" width="80" height="48" rx="10" fill="#4FB3A9" stroke="#2C4A40" stroke-width="3"/><text x="180" y="70" text-anchor="middle" font-size="14" fill="#FBF6EE" font-weight="700" direction="rtl">المحرك</text></g><line x1="160" y1="88" x2="114" y2="128" stroke="#2C4A40" stroke-width="2.5"/><polygon points="106,135 111,121 120,131" fill="#2C4A40"/><line x1="200" y1="88" x2="246" y2="128" stroke="#2C4A40" stroke-width="2.5"/><polygon points="254,135 240,131 249,121" fill="#2C4A40"/><g data-tip="حمل حركته خطية: يتحرك على خط مستقيم، أفقياً أو رأسياً."><rect x="28" y="140" width="146" height="110" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><line x1="42" y1="222" x2="160" y2="222" stroke="#2C4A40" stroke-width="3"/><rect x="72" y="188" width="54" height="26" rx="5" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><circle cx="84" cy="217" r="6" fill="#2C4A40"/><circle cx="114" cy="217" r="6" fill="#2C4A40"/><line x1="70" y1="170" x2="138" y2="170" stroke="#E8735A" stroke-width="4" stroke-linecap="round"/><polygon points="152,170 138,163 138,177" fill="#E8735A"/></g><g data-tip="حمل حركته دورانية: يدور حول محور ثابت."><rect x="186" y="140" width="146" height="110" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="259" cy="200" r="30" fill="#8FA39B" stroke="#2C4A40" stroke-width="2.5"/><line x1="259" y1="200" x2="282" y2="181" stroke="#2C4A40" stroke-width="2.5"/><circle cx="259" cy="200" r="5" fill="#2C4A40"/><path d="M220 182 A44 44 0 0 1 290 166" fill="none" stroke="#E8735A" stroke-width="4" stroke-linecap="round"/><polygon points="300,174 284,160 293,176" fill="#E8735A"/></g><text x="101" y="276" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">حركة خطية</text><text x="259" y="276" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">حركة دورانية</text><text x="180" y="302" text-anchor="middle" font-size="12.5" fill="#2C4A40" direction="rtl">لكل نوع قواعده الأساسية</text></svg>`,
   cap:'المحرك يبذل الطاقة لتحريك الحمل، وحركة الحمل المطلوبة إما خطية (يسار) أو دورانية (يمين).<br><b>مرّر المؤشر على المحرك واللوحتين (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'مصعد يرفع الركاب إلى الطابق العاشر بمحرك يدور. ما نوع الحركة المطلوبة <b>للحمل</b> (الصاعدة)؟',opts:[
     ['دورانية، لأن المحرك يدور',false,'المحرك يدور، لكن السؤال عن حركة الحمل نفسه: الصاعدة تتحرك صعوداً.'],
     ['خطية (رأسية)',true,'الصاعدة تتحرك في خط مستقيم إلى أعلى، فحركة الحمل خطية حتى لو كان المحرك يدور. لذلك نحتاج قوانين الحركة الخطية.'],
     ['لا هذه ولا تلك',false,'الحركة المطلوبة للحمل إما خطية أو دورانية كما في نص الكتاب.']]}}
   ],
   body:[
    {book:String.raw`<p>يبذل المحرك الكهربائي الطاقة اللازمة لتأدية التحريك الكهربائي المطلوب سواء أكانت الحركة المطلوبة للحمل <b>خطية</b> أو <b>دورانية</b>، لذا يتعين أن نحدد القواعد الأساسية بديناميكا الحركة لكل من نوعي الحركة.</p>`,ref:'ص 11'},
    {tip:String.raw`<p>المحرك يدور دائماً، لكن ما يهمنا هو <b>حركة الحمل</b>: القطار والمصعد والسير الناقل حركتها خطية، والمروحة والمضخة حركتها دورانية. لذلك يبدأ الكتاب بالحركة الخطية (هذا الدرس)، ثم الدورانية والعلاقة بينهما (الدرس التالي).</p>`}
   ]},

  {st:5,short:'القانون الأول',title:'الحركة الخطية — أ- القانون الأول للحركة',ref:'ص 11',
   q:'عربة تسير على أرض ملساء تماماً بلا أي قوة تؤثر عليها. هل تتوقف وحدها؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="عربة ساكنة تبقى ساكنة، وعربة متحركة تبقى بسرعة ثابتة على خط مستقيم ما لم تؤثر عليها قوة خارجية" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><line x1="70" y1="112" x2="290" y2="112" stroke="#2C4A40" stroke-width="3"/><g data-tip="جسم ساكن: لا قوة خارجية تؤثر عليه، فيبقى ساكناً."><rect x="150" y="80" width="60" height="24" rx="5" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><circle cx="163" cy="107" r="6" fill="#2C4A40"/><circle cx="197" cy="107" r="6" fill="#2C4A40"/></g><text x="180" y="138" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700" direction="rtl">يبقى ساكناً</text><line x1="40" y1="214" x2="320" y2="214" stroke="#2C4A40" stroke-width="3"/><g data-tip="مواضع العربة بعد أزمنة متساوية: المسافات بينها متساوية لأن سرعتها ثابتة."><g opacity=".35"><rect x="50" y="182" width="60" height="24" rx="5" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><circle cx="63" cy="209" r="6" fill="#2C4A40"/><circle cx="97" cy="209" r="6" fill="#2C4A40"/></g><g opacity=".6"><rect x="150" y="182" width="60" height="24" rx="5" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><circle cx="163" cy="209" r="6" fill="#2C4A40"/><circle cx="197" cy="209" r="6" fill="#2C4A40"/></g><rect x="250" y="182" width="60" height="24" rx="5" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><circle cx="263" cy="209" r="6" fill="#2C4A40"/><circle cx="297" cy="209" r="6" fill="#2C4A40"/></g><g data-tip="سهم السرعة ⟦v⟧: طوله واحد في المواضع الثلاثة، أي أن السرعة لا تتغير."><line x1="58" y1="168" x2="94" y2="168" stroke="#4FB3A9" stroke-width="4" stroke-linecap="round"/><polygon points="106,168 94,162 94,174" fill="#4FB3A9"/><line x1="158" y1="168" x2="194" y2="168" stroke="#4FB3A9" stroke-width="4" stroke-linecap="round"/><polygon points="206,168 194,162 194,174" fill="#4FB3A9"/><line x1="258" y1="168" x2="294" y2="168" stroke="#4FB3A9" stroke-width="4" stroke-linecap="round"/><polygon points="306,168 294,162 294,174" fill="#4FB3A9"/><rect x="50" y="158" width="262" height="20" fill="transparent"/></g><text x="180" y="240" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700" direction="rtl">يبقى بسرعة ثابتة على خط مستقيم</text><rect x="54" y="258" width="252" height="34" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="180" y="281" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">ما لم تؤثر عليه قوة خارجية</text></svg>`,
   cap:'الجسم الساكن يبقى ساكناً، والمتحرك يبقى بسرعته واتجاهه، ما دامت لا تؤثر عليه قوة خارجية.<br><b>مرّر المؤشر على العربات والأسهم (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'عربة تتحرك بسرعة ثابتة على خط مستقيم. ماذا تقول عن القوة المحصلة المؤثرة عليها؟',opts:[
     ['كبيرة في اتجاه الحركة، وإلا لتوقفت',false,'هذا اعتقاد شائع لكنه خطأ: القانون الأول يقول إن الحركة بسرعة ثابتة لا تحتاج قوة محصلة.'],
     ['صفر: لا توجد قوة خارجية محصلة تغيّر حالتها',true,'نص الكتاب ص 11: الجسم يبقى «محافظاً على حالته من سكون أو حركة بسرعة ثابتة وعلى خط مستقيم ما لم تؤثر عليه قوة خارجية».'],
     ['تتغير باستمرار مع الزمن',false,'لو تغيرت القوة المحصلة وكانت لا تساوي صفراً لتغيرت السرعة.']]}}
   ],
   body:[
    {book:String.raw`<p>يبقى الجسم محافظاً على حالته من سكون أو حركة بسرعة ثابتة وعلى خط مستقيم ما لم تؤثر عليه قوة خارجية، وتنسب صياغة هذا القانون بهذا الشكل إلى نيوتن.</p>`,ref:'ص 11'},
    {tip:String.raw`<p>القانون يصف حالتين: <b>جسم ساكن يبقى ساكناً</b>، و<b>جسم متحرك يبقى بالسرعة نفسها وفي الاتجاه نفسه</b>. ولا يتغير شيء من ذلك إلا بقوة خارجية. هذه الخاصية تسمى <b>القصور الذاتي</b>: الجسم «يقاوم» تغيير حالته.</p>`},
    {add:String.raw`<p>عندما يفرمل سائق الحافلة فجأة يندفع الركاب إلى الأمام: أجسامهم «تريد» أن تبقى بسرعتها الأولى. وحزام الأمان هو القوة الخارجية التي توقفهم.</p>`,title:'مثال من الواقع'},
    {watch:String.raw`<p>في الواقع لا تبقى العربة تتحرك إلى الأبد لأن هناك قوى خارجية دائماً: الاحتكاك ومقاومة الهواء. هذه القوى هي التي توقفها، لا «تعب» الحركة. (ستعود لهذه الفكرة في التمرين <span class="ltr">(1-2)</span>: لماذا تقل سرعة المحرك بعد فصله؟)</p>`}
   ]},

  {st:6,short:'السرعة الخطية',title:'الحركة الخطية — ب- السرعة الخطية',ref:'ص 11',
   q:'عدّاد السيارة يقرأ سرعة. ما الكميتان اللتان يقارنهما ليعطيك هذا الرقم؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="عربة تقطع مسافة S خلال زمن t، والسرعة هي المسافة مقسومة على الزمن" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><text x="180" y="44" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" direction="rtl">السرعة الخطية <tspan font-family="var(--mono)" direction="ltr" unicode-bidi="embed">v</tspan></text><g data-tip="الزمن ⟦t⟧: الوقت المنقضي بين الموضعين، يقاس بالثانية ⟦s⟧."><circle cx="90" cy="92" r="20" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><line x1="90" y1="92" x2="90" y2="78" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><circle cx="270" cy="92" r="20" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><line x1="270" y1="92" x2="282" y2="100" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><path d="M114 92 H240" stroke="#2C4A40" stroke-width="2" stroke-dasharray="6 4"/><polygon points="250,92 238,86 238,98" fill="#2C4A40"/><text x="180" y="84" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">t</text></g><line x1="40" y1="180" x2="320" y2="180" stroke="#2C4A40" stroke-width="3"/><g opacity=".4"><rect x="62" y="146" width="56" height="26" rx="5" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><circle cx="75" cy="175" r="6" fill="#2C4A40"/><circle cx="105" cy="175" r="6" fill="#2C4A40"/></g><rect x="242" y="146" width="56" height="26" rx="5" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><circle cx="255" cy="175" r="6" fill="#2C4A40"/><circle cx="285" cy="175" r="6" fill="#2C4A40"/><g data-tip="المسافة ⟦S⟧ التي قطعتها العربة بين الموضعين، تقاس بالمتر ⟦m⟧."><line x1="90" y1="196" x2="90" y2="216" stroke="#E8735A" stroke-width="2.5"/><line x1="270" y1="196" x2="270" y2="216" stroke="#E8735A" stroke-width="2.5"/><line x1="92" y1="206" x2="268" y2="206" stroke="#E8735A" stroke-width="3"/><text x="180" y="230" text-anchor="middle" font-size="15" fill="#E8735A" font-weight="700" font-family="var(--mono)" direction="ltr">S</text><rect x="86" y="194" width="188" height="42" fill="transparent"/></g><text x="180" y="266" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">السرعة = المسافة ÷ الزمن</text><text x="180" y="294" text-anchor="middle" font-size="13" fill="#2C4A40" font-family="var(--mono)" direction="ltr">v = dS/dt   (m/s)</text></svg>`,
   cap:'العربة تقطع المسافة <span class="ltr">S</span> خلال الزمن <span class="ltr">t</span>؛ السرعة هي معدل تغير المسافة مع الزمن.<br><b>مرّر المؤشر على الساعتين والخط البرتقالي (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'ما وحدة السرعة الخطية في جدول رموز الكتاب؟',opts:[
     ['m/s²',false,'هذه وحدة التسارع (المحطة التالية).'],
     ['N',false,'النيوتن وحدة القوة.'],
     ['km/h',false,'هذه وحدة شائعة في السيارات، لكن الجدول في ص 12 يعطي وحدة أخرى.'],
     ['m/s',true,'جدول ص 12: السرعة <span class="ltr">v</span> بوحدة <span class="ltr">m/s</span> (متر في الثانية).']]}}
   ],
   body:[
    {book:String.raw`<p>تعرف السرعة الخطية بأنها معدل التغير في المسافة <span class="ltr">(S)</span> خلال وحدة الزمن <span class="ltr">(t)</span></p>
     <div class="eq">$$v=\frac{dS}{dt}$$<span class="eqno">(1-1)</span></div>`,ref:'ص 11'},
    {tip:String.raw`<p>الرمز \(dS/dt\) يعني: «التغير الصغير في المسافة ÷ الزمن الصغير الذي حدث فيه». وإذا كانت السرعة ثابتة فهي ببساطة <b>المسافة الكلية ÷ الزمن الكلي</b>.</p>`},
    {tip:String.raw`<p>كثيراً ما تُعطى السرعة بالكيلومتر في الساعة، فنحوّلها إلى المتر في الثانية بالضرب في \(\frac{1000}{3600}\) (أي القسمة على <span class="ltr">3.6</span>). مثال من الكتاب (المثال <span class="ltr">(2-1)</span> ص 25):</p>
     <div class="eq">$$v=36\times\frac{1000}{3600}=10\ \text{m/s}$$</div>`,title:'تحويل km/h إلى m/s'}
   ]},

  {st:7,short:'التسارع',title:'الحركة الخطية — ج- التسارع',ref:'ص 11',
   q:'سيارة تضغط على الفرامل فتنقص سرعتها. هل لها تسارع؟ وما إشارته؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="تسارع موجب: أسهم السرعة تطول. تسارع سالب: أسهم السرعة تقصر" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><g data-tip="تسارع موجب: السرعة تتزايد، فالسرعة النهائية أكبر من الابتدائية."><rect x="34" y="50" width="292" height="100" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><line x1="56" y1="102" x2="80" y2="102" stroke="#4FB3A9" stroke-width="5" stroke-linecap="round"/><polygon points="92,102 80,95 80,109" fill="#4FB3A9"/><line x1="130" y1="102" x2="182" y2="102" stroke="#4FB3A9" stroke-width="5" stroke-linecap="round"/><polygon points="194,102 182,95 182,109" fill="#4FB3A9"/><line x1="222" y1="102" x2="292" y2="102" stroke="#4FB3A9" stroke-width="5" stroke-linecap="round"/><polygon points="306,102 292,95 292,109" fill="#4FB3A9"/><text x="180" y="78" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">السرعة تتزايد</text><text x="180" y="136" text-anchor="middle" font-size="14" fill="#12855A" font-weight="700" font-family="var(--mono)" direction="ltr">a &gt; 0</text></g><g data-tip="تسارع سالب: السرعة تتناقص، فالسرعة النهائية أصغر من الابتدائية."><rect x="34" y="168" width="292" height="100" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><line x1="56" y1="220" x2="126" y2="220" stroke="#4FB3A9" stroke-width="5" stroke-linecap="round"/><polygon points="140,220 126,213 126,227" fill="#4FB3A9"/><line x1="164" y1="220" x2="216" y2="220" stroke="#4FB3A9" stroke-width="5" stroke-linecap="round"/><polygon points="228,220 216,213 216,227" fill="#4FB3A9"/><line x1="258" y1="220" x2="282" y2="220" stroke="#4FB3A9" stroke-width="5" stroke-linecap="round"/><polygon points="294,220 282,213 282,227" fill="#4FB3A9"/><text x="180" y="196" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">السرعة تتناقص</text><text x="180" y="254" text-anchor="middle" font-size="14" fill="#E8735A" font-weight="700" font-family="var(--mono)" direction="ltr">a &lt; 0</text></g><text x="180" y="300" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-family="var(--mono)" direction="ltr">a = dv/dt   (m/s²)</text></svg>`,
   cap:'الأسهم الزرقاء تمثل السرعة بعد أزمنة متساوية والحركة إلى اليمين: إذا طالت فالتسارع موجب، وإذا قصرت فالتسارع سالب.<br><b>مرّر المؤشر على اللوحتين (أو المسهما في الجوال) لتعرف معناهما.</b>',
   side:[
    {predict:{q:'قطار سرعته <span class="ltr">20 m/s</span> ضغط سائقه على الفرامل فصارت <span class="ltr">10 m/s</span>. التسارع:',opts:[
     ['سالب، لأن السرعة النهائية أصغر من الابتدائية',true,'نص الكتاب ص 11: «التسارع يكون سالباً عندما تكون سرعة الجسم في تناقص».'],
     ['صفر، لأن القطار ما زال يتحرك',false,'التسارع صفر فقط إذا لم تتغير السرعة، وهنا تغيرت.'],
     ['موجب، لأن القطار يتحرك إلى الأمام',false,'إشارة التسارع تتبع تغير السرعة لا اتجاه الحركة: السرعة نقصت.']]}}
   ],
   body:[
    {book:String.raw`<p>يعرف التسارع بأنه معدل التغير في السرعة خلال وحدة الزمن.</p>
     <div class="eq">$$a=\frac{dv}{dt}$$<span class="eqno">(1-2)</span></div>
     <ol><li>التسارع يكون موجباً عندما تكون سرعة الجسم في تزايد، أي أن السرعة النهائية أكبر من السرعة الابتدائية.</li>
     <li>التسارع يكون سالباً عندما تكون سرعة الجسم في تناقص، أي أن السرعة النهائية أصغر من السرعة الابتدائية.</li></ol>`,ref:'ص 11'},
    {tip:String.raw`<p>وحدة التسارع <span class="ltr">m/s²</span> تعني: «كم <span class="ltr">m/s</span> تزيد السرعة كل ثانية». فتسارع <span class="ltr">0.5 m/s²</span> (المثال <span class="ltr">(2-1)</span> ص 25) معناه أن سرعة القطار تزيد نصف متر في الثانية كل ثانية.</p>
     <p>وهناك حالة ثالثة: إذا <b>لم تتغير السرعة</b> فالتسارع <b>صفر</b>، وهي الحالة التي يصفها القانون الأول (المحطة الخامسة).</p>`},
    {watch:String.raw`<p>لا تخلط بين <b>السرعة</b> و<b>التسارع</b>: قطار يسير بسرعة كبيرة ثابتة تسارعه صفر، وقطار يبدأ من السكون سرعته صفر في اللحظة الأولى لكن تسارعه موجب.</p>`}
   ]},

  {st:8,short:'التسارع المنتظم',title:'الحركة الخطية — د- علاقات التحريك الخطي لجسم يتحرك بتسارع منتظم',ref:'ص 11–12',
   q:'قطار يبدأ من السكون ويزيد سرعته بانتظام. كيف تعرف سرعته والمسافة التي قطعها بعد زمن معين دون أن تقيسهما؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="منحنى السرعة مع الزمن بتسارع منتظم: خط مستقيم يبدأ من السرعة الابتدائية، والمساحة تحته هي المسافة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="المساحة تحت خط السرعة تساوي المسافة المقطوعة ⟦S⟧."><path d="M70 196 L290 84 L290 250 L70 250Z" fill="#F2C14E" opacity=".55"/><text x="210" y="214" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">S</text></g><line x1="70" y1="250" x2="320" y2="250" stroke="#2C4A40" stroke-width="2.5"/><polygon points="330,250 318,244 318,256" fill="#2C4A40"/><line x1="70" y1="250" x2="70" y2="50" stroke="#2C4A40" stroke-width="2.5"/><polygon points="70,40 64,52 76,52" fill="#2C4A40"/><text x="322" y="238" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-family="var(--mono)" direction="ltr">t (s)</text><text x="88" y="46" text-anchor="start" font-size="12.5" fill="#2C4A40" font-family="var(--mono)" direction="ltr">v (m/s)</text><g data-tip="خط السرعة: مستقيم لأن التسارع ⟦a⟧ ثابت (منتظم)، وميله هو التسارع."><line x1="70" y1="196" x2="290" y2="84" stroke="#4FB3A9" stroke-width="5" stroke-linecap="round"/></g><g data-tip="مثلث الميل: الارتفاع ÷ القاعدة = التغير في السرعة ÷ الزمن = التسارع ⟦a⟧."><path d="M150 155 H210 V125" fill="none" stroke="#E8735A" stroke-width="2.5" stroke-dasharray="5 3"/><text x="222" y="146" text-anchor="start" font-size="15" fill="#E8735A" font-weight="700" font-family="var(--mono)" direction="ltr">a</text><rect x="146" y="120" width="92" height="40" fill="transparent"/></g><g data-tip="السرعة الابتدائية ⟦v0⟧: سرعة الجسم عند ⟦t = 0⟧."><circle cx="70" cy="196" r="6" fill="#2C4A40"/><text x="58" y="201" text-anchor="end" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">v₀</text></g><g data-tip="السرعة النهائية ⟦v⟧ بعد الزمن ⟦t⟧."><circle cx="290" cy="84" r="6" fill="#2C4A40"/><text x="290" y="70" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">v</text><line x1="290" y1="90" x2="290" y2="250" stroke="#2C4A40" stroke-width="1.5" stroke-dasharray="4 4"/><text x="290" y="268" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">t</text></g><text x="180" y="302" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="600" direction="rtl">السرعة مع الزمن بتسارع منتظم</text></svg>`,
   cap:'بتسارع منتظم يكون خط السرعة مستقيماً: يبدأ من <span class="ltr">v₀</span> وميله <span class="ltr">a</span>، والمساحة الصفراء تحته هي المسافة <span class="ltr">S</span>.<br><b>مرّر المؤشر على الخط والمثلث والمساحة والنقطتين (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'جسم بدأ من السكون بتسارع منتظم. إذا مضى ضعف الزمن، فإن <b>سرعته</b>:',opts:[
     ['تصبح ضعف ما كانت',true,String.raw`من المعادلة الأولى \(v=v_0+a\times t\) ومع \(v_0=0\): السرعة تتناسب مع الزمن، فضعف الزمن = ضعف السرعة.`],
     ['تبقى كما هي',false,'التسارع منتظم ولا يساوي صفراً، فالسرعة تزيد مع الزمن.'],
     ['تصبح أربعة أضعاف',false,String.raw`هذا يحدث للمسافة لا للسرعة: \(S=\tfrac12 a t^2\) تتناسب مع مربع الزمن.`]]}}
   ],
   body:[
    {book:String.raw`<div class="eq">$$\begin{cases} v=v_0+a\times t \\ S=v_0\times t+\tfrac{1}{2}\times a\times t^2 \\ v^2=v_0^2+2\times a\times S \end{cases}$$<span class="eqno">(1-3)</span></div>`,ref:'ص 11–12'},
    {tip:String.raw`<ul><li><b>المعادلة الأولى</b> تعطي السرعة بعد زمن \(t\).</li><li><b>الثانية</b> تعطي المسافة المقطوعة خلال \(t\).</li><li><b>الثالثة</b> تربط السرعة بالمسافة مباشرة دون الحاجة إلى الزمن.</li></ul>
     <p>كلها صحيحة فقط إذا كان التسارع <b>ثابتاً</b> (منتظماً) طوال المدة.</p>`,title:'متى أستعمل كل معادلة؟'},
    {title:'حرّك الزمن: قطار المثال (2-1)',widget:(el,B)=>{
      const a=0.5;let t=10;
      el.innerHTML=`<p class="sub" style="margin:0 0 6px">قطار يبدأ من السكون \\(v_0=0\\) بتسارع ثابت \\(a=0.5\\ \\text{m/s}^2\\) (من المثال <span class="ltr">(2-1)</span> ص 25). اسحب الزمن وتابع المعادلات <span class="ltr">(1-3)</span>.</p>
       <label class="w-sl"><span>الزمن منذ بدء الحركة <span class="ltr">t = <b data-o="t"></b> s</span></span><input type="range" min="0" max="20" step="1" value="${t}" dir="ltr" aria-label="الزمن"></label>
       <div class="w-facts"><div><span>السرعة <bdi dir="ltr">v = v₀ + a·t</bdi></span><b data-o="v"></b></div><div><span>السرعة بالـ <bdi dir="ltr">km/h</bdi></span><b data-o="k"></b></div><div><span>المسافة <bdi dir="ltr">S = ½·a·t²</bdi></span><b data-o="s"></b></div><div><span>تحقق <bdi dir="ltr">v² = 2·a·S</bdi></span><b data-o="c"></b></div></div>
       <p class="sub" data-o="m" style="margin-top:8px"></p>`;
      const o=k=>el.querySelector(`[data-o="${k}"]`),rg=el.querySelector('input');
      const draw=()=>{const v=a*t,S=0.5*a*t*t;o('t').textContent=t;o('v').textContent=B.fmtN(v,1)+' m/s';o('k').textContent=B.fmtN(v*3.6,1)+' km/h';o('s').textContent=B.fmtN(S,1)+' m';o('c').textContent=B.fmtN(v*v,2)+' = '+B.fmtN(2*a*S,2);
        o('m').innerHTML=t===20?'بعد <span class="ltr">20 s</span> وصلت السرعة إلى <span class="ltr">10 m/s = 36 km/h</span>: هذه معطيات المثال <span class="ltr">(2-1)</span> نفسها.':t===0?'عند <span class="ltr">t = 0</span> القطار ساكن: السرعة والمسافة صفر.':'لاحظ: السرعة تزيد بانتظام، أما المسافة فتزيد أسرع فأسرع (مع مربع الزمن).'};
      rg.oninput=()=>{t=+rg.value;draw()};draw();B.math(el);
    }},
    {watch:String.raw`<p>إذا بدأ الجسم من السكون فاكتب \(v_0=0\)، فتصبح المعادلات أبسط: \(v=a\,t\) و \(S=\tfrac12 a\,t^2\) و \(v^2=2\,a\,S\). ولا تنسَ تحويل السرعة إلى <span class="ltr">m/s</span> قبل التعويض.</p>`}
   ]},

  {st:9,short:'القانون الثاني',title:'الحركة الخطية — هـ- القانون الثاني للحركة',ref:'ص 12',
   q:'لماذا يحتاج قطار محمّل إلى محرك أقوى من قطار فارغ ليصل إلى السرعة نفسها في الزمن نفسه؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="يساراً: قوة أفقية F تكسب العربة تسارعاً a. يميناً: ثقل يُرفع رأسياً بقوة F تساوي وزنه m g" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><line x1="24" y1="196" x2="176" y2="196" stroke="#2C4A40" stroke-width="3"/><g data-tip="جسم كتلته ⟦m⟧ يتحرك أفقياً."><rect x="50" y="150" width="64" height="38" rx="6" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><circle cx="64" cy="190" r="6" fill="#2C4A40"/><circle cx="100" cy="190" r="6" fill="#2C4A40"/><text x="82" y="175" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">m</text></g><g data-tip="القوة ⟦F⟧ بالنيوتن تؤثر على الجسم."><line x1="114" y1="168" x2="150" y2="168" stroke="#E8735A" stroke-width="5" stroke-linecap="round"/><polygon points="164,168 150,160 150,176" fill="#E8735A"/><text x="150" y="156" text-anchor="middle" font-size="15" fill="#E8735A" font-weight="700" font-family="var(--mono)" direction="ltr">F</text></g><g data-tip="التسارع ⟦a⟧ الذي تكسبه القوة للجسم: في نفس اتجاه القوة."><line x1="58" y1="128" x2="100" y2="128" stroke="#4FB3A9" stroke-width="4" stroke-linecap="round"/><polygon points="112,128 100,121 100,135" fill="#4FB3A9"/><text x="82" y="118" text-anchor="middle" font-size="15" fill="#4FB3A9" font-weight="700" font-family="var(--mono)" direction="ltr">a</text></g><line x1="214" y1="44" x2="330" y2="44" stroke="#2C4A40" stroke-width="5"/><circle cx="270" cy="58" r="11" fill="#8FA39B" stroke="#2C4A40" stroke-width="2"/><line x1="270" y1="69" x2="270" y2="140" stroke="#2C4A40" stroke-width="2.5"/><g data-tip="ثقل كتلته ⟦m⟧ يُرفع رأسياً."><rect x="244" y="140" width="52" height="42" rx="5" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="270" y="167" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">m</text></g><g data-tip="القوة ⟦F⟧ في الحبل: في الحركة الرأسية تساوي ⟦m·g⟧."><line x1="312" y1="176" x2="312" y2="132" stroke="#E8735A" stroke-width="5" stroke-linecap="round"/><polygon points="312,118 304,132 320,132" fill="#E8735A"/><text x="324" y="150" text-anchor="start" font-size="15" fill="#E8735A" font-weight="700" font-family="var(--mono)" direction="ltr">F</text></g><g data-tip="وزن الثقل ⟦m·g⟧: الجاذبية تشده إلى أسفل، ⟦g = 9.81 m/s²⟧."><line x1="228" y1="150" x2="228" y2="196" stroke="#557A6E" stroke-width="5" stroke-linecap="round"/><polygon points="228,210 220,196 236,196" fill="#557A6E"/><text x="216" y="190" text-anchor="end" font-size="14" fill="#557A6E" font-weight="700" font-family="var(--mono)" direction="ltr">mg</text></g><text x="100" y="236" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">حركة أفقية</text><text x="270" y="236" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">حركة رأسية</text><text x="100" y="264" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">F = m·a</text><text x="270" y="264" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">F = m·g</text><text x="100" y="288" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-family="var(--mono)" direction="ltr">(1-4)</text><text x="270" y="288" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-family="var(--mono)" direction="ltr">(1-5)</text></svg>`,
   cap:'يساراً: القوة <span class="ltr">F</span> تكسب الجسم تسارعاً <span class="ltr">a</span> في اتجاهها. يميناً: في الحركة الرأسية القوة اللازمة تساوي الوزن <span class="ltr">m·g</span>.<br><b>مرّر المؤشر على الأسهم والأجسام (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'أثّرت القوة نفسها على جسم كتلته ضعف كتلة جسم آخر. تسارع الجسم الأثقل:',opts:[
     ['ضعف تسارع الأخف',false,'العكس: الكتلة الأكبر «تقاوم» التغيير أكثر.'],
     ['مساوٍ لتسارع الأخف',false,String.raw`التسارع يعتمد على الكتلة: \(a=F/m\).`],
     ['نصف تسارع الأخف',true,String.raw`من \(F=m\cdot a\): \(a=F/m\)، فإذا تضاعفت الكتلة والقوة ثابتة صار التسارع النصف.`]]}}
   ],
   body:[
    {book:String.raw`<p>إذا أثرت قوة مقدارها <span class="ltr">(F)</span> نيوتن على جسم كتلته <span class="ltr">(m)</span> فإنها تكسبه تسارعاً مقداره <span class="ltr">(a)</span> في نفس اتجاه القوة وفق العلاقة التالية:</p>
     <div class="eq">$$F=m\cdot a$$<span class="eqno">(1-4)</span></div>
     <p>وفي حالة الحركة الرأسية يتحرك الجسم بتسارع الجاذبية الأرضية وتكون القوة اللازمة للتحريك:</p>
     <div class="eq">$$F=m\cdot g$$<span class="eqno">(1-5)</span></div>`,ref:'ص 12'},
    {tip:String.raw`<p>في المثال <span class="ltr">(2-1)</span> ص 25: قطار كتلته <span class="ltr">200 ton</span> يتسارع بـ <span class="ltr">0.5 m/s²</span>:</p>
     <div class="eq">$$F=m\cdot a=200\times10^3\times0.5=1\times10^5\ \text{N}$$</div>
     <p>وفي المثال <span class="ltr">(2-2)</span> ص 25: رفع ثقل <span class="ltr">6000 kg</span> رأسياً:</p>
     <div class="eq">$$F_g=m\cdot g=6000\times9.81=58860\ \text{N}$$</div>`,title:'بأرقام من أمثلة الكتاب'},
    {tip:String.raw`<p>في الرفع الرأسي بسرعة ثابتة يشد الحبل الثقل إلى أعلى بقوة تساوي <b>وزنه</b> \(m\cdot g\): القوتان متساويتان فلا تسارع (هذا هو القانون الأول). لذلك القوة اللازمة للرفع لا تعتمد على سرعة الرفع، أما <b>القدرة</b> فتعتمد عليها (المحطة التالية).</p>`,title:'لماذا F = m·g في الرفع؟'},
    {watch:String.raw`<p>الكتلة في القانون بالكيلوجرام <span class="ltr">kg</span>: إذا أُعطيت بالطن فاضرب في <span class="ltr">1000</span> كما فعل الكتاب في المثال <span class="ltr">(2-1)</span> (\(200\times10^3\)).</p>`}
   ]},

  {st:10,short:'القدرة اللازمة',title:'الحركة الخطية — ح- القدرة اللازمة للتحريك',ref:'ص 12',
   q:'ونشان يرفعان الثقل نفسه، أحدهما بضعف سرعة الآخر. أيهما يحتاج محركاً أكبر؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ثقلان متساويان يُرفعان بالقوة نفسها: الأيمن بضعف السرعة فيحتاج ضعف القدرة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><line x1="56" y1="40" x2="304" y2="40" stroke="#2C4A40" stroke-width="5"/><circle cx="110" cy="54" r="11" fill="#8FA39B" stroke="#2C4A40" stroke-width="2"/><circle cx="250" cy="54" r="11" fill="#8FA39B" stroke="#2C4A40" stroke-width="2"/><line x1="110" y1="65" x2="110" y2="140" stroke="#2C4A40" stroke-width="2.5"/><line x1="250" y1="65" x2="250" y2="140" stroke="#2C4A40" stroke-width="2.5"/><rect x="84" y="140" width="52" height="42" rx="5" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="110" y="167" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">m</text><rect x="224" y="140" width="52" height="42" rx="5" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="250" y="167" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">m</text><g data-tip="القوة ⟦F⟧ نفسها في الحالتين: تساوي وزن الثقل ⟦m·g⟧."><line x1="150" y1="178" x2="150" y2="134" stroke="#E8735A" stroke-width="5" stroke-linecap="round"/><polygon points="150,120 142,134 158,134" fill="#E8735A"/><text x="160" y="150" text-anchor="start" font-size="15" fill="#E8735A" font-weight="700" font-family="var(--mono)" direction="ltr">F</text><line x1="290" y1="178" x2="290" y2="134" stroke="#E8735A" stroke-width="5" stroke-linecap="round"/><polygon points="290,120 282,134 298,134" fill="#E8735A"/><text x="300" y="150" text-anchor="start" font-size="15" fill="#E8735A" font-weight="700" font-family="var(--mono)" direction="ltr">F</text></g><g data-tip="سرعة الرفع ⟦v⟧: الثقل الأيمن يرتفع بضعف سرعة الأيسر."><line x1="70" y1="180" x2="70" y2="162" stroke="#4FB3A9" stroke-width="5" stroke-linecap="round"/><polygon points="70,150 62,162 78,162" fill="#4FB3A9"/><text x="58" y="172" text-anchor="end" font-size="15" fill="#4FB3A9" font-weight="700" font-family="var(--mono)" direction="ltr">v</text><line x1="210" y1="180" x2="210" y2="134" stroke="#4FB3A9" stroke-width="5" stroke-linecap="round"/><polygon points="210,122 202,134 218,134" fill="#4FB3A9"/><text x="198" y="160" text-anchor="end" font-size="15" fill="#4FB3A9" font-weight="700" font-family="var(--mono)" direction="ltr">2v</text></g><g data-tip="القدرة اللازمة ⟦P = F·v⟧ بالواط ⟦W⟧: القوة نفسها بضعف السرعة تحتاج ضعف القدرة."><rect x="62" y="206" width="96" height="40" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="110" y="232" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">P</text><rect x="202" y="206" width="96" height="40" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><text x="250" y="232" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">2P</text></g><text x="180" y="284" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">P = F · v</text></svg>`,
   cap:'الثقلان متساويان فالقوة <span class="ltr">F</span> واحدة، لكن الأيمن يُرفع بضعف السرعة فيحتاج ضعف القدرة.<br><b>مرّر المؤشر على الأسهم والمستطيلين السفليين (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'ونش يرفع ثقلاً بسرعة ثابتة. ضاعفنا سرعة الرفع والثقل كما هو. القدرة اللازمة:',opts:[
     ['تبقى كما هي لأن القوة لم تتغير',false,'القوة لم تتغير فعلاً، لكن القدرة = القوة × السرعة.'],
     ['تتضاعف',true,String.raw`من \(P_L=F\cdot v\): القوة ثابتة (\(m\cdot g\)) والسرعة تضاعفت، فتتضاعف القدرة.`],
     ['تصبح أربعة أضعاف',false,'القدرة تتناسب مع السرعة نفسها لا مع مربعها.'],
     ['تنقص إلى النصف',false,'العكس: زيادة السرعة تزيد القدرة.']]}}
   ],
   body:[
    {book:String.raw`<p>القدرة اللازمة لتحريك جسم خطياً، كتلته <span class="ltr">(m)</span> بسرعة مقدارها <span class="ltr">(v)</span> وبقوة مقدارها <span class="ltr">(F)</span>، يمكن حسابها من العلاقة التالية:</p>
     <div class="eq">$$P_L=F\cdot v$$<span class="eqno">(1-6)</span></div>
     <p>حيث:</p>
     <table class="tt"><thead><tr><th>المصطلح</th><th>رمز المصطلح</th><th>الوحدة</th></tr></thead><tbody>
     <tr><td>المسافة</td><td><span class="ltr">S</span></td><td><span class="ltr">m</span></td></tr>
     <tr><td>السرعة النهائية</td><td><span class="ltr">v</span></td><td><span class="ltr">m/s</span></td></tr>
     <tr><td>السرعة الابتدائية</td><td><span class="ltr">v<sub>0</sub></span></td><td><span class="ltr">m/s</span></td></tr>
     <tr><td>الزمن</td><td><span class="ltr">t</span></td><td><span class="ltr">s</span></td></tr>
     <tr><td>التسارع</td><td><span class="ltr">a</span></td><td><span class="ltr">m/s²</span></td></tr>
     <tr><td>تسارع الجاذبية الأرضية</td><td><span class="ltr">g = 9.81</span></td><td><span class="ltr">m/s²</span></td></tr>
     <tr><td>القوة اللازمة للتحريك</td><td><span class="ltr">F</span></td><td><span class="ltr">N</span></td></tr>
     <tr><td>القدرة اللازمة للتحريك</td><td><span class="ltr">P<sub>L</sub></span></td><td><span class="ltr">W</span></td></tr></tbody></table>`,ref:'ص 12'},
    {title:'غيّر سرعة الرفع: ثقل المثال (2-2)',widget:(el,B)=>{
      const F=58860;let v=1.5;
      el.innerHTML=`<p class="sub" style="margin:0 0 6px">ثقل كتلته <span class="ltr">6000 kg</span> يُرفع رأسياً، فالقوة \\(F=m\\,g=58860\\ \\text{N}\\) (المثال <span class="ltr">(2-2)</span> ص 25). غيّر سرعة الرفع وراقب القدرة.</p>
       <label class="w-sl"><span>سرعة الرفع <span class="ltr">v = <b data-o="v"></b> m/s</span></span><input type="range" min="0" max="3" step="0.1" value="${v}" dir="ltr" aria-label="سرعة الرفع"></label>
       <div class="w-facts"><div><span>القوة <bdi dir="ltr">F = m·g</bdi></span><b data-o="f"></b></div><div><span>القدرة <bdi dir="ltr">P<sub>L</sub> = F·v</bdi></span><b data-o="p"></b></div><div><span>القدرة بالـ <bdi dir="ltr">kW</bdi></span><b data-o="k"></b></div></div>
       <p class="sub" data-o="m" style="margin-top:8px"></p>`;
      const o=k=>el.querySelector(`[data-o="${k}"]`),rg=el.querySelector('input');
      const draw=()=>{const P=F*v;o('v').textContent=B.fmtN(v,1);o('f').textContent=B.fmtN(F)+' N';o('p').textContent=B.fmtN(P,0)+' W';o('k').textContent=B.fmtN(P/1000,2)+' kW';
        o('m').innerHTML=Math.abs(v-1.5)<1e-9?'عند <span class="ltr">1.5 m/s</span> القدرة <span class="ltr">88290 W</span>: نتيجة المثال <span class="ltr">(2-2)</span>.':Math.abs(v-3)<1e-9?'ضعف السرعة <span class="ltr">(3 m/s)</span> = ضعف القدرة، والقوة لم تتغير.':v===0?'الثقل معلّق بلا حركة: القوة موجودة لكن القدرة صفر.':'القوة ثابتة لا تتغير مع السرعة، والقدرة تتناسب مع السرعة.'};
      rg.oninput=()=>{v=+rg.value;draw()};draw();B.math(el);
    }},
    {tip:String.raw`<p>ستحتاج هذه التحويلات كثيراً في الوحدة الثانية: <span class="ltr">1 ton = 1000 kg</span> · <span class="ltr">1 kW = 1000 W</span> · <span class="ltr">1 MW = 10⁶ W</span>. والواط = نيوتن × متر/ثانية.</p>`,title:'تحويلات مفيدة'},
    {watch:String.raw`<p>لا تخلط بين <span class="ltr">S</span> الكبيرة (المسافة) و<span class="ltr">s</span> الصغيرة (وحدة الثانية).</p>`},
    {watch:String.raw`<p>ترقيم الفقرات في الكتاب ينتقل من «هـ» إلى «ح» مباشرة (لا توجد «و» ولا «ز»)، فأبقينا حروف الكتاب كما هي.</p>`,fix:true}
   ]},

  {st:11,short:'أسئلة وتمارين',title:'أسئلة وتمارين متنوعة <span class="ltr">(1-1)</span> إلى <span class="ltr">(1-3)</span>',ref:'ص 16',
   q:'ثلاثة أسئلة من نهاية الوحدة تخص هذا الدرس. هل تستطيع الإجابة قبل أن تفتح الإجابة المقترحة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ثلاث بطاقات للأسئلة 1-1 و1-2 و1-3 ومحطة كل منها" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><g data-tip="السؤال ⟦1-1⟧ عن الأقمار الصناعية: يرجع إلى القانون الأول (المحطة 5)."><rect x="44" y="52" width="272" height="60" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="246" y="66" width="56" height="32" rx="8" fill="#2C4A40"/><text x="274" y="88" text-anchor="middle" font-size="14" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">1-1</text><text x="148" y="88" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="600" direction="rtl">الأقمار الصناعية</text></g><g data-tip="السؤال ⟦1-2⟧ عن المحرك بعد فصله: يرجع إلى القانون الأول والتسارع السالب (المحطتان 5 و7)."><rect x="44" y="128" width="272" height="60" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="246" y="142" width="56" height="32" rx="8" fill="#2C4A40"/><text x="274" y="164" text-anchor="middle" font-size="14" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">1-2</text><text x="148" y="164" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="600" direction="rtl">المحرك بعد فصله</text></g><g data-tip="السؤال ⟦1-3⟧ عن التسارع وإشارته: يرجع إلى المحطة 7."><rect x="44" y="204" width="272" height="60" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="246" y="218" width="56" height="32" rx="8" fill="#2C4A40"/><text x="274" y="240" text-anchor="middle" font-size="14" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">1-3</text><text x="148" y="240" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="600" direction="rtl">التسارع وإشارته</text></g><text x="180" y="296" text-anchor="middle" font-size="13" fill="#2C4A40" direction="rtl">الكتاب لا يعطي إجابات للأسئلة</text></svg>`,
   cap:'الأسئلة الثلاثة مختصرة في كلمات.<br><b>مرّر المؤشر على كل بطاقة (أو المسها في الجوال) لتعرف المحطة التي تساعدك في إجابتها.</b>',
   side:[
    {predict:{q:'(من السؤال <span class="ltr">1-3</span>) متى يكون تسارع الجسم <b>صفراً</b>؟',opts:[
     ['عندما تكون سرعته كبيرة',false,'السرعة الكبيرة قد تكون ثابتة أو متغيرة؛ المهم هل تتغير.'],
     ['عندما تبقى سرعته ثابتة (أو يكون ساكناً)',true,String.raw`التسارع معدل تغير السرعة \(a=dv/dt\)، فإذا لم تتغير السرعة كان صفراً.`],
     ['عندما تتناقص سرعته',false,'هنا التسارع سالب، لا صفر.']]}}
   ],
   body:[
    {book:String.raw`<p><b>1-1:</b> لماذا تدور الأقمار الصناعية بسرعة ثابتة في مداراتها حول الأرض؟</p>
     <p><b>1-2:</b> لماذا تقل سرعة المحرك الكهربائي تدريجياً عند فصله من مصدر التغذية؟</p>
     <p><b>1-3:</b> ما المقصود بالتسارع لجسم ما؟ وما هي وحدته؟ ومتى يكون التسارع موجباً؟ ومتى يكون سالباً؟ ومتى يكون صفراً؟</p>`,ref:'ص 16'},
    {tip:String.raw`<p><b>1-1:</b> لأنه لا توجد في الفضاء تقريباً قوة تعيق حركتها (لا هواء ولا احتكاك)، فحسب <b>القانون الأول للحركة</b> يبقى الجسم محافظاً على سرعته ما لم تؤثر عليه قوة خارجية تغيرها. (جذب الأرض يغيّر اتجاه حركة القمر فقط ليبقيه على مداره ولا يغير مقدار سرعته.)</p>
     <p><b>1-2:</b> بعد الفصل لا يبذل المحرك عزماً، لكن الأجزاء الدوارة تستمر في الحركة بسبب القصور الذاتي (القانون الأول). وتؤثر عليها قوى معيقة: الاحتكاك في المحامل ومقاومة الهواء وعزم الحمل نفسه؛ هذه القوى تكسبها <b>تسارعاً سالباً</b> فتقل السرعة تدريجياً حتى تتوقف.</p>
     <p><b>1-3:</b> التسارع هو معدل التغير في السرعة خلال وحدة الزمن \(a=dv/dt\)، ووحدته <span class="ltr">m/s²</span>. يكون <b>موجباً</b> عندما تتزايد السرعة، و<b>سالباً</b> عندما تتناقص، و<b>صفراً</b> عندما تبقى السرعة ثابتة (أو الجسم ساكن).</p>`,title:'إجابات مقترحة (ليست من الكتاب)'}
   ]},

  {recap:[
   String.raw`القيادة (التحريك) الكهربائية: محرك + وسيلة نقل حركة + آلة مُدارة، مع التحكم في شكل الحركة وسرعتها (ص 7).`,
   String.raw`القانون الأول: الجسم يبقى ساكناً أو بسرعة ثابتة على خط مستقيم ما لم تؤثر عليه قوة خارجية (ص 11).`,
   String.raw`السرعة \(v=dS/dt\) (1-1)، والتسارع \(a=dv/dt\) (1-2): موجب إذا تزايدت السرعة وسالب إذا تناقصت (ص 11).`,
   String.raw`بتسارع منتظم: \(v=v_0+a\,t\) و \(S=v_0\,t+\tfrac12 a\,t^2\) و \(v^2=v_0^2+2\,a\,S\) (1-3) (ص 11–12).`,
   String.raw`القوة \(F=m\cdot a\) (1-4) وفي الرفع الرأسي \(F=m\cdot g\) (1-5)، والقدرة اللازمة \(P_L=F\cdot v\) (1-6) (ص 12).`]}
],
 theory:[
  {h:'مقدمة الحقيبة',ref:'ص 2',html:`<p>«تسعى المؤسسة العامة للتدريب التقني والمهني لتأهيل الكوادر الوطنية المدربة القادرة على شغل الوظائف التقنية والفنية والمهنية المتوفرة في سوق العمل».</p>
   <p>«وتتناول هذه الحقيبة التدريبية "<b>التحريك الكهربائي</b>" لمتدربي تخصص "<b>آلات ومعدات كهربائية</b>" للكليات التقنية موضوعات حيوية تتناول كيفية اكتساب المهارات اللازمة لهذا التخصص» «بأسلوب مبسط يخلو من التعقيد، مدعم بالتطبيقات والأشكال التي تدعم عملية اكتساب هذه المهارات».</p>`},
  {h:'تمهيد',ref:'ص 7–8',html:`<p>«تعتبر <b>القيادة الكهربائية</b> إحدى الحلقات الرئيسة في علم الطاقة الكهربائية إذ أنها تمثل العلاقة بين المحرك الكهربائي كأداة لتحويل الطاقة الكهربائية إلى طاقة ميكانيكية وبين الآلة التي يديرها أو الجهاز الميكانيكي الذي يحركه وكذلك كل ما يتصل بهذه العلاقة من أجهزة لنقل الحركة مثل السيور أو صناديق التروس. حيث يتم التحكم في شكل وسرعة هذه الحركة بما يتناسب وعمل الآلة سواء أكانت هذه الآلة أو الجهاز الميكانيكي بسيطاً كمروحة أو مضخة مثلاً أو كان كثير التعقيد كونش كهربائي أو خط إنتاج آلي.»</p>
   <p>«وتكمن أهمية القيادة الكهربائية في أهمية الآلة ودورها في كل من الصناعة بمختلف أنواعها وفي نقل الركاب والبضائع، اللذين يعتبران أساس التنمية الاقتصادية في جميع أرجاء العالم.»</p>
   <p>«وقد ساعد تطور علم القيادة الكهربائية في تطوير تصميم وأداء الآلة وزيادة إنتاجيتها إلى حد كبير وكذلك تخفيف العمل الجسماني للإنسان أو الاستغناء عنه كلياً في الأوساط الضارة بصحته إذ أمكن التحكم في الآلة عن بعد، ووضعت طرق لاختيار نوع وقدرة المحرك الكهربائي المطلوب لعمل الآلة، وكذلك دراسة خواص عمله وأدائه في مختلف نظم القيادة الكهربائية.»</p>
   <p>«هذه الحقيبة تحتوي على سبع وحدات تدريبية»:</p>
   <ol><li><b>الوحدة الأولى</b>: أساسيات الهندسة الميكانيكية لكل من الحركة الخطية والدورانية والعلاقة بينهما.</li>
   <li><b>الوحدة الثانية</b>: أنواع وطبيعة الأحمال الميكانيكية وكيفية تحديد نقطة التشغيل المستقرة بين المحرك الكهربائي والحمل الميكانيكي وأمثلة لكيفية حساب قدرة المحرك المطلوبة لحمل معين.</li>
   <li><b>الوحدة الثالثة</b>: الخواص الكهربائية لمحركات التيار المستمر والمتردد المستخدمة في التحريك الكهربائي.</li>
   <li><b>الوحدة الرابعة</b>: الخواص العامة لمحركات التحريك الكهربائي وطرق الوقاية من ظروف الجو المحيط بها وفكرة عامة عن كيفية تبريد المحركات.</li>
   <li><b>الوحدة الخامسة</b>: ميزات وعيوب التحريك الكهربائي ونظم تغذية شبكات التحريك.</li>
   <li><b>الوحدة السادسة</b>: أنواع الفرامل الكهربائية وكيفية تطبيقها على المحركات المختلفة.</li>
   <li><b>الوحدة السابعة</b>: العوامل التي يجب مراعاتها عند اختيار المحرك الكهربائي المناسب لحمل معين.</li></ol>`},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب:</b> «القيادة الكهربائية» و«التحريك الكهربائي» اسمان لشيء واحد: المحرك الكهربائي + وسيلة نقل الحركة (سير أو صندوق تروس) + الآلة التي تُدار، مع التحكم في الحركة. لذلك نبدأ بقوانين الحركة نفسها قبل المحركات.'},
  {h:'الوحدة الأولى: أساسيات الهندسة الميكانيكية — الأهداف',ref:'ص 9–10',html:`<p><b>الهدف العام للوحدة:</b> «معرفة العلاقات الأساسية لديناميكا الحركة سواء أكانت الحركة خطية أم دورانية.»</p>
   <p><b>الأهداف التفصيلية:</b></p>
   <ol><li>أن يعرف المتدرب العلاقات الأساسية لديناميكا الحركة الخطية.</li><li>أن يعرف المتدرب العلاقات الأساسية لديناميكا الحركة الدورانية.</li><li>أن يعرف المتدرب العلاقة بين الحركة الخطية والحركة الدورانية.</li></ol>
   <p class="sub">هذا الدرس يغطي الهدف الأول، والدرس التالي (u1-l2) يغطي الهدفين الثاني والثالث.</p>`},
  {h:'العلاقات الأساسية في التحريك الكهربائي',ref:'ص 11',html:`<p>«يبذل المحرك الكهربائي الطاقة اللازمة لتأدية التحريك الكهربائي المطلوب سواء أكانت الحركة المطلوبة للحمل <b>خطية</b> أو <b>دورانية</b>، لذا يتعين أن نحدد القواعد الأساسية بديناميكا الحركة لكل من نوعي الحركة.»</p>`},
  {h:'1- الحركة الخطية',ref:'ص 11',html:`<p><b>أ- القانون الأول للحركة:</b> «يبقى الجسم محافظاً على حالته من سكون أو حركة بسرعة ثابتة وعلى خط مستقيم ما لم تؤثر عليه قوة خارجية، وتنسب صياغة هذا القانون بهذا الشكل إلى نيوتن.»</p>
   <p><b>ب- السرعة الخطية \\((v)\\):</b> «تعرف السرعة الخطية بأنها معدل التغير في المسافة \\((S)\\) خلال وحدة الزمن \\((t)\\)»</p>
   $$v=\\frac{dS}{dt} \\qquad (1\\text{-}1)$$
   <p><b>ج- التسارع \\((a)\\):</b> «يعرف التسارع بأنه معدل التغير في السرعة خلال وحدة الزمن.»</p>
   $$a=\\frac{dv}{dt} \\qquad (1\\text{-}2)$$
   <ol><li>«التسارع يكون <b>موجباً</b> عندما تكون سرعة الجسم في تزايد، أي أن السرعة النهائية أكبر من السرعة الابتدائية.»</li>
   <li>«التسارع يكون <b>سالباً</b> عندما تكون سرعة الجسم في تناقص، أي أن السرعة النهائية أصغر من السرعة الابتدائية.»</li></ol>`},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب:</b> \\(dS/dt\\) تعني «التغير الصغير في المسافة ÷ الزمن الصغير الذي حدث فيه». فإذا قطعت عربة <span class="ltr">20 m</span> في <span class="ltr">4 s</span> بسرعة ثابتة فسرعتها <span class="ltr">5 m/s</span>. وإذا لم تتغير السرعة أبداً فالتسارع <b>صفر</b> — وهي الحالة التي يصفها القانون الأول.'},
  {h:'د- علاقات التحريك الخطي لجسم يتحرك بتسارع منتظم',ref:'ص 11–12',html:`<p>إذا بقي التسارع \\(a\\) ثابتاً، وبدأ الجسم بسرعة ابتدائية \\(v_0\\):</p>
   $$\\begin{cases} v=v_0+a\\times t \\\\ S=v_0\\times t+\\tfrac{1}{2}\\times a\\times t^2 \\\\ v^2=v_0^2+2\\times a\\times S \\end{cases} \\qquad (1\\text{-}3)$$`},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب:</b> المعادلة الأولى تعطي السرعة بعد زمن، والثانية المسافة المقطوعة، والثالثة تربط السرعة بالمسافة دون الزمن. مثال: عربة تبدأ من السكون \\((v_0=0)\\) بتسارع <span class="ltr">0.5 m/s²</span>؛ بعد <span class="ltr">20 s</span>: \\(v=0.5\\times20=10\\ \\text{m/s}\\) و \\(S=\\tfrac12\\times0.5\\times20^2=100\\ \\text{m}\\)، وتحقق: \\(v^2=2\\times0.5\\times100=100\\) أي \\(v=10\\ \\text{m/s}\\). جرّب ذلك في المختبر.'},
  {h:'هـ- القانون الثاني للحركة',ref:'ص 12',html:`<p>«إذا أثرت قوة مقدارها \\((F)\\) نيوتن على جسم كتلته \\((m)\\) فإنها تكسبه تسارعاً مقداره \\((a)\\) في نفس اتجاه القوة وفق العلاقة التالية:»</p>
   $$F=m\\cdot a \\qquad (1\\text{-}4)$$
   <p>«وفي حالة <b>الحركة الرأسية</b> يتحرك الجسم بتسارع الجاذبية الأرضية وتكون القوة اللازمة للتحريك:»</p>
   $$F=m\\cdot g \\qquad (1\\text{-}5)$$`},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب:</b> في الرفع الرأسي يشد الحبل الثقل إلى أعلى بقوة تساوي <b>وزنه</b> \\(m\\cdot g\\) حتى يرتفع بسرعة ثابتة (القوتان متساويتان فلا تسارع، وهذا هو القانون الأول). فرفع <span class="ltr">1000 kg</span> يحتاج قوة \\(1000\\times9.81=9810\\ \\text{N}\\) مهما كانت سرعة الرفع؛ أما القدرة فتزيد مع السرعة كما في المعادلة التالية.'},
  {h:'ح- القدرة اللازمة للتحريك',ref:'ص 12',html:`<p>«القدرة اللازمة لتحريك جسم خطياً، كتلته \\((m)\\) بسرعة مقدارها \\((v)\\) وبقوة مقدارها \\((F)\\)، يمكن حسابها من العلاقة التالية:»</p>
   $$P_L=F\\cdot v \\qquad (1\\text{-}6)$$
   <p>حيث:</p>
   <div class="ed-tbl"><table class="tt"><thead><tr><th>المصطلح</th><th>رمز المصطلح</th><th>الوحدة</th></tr></thead><tbody>
   <tr><td>المسافة</td><td>${lt('S')}</td><td>${lt('m')}</td></tr>
   <tr><td>السرعة النهائية</td><td>${lt('v')}</td><td>${lt('m/s')}</td></tr>
   <tr><td>السرعة الابتدائية</td><td>${lt('v<sub>0</sub>')}</td><td>${lt('m/s')}</td></tr>
   <tr><td>الزمن</td><td>${lt('t')}</td><td>${lt('s')}</td></tr>
   <tr><td>التسارع</td><td>${lt('a')}</td><td>${lt('m/s²')}</td></tr>
   <tr><td>تسارع الجاذبية الأرضية</td><td>${lt('g = 9.81')}</td><td>${lt('m/s²')}</td></tr>
   <tr><td>القوة اللازمة للتحريك</td><td>${lt('F')}</td><td>${lt('N')}</td></tr>
   <tr><td>القدرة اللازمة للتحريك</td><td>${lt('P<sub>L</sub>')}</td><td>${lt('W')}</td></tr></tbody></table></div>`},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب (تحويلات ستحتاجها في الوحدة الثانية):</b> \\(1\\ \\text{ton}=1000\\ \\text{kg}\\) · \\(1\\ \\text{km/h}=\\frac{1000}{3600}=\\frac{5}{18}\\ \\text{m/s}\\) (أي اقسم على 3.6) · \\(1\\ \\text{kW}=1000\\ \\text{W}\\) و \\(1\\ \\text{MW}=10^6\\ \\text{W}\\) · الواط = نيوتن × متر/ثانية.'},
  {h:'أسئلة وتمارين متنوعة (1-1) إلى (1-3)',ref:'ص 16',html:NOANS+
   Q('1-1','لماذا تدور الأقمار الصناعية بسرعة ثابتة في مداراتها حول الأرض؟','لأنه لا توجد في الفضاء تقريباً قوة تعيق حركتها (لا هواء ولا احتكاك)، فحسب <b>القانون الأول للحركة</b> يبقى الجسم محافظاً على سرعته ما لم تؤثر عليه قوة خارجية تغيرها. (جذب الأرض يغيّر اتجاه حركة القمر فقط ليبقيه على مداره الدائري ولا يغير مقدار سرعته.)')+
   Q('1-2','لماذا تقل سرعة المحرك الكهربائي تدريجياً عند فصله من مصدر التغذية؟','بعد الفصل لا يبذل المحرك عزماً، لكن الأجزاء الدوارة تستمر في الحركة بسبب القصور الذاتي (القانون الأول). وتؤثر عليها قوى معيقة: الاحتكاك في المحامل (الكراسي) ومقاومة الهواء وعزم الحمل نفسه؛ هذه القوى تكسبها <b>تسارعاً سالباً</b> فتقل السرعة تدريجياً حتى تتوقف. وكلما كانت الكتلة الدوارة أثقل كان التباطؤ أبطأ. (شاهد ذلك في المختبر بتشغيل «الاحتكاك» مع F = 0.)')+
   Q('1-3','ما المقصود بالتسارع لجسم ما؟ وما هي وحدته؟ ومتى يكون التسارع موجباً؟ ومتى يكون سالباً؟ ومتى يكون صفراً؟','التسارع هو معدل التغير في السرعة خلال وحدة الزمن \\(a=dv/dt\\)، ووحدته <span class="ltr">m/s²</span>. يكون <b>موجباً</b> عندما تتزايد السرعة (السرعة النهائية أكبر من الابتدائية)، و<b>سالباً</b> عندما تتناقص السرعة، و<b>صفراً</b> عندما تبقى السرعة ثابتة (أو الجسم ساكن)، أي عندما تكون محصلة القوى المؤثرة على الجسم صفراً.')},
  {err:'<div class="fixnote"><b>ملاحظات على الكتاب:</b> (1) ص 12: ترقيم الفقرات يقفز من «هـ» إلى «ح» مباشرة (لا توجد «و» ولا «ز»)؛ أبقينا حروف الكتاب. (2) ص 12، جدول الرموز: وحدة الزمن مكتوبة <span class="ltr">S</span> بحرف كبير، والصحيح <span class="ltr">s</span> (الحرف الكبير S هو رمز المسافة في الجدول نفسه) — صُححت في الجدول أعلاه. (3) ص 8: «الحركة الخطية الدورانية» والمقصود «الخطية والدورانية»، و«وأداءه» والصحيح «وأدائه» — صُححتا في النص أعلاه. لا توجد أخطاء حسابية في هذا الدرس.</div>'}
 ],
 lab:(el)=>{
  let mode='h',m=1000,F=500,v0=0,fr=false,run=false,t=0,x=0,v=0,mv=1000,vl=1,hist=[],hT=0;const did={};
  el.innerHTML=`<div id="l1tp"></div><div class="grid ed-lab">
   <div class="panel c12"><h2>مسار الحركة <small>مبني على المعادلات (1-1) إلى (1-6) ص 11–12</small></h2>
    <div class="ed-row">${segHTML('md',[['h','حركة أفقية (عربة)'],['v','حركة رأسية (رفع ثقل)']],mode)}</div>
    <div class="svgbox" id="l1sc" style="max-width:860px;margin-inline:auto"></div><p class="sub" id="l1cap"></p></div>
   <div class="panel c7"><h2>المدخلات</h2>
    <div id="l1hz">${sl('l1m','الكتلة m',100,5000,100,m)}${sl('l1F','قوة المحرك F (السالبة = قوة فرملة)',-2000,2000,50,F)}${sl('l1v0','السرعة الابتدائية v<sub>0</sub>',0,20,0.5,v0)}
     <div class="ed-row">${swHTML('l1fr','احتكاك','مقاومة الحركة',false)}<button class="btn" id="l1f0">ارفع القوة (F = 0)</button></div></div>
    <div id="l1vt">${sl('l1mv','الكتلة المرفوعة m',100,5000,100,mv)}${sl('l1vl','سرعة الرفع v (ثابتة)',0,3,0.1,vl)}</div>
    <div class="ed-row"><button class="btn primary" id="l1go">تشغيل</button><button class="btn" id="l1rs">إعادة من الصفر</button></div>
    <p class="sub">أي تغيير في المدخلات يعيد التجربة إلى <span class="ltr">t = 0</span> حتى تبقى المقارنة بالمعادلات صحيحة. الزمن حقيقي، والتسجيل يتوقف عند <span class="ltr">20 s</span>.</p></div>
   <div class="panel c5"><h2>القراءات</h2><div class="facts" id="l1fx"></div><div class="ed-row"><span id="l1chip" class="ed-chip"></span></div></div>
   <div class="panel c12"><h2>المنحنيات مع الزمن</h2><div class="ed-plots"><div class="svgbox" id="l1p1"></div><div class="svgbox" id="l1p2"></div></div></div>
   <div class="panel c12" id="l1chkp"><h2>قارن المحاكاة بالمعادلات (1-3) و(1-4)</h2><div class="ed-tbl" id="l1chk"></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l1st"></ol></div></div>`;
  B.math(el);const $=s=>el.querySelector(s);
  const TP=B.params($('#l1tp'),'u1-l1',[
   {k:'Ffr',label:'قوة مقاومة الحركة (احتكاك + هواء) عند تشغيل «احتكاك»',unit:'N',value:400,min:1,max:5000}],()=>{reset();steps.redraw()});
  const reset=()=>{t=0;x=0;v=mode==='h'?v0:vl;hist=[];hT=0;pushH()};
  const pushH=()=>{hist.push(mode==='h'?[t,v,x]:[t,vl,vl*t])};
  const Ffr=()=>fr?TP.v.Ffr:0;
  const netF=()=>{const f=Ffr();if(Math.abs(v)>1e-6)return F-f*Math.sign(v);if(Math.abs(F)>f)return F-f*Math.sign(F);return 0};
  const ui=()=>{$('#l1hz').style.display=mode==='h'?'':'none';$('#l1vt').style.display=mode==='v'?'':'none';$('#l1chkp').style.display=mode==='h'?'':'none';
   $('#l1m-v').textContent=fm(m)+' kg';$('#l1F-v').textContent=fm(F)+' N';$('#l1v0-v').textContent=fm(v0)+' m/s';$('#l1mv-v').textContent=fm(mv)+' kg';$('#l1vl-v').textContent=fm(vl)+' m/s';
   $('#l1go').textContent=run?'إيقاف مؤقت':'تشغيل';$('#l1fr').setAttribute('aria-pressed',String(fr))};
  const bindSl=(id,fn)=>{$('#'+id).oninput=e=>{fn(+e.target.value);reset();ui()}};
  bindSl('l1m',z=>m=z);bindSl('l1F',z=>F=z);bindSl('l1v0',z=>v0=z);bindSl('l1mv',z=>mv=z);bindSl('l1vl',z=>vl=z);
  $('#l1fr').onclick=()=>{fr=!fr;reset();ui()};
  $('#l1f0').onclick=()=>{F=0;$('#l1F').value=0;reset();ui()};
  $('#l1go').onclick=()=>{if(t>=20)reset();run=!run;ui()};
  $('#l1rs').onclick=()=>{run=false;reset();ui()};
  segBind(el,'md',z=>{mode=z;run=false;reset();ui()});
  const steps=stepsUI($('#l1st'),[
   {t:'القانون الأول للحركة',x:'في «حركة أفقية» اجعل <span class="ltr">F = 0</span> والاحتكاك مطفأً، وضع سرعة ابتدائية (مثلاً <span class="ltr">v<sub>0</sub> = 5 m/s</span>) ثم «تشغيل»: تبقى السرعة ثابتة وخط السرعة أفقي، والمسافة تزيد بانتظام — لا قوة = لا تغير في السرعة (ص 11).',done:()=>mode==='h'&&F===0&&!fr&&v0>0&&t>=3},
   {t:'قوة موجبة: تسارع موجب',x:'اجعل <span class="ltr">v<sub>0</sub> = 0</span> و <span class="ltr">F = 500 N</span> و <span class="ltr">m = 1000 kg</span> ثم «تشغيل»: التسارع \\(a=F/m=0.5\\ \\text{m/s}^2\\)، والسرعة تزيد خطياً مع الزمن (المعادلة 1-3).',done:()=>mode==='h'&&!fr&&v0===0&&F>0&&t>=4},
   {t:'كتلة أكبر = تسارع أصغر',x:'بالقوة نفسها ارفع الكتلة إلى <span class="ltr">2000 kg</span> أو أكثر: ميل خط السرعة يقل إلى النصف — \\(a=F/m\\) (المعادلة 1-4).',done:()=>mode==='h'&&!fr&&F>0&&m>=2000&&t>=3},
   {t:'قوة معاكسة: تسارع سالب',x:'ضع سرعة ابتدائية (مثلاً <span class="ltr">10 m/s</span>) وقوة سالبة (فرملة): السرعة تتناقص، أي أن التسارع سالب لأن السرعة النهائية أصغر من الابتدائية (ص 11).',done:()=>mode==='h'&&F<0&&v0>0&&t>=2},
   {get t(){return 'لماذا يتوقف المحرك بعد فصله؟ (تمرين 1-2)'},get x(){return `اجعل <span class="ltr">F = 0</span> مع سرعة ابتدائية، ثم شغّل «احتكاك» (قوة مقاومة <span class="ltr">${fm(TP.v.Ffr)} N</span>): السرعة تقل تدريجياً حتى تتوقف العربة.`},done:()=>mode==='h'&&fr&&F===0&&v0>0&&t>0&&v===0},
   {t:'الحركة الرأسية',x:'اختر «حركة رأسية» واضبط الكتلة وسرعة الرفع ثم «تشغيل»: القوة \\(F=m\\,g\\) لا تتغير مع السرعة، أما القدرة \\(P_L=F\\cdot v\\) فتتضاعف إذا ضاعفت سرعة الرفع (المعادلتان 1-5 و1-6).',done:()=>mode==='v'&&vl>0&&t>=2}
  ]);
  reset();ui();
  loopOn(el,dt=>{
   if(run){const h=Math.min(dt,20-t);
    if(mode==='h'){const n=4;for(let i=0;i<n;i++){const d=h/n,fn=netF(),a=fn/m,vn=v+a*d;
       if(fr&&Math.abs(F)<=Ffr()&&v!==0&&Math.sign(vn)!==Math.sign(v)){x+=v*d/2;v=0}else{x+=(v+vn)/2*d;v=vn}}}
    t+=h;if(t>=20-1e-9){t=20;run=false;ui()}
    hT+=h;if(hT>=0.1||!run){hT=0;pushH()}}
   // scene + readouts
   if(mode==='h'){
    const fn=netF(),a=fn/m,P=F*v;
    $('#l1sc').innerHTML=linSceneSVG({x,m,F,v,Ffr:Math.abs(v)>1e-6||Math.abs(F)>Ffr()?Ffr():Math.abs(F)});
    $('#l1cap').innerHTML='السهم البرتقالي = قوة المحرك F، والأحمر = قوة مقاومة الحركة (عند تشغيل الاحتكاك)، والأزرق = السرعة. الكاميرا تتبع العربة وعلامات الأرض كل <span class="ltr">5 m</span>.';
    $('#l1fx').innerHTML=factsHTML([['الزمن t',lt(fm(t,1)+' s')],['المسافة S',lt(fm(x,2)+' m')],['السرعة v',lt(fm(v,2)+' m/s')],['السرعة بالـ km/h',lt(fm(v*3.6,1)+' km/h')],['محصلة القوة',lt(fm(fn,0)+' N')],['التسارع a = محصلة القوة ÷ m',lt(fm(a,3)+' m/s²')],['قدرة المحرك P = F·v (1-6)',lt(fm(P,0)+' W')]]);
    const ch=$('#l1chip');if(Math.abs(a)<1e-9){ch.className='ed-chip ok';ch.textContent=Math.abs(v)<1e-9?'ساكن: لا قوة محصلة':'سرعة ثابتة: التسارع صفر (القانون الأول)'}
    else if(a*v>0||v===0&&a!==0&&Math.sign(a)===Math.sign(F)){ch.className='ed-chip ld';ch.textContent='السرعة تتزايد: تسارع موجب'}else{ch.className='ed-chip warn';ch.textContent='السرعة تتناقص: تسارع سالب'}
    // plots
    const vs=hist.map(p=>[p[0],p[1]]),ss=hist.map(p=>[p[0],p[2]]);
    const vmx=niceMax(Math.max(1,...hist.map(p=>Math.abs(p[1])))),vmn=Math.min(0,...hist.map(p=>p[1]))<-1e-9?-vmx:0;
    const smx=niceMax(Math.max(1,...hist.map(p=>Math.abs(p[2])))),smn=Math.min(0,...hist.map(p=>p[2]))<-1e-9?-smx:0;
    $('#l1p1').innerHTML=plotSVG({w:460,h:230,x0:0,x1:20,y0:vmn,y1:vmx,xt:[0,5,10,15,20],yt:ticks(vmn,vmx,vmn<0?4:4),xl:'t (s)',yl:'v (m/s)',series:[{pts:vs,col:'--blue'}],aria:'السرعة مع الزمن'});
    $('#l1p2').innerHTML=plotSVG({w:460,h:230,x0:0,x1:20,y0:smn,y1:smx,xt:[0,5,10,15,20],yt:ticks(smn,smx,4),xl:'t (s)',yl:'S (m)',series:[{pts:ss,col:'--live'}],aria:'المسافة مع الزمن'});
    // check table
    if(!fr){const a0=F/m,vE=v0+a0*t,sE=v0*t+0.5*a0*t*t,v2=v0*v0+2*a0*x;
     $('#l1chk').innerHTML=`<table class="ed-chk"><thead><tr><th>العلاقة</th><th>من المعادلة</th><th>من المحاكاة</th></tr></thead><tbody>
      <tr><td>التسارع (1-4)</td><td class="l">a = F/m = ${fm(F)}/${fm(m)} = ${fm(a0,3)} m/s²</td><td class="l">${fm(a,3)} m/s²</td></tr>
      <tr><td>السرعة (1-3)</td><td class="l">v = v0 + a·t = ${fm(vE,2)} m/s</td><td class="l">${fm(v,2)} m/s</td></tr>
      <tr><td>المسافة (1-3)</td><td class="l">S = v0·t + ½·a·t² = ${fm(sE,2)} m</td><td class="l">${fm(x,2)} m</td></tr>
      <tr><td>السرعة² (1-3)</td><td class="l">v² = v0² + 2·a·S = ${fm(v2,2)}</td><td class="l">${fm(v*v,2)}</td></tr></tbody></table>`}
    else $('#l1chk').innerHTML=`<p class="sub">مع الاحتكاك تصبح القوة المحصلة \\(F-F_{fr}\\) فيكون التسارع \\(a=(F-F_{fr})/m=${fm(netF()/m,3)}\\ \\text{m/s}^2\\)، والمعادلات (1-3) تبقى صحيحة بهذا التسارع ما دامت العربة تتحرك في اتجاه واحد. وعندما تتوقف العربة وقوة المحرك أصغر من قوة المقاومة تبقى ساكنة. (قوة المقاومة رقم توضيحي ليس من الكتاب، والكتاب يهملها في المعادلة 2-2.)</p>`;
    B.math($('#l1chk'));
   }else{
    const Fv=mv*G,h=vl*t,P=Fv*vl;
    $('#l1sc').innerHTML=vertSceneSVG({h,hmax:Math.max(vl*20,0.5),m:mv,F:Fv,v:run?vl:0});
    $('#l1cap').innerHTML='الحبل يشد الثقل إلى أعلى بقوة تساوي وزنه \\(m\\,g\\)، فيرتفع بسرعة ثابتة (لا تسارع). المقياس على اليسار يتسع لأقصى ارتفاع خلال <span class="ltr">20 s</span>.';B.math($('#l1cap'));
    $('#l1fx').innerHTML=factsHTML([['الزمن t',lt(fm(t,1)+' s')],['الارتفاع h = v·t',lt(fm(h,2)+' m')],['سرعة الرفع v',lt(fm(vl,2)+' m/s')],['القوة F = m·g (1-5)',lt(fm(Fv,1)+' N')],['القدرة P<sub>L</sub> = F·v (1-6)',lt(fm(P,1)+' W')],['القدرة بالـ kW',lt(fm(P/1000,3)+' kW')]]);
    const ch=$('#l1chip');ch.className='ed-chip ok';ch.textContent=vl>0?'رفع بسرعة ثابتة: القوة = الوزن':'ثابت معلّق: القوة = الوزن والقدرة صفر';
    const ps=hist.map(p=>[p[0],p[2]]),hm=niceMax(Math.max(1,vl*20));
    $('#l1p1').innerHTML=plotSVG({w:460,h:230,x0:0,x1:20,y0:0,y1:hm,xt:[0,5,10,15,20],yt:ticks(0,hm,4),xl:'t (s)',yl:'h (m)',series:[{pts:ps,col:'--live'}],aria:'الارتفاع مع الزمن'});
    const pm=niceMax(Math.max(100,mv*G*3));
    $('#l1p2').innerHTML=plotSVG({w:460,h:230,x0:0,x1:3,y0:0,y1:pm,xt:[0,1,2,3],yt:ticks(0,pm,4),yf:z=>fm(z/1000,1)+'k',xl:'v (m/s)',yl:'P (W)',series:[{pts:[[0,0],[3,mv*G*3]],col:'--blue'}],extra:(X,Y)=>`<circle cx="${fx(X(vl))}" cy="${fx(Y(P))}" r="5" fill="var(--live)"/>`,aria:'القدرة مع سرعة الرفع'});
   }
   steps.check()});
 },
 quiz:[
  {q:'ينص القانون الأول للحركة على أن الجسم يبقى ساكناً أو متحركاً بسرعة ثابتة في خط مستقيم:',o:['دائماً','ما لم تؤثر عليه قوة خارجية','ما دامت كتلته ثابتة','فقط في الحركة الرأسية'],c:1,e:'ص 11.'},
  {q:'التسارع هو:',o:['معدل التغير في المسافة مع الزمن','معدل التغير في السرعة مع الزمن','القوة مقسومة على السرعة','المسافة مقسومة على الكتلة'],c:1,e:'المعادلة (1-2): \\(a=dv/dt\\).'},
  {q:'يكون التسارع سالباً عندما:',o:['تتزايد السرعة','تبقى السرعة ثابتة','تتناقص السرعة','يكون الجسم ساكناً'],c:2,e:'ص 11: السرعة النهائية أصغر من الابتدائية.'},
  {q:'عربة تبدأ من السكون بتسارع 2 m/s². سرعتها بعد 5 s:',o:['2.5 m/s','7 m/s','10 m/s','25 m/s'],c:2,e:'\\(v=v_0+a\\,t=0+2\\times5=10\\ \\text{m/s}\\).'},
  {q:'قوة 600 N تؤثر على كتلة 300 kg. التسارع الناتج:',o:['0.5 m/s²','2 m/s²','180 m/s²','900 m/s²'],c:1,e:'\\(a=F/m=600/300=2\\ \\text{m/s}^2\\) (المعادلة 1-4).'},
  {q:'القوة اللازمة لرفع ثقل كتلته 500 kg رأسياً:',o:['500 N','50.97 N','4905 N','9810 N'],c:2,e:'\\(F=m\\,g=500\\times9.81=4905\\ \\text{N}\\) (المعادلة 1-5).'},
  {q:'القدرة اللازمة لتحريك جسم بقوة 2000 N وسرعة 3 m/s:',o:['666.7 W','2003 W','6000 W','6 W'],c:2,e:'\\(P_L=F\\cdot v=2000\\times3=6000\\ \\text{W}\\) (المعادلة 1-6).'},
  {q:'وحدة القدرة اللازمة للتحريك في جدول الرموز:',o:['N','W','m/s²','J/m'],c:1,e:'جدول ص 12: \\(P_L\\) بالواط W.'}
 ]
});

/* ======================================================================
   Lesson 2 — الحركة الدورانية والعلاقة بين الحركتين
   ====================================================================== */
function radianSVG(){const cx=150,cy=130,r=90;let s=`<svg viewBox="0 0 300 250" role="img" aria-label="الراديان: الزاوية التي يقابلها قوس طوله يساوي نصف القطر">`;
  s+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--line)" stroke-width="2"/>`;
  const a=1;const x1=cx+r,y1=cy,x2=cx+r*Math.cos(-a),y2=cy+r*Math.sin(-a);
  s+=`<path d="M${cx} ${cy}L${x1} ${y1}M${cx} ${cy}L${fx(x2)} ${fx(y2)}" stroke="var(--fg)" stroke-width="2"/>`;
  s+=`<path d="M${x1} ${y1}A${r} ${r} 0 0 0 ${fx(x2)} ${fx(y2)}" fill="none" stroke="var(--live)" stroke-width="4"/>`;
  s+=`<path d="M${cx+28} ${cy}A28 28 0 0 0 ${fx(cx+28*Math.cos(-a))} ${fx(cy+28*Math.sin(-a))}" fill="none" stroke="var(--blue)" stroke-width="2"/>`;
  s+=S.t(cx+42,cy-12,'θ = 1 rad','b','start');
  s+=S.t(cx+r/2,cy+16,'r','')+S.t(fx(cx+(r/2)*Math.cos(-a)-10),fx(cy+(r/2)*Math.sin(-a)-6),'r','');
  s+=S.t(fx(cx+(r+16)*Math.cos(-a/2)+6),fx(cy+(r+16)*Math.sin(-a/2)),'s = r','','start');
  s+=`<circle cx="${cx}" cy="${cy}" r="3" fill="var(--fg)"/>`;
  s+=arT(cx,cy+r+28,'قوس طوله يساوي نصف القطر يقابل زاوية مقدارها راديان واحد',{fs:12});
  return s+'</svg>'}
function rimSVG(){const cx=150,cy=125,r=85,a=-0.7;let s=`<svg viewBox="0 0 300 250" role="img" aria-label="جسم على محيط دائرة: السرعة الخطية مماسية وتساوي السرعة الزاوية في نصف القطر">`;
  s+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2"/>`;
  const px=cx+r*Math.cos(a),py=cy+r*Math.sin(a);
  s+=`<path d="M${cx} ${cy}L${fx(px)} ${fx(py)}" stroke="var(--fg)" stroke-width="2"/>`+S.t(fx((cx+px)/2+8),fx((cy+py)/2+14),'r','');
  s+=arrow(px,py,px+70*Math.sin(-a),py+70*Math.cos(a)*-1,'--blue',2.6);
  s+=S.t(fx(px+70*Math.sin(-a)+6),fx(py-70*Math.cos(a)-4),'v = ω·r','b','start');
  s+=`<circle cx="${fx(px)}" cy="${fx(py)}" r="7" fill="var(--live)"/>`;
  s+=`<path d="M${cx+30} ${cy+18}A34 34 0 0 1 ${cx-26} ${cy+22}" fill="none" stroke="var(--live)" stroke-width="2"/>`+arrow(cx-20,cy+27,cx-30,cy+18,'--live',2)+S.t(cx+4,cy+50,'ω','');
  s+=`<circle cx="${cx}" cy="${cy}" r="3" fill="var(--fg)"/>`;
  s+=arT(cx,cy+r+30,'الجسم يقطع على المحيط قوساً s = θ·r',{fs:12});
  return s+'</svg>'}
function drumSVG(o){const cx=200,cy=150,R=clamp(26+o.D*48,30,124);let s=`<svg viewBox="0 0 400 300" role="img" aria-label="أسطوانة تدور ونقطة على محيطها">`;
  s+=`<circle cx="${cx}" cy="${cy}" r="${fx(R)}" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2.4"/>`;
  const av=o.thv;for(let i=0;i<6;i++){const a=av+i*PI/3;s+=`<path d="M${cx} ${cy}L${fx(cx+R*0.86*Math.cos(a))} ${fx(cy+R*0.86*Math.sin(a))}" stroke="var(--muted)" stroke-width="1.4"/>`}
  // swept arc within current revolution (true angle)
  const fr=((o.th%(2*PI))+2*PI)%(2*PI);if(fr>0.01){const ex=cx+(R+12)*Math.cos(-fr),ey=cy+(R+12)*Math.sin(-fr);s+=`<path d="M${fx(cx+R+12)} ${cy}A${fx(R+12)} ${fx(R+12)} 0 ${fr>PI?1:0} 0 ${fx(ex)} ${fx(ey)}" fill="none" stroke="var(--live)" stroke-width="3" opacity=".55"/>`}
  const px=cx+R*Math.cos(-av),py=cy+R*Math.sin(-av);
  s+=`<path d="M${cx} ${cy}L${fx(px)} ${fx(py)}" stroke="var(--fg)" stroke-width="2"/>`;
  if(o.w>0.01){const L=clamp(18+o.v*2.2,22,80);s+=arrow(px,py,px-L*Math.sin(av),py-L*Math.cos(av),'--blue',2.6)}
  s+=`<circle cx="${fx(px)}" cy="${fx(py)}" r="7" fill="var(--live)" stroke="var(--fg)" stroke-width="1"/><circle cx="${cx}" cy="${cy}" r="5" fill="var(--fg)"/>`;
  if(o.F>0){const fxp=cx,fyp=cy-R;s+=arrow(fxp+4,fyp,fxp-clamp(o.F/2000*80+16,20,96),fyp,'--stop',2.6)+S.t(fx(fxp-clamp(o.F/2000*80+16,20,96)-6),fyp-6,'F','','end')}
  s+=S.t(cx,cy+R+22,'D = '+fm(o.D,2)+' m','m');
  s+=S.t(12,22,'θ = '+fm(o.th,2)+' rad','b','start')+S.t(12,42,'rev = '+fm(o.th/(2*PI),2),'m','start');
  return s+'</svg>'}

function solveRot(g,isBook){const pi=g.pi,r=g.r/100,w=B.round(2*pi*g.n/60,2),v=B.round(w*r,2),th=B.round(w*g.t,2),s=B.round(v*g.t,2);
  const out=[{t:'نحوّل نصف القطر إلى المتر:',f:`r=${fm(g.r)}\\ \\text{cm}=${fm(r)}\\ \\text{m}`},
   {t:'i) السرعة الزاوية من المعادلة (1-13):',f:`\\omega=\\frac{2\\pi n}{60}=\\frac{2\\times ${fm(pi)}\\times ${fm(g.n)}}{60}`,v:w,unit:'rad/s',dp:2,final:true},
   {t:'ii) السرعة الخطية من المعادلة (1-12):',f:`v=\\omega\\cdot r=${fm(w,2)}\\times ${fm(r)}`,v:v,unit:'m/s',dp:2,final:true},
   {t:`iii) الزاوية المقطوعة خلال ${fm(g.t)} ثوان:`,f:`\\theta=\\omega\\cdot t=${fm(w,2)}\\times ${fm(g.t)}`,v:th,unit:'rad',dp:isBook?1:2,final:true},
   {t:`iv) القوس المقطوع خلال ${fm(g.t)} ثوان:`,f:`s=v\\cdot t=${fm(v,2)}\\times ${fm(g.t)}`,v:s,unit:'m',dp:isBook?1:2,final:true}];
  if(Math.abs(pi-3.14)<1e-9){const we=2*PI*g.n/60;out.push({t:`<span class="sub">بقيمة π الدقيقة (<span class="ltr">3.14159…</span>) تكون النتائج: <span class="ltr">ω = ${fm(we,2)} rad/s</span>، <span class="ltr">v = ${fm(we*r,2)} m/s</span>، <span class="ltr">θ = ${fm(we*g.t,2)} rad</span>، <span class="ltr">s = ${fm(we*r*g.t,2)} m</span>. اكتب 3.14159 في خانة π لترى الحل كاملاً بها.</span>`})}
  return out}
const GROT=(r,n,t)=>[{id:'r',label:'نصف قطر الدائرة',sym:'r',unit:'cm',value:r},{id:'n',label:'السرعة الدورانية',sym:'n',unit:'rpm',value:n},{id:'t',label:'الزمن',sym:'t',unit:'s',value:t},{id:'pi',label:'قيمة π المستخدمة في الحل',sym:'\\pi',unit:'',value:3.14}];

B.lesson({
 id:'u1-l2',unit:1,order:2,pages:'13–16',
 title:'الحركة الدورانية والعلاقة بين الحركة الخطية والدورانية',
 summary:'الإزاحة الزاوية والراديان، السرعة الزاوية والتسارع الزاوي وعلاقات الدوران بتسارع زاوي منتظم، العزم T = F·r والقدرة P = T·ω، ثم الربط بين الحركتين: v = ω·r و ω = 2πn/60 و v = πDn/60، مع المثال (1-1) والتمارين (1-4) إلى (1-9).',
 stations:[
  {intro:true},

  {st:1,short:'الإزاحة الزاوية',title:'الحركة الزاوية (التحريك الدوراني) — أ- الإزاحة الزاوية',ref:'ص 13',
   q:'عجلة دارت دورة كاملة. كيف نقيس «كم دارت» بوحدة غير الدرجات؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الراديان: الزاوية المركزية التي يقابلها قوس طوله يساوي نصف القطر" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><circle cx="180" cy="150" r="95" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><g data-tip="نصف القطر ⟦r⟧: المسافة من المركز إلى المحيط."><line x1="180" y1="150" x2="275" y2="150" stroke="#2C4A40" stroke-width="3"/><line x1="180" y1="150" x2="231.3" y2="70.1" stroke="#2C4A40" stroke-width="3"/><text x="228" y="170" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">r</text><text x="194" y="106" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">r</text></g><g data-tip="قوس طوله يساوي نصف القطر ⟦r⟧."><path d="M275 150 A95 95 0 0 0 231.3 70.1" fill="none" stroke="#E8735A" stroke-width="7" stroke-linecap="round"/><text x="282" y="98" text-anchor="middle" font-size="15" fill="#E8735A" font-weight="700" font-family="var(--mono)" direction="ltr">r</text></g><g data-tip="الزاوية المركزية التي تقابل هذا القوس: مقدارها راديان واحد ⟦1 rad⟧."><path d="M208 150 A28 28 0 0 0 195.1 126.4" fill="none" stroke="#12855A" stroke-width="3"/><text x="226" y="140" text-anchor="start" font-size="12.5" fill="#12855A" font-weight="700" font-family="var(--mono)" direction="ltr">1 rad</text></g><circle cx="180" cy="150" r="4.5" fill="#2C4A40"/><g data-tip="في الدورة الكاملة تقطع الأسطوانة زاوية ⟦θ = 2π⟧ راديان."><rect x="62" y="262" width="236" height="34" rx="10" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="180" y="285" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">دورة كاملة: <tspan font-family="var(--mono)" direction="ltr" unicode-bidi="embed">θ = 2π rad</tspan></text></g></svg>`,
   cap:'القوس البرتقالي طوله يساوي نصف القطر <span class="ltr">r</span>، فالزاوية المركزية المقابلة له راديان واحد.<br><b>مرّر المؤشر على نصفي القطر والقوس والزاوية والمستطيل الأصفر (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'أسطوانة دارت حول محورها دورة كاملة. كم راديان قطعت؟',opts:[
     ['<span class="ltr">360 rad</span>',false,'360 عدد الدرجات في الدورة، لا الراديانات.'],
     ['<span class="ltr">1 rad</span>',false,'الراديان الواحد جزء صغير من الدورة: قوسه يساوي نصف القطر فقط.'],
     ['<span class="ltr">2π rad</span>',true,String.raw`نص الكتاب ص 13: الدورة الكاملة «ستقطع زاوية \(\theta=2\pi\) راديان».`]]}}
   ],
   body:[
    {book:String.raw`<p>عندما تدور أسطوانة قطرها <span class="ltr">(D)</span> حول محورها دورةً كاملةً، بسرعة زاوية <span class="ltr">(ω)</span>، فإنها ستقطع زاوية \((\theta=2\pi)\) راديان <span class="ltr">(rad)</span>. ويعرف <b>الراديان</b> بأنه الزاوية المركزية التي تقابل قوساً طوله يساوي نصف قطر دائرته.</p>`,ref:'ص 13'},
    {tip:String.raw`<p>محيط الدائرة \(2\pi r\)، أي أنه يتسع لـ \(2\pi\approx6.28\) قوساً طول كل منها \(r\). لذلك الدورة الكاملة = \(2\pi\) راديان = <span class="ltr">360°</span>، والراديان الواحد ≈ <span class="ltr">57.3°</span>.</p>`,title:'لماذا 2π؟'},
    {watch:String.raw`<p>في الحركة الدورانية نستعمل الراديان لا الدرجة، لأن كل معادلات الدوران في الكتاب (مثل \(v=\omega\cdot r\)) لا تصح إلا بالراديان.</p>`}
   ]},

  {st:2,short:'السرعة الزاوية',title:'الحركة الزاوية — ب- السرعة الزاوية',ref:'ص 13',
   q:'عقرب الثواني وعقرب الدقائق يدوران حول المركز نفسه. كيف نعبّر عن أن أحدهما «أسرع دوراناً»؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="قرص يدور: نصف القطر قطع زاوية θ خلال زمن، والسرعة الزاوية ω هي الزاوية مقسومة على الزمن" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><circle cx="180" cy="150" r="90" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><g data-tip="الإزاحة الزاوية ⟦θ⟧ التي قطعها الخط خلال الزمن ⟦t⟧، بالراديان."><path d="M180 150 L270 150 A90 90 0 0 0 225 72.1 Z" fill="#F2C14E" opacity=".8"/><text x="236" y="128" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">θ</text></g><g data-tip="موضع الخط في البداية."><line x1="180" y1="150" x2="270" y2="150" stroke="#2C4A40" stroke-width="2.5" stroke-dasharray="6 4"/></g><g data-tip="موضع الخط بعد الزمن ⟦t⟧."><line x1="180" y1="150" x2="225" y2="72.1" stroke="#2C4A40" stroke-width="3.5"/></g><circle cx="180" cy="150" r="5" fill="#2C4A40"/><g data-tip="السرعة الزاوية ⟦ω⟧: الزاوية التي يقطعها الجسم في الثانية، بوحدة ⟦rad/s⟧."><path d="M281.5 186.9 A108 108 0 0 0 264 82" fill="none" stroke="#E8735A" stroke-width="4" stroke-linecap="round"/><polygon points="255,71.4 267.3,76.7 258.1,84.5" fill="#E8735A"/><text x="304" y="140" text-anchor="middle" font-size="18" fill="#E8735A" font-weight="700" font-family="var(--mono)" direction="ltr">ω</text></g><text x="180" y="276" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">السرعة الزاوية = الزاوية ÷ الزمن</text><text x="180" y="300" text-anchor="middle" font-size="13" fill="#2C4A40" font-family="var(--mono)" direction="ltr">ω = dθ/dt   (rad/s)</text></svg>`,
   cap:'الخط المرسوم على القرص قطع الزاوية الصفراء <span class="ltr">θ</span> خلال زمن <span class="ltr">t</span>؛ السرعة الزاوية <span class="ltr">ω</span> هي معدل قطع الزاوية.<br><b>مرّر المؤشر على الخطين والمساحة الصفراء والسهم (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'قرصان: الأول يقطع زاوية <span class="ltr">2π rad</span> في ثانية واحدة، والثاني يقطع الزاوية نفسها في ثانيتين. أيهما سرعته الزاوية أكبر؟',opts:[
     ['الثاني لأنه يدور مدة أطول',false,'المدة الأطول للزاوية نفسها تعني دوراناً أبطأ.'],
     ['الأول: ضعف الثاني',true,String.raw`\(\omega=\theta/t\): الزاوية نفسها في نصف الزمن = ضعف السرعة الزاوية.`],
     ['متساويان لأن الزاوية واحدة',false,'السرعة الزاوية تعتمد على الزمن أيضاً لا على الزاوية وحدها.']]}}
   ],
   body:[
    {book:String.raw`<p>هي الإزاحة الزاوية المقطوعة خلال وحدة الزمن.</p>
     <div class="eq">$$\omega=\frac{d\theta}{dt}$$<span class="eqno">(1-7)</span></div>`,ref:'ص 13'},
    {tip:String.raw`<p>قارنها بالسرعة الخطية \(v=dS/dt\) (المعادلة <span class="ltr">(1-1)</span>): هناك مسافة بالمتر، وهنا <b>زاوية بالراديان</b>. لذلك وحدة السرعة الزاوية <span class="ltr">rad/s</span>.</p>`},
    {add:String.raw`<p>على لوحة بيانات المحرك تُكتب السرعة عادةً بالدورة في الدقيقة <span class="ltr">rpm</span> لا بالـ <span class="ltr">rad/s</span>. وسترى في المحطة السادسة كيف نحوّل بينهما.</p>`}
   ]},

  {st:3,short:'التسارع الزاوي',title:'الحركة الزاوية — ج- التسارع الزاوي',ref:'ص 13',
   q:'محرك يبدأ من السكون حتى يصل سرعته الكاملة. ماذا نسمي «زيادة سرعة دورانه» مع الزمن؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ثلاثة أقراص متتالية في الزمن، وسهم الدوران يطول من قرص لآخر: السرعة الزاوية تتزايد والتسارع الزاوي موجب" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><circle cx="75" cy="140" r="34" fill="#8FA39B" stroke="#2C4A40" stroke-width="2.5"/><line x1="75" y1="140" x2="75" y2="108" stroke="#2C4A40" stroke-width="3"/><circle cx="180" cy="140" r="34" fill="#8FA39B" stroke="#2C4A40" stroke-width="2.5"/><line x1="180" y1="140" x2="203" y2="117" stroke="#2C4A40" stroke-width="3"/><circle cx="285" cy="140" r="34" fill="#8FA39B" stroke="#2C4A40" stroke-width="2.5"/><line x1="285" y1="140" x2="317" y2="140" stroke="#2C4A40" stroke-width="3"/><circle cx="75" cy="140" r="4" fill="#2C4A40"/><circle cx="180" cy="140" r="4" fill="#2C4A40"/><circle cx="285" cy="140" r="4" fill="#2C4A40"/><g data-tip="سهم السرعة الزاوية ⟦ω⟧: طوله يكبر من قرص إلى الذي يليه، أي أن سرعة الدوران تتزايد."><path d="M75 94 A46 46 0 0 1 104.6 104.8" fill="none" stroke="#E8735A" stroke-width="4" stroke-linecap="round"/><polygon points="112.3,111.2 101.4,108.6 107.8,101" fill="#E8735A"/><path d="M180 94 A46 46 0 0 1 226 140" fill="none" stroke="#E8735A" stroke-width="4" stroke-linecap="round"/><polygon points="226,152 221,140 231,140" fill="#E8735A"/><path d="M285 94 A46 46 0 0 1 308 179.8" fill="none" stroke="#E8735A" stroke-width="4" stroke-linecap="round"/><polygon points="299.3,184.8 305.5,175.5 310.5,184.1" fill="#E8735A"/><rect x="28" y="88" width="304" height="104" fill="transparent"/></g><g data-tip="محور الزمن ⟦t⟧: الأقراص الثلاثة هي القرص نفسه في ثلاث لحظات متتالية."><line x1="50" y1="222" x2="300" y2="222" stroke="#2C4A40" stroke-width="2.5"/><polygon points="312,222 300,216 300,228" fill="#2C4A40"/><text x="324" y="227" text-anchor="start" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">t</text></g><text x="180" y="256" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">السرعة الزاوية تتزايد</text><text x="180" y="292" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">α = dω/dt</text></svg>`,
   cap:'القرص نفسه في ثلاث لحظات متتالية: سهم الدوران يطول، أي أن السرعة الزاوية تتزايد والتسارع الزاوي موجب.<br><b>مرّر المؤشر على الأسهم ومحور الزمن (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'فُصل محرك عن المصدر فأخذت سرعة دورانه تقل حتى توقف. تسارعه الزاوي في هذه المدة:',opts:[
     ['صفر، لأنه لم يعد متصلاً بالمصدر',false,'التسارع الزاوي يتبع تغير السرعة الزاوية، والسرعة هنا تتغير.'],
     ['موجب، لأنه ما زال يدور',false,'إشارة التسارع لا تتبع وجود الدوران بل اتجاه تغير سرعته.'],
     ['سالب، لأن سرعته الزاوية تتناقص',true,String.raw`كما في التسارع الخطي: إذا تناقصت السرعة كان التسارع سالباً. \(\alpha=d\omega/dt\) والسرعة الزاوية تتناقص.`]]}}
   ],
   body:[
    {book:String.raw`<p>هو معدل التغير في السرعة الزاوية خلال وحدة الزمن.</p>
     <div class="eq">$$\alpha=\frac{d\omega}{dt}$$<span class="eqno">(1-8)</span></div>`,ref:'ص 13'},
    {tip:String.raw`<p>هذا نظير التسارع الخطي \(a=dv/dt\) (المعادلة <span class="ltr">(1-2)</span>): موجب إذا كانت سرعة الدوران تتزايد (بدء تشغيل المحرك)، وسالب إذا كانت تتناقص (فرملة أو فصل)، وصفر إذا كان المحرك يدور بسرعة ثابتة.</p>`},
    {watch:String.raw`<p>جدول الرموز في الكتاب (ص 14) لا يذكر وحدة التسارع الزاوي؛ وحدته <span class="ltr">rad/s²</span> (راديان في الثانية لكل ثانية)، كما أن وحدة التسارع الخطي <span class="ltr">m/s²</span>.</p>`}
   ]},

  {st:4,short:'التسارع المنتظم والعزم',title:'الحركة الزاوية — د- علاقات التحريك الزاوي لجسم يدور بتسارع زاوي منتظم',ref:'ص 13',
   q:'لماذا يسهل فتح الباب إذا دفعته من طرفه البعيد عن المفصلات؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="أسطوانة يشدها حبل بقوة F على بعد r من محورها فينتج عزم T يساوي F في r" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><g data-tip="أسطوانة تدور حول محورها."><circle cx="190" cy="150" r="80" fill="#8FA39B" stroke="#2C4A40" stroke-width="3"/></g><g data-tip="محور الدوران."><circle cx="190" cy="150" r="7" fill="#2C4A40"/></g><g data-tip="نصف القطر ⟦r⟧: المسافة من محور الدوران إلى نقطة تأثير القوة (ذراع القوة)."><line x1="190" y1="150" x2="190" y2="70" stroke="#FBF6EE" stroke-width="4"/><text x="204" y="116" text-anchor="start" font-size="17" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">r</text></g><g data-tip="القوة ⟦F⟧: حبل يشد محيط الأسطوانة مماسياً."><line x1="190" y1="70" x2="96" y2="70" stroke="#E8735A" stroke-width="5" stroke-linecap="round"/><polygon points="80,70 96,61 96,79" fill="#E8735A"/><text x="120" y="56" text-anchor="middle" font-size="17" fill="#E8735A" font-weight="700" font-family="var(--mono)" direction="ltr">F</text></g><g data-tip="العزم ⟦T⟧: «قوة التدوير» التي تنتج من القوة ⟦F⟧ على الذراع ⟦r⟧، بوحدة ⟦Nm⟧."><path d="M160 180 A42 42 0 0 0 220 180" fill="none" stroke="#F2C14E" stroke-width="5" stroke-linecap="round"/><polygon points="230,169.5 224.9,185 214.9,175" fill="#F2C14E"/><text x="190" y="212" text-anchor="middle" font-size="17" fill="#F2C14E" font-weight="700" font-family="var(--mono)" direction="ltr">T</text></g><text x="180" y="266" text-anchor="middle" font-size="18" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T = F · r</text><text x="180" y="292" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-family="var(--mono)" direction="ltr">(1-10)</text></svg>`,
   cap:'الحبل يشد محيط الأسطوانة بقوة <span class="ltr">F</span> على بعد <span class="ltr">r</span> من المحور، فينتج عزم يديرها.<br><b>مرّر المؤشر على أجزاء الرسمة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'القوة نفسها أثرت على أسطوانتين، نصف قطر الثانية ضعف الأولى. عزم الثانية:',opts:[
     ['ضعف عزم الأولى',true,String.raw`\(T=F\cdot r\): القوة ثابتة والذراع تضاعف، فيتضاعف العزم.`],
     ['نصف عزم الأولى',false,'العكس: الذراع الأطول يعطي عزماً أكبر.'],
     ['مساوٍ لعزم الأولى',false,String.raw`العزم يعتمد على الذراع \(r\) أيضاً لا على القوة وحدها.`]]}}
   ],
   body:[
    {book:String.raw`<div class="eq">$$\begin{cases} \omega=\omega_0+\alpha\times t \\ \theta=\omega_0\times t+\tfrac{1}{2}\times\alpha\times t^2 \\ \omega^2=\omega_0^2+2\times\alpha\times\theta \end{cases}$$<span class="eqno">(1-9)</span></div>
     <p>وفي هذه الحالة يمكن حساب <b>العزم</b> اللازم للتدوير من المعادلة التالية:</p>
     <div class="eq">$$T=F\cdot r$$<span class="eqno">(1-10)</span></div>`,ref:'ص 13'},
    {tip:String.raw`<p>المعادلات <span class="ltr">(1-9)</span> هي نفسها <span class="ltr">(1-3)</span> بعد تبديل كل رمز خطي بنظيره الدوراني:</p>
     <table class="tt"><thead><tr><th>الحركة الخطية</th><th>الحركة الدورانية</th></tr></thead><tbody>
     <tr><td>المسافة <span class="ltr">S (m)</span></td><td>الإزاحة الزاوية <span class="ltr">θ (rad)</span></td></tr>
     <tr><td>السرعة <span class="ltr">v (m/s)</span></td><td>السرعة الزاوية <span class="ltr">ω (rad/s)</span></td></tr>
     <tr><td>التسارع <span class="ltr">a (m/s²)</span></td><td>التسارع الزاوي <span class="ltr">α (rad/s²)</span></td></tr>
     <tr><td>القوة <span class="ltr">F (N)</span></td><td>العزم <span class="ltr">T (Nm)</span></td></tr></tbody></table>`,title:'كل كمية خطية لها نظير دوراني'},
    {tip:String.raw`<p>في المعادلة <span class="ltr">(1-10)</span> \(r\) هو <b>نصف القطر</b> (ذراع القوة): المسافة من محور الدوران إلى نقطة تأثير القوة. القوة نفسها على ذراع أطول تعطي عزماً أكبر، لهذا يسهل فتح الباب من طرفه البعيد عن المفصلات.</p>`,title:'ما r في معادلة العزم؟'},
    {watch:String.raw`<p>الكتاب لا يعرّف \(r\) في المعادلة <span class="ltr">(1-10)</span> ولا يذكره في جدول الرموز (ص 14)؛ المقصود نصف القطر بالمتر. وانتبه: الجدول يعطي <b>القطر</b> \(D\)، و\(r=D/2\).</p>`}
   ]},

  {st:5,short:'قدرة التدوير',title:'الحركة الزاوية — هـ- القدرة اللازمة للتدوير',ref:'ص 13–14',
   q:'مروحتان تحتاجان العزم نفسه، لكن إحداهما تدور بضعف سرعة الأخرى. أيهما تحتاج قدرة أكبر؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="محرك يدير حملاً بعزم T وسرعة زاوية ω، والقدرة P تساوي T في ω" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="المحرك: يدير الحمل عبر العمود."><rect x="236" y="104" width="80" height="72" rx="12" fill="#4FB3A9" stroke="#2C4A40" stroke-width="3"/><rect x="244" y="176" width="64" height="9" rx="2" fill="#2C4A40"/><text x="276" y="146" text-anchor="middle" font-size="13.5" fill="#FBF6EE" font-weight="700" direction="rtl">المحرك</text></g><line x1="236" y1="140" x2="110" y2="140" stroke="#2C4A40" stroke-width="8" stroke-linecap="round"/><g data-tip="الحمل الدوراني: أسطوانة أو مروحة أو مضخة."><rect x="58" y="96" width="52" height="88" rx="10" fill="#8FA39B" stroke="#2C4A40" stroke-width="3"/></g><g data-tip="العزم ⟦T⟧ الذي يلزم لتدوير الحمل، بوحدة ⟦Nm⟧."><path d="M160 112 A20 30 0 1 0 186 112" fill="none" stroke="#E8735A" stroke-width="4" stroke-linecap="round"/><polygon points="194,104 190,120 180,108" fill="#E8735A"/><text x="173" y="96" text-anchor="middle" font-size="17" fill="#E8735A" font-weight="700" font-family="var(--mono)" direction="ltr">T</text></g><g data-tip="السرعة الزاوية ⟦ω⟧ للعمود والحمل، بوحدة ⟦rad/s⟧."><text x="173" y="200" text-anchor="middle" font-size="18" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">ω</text><rect x="158" y="180" width="30" height="28" fill="transparent"/></g><g data-tip="القدرة اللازمة للتدوير ⟦P = T·ω⟧ بالواط ⟦W⟧."><rect x="98" y="236" width="164" height="44" rx="12" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="180" y="265" text-anchor="middle" font-size="17" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">P = T · ω</text></g><text x="180" y="302" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-family="var(--mono)" direction="ltr">(1-11)</text></svg>`,
   cap:'المحرك يدير الحمل بعزم <span class="ltr">T</span> وسرعة زاوية <span class="ltr">ω</span>؛ القدرة اللازمة حاصل ضربهما.<br><b>مرّر المؤشر على أجزاء الرسمة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'حمل يحتاج العزم نفسه، وضاعفنا سرعة دورانه. القدرة اللازمة:',opts:[
     ['تبقى كما هي',false,'العزم ثابت فعلاً، لكن القدرة = العزم × السرعة الزاوية.'],
     ['تصبح أربعة أضعاف',false,'القدرة تتناسب مع السرعة الزاوية نفسها لا مع مربعها (عند ثبات العزم).'],
     ['تتضاعف',true,String.raw`\(P=T\cdot\omega\): العزم ثابت والسرعة الزاوية تضاعفت، فتتضاعف القدرة.`]]}}
   ],
   body:[
    {book:String.raw`<p>القدرة اللازمة لتدوير حمل دوراني بسرعة زاوية مقدارها <span class="ltr">ω</span> يمكن حسابها من العلاقة التالية:</p>
     <div class="eq">$$P=T\cdot\omega$$<span class="eqno">(1-11)</span></div>
     <p>حيث:</p>
     <table class="tt"><thead><tr><th>المصطلح</th><th>رمز المصطلح</th><th>الوحدة</th></tr></thead><tbody>
     <tr><td>السرعة الزاوية النهائية</td><td><span class="ltr">ω</span></td><td><span class="ltr">rad/s</span></td></tr>
     <tr><td>السرعة الزاوية الابتدائية</td><td><span class="ltr">ω<sub>0</sub></span></td><td><span class="ltr">rad/s</span></td></tr>
     <tr><td>السرعة الدورانية</td><td><span class="ltr">n</span></td><td><span class="ltr">rpm</span></td></tr>
     <tr><td>الإزاحة الزاوية</td><td><span class="ltr">θ</span></td><td><span class="ltr">rad</span></td></tr>
     <tr><td>العزم</td><td><span class="ltr">T</span></td><td><span class="ltr">Nm</span></td></tr>
     <tr><td>القدرة</td><td><span class="ltr">P</span></td><td><span class="ltr">W</span></td></tr>
     <tr><td>قطر الأسطوانة</td><td><span class="ltr">D</span></td><td><span class="ltr">m</span></td></tr></tbody></table>`,ref:'ص 13–14'},
    {tip:String.raw`<p>قارن بالحركة الخطية: \(P_L=F\cdot v\) <span class="ltr">(1-6)</span> وهنا \(P=T\cdot\omega\) <span class="ltr">(1-11)</span>: القوة صارت عزماً، والسرعة صارت سرعة زاوية. والناتج بالواط في الحالتين بشرط أن تكون \(\omega\) بالـ <span class="ltr">rad/s</span> (لا بالـ <span class="ltr">rpm</span>).</p>`},
    {add:String.raw`<p>لهذا لا يكفي أن تعرف قدرة المحرك وحدها: محركان بالقدرة نفسها، البطيء منهما يعطي عزماً أكبر من السريع. وستستعمل هذه الفكرة في الوحدة الثانية لحساب عزم المحرك من قدرته وسرعته.</p>`}
   ]},

  {st:6,short:'العلاقة بين الحركتين',title:'العلاقة بين الحركة الخطية والحركة الدورانية',ref:'ص 14',
   q:'نقطة على حافة عجلة تدور: كم مسافة تقطع في الثانية إذا عرفت سرعة دوران العجلة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="نقطة على محيط دائرة: سرعتها الخطية v مماسية وتساوي السرعة الزاوية في نصف القطر" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><circle cx="170" cy="150" r="88" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><g data-tip="القطر ⟦D⟧ = ضعف نصف القطر ⟦r⟧."><line x1="82" y1="150" x2="258" y2="150" stroke="#2C4A40" stroke-width="1.6" stroke-dasharray="5 4"/><text x="110" y="168" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">D</text><rect x="82" y="142" width="80" height="34" fill="transparent"/></g><g data-tip="نصف القطر ⟦r⟧ من المركز إلى النقطة."><line x1="170" y1="150" x2="232.2" y2="87.8" stroke="#2C4A40" stroke-width="3"/><text x="190" y="110" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">r</text></g><circle cx="170" cy="150" r="4.5" fill="#2C4A40"/><g data-tip="السرعة الخطية ⟦v⟧ للنقطة: مماسية للدائرة ومقدارها ⟦v = ω·r⟧."><line x1="232.2" y1="87.8" x2="282" y2="137.6" stroke="#4FB3A9" stroke-width="5" stroke-linecap="round"/><polygon points="292,147.6 277.2,143.3 287.6,132.9" fill="#4FB3A9"/><text x="300" y="132" text-anchor="start" font-size="16" fill="#4FB3A9" font-weight="700" font-family="var(--mono)" direction="ltr">v</text></g><circle cx="232.2" cy="87.8" r="8" fill="#E8735A" stroke="#2C4A40" stroke-width="1.5"/><g data-tip="السرعة الزاوية ⟦ω⟧ (بالـ ⟦rad/s⟧) أو السرعة الدورانية ⟦n⟧ (دورة في الدقيقة ⟦rpm⟧)."><path d="M135.8 244 A100 100 0 0 1 76 184.2" fill="none" stroke="#E8735A" stroke-width="4" stroke-linecap="round"/><polygon points="71.9,172.9 81.6,182.1 70.4,186.3" fill="#E8735A"/><text x="58" y="224" text-anchor="middle" font-size="16" fill="#E8735A" font-weight="700" font-family="var(--mono)" direction="ltr">ω</text></g><text x="110" y="268" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">v = ω·r</text><text x="250" y="268" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">ω = 2πn/60</text><text x="180" y="296" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">v = πDn/60</text></svg>`,
   cap:'النقطة البرتقالية على المحيط تتحرك بسرعة خطية <span class="ltr">v</span> مماسية للدائرة، ترتبط بالسرعة الزاوية <span class="ltr">ω</span> ونصف القطر <span class="ltr">r</span>.<br><b>مرّر المؤشر على أجزاء الرسمة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'نقطتان على القرص نفسه: الأولى على الحافة، والثانية في منتصف المسافة إلى المركز. أي العبارتين صحيحة؟',opts:[
     ['لهما السرعة الخطية نفسها',false,'تقطع نقطة الحافة دائرة أكبر في الزمن نفسه، فسرعتها الخطية أكبر.'],
     ['لهما السرعة الزاوية نفسها، والخطية لنقطة الحافة ضعف الأخرى',true,String.raw`القرص كله يدور بـ \(\omega\) واحدة، و\(v=\omega\cdot r\): نصف القطر الضعف = السرعة الخطية الضعف.`],
     ['السرعة الزاوية لنقطة الحافة أكبر',false,'كل نقاط القرص تقطع الزاوية نفسها في الزمن نفسه.']]}}
   ],
   body:[
    {book:String.raw`<p>عندما يتحرك جسم حركة خطية على محيط دائرة بسرعة خطية ثابتة قدرها <span class="ltr">(v)</span>، فإنه سيقطع مسافة مقدارها <span class="ltr">(s)</span> على محيط الدائرة خلال زمن معين <span class="ltr">(t)</span> بحيث \((s=v\cdot t)\)، فإذا أكمل الجسم دائرةً كاملةً فإنه سيقطع مسافة محيط الدائرة، وهي المسافة الخطية المقطوعة لدائرة كاملة \((S=2\pi r)\) والزاوية المقطوعة في هذه الحالة هي \((\theta=2\pi)\)، إذاً:</p>
     <div class="eq">$$s=v\cdot t\quad\text{and}\quad s=2\pi r=\theta\,r$$</div>
     <div class="eq">$$v\cdot t=\theta\cdot r$$</div>
     <p>وبقسمة الطرفين على الزمن <span class="ltr">t</span> ينتج أن:</p>
     <div class="eq">$$v=\omega\cdot r$$<span class="eqno">(1-12)</span></div>
     <p>ولحساب عدد الدورات المقطوعة في الثانية (السرعة الدورانية) نستخدم المعادلة:</p>
     <div class="eq">$$n=\frac{\omega}{2\pi}$$</div>
     <p>وبالتالي فإن عدد الدورات المقطوعة في الدقيقة يكون:</p>
     <div class="eq">$$n=\frac{60\,\omega}{2\pi}\quad\text{rpm}$$</div>
     <div class="eq">$$\omega=\frac{2\pi\cdot n}{60}\quad\text{rad/s}$$<span class="eqno">(1-13)</span></div>
     <p>وبالتعويض بالمعادلة (1-13) في المعادلة (1-12) ينتج أن:</p>
     <div class="eq">$$v=\frac{\pi D n}{60}$$<span class="eqno">(1-14)</span></div>`,ref:'ص 14'},
    {tip:String.raw`<ul><li><b>(1-12)</b> تربط السرعة الخطية لنقطة على المحيط بالسرعة الزاوية: \(v=\omega\cdot r\).</li>
     <li><b>(1-13)</b> تحوّل سرعة الدوران من <span class="ltr">rpm</span> إلى <span class="ltr">rad/s</span>: كل دورة \(2\pi\) راديان، وكل دقيقة <span class="ltr">60</span> ثانية.</li>
     <li><b>(1-14)</b> هي الاثنتان معاً بعد وضع \(r=D/2\): \(\omega r=\frac{2\pi n}{60}\cdot\frac{D}{2}=\frac{\pi D n}{60}\).</li></ul>`,title:'من أين جاءت كل معادلة؟'},
    {title:'غيّر سرعة الدوران: دائرة المثال (1-1)',widget:(el,B)=>{
      const r=0.5,pi=3.14;let n=240;
      el.innerHTML=`<p class="sub" style="margin:0 0 6px">جسم على محيط دائرة نصف قطرها <span class="ltr">50 cm = 0.5 m</span> (المثال <span class="ltr">(1-1)</span> ص 15). غيّر سرعة الدوران وراقب المعادلتين <span class="ltr">(1-13)</span> و<span class="ltr">(1-12)</span>. الحساب بـ <span class="ltr">π = 3.14</span> مثل الكتاب.</p>
       <label class="w-sl"><span>السرعة الدورانية <span class="ltr">n = <b data-o="n"></b> rpm</span></span><input type="range" min="0" max="480" step="30" value="${n}" dir="ltr" aria-label="السرعة الدورانية"></label>
       <div class="w-facts"><div><span>دورات في الثانية <bdi dir="ltr">n/60</bdi></span><b data-o="s"></b></div><div><span>السرعة الزاوية <bdi dir="ltr">ω = 2πn/60</bdi></span><b data-o="w"></b></div><div><span>السرعة الخطية <bdi dir="ltr">v = ω·r</bdi></span><b data-o="v"></b></div></div>
       <p class="sub" data-o="m" style="margin-top:8px"></p>`;
      const o=k=>el.querySelector(`[data-o="${k}"]`),rg=el.querySelector('input');
      const draw=()=>{const w=2*pi*n/60,v=w*r;o('n').textContent=n;o('s').textContent=B.fmtN(n/60,2)+' rev/s';o('w').textContent=B.fmtN(w,2)+' rad/s';o('v').textContent=B.fmtN(v,2)+' m/s';
        o('m').innerHTML=n===240?'هذه معطيات المثال <span class="ltr">(1-1)</span>: <span class="ltr">ω = 25.12 rad/s</span> و <span class="ltr">v = 12.56 m/s</span> كما في الكتاب.':n===480?'ضعف سرعة الدوران = ضعف السرعة الزاوية = ضعف السرعة الخطية.':n===0?'العجلة متوقفة: كل السرعات صفر.':'السرعة الزاوية والخطية تتناسبان طردياً مع سرعة الدوران.'};
      rg.oninput=()=>{n=+rg.value;draw()};draw();B.math(el);
    }},
    {watch:String.raw`<p>قبل التعويض في \(v=\omega\cdot r\) حوّل نصف القطر إلى المتر (<span class="ltr">50 cm = 0.5 m</span>)، وحوّل السرعة إلى <span class="ltr">rad/s</span> بالمعادلة <span class="ltr">(1-13)</span>؛ لا تعوّض بالـ <span class="ltr">rpm</span> مباشرة. والكتاب يكتب المسافة مرة \(s\) ومرة \(S\) في هذا الاشتقاق، وهما الشيء نفسه.</p>`}
   ]},

  {st:7,short:'مثال (1-1)',title:'مثال <span class="ltr">(1-1)</span>',ref:'ص 15',
   q:'كيف نحسب السرعة الزاوية والخطية والزاوية والقوس لجسم يدور، خطوة بخطوة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="معطيات المثال 1-1: دائرة نصف قطرها 50 cm، والجسم يدور 240 rpm، والزمن خمس ثوان" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><circle cx="150" cy="140" r="80" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="150" cy="140" r="4.5" fill="#2C4A40"/><g data-tip="نصف القطر ⟦r = 50 cm = 0.5 m⟧."><line x1="150" y1="140" x2="230" y2="140" stroke="#2C4A40" stroke-width="3"/><text x="190" y="132" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">50 cm</text></g><g data-tip="الجسم المتحرك على محيط الدائرة."><circle cx="230" cy="140" r="9" fill="#E8735A" stroke="#2C4A40" stroke-width="1.5"/></g><g data-tip="سرعة الدوران ⟦n = 240 rpm⟧: الجسم يكمل 240 دورة في الدقيقة."><path d="M70.3 94 A92 92 0 0 1 134 49.4" fill="none" stroke="#4FB3A9" stroke-width="4" stroke-linecap="round"/><polygon points="145.8,47.3 135,55.3 133,43.5" fill="#4FB3A9"/><text x="62" y="62" text-anchor="middle" font-size="14" fill="#4FB3A9" font-weight="700" font-family="var(--mono)" direction="ltr">240 rpm</text></g><g data-tip="المطلوب: السرعة الزاوية، والسرعة الخطية، والزاوية والقوس المقطوعان خلال ⟦5 s⟧."><rect x="54" y="238" width="252" height="54" rx="12" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="180" y="260" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">المطلوب: <tspan font-family="var(--mono)" direction="ltr" unicode-bidi="embed">ω ، v</tspan></text><text x="180" y="282" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">و <tspan font-family="var(--mono)" direction="ltr" unicode-bidi="embed">θ ، s</tspan> خلال خمس ثوان</text></g></svg>`,
   cap:'معطيات المثال <span class="ltr">(1-1)</span>: نصف القطر <span class="ltr">50 cm</span> وسرعة الدوران <span class="ltr">240 rpm</span>.<br><b>مرّر المؤشر على أجزاء الرسمة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'ما أول خطوة لحساب السرعة الزاوية في هذا المثال؟',opts:[
     ['ضرب <span class="ltr">240</span> في <span class="ltr">0.5</span>',false,'هذا خلط بين المعادلتين: نصف القطر يدخل في السرعة الخطية لا الزاوية.'],
     ['تحويل <span class="ltr">240 rpm</span> إلى <span class="ltr">rad/s</span> بالمعادلة <span class="ltr">(1-13)</span>',true,String.raw`\(\omega=\frac{2\pi n}{60}=\frac{2\pi\times240}{60}\)، وهي أول خطوة في حل الكتاب.`],
     ['قسمة <span class="ltr">240</span> على <span class="ltr">5</span>',false,'الزمن <span class="ltr">5 s</span> يُستعمل في آخر خطوتين فقط (الزاوية والقوس).']]}}
   ],
   body:[
    {book:String.raw`<p>جسم يتحرك على محيط دائرة نصف قطرها <span class="ltr">50 cm</span>، ويدور الجسم <span class="ltr">240 rpm</span> حول مركز الدائرة، احسب: (i) السرعة الزاوية. (ii) السرعة الخطية. (iii) الزاوية المقطوعة خلال خمس ثوان. (iv) القوس المقطوع خلال خمس ثوان.</p>
     <p><b>الحل:</b> \(n=240\ \text{rpm}\)</p>
     <div class="eq">$$\text{i)}\ \ \omega=\frac{2\pi n}{60}=\frac{2\pi\times240}{60}=25.12\ \text{rad/sec}$$</div>
     <div class="eq">$$\text{ii)}\ \ v=\omega\cdot r=25.12\times0.5=12.56\ \text{m/sec}$$</div>
     <div class="eq">$$\text{iii)}\ \ \theta=\omega\cdot t=25.12\times5=125.6\ \text{rad}$$</div>
     <div class="eq">$$\text{iv)}\ \ s=v\cdot t=12.56\times5=62.8\ \text{m}$$</div>`,ref:'ص 15'},
    {tip:String.raw`<p>الكتاب يستعمل في الحل \(\pi=3.14\)، لذلك خرجت \(\omega=25.12\). بالقيمة الدقيقة لـ π تكون \(\omega=25.13\ \text{rad/s}\) و \(v=12.57\ \text{m/s}\) و \(\theta=125.66\ \text{rad}\) و \(s=62.83\ \text{m}\). الفرق صغير جداً ولا يُعد خطأ.</p>`,title:'لماذا 25.12 وليس 25.13؟'},
    {tip:String.raw`<p>لاحظ أن الخطوتين (iii) و(iv) هما نظيرا \(S=v\cdot t\) للسرعة الثابتة: الزاوية = السرعة الزاوية × الزمن، والقوس = السرعة الخطية × الزمن. وتحقق: \(s=\theta\cdot r=125.6\times0.5=62.8\ \text{m}\). الحل خطوة بخطوة بأرقامك في تبويب «الأمثلة المحلولة».</p>`}
   ]},

  {st:8,short:'أسئلة وتمارين',title:'أسئلة وتمارين متنوعة <span class="ltr">(1-4)</span> إلى <span class="ltr">(1-9)</span>',ref:'ص 16',
   q:'ستة أسئلة من نهاية الوحدة تخص هذا الدرس: تعريفات وعلاقات وتمرين حسابي.',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ست بطاقات للأسئلة 1-4 إلى 1-9 مع موضوع كل منها" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="⟦1-4⟧: تعريف الراديان والسرعة الزاوية والتسارع الزاوي (المحطات 1–3)."><rect x="190" y="40" width="130" height="62" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="255" y="64" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">1-4</text><text x="255" y="88" text-anchor="middle" font-size="12" fill="#2C4A40" direction="rtl">تعريفات دورانية</text></g><g data-tip="⟦1-5⟧: تعريف السرعة الخطية والسرعة الدورانية (الدرس السابق والمحطة 6)."><rect x="40" y="40" width="130" height="62" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="105" y="64" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">1-5</text><text x="105" y="88" text-anchor="middle" font-size="12" fill="#2C4A40" direction="rtl">تعريفات خطية</text></g><g data-tip="⟦1-6⟧: العلاقة بين السرعة الدورانية والزاوية، المعادلة ⟦(1-13)⟧."><rect x="190" y="116" width="130" height="62" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="255" y="140" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">1-6</text><text x="255" y="164" text-anchor="middle" font-size="12" fill="#2C4A40" font-family="var(--mono)" direction="ltr">n ↔ ω</text></g><g data-tip="⟦1-7⟧: العلاقة بين السرعة الخطية والدورانية، المعادلة ⟦(1-14)⟧."><rect x="40" y="116" width="130" height="62" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="105" y="140" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">1-7</text><text x="105" y="164" text-anchor="middle" font-size="12" fill="#2C4A40" font-family="var(--mono)" direction="ltr">v ↔ n</text></g><g data-tip="⟦1-8⟧: العلاقة بين السرعة الخطية والزاوية، المعادلة ⟦(1-12)⟧."><rect x="190" y="192" width="130" height="62" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="255" y="216" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">1-8</text><text x="255" y="240" text-anchor="middle" font-size="12" fill="#2C4A40" font-family="var(--mono)" direction="ltr">v ↔ ω</text></g><g data-tip="⟦1-9⟧: تمرين حسابي بطريقة المثال ⟦(1-1)⟧ (المحطة 7)."><rect x="40" y="192" width="130" height="62" rx="12" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><text x="105" y="216" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">1-9</text><text x="105" y="240" text-anchor="middle" font-size="12" fill="#2C4A40" direction="rtl">تمرين حسابي</text></g><text x="180" y="290" text-anchor="middle" font-size="13" fill="#2C4A40" direction="rtl">الكتاب لا يعطي إجابات للأسئلة</text></svg>`,
   cap:'الأسئلة الستة مختصرة، والبطاقة الصفراء هي التمرين الحسابي.<br><b>مرّر المؤشر على كل بطاقة (أو المسها في الجوال) لتعرف المحطة أو المعادلة التي تساعدك.</b>',
   side:[
    {predict:{q:'(من التمرين <span class="ltr">1-9</span>) جسم يدور <span class="ltr">180 rpm</span>. سرعته الزاوية بـ <span class="ltr">π = 3.14</span>:',opts:[
     ['<span class="ltr">3 rad/s</span>',false,String.raw`هذا عدد الدورات في الثانية (\(180/60\))، ولم نضرب بعد في \(2\pi\).`],
     ['<span class="ltr">1130.4 rad/s</span>',false,'نسيت القسمة على <span class="ltr">60</span> لتحويل الدقيقة إلى ثوانٍ.'],
     ['<span class="ltr">18.84 rad/s</span>',true,String.raw`\(\omega=\frac{2\times3.14\times180}{60}=18.84\ \text{rad/s}\) بالمعادلة <span class="ltr">(1-13)</span>.`]]}}
   ],
   body:[
    {book:String.raw`<p><b>1-4:</b> عرف كلاً من: الراديان و السرعة الزاوية و التسارع الزاوي.</p>
     <p><b>1-5:</b> عرف كلاً من: السرعة الخطية و السرعة الدورانية.</p>
     <p><b>1-6:</b> اذكر العلاقة بين السرعة الدورانية و السرعة الزاوية.</p>
     <p><b>1-7:</b> اذكر العلاقة بين السرعة الخطية و السرعة الدورانية.</p>
     <p><b>1-8:</b> اذكر العلاقة بين السرعة الخطية و السرعة الزاوية.</p>
     <p><b>1-9:</b> جسم يتحرك على محيط دائرة نصف قطرها <span class="ltr">60 cm</span>، ويدور الجسم بسرعة مقدارها <span class="ltr">180 rpm</span>، احسب كلاً من: السرعة الزاوية والسرعة الخطية على محيط الدائرة، والزاوية المقطوعة والقوس المقطوع خلال أربع ثوان.</p>`,ref:'ص 16'},
    {tip:String.raw`<p><b>1-4:</b> <b>الراديان:</b> الزاوية المركزية التي تقابل قوساً طوله يساوي نصف قطر دائرته. <b>السرعة الزاوية:</b> الإزاحة الزاوية المقطوعة خلال وحدة الزمن \(\omega=d\theta/dt\) بوحدة <span class="ltr">rad/s</span>. <b>التسارع الزاوي:</b> معدل التغير في السرعة الزاوية خلال وحدة الزمن \(\alpha=d\omega/dt\).</p>
     <p><b>1-5:</b> <b>السرعة الخطية:</b> معدل التغير في المسافة خلال وحدة الزمن \(v=dS/dt\) بوحدة <span class="ltr">m/s</span>. <b>السرعة الدورانية:</b> عدد الدورات في وحدة الزمن، وتقاس عادةً بالدورة في الدقيقة <span class="ltr">(rpm)</span>.</p>
     <p><b>1-6:</b> \(\omega=\dfrac{2\pi n}{60}\) <span class="ltr">(1-13)</span>. &nbsp; <b>1-7:</b> \(v=\dfrac{\pi D n}{60}\) <span class="ltr">(1-14)</span>. &nbsp; <b>1-8:</b> \(v=\omega\cdot r\) <span class="ltr">(1-12)</span>.</p>
     <p><b>1-9:</b> بطريقة المثال <span class="ltr">(1-1)</span> و \(\pi=3.14\): \(\omega=18.84\ \text{rad/s}\)، \(v=18.84\times0.6=11.30\ \text{m/s}\)، \(\theta=18.84\times4=75.36\ \text{rad}\)، \(s=11.30\times4=45.2\ \text{m}\).</p>`,title:'إجابات مقترحة (ليست من الكتاب)'}
   ]},

  {recap:[
   String.raw`الراديان: الزاوية المركزية التي يقابلها قوس طوله يساوي نصف القطر، والدورة الكاملة \(2\pi\) راديان (ص 13).`,
   String.raw`السرعة الزاوية \(\omega=d\theta/dt\) (1-7) والتسارع الزاوي \(\alpha=d\omega/dt\) (1-8)، وعلاقات الدوران بتسارع منتظم (1-9) نظيرة (1-3) (ص 13).`,
   String.raw`العزم \(T=F\cdot r\) (1-10)، والقدرة اللازمة للتدوير \(P=T\cdot\omega\) (1-11) (ص 13).`,
   String.raw`العلاقة بين الحركتين: \(v=\omega\cdot r\) (1-12)، \(\omega=2\pi n/60\) (1-13)، \(v=\pi D n/60\) (1-14) (ص 14).`]}
],
 theory:[
  {h:'2- الحركة الزاوية (التحريك الدوراني)',ref:'ص 13',html:`<p><b>أ- الإزاحة الزاوية \\((\\theta)\\):</b> «عندما تدور أسطوانة قطرها \\((D)\\) حول محورها دورةً كاملةً، بسرعة زاوية \\((\\omega)\\)، فإنها ستقطع زاوية \\((\\theta=2\\pi)\\) راديان (rad). ويعرف <b>الراديان</b> بأنه الزاوية المركزية التي تقابل قوساً طوله يساوي نصف قطر دائرته.»</p>`},
  {fig:'',ref:'',caption:'<b>توضيح للمتدرب — ليس من الكتاب:</b> الراديان. الدورة الكاملة \\(2\\pi\\approx6.28\\ \\text{rad}\\) = 360°، أي أن الراديان الواحد ≈ 57.3°.',draw:()=>box(radianSVG(),340)},
  {html:`<p><b>ب- السرعة الزاوية \\((\\omega)\\):</b> «هي الإزاحة الزاوية المقطوعة خلال وحدة الزمن.»</p>
   $$\\omega=\\frac{d\\theta}{dt} \\qquad (1\\text{-}7)$$
   <p><b>ج- التسارع الزاوي \\((\\alpha)\\):</b> «هو معدل التغير في السرعة الزاوية خلال وحدة الزمن.»</p>
   $$\\alpha=\\frac{d\\omega}{dt} \\qquad (1\\text{-}8)$$
   <p><b>د- علاقات التحريك الزاوي لجسم يدور بتسارع زاوي منتظم:</b></p>
   $$\\begin{cases} \\omega=\\omega_0+\\alpha\\times t \\\\ \\theta=\\omega_0\\times t+\\tfrac{1}{2}\\times\\alpha\\times t^2 \\\\ \\omega^2=\\omega_0^2+2\\times\\alpha\\times\\theta \\end{cases} \\qquad (1\\text{-}9)$$
   <p>«وفي هذه الحالة يمكن حساب <b>العزم</b> اللازم للتدوير من المعادلة التالية:»</p>
   $$T=F\\cdot r \\qquad (1\\text{-}10)$$
   <p><b>هـ- القدرة اللازمة للتدوير:</b> «القدرة اللازمة لتدوير حمل دوراني بسرعة زاوية مقدارها \\(\\omega\\) يمكن حسابها من العلاقة التالية:»</p>
   $$P=T\\cdot\\omega \\qquad (1\\text{-}11)$$`,ref:'ص 13'},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب:</b> في المعادلة (1-10) \\(r\\) هو <b>نصف القطر</b> (ذراع القوة): المسافة من محور الدوران إلى نقطة تأثير القوة. القوة نفسها على ذراع أطول تعطي عزماً أكبر — لهذا يسهل فتح الباب من طرفه البعيد عن المفصلات.'},
  {html:`<p>حيث:</p><div class="ed-tbl"><table class="tt"><thead><tr><th>المصطلح</th><th>رمز المصطلح</th><th>الوحدة</th></tr></thead><tbody>
   <tr><td>السرعة الزاوية النهائية</td><td>${lt('ω')}</td><td>${lt('rad/s')}</td></tr>
   <tr><td>السرعة الزاوية الابتدائية</td><td>${lt('ω<sub>0</sub>')}</td><td>${lt('rad/s')}</td></tr>
   <tr><td>السرعة الدورانية</td><td>${lt('n')}</td><td>${lt('rpm')}</td></tr>
   <tr><td>الإزاحة الزاوية</td><td>${lt('θ')}</td><td>${lt('rad')}</td></tr>
   <tr><td>العزم</td><td>${lt('T')}</td><td>${lt('Nm')}</td></tr>
   <tr><td>القدرة</td><td>${lt('P')}</td><td>${lt('W')}</td></tr>
   <tr><td>قطر الأسطوانة</td><td>${lt('D')}</td><td>${lt('m')}</td></tr>
   <tr><td>التسارع الزاوي <span class="sub">(إضافة من خارج الكتاب: ليس في جدول الكتاب)</span></td><td>${lt('α')}</td><td>${lt('rad/s²')}</td></tr></tbody></table></div>`,ref:'ص 14'},
  {note:`<b>توضيح للمتدرب — ليس من الكتاب: كل كمية خطية لها نظير دوراني</b><div class="ed-tbl"><table class="tt"><thead><tr><th>الحركة الخطية</th><th>الحركة الدورانية</th></tr></thead><tbody>
   <tr><td>المسافة ${lt('S (m)')}</td><td>الإزاحة الزاوية ${lt('θ (rad)')}</td></tr>
   <tr><td>السرعة ${lt('v (m/s)')}</td><td>السرعة الزاوية ${lt('ω (rad/s)')}</td></tr>
   <tr><td>التسارع ${lt('a (m/s²)')}</td><td>التسارع الزاوي ${lt('α (rad/s²)')}</td></tr>
   <tr><td>القوة ${lt('F (N)')}</td><td>العزم ${lt('T (Nm)')}</td></tr>
   <tr><td>القدرة ${lt('P = F·v')}</td><td>القدرة ${lt('P = T·ω')}</td></tr></tbody></table></div>والمعادلات (1-9) هي نفسها (1-3) بعد تبديل كل رمز بنظيره.`},
  {h:'3- العلاقة بين الحركة الخطية والحركة الدورانية',ref:'ص 14',html:`<p>«عندما يتحرك جسم حركة خطية على محيط دائرة بسرعة خطية ثابتة قدرها \\((v)\\)، فإنه سيقطع مسافة مقدارها \\((s)\\) على محيط الدائرة خلال زمن معين \\((t)\\) بحيث \\((s=v\\cdot t)\\)، فإذا أكمل الجسم دائرةً كاملةً فإنه سيقطع مسافة محيط الدائرة، وهي المسافة الخطية المقطوعة لدائرة كاملة \\((S=2\\pi r)\\) والزاوية المقطوعة في هذه الحالة هي \\((\\theta=2\\pi)\\)، إذاً:»</p>
   $$s=v\\cdot t \\quad\\text{and}\\quad s=2\\pi r=\\theta\\,r \\qquad\\Rightarrow\\qquad v\\cdot t=\\theta\\cdot r$$
   <p>«وبقسمة الطرفين على الزمن \\(t\\) ينتج أن:»</p>
   $$v=\\omega\\cdot r \\qquad (1\\text{-}12)$$
   <p>«ولحساب عدد الدورات المقطوعة في الثانية (السرعة الدورانية) نستخدم المعادلة:» \\(n=\\dfrac{\\omega}{2\\pi}\\)</p>
   <p>«وبالتالي فإن عدد الدورات المقطوعة في الدقيقة يكون:» \\(n=\\dfrac{60\\,\\omega}{2\\pi}\\ \\text{rpm}\\)</p>
   $$\\omega=\\frac{2\\pi\\cdot n}{60}\\quad \\text{rad/s} \\qquad (1\\text{-}13)$$
   <p>«وبالتعويض بالمعادلة (1-13) في المعادلة (1-12) ينتج أن:»</p>
   $$v=\\frac{\\pi D n}{60} \\qquad (1\\text{-}14)$$`},
  {fig:'',ref:'',caption:'<b>توضيح للمتدرب — ليس من الكتاب:</b> السرعة الخطية للجسم على المحيط مماسية للدائرة، ومقدارها \\(v=\\omega\\,r\\). في المعادلة (1-14) استُبدل نصف القطر بالقطر: \\(r=D/2\\)، فـ \\(\\omega r=\\frac{2\\pi n}{60}\\cdot\\frac{D}{2}=\\frac{\\pi D n}{60}\\).',draw:()=>box(rimSVG(),340)},
  {h:'مثال (1-1)',ref:'ص 15',html:`<p>«جسم يتحرك على محيط دائرة نصف قطرها <span class="ltr">50 cm</span>، ويدور الجسم <span class="ltr">240 rpm</span> حول مركز الدائرة، احسب: (i) السرعة الزاوية. (ii) السرعة الخطية. (iii) الزاوية المقطوعة خلال خمس ثوان. (iv) القوس المقطوع خلال خمس ثوان.»</p>
   <p>الحل: \\(\\omega=\\frac{2\\pi\\times240}{60}=25.12\\ \\text{rad/s}\\)، \\(v=25.12\\times0.5=12.56\\ \\text{m/s}\\)، \\(\\theta=25.12\\times5=125.6\\ \\text{rad}\\)، \\(s=12.56\\times5=62.8\\ \\text{m}\\). الحل خطوة بخطوة في تبويب «الأمثلة المحلولة»، ويمكنك تشغيله حياً في المختبر.</p>`},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب:</b> الكتاب يستعمل في الحل \\(\\pi=3.14\\)، لذلك خرجت \\(\\omega=25.12\\). بالقيمة الدقيقة لـ π تكون \\(\\omega=25.13\\ \\text{rad/s}\\) و \\(v=12.57\\ \\text{m/s}\\) و \\(\\theta=125.66\\ \\text{rad}\\) و \\(s=62.83\\ \\text{m}\\). الفرق صغير جداً ولا يُعد خطأ. في الحاسبة خانة لقيمة π تستطيع تغييرها.'},
  {h:'أسئلة وتمارين متنوعة (1-4) إلى (1-9)',ref:'ص 16',html:NOANS+
   Q('1-4','عرف كلاً من: الراديان و السرعة الزاوية و التسارع الزاوي.','<b>الراديان:</b> الزاوية المركزية التي تقابل قوساً طوله يساوي نصف قطر دائرته (الدورة الكاملة = \\(2\\pi\\ \\text{rad}\\)). <b>السرعة الزاوية:</b> الإزاحة الزاوية المقطوعة خلال وحدة الزمن \\(\\omega=d\\theta/dt\\) بوحدة rad/s. <b>التسارع الزاوي:</b> معدل التغير في السرعة الزاوية خلال وحدة الزمن \\(\\alpha=d\\omega/dt\\) بوحدة rad/s².')+
   Q('1-5','عرف كلاً من: السرعة الخطية و السرعة الدورانية.','<b>السرعة الخطية:</b> معدل التغير في المسافة خلال وحدة الزمن \\(v=dS/dt\\) بوحدة m/s. <b>السرعة الدورانية:</b> عدد الدورات التي يقطعها الجسم في وحدة الزمن، وتقاس عادةً بالدورة في الدقيقة (rpm)، \\(n=60\\omega/2\\pi\\).')+
   Q('1-6','اذكر العلاقة بين السرعة الدورانية و السرعة الزاوية.','\\(\\omega=\\dfrac{2\\pi n}{60}\\ \\text{rad/s}\\)، أو \\(n=\\dfrac{60\\,\\omega}{2\\pi}\\ \\text{rpm}\\) (المعادلة 1-13).')+
   Q('1-7','اذكر العلاقة بين السرعة الخطية و السرعة الدورانية.','\\(v=\\dfrac{\\pi D n}{60}\\ \\text{m/s}\\) حيث D القطر بالمتر و n بالـ rpm (المعادلة 1-14).')+
   Q('1-8','اذكر العلاقة بين السرعة الخطية و السرعة الزاوية.','\\(v=\\omega\\cdot r\\) حيث r نصف القطر بالمتر (المعادلة 1-12).')+
   Q('1-9','جسم يتحرك على محيط دائرة نصف قطرها <span class="ltr">60 cm</span>، ويدور الجسم بسرعة مقدارها <span class="ltr">180 rpm</span>، احسب كلاً من: السرعة الزاوية والسرعة الخطية على محيط الدائرة، والزاوية المقطوعة والقوس المقطوع خلال أربع ثوان.','بطريقة المثال (1-1) و \\(\\pi=3.14\\): \\(\\omega=\\frac{2\\times3.14\\times180}{60}=18.84\\ \\text{rad/s}\\)، \\(v=18.84\\times0.6=11.30\\ \\text{m/s}\\)، \\(\\theta=18.84\\times4=75.36\\ \\text{rad}\\)، \\(s=11.30\\times4=45.2\\ \\text{m}\\). (بقيمة π الدقيقة: 18.85 rad/s و 11.31 m/s و 75.40 rad و 45.24 m.) الحل التفصيلي في تبويب «الأمثلة المحلولة».')},
  {err:'<div class="fixnote"><b>ملاحظات على الكتاب:</b> (1) ص 13: المعادلة (1-10) \\(T=F\\cdot r\\) لا تعرّف \\(r\\)، ولا يرد في جدول الرموز (ص 14) — المقصود نصف القطر (ذراع القوة). (2) جدول ص 14 لا يذكر التسارع الزاوي \\(\\alpha\\) ولا وحدته (rad/s²) — أضفناه في الجدول وعلّمناه. (3) جدول ص 14: الوحدتان مكتوبتان «Rpm» و«Rad» بحرف كبير، والمعتاد rpm و rad — صُححتا. (4) ص 14: يكتب الكتاب المسافة مرة \\(s\\) ومرة \\(S\\) في الاشتقاق نفسه، وهما الشيء نفسه. لا توجد أخطاء حسابية؛ المثال (1-1) محسوب بـ \\(\\pi=3.14\\).</div>'}
 ],
 lab:(el)=>{
  let mode='c',D=1,n=240,n0=0,al=2,F=0,run=false,t=0,th=0,w=2*PI*240/60,tStop=null,hist=[],hT=0;const did={};
  const SLOW=10;
  el.innerHTML=`<div class="grid ed-lab">
   <div class="panel c5"><h2>الأسطوانة الدوارة <small>مبنية على ص 13–14 والمعادلات (1-7) إلى (1-14)</small></h2>
    <div class="svgbox" id="l2v" style="max-width:380px;margin-inline:auto"></div>
    <p class="sub">النقطة البرتقالية جسم على المحيط، والسهم الأزرق سرعته الخطية (مماسية)، والقوس البرتقالي الزاوية المقطوعة في الدورة الحالية، والسهم الأحمر قوة على المحيط. الدوران في الرسم مبطأ ${SLOW} مرات، أما الأرقام فحقيقية.</p></div>
   <div class="panel c7"><h2>التحكم</h2>
    <div class="ed-row">${segHTML('md',[['c','سرعة ثابتة'],['a','تسارع زاوي منتظم']],mode)}</div>
    ${sl('l2D','قطر الأسطوانة D',0.1,2,0.05,D)}
    <div id="l2c">${sl('l2n','السرعة الدورانية n',0,600,5,n)}</div>
    <div id="l2a">${sl('l2n0','السرعة الابتدائية n<sub>0</sub>',0,600,5,n0)}${sl('l2al','التسارع الزاوي α (السالب = تباطؤ)',-10,10,0.5,al)}</div>
    ${sl('l2F','قوة مماسية على المحيط F',0,2000,50,F)}
    <div class="ed-row"><button class="btn primary" id="l2go">تشغيل</button><button class="btn" id="l2rs">إعادة من الصفر</button><button class="btn" id="l2ex">مثال (1-1): خمس ثوان</button><button class="btn" id="l2e9">تمرين (1-9): أربع ثوان</button></div>
    <p class="sub" id="l2msg">أي تغيير في السرعة أو التسارع يعيد العد إلى <span class="ltr">t = 0</span>.</p>
    <div class="facts" id="l2fx"></div></div>
   <div class="panel c12"><h2>المنحنيات مع الزمن</h2><div class="ed-plots"><div class="svgbox" id="l2p1"></div><div class="svgbox" id="l2p2"></div></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l2st"></ol></div></div>`;
  B.math(el);const $=s=>el.querySelector(s);
  const w0=()=>2*PI*(mode==='c'?n:n0)/60;
  const reset=()=>{t=0;th=0;w=w0();hist=[[0,w,0]];hT=0};
  const ui=()=>{$('#l2c').style.display=mode==='c'?'':'none';$('#l2a').style.display=mode==='a'?'':'none';
   $('#l2D-v').textContent=fm(D,2)+' m';$('#l2n-v').textContent=fm(n)+' rpm';$('#l2n0-v').textContent=fm(n0)+' rpm';$('#l2al-v').textContent=fm(al)+' rad/s²';$('#l2F-v').textContent=fm(F)+' N';
   $('#l2go').textContent=run?'إيقاف مؤقت':'تشغيل'};
  const setSl=(id,v)=>{$('#'+id).value=v};
  $('#l2D').oninput=e=>{D=+e.target.value;ui()};
  $('#l2F').oninput=e=>{F=+e.target.value;ui()};
  $('#l2n').oninput=e=>{n=+e.target.value;tStop=null;reset();ui()};
  $('#l2n0').oninput=e=>{n0=+e.target.value;tStop=null;reset();ui()};
  $('#l2al').oninput=e=>{al=+e.target.value;tStop=null;reset();ui()};
  $('#l2go').onclick=()=>{if(t>=20||(tStop!=null&&t>=tStop)){tStop=null;reset()}run=!run;ui()};
  $('#l2rs').onclick=()=>{run=false;tStop=null;reset();ui()};
  const preset=(d,nn,ts,k)=>{mode='c';segSet(el,'md','c');D=d;n=nn;F=0;setSl('l2D',D);setSl('l2n',n);setSl('l2F',0);tStop=ts;reset();run=true;did[k]=1;ui()};
  $('#l2ex').onclick=()=>preset(1,240,5,'ex');$('#l2e9').onclick=()=>preset(1.2,180,4,'e9');
  segBind(el,'md',z=>{mode=z;run=false;tStop=null;reset();ui()});
  const steps=stepsUI($('#l2st'),[
   {t:'من n إلى ω',x:'في «سرعة ثابتة» اضبط <span class="ltr">n = 240 rpm</span> ثم «تشغيل»: \\(\\omega=2\\pi n/60=25.13\\ \\text{rad/s}\\) (المعادلة 1-13)، وعدد الدورات في الثانية \\(n/60=4\\).',done:()=>mode==='c'&&n===240&&run&&t>1},
   {t:'المثال (1-1) حياً',x:'اضغط «مثال (1-1): خمس ثوان» وانتظر حتى يتوقف العد عند <span class="ltr">5 s</span>: الزاوية <span class="ltr">θ = 125.66 rad</span> (نحو 20 دورة) والقوس <span class="ltr">s = 62.83 m</span>. الكتاب يكتب 125.6 و 62.8 لأنه يستعمل π = 3.14.',done:()=>did.ex&&tStop===5&&t>=5},
   {t:'القطر والسرعة الخطية',x:'بالسرعة نفسها <span class="ltr">n = 240 rpm</span> اجعل القطر <span class="ltr">D = 2 m</span>: السرعة الزاوية لم تتغير، أما السرعة الخطية للنقطة فتضاعفت إلى <span class="ltr">25.13 m/s</span> لأن \\(v=\\omega r\\) (المعادلة 1-12).',done:()=>mode==='c'&&n===240&&D===2},
   {t:'العزم والقدرة',x:'حرّك القوة المماسية F: العزم \\(T=F\\cdot r\\) (1-10) يكبر مع القطر، والقدرة \\(P=T\\cdot\\omega\\) (1-11) تكبر مع السرعة. قارن: القدرة نفسها تساوي \\(F\\cdot v\\) كما في الحركة الخطية.',done:()=>F>0&&w>0.1},
   {t:'تسارع زاوي منتظم',x:'اختر «تسارع زاوي منتظم» واجعل <span class="ltr">n<sub>0</sub> = 0</span> و α موجباً ثم «تشغيل»: \\(\\omega\\) تزيد خطياً و θ تزيد كقطع مكافئ (المعادلات 1-9).',done:()=>mode==='a'&&al>0&&n0===0&&t>=3},
   {t:'تباطؤ حتى التوقف',x:'اجعل <span class="ltr">n<sub>0</sub></span> كبيرة و α سالبة: السرعة الزاوية تتناقص حتى تصل إلى الصفر فتتوقف الأسطوانة، مثل محرك فُصل عن التغذية (تمرين 1-2).',done:()=>mode==='a'&&al<0&&n0>0&&w===0&&t>0}
  ]);
  reset();ui();
  loopOn(el,dt=>{
   if(run){let h=Math.min(dt,20-t);if(tStop!=null)h=Math.min(h,tStop-t);h=Math.max(0,h);
    if(mode==='c'){w=2*PI*n/60;th+=w*h}
    else{const wn=w+al*h;if(wn<=0&&al<0){const tt=w/(-al);th+=w*tt/2;w=0}else{th+=(w+wn)/2*h;w=wn}}
    t+=h;hT+=h;if(hT>=0.1){hT=0;hist.push([t,w,th])}
    if(t>=20-1e-9||(tStop!=null&&t>=tStop-1e-9)){if(tStop!=null)t=tStop;run=false;hist.push([t,w,th]);ui()}}
   const r=D/2,v=w*r,T=F*r,P=T*w;
   $('#l2v').innerHTML=drumSVG({D,th,thv:th/SLOW,w,v,F});
   $('#l2fx').innerHTML=factsHTML([['الزمن t',lt(fm(t,2)+' s')],['السرعة الزاوية ω',lt(fm(w,2)+' rad/s')],['n = 60ω/2π',lt(fm(60*w/(2*PI),1)+' rpm')],['دورات في الثانية ω/2π',lt(fm(w/(2*PI),2)+' rps')],['السرعة الخطية v = ω·r',lt(fm(v,2)+' m/s')],['v = πDn/60 (1-14)',lt(fm(PI*D*(60*w/(2*PI))/60,2)+' m/s')],['الزاوية θ',lt(fm(th,2)+' rad')],['القوس s = θ·r',lt(fm(th*r,2)+' m')],['العزم T = F·r',lt(fm(T,1)+' Nm')],['القدرة P = T·ω',lt(fm(P,0)+' W')]]);
   if(mode==='a')$('#l2msg').innerHTML=`تحقق من (1-9): \\(\\omega_0+\\alpha t=${fm(Math.max(0,w0()+al*t),2)}\\ \\text{rad/s}\\)${w===0&&al<0?' (توقفت الأسطوانة)':''}. أي تغيير في السرعة أو التسارع يعيد العد إلى \\(t=0\\).`;
   else $('#l2msg').innerHTML=tStop!=null?`العد يتوقف تلقائياً عند \\(t=${tStop}\\ \\text{s}\\).`:'أي تغيير في السرعة أو التسارع يعيد العد إلى \\(t = 0\\).';
   B.math($('#l2msg'));
   const wm=niceMax(Math.max(5,...hist.map(p=>p[1]),w)),tm=niceMax(Math.max(5,...hist.map(p=>p[2]),th));
   $('#l2p1').innerHTML=plotSVG({w:460,h:230,x0:0,x1:20,y0:0,y1:wm,xt:[0,5,10,15,20],yt:ticks(0,wm,4),xl:'t (s)',yl:'ω (rad/s)',series:[{pts:hist.map(p=>[p[0],p[1]]).concat([[t,w]]),col:'--blue'}],aria:'السرعة الزاوية مع الزمن'});
   $('#l2p2').innerHTML=plotSVG({w:460,h:230,x0:0,x1:20,y0:0,y1:tm,xt:[0,5,10,15,20],yt:ticks(0,tm,4),xl:'t (s)',yl:'θ (rad)',series:[{pts:hist.map(p=>[p[0],p[2]]).concat([[t,th]]),col:'--live'}],aria:'الزاوية المقطوعة مع الزمن'});
   steps.check()});
 },
 examples:[
  {title:'مثال (1-1)',ref:'ص 15',q:'<p>«جسم يتحرك على محيط دائرة نصف قطرها <span class="ltr">50 cm</span>، ويدور الجسم <span class="ltr">240 rpm</span> حول مركز الدائرة، احسب: (i) السرعة الزاوية. (ii) السرعة الخطية. (iii) الزاوية المقطوعة خلال خمس ثوان. (iv) القوس المقطوع خلال خمس ثوان.»</p>',
   given:GROT(50,240,5),solve:(g,B,ib)=>solveRot(g,ib),note:'الحل يستعمل \\(\\pi=3.14\\) مثل الكتاب، ويقرب كل ناتج إلى منزلتين عشريتين ثم يستعمله في الخطوة التالية.'},
  {title:'تمرين (1-9) — إجابة مقترحة (ليست من الكتاب)',ref:'ص 16',q:'<p>«جسم يتحرك على محيط دائرة نصف قطرها <span class="ltr">60 cm</span>، ويدور الجسم بسرعة مقدارها <span class="ltr">180 rpm</span>، احسب كلاً من: السرعة الزاوية والسرعة الخطية على محيط الدائرة، والزاوية المقطوعة والقوس المقطوع خلال أربع ثوان.»</p>',
   given:GROT(60,180,4),solve:g=>solveRot(g,false),note:'<b>حل مقترح (ليس من الكتاب)</b> بطريقة المثال (1-1) وتقريبه: الكتاب لا يعطي إجابات للتمارين.'}
 ],
 quiz:[
  {q:'الراديان هو الزاوية المركزية التي تقابل قوساً طوله:',o:['يساوي القطر','يساوي نصف القطر','يساوي محيط الدائرة','يساوي 1 m'],c:1,e:'ص 13.'},
  {q:'عندما تدور أسطوانة دورة كاملة فإنها تقطع زاوية مقدارها:',o:['π rad','2π rad','360 rad','1 rad'],c:1,e:'ص 13: θ = 2π راديان.'},
  {q:'محرك يدور بسرعة 1500 rpm. سرعته الزاوية تقريباً:',o:['25 rad/s','157 rad/s','1500 rad/s','9425 rad/s'],c:1,e:'\\(\\omega=2\\pi\\times1500/60\\approx157.1\\ \\text{rad/s}\\) (المعادلة 1-13).'},
  {q:'قوة 200 N تؤثر مماسياً على طرف بكرة نصف قطرها 0.25 m. العزم:',o:['50 Nm','800 Nm','200.25 Nm','0.00125 Nm'],c:0,e:'\\(T=F\\cdot r=200\\times0.25=50\\ \\text{Nm}\\) (المعادلة 1-10).'},
  {q:'عزم 50 Nm عند سرعة زاوية 100 rad/s يحتاج قدرة:',o:['0.5 W','150 W','2 W','5000 W'],c:3,e:'\\(P=T\\cdot\\omega=50\\times100=5000\\ \\text{W}\\) (المعادلة 1-11).'},
  {q:'العلاقة بين السرعة الخطية والسرعة الزاوية:',o:['v = ω/r','v = ω·r','v = 2πω','v = ω·D·60'],c:1,e:'المعادلة (1-12).'},
  {q:'حداثة قطرها 1 m تدور بسرعة 60 rpm. السرعة الخطية للحبل الملفوف عليها:',o:['1 m/s','3.14 m/s','60 m/s','6.28 m/s'],c:1,e:'\\(v=\\pi D n/60=\\pi\\times1\\times60/60\\approx3.14\\ \\text{m/s}\\) (المعادلة 1-14).'},
  {q:'إذا ضاعفنا قطر الأسطوانة مع بقاء سرعتها الدورانية n ثابتة فإن:',o:['السرعة الزاوية تتضاعف','السرعة الخطية على المحيط تتضاعف','السرعة الخطية تقل للنصف','لا يتغير شيء'],c:1,e:'\\(v=\\pi D n/60\\): السرعة الخطية تتناسب مع القطر، أما ω فتبقى كما هي.'}
 ]
});

})(PLCBOOK);
