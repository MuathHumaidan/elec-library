/* Unit 2 — التجارب على محركات التيار المستمر (ص 22–34)
   u2-l1 = التجربة الخامسة (محرك منفصل التغذية)، u2-l2 = السادسة (محرك التوازي)، u2-l3 = السابعة (محرك التوالي).
   نموذج محرك واحد مشترك للتجارب الثلاث (نفس الآلة): منحنى مغنطة، مقاومة المنتج، مقاومة ملف المجال وملف التوالي،
   احتكاك، ثابت زمن التسارع، والقيم المقننة للتحذيرات — كلها «قيم المدرب» عبر B.params بمعرف مشترك 'u2-dcm'. */
(function(B){
const {S}=B;
const PI=Math.PI;
const fm=(x,d)=>B.fmtN(x,d);
const fx=v=>(+v).toFixed(1);
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const lt=s=>`<span class="ltr">${s}</span>`;
/* أعطال «اكتشف العطل» المخفية (challenge.js): false دائماً خارج وضع التحدي */
const chF=f=>!!(B.chF&&B.chF(f));
/* التجربة السابعة: أصغر حمل في جداول الكتاب — يبدأ منه الجدولان بدل T = 0 (قرار المدرب رقم 3) */
const EXP7_TMIN=0.1;

/* ---------- styles used only by this file (CSS variables only) ---------- */
(function css(){if(typeof document==='undefined'||document.getElementById('dcu2-css'))return;const s=document.createElement('style');s.id='dcu2-css';s.textContent=`
.dm-lab .seg{flex-wrap:wrap;max-width:100%}
.dm-lab .seg button{white-space:nowrap}
.dm-sl{display:flex;flex-direction:column;gap:2px;font-size:13.5px;margin-top:10px;min-width:0}
.dm-sl .dm-h{display:flex;justify-content:space-between;gap:8px;align-items:baseline}
.dm-sl b{font-family:var(--mono);direction:ltr;unicode-bidi:isolate;color:var(--blue-ink);font-size:14px}
.dm-sl input[type=range]{width:100%;accent-color:var(--blue);direction:ltr;margin:4px 0}
.dm-fine{display:flex;gap:4px;flex-wrap:wrap}
.dm-fine .btn{padding:3px 9px;font-family:var(--mono);direction:ltr;font-size:12.5px}
.dm-row{display:flex;gap:14px;flex-wrap:wrap;margin-top:10px;align-items:center}
.dm-row .sub{margin:0}
.dm-box{border:1px solid var(--line);border-radius:12px;padding:8px 12px 10px;margin-top:10px}
.dm-box h3{margin:0;font-size:14px}
.dm-meters{display:grid;grid-template-columns:repeat(auto-fit,minmax(118px,1fr));gap:8px;margin-top:10px}
.dm-meter{background:var(--surface-2);border:1px solid var(--line);border-radius:10px;padding:6px 8px;text-align:center}
.dm-meter span{display:block;font-size:12px;color:var(--muted)}
.dm-meter b{font:700 19px var(--mono);direction:ltr;unicode-bidi:isolate;display:inline-block}
.dm-meter.hot{border-color:var(--stop);background:var(--stop-soft)}
.dm-chip{display:inline-block;padding:2px 10px;border-radius:999px;font-size:12.5px;font-weight:700;background:var(--surface-2);color:var(--muted)}
.dm-chip.ok{background:var(--on-soft);color:var(--on)}
.dm-chip.warn{background:var(--stop-soft);color:var(--stop)}
.dm-chip.hot{background:var(--live-soft);color:var(--live)}
.dm-tbl{overflow-x:auto;margin-top:6px;direction:ltr}
.dm-tbl table.tt{min-width:340px}
.dm-tbl table.tt td,.dm-tbl table.tt th{padding:5px 7px;text-align:center}
.dm-tbl td.l,.dm-tbl th.l{font-family:var(--mono);direction:ltr}
.dm-tbl td.cur,.dm-tbl th.cur{background:var(--live-soft);font-weight:700}
.dm-tbl td.free,.dm-tbl th.free{background:var(--surface-2)}
.dm-tbl td.x,.dm-tbl th.x{color:var(--stop);text-decoration:line-through}
.dm-plots{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:12px;margin-top:8px}
.dm-plots figure{margin:0}
.dm-plots figcaption{font-size:13px;color:var(--muted);text-align:center}
.dm-conds{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}
.dm-q{border:1px solid var(--line);border-radius:12px;padding:10px 14px;margin:10px 0;background:var(--surface)}
.dm-q summary{cursor:pointer;font-weight:600;line-height:1.7}
.dm-ans{margin-top:8px;border-inline-start:3px solid var(--blue);padding:6px 12px;background:var(--blue-soft);border-radius:0 10px 10px 0}
.dm-try{margin:6px 0 0;padding-inline-start:20px}
.svgbox.dm-wide svg{min-width:600px}
.dm-leg{display:flex;gap:12px;flex-wrap:wrap;font-size:12.5px;color:var(--muted);margin-top:4px;justify-content:center}
.dm-leg i{display:inline-block;width:10px;height:10px;border-radius:50%;margin-inline-end:4px;vertical-align:middle}
`;document.head.appendChild(s)})();

/* ---------- small helpers (local copies, as in the other courses) ---------- */
function loopOn(el,fn){let last=performance.now();const f=now=>{if(!document.body.contains(el))return;const dt=Math.min(0.05,Math.max(0,(now-last)/1000));last=now;try{fn(dt)}catch(e){console.error(e);return}requestAnimationFrame(f)};requestAnimationFrame(f)}
function stepsUI(host,steps){let i=0;
  const draw=()=>{host.innerHTML=steps.map((s,j)=>`<li class="${j<i?'done':j===i?'cur':''}"><span class="k">${j<i?'✓':j+1}</span><div><h4>${s.t}</h4><p>${s.x}</p>${j===i?`<div class="act">${s.done?'<span class="hint">بانتظار تنفيذك…</span> <button class="btn" data-next>تخطَّ</button>':'<button class="btn primary" data-next>التالي</button>'}</div>`:''}</div></li>`).join('')+
    (i>=steps.length?`<li class="cur"><span class="k">✓</span><div><h4>أحسنت، أنهيت التجربة</h4><p style="display:block">ارجع إلى «الشرح» وأجب عن أسئلة التجربة مستعيناً بجداولك ومنحنياتك.</p><div class="act"><button class="btn" data-restart>إعادة التجربة</button></div></div></li>`:'');B.math(host)};
  host.addEventListener('click',e=>{if(e.target.closest('[data-next]')){i++;draw()}if(e.target.closest('[data-restart]')){i=0;draw()}});draw();
  return {check(){const s=steps[i];if(s&&s.done&&s.done()){i++;draw()}},redraw:draw};}
const sl=(id,label,min,max,step,val)=>`<label class="dm-sl"><span class="dm-h"><span>${label}</span><b id="${id}-v"></b></span><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}" aria-label="${label.replace(/<[^>]+>/g,'')}"></label>`;
const fine=(k,list)=>`<div class="dm-fine">${list.map(d=>`<button class="btn" data-fk="${k}" data-fv="${d}">${d>0?'+':''}${d}</button>`).join('')}</div>`;
const segHTML=(attr,items,cur)=>`<div class="seg" role="group">${items.map(([v,l])=>`<button data-${attr}="${v}" aria-pressed="${String(v)===String(cur)}">${l}</button>`).join('')}</div>`;
const segSet=(el,attr,v)=>el.querySelectorAll(`[data-${attr}]`).forEach(b=>b.setAttribute('aria-pressed',String(String(b.dataset[attr])===String(v))));
const swHTML=(id,b,label)=>`<button class="sw" id="${id}" aria-pressed="false"><span class="knob"></span><b>${b}</b><small>${label}</small></button>`;
const tryList=items=>`<div class="callout"><b>جرّب:</b><ol class="dm-try">${items.map(x=>`<li>${x}</li>`).join('')}</ol></div>`;
const arT=(x,y,s,o)=>{o=o||{};return `<text class="txt ar" x="${x}" y="${y}" text-anchor="${o.a||'middle'}"${o.fs?` font-size="${o.fs}"`:''}${o.col?` style="fill:var(${o.col})"`:''}>${s}</text>`};
const box=(svg,max,wide)=>`<div class="svgbox${wide?' dm-wide':''}" style="margin-inline:auto;${max?`max-width:${max}px`:''}">${svg}</div>`;
const Q=(n,q,ans)=>`<details class="dm-q"><summary>${n} ${q}</summary><div class="dm-ans"><b>إجابة مقترحة (ليست من الكتاب):</b> ${ans}</div></details>`;
function arrow(x1,y1,x2,y2,col,w){w=w||2;const a=Math.atan2(y2-y1,x2-x1),L=Math.hypot(x2-x1,y2-y1);if(L<3)return '';const h=Math.min(9,L*0.6)+w;
  const bx=x2-h*Math.cos(a),by=y2-h*Math.sin(a),px=-Math.sin(a)*h*0.45,py=Math.cos(a)*h*0.45;
  return `<path d="M${fx(x1)} ${fx(y1)}L${fx(bx)} ${fx(by)}" stroke="var(${col})" stroke-width="${w}" fill="none" stroke-linecap="round"/><path d="M${fx(x2)} ${fx(y2)}L${fx(bx+px)} ${fx(by+py)}L${fx(bx-px)} ${fx(by-py)}Z" fill="var(${col})"/>`}
/* inductor (loops) between two points */
function ind(x1,y1,x2,y2,n,cls){n=n||4;const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy),ux=dx/len,uy=dy/len;const lead=len*0.12,seg=(len-2*lead)/n,r=seg/2;
  let p=`M${fx(x1)} ${fx(y1)}L${fx(x1+ux*lead)} ${fx(y1+uy*lead)}`;for(let i=1;i<=n;i++){p+=`A${fx(r)} ${fx(r)} 0 0 1 ${fx(x1+ux*(lead+seg*i))} ${fx(y1+uy*(lead+seg*i))}`}
  return `<path class="w ${cls||''}" d="${p}L${fx(x2)} ${fx(y2)}"/>`}
/* nice axis ticks */
function ticks(a,b,n){const span=(b-a)||1,st0=span/(n||5),m=Math.pow(10,Math.floor(Math.log10(st0))),st=[1,2,2.5,5,10].map(k=>k*m).find(k=>k>=st0*0.999);
  const lo=Math.floor(a/st+1e-9)*st,hi=Math.ceil(b/st-1e-9)*st;const t=[];for(let x=lo;x<=hi+st*1e-6;x+=st)t.push(+x.toFixed(10));return {lo,hi,t}}
function rangeOf(vals,dflt){if(!vals.length)return ticks(dflt[0],dflt[1],5);let a=Math.min(...vals),b=Math.max(...vals);
  if(a>=0&&b>0&&(b-a)>0.35*b)a=0;if(b-a<1e-9){const d=Math.abs(b)*0.05||0.05;a-=d;b+=d}else{const p=(b-a)*0.08;a=a===0?0:a-p;b+=p}return ticks(a,b,5)}
/* x-y plot of recorded points (+ free points + live operating point) */
function plotXY(o){const W=360,H=240,L=50,R=14,T=14,Bm=36;
  const all=o.pts.concat(o.free||[]).concat(o.op?[o.op]:[]);
  const rx=rangeOf(all.map(p=>p[0]),o.dx),ry=rangeOf(all.map(p=>p[1]),o.dy);
  const X=x=>L+(x-rx.lo)/(rx.hi-rx.lo)*(W-L-R),Y=y=>H-Bm-(y-ry.lo)/(ry.hi-ry.lo)*(H-T-Bm);
  let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${o.aria||'منحنى'}">`;
  ry.t.forEach(v=>{s+=`<path d="M${L} ${fx(Y(v))}H${W-R}" stroke="var(--line)"/>`+S.t(L-5,fx(Y(v)+4),fm(v),'m','end')});
  rx.t.forEach(v=>{s+=`<path d="M${fx(X(v))} ${T}V${H-Bm}" stroke="var(--line)" stroke-dasharray="3 3"/>`+S.t(fx(X(v)),H-Bm+14,fm(v),'m')});
  s+=`<path d="M${L} ${T}V${H-Bm}H${W-R}" stroke="var(--fg)" fill="none" stroke-width="1.4"/>`;
  s+=S.t(W-R,H-4,o.xl,'','end')+S.t(L+4,T+10,o.yl,'','start');
  if(rx.lo>0)s+=S.t(L+2,H-4,'≠0','m','start');
  const P=o.pts.slice().sort((a,b)=>a[2]-b[2]);
  if(P.length>1)s+=`<path d="${P.map((p,i)=>(i?'L':'M')+fx(X(p[0]))+' '+fx(Y(p[1]))).join('')}" fill="none" stroke="var(--blue)" stroke-width="2.4" stroke-linejoin="round"/>`;
  P.forEach(p=>{s+=`<circle cx="${fx(X(p[0]))}" cy="${fx(Y(p[1]))}" r="4.5" fill="var(--blue)"/>`});
  (o.free||[]).forEach(p=>{s+=`<rect x="${fx(X(p[0])-4)}" y="${fx(Y(p[1])-4)}" width="8" height="8" fill="var(--muted)"/>`});
  if(o.op)s+=`<circle cx="${fx(X(o.op[0]))}" cy="${fx(Y(o.op[1]))}" r="7" fill="none" stroke="var(--live)" stroke-width="2.4"/>`;
  if(!P.length&&!(o.free||[]).length)s+=arT((L+W-R)/2,(T+H-Bm)/2,'سجّل قراءات الجدول ليظهر المنحنى',{fs:12,col:'--muted'});
  return s+'</svg>'}

/* =====================================================================
   النموذج المشترك لمحرك التيار المستمر (أرقام توضيحية — قيم المدرب)
   منحنى المغنطة: الجهد المتولد عند 1500 rpm  E(I) = Er + Em·tanh(I/Ic)  (I = تيار المجال أو المكافئ)
   kφ = E/1500 (V لكل rpm)، العزم Te = kφ·(60/2π)·Ia، والجهد Vin = kφ·n + Ia·R
   J من ثابت زمن التسارع τ: عزم صافٍ 1 N·m يوصل العضو الدوار من السكون إلى 1500 rpm في τ ثانية.
   ===================================================================== */
const MODEL_KEYS={sep:['Rf'],shunt:['Rf'],series:['Rse','aSe']};
function motorDefs(type){
 const all=[
  {k:'Ra',label:'مقاومة ملفات المنتج (مع الفرش) R<sub>a</sub>',unit:'Ω',value:8,min:0.5,max:100,step:0.1},
  {k:'Er',label:'منحنى المغنطة: الجهد المتولد من المغناطيسية المتبقية (تيار المجال صفر، عند 1500 rpm)',unit:'V',value:6,min:0.5,max:50,step:0.5},
  {k:'Em',label:'منحنى المغنطة: أقصى زيادة في الجهد المتولد يضيفها المجال (عند 1500 rpm)',unit:'V',value:200,min:20,max:1000,step:1,hint:'الجهد المتولد عند 1500 rpm = Er + Em × tanh(If ÷ Ic)'},
  {k:'Ic',label:'منحنى المغنطة: تيار المجال الذي يظهر عنده التشبع (Ic)',unit:'A',value:0.3,min:0.02,max:5,step:0.01,hint:'كلما صغر بدأ التشبع (انحناء المنحنى) عند تيار أصغر'},
  {k:'Rf',label:'مقاومة ملف المجال E1–E2',unit:'Ω',value:400,min:20,max:5000,step:1},
  {k:'Rse',label:'مقاومة ملف التوالي D1–D2',unit:'Ω',value:1.5,min:0.05,max:50,step:0.05},
  {k:'aSe',label:'تيار المجال المكافئ لكل 1 A يمر في ملف التوالي (يكبر مع عدد لفاته)',unit:'A/A',value:0.25,min:0.01,max:5,step:0.01},
  {k:'Tf0',label:'عزم الاحتكاك الثابت (المحامل والفرش)',unit:'N.m',value:0.02,min:0,max:0.5,step:0.005},
  {k:'Tv',label:'عزم الاحتكاك والتهوية الذي يزيد مع السرعة (لكل 1000 rpm)',unit:'N.m',value:0.01,min:0,max:0.5,step:0.005},
  {k:'tau',label:'ثابت زمن التسارع (يكبر مع ثقل العضو الدوار)',unit:'s',value:0.4,min:0.2,max:30,step:0.1,hint:'الزمن الذي يصل فيه العضو الدوار من السكون إلى 1500 rpm لو أثّر عليه عزم صافٍ 1 N.m'},
  {k:'IaN',label:'تيار المنتج المقنن (للمقارنة والتحذير)',unit:'A',value:2,min:0.1,max:50,step:0.1},
  {k:'nN',label:'السرعة المقننة (تحذير عند تجاوزها)',unit:'rpm',value:2600,min:100,max:10000,step:10},
  {k:'nMax',label:'أقصى سرعة آمنة (تفصل الحماية المصدر عندها)',unit:'rpm',value:3000,min:200,max:20000,step:10}];
 return all.map(d=>{const used=['Rf','Rse','aSe'].includes(d.k)?MODEL_KEYS[type].includes(d.k):true;
  return used?d:Object.assign({},d,{hint:(d.k==='Rf'?'لا يدخل في تجربة محرك التوالي (يستعمل في التجربتين 5 و6)':'لا يدخل في هذه التجربة (يستعمل في تجربة محرك التوالي)')})});
}
const Mod={
 E:(v,I)=>v.Er+v.Em*Math.tanh(Math.max(0,I)/v.Ic),
 kphi:(v,I)=>Mod.E(v,I)/1500,
 J:v=>v.tau/(2*PI*1500/60),
 /* تيار محرك التوالي: Va = Ia·R + kφ(a·Ia)·n — المصدر موحّد فلا يمر تيار عكسي (Ia ≥ 0) */
 seriesIa(v,Va,n,R){const g=I=>Va-I*R-Mod.kphi(v,v.aSe*I)*Math.abs(n);if(Va<=0||g(0)<=0)return 0;let lo=0,hi=Va/R;for(let i=0;i<44;i++){const m=(lo+hi)/2;if(g(m)>0)lo=m;else hi=m}return (lo+hi)/2},
 /* حالة الاستقرار (للتحقق والاختبار): أول سرعة يتساوى عندها العزم مع الحمل */
};
/* one integration step (semi-implicit, stable). s: state, inputs: Va, If (sep/shunt), sg (direction sign) */
function motorSub(type,v,s,h){
 const J=Mod.J(v),c=60/(2*PI*J);let k=0,Ia=0,A=0,Bc=0;
 const Va=s.arm&&!s.trip?s.Vin:0;
 if(s.arm&&!s.trip){
  if(type!=='series'){k=s.sg*Mod.kphi(v,s.If);Ia=Math.max(0,(Va-k*s.n)/v.Ra);if(Ia>0){const kt=k*60/(2*PI);A=kt*Va/v.Ra;Bc=kt*k/v.Ra}}
  else{const R=v.Ra+v.Rse;Ia=Mod.seriesIa(v,Va,s.n,R);k=s.sg*Mod.kphi(v,v.aSe*Ia);if(Ia>0){const kt=k*60/(2*PI);Bc=kt*k/R;A=kt*Ia+Bc*s.n}}
 }
 s.Ia=Ia;s.k=k;s.Te=k*60/(2*PI)*Ia;
 if(s.pkOn)s.peak=Math.max(s.peak,Ia);
 const Tc=s.T+v.Tf0,vis=v.Tv/1000;
 if(s.n===0&&Math.abs(s.Te)<=Tc)return;   // الفرملة/الاحتكاك يمسكان العضو الدوار
 const sgn=s.n!==0?Math.sign(s.n):Math.sign(s.Te);
 let nn=(s.n+h*c*(A-sgn*Tc))/(1+h*c*(Bc+vis));
 if(Math.sign(nn)!==sgn)nn=0;
 s.n=nn;
}
function motorStep(type,v,s,dt){const N=Math.max(1,Math.ceil(dt/0.004));for(let i=0;i<N;i++)motorSub(type,v,s,dt/N);
 // final electrical values at the new speed (for meters)
 if(s.arm&&!s.trip){const Va=s.Vin;if(type!=='series'){const k=s.sg*Mod.kphi(v,s.If);s.Ia=Math.max(0,(Va-k*s.n)/v.Ra);s.k=k}else{const R=v.Ra+v.Rse;s.Ia=Mod.seriesIa(v,Va,s.n,R);s.k=s.sg*Mod.kphi(v,v.aSe*s.Ia)}s.Te=s.k*60/(2*PI)*s.Ia}else{s.Ia=0;s.Te=0}}

/* =====================================================================
   مخططات التوصيل — الأشكال (5) و(6) و(7) (مرسومة من جديد)
   ===================================================================== */
function figSVG(type,o){o=o||{};const r=o.rd||{};const on=!!o.arm,I=on&&(o.Ia||0)>0.004;
 const cM=I?'flow':on?'live':'';const xm=360,yT=40,yB=290,ym=165;
 const fOn=type==='sep'?!!o.fld:on&&!o.fault;const fI=type==='sep'?(fOn&&(o.If||0)>0.001):fOn;const cF=fI?'flow':fOn?'live':'';
 const nm={sep:'الشكل (5): مخطط توصيل المحرك منفصل التغذية',shunt:'الشكل (6): مخطط توصيل محرك التوازي',series:'الشكل (7): مخطط توصيل محرك التوالي'}[type];
 let s=`<svg viewBox="0 0 760 320" role="img" aria-label="${nm}">`;
 // DC supply Vin
 s+=`<rect x="14" y="70" width="96" height="180" rx="8" fill="var(${on?'--on-soft':'--surface-2'})" stroke="var(--fg)" stroke-width="1.6"/>`+arT(62,116,'مصدر',{fs:12})+S.t(62,140,'Vin')+S.t(62,158,'0-250 V','m')+S.t(62,174,'DC','m');
 if(!o.static)s+=arT(62,214,on?(o.trip?'فصلته الحماية':'موصل'):'مفصول',{fs:11.5,col:o.trip?'--stop':on?'--on':'--muted'});
 s+=S.t(80,64,'+','')+S.t(80,268,'−','');
 // main wires
 if(type==='series'){s+=S.w(`M62 70V${yT}H180`,cM)+ind(180,yT,250,yT,4,cM)+S.w(`M250 ${yT}H${xm}V125`,cM)+S.t(184,62,'D1','m')+S.t(248,62,'D2','m')+arT(215,82,'ملف التوالي',{fs:10.5,col:'--muted'})}
 else s+=S.w(`M62 70V${yT}H${xm}V125`,cM);
 s+=S.w(`M62 250V${yB}H${xm}V205`,cM);
 // voltmeter
 s+=S.w(`M150 ${yT}V134M150 166V${yB}`,on?'live':'')+`<circle cx="150" cy="150" r="16" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/>`+S.t(150,155,'V','')+S.dot(150,yT)+S.dot(150,yB);
 if(r.V)s+=S.t(172,154,r.V,'b','start');
 // ammeter in armature line + Ia arrow
 const amm=(x,y,l,rd,ry)=>`<circle cx="${x}" cy="${y}" r="16" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/>`+S.t(x,y+4,l,'')+(rd?S.t(x,y+ry,rd,'b'):'');
 const xa=type==='sep'?240:type==='shunt'?290:300;
 s+=amm(xa,yT,type==='sep'?'A2':'A',r.Ia,36);
 const ax=type==='sep'?185:xa+20;s+=arrow(ax,yT-14,ax+28,yT-14,'--blue',1.6)+S.t(ax+14,yT-20,'Ia','b');
 // shunt field branch
 if(type==='shunt'){const xf=232;s+=S.dot(xf,yT)+S.dot(xf,yB)+S.w(`M${xf} ${yT}V95`,cF)+ind(xf,95,xf,215,5,cF)+S.w(`M${xf} 215V${yB}`,cF)+S.t(246,102,'E1','m','start')+S.t(246,222,'E2','m','start')+S.t(252,162,'Vf','m','start')+arrow(268,108,268,136,'--blue',1.5)+S.t(276,126,'If','b','start');
  if(o.fault)s+=`<path d="M${xf-9} 62L${xf+9} 80M${xf+9} 62L${xf-9} 80" stroke="var(--stop)" stroke-width="3" stroke-linecap="round"/>`+arT(xf-14,74,'مفصول',{fs:11,a:'end',col:'--stop'});}
 // motor
 s+=`<circle cx="${xm}" cy="${ym}" r="40" class="coil ${on&&Math.abs(o.n||0)>0.5?'on':''}"/>`+`<rect x="${xm-9}" y="121" width="18" height="8" fill="var(--fg)"/><rect x="${xm-9}" y="201" width="18" height="8" fill="var(--fg)"/>`;
 s+=`<g id="${o.gid||'dmrot'}" transform="rotate(${fx(o.ang||0)} ${xm} ${ym})"><path d="M${xm} ${ym-16}V${ym-31}" stroke="var(--blue)" stroke-width="4" stroke-linecap="round"/></g>`+S.t(xm,ym+6,'M','',null,17);
 s+=S.t(xm-14,121,'1B1','m','end')+S.t(xm-14,219,'2B2','m','end');
 // shaft, tacho, speed meter, coupling, brake
 s+=`<path d="M${xm+40} ${ym}H610" stroke="var(--muted)" stroke-width="6"/>`;
 s+=`<rect x="420" y="${ym-22}" width="60" height="44" rx="6" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/>`+S.t(450,ym+4,'Tacho','m');
 s+=`<path d="M450 ${ym-22}V112" class="mech"/><rect x="398" y="82" width="104" height="30" rx="6" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/>`+S.t(450,102,r.n||'Speed',r.n?'b':'m')+S.t(450,76,'Speed','m');
 const d=(o.n||0)<-0.5?-1:1;s+=d>0?arrow(500,ym-16,532,ym-16,'--fg',1.6):arrow(532,ym-16,500,ym-16,'--fg',1.6);s+=S.t(516,ym-22,'n','');
 s+=`<rect x="545" y="${ym-12}" width="12" height="24" fill="var(--fg)"/><rect x="561" y="${ym-12}" width="12" height="24" fill="var(--fg)"/>`;
 s+=`<rect x="610" y="${ym-40}" width="136" height="80" rx="8" fill="var(${(o.T||0)>0?'--live-soft':'--surface-2'})" stroke="var(--fg)" stroke-width="1.6"/>`+S.t(678,ym-6,'Brake')+S.t(678,ym+12,'N.m','m')+arT(678,ym+30,'جهاز الفرملة',{fs:10.5,col:'--muted'});
 if(r.T)s+=S.t(678,ym-50,r.T,'b');
 // separate field circuit (fig 5)
 if(type==='sep'){s+=`<rect x="640" y="228" width="106" height="82" rx="8" fill="var(${o.fld?'--on-soft':'--surface-2'})" stroke="var(--fg)" stroke-width="1.6"/>`+arT(693,250,'مصدر المجال',{fs:11.5})+S.t(693,270,'0-240 V','m')+S.t(693,286,'0-6 A','m')+S.t(652,244,'+','')+S.t(652,300,'−','');
  s+=S.w('M640 248H430V290H450',cF)+ind(450,290,560,290,5,cF)+S.w('M560 290H640',cF);
  s+=amm(595,248,'A1',r.If,32)+arrow(530,236,498,236,'--blue',1.5)+S.t(514,230,'If','b');
  s+=S.t(450,310,'E1','m')+S.t(560,310,'E2','m')+S.t(505,276,'Vf','m');}
 return s+'</svg>'}

/* ---------- tables as printed ---------- */
const TB={
 '5-1':{id:'5-1',cap:'جدول (5-1)',ref:'ص 26',condTxt:'I<sub>f</sub> = 0.3 A and T = 0 N.m',cond:[['If',0.3],['T',0]],v:'Vin',head:'V<sub>in</sub> (v)',pts:[60,100,130,150,170]},
 '5-2':{id:'5-2',cap:'جدول (5-2)',ref:'ص 26',condTxt:'If = 0.3 A and Vin = 120V',cond:[['If',0.3],['Vin',120]],v:'T',head:'T (N.m)',pts:[0,0.1,0.2,0.3,0.4]},
 '5-3':{id:'5-3',cap:'جدول (5-3)',ref:'ص 26',condTxt:'T = 0 N.m and Vin = 120 V',cond:[['T',0],['Vin',120]],v:'If',head:'I<sub>f</sub> (A)',pts:[0.1,0.15,0.2,0.25,0.3]},
 '6-1':{id:'6-1',cap:'جدول (6-1)',ref:'ص 30',condTxt:'T = 0 N.m',cond:[['T',0]],v:'Vin',head:'V<sub>in</sub> (V)',pts:[60,80,100,120,140]},
 '6-2':{id:'6-2',cap:'جدول (6-2)',ref:'ص 30',condTxt:'Vin = 120 V',cond:[['Vin',120]],v:'T',head:'T (N.m)',pts:[0,0.1,0.2,0.3,0.4]},
 '7-1':{id:'7-1',cap:'جدول (7-1)',ref:'ص 33',condTxt:'T = 0 N.m',cond:[['T',EXP7_TMIN]],condNote:`في المختبر: T = ${EXP7_TMIN} N.m (أصغر حمل) بدل T = 0 — راجع «ملاحظات على الكتاب»`,v:'Vin',head:'V<sub>in</sub> (V)',pts:[20,40,60,80,100]},
 '7-2':{id:'7-2',cap:'جدول (7-2)',ref:'ص 33',condTxt:'Vin = 100 V',cond:[['Vin',100]],v:'T',head:'T (N.m)',pts:[0,0.1,0.2,0.3,0.4],skip:[0]}
};
const TOL={Vin:0.5,T:0.005,If:0.0025};
const VNAME={Vin:'V<sub>in</sub>',T:'T',If:'I<sub>f</sub>'};
const VUNIT={Vin:'V',T:'N.m',If:'A'};
const VDP={Vin:0,T:2,If:3};
function tableHTML(t){return `<p class="sub" style="margin-top:12px"><b>${t.cap}</b> — «<span class="ltr">${t.condTxt}</span>» <span class="ref">${t.ref}</span></p><div class="dm-tbl"><table class="tt" dir="ltr"><tbody><tr><th class="l">${t.head}</th>${t.pts.map(p=>`<td class="l"><b>${p}</b></td>`).join('')}</tr><tr><th class="l">n (r.p.m)</th>${t.pts.map(()=>'<td></td>').join('')}</tr><tr><th class="l">I<sub>a</sub> (A)</th>${t.pts.map(()=>'<td></td>').join('')}</tr></tbody></table></div>`}

/* =====================================================================
   المنضدة الافتراضية المشتركة (تُبنى لكل تجربة بإعداداتها)
   ===================================================================== */
function bench(el,cfg){
 const type=cfg.type;const tabs=cfg.tables.map(id=>TB[id]);let sel=0;
 const s={n:0,Ia:0,If:0,Te:0,k:0,arm:0,fld:0,Vin:0,Vf:0,T:cfg.T0||0,rf:0,ra:0,sg:chF('arev')?-1:1,fault:0,trip:'',peak:0,pkOn:0,pkT:0,ocT:0,ang:0,dnf:0,t:0,startV:0};
 const did={};const R={};tabs.forEach(t=>R[t.id]={pts:{},free:[]});let startRec=null,msg='',msgCls='',lastSpike=-99,blockMsg=0;
 const P=cfg.prefix;
 const supplyCtl=type==='sep'
  ?`<div class="dm-box"><h3>مصدر المجال <span class="ltr">0-240 V / 0-6 A</span> (يغذي E1–E2)</h3><div class="dm-row">${swHTML(P+'fsw','Vf','تشغيل المجال')}</div>${sl(P+'vf','جهد مصدر المجال V<sub>f</sub>',0,240,0.1,0)}${fine('vf',[-10,-1,-0.1,0.1,1,10])}</div>
    <div class="dm-box"><h3>مصدر المنتج <span class="ltr">Vin 0-250 V DC</span></h3><div class="dm-row">${swHTML(P+'asw','Vin','تشغيل المنتج')}</div>${sl(P+'vin','جهد المصدر V<sub>in</sub>',0,250,1,0)}${fine('vin',[-10,-1,1,10])}</div>`
  :`<div class="dm-box"><h3>مصدر القدرة <span class="ltr">Vin 0-250 V DC</span>${type==='shunt'?' (يغذي المنتج والمجال معاً)':''}</h3><div class="dm-row">${swHTML(P+'asw','Vin','تشغيل المصدر')}</div>${sl(P+'vin','جهد المصدر V<sub>in</sub>',0,250,1,0)}${fine('vin',[-10,-1,1,10])}</div>`;
 const revCtl=type==='series'?'':`<div class="dm-row"><button class="btn" id="${P}rf" aria-pressed="false">عكس أطراف المجال E1–E2</button><button class="btn" id="${P}ra" aria-pressed="false">عكس أطراف المنتج 1B1–2B2</button>${type==='shunt'?`<button class="btn" id="${P}flt" aria-pressed="false">فصل مفاجئ لملف المجال (محاكاة عطل)</button>`:''}</div>`;
 el.innerHTML=`<div id="${P}tp"></div><div class="grid dm-lab">
  <div class="panel c12"><h2>${cfg.benchTitle} <small>مبنية على الشكل ${cfg.fig} ${cfg.figRef}</small></h2>
   <div class="dm-row"><div><div class="sub">الجزء من الخطوات (الجدول الذي تسجّل فيه)</div>${segHTML(P+'tab',tabs.map((t,i)=>[i,cfg.partNames[i]+' — '+t.cap]),0)}</div></div>
   <div class="dm-conds" id="${P}cond"></div>
   <p class="sub">${cfg.benchNote} الأرقام <span id="${P}tpw">توضيحية</span> لآلة معمل صغيرة؛ الآلة نفسها في التجارب الثلاث (5 و6 و7).</p></div>
  <div class="panel c12"><h2>الدائرة والأجهزة</h2><div class="svgbox dm-wide" id="${P}svg" style="max-width:900px;margin-inline:auto"></div>
   <p class="sub">الدوران على الشاشة مبطأ. الخطوط المتقطعة المتحركة = يمر تيار.</p></div>
  <div class="panel c7"><h2>التحكم</h2>
   ${supplyCtl}
   <div class="dm-box"><h3>جهاز الفرملة (Brake) — العزم الواقع على المحرك</h3>${sl(P+'tq','عزم الفرملة T',0,0.6,0.01,s.T)}${fine('tq',[-0.1,-0.01,0.01,0.1])}</div>
   ${revCtl}</div>
  <div class="panel c5"><h2>قراءات الأجهزة</h2><div class="dm-meters" id="${P}m"></div>
   <div class="dm-row"><span class="dm-chip" id="${P}chip"></span></div>
   <div id="${P}warn"></div>
   <div class="dm-row"><button class="btn primary" id="${P}rec">سجّل القراءة</button>${cfg.startRec?`<button class="btn" id="${P}srec">سجّل تيار البدء</button>`:''}<button class="btn" id="${P}rst" style="display:none">إعادة ضبط الحماية</button></div>
   <div id="${P}msg"></div><div id="${P}start"></div>
   <p class="sub">${cfg.meterNote}</p></div>
  <div class="panel c12"><h2>الجداول <small>تمتلئ عند «سجّل القراءة» إذا كان المتغير على قيمة الجدول، وإلا تُضاف «قراءة حرة»</small></h2><div id="${P}tbls"></div>
   <div class="dm-row"><button class="btn" id="${P}clr">امسح قراءات الجدول المختار</button></div></div>
  <div class="panel c12"><h2>منحنيات الخواص <small>المحاور كما في شبكات الكتاب ${cfg.plotRef}</small></h2><div class="dm-plots" id="${P}plots"></div>
   <div class="dm-leg"><span><i style="background:var(--blue)"></i>قراءات الجدول</span><span><i style="background:var(--muted);border-radius:0"></i>قراءات حرة</span><span><i style="border:2px solid var(--live);background:none"></i>نقطة التشغيل الآن</span></div>
   ${cfg.plotNote?`<p class="sub">${cfg.plotNote}</p>`:''}</div>
  <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="${P}st"></ol></div></div>`;
 const $=q=>el.querySelector(q);
 const TP=B.params($('#'+P+'tp'),'u2-dcm',motorDefs(type),()=>{Object.keys(R).forEach(k=>R[k]={pts:{},free:[]});startRec=null;setMsg('تغيّرت أرقام الآلة، فمسحنا القراءات المسجلة لتبدأ بها من جديد.','');
  TP.warn(TP.v.nMax<=TP.v.nN?'أقصى سرعة آمنة يجب أن تكون أكبر من السرعة المقننة.':'');tpw();drawTables();drawPlots();$('#'+P+'start').innerHTML='';steps.redraw()});
 const v=()=>TP.v;
 const tpw=()=>{$('#'+P+'tpw').textContent=TP.trainer?'من قيم المدرب':'توضيحية'};tpw();
 const setMsg=(h,c)=>{msg=h;msgCls=c;const m=$('#'+P+'msg');if(m)m.innerHTML=h?`<div class="callout ${c}">${h}</div>`:''};
 /* field current shown on A1 (sep) or computed (shunt) */
 const fieldI=()=>type==='sep'?(s.fld&&!chF('fopen')?s.Vf/v().Rf:0):type==='shunt'?(s.arm&&!s.trip&&!s.fault&&!chF('fopen')?s.Vin/v().Rf:0):v().aSe*s.Ia;
 const cur=k=>k==='Vin'?s.Vin:k==='T'?s.T:fieldI();
 const match=(k,val)=>Math.abs(cur(k)-val)<=TOL[k]+1e-9;
 const running=()=>s.arm&&!s.trip&&Math.abs(s.n)>1;
 const steady=()=>Math.abs(s.dnf)<Math.max(3,0.003*Math.abs(s.n));
 const full=id=>{const t=TB[id];return t.pts.every((p,j)=>(t.skip&&t.skip.includes(j))||R[id].pts[j])};
 /* ----- controls ----- */
 const bindSl=(id,key,dp)=>{const r=$('#'+P+id);r.oninput=()=>{s[key]=+r.value;afterSet(key)};};
 const showSl=()=>{[['vin','Vin',0,'V'],['tq','T',2,'N.m']].concat(type==='sep'?[['vf','Vf',1,'V']]:[]).forEach(([id,key,dp,u])=>{const r=$('#'+P+id);if(r&&+r.value!==s[key])r.value=s[key];const b=$('#'+P+id+'-v');if(b)b.textContent=fm(s[key],dp)+' '+u})};
 const afterSet=key=>{if(key==='T'&&type==='series'&&s.T<EXP7_TMIN-1e-9&&running())did.lowT=1;showSl()};
 bindSl('vin','Vin');bindSl('tq','T');if(type==='sep')bindSl('vf','Vf');
 el.addEventListener('click',e=>{const b=e.target.closest('[data-fk]');if(!b)return;const key={vin:'Vin',tq:'T',vf:'Vf'}[b.dataset.fk],mx={Vin:250,T:0.6,Vf:240}[key],dp={Vin:0,T:2,Vf:1}[key];
  s[key]=clamp(B.round(s[key]+ +b.dataset.fv,dp),0,mx);afterSet(key)});
 const swSet=(id,on)=>{const b=$('#'+P+id);if(b)b.setAttribute('aria-pressed',on?'true':'false')};
 const armOn=()=>{
  if(s.trip){setMsg('الحماية فاصلة: اضغط «إعادة ضبط الحماية» أولاً.','err');return}
  if(type==='series'&&s.T<EXP7_TMIN-1e-9){did.blocked=1;blockMsg=1;setMsg(`<b>منعنا التشغيل:</b> محرك التوالي لا يُشغَّل بدون حمل. عزم الفرملة الآن <span class="ltr">${fm(s.T,2)} N.m</span>. بلا حمل يكون تيار المنتج صغيراً جداً، وتيار المنتج نفسه هو تيار المجال، فيضعف المجال وترتفع السرعة بلا حد (جموح) حتى يتلف المحرك. اضبط الفرملة على <span class="ltr">${EXP7_TMIN} N.m</span> على الأقل (أصغر حمل في جداول التجربة) ثم شغّل.`,'err');return}
  s.arm=1;s.pkOn=1;s.pkT=0;s.peak=0;s.startV=s.Vin;s.startN=Math.abs(s.n);startRec=null;$('#'+P+'start').innerHTML='';blockMsg=0;
  if(type==='sep'&&!s.fld){did.armNoField=1;setMsg('<b>خطأ في الترتيب!</b> وصلت المنتج ودائرة المجال مفصولة. الكتاب: «يجب توصيل دائرة المجال عند بدء التجربة والتأكد من وجود تيار المجال قبل توصيل دائرة المنتج» (ص 28). المجال الآن هو المغناطيسية المتبقية فقط: التيار كبير، وإذا دار المحرك بلا حمل ترتفع سرعته بشدة.','err')}
  else setMsg('','');
  swSet('asw',1)};
 const armOff=()=>{s.arm=0;s.pkOn=0;swSet('asw',0);if(type==='sep'&&s.fld)did.armOffFirst=1;if(msgCls==='err'&&!s.trip)setMsg('','')};
 $('#'+P+'asw').onclick=()=>{s.arm?armOff():armOn()};
 if(type==='sep')$('#'+P+'fsw').onclick=()=>{
  if(s.fld){s.fld=0;swSet('fsw',0);if(s.arm&&!s.trip){did.fieldOffFirst=1;setMsg('<b>خطأ في ترتيب الفصل!</b> فصلت المجال والمنتج ما زال موصلاً: يضعف المجال إلى المغناطيسية المتبقية فيزيد التيار وترتفع السرعة بشدة. الكتاب: «قم بفصل دائرة المنتج قبل فصل دائرة المجال» (ص 28).','err')}else if(did.armOffFirst&&!s.arm){did.offOK=1;setMsg('أحسنت: فصلت المنتج أولاً ثم المجال — الترتيب الصحيح (ص 28).','')}}
  else{s.fld=1;swSet('fsw',1);did.armOffFirst=0}};
 const revBtn=(id,key)=>{const b=$('#'+P+id);if(!b)return;b.onclick=()=>{if(s.arm||Math.abs(s.n)>0.5){setMsg('أوقف المحرك أولاً: افصل '+(type==='sep'?'مصدر المنتج':'المصدر')+' وانتظر حتى تصبح السرعة صفراً، ثم اعكس الأطراف (المصدر مفصول).','err');return}
  s[key]=s[key]?0:1;b.setAttribute('aria-pressed',s[key]?'true':'false');s.sg=(s.rf?-1:1)*(s.ra?-1:1)*(chF('arev')?-1:1);did.rev=1;
  setMsg(s.rf&&s.ra?'عكست أطراف المجال وأطراف المنتج معاً: الاتجاه يرجع كما كان (عكس الاثنين = لا عكس).':(s.rf||s.ra)?'عكست أطراف '+(s.rf?'المجال':'المنتج')+'. شغّل الآن ولاحظ اتجاه الدوران.':'رجعت الأطراف كما كانت.','')}};
 revBtn('rf','rf');revBtn('ra','ra');
 const fb=$('#'+P+'flt');if(fb)fb.onclick=()=>{s.fault=s.fault?0:1;fb.setAttribute('aria-pressed',s.fault?'true':'false');if(s.fault&&running()){did.fault=1;did.faultT=s.T;setMsg(`فصلت ملف المجال فجأة والمحرك يعمل ${s.T>0.005?'وعليه حمل':'بدون حمل'}: يبقى المجال من المغناطيسية المتبقية فقط. راقب التيار والسرعة.`,'err')}else if(!s.fault)setMsg('أعدت توصيل ملف المجال.','')};
 $('#'+P+'rst').onclick=()=>{s.trip='';s.ocT=0;setMsg('أعيد ضبط الحماية. شغّل المصدر من جديد (ابدأ من جهد صغير).','')};
 el.querySelectorAll(`[data-${P}tab]`).forEach(b=>b.onclick=()=>{sel=+b.dataset[P+'tab'];segSet(el,P+'tab',sel);drawTables();drawConds()});
 $('#'+P+'clr').onclick=()=>{R[tabs[sel].id]={pts:{},free:[]};drawTables();drawPlots()};
 /* ----- record ----- */
 $('#'+P+'rec').onclick=()=>{const t=tabs[sel];
  if(s.trip)return setMsg('الحماية فاصلة. أعد ضبطها وشغّل المحرك.','err');
  if(!running())return setMsg('شغّل المحرك أولاً: لا توجد سرعة لتسجيلها.','err');
  if(!steady())return setMsg('انتظر حتى تستقر السرعة (يتوقف تغير قراءة عداد السرعة) ثم سجّل.','err');
  const bad=t.cond.filter(([k,val])=>!match(k,val));
  if(bad.length)return setMsg(`شرط ${t.cap}: ${bad.map(([k,val])=>`${VNAME[k]} = ${lt(fm(val,VDP[k])+' '+VUNIT[k])}`).join(' و ')}. اضبطه أولاً (القيمة الآن ${bad.map(([k])=>lt(fm(cur(k),VDP[k])+' '+VUNIT[k])).join(' و ')}).`,'err');
  const row={x:B.round(cur(t.v),VDP[t.v]),n:Math.round(Math.abs(s.n)),Ia:B.round(s.Ia,2),If:B.round(fieldI(),3)};
  const j=t.pts.findIndex(p=>match(t.v,p));
  if(j>=0&&t.skip&&t.skip.includes(j))return setMsg('هذا العمود لا يُسجَّل: محرك التوالي لا يعمل عند T = 0 (خطر الجموح).','err');
  if(j>=0){R[t.id].pts[j]=row;setMsg(`سُجّلت القراءة في ${t.cap} عند ${VNAME[t.v]} = ${lt(fm(t.pts[j],VDP[t.v])+' '+VUNIT[t.v])}: ${lt('n = '+row.n+' rpm')}، ${lt('Ia = '+fm(row.Ia,2)+' A')}.`,'')}
  else{const F=R[t.id].free;if(F.length>=8)F.shift();F.push(row);setMsg(`${VNAME[t.v]} = ${lt(fm(row.x,VDP[t.v])+' '+VUNIT[t.v])} ليست من قيم الجدول، فأضفناها «قراءة حرة».`,'')}
  drawTables();drawPlots()};
 if(cfg.startRec)$('#'+P+'srec').onclick=()=>{if(!(s.peak>0)||s.startV<=0)return setMsg('شغّل المنتج والجهد مضبوط مسبقاً (مثلاً 120 V) والمحرك واقف، ثم سجّل تيار البدء.','err');
  if(s.startN>20)return setMsg(`المحرك كان ما زال يدور (${lt(fm(s.startN,0)+' rpm')}) لحظة التشغيل، فالتيار أقل من تيار البدء الحقيقي. افصل المنتج وانتظر حتى تصبح السرعة صفراً ثم شغّل.`,'err');
  startRec={I:B.round(s.peak,2),V:s.startV};did.startRec=1;const x=startRec.I/v().IaN;
  $('#'+P+'start').innerHTML=`<div class="callout ${x>1.5?'err':''}"><b>تيار البدء المسجل:</b> ${lt(fm(startRec.I,2)+' A')} عند ${lt('Vin = '+fm(startRec.V,0)+' V')}. التيار المقنن ${lt(fm(v().IaN,2)+' A')} (${TP.trainer?'من قيم المدرب':'توضيحي'})، فتيار البدء ≈ ${lt(fm(x,1))} ضعف المقنن. لحظة البدء السرعة صفر فلا يوجد جهد عكسي، والذي يحدّ التيار هو مقاومة المنتج فقط: ${lt('Vin / Ra = '+fm(startRec.V/v().Ra,2)+' A')}.</div>`};
 /* ----- drawing ----- */
 const drawConds=()=>{const t=tabs[sel];$('#'+P+'cond').innerHTML=t.cond.map(([k,val])=>`<span class="dm-chip ${match(k,val)?'ok':'hot'}">${match(k,val)?'✓':'✗'} ${VNAME[k]} = ${lt(fm(val,VDP[k])+' '+VUNIT[k])}</span>`).join('')+`<span class="dm-chip">المتغير: ${VNAME[t.v]} ← ${t.pts.filter((p,j)=>!(t.skip&&t.skip.includes(j))).map(p=>lt(fm(p,VDP[t.v]))).join('، ')}</span>`+(t.condNote?`<span class="dm-chip warn">${t.condNote}</span>`:'')};
 const drawTables=()=>{$('#'+P+'tbls').innerHTML=tabs.map((t,i)=>{const r=R[t.id],F=r.free;const cj=i===sel?t.pts.findIndex(p=>match(t.v,p)):-1;
  const cell=(j,f)=>{const x=t.skip&&t.skip.includes(j);const c=r.pts[j];return `<td class="l ${j===cj?'cur':''} ${x?'x':''}">${x?'—':c?f(c):''}</td>`};
  return `<p class="sub" style="margin-top:12px"><b>${t.cap}</b> — «${lt(t.condTxt)}» <span class="ref">${t.ref}</span> ${i===sel?'<span class="dm-chip ok">المختار</span>':''}${t.condNote?` <span class="dm-chip warn">${t.condNote}</span>`:''}</p><div class="dm-tbl"><table class="tt" dir="ltr"><tbody>
   <tr><th class="l">${t.head}</th>${t.pts.map((p,j)=>`<td class="l ${j===cj?'cur':''} ${t.skip&&t.skip.includes(j)?'x':''}"><b>${p}</b></td>`).join('')}${F.map(f=>`<td class="l free"><b>${fm(f.x,VDP[t.v])}</b></td>`).join('')}</tr>
   <tr><th class="l">n (r.p.m)</th>${t.pts.map((p,j)=>cell(j,c=>c.n)).join('')}${F.map(f=>`<td class="l free">${f.n}</td>`).join('')}</tr>
   <tr><th class="l">I<sub>a</sub> (A)</th>${t.pts.map((p,j)=>cell(j,c=>fm(c.Ia,2))).join('')}${F.map(f=>`<td class="l free">${fm(f.Ia,2)}</td>`).join('')}</tr></tbody></table></div>`+(t.skip?'<p class="sub">العمود T = 0 مشطوب: لا يُشغَّل محرك التوالي بلا حمل.</p>':'')}).join('')};
 const drawPlots=()=>{$('#'+P+'plots').innerHTML=cfg.plots.map(pl=>{const t=TB[pl.tab],r=R[t.id];
  const val=(row,key)=>key==='n'?row.n:key==='Ia'?row.Ia:key==='If'?(t.v==='If'?row.x:row.If):key===t.v?row.x:t.cond.find(c=>c[0]===key)[1];
  const pts=Object.keys(r.pts).map(j=>{const row=r.pts[j];return [val(row,pl.x),val(row,pl.y),+j]});
  const free=r.free.map(row=>[val(row,pl.x),val(row,pl.y)]);
  const opOK=running()&&t.cond.every(([k,vv])=>match(k,vv));const now={n:Math.abs(s.n),Ia:s.Ia,If:fieldI(),Vin:s.Vin,T:s.T};
  return `<figure>${box(plotXY({pts,free,op:opOK?[now[pl.x],now[pl.y]]:null,xl:pl.xl,yl:pl.yl,dx:pl.dx,dy:pl.dy,aria:pl.cap}),380)}<figcaption>${pl.cap}</figcaption></figure>`}).join('')};
 const meters=()=>{const vv=v(),If=fieldI();const hot=s.Ia>vv.IaN*1.05;
  const list=[['V — جهد المصدر',fm(s.Vin,0)+' V'],[(type==='sep'?'A2':'A')+' — تيار المنتج I<sub>a</sub>',fm(s.Ia,2)+' A',hot],
   type==='sep'?['A1 — تيار المجال I<sub>f</sub>',fm(If,3)+' A']:type==='shunt'?['تيار المجال I<sub>f</sub> = V<sub>in</sub>/R<sub>f</sub> (محسوب — لا أميتر له في الشكل)',fm(If,3)+' A']:['تيار ملف التوالي D1–D2 (هو نفسه I<sub>a</sub>)',fm(s.Ia,2)+' A'],
   ['Speed — السرعة n',fm(Math.abs(s.n),0)+' rpm',Math.abs(s.n)>vv.nN],['Brake — العزم T',fm(s.T,2)+' N.m'],
   ['تيار البدء (أعلى قيمة بعد آخر تشغيل)',s.peak>0?fm(s.peak,2)+' A':'—',s.peak>vv.IaN*1.5]];
  $('#'+P+'m').innerHTML=list.map(([a,b,h])=>`<div class="dm-meter ${h?'hot':''}"><span>${a}</span><b>${b}</b></div>`).join('');
  const ch=$('#'+P+'chip');const dir=s.n>0.5?'مع عقارب الساعة ↻':s.n<-0.5?'عكس عقارب الساعة ↺':'';
  if(s.trip){ch.className='dm-chip warn';ch.textContent='فصلت الحماية المصدر'}
  else if(!s.arm){ch.className='dm-chip';ch.textContent=Math.abs(s.n)>0.5?'يتباطأ (المصدر مفصول)':'متوقف'}
  else if(Math.abs(s.n)<0.5){ch.className='dm-chip hot';ch.textContent=s.Vin>0?'موصل ولا يدور (العزم أقل من الحمل)':'موصل والجهد صفر'}
  else{ch.className=steady()?'dm-chip ok':'dm-chip hot';ch.textContent=(steady()?'يدور مستقراً — ':'السرعة تتغير — ')+dir}};
 const warnings=()=>{const vv=v();let w='';const n=Math.abs(s.n);
  if(s.trip==='speed')w+=`<div class="callout err"><b>فصلت الحماية المصدر:</b> تجاوزت السرعة أقصى سرعة آمنة ${lt(fm(vv.nMax,0)+' rpm')}. ${cfg.runaway}</div>`;
  else if(s.trip==='current')w+=`<div class="callout err"><b>فصلت الحماية المصدر:</b> بقي تيار المنتج أكبر من ضعف المقنن (${lt(fm(2*vv.IaN,2)+' A')}) أكثر من ثانيتين.</div>`;
  else{
   if(s.t-lastSpike<4&&s.peak>vv.IaN*1.5)w+=`<div class="callout err"><b>تيار بدء كبير:</b> ${lt(fm(s.peak,2)+' A')} ≈ ${lt(fm(s.peak/vv.IaN,1))} ضعف التيار المقنن (${lt(fm(vv.IaN,2)+' A')}). الشكل ${cfg.fig} ليس فيه مقاومة بدء، فعند السكون لا يحدّ التيار إلا مقاومة ${type==='series'?'المنتج وملف التوالي':'المنتج'}. ابدأ والجهد صفر ثم ارفعه تدريجياً.</div>`;
   else if(s.Ia>vv.IaN*1.05)w+=`<div class="callout err">تيار المنتج ${lt(fm(s.Ia,2)+' A')} أكبر من المقنن ${lt(fm(vv.IaN,2)+' A')}.</div>`;
   if(s.arm&&n>vv.nN)w+=`<div class="callout err"><b>تحذير:</b> السرعة ${lt(fm(n,0)+' rpm')} فوق السرعة المقننة ${lt(fm(vv.nN,0)+' rpm')}. ${cfg.overspeed}</div>`;
   if(type==='series'&&s.arm&&s.T<EXP7_TMIN-1e-9)w+=`<div class="callout err"><b>خطر الجموح:</b> خفّضت الحمل تحت ${lt(EXP7_TMIN+' N.m')} والمحرك يعمل — ارجع الفرملة فوراً.</div>`;
   if(type==='sep'&&s.arm&&!s.fld)w+='<div class="callout err">المنتج موصل ودائرة المجال مفصولة!</div>';}
  $('#'+P+'warn').innerHTML=w;$('#'+P+'rst').style.display=s.trip?'':'none'};
 let sig='',plotT=0;
 const drawSVG=()=>{const vv=v();const rd={V:fm(s.Vin,0)+' V',Ia:fm(s.Ia,2)+' A',n:fm(Math.abs(s.n),0)+' rpm',T:fm(s.T,2)+' N.m',If:fm(fieldI(),3)+' A'};
  const k=JSON.stringify([rd,s.arm,s.fld,s.fault,s.trip,s.n>0.5?1:s.n<-0.5?-1:0]);if(k===sig)return;sig=k;
  $('#'+P+'svg').innerHTML=figSVG(type,{arm:s.arm&&!s.trip,fld:s.fld,fault:s.fault,trip:s.trip,Ia:s.Ia,If:fieldI(),n:s.n,T:s.T,ang:s.ang,gid:P+'rot',rd})};
 /* ----- steps ----- */
 const steps=stepsUI($('#'+P+'st'),cfg.steps({s,v,R,did,full,running,steady,match,fieldI,startRec:()=>startRec}));
 showSl();drawTables();drawConds();drawPlots();
 loopOn(el,dt=>{const vv=v();s.t+=dt;
  if(type==='sep')s.If=s.fld&&!chF('fopen')?s.Vf/vv.Rf:0;else if(type==='shunt')s.If=s.arm&&!s.trip&&!s.fault&&!chF('fopen')?s.Vin/vv.Rf:0;
  const n0=s.n;motorStep(type,vv,s,dt);
  if(s.pkOn){s.pkT+=dt;if(s.pkT>3)s.pkOn=0}
  if(s.peak>vv.IaN*1.5&&s.pkOn)lastSpike=s.t;
  if(dt>0)s.dnf+=((s.n-n0)/dt-s.dnf)*Math.min(1,dt*8);
  // protection
  if(!s.trip&&s.arm){if(Math.abs(s.n)>vv.nMax){s.trip='speed';did.trip=1;if(type==='series')did.runaway=1}
   if(s.Ia>2*vv.IaN&&!s.pkOn){s.ocT+=dt;if(s.ocT>2){s.trip='current';did.trip=1}}else s.ocT=0;
   if(s.trip){s.arm=0;s.pkOn=0;swSet('asw',0)}}
  if(s.arm&&Math.abs(s.n)>50&&s.sg<0)did.revRun=1;
  s.ang=(s.ang+s.n/60*360*dt/25)%360;const g=el.querySelector('#'+P+'rot');if(g)g.setAttribute('transform',`rotate(${fx(s.ang)} 360 165)`);
  drawSVG();meters();warnings();
  plotT+=dt;if(plotT>0.25){plotT=0;drawConds();drawPlots();if(sel>=0){const t=tabs[sel];const cj=t.pts.findIndex(p=>match(t.v,p));if(cj!==s._cj){s._cj=cj;drawTables()}}}
  steps.check()});
}

/* =====================================================================
   Lesson 2.1 — التجربة الخامسة: المحرك منفصل التغذية
   ===================================================================== */
const UNIT2_HEAD={h:'الوحدة الثانية: التجارب على محركات التيار المستمر',ref:'ص 22–23',html:`<p><b>الهدف العام للوحدة:</b> تعيين منحنيات الخواص لمحركات التيار المستمر بأنواعه المختلفة، وكذلك تنفيذ عملية التحكم في سرعة محرك التيار المستمر بالطرق المختلفة.</p>
 <p><b>الأهداف التفصيلية:</b></p><ol><li>أن يتمكن المتدرب من تعيين منحنيات الخواص لمحرك التغذية المنفصلة.</li><li>أن يتعرف المتدرب على كيفية بدء الحركة والتحكم في السرعة وكذلك كيفية عكسها.</li><li>أن يتمكن المتدرب من الحصول على منحنيات الخواص لمحرك التوازي عند تحميله.</li><li>أن يتمكن المتدرب من الحصول على منحنيات الخواص لمحرك التوالي عند تحميله.</li><li>أن يتمكن المتدرب من الحصول على منحنيات الخواص للمحرك المركب بنوعيه في حالة الحمل.</li><li>أن يتمكن المتدرب من التحكم في محركات التيار المستمر.</li></ol>
 <p class="sub">تجارب الوحدة: الخامسة (هذا الدرس)، السادسة (محرك التوازي)، السابعة (محرك التوالي).</p>`};
const DC_BASICS={note:`<b>توضيح للمتدرب — ليس من الكتاب: كيف يعمل محرك التيار المستمر؟</b>
 <p>عندما يدور المنتج داخل المجال يتولد فيه جهد عكسي \\(E\\) يتناسب مع المجال \\(\\phi\\) ومع السرعة \\(n\\). جهد المصدر يساوي هذا الجهد العكسي مضافاً إليه الهبوط في مقاومة المنتج:</p>
 $$V_{in} = E + I_a R_a \\qquad E = k\\,\\phi\\,n \\qquad T = k'\\,\\phi\\,I_a$$
 <p>ومنها السرعة:</p>$$n = \\frac{V_{in} - I_a R_a}{k\\,\\phi}$$
 <ul><li><b>زيادة الجهد \\(V_{in}\\)</b> ← تزيد السرعة تقريباً بنفس النسبة (الجدول 5-1).</li><li><b>زيادة الحمل \\(T\\)</b> ← يزيد \\(I_a\\) ليعطي العزم المطلوب، فيزيد الهبوط \\(I_aR_a\\) وتقل السرعة قليلاً (الجدول 5-2).</li><li><b>تقليل تيار المجال \\(I_f\\)</b> ← يضعف \\(\\phi\\) فتزيد السرعة كثيراً (الجدول 5-3). لو انقطع المجال تماماً يبقى المغناطيس المتبقي فقط، فترتفع السرعة ارتفاعاً خطيراً — لذلك يوصل المجال أولاً ويفصل آخراً.</li>
 <li><b>لحظة البدء</b> السرعة صفر، فلا جهد عكسي (\\(E=0\\)) ويكون التيار \\(I_a = V_{in}/R_a\\) كبيراً جداً لأن \\(R_a\\) صغيرة.</li></ul>
 <p>حتى عند \\(T = 0\\) لا يكون \\(I_a\\) صفراً: المحرك يحتاج تياراً صغيراً ليغلب الاحتكاك والتهوية.</p>`};

const EXP5_STEPS=c=>[
 {t:'صِل دائرة المجال أولاً',get x(){return `شغّل «مصدر المجال» وارفع جهده حتى يقرأ الأميتر A1 تيار المجال ${lt('If = 0.3 A')} (عند ${lt('Vf ≈ '+fm(0.3*c.v().Rf,1)+' V')} لأن مقاومة ملف المجال ${lt(fm(c.v().Rf)+' Ω')}). الكتاب: المجال قبل المنتج (ص 28).`},done:()=>c.s.fld&&c.match('If',0.3)},
 {t:'الفرملة على الصفر ثم شغّل المنتج',x:'اجعل عزم الفرملة <span class="ltr">T = 0 N.m</span>، واترك V<sub>in</sub> على الصفر، ثم شغّل «مصدر المنتج» وارفع الجهد تدريجياً: يبدأ المحرك بالدوران وتيار البدء صغير.',done:()=>c.running()&&c.s.peak<c.v().IaN*1.5},
 {t:'أولاً — جدول (5-1)',x:'اختر «أولاً». اضبط V<sub>in</sub> على 60 ثم 100 ثم 130 ثم 150 ثم 170 V، وفي كل مرة انتظر حتى تستقر السرعة واضغط «سجّل القراءة». لاحظ أن السرعة تزيد مع الجهد بنسبة شبه ثابتة.',done:()=>c.full('5-1')},
 {t:'ثانياً — جدول (5-2)',x:'اختر «ثانياً». ثبّت <span class="ltr">Vin = 120 V</span> و <span class="ltr">If = 0.3 A</span>، ثم ارفع عزم الفرملة 0 ← 0.1 ← 0.2 ← 0.3 ← 0.4 N.m وسجّل كل مرة: تقل السرعة قليلاً ويزيد I<sub>a</sub>.',done:()=>c.full('5-2')},
 {t:'ثالثاً — جدول (5-3)',get x(){return `اختر «ثالثاً». ${lt('Vin = 120 V')} و ${lt('T = 0')}، ثم اخفض جهد مصدر المجال <b>بحذر</b> حتى يصير If = 0.3 ثم 0.25 ثم 0.2 ثم 0.15 ثم 0.1 A وسجّل: السرعة تزيد كثيراً كلما قلّ المجال. إذا تجاوزت ${lt(fm(c.v().nMax,0)+' rpm')} تفصل الحماية.`},done:()=>c.full('5-3')},
 {t:'تيار البدء',get x(){return `ارفع If إلى 0.3 A، افصل مصدر المنتج وانتظر حتى يقف المحرك، اضبط ${lt('Vin = 120 V')}، ثم شغّل المنتج مباشرة واضغط «سجّل تيار البدء». قارنه بالتيار المقنن ${lt(fm(c.v().IaN,2)+' A')}: يقارب ${lt('120 / Ra = '+fm(120/c.v().Ra,1)+' A')}.`},done:()=>c.did.startRec&&c.startRec()&&c.startRec().V>=100},
 {t:'عكس اتجاه الدوران',x:'افصل مصدر المنتج وانتظر توقف المحرك، ثم اضغط «عكس أطراف المجال E1–E2» (أو أطراف المنتج) وأعد التشغيل: يدور المحرك في الاتجاه المعاكس.',done:()=>c.did.revRun},
 {t:'الفصل بالترتيب الصحيح',x:'في نهاية العمل افصل <b>مصدر المنتج أولاً</b> ثم مصدر المجال (ص 28). جرّب أيضاً — إن أردت — فصل المجال والمنتج يعمل لترى لماذا يمنع الكتاب ذلك.',done:()=>c.did.offOK}
];
B.lesson({
 id:'u2-l1',unit:2,order:1,pages:'22–28',
 title:'التجربة الخامسة: منحنى خواص السرعة مع العزم للمحرك منفصل التغذية',
 summary:'محرك تيار مستمر مجاله من مصدر منفصل: كيف تتغير سرعته مع جهد المصدر ومع الحمل ومع تيار المجال، وكيف نبدأ حركته ونعكس اتجاهه. منضدة افتراضية تأخذ منها قراءات الجداول (5-1) و(5-2) و(5-3) وترسم المنحنيات.',
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

  {st:1,short:'أهداف الوحدة',title:'الوحدة الثانية: التجارب على محركات التيار المستمر',ref:'ص 22–23',
   q:'ثلاثة محركات تيار مستمر في هذه الوحدة… فما الذي يفرّق بينها إذا كانت كلها «محركات تيار مستمر»؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ثلاث تجارب على محركات التيار المستمر: المحرك منفصل التغذية، ومحرك التوازي، ومحرك التوالي" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><text x="180" y="62" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700" direction="rtl">محركات التيار المستمر</text><g data-tip="التجربة الخامسة: المحرك منفصل التغذية — ملف المجال (البرتقالي) له مصدر خاص به."><rect x="232" y="102" width="96" height="124" fill="transparent"/><circle cx="280" cy="150" r="46" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="294" cy="150" r="13" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2.2"/><text x="294" y="154" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">M</text><path d="M294 137 V120 M294 163 V180" fill="none" stroke="#2C4A40" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M260 132 A6.0 6.0 0 0 0 260 144.0 A6.0 6.0 0 0 0 260 156.0 A6.0 6.0 0 0 0 260 168.0" fill="none" stroke="#E8735A" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M260 132 V124 M260 168 V176" fill="none" stroke="#2C4A40" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><text x="280" y="218" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">منفصل التغذية</text></g><g data-tip="التجربة السادسة: محرك التوازي — ملف المجال على التوازي مع المنتج على المصدر نفسه."><rect x="132" y="102" width="96" height="124" fill="transparent"/><circle cx="180" cy="150" r="46" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="194" cy="150" r="13" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2.2"/><text x="194" y="154" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">M</text><path d="M160 122 H194 V137 M160 178 H194 V163" fill="none" stroke="#2C4A40" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M160 132 A6.0 6.0 0 0 0 160 144.0 A6.0 6.0 0 0 0 160 156.0 A6.0 6.0 0 0 0 160 168.0" fill="none" stroke="#E8735A" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M160 122 V132 M160 168 V178" fill="none" stroke="#2C4A40" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><text x="180" y="218" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">التوازي</text></g><g data-tip="التجربة السابعة: محرك التوالي — ملف المجال على التوالي مع المنتج، فيمر فيهما التيار نفسه."><rect x="32" y="102" width="96" height="124" fill="transparent"/><circle cx="80" cy="150" r="46" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="94" cy="150" r="13" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2.2"/><text x="94" y="154" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">M</text><path d="M50 124 H56" fill="none" stroke="#2C4A40" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M56 124 A4.3 4.3 0 0 1 64.7 124 A4.3 4.3 0 0 1 73.3 124 A4.3 4.3 0 0 1 82.0 124" fill="none" stroke="#E8735A" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M82 124 H94 V137 M94 163 V176" fill="none" stroke="#2C4A40" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><text x="80" y="218" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">التوالي</text></g><text x="180" y="268" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="600" direction="rtl">الفرق بينها: من أين يأخذ ملف المجال تياره؟</text></svg>`,
   cap:'الدائرة البرتقالية في كل رسمة هي ملف المجال، والدائرة الخضراء هي المنتج <span class="ltr">M</span>.<br><b>مرّر المؤشر على كل محرك (أو المسه في الجوال) لتعرف رقم تجربته وطريقة توصيل مجاله.</b>',
   side:[
    {book:String.raw`<p><b>الهدف العام للوحدة:</b> تعيين منحنيات الخواص لمحركات التيار المستمر بأنواعه المختلفة، وكذلك تنفيذ عملية التحكم في سرعة محرك التيار المستمر بالطرق المختلفة.</p>`,ref:'ص 23'},
    {predict:{q:'ما الذي يفرّق بين المحرك منفصل التغذية ومحرك التوازي ومحرك التوالي؟',opts:[
     ['طريقة توصيل ملف المجال: من أين يأخذ تياره',true,'منفصل التغذية: مصدر خاص للمجال. التوازي: المجال على نفس مصدر المنتج. التوالي: المجال في خط المنتج نفسه. سترى ذلك في مخططات التوصيل (5) و(6) و(7).'],
     ['عدد الأقطاب فقط',false,'الوحدة لا تقارن عدد الأقطاب؛ الفرق في توصيل ملف المجال.'],
     ['نوع المصدر: متردد أو مستمر',false,'الثلاثة محركات تيار مستمر، وكلها تُغذّى بجهد مستمر.']]}}
   ],
   body:[
    {book:String.raw`<p><b>الأهداف التفصيلية:</b></p><ol><li>أن يتمكن المتدرب من تعيين منحنيات الخواص لمحرك التغذية المنفصلة.</li><li>أن يتعرف المتدرب على كيفية بدء الحركة والتحكم في السرعة وكذلك كيفية عكسها.</li><li>أن يتمكن المتدرب من الحصول على منحنيات الخواص لمحرك التوازي عند تحميله.</li><li>أن يتمكن المتدرب من الحصول على منحنيات الخواص لمحرك التوالي عند تحميله.</li><li>أن يتمكن المتدرب من الحصول على منحنيات الخواص للمحرك المركب بنوعيه في حالة الحمل.</li><li>أن يتمكن المتدرب من التحكم في محركات التيار المستمر.</li></ol>`,ref:'ص 23'},
    {tip:String.raw`<p>«منحنى الخواص» رسم يبين كيف تتغير السرعة (أو التيار) عندما نغيّر شيئاً واحداً: جهد المصدر، أو الحمل، أو تيار المجال. في كل تجربة نثبّت كل شيء ما عدا متغيراً واحداً، ونسجل القراءات في جدول، ثم نرسمها.</p>`,title:'ماذا يعني «منحنى الخواص»؟'},
    {watch:String.raw`<p>الهدف 5 عن المحرك المركب، لكن الكتاب لا يضع له تجربة: الوحدة تنتهي بالتجربة السابعة (محرك التوالي).</p>`,fix:true},
    {title:'مختبر مصغّر: من أين يأخذ المجال تياره؟',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل وصف لتوصيل ملف المجال اضغط المحرك المناسب.',cats:['منفصل التغذية','التوازي','التوالي'],items:[
 ['ملف المجال له مصدر خاص به غير مصدر المنتج.',0,'هذا المحرك منفصل التغذية: الشكل (5) فيه مصدر للمنتج ومصدر للمجال.'],
 ['ملف المجال موصل على مصدر المنتج نفسه، على التوازي مع المنتج.',1,'محرك التوازي: الشكل (6).'],
 ['ملف المجال في خط المنتج نفسه، فيمر فيه تيار المنتج كله.',2,'محرك التوالي: الشكل (7).']]})}
   ]},

  {st:2,short:'الغرض',title:'الغرض من التجربة الخامسة',ref:'ص 24',
   q:'محرك يدور أمامك… ما الأشياء التي تستطيع أن تغيّرها لتتغير سرعته؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ثلاثة أشياء نغيّرها ونراقب السرعة: جهد المصدر، والعزم، وتيار المجال، ثم عكس اتجاه الدوران" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="عداد السرعة ⟦n⟧: كل أجزاء التجربة تراقب ماذا يحدث للسرعة."><rect x="100" y="90" width="160" height="86" fill="transparent"/><path d="M102 170 A78 78 0 0 1 258 170" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M247.5 131.0 A78 78 0 0 1 258 170" fill="none" stroke="#E8735A" stroke-width="8"/><path d="M180 170 L148.1 110.0" fill="none" stroke="#2C4A40" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="180" cy="170" r="6" fill="#2C4A40"/><text x="180" y="142.7" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n</text></g><g data-tip="جهد المصدر ⟦Vin⟧ — الجزء «أولاً»."><rect x="39.0" y="62.1" width="62.0" height="23.8" rx="11.9" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.6"/><text x="70" y="78.5" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">V<tspan font-size="9" dy="4">in</tspan><tspan dy="-4">​</tspan></text></g><g data-tip="العزم ⟦T⟧ على المحرك من جهاز الفرملة — الجزء «ثانياً»."><rect x="265.0" y="62.1" width="50.0" height="23.8" rx="11.9" fill="#F2C14E" stroke="#2C4A40" stroke-width="1.6"/><text x="290" y="78.5" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T</text></g><g data-tip="تيار المجال ⟦If⟧ — الجزء «ثالثاً»."><rect x="43.0" y="202.1" width="54.0" height="23.8" rx="11.9" fill="#E8735A" stroke="#2C4A40" stroke-width="1.6"/><text x="70" y="218.5" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">I<tspan font-size="9" dy="4">f</tspan><tspan dy="-4">​</tspan></text></g><path d="M98 84 L121.2 104.1" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><polygon points="128,110 118.3,107.5 124.1,100.7" fill="#2C4A40"/><path d="M262 84 L238.8 104.1" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><polygon points="232,110 235.9,100.7 241.7,107.5" fill="#2C4A40"/><path d="M98 206 L111.6 192.4" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><polygon points="118,186 114.8,195.5 108.5,189.2" fill="#2C4A40"/><g data-tip="عكس اتجاه الدوران: بعكس أطراف المجال أو أطراف المنتج — بقية المطلوب."><rect x="236" y="200" width="72" height="90" fill="transparent"/><path d="M244 236 a26 26 0 1 1 52 0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><polygon points="296,244 288,230 304,230" fill="#2C4A40"/><text x="270" y="280" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">عكس الاتجاه</text></g><text x="180" y="206" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">السرعة</text></svg>`,
   cap:'التجربة تغيّر ثلاثة أشياء، كل واحد في جزء، وتراقب السرعة <span class="ltr">n</span>، ثم تعكس اتجاه الدوران.<br><b>مرّر المؤشر على الرموز والسهم (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p class="ltr" style="text-align:left">Speed characteristic of a separately excited DC motor</p><ul><li>معرفة تأثير جهد المصدر والعزم على السرعة وتيار المنتج.</li><li>الحصول على منحنيات الخواص لمحرك التغذية المنفصلة عند تحميله، مثل منحنى السرعة مع العزم، والتيار مع العزم.</li><li>التعرف على كيفية بدء الحركة والتحكم في السرعة وكذلك كيفية عكس السرعة.</li></ul>`,ref:'ص 24'}
   ],
   body:[
    {tip:String.raw`<p>في المحرك منفصل التغذية لملف المجال <b>مصدر خاص به</b>. لذلك نستطيع أن نغيّر تيار المجال \(I_f\) وحده دون أن نلمس جهد المنتج \(V_{in}\)، والعكس. هذا ما يجعله مناسباً لدراسة أثر كل متغير على حدة.</p>`},
    {predict:{q:'«العزم» في هذه التجربة: من أين يأتي؟',opts:[
     ['من جهاز الفرملة المركب على عمود المحرك',true,'الفرملة تحمّل المحرك، ونضبط عليها العزم T بالنيوتن·متر كما في مخطط التوصيل (5).'],
     ['من الفولتميتر',false,'الفولتميتر يقيس الجهد فقط، ولا يحمّل المحرك.'],
     ['من مصدر المجال',false,'مصدر المجال يغذي ملف المجال؛ الحمل الميكانيكي يأتي من الفرملة.']]}},
    {title:'مختبر مصغّر: ثلاثة مقابض للسرعة',widget:(el,B)=>DCML.lab(el,B,{intro:'غيّر مقبضاً واحداً في كل مرة بقيم جداول الكتاب، وراقب السرعة وتيار المنتج.',
 predict:{q:'أي تغيير من هذه <b>يرفع</b> سرعة المحرك منفصل التغذية؟',opts:[
  ['زيادة عزم الفرملة T',false,'الحمل الأكبر يبطئ المحرك قليلاً ويزيد تياره.'],
  ['زيادة تيار المجال I<sub>f</sub>',false,'المجال الأقوى يولد جهداً عكسياً أكبر عند السرعة نفسها، فتستقر السرعة أقل.'],
  ['تقليل تيار المجال I<sub>f</sub>',true,'المجال الأضعف يحتاج سرعة أكبر ليصل جهده العكسي إلى جهد المصدر — ولهذا يُقلَّل بحذر.']]},
 ins:[{k:'V',l:'جهد المنتج V<sub>in</sub>',seg:[[60,'60'],[100,'100'],[120,'120'],[130,'130'],[150,'150'],[170,'170 V']],v:120},
      {k:'T',l:'عزم الفرملة T',seg:[[0,'0'],[0.1,'0.1'],[0.2,'0.2'],[0.3,'0.3'],[0.4,'0.4 N.m']],v:0},
      {k:'If',l:'تيار المجال I<sub>f</sub>',seg:[[0.1,'0.1'],[0.15,'0.15'],[0.2,'0.2'],[0.25,'0.25'],[0.3,'0.3 A']],v:0.3}],
 tp:{id:'u2-dcm',defs:motorDefs('sep')},
 calc:(s,v,B)=>{const k=Mod.kphi(v,s.If),kt=k*60/(2*PI);let n=(kt*s.V/v.Ra-s.T-v.Tf0)/(kt*k/v.Ra+v.Tv/1000);n=Math.max(0,n);const Ia=(s.V-k*n)/v.Ra;
  return {facts:[['السرعة n',DCML.fm(B,n,0)+' rpm','hi'],['تيار المنتج I<sub>a</sub>',DCML.fm(B,Ia,2)+' A']],bars:[{l:'السرعة',v:n,max:v.nMax,txt:DCML.fm(B,n,0)+' rpm',col:n>v.nN?'--stop':'--blue'}],
   msg:n>v.nN?'تجاوزت السرعة القيمة المقننة: هذا ما يحذّر منه الكتاب عند تقليل تيار المجال.':'',cls:n>v.nN?'bad':''}}})}
   ]},

  {st:3,short:'شرح التجربة',title:'شرح التجربة: كيف نحمّل المحرك ونقيس عزمه؟',ref:'ص 24',
   q:'المحرك يعطي قدرة على عموده لا نراها… فكيف نحوّلها إلى شيء نقيسه بالأجهزة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="المحرك مزدوج على عمود مولد، والمولد يغذي لمبات، والتاكومتر يقيس السرعة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="المحرك تحت الاختبار."><circle cx="86" cy="140" r="34" fill="#CFE6DB" stroke="#2C4A40" stroke-width="3"/><text x="86" y="147" text-anchor="middle" font-size="20" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">M</text></g><path d="M120 140 H160" fill="none" stroke="#9AA59F" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="مولد تيار مستمر مزدوج على عمود المحرك: يقوم مقام الحمل على المحرك."><circle cx="194" cy="140" r="34" fill="#FCE3B0" stroke="#2C4A40" stroke-width="3"/><text x="194" y="147" text-anchor="middle" font-size="20" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">G</text></g><path d="M228 140 H246" fill="none" stroke="#9AA59F" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="التاكومتر: يقيس سرعة دوران المحرك."><rect x="246" y="124" width="40" height="32" rx="6" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.4"/><text x="266" y="146" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n</text></g><path d="M194 174 V212 H246 M194 106 V96 H316 V212 H300" fill="none" stroke="#2C4A40" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="حمل المولد: مقاومة متغيرة أو مجموعة لمبات إضاءة. كلما زادت اللمبات زاد حمل المولد، فزاد العزم على المحرك."><rect x="230" y="196" width="86" height="32" fill="transparent"/><circle cx="246" cy="212" r="13" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.2"/><path d="M240 206 L252 218 M252 206 L240 218" fill="none" stroke="#2C4A40" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="273" cy="212" r="13" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.2"/><path d="M267 206 L279 218 M279 206 L267 218" fill="none" stroke="#2C4A40" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="300" cy="212" r="13" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.2"/><path d="M294 206 L306 218 M306 206 L294 218" fill="none" stroke="#2C4A40" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M259 212 H260 M286 212 H287" fill="none" stroke="#2C4A40" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></g><text x="86" y="198" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">المحرك</text><text x="194" y="66" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">المولد</text><text x="273" y="248" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">لمبات (الحمل)</text><text x="180" y="290" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="600" direction="rtl">المولد يقوم مقام الحمل على المحرك</text></svg>`,
   cap:'المحرك يدير مولداً، والمولد يضيء لمبات: كلما زادت اللمبات زاد الحمل على المحرك.<br><b>مرّر المؤشر على الأجزاء (أو المسها في الجوال) لتعرف دور كل منها.</b>',
   side:[
    {book:String.raw`<p>يتركز الغرض من اختبار محركات التيار المستمر أساساً حول الحصول على منحنيات الخواص للمحرك أثناء التحميل وكذلك عند تغير سرعته. ويكون تحميل المحرك بازدواجه على محور إدارة مولد تيار مستمر مناسب يكون تحميله إما بمقاومة متغيرة أو مجموعة لمبات إضاءة، وذلك لكي يقوم المولد مقام الحمل على المحرك، وبذلك يمكن قياس عزم الدوران على عمود إدارة المحرك، كذلك يمكن قياس سرعة الدوران للمحرك باستخدام التاكومتر.</p>`,ref:'ص 24'}
   ],
   body:[
    {book:String.raw`<p>يمكن افتراض أن كفاءة المولد 100% وذلك بإهمال المفقودات فيه. وبذلك تتساوى القدرة الخارجية للمولد وهي قدرة كهربية مقاسة مع القدرة الداخلة له وهي القدرة الخارجة للمحرك على عمود الإدارة.</p>`,ref:'ص 24'},
    {tip:String.raw`<p>المولد «يترجم» القدرة الميكانيكية إلى قدرة كهربية: نقيس جهد المولد وتياره بالأجهزة فنعرف قدرته، ونعتبرها هي القدرة التي أعطاها المحرك على عموده (لأننا أهملنا مفقودات المولد).</p>`,title:'الفكرة'},
    {predict:{q:'إذا أضأنا لمبات أكثر على المولد، ماذا يحدث للحمل على المحرك؟',opts:[
     ['يقل، لأن اللمبات تأخذ الحمل بدلاً منه',false,'اللمبات حمل على المولد، والمولد حمل على المحرك؛ فالحمل ينتقل إلى المحرك ولا يُزال عنه.'],
     ['لا يتغير، لأن المولد منفصل كهربياً عن المحرك',false,'هما مزدوجان ميكانيكياً على نفس العمود، فكل قدرة يعطيها المولد يأخذها من المحرك.'],
     ['يزيد: المولد يعطي قدرة أكبر فيحتاج عزماً أكبر من المحرك',true,'لذلك يقول الكتاب إن المولد «يقوم مقام الحمل على المحرك».']]}},
    {watch:String.raw`<p>الشرح هنا يحمّل المحرك بمولد، لكن مخطط التوصيل الشكل <span class="ltr">(5)</span> والجداول تستعمل <b>جهاز فرملة</b> نضبط عليه العزم مباشرة بالـ <span class="ltr">N.m</span>. في هذا الدرس نعتمد الفرملة كما في المخطط؛ والقوانين في المحطة القادمة تلزمك فقط إذا حمّلت المحرك بمولد.</p>`,fix:true},
    {title:'تحقق سريع: المولد حمل على المحرك',widget:(el,B)=>DCML.tf(el,B,{items:[
 ['المولد المزدوج على عمود المحرك يأخذ قدرته من المحرك، فهو «يقوم مقام الحمل».',true,'المولد يحوّل القدرة الميكانيكية التي يأخذها من العمود إلى قدرة كهربية في المقاومة أو اللمبات.'],
 ['بافتراض كفاءة المولد 100%: القدرة الكهربية الخارجة من المولد = القدرة الخارجة من المحرك على العمود.',true,'هذا افتراض الكتاب: «تتساوى القدرة الخارجية للمولد… مع القدرة الداخلة له وهي القدرة الخارجة للمحرك» (ص 24).'],
 ['إطفاء بعض لمبات المولد يزيد الحمل على المحرك.',false,'إطفاء اللمبات يقلل قدرة المولد، فيقل العزم الذي يأخذه من المحرك.']]})}
   ]},

  {st:4,short:'القوانين',title:'القوانين المستخدمة: العزم من قدرة المولد',ref:'ص 24',
   q:'عندنا جهد المولد وتياره وسرعة المحرك… كيف نصل منها إلى العزم بالنيوتن·متر؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="حساب العزم من قدرة المولد: القدرة من الجهد والتيار، ثم السرعة الزاوية، ثم العزم" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><g data-tip="قدرة المولد الكهربية المقاسة: جهد المولد × تيار حمله، بالواط ⟦W⟧."><rect x="70" y="58" width="220" height="46" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.4"/><text x="180" y="88" text-anchor="middle" font-size="17" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">P<tspan font-size="12" dy="4">L</tspan><tspan dy="-4">​</tspan> = V<tspan font-size="12" dy="4">L</tspan><tspan dy="-4">​</tspan> × I<tspan font-size="12" dy="4">L</tspan><tspan dy="-4">​</tspan></text></g><path d="M180 106 L180.0 119.0" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><polygon points="180,128 175.5,119.0 184.5,119.0" fill="#2C4A40"/><g data-tip="السرعة الزاوية بالراديان في الثانية ⟦rad/sec⟧، و⟦n⟧ سرعة المحرك باللفة في الدقيقة."><rect x="70" y="130" width="220" height="46" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.4"/><text x="180" y="160" text-anchor="middle" font-size="17" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">ω = 2π n / 60</text></g><path d="M180 178 L180.0 191.0" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><polygon points="180,200 175.5,191.0 184.5,191.0" fill="#2C4A40"/><g data-tip="عزم المحرك ⟦TL⟧ بالنيوتن·متر ⟦N.m⟧ = القدرة ÷ السرعة الزاوية (بفرض كفاءة المولد 100%)."><rect x="70" y="202" width="220" height="46" rx="10" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.4"/><text x="180" y="232" text-anchor="middle" font-size="17" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T<tspan font-size="12" dy="4">L</tspan><tspan dy="-4">​</tspan> = P<tspan font-size="12" dy="4">L</tspan><tspan dy="-4">​</tspan> / ω</text></g><text x="306" y="86" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">W</text><text x="306" y="158" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">rad/s</text><text x="306" y="230" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">N.m</text></svg>`,
   cap:'ثلاث خطوات: القدرة، ثم السرعة الزاوية، ثم العزم.<br><b>مرّر المؤشر على كل قانون (أو المسه في الجوال) لتعرف معنى رموزه.</b>',
   side:[
    {book:String.raw`<p><b>القوانين المستخدمة:</b></p><table class="tt"><thead><tr><th>القانون</th><th>الوحدة</th></tr></thead><tbody><tr><td>\(P_L = V_L\,I_L\)</td><td class="ltr">W</td></tr><tr><td>\(\text{Torque},\ T_L = \dfrac{P_L}{\omega}\)</td><td class="ltr">N.m</td></tr><tr><td>\(\omega = \dfrac{2\pi\,n}{60}\)</td><td class="ltr">rad/sec.</td></tr></tbody></table><p>حيث \(n\) هي سرعة المحرك باللفة في الدقيقة. من هنا يمكن القول أن \(T_L\) هو عزم المحرك الكهربي تحت الاختبار.</p>`,ref:'ص 24'}
   ],
   body:[
    {tip:String.raw`<p>السرعة \(n\) تُقرأ باللفة في الدقيقة، لكن قانون العزم يحتاج السرعة الزاوية \(\omega\) بالراديان في الثانية: اللفة الواحدة \(2\pi\) راديان، والدقيقة 60 ثانية، لذلك نضرب في \(2\pi\) ونقسم على 60.</p>`,title:'لماذا نقسم على 60؟'},
    {predict:{q:'بقيت قدرة المولد ثابتة وزادت سرعة المحرك. ماذا يحدث للعزم المحسوب؟',opts:[
     ['يزيد',false,'العزم = القدرة ÷ السرعة الزاوية؛ زيادة المقام تُصغّر الناتج.'],
     ['يقل',true,'\\(T_L = P_L/\\omega\\): مع ثبات القدرة، كلما زادت السرعة قلّ العزم.'],
     ['لا يتغير',false,'السرعة موجودة في القانون، فتغيّرها يغيّر العزم.']]}},
    {tip:String.raw`<p>حاسبة هذه القوانين (تكتب فيها جهد المولد وتياره وسرعة المحرك) في تبويب «الأمثلة المحلولة».</p>`},
    {title:'مختبر مصغّر: من قراءات المولد إلى العزم',widget:(el,B)=>DCML.lab(el,B,{intro:'اختر قراءات المولد وسرعة المحرك (أرقام تختارها أنت)، وتابع القوانين الثلاثة خطوة خطوة.',
 predict:{q:'المحرك يدور بسرعة <span class="ltr">1500 rpm</span>. كم سرعته الزاوية \\(\\omega\\) تقريباً؟',opts:[
  ['<span class="ltr">25 rad/s</span>',false,'هذا عدد اللفات في الثانية \\(1500\\div60\\)؛ لم تضرب في \\(2\\pi\\).'],
  ['<span class="ltr">157 rad/s</span>',true,'\\(\\omega=2\\pi\\times1500\\div60\\approx157\\ \\text{rad/s}\\).'],
  ['<span class="ltr">9425 rad/s</span>',false,'هذا \\(2\\pi\\times1500\\) دون القسمة على 60؛ السرعة باللفة في الدقيقة والمطلوب في الثانية.']]},
 ins:[{k:'V',l:'جهد المولد V<sub>L</sub>',min:20,max:250,step:5,v:200,dp:0,u:'V'},{k:'I',l:'تيار المولد I<sub>L</sub>',min:0,max:5,step:0.1,v:1.5,dp:1,u:'A'},{k:'n',l:'سرعة المحرك n',min:300,max:3000,step:50,v:1500,dp:0,u:'rpm'}],
 calc:(s,v,B)=>{const P=s.V*s.I,w=2*Math.PI*s.n/60,T=P/w;return {facts:[['P<sub>L</sub> = V<sub>L</sub> I<sub>L</sub>',DCML.fm(B,P,0)+' W'],['ω = 2πn ÷ 60',DCML.fm(B,w,1)+' rad/s'],['T<sub>L</sub> = P<sub>L</sub> ÷ ω',DCML.fm(B,T,3)+' N.m','hi']]}}})}
   ]},

  {st:5,short:'مخطط التوصيل',title:'مخطط التوصيل: الشكل <span class="ltr">(5)</span>',ref:'ص 25',
   q:'في هذا المحرك مصدران لا مصدر واحد… فأي جهاز يقيس تيار أي دائرة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مخطط توصيل المحرك منفصل التغذية كما في الشكل 5: مصدر المنتج والفولتميتر والأميتر A2 والمحرك، وملف المجال من مصدر منفصل عبر الأميتر A1، وعلى العمود عداد السرعة وجهاز الفرملة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="165" r="150" fill="#DDEFE6"/><g data-tip="مصدر جهد مستمر متغير لدائرة المنتج ⟦Vin 0-250 V DC⟧: نرفع جهده تدريجياً من الصفر."><rect x="18" y="88" width="66" height="94" rx="8" fill="#F1EBDD" stroke="#2C4A40" stroke-width="2.4"/><text x="51" y="118" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">V<tspan font-size="10" dy="4">in</tspan><tspan dy="-4">​</tspan></text><text x="51" y="140" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">0-250 V</text><text x="51" y="158" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">DC</text></g><text x="70" y="82" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">+</text><text x="70" y="196" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">−</text><path d="M51 88 V58 H236 V105" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M51 182 V212 H236 V165" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M104 58 V120 M104 150 V212" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="104" cy="58" r="3.5" fill="#2C4A40"/><circle cx="104" cy="212" r="3.5" fill="#2C4A40"/><g data-tip="الفولتميتر ⟦V⟧: موصل على التوازي بين الخطين، يقرأ جهد المصدر ⟦Vin⟧."><circle cx="104" cy="135" r="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.2"/><text x="104" y="139.68" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">V</text></g><g data-tip="الأميتر ⟦A2⟧: على التوالي في خط المنتج، يقرأ تيار المنتج ⟦Ia⟧."><circle cx="200" cy="58" r="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.2"/><text x="200" y="62.68" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">A2</text></g><path d="M166 44 L181.0 44.0" fill="none" stroke="#E8735A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polygon points="188,44 181.0,47.5 181.0,40.5" fill="#E8735A"/><text x="177" y="38" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">I<tspan font-size="8" dy="4">a</tspan><tspan dy="-4">​</tspan></text><g data-tip="المحرك ⟦M⟧: أطراف المنتج ⟦1B1⟧ و⟦2B2⟧."><circle cx="236" cy="135" r="30" fill="#CFE6DB" stroke="#2C4A40" stroke-width="3"/><text x="236" y="142" text-anchor="middle" font-size="20" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">M</text><text x="198" y="109" text-anchor="end" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">1B1</text><text x="198" y="169" text-anchor="end" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">2B2</text></g><path d="M266 135 H330" fill="none" stroke="#9AA59F" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="التاكومتر وعداد السرعة ⟦Speed⟧: يقيسان سرعة الدوران ⟦n⟧ باللفة في الدقيقة ⟦rpm⟧."><rect x="276" y="121" width="28" height="28" rx="5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="290" y="140" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n</text></g><g data-tip="جهاز الفرملة ⟦Brake⟧: يحمّل المحرك، ويُضبط عليه العزم ⟦T⟧ مباشرة بالنيوتن·متر ⟦N.m⟧."><rect x="310" y="111" width="40" height="48" rx="6" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.4"/><text x="330" y="132" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Br</text><text x="330" y="148" text-anchor="middle" font-size="9" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">N.m</text></g><g data-tip="مصدر المجال المنفصل ⟦0-240 V / 0-6 A⟧: يغذي ملف المجال وحده، بعيداً عن مصدر المنتج."><rect x="262" y="236" width="82" height="52" rx="8" fill="#F1EBDD" stroke="#2C4A40" stroke-width="2.4"/><text x="303" y="256" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">0-240 V</text><text x="303" y="274" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">0-6 A</text></g><path d="M262 248 H226" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="الأميتر ⟦A1⟧: يقرأ تيار المجال ⟦If⟧."><circle cx="212" cy="248" r="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.2"/><text x="212" y="251.96" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">A1</text></g><path d="M198 248 H150 V270" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="ملف المجال ⟦E1–E2⟧: يأخذ تياره من مصدر المجال المنفصل."><rect x="146" y="252" width="84" height="44" fill="transparent"/><path d="M150 270 A9.5 9.5 0 0 0 169.0 270 A9.5 9.5 0 0 0 188.0 270 A9.5 9.5 0 0 0 207.0 270 A9.5 9.5 0 0 0 226.0 270" fill="none" stroke="#E8735A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><text x="150" y="292" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">E1</text><text x="226" y="292" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">E2</text></g><path d="M226 270 H262" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M186 236 L173.0 236.0" fill="none" stroke="#E8735A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polygon points="166,236 173.0,232.5 173.0,239.5" fill="#E8735A"/><text x="176" y="230" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">I<tspan font-size="8" dy="4">f</tspan><tspan dy="-4">​</tspan></text></svg>`,
   cap:'مبسّط عن الشكل <span class="ltr">(5)</span>: دائرة المنتج في الأعلى، ودائرة المجال المنفصلة في الأسفل.<br><b>مرّر المؤشر على الأجهزة والملفات (أو المسها في الجوال) لتعرف اسم كل منها ودوره.</b>',
   side:[
    {tip:String.raw`<p><b>الكتاب لا يذكر قائمة أجهزة لهذه التجربة</b>، لكن نقرؤها من المخطط:</p><ol><li>مصدر جهد مستمر متغير <span class="ltr">Vin 0-250 V DC</span> لدائرة المنتج.</li><li>مصدر للمجال <span class="ltr">0-240 V / 0-6 A</span>.</li><li>محرك تيار مستمر <span class="ltr">M</span> (أطراف المنتج <span class="ltr">1B1–2B2</span>، وملف المجال <span class="ltr">E1–E2</span>).</li><li>فولتميتر <span class="ltr">V</span>.</li><li>أميتر <span class="ltr">A2</span> لتيار المنتج، وأميتر <span class="ltr">A1</span> لتيار المجال.</li><li>تاكومتر وعداد سرعة.</li><li>جهاز الفرملة <span class="ltr">Brake</span>.</li></ol>`,title:'الأجهزة من المخطط'}
   ],
   body:[
    {predict:{q:'أي أميتر نراقبه لنضبط تيار المجال على <span class="ltr">0.3 A</span>؟',opts:[
     ['الأميتر A2',false,'A2 في خط المنتج، يقرأ تيار المنتج Ia.'],
     ['الأميتر A1',true,'A1 في دائرة المجال المنفصلة، يقرأ تيار المجال If.'],
     ['الفولتميتر V',false,'الفولتميتر يقرأ جهد المصدر Vin، لا تياراً.']]}},
    {tip:String.raw`<p>الأميتر يوصل <b>على التوالي</b> في الخط الذي نريد تياره، والفولتميتر يوصل <b>على التوازي</b> بين الخطين اللذين نريد الجهد بينهما. لاحظ أنه لا توجد مقاومة بدء في دائرة المنتج، لذلك نبدأ دائماً والجهد على الصفر ثم نرفعه تدريجياً.</p>`},
    {watch:String.raw`<p>على جهاز الفرملة في الكتاب طُبعت الوحدة «m.N»، والصحيح <span class="ltr">N.m</span> (نيوتن·متر).</p>`,fix:true},
    {title:'مختبر مصغّر: من يقرأ ماذا في الشكل (5)؟',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل قراءة اضغط الجهاز الذي يعطيها.',cats:['الأميتر A1','الأميتر A2','الفولتميتر V','جهاز الفرملة'],items:[
 ['تيار المجال I<sub>f</sub>، ونضبطه على <span class="ltr">0.3 A</span>.',0,'A1 في دائرة المجال المنفصلة.'],
 ['تيار المنتج I<sub>a</sub>.',1,'A2 في خط المنتج.'],
 ['جهد المصدر V<sub>in</sub>.',2,'الفولتميتر على التوازي بين خطي مصدر المنتج.'],
 ['العزم الواقع على المحرك T.',3,'نضبط العزم بالـ <span class="ltr">N.m</span> على جهاز الفرملة.']]})}
   ]},

  {st:6,short:'أولاً: أثر الجهد',title:'خطوات التجربة — أولاً: أثر جهد المصدر على السرعة',ref:'ص 25–26',
   q:'المجال ثابت ولا حمل… إذا ضاعفنا جهد المنتج تقريباً، ماذا تتوقع أن يحدث للسرعة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="خطوات أولاً: نثبت تيار المجال 0.3 أمبير والعزم صفراً، ونرفع جهد المصدر 60 ثم 100 ثم 130 ثم 150 ثم 170 فولت ونسجل السرعة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><rect x="72" y="180.8" width="30" height="45.2" rx="4" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.6"/><text x="87.0" y="242" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">60</text><rect x="116" y="150.7" width="30" height="75.3" rx="4" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.6"/><text x="131.0" y="242" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">100</text><rect x="160" y="128.1" width="30" height="97.9" rx="4" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.6"/><text x="175.0" y="242" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">130</text><rect x="204" y="113.1" width="30" height="112.9" rx="4" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.6"/><text x="219.0" y="242" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">150</text><rect x="248" y="98.0" width="30" height="128.0" rx="4" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.6"/><text x="263.0" y="242" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">170</text><path d="M64 226 H286" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><text x="87" y="172.8235294117647" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n?</text><text x="131" y="142.70588235294116" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n?</text><text x="175" y="120.11764705882354" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n?</text><text x="219" y="105.05882352941177" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n?</text><text x="263" y="90.0" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n?</text><text x="60" y="250" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr"></text><text x="180" y="262" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">V<tspan font-size="9" dy="4">in</tspan><tspan dy="-4">​</tspan> (V)</text><g data-tip="شرط ثابت في هذا الجزء: تيار المجال ⟦If = 0.3 A⟧ يقرؤه الأميتر ⟦A1⟧."><rect x="63.8" y="50.6" width="92.4" height="22.8" rx="11.4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.6"/><text x="110" y="66.32" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">I<tspan font-size="8" dy="4">f</tspan><tspan dy="-4">​</tspan> = 0.3 A</text></g><g data-tip="شرط ثابت: لا حمل على المحرك، الفرملة على الصفر."><rect x="207.5" y="50.6" width="85.0" height="22.8" rx="11.4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.6"/><text x="250" y="66.32" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T = 0 N.m</text></g></svg>`,
   cap:'خمس قيم للجهد من الجدول <span class="ltr">(5-1)</span>، وعند كل قيمة نقرأ السرعة.<br><b>مرّر المؤشر على الشرطين في الأعلى (أو المسهما في الجوال) لتعرف معناهما.</b>',
   side:[
    {book:String.raw`<p><b>أولاً:</b></p><ol><li>قم بتوصيل الدائرة كما هو موضح في مخطط التوصيل شكل (5).</li><li>قم بتثبيت تيار المجال \(I_f\) عند 0.3 A وثبت العزم الواقع على المحرك بواسطة جهاز العزم عند قيمة قدرها T = 0 N.m.</li><li>قم بتغيير قيم جهد المصدر \(V_{in}\) وفي كل مرة قم بتسجيل قيمة السرعة n وذلك حسب الجدول (5-1):</li></ol>`,ref:'ص 25'}
   ],
   body:[
    {book:String.raw`${tableHTML(TB['5-1'])}`,ref:'ص 26'},
    {predict:{q:'رفعنا \\(V_{in}\\) من <span class="ltr">60 V</span> إلى <span class="ltr">130 V</span> (تيار المجال ثابت ولا حمل). السرعة:',opts:[
     ['تقل، لأن التيار يزيد',false,'زيادة الجهد ترفع السرعة؛ التيار بلا حمل يبقى صغيراً.'],
     ['لا تتغير، لأن المجال ثابت',false,'المجال الثابت يجعل السرعة تتبع الجهد مباشرة، لا أن تثبت.'],
     ['تزيد تقريباً بنفس نسبة زيادة الجهد',true,'مع ثبات المجال تتناسب السرعة تقريباً مع الجهد، فتزيد إلى ما يقارب الضعف.']]}},
    {tip:String.raw`<p>عندما يدور المنتج داخل المجال يتولد فيه <b>جهد عكسي</b> يكبر مع السرعة. المحرك يسرع حتى يقترب هذا الجهد العكسي من جهد المصدر. فإذا رفعنا جهد المصدر يحتاج المحرك سرعة أكبر ليصل إليه: لذلك السرعة «تلحق» بالجهد.</p>`,title:'لماذا تتبع السرعة الجهد؟'},
    {watch:String.raw`<p>حتى عند \(T = 0\) لا يكون تيار المنتج صفراً: المحرك يحتاج تياراً صغيراً ليغلب الاحتكاك والتهوية. سجّل هذا التيار في الصف \(I_a\) أيضاً.</p>`},
    {title:'مختبر مصغّر: ارسم نقاط الجدول (5-1)',widget:(el,B)=>DCML.lab(el,B,{intro:'تيار المجال <span class="ltr">0.3 A</span> ولا حمل. اختر قيمة \\(V_{in}\\) من الجدول واقرأ النقطة (السرعة على المحور الأفقي كما في شبكة الكتاب).',
 predict:{q:'ما شكل العلاقة بين السرعة وجهد المصدر في هذا الجدول؟',opts:[
  ['خط شبه مستقيم: السرعة تتناسب تقريباً مع الجهد',true,'المجال ثابت، فالسرعة تتبع الجهد تقريباً بالنسبة نفسها.'],
  ['منحنى ينحني ويتشبع مثل منحنى المغنطة',false,'التشبع يخص المجال، والمجال هنا ثابت.'],
  ['خط أفقي: السرعة لا تتغير',false,'الجهد هو ما يحدد السرعة هنا، فهي تتغير معه.']]},
 ins:[{k:'V',l:'جهد المصدر V<sub>in</sub>',seg:[[60,'60'],[100,'100'],[130,'130'],[150,'150'],[170,'170 V']],v:100}],
 tp:{id:'u2-dcm',defs:motorDefs('sep')},
 calc:(s,v,B)=>{const k=Mod.kphi(v,0.3),kt=k*60/(2*PI),nOf=V=>Math.max(0,(kt*V/v.Ra-v.Tf0)/(kt*k/v.Ra+v.Tv/1000)),pts=[60,100,130,150,170].map(V=>[nOf(V),V]),n=nOf(s.V);
  return {facts:[['السرعة n',DCML.fm(B,n,0)+' rpm','hi'],['تيار المنتج I<sub>a</sub>',DCML.fm(B,(s.V-k*n)/v.Ra,3)+' A']],
   plot:{xr:[0,Math.ceil(pts[4][0]*1.1/500)*500],yr:[0,200],xl:'n (rpm)',yl:'V<tspan font-size="9" dy="3">in</tspan><tspan dy="-3"> (V)</tspan>',curves:[{pts:[[0,0]].concat(pts),col:'--muted',dash:'4 4'}],dots:pts.map(p=>[p[0],p[1],'--blue']),cur:[n,s.V]},
   msg:'لاحظ أن \\(I_a\\) صغير لكنه ليس صفراً حتى بلا حمل: المحرك يغلب الاحتكاك والتهوية.'}}})}
   ]},

  {st:7,short:'ثانياً: أثر الحمل',title:'خطوات التجربة — ثانياً: أثر العزم (الحمل) على السرعة',ref:'ص 26',
   q:'نشدّ الفرملة أكثر فأكثر… هل يتباطأ هذا المحرك كثيراً أم قليلاً؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="خطوات ثانياً: نثبت تيار المجال 0.3 أمبير وجهد المصدر 120 فولت، ونرفع العزم من صفر إلى 0.4 نيوتن متر ونسجل السرعة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><rect x="72" y="219.6" width="30" height="6.4" rx="4" fill="#F2C14E" stroke="#2C4A40" stroke-width="1.6"/><text x="87.0" y="242" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">0</text><rect x="116" y="194.0" width="30" height="32.0" rx="4" fill="#F2C14E" stroke="#2C4A40" stroke-width="1.6"/><text x="131.0" y="242" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">0.1</text><rect x="160" y="162.0" width="30" height="64.0" rx="4" fill="#F2C14E" stroke="#2C4A40" stroke-width="1.6"/><text x="175.0" y="242" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">0.2</text><rect x="204" y="130.0" width="30" height="96.0" rx="4" fill="#F2C14E" stroke="#2C4A40" stroke-width="1.6"/><text x="219.0" y="242" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">0.3</text><rect x="248" y="98.0" width="30" height="128.0" rx="4" fill="#F2C14E" stroke="#2C4A40" stroke-width="1.6"/><text x="263.0" y="242" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">0.4</text><path d="M64 226 H286" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><text x="87" y="211.6" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n?</text><text x="131" y="186.0" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n?</text><text x="175" y="154.0" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n?</text><text x="219" y="122.0" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n?</text><text x="263" y="90.0" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n?</text><text x="60" y="250" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr"></text><text x="180" y="262" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T (N.m)</text><g data-tip="شرط ثابت: تيار المجال ⟦If = 0.3 A⟧."><rect x="63.8" y="50.6" width="92.4" height="22.8" rx="11.4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.6"/><text x="110" y="66.32" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">I<tspan font-size="8" dy="4">f</tspan><tspan dy="-4">​</tspan> = 0.3 A</text></g><g data-tip="شرط ثابت: جهد المصدر ⟦Vin = 120 V⟧ يقرؤه الفولتميتر."><rect x="200.1" y="50.6" width="99.8" height="22.8" rx="11.4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.6"/><text x="250" y="66.32" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">V<tspan font-size="8" dy="4">in</tspan><tspan dy="-4">​</tspan> = 120 V</text></g></svg>`,
   cap:'خمس قيم للعزم من الجدول <span class="ltr">(5-2)</span> والجهد ثابت.<br><b>مرّر المؤشر على الشرطين في الأعلى (أو المسهما في الجوال) لتعرف معناهما.</b>',
   side:[
    {book:String.raw`<p><b>ثانياً:</b></p><ol><li>قم بتثبيت تيار المجال \(I_f\) عند 0.3 A وثبت جهد المصدر Vin = 120 V.</li><li>قم بتغيير قيمة العزم T وفي كل مرة قم بتسجيل قيمة السرعة n وذلك حسب الجدول (5-2).</li></ol>`,ref:'ص 26'}
   ],
   body:[
    {book:String.raw`${tableHTML(TB['5-2'])}`,ref:'ص 26'},
    {title:'تابع ما يحدث عند زيادة الحمل',widget:(el,B)=>{
      const S=['زاد عزم الفرملة T','تباطأ المحرك قليلاً','قلّ الجهد العكسي','زاد تيار المنتج I<sub>a</sub>','زاد العزم المتولد','تستقر السرعة عند قيمة أقل قليلاً: عزم المحرك = الحمل'];
      el.innerHTML=`<p class="sub" style="margin:0 0 10px">اضغط «زِد الحمل» وتابع انتقال الأثر (توضيح منا، ليس من الكتاب).</p><div class="chain">${S.map((s,i)=>`<span class="ck${i===S.length-1?' end':''}">${s}</span>${i<S.length-1?'<span class="ar">←</span>':''}`).join('')}</div><div class="w-row"><button class="btn pri" type="button" data-go>زِد الحمل</button><button class="btn" type="button" data-rs>إعادة</button></div>`;
      const ks=[...el.querySelectorAll('.ck')];let tm=[];const rs=()=>{tm.forEach(clearTimeout);tm=[];ks.forEach(k=>k.classList.remove('on'))};
      el.querySelector('[data-go]').onclick=()=>{rs();ks.forEach((k,i)=>tm.push(setTimeout(()=>k.classList.add('on'),i*550)))};el.querySelector('[data-rs]').onclick=rs;}},
    {predict:{q:'عند زيادة العزم من <span class="ltr">0</span> إلى <span class="ltr">0.4 N.m</span>، أي القراءتين تتغير أكثر؟',opts:[
     ['تيار المنتج يزيد بوضوح، والسرعة تقل قليلاً فقط',true,'المجال ثابت (مصدره منفصل)، فلا يقل من السرعة إلا الهبوط الصغير في مقاومة المنتج.'],
     ['السرعة تهبط إلى النصف، والتيار ثابت',false,'التيار هو الذي يزيد ليعطي العزم المطلوب، والسرعة لا تتغير إلا قليلاً.'],
     ['لا تتغير أي قراءة',false,'العزم الأكبر يحتاج تياراً أكبر في المنتج.']]}},
    {title:'مختبر مصغّر: شُدّ الفرملة واقرأ (الجدول 5-2)',widget:(el,B)=>DCML.lab(el,B,{intro:'<span class="ltr">V<sub>in</sub> = 120 V</span> و<span class="ltr">I<sub>f</sub> = 0.3 A</span>. غيّر العزم بقيم الجدول وقارن تغيّر السرعة بتغيّر التيار.',
 predict:{q:'عند <span class="ltr">T = 0</span> (لا حمل على الفرملة): تيار المنتج…',opts:[
  ['صفر تماماً',false,'المحرك يحتاج عزماً صغيراً ليغلب الاحتكاك والتهوية، فيأخذ تياراً صغيراً.'],
  ['صغير، لكنه ليس صفراً',true,'تيار اللاحمل يغطي الاحتكاك والتهوية، ثم يزيد مع كل زيادة في T.'],
  ['أكبر من أي حالة أخرى',false,'التيار يكبر مع الحمل، فأقل قيمة له عند T = 0.']]},
 ins:[{k:'T',l:'عزم الفرملة T',seg:[[0,'0'],[0.1,'0.1'],[0.2,'0.2'],[0.3,'0.3'],[0.4,'0.4 N.m']],v:0.2}],
 tp:{id:'u2-dcm',defs:motorDefs('sep')},
 calc:(s,v,B)=>{const k=Mod.kphi(v,0.3),kt=k*60/(2*PI),nOf=T=>Math.max(0,(kt*120/v.Ra-T-v.Tf0)/(kt*k/v.Ra+v.Tv/1000)),IaOf=T=>(120-k*nOf(T))/v.Ra;
  const n=nOf(s.T),n0=nOf(0),pts=[0,0.1,0.2,0.3,0.4].map(T=>[T,nOf(T)]);
  return {facts:[['السرعة n',DCML.fm(B,n,0)+' rpm','hi'],['تيار المنتج I<sub>a</sub>',DCML.fm(B,IaOf(s.T),2)+' A','hi'],['نقص السرعة عن <span class="ltr">T = 0</span>',DCML.fm(B,(n0-n)/n0*100,1)+' %'],['زيادة I<sub>a</sub> عن <span class="ltr">T = 0</span>','× '+DCML.fm(B,IaOf(s.T)/IaOf(0),1)]],
   plot:{xr:[0,0.4],yr:[0,Math.ceil(n0*1.15/200)*200],xl:'T (N.m)',yl:'n (rpm)',xt:[0,0.1,0.2,0.3,0.4],curves:[{pts}],dots:pts.map(p=>[p[0],p[1],'--muted']),cur:[s.T,n]}}}})}
   ]},

  {st:8,short:'ثالثاً: أثر المجال',title:'خطوات التجربة — ثالثاً: أثر تيار المجال على السرعة',ref:'ص 26',
   q:'إذا أضعفنا المجال… هل يضعف المحرك ويتباطأ؟ أم العكس؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="خطوات ثالثاً: نثبت جهد المصدر 120 فولت والعزم صفراً، ونغير تيار المجال من 0.1 إلى 0.3 أمبير ونسجل السرعة وتيار المنتج" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><rect x="72" y="183.3" width="30" height="42.7" rx="4" fill="#E8735A" stroke="#2C4A40" stroke-width="1.6"/><text x="87.0" y="242" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">0.1</text><rect x="116" y="162.0" width="30" height="64.0" rx="4" fill="#E8735A" stroke="#2C4A40" stroke-width="1.6"/><text x="131.0" y="242" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">0.15</text><rect x="160" y="140.7" width="30" height="85.3" rx="4" fill="#E8735A" stroke="#2C4A40" stroke-width="1.6"/><text x="175.0" y="242" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">0.2</text><rect x="204" y="119.3" width="30" height="106.7" rx="4" fill="#E8735A" stroke="#2C4A40" stroke-width="1.6"/><text x="219.0" y="242" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">0.25</text><rect x="248" y="98.0" width="30" height="128.0" rx="4" fill="#E8735A" stroke="#2C4A40" stroke-width="1.6"/><text x="263.0" y="242" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">0.3</text><path d="M64 226 H286" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><text x="87" y="175.33333333333331" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n?</text><text x="131" y="154.0" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n?</text><text x="175" y="132.66666666666666" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n?</text><text x="219" y="111.33333333333333" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n?</text><text x="263" y="90.0" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n?</text><text x="60" y="250" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr"></text><text x="180" y="262" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">I<tspan font-size="9" dy="4">f</tspan><tspan dy="-4">​</tspan> (A)</text><g data-tip="شرط ثابت: جهد المصدر ⟦Vin = 120 V⟧."><rect x="60.1" y="50.6" width="99.8" height="22.8" rx="11.4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.6"/><text x="110" y="66.32" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">V<tspan font-size="8" dy="4">in</tspan><tspan dy="-4">​</tspan> = 120 V</text></g><g data-tip="شرط ثابت: لا حمل على المحرك. لذلك يجب الحذر عند تقليل تيار المجال."><rect x="207.5" y="50.6" width="85.0" height="22.8" rx="11.4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.6"/><text x="250" y="66.32" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T = 0 N.m</text></g></svg>`,
   cap:'خمس قيم لتيار المجال من الجدول <span class="ltr">(5-3)</span>، والجهد ثابت ولا حمل.<br><b>مرّر المؤشر على الشرطين في الأعلى (أو المسهما في الجوال) لتعرف معناهما.</b>',
   side:[
    {book:String.raw`<p><b>ثالثاً:</b></p><ol><li>قم بتثبيت قيمة جهد المصدر Vin = 120 V وثبت العزم الواقع على المحرك بواسطة جهاز العزم عند قيمة قدرها T = 0 N.m.</li><li>قم بتغيير قيم تيار المجال \(I_f\) وفي كل مرة قم بتسجيل قيمة السرعة n وتيار المنتج كما هو موضح في الجدول (5-3):</li></ol>`,ref:'ص 26'},
    {predict:{q:'خفّضنا تيار المجال من <span class="ltr">0.3 A</span> إلى <span class="ltr">0.1 A</span> (لا حمل). السرعة:',opts:[
     ['تقل لأن المحرك أصبح أضعف',false,'هذا ما يتوقعه الكثيرون، لكن المجال الأضعف يولّد جهداً عكسياً أصغر، فيسرع المحرك ليعوّضه.'],
     ['تزيد كثيراً',true,'لذلك يحذّر الكتاب: «يتم تقليل تيار المجال بحذر حتى لا تصل سرعة المحرك لقيمة عالية قد تضر بالمحرك» (ص 28).'],
     ['لا تتغير لأن الجهد ثابت',false,'السرعة تعتمد على الجهد والمجال معاً.']]}}
   ],
   body:[
    {book:String.raw`${tableHTML(TB['5-3'])}`,ref:'ص 26'},
    {title:'لماذا يسرع المحرك عندما يضعف مجاله؟',widget:(el,B)=>{
      const S=['قلّ تيار المجال I<sub>f</sub>','ضعف المجال','قلّ الجهد العكسي','زاد تيار المنتج والعزم','تسارع المحرك','تستقر السرعة عند قيمة أعلى: الجهد العكسي يقترب من جهد المصدر من جديد'];
      el.innerHTML=`<p class="sub" style="margin:0 0 10px">اضغط «أضعف المجال» وتابع السلسلة (توضيح منا، ليس من الكتاب).</p><div class="chain">${S.map((s,i)=>`<span class="ck${i===S.length-1?' end':''}">${s}</span>${i<S.length-1?'<span class="ar">←</span>':''}`).join('')}</div><div class="w-row"><button class="btn pri" type="button" data-go>أضعف المجال</button><button class="btn" type="button" data-rs>إعادة</button></div>`;
      const ks=[...el.querySelectorAll('.ck')];let tm=[];const rs=()=>{tm.forEach(clearTimeout);tm=[];ks.forEach(k=>k.classList.remove('on'))};
      el.querySelector('[data-go]').onclick=()=>{rs();ks.forEach((k,i)=>tm.push(setTimeout(()=>k.classList.add('on'),i*550)))};el.querySelector('[data-rs]').onclick=rs;}},
    {watch:String.raw`<p>في هذا الجزء المحرك بلا حمل، وتقليل المجال يرفع السرعة كثيراً. اخفض تيار المجال <b>بخطوات صغيرة</b> وعينك على عداد السرعة، ولا تفصل المجال أبداً والمنتج يعمل.</p>`},
    {title:'مختبر مصغّر: أضعف المجال بحذر (الجدول 5-3)',widget:(el,B)=>DCML.lab(el,B,{intro:'<span class="ltr">V<sub>in</sub> = 120 V</span> ولا حمل. انزل بتيار المجال من <span class="ltr">0.3 A</span> خطوة خطوة وراقب السرعة.',
 predict:{q:'وأنت تخفض \\(I_f\\)، ما القراءة التي يجب أن تبقى عينك عليها؟',opts:[
  ['عداد السرعة، لأنها ترتفع مع كل خفض',true,'«يتم تقليل تيار المجال بحذر حتى لا تصل سرعة المحرك لقيمة عالية قد تضر بالمحرك» (ص 28).'],
  ['الفولتميتر، لأن جهد المصدر يهبط',false,'جهد المصدر ثابت 120 V في هذا الجزء.'],
  ['لا شيء، فالمحرك بلا حمل',false,'بلا حمل بالذات ترتفع السرعة أكثر؛ لذلك الحذر.']]},
 ins:[{k:'If',l:'تيار المجال I<sub>f</sub>',seg:[[0.3,'0.3'],[0.25,'0.25'],[0.2,'0.2'],[0.15,'0.15'],[0.1,'0.1 A']],v:0.3}],
 tp:{id:'u2-dcm',defs:motorDefs('sep')},
 calc:(s,v,B)=>{const nOf=If=>{const k=Mod.kphi(v,If),kt=k*60/(2*PI);return Math.max(0,(kt*120/v.Ra-v.Tf0)/(kt*k/v.Ra+v.Tv/1000))};const n=nOf(s.If),pts=[0.1,0.15,0.2,0.25,0.3].map(I=>[nOf(I),I]),k=Mod.kphi(v,s.If);
  return {facts:[['السرعة n',DCML.fm(B,n,0)+' rpm',n>v.nN?'bad':'hi'],['تيار المنتج I<sub>a</sub>',DCML.fm(B,(120-k*n)/v.Ra,3)+' A']],
   plot:{xr:[0,Math.ceil(Math.max(pts[0][0],v.nN)*1.1/500)*500],yr:[0,0.35],xl:'n (rpm)',yl:'I<tspan font-size="9" dy="3">f</tspan><tspan dy="-3"> (A)</tspan>',yt:[0,0.1,0.2,0.3],curves:[{pts:[[v.nN,0],[v.nN,0.35]],col:'--stop',dash:'5 4'},{pts:pts.slice().sort((a,b)=>a[0]-b[0]),col:'--muted',dash:'4 4'}],dots:pts.map(p=>[p[0],p[1],'--blue']),cur:[n,s.If]},
   msg:n>v.nN?'تجاوزت السرعة القيمة المقننة (الخط الأحمر المتقطع)!':'الخط الأحمر المتقطع: السرعة المقننة (قيمة توضيحية).',cls:n>v.nN?'bad':''}}})}
   ]},

  {st:9,short:'منحنى العلاقة',title:'منحنى العلاقة: من الجدول إلى الرسم',ref:'ص 26–27',
   q:'ثلاثة جداول وثلاث شبكات… أي جدول يذهب إلى أي شبكة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ثلاث شبكات فارغة كما في الكتاب: جهد المصدر مع السرعة، وتيار المجال مع السرعة، والعزم مع السرعة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><g data-tip="الشبكة الأولى (ص 26): ⟦Vin⟧ رأسي و⟦n⟧ أفقي — من الجدول ⟦(5-1)⟧."><rect x="192" y="42" width="150" height="128" fill="transparent"/><rect x="196" y="64" width="120" height="86" fill="#FBF6EE"/><path d="M196 85.5 H316" stroke="#D9D2C2" stroke-width="1"/><path d="M226.0 64 V150" stroke="#D9D2C2" stroke-width="1"/><path d="M196 107.0 H316" stroke="#D9D2C2" stroke-width="1"/><path d="M256.0 64 V150" stroke="#D9D2C2" stroke-width="1"/><path d="M196 128.5 H316" stroke="#D9D2C2" stroke-width="1"/><path d="M286.0 64 V150" stroke="#D9D2C2" stroke-width="1"/><path d="M196 58 V150 H322" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><text x="200" y="54" text-anchor="start" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">V<tspan font-size="8" dy="4">in</tspan><tspan dy="-4">​</tspan>(v)</text><text x="316" y="166" text-anchor="end" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n(rpm)</text></g><g data-tip="الشبكة الثانية (ص 26): ⟦If⟧ رأسي و⟦n⟧ أفقي — من الجدول ⟦(5-3)⟧."><rect x="48" y="42" width="150" height="128" fill="transparent"/><rect x="52" y="64" width="120" height="86" fill="#FBF6EE"/><path d="M52 85.5 H172" stroke="#D9D2C2" stroke-width="1"/><path d="M82.0 64 V150" stroke="#D9D2C2" stroke-width="1"/><path d="M52 107.0 H172" stroke="#D9D2C2" stroke-width="1"/><path d="M112.0 64 V150" stroke="#D9D2C2" stroke-width="1"/><path d="M52 128.5 H172" stroke="#D9D2C2" stroke-width="1"/><path d="M142.0 64 V150" stroke="#D9D2C2" stroke-width="1"/><path d="M52 58 V150 H178" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><text x="56" y="54" text-anchor="start" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">I<tspan font-size="8" dy="4">f</tspan><tspan dy="-4">​</tspan>(A)</text><text x="172" y="166" text-anchor="end" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n(rpm)</text></g><g data-tip="الشبكة الثالثة (ص 27): ⟦T⟧ رأسي و⟦n⟧ أفقي — من الجدول ⟦(5-2)⟧."><rect x="120" y="184" width="150" height="118" fill="transparent"/><rect x="124" y="206" width="120" height="76" fill="#FBF6EE"/><path d="M124 225.0 H244" stroke="#D9D2C2" stroke-width="1"/><path d="M154.0 206 V282" stroke="#D9D2C2" stroke-width="1"/><path d="M124 244.0 H244" stroke="#D9D2C2" stroke-width="1"/><path d="M184.0 206 V282" stroke="#D9D2C2" stroke-width="1"/><path d="M124 263.0 H244" stroke="#D9D2C2" stroke-width="1"/><path d="M214.0 206 V282" stroke="#D9D2C2" stroke-width="1"/><path d="M124 200 V282 H250" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><text x="128" y="196" text-anchor="start" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T(N.m)</text><text x="244" y="298" text-anchor="end" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n(rpm)</text></g></svg>`,
   cap:'شبكات الكتاب الثلاث كما طُبعت: السرعة <span class="ltr">n</span> دائماً على المحور الأفقي.<br><b>مرّر المؤشر على كل شبكة (أو المسها في الجوال) لتعرف جدولها.</b>',
   side:[
    {book:String.raw`<ol><li>ارسم منحنيات الخواص من النتائج التي حصلت عليها وناقش المنحنيات مستعيناً بدراستك النظرية.</li></ol>`,ref:'ص 26'},
    {predict:{q:'شبكة محورها الرأسي \\(I_f\\) والأفقي \\(n\\): من أي جدول نأخذ نقاطها؟',opts:[
     ['من الجدول (5-1)',false,'الجدول (5-1) يغيّر الجهد Vin وتيار المجال فيه ثابت.'],
     ['من الجدول (5-2)',false,'الجدول (5-2) يغيّر العزم T.'],
     ['من الجدول (5-3)',true,'الجدول (5-3) هو الذي يغيّر تيار المجال If ويسجل السرعة.']]}}
   ],
   body:[
    {tip:String.raw`<p>في كل جدول عمود يتغير (الذي نختاره نحن) وصف نقرؤه (السرعة). كل عمود يعطي نقطة واحدة: نضع قيمتيها على المحورين ثم نصل النقاط بخط ناعم. والمختبر الافتراضي يرسم النقاط من قراءاتك على المحاور نفسها.</p>`,title:'كيف ترسم؟'},
    {watch:String.raw`<p>شبكات الكتاب تضع السرعة \(n\) على المحور <b>الأفقي</b> مع أنها القيمة التي نقيسها، فانتبه لمحاور كل شبكة قبل أن تضع النقاط.</p>`},
    {watch:String.raw`<p>الغرض يذكر منحنى «التيار مع العزم» ولا شبكة له في الكتاب (يرسمه المختبر من الجدول <span class="ltr">(5-2)</span>). وعلى شبكة العزم طُبع «T(nm)» والصحيح <span class="ltr">T (N.m)</span>.</p>`,fix:true},
    {title:'مختبر مصغّر: أي جدول لأي شبكة؟',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل منحنى اضغط الجدول الذي تأخذ منه نقاطه.',cats:['(5-1)','(5-2)','(5-3)'],items:[
 ['السرعة n مع جهد المصدر V<sub>in</sub>.',0,'الجدول (5-1) يغيّر V<sub>in</sub> عند <span class="ltr">I<sub>f</sub> = 0.3 A</span> و<span class="ltr">T = 0</span>.'],
 ['السرعة n مع العزم T.',1,'الجدول (5-2) يغيّر T عند <span class="ltr">V<sub>in</sub> = 120 V</span>.'],
 ['تيار المجال I<sub>f</sub> مع السرعة n.',2,'الجدول (5-3) يغيّر I<sub>f</sub> عند <span class="ltr">T = 0</span>.'],
 ['تيار المنتج I<sub>a</sub> مع العزم T (منحنى «التيار مع العزم» في الغرض).',1,'تيار المنتج يُسجَّل مع كل قيمة للعزم في الجدول (5-2).']]})}
   ]},

  {st:10,short:'بقية المطلوب',title:'بقية المطلوب: الفصل، وتيار البدء، وعكس الاتجاه',ref:'ص 27',
   q:'لحظة تشغيل المحرك، قبل أن يبدأ بالدوران… ما الذي يحد تيار المنتج؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="منحنى وصفي لتيار المنتج لحظة البدء: يقفز إلى قيمة كبيرة ثم يهبط مع زيادة السرعة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="محور تيار المنتج ⟦Ia⟧ (بلا أرقام: الرسم وصفي)."><path d="M60 60 V240 H320" fill="none" stroke="#2C4A40" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><text x="64" y="52" text-anchor="start" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">I<tspan font-size="10" dy="4">a</tspan><tspan dy="-4">​</tspan></text></g><text x="318" y="262" text-anchor="end" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">t</text><g data-tip="تيار البدء: لحظة التشغيل تكون السرعة صفراً فلا يوجد جهد عكسي، فيقفز التيار إلى قيمة كبيرة."><rect x="60" y="60" width="120" height="140" fill="transparent"/><path d="M62 238 L74 76 C 96 70, 120 150, 170 190 S 260 206, 316 206" fill="none" stroke="#E8735A" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></g><g data-tip="التيار المقنن: التيار الذي صُمم المحرك ليعمل عليه باستمرار. قارن تيار البدء به."><path d="M62 180 H316" fill="none" stroke="#12855A" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="7 6"/><text x="250" y="172" text-anchor="middle" font-size="12" fill="#12855A" font-weight="700" direction="rtl">التيار المقنن</text></g><text x="150" y="82" text-anchor="middle" font-size="13" fill="#E8735A" font-weight="700" direction="rtl">تيار البدء</text><text x="190" y="290" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="600" direction="rtl">رسم وصفي: كيف يتغير التيار بعد لحظة التشغيل</text></svg>`,
   cap:'رسم وصفي بلا أرقام: التيار يقفز لحظة البدء ثم يهبط مع ارتفاع السرعة.<br><b>مرّر المؤشر على المنحنى والخط المتقطع (أو المسهما في الجوال) لتعرف معناهما.</b>',
   side:[
    {book:String.raw`<ol start="2"><li>عند فصل محرك التيار المستمر منفصل التغذية يجب فصل دائرة المنتج أولاً. لماذا؟</li><li>افصل منبع القدرة، وأعد التشغيل مرة أخرى، لاحظ وسجل قيمة تيار البدء للمحرك وقارنه بالتيار المقنن.</li><li>مرة أخرى افصل منبع القدرة واعكس أطراف ملفات المجال للمحرك (أو أطراف المنتج)، ثم أعد التشغيل ولاحظ اتجاه الدوران.</li><li>ناقش ملاحظاتك مع زملائك.</li></ol>`,ref:'ص 27'}
   ],
   body:[
    {predict:{q:'لماذا يكون تيار البدء أكبر من التيار المقنن؟',opts:[
     ['لأن المجال أقوى لحظة البدء',false,'المجال ثابت لأن مصدره منفصل.'],
     ['لأن الفرملة مشدودة دائماً لحظة البدء',false,'حتى بلا حمل يكون تيار البدء كبيراً.'],
     ['لأن السرعة صفر فلا يوجد جهد عكسي، ولا يحد التيار إلا مقاومة المنتج الصغيرة',true,'مع ارتفاع السرعة يكبر الجهد العكسي فيهبط التيار. لذلك يُرفع الجهد تدريجياً من الصفر.']]}},
    {predict:{q:'عكسنا أطراف المجال <b>وأطراف المنتج معاً</b>. اتجاه الدوران:',opts:[
     ['ينعكس مرتين، أي يبقى كما هو',true,'العزم يعتمد على اتجاه المجال واتجاه تيار المنتج معاً؛ عكس الاثنين يُبقي الاتجاه. اعكس واحداً فقط.'],
     ['ينعكس',false,'هذا يحدث عند عكس أحدهما فقط، كما يطلب الكتاب: «أطراف المجال (أو أطراف المنتج)».'],
     ['يتوقف المحرك',false,'المحرك يدور، لكن في الاتجاه الأصلي نفسه.']]}},
    {tip:String.raw`<p>اعكس الأطراف <b>بعد فصل المصدر</b> كما يقول الكتاب، وانتظر حتى يتوقف المحرك تماماً قبل إعادة التشغيل. جرّب تيار البدء وعكس الاتجاه في تبويب «المختبر».</p>`},
    {title:'مختبر مصغّر: تيار البدء',widget:(el,B)=>DCML.lab(el,B,{intro:'المجال موجود (<span class="ltr">0.3 A</span>). اختر كيف ترفع الجهد، ثم حرّك سرعة المحرك من الوقوف إلى الاستقرار وشاهد تيار المنتج: \\(I_a=(V_{in}-E_b)\\div R_a\\).',
 predict:{q:'رفعت الجهد إلى <span class="ltr">120 V</span> دفعة واحدة والمحرك واقف. تيار المنتج لحظتها مقارنة بالتيار المقنن:',opts:[
  ['أصغر منه، لأن المحرك لم يدر بعد',false,'العكس: الوقوف يعني لا جهد عكسي، فلا يحد التيار إلا مقاومة المنتج الصغيرة.'],
  ['يساويه تقريباً',false,'التيار المقنن يكون والمحرك يدور وجهده العكسي كبير.'],
  ['أكبر منه عدة مرات',true,'\\(E_b=0\\) عند الوقوف، فيكون \\(I_a=V_{in}\\div R_a\\) كبيراً؛ لذلك يُرفع الجهد من الصفر تدريجياً.']]},
 ins:[{k:'V',l:'طريقة البدء',seg:[[120,'120 V دفعة واحدة'],[30,'رفع تدريجي: أول خطوة 30 V']],v:120},{k:'x',l:'سرعة المحرك أثناء البدء (من سرعة الاستقرار)',min:0,max:100,step:5,v:0,dp:0,u:'%'}],
 tp:{id:'u2-dcm',defs:motorDefs('sep')},
 calc:(s,v,B)=>{const k=Mod.kphi(v,0.3),kt=k*60/(2*PI),nss=Math.max(0,(kt*s.V/v.Ra-v.Tf0)/(kt*k/v.Ra+v.Tv/1000)),n=s.x/100*nss,Eb=k*n,Ia=(s.V-Eb)/v.Ra;
  return {facts:[['السرعة',DCML.fm(B,n,0)+' rpm'],['الجهد العكسي E<sub>b</sub>',DCML.fm(B,Eb,1)+' V'],['تيار المنتج I<sub>a</sub>',DCML.fm(B,Ia,2)+' A',Ia>v.IaN?'bad':'hi']],
   bars:[{l:'I<sub>a</sub> نسبةً إلى التيار المقنن',v:Ia,max:Math.max(v.IaN*8,Ia),txt:'× '+DCML.fm(B,Ia/v.IaN,1),col:Ia>v.IaN?'--stop':'--on'}],
   msg:Ia>v.IaN*2?'التيار أكبر من المقنن بكثير: لا يحده الآن إلا مقاومة المنتج.':s.x>=100?'استقر المحرك: الجهد العكسي قريب من جهد المصدر والتيار صغير.':''}}})}
   ]},

  {st:11,short:'الأسئلة',title:'الأسئلة: ترتيب التوصيل والفصل وأثر الحمل',ref:'ص 27–28',
   q:'أربعة من الأسئلة الستة تدور حول سؤال واحد: من أولاً، المجال أم المنتج؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ترتيب التوصيل والفصل: المجال يوصل أولاً ويفصل آخراً، والمنتج يوصل بعده ويفصل قبله" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><text x="300" y="96" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">المجال</text><text x="300" y="156" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">المنتج</text><g data-tip="دائرة المجال: توصل أولاً وتفصل آخراً، فيبقى المجال موجوداً طوال عمل المنتج."><rect x="40" y="80" width="220" height="24" rx="12" fill="#E8735A"/></g><g data-tip="دائرة المنتج: توصل بعد التأكد من تيار المجال، وتفصل قبل المجال."><rect x="84" y="140" width="132" height="24" rx="12" fill="#4FB3A9"/></g><path d="M40 200 H260" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M40 200 L253.0 200.0" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><polygon points="262,200 253.0,204.5 253.0,195.5" fill="#2C4A40"/><path d="M84 120 V188 M216 120 V188" fill="none" stroke="#2C4A40" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="4 4"/><text x="84" y="226" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="rtl">توصيل</text><text x="216" y="226" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="rtl">فصل</text><text x="150" y="256" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="600" direction="rtl">الزمن</text><text x="84" y="182" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">1</text><text x="216" y="182" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">2</text></svg>`,
   cap:'المجال (البرتقالي) يبدأ قبل المنتج (الفيروزي) وينتهي بعده: المنتج لا يعمل أبداً بلا مجال.<br><b>مرّر المؤشر على الشريطين (أو المسهما في الجوال) لتعرف معناهما.</b>',
   side:[
    {book:String.raw`<p>بعد الانتهاء من التجربة يمكنك الإجابة على الأسئلة التالية:</p><ol type="i"><li>لماذا يجب توصيل دائرة المجال قبل توصيل دائرة المنتج في محرك التيار المستمر منفصل التغذية؟</li><li>ماذا يحدث للمحرك إذا تم توصيل دائرة المنتج قبل دائرة المجال في بداية التشغيل؟</li><li>لماذا يجب فصل دائرة المنتج قبل دائرة المجال في محرك التيار المستمر منفصل التغذية؟</li><li>ماذا يحدث للمحرك إذا تم فصل دائرة المجال قبل دائرة المنتج عند الانتهاء من العمل؟</li><li>ما هو تأثير زيادة الحمل على كل من تيار المنتج والعزم المتولد وتيار المجال والسرعة لمحرك التيار المستمر منفصل التغذية؟</li><li>ما هي الاحتياطات التي يجب أن تؤخذ في الاعتبار في بداية التشغيل وما هي الاحتياطات التي يجب أن تؤخذ في الاعتبار في نهاية التشغيل، ولماذا؟</li></ol>`,ref:'ص 27–28'}
   ],
   body:[
    {predict:{q:'السؤال v: عند زيادة الحمل، ماذا يحدث لتيار المجال في المحرك منفصل التغذية؟',opts:[
     ['يزيد مع تيار المنتج',false,'هذا يحدث في محرك التوالي فقط، حيث المجال في خط المنتج.'],
     ['يقل',false,'لا شيء في دائرة المجال يتغير عند زيادة الحمل.'],
     ['لا يتغير، لأن مصدره منفصل',true,'تيار المنتج والعزم يزيدان، والسرعة تقل قليلاً، أما تيار المجال فثابت.']]}},
    {tip:String.raw`${Q('i و ii:','لماذا المجال أولاً؟','حتى يكون المجال موجوداً لحظة وصول التيار إلى المنتج: فيتولد عزم بدء جيد، ويتولد الجهد العكسي بمجرد الدوران فيحد التيار. بدون مجال يمر في المنتج تيار كبير لا يحده إلا مقاومته الصغيرة، ومع حمل قد لا يدور ويسخن، وبدون حمل قد تجمح سرعته.')}
     ${Q('iii و iv:','لماذا المنتج يُفصل أولاً؟','لو فُصل المجال والمنتج ما زال موصلاً يبقى المجال المتبقي الضعيف فقط، فيقل الجهد العكسي ويزيد تيار المنتج كثيراً، وترتفع السرعة ارتفاعاً خطيراً إذا كان الحمل خفيفاً. فصل المنتج أولاً يوقف المحرك والمجال ما زال موجوداً.')}
     ${Q('vi:','الاحتياطات','<b>في البداية:</b> صِل المجال وتأكد من تيار المجال، ثم صِل المنتج والجهد على الصفر وارفعه تدريجياً (لا توجد مقاومة بدء). <b>في النهاية:</b> خفّف الحمل واخفض الجهد، ثم افصل المنتج أولاً ثم المجال.')}`,title:'إجابات مقترحة (ليست من الكتاب) — اضغط السؤال لتظهر'},
    {title:'مختبر مصغّر: رتّب التشغيل والإيقاف',widget:(el,B)=>DCML.order(el,B,{intro:'اضغط خطوات التشغيل ثم الإيقاف بالترتيب الآمن (من أسئلة الكتاب وملاحظات السلامة ص 27–28).',steps:[
 ['صِل دائرة المجال وتأكد من وجود تيار المجال','المجال أولاً: «يجب توصيل دائرة المجال… والتأكد من وجود تيار المجال قبل توصيل دائرة المنتج».'],
 ['صِل دائرة المنتج والجهد على الصفر','لا يوصل المنتج قبل أن يكون المجال موجوداً.'],
 ['ارفع جهد المنتج تدريجياً','الرفع بعد توصيل المنتج على الصفر، لأن الدائرة بلا مقاومة بدء.'],
 ['عند الانتهاء: خفّف الحمل واخفض الجهد','الإيقاف يبدأ بتخفيف الحمل والجهد.'],
 ['افصل دائرة المنتج','المنتج يُفصل قبل المجال: «قم بفصل دائرة المنتج قبل فصل دائرة المجال».'],
 ['افصل دائرة المجال','المجال آخر ما يُفصل.']],done:'المجال يوصل أولاً ويُفصل آخراً.'})}
   ]},

  {st:12,short:'ملاحظات السلامة',title:'ملاحظات السلامة',ref:'ص 28',
   q:'ثلاث جمل في آخر التجربة… لو نسيت واحدة منها، ماذا قد يحدث للمحرك؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="عداد سرعة فيه منطقة حمراء خطرة، ومفتاح تيار المجال يُخفض بحذر" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><g data-tip="المنطقة الحمراء: سرعة عالية قد تضر بالمحرك (الكتاب لا يعطيها رقماً)."><rect x="90" y="80" width="180" height="96" fill="transparent"/><path d="M90 170 A90 90 0 0 1 270 170" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M257.9 125.0 A90 90 0 0 1 270 170" fill="none" stroke="#E8735A" stroke-width="8"/><path d="M180 170 L241.3 118.6" fill="none" stroke="#2C4A40" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="180" cy="170" r="6" fill="#2C4A40"/><text x="180" y="138.5" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n</text></g><g data-tip="تقليل تيار المجال ⟦If⟧ يرفع السرعة؛ لذلك يُخفض بحذر وبخطوات صغيرة."><circle cx="180" cy="236" r="26" fill="#E8735A" stroke="#2C4A40" stroke-width="3"/><path d="M180 236 L166 220" fill="none" stroke="#FBF6EE" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><text x="180" y="282" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">I<tspan font-size="10" dy="4">f</tspan><tspan dy="-4">​</tspan></text></g><path d="M226 232 L249.8 206.6" fill="none" stroke="#2C4A40" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><polygon points="256,200 253.1,209.6 246.6,203.5" fill="#2C4A40"/><text x="286" y="190" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="rtl">تزيد السرعة</text></svg>`,
   cap:'تقليل تيار المجال يدفع إبرة السرعة نحو المنطقة الحمراء.<br><b>مرّر المؤشر على العداد والمقبض (أو المسهما في الجوال) لتعرف معناهما.</b>',
   side:[
    {book:String.raw`<ul><li>يجب توصيل دائرة المجال عند بدء التجربة والتأكد من وجود تيار المجال قبل توصيل دائرة المنتج.</li><li>يتم تقليل تيار المجال بحذر حتى لا تصل سرعة المحرك لقيمة عالية قد تضر بالمحرك.</li><li>قم بفصل دائرة المنتج قبل فصل دائرة المجال.</li></ul>`,ref:'ص 28'}
   ],
   body:[
    {predict:{q:'أي خطأ من هذه يخالف ملاحظات السلامة؟',opts:[
     ['رفع جهد المنتج تدريجياً من الصفر',false,'هذا هو الصحيح، لأن الدائرة بلا مقاومة بدء.'],
     ['خفض تيار المجال دفعة واحدة إلى أقل قيمة والمحرك بلا حمل',true,'الكتاب: «يتم تقليل تيار المجال بحذر حتى لا تصل سرعة المحرك لقيمة عالية قد تضر بالمحرك».'],
     ['فصل المنتج قبل المجال',false,'هذه الملاحظة الثالثة نفسها.']]}},
    {add:String.raw`<p>في المصانع تُركّب على محركات التيار المستمر حماية تسمى «حماية فقد المجال»: إذا انقطع تيار المجال يفصل القاطع دائرة المنتج فوراً، للسبب نفسه الذي تشرحه هذه الملاحظات.</p>`},
    {tip:String.raw`<p>الكتاب لا يعطي التيار المقنن ولا السرعة المقننة رقماً؛ اسأل مدربك عن قيم محرك المعمل قبل أن تبدأ.</p>`},
    {title:'تحقق سريع: ملاحظات السلامة',widget:(el,B)=>DCML.tf(el,B,{intro:'هذه المحطة قواعد للتطبيق. احكم على كل عبارة.',items:[
 ['يجوز توصيل المنتج أولاً ثم المجال إذا كان الجهد صغيراً.',false,'«يجب توصيل دائرة المجال عند بدء التجربة والتأكد من وجود تيار المجال قبل توصيل دائرة المنتج».'],
 ['تقليل تيار المجال يكون بحذر لأن السرعة ترتفع.',true,'«يتم تقليل تيار المجال بحذر حتى لا تصل سرعة المحرك لقيمة عالية قد تضر بالمحرك».'],
 ['عند الانتهاء نفصل المجال أولاً لأنه أصغر تياراً.',false,'«قم بفصل دائرة المنتج قبل فصل دائرة المجال».']]})}
   ]},

  {recap:[
   String.raw`المحرك منفصل التغذية: لملف المجال \(E1–E2\) مصدر خاص، فنغيّر \(V_{in}\) و\(T\) و\(I_f\) كلاً على حدة، الشكل (5) (ص 25).`,
   String.raw`زيادة \(V_{in}\) ترفع السرعة بنسبة شبه ثابتة، وزيادة \(T\) تزيد \(I_a\) وتنقص السرعة قليلاً، وتقليل \(I_f\) يرفع السرعة كثيراً (الجداول 5-1 و5-2 و5-3).`,
   String.raw`العزم من قدرة المولد (قوانين ص 24): \(P_L=V_LI_L\)، \(\omega=2\pi n/60\)، \(T_L=P_L/\omega\).`,
   String.raw`المجال يوصل أولاً ويفصل آخراً، والجهد يُرفع من الصفر لأن تيار البدء كبير، وعكس المجال أو المنتج (لا الاثنين) يعكس الدوران (ص 27–28).`]}
],
 theory:[
  UNIT2_HEAD,
  {h:'التجربة الخامسة: منحنى خواص السرعة مع العزم للمحرك منفصل التغذية',ref:'ص 24',html:`<p class="ltr" style="text-align:left">Speed characteristic of a separately excited DC motor</p><p><b>الأهداف:</b></p><ul><li>معرفة تأثير جهد المصدر والعزم على السرعة وتيار المنتج.</li><li>الحصول على منحنيات الخواص لمحرك التغذية المنفصلة عند تحميله، مثل منحنى السرعة مع العزم، والتيار مع العزم.</li><li>التعرف على كيفية بدء الحركة والتحكم في السرعة وكذلك كيفية عكس السرعة.</li></ul>`},
  {h:'شرح التجربة',ref:'ص 24',html:`<p>«يتركز الغرض من اختبار محركات التيار المستمر أساساً حول الحصول على منحنيات الخواص للمحرك أثناء التحميل وكذلك عند تغير سرعته. ويكون تحميل المحرك بازدواجه على محور إدارة مولد تيار مستمر مناسب يكون تحميله إما بمقاومة متغيرة أو مجموعة لمبات إضاءة، وذلك لكي يقوم المولد مقام الحمل على المحرك، وبذلك يمكن قياس عزم الدوران على عمود إدارة المحرك، كذلك يمكن قياس سرعة الدوران للمحرك باستخدام التاكومتر.»</p>
   <p>«يمكن افتراض أن كفاءة المولد 100% وذلك بإهمال المفقودات فيه. وبذلك تتساوى القدرة الخارجية للمولد وهي قدرة كهربية مقاسة مع القدرة الداخلة له وهي القدرة الخارجة للمحرك على عمود الإدارة.»</p>
   <p><b>القوانين المستخدمة:</b></p><table class="tt"><thead><tr><th>القانون</th><th>الوحدة</th></tr></thead><tbody><tr><td>\\(P_L = V_L\\,I_L\\)</td><td class="ltr">W</td></tr><tr><td>\\(\\text{Torque},\\ T_L = \\dfrac{P_L}{\\omega}\\)</td><td class="ltr">N.m</td></tr><tr><td>\\(\\omega = \\dfrac{2\\pi\\,n}{60}\\)</td><td class="ltr">rad/sec.</td></tr></tbody></table>
   <p>«حيث \\(n\\) هي سرعة المحرك باللفة في الدقيقة. من هنا يمكن القول أن \\(T_L\\) هو عزم المحرك الكهربي تحت الاختبار.» حساب العزم بهذه القوانين في تبويب «الأمثلة المحلولة».</p>`},
  {note:'<b>طريقة التحميل في هذا الدرس:</b> الشرح يصف التحميل بمولد مزدوج على العمود، لكن مخطط التوصيل الشكل (5) يستعمل <b>جهاز فرملة (Brake)</b> يُضبط عليه العزم مباشرة بالنيوتن·متر، والجداول تعطي العزم T مباشرة. اعتمدنا الفرملة كما في المخطط. القوانين أعلاه تلزمك فقط إذا حمّلت المحرك بمولد.'},
  DC_BASICS,
  {h:'الأجهزة المستخدمة',ref:'ص 25',html:'<p>لم يذكر الكتاب قائمة أجهزة لهذه التجربة. من مخطط التوصيل الشكل (5):</p><ol><li>مصدر جهد مستمر متغير <span class="ltr">Vin 0-250 V DC</span> (لدائرة المنتج).</li><li>مصدر للمجال <span class="ltr">0-240 V / 0-6 A</span>.</li><li>محرك تيار مستمر M (أطراف المنتج 1B1–2B2، وملف المجال E1–E2).</li><li>فولتميتر V.</li><li>أميتر A2 (تيار المنتج) وأميتر A1 (تيار المجال).</li><li>تاكومتر (Tacho) وعداد سرعة (Speed).</li><li>جهاز الفرملة (Brake).</li></ol>'},
  {fig:'(5)',ref:'ص 25',caption:'مخطط التوصيل للمحرك منفصل التغذية: المصدر Vin والفولتميتر V وأميتر المنتج A2 إلى 1B1–2B2، وملف المجال E1–E2 من مصدر منفصل عبر الأميتر A1، وعلى العمود تاكومتر وجهاز فرملة. لا توجد مقاومة بدء في الدائرة.',draw:()=>box(figSVG('sep',{static:1}),760,1)},
  {h:'خطوات التجربة',ref:'ص 25–26',html:`<p><b>أولاً:</b></p><ol><li>قم بتوصيل الدائرة كما هو موضح في مخطط التوصيل شكل (5).</li><li>قم بتثبيت تيار المجال \\(I_f\\) عند <span class="ltr">0.3 A</span> وثبت العزم الواقع على المحرك بواسطة جهاز العزم عند قيمة قدرها <span class="ltr">T = 0 N.m</span>.</li><li>قم بتغيير قيم جهد المصدر \\(V_{in}\\) وفي كل مرة قم بتسجيل قيمة السرعة n وذلك حسب الجدول (5-1):</li></ol>${tableHTML(TB['5-1'])}
   <p style="margin-top:14px"><b>ثانياً:</b></p><ol><li>قم بتثبيت تيار المجال \\(I_f\\) عند <span class="ltr">0.3 A</span> وثبت جهد المصدر <span class="ltr">Vin = 120 V</span>.</li><li>قم بتغيير قيمة العزم T وفي كل مرة قم بتسجيل قيمة السرعة n وذلك حسب الجدول (5-2).</li></ol>${tableHTML(TB['5-2'])}
   <p style="margin-top:14px"><b>ثالثاً:</b></p><ol><li>قم بتثبيت قيمة جهد المصدر <span class="ltr">Vin = 120 V</span> وثبت العزم الواقع على المحرك بواسطة جهاز العزم عند قيمة قدرها <span class="ltr">T = 0 N.m</span>.</li><li>قم بتغيير قيم تيار المجال \\(I_f\\) وفي كل مرة قم بتسجيل قيمة السرعة n وتيار المنتج كما هو موضح في الجدول (5-3):</li></ol>${tableHTML(TB['5-3'])}`},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب:</b> في الجزء «ثالثاً» يكون المحرك بلا حمل، وتقليل تيار المجال يرفع السرعة كثيراً. اخفض المجال <b>بخطوات صغيرة</b> وراقب عداد السرعة (الكتاب ينبه لذلك في ملاحظات السلامة ص 28).'},
  {h:'منحنى العلاقة',ref:'ص 26–27',html:'<ol><li>ارسم منحنيات الخواص من النتائج التي حصلت عليها وناقش المنحنيات مستعيناً بدراستك النظرية.</li></ol><p>في الكتاب ثلاث شبكات فارغة: المحور الرأسي <span class="ltr">Vin (v)</span> والأفقي <span class="ltr">n (rpm)</span> (من الجدول 5-1)؛ المحور الرأسي <span class="ltr">If (A)</span> والأفقي <span class="ltr">n (rpm)</span> (من الجدول 5-3)؛ المحور الرأسي <span class="ltr">T (N.m)</span> والأفقي <span class="ltr">n (rpm)</span> (من الجدول 5-2). يرسمها المختبر بنفس المحاور من قراءاتك.</p>'},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب:</b> شبكات الكتاب تضع السرعة n على المحور الأفقي مع أنها القيمة التي نقيسها (التابعة). أبقينا محاور الكتاب كما هي. <span class="fixnote">والغرض يذكر «التيار مع العزم» ولا شبكة له في الكتاب، فأضفنا في المختبر منحنى \\(I_a\\) مع T (إضافة من خارج الكتاب).</span>'},
  {h:'بقية المطلوب',ref:'ص 27',html:`<ol start="2"><li>عند فصل محرك التيار المستمر منفصل التغذية يجب فصل دائرة المنتج أولاً. لماذا؟</li><li>افصل منبع القدرة، وأعد التشغيل مرة أخرى، لاحظ وسجل قيمة تيار البدء للمحرك وقارنه بالتيار المقنن.</li><li>مرة أخرى افصل منبع القدرة واعكس أطراف ملفات المجال للمحرك (أو أطراف المنتج)، ثم أعد التشغيل ولاحظ اتجاه الدوران.</li><li>ناقش ملاحظاتك مع زملائك.</li></ol>
   ${Q('المطلوب 2:','لماذا يُفصل المنتج أولاً؟','لو فُصل المجال أولاً والمنتج ما زال على المصدر، يضعف المجال فجأة إلى المغناطيسية المتبقية فقط، فيقل الجهد العكسي ويزيد تيار المنتج زيادة كبيرة، وإذا كان الحمل خفيفاً ترتفع السرعة ارتفاعاً خطيراً. بفصل المنتج أولاً يتوقف المحرك بأمان والمجال ما زال موجوداً.')}
   ${Q('المطلوب 3:','ماذا تلاحظ في تيار البدء؟','تيار البدء أكبر من التيار المقنن عدة مرات، لأن السرعة لحظة البدء صفر فلا يوجد جهد عكسي، ولا يحد التيار إلا مقاومة المنتج الصغيرة: \\(I_{start} \\approx V_{in}/R_a\\). ثم يهبط التيار بسرعة كلما زادت السرعة. لذلك يُرفع الجهد تدريجياً من الصفر (أو تستعمل مقاومة بدء).')}
   ${Q('المطلوب 4:','ماذا يحدث عند عكس أطراف المجال أو المنتج؟','ينعكس اتجاه الدوران. أما عكس الاثنين معاً فلا يغير الاتجاه، لأن العزم يعتمد على اتجاه المجال واتجاه تيار المنتج معاً.')}`},
  {h:'الأسئلة',ref:'ص 27–28',html:`<p>«بعد الانتهاء من التجربة يمكنك الإجابة على الأسئلة التالية:»</p>
   ${Q('i.','لماذا يجب توصيل دائرة المجال قبل توصيل دائرة المنتج في محرك التيار المستمر منفصل التغذية؟','حتى يكون المجال موجوداً لحظة وصول التيار إلى المنتج: فيتولد عزم بدء جيد، ويتولد الجهد العكسي بمجرد الدوران فيحد التيار، وتبقى السرعة محدودة. بدون مجال يكون التيار كبيراً والعزم ضعيفاً، أو تجمح السرعة إذا كان المحرك بلا حمل.')}
   ${Q('ii.','ماذا يحدث للمحرك إذا تم توصيل دائرة المنتج قبل دائرة المجال في بداية التشغيل؟','يمر في المنتج تيار كبير (لا يحده إلا مقاومة المنتج) لأن المجال المتبقي صغير جداً فالجهد العكسي صغير. مع حمل قد لا يدور أصلاً ويسخن، وبدون حمل قد يدور بسرعة عالية جداً (جموح). في المختبر ستفصل الحماية المصدر.')}
   ${Q('iii.','لماذا يجب فصل دائرة المنتج قبل دائرة المجال في محرك التيار المستمر منفصل التغذية؟','لأن فصل المجال والمنتج موصل يُضعف المجال فجأة، فيزيد تيار المنتج كثيراً وترتفع السرعة ارتفاعاً خطيراً. وكذلك يظهر جهد حثي عالٍ بين طرفي ملف المجال لحظة قطع تياره. فصل المنتج أولاً يوقف المحرك والمجال ما زال موجوداً.')}
   ${Q('iv.','ماذا يحدث للمحرك إذا تم فصل دائرة المجال قبل دائرة المنتج عند الانتهاء من العمل؟','يبقى المجال المتبقي فقط، فيقل الجهد العكسي ويزيد تيار المنتج بشدة، وترتفع السرعة (خصوصاً بحمل خفيف) حتى قد تتلف الآلة ميكانيكياً، أو تفصل الحماية.')}
   ${Q('v.','ما هو تأثير زيادة الحمل على كل من تيار المنتج والعزم المتولد وتيار المجال والسرعة لمحرك التيار المستمر منفصل التغذية؟','تيار المنتج يزيد، والعزم المتولد يزيد حتى يساوي الحمل مضافاً إليه الاحتكاك، وتيار المجال لا يتغير (مصدره منفصل)، والسرعة تقل قليلاً فقط بسبب زيادة الهبوط \\(I_aR_a\\) (جدولك 5-2).')}
   ${Q('vi.','ما هي الاحتياطات التي يجب أن تؤخذ في الاعتبار في بداية التشغيل وما هي الاحتياطات التي يجب أن تؤخذ في الاعتبار في نهاية التشغيل، ولماذا؟','<b>في البداية:</b> صِل المجال وتأكد من وجود تيار المجال قبل توصيل المنتج؛ ابدأ وجهد المنتج على الصفر ثم ارفعه تدريجياً (لا توجد مقاومة بدء في الشكل 5) حتى لا يكون تيار البدء كبيراً؛ تأكد من مدى الأجهزة ومن ضبط الفرملة. <b>في النهاية:</b> خفّف الحمل واخفض الجهد، ثم افصل المنتج أولاً ثم المجال. والسبب في الحالتين منع التيار الكبير والسرعة العالية الخطيرة.')}`},
  {h:'ملاحظات سلامة',ref:'ص 28',html:'<ul><li>يجب توصيل دائرة المجال عند بدء التجربة والتأكد من وجود تيار المجال قبل توصيل دائرة المنتج.</li><li>يتم تقليل تيار المجال بحذر حتى لا تصل سرعة المحرك لقيمة عالية قد تضر بالمحرك.</li><li>قم بفصل دائرة المنتج قبل فصل دائرة المجال.</li></ul><p class="sub">الكتاب لا يعطي التيار المقنن ولا السرعة المقننة رقماً؛ في المختبر قيم توضيحية يغيّرها المدرب.</p>'},
  {err:`<div class="fixnote"><b>ملاحظات على الكتاب (الوحدة الثانية والتجربة الخامسة):</b><ol style="margin:6px 0 0;padding-inline-start:20px">
   <li>الفهرس يضع الوحدة الثانية في ص 23، وصفحة غلافها فعلياً ص 22 (ص 23 صفحة الأهداف).</li>
   <li>الهدف التفصيلي 1 مطبوع «لمحرك التغذية المنفصلة التغذية» (كلمة مكررة) — صُحح أعلاه.</li>
   <li>الهدف التفصيلي 5 عن «المحرك المركب بنوعيه» ولا توجد له تجربة في الكتاب: الوحدة تنتهي بالتجربة السابعة (محرك التوالي).</li>
   <li>الشرح (ص 24) يحمّل المحرك بمولد مزدوج ويحسب العزم من قدرته، بينما الشكل (5) والجداول تستعمل جهاز فرملة يُضبط عليه العزم مباشرة. اعتمدنا الفرملة.</li>
   <li>على جهاز الفرملة في الشكل (5) طُبعت الوحدة «m.N» والصحيح <span class="ltr">N.m</span>، وعلى الشبكة «T(nm)» والصحيح <span class="ltr">T (N.m)</span>.</li>
   <li>في الجدول (5-3) طُبعت القيمتان 0.15 و0.2 مشوهتين بخلط الأرقام واتجاه الكتابة («١٥0.» و«٢0.») — صُححتا.</li>
   <li>في السؤال v: «وتبار المجال» والصحيح «وتيار المجال» — صُحح.</li>
   <li>لم تُذكر قائمة الأجهزة؛ استخرجناها من مخطط التوصيل.</li>
   <li>الغرض يذكر منحنى «التيار مع العزم» ولا توجد له شبكة؛ وشبكات الكتاب تضع n على المحور الأفقي.</li></ol></div>`}
 ],
 lab:(el)=>bench(el,{type:'sep',prefix:'d5',fig:'(5)',figRef:'ص 25',benchTitle:'منضدة المحرك منفصل التغذية',
  benchNote:'اختر الجزء (أولاً / ثانياً / ثالثاً) فتظهر شروط جدوله بالأخضر إذا تحققت. ثبّت الشروط، غيّر المتغير إلى قيم الجدول، وسجّل بعد أن تستقر السرعة.',
  partNames:['أولاً','ثانياً','ثالثاً'],tables:['5-1','5-2','5-3'],startRec:true,
  meterNote:'عند T = 0 لا يكون I<sub>a</sub> صفراً: المحرك يأخذ تياراً صغيراً ليغلب الاحتكاك والتهوية. والعزم المقروء هو عزم الفرملة فقط.',
  runaway:'المجال ضعيف جداً أو الحمل صغير، فارتفعت السرعة بلا حد. ارفع تيار المجال، ثم أعد ضبط الحماية وشغّل من جهد صغير.',
  overspeed:'الكتاب: «يتم تقليل تيار المجال بحذر حتى لا تصل سرعة المحرك لقيمة عالية قد تضر بالمحرك» (ص 28).',
  plotRef:'ص 26–27',
  plots:[{tab:'5-1',x:'n',y:'Vin',xl:'n (rpm)',yl:'Vin (V)',cap:'V<sub>in</sub> مع n — الجدول (5-1)',dx:[0,2000],dy:[0,200]},
   {tab:'5-3',x:'n',y:'If',xl:'n (rpm)',yl:'If (A)',cap:'I<sub>f</sub> مع n — الجدول (5-3)',dx:[0,3000],dy:[0,0.4]},
   {tab:'5-2',x:'n',y:'T',xl:'n (rpm)',yl:'T (N.m)',cap:'T مع n — الجدول (5-2)',dx:[0,1500],dy:[0,0.5]},
   {tab:'5-2',x:'T',y:'Ia',xl:'T (N.m)',yl:'Ia (A)',cap:'I<sub>a</sub> مع T — الجدول (5-2) (إضافة من خارج الكتاب: الغرض يذكره ولا شبكة له)',dx:[0,0.5],dy:[0,1]}],
  plotNote:'إذا لم يبدأ محور من الصفر تظهر عنده العلامة «≠0» — مثل محور السرعة في منحنى T مع n، لأن السرعة تتغير قليلاً فقط.',
  steps:EXP5_STEPS}),
 examples:[
  {title:'حساب العزم من قدرة المولد — القوانين المستخدمة',ref:'ص 24',q:'<p>إذا حُمّل المحرك بمولد مزدوج على عموده (كما في شرح التجربة) وقرأنا جهد المولد وتياره وسرعة المحرك، نحسب العزم بالقوانين: \\(P_L=V_LI_L\\)، \\(\\omega=2\\pi n/60\\)، \\(T_L=P_L/\\omega\\). <b>الأرقام توضيحية — الكتاب لا يعطي مثالاً محلولاً.</b></p>',
   given:[{id:'VL',label:'جهد المولد',sym:'V_L',unit:'V',value:110},{id:'IL',label:'تيار حمل المولد',sym:'I_L',unit:'A',value:0.5},{id:'n',label:'سرعة المحرك',sym:'n',unit:'rpm',value:1200}],
   solve:(g,B)=>{const P=g.VL*g.IL,w=2*PI*g.n/60;return [
    {t:'القدرة الخارجة من المولد (= القدرة على عمود المحرك بفرض كفاءة المولد 100%):',f:`P_L=V_L\\,I_L=${fm(g.VL)}\\times${fm(g.IL)}`,v:B.round(P,2),unit:'W',dp:2},
    {t:'السرعة الزاوية:',f:`\\omega=\\frac{2\\pi n}{60}=\\frac{2\\pi\\times${fm(g.n)}}{60}`,v:B.round(w,2),unit:'rad/s',dp:2},
    {t:'عزم المحرك:',f:`T_L=\\frac{P_L}{\\omega}=\\frac{${fm(B.round(P,2))}}{${fm(B.round(w,2))}}`,v:g.n>0?B.round(P/w,3):'—',unit:'N.m',dp:3,final:true}]},
   note:'لو كانت كفاءة المولد أقل من 100% لكان العزم الحقيقي على عمود المحرك أكبر قليلاً من الناتج، لأن المولد يفقد جزءاً من القدرة.'}
 ],
 quiz:[
  {q:'في المحرك منفصل التغذية، من أين يأخذ ملف المجال E1–E2 تياره في الشكل (5)؟',o:['من نفس مصدر المنتج','من مصدر منفصل 0-240 V عبر الأميتر A1','من ملف التوالي','من التاكومتر'],c:1,e:'الشكل (5) ص 25: مصدر المجال منفصل عبر A1.'},
  {q:'عند زيادة جهد المصدر V<sub>in</sub> مع ثبات If و T = 0 فإن السرعة:',o:['تقل','تزيد تقريباً بنفس النسبة','لا تتغير','تنعكس'],c:1,e:'n ≈ V<sub>in</sub>/(kφ) — الجدول (5-1).'},
  {q:'عند زيادة العزم على المحرك (Vin = 120 V و If = 0.3 A):',o:['تزيد السرعة ويقل Ia','تقل السرعة قليلاً ويزيد Ia','يقل تيار المجال','لا يتغير شيء'],c:1,e:'الجدول (5-2) والسؤال v.'},
  {q:'تقليل تيار المجال If (والحمل صفر) يؤدي إلى:',o:['نقص السرعة','زيادة السرعة كثيراً','توقف المحرك فوراً','نقص تيار المنتج إلى الصفر'],c:1,e:'المجال يضعف فتزيد السرعة — لذلك «يتم تقليل تيار المجال بحذر» (ص 28).'},
  {q:'الترتيب الصحيح عند بدء التشغيل:',o:['المنتج ثم المجال','المجال ثم المنتج','الاثنان معاً دائماً','لا يهم الترتيب'],c:1,e:'ص 28: «التأكد من وجود تيار المجال قبل توصيل دائرة المنتج».'},
  {q:'لماذا يكون تيار البدء كبيراً؟',o:['لأن المجال قوي','لأن السرعة صفر فلا يوجد جهد عكسي ولا يحد التيار إلا Ra','لأن الفرملة مشدودة','لأن الفولتميتر على التوازي'],c:1,e:'I<sub>start</sub> ≈ V<sub>in</sub>/R<sub>a</sub>.'},
  {q:'كيف يُعكس اتجاه دوران المحرك منفصل التغذية؟',o:['بزيادة الجهد','بعكس أطراف المجال أو أطراف المنتج (وليس الاثنين معاً)','بعكس الاثنين معاً','بتقليل الحمل'],c:1,e:'المطلوب 4 ص 27.'},
  {q:'بماذا حمّلنا المحرك في المختبر كما في الشكل (5)؟',o:['بمولد ولمبات','بجهاز فرملة يضبط عليه العزم بالـ N.m','بمقاومة على التوالي مع المنتج','بلا حمل دائماً'],c:1,e:'الشكل (5) فيه «Brake»، والجداول تعطي T مباشرة.'}
 ]
});

