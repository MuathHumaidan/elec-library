/* Unit 3 — محركات التيار المستمر والمتردد كمحركات للتحريك (ص 32–42)
   u3-l1 = أنواع محركات التحريك + محرك التوالي (ص 32–36)
   u3-l2 = المحرك المركب التراكمي والتفاضلي (ص 37–39)
   u3-l3 = المحرك العام والمحرك الحثي ثلاثي الأوجه + أسئلة الوحدة (ص 39–42)
   لا توجد في الوحدة أمثلة محلولة (فلا تبويب «الأمثلة المحلولة»). */
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
   نموذج محرك التيار المستمر للتحريك (أرقام توضيحية — قيم المدرب)
   kφ (V لكل rpm) = دالة في تيار المنتج حسب نوع التوصيل، مع حد تشبع.
   E = kφ·n ،  V = E + Ia·R ،  T = (60/2π)·kφ·Ia
   قبل التشبع في محرك التوالي kφ = c·Ia  ⇒ T ∝ Ia² ؛ بعده kφ ثابت ⇒ T ∝ Ia  (الشكل 3-1)
   ===================================================================== */
function dcModel(v,type){
  const kmin=1e-4;
  const x=I=>{I=Math.max(I,0);switch(type){
    case 'series':return v.c*I;
    case 'shunt':return v.ksh;
    case 'cum':return v.ksh+v.c*I;
    case 'diff':return v.ksh-v.c*I;}};
  const ks=type==='series'&&v.Is!=null?v.c*v.Is:v.ksat;
  const kp=I=>Math.max(kmin,Math.min(x(I),ks));
  const T=I=>KT*kp(I)*Math.max(I,0);
  const n=I=>(v.V-I*v.R)/kp(I);
  const Imax=v.V/v.R;
  /* نقطة التشغيل لعزم كلي Tt = حمل + احتكاك: أصغر تيار يعطي هذا العزم */
  const op=Tt=>{Tt=Math.max(Tt,1e-9);const N=1200;
    for(let i=1;i<=N;i++){const I=Imax*i/N;if(T(I)>=Tt){let lo=Imax*(i-1)/N,hi=I;for(let k=0;k<40;k++){const m=(lo+hi)/2;if(T(m)>=Tt)hi=m;else lo=m}const Ia=(lo+hi)/2;return {ok:true,I:Ia,n:Math.max(0,n(Ia)),T:T(Ia),k:kp(Ia)}}}
    return {ok:false,I:NaN,n:type==='diff'?Infinity:0,T:NaN,k:NaN}};
  const Tpk=()=>{let m=0;for(let i=1;i<=800;i++)m=Math.max(m,T(Imax*i/800));return m};
  return {kp,T,n,op,Imax,ks,Tpk,x};
}
/* أصغر حمل يبقي السرعة تحت حد معين (n تتناقص مع Ia) */
function minLoadFor(M,nLim,Tf){if(M.n(1e-6)<=nLim)return 0;let lo=1e-6,hi=M.Imax;for(let k=0;k<60;k++){const m=(lo+hi)/2;if(M.n(m)>nLim)lo=m;else hi=m}return Math.max(0,M.T(hi)-Tf)}

/* ---------- static figure helpers (theory) ---------- */
const SER_DEF={V:220,R:0.5,c:0.005,Is:40,Tf:2};
function fig31(){const M=dcModel(SER_DEF,'series'),I1=110,A=SER_DEF.Is;
  const pT=[],pn=[],pc=[];for(let i=1;i<=220;i++){const I=I1*i/220;pT.push([I,M.T(I)]);pn.push([I,M.n(I)]);pc.push([M.T(I),M.n(I)])}
  const Tm=M.T(I1)*1.05,nm=4000;
  const a=plot({w:260,h:200,x0:0,x1:I1,y0:0,y1:Tm,xl:'Ia',yl:'Torque',series:[{pts:pT.filter(p=>p[0]<=A),col:'--blue'},{pts:pT.filter(p=>p[0]>=A),col:'--live'}],dots:[{x:0,y:0,lbl:'O',dx:14,dy:-6,a:'start'},{x:A,y:M.T(A),lbl:'A'},{x:I1,y:M.T(I1)*0.99,lbl:'B'}],aria:'العزم مع تيار المنتج'});
  const b=plot({w:260,h:200,x0:0,x1:I1,y0:0,y1:nm,xl:'Ia',yl:'Speed',series:[{pts:pn,col:'--blue'}],vl:[{v:6,col:'--stop'}],aria:'السرعة مع تيار المنتج'});
  const c=plot({w:260,h:200,x0:0,x1:Tm,y0:0,y1:nm,xl:'Torque',yl:'Speed',series:[{pts:pc,col:'--blue'}],aria:'السرعة مع العزم'});
  return `<div class="e34-figs"><figure>${box(a)}(a) <span class="ltr">T = f(I<sub>a</sub>)</span></figure><figure>${box(b)}(b) <span class="ltr">n = f(I<sub>a</sub>)</span></figure><figure>${box(c)}(c) <span class="ltr">n = f(T)</span></figure></div><p class="sub">رسم بقيم توضيحية. في (a): الجزء الأزرق OA قبل التشبع <span class="ltr">(T ∝ I<sub>a</sub>²)</span> والبرتقالي AB بعده <span class="ltr">(T ∝ I<sub>a</sub>)</span>. الخط الأحمر المتقطع في (b) عند تيار صغير جداً: منطقة السرعة الخطرة (اللاحمل).</p>`}
const CMP_DEF={V:220,R:0.5,ksh:0.12,c:0.0012,ksat:0.25,Tf:1};
function figCompound(type){const M=dcModel(CMP_DEF,type),I1=type==='diff'?48:100,Msh=dcModel(CMP_DEF,'shunt');
  const pT=[],pn=[],pc=[];for(let i=1;i<=200;i++){const I=I1*i/200;pT.push([I,M.T(I)]);pn.push([I,M.n(I)]);pc.push([M.T(I),M.n(I)])}
  const Tm=niceMax(Math.max(...pT.map(p=>p[1]))*1.1),nm=type==='diff'?4500:2200,n0=M.n(0.001);
  const extraA=type==='diff'?[{pts:[[0,0],[I1,Msh.T(I1)*1.25]],col:'--muted',dash:'6 5',w:1.6}]:[];
  const hl=type==='diff'?[{v:n0,col:'--muted'}]:[];
  const a=plot({w:260,h:200,x0:0,x1:I1,y0:0,y1:Tm,xl:'Ia',yl:'Torque',series:[...extraA,{pts:pT,col:'--blue'}],aria:'العزم مع تيار المنتج'});
  const b=plot({w:260,h:200,x0:0,x1:I1,y0:0,y1:nm,xl:'Ia',yl:'Speed',series:[{pts:pn,col:'--blue'}],hl,aria:'السرعة مع تيار المنتج'});
  const c=plot({w:260,h:200,x0:0,x1:Tm,y0:0,y1:nm,xl:'Torque',yl:'Speed',series:[{pts:pc,col:'--blue'}],hl,aria:'السرعة مع العزم'});
  return `<div class="e34-figs"><figure>${box(a)}(a) <span class="ltr">T = f(I<sub>a</sub>)</span></figure><figure>${box(b)}(b) <span class="ltr">n = f(I<sub>a</sub>)</span></figure><figure>${box(c)}(c) <span class="ltr">n = f(T)</span></figure></div><p class="sub">رسم بقيم توضيحية.${type==='diff'?' الخط المتقطع المائل في (a) للمقارنة بزيادة خطية أشد ميلاً، والخط الأفقي المتقطع في (b) و(c) عند سرعة اللاحمل: المنحنى يرتفع فوقه.':''}</p>`}

/* محرك التوالي العام — نقاط الشكل (3-4) مقروءة تقريبياً من رسم الكتاب (pu) */
const UNI_AC=[[0.1,4.0],[0.2,3.3],[0.4,2.5],[0.6,1.8],[0.8,1.4],[1.0,1.0]];
const UNI_DC=[[0.5,4.0],[0.6,3.2],[0.8,2.1],[0.9,1.6],[1.0,1.25]];
/* سرعة عند عزم معين بالاستكمال الخطي بين النقاط (العزم يتناقص مع السرعة) */
function uniSpeed(P,T){for(let i=0;i<P.length-1;i++){const [n1,t1]=P[i],[n2,t2]=P[i+1];if(T<=t1&&T>=t2)return n1+(t1-T)/(t1-t2)*(n2-n1)}return NaN}
function fig34(o){o=o||{};const Tl=o.T;
  const dots=[];if(Tl!=null){const na=uniSpeed(UNI_AC,Tl),nd=uniSpeed(UNI_DC,Tl);dots.push({x:na,y:Tl,col:'--live',ring:1},{x:nd,y:Tl,col:'--blue',ring:1})}
  return plot({w:o.w||420,h:o.h||270,x0:0,x1:1.05,y0:0,y1:4.2,xt:[0.2,0.4,0.6,0.8,1.0],yt:[0,1,2,3,4],xf:v=>v.toFixed(1),yf:v=>v.toFixed(1),xl:'Speed (pu)',yl:'Torque (pu)',
   series:[{pts:UNI_AC,col:'--live'},{pts:UNI_DC,col:'--blue'}],hl:Tl!=null?[{v:Tl,col:'--fg',dash:'4 4'}]:[],dots:[...UNI_AC.map(p=>({x:p[0],y:p[1],col:'--live',r:3})),...UNI_DC.map(p=>({x:p[0],y:p[1],col:'--blue',r:3})),...dots],
   extra:(X,Y)=>S.t(fx(X(0.3)),fx(Y(2.75)),'A.C','b','end')+S.t(fx(X(0.86)),fx(Y(2.6)),'D.C','b','start'),aria:'خواص محرك التوالي العام على التيار المستمر والمتردد'})}

/* المحرك الحثي — منحنى العزم والانزلاق (للرسم وللمختبر). الصيغة ليست من الكتاب (معادلة كلوس) */
const kloss=(s,Tm,sm)=>s<=0?0:2*Tm/(s/sm+sm/s);
function fig35(o){o=o||{};const Tm=o.Tm||2.5,sm=o.sm||0.25,ns=o.ns||1500,W=o.w||460,H=o.h||290;
  const pts=[];for(let i=0;i<=300;i++){const s=1-i/300;pts.push([1-s,kloss(s,Tm,sm)])}
  const Tst=kloss(1,Tm,sm),ymax=niceMax(Tm*1.18);
  const bands=o.bands?[{x0:0,x1:1-sm,col:'--live-soft'},{x0:1-sm,x1:1,col:'--on-soft'}]:[];
  const dots=(o.dots||[]);
  return plot({w:W,h:H,left:46,x0:0,x1:1,y0:0,y1:ymax,xt:[0,0.2,0.4,0.6,0.8,1],yt:ticks(ymax,4),xf:v=>o.pu?v.toFixed(1):fm(v*ns,0),yf:v=>fm(v,1),xl:o.pu?'n / ns':'Speed n (rpm)',yl:'Torque T',bands,
    series:[{pts,col:'--blue'}],vl:[{v:1-sm,col:'--fg'}],hl:o.TL!=null?[{v:o.TL,col:'--stop',dash:'6 4'}]:[],
    dots:[{x:0,y:Tst,lbl:'T starting',dx:8,dy:-6,a:'start'},{x:1-sm,y:Tm,lbl:'T max',dx:8,dy:-8,a:'start'},...dots],
    right:24,extra:(X)=>S.t(fx(X(1-sm)+4),H-34-5,'sm','b','start'),aria:'العزم مع السرعة والانزلاق'})}
function slipAxis(sm,W){W=W||460;const L=46,R=24,X=x=>L+x*(W-L-R);let s=`<svg viewBox="0 0 ${W} 34" role="img" aria-label="محور الانزلاق">`;
  s+=`<path d="M${L} 8H${W-R}" stroke="var(--fg)" stroke-width="1.2"/>`;[0,0.2,0.4,0.6,0.8,1].forEach(x=>{s+=`<path d="M${fx(X(x))} 5V11" stroke="var(--fg)"/>`+S.t(fx(X(x)),24,(1-x).toFixed(1),'m')});
  s+=`<path d="M${fx(X(1-sm))} 2V14" stroke="var(--blue-ink)" stroke-width="2"/>`+S.t(L-4,12,'Slip s','m','end');return s+'</svg>'}

/* ---------- circuit drawing: DC motor with series / shunt field ---------- */
function dcCircuitSVG(o){o=o||{};const on=!!o.on,type=o.type||'series',ang=o.ang||0;const c=on?'flow':'';const cs=on?'live':'';
  let s=`<svg viewBox="0 0 420 200" role="img" aria-label="دائرة محرك التيار المستمر">`;
  s+=`<path class="w ${cs}" d="M40 40V78M40 108V170"/><path d="M26 78H54" stroke="var(--fg)" stroke-width="2.6"/><path d="M32 88H48" stroke="var(--fg)" stroke-width="2.6"/><path d="M26 98H54" stroke="var(--fg)" stroke-width="2.6"/><path d="M32 108H48" stroke="var(--fg)" stroke-width="2.6"/>`;
  s+=S.t(18,72,'+','')+S.t(18,118,'−','')+S.t(40,190,'V','');
  s+=`<path class="w ${cs}" d="M40 40H80"/><path class="w ${c}" d="M${on?'80 40H112':'80 40L108 26'}"/><circle cx="80" cy="40" r="3" fill="var(--fg)"/><circle cx="112" cy="40" r="3" fill="var(--fg)"/>`;
  s+=`<path class="w ${c}" d="M112 40H140"/><circle cx="156" cy="40" r="15" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/>`+S.t(156,45,'A','');
  const hasSe=type!=='shunt',hasSh=type!=='series';
  if(hasSe){s+=`<path class="w ${c}" d="M171 40H196"/>`;
    let p='M196 40';for(let i=1;i<=4;i++)p+=`A8 8 0 0 1 ${196+16*i} 40`;s+=`<path class="w ${c}" d="${p}"/>`+S.t(196,28,'D1','m')+S.t(260,28,'D2','m')+arT(228,64,type==='diff'?'ملف التوالي (معاكس)':'ملف التوالي',{fs:10.5,col:'--muted'});
    s+=`<path class="w ${c}" d="M260 40H330V72"/>`}
  else s+=`<path class="w ${c}" d="M171 40H330V72"/>`;
  s+=`<circle cx="330" cy="100" r="28" fill="var(--surface)" stroke="var(--fg)" stroke-width="2"/>`+S.t(330,105,'M','')+`<g transform="rotate(${fx(ang)} 330 100)"><path d="M330 100L330 76" stroke="var(--live)" stroke-width="3" stroke-linecap="round"/></g>`;
  s+=`<path class="w ${c}" d="M330 128V170H40"/>`;
  s+=`<path class="w ${cs}" d="M70 40V85M70 115V170"/><circle cx="70" cy="100" r="15" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/>`+S.t(70,105,'V','');
  if(hasSh){let p='M384 60';for(let i=1;i<=4;i++)p+=`A8 8 0 0 1 384 ${60+16*i}`;s+=`<path class="w ${cs}" d="M300 40V20H384V60"/><path class="w ${cs}" d="${p}"/><path class="w ${cs}" d="M384 124V170H330"/>`+S.t(398,64,'E1','m','start')+S.t(398,126,'E2','m','start')+arT(380,190,'ملف التوازي',{fs:10.5,col:'--muted'})}
  return s+'</svg>'}

/* =====================================================================
   Lesson 1 — أنواع محركات التحريك + محرك التوالي (ص 32–36)
   ===================================================================== */
const SER_TP=[
  {k:'V',label:'جهد المصدر V',unit:'V',value:220,min:10,max:5000,step:1},
  {k:'R',label:'مقاومة المنتج وملف التوالي معاً R<sub>a</sub> + R<sub>s</sub>',unit:'Ω',value:0.5,min:0.01,max:100,step:0.01},
  {k:'c',label:'ثابت المجال قبل التشبع: kφ لكل 1 A من تيار المنتج (يكبر مع عدد لفات ملف التوالي)',unit:'V/(rpm·A)',value:0.005,min:0.00001,max:1,step:0.0001,hint:'الجهد العكسي E = kφ × n، و kφ = الثابت × Ia حتى نقطة التشبع A'},
  {k:'Is',label:'تيار المنتج الذي يبدأ عنده التشبع (النقطة A)',unit:'A',value:40,min:0.1,max:10000,step:0.1},
  {k:'Tf',label:'عزم الاحتكاك والتهوية (حمل لا يمكن إزالته)',unit:'N·m',value:2,min:0.05,max:5000,step:0.05,hint:'لا يمكن أن يكون صفراً: بلا أي عزم مقاوم تصبح سرعة محرك التوالي بلا حد'},
  {k:'IaN',label:'تيار المنتج المقنن (لحساب العزم المقنن والتحذير)',unit:'A',value:50,min:0.1,max:10000,step:0.1},
  {k:'nMax',label:'أقصى سرعة مسموحة (تفصل الحماية المصدر عندها)',unit:'rpm',value:3000,min:100,max:50000,step:10},
  {k:'tau',label:'ثابت زمن التسارع (يكبر مع ثقل العضو الدوار)',unit:'s',value:1.5,min:0.1,max:60,step:0.1,hint:'تقترب السرعة من قيمتها الجديدة بثابت زمن قدره هذه القيمة'}];

