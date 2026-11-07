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
  else{const R=v.Ra+v.Rse;Ia=Mod.seriesIa(v,Va,s.n,R);k=Mod.kphi(v,v.aSe*Ia);if(Ia>0){const kt=k*60/(2*PI);Bc=kt*k/R;A=kt*Ia+Bc*s.n}}
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
 if(s.arm&&!s.trip){const Va=s.Vin;if(type!=='series'){const k=s.sg*Mod.kphi(v,s.If);s.Ia=Math.max(0,(Va-k*s.n)/v.Ra);s.k=k}else{const R=v.Ra+v.Rse;s.Ia=Mod.seriesIa(v,Va,s.n,R);s.k=Mod.kphi(v,v.aSe*s.Ia)}s.Te=s.k*60/(2*PI)*s.Ia}else{s.Ia=0;s.Te=0}}

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
 const s={n:0,Ia:0,If:0,Te:0,k:0,arm:0,fld:0,Vin:0,Vf:0,T:cfg.T0||0,rf:0,ra:0,sg:1,fault:0,trip:'',peak:0,pkOn:0,pkT:0,ocT:0,ang:0,dnf:0,t:0,startV:0};
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
 const fieldI=()=>type==='sep'?(s.fld?s.Vf/v().Rf:0):type==='shunt'?(s.arm&&!s.trip&&!s.fault?s.Vin/v().Rf:0):v().aSe*s.Ia;
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
  s[key]=s[key]?0:1;b.setAttribute('aria-pressed',s[key]?'true':'false');s.sg=(s.rf?-1:1)*(s.ra?-1:1);did.rev=1;
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
  if(type==='sep')s.If=s.fld?s.Vf/vv.Rf:0;else if(type==='shunt')s.If=s.arm&&!s.trip&&!s.fault?s.Vin/vv.Rf:0;
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
  {note:'<b>توضيح للمتدرب — ليس من الكتاب:</b> شبكات الكتاب تضع السرعة n على المحور الأفقي مع أنها القيمة التي نقيسها (التابعة). أبقينا محاور الكتاب كما هي. والغرض يذكر «التيار مع العزم» ولا شبكة له في الكتاب، فأضفنا في المختبر منحنى \\(I_a\\) مع T (إضافة من خارج الكتاب).'},
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
  {err:`<b>ملاحظات على الكتاب (الوحدة الثانية والتجربة الخامسة):</b><ol style="margin:6px 0 0;padding-inline-start:20px">
   <li>الفهرس يضع الوحدة الثانية في ص 23، وصفحة غلافها فعلياً ص 22 (ص 23 صفحة الأهداف).</li>
   <li>الهدف التفصيلي 1 مطبوع «لمحرك التغذية المنفصلة التغذية» (كلمة مكررة) — صُحح أعلاه.</li>
   <li>الهدف التفصيلي 5 عن «المحرك المركب بنوعيه» ولا توجد له تجربة في الكتاب: الوحدة تنتهي بالتجربة السابعة (محرك التوالي).</li>
   <li>الشرح (ص 24) يحمّل المحرك بمولد مزدوج ويحسب العزم من قدرته، بينما الشكل (5) والجداول تستعمل جهاز فرملة يُضبط عليه العزم مباشرة. اعتمدنا الفرملة.</li>
   <li>على جهاز الفرملة في الشكل (5) طُبعت الوحدة «m.N» والصحيح <span class="ltr">N.m</span>، وعلى الشبكة «T(nm)» والصحيح <span class="ltr">T (N.m)</span>.</li>
   <li>في الجدول (5-3) طُبعت القيمتان 0.15 و0.2 مشوهتين بخلط الأرقام واتجاه الكتابة («١٥0.» و«٢0.») — صُححتا.</li>
   <li>في السؤال v: «وتبار المجال» والصحيح «وتيار المجال» — صُحح.</li>
   <li>لم تُذكر قائمة الأجهزة؛ استخرجناها من مخطط التوصيل.</li>
   <li>الغرض يذكر منحنى «التيار مع العزم» ولا توجد له شبكة؛ وشبكات الكتاب تضع n على المحور الأفقي.</li></ol>`}
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
  {err:`<b>ملاحظات على الكتاب (التجربة السادسة):</b><ol style="margin:6px 0 0;padding-inline-start:20px">
   <li>قائمة الأجهزة (ص 29) تقول «محرك تيار مستمر توالي» والصحيح «توازي» كما في المخطط — صُحح أعلاه.</li>
   <li>الأميتر غير مذكور في قائمة الأجهزة رغم وجوده في المخطط.</li>
   <li>الجدول الثاني (ص 30) مسمى تحته «جدول (5-3)» والصحيح «جدول (6-2)» كما في نص الخطوة — صُحح.</li>
   <li>على شبكة المنحنى «T(nm)» والصحيح <span class="ltr">T (N.m)</span>، وعلى جهاز الفرملة «m.N».</li>
   <li>في السؤال هـ: «لأحدهم» والصحيح «لأحدهما» — صُحح.</li>
   <li>معامل التنظيم في السؤال هـ لم يُعرَّف في الكتاب؛ أضفنا تعريفه (إضافة من خارج الكتاب).</li></ol>`}
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
  {err:`<b>تعارض في خطوات الكتاب:</b> الخطوة 2 تقول «يجب أن يكون المحرك محملاً قبل بدء الحركة» (وكذلك السؤال الثاني)، ثم الخطوة 3 تطلب <span class="ltr">T = 0 N.m</span>، والجدول (7-2) يبدأ من <span class="ltr">T = 0</span>. محرك التوالي بلا حمل يجمح. <b>في المختبر:</b> يُمنع التشغيل عند T = 0 برسالة حمراء، ويبدأ الجدولان من أصغر حمل في الكتاب <span class="ltr">T = ${EXP7_TMIN} N.m</span>: الجدول (7-1) يُسجَّل عند <span class="ltr">T = ${EXP7_TMIN} N.m</span> بدل الصفر، وعمود <span class="ltr">T = 0</span> في الجدول (7-2) لا يُسجَّل.`},
  {h:'منحنى العلاقة',ref:'ص 33–34',html:'<p>«ارسم العزم (T) وتيار المنتج (I<sub>a</sub>) مع سرعة الدوران (n).» في الكتاب شبكتان: المحور الرأسي <span class="ltr">Ia (A)</span> والأفقي <span class="ltr">n (rpm)</span>، والمحور الرأسي <span class="ltr">T (N.m)</span> والأفقي <span class="ltr">n (rpm)</span> — وكلاهما من الجدول (7-2). لا توجد شبكة للجدول (7-1)؛ أضفنا في المختبر منحنى V<sub>in</sub> مع n منه (إضافة من خارج الكتاب).</p>'},
  {h:'المطلوب',ref:'ص 34',html:`<ol><li>ناقش النتائج التي حصلت عليها وسجل ملاحظاتك على التجربة.</li><li>علل لماذا يستخدم محرك التوالي في الجر وكذلك في الأحوال التي يقترن فيها الطلب على عزم دوران ثقيل، وكذلك وجود حمل ميت على المحرك (Dead load)؟ يمكنك الاستعانة بمنحنيات الخواص التي حصلت عليها.</li></ol>
   ${Q('المطلوب 2:','لماذا يستخدم محرك التوالي في الجر والأحمال الثقيلة؟','من منحنياتك: عند السرعات المنخفضة (بدء الحركة والحمل الثقيل) يكون التيار كبيراً والمجال قوياً، فيعطي المحرك عزماً كبيراً جداً — وهذا ما يلزم لتحريك قطار أو رافعة من السكون أو حمل ميت ثقيل. وعندما يخف الحمل ترتفع السرعة تلقائياً، فتبقى القدرة متقاربة. لكن يجب أن يبقى الحمل مربوطاً بالمحرك دائماً (تروس لا سيور) حتى لا يجمح.')}`},
  {h:'الأسئلة',ref:'ص 34',html:`<p>«بعد الانتهاء من التجربة يمكنك الإجابة على الأسئلة التالية:»</p>
   ${Q('أ.','ما هو تأثير زيادة الحمل على كل من تيار المنتج والعزم المتولد والسرعة لمحرك التوالي؟','تيار المنتج يزيد (وهو نفسه تيار المجال فيقوى المجال)، والعزم المتولد يزيد بسرعة (أسرع من زيادة التيار)، والسرعة تقل كثيراً — أكثر بكثير من محرك التوازي (جدولك 7-2).')}
   ${Q('ب.','لماذا يجب أن يتم تحميل محرك التوالي قبل تشغيله؟','لأنه بلا حمل يكون التيار صغيراً جداً، وهذا التيار نفسه هو تيار المجال، فيضعف المجال جداً وترتفع السرعة إلى قيم خطيرة (جموح) قد تمزق المنتج والمبدل.')}`},
  {err:`<b>ملاحظات على الكتاب (التجربة السابعة):</b><ol style="margin:6px 0 0;padding-inline-start:20px">
   <li>الغرض (ص 32) مطبوع «لمحرك التوازي» (منقول من التجربة السادسة) والصحيح «لمحرك التوالي» — صُحح أعلاه.</li>
   <li>الأميتر غير مذكور في قائمة الأجهزة رغم وجوده في المخطط.</li>
   <li>الخطوة «ثانياً 1»: «قم بثبت» والصحيح «قم بتثبيت» — صُحح.</li>
   <li>تعارض «يجب أن يكون المحرك محملاً» مع «T = 0 N.m» — انظر الملاحظة الحمراء فوق.</li>
   <li>السؤال الثاني مطبوع بلا حرف؛ الأرجح «ب».</li>
   <li>شبكة العزم مكتوب عليها «T(n.m)» والصحيح <span class="ltr">T (N.m)</span>؛ ولا توجد شبكة للجدول (7-1).</li></ol>`}
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
