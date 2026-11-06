/* Unit 4 — المحركات التزامنية ثلاثية الأوجه (ص 124–143) */
(function(B){
const {S}=B;
const D=Math.PI/180,R3=Math.sqrt(3);
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const fm=(x,d)=>B.fmtN(x,d);
const fx=v=>(+v).toFixed(1);
const rd=(x,d)=>B.round(x,d||0);

/* ---------- styles used only by this unit (CSS variables only) ---------- */
(function css(){if(typeof document==='undefined'||document.getElementById('u4sm-css'))return;const s=document.createElement('style');s.id='u4sm-css';s.textContent=`
.sm-sl{display:flex;flex-direction:column;gap:2px;font-size:13.5px;margin-top:10px}
.sm-sl .h{display:flex;justify-content:space-between;gap:8px;align-items:baseline}
.sm-sl b{font-family:var(--mono);direction:ltr;unicode-bidi:isolate;color:var(--blue-ink);font-size:14px}
.sm-sl input[type=range]{width:100%;accent-color:var(--blue);direction:ltr;margin:4px 0}
.sm-row{display:flex;gap:10px;flex-wrap:wrap;margin-top:10px;align-items:center}
.sm-chip{display:inline-block;padding:3px 10px;border-radius:999px;font-size:13px;font-weight:700;background:var(--surface-2);color:var(--fg)}
.sm-chip.ok{background:var(--on-soft);color:var(--on)}.sm-chip.warn{background:var(--live-soft);color:var(--live)}.sm-chip.bad{background:var(--stop-soft);color:var(--stop)}.sm-chip.blue{background:var(--blue-soft);color:var(--blue-ink)}
.sm-seq{list-style:none;margin:8px 0 0;padding:0;display:flex;flex-direction:column;gap:5px;font-size:13.5px;counter-reset:q}
.sm-seq li{padding:6px 10px;border-radius:8px;border:1px solid var(--line);color:var(--muted);counter-increment:q}
.sm-seq li::before{content:counter(q) ". ";font-weight:700}
.sm-seq li.cur{border-color:var(--blue);background:var(--blue-soft);color:var(--fg);font-weight:600}
.sm-seq li.done{color:var(--on);border-color:var(--on-soft)}
.sm-seq li.done::before{content:"✓ "}
.sm-q{border:1px solid var(--line);border-radius:10px;padding:8px 12px;margin-top:8px;background:var(--surface)}
.sm-q summary{cursor:pointer;font-weight:600;line-height:1.7}
.sm-msg{margin-top:10px;min-height:20px}
.sm-two{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px}
@media (max-width:560px){.sm-two{grid-template-columns:1fr}}
`;document.head.appendChild(s)})();

/* ---------- small lab helpers ---------- */
function loopOn(el,fn){let last=performance.now();const f=now=>{if(!document.body.contains(el))return;const dt=Math.min(0.05,Math.max(0,(now-last)/1000));last=now;try{fn(dt)}catch(e){console.error(e);return}requestAnimationFrame(f)};requestAnimationFrame(f)}
function stepsUI(host,steps){let i=0;
  const draw=()=>{host.innerHTML=steps.map((s,j)=>`<li class="${j<i?'done':j===i?'cur':''}"><span class="k">${j<i?'✓':j+1}</span><div><h4>${s.t}</h4><p>${s.x}</p>${j===i?`<div class="act">${s.done?'<span class="hint">بانتظار تنفيذك…</span> <button class="btn" data-next>تخطَّ</button>':'<button class="btn primary" data-next>التالي</button>'}</div>`:''}</div></li>`).join('')+
    (i>=steps.length?`<li class="cur"><span class="k">✓</span><div><h4>أحسنت، أنهيت التجربة</h4><p style="display:block">جرّب قيماً أخرى، أو أعد التجربة من أولها.</p><div class="act"><button class="btn" data-restart>إعادة التجربة</button></div></div></li>`:'');B.math(host)};
  host.addEventListener('click',e=>{if(e.target.closest('[data-next]')){i++;draw()}if(e.target.closest('[data-restart]')){i=0;draw()}});draw();
  return {check(){const s=steps[i];if(s&&s.done&&s.done()){i++;draw()}}};}
const sl=(id,label,min,max,step,val)=>`<label class="sm-sl"><span class="h"><span>${label}</span><b id="${id}-v"></b></span><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}" aria-label="${label.replace(/<[^>]+>/g,'')}"></label>`;
const segHTML=(attr,items,cur)=>`<div class="seg" role="group">${items.map(([v,l])=>`<button data-${attr}="${v}" aria-pressed="${String(v)===String(cur)}">${l}</button>`).join('')}</div>`;
const segSet=(el,attr,v)=>el.querySelectorAll(`[data-${attr}]`).forEach(b=>b.setAttribute('aria-pressed',String(b.dataset[attr])===String(v)));
const swHTML=(id,b,label,on)=>`<button class="sw" id="${id}" aria-pressed="${on?'true':'false'}"><span class="knob"></span><b>${b}</b><small>${label}</small></button>`;
const swSet=(el,on)=>el.setAttribute('aria-pressed',on?'true':'false');
const fact=(l,id)=>`<div class="fact"><span>${l}</span><b id="${id}">—</b></div>`;
const tryList=items=>`<div class="callout"><b>جرّب:</b><ol style="margin:6px 0 0;padding-inline-start:20px">${items.map(x=>`<li>${x}</li>`).join('')}</ol></div>`;
const box=(svg,max)=>`<div class="svgbox" style="margin-inline:auto;${max?`max-width:${max}px`:''}">${svg}</div>`;
const chip=(t,c)=>`<span class="sm-chip ${c||''}">${t}</span>`;
const arT=(x,y,s,o)=>{o=o||{};return `<text class="txt ar" x="${x}" y="${y}" text-anchor="${o.a||'middle'}"${o.fs?` font-size="${o.fs}"`:''}${o.col?` style="fill:var(${o.col})"`:''}>${s}</text>`};
const sb=(b,x)=>`${b}<tspan font-size="9" dy="4">${x}</tspan><tspan dy="-4">&#8203;</tspan>`;
function arrow(x1,y1,x2,y2,col,w,dash){w=w||2.4;const a=Math.atan2(y2-y1,x2-x1),L=Math.hypot(x2-x1,y2-y1);if(L<3)return '';const h=Math.min(11,L*0.6)+w;
  const bx=x2-h*Math.cos(a),by=y2-h*Math.sin(a),px=-Math.sin(a)*h*0.42,py=Math.cos(a)*h*0.42;
  return `<path d="M${fx(x1)} ${fx(y1)}L${fx(bx)} ${fx(by)}" stroke="var(${col})" stroke-width="${w}" fill="none" stroke-linecap="round"${dash?` stroke-dasharray="${dash}"`:''}/><path d="M${fx(x2)} ${fx(y2)}L${fx(bx+px)} ${fx(by+py)}L${fx(bx-px)} ${fx(by-py)}Z" fill="var(${col})"/>`}
function coilP(x1,y1,x2,y2,n,cls){const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy),ux=dx/len,uy=dy/len;const lead=len*0.12,seg=(len-2*lead)/n,r=seg/2;
  let p=`M${fx(x1)} ${fx(y1)}L${fx(x1+ux*lead)} ${fx(y1+uy*lead)}`;for(let i=1;i<=n;i++){p+=`A${fx(r)} ${fx(r)} 0 0 1 ${fx(x1+ux*(lead+seg*i))} ${fx(y1+uy*(lead+seg*i))}`}
  return `<path class="w ${cls||''}" d="${p}L${fx(x2)} ${fx(y2)}"/>`}
function zig(x1,y1,x2,y2,n){n=n||6;const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy),ux=dx/len,uy=dy/len,nx=-uy,ny=ux,lead=len*0.18,seg=(len-2*lead)/n;let p=`M${x1} ${y1}L${fx(x1+ux*lead)} ${fx(y1+uy*lead)}`;
  for(let i=0;i<n;i++){const s=(i%2?-1:1)*6,m=lead+seg*(i+0.5);p+=`L${fx(x1+ux*m+nx*s)} ${fx(y1+uy*m+ny*s)}`}
  return p+`L${fx(x2-ux*lead)} ${fx(y2-uy*lead)}L${x2} ${y2}`}

