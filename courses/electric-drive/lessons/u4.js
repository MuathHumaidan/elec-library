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
 stations:[
  {intro:true},

  {st:1,short:'أهداف الوحدة',title:'الوحدة الرابعة: الهدف العام والأهداف التفصيلية',ref:'ص 44',
   q:'محرك القطار يعمل في ظروف لا يواجهها محرك المصنع. ماذا نطلب منه، وكيف نحميه؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ثلاث بطاقات لأهداف الوحدة: الخواص، والحماية من الجو المحيط، والتبريد" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><text x="180" y="48" text-anchor="middle" font-size="15" font-weight="700" fill="#2C4A40">أهداف الوحدة الرابعة</text><g data-tip="الهدف الأول: الخواص الكهربائية والميكانيكية المطلوبة في محركات التحريك (هذا الدرس)."><rect x="40" y="66" width="280" height="62" rx="14" fill="#F2C14E" stroke="#2C4A40" stroke-width="3"/><circle cx="294" cy="97" r="14" fill="#2C4A40"/><text x="294" y="102" text-anchor="middle" font-size="13" font-weight="700" fill="#FBF6EE">1</text><text x="170" y="102" text-anchor="middle" font-size="13.5" font-weight="700" fill="#2C4A40">الخواص الكهربائية والميكانيكية</text></g><g data-tip="الهدف الثاني: تركيب المحرك لحمايته من ظروف الجو المحيط، أي أنواع الأغلفة (الدرس الثاني)."><rect x="40" y="140" width="280" height="62" rx="14" fill="#4FB3A9" stroke="#2C4A40" stroke-width="3"/><circle cx="294" cy="171" r="14" fill="#2C4A40"/><text x="294" y="176" text-anchor="middle" font-size="13" font-weight="700" fill="#FBF6EE">2</text><text x="170" y="176" text-anchor="middle" font-size="13.5" font-weight="700" fill="#2C4A40">الحماية من الجو المحيط</text></g><g data-tip="الهدف الثالث: طرق التبريد المختلفة للمحركات (الدرس الثاني، مع أنواع الأغلفة)."><rect x="40" y="214" width="280" height="62" rx="14" fill="#CFE6DB" stroke="#2C4A40" stroke-width="3"/><circle cx="294" cy="245" r="14" fill="#2C4A40"/><text x="294" y="250" text-anchor="middle" font-size="13" font-weight="700" fill="#FBF6EE">3</text><text x="170" y="250" text-anchor="middle" font-size="13.5" font-weight="700" fill="#2C4A40">طرق التبريد</text></g></svg>`,
   cap:'ثلاثة أهداف تفصيلية: الأول في هذا الدرس، والآخران في الدرس الثاني.<br><b>مرّر المؤشر على كل بطاقة (أو المسها في الجوال) لتعرف أين تُدرس.</b>',
   side:[
    {predict:{q:'أي هذه الموضوعات <b>ليس</b> من أهداف الوحدة الرابعة؟',opts:[
     ['طرق التبريد المختلفة للمحركات',false,'هذا الهدف التفصيلي الثالث.'],
     ['حساب قوة الجر اللازمة لدواليب القطار',true,'هذا من الوحدة الخامسة. أهداف الرابعة: الخواص، والحماية من الجو المحيط، والتبريد.'],
     ['الخواص الكهربائية والميكانيكية للمحركات',false,'هذا الهدف التفصيلي الأول.'],
     ['تركيب المحركات لحمايتها من ظروف الجو المحيط',false,'هذا الهدف التفصيلي الثاني.']]}}
   ],
   body:[
    {book:String.raw`<p><b>الهدف العام للوحدة:</b> معرفة الخواص العامة المطلوبة، وطرق الوقاية من الجو المحيط، للمحركات الكهربائية.</p>
     <p><b>الأهداف التفصيلية:</b></p><ul><li>أن يعرف المتدرب الخواص الكهربائية والميكانيكية للمحركات الكهربائية.</li><li>أن يعرف المتدرب تركيب المحركات الكهربائية لحمايتها من ظروف الجو المحيط.</li><li>أن يعرف المتدرب طرق التبريد المختلفة للمحركات الكهربائية.</li></ul>`,ref:'ص 44'}
   ]},

  {st:2,short:'مقدمة',title:'مقدمة: محركات التحريك وظروف تشغيلها',ref:'ص 45',
   q:'غبار ومطر واهتزاز وتوقف وانطلاق متكرر… ما الذي يجب أن يتصف به محرك يعمل في هذه الظروف؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="شبكتا تحريك: شبكة تيار مستمر بمحركي التوالي والمركب، وشبكة تيار متردد بالمحرك العام والحثي ثلاثي الأوجه، ومحرك مغلق محمي من الأتربة والأمطار" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="نظم التحريك بالتيار المستمر: تستخدم محركات التيار المستمر توصيلة التوالي والمركب."><rect x="188" y="44" width="150" height="104" rx="14" fill="#F2C14E" stroke="#2C4A40" stroke-width="3"/><text x="263" y="70" text-anchor="middle" font-size="13" font-weight="700" fill="#2C4A40">التيار المستمر</text><rect x="200" y="84" width="126" height="26" rx="8" fill="#FBF6EE"/><text x="263" y="102" text-anchor="middle" font-size="12" fill="#2C4A40">التوالي</text><rect x="200" y="114" width="126" height="26" rx="8" fill="#FBF6EE"/><text x="263" y="132" text-anchor="middle" font-size="12" fill="#2C4A40">المركب</text></g><g data-tip="شبكات التحريك للتيار المتردد: تستخدم محرك التوالي العام والمحرك الحثي ثلاثي الأوجه."><rect x="22" y="44" width="150" height="104" rx="14" fill="#4FB3A9" stroke="#2C4A40" stroke-width="3"/><text x="97" y="70" text-anchor="middle" font-size="13" font-weight="700" fill="#2C4A40">التيار المتردد</text><rect x="34" y="84" width="126" height="26" rx="8" fill="#FBF6EE"/><text x="97" y="102" text-anchor="middle" font-size="12" fill="#2C4A40">التوالي العام</text><rect x="34" y="114" width="126" height="26" rx="8" fill="#FBF6EE"/><text x="97" y="132" text-anchor="middle" font-size="12" fill="#2C4A40">الحثي ثلاثي الأوجه</text></g><g data-tip="محرك التحريك من النوع المغلق: لحمايته من الأتربة والغبار والأمطار والأجسام الغريبة."><rect x="130" y="188" width="100" height="70" rx="14" fill="#2C4A40"/><rect x="230" y="216" width="26" height="14" rx="3" fill="#2C4A40"/><text x="180" y="229" text-anchor="middle" font-size="13" font-weight="700" fill="#FBF6EE">مغلق</text></g><g data-tip="الأمطار: يجب ألا تصل إلى داخل المحرك."><path d="M70 182l-6 14M86 182l-6 14M102 182l-6 14M78 204l-6 14M94 204l-6 14" stroke="#4FB3A9" stroke-width="4" stroke-linecap="round"/><text x="84" y="240" text-anchor="middle" font-size="12" fill="#2C4A40">أمطار</text></g><g data-tip="الأتربة والغبار والأجسام الغريبة: يمنعها الإطار المغلق من الدخول."><circle cx="272" cy="186" r="4" fill="#B9852A"/><circle cx="288" cy="196" r="3" fill="#B9852A"/><circle cx="276" cy="204" r="5" fill="#B9852A"/><circle cx="296" cy="212" r="4" fill="#B9852A"/><circle cx="284" cy="220" r="3" fill="#B9852A"/><text x="286" y="244" text-anchor="middle" font-size="12" fill="#2C4A40">أتربة وغبار</text></g><text x="180" y="290" text-anchor="middle" font-size="13.5" font-weight="600" fill="#2C4A40">ظروف تشغيل قاسية جداً</text></svg>`,
   cap:'المحركات المستخدمة في كل نوع من شبكات التحريك، ومحرك مغلق يحميه إطاره من الجو المحيط.<br><b>مرّر المؤشر على البطاقتين والمحرك والأمطار والأتربة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'أي المحركات تستخدم في شبكات التحريك للتيار المتردد حسب الكتاب؟',opts:[
     ['محركا التيار المستمر التوالي والمركب',false,'هذان يستخدمان في نظم التحريك التي يستعمل فيها التيار المستمر.'],
     ['المحرك التزامني وحده',false,'لا يذكره الكتاب هنا.'],
     ['محرك التوالي العام والمحرك الحثي ثلاثي الأوجه',true,'نص الكتاب في ص 45، وهما المحركان اللذان درستهما في الدرس الأخير من الوحدة الثالثة.']]}}
   ],
   body:[
    {book:String.raw`<p>محركات التيار المستمر توصيلة التوالي والمركب تستخدم في نظم التحريك الكهربائي التي يستعمل فيها التيار المستمر، بينما يستخدم محرك التوالي العام والمحرك الحثي ثلاثي الأوجه في شبكات التحريك للتيار المتردد. ظروف التشغيل تكون دائماً <b>قاسية جداً</b>، لذلك يجب أن يخضع محرك التحريك لشروط صارمة عند التصميم، بحيث يكون المحرك ذا صلابة عالية ويكون من النوع المغلق، لحمايته من الأتربة والغبار والأمطار والأجسام الغريبة.</p>`,ref:'ص 45'},
    {watch:String.raw`<p>المقدمة تقول «النوع <b>المغلق</b>»، وتصنيف الأغلفة في الدرس التالي يقول «<b>المقفل</b>»؛ المعنى واحد.</p>`},
    {add:String.raw`<p>محرك القطار يُثبَّت عادةً أسفل العربة قرب الدواليب، فيتعرض مباشرة لما تثيره العجلات من غبار وماء وحصى، ويهتز مع كل وصلة في القضبان.</p>`}
   ]},

  {st:3,short:'عزم كبير عند البدء',title:'الخواص العامة — 1. عزم كبير أثناء بدء الحركة',ref:'ص 45',
   q:'متى يحتاج القطار إلى أكبر قوة جر: وهو يبدأ الحركة، أم وهو يسير بسرعة منتظمة، أم وهو يصعد مرتفعاً؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ثلاثة أعمدة لقوة الجر: بدء الحركة يحتاج قوة التسارع وقوة مقاومة الحركة، والانطلاق الحر يحتاج مقاومة الحركة فقط، والصعود يضيف قوة الجاذبية" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><rect x="28" y="36" width="304" height="252" rx="12" fill="#FBF6EE"/><line x1="44" y1="226" x2="316" y2="226" stroke="#2C4A40" stroke-width="2.5"/><g data-tip="قوة مقاومة حركة القطار: مطلوبة في كل المراحل."><rect x="246" y="186" width="56" height="40" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/><rect x="152" y="186" width="56" height="40" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/><rect x="58" y="186" width="56" height="40" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/></g><g data-tip="قوة التسارع: مطلوبة أثناء بدء الحركة والتسارع للحصول على التسارع المطلوب."><rect x="246" y="96" width="56" height="90" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/></g><g data-tip="قوة إضافية للتغلب على تأثير الجاذبية الأرضية: مطلوبة أثناء صعود المرتفعات."><rect x="58" y="128" width="56" height="58" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/></g><text x="274" y="246" text-anchor="middle" font-size="12" font-weight="700" fill="#2C4A40">بدء الحركة</text><text x="274" y="262" text-anchor="middle" font-size="12" fill="#2C4A40">والتسارع</text><text x="180" y="246" text-anchor="middle" font-size="12" font-weight="700" fill="#2C4A40">الانطلاق الحر</text><text x="180" y="262" text-anchor="middle" font-size="12" fill="#2C4A40">بسرعة منتظمة</text><text x="86" y="246" text-anchor="middle" font-size="12" font-weight="700" fill="#2C4A40">صعود</text><text x="86" y="262" text-anchor="middle" font-size="12" fill="#2C4A40">المرتفعات</text><g font-size="11.5" fill="#2C4A40"><rect x="226" y="50" width="12" height="12" fill="#E8735A"/><text x="220" y="61" text-anchor="end">تسارع</text><rect x="160" y="50" width="12" height="12" fill="#4FB3A9"/><text x="154" y="61" text-anchor="end">مقاومة</text><rect x="94" y="50" width="12" height="12" fill="#F2C14E"/><text x="88" y="61" text-anchor="end">جاذبية</text></g></svg>`,
   cap:'رسم توضيحي بلا مقياس: ما تحتاجه كل مرحلة من قوى الجر حسب نص الكتاب. طول الأعمدة للمقارنة فقط.<br><b>مرّر المؤشر على كل لون (أو المسه في الجوال) لتعرف القوة التي يمثلها.</b>',
   side:[
    {predict:{q:'في أي مرحلة يكون المطلوب هو قوة التغلب على مقاومة حركة القطار <b>فقط</b>؟',opts:[
     ['أثناء بدء الحركة والتسارع',false,'هنا تلزم أيضاً قوة كبيرة للحصول على التسارع المطلوب.'],
     ['أثناء الانطلاق الحر بسرعة منتظمة',true,'نص الكتاب في ص 45: «بينما يكون المطلوب أثناء فترة الانطلاق الحر بسرعة منتظمة هو قوة التحريك اللازمة للتغلب على المقاومة لحركة القطار فقط».'],
     ['أثناء صعود المرتفعات',false,'هنا تلزم قوة جر إضافية للتغلب على تأثير الجاذبية الأرضية.']]}}
   ],
   body:[
    {book:String.raw`<p>الخواص الكهربائية والميكانيكية العامة المطلوبة لمحركات التحريك هي:</p>
     <p><b>1. عزم كبير أثناء بدء الحركة:</b> أثناء بدء الحركة والتسارع تحتاج القاطرة الكهربائية لقوة تحريك كبيرة للحصول على التسارع المطلوب بالإضافة إلى قوة التحريك اللازمة للتغلب على مقاومة حركة القطار، بينما يكون المطلوب أثناء فترة الانطلاق الحر بسرعة منتظمة هو قوة التحريك اللازمة للتغلب على المقاومة لحركة القطار فقط. أثناء صعود المرتفعات تلزم قوة جر إضافية للتغلب على تأثير الجاذبية الأرضية بالإضافة إلى القوى سابقة الذكر. ولابد أن يبذل المحرك عزماً كبيراً أثناء فترة البدء للحصول على قوة التحريك الكبيرة المطلوبة أثناء بدء الحركة.</p>`,ref:'ص 45'},
    {tip:String.raw`<p>القوة التي تدفع القطار تأتي من عزم المحرك عن طريق الدواليب؛ لذلك «قوة جر كبيرة» تعني «عزماً كبيراً من المحرك». وأصعب حالة أن يبدأ القطار حركته وهو على مرتفع: تجتمع قوى التسارع والمقاومة والجاذبية معاً.</p>
     <p>في المختبر (أ) تجد هذه القوى محسوبة بأرقام التمرين <span class="ltr">5-4</span> من الكتاب، وستدرس حسابها في الوحدة الخامسة.</p>`}
   ]},

  {st:4,short:'التوالي والتحكم والفرملة',title:'الخواص العامة — 2. خصائص التوالي، 3. بساطة التحكم، 4. الفرامل الكهربائية',ref:'ص 45',
   q:'لماذا يتمنى مصمم القطار أن يتصرف كل محرك جر كمحرك التوالي؟ وماذا يطلب أيضاً عند التحكم والوقوف؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ثلاث بطاقات: منحنى السرعة مع العزم لمحرك التوالي، ومقبض تحكم في السرعة، وفرامل كهربائية بثلاث طرق" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="الخاصية 2: أن تكون العلاقة بين السرعة والعزم كما في محركات التوالي للتيار المستمر: سرعة منخفضة مع عزم كبير، وسرعة عالية مع عزم صغير."><rect x="190" y="46" width="146" height="132" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M210 62V150H322" fill="none" stroke="#2C4A40" stroke-width="2"/><path d="M220 66C232 118 262 138 318 144" fill="none" stroke="#E8735A" stroke-width="4" stroke-linecap="round"/><text x="222" y="72" text-anchor="middle" font-size="11" font-weight="700" fill="#2C4A40">n</text><text x="318" y="164" text-anchor="middle" font-size="11" font-weight="700" fill="#2C4A40">T</text><text x="263" y="172" text-anchor="middle" font-size="12" font-weight="700" fill="#2C4A40">خصائص التوالي</text></g><g data-tip="الخاصية 3: بساطة التحكم في السرعة؛ يجب أن تكون طرق التحكم سهلة التنفيذ."><rect x="24" y="46" width="146" height="132" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M57 128A40 40 0 0 1 137 128" fill="none" stroke="#4FB3A9" stroke-width="10" stroke-linecap="round"/><line x1="97" y1="128" x2="122" y2="98" stroke="#2C4A40" stroke-width="5" stroke-linecap="round"/><circle cx="97" cy="128" r="9" fill="#2C4A40"/><text x="97" y="166" text-anchor="middle" font-size="12" font-weight="700" fill="#2C4A40">تحكم سهل في السرعة</text></g><g data-tip="الخاصية 4: قابلية المحرك لتطبيق الفرامل الكهربائية بسهولة: الديناميكية، وبإعادة التوليد، وباستخدام التيار المعكوس أو التبديل (الوحدة السادسة)."><rect x="40" y="194" width="280" height="88" rx="14" fill="#F2C14E" stroke="#2C4A40" stroke-width="3"/><text x="180" y="218" text-anchor="middle" font-size="13" font-weight="700" fill="#2C4A40">الفرامل الكهربائية</text><rect x="228" y="232" width="80" height="34" rx="8" fill="#FBF6EE"/><text x="268" y="254" text-anchor="middle" font-size="11.5" fill="#2C4A40">الديناميكية</text><rect x="140" y="232" width="80" height="34" rx="8" fill="#FBF6EE"/><text x="180" y="254" text-anchor="middle" font-size="11.5" fill="#2C4A40">إعادة التوليد</text><rect x="52" y="232" width="80" height="34" rx="8" fill="#FBF6EE"/><text x="92" y="254" text-anchor="middle" font-size="11.5" fill="#2C4A40">التيار المعكوس</text></g></svg>`,
   cap:'الخواص الثانية والثالثة والرابعة.<br><b>مرّر المؤشر على كل بطاقة (أو المسها في الجوال) لتعرف الخاصية التي تمثلها.</b>',
   side:[
    {predict:{q:'أي هذه <b>ليست</b> من طرق الفرامل الكهربائية التي يذكرها الكتاب هنا؟',opts:[
     ['الفرامل الديناميكية',false,'مذكورة في البند 4.'],
     ['الفرامل بإعادة التوليد',false,'مذكورة في البند 4.'],
     ['الفرامل باستخدام التيار المعكوس أو التبديل',false,'مذكورة في البند 4.'],
     ['الفرامل الهوائية',true,'الفرامل الهوائية فرامل ميكانيكية لا كهربائية. الكتاب يذكر ثلاث طرق كهربائية: الديناميكية، وبإعادة التوليد، وبالتيار المعكوس أو التبديل.']]}}
   ],
   body:[
    {book:String.raw`<p><b>2. أن تكون لها خصائص محركات التوالي:</b> من المرغوب فيه أن تكون العلاقة بين السرعة والعزم في محركات التحريك كما هي في محركات التوالي للتيار المستمر.</p>
     <p><b>3. بساطة التحكم في سرعة المحرك:</b> يجب أن تكون الطرق المستخدمة للتحكم في محركات التحريك سهلة التنفيذ.</p>
     <p><b>4. قابليتها للتعديل لاستخدام الفرامل الكهربائية:</b> يجب أن تكون محركات التحريك قابلة لتطبيق الطرق المختلفة للفرامل الكهربائية عليها بسهولة، مثل الفرامل الديناميكية والفرامل بإعادة التوليد والفرامل باستخدام التيار المعكوس أو التبديل.</p>`,ref:'ص 45'},
    {tip:String.raw`<p><b>خصائص التوالي</b> (الدرس الأول من الوحدة الثالثة): عند البدء والصعود يعطي المحرك عزماً كبيراً بسرعة منخفضة، وعلى الأرض المستوية يسرع وحده؛ أي يضبط سرعته ذاتياً مع الحمل.</p>
     <p><b>الفرامل الكهربائية</b> تعني أن المحرك نفسه يساعد على إيقاف القطار؛ وطرقها الثلاث موضوع الوحدة السادسة.</p>`}
   ]},

  {st:5,short:'الجهد المفاجئ والانقطاع',title:'الخواص العامة — 5. تحمل الارتفاع المفاجئ في الجهد، 6. تحمل الانقطاع المؤقت',ref:'ص 45–46',
   q:'الجهد يرتفع فجأة مرة، وينقطع لحظة مرة أخرى. لماذا يكون الخطر في الحالتين تياراً كبيراً؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="رسم توضيحي: جهد الشبكة مع الزمن فيه ارتفاع مفاجئ ثم انقطاع مؤقت، وتحته تيار المحرك يقفز في الحالتين" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><rect x="24" y="30" width="316" height="262" rx="12" fill="#FBF6EE"/><text x="40" y="52" text-anchor="start" font-size="12.5" font-weight="700" fill="#2C4A40" direction="ltr">V</text><path d="M50 50V140H326" fill="none" stroke="#2C4A40" stroke-width="2"/><path d="M50 100H110V72H140V100H200V140H236V100H322" fill="none" stroke="#2C4A40" stroke-width="4" stroke-linejoin="round"/><g data-tip="ارتفاع مفاجئ في الجهد: يحدث بسبب عمل أحد قواطع التيار لإزالة خطأ ما بشبكة التحريك."><rect x="104" y="60" width="42" height="44" fill="#E8735A" opacity="0.25"/><text x="125" y="54" text-anchor="middle" font-size="11.5" font-weight="700" fill="#2C4A40">ارتفاع</text></g><g data-tip="انقطاع مؤقت لمصدر الجهد: قد يحدث عند تقاطع الطرق والانتقال من شبكة جر إلى أخرى."><rect x="196" y="92" width="44" height="50" fill="#4FB3A9" opacity="0.3"/><text x="218" y="84" text-anchor="middle" font-size="11.5" font-weight="700" fill="#2C4A40">انقطاع</text></g><text x="40" y="172" text-anchor="start" font-size="12.5" font-weight="700" fill="#2C4A40" direction="ltr">I</text><path d="M50 170V262H326" fill="none" stroke="#2C4A40" stroke-width="2"/><path d="M50 230H110L114 186L146 214L150 230H200V262H236L240 182C252 200 270 222 322 230" fill="none" stroke="#12855A" stroke-width="4" stroke-linejoin="round"/><g data-tip="زيادة مفاجئة في التيار نتيجة ارتفاع الجهد؛ يجب على المحرك أن يتحملها دون ضرر."><circle cx="114" cy="186" r="7" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/></g><g data-tip="عند عودة الجهد: تكون القوة الدافعة الكهربائية العكسية قد انخفضت كثيراً، فيمر تيار كبير في المحرك."><circle cx="240" cy="182" r="7" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/></g><text x="300" y="282" text-anchor="middle" font-size="11.5" fill="#2C4A40">الزمن</text><text x="180" y="282" text-anchor="middle" font-size="11.5" fill="#2C4A40">رسم توضيحي بلا مقياس</text></svg>`,
   cap:'فوق: جهد الشبكة مع الزمن. تحت: تيار المحرك. في الحالتين يقفز التيار (الدائرتان البرتقاليتان).<br><b>مرّر المؤشر على المنطقتين الملونتين والدائرتين (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'ما سبب الارتفاع المفاجئ في الجهد حسب الكتاب؟',opts:[
     ['عمل أحد قواطع التيار لإزالة خطأ ما بشبكة التحريك',true,'نص الكتاب في ص 46.'],
     ['صعود القطار مرتفعاً',false,'الصعود يزيد الحمل والتيار، لكنه لا يرفع جهد الشبكة.'],
     ['الانتقال من شبكة جر إلى أخرى',false,'هذا سبب <b>الانقطاع المؤقت</b> (البند 6)، لا الارتفاع المفاجئ.']]}}
   ],
   body:[
    {book:String.raw`<p><b>5. قابليتها لتحمل الارتفاع المفاجئ في الجهد:</b> يحدث في بعض الأحيان ارتفاع مفاجئ في الجهد، بسبب عمل أحد قواطع التيار لإزالة خطأ ما بشبكة التحريك. هذا الارتفاع المفاجئ يسبب زيادة مفاجئة في التيار، يجب على المحرك أن يتحملها دون إحداث أي ضرر به.</p>
     <p><b>6. تحمل الانقطاع المؤقت لمصدر الجهد:</b> الانقطاع المؤقت لمصدر الجهد قد يحدث عند تقاطع الطرق والانتقال من شبكة جر إلى أخرى. عند إعادة جهد المصدر، ربما تكون القوة الدافعة الكهربائية العكسية قد انخفضت كثيراً عن قيمتها الأولى، مما يتسبب في مرور تيار كبير في المحرك.</p>`,ref:'ص 45–46'},
    {title:'لماذا يقفز التيار بعد عودة الجهد؟',widget:(el,B)=>{
      const S=['انقطع الجهد','انقطع تيار المنتج، فاختفى مجال ملف التوالي','انخفضت القوة الدافعة العكسية E كثيراً','عاد الجهد V','الفرق V − E كبير والمقاومة صغيرة','يمر تيار كبير في المحرك'];
      el.innerHTML=`<p class="sub" style="margin:0 0 10px">اضغط «انقطاع ثم عودة» وتابع السلسلة في محرك جر من نوع التوالي.</p><div class="chain">${S.map((s,i)=>`<span class="ck${i===S.length-1?' end':''}">${s}</span>${i<S.length-1?'<span class="ar">←</span>':''}`).join('')}</div><div class="w-row"><button class="btn pri" type="button" data-go>انقطاع ثم عودة</button><button class="btn" type="button" data-rs>إعادة</button></div>`;
      el.querySelectorAll('.ck').forEach(k=>{k.innerHTML=k.innerHTML.replace(/V − E|E|V/g,m=>`<span class="ltr">${m}</span>`)});
      const ks=[...el.querySelectorAll('.ck')];let tm=[];
      const rs=()=>{tm.forEach(clearTimeout);tm=[];ks.forEach(k=>k.classList.remove('on'))};
      el.querySelector('[data-go]').onclick=()=>{rs();ks.forEach((k,i)=>tm.push(setTimeout(()=>k.classList.add('on'),i*550)))};
      el.querySelector('[data-rs]').onclick=rs;
    }},
    {tip:String.raw`<p>تيار المنتج يحدده الفرق بين جهد المصدر والقوة الدافعة العكسية: \(I_a=\dfrac{V-E}{R}\)، و\(R\) صغيرة. و\(E\propto\phi\,n\).</p>
     <ul><li><b>الارتفاع المفاجئ:</b> السرعة لا تتغير لحظياً فيبقى \(E\) كما هو، فأي زيادة في \(V\) تزيد التيار فوراً.</li>
     <li><b>الانقطاع المؤقت:</b> تنخفض السرعة قليلاً، وفي محرك التوالي يختفي المجال لأن تياره انقطع؛ فعند عودة الجهد يكون \(E\) صغيراً جداً فيقفز التيار.</li></ul>
     <p>هذه العلاقات من دروس آلات التيار المستمر، وليست في نص هذه الصفحة. وفي المختبر (ب) تشاهد الحالتين على محرك جر توالٍ.</p>`}
   ]},

  {st:6,short:'الصلابة والوزن',title:'الخواص العامة — 7. الصلابة، 8. وزن وحجم المحرك',ref:'ص 46',
   q:'محرك تحت عربة قطار، بين الدواليب، يهتز طوال الرحلة. ماذا نطلب من هيكله ووزنه وحجمه؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="عربة قطار من الجانب، ومحرك الجر مثبت أسفلها بين الدواليب في مكان ضيق" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><rect x="40" y="70" width="280" height="96" rx="16" fill="#4FB3A9" stroke="#2C4A40" stroke-width="3"/><rect x="62" y="88" width="50" height="36" rx="6" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><rect x="124" y="88" width="50" height="36" rx="6" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><rect x="186" y="88" width="50" height="36" rx="6" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><rect x="248" y="88" width="50" height="36" rx="6" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><line x1="24" y1="236" x2="336" y2="236" stroke="#2C4A40" stroke-width="5"/><circle cx="94" cy="214" r="20" fill="#2C4A40"/><circle cx="94" cy="214" r="6" fill="#FBF6EE"/><circle cx="266" cy="214" r="20" fill="#2C4A40"/><circle cx="266" cy="214" r="6" fill="#FBF6EE"/><g data-tip="المكان المخصص لتثبيت المحرك محدود وضيق (بين الدواليب وأسفل العربة)؛ لذلك يجب الإنقاص من حجم المحرك."><rect x="122" y="168" width="116" height="62" rx="6" fill="none" stroke="#E8735A" stroke-width="2.5" stroke-dasharray="7 5"/></g><g data-tip="محرك التحريك: يجب أن يكون صلباً في هيكله الخارجي وتركيبه الداخلي ليتحمل عزم التحريك الكبير، وخفيفاً قدر الإمكان لسهولة تثبيته مع دواليب الحركة وللتوفير في الطاقة."><rect x="140" y="176" width="80" height="46" rx="10" fill="#2C4A40"/><text x="180" y="204" text-anchor="middle" font-size="12.5" font-weight="700" fill="#FBF6EE">المحرك</text><line x1="140" y1="200" x2="114" y2="208" stroke="#2C4A40" stroke-width="5" stroke-linecap="round"/></g><g data-tip="الاهتزاز والارتجاج أثناء حركة القطار: يجب أن يتحملهما المحرك."><path d="M128 260l8 -8l8 8l8 -8l8 8M200 260l8 -8l8 8l8 -8l8 8" fill="none" stroke="#E8735A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><text x="180" y="282" text-anchor="middle" font-size="12" font-weight="700" fill="#2C4A40">اهتزاز وارتجاج</text></g><text x="180" y="56" text-anchor="middle" font-size="13.5" font-weight="700" fill="#2C4A40">عربة قطار (منظر جانبي مبسط)</text></svg>`,
   cap:'محرك الجر في مكان ضيق أسفل العربة، مربوط بالدواليب، ويتعرض للاهتزاز طوال الرحلة.<br><b>مرّر المؤشر على المحرك والإطار المتقطع وعلامات الاهتزاز (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'لماذا يجب إنقاص وزن محرك التحريك حسب الكتاب؟',opts:[
     ['لتقل سرعته القصوى',false,'الوزن لا علاقة له هنا بالسرعة القصوى.'],
     ['لأن الوزن الكبير يرفع جهد الشبكة',false,'لا علاقة بين وزن المحرك وجهد الشبكة.'],
     ['لسهولة تثبيته مع دواليب الحركة، وللتوفير في الطاقة المستهلكة',true,'نص الكتاب في ص 46. أما الحجم فيُنقص بسبب محدودية وضيق المكان المخصص لتثبيته.']]}}
   ],
   body:[
    {book:String.raw`<p><b>7. الصلابة:</b> يجب أن تكون محركات التحريك صلبة في هيكلها الخارجي وتركيبها الداخلي، لتتحمل عزم التحريك الكبير كما تتحمل الاهتزاز والارتجاج الذي تتعرض لهما أثناء حركة القطار.</p>
     <p><b>8. وزن وحجم المحرك:</b> يجب إنقاص وزن محرك التحريك بقدر الإمكان لسهولة تثبيته مع دواليب الحركة، وللتوفير في الطاقة المستهلكة. يجب أيضاً الحرص على الإنقاص من حجم محرك التحريك بسبب محدودية وضيق المكان المخصص لتثبيته.</p>`,ref:'ص 46'},
    {tip:String.raw`<table class="tt"><thead><tr><th>الخاصية</th><th>لماذا تُطلب؟</th></tr></thead><tbody>
     <tr><td>1. عزم بدء كبير</td><td>البدء والتسارع والصعود تحتاج أكبر قوة جر</td></tr>
     <tr><td>2. خصائص التوالي</td><td>المحرك يخفض سرعته ويرفع عزمه بنفسه مع الحمل</td></tr>
     <tr><td>3. بساطة التحكم في السرعة</td><td>تغيير السرعة كثير في القطار</td></tr>
     <tr><td>4. الفرامل الكهربائية</td><td>الوقوف المتكرر والنزول من المرتفعات</td></tr>
     <tr><td>5. تحمل الارتفاع المفاجئ في الجهد</td><td>عمل القواطع في الشبكة يرفع الجهد فجأة فيزيد التيار</td></tr>
     <tr><td>6. تحمل الانقطاع المؤقت</td><td>عند عودة الجهد يكون الجهد العكسي قد انخفض فيمر تيار كبير</td></tr>
     <tr><td>7. الصلابة</td><td>العزم الكبير والاهتزاز والارتجاج</td></tr>
     <tr><td>8. وزن وحجم صغيران</td><td>سهولة التثبيت مع الدواليب، توفير الطاقة، ضيق المكان</td></tr></tbody></table>`,title:'الخواص الثماني في جدول'},
    {add:String.raw`<p>كل كيلوغرام زائد في محرك الجر يُحمل ذهاباً وإياباً في كل رحلة طوال عمر القطار، ويُسرَّع ويُوقف عند كل محطة؛ لذلك ينعكس الوزن مباشرة على الطاقة المستهلكة.</p>`}
   ]},

  {recap:[
   String.raw`ظروف تشغيل محرك التحريك قاسية جداً، فيجب أن يكون صلباً ومن النوع المغلق (ص 45).`,
   String.raw`أكبر قوة جر تلزم عند البدء والتسارع، وعند الصعود تُضاف قوة للتغلب على الجاذبية؛ فيلزم عزم كبير عند البدء (ص 45).`,
   String.raw`يُطلب منه: خصائص التوالي، وبساطة التحكم في السرعة، وقابلية الفرامل الكهربائية (الديناميكية، وإعادة التوليد، والتيار المعكوس) (ص 45).`,
   String.raw`ويجب أن يتحمل الارتفاع المفاجئ في الجهد والانقطاع المؤقت (وكلاهما يسبب تياراً كبيراً)، وأن يكون صلباً وخفيفاً وصغير الحجم (ص 46).`]}
],
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
 {k:'rain',n:'المحمي ضد الأمطار',d:'الفتحات المخصصة لتبريد المحرك مصممة بحيث لا تسمح بدخول الأمطار أو السوائل وذرات الغبار الساقطة على الآلة أو أن تأتي من جانبي الآلة بزاوية لا تزيد عن <span class="bkb" data-bk="rain">مئة درجة</span><span class="bkf" data-bk="rain">ستين درجة</span> من الاتجاه الرأسي. '+B.bkCtl('rain')+'<span class="bkf blk sub" data-bk="rain"> المصحح: الكتاب كتب «مئة درجة»، لكن مئة درجة من الخط الرأسي تعني مطراً يأتي من تحت مستوى المحرك، وهذا غير ممكن. الرقم المعتاد لهذا النوع من الحماية في المعايير هو ستون درجة من الاتجاه الرأسي (إضافة من خارج الكتاب).</span>',u:'تحت الأمطار المباشرة.',c:'هواء عبر فتحات محمية من المطر.'},
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
 stations:[
  {intro:true},

  {st:1,short:'الإطار الخارجي',title:'طرق الوقاية المختلفة للمحركات الكهربائية وكيفية تبريدها',ref:'ص 47',
   q:'لو أغلقنا المحرك تماماً لحميناه من كل شيء… فلماذا لا تُصنع كل المحركات مغلقة تماماً؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="محرك يحيط به إطار خارجي يصد الرطوبة والأتربة والأجسام الغريبة والأبخرة، بينما تخرج منه الحرارة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="الإطار الخارجي للمحرك: يحميه من ظروف الجو المحيط، ويجب ألا يؤثر سلباً على تبريده."><rect x="110" y="110" width="140" height="100" rx="18" fill="#2C4A40"/><rect x="128" y="128" width="104" height="64" rx="10" fill="#CFE6DB"/><text x="180" y="166" text-anchor="middle" font-size="13" font-weight="700" fill="#2C4A40">المحرك</text><rect x="250" y="152" width="34" height="16" rx="3" fill="#2C4A40"/></g><g data-tip="الرطوبة: من ظروف الجو المحيط التي يحمي منها الإطار."><path d="M60 70l-6 14M76 70l-6 14M92 70l-6 14" stroke="#4FB3A9" stroke-width="4" stroke-linecap="round"/><text x="74" y="104" text-anchor="middle" font-size="12" fill="#2C4A40">رطوبة</text></g><g data-tip="الأوساخ والأتربة: يحمي منها الإطار."><circle cx="282" cy="74" r="4" fill="#B9852A"/><circle cx="296" cy="84" r="3" fill="#B9852A"/><circle cx="284" cy="92" r="5" fill="#B9852A"/><text x="288" y="114" text-anchor="middle" font-size="12" fill="#2C4A40">أتربة</text></g><g data-tip="الأجسام الغريبة: مثل العدد الصغيرة والقوارض؛ يمنعها الإطار من الدخول."><rect x="48" y="214" width="40" height="10" rx="3" fill="#7A8F86" transform="rotate(-20 68 219)"/><text x="68" y="250" text-anchor="middle" font-size="12" fill="#2C4A40">أجسام غريبة</text></g><g data-tip="الأبخرة والمواد القابلة للاشتعال: قد تتسرب إلى المحرك؛ والإطار يحمي منها."><path d="M282 214q-8 -10 0 -20q8 -10 0 -20M298 214q-8 -10 0 -20q8 -10 0 -20" fill="none" stroke="#E8735A" stroke-width="3.5" stroke-linecap="round"/><text x="290" y="236" text-anchor="middle" font-size="12" fill="#2C4A40">أبخرة</text></g><g data-tip="الحرارة: يجب أن تخرج من المحرك؛ فالإطار يحمي دون أن يمنع التبريد."><path d="M160 102q-6 -10 0 -20M180 102q-6 -10 0 -20M200 102q-6 -10 0 -20" fill="none" stroke="#E8735A" stroke-width="3" stroke-linecap="round"/><text x="180" y="72" text-anchor="middle" font-size="12" font-weight="700" fill="#2C4A40">حرارة</text></g><text x="180" y="286" text-anchor="middle" font-size="13.5" font-weight="600" fill="#2C4A40">حماية بلا إضرار بالتبريد</text></svg>`,
   cap:'الإطار الخارجي يصد ما يأتي من الجو المحيط، لكن عليه أن يسمح بخروج الحرارة.<br><b>مرّر المؤشر على الإطار وما حوله (أو المسه في الجوال) لتعرف معناه.</b>',
   side:[
    {predict:{q:'ما الشرط الذي يضعه الكتاب على الإطار الخارجي إلى جانب الحماية؟',opts:[
     ['ألا يؤثر سلباً على تبريد المحرك',true,'نص الكتاب في ص 47: «وفي الوقت نفسه لا يجب أن يؤثر الإطار سلباً على تبريد المحرك».'],
     ['أن يكون مصنوعاً من البلاستيك',false,'الكتاب لا يحدد مادة الإطار.'],
     ['أن يكون مفتوحاً من الطرفين دائماً',false,'هذا نوع واحد فقط من الأغلفة الثمانية (المفتوح).']]}}
   ],
   body:[
    {book:String.raw`<p>يستخدم <b>الإطار الخارجي</b> للمحرك لتوفير الحماية للمحرك من ظروف الجو المحيط، مثل، الرطوبة والأوساخ والأتربة والأجسام الغريبة، وما قد يتسرب للمحرك من أبخرة ومواد قابلة للاشتعال، وفي الوقت نفسه <b>لا يجب أن يؤثر الإطار سلباً على تبريد المحرك</b>. هناك عدة أنواع من الأغلفة التي تستخدم في المحركات لتوفير درجات مختلفة من الحماية، ولمراعاة ظروف التشغيل المحيطة بنظام التحريك الكهربائي:</p>`,ref:'ص 47'},
    {tip:String.raw`<p>المفاضلة كلها في سطر: <b>كلما زادت الحماية قلّت الفتحات وصعب التبريد</b>. لذلك تتدرج الأنواع الثمانية من المفتوح (أفضل تبريد وأقل حماية) إلى المقفل والمصمم ضد الانفجار، ولكل نوع حل خاص للتبريد. ستراها في المحطات التالية مثنى مثنى.</p>`,title:'الفكرة في سطر'}
   ]},

  {st:2,short:'المفتوح والمحمي بشبكة',title:'1. النوع المفتوح، 2. النوع المحمي بشبكة',ref:'ص 47',
   q:'كلاهما يُدخل الهواء المحيط إلى داخل المحرك. فما الذي تضيفه الشبكة، وما الذي لا تمنعه؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="محركان: الأول مفتوح من طرفيه والهواء يمر خلاله، والثاني فتحاته مغطاة بشبكة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="النوع المفتوح: مفتوح من كلا طرفيه، فالعضوان الثابت والدوار في اتصال مباشر مع الهواء المحيط (تبريد حر). يستخدم في آلات التيار المستمر الكبيرة الحجم."><rect x="198" y="96" width="120" height="96" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><line x1="198" y1="96" x2="198" y2="192" stroke="#FBF6EE" stroke-width="5"/><line x1="318" y1="96" x2="318" y2="192" stroke="#FBF6EE" stroke-width="5"/><circle cx="258" cy="144" r="30" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2.5"/><path d="M178 128H214M178 160H214M302 128H338M302 160H338" stroke="#4FB3A9" stroke-width="4" stroke-linecap="round"/><polygon points="220,128 210,122 210,134" fill="#4FB3A9"/><polygon points="220,160 210,154 210,166" fill="#4FB3A9"/><polygon points="344,128 334,122 334,134" fill="#4FB3A9"/><polygon points="344,160 334,154 334,166" fill="#4FB3A9"/><text x="258" y="222" text-anchor="middle" font-size="13" font-weight="700" fill="#2C4A40">1. المفتوح</text></g><g data-tip="النوع المحمي بشبكة: فتحات كبيرة للتبريد الحر مغطاة بشبكة تمنع دخول الفئران والزواحف وسقوط العدد الصغيرة، لكنها لا تحمي من الأوساخ والأتربة والأمطار والمواد القابلة للاشتعال."><rect x="42" y="96" width="120" height="96" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><circle cx="102" cy="144" r="30" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2.5"/><g stroke="#2C4A40" stroke-width="1.5"><rect x="50" y="106" width="22" height="76" fill="none"/><line x1="50" y1="118" x2="72" y2="118"/><line x1="50" y1="130" x2="72" y2="130"/><line x1="50" y1="142" x2="72" y2="142"/><line x1="50" y1="154" x2="72" y2="154"/><line x1="50" y1="166" x2="72" y2="166"/><line x1="61" y1="106" x2="61" y2="182"/><rect x="132" y="106" width="22" height="76" fill="none"/><line x1="132" y1="118" x2="154" y2="118"/><line x1="132" y1="130" x2="154" y2="130"/><line x1="132" y1="142" x2="154" y2="142"/><line x1="132" y1="154" x2="154" y2="154"/><line x1="132" y1="166" x2="154" y2="166"/><line x1="143" y1="106" x2="143" y2="182"/></g><text x="102" y="222" text-anchor="middle" font-size="13" font-weight="700" fill="#2C4A40">2. المحمي بشبكة</text></g><text x="180" y="62" text-anchor="middle" font-size="13.5" font-weight="700" fill="#2C4A40">تبريد حر بالهواء المحيط</text><text x="180" y="270" text-anchor="middle" font-size="12.5" fill="#2C4A40">الأسهم الفيروزية = هواء التبريد</text></svg>`,
   cap:'النوعان يبردان تبريداً حراً بالهواء المحيط؛ والشبكة تمنع الأجسام الكبيرة فقط.<br><b>مرّر المؤشر على كل محرك (أو المسه في الجوال) لتعرف وصفه وأماكن استعماله.</b>',
   side:[
    {predict:{q:'من أي شيء <b>لا</b> يحمي النوع المحمي بشبكة؟',opts:[
     ['الفئران والزواحف',false,'الشبكة وُضعت أصلاً لمنع دخولها.'],
     ['سقوط العدد الصغيرة مثل المفكات',false,'الشبكة تمنع ذلك أيضاً.'],
     ['الأوساخ والأتربة والأمطار',true,'نص الكتاب في ص 47: «ولكنها لا توفر الحماية من الأوساخ والأتربة والأمطار أو المواد القابلة للاشتعال».']]}}
   ],
   body:[
    {book:String.raw`<p><b>1. النوع المفتوح:</b> في هذا النوع يكون المحرك مفتوحاً من كلا طرفيه، وهذا النوع يوفر تبريداً حراً للمحرك، حيث يكون كل من العضوين الثابت والدوار في اتصال مباشر مع الهواء المحيط، ويستخدم في آلات التيار المستمر الكبيرة الحجم.</p>
     <p><b>2. النوع المحمي بشبكة:</b> في هذا النوع يحتوي الغلاف الخارجي للآلة على فتحات كبيرة للتبريد الحر، هذه الفتحات مغطاة بشبكة لمنع دخول الفئران والزواحف، أو سقوط العدد الصغيرة مثل المفكات… إلخ، داخل الآلة، ولكنها لا توفر الحماية من الأوساخ والأتربة والأمطار أو المواد القابلة للاشتعال. تستعمل هذه المحركات حيث يكون الجو المحيط نظيفاً خالياً من الأوساخ والغبار والمواد الكيميائية.</p>`,ref:'ص 47'},
    {add:String.raw`<p>مكان مناسب للمحمي بشبكة: غرفة مضخات نظيفة داخل مبنى مغلق. ومكان غير مناسب: ورشة نجارة أو مصنع إسمنت، حيث الغبار في الهواء نفسه الذي يدخل المحرك.</p>`}
   ]},

  {st:3,short:'السوائل والأمطار',title:'3. المحمي ضد تناثر السوائل والغبار، 4. المحمي ضد الأمطار',ref:'ص 47',
   q:'محرك يعمل في العراء تحت المطر مباشرة. هل يكفيه أن يمنع القطرات المتناثرة فقط؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="محرك محمي ضد الأمطار: قطرات تسقط من أعلى ومن الجانبين ضمن زاوية محددة من الاتجاه الرأسي، وفتحات التبريد لا تسمح بدخولها" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><g class="bkb" data-bk="rain" data-tip="المنطقة المظللة: الاتجاهات التي قد يأتي منها المطر من أعلى ومن جانبي الآلة، بزاوية لا تزيد عن مئة درجة من الاتجاه الرأسي (النوع 4)."><path d="M180 196L52 218.6A130 130 0 1 1 308 218.6Z" fill="#4FB3A9" opacity="0.22"/><line x1="180" y1="196" x2="180" y2="56" stroke="#2C4A40" stroke-width="2" stroke-dasharray="6 5"/><path d="M180 136A60 60 0 0 1 239.1 206.4" fill="none" stroke="#2C4A40" stroke-width="2.5"/><text x="292" y="168" text-anchor="middle" font-size="12.5" font-weight="700" fill="#2C4A40">مئة درجة</text></g><g class="bkf" data-bk="rain" data-tip="المصحح: المنطقة المظللة هي الاتجاهات التي قد يأتي منها المطر، بزاوية لا تزيد عن ستين درجة من الاتجاه الرأسي على كل جانب (إضافة من خارج الكتاب)."><path d="M180 196L67.4 131A130 130 0 0 1 292.6 131Z" fill="#4FB3A9" opacity="0.22"/><line x1="180" y1="196" x2="180" y2="56" stroke="#2C4A40" stroke-width="2" stroke-dasharray="6 5"/><path d="M180 136A60 60 0 0 1 232 166" fill="none" stroke="#2C4A40" stroke-width="2.5"/><text x="262" y="122" text-anchor="middle" font-size="12.5" font-weight="700" fill="#2C4A40">ستون درجة</text></g><g data-tip="قطرات المطر والسوائل: فتحات التبريد في النوع المحمي ضد الأمطار مصممة بحيث لا تسمح بدخولها."><path d="M120 70l-5 12M150 56l-5 12M210 56l-5 12M240 70l-5 12M92 100l-5 12M270 100l-5 12" stroke="#2C4A40" stroke-width="3.5" stroke-linecap="round"/></g><g data-tip="المحرك وفتحات تبريده: الفتحات مصممة لتسمح بمرور هواء التبريد وتمنع دخول الأمطار والسوائل وذرات الغبار."><rect x="120" y="170" width="120" height="84" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M120 170h120l-12 -10H132Z" fill="#2C4A40"/><g stroke="#2C4A40" stroke-width="3" stroke-linecap="round"><line x1="134" y1="196" x2="150" y2="206"/><line x1="134" y1="212" x2="150" y2="222"/><line x1="134" y1="228" x2="150" y2="238"/><line x1="226" y1="196" x2="210" y2="206"/><line x1="226" y1="212" x2="210" y2="222"/><line x1="226" y1="228" x2="210" y2="238"/></g><circle cx="180" cy="214" r="18" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2"/></g><text x="180" y="286" text-anchor="middle" font-size="13.5" font-weight="600" fill="#2C4A40">يمكن استخدامه تحت الأمطار المباشرة</text></svg>`,
   cap:'النوع 4: فتحات التبريد مائلة ومصممة لتمنع دخول المطر الساقط من أعلى أو من الجانبين ضمن الزاوية المظللة.<br><b>مرّر المؤشر على المنطقة المظللة والقطرات والمحرك (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'أي النوعين يمكّن من استخدام المحرك تحت الأمطار المباشرة؟',opts:[
     ['المحمي ضد تناثر السوائل والغبار',false,'هذا يمنع قطرات السوائل وذرات الغبار، لكن الكتاب لا يذكر أنه يصلح تحت الأمطار المباشرة.'],
     ['المحمي ضد الأمطار',true,'نص الكتاب في ص 47: فتحاته لا تسمح بدخول الأمطار الساقطة على الآلة أو الآتية من جانبيها بزاوية لا تزيد عن مئة درجة من الاتجاه الرأسي، «وهذا يمكن من استخدام هذه المحركات تحت الأمطار المباشرة».'],
     ['المحمي بشبكة',false,'الشبكة لا تحمي من الأمطار.']]}}
   ],
   body:[
    {book:String.raw`<p><b>3. النوع المحمي ضد تناثر السوائل والغبار:</b> في هذا النوع تكون الفتحات المخصصة لتبريد المحرك مصممة بحيث لا تسمح بدخول قطرات السوائل أو ذرات الغبار.</p>
     <p><b>4. النوع المحمي ضد الأمطار:</b> في هذا النوع تكون الفتحات المخصصة لتبريد المحرك، مصممة بحيث لا تسمح بدخول الأمطار أو السوائل وذرات الغبار الساقطة على الآلة أو أن تأتي من جانبي الآلة بزاوية لا تزيد عن <span class="bkb" data-bk="rain">مئة درجة</span><span class="bkf" data-bk="rain">ستين درجة</span> من الاتجاه الرأسي، وهذا يمكن من استخدام هذه المحركات تحت الأمطار المباشرة.</p>`,ref:'ص 47'},
    {tip:String.raw`<p>النوعان ما زالا <b>بفتحات</b> يدخل منها هواء التبريد؛ الفرق في تصميم الفتحات: في الثالث تمنع القطرات المتناثرة والغبار، وفي الرابع تمنع أيضاً المطر الساقط من أعلى أو المائل من الجانبين.</p>`},
    {watch:String.raw`<p>الكتاب كتب «مئة درجة من الاتجاه الرأسي». لكن مئة درجة من الخط الرأسي تعني مطراً يأتي من تحت مستوى المحرك، وهذا غير ممكن. الرقم المعتاد لهذا النوع من الحماية في المعايير هو <b>ستون درجة</b> (إضافة من خارج الكتاب). بدّل بين الرقمين لترى الفرق في الرسمة وفي نص الكتاب:</p>${B.bkCtl('rain')}`}
   ]},

  {st:4,short:'المقفل ذاتي ومنفصل التبريد',title:'5. المقفل ذو التبريد الذاتي، 6. المقفل ذو التبريد المنفصل',ref:'ص 47–48',
   q:'محرك بلا أي فتحة تهوية: كيف تخرج حرارته؟ وماذا نخسر بسبب ذلك؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="محركان مقفلان بزعانف: الأول يبرد بانتشار الحرارة من سطحه، والثاني فيه مروحة خارجية بغطاء تدفع الهواء على سطحه" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="النوع 5 — المقفل ذو التبريد الذاتي: مغلق بالكامل بلا فتحات، يبرد بانتشار الحرارة من سطحه الخارجي المزود بزعانف. قدرته حوالي ستين إلى سبعين في المئة من قدرة المحرك المفتوح من نفس الحجم، ويُبنى بقدرات محدودة حوالي ⟦3 – 5⟧ حصان."><rect x="196" y="98" width="124" height="80" rx="12" fill="#2C4A40"/><g stroke="#2C4A40" stroke-width="4"><line x1="210" y1="98" x2="210" y2="84"/><line x1="226" y1="98" x2="226" y2="84"/><line x1="242" y1="98" x2="242" y2="84"/><line x1="258" y1="98" x2="258" y2="84"/><line x1="274" y1="98" x2="274" y2="84"/><line x1="290" y1="98" x2="290" y2="84"/><line x1="306" y1="98" x2="306" y2="84"/><line x1="210" y1="178" x2="210" y2="192"/><line x1="226" y1="178" x2="226" y2="192"/><line x1="242" y1="178" x2="242" y2="192"/><line x1="258" y1="178" x2="258" y2="192"/><line x1="274" y1="178" x2="274" y2="192"/><line x1="290" y1="178" x2="290" y2="192"/><line x1="306" y1="178" x2="306" y2="192"/></g><path d="M226 76q-5 -8 0 -16M258 76q-5 -8 0 -16M290 76q-5 -8 0 -16" fill="none" stroke="#E8735A" stroke-width="3" stroke-linecap="round"/><text x="258" y="143" text-anchor="middle" font-size="12" font-weight="700" fill="#FBF6EE">بلا فتحات</text><text x="258" y="222" text-anchor="middle" font-size="13" font-weight="700" fill="#2C4A40">5. تبريد ذاتي</text></g><g data-tip="النوع 6 — المقفل ذو التبريد المنفصل: مروحة خاصة مثبتة على محور المحرك خارج الإطار المقفل، ومغطاة بغطاء خاص، تدفع الهواء على السطح الخارجي ذي الزعانف. يستخدم في مطاحن الدقيق ومصانع الإسمنت والمناجم."><rect x="58" y="98" width="110" height="80" rx="12" fill="#2C4A40"/><g stroke="#2C4A40" stroke-width="4"><line x1="72" y1="98" x2="72" y2="84"/><line x1="88" y1="98" x2="88" y2="84"/><line x1="104" y1="98" x2="104" y2="84"/><line x1="120" y1="98" x2="120" y2="84"/><line x1="136" y1="98" x2="136" y2="84"/><line x1="152" y1="98" x2="152" y2="84"/><line x1="72" y1="178" x2="72" y2="192"/><line x1="88" y1="178" x2="88" y2="192"/><line x1="104" y1="178" x2="104" y2="192"/><line x1="120" y1="178" x2="120" y2="192"/><line x1="136" y1="178" x2="136" y2="192"/><line x1="152" y1="178" x2="152" y2="192"/></g><path d="M58 112H30V164H58" fill="#CFE6DB" stroke="#2C4A40" stroke-width="3"/><path d="M44 120l8 18l-8 18" fill="none" stroke="#2C4A40" stroke-width="3"/><line x1="44" y1="138" x2="58" y2="138" stroke="#2C4A40" stroke-width="3"/><path d="M62 80H160M62 196H160" stroke="#4FB3A9" stroke-width="3.5" stroke-linecap="round"/><polygon points="168,80 158,74 158,86" fill="#4FB3A9"/><polygon points="168,196 158,190 158,202" fill="#4FB3A9"/><text x="112" y="222" text-anchor="middle" font-size="13" font-weight="700" fill="#2C4A40">6. مروحة خارجية</text></g><text x="180" y="266" text-anchor="middle" font-size="12.5" fill="#2C4A40">الخطوط القصيرة حول المحرك = زعانف</text><text x="180" y="286" text-anchor="middle" font-size="12.5" fill="#2C4A40">الأسهم الفيروزية = هواء المروحة</text></svg>`,
   cap:'محركان مقفلان بالكامل: الأول يبرد بانتشار الحرارة من زعانفه، والثاني تدفع مروحته الخارجية الهواء على زعانفه.<br><b>مرّر المؤشر على كل محرك (أو المسه في الجوال) لتعرف وصفه وأماكن استعماله.</b>',
   side:[
    {predict:{q:'بسبب صعوبة التبريد، كم تكون قدرة المحرك المقفل ذي التبريد الذاتي مقارنة بالمحرك المفتوح من نفس الحجم؟',opts:[
     ['حوالي ستين إلى سبعين في المئة منها',true,'نص الكتاب في ص 48. لذلك يُبنى بقدرات محدودة حوالي 3 – 5 حصان فقط.'],
     ['ضعفها، لأنه محمي أكثر',false,'الحماية الأكثر تعني تبريداً أصعب، فتقل القدرة لا تزيد.'],
     ['مثلها تماماً',false,'لو كانت مثلها لما ذكر الكتاب أن قدرته «تحدد» بنسبة أقل.']]}}
   ],
   body:[
    {book:String.raw`<p><b>5. النوع المقفل ذو التبريد الذاتي:</b> في هذا النوع يكون المحرك مغلقاً بالكامل ولا توجد أي فتحات للتهوية، ويتم تبريد المحرك بواسطة انتشار الحرارة من على سطحه الخارجي، الذي يزود بزعانف لزيادة مساحة السطح الخارجي للمحرك وتحسين التبريد، يستخدم هذا النوع في الأماكن حيث يوجد الغبار والمياه والمحاليل الكيميائية. بسبب صعوبة التبريد فإن قدرة المحرك تحدد بحوالي <b>ستين إلى سبعين في المئة</b> من قدرة المحرك من نفس الحجم من النوع المفتوح، تُبنى هذه المحركات بقدرات محدودة حوالي <b>٣ – ٥ حصان</b> فقط.</p>
     <p><b>6. النوع المقفل ذو التبريد المنفصل:</b> هذا النوع من المحركات مزود بمروحة خاصة للتبريد، مثبتة مع محور المحرك وخارج الإطار المقفل للمحرك ومغطاة بغطاء خاص بها وتدفع الهواء لتبريد السطح الخارجي للمحرك، والذي يكون في العادة مزوداً بزعانف لزيادة المساحة السطحية. يستخدم هذا النوع في مطاحن الدقيق ومصانع الإسمنت والمناجم.</p>`,ref:'ص 47–48'},
    {tip:String.raw`<p><b>الزعانف</b> تزيد مساحة السطح الذي تخرج منه الحرارة، كما في مشعّ السيارة. و<b>المروحة الخارجية</b> في النوع 6 تزيد التبريد كثيراً مع بقاء المحرك مقفلاً تماماً؛ لذلك يناسب المطاحن والإسمنت والمناجم حيث الغبار كثيف.</p>
     <p>معنى نسبة الستين إلى السبعين في المئة: محرك مقفل ذاتي التبريد بحجم محرك مفتوح يعطي فقط نحو ثلثي قدرته؛ فلنفس القدرة نحتاج محركاً مقفلاً أكبر.</p>`},
    {add:String.raw`<p>المحرك الذي تراه على مضخة أو مروحة في مصنع وعلى ظهره زعانف طولية وفي مؤخرته غطاء مثقب هو غالباً من النوع 6: تحت الغطاء المثقب مروحة على طرف العمود.</p>`}
   ]},

  {st:5,short:'الأنابيب وضد الانفجار',title:'7. المزود بأنابيب للتبريد، 8. المصمم ضد الانفجار',ref:'ص 48',
   q:'في محطة وقود قد تكفي شرارة واحدة لكارثة. كيف يُصمم محرك يعمل هناك؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="محرك مقفل يصله هواء نظيف بأنبوب من خارج منطقة الغبار، ومحرك ضد الانفجار يحتوي اللهب داخل إطاره" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><g data-tip="النوع 7 — المزود بأنابيب للتبريد: مقفل تماماً، ويُدفع إليه هواء نظيف داخل أنابيب خاصة من خارج منطقة الغبار. كلفة الأنابيب تقابلها إمكانية استخدام محرك أصغر حجماً وأقل كلفة بفضل التبريد الجيد."><rect x="198" y="40" width="124" height="44" rx="10" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2.5"/><text x="260" y="67" text-anchor="middle" font-size="11.5" font-weight="700" fill="#2C4A40">هواء نظيف</text><path d="M260 84V120" stroke="#4FB3A9" stroke-width="14"/><polygon points="260,130 250,116 270,116" fill="#4FB3A9"/><rect x="210" y="130" width="100" height="70" rx="12" fill="#2C4A40"/><g fill="#B9852A"><circle cx="208" cy="214" r="4"/><circle cx="224" cy="222" r="3"/><circle cx="296" cy="216" r="4"/><circle cx="312" cy="208" r="3"/><circle cx="256" cy="226" r="4"/></g><text x="260" y="250" text-anchor="middle" font-size="12.5" font-weight="700" fill="#2C4A40">7. أنابيب تبريد</text><text x="260" y="268" text-anchor="middle" font-size="11.5" fill="#2C4A40">داخل منطقة غبار</text></g><g data-tip="النوع 8 — المصمم ضد الانفجار: إطاره يتحمل أي انفجار يحدث داخل المحرك ويمنع اشتعال الغازات خارجه، وفتحات تبريده تحتوي اللهب داخل الإطار، وأقصى حرارة لسطحه أقل بكثير من درجة اشتعال الغازات المحيطة. يستخدم في مصافي تكرير البترول ومحطات الوقود ومصانع البتروكيماويات."><rect x="40" y="110" width="124" height="96" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="7"/><path d="M102 182q-16 -18 0 -44q16 26 0 44z" fill="#E8735A"/><path d="M102 182q-7 -9 0 -20q7 11 0 20z" fill="#F2C14E"/><text x="102" y="250" text-anchor="middle" font-size="12.5" font-weight="700" fill="#2C4A40">8. ضد الانفجار</text><text x="102" y="268" text-anchor="middle" font-size="11.5" fill="#2C4A40">اللهب يبقى داخل الإطار</text><g fill="#7A8F86" opacity="0.7"><circle cx="56" cy="84" r="9"/><circle cx="74" cy="76" r="7"/><circle cx="148" cy="80" r="8"/></g><text x="102" y="90" text-anchor="middle" font-size="11.5" fill="#2C4A40">غازات</text></g></svg>`,
   cap:'النوع 7 يأخذ هواء تبريده من خارج منطقة الغبار، والنوع 8 إطاره سميك يحتوي أي انفجار داخله.<br><b>مرّر المؤشر على كل محرك (أو المسه في الجوال) لتعرف وصفه وأماكن استعماله.</b>',
   side:[
    {predict:{q:'أي نوع يستخدم في مصافي تكرير البترول ومحطات الوقود؟',opts:[
     ['المقفل ذو التبريد المنفصل',false,'هذا للمطاحن ومصانع الإسمنت والمناجم.'],
     ['المحمي ضد الأمطار',false,'هذا يمنع المطر، لكنه لا يمنع اشتعال الغازات.'],
     ['المصمم ضد الانفجار',true,'نص الكتاب في ص 48: يستخدم في الأجواء التي تنبعث فيها غازات أو تتواجد فيها مواد قابلة للاشتعال، مثل مصافي تكرير البترول ومحطات الوقود ومصانع البتروكيماويات.']]}}
   ],
   body:[
    {book:String.raw`<p><b>7. النوع المزود بأنابيب للتبريد:</b> في هذا النوع يكون المحرك مقفلاً تماماً، ويتم تبريده بواسطة هواء نظيف يدفع داخل أنابيب خاصة من خارج منطقة الغبار. الكلفة الزائدة بسبب استخدام أنابيب التبريد تقابل باستخدام محرك أصغر حجماً وأقل كلفة، إذا أخذنا في الاعتبار التبريد الجيد للمحرك في هذه الحالة.</p>
     <p><b>8. النوع المصمم ضد الانفجار:</b> يستخدم هذا النوع من المحركات في الأجواء التي تنبعث فيها غازات أو تتواجد فيها مواد قابلة للاشتعال، حيث يكون الإطار الخارجي مصمماً ليتحمل أي انفجار يحدث داخل المحرك ويمنع اشتعال الغازات خارج المحرك وفتحات التبريد مصممة بحيث تحتوي اللهب داخل الإطار. وكذلك يصمم المحرك بحيث تكون أقصى درجة حرارة للسطح الخارجي أقل بكثير من درجة الحرارة التي تشتعل عندها الغازات أو المواد القابلة للاشتعال المحيطة بالمحرك، ويستخدم هذا النوع في مصافي تكرير البترول ومحطات الوقود ومصانع البتروكيماويات.</p>`,ref:'ص 48'},
    {tip:String.raw`<p>المحرك ضد الانفجار لا يمنع الغاز من الدخول، بل يفترض أن الانفجار قد يحدث داخله؛ فيصمم إطاره ليتحمله ولا يدع اللهب يخرج ويشعل الغاز المحيط. وسطحه لا يسخن إلى درجة إشعال الغاز.</p>`},
    {watch:String.raw`<p>لا تخلط بين النوعين 6 و8: المناجم ومصانع الإسمنت (غبار) ← المقفل ذو التبريد المنفصل؛ المصافي ومحطات الوقود (غازات قابلة للاشتعال) ← المصمم ضد الانفجار. وهذا هو السؤال <span class="ltr">4-5</span>.</p>`}
   ]},

  {st:6,short:'أسئلة الوحدة',title:'أسئلة متنوعة — الوحدة الرابعة',ref:'ص 49',
   q:'خمسة أسئلة تراجع الوحدة كلها. حاول الإجابة قبل أن تفتح الإجابة المقترحة.',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="بطاقة بأسئلة الوحدة الخمسة وموضوع كل سؤال" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><rect x="44" y="40" width="272" height="240" rx="16" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><rect x="44" y="40" width="272" height="40" rx="16" fill="#2C4A40"/><rect x="44" y="64" width="272" height="16" fill="#2C4A40"/><text x="180" y="66" text-anchor="middle" font-size="14.5" font-weight="700" fill="#FBF6EE">أسئلة الوحدة الرابعة</text><g data-tip="السؤال ⟦4-1⟧: الخواص الثماني — الدرس الأول من الوحدة."><rect x="60" y="92" width="240" height="30" rx="8" fill="#F2C14E"/><text x="272" y="112" text-anchor="middle" font-size="12" font-weight="700" fill="#2C4A40" direction="ltr">4-1</text><text x="160" y="112" text-anchor="middle" font-size="12" fill="#2C4A40">الخواص المطلوبة</text></g><g data-tip="السؤال ⟦4-2⟧: فائدة الإطار الخارجي — المحطة الأولى من هذا الدرس."><rect x="60" y="128" width="240" height="30" rx="8" fill="#4FB3A9"/><text x="272" y="148" text-anchor="middle" font-size="12" font-weight="700" fill="#2C4A40" direction="ltr">4-2</text><text x="160" y="148" text-anchor="middle" font-size="12" fill="#2C4A40">الإطار الخارجي</text></g><g data-tip="السؤال ⟦4-3⟧: كلفة المحرك المقفل — المحطتان الثانية والرابعة من هذا الدرس."><rect x="60" y="164" width="240" height="30" rx="8" fill="#E8735A"/><text x="272" y="184" text-anchor="middle" font-size="12" font-weight="700" fill="#2C4A40" direction="ltr">4-3</text><text x="160" y="184" text-anchor="middle" font-size="12" fill="#2C4A40">المقفل والمحمي بشبكة</text></g><g data-tip="السؤال ⟦4-4⟧: أنواع الأغلفة الثمانية — المحطات من الثانية إلى الخامسة."><rect x="60" y="200" width="240" height="30" rx="8" fill="#CFE6DB"/><text x="272" y="220" text-anchor="middle" font-size="12" font-weight="700" fill="#2C4A40" direction="ltr">4-4</text><text x="160" y="220" text-anchor="middle" font-size="12" fill="#2C4A40">أنواع الأغلفة</text></g><g data-tip="السؤال ⟦4-5⟧: اختيار الغلاف لمكان معين — المحطتان الرابعة والخامسة."><rect x="60" y="236" width="240" height="30" rx="8" fill="#FBE6C4"/><text x="272" y="256" text-anchor="middle" font-size="12" font-weight="700" fill="#2C4A40" direction="ltr">4-5</text><text x="160" y="256" text-anchor="middle" font-size="12" fill="#2C4A40">الغلاف المناسب للمكان</text></g></svg>`,
   cap:'كل سؤال وموضوعه.<br><b>مرّر المؤشر على كل سطر (أو المسه في الجوال) لتعرف أين تجد شرحه.</b>',
   side:[
    {book:String.raw`<ol style="list-style:none;padding:0"><li><span class="ltr">4-1</span>: ما الخواص الكهربائية والميكانيكية العامة المطلوبة لمحركات التحريك؟</li><li><span class="ltr">4-2</span>: ما فائدة الإطار الخارجي للمحرك؟</li><li><span class="ltr">4-3</span>: ما الذي يجعل المحركات المقفلة أكثر كلفة من المحركات المحمية بشبكة؟</li><li><span class="ltr">4-4</span>: ما أنواع الأغلفة التي تستخدم في حماية المحركات؟</li><li><span class="ltr">4-5</span>: أي أنواع المحركات مناسب للاستخدام في: <span class="ltr">a-</span> مصافي تكرير البترول ومحطات الوقود؟ <span class="ltr">b-</span> المناجم ومصانع الأسمنت؟</li></ol>`,ref:'ص 49'}
   ],
   body:[
    {predict:{q:'السؤال <span class="ltr">4-5 b</span>: أي نوع يناسب المناجم ومصانع الأسمنت؟',opts:[
     ['المقفل ذو التبريد المنفصل',true,'نص الكتاب في ص 48: «يستخدم هذا النوع في مطاحن الدقيق ومصانع الإسمنت والمناجم».'],
     ['المحمي بشبكة',false,'هذا للأجواء النظيفة الخالية من الأوساخ والغبار.'],
     ['المفتوح',false,'المفتوح يدخل الهواء المحيط بغباره إلى داخل المحرك.']]}},
    {tip:String.raw`<p><b><span class="ltr">4-1</span>:</b> ثماني خواص (ص 45–46): عزم كبير أثناء بدء الحركة، وأن تكون لها خصائص محركات التوالي، وبساطة التحكم في السرعة، وقابليتها لاستخدام الفرامل الكهربائية (الديناميكية وبإعادة التوليد وبالتيار المعكوس)، وتحمل الارتفاع المفاجئ في الجهد، وتحمل الانقطاع المؤقت لمصدر الجهد، والصلابة، وصغر الوزن والحجم.</p>
     <p><b><span class="ltr">4-2</span>:</b> توفير الحماية للمحرك من ظروف الجو المحيط: الرطوبة والأوساخ والأتربة والأجسام الغريبة وما قد يتسرب إليه من أبخرة ومواد قابلة للاشتعال، دون أن يؤثر سلباً على تبريد المحرك (ص 47).</p>
     <p><b><span class="ltr">4-3</span>:</b> الكتاب لا يجيب عنه نصاً. من نص ص 47–48: المحرك المقفل لا فتحات فيه، فيبرد فقط بانتشار الحرارة من سطحه، فتنخفض قدرته إلى نحو 60–70 % من قدرة المحرك المفتوح من نفس الحجم؛ أي نحتاج محركاً أكبر (حديد ونحاس أكثر) لنفس القدرة، إضافة إلى الزعانف، وفي بعض الأنواع مروحة خارجية بغطائها أو أنابيب تبريد. أما المحمي بشبكة فيبرد تبريداً حراً عبر فتحات كبيرة عليها شبكة بسيطة.</p>
     <p><b><span class="ltr">4-4</span>:</b> ثمانية (ص 47–48): المفتوح، والمحمي بشبكة، والمحمي ضد تناثر السوائل والغبار، والمحمي ضد الأمطار، والمقفل ذو التبريد الذاتي، والمقفل ذو التبريد المنفصل، والمزود بأنابيب للتبريد، والمصمم ضد الانفجار.</p>
     <p><b><span class="ltr">4-5</span>:</b> <span class="ltr">a-</span> النوع المصمم ضد الانفجار (ص 48). <span class="ltr">b-</span> النوع المقفل ذو التبريد المنفصل (ص 48).</p>`,title:'إجابات مقترحة'},
    {watch:String.raw`<p>الكتاب لا يعطي مفتاح إجابة لأسئلة ص 49؛ الإجابات المقترحة هنا مأخوذة من نص الوحدة، وهي نفسها التي في الأسلوب الرسمي، ويعتمدها المدرب. والسؤال <span class="ltr">4-3</span> بالذات لا يجيب عنه النص صراحة.</p>`}
   ]},

  {recap:[
   String.raw`الإطار الخارجي يحمي المحرك من الرطوبة والأتربة والأجسام الغريبة والأبخرة، دون أن يضر بتبريده (ص 47).`,
   String.raw`المفتوح والمحمي بشبكة يبردان تبريداً حراً بالهواء المحيط، والشبكة لا تحمي من الأتربة والأمطار؛ والمحمي ضد الأمطار يصلح تحت المطر المباشر (ص 47).`,
   String.raw`المقفل ذاتي التبريد يبرد من سطحه ذي الزعانف، وقدرته حوالي ستين إلى سبعين في المئة من المفتوح المماثل؛ والمقفل منفصل التبريد بمروحة خارجية للمطاحن والإسمنت والمناجم (ص 47–48).`,
   String.raw`المزود بأنابيب يأخذ هواءً نظيفاً من خارج منطقة الغبار، والمصمم ضد الانفجار للمصافي ومحطات الوقود والبتروكيماويات (ص 48).`]}
],
 theory:[
  {h:'طرق الوقاية المختلفة للمحركات الكهربائية وكيفية تبريدها',ref:'ص 47',html:`<p>يستخدم <b>الإطار الخارجي</b> للمحرك لتوفير الحماية للمحرك من ظروف الجو المحيط، مثل، الرطوبة والأوساخ والأتربة والأجسام الغريبة، وما قد يتسرب للمحرك من أبخرة ومواد قابلة للاشتعال، وفي الوقت نفسه <b>لا يجب أن يؤثر الإطار سلباً على تبريد المحرك</b>. هناك عدة أنواع من الأغلفة التي تستخدم في المحركات لتوفير درجات مختلفة من الحماية، ولمراعاة ظروف التشغيل المحيطة بنظام التحريك الكهربائي:</p>
   <ol>
   <li><b>النوع المفتوح:</b> في هذا النوع يكون المحرك مفتوحاً من كلا طرفيه، وهذا النوع يوفر تبريداً حراً للمحرك، حيث يكون كل من العضوين الثابت والدوار في اتصال مباشر مع الهواء المحيط، ويستخدم في آلات التيار المستمر الكبيرة الحجم.</li>
   <li><b>النوع المحمي بشبكة:</b> في هذا النوع يحتوي الغلاف الخارجي للآلة على فتحات كبيرة للتبريد الحر، هذه الفتحات مغطاة بشبكة لمنع دخول الفئران والزواحف، أو سقوط العدد الصغيرة مثل المفكات… إلخ، داخل الآلة، ولكنها لا توفر الحماية من الأوساخ والأتربة والأمطار أو المواد القابلة للاشتعال. تستعمل هذه المحركات حيث يكون الجو المحيط نظيفاً خالياً من الأوساخ والغبار والمواد الكيميائية.</li>
   <li><b>النوع المحمي ضد تناثر السوائل والغبار:</b> في هذا النوع تكون الفتحات المخصصة لتبريد المحرك مصممة بحيث لا تسمح بدخول قطرات السوائل أو ذرات الغبار.</li>
   <li><b>النوع المحمي ضد الأمطار:</b> في هذا النوع تكون الفتحات المخصصة لتبريد المحرك، مصممة بحيث لا تسمح بدخول الأمطار أو السوائل وذرات الغبار الساقطة على الآلة أو أن تأتي من جانبي الآلة بزاوية لا تزيد عن <span class="bkb" data-bk="rain">مئة درجة</span><span class="bkf" data-bk="rain">ستين درجة</span> من الاتجاه الرأسي، وهذا يمكن من استخدام هذه المحركات تحت الأمطار المباشرة.<br>${B.bkCtl('rain','زاوية المطر:')}<span class="bkf blk sub" data-bk="rain"> المصحح: الكتاب كتب «مئة درجة»، لكن مئة درجة من الخط الرأسي تعني مطراً يأتي من تحت مستوى المحرك، وهذا غير ممكن. الرقم المعتاد لهذا النوع من الحماية في المعايير هو ستون درجة من الاتجاه الرأسي (إضافة من خارج الكتاب).</span></li>
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
  const show=()=>{const e=ENC.find(x=>x.k===cur);$('#encn').textContent=e.n;$('#encd').innerHTML=e.d;$('#encc').textContent=e.c;$('#encu').textContent=e.u;el.querySelectorAll('[data-enc]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.enc===cur)))};
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
  {q:'النوع المحمي ضد الأمطار مناسب للاستعمال:',o:['تحت الأمطار المباشرة','داخل الماء','في الأماكن المليئة بالغبار الكثيف فقط','في الأماكن المغلقة الجافة فقط'],c:0,e:'ص 47: «وهذا يمكن من استخدام هذه المحركات تحت الأمطار المباشرة».'},
  {q:'قدرة المحرك المقفل ذي التبريد الذاتي تحدد بحوالي … من قدرة المفتوح من نفس الحجم:',o:['20–30 %','40–50 %','60–70 %','90–100 %'],c:2,e:'ص 47–48: بسبب صعوبة التبريد.'},
  {q:'المحرك المناسب لمطاحن الدقيق ومصانع الإسمنت والمناجم:',o:['المفتوح','المحمي بشبكة','المقفل ذو التبريد المنفصل','المحمي ضد الأمطار'],c:2,e:'ص 48.'},
  {q:'في النوع المزود بأنابيب للتبريد، الكلفة الزائدة للأنابيب تقابلها:',o:['زيادة السرعة','استخدام محرك أصغر حجماً وأقل كلفة','إلغاء الإطار','زيادة الجهد'],c:1,e:'ص 48.'},
  {q:'المحرك المناسب لمحطات الوقود ومصافي البترول:',o:['المقفل ذو التبريد الذاتي','المصمم ضد الانفجار','المحمي ضد تناثر السوائل','المفتوح'],c:1,e:'ص 48.'}
 ]
});

})(PLCBOOK);