/* =====================================================================
   Lesson 2.2 — التجربة السادسة: محرك التوازي
   ===================================================================== */
const EXP6_STEPS=c=>[
 {t:'الفرملة على الصفر ثم شغّل المصدر',x:'اجعل <span class="ltr">T = 0 N.m</span> واترك V<sub>in</sub> على الصفر، ثم شغّل «مصدر القدرة» وارفع الجهد تدريجياً. في محرك التوازي يأخذ المجال جهده من نفس المصدر.',done:()=>c.running()&&c.s.peak<c.v().IaN*1.5},
 {t:'أولاً — جدول (6-1)',get x(){return `اختر «أولاً». اضبط V<sub>in</sub> على 60 ثم 80 ثم 100 ثم 120 ثم 140 V وسجّل كل مرة. لاحظ: السرعة تزيد ببطء مع الجهد، لأن تيار المجال يزيد مع الجهد أيضاً (If = Vin ÷ ${fm(c.v().Rf)} Ω) فيقوى المجال.`},done:()=>c.full('6-1')},
 {t:'ثانياً — جدول (6-2)',x:'اختر «ثانياً». ثبّت <span class="ltr">Vin = 120 V</span> وارفع عزم الفرملة 0 ← 0.4 N.m وسجّل كل مرة: السرعة تقل قليلاً جداً.',done:()=>c.full('6-2')},
 {get t(){const r=c.R['6-2'].pts;return 'شبه ثابت السرعة'+(r[0]&&r[4]?` — تنظيم السرعة ${fm((r[0].n-r[4].n)/r[4].n*100,1)}%`:'')},x:'من جدولك (6-2): قارن السرعة عند T = 0 بالسرعة عند T = 0.4 N.m. الفرق نسبة صغيرة، لذلك يسمى محرك التوازي «ثابت السرعة» (السؤال ب). معامل تنظيم السرعة في تبويب «الأمثلة المحلولة».'},
 {t:'عكس اتجاه الدوران',x:'افصل المصدر وانتظر توقف المحرك، ثم اعكس أطراف المجال E1–E2 (أو أطراف المنتج) وأعد التشغيل (ص 31).',done:()=>c.did.revRun},
 {t:'فصل ملف المجال فجأة (السؤالان ج و د)',x:'وأطراف التوصيل عادية والمحرك يعمل، اضغط «فصل مفاجئ لملف المجال» مرة بحمل ومرة بدون حمل، وراقب التيار والسرعة حتى تفصل الحماية. ثم أعد توصيل الملف واضبط الحماية.',done:()=>c.did.fault&&c.did.trip}
];
B.lesson({
 id:'u2-l2',unit:2,order:2,pages:'29–31',
 title:'التجربة السادسة: منحنى خواص السرعة مع العزم لمحرك التوازي',
 summary:'محرك التوازي: ملف المجال موصل على نفس المصدر مع المنتج. أثر جهد المصدر والحمل على السرعة، ولماذا يسمى محركاً ثابت السرعة. منضدة افتراضية للجدولين (6-1) و(6-2) ومنحنياتهما.',
 stations:[
  {intro:true},

  {st:1,short:'الغرض',title:'الغرض من التجربة السادسة',ref:'ص 29',
   q:'في محرك التوازي يأخذ المجال جهده من مصدر المنتج نفسه… فهل يتصرف مثل المحرك منفصل التغذية؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="جهد المصدر والعزم يؤثران على سرعة محرك التوازي" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="عداد السرعة ⟦n⟧: نراقب كيف تتغير السرعة."><rect x="100" y="96" width="160" height="90" fill="transparent"/><path d="M100 180 A80 80 0 0 1 260 180" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M249.3 140.0 A80 80 0 0 1 260 180" fill="none" stroke="#E8735A" stroke-width="8"/><path d="M180 180 L147.1 118.2" fill="none" stroke="#2C4A40" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="180" cy="180" r="6" fill="#2C4A40"/><text x="180" y="152.0" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n</text></g><g data-tip="جهد المصدر ⟦Vin⟧ — الجزء «أولاً»."><rect x="45.0" y="68.1" width="62.0" height="23.8" rx="11.9" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.6"/><text x="76" y="84.5" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">V<tspan font-size="9" dy="4">in</tspan><tspan dy="-4">​</tspan></text></g><g data-tip="العزم ⟦T⟧ من جهاز الفرملة — الجزء «ثانياً»."><rect x="259.0" y="68.1" width="50.0" height="23.8" rx="11.9" fill="#F2C14E" stroke="#2C4A40" stroke-width="1.6"/><text x="284" y="84.5" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T</text></g><path d="M104 92 L125.4 111.9" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><polygon points="132,118 122.3,115.2 128.5,108.6" fill="#2C4A40"/><path d="M256 92 L234.6 111.9" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><polygon points="228,118 231.5,108.6 237.7,115.2" fill="#2C4A40"/><text x="180" y="214" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">السرعة</text><text x="180" y="262" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="600" direction="rtl">ثم نرسم السرعة مع العزم، والتيار مع العزم</text></svg>`,
   cap:'متغيران فقط في هذه التجربة: جهد المصدر والعزم، ونراقب السرعة.<br><b>مرّر المؤشر على الرموز والعداد (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p class="ltr" style="text-align:left">Speed-torque characteristic of a DC shunt motor</p><ul><li>معرفة أثر جهد المصدر (V<sub>in</sub>) والعزم (T) على سرعة المحرك ثم رسم منحنيات الخواص لمحرك التوازي عند تحميله، مثل منحنى السرعة مع العزم، والتيار مع العزم.</li></ul>`,ref:'ص 29'}
   ],
   body:[
    {predict:{q:'لماذا لا يوجد في هذه التجربة جزء «نغيّر فيه تيار المجال» كما في التجربة الخامسة؟',opts:[
     ['لأن تيار المجال لا يؤثر على السرعة في محرك التوازي',false,'المجال يؤثر على السرعة في كل محركات التيار المستمر.'],
     ['لأن المجال موصل على مصدر المنتج نفسه، فلا نغيّره وحده إلا بتغيير جهد المصدر',true,'في مخطط الشكل (6) لا توجد مقاومة للمجال ولا مصدر خاص له؛ تيار المجال يتبع جهد المصدر.'],
     ['لأن محرك التوازي ليس له ملف مجال',false,'له ملف مجال E1–E2 موصل على التوازي مع المنتج.']]}},
    {tip:String.raw`<p>في محرك التوازي ملف المجال على التوازي مع المنتج على نفس المصدر، فتيار المجال \(I_f = V_{in}/R_f\) (حيث \(R_f\) مقاومة ملف المجال) ثابت ما دام الجهد ثابتاً. ولذلك:</p><ul><li>مع ثبات الجهد يبقى المجال ثابتاً تقريباً، وزيادة الحمل تنقص السرعة قليلاً فقط.</li><li>عند تغيير الجهد يتغير المجال معه أيضاً.</li></ul>`,title:'الفكرة قبل أن تبدأ'},
    {title:'مختبر مصغّر: التوازي مقابل منفصل التغذية',widget:(el,B)=>DCML.lab(el,B,{intro:'لا حمل. غيّر جهد المصدر وقارن: في المحرك منفصل التغذية تيار المجال ثابت <span class="ltr">0.3 A</span>، وفي محرك التوازي \\(I_f=V_{in}\\div R_f\\).',
 predict:{q:'في محرك التوازي رفعت \\(V_{in}\\). تيار المجال:',opts:[
  ['يبقى ثابتاً لأنه لا مصدر خاص له',false,'المجال على المصدر نفسه، فتياره يتبع جهد المصدر.'],
  ['يزيد مع الجهد',true,'\\(I_f=V_{in}\\div R_f\\) و\\(R_f\\) ثابتة؛ لذلك لا نستطيع تغيير المجال وحده في هذه التجربة.'],
  ['يقل',false,'الجهد الأعلى يدفع تياراً أكبر في الملف نفسه.']]},
 ins:[{k:'V',l:'جهد المصدر V<sub>in</sub>',seg:[[60,'60'],[80,'80'],[100,'100'],[120,'120'],[140,'140 V']],v:120}],
 tp:{id:'u2-dcm',defs:motorDefs('shunt')},
 calc:(s,v,B)=>{const nOf=(V,If)=>{const k=Mod.kphi(v,If),kt=k*60/(2*PI);return Math.max(0,(kt*V/v.Ra-v.Tf0)/(kt*k/v.Ra+v.Tv/1000))};const Ifs=s.V/v.Rf;
  return {facts:[['I<sub>f</sub> في محرك التوازي',DCML.fm(B,Ifs,3)+' A','hi'],['I<sub>f</sub> في منفصل التغذية','0.3 A'],['سرعة محرك التوازي',DCML.fm(B,nOf(s.V,Ifs),0)+' rpm','hi'],['سرعة منفصل التغذية',DCML.fm(B,nOf(s.V,0.3),0)+' rpm']]}}})}
   ]},

  {st:2,short:'الأجهزة',title:'الأجهزة المستخدمة',ref:'ص 29',
   q:'ست أجهزة في القائمة… هل تكفي لتسجيل كل صفوف الجدول؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الأجهزة الستة في قائمة الكتاب: مصدر قدرة، وموحد تيار مستمر، ومحرك توازي، وجهاز الفرملة، وفولتميتر، وجهاز قياس السرعة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="146" fill="#FBE6C4"/><g data-tip="مصدر القدرة: يغذي الدائرة."><rect x="14" y="34" width="92" height="100" fill="transparent"/><rect x="16" y="36" width="88" height="68" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.4"/><circle cx="60" cy="68" r="16" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.4"/><path d="M51.2 68 q4.3 -8.0 8.8 0 t8.8 0" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><text x="60" y="124" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="rtl">مصدر قدرة</text></g><g data-tip="الموحد: يحول التيار المتردد إلى تيار مستمر يغذي المحرك."><rect x="134" y="34" width="92" height="100" fill="transparent"/><rect x="136" y="36" width="88" height="68" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.4"/><path d="M156 68 H172 M188 68 H204" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><polygon points="172,57 172,79 188,68" fill="#2C4A40"/><path d="M188 57 V79" fill="none" stroke="#2C4A40" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><text x="180" y="124" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="rtl">موحد تيار مستمر</text></g><g data-tip="محرك تيار مستمر توازي (في الكتاب طُبع «توالي»، والمخطط محرك توازي)."><rect x="254" y="34" width="92" height="100" fill="transparent"/><rect x="256" y="36" width="88" height="68" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.4"/><circle cx="300" cy="68" r="20" fill="#CFE6DB" stroke="#2C4A40" stroke-width="3"/><text x="300" y="75" text-anchor="middle" font-size="20" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">M</text><text x="300" y="124" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="rtl">محرك توازي</text></g><g data-tip="جهاز الفرملة ⟦Brake⟧: يحمّل المحرك بعزم ⟦T⟧ نضبطه."><rect x="14" y="146" width="92" height="100" fill="transparent"/><rect x="16" y="148" width="88" height="68" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.4"/><rect x="34" y="165" width="52" height="30" rx="6" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.4"/><text x="60" y="185" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Brake</text><text x="60" y="236" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="rtl">جهاز الفرملة</text></g><g data-tip="الفولتميتر ⟦V⟧: يقيس جهد المصدر ⟦Vin⟧."><rect x="134" y="146" width="92" height="100" fill="transparent"/><rect x="136" y="148" width="88" height="68" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.4"/><circle cx="180" cy="180" r="17" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.2"/><text x="180" y="184.68" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">V</text><text x="180" y="236" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="rtl">الفولتميتر</text></g><g data-tip="جهاز قياس السرعة: يقرأ ⟦n⟧ بالـ ⟦rpm⟧."><rect x="254" y="146" width="92" height="100" fill="transparent"/><rect x="256" y="148" width="88" height="68" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.4"/><path d="M276 192 A24 24 0 0 1 324 192" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M300 192 L293.0 179.9" fill="none" stroke="#2C4A40" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="300" cy="192" r="6" fill="#2C4A40"/><text x="300" y="236" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="rtl">قياس السرعة</text></g></svg>`,
   cap:'أجهزة القائمة الستة بترتيب الكتاب.<br><b>مرّر المؤشر على كل جهاز (أو المسه في الجوال) لتعرف دوره.</b>',
   side:[
    {book:String.raw`<ol><li>مصدر قدرة.</li><li>موحد تيار مستمر.</li><li>محرك تيار مستمر توازي.</li><li>جهاز الفرملة.</li><li>جهاز الفولتميتر.</li><li>جهاز قياس السرعة.</li></ol>`,ref:'ص 29'}
   ],
   body:[
    {predict:{q:'الجدولان يطلبان تسجيل \\(I_a\\). أي جهاز يلزم لذلك وليس في القائمة؟',opts:[
     ['واتميتر',false,'لا نقيس القدرة في هذه التجربة.'],
     ['أميتر في خط المنتج',true,'الأميتر A موجود في مخطط التوصيل (6) لكنه غير مذكور في القائمة.'],
     ['مقاومة بدء',false,'لا توجد مقاومة بدء في المخطط؛ نرفع الجهد تدريجياً بدلاً منها.']]}},
    {tip:String.raw`<p>«مصدر قدرة» + «موحد تيار مستمر» معاً يعطيان الجهد المستمر المتغير \(V_{in}\): المصدر متردد، والموحد يحوّله إلى مستمر.</p>`},
    {watch:String.raw`<p>في الكتاب طُبع البند 3 «محرك تيار مستمر توالي»، والصحيح «توازي» كما في المخطط وعنوان التجربة.</p>`,fix:true},
    {title:'تحقق سريع: قائمة الأجهزة',widget:(el,B)=>DCML.tf(el,B,{items:[
 ['قائمة الأجهزة في الكتاب فيها أميتر لتسجيل \\(I_a\\).',false,'الأميتر موجود في مخطط الشكل (6) لكنه غير مذكور في القائمة.'],
 ['«مصدر قدرة» و«موحد تيار مستمر» معاً يعطيان الجهد المستمر المتغير \\(V_{in}\\).',true,'المصدر متردد، والموحد يحوّله إلى مستمر.'],
 ['جهاز الفرملة هو الذي يضع العزم T على عمود المحرك.',true,'«ثبت العزم الواقع على المحرك بواسطة جهاز العزم» (ص 29).']]})}
   ]},

  {st:3,short:'مخطط التوصيل',title:'مخطط التوصيل: الشكل <span class="ltr">(6)</span>',ref:'ص 29',
   q:'الأميتر موضوع بعد نقطة تفرع المجال… فأي تيار يقرأ بالضبط؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مخطط توصيل محرك التوازي كما في الشكل 6: ملف المجال E1–E2 يتفرع من الخطين قبل الأميتر، والأميتر يقيس تيار المنتج" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="165" r="150" fill="#DDEFE6"/><g data-tip="مصدر جهد مستمر متغير لدائرة المنتج ⟦Vin 0-250 V DC⟧: نرفع جهده تدريجياً من الصفر."><rect x="18" y="88" width="66" height="94" rx="8" fill="#F1EBDD" stroke="#2C4A40" stroke-width="2.4"/><text x="51" y="118" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">V<tspan font-size="10" dy="4">in</tspan><tspan dy="-4">​</tspan></text><text x="51" y="140" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">0-250 V</text><text x="51" y="158" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">DC</text></g><text x="70" y="82" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">+</text><text x="70" y="196" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">−</text><path d="M51 88 V58 H236 V105" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M51 182 V212 H236 V165" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M104 58 V120 M104 150 V212" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="104" cy="58" r="3.5" fill="#2C4A40"/><circle cx="104" cy="212" r="3.5" fill="#2C4A40"/><g data-tip="الفولتميتر ⟦V⟧: موصل على التوازي بين الخطين، يقرأ جهد المصدر ⟦Vin⟧."><circle cx="104" cy="135" r="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.2"/><text x="104" y="139.68" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">V</text></g><g data-tip="الأميتر ⟦A⟧: على التوالي في خط المنتج، يقرأ تيار المنتج ⟦Ia⟧ فقط، لأنه بعد نقطة تفرع المجال."><circle cx="200" cy="58" r="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.2"/><text x="200" y="62.68" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">A</text></g><path d="M166 44 L181.0 44.0" fill="none" stroke="#E8735A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polygon points="188,44 181.0,47.5 181.0,40.5" fill="#E8735A"/><text x="177" y="38" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">I<tspan font-size="8" dy="4">a</tspan><tspan dy="-4">​</tspan></text><circle cx="154" cy="58" r="3.5" fill="#2C4A40"/><circle cx="154" cy="212" r="3.5" fill="#2C4A40"/><path d="M154 58 V99" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M154 171 V212" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="ملف المجال ⟦E1–E2⟧ موصل على التوازي مع المنتج على نفس المصدر، فتيار المجال ⟦If⟧ = جهد المصدر ÷ مقاومة الملف."><rect x="130" y="95" width="48" height="80" fill="transparent"/><path d="M154 99 A7.2 7.2 0 0 1 154 113.4 A7.2 7.2 0 0 1 154 127.8 A7.2 7.2 0 0 1 154 142.2 A7.2 7.2 0 0 1 154 156.6 A7.2 7.2 0 0 1 154 171.0" fill="none" stroke="#E8735A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><text x="138" y="109" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">E1</text><text x="138" y="169" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">E2</text></g><path d="M176 105 L176.0 120.0" fill="none" stroke="#E8735A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polygon points="176,127 172.5,120.0 179.5,120.0" fill="#E8735A"/><text x="178" y="143" text-anchor="start" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">I<tspan font-size="8" dy="4">f</tspan><tspan dy="-4">​</tspan></text><g data-tip="المحرك ⟦M⟧: أطراف المنتج ⟦1B1⟧ و⟦2B2⟧."><circle cx="236" cy="135" r="30" fill="#CFE6DB" stroke="#2C4A40" stroke-width="3"/><text x="236" y="142" text-anchor="middle" font-size="20" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">M</text><text x="198" y="109" text-anchor="end" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">1B1</text><text x="198" y="169" text-anchor="end" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">2B2</text></g><path d="M266 135 H330" fill="none" stroke="#9AA59F" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="التاكومتر وعداد السرعة ⟦Speed⟧: يقيسان سرعة الدوران ⟦n⟧ باللفة في الدقيقة ⟦rpm⟧."><rect x="276" y="121" width="28" height="28" rx="5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="290" y="140" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n</text></g><g data-tip="جهاز الفرملة ⟦Brake⟧: يحمّل المحرك، ويُضبط عليه العزم ⟦T⟧ مباشرة بالنيوتن·متر ⟦N.m⟧."><rect x="310" y="111" width="40" height="48" rx="6" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.4"/><text x="330" y="132" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Br</text><text x="330" y="148" text-anchor="middle" font-size="9" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">N.m</text></g></svg>`,
   cap:'مبسّط عن الشكل <span class="ltr">(6)</span>: ملف المجال يتفرع من الخطين قبل الأميتر.<br><b>مرّر المؤشر على الأجهزة والملف (أو المسها في الجوال) لتعرف اسم كل منها ودوره.</b>',
   side:[
    {predict:{q:'الأميتر A في الشكل (6) يقرأ:',opts:[
     ['تيار المصدر الكلي \\(I_a + I_f\\)',false,'لو كان قبل نقطة التفرع لقرأ التيار الكلي؛ لكنه بعدها.'],
     ['تيار المجال فقط',false,'تيار المجال لا يمر في الأميتر، بل ينزل في فرع E1–E2.'],
     ['تيار المنتج \\(I_a\\) فقط',true,'لأنه في خط المنتج بعد نقطة تفرع المجال.']]}}
   ],
   body:[
    {tip:String.raw`<p>اتبع التيار من القطب الموجب: يمر بالفولتميتر (على التوازي)، ثم يصل إلى <b>نقطة التفرع</b>: جزء ينزل في ملف المجال <span class="ltr">E1–E2</span> إلى الخط السالب، والباقي يمر في الأميتر <span class="ltr">A</span> إلى المنتج <span class="ltr">1B1–2B2</span>. على العمود عداد السرعة وجهاز الفرملة. لا توجد مقاومة للمجال ولا أميتر له، ولا مقاومة بدء.</p>`,title:'اقرأ المخطط'},
    {add:String.raw`<p>محركات التوازي شائعة في الأماكن التي تحتاج سرعة شبه ثابتة مهما تغير الحمل، مثل مخارط الورش والمراوح الكبيرة والسيور الناقلة.</p>`},
    {title:'مختبر مصغّر: انقل الأميتر',widget:(el,B)=>DCML.lab(el,B,{intro:'<span class="ltr">V<sub>in</sub> = 120 V</span> وعزم الفرملة <span class="ltr">0.2 N.m</span>. ضع الأميتر قبل نقطة تفرع المجال أو بعدها، وقارن قراءته.',
 predict:{q:'لو نقلنا الأميتر إلى ما <b>قبل</b> نقطة تفرع المجال، فإن قراءته:',opts:[
  ['تبقى كما هي',false,'قبل التفرع يمر في الأميتر تيار المنتج وتيار المجال معاً.'],
  ['تزيد بمقدار تيار المجال \\(I_f\\)',true,'قبل التفرع يقرأ التيار الكلي من المصدر \\(I_a+I_f\\)؛ في الشكل (6) هو بعد التفرع فيقرأ \\(I_a\\) فقط.'],
  ['تصبح صفراً',false,'التيار يمر فيه في الحالتين.']]},
 ins:[{k:'p',l:'مكان الأميتر A',seg:[['after','بعد نقطة التفرع (كما في الشكل 6)'],['before','قبل نقطة التفرع']],v:'after'}],
 tp:{id:'u2-dcm',defs:motorDefs('shunt')},
 calc:(s,v,B)=>{const If=120/v.Rf,k=Mod.kphi(v,If),kt=k*60/(2*PI),n=Math.max(0,(kt*120/v.Ra-0.2-v.Tf0)/(kt*k/v.Ra+v.Tv/1000)),Ia=(120-k*n)/v.Ra,rd=s.p==='after'?Ia:Ia+If;
  return {pic:DCML.gauge(B,{v:rd,max:Math.max(Ia+If,0.01)*1.3,lab:'A',txt:DCML.fm(B,rd,3)+' A'}),facts:[['تيار المنتج I<sub>a</sub>',DCML.fm(B,Ia,3)+' A'],['تيار المجال I<sub>f</sub>',DCML.fm(B,If,3)+' A'],['قراءة الأميتر',DCML.fm(B,rd,3)+' A','hi']],
   msg:s.p==='after'?'الأميتر يقرأ \\(I_a\\) وحده: هذا ما يطلبه الجدولان.':'الأميتر يقرأ الآن \\(I_a+I_f\\) — ليس هذا ما يطلبه صف \\(I_a\\) في الجدول.',cls:s.p==='after'?'':'warn'}}})}
   ]},

  {st:4,short:'أولاً: أثر الجهد',title:'خطوات التجربة — أولاً: أثر جهد المصدر',ref:'ص 29–30',
   q:'عندما نرفع جهد المصدر يقوى المجال أيضاً… فهل تزيد السرعة بنفس نسبة الجهد؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="خطوات أولاً: العزم صفر، ونرفع جهد المصدر 60 ثم 80 ثم 100 ثم 120 ثم 140 فولت ونسجل السرعة والتيار" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><rect x="72" y="171.1" width="30" height="54.9" rx="4" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.6"/><text x="87.0" y="242" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">60</text><rect x="116" y="152.9" width="30" height="73.1" rx="4" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.6"/><text x="131.0" y="242" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">80</text><rect x="160" y="134.6" width="30" height="91.4" rx="4" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.6"/><text x="175.0" y="242" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">100</text><rect x="204" y="116.3" width="30" height="109.7" rx="4" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.6"/><text x="219.0" y="242" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">120</text><rect x="248" y="98.0" width="30" height="128.0" rx="4" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.6"/><text x="263.0" y="242" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">140</text><path d="M64 226 H286" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><text x="87" y="163.14285714285714" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n?</text><text x="131" y="144.85714285714286" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n?</text><text x="175" y="126.57142857142856" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n?</text><text x="219" y="108.28571428571429" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n?</text><text x="263" y="90.0" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n?</text><text x="60" y="250" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr"></text><text x="180" y="262" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">V<tspan font-size="9" dy="4">in</tspan><tspan dy="-4">​</tspan> (V)</text><g data-tip="شرط ثابت: لا حمل على المحرك."><rect x="67.5" y="50.6" width="85.0" height="22.8" rx="11.4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.6"/><text x="110" y="66.32" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T = 0 N.m</text></g></svg>`,
   cap:'خمس قيم للجهد من الجدول <span class="ltr">(6-1)</span>.<br><b>مرّر المؤشر على الشرط في الأعلى (أو المسه في الجوال) لتعرف معناه.</b>',
   side:[
    {book:String.raw`<p><b>أولاً:</b></p><ol><li>صل التجربة كما هو موضح في شكل (6).</li><li>ثبت العزم الواقع على المحرك بواسطة جهاز العزم عند قيمة قدرها T = 0 N.m.</li><li>قم بتغيير قيم جهد المصدر \(V_{in}\) ومن ثم قم بتسجيل قيمة السرعة n وكذلك التيار \(I_a\) وذلك حسب الجدول (6-1):</li></ol>`,ref:'ص 29–30'}
   ],
   body:[
    {book:String.raw`${tableHTML(TB['6-1'])}`,ref:'ص 30'},
    {predict:{q:'رفعنا الجهد من <span class="ltr">60 V</span> إلى <span class="ltr">120 V</span> (ضعف الجهد). السرعة في محرك التوازي:',opts:[
     ['تزيد، لكن أقل من الضعف',true,'الجهد الأعلى يرفع السرعة، لكنه يقوّي المجال أيضاً، والمجال الأقوى يخفّض السرعة؛ فتكون الزيادة أبطأ من زيادة الجهد.'],
     ['تتضاعف تماماً',false,'هذا أقرب لما يحدث في المحرك منفصل التغذية حيث المجال ثابت.'],
     ['تقل',false,'زيادة الجهد لا تخفض السرعة.']]}},
    {tip:String.raw`<p>قارن جدولك <span class="ltr">(6-1)</span> بجدول <span class="ltr">(5-1)</span> من التجربة الخامسة: هناك كان المجال ثابتاً فتبعت السرعة الجهد مباشرة، وهنا يتغير المجال مع الجهد.</p>`},
    {title:'مختبر مصغّر: نقاط الجدول (6-1)',widget:(el,B)=>DCML.lab(el,B,{intro:'<span class="ltr">T = 0</span>. اختر \\(V_{in}\\) من الجدول واقرأ النقطة. النقاط الرمادية للمقارنة: المحرك نفسه لو كان مجاله منفصلاً ثابتاً عند <span class="ltr">0.3 A</span> (التجربة الخامسة).',
 ins:[{k:'V',l:'جهد المصدر V<sub>in</sub>',seg:[[60,'60'],[80,'80'],[100,'100'],[120,'120'],[140,'140 V']],v:60}],
 tp:{id:'u2-dcm',defs:motorDefs('shunt')},
 calc:(s,v,B)=>{const nOf=(V,If)=>{const k=Mod.kphi(v,If),kt=k*60/(2*PI);return Math.max(0,(kt*V/v.Ra-v.Tf0)/(kt*k/v.Ra+v.Tv/1000))};const L=[60,80,100,120,140],sh=L.map(V=>[nOf(V,V/v.Rf),V]),sp=L.map(V=>[nOf(V,0.3),V]),n=nOf(s.V,s.V/v.Rf),k=Mod.kphi(v,s.V/v.Rf);
  const xm=Math.ceil(Math.max(...sh.map(p=>p[0]),...sp.map(p=>p[0]))*1.1/250)*250;
  return {facts:[['السرعة n',DCML.fm(B,n,0)+' rpm','hi'],['I<sub>a</sub>',DCML.fm(B,(s.V-k*n)/v.Ra,3)+' A'],['I<sub>f</sub> = V<sub>in</sub> ÷ R<sub>f</sub>',DCML.fm(B,s.V/v.Rf,3)+' A']],
   plot:{xr:[0,xm],yr:[0,160],xl:'n (rpm)',yl:'V<tspan font-size="9" dy="3">in</tspan><tspan dy="-3"> (V)</tspan>',curves:[{pts:sp,col:'--muted',dash:'4 4'},{pts:sh,col:'--blue'}],dots:sp.map(p=>[p[0],p[1],'--muted']),cur:[n,s.V]},
   msg:'السرعة تزيد مع الجهد، لكن أقل من نسبة زيادته: الجهد الأعلى يقوي المجال أيضاً.'}}})}
   ]},

  {st:5,short:'ثانياً: أثر الحمل',title:'خطوات التجربة — ثانياً: أثر العزم (الحمل)',ref:'ص 30',
   q:'لماذا يسمى محرك التوازي «ثابت السرعة»؟ جدول هذا الجزء يعطيك الجواب.',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="خطوات ثانياً: جهد المصدر 120 فولت، ونرفع العزم من صفر إلى 0.4 نيوتن متر ونسجل السرعة والتيار" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><rect x="72" y="219.6" width="30" height="6.4" rx="4" fill="#F2C14E" stroke="#2C4A40" stroke-width="1.6"/><text x="87.0" y="242" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">0</text><rect x="116" y="194.0" width="30" height="32.0" rx="4" fill="#F2C14E" stroke="#2C4A40" stroke-width="1.6"/><text x="131.0" y="242" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">0.1</text><rect x="160" y="162.0" width="30" height="64.0" rx="4" fill="#F2C14E" stroke="#2C4A40" stroke-width="1.6"/><text x="175.0" y="242" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">0.2</text><rect x="204" y="130.0" width="30" height="96.0" rx="4" fill="#F2C14E" stroke="#2C4A40" stroke-width="1.6"/><text x="219.0" y="242" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">0.3</text><rect x="248" y="98.0" width="30" height="128.0" rx="4" fill="#F2C14E" stroke="#2C4A40" stroke-width="1.6"/><text x="263.0" y="242" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">0.4</text><path d="M64 226 H286" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><text x="87" y="211.6" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n?</text><text x="131" y="186.0" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n?</text><text x="175" y="154.0" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n?</text><text x="219" y="122.0" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n?</text><text x="263" y="90.0" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n?</text><text x="60" y="250" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr"></text><text x="180" y="262" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T (N.m)</text><g data-tip="شرط ثابت: جهد المصدر ⟦Vin = 120 V⟧، فتيار المجال ثابت أيضاً."><rect x="60.1" y="50.6" width="99.8" height="22.8" rx="11.4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.6"/><text x="110" y="66.32" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">V<tspan font-size="8" dy="4">in</tspan><tspan dy="-4">​</tspan> = 120 V</text></g></svg>`,
   cap:'خمس قيم للعزم من الجدول <span class="ltr">(6-2)</span> والجهد ثابت.<br><b>مرّر المؤشر على الشرط في الأعلى (أو المسه في الجوال) لتعرف معناه.</b>',
   side:[
    {book:String.raw`<p><b>ثانياً:</b></p><ol><li>ثبت جهد المصدر Vin = 120 V.</li><li>ثم قم بتغيير قيم العزم T وفي كل مرة قم بتسجيل قيمة السرعة n والتيار \(I_a\) وذلك حسب الجدول (6-2):</li></ol>`,ref:'ص 30'}
   ],
   body:[
    {book:String.raw`${tableHTML(TB['6-2'])}`,ref:'ص 30'},
    {predict:{q:'مع زيادة العزم من <span class="ltr">0</span> إلى <span class="ltr">0.4 N.m</span> والجهد ثابت، تيار المجال:',opts:[
     ['يزيد مع الحمل',false,'تيار المجال = جهد المصدر ÷ مقاومة الملف، ولا علاقة له بالحمل.'],
     ['يبقى ثابتاً تقريباً',true,'الجهد ثابت فالمجال ثابت؛ لذلك تقل السرعة قليلاً فقط ويزيد تيار المنتج.'],
     ['يقل إلى الصفر',false,'المجال موصل على المصدر طوال الوقت.']]}},
    {watch:String.raw`<p>الجدول الثاني مسمى تحته في الكتاب «جدول (5-3)»، والصحيح «جدول (6-2)» كما في نص الخطوة.</p>`,fix:true},
    {title:'مختبر مصغّر: شُدّ الفرملة (الجدول 6-2)',widget:(el,B)=>DCML.lab(el,B,{intro:'<span class="ltr">V<sub>in</sub> = 120 V</span>. غيّر العزم بقيم الجدول، وراقب السرعة وتيار المنتج وتيار المجال.',
 predict:{q:'من <span class="ltr">T = 0</span> إلى <span class="ltr">T = 0.4 N.m</span>، كم تهبط سرعة محرك التوازي تقريباً؟',opts:[
  ['إلى النصف',false,'هذا سلوك محرك التوالي؛ مجال التوازي ثابت فالهبوط صغير.'],
  ['بنسبة صغيرة (بضعة في المئة)',true,'المجال ثابت (الجهد ثابت)، فلا يُنقص السرعة إلا هبوط \\(I_aR_a\\) الصغير — لهذا يُسمى «ثابت السرعة».'],
  ['لا تهبط أبداً',false,'تهبط قليلاً، لأن جزءاً من الجهد يضيع على مقاومة المنتج.']]},
 ins:[{k:'T',l:'عزم الفرملة T',seg:[[0,'0'],[0.1,'0.1'],[0.2,'0.2'],[0.3,'0.3'],[0.4,'0.4 N.m']],v:0}],
 tp:{id:'u2-dcm',defs:motorDefs('shunt')},
 calc:(s,v,B)=>{const If=120/v.Rf,k=Mod.kphi(v,If),kt=k*60/(2*PI),nOf=T=>Math.max(0,(kt*120/v.Ra-T-v.Tf0)/(kt*k/v.Ra+v.Tv/1000)),n=nOf(s.T),n0=nOf(0),pts=[0,0.1,0.2,0.3,0.4].map(T=>[nOf(T),T]);
  return {facts:[['السرعة n',DCML.fm(B,n,0)+' rpm','hi'],['هبوط السرعة عن <span class="ltr">T = 0</span>',DCML.fm(B,(n0-n)/n0*100,1)+' %'],['I<sub>a</sub>',DCML.fm(B,(120-k*n)/v.Ra,2)+' A'],['I<sub>f</sub> (ثابت)',DCML.fm(B,If,3)+' A']],
   plot:{xr:[Math.floor(pts[4][0]*0.97/20)*20,Math.ceil(n0*1.01/20)*20],yr:[0,0.45],xl:'n (rpm)',yl:'T (N.m)',yt:[0,0.1,0.2,0.3,0.4],curves:[{pts:pts.slice().reverse()}],dots:pts.map(p=>[p[0],p[1],'--muted']),cur:[n,s.T]},
   msg:'لاحظ أن المحور الأفقي لا يبدأ من الصفر حتى يظهر الهبوط الصغير، كما في التوضيح أعلاه.'}}})}
   ]},

  {st:6,short:'منحنى العلاقة',title:'منحنى العلاقة وعكس اتجاه الدوران',ref:'ص 30–31',
   q:'شبكتان فقط… وطلب إضافي: اعكس اتجاه الدوران بنفسك. كيف؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="شبكتان فارغتان كما في الكتاب: جهد المصدر مع السرعة، والعزم مع السرعة، ورمز عكس اتجاه الدوران" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><g data-tip="الشبكة الأولى: ⟦Vin⟧ رأسي و⟦n⟧ أفقي — من الجدول ⟦(6-1)⟧."><rect x="192" y="42" width="150" height="128" fill="transparent"/><rect x="196" y="64" width="120" height="86" fill="#FBF6EE"/><path d="M196 85.5 H316" stroke="#D9D2C2" stroke-width="1"/><path d="M226.0 64 V150" stroke="#D9D2C2" stroke-width="1"/><path d="M196 107.0 H316" stroke="#D9D2C2" stroke-width="1"/><path d="M256.0 64 V150" stroke="#D9D2C2" stroke-width="1"/><path d="M196 128.5 H316" stroke="#D9D2C2" stroke-width="1"/><path d="M286.0 64 V150" stroke="#D9D2C2" stroke-width="1"/><path d="M196 58 V150 H322" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><text x="200" y="54" text-anchor="start" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">V<tspan font-size="8" dy="4">in</tspan><tspan dy="-4">​</tspan>(v)</text><text x="316" y="166" text-anchor="end" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n(rpm)</text></g><g data-tip="الشبكة الثانية: ⟦T⟧ رأسي و⟦n⟧ أفقي — من الجدول ⟦(6-2)⟧."><rect x="48" y="42" width="150" height="128" fill="transparent"/><rect x="52" y="64" width="120" height="86" fill="#FBF6EE"/><path d="M52 85.5 H172" stroke="#D9D2C2" stroke-width="1"/><path d="M82.0 64 V150" stroke="#D9D2C2" stroke-width="1"/><path d="M52 107.0 H172" stroke="#D9D2C2" stroke-width="1"/><path d="M112.0 64 V150" stroke="#D9D2C2" stroke-width="1"/><path d="M52 128.5 H172" stroke="#D9D2C2" stroke-width="1"/><path d="M142.0 64 V150" stroke="#D9D2C2" stroke-width="1"/><path d="M52 58 V150 H178" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><text x="56" y="54" text-anchor="start" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T(N.m)</text><text x="172" y="166" text-anchor="end" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n(rpm)</text></g><g data-tip="المطلوب 2: عكس اتجاه الدوران بعد توقف المحرك — بعكس أطراف المجال أو أطراف المنتج."><rect x="140" y="196" width="80" height="96" fill="transparent"/><path d="M154 236 a26 26 0 1 1 52 0" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><polygon points="206,244 198,230 214,230" fill="#2C4A40"/><text x="180" y="284" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">عكس اتجاه الدوران</text></g></svg>`,
   cap:'شبكتا الكتاب كما طُبعتا، والسهم المنحني لعكس الاتجاه.<br><b>مرّر المؤشر على كل شبكة والسهم (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<ol><li>ارسم منحنيات الخواص من النتائج التي حصلت عليها ثم ناقش المنحنيات مستعيناً بدراستك النظرية.</li><li>حاول بنفسك أن تعكس اتجاه الدوران للمحرك (بعد توقف المحرك).</li></ol>`,ref:'ص 30–31'}
   ],
   body:[
    {predict:{q:'عكسنا قطبي المصدر (الموجب مكان السالب). اتجاه دوران محرك التوازي:',opts:[
     ['ينعكس',false,'عكس المصدر يعكس تيار المجال وتيار المنتج معاً، فيبقى الاتجاه.'],
     ['لا يتغير',true,'لعكس الاتجاه اعكس أطراف المجال E1–E2 أو أطراف المنتج، لا الاثنين ولا المصدر.'],
     ['يتوقف المحرك',false,'المحرك يدور في الاتجاه نفسه.']]}},
    {tip:String.raw`<p>شبكة \(T\) مع \(n\): نقاطها متقاربة جداً على محور السرعة لأن السرعة تتغير قليلاً. اختر مقياساً للمحور الأفقي لا يبدأ من الصفر حتى يظهر الهبوط. والغرض يذكر «التيار مع العزم» ولا شبكة له؛ يرسمه المختبر من الجدول <span class="ltr">(6-2)</span>.</p>`},
    {watch:String.raw`<p>على شبكة العزم طُبع «T(nm)» والصحيح <span class="ltr">T (N.m)</span>.</p>`,fix:true},
    {title:'مختبر مصغّر: اعكس اتجاه الدوران',widget:(el,B)=>DCML.lab(el,B,{intro:'جرّب ما تعكسه (بعد توقف المحرك كما يطلب الكتاب) وشاهد اتجاه الدوران.',
 predict:{q:'عكست أطراف المنتج <span class="ltr">1B1–2B2</span> فقط. اتجاه الدوران:',opts:[
  ['ينعكس',true,'العزم يعتمد على اتجاه المجال واتجاه تيار المنتج؛ عكس أحدهما فقط يعكس الدوران.'],
  ['لا يتغير',false,'لا يبقى الاتجاه إلا إذا عكست الاثنين معاً (أو عكست قطبي المصدر).'],
  ['يتوقف المحرك',false,'المحرك يدور، لكن في الاتجاه المعاكس.']]},
 ins:[{k:'f',sw:true,l:'',on:'أطراف المجال E1–E2: معكوسة',off:'أطراف المجال E1–E2: كما في الشكل',v:0},{k:'a',sw:true,l:'',on:'أطراف المنتج 1B1–2B2: معكوسة',off:'أطراف المنتج 1B1–2B2: كما في الشكل',v:0},{k:'p',sw:true,l:'',on:'قطبا المصدر: معكوسان',off:'قطبا المصدر: كما في الشكل',v:0}],
 calc:(s,v,B)=>{const fl=(s.f?-1:1)*(s.p?-1:1),ia=(s.a?-1:1)*(s.p?-1:1),d=fl*ia;
  const P=a=>[120+52*Math.cos(a*Math.PI/180),80+52*Math.sin(a*Math.PI/180)],[sx,sy]=P(d>0?160:20),[ex,ey]=P(d>0?20:160),ta=(d>0?20+90:160-90)*Math.PI/180,hx=ex+12*Math.cos(ta),hy=ey+12*Math.sin(ta),nx=-Math.sin(ta)*7,ny=Math.cos(ta)*7,f=x=>x.toFixed(1);
  return {pic:`<svg viewBox="0 0 240 170" role="img" aria-label="اتجاه الدوران" style="max-width:240px;display:block;margin-inline:auto"><circle cx="120" cy="80" r="34" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2"/><text x="120" y="86" text-anchor="middle" font-size="18" font-weight="700" fill="var(--fg)" font-family="var(--mono)">M</text><path d="M${f(sx)} ${f(sy)}A52 52 0 1 ${d>0?1:0} ${f(ex)} ${f(ey)}" fill="none" stroke="var(--blue)" stroke-width="4"/><polygon points="${f(hx)},${f(hy)} ${f(ex+nx)},${f(ey+ny)} ${f(ex-nx)},${f(ey-ny)}" fill="var(--blue)"/><text x="120" y="160" text-anchor="middle" font-size="14" font-weight="700" fill="var(${d>0?'--fg':'--stop'})" direction="rtl">${d>0?'الاتجاه الأصلي':'الاتجاه معكوس'}</text></svg>`,
   facts:[['اتجاه تيار المجال',fl>0?'+':'−'],['اتجاه تيار المنتج',ia>0?'+':'−'],['اتجاه الدوران',d>0?'+':'−',d>0?'hi':'bad']],
   msg:s.p&&!s.f&&!s.a?'عكس قطبي المصدر يعكس التيارين معاً، فيبقى الاتجاه كما هو.':s.f&&s.a&&!s.p?'عكست المجال والمنتج معاً: رجع الاتجاه كما كان.':''}}})}
   ]},

  {st:7,short:'الأسئلة',title:'الأسئلة: الحمل، ثبات السرعة، وفصل المجال فجأة',ref:'ص 31',
   q:'محرك توازي يعمل… وفجأة انقطع سلك ملف المجال. ماذا يحدث؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="محرك التوازي وملف المجال مقطوع فجأة: السرعة ترتفع إلى المنطقة الحمراء" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><g data-tip="خط المنتج: يبقى موصلاً بالمصدر."><path d="M40 70 H300 M40 230 H300" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></g><g data-tip="ملف المجال ⟦E1–E2⟧ انفصل فجأة (العلامة الحمراء): يبقى المغناطيس المتبقي فقط."><rect x="66" y="68" width="50" height="166" fill="transparent"/><path d="M90 110 A8.0 8.0 0 0 1 90 126.0 A8.0 8.0 0 0 1 90 142.0 A8.0 8.0 0 0 1 90 158.0 A8.0 8.0 0 0 1 90 174.0 A8.0 8.0 0 0 1 90 190.0" fill="none" stroke="#E8735A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M90 70 V84 M90 216 V230" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M80 90 L100 106 M100 90 L80 106" fill="none" stroke="#E8735A" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></g><circle cx="150" cy="150" r="28" fill="#CFE6DB" stroke="#2C4A40" stroke-width="3"/><text x="150" y="157" text-anchor="middle" font-size="20" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">M</text><path d="M150 70 V122 M150 178 V230" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="عداد السرعة: إذا كان المحرك بلا حمل ترتفع السرعة إلى قيمة خطيرة (جموح). وبحمل يرتفع تيار المنتج كثيراً."><rect x="190" y="100" width="136" height="76" fill="transparent"/><path d="M194 170 A64 64 0 0 1 322 170" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M313.4 138.0 A64 64 0 0 1 322 170" fill="none" stroke="#E8735A" stroke-width="8"/><path d="M258 170 L304.8 143.0" fill="none" stroke="#2C4A40" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="258" cy="170" r="6" fill="#2C4A40"/><text x="258" y="147.6" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n</text></g><text x="258" y="206" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">السرعة</text><text x="180" y="276" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="600" direction="rtl">السؤالان ج و د: ماذا يحدث؟</text></svg>`,
   cap:'ملف المجال انقطع (العلامة الحمراء) والمنتج ما زال على المصدر.<br><b>مرّر المؤشر على الملف والعداد (أو المسهما في الجوال) لتعرف ما يحدث.</b>',
   side:[
    {book:String.raw`<p>بعد الانتهاء من التجربة يمكنك الإجابة على الأسئلة التالية:</p><ul style="list-style:none;padding-inline-start:0"><li>أ. ما هو تأثير زيادة الحمل على كل من تيار المنتج والعزم المتولد وتيار المجال والسرعة لمحرك التوازي؟</li><li>ب. لماذا يعتبر محرك التوازي من المحركات ثابتة السرعة؟</li><li>ج. ما هو تأثير الفصل المفاجئ لملف المجال في حالة ما يكون المحرك في حالة تحميل؟</li><li>د. ما هو تأثير الفصل المفاجئ لملف المجال إذا كان المحرك يعمل عند اللاحمل؟</li><li>هـ. إذا طلب منك الاختيار بين محركين متشابهين في جميع الصفات غير أن معامل التنظيم لأحدهما 5% والآخر 20% فأيهما تختار؟</li></ul>`,ref:'ص 31'}
   ],
   body:[
    {title:'فصل المجال فجأة: بحمل أو بدون حمل',widget:(el,B)=>{
      const C={load:['انفصل ملف المجال','بقي المغناطيس المتبقي الضعيف فقط','يحتاج المحرك تياراً كبيراً جداً ليعطي عزم الحمل','يرتفع تيار المنتج كثيراً فيسخن المنتج ويتلف إن لم تفصل الحماية'],
       noload:['انفصل ملف المجال','بقي المغناطيس المتبقي الضعيف فقط','قلّ الجهد العكسي ولا حمل يمسك المحرك','ترتفع السرعة ارتفاعاً خطيراً (جموح) قد يتلف المحرك ميكانيكياً']};
      let k='load',tm=[];
      const draw=()=>{const S=C[k];el.innerHTML=`<p class="sub" style="margin:0 0 10px">اختر الحالة ثم اضغط «افصل المجال» (توضيح منا للسؤالين ج و د، ليس من الكتاب).</p><div class="w-row" style="margin-top:0"><span class="mseg"><button type="button" data-k="load" aria-pressed="${k==='load'}" style="font-family:var(--font)">بحمل (السؤال ج)</button><button type="button" data-k="noload" aria-pressed="${k==='noload'}" style="font-family:var(--font)">بلا حمل (السؤال د)</button></span></div><div class="chain" style="margin-top:10px">${S.map((s,i)=>`<span class="ck${i===S.length-1?' end':''}">${s}</span>${i<S.length-1?'<span class="ar">←</span>':''}`).join('')}</div><div class="w-row"><button class="btn pri" type="button" data-go>افصل المجال</button><button class="btn" type="button" data-rs>إعادة</button></div>`;
        const ks=[...el.querySelectorAll('.ck')];const rs=()=>{tm.forEach(clearTimeout);tm=[];ks.forEach(x=>x.classList.remove('on'))};
        el.querySelector('[data-go]').onclick=()=>{rs();ks.forEach((x,i)=>tm.push(setTimeout(()=>x.classList.add('on'),i*600)))};el.querySelector('[data-rs]').onclick=rs;
        el.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{tm.forEach(clearTimeout);k=b.dataset.k;draw()})};
      draw();}},
    {predict:{q:'السؤال هـ: محركان متشابهان، معامل تنظيم أحدهما 5% والآخر 20%. لسرعة شبه ثابتة نختار:',opts:[
     ['ذا المعامل 20%',false,'المعامل الأكبر يعني هبوطاً أكبر في السرعة عند التحميل.'],
     ['لا فرق بينهما',false,'معامل التنظيم هو بالضبط ما يفرّق بينهما في ثبات السرعة.'],
     ['ذا المعامل 5%',true,'كلما صغر معامل التنظيم قلّ تغير السرعة بين اللاحمل والحمل الكامل.']]}},
    {add:String.raw`<p>الكتاب لا يعرّف «معامل التنظيم». التعريف المعتاد لمعامل تنظيم السرعة: (سرعة اللاحمل − سرعة الحمل الكامل) ÷ سرعة الحمل الكامل × 100%. تجد حاسبته في تبويب «الأمثلة المحلولة»، وتستطيع أن تطبقه على جدولك <span class="ltr">(6-2)</span>.</p>`,title:'معامل تنظيم السرعة'},
    {tip:String.raw`${Q('أ.','أثر زيادة الحمل','تيار المنتج يزيد، والعزم المتولد يزيد حتى يساوي الحمل مع الاحتكاك، وتيار المجال يبقى ثابتاً تقريباً (الجهد ثابت)، والسرعة تقل قليلاً فقط.')}
     ${Q('ب.','لماذا ثابت السرعة؟','لأن مجاله ثابت تقريباً (على جهد ثابت)، والهبوط في مقاومة المنتج صغير مقارنة بالجهد، فلا تقل السرعة من اللاحمل إلى الحمل الكامل إلا بنسبة صغيرة.')}`,title:'إجابات مقترحة (ليست من الكتاب) — اضغط السؤال لتظهر'}
   ]},

  {recap:[
   String.raw`محرك التوازي: ملف المجال \(E1–E2\) على التوازي مع المنتج على المصدر نفسه، والأميتر بعد نقطة التفرع يقرأ \(I_a\) فقط، الشكل (6) (ص 29).`,
   String.raw`زيادة \(V_{in}\) ترفع السرعة، لكن أبطأ من المحرك منفصل التغذية لأن المجال يقوى مع الجهد (الجدول 6-1).`,
   String.raw`مع ثبات \(V_{in}=120\ \text{V}\): زيادة العزم تزيد \(I_a\) وتنقص السرعة قليلاً فقط، فهو محرك «ثابت السرعة» (الجدول 6-2، السؤال ب).`,
   String.raw`الفصل المفاجئ للمجال خطير: بحمل يرتفع التيار كثيراً، وبلا حمل تجمح السرعة (السؤالان ج و د، ص 31).`]}
],
 theory:[
  {h:'التجربة السادسة: منحنى خواص السرعة مع العزم لمحرك التوازي',ref:'ص 29',html:'<p class="ltr" style="text-align:left">Speed-torque characteristic of a DC shunt motor</p><p><b>الأهداف:</b></p><ul><li>معرفة أثر جهد المصدر (V<sub>in</sub>) والعزم (T) على سرعة المحرك ثم رسم منحنيات الخواص لمحرك التوازي عند تحميله، مثل منحنى السرعة مع العزم، والتيار مع العزم.</li></ul>'},
  {note:`<b>توضيح للمتدرب — ليس من الكتاب:</b> في محرك التوازي ملف المجال على التوازي مع المنتج على نفس المصدر، فتيار المجال \\(I_f = V_{in}/R_f\\) ثابت ما دام الجهد ثابتاً. لذلك:
   <ul><li>مع ثبات الجهد يبقى المجال ثابتاً تقريباً، وزيادة الحمل تزيد \\(I_a\\) وتنقص السرعة قليلاً فقط (\\(n = \\frac{V_{in}-I_aR_a}{k\\phi}\\)): محرك «ثابت السرعة».</li>
   <li>عند تغيير الجهد يتغير المجال معه، فلا تزيد السرعة بنفس نسبة الجهد كما في المحرك منفصل التغذية؛ زيادتها أبطأ، خصوصاً قبل التشبع.</li>
   <li>تيار المصدر = \\(I_a + I_f\\)، لكن الأميتر A في الشكل (6) بعد نقطة التفرع فيقرأ \\(I_a\\) فقط.</li></ul>`},
  {h:'الأجهزة المستخدمة',ref:'ص 29',html:'<ol><li>مصدر قدرة.</li><li>موحد تيار مستمر.</li><li>محرك تيار مستمر توازي.</li><li>جهاز الفرملة.</li><li>جهاز الفولتميتر.</li><li>جهاز قياس السرعة.</li></ol><p class="sub">ويلزم أيضاً أميتر لتيار المنتج (موجود في المخطط).</p>'},
  {fig:'(6)',ref:'ص 29',caption:'مخطط توصيل محرك التوازي: بعد الفولتميتر نقطة تفرع ينزل منها ملف المجال E1–E2 مباشرة إلى الخط السالب (بلا مقاومة مجال ولا أميتر مجال)، ثم الأميتر A في خط المنتج إلى 1B1–2B2. على العمود تاكومتر وجهاز فرملة.',draw:()=>box(figSVG('shunt',{static:1}),760,1)},
  {h:'خطوات التجربة',ref:'ص 29–30',html:`<p><b>أولاً:</b></p><ol><li>صل التجربة كما هو موضح في شكل (6).</li><li>ثبت العزم الواقع على المحرك بواسطة جهاز العزم عند قيمة قدرها <span class="ltr">T = 0 N.m</span>.</li><li>قم بتغيير قيم جهد المصدر \\(V_{in}\\) ومن ثم قم بتسجيل قيمة السرعة n وكذلك التيار \\(I_a\\) وذلك حسب الجدول (6-1):</li></ol>${tableHTML(TB['6-1'])}
   <p style="margin-top:14px"><b>ثانياً:</b></p><ol><li>ثبت جهد المصدر <span class="ltr">Vin = 120 V</span>.</li><li>ثم قم بتغيير قيم العزم T وفي كل مرة قم بتسجيل قيمة السرعة n والتيار \\(I_a\\) وذلك حسب الجدول (6-2):</li></ol>${tableHTML(TB['6-2'])}`},
  {h:'منحنى العلاقة',ref:'ص 30–31',html:'<ol><li>ارسم منحنيات الخواص من النتائج التي حصلت عليها ثم ناقش المنحنيات مستعيناً بدراستك النظرية.</li><li>حاول بنفسك أن تعكس اتجاه الدوران للمحرك (بعد توقف المحرك).</li></ol><p>في الكتاب شبكتان: المحور الرأسي <span class="ltr">Vin (v)</span> والأفقي <span class="ltr">n (rpm)</span> (من الجدول 6-1)؛ والمحور الرأسي <span class="ltr">T (N.m)</span> والأفقي <span class="ltr">n (rpm)</span> (من الجدول 6-2). أضفنا في المختبر منحنى \\(I_a\\) مع T (إضافة من خارج الكتاب: الغرض يذكره ولا شبكة له).</p>'},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب (عكس الاتجاه):</b> اعكس أطراف المجال <b>أو</b> أطراف المنتج. أما عكس قطبي المصدر فلا يعكس محرك التوازي، لأنه يعكس تيار المجال وتيار المنتج معاً.'},
  {h:'الأسئلة',ref:'ص 31',html:`<p>«بعد الانتهاء من التجربة يمكنك الإجابة على الأسئلة التالية:»</p>
   ${Q('أ.','ما هو تأثير زيادة الحمل على كل من تيار المنتج والعزم المتولد وتيار المجال والسرعة لمحرك التوازي؟','تيار المنتج يزيد، والعزم المتولد يزيد حتى يساوي الحمل مع الاحتكاك، وتيار المجال يبقى ثابتاً تقريباً (لأنه \\(V_{in}/R_f\\) والجهد ثابت)، والسرعة تقل قليلاً فقط (جدولك 6-2).')}
   ${Q('ب.','لماذا يعتبر محرك التوازي من المحركات ثابتة السرعة؟','لأن مجاله ثابت تقريباً (موصل على جهد ثابت)، والهبوط في مقاومة المنتج \\(I_aR_a\\) صغير مقارنة بالجهد، فلا تقل السرعة من اللاحمل إلى الحمل الكامل إلا بنسبة صغيرة (بضعة في المائة).')}
   ${Q('ج.','ما هو تأثير الفصل المفاجئ لملف المجال في حالة ما يكون المحرك في حالة تحميل؟','يبقى المجال المتبقي فقط، فيحتاج المحرك تياراً كبيراً جداً ليعطي عزم الحمل: يرتفع تيار المنتج ارتفاعاً كبيراً فيسخن المنتج ويتلف إن لم تفصل الحماية، وقد ترتفع السرعة أو يقف المحرك حسب الحمل.')}
   ${Q('د.','ما هو تأثير الفصل المفاجئ لملف المجال إذا كان المحرك يعمل عند اللاحمل؟','ترتفع السرعة ارتفاعاً خطيراً (جموح) لأن المجال يكاد يختفي ولا يوجد حمل يحد السرعة، وقد يتلف المحرك ميكانيكياً (المنتج والمبدل) إن لم تفصل الحماية.')}
   ${Q('هـ.','إذا طلب منك الاختيار بين محركين متشابهين في جميع الصفات غير أن معامل التنظيم لأحدهما 5% والآخر 20% فأيهما تختار؟','أختار المحرك ذا معامل التنظيم <b>5%</b> إذا كان المطلوب سرعة ثابتة تقريباً، لأن سرعته تتغير مع الحمل أقل. (معامل تنظيم السرعة = (سرعة اللاحمل − سرعة الحمل الكامل) ÷ سرعة الحمل الكامل × 100% — إضافة من خارج الكتاب، وله حاسبة في «الأمثلة المحلولة».)')}`},
  {err:`<div class="fixnote"><b>ملاحظات على الكتاب (التجربة السادسة):</b><ol style="margin:6px 0 0;padding-inline-start:20px">
   <li>قائمة الأجهزة (ص 29) تقول «محرك تيار مستمر توالي» والصحيح «توازي» كما في المخطط — صُحح أعلاه.</li>
   <li>الأميتر غير مذكور في قائمة الأجهزة رغم وجوده في المخطط.</li>
   <li>الجدول الثاني (ص 30) مسمى تحته «جدول (5-3)» والصحيح «جدول (6-2)» كما في نص الخطوة — صُحح.</li>
   <li>على شبكة المنحنى «T(nm)» والصحيح <span class="ltr">T (N.m)</span>، وعلى جهاز الفرملة «m.N».</li>
   <li>في السؤال هـ: «لأحدهم» والصحيح «لأحدهما» — صُحح.</li>
   <li>معامل التنظيم في السؤال هـ لم يُعرَّف في الكتاب؛ أضفنا تعريفه (إضافة من خارج الكتاب).</li></ol></div>`}
 ],
 lab:(el)=>bench(el,{type:'shunt',prefix:'d6',fig:'(6)',figRef:'ص 29',benchTitle:'منضدة محرك التوازي',
  benchNote:'اختر الجزء (أولاً / ثانياً)، تحقق من الشرط الأخضر، غيّر المتغير إلى قيم الجدول، وسجّل بعد أن تستقر السرعة.',
  partNames:['أولاً','ثانياً'],tables:['6-1','6-2'],
  meterNote:'الأميتر A بعد نقطة تفرع المجال فيقرأ تيار المنتج فقط. عند T = 0 لا يكون I<sub>a</sub> صفراً بسبب الاحتكاك والتهوية. العزم المقروء هو عزم الفرملة.',
  runaway:'مجال محرك التوازي انقطع أو ضعف، فارتفعت السرعة بلا حد. أعد توصيل ملف المجال، ثم اضبط الحماية وشغّل من جهد صغير.',
  overspeed:'انتبه: لا ترفع الجهد أكثر.',
  plotRef:'ص 30',
  plots:[{tab:'6-1',x:'n',y:'Vin',xl:'n (rpm)',yl:'Vin (V)',cap:'V<sub>in</sub> مع n — الجدول (6-1)',dx:[0,1500],dy:[0,150]},
   {tab:'6-2',x:'n',y:'T',xl:'n (rpm)',yl:'T (N.m)',cap:'T مع n — الجدول (6-2)',dx:[0,1500],dy:[0,0.5]},
   {tab:'6-2',x:'T',y:'Ia',xl:'T (N.m)',yl:'Ia (A)',cap:'I<sub>a</sub> مع T — الجدول (6-2) (إضافة من خارج الكتاب)',dx:[0,0.5],dy:[0,1]}],
  plotNote:'محور السرعة في منحنى T مع n لا يبدأ من الصفر (العلامة «≠0») حتى يظهر الهبوط الصغير في السرعة.',
  steps:EXP6_STEPS}),
 examples:[
  {title:'معامل تنظيم السرعة (إضافة من خارج الكتاب)',ref:'السؤال هـ ص 31',q:'<p>السؤال (هـ) يذكر «معامل التنظيم» دون قانون. القانون المعتاد: نسبة الهبوط في السرعة من اللاحمل إلى الحمل الكامل منسوبة إلى سرعة الحمل الكامل. ضع سرعتيك من الجدول (6-2): السرعة عند T = 0 والسرعة عند أكبر حمل. <b>الأرقام توضيحية.</b></p>',
   given:[{id:'n0',label:'السرعة عند اللاحمل',sym:'n_0',unit:'rpm',value:1500},{id:'nf',label:'السرعة عند الحمل الكامل',sym:'n_{fl}',unit:'rpm',value:1450}],
   solve:(g,B)=>[{t:'الهبوط في السرعة:',f:`n_0-n_{fl}=${fm(g.n0)}-${fm(g.nf)}`,v:B.round(g.n0-g.nf,1),unit:'rpm',dp:1},
    {t:'معامل تنظيم السرعة:',f:`SR=\\frac{n_0-n_{fl}}{n_{fl}}\\times100\\%`,v:g.nf>0?B.round((g.n0-g.nf)/g.nf*100,2):'—',unit:'%',dp:2,final:true}],
   note:'كلما صغر معامل التنظيم كان المحرك أقرب إلى ثبات السرعة. محرك التوازي: بضعة في المائة فقط.'}
 ],
 quiz:[
  {q:'في الشكل (6) يوصل ملف المجال E1–E2:',o:['على التوالي مع المنتج','على التوازي مع المنتج على نفس المصدر','بمصدر منفصل','بين التاكومتر والفرملة'],c:1,e:'الشكل (6) ص 29: فرع المجال من نقطة التفرع إلى الخط السالب.'},
  {q:'الأميتر A في الشكل (6) يقيس:',o:['تيار المصدر الكلي','تيار المنتج فقط','تيار المجال فقط','لا يقيس شيئاً'],c:1,e:'لأنه بعد نقطة تفرع المجال.'},
  {q:'عند زيادة الحمل على محرك التوازي (Vin ثابت):',o:['تقل السرعة كثيراً','تقل السرعة قليلاً ويزيد Ia ويبقى If ثابتاً','يزيد If','تزيد السرعة'],c:1,e:'السؤال أ ص 31.'},
  {q:'لماذا يسمى محرك التوازي «ثابت السرعة»؟',o:['لأن له مقاومة بدء','لأن مجاله ثابت تقريباً والهبوط IaRa صغير','لأنه بلا احتكاك','لأن تياره صفر'],c:1,e:'السؤال ب.'},
  {q:'الفصل المفاجئ لملف المجال ومحرك التوازي بلا حمل يؤدي إلى:',o:['توقف المحرك بهدوء','ارتفاع خطير في السرعة','نقص التيار','لا شيء'],c:1,e:'السؤال د.'},
  {q:'محركان متشابهان، معامل تنظيم أحدهما 5% والآخر 20%. للحصول على سرعة شبه ثابتة نختار:',o:['20%','5%','لا فرق','أي واحد بشرط زيادة الجهد'],c:1,e:'السؤال هـ: تنظيم أصغر = سرعة أثبت.'},
  {q:'كيف نعكس اتجاه دوران محرك التوازي؟',o:['بعكس قطبي المصدر','بعكس أطراف المجال أو أطراف المنتج (بعد توقف المحرك)','بزيادة الحمل','بتقليل الجهد'],c:1,e:'ص 31. عكس المصدر يعكس التيارين معاً فلا يتغير الاتجاه.'},
  {q:'في الجدول (6-1) عند رفع Vin من 60 إلى 140 V تزيد السرعة:',o:['بنفس نسبة الجهد تماماً','أبطأ من نسبة الجهد، لأن المجال يقوى مع الجهد أيضاً','لا تتغير أبداً','تقل'],c:1,e:'تيار المجال = Vin/Rf يزيد مع الجهد (توضيح).'}
 ]
});