/* simple SVG x-y plot. o:{w,h,x0,x1,y0,y1,xt,yt,xl,yl,series:[{pts,col,w,dash}],under(X,Y),extra(X,Y)} */
function plotSVG(o){const W=o.w||520,H=o.h||290,L=o.left||50,R=14,T=16,Bm=40;
  const X=x=>L+(x-o.x0)/(o.x1-o.x0)*(W-L-R),Y=y=>H-Bm-(y-o.y0)/(o.y1-o.y0)*(H-T-Bm);
  let s='';(o.yt||[]).forEach(v=>{s+=`<path d="M${L} ${fx(Y(v))}H${W-R}" stroke="var(--line)"/>`+S.t(L-6,fx(Y(v)+4),o.yf?o.yf(v):v,'m','end')});
  (o.xt||[]).forEach(v=>{s+=`<path d="M${fx(X(v))} ${T}V${H-Bm}" stroke="var(--line)" stroke-dasharray="3 3"/>`+S.t(fx(X(v)),H-Bm+15,o.xf?o.xf(v):v,'m')});
  s+=`<path d="M${L} ${T}V${H-Bm}H${W-R}" stroke="var(--fg)" fill="none" stroke-width="1.4"/>`;
  if(o.xl)s+=S.t((L+W-R)/2,H-6,o.xl,'');if(o.yl)s+=`<text class="txt" x="14" y="${(T+H-Bm)/2}" text-anchor="middle" transform="rotate(-90 14 ${(T+H-Bm)/2})">${o.yl}</text>`;
  s+=`<defs><clipPath id="${o.clip||'pc'}"><rect x="${L}" y="${T}" width="${W-L-R}" height="${H-T-Bm}"/></clipPath></defs><g clip-path="url(#${o.clip||'pc'})">`;
  if(o.under)s+=o.under(X,Y);
  (o.series||[]).forEach(se=>{if(!se.pts.length)return;s+=`<path d="${se.pts.map((p,i)=>(i?'L':'M')+fx(X(p[0]))+' '+fx(Y(p[1]))).join('')}" fill="none" stroke="var(${se.col})" stroke-width="${se.w||2.4}" ${se.dash?`stroke-dasharray="${se.dash}"`:''} stroke-linejoin="round"/>`});
  s+='</g>';
  if(o.extra)s+=o.extra(X,Y);
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${o.aria||'منحنى'}">${s}</svg>`}

/* ---------- complex helpers ---------- */
const C=(re,im)=>({re,im:im||0}),csub=(a,b)=>C(a.re-b.re,a.im-b.im),cmul=(a,b)=>C(a.re*b.re-a.im*b.im,a.re*b.im+a.im*b.re),
  cdiv=(a,b)=>{const d=b.re*b.re+b.im*b.im;return C((a.re*b.re+a.im*b.im)/d,(a.im*b.re-a.re*b.im)/d)},cabs=a=>Math.hypot(a.re,a.im),cang=a=>Math.atan2(a.im,a.re)/D,pol=(m,d)=>C(m*Math.cos(d*D),m*Math.sin(d*D));

/* ---------- the motor model of the book: E = V − jXs·I (4-1), sin δ = Xs·P/(3·V·E) (3-15) ---------- */
function motor(V,E,Xs,P){const s=Xs*P/(3*V*E);if(!(s<=1)||E<=0)return {ok:false,s};
  const d=-Math.asin(s)/D,Ec=pol(E,d),I=cdiv(csub(C(V,0),Ec),C(0,Xs)),th=cang(I);
  return {ok:true,s,d,Ec,I,Im:cabs(I),th,pf:Math.cos(th*D),lead:th>2?1:th<-2?-1:0,Q:3*V*cabs(I)*Math.sin(th*D),P}}
const pfT=m=>m.lead>0?'متقدم':m.lead<0?'متأخر':'≈ 1 (الواحد)';
const pfC=m=>m.lead>0?'blue':m.lead<0?'warn':'ok';

/* ---------- phasor diagram renderer (x to the right, y up, book orientation) ----------
 o:{W,H,view:{x0,x1,y0,y1},vecs:[{a,b,col,lab,w,dash,lp}],lines:[{a,b,col,dash}],circles:[{r,col}],arcs:[{r,a0,a1,lab,col}],brk:[{a,b,lab}]} */
function phSVG(o){const W=o.W||480,H=o.H||330,pad=o.pad||26,v=o.view;
  const sc=Math.min((W-2*pad)/(v.x1-v.x0),(H-2*pad)/(v.y1-v.y0));
  const ox=pad+((W-2*pad)-(v.x1-v.x0)*sc)/2-v.x0*sc,oy=H-pad-((H-2*pad)-(v.y1-v.y0)*sc)/2+v.y0*sc;
  const X=x=>ox+x*sc,Y=y=>oy-y*sc;
  let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${o.aria||'مخطط اتجاهي'}">`;
  s+=`<path d="M${fx(X(v.x0))} ${fx(Y(0))}H${fx(X(v.x1))}" stroke="var(--line)" stroke-dasharray="2 4"/>`;
  (o.circles||[]).forEach(c=>{s+=`<circle cx="${fx(X(0))}" cy="${fx(Y(0))}" r="${fx(c.r*sc)}" fill="none" stroke="var(${c.col||'--muted'})" stroke-dasharray="5 5" stroke-width="1.2"/>`});
  (o.lines||[]).forEach(l=>{s+=`<path d="M${fx(X(l.a[0]))} ${fx(Y(l.a[1]))}L${fx(X(l.b[0]))} ${fx(Y(l.b[1]))}" stroke="var(${l.col||'--muted'})" stroke-width="${l.w||1.3}" stroke-dasharray="${l.dash||'5 4'}" fill="none"/>`});
  (o.arcs||[]).forEach(a=>{const r=a.r*sc,p0=[X(0)+r*Math.cos(a.a0*D),Y(0)-r*Math.sin(a.a0*D)],p1=[X(0)+r*Math.cos(a.a1*D),Y(0)-r*Math.sin(a.a1*D)];
    const big=Math.abs(a.a1-a.a0)>180?1:0,sw=a.a1>a.a0?0:1;if(Math.abs(a.a1-a.a0)<0.5)return;
    s+=`<path d="M${fx(p0[0])} ${fx(p0[1])}A${fx(r)} ${fx(r)} 0 ${big} ${sw} ${fx(p1[0])} ${fx(p1[1])}" fill="none" stroke="var(${a.col||'--muted'})" stroke-width="1.3"/>`;
    const am=(a.a0+a.a1)/2*D,rr=r+12;s+=`<text class="txt m" x="${fx(X(0)+rr*Math.cos(am))}" y="${fx(Y(0)-rr*Math.sin(am)+4)}" text-anchor="${Math.cos(am)<-0.2?'end':'start'}">${a.lab||''}</text>`});
  (o.brk||[]).forEach(k=>{const a=[X(k.a[0]),Y(k.a[1])],b=[X(k.b[0]),Y(k.b[1])],vert=Math.abs(a[0]-b[0])<Math.abs(a[1]-b[1]);
    const tk=p=>vert?`M${fx(p[0]-4)} ${fx(p[1])}h8`:`M${fx(p[0])} ${fx(p[1]-4)}v8`;
    s+=`<path d="M${fx(a[0])} ${fx(a[1])}L${fx(b[0])} ${fx(b[1])}${tk(a)}${tk(b)}" stroke="var(--stop)" stroke-width="1.6" fill="none"/>`;
    const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2;s+=`<text class="txt" x="${fx(mx+(k.dx!=null?k.dx:(vert?7:0)))}" y="${fx(my+(k.dy!=null?k.dy:(vert?4:-7)))}" text-anchor="${k.anc||(vert?'start':'middle')}" style="fill:var(--stop)">${k.lab}</text>`});
  (o.vecs||[]).forEach(e=>{const a=[X(e.a[0]),Y(e.a[1])],b=[X(e.b[0]),Y(e.b[1])];s+=arrow(a[0],a[1],b[0],b[1],e.col||'--fg',e.w||2.6,e.dash);
    if(e.lab){const L=Math.hypot(b[0]-a[0],b[1]-a[1])||1,ux=(b[0]-a[0])/L,uy=(b[1]-a[1])/L;const pos=e.lp||'tip';let lx,ly;
      if(pos==='mid'){lx=(a[0]+b[0])/2-uy*(e.off||12);ly=(a[1]+b[1])/2+ux*(e.off||12)}else{lx=b[0]+ux*10-uy*(e.off||0);ly=b[1]+uy*10+ux*(e.off||0)}
      s+=`<text class="txt${e.cls?' '+e.cls:''}" x="${fx(lx)}" y="${fx(ly+4)}" text-anchor="${lx<a[0]-4&&pos!=='mid'?'end':(pos==='mid'?(-uy>0?'start':'end'):'start')}"${e.col?` style="fill:var(${e.col})"`:''}>${e.lab}</text>`}});
  (o.notes||[]).forEach(t=>{s+=`<text class="txt${t.ar?' ar':''} m" x="${fx(X(t.p[0]))}" y="${fx(Y(t.p[1]))}" text-anchor="${t.anc||'start'}">${t.s}</text>`});
  return s+'</svg>'}
/* the standard picture of one operating point: V, E, jXsI (from E tip to V tip), I (own scale kI) */
function onePoint(V,m,o){o=o||{};const kI=o.kI||1.6,sfx=o.sfx||'';const E=m.Ec,I=pol(m.Im*kI,m.th);
  const v=[{a:[0,0],b:[V,0],col:'--fg',lab:sb('V','ph')+sfx,w:2.8},
   {a:[0,0],b:[E.re,E.im],col:'--live',lab:sb('E','ph')+sfx,w:2.8},
   {a:[E.re,E.im],b:[V,0],col:'--blue',lab:'jX'+sb('S','')+'I'+sb('ph','')+sfx,lp:'mid',off:-14,cls:'b'},
   {a:[0,0],b:[I.re,I.im],col:'--on',lab:sb('I','ph')+sfx,w:2.6}];
  return v}
const phArcs=(m,o)=>{o=o||{};const r1=o.rd||48,r2=o.rt||34;const a=[];if(Math.abs(m.d)>0.6)a.push({r:r1,a0:m.d,a1:0,lab:'δ',col:'--live'});if(Math.abs(m.th)>0.6)a.push({r:r2,a0:0,a1:m.th,lab:'θ',col:'--on'});return a};

/* ---------- الشكل (4-1): equivalent circuit ---------- */
function eqSVG(o){o=o||{};const cl=o.live?'live':'';
  let s=`<svg viewBox="0 0 470 210" role="img" aria-label="الدائرة المكافئة للمحرك التزامني">`;
  s+=`<circle cx="90" cy="110" r="24" fill="var(--surface)" stroke="var(--fg)" stroke-width="2"/><path d="M76 110q7 -12 14 0t14 0" fill="none" stroke="var(--fg)" stroke-width="1.8"/>`;
  s+=arrow(46,140,46,82,'--live',2.2)+`<text class="txt" x="38" y="114" text-anchor="end" style="fill:var(--live)">${sb('E','ph')}</text>`;
  s+=S.w('M90 86V44H170',cl)+coilP(170,44,280,44,5,cl)+S.w('M280 44H410',cl);
  s+=`<text class="txt b" x="225" y="28" text-anchor="middle">jX${sb('S','')}</text>`+arrow(190,70,262,70,'--blue',1.8)+`<text class="txt b" x="226" y="88" text-anchor="middle">jX${sb('S','')}I${sb('ph','')}</text>`;
  s+=arrow(392,30,342,30,'--on',2)+`<text class="txt" x="367" y="22" text-anchor="middle" style="fill:var(--on)">${sb('I','ph')}</text>`;
  s+=S.w('M90 134V176H410',cl);
  s+=`<circle cx="410" cy="44" r="4.5" fill="var(--surface)" stroke="var(--fg)" stroke-width="2"/><circle cx="410" cy="176" r="4.5" fill="var(--surface)" stroke="var(--fg)" stroke-width="2"/>`;
  s+=arrow(436,160,436,60,'--fg',2)+`<text class="txt" x="446" y="114" text-anchor="start">${sb('V','ph')}</text>`;
  s+=arT(225,200,'مقاومة ملفات العضو الثابت مهملة',{fs:12,col:'--muted'});
  return s+'</svg>'}

/* ---------- الشكل (4-2): cross-section of a 2-pole synchronous motor ---------- */
function crossSVG(o){o=o||{};const c=160,pre=o.pre||'',id=k=>pre?` id="${pre}${k}"`:'';
  const pS=o.phiS==null?102:o.phiS,pR=o.phiR==null?90:o.phiR;
  let s=`<svg viewBox="0 0 320 320" role="img" aria-label="المجالان المغناطيسيان في محرك تزامني ذي قطبين">`;
  s+=`<rect x="6" y="6" width="308" height="308" rx="6" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.6"/>`;
  s+=`<circle cx="${c}" cy="${c}" r="138" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/><circle cx="${c}" cy="${c}" r="112" fill="var(--bg)" stroke="var(--fg)" stroke-width="1.6"/>`;
  const cond=(a,dot)=>{const x=c+125*Math.cos(a*D),y=c-125*Math.sin(a*D);return `<circle cx="${fx(x)}" cy="${fx(y)}" r="8" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.4"/>`+(dot?`<circle cx="${fx(x)}" cy="${fx(y)}" r="2.4" fill="var(--fg)"/>`:`<path d="M${fx(x-5)} ${fx(y-5)}l10 10M${fx(x+5)} ${fx(y-5)}l-10 10" stroke="var(--fg)" stroke-width="1.4"/>`)};
  s+=cond(128,1)+cond(52,1)+cond(232,0)+cond(308,0);
  s+=`<g${id('rot')} transform="rotate(${fx(90-pR)} ${c} ${c})">`;
  if(o.solid){s+=`<circle cx="${c}" cy="${c}" r="102" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2"/><path d="M${c} ${c-102}V${c-80}" stroke="var(--fg)" stroke-width="3"/>`;
    if(o.eddy)s+=`<g${id('edd')}>`+[0,1,2].map(i=>`<ellipse cx="${c+(i-1)*52}" cy="${c+(i===1?-40:30)}" rx="18" ry="11" fill="none" stroke="var(--live)" stroke-width="1.6" stroke-dasharray="4 3"/>`).join('')+`</g>`}
  else{s+=`<rect x="${c-20}" y="${c-82}" width="40" height="164" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2"/>`;
    s+=`<rect x="${c-56}" y="${c-106}" width="112" height="28" rx="12" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2"/><rect x="${c-56}" y="${c+78}" width="112" height="28" rx="12" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2"/>`;
    [[-1,-74],[-1,30],[1,-74],[1,30]].forEach(([sd,y])=>{s+=`<rect${pre?` data-fc="${pre}"`:''} x="${sd<0?c-34:c+20}" y="${c+y}" width="14" height="44" rx="3" fill="var(--live-soft)" stroke="var(--live)" stroke-width="1.4"/>`});
    if(o.damper)[-40,-20,0,20,40].forEach(dx=>{s+=`<circle cx="${c+dx}" cy="${c-92}" r="4.2" fill="var(--wire)" stroke="var(--fg)"/><circle cx="${c+dx}" cy="${c+92}" r="4.2" fill="var(--wire)" stroke="var(--fg)"/>`});
    s+=S.t(c-44,c-87,'N','b')+S.t(c-44,c+97,'S','b')}
  if(o.field!==false)s+=`<g${id('brg')}>`+arrow(c,c+28,c,c-66,'--live',4.2)+`</g>`;
  s+=`<circle cx="${c}" cy="${c}" r="6" fill="var(--fg)"/></g>`;
  s+=`<g${id('bsg')} transform="rotate(${fx(90-pS)} ${c} ${c})"${o.stator===false?' style="display:none"':''}>`+arrow(c,c+18,c,c-100,'--blue',4.2)+`</g>`;
  const tip=(ph,r)=>[c+r*Math.cos(ph*D),c-r*Math.sin(ph*D)];
  const ts=tip(pS,104),tr=tip(pR+(o.rOff||0),74);
  s+=`<text${id('bsl')} class="txt b" x="${fx(ts[0])}" y="${fx(ts[1])}" text-anchor="middle" font-size="14"${o.stator===false?' style="display:none"':''}>${sb('B','S')}</text>`;
  if(o.field!==false)s+=`<text${id('brl')} class="txt" x="${fx(tr[0])}" y="${fx(tr[1])}" text-anchor="middle" font-size="14" style="fill:var(--live)">${sb('B','R')}</text>`;
  // n_s arrow (counter-clockwise), as printed
  const a0=28,a1=62,r=150,p0=tip(a0,r),p1=tip(a1,r);s+=`<path d="M${fx(p0[0])} ${fx(p0[1])}A${r} ${r} 0 0 0 ${fx(p1[0])} ${fx(p1[1])}" fill="none" stroke="var(--blue)" stroke-width="2.4"/>`;
  const p2=tip(a1+0.5,r);s+=arrow(p1[0]+6,p1[1]+5,p2[0]-3,p2[1]-1.5,'--blue',2.4)+S.t(fx(tip(45,138)[0]-4),fx(tip(45,138)[1]+16),'n','b')+`<text class="txt b" x="${fx(tip(45,138)[0]+4)}" y="${fx(tip(45,138)[1]+20)}" font-size="9">s</text>`;
  return s+'</svg>'}
/* move live parts of crossSVG (angles in degrees, counter-clockwise, 90 = up) */
function crossMove(el,pre,pS,pR,rOff){const c=160,g=k=>el.querySelector('#'+pre+k);const tip=(ph,r)=>[c+r*Math.cos(ph*D),c-r*Math.sin(ph*D)];
  const a=g('bsg'),b=g('rot'),l1=g('bsl'),l2=g('brl');if(a)a.setAttribute('transform',`rotate(${fx(90-pS)} ${c} ${c})`);if(b)b.setAttribute('transform',`rotate(${fx(90-pR)} ${c} ${c})`);
  if(l1){const t=tip(pS,104);l1.setAttribute('x',fx(t[0]));l1.setAttribute('y',fx(t[1]+5))}if(l2){const t=tip(pR+(rOff||0),74);l2.setAttribute('x',fx(t[0]));l2.setAttribute('y',fx(t[1]+5))}}

/* ---------- the shared synchronous-motor dynamics used by the labs (أرقام توضيحية) ----------
   speed in per-unit of n_s(60 Hz); torques in per-unit of the maximum (pull-out) torque.
   locked: rotor turns exactly with the field, load angle δ settles at −sin⁻¹(T_required).
   not locked: accelerated only by induction (damper bars / eddy currents) or the pony motor; the DC field alone
   gives a torque that changes sign every half slip-cycle → average zero (the rotor only rocks). */
const VIS=150;  // drawn speed: degrees per second at n_s (the picture is slowed down very much)
function makeSim(method){
  const S0={stator:0,field:'R',pony:0,method:method||'none',f:60,ramp:0,rate:'slow',TL:0,TLe:0,w:0,ws:0,locked:0,d:0,dv:0,thS:102,thR:90,lost:0,lostT:-9,t:0,jit:0,vibT:0,lockedT:0};
  const sim=Object.assign({J:2,fric:0.03},S0);
  sim.reset=m=>{Object.assign(sim,S0,{method:m||sim.method});if(sim.method==='vfd')sim.f=1};
  const indT=s=>{if(Math.abs(s)<1e-6)return 0;const Tb=1.25,sb=0.55;return Math.sign(s)*2*Tb/(Math.abs(s)/sb+sb/Math.abs(s))};
  sim.step=dt=>{sim.t+=dt;const wsPrev=sim.ws;
    if(sim.method==='vfd'&&sim.ramp&&sim.stator)sim.f=Math.min(60,sim.f+(sim.rate==='fast'?60/0.7:60/14)*dt);
    const fNow=sim.method==='vfd'?sim.f:60;sim.ws=sim.stator?fNow/60:0;
    const dws=sim.locked?(sim.ws-wsPrev)/Math.max(dt,1e-6):0;
    sim.TLe+=(sim.TL-sim.TLe)*(1-Math.exp(-dt/0.45));
    const dc=sim.field==='dc'&&sim.stator;
    const hold=dc||(sim.method==='eddy'&&sim.stator);
    const Tmax=dc?1:0.45;
    const Tpony=sim.pony?clamp(5*(0.995-sim.w),-0.5,1.1):0;
    const slip=sim.ws>0?(sim.ws-sim.w)/sim.ws:0;
    const indOn=sim.stator&&(sim.method==='damper'||sim.method==='eddy');
    sim.slip=slip;
    if(sim.locked){
      const Treq=sim.TLe+sim.fric+sim.J*dws-(sim.pony?clamp(5*(0.995-sim.ws),-0.5,1.1):0);
      if(!hold){sim.locked=0}
      else if(Treq>Tmax){sim.locked=0;sim.lost=1;sim.lostT=sim.t}
      else{const dss=-Math.asin(clamp(Treq/Tmax,-1,1))/D,wn=2*Math.PI*0.55,z=0.45;sim.dv+=(wn*wn*(dss-sim.d)-2*z*wn*sim.dv)*dt;sim.d=clamp(sim.d+sim.dv*dt,-89.5,60);sim.w=sim.ws}
    }
    if(!sim.locked){
      const Tres=sim.TLe+sim.fric;let Tn=(indOn?indT(slip)*Math.max(sim.ws,0.0001)/Math.max(sim.ws,0.0001):0)+Tpony;
      if(sim.w>0.0005)Tn-=Tres;else{if(Tn>Tres)Tn-=Tres;else{Tn=0;sim.w=0}}
      sim.w=Math.max(0,sim.w+Tn/sim.J*dt);
      const near=Math.abs(sim.ws-sim.w)<(sim.method==='eddy'&&!dc?0.02:0.03);
      if(hold&&sim.ws>0&&near&&(sim.TLe+sim.fric)<Tmax&&sim.t-sim.lostT>0.8){sim.locked=1;sim.lockedT=sim.t;sim.d=clamp(-Math.asin(clamp((sim.TLe+sim.fric)/Tmax,0,1))/D+22,-80,40);sim.dv=0}
    }
    sim.thS=(sim.thS+sim.ws*VIS*dt)%360;
    if(sim.locked){sim.thR=sim.thS+sim.d;sim.jit=0}
    else{sim.thR=(sim.thR+sim.w*VIS*dt)%360;
      if(dc){const rel=(sim.thR-sim.thS)*D;sim.jit=sim.w<0.02?-7*Math.sin(rel):-3*Math.sin(rel);if(sim.w<0.02)sim.vibT+=dt}else sim.jit=0}
    sim.Vf=sim.stator&&sim.field!=='dc'?Math.abs(slip):0;              // induced voltage on the field winding (pu)
    sim.Idamp=indOn&&!sim.locked?Math.min(1,Math.abs(slip)*1.6):0;     // current in the damper bars / eddy currents (pu)
    sim.ns=60*fNow;                                                     // 2-pole: n_s = 120 f / 2
  };
  sim.reset(method);return sim}
const stateChip=sim=>sim.locked?chip('متزامن: يدور مع المجال بالسرعة التزامنية','ok'):!sim.stator?chip('العضو الثابت مفصول','')
  :sim.lost&&sim.t-sim.lostT<6?chip(sim.w>0.02?'فقد التزامن! يتباطأ':'فقد التزامن','bad'):sim.w<0.02?(sim.field==='dc'?chip('واقف ويهتز — لا يبدأ وحده','bad'):chip('واقف','')):chip('يدور دون تزامن','warn');

/* =============================== Lesson 4.1 =============================== */
const EX={V:208,Xs:2.5,E:255};      // آلة مثال (4-1)
const PMAX=3*EX.V*EX.E/EX.Xs;        // القدرة القصوى (δ = −90°) بهذه الآلة
function pdeltaSVG(){return plotSVG({w:540,h:270,x0:-180,x1:180,y0:-1.25,y1:1.25,xt:[-180,-90,0,90,180],yt:[-1,0,1],xf:v=>v+'°',yf:v=>v===1?'Pmax':v===-1?'-Pmax':'0',left:62,xl:'δ',yl:'Po',aria:'العلاقة بين القدرة الخارجة وزاوية القدرة',clip:'pdc',
  under:(X,Y)=>`<rect x="${X(-90)}" y="${Y(1.25)}" width="${X(0)-X(-90)}" height="${Y(-1.25)-Y(1.25)}" fill="var(--blue-soft)"/><rect x="${X(0)}" y="${Y(1.25)}" width="${X(90)-X(0)}" height="${Y(-1.25)-Y(1.25)}" fill="var(--on-soft)"/>`,
  series:[{pts:Array.from({length:73},(_,i)=>{const d=-180+i*5;return [d,Math.sin(d*D)]}),col:'--fg',w:2.4}],
  extra:(X,Y)=>arT(X(-45),Y(0.7),'محرك تزامني',{fs:13,col:'--blue-ink'})+arT(X(45),Y(-0.7),'مولد تزامني',{fs:13,col:'--on'})+arT(X(-135),Y(0.7),'غير مستقر',{fs:11.5,col:'--muted'})+arT(X(135),Y(-0.7),'غير مستقر',{fs:11.5,col:'--muted'})})}

B.lesson({
 id:'u4-l1',unit:4,order:1,pages:'124–127',
 title:'تركيب المحرك التزامني وكيفية عمله',
 summary:'نغذي العضو الثابت بجهد ثلاثي الأوجه وملفات المجال بتيار مستمر، فينشأ مجالان: مجال العضو الثابت يدور بالسرعة التزامنية ومجال العضو الدوار يلحق به. الدائرة المكافئة والمعادلة (4-1)، ولماذا يلزم إيصال الدوار قرب السرعة التزامنية، وما هو فقد التزامن.',
 theory:[
  {h:'الهدف العام والأهداف التفصيلية',ref:'ص 125',html:`<p><b>الهدف العام للوحدة:</b> الإلمام الشامل بكيفية تشغيل وأداء المحركات التزامنية ثلاثية الأوجه وتطبيقاتها.</p><p><b>الأهداف التفصيلية:</b></p><ol>
   <li>أن يلم المتدرب بنظرية عمل المحركات التزامنية.</li><li>أن يلم المتدرب بطرق بدء حركة المحركات التزامنية.</li><li>أن يفهم المتدرب كيفية التحكم في معامل القدرة ومنحنيات (V) للمحرك التزامني.</li><li>أن يلم المتدرب بكيفية استخدام المحرك التزامني كمكثف تزامني.</li><li>أن يتمكن المتدرب من إجراء الحسابات المتعلقة بتشغيل المحركات التزامنية ثلاثية الأوجه.</li><li>أن يتمكن المتدرب من حساب القدرة والعزم والكفاءة للمحركات التزامنية.</li><li>أن يفهم المتدرب سلوك المحرك التزامني عند تغير الحمل أو تيار المجال.</li><li>أن يتمكن المتدرب من رسم المخطط الاتجاهي وكيفية استخدامه للتحكم في هذه المحركات.</li></ol>
   <p class="sub">الوقت المتوقع والمتطلبات السابقة لم يذكرهما الكتاب لهذه الوحدة. صفحة الغلاف ص 124.</p>`},
  {err:'الهدف السادس (حساب القدرة والعزم والكفاءة) لا تغطيه الوحدة: لا توجد فيها معادلة أو مثال للعزم أو للكفاءة؛ الأمثلة تحسب القدرة الداخلة والتيار والجهد الداخلي ومعامل القدرة فقط.'},
  {h:'التركيب',ref:'ص 126',html:`<p>«الآلة التزامنية يمكن تشغيلها كمحرك تزامني <span class="ltr">Synchronous Motor</span> وذلك بتغذية <b>العضو الثابت من مصدر جهد ثلاثي الأوجه</b> وتغذية <b>ملفات المجال بتيار مستمر</b> كالمعتاد.»</p>
   <p>«عند ذلك ينتج مجالان مغناطيسيان: أحدهما يدور بالسرعة التزامنية حسب تردد مصدر الجهد وهو المجال الناتج عن العضو الثابت، والآخر يدور حسب سرعة العضو الدوار.» «وعندما تصل سرعة العضو الدوار إلى سرعة المجال الناتج عن ملفات العضو الثابت تستقر سرعة المحرك عند هذه السرعة ولا تتغير مهما تغير حمل المحرك مادام ضمن الحمل المقنن له.»</p>
   <p>«الشكل (3-16) <b>[من الوحدة الثالثة، ص 108]</b> يبين أنه عندما تكون زاوية العزم (δ) سالبة فإن الآلة التزامنية تتحول إلى محرك وعندها تكون القدرة الكهربائية داخلة إلى الآلة.»</p>`},
  {fig:'(3-16)',ref:'الوحدة الثالثة ص 108',caption:'من الوحدة الثالثة: العلاقة بين القدرة الخارجة وزاوية القدرة δ حسب المعادلة (3-15) \\(P_o=3V_{ph}E_{ph}\\sin\\delta/X_S\\). المنطقة المظللة بين 0 و90° «مولد تزامني»، وبين −90° و0 «محرك تزامني» (منطقة التشغيل المستقر)، وما بعد ±90° منطقة التشغيل غير المستقر. القدرة السالبة تعني أن القدرة الكهربائية داخلة إلى الآلة.',draw:()=>box(pdeltaSVG(),560)},
  {note:'<b>من الوحدة الثالثة (ص 108–109):</b> $$P_o=\\frac{3V_{ph}E_{ph}\\sin\\delta}{X_S}\\qquad(3\\text{-}15)$$ $$P_{max}=\\frac{3V_{ph}E_{ph}}{X_S}\\qquad(3\\text{-}16)$$ «منطقة التشغيل الآمن أو المستقر للآلة التزامنية عندما تكون (δ&lt;90) في حالة التشغيل كمولد، أو عندما تكون (δ&gt;−90) في حالة التشغيل كمحرك».'},
  {html:`<p>«جميع العلاقات الرياضية الخاصة بالمولد التزامني تنطبق تماماً على المحرك التزامني مع الأخذ في الاعتبار تغير اتجاه القدرة وبالتالي يتغير اتجاه التيار في العضو الثابت، وعلى هذا الأساس تصبح الدائرة المكافئة للمحرك التزامني كما هو موضح في الشكل (4-1) مع <b>إهمال مقاومة ملفات العضو الثابت</b> للتبسيط، وبالتالي يمكن إيجاد قيمة الجهد الداخلي من المعادلة التالية:»</p>
   $$E_{ph} = V_{ph} - jX_S\\,I_{ph} \\qquad (4\\text{-}1)$$
   <ul><li>\\(E_{ph}\\): الجهد الداخلي (المتولد) لكل وجه <span class="ltr">[V]</span></li><li>\\(V_{ph}\\): جهد الوجه (جهد الأطراف لكل وجه) ويُتخذ مرجعاً بزاوية <span class="ltr">0°</span></li><li>\\(X_S\\): الممانعة التزامنية لكل وجه <span class="ltr">[Ω]</span></li><li>\\(I_{ph}\\): تيار المنتج لكل وجه <span class="ltr">[A]</span> واتجاهه داخل إلى الآلة</li></ul>`},
  {fig:'(4-1)',ref:'ص 126',caption:'الدائرة المكافئة للمحرك التزامني: مصدر الجهد الداخلي \\(E_{ph}\\) ثم الممانعة التزامنية \\(jX_S\\) ثم الأطراف \\(V_{ph}\\)؛ والتيار \\(I_{ph}\\) داخل إلى الآلة',draw:()=>box(eqSVG(),520)},
  {fig:'(4-1)',ref:'ص 126',caption:'المخطط الاتجاهي للمحرك التزامني: \\(V_{ph}\\) مرجع أفقي، و\\(I_{ph}\\) متقدم بزاوية θ، و\\(E_{ph}\\) أطول من \\(V_{ph}\\) ويقع تحته بزاوية δ، و\\(jX_SI_{ph}\\) من رأس \\(E_{ph}\\) إلى رأس \\(V_{ph}\\) وهو عمودي على \\(I_{ph}\\) (مرسوم بأرقام مثال 4-1؛ التيار بمقياس مختلف)',draw:()=>{const m=motor(208,255,2.5,13690);return box(phSVG({view:{x0:-20,x1:290,y0:-80,y1:80},vecs:onePoint(208,m),arcs:phArcs(m),H:300}),520)}},
  {note:`<b>توضيح للمتدرب (ليس من نص الكتاب):</b> اقرأ المعادلة (4-1) هكذا: جهد الشبكة \\(V_{ph}\\) = الجهد الداخلي \\(E_{ph}\\) + الهبوط على الممانعة \\(jX_SI_{ph}\\). حرف \\(j\\) يعني «أدِر 90° عكس عقارب الساعة»، لذلك يكون سهم \\(jX_SI_{ph}\\) دائماً عمودياً على سهم التيار. طول \\(E_{ph}\\) يحدده تيار المجال، وزاويته δ يحددها الحمل.`},
  {h:'كيفية عمل المحرك التزامني',ref:'ص 127',html:`<p>«لكي نفهم كيف يعمل المحرك التزامني، انظر الشكل (4-2) الذي يوضح محركاً تزامنياً ذا قطبين.» «عندما تغذى ملفات المجال بالتيار المستمر سيتولد مجال مغناطيسي ثابت في العضو الدوار، أما العضو الثابت فعندما يوصل إلى مصدر الجهد فستمر فيه تيارات ثلاثية الأوجه والتي بدورها ستولد مجالاً مغناطيسياً دواراً منتظماً، وبالتالي سيتواجد داخل الآلة مجالان مغناطيسيان هما \\(B_R\\) و \\(B_S\\).»</p>`},
  {fig:'(4-2)',ref:'ص 127',caption:'المجالات المغناطيسية في المحرك التزامني: مجال العضو الثابت \\(B_S\\) يدور بالسرعة \\(n_s\\) عكس عقارب الساعة، ومجال العضو الدوار \\(B_R\\) يتبعه بزاوية صغيرة. (⊙ تيار خارج، ⊗ تيار داخل)',draw:()=>box(crossSVG({phiS:104,phiR:90}),330)},
  {html:`<p>«مجال العضو الدوار \\(B_R\\) سيحاول أن يكون متعامداً مع مجال العضو الثابت \\(B_S\\) تماماً كما يحدث عندما توضع قطعتان من المغناطيس قرب بعضهما البعض.» «وحيث أن مجال العضو الثابت يدور فإن مجال العضو الدوار سيحاول اللحاق به (ومعه العضو الدوار نفسه) <b>ولكن لن يتمكن من ذلك بسبب اتساع الزاوية بينهما</b>، وبالتالي لابد من إيجاد وسيلة تجعل العضو الدوار يحافظ على زاوية صغيرة بين مجاله ومجال العضو الثابت.»</p>
   <p>«ولكي يتحقق ذلك <b>يجب أن يدار العضو الدوار بالسرعة التزامنية أو قريب منها قبل تغذية ملفاته من مصدر جهد مستمر</b>، وعند التغذية ستكون الزاوية بين المجالين صغيرة وسيستمر مجال العضو الدوار (ومعه العضو الدوار نفسه) في اللحاق بمجال العضو الثابت وسيدور بنفس سرعته (السرعة التزامنية) ولا تتغير مهما تغير حمل المحرك مادام ضمن الحمل المقنن له.»</p>
   <p>«وفي حالة زيادة الحمل عن العزم الأقصى للمحرك (أي أن <span class="ltr">δ &lt; −90°</span>) فإن العضو الدوار <b>سيفقد التزامن</b> ويبدأ بالتباطؤ التدريجي حتى يتوقف.»</p>`},
  {err:'ص 127: يقول الكتاب إن \\(B_R\\) «سيحاول أن يكون <b>متعامداً</b> مع \\(B_S\\) كما يحدث لقطعتي مغناطيس». والصحيح أن قطعتي المغناطيس <b>تتحاذيان</b>، فمجال الدوار يحاول أن <b>ينطبق</b> على مجال الثابت، والزاوية الصغيرة بينهما هي δ وتكبر مع الحمل (وهذا ما يرسمه الكتاب نفسه في الشكل 4-2: السهمان متقاربان). في المختبر زر «كما في الكتاب / المصحح» يبين الفرق.'},
  {err:'ص 127: شرط فقد التزامن مطبوع «(أي أن 90-&lt; δ)» وهي صياغة ملتبسة بسبب اتجاه الكتابة. المقصود أن مقدار δ يتجاوز <span class="ltr">90°</span>؛ وبما أن δ سالبة في المحرك حسب اصطلاح الكتاب فالشرط هو <span class="ltr">δ &lt; −90°</span>. وفي ص 127 أيضاً خطأ إملائي «أيجاد» والصحيح «إيجاد».'},
  {note:`<b>توضيح للمتدرب (ليس من نص الكتاب):</b> لماذا لا يبدأ المحرك وحده؟ المجال \\(B_S\\) يدور 50 أو 60 دورة في الثانية، والدوار الثقيل واقف. في نصف الدورة يجذب المجالُ القطبَ إلى الأمام، وفي النصف التالي يجذبه إلى الخلف، فمتوسط العزم صفر ويبقى الدوار يهتز في مكانه. أما إذا كان الدوار يدور قريباً من \\(n_s\\) فإن الزاوية بين المجالين تتغير ببطء، فيتمكن المجال من «الإمساك» بالقطب وسحبه معه. وسرعة المجال حسب العلاقة المعروفة \\(n_s=120f/P\\): للمحرك ذي القطبين على <span class="ltr">60 Hz</span> تكون <span class="ltr">3600 rpm</span>.`}
 ],
 lab:(el)=>{
  const sim=makeSim('none');let book=1,lastS='',sawVib=0,sawLost=0,sawRun=0;
  el.innerHTML=`<div class="grid">
   <div class="panel c7"><h2>مختبر المجالين <small>مبني على الشكل (4-2) ص 127 — الحركة مرسومة أبطأ بكثير من الحقيقة</small></h2>
    <div class="sm-row">${segHTML('bk',[[1,'كما في الكتاب'],[0,'المصحح']],1)}</div><div id="l1bk" class="sub" style="margin-top:6px"></div>
    <div class="svgbox" style="max-width:360px;margin-inline:auto">${crossSVG({pre:'a1',phiS:102,phiR:90})}</div>
    <div class="sm-row">${swHTML('l1st','3~','العضو الثابت',0)}${swHTML('l1fd','DC','تيار المجال',0)}${swHTML('l1pn','M','محرك بدء يدير الدوار',0)}<button class="btn" id="l1rs">إعادة</button></div>
    ${sl('l1tl','الحمل على العمود (نسبة من العزم الأقصى)',0,120,1,0)}</div>
   <div class="panel c5"><h2>القراءات</h2><div id="l1chip" style="margin-top:8px"></div>
    <div class="facts">${fact('سرعة المجال <bdi dir="ltr">n<sub>s</sub></bdi>','l1ns')}${fact('سرعة الدوار','l1n')}${fact('زاوية العزم δ','l1d')}${fact('القدرة الداخلة (آلة مثال 4-1)','l1p')}</div>
    <div id="l1msg" class="sm-msg"></div>
    <p class="sub">أرقام توضيحية: محرك ذو قطبين على <span class="ltr">60 Hz</span>. القدرة والمخطط الاتجاهي بآلة مثال (4-1): <span class="ltr">V<sub>ph</sub> = 208 V</span>، <span class="ltr">E<sub>ph</sub> = 255 V</span> ثابت، <span class="ltr">X<sub>S</sub> = 2.5 Ω</span>، فالقدرة القصوى <span class="ltr">3·V·E/X<sub>S</sub> ≈ 63.6 kW</span>.</p></div>
   <div class="panel c6"><h2>الدائرة المكافئة <small>الشكل (4-1) ص 126</small></h2><div class="svgbox" id="l1eq" style="max-width:480px;margin-inline:auto"></div></div>
   <div class="panel c6"><h2>المخطط الاتجاهي الحي <small>الشكل (4-1) ص 126</small></h2><div class="svgbox" id="l1ph" style="max-width:460px;margin-inline:auto"></div>
    <div class="legend"><span><i style="background:var(--fg)"></i>V<sub>ph</sub></span><span><i style="background:var(--live)"></i>E<sub>ph</sub></span><span><i style="background:var(--blue)"></i>jX<sub>S</sub>I<sub>ph</sub></span><span><i style="background:var(--on)"></i>I<sub>ph</sub> (مقياس مختلف)</span></div></div>
   <div class="panel c12"><h2>جرّب خطوة خطوة</h2><ol class="steps" id="l1steps"></ol></div></div>`;
  B.math(el);
  const $=s=>el.querySelector(s);
  const bkTxt=()=>{$('#l1bk').innerHTML=book?'<b>كما في الكتاب:</b> «B<sub>R</sub> سيحاول أن يكون متعامداً مع B<sub>S</sub>» — لذلك يُرسم مجال الدوار هنا متأخراً 90° زيادة على δ. لاحظ أن هذا يخالف الشكل (4-2) نفسه.':'<b>المصحح:</b> مجال الدوار يحاول أن ينطبق على مجال الثابت كقطعتي مغناطيس؛ الزاوية بينهما هي δ فقط، صغيرة بلا حمل وتكبر مع الحمل.'};bkTxt();
  el.querySelectorAll('[data-bk]').forEach(b=>b.onclick=()=>{book=+b.dataset.bk;segSet(el,'bk',book);bkTxt()});
  $('#l1st').onclick=()=>{sim.stator=sim.stator?0:1;swSet($('#l1st'),sim.stator)};
  $('#l1fd').onclick=()=>{sim.field=sim.field==='dc'?'R':'dc';swSet($('#l1fd'),sim.field==='dc')};
  $('#l1pn').onclick=()=>{sim.pony=sim.pony?0:1;swSet($('#l1pn'),sim.pony)};
  $('#l1tl').oninput=e=>{sim.TL=+e.target.value/100};
  $('#l1rs').onclick=()=>{sim.reset('none');$('#l1tl').value=0;['#l1st','#l1fd','#l1pn'].forEach(k=>swSet($(k),0));sawVib=sawLost=0};
  $('#l1eq').innerHTML=eqSVG({live:1});
  const steps=stepsUI($('#l1steps'),[
   {t:'غذِّ العضو الثابت وحده',x:'شغّل «العضو الثابت». السهم الأزرق B<sub>S</sub> يدور بالسرعة التزامنية، والدوار واقف لأن ملفات المجال بلا تيار.',done:()=>sim.stator&&sim.field!=='dc'},
   {t:'غذِّ المجال والدوار واقف',x:'شغّل «تيار المجال». الدوار يهتز يميناً ويساراً ولا يبدأ الدوران: الزاوية بين المجالين تتسع بسرعة، فالعزم يتغير اتجاهه باستمرار (ص 127).',done:()=>sawVib},
   {t:'أدر الدوار قرب السرعة التزامنية أولاً',x:'افصل تيار المجال، ثم شغّل «محرك بدء يدير الدوار» حتى تقترب السرعة من n<sub>s</sub>.',done:()=>sim.field!=='dc'&&sim.w>0.95},
   {t:'الآن غذِّ المجال بالتيار المستمر',x:'شغّل «تيار المجال»: الزاوية بين المجالين صغيرة فيقفل الدوار على المجال ويدور بالسرعة التزامنية تماماً. ثم افصل محرك البدء.',done:()=>sim.locked&&!sim.pony},
   {t:'حمّل المحرك',x:'ارفع الحمل إلى نحو <span class="ltr">40%</span>: السرعة لا تتغير، لكن الدوار يتأخر عن المجال بزاوية أكبر (δ ≈ −23°)، ويطول E<sub>ph</sub>sin δ في المخطط الاتجاهي.',done:()=>sim.locked&&sim.TL>=0.38},
   {t:'تجاوز العزم الأقصى',x:'ارفع الحمل فوق <span class="ltr">100%</span>: تبلغ δ القيمة −90° ثم يفقد الدوار التزامن ويتباطأ حتى يتوقف (ص 127).',done:()=>sawLost},
   {t:'أعد التشغيل',x:'اضغط «إعادة» وكرر التشغيل الصحيح: العضو الثابت ← محرك البدء ← تيار المجال ← افصل محرك البدء.'}]);
  loopOn(el,dt=>{sim.step(dt);if(sim.field==='dc'&&sim.stator&&!sim.locked&&sim.w<0.02&&sim.vibT>1.2)sawVib=1;if(sim.lost&&sim.w<0.02)sawLost=1;
   const off=book&&(sim.field==='dc'||sim.locked)?-90:0;
   crossMove(el,'a1',sim.thS,sim.thR+off+sim.jit,0);
   const fc=el.querySelectorAll('[data-fc="a1"]');fc.forEach(r=>r.style.fill=sim.field==='dc'?'var(--live)':'var(--live-soft)');
   const brg=$('#a1brg'),brl=$('#a1brl'),bsg=$('#a1bsg'),bsl=$('#a1bsl');if(brg)brg.style.display=sim.field==='dc'?'':'none';if(brl)brl.style.display=sim.field==='dc'?'':'none';
   if(bsg)bsg.style.display=sim.stator?'':'none';if(bsl)bsl.style.display=sim.stator?'':'none';
   const sg=[Math.round(sim.w*300),sim.locked,Math.round(sim.d*2),sim.stator,sim.field,sim.lost&&sim.w>0.02,Math.round(sim.TL*100),book].join();
   $('#l1tl-v').textContent=Math.round(sim.TL*100)+' %';
   if(sg!==lastS){lastS=sg;
    $('#l1chip').innerHTML=stateChip(sim);
    $('#l1ns').textContent=sim.stator?fm(sim.ns,0)+' rpm':'—';$('#l1n').textContent=fm(sim.w*3600,0)+' rpm';
    $('#l1d').textContent=sim.locked?fm(sim.d,1)+'°':'—';
    const P=sim.locked?PMAX*Math.sin(-sim.d*D):0;$('#l1p').textContent=sim.locked?fm(P/1000,2)+' kW':'—';
    let msg='';if(sim.locked)msg=`<div class="callout">الدوار مقفول على المجال: سرعته = n<sub>s</sub> مهما تغير الحمل ما دام أقل من العزم الأقصى. الحمل الآن ${Math.round(sim.TL*100)}% فـ <span class="ltr">sin|δ| ≈ ${fm(Math.sin(-sim.d*D),2)}</span>.</div>`;
    else if(sim.lost&&sim.w>0.02)msg='<div class="callout err"><b>فقد التزامن:</b> الحمل أكبر من العزم الأقصى، فانزلق الدوار عن المجال ولم يعد للمجال المستمر عزم متوسط؛ الدوار يتباطأ حتى يتوقف.</div>';
    else if(sim.stator&&sim.field==='dc'&&sim.w<0.02)msg='<div class="callout err">المجال يجذب القطب ثم يدفعه بالتناوب: العزم المتوسط صفر، فلا يبدأ المحرك وحده.</div>';
    else if(sim.stator&&sim.field!=='dc'&&sim.w>0.95)msg='<div class="callout">الدوار قريب من السرعة التزامنية: غذِّ المجال الآن.</div>';
    $('#l1msg').innerHTML=msg;
    if(sim.locked){const m=motor(EX.V,EX.E,EX.Xs,Math.max(1,P));$('#l1ph').innerHTML=phSVG({view:{x0:-20,x1:290,y0:-210,y1:150},H:360,vecs:onePoint(EX.V,m,{kI:1.4}),arcs:phArcs(m),circles:[{r:EX.E}],
      brk:[{a:[EX.V+18,0],b:[EX.V+18,m.Ec.im],lab:'∝P',h:1}]})}
    else $('#l1ph').innerHTML=`<p class="sub" style="padding:30px 10px;text-align:center">المخطط الاتجاهي (4-1) يصف المحرك وهو متزامن فقط. شغّل المحرك حتى يقفل على المجال.</p>`}
   steps.check()});
 },
 quiz:[
  {q:'لتشغيل الآلة التزامنية كمحرك نغذي:',o:['العضو الثابت بتيار مستمر والمجال بجهد ثلاثي الأوجه','العضو الثابت بجهد ثلاثي الأوجه وملفات المجال بتيار مستمر','العضو الثابت فقط','ملفات المجال فقط'],c:1,e:'ص 126.'},
  {q:'سرعة المحرك التزامني عند تغير الحمل ضمن الحمل المقنن:',o:['تقل قليلاً','تزيد','لا تتغير وتبقى السرعة التزامنية','تتذبذب'],c:2,e:'ص 126–127: تستقر عند السرعة التزامنية ولا تتغير مهما تغير الحمل ما دام ضمن الحمل المقنن.'},
  {q:'حسب اصطلاح الكتاب تعمل الآلة التزامنية محركاً عندما تكون زاوية العزم δ:',o:['موجبة','سالبة (بين 0 و −90° للتشغيل المستقر)','صفراً','أكبر من 90°'],c:1,e:'ص 126 والشكل (3-16) من الوحدة الثالثة: δ سالبة ⇒ محرك والقدرة الكهربائية داخلة إلى الآلة.'},
  {q:'المعادلة (4-1) للمحرك التزامني هي:',o:['<span class="ltr">E = V + jXs·I</span>','<span class="ltr">E = V − jXs·I</span>','<span class="ltr">E = V·I</span>','<span class="ltr">E = Xs/I</span>'],c:1,e:'ص 126 مع إهمال مقاومة ملفات العضو الثابت.'},
  {q:'لماذا لا يبدأ المحرك التزامني الدوران وحده إذا غذينا المجال والدوار واقف؟',o:['لأن تيار المجال صغير','لأن الزاوية بين المجالين تتسع بسرعة فلا يتمكن الدوار من اللحاق بالمجال الدوار','لأن الجهد منخفض','لأن الملفات مقصورة'],c:1,e:'ص 127: لن يتمكن من ذلك بسبب اتساع الزاوية بينهما.'},
  {q:'متى تُغذى ملفات المجال بالتيار المستمر عند البدء؟',o:['قبل توصيل العضو الثابت','بعد أن يدار الدوار بالسرعة التزامنية أو قريباً منها','عند أي سرعة','بعد توقف الدوار'],c:1,e:'ص 127.'},
  {q:'إذا زاد الحمل عن العزم الأقصى للمحرك التزامني فإن:',o:['السرعة تزيد','الدوار يفقد التزامن ويتباطأ تدريجياً حتى يتوقف','معامل القدرة يصبح واحداً','تيار المجال يزيد وحده'],c:1,e:'ص 127.'},
  {q:'في المخطط الاتجاهي للشكل (4-1)، المتجه jX<sub>S</sub>I<sub>ph</sub>:',o:['يوازي التيار','عمودي على التيار ويصل رأس E<sub>ph</sub> برأس V<sub>ph</sub>','يساوي V<sub>ph</sub>','لا يظهر'],c:1,e:'الشكل (4-1) ص 126: V = E + jXs·I، و j تدير المتجه 90°.'}
 ]
});

/* =============================== Lesson 4.2 — starting methods =============================== */
const METH={
 pony:{n:'محرك خارجي',ref:'ص 128',txt:'«يدار المحرك التزامني بواسطة محرك يركب على نفس العمود حتى تصل السرعة إلى السرعة التزامنية وعندها تغذى ملفات المجال بالتيار المستمر ويفصل محرك البدء وعندها ينتج عزم ذا اتجاه واحد يجعل المحرك يحافظ على السرعة التزامنية مهما تغير الحمل ضمن الحمل المقنن ما لم يفقد التزامن.»'},
 damper:{n:'قضبان التخميد',ref:'ص 128',txt:'«تركيب مجموعة من القضبان في أحذية الأقطاب ثم تقصر هذه القضبان بحلقات نحاسية من الجهتين بحيث تكون ما يشبه القفص السنجابي في المحركات الحثية، وعند توصيل التيار الكهربائي يبدأ المحرك بالدوران على أساس أنه محرك حثي، وعندما تصل السرعة إلى قرب السرعة التزامنية تغذى ملفات المجال بالتيار المستمر … فينتقل المحرك إلى السرعة التزامنية، وعندها يتلاشى تأثير قضبان التخميد لأن التيارات المارة بها عند السرعة التزامنية تساوي صفراً.»'},
 eddy:{n:'التيارات الدوامية',ref:'ص 128',txt:'«محركات تزامنية ذات عضو دوار مصمت وبدون قضبان تخميد … التيارات الدوامية المتولدة في العضو الدوار المصمت تكوّن عزماً مشابهاً لعزم المحرك الحثي، وعندما تصل سرعته قرب السرعة التزامنية سيعلق بالمجال المغناطيسي الدوار … وعندئذ ستتلاشى التيارات الدوامية، وهذه الطريقة مناسبة للمحركات التزامنية الصغيرة.»'},
 vfd:{n:'مصدر متغير التردد',ref:'ص 129',txt:'«بخفض التردد إلى أن تصبح سرعة المجال المغناطيسي الدوار قليلة جداً بحيث يتمكن العضو الدوار من أن يعلق به، وعندما يبدأ العضو الدوار في الدوران يرفع التردد تدريجياً حتى يصل المحرك إلى السرعة المطلوبة.»'}};
const SEQ={
 pony:[['ملفات المجال مقصورة عبر مقاومة',s=>s.field==='R'],['وصّل العضو الثابت بالمصدر',s=>s.stator],['شغّل محرك البدء: يرفع السرعة إلى السرعة التزامنية',s=>s.pony&&s.w>0.97||s.locked],['غذِّ ملفات المجال بالتيار المستمر: يقفل الدوار',s=>s.locked],['افصل محرك البدء: يبقى على n<sub>s</sub>',s=>s.locked&&!s.pony]],
 damper:[['ملفات المجال مقصورة عبر مقاومة',s=>s.field==='R'],['وصّل العضو الثابت: يبدأ كمحرك حثي (قفص سنجابي)',s=>s.stator&&s.w>0.9||s.locked],['قرب n<sub>s</sub> غذِّ ملفات المجال بالتيار المستمر',s=>s.locked],['عند n<sub>s</sub>: تيار القضبان = صفر',s=>s.locked&&s.t-s.lockedT>1.5]],
 eddy:[['وصّل العضو الثابت: التيارات الدوامية في الدوار المصمت تعطي عزماً حثياً',s=>s.stator&&s.w>0.9||s.locked],['قرب n<sub>s</sub> يعلق الدوار بالمجال وحده وتتلاشى التيارات الدوامية',s=>s.locked]],
 vfd:[['غذِّ ملفات المجال بالتيار المستمر',s=>s.field==='dc'],['وصّل العضو الثابت بتردد منخفض جداً (1 Hz): الدوار يعلق بالمجال البطيء',s=>s.stator&&s.locked],['ارفع التردد تدريجياً',s=>s.locked&&s.f>20],['وصل المحرك إلى السرعة المطلوبة (60 Hz)',s=>s.locked&&s.f>=59.9]]};
function fieldCkt(mode,Vf,spark){const on=k=>mode===k;
  let s=`<svg viewBox="0 0 330 170" role="img" aria-label="دائرة ملفات المجال أثناء البدء">`;
  s+=coilP(40,30,40,140,6,mode==='dc'?'flow':Vf>0.05?'live':'')+S.w('M40 30H90M40 140H90');
  s+=`<rect x="88" y="22" width="14" height="16" rx="3" fill="var(--wire)" stroke="var(--fg)"/><rect x="88" y="132" width="14" height="16" rx="3" fill="var(--wire)" stroke="var(--fg)"/>`;
  s+=S.t(95,62,'slip','m')+S.t(95,74,'rings','m');
  s+=S.w('M102 30H140M102 140H140');
  // selector
  const tgt={R:[200,40],open:[200,85],dc:[200,130]}[mode];
  s+=`<circle cx="140" cy="30" r="4" fill="var(--fg)"/><path d="M140 30L${tgt[0]-6} ${tgt[1]}" stroke="var(--fg)" stroke-width="2.6"/>`;
  [[200,40],[200,85],[200,130]].forEach(p=>{s+=`<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/>`});
  s+=`<path class="w ${on('R')&&Vf>0.05?'flow':''}" d="${zig(204,40,280,40,6)}"/>`+S.w('M280 40H300V155H140V140')+arT(242,24,'مقاومة',{fs:12});
  s+=arT(250,90,'مفتوحة',{fs:12});
  s+=S.w('M204 130H240',on('dc')?'flow':'')+`<path d="M240 118V142M248 124V136" stroke="var(--fg)" stroke-width="2.4"/>`+S.w('M248 130H300',on('dc')?'flow':'')+S.t(244,112,'DC','b');
  if(spark){s+=`<path d="M112 70l10 8l-6 4l12 10l-14 -4l2 8l-12 -12l8 -2z" fill="#ffd23f" stroke="var(--stop)" stroke-width="1.2"/><path d="M110 112l9 -6l-2 8l10 -2l-8 10" fill="none" stroke="#ffd23f" stroke-width="2.4"/>`}
  s+=`<text class="txt" x="12" y="164" style="fill:var(${spark?'--stop':'--muted'})">Vf ≈ ${fm(Vf*100,0)}% ${mode==='dc'?'(DC)':''}</text>`;
  return s+'</svg>'}
function shaftSVG(pony,w){let s=`<svg viewBox="0 0 330 90" role="img" aria-label="محرك البدء الخارجي على نفس العمود">`;
  s+=`<rect x="10" y="20" width="80" height="50" rx="8" fill="${pony?'var(--on-soft)':'var(--surface-2)'}" stroke="var(--fg)" stroke-width="1.6"/>`+arT(50,50,'محرك البدء',{fs:12});
  s+=`<rect x="90" y="40" width="${pony?140:120}" height="10" fill="var(--wire)"/>`+(pony?'':`<path d="M210 35V55M218 35V55" stroke="var(--stop)" stroke-width="2"/>`);
  s+=`<rect x="230" y="12" width="90" height="66" rx="8" fill="var(--blue-soft)" stroke="var(--blue)" stroke-width="1.8"/>`+arT(275,50,'المحرك التزامني',{fs:12});
  s+=arT(160,30,pony?'مركّب على نفس العمود':'مفصول',{fs:11,col:pony?'--on':'--muted'});
  return s+'</svg>'}

B.lesson({
 id:'u4-l2',unit:4,order:2,pages:'128–129',
 title:'طرق بدء حركة المحرك التزامني',
 summary:'المحرك التزامني لا يبدأ وحده، فيوصَل الدوار قرب السرعة التزامنية بإحدى أربع طرق: محرك خارجي، أو قضبان التخميد، أو التيارات الدوامية، أو مصدر متغير التردد؛ ويجب أثناء البدء قصر ملفات المجال عبر مقاومة.',
 theory:[
  {h:'طرق بدء حركة المحرك التزامني',ref:'ص 128',html:'<p>رأينا في الدرس السابق أن الدوار يجب أن يدار بالسرعة التزامنية أو قريباً منها قبل تغذية ملفات المجال. يذكر الكتاب أربع طرق لذلك:</p>'},
  {h:'1- باستخدام المحرك الخارجي',ref:'ص 128',html:`<p>${METH.pony.txt}</p>`},
  {h:'2- باستخدام قضبان التخميد',ref:'ص 128',html:`<p>«وذلك بتركيب مجموعة من القضبان في أحذية الأقطاب ثم تقصر هذه القضبان بحلقات نحاسية من الجهتين بحيث تكون ما يشبه القفص السنجابي في المحركات الحثية، وفي هذه الحالة وعند توصيل التيار الكهربائي يبدأ المحرك بالدوران على أساس أنه محرك حثي، وعندما تصل السرعة إلى قرب السرعة التزامنية تغذى ملفات المجال بالتيار المستمر وعندها يتكون مجال مغناطيسي دوار آخر يؤدي وجوده مع المجال الناتج عن العضو الثابت إلى نقل المحرك إلى السرعة التزامنية، وعندها يتلاشى تأثير قضبان التخميد لأن التيارات المارة بها عند السرعة التزامنية تساوي صفراً، ويكون العزم الناتج في هذه الحالة هو عزم المحرك التزامني وليس الحثي، ويحافظ المحرك على سرعته عند السرعة التزامنية مهما تغير الحمل ما لم يفقد التزامن.»</p>`},
  {fig:'—',ref:'ص 128',caption:'رسم توضيحي (لا يوجد شكل في الكتاب): قضبان التخميد في أحذية الأقطاب (الدوائر الصغيرة الرمادية)، مقصورة بحلقتين من الجهتين فتعمل كقفص سنجابي',draw:()=>box(crossSVG({phiS:104,phiR:90,damper:true}),300)},
  {h:'3- باستخدام ظاهرة التيارات الدوامية',ref:'ص 128',html:`<p>«وجدت حديثاً محركات تزامنية ذات عضو دوار مصمت وبدون قضبان تخميد تبدأ حركتها على هذا الأساس بحيث تكون التيارات الدوامية المتولدة في العضو الدوار المصمت عزم مشابه لعزم المحرك الحثي، وعندما يتسارع العضو الدوار وتصل سرعته قرب السرعة التزامنية سيعلق بالمجال المغناطيسي الدوار الناتج عن العضو الثابت وسيدور معه بنفس السرعة وعندئذ ستتلاشى التيارات الدوامية، وهذه الطريقة <b>مناسبة للمحركات التزامنية الصغيرة</b>.»</p>`},
  {h:'4- باستخدام مصدر جهد متغير التردد',ref:'ص 129',html:`<p>«يمكن بدء دوران المحرك التزامني بسهولة إذا كان يغذى من مصدر جهد متغير التردد والذي بدأ ينتشر في السنوات الأخيرة بفضل التقدم في تقنية إلكترونيات القدرة، وذلك بخفض التردد إلى أن تصبح سرعة المجال المغناطيسي الدوار قليلة جداً بحيث يتمكن العضو الدوار من أن يعلق به، وعندما يبدأ العضو الدوار في الدوران يرفع التردد تدريجياً حتى يصل المحرك إلى السرعة المطلوبة. وسيستمر العضو الدوار في الدوران بنفس سرعة المجال المغناطيسي ما لم يفقد التزامن.»</p>`},
  {err:'ص 129: «في السنوات <b>الأخير</b>» والصحيح «الأخيرة» (خطأ إملائي).'},
  {h:'ملاحظة عامة: قصر ملفات المجال أثناء البدء',ref:'ص 129',html:`<p>«ويلاحظ في جميع الطرق السابقة أنه أثناء عملية البدء وقبل توصيل التيار المستمر إلى ملفات المجال <b>يجب أن تكون ملفات المجال مقصورة عبر مقاومة</b>، لأن تعرضها للمجال المغناطيسي الدوار الناتج عن العضو الثابت سيؤدي إلى تولد جهد عالٍ على أطراف ملفات المجال قد يؤدي إلى <b>انهيار العازل</b> أو حدوث <b>شرارة بين حلقات الانزلاق</b>.»</p>`},
  {note:`<b>توضيح للمتدرب (ليس من نص الكتاب):</b> الجهد المتولد في ملفات المجال يتناسب مع سرعة قطع المجال الدوار لها، أي مع الانزلاق. عند البدء (الدوار واقف) يكون الانزلاق 100% فيكون الجهد أكبر ما يمكن، ويقل كلما اقترب الدوار من \\(n_s\\). المقاومة تسمح بمرور تيار فتمنع ارتفاع الجهد. والكتاب لا يرسم أي شكل لطرق البدء، فكل الرسوم في هذا الدرس توضيحية.`}
 ],
 lab:(el)=>{
  const sim=makeSim('pony');let sdone=0,meth='pony',lastS='',auto=null,hist=[],ht=0,sparkSeen=0;
  el.innerHTML=`<div class="grid">
   <div class="panel c12"><h2>اختر طريقة البدء <small>مبنية على نص ص 128–129 (لا يوجد شكل في الكتاب؛ الرسوم والأرقام توضيحية)</small></h2>
    <div class="sm-row">${segHTML('mt',Object.keys(METH).map(k=>[k,METH[k].n]),meth)}</div><div class="callout" id="l2txt"></div></div>
   <div class="panel c7"><h2>المحرك <small id="l2sub"></small></h2><div class="svgbox" id="l2x" style="max-width:340px;margin-inline:auto"></div><div id="l2pony"></div>
    <div class="facts">${fact('سرعة الدوار','l2n')}${fact('سرعة المجال الآن','l2ns')}${fact('الانزلاق','l2s')}${fact('تيار القضبان / الدوامات','l2id')}${fact('زاوية العزم δ','l2d')}${fact('التردد','l2f')}</div></div>
   <div class="panel c5"><h2>التحكم</h2><div id="l2chip" style="margin-top:6px"></div>
    <div class="sm-row">${swHTML('l2st','3~','العضو الثابت',0)}<span id="l2pw">${swHTML('l2pn','M','محرك البدء',0)}</span></div>
    <div id="l2fw"><h3 class="sm" style="margin-top:12px">ملفات المجال</h3>${segHTML('fd',[['R','مقصورة عبر مقاومة'],['open','مفتوحة'],['dc','تيار مستمر DC']],'R')}<div class="svgbox" id="l2fc" style="max-width:330px"></div></div>
    <div id="l2vw" style="display:none"><h3 class="sm" style="margin-top:12px">رفع التردد</h3><div class="sm-row"><button class="btn" id="l2rp">ابدأ رفع التردد</button>${segHTML('rt',[['slow','تدريجياً'],['fast','بسرعة كبيرة']],'slow')}</div></div>
    <div class="sm-row"><button class="btn primary" id="l2au">شغّل التسلسل تلقائياً</button><button class="btn" id="l2rs">إعادة</button></div>
    <div id="l2msg" class="sm-msg"></div></div>
   <div class="panel c6"><h2>تسلسل الطريقة</h2><ol class="sm-seq" id="l2seq"></ol></div>
   <div class="panel c6"><h2>السرعة مع الزمن <small>آخر 20 ثانية</small></h2><div class="svgbox" id="l2ch"></div>
    <div class="legend"><span><i style="background:var(--blue)"></i>سرعة المجال n<sub>s</sub></span><span><i style="background:var(--live)"></i>سرعة الدوار</span></div></div>
   <div class="panel c12">${tryList(['في «محرك خارجي»: اترك ملفات المجال <b>مفتوحة</b> وشغّل محرك البدء: تظهر شرارة على حلقات الانزلاق لأن الجهد المتولد عالٍ عند الانزلاق الكبير (ص 129). أعدها «مقصورة عبر مقاومة».','في «قضبان التخميد»: غذِّ المجال بالتيار المستمر والدوار ما زال بطيئاً: لا يقفل ويهتز. انتظر حتى يقترب من n<sub>s</sub> ثم غذِّه.','لاحظ أن تيار القضبان يصبح صفراً لحظة الإقفال (ص 128).','في «التيارات الدوامية»: لا تحتاج أي خطوة غير توصيل العضو الثابت؛ ارفع الحمل فوق 20% وأعد: لا يعلق (الطريقة للمحركات الصغيرة).','في «مصدر متغير التردد»: جرّب رفع التردد «بسرعة كبيرة»: الدوار لا يلحق بالمجال ويفقد التزامن؛ أما «تدريجياً» فيصل إلى 60 Hz وهو متزامن.'])}
    ${sl('l2tl','حمل أثناء البدء (نسبة من العزم الأقصى)',0,40,1,0)}</div></div>`;
  B.math(el);
  const $=s=>el.querySelector(s);
  const setUI=()=>{segSet(el,'mt',meth);$('#l2txt').innerHTML=`<b>${METH[meth].n} (${METH[meth].ref}):</b> ${METH[meth].txt}`;
   $('#l2pw').style.display=meth==='pony'?'':'none';$('#l2fw').style.display=meth==='eddy'?'none':'';$('#l2vw').style.display=meth==='vfd'?'':'none';
   $('#l2sub').textContent=meth==='eddy'?'دوار مصمت بلا قضبان':meth==='damper'?'دوار بأقطاب بارزة وقضبان تخميد':'دوار بأقطاب بارزة';
   $('#l2x').innerHTML=crossSVG({pre:'a2',solid:meth==='eddy',eddy:meth==='eddy',damper:meth==='damper',field:meth!=='eddy'});
   $('#l2pony').innerHTML=meth==='pony'?box(shaftSVG(sim.pony,sim.w),330):'';
   if(meth==='eddy')$('#l2fw').insertAdjacentHTML('afterend','');lastS='';};
  const reset=()=>{auto=null;sdone=0;sim.reset(meth);sim.TL=+$('#l2tl').value/100;hist=[];ht=0;swSet($('#l2st'),0);swSet($('#l2pn'),0);segSet(el,'fd','R');segSet(el,'rt','slow');$('#l2rp').textContent='ابدأ رفع التردد';setUI()};
  el.querySelectorAll('[data-mt]').forEach(b=>b.onclick=()=>{meth=b.dataset.mt;reset()});
  el.querySelectorAll('[data-fd]').forEach(b=>b.onclick=()=>{sim.field=b.dataset.fd;segSet(el,'fd',sim.field)});
  el.querySelectorAll('[data-rt]').forEach(b=>b.onclick=()=>{sim.rate=b.dataset.rt;segSet(el,'rt',sim.rate)});
  $('#l2st').onclick=()=>{sim.stator=sim.stator?0:1;swSet($('#l2st'),sim.stator)};
  $('#l2pn').onclick=()=>{sim.pony=sim.pony?0:1;swSet($('#l2pn'),sim.pony);$('#l2pony').innerHTML=box(shaftSVG(sim.pony,sim.w),330)};
  $('#l2rp').onclick=()=>{sim.ramp=sim.ramp?0:1;$('#l2rp').textContent=sim.ramp?'أوقف رفع التردد':'ابدأ رفع التردد'};
  $('#l2tl').oninput=e=>{sim.TL=+e.target.value/100};
  $('#l2rs').onclick=reset;
  const act={stator:()=>{sim.stator=1;swSet($('#l2st'),1)},pony:v=>()=>{sim.pony=v;swSet($('#l2pn'),v);$('#l2pony').innerHTML=box(shaftSVG(v,sim.w),330)},field:v=>()=>{sim.field=v;segSet(el,'fd',v)},ramp:()=>{sim.rate='slow';segSet(el,'rt','slow');sim.ramp=1;$('#l2rp').textContent='أوقف رفع التردد'}};
  const PLAN={pony:[[act.field('R'),0.6],[act.stator,0.8],[act.pony(1),s=>s.w>0.985],[act.field('dc'),s=>s.locked&&s.t-s.lockedT>1.2],[act.pony(0),0]],
   damper:[[act.field('R'),0.6],[act.stator,s=>s.w>0.94],[act.field('dc'),0]],eddy:[[act.stator,0]],vfd:[[act.field('dc'),0.6],[act.stator,1.0],[act.ramp,0]]};
  $('#l2au').onclick=()=>{reset();auto={i:0,t:0,plan:PLAN[meth]}};
  setUI();
  loopOn(el,dt=>{
   if(auto){const p=auto.plan[auto.i];if(!p)auto=null;else{if(auto.t===0)p[0]();auto.t+=dt;const w=p[1];if(typeof w==='number'?auto.t>=w:w(sim)){auto.i++;auto.t=0}}}
   sim.step(dt);ht+=dt;
   if(Math.floor(ht*10)!==Math.floor((ht-dt)*10)){hist.push([ht,sim.ws,sim.w]);while(hist.length&&ht-hist[0][0]>20)hist.shift()}
   crossMove(el,'a2',sim.thS,sim.thR+sim.jit,0);
   el.querySelectorAll('[data-fc="a2"]').forEach(r=>r.style.fill=sim.field==='dc'?'var(--live)':'var(--live-soft)');
   const brg=$('#a2brg'),brl=$('#a2brl');if(brg)brg.style.display=sim.field==='dc'?'':'none';if(brl)brl.style.display=sim.field==='dc'?'':'none';
   const bsg=$('#a2bsg'),bsl=$('#a2bsl');if(bsg)bsg.style.display=sim.stator?'':'none';if(bsl)bsl.style.display=sim.stator?'':'none';
   const ed=$('#a2edd');if(ed)ed.style.opacity=String(sim.Idamp);
   const spark=meth!=='eddy'&&sim.field==='open'&&sim.Vf>0.25;if(spark)sparkSeen=1;
   $('#l2tl-v').textContent=Math.round(sim.TL*100)+' %';
   const sg=[Math.round(sim.w*400),sim.locked,Math.round(sim.d),sim.stator,sim.field,sim.pony,Math.round(sim.f*2),spark,Math.round(sim.Idamp*40),Math.floor(ht*4)].join();
   if(sg===lastS)return;lastS=sg;
   $('#l2chip').innerHTML=stateChip(sim);
   $('#l2n').textContent=fm(sim.w*3600,0)+' rpm';$('#l2ns').textContent=sim.stator?fm(sim.ns,0)+' rpm':'—';$('#l2s').textContent=sim.stator?fm(sim.slip*100,1)+' %':'—';
   $('#l2id').textContent=meth==='damper'||meth==='eddy'?fm(sim.Idamp*100,0)+' %':'لا يوجد';$('#l2d').textContent=sim.locked?fm(sim.d,1)+'°':'—';$('#l2f').textContent=fm(meth==='vfd'?sim.f:60,1)+' Hz';
   if(meth!=='eddy')$('#l2fc').innerHTML=fieldCkt(sim.field,sim.Vf,spark);
   const seq=SEQ[meth];while(sdone<seq.length&&seq[sdone][1](sim))sdone++;
   $('#l2seq').innerHTML=seq.map((q,i)=>`<li class="${i<sdone?'done':i===sdone?'cur':''}">${q[0]}</li>`).join('');
   let msg='';
   if(spark)msg='<div class="callout err"><b>خطر!</b> ملفات المجال مفتوحة والمجال الدوار يقطعها بانزلاق كبير: يتولد جهد عالٍ على أطرافها قد يؤدي إلى انهيار العازل أو شرارة بين حلقات الانزلاق (ص 129). اجعلها «مقصورة عبر مقاومة».</div>';
   else if(sim.lost&&!sim.locked&&sim.t-sim.lostT<5)msg=meth==='vfd'?'<div class="callout err">رُفع التردد أسرع مما يستطيع الدوار أن يلحق به: العزم المطلوب للتسارع تجاوز العزم الأقصى ففقد التزامن.</div>':'<div class="callout err">فقد التزامن: العزم المطلوب أكبر من العزم الأقصى.</div>';
   else if(sim.field==='dc'&&sim.stator&&!sim.locked&&meth!=='vfd')msg=sim.w<0.9?'<div class="callout err">التيار المستمر في المجال والدوار بعيد عن n<sub>s</sub>: المجال يجذب القطب ثم يدفعه، فلا يقفل الدوار ويهتز. الأفضل أن يُغذى المجال قرب السرعة التزامنية.</div>':'';
   else if(sim.locked&&meth==='pony'&&sim.pony)msg='<div class="callout">أقفل الدوار. افصل محرك البدء الآن: يبقى المحرك على السرعة التزامنية بعزمه هو.</div>';
   else if(sim.locked)msg='<div class="callout">المحرك متزامن. '+(meth==='damper'?'تيار قضبان التخميد صفر لأن الدوار يدور مع المجال (لا انزلاق).':meth==='eddy'?'تلاشت التيارات الدوامية لأن الدوار يدور مع المجال.':'')+'</div>';
   $('#l2msg').innerHTML=msg;
   $('#l2ch').innerHTML=plotSVG({w:520,h:230,x0:Math.max(0,ht-20),x1:Math.max(20,ht),y0:0,y1:1.15,yt:[0,0.25,0.5,0.75,1],yf:v=>fm(v*3600,0),xt:[],xl:'t',yl:'rpm',clip:'l2c',aria:'السرعة مع الزمن',
     series:[{pts:hist.map(h=>[h[0],h[1]]),col:'--blue',w:2,dash:'6 4'},{pts:hist.map(h=>[h[0],h[2]]),col:'--live',w:2.6}]});
  });
 },
 quiz:[
  {q:'في طريقة المحرك الخارجي، متى يُفصل محرك البدء؟',o:['قبل توصيل العضو الثابت','بعد وصول السرعة إلى السرعة التزامنية وتغذية ملفات المجال بالتيار المستمر','عند نصف السرعة','لا يُفصل أبداً'],c:1,e:'ص 128.'},
  {q:'قضبان التخميد المقصورة بحلقات نحاسية تشبه:',o:['ملفات المجال','القفص السنجابي في المحركات الحثية','المبدل','حلقات الانزلاق'],c:1,e:'ص 128.'},
  {q:'لماذا يتلاشى تأثير قضبان التخميد عند السرعة التزامنية؟',o:['لأنها تحترق','لأن التيارات المارة بها عند السرعة التزامنية تساوي صفراً','لأن تيار المجال يُفصل','لأن الجهد يقل'],c:1,e:'ص 128: لا انزلاق بين الدوار والمجال، فلا جهد يُحث في القضبان.'},
  {q:'طريقة التيارات الدوامية (الدوار المصمت) مناسبة لـ:',o:['المحركات الكبيرة جداً','المحركات التزامنية الصغيرة','المولدات فقط','المكثفات الساكنة'],c:1,e:'ص 128.'},
  {q:'في طريقة المصدر متغير التردد نبدأ بـ:',o:['تردد عالٍ ثم نخفضه','تردد منخفض جداً ثم نرفعه تدريجياً','تردد ثابت 60 Hz','قطع المجال'],c:1,e:'ص 129.'},
  {q:'أثناء البدء وقبل توصيل التيار المستمر يجب أن تكون ملفات المجال:',o:['مفتوحة','مقصورة عبر مقاومة','موصلة بالمصدر المتردد','موصلة على التوالي مع العضو الثابت'],c:1,e:'ص 129.'},
  {q:'إذا تُركت ملفات المجال مفتوحة أثناء البدء فقد يحدث:',o:['زيادة السرعة','انهيار العازل أو شرارة بين حلقات الانزلاق','تحسن معامل القدرة','لا شيء'],c:1,e:'ص 129: يتولد جهد عالٍ على أطراف ملفات المجال.'}
 ]
});

/* =============================== Lesson 4.3 — V curves, T–n, uses, condenser =============================== */
const VK=50;                                   // V/A: E = 50·I_F (أرقام توضيحية، خطي كما يفترض الكتاب في ص 139)
const Ef=(IF,sat)=>sat?520*Math.tanh(VK*IF/520):VK*IF;
const LOADS=[[13690,'P<sub>1</sub>'],[24880,'P<sub>2</sub>'],[36000,'P<sub>3</sub>']];
function vcurve(P,sat){const pts=[];let lim=null;for(let i=0;i<=200;i++){const IF=i*0.05;const m=motor(EX.V,Ef(IF,sat),EX.Xs,P);if(m.ok)pts.push([IF,m.Im]);else lim=IF}return {pts,lim}}
const unityIF=(P,sat)=>{const E=Math.hypot(EX.V,EX.Xs*P/(3*EX.V));if(!sat)return E/VK;return 520/VK*Math.atanh(Math.min(0.999,E/520))};
function vSVG(o){o=o||{};const sat=!!o.sat;const list=o.cond&&!o.all?[]:o.only!=null?[o.only]:[0,1,2];
  return plotSVG({w:520,h:330,x0:0,x1:10,y0:0,y1:140,xt:[0,2,4,6,8,10],yt:[0,20,40,60,80,100,120,140],xl:'IF (A)',yl:'Iph (A)',clip:o.clip||'vc',aria:'منحنيات V',
   under:(X,Y)=>{let s='';const u=[];for(let P=0;P<=40000;P+=2000)u.push([unityIF(P,sat),P/(3*EX.V)]);s+=`<path d="${u.map((p,i)=>(i?'L':'M')+fx(X(p[0]))+' '+fx(Y(p[1]))).join('')}" stroke="var(--muted)" stroke-dasharray="6 5" stroke-width="1.6" fill="none"/>`;return s},
   series:(o.cond?[{pts:vcurve(0,sat).pts,col:'--blue',w:2.8}]:[]).concat(list.map(i=>({pts:vcurve(LOADS[i][0],sat).pts,col:o.hi===i?'--live':'--fg',w:o.hi===i?3:2}))),
   extra:(X,Y)=>{let s='';list.forEach(i=>{const c=vcurve(LOADS[i][0],sat).pts,p=c[c.length-1];s+=`<text class="txt" x="${fx(X(p[0])-4)}" y="${fx(Y(p[1])-6)}" text-anchor="end">P<tspan font-size="9" dy="3">${i+1}</tspan></text>`});
     s+=`<text class="txt m" x="${fx(X(unityIF(0,sat))+4)}" y="${fx(Y(0)-6)}" text-anchor="start">cos θ = 1.0</text>`;
     s+=arT(X(1.6),Y(130),'معامل القدرة متخلف',{fs:12.5,col:'--live'})+arT(X(8.2),Y(130),'معامل القدرة متقدم',{fs:12.5,col:'--blue-ink'});
     if(o.cond){s+=arT(X(2.0),Y(25),'Q من الشبكة إلى المحرك',{fs:11.5,col:'--muted'})+arT(X(7.3),Y(25),'Q من المحرك إلى الشبكة',{fs:11.5,col:'--muted'});if(sat)s+=arT(X(8.6),Y(88),'منطقة التشبع',{fs:12,col:'--stop'})}
     if(o.pt)s+=`<circle cx="${fx(X(o.pt[0]))}" cy="${fx(Y(o.pt[1]))}" r="6.5" fill="var(--live)" stroke="var(--surface)" stroke-width="2"/>`;return s}})}
function tnSVG(o){o=o||{};const Tr=0.45;return plotSVG({w:520,h:280,x0:0,x1:1.2,y0:0,y1:1.25,xt:[0,1],xf:v=>v?'ns':'0',yt:[0],xl:'n',yl:'T',clip:o.clip||'tn',aria:'منحنى العزم والسرعة',
  under:(X,Y)=>`<path d="M${X(0)} ${fx(Y(1))}H${X(1.2)}" stroke="var(--stop)" stroke-dasharray="6 5" stroke-width="1.6"/><path d="M${X(0)} ${fx(Y(Tr))}H${X(1.2)}" stroke="var(--blue)" stroke-dasharray="6 5" stroke-width="1.6"/>`,
  series:[{pts:[[1,0],[1,1]],col:'--fg',w:3.2}],
  extra:(X,Y)=>arT(X(0.42),Y(1)-7,'العزم الأقصى T<tspan font-size="9" dy="3">max</tspan>',{fs:12.5,col:'--stop'})+arT(X(0.42),Y(Tr)-7,'العزم المقنن T<tspan font-size="9" dy="3">rated</tspan>',{fs:12.5,col:'--blue-ink'})+
   (o.pt?`<circle cx="${fx(X(o.pt[0]))}" cy="${fx(Y(o.pt[1]))}" r="7" fill="var(${o.pt[2]||'--live'})" stroke="var(--surface)" stroke-width="2"/>`:'')})}

B.lesson({
 id:'u4-l3',unit:4,order:3,pages:'129–132',
 title:'منحنيات V، والعزم مع السرعة، والاستخدامات، والمكثف التزامني',
 summary:'بتيار المجال نتحكم في معامل قدرة المحرك التزامني: أقل تيار منتج عند معامل قدرة = 1، وتحته يكون متأخراً (يسحب Q) وفوقه متقدماً (يعطي Q). السرعة ثابتة حتى العزم الأقصى، ومن أشهر الاستخدامات المكثف التزامني لتحسين معامل القدرة.',
 theory:[
  {h:'منحنيات (V) للمحرك التزامني',ref:'ص 129–130',html:`<p>«هي منحنيات تحدد خواص تشغيل المحرك التزامني وتربط بين <b>تيار المجال \\(I_F\\)</b> و<b>تيار المنتج \\(I_{Ph}\\)</b> انظر الشكل (4-3)، وكل منحنى يمثل مستوى محدداً من القدرة الفعالة P.»</p>
   <ul><li>«في كل منحنى <b>أقل قيمة لتيار المنتج</b> تحدث عندما يكون <b>معامل القدرة مساوياً للواحد</b>، وعند هذه القيمة لتيار المجال يكون المحرك مستهلكاً للقدرة الفعالة P فقط.»</li>
   <li>«وعند أي قيمة <b>أقل</b> من هذه القيمة لتيار المجال يكون المحرك مستهلكاً للقدرة غير الفعالة Q بالإضافة إلى القدرة الفعالة P ويكون معامل القدرة <b>متأخر</b>.»</li>
   <li>«إلا أنه عندما يكون تيار المجال <b>أكبر</b> من هذه القيمة يكون المحرك <b>معطياً للقدرة غير الفعالة Q</b> بالإضافة إلى استهلاكه للقدرة الفعالة P ويكون معامل القدرة <b>متقدماً</b> في هذه الحالة.»</li></ul>
   <p>«وهذا يعني أنه يمكننا بالتحكم في تيار المجال أن نجعل المحرك التزامني إما مستهلكاً للقدرة غير الفعالة أو مزوداً للشبكة بالقدرة غير الفعالة أي أن المحرك التزامني يمكن أن يعمل كأنه <b>ملف</b> أو <b>مكثف</b>.»</p>`},
  {fig:'(4-3)',ref:'ص 130',caption:'منحنيات V للمحرك التزامني: ثلاثة مستويات للقدرة \\(P_1<P_2<P_3\\)، والخط المتقطع يمر بالنقاط الدنيا (\\(\\cos\\theta=1.0\\)) ويميل إلى اليمين كلما زادت القدرة؛ يساره معامل قدرة متخلف ويمينه متقدم. (مرسومة بآلة مثال 4-1 وأرقام توضيحية لتيار المجال)',draw:()=>box(vSVG({clip:'f43'}),540)},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> لماذا شكل V؟ القدرة ثابتة على المنحنى الواحد، فالجزء الفعّال من التيار \\(I\\cos\\theta\\) ثابت. عند تيار المجال المناسب يكون التيار كله فعّالاً فهو أصغر ما يمكن. إذا نقص تيار المجال أو زاد يُضاف إلى التيار جزء غير فعّال (متأخر أو متقدم) فيكبر التيار على الجانبين. ونهاية المنحنى من اليسار هي حد الاستقرار: تيار مجال أقل من ذلك لا يكفي لحمل هذه القدرة فيفقد المحرك التزامن.'},
  {h:'منحنى العزم مع السرعة للمحرك التزامني',ref:'ص 130–131',html:`<p>«المحرك التزامني عادةً يدير أحمالاً تتطلب سرعة ثابتة وغالباً يتم تغذيته من مصدر كهربائي ضخم بحيث يظهر بالنسبة للمحرك <b>كأنه قضيب لا نهائي</b> وهذا يعني أن جهد الأطراف للمحرك وتردد المصدر لا يمكن أن يتغيرا مهما تغيرت القدرة المسحوبة من المصدر بواسطة المحرك، وبما أن سرعة المحرك مرتبطة بتردد المصدر فهذا يعني أن سرعة المحرك لن تتغير مهما تغير الحمل المسلط عليه ما دام ضمن الحمل المقنن، وعليه فإن عزم المحرك سيبقى ثابتاً عند السرعة التزامنية مهما تغير الحمل ما دام ضمن الحمل المقنن كما هو موضح في الشكل (4-4).»</p>`},
  {fig:'(4-4)',ref:'ص 131',caption:'منحنى العزم والسرعة للمحرك التزامني: خط رأسي عند \\(n_s\\) من الصفر حتى العزم الأقصى؛ والعزم المقنن أقل من الأقصى. (الكتاب لا يرسم ما بعد العزم الأقصى)',draw:()=>box(tnSVG({clip:'f44'}),520)},
  {err:'عنوان هذا البند في الفهرس «منحنى العزم مع السرعة»، وفي المتن «منحنى العزم مع السرعة للمحرك التزامني» (اختلاف بسيط في العنوان فقط).'},
  {h:'استخدامات المحرك التزامني',ref:'ص 131',html:`<p>«يستخدم المحرك التزامني على نطاق ضيق وذلك في التطبيقات التي يكون فيها <b>ثبات السرعة مطلباً أساسياً</b>، وفي حالة كون ثبات السرعة غير مطلب أساسي فيستغنى عن المحرك التزامني بغيره نظراً لارتفاع ثمنه حيث إنه يحتاج إلى <b>نظام إثارة</b> <span class="ltr">Excitation System</span> و<b>نظام بدء حركة</b>، ومن أشهر تطبيقاته استخدامه كمكثف تزامني <span class="ltr">Synchronous Condenser</span>.»</p>`},
  {h:'المكثف التزامني',ref:'ص 131–132',html:`<p>«من التطبيقات الهامة للمحرك التزامني استخدامه كمكثف تزامني وذلك من أجل <b>تحسين معامل القدرة</b>، ولهذا الغرض يصنع المحرك التزامني <b>بدون عمود خارج منه</b> وذلك لأنه يعمل بدون حمل، من أجل ذلك يزاد تيار المجال إلى قيمة معينة بحيث يتقدم تيار المنتج على جهد الأطراف بزاوية قريبة من <span class="ltr">90°</span> وهذا يجعله يظهر على الشبكة كأنه مكثف. يبين الشكل (4-5) منحنى V للمحرك التزامني عندما يعمل كمكثف تزامني.»</p>
   <p>«ولا يزال المكثف التزامني متواجداً بأعداد كبيرة في الأنظمة الكهربائية القديمة، أما في الوقت الحاضر فقد بدأ يقل استخدامه لهذا الغرض حيث تم استبداله بالمكثفات الساكنة <span class="ltr">static capacitors</span> نظراً لقلة ثمنها وقلة متطلبات صيانتها.»</p>`},
  {fig:'(4-5)',ref:'ص 132',caption:'منحنى V للمكثف التزامني (بدون حمل): نقطته الدنيا تلامس محور \\(I_F\\) تقريباً. يساره معامل قدرة متخلف والقدرة غير الفعالة تنتقل من الشبكة إلى المحرك، ويمينه متقدم وتنتقل من المحرك إلى الشبكة، وينحني الفرع الأيمن في أعلاه في «منطقة التشبع» (أرقام توضيحية)',draw:()=>box(vSVG({cond:1,sat:1,clip:'f45'}),540)},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> الكتاب لا يعطي مثالاً عددياً لتحسين معامل قدرة مصنع بالمكثف التزامني. في المختبر لوحة توضيحية بأرقام افتراضية: مصنع يسحب قدرة غير فعالة متأخرة، والمكثف التزامني (بتيار مجال كبير) يعطي قدرة غير فعالة متقدمة فيقل ما تسحبه الشبكة ويقترب معامل القدرة من الواحد.'}
 ],
 lab:(el)=>{
  let li=0,IF=4.6,sat=0,FP=100,Fpf=0.75,CIF=4.2,TL=0.3,nT=1,lostT=0,lastA='',lastB='',lastC='';
  el.innerHTML=`<div class="grid">
   <div class="panel c7"><h2>لوحة منحنيات V <small>مبنية على الشكلين (4-3) ص 130 و(4-5) ص 132</small></h2>
    <div class="sm-row">${segHTML('ld',[[0,'P<sub>1</sub> = 13.69 kW'],[1,'P<sub>2</sub> = 24.88 kW'],[2,'P<sub>3</sub> = 36 kW'],[3,'بدون حمل (مكثف تزامني)']],0)}</div>
    <div class="svgbox" id="l3v"></div>
    ${sl('l3if','تيار المجال I<sub>F</sub>',0,10,0.05,IF)}
    <div class="sm-row">${swHTML('l3sat','sat','إظهار التشبع (الشكل 4-5)',0)}</div>
    <p class="sub">P<sub>1</sub> و P<sub>2</sub> هما القدرتان الداخلتان في مثال (4-1)، و P<sub>3</sub> توضيحية. الآلة: <span class="ltr">V<sub>ph</sub> = 208 V</span>، <span class="ltr">X<sub>S</sub> = 2.5 Ω</span>، و <span class="ltr">E<sub>ph</sub> = 50·I<sub>F</sub></span> (توضيحي، خطي كما يفترض الكتاب في مثال 4-2).</p></div>
   <div class="panel c5"><h2>عند النقطة الحالية</h2><div id="l3chip" style="margin-top:6px"></div>
    <div class="facts">${fact('E<sub>ph</sub>','l3e')}${fact('δ','l3d')}${fact('I<sub>ph</sub>','l3i')}${fact('معامل القدرة (↑ متقدم، ↓ متأخر)','l3pf')}${fact('Q (لكل الأوجه)','l3q')}</div>
    <div class="svgbox" id="l3ph" style="max-width:420px;margin-inline:auto"></div><div id="l3msg" class="sm-msg"></div></div>
   <div class="panel c12"><h2>المكثف التزامني يحسّن معامل قدرة مصنع <small>توضيحي — لا يوجد مثال عددي في الكتاب؛ أرقام توضيحية</small></h2>
    <div class="sm-two"><div>${sl('l3fp','قدرة المصنع الفعالة',20,150,1,FP)}${sl('l3fpf','معامل قدرة المصنع (متأخر)',0.6,0.95,0.01,Fpf)}${sl('l3cif','تيار مجال المكثف التزامني',0,10,0.05,CIF)}
     <div class="facts">${fact('Q المصنع (يسحب)','l3qf')}${fact('Q المكثف التزامني','l3qc')}${fact('Q من الشبكة','l3qn')}${fact('معامل القدرة قبل → بعد','l3pp')}${fact('تيار الخط قبل → بعد','l3il')}</div></div>
     <div><div class="svgbox" id="l3tri"></div><p class="sub">المكثف التزامني هنا هو آلة مثال (4-1) نفسها بلا حمل (δ ≈ 0)، على شبكة <span class="ltr">208 V</span> دلتا: <span class="ltr">Q = 3·V·(E − V)/X<sub>S</sub></span>. نهمل مفاقيده.</p></div></div></div>
   <div class="panel c12"><h2>العزم مع السرعة <small>مبني على الشكل (4-4) ص 131 — العزم المقنن 45% من الأقصى (توضيحي)</small></h2>
    <div class="sm-two"><div class="svgbox" id="l3tn"></div><div>${sl('l3tl','عزم الحمل (نسبة من العزم الأقصى)',0,130,1,TL*100)}<div class="facts">${fact('السرعة','l3n')}${fact('الحالة','l3st')}</div><div class="sm-row"><button class="btn" id="l3re">أعد التشغيل</button></div><div id="l3tm" class="sm-msg"></div></div></div></div>
   <div class="panel c12"><h2>جرّب خطوة خطوة</h2><ol class="steps" id="l3steps"></ol></div></div>`;
  B.math(el);
  const $=s=>el.querySelector(s);let seenLag=0,seenLead=0,seenU=0,seenCond=0,seenLost=0,seenPF=0;
  el.querySelectorAll('[data-ld]').forEach(b=>b.onclick=()=>{li=+b.dataset.ld;segSet(el,'ld',li);lastA=''});
  $('#l3if').oninput=e=>{IF=+e.target.value};$('#l3sat').onclick=()=>{sat=sat?0:1;swSet($('#l3sat'),sat);lastA=''};
  $('#l3fp').oninput=e=>{FP=+e.target.value};$('#l3fpf').oninput=e=>{Fpf=+e.target.value};$('#l3cif').oninput=e=>{CIF=+e.target.value};
  $('#l3tl').oninput=e=>{TL=+e.target.value/100};$('#l3re').onclick=()=>{if(TL<=1){nT=1;lostT=0}};
  const steps=stepsUI($('#l3steps'),[
   {t:'معامل قدرة متأخر',x:'على P<sub>1</sub> اخفض I<sub>F</sub> إلى أقل من <span class="ltr">3.5 A</span>: التيار متأخر عن الجهد والمحرك يسحب Q من الشبكة (كأنه ملف).',done:()=>seenLag},
   {t:'معامل قدرة = 1',x:'حرّك I<sub>F</sub> حتى تصل إلى أدنى نقطة في المنحنى (على الخط المتقطع): أقل تيار منتج ومعامل قدرة ≈ 1.',done:()=>seenU},
   {t:'معامل قدرة متقدم',x:'زد I<sub>F</sub> فوق <span class="ltr">6 A</span>: التيار متقدم والمحرك يعطي Q للشبكة (كأنه مكثف).',done:()=>seenLead},
   {t:'قدرة أكبر',x:'اختر P<sub>3</sub>: المنحنى أعلى ونقطته الدنيا أبعد إلى اليمين، أي نحتاج تيار مجال أكبر لمعامل قدرة = 1.',done:()=>li===2},
   {t:'المكثف التزامني',x:'اختر «بدون حمل» واضبط I<sub>F</sub> على 8 A أو أكثر: التيار متقدم بزاوية قريبة من 90° (ص 131).',done:()=>seenCond},
   {t:'حسّن معامل قدرة المصنع',x:'في لوحة المصنع ارفع تيار مجال المكثف التزامني حتى يصبح معامل القدرة بعد التحسين 0.95 أو أكثر، ولاحظ نقص تيار الخط.',done:()=>seenPF},
   {t:'العزم الأقصى',x:'في لوحة العزم مع السرعة ارفع عزم الحمل فوق 100%: يفقد المحرك التزامن وتهبط السرعة إلى الصفر.',done:()=>seenLost}]);
  loopOn(el,dt=>{
   $('#l3if-v').textContent=fm(IF,2)+' A';$('#l3fp-v').textContent=FP+' kW';$('#l3fpf-v').textContent=fm(Fpf,2);$('#l3cif-v').textContent=fm(CIF,2)+' A';$('#l3tl-v').textContent=Math.round(TL*100)+' %';
   const sgA=[li,IF,sat].join();
   if(sgA!==lastA){lastA=sgA;const P=li<3?LOADS[li][0]:0,E=Ef(IF,sat),m=motor(EX.V,E,EX.Xs,P);
    $('#l3v').innerHTML=vSVG({sat,hi:li<3?li:-1,cond:li===3,all:1,pt:m.ok?[IF,m.Im]:null});
    $('#l3e').textContent=fm(E,1)+' V';
    if(m.ok){$('#l3d').textContent=fm(m.d,1)+'°';$('#l3i').textContent=fm(m.Im,2)+' A';$('#l3pf').textContent=fm(m.pf,3)+(m.lead>0?' ↑':m.lead<0?' ↓':'');$('#l3q').textContent=fm(Math.abs(m.Q)/1000,2)+' kvar';
     $('#l3chip').innerHTML=m.lead>0?chip('يعطي Q للشبكة — يتصرف كمكثف','blue'):m.lead<0?chip('يسحب Q من الشبكة — يتصرف كملف','warn'):chip('معامل القدرة = 1 — P فقط','ok');
     if(m.lead<0&&li===0)seenLag=1;if(m.lead>0&&li===0&&IF>6)seenLead=1;if(Math.abs(m.th)<3&&li<3)seenU=1;if(li===3&&m.th>80)seenCond=1;
     const kI=li===3?1.2:1.6;$('#l3ph').innerHTML=phSVG({view:{x0:-60,x1:Math.max(300,E+30),y0:-170,y1:200},W:420,H:340,vecs:onePoint(EX.V,m,{kI}),arcs:phArcs(m)});
     $('#l3msg').innerHTML=`<div class="callout">${m.lead>0?'القدرة غير الفعالة تنتقل <b>من المحرك إلى الشبكة</b>.':m.lead<0?'القدرة غير الفعالة تنتقل <b>من الشبكة إلى المحرك</b>.':'لا تنتقل قدرة غير فعالة تقريباً.'}</div>`}
    else{['#l3d','#l3i','#l3pf','#l3q'].forEach(k=>$(k).textContent='—');$('#l3chip').innerHTML=chip('تيار المجال لا يكفي لهذا الحمل: فقد التزامن','bad');$('#l3ph').innerHTML='';$('#l3msg').innerHTML='<div class="callout err">لهذا الحمل يلزم <span class="ltr">sin|δ| = X<sub>S</sub>P/(3VE)</span> أكبر من 1، أي أن E صغير جداً: المحرك لا يستطيع حمل هذه القدرة. زد تيار المجال.</div>'}}
   const sgB=[FP,Fpf,CIF].join();
   if(sgB!==lastB){lastB=sgB;const Qf=FP*Math.tan(Math.acos(Fpf)),E=Ef(CIF,0),Qc=3*EX.V*(E-EX.V)/EX.Xs/1000,Qn=Qf-Qc,pf2=FP/Math.hypot(FP,Qn);
    const I1=Math.hypot(FP,Qf)*1000/(R3*EX.V),I2=Math.hypot(FP,Qn)*1000/(R3*EX.V);if(pf2>=0.95&&Qc>0)seenPF=1;
    $('#l3qf').textContent=fm(Qf,1)+' kvar';$('#l3qc').textContent=(Qc>=0?'يعطي ':'يسحب ')+fm(Math.abs(Qc),1)+' kvar';$('#l3qn').textContent=fm(Qn,1)+' kvar'+(Qn<0?' (متقدم)':'');
    $('#l3pp').textContent=fm(Fpf,2)+' → '+fm(pf2,3)+(Qn<0?' متقدم':' متأخر');$('#l3il').textContent=fm(I1,0)+' → '+fm(I2,0)+' A';
    const sc=Math.min(1.4,200/Math.max(FP,Qf,1)),ox=30,oy=Math.max(30,30-Math.min(0,Qn)*sc);let s=`<svg viewBox="0 0 330 260" role="img" aria-label="مثلث القدرة">`;
    const P=[ox+FP*sc,oy];s+=arrow(ox,oy,P[0],oy,'--fg',2.6)+S.t(fx((ox+P[0])/2),oy-8,'P = '+fm(FP,0)+' kW');
    s+=arrow(P[0],oy,P[0],oy+Qf*sc,'--live',2.4,'5 4')+arrow(ox,oy,P[0],oy+Qf*sc,'--live',1.6,'5 4');
    s+=arrow(P[0]+14,oy+Qf*sc,P[0]+14,oy+Qn*sc,'--blue',2.6)+S.t(P[0]+20,fx(oy+(Qf+Qn)/2*sc),'Qc','b','start');
    s+=arrow(ox,oy,P[0],oy+Qn*sc,'--on',2.8)+`<text class="txt" x="${fx(P[0]-6)}" y="${fx(oy+Qf*sc+14)}" text-anchor="end" style="fill:var(--live)">S قبل</text><text class="txt" x="${fx(ox+FP*sc*0.45)}" y="${fx(oy+Qn*sc*0.45-8)}" style="fill:var(--on)">S بعد</text>`;
    $('#l3tri').innerHTML=s.replace('S قبل','S1').replace('S بعد','S2')+'</svg>'+'<div class="legend"><span><i style="background:var(--live)"></i>S1 قبل المكثف التزامني</span><span><i style="background:var(--on)"></i>S2 بعده</span><span><i style="background:var(--blue)"></i>Q المكثف التزامني</span></div>'}
   if(TL>1&&nT>0){nT=Math.max(0,nT-dt*0.45);if(!lostT)lostT=1}
   if(lostT)seenLost=1;
   const sgC=[Math.round(TL*100),Math.round(nT*200),lostT].join();
   if(sgC!==lastC){lastC=sgC;$('#l3tn').innerHTML=tnSVG({clip:'l3tnc',pt:[nT,Math.min(TL,1.2),lostT?'--stop':'--live']});$('#l3n').textContent=fm(nT*3600,0)+' rpm';
    $('#l3st').innerHTML=lostT?chip('فقد التزامن','bad'):TL>0.45?chip('فوق العزم المقنن','warn'):chip('متزامن','ok');
    $('#l3tm').innerHTML=lostT?'<div class="callout err">العزم المطلوب تجاوز العزم الأقصى: فقد المحرك التزامن ويتباطأ حتى يتوقف (ص 127). اخفض العزم ثم «أعد التشغيل».</div>':'<div class="callout">السرعة ثابتة عند n<sub>s</sub> مهما تغير العزم ما دام أقل من العزم الأقصى.</div>'}
   steps.check()});
 },
 quiz:[
  {q:'منحنيات V تربط بين:',o:['السرعة والعزم','تيار المجال وتيار المنتج','الجهد والتردد','القدرة والزمن'],c:1,e:'ص 129: تربط بين I_F و I_Ph، وكل منحنى لقدرة فعالة P محددة.'},
  {q:'أقل قيمة لتيار المنتج على منحنى V تحدث عندما يكون معامل القدرة:',o:['متأخراً','متقدماً','مساوياً للواحد','صفراً'],c:2,e:'ص 129.'},
  {q:'إذا كان تيار المجال أكبر من قيمة معامل القدرة = 1 فإن المحرك:',o:['يسحب Q ومعامل قدرته متأخر','يعطي Q للشبكة ومعامل قدرته متقدم','يفقد التزامن','لا يستهلك P'],c:1,e:'ص 129: يتصرف كمكثف.'},
  {q:'في الشكل (4-3) الخط المتقطع المار بالنقاط الدنيا:',o:['يمثل معامل قدرة = 1 ويميل إلى اليمين كلما زادت القدرة','يمثل العزم الأقصى','أفقي','يمثل معامل قدرة متأخراً'],c:0,e:'الشكل (4-3) ص 130.'},
  {q:'حسب الشكل (4-4) سرعة المحرك التزامني من اللاحمل حتى العزم الأقصى:',o:['تقل خطياً','ثابتة عند n<sub>s</sub>','تزيد','صفر'],c:1,e:'ص 130–131: المصدر كأنه قضيب لا نهائي فالتردد ثابت والسرعة ثابتة.'},
  {q:'لماذا يُستغنى عن المحرك التزامني إذا لم يكن ثبات السرعة مطلباً أساسياً؟',o:['لأنه ضعيف','لارتفاع ثمنه لأنه يحتاج نظام إثارة ونظام بدء حركة','لأنه لا يعمل على 60 Hz','لأن معامل قدرته سيئ دائماً'],c:1,e:'ص 131.'},
  {q:'المكثف التزامني يُصنع بدون عمود خارج منه لأنه:',o:['يعمل بدون حمل','يعمل بسرعة عالية','لا يدور','يعمل على التيار المستمر'],c:0,e:'ص 131: يعمل بدون حمل ويزاد تيار المجال حتى يتقدم التيار بزاوية قريبة من 90°.'},
  {q:'لماذا بدأ يقل استخدام المكثف التزامني حديثاً؟',o:['لأنه لا يحسن معامل القدرة','استُبدل بالمكثفات الساكنة لقلة ثمنها وقلة متطلبات صيانتها','لأنه ممنوع','لأنه يحتاج حملاً'],c:1,e:'ص 132.'}
 ]
});

/* =============================== solvers that follow the book's steps and rounding =============================== */
const n_=v=>fm(v);
const ang=v=>(v<0?'-':'')+n_(Math.abs(v));
/* مثال (4-1) and التمرين 9.  opt:{hp, conn:'delta'|'star', vmode:'div'|'nodiv', bk:{vme}} */
function solveLoad(g,opt){opt=opt||{};const st=[],star=opt.conn==='star',bk=opt.bk||null,sg=g.lead>=0.5?1:-1;
  let Vph=g.V;
  if(star){if(opt.vmode==='div'){Vph=rd(g.V/R3,2);st.push({t:'في توصيل النجمة جهد الوجه = جهد الخط ÷ √3:',f:`V_{ph}=\\frac{V_L}{\\sqrt3}=\\frac{${n_(g.V)}}{\\sqrt3}`,v:Vph,unit:'V',dp:2})}
    else st.push({t:'<b>الطريقة (ب):</b> نعوّض بجهد الخط نفسه مكان جهد الوجه في كل المعادلات، كما تُقرأ صيغ الكتاب حرفياً:',f:`V_{ph}=${n_(g.V)}\\ \\text{V}`})}
  const Po1=opt.hp?rd(g.P1*0.746,2):g.P1;
  if(opt.hp)st.push({t:'(ب) القدرة الميكانيكية الخارجة من المحرك بالكيلو وات:',f:`P_o=${n_(g.P1)}\\,hp\\times0.746\\,kw/hp`,v:Po1,unit:'kw',dp:2});
  else st.push({t:'(ب) القدرة الخارجة (الحمل):',f:`P_o=${n_(g.P1)}\\ kw`});
  const Pin1=rd(Po1+g.Pc+g.Pf,2);
  st.push({t:'القدرة الكهربائية الداخلة إلى المحرك:',f:`P_{in}=P_o+P_{cu1}+P_{cor}+P_F=${n_(Po1)}+0+${n_(g.Pc)}+${n_(g.Pf)}`,v:Pin1,unit:'kw',dp:2});
  const cs=g.pf,IL=rd(Pin1*1e3/(R3*(star?g.V:Vph)*cs),1);
  st.push(star?{t:'تيار الخط (القدرة الثلاثية بجهد الخط):',f:`I_L=\\frac{P_{in}}{\\sqrt3\\,V_L\\cos\\theta}=\\frac{${n_(Pin1)}\\times10^3}{\\sqrt3\\times${n_(g.V)}\\times${n_(cs)}}`,v:IL,unit:'A',dp:1,final:true}
   :{t:'تيار الخط (بصيغة الكتاب):',f:`I_L=\\frac{P_{in}}{\\sqrt3\\,V_{ph}\\cos\\theta}=\\frac{${n_(Pin1)}\\times10^3}{\\sqrt3\\times${n_(Vph)}\\times${n_(cs)}}`,v:IL,unit:'A',dp:1,final:true});
  const Iph=star?IL:rd(IL/R3,1);
  st.push(star?{t:'في توصيل النجمة تيار الوجه = تيار الخط:',f:'I_{ph}=I_L',v:Iph,unit:'A',dp:1,final:true}:{t:'وبما أن ملفات المحرك موصلة على شكل دلتا فإن تيار الوجه:',f:`I_{ph}=\\frac{I_L}{\\sqrt3}=\\frac{${n_(IL)}}{\\sqrt3}`,v:Iph,unit:'A',dp:1,final:true});
  const th=rd(Math.acos(cs)/D,2),ia=sg*th;
  st.push({t:`وبما أن المحرك يعمل عند معامل قدرة ${sg>0?'متقدم':'متأخر'} فإن زاوية تيار الوجه:`,f:`I_{ph}=${n_(Iph)}\\angle{${ang(ia)}^\\circ}\\ A`});
  const xi=rd(g.Xs*Iph,2),xa=rd(ia+90,2),re=rd(Vph-xi*Math.cos(xa*D),1),im=rd(-xi*Math.sin(xa*D),1),Em=rd(Math.hypot(re,im),0),Ea=rd(Math.atan2(im,re)/D,1);
  st.push({t:'نحسب E<sub>Ph</sub> مباشرة بتطبيق المعادلة (4-1):',f:`E_{Ph}=V_{Ph}-jX_SI_{Ph}=${n_(Vph)}\\angle{0^\\circ}-(j${n_(g.Xs)})(${n_(Iph)}\\angle{${ang(ia)}^\\circ})`});
  st.push({t:'',f:`=${n_(Vph)}\\angle{0^\\circ}-${n_(xi)}\\angle{${ang(xa)}^\\circ}=${n_(re)}${im<0?'-':'+'}j${n_(Math.abs(im))}`});
  st.push({t:'الجهد الداخلي:',f:`E_{Ph}=${n_(Em)}\\angle{${ang(Ea)}^\\circ}`,v:`${n_(Em)} ∠ ${ang(Ea)}°`,unit:'V',final:true});
  const Po2=opt.hp?rd(g.P2*0.746,2):g.P2,Pin2=rd(Po2+g.Pc+g.Pf,2);
  st.push({t:'(د) بعد زيادة الحمل تصبح القدرة الكهربائية الداخلة:',f:opt.hp?`P_{in}=${n_(g.P2)}(0.746)+0+${n_(g.Pc)}+${n_(g.Pf)}`:`P_{in}=${n_(g.P2)}+0+${n_(g.Pc)}+${n_(g.Pf)}`,v:Pin2,unit:'kw',dp:2});
  const sd=rd(g.Xs*Pin2*1e3/(3*Vph*Em),3);
  const R={Vph,Po1,Pin1,IL,Iph,ia,Em,Ea,Pin2,sd};
  if(!(sd<=1)){st.push({t:`<span class="ltr">sin δ = ${n_(sd)}</span> أكبر من 1: الحمل الجديد أكبر من القدرة القصوى، فيفقد المحرك التزامن ولا يوجد حل.`});return {st,R}}
  const d=rd(Math.asin(sd)/D,0);
  st.push({t:'قيمة E<sub>Ph</sub> لم تتغير وإنما ازدادت الزاوية δ؛ نجدها بالمعادلة (3-15) <b>[من الوحدة الثالثة ص 108: \\(P=3V_{Ph}E_{Ph}\\sin\\delta/X_S\\)]</b>:',f:`\\delta=\\sin^{-1}\\left(\\frac{X_SP}{3V_{Ph}E_{Ph}}\\right)=\\sin^{-1}\\left(\\frac{${n_(g.Xs)}\\times${n_(Pin2)}\\times10^3}{3\\times${n_(Vph)}\\times${n_(Em)}}\\right)=\\sin^{-1}(${n_(sd)})`,v:d,unit:'°',dp:0});
  st.push({t:'إذاً الجهد الداخلي يصبح:',f:`E_{Ph}=${n_(Em)}\\angle{-${n_(d)}^\\circ}`});
  const dr=Vph-Em*Math.cos(d*D),di=Em*Math.sin(d*D),dm=bk&&bk.vme!=null?bk.vme:rd(Math.hypot(dr,di),1),da=rd(Math.atan2(di,dr)/D,0),I2=rd(dm/g.Xs,1),I2a=rd(da-90,0);
  st.push({t:'تيار المنتج من المعادلة (4-1):',f:`I_{Ph}=\\frac{V_{Ph}-E_{Ph}}{jX_S}=\\frac{${n_(Vph)}\\angle{0^\\circ}-${n_(Em)}\\angle{-${n_(d)}^\\circ}}{j${n_(g.Xs)}}=\\frac{${n_(dm)}\\angle{${ang(da)}^\\circ}}{j${n_(g.Xs)}}`,v:`${fm(I2,1)} ∠ ${ang(I2a)}°`,unit:'A',final:true});
  const IL2=star?I2:rd(R3*I2,1);
  st.push(star?{t:'تيار الخط (نجمة):',f:`I_L=I_{ph}`,v:IL2,unit:'A',dp:1,final:true}:{t:'وبالتالي يكون تيار الخط:',f:`I_L=\\sqrt3\\,I_{ph}=\\sqrt3\\times${n_(I2)}`,v:IL2,unit:'A',dp:1,final:true});
  const pf2=rd(Math.cos(I2a*D),3);
  st.push({t:'(هـ) معامل القدرة بعد زيادة الحمل:',f:`\\cos\\theta=\\cos(${ang(I2a)}^\\circ)`,v:pf2,dp:3,final:true});
  st.push({t:I2a>0?'الزاوية موجبة: التيار ما زال <b>متقدماً</b> على الجهد (الكتاب لم يكتب كلمة «متقدم» — توضيح).':I2a<0?'الزاوية سالبة: صار التيار <b>متأخراً</b> عن الجهد (توضيح).':'التيار على اتجاه الجهد: معامل القدرة = 1.'});
  // exact chain for comparison
  const eIL=Pin1*1e3/(R3*(star?g.V:Vph)*cs),eI=star?eIL:eIL/R3,eE=csub(C(Vph,0),cmul(C(0,g.Xs),pol(eI,sg*Math.acos(cs)/D))),eEm=cabs(eE);
  const es=g.Xs*Pin2*1e3/(3*Vph*eEm);let cmp='';if(es<=1){const ed=Math.asin(es)/D,eI2=cdiv(csub(C(Vph,0),pol(eEm,-ed)),C(0,g.Xs));cmp=`E = ${fm(eEm,2)}∠${fm(cang(eE),2)}° ، δ = ${fm(ed,2)}° ، I = ${fm(cabs(eI2),2)}∠${fm(cang(eI2),2)}° A ، I_L = ${fm(star?cabs(eI2):R3*cabs(eI2),2)} A ، cos θ = ${fm(Math.cos(cang(eI2)*D),4)}`}
  if(cmp)st.push({t:'للمقارنة (ليس من الكتاب): الحساب نفسه بلا تقريب للخطوات',v:cmp});
  if(star){const Pchk=3*Vph*Iph*cs/1000;st.push({t:`تحقق (ليس من الكتاب): <span class="ltr">3·V<sub>ph</sub>·I<sub>ph</sub>·cos θ = ${fm(Pchk,2)} kW</span> ${Math.abs(Pchk-Pin1)<0.1?'= P<sub>in</sub> ✓':'≠ P<sub>in</sub> = '+fm(Pin1,2)+' kW ✗ (القدرة لا تتوازن في هذه الطريقة)'}`})}
  Object.assign(R,{d,dm,da,I2,I2a,IL2,pf2});return {st,R}}
/* مثال (4-2) and التمرين 10 */
function solveField(g,opt){opt=opt||{};const st=[],bk=opt.bk||null,sg=g.lead>=0.5?1:-1;let Pin;
  if(opt.hp){Pin=rd(g.hp*0.746,2);st.push({t:'القدرة الخارجة، والمفاقيد مهملة فهي نفسها القدرة الداخلة:',f:`P_{in}=P_o=${n_(g.hp)}\\,hp\\times0.746`,v:Pin,unit:'kw',dp:2})}
  else{Pin=g.Pin;st.push({t:'(ب) من المثال السابق القدرة الكهربائية الداخلة:',f:`P_{in}=${n_(Pin)}\\ kw`})}
  const IL=rd(Pin*1e3/(R3*g.V*g.pf),1),Iph=rd(IL/R3,1),th=rd(Math.acos(g.pf)/D,1),ia=sg*th;
  st.push({t:`وبما أن المحرك يعمل عند معامل قدرة ${n_(g.pf)} ${sg>0?'متقدم':'متأخر'}، فتيار الخط (بصيغة الكتاب):`,f:`I_L=\\frac{P_{in}}{\\sqrt3\\,V_{ph}\\cos\\theta}=\\frac{${n_(Pin)}\\times10^3}{\\sqrt3\\times${n_(g.V)}\\times${n_(g.pf)}}`,v:IL,unit:'A',dp:1,final:true});
  st.push({t:'وبما أن ملفات المحرك موصلة على شكل دلتا:',f:`I_{ph}=\\frac{I_L}{\\sqrt3}=\\frac{${n_(IL)}}{\\sqrt3}`,v:Iph,unit:'A',dp:1,final:true});
  st.push({t:'زاوية تيار الوجه:',f:`I_{ph}=${n_(Iph)}\\angle{${ang(ia)}^\\circ}\\ A`});
  const xi=rd(g.Xs*Iph,2),xa=rd(ia+90,1),re=rd(g.V-xi*Math.cos(xa*D),1),im=rd(-xi*Math.sin(xa*D),1),Em=rd(Math.hypot(re,im),0),Ea=rd(Math.atan2(im,re)/D,1);
  st.push({t:'بتطبيق المعادلة (4-1):',f:`E_{Ph}=${n_(g.V)}\\angle{0^\\circ}-(j${n_(g.Xs)})(${n_(Iph)}\\angle{${ang(ia)}^\\circ})=${n_(g.V)}\\angle{0^\\circ}-${n_(xi)}\\angle{${ang(xa)}^\\circ}`});
  st.push({t:'',f:`=${n_(re)}${im<0?'-':'+'}j${n_(Math.abs(im))}=${n_(Em)}\\angle{${ang(Ea)}^\\circ}`,v:`${n_(Em)} ∠ ${ang(Ea)}°`,unit:'V',final:true});
  const k=1+g.pct/100,E2=rd(k*Em,1);
  st.push({t:`(جـ) عند زيادة تيار المجال بنسبة ${n_(g.pct)}% يزداد الفيض بنفس النسبة، فيزداد الجهد الداخلي بنفس النسبة:`,f:`E'_{Ph}=${n_(rd(k,4))}\\,E_{Ph}=${n_(rd(k,4))}(${n_(Em)})`,v:E2,unit:'V',dp:1});
  st.push({t:'القدرة الخارجة تبقى ثابتة وتتناسب مع طول المتجه \\(E_{Ph}\\sin\\delta\\)، فهو ثابت قبل زيادة تيار المجال وبعدها:',f:`E_{Ph}\\sin\\delta=E'_{Ph}\\sin\\delta'`});
  const s2=rd(Em/E2*Math.sin(Ea*D),2);const R={Pin,IL,Iph,ia,Em,Ea,E2,s2};
  if(Math.abs(s2)>1){st.push({t:'لا يوجد حل بهذه القيم.'});return {st,R}}
  const d2=rd(Math.asin(s2)/D,1);
  st.push({t:'زاوية العزم الجديدة:',f:`\\delta'=\\sin^{-1}\\left(\\frac{E_{Ph}}{E'_{Ph}}\\sin\\delta\\right)=\\sin^{-1}\\left(\\frac{${n_(Em)}}{${n_(E2)}}\\sin(${ang(Ea)})\\right)=\\sin^{-1}(${n_(s2)})`,v:d2,unit:'°',dp:1});
  const dr=g.V-E2*Math.cos(d2*D),di=-E2*Math.sin(d2*D),dm=bk&&bk.vme!=null?bk.vme:rd(Math.hypot(dr,di),1),da=rd(Math.atan2(di,dr)/D,1),I2=rd(dm/g.Xs,1),I2a=rd(da-90,1);
  st.push({t:'تيار المنتج من المعادلة (4-1):',f:`I_{Ph}=\\frac{V_{Ph}-E'_{Ph}}{jX_S}=\\frac{${n_(g.V)}\\angle{0^\\circ}-${n_(E2)}\\angle{${ang(d2)}^\\circ}}{j${n_(g.Xs)}}=\\frac{${n_(dm)}\\angle{${ang(da)}^\\circ}}{j${n_(g.Xs)}}`,v:`${fm(I2,1)} ∠ ${ang(I2a)}°`,unit:'A',final:true});
  const IL2=rd(R3*I2,2);st.push({t:'وبالتالي يكون تيار الخط:',f:`I_L=\\sqrt3\\,I_{ph}=\\sqrt3\\times${n_(I2)}`,v:IL2,unit:'A',dp:2,final:true});
  const pf2=rd(Math.cos(I2a*D),3);st.push({t:'(د) معامل القدرة بعد زيادة تيار المجال:',f:`\\cos\\theta=\\cos(${ang(I2a)}^\\circ)`,v:pf2,dp:3,final:true});
  st.push({t:I2a>0?(sg<0?'الزاوية موجبة: تغيّر معامل القدرة من متأخر إلى <b>متقدم</b> (الكتاب لم يكتب كلمة «متقدم» — توضيح).':'الزاوية موجبة: معامل القدرة ما زال <b>متقدماً</b> (توضيح).'):'الزاوية سالبة: معامل القدرة متأخر (توضيح).'});
  const eI=Pin*1e3/(R3*g.V*g.pf)/R3,eE=csub(C(g.V,0),cmul(C(0,g.Xs),pol(eI,sg*Math.acos(g.pf)/D))),eE2=cabs(eE)*k,ed2=Math.asin(cabs(eE)/eE2*Math.sin(cang(eE)*D))/D,eI2=cdiv(csub(C(g.V,0),pol(eE2,ed2)),C(0,g.Xs));
  st.push({t:'للمقارنة (ليس من الكتاب): الحساب نفسه بلا تقريب للخطوات',v:`E = ${fm(cabs(eE),2)}∠${fm(cang(eE),2)}° ، E' = ${fm(eE2,2)} ، δ' = ${fm(ed2,2)}° ، I = ${fm(cabs(eI2),2)}∠${fm(cang(eI2),2)}° A ، I_L = ${fm(R3*cabs(eI2),2)} A ، cos θ = ${fm(Math.cos(cang(eI2)*D),4)}`});
  Object.assign(R,{d2,dm,da,I2,I2a,IL2,pf2});return {st,R}}
const G41=[{id:'V',label:'جهد المصدر (دلتا)',sym:'V',unit:'V',value:208},{id:'Xs',label:'الممانعة التزامنية',sym:'X_S',unit:'Ω',value:2.5},{id:'Pc',label:'المفاقيد الحديدية',sym:'P_{cor}',unit:'kw',value:1.0},{id:'Pf',label:'مفاقيد الاحتكاك',sym:'P_F',unit:'kw',value:1.5},
 {id:'P1',label:'الحمل',sym:'P_o',unit:'hp',value:15},{id:'pf',label:'معامل القدرة',sym:'\\cos\\theta',unit:'',value:0.8,step:0.01},{id:'lead',label:'نوعه: 1 = متقدم، 0 = متأخر',sym:'',unit:'',value:1,step:1,min:0,max:1},{id:'P2',label:'الحمل الجديد',sym:'P_o\'',unit:'hp',value:30}];
const G42=[{id:'V',label:'جهد المصدر (دلتا)',sym:'V',unit:'V',value:208},{id:'Xs',label:'الممانعة التزامنية',sym:'X_S',unit:'Ω',value:2.5},{id:'Pin',label:'القدرة الداخلة',sym:'P_{in}',unit:'kw',value:13.69},
 {id:'pf',label:'معامل القدرة',sym:'\\cos\\theta',unit:'',value:0.85,step:0.01},{id:'lead',label:'نوعه: 1 = متقدم، 0 = متأخر',sym:'',unit:'',value:0,step:1,min:0,max:1},{id:'pct',label:'زيادة تيار المجال',sym:'',unit:'%',value:25}];
const BK41={vme:103.1},BK42={vme:56.2};

/* =============================== Lesson 4.4 — load change at constant field =============================== */
function fig46b(){const Ps=[13690,24880,36800,48000],kI=1.2;let vecs=[{a:[0,0],b:[208,0],col:'--fg',lab:sb('V','ph'),w:2.8}],lines=[],brk=[];
  Ps.forEach((P,i)=>{const m=motor(208,255,2.5,P),I=pol(m.Im*kI,m.th),c=['--blue','--on','--live','--stop'][i];
   vecs.push({a:[0,0],b:[m.Ec.re,m.Ec.im],col:'--muted',lab:sb('E','ph'+(i+1)),w:1.8});vecs.push({a:[m.Ec.re,m.Ec.im],b:[208,0],col:'--muted',w:1.2,dash:'4 3'});
   vecs.push({a:[0,0],b:[I.re,I.im],col:c,lab:sb('I','ph'+(i+1)),w:2.4});lines.push({a:[I.re,0],b:[I.re,I.im],col:c,dash:'2 3'});brk.push({a:[236+i*14,0],b:[236+i*14,m.Ec.im],lab:i===3?'∝P':''})});
  return phSVG({view:{x0:-20,x1:300,y0:-190,y1:110},H:340,vecs,lines,circles:[{r:255}],brk,notes:[{p:[244,-182],s:'∝P1 … ∝P4',anc:'start'}]})}
B.lesson({
 id:'u4-l4',unit:4,order:4,pages:'132–136',
 title:'سلوك المحرك عند تغيير الحمل مع ثبات تيار المجال',
 summary:'عند زيادة الحمل يتباطأ الدوار لحظياً فتزداد δ ويزداد العزم حتى يعود إلى السرعة التزامنية. E ثابت فيتحرك رأسه على دائرة، ويكبر التيار ويدور من متقدم نحو متأخر. المثال (4-1) بأرقام الكتاب.',
 theory:[
  {h:'سلوك المحرك التزامني في حالة تغيير الحمل مع ثبات تيار المجال',ref:'ص 132',html:`<p>«عندما يدار حمل ما بمحرك تزامني فإن المحرك سوف ينتج ما يكفي من العزم لكي يحافظ على سرعة دورانه عند السرعة التزامنية.»</p>
   <p>«لكي نفهم ما يحدث عند تغير الحمل، نفترض أن المحرك يعمل عند معامل قدرة متقدماً كما هو موضح في الشكل (4-6)أ، فإذا ازداد الحمل على عمود الدوران فإن سرعة المحرك ستقل ونتيجة لذلك زاوية العزم (δ) سوف تزداد وبالتالي سوف يزداد العزم المتولد طبقاً للمعادلة (3-17) <b>[من الوحدة الثالثة — انظر الملاحظة أدناه]</b> والذي بدوره سيزيد من سرعة العضو الدوار إلى أن تصل إلى السرعة التزامنية مرة أخرى ولكن عند زاوية عزم (δ) أكبر، مما يعني استهلاكاً لقدرة أكبر، وهكذا كلما ازداد الحمل على المحرك كما هو واضح من المخطط الاتجاهي في الشكل (4-6) ب، ويحدث العكس تماماً عندما يقل الحمل على المحرك.»</p>
   <p>«مع ملاحظة أن قيمة \\(E_{Ph}\\) تبقى ثابتة دائماً بسبب عدم تغير قيمة تيار المجال وفي المخطط الاتجاهي يتحرك المتجه \\(E_{Ph}\\) راسماً دائرة يمثل نصف قطرها.»</p>`},
  {err:'ص 132: يقول الكتاب «سوف يزداد العزم المتولد طبقاً للمعادلة (3-17)». لكن (3-17) في الوحدة الثالثة هو <b>شكل</b> (مخطط سريان القدرة داخل المولد، ص 109) وليس معادلة. العلاقة التي تربط القدرة بزاوية العزم هي المعادلة (3-15) ص 108: \\(P_o=3V_{ph}E_{ph}\\sin\\delta/X_S\\)، وهي نفسها التي يستعملها المثال (4-1) لإيجاد δ. على الأرجح المقصود (3-15).'},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> من (3-15) [الوحدة الثالثة ص 108] القدرة تتناسب مع \\(\\sin\\delta\\). والسرعة ثابتة (السرعة التزامنية)، والعزم = القدرة ÷ السرعة الزاوية، فالعزم أيضاً يزداد مع δ حتى أقصاه عند \\(\\delta=-90^\\circ\\). لذلك عندما يزداد الحمل تكبر δ حتى يتساوى عزم المحرك مع عزم الحمل.'},
  {fig:'(4-6) أ',ref:'ص 133',caption:'محرك يعمل عند معامل قدرة متقدم: المسافة الرأسية بين \\(V_{ph}\\) ورأس \\(E_{ph}\\) (\\(=E\\sin\\delta\\)) تتناسب مع القدرة P، ورأس \\(E_{ph}\\) على قوس دائرة',draw:()=>{const m=motor(208,255,2.5,13690);return box(phSVG({view:{x0:-20,x1:290,y0:-110,y1:90},H:300,vecs:onePoint(208,m),arcs:phArcs(m),circles:[{r:255}],brk:[{a:[226,0],b:[226,m.Ec.im],lab:'∝P'}]}),520)}},
  {fig:'(4-6) ب',ref:'ص 133',caption:'تأثير زيادة الحمل: \\(E_{ph1}\\)…\\(E_{ph4}\\) متساوية الطول ورؤوسها على دائرة وتزداد δ، والتيارات \\(I_{ph1}\\) (متقدم) … \\(I_{ph4}\\) (متأخر) يطول كل منها عن السابق (القدرات: 13.69 و24.88 و36.8 و48 kW — أرقام توضيحية بآلة مثال 4-1)',draw:()=>box(fig46b(),540)},
  {h:'مثال (4-1)',ref:'ص 133',html:`<p>«محرك تزامني ملفاته موصلة على شكل دلتا، جهد المصدر <span class="ltr">208 V</span> والتردد <span class="ltr">60 Hz</span>، ممانعته التزامنية <span class="ltr">2.5 Ω</span> ومقاومة ملفات المنتج مهملة، المفاقيد الحديدية <span class="ltr">1.0 kw</span> ومفاقيد الاحتكاك <span class="ltr">1.5 kw</span>، يدير حملاً قدرته <span class="ltr">15 hp</span> عند معامل قدرة 0.8 متقدماً:</p>
   <p>أ) ارسم المخطط الاتجاهي للمحرك. ب) أوجد قيم \\(I_L\\)، \\(I_{Ph}\\)، \\(E_{Ph}\\). جـ) عندما يزداد الحمل إلى <span class="ltr">30 hp</span> وضح سلوك المحرك باستخدام المخطط الاتجاهي. د) أوجد قيم \\(I_L\\)، \\(I_{Ph}\\)، \\(E_{Ph}\\) بعد زيادة الحمل. هـ) احسب معامل القدرة بعد زيادة الحمل.»</p>
   <p><b>الحل (ص 134–136):</b> أ) المخطط الاتجاهي في الشكل (4-7)أ. ب) \\(P_o=11.19\\) kw، \\(P_{in}=13.69\\) kw، \\(I_L=47.5\\) A، \\(I_{ph}=27.4\\angle{36.87^\\circ}\\) A، \\(E_{Ph}=249.1-j54.8=255\\angle{-12.4^\\circ}\\) V.</p>
   <p>جـ) «عند زيادة الحمل إلى 30 hp فإن العضو الدوار سيتباطأ قليلاً وعندها تزداد الزاوية (δ) بين المجالين مما يعني ازدياد عزم المحرك لكي تصل سرعته إلى وضعها السابق وهذا يعني انفراج الزاوية بين \\(V_{Ph}\\) و \\(E_{Ph}\\) كما هو موضح في المخطط الاتجاهي في الشكل رقم (4-7)ب.»</p>
   <p>د) \\(P_{in}=24.88\\) kw، و«بعد زيادة الحمل قيمة \\(E_{Ph}\\) لم تتغير وإنما ازدادت الزاوية (δ)» تُحسب بالمعادلة (3-15) <b>[من الوحدة الثالثة ص 108، مقلوبة لإيجاد δ]</b>: $$\\delta=\\sin^{-1}\\left(\\frac{X_SP}{3V_{Ph}E_{Ph}}\\right)=\\sin^{-1}(0.391)=23^\\circ$$ \\(E_{Ph}=255\\angle{-23^\\circ}\\)، \\(I_{Ph}=41.2\\angle{15^\\circ}\\) A، \\(I_L=71.4\\) A. هـ) \\(\\cos\\theta=\\cos15^\\circ=0.966\\).</p>
   <p>الحل خطوة بخطوة في تبويب «الأمثلة المحلولة».</p>`},
  {fig:'(4-7) أ',ref:'ص 135',caption:'المخطط الاتجاهي للمحرك في مثال (4-1) عند 15 hp: \\(I_{ph}=27.4\\angle{36.87^\\circ}\\)، \\(E_{ph}=255\\angle{-12.4^\\circ}\\)',draw:()=>{const m=motor(208,255,2.5,13690);return box(phSVG({view:{x0:-20,x1:290,y0:-80,y1:90},H:290,vecs:onePoint(208,m),arcs:phArcs(m)}),520)}},
  {fig:'(4-7) ب',ref:'ص 135',caption:'بعد زيادة الحمل إلى 30 hp: \\(E\'_{ph}\\) بنفس الطول وزاوية أكبر (−23°)، والتيار الجديد \\(I\'_{ph}=41.2\\angle{15^\\circ}\\) أطول وأقل تقدماً',draw:()=>{const a=motor(208,255,2.5,13690),b=motor(208,255,2.5,24880),kI=1.6;const v=onePoint(208,a).map(x=>Object.assign({},x,{w:1.8}));const vb=onePoint(208,b,{sfx:"'"});
    return box(phSVG({view:{x0:-20,x1:290,y0:-115,y1:90},H:310,vecs:v.concat(vb.slice(1)),circles:[{r:255}],lines:[{a:[a.I.re*kI,0],b:[a.I.re*kI,a.I.im*kI]},{a:[b.I.re*kI,0],b:[b.I.re*kI,b.I.im*kI]}]}),520)}},
  {err:'ص 134 (وكذلك ص 138): صيغة تيار الخط مكتوبة \\(I_L=P_{in}/(\\sqrt3\\,V_{ph}\\cos\\theta)\\). الصيغة العامة تستعمل <b>جهد الخط</b> \\(V_L\\): \\(I_L=P_{in}/(\\sqrt3\\,V_L\\cos\\theta)\\). النتيجة صحيحة هنا فقط لأن التوصيل دلتا فجهد الخط = جهد الوجه = 208 V. أما في توصيل النجمة (كالتمرين 9) فيجب الانتباه.'},
  {err:'ص 136: كُتب معامل القدرة بعد زيادة الحمل <span class="ltr">cos(15°) = 0.966</span> دون كلمة «متقدم»، مع أن زاوية التيار <span class="ltr">+15°</span> موجبة، أي أن التيار ما زال متقدماً. وفي صيغة \\(I_{Ph}=(V_{Ph}-E_{Ph})/jX_S\\) بعد التغيير كُتب \\(E_{Ph}\\) بلا شرطة والمقصود الجهد بالزاوية الجديدة (اختلاف ترميز فقط).'},
  {err:'ص 136: طُبع \\(208\\angle{0^\\circ}-255\\angle{-23^\\circ}=103.1\\angle{105^\\circ}\\)، والقيمة الدقيقة <span class="ltr">103.16</span> أي <b>103.2</b> بالتقريب الصحيح. فيصبح \\(I_{Ph}=41.3\\angle{15^\\circ}\\) A و \\(I_L=71.5\\) A بدلاً من 41.2 و71.4. معامل القدرة لا يتغير (0.966). في «الأمثلة المحلولة» تجد الحل بقيمة الكتاب والحل المصحح.'},
  {err:'ص 133: «ممانعته التزامنية <b>له</b> 2.5 Ω» — كلمة «له» زائدة (خطأ صياغة).'}
 ],
 lab:(el)=>{
  let hp=15,E=255,ghosts=[],lastS='',seen30=0,seenLag=0,seenLost=0;
  el.innerHTML=`<div class="grid">
   <div class="panel c7"><h2>مخطط اتجاهي حي: تغيير الحمل وتيار المجال ثابت <small>مبني على الشكلين (4-6) ص 133 و(4-7) ص 135</small></h2>
    <div class="svgbox" id="l4ph" style="max-width:560px;margin-inline:auto"></div>
    <div class="legend"><span><i style="background:var(--fg)"></i>V<sub>ph</sub></span><span><i style="background:var(--live)"></i>E<sub>ph</sub></span><span><i style="background:var(--blue)"></i>jX<sub>S</sub>I<sub>ph</sub></span><span><i style="background:var(--on)"></i>I<sub>ph</sub> (مقياس مختلف)</span><span><i style="background:var(--stop)"></i>∝P = E sin δ</span></div></div>
   <div class="panel c5"><h2>المتغيرات <small>آلة مثال (4-1)</small></h2>
    ${sl('l4hp','الحمل على العمود',0,90,0.5,hp)}${sl('l4e','الجهد الداخلي E<sub>ph</sub> (يحدده تيار المجال الثابت)',150,350,1,E)}
    <div class="sm-row"><button class="btn" data-hp="15">15 hp</button><button class="btn" data-hp="30">30 hp</button><button class="btn" id="l4g">ثبّت الحالة على الرسم</button><button class="btn" id="l4c">امسح</button></div>
    <div id="l4chip" style="margin-top:10px"></div>
    <div class="facts">${fact('P<sub>in</sub> = P<sub>o</sub> + 2.5 kW','l4p')}${fact('δ','l4d')}${fact('I<sub>ph</sub>','l4i')}${fact('I<sub>L</sub> = √3 I<sub>ph</sub>','l4il')}${fact('معامل القدرة (↑ متقدم، ↓ متأخر)','l4pf')}${fact('أقصى حمل قبل فقد التزامن','l4mx')}</div>
    <p class="sub"><span class="ltr">V = 208 V</span> دلتا، <span class="ltr">X<sub>S</sub> = 2.5 Ω</span>، المفاقيد <span class="ltr">1.0 + 1.5 kW</span> كما في المثال. الأرقام محسوبة بلا تقريب الخطوات.</p></div>
   <div class="panel c12"><h2>جرّب خطوة خطوة</h2><ol class="steps" id="l4steps"></ol></div></div>`;
  B.math(el);const $=s=>el.querySelector(s);
  const cur=()=>{const P=(hp*0.746+2.5)*1000;return {P,m:motor(208,E,2.5,P)}};
  $('#l4hp').oninput=e=>{hp=+e.target.value};$('#l4e').oninput=e=>{E=+e.target.value;ghosts=[]};
  el.querySelectorAll('[data-hp]').forEach(b=>b.onclick=()=>{hp=+b.dataset.hp;$('#l4hp').value=hp});
  $('#l4g').onclick=()=>{const c=cur();if(c.m.ok&&ghosts.length<4){ghosts.push(c.m);lastS=''}};$('#l4c').onclick=()=>{ghosts=[];lastS=''};
  const steps=stepsUI($('#l4steps'),[
   {t:'نقطة البداية: مثال (4-1)',x:'اضغط «15 hp» واترك <span class="ltr">E = 255 V</span>: <span class="ltr">I<sub>ph</sub> ≈ 27.4∠36.9° A</span> متقدم، و <span class="ltr">δ ≈ −12.4°</span>. اضغط «ثبّت الحالة».',done:()=>Math.abs(hp-15)<0.3&&E===255&&ghosts.length>=1},
   {t:'زد الحمل إلى 30 hp',x:'اضغط «30 hp» ثم «ثبّت الحالة»: رأس E يتحرك على الدائرة نفسها و δ ≈ −23°، والتيار أطول وأقل تقدماً (≈ 41.3∠15° A).',done:()=>{if(Math.abs(hp-30)<0.3&&ghosts.length>=2)seen30=1;return seen30}},
   {t:'استمر في زيادة الحمل',x:'ارفع الحمل حتى يصبح التيار متأخراً عن الجهد (نحو 50 hp أو أكثر)، كما في I<sub>ph4</sub> في الشكل (4-6)ب.',done:()=>seenLag},
   {t:'حد فقد التزامن',x:'ارفع الحمل فوق الحد المكتوب في «أقصى حمل»: δ تتجاوز −90° ولا يوجد حل، أي يفقد المحرك التزامن.',done:()=>seenLost},
   {t:'قلل الحمل',x:'أنقص الحمل: يحدث العكس تماماً — تقل δ ويقل التيار ويعود متقدماً (ص 132).'}]);
  loopOn(el,()=>{$('#l4hp-v').textContent=fm(hp,1)+' hp';$('#l4e-v').textContent=E+' V';
   const sg=[hp,E,ghosts.length].join();if(sg===lastS){steps.check();return}lastS=sg;const c=cur(),m=c.m;
   const Pm=3*208*E/2.5;$('#l4mx').textContent=fm((Pm/1000-2.5)/0.746,1)+' hp';$('#l4p').textContent=fm(c.P/1000,2)+' kW';
   if(!m.ok){seenLost=1;$('#l4chip').innerHTML=chip('فقد التزامن: الحمل أكبر من القدرة القصوى','bad');['#l4d','#l4i','#l4il','#l4pf'].forEach(k=>$(k).textContent='—');
    $('#l4ph').innerHTML=phSVG({view:{x0:-30,x1:300,y0:-330,y1:150},H:420,vecs:[{a:[0,0],b:[208,0],col:'--fg',lab:sb('V','ph'),w:2.8},{a:[0,0],b:[0,-E],col:'--stop',lab:'δ = −90°',w:2,dash:'5 4'}],circles:[{r:E}]});steps.check();return}
   if(m.lead<0)seenLag=1;
   $('#l4chip').innerHTML=chip('معامل القدرة '+pfT(m),pfC(m));
   $('#l4d').textContent=fm(m.d,2)+'°';$('#l4i').textContent=fm(m.Im,2)+'∠'+fm(m.th,1)+'° A';$('#l4il').textContent=fm(R3*m.Im,2)+' A';$('#l4pf').textContent=fm(m.pf,3)+(m.lead>0?' ↑':m.lead<0?' ↓':'');
   const kI=1.3;let vecs=[];ghosts.forEach((g,i)=>{const I=pol(g.Im*kI,g.th);vecs.push({a:[0,0],b:[g.Ec.re,g.Ec.im],col:'--muted',w:1.4,lab:sb('E','ph'+(i+1))},{a:[0,0],b:[I.re,I.im],col:'--muted',w:1.4,lab:sb('I','ph'+(i+1))})});
   vecs=vecs.concat(onePoint(208,m,{kI}));
   $('#l4ph').innerHTML=phSVG({view:{x0:-30,x1:Math.max(300,E+20),y0:-Math.max(200,E*0.85),y1:150},H:420,vecs,arcs:phArcs(m),circles:[{r:E}],brk:[{a:[Math.max(232,E*0.95),0],b:[Math.max(232,E*0.95),m.Ec.im],lab:'∝P'}],lines:[{a:[m.I.re*kI,0],b:[m.I.re*kI,m.I.im*kI],col:'--on'}]});
   steps.check()});
 },
 examples:[
  {title:'مثال (4-1) — الحل بقيم الكتاب',ref:'ص 133–136',q:'<p>«محرك تزامني ملفاته موصلة على شكل دلتا، جهد المصدر 208 V والتردد 60 Hz، ممانعته التزامنية 2.5 Ω ومقاومة ملفات المنتج مهملة، المفاقيد الحديدية 1.0 kw ومفاقيد الاحتكاك 1.5 kw، يدير حملاً قدرته 15 hp عند معامل قدرة 0.8 متقدماً … عندما يزداد الحمل إلى 30 hp …» (أ و جـ: المخطط الاتجاهي في الشكل 4-7 وفي المختبر).</p>',
   given:G41,solve:(g,B,isBook)=>solveLoad(g,{hp:1,bk:isBook?BK41:null}).st,
   note:'<b>ملاحظة على الكتاب:</b> بقيم الكتاب تعرض الحاسبة الرقم المطبوع <span class="ltr">103.1∠105°</span> (والدقيق 103.16 أي 103.2). إذا غيّرت أي رقم تحسب الحاسبة هذه الخطوة بالتقريب الصحيح. وصيغة تيار الخط في الكتاب مكتوبة بجهد الوجه؛ تصح هنا لأن التوصيل دلتا.'},
  {title:'مثال (4-1) — الحل المصحح',ref:'ص 133–136',q:'<p>نفس المثال بتقريب صحيح للمقدار <span class="ltr">|208∠0° − 255∠−23°| = 103.2</span>. (حساب مصحح — ليس من الكتاب.)</p>',
   given:G41,solve:(g)=>solveLoad(g,{hp:1}).st,note:'الفرق عن الكتاب 0.1 A في تيار المنتج (41.3 بدلاً من 41.2) و0.1 A في تيار الخط (71.5 بدلاً من 71.4)؛ ومعامل القدرة نفسه 0.966 متقدم.'}
 ],
 quiz:[
  {q:'عند زيادة الحمل على محرك تزامني وتيار المجال ثابت، ماذا يحدث للسرعة بعد الاستقرار؟',o:['تقل بنسبة الحمل','تعود إلى السرعة التزامنية','تزيد','يتوقف المحرك دائماً'],c:1,e:'ص 132: تقل لحظياً ثم تعود إلى السرعة التزامنية عند δ أكبر.'},
  {q:'عند زيادة الحمل مع ثبات تيار المجال، زاوية العزم δ:',o:['تقل','تزداد','لا تتغير','تصبح صفراً'],c:1,e:'ص 132.'},
  {q:'لماذا تبقى قيمة E<sub>Ph</sub> ثابتة عند تغير الحمل في هذا البند؟',o:['لأن السرعة ثابتة وتيار المجال لا يتغير','لأن الجهد يقل','لأن التيار ثابت','لأن δ ثابتة'],c:0,e:'ص 133: بسبب عدم تغير قيمة تيار المجال (والسرعة ثابتة).'},
  {q:'في الشكل (4-6) رأس المتجه E<sub>Ph</sub> يتحرك على:',o:['خط أفقي','خط رأسي','دائرة نصف قطرها |E<sub>Ph</sub>|','نقطة ثابتة'],c:2,e:'ص 133.'},
  {q:'في مثال (4-1) القدرة الداخلة عند 15 hp تساوي:',o:['11.19 kw','13.69 kw','15 kw','24.88 kw'],c:1,e:'11.19 + 0 + 1.0 + 1.5 = 13.69 kw.'},
  {q:'في مثال (4-1) بعد زيادة الحمل إلى 30 hp تصبح δ:',o:['12.4°','23°','36.87°','90°'],c:1,e:'sin⁻¹(0.391) = 23°.'},
  {q:'صيغة الكتاب I<sub>L</sub> = P<sub>in</sub>/(√3·V<sub>ph</sub>·cosθ) أعطت نتيجة صحيحة في المثال لأن:',o:['المحرك موصل دلتا فجهد الخط = جهد الوجه','المقاومة مهملة','التردد 60 Hz','معامل القدرة متقدم'],c:0,e:'الصيغة العامة بجهد الخط؛ في الدلتا V_L = V_ph.'},
  {q:'مع استمرار زيادة الحمل (وتيار المجال ثابت) يتحول تيار المنتج تدريجياً:',o:['من متأخر إلى متقدم','من متقدم إلى متأخر ويكبر','يبقى بنفس الزاوية','يصغر'],c:1,e:'الشكل (4-6)ب: I_ph1 متقدم … I_ph4 متأخر، وكل تيار أطول من السابق.'}
 ]
});

/* =============================== Lesson 4.5 — field change at constant load =============================== */
function fig48b(){const P=13690,Es=[165,215.1,250,292],kI=1.4;let vecs=[{a:[0,0],b:[208,0],col:'--fg',lab:sb('V','ph'),w:2.8}],lines=[];let y=0,x=0;
  Es.forEach((E,i)=>{const m=motor(208,E,2.5,P),I=pol(m.Im*kI,m.th),c=['--live','--on','--blue','--stop'][i];y=m.Ec.im;x=I.re;
   vecs.push({a:[0,0],b:[m.Ec.re,m.Ec.im],col:'--muted',lab:sb('E','ph'+(i+1)),w:1.8},{a:[m.Ec.re,m.Ec.im],b:[208,0],col:'--muted',w:1.1,dash:'4 3'},{a:[0,0],b:[I.re,I.im],col:c,lab:sb('I','ph'+(i+1)),w:2.4})});
  lines.push({a:[-10,y],b:[300,y]},{a:[x,-10],b:[x,140]});
  return phSVG({view:{x0:-20,x1:310,y0:-90,y1:140},H:330,vecs,lines,brk:[{a:[0,-70],b:[x,-70],lab:'∝P (ثابت)'},{a:[296,0],b:[296,y],lab:'∝P',anc:'end',dx:-6}]})}
B.lesson({
 id:'u4-l5',unit:4,order:5,pages:'136–140',
 title:'سلوك المحرك عند تغيير تيار المجال مع ثبات الحمل',
 summary:'بزيادة تيار المجال يزداد E والقدرة ثابتة، فيقل تيار المنتج أولاً حتى معامل قدرة = 1 ثم يزداد متقدماً: المحرك يتحول من حمل حثي إلى حمل سعوي. المثال (4-2) بأرقام الكتاب.',
 theory:[
  {h:'سلوك المحرك التزامني في حالة تغيير تيار المجال',ref:'ص 136–137',html:`<p>«لكي يتضح تأثير التغيير في تيار المجال على سلوك المحرك التزامني، افترض أن محركاً تزامنياً يعمل عند معامل قدرة متأخر كما هو موضح في الشكل (4-8) أ، عند زيادة تيار المجال \\(I_F\\) فإن \\(E_{Ph}\\) سيزداد أما سرعة الدوران وعزم المحرك فلن يتغيرا، هذا يعني أنه كلما زادت قيمة \\(I_F\\) فإن \\(E_{Ph}\\) سيزداد مع ثبات القدرة الخارجة من المحرك، وعليه فإن زيادة \\(E_{Ph}\\) تعني <b>النقص في قيمة \\(I_{Ph}\\) أولاً ثم يزداد بعد ذلك</b> كما هو موضح في الشكل (4-8)ب.»</p>
   <p>«ويلاحظ أنه عند القيم المنخفضة للجهد الداخلي \\(E_{Ph}\\) يكون تيار المنتج متأخراً وبالتالي نجد أن المحرك يعمل كأنه <b>حمل حثي</b> <span class="ltr">Inductive Load</span> بينما عند القيم المرتفعة للجهد الداخلي \\(E_{Ph}\\) يكون تيار المنتج متقدماً وبالتالي نجد أن المحرك يعمل كأنه <b>حمل سعوي</b> <span class="ltr">Capacitive Load</span>، هذا السلوك للمحرك التزامني موضح في المثال (4-2).»</p>`},
  {fig:'(4-8) أ',ref:'ص 137',caption:'محرك يعمل عند معامل قدرة متأخر: \\(I_{ph}\\) تحت \\(V_{ph}\\)',draw:()=>{const m=motor(208,182,2.5,13690);return box(phSVG({view:{x0:-20,x1:240,y0:-110,y1:60},H:280,vecs:onePoint(208,m),arcs:phArcs(m)}),500)}},
  {fig:'(4-8) ب',ref:'ص 137',caption:'تأثير زيادة تيار المجال والقدرة ثابتة: رؤوس \\(E_{ph1}<E_{ph2}<E_{ph3}<E_{ph4}\\) على خط أفقي واحد (المسافة إليه ∝P ثابتة)، ورؤوس التيارات على خط رأسي واحد (∝P ثابت): \\(I_{ph1}\\) متأخر، \\(I_{ph2}\\) على اتجاه \\(V_{ph}\\) وأقصرها، \\(I_{ph3}\\) و\\(I_{ph4}\\) متقدمان (أرقام توضيحية بآلة المثال)',draw:()=>box(fig48b(),540)},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> لماذا الخطان ثابتان؟ القدرة \\(P=3V_{ph}I_{ph}\\cos\\theta\\) و\\(V_{ph}\\) ثابت، فالمسقط الأفقي للتيار \\(I\\cos\\theta\\) ثابت: رأس التيار على خط رأسي. وأيضاً \\(P=3V_{ph}E_{ph}\\sin\\delta/X_S\\)، فالمسافة الرأسية \\(E\\sin\\delta\\) ثابتة: رأس E على خط أفقي. هذه هي نقطة على منحنى V من الدرس الثالث، والمختبر يرسمها بجانب المخطط.'},
  {h:'مثال (4-2)',ref:'ص 137',html:`<p>«افترض أن المحرك التزامني في المثال السابق يدير حملاً قدرته <span class="ltr">15 hp</span> عند معامل قدرة 0.85 متأخر: أ) ارسم المخطط الاتجاهي للمحرك. ب) أوجد قيم \\(I_L\\)، \\(I_{Ph}\\)، \\(E_{Ph}\\). جـ) إذا ازداد تيار المجال بنسبة 25% وضح سلوك المحرك باستخدام المخطط الاتجاهي ثم أوجد قيم \\(I_L\\)، \\(I_{Ph}\\)، \\(E_{Ph}\\) بعد زيادة تيار المجال. د) احسب معامل القدرة بعد زيادة تيار المجال.»</p>
   <p><b>الحل (ص 138–140):</b> ب) \\(P_{in}=13.69\\) kw، \\(I_L=44.7\\) A، \\(I_{ph}=25.8\\angle{-31.8^\\circ}\\) A، \\(E_{Ph}=174-j54.8=182\\angle{-17.5^\\circ}\\) V.</p>
   <p>جـ) «عند زيادة تيار المجال \\(I_F\\) بنسبة 25% فإن الفيض المغناطيسي سيزداد بنفس النسبة وبالتالي الجهد الداخلي \\(E_{Ph}\\) سيزداد بنفس النسبة»: \\(E'_{Ph}=1.25(182)=227.5\\) V. «ورغم زيادة \\(E_{Ph}\\) إلا أن القدرة الخارجة من المحرك تبقى ثابتة وتتناسب مع طول المتجه (\\(E_{Ph}\\sin\\delta\\))»:</p>
   $$E_{Ph}\\sin\\delta=E'_{Ph}\\sin\\delta' \\;\\Rightarrow\\; \\delta'=\\sin^{-1}\\left(\\frac{182}{227.5}\\sin(-17.5)\\right)=\\sin^{-1}(-0.24)=-13.9^\\circ$$
   <p>\\(I_{Ph}=22.5\\angle{13.2^\\circ}\\) A، \\(I_L=38.97\\) A. د) \\(\\cos\\theta=\\cos(13.2^\\circ)=0.974\\). الحل خطوة بخطوة في تبويب «الأمثلة المحلولة».</p>`},
  {fig:'(4-9)',ref:'ص 140',caption:'مثال (4-2): \\(I_{ph}\\) (قبل) متأخر و\\(I\'_{ph}\\) (بعد) متقدم ورأساهما على خط رأسي واحد؛ \\(E_{ph}\\) بزاوية δ و\\(E\'_{ph}\\) الأطول بزاوية δ\' ورأساهما على خط أفقي واحد؛ والمتجهان \\(jX_SI_{ph}\\) و\\(jX_SI\'_{ph}\\) من رأسيهما إلى رأس \\(V_{ph}\\)',draw:()=>{const a=motor(208,182,2.5,13690),b=motor(208,227.5,2.5,13690),kI=1.6;const va=onePoint(208,a),vb=onePoint(208,b,{sfx:"'"});
    return box(phSVG({view:{x0:-20,x1:290,y0:-90,y1:80},H:300,vecs:va.concat(vb.slice(1)),lines:[{a:[-10,a.Ec.im],b:[280,a.Ec.im]},{a:[a.I.re*kI,-50],b:[a.I.re*kI,60]}],brk:[{a:[0,62],b:[a.I.re*kI,62],lab:'∝P'},{a:[270,0],b:[270,a.Ec.im],lab:'∝P',anc:'end',dx:-6}]}),520)}},
  {err:'ص 138: صيغة تيار الخط مكتوبة بجهد الوجه \\(V_{ph}\\) والصحيح عموماً بجهد الخط \\(V_L\\)؛ النتيجة صحيحة هنا لأن التوصيل دلتا (انظر الدرس السابق).'},
  {err:'ص 140: كُتب معامل القدرة بعد زيادة تيار المجال <span class="ltr">0.974</span> دون كلمة «متقدم»، مع أن الزاوية <span class="ltr">+13.2°</span> موجبة: تغيّر معامل القدرة من <b>0.85 متأخر</b> إلى <b>0.974 متقدم</b>.'},
  {err:'ص 139: الكتاب يفترض أن E يتناسب خطياً مع تيار المجال (زيادة 25% في \\(I_F\\) ⇒ زيادة 25% في E)، أي يتجاهل <b>التشبع المغناطيسي</b>، مع أن الشكل (4-5) نفسه يُظهر «منطقة التشبع». في آلة حقيقية قريبة من التشبع تكون زيادة E أقل من 25%. الحاسبة تتبع افتراض الكتاب.'},
  {err:'ص 139: طُبع \\(208\\angle{0^\\circ}-227.5\\angle{-13.9^\\circ}=56.2\\angle{103.2^\\circ}\\)، والقيمة الدقيقة <span class="ltr">56.14</span> أي <b>56.1</b>. فيصبح \\(I_{Ph}=22.4\\angle{13.2^\\circ}\\) A و\\(I_L=38.80\\) A بدلاً من 22.5 و38.97؛ ومعامل القدرة لا يتغير (0.974). وفي الصيغة نفسها كُتب \\(E_{Ph}\\) والمقصود \\(E\'_{Ph}\\) (ترميز فقط).'}
 ],
 lab:(el)=>{
  let pct=100,Pin=13.69,lastS='',seenU=0,seenLead=0,seen125=0,seenLow=0;const E0=182;
  el.innerHTML=`<div class="grid">
   <div class="panel c7"><h2>مخطط اتجاهي حي: تغيير تيار المجال والحمل ثابت <small>مبني على الشكلين (4-8) ص 137 و(4-9) ص 140</small></h2>
    <div class="svgbox" id="l5ph" style="max-width:560px;margin-inline:auto"></div>
    <div class="legend"><span><i style="background:var(--muted)"></i>قبل (100%)</span><span><i style="background:var(--live)"></i>E<sub>ph</sub> الآن</span><span><i style="background:var(--on)"></i>I<sub>ph</sub> الآن</span><span><i style="background:var(--blue)"></i>jX<sub>S</sub>I<sub>ph</sub></span></div></div>
   <div class="panel c5"><h2>المتغيرات <small>آلة مثال (4-2)</small></h2>
    ${sl('l5if','تيار المجال (نسبة من قيمته في مثال 4-2)',50,200,1,pct)}${sl('l5p','القدرة الداخلة الثابتة P<sub>in</sub>',2,30,0.01,Pin)}
    <div class="sm-row"><button class="btn" data-pc="100">قبل: 100%</button><button class="btn" data-pc="125">بعد: +25%</button></div>
    <div id="l5chip" style="margin-top:10px"></div>
    <div class="facts">${fact('E<sub>ph</sub> = E<sub>0</sub> × النسبة','l5e')}${fact('δ','l5d')}${fact('E sin δ (ثابت)','l5es')}${fact('I<sub>ph</sub>','l5i')}${fact('I cos θ (ثابت)','l5ic')}${fact('معامل القدرة (↑ متقدم، ↓ متأخر)','l5pf')}</div>
    <p class="sub"><span class="ltr">E<sub>0</sub> = 182 V</span> عند 100% (من المثال)، و E يتناسب خطياً مع تيار المجال كما يفترض الكتاب (يتجاهل التشبع).</p></div>
   <div class="panel c6"><h2>النقطة نفسها على منحنى V <small>ربط بالشكل (4-3)</small></h2><div class="svgbox" id="l5v"></div></div>
   <div class="panel c6"><h2>جرّب خطوة خطوة</h2><ol class="steps" id="l5steps"></ol></div></div>`;
  B.math(el);const $=s=>el.querySelector(s);
  $('#l5if').oninput=e=>{pct=+e.target.value};$('#l5p').oninput=e=>{Pin=+e.target.value};
  el.querySelectorAll('[data-pc]').forEach(b=>b.onclick=()=>{pct=+b.dataset.pc;$('#l5if').value=pct});
  const steps=stepsUI($('#l5steps'),[
   {t:'نقطة البداية: مثال (4-2)',x:'اضغط «قبل: 100%» و <span class="ltr">P<sub>in</sub> = 13.69 kW</span>: <span class="ltr">I<sub>ph</sub> ≈ 25.8∠−31.8° A</span> متأخر — المحرك حمل حثي.',done:()=>pct===100&&Math.abs(Pin-13.69)<0.01},
   {t:'زد تيار المجال حتى معامل قدرة = 1',x:'ارفع النسبة ببطء: رأس E ينزلق على الخط الأفقي، ورأس التيار على الخط الرأسي، والتيار يقصر حتى يصبح على اتجاه V<sub>ph</sub> (نحو 118%).',done:()=>seenU},
   {t:'مثال (4-2) جـ: +25%',x:'اضغط «بعد: +25%»: <span class="ltr">E\' = 227.5 V</span> و <span class="ltr">δ\' ≈ −13.9°</span> و <span class="ltr">I ≈ 22.5∠13.2° A</span> متقدم (حمل سعوي).',done:()=>{if(pct===125)seen125=1;return seen125}},
   {t:'زد أكثر',x:'ارفع النسبة إلى 170% أو أكثر: التيار يطول وهو متقدم أكثر — الفرع الأيمن من منحنى V.',done:()=>{if(pct>=170)seenLead=1;return seenLead}},
   {t:'اخفض تيار المجال كثيراً',x:'اخفض النسبة إلى أقل من 70%: التيار متأخر جداً، وتقترب δ من −90°؛ تحت حد معين لا يستطيع المحرك حمل القدرة فيفقد التزامن.',done:()=>{if(pct<70)seenLow=1;return seenLow}}]);
  loopOn(el,()=>{$('#l5if-v').textContent=pct+' %';$('#l5p-v').textContent=fm(Pin,2)+' kW';
   const sg=[pct,Pin].join();if(sg===lastS){steps.check();return}lastS=sg;
   const E=E0*pct/100,P=Pin*1000,m=motor(208,E,2.5,P),m0=motor(208,E0,2.5,P),kI=1.6;$('#l5e').textContent=fm(E,1)+' V';
   const Ifs=[],Is=[];for(let p=50;p<=200;p+=1){const mm=motor(208,E0*p/100,2.5,P);if(mm.ok)Ifs.push([p,mm.Im])}
   $('#l5v').innerHTML=plotSVG({w:520,h:260,x0:50,x1:200,y0:0,y1:Math.max(60,...Ifs.map(q=>q[1]))*1.05,xt:[50,100,150,200],yt:[0,20,40,60,80,100],xf:v=>v+'%',xl:'IF',yl:'Iph (A)',clip:'l5vc',aria:'منحنى V للحمل الثابت',
     series:[{pts:Ifs,col:'--fg'}],extra:(X,Y)=>(m.ok?`<circle cx="${fx(X(pct))}" cy="${fx(Y(m.Im))}" r="6.5" fill="var(--live)" stroke="var(--surface)" stroke-width="2"/>`:'')+arT(X(70),Y(5),'حمل حثي',{fs:12,col:'--live'})+arT(X(180),Y(5),'حمل سعوي',{fs:12,col:'--blue-ink'})});
   if(!m.ok){$('#l5chip').innerHTML=chip('E صغير جداً لهذا الحمل: فقد التزامن','bad');['#l5d','#l5es','#l5i','#l5ic','#l5pf'].forEach(k=>$(k).textContent='—');$('#l5ph').innerHTML='';steps.check();return}
   if(Math.abs(m.th)<1.2)seenU=1;
   $('#l5chip').innerHTML=m.lead>0?chip('حمل سعوي — معامل قدرة متقدم','blue'):m.lead<0?chip('حمل حثي — معامل قدرة متأخر','warn'):chip('معامل القدرة = 1 — أقل تيار','ok');
   $('#l5d').textContent=fm(m.d,2)+'°';$('#l5es').textContent=fm(E*Math.sin(-m.d*D),2)+' V';$('#l5i').textContent=fm(m.Im,2)+'∠'+fm(m.th,1)+'° A';$('#l5ic').textContent=fm(m.Im*m.pf,2)+' A';$('#l5pf').textContent=fm(m.pf,3)+(m.lead>0?' ↑':m.lead<0?' ↓':'');
   let vecs=[];if(m0.ok&&pct!==100){const I0=pol(m0.Im*kI,m0.th);vecs.push({a:[0,0],b:[m0.Ec.re,m0.Ec.im],col:'--muted',w:1.4},{a:[0,0],b:[I0.re,I0.im],col:'--muted',w:1.4})}
   vecs=vecs.concat(onePoint(208,m,{kI}));const yl=m.Ec.im,xl=m.I.re*kI;
   $('#l5ph').innerHTML=phSVG({view:{x0:-30,x1:Math.max(300,E+20),y0:Math.min(-100,yl-30),y1:Math.max(130,m.I.im*kI+20)},H:400,vecs,arcs:phArcs(m),lines:[{a:[-20,yl],b:[Math.max(300,E+20),yl]},{a:[xl,yl-20],b:[xl,200]}]});
   steps.check()});
 },
 examples:[
  {title:'مثال (4-2) — الحل بقيم الكتاب',ref:'ص 137–140',q:'<p>«افترض أن المحرك التزامني في المثال السابق يدير حملاً قدرته 15 hp عند معامل قدرة 0.85 متأخر … إذا ازداد تيار المجال بنسبة 25% …» (أ: المخطط الاتجاهي في الشكل 4-9 وفي المختبر).</p>',
   given:G42,solve:(g,B,isBook)=>solveField(g,{bk:isBook?BK42:null}).st,
   note:'<b>ملاحظة على الكتاب:</b> بقيم الكتاب تعرض الحاسبة الرقم المطبوع <span class="ltr">56.2∠103.2°</span> (والدقيق 56.14 أي 56.1). والحساب يفترض أن E يتناسب خطياً مع تيار المجال (يتجاهل التشبع)، وهذا افتراض الكتاب.'},
  {title:'مثال (4-2) — الحل المصحح',ref:'ص 137–140',q:'<p>نفس المثال بتقريب صحيح للمقدار <span class="ltr">|208∠0° − 227.5∠−13.9°| = 56.1</span>. (حساب مصحح — ليس من الكتاب.)</p>',
   given:G42,solve:(g)=>solveField(g,{}).st,note:'الفرق عن الكتاب: تيار المنتج 22.4 A بدلاً من 22.5 A، وتيار الخط 38.80 A بدلاً من 38.97 A؛ ومعامل القدرة نفسه 0.974 متقدم.'}
 ],
 quiz:[
  {q:'عند زيادة تيار المجال والحمل ثابت، ماذا يحدث لـ E<sub>Ph</sub> والسرعة؟',o:['E يزداد والسرعة ثابتة','E يقل والسرعة تزيد','كلاهما ثابت','E ثابت والسرعة تقل'],c:0,e:'ص 136: E_Ph سيزداد أما سرعة الدوران وعزم المحرك فلن يتغيرا.'},
  {q:'مع زيادة E<sub>Ph</sub> (والقدرة ثابتة) فإن I<sub>Ph</sub>:',o:['يزداد دائماً','يقل دائماً','يقل أولاً ثم يزداد','لا يتغير'],c:2,e:'ص 137 والشكل (4-8)ب.'},
  {q:'عند القيم المنخفضة لـ E<sub>Ph</sub> يعمل المحرك كأنه:',o:['حمل سعوي','حمل حثي','مقاومة فقط','مولد'],c:1,e:'ص 137: تيار المنتج متأخر.'},
  {q:'في الشكل (4-8)ب رؤوس متجهات E<sub>ph</sub> تقع على:',o:['دائرة','خط أفقي واحد لأن E sin δ ∝ P ثابت','خط رأسي','نقطة واحدة'],c:1,e:'الشكل (4-8)ب ص 137.'},
  {q:'في مثال (4-2) زاد تيار المجال 25%، فأصبح E\'<sub>Ph</sub>:',o:['182 V','208 V','227.5 V','255 V'],c:2,e:'1.25 × 182 = 227.5 V (بافتراض الكتاب أن E يتناسب مع I_F).'},
  {q:'في مثال (4-2) تغيّر معامل القدرة بعد زيادة تيار المجال من 0.85 متأخر إلى:',o:['0.85 متقدم','0.974 متقدم','0.966 متأخر','1.0'],c:1,e:'cos(13.2°) = 0.974 والزاوية موجبة ⇒ متقدم (الكتاب لم يكتب «متقدم»).'},
  {q:'ما الافتراض الذي يتجاهله الكتاب عند جعل E يزيد 25% مع زيادة تيار المجال 25%؟',o:['المقاومة','التشبع المغناطيسي','التردد','المفاقيد الحديدية'],c:1,e:'ص 139: افتراض خطي؛ والشكل (4-5) يُظهر منطقة التشبع.'},
  {q:'كيف نغيّر معامل قدرة محرك تزامني من متأخر إلى متقدم دون تغيير قدرته الخارجة؟',o:['بزيادة الحمل','بزيادة تيار المجال','بخفض التردد','بعكس أطراف الثابت'],c:1,e:'ص 136–137 والشكل (4-8).'}
 ]
});

/* =============================== Lesson 4.6 — unit questions =============================== */
const det=(q,ans)=>`<details class="sm-q"><summary>${q}</summary><div style="margin-top:6px"><div class="callout"><b>إجابة مقترحة (ليست من الكتاب):</b> ${ans}</div></div></details>`;
const G9=[{id:'V',label:'جهد الخط للمصدر (نجمة)',sym:'V_L',unit:'V',value:360},{id:'Xs',label:'الممانعة التزامنية',sym:'X_S',unit:'Ω',value:2.1},{id:'Pc',label:'المفاقيد الحديدية',sym:'P_{cor}',unit:'kw',value:0.96},{id:'Pf',label:'مفاقيد الاحتكاك',sym:'P_F',unit:'kw',value:1.42},
 {id:'P1',label:'الحمل',sym:'P_o',unit:'kw',value:11},{id:'pf',label:'معامل القدرة',sym:'\\cos\\theta',unit:'',value:0.8,step:0.01},{id:'lead',label:'نوعه: 1 = متقدم، 0 = متأخر',sym:'',unit:'',value:1,step:1,min:0,max:1},{id:'P2',label:'الحمل الجديد',sym:'P_o\'',unit:'kw',value:18}];
const G10=[{id:'V',label:'جهد المصدر (دلتا)',sym:'V',unit:'V',value:480},{id:'Xs',label:'الممانعة التزامنية',sym:'X_S',unit:'Ω',value:1},{id:'hp',label:'الحمل',sym:'P_o',unit:'hp',value:400},
 {id:'pf',label:'معامل القدرة',sym:'\\cos\\theta',unit:'',value:0.85,step:0.01},{id:'lead',label:'نوعه: 1 = متقدم، 0 = متأخر',sym:'',unit:'',value:1,step:1,min:0,max:1},{id:'pct',label:'زيادة تيار المجال',sym:'',unit:'%',value:10}];
const gv=G=>Object.fromEntries(G.map(q=>[q.id,q.value]));
const R9a=solveLoad(gv(G9),{conn:'star',vmode:'div'}).R,R9b=solveLoad(gv(G9),{conn:'star',vmode:'nodiv'}).R,R10=solveField(gv(G10),{hp:1}).R;
const ex9txt=(R,lab)=>`<b>${lab}</b> \\(V_{ph}=${n_(R.Vph)}\\) V؛ \\(P_{in}=${n_(R.Pin1)}\\) kw؛ \\(I_L=I_{ph}=${fm(R.IL,1)}\\) A؛ \\(I_{ph}=${fm(R.Iph,1)}\\angle{${ang(R.ia)}^\\circ}\\) A؛ \\(E_{Ph}=${n_(R.Em)}\\angle{${ang(R.Ea)}^\\circ}\\) V. بعد زيادة الحمل: \\(P_{in}=${n_(R.Pin2)}\\) kw، \\(\\delta=${n_(R.d)}^\\circ\\)، \\(E_{Ph}=${n_(R.Em)}\\angle{-${n_(R.d)}^\\circ}\\) V، \\(I_{ph}=I_L=${fm(R.I2,1)}\\angle{${ang(R.I2a)}^\\circ}\\) A، \\(\\cos\\theta=${fm(R.pf2,3)}\\) ${R.I2a>0?'متقدم':'متأخر'}.`;
B.lesson({
 id:'u4-l6',unit:4,order:6,pages:'141–143',
 title:'أسئلة الوحدة الرابعة وتمارينها',
 summary:'أسئلة الوحدة وتمارينها، مع إجابات مقترحة من نص الوحدة، وحاسبات للتمرينين 9 و10 بخطوات المثالين (4-1) و(4-2)، وجدول المراجع.',
 theory:[
  {h:'أسئلة وتمارين',ref:'ص 141',html:'<p>الكتاب لا يعطي إجابات للتمارين؛ الإجابات المقترحة أدناه مكتوبة من نص الوحدة ويعتمدها المدرب.</p>'+
   det('1. كيف يعمل المحرك التزامني؟','يغذى العضو الثابت بجهد ثلاثي الأوجه فينشأ مجال دوار \\(B_S\\) بالسرعة التزامنية، وتغذى ملفات المجال بتيار مستمر فينشأ مجال الدوار \\(B_R\\). بعد إيصال الدوار إلى السرعة التزامنية أو قريباً منها تُغذى ملفات المجال، فتكون الزاوية بين المجالين صغيرة، فيلحق مجال الدوار (ومعه الدوار) بمجال الثابت ويدور بالسرعة التزامنية نفسها ولا تتغير مهما تغير الحمل ضمن الحمل المقنن؛ ويزداد الحمل بازدياد زاوية العزم δ. وإذا زاد الحمل عن العزم الأقصى يفقد التزامن (ص 126–127).')+
   det('2. لماذا لا يستطيع المحرك التزامني البدء من تلقاء نفسه؟','لأن مجال العضو الثابت يدور بالسرعة التزامنية والدوار واقف، فيحاول مجال الدوار اللحاق به لكنه لا يتمكن بسبب اتساع الزاوية بينهما بسرعة (ص 127). (توضيح: يجذب المجالُ القطبَ ثم يدفعه في كل دورة فمتوسط العزم صفر.)')+
   det('3. قارن بين طرق بدء المحرك التزامني من حيث: سهولة الاستخدام والتكلفة','الكتاب يصف الطرق ولا يقارنها صراحة؛ مقارنة مقترحة من وصفه: <b>المحرك الخارجي</b>: يحتاج محركاً إضافياً على نفس العمود وخطوات تشغيل متتابعة ⇒ تكلفة أعلى واستخدام أصعب. <b>قضبان التخميد</b>: مدمجة في أحذية الأقطاب ويبدأ المحرك كمحرك حثي ثم يُغذى المجال ⇒ سهل وتكلفته الإضافية قليلة. <b>التيارات الدوامية</b>: دوار مصمت بلا قضبان يعلق وحده ⇒ الأسهل والأرخص لكنها للمحركات الصغيرة فقط. <b>المصدر متغير التردد</b>: بدء سهل وسلس بخفض التردد ثم رفعه، لكنه يحتاج إلكترونيات قدرة ⇒ أعلى تكلفة (انتشر حديثاً بفضل التقدم في إلكترونيات القدرة) (ص 128–129).')+
   det('4. لماذا يجب قصر ملفات المجال أثناء عملية البدء؟','لأن تعرضها للمجال المغناطيسي الدوار الناتج عن العضو الثابت يولد جهداً عالياً على أطرافها قد يؤدي إلى انهيار العازل أو حدوث شرارة بين حلقات الانزلاق؛ لذلك تُقصر عبر مقاومة حتى يوصل التيار المستمر (ص 129).')+
   det('5. اشرح كيف يمكن تغيير معامل القدرة للمحرك التزامني من متقدم إلى متأخر أو العكس دون حدوث تغيير في القدرة الخارجة منه','بالتحكم في تيار المجال \\(I_F\\): تغييره يغير \\(E_{Ph}\\) ولا يغير السرعة ولا العزم ولا القدرة الخارجة (يبقى \\(E\\sin\\delta\\) و\\(I\\cos\\theta\\) ثابتين). زيادة \\(I_F\\) فوق قيمة معامل القدرة = 1 تجعل التيار متقدماً (حمل سعوي يعطي Q)، وإنقاصه تحتها تجعله متأخراً (حمل حثي يسحب Q) (ص 129، 136–137، الشكلان 4-3 و4-8، مثال 4-2).')+
   det('6. متى يفضل استخدام المحرك التزامني على الحثي؟','في التطبيقات التي يكون فيها ثبات السرعة مطلباً أساسياً، وكذلك عند الحاجة إلى تحسين معامل القدرة (المكثف التزامني). وإن لم يكن ثبات السرعة مطلباً أساسياً يُستغنى عنه لارتفاع ثمنه (ص 131).')+
   det('7. ماذا يعني فقد التزامن بالنسبة للمحرك التزامني؟','أن يزيد الحمل عن العزم الأقصى للمحرك (مقدار δ يتجاوز 90°) فلا يستطيع الدوار البقاء مع المجال الدوار، فيبدأ بالتباطؤ التدريجي حتى يتوقف (ص 127).')+
   det('8. قارن بين المحرك الحثي والتزامني من حيث: التكلفة وطرق البدء والسرعة والعزم','<b>التكلفة:</b> التزامني أغلى لأنه يحتاج نظام إثارة ونظام بدء حركة (ص 131). <b>البدء:</b> التزامني لا يبدأ وحده ويحتاج إحدى طرق البدء (ص 128–129)؛ والحثي يبدأ وحده (فطريقة قضبان التخميد تجعل التزامني يبدأ «على أساس أنه محرك حثي»). <b>السرعة:</b> التزامني ثابت السرعة عند \\(n_s\\) مهما تغير الحمل ضمن المقنن (ص 130)؛ والحثي يدور أقل من \\(n_s\\) بانزلاق يزداد مع الحمل (توضيح من الوحدة الأولى، ليس من نص هذه الوحدة). <b>العزم:</b> في التزامني يتغير العزم مع δ والسرعة ثابتة حتى العزم الأقصى ثم يفقد التزامن (الشكل 4-4)؛ والحثي يعطي عزمه بتغير الانزلاق (توضيح).')+
   det('9. «محرك تزامني ملفاته موصلة على شكل نجمة، جهد الخط للمصدر 360 V والتردد 50 Hz، ممانعته التزامنية 2.1 Ω ومقاومة ملفات المنتج مهملة، المفاقيد الحديدية 960 W ومفاقيد الاحتكاك 1420 W، يدير حملاً قدره 11 kw عند معامل قدرة 0.8 متقدماً، أوجد ما يلي: أ) ارسم المخطط الاتجاهي للمحرك. ب) أوجد قيم \\(I_L\\)، \\(I_{Ph}\\)، \\(E_{Ph}\\). جـ) عندما يزداد الحمل إلى 18 kw وضح سلوك المحرك باستخدام المخطط الاتجاهي. د) أوجد قيم \\(I_L\\)، \\(I_{Ph}\\)، \\(E_{Ph}\\) بعد زيادة الحمل. هـ) احسب معامل القدرة بعد زيادة الحمل.»',
    `بخطوات مثال (4-1) وتقريبه. أ) و جـ) المخطط مثل الشكل (4-7): التيار متقدم، وبعد زيادة الحمل يبقى طول E ثابتاً وتزداد δ ويطول التيار ويقل تقدمه. <b>الحمل 11 kw يُفهم قدرةً خارجة كما في المثال.</b> وبما أن التوصيل <b>نجمة</b> فالجهد المعطى 360 V هو جهد الخط، وصيغ الكتاب مكتوبة بجهد الوجه، لذلك نقسم على √3 أولاً:<br>${ex9txt(R9a,'جهد الوجه = 360/√3:')}<br>الحل خطوة بخطوة في تبويب «الأمثلة المحلولة».`)+
   det('10. «محرك تزامني ملفاته موصلة على شكل دلتا، يغذى من مصدر جهده 480 V، ممانعته التزامنية 1 Ω ومقاومة ملفات المنتج مهملة والمفاقيد الحديدية ومفاقيد الاحتكاك مهملة أيضاً. أوجد ما يلي: أ) إذا كان يدير حملاً قدرته 400 hp عند معامل قدرة 0.85 متقدماً، أوجد قيمة وزاوية كل من \\(I_{Ph}\\)، \\(E_{Ph}\\). ب) إذا ازداد تيار المجال بنسبة 10% وضح سلوك المحرك باستخدام المخطط الاتجاهي ثم أوجد قيم \\(I_{Ph}\\)، \\(E_{Ph}\\) وكذلك معامل القدرة الجديد.»',
    `بخطوات مثال (4-2) وتقريبه: \\(P_{in}=${n_(R10.Pin)}\\) kw، \\(I_L=${fm(R10.IL,1)}\\) A، أ) \\(I_{Ph}=${fm(R10.Iph,1)}\\angle{${ang(R10.ia)}^\\circ}\\) A، \\(E_{Ph}=${n_(R10.Em)}\\angle{${ang(R10.Ea)}^\\circ}\\) V. ب) بزيادة تيار المجال 10% يطول E (رأسه على الخط الأفقي نفسه) ويبقى المسقط \\(I\\cos\\theta\\) ثابتاً، ولأن التيار متقدم أصلاً فإنه يزداد ويزداد تقدمه: \\(E'_{Ph}=${n_(R10.E2)}\\) V، \\(\\delta'=${ang(R10.d2)}^\\circ\\)، \\(I_{Ph}=${fm(R10.I2,1)}\\angle{${ang(R10.I2a)}^\\circ}\\) A، معامل القدرة الجديد \\(${fm(R10.pf2,3)}\\) متقدم.`)},
  {err:'التمرين 9 ص 141: جهد الخط <span class="ltr">360 V</span> قيمة غير قياسية (ربما المقصود 380 V)، وتُركت كما هي. وصيغة تيار الخط في الكتاب مكتوبة بجهد الوجه (ص 134)، وفي توصيل النجمة يختلف جهد الوجه عن جهد الخط؛ لذلك تعرض الإجابة المقترحة والحاسبة طريقتين.'},
  {err:'التمرين 10 ص 142: «عند معامل <b>قدره</b> 0.85» والصحيح «معامل قدرة» (خطأ إملائي).'},
  {h:'المراجع',ref:'ص 143',html:`<div class="tablebox"><table class="tt"><thead><tr><th>اسم المرجع</th><th>المؤلف</th></tr></thead><tbody>
   <tr><td class="ltr">Electric Machinery Fundamentals, McGRAW-Hill, 1991</td><td class="ltr">Stephen J. Chapman</td></tr>
   <tr><td class="ltr">An Introduction to Electrical Machines and Transformers, 1981</td><td class="ltr">George McPherson, John Wiley &amp; Sons</td></tr>
   <tr><td class="ltr">Electric Machines, 1994</td><td class="ltr">M. S. Sarma, West Publishing Company</td></tr>
   <tr><td class="ltr">Electrical Technology Construction &amp; Development, 1989</td><td class="ltr">Theraja and A. K. Theraja, Nirja</td></tr>
   <tr><td class="ltr">Electric Machines and Power Systems</td><td class="ltr">Vincent del Toro 1985</td></tr></tbody></table></div>`}
 ],
 examples:[
  {title:'التمرين 9 — جهد الوجه = جهد الخط ÷ √3 (حساب مقترح — ليس من الكتاب)',ref:'ص 141',q:'<p>بخطوات مثال (4-1) وتقريبه، مع معاملة النجمة: <span class="ltr">V<sub>ph</sub> = V<sub>L</sub>/√3</span> و <span class="ltr">I<sub>ph</sub> = I<sub>L</sub></span>. الكتاب لا يعطي إجابة.</p>',given:G9,solve:(g)=>solveLoad(g,{conn:'star',vmode:'div'}).st},
  {title:'التمرين 10 (حساب مقترح — ليس من الكتاب)',ref:'ص 142',q:'<p>بخطوات مثال (4-2) وتقريبه، والمفاقيد مهملة فالقدرة الداخلة = <span class="ltr">400 × 0.746</span>. الكتاب لا يعطي إجابة.</p>',given:G10,solve:(g)=>solveField(g,{hp:1}).st}
 ],
 quiz:[
  {q:'المحرك التزامني لا يبدأ وحده لأن:',o:['تيار المجال صغير','الزاوية بين مجالي الثابت والدوار تتسع بسرعة فلا يلحق الدوار بالمجال','الجهد متردد','ملفات الثابت مقصورة'],c:1,e:'السؤال 2 — ص 127.'},
  {q:'أي طرق البدء مناسبة للمحركات التزامنية الصغيرة فقط حسب الكتاب؟',o:['المحرك الخارجي','قضبان التخميد','التيارات الدوامية','المصدر متغير التردد'],c:2,e:'السؤال 3 — ص 128.'},
  {q:'نقصر ملفات المجال عبر مقاومة أثناء البدء لمنع:',o:['زيادة السرعة','الجهد العالي على أطرافها وانهيار العازل أو الشرارة بين حلقات الانزلاق','نقص التيار','تحسن معامل القدرة'],c:1,e:'السؤال 4 — ص 129.'},
  {q:'لتغيير معامل القدرة من متأخر إلى متقدم دون تغيير القدرة الخارجة:',o:['نزيد تيار المجال','نقلل الحمل','نرفع التردد','نعكس الأطوار'],c:0,e:'السؤال 5 — ص 136–137.'},
  {q:'يفضل المحرك التزامني على الحثي عندما:',o:['يكون ثبات السرعة مطلباً أساسياً','نريد أرخص محرك','لا يوجد مصدر مستمر','نحتاج سرعة متغيرة مع الحمل'],c:0,e:'السؤال 6 — ص 131.'},
  {q:'فقد التزامن يعني:',o:['أن تيار المجال صفر','أن الحمل تجاوز العزم الأقصى فخرج الدوار عن التزامن وتباطأ حتى توقف','أن معامل القدرة = 1','أن السرعة زادت عن n<sub>s</sub>'],c:1,e:'السؤال 7 — ص 127.'},
  {q:'من حيث التكلفة، المحرك التزامني مقارنة بالحثي:',o:['أرخص','أغلى لأنه يحتاج نظام إثارة ونظام بدء','بنفس السعر','لا يمكن المقارنة'],c:1,e:'السؤال 8 — ص 131.'},
  {q:'في التمرين 9 (نجمة، جهد الخط 360 V)، جهد الوجه الحقيقي يساوي تقريباً:',o:['360 V','207.85 V','623.5 V','120 V'],c:1,e:'في النجمة V_ph = V_L/√3 = 360/1.732 ≈ 207.85 V.'}
 ]
});
})(PLCBOOK);
