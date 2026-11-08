/* Unit 2 — أنواع الأحمال وخصائصها (ص 17–31)
   Lessons u2-l1 (الأحمال ونقطة التشغيل), u2-l2 (الأحمال الخطية والرأسية والكفاءات), u2-l3 (الأحمال الدورانية والمضخات والمراوح والونش). */
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

const G=9.81,SQ3=Math.sqrt(3);
const dd=(isBook,b,o)=>isBook?b:o;   // book's printed decimals with book data, more decimals otherwise

/* ======================================================================
   Lesson 1 — أنواع الأحمال ومنحنيات خواصها ونقطة التشغيل
   ====================================================================== */
function axesFrame(W,H,L,Bm,T,R,xl,yl){return `<path d="M${L} ${T}V${H-Bm}H${W-R}" stroke="var(--fg)" stroke-width="1.6" fill="none"/>`+arrow(L,T+12,L,T-2,'--fg',1.6)+arrow(W-R-12,H-Bm,W-R+2,H-Bm,'--fg',1.6)+S.t(W-R,H-Bm+22,xl,'','end')+S.t(L+6,T+4,yl,'','start')}
function fig21SVG(){const W=560,H=320,L=50,Bm=40,T=20,R=20,X=x=>L+x*(W-L-R),Y=y=>H-Bm-y*(H-Bm-T);const xc=0.6,yc=0.5;
  let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="الشكل 2-1: منحنيات خواص الأحمال">`+axesFrame(W,H,L,Bm,T,R,'Speed (ω)','Torque');
  const path=(f,a,b,col)=>{let p='';for(let i=0;i<=60;i++){const x=a+(b-a)*i/60,y=f(x);if(y>1.02||y<0)continue;p+=(p?'L':'M')+fx(X(x))+' '+fx(Y(y))}return `<path d="${p}" fill="none" stroke="var(${col})" stroke-width="2.4"/>`};
  s+=`<path d="M${X(0)} ${fx(Y(yc))}H${X(0.97)}" stroke="var(--fg)" stroke-width="2.2"/>`+S.t(X(0.98),Y(yc)+4,'B','b','start')+S.t(X(0.03),Y(yc)+16,'Constant Torque','m','start');
  s+=`<path d="M${fx(X(xc))} ${Y(0)}V${Y(0.98)}" stroke="var(--fg)" stroke-width="2.2"/>`+S.t(X(xc)+6,Y(0.98)+6,'E','b','start')+S.t(X(xc)+6,Y(0.05),'Constant Speed','m','start');
  s+=path(x=>yc*xc/x,0.3,0.97,'--blue')+S.t(X(0.97)+8,Y(yc*xc/0.97)+4,'A','b','start');
  const T0=yc/3,kC=(yc-T0)/Math.pow(xc,1.4);s+=path(x=>T0+kC*Math.pow(x,1.4),0,0.95,'--live')+S.t(X(0.95)+8,Y(T0+kC*Math.pow(0.95,1.4))+4,'C','b','start')+S.t(L-6,Y(T0)+4,'T0','m','end');
  s+=path(x=>yc*Math.pow(x/xc,2),0,0.84,'--stop')+S.t(X(0.84)+8,Y(yc*Math.pow(0.84/xc,2))+8,'D','b','start');
  s+=`<circle cx="${fx(X(xc))}" cy="${fx(Y(yc))}" r="5" fill="var(--fg)"/>`;
  return s+'</svg>'}
const kloss=(w,ws,Tmax,sm)=>{const s=1-w/ws;if(Math.abs(s)<1e-9)return 0;return 2*Tmax/(s/sm+sm/s)};
function fig22SVG(){const W=560,H=320,L=50,Bm=40,T=20,R=20,X=x=>L+x*(W-L-R),Y=y=>H-Bm-y*(H-Bm-T);
  let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="الشكل 2-2: منحنيا العزم والسرعة للمحرك والحمل ونقطة التشغيل">`+axesFrame(W,H,L,Bm,T,R,'Speed (ω)','Torque');
  const ws=0.92,Tm=x=>kloss(x,ws,0.86,0.25),Tl=x=>0.22+0.35*x*x;
  let p='';for(let i=0;i<=200;i++){const x=ws*i/200;p+=(i?'L':'M')+fx(X(x))+' '+fx(Y(Tm(x)))}s+=`<path d="${p}" fill="none" stroke="var(--blue)" stroke-width="2.6"/>`;
  p='';for(let i=0;i<=100;i++){const x=0.97*i/100;p+=(i?'L':'M')+fx(X(x))+' '+fx(Y(Tl(x)))}s+=`<path d="${p}" fill="none" stroke="var(--live)" stroke-width="2.6"/>`;
  let xo=0.85;for(let i=0;i<60;i++){const a=0.8,b=ws;}{let a=0.76,b=ws-1e-4;for(let i=0;i<60;i++){const m=(a+b)/2;if(Tm(m)-Tl(m)>0)a=m;else b=m}xo=(a+b)/2}
  s+=S.t(L-6,Y(Tm(0))+4,'Tstm','b','end')+S.t(L-6,Y(Tl(0))+4,'TstL','m','end');
  s+=S.t(X(0.3),Y(Tm(0.3))-12,'Motor Characteristics','b','middle')+S.t(X(0.45),Y(Tl(0.45))+22,'Load Characteristics','m','middle');
  s+=`<circle cx="${fx(X(xo))}" cy="${fx(Y(Tl(xo)))}" r="5" fill="var(--fg)"/>`+arrow(X(xo)+70,Y(Tl(xo))-50,X(xo)+6,Y(Tl(xo))-5,'--fg',1.6)+S.t(X(xo)+40,Y(Tl(xo))-56,'Operating Point','','middle');
  return s+'</svg>'}