lesson({
 id:'u3-l1',unit:3,order:1,pages:'32–36',
 title:'أنواع محركات التحريك، وخواص محرك التوالي للتيار المستمر',
 summary:'أنواع المحركات المستخدمة في التحريك الكهربائي: محركات التيار المستمر والمحركات الحثية والتزامنية. ثم خواص محرك التوالي: العزم يتناسب مع مربع تيار المنتج قبل التشبع ومع التيار نفسه بعده، والسرعة تنخفض كلما زاد الحمل، ولا يُشغَّل بلا حمل.',
 stations:[
  {intro:true},

  {st:1,short:'أهداف الوحدة',title:'الوحدة الثالثة: الهدف العام والأهداف التفصيلية',ref:'ص 33',
   q:'أي المحركات تصلح لتحريك قطار أو رافعة؟ هذه الوحدة تعرّفك بخواص أربعة منها.',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="بطاقتان: محركات التيار المستمر (التوالي والمركب) ومحركات التيار المتردد (العام والحثي ثلاثي الأوجه)" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><text x="180" y="50" text-anchor="middle" font-size="15" font-weight="700" fill="#2C4A40">خواص محركات التحريك</text><g data-tip="الهدف التفصيلي الأول: خواص محرك التوالي (الدرس الأول من الوحدة) والمحرك المركب (الدرس الثاني)."><rect x="40" y="68" width="280" height="96" rx="14" fill="#F2C14E" stroke="#2C4A40" stroke-width="3"/><text x="180" y="96" text-anchor="middle" font-size="14.5" font-weight="700" fill="#2C4A40">محركات التيار المستمر</text><rect x="190" y="112" width="112" height="36" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="246" y="135" text-anchor="middle" font-size="13" fill="#2C4A40">التوالي</text><rect x="58" y="112" width="112" height="36" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="114" y="135" text-anchor="middle" font-size="13" fill="#2C4A40">المركب</text></g><g data-tip="الهدف التفصيلي الثاني: خواص المحرك العام والمحرك الحثي ثلاثي الأوجه (الدرس الثالث من الوحدة)."><rect x="40" y="178" width="280" height="96" rx="14" fill="#4FB3A9" stroke="#2C4A40" stroke-width="3"/><text x="180" y="206" text-anchor="middle" font-size="14.5" font-weight="700" fill="#2C4A40">محركات التيار المتردد</text><rect x="210" y="222" width="92" height="36" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="256" y="245" text-anchor="middle" font-size="13" fill="#2C4A40">العام</text><rect x="58" y="222" width="140" height="36" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="128" y="245" text-anchor="middle" font-size="13" fill="#2C4A40">الحثي ثلاثي الأوجه</text></g><text x="180" y="300" text-anchor="middle" font-size="13" fill="#2C4A40">أربعة محركات في ثلاثة دروس</text></svg>`,
   cap:'هدفا الوحدة: خواص محركين للتيار المستمر ومحركين للتيار المتردد.<br><b>مرّر المؤشر على كل بطاقة (أو المسها في الجوال) لتعرف الدرس الذي يشرحها.</b>',
   side:[
    {predict:{q:'أي هذه المحركات <b>لا</b> تدرس خواصه في هذه الوحدة؟',opts:[
     ['محرك التيار المستمر التوالي',false,'هذا موضوع الدرس الأول من الوحدة.'],
     ['المحرك الحثي ثلاثي الأوجه',false,'هذا من محركات التيار المتردد المستخدمة في التحريك، وهو في الدرس الثالث.'],
     ['محرك التيار المستمر المركب',false,'هذا موضوع الدرس الثاني.'],
     ['المولد التزامني',true,'الوحدة عن المحركات المستخدمة في التحريك فقط: التوالي والمركب للتيار المستمر، والعام والحثي للتيار المتردد.']]}}
   ],
   body:[
    {book:String.raw`<p><b>الهدف العام للوحدة:</b> معرفة خواص محركات التيار المستمر والتيار المتردد المستخدمة في التحريك الكهربائي.</p>
     <p><b>الأهداف التفصيلية:</b></p><ul><li>أن يعرف المتدرب خواص محركات التيار المستمر من النوع التوالي والمركب.</li><li>أن يعرف المتدرب خواص محركات التيار المتردد المستخدمة في التحريك.</li></ul>`,ref:'ص 33'},
    {tip:String.raw`<p>«الخواص» هنا تعني ثلاث علاقات ستتكرر مع كل محرك: <b>العزم مع تيار المنتج</b>، و<b>السرعة مع تيار المنتج</b>، و<b>السرعة مع العزم</b>. والسؤال الذي يجمعها: كيف يتصرف المحرك عندما يزيد حمله أو ينقص؟</p>`}
   ]},

  {st:2,short:'أنواع المحركات',title:'أنواع المحركات الكهربائية المستخدمة في التحريك الكهربائي',ref:'ص 34',
   q:'محرك يبدأ حمله ثقيلاً، وآخر يجب أن تبقى سرعته ثابتة، وثالث قدرته كبيرة جداً: هل يصلح لها محرك واحد؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ثلاث بطاقات: محركات التيار المستمر، والمحركات الحثية بنوعيها، والمحركات التزامنية" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="محركات التيار المستمر: سرعات مطلوبة بدقة، ومدى واسع لتغيير السرعة، وسهولة السيطرة وعكس الاتجاه، وعزم بدء مناسب. الرمز ⟦M⟧ داخل دائرة = محرك، والخطان تحته = تيار مستمر."><rect x="244" y="52" width="100" height="214" rx="14" fill="#F2C14E" stroke="#2C4A40" stroke-width="3"/><circle cx="294" cy="108" r="30" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><text x="294" y="115" text-anchor="middle" font-size="20" font-weight="700" fill="#2C4A40">M</text><line x1="282" y1="124" x2="306" y2="124" stroke="#2C4A40" stroke-width="2.5"/><line x1="282" y1="129" x2="288" y2="129" stroke="#2C4A40" stroke-width="2.5"/><line x1="291" y1="129" x2="297" y2="129" stroke="#2C4A40" stroke-width="2.5"/><line x1="300" y1="129" x2="306" y2="129" stroke="#2C4A40" stroke-width="2.5"/><text x="294" y="168" text-anchor="middle" font-size="13" font-weight="700" fill="#2C4A40">التيار المستمر</text><text x="294" y="200" text-anchor="middle" font-size="12" fill="#2C4A40">سرعة دقيقة</text><text x="294" y="220" text-anchor="middle" font-size="12" fill="#2C4A40">وتحكم سهل</text></g><g data-tip="المحركات الحثية نوعان: ذو القفص السنجابي (بسيط ورخيص وصلب، للسرعة الثابتة)، وذو العضو الدوار الملفوف (عزم بدء كبير بتيار بدء أقل، وسهولة التحكم). الرمز ⟦3~⟧ = تيار متردد ثلاثي الأوجه."><rect x="130" y="52" width="100" height="214" rx="14" fill="#4FB3A9" stroke="#2C4A40" stroke-width="3"/><circle cx="180" cy="108" r="30" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><text x="180" y="112" text-anchor="middle" font-size="20" font-weight="700" fill="#2C4A40">M</text><text x="180" y="130" text-anchor="middle" font-size="12" font-weight="700" fill="#2C4A40">3~</text><text x="180" y="168" text-anchor="middle" font-size="13" font-weight="700" fill="#2C4A40">الحثية</text><rect x="140" y="184" width="80" height="30" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.6"/><text x="180" y="204" text-anchor="middle" font-size="11.5" fill="#2C4A40">قفص سنجابي</text><rect x="140" y="222" width="80" height="30" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.6"/><text x="180" y="242" text-anchor="middle" font-size="11.5" fill="#2C4A40">دوار ملفوف</text></g><g data-tip="المحركات التزامنية: سرعة دوران ثابتة القيمة وقدرات كبيرة، ويمكن تصميمها لسرعات بطيئة بمعامل قدرة عالٍ وكفاءة مرتفعة. الرمز ⟦MS⟧ = محرك تزامني."><rect x="16" y="52" width="100" height="214" rx="14" fill="#CFE6DB" stroke="#2C4A40" stroke-width="3"/><circle cx="66" cy="108" r="30" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><text x="66" y="112" text-anchor="middle" font-size="18" font-weight="700" fill="#2C4A40">MS</text><text x="66" y="130" text-anchor="middle" font-size="12" font-weight="700" fill="#2C4A40">3~</text><text x="66" y="168" text-anchor="middle" font-size="13" font-weight="700" fill="#2C4A40">التزامنية</text><text x="66" y="200" text-anchor="middle" font-size="12" fill="#2C4A40">سرعة ثابتة</text><text x="66" y="220" text-anchor="middle" font-size="12" fill="#2C4A40">وقدرة كبيرة</text></g><text x="180" y="298" text-anchor="middle" font-size="13" fill="#2C4A40">لكل نوع تطبيقات تناسبه</text></svg>`,
   cap:'أهم المحركات المستخدمة في التحريك الكهربائي، وأبرز ما يميز كل نوع.<br><b>مرّر المؤشر على كل بطاقة (أو المسها في الجوال) لتعرف مزايا النوع ومعنى رمزه.</b>',
   side:[
    {predict:{q:'تطبيق يحتاج <b>عزماً كبيراً لبدء الحركة مع تيار بدء أقل</b>. أي نوع يذكره الكتاب له؟',opts:[
     ['الحثي ذو القفص السنجابي',false,'هذا النوع يناسب التطبيقات التي تحتاج سرعة دوران ثابتة، ومزاياه البساطة والرخص والصلابة.'],
     ['التزامني',false,'التزامني للسرعة الثابتة والقدرات الكبيرة.'],
     ['الحثي ذو العضو الدوار الملفوف',true,'نص الكتاب في ص 34: «وهو مناسب للتطبيقات التي تحتاج لعزم كبير لبدء حركتها مع نقص في قيمة تيار بدء الحركة».']]}}
   ],
   body:[
    {book:String.raw`<p>هناك عدة أنواع من المحركات الكهربائية، المستخدمة في التحريك الكهربائي بصفة عامة وتختلف فيما بينها، حسب طبيعة مصدر التغذية، وطريقة تركيبها ونظرية عملها، وأهم هذه المحركات:</p>
     <p><b>أ) محركات التيار المستمر:</b> تتميز محركات التيار المستمر بأنها تدور بالسرعات المطلوبة بدقة، وذات مدى واسع لتغيير السرعة، مع إمكانية السيطرة عليها بسهولة، وإمكانية عكس اتجاه حركتها الدورانية، بالإضافة إلى تميزها بعزم بدء حركة مناسب.</p>
     <p><b>ب) المحركات الحثية:</b> يوجد منها نوعان: النوع الأول عضوه الدوار ذو <b>القفص السنجابي</b>، ويتميز ببساطة تركيبه وبقلة تكاليفه وصلابته، هذا النوع مناسب للتطبيقات التي تحتاج إلى سرعة دوران ثابتة. النوع الثاني هو المحرك ذو <b>العضو الدوار الملفوف</b>، وهو مناسب للتطبيقات التي تحتاج لعزم كبير لبدء حركتها مع نقص في قيمة تيار بدء الحركة، ويمتاز هذا النوع عن سابقه بسهولة التحكم فيه من حيث السرعة وعزم وتيار بدء الحركة.</p>
     <p><b>ج) المحركات التزامنية:</b> هذا النوع من المحركات مناسب للتطبيقات التي تحتاج سرعة دوران ثابتة القيمة وقدرات كبيرة بالإضافة إلى إمكانية تصميمها لتعمل عند سرعات بطيئة بمعامل قدرة عالٍ وبكفاءة تشغيل مرتفعة.</p>`,ref:'ص 34'},
    {tip:String.raw`<table class="tt"><thead><tr><th>النوع</th><th>أهم ما يميزه</th><th>يناسب</th></tr></thead><tbody>
     <tr><td>محركات التيار المستمر</td><td>سرعة دقيقة ومدى واسع لتغييرها، سهولة التحكم وعكس الاتجاه، عزم بدء مناسب</td><td>التحكم الدقيق في السرعة</td></tr>
     <tr><td>الحثي ذو القفص السنجابي</td><td>بسيط، رخيص، صلب</td><td>السرعة الثابتة</td></tr>
     <tr><td>الحثي ذو العضو الدوار الملفوف</td><td>عزم بدء كبير بتيار بدء أقل، سهولة التحكم في السرعة</td><td>الأحمال الثقيلة عند البدء</td></tr>
     <tr><td>التزامني</td><td>سرعة ثابتة، قدرات كبيرة، معامل قدرة عالٍ وكفاءة مرتفعة حتى في السرعات البطيئة</td><td>القدرات الكبيرة بسرعة ثابتة</td></tr></tbody></table>`,title:'الأنواع في جدول'},
    {add:String.raw`<p>المحرك القفصي هو محرك المضخات والمراوح والسيور الناقلة في أغلب المصانع، لأن سرعتها لا تحتاج إلى تغيير. أما الرافعات الكبيرة التي تبدأ حركتها وهي محمّلة فكثيراً ما تستعمل المحرك ذا العضو الدوار الملفوف.</p>`}
   ]},

  {st:3,short:'محرك التوالي',title:'محركات التيار المستمر كمحركات للتحريك — خواص محرك التوالي',ref:'ص 35',
   q:'في محرك التوالي لا يوجد مصدر مستقل لملف المجال. فمن أين يأتي تيار المجال، وماذا يحدث له عندما يزيد الحمل؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="دائرة محرك توالٍ: المصدر وملف المجال والمنتج في حلقة واحدة يمر فيها تيار واحد" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><path d="M70 140V90H140M220 90H290V134M290 186V230H70V172" fill="none" stroke="#2C4A40" stroke-width="4" stroke-linejoin="round"/><g data-tip="مصدر الجهد المستمر ⟦V⟧: الخط الطويل هو القطب الموجب ⟦+⟧ والقصير هو السالب ⟦−⟧."><line x1="48" y1="140" x2="92" y2="140" stroke="#2C4A40" stroke-width="4"/><line x1="58" y1="152" x2="82" y2="152" stroke="#2C4A40" stroke-width="6"/><line x1="48" y1="162" x2="92" y2="162" stroke="#2C4A40" stroke-width="4"/><line x1="58" y1="172" x2="82" y2="172" stroke="#2C4A40" stroke-width="6"/><text x="36" y="146" text-anchor="middle" font-size="15" font-weight="700" fill="#2C4A40">+</text><text x="36" y="178" text-anchor="middle" font-size="15" font-weight="700" fill="#2C4A40">−</text><text x="112" y="162" text-anchor="middle" font-size="15" font-weight="700" fill="#2C4A40">V</text><rect x="30" y="130" width="96" height="52" fill="transparent"/></g><g data-tip="ملف المجال موصول على التوالي مع المنتج: يمر فيه تيار المنتج ⟦Ia⟧ نفسه، فيقوى المجال كلما زاد التيار."><path d="M140 90a10 10 0 0 1 20 0a10 10 0 0 1 20 0a10 10 0 0 1 20 0a10 10 0 0 1 20 0" fill="none" stroke="#E8735A" stroke-width="5"/><text x="180" y="64" text-anchor="middle" font-size="13" font-weight="700" fill="#2C4A40">ملف المجال</text><rect x="136" y="50" width="88" height="46" fill="transparent"/></g><g data-tip="المنتج (العضو الدوار): الملف الذي يدور ويولّد العزم. الفرشتان على جانبيه توصلان التيار إليه."><circle cx="290" cy="160" r="26" fill="#CFE6DB" stroke="#2C4A40" stroke-width="3.5"/><rect x="283" y="128" width="14" height="8" fill="#2C4A40"/><rect x="283" y="184" width="14" height="8" fill="#2C4A40"/><text x="290" y="166" text-anchor="middle" font-size="16" font-weight="700" fill="#2C4A40">A</text><text x="246" y="166" text-anchor="middle" font-size="13" font-weight="700" fill="#2C4A40">المنتج</text></g><g data-tip="اتجاه التيار: تيار واحد ⟦Ia⟧ يدور في الحلقة كلها، فتيار المجال = تيار المنتج."><polygon points="112,82 124,90 112,98" fill="#12855A"/><polygon points="248,82 260,90 248,98" fill="#12855A"/><polygon points="282,104 290,116 298,104" fill="#12855A"/><polygon points="196,222 184,230 196,238" fill="#12855A"/><text x="112" y="122" text-anchor="middle" font-size="14" font-weight="700" fill="#12855A">Ia</text><text x="196" y="256" text-anchor="middle" font-size="14" font-weight="700" fill="#12855A">Ia</text></g><text x="180" y="296" text-anchor="middle" font-size="13.5" font-weight="600" fill="#2C4A40">تيار واحد يمر في المنتج وملف المجال</text></svg>`,
   cap:'في محرك التوالي يوصل ملف المجال على التوالي مع المنتج، فيمر فيهما التيار نفسه.<br><b>مرّر المؤشر على المصدر والملف والمنتج والأسهم (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'زاد الحمل على محرك التوالي فزاد تيار المنتج. ماذا يحدث للمجال المغناطيسي؟',opts:[
     ['يقل، لأن الجهد يتوزع على حمل أكبر',false,'المجال يأتي من تيار ملف المجال، وهذا التيار هو تيار المنتج نفسه، فلا يقل.'],
     ['يزداد، لأن تيار المنتج نفسه يمر في ملف المجال',true,'نص الكتاب في ص 35: «يزداد المجال المغناطيسي في محركات التوالي مع زيادة تيار المنتج بزيادة التحميل».'],
     ['لا يتغير، لأن ملف المجال لا علاقة له بالحمل',false,'هذا صحيح في محرك التوازي تقريباً، لكن ملف التوالي يمر فيه تيار المنتج.']]}}
   ],
   body:[
    {book:String.raw`<p>في محركات التيار المستمر إثارة توالي توصل ملفات المجال <b>على التوالي</b> مع ملفات المنتج. ومن الواضح أن تيار المنتج يمر في ملفات المجال، فعند زيادة التحميل يزداد تيار المنتج وبالتالي تيار المجال. إذاً <b>يزداد المجال المغناطيسي في محركات التوالي مع زيادة تيار المنتج بزيادة التحميل</b>.</p>`,ref:'ص 35'},
    {tip:String.raw`<p>حمل أكبر ← تيار منتج أكبر ← تيار مجال أكبر (لأنه التيار نفسه) ← مجال مغناطيسي أقوى. هذه الحلقة هي سر كل خواص محرك التوالي التي ستراها في المحطات الثلاث القادمة.</p>`,title:'الفكرة في سطر'}
   ]},

  {st:4,short:'العزم مع التيار',title:'أ- علاقة العزم مع تيار المنتج <span class="ltr">T = f(I<sub>a</sub>)</span>',ref:'ص 35',
   q:'إذا ضاعفنا تيار محرك التوالي، هل يتضاعف العزم فقط… أم أكثر؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="منحنى العزم مع تيار المنتج: جزء منحنٍ من O إلى A ثم خط مستقيم من A إلى B" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><rect x="40" y="36" width="290" height="236" rx="12" fill="#FBF6EE"/><path d="M60 50V250H316" fill="none" stroke="#2C4A40" stroke-width="2.5"/><polygon points="60,42 54,54 66,54" fill="#2C4A40"/><polygon points="324,250 312,244 312,256" fill="#2C4A40"/><text x="76" y="56" text-anchor="middle" font-size="15" font-weight="700" fill="#2C4A40">T</text><text x="314" y="270" text-anchor="middle" font-size="14" font-weight="700" fill="#2C4A40">Ia</text><line x1="170" y1="190" x2="170" y2="250" stroke="#7A8F86" stroke-width="1.5" stroke-dasharray="4 4"/><g data-tip="الجزء ⟦OA⟧: قبل التشبع المغناطيسي. المجال يزيد مع التيار، فالعزم يتناسب مع مربع التيار ⟦T ∝ Ia²⟧ ويظهر منحنياً."><path d="M60 250Q115 250 170 190" fill="none" stroke="#4FB3A9" stroke-width="6" stroke-linecap="round"/><path d="M60 250Q115 250 170 190" fill="none" stroke="transparent" stroke-width="22"/><text x="108" y="212" text-anchor="middle" font-size="12.5" font-weight="700" fill="#2C4A40">قبل التشبع</text></g><g data-tip="الجزء ⟦AB⟧: بعد التشبع. المجال ثابت، فالعزم يتناسب مع التيار ⟦T ∝ Ia⟧ ويظهر خطاً مستقيماً."><path d="M170 190L290 59" fill="none" stroke="#E8735A" stroke-width="6" stroke-linecap="round"/><path d="M170 190L290 59" fill="none" stroke="transparent" stroke-width="22"/><text x="270" y="150" text-anchor="middle" font-size="12.5" font-weight="700" fill="#2C4A40">بعد التشبع</text></g><g data-tip="النقطة ⟦A⟧: يصل عندها المحرك إلى التشبع المغناطيسي، فيتوقف المجال عن الزيادة."><circle cx="170" cy="190" r="7" fill="#2C4A40"/><text x="160" y="180" text-anchor="middle" font-size="15" font-weight="700" fill="#2C4A40">A</text></g><circle cx="290" cy="59" r="5" fill="#2C4A40"/><text x="280" y="54" text-anchor="middle" font-size="15" font-weight="700" fill="#2C4A40">B</text><text x="50" y="266" text-anchor="middle" font-size="15" font-weight="700" fill="#2C4A40">O</text><text x="180" y="300" text-anchor="middle" font-size="13" fill="#2C4A40">رسم توضيحي لشكل المنحنى</text></svg>`,
   cap:'الشكل <span class="ltr">(3-1a)</span> مبسطاً: منحنٍ قبل التشبع، ومستقيم بعده.<br><b>مرّر المؤشر على جزأي المنحنى والنقطة A (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'قبل التشبع المغناطيسي، تضاعف تيار المنتج. كم يصبح العزم تقريباً؟',opts:[
     ['ضعف ما كان',false,'هذا ما يحدث بعد التشبع فقط (المنحنى AB)، لأن المجال يكون ثابتاً.'],
     ['أربعة أضعاف ما كان',true,String.raw`قبل التشبع يزيد المجال مع التيار أيضاً، فالعزم يتناسب مع مربع التيار: \(2^2=4\).`],
     ['لا يتغير',false,'العزم يتناسب طردياً مع التيار ومع المجال، وكلاهما زاد.']]}}
   ],
   body:[
    {book:String.raw`<p>يتناسب العزم طردياً مع كل من تيار المنتج والمجال المغناطيسي:</p>
     <div class="eq">$$T\propto\phi\,I_a$$</div>
     <p>يعتمد المجال المغناطيسي على تيار المجال أي على تيار المنتج طالما أن العلاقة بين المجال المغناطيسي وتيار المجال علاقة خطية، أي <b>قبل</b> أن يصل المحرك إلى مستوى التشبع المغناطيسي \((\phi\propto I_a)\)، إذاً يتناسب العزم مع مربع تيار المنتج:</p>
     <div class="eq">$$T\propto I_a^{2}\qquad\text{(OA)}$$</div>
     <p>كما يوضح ذلك المنحنى <span class="ltr">OA</span> في الشكل <span class="ltr">(3-1a)</span>. وبمجرد أن يصل المحرك إلى مستوى التشبع المغناطيسي يصبح المجال المغناطيسي ثابتاً لا يعتمد على أي زيادة في التيار، فيتناسب العزم طردياً مع تيار المجال:</p>
     <div class="eq">$$T\propto I_a\qquad\text{(AB)}$$</div>
     <p>كما يوضح ذلك المنحنى <span class="ltr">AB</span> في الشكل <span class="ltr">(3-1a)</span>.</p>`,ref:'ص 35'},
    {title:'ضاعف التيار وقارن العزم',widget:(el,B)=>{
      const fm=x=>{let s=(+x).toFixed(2);return s.replace(/0+$/,'').replace(/\.$/,'')};
      el.innerHTML=`<p class="sub" style="margin:0 0 10px">حرّك المؤشر لتضرب تيار المنتج في عدد، وقارن ما يحدث للعزم قبل التشبع وبعده. (نسب فقط، بلا أرقام محرك معين.)</p>
       <label class="w-sl"><span>تيار المنتج يصبح <b class="ltr" data-o="k"></b> مرة قيمته الأولى</span><input type="range" min="1" max="3" step="0.5" dir="ltr" value="2"></label>
       <div style="margin-top:12px;display:grid;gap:8px">
        <div><div class="sub" style="margin:0">قبل التشبع (المنحنى <span class="ltr">OA</span>): العزم ∝ مربع التيار</div><div style="background:var(--surface-2);border-radius:8px;height:16px;overflow:hidden" dir="ltr"><div data-o="ba" style="height:100%;background:var(--blue);transition:width .3s"></div></div></div>
        <div><div class="sub" style="margin:0">بعد التشبع (المنحنى <span class="ltr">AB</span>): العزم ∝ التيار</div><div style="background:var(--surface-2);border-radius:8px;height:16px;overflow:hidden" dir="ltr"><div data-o="bb" style="height:100%;background:var(--live);transition:width .3s"></div></div></div>
       </div>
       <div class="w-facts" style="grid-template-columns:1fr 1fr"><div><span>العزم قبل التشبع يصبح</span><b data-o="a"></b></div><div><span>العزم بعد التشبع يصبح</span><b data-o="b"></b></div></div>`;
      const o=k=>el.querySelector(`[data-o="${k}"]`),rg=el.querySelector('input');
      const draw=()=>{const k=+rg.value;o('k').textContent=fm(k);o('a').textContent='× '+fm(k*k);o('b').textContent='× '+fm(k);o('ba').style.width=(k*k/9*100)+'%';o('bb').style.width=(k/9*100)+'%'};
      rg.oninput=draw;draw();
    }},
    {watch:String.raw`<p>في الكتاب يُطبع رمز التناسب كأنه الحرف «α» (مثل <span class="ltr">T α φ Ia</span>)، والمقصود الرمز \(\propto\) ومعناه «يتناسب مع»، وليس حرف ألفا.</p>`,fix:true},
    {tip:String.raw`<p>بعد التشبع يقول الكتاب «يتناسب العزم طردياً مع <b>تيار المجال</b>»، ولا تعارض: في محرك التوالي تيار المجال هو تيار المنتج نفسه.</p>`}
   ]},

  {st:5,short:'السرعة مع التيار',title:'ب- علاقة السرعة مع تيار المنتج <span class="ltr">n = f(I<sub>a</sub>)</span>',ref:'ص 35',
   q:'المجال يقوى كلما زاد التيار… فهل يسرع المحرك أم يبطئ؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="منحنى السرعة مع تيار المنتج: يبدأ عالياً جداً عند التيار الصغير وينخفض بسرعة ثم يتسطح" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><rect x="40" y="36" width="290" height="236" rx="12" fill="#FBF6EE"/><path d="M60 50V250H316" fill="none" stroke="#2C4A40" stroke-width="2.5"/><polygon points="60,42 54,54 66,54" fill="#2C4A40"/><polygon points="324,250 312,244 312,256" fill="#2C4A40"/><text x="76" y="56" text-anchor="middle" font-size="15" font-weight="700" fill="#2C4A40">n</text><text x="314" y="270" text-anchor="middle" font-size="14" font-weight="700" fill="#2C4A40">Ia</text><g data-tip="الخط المتقطع عند تيار صغير جداً (تيار اللاحمل): هنا يكون المجال ضعيفاً جداً، فتصبح السرعة عالية إلى درجة الخطورة."><line x1="88" y1="48" x2="88" y2="250" stroke="#E8735A" stroke-width="3" stroke-dasharray="7 5"/><rect x="78" y="48" width="20" height="202" fill="transparent"/></g><g data-tip="قبل التشبع: المجال يزيد مع التيار، فالسرعة تتناسب عكسياً مع التيار ⟦n ∝ 1/Ia⟧."><path d="M100 58C115 140 140 172 170 180" fill="none" stroke="#12855A" stroke-width="6" stroke-linecap="round"/><path d="M100 58C115 140 140 172 170 180" fill="none" stroke="transparent" stroke-width="22"/><text x="176" y="118" text-anchor="middle" font-size="12.5" font-weight="700" fill="#2C4A40">قبل التشبع</text></g><g data-tip="بعد التشبع: المجال ثابت، فتكاد السرعة تثبت (تنخفض قليلاً فقط لأن ⟦E⟧ تنقص قليلاً)."><path d="M170 180L310 190" fill="none" stroke="#4FB3A9" stroke-width="6" stroke-linecap="round"/><path d="M170 180L310 190" fill="none" stroke="transparent" stroke-width="22"/><text x="246" y="216" text-anchor="middle" font-size="12.5" font-weight="700" fill="#2C4A40">بعد التشبع</text></g><circle cx="170" cy="180" r="5" fill="#2C4A40"/><text x="180" y="300" text-anchor="middle" font-size="13" fill="#2C4A40">رسم توضيحي لشكل المنحنى</text></svg>`,
   cap:'الشكل <span class="ltr">(3-1b)</span> مبسطاً: السرعة تنخفض بسرعة مع التيار ثم تكاد تثبت بعد التشبع.<br><b>مرّر المؤشر على جزأي المنحنى والخط المتقطع (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'قبل التشبع، تضاعف تيار المنتج. ماذا يحدث للسرعة تقريباً؟',opts:[
     ['تتضاعف',false,'العكس: المجال يتضاعف تقريباً، والسرعة تتناسب عكسياً مع المجال.'],
     ['لا تتغير',false,'لا تكاد تتغير بعد التشبع فقط، أما قبله فالمجال يزيد مع التيار.'],
     ['تصبح نصف ما كانت تقريباً',true,String.raw`\(n\propto\dfrac{1}{\phi}\propto\dfrac{1}{I_a}\): تيار أكبر بمرتين يعني سرعة أقل بمرتين تقريباً (بإهمال النقص الطفيف في \(E\)).`]]}}
   ],
   body:[
    {book:String.raw`<p>في محركات التيار المستمر:</p>
     <div class="eq">$$n\propto\frac{E}{\phi}\qquad\qquad E=V-I_a\,(R_a+R_s)$$</div>
     <p>كلما ازداد تيار المنتج تنقص قيمة \(E\) نقصاً طفيفاً (يمكن إهمال هذا النقص في قيمة \(E\))، وتزداد قيمة \(\phi\) مع زيادة تيار المنتج قبل الوصول لمستوى التشبع المغناطيسي، أي أن:</p>
     <div class="eq">$$n\propto\frac{1}{\phi}\propto\frac{1}{I_a}$$</div>
     <p>وعندما يصل المحرك لمستوى التشبع تثبت قيمة المجال المغناطيسي وتثبت السرعة أيضاً. <b>سرعة محرك التوالي تتناسب عكسياً مع تيار المجال قبل التشبع المغناطيسي ثم تصبح ثابتة بعد الوصول إلى التشبع</b>، الشكل <span class="ltr">(3-1b)</span>.</p>`,ref:'ص 35'},
    {tip:String.raw`<p><b>الرموز:</b> \(n\) السرعة، \(E\) القوة الدافعة الكهربائية العكسية، \(V\) جهد المصدر، \(R_a\) مقاومة المنتج، \(R_s\) مقاومة ملف التوالي، \(\phi\) المجال المغناطيسي، والرمز \(\propto\) يعني «يتناسب مع».</p>
     <p>المعادلة \(n\propto E/\phi\) تقول: المجال الأقوى يجعل المحرك <b>أبطأ</b> لنفس الجهد. لذلك حين يقوى المجال مع الحمل في محرك التوالي تنخفض سرعته.</p>`},
    {watch:String.raw`<p>بعد التشبع «تثبت» السرعة تقريباً فقط: تنخفض قليلاً لأن \(E\) نفسها تنقص قليلاً مع زيادة التيار. وجملة الكتاب عن التشبع جملة مستقلة؛ العلاقة \(n\propto 1/I_a\) تخص ما <b>قبل</b> التشبع فقط.</p>`}
   ]},

  {st:6,short:'العزم مع السرعة',title:'ج- علاقة العزم مع السرعة <span class="ltr">T = f(n)</span>',ref:'ص 36',
   q:'قطار يبدأ صعود مرتفع. ماذا يفعل محرك التوالي بسرعته وعزمه دون أن يتدخل السائق؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="منحنى السرعة مع العزم لمحرك التوالي: سرعة عالية عند عزم صغير، وسرعة منخفضة عند عزم كبير" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><rect x="40" y="36" width="290" height="236" rx="12" fill="#FBF6EE"/><path d="M60 50V250H316" fill="none" stroke="#2C4A40" stroke-width="2.5"/><polygon points="60,42 54,54 66,54" fill="#2C4A40"/><polygon points="324,250 312,244 312,256" fill="#2C4A40"/><text x="76" y="56" text-anchor="middle" font-size="15" font-weight="700" fill="#2C4A40">n</text><text x="314" y="270" text-anchor="middle" font-size="15" font-weight="700" fill="#2C4A40">T</text><path d="M80 60C110 170 170 215 310 232" fill="none" stroke="#2C4A40" stroke-width="5" stroke-linecap="round"/><g data-tip="حمل خفيف (مثل السير على أرض مستوية): يكفي عزم صغير، فيدور المحرك بسرعة عالية."><circle cx="96" cy="105" r="10" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><text x="166" y="96" text-anchor="middle" font-size="12.5" font-weight="700" fill="#2C4A40">عزم صغير</text><text x="166" y="114" text-anchor="middle" font-size="12.5" fill="#2C4A40">سرعة عالية</text><rect x="84" y="80" width="128" height="40" fill="transparent"/></g><g data-tip="حمل ثقيل (مثل بدء الحركة أو صعود مرتفع): يولد المحرك عزماً كبيراً، وتنخفض سرعته تلقائياً."><circle cx="235" cy="218" r="10" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5"/><text x="240" y="176" text-anchor="middle" font-size="12.5" font-weight="700" fill="#2C4A40">عزم كبير</text><text x="240" y="194" text-anchor="middle" font-size="12.5" fill="#2C4A40">سرعة منخفضة</text><rect x="196" y="160" width="90" height="70" fill="transparent"/></g><text x="180" y="300" text-anchor="middle" font-size="13" fill="#2C4A40">رسم توضيحي لشكل المنحنى</text></svg>`,
   cap:'الشكل <span class="ltr">(3-1c)</span> مبسطاً: كلما زاد العزم انخفضت السرعة.<br><b>مرّر المؤشر على النقطتين (أو المسهما في الجوال) لتعرف الحالة التي تمثلها كل منهما.</b>',
   side:[
    {predict:{q:'قطار بمحرك توالٍ بدأ يصعد مرتفعاً فزاد الحمل. ماذا يحدث؟',opts:[
     ['تنخفض السرعة ويزيد العزم تلقائياً',true,'زيادة العزم تتطلب تياراً أكبر، فيزيد تيار المجال، فتنخفض السرعة (ص 36). وهذا ما يناسب الصعود.'],
     ['تزيد السرعة ويقل العزم',false,'هذا يحدث عندما <b>ينقص</b> الحمل، لا عندما يزيد.'],
     ['تبقى السرعة ثابتة ويزيد العزم',false,'السرعة الثابتة تقريباً من صفات محرك التوازي، أما محرك التوالي فسرعته متغيرة تلقائياً.']]}}
   ],
   body:[
    {book:String.raw`<p>علاقة العزم مع السرعة يمكن استنتاجها من العلاقتين السابقتين وكما هي مبينة في الشكل <span class="ltr">(3-1c)</span>. من الواضح أن محرك التوالي <b>يولد عزماً كبيراً عند السرعات المنخفضة والعكس صحيح</b>. هذا بسبب أن الزيادة في العزم تتطلب زيادة في تيار المنتج وبالتالي زيادة بالتبعية في تيار المجال مما يؤدي إلى انخفاض السرعة.</p>`,ref:'ص 36'},
    {tip:String.raw`<table class="tt"><thead><tr><th>الرسم في الشكل (3-1)</th><th>المحوران</th><th>شكل المنحنى</th></tr></thead><tbody>
     <tr><td><span class="ltr">(a)</span></td><td>العزم مع تيار المنتج</td><td>منحنٍ صاعد <span class="ltr">OA</span> ثم مستقيم <span class="ltr">AB</span></td></tr>
     <tr><td><span class="ltr">(b)</span></td><td>السرعة مع تيار المنتج</td><td>عالية جداً عند التيار الصغير، تنخفض ثم تكاد تثبت</td></tr>
     <tr><td><span class="ltr">(c)</span></td><td>السرعة مع العزم</td><td>عالية عند العزم الصغير، منخفضة عند العزم الكبير</td></tr></tbody></table>
     <p>الشكل كاملاً مرسوم في الأسلوب الرسمي لهذا الدرس، وفي المختبر تتحرك نقطة التشغيل على المنحنيات الثلاثة.</p>`,title:'الشكل (3-1) في جدول'},
    {add:String.raw`<p>لهذه الخاصية استُعمل محرك التوالي للتيار المستمر زمناً طويلاً في القطارات الكهربائية وعربات الترام: عند البدء والصعود يعطي عزماً كبيراً بسرعة منخفضة، وعلى الأرض المستوية يسرع وحده.</p>`}
   ]},

  {st:7,short:'ملاحظات مهمة',title:'يجب ملاحظة النقاط التالية في خواص محرك التوالي',ref:'ص 36',
   q:'لماذا يُمنع تشغيل محرك التوالي وهو غير مربوط بحمله؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="عضو دوار عليه أسهم قوى الطرد المركزية، ومؤشر سرعة في المنطقة الحمراء، وجهاز حماية يفصل المصدر" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><g data-tip="العضو الدوار يدور بسرعة عالية جداً عند اللاحمل."><circle cx="120" cy="140" r="56" fill="#CFE6DB" stroke="#2C4A40" stroke-width="3.5"/><circle cx="120" cy="140" r="12" fill="#2C4A40"/><line x1="120" y1="140" x2="120" y2="92" stroke="#2C4A40" stroke-width="4" stroke-linecap="round"/><line x1="120" y1="140" x2="161.6" y2="164" stroke="#2C4A40" stroke-width="4" stroke-linecap="round"/><line x1="120" y1="140" x2="78.4" y2="164" stroke="#2C4A40" stroke-width="4" stroke-linecap="round"/></g><g data-tip="قوى الطرد المركزية: تشد أجزاء العضو الدوار إلى الخارج، وتكبر كثيراً مع السرعة حتى يمكن أن يتحطم العضو الدوار."><line x1="120" y1="78" x2="120" y2="54" stroke="#E8735A" stroke-width="5" stroke-linecap="round"/><polygon points="120,44 112,58 128,58" fill="#E8735A"/><line x1="174" y1="171" x2="195" y2="183" stroke="#E8735A" stroke-width="5" stroke-linecap="round"/><polygon points="204,188 188,188 196,174" fill="#E8735A"/><line x1="66" y1="171" x2="45" y2="183" stroke="#E8735A" stroke-width="5" stroke-linecap="round"/><polygon points="36,188 44,174 52,188" fill="#E8735A"/><line x1="174" y1="109" x2="195" y2="97" stroke="#E8735A" stroke-width="5" stroke-linecap="round"/><polygon points="204,92 196,106 188,92" fill="#E8735A"/><line x1="66" y1="109" x2="45" y2="97" stroke="#E8735A" stroke-width="5" stroke-linecap="round"/><polygon points="36,92 52,92 44,106" fill="#E8735A"/><line x1="120" y1="202" x2="120" y2="226" stroke="#E8735A" stroke-width="5" stroke-linecap="round"/><polygon points="120,236 112,222 128,222" fill="#E8735A"/></g><g data-tip="مؤشر السرعة: المؤشر في المنطقة الحمراء، أي أن السرعة زادت عن الحد المسموح به."><path d="M232 130A46 46 0 0 1 324 130" fill="none" stroke="#2C4A40" stroke-width="10"/><path d="M310.7 97.5A46 46 0 0 1 324 130" fill="none" stroke="#E8735A" stroke-width="10"/><line x1="278" y1="130" x2="314" y2="106" stroke="#2C4A40" stroke-width="4" stroke-linecap="round"/><circle cx="278" cy="130" r="7" fill="#2C4A40"/><text x="278" y="156" text-anchor="middle" font-size="12.5" font-weight="700" fill="#2C4A40">السرعة</text></g><g data-tip="جهاز الحماية: يفصل مصدر الجهد عند زيادة السرعة عن الحد المسموح به (ص 36)."><rect x="232" y="186" width="92" height="60" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><line x1="248" y1="226" x2="266" y2="226" stroke="#2C4A40" stroke-width="3"/><line x1="266" y1="226" x2="290" y2="210" stroke="#2C4A40" stroke-width="3"/><line x1="292" y1="226" x2="308" y2="226" stroke="#2C4A40" stroke-width="3"/><circle cx="266" cy="226" r="3" fill="#2C4A40"/><circle cx="292" cy="226" r="3" fill="#2C4A40"/><text x="278" y="204" text-anchor="middle" font-size="12" font-weight="700" fill="#2C4A40">يفصل المصدر</text></g><text x="180" y="290" text-anchor="middle" font-size="14" font-weight="700" fill="#2C4A40">بلا حمل: سرعة خطرة</text></svg>`,
   cap:'عند إزالة الحمل يضعف المجال جداً، فترتفع السرعة وتكبر قوى الطرد المركزية؛ لذلك يُزوَّد المحرك بحماية تفصل المصدر.<br><b>مرّر المؤشر على الأسهم والمؤشر وجهاز الحماية (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'ما الطريقة الصحيحة لتشغيل محرك التوالي حسب الكتاب؟',opts:[
     ['يُشغَّل بلا حمل أولاً حتى تستقر سرعته، ثم يُربط الحمل',false,'هذا بالضبط ما يحذّر منه الكتاب: بلا حمل تزداد السرعة إلى درجة الخطورة.'],
     ['يُحمَّل أولاً ثم تبدأ الحركة',true,'نص الكتاب في ص 36: «يجب ألا يبدأ محرك التوالي حركته بدون أحمال، بل يجب أن يتم تحميله أولاً ثم تبدأ الحركة».'],
     ['يُشغَّل بأي طريقة، فسرعته ثابتة',false,'سرعة محرك التوالي متغيرة تلقائياً حسب الحمل، وليست ثابتة.']]}}
   ],
   body:[
    {book:String.raw`<p><b>أ)</b> محرك التوالي ذو <b>سرعة متغيرة تلقائياً</b>، أي أن المحرك يغير من سرعته ذاتياً حسب التحميل. عندما ينقص الحمل تزداد سرعة المحرك تلقائياً، هذه الخاصية مطلوبة للتحريك الكهربائي حيث يضبط المحرك سرعته ذاتياً مع تغير التحميل.</p>
     <p><b>ب)</b> عندما يصل تيار المنتج إلى قيمته عند اللاحمل، بسبب إزالة الحمل، يصبح المجال المغناطيسي صغيراً جداً. وتزداد السرعة إلى قيمة عالية جداً إلى درجة الخطورة حيث يمكن أن يتحطم العضو الدوار تحت تأثير قوى الطرد المركزية. لذا <b>يجب ألا يبدأ محرك التوالي حركته بدون أحمال</b>، بل يجب أن يتم تحميله أولاً ثم تبدأ الحركة.</p>
     <p>أقل حمل لمحرك التوالي يجب أن يكون بالقدر الكافي للحفاظ على السرعة في الحدود المعقولة، وللاحتياط لابد من تزويد المحرك بالأجهزة اللازمة لفصل مصدر الجهد عند زيادة السرعة عن الحد المسموح به.</p>`,ref:'ص 36'},
    {title:'ماذا يحدث لو أُزيل الحمل؟',widget:(el,B)=>{
      const S=['أُزيل الحمل','نقص تيار المنتج إلى قيمته عند اللاحمل','صار المجال المغناطيسي صغيراً جداً','ارتفعت السرعة إلى درجة الخطورة','قوى الطرد المركزية قد تحطم العضو الدوار'];
      el.innerHTML=`<p class="sub" style="margin:0 0 10px">اضغط «أزِل الحمل» وتابع كيف ينتقل الأثر من حلقة إلى التي بعدها.</p><div class="chain">${S.map((s,i)=>`<span class="ck${i===S.length-1?' end':''}">${s}</span>${i<S.length-1?'<span class="ar">←</span>':''}`).join('')}</div><div class="w-row"><button class="btn pri" type="button" data-go>أزِل الحمل</button><button class="btn" type="button" data-rs>إعادة</button></div>`;
      const ks=[...el.querySelectorAll('.ck')];let tm=[];
      const rs=()=>{tm.forEach(clearTimeout);tm=[];ks.forEach(k=>k.classList.remove('on'))};
      el.querySelector('[data-go]').onclick=()=>{rs();ks.forEach((k,i)=>tm.push(setTimeout(()=>k.classList.add('on'),i*550)))};
      el.querySelector('[data-rs]').onclick=rs;
    }},
    {add:String.raw`<p>لهذا السبب يُربط محرك التوالي بحمله عادةً ربطاً مباشراً أو بالتروس، ولا يُربط بسير؛ فلو انقطع السير أو انزلق لأصبح المحرك فجأة بلا حمل.</p>`},
    {watch:String.raw`<p>«سرعة متغيرة تلقائياً» ميزة في التحريك، لكن طرفها الآخر خطر: نقص الحمل يرفع السرعة، وإزالته كلياً ترفعها إلى درجة الخطورة. الميزة والخطر من السبب نفسه: المجال يتبع تيار الحمل.</p>`}
   ]},

  {recap:[
   String.raw`أهم محركات التحريك: محركات التيار المستمر، والحثية (القفصي والملفوف)، والتزامنية، ولكل نوع تطبيقات تناسبه (ص 34).`,
   String.raw`في محرك التوالي يمر تيار المنتج في ملف المجال، فيقوى المجال مع الحمل (ص 35).`,
   String.raw`العزم: \(T\propto\phi\,I_a\)؛ قبل التشبع \(T\propto I_a^2\) (المنحنى OA)، وبعده \(T\propto I_a\) (المنحنى AB).`,
   String.raw`السرعة: \(n\propto E/\phi\)، وقبل التشبع \(n\propto 1/I_a\)؛ فالمحرك يعطي عزماً كبيراً عند السرعات المنخفضة والعكس (ص 35–36).`,
   String.raw`سرعة محرك التوالي متغيرة تلقائياً، ولا يبدأ حركته بدون حمل، ويُزوَّد بحماية تفصل المصدر عند زيادة السرعة (ص 36).`]}
],
 theory:[
  {h:'الوحدة الثالثة: محركات التيار المستمر والمتردد كمحركات للتحريك',ref:'ص 32–33',html:`<p><b>الهدف العام للوحدة:</b> معرفة خواص محركات التيار المستمر والتيار المتردد المستخدمة في التحريك الكهربائي.</p>
   <p><b>الأهداف التفصيلية:</b></p><ul><li>أن يعرف المتدرب خواص محركات التيار المستمر من النوع التوالي والمركب.</li><li>أن يعرف المتدرب خواص محركات التيار المتردد المستخدمة في التحريك.</li></ul>`},
  {h:'أنواع المحركات الكهربائية المستخدمة في التحريك الكهربائي',ref:'ص 34',html:`<p>هناك عدة أنواع من المحركات الكهربائية، المستخدمة في التحريك الكهربائي بصفة عامة وتختلف فيما بينها، حسب طبيعة مصدر التغذية، وطريقة تركيبها ونظرية عملها، وأهم هذه المحركات:</p>
   <p><b>أ) محركات التيار المستمر:</b> تتميز محركات التيار المستمر بأنها تدور بالسرعات المطلوبة بدقة، وذات مدى واسع لتغيير السرعة، مع إمكانية السيطرة عليها بسهولة، وإمكانية عكس اتجاه حركتها الدورانية، بالإضافة إلى تميزها بعزم بدء حركة مناسب.</p>
   <p><b>ب) المحركات الحثية:</b> يوجد منها نوعان: النوع الأول عضوه الدوار ذو <b>القفص السنجابي</b>، ويتميز ببساطة تركيبه وبقلة تكاليفه وصلابته، هذا النوع مناسب للتطبيقات التي تحتاج إلى سرعة دوران ثابتة. النوع الثاني هو المحرك ذو <b>العضو الدوار الملفوف</b>، وهو مناسب للتطبيقات التي تحتاج لعزم كبير لبدء حركتها مع نقص في قيمة تيار بدء الحركة، ويمتاز هذا النوع عن سابقه بسهولة التحكم فيه من حيث السرعة وعزم وتيار بدء الحركة.</p>
   <p><b>ج) المحركات التزامنية:</b> هذا النوع من المحركات مناسب للتطبيقات التي تحتاج سرعة دوران ثابتة القيمة وقدرات كبيرة بالإضافة إلى إمكانية تصميمها لتعمل عند سرعات بطيئة بمعامل قدرة عالٍ وبكفاءة تشغيل مرتفعة.</p>`},
  {html:`<div class="e34-tbl"><table class="tt"><thead><tr><th>النوع</th><th>أهم ما يميزه</th><th>يناسب</th></tr></thead><tbody>
    <tr><td>محركات التيار المستمر</td><td>سرعة دقيقة ومدى واسع لتغييرها، سهولة التحكم وعكس الاتجاه، عزم بدء مناسب</td><td>التحكم الدقيق في السرعة</td></tr>
    <tr><td>الحثي ذو القفص السنجابي</td><td>بسيط، رخيص، صلب</td><td>السرعة الثابتة</td></tr>
    <tr><td>الحثي ذو العضو الدوار الملفوف</td><td>عزم بدء كبير بتيار بدء أقل، سهولة التحكم في السرعة</td><td>الأحمال الثقيلة عند البدء</td></tr>
    <tr><td>التزامني</td><td>سرعة ثابتة، قدرات كبيرة، معامل قدرة عالٍ وكفاءة مرتفعة حتى في السرعات البطيئة</td><td>القدرات الكبيرة بسرعة ثابتة</td></tr></tbody></table></div><p class="sub">توضيح للمتدرب — ليس من الكتاب: جدول يلخص نص ص 34.</p>`},
  {h:'محركات التيار المستمر كمحركات للتحريك — خواص محرك التوالي',ref:'ص 35',html:String.raw`<p>في محركات التيار المستمر إثارة توالي توصل ملفات المجال <b>على التوالي</b> مع ملفات المنتج. ومن الواضح أن تيار المنتج يمر في ملفات المجال، فعند زيادة التحميل يزداد تيار المنتج وبالتالي تيار المجال. إذاً <b>يزداد المجال المغناطيسي في محركات التوالي مع زيادة تيار المنتج بزيادة التحميل</b>.</p>
   <h3>أ- علاقة العزم مع تيار المنتج \(T=f(I_a)\)</h3>
   <p>يتناسب العزم طردياً مع كل من تيار المنتج والمجال المغناطيسي:</p>
   $$T\propto\phi\,I_a$$
   <p>يعتمد المجال المغناطيسي على تيار المجال أي على تيار المنتج طالما أن العلاقة بين المجال المغناطيسي وتيار المجال علاقة خطية، أي <b>قبل</b> أن يصل المحرك إلى مستوى التشبع المغناطيسي \((\phi\propto I_a)\)، إذاً يتناسب العزم مع مربع تيار المنتج:</p>
   $$T\propto I_a^{2}\qquad\text{(OA)}$$
   <p>كما يوضح ذلك المنحنى <span class="ltr">OA</span> في الشكل (3-1a). وبمجرد أن يصل المحرك إلى مستوى التشبع المغناطيسي يصبح المجال المغناطيسي ثابتاً لا يعتمد على أي زيادة في التيار، فيتناسب العزم طردياً مع تيار المجال (وهو نفسه تيار المنتج في محرك التوالي):</p>
   $$T\propto I_a\qquad\text{(AB)}$$
   <p>كما يوضح ذلك المنحنى <span class="ltr">AB</span> في الشكل (3-1a).</p>
   <h3>ب- علاقة السرعة مع تيار المنتج \(n=f(I_a)\)</h3>
   <p>في محركات التيار المستمر:</p>
   $$n\propto\frac{E}{\phi}\qquad\qquad E=V-I_a\,(R_a+R_s)$$
   <p>كلما ازداد تيار المنتج تنقص قيمة \(E\) نقصاً طفيفاً (يمكن إهمال هذا النقص في قيمة \(E\))، وتزداد قيمة \(\phi\) مع زيادة تيار المنتج قبل الوصول لمستوى التشبع المغناطيسي، أي أن:</p>
   $$n\propto\frac{1}{\phi}\propto\frac{1}{I_a}$$
   <p>وعندما يصل المحرك لمستوى التشبع تثبت قيمة المجال المغناطيسي وتثبت السرعة أيضاً. <b>سرعة محرك التوالي تتناسب عكسياً مع تيار المجال قبل التشبع المغناطيسي ثم تصبح ثابتة بعد الوصول إلى التشبع</b>، الشكل (3-1b).</p>`},
  {note:String.raw`<b>توضيح للمتدرب — ليس من الكتاب:</b> الرموز: \(E\) القوة الدافعة الكهربائية العكسية، \(V\) جهد المصدر، \(R_a\) مقاومة المنتج، \(R_s\) مقاومة ملف التوالي، \(\phi\) المجال المغناطيسي. والرمز \(\propto\) يعني «يتناسب مع». بعد التشبع «تثبت» السرعة تقريباً فقط: تنخفض قليلاً لأن \(E\) نفسها تنقص قليلاً مع زيادة التيار.`},
  {h:'ج- علاقة العزم مع السرعة T = f(n)',ref:'ص 36',html:`<p>علاقة العزم مع السرعة يمكن استنتاجها من العلاقتين السابقتين وكما هي مبينة في الشكل (3-1c). من الواضح أن محرك التوالي <b>يولد عزماً كبيراً عند السرعات المنخفضة والعكس صحيح</b>. هذا بسبب أن الزيادة في العزم تتطلب زيادة في تيار المنتج وبالتالي زيادة بالتبعية في تيار المجال مما يؤدي إلى انخفاض السرعة.</p>`},
  {fig:'(3-1)',ref:'ص 36',caption:'خواص محرك التيار المستمر توالي',draw:()=>fig31()},
  {h:'يجب ملاحظة النقاط التالية في خواص محرك التوالي',ref:'ص 36',html:`<p><b>أ)</b> محرك التوالي ذو <b>سرعة متغيرة تلقائياً</b>، أي أن المحرك يغير من سرعته ذاتياً حسب التحميل. عندما ينقص الحمل تزداد سرعة المحرك تلقائياً، هذه الخاصية مطلوبة للتحريك الكهربائي حيث يضبط المحرك سرعته ذاتياً مع تغير التحميل.</p>
   <p><b>ب)</b> عندما يصل تيار المنتج إلى قيمته عند اللاحمل، بسبب إزالة الحمل، يصبح المجال المغناطيسي صغيراً جداً. وتزداد السرعة إلى قيمة عالية جداً إلى درجة الخطورة حيث يمكن أن يتحطم العضو الدوار تحت تأثير قوى الطرد المركزية. لذا <b>يجب ألا يبدأ محرك التوالي حركته بدون أحمال</b>، بل يجب أن يتم تحميله أولاً ثم تبدأ الحركة.</p>
   <p>أقل حمل لمحرك التوالي يجب أن يكون بالقدر الكافي للحفاظ على السرعة في الحدود المعقولة، وللاحتياط لابد من تزويد المحرك بالأجهزة اللازمة لفصل مصدر الجهد عند زيادة السرعة عن الحد المسموح به.</p>`},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب:</b> في المختبر تشغّل محرك توالٍ بأرقام توضيحية: تحمّله وتشاهد نقطة التشغيل تتحرك على المنحنيات الثلاثة للشكل (3-1)، وتشاهد ما يحدث عند إزالة الحمل وكيف تفصل الحماية المصدر.'},
  {err:'<div class="fixnote">رمز التناسب مطبوع في الكتاب «α» (حرف ألفا) بدل «∝» في كل العلاقات (مثل T α φ Ia)، وكتبناه هنا ∝. وفي ص 35 جاءت جملة «عندما يصل المحرك لمستوى التشبع تثبت قيمة المجال…» ملتصقة بالعلاقة n ∝ 1/φ ∝ 1/Ia وهي تخص ما قبل التشبع فقط؛ فصلناهما. وقوله «يتناسب العزم طردياً مع تيار المجال» بعد التشبع لا تعارض فيه: تيار المجال في محرك التوالي هو تيار المنتج. وفي ص 34 «بمعامل قدرة عالي» والصحيح «عالٍ».</div>'}
 ],
 lab:(el)=>{
  const s={on:false,trip:false,crash:false,prot:true,n:0,ang:0,TL:100,t:0};const did={};
  el.innerHTML=`<div id="s1tp"></div><div class="grid e34-lab">
   <div class="panel c5"><h2>محرك التوالي <small>رسم توضيحي للدائرة — المعادلات من ص 35</small></h2>
    <div id="s1c" class="svgbox" style="max-width:420px;margin-inline:auto"></div>
    <div class="e34-row"><button class="btn primary" id="s1on">تشغيل</button><button class="btn" id="s1off">إيقاف</button><button class="btn" id="s1rs">إعادة ضبط الحماية</button></div>
    <div class="e34-row"><button class="btn" id="s1pr" aria-pressed="true">حماية السرعة الزائدة: مفعّلة</button></div>
    ${sl('s1L','عزم الحمل على العمود T<sub>L</sub>',0,240,1,s.TL)}
    <div class="e34-row"><button class="btn" id="s1z">أزل الحمل (T<sub>L</sub> = 0)</button><button class="btn" id="s1rt">الحمل المقنن</button></div>
    <div id="s1msg" class="e34-msg"></div></div>
   <div class="panel c7"><h2>القراءات <small><span id="s1chip" class="e34-chip"></span></small></h2>
    <div class="e34-meters">${meter('الجهد V','s1V')}${meter('تيار المنتج I<sub>a</sub>','s1I')}${meter('المجال kφ (V لكل rpm)','s1k')}${meter('الجهد العكسي E','s1E')}${meter('السرعة n','s1n')}${meter('العزم المتولد T','s1T')}</div>
    <div class="e34-meters">${meter('T ÷ I<sub>a</sub>²','s1r2')}${meter('T ÷ I<sub>a</sub>','s1r1')}${meter('العزم المقنن','s1TN')}${meter('عزم النقطة A','s1TA')}${meter('أقل حمل آمن','s1Tm')}</div>
    <p class="sub">في منطقة ما قبل التشبع تبقى <span class="ltr">T ÷ I<sub>a</sub>²</span> ثابتة (العزم ∝ مربع التيار)، وبعد النقطة A تبقى <span class="ltr">T ÷ I<sub>a</sub></span> ثابتة. «أقل حمل آمن» هو أصغر عزم حمل يُبقي السرعة تحت الحد المسموح (ص 36). الأرقام توضيحية، والعزم المتولد يساوي عزم الحمل مضافاً إليه عزم الاحتكاك.</p></div>
   <div class="panel c12"><h2>نقطة التشغيل على منحنيات الشكل ${lt('(3-1)')} <small>الدائرة البرتقالية = نقطة التشغيل الآن، والخط الأحمر = أقصى سرعة مسموحة</small></h2><div id="s1g" class="e34-figs"></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="s1st"></ol></div></div>`;
  const $=q=>el.querySelector(q);
  let M,TN,TA,Tmin,Imx;
  const rebuild=()=>{const v=TP.v;M=dcModel(v,'series');TN=M.T(v.IaN);TA=M.T(v.Is);Tmin=minLoadFor(M,v.nMax,v.Tf);Imx=Math.min(M.Imax,Math.max(2.4*v.IaN,1.3*v.Is));
   const r=$('#s1L');const mx=Math.max(10,niceMax(2.4*TN));r.max=mx;r.step=mx/240;if(s.TL>mx){s.TL=mx;r.value=mx}};
  const TP=B.params($('#s1tp'),'u3-l1',SER_TP,()=>{rebuild();steps.redraw()});
  rebuild();
  const setMsg=(h,k)=>{$('#s1msg').innerHTML=h?`<div class="callout${k==='err'?' err':''}">${h}</div>`:''};
  $('#s1L').oninput=e=>{s.TL=+e.target.value};
  $('#s1z').onclick=()=>{s.TL=0;$('#s1L').value=0};
  $('#s1rt').onclick=()=>{s.TL=Math.round(TN);$('#s1L').value=s.TL};
  $('#s1on').onclick=()=>{if(s.trip||s.crash){setMsg('اضغط «إعادة ضبط الحماية» أولاً.','err');return}
   s.on=true;if(s.TL<Tmin){setMsg(`<b>تحذير:</b> شغّلت محرك التوالي بحمل أقل من أقل حمل آمن (${lt(fm(Tmin,1)+' N·m')}). بحمل صغير يكون تيار المنتج صغيراً، وتيار المنتج هو تيار المجال، فيضعف المجال جداً وترتفع السرعة إلى درجة الخطورة (ص 36). راقب السرعة.`,'err')}else setMsg('','')};
  $('#s1off').onclick=()=>{s.on=false;setMsg('','')};
  $('#s1rs').onclick=()=>{s.trip=false;s.crash=false;s.on=false;s.n=0;setMsg('','')};
  $('#s1pr').onclick=()=>{s.prot=!s.prot;const b=$('#s1pr');b.setAttribute('aria-pressed',String(s.prot));b.textContent='حماية السرعة الزائدة: '+(s.prot?'مفعّلة':'ملغاة (للتجربة فقط)')};
  const settled=()=>{const o=M.op(s.TL+TP.v.Tf);return o.ok&&isFinite(o.n)&&Math.abs(s.n-o.n)<Math.max(2,0.01*o.n)};
  const steps=stepsUI($('#s1st'),[
   {t:'حمّل أولاً ثم شغّل',get x(){return `اضبط الحمل على العزم المقنن (زر «الحمل المقنن»: ${lt(fm(TN,0)+' N·m')}) ثم اضغط «تشغيل». تستقر السرعة عند نقطة على الجزء AB من المنحنى والتيار قرب ${lt(fm(TP.v.IaN,0)+' A')}.`},done:()=>s.on&&!s.trip&&s.TL>=0.95*TN&&settled()},
   {t:'زد الحمل',get x(){return `ارفع الحمل إلى ${lt(fm(1.8*TN,0)+' N·m')} أو أكثر: يزيد التيار فيزيد المجال فتنخفض السرعة تلقائياً (سرعة متغيرة تلقائياً، ص 36). المحرك يولد عزماً كبيراً عند السرعة المنخفضة.`},done:()=>s.on&&!s.trip&&s.TL>=1.8*TN-0.5&&settled()},
   {t:'قبل التشبع: العزم ∝ مربع التيار',get x(){return `اخفض الحمل إلى أقل من ${lt(fm(0.6*TA,0)+' N·m')} (تحت النقطة A) ولكن فوق أقل حمل آمن (${lt(fm(Tmin,1)+' N·m')}): لاحظ أن «T ÷ I<sub>a</sub>²» صارت ثابتة، وأن السرعة ارتفعت كثيراً.`},done:()=>s.on&&!s.trip&&s.TL<=0.6*TA&&s.TL>=Tmin&&settled()},
   {t:'أزل الحمل',x:'اضغط «أزل الحمل» والمحرك يعمل: يصغر التيار جداً فيضعف المجال وتجمح السرعة. حماية السرعة الزائدة تفصل المصدر عند الحد المسموح (ص 36).',done:()=>did.tripped},
   {t:'بلا حماية (للتجربة فقط)',x:'اضغط «إعادة ضبط الحماية»، ثم ألغِ الحماية واترك الحمل صفراً واضغط «تشغيل»: تتجاوز السرعة الحد المسموح كثيراً. في الواقع قد يتحطم العضو الدوار بقوى الطرد المركزية. لذلك يجب ألا يبدأ محرك التوالي حركته بدون أحمال.',done:()=>did.crash}
  ]);
  let lastG=-1;
  const drawG=(o)=>{const v=TP.v,pT=[],pn=[],pc=[];for(let i=1;i<=200;i++){const I=Imx*i/200;pT.push([I,M.T(I)]);pn.push([I,M.n(I)]);pc.push([M.T(I),M.n(I)])}
   const Tm=niceMax(M.T(Imx)*1.05),nm=niceMax(v.nMax*1.4);const sh=o&&o.ok&&s.on;
   const a=plot({w:300,h:220,x0:0,x1:Imx,y0:0,y1:Tm,xt:ticks(niceMax(Imx),4).filter(x=>x<=Imx),yt:ticks(Tm,4),xl:'Ia (A)',yl:'T (N·m)',series:[{pts:pT.filter(p=>p[0]<=v.Is),col:'--blue'},{pts:pT.filter(p=>p[0]>=v.Is),col:'--live'}],dots:[{x:v.Is,y:TA,lbl:'A'},...(sh?[{x:o.I,y:o.T,col:'--live',ring:1}]:[])],aria:'العزم مع تيار المنتج'});
   const b=plot({w:300,h:220,x0:0,x1:Imx,y0:0,y1:nm,xt:ticks(niceMax(Imx),4).filter(x=>x<=Imx),yt:ticks(nm,4),xl:'Ia (A)',yl:'n (rpm)',series:[{pts:pn,col:'--blue'}],hl:[{v:v.nMax,col:'--stop'}],dots:sh?[{x:o.I,y:s.n,col:'--live',ring:1}]:[],aria:'السرعة مع تيار المنتج'});
   const c=plot({w:300,h:220,x0:0,x1:Tm,y0:0,y1:nm,xt:ticks(Tm,4),yt:ticks(nm,4),xl:'T (N·m)',yl:'n (rpm)',series:[{pts:pc,col:'--blue'}],hl:[{v:v.nMax,col:'--stop'}],vl:[{v:Tmin+v.Tf,col:'--muted'}],dots:sh?[{x:o.T,y:s.n,col:'--live',ring:1}]:[],aria:'السرعة مع العزم'});
   $('#s1g').innerHTML=`<figure>${box(a)}(a) <span class="ltr">T = f(I<sub>a</sub>)</span></figure><figure>${box(b)}(b) <span class="ltr">n = f(I<sub>a</sub>)</span></figure><figure>${box(c)}(c) <span class="ltr">n = f(T)</span> — الخط الرمادي: أقل عزم آمن</figure>`};
  loopOn(el,dt=>{const v=TP.v;s.t+=dt;
   const o=M.op(s.TL+v.Tf);let target=0;
   if(s.on&&!s.trip&&!s.crash){target=o.ok?o.n:0;if(!isFinite(target))target=1e9;target=Math.min(target,3*v.nMax)}
   s.n+=(target-s.n)*(1-Math.exp(-dt/v.tau));if(Math.abs(target-s.n)<0.05)s.n=target;
   if(s.on&&s.prot&&s.n>v.nMax){s.on=false;s.trip=true;did.tripped=1;setMsg(`<b>فصلت الحماية المصدر:</b> تجاوزت السرعة الحد المسموح ${lt(fm(v.nMax,0)+' rpm')}. الحمل كان ${lt(fm(s.TL,1)+' N·m')} وهو أقل من أقل حمل آمن ${lt(fm(Tmin,1)+' N·m')}. حمّل المحرك ثم اضغط «إعادة ضبط الحماية» وشغّل من جديد.`,'err')}
   if(s.on&&!s.prot&&s.n>1.5*v.nMax){s.on=false;s.crash=true;did.crash=1;setMsg(`<b>خطر:</b> وصلت السرعة إلى ${lt(fm(s.n,0)+' rpm')}، أي أكثر من مرة ونصف من الحد المسموح. في الواقع قد يتحطم العضو الدوار تحت تأثير قوى الطرد المركزية (ص 36). أوقفنا المحاكاة؛ اضغط «إعادة ضبط الحماية».`,'err')}
   s.ang=(s.ang+s.n/60*360*dt/40)%360;
   const run=s.on&&!s.trip&&!s.crash;const I=run&&o.ok?o.I:0,T=run&&o.ok?o.T:0,k=run&&o.ok?o.k:0,E=k*s.n;
   $('#s1c').innerHTML=dcCircuitSVG({on:run,type:'series',ang:s.ang});
   $('#s1V').textContent=run?fm(v.V,0)+' V':'0 V';$('#s1I').textContent=fm(I,1)+' A';$('#s1k').textContent=fm(k,4);$('#s1E').textContent=fm(run?Math.min(E,v.V):0,1)+' V';$('#s1n').textContent=fm(s.n,0)+' rpm';$('#s1T').textContent=fm(T,1)+' N·m';
   $('#s1r2').textContent=I>0.01?fm(T/(I*I),4):'—';$('#s1r1').textContent=I>0.01?fm(T/I,3):'—';$('#s1TN').textContent=fm(TN,1)+' N·m';$('#s1TA').textContent=fm(TA,1)+' N·m';$('#s1Tm').textContent=fm(Tmin,1)+' N·m';
   $('#s1L-v').textContent=fm(s.TL,1)+' N·m';
   const ch=$('#s1chip');
   if(s.crash){ch.className='e34-chip warn';ch.textContent='جموح: خطر تحطم العضو الدوار'}
   else if(s.trip){ch.className='e34-chip warn';ch.textContent='فصلت الحماية المصدر'}
   else if(!s.on){ch.className='e34-chip';ch.textContent=s.n>1?'المصدر مفصول — يتباطأ':'متوقف'}
   else if(!o.ok){ch.className='e34-chip warn';ch.textContent='الحمل أكبر مما يستطيعه المحرك: لا يدور'}
   else if(Math.abs(s.n-target)>Math.max(2,0.01*target)){ch.className='e34-chip hot';ch.textContent=s.n<target?'يتسارع نحو نقطة التشغيل':'يتباطأ نحو نقطة التشغيل'}
   else if(s.TL<Tmin){ch.className='e34-chip warn';ch.textContent='حمل أقل من الآمن'}
   else if(I>1.05*v.IaN){ch.className='e34-chip hot';ch.textContent='تيار أكبر من المقنن'}
   else{ch.className='e34-chip ok';ch.textContent=I<v.Is?'مستقر — قبل التشبع (OA)':'مستقر — بعد التشبع (AB)'}
   if(s.t-lastG>0.12){lastG=s.t;drawG(o)}
   steps.check()});
 },
 quiz:[
  {q:'أي أنواع المحركات الحثية يناسب التطبيقات التي تحتاج عزماً كبيراً لبدء الحركة مع تيار بدء أقل؟',o:['ذو القفص السنجابي','ذو العضو الدوار الملفوف','التزامني','محرك التوالي العام'],c:1,e:'ص 34: المحرك ذو العضو الدوار الملفوف، ويمتاز بسهولة التحكم في السرعة وعزم وتيار البدء.'},
  {q:'المحرك المناسب لسرعة دوران ثابتة وقدرات كبيرة ومعامل قدرة عالٍ حتى في السرعات البطيئة هو:',o:['محرك التوالي','الحثي القفصي','المحرك التزامني','المحرك المركب الفرقي'],c:2,e:'ص 34.'},
  {q:'لماذا يزداد المجال المغناطيسي في محرك التوالي عند زيادة الحمل؟',o:['لأن ملف المجال يتصل بالمصدر مباشرة','لأن تيار المنتج نفسه يمر في ملف المجال، ويزيد مع الحمل','لأن الجهد يرتفع','لأن السرعة تزيد'],c:1,e:'ص 35.'},
  {q:'قبل التشبع المغناطيسي يتناسب عزم محرك التوالي مع:',o:['تيار المنتج','مربع تيار المنتج','مقلوب تيار المنتج','السرعة'],c:1,e:'ص 35: φ ∝ Ia فإن T ∝ φ·Ia ∝ Ia² (المنحنى OA).'},
  {q:'بعد التشبع المغناطيسي في محرك التوالي:',o:['يتناسب العزم مع مربع التيار','يصبح المجال ثابتاً ويتناسب العزم مع التيار','ينعدم العزم','تزداد السرعة بلا حد'],c:1,e:'ص 35: المنحنى AB.'},
  {q:'إذا زاد تيار محرك التوالي إلى الضعف قبل التشبع، فإن العزم يصبح تقريباً:',o:['الضعف','أربعة أضعاف','النصف','لا يتغير'],c:1,e:'T ∝ Ia²: (2)² = 4.'},
  {q:'لماذا يجب ألا يبدأ محرك التوالي حركته بدون حمل؟',o:['لأن العزم يصبح سالباً','لأن تيار البدء يقل','لأن المجال يصبح صغيراً جداً فترتفع السرعة إلى درجة الخطورة','لأن المحرك لا يدور أبداً'],c:2,e:'ص 36: قد يتحطم العضو الدوار تحت تأثير قوى الطرد المركزية.'},
  {q:'ما الخاصية التي تجعل محرك التوالي مطلوباً في التحريك الكهربائي؟',o:['سرعته ثابتة مهما تغير الحمل','يغير سرعته ذاتياً حسب التحميل ويولد عزماً كبيراً عند السرعات المنخفضة','لا يحتاج إلى حماية','يعمل بالتيار المتردد فقط'],c:1,e:'ص 36.'}
 ]
});

