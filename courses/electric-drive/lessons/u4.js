/* Unit 4 — الخواص العامة لمحركات التحريك الكهربائي (ص 43–49)
   u4-l1 = الخواص العامة المطلوبة لمحركات التحريك (ص 43–46)
   u4-l2 = طرق الوقاية والتبريد (أنواع الأغلفة) + أسئلة الوحدة (ص 47–49)
   لا توجد في الوحدة أمثلة محلولة ولا أشكال. المساعدات منسوخة من u3.js (محلية لكل ملف). */
(function(B){
const {S}=B;
const PI=Math.PI,KT=60/(2*PI);
const fm=(x,d)=>B.fmtN(x,d);
const fx=v=>(+v).toFixed(1);
const lt=s=>`<span class="ltr">${s}</span>`;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));

/* ---------- styles used only by this course's unit 3–4 files (CSS variables only) ---------- */
(function css(){if(typeof document==='undefined'||document.getElementById('e34-css'))return;const s=document.createElement('style');s.id='e34-css';s.textContent=`
.e34-sl{display:flex;flex-direction:column;gap:2px;font-size:13.5px;margin-top:10px;min-width:0}
.e34-sl .e34-h{display:flex;justify-content:space-between;gap:8px;align-items:baseline}
.e34-sl b{font-family:var(--mono);direction:ltr;unicode-bidi:isolate;color:var(--blue-ink);font-size:14px}
.e34-sl input[type=range]{width:100%;accent-color:var(--blue);direction:ltr;margin:4px 0}
.e34-row{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;align-items:center}
.e34-row .sub{margin:0}
.e34-q{border:1px solid var(--line);border-radius:12px;padding:10px 14px;margin:10px 0;background:var(--surface)}
.e34-q summary{cursor:pointer;font-weight:600;line-height:1.7}
.e34-ans{margin-top:8px;border-inline-start:3px solid var(--blue);padding:6px 12px;background:var(--blue-soft);border-radius:0 10px 10px 0}
.e34-chip{display:inline-block;padding:2px 10px;border-radius:999px;font-size:12.5px;font-weight:700;background:var(--surface-2);color:var(--muted)}
.e34-chip.ok{background:var(--on-soft);color:var(--on)}
.e34-chip.ld{background:var(--blue-soft);color:var(--blue-ink)}
.e34-chip.warn{background:var(--stop-soft);color:var(--stop)}
.e34-chip.hot{background:var(--live-soft);color:var(--live)}
.e34-meters{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:8px;margin-top:10px}
.e34-meter{background:var(--surface-2);border:1px solid var(--line);border-radius:10px;padding:6px 8px;text-align:center;min-width:0}
.e34-meter span{display:block;font-size:12px;color:var(--muted)}
.e34-meter b{font:700 18px var(--mono);direction:ltr;unicode-bidi:isolate;display:inline-block}
.e34-try{margin:6px 0 0;padding-inline-start:20px}
.e34-lab .seg{flex-wrap:wrap;max-width:100%}
.e34-lab .seg button{white-space:nowrap}
.e34-figs{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px}
.e34-figs figure{margin:0;text-align:center;font-size:13px;color:var(--muted)}
.e34-tbl{overflow-x:auto}
.e34-tbl table.tt td,.e34-tbl table.tt th{padding:6px 6px}
.e34-tbl tr.cur td{background:var(--live-soft);font-weight:700}
.e34-msg{margin-top:10px}
.e34-msg:empty{display:none}
.e34-legend{display:flex;gap:12px;flex-wrap:wrap;font-size:12.5px;color:var(--muted);margin-top:6px}
.e34-legend i{display:inline-block;width:18px;height:0;border-top:3px solid;vertical-align:middle;margin-inline-end:4px}
.e34-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px;margin-top:10px}
.e34-cards .btn{text-align:start;white-space:normal;line-height:1.5}
.e34-cards .btn[aria-pressed="true"]{border-color:var(--blue);background:var(--blue-soft)}
.e34-cards .btn.good{border-color:var(--on);background:var(--on-soft)}
.e34-cards .btn.bad{border-color:var(--stop);background:var(--stop-soft)}
.e34-cards .btn.meh{border-color:var(--live);background:var(--live-soft)}
`;document.head.appendChild(s)})();

/* ---------- small helpers ---------- */
function loopOn(el,fn){let last=performance.now();const f=now=>{if(!document.body.contains(el))return;const dt=Math.min(0.05,Math.max(0,(now-last)/1000));last=now;try{fn(dt)}catch(e){console.error(e);return}requestAnimationFrame(f)};requestAnimationFrame(f)}
function stepsUI(host,steps){let i=0;
  const draw=()=>{host.innerHTML=steps.map((s,j)=>`<li class="${j<i?'done':j===i?'cur':''}"><span class="k">${j<i?'✓':j+1}</span><div><h4>${s.t}</h4><p>${s.x}</p>${j===i?`<div class="act">${s.done?'<span class="hint">بانتظار تنفيذك…</span> <button class="btn" data-next>تخطَّ</button>':'<button class="btn primary" data-next>التالي</button>'}</div>`:''}</div></li>`).join('')+
    (i>=steps.length?`<li class="cur"><span class="k">✓</span><div><h4>أحسنت، أنهيت المهام</h4><p style="display:block">جرّب قيماً أخرى، أو أعد المهام من أولها.</p><div class="act"><button class="btn" data-restart>إعادة</button></div></div></li>`:'');B.math(host)};
  host.addEventListener('click',e=>{if(e.target.closest('[data-next]')){i++;draw()}if(e.target.closest('[data-restart]')){i=0;draw()}});draw();
  return {check(){const s=steps[i];if(s&&s.done&&s.done()){i++;draw()}},redraw:draw,get i(){return i}};}