B.lesson({
 id:'u2-l1',unit:2,order:1,pages:'17–22، 30',
 title:'أنواع الأحمال ومنحنيات خواصها ونقطة التشغيل',
 summary:'أهداف الوحدة الثانية، والأحمال الميكانيكية الشائعة، ومنحنيات خواص الأحمال A إلى E في الشكل (2-1)، ثم التوازن الديناميكي بين عزم المحرك وعزم الحمل ونقطة التشغيل عند تقاطع المنحنيين في الشكل (2-2)، وماذا يحدث عندما يتغير الحمل.',
 theory:[
  {h:'الوحدة الثانية: أنواع الأحمال وخصائصها — الأهداف',ref:'ص 17–18',html:`<p><b>الهدف العام للوحدة:</b> «معرفة أنواع وطبيعة الأحمال الميكانيكية المختلفة وكيفية تحديد نقطة التشغيل المستقرة بين المحرك الكهربائي والحمل الميكانيكي.»</p>
   <p><b>الأهداف التفصيلية:</b></p><ol type="أ"><li>أن يعرف المتدرب منحنيات الخواص للأحمال الميكانيكية المختلفة.</li><li>أن يحدد المتدرب نقطة التشغيل المستقرة بين المحرك والحمل.</li><li>أن يتمكن المتدرب من حساب قدرة المحرك المطلوبة لتحريك حمل معين.</li></ol>
   <p class="sub">هذا الدرس يغطي الهدفين (أ) و(ب)، والدرسان التاليان (u2-l2 و u2-l3) يغطيان الهدف (ج).</p>`},
  {h:'أنواع الأحمال الميكانيكية وخصائصها',ref:'ص 19',html:`<p>«هناك العديد من الأحمال الميكانيكية المختلفة التي يمكن تحريكها أو دورانها باستخدام المحركات الكهربائية وفيما يلي أهم تلك الأحمال:»</p>
   <ul><li>الروافع والأوناش.</li><li>الطواحين الدوارة.</li><li>الضواغط.</li><li>الشفاطات.</li><li>المضخات.</li><li>آلات القطع.</li><li>نقل الحركة بالسيور.</li><li>آلات التثقيب.</li><li>المصاعد الكهربائية.</li><li>القطارات والمركبات الكهربائية.</li></ul>
   <p>«تستخدم في تحريك هذه الأحمال، محركات التيار المستمر أو محركات التيار المتردد الحثية منها والتزامنية، حسب نوع وطبيعة تشغيل الحمل الميكانيكي، بحيث يفي المحرك بمتطلبات بدء الحركة وتنظيم السرعة. وأهم ما يجب معرفته من خواص الحمل الميكانيكي <b>العلاقة بين العزم والسرعة</b>، حتى يمكن اختيار نوع المحرك المناسب.»</p>`},
  {h:'منحنيات خواص الأحمال',ref:'ص 19–20',html:`<p>«الشكل (2-1) يبين أمثلة لخواص الأحمال:»</p>
   <ol type="أ"><li><b>المنحنى A:</b> «في هذا النوع من الأحمال يتناسب العزم مع السرعة تناسباً عكسياً بحيث يكون حاصل ضربهما ثابتاً ويساوي القدرة المطلوبة لتشغيل الحمل» \\((P=T\\times\\omega)\\).</li>
   <li><b>المنحنى B:</b> «يمثل الحمل ذا العزم الثابت مهما تغيرت السرعة مثل أحمال الرفع والشد حيث تزداد القدرة المطلوبة لتشغيل الحمل تزايداً طردياً مع ازدياد سرعة الدوران» \\((P\\propto\\omega)\\).</li>
   <li><b>المنحنى C:</b> «يمثل الحمل الذي تزداد فيه السرعة مع زيادة العزم مثل المضخات» \\((T=T_0+K\\omega)\\) «حيث \\(T_0\\) يمثل العزم عند بدء الحركة، \\(K\\) ثابت التناسب بين العزم والسرعة.»</li>
   <li><b>المنحنى D:</b> «يمثل الحمل الذي يتناسب فيه العزم طردياً مع مربع السرعة كما في المراوح والشفاطات» \\((T=K\\times\\omega^2)\\).</li>
   <li><b>المنحنى E:</b> «يمثل الحمل الذي يدور بسرعة ثابتة بصرف النظر عن قيمة العزم، فيزداد العزم دون أن تتأثر السرعة مثل المولدات التزامنية المرتبطة بشبكة لانهائية.»</li></ol>`},
  {fig:'(2-1)',ref:'ص 20',caption:'منحنيات خواص الأحمال. كل المنحنيات تمر بنقطة مشتركة (تقاطع الخط الأفقي B مع الخط الرأسي E). المحاور بلا أرقام كما في الكتاب.',draw:()=>box(fig21SVG(),580)},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب:</b> احفظها بأمثلتها: <b>A</b> قدرة ثابتة (مثل آلات اللف التي يقل عزمها كلما زادت سرعتها)، <b>B</b> عزم ثابت (رافعة ترفع الثقل نفسه بأي سرعة)، <b>C</b> عزم بدء + جزء يزيد مع السرعة (مضخة)، <b>D</b> عزم يزيد مع مربع السرعة (مروحة: ضاعف السرعة يتضاعف العزم أربع مرات)، <b>E</b> سرعة ثابتة يفرضها شيء خارجي (مولد تزامني على الشبكة). جرّب كل نوع في المختبر.'},
  {h:'التوازن الديناميكي بين الحمل والمحرك الكهربائي',ref:'ص 20–21',html:`<p>«يقوم المحرك الكهربائي بتوليد عزم دوران، عند السرعة الدورانية التي يفرضها الحمل الميكانيكي، على محور الدوران المشترك بين المحرك والحمل الميكانيكي، بناءً على العزم اللازم لدوران الحمل وحسب نوعية وطبيعة تشغيله. وبذلك تتحدد نقطة التشغيل على منحنى الخواص للمحرك، والذي يربط بين العزم والسرعة الدورانية. ويحدث <b>توازن ديناميكي</b> بين عزم الدوران الذي يبذله المحرك من جهة، وعزم الحمل من جهة أخرى.»</p>
   <p>«ويتكون عزم الحمل (عزم الدوران المضاد) من محصلة ثلاث مركبات، وهي:»</p>
   <ul><li>«<b>عزم الدوران المستفاد منه</b>، وهو العزم الذي يستفاد به لتدوير الحمل.»</li>
   <li>«<b>عزم دوران المفاقيد الميكانيكية</b>، وهو الذي يتغلب على مقاومة الهواء لحركة الدوران ويتغلب أيضاً على الاحتكاك الناشئ في المحاور والكراسي في المحرك والحمل.»</li>
   <li>«<b>عزم التسارع أو التباطؤ</b> الناشئ عن القصور الذاتي للكتل الدوارة عندما تكون سرعة الدوران متغيرة، وتتلاشى هذه المركبة لعزم الدوران المضاد عندما يدور المحرك بسرعة ثابتة.»</li></ul>
   <p>«ولتحديد نقطة التشغيل، يلزمنا معرفة المنحنى الذي يربط بين عزم الدوران والسرعة لكل من المحرك والحمل الميكانيكي، حيث تتحدد <b>نقطة التشغيل من تقاطع هذين المنحنيين</b>. الشكل (2-2) يبين منحنيات العلاقة بين العزم والسرعة الدورانية لكل من المحرك والحمل الميكانيكي وعليه تظهر نقطة التشغيل وهي نقطة تقاطع المنحنيين. وأيضاً يمكن تحديد نقطة التشغيل حسابياً وذلك بمساواة معادلتي عزم الدوران والسرعة لكل من المحرك والحمل الميكانيكي ثم حلها.»</p>`},
  {fig:'(2-2)',ref:'ص 21',caption:'منحنيات العلاقة بين العزم والسرعة لكل من المحرك والحمل الميكانيكي. \\(T_{stm}\\): عزم بدء المحرك، \\(T_{stL}\\): عزم بدء الحمل. منحنى المحرك بالشكل النموذجي لمحرك حثي: يرتفع إلى عزمه الأقصى ثم يهبط بحدة إلى الصفر.',draw:()=>box(fig22SVG(),580)},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب:</b> بالرموز: \\(T_{motor}=T_{load}+T_{losses}+T_{acc}\\). ما دام عزم المحرك أكبر من عزم الحمل والمفاقيد فالفرق \\(T_{acc}\\) يسرّع الكتل الدوارة؛ وعند نقطة التشغيل يصبح الفرق صفراً فتثبت السرعة. ولكي يبدأ الدوران من السكون يجب أن يكون عزم بدء المحرك \\(T_{stm}\\) أكبر من عزم بدء الحمل \\(T_{stL}\\) — كما في الشكل.'},
  {h:'عند تغير الحمل',ref:'ص 22',html:`<p>«عندما يتغير الحمل بالزيادة أو النقصان، يختل التوازن الديناميكي مما يؤدي إما إلى <b>زيادة سرعة الدوران</b> نتيجة لوجود عزم تسارع إذا قل الحمل، وإما إلى <b>انخفاض سرعة الدوران</b> نتيجة لوجود عزم تقصير إذا زاد الحمل. فإذا كان المحرك يعمل في <b>الجزء المتزن</b> من منحنى خواصه الذي يربط بين العزم وسرعة الدوران، فإن تغيير السرعة سوف يؤدي إلى تحريك نقطة التشغيل إلى الموقع الذي يحدث فيه التوازن الديناميكي مرة أخرى بين عزم الدوران الجديد الذي حدده الحمل، وعزم المحرك الذي تحددت قيمته عند نقطة التوازن الجديدة.»</p>`},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب:</b> «الجزء المتزن» في منحنى المحرك الحثي هو الجزء الهابط (بين العزم الأقصى وسرعة اللاحمل): هناك إذا زاد الحمل قلت السرعة فزاد عزم المحرك حتى يلحق بالحمل. أما على الجزء الصاعد فنقص السرعة يُنقص عزم المحرك أكثر فيتباطأ حتى يتوقف. وإذا زاد عزم الحمل على العزم الأقصى للمحرك فلا توجد نقطة تقاطع أصلاً ويتوقف المحرك. شاهد الحالتين في المختبر.'},
  {h:'أسئلة وتمارين متنوعة (2-1) إلى (2-3)',ref:'ص 30',html:NOANS+
   Q('2-1','ما الأنواع المختلفة للأحمال، ارسم منحنيات خواص الأحمال الشائعة الاستعمال في الصناعة؟','الأحمال الشائعة: الروافع والأوناش، الطواحين، الضواغط، الشفاطات، المضخات، آلات القطع، السيور، آلات التثقيب، المصاعد، القطارات. وتصنف حسب العلاقة بين العزم والسرعة (الشكل 2-1): <b>A</b> عزم يتناسب عكسياً مع السرعة (قدرة ثابتة)، <b>B</b> عزم ثابت (الرفع والشد)، <b>C</b> \\(T=T_0+K\\omega\\) (المضخات)، <b>D</b> \\(T=K\\omega^2\\) (المراوح والشفاطات)، <b>E</b> سرعة ثابتة مهما تغير العزم (مولد تزامني على شبكة لانهائية). الرسم: محور رأسي للعزم وأفقي للسرعة، والمنحنيات كما في الشكل (2-1).')+
   Q('2-2','اشرح كيف يحدث التوازن الديناميكي بين الحمل والمحرك.','يولد المحرك عزماً عند السرعة التي يفرضها الحمل، ويقابله عزم مضاد من ثلاث مركبات: العزم المستفاد منه، وعزم المفاقيد الميكانيكية (الاحتكاك ومقاومة الهواء)، وعزم التسارع أو التباطؤ. ما دام عزم المحرك أكبر من مجموع الأولين يتسارع الحمل، وعندما يتساوى عزم المحرك مع عزم الحمل والمفاقيد تختفي مركبة التسارع وتثبت السرعة: هذه نقطة التشغيل، وهي تقاطع منحنى المحرك مع منحنى الحمل (الشكل 2-2)، ويمكن إيجادها حسابياً بمساواة المعادلتين.')+
   Q('2-3','ماذا يحدث إذا تغير الحمل على المحرك بالزيادة أو بالنقصان؟','يختل التوازن: إذا <b>زاد</b> الحمل يصبح عزم الحمل أكبر من عزم المحرك فيظهر «عزم تقصير» تنخفض به السرعة، وإذا <b>نقص</b> الحمل يظهر عزم تسارع فتزيد السرعة. فإذا كان المحرك يعمل في الجزء المتزن من منحنى خواصه تنتقل نقطة التشغيل إلى موقع جديد يتساوى فيه العزمان من جديد. (توضيح: إذا تجاوز الحمل العزم الأقصى للمحرك فلا يوجد توازن ويتوقف المحرك.)')},
  {err:'<b>ملاحظات على الكتاب:</b> (1) ص 19–20: الشكل مرقّم في المتن «الشكل(1-2)» وتحت الرسم «الشكل 1-2»، وترتيبه في الوحدة الثانية يجعله <b>الشكل (2-1)</b> (يليه الشكلان 2-2 و2-3) — صُحح الرقم. (2) ص 19: كُتب للمنحنى B «\\(P\\ \\alpha\\ \\omega\\)» والمقصود رمز التناسب \\(P\\propto\\omega\\). (3) ص 21، الشكل (2-2): كُتب «Charateristics» والصحيح «Characteristics» — صُحح في الرسم.'}
 ],
 lab:(el)=>{
  let ld='B',on=false,w=0,fr=true,onT=0,acc=0,hist=[],hT=0,tt=0;const f={A:0.5,B:0.4,C0:0.2,C1:0.4,D:0.4,E:0.9};const did={};
  el.innerHTML=`<div id="l3tp"></div><div class="grid ed-lab">
   <div class="panel c7"><h2>مستوى العزم والسرعة <small>مبني على الشكلين (2-1) و(2-2) ص 20–21</small></h2>
    <div class="svgbox" id="l3pl" style="max-width:640px;margin-inline:auto"></div>
    <p class="sub">الأزرق = منحنى المحرك، والبرتقالي = منحنى الحمل (مع المفاقيد الميكانيكية إن كانت مشغلة). الدائرة الممتلئة الخضراء = نقطة تشغيل متزنة، والمفرغة = نقطة غير متزنة، والنقطة الحمراء = حالة المحرك الآن. منحنى المحرك بأرقام توضيحية لمحرك حثي.</p></div>
   <div class="panel c5"><h2>التحكم</h2>
    <div class="ed-row">${swHTML('l3on','المحرك','تشغيل / فصل',false)}${swHTML('l3fr','المفاقيد','الاحتكاك والهواء',true)}</div>
    <div class="ed-row"><span class="sub">نوع الحمل:</span>${segHTML('ld',[['A','A قدرة ثابتة'],['B','B عزم ثابت'],['C','C مضخة'],['D','D مروحة'],['E','E سرعة ثابتة']],ld)}</div>
    <div id="l3sl"></div>
    <div class="facts" id="l3fx"></div><div class="ed-row"><span id="l3chip" class="ed-chip"></span></div></div>
   <div class="panel c12"><h2>السرعة مع الزمن <small>آخر 20 ثانية</small></h2><div class="svgbox" id="l3pt" style="max-width:860px;margin-inline:auto"></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l3st"></ol></div></div>`;
  B.math(el);const $=s=>el.querySelector(s);
  const TP=B.params($('#l3tp'),'u2-l1',[
   {k:'ns',label:'سرعة اللاحمل (التزامنية) للمحرك',unit:'rpm',value:1500,min:100,max:6000},
   {k:'Tmax',label:'العزم الأقصى للمحرك',unit:'N·m',value:100,min:1,max:100000},
   {k:'sm',label:'الانزلاق عند العزم الأقصى (يحدد شكل المنحنى وعزم البدء)',unit:'',value:0.25,min:0.05,max:0.9,step:0.01},
   {k:'Tf',label:'عزم المفاقيد الميكانيكية (احتكاك + هواء)',unit:'N·m',value:2,min:0,max:10000},
   {k:'tau',label:'ثابت زمن التسارع (يكبر مع ثقل العضو الدوار)',unit:'s',value:1,min:0.05,max:30,step:0.05}],()=>{sliders();steps.redraw()});
  const P=()=>TP.v,ws=()=>2*PI*P().ns/60,Tst=()=>kloss(0,ws(),P().Tmax,P().sm);
  const Tmot=x=>on?kloss(x,ws(),P().Tmax,P().sm):0;
  const Tload=x=>{const Tm=P().Tmax,W=ws();switch(ld){case 'A':return f.A*Tm*W/Math.max(x,0.15*W);case 'B':return f.B*Tm;case 'C':return f.C0*Tm+f.C1*Tm/W*x;case 'D':return f.D*1.6*Tm/(W*W)*x*x;default:return 0}};
  const Tlos=x=>fr?P().Tf:0;
  const Tres=x=>Tload(x)+Tlos(x);
  const J=()=>P().tau*P().Tmax/ws();
  const SLD={A:[['A','القدرة المطلوبة P',z=>fm(z*P().Tmax*ws()/1000,2)+' kW']],B:[['B','عزم الحمل الثابت T',z=>fm(z*P().Tmax,1)+' N·m']],C:[['C0','عزم بدء الحركة T<sub>0</sub>',z=>fm(z*P().Tmax,1)+' N·m'],['C1','الزيادة K·ω عند سرعة اللاحمل',z=>fm(z*P().Tmax,1)+' N·m']],D:[['D','عزم المروحة K·ω² عند سرعة اللاحمل',z=>fm(z*1.6*P().Tmax,1)+' N·m']],E:[['E','السرعة المفروضة (نسبة من سرعة اللاحمل)',z=>fm(z*P().ns,0)+' rpm']]};
  const RNG={A:[0,0.9,0.01],B:[0,1.6,0.01],C0:[0,0.6,0.01],C1:[0,1,0.01],D:[0,1,0.01],E:[0,1.02,0.005]};
  const lab=k=>SLD[ld].find(z=>z[0]===k);
  const sliders=()=>{$('#l3sl').innerHTML=SLD[ld].map(([k,l])=>sl('l3s'+k,l,RNG[k][0],RNG[k][1],RNG[k][2],f[k])).join('');
   SLD[ld].forEach(([k,,fmt])=>{const r=$('#l3s'+k),o=$('#l3s'+k+'-v');o.textContent=fmt(f[k]);r.oninput=e=>{f[k]=+e.target.value;o.textContent=fmt(f[k])}})};
  segBind(el,'ld',z=>{ld=z;sliders();if(ld==='E')w=f.E*ws()});
  $('#l3on').onclick=()=>{on=!on;onT=0;$('#l3on').setAttribute('aria-pressed',String(on));if(!on&&w>0.3*ws())did.coast=1};
  $('#l3fr').onclick=()=>{fr=!fr;$('#l3fr').setAttribute('aria-pressed',String(fr))};
  const eqPts=()=>{if(!on||ld==='E')return [];const W=ws(),N=400,res=[];let prev=null;for(let i=0;i<=N;i++){const x=1.02*W*i/N,g=Tmot(x)-Tres(x);if(prev&&Math.sign(g)!==Math.sign(prev.g)&&prev.g!==0){let a=prev.x,b=x;for(let k=0;k<40;k++){const m=(a+b)/2,gm=Tmot(m)-Tres(m);if(Math.sign(gm)===Math.sign(prev.g))a=m;else b=m}const xm=(a+b)/2;res.push({x:xm,T:Tmot(xm),st:prev.g>0})}prev={x,g}}return res};
  const settled=()=>on&&ld!=='E'&&Math.abs(acc)<0.02*ws()&&w>0.05*ws();
  const steps=stepsUI($('#l3st'),[
   {get t(){return 'بدء التشغيل مع حمل عزمه ثابت'},get x(){return `اختر الحمل <b>B</b> بعزم <span class="ltr">${fm(0.4*P().Tmax,1)} N·m</span> (أقل من عزم بدء المحرك <span class="ltr">${fm(Tst(),1)} N·m</span>) ثم شغّل المحرك: يتسارع لأن عزمه أكبر من عزم الحمل، ثم تثبت السرعة عند تقاطع المنحنيين — نقطة التشغيل (ص 21).`},done:()=>ld==='B'&&settled()&&w>0.5*ws()},
   {t:'زد الحمل',get x(){return `ارفع عزم الحمل B إلى <span class="ltr">${fm(0.7*P().Tmax,1)} N·m</span> أو أكثر (وأقل من العزم الأقصى <span class="ltr">${fm(P().Tmax,1)} N·m</span>): يظهر «عزم تقصير» فتنخفض السرعة قليلاً حتى نقطة توازن جديدة (ص 22).`},done:()=>ld==='B'&&f.B>=0.7&&f.B<1&&settled()&&w>0.5*ws()},
   {t:'خفف الحمل',x:'أنزل عزم الحمل إلى 20% من العزم الأقصى أو أقل: يظهر «عزم تسارع» فتزيد السرعة ثم تستقر عند نقطة جديدة أقرب إلى سرعة اللاحمل.',done:()=>ld==='B'&&f.B<=0.2&&settled()},
   {t:'حمل مروحة',x:'اختر <b>D</b> (مروحة): عزمها صغير عند البدء ويكبر مع مربع السرعة، فيبدأ المحرك بسهولة وتستقر السرعة عند تقاطع منحنى المحرك مع القطع المكافئ.',done:()=>ld==='D'&&settled()},
   {get t(){return 'محرك لا يستطيع البدء'},get x(){return `افصل المحرك حتى يتوقف، ثم اختر <b>B</b> بعزم أكبر من عزم بدء المحرك <span class="ltr">${fm(Tst(),1)} N·m</span> (وأقل من العزم الأقصى)، وشغّل: لا يدور العمود، لأن عزم بدء المحرك أقل من عزم بدء الحمل.`},done:()=>on&&ld==='B'&&f.B*P().Tmax+Tlos(0)>Tst()&&w<0.01*ws()&&onT>1.5},
   {get t(){return 'حمل أكبر من العزم الأقصى'},get x(){return `خفّض الحمل حتى يبدأ المحرك ويستقر، ثم ارفع عزم B فوق العزم الأقصى <span class="ltr">${fm(P().Tmax,1)} N·m</span>: لا توجد نقطة تقاطع، فتنهار السرعة ويتوقف المحرك.`},done:()=>{if(on&&w>0.5*ws())did.ran=1;return did.ran&&ld==='B'&&f.B>1&&on&&w<0.01*ws()}},
   {t:'افصل المحرك وهو يدور',x:'شغّل المحرك بحمل خفيف حتى يستقر ثم افصله: عزم الحمل والمفاقيد وحدهما يُبطئان الكتل الدوارة تدريجياً حتى تتوقف (تمرين 1-2).',done:()=>did.coast&&!on&&w<0.01*ws()}
  ]);
  sliders();
  loopOn(el,dt=>{const W=ws();tt+=dt;if(on)onT+=dt;
   if(ld==='E'){const tgt=f.E*W;w+=(tgt-w)*(1-Math.exp(-dt/0.15));acc=0}
   else{const n=5;for(let i=0;i<n;i++){const h=dt/n;let net=Tmot(w)-Tres(w);if(w<=1e-9&&net<=0){w=0;net=0}acc=net/J();w=Math.max(0,w+acc*h)}}
   hT+=dt;if(hT>=0.1){hT=0;hist.push([tt,w]);while(hist.length&&hist[0][0]<tt-20)hist.shift()}
   const Tm=Tmot(w),TL=Tload(w),Tl=Tlos(w),Ta=ld==='E'||(w<=1e-9&&Tm<=TL+Tl)?0:Tm-TL-Tl;
   // T–ω plane
   const Tmx=P().Tmax,y1=niceMax(Math.max(1.3*Tmx,Tst()*1.1)),x1=1.05*W,cl=v=>clamp(v,-0.08*y1,y1*1.04);
   const mc=[],lc=[];for(let i=0;i<=160;i++){const x=1.02*W*i/160;mc.push([x,cl(kloss(x,W,Tmx,P().sm))]);if(ld!=='E')lc.push([x,cl(Tres(x))])}
   const eq=eqPts();
   $('#l3pl').innerHTML=plotSVG({w:600,h:320,x0:0,x1,y0:-0.08*y1,y1,xt:ticks(0,W,4).map(v=>+v.toFixed(1)),xf:v=>fm(v,0),yt:ticks(0,y1,4),xl:'ω (rad/s)',yl:'T (N·m)',
    series:[{pts:mc,col:'--blue',dash:on?'':'6 5'}].concat(ld==='E'?[]:[{pts:lc,col:'--live'}]),
    extra:(X,Y)=>(ld==='E'?`<path d="M${fx(X(f.E*W))} ${fx(Y(-0.08*y1))}V${fx(Y(y1))}" stroke="var(--live)" stroke-width="2.4"/>`:'')+eq.map(e=>`<circle cx="${fx(X(e.x))}" cy="${fx(Y(e.T))}" r="6" fill="${e.st?'var(--on)':'var(--surface)'}" stroke="var(--on)" stroke-width="2"/>`).join('')+`<circle cx="${fx(X(w))}" cy="${fx(Y(cl(Tm)))}" r="5" fill="var(--stop)"/>`+S.t(fx(X(W)),fx(Y(0)+14),'ωs','m')});
   const n=w*60/(2*PI);
   $('#l3fx').innerHTML=factsHTML([['السرعة',lt(fm(w,1)+' rad/s')],['n',lt(fm(n,0)+' rpm')],['عزم المحرك',lt(fm(Tm,1)+' N·m')],['العزم المستفاد منه (الحمل)',lt(fm(TL,1)+' N·m')],['عزم المفاقيد',lt(fm(w>0?Tl:0,1)+' N·m')],['عزم التسارع (+) / التقصير (−)',lt(fm(Ta,1)+' N·m')],['قدرة الحمل P = T·ω',lt(fm(TL*w/1000,2)+' kW')],['عزم بدء المحرك',lt(fm(Tst(),1)+' N·m')]]);
   const ch=$('#l3chip');
   if(ld==='E'){ch.className='ed-chip ld';ch.textContent=on?(Tm>=0?'السرعة مفروضة من الخارج: العزم هو ما يعطيه المحرك عند هذه السرعة':'السرعة أعلى من سرعة اللاحمل: عزم المحرك سالب'):'المحرك مفصول'}
   else if(!on){ch.className='ed-chip';ch.textContent=w>0.01?'المحرك مفصول: الكتل الدوارة تتباطأ':'المحرك مفصول ومتوقف'}
   else if(w<0.01*W&&Tres(0)>=Tst()){ch.className='ed-chip warn';ch.textContent=eq.length?'لا يبدأ: عزم الحمل عند البدء أكبر من عزم بدء المحرك':'متوقف: الحمل أكبر من العزم الأقصى للمحرك'}
   else if(Math.abs(acc)<0.02*W){ch.className='ed-chip ok';ch.textContent='متزن: عزم المحرك = عزم الحمل + المفاقيد'}
   else{ch.className=acc>0?'ed-chip ld':'ed-chip hot';ch.textContent=acc>0?'يتسارع: عزم المحرك أكبر':'يتباطأ: عزم الحمل أكبر (عزم تقصير)'}
   const ym=niceMax(1.05*W);$('#l3pt').innerHTML=plotSVG({w:600,h:220,x0:Math.max(0,tt-20),x1:Math.max(20,tt),y0:0,y1:ym,xt:[],yt:ticks(0,ym,4).map(v=>+v.toFixed(1)),yf:v=>fm(v,0),xl:'t (s)',yl:'ω (rad/s)',series:[{pts:hist.concat([[tt,w]]),col:'--blue'}],aria:'السرعة مع الزمن'});
   steps.check()});
 },
 quiz:[
  {q:'أهم ما يجب معرفته من خواص الحمل الميكانيكي لاختيار المحرك:',o:['لون الحمل','العلاقة بين العزم والسرعة','وزن المحرك','جهد المصدر'],c:1,e:'ص 19.'},
  {q:'الحمل الذي يبقى عزمه ثابتاً مهما تغيرت السرعة مثل أحمال الرفع والشد هو:',o:['A','B','D','E'],c:1,e:'المنحنى B، والقدرة فيه تتناسب طردياً مع السرعة.'},
  {q:'في المراوح والشفاطات يتناسب العزم مع:',o:['السرعة عكسياً','السرعة طردياً','مربع السرعة','لا يتغير'],c:2,e:'المنحنى D: \\(T=K\\omega^2\\).'},
  {q:'إذا تضاعفت سرعة مروحة فإن عزمها يصبح:',o:['نصف قيمته','مثل قيمته','ضعف قيمته','أربعة أضعاف قيمته'],c:3,e:'\\(T=K\\omega^2\\): \\((2\\omega)^2=4\\omega^2\\).'},
  {q:'نقطة التشغيل هي:',o:['أعلى نقطة في منحنى المحرك','نقطة تقاطع منحنى المحرك مع منحنى الحمل','نقطة بدء الحركة','نقطة السرعة التزامنية'],c:1,e:'ص 21، الشكل (2-2).'},
  {q:'أي مركبة من مركبات عزم الحمل تتلاشى عندما يدور المحرك بسرعة ثابتة؟',o:['العزم المستفاد منه','عزم المفاقيد الميكانيكية','عزم التسارع أو التباطؤ','كلها'],c:2,e:'ص 21.'},
  {q:'إذا زاد الحمل على محرك يعمل في الجزء المتزن من منحنى خواصه فإن:',o:['السرعة تزيد','السرعة تنخفض حتى توازن جديد','المحرك ينفجر','لا يتغير شيء'],c:1,e:'ص 22: عزم تقصير يخفض السرعة حتى تتحرك نقطة التشغيل إلى توازن جديد.'},
  {q:'لكي يبدأ المحرك الدوران من السكون يجب أن يكون:',o:['عزم بدء المحرك أكبر من عزم بدء الحمل','عزم بدء المحرك أصغر من عزم بدء الحمل','الحمل من النوع E','الجهد أقل من المقنن'],c:0,e:'في الشكل (2-2) يبدأ منحنى المحرك عند \\(T_{stm}\\) فوق \\(T_{stL}\\).'}
 ]
});

