/* Unit 7 — آلية اختيار محرك التحريك المناسب (ص 79–87)
   Lesson u7-l1 (source: /home/claude/c5/ex/drv_c.md, lesson 8). Formal theory tab only. */
(function(B){
const {S}=B;
const PI=Math.PI,G=9.81;
const fm=(x,d)=>B.fmtN(x,d);
const fx=v=>(+v).toFixed(1);
const R=(x,d)=>B.round(x,d);
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const lt=s=>`<span class="ltr">${s}</span>`;

/* ---------- styles used only by this course's lesson files (CSS variables only) ---------- */
(function css(){if(typeof document==='undefined'||document.getElementById('edu7-css'))return;const s=document.createElement('style');s.id='edu7-css';s.textContent=`
.ed-sl{display:flex;flex-direction:column;gap:2px;font-size:13.5px;margin-top:10px;min-width:0}
.ed-sl .ed-h{display:flex;justify-content:space-between;gap:8px;align-items:baseline}
.ed-sl b{font-family:var(--mono);direction:ltr;unicode-bidi:isolate;color:var(--blue-ink);font-size:14px;white-space:nowrap}
.ed-sl input[type=range]{width:100%;accent-color:var(--blue);direction:ltr;margin:4px 0}
.ed-row{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;align-items:center}
.ed-row .sub{margin:0}
.ed-q{border:1px solid var(--line);border-radius:12px;padding:10px 14px;margin:10px 0;background:var(--surface)}
.ed-q summary{cursor:pointer;font-weight:600;line-height:1.7}
.ed-ans{margin-top:8px;border-inline-start:3px solid var(--blue);padding:6px 12px;background:var(--blue-soft);border-radius:0 10px 10px 0}
.ed-tbl{overflow-x:auto}
.ed-chip{display:inline-block;padding:3px 10px;border-radius:999px;font-size:12.5px;font-weight:700;background:var(--surface-2);color:var(--muted)}
.ed-chip.ok{background:var(--on-soft);color:var(--on)}
.ed-chip.ld{background:var(--blue-soft);color:var(--blue-ink)}
.ed-chip.warn{background:var(--stop-soft);color:var(--stop)}
.ed-chip.hot{background:var(--live-soft);color:var(--live)}
.ed-lab .seg{flex-wrap:wrap;max-width:100%}
.ed-lab .seg button{white-space:nowrap}
.ed-lab .facts{grid-template-columns:repeat(auto-fit,minmax(130px,1fr))}
.ed-lab .fact b{font-size:16px}
.ed-try{margin:6px 0 0;padding-inline-start:20px}
.ed-cap{font-size:13px;color:var(--muted);margin-top:6px}
`;document.head.appendChild(s)})();

/* ---------- small helpers (local to this file) ---------- */
function loopOn(el,fn){let last=performance.now();const f=now=>{if(!document.body.contains(el))return;const dt=Math.min(0.05,Math.max(0,(now-last)/1000));last=now;try{fn(dt)}catch(e){console.error(e);return}requestAnimationFrame(f)};requestAnimationFrame(f)}
function stepsUI(host,steps){let i=0;
  const draw=()=>{host.innerHTML=steps.map((s,j)=>`<li class="${j<i?'done':j===i?'cur':''}"><span class="k">${j<i?'✓':j+1}</span><div><h4>${LTU(s.t)}</h4><p>${LTU(s.x)}</p>${j===i?`<div class="act">${s.done?'<span class="hint">بانتظار تنفيذك…</span> <button class="btn" data-next>تخطَّ</button>':'<button class="btn primary" data-next>التالي</button>'}</div>`:''}</div></li>`).join('')+
    (i>=steps.length?`<li class="cur"><span class="k">✓</span><div><h4>أحسنت، أنهيت التجربة</h4><p style="display:block">جرّب قيماً أخرى، أو أعد التجربة من أولها.</p><div class="act"><button class="btn" data-restart>إعادة التجربة</button></div></div></li>`:'');B.math(host)};
  host.addEventListener('click',e=>{if(e.target.closest('[data-next]')){i++;draw()}if(e.target.closest('[data-restart]')){i=0;draw()}});draw();
  return {check(){const s=steps[i];if(s&&s.done&&s.done()){i++;draw()}},redraw:draw};}
const sl=(id,label,min,max,step,val)=>`<label class="ed-sl"><span class="ed-h"><span>${label}</span><b id="${id}-v"></b></span><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}" aria-label="${label.replace(/<[^>]+>/g,'')}"></label>`;
const segHTML=(attr,items,cur)=>`<div class="seg" role="group">${items.map(([v,l])=>`<button data-${attr}="${v}" aria-pressed="${String(v)===String(cur)}">${l}</button>`).join('')}</div>`;
const segSet=(el,attr,v)=>el.querySelectorAll(`[data-${attr}]`).forEach(b=>b.setAttribute('aria-pressed',String(String(b.dataset[attr])===String(v))));
const segBind=(el,attr,fn)=>el.querySelectorAll(`[data-${attr}]`).forEach(b=>b.addEventListener('click',()=>{segSet(el,attr,b.dataset[attr]);fn(b.dataset[attr])}));
const swHTML=(id,b,label,on)=>`<button class="sw" id="${id}" aria-pressed="${on?'true':'false'}"><span class="knob"></span><b>${b}</b><small>${label}</small></button>`;
const fact=(l,id)=>`<div class="fact"><span>${l}</span><b id="${id}">—</b></div>`;
const TS=s=>`<tspan direction="ltr" unicode-bidi="embed">${s}</tspan>`;          // Latin/digits inside Arabic SVG text
const arT=(x,y,s,o)=>{o=o||{};return `<text class="txt ar" x="${x}" y="${y}" text-anchor="${o.a||'middle'}"${o.fs?` font-size="${o.fs}"`:''}${o.col?` style="fill:var(${o.col})"`:''}>${s}</text>`};
const sb=(b,x)=>`${b}<tspan font-size="9" dy="4">${x}</tspan><tspan dy="-4"> </tspan>`;
const box=(svg,max)=>`<div class="svgbox" style="margin-inline:auto;${max?`max-width:${max}px`:''}">${svg}</div>`;
function arrow(x1,y1,x2,y2,col,w){w=w||2.4;const a=Math.atan2(y2-y1,x2-x1),L=Math.hypot(x2-x1,y2-y1);if(L<3)return '';const h=Math.min(11,L*0.7)+w;
  const bx=x2-h*Math.cos(a),by=y2-h*Math.sin(a),px=-Math.sin(a)*h*0.45,py=Math.cos(a)*h*0.45;
  return `<path d="M${fx(x1)} ${fx(y1)}L${fx(bx)} ${fx(by)}" stroke="var(${col})" stroke-width="${w}" fill="none" stroke-linecap="round"/><path d="M${fx(x2)} ${fx(y2)}L${fx(bx+px)} ${fx(by+py)}L${fx(bx-px)} ${fx(by-py)}Z" fill="var(${col})"/>`}
function niceMax(v){if(!(v>0)||!isFinite(v))return 1;const e=Math.pow(10,Math.floor(Math.log10(v)));for(const k of [1,1.2,1.5,2,2.5,3,4,5,6,8,10])if(k*e>=v*0.99999)return k*e;return 10*e}
const ticks=(a,b,n)=>{n=n||4;const r=[];for(let i=0;i<=n;i++)r.push(a+(b-a)*i/n);return r};
const tk=v=>fm(+(+v).toPrecision(4));
/* x-y plot: o={w,h,x0,x1,y0,y1,xt,yt,xl,yl,series:[{pts,col,w,dash}],extra(X,Y),under(X,Y),cid} */
function plotSVG(o){const W=o.w||520,H=o.h||250,L=o.left||54,Rm=16,T=16,Bm=40;
  const X=x=>L+(x-o.x0)/(o.x1-o.x0)*(W-L-Rm),Y=y=>H-Bm-(y-o.y0)/(o.y1-o.y0)*(H-T-Bm);
  let s='';(o.yt||[]).forEach(v=>{s+=`<path d="M${L} ${fx(Y(v))}H${W-Rm}" stroke="var(--line)"/>`+S.t(L-6,fx(Y(v)+4),o.yf?o.yf(v):tk(v),'m','end')});
  (o.xt||[]).forEach(v=>{s+=`<path d="M${fx(X(v))} ${T}V${H-Bm}" stroke="var(--line)" stroke-dasharray="3 3"/>`+S.t(fx(X(v)),H-Bm+15,o.xf?o.xf(v):tk(v),'m')});
  s+=`<path d="M${L} ${T}V${H-Bm}H${W-Rm}" stroke="var(--fg)" fill="none" stroke-width="1.3"/>`;
  if(o.y0<0&&o.y1>0)s+=`<path d="M${L} ${fx(Y(0))}H${W-Rm}" stroke="var(--fg)" stroke-width="1.1"/>`;
  if(o.x0<0&&o.x1>0)s+=`<path d="M${fx(X(0))} ${T}V${H-Bm}" stroke="var(--fg)" stroke-width="1.1"/>`;
  if(o.xl)s+=S.t(W-Rm,H-5,o.xl,'','end');if(o.yl)s+=S.t(L+4,T+10,o.yl,'','start');
  if(o.under)s+=o.under(X,Y);
  const cid=o.cid||'edclip';s+=`<g clip-path="url(#${cid})">`;
  (o.series||[]).forEach(se=>{if(!se.pts||se.pts.length<2)return;s+=`<path d="${se.pts.map((p,i)=>(i?'L':'M')+fx(X(p[0]))+' '+fx(Y(p[1]))).join('')}" fill="none" stroke="var(${se.col})" stroke-width="${se.w||2.4}" ${se.dash?`stroke-dasharray="${se.dash}"`:''} stroke-linejoin="round"/>`});
  s+='</g>';if(o.extra)s+=o.extra(X,Y);
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${o.aria||'منحنى'}"><defs><clipPath id="${cid}"><rect x="${L}" y="${T-2}" width="${W-L-Rm+2}" height="${H-T-Bm+4}"/></clipPath></defs>${s}</svg>`}
const Q=(n,q,ans)=>`<details class="ed-q"><summary>${n}: ${q}</summary><div class="ed-ans"><b>إجابة مقترحة (ليست من الكتاب):</b> ${ans}</div></details>`;
const LTU=x=>B.ltrU(x).replace(/<span class="ltr">(\(\d+-\d+\))<\/span>/g,'$1');   // units LTR; equation/figure numbers stay as printed (like the other courses)
const LT=x=>typeof x==='string'?LTU(x):x;
const FIXL=L=>{(L.theory||[]).forEach(b=>{['h','html','note','err','caption'].forEach(k=>{if(b[k])b[k]=LT(b[k])})});(L.examples||[]).forEach(x=>{['title','q','note'].forEach(k=>{if(x[k])x[k]=LT(x[k])})});return L};
const ADD='<b>توضيح للمتدرب — ليس من الكتاب:</b> ';
const Z=a=>{a.forEach(q=>{if(q&&typeof q.v==='number'&&q.dp==null&&Number.isInteger(q.v))q.dp=0});return a};
const SUG='<b>حل مقترح (ليس من الكتاب):</b> الكتاب لا يطبع إجابات للتمارين؛ الحل هنا بطريقة الكتاب نفسها وبتقريبه.';


/* ---------- motor heating under the five duty types (illustrative first-order thermal model) ---------- */
const DUTY={
 a:{n:'أ- التشغيل المستمر',on:null,off:null,rest:'—'},
 b:{n:'ب- التشغيل قصير الأمد',on:30,off:150,rest:'stop'},
 c:{n:'ج- التشغيل المتقطع',on:10,off:10,rest:'stop'},
 d:{n:'د- المتواصل بفترات تحميل قصيرة الأمد',on:30,off:150,rest:'idle'},
 e:{n:'هـ- المتواصل بفترات تحميل متقطعة',on:10,off:10,rest:'idle'}};
/* returns {pts:[[t,θ]], segs:[[t0,t1,state]], max, over} ; state 'load'|'idle'|'stop' ; times in minutes */
function heatRun(P,duty,x,ton,toff,Tend){const rise=P.tmax-P.amb,a=P.a/100,pl=s=>s==='load'?a+(1-a)*x*x:s==='idle'?a:0;
  const segs=[];if(duty==='a')segs.push([0,Tend,'load']);else{let t=0;while(t<Tend){segs.push([t,Math.min(Tend,t+ton),'load']);t+=ton;if(t>=Tend)break;segs.push([t,Math.min(Tend,t+toff),DUTY[duty].rest]);t+=toff}}
  let th=0;const pts=[[0,P.amb]],dt=Tend/600;let mx=P.amb,tOver=null;
  segs.forEach(([t0,t1,s])=>{const tau=s==='stop'?P.tc:P.th,tgt=rise*pl(s);for(let t=t0;t<t1-1e-9;){const d=Math.min(dt,t1-t);th=tgt+(th-tgt)*Math.exp(-d/tau);t+=d;const T=P.amb+th;pts.push([t,T]);if(T>mx)mx=T;if(tOver==null&&T>P.tmax+0.05)tOver=t}});
  return {pts,segs,max:mx,over:mx>P.tmax+0.05,tOver}}

B.lesson(FIXL({
 id:'u7-l1',unit:7,order:1,pages:'79–87',
 title:'آلية اختيار محرك التحريك المناسب',
 summary:'مميزات المحرك الكهربائي، والعوامل الخمسة التي تحكم اختياره، ولماذا يتحدد حجم المحرك بأقصى درجة حرارة يصل إليها، وأنماط التشغيل الزمني الخمسة، ومقدرة المحرك على تحمل الأحمال الزائدة حتى عزم التعثر.',
 theory:[
  {h:'الوحدة السابعة: آلية اختيار محرك التحريك المناسب',ref:'ص 79–80',html:`<p><b>الهدف العام للوحدة:</b> معرفة العوامل التي يجب مراعاتها عند اختيار المحرك الكهربائي المناسب لقيادة حمل معين.</p>
   <p><b>الأهداف التفصيلية:</b> أن يتمكن المتدرب من اختيار المحرك الكهربائي المناسب لحمل معين اعتماداً على:</p><ul><li>العوامل الكهربائية.</li><li>العوامل الميكانيكية.</li><li>حجم المحرك وقدرته.</li><li>تكلفة المحرك.</li><li>نوع التيار المستخدم، من حيث كونه تياراً مستمراً أو متردداً أحادي أو ثلاثي الأوجه.</li></ul>`},
  {h:'تمهيد: مميزات المحرك الكهربائي',ref:'ص 81',html:`<p>تتمتع وسائل التحريك الكهربائي بمميزات متعددة، لذلك فهي أفضل وسائل التحريك والتدوير المستخدمة في أغلبية التطبيقات الصناعية، والعنصر الرئيسي في هذه الوسائل هو المحرك الكهربائي الذي له مميزات عديدة أهمها:</p><ul>
   <li>ملاءمته التقنية والاقتصادية للمتطلبات الخاصة في التطبيقات الصناعية.</li>
   <li>إمكانية تصميمه بقدرات متفاوتة تتراوح من جزء من الألف من الحصان إلى عشرات الآلاف من الحصان.</li>
   <li>سرعته ذات مدى كبير تتراوح من خمسين لفة في الدقيقة إلى عدة آلاف لفة في الدقيقة.</li>
   <li>إمكانية التنظيم والتحكم السهل في سرعة الدوران.</li>
   <li>سهولة بدء حركته وإيقافه وعكس اتجاه دورانه.</li>
   <li>عدم احتياجه إلى وقت لتجهيزه للعمل.</li>
   <li>سهولة صيانته وقلة تكلفتها.</li></ul>`},
  {h:'العوامل التي يجب مراعاتها عند اختيار المحرك الكهربائي',ref:'ص 81–82',html:`<p>اختيار المحرك الكهربائي يعتمد على الظروف التي سيعمل تحتها ونوع الحمل الذي سيحركه، فالمحرك المطلوب اختياره يجب أن يلبي كل متطلبات الحمل التقنية، وذلك يتطلب دراسة دقيقة وتحليلاً لخواص المحرك والحمل معاً، بالإضافة إلى الدراية التامة بمجمل نظام التحريك وأجهزة التحكم المطلوبة، وفي الوقت نفسه يجب ألا يكون المحرك عالي التكلفة حتى يكتب له النجاح من الناحية الاقتصادية.</p>
   <p>فهناك عدة عوامل يجب مراعاتها عند اختيار المحرك الكهربائي ليناسب إحدى التطبيقات الصناعية، وأهمها:</p>
   <div class="ed-tbl"><table class="tt"><thead><tr><th>العامل</th><th>ما يشمله</th></tr></thead><tbody>
   <tr><td><b>1- العوامل الكهربائية</b></td><td>خواص بدء الحركة من حيث قيمة كل من عزم بدء الحركة وتيار بدء الحركة؛ خواص المحرك أثناء التشغيل والعلاقة بين عزم الدوران والسرعة والعلاقة بين السرعة والتيار، والمفقودات، والكفاءة… إلخ؛ مدى التحكم في سرعة الدوران أثناء التشغيل <span class="ref">ص 82</span>؛ كيفية إيقاف المحرك وفرملته.</td></tr>
   <tr><td><b>2- العوامل الميكانيكية</b></td><td>نوع الغلاف الخارجي للمحرك، وكيفية ونوع التبريد المستخدم؛ نوع الكراسي المستخدمة؛ كيفية نقل الحركة بين المحرك والحمل؛ مستوى الضوضاء الذي يصدره المحرك.</td></tr>
   <tr><td><b>3- حجم المحرك والقدرة المصمم عليها</b></td><td>متطلبات التحميل من حيث إنه مستمر أو قصير الأمد أو متقطع؛ مقدرة المحرك للتعامل مع أحمال زائدة عن قدرته المقننة.</td></tr>
   <tr><td><b>4- تكلفة المحرك</b></td><td>من حيث التكلفة الابتدائية وتكلفة التشغيل.</td></tr>
   <tr><td><b>5- نوع التيار المستخدم</b></td><td>من حيث كونه تياراً مستمراً أو متردداً أحادي أو ثلاثي الأوجه.</td></tr></tbody></table></div>
   <p>مما سبق يتضح أن هناك عوامل كثيرة يجب اعتبارها عند اختيار محرك لقيادة حمل معين، فالمحرك المطلوب اختياره يجب أن يلبي كل متطلبات الحمل التقنية، وفي نفس الوقت يجب ألا يكون عالي التكلفة حتى يكتب له النجاح من الناحية الاقتصادية. والاختيار الموفق للمحرك يتطلب دراسة دقيقة وتحليلاً لخواص المحرك والحمل معاً، بالإضافة إلى الدراية التامة بنظام التحريك وأجهزة التحكم المطلوبة. ونظراً لأهمية العامل الثالث، <b>حجم المحرك والقدرة المصمم عليها</b>، فسوف يناقش بالتفصيل.</p>`},
  {h:'حجم المحرك والقدرة المصمم عليها',ref:'ص 82–83',html:`<p>العوامل التي تتحكم في حجم وقدرة المحرك هي <b>أقصى درجة حرارة يصل إليها المحرك أثناء الخدمة</b> تحت ظروف تشغيل الحمل، من حيث إنه مستمر أو متقطع أو قصير الأمد، و<b>أقصى عزم دوران مطلوب من المحرك</b>. وقد وجد أن المحرك الذي يحقق الشرط الأول الخاص بدرجة الحرارة يحقق أيضاً الشرط الثاني الخاص بالعزم المطلوب.</p>
   <p>والجدير بالذكر هنا أن أقصى درجة حرارة يتم تصميم المحرك على أساسها تعتمد على <b>نوع المواد العازلة</b> المستخدمة في المحرك، وتصنف هذه المواد العازلة إلى أنواع حسب درجة الحرارة القصوى التي تتحملها. <span class="ref">ص 83</span></p>`},
  {note:ADD+'لماذا الحرارة؟ المفقودات في المحرك (في الملفات والحديد) تتحول حرارة، ومفقودات الملفات تزيد مع مربع التيار أي مع الحمل. فترتفع درجة حرارة المحرك تدريجياً — لا فجأة — حتى يتساوى ما يتولد فيه من حرارة مع ما يفقده إلى الجو، ثم تثبت. والعازل هو أضعف جزء: إذا تعدّت الحرارة ما يتحمله يتلف ويقصر عمر المحرك. الكتاب لا يذكر أسماء فئات العزل ولا درجاتها.'},
  {h:'متطلبات التحميل: خطة التشغيل الزمني',ref:'ص 83–84',html:`<p>عادة يتم تصميم المحركات الكهربائية على أساس مقدار الزمن الذي يعمل فيه بالحمل المطلوب، وكذلك مقدار الزمن الذي يكون فيه متوقفاً عن العمل أو يدور فيه بدون حمل، وعلى هذا الأساس فإن القواعد التي تتبع لاختيار المحركات الكهربائية تشير لإمكانية تصنيف المحركات حسب خطة التشغيل الزمني لها:</p>
   <ul><li><b>أ- التشغيل المستمر:</b> في هذه الحالة يتم تشغيل المحرك بالحمل الكامل وبصفة مستمرة بحيث تصل درجة الحرارة في جميع أجزاء المحرك إلى قيمتها القصوى التي تم تصميم المحرك على أساسها، ولا تتعداها مع استمرار التشغيل لأية فترة بعد ذلك.</li>
   <li><b>ب- التشغيل قصير الأمد:</b> تعمل الآلة في هذا النوع من التشغيل بفترات تشغيل متفرقة تمتد كل منها على فترة زمنية محددة، بحيث لا تتعدى درجة الحرارة في جميع أجزاء المحرك قيمتها القصوى خلال أي فترة من فترات التشغيل، كما أن فترة الراحة التي تفصل بين فترتي التشغيل <b>تكفي لكي يبرد المحرك</b> ويأخذ درجة حرارة الجو المحيط به. ويطلق على حمل المحرك الذي يعطيه خلال فترة التشغيل اسم <b>الحمل الأمدي</b> (الحمل ذو الفترة المحددة)، وهو يقترن دائماً بفترة التشغيل، فيقال مثلاً: محرك عشرون حصاناً – ثلاثون دقيقة.</li>
   <li><b>ج- التشغيل المتقطع:</b> يكون تشغيل المحرك في هذه الحالة لفترات قصيرة تتخللها فترات من الراحة يتوقف فيها المحرك تماماً، لكن فترات الراحة هذه <b>لا تكفي</b> لكي تنخفض درجة حرارة المحرك إلى درجة حرارة الجو المحيط، لكنها تنخفض بعض الشيء لكي تعاود الارتفاع في فترة التشغيل التالية إلى درجة حرارة أعلى منها في فترة التشغيل السابقة، وهكذا دون أن تتعدى درجة الحرارة في جميع أجزاء المحرك قيمتها القصوى.</li>
   <li><b>د- التشغيل المتواصل بفترات تحميل قصيرة الأمد:</b> <span class="ref">ص 84</span> بعد تحميل المحرك لفترة زمنية قصيرة الأمد، يترك في حالة <b>دوران بدون حمل</b> مدة كافية بحيث تهبط درجة حرارته إلى الحد الذي تكون عليه عند دورانه بصفة مستمرة بدون حمل.</li>
   <li><b>هـ- التشغيل المتواصل بفترات تحميل متقطعة:</b> يمر المحرك بفترات متعاقبة من التشغيل بالحمل الكامل والدوران بدون حمل، بدلاً من السكون كما في حالة التشغيل المتقطع.</li></ul>`},
  {note:ADD+'الكتاب لا يرسم منحنيات الحرارة لهذه الأنماط؛ تجدها مرسومة في المختبر بنموذج توضيحي. لاحظ الفرق بين (ج) و(هـ): في (ج) يتوقف المحرك تماماً بين فترات الحمل، وفي (هـ) يستمر دائراً بلا حمل. وبين (ب) و(د) الفرق نفسه، لكن فترة الراحة في (ب) و(د) طويلة.'},
  {h:'مقدرة المحرك على التعامل مع أحمال زائدة عن قدرته المقننة',ref:'ص 84–85',html:`<p>يجب على المحرك الكهربائي أن يحقق غرضين أساسيين مهما اختلفت طريقة تشغيله، وهما:</p>
   <ol><li>ألا تتعدى درجة حرارته أثناء التشغيل بأي حال من الأحوال درجة الحرارة القصوى التي تم تصميم المحرك على أساسها، طبقاً للمواصفات القياسية التي تم تنفيذ تصميمه عليها.</li><li>يجب أن يكون المحرك قادراً على توليد عزم الدوران الذي يحتاجه الحمل عند سرعة الدوران المطلوبة.</li></ol>
   <p>تصمم المحركات عادة بحيث يمكنها أن تعطي عزماً أكبر من عزم الحمل الكامل <b>بحوالي مرة ونصف إلى مرتين</b>، ويسمى أقصى عزم في هذه الحالة <b>بعزم التعثر</b>. فكثيراً ما نجد أن المحرك الكهربائي أثناء تشغيله بصفة مستمرة يتعدى درجة الحرارة القصوى التي تم تنفيذ تصميمه على أساسها، وذلك عند تجاوز عزم الحمل الكامل، ولكن دون أن يتعدى عزم التعثر. وهذا يعني أن <b>الفيصل في وضع حدود التشغيل يكون عادة درجة الحرارة القصوى</b> التي لا يجب أن يتعداها المحرك، قبل الزيادة المحتملة في قيمة عزم الدوران الذي يمكن أن يحتاج إليه الحمل.</p>
   <p>هذا، وعندما يصمم المحرك الكهربائي على أساس التشغيل المتواصل بقدرة معينة، فإن المحرك يبلغ درجة حرارته القصوى عند تشغيله بهذه القدرة، ويظل محتفظاً بها مهما طال وقت تشغيله. فإذا تم تشغيل المحرك بنفس هذه القدرة تشغيلاً قصير الأمد أو تشغيلاً متقطعاً، فمن الواضح أن المحرك لن يبلغ درجة حرارته القصوى بسبب فترات التوقف التي تنخفض درجة حرارته أثناءها. وهذا يعني أننا نستطيع تشغيل المحرك على أي نحو من النحوين المذكورين <b>بحمل يزيد عن الحمل الكامل</b>، ولكن يجب أن نراعي ألا يتعدى عزم الدوران الذي يؤخذ من المحرك عزم التعثر؛ أي أن <b>الفيصل</b> في وضع حد للزيادة في الحمل التي يمكن أن نتجاوز بها الحمل الكامل في هذه الحالة هو <b>عزم التعثر</b>، وليست درجة الحرارة القصوى كما كان الأمر في الحالة السابقة. <span class="ref">ص 85</span></p>`},
  {note:ADD+'الخلاصة في سطرين: في التشغيل <b>المستمر</b> يحدّ الحملَ الزائد <b>الحرارة</b> (يسخن المحرك قبل أن يصل إلى عزم التعثر). وفي التشغيل <b>قصير الأمد والمتقطع</b> يبرد المحرك في فترات التوقف فيمكن تحميله فوق الحمل الكامل، ويصبح الحد هو <b>عزم التعثر</b> (مرة ونصف إلى مرتين عزم الحمل الكامل).'},
  {html:'<p><b>المراجع</b> <span class="ref">ص 87</span>: المحركات الكهربائية ومبادئ التحريك الكهربائي (د. محمد أحمد قمر، منشأة المعارف بالإسكندرية)؛ القيادة الآلية الكهربائية (م. شيليكين، ترجمة د. إلياس فرج الله طوشان ود. حسان الريشة، مطبعة جامعة حلب)؛ <span class="ltr">Electric Motors and Drives Fundamentals (A. Hughes, Heinemann Newnes, 1990)</span>؛ <span class="ltr">Electric Drives: Concepts and Application (V. Subrahmanyam, McGraw-Hill, 1990)</span>؛ <span class="ltr">Utilisation of Electric Power &amp; Electric Traction (G. C. Garg, Khanna Publishers Delhi, 1988)</span>.</p>'},
  {err:'لا توجد في الوحدة السابعة معادلات ولا أمثلة محلولة ولا أشكال، ولا يذكر الكتاب أسماء فئات المواد العازلة ودرجاتها القصوى. منحنيات الحرارة في المختبر توضيحية.'},
  {h:'أسئلة متنوعة',ref:'ص 86',html:Q('7-1','ما مميزات المحرك الكهربائي؟','(ص 81): ملاءمته التقنية والاقتصادية للتطبيقات الصناعية؛ إمكانية تصميمه بقدرات من جزء من الألف من الحصان إلى عشرات الآلاف من الحصان؛ مدى سرعة كبير من خمسين لفة في الدقيقة إلى عدة آلاف؛ سهولة تنظيم سرعته والتحكم فيها؛ سهولة بدء حركته وإيقافه وعكس اتجاه دورانه؛ لا يحتاج وقتاً لتجهيزه للعمل؛ سهولة صيانته وقلة تكلفتها.')+
   Q('7-2','ما العوامل التي تتحكم في اختيار المحرك الكهربائي لتطبيق معين؟','خمسة عوامل (ص 81–82): (1) <b>كهربائية</b>: خواص البدء (عزم وتيار البدء)، وخواص التشغيل (العزم–السرعة، السرعة–التيار، المفقودات، الكفاءة)، ومدى التحكم في السرعة، وطريقة الإيقاف والفرملة. (2) <b>ميكانيكية</b>: الغلاف ونوع التبريد، الكراسي، طريقة نقل الحركة إلى الحمل، مستوى الضوضاء. (3) <b>حجم المحرك وقدرته</b>: نوع التحميل (مستمر / قصير الأمد / متقطع) ومقدرته على الأحمال الزائدة. (4) <b>التكلفة</b>: الابتدائية والتشغيلية. (5) <b>نوع التيار</b>: مستمر أو متردد أحادي أو ثلاثي الأوجه.')+
   Q('7-3','اشرح خطة التشغيل الزمني للمحركات الكهربائية.','خمسة أنماط (ص 83–84): <b>أ- المستمر</b>: حمل كامل باستمرار حتى تبلغ الحرارة قيمتها القصوى وتثبت عندها. <b>ب- قصير الأمد</b>: فترات تشغيل محددة لا تبلغ فيها الحرارة القصوى، وراحة تكفي ليبرد المحرك إلى حرارة الجو. <b>ج- المتقطع</b>: فترات تشغيل قصيرة وتوقف تام لا يكفي للتبريد الكامل، فتتصاعد الحرارة من دورة لأخرى دون أن تتعدى القصوى. <b>د- المتواصل بفترات تحميل قصيرة الأمد</b>: حمل لفترة قصيرة ثم دوران بلا حمل مدة كافية لتهبط الحرارة إلى حرارة الدوران بلا حمل. <b>هـ- المتواصل بفترات تحميل متقطعة</b>: تعاقب الحمل الكامل والدوران بلا حمل بدل السكون.')+
   Q('7-4','ما المقصود بالحمل الأمدي؟','هو حمل المحرك الذي يعطيه خلال فترة التشغيل في التشغيل قصير الأمد، ويسمى أيضاً الحمل ذا الفترة المحددة، ويقترن دائماً بفترة التشغيل، فيقال مثلاً: محرك عشرون حصاناً – ثلاثون دقيقة (ص 83).')+
   Q('7-5','وضح مدى مقدرة المحرك على التعامل مع أحمال زائدة عن قدرته المقننة، وما هو الفيصل في وضع حدود التشغيل للمحرك؟','تصمم المحركات لتعطي عزماً أكبر من عزم الحمل الكامل بحوالي مرة ونصف إلى مرتين (عزم التعثر). في التشغيل <b>المستمر</b> يتعدى المحرك حرارته القصوى عند تجاوز الحمل الكامل قبل أن يبلغ عزم التعثر، فالفيصل هو <b>درجة الحرارة القصوى</b>. أما في التشغيل <b>قصير الأمد أو المتقطع</b> فلا يبلغ المحرك حرارته القصوى بسبب فترات التوقف، فيمكن تحميله فوق الحمل الكامل، والفيصل عندئذ هو <b>عزم التعثر</b> (ص 84–85).')+
   Q('7-6','ما المقصود بعزم التعثر؟','هو أقصى عزم يستطيع المحرك أن يعطيه، ويكون عادة أكبر من عزم الحمل الكامل بحوالي مرة ونصف إلى مرتين (ص 84). إذا طلب الحمل عزماً أكبر منه لا يستطيع المحرك حمله.')}
 ],
 lab:(el)=>{
  const st={duty:'a',x:100,ton:30,toff:150,stall:2,seen:{}};
  el.innerHTML=`<div id="h7tp"></div><div class="grid ed-lab">
   <div class="panel c12"><h2>حرارة المحرك مع الزمن <small>مبنية على أنماط التشغيل ص 83–84 والأحمال الزائدة ص 84–85 — المنحنيات توضيحية</small></h2>
    <div class="ed-row" style="margin-top:0">${segHTML('du',Object.keys(DUTY).map(k=>[k,DUTY[k].n]),st.duty)}</div>
    <div class="svgbox" id="h7p" style="max-width:860px;margin-inline:auto"></div>
    <p class="ed-cap">الشريط أسفل المنحنى: <b style="color:var(--live)">حمل</b> · <b style="color:var(--blue-ink)">دوران بلا حمل</b> · <b style="color:var(--muted)">توقف تام</b>. الخط الأحمر المتقطع = أقصى درجة حرارة صُمم عليها المحرك (حسب مادة العزل).</p>
    <div class="ed-row"><span class="ed-chip" id="h7chip"></span><span class="ed-chip" id="h7tq"></span></div>
    <div class="facts">${fact('أعلى درجة حرارة بلغها','h7mx')}${fact('الحرارة القصوى المسموحة','h7lim')}${fact('عزم الحمل / عزم الحمل الكامل','h7fx')}${fact('عزم التعثر / عزم الحمل الكامل','h7fs')}</div></div>
   <div class="panel c6"><h2>الحمل والزمن</h2>
    ${sl('h7x','الحمل (نسبة من الحمل الكامل)',0,250,5,st.x)}<div id="h7tw">${sl('h7on','زمن فترة الحمل',2,120,1,st.ton)}${sl('h7off','زمن الفترة التالية (توقف أو دوران بلا حمل)',2,240,1,st.toff)}</div>
    ${sl('h7s','عزم التعثر (مرة من عزم الحمل الكامل) — الكتاب: من 1.5 إلى 2',1.5,2,0.05,st.stall)}</div>
   <div class="panel c6"><h2>جرّب</h2><ol class="steps" id="h7st"></ol></div></div>`;
  el.innerHTML=LTU(el.innerHTML);B.math(el);const $=s=>el.querySelector(s);
  const TP=B.params($('#h7tp'),'u7-l1',[
   {k:'amb',label:'درجة حرارة الجو المحيط',unit:'°C',value:40,min:-20,max:60,step:1},
   {k:'tmax',label:'أقصى درجة حرارة صُمم عليها المحرك (حسب العزل)',unit:'°C',value:120,min:61,max:250,step:1},
   {k:'th',label:'ثابت زمن التسخين أثناء الدوران',unit:'min',value:30,min:1,max:300,step:1},
   {k:'tc',label:'ثابت زمن التبريد والمحرك متوقف',unit:'min',value:60,min:1,max:600,step:1,hint:'عادة أكبر من ثابت التسخين لأن المروحة متوقفة.'},
   {k:'a',label:'المفقودات بلا حمل (نسبة من المفقودات عند الحمل الكامل)',unit:'%',value:25,min:0,max:90,step:1}],()=>{draw();steps.redraw()});
  let res=null;
  const draw=()=>{const P=TP.v,x=st.x/100,stall=x>st.stall+1e-9,Tend=st.duty==='a'?Math.max(240,6*P.th):Math.max(240,Math.min(1200,3*(st.ton+st.toff)+4*P.th));
   $('#h7tw').style.display=st.duty==='a'?'none':'';
   $('#h7x-v').textContent=st.x+' %';$('#h7on-v').textContent=st.ton+' min';$('#h7off-v').textContent=st.toff+' min';$('#h7s-v').textContent=fm(st.stall,2)+' ×';
   const tq=$('#h7tq');
   if(stall){res={over:false,stall:true};tq.className='ed-chip warn';tq.textContent='الحمل يطلب عزماً أكبر من عزم التعثر: المحرك يتعثر ولا يستطيع حمله';$('#h7chip').className='ed-chip warn';$('#h7chip').textContent='الحد هنا هو عزم التعثر لا الحرارة (ص 85)';
    $('#h7p').innerHTML=plotSVG({w:860,h:300,cid:'h7c',x0:0,x1:Tend,y0:Math.min(0,P.amb-10),y1:niceMax(P.tmax*1.25),xt:ticks(0,Tend,6),yt:ticks(Math.min(0,P.amb-10),niceMax(P.tmax*1.25),5),xl:'t (min)',yl:'θ (°C)',series:[],extra:(X,Y)=>arT(fx(X(Tend/2)),fx(Y(P.tmax*0.6)),'المحرك متعثر — لا تشغيل',{fs:16,col:'--stop'})});
    $('#h7mx').textContent='—';$('#h7lim').textContent=fm(P.tmax,0)+' °C';$('#h7fx').textContent=fm(x,2)+' ×';$('#h7fs').textContent=fm(st.stall,2)+' ×';steps&&steps.check();return}
   res=heatRun(P,st.duty,x,st.ton,st.toff,Tend);res.stall=false;
   const y0=Math.min(0,Math.floor((P.amb-10)/10)*10),y1=niceMax(Math.max(P.tmax*1.15,res.max*1.05));
   const band=(X,Y)=>res.segs.map(([a,b,s])=>`<rect x="${fx(X(a))}" y="${fx(Y(y0)-10)}" width="${fx(Math.max(0.5,X(b)-X(a)))}" height="8" fill="var(${s==='load'?'--live':s==='idle'?'--blue':'--line'})"/>`).join('');
   $('#h7p').innerHTML=plotSVG({w:860,h:320,cid:'h7c',x0:0,x1:Tend,y0,y1,xt:ticks(0,Tend,6),yt:ticks(y0,y1,5),xl:'t (min)',yl:'θ (°C)',series:[{pts:res.pts,col:res.over?'--stop':'--blue'}],
    extra:(X,Y)=>`<path d="M${fx(X(0))} ${fx(Y(P.tmax))}H${fx(X(Tend))}" stroke="var(--stop)" stroke-dasharray="6 4" stroke-width="1.6"/>`+S.t(fx(X(Tend)-4),fx(Y(P.tmax)-6),'θmax = '+fm(P.tmax,0)+' °C','m','end')+`<path d="M${fx(X(0))} ${fx(Y(P.amb))}H${fx(X(Tend))}" stroke="var(--muted)" stroke-dasharray="2 4"/>`+S.t(fx(X(Tend)-4),fx(Y(P.amb)+14),'θa = '+fm(P.amb,0)+' °C','m','end')+band(X,Y)});
   const ch=$('#h7chip');if(res.over){ch.className='ed-chip warn';ch.textContent='تعدّت الحرارة القصوى بعد '+fm(res.tOver,0)+' min — الحد هنا هو الحرارة'}else if(res.max>P.tmax-1){ch.className='ed-chip hot';ch.textContent='بلغت الحرارة القصوى ولم تتعدها'}else{ch.className='ed-chip ok';ch.textContent='لم تبلغ الحرارة القصوى'}
   tq.className=x>1?'ed-chip ld':'ed-chip ok';tq.textContent=x>1?'حمل زائد عن الحمل الكامل لكنه أقل من عزم التعثر':'العزم ضمن عزم الحمل الكامل';
   $('#h7mx').textContent=fm(res.max,1)+' °C';$('#h7lim').textContent=fm(P.tmax,0)+' °C';$('#h7fx').textContent=fm(x,2)+' ×';$('#h7fs').textContent=fm(st.stall,2)+' ×';
   st.seen[st.duty+(res.over?'o':'')]=1;steps&&steps.check()};
  segBind(el,'du',v=>{st.duty=v;const d=DUTY[v];if(d.on){st.ton=d.on;st.toff=d.off;$('#h7on').value=st.ton;$('#h7off').value=st.toff}draw()});
  [['h7x','x'],['h7on','ton'],['h7off','toff'],['h7s','stall']].forEach(([id,k])=>{$('#'+id).oninput=e=>{st[k]=+e.target.value;draw()}});
  let steps=null;
  steps=stepsUI($('#h7st'),[
   {t:'أ- تشغيل مستمر بالحمل الكامل',get x(){return `اختر «أ» والحمل <span class="ltr">100%</span>: ترتفع الحرارة تدريجياً حتى تبلغ <span class="ltr">${fm(TP.v.tmax,0)} °C</span> (القصوى) وتثبت عندها مهما طال التشغيل.`},done:()=>st.duty==='a'&&st.x===100&&res&&!res.over},
   {t:'حمل زائد مستمر',x:'ارفع الحمل إلى <span class="ltr">120%</span> في التشغيل المستمر: العزم أقل من عزم التعثر، لكن الحرارة تتعدى القصوى — في التشغيل المستمر <b>الحرارة هي الفيصل</b> (ص 84).',done:()=>st.duty==='a'&&st.x>=115&&res&&res.over},
   {t:'ب- قصير الأمد بحمل زائد',get x(){return `اختر «ب» وحملاً <span class="ltr">150%</span> لفترة قصيرة (مثلاً <span class="ltr">15 min</span>): لا تبلغ الحرارة <span class="ltr">${fm(TP.v.tmax,0)} °C</span>، وفي الراحة يبرد المحرك إلى حرارة الجو.`},done:()=>st.duty==='b'&&st.x>=140&&res&&!res.over&&!res.stall},
   {t:'ج- التشغيل المتقطع',x:'اختر «ج»: الراحة القصيرة لا تكفي للتبريد الكامل، فترتفع الحرارة من دورة إلى أخرى (منشار صاعد) ثم تستقر حول قيمة.',done:()=>st.duty==='c'},
   {t:'د و هـ: دوران بلا حمل',x:'اختر «د» أو «هـ»: بين فترات الحمل يبقى المحرك دائراً بلا حمل (الشريط الأزرق)، فلا تهبط الحرارة إلى حرارة الجو بل إلى حرارة الدوران بلا حمل.',done:()=>st.duty==='d'||st.duty==='e'},
   {t:'عزم التعثر',x:'في «ب» أو «ج» ارفع الحمل فوق عزم التعثر (مثلاً <span class="ltr">210%</span> وعزم التعثر <span class="ltr">2×</span>): المحرك لا يستطيع حمله مهما كانت الحرارة منخفضة — في التشغيل قصير الأمد والمتقطع <b>عزم التعثر هو الفيصل</b> (ص 85).',done:()=>(st.duty==='b'||st.duty==='c')&&res&&res.stall}]);
  draw();
 },
 quiz:[
  {q:'أي مما يلي من مميزات المحرك الكهربائي؟',o:['يحتاج وقتاً طويلاً لتجهيزه للعمل','سهولة بدء حركته وإيقافه وعكس اتجاه دورانه','قدراته محدودة بمدى ضيق','صعوبة صيانته'],c:1,e:'ص 81.'},
  {q:'نوع الكراسي ومستوى الضوضاء من العوامل:',o:['الكهربائية','الميكانيكية','الاقتصادية','نوع التيار'],c:1,e:'ص 82.'},
  {q:'العامل الذي يتحكم في حجم وقدرة المحرك أساساً:',o:['لون الغلاف','أقصى درجة حرارة يصل إليها أثناء الخدمة وأقصى عزم مطلوب','نوع الكراسي','الجهد فقط'],c:1,e:'ص 82–83.'},
  {q:'أقصى درجة حرارة يصمم عليها المحرك تعتمد على:',o:['نوع المواد العازلة','عدد الأقطاب','قطر العمود','التردد'],c:0,e:'ص 83.'},
  {q:'في التشغيل قصير الأمد تكون فترة الراحة:',o:['لا تكفي للتبريد','كافية ليبرد المحرك إلى حرارة الجو المحيط','دوراناً بلا حمل','غير موجودة'],c:1,e:'ص 83.'},
  {q:'«محرك عشرون حصاناً – ثلاثون دقيقة» مثال على:',o:['التشغيل المستمر','الحمل الأمدي في التشغيل قصير الأمد','عزم التعثر','التشغيل المتقطع'],c:1,e:'ص 83.'},
  {q:'الفرق بين التشغيل المتقطع (ج) والتشغيل المتواصل بفترات تحميل متقطعة (هـ):',o:['في (هـ) يدور المحرك بلا حمل بدل السكون','في (ج) لا يوجد حمل','لا فرق','في (هـ) يتوقف تماماً'],c:0,e:'ص 84.'},
  {q:'عزم التعثر عادة يساوي من عزم الحمل الكامل:',o:['0.5 إلى 1 مرة','1.5 إلى 2 مرة','3 إلى 4 مرات','10 مرات'],c:1,e:'ص 84.'},
  {q:'في التشغيل قصير الأمد أو المتقطع، الفيصل في حد الحمل الزائد هو:',o:['درجة الحرارة القصوى','عزم التعثر','جهد المصدر','الضوضاء'],c:1,e:'ص 85.'}
 ]
}));

})(PLCBOOK);