/* =====================================================================
   Lesson 2 — المحرك المركب التراكمي والتفاضلي (ص 37–39)
   ===================================================================== */
const CMP_TP=[
  {k:'V',label:'جهد المصدر V',unit:'V',value:220,min:10,max:5000,step:1},
  {k:'R',label:'مقاومة المنتج وملف التوالي معاً',unit:'Ω',value:0.5,min:0.01,max:100,step:0.01},
  {k:'ksh',label:'مجال ملف التوازي وحده: kφ<sub>sh</sub>',unit:'V/rpm',value:0.12,min:0.001,max:10,step:0.001,hint:'سرعة اللاحمل بملف التوازي ≈ V ÷ kφsh'},
  {k:'c',label:'مجال ملف التوالي لكل 1 A من تيار المنتج (يكبر مع عدد لفاته)',unit:'V/(rpm·A)',value:0.0012,min:0.00001,max:1,step:0.0001},
  {k:'ksat',label:'أقصى مجال كلي (حد التشبع) kφ<sub>max</sub>',unit:'V/rpm',value:0.25,min:0.001,max:20,step:0.001,hint:'يجب أن يكون أكبر من مجال ملف التوازي'},
  {k:'Tf',label:'عزم الاحتكاك والتهوية',unit:'N·m',value:1,min:0.05,max:5000,step:0.05},
  {k:'IaN',label:'تيار المنتج المقنن (للمقارنة بين الأنواع)',unit:'A',value:60,min:0.1,max:10000,step:0.1},
  {k:'nMax',label:'أقصى سرعة مسموحة (تفصل الحماية المصدر عندها)',unit:'rpm',value:3000,min:100,max:50000,step:10},
  {k:'tau',label:'ثابت زمن التسارع (يكبر مع ثقل العضو الدوار)',unit:'s',value:1.5,min:0.1,max:60,step:0.1}];