/* ======================================================================
   Lesson 2 — القدرة اللازمة للأحمال الخطية والرأسية والمصاعد + الكفاءات وتيار المحرك
   ====================================================================== */
function fig23SVG(o){o=o||{};const W=620,H=200,y=96;let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="الشكل 2-3: مخطط سريان القدرة">`;
  const v=o.vals,wd=k=>v?clamp(3+22*(v[k]/Math.max(v.Pin,1e-9)),3,25):3;
  s+=`<rect x="150" y="28" width="350" height="124" rx="10" fill="none" stroke="var(--muted)" stroke-dasharray="7 5" stroke-width="1.6"/>`+S.t(325,22,'ηt','b');
  s+=`<rect x="170" y="${y-28}" width="120" height="56" rx="8" fill="var(--blue-soft)" stroke="var(--blue)" stroke-width="2"/>`+arT(230,y+5,'المحرك',{fs:14})+S.t(230,y+46,'ηm','b');
  s+=`<rect x="360" y="${y-28}" width="120" height="56" rx="8" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2"/>`+arT(420,y-2,'وسيلة نقل',{fs:13})+arT(420,y+15,'الحركة',{fs:13})+S.t(420,y+46,'ηc','b');
  s+=`<path d="M20 ${y}H158" stroke="var(--live)" stroke-width="${fx(wd('Pin'))}"/>`+arrow(140,y,168,y,'--live',2)+S.t(60,y-16,'Pin','');
  s+=`<path d="M290 ${y}H348" stroke="var(--live)" stroke-width="${fx(wd('Pm'))}"/>`+arrow(336,y,358,y,'--live',2)+S.t(325,y-16,'Pm','');
  s+=`<path d="M480 ${y}H588" stroke="var(--live)" stroke-width="${fx(wd('PL'))}"/>`+arrow(576,y,604,y,'--live',2)+S.t(560,y-16,'PL','');
  if(v){s+=S.t(60,y+30,fmP(v.Pin),'m')+S.t(325,y+30,v.Pm!=null?fmP(v.Pm):'—','m')+S.t(560,y+30,fmP(v.PL),'m');
    if(v.Pm!=null){s+=arrow(230,y+56,230,y+84,'--stop',2)+S.t(230,y+98,'-'+fmP(v.Pin-v.Pm),'m')+arrow(420,y+56,420,y+84,'--stop',2)+S.t(420,y+98,'-'+fmP(v.Pm-v.PL),'m')}
    else s+=arrow(325,y+56,325,y+84,'--stop',2)+S.t(325,y+98,'-'+fmP(v.Pin-v.PL),'m')}
  return s+'</svg>'}
const fmP=p=>Math.abs(p)>=1e6?fm(p/1e6,3)+' MW':Math.abs(p)>=1e3?fm(p/1e3,2)+' kW':fm(p,1)+' W';

function solveTrain(g,B,isBook){const v=g.v*1000/3600,a=v/g.t,F=g.m*1000*a,PL=F*v,PmM=B.round(PL/(g.ec/100)/1e6,2),PinM=B.round(PL/(g.ec/100)/(g.em/100)/1e6,2),I=PinM*1e6/g.V;
  return [{t:'نحوّل السرعة إلى m/s:',f:`v=${fm(g.v)}\\times\\frac{1000}{3600}`,v:B.round(v,2),unit:'m/s'},
   {t:'التسارع من المعادلة (1-3) والقطار يبدأ من السكون:',f:`v=v_0+a\\,t\\ \\Rightarrow\\ ${fm(B.round(v,2))}=0+a\\times ${fm(g.t)}`,v:B.round(a,3),unit:'m/s²'},
   {t:'القوة اللازمة للتسارع (2-2):',f:`F=m\\cdot a=${fm(g.m)}\\times10^3\\times ${fm(B.round(a,3))}`,v:B.round(F,0),unit:'N'},
   {t:'القدرة اللازمة عند نهاية التسارع (2-1):',f:`P_L=F\\cdot v=${fm(B.round(F,0))}\\times ${fm(B.round(v,2))}`,v:B.round(PL/1e6,3),unit:'MW'},
   {t:'قدرة خرج المحرك (2-10):',f:`P_m=\\frac{P_L}{\\eta_c}=\\frac{${fm(B.round(PL/1e6,3))}}{${fm(g.ec/100)}}`,v:PmM,unit:'MW',dp:2},
   {t:'قدرة دخل المحرك (2-12):',f:`P_{in}=\\frac{P_m}{\\eta_m}=\\frac{${fm(PmM,2)}}{${fm(g.em/100)}}`,v:PinM,unit:'MW',dp:2},
   {t:'التيار المسحوب من المصدر (2-13):',f:`I=\\frac{P_{in}}{V}=\\frac{${fm(PinM*1e6)}}{${fm(g.V)}}`,v:I,unit:'A',dp:dd(isBook,0,1),final:true}]}
function solveHoist(g,B,isBook){const F=g.m*G,PL=F*g.v,Pin=PL/(g.et/100),IL=B.round(Pin/(SQ3*g.V*g.pf),1),Iph=IL/SQ3;
  return [{t:'القوة اللازمة لرفع الثقل (2-3):',f:`F_g=m\\cdot g=${fm(g.m)}\\times 9.81`,v:F,unit:'N',dp:dd(isBook,0,1)},
   {t:'القدرة اللازمة (2-1):',f:`P_L=F\\cdot v=${fm(B.round(F,2))}\\times ${fm(g.v)}`,v:PL,unit:'W',dp:dd(isBook,0,1)},
   {t:'قدرة الدخل بالكفاءة الكلية (2-15):',f:`P_{in}=\\frac{P_L}{\\eta_t}=\\frac{${fm(B.round(PL,1))}}{${fm(g.et/100)}}`,v:Pin,unit:'W',dp:1},
   {t:'تيار الخط (2-14):',f:`I_L=\\frac{P_{in}}{\\sqrt3\\,V_L\\cos\\theta}=\\frac{${fm(B.round(Pin,1))}}{\\sqrt3\\times ${fm(g.V)}\\times ${fm(g.pf)}}`,v:IL,unit:'A',dp:1,final:true},
   {t:'تيار الوجه — الملفات موصلة دلتا:',f:`I_{ph}=\\frac{I_L}{\\sqrt3}=\\frac{${fm(IL,1)}}{\\sqrt3}`,v:Iph,unit:'A',dp:dd(isBook,0,1),final:true}]}
function solveLift(g,B,isBook){const F=g.m/2*G,v=g.h/g.t,PL=F*v,Pm=PL/(g.ec/100),Pin=PL/(g.ec/100)/(g.em/100),IL=B.round(Pin,0)/(SQ3*g.V*g.pf);
  return [{t:'نصف الحمولة فقط لأن النصف الآخر وكتلة المصعد والحبال تعادلها أثقال الموازنة (2-4):',f:`F=\\frac{m}{2}\\cdot g=\\frac{${fm(g.m)}}{2}\\times 9.81`,v:F,unit:'N',dp:dd(isBook,0,1)},
   {t:'سرعة الصعود:',f:`v=\\frac{S}{t}=\\frac{${fm(g.h)}}{${fm(g.t)}}`,v:v,unit:'m/s',dp:dd(isBook,0,3)},
   {t:'القدرة اللازمة (2-1):',f:`P_L=F\\cdot v=${fm(B.round(F,1))}\\times ${fm(B.round(v,3))}`,v:PL,unit:'W',dp:0},
   {t:'قدرة المحرك (2-10) — كفاءة المصعد تقوم مقام كفاءة وسيلة نقل الحركة:',f:`P_m=\\frac{P_L}{\\eta_c}=\\frac{${fm(B.round(PL,0))}}{${fm(g.ec/100)}}`,v:Pm,unit:'W',dp:0,final:true},
   {t:'قدرة دخل المحرك (2-12):',f:`P_{in}=\\frac{P_m}{\\eta_m}=\\frac{${fm(B.round(Pm,0))}}{${fm(g.em/100)}}`,v:B.round(Pin,0),unit:'W',dp:0},
   {t:'تيار المحرك (2-14):',f:`I_L=\\frac{P_{in}}{\\sqrt3\\,V_L\\cos\\theta}=\\frac{${fm(B.round(Pin,0))}}{\\sqrt3\\times ${fm(g.V)}\\times ${fm(g.pf)}}`,v:IL,unit:'A',dp:1,final:true}]}
const GT=(m,v,t,V,em,ec)=>[{id:'m',label:'كتلة القطار',sym:'m',unit:'ton',value:m},{id:'v',label:'السرعة في نهاية التسارع',sym:'v',unit:'km/h',value:v},{id:'t',label:'زمن التسارع',sym:'t',unit:'s',value:t},{id:'V',label:'جهد المصدر',sym:'V',unit:'V',value:V},{id:'em',label:'كفاءة المحرك',sym:'\\eta_m',unit:'%',value:em},{id:'ec',label:'كفاءة صندوق التروس',sym:'\\eta_c',unit:'%',value:ec}];
const GH=(V,pf,m,v,et)=>[{id:'V',label:'جهد الخط',sym:'V_L',unit:'V',value:V},{id:'pf',label:'معامل القدرة',sym:'\\cos\\theta',unit:'',value:pf},{id:'m',label:'كتلة الثقل',sym:'m',unit:'kg',value:m},{id:'v',label:'سرعة الرفع',sym:'v',unit:'m/s',value:v},{id:'et',label:'الكفاءة الكلية',sym:'\\eta_t',unit:'%',value:et}];
const GLf=(V,em,pf,ec,m,h,t)=>[{id:'V',label:'جهد الخط',sym:'V_L',unit:'V',value:V},{id:'em',label:'كفاءة المحرك',sym:'\\eta_m',unit:'%',value:em},{id:'pf',label:'معامل القدرة',sym:'\\cos\\theta',unit:'',value:pf},{id:'ec',label:'كفاءة المصعد',sym:'\\eta_c',unit:'%',value:ec},{id:'m',label:'الحمولة',sym:'m',unit:'kg',value:m},{id:'h',label:'الارتفاع',sym:'S',unit:'m',value:h},{id:'t',label:'الزمن',sym:'t',unit:'s',value:t}];
const SUG='<b>حل مقترح (ليس من الكتاب)</b> بطريقة الأمثلة وتقريبها: الكتاب لا يعطي إجابات للتمارين.';

function sceneSVG(kind,ph,o){const W=640,H=180;let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="رسم الحمل">`;
  if(kind==='train'){const gy=140;s+=`<path d="M0 ${gy}H${W}" stroke="var(--fg)" stroke-width="3"/>`;for(let i=0;i<34;i++){const x=((i*20-ph*o.vis*40)%680+680)%680-20;s+=`<path d="M${fx(x)} ${gy+2}v8" stroke="var(--muted)" stroke-width="3"/>`}
    s+=`<rect x="230" y="${gy-62}" width="190" height="52" rx="10" fill="var(--blue-soft)" stroke="var(--blue)" stroke-width="2"/><rect x="250" y="${gy-52}" width="40" height="20" rx="3" fill="var(--surface)"/><rect x="300" y="${gy-52}" width="40" height="20" rx="3" fill="var(--surface)"/><rect x="350" y="${gy-52}" width="40" height="20" rx="3" fill="var(--surface)"/>`;
    [260,300,350,390].forEach(x=>{s+=`<circle cx="${x}" cy="${gy-6}" r="8" fill="var(--fg)"/>`});s+=arrow(424,gy-36,424+clamp(o.F*0.0012+20,24,150),gy-36,'--live',3)+S.t(430,gy-44,'F','','start');
    s+=S.t(325,gy-70,'m = '+fm(o.m)+' t','b')}
  else{const top=20,bot=165,cw=o.cw;s+=`<path d="M200 ${top}H440" stroke="var(--fg)" stroke-width="4"/><circle cx="${cw?320:300}" cy="${top+12}" r="14" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2"/>`;
    const k=(Math.sin(ph*o.vis)+1)/2,cy=bot-30-k*90;
    if(kind==='lift'&&cw){const ccy=top+30+k*90;s+=`<path d="M306 ${top+12}V${fx(cy-24)}M334 ${top+12}V${fx(ccy)}" stroke="var(--fg)" stroke-width="2"/><rect x="276" y="${fx(cy-24)}" width="60" height="50" rx="4" fill="var(--blue-soft)" stroke="var(--blue)" stroke-width="2"/><rect x="326" y="${fx(ccy)}" width="22" height="40" rx="3" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2"/>`+arT(400,fx(ccy+24),'أثقال الموازنة',{fs:11.5,a:'start'})+S.t(306,fx(cy+6),fm(o.m)+' kg','b')}
    else{s+=`<path d="M${kind==='lift'?306:314} ${top+12}V${fx(cy-24)}" stroke="var(--fg)" stroke-width="2"/><rect x="${kind==='lift'?276:284}" y="${fx(cy-24)}" width="60" height="50" rx="4" fill="var(--blue-soft)" stroke="var(--blue)" stroke-width="2"/>`+S.t(kind==='lift'?306:314,fx(cy+6),fm(o.m)+' kg','b')}
    s+=`<path d="M150 ${bot}H490" stroke="var(--fg)" stroke-width="2"/>`;s+=arrow(240,fx(cy+10),240,fx(cy-30),'--live',3)+S.t(232,fx(cy-10),'F','','end')}
  return s+'</svg>'}