const sl=(id,label,min,max,step,val)=>`<label class="e34-sl"><span class="e34-h"><span>${label}</span><b id="${id}-v"></b></span><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}" aria-label="${label.replace(/<[^>]+>/g,'')}"></label>`;
const segHTML=(attr,items,cur)=>`<div class="seg" role="group">${items.map(([v,l])=>`<button data-${attr}="${v}" aria-pressed="${String(v)===String(cur)}">${l}</button>`).join('')}</div>`;
const segSet=(el,attr,v)=>el.querySelectorAll(`[data-${attr}]`).forEach(b=>b.setAttribute('aria-pressed',String(String(b.dataset[attr])===String(v))));
const segBind=(el,attr,fn)=>el.querySelectorAll(`[data-${attr}]`).forEach(b=>b.addEventListener('click',()=>{segSet(el,attr,b.dataset[attr]);fn(b.dataset[attr])}));
const meter=(l,id)=>`<div class="e34-meter"><span>${l}</span><b id="${id}">—</b></div>`;
const arT=(x,y,s,o)=>{o=o||{};return `<text class="txt ar" x="${x}" y="${y}" text-anchor="${o.a||'middle'}"${o.fs?` font-size="${o.fs}"`:''}${o.col?` style="fill:var(${o.col})"`:''}>${s}</text>`};
const box=(svg,max)=>`<div class="svgbox" style="margin-inline:auto;${max?`max-width:${max}px`:''}">${svg}</div>`;
/* يثبّت اتجاه أرقام الأشكال مثل (3-1a) داخل النص العربي */
const fixR=t=>String(t).replace(/(^|[^\w>])\((\d+-\d+[a-z]?)\)/g,'$1<span class="ltr">($2)</span>');
const lesson=L=>{(L.theory||[]).forEach(b=>{['html','note','err','caption'].forEach(k=>{if(typeof b[k]==='string')b[k]=fixR(b[k])});if(b.fig)b.fig=lt(b.fig)});B.lesson(L)};
const Q=(n,q,ans)=>`<details class="e34-q"><summary>${lt(n)}: ${q}</summary><div class="e34-ans"><b>إجابة مقترحة (ليست من الكتاب):</b> ${ans}</div></details>`;
const niceMax=t=>{t=Math.max(t,1e-6);const e=Math.pow(10,Math.floor(Math.log10(t)));return [1,1.5,2,2.5,3,4,5,6,8,10].map(k=>k*e).find(v=>v>=t*0.999)};
const ticks=(mx,n)=>{const r=[];for(let i=0;i<=n;i++)r.push(mx*i/n);return r};
let CLIP=0;
/* x-y plot. o:{w,h,x0,x1,y0,y1,xt,yt,xl,yl,xf,yf,series:[{pts,col,w,dash}],dots:[{x,y,col,r,ring,lbl}],hl:[{v,col,dash}],vl:[{v,col,dash}],bands:[{x0,x1,col}],extra(X,Y)} */
function plot(o){const W=o.w||300,H=o.h||210,L=o.left||44,R=o.right||10,T=12,Bm=34,id='e34c'+(++CLIP);
  const X=x=>L+(x-o.x0)/(o.x1-o.x0)*(W-L-R),Y=y=>H-Bm-(y-o.y0)/(o.y1-o.y0)*(H-T-Bm);
  let s='';
  (o.bands||[]).forEach(b=>{s+=`<rect x="${fx(Math.min(X(b.x0),X(b.x1)))}" y="${T}" width="${fx(Math.abs(X(b.x1)-X(b.x0)))}" height="${H-T-Bm}" fill="var(${b.col})" opacity="${b.op||0.55}"/>`});
  (o.yt||[]).forEach(v=>{s+=`<path d="M${L} ${fx(Y(v))}H${W-R}" stroke="var(--line)"/>`+S.t(L-5,fx(Y(v)+4),o.yf?o.yf(v):fm(v),'m','end')});
  (o.xt||[]).forEach(v=>{s+=`<path d="M${fx(X(v))} ${T}V${H-Bm}" stroke="var(--line)" stroke-dasharray="3 3"/>`+S.t(fx(X(v)),H-Bm+14,o.xf?o.xf(v):fm(v),'m')});
  s+=`<path d="M${L} ${T}V${H-Bm}H${W-R}" stroke="var(--fg)" fill="none" stroke-width="1.4"/>`;
  if(o.xl)s+=S.t(W-R,H-3,o.xl,'','end');if(o.yl)s+=S.t(L+4,T+10,o.yl,'','start');
  let g='';
  (o.hl||[]).forEach(h=>{g+=`<path d="M${L} ${fx(Y(h.v))}H${W-R}" stroke="var(${h.col||'--muted'})" stroke-width="1.4" stroke-dasharray="${h.dash||'5 4'}"/>`+(h.lbl?S.t(W-R-3,fx(Y(h.v)-4),h.lbl,'m','end'):'')});
  (o.vl||[]).forEach(h=>{g+=`<path d="M${fx(X(h.v))} ${T}V${H-Bm}" stroke="var(${h.col||'--muted'})" stroke-width="1.4" stroke-dasharray="${h.dash||'5 4'}"/>`+(h.lbl?S.t(fx(X(h.v)+3),T+22,h.lbl,'m','start'):'')});
  (o.series||[]).forEach(se=>{const P=se.pts.filter(p=>isFinite(p[0])&&isFinite(p[1]));if(P.length<2)return;g+=`<path d="${P.map((p,i)=>(i?'L':'M')+fx(X(p[0]))+' '+fx(Y(clamp(p[1],o.y0-(o.y1-o.y0),o.y1+(o.y1-o.y0))))).join('')}" fill="none" stroke="var(${se.col})" stroke-width="${se.w||2.4}" ${se.dash?`stroke-dasharray="${se.dash}"`:''} stroke-linejoin="round" ${se.op?`opacity="${se.op}"`:''}/>`});
  (o.dots||[]).forEach(d=>{if(!isFinite(d.x)||!isFinite(d.y))return;const cx=X(d.x),cy=Y(d.y);if(cy<T-2||cy>H-Bm+2||cx<L-2||cx>W-R+2)return;g+=d.ring?`<circle cx="${fx(cx)}" cy="${fx(cy)}" r="${d.r||7}" fill="none" stroke="var(${d.col||'--live'})" stroke-width="2.6"/>`:`<circle cx="${fx(cx)}" cy="${fx(cy)}" r="${d.r||4}" fill="var(${d.col||'--fg'})"/>`;if(d.lbl)g+=S.t(fx(cx+(d.dx||-8)),fx(cy+(d.dy||-8)),d.lbl,'',d.a||'end')});
  s+=`<g clip-path="url(#${id})">${g}</g>`;
  if(o.extra)s+=o.extra(X,Y);
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${o.aria||'منحنى'}"><defs><clipPath id="${id}"><rect x="${L-8}" y="${T-8}" width="${W-L-R+16}" height="${H-T-Bm+16}"/></clipPath></defs>${s}</svg>`}

/* =====================================================================
   Lesson 1 — الخواص العامة المطلوبة لمحركات التحريك (ص 43–46)
   مختبر: (أ) قوى الجر في مراحل الحركة — بأرقام التمرين 5-4 من الكتاب ومعادلات الوحدة الخامسة
          (ب) محرك جر توالٍ: بدء الحركة، تغير الحمل، الانقطاع المؤقت، الارتفاع المفاجئ في الجهد (أرقام توضيحية)
   ===================================================================== */
const G=9.81;
const PHASES=[['start','بدء الحركة والتسارع (أرض مستوية)',1,1,0],['free','الانطلاق الحر بسرعة منتظمة',0,1,0],['up','صعود مرتفع بسرعة منتظمة',0,1,1],['startUp','بدء الحركة على مرتفع',1,1,1]];
function forceBars(v,cur){const m=v.m*1000,Fa=m*v.a,Fr=m*v.r,Fg=m*G*v.sn;const rows=PHASES.map(([k,l,ia,ir,ig])=>({k,l,Fa:ia*Fa,Fr:ir*Fr,Fg:ig*Fg}));
  const mx=niceMax(Math.max(...rows.map(r=>r.Fa+r.Fr+r.Fg))/1000);const W=560,L=10,R=70,rowH=58;const X=f=>L+f/1000/mx*(W-L-R);
  let s=`<svg viewBox="0 0 ${W} ${rows.length*rowH+34}" role="img" aria-label="قوة الجر اللازمة في كل مرحلة">`;
  ticks(mx,4).forEach(t=>{s+=`<path d="M${fx(X(t*1000))} 4V${rows.length*rowH+12}" stroke="var(--line)" stroke-dasharray="3 3"/>`+S.t(fx(X(t*1000)),rows.length*rowH+26,fm(t),'m')});
  s+=S.t(W-4,rows.length*rowH+26,'kN','m','end');
  rows.forEach((r,i)=>{const y=22+i*rowH;let x=L;s+=`<text class="txt ar" x="${W-6}" y="${y-5}" text-anchor="start" font-size="12"${r.k===cur?' font-weight="700"':' style="fill:var(--muted)"'}>${r.l}</text>`;const seg=(f,col)=>{if(f<=0)return '';const w=X(f)-L;const o=`<rect x="${fx(x)}" y="${y}" width="${fx(w)}" height="24" fill="var(${col})" opacity="${r.k===cur?1:0.45}"/>`;x+=w;return o};
    s+=seg(r.Fa,'--live')+seg(r.Fr,'--blue')+seg(r.Fg,'--stop');const tot=r.Fa+r.Fr+r.Fg;s+=S.t(fx(x+6),y+17,fm(tot/1000,1),'','start');
    if(r.k===cur)s+=`<rect x="${L-4}" y="${y-4}" width="${fx(x-L+8)}" height="32" fill="none" stroke="var(--fg)" stroke-width="1.6" rx="4"/>`});
  return {svg:s+'</svg>',rows,Fa,Fr,Fg}}

const TR_TP=[
  {k:'V',label:'جهد شبكة الجر V',unit:'V',value:600,min:50,max:5000,step:10},
  {k:'R',label:'مقاومة المنتج وملف التوالي معاً',unit:'Ω',value:0.3,min:0.01,max:50,step:0.01},
  {k:'c',label:'ثابت المجال قبل التشبع: kφ لكل 1 A من تيار المنتج',unit:'V/(rpm·A)',value:0.0025,min:0.00001,max:1,step:0.0001},
  {k:'Is',label:'تيار المنتج الذي يبدأ عنده التشبع',unit:'A',value:150,min:1,max:20000,step:1},
  {k:'IaN',label:'تيار المنتج المقنن',unit:'A',value:200,min:1,max:20000,step:1},
  {k:'pFree',label:'حمل الانطلاق الحر (نسبة من العزم المقنن)',unit:'%',value:40,min:5,max:150,step:1},
  {k:'pUp',label:'حمل صعود المرتفع (نسبة من العزم المقنن)',unit:'%',value:100,min:5,max:250,step:1},
  {k:'kSt',label:'تيار البدء الذي يسمح به جهاز البدء (مضاعف التيار المقنن)',unit:'×',value:1.5,min:1,max:5,step:0.1},
  {k:'surge',label:'مقدار الارتفاع المفاجئ في الجهد',unit:'%',value:20,min:1,max:100,step:1},
  {k:'tauF',label:'ثابت زمن بناء المجال واختفائه في ملف التوالي',unit:'s',value:0.3,min:0.02,max:5,step:0.01,hint:'بعد انقطاع التيار يختفي المجال تدريجياً بهذا الزمن، وبعد عودته يُبنى بالزمن نفسه'},
  {k:'tau',label:'ثابت زمن التسارع (يكبر مع ثقل العضو الدوار والقطار)',unit:'s',value:4,min:0.2,max:120,step:0.1,hint:'الزمن الذي يصل فيه المحرك من السكون إلى سرعته المقننة لو أثّر عليه عزم صافٍ يساوي العزم المقنن'}];

lesson({
 id:'u4-l1',unit:4,order:1,pages:'43–46',
 title:'الخواص العامة المطلوبة لمحركات التحريك',
 summary:'ظروف تشغيل محرك التحريك قاسية، لذلك يُطلب منه ثماني خواص: عزم كبير عند البدء، وخصائص محرك التوالي، وبساطة التحكم في السرعة، وقابلية الفرملة الكهربائية، وتحمل الارتفاع المفاجئ في الجهد، وتحمل الانقطاع المؤقت للمصدر، والصلابة، وصغر الوزن والحجم.',
 theory:[
  {h:'الوحدة الرابعة: الخواص العامة لمحركات التحريك الكهربائي',ref:'ص 43–44',html:`<p><b>الهدف العام للوحدة:</b> معرفة الخواص العامة المطلوبة، وطرق الوقاية من الجو المحيط، للمحركات الكهربائية.</p>
   <p><b>الأهداف التفصيلية:</b></p><ul><li>أن يعرف المتدرب الخواص الكهربائية والميكانيكية للمحركات الكهربائية.</li><li>أن يعرف المتدرب تركيب المحركات الكهربائية لحمايتها من ظروف الجو المحيط.</li><li>أن يعرف المتدرب طرق التبريد المختلفة للمحركات الكهربائية.</li></ul>`},
  {h:'مقدمة',ref:'ص 45',html:`<p>محركات التيار المستمر توصيلة التوالي والمركب تستخدم في نظم التحريك الكهربائي التي يستعمل فيها التيار المستمر، بينما يستخدم محرك التوالي العام والمحرك الحثي ثلاثي الأوجه في شبكات التحريك للتيار المتردد. ظروف التشغيل تكون دائماً <b>قاسية جداً</b>، لذلك يجب أن يخضع محرك التحريك لشروط صارمة عند التصميم، بحيث يكون المحرك ذا صلابة عالية ويكون من النوع المغلق، لحمايته من الأتربة والغبار والأمطار والأجسام الغريبة.</p>`},
  {h:'الخواص العامة لمحركات التحريك',ref:'ص 45–46',html:`<p>الخواص الكهربائية والميكانيكية العامة المطلوبة لمحركات التحريك هي:</p>
   <ol>
   <li><b>عزم كبير أثناء بدء الحركة:</b> أثناء بدء الحركة والتسارع تحتاج القاطرة الكهربائية لقوة تحريك كبيرة للحصول على التسارع المطلوب بالإضافة إلى قوة التحريك اللازمة للتغلب على مقاومة حركة القطار، بينما يكون المطلوب أثناء فترة الانطلاق الحر بسرعة منتظمة هو قوة التحريك اللازمة للتغلب على المقاومة لحركة القطار فقط. أثناء صعود المرتفعات تلزم قوة جر إضافية للتغلب على تأثير الجاذبية الأرضية بالإضافة إلى القوى سابقة الذكر. ولابد أن يبذل المحرك عزماً كبيراً أثناء فترة البدء للحصول على قوة التحريك الكبيرة المطلوبة أثناء بدء الحركة.</li>
   <li><b>أن تكون لها خصائص محركات التوالي:</b> من المرغوب فيه أن تكون العلاقة بين السرعة والعزم في محركات التحريك كما هي في محركات التوالي للتيار المستمر.</li>
   <li><b>بساطة التحكم في سرعة المحرك:</b> يجب أن تكون الطرق المستخدمة للتحكم في محركات التحريك سهلة التنفيذ.</li>
   <li><b>قابليتها للتعديل لاستخدام الفرامل الكهربائية:</b> يجب أن تكون محركات التحريك قابلة لتطبيق الطرق المختلفة للفرامل الكهربائية عليها بسهولة، مثل الفرامل الديناميكية والفرامل بإعادة التوليد والفرامل باستخدام التيار المعكوس أو التبديل.</li>
   <li><b>قابليتها لتحمل الارتفاع المفاجئ في الجهد:</b> يحدث في بعض الأحيان ارتفاع مفاجئ في الجهد، بسبب عمل أحد قواطع التيار لإزالة خطأ ما بشبكة التحريك. هذا الارتفاع المفاجئ يسبب زيادة مفاجئة في التيار، يجب على المحرك أن يتحملها دون إحداث أي ضرر به. <span class="ref">ص 46</span></li>
   <li><b>تحمل الانقطاع المؤقت لمصدر الجهد:</b> الانقطاع المؤقت لمصدر الجهد قد يحدث عند تقاطع الطرق والانتقال من شبكة جر إلى أخرى. عند إعادة جهد المصدر، ربما تكون القوة الدافعة الكهربائية العكسية قد انخفضت كثيراً عن قيمتها الأولى، مما يتسبب في مرور تيار كبير في المحرك.</li>
   <li><b>الصلابة:</b> يجب أن تكون محركات التحريك صلبة في هيكلها الخارجي وتركيبها الداخلي، لتتحمل عزم التحريك الكبير كما تتحمل الاهتزاز والارتجاج الذي تتعرض لهما أثناء حركة القطار.</li>
   <li><b>وزن وحجم المحرك:</b> يجب إنقاص وزن محرك التحريك بقدر الإمكان لسهولة تثبيته مع دواليب الحركة، وللتوفير في الطاقة المستهلكة. يجب أيضاً الحرص على الإنقاص من حجم محرك التحريك بسبب محدودية وضيق المكان المخصص لتثبيته.</li></ol>`},
  {html:`<div class="e34-tbl"><table class="tt"><thead><tr><th>الخاصية</th><th>لماذا تُطلب؟</th><th>أين تراها في هذا المقرر</th></tr></thead><tbody>
   <tr><td>1. عزم بدء كبير</td><td>البدء والتسارع والصعود تحتاج أكبر قوة جر</td><td>المختبر (أ)، والوحدة الخامسة</td></tr>
   <tr><td>2. خصائص التوالي</td><td>المحرك يخفض سرعته ويرفع عزمه بنفسه مع الحمل</td><td>الدرس <span class="ltr">3.1</span>، والمختبر (ب)</td></tr>
   <tr><td>3. بساطة التحكم في السرعة</td><td>تغيير السرعة كثير في القطار</td><td>—</td></tr>
   <tr><td>4. الفرامل الكهربائية</td><td>الوقوف المتكرر والنزول من المرتفعات</td><td>الوحدة السادسة</td></tr>
   <tr><td>5. تحمل الارتفاع المفاجئ في الجهد</td><td>عمل القواطع في الشبكة يرفع الجهد فجأة فيزيد التيار</td><td>المختبر (ب)</td></tr>
   <tr><td>6. تحمل الانقطاع المؤقت</td><td>عند عودة الجهد يكون الجهد العكسي قد انخفض فيمر تيار كبير</td><td>المختبر (ب)</td></tr>
   <tr><td>7. الصلابة</td><td>العزم الكبير والاهتزاز والارتجاج</td><td>—</td></tr>
   <tr><td>8. وزن وحجم صغيران</td><td>سهولة التثبيت مع الدواليب، توفير الطاقة، ضيق المكان</td><td>—</td></tr></tbody></table></div><p class="sub">توضيح للمتدرب — ليس من الكتاب: جدول يلخص ص 45–46.</p>`},
  {note:String.raw`<b>توضيح للمتدرب — ليس من الكتاب:</b> لماذا ينخفض الجهد العكسي كثيراً أثناء الانقطاع (البند 6)؟ الجهد العكسي \(E\propto\phi\,n\). أثناء الانقطاع تنخفض السرعة قليلاً، وفي محرك التوالي بالذات <b>يختفي المجال</b> لأن تيار المجال هو تيار المنتج نفسه وقد انقطع. فعند عودة الجهد يكون \(E\) صغيراً جداً، والتيار \(I_a=(V-E)/R\) لا يحده إلا مقاومة صغيرة، فيقفز إلى قيمة كبيرة حتى يُبنى المجال من جديد. وفي البند 5: السرعة لا تتغير لحظياً فيبقى \(E\) كما هو، وأي زيادة \(\Delta V\) في الجهد تزيد التيار فوراً بمقدار \(\Delta V/R\).`},
  {err:'المقدمة (ص 45) تقول «النوع المغلق»، وتصنيف الأغلفة (ص 47–48) يقول «المقفل»؛ المعنى واحد.'}
 ],
 lab:(el)=>{
  const f={m:240,a:0.5556,r:0.05,sn:0.01,ph:'startUp'};const did={};
  const s={run:false,n:0,I:0,Il:0,Va:0,starting:false,phase:'free',off:0,surgeT:0,dur:1,t:0,hist:[],peak:0,peakEv:'',evT:-1,ev:null,ang:0};
  el.innerHTML=`<div class="grid e34-lab">
   <div class="panel c12"><h2>(أ) قوة الجر اللازمة في كل مرحلة <small>البند 1 ص 45 — المعادلات <span class="ltr">(5-1)</span> إلى <span class="ltr">(5-5)</span> من الوحدة الخامسة ص 55–56، والأرقام الافتراضية من التمرين <span class="ltr">5-4</span> ص 64</small></h2>
    <div class="grid" style="margin-top:0"><div class="c7"><div id="fbar" class="svgbox"></div>
     <div class="e34-legend"><span><i style="border-color:var(--live)"></i>قوة التسارع <span class="ltr">F<sub>a</sub> = m·a</span></span><span><i style="border-color:var(--blue)"></i>مقاومة الحركة <span class="ltr">F<sub>r</sub> = m·r</span></span><span><i style="border-color:var(--stop)"></i>الجاذبية <span class="ltr">F<sub>g</sub> = m·g·sinθ</span></span></div>
     <div class="e34-row">${segHTML('fph',PHASES.map(p=>[p[0],p[1]]),f.ph)}</div></div>
    <div class="c5">${sl('fm','كتلة القطار m (طن)',20,1000,1,f.m)}${sl('fa','التسارع a (m/s²)',0,1.5,0.0001,f.a)}${sl('fr','المقاومة النوعية لحركة القطار r (N/kg)',0,0.2,0.005,f.r)}${sl('fs','الميل sinθ (مثل 1:100 = 0.01)',0,0.06,0.001,f.sn)}
     <div class="e34-meters">${meter('F<sub>a</sub>','fFa')}${meter('F<sub>r</sub>','fFr')}${meter('F<sub>g</sub>','fFg')}${meter('F<sub>t</sub> في المرحلة المختارة','fFt')}</div></div></div>
    <p class="sub" id="ftx"></p></div>
   <div class="c12" id="trtp"></div>
   <div class="panel c5"><h2>(ب) محرك جر توالٍ <small>البنود 1 و2 و5 و6 — <span id="trchip" class="e34-chip"></span></small></h2>
    <div class="e34-row"><button class="btn primary" id="trgo">بدء الحركة</button><button class="btn" id="trst">إيقاف</button></div>
    <div class="e34-row">${segHTML('tph',[['free','انطلاق حر'],['up','صعود مرتفع']],s.phase)}</div>
    ${sl('trd','مدة الانقطاع المؤقت',0.2,3,0.1,s.dur)}
    <div class="e34-row"><button class="btn" id="troff">انقطاع مؤقت للمصدر</button><button class="btn" id="trsg">ارتفاع مفاجئ في الجهد</button></div>
    <div class="e34-meters">${meter('جهد المحرك','trV')}${meter('التيار I<sub>a</sub>','trI')}${meter('المجال kφ','trk')}${meter('الجهد العكسي E','trE')}${meter('السرعة n','trn')}${meter('العزم T','trT')}</div>
    <div class="e34-meters">${meter('أعلى تيار في آخر حدث','trpk')}${meter('مضاعف التيار المقنن','trpx')}</div>
    <div id="trmsg" class="e34-msg"></div></div>
   <div class="panel c7"><h2>التيار والسرعة مع الزمن <small>آخر 20 ثانية — الخط الأحمر = التيار المقنن</small></h2><div id="trgI" class="svgbox"></div><div id="trgN" class="svgbox"></div>
    <p class="sub">أرقام توضيحية. التيار هنا لا يحده إلا مقاومة الملفات (أهملنا محاثة المنتج)، لذلك تظهر القفزات حادة؛ في الواقع تكون أنعم قليلاً لكنها كبيرة أيضاً. عند بدء الحركة يحد جهاز البدء التيار (البند 1: عزم كبير بتيار محدود).</p></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="trsteps"></ol></div></div>`;
  const $=q=>el.querySelector(q);
  /* (أ) */
  const fdraw=()=>{const R=forceBars(f,f.ph);$('#fbar').innerHTML=R.svg;const row=R.rows.find(r=>r.k===f.ph),Ft=row.Fa+row.Fr+row.Fg;
   $('#fFa').textContent=fm(R.Fa,0)+' N';$('#fFr').textContent=fm(R.Fr,0)+' N';$('#fFg').textContent=fm(R.Fg,0)+' N';$('#fFt').textContent=fm(Ft,0)+' N';
   $('#fm-v').textContent=fm(f.m,0)+' t';$('#fa-v').textContent=fm(f.a,4);$('#fr-v').textContent=fm(f.r,3);$('#fs-v').textContent=fm(f.sn,3);
   const free=R.rows[1].Fa+R.rows[1].Fr+R.rows[1].Fg;$('#ftx').innerHTML=`بدء الحركة على المرتفع يحتاج ${lt(fm((R.Fa+R.Fr+R.Fg)/Math.max(free,1e-9),1)+' ×')} قوة الانطلاق الحر — لذلك يجب أن يبذل محرك التحريك عزماً كبيراً عند البدء (ص 45). بأرقام التمرين <span class="ltr">5-4</span>: ${lt('F<sub>a</sub> ≈ 133333 N')}، ${lt('F<sub>r</sub> = 12000 N')}، ${lt('F<sub>g</sub> = 23544 N')}.`;
   if(f.ph==='free')did.fFree=1;if(f.ph==='startUp')did.fSU=1};
  segBind(el,'fph',v=>{f.ph=v;fdraw()});
  [['fm','m'],['fa','a'],['fr','r'],['fs','sn']].forEach(([id,k])=>$('#'+id).oninput=e=>{f[k]=+e.target.value;fdraw()});fdraw();
  /* (ب) */
  let TN,nN,J;
  const kp=I=>{const v=TP.v;return v.c*Math.min(Math.max(I,0),v.Is)};
  const Tq=(I,Il)=>KT*kp(Il)*I;
  const recompute=()=>{const v=TP.v;TN=KT*kp(v.IaN)*v.IaN;nN=(v.V-v.IaN*v.R)/Math.max(kp(v.IaN),1e-9);J=TN*v.tau/Math.max(nN,1)};
  const TP=B.params($('#trtp'),'u4-l1',TR_TP,()=>{recompute();steps.redraw()});recompute();
  const TL=()=>{const v=TP.v;return (s.phase==='up'?v.pUp:v.pFree)/100*TN};
  /* السرعة المستقرة للحمل الحالي (للمهام) */
  const nSteady=()=>{const v=TP.v,a=KT*v.c,Tt=TL();const I=Tt<=a*v.Is*v.Is?Math.sqrt(Tt/a):Tt/(a*v.Is);return Math.max(0,(v.V-I*v.R)/Math.max(kp(I),1e-9))};
  const setMsg=(h,k)=>{$('#trmsg').innerHTML=h?`<div class="callout${k==='err'?' err':''}">${h}</div>`:''};
  const event=(name)=>{s.ev=name;s.peak=0;s.evT=s.t};
  $('#trgo').onclick=()=>{if(s.run&&!s.starting){setMsg('القطار يتحرك فعلاً.','');return}s.run=true;s.starting=true;s.n=0;s.Il=0;event('start');setMsg('','')};
  $('#trst').onclick=()=>{s.run=false;s.starting=false;s.off=0;setMsg('','')};
  segBind(el,'tph',v=>{s.phase=v;s.phT=s.t});
  $('#trd').oninput=e=>{s.dur=+e.target.value};
  $('#troff').onclick=()=>{if(!s.run||s.starting){setMsg('ابدأ الحركة أولاً وانتظر حتى تستقر السرعة.','err');return}s.off=s.dur;event('off');s.evDur=s.dur;s.nBefore=s.n};
  $('#trsg').onclick=()=>{if(!s.run||s.starting){setMsg('ابدأ الحركة أولاً وانتظر حتى تستقر السرعة.','err');return}s.surgeT=0.4;event('surge')};
  const settled=()=>s.run&&!s.starting&&s.off<=0&&Math.abs(s.n-nSteady())<0.04*nSteady()+2;
  const steps=stepsUI($('#trsteps'),[
   {t:'(أ) الانطلاق الحر',x:'في اللوحة (أ) اختر «الانطلاق الحر بسرعة منتظمة»: تبقى مقاومة الحركة وحدها (الأزرق).',done:()=>did.fFree},
   {t:'(أ) البدء على مرتفع',x:'اختر «بدء الحركة على مرتفع»: تجتمع القوى الثلاث، وهي أكبر قوة جر لازمة (ص 45).',done:()=>did.fSU},
   {t:'(ب) بدء الحركة',get x(){return `اضغط «بدء الحركة» وحمل «انطلاق حر»: يحد جهاز البدء التيار عند نحو ${lt(fm(TP.v.kSt*TP.v.IaN,0)+' A')} والمحرك يعطي عزماً كبيراً فيتسارع، ثم تستقر السرعة عند نحو ${lt(fm(nSteady(),0)+' rpm')}.`},done:()=>s.phase==='free'&&settled()},
   {t:'(ب) صعود مرتفع',x:'اختر «صعود مرتفع»: تنخفض السرعة من تلقاء نفسها ويزيد التيار والعزم — هذه خاصية محرك التوالي المطلوبة (البند 2).',done:()=>s.phase==='up'&&settled()},
   {t:'(ب) انقطاع مؤقت',get x(){return `اضغط «انقطاع مؤقت للمصدر»: أثناء الانقطاع يختفي المجال وتنخفض السرعة قليلاً، وعند عودة الجهد يقفز التيار إلى عدة أضعاف المقنن (${lt(fm(TP.v.IaN,0)+' A')}) قبل أن يُبنى المجال (البند 6).`},done:()=>did.offDone},
   {t:'(ب) انقطاع أطول',x:'اجعل مدة الانقطاع <span class="ltr">2 s</span> أو أكثر وكرّر: قارن أعلى تيار هذه المرة.',done:()=>did.offLong},
   {t:'(ب) ارتفاع مفاجئ في الجهد',get x(){return `اضغط «ارتفاع مفاجئ في الجهد» (${lt('+'+fm(TP.v.surge,0)+' %')}): السرعة لا تتغير لحظياً فيبقى الجهد العكسي كما هو، فيزيد التيار فوراً بمقدار ${lt('ΔV ÷ R ≈ '+fm(TP.v.V*TP.v.surge/100/TP.v.R,0)+' A')} (البند 5).`},done:()=>did.surgeDone}
  ]);
  const plotT=(key,ymax,col,yl,hl)=>{const t1=s.t,t0=t1-20,pts=s.hist.filter(h=>h.t>=t0).map(h=>[h.t-t0,h[key]]);
   return plot({w:560,h:170,x0:0,x1:20,y0:0,y1:ymax,xt:[0,5,10,15,20],yt:ticks(ymax,4),xf:v=>fm(v-20,0),xl:'t (s)',yl,series:[{pts,col,w:2}],hl:hl||[],aria:yl})};
  let lastG=-1;
  loopOn(el,dt=>{const v=TP.v;s.t+=dt;
   const N=Math.max(1,Math.ceil(dt/0.001)),h=dt/N;
   for(let k=0;k<N;k++){let Va=0;
    if(s.run){Va=v.V;if(s.off>0){Va=0;s.off-=h;if(s.off<=0){s.off=0}}else if(s.surgeT>0){Va=v.V*(1+v.surge/100);s.surgeT-=h}
     if(s.starting&&Va>0){const need=v.kSt*v.IaN*v.R+kp(s.Il)*s.n;if(need>=v.V)s.starting=false;else Va=need}}
    const I=Va>0?Math.max(0,(Va-kp(s.Il)*s.n)/v.R):0;
    s.Il+=(I-s.Il)*(1-Math.exp(-h/v.tauF));
    const T=Tq(I,s.Il),load=s.run||s.n>0?TL():0;
    const w=(T-(s.n>0.1||T>load?load:T))/J;s.n=Math.max(0,s.n+w*h);
    s.I=I;s.Va=Va;s.T=T;if(s.ev)s.peak=Math.max(s.peak,I)}
   if(s.ev==='off'&&s.off<=0&&s.t-s.evT>s.evDur+2){did.offDone=1;if(s.evDur>=2)did.offLong=1;setMsg(`<b>بعد انقطاع مدته ${lt(fm(s.evDur,1)+' s')}:</b> انخفضت السرعة من ${lt(fm(s.nBefore,0)+' rpm')}، واختفى المجال تقريباً، فلما عاد الجهد قفز التيار إلى ${lt(fm(s.peak,0)+' A')} أي ${lt(fm(s.peak/v.IaN,1)+' ×')} التيار المقنن. على المحرك أن يتحمل ذلك دون ضرر (ص 46).`,'err');s.ev='done'}
   if(s.ev==='surge'&&s.surgeT<=0&&s.t-s.evT>1){did.surgeDone=1;setMsg(`<b>ارتفاع مفاجئ ${lt('+'+fm(v.surge,0)+' %')}:</b> قفز التيار إلى ${lt(fm(s.peak,0)+' A')} (${lt(fm(s.peak/v.IaN,1)+' ×')} المقنن) ما دام الجهد مرتفعاً، ثم عاد (ص 46).`,'');s.ev='done'}
   if(s.ev==='start'&&!s.starting&&s.t-s.evT>0.5)s.ev='done';
   s.hist.push({t:s.t,I:s.I,n:s.n});while(s.hist.length&&s.hist[0].t<s.t-21)s.hist.shift();
   const k=s.Va>0?kp(s.Il):0;
   $('#trV').textContent=fm(s.Va,0)+' V';$('#trI').textContent=fm(s.I,0)+' A';$('#trk').textContent=fm(kp(s.Il),4);$('#trE').textContent=fm(kp(s.Il)*s.n,0)+' V';$('#trn').textContent=fm(s.n,0)+' rpm';$('#trT').textContent=fm(s.T||0,0)+' N·m';
   $('#trpk').textContent=fm(s.peak,0)+' A';$('#trpx').textContent=fm(s.peak/v.IaN,1)+' ×';$('#trd-v').textContent=fm(s.dur,1)+' s';
   const ch=$('#trchip');
   if(!s.run){ch.className='e34-chip';ch.textContent=s.n>1?'المصدر مفصول — القطار يتباطأ':'متوقف'}
   else if(s.off>0){ch.className='e34-chip warn';ch.textContent='انقطاع مؤقت للمصدر'}
   else if(s.surgeT>0){ch.className='e34-chip warn';ch.textContent='ارتفاع مفاجئ في الجهد'}
   else if(s.starting){ch.className='e34-chip hot';ch.textContent='بدء الحركة: جهاز البدء يحد التيار'}
   else if(s.I>1.3*v.IaN){ch.className='e34-chip warn';ch.textContent='تيار كبير'}
   else if(!settled()){ch.className='e34-chip ld';ch.textContent='تتغير السرعة'}
   else{ch.className='e34-chip ok';ch.textContent=s.phase==='up'?'صعود مرتفع — مستقر':'انطلاق حر — مستقر'}
   if(s.t-lastG>0.1){lastG=s.t;const Im=niceMax(Math.max(2*v.IaN,...s.hist.map(h=>h.I))*1.05),nm=niceMax(Math.max(1.3*nN,...s.hist.map(h=>h.n))*1.05);
    $('#trgI').innerHTML=plotT('I',Im,'--live','Ia (A)',[{v:v.IaN,col:'--stop'}]);$('#trgN').innerHTML=plotT('n',nm,'--blue','n (rpm)')}
   steps.check()});
 },
 quiz:[
  {q:'متى يحتاج القطار إلى أكبر قوة جر؟',o:['أثناء الانطلاق الحر على أرض مستوية','أثناء بدء الحركة والتسارع، خاصة عند صعود مرتفع','أثناء الوقوف','أثناء النزول من مرتفع'],c:1,e:'ص 45: البدء يحتاج قوة للتسارع وللمقاومة، والصعود يضيف قوة للتغلب على الجاذبية.'},
  {q:'أثناء الانطلاق الحر بسرعة منتظمة على أرض مستوية تلزم قوة تحريك:',o:['للتسارع فقط','للتغلب على المقاومة لحركة القطار فقط','للتغلب على الجاذبية فقط','لا تلزم أي قوة'],c:1,e:'ص 45.'},
  {q:'من المرغوب أن تكون العلاقة بين السرعة والعزم في محركات التحريك كما في:',o:['محركات التوازي','المحرك المركب الفرقي','محركات التوالي للتيار المستمر','المحركات التزامنية'],c:2,e:'ص 45: البند 2.'},
  {q:'سبب الارتفاع المفاجئ في الجهد في شبكة التحريك:',o:['زيادة الحمل','عمل أحد قواطع التيار لإزالة خطأ ما بالشبكة','انخفاض السرعة','عمل الفرامل'],c:1,e:'ص 46: البند 5.'},
  {q:'عند إعادة الجهد بعد انقطاع مؤقت يمر تيار كبير في المحرك لأن:',o:['الجهد يصبح أكبر من المقنن','القوة الدافعة الكهربائية العكسية تكون قد انخفضت كثيراً','المقاومة تزيد','السرعة تزيد'],c:1,e:'ص 46: البند 6.'},
  {q:'متى يحدث الانقطاع المؤقت لمصدر الجهد في التحريك؟',o:['عند صعود المرتفعات','عند تقاطع الطرق والانتقال من شبكة جر إلى أخرى','عند الفرملة','عند التسارع فقط'],c:1,e:'ص 46.'},
  {q:'لماذا يجب إنقاص وزن محرك التحريك وحجمه؟',o:['لزيادة سرعته فقط','لسهولة تثبيته مع دواليب الحركة وتوفير الطاقة وضيق المكان المخصص له','لزيادة عزمه','لتقليل الاهتزاز فقط'],c:1,e:'ص 46: البند 8.'},
  {q:'من طرق الفرملة الكهربائية التي يجب أن يقبلها محرك التحريك:',o:['الفرامل الميكانيكية فقط','الفرامل الديناميكية وبإعادة التوليد وبالتيار المعكوس','الفرامل الهوائية','لا شيء مما سبق'],c:1,e:'ص 45: البند 4.'}
 ]
});

/* =====================================================================
   Lesson 2 — طرق الوقاية والتبريد (أنواع الأغلفة) + أسئلة الوحدة (ص 47–49)
   ===================================================================== */
const ENC=[
 {k:'open',n:'النوع المفتوح',d:'المحرك مفتوح من كلا طرفيه، وهذا النوع يوفر تبريداً حراً للمحرك، حيث يكون كل من العضوين الثابت والدوار في اتصال مباشر مع الهواء المحيط.',u:'آلات التيار المستمر الكبيرة الحجم.',c:'تبريد حر — الهواء يمر داخل المحرك.'},
 {k:'screen',n:'النوع المحمي بشبكة',d:'يحتوي الغلاف الخارجي للآلة على فتحات كبيرة للتبريد الحر، هذه الفتحات مغطاة بشبكة لمنع دخول الفئران والزواحف، أو سقوط العدد الصغيرة مثل المفكات… داخل الآلة، ولكنها لا توفر الحماية من الأوساخ والأتربة والأمطار أو المواد القابلة للاشتعال.',u:'حيث يكون الجو المحيط نظيفاً خالياً من الأوساخ والغبار والمواد الكيميائية.',c:'تبريد حر عبر فتحات كبيرة عليها شبكة.'},
 {k:'drip',n:'المحمي ضد تناثر السوائل والغبار',d:'الفتحات المخصصة لتبريد المحرك مصممة بحيث لا تسمح بدخول قطرات السوائل أو ذرات الغبار.',u:'الأماكن التي تتناثر فيها قطرات السوائل وذرات الغبار.',c:'هواء عبر فتحات مصممة تمنع القطرات والغبار.'},
 {k:'rain',n:'المحمي ضد الأمطار',d:'الفتحات المخصصة لتبريد المحرك مصممة بحيث لا تسمح بدخول الأمطار أو السوائل وذرات الغبار الساقطة على الآلة أو أن تأتي من جانبي الآلة بزاوية لا تزيد عن مئة درجة من الاتجاه الرأسي.',u:'تحت الأمطار المباشرة.',c:'هواء عبر فتحات محمية من المطر.'},
 {k:'tenv',n:'المقفل ذو التبريد الذاتي',d:'المحرك مغلق بالكامل ولا توجد أي فتحات للتهوية، ويتم تبريده بانتشار الحرارة من على سطحه الخارجي، الذي يزود بزعانف لزيادة مساحة السطح وتحسين التبريد. بسبب صعوبة التبريد فإن قدرة المحرك تحدد بحوالي ستين إلى سبعين في المئة من قدرة المحرك من نفس الحجم من النوع المفتوح، وتُبنى هذه المحركات بقدرات محدودة حوالي 3–5 حصان فقط.',u:'الأماكن التي يوجد فيها الغبار والمياه والمحاليل الكيميائية.',c:'لا فتحات — الحرارة تنتشر من السطح والزعانف.'},
 {k:'tefc',n:'المقفل ذو التبريد المنفصل',d:'مزود بمروحة خاصة للتبريد، مثبتة مع محور المحرك وخارج الإطار المقفل للمحرك ومغطاة بغطاء خاص بها، وتدفع الهواء لتبريد السطح الخارجي للمحرك، والذي يكون في العادة مزوداً بزعانف لزيادة المساحة السطحية.',u:'مطاحن الدقيق ومصانع الإسمنت والمناجم.',c:'مروحة خارجية تدفع الهواء على السطح ذي الزعانف.'},
 {k:'pipe',n:'المزود بأنابيب للتبريد',d:'المحرك مقفل تماماً، ويتم تبريده بواسطة هواء نظيف يدفع داخل أنابيب خاصة من خارج منطقة الغبار. الكلفة الزائدة بسبب استخدام أنابيب التبريد تقابل باستخدام محرك أصغر حجماً وأقل كلفة، إذا أخذنا في الاعتبار التبريد الجيد للمحرك في هذه الحالة.',u:'مناطق الغبار التي يمكن جلب هواء نظيف لها من خارجها.',c:'هواء نظيف بالأنابيب من خارج منطقة الغبار.'},
 {k:'xp',n:'المصمم ضد الانفجار',d:'الإطار الخارجي مصمم ليتحمل أي انفجار يحدث داخل المحرك ويمنع اشتعال الغازات خارج المحرك، وفتحات التبريد مصممة بحيث تحتوي اللهب داخل الإطار. ويصمم المحرك بحيث تكون أقصى درجة حرارة للسطح الخارجي أقل بكثير من درجة الحرارة التي تشتعل عندها الغازات أو المواد القابلة للاشتعال المحيطة بالمحرك.',u:'مصافي تكرير البترول ومحطات الوقود ومصانع البتروكيماويات.',c:'إطار قوي يحتوي الانفجار واللهب، وسطح أبرد من درجة الاشتعال.'}];
/* مواقف من نص الكتاب: best = الأنسب حسب الكتاب، ok = يصلح أيضاً مع ملاحظة */
const SCN=[
 {q:'ورشة نظيفة جافة خالية من الغبار والمواد الكيميائية، ونخشى دخول الفئران أو سقوط مفك داخل المحرك.',best:'screen',ok:{drip:'يصلح لكنه حماية أكثر من الحاجة.',rain:'يصلح لكنه حماية أكثر من الحاجة.'},why:'المحمي بشبكة يمنع الفئران والعدد الصغيرة، ويستعمل حيث الجو نظيف (ص 47).'},
 {q:'محطة وقود.',best:'xp',ok:{},why:'المصمم ضد الانفجار يستخدم في مصافي البترول ومحطات الوقود ومصانع البتروكيماويات (ص 48، السؤال 4-5 a).'},
 {q:'مطحنة دقيق.',best:'tefc',ok:{tenv:'يصلح للغبار لكن قدرته محدودة (3–5 حصان تقريباً).',pipe:'يصلح إن أمكن جلب هواء نظيف من خارج منطقة الغبار.'},why:'المقفل ذو التبريد المنفصل يستخدم في مطاحن الدقيق ومصانع الإسمنت والمناجم (ص 48، السؤال 4-5 b).'},
 {q:'منجم.',best:'tefc',ok:{pipe:'يصلح إن أمكن جلب هواء نظيف من خارج المنطقة.'},why:'ص 48: المقفل ذو التبريد المنفصل للمناجم.'},
 {q:'مضخة صغيرة (نحو 4 حصان) في مكان فيه غبار ومياه ومحاليل كيميائية.',best:'tenv',ok:{tefc:'يصلح أيضاً، والمروحة تحسن التبريد.'},why:'المقفل ذو التبريد الذاتي للأماكن التي فيها الغبار والمياه والمحاليل الكيميائية، وقدرته نحو 3–5 حصان (ص 47–48).'},
 {q:'آلة تيار مستمر كبيرة الحجم في مكان نظيف، نريد لها أفضل تبريد.',best:'open',ok:{screen:'يصلح ويضيف حماية من الأجسام الصغيرة.'},why:'النوع المفتوح يوفر تبريداً حراً ويستخدم في آلات التيار المستمر الكبيرة (ص 47).'},
 {q:'محرك خارج المبنى يعمل تحت الأمطار المباشرة.',best:'rain',ok:{tenv:'المقفل يحمي من المياه أيضاً لكن قدرته أقل لصعوبة التبريد.',tefc:'يصلح أيضاً لكنه أغلى.'},why:'المحمي ضد الأمطار يمكن استخدامه تحت الأمطار المباشرة (ص 47).'},
 {q:'مكان تتناثر فيه قطرات سوائل وذرات غبار.',best:'drip',ok:{rain:'يصلح أيضاً.',tenv:'يصلح لكنه أكثر من الحاجة.',tefc:'يصلح لكنه أكثر من الحاجة.'},why:'المحمي ضد تناثر السوائل والغبار: فتحاته لا تسمح بدخول القطرات والغبار (ص 47).'},
 {q:'منطقة غبار كثيف، ويمكن جلب هواء نظيف من خارجها، ونريد محركاً أصغر حجماً.',best:'pipe',ok:{tefc:'يصلح لكنه يحتاج محركاً أكبر لنفس القدرة.'},why:'المزود بأنابيب للتبريد: هواء نظيف من خارج منطقة الغبار، وكلفة الأنابيب تقابلها محرك أصغر (ص 48).'},
 {q:'مصنع بتروكيماويات.',best:'xp',ok:{},why:'ص 48: المصمم ضد الانفجار.'},
 {q:'مصنع إسمنت.',best:'tefc',ok:{pipe:'يصلح إن أمكن جلب هواء نظيف من خارج منطقة الغبار.'},why:'ص 48: المقفل ذو التبريد المنفصل لمصانع الإسمنت.'}];
function encSVG(k,t){t=t||0;const ar=(x1,y1,x2,y2)=>`<path d="M${x1} ${y1}L${x2} ${y2}" stroke="var(--blue)" stroke-width="2.4" stroke-dasharray="7 6" stroke-dashoffset="${fx(-t*30%13)}" fill="none"/><path d="M${x2} ${y2}l-7 -4v8z" fill="var(--blue)" transform="rotate(${fx(Math.atan2(y2-y1,x2-x1)*180/PI)} ${x2} ${y2})"/>`;
  const closed=['tenv','tefc','pipe','xp'].includes(k);let s=`<svg viewBox="0 0 400 230" role="img" aria-label="${ENC.find(e=>e.k===k).n}">`;
  // body
  const wall=k==='xp'?7:3;
  s+=`<rect x="110" y="70" width="180" height="100" rx="10" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="${wall}"/>`;
  s+=`<rect x="140" y="95" width="120" height="50" rx="6" fill="var(--surface)" stroke="var(--muted)" stroke-width="1.5"/>`+`<path d="M290 120H360" stroke="var(--fg)" stroke-width="6" stroke-linecap="round"/>`;
  if(!closed){// end openings
    s+=`<rect x="104" y="92" width="12" height="56" fill="var(--surface)" stroke="none"/><rect x="284" y="92" width="12" height="56" fill="var(--surface)" stroke="none"/>`;
    if(k==='screen')[104,284].forEach(x=>{for(let y=94;y<148;y+=6)s+=`<path d="M${x} ${y}h12" stroke="var(--muted)" stroke-width="1"/>`;for(let xx=x;xx<=x+12;xx+=4)s+=`<path d="M${xx} 92v56" stroke="var(--muted)" stroke-width="1"/>`});
    if(k==='drip'||k==='rain')[104,284].forEach(x=>{for(let y=96;y<146;y+=9)s+=`<path d="M${x} ${y}l12 6" stroke="var(--fg)" stroke-width="2"/>`});
    s+=ar(40,120,100,120)+ar(300,110,345,85);
    if(k==='rain'){s+=`<path d="M96 66H304L290 56H110Z" fill="var(--fg)" opacity="0.8"/>`;for(let i=0;i<7;i++){const x=120+i*26,y=10+((t*60+i*13)%40);s+=`<path d="M${x} ${fx(y)}l-3 9" stroke="var(--blue)" stroke-width="2"/>`}}
    if(k==='drip'){for(let i=0;i<4;i++){const y=60+((t*40+i*17)%50);s+=`<circle cx="${70+i*6}" cy="${fx(y)}" r="2.5" fill="var(--blue)"/>`}}
  }
  if(k==='tenv'||k==='tefc'||k==='pipe'){for(let x=122;x<=278;x+=12)s+=`<path d="M${x} 70V58M${x} 170V182" stroke="var(--fg)" stroke-width="3"/>`}
  if(k==='tenv'){for(let i=0;i<5;i++){const x=130+i*35,y=50-((t*20+i*7)%20);s+=`<path d="M${x} ${fx(y)}q5 -6 0 -12q-5 -6 0 -12" stroke="var(--live)" stroke-width="2" fill="none"/>`}}
  if(k==='tefc'){s+=`<path d="M60 75H104V165H60Z" fill="none" stroke="var(--fg)" stroke-width="2" stroke-dasharray="4 3"/><g transform="rotate(${fx(t*400%360)} 82 120)"><path d="M82 120l0 -30M82 120l26 15M82 120l-26 15" stroke="var(--fg)" stroke-width="5" stroke-linecap="round"/></g><path d="M104 120H110" stroke="var(--fg)" stroke-width="5"/>`;
    s+=ar(110,52,290,52)+ar(110,188,290,188)}
  if(k==='pipe'){s+=`<path d="M140 70V22H60M260 70V22H340" fill="none" stroke="var(--fg)" stroke-width="12" stroke-linejoin="round"/><path d="M140 70V22H60M260 70V22H340" fill="none" stroke="var(--surface)" stroke-width="7" stroke-linejoin="round"/>`+ar(70,22,128,22)+ar(272,22,330,22)+arT(40,48,'هواء نظيف',{fs:11,col:'--muted'});
    for(let i=0;i<6;i++){const x=20+((t*25+i*60)%380);s+=`<circle cx="${fx(x)}" cy="${200+(i%3)*8}" r="2" fill="var(--muted)"/>`}s+=arT(200,226,'منطقة غبار',{fs:11,col:'--muted'})}
  if(k==='xp'){[110,290].forEach(x=>{s+=`<path d="M${x} 80l-6 6l6 6l-6 6l6 6l-6 6l6 6l-6 6l6 6l-6 6l6 6l-6 6l6 6" fill="none" stroke="var(--live)" stroke-width="2"/>`});
    const fl=6+3*Math.sin(t*8);s+=`<path d="M200 140q-12 -14 0 -${fx(28+fl)}q12 ${fx(14+fl/2)} 0 ${fx(28+fl)}z" fill="var(--live)" opacity="0.85"/>`+arT(200,205,'اللهب يبقى داخل الإطار',{fs:11,col:'--muted'})}
  if(k==='open'||k==='screen')s+=arT(200,205,'الهواء المحيط يمر داخل المحرك',{fs:11,col:'--muted'});
  if(k==='tenv')s+=arT(200,205,'لا فتحات — زعانف على السطح',{fs:11,col:'--muted'});
  if(k==='tefc')s+=arT(82,195,'مروحة',{fs:11,col:'--muted'});
  return s+'</svg>'}

lesson({
 id:'u4-l2',unit:4,order:2,pages:'47–49',
 title:'طرق الوقاية المختلفة للمحركات وكيفية تبريدها',
 summary:'الإطار الخارجي يحمي المحرك من الرطوبة والأوساخ والأتربة والأجسام الغريبة والأبخرة القابلة للاشتعال دون أن يضر بتبريده. ثمانية أنواع من الأغلفة: من المفتوح ذي التبريد الحر إلى المصمم ضد الانفجار، ولكل منها أماكن استعماله. مع أسئلة الوحدة الرابعة.',
 theory:[
  {h:'طرق الوقاية المختلفة للمحركات الكهربائية وكيفية تبريدها',ref:'ص 47',html:`<p>يستخدم <b>الإطار الخارجي</b> للمحرك لتوفير الحماية للمحرك من ظروف الجو المحيط، مثل، الرطوبة والأوساخ والأتربة والأجسام الغريبة، وما قد يتسرب للمحرك من أبخرة ومواد قابلة للاشتعال، وفي الوقت نفسه <b>لا يجب أن يؤثر الإطار سلباً على تبريد المحرك</b>. هناك عدة أنواع من الأغلفة التي تستخدم في المحركات لتوفير درجات مختلفة من الحماية، ولمراعاة ظروف التشغيل المحيطة بنظام التحريك الكهربائي:</p>
   <ol>
   <li><b>النوع المفتوح:</b> في هذا النوع يكون المحرك مفتوحاً من كلا طرفيه، وهذا النوع يوفر تبريداً حراً للمحرك، حيث يكون كل من العضوين الثابت والدوار في اتصال مباشر مع الهواء المحيط، ويستخدم في آلات التيار المستمر الكبيرة الحجم.</li>
   <li><b>النوع المحمي بشبكة:</b> في هذا النوع يحتوي الغلاف الخارجي للآلة على فتحات كبيرة للتبريد الحر، هذه الفتحات مغطاة بشبكة لمنع دخول الفئران والزواحف، أو سقوط العدد الصغيرة مثل المفكات… إلخ، داخل الآلة، ولكنها لا توفر الحماية من الأوساخ والأتربة والأمطار أو المواد القابلة للاشتعال. تستعمل هذه المحركات حيث يكون الجو المحيط نظيفاً خالياً من الأوساخ والغبار والمواد الكيميائية.</li>
   <li><b>النوع المحمي ضد تناثر السوائل والغبار:</b> في هذا النوع تكون الفتحات المخصصة لتبريد المحرك مصممة بحيث لا تسمح بدخول قطرات السوائل أو ذرات الغبار.</li>
   <li><b>النوع المحمي ضد الأمطار:</b> في هذا النوع تكون الفتحات المخصصة لتبريد المحرك، مصممة بحيث لا تسمح بدخول الأمطار أو السوائل وذرات الغبار الساقطة على الآلة أو أن تأتي من جانبي الآلة بزاوية لا تزيد عن مئة درجة من الاتجاه الرأسي، وهذا يمكن من استخدام هذه المحركات تحت الأمطار المباشرة.</li>
   <li><b>النوع المقفل ذو التبريد الذاتي:</b> في هذا النوع يكون المحرك مغلقاً بالكامل ولا توجد أي فتحات للتهوية، ويتم تبريد المحرك بواسطة انتشار الحرارة من على سطحه الخارجي، الذي يزود بزعانف لزيادة مساحة السطح الخارجي للمحرك وتحسين التبريد، يستخدم هذا النوع في الأماكن حيث يوجد الغبار والمياه والمحاليل الكيميائية. بسبب صعوبة التبريد فإن قدرة المحرك تحدد بحوالي <b>ستين إلى سبعين في المئة</b> من قدرة المحرك من نفس الحجم من النوع المفتوح، تُبنى هذه المحركات بقدرات محدودة حوالي <b>٣ – ٥ حصان</b> فقط. <span class="ref">ص 48</span></li>
   <li><b>النوع المقفل ذو التبريد المنفصل:</b> هذا النوع من المحركات مزود بمروحة خاصة للتبريد، مثبتة مع محور المحرك وخارج الإطار المقفل للمحرك ومغطاة بغطاء خاص بها وتدفع الهواء لتبريد السطح الخارجي للمحرك، والذي يكون في العادة مزوداً بزعانف لزيادة المساحة السطحية. يستخدم هذا النوع في مطاحن الدقيق ومصانع الإسمنت والمناجم.</li>
   <li><b>النوع المزود بأنابيب للتبريد:</b> في هذا النوع يكون المحرك مقفلاً تماماً، ويتم تبريده بواسطة هواء نظيف يدفع داخل أنابيب خاصة من خارج منطقة الغبار. الكلفة الزائدة بسبب استخدام أنابيب التبريد تقابل باستخدام محرك أصغر حجماً وأقل كلفة، إذا أخذنا في الاعتبار التبريد الجيد للمحرك في هذه الحالة.</li>
   <li><b>النوع المصمم ضد الانفجار:</b> يستخدم هذا النوع من المحركات في الأجواء التي تنبعث فيها غازات أو تتواجد فيها مواد قابلة للاشتعال، حيث يكون الإطار الخارجي مصمماً ليتحمل أي انفجار يحدث داخل المحرك ويمنع اشتعال الغازات خارج المحرك وفتحات التبريد مصممة بحيث تحتوي اللهب داخل الإطار. وكذلك يصمم المحرك بحيث تكون أقصى درجة حرارة للسطح الخارجي أقل بكثير من درجة الحرارة التي تشتعل عندها الغازات أو المواد القابلة للاشتعال المحيطة بالمحرك، ويستخدم هذا النوع في مصافي تكرير البترول ومحطات الوقود ومصانع البتروكيماويات.</li></ol>`},
  {html:`<div class="e34-tbl"><table class="tt"><thead><tr><th>النوع</th><th>التبريد</th><th>يستعمل في</th></tr></thead><tbody>${ENC.map((e,i)=>`<tr><td>${i+1}. ${e.n}</td><td>${e.c}</td><td>${e.u}</td></tr>`).join('')}</tbody></table></div><p class="sub">توضيح للمتدرب — ليس من الكتاب: جدول يلخص ص 47–48. الكتاب لا يذكر رموز IP ولا تصنيفات قياسية.</p>`},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب:</b> كلما زادت الحماية قلّت الفتحات وصعب التبريد. لذلك ينخفض ما يعطيه المحرك المقفل من قدرة (60–70 % من المفتوح المماثل)، فنعوّض بزعانف أو مروحة خارجية أو أنابيب هواء نظيف. في المختبر ترى رسماً لكل نوع، وتختار الغلاف المناسب لمواقف من نص الكتاب.'},
  {err:'في ص 48 «تبني هذه المحركات» والصحيح «تُبنى»، و«مروحة خاصه» والصحيح «خاصة»؛ صححناهما في النص. والمصطلح «النوع المغلق» في ص 45 هو «المقفل» هنا. ولا يوجد في الوحدة الرابعة أي شكل؛ الرسوم في المختبر توضيحية.'},
  {h:'أسئلة متنوعة — الوحدة الرابعة',ref:'ص 49',html:`
   ${Q('4-1','ما الخواص الكهربائية والميكانيكية العامة المطلوبة لمحركات التحريك؟','ثماني خواص (ص 45–46): عزم كبير أثناء بدء الحركة، وأن تكون لها خصائص محركات التوالي، وبساطة التحكم في السرعة، وقابليتها لاستخدام الفرامل الكهربائية (الديناميكية وبإعادة التوليد وبالتيار المعكوس)، وتحمل الارتفاع المفاجئ في الجهد، وتحمل الانقطاع المؤقت لمصدر الجهد، والصلابة، وصغر الوزن والحجم.')}
   ${Q('4-2','ما فائدة الإطار الخارجي للمحرك؟','توفير الحماية للمحرك من ظروف الجو المحيط: الرطوبة والأوساخ والأتربة والأجسام الغريبة وما قد يتسرب إليه من أبخرة ومواد قابلة للاشتعال، دون أن يؤثر سلباً على تبريد المحرك (ص 47).')}
   ${Q('4-3','ما الذي يجعل المحركات المقفلة أكثر كلفة من المحركات المحمية بشبكة؟','الكتاب لا يجيب عنه نصاً. من نص ص 47–48: المحرك المقفل لا فتحات فيه، فيبرد فقط بانتشار الحرارة من سطحه، فتنخفض قدرته إلى نحو 60–70 % من قدرة المحرك المفتوح من نفس الحجم؛ أي نحتاج محركاً أكبر (حديد ونحاس أكثر) لنفس القدرة، إضافة إلى الزعانف، وفي بعض الأنواع مروحة خارجية بغطائها أو أنابيب تبريد. أما المحمي بشبكة فيبرد تبريداً حراً عبر فتحات كبيرة عليها شبكة بسيطة.')}
   ${Q('4-4','ما أنواع الأغلفة التي تستخدم في حماية المحركات؟','ثمانية (ص 47–48): المفتوح، والمحمي بشبكة، والمحمي ضد تناثر السوائل والغبار، والمحمي ضد الأمطار، والمقفل ذو التبريد الذاتي، والمقفل ذو التبريد المنفصل، والمزود بأنابيب للتبريد، والمصمم ضد الانفجار.')}
   ${Q('4-5','أي أنواع المحركات مناسب للاستخدام في: a- مصافي تكرير البترول ومحطات الوقود؟ b- المناجم ومصانع الأسمنت؟','a- النوع المصمم ضد الانفجار (ص 48). b- النوع المقفل ذو التبريد المنفصل (ص 48).')}`}
 ],
 lab:(el)=>{
  let cur='open',si=0,score=0,answered={},seen={open:1},pw=5,t=0;const did={};
  el.innerHTML=`<div class="grid e34-lab">
   <div class="panel c7"><h2>أنواع الأغلفة الثمانية <small>رسوم توضيحية — النص من ص 47–48</small></h2>
    <div class="e34-cards" id="encb">${ENC.map((e,i)=>`<button class="btn" data-enc="${e.k}" aria-pressed="${e.k===cur}">${i+1}. ${e.n}</button>`).join('')}</div>
    <div id="encv" class="svgbox" style="max-width:460px;margin-inline:auto"></div></div>
   <div class="panel c5"><h2 id="encn"></h2><p id="encd"></p><p><b>التبريد:</b> <span id="encc"></span></p><p><b>يُستعمل في:</b> <span id="encu"></span></p></div>
   <div class="panel c12"><h2>اختر الغلاف المناسب <small>مواقف مأخوذة من نص الكتاب — <span id="scs"></span></small></h2>
    <p id="scq" style="font-weight:600;font-size:16px"></p>
    <div class="e34-cards" id="scb">${ENC.map((e,i)=>`<button class="btn" data-sc="${e.k}">${i+1}. ${e.n}</button>`).join('')}</div>
    <div id="scf" class="e34-msg"></div>
    <div class="e34-row"><button class="btn primary" id="scn">الموقف التالي</button></div></div>
   <div class="panel c6"><h2>المقفل ذو التبريد الذاتي: كم قدرته؟ <small>ص 48</small></h2>
    ${sl('pw','قدرة محرك مفتوح من الحجم نفسه',1,10,0.5,pw)}
    <div class="e34-meters">${meter('المقفل ذاتي التبريد (60 %)','pw60')}${meter('المقفل ذاتي التبريد (70 %)','pw70')}</div>
    <p class="sub" id="pwtx"></p></div>
   <div class="panel c6"><h2>جرّب</h2><ol class="steps" id="encst"></ol></div></div>`;
  const $=q=>el.querySelector(q);
  const show=()=>{const e=ENC.find(x=>x.k===cur);$('#encn').textContent=e.n;$('#encd').textContent=e.d;$('#encc').textContent=e.c;$('#encu').textContent=e.u;el.querySelectorAll('[data-enc]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.enc===cur)))};
  el.querySelectorAll('[data-enc]').forEach(b=>b.onclick=()=>{cur=b.dataset.enc;seen[cur]=1;show()});show();
  const scene=()=>{const S_=SCN[si%SCN.length];$('#scq').textContent=`الموقف ${si%SCN.length+1} من ${SCN.length}: ${S_.q}`;$('#scf').innerHTML='';el.querySelectorAll('[data-sc]').forEach(b=>{b.className='btn';b.disabled=false});$('#scs').textContent=`صحيح ${score} من ${Object.keys(answered).filter(x=>x[0]!=='_').length}`};
  el.querySelectorAll('[data-sc]').forEach(b=>b.onclick=()=>{const S_=SCN[si%SCN.length],k=b.dataset.sc;if(answered[si%SCN.length]!=null&&answered['_'+si])return;
   const okNote=S_.ok[k];const right=k===S_.best;
   el.querySelectorAll('[data-sc]').forEach(x=>{if(x.dataset.sc===S_.best)x.classList.add('good')});
   if(!right)b.classList.add(okNote?'meh':'bad');
   if(answered[si%SCN.length]==null){answered[si%SCN.length]=right?1:0;if(right)score++}answered['_'+si]=1;
   const bestN=ENC.find(e=>e.k===S_.best).n;
   $('#scf').innerHTML=`<div class="callout${right?'':' err'}">${right?'<b>صحيح.</b> ':okNote?`<b>يصلح، لكن الأنسب: ${bestN}.</b> ${okNote} `:`<b>ليس مناسباً. الأنسب: ${bestN}.</b> `}${fixR(S_.why)}</div>`;
   $('#scs').textContent=`صحيح ${score} من ${Object.keys(answered).filter(x=>x[0]!=='_').length}`});
  $('#scn').onclick=()=>{si++;scene()};scene();
  const pwd=()=>{$('#pw-v').textContent=fm(pw,1)+' hp';$('#pw60').textContent=fm(0.6*pw,2)+' hp';$('#pw70').textContent=fm(0.7*pw,2)+' hp';
   $('#pwtx').innerHTML=`بسبب صعوبة التبريد يعطي المقفل ذاتي التبريد ${lt('60–70 %')} فقط من قدرة المفتوح المماثل. ولذلك يُبنى بقدرات محدودة نحو ${lt('3–5 hp')} (الحصان: ${lt('1 hp ≈ 746 W')} — توضيح ليس من الكتاب). لكي نحصل على ${lt(fm(pw,1)+' hp')} من محرك مقفل ذاتي التبريد نحتاج إطاراً بحجم محرك مفتوح قدرته ${lt(fm(pw/0.7,1)+' – '+fm(pw/0.6,1)+' hp')}.`};
  $('#pw').oninput=e=>{pw=+e.target.value;did.pw=1;pwd()};pwd();
  const steps=stepsUI($('#encst'),[
   {t:'تعرّف على الأنواع',x:'اضغط كل نوع من الأنواع الثمانية وشاهد كيف يمر الهواء أو كيف تخرج الحرارة.',done:()=>Object.keys(seen).length>=8},
   {t:'اختر الغلاف المناسب',x:'أجب عن خمسة مواقف على الأقل في لوحة «اختر الغلاف المناسب».',done:()=>Object.keys(answered).filter(x=>x[0]!=='_').length>=5},
   {t:'أجب عن المواقف كلها',x:`أكمل المواقف الأحد عشر، وحاول أن تصل إلى ${lt('8')} إجابات صحيحة على الأقل (منها السؤال <span class="ltr">4-5</span>).`,done:()=>Object.keys(answered).filter(x=>x[0]!=='_').length>=SCN.length},
   {t:'قدرة المحرك المقفل',x:'حرّك قدرة المحرك المفتوح وشاهد كم يعطي المقفل ذاتي التبريد من الحجم نفسه — هذا يجيب عن السؤال <span class="ltr">4-3</span>.',done:()=>did.pw}
  ]);
  let lastD=-1;loopOn(el,dt=>{t+=dt;if(t-lastD>0.04){lastD=t;$('#encv').innerHTML=encSVG(cur,t)}steps.check()});
 },
 quiz:[
  {q:'ما فائدة الإطار الخارجي للمحرك؟',o:['زيادة سرعة المحرك','حماية المحرك من ظروف الجو المحيط دون أن يضر بتبريده','زيادة العزم','تقليل الجهد'],c:1,e:'ص 47.'},
  {q:'النوع الذي يوفر تبريداً حراً ويستخدم في آلات التيار المستمر الكبيرة:',o:['المقفل ذو التبريد الذاتي','النوع المفتوح','المصمم ضد الانفجار','المزود بأنابيب'],c:1,e:'ص 47.'},
  {q:'النوع المحمي بشبكة يمنع:',o:['الأتربة والأمطار','الفئران والزواحف وسقوط العدد الصغيرة','الغازات القابلة للاشتعال','المحاليل الكيميائية'],c:1,e:'ص 47: لكنه لا يحمي من الأوساخ والأتربة والأمطار والمواد القابلة للاشتعال.'},
  {q:'النوع المحمي ضد الأمطار يمنع دخول المطر الآتي من الجانبين بزاوية لا تزيد عن … من الاتجاه الرأسي:',o:['45 درجة','90 درجة','100 درجة','180 درجة'],c:2,e:'ص 47.'},
  {q:'قدرة المحرك المقفل ذي التبريد الذاتي تحدد بحوالي … من قدرة المفتوح من نفس الحجم:',o:['20–30 %','40–50 %','60–70 %','90–100 %'],c:2,e:'ص 47–48: بسبب صعوبة التبريد.'},
  {q:'المحرك المناسب لمطاحن الدقيق ومصانع الإسمنت والمناجم:',o:['المفتوح','المحمي بشبكة','المقفل ذو التبريد المنفصل','المحمي ضد الأمطار'],c:2,e:'ص 48.'},
  {q:'في النوع المزود بأنابيب للتبريد، الكلفة الزائدة للأنابيب تقابلها:',o:['زيادة السرعة','استخدام محرك أصغر حجماً وأقل كلفة','إلغاء الإطار','زيادة الجهد'],c:1,e:'ص 48.'},
  {q:'المحرك المناسب لمحطات الوقود ومصافي البترول:',o:['المقفل ذو التبريد الذاتي','المصمم ضد الانفجار','المحمي ضد تناثر السوائل','المفتوح'],c:1,e:'ص 48.'}
 ]
});

})(PLCBOOK);