const TYPES=[['series','التوالي وحده'],['shunt','التوازي وحده'],['cum','المركب التراكمي'],['diff','المركب الفرقي']];
const TCOL={series:'--stop',shunt:'--muted',cum:'--blue',diff:'--live'};
const TNAME=Object.fromEntries(TYPES);

lesson({
 id:'u3-l2',unit:3,order:2,pages:'37–39',
 title:'خواص المحرك المركب: التراكمي والتفاضلي',
 summary:'المحرك المركب فيه ملفان للمجال: ملف توازٍ وملف توالٍ. في التراكمي يساعد ملف التوالي ملف التوازي (φt = φsh + φse) فتقل السرعة مع الحمل وتبقى سرعة اللاحمل معقولة، وفي الفرقي يعاكسه (φt = φsh − φse) فتزيد السرعة مع الحمل، لذلك يُتجنَّب في التحريك.',
 stations:[
  {intro:true},

  {st:1,short:'المحرك المركب',title:'خواص المحرك المركب',ref:'ص 37',
   q:'ماذا لو جمعنا في محرك واحد ملف توالٍ وملف توازٍ؟ وهل يتعاونان دائماً؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="دائرة محرك مركب قصير: ملف توالٍ في الخط الرئيس، وملف توازٍ موصول على طرفي المنتج" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><path d="M70 140V90H100M180 90H290V134M290 186V230H70V172M210 90V128M210 192V230" fill="none" stroke="#2C4A40" stroke-width="4" stroke-linejoin="round"/><circle cx="210" cy="90" r="5" fill="#2C4A40"/><circle cx="210" cy="230" r="5" fill="#2C4A40"/><g data-tip="مصدر الجهد المستمر ⟦V⟧."><line x1="48" y1="140" x2="92" y2="140" stroke="#2C4A40" stroke-width="4"/><line x1="58" y1="152" x2="82" y2="152" stroke="#2C4A40" stroke-width="6"/><line x1="48" y1="162" x2="92" y2="162" stroke="#2C4A40" stroke-width="4"/><line x1="58" y1="172" x2="82" y2="172" stroke="#2C4A40" stroke-width="6"/><text x="104" y="162" text-anchor="middle" font-size="15" font-weight="700" fill="#2C4A40">V</text><rect x="40" y="130" width="76" height="52" fill="transparent"/></g><g data-tip="ملف التوالي: موصول على التوالي مع المنتج، فيمر فيه تيار الحمل، ويتغير مجاله ⟦φse⟧ مع الحمل."><path d="M100 90a10 10 0 0 1 20 0a10 10 0 0 1 20 0a10 10 0 0 1 20 0a10 10 0 0 1 20 0" fill="none" stroke="#E8735A" stroke-width="5"/><text x="140" y="64" text-anchor="middle" font-size="13" font-weight="700" fill="#2C4A40">ملف التوالي</text><rect x="96" y="50" width="88" height="46" fill="transparent"/></g><g data-tip="ملف التوازي: موصول على التوازي مع المنتج (مباشرة على طرفيه، لذلك يسمى المركب «قصيراً»). مجاله ⟦φsh⟧ موجود دائماً ما دام الجهد موجوداً."><path d="M210 128a8 8 0 0 1 0 16a8 8 0 0 1 0 16a8 8 0 0 1 0 16a8 8 0 0 1 0 16" fill="none" stroke="#4FB3A9" stroke-width="5"/><text x="166" y="165" text-anchor="middle" font-size="13" font-weight="700" fill="#2C4A40">ملف التوازي</text><rect x="120" y="124" width="104" height="72" fill="transparent"/></g><g data-tip="المنتج (العضو الدوار)."><circle cx="290" cy="160" r="26" fill="#CFE6DB" stroke="#2C4A40" stroke-width="3.5"/><rect x="283" y="128" width="14" height="8" fill="#2C4A40"/><rect x="283" y="184" width="14" height="8" fill="#2C4A40"/><text x="290" y="166" text-anchor="middle" font-size="16" font-weight="700" fill="#2C4A40">A</text></g><text x="180" y="290" text-anchor="middle" font-size="13.5" font-weight="600" fill="#2C4A40">ملفان للمجال: توالٍ وتوازٍ</text></svg>`,
   cap:'المحرك المركب (القصير): ملف التوالي في الخط الرئيس، وملف التوازي على طرفي المنتج.<br><b>مرّر المؤشر على الملفين والمصدر والمنتج (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'على أي أساس يُقسم المحرك المركب إلى نوعين؟',opts:[
     ['على عدد لفات ملف التوازي',false,'عدد اللفات يغير قوة المجال، لكنه ليس أساس التقسيم في الكتاب.'],
     ['على جهد المصدر: مستمر أو متردد',false,'المحرك المركب محرك تيار مستمر في الحالتين.'],
     ['على مجال ملف التوالي: هل يساعد مجال ملف التوازي أم يعاكسه',true,'نص الكتاب في ص 37: إن ساعده فهو «المركب التراكمي»، وإن عاكسه فهو «المركب الفرقي أو التفاضلي».']]}}
   ],
   body:[
    {book:String.raw`<p>يحتوي محرك التيار المستمر المركب (قصير) على ملفين للمجال المغناطيسي، يوصل الملف الأول <b>على التوازي</b> مع المنتج ويوصل الثاني <b>على التوالي</b> مع المنتج. وينقسم المحرك المركب إلى نوعين بناءً على مجال ملف التوالي هل يساعد أم يعاكس مجال ملف التوازي، ففي الحالة الأولى يسمى المحرك بـ<b>المحرك المركب التراكمي</b> وفي الثانية يسمى بـ<b>المحرك المركب الفرقي أو التفاضلي</b>.</p>`,ref:'ص 37'},
    {tip:String.raw`<table class="tt"><thead><tr><th>النوع</th><th>مجال ملف التوالي</th><th>المجال الكلي</th></tr></thead><tbody>
     <tr><td>المركب التراكمي</td><td>يساعد مجال ملف التوازي</td><td>مجموع المجالين</td></tr>
     <tr><td>المركب الفرقي (التفاضلي)</td><td>يعاكس مجال ملف التوازي</td><td>الفرق بين المجالين</td></tr></tbody></table>
     <p>ملف التوازي يعطي مجالاً ثابتاً تقريباً، وملف التوالي يعطي مجالاً يتغير مع الحمل. الفرق بين النوعين هو اتجاه توصيل ملف التوالي فقط.</p>`,title:'النوعان في سطرين'}
   ]},

  {st:2,short:'التراكمي',title:'خواص المحرك المركب تراكمياً',ref:'ص 37',
   q:'مجالان في الاتجاه نفسه… كيف نحسب المجال الكلي؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="سهم مجال ملف التوازي وسهم مجال ملف التوالي في الاتجاه نفسه، ومجموعهما سهم أطول للمجال الكلي" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="⟦φsh⟧: مجال ملف التوازي، ثابت تقريباً لأن ملف التوازي على جهد ثابت."><line x1="50" y1="110" x2="166" y2="110" stroke="#4FB3A9" stroke-width="14" stroke-linecap="round"/><polygon points="184,110 164,98 164,122" fill="#4FB3A9"/><text x="112" y="88" text-anchor="middle" font-size="16" font-weight="700" fill="#2C4A40" direction="ltr">φsh</text></g><g data-tip="⟦φse⟧: مجال ملف التوالي، يكبر مع تيار الحمل، وهنا في نفس اتجاه ⟦φsh⟧."><line x1="190" y1="110" x2="262" y2="110" stroke="#E8735A" stroke-width="14" stroke-linecap="round"/><polygon points="280,110 260,98 260,122" fill="#E8735A"/><text x="232" y="88" text-anchor="middle" font-size="16" font-weight="700" fill="#2C4A40" direction="ltr">φse</text></g><text x="180" y="150" text-anchor="middle" font-size="13" fill="#2C4A40">نفس الاتجاه: يتجمعان</text><g data-tip="⟦φt⟧: المجال الكلي = مجموع المجالين، فهو أكبر من مجال أي من الملفين وحده."><line x1="50" y1="196" x2="262" y2="196" stroke="#2C4A40" stroke-width="16" stroke-linecap="round"/><polygon points="282,196 260,182 260,210" fill="#2C4A40"/><text x="166" y="232" text-anchor="middle" font-size="16" font-weight="700" fill="#2C4A40" direction="ltr">φt = φsh + φse</text></g><text x="180" y="282" text-anchor="middle" font-size="13.5" font-weight="600" fill="#2C4A40">ملف التوالي يساعد ملف التوازي</text></svg>`,
   cap:'في المركب التراكمي يضاف مجال ملف التوالي إلى مجال ملف التوازي.<br><b>مرّر المؤشر على كل سهم (أو المسه في الجوال) لتعرف معناه.</b>',
   side:[
    {predict:{q:'محرك مركب تراكمي يدور بلا حمل (تيار المنتج صغير جداً). كم يكون المجال الكلي تقريباً؟',opts:[
     ['صفراً تقريباً، كمحرك التوالي',false,'في محرك التوالي وحده نعم، لكن هنا يوجد ملف التوازي ومجاله باقٍ.'],
     ['مجال ملف التوازي تقريباً',true,String.raw`بلا حمل يتلاشى \(\phi_{se}\) تقريباً، فيبقى \(\phi_t\approx\phi_{sh}\). وهذا ما يحفظ السرعة في الحدود المعقولة (المحطة الرابعة).`],
     ['ضعف مجال ملف التوازي',false,'مجال ملف التوالي يتبع تيار الحمل، وبلا حمل يكون صغيراً جداً.']]}}
   ],
   body:[
    {book:String.raw`<p>في المحرك المركب تراكمياً يوصل ملف التوالي بحيث يكون المجال المغناطيسي الناتج عنه في <b>نفس اتجاه</b> المجال الناتج عن ملف التوازي، أي أن ملف التوالي يساعد ملف التوازي. فعند أي حمل يكون المجال المغناطيسي الإجمالي هو مجموع مجالي ملفي التوازي والتوالي. إذاً محصلة المجال المغناطيسي تعتمد على قيمة التيار في كل من ملفي التوازي والتوالي.</p>
     <div class="eq">$$\phi_t=\phi_{sh}+\phi_{se}$$</div>`,ref:'ص 37'},
    {tip:String.raw`<p><b>الرموز:</b> \(\phi_t\) المجال الكلي (المحصلة)، \(\phi_{sh}\) مجال ملف التوازي <span class="ltr">(shunt)</span>، \(\phi_{se}\) مجال ملف التوالي <span class="ltr">(series)</span>.</p>
     <p>كلما زاد الحمل زاد \(\phi_{se}\) فزاد \(\phi_t\)، لكن \(\phi_t\) لا ينزل أبداً تحت \(\phi_{sh}\).</p>`}
   ]},

  {st:3,short:'العزم (التراكمي)',title:'التراكمي: أ- علاقة العزم مع تيار المنتج <span class="ltr">T = f(I<sub>a</sub>)</span>',ref:'ص 37',
   q:'لنفس التيار، أيهما يعطي عزماً أكبر: ملف التوالي وحده، أم ملف التوازي وحده، أم الاثنان معاً؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="العزم مع تيار المنتج: منحنى المركب التراكمي فوق منحنى ملف التوالي وحده وخط ملف التوازي وحده" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><rect x="40" y="36" width="290" height="236" rx="12" fill="#FBF6EE"/><path d="M60 50V250H316" fill="none" stroke="#2C4A40" stroke-width="2.5"/><polygon points="60,42 54,54 66,54" fill="#2C4A40"/><polygon points="324,250 312,244 312,256" fill="#2C4A40"/><text x="76" y="56" text-anchor="middle" font-size="15" font-weight="700" fill="#2C4A40">T</text><text x="314" y="270" text-anchor="middle" font-size="14" font-weight="700" fill="#2C4A40">Ia</text><g data-tip="ملف التوازي وحده (للمقارنة): المجال ثابت، فالعزم يزيد مع التيار في خط مستقيم."><path d="M60 250L310 150" fill="none" stroke="#4FB3A9" stroke-width="4" stroke-dasharray="9 6"/><path d="M60 250L310 150" fill="none" stroke="transparent" stroke-width="18"/><text x="262" y="158" text-anchor="middle" font-size="12" font-weight="700" fill="#2C4A40">توازٍ وحده</text></g><g data-tip="ملف التوالي وحده (للمقارنة): المجال يزيد مع التيار، فالعزم يزيد مع مربع التيار قبل التشبع."><path d="M60 250Q185 250 310 160" fill="none" stroke="#E8735A" stroke-width="4" stroke-dasharray="9 6"/><path d="M60 250Q185 250 310 160" fill="none" stroke="transparent" stroke-width="18"/><text x="250" y="236" text-anchor="middle" font-size="12" font-weight="700" fill="#2C4A40">توالٍ وحده</text></g><g data-tip="المركب التراكمي: المجال الكلي ⟦φt = φsh + φse⟧ أكبر، فالعزم أكبر من عزم أي من الملفين وحده."><path d="M60 250L110 226.4L160 195.6L210 157.6L260 112.4L310 60" fill="none" stroke="#12855A" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><path d="M60 250L110 226.4L160 195.6L210 157.6L260 112.4L310 60" fill="none" stroke="transparent" stroke-width="20"/><text x="214" y="112" text-anchor="middle" font-size="12.5" font-weight="700" fill="#12855A">التراكمي</text></g><text x="180" y="300" text-anchor="middle" font-size="13" fill="#2C4A40">رسم توضيحي للمقارنة</text></svg>`,
   cap:'المنحنى الأخضر للمركب التراكمي كما في الشكل <span class="ltr">(3-2a)</span>، والخطان المتقطعان للمقارنة فقط (ليسا في رسم الكتاب).<br><b>مرّر المؤشر على كل منحنى (أو المسه في الجوال) لتعرف ما يمثله.</b>',
   side:[
    {predict:{q:'ماذا يقول الكتاب عن عزم المحرك المركب التراكمي؟',opts:[
     ['أقل من عزم ملف التوالي وحده',false,'العكس: المجال الكلي أكبر، فالعزم أكبر.'],
     ['يساوي متوسط عزمي الملفين',false,'المجالان يتجمعان، فلا معنى للمتوسط هنا.'],
     ['أكبر من العزم المتولد عندما يعمل المحرك بأي من الملفين على حدة',true,String.raw`نص الكتاب في ص 37. السبب: \(T\propto I_a\,\phi_t\) و\(\phi_t\) هو مجموع المجالين.`]]}}
   ],
   body:[
    {book:String.raw`<p>بما أن \((T\propto I_a\,\phi_t)\) وأن \((\phi_t=\phi_{sh}+\phi_{se})\) فإن محصلة المجال الكلي أصبحت أكبر من ذي قبل. وبالتالي سيزداد العزم بما يتناسب مع الزيادة في المجال، الشكل <span class="ltr">(3-2a)</span>. <b>العزم المتولد سيكون أكبر من ذلك العزم المتولد عندما يعمل المحرك بأي من الملفين على حدة.</b></p>`,ref:'ص 37'},
    {tip:String.raw`<p>العزم يتناسب مع حاصل ضرب التيار في المجال. لنفس التيار: المجال الكلي في التراكمي = مجال التوازي + مجال التوالي، فهو أكبر من كل منهما وحده، فيكون العزم أكبر.</p>`}
   ]},

  {st:4,short:'السرعة (التراكمي)',title:'التراكمي: ب- علاقة السرعة مع تيار المنتج <span class="ltr">n = f(I<sub>a</sub>)</span>',ref:'ص 37–38',
   q:'محرك التوالي تجمح سرعته بلا حمل. هل يحدث هذا للمحرك المركب التراكمي؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="السرعة مع تيار المنتج: منحنى التراكمي يبدأ من سرعة محدودة وينخفض، ومنحنى التوالي المتقطع يرتفع جداً عند التيار الصغير" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><rect x="40" y="36" width="290" height="236" rx="12" fill="#FBF6EE"/><path d="M60 50V250H316" fill="none" stroke="#2C4A40" stroke-width="2.5"/><polygon points="60,42 54,54 66,54" fill="#2C4A40"/><polygon points="324,250 312,244 312,256" fill="#2C4A40"/><text x="76" y="56" text-anchor="middle" font-size="15" font-weight="700" fill="#2C4A40">n</text><text x="314" y="270" text-anchor="middle" font-size="14" font-weight="700" fill="#2C4A40">Ia</text><g data-tip="محرك التوالي وحده (للمقارنة): عند التيار الصغير جداً تكون السرعة عالية إلى درجة الخطورة."><path d="M92 50C110 150 160 200 310 225" fill="none" stroke="#E8735A" stroke-width="4" stroke-dasharray="9 6"/><path d="M92 50C110 150 160 200 310 225" fill="none" stroke="transparent" stroke-width="18"/><text x="140" y="200" text-anchor="middle" font-size="12" font-weight="700" fill="#2C4A40">توالٍ وحده</text></g><g data-tip="المركب التراكمي: تقل سرعته مع زيادة التحميل كمحرك التوالي، لكن بلا جموح."><path d="M60 100C140 104 230 150 310 196" fill="none" stroke="#12855A" stroke-width="6" stroke-linecap="round"/><path d="M60 100C140 104 230 150 310 196" fill="none" stroke="transparent" stroke-width="20"/><text x="236" y="132" text-anchor="middle" font-size="12.5" font-weight="700" fill="#12855A">التراكمي</text></g><g data-tip="سرعة اللاحمل في التراكمي محدودة: عند تلاشي مجال ملف التوالي يبقى مجال ملف التوازي موجوداً."><circle cx="60" cy="100" r="9" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/></g><text x="180" y="300" text-anchor="middle" font-size="13" fill="#2C4A40">رسم توضيحي للمقارنة</text></svg>`,
   cap:'المنحنى الأخضر للمركب التراكمي كما في الشكل <span class="ltr">(3-2b)</span>، والمتقطع لمحرك التوالي للمقارنة فقط.<br><b>مرّر المؤشر على المنحنيين والدائرة الصفراء (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'لماذا تبقى سرعة المحرك المركب التراكمي في الحدود المعقولة بدون أحمال؟',opts:[
     ['لأن مجال ملف التوازي يبقى موجوداً عند تلاشي مجال ملف التوالي',true,'نص الكتاب في ص 38. المجال لا ينهار، فلا ترتفع السرعة إلى درجة الخطورة.'],
     ['لأن ملف التوالي يقوى عند اللاحمل',false,'العكس: مجال ملف التوالي يتلاشى تقريباً عند اللاحمل لأن التيار صغير.'],
     ['لأن جهد المصدر ينخفض عند اللاحمل',false,'جهد المصدر ثابت؛ السبب في المجال.']]}}
   ],
   body:[
    {book:String.raw`<p>بما أن \((n\propto E/\phi_t)\) وأن \((\phi_t=\phi_{sh}+\phi_{se})\)، فعند زيادة الحمل فإن مجال ملف التوالي يساعد مجال ملف التوازي مما يزيد من المجال الكلي للمحرك، لذلك <b>تقل سرعة المحرك مع زيادة الحمل</b>. وتكون السرعة أقل من تلك السرعة التي يدور بها المحرك عندما يعمل بأي من الملفين كل على حدة. من خلال الشكل <span class="ltr">(3-2b)</span> يمكن ملاحظة النقاط التالية:</p>
     <ul><li>أن سرعة المحرك المركب التراكمي تقل مع زيادة التحميل كما في حالة محرك التوالي.</li><li>أن سرعة المحرك تكون في الحدود المعقولة عندما يدور المحرك بدون أحمال، بسبب أن مجال ملف التوازي يكون موجوداً عند تلاشي مجال ملف التوالي.</li></ul>`,ref:'ص 37–38'},
    {tip:String.raw`<p>التراكمي أخذ من محرك التوالي ميزته (السرعة تنخفض مع الحمل والعزم يزيد)، وأخذ من محرك التوازي أمانه (مجال لا ينهار عند اللاحمل).</p>`,title:'أفضل ما في الاثنين'}
   ]},

  {st:5,short:'الخواص الميكانيكية (التراكمي)',title:'التراكمي: ج- علاقة العزم مع السرعة <span class="ltr">T = f(n)</span>',ref:'ص 38',
   q:'أين يقع منحنى التراكمي إذا رسمناه مع منحنيي التوالي والتوازي؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="السرعة مع العزم: منحنى التراكمي يقع بين خط التوازي شبه الأفقي ومنحنى التوالي" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><rect x="40" y="36" width="290" height="236" rx="12" fill="#FBF6EE"/><path d="M60 50V250H316" fill="none" stroke="#2C4A40" stroke-width="2.5"/><polygon points="60,42 54,54 66,54" fill="#2C4A40"/><polygon points="324,250 312,244 312,256" fill="#2C4A40"/><text x="76" y="56" text-anchor="middle" font-size="15" font-weight="700" fill="#2C4A40">n</text><text x="314" y="270" text-anchor="middle" font-size="15" font-weight="700" fill="#2C4A40">T</text><g data-tip="محرك التوازي (للمقارنة): سرعته تكاد تكون ثابتة مع تغير العزم."><path d="M60 100L310 130" fill="none" stroke="#4FB3A9" stroke-width="4" stroke-dasharray="9 6"/><path d="M60 100L310 130" fill="none" stroke="transparent" stroke-width="18"/><text x="270" y="116" text-anchor="middle" font-size="12" font-weight="700" fill="#2C4A40">توازٍ</text></g><g data-tip="محرك التوالي (للمقارنة): سرعة عالية جداً عند العزم الصغير، ومنخفضة عند العزم الكبير."><path d="M85 50C110 170 170 215 310 232" fill="none" stroke="#E8735A" stroke-width="4" stroke-dasharray="9 6"/><path d="M85 50C110 170 170 215 310 232" fill="none" stroke="transparent" stroke-width="18"/><text x="122" y="226" text-anchor="middle" font-size="12" font-weight="700" fill="#2C4A40">توالٍ</text></g><g data-tip="المركب التراكمي (الشكل ⟦(3-2c)⟧): خواصه بين التوازي والتوالي؛ السرعة تنخفض مع زيادة الحمل، وسرعة اللاحمل محدودة."><path d="M60 100C150 115 230 160 310 200" fill="none" stroke="#12855A" stroke-width="6" stroke-linecap="round"/><path d="M60 100C150 115 230 160 310 200" fill="none" stroke="transparent" stroke-width="20"/><text x="232" y="176" text-anchor="middle" font-size="12.5" font-weight="700" fill="#12855A">التراكمي</text></g><text x="180" y="300" text-anchor="middle" font-size="13" fill="#2C4A40">رسم توضيحي للمقارنة</text></svg>`,
   cap:'المنحنى الأخضر للمركب التراكمي، ويقع بين منحنيي التوازي والتوالي (المتقطعين، للمقارنة فقط).<br><b>مرّر المؤشر على كل منحنى (أو المسه في الجوال) لتعرف ما يمثله.</b>',
   side:[
    {predict:{q:'ماذا تسمى علاقة العزم مع السرعة أحياناً؟',opts:[
     ['الخواص الكهربائية للمحرك',false,'الكتاب يسميها «الخواص الميكانيكية»، لأن العزم والسرعة كميتان ميكانيكيتان على عمود المحرك.'],
     ['الخواص الميكانيكية للمحرك',true,'نص الكتاب في ص 38: «علاقة العزم مع السرعة أو كما تسمى أحياناً الخواص الميكانيكية للمحرك».'],
     ['خواص اللاحمل',false,'اللاحمل نقطة واحدة على المنحنى، لا اسم العلاقة كلها.']]}}
   ],
   body:[
    {book:String.raw`<p>علاقة العزم مع السرعة أو كما تسمى أحياناً <b>الخواص الميكانيكية للمحرك</b> تظهر في الشكل <span class="ltr">(3-2c)</span>، وهي <b>تقع بين خواص محرك التوازي ومحرك التوالي</b>. يتضح من الشكل أن للمحرك خواص التوالي، أي انخفاض السرعة مع زيادة الحمل، ويتضح أيضاً أن سرعة اللاحمل تكون في الحدود المسموح بها ميكانيكياً.</p>`,ref:'ص 38'},
    {tip:String.raw`<table class="tt"><thead><tr><th>الرسم في الشكل (3-2)</th><th>المحوران</th><th>شكل المنحنى</th></tr></thead><tbody>
     <tr><td><span class="ltr">(a)</span></td><td>العزم مع تيار المنتج</td><td>يبدأ من الصفر ويرتفع أسرع من الخط المستقيم</td></tr>
     <tr><td><span class="ltr">(b)</span></td><td>السرعة مع تيار المنتج</td><td>يبدأ من سرعة لاحمل محدودة ثم ينخفض تدريجياً</td></tr>
     <tr><td><span class="ltr">(c)</span></td><td>السرعة مع العزم</td><td>يبدأ من قيمة محدودة وينخفض تدريجياً دون أن يصل إلى الصفر</td></tr></tbody></table>`,title:'الشكل (3-2) في جدول'}
   ]},

  {st:6,short:'الفرقي',title:'خواص المحرك المركب فرقياً (أو التفاضلي)',ref:'ص 38',
   q:'لو عكسنا طرفي ملف التوالي فقط، ماذا يحدث للمجال الكلي؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="سهم مجال ملف التوازي إلى اليمين، وسهم مجال ملف التوالي معاكس له، والمجال الكلي سهم أقصر" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><g data-tip="⟦φsh⟧: مجال ملف التوازي، ثابت تقريباً."><line x1="60" y1="96" x2="262" y2="96" stroke="#4FB3A9" stroke-width="14" stroke-linecap="round"/><polygon points="282,96 262,84 262,108" fill="#4FB3A9"/><text x="160" y="76" text-anchor="middle" font-size="16" font-weight="700" fill="#2C4A40" direction="ltr">φsh</text></g><g data-tip="⟦φse⟧: مجال ملف التوالي، في عكس اتجاه ⟦φsh⟧، ويكبر مع تيار الحمل."><line x1="282" y1="140" x2="206" y2="140" stroke="#E8735A" stroke-width="14" stroke-linecap="round"/><polygon points="188,140 208,128 208,152" fill="#E8735A"/><text x="240" y="170" text-anchor="middle" font-size="16" font-weight="700" fill="#2C4A40" direction="ltr">φse</text></g><g data-tip="⟦φt⟧: المجال الكلي = الفرق بين المجالين، ويصغر كلما زاد الحمل."><line x1="60" y1="210" x2="168" y2="210" stroke="#2C4A40" stroke-width="16" stroke-linecap="round"/><polygon points="188,210 166,196 166,224" fill="#2C4A40"/><text x="140" y="246" text-anchor="middle" font-size="16" font-weight="700" fill="#2C4A40" direction="ltr">φt = φsh − φse</text></g><text x="180" y="286" text-anchor="middle" font-size="13.5" font-weight="600" fill="#2C4A40">ملف التوالي يعاكس ملف التوازي</text></svg>`,
   cap:'في المركب الفرقي يُطرح مجال ملف التوالي من مجال ملف التوازي.<br><b>مرّر المؤشر على كل سهم (أو المسه في الجوال) لتعرف معناه.</b>',
   side:[
    {predict:{q:'في المحرك المركب الفرقي، ماذا يحدث للمجال الكلي كلما زاد الحمل؟',opts:[
     ['يزداد',false,'هذا في التراكمي. هنا مجال ملف التوالي يُطرح.'],
     ['لا يتغير',false,'مجال ملف التوالي يتغير مع تيار الحمل، فيتغير الفرق.'],
     ['يتناقص',true,String.raw`الحمل الأكبر يزيد \(\phi_{se}\)، و\(\phi_t=\phi_{sh}-\phi_{se}\) فيصغر المجال الكلي.`]]}}
   ],
   body:[
    {book:String.raw`<p>في المحرك المركب فرقياً يوصل ملف التوالي بحيث يكون المجال المغناطيسي الناتج عنه في <b>عكس اتجاه</b> المجال الناتج عن ملف التوازي، أي أن ملف التوالي يعاكس ملف التوازي. فعند أي حمل تكون محصلة المجال المغناطيسي هي الفرق بين مجالي ملفي التوازي والتوالي:</p>
     <div class="eq">$$\phi_t=\phi_{sh}-\phi_{se}$$</div>`,ref:'ص 38'},
    {watch:String.raw`<p>التراكمي والفرقي قد يكونان المحرك نفسه تماماً؛ الفرق في <b>اتجاه توصيل</b> طرفي ملف التوالي فقط. لذلك يجب التأكد من التوصيل الصحيح عند تركيب المحرك أو صيانته.</p>`}
   ]},

  {st:7,short:'العزم (الفرقي)',title:'الفرقي: أ- علاقة العزم مع تيار المنتج <span class="ltr">T = f(I<sub>a</sub>)</span>',ref:'ص 38',
   q:'إذا كان المجال يضعف كلما زاد التيار، هل يبقى العزم يزيد؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="العزم مع تيار المنتج للمركب الفرقي: منحنى يرتفع ثم يقل ميله، وتحته خط مستقيم متقطع أشد ميلاً" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><rect x="40" y="36" width="290" height="236" rx="12" fill="#FBF6EE"/><path d="M60 50V250H316" fill="none" stroke="#2C4A40" stroke-width="2.5"/><polygon points="60,42 54,54 66,54" fill="#2C4A40"/><polygon points="324,250 312,244 312,256" fill="#2C4A40"/><text x="76" y="56" text-anchor="middle" font-size="15" font-weight="700" fill="#2C4A40">T</text><text x="314" y="270" text-anchor="middle" font-size="14" font-weight="700" fill="#2C4A40">Ia</text><g data-tip="الخط المتقطع المستقيم: مرسوم للمقارنة كما في الشكل ⟦(3-3a)⟧؛ يوضح أن عزم الفرقي يزيد بمعدل أقل منه."><path d="M60 250L240 56" fill="none" stroke="#7A8F86" stroke-width="4" stroke-dasharray="9 6"/><path d="M60 250L240 56" fill="none" stroke="transparent" stroke-width="18"/></g><g data-tip="المركب الفرقي: العزم يزيد مع التيار، لكن ميله يقل تدريجياً لأن المجال الكلي يضعف."><path d="M60 250Q160 120 310 108" fill="none" stroke="#E8735A" stroke-width="6" stroke-linecap="round"/><path d="M60 250Q160 120 310 108" fill="none" stroke="transparent" stroke-width="20"/><text x="250" y="140" text-anchor="middle" font-size="12.5" font-weight="700" fill="#2C4A40">الفرقي</text></g><text x="180" y="300" text-anchor="middle" font-size="13" fill="#2C4A40">رسم توضيحي لشكل المنحنى</text></svg>`,
   cap:'الشكل <span class="ltr">(3-3a)</span> مبسطاً: عزم الفرقي يزيد، لكن بمعدل يقل تدريجياً.<br><b>مرّر المؤشر على المنحنى والخط المتقطع (أو المسهما في الجوال) لتعرف معناهما.</b>',
   side:[
    {predict:{q:'كيف يزداد عزم المحرك المركب الفرقي مع تيار المنتج حسب الكتاب؟',opts:[
     ['بمعدل أكبر من محرك التوالي',false,'هذا أقرب إلى التراكمي، حيث يتجمع المجالان.'],
     ['يزداد، لكن بمعدل أقل من محرك التوالي',true,'نص الكتاب في ص 38: «سيزداد العزم المتولد ولكن بمعدل أقل من محرك التوالي».'],
     ['يتناقص مع زيادة التيار',false,'العزم ما زال يزيد، لأن التيار يزيد أسرع مما يضعف المجال.']]}}
   ],
   body:[
    {book:String.raw`<p>بما أن مجال ملف التوالي يعاكس مجال ملف التوازي، فإن محصلة المجال المغناطيسي تتناقص مع زيادة تيار الحمل. في هذه الحالة سيزداد العزم المتولد ولكن <b>بمعدل أقل</b> من محرك التوالي، الشكل <span class="ltr">(3-3a)</span>.</p>`,ref:'ص 38'},
    {tip:String.raw`<p>العزم \(T\propto I_a\,\phi_t\): التيار يكبر، والمجال \(\phi_t\) يصغر. الحاصل ما زال يكبر، لكن أبطأ؛ لذلك ينحني المنحنى إلى الأسفل بدل أن يكون مستقيماً.</p>`}
   ]},

  {st:8,short:'السرعة (الفرقي)',title:'الفرقي: ب- علاقة السرعة مع تيار المنتج <span class="ltr">n = f(I<sub>a</sub>)</span>',ref:'ص 38',
   q:'في كل المحركات السابقة كانت السرعة تنخفض مع الحمل. هل يشذ المركب الفرقي عن ذلك؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="السرعة مع تيار المنتج للمركب الفرقي: خط أفقي متقطع عند سرعة اللاحمل، والمنحنى يرتفع فوقه مع زيادة التيار" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><rect x="40" y="36" width="290" height="236" rx="12" fill="#FBF6EE"/><path d="M60 50V250H316" fill="none" stroke="#2C4A40" stroke-width="2.5"/><polygon points="60,42 54,54 66,54" fill="#2C4A40"/><polygon points="324,250 312,244 312,256" fill="#2C4A40"/><text x="76" y="56" text-anchor="middle" font-size="15" font-weight="700" fill="#2C4A40">n</text><text x="314" y="270" text-anchor="middle" font-size="14" font-weight="700" fill="#2C4A40">Ia</text><g data-tip="الخط الأفقي المتقطع: مستوى سرعة اللاحمل، كما في الشكل ⟦(3-3b)⟧."><path d="M60 160H310" fill="none" stroke="#7A8F86" stroke-width="3" stroke-dasharray="9 6"/><path d="M60 160H310" fill="none" stroke="transparent" stroke-width="16"/><text x="270" y="182" text-anchor="middle" font-size="12" font-weight="700" fill="#2C4A40">سرعة اللاحمل</text></g><g data-tip="المركب الفرقي: السرعة ترتفع فوق سرعة اللاحمل كلما زاد الحمل، ثم ترتفع بشكل أسرع؛ وهذا خطر على المحرك."><path d="M60 160C160 158 250 130 310 60" fill="none" stroke="#E8735A" stroke-width="6" stroke-linecap="round"/><path d="M60 160C160 158 250 130 310 60" fill="none" stroke="transparent" stroke-width="20"/><text x="214" y="110" text-anchor="middle" font-size="12.5" font-weight="700" fill="#2C4A40">الفرقي</text></g><text x="180" y="300" text-anchor="middle" font-size="13" fill="#2C4A40">رسم توضيحي لشكل المنحنى</text></svg>`,
   cap:'الشكل <span class="ltr">(3-3b)</span> مبسطاً: سرعة الفرقي ترتفع فوق سرعة اللاحمل كلما زاد الحمل.<br><b>مرّر المؤشر على المنحنى والخط المتقطع (أو المسهما في الجوال) لتعرف معناهما.</b>',
   side:[
    {predict:{q:'زاد الحمل على محرك مركب فرقي. ماذا يحدث لسرعته؟',opts:[
     ['تنخفض كمحرك التوالي',false,'في التوالي والتراكمي يقوى المجال مع الحمل فتنخفض السرعة. هنا المجال يضعف.'],
     ['تبقى ثابتة',false,'المجال الكلي يتغير مع الحمل، فلا تبقى السرعة ثابتة.'],
     ['تزداد',true,'نص الكتاب في ص 38: «مع زيادة الحمل تتناقص محصلة المجال المغناطيسي، وبالتالي تزداد سرعة المحرك».']]}}
   ],
   body:[
    {book:String.raw`<p>مع زيادة الحمل تتناقص محصلة المجال المغناطيسي، وبالتالي تزداد سرعة المحرك، الشكل <span class="ltr">(3-3b)</span>، أي أن <b>سرعة المحرك تزداد بزيادة الحمل</b>، هذه الخاصية تشكل خطورة على المحرك إذا ما ازداد التحميل عليه وازدادت السرعة عن الحدود المعقولة.</p>`,ref:'ص 38'},
    {title:'زِد الحمل: التراكمي مقابل الفرقي',widget:(el,B)=>{
      const C={cum:['زاد الحمل','زاد تيار المنتج','زاد مجال ملف التوالي','زاد المجال الكلي (يساعد)','انخفضت السرعة'],
               diff:['زاد الحمل','زاد تيار المنتج','زاد مجال ملف التوالي','نقص المجال الكلي (يعاكس)','ارتفعت السرعة: خطر']};
      let k='diff',tm=[];
      el.innerHTML=`<p class="sub" style="margin:0 0 10px">اختر النوع، ثم اضغط «زِد الحمل» وتابع السلسلة. لاحظ أن الحلقات الثلاث الأولى واحدة في النوعين.</p>
       <div class="w-row" style="margin-top:0"><button class="btn" type="button" data-k="cum">المركب التراكمي</button><button class="btn" type="button" data-k="diff">المركب الفرقي</button></div>
       <div class="chain" style="margin-top:10px"></div>
       <div class="w-row"><button class="btn pri" type="button" data-go>زِد الحمل</button><button class="btn" type="button" data-rs>إعادة</button></div>`;
      const ch=el.querySelector('.chain');
      const rs=()=>{tm.forEach(clearTimeout);tm=[];ch.querySelectorAll('.ck').forEach(x=>x.classList.remove('on'))};
      const draw=()=>{rs();const S=C[k];ch.innerHTML=S.map((s,i)=>`<span class="ck${i===S.length-1?' end':''}">${s}</span>${i<S.length-1?'<span class="ar">←</span>':''}`).join('');
        el.querySelectorAll('[data-k]').forEach(b=>{b.setAttribute('aria-pressed',b.dataset.k===k);b.classList.toggle('pri',b.dataset.k===k)})};
      el.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{k=b.dataset.k;draw()});
      el.querySelector('[data-go]').onclick=()=>{rs();ch.querySelectorAll('.ck').forEach((x,i)=>tm.push(setTimeout(()=>x.classList.add('on'),i*550)))};
      el.querySelector('[data-rs]').onclick=rs;
      draw();
    }}
   ]},

  {st:9,short:'الخواص الميكانيكية (الفرقي)',title:'الفرقي: ج- علاقة العزم مع السرعة <span class="ltr">T = f(n)</span>',ref:'ص 38–39',
   q:'لماذا يوصي الكتاب بتجنب هذا المحرك في التحريك؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="السرعة مع العزم للمركب الفرقي: المنحنى يرتفع فوق سرعة اللاحمل حتى يدخل منطقة السرعة غير المسموح بها" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><rect x="40" y="36" width="290" height="236" rx="12" fill="#FBF6EE"/><g data-tip="المنطقة الحمراء: سرعة أعلى من الحدود المسموح بها؛ يصل إليها الفرقي عند زيادة العزم زيادة كبيرة."><rect x="62" y="44" width="262" height="44" fill="#E8735A" opacity="0.28"/><text x="190" y="72" text-anchor="middle" font-size="12.5" font-weight="700" fill="#2C4A40">فوق الحدود المسموح بها</text></g><path d="M60 50V250H316" fill="none" stroke="#2C4A40" stroke-width="2.5"/><polygon points="60,42 54,54 66,54" fill="#2C4A40"/><polygon points="324,250 312,244 312,256" fill="#2C4A40"/><text x="76" y="104" text-anchor="middle" font-size="15" font-weight="700" fill="#2C4A40">n</text><text x="314" y="270" text-anchor="middle" font-size="15" font-weight="700" fill="#2C4A40">T</text><g data-tip="الخط الأفقي المتقطع: مستوى سرعة اللاحمل، كما في الشكل ⟦(3-3c)⟧."><path d="M60 170H310" fill="none" stroke="#7A8F86" stroke-width="3" stroke-dasharray="9 6"/><path d="M60 170H310" fill="none" stroke="transparent" stroke-width="16"/><text x="272" y="192" text-anchor="middle" font-size="12" font-weight="700" fill="#2C4A40">سرعة اللاحمل</text></g><g data-tip="المركب الفرقي: كلما ازداد العزم ازدادت السرعة."><path d="M60 170C170 168 250 140 304 56" fill="none" stroke="#E8735A" stroke-width="6" stroke-linecap="round"/><path d="M60 170C170 168 250 140 304 56" fill="none" stroke="transparent" stroke-width="20"/><text x="200" y="134" text-anchor="middle" font-size="12.5" font-weight="700" fill="#2C4A40">الفرقي</text></g><text x="180" y="300" text-anchor="middle" font-size="13" fill="#2C4A40">رسم توضيحي لشكل المنحنى</text></svg>`,
   cap:'الشكل <span class="ltr">(3-3c)</span> مبسطاً: كلما زاد العزم زادت السرعة، حتى تتجاوز الحدود المسموح بها.<br><b>مرّر المؤشر على المنحنى والخط المتقطع والمنطقة الحمراء (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'قطار بمحرك مركب فرقي يبدأ صعود مرتفع (يزيد الحمل). ما المشكلة؟',opts:[
     ['تزداد السرعة بدل أن تنخفض، وقد تتجاوز الحدود المسموح بها',true,'نص الكتاب في ص 38: «فعند زيادة العزم زيادة كبيرة تزداد السرعة عن الحدود المسموح بها». لذلك يجب تجنبه كمحرك للتحريك.'],
     ['يتوقف المحرك فوراً',false,'لا يقول الكتاب ذلك؛ المشكلة في ارتفاع السرعة لا في التوقف.'],
     ['لا مشكلة، فعزمه يزيد بمعدل أكبر من التوالي',false,'عزمه يزيد بمعدل أقل من محرك التوالي، وسرعته ترتفع مع الحمل.']]}}
   ],
   body:[
    {book:String.raw`<p>أو الخواص الميكانيكية للمحرك مبينة في الشكل <span class="ltr">(3-3c)</span>. كما يتضح من الشكل أنه كلما ازداد العزم ازدادت السرعة. فعند زيادة العزم زيادة كبيرة تزداد السرعة عن الحدود المسموح بها.</p>
     <p><b>ملحوظة: يجب تجنب استخدام هذا النوع كمحرك للتحريك.</b></p>`,ref:'ص 38–39'},
    {tip:String.raw`<table class="tt"><thead><tr><th></th><th>المركب التراكمي</th><th>المركب الفرقي</th></tr></thead><tbody>
     <tr><td>المجال الكلي</td><td>\(\phi_{sh}+\phi_{se}\): يزيد مع الحمل</td><td>\(\phi_{sh}-\phi_{se}\): ينقص مع الحمل</td></tr>
     <tr><td>العزم مع التيار</td><td>أكبر من عزم أي من الملفين وحده</td><td>يزيد بمعدل أقل من محرك التوالي</td></tr>
     <tr><td>السرعة مع الحمل</td><td>تنخفض (كالتوالي)، واللاحمل محدود</td><td>ترتفع، وقد تتجاوز الحد المسموح</td></tr>
     <tr><td>في التحريك</td><td>مناسب</td><td>يجب تجنبه</td></tr></tbody></table>`,title:'المقارنة في جدول'},
    {watch:String.raw`<p>في الكتاب يُطبع رمز التناسب كأنه الحرف «α» (مثل <span class="ltr">T α Ia . φt</span> في ص 37)، والمقصود \(\propto\) «يتناسب مع».</p>`,fix:true}
   ]},

  {recap:[
   String.raw`المحرك المركب فيه ملف توازٍ وملف توالٍ؛ إن ساعد مجال التوالي مجال التوازي فهو تراكمي، وإن عاكسه فهو فرقي (تفاضلي) (ص 37).`,
   String.raw`التراكمي: \(\phi_t=\phi_{sh}+\phi_{se}\)؛ عزمه أكبر من عزم أي من الملفين وحده، وسرعته تقل مع الحمل، وسرعة اللاحمل محدودة.`,
   String.raw`خواصه الميكانيكية (العزم مع السرعة) تقع بين خواص محرك التوازي ومحرك التوالي (ص 38).`,
   String.raw`الفرقي: \(\phi_t=\phi_{sh}-\phi_{se}\)؛ عزمه يزيد بمعدل أقل من التوالي، وسرعته تزيد مع الحمل، فيجب تجنبه كمحرك للتحريك (ص 38–39).`]}
],
 theory:[
  {h:'خواص المحرك المركب',ref:'ص 37',html:`<p>يحتوي محرك التيار المستمر المركب (قصير) على ملفين للمجال المغناطيسي، يوصل الملف الأول <b>على التوازي</b> مع المنتج ويوصل الثاني <b>على التوالي</b> مع المنتج. وينقسم المحرك المركب إلى نوعين بناءً على مجال ملف التوالي هل يساعد أم يعاكس مجال ملف التوازي، ففي الحالة الأولى يسمى المحرك بـ<b>المحرك المركب التراكمي</b> وفي الثانية يسمى بـ<b>المحرك المركب الفرقي أو التفاضلي</b>.</p>`},
  {fig:'',caption:'توضيح للمتدرب — ليس من الكتاب: دائرة المحرك المركب (ملف توالٍ D1–D2 مع المنتج، وملف توازٍ E1–E2 على المصدر). رسم توضيحي.',draw:()=>box(dcCircuitSVG({type:'cum'}),420)},
  {h:'خواص المحرك المركب تراكمياً',ref:'ص 37–38',html:String.raw`<p>في المحرك المركب تراكمياً يوصل ملف التوالي بحيث يكون المجال المغناطيسي الناتج عنه في <b>نفس اتجاه</b> المجال الناتج عن ملف التوازي، أي أن ملف التوالي يساعد ملف التوازي. فعند أي حمل يكون المجال المغناطيسي الإجمالي هو مجموع مجالي ملفي التوازي والتوالي. إذاً محصلة المجال المغناطيسي تعتمد على قيمة التيار في كل من ملفي التوازي والتوالي.</p>
   $$\phi_t=\phi_{sh}+\phi_{se}$$
   <h3>أ- علاقة العزم مع تيار المنتج \(T=f(I_a)\)</h3>
   <p>بما أن \((T\propto I_a\,\phi_t)\) وأن \((\phi_t=\phi_{sh}+\phi_{se})\) فإن محصلة المجال الكلي أصبحت أكبر من ذي قبل. وبالتالي سيزداد العزم بما يتناسب مع الزيادة في المجال، الشكل (3-2a). <b>العزم المتولد سيكون أكبر من ذلك العزم المتولد عندما يعمل المحرك بأي من الملفين على حدة.</b></p>
   <h3>ب- علاقة السرعة مع تيار المنتج \(n=f(I_a)\)</h3>
   <p>بما أن \((n\propto E/\phi_t)\) وأن \((\phi_t=\phi_{sh}+\phi_{se})\)، فعند زيادة الحمل فإن مجال ملف التوالي يساعد مجال ملف التوازي مما يزيد من المجال الكلي للمحرك، لذلك <b>تقل سرعة المحرك مع زيادة الحمل</b>. وتكون السرعة أقل من تلك السرعة التي يدور بها المحرك عندما يعمل بأي من الملفين كل على حدة. من خلال الشكل (3-2b) يمكن ملاحظة النقاط التالية:</p>
   <ul><li>أن سرعة المحرك المركب التراكمي تقل مع زيادة التحميل كما في حالة محرك التوالي.</li><li>أن سرعة المحرك تكون في الحدود المعقولة عندما يدور المحرك بدون أحمال، بسبب أن مجال ملف التوازي يكون موجوداً عند تلاشي مجال ملف التوالي.</li></ul>
   <h3>ج- علاقة العزم مع السرعة \(T=f(n)\)</h3>
   <p>علاقة العزم مع السرعة أو كما تسمى أحياناً <b>الخواص الميكانيكية للمحرك</b> تظهر في الشكل (3-2c)، وهي <b>تقع بين خواص محرك التوازي ومحرك التوالي</b>. يتضح من الشكل أن للمحرك خواص التوالي، أي انخفاض السرعة مع زيادة الحمل، ويتضح أيضاً أن سرعة اللاحمل تكون في الحدود المسموح بها ميكانيكياً.</p>`},
  {fig:'(3-2)',ref:'ص 38',caption:'خواص المحرك المركب تراكمياً',draw:()=>figCompound('cum')},
  {h:'خواص المحرك المركب فرقياً (أو التفاضلي)',ref:'ص 38',html:String.raw`<p>في المحرك المركب فرقياً يوصل ملف التوالي بحيث يكون المجال المغناطيسي الناتج عنه في <b>عكس اتجاه</b> المجال الناتج عن ملف التوازي، أي أن ملف التوالي يعاكس ملف التوازي. فعند أي حمل تكون محصلة المجال المغناطيسي هي الفرق بين مجالي ملفي التوازي والتوالي:</p>
   $$\phi_t=\phi_{sh}-\phi_{se}$$
   <h3>أ- علاقة العزم مع تيار المنتج \(T=f(I_a)\)</h3>
   <p>بما أن مجال ملف التوالي يعاكس مجال ملف التوازي، فإن محصلة المجال المغناطيسي تتناقص مع زيادة تيار الحمل. في هذه الحالة سيزداد العزم المتولد ولكن <b>بمعدل أقل</b> من محرك التوالي، الشكل (3-3a).</p>
   <h3>ب- علاقة السرعة مع تيار المنتج \(n=f(I_a)\)</h3>
   <p>مع زيادة الحمل تتناقص محصلة المجال المغناطيسي، وبالتالي تزداد سرعة المحرك، الشكل (3-3b)، أي أن <b>سرعة المحرك تزداد بزيادة الحمل</b>، هذه الخاصية تشكل خطورة على المحرك إذا ما ازداد التحميل عليه وازدادت السرعة عن الحدود المعقولة.</p>
   <h3>ج- علاقة العزم مع السرعة \(T=f(n)\)</h3>
   <p>أو الخواص الميكانيكية للمحرك مبينة في الشكل (3-3c). كما يتضح من الشكل أنه كلما ازداد العزم ازدادت السرعة. فعند زيادة العزم زيادة كبيرة تزداد السرعة عن الحدود المسموح بها.</p>
   <p><b>ملحوظة: يجب تجنب استخدام هذا النوع كمحرك للتحريك.</b></p>`},
  {fig:'(3-3)',ref:'ص 39',caption:'خواص المحرك المركب التفاضلي',draw:()=>figCompound('diff')},
  {note:String.raw`<b>توضيح للمتدرب — ليس من الكتاب:</b> المقارنة في سطرين: في <b>التراكمي</b> يزيد المجال مع الحمل (\(\phi_{sh}+\phi_{se}\)) فتنخفض السرعة كالتوالي، ويبقى \(\phi_{sh}\) عند اللاحمل فلا تجمح السرعة. في <b>الفرقي</b> ينقص المجال مع الحمل (\(\phi_{sh}-\phi_{se}\)) فترتفع السرعة كلما زاد الحمل، وهذا عكس المطلوب في القطار عند صعود المرتفعات. في المختبر تقارن الأنواع الأربعة على المحرك نفسه.`},
  {err:'<div class="fixnote">رمز التناسب مطبوع «α» بدل «∝» في علاقات ص 37 (مثل T α Ia . φt)، وكتبناه ∝.</div>'}
 ],
 lab:(el)=>{
  const s={on:false,trip:false,n:0,ang:0,TL:20,type:'cum',t:0};const did={};
  el.innerHTML=`<div id="c2tp"></div><div class="grid e34-lab">
   <div class="panel c5"><h2>المحرك <small>رسم توضيحي — العلاقات من ص 37–39</small></h2>
    <div>${segHTML('ty',TYPES,s.type)}</div>
    <div id="c2c" class="svgbox" style="max-width:420px;margin-inline:auto"></div>
    <div class="e34-row"><button class="btn primary" id="c2on">تشغيل</button><button class="btn" id="c2off">إيقاف</button><button class="btn" id="c2rs">إعادة ضبط الحماية</button></div>
    ${sl('c2L','عزم الحمل T<sub>L</sub>',0,160,0.5,s.TL)}
    <div id="c2msg" class="e34-msg"></div></div>
   <div class="panel c7"><h2>القراءات <small><span id="c2chip" class="e34-chip"></span></small></h2>
    <div class="e34-meters">${meter('تيار المنتج I<sub>a</sub>','c2I')}${meter('المجال الكلي kφ<sub>t</sub>','c2k')}${meter('منه ملف التوالي ±kφ<sub>se</sub>','c2kse')}${meter('السرعة n','c2n')}${meter('العزم المتولد T','c2T')}</div>
    <div class="e34-tbl"><table class="tt" id="c2tb"></table></div>
    <p class="sub">الجدول للمحرك نفسه بالأنواع الأربعة. الأرقام توضيحية، والعزم المتولد يساوي عزم الحمل مضافاً إليه عزم الاحتكاك.</p></div>
   <div class="panel c12"><h2>منحنيات الأنواع الأربعة <small>الخط السميك = النوع المختار، والدائرة = نقطة التشغيل، والخط الأحمر = أقصى سرعة مسموحة</small></h2>
    <div class="e34-legend">${TYPES.map(([k,l])=>`<span><i style="border-color:var(${TCOL[k]})"></i>${l}</span>`).join('')}</div><div id="c2g" class="e34-figs"></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="c2st"></ol></div></div>`;
  const $=q=>el.querySelector(q);
  let Ms={},info={};
  const rebuild=()=>{const v=TP.v;if(v.ksat<=v.ksh)TP.warn('أقصى مجال كلي أصغر من مجال ملف التوازي: لن يظهر أثر ملف التوالي في التراكمي. اجعله أكبر.');else TP.warn('');
   TYPES.forEach(([k])=>{Ms[k]=dcModel(v,k);const M=Ms[k];info[k]={Tn:M.T(v.IaN),nn:M.n(v.IaN),n0:M.op(v.Tf).n,Tpk:M.Tpk()}})};
  const TP=B.params($('#c2tp'),'u3-l2',CMP_TP,()=>{rebuild();steps.redraw()});
  rebuild();
  const M=()=>Ms[s.type];
  const setMsg=(h,k)=>{$('#c2msg').innerHTML=h?`<div class="callout${k==='err'?' err':''}">${h}</div>`:''};
  segBind(el,'ty',v=>{s.type=v;s.on=false;s.trip=false;s.n=0;setMsg('','')});
  $('#c2L').oninput=e=>{s.TL=+e.target.value};
  $('#c2on').onclick=()=>{if(s.trip){setMsg('اضغط «إعادة ضبط الحماية» أولاً.','err');return}s.on=true;setMsg(s.type==='series'&&s.TL<1?'<b>تحذير:</b> محرك توالٍ بلا حمل: لا يوجد ملف توازٍ يحفظ المجال، فتجمح السرعة (الدرس السابق).':'','err')};
  $('#c2off').onclick=()=>{s.on=false};
  $('#c2rs').onclick=()=>{s.trip=false;s.on=false;s.n=0;setMsg('','')};
  const fmn=n=>!isFinite(n)||n>1e6?'بلا حد':fm(n,0);
  const table=()=>{const v=TP.v;$('#c2tb').innerHTML=`<thead><tr><th>النوع</th><th>العزم عند <span class="ltr">${fm(v.IaN,0)} A</span> (N·m)</th><th>السرعة عند <span class="ltr">${fm(v.IaN,0)} A</span> (rpm)</th><th>سرعة اللاحمل (rpm)</th></tr></thead><tbody>${TYPES.map(([k,l])=>`<tr class="${k===s.type?'cur':''}"><td>${l}</td><td>${lt(fm(info[k].Tn,1))}</td><td>${lt(fmn(info[k].nn))}</td><td>${lt(fmn(info[k].n0))}</td></tr>`).join('')}</tbody>`};
  const settled=()=>{const o=M().op(s.TL+TP.v.Tf);return o.ok&&isFinite(o.n)&&Math.abs(s.n-o.n)<Math.max(2,0.01*o.n)};
  const steps=stepsUI($('#c2st'),[
   {t:'التراكمي بلا حمل',get x(){return `اختر «المركب التراكمي»، واجعل الحمل صفراً، ثم شغّل: تستقر السرعة عند نحو ${lt(fmn(info.cum.n0)+' rpm')} — في الحدود المعقولة لأن مجال ملف التوازي موجود (ص 38).`},done:()=>s.type==='cum'&&s.on&&s.TL===0&&settled()},
   {t:'حمّل التراكمي',get x(){return `ارفع الحمل إلى ${lt(fm(info.cum.Tn,0)+' N·m')} أو أكثر: تنخفض السرعة مع الحمل كمحرك التوالي. قارن في الجدول: عزمه عند التيار المقنن (${lt(fm(info.cum.Tn,0)+' N·m')}) أكبر من عزم التوالي وحده ومن التوازي وحده.`},done:()=>s.type==='cum'&&s.on&&!s.trip&&s.TL>=0.95*info.cum.Tn-0.5&&settled()},
   {t:'التوالي وحده بلا حمل',x:'اختر «التوالي وحده» والحمل صفر وشغّل: لا يوجد ملف توازٍ، فيتلاشى المجال وتجمح السرعة حتى تفصل الحماية. هذا هو الفرق الأهم بين التوالي والمركب التراكمي (السؤال <span class="ltr">3-5</span>).',done:()=>did.serTrip},
   {t:'الفرقي: السرعة تزيد مع الحمل',get x(){return `اختر «المركب الفرقي»، اجعل الحمل ${lt('5 N·m')} تقريباً وشغّل، ثم زد الحمل ببطء: ترتفع السرعة بدل أن تنخفض (ص 38). تحتاج سرعة أعلى من ${lt(fmn(1.1*info.diff.n0)+' rpm')}.`},done:()=>s.type==='diff'&&s.on&&!s.trip&&settled()&&s.n>1.1*info.diff.n0},
   {t:'الفرقي بحمل كبير',get x(){return `واصل رفع الحمل نحو ${lt(fm(info.diff.Tpk,0)+' N·m')} (أقصى عزم يستطيعه هذا المحرك الفرقي): تتجاوز السرعة الحد المسموح فتفصل الحماية. لذلك يجب تجنب هذا النوع كمحرك للتحريك.`},done:()=>did.diffTrip}
  ]);
  let lastG=-1;
  const drawG=o=>{const v=TP.v,I1=Math.min(Ms.shunt.Imax,2*v.IaN);let Tm=0;TYPES.forEach(([k])=>Tm=Math.max(Tm,Ms[k].T(I1)));Tm=niceMax(Tm*1.05);const nm=niceMax(v.nMax*1.35);
   const ser=(f)=>TYPES.map(([k])=>{const Mk=Ms[k],pts=[];for(let i=1;i<=160;i++){const I=I1*i/160;pts.push(f(Mk,I))}return {pts,col:TCOL[k],w:k===s.type?3.4:1.5,dash:k===s.type?'':'5 4',op:k===s.type?1:0.8}});
   const run=s.on&&!s.trip&&o.ok;
   const a=plot({w:300,h:220,x0:0,x1:I1,y0:0,y1:Tm,xt:ticks(niceMax(I1),4).filter(x=>x<=I1),yt:ticks(Tm,4),xl:'Ia (A)',yl:'T (N·m)',series:ser((Mk,I)=>[I,Mk.T(I)]),dots:run?[{x:o.I,y:o.T,col:'--fg',ring:1}]:[],aria:'العزم مع تيار المنتج'});
   const b=plot({w:300,h:220,x0:0,x1:I1,y0:0,y1:nm,xt:ticks(niceMax(I1),4).filter(x=>x<=I1),yt:ticks(nm,4),xl:'Ia (A)',yl:'n (rpm)',series:ser((Mk,I)=>[I,Mk.n(I)]),hl:[{v:v.nMax,col:'--stop'}],dots:run?[{x:o.I,y:s.n,col:'--fg',ring:1}]:[],aria:'السرعة مع تيار المنتج'});
   const c=plot({w:300,h:220,x0:0,x1:Tm,y0:0,y1:nm,xt:ticks(Tm,4),yt:ticks(nm,4),xl:'T (N·m)',yl:'n (rpm)',series:ser((Mk,I)=>[Mk.T(I),Mk.n(I)]),hl:[{v:v.nMax,col:'--stop'}],dots:run?[{x:o.T,y:s.n,col:'--fg',ring:1}]:[],aria:'السرعة مع العزم'});
   $('#c2g').innerHTML=`<figure>${box(a)}(a) <span class="ltr">T = f(I<sub>a</sub>)</span></figure><figure>${box(b)}(b) <span class="ltr">n = f(I<sub>a</sub>)</span></figure><figure>${box(c)}(c) <span class="ltr">n = f(T)</span></figure>`;table()};
  loopOn(el,dt=>{const v=TP.v;s.t+=dt;const Mx=M();const o=Mx.op(s.TL+v.Tf);let target=0;
   if(s.on&&!s.trip){target=o.ok?o.n:(s.type==='diff'?Infinity:0);if(!isFinite(target))target=3*v.nMax;target=Math.min(target,3*v.nMax)}
   s.n+=(target-s.n)*(1-Math.exp(-dt/v.tau));if(Math.abs(target-s.n)<0.05)s.n=target;
   if(s.on&&s.n>v.nMax){s.on=false;s.trip=true;if(s.type==='series')did.serTrip=1;if(s.type==='diff')did.diffTrip=1;
    setMsg(s.type==='diff'?`<b>فصلت الحماية المصدر:</b> في المحرك الفرقي ينقص المجال كلما زاد الحمل فترتفع السرعة؛ عند حمل ${lt(fm(s.TL,1)+' N·m')} تجاوزت السرعة ${lt(fm(v.nMax,0)+' rpm')} (ص 38–39).`:s.type==='series'?`<b>فصلت الحماية المصدر:</b> محرك التوالي بحمل ${lt(fm(s.TL,1)+' N·m')} جمحت سرعته فوق ${lt(fm(v.nMax,0)+' rpm')}.`:`<b>فصلت الحماية المصدر:</b> تجاوزت السرعة ${lt(fm(v.nMax,0)+' rpm')}.`,'err')}
   s.ang=(s.ang+s.n/60*360*dt/40)%360;
   const run=s.on&&!s.trip&&o.ok;const I=run?o.I:0,k=run?o.k:0,T=run?o.T:0;
   $('#c2c').innerHTML=dcCircuitSVG({on:s.on&&!s.trip,type:s.type,ang:s.ang});
   $('#c2I').textContent=fm(I,1)+' A';$('#c2k').textContent=fm(k,4);
   const kse=(s.type==='diff'?-1:1)*v.c*I;$('#c2kse').textContent=(s.type==='shunt'?'لا يوجد':(kse>=0?'+':'−')+fm(Math.abs(kse),4));
   $('#c2n').textContent=fm(s.n,0)+' rpm';$('#c2T').textContent=fm(T,1)+' N·m';$('#c2L-v').textContent=fm(s.TL,1)+' N·m';
   const ch=$('#c2chip');
   if(s.trip){ch.className='e34-chip warn';ch.textContent='فصلت الحماية المصدر'}
   else if(!s.on){ch.className='e34-chip';ch.textContent=s.n>1?'المصدر مفصول — يتباطأ':'متوقف'}
   else if(!o.ok){ch.className='e34-chip warn';ch.textContent=s.type==='diff'?'لا نقطة تشغيل: المجال ينهار والسرعة ترتفع':'الحمل أكبر مما يستطيعه المحرك'}
   else if(Math.abs(s.n-target)>Math.max(2,0.01*target)){ch.className='e34-chip hot';ch.textContent=s.n<target?'تتغير السرعة: تزيد':'تتغير السرعة: تقل'}
   else{ch.className='e34-chip ok';ch.textContent='مستقر — '+TNAME[s.type]}
   if(s.t-lastG>0.15){lastG=s.t;drawG(o)}
   steps.check()});
 },
 quiz:[
  {q:'المحرك المركب يحتوي على:',o:['ملف مجال واحد على التوالي','ملف مجال واحد على التوازي','ملفين للمجال: أحدهما على التوازي والآخر على التوالي مع المنتج','مغناطيس دائم فقط'],c:2,e:'ص 37.'},
  {q:'في المحرك المركب التراكمي يكون المجال الكلي:',o:['φt = φsh − φse','φt = φsh + φse','φt = φse فقط','φt = φsh فقط'],c:1,e:'ص 37: ملف التوالي يساعد ملف التوازي.'},
  {q:'لماذا تبقى سرعة المحرك المركب التراكمي في الحدود المعقولة بدون أحمال؟',o:['لأن ملف التوالي يقوى عند اللاحمل','لأن مجال ملف التوازي يبقى موجوداً عند تلاشي مجال ملف التوالي','لأن الجهد ينخفض','لأن العزم يصبح صفراً'],c:1,e:'ص 38.'},
  {q:'الخواص الميكانيكية للمحرك المركب التراكمي تقع:',o:['فوق خواص محرك التوالي','بين خواص محرك التوازي ومحرك التوالي','مطابقة لخواص التوازي','مطابقة لخواص الفرقي'],c:1,e:'ص 38.'},
  {q:'في المحرك المركب الفرقي، عند زيادة الحمل:',o:['تقل السرعة','لا تتغير السرعة','تزداد السرعة','يتوقف المحرك فوراً'],c:2,e:'ص 38: محصلة المجال تتناقص فتزداد السرعة.'},
  {q:'عزم المحرك المركب الفرقي يزداد مع تيار المنتج:',o:['بمعدل أكبر من محرك التوالي','بمعدل أقل من محرك التوالي','بالمعدل نفسه','لا يزداد أبداً'],c:1,e:'ص 38.'},
  {q:'لماذا يجب تجنب المحرك المركب الفرقي كمحرك للتحريك؟',o:['لأن عزم بدئه كبير جداً','لأن سرعته تزداد بزيادة الحمل وقد تتجاوز الحدود المسموح بها','لأنه لا يمكن عكس اتجاهه','لأنه يعمل بالتيار المتردد فقط'],c:1,e:'ص 38–39.'}
 ]
});