B.lesson({
 id:'u2-l2',unit:2,order:2,pages:'22–27، 30–31',
 title:'قدرة المحرك للأحمال الخطية والرأسية والمصاعد، والكفاءة وتيار المحرك',
 summary:'القدرة اللازمة للحمل P<sub>L</sub> = F·v للحركة الأفقية (F = m·a) والرأسية (F = m·g) والمصاعد بأثقال موازنة (F = m·g/2)، ثم سريان القدرة من المصدر إلى المحرك إلى الحمل (الشكل 2-3): الكفاءات η<sub>m</sub> و η<sub>c</sub> و η<sub>t</sub>، وحساب تيار محرك التيار المستمر والمحرك الحثي ثلاثي الأوجه (الخط والوجه)، مع الأمثلة (2-1) و(2-2) و(2-4).',
 theory:[
  {h:'القدرة اللازمة لتحريك حمل معين \\((P_L)\\)',ref:'ص 22',html:`<p><b>أ- أحمال ذات حركة خطية:</b> «القدرة اللازمة لتحريك حمل، كتلته \\(m\\) بسرعة مقدارها \\(v\\)، يمكن حسابها كما هو موضح في الوحدة السابقة من العلاقة التالية:»</p>
   $$P_L=F\\cdot v \\qquad (2\\text{-}1)$$
   <p>«حيث \\(F\\) هي القوة اللازمة للتحريك وتحسب كالتالي:»</p>
   <p>«في حالة <b>الحركة الأفقية</b> (بإهمال القوة اللازمة للتغلب على المقاومة لحركة القطار):»</p>
   $$F=m\\cdot a \\qquad (2\\text{-}2)$$
   <p>«وفي حالة <b>الحركة الرأسية</b>:»</p>
   $$F=m\\cdot g \\qquad (2\\text{-}3)$$
   <p>«ولكن في حالة <b>المصاعد</b> تعادل نصف حمولة التشغيل، وكل من كتلة المصعد والحبال، بواسطة أثقال موازنة، لذا تحسب القوة على أساس نصف الحمولة فقط:»</p>
   $$F=\\frac{m\\cdot g}{2} \\qquad (2\\text{-}4)$$`},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب:</b> أثقال الموازنة تتدلى في الجهة الأخرى من البكرة وكتلتها = كتلة الصاعدة + الحبال + نصف الحمولة. فإذا كانت الصاعدة نصف ممتلئة تكون الكفتان متوازنتين تقريباً، ولا يرفع المحرك إلا الفرق، وأقصى فرق هو نصف الحمولة. لذلك يكفي محرك أصغر بكثير. وفي القطار، (2-2) هي قوة التسارع فقط؛ مقاومة الحركة وأثر الصعود على منحدر تأتي في الوحدة الخامسة.'},
  {h:'كيفية حساب قدرة المحرك المقننة لتحريك حمل معين \\((P_m)\\)',ref:'ص 23–24',html:`<p>«الشكل (2-3) يوضح مخطط سريان القدرة من المصدر إلى المحرك ومن المحرك إلى الحمل من خلال وسيلة نقل الحركة بين المحرك والحمل. وبالرجوع إلى تعريف الكفاءة يمكن كتابة كفاءة المحرك \\((\\eta_m)\\) وأيضاً كفاءة وسيلة نقل الحركة بين المحرك والحمل \\((\\eta_c)\\) كما يلي:»</p>
   $$\\eta_m=\\frac{P_m}{P_{in}} \\qquad (2\\text{-}8) \\qquad\\qquad \\eta_c=\\frac{P_L}{P_m} \\qquad (2\\text{-}9)$$
   <p>«حيث أن \\(P_{in}\\) هي القدرة الداخلة للمحرك.» «ومن ثم يمكن حساب القدرة المقننة (الخارجة على محور الدوران) للمحرك المستخدم في تحريك أي من الأحمال السابقة كما يلي:»</p>
   $$P_m=\\frac{P_L}{\\eta_c} \\qquad (2\\text{-}10)$$
   <p>«كما يمكن حساب العزم المقنن للمحرك \\((T_m)\\) كما يلي:»</p>
   $$T_m=\\frac{P_m}{\\omega_m} \\qquad (2\\text{-}11)$$
   <p>«وأيضاً القدرة الداخلة للمحرك.»</p>
   $$P_{in}=\\frac{P_m}{\\eta_m} \\qquad (2\\text{-}12)$$
   <p>«إذا كان المحرك المستخدم من نوع <b>التيار المستمر</b> فإن التيار المسحوب من المصدر \\(I\\) يحسب من المعادلة:»</p>
   $$P_{in}=V\\cdot I \\qquad (2\\text{-}13)$$
   <p>«وإذا كان المحرك من نوع <b>التيار المتردد (حثي ثلاثي الأوجه)</b> فإن التيار المسحوب من المصدر \\((I_L)\\) يحسب من المعادلة:»</p>
   $$P_{in}=\\sqrt{3}\\cdot V_L\\cdot I_L\\cdot\\cos\\theta \\qquad (2\\text{-}14)$$
   <p>«لاحظ أن <b>الكفاءة الكلية</b> للنظام \\((\\eta_t)\\) تعتمد على كفاءة المحرك وكفاءة وسيلة نقل الحركة بين المحرك والحمل، انظر الشكل (2-3):»</p>
   $$\\eta_t=\\frac{P_L}{P_{in}}=\\frac{P_L}{P_m}\\cdot\\frac{P_m}{P_{in}}=\\eta_c\\cdot\\eta_m \\qquad (2\\text{-}15)$$`},
  {fig:'(2-3)',ref:'ص 24',caption:'مخطط سريان القدرة: من المصدر \\(P_{in}\\) إلى المحرك \\((\\eta_m)\\) ثم \\(P_m\\) إلى وسيلة نقل الحركة \\((\\eta_c)\\) ثم \\(P_L\\) إلى الحمل. الإطار المتقطع يمثل الكفاءة الكلية \\(\\eta_t\\).',draw:()=>box(fig23SVG(),620)},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب:</b> ترتيب الحل دائماً من الحمل إلى المصدر: \\(F\\) ← \\(P_L\\) ← \\(P_m=P_L/\\eta_c\\) ← \\(P_{in}=P_m/\\eta_m\\) ← التيار. والقسمة على كفاءة أصغر من 1 تكبّر القدرة دائماً: كل مرحلة تضيع جزءاً من القدرة حرارةً. وفي المحرك الموصل <b>دلتا</b> يكون \\(I_{ph}=I_L/\\sqrt3\\)، وفي <b>النجمة</b> \\(I_{ph}=I_L\\) (من مقرر الدوائر).'},
  {h:'الأمثلة المحلولة لهذا الدرس',ref:'ص 25–27',html:`<div class="ed-tbl"><table class="tt"><thead><tr><th>المثال</th><th>الحمل</th><th>المعطيات</th><th>النتيجة</th></tr></thead><tbody>
   <tr><td>(2-1) ص 25</td><td>قطار يتسارع</td><td>${lt('200 ton')}، ${lt('0→36 km/h')} في ${lt('20 s')}، ${lt('3000 V')}، ${lt('η<sub>m</sub> = 90%')}، ${lt('η<sub>c</sub> = 60%')}</td><td>${lt('I = 617 A')}</td></tr>
   <tr><td>(2-2) ص 25</td><td>رفع ثقل</td><td>${lt('6000 kg')} بسرعة ${lt('1.5 m/s')}، ${lt('3000 V')} دلتا، ${lt('cosθ = 0.82')}، ${lt('η<sub>t</sub> = 80%')}</td><td>${lt('I<sub>L</sub> = 25.9 A')}، ${lt('I<sub>ph</sub> = 15 A')}</td></tr>
   <tr><td>(2-4) ص 26–27</td><td>مصعد بأثقال موازنة</td><td>${lt('5000 kg')} إلى ${lt('30 m')} في نصف دقيقة، ${lt('380 V')}، ${lt('η<sub>m</sub> = 82%')}، ${lt('cosθ = 0.85')}، كفاءة المصعد ${lt('48%')}</td><td>${lt('P<sub>m</sub> = 51094 W')}، ${lt('I<sub>L</sub> = 111.4 A')}</td></tr></tbody></table></div>
   <p>الحلول خطوة بخطوة في تبويب «الأمثلة المحلولة» (غيّر الأرقام وشاهد الحل يتغير)، وتشغيلها حياً في المختبر بزر لكل مثال.</p>`},
  {h:'أسئلة وتمارين لهذا الدرس: (2-4) و(2-6) و(2-9)',ref:'ص 30–31',html:NOANS+
   Q('2-4','قطار كتلته <span class="ltr">150 ton</span> بدأ حركته من السكون واستغرق <span class="ltr">30 s</span> لتصل سرعته إلى <span class="ltr">42 km/h</span> احسب التيار المسحوب من المصدر أثناء فترة التسارع إذا كان جهد المصدر <span class="ltr">3000 V</span> وكفاءة المحرك <span class="ltr">85 %</span> وكفاءة صندوق التروس <span class="ltr">65 %</span>.','بطريقة المثال (2-1): \\(v=11.67\\ \\text{m/s}\\)، \\(a=0.389\\ \\text{m/s}^2\\)، \\(F\\approx58333\\ \\text{N}\\)، \\(P_L\\approx0.681\\ \\text{MW}\\)، \\(P_m\\approx1.05\\ \\text{MW}\\)، \\(P_{in}\\approx1.23\\ \\text{MW}\\)، \\(I\\approx410\\ \\text{A}\\) (بدون تقريب وسيط: 410.6 A). الحاسبة في تبويب «الأمثلة المحلولة».')+
   Q('2-6','محرك حثي ثلاثي الأوجه، <span class="ltr">380 V</span>، كفاءته <span class="ltr">80%</span>، ومعامل قدرته <span class="ltr">0.82</span>، يستعمل لتحريك مصعد كفاءته <span class="ltr">55%</span> لرفع <span class="ltr">8000 kg</span> إلى ارتفاع <span class="ltr">60 m</span> خلال زمن مقداره دقيقة، تمت موازنة نصف حمولة التشغيل، وكل من كتلة المصعد والحبال، بواسطة أثقال موازنة. احسب قدرة المحرك، وتيار المحرك.','بطريقة المثال (2-4): \\(F=39240\\ \\text{N}\\)، \\(v=1\\ \\text{m/s}\\)، \\(P_L=39240\\ \\text{W}\\)، \\(P_m=39240/0.55\\approx71345\\ \\text{W}\\)، \\(P_{in}\\approx89182\\ \\text{W}\\)، \\(I_L\\approx165.2\\ \\text{A}\\).')+
   Q('2-9','محرك حثي ثلاثي الأوجه، <span class="ltr">3000 V</span>، ومعامل قدرته <span class="ltr">0.8</span>، ملفاته موصلة دلتا، يستخدم لرفع ثقل مقداره <span class="ltr">8000 kg</span>، بسرعة <span class="ltr">2 m/sec</span>. احسب تيار الخط وتيار الوجه، بافتراض أن الكفاءة الكلية <span class="ltr">70%</span>','بطريقة المثال (2-2): \\(F=78480\\ \\text{N}\\)، \\(P_L=156960\\ \\text{W}\\)، \\(P_{in}\\approx224229\\ \\text{W}\\)، \\(I_L\\approx53.9\\ \\text{A}\\)، \\(I_{ph}\\approx31.1\\ \\text{A}\\).')},
  {err:'<b>ملاحظات على الكتاب:</b> (1) ص 24: «من المصدره» و«من المعادله» والصحيح «المصدر» و«المعادلة». (2) ص 22: المعادلة (2-2) تقول «بإهمال القوة اللازمة للتغلب على المقاومة لحركة القطار» مع أنها قاعدة عامة لأي حمل أفقي — المقصود كل حمل أفقي، والقطار مثال. (3) مثال (2-1) ص 25: كُتب التسارع «a = 0.5» بلا وحدة، ووحدته <span class="ltr">m/s²</span>. (4) مثال (2-2): تيار الوجه 14.95 كُتب مقرباً «15 A». لا توجد أخطاء تغيّر النتائج في هذا الدرس.'}
 ],
 lab:(el)=>{
  const st={ld:'train',mt:16,vk:36,tt:20,mh:6000,vh:1.5,ml:5000,hl:30,tl:30,cw:true,eff:'sep',em:90,ec:60,et:80,mot:'dc',V:3000,pf:0.82,conn:'D'};let ph=0;const did={};
  const PRE={ex21:{ld:'train',mt:200,vk:36,tt:20,eff:'sep',em:90,ec:60,mot:'dc',V:3000},ex22:{ld:'hoist',mh:6000,vh:1.5,eff:'tot',et:80,mot:'ac',V:3000,pf:0.82,conn:'D'},ex24:{ld:'lift',ml:5000,hl:30,tl:30,cw:true,eff:'sep',em:82,ec:48,mot:'ac',V:380,pf:0.85,conn:'D'},
   q24:{ld:'train',mt:150,vk:42,tt:30,eff:'sep',em:85,ec:65,mot:'dc',V:3000},q26:{ld:'lift',ml:8000,hl:60,tl:60,cw:true,eff:'sep',em:80,ec:55,mot:'ac',V:380,pf:0.82,conn:'D'},q29:{ld:'hoist',mh:8000,vh:2,eff:'tot',et:70,mot:'ac',V:3000,pf:0.8,conn:'D'}};
  st.mt=200;
  el.innerHTML=`<div class="grid ed-lab">
   <div class="panel c12"><h2>الحمل <small>المعادلات (2-1) إلى (2-4) ص 22</small></h2>
    <div class="ed-row">${segHTML('ld',[['train','قطار يتسارع (أفقي)'],['hoist','رفع ثقل (رأسي)'],['lift','مصعد']],st.ld)}</div>
    <div class="ed-row"><span class="sub">أرقام الكتاب:</span><button class="btn" data-pre="ex21">مثال (2-1)</button><button class="btn" data-pre="ex22">مثال (2-2)</button><button class="btn" data-pre="ex24">مثال (2-4)</button><button class="btn" data-pre="q24">تمرين (2-4)</button><button class="btn" data-pre="q26">تمرين (2-6)</button><button class="btn" data-pre="q29">تمرين (2-9)</button></div>
    <div class="svgbox" id="l4sc" style="max-width:640px;margin-inline:auto"></div><p class="sub">الحركة في الرسم للتوضيح فقط وليست بالسرعة الحقيقية.</p></div>
   <div class="panel c7"><h2>المدخلات</h2><div id="l4in"></div>
    <div class="ed-row"><span class="sub">الكفاءات:</span>${segHTML('eff',[['sep','المحرك ووسيلة النقل كلٌّ على حدة'],['tot','الكفاءة الكلية فقط']],st.eff)}</div><div id="l4ef"></div>
    <div class="ed-row"><span class="sub">المحرك:</span>${segHTML('mot',[['dc','تيار مستمر'],['ac','حثي ثلاثي الأوجه']],st.mot)}</div>
    <div class="ed-row"><span class="sub">الجهد:</span>${segHTML('V',[[220,'<span class="ltr">220 V</span>'],[380,'<span class="ltr">380 V</span>'],[400,'<span class="ltr">400 V</span>'],[3000,'<span class="ltr">3000 V</span>']],st.V)}</div><div id="l4ac"></div></div>
   <div class="panel c5"><h2>النتائج</h2><div class="facts" id="l4fx"></div></div>
   <div class="panel c12"><h2>سريان القدرة — الشكل (2-3) حياً <small>سُمك السهم يتناسب مع القدرة، والأسهم الحمراء هي المفاقيد</small></h2><div class="svgbox" id="l4fl" style="max-width:640px;margin-inline:auto"></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l4st"></ol></div></div>`;
  B.math(el);const $=s=>el.querySelector(s);
  const IN={train:[['mt','كتلة القطار m','ton',10,400,10],['vk','السرعة في نهاية التسارع v','km/h',5,120,1],['tt','زمن التسارع t','s',5,120,1]],hoist:[['mh','كتلة الثقل m','kg',100,10000,100],['vh','سرعة الرفع v','m/s',0.1,3,0.1]],lift:[['ml','الحمولة m','kg',500,10000,100],['hl','الارتفاع S','m',3,100,1],['tl','الزمن t','s',10,120,5]]};
  const bindS=(id,k,u)=>{const r=$('#'+id),o=$('#'+id+'-v');o.textContent=fm(st[k])+' '+u;r.oninput=e=>{st[k]=+e.target.value;o.textContent=fm(st[k])+' '+u;upd()}};
  const ui=()=>{segSet(el,'ld',st.ld);segSet(el,'eff',st.eff);segSet(el,'mot',st.mot);segSet(el,'V',st.V);
   $('#l4in').innerHTML=IN[st.ld].map(([k,l,u,a,b,s])=>sl('l4'+k,l,a,b,s,st[k])).join('')+(st.ld==='lift'?`<div class="ed-row">${swHTML('l4cw','أثقال الموازنة','تعادل نصف الحمولة',st.cw)}</div>`:'');
   IN[st.ld].forEach(([k,,u])=>bindS('l4'+k,k,u));
   if(st.ld==='lift')$('#l4cw').onclick=()=>{st.cw=!st.cw;$('#l4cw').setAttribute('aria-pressed',String(st.cw));if(!st.cw)did.nocw=1;upd()};
   const ecl=st.ld==='lift'?'كفاءة المصعد η<sub>c</sub>':'كفاءة صندوق التروس (وسيلة النقل) η<sub>c</sub>';
   $('#l4ef').innerHTML=st.eff==='sep'?sl('l4em','كفاءة المحرك η<sub>m</sub>',30,100,1,st.em)+sl('l4ec',ecl,20,100,1,st.ec):sl('l4et','الكفاءة الكلية η<sub>t</sub>',10,100,1,st.et);
   if(st.eff==='sep'){bindS('l4em','em','%');bindS('l4ec','ec','%')}else bindS('l4et','et','%');
   $('#l4ac').innerHTML=st.mot==='ac'?sl('l4pf','معامل القدرة cos θ',0.5,1,0.01,st.pf)+`<div class="ed-row"><span class="sub">توصيل الملفات:</span>${segHTML('conn',[['Y','نجمة'],['D','دلتا']],st.conn)}</div>`:'';
   if(st.mot==='ac'){bindS('l4pf','pf','');segBind($('#l4ac'),'conn',z=>{st.conn=z;did['c'+z]=1;upd()})}
   upd()};
  segBind(el,'ld',z=>{st.ld=z;ui()});segBind(el,'eff',z=>{st.eff=z;ui()});segBind(el,'mot',z=>{if(st.mot!==z)did.mot=1;st.mot=z;ui()});segBind(el,'V',z=>{st.V=+z;upd()});
  el.querySelectorAll('[data-pre]').forEach(b=>b.onclick=()=>{Object.assign(st,PRE[b.dataset.pre]);did[b.dataset.pre]=1;did.last=b.dataset.pre;ui()});
  let R={};
  const calc=()=>{let F,v,a=null,mass;if(st.ld==='train'){v=st.vk/3.6;a=v/st.tt;F=st.mt*1000*a;mass=st.mt}else if(st.ld==='hoist'){v=st.vh;F=st.mh*G;mass=st.mh}else{v=st.hl/st.tl;F=st.ml*G/(st.cw?2:1);mass=st.ml}
   const PL=F*v;let Pm=null,Pin;if(st.eff==='sep'){Pm=PL/(st.ec/100);Pin=Pm/(st.em/100)}else Pin=PL/(st.et/100);
   let I=null,IL=null,Iph=null;if(st.mot==='dc')I=Pin/st.V;else{IL=Pin/(SQ3*st.V*st.pf);Iph=st.conn==='D'?IL/SQ3:IL}
   return {F,v,a,PL,Pm,Pin,I,IL,Iph,mass,Tm:null}};
  const upd=()=>{R=calc();const r=R;
   const L=[['القوة F'+(st.ld==='train'?' = m·a (2-2)':st.ld==='hoist'?' = m·g (2-3)':st.cw?' = m·g/2 (2-4)':' = m·g (بلا موازنة)'),lt(fm(r.F,1)+' N')],['السرعة v',lt(fm(r.v,3)+' m/s')]];
   if(r.a!=null)L.push(['التسارع a = v/t',lt(fm(r.a,3)+' m/s²')]);
   L.push(['قدرة الحمل P<sub>L</sub> = F·v',lt(fmP(r.PL))]);if(r.Pm!=null)L.push(['قدرة خرج المحرك P<sub>m</sub> = P<sub>L</sub>/η<sub>c</sub>',lt(fmP(r.Pm))]);
   L.push(['قدرة الدخل P<sub>in</sub>',lt(fmP(r.Pin))],['الكفاءة الكلية η<sub>t</sub>',lt(fm(100*r.PL/r.Pin,1)+' %')]);
   if(r.I!=null)L.push(['التيار I = P<sub>in</sub>/V (2-13)',lt(fm(r.I,1)+' A')]);else{L.push(['تيار الخط I<sub>L</sub> (2-14)',lt(fm(r.IL,2)+' A')],['تيار الوجه I<sub>ph</sub> ('+(st.conn==='D'?'دلتا':'نجمة')+')',lt(fm(r.Iph,2)+' A')])}
   $('#l4fx').innerHTML=factsHTML(L);
   $('#l4fl').innerHTML=fig23SVG({vals:{Pin:r.Pin,Pm:r.Pm,PL:r.PL}});
   if(steps)steps.check()};
  let steps=null;
  steps=stepsUI($('#l4st'),[
   {t:'مثال (2-1): قطار يتسارع',x:'اضغط «مثال (2-1)»: \\(a=0.5\\ \\text{m/s}^2\\) و \\(F=10^5\\ \\text{N}\\) و \\(P_L=1\\ \\text{MW}\\)، ومحرك تيار مستمر على <span class="ltr">3000 V</span> يسحب نحو <span class="ltr">617 A</span>. لاحظ في الشكل (2-3) كيف تضيع القدرة في كل مرحلة.',done:()=>did.ex21&&st.ld==='train'},
   {t:'أثر كفاءة صندوق التروس',x:'أنزل كفاءة صندوق التروس من 60% إلى 50% أو أقل: \\(P_L\\) لم تتغير لكن \\(P_m\\) و\\(P_{in}\\) والتيار زادت — القسمة على كفاءة أصغر.',done:()=>did.ex21&&st.ld==='train'&&st.eff==='sep'&&st.ec<=50},
   {t:'مثال (2-2): رفع ثقل بمحرك دلتا',x:'اضغط «مثال (2-2)»: الكفاءة الكلية فقط <span class="ltr">80%</span>، تيار الخط <span class="ltr">25.9 A</span> وتيار الوجه <span class="ltr">15 A</span> لأن الملفات دلتا.',done:()=>did.ex22&&st.ld==='hoist'&&st.conn==='D'},
   {t:'دلتا أم نجمة؟',x:'بدّل التوصيل إلى «نجمة»: تيار الخط لا يتغير (القدرة والجهد نفسهما)، لكن تيار الوجه يصبح مساوياً لتيار الخط.',done:()=>did.ex22&&st.mot==='ac'&&st.conn==='Y'},
   {t:'مثال (2-4): المصعد وأثقال الموازنة',x:'اضغط «مثال (2-4)» ثم أطفئ «أثقال الموازنة»: تتضاعف القوة والقدرة والتيار، فمن دون الموازنة نحتاج محركاً أكبر بكثير (توضيح: هنا أهملنا كتلة الصاعدة والحبال).',done:()=>did.ex24&&st.ld==='lift'&&!st.cw},
   {t:'تيار مستمر أم متردد؟',x:'بدّل نوع المحرك: للتيار المستمر \\(I=P_{in}/V\\) (2-13)، وللحثي ثلاثي الأوجه \\(I_L=P_{in}/(\\sqrt3\\,V_L\\cos\\theta)\\) (2-14) — التيار أصغر لنفس القدرة والجهد.',done:()=>did.mot}
  ]);
  ui();
  loopOn(el,dt=>{ph+=dt;$('#l4sc').innerHTML=sceneSVG(st.ld,ph,{vis:st.ld==='train'?clamp(R.v/10,0.2,3):0.8,F:R.F,m:st.ld==='train'?st.mt:st.ld==='hoist'?st.mh:st.ml,cw:st.cw})});
 },
 examples:[
  {title:'مثال (2-1)',ref:'ص 25',q:'<p>«قطار كتلته <span class="ltr">200 ton</span> بدأ حركته من السكون واستغرق <span class="ltr">20 s</span> لتصل سرعته إلى <span class="ltr">36 km/h</span>. احسب التيار المسحوب من المصدر أثناء فترة التسارع إذا كان جهد المصدر <span class="ltr">3000 V</span> وكفاءة المحرك <span class="ltr">90 %</span> وكفاءة صندوق التروس <span class="ltr">60 %</span>. أهمل القوة اللازمة للتغلب على المقاومة لحركة القطار.»</p>',
   given:GT(200,36,20,3000,90,60),solve:solveTrain,note:'القدرات بالميجاواط مقربة إلى منزلتين كما في الكتاب (1.67 MW و 1.85 MW)، ثم يُحسب التيار من 1.85 MW. بدون تقريب وسيط \\(I=617.3\\ \\text{A}\\).'},
  {title:'مثال (2-2)',ref:'ص 25',q:'<p>«محرك حثي ثلاثي الأوجه، <span class="ltr">3000 V</span>، ومعامل قدرته <span class="ltr">0.82</span>، موصل دلتا، يستخدم لرفع ثقل مقداره <span class="ltr">6000 kg</span>، بسرعة <span class="ltr">1.5 m/sec</span>. احسب تيار الخط وتيار الوجه، بافتراض أن الكفاءة الكلية <span class="ltr">80%</span>»</p>',
   given:GH(3000,0.82,6000,1.5,80),solve:solveHoist,note:'تيار الوجه بالضبط 14.95 A، ويكتبه الكتاب مقرباً 15 A.'},
  {title:'مثال (2-4)',ref:'ص 26–27',q:'<p>«محرك حثي ثلاثي الأوجه، <span class="ltr">380 V</span>، كفاءته <span class="ltr">82%</span>، ومعامل قدرته <span class="ltr">85%</span>، يستعمل لتحريك مصعد كفاءته <span class="ltr">48%</span> لرفع <span class="ltr">5000 kg</span> إلى ارتفاع <span class="ltr">30 m</span> خلال زمن مقداره نصف دقيقة، تمت موازنة نصف حمولة التشغيل، وكل من كتلة المصعد والحبال، بواسطة أثقال موازنة. احسب قدرة المحرك، وتيار المحرك.»</p>',
   given:GLf(380,82,0.85,48,5000,30,30),solve:solveLift,note:'نصف دقيقة = 30 s. كفاءة المصعد تقوم هنا مقام كفاءة وسيلة نقل الحركة \\(\\eta_c\\).'},
  {title:'تمرين (2-4) — حل مقترح (ليس من الكتاب)',ref:'ص 30',q:'<p>«قطار كتلته <span class="ltr">150 ton</span> بدأ حركته من السكون واستغرق <span class="ltr">30 s</span> لتصل سرعته إلى <span class="ltr">42 km/h</span> احسب التيار المسحوب من المصدر أثناء فترة التسارع إذا كان جهد المصدر <span class="ltr">3000 V</span> وكفاءة المحرك <span class="ltr">85 %</span> وكفاءة صندوق التروس <span class="ltr">65 %</span>.»</p>',given:GT(150,42,30,3000,85,65),solve:(g,B)=>solveTrain(g,B,false),note:SUG+' بدون تقريب القدرات إلى منزلتين يكون \\(I=410.6\\ \\text{A}\\).'},
  {title:'تمرين (2-6) — حل مقترح (ليس من الكتاب)',ref:'ص 30',q:'<p>«محرك حثي ثلاثي الأوجه، <span class="ltr">380 V</span>، كفاءته <span class="ltr">80%</span>، ومعامل قدرته <span class="ltr">0.82</span>، يستعمل لتحريك مصعد كفاءته <span class="ltr">55%</span> لرفع <span class="ltr">8000 kg</span> إلى ارتفاع <span class="ltr">60 m</span> خلال زمن مقداره دقيقة، تمت موازنة نصف حمولة التشغيل… احسب قدرة المحرك، وتيار المحرك.»</p>',given:GLf(380,80,0.82,55,8000,60,60),solve:(g,B)=>solveLift(g,B,false),note:SUG},
  {title:'تمرين (2-9) — حل مقترح (ليس من الكتاب)',ref:'ص 31',q:'<p>«محرك حثي ثلاثي الأوجه، <span class="ltr">3000 V</span>، ومعامل قدرته <span class="ltr">0.8</span>، ملفاته موصلة دلتا، يستخدم لرفع ثقل مقداره <span class="ltr">8000 kg</span>، بسرعة <span class="ltr">2 m/sec</span>. احسب تيار الخط وتيار الوجه، بافتراض أن الكفاءة الكلية <span class="ltr">70%</span>»</p>',given:GH(3000,0.8,8000,2,70),solve:(g,B)=>solveHoist(g,B,false),note:SUG}
 ],
 quiz:[
  {q:'القوة اللازمة لتسريع حمل أفقياً (بإهمال مقاومة الحركة):',o:['F = m·g','F = m·a','F = m·g/2','F = P·v'],c:1,e:'المعادلة (2-2).'},
  {q:'في المصاعد بأثقال موازنة تحسب القوة على أساس:',o:['الحمولة كاملة','نصف الحمولة','ضعف الحمولة','كتلة الصاعدة فقط'],c:1,e:'المعادلة (2-4): \\(F=m\\,g/2\\).'},
  {q:'كفاءة وسيلة نقل الحركة η<sub>c</sub> تساوي:',o:['P<sub>m</sub>/P<sub>in</sub>','P<sub>L</sub>/P<sub>m</sub>','P<sub>in</sub>/P<sub>L</sub>','P<sub>L</sub>·P<sub>m</sub>'],c:1,e:'المعادلة (2-9).'},
  {q:'محرك كفاءته 90% وصندوق تروس كفاءته 60%. الكفاءة الكلية:',o:['150%','75%','54%','30%'],c:2,e:'\\(\\eta_t=\\eta_c\\cdot\\eta_m=0.6\\times0.9=0.54\\) (المعادلة 2-15).'},
  {q:'قدرة الحمل 1 MW وكفاءة صندوق التروس 50%. قدرة خرج المحرك:',o:['0.5 MW','1 MW','1.5 MW','2 MW'],c:3,e:'\\(P_m=P_L/\\eta_c=1/0.5=2\\ \\text{MW}\\) (المعادلة 2-10).'},
  {q:'محرك تيار مستمر قدرة دخله 22 kW على جهد 220 V. تياره:',o:['10 A','100 A','4840 A','0.1 A'],c:1,e:'\\(I=P_{in}/V=22000/220=100\\ \\text{A}\\) (المعادلة 2-13).'},
  {q:'في محرك ثلاثي الأوجه موصل دلتا، تيار الوجه يساوي:',o:['تيار الخط','تيار الخط × √3','تيار الخط ÷ √3','ضعف تيار الخط'],c:2,e:'كما في المثال (2-2): \\(I_{ph}=I_L/\\sqrt3\\).'}
 ]
});