/* =====================================================================
   Lesson 2.3 — التجربة السابعة: محرك التوالي
   ===================================================================== */
const EXP7_STEPS=c=>[
 {t:'حاول التشغيل بلا حمل',x:'اترك الفرملة على <span class="ltr">T = 0</span> واضغط «تشغيل المصدر»: يمنع المختبر التشغيل ويشرح السبب. الكتاب: «يجب أن يكون المحرك محملاً قبل بدء الحركة» (ص 33).',done:()=>c.did.blocked},
 {t:`حمّل المحرك ثم شغّل`,x:`اضبط الفرملة على <span class="ltr">T = ${EXP7_TMIN} N.m</span> (أصغر حمل)، والجهد على الصفر، ثم شغّل وارفع V<sub>in</sub> تدريجياً.`,done:()=>c.running()&&c.s.T>=EXP7_TMIN-1e-9},
 {t:'أولاً — جدول (7-1)',x:`اختر «أولاً». مع <span class="ltr">T = ${EXP7_TMIN} N.m</span> اضبط V<sub>in</sub> على 20 ثم 40 ثم 60 ثم 80 ثم 100 V وسجّل كل مرة.`,done:()=>c.full('7-1')},
 {t:'ثانياً — جدول (7-2)',x:`اختر «ثانياً». ثبّت <span class="ltr">Vin = 100 V</span> وغيّر العزم ${EXP7_TMIN} ← 0.2 ← 0.3 ← 0.4 N.m وسجّل كل مرة: السرعة تقل كثيراً مع الحمل، والتيار يزيد. (عمود T = 0 لا يُسجَّل.)`,done:()=>c.full('7-2')},
 {get t(){return 'جموح محرك التوالي'},get x(){return `والمحرك يعمل على ${lt('Vin = 100 V')}، خفّض الفرملة تدريجياً تحت ${lt(EXP7_TMIN+' N.m')} نحو الصفر: ترتفع السرعة بسرعة حتى تتجاوز ${lt(fm(c.v().nMax,0)+' rpm')} فتفصل الحماية. هذا ما يحدث لمحرك توالي يفقد حمله.`},done:()=>c.did.runaway}
];
B.lesson({
 id:'u2-l3',unit:2,order:3,pages:'32–34',
 title:'التجربة السابعة: منحنى خواص السرعة مع العزم لمحرك التوالي',
 summary:'محرك التوالي: ملف المجال على التوالي مع المنتج فيمر فيهما نفس التيار. عزم كبير عند السرعات المنخفضة، وسرعة تهبط كثيراً مع الحمل، وخطر الجموح بلا حمل. منضدة افتراضية للجدولين (7-1) و(7-2) تمنع التشغيل بدون حمل.',
 stations:[
  {intro:true},

  {st:1,short:'الغرض',title:'الغرض من التجربة السابعة',ref:'ص 32',
   q:'محرك التوالي يُستعمل في القطارات والرافعات… فما الذي يميز منحنياته عن محرك التوازي؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="جهد المصدر والعزم يؤثران على سرعة محرك التوالي" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><g data-tip="عداد السرعة ⟦n⟧: نراقب كيف تتغير السرعة."><rect x="100" y="96" width="160" height="90" fill="transparent"/><path d="M100 180 A80 80 0 0 1 260 180" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M249.3 140.0 A80 80 0 0 1 260 180" fill="none" stroke="#E8735A" stroke-width="8"/><path d="M180 180 L147.1 118.2" fill="none" stroke="#2C4A40" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="180" cy="180" r="6" fill="#2C4A40"/><text x="180" y="152.0" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n</text></g><g data-tip="جهد المصدر ⟦Vin⟧ — الجزء «أولاً»."><rect x="45.0" y="68.1" width="62.0" height="23.8" rx="11.9" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.6"/><text x="76" y="84.5" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">V<tspan font-size="9" dy="4">in</tspan><tspan dy="-4">​</tspan></text></g><g data-tip="العزم ⟦T⟧ من جهاز الفرملة — الجزء «ثانياً»."><rect x="259.0" y="68.1" width="50.0" height="23.8" rx="11.9" fill="#F2C14E" stroke="#2C4A40" stroke-width="1.6"/><text x="284" y="84.5" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T</text></g><path d="M104 92 L125.4 111.9" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><polygon points="132,118 122.3,115.2 128.5,108.6" fill="#2C4A40"/><path d="M256 92 L234.6 111.9" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><polygon points="228,118 231.5,108.6 237.7,115.2" fill="#2C4A40"/><text x="180" y="214" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">السرعة</text><text x="180" y="262" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="600" direction="rtl">ثم نرسم السرعة مع العزم، والتيار مع العزم</text></svg>`,
   cap:'المتغيران نفسهما كما في التجربة السادسة: جهد المصدر والعزم.<br><b>مرّر المؤشر على الرموز والعداد (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p class="ltr" style="text-align:left">Speed-torque characteristic of a DC series motor</p><ul><li>معرفة أثر جهد المصدر (V<sub>in</sub>) والعزم (T) على سرعة المحرك ثم رسم منحنيات الخواص لمحرك التوالي عند تحميله، مثل منحنى السرعة مع العزم، والتيار مع العزم.</li></ul>`,ref:'ص 32'}
   ],
   body:[
    {tip:String.raw`<p>في محرك التوالي يمر <b>تيار المنتج نفسه</b> في ملف المجال <span class="ltr">D1–D2</span>، فالمجال يتبع الحمل:</p><ul><li><b>حمل كبير</b> ← تيار كبير ← مجال قوي ← عزم كبير جداً وسرعة منخفضة.</li><li><b>حمل صغير</b> ← تيار صغير ← مجال ضعيف ← سرعة عالية.</li></ul>`,title:'الفكرة قبل أن تبدأ'},
    {predict:{q:'في محرك التوالي، إذا قلّ الحمل كثيراً، ماذا يحدث للمجال؟',opts:[
     ['يبقى ثابتاً لأن الجهد ثابت',false,'هذا في محرك التوازي. في التوالي المجال يأخذ تيار المنتج نفسه.'],
     ['يقوى',false,'الحمل الأقل يعني تياراً أقل، فالمجال يضعف لا يقوى.'],
     ['يضعف، لأن تيار المنتج (وهو تيار المجال) يقل',true,'ومع المجال الضعيف ترتفع السرعة؛ لهذا يجب أن يبقى محرك التوالي محملاً.']]}},
    {watch:String.raw`<p>في الكتاب طُبع الغرض «لمحرك التوازي» (منقول من التجربة السادسة)، والصحيح «لمحرك التوالي».</p>`,fix:true},
    {title:'مختبر مصغّر: المجال يتبع الحمل',widget:(el,B)=>DCML.lab(el,B,{intro:'<span class="ltr">V<sub>in</sub> = 100 V</span>. غيّر الحمل وقارن تيار المجال في محرك التوالي (هو تيار المنتج نفسه) بمحرك التوازي (ثابت).',
 predict:{q:'زاد الحمل من <span class="ltr">0.1</span> إلى <span class="ltr">0.4 N.m</span>. مجال محرك التوالي:',opts:[
  ['يقوى، لأن تيار المنتج (وهو تيار المجال) يزيد',true,'المجال في التوالي يتبع الحمل؛ لهذا تهبط سرعته كثيراً ويكبر عزمه.'],
  ['يبقى ثابتاً لأن الجهد ثابت',false,'هذا في محرك التوازي، حيث \\(I_f=V_{in}\\div R_f\\).'],
  ['يضعف',false,'الحمل الأكبر يحتاج تياراً أكبر، والتيار نفسه يمر في ملف المجال.']]},
 ins:[{k:'T',l:'عزم الفرملة T',seg:[[0.1,'0.1'],[0.2,'0.2'],[0.3,'0.3'],[0.4,'0.4 N.m']],v:0.1}],
 tp:{id:'u2-dcm',defs:motorDefs('series')},
 calc:(s,v,B)=>{const V=100,R=v.Ra+v.Rse,f=n=>{const I=Mod.seriesIa(v,V,n,R);return Mod.kphi(v,v.aSe*I)*60/(2*PI)*I-(s.T+v.Tf0+v.Tv*n/1000)};let lo=0,hi=60000;if(f(0)<=0)hi=0;for(let i=0;i<60;i++){const m=(lo+hi)/2;if(f(m)>0)lo=m;else hi=m}
  const n=lo,Ia=Mod.seriesIa(v,V,n,R),Ifs=V/v.Rf,ks=Mod.kphi(v,Ifs),kt=ks*60/(2*PI),nsh=Math.max(0,(kt*V/v.Ra-s.T-v.Tf0)/(kt*ks/v.Ra+v.Tv/1000));
  return {facts:[['التوالي: تيار المجال = I<sub>a</sub>',DCML.fm(B,Ia,3)+' A','hi'],['التوالي: السرعة',DCML.fm(B,n,0)+' rpm','hi'],['التوازي: تيار المجال',DCML.fm(B,Ifs,3)+' A'],['التوازي: السرعة',DCML.fm(B,nsh,0)+' rpm']],
   bars:[{l:'مجال التوالي (تيار المجال المكافئ)',v:v.aSe*Ia,max:Math.max(v.aSe*v.IaN,Ifs)*1.2,txt:DCML.fm(B,v.aSe*Ia,3)+' A',col:'--live'},{l:'مجال التوازي',v:Ifs,max:Math.max(v.aSe*v.IaN,Ifs)*1.2,txt:DCML.fm(B,Ifs,3)+' A',col:'--blue'}]}}})}
   ]},

  {st:2,short:'الأجهزة',title:'الأجهزة المستخدمة',ref:'ص 32',
   q:'القائمة نفسها تقريباً كما في التجربة السادسة… فما الذي تغيّر؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الأجهزة الستة في قائمة الكتاب: مصدر قدرة، وموحد تيار مستمر، ومحرك توالي، وجهاز الفرملة، وفولتميتر، وجهاز قياس السرعة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="146" fill="#FBE6C4"/><g data-tip="مصدر القدرة: يغذي الدائرة."><rect x="14" y="34" width="92" height="100" fill="transparent"/><rect x="16" y="36" width="88" height="68" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.4"/><circle cx="60" cy="68" r="16" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.4"/><path d="M51.2 68 q4.3 -8.0 8.8 0 t8.8 0" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><text x="60" y="124" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="rtl">مصدر قدرة</text></g><g data-tip="الموحد: يحول التيار المتردد إلى تيار مستمر يغذي المحرك."><rect x="134" y="34" width="92" height="100" fill="transparent"/><rect x="136" y="36" width="88" height="68" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.4"/><path d="M156 68 H172 M188 68 H204" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><polygon points="172,57 172,79 188,68" fill="#2C4A40"/><path d="M188 57 V79" fill="none" stroke="#2C4A40" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><text x="180" y="124" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="rtl">موحد تيار مستمر</text></g><g data-tip="محرك تيار مستمر توازي (في الكتاب طُبع «توالي»، والمخطط محرك توالي)."><rect x="254" y="34" width="92" height="100" fill="transparent"/><rect x="256" y="36" width="88" height="68" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.4"/><circle cx="300" cy="68" r="20" fill="#CFE6DB" stroke="#2C4A40" stroke-width="3"/><text x="300" y="75" text-anchor="middle" font-size="20" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">M</text><text x="300" y="124" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="rtl">محرك توالي</text></g><g data-tip="جهاز الفرملة ⟦Brake⟧: يحمّل المحرك بعزم ⟦T⟧ نضبطه."><rect x="14" y="146" width="92" height="100" fill="transparent"/><rect x="16" y="148" width="88" height="68" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.4"/><rect x="34" y="165" width="52" height="30" rx="6" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.4"/><text x="60" y="185" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Brake</text><text x="60" y="236" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="rtl">جهاز الفرملة</text></g><g data-tip="الفولتميتر ⟦V⟧: يقيس جهد المصدر ⟦Vin⟧."><rect x="134" y="146" width="92" height="100" fill="transparent"/><rect x="136" y="148" width="88" height="68" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.4"/><circle cx="180" cy="180" r="17" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.2"/><text x="180" y="184.68" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">V</text><text x="180" y="236" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="rtl">الفولتميتر</text></g><g data-tip="جهاز قياس السرعة: يقرأ ⟦n⟧ بالـ ⟦rpm⟧."><rect x="254" y="146" width="92" height="100" fill="transparent"/><rect x="256" y="148" width="88" height="68" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.4"/><path d="M276 192 A24 24 0 0 1 324 192" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M300 192 L293.0 179.9" fill="none" stroke="#2C4A40" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="300" cy="192" r="6" fill="#2C4A40"/><text x="300" y="236" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="rtl">قياس السرعة</text></g></svg>`,
   cap:'أجهزة القائمة الستة بترتيب الكتاب.<br><b>مرّر المؤشر على كل جهاز (أو المسه في الجوال) لتعرف دوره.</b>',
   side:[
    {book:String.raw`<ol><li>مصدر قدرة.</li><li>موحد تيار مستمر.</li><li>محرك تيار مستمر توالي.</li><li>جهاز الفرملة.</li><li>جهاز الفولتميتر.</li><li>جهاز قياس السرعة.</li></ol>`,ref:'ص 32'}
   ],
   body:[
    {predict:{q:'ما الجهاز الذي اختلف عن قائمة التجربة السادسة؟',opts:[
     ['جهاز الفرملة',false,'الفرملة موجودة في التجربتين لتحميل المحرك.'],
     ['المحرك: توالي بدلاً من توازي',true,'بقية الأجهزة نفسها؛ الذي تغيّر هو طريقة توصيل ملف المجال.'],
     ['الفولتميتر',false,'الفولتميتر يقيس جهد المصدر في التجربتين.']]}},
    {watch:String.raw`<p>الأميتر غير مذكور في القائمة رغم وجوده في مخطط التوصيل، ونحتاجه لصف \(I_a\) في الجدولين.</p>`,fix:true},
    {title:'تحقق سريع: الأجهزة',widget:(el,B)=>DCML.tf(el,B,{items:[
 ['الفرق الوحيد عن قائمة التجربة السادسة هو نوع المحرك: توالي.',true,'بقية البنود نفسها: مصدر قدرة، موحد، فرملة، فولتميتر، قياس سرعة.'],
 ['القائمة تذكر الأميتر الذي نقرأ منه \\(I_a\\).',false,'الأميتر في مخطط التوصيل (7) وغير مذكور في القائمة.']]})}
   ]},

  {st:3,short:'مخطط التوصيل',title:'مخطط التوصيل: الشكل <span class="ltr">(7)</span>',ref:'ص 32',
   q:'لا يوجد في المخطط أميتر للمجال… فكيف نعرف تيار ملف التوالي؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مخطط توصيل محرك التوالي كما في الشكل 7: ملف التوالي D1–D2 ثم الأميتر ثم المنتج على خط واحد" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="165" r="150" fill="#F7DCC8"/><g data-tip="مصدر جهد مستمر متغير لدائرة المنتج ⟦Vin 0-250 V DC⟧: نرفع جهده تدريجياً من الصفر."><rect x="18" y="88" width="66" height="94" rx="8" fill="#F1EBDD" stroke="#2C4A40" stroke-width="2.4"/><text x="51" y="118" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">V<tspan font-size="10" dy="4">in</tspan><tspan dy="-4">​</tspan></text><text x="51" y="140" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">0-250 V</text><text x="51" y="158" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">DC</text></g><text x="70" y="82" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">+</text><text x="70" y="196" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">−</text><path d="M51 88 V58 H128" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="ملف التوالي ⟦D1–D2⟧: على التوالي مع المنتج، فيمر فيه تيار المنتج نفسه."><rect x="124" y="38" width="64" height="48" fill="transparent"/><path d="M128 58 A7.0 7.0 0 0 1 142.0 58 A7.0 7.0 0 0 1 156.0 58 A7.0 7.0 0 0 1 170.0 58 A7.0 7.0 0 0 1 184.0 58" fill="none" stroke="#E8735A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><text x="132" y="80" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">D1</text><text x="182" y="80" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">D2</text></g><path d="M184 58 H236 V105" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M51 182 V212 H236 V165" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M104 58 V120 M104 150 V212" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="104" cy="58" r="3.5" fill="#2C4A40"/><circle cx="104" cy="212" r="3.5" fill="#2C4A40"/><g data-tip="الفولتميتر ⟦V⟧: موصل على التوازي بين الخطين، يقرأ جهد المصدر ⟦Vin⟧."><circle cx="104" cy="135" r="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.2"/><text x="104" y="139.68" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">V</text></g><g data-tip="الأميتر ⟦A⟧: على التوالي في خط المنتج، يقرأ تيار المنتج ⟦Ia⟧، وهو نفسه تيار ملف التوالي."><circle cx="210" cy="58" r="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.2"/><text x="210" y="62.68" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">A</text></g><path d="M176 44 L191.0 44.0" fill="none" stroke="#E8735A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polygon points="198,44 191.0,47.5 191.0,40.5" fill="#E8735A"/><text x="187" y="38" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">I<tspan font-size="8" dy="4">a</tspan><tspan dy="-4">​</tspan></text><g data-tip="المحرك ⟦M⟧: أطراف المنتج ⟦1B1⟧ و⟦2B2⟧."><circle cx="236" cy="135" r="30" fill="#CFE6DB" stroke="#2C4A40" stroke-width="3"/><text x="236" y="142" text-anchor="middle" font-size="20" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">M</text><text x="198" y="109" text-anchor="end" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">1B1</text><text x="198" y="169" text-anchor="end" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">2B2</text></g><path d="M266 135 H330" fill="none" stroke="#9AA59F" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="التاكومتر وعداد السرعة ⟦Speed⟧: يقيسان سرعة الدوران ⟦n⟧ باللفة في الدقيقة ⟦rpm⟧."><rect x="276" y="121" width="28" height="28" rx="5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="290" y="140" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n</text></g><g data-tip="جهاز الفرملة ⟦Brake⟧: يحمّل المحرك، ويُضبط عليه العزم ⟦T⟧ مباشرة بالنيوتن·متر ⟦N.m⟧."><rect x="310" y="111" width="40" height="48" rx="6" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.4"/><text x="330" y="132" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">Br</text><text x="330" y="148" text-anchor="middle" font-size="9" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">N.m</text></g></svg>`,
   cap:'مبسّط عن الشكل <span class="ltr">(7)</span>: ملف التوالي والأميتر والمنتج على خط واحد.<br><b>مرّر المؤشر على الأجهزة والملف (أو المسها في الجوال) لتعرف اسم كل منها ودوره.</b>',
   side:[
    {predict:{q:'الأميتر A يقرأ <span class="ltr">0.5 A</span>. كم تيار ملف التوالي D1–D2؟',opts:[
     ['صفر، لأن الملف لا يمر فيه تيار',false,'الملف في طريق التيار الوحيد من المصدر إلى المنتج.'],
     ['<span class="ltr">0.5 A</span> أيضاً',true,'الدائرة مسار واحد: التيار نفسه يمر في ملف التوالي والأميتر والمنتج.'],
     ['لا يمكن معرفته بلا أميتر خاص',false,'في الدائرة المتوالية التيار واحد في كل أجزائها.']]}}
   ],
   body:[
    {tip:String.raw`<p>على الخط الموجب على التوالي: ملف التوالي <span class="ltr">D1–D2</span>، ثم الأميتر <span class="ltr">A</span>، ثم المنتج <span class="ltr">1B1–2B2</span>، ثم يعود إلى الخط السالب. الفولتميتر بين الخطين، وعلى العمود عداد السرعة وجهاز الفرملة. لا توجد مقاومة بدء.</p>`,title:'اقرأ المخطط'},
    {add:String.raw`<p>المثقاب اليدوي والخلاط ومحرك بدء تشغيل السيارة (السلف) تستعمل محركات توالي أو محركات قريبة منها: كلها تحتاج عزماً كبيراً عند البدء.</p>`},
    {title:'مختبر مصغّر: مسار واحد وتيار واحد',widget:(el,B)=>DCML.lab(el,B,{intro:'<span class="ltr">V<sub>in</sub> = 100 V</span>. غيّر الحمل وشاهد التيار في كل جزء على المسار: ملف التوالي، ثم الأميتر، ثم المنتج.',
 predict:{q:'لو وضعنا أميتراً ثانياً بين المنتج والخط السالب، فإنه يقرأ:',opts:[
  ['نصف قراءة الأميتر الأول',false,'لا تفرع في الدائرة؛ التيار لا ينقسم.'],
  ['القراءة نفسها',true,'الدائرة مسار واحد على التوالي: التيار واحد في كل أجزائها.'],
  ['صفراً',false,'التيار يرجع من المنتج إلى الخط السالب، فيمر في الأميتر الثاني.']]},
 ins:[{k:'T',l:'عزم الفرملة T',seg:[[0.1,'0.1'],[0.2,'0.2'],[0.3,'0.3'],[0.4,'0.4 N.m']],v:0.2}],
 tp:{id:'u2-dcm',defs:motorDefs('series')},
 calc:(s,v,B)=>{const V=100,R=v.Ra+v.Rse,f=n=>{const I=Mod.seriesIa(v,V,n,R);return Mod.kphi(v,v.aSe*I)*60/(2*PI)*I-(s.T+v.Tf0+v.Tv*n/1000)};let lo=0,hi=60000;if(f(0)<=0)hi=0;for(let i=0;i<60;i++){const m=(lo+hi)/2;if(f(m)>0)lo=m;else hi=m}
  const I=DCML.fm(B,Mod.seriesIa(v,V,lo,R),3)+' A';return {facts:[['ملف التوالي D1–D2',I],['الأميتر A',I,'hi'],['المنتج 1B1–2B2',I]]}}})}
   ]},

  {st:4,short:'أولاً: أثر الجهد',title:'خطوات التجربة — أولاً: أثر جهد المصدر',ref:'ص 33',
   q:'الخطوة الثانية تقول «يجب أن يكون المحرك محملاً»، والثالثة تقول «T = 0»… فأيهما نتبع؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="خطوات أولاً: نرفع جهد المصدر 20 ثم 40 ثم 60 ثم 80 ثم 100 فولت ونسجل السرعة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><rect x="72" y="200.4" width="30" height="25.6" rx="4" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.6"/><text x="87.0" y="242" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">20</text><rect x="116" y="174.8" width="30" height="51.2" rx="4" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.6"/><text x="131.0" y="242" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">40</text><rect x="160" y="149.2" width="30" height="76.8" rx="4" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.6"/><text x="175.0" y="242" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">60</text><rect x="204" y="123.6" width="30" height="102.4" rx="4" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.6"/><text x="219.0" y="242" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">80</text><rect x="248" y="98.0" width="30" height="128.0" rx="4" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.6"/><text x="263.0" y="242" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">100</text><path d="M64 226 H286" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><text x="87" y="192.4" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n?</text><text x="131" y="166.8" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n?</text><text x="175" y="141.2" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n?</text><text x="219" y="115.6" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n?</text><text x="263" y="90.0" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n?</text><text x="60" y="250" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr"></text><text x="180" y="262" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">V<tspan font-size="9" dy="4">in</tspan><tspan dy="-4">​</tspan> (V)</text><g data-tip="الكتاب يكتب ⟦T = 0 N.m⟧ في هذه الخطوة، مع أن الخطوة السابقة تقول: يجب أن يكون المحرك محملاً قبل بدء الحركة. انظر «انتبه»."><rect x="67.5" y="50.6" width="85.0" height="22.8" rx="11.4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.6"/><text x="110" y="66.32" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T = 0 N.m</text></g></svg>`,
   cap:'خمس قيم للجهد من الجدول <span class="ltr">(7-1)</span>، أصغر من جهود التجربتين السابقتين.<br><b>مرّر المؤشر على الشرط في الأعلى (أو المسه في الجوال) لتعرف معناه.</b>',
   side:[
    {book:String.raw`<p><b>أولاً:</b></p><ol><li>صل التجربة كما هو موضح في شكل (7).</li><li><b>يجب أن يكون المحرك محملاً قبل بدء الحركة.</b></li><li>ثبت العزم الواقع على المحرك بواسطة جهاز العزم عند قيمة قدرها T = 0 N.m.</li><li>قم بتغيير قيم جهد المصدر \(V_{in}\) وفي كل مرة قم بتسجيل قيم السرعة n وذلك حسب الجدول (7-1):</li></ol>`,ref:'ص 33'}
   ],
   body:[
    {book:String.raw`${tableHTML(TB['7-1'])}`,ref:'ص 33'},
    {watch:String.raw`<p>محرك التوالي بلا حمل يجمح. <b>في المختبر:</b> يُمنع التشغيل عند <span class="ltr">T = 0</span>، ويبدأ الجدولان من أصغر حمل في الكتاب <span class="ltr">T = 0.1 N.m</span>. اتبع تعليمات مدربك على محرك المعمل.</p>`},
    {watch:String.raw`<p><b>تعارض في خطوات الكتاب:</b> الخطوة 2 تقول «يجب أن يكون المحرك محملاً قبل بدء الحركة» (وكذلك السؤال الثاني)، ثم الخطوة 3 تطلب <span class="ltr">T = 0 N.m</span>، والجدول <span class="ltr">(7-2)</span> يبدأ من <span class="ltr">T = 0</span>.</p>`,fix:true},
    {predict:{q:'لماذا تتوقع أن يختار الكتاب جهوداً صغيرة (<span class="ltr">20–100 V</span>) في هذا الجدول؟',opts:[
     ['لأن محرك التوالي لا يدور إلا على جهد صغير',false,'محرك التوالي يدور على جهود عالية أيضاً، بشرط وجود حمل.'],
     ['لأن السرعة بحمل خفيف ترتفع كثيراً، والجهد الصغير يُبقيها محدودة',true,'هذا تفسير مرجّح فقط؛ الكتاب لا يذكر السبب صراحة.'],
     ['لأن الفولتميتر لا يقرأ أكثر من 100 V',false,'المصدر حتى 250 V والفولتميتر يقرأ مداه.']]}},
    {title:'مختبر مصغّر: نقاط الجدول (7-1)',widget:(el,B)=>DCML.lab(el,B,{intro:'الحمل عند أصغر قيمة في جداول الكتاب <span class="ltr">T = 0.1 N.m</span> (لا نشغّل محرك التوالي بلا حمل). اختر \\(V_{in}\\) من الجدول واقرأ السرعة.',
 predict:{q:'لماذا نُبقي حملاً صغيراً على الأقل بدل <span class="ltr">T = 0</span>؟',opts:[
  ['لأن الفرملة لا تُضبط على الصفر',false,'الفرملة تُضبط على الصفر، لكن ذلك خطر على محرك التوالي.'],
  ['لأن محرك التوالي بلا حمل يضعف مجاله جداً فتجمح سرعته',true,'الخطوة 2: «يجب أن يكون المحرك محملاً قبل بدء الحركة» — جرّب الجموح في المحطة الأخيرة.'],
  ['لأن الجدول يبدأ من 0.1',false,'جدول (7-2) في الكتاب يبدأ من <span class="ltr">T = 0</span>؛ هذا من التعارض المذكور أعلاه.']]},
 ins:[{k:'V',l:'جهد المصدر V<sub>in</sub>',seg:[[20,'20'],[40,'40'],[60,'60'],[80,'80'],[100,'100 V']],v:60}],
 tp:{id:'u2-dcm',defs:motorDefs('series')},
 calc:(s,v,B)=>{const R=v.Ra+v.Rse,nOf=V=>{const f=n=>{const I=Mod.seriesIa(v,V,n,R);return Mod.kphi(v,v.aSe*I)*60/(2*PI)*I-(EXP7_TMIN+v.Tf0+v.Tv*n/1000)};let lo=0,hi=60000;if(f(0)<=0)return 0;for(let i=0;i<60;i++){const m=(lo+hi)/2;if(f(m)>0)lo=m;else hi=m}return lo};
  const pts=[20,40,60,80,100].map(V=>[nOf(V),V]),n=nOf(s.V);
  return {facts:[['السرعة n',DCML.fm(B,n,0)+' rpm','hi'],['I<sub>a</sub>',DCML.fm(B,Mod.seriesIa(v,s.V,n,R),3)+' A']],
   plot:{xr:[0,Math.ceil(Math.max(...pts.map(p=>p[0]))*1.1/500)*500||500],yr:[0,120],xl:'n (rpm)',yl:'V<tspan font-size="9" dy="3">in</tspan><tspan dy="-3"> (V)</tspan>',curves:[{pts:pts.filter(p=>p[0]>0)}],dots:pts.map(p=>[p[0],p[1],'--muted']),cur:[n,s.V]},
   msg:n===0?'الجهد صغير لا يكفي ليغلب الحمل والاحتكاك: المحرك لا يدور.':''}}})}
   ]},

  {st:5,short:'ثانياً: أثر الحمل',title:'خطوات التجربة — ثانياً: أثر العزم (الحمل)',ref:'ص 33',
   q:'في محرك التوازي هبطت السرعة قليلاً مع الحمل… فهل يحدث الشيء نفسه هنا؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="خطوات ثانياً: جهد المصدر 100 فولت، ونغير العزم من صفر إلى 0.4 نيوتن متر ونسجل السرعة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><rect x="72" y="219.6" width="30" height="6.4" rx="4" fill="#F2C14E" stroke="#2C4A40" stroke-width="1.6"/><text x="87.0" y="242" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">0</text><rect x="116" y="194.0" width="30" height="32.0" rx="4" fill="#F2C14E" stroke="#2C4A40" stroke-width="1.6"/><text x="131.0" y="242" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">0.1</text><rect x="160" y="162.0" width="30" height="64.0" rx="4" fill="#F2C14E" stroke="#2C4A40" stroke-width="1.6"/><text x="175.0" y="242" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">0.2</text><rect x="204" y="130.0" width="30" height="96.0" rx="4" fill="#F2C14E" stroke="#2C4A40" stroke-width="1.6"/><text x="219.0" y="242" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">0.3</text><rect x="248" y="98.0" width="30" height="128.0" rx="4" fill="#F2C14E" stroke="#2C4A40" stroke-width="1.6"/><text x="263.0" y="242" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">0.4</text><path d="M64 226 H286" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><text x="87" y="211.6" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n?</text><text x="131" y="186.0" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n?</text><text x="175" y="154.0" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n?</text><text x="219" y="122.0" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n?</text><text x="263" y="90.0" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n?</text><text x="60" y="250" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr"></text><text x="180" y="262" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T (N.m)</text><g data-tip="شرط ثابت: جهد المصدر ⟦Vin = 100 V⟧."><rect x="60.1" y="50.6" width="99.8" height="22.8" rx="11.4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.6"/><text x="110" y="66.32" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">V<tspan font-size="8" dy="4">in</tspan><tspan dy="-4">​</tspan> = 100 V</text></g></svg>`,
   cap:'خمس قيم للعزم من الجدول <span class="ltr">(7-2)</span> والجهد ثابت.<br><b>مرّر المؤشر على الشرط في الأعلى (أو المسه في الجوال) لتعرف معناه.</b>',
   side:[
    {book:String.raw`<p><b>ثانياً:</b></p><ol><li>قم بتثبيت جهد المصدر Vin = 100 V.</li><li>ثم قم بتغيير قيم العزم T الواقع على المحرك من خلال جهاز العزم وفي كل مرة سجل قيمة السرعة n وذلك حسب الجدول (7-2):</li></ol>`,ref:'ص 33'}
   ],
   body:[
    {book:String.raw`${tableHTML(TB['7-2'])}`,ref:'ص 33'},
    {title:'لماذا تتغير سرعة محرك التوالي كثيراً مع الحمل؟',widget:(el,B)=>{
      const S=['قلّ الحمل T','قلّ تيار المنتج','قلّ تيار ملف التوالي (هو التيار نفسه)','ضعف المجال','ارتفعت السرعة كثيراً — وبلا حمل: جموح'];
      el.innerHTML=`<p class="sub" style="margin:0 0 10px">اضغط «خفّف الحمل» وتابع السلسلة (توضيح منا، ليس من الكتاب).</p><div class="chain">${S.map((s,i)=>`<span class="ck${i===S.length-1?' end':''}">${s}</span>${i<S.length-1?'<span class="ar">←</span>':''}`).join('')}</div><div class="w-row"><button class="btn pri" type="button" data-go>خفّف الحمل</button><button class="btn" type="button" data-rs>إعادة</button></div>`;
      const ks=[...el.querySelectorAll('.ck')];let tm=[];const rs=()=>{tm.forEach(clearTimeout);tm=[];ks.forEach(k=>k.classList.remove('on'))};
      el.querySelector('[data-go]').onclick=()=>{rs();ks.forEach((k,i)=>tm.push(setTimeout(()=>k.classList.add('on'),i*600)))};el.querySelector('[data-rs]').onclick=rs;}},
    {predict:{q:'قارن هبوط السرعة مع زيادة الحمل في جدولك (7-2) بجدول (6-2) لمحرك التوازي:',opts:[
     ['الهبوط في محرك التوالي أكبر بكثير',true,'في التوالي يقوى المجال مع الحمل فتهبط السرعة كثيراً، أما التوازي فمجاله ثابت.'],
     ['متساويان',false,'طريقة توصيل المجال مختلفة، فالسلوك مختلف.'],
     ['الهبوط في محرك التوازي أكبر',false,'العكس: محرك التوازي «ثابت السرعة».']]}},
    {watch:String.raw`<p>في المختبر لا يُسجَّل عمود <span class="ltr">T = 0</span> من هذا الجدول، للسبب المذكور في المحطة السابقة.</p>`,fix:true},
    {title:'مختبر مصغّر: التوالي مقابل التوازي مع الحمل',widget:(el,B)=>DCML.lab(el,B,{intro:'<span class="ltr">V<sub>in</sub> = 100 V</span> للتوالي. غيّر العزم وقارن نقطتك بمنحنى محرك التوازي (الرمادي، عند <span class="ltr">120 V</span> كما في جدوله).',
 predict:{q:'ضاعفت العزم من <span class="ltr">0.2</span> إلى <span class="ltr">0.4 N.m</span>. تيار منتج محرك التوالي:',opts:[
  ['يتضاعف تماماً',false,'في التوالي يقوى المجال مع التيار، فيعطي كل أمبير عزماً أكبر؛ فيكفي تيار أقل من الضعف.'],
  ['يزيد أقل من الضعف',true,'العزم يعتمد على التيار والمجال معاً، والمجال نفسه يقوى مع التيار.'],
  ['يقل',false,'الحمل الأكبر يحتاج تياراً أكبر.']]},
 ins:[{k:'T',l:'عزم الفرملة T',seg:[[0.1,'0.1'],[0.2,'0.2'],[0.3,'0.3'],[0.4,'0.4 N.m']],v:0.2}],
 tp:{id:'u2-dcm',defs:motorDefs('series')},
 calc:(s,v,B)=>{const R=v.Ra+v.Rse,ser=T=>{const f=n=>{const I=Mod.seriesIa(v,100,n,R);return Mod.kphi(v,v.aSe*I)*60/(2*PI)*I-(T+v.Tf0+v.Tv*n/1000)};let lo=0,hi=60000;if(f(0)<=0)return 0;for(let i=0;i<60;i++){const m=(lo+hi)/2;if(f(m)>0)lo=m;else hi=m}return lo};
  const ks=Mod.kphi(v,120/v.Rf),kt=ks*60/(2*PI),sh=T=>Math.max(0,(kt*120/v.Ra-T-v.Tf0)/(kt*ks/v.Ra+v.Tv/1000));
  const L=[0.1,0.2,0.3,0.4],ps=L.map(T=>[ser(T),T]),pp=L.map(T=>[sh(T),T]),n=ser(s.T),I=Mod.seriesIa(v,100,n,R),I2=Mod.seriesIa(v,100,ser(0.2),R);
  return {facts:[['السرعة (توالي)',DCML.fm(B,n,0)+' rpm','hi'],['I<sub>a</sub> (توالي)',DCML.fm(B,I,3)+' A','hi'],['I<sub>a</sub> نسبةً إلى قيمته عند 0.2 N.m','× '+DCML.fm(B,I/I2,2)]],
   plot:{xr:[0,Math.ceil(Math.max(...ps.map(p=>p[0]),...pp.map(p=>p[0]))*1.08/500)*500],yr:[0,0.45],xl:'n (rpm)',yl:'T (N.m)',yt:[0,0.1,0.2,0.3,0.4],curves:[{pts:pp.slice().reverse(),col:'--muted',dash:'4 4',lab:'توازي'},{pts:ps.slice().reverse(),col:'--live',lab:'توالي'}],cur:[n,s.T]}}}})}
   ]},

  {st:6,short:'منحنى العلاقة',title:'منحنى العلاقة',ref:'ص 33–34',
   q:'هذه المرة يطلب الكتاب رسم شيئين مع السرعة: العزم وتيار المنتج. من أي جدول؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="شبكتان فارغتان كما في الكتاب: تيار المنتج مع السرعة، والعزم مع السرعة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><g data-tip="الشبكة الأولى (ص 34): ⟦Ia⟧ رأسي و⟦n⟧ أفقي — من الجدول ⟦(7-2)⟧."><rect x="192" y="62" width="150" height="142" fill="transparent"/><rect x="196" y="84" width="120" height="100" fill="#FBF6EE"/><path d="M196 109.0 H316" stroke="#D9D2C2" stroke-width="1"/><path d="M226.0 84 V184" stroke="#D9D2C2" stroke-width="1"/><path d="M196 134.0 H316" stroke="#D9D2C2" stroke-width="1"/><path d="M256.0 84 V184" stroke="#D9D2C2" stroke-width="1"/><path d="M196 159.0 H316" stroke="#D9D2C2" stroke-width="1"/><path d="M286.0 84 V184" stroke="#D9D2C2" stroke-width="1"/><path d="M196 78 V184 H322" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><text x="200" y="74" text-anchor="start" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">I<tspan font-size="8" dy="4">a</tspan><tspan dy="-4">​</tspan>(A)</text><text x="316" y="200" text-anchor="end" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n(rpm)</text></g><g data-tip="الشبكة الثانية (ص 34): ⟦T⟧ رأسي و⟦n⟧ أفقي — من الجدول ⟦(7-2)⟧."><rect x="48" y="62" width="150" height="142" fill="transparent"/><rect x="52" y="84" width="120" height="100" fill="#FBF6EE"/><path d="M52 109.0 H172" stroke="#D9D2C2" stroke-width="1"/><path d="M82.0 84 V184" stroke="#D9D2C2" stroke-width="1"/><path d="M52 134.0 H172" stroke="#D9D2C2" stroke-width="1"/><path d="M112.0 84 V184" stroke="#D9D2C2" stroke-width="1"/><path d="M52 159.0 H172" stroke="#D9D2C2" stroke-width="1"/><path d="M142.0 84 V184" stroke="#D9D2C2" stroke-width="1"/><path d="M52 78 V184 H178" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><text x="56" y="74" text-anchor="start" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T(N.m)</text><text x="172" y="200" text-anchor="end" font-size="11" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n(rpm)</text></g><text x="180" y="258" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="600" direction="rtl">الشبكتان من الجدول الثاني فقط</text></svg>`,
   cap:'شبكتا الكتاب كما طُبعتا، وكلتاهما من الجدول <span class="ltr">(7-2)</span>.<br><b>مرّر المؤشر على كل شبكة (أو المسها في الجوال) لتعرف جدولها.</b>',
   side:[
    {book:String.raw`<p>ارسم العزم (T) وتيار المنتج (I<sub>a</sub>) مع سرعة الدوران (n).</p>`,ref:'ص 33'}
   ],
   body:[
    {predict:{q:'في شبكة \\(T\\) مع \\(n\\) لمحرك التوالي، أين تتوقع أن تكون نقطة العزم الأكبر؟',opts:[
     ['عند السرعة الأعلى',false,'السرعة العالية تعني حملاً خفيفاً وتياراً صغيراً، فالعزم صغير.'],
     ['عند السرعة الأقل',true,'العزم الأكبر يحتاج تياراً أكبر، والتيار الأكبر يقوّي المجال فيخفض السرعة.'],
     ['كل النقاط على خط أفقي',false,'العزم هو ما نغيّره في الجدول، فلا يكون ثابتاً.']]}},
    {watch:String.raw`<p>لا توجد شبكة في الكتاب للجدول <span class="ltr">(7-1)</span>؛ يرسم المختبر منحنى \(V_{in}\) مع \(n\) منه إضافةً. وعلى شبكة العزم طُبع «T(n.m)» والصحيح <span class="ltr">T (N.m)</span>.</p>`,fix:true},
    {title:'مختبر مصغّر: العزم والتيار مع السرعة',widget:(el,B)=>DCML.lab(el,B,{intro:'هذان المنحنيان المطلوبان (ص 33): \\(T\\) و\\(I_a\\) مع \\(n\\) عند <span class="ltr">V<sub>in</sub> = 100 V</span>. حرّك العزم واقرأ النقطتين.',
 predict:{q:'حين تتحرك النقطة نحو السرعات المنخفضة، المنحنيان:',opts:[
  ['ينزلان معاً',false,'السرعة المنخفضة تعني حملاً أكبر، فيكبر العزم والتيار.'],
  ['يصعدان معاً',true,'الحمل الأكبر يحتاج تياراً أكبر، والتيار الأكبر يقوي المجال فتنخفض السرعة.'],
  ['العزم يصعد والتيار ينزل',false,'العزم في محرك التوالي لا يكبر إلا بتيار أكبر.']]},
 ins:[{k:'T',l:'عزم الفرملة T',min:0.1,max:0.4,step:0.01,v:0.25,dp:2,u:'N.m'}],
 tp:{id:'u2-dcm',defs:motorDefs('series')},
 calc:(s,v,B)=>{const R=v.Ra+v.Rse,ser=T=>{const f=n=>{const I=Mod.seriesIa(v,100,n,R);return Mod.kphi(v,v.aSe*I)*60/(2*PI)*I-(T+v.Tf0+v.Tv*n/1000)};let lo=0,hi=60000;if(f(0)<=0)return 0;for(let i=0;i<60;i++){const m=(lo+hi)/2;if(f(m)>0)lo=m;else hi=m}return lo};
  const L=[...Array(16).keys()].map(i=>0.1+i*0.02),P=L.map(T=>{const n=ser(T);return [n,T,Mod.seriesIa(v,100,n,R)]}),n=ser(s.T),I=Mod.seriesIa(v,100,n,R),Im=Math.max(...P.map(p=>p[2])),k=0.4/Im;
  return {facts:[['n',DCML.fm(B,n,0)+' rpm'],['T',DCML.fm(B,s.T,2)+' N.m','hi'],['I<sub>a</sub>',DCML.fm(B,I,3)+' A','hi']],
   plot:{xr:[0,Math.ceil(Math.max(...P.map(p=>p[0]))*1.08/500)*500],yr:[0,0.45],xl:'n (rpm)',yl:'T (N.m)',yt:[0,0.1,0.2,0.3,0.4],curves:[{pts:P.map(p=>[p[0],p[1]]).reverse(),col:'--blue',lab:'T'},{pts:P.map(p=>[p[0],p[2]*k]).reverse(),col:'--live',dash:'6 4',lab:'Ia'}],dots:[[n,I*k,'--live']],cur:[n,s.T]},
   msg:'الخط المتقطع \\(I_a\\) مرسوم بمقياس آخر ليظهر شكله على الشبكة نفسها؛ اقرأ قيمته من البطاقة.'}}})}
   ]},

  {st:7,short:'المطلوب',title:'المطلوب: لماذا يُستعمل محرك التوالي في الجر؟',ref:'ص 34',
   q:'قطار متوقف محمّل بالركاب… ما الذي يحتاجه المحرك أكثر شيء لحظة التحرك؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="رافعة ترفع حملاً ثقيلاً: محرك التوالي يعطي عزماً كبيراً عند السرعات المنخفضة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="برج الرافعة."><path d="M110 280 V70 H300 M110 70 L80 100 V280" fill="none" stroke="#2C4A40" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></g><g data-tip="محرك التوالي يدير بكرة الحبل: يعطي عزماً كبيراً عند بدء رفع الحمل والسرعة منخفضة."><circle cx="120" cy="112" r="18" fill="#CFE6DB" stroke="#2C4A40" stroke-width="3"/><text x="120" y="119" text-anchor="middle" font-size="20" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">M</text></g><path d="M260 70 V196" fill="none" stroke="#2C4A40" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="حمل ميت ⟦Dead load⟧: ثقل ثابت معلق (مثل حمل الرافعة أو المصعد) يحتاج عزماً كبيراً من لحظة البدء."><rect x="222" y="196" width="76" height="58" rx="6" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.4"/><text x="260" y="231" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">حمل ثقيل</text></g><text x="180" y="306" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="600" direction="rtl">الجر والرفع: عزم كبير عند السرعة المنخفضة</text></svg>`,
   cap:'الرافعة مثال على «الحمل الميت»: ثقل ثابت يحتاج عزماً كبيراً من لحظة البدء.<br><b>مرّر المؤشر على المحرك والحمل (أو المسهما في الجوال) لتعرف معناهما.</b>',
   side:[
    {book:String.raw`<ol><li>ناقش النتائج التي حصلت عليها وسجل ملاحظاتك على التجربة.</li><li>علل لماذا يستخدم محرك التوالي في الجر وكذلك في الأحوال التي يقترن فيها الطلب على عزم دوران ثقيل، وكذلك وجود حمل ميت على المحرك (Dead load)؟ يمكنك الاستعانة بمنحنيات الخواص التي حصلت عليها.</li></ol>`,ref:'ص 34'}
   ],
   body:[
    {predict:{q:'من منحنياتك: لماذا يناسب محرك التوالي تحريك قطار من السكون؟',opts:[
     ['لأن سرعته ثابتة مهما تغير الحمل',false,'هذا وصف محرك التوازي؛ سرعة التوالي تتغير كثيراً.'],
     ['لأن تياره صغير دائماً',false,'عند البدء والحمل الثقيل يكون تياره كبيراً.'],
     ['لأنه يعطي عزماً كبيراً جداً عند السرعات المنخفضة',true,'التيار الكبير يقوّي المجال ويزيد العزم معاً؛ ومع خفة الحمل ترتفع السرعة تلقائياً.']]}},
    {add:String.raw`<p>القطارات الكهربائية القديمة والترام والرافعات استعملت محركات التوالي لهذا السبب. وفيها يُربط الحمل بالمحرك بتروس لا بسيور، حتى لا يفقد المحرك حمله فجأة فيجمح.</p>`},
    {tip:String.raw`${Q('المطلوب 2:','لماذا في الجر والأحمال الثقيلة؟','عند السرعات المنخفضة (بدء الحركة والحمل الثقيل) يكون التيار كبيراً والمجال قوياً، فيعطي المحرك عزماً كبيراً جداً — وهذا ما يلزم لتحريك قطار أو رافعة أو حمل ميت ثقيل من السكون. وعندما يخف الحمل ترتفع السرعة تلقائياً.')}`,title:'إجابة مقترحة (ليست من الكتاب) — اضغط لتظهر'},
    {title:'مختبر مصغّر: عزم البدء الثقيل',widget:(el,B)=>DCML.lab(el,B,{intro:'محركان يعطيان العزم نفسه عند التيار المقنن: توالي وتوازي (مجاله ثابت). كبّر تيار المنتج (كما عند تحريك قطار من السكون) وقارن عزميهما.',
 predict:{q:'عند ضعف التيار المقنن، عزم محرك التوالي مقارنة بعزمه عند التيار المقنن:',opts:[
  ['أكثر من الضعف',true,'التيار الأكبر يقوي المجال أيضاً، فيزيد العزم أسرع من التيار — حتى يحدّه تشبع الحديد.'],
  ['الضعف تماماً، مثل التوازي',false,'في التوازي فقط يزيد العزم بنسبة التيار، لأن مجاله ثابت.'],
  ['أقل من الضعف',false,'المجال يقوى مع التيار، فلا يكون العزم أقل من نسبة التيار.']]},
 ins:[{k:'x',l:'تيار المنتج (من التيار المقنن)',min:0.25,max:3,step:0.25,v:1,fmt:x=>'× '+x}],
 tp:{id:'u2-dcm',defs:motorDefs('series')},
 calc:(s,v,B)=>{const Ts=I=>Mod.kphi(v,v.aSe*I)*I,ref=Ts(v.IaN),rs=Ts(s.x*v.IaN)/ref,rp=s.x,pts=[...Array(12).keys()].map(i=>(i+1)*0.25);
  return {facts:[['عزم التوالي (من عزمه عند المقنن)','× '+DCML.fm(B,rs,2),'hi'],['عزم التوازي (من عزمه عند المقنن)','× '+DCML.fm(B,rp,2)]],
   plot:{xr:[0,3],yr:[0,Math.ceil(Math.max(Ts(3*v.IaN)/ref,3)*1.1)],xl:'I<tspan font-size="9" dy="3">a</tspan><tspan dy="-3"> ÷ I</tspan><tspan font-size="9" dy="3">aN</tspan>',yl:'T ÷ T(I<tspan font-size="9" dy="3">aN</tspan><tspan dy="-3">)</tspan>',xt:[0,1,2,3],curves:[{pts:[[0,0]].concat(pts.map(x=>[x,x])),col:'--muted',dash:'4 4',lab:'توازي'},{pts:[[0,0]].concat(pts.map(x=>[x,Ts(x*v.IaN)/ref])),col:'--live',lab:'توالي'}],cur:[s.x,rs]}}}})}
   ]},

  {st:8,short:'الأسئلة',title:'الأسئلة: لماذا يُحمَّل محرك التوالي قبل تشغيله؟',ref:'ص 34',
   q:'سير الحمل انقطع ومحرك التوالي يعمل على جهده الكامل… ماذا يحدث؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="محرك توالي فقد حمله: السير انقطع فارتفعت السرعة إلى المنطقة الحمراء" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><circle cx="96" cy="150" r="30" fill="#CFE6DB" stroke="#2C4A40" stroke-width="3"/><text x="96" y="157" text-anchor="middle" font-size="20" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">M</text><path d="M126 150 H150" fill="none" stroke="#9AA59F" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="بكرة الحمل وسير مقطوع: إذا انقطع السير فقد المحرك حمله فجأة، فيضعف مجاله وتجمح سرعته. لذلك يُربط الحمل بتروس لا بسيور."><rect x="130" y="136" width="62" height="126" fill="transparent"/><circle cx="160" cy="150" r="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.4"/><circle cx="160" cy="236" r="22" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.4"/><path d="M150 150 L140 230 M170 150 L174 186" fill="none" stroke="#2C4A40" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M176 200 L182 222" fill="none" stroke="#2C4A40" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M168 190 L184 196" fill="none" stroke="#E8735A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g><g data-tip="عداد السرعة: بلا حمل تجمح سرعة محرك التوالي."><rect x="198" y="100" width="136" height="76" fill="transparent"/><path d="M202 170 A64 64 0 0 1 330 170" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M321.4 138.0 A64 64 0 0 1 330 170" fill="none" stroke="#E8735A" stroke-width="8"/><path d="M266 170 L314.9 147.2" fill="none" stroke="#2C4A40" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="266" cy="170" r="6" fill="#2C4A40"/><text x="266" y="147.6" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">n</text></g><text x="266" y="206" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">السرعة</text><text x="96" y="206" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">محرك توالي</text><text x="180" y="296" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="600" direction="rtl">لماذا يجب تحميله قبل التشغيل؟</text></svg>`,
   cap:'السير المقطوع يُفقد المحرك حمله، فتقفز السرعة إلى المنطقة الحمراء.<br><b>مرّر المؤشر على السير والعداد (أو المسهما في الجوال) لتعرف ما يحدث.</b>',
   side:[
    {book:String.raw`<p>بعد الانتهاء من التجربة يمكنك الإجابة على الأسئلة التالية:</p><ul style="list-style:none;padding-inline-start:0"><li>أ. ما هو تأثير زيادة الحمل على كل من تيار المنتج والعزم المتولد والسرعة لمحرك التوالي؟</li><li>ب. لماذا يجب أن يتم تحميل محرك التوالي قبل تشغيله؟</li></ul>`,ref:'ص 34'}
   ],
   body:[
    {predict:{q:'السؤال أ: عند زيادة الحمل على محرك التوالي:',opts:[
     ['يزيد التيار، ويزيد العزم بسرعة، وتقل السرعة كثيراً',true,'التيار نفسه يقوّي المجال، فيزيد العزم أسرع من التيار وتهبط السرعة كثيراً.'],
     ['يزيد التيار وتبقى السرعة ثابتة',false,'السرعة الثابتة صفة محرك التوازي.'],
     ['يقل التيار وتزيد السرعة',false,'هذا ما يحدث عند تخفيف الحمل لا زيادته.']]}},
    {tip:String.raw`${Q('ب.','لماذا التحميل قبل التشغيل؟','لأنه بلا حمل يكون التيار صغيراً جداً، وهذا التيار نفسه هو تيار المجال، فيضعف المجال جداً وترتفع السرعة إلى قيم خطيرة (جموح) قد تمزق المنتج والمبدل.')}`,title:'إجابة مقترحة (ليست من الكتاب) — اضغط لتظهر'},
    {watch:String.raw`<p>السؤال الثاني مطبوع في الكتاب بلا حرف؛ كتبناه «ب».</p>`,fix:true},
    {title:'مختبر مصغّر: ماذا لو فقد محرك التوالي حمله؟',widget:(el,B)=>DCML.lab(el,B,{intro:'<span class="ltr">V<sub>in</sub> = 100 V</span>. خفّف الحمل تدريجياً حتى الصفر وراقب السرعة. الخط الأحمر أقصى سرعة آمنة.',
 predict:{q:'خففت الحمل إلى <span class="ltr">T = 0</span> والجهد كامل. السرعة:',opts:[
  ['تستقر عند قيمة أعلى قليلاً',false,'هذا سلوك محرك التوازي؛ في التوالي يضعف المجال جداً مع التيار الصغير.'],
  ['ترتفع إلى قيم خطيرة (جموح)',true,'تيار صغير ← مجال ضعيف جداً ← سرعة عالية جداً؛ لذلك «يجب أن يكون المحرك محملاً قبل بدء الحركة».'],
  ['تنخفض إلى الصفر',false,'لا حمل يمسك المحرك؛ المشكلة أنه يسرع لا أنه يتوقف.']]},
 ins:[{k:'T',l:'عزم الفرملة T',min:0,max:0.4,step:0.02,v:0.4,dp:2,u:'N.m'}],
 tp:{id:'u2-dcm',defs:motorDefs('series')},
 calc:(s,v,B)=>{const R=v.Ra+v.Rse,ser=T=>{const f=n=>{const I=Mod.seriesIa(v,100,n,R);return Mod.kphi(v,v.aSe*I)*60/(2*PI)*I-(T+v.Tf0+v.Tv*n/1000)};let lo=0,hi=60000;if(f(0)<=0)return 0;for(let i=0;i<60;i++){const m=(lo+hi)/2;if(f(m)>0)lo=m;else hi=m}return lo};
  const n=ser(s.T),P=[...Array(21).keys()].map(i=>[i*0.02,ser(i*0.02)]),ym=Math.max(v.nMax*1.4,Math.min(P[0][1],v.nMax*3))*1.05,bad=n>v.nMax;
  return {facts:[['السرعة',DCML.fm(B,n,0)+' rpm',bad?'bad':'hi'],['I<sub>a</sub> (= تيار المجال)',DCML.fm(B,Mod.seriesIa(v,100,n,R),3)+' A']],
   plot:{xr:[0,0.4],yr:[0,Math.ceil(ym/1000)*1000],xl:'T (N.m)',yl:'n (rpm)',xt:[0,0.1,0.2,0.3,0.4],curves:[{pts:[[0,v.nMax],[0.4,v.nMax]],col:'--stop',dash:'5 4'},{pts:P}],cur:[s.T,n]},
   msg:bad?'<b>جموح!</b> تجاوزت السرعة الحد الآمن. في المعمل تفصل الحماية المصدر — والأصل ألا يُشغَّل محرك التوالي بلا حمل.':s.T<0.1?'الحمل صار أصغر من أصغر قيمة في الجداول، والسرعة تقترب من الخطر.':'',cls:bad?'bad':s.T<0.1?'warn':''}}})}
   ]},

  {recap:[
   String.raw`محرك التوالي: ملف المجال \(D1–D2\) على التوالي مع المنتج، فيمر فيهما التيار نفسه والمجال يتبع الحمل، الشكل (7) (ص 32).`,
   String.raw`زيادة الحمل تزيد التيار والعزم بسرعة، وتنقص السرعة كثيراً — أكثر بكثير من محرك التوازي (الجدول 7-2).`,
   String.raw`بلا حمل يضعف المجال جداً وتجمح السرعة؛ لذلك «يجب أن يكون المحرك محملاً قبل بدء الحركة» (ص 33).`,
   String.raw`عزمه الكبير عند السرعات المنخفضة يجعله مناسباً للجر والرافعات والحمل الميت (ص 34).`]}
],
 theory:[
  {h:'التجربة السابعة: منحنى خواص السرعة مع العزم لمحرك التوالي',ref:'ص 32',html:'<p class="ltr" style="text-align:left">Speed-torque characteristic of a DC series motor</p><p><b>الأهداف:</b></p><ul><li>معرفة أثر جهد المصدر (V<sub>in</sub>) والعزم (T) على سرعة المحرك ثم رسم منحنيات الخواص لمحرك التوالي عند تحميله، مثل منحنى السرعة مع العزم، والتيار مع العزم.</li></ul>'},
  {note:`<b>توضيح للمتدرب — ليس من الكتاب:</b> في محرك التوالي يمر تيار المنتج نفسه في ملف المجال D1–D2، فالمجال يتبع الحمل:
   <ul><li><b>حمل كبير</b> ← تيار كبير ← مجال قوي ← عزم كبير جداً (يقارب مربع التيار قبل التشبع) وسرعة منخفضة.</li>
   <li><b>حمل صغير</b> ← تيار صغير ← مجال ضعيف ← سرعة عالية: \\(n = \\frac{V_{in} - I_a(R_a+R_{se})}{k\\,\\phi(I_a)}\\).</li>
   <li><b>بلا حمل</b> يصغر التيار جداً فيضعف المجال جداً، وترتفع السرعة بلا حد تقريباً (<b>جموح</b>) حتى يتلف المحرك. لذلك لا يُشغَّل محرك التوالي بلا حمل، ولا يُربط حمله بسير يمكن أن ينقطع.</li></ul>`},
  {h:'الأجهزة المستخدمة',ref:'ص 32',html:'<ol><li>مصدر قدرة.</li><li>موحد تيار مستمر.</li><li>محرك تيار مستمر توالي.</li><li>جهاز الفرملة.</li><li>جهاز الفولتميتر.</li><li>جهاز قياس السرعة.</li></ol><p class="sub">ويلزم أيضاً أميتر (موجود في المخطط).</p>'},
  {fig:'(7)',ref:'ص 32',caption:'مخطط توصيل محرك التوالي: على الخط الموجب ملف التوالي D1–D2 ثم الأميتر A ثم المنتج 1B1–2B2، فالتيار نفسه يمر في ملف التوالي والمنتج. على العمود تاكومتر وجهاز فرملة. لا توجد مقاومة بدء.',draw:()=>box(figSVG('series',{static:1}),760,1)},
  {h:'خطوات التجربة',ref:'ص 33',html:`<p><b>أولاً:</b></p><ol><li>صل التجربة كما هو موضح في شكل (7).</li><li><b>يجب أن يكون المحرك محملاً قبل بدء الحركة.</b></li><li>ثبت العزم الواقع على المحرك بواسطة جهاز العزم عند قيمة قدرها <span class="ltr">T = 0 N.m</span>.</li><li>قم بتغيير قيم جهد المصدر \\(V_{in}\\) وفي كل مرة قم بتسجيل قيم السرعة n وذلك حسب الجدول (7-1):</li></ol>${tableHTML(TB['7-1'])}
   <p style="margin-top:14px"><b>ثانياً:</b></p><ol><li>قم بتثبيت جهد المصدر <span class="ltr">Vin = 100 V</span>.</li><li>ثم قم بتغيير قيم العزم T الواقع على المحرك من خلال جهاز العزم وفي كل مرة سجل قيمة السرعة n وذلك حسب الجدول (7-2):</li></ol>${tableHTML(TB['7-2'])}`},
  {err:`<div class="fixnote"><b>تعارض في خطوات الكتاب:</b> الخطوة 2 تقول «يجب أن يكون المحرك محملاً قبل بدء الحركة» (وكذلك السؤال الثاني)، ثم الخطوة 3 تطلب <span class="ltr">T = 0 N.m</span>، والجدول (7-2) يبدأ من <span class="ltr">T = 0</span>. محرك التوالي بلا حمل يجمح. <b>في المختبر:</b> يُمنع التشغيل عند T = 0 برسالة حمراء، ويبدأ الجدولان من أصغر حمل في الكتاب <span class="ltr">T = ${EXP7_TMIN} N.m</span>: الجدول (7-1) يُسجَّل عند <span class="ltr">T = ${EXP7_TMIN} N.m</span> بدل الصفر، وعمود <span class="ltr">T = 0</span> في الجدول (7-2) لا يُسجَّل.</div>`},
  {h:'منحنى العلاقة',ref:'ص 33–34',html:'<p>«ارسم العزم (T) وتيار المنتج (I<sub>a</sub>) مع سرعة الدوران (n).» في الكتاب شبكتان: المحور الرأسي <span class="ltr">Ia (A)</span> والأفقي <span class="ltr">n (rpm)</span>، والمحور الرأسي <span class="ltr">T (N.m)</span> والأفقي <span class="ltr">n (rpm)</span> — وكلاهما من الجدول (7-2). لا توجد شبكة للجدول (7-1)؛ أضفنا في المختبر منحنى V<sub>in</sub> مع n منه (إضافة من خارج الكتاب).</p>'},
  {h:'المطلوب',ref:'ص 34',html:`<ol><li>ناقش النتائج التي حصلت عليها وسجل ملاحظاتك على التجربة.</li><li>علل لماذا يستخدم محرك التوالي في الجر وكذلك في الأحوال التي يقترن فيها الطلب على عزم دوران ثقيل، وكذلك وجود حمل ميت على المحرك (Dead load)؟ يمكنك الاستعانة بمنحنيات الخواص التي حصلت عليها.</li></ol>
   ${Q('المطلوب 2:','لماذا يستخدم محرك التوالي في الجر والأحمال الثقيلة؟','من منحنياتك: عند السرعات المنخفضة (بدء الحركة والحمل الثقيل) يكون التيار كبيراً والمجال قوياً، فيعطي المحرك عزماً كبيراً جداً — وهذا ما يلزم لتحريك قطار أو رافعة من السكون أو حمل ميت ثقيل. وعندما يخف الحمل ترتفع السرعة تلقائياً، فتبقى القدرة متقاربة. لكن يجب أن يبقى الحمل مربوطاً بالمحرك دائماً (تروس لا سيور) حتى لا يجمح.')}`},
  {h:'الأسئلة',ref:'ص 34',html:`<p>«بعد الانتهاء من التجربة يمكنك الإجابة على الأسئلة التالية:»</p>
   ${Q('أ.','ما هو تأثير زيادة الحمل على كل من تيار المنتج والعزم المتولد والسرعة لمحرك التوالي؟','تيار المنتج يزيد (وهو نفسه تيار المجال فيقوى المجال)، والعزم المتولد يزيد بسرعة (أسرع من زيادة التيار)، والسرعة تقل كثيراً — أكثر بكثير من محرك التوازي (جدولك 7-2).')}
   ${Q('ب.','لماذا يجب أن يتم تحميل محرك التوالي قبل تشغيله؟','لأنه بلا حمل يكون التيار صغيراً جداً، وهذا التيار نفسه هو تيار المجال، فيضعف المجال جداً وترتفع السرعة إلى قيم خطيرة (جموح) قد تمزق المنتج والمبدل.')}`},
  {err:`<div class="fixnote"><b>ملاحظات على الكتاب (التجربة السابعة):</b><ol style="margin:6px 0 0;padding-inline-start:20px">
   <li>الغرض (ص 32) مطبوع «لمحرك التوازي» (منقول من التجربة السادسة) والصحيح «لمحرك التوالي» — صُحح أعلاه.</li>
   <li>الأميتر غير مذكور في قائمة الأجهزة رغم وجوده في المخطط.</li>
   <li>الخطوة «ثانياً 1»: «قم بثبت» والصحيح «قم بتثبيت» — صُحح.</li>
   <li>تعارض «يجب أن يكون المحرك محملاً» مع «T = 0 N.m» — انظر الملاحظة الحمراء فوق.</li>
   <li>السؤال الثاني مطبوع بلا حرف؛ الأرجح «ب».</li>
   <li>شبكة العزم مكتوب عليها «T(n.m)» والصحيح <span class="ltr">T (N.m)</span>؛ ولا توجد شبكة للجدول (7-1).</li></ol></div>`}
 ],
 lab:(el)=>bench(el,{type:'series',prefix:'d7',fig:'(7)',figRef:'ص 32',benchTitle:'منضدة محرك التوالي',T0:0,
  benchNote:`التشغيل وعزم الفرملة أقل من ${lt(EXP7_TMIN+' N.m')} (أصغر حمل في جداول التجربة) ممنوع.`,
  partNames:['أولاً','ثانياً'],tables:['7-1','7-2'],
  meterNote:'تيار المنتج هو نفسه تيار ملف التوالي، فالمجال يقوى ويضعف مع الحمل. العزم المقروء هو عزم الفرملة؛ المحرك يعطي فوقه عزم الاحتكاك.',
  runaway:'هذا جموح محرك التوالي: الحمل قليل فالتيار صغير والمجال ضعيف، فارتفعت السرعة بلا حد. ارجع الفرملة إلى أصغر حمل على الأقل، ثم اضبط الحماية وشغّل من جهد صغير.',
  overspeed:'الحمل قليل على محرك التوالي — زد الفرملة.',
  plotRef:'ص 34',
  plots:[{tab:'7-2',x:'n',y:'Ia',xl:'n (rpm)',yl:'Ia (A)',cap:'I<sub>a</sub> مع n — الجدول (7-2)',dx:[0,3000],dy:[0,1]},
   {tab:'7-2',x:'n',y:'T',xl:'n (rpm)',yl:'T (N.m)',cap:'T مع n — الجدول (7-2)',dx:[0,3000],dy:[0,0.5]},
   {tab:'7-1',x:'n',y:'Vin',xl:'n (rpm)',yl:'Vin (V)',cap:'V<sub>in</sub> مع n — الجدول (7-1) (إضافة من خارج الكتاب: لا شبكة له)',dx:[0,3000],dy:[0,120]}],
  steps:EXP7_STEPS}),
 quiz:[
  {q:'في الشكل (7) يمر في ملف التوالي D1–D2:',o:['تيار المجال فقط من مصدر منفصل','نفس تيار المنتج','لا يمر فيه تيار','تيار التاكومتر'],c:1,e:'الشكل (7) ص 32: الملف على التوالي مع المنتج.'},
  {q:'لماذا يجب تحميل محرك التوالي قبل تشغيله؟',o:['ليقل تيار البدء','لأنه بلا حمل يضعف مجاله جداً فتجمح سرعته','لأن الفولتميتر يحتاج حملاً','لا يجب ذلك'],c:1,e:'الخطوة 2 ص 33 والسؤال ب ص 34.'},
  {q:'عند زيادة الحمل على محرك التوالي فإن السرعة:',o:['تزيد','تقل كثيراً','تبقى ثابتة تقريباً','تنعكس'],c:1,e:'السؤال أ.'},
  {q:'عند زيادة الحمل على محرك التوالي فإن المجال:',o:['يضعف','يقوى لأن تيار المنتج (وهو تيار المجال) يزيد','لا يتغير','ينعكس'],c:1,e:'التيار نفسه يمر في الملفين.'},
  {q:'يستخدم محرك التوالي في الجر لأن:',o:['سرعته ثابتة','عزمه كبير جداً عند السرعات المنخفضة','لا يحتاج حملاً','تياره صغير'],c:1,e:'المطلوب 2 ص 34.'},
  {q:'قارن هبوط السرعة مع زيادة الحمل في محرك التوالي بمحرك التوازي:',o:['متساويان','هبوط التوالي أكبر بكثير','هبوط التوازي أكبر بكثير','كلاهما لا تتغير سرعته'],c:1,e:'قارن جدولك (7-2) بجدول (6-2).'},
  {q:'ماذا يفعل المختبر إذا حاولت التشغيل والفرملة على T = 0؟',o:['يشغل المحرك عادياً','يمنع التشغيل ويشرح خطر الجموح','يعكس الاتجاه','يرفع الجهد تلقائياً'],c:1,e:'قرار المدرب بسبب تعارض الكتاب: يبدأ الجدولان من أصغر حمل.'}
 ]
});

})(PLCBOOK);