/* =====================================================================
   Lesson 3 — المحرك العام والمحرك الحثي ثلاثي الأوجه + أسئلة الوحدة (ص 39–42)
   ===================================================================== */
const IND_TP=[
  {k:'Tm',label:'أقصى عزم T<sub>max</sub> (بالنسبة للعزم المقنن)',unit:'pu',value:2.5,min:1.05,max:10,step:0.05},
  {k:'sm',label:'الانزلاق عند أقصى عزم s<sub>m</sub>',unit:'',value:0.25,min:0.01,max:0.95,step:0.01},
  {k:'ns',label:'السرعة التزامنية n<sub>s</sub>',unit:'rpm',value:1500,min:100,max:10000,step:10},
  {k:'tau',label:'ثابت زمن التسارع (يكبر مع ثقل العضو الدوار)',unit:'s',value:1,min:0.05,max:60,step:0.05,hint:'الزمن الذي يصل فيه العضو الدوار من السكون إلى السرعة التزامنية لو أثّر عليه عزم صافٍ يساوي العزم المقنن'}];

lesson({
 id:'u3-l3',unit:3,order:3,pages:'39–42',
 title:'محركات التيار المتردد للتحريك: المحرك العام والمحرك الحثي ثلاثي الأوجه',
 summary:'المحرك العام محرك توالٍ يعمل على التيار المستمر والمتردد، قدرته كبيرة بالنسبة لحجمه، وسرعته على المتردد أقل وعزم بدئه أضعف، فيناسب التحريك خارج المدن. والمحرك الحثي ثلاثي الأوجه: منحنى العزم مع السرعة جزءان، غير متزن من s = 1 إلى sm ومتزن من sm إلى 0. مع أسئلة الوحدة الثالثة.',
 stations:[
  {intro:true},

  {st:1,short:'المحرك العام',title:'محركات التيار المتردد كمحركات للتحريك — المحرك العام',ref:'ص 39',
   q:'محرك واحد يعمل إذا وصلته بمصدر تيار مستمر، ويعمل أيضاً إذا وصلته بمصدر تيار متردد. ما هذا المحرك، وما ميزته؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="محرك عام واحد يمكن توصيله بمصدر تيار مستمر أو بمصدر تيار متردد" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="مصدر تيار مستمر: الرمز ⟦=⟧ أو ⟦D.C⟧."><rect x="28" y="56" width="104" height="70" rx="12" fill="#F2C14E" stroke="#2C4A40" stroke-width="3"/><line x1="58" y1="84" x2="102" y2="84" stroke="#2C4A40" stroke-width="4"/><line x1="58" y1="96" x2="70" y2="96" stroke="#2C4A40" stroke-width="4"/><line x1="74" y1="96" x2="86" y2="96" stroke="#2C4A40" stroke-width="4"/><line x1="90" y1="96" x2="102" y2="96" stroke="#2C4A40" stroke-width="4"/><text x="80" y="116" text-anchor="middle" font-size="12" font-weight="700" fill="#2C4A40">مستمر</text></g><g data-tip="مصدر تيار متردد: الرمز ⟦~⟧ أو ⟦A.C⟧."><rect x="228" y="56" width="104" height="70" rx="12" fill="#4FB3A9" stroke="#2C4A40" stroke-width="3"/><path d="M256 90q8 -16 16 0t16 0t16 0" fill="none" stroke="#2C4A40" stroke-width="4" stroke-linecap="round"/><text x="280" y="116" text-anchor="middle" font-size="12" font-weight="700" fill="#2C4A40">متردد</text></g><path d="M80 126V160L150 196M280 126V160L210 196" fill="none" stroke="#2C4A40" stroke-width="3" stroke-dasharray="8 6"/><g data-tip="المحرك العام (محرك التوالي العام): تركيبه مثل محرك التيار المستمر التوالي مع بعض التعديلات ليعمل جيداً على التيار المتردد. قدرته عالية مقارنة بحجمه."><circle cx="180" cy="214" r="40" fill="#FBF6EE" stroke="#2C4A40" stroke-width="4"/><text x="180" y="222" text-anchor="middle" font-size="22" font-weight="700" fill="#2C4A40">M</text><rect x="220" y="208" width="44" height="12" rx="3" fill="#2C4A40"/></g><text x="180" y="290" text-anchor="middle" font-size="13.5" font-weight="600" fill="#2C4A40">محرك واحد يعمل على المصدرين</text></svg>`,
   cap:'المحرك العام يعمل على مصدر التيار المستمر وعلى مصدر التيار المتردد.<br><b>مرّر المؤشر على المصدرين والمحرك (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'لماذا يُستخدم المحرك العام في التطبيقات التي تتطلب خفة في الوزن؟',opts:[
     ['لأنه لا يحتاج إلى ملف مجال',false,'هو محرك توالٍ، فيه ملف مجال على التوالي مع المنتج.'],
     ['لأنه ذو قدرة عالية مقارنة بحجمه',true,'نص الكتاب في ص 39: «يمكنه أن يعمل بسرعات عالية، وينتج عزماً كبيراً، فهو ذو قدرة عالية مقارنة بحجمه».'],
     ['لأنه يعمل على التيار المتردد فقط',false,'ميزته أنه يعمل على المصدرين معاً.']]}}
   ],
   body:[
    {book:String.raw`<p>محرك التوالي العام أو <b>المحرك العام</b> هو محرك يعمل على كل من مصدري التيار المستمر والتيار المتردد، وله نفس تركيب آلات التيار المستمر ذات تغذية التوالي مع إدخال بعض التعديلات لتحسين أداء المحرك عند تشغيله بالتيار المتردد، وهذا النوع من المحركات يمكنه أن يعمل بسرعات عالية، وينتج عزماً كبيراً، فهو <b>ذو قدرة عالية مقارنة بحجمه</b>. لذلك يستخدم في التطبيقات التي تتطلب خفة في وزن المحرك المستخدم مع قدرات عالية.</p>`,ref:'ص 39'},
    {add:String.raw`<p>المحرك العام الصغير موجود في بيتك: في المثقاب الكهربائي، والمكنسة الكهربائية، والخلاط. كلها تحتاج سرعة عالية وقدرة كبيرة من محرك خفيف صغير. وفي التحريك الكهربائي يُستخدم المحرك العام بقدرات كبيرة لجر القطارات على شبكات التيار المتردد.</p>`},
    {tip:String.raw`<p>لماذا يعمل محرك التوالي على التيار المتردد أصلاً؟ لأن تيار المنتج وتيار المجال هما التيار نفسه؛ فإذا انعكس اتجاه التيار انعكس الاثنان معاً، فيبقى العزم في الاتجاه نفسه.</p>`}
   ]},

  {st:2,short:'خواص المحرك العام',title:'خواص محرك التوالي العام',ref:'ص 39–40',
   q:'المحرك نفسه والجهد نفسه، مرة مستمراً ومرة متردداً. في أي الحالتين يدور أسرع؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الشكل 3-4: العزم مع السرعة بالوحدات النسبية، منحنى التيار المتردد على يسار منحنى التيار المستمر" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><rect x="24" y="30" width="316" height="252" rx="12" fill="#FBF6EE"/><g stroke="#C9C2B3" stroke-width="1" stroke-dasharray="3 4"><line x1="70" y1="194" x2="320" y2="194"/><line x1="70" y1="142" x2="320" y2="142"/><line x1="70" y1="90" x2="320" y2="90"/><line x1="70" y1="38" x2="320" y2="38"/><line x1="118" y1="38" x2="118" y2="246"/><line x1="166" y1="38" x2="166" y2="246"/><line x1="214" y1="38" x2="214" y2="246"/><line x1="262" y1="38" x2="262" y2="246"/><line x1="310" y1="38" x2="310" y2="246"/></g><path d="M70 36V246H322" fill="none" stroke="#2C4A40" stroke-width="2.5"/><g font-size="11" fill="#2C4A40" text-anchor="middle"><text x="118" y="261">0.2</text><text x="166" y="261">0.4</text><text x="214" y="261">0.6</text><text x="262" y="261">0.8</text><text x="310" y="261">1.0</text><text x="56" y="250">0</text><text x="54" y="198">1.0</text><text x="54" y="146">2.0</text><text x="54" y="94">3.0</text><text x="54" y="42">4.0</text></g><text x="196" y="276" text-anchor="middle" font-size="11.5" font-weight="700" fill="#2C4A40" direction="ltr">Speed (pu)</text><text x="36" y="142" text-anchor="middle" font-size="11.5" font-weight="700" fill="#2C4A40" direction="ltr" transform="rotate(-90 36 142)">Torque (pu)</text><g data-tip="منحنى التشغيل على التيار المتردد ⟦A.C⟧: لنفس العزم تكون السرعة أقل منها على التيار المستمر."><path d="M94 38L118 74.4L166 116L214 152.4L262 173.2L310 194" fill="none" stroke="#E8735A" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M94 38L118 74.4L166 116L214 152.4L262 173.2L310 194" fill="none" stroke="transparent" stroke-width="20"/><text x="140" y="140" text-anchor="middle" font-size="13" font-weight="700" fill="#E8735A" direction="ltr">A.C</text></g><g data-tip="منحنى التشغيل على التيار المستمر ⟦D.C⟧: لنفس العزم تكون السرعة أعلى."><path d="M190 38L214 79.6L262 136.8L286 162.8L310 181" fill="none" stroke="#2C4A40" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M190 38L214 79.6L262 136.8L286 162.8L310 181" fill="none" stroke="transparent" stroke-width="20"/><text x="276" y="100" text-anchor="middle" font-size="13" font-weight="700" fill="#2C4A40" direction="ltr">D.C</text></g><g data-tip="خط عزم واحد ⟦2.0 pu⟧: يقطع منحنى ⟦A.C⟧ عند سرعة أقل مما يقطع منحنى ⟦D.C⟧."><line x1="70" y1="142" x2="320" y2="142" stroke="#12855A" stroke-width="2.5"/><circle cx="200" cy="142" r="6" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><circle cx="266" cy="142" r="6" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><rect x="70" y="134" width="250" height="16" fill="transparent"/></g></svg>`,
   cap:'الشكل <span class="ltr">(3-4)</span> مرسوماً من جديد بتدريج الكتاب (النقاط مقروءة تقريبياً من رسمه). الخط الأخضر عزم واحد يقطع المنحنيين.<br><b>مرّر المؤشر على المنحنيين والخط الأخضر (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'لنفس الجهد، لماذا تكون سرعة المحرك العام على التيار المتردد أقل منها على التيار المستمر؟',opts:[
     ['لأن معاوقة ملفات المنتج والمجال تمتص جزءاً من جهد المصدر',true,'هذا السبب الأول في ص 39–40. والسبب الثاني: التشبع عند القيم العظمى للتيار المتردد يقلل المجال والعزم.'],
     ['لأن تردد المصدر يفرض سرعة تزامنية',false,'هذا في المحرك الحثي والتزامني؛ المحرك العام محرك توالٍ بلا سرعة تزامنية.'],
     ['لأن المحرك لا يدور على التيار المتردد إلا بنصف سرعته دائماً',false,'لا توجد نسبة ثابتة كهذه؛ الفرق يأتي من المعاوقة والتشبع.']]}}
   ],
   body:[
    {book:String.raw`<p>الشكل (3-4) يوضح خواص المحرك العام، يتضح من الشكل، أن خواص المحرك تختلف بعض الشيء عند تشغيله بالتيار المتردد، عن خواصه عند تشغيله بالتيار المستمر، وذلك لسببين:</p>
     <ul><li>معاوقة ملفات المنتج وملفات المجال تمتص جزءاً من جهد المصدر، وبالتالي تكون <b>السرعة أقل</b> عند استخدام الجهد المتردد عنها في حالة استخدام نفس الجهد المستمر.</li>
     <li>قد تصل الدائرة المغناطيسية إلى حالة التشبع المغناطيسي عند القيم العظمى للتيار المتردد، مما يقلل من قيمة المجال المغناطيسي وبالتالي <b>العزم المتولد</b>.</li></ul>`,ref:'ص 39–40'},
    {title:'اختر عزماً واقرأ السرعتين',widget:(el,B)=>{
      const AC=[[0.1,4.0],[0.2,3.3],[0.4,2.5],[0.6,1.8],[0.8,1.4],[1.0,1.0]],DC=[[0.5,4.0],[0.6,3.2],[0.8,2.1],[0.9,1.6],[1.0,1.25]];
      const sp=(P,T)=>{for(let i=0;i<P.length-1;i++){const [n1,t1]=P[i],[n2,t2]=P[i+1];if(T<=t1&&T>=t2)return n1+(t1-T)/(t1-t2)*(n2-n1)}return NaN};
      const f=x=>isFinite(x)?x.toFixed(2):'خارج الرسم';
      el.innerHTML=`<p class="sub" style="margin:0 0 10px">حرّك العزم، واقرأ سرعة المحرك على كل مصدر من منحنيي الشكل (3-4). النقاط مقروءة تقريبياً من رسم الكتاب، والوحدات نسبية <span class="ltr">(pu)</span>.</p>
       <label class="w-sl"><span>العزم <span class="ltr">T = <b data-o="T"></b> pu</span></span><input type="range" min="1.25" max="4" step="0.05" dir="ltr" value="2"></label>
       <div class="w-facts" style="grid-template-columns:repeat(3,minmax(0,1fr))"><div><span>السرعة على التيار المستمر</span><b data-o="d"></b></div><div><span>السرعة على التيار المتردد</span><b data-o="a"></b></div><div><span>المتردد ÷ المستمر</span><b data-o="r"></b></div></div>`;
      const o=k=>el.querySelector(`[data-o="${k}"]`),rg=el.querySelector('input');
      const draw=()=>{const T=+rg.value,a=sp(AC,T),d=sp(DC,T);o('T').textContent=T.toFixed(2);o('d').textContent=f(d);o('a').textContent=f(a);o('r').textContent=isFinite(a)&&isFinite(d)?(a/d).toFixed(2):'—'};
      rg.oninput=draw;draw();
    }},
    {tip:String.raw`<p><b>pu</b> اختصار <span class="ltr">per unit</span> أي «بالنسبة للقيمة المقننة»: <span class="ltr">1.0</span> تعني القيمة المقننة، و<span class="ltr">2.0</span> ضعفها. لذلك لا يحتاج الشكل إلى أرقام محرك معين.</p>`},
    {watch:String.raw`<p>تعليق الشكل مطبوع في الكتاب «الشكل <span class="ltr">4-3</span>» بترتيب أرقام معكوس، والنص يسميه (3-4)؛ وهو الشكل نفسه.</p>`,fix:true}
   ]},

  {st:3,short:'عزم البدء وخارج المدن',title:'عزم البدء في المحرك العام: لماذا خارج المدن؟',ref:'ص 40',
   q:'قطار يقف كل بضع دقائق، وآخر يسير مسافات طويلة بلا توقف. أيهما يناسبه المحرك العام؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="خطان للقطار: خط داخل المدينة كثير المحطات المتقاربة، وخط خارج المدن محطاته متباعدة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="داخل المدن: المحطات متقاربة، فيتكرر الوقوف وبدء الحركة؛ والمحرك العام عزم بدئه قليل، فلا يناسب."><rect x="30" y="54" width="300" height="96" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="180" y="80" text-anchor="middle" font-size="13.5" font-weight="700" fill="#2C4A40">داخل المدن</text><line x1="50" y1="116" x2="310" y2="116" stroke="#2C4A40" stroke-width="5" stroke-linecap="round"/><g fill="#E8735A" stroke="#2C4A40" stroke-width="2"><circle cx="60" cy="116" r="9"/><circle cx="102" cy="116" r="9"/><circle cx="144" cy="116" r="9"/><circle cx="186" cy="116" r="9"/><circle cx="228" cy="116" r="9"/><circle cx="270" cy="116" r="9"/><circle cx="300" cy="116" r="9"/></g><text x="180" y="142" text-anchor="middle" font-size="12" fill="#2C4A40">وقوف وبدء حركة متكرر</text></g><g data-tip="خارج المدن: المسافات بين الوقفات طويلة، والتسارع العالي غير ضروري؛ فيناسب المحرك العام."><rect x="30" y="170" width="300" height="96" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="180" y="196" text-anchor="middle" font-size="13.5" font-weight="700" fill="#2C4A40">خارج المدن</text><line x1="50" y1="232" x2="310" y2="232" stroke="#2C4A40" stroke-width="5" stroke-linecap="round"/><g fill="#12855A" stroke="#2C4A40" stroke-width="2"><circle cx="60" cy="232" r="9"/><circle cx="300" cy="232" r="9"/></g><text x="180" y="258" text-anchor="middle" font-size="12" fill="#2C4A40">مسافات طويلة بين الوقفات</text></g><text x="180" y="296" text-anchor="middle" font-size="13.5" font-weight="600" fill="#2C4A40">الدوائر = المحطات</text></svg>`,
   cap:'كثرة المحطات تعني كثرة بدء الحركة؛ وعزم البدء هو نقطة ضعف المحرك العام.<br><b>مرّر المؤشر على كل خط (أو المسه في الجوال) لتعرف لماذا يناسبه المحرك العام أو لا يناسبه.</b>',
   side:[
    {predict:{q:'لماذا لا يناسب المحرك العام وسائل التحريك داخل المدن؟',opts:[
     ['لأن سرعته القصوى منخفضة',false,'المحرك العام يعمل بسرعات عالية؛ المشكلة عند البدء.'],
     ['لأن وزنه كبير',false,'العكس: قدرته عالية مقارنة بحجمه ووزنه.'],
     ['لأن عزم بدء حركته قليل، وداخل المدن يتكرر الوقوف وبدء الحركة',true,'نص الكتاب في ص 40: عند البدء يكون معامل القدرة رديئاً، فيكون عزم البدء أقل بكثير من محرك التيار المستمر.']]}}
   ],
   body:[
    {book:String.raw`<p>عند بدء الحركة \((E=0)\) يكون معامل القدرة رديئاً (منخفضاً) إذاً لنفس التيار يكون <b>عزم بدء الحركة أقل بكثير</b> من العزم المتولد في محرك التيار المستمر. نتيجة لقلة عزم بدء الحركة فإن هذه المحركات <b>ليست مناسبة لوسائل التحريك داخل المدن</b> حيث يتكرر الوقوف وبدء الحركة، لكنها تكون مناسبة للاستعمال في وسائل التحريك <b>خارج المدن</b> حيث تكون المسافات طويلة بين الوقفات، ولا يكون التسارع العالي ضرورياً في هذه الحالة.</p>`,ref:'ص 40'},
    {tip:String.raw`<p>عند البدء لا يدور المحرك، فالقوة الدافعة العكسية \(E=0\). يبقى في الدائرة المقاومة والمعاوقة فقط، ومعاوقة الملفات على التيار المتردد كبيرة، فيصبح معامل القدرة رديئاً، فيقل الجزء المفيد من التيار الذي يولد العزم.</p>`},
    {add:String.raw`<p>قطارات المسافات الطويلة بين المدن تبدأ حركتها مرات قليلة في الرحلة، ثم تسير طويلاً بسرعة شبه ثابتة؛ أما قطار الأنفاق (المترو) فيقف ويبدأ كل دقيقة أو دقيقتين تقريباً، فيحتاج تسارعاً عالياً وعزم بدء كبيراً.</p>`}
   ]},

  {st:4,short:'المحرك الحثي',title:'المحرك الحثي ثلاثي الأوجه',ref:'ص 41',
   q:'على منحنى العزم والسرعة نفسه، جزء يعمل فيه المحرك بثبات وجزء لا يستطيع البقاء فيه. ما الفرق بينهما؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الشكل 3-5: العزم مع الانزلاق والسرعة، الجزء الصاعد غير متزن والجزء الهابط متزن" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><rect x="24" y="30" width="316" height="262" rx="12" fill="#FBF6EE"/><g data-tip="المنطقة البرتقالية: تشغيل غير متزن ⟦Unstable Operation⟧، من ⟦s = 1⟧ إلى ⟦s = sm⟧؛ هنا يزداد العزم بزيادة السرعة."><rect x="62" y="40" width="186" height="174" fill="#E8735A" opacity="0.18"/><text x="155" y="58" text-anchor="middle" font-size="12.5" font-weight="700" fill="#2C4A40">غير متزن</text></g><g data-tip="المنطقة الخضراء: تشغيل متزن ⟦Stable Operation⟧، من ⟦s = sm⟧ إلى ⟦s = 0⟧؛ هنا يقل العزم بزيادة السرعة."><rect x="248" y="40" width="64" height="174" fill="#12855A" opacity="0.18"/><text x="280" y="58" text-anchor="middle" font-size="12.5" font-weight="700" fill="#2C4A40">متزن</text></g><path d="M62 36V214H318" fill="none" stroke="#2C4A40" stroke-width="2.5"/><text x="48" y="48" text-anchor="middle" font-size="14" font-weight="700" fill="#2C4A40">T</text><line x1="248" y1="78" x2="248" y2="214" stroke="#7A8F86" stroke-width="2" stroke-dasharray="5 4"/><path d="M62 160C120 150 200 110 248 78C272 64 292 130 312 214" fill="none" stroke="#2C4A40" stroke-width="5" stroke-linecap="round"/><g data-tip="عزم البدء ⟦T starting⟧: العزم عند السكون ⟦(n = 0، s = 1)⟧."><circle cx="62" cy="160" r="7" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><text x="70" y="184" text-anchor="start" font-size="11.5" font-weight="700" fill="#2C4A40" direction="ltr">T starting</text></g><g data-tip="أقصى عزم ⟦T max⟧ عند الانزلاق ⟦sm⟧: الحد بين الجزأين."><circle cx="248" cy="78" r="7" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><text x="232" y="74" text-anchor="end" font-size="11.5" font-weight="700" fill="#2C4A40" direction="ltr">T max</text></g><g data-tip="محور الانزلاق ⟦s⟧: من ⟦1⟧ عند السكون إلى ⟦0⟧ عند السرعة التزامنية."><line x1="62" y1="236" x2="312" y2="236" stroke="#2C4A40" stroke-width="2"/><text x="62" y="252" text-anchor="middle" font-size="11.5" fill="#2C4A40">1.0</text><text x="248" y="252" text-anchor="middle" font-size="11.5" font-weight="700" fill="#2C4A40">sm</text><text x="312" y="252" text-anchor="middle" font-size="11.5" fill="#2C4A40">0</text><text x="40" y="240" text-anchor="middle" font-size="11.5" font-weight="700" fill="#2C4A40">s</text></g><g data-tip="محور السرعة ⟦n⟧: من ⟦0⟧ عند السكون إلى السرعة التزامنية ⟦ns⟧."><line x1="62" y1="266" x2="312" y2="266" stroke="#2C4A40" stroke-width="2"/><text x="62" y="282" text-anchor="middle" font-size="11.5" fill="#2C4A40">0</text><text x="312" y="282" text-anchor="middle" font-size="11.5" font-weight="700" fill="#2C4A40">ns</text><text x="40" y="270" text-anchor="middle" font-size="11.5" font-weight="700" fill="#2C4A40">n</text></g></svg>`,
   cap:'الشكل <span class="ltr">(3-5)</span> مبسطاً: محوران أفقيان، الانزلاق من 1 إلى 0 والسرعة من 0 إلى <span class="ltr">n<sub>s</sub></span>.<br><b>مرّر المؤشر على المنطقتين والنقطتين والمحورين (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'في أي جزء من المنحنى تكون خواص تشغيل المحرك متزنة؟',opts:[
     [String.raw`من \(s=1\) إلى \(s=s_m\)، حيث يزداد العزم بزيادة السرعة`,false,'هذا هو الجزء غير المتزن حسب الكتاب.'],
     [String.raw`من \(s=s_m\) إلى \(s=0\)، حيث يقل العزم بزيادة السرعة`,true,'نص الكتاب في ص 41: خواص التشغيل «غير متزنة في الجزء الأول، بينما تكون متزنة في الجزء الثاني».'],
     [String.raw`عند \(s=1\) فقط`,false,'هذه نقطة السكون (بدء الحركة)، وهي في بداية الجزء غير المتزن.']]}}
   ],
   body:[
    {book:String.raw`<p>بالرجوع إلى مقرر آلات التيار المتردد، عند رسم العلاقة بين العزم والانزلاق أو بين العزم والسرعة نحصل على المنحنى الموضح في الشكل (3-5):</p>
     <p>ينقسم منحنى العلاقة بين العزم والانزلاق (السرعة) إلى جزأين مختلفين، فمن \(s=1\) إلى \(s=s_m\) يزداد عزم الدوران بزيادة السرعة بينما يقل عزم الدوران الذي يبذله المحرك من \(s=s_m\) إلى \(s=0\) بزيادة السرعة ولذلك فإن المحرك تكون خواص تشغيله <b>غير متزنة في الجزء الأول</b>، بينما تكون <b>متزنة في الجزء الثاني</b>.</p>`,ref:'ص 41'},
    {title:'هزّة صغيرة في السرعة: ماذا يحدث؟',widget:(el,B)=>{
      const C={st:['انخفضت السرعة قليلاً (حمل زاد لحظة)','زاد عزم المحرك','العزم أكبر من الحمل','عادت السرعة إلى مكانها: تشغيل متزن'],
               un:['انخفضت السرعة قليلاً (حمل زاد لحظة)','نقص عزم المحرك','العزم أقل من الحمل','تنخفض السرعة أكثر فأكثر: تشغيل غير متزن']};
      let k='st',tm=[];
      el.innerHTML=`<p class="sub" style="margin:0 0 10px">اختر الجزء الذي يعمل فيه المحرك، ثم اضغط «هزّة» وتابع السلسلة.</p>
       <div class="w-row" style="margin-top:0"><button class="btn" type="button" data-k="un">الجزء الأول: من <span class="ltr">s = 1</span> إلى <span class="ltr">s<sub>m</sub></span></button><button class="btn" type="button" data-k="st">الجزء الثاني: من <span class="ltr">s<sub>m</sub></span> إلى <span class="ltr">s = 0</span></button></div>
       <div class="chain" style="margin-top:10px"></div>
       <div class="w-row"><button class="btn pri" type="button" data-go>هزّة</button><button class="btn" type="button" data-rs>إعادة</button></div>`;
      const ch=el.querySelector('.chain');
      const rs=()=>{tm.forEach(clearTimeout);tm=[];ch.querySelectorAll('.ck').forEach(x=>x.classList.remove('on'))};
      const draw=()=>{rs();const S=C[k];ch.innerHTML=S.map((s,i)=>`<span class="ck${i===S.length-1?' end':''}">${s}</span>${i<S.length-1?'<span class="ar">←</span>':''}`).join('');
        el.querySelectorAll('[data-k]').forEach(b=>{b.setAttribute('aria-pressed',b.dataset.k===k);b.classList.toggle('pri',b.dataset.k===k)})};
      el.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{k=b.dataset.k;draw()});
      el.querySelector('[data-go]').onclick=()=>{rs();ch.querySelectorAll('.ck').forEach((x,i)=>tm.push(setTimeout(()=>x.classList.add('on'),i*550)))};
      el.querySelector('[data-rs]').onclick=rs;
      draw();
    }},
    {tip:String.raw`<p>الانزلاق \(s=\dfrac{n_s-n}{n_s}\) (من مقرر آلات التيار المتردد): عند السكون \(s=1\)، وعند السرعة التزامنية \(s=0\). لذلك يسير محور الانزلاق عكس محور السرعة في الشكل.</p>
     <p>في الجزء الثاني (المتزن) إذا انخفضت السرعة قليلاً <b>زاد</b> العزم فأعادها، وفي الجزء الأول انخفاضها <b>ينقص</b> العزم فتنخفض أكثر. لذلك يعمل المحرك في التشغيل العادي على الجزء الثاني.</p>`},
    {watch:String.raw`<p>تعليق الشكل مطبوع في الكتاب «الشكل(<span class="ltr">5-3</span>)» بترتيب أرقام معكوس، والنص يسميه (3-5). والكتاب لا يذكر هنا معادلة لعزم المحرك الحثي؛ شكل المنحنى في المختبر من معادلة خارج الكتاب.</p>`,fix:true}
   ]},

  {st:5,short:'أسئلة الوحدة',title:'أسئلة متنوعة — الوحدة الثالثة',ref:'ص 42',
   q:'خمسة أسئلة تراجع الوحدة كلها. حاول الإجابة قبل أن تفتح الإجابة المقترحة.',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="بطاقة بأسئلة الوحدة الخمسة والمحرك الذي يخصه كل سؤال" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><rect x="44" y="40" width="272" height="240" rx="16" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><rect x="44" y="40" width="272" height="40" rx="16" fill="#2C4A40"/><rect x="44" y="64" width="272" height="16" fill="#2C4A40"/><text x="180" y="66" text-anchor="middle" font-size="14.5" font-weight="700" fill="#FBF6EE">أسئلة الوحدة الثالثة</text><g data-tip="السؤال ⟦3-1⟧: محرك التوالي — الدرس الأول من الوحدة."><rect x="60" y="92" width="240" height="30" rx="8" fill="#F2C14E"/><text x="272" y="112" text-anchor="middle" font-size="12" font-weight="700" fill="#2C4A40" direction="ltr">3-1</text><text x="160" y="112" text-anchor="middle" font-size="12" fill="#2C4A40">محرك التوالي</text></g><g data-tip="السؤال ⟦3-2⟧: المحرك العام — المحطتان الأولى والثالثة من هذا الدرس."><rect x="60" y="128" width="240" height="30" rx="8" fill="#4FB3A9"/><text x="272" y="148" text-anchor="middle" font-size="12" font-weight="700" fill="#2C4A40" direction="ltr">3-2</text><text x="160" y="148" text-anchor="middle" font-size="12" fill="#2C4A40">المحرك العام</text></g><g data-tip="السؤال ⟦3-3⟧: المركب الفرقي — الدرس الثاني من الوحدة."><rect x="60" y="164" width="240" height="30" rx="8" fill="#E8735A"/><text x="272" y="184" text-anchor="middle" font-size="12" font-weight="700" fill="#2C4A40" direction="ltr">3-3</text><text x="160" y="184" text-anchor="middle" font-size="12" fill="#2C4A40">المركب الفرقي</text></g><g data-tip="السؤال ⟦3-4⟧: المحرك الحثي ثلاثي الأوجه — المحطة الرابعة من هذا الدرس."><rect x="60" y="200" width="240" height="30" rx="8" fill="#CFE6DB"/><text x="272" y="220" text-anchor="middle" font-size="12" font-weight="700" fill="#2C4A40" direction="ltr">3-4</text><text x="160" y="220" text-anchor="middle" font-size="12" fill="#2C4A40">المحرك الحثي (رسم)</text></g><g data-tip="السؤال ⟦3-5⟧: مقارنة التوالي بالمركب التراكمي — الدرسان الأول والثاني من الوحدة."><rect x="60" y="236" width="240" height="30" rx="8" fill="#E6E2F8"/><text x="272" y="256" text-anchor="middle" font-size="12" font-weight="700" fill="#2C4A40" direction="ltr">3-5</text><text x="160" y="256" text-anchor="middle" font-size="12" fill="#2C4A40">التوالي والتراكمي</text></g></svg>`,
   cap:'كل سؤال وموضوعه.<br><b>مرّر المؤشر على كل سطر (أو المسه في الجوال) لتعرف أين تجد شرحه.</b>',
   side:[
    {book:String.raw`<ol style="list-style:none;padding:0"><li><span class="ltr">3-1</span>: ما الذي يجعل محرك التيار المستمر توالي الأكثر مناسبة للاستخدام في التحريك الكهربائي؟</li><li><span class="ltr">3-2</span>: ما الذي يجعل محرك التوالي العام مناسباً للاستخدام في وسائل التحريك خارج المدن؟</li><li><span class="ltr">3-3</span>: لماذا يجب تجنب استخدام محرك التيار المستمر المركب فرقياً كمحرك جر؟</li><li><span class="ltr">3-4</span>: ارسم العلاقة بين العزم والسرعة للمحركات الحثية ثلاثية الأوجه؟</li><li><span class="ltr">3-5</span>: ما الفرق بين محرك التيار المستمر التوالي ومحرك التيار المستمر المركب التراكمي؟</li></ol>`,ref:'ص 42'}
   ],
   body:[
    {predict:{q:'السؤال <span class="ltr">3-3</span>: لماذا يُتجنب المركب الفرقي كمحرك جر؟',opts:[
     ['لأن عزم بدئه كبير جداً',false,'المشكلة ليست في العزم بل في السرعة.'],
     ['لأن سرعته تزداد بزيادة الحمل، وقد تتجاوز الحدود المسموح بها',true,'مجال ملف التوالي يعاكس مجال ملف التوازي، فينقص المجال الكلي مع الحمل وترتفع السرعة (ص 38–39).'],
     ['لأنه لا يعمل إلا على التيار المتردد',false,'المركب الفرقي محرك تيار مستمر.']]}},
    {tip:String.raw`<p><b><span class="ltr">3-1</span>:</b> أنه يولد عزماً كبيراً عند السرعات المنخفضة (عند البدء والتحميل) وعزماً صغيراً عند السرعات العالية، وأنه ذو سرعة متغيرة تلقائياً: يغير سرعته ذاتياً حسب التحميل، فإذا زاد الحمل (كصعود مرتفع) انخفضت سرعته وزاد عزمه، وإذا نقص الحمل زادت سرعته (ص 35–36). مع الانتباه إلى أنه لا يُشغَّل بلا حمل.</p>
     <p><b><span class="ltr">3-2</span>:</b> عزم بدء حركته على التيار المتردد أقل بكثير من محرك التيار المستمر لأن معامل القدرة عند البدء رديء، فلا يناسب داخل المدن حيث يتكرر الوقوف والبدء. أما خارج المدن فالمسافات بين الوقفات طويلة والتسارع العالي غير ضروري، وهو ذو قدرة عالية مقارنة بحجمه ووزنه (ص 39–40).</p>
     <p><b><span class="ltr">3-3</span>:</b> لأن مجال ملف التوالي فيه يعاكس مجال ملف التوازي، فتتناقص محصلة المجال مع زيادة الحمل، فتزداد السرعة بزيادة الحمل؛ وعند زيادة العزم زيادة كبيرة تزداد السرعة عن الحدود المسموح بها، وهذا خطر على المحرك (ص 38–39).</p>
     <p><b><span class="ltr">3-4</span>:</b> المنحنى كما في الشكل (3-5) والمحطة الرابعة: يبدأ عند السكون <span class="ltr">(n = 0، s = 1)</span> بعزم البدء، ويرتفع مع زيادة السرعة حتى أقصى عزم عند الانزلاق <span class="ltr">s<sub>m</sub></span> (الجزء غير المتزن)، ثم ينحدر بشدة حتى الصفر عند السرعة التزامنية <span class="ltr">(n = n<sub>s</sub>، s = 0)</span> (الجزء المتزن).</p>
     <p><b><span class="ltr">3-5</span>:</b> في محرك التوالي ملف مجال واحد على التوالي مع المنتج، فالمجال كله يأتي من تيار المنتج: يتلاشى عند اللاحمل فتجمح السرعة، ولذلك لا يُشغَّل بلا حمل. أما المركب التراكمي ففيه ملف توالٍ وملف توازٍ يساعد أحدهما الآخر <span class="ltr">(φt = φsh + φse)</span>: سرعته تقل مع زيادة الحمل كالتوالي، وعزمه أكبر من عزم أي من الملفين وحده، وسرعة اللاحمل محدودة لأن مجال ملف التوازي يبقى موجوداً؛ وخواصه الميكانيكية تقع بين خواص التوازي والتوالي (ص 35–38).</p>`,title:'إجابات مقترحة'},
    {watch:String.raw`<p>الكتاب لا يعطي مفتاح إجابة لأسئلة ص 42؛ الإجابات المقترحة هنا مأخوذة من نص الوحدة، وهي نفسها التي في الأسلوب الرسمي، ويعتمدها المدرب.</p>`}
   ]},

  {recap:[
   String.raw`المحرك العام محرك توالٍ يعمل على المصدرين المستمر والمتردد، وقدرته عالية مقارنة بحجمه (ص 39).`,
   String.raw`على التيار المتردد سرعته أقل (المعاوقة تمتص جزءاً من الجهد) وعزمه قد يقل (التشبع عند القيم العظمى)، الشكل (3-4).`,
   String.raw`عند البدء \((E=0)\) معامل القدرة رديء فعزم البدء قليل؛ لذلك يناسب التحريك خارج المدن لا داخلها (ص 40).`,
   String.raw`المحرك الحثي: من \(s=1\) إلى \(s_m\) تشغيل غير متزن، ومن \(s_m\) إلى \(s=0\) تشغيل متزن، الشكل (3-5).`]}
],
 theory:[
  {h:'محركات التيار المتردد كمحركات للتحريك — المحرك العام',ref:'ص 39',html:`<p>محرك التوالي العام أو <b>المحرك العام</b> هو محرك يعمل على كل من مصدري التيار المستمر والتيار المتردد، وله نفس تركيب آلات التيار المستمر ذات تغذية التوالي مع إدخال بعض التعديلات لتحسين أداء المحرك عند تشغيله بالتيار المتردد، وهذا النوع من المحركات يمكنه أن يعمل بسرعات عالية، وينتج عزماً كبيراً، فهو <b>ذو قدرة عالية مقارنة بحجمه</b>. لذلك يستخدم في التطبيقات التي تتطلب خفة في وزن المحرك المستخدم مع قدرات عالية.</p>`},
  {h:'خواص محرك التوالي العام',ref:'ص 39–40',html:`<p>الشكل (3-4) يوضح خواص المحرك العام، يتضح من الشكل، أن خواص المحرك تختلف بعض الشيء عند تشغيله بالتيار المتردد، عن خواصه عند تشغيله بالتيار المستمر، وذلك لسببين:</p>
   <ul><li>معاوقة ملفات المنتج وملفات المجال تمتص جزءاً من جهد المصدر، وبالتالي تكون <b>السرعة أقل</b> عند استخدام الجهد المتردد عنها في حالة استخدام نفس الجهد المستمر.</li>
   <li>قد تصل الدائرة المغناطيسية إلى حالة التشبع المغناطيسي عند القيم العظمى للتيار المتردد، مما يقلل من قيمة المجال المغناطيسي وبالتالي <b>العزم المتولد</b>.</li></ul>`},
  {fig:'(3-4)',ref:'ص 40',caption:'خواص محرك التوالي العام',draw:()=>box(fig34(),460)+'<p class="sub">النقاط مقروءة تقريبياً من رسم الكتاب. لنفس العزم تكون السرعة على التيار المتردد (A.C) أقل منها على التيار المستمر (D.C).</p>'},
  {html:`<p>عند بدء الحركة \\((E=0)\\) يكون معامل القدرة رديئاً (منخفضاً) إذاً لنفس التيار يكون <b>عزم بدء الحركة أقل بكثير</b> من العزم المتولد في محرك التيار المستمر. نتيجة لقلة عزم بدء الحركة فإن هذه المحركات <b>ليست مناسبة لوسائل التحريك داخل المدن</b> حيث يتكرر الوقوف وبدء الحركة، لكنها تكون مناسبة للاستعمال في وسائل التحريك <b>خارج المدن</b> حيث تكون المسافات طويلة بين الوقفات، ولا يكون التسارع العالي ضرورياً في هذه الحالة. <span class="ref">ص 40</span></p>`},
  {h:'المحرك الحثي ثلاثي الأوجه',ref:'ص 41',html:`<p>بالرجوع إلى مقرر آلات التيار المتردد، عند رسم العلاقة بين العزم والانزلاق أو بين العزم والسرعة نحصل على المنحنى الموضح في الشكل (3-5):</p>
   <p>ينقسم منحنى العلاقة بين العزم والانزلاق (السرعة) إلى جزأين مختلفين، فمن \\(s=1\\) إلى \\(s=s_m\\) يزداد عزم الدوران بزيادة السرعة بينما يقل عزم الدوران الذي يبذله المحرك من \\(s=s_m\\) إلى \\(s=0\\) بزيادة السرعة ولذلك فإن المحرك تكون خواص تشغيله <b>غير متزنة في الجزء الأول</b>، بينما تكون <b>متزنة في الجزء الثاني</b>.</p>`},
  {fig:'(3-5)',ref:'ص 41',caption:'العلاقة بين (العزم والسرعة) و(العزم والانزلاق)',draw:()=>`<div style="max-width:480px;margin-inline:auto">${box(fig35({bands:true,pu:true}))}${box(slipAxis(0.25))}</div><p class="sub">رسم بقيم توضيحية. المنطقة البرتقالية <span class="ltr">Unstable Operation</span> (من s = 1 إلى s<sub>m</sub>)، والخضراء <span class="ltr">Stable Operation</span> (من s<sub>m</sub> إلى 0).</p>`},
  {note:String.raw`<b>توضيح للمتدرب — ليس من الكتاب:</b> لماذا «متزن» و«غير متزن»؟ إذا انخفضت السرعة قليلاً في الجزء الثاني (المتزن) <b>زاد</b> عزم المحرك فيعيد السرعة إلى مكانها. أما في الجزء الأول فانخفاض السرعة <b>ينقص</b> العزم فتنخفض السرعة أكثر حتى يقف المحرك، وارتفاعها يزيد العزم فيتسارع حتى يصل إلى الجزء المتزن. والانزلاق \(s=(n_s-n)/n_s\): عند السكون \(s=1\) وعند السرعة التزامنية \(s=0\).`},
  {err:'<div class="fixnote">تعليقا الشكلين في ص 40 و41 مطبوعان «الشكل 4-3» و«الشكل(5-3)» بترتيب أرقام معكوس، والنص يسميهما (3-4) و(3-5)؛ كتبناهما (3-4) و(3-5). والكتاب لا يذكر هنا معادلة لعزم المحرك الحثي (شكل المنحنى في الرسم والمختبر من معادلة كلوس، إضافة من خارج الكتاب) ولا خواص المحرك التزامني كمحرك تحريك.</div>'},
  {h:'أسئلة متنوعة — الوحدة الثالثة',ref:'ص 42',html:`
   ${Q('3-1','ما الذي يجعل محرك التيار المستمر توالي الأكثر مناسبة للاستخدام في التحريك الكهربائي؟','أنه يولد عزماً كبيراً عند السرعات المنخفضة (عند البدء والتحميل) وعزماً صغيراً عند السرعات العالية، وأنه ذو سرعة متغيرة تلقائياً: يغير سرعته ذاتياً حسب التحميل، فإذا زاد الحمل (كصعود مرتفع) انخفضت سرعته وزاد عزمه، وإذا نقص الحمل زادت سرعته (ص 35–36). مع الانتباه إلى أنه لا يُشغَّل بلا حمل.')}
   ${Q('3-2','ما الذي يجعل محرك التوالي العام مناسباً للاستخدام في وسائل التحريك خارج المدن؟','عزم بدء حركته على التيار المتردد أقل بكثير من محرك التيار المستمر لأن معامل القدرة عند البدء رديء، فلا يناسب داخل المدن حيث يتكرر الوقوف والبدء. أما خارج المدن فالمسافات بين الوقفات طويلة والتسارع العالي غير ضروري، وهو ذو قدرة عالية مقارنة بحجمه ووزنه (ص 39–40).')}
   ${Q('3-3','لماذا يجب تجنب استخدام محرك التيار المستمر المركب فرقياً كمحرك جر؟','لأن مجال ملف التوالي فيه يعاكس مجال ملف التوازي، فتتناقص محصلة المجال مع زيادة الحمل، فتزداد السرعة بزيادة الحمل؛ وعند زيادة العزم زيادة كبيرة تزداد السرعة عن الحدود المسموح بها، وهذا خطر على المحرك (ص 38–39).')}
   ${Q('3-4','ارسم العلاقة بين العزم والسرعة للمحركات الحثية ثلاثية الأوجه؟',`المنحنى كما في الشكل (3-5): يبدأ عند السكون <span class="ltr">(n = 0، s = 1)</span> بعزم البدء T<sub>starting</sub>، ويرتفع مع زيادة السرعة حتى أقصى عزم T<sub>max</sub> عند الانزلاق s<sub>m</sub> (الجزء غير المتزن)، ثم ينحدر بشدة حتى الصفر عند السرعة التزامنية <span class="ltr">(n = n<sub>s</sub>، s = 0)</span> (الجزء المتزن).<div style="max-width:420px;margin-inline:auto">${box(fig35({bands:true,w:420,h:260}))}</div>`)}
   ${Q('3-5','ما الفرق بين محرك التيار المستمر التوالي ومحرك التيار المستمر المركب التراكمي؟','في محرك التوالي ملف مجال واحد على التوالي مع المنتج، فالمجال كله يأتي من تيار المنتج: يتلاشى عند اللاحمل فتجمح السرعة، ولذلك لا يُشغَّل بلا حمل. أما المركب التراكمي ففيه ملف توالٍ وملف توازٍ يساعد أحدهما الآخر (φt = φsh + φse): سرعته تقل مع زيادة الحمل كالتوالي، وعزمه أكبر من عزم أي من الملفين وحده، وسرعة اللاحمل محدودة لأن مجال ملف التوازي يبقى موجوداً؛ وخواصه الميكانيكية تقع بين خواص التوازي والتوالي (ص 35–38).')}`}
 ],
 lab:(el)=>{
  const s={uT:2.0,run:false,n:0,TL:1.0,t:0,unst:null,kick:null};const did={};
  el.innerHTML=`<div class="grid e34-lab">
   <div class="panel c12"><h2>المحرك العام: التيار المستمر مقابل المتردد <small>مبنية على الشكل ${lt('(3-4)')} ص 40 — نقاط الكتاب (مقروءة تقريبياً من الرسم)</small></h2>
    <div class="grid" style="margin-top:0"><div class="c7"><div id="u3g" class="svgbox" style="max-width:520px;margin-inline:auto"></div></div>
    <div class="c5">${sl('u3T','عزم الحمل (بالنسبة للمقنن)',1.0,4.0,0.05,s.uT)}
     <div class="e34-meters">${meter('السرعة على D.C','u3nd')}${meter('السرعة على A.C','u3na')}${meter('A.C أبطأ بـ','u3dn')}</div>
     <p class="sub" id="u3tx"></p>
     <div class="callout">عند بدء الحركة <span class="ltr">(E = 0)</span> يكون معامل القدرة على المتردد رديئاً، فعزم البدء أقل بكثير منه على المستمر: لذلك يناسب التحريك <b>خارج المدن</b> (وقفات قليلة)، ولا يناسب داخلها (ص 40).</div></div></div></div>
   <div class="c12" id="i3tp"></div>
   <div class="panel c7"><h2>المحرك الحثي: الجزء المتزن والجزء غير المتزن <small>مبنية على الشكل ${lt('(3-5)')} ص 41</small></h2>
    <div class="svgbox" id="i3g" style="max-width:560px;margin-inline:auto"></div><div id="i3sa" class="svgbox" style="max-width:560px;margin-inline:auto;margin-top:0"></div>
    <p class="sub">الخط الأحمر المتقطع = عزم الحمل، والدائرة = حالة المحرك الآن. البرتقالي: غير متزن، والأخضر: متزن. شكل المنحنى من معادلة كلوس <span class="ltr">T = 2T<sub>max</sub> / (s/s<sub>m</sub> + s<sub>m</sub>/s)</span> (إضافة من خارج الكتاب)، بأرقام توضيحية.</p></div>
   <div class="panel c5"><h2>التحكم والقراءات <small><span id="i3chip" class="e34-chip"></span></small></h2>
    <div class="e34-row"><button class="btn primary" id="i3on">تشغيل</button><button class="btn" id="i3off">إيقاف</button></div>
    ${sl('i3L','عزم الحمل (بالنسبة للمقنن)',0,3,0.05,s.TL)}
    <div class="e34-row"><button class="btn" id="i3k">هزّة: نقص مؤقت في السرعة</button><button class="btn" id="i3u">ضع المحرك عند التقاطع على الجزء غير المتزن</button></div>
    <div class="e34-meters">${meter('السرعة n','i3n')}${meter('الانزلاق s','i3s')}${meter('عزم المحرك','i3T')}${meter('عزم الحمل','i3TL')}${meter('عزم البدء','i3Tst')}${meter('أقصى عزم','i3Tmx')}</div>
    <div id="i3msg" class="e34-msg"></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="i3st"></ol></div></div>`;
  const $=q=>el.querySelector(q);
  /* universal motor */
  const uni=()=>{const T=s.uT,nd=uniSpeed(UNI_DC,T),na=uniSpeed(UNI_AC,T);$('#u3g').innerHTML=fig34({T});$('#u3T-v').textContent=fm(T,2)+' pu';
   $('#u3nd').textContent=isFinite(nd)?fm(nd,2)+' pu':'خارج الرسم';$('#u3na').textContent=fm(na,2)+' pu';$('#u3dn').textContent=isFinite(nd)?fm((nd-na)/nd*100,0)+' %':'—';
   $('#u3tx').innerHTML=isFinite(nd)?`لعزم ${lt(fm(T,2)+' pu')}: يدور على المستمر بسرعة ${lt(fm(nd,2)+' pu')} وعلى المتردد بسرعة ${lt(fm(na,2)+' pu')} فقط — لأن معاوقة الملفات تمتص جزءاً من الجهد، والتشبع عند القيم العظمى للتيار يضعف المجال (ص 39–40).`:`منحنى D.C في الرسم ينتهي عند عزم ${lt('1.25 pu')} (السرعة ${lt('1.0')})؛ تحت هذا العزم تكون سرعة D.C أكبر من ${lt('1.0')} خارج الرسم.`;if(T>=3.3)did.uHi=1;if(T<=1.5)did.uLo=1};
  $('#u3T').oninput=e=>{s.uT=+e.target.value;uni()};uni();
  /* induction */
  const TP=B.params($('#i3tp'),'u3-l3',IND_TP,()=>{steps.redraw()});
  const Tmot=n=>{const v=TP.v;return kloss(clamp(1-n/v.ns,1e-6,1),v.Tm,v.sm)};
  const Tst=()=>kloss(1,TP.v.Tm,TP.v.sm);
  /* سرعتا التقاطع مع حمل ثابت: على الجزء غير المتزن (u) وعلى الجزء المتزن (s) */
  const cross=TL=>{const v=TP.v,f=s_=>kloss(s_,v.Tm,v.sm)-TL;const bis=(a,b)=>{let fa=f(a);for(let k=0;k<60;k++){const m=(a+b)/2,fm_=f(m);if((fm_>0)===(fa>0)){a=m;fa=fm_}else b=m}return (a+b)/2};
   const r={};if(TL<v.Tm){if(TL>Tst())r.u=(1-bis(1,v.sm))*v.ns;r.s=(1-bis(v.sm,1e-6))*v.ns}return r};
  const setMsg=(h,k)=>{$('#i3msg').innerHTML=h?`<div class="callout${k==='err'?' err':''}">${h}</div>`:''};
  $('#i3on').onclick=()=>{s.run=true;setMsg('','')};
  $('#i3off').onclick=()=>{s.run=false;s.unst=null};
  $('#i3L').oninput=e=>{s.TL=+e.target.value};
  $('#i3k').onclick=()=>{if(!s.run||s.n<1){setMsg('شغّل المحرك أولاً.','err');return}s.n*=0.93;s.kick={t:s.t};setMsg('','')};
  $('#i3u').onclick=()=>{const c=cross(s.TL);if(c.u==null){setMsg(`لا يوجد تقاطع على الجزء غير المتزن عند هذا الحمل. اجعل الحمل بين عزم البدء ${lt(fm(Tst(),2)+' pu')} وأقصى عزم ${lt(fm(TP.v.Tm,2)+' pu')}.`,'err');return}
   s.run=true;const d=(Math.random()<0.5?-1:1)*0.004*TP.v.ns;s.n=c.u+d;s.unst={n0:c.u};setMsg(`وضعنا المحرك عند ${lt(fm(c.u,0)+' rpm')} حيث يتساوى العزمان على الجزء غير المتزن، مع فرق صغير جداً ${d>0?'أعلى':'أقل'} من نقطة التقاطع. راقب ماذا يحدث.`,'')};
  const stableNear=()=>{const c=cross(s.TL);return c.s!=null&&Math.abs(s.n-c.s)<0.002*TP.v.ns+0.5};
  const steps=stepsUI($('#i3st'),[
   {t:'المحرك العام: عزم كبير',x:'في الرسم الأول ارفع عزم الحمل إلى <span class="ltr">3.3 pu</span> أو أكثر: الفرق بين سرعة D.C وسرعة A.C كبير — على المتردد السرعة أقل بكثير.',done:()=>did.uHi},
   {t:'المحرك العام: عزم صغير',x:'اخفض العزم إلى <span class="ltr">1.5 pu</span> أو أقل: يقترب المنحنيان من بعضهما لكن A.C يبقى أبطأ.',done:()=>did.uLo},
   {t:'الحثي: تشغيل بحمل مقنن',get x(){const c=cross(1);return `في الرسم الثاني اجعل الحمل <span class="ltr">1 pu</span> واضغط «تشغيل»: يتسارع المحرك على الجزء غير المتزن ثم يستقر على الجزء المتزن عند نحو ${lt(fm(c.s||0,0)+' rpm')}.`},done:()=>s.run&&Math.abs(s.TL-1)<0.03&&stableNear()},
   {t:'هزّة على الجزء المتزن',x:'اضغط «هزّة»: تنقص السرعة قليلاً فيزيد عزم المحرك فيعيدها إلى نقطة التشغيل نفسها. هذا معنى «متزن».',done:()=>did.kickBack},
   {t:'نقطة على الجزء غير المتزن',get x(){return `اجعل الحمل بين ${lt(fm(Tst(),2))} و ${lt(fm(TP.v.Tm,2)+' pu')} ثم اضغط «ضع المحرك عند التقاطع على الجزء غير المتزن»: لا يبقى هناك؛ إما يقف وإما يتسارع إلى الجزء المتزن. كرّرها لترى الحالتين.`},done:()=>did.unstLeft},
   {t:'حمل أكبر من أقصى عزم',get x(){return `والمحرك يعمل على الجزء المتزن، ارفع الحمل فوق ${lt(fm(TP.v.Tm,2)+' pu')}: لا توجد نقطة تقاطع، فتنهار السرعة على الجزء غير المتزن ويقف المحرك.`},done:()=>did.stall}
  ]);
  let lastG=-1,wasHigh=false;
  loopOn(el,dt=>{const v=TP.v;s.t+=dt;
   const sub=8;for(let k=0;k<sub;k++){const h=dt/sub;let acc;if(s.run){const Tm_=Tmot(s.n),net=Tm_-(s.n>0.5?s.TL:Math.min(s.TL,Tm_));acc=net*v.ns/v.tau}else acc=s.n>0?-(0.3+s.TL)*v.ns/v.tau:0;s.n=clamp(s.n+acc*h,0,v.ns*0.99995)}
   const sl_=1-s.n/v.ns,Tm_=s.run?Tmot(s.n):0,c=cross(s.TL);
   if(s.kick&&s.t-s.kick.t>Math.max(1.5,1.6*v.tau)){if(c.s!=null&&Math.abs(s.n-c.s)<0.004*v.ns)did.kickBack=1;s.kick=null}
   if(s.unst&&Math.abs(s.n-s.unst.n0)>0.05*v.ns){did.unstLeft=1;setMsg(s.n<s.unst.n0?'<b>غير متزن:</b> نقصت السرعة قليلاً فنقص عزم المحرك عن عزم الحمل، فنقصت أكثر… حتى يقف المحرك.':'<b>غير متزن:</b> زادت السرعة قليلاً فزاد عزم المحرك، فتسارع حتى وصل إلى الجزء المتزن واستقر هناك.','');s.unst=null}
   if(s.run&&s.n>0.3*v.ns)wasHigh=true;if(!s.run)wasHigh=false;
   if(s.run&&wasHigh&&s.TL>v.Tm&&s.n<0.02*v.ns)did.stall=1;
   if(s.t-lastG>0.05){lastG=s.t;$('#i3g').innerHTML=fig35({Tm:v.Tm,sm:v.sm,ns:v.ns,bands:true,TL:s.TL,dots:[{x:s.n/v.ns,y:Tm_,col:'--fg',ring:1}],w:540,h:300});$('#i3sa').innerHTML=slipAxis(v.sm,540)}
   $('#i3n').textContent=fm(s.n,0)+' rpm';$('#i3s').textContent=fm(sl_,3);$('#i3T').textContent=fm(Tm_,2)+' pu';$('#i3TL').textContent=fm(s.TL,2)+' pu';$('#i3Tst').textContent=fm(Tst(),2)+' pu';$('#i3Tmx').textContent=fm(v.Tm,2)+' pu';$('#i3L-v').textContent=fm(s.TL,2)+' pu';
   const ch=$('#i3chip');
   if(!s.run){ch.className='e34-chip';ch.textContent='متوقف'}
   else if(s.n<0.002*v.ns&&s.TL>=Tst()){ch.className='e34-chip warn';ch.textContent=s.TL>v.Tm?'وقف: الحمل أكبر من أقصى عزم':'لا يبدأ: الحمل أكبر من عزم البدء'}
   else if(sl_>v.sm){ch.className='e34-chip hot';ch.textContent='على الجزء غير المتزن'}
   else if(c.s!=null&&Math.abs(s.n-c.s)<0.002*v.ns+0.5){ch.className='e34-chip ok';ch.textContent='مستقر على الجزء المتزن'}
   else{ch.className='e34-chip ld';ch.textContent='على الجزء المتزن — يتجه إلى نقطة التشغيل'}
   steps.check()});
 },
 quiz:[
  {q:'المحرك العام هو:',o:['محرك حثي قفصي','محرك توالٍ يعمل على مصدري التيار المستمر والمتردد','محرك تزامني','محرك توازٍ للتيار المستمر فقط'],c:1,e:'ص 39.'},
  {q:'لماذا يستخدم المحرك العام في التطبيقات التي تتطلب خفة الوزن؟',o:['لأن سرعته ثابتة','لأنه ذو قدرة عالية مقارنة بحجمه','لأنه بلا فرش','لأن عزم بدئه صفر'],c:1,e:'ص 39.'},
  {q:'لنفس الجهد، سرعة المحرك العام على التيار المتردد مقارنة بالمستمر:',o:['أكبر','أقل، لأن معاوقة الملفات تمتص جزءاً من الجهد','مساوية','صفر'],c:1,e:'ص 39–40.'},
  {q:'عند بدء حركة المحرك العام على التيار المتردد يكون:',o:['معامل القدرة عالياً وعزم البدء كبيراً','معامل القدرة رديئاً وعزم البدء أقل بكثير من محرك التيار المستمر','التيار صفراً','العزم سالباً'],c:1,e:'ص 40.'},
  {q:'المحرك العام مناسب أكثر للتحريك:',o:['داخل المدن حيث يكثر الوقوف','خارج المدن حيث المسافات طويلة بين الوقفات','في المصاعد','في الرافعات'],c:1,e:'ص 40.'},
  {q:'في منحنى العزم مع الانزلاق للمحرك الحثي، الجزء غير المتزن هو:',o:['من s = sm إلى s = 0','من s = 1 إلى s = sm','عند s = 0 فقط','كل المنحنى'],c:1,e:'ص 41: فيه يزداد العزم بزيادة السرعة.'},
  {q:'عند السرعة التزامنية (s = 0) يكون عزم المحرك الحثي:',o:['أقصى عزم','عزم البدء','صفراً','سالباً'],c:2,e:'الشكل (3-5) ص 41: المنحنى ينحدر إلى الصفر عند s = 0.'},
  {q:'محرك حثي يعمل على الجزء المتزن، فزاد الحمل قليلاً (أقل من أقصى عزم). ماذا يحدث؟',o:['يقف فوراً','تنخفض سرعته قليلاً ويزيد عزمه حتى يساوي الحمل الجديد','تزيد سرعته','لا يتغير شيء'],c:1,e:'في الجزء المتزن انخفاض السرعة يزيد العزم.'}
 ]
});

})(PLCBOOK);