/* ======================================================================
   Lesson 3 — الأحمال الدورانية والمضخات والمراوح والونش بصندوق تروس
   ====================================================================== */
function solveRotG(g,B,isBook){const pi=g.pi,wL=2*pi*g.nL/60,PL=B.round(g.TL*wL,0),Pm=B.round(PL/(g.ec/100),0),Pin=B.round(Pm/(g.em/100),0),IL=Pin/(SQ3*g.V*g.pf),wm=B.round(2*pi*g.nm/60,1),Tm=Pm/wm;
  return [{t:'السرعة الزاوية للحمل (1-13):',f:`\\omega_L=\\frac{2\\pi n_L}{60}=\\frac{2\\times ${fm(pi)}\\times ${fm(g.nL)}}{60}`,v:wL,unit:'rad/s',dp:1},
   {t:'القدرة اللازمة للحمل (2-5):',f:`P_L=T_L\\cdot\\omega_L=${fm(g.TL)}\\times ${fm(B.round(wL,1))}`,v:PL,unit:'W',dp:0},
   {t:'قدرة خرج المحرك (2-10):',f:`P_m=\\frac{P_L}{\\eta_c}=\\frac{${fm(PL)}}{${fm(g.ec/100)}}`,v:Pm,unit:'W',dp:0,final:true},
   {t:'قدرة دخل المحرك (2-12):',f:`P_{in}=\\frac{P_m}{\\eta_m}=\\frac{${fm(Pm)}}{${fm(g.em/100)}}`,v:Pin,unit:'W',dp:0},
   {t:'تيار المحرك (2-14):',f:`I_L=\\frac{P_{in}}{\\sqrt3\\,V_L\\cos\\theta}=\\frac{${fm(Pin)}}{\\sqrt3\\times ${fm(g.V)}\\times ${fm(g.pf)}}`,v:IL,unit:'A',dp:2,final:true},
   {t:'السرعة الزاوية للمحرك (1-13):',f:`\\omega_m=\\frac{2\\pi n_m}{60}=\\frac{2\\times ${fm(pi)}\\times ${fm(g.nm)}}{60}`,v:wm,unit:'rad/s',dp:dd(isBook,0,1)},
   {t:'عزم المحرك (2-11):',f:`T_m=\\frac{P_m}{\\omega_m}=\\frac{${fm(Pm)}}{${fm(wm,1)}}`,v:Tm,unit:'Nm',dp:1,final:true}]}
function solvePump(g,B,isBook){const PL=B.round(g.Q/3600*g.rho*G*g.h,0),Pm=B.round(PL/(g.ec/100),0),Pin=B.round(Pm/(g.em/100),0),I=Pin/g.V;
  return [{t:'القدرة اللازمة للمضخة (2-6) — التدفق بالـ m³/s:',f:`P_L=Q\\cdot\\rho\\cdot g\\cdot h=\\frac{${fm(g.Q)}}{60\\times60}\\times ${fm(g.rho)}\\times 9.81\\times ${fm(g.h)}`,v:PL,unit:'W',dp:0},
   {t:'قدرة خرج المحرك (2-10) — كفاءة المضخة مكان \\(\\eta_c\\):',f:`P_m=\\frac{P_L}{\\eta_c}=\\frac{${fm(PL)}}{${fm(g.ec/100)}}`,v:Pm,unit:'W',dp:0,final:true},
   {t:'قدرة دخل المحرك (2-12):',f:`P_{in}=\\frac{P_m}{\\eta_m}=\\frac{${fm(Pm)}}{${fm(g.em/100)}}`,v:Pin,unit:'W',dp:1,final:true},
   {t:'تيار المحرك (2-13):',f:`I=\\frac{P_{in}}{V}=\\frac{${fm(Pin)}}{${fm(g.V)}}`,v:I,unit:'A',dp:dd(isBook,0,2),final:true}]}
