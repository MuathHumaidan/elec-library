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
  {err:'<b>ملاحظات على الكتاب:</b> (1) ص 12: ترقيم الفقرات يقفز من «هـ» إلى «ح» مباشرة (لا توجد «و» ولا «ز»)؛ أبقينا حروف الكتاب. (2) ص 12، جدول الرموز: وحدة الزمن مكتوبة <span class="ltr">S</span> بحرف كبير، والصحيح <span class="ltr">s</span> (الحرف الكبير S هو رمز المسافة في الجدول نفسه) — صُححت في الجدول أعلاه. (3) ص 8: «الحركة الخطية الدورانية» والمقصود «الخطية والدورانية»، و«وأداءه» والصحيح «وأدائه» — صُححتا في النص أعلاه. لا توجد أخطاء حسابية في هذا الدرس.'}
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
  {err:'<b>ملاحظات على الكتاب:</b> (1) ص 13: المعادلة (1-10) \\(T=F\\cdot r\\) لا تعرّف \\(r\\)، ولا يرد في جدول الرموز (ص 14) — المقصود نصف القطر (ذراع القوة). (2) جدول ص 14 لا يذكر التسارع الزاوي \\(\\alpha\\) ولا وحدته (rad/s²) — أضفناه في الجدول وعلّمناه. (3) جدول ص 14: الوحدتان مكتوبتان «Rpm» و«Rad» بحرف كبير، والمعتاد rpm و rad — صُححتا. (4) ص 14: يكتب الكتاب المسافة مرة \\(s\\) ومرة \\(S\\) في الاشتقاق نفسه، وهما الشيء نفسه. لا توجد أخطاء حسابية؛ المثال (1-1) محسوب بـ \\(\\pi=3.14\\).'}
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