function solveFan(g,B,isBook){const PL=B.round(g.Q/60*g.p,2),Pm=B.round(PL/(g.ec/100),1),Pin=B.round(Pm/(g.em/100),1),IL=Pin/(SQ3*g.V*g.pf);
  return [{t:'القدرة اللازمة لمروحة التهوية (2-7) — التدفق بالـ m³/s:',f:`P_L=Q\\cdot p=\\frac{${fm(g.Q)}}{60}\\times ${fm(g.p)}`,v:PL,unit:'W',dp:2},
   {t:'القدرة المستفادة من المحرك (قدرة خرجه) (2-10):',f:`P_m=\\frac{P_L}{\\eta_c}=\\frac{${fm(PL,2)}}{${fm(g.ec/100)}}`,v:Pm,unit:'W',dp:1,final:true},
   {t:'قدرة دخل المحرك (2-12):',f:`P_{in}=\\frac{P_m}{\\eta_m}=\\frac{${fm(Pm,1)}}{${fm(g.em/100)}}`,v:Pin,unit:'W',dp:1},
   {t:'التيار المسحوب من المصدر (2-14):',f:`I_L=\\frac{P_{in}}{\\sqrt3\\,V_L\\cos\\theta}=\\frac{${fm(Pin,1)}}{\\sqrt3\\times ${fm(g.V)}\\times ${fm(g.pf)}}`,v:IL,unit:'A',dp:dd(isBook,2,3),final:true}]}
/* Example 2-7 (winch). book:true → reproduce the printed slips when the book's data are used */
function solveWinch(g,B,isBook,bookMode){const pi=g.pi,bk=bookMode&&isBook,F=g.m*1000*G,PL=F*g.v,Pm=PL/(g.ec/100),Pin=Pm/(g.em/100),IL=Pin/(SQ3*g.V*g.pf);
  const nL=bk?60:B.round(60*g.v/(pi*g.D),1),nm=g.s*nL,wm=B.round(2*pi*nm/60,1),Tm=Pm/wm;
  return [{t:'القوة اللازمة لرفع الثقل (2-3):',f:`F=m\\,g=${fm(g.m*1000)}\\times 9.81`,v:bk?2943:F,unit:'N',dp:0},
   bk?{t:'<span style="color:var(--stop)">طُبع الناتج 2943 N والصحيح 29430 N، والسطر التالي يستعمل القيمة الصحيحة.</span>'}:{t:''},
   {t:'القدرة اللازمة (2-1):',f:`P_L=F\\cdot v=${fm(F)}\\times ${fm(g.v)}`,v:PL,unit:'W',dp:0},
   {t:'قدرة خرج المحرك (2-10):',f:`P_m=\\frac{P_L}{\\eta_c}=\\frac{${fm(PL)}}{${fm(g.ec/100)}}`,v:Pm,unit:'W',dp:0,final:true},
   {t:'قدرة دخل المحرك (2-12):',f:`P_{in}=\\frac{P_m}{\\eta_m}=\\frac{${fm(B.round(Pm,0))}}{${fm(g.em/100)}}`,v:Pin,unit:'W',dp:0},
   {t:'التيار المسحوب من المصدر (2-14):',f:`I_L=\\frac{P_{in}}{\\sqrt3\\,V_L\\cos\\theta}=\\frac{${fm(B.round(Pin,0))}}{\\sqrt3\\times ${fm(g.V)}\\times ${bk?'0.95':fm(g.pf)}}`,v:IL,unit:'A',dp:dd(isBook,0,1),final:true},
   bk?{t:'<span style="color:var(--stop)">في المقام طُبع 0.95 ومعامل القدرة المعطى 0.85؛ الناتج 73 A صحيح بـ 0.85 (بـ 0.95 يكون 65.4 A).</span>'}:{t:''},
   {t:'سرعة دوران الحمل (حداثة الونش) من المعادلة (1-14) معكوسة:',f:`n_L=\\frac{60\\,v}{\\pi D}=\\frac{60\\times ${fm(g.v)}}{${fm(pi)}\\times ${fm(g.D)}}`,v:nL,unit:'rpm',dp:dd(isBook,bk?0:1,1)},
   bk?{t:'<span style="color:var(--stop)">طُبع 60 rpm، والصحيح \\(60/\\pi=19.1\\ \\text{rpm}\\). كل ما بعده مبني على هذا الخطأ.</span>'}:{t:''},
   {t:'سرعة المحرك من نسبة تحويل صندوق التروس σ:',f:`\\sigma=\\frac{n_m}{n_L}\\ \\Rightarrow\\ n_m=\\sigma\\,n_L=${fm(g.s)}\\times ${fm(nL)}`,v:nm,unit:'rpm',dp:dd(isBook,bk?0:1,1)},
   {t:'السرعة الزاوية للمحرك (1-13):',f:`\\omega_m=\\frac{2\\pi n_m}{60}=\\frac{2\\pi\\times ${fm(nm)}}{60}`,v:wm,unit:'rad/s',dp:1},
   {t:'عزم المحرك (2-11):',f:`T_m=\\frac{P_m}{\\omega_m}=\\frac{${fm(B.round(Pm,0))}}{${fm(wm,1)}}`,v:Tm,unit:'Nm',dp:dd(isBook,bk?0:1,1),final:true}].filter(x=>x.t!==''||x.f)}
const GR=(V,nm,TL,nL,ec,em,pf)=>[{id:'V',label:'جهد الخط',sym:'V_L',unit:'V',value:V},{id:'nm',label:'سرعة المحرك',sym:'n_m',unit:'rpm',value:nm},{id:'TL',label:'عزم الحمل',sym:'T_L',unit:'Nm',value:TL},{id:'nL',label:'سرعة دوران الحمل',sym:'n_L',unit:'rpm',value:nL},{id:'ec',label:'كفاءة صندوق التروس',sym:'\\eta_c',unit:'%',value:ec},{id:'em',label:'كفاءة المحرك',sym:'\\eta_m',unit:'%',value:em},{id:'pf',label:'معامل القدرة',sym:'\\cos\\theta',unit:'',value:pf},{id:'pi',label:'قيمة π المستخدمة',sym:'\\pi',unit:'',value:3.14}];
const GP=(V,em,ec,Q,h)=>[{id:'V',label:'جهد المحرك',sym:'V',unit:'V',value:V},{id:'em',label:'كفاءة المحرك',sym:'\\eta_m',unit:'%',value:em},{id:'ec',label:'كفاءة المضخة',sym:'\\eta_c',unit:'%',value:ec},{id:'Q',label:'معدل الضخ',sym:'Q',unit:'m³/h',value:Q},{id:'h',label:'الارتفاع',sym:'h',unit:'m',value:h},{id:'rho',label:'كثافة الماء',sym:'\\rho',unit:'kg/m³',value:1000}];
const GF=(V,em,pf,ec,Q,p)=>[{id:'V',label:'جهد الخط',sym:'V_L',unit:'V',value:V},{id:'em',label:'كفاءة المحرك',sym:'\\eta_m',unit:'%',value:em},{id:'pf',label:'معامل القدرة',sym:'\\cos\\theta',unit:'',value:pf},{id:'ec',label:'كفاءة المروحة',sym:'\\eta_c',unit:'%',value:ec},{id:'Q',label:'معدل تدفق الهواء',sym:'Q',unit:'m³/min',value:Q},{id:'p',label:'ضغط الهواء',sym:'p',unit:'N/m²',value:p}];
const GW=(V,em,pf,m,v,s,ec,D)=>[{id:'V',label:'جهد الخط',sym:'V_L',unit:'V',value:V},{id:'em',label:'كفاءة المحرك',sym:'\\eta_m',unit:'%',value:em},{id:'pf',label:'معامل القدرة',sym:'\\cos\\theta',unit:'',value:pf},{id:'m',label:'الثقل',sym:'m',unit:'ton',value:m},{id:'v',label:'سرعة الرفع',sym:'v',unit:'m/s',value:v},{id:'s',label:'نسبة تحويل صندوق التروس',sym:'\\sigma',unit:'',value:s},{id:'ec',label:'كفاءة صندوق التروس',sym:'\\eta_c',unit:'%',value:ec},{id:'D',label:'قطر حداثة الونش',sym:'D',unit:'m',value:D},{id:'pi',label:'قيمة π المستخدمة',sym:'\\pi',unit:'',value:3.14}];
const Q27='<p>«محرك حثي ثلاثي الأوجه <span class="ltr">380 V</span> كفاءته <span class="ltr">80%</span> ومعامل قدرته <span class="ltr">0.85</span> متصل ميكانيكياً مع ونش لرفع ثقل مقداره <span class="ltr">3 ton</span> بسرعة مقدارها <span class="ltr">1 m/s</span>. إذا كانت نسبة تحويل صندوق التروس <span class="ltr">12</span> وكفاءته <span class="ltr">90%</span> وقطر حداثة الونش <span class="ltr">1 m</span>، احسب قدرة خرج المحرك وعزم المحرك والتيار المسحوب من المصدر.»</p>';

function driveSVG(o){const W=700,H=220,cy=110;let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="المحرك وصندوق التروس والحمل">`;
  // motor
  s+=`<rect x="20" y="${cy-45}" width="130" height="90" rx="12" fill="var(--blue-soft)" stroke="var(--blue)" stroke-width="2"/>`+S.t(85,cy+5,'M','b','middle',22)+S.t(85,cy+28,o.mot,'m');
  const gear=(x,y,r,a,n)=>{let p='';for(let i=0;i<n;i++){const t=a+i*2*PI/n;p+=`<path d="M${fx(x+r*Math.cos(t))} ${fx(y+r*Math.sin(t))}L${fx(x+(r+7)*Math.cos(t))} ${fx(y+(r+7)*Math.sin(t))}" stroke="var(--fg)" stroke-width="5"/>`}
    return p+`<circle cx="${x}" cy="${y}" r="${r}" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2"/><path d="M${x} ${y}L${fx(x+r*0.8*Math.cos(a))} ${fx(y+r*0.8*Math.sin(a))}" stroke="var(--live)" stroke-width="3"/>`};
  s+=`<path d="M150 ${cy}H215" stroke="var(--fg)" stroke-width="6"/>`;
  if(o.gear){const r1=18,r2=clamp(18*Math.sqrt(o.ratio),22,60);s+=`<rect x="200" y="${cy-80}" width="${fx(80+r2)}" height="160" rx="10" fill="none" stroke="var(--muted)" stroke-dasharray="6 4"/>`;
    s+=gear(232,cy,r1,o.am,10)+gear(232+r1+r2+7,cy,r2,-o.aL,Math.round(10*Math.max(1,r2/r1)));s+=`<path d="M${fx(232+r1+r2+7)} ${cy}H460" stroke="var(--fg)" stroke-width="6"/>`;
    s+=arT(fx(240+r2/2),cy+98,'صندوق التروس',{fs:12})}
  else s+=`<path d="M215 ${cy}H460" stroke="var(--fg)" stroke-width="6"/>`;
  const lx=540;
  if(o.kind==='winch'){const R=36;s+=`<circle cx="${lx}" cy="${cy-20}" r="${R}" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2.4"/><path d="M${lx} ${cy-20}L${fx(lx+R*Math.cos(o.aL))} ${fx(cy-20+R*Math.sin(o.aL))}" stroke="var(--live)" stroke-width="3"/>`;
    const yy=cy+40+((o.rope%40)+40)%40*0;s+=`<path d="M${lx+R} ${cy-20}V${cy+60}" stroke="var(--fg)" stroke-width="2"/><rect x="${lx+R-22}" y="${cy+60}" width="44" height="34" rx="3" fill="var(--blue-soft)" stroke="var(--blue)" stroke-width="2"/>`;
    for(let k=0;k<4;k++){const y=cy-10+((k*20-o.rope*12)%80+80)%80;s+=`<path d="M${lx+R-5} ${fx(y)}h10" stroke="var(--live)" stroke-width="2"/>`}
    s+=S.t(lx,cy+112,'D = '+fm(o.D)+' m','m')}
  else if(o.kind==='fan'){s+=`<circle cx="${lx}" cy="${cy}" r="62" fill="none" stroke="var(--fg)" stroke-width="2"/>`;for(let i=0;i<4;i++){const t=o.aL+i*PI/2;s+=`<path d="M${lx} ${cy}Q${fx(lx+40*Math.cos(t-0.4))} ${fx(cy+40*Math.sin(t-0.4))} ${fx(lx+56*Math.cos(t))} ${fx(cy+56*Math.sin(t))}Q${fx(lx+30*Math.cos(t+0.3))} ${fx(cy+30*Math.sin(t+0.3))} ${lx} ${cy}" fill="var(--blue-soft)" stroke="var(--blue)" stroke-width="1.6"/>`}}
  else if(o.kind==='pump'){s+=`<circle cx="${lx}" cy="${cy}" r="50" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2.4"/><path d="M${lx+20} ${cy-46}V${cy-96}H${lx+120}" stroke="var(--blue)" stroke-width="10" fill="none"/>`;for(let i=0;i<6;i++){const t=o.aL+i*PI/3;s+=`<path d="M${lx} ${cy}Q${fx(lx+25*Math.cos(t+0.5))} ${fx(cy+25*Math.sin(t+0.5))} ${fx(lx+44*Math.cos(t))} ${fx(cy+44*Math.sin(t))}" fill="none" stroke="var(--blue)" stroke-width="3"/>`}s+=S.t(lx+130,cy-100,'h','b','start')}
  else{s+=`<circle cx="${lx}" cy="${cy}" r="56" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2.4"/>`;for(let i=0;i<3;i++){const t=o.aL+i*2*PI/3;s+=`<circle cx="${fx(lx+38*Math.cos(t))}" cy="${fx(cy+38*Math.sin(t))}" r="8" fill="var(--live)"/>`}s+=S.t(lx,cy+78,'TL','m')}
  s+=`<circle cx="${lx}" cy="${o.kind==='winch'?cy-20:cy}" r="5" fill="var(--fg)"/>`;
  return s+'</svg>'}

B.lesson({
 id:'u2-l3',unit:2,order:3,pages:'22–24، 26–31',
 title:'قدرة المحرك للأحمال الدورانية والمضخات والمراوح والونش بصندوق تروس',
 summary:'القدرة اللازمة لتدوير حمل P<sub>L</sub> = T<sub>L</sub>·ω<sub>L</sub>، وللمضخات P<sub>L</sub> = Q·ρ·g·h، ولأجهزة التهوية P<sub>L</sub> = Q·p، ثم قدرة المحرك وعزمه T<sub>m</sub> = P<sub>m</sub>/ω<sub>m</sub> وتياره، وصندوق التروس ونسبة تحويله، مع الأمثلة (2-3) و(2-5) و(2-6) و(2-7) والتمارين (2-5) و(2-7) و(2-8) و(2-10).',
 theory:[
  {h:'ب- أحمال ذات حركة دورانية',ref:'ص 22',html:`<p>«القدرة اللازمة لتدوير حمل دوراني بسرعة زاوية مقدارها \\(\\omega_L\\) يمكن حسابها كما هو موضح في الوحدة السابقة من العلاقة التالية:»</p>
   $$P_L=T_L\\cdot\\omega_L \\qquad (2\\text{-}5)$$
   <p>«حيث \\(T_L\\) هو العزم اللازم لتدوير الحمل.»</p>`},
  {h:'ج- المضخات',ref:'ص 23',html:`$$P_L=Q\\cdot\\rho\\cdot g\\cdot h \\qquad (2\\text{-}6)$$
   <p>حيث:</p><div class="ed-tbl"><table class="tt"><thead><tr><th>المصطلح</th><th>رمز المصطلح</th><th>الوحدة</th></tr></thead><tbody>
   <tr><td>معدل تدفق السائل</td><td>${lt('Q')}</td><td>${lt('m³/s')}</td></tr><tr><td>كثافة السائل</td><td>${lt('ρ')}</td><td>${lt('kg/m³')}</td></tr><tr><td>فرق الارتفاع بين نقطة الامتصاص ونقطة الدفع + مجموع المقاومات</td><td>${lt('h')}</td><td>${lt('m')}</td></tr></tbody></table></div>`},
  {h:'د- أجهزة التهوية',ref:'ص 23',html:`$$P_L=Q\\cdot p \\qquad (2\\text{-}7)$$
   <p>حيث:</p><div class="ed-tbl"><table class="tt"><thead><tr><th>المصطلح</th><th>رمز المصطلح</th><th>الوحدة</th></tr></thead><tbody>
   <tr><td>معدل تدفق الهواء</td><td>${lt('Q')}</td><td>${lt('m³/s')}</td></tr><tr><td>ضغط الهواء عند فتحة الخروج</td><td>${lt('p')}</td><td>${lt('N/m²')}</td></tr></tbody></table></div>`},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب:</b> \\(Q\\) في المعادلتين بالمتر المكعب في <b>الثانية</b>: إذا أُعطي بالساعة فاقسم على 3600، وإذا أُعطي بالدقيقة فاقسم على 60 (كما في المثالين 2-5 و2-6). و\\(Q\\rho\\) هي كتلة الماء المرفوعة كل ثانية، فالمعادلة (2-6) هي نفسها \\(F\\cdot v\\): وزن الماء المرفوع في الثانية × الارتفاع.'},
  {h:'قدرة المحرك وعزمه وتياره',ref:'ص 23–24',html:`<p>كما في الدرس السابق: \\(P_m=P_L/\\eta_c\\) (2-10)، و\\(P_{in}=P_m/\\eta_m\\) (2-12)، والتيار من (2-13) للتيار المستمر أو (2-14) للحثي ثلاثي الأوجه، و«يمكن حساب <b>العزم المقنن للمحرك</b> \\((T_m)\\) كما يلي:»</p>
   $$T_m=\\frac{P_m}{\\omega_m} \\qquad (2\\text{-}11)$$
   <p>حيث \\(\\omega_m=2\\pi n_m/60\\) سرعة المحرك الزاوية (المعادلة 1-13). وفي المضخات والمراوح تقوم كفاءة المضخة أو المروحة مقام كفاءة وسيلة نقل الحركة \\(\\eta_c\\).</p>`},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب: صندوق التروس.</b> يستعمله الكتاب في المثالين (2-3) و(2-7) ويرمز لنسبة تحويله بـ \\(\\sigma=n_m/n_L\\) (سرعة المحرك ÷ سرعة الحمل). الصندوق يُبطئ السرعة \\(\\sigma\\) مرة ويكبّر العزم تقريباً \\(\\sigma\\) مرة (مضروباً في كفاءته): \\(T_L=\\sigma\\,\\eta_c\\,T_m\\). لذلك يستطيع محرك سريع صغير العزم أن يدير ونشاً بطيئاً كبير العزم. القدرة لا تزيد أبداً، بل تنقص بمفاقيد الصندوق.'},
  {h:'الأمثلة المحلولة لهذا الدرس',ref:'ص 26–29',html:`<div class="ed-tbl"><table class="tt"><thead><tr><th>المثال</th><th>الحمل</th><th>النتائج</th></tr></thead><tbody>
   <tr><td>(2-3) ص 26</td><td>حمل ${lt('78 Nm')} عند ${lt('1410 rpm')} عبر صندوق تروس، محرك ${lt('1710 rpm')}</td><td>${lt('P<sub>m</sub> = 14758 W')}، ${lt('T<sub>m</sub> = 82.4 Nm')}، ${lt('I<sub>L</sub> = 36.46 A')}</td></tr>
   <tr><td>(2-5) ص 27</td><td>مضخة ${lt('15 m³/hr')} إلى ${lt('18 m')}، محرك تيار مستمر</td><td>${lt('P<sub>m</sub> = 981 W')}، ${lt('P<sub>in</sub> = 1115 W')}، ${lt('I = 5 A')}</td></tr>
   <tr><td>(2-6) ص 28</td><td>مروحة ${lt('100 m³/min')} بضغط ${lt('25 N/m²')}</td><td>${lt('P<sub>m</sub> = 64.1 W')}، ${lt('I<sub>L</sub> = 0.14 A')}</td></tr>
   <tr><td>(2-7) ص 28–29</td><td>ونش ${lt('3 ton')} بسرعة ${lt('1 m/s')}، ${lt('σ = 12')}، ${lt('D = 1 m')}</td><td>${lt('P<sub>m</sub> = 32700 W')}، ${lt('I<sub>L</sub> = 73 A')}، والعزم الصحيح ${lt('T<sub>m</sub> = 1362.5 Nm')} (طُبع 434 Nm — انظر الملاحظات)</td></tr></tbody></table></div>
   <p>الحلول خطوة بخطوة في تبويب «الأمثلة المحلولة»، وللمثال (2-7) حلّان: «كما في الكتاب» و«المصحح».</p>`},
  {h:'أسئلة وتمارين لهذا الدرس: (2-5) و(2-7) و(2-8) و(2-10)',ref:'ص 30–31',html:NOANS+
   Q('2-5','محرك حثي ثلاثي الأوجه، <span class="ltr">380 V</span>، سرعته <span class="ltr">1700 rpm</span> يستعمل لتدوير حمل عزمه <span class="ltr">85 Nm</span> عند سرعة دوران <span class="ltr">1500 rpm</span>، إذا كانت كفاءة صندوق التروس <span class="ltr">75%</span>، وكفاءة المحرك <span class="ltr">85%</span>، ومعامل القدرة <span class="ltr">0.8</span> احسب: قدرة خرج المحرك، وعزم المحرك، وتيار المحرك.','بطريقة المثال (2-3) و \\(\\pi=3.14\\): \\(\\omega_L=157\\ \\text{rad/s}\\)، \\(P_L=13345\\ \\text{W}\\)، \\(P_m=17793\\ \\text{W}\\)، \\(P_{in}=20933\\ \\text{W}\\)، \\(I_L\\approx39.76\\ \\text{A}\\)، \\(\\omega_m=177.9\\ \\text{rad/s}\\)، \\(T_m\\approx100\\ \\text{Nm}\\).')+
   Q('2-7','محرك تيار مستمر، <span class="ltr">400 V</span>، كفاءته <span class="ltr">85%</span>، يستخدم لتشغيل مضخة مياه كفاءتها <span class="ltr">65%</span>، لضخ الماء بمعدل <span class="ltr">25 m³/hr</span> إلى ارتفاع <span class="ltr">20 m</span>، احسب قدرة خرج المحرك و قدرة دخل المحرك و تيار المحرك.','بطريقة المثال (2-5): \\(P_L=1362.5\\ \\text{W}\\)، \\(P_m\\approx2097\\ \\text{W}\\)، \\(P_{in}\\approx2467\\ \\text{W}\\)، \\(I\\approx6.17\\ \\text{A}\\).')+
   Q('2-8','محرك حثي ثلاثي الأوجه، <span class="ltr">380 V</span>، كفاءته <span class="ltr">80%</span>، ومعامل قدرته <span class="ltr">85%</span>، يستخدم لتدوير مروحة تهوية كفاءتها <span class="ltr">75%</span>، تقوم بضغط الهواء بمعدل <span class="ltr">200 m³/min</span>، بضغط <span class="ltr">15 N/m²</span>. احسب القدرة المستفادة من المحرك و التيار المسحوب من المصدر.','بطريقة المثال (2-6): \\(P_L=50\\ \\text{W}\\)، \\(P_m=66.7\\ \\text{W}\\)، \\(P_{in}=83.4\\ \\text{W}\\)، \\(I_L\\approx0.149\\ \\text{A}\\).')+
   Q('2-10','محرك حثي ثلاثي الأوجه <span class="ltr">380 V</span> كفاءته <span class="ltr">85%</span> ومعامل قدرته <span class="ltr">0.8</span> متصل ميكانيكياً مع ونش لرفع ثقل مقداره <span class="ltr">5 ton</span> بسرعة مقدارها <span class="ltr">1.5 m/s</span>. إذا كانت نسبة تحويل صندوق التروس <span class="ltr">10</span> وكفاءته <span class="ltr">90%</span> وقطر حداثة الونش <span class="ltr">1 m</span>، احسب قدرة خرج المحرك وعزم المحرك والتيار المسحوب من المصدر.','بطريقة المثال (2-7) <b>المصححة</b>: \\(F=49050\\ \\text{N}\\)، \\(P_L=73575\\ \\text{W}\\)، \\(P_m=81750\\ \\text{W}\\)، \\(P_{in}\\approx96176\\ \\text{W}\\)، \\(I_L\\approx182.7\\ \\text{A}\\)، \\(n_L=60\\times1.5/(\\pi\\times1)\\approx28.7\\ \\text{rpm}\\)، \\(n_m\\approx287\\ \\text{rpm}\\)، \\(\\omega_m\\approx30\\ \\text{rad/s}\\)، \\(T_m\\approx2725\\ \\text{Nm}\\).')},
  {err:'<b>ملاحظات على الكتاب:</b> (1) <b>مثال (2-7) ص 28–29</b> — أخطاء تغيّر النتائج: (أ) \\(n_L=\\frac{60\\times1}{\\pi\\times1}\\) كُتب ناتجها <b>60 rpm</b> والصحيح <b>19.1 rpm</b> (كأن π سقطت)، فخرجت \\(n_m=720\\ \\text{rpm}\\) بدل <b>229.2 rpm</b>، و\\(\\omega_m=75.4\\ \\text{rad/s}\\) بدل <b>24 rad/s</b>، و\\(T_m=434\\ \\text{Nm}\\) بدل <b>1362.5 Nm</b>. تحقق سريع: \\(\\omega_L=v/r=1/0.5=2\\ \\text{rad/s}\\) فـ \\(\\omega_m=12\\times2=24\\ \\text{rad/s}\\). (ب) طُبع \\(F=2943\\ \\text{N}\\) والصحيح 29430 N (السطر التالي يستعمل الصحيح). (جـ) في مقام التيار طُبع 0.95 ومعامل القدرة 0.85 (الناتج 73 A صحيح). (د) الرمز σ لنسبة التحويل لم يُعرَّف. قدرة الخرج 32700 W والتيار 73 A صحيحان. في الأمثلة المحلولة وفي المختبر مفتاح «كما في الكتاب / المصحح». (2) <b>مثال (2-5) ص 27</b>: جهد المحرك غير مذكور في نص المثال (فاصلتان متتاليتان «محرك تيار مستمر، ، كفاءته») بينما يستعمل الحل <span class="ltr">220 V</span> — أضفناه للنص. و\\(1115/220=5.07\\) كُتبت 5 A. (3) <b>مثال (2-3) ص 26</b>: وحدة التيار مكتوبة <b>W</b> والصحيح <b>A</b>؛ والكتاب يحسب بـ \\(\\pi=3.14\\) لذلك \\(P_L=11511\\ \\text{W}\\) (بالقيمة الدقيقة لـ π نحو 11517 W).'}
 ],
 lab:(el)=>{
  const st={ld:'rot',nm:1710,nL:1410,TL:78,Q:15,h:18,Qf:100,p:25,m:3,v:1,s:12,D:1,ec:78,em:75,pf:0.82,V:380,wm:'fixed'};let am=0,aL=0,rope=0;const did={};
  const PRE={ex23:{ld:'rot',nm:1710,nL:1410,TL:78,ec:78,em:75,pf:0.82,V:380},ex25:{ld:'pump',Q:15,h:18,ec:75,em:88,V:220},ex26:{ld:'fan',Qf:100,p:25,ec:65,em:85,pf:0.8,V:380},ex27:{ld:'winch',m:3,v:1,s:12,D:1,ec:90,em:80,pf:0.85,V:380},
   q25:{ld:'rot',nm:1700,nL:1500,TL:85,ec:75,em:85,pf:0.8,V:380},q27:{ld:'pump',Q:25,h:20,ec:65,em:85,V:400},q28:{ld:'fan',Qf:200,p:15,ec:75,em:80,pf:0.85,V:380},q210:{ld:'winch',m:5,v:1.5,s:10,D:1,ec:90,em:85,pf:0.8,V:380}};
  el.innerHTML=`<div class="grid ed-lab">
   <div class="panel c12"><h2>المحرك ووسيلة نقل الحركة والحمل <small>المعادلات (2-5) إلى (2-14) ص 22–24</small></h2>
    <div class="ed-row">${segHTML('ld',[['rot','حمل دوراني عبر صندوق تروس'],['pump','مضخة مياه'],['fan','مروحة تهوية'],['winch','ونش بصندوق تروس']],st.ld)}</div>
    <div class="ed-row"><span class="sub">أرقام الكتاب:</span><button class="btn" data-pre="ex23">مثال (2-3)</button><button class="btn" data-pre="ex25">مثال (2-5)</button><button class="btn" data-pre="ex26">مثال (2-6)</button><button class="btn" data-pre="ex27">مثال (2-7)</button><button class="btn" data-pre="q25">تمرين (2-5)</button><button class="btn" data-pre="q27">تمرين (2-7)</button><button class="btn" data-pre="q28">تمرين (2-8)</button><button class="btn" data-pre="q210">تمرين (2-10)</button></div>
    <div class="svgbox" id="l5sc" style="max-width:700px;margin-inline:auto"></div><p class="sub" id="l5cap"></p></div>
   <div class="panel c7"><h2>المدخلات</h2><div id="l5in"></div><div id="l5wm"></div></div>
   <div class="panel c5"><h2>النتائج</h2><div class="facts" id="l5fx"></div><div id="l5msg"></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l5st"></ol></div></div>`;
  B.math(el);const $=s=>el.querySelector(s);
  const IN={rot:[['nm','سرعة المحرك n<sub>m</sub>','rpm',100,3000,10],['nL','سرعة دوران الحمل n<sub>L</sub>','rpm',50,3000,10],['TL','عزم الحمل T<sub>L</sub>','Nm',1,200,1],['ec','كفاءة صندوق التروس η<sub>c</sub>','%',30,100,1]],
   pump:[['Q','معدل الضخ Q','m³/h',1,60,1],['h','الارتفاع h','m',1,60,1],['ec','كفاءة المضخة','%',30,100,1]],
   fan:[['Qf','معدل تدفق الهواء Q','m³/min',10,400,10],['p','ضغط الهواء p','N/m²',5,100,1],['ec','كفاءة المروحة','%',30,100,1]],
   winch:[['m','الثقل m','ton',0.5,10,0.5],['v','سرعة الرفع v','m/s',0.1,3,0.1],['s','نسبة تحويل صندوق التروس σ','',1,30,1],['D','قطر حداثة الونش D','m',0.2,2,0.1],['ec','كفاءة صندوق التروس η<sub>c</sub>','%',30,100,1]]};
  const COMMON=ld=>[['em','كفاءة المحرك η<sub>m</sub>','%',30,100,1]].concat(ld==='pump'?[]:[['pf','معامل القدرة cos θ','',0.5,1,0.01]]);
  const bindS=(id,k,u)=>{const r=$('#'+id),o=$('#'+id+'-v');o.textContent=fm(st[k])+' '+u;r.oninput=e=>{st[k]=+e.target.value;o.textContent=fm(st[k])+' '+u;if(k==='nm')did.nm=1;if(k==='h'&&st.h>=36)did.h=1;upd()}};
  const ui=()=>{segSet(el,'ld',st.ld);const list=IN[st.ld].concat(COMMON(st.ld));
   $('#l5in').innerHTML=list.map(([k,l,u,a,b,s])=>sl('l5'+k,l,a,b,s,st[k])).join('')+`<div class="ed-row"><span class="sub">الجهد${st.ld==='pump'?' (محرك تيار مستمر)':' (حثي ثلاثي الأوجه)'}:</span>${segHTML('V',[[220,'<span class="ltr">220 V</span>'],[380,'<span class="ltr">380 V</span>'],[400,'<span class="ltr">400 V</span>'],[3000,'<span class="ltr">3000 V</span>']],st.V)}</div>`;
   list.forEach(([k,,u])=>bindS('l5'+k,k,u));segBind($('#l5in'),'V',z=>{st.V=+z;upd()});
   $('#l5wm').innerHTML=st.ld==='winch'?`<div class="ed-row"><span class="sub">حساب سرعة الحداثة:</span>${segHTML('wm',[['book','كما في الكتاب'],['fixed','المصحح']],st.wm)}</div>`:'';
   if(st.ld==='winch')segBind($('#l5wm'),'wm',z=>{st.wm=z;did['w'+z]=1;upd()});
   upd()};
  segBind(el,'ld',z=>{st.ld=z;ui()});
  el.querySelectorAll('[data-pre]').forEach(b=>b.onclick=()=>{Object.assign(st,PRE[b.dataset.pre]);did[b.dataset.pre]=1;did.nm=0;did.h=0;ui()});
  let R={};
  const calc=()=>{const r={};const ac=st.ld!=='pump';
   if(st.ld==='rot'){r.wL=2*PI*st.nL/60;r.PL=st.TL*r.wL;r.wm=2*PI*st.nm/60;r.sig=st.nm/st.nL}
   else if(st.ld==='pump'){r.PL=st.Q/3600*1000*G*st.h}
   else if(st.ld==='fan'){r.PL=st.Qf/60*st.p}
   else{const F=st.m*1000*G;r.F=F;r.PL=F*st.v;r.nLc=60*st.v/(PI*st.D);r.nLb=60*st.v/st.D;r.nL=st.wm==='book'?r.nLb:r.nLc;r.nm=st.s*r.nL;r.wm=2*PI*r.nm/60;r.rope=PI*st.D*r.nL/60;r.wL=2*PI*r.nL/60}
   r.Pm=r.PL/(st.ec/100);r.Pin=r.Pm/(st.em/100);r.I=ac?r.Pin/(SQ3*st.V*st.pf):r.Pin/st.V;if(r.wm)r.Tm=r.Pm/r.wm;if(r.wL&&st.ld!=='pump'&&st.ld!=='fan')r.TLc=r.PL/r.wL;return r};
  const upd=()=>{R=calc();const r=R,L=[];
   if(st.ld==='rot')L.push(['ω<sub>L</sub> = 2πn<sub>L</sub>/60',lt(fm(r.wL,2)+' rad/s')],['نسبة التحويل σ = n<sub>m</sub>/n<sub>L</sub>',lt(fm(r.sig,3))]);
   if(st.ld==='winch')L.push(['القوة F = m·g',lt(fm(r.F,0)+' N')],['سرعة الحداثة n<sub>L</sub>',lt(fm(r.nL,1)+' rpm')],['سرعة المحرك n<sub>m</sub> = σ·n<sub>L</sub>',lt(fm(r.nm,1)+' rpm')]);
   L.push(['قدرة الحمل P<sub>L</sub>'+(st.ld==='rot'?' = T<sub>L</sub>·ω<sub>L</sub> (2-5)':st.ld==='pump'?' = Q·ρ·g·h (2-6)':st.ld==='fan'?' = Q·p (2-7)':' = F·v'),lt(fm(r.PL,1)+' W')],['قدرة خرج المحرك P<sub>m</sub>',lt(fm(r.Pm,1)+' W')]);
   if(r.wm)L.push(['ω<sub>m</sub> = 2πn<sub>m</sub>/60',lt(fm(r.wm,2)+' rad/s')],['عزم المحرك T<sub>m</sub> = P<sub>m</sub>/ω<sub>m</sub> (2-11)',lt(fm(r.Tm,1)+' Nm')]);
   if(r.TLc&&st.ld==='winch')L.push(['عزم الحداثة T<sub>L</sub> = F·D/2',lt(fm(r.F*st.D/2,0)+' Nm')]);
   L.push(['قدرة الدخل P<sub>in</sub>',lt(fm(r.Pin,1)+' W')],[st.ld==='pump'?'التيار I = P<sub>in</sub>/V':'تيار الخط I<sub>L</sub>',lt(fm(r.I,r.I<1?3:2)+' A')]);
   $('#l5fx').innerHTML=factsHTML(L);
   let msg='';if(st.ld==='winch'){if(st.wm==='book')msg=`<div class="callout err"><b>كما في الكتاب:</b> \\(n_L=60v/D\\) (سقطت π) فخرجت <span class="ltr">${fm(r.nLb,1)} rpm</span>. لو دارت الحداثة فعلاً بهذه السرعة لكانت سرعة الحبل \\(\\pi D n_L/60=${fm(r.rope,2)}\\ \\text{m/s}\\) لا <span class="ltr">${fm(st.v)} m/s</span> — تناقض يكشف الخطأ. والعزم الناتج أصغر من الصحيح بنحو π مرة.</div>`;
     else msg=`<div class="callout"><b>المصحح:</b> \\(n_L=60v/(\\pi D)=${fm(r.nLc,2)}\\ \\text{rpm}\\)، وتحقق: سرعة الحبل \\(\\pi D n_L/60=${fm(r.rope,2)}\\ \\text{m/s}\\) تساوي سرعة الرفع. وتحقق آخر من \\(\\omega_L=v/r=${fm(2*st.v/st.D,2)}\\ \\text{rad/s}\\) و \\(\\omega_m=\\sigma\\,\\omega_L=${fm(st.s*2*st.v/st.D,2)}\\ \\text{rad/s}\\).</div>`}
   else if(st.ld==='rot')msg=`<p class="sub">توضيح — ليس من الكتاب: الصندوق يكبّر العزم، فعزم الحمل \\(T_L=T_m\\,\\sigma\\,\\eta_c=${fm(r.Tm*r.sig*st.ec/100,1)}\\ \\text{Nm}\\). المختبر يستعمل π الدقيقة، فتختلف النتائج قليلاً عن الكتاب الذي يستعمل 3.14.</p>`;
   else msg='<p class="sub">المضخة والمروحة لا يعطي الكتاب سرعتهما، فالحساب بالقدرة فقط والدوران في الرسم للتوضيح.</p>';
   $('#l5msg').innerHTML=msg;B.math($('#l5msg'));
   $('#l5cap').innerHTML=st.ld==='rot'||st.ld==='winch'?'الترس الصغير على عمود المحرك والكبير على عمود الحمل: المحرك يدور أسرع σ مرة. الدوران في الرسم مبطأ.':'الدوران في الرسم للتوضيح فقط.';
   if(steps)steps.check()};
  let steps=null;
  steps=stepsUI($('#l5st'),[
   {t:'مثال (2-3): حمل دوراني',x:'اضغط «مثال (2-3)»: قدرة خرج المحرك نحو <span class="ltr">14.77 kW</span> وعزمه نحو <span class="ltr">82.5 Nm</span> وتياره نحو <span class="ltr">36.5 A</span> (الكتاب 14758 W و 82.4 Nm و 36.46 A بـ π = 3.14).',done:()=>did.ex23&&st.ld==='rot'},
   {t:'غيّر سرعة المحرك فقط',x:'حرّك سرعة المحرك n<sub>m</sub> والحمل كما هو: قدرة المحرك لا تتغير، لكن عزمه يتغير — المحرك الأسرع يحتاج عزماً أقل لنفس القدرة (2-11).',done:()=>did.ex23&&st.ld==='rot'&&did.nm},
   {t:'مثال (2-5): المضخة',x:'اضغط «مثال (2-5)» ثم ضاعف الارتفاع إلى <span class="ltr">36 m</span>: تتضاعف قدرة الحمل وقدرة المحرك وتياره، لأن \\(P_L\\) تتناسب طردياً مع h.',done:()=>did.ex25&&st.ld==='pump'&&did.h},
   {t:'مثال (2-6): مروحة التهوية',x:'اضغط «مثال (2-6)»: قدرة الحمل <span class="ltr">41.67 W</span> فقط، والقدرة المستفادة من المحرك <span class="ltr">64.1 W</span> وتياره <span class="ltr">0.14 A</span>.',done:()=>did.ex26&&st.ld==='fan'},
   {t:'مثال (2-7): الونش — الحل المصحح',x:'اضغط «مثال (2-7)» مع «المصحح»: \\(n_L=19.1\\ \\text{rpm}\\) و \\(n_m=229.2\\ \\text{rpm}\\) و \\(\\omega_m=24\\ \\text{rad/s}\\) و \\(T_m=1362.5\\ \\text{Nm}\\).',done:()=>did.ex27&&st.ld==='winch'&&st.wm==='fixed'},
   {t:'الونش كما في الكتاب',x:'بدّل إلى «كما في الكتاب»: \\(n_L=60\\ \\text{rpm}\\) و \\(T_m\\approx434\\ \\text{Nm}\\). اقرأ رسالة التحقق: بهذه السرعة يتحرك الحبل بنحو <span class="ltr">3.14 m/s</span> لا <span class="ltr">1 m/s</span>. قدرة المحرك وتياره لم يتغيرا لأن الخطأ في السرعة فقط.',done:()=>did.ex27&&st.ld==='winch'&&st.wm==='book'}
  ]);
  ui();
  loopOn(el,dt=>{const r=R,k=1/40;let nm=0,nL=0;if(st.ld==='rot'){nm=st.nm;nL=st.nL}else if(st.ld==='winch'){nm=r.nm;nL=r.nL}else{nm=nL=600}
   am+=2*PI*nm/60*dt*k;aL+=2*PI*nL/60*dt*k;rope+=(st.ld==='winch'?r.rope:0)*dt*0.5;
   $('#l5sc').innerHTML=driveSVG({kind:st.ld,mot:st.ld==='pump'?'DC':'3~',gear:st.ld==='rot'||st.ld==='winch',ratio:clamp(nm/Math.max(nL,1e-6),1,30),am,aL,rope,D:st.D})});
 },
 examples:[
  {title:'مثال (2-3)',ref:'ص 26',q:'<p>«محرك حثي ثلاثي الأوجه، <span class="ltr">380 V</span>، سرعته <span class="ltr">1710 rpm</span> يستعمل لتدوير حمل عزمه <span class="ltr">78 Nm</span> عند سرعة دوران <span class="ltr">1410 rpm</span>، إذا كانت كفاءة صندوق التروس <span class="ltr">78%</span>، وكفاءة المحرك <span class="ltr">75%</span>، ومعامل القدرة <span class="ltr">0.82</span> احسب: قدرة خرج المحرك، وعزم المحرك، وتيار المحرك.»</p>',
   given:GR(380,1710,78,1410,78,75,0.82),solve:solveRotG,note:'الحل بـ \\(\\pi=3.14\\) مثل الكتاب، لذلك \\(P_L=11511\\ \\text{W}\\). وحدة التيار في الكتاب مكتوبة W والصحيح A.'},
  {title:'مثال (2-5)',ref:'ص 27',q:'<p>«محرك تيار مستمر، <span class="ltr">220 V</span>، كفاءته <span class="ltr">88%</span>، يستخدم لتشغيل مضخة مياه كفاءتها <span class="ltr">75%</span>، لضخ الماء بمعدل <span class="ltr">15 m³/hr</span> إلى ارتفاع <span class="ltr">18 m</span>، احسب قدرة خرج المحرك و قدرة دخل المحرك و تيار المحرك علماً بأن كثافة الماء <span class="ltr">ρ = 1000 kg/m³</span>.»</p>',
   given:GP(220,88,75,15,18),solve:solvePump,note:'الجهد <span class="ltr">220 V</span> غير مذكور في نص المثال في الكتاب، ويستعمله الحل. التيار بالضبط \\(1115/220=5.07\\ \\text{A}\\) ويكتبه الكتاب 5 A.'},
  {title:'مثال (2-6)',ref:'ص 28',q:'<p>«محرك حثي ثلاثي الأوجه، <span class="ltr">380 V</span>، كفاءته <span class="ltr">85%</span>، ومعامل قدرته <span class="ltr">80%</span>، يستخدم لتدوير مروحة تهوية كفاءتها <span class="ltr">65%</span>، تقوم بضغط الهواء بمعدل <span class="ltr">100 m³/min</span>، بضغط <span class="ltr">25 N/m²</span>. احسب القدرة المستفادة من المحرك و التيار المسحوب من المصدر.»</p>',
   given:GF(380,85,0.8,65,100,25),solve:solveFan,note:'«القدرة المستفادة من المحرك» هي قدرة خرجه \\(P_m\\). التيار بالضبط 0.143 A.'},
  {title:'مثال (2-7) — الحل كما في الكتاب',ref:'ص 28–29',q:Q27,given:GW(380,80,0.85,3,1,12,90,1),solve:(g,B,isBook)=>solveWinch(g,B,isBook,true),
   note:'<b>ملاحظة على الكتاب:</b> بقيم الكتاب تعرض الحاسبة الأرقام المطبوعة كما هي (F = 2943، 0.95 في المقام، \\(n_L=60\\ \\text{rpm}\\)، \\(T_m=434\\ \\text{Nm}\\)) مع التنبيه على كل خطأ. إذا غيّرت أي رقم تحسب الحاسبة بالطريقة الصحيحة. قارن بالحل المصحح أسفل هذه الصفحة.'},
  {title:'مثال (2-7) — الحل المصحح',ref:'ص 28–29',q:'<p>نفس المثال بحساب صحيح لسرعة الحداثة (حساب مصحح — ليس من الكتاب).</p>',given:GW(380,80,0.85,3,1,12,90,1),solve:(g,B)=>solveWinch(g,B,false,false),
   note:'النتائج المصححة: \\(n_L=19.1\\ \\text{rpm}\\)، \\(n_m=229.2\\ \\text{rpm}\\)، \\(\\omega_m=24\\ \\text{rad/s}\\)، \\(T_m=1362.5\\ \\text{Nm}\\). قدرة الخرج 32700 W والتيار 73 A كما في الكتاب.'},
  {title:'تمرين (2-5) — حل مقترح (ليس من الكتاب)',ref:'ص 30',q:'<p>«محرك حثي ثلاثي الأوجه، <span class="ltr">380 V</span>، سرعته <span class="ltr">1700 rpm</span> يستعمل لتدوير حمل عزمه <span class="ltr">85 Nm</span> عند سرعة دوران <span class="ltr">1500 rpm</span>، إذا كانت كفاءة صندوق التروس <span class="ltr">75%</span>، وكفاءة المحرك <span class="ltr">85%</span>، ومعامل القدرة <span class="ltr">0.8</span> احسب: قدرة خرج المحرك، وعزم المحرك، وتيار المحرك.»</p>',given:GR(380,1700,85,1500,75,85,0.8),solve:(g,B)=>solveRotG(g,B,false),note:SUG},
  {title:'تمرين (2-7) — حل مقترح (ليس من الكتاب)',ref:'ص 30',q:'<p>«محرك تيار مستمر، <span class="ltr">400 V</span>، كفاءته <span class="ltr">85%</span>، يستخدم لتشغيل مضخة مياه كفاءتها <span class="ltr">65%</span>، لضخ الماء بمعدل <span class="ltr">25 m³/hr</span> إلى ارتفاع <span class="ltr">20 m</span>، احسب قدرة خرج المحرك و قدرة دخل المحرك و تيار المحرك.»</p>',given:GP(400,85,65,25,20),solve:(g,B)=>solvePump(g,B,false),note:SUG+' كثافة الماء 1000 kg/m³ كما في المثال (2-5).'},
  {title:'تمرين (2-8) — حل مقترح (ليس من الكتاب)',ref:'ص 30',q:'<p>«محرك حثي ثلاثي الأوجه، <span class="ltr">380 V</span>، كفاءته <span class="ltr">80%</span>، ومعامل قدرته <span class="ltr">85%</span>، يستخدم لتدوير مروحة تهوية كفاءتها <span class="ltr">75%</span>، تقوم بضغط الهواء بمعدل <span class="ltr">200 m³/min</span>، بضغط <span class="ltr">15 N/m²</span>. احسب القدرة المستفادة من المحرك و التيار المسحوب من المصدر.»</p>',given:GF(380,80,0.85,75,200,15),solve:(g,B)=>solveFan(g,B,false),note:SUG},
  {title:'تمرين (2-10) — حل مقترح (ليس من الكتاب)',ref:'ص 31',q:'<p>«محرك حثي ثلاثي الأوجه <span class="ltr">380 V</span> كفاءته <span class="ltr">85%</span> ومعامل قدرته <span class="ltr">0.8</span> متصل ميكانيكياً مع ونش لرفع ثقل مقداره <span class="ltr">5 ton</span> بسرعة مقدارها <span class="ltr">1.5 m/s</span>. إذا كانت نسبة تحويل صندوق التروس <span class="ltr">10</span> وكفاءته <span class="ltr">90%</span> وقطر حداثة الونش <span class="ltr">1 m</span>، احسب قدرة خرج المحرك وعزم المحرك والتيار المسحوب من المصدر.»</p>',given:GW(380,85,0.8,5,1.5,10,90,1),solve:(g,B)=>solveWinch(g,B,false,false),note:SUG+' بالطريقة المصححة للمثال (2-7).'}
 ],
 quiz:[
  {q:'القدرة اللازمة لتدوير حمل عزمه 50 Nm بسرعة زاوية 100 rad/s:',o:['0.5 W','150 W','5000 W','50 W'],c:2,e:'\\(P_L=T_L\\cdot\\omega_L\\) (المعادلة 2-5).'},
  {q:'في معادلة المضخات P<sub>L</sub> = Q·ρ·g·h يكون Q بوحدة:',o:['m³/h','m³/min','m³/s','L/s'],c:2,e:'جدول ص 23: (m³/s) — حوّل من الساعة بالقسمة على 3600.'},
  {q:'مروحة تدفق هوائها 60 m³/min بضغط 20 N/m². قدرة الحمل:',o:['20 W','1200 W','3 W','72000 W'],c:0,e:'\\(P_L=Q\\cdot p=(60/60)\\times20=20\\ \\text{W}\\) (المعادلة 2-7).'},
  {q:'العزم المقنن للمحرك يحسب من:',o:['T<sub>m</sub> = P<sub>m</sub>·ω<sub>m</sub>','T<sub>m</sub> = P<sub>m</sub>/ω<sub>m</sub>','T<sub>m</sub> = P<sub>in</sub>/V','T<sub>m</sub> = F/r'],c:1,e:'المعادلة (2-11).'},
  {q:'في المضخة تقوم كفاءة المضخة في الحل مقام:',o:['كفاءة المحرك','كفاءة وسيلة نقل الحركة η<sub>c</sub>','معامل القدرة','الكفاءة الكلية دائماً'],c:1,e:'في المثال (2-5): \\(P_m=P_L/\\eta_c\\) بكفاءة المضخة.'},
  {q:'حداثة ونش قطرها 1 m وسرعة الحبل 1 m/s. سرعة دوران الحداثة:',o:['60 rpm','19.1 rpm','1 rpm','188.5 rpm'],c:1,e:'\\(n_L=60v/(\\pi D)=60/\\pi\\approx19.1\\ \\text{rpm}\\). الكتاب كتب 60 rpm خطأً في المثال (2-7).'},
  {q:'صندوق تروس نسبة تحويله 12 والحداثة تدور 19.1 rpm. سرعة المحرك:',o:['1.6 rpm','19.1 rpm','229.2 rpm','720 rpm'],c:2,e:'\\(n_m=\\sigma\\,n_L=12\\times19.1=229.2\\ \\text{rpm}\\).'},
  {q:'إذا زادت سرعة المحرك مع بقاء قدرته ثابتة فإن عزمه:',o:['يزيد','يقل','لا يتغير','يصبح صفراً'],c:1,e:'\\(T_m=P_m/\\omega_m\\): العزم يتناسب عكسياً مع السرعة عند القدرة نفسها.'}
 ]
});

})(PLCBOOK);
