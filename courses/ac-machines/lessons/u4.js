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
/* «قيم المدرب» لنموذج الحركة المشترك (الدرسان 4-1 و4-2). J = ثابت زمن التسارع (s): زمن الوصول من السكون إلى n_s بعزم صافٍ = العزم الأقصى؛
   المدى 1–10 s حتى يبقى «رفع التردد تدريجياً» ناجحاً و«بسرعة كبيرة» فاقداً للتزامن. الاحتكاك ≤ 0.08 حتى يعلق الدوار المصمت بلا حمل ويصل محرك البدء قرب n_s */
const simDefs=()=>[
  {k:'J',label:'ثابت زمن التسارع (يكبر مع ثقل العضو الدوار)',unit:'s',value:2,min:1,max:10,step:0.1},
  {k:'fric',label:'عزم الاحتكاك (نسبة من العزم الأقصى)',unit:'pu',value:0.03,min:0,max:0.08,step:0.01}];
const simTP=(sim,TP)=>{sim.J=TP.v.J;sim.fric=TP.v.fric};
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

  {st:1,short:'ماذا ستتعلم؟',title:'ماذا ستتعلم في هذه الوحدة؟',ref:'ص 125',
   q:'محرك يدور بسرعة ثابتة لا تتغير مع الحمل، ويمكنه أن يحسّن معامل القدرة للشبكة… ما الذي يجعله مختلفاً عن المحرك الحثي؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="لوحة بأهداف الوحدة الرابعة الثمانية" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><rect x="58" y="34" width="244" height="246" rx="14" fill="#F1EBDD" stroke="#2C4A40" stroke-width="3"/><path d="M58 48a14 14 0 0 1 14 -14h216a14 14 0 0 1 14 14v22h-244z" fill="#2C4A40"/><text x="180" y="58" text-anchor="middle" font-size="14" fill="#FBF6EE" font-weight="700" direction="rtl">أهداف الوحدة الرابعة</text><circle cx="278" cy="89" r="9" fill="#4FB3A9"/><text x="278" y="93" text-anchor="middle" font-size="11" fill="#FBF6EE" font-weight="700" direction="ltr" font-family="var(--mono)">1</text><text x="262" y="94" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="600" direction="rtl">نظرية عمل المحرك التزامني</text><line x1="80" y1="101" x2="268" y2="101" stroke="#CFC6B4" stroke-width="1"/><circle cx="278" cy="113" r="9" fill="#4FB3A9"/><text x="278" y="117" text-anchor="middle" font-size="11" fill="#FBF6EE" font-weight="700" direction="ltr" font-family="var(--mono)">2</text><text x="262" y="118" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="600" direction="rtl">طرق بدء الحركة</text><line x1="80" y1="125" x2="268" y2="125" stroke="#CFC6B4" stroke-width="1"/><circle cx="278" cy="137" r="9" fill="#4FB3A9"/><text x="278" y="141" text-anchor="middle" font-size="11" fill="#FBF6EE" font-weight="700" direction="ltr" font-family="var(--mono)">3</text><text x="262" y="142" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="600" direction="rtl">معامل القدرة ومنحنيات V</text><line x1="80" y1="149" x2="268" y2="149" stroke="#CFC6B4" stroke-width="1"/><circle cx="278" cy="161" r="9" fill="#4FB3A9"/><text x="278" y="165" text-anchor="middle" font-size="11" fill="#FBF6EE" font-weight="700" direction="ltr" font-family="var(--mono)">4</text><text x="262" y="166" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="600" direction="rtl">المكثف التزامني</text><line x1="80" y1="173" x2="268" y2="173" stroke="#CFC6B4" stroke-width="1"/><circle cx="278" cy="185" r="9" fill="#4FB3A9"/><text x="278" y="189" text-anchor="middle" font-size="11" fill="#FBF6EE" font-weight="700" direction="ltr" font-family="var(--mono)">5</text><text x="262" y="190" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="600" direction="rtl">حسابات التشغيل</text><line x1="80" y1="197" x2="268" y2="197" stroke="#CFC6B4" stroke-width="1"/><g data-tip="الهدف السادس: لا تغطيه هذه الوحدة؛ لا توجد فيها معادلة أو مثال للعزم أو للكفاءة."><circle cx="278" cy="209" r="9" fill="#E8735A"/><text x="278" y="213" text-anchor="middle" font-size="11" fill="#FBF6EE" font-weight="700" direction="ltr" font-family="var(--mono)">6</text><text x="262" y="214" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="600" direction="rtl">القدرة والعزم والكفاءة</text><rect x="70" y="197" width="220" height="22" fill="transparent"/></g><line x1="80" y1="221" x2="268" y2="221" stroke="#CFC6B4" stroke-width="1"/><circle cx="278" cy="233" r="9" fill="#4FB3A9"/><text x="278" y="237" text-anchor="middle" font-size="11" fill="#FBF6EE" font-weight="700" direction="ltr" font-family="var(--mono)">7</text><text x="262" y="238" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="600" direction="rtl">تغيّر الحمل أو تيار المجال</text><line x1="80" y1="245" x2="268" y2="245" stroke="#CFC6B4" stroke-width="1"/><circle cx="278" cy="257" r="9" fill="#4FB3A9"/><text x="278" y="261" text-anchor="middle" font-size="11" fill="#FBF6EE" font-weight="700" direction="ltr" font-family="var(--mono)">8</text><text x="262" y="262" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="600" direction="rtl">المخطط الاتجاهي</text></svg>`,
   cap:'أهداف الوحدة الثمانية باختصار.<br><b>مرّر المؤشر على الهدف السادس (أو المسه في الجوال) لتعرف ملاحظتنا عليه.</b>',
   side:[
    {predict:{q:'اسم المحرك يدل على صفته الأساسية. ما المقصود بأنه «تزامني»؟',opts:[
     ['أن سرعته تقل قليلاً كلما زاد الحمل',false,'هذا وصف المحرك الحثي (الانزلاق). التزامني لا تتغير سرعته ما دام ضمن الحمل المقنن.'],
     ['أن العضو الدوار يدور بسرعة المجال الدوار نفسها، وهي السرعة التزامنية',true,'هذا ما ستقرؤه في ص 126: تستقر سرعة الدوار عند سرعة المجال الناتج عن العضو الثابت ولا تتغير مهما تغير الحمل ضمن الحمل المقنن.'],
     ['أنه يعمل على التيار المستمر فقط',false,'العضو الثابت يُغذّى بجهد متردد ثلاثي الأوجه؛ التيار المستمر لملفات المجال فقط.']]}}
   ],
   body:[
    {book:String.raw`<p><b>الهدف العام للوحدة:</b> الإلمام الشامل بكيفية تشغيل وأداء المحركات التزامنية ثلاثية الأوجه وتطبيقاتها.</p>
     <p><b>الأهداف التفصيلية:</b></p><ol>
     <li>أن يلم المتدرب بنظرية عمل المحركات التزامنية.</li><li>أن يلم المتدرب بطرق بدء حركة المحركات التزامنية.</li><li>أن يفهم المتدرب كيفية التحكم في معامل القدرة ومنحنيات (V) للمحرك التزامني.</li><li>أن يلم المتدرب بكيفية استخدام المحرك التزامني كمكثف تزامني.</li><li>أن يتمكن المتدرب من إجراء الحسابات المتعلقة بتشغيل المحركات التزامنية ثلاثية الأوجه.</li><li>أن يتمكن المتدرب من حساب القدرة والعزم والكفاءة للمحركات التزامنية.</li><li>أن يفهم المتدرب سلوك المحرك التزامني عند تغير الحمل أو تيار المجال.</li><li>أن يتمكن المتدرب من رسم المخطط الاتجاهي وكيفية استخدامه للتحكم في هذه المحركات.</li></ol>`,ref:'ص 125'},
    {tip:String.raw`<p>هذا الدرس عن <b>تركيب</b> المحرك التزامني و<b>كيفية عمله</b>. الدرس الثاني عن <b>طرق بدء الحركة</b>، والثالث عن <b>منحنيات V</b> والعزم والاستخدامات و<b>المكثف التزامني</b>، والرابع والخامس عن سلوك المحرك عند تغيير <b>الحمل</b> ثم عند تغيير <b>تيار المجال</b> (مع مثالين محلولين)، والسادس لأسئلة الوحدة وتمارينها.</p>`,title:'خريطة الوحدة'},
    {watch:String.raw`<p>الهدف السادس (حساب القدرة والعزم والكفاءة) لا تغطيه الوحدة: لا توجد فيها معادلة أو مثال للعزم أو للكفاءة؛ الأمثلة تحسب القدرة الداخلة والتيار والجهد الداخلي ومعامل القدرة فقط.</p>`},
    {title:'مختبر مصغّر: صح أم خطأ؟',widget:(el,B)=>DCML.tf(el,B,{intro:'تأكد أنك قرأت أهداف الوحدة الرابعة.',items:[
  ['الوحدة الرابعة عن المحركات التزامنية ثلاثية الأوجه.',true,'الهدف العام: «الإلمام الشامل بكيفية تشغيل وأداء المحركات التزامنية ثلاثية الأوجه وتطبيقاتها».'],
  ['من أهداف الوحدة استخدام المحرك التزامني كمكثف تزامني.',true,'الهدف الرابع.'],
  ['الوحدة لا تتناول طرق بدء حركة المحرك التزامني.',false,'الهدف الثاني: «أن يلم المتدرب بطرق بدء حركة المحركات التزامنية».'],
  ['من أهدافها فهم سلوك المحرك عند تغير الحمل أو تيار المجال.',true,'الهدف السابع، وتدرسه في الدرسين 4.4 و4.5.']]})}
   ]},

  {st:2,short:'التركيب',title:'التركيب: مصدران ومجالان',ref:'ص 126',
   q:'المحرك الحثي يأخذ تيار دواره بالحث من العضو الثابت… فمن أين يأتي مجال الدوار في المحرك التزامني؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="محرك تزامني: العضو الثابت يغذيه مصدر ثلاثي الأوجه، وملفات المجال على الدوار يغذيها مصدر تيار مستمر" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="158" r="142" fill="#F7DCC8"/><circle data-tip="العضو الثابت: تُوضع في مجاريه ملفات الأوجه الثلاثة التي تُغذّى من المصدر المتردد." cx="180" cy="152" r="84" fill="#2C4A40"/><circle cx="180" cy="152" r="66" fill="#FBF6EE"/><g data-tip="العضو الدوار بأقطاب بارزة: قطب شمالي في الأعلى وقطب جنوبي في الأسفل."><rect x="168" y="109" width="24.1" height="86" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2"/><rect x="145.6" y="95.2" width="68.8" height="17.2" rx="7.7" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2"/><rect x="145.6" y="191.6" width="68.8" height="17.2" rx="7.7" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2"/></g><g data-tip="ملفات المجال على أقطاب العضو الدوار: تُغذّى بتيار مستمر فتصنع مجالاً ثابتاً في الدوار."><rect x="158.5" y="114.2" width="8.6" height="25.8" rx="2" fill="#F2C14E" stroke="#B9852A" stroke-width="1.2"/><rect x="192.9" y="114.2" width="8.6" height="25.8" rx="2" fill="#F2C14E" stroke="#B9852A" stroke-width="1.2"/><rect x="158.5" y="164" width="8.6" height="25.8" rx="2" fill="#F2C14E" stroke="#B9852A" stroke-width="1.2"/><rect x="192.9" y="164" width="8.6" height="25.8" rx="2" fill="#F2C14E" stroke="#B9852A" stroke-width="1.2"/></g><text x="180" y="112" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">N</text><text x="180" y="202" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">S</text><g data-tip="مصدر جهد متردد ثلاثي الأوجه: يغذي ملفات العضو الثابت، فينشأ مجال يدور بالسرعة التزامنية حسب تردد المصدر."><rect x="96" y="14" width="168" height="30" rx="8" fill="#3B6FB6"/><text x="180" y="34" text-anchor="middle" font-size="13" fill="#FFFFFF" font-weight="700" direction="rtl">مصدر ثلاثي الأوجه</text><line x1="164" y1="44" x2="164" y2="70" stroke="#3B6FB6" stroke-width="3"/><line x1="180" y1="44" x2="180" y2="70" stroke="#3B6FB6" stroke-width="3"/><line x1="196" y1="44" x2="196" y2="70" stroke="#3B6FB6" stroke-width="3"/></g><g data-tip="مصدر تيار مستمر: يغذي ملفات المجال على العضو الدوار، ويصلها التيار عن طريق حلقات الانزلاق."><rect x="96" y="274" width="168" height="30" rx="8" fill="#E8735A"/><text x="180" y="294" text-anchor="middle" font-size="13" fill="#FFFFFF" font-weight="700" direction="rtl">مصدر تيار مستمر</text><line x1="172" y1="274" x2="172" y2="214" stroke="#E8735A" stroke-width="3" stroke-dasharray="6 4"/><line x1="188" y1="274" x2="188" y2="214" stroke="#E8735A" stroke-width="3" stroke-dasharray="6 4"/></g><text x="312" y="120" text-anchor="middle" font-size="13" fill="#3B6FB6" font-weight="700" direction="rtl">مجال يدور</text><text x="312" y="138" text-anchor="middle" font-size="12" fill="#3B6FB6" font-weight="600" direction="rtl">بالسرعة التزامنية</text><path d="M274 117.8A100 100 0 0 0 230 65.4" fill="none" stroke="#3B6FB6" stroke-width="3"/><line x1="237.4" y1="70.1" x2="235.5" y2="69.1" stroke="#3B6FB6" stroke-width="3" stroke-linecap="round"/><polygon points="225.9,63.7 238,64.8 233.1,73.4" fill="#3B6FB6"/><text x="48" y="120" text-anchor="middle" font-size="13" fill="#B9852A" font-weight="700" direction="rtl">مجال ثابت</text><text x="48" y="138" text-anchor="middle" font-size="12" fill="#B9852A" font-weight="600" direction="rtl">في الدوار</text></svg>`,
   cap:'العضو الثابت يأخذ جهداً متردداً ثلاثي الأوجه، وملفات المجال على الدوار تأخذ تياراً مستمراً.<br><b>مرّر المؤشر على المصدرين والملفات (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'ماذا يحتاج المحرك التزامني من مصادر كي يعمل؟',opts:[
     ['مصدراً ثلاثي الأوجه فقط، مثل المحرك الحثي',false,'المحرك الحثي يكفيه ذلك لأن تيار دواره يأتي بالحث. التزامني يحتاج مجالاً ثابتاً في الدوار من تيار مستمر.'],
     ['تياراً مستمراً للعضو الثابت وجهداً متردداً لملفات المجال',false,'العكس: المتردد ثلاثي الأوجه للعضو الثابت، والمستمر لملفات المجال.'],
     ['جهداً متردداً ثلاثي الأوجه للعضو الثابت، وتياراً مستمراً لملفات المجال',true,'هكذا يبدأ الكتاب ص 126: «بتغذية العضو الثابت من مصدر جهد ثلاثي الأوجه وتغذية ملفات المجال بتيار مستمر».']]}}
   ],
   body:[
    {book:String.raw`<p>الآلة التزامنية يمكن تشغيلها كمحرك تزامني <span class="ltr">Synchronous Motor</span> وذلك بتغذية <b>العضو الثابت من مصدر جهد ثلاثي الأوجه</b> وتغذية <b>ملفات المجال بتيار مستمر</b> كالمعتاد.</p>
     <p>عند ذلك ينتج مجالان مغناطيسيان: أحدهما يدور بالسرعة التزامنية حسب تردد مصدر الجهد وهو المجال الناتج عن العضو الثابت، والآخر يدور حسب سرعة العضو الدوار. وعندما تصل سرعة العضو الدوار إلى سرعة المجال الناتج عن ملفات العضو الثابت تستقر سرعة المحرك عند هذه السرعة <b>ولا تتغير مهما تغير حمل المحرك</b> مادام ضمن الحمل المقنن له.</p>`,ref:'ص 126'},
    {tip:String.raw`<p>مجال الدوار يصنعه التيار المستمر، فهو <b>ثابت بالنسبة للدوار</b> ويدور معه أينما دار. ومجال العضو الثابت <b>يدور وحده</b> بالسرعة التزامنية. عندما يدور الدوار بالسرعة التزامنية يصير المجالان يدوران معاً كأنهما مغناطيس يسحب مغناطيساً.</p>`,title:'الفرق عن المحرك الحثي'},
    {book:String.raw`<p>الشكل (3-16) يبين أنه عندما تكون <b>زاوية العزم (δ) سالبة</b> فإن الآلة التزامنية تتحول إلى محرك وعندها تكون القدرة الكهربائية داخلة إلى الآلة.</p>`,ref:'ص 126'},
    {book:String.raw`<div class="eq">$$P_o=\frac{3\,V_{ph}E_{ph}\sin\delta}{X_S}$$<span class="eqno">(3-15)</span></div>
     <p>منطقة التشغيل الآمن أو المستقر للآلة التزامنية عندما تكون <span class="ltr">(δ &lt; 90)</span> في حالة التشغيل كمولد، أو عندما تكون <span class="ltr">(δ &gt; −90)</span> في حالة التشغيل كمحرك.</p>`,ref:'الوحدة الثالثة ص 108–109'},
    {tip:String.raw`<p>الآلة نفسها تصلح مولداً ومحركاً. الذي يحدد عملها هو إشارة δ في المعادلة (3-15): δ موجبة ← القدرة موجبة ← <b>مولد</b> يعطي قدرة كهربائية. δ سالبة ← القدرة سالبة ← <b>محرك</b> يأخذ القدرة الكهربائية من الشبكة.</p>`,title:'مولد أم محرك؟'},
    {title:'مختبر مصغّر: صح أم خطأ؟',widget:(el,B)=>DCML.tf(el,B,{items:[
  ['في المحرك التزامني يُغذى العضو الثابت بجهد ثلاثي الأوجه، وملفات المجال بتيار مستمر.',true,'ص 126.'],
  ['سرعة المحرك التزامني تقل قليلاً كلما زاد الحمل ضمن المقنن.',false,'«تستقر سرعة المحرك عند هذه السرعة ولا تتغير مهما تغير حمل المحرك مادام ضمن الحمل المقنن له».'],
  ['عندما تكون زاوية العزم δ سالبة تعمل الآلة التزامنية محركاً وتدخل إليها القدرة الكهربائية.',true,'الشكل (3-16).'],
  ['منطقة التشغيل المستقر للمحرك عندما تكون δ أكبر من <bdi class="ltr">−90°</bdi>.',true,'«أو عندما تكون (<bdi class="ltr">δ &gt; −90</bdi>) في حالة التشغيل كمحرك».']]})}
   ]},

  {st:3,short:'الدائرة المكافئة',title:'الدائرة المكافئة والمعادلة (4-1)',ref:'ص 126',
   q:'المحرك التزامني هو المولد التزامني نفسه… فما الذي يتغير في دائرته المكافئة عندما يعمل محركاً؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الدائرة المكافئة للمحرك التزامني: الجهد الداخلي ثم الممانعة التزامنية ثم أطراف جهد الوجه، والتيار داخل إلى الآلة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><path d="M70 138V92H124M236 92H280M70 182V232H280" fill="none" stroke="#2C4A40" stroke-width="3"/><g data-tip="الممانعة التزامنية لكل وجه ⟦jXS⟧. مقاومة ملفات العضو الثابت مهملة، فلا يبقى في الدائرة غير هذه الممانعة."><path d="M124 92A11.2 11.2 0 0 1 146.4 92A11.2 11.2 0 0 1 168.8 92A11.2 11.2 0 0 1 191.2 92A11.2 11.2 0 0 1 213.6 92A11.2 11.2 0 0 1 236 92" fill="none" stroke="#2C4A40" stroke-width="3.5"/><rect x="120" y="70" width="120" height="30" fill="transparent"/></g><text x="180" y="64" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">jX<tspan font-size="10" dy="4">S</tspan><tspan dy="-4">&#8203;</tspan></text><g data-tip="الجهد الداخلي ⟦Eph⟧: يتولد في ملفات العضو الثابت بفعل مجال الدوار. طوله يحدده تيار المجال."><circle cx="70" cy="160" r="22" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M56 160q7 -12 14 0t14 0" fill="none" stroke="#2C4A40" stroke-width="2.5"/><line x1="34" y1="196" x2="34" y2="142" stroke="#E8735A" stroke-width="3" stroke-linecap="round"/><polygon points="34,126 41.2,142 26.8,142" fill="#E8735A"/><text x="34" y="216" text-anchor="middle" font-size="15" fill="#E8735A" font-weight="700" direction="ltr" font-family="var(--mono)">E<tspan font-size="10" dy="4">ph</tspan><tspan dy="-4">&#8203;</tspan></text></g><g data-tip="الهبوط على الممانعة التزامنية ⟦jXS·Iph⟧. يكون دائماً عمودياً على سهم التيار في المخطط الاتجاهي."><line x1="150" y1="118" x2="196" y2="118" stroke="#4FB3A9" stroke-width="3" stroke-linecap="round"/><polygon points="212,118 196,125.2 196,110.8" fill="#4FB3A9"/></g><text x="181" y="140" text-anchor="middle" font-size="14" fill="#2E8C83" font-weight="700" direction="ltr" font-family="var(--mono)">jX<tspan font-size="10" dy="4">S</tspan><tspan dy="-4">I</tspan><tspan font-size="10" dy="4">ph</tspan></text><g data-tip="تيار المنتج ⟦Iph⟧: اتجاهه داخل إلى الآلة لأنها تعمل محركاً، أي تأخذ القدرة الكهربائية من المصدر."><line x1="272" y1="72" x2="262" y2="72" stroke="#12855A" stroke-width="3" stroke-linecap="round"/><polygon points="246,72 262,64.8 262,79.2" fill="#12855A"/></g><text x="262" y="60" text-anchor="middle" font-size="14" fill="#12855A" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="10" dy="4">ph</tspan><tspan dy="-4">&#8203;</tspan></text><circle cx="280" cy="92" r="5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="280" cy="232" r="5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><g data-tip="جهد الوجه ⟦Vph⟧ (جهد الأطراف لكل وجه): يأتي من المصدر، ويُتخذ مرجعاً بزاوية ⟦0°⟧."><line x1="304" y1="214" x2="304" y2="126" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><polygon points="304,110 311.2,126 296.8,126" fill="#2C4A40"/><text x="332" y="168" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">V<tspan font-size="10" dy="4">ph</tspan><tspan dy="-4">&#8203;</tspan></text></g><text x="180" y="272" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="600" direction="rtl">مقاومة ملفات العضو الثابت مهملة</text></svg>`,
   cap:'الشكل <span class="ltr">(4-1)</span>: الدائرة المكافئة للمحرك التزامني لكل وجه.<br><b>مرّر المؤشر على الرموز والأسهم (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'في المولد يخرج التيار من الآلة إلى الشبكة. في المحرك التزامني يكون اتجاه تيار العضو الثابت:',opts:[
     ['داخلاً إلى الآلة، لأن القدرة الكهربائية تدخل إليها',true,'يقول الكتاب: «مع الأخذ في الاعتبار تغير اتجاه القدرة وبالتالي يتغير اتجاه التيار في العضو الثابت».'],
     ['خارجاً منها كالمولد تماماً',false,'لو بقي خارجاً لبقيت الآلة مولداً تعطي قدرة. المحرك يأخذ القدرة فيدخل التيار إليه.'],
     ['لا يمر تيار في العضو الثابت، فالتيار كله في ملفات المجال',false,'العضو الثابت يأخذ تياره من المصدر ثلاثي الأوجه، وملفات المجال تأخذ التيار المستمر.']]}}
   ],
   body:[
    {book:String.raw`<p>جميع العلاقات الرياضية الخاصة بالمولد التزامني تنطبق تماماً على المحرك التزامني مع الأخذ في الاعتبار <b>تغير اتجاه القدرة</b> وبالتالي يتغير اتجاه التيار في العضو الثابت، وعلى هذا الأساس تصبح الدائرة المكافئة للمحرك التزامني كما هو موضح في الشكل (4-1) مع <b>إهمال مقاومة ملفات العضو الثابت</b> للتبسيط، وبالتالي يمكن إيجاد قيمة الجهد الداخلي من المعادلة التالية:</p>
     <div class="eq">$$E_{ph}=V_{ph}-jX_S\,I_{ph}$$<span class="eqno">(4-1)</span></div>
     <ul><li>\(E_{ph}\): الجهد الداخلي (المتولد) لكل وجه <span class="ltr">[V]</span></li><li>\(V_{ph}\): جهد الوجه (جهد الأطراف لكل وجه) ويُتخذ مرجعاً بزاوية <span class="ltr">0°</span></li><li>\(X_S\): الممانعة التزامنية لكل وجه <span class="ltr">[Ω]</span></li><li>\(I_{ph}\): تيار المنتج لكل وجه <span class="ltr">[A]</span> واتجاهه داخل إلى الآلة</li></ul>`,ref:'ص 126'},
    {tip:String.raw`<p>اقرأ المعادلة (4-1) هكذا: <b>جهد الشبكة \(V_{ph}\) = الجهد الداخلي \(E_{ph}\) + الهبوط على الممانعة \(jX_SI_{ph}\)</b>. حرف \(j\) يعني «أدِر السهم \(90^\circ\) عكس عقارب الساعة»، لذلك يكون سهم \(jX_SI_{ph}\) في المخطط الاتجاهي عمودياً دائماً على سهم التيار، ويبدأ من رأس \(E_{ph}\) وينتهي عند رأس \(V_{ph}\).</p>
     <p>وفي الدرسين الرابع والخامس ستجد أن <b>طول</b> \(E_{ph}\) يحدده تيار المجال، و<b>زاويته</b> δ يحددها الحمل.</p>`,title:'كيف تقرأ المعادلة؟'},
    {watch:String.raw`<p>إشارة السالب في (4-1) سببها أن التيار <b>داخل</b> إلى الآلة. لا تنقل معادلة المولد كما هي إلى المحرك دون الانتباه لاتجاه التيار.</p>`},
    {title:'مختبر مصغّر: <bdi class="ltr">E<sub>ph</sub></bdi> من المعادلة (4-1)',widget:(el,B)=>DCML.lab(el,B,{intro:String.raw`محرك مثال (4-1): \(V_{ph} = 208\ \text{V}\)، \(X_S = 2.5\ \Omega\)، \(I_{ph} = 27.4\ \text{A}\) بمعامل قدرة 0.8 متقدم (الكتاب). الحالتان الأخريان «ماذا لو» بالتيار نفسه، ليستا في الكتاب.`,
 predict:{q:String.raw`في مثال (4-1) التيار متقدم و\(E_{ph} = 255\ \text{V}\) أكبر من \(V_{ph}\). لو كان التيار متأخراً بالمقدار نفسه، كيف يكون \(E_{ph}\)؟`,opts:[
  [String.raw`أصغر من \(V_{ph} = 208\ \text{V}\)`,true,String.raw`حين يتأخر التيار يتجه \(-jX_S I_{ph}\) إلى اليسار فيطرح من \(V_{ph}\)، فيقل \(E_{ph}\) (نحو 176 V).`],
  ['يبقى 255 V',false,String.raw`\(E_{ph} = V_{ph} - jX_S I_{ph}\) يتغير باتجاه التيار.`],
  ['أكبر من 255 V',false,'العكس: التيار المتقدم هو الذي يحتاج جهداً داخلياً أكبر.']]},
 ins:[{k:'t',l:'معامل القدرة',seg:[['lead','0.8 متقدم (الكتاب)'],['r','1.0 (ماذا لو)'],['lag','0.8 متأخر (ماذا لو)']],v:'lead'}],
 calc:(s,v,B)=>{const th=s.t==='lead'?36.87:s.t==='lag'?-36.87:0,I=pol(27.4,th),E=csub(C(208,0),cmul(C(0,2.5),I)),m={Ec:E,Im:27.4,th,d:cang(E)};
  return {pic:phSVG({W:440,H:260,view:{x0:-20,x1:280,y0:-90,y1:80},vecs:onePoint(208,m,{kI:1.6}),arcs:phArcs(m)}),facts:[['<bdi class="ltr">E<sub>ph</sub></bdi>',DCML.fm(B,cabs(E),0)+' V','hi'],['زاوية العزم δ',DCML.fm(B,cang(E),1)+'°'],['مقارنة بـ <bdi class="ltr">V<sub>ph</sub></bdi>',cabs(E)>208?'أكبر':'أصغر']],
   msg:s.t==='lead'?String.raw`هذا حل الكتاب: \(E_{ph} = 249.1 - j54.8 = 255\angle -12.4^\circ\ \text{V}\).`:s.t==='lag'?'تيار متأخر: الجهد الداخلي أصغر من جهد الأطراف.':'معامل قدرة واحد: الجهد الداخلي أكبر قليلاً من جهد الأطراف.',cls:s.t==='lead'?'':'warn'}}})}
   ]},

  {st:4,short:'كيف يعمل؟',title:'كيفية عمل المحرك التزامني',ref:'ص 127',
   q:'مجال الدوار يريد اللحاق بمجال العضو الثابت… فلماذا لا يبدأ المحرك الدوران وحده إذا وصلناه بالمصدرين؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مقطع في محرك تزامني ذي قطبين: مجال العضو الثابت يدور، ومجال الدوار يتبعه بزاوية صغيرة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="156" r="150" fill="#DDEFE6"/><rect x="38" y="14" width="284" height="284" rx="8" fill="#F1EBDD" stroke="#2C4A40" stroke-width="2"/><circle cx="180" cy="156" r="126" fill="#CFE6DB"/><circle cx="180" cy="156" r="100" fill="#FBF6EE"/><circle data-tip="العضو الثابت: تمر في ملفاته تيارات ثلاثية الأوجه فتصنع مجالاً دواراً منتظماً ⟦BS⟧." cx="180" cy="156" r="126" fill="none" stroke="#2C4A40" stroke-width="2"/><g data-tip="موصلات العضو الثابت: الرمز ⟦⊙⟧ تيار خارج من الصفحة، والرمز ⟦⊗⟧ تيار داخل إليها."><circle cx="110.4" cy="67" r="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.6"/><circle cx="110.4" cy="67" r="2.6" fill="#2C4A40"/><circle cx="249.6" cy="67" r="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.6"/><circle cx="249.6" cy="67" r="2.6" fill="#2C4A40"/><circle cx="110.4" cy="245" r="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.6"/><path d="M106.4 241l8 8M114.4 241l-8 8" stroke="#2C4A40" stroke-width="1.6"/><circle cx="249.6" cy="245" r="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.6"/><path d="M245.6 241l8 8M253.6 241l-8 8" stroke="#2C4A40" stroke-width="1.6"/></g><g transform="rotate(0 180 156)"><g data-tip="العضو الدوار بأقطاب بارزة: قطب شمالي في الأعلى وقطب جنوبي في الأسفل."><rect x="166" y="106" width="28" height="100" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2"/><rect x="140" y="90" width="80" height="20" rx="9" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2"/><rect x="140" y="202" width="80" height="20" rx="9" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2"/></g><g data-tip="ملفات المجال: يمر فيها تيار مستمر فيتولد مجال مغناطيسي ثابت في العضو الدوار ⟦BR⟧."><rect x="155" y="112" width="10" height="30" rx="2" fill="#F2C14E" stroke="#B9852A" stroke-width="1.2"/><rect x="195" y="112" width="10" height="30" rx="2" fill="#F2C14E" stroke="#B9852A" stroke-width="1.2"/><rect x="155" y="170" width="10" height="30" rx="2" fill="#F2C14E" stroke="#B9852A" stroke-width="1.2"/><rect x="195" y="170" width="10" height="30" rx="2" fill="#F2C14E" stroke="#B9852A" stroke-width="1.2"/></g><text x="130" y="104" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">N</text><text x="130" y="218" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">S</text></g><g data-tip="مجال العضو الدوار ⟦BR⟧: ثابت بالنسبة للدوار، ويدور معه."><line x1="180" y1="156" x2="180" y2="98" stroke="#E8735A" stroke-width="5" stroke-linecap="round"/><polygon points="180,80 188.1,98 171.9,98" fill="#E8735A"/></g><g data-tip="مجال العضو الثابت ⟦BS⟧: يدور بالسرعة التزامنية ⟦ns⟧. مجال الدوار يلحق به بزاوية صغيرة."><line x1="180" y1="156" x2="161.1" y2="80.3" stroke="#3B6FB6" stroke-width="5" stroke-linecap="round"/><polygon points="156.8,62.9 169,78.4 153.3,82.3" fill="#3B6FB6"/></g><circle cx="180" cy="156" r="7" fill="#2C4A40"/><text x="206" y="90" text-anchor="middle" font-size="15" fill="#C4552F" font-weight="700" direction="ltr" font-family="var(--mono)">B<tspan font-size="10" dy="4">R</tspan><tspan dy="-4">&#8203;</tspan></text><text x="142" y="60" text-anchor="middle" font-size="15" fill="#3B6FB6" font-weight="700" direction="ltr" font-family="var(--mono)">B<tspan font-size="10" dy="4">S</tspan><tspan dy="-4">&#8203;</tspan></text><g data-tip="اتجاه دوران المجال: عكس عقارب الساعة، بالسرعة التزامنية ⟦ns⟧."><path d="M301.8 91.2A138 138 0 0 0 253.1 39" fill="none" stroke="#3B6FB6" stroke-width="3"/><line x1="261.1" y1="44.4" x2="254.4" y2="40.6" stroke="#3B6FB6" stroke-width="3" stroke-linecap="round"/><polygon points="244.8,35.2 256.8,36.2 251.9,44.9" fill="#3B6FB6"/><text x="308" y="52" text-anchor="middle" font-size="15" fill="#3B6FB6" font-weight="700" direction="ltr" font-family="var(--mono)">n<tspan font-size="10" dy="4">s</tspan><tspan dy="-4">&#8203;</tspan></text></g></svg>`,
   cap:'الشكل <span class="ltr">(4-2)</span>: محرك تزامني ذو قطبين، ومجال الدوار يتبع مجال العضو الثابت بزاوية صغيرة.<br><b>مرّر المؤشر على السهمين والموصلات (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'وصلنا العضو الثابت بالمصدر وغذّينا ملفات المجال والدوار ما زال واقفاً. ماذا يحدث؟',opts:[
     ['يبدأ الدوران ببطء ثم يصل إلى السرعة التزامنية',false,'لا يحدث ذلك: المجال يدور بسرعة كبيرة والدوار ثقيل لا يستطيع أن يلحق به.'],
     ['يدور في عكس اتجاه المجال',false,'لا يوجد ما يدفعه إلى الدوران في أي اتجاه دوراناً مستمراً.'],
     ['لا يبدأ: المجال يدور بسرعة فتتسع الزاوية بين المجالين ولا يتمكن الدوار من اللحاق به',true,'هذا ما يقوله الكتاب ص 127، ولذلك يجب أن يدار الدوار بالسرعة التزامنية أو قريباً منها أولاً.']]}}
   ],
   body:[
    {book:String.raw`<p>لكي نفهم كيف يعمل المحرك التزامني، انظر الشكل (4-2) الذي يوضح محركاً تزامنياً ذا قطبين. عندما تغذى ملفات المجال بالتيار المستمر سيتولد <b>مجال مغناطيسي ثابت في العضو الدوار</b>، أما العضو الثابت فعندما يوصل إلى مصدر الجهد فستمر فيه تيارات ثلاثية الأوجه والتي بدورها ستولد <b>مجالاً مغناطيسياً دواراً منتظماً</b>، وبالتالي سيتواجد داخل الآلة مجالان مغناطيسيان هما \(B_R\) و \(B_S\).</p>`,ref:'ص 127'},
    {book:String.raw`<p>مجال العضو الدوار \(B_R\) سيحاول أن يكون متعامداً مع مجال العضو الثابت \(B_S\) تماماً كما يحدث عندما توضع قطعتان من المغناطيس قرب بعضهما البعض. وحيث أن مجال العضو الثابت يدور فإن مجال العضو الدوار سيحاول اللحاق به (ومعه العضو الدوار نفسه) <b>ولكن لن يتمكن من ذلك بسبب اتساع الزاوية بينهما</b>، وبالتالي لابد من إيجاد وسيلة تجعل العضو الدوار يحافظ على زاوية صغيرة بين مجاله ومجال العضو الثابت.</p>`,ref:'ص 127'},
    {watch:String.raw`<p>يقول الكتاب إن \(B_R\) «سيحاول أن يكون <b>متعامداً</b> مع \(B_S\)». والصحيح أن قطعتي المغناطيس <b>تتحاذيان</b>، فمجال الدوار يحاول أن <b>ينطبق</b> على مجال الثابت، والزاوية الصغيرة بينهما هي δ وتكبر مع الحمل. وهذا ما يرسمه الكتاب نفسه في الشكل (4-2): السهمان متقاربان.</p>`,fix:true},
    {add:String.raw`<p>ضع مغناطيساً على طاولة وقرّب منه مغناطيساً معلقاً بخيط: يدور المعلّق حتى <b>يصطف</b> مع الأول (الشمالي مقابل الجنوبي). لو حرّكت الأول ببطء لتبعه المعلّق، ولو أدرته بسرعة كبيرة لبقي المعلّق يهتز في مكانه ولا يتبعه. هذه فكرة المحرك التزامني كلها.</p>`,title:'جرّبها بمغناطيسين'},
    {book:String.raw`<p>ولكي يتحقق ذلك <b>يجب أن يدار العضو الدوار بالسرعة التزامنية أو قريب منها قبل تغذية ملفاته من مصدر جهد مستمر</b>، وعند التغذية ستكون الزاوية بين المجالين صغيرة وسيستمر مجال العضو الدوار (ومعه العضو الدوار نفسه) في اللحاق بمجال العضو الثابت وسيدور بنفس سرعته (السرعة التزامنية) ولا تتغير مهما تغير حمل المحرك مادام ضمن الحمل المقنن له.</p>`,ref:'ص 127'},
    {tip:String.raw`<p>لماذا لا يبدأ وحده؟ المجال \(B_S\) يدور بسرعة كبيرة والدوار الثقيل واقف. في نصف الدورة يجذب المجالُ القطبَ إلى الأمام، وفي النصف التالي يجذبه إلى الخلف، فمتوسط العزم صفر ويبقى الدوار يهتز في مكانه. أما إذا كان الدوار يدور قريباً من السرعة التزامنية فإن الزاوية بين المجالين تتغير ببطء، فيتمكن المجال من «الإمساك» بالقطب وسحبه معه.</p>`,title:'لماذا يلزم إيصاله قرب السرعة التزامنية؟'},
    {title:'مختبر مصغّر: ماذا يحدث؟',widget:(el,B)=>DCML.cases(el,B,{cases:[
  {q:'وصّلنا العضو الثابت بالمصدر وغذّينا ملفات المجال بالتيار المستمر والدوار ساكن. ماذا يحدث؟',opts:[
   ['يبدأ الدوران ويصل إلى السرعة التزامنية',false,'مجال الدوار يحاول اللحاق بمجال العضو الثابت «ولكن لن يتمكن من ذلك بسبب اتساع الزاوية بينهما».'],
   ['لا يبدأ الدوران، لأن المجال الدوار سريع والدوار لا يستطيع اللحاق به',true,'لهذا يحتاج المحرك التزامني وسيلة بدء (الدرس 4.2).'],
   ['يدور في الاتجاه المعاكس',false,'لا يوجد ما يدفعه في اتجاه ثابت.']]},
  {q:String.raw`لماذا يحاول مجال العضو الدوار \(B_R\) أن يلحق بمجال العضو الثابت \(B_S\)؟`,opts:[
   ['لأن التيار المستمر في الدوار يتغير مع الزمن',false,'تيار الدوار مستمر، ومجاله ثابت بالنسبة للدوار.'],
   ['كما يحدث عندما توضع قطعتان من المغناطيس قرب بعضهما',true,String.raw`«مجال العضو الدوار \(B_R\) سيحاول أن يكون متعامداً مع مجال العضو الثابت \(B_S\) تماماً كما يحدث عندما توضع قطعتان من المغناطيس قرب بعضهما البعض».`],
   ['بسبب التيارات الدوامية في الدوار',false,'التيارات الدوامية طريقة بدء خاصة (الدرس 4.2)، لا سبب التشغيل العادي.']]}]})}
   ]},

  {st:5,short:'فقد التزامن',title:'فقد التزامن: عندما يزيد الحمل عن طاقته',ref:'ص 127',
   q:'المحرك الحثي إذا زاد حمله تقل سرعته قليلاً… فماذا يفعل المحرك التزامني الذي لا تتغير سرعته؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="زاوية العزم: من صفر إلى سالب تسعين منطقة مستقرة، وبعدها فقد التزامن" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="145" fill="#FBE6C4"/><path data-tip="منطقة التشغيل المستقر للمحرك: زاوية العزم δ بين ⟦0°⟧ و⟦−90°⟧. كلما زاد الحمل كبرت δ." d="M118 92L268 92A150 150 0 0 1 118 242Z" fill="#BFE3CF"/><path data-tip="إذا زاد الحمل عن العزم الأقصى (أي ⟦δ < −90°⟧) يفقد الدوار التزامن ويتباطأ حتى يتوقف." d="M118 92L118 242A150 150 0 0 1 25.7 210.2Z" fill="#F4C3B6"/><path d="M268 92A150 150 0 0 1 25.7 210.2" fill="none" stroke="#2C4A40" stroke-width="2" stroke-dasharray="5 4"/><g data-tip="جهد الوجه ⟦Vph⟧: المرجع الذي تُقاس منه زاوية العزم δ."><line x1="118" y1="92" x2="270" y2="92" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><polygon points="286,92 270,99.2 270,84.8" fill="#2C4A40"/></g><text x="272" y="80" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">V<tspan font-size="10" dy="4">ph</tspan><tspan dy="-4">&#8203;</tspan></text><g data-tip="الجهد الداخلي ⟦Eph⟧ يتأخر عن ⟦Vph⟧ بزاوية العزم δ (سالبة في المحرك)."><line x1="118" y1="92" x2="210" y2="154.1" stroke="#E8735A" stroke-width="4" stroke-linecap="round"/><polygon points="224.1,163.6 205.7,160.4 214.3,147.7" fill="#E8735A"/></g><path d="M176 92A58 58 0 0 1 166.1 124.4" fill="none" stroke="#E8735A" stroke-width="2"/><text x="190" y="114" text-anchor="middle" font-size="16" fill="#E8735A" font-weight="700" direction="rtl">δ</text><text x="266" y="116" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">0°</text><text x="118" y="260" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">−90°</text><text x="198" y="186" text-anchor="middle" font-size="15" fill="#12855A" font-weight="700" direction="rtl">مستقر</text><text x="84" y="176" text-anchor="middle" font-size="14" fill="#B23A2A" font-weight="700" direction="rtl">فقد</text><text x="84" y="194" text-anchor="middle" font-size="14" fill="#B23A2A" font-weight="700" direction="rtl">التزامن</text><path d="M242.1 196.1A162 162 0 0 1 146.1 251.5" fill="none" stroke="#2C4A40" stroke-width="2.5"/><line x1="157.2" y1="249.2" x2="144.8" y2="251.4" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><polygon points="134.9,253.1 144,246.9 145.6,255.8" fill="#2C4A40"/><text x="262" y="252" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">الحمل يزيد</text></svg>`,
   cap:'زاوية العزم δ تكبر مع الحمل داخل المنطقة الخضراء، فإذا تجاوزت <span class="ltr">−90°</span> فقد المحرك التزامن.<br><b>مرّر المؤشر على المنطقتين والسهمين (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'زاد الحمل على المحرك التزامني عن العزم الأقصى له. ماذا يحدث؟',opts:[
     ['تقل سرعته قليلاً ويستمر في الدوران',false,'هذا سلوك المحرك الحثي. التزامني إما أن يدور بالسرعة التزامنية تماماً أو يفقد التزامن.'],
     ['يفقد التزامن، ويبدأ بالتباطؤ التدريجي حتى يتوقف',true,'هذا نص الكتاب ص 127.'],
     ['تزيد سرعته عن السرعة التزامنية',false,'الحمل الزائد يبطئ المحرك ولا يسرّعه.']]}}
   ],
   body:[
    {book:String.raw`<p>وفي حالة زيادة الحمل عن العزم الأقصى للمحرك (أي أن <span class="ltr">δ &lt; −90°</span>) فإن العضو الدوار <b>سيفقد التزامن</b> ويبدأ بالتباطؤ التدريجي حتى يتوقف.</p>`,ref:'ص 127'},
    {watch:String.raw`<p>شرط فقد التزامن مطبوع في الكتاب «(أي أن 90-&lt; δ)» وهي صياغة ملتبسة بسبب اتجاه الكتابة. المقصود أن مقدار δ يتجاوز <span class="ltr">90°</span>؛ وبما أن δ سالبة في المحرك حسب اصطلاح الكتاب فالشرط هو <span class="ltr">δ &lt; −90°</span>.</p>`,fix:true},
    {tip:String.raw`<p>من المعادلة (3-15) القدرة تتناسب مع \(\sin\delta\)، وأكبر قيمة لها عند \(\delta=-90^\circ\). كلما زاد الحمل كبرت δ ليعطي المحرك عزماً أكبر، فإذا طلب الحمل أكثر مما يعطيه المحرك عند \(-90^\circ\) لم يعد المجال قادراً على سحب الدوار، فيفلت منه ويتباطأ.</p>`,title:'لماذا عند −90°؟'},
    {title:'مختبر مصغّر: حمّل المحرك حتى يفقد التزامن',widget:(el,B)=>DCML.lab(el,B,{intro:String.raw`آلة مثال (4-1): \(V_{ph} = 208\ \text{V}\)، \(E_{ph} = 255\ \text{V}\)، \(X_S = 2.5\ \Omega\)، فأكبر قدرة \(P_{max} = 3V_{ph}E_{ph}/X_S \approx 63.6\ \text{kW}\). زد الحمل (أرقام تختارها أنت).`,
 predict:{q:'زاد الحمل حتى تجاوز القدرة القصوى للمحرك. ماذا يحدث؟',opts:[
  ['تقل السرعة قليلاً ويستمر المحرك',false,'المحرك التزامني لا يعمل بسرعة أقل من التزامنية؛ إما أن يبقى عليها أو يفقد التزامن.'],
  ['يفقد التزامن ويتباطأ تدريجياً حتى يتوقف',true,'«في حالة زيادة الحمل عن العزم الأقصى للمحرك (أي أن <bdi class="ltr">δ &lt; −90°</bdi>) فإن العضو الدوار سيفقد التزامن ويبدأ بالتباطؤ التدريجي حتى يتوقف».'],
  ['تزيد δ بلا حد ويستمر بالسرعة التزامنية',false,'بعد <bdi class="ltr">−90°</bdi> تقل القدرة التي يعطيها المحرك مع زيادة δ، فلا يستطيع حمل الحمل.']]},
 ins:[{k:'P',l:'القدرة الداخلة P',min:0,max:80,step:0.5,v:14,u:'kW',dp:1}],
 calc:(s,v,B)=>{const Pm=PMAX/1000,ok=s.P<=Pm,d=ok?-Math.asin(s.P/Pm)*180/Math.PI:null;
  return {facts:[['زاوية العزم δ',ok?DCML.fm(B,d,1)+'°':'—',ok?'hi':'bad'],['<bdi class="ltr">P / P<sub>max</sub></bdi>',DCML.fm(B,s.P/Pm*100,0)+'%',ok?'':'bad'],['الحالة',ok?'متزامن':'فقد التزامن',ok?'':'bad']],
   plot:{xr:[-180,0],yr:[0,70],xt:[-180,-135,-90,-45,0],yt:[0,20,40,60],fx:v=>v+'°',xl:'δ',yl:'P (kW)',curves:[{f:x=>-Pm*Math.sin(x*Math.PI/180),col:'--blue'}],cur:ok?[d,s.P]:null},
   msg:!ok?'الحمل أكبر من القدرة القصوى: لا توجد زاوية تعطيه، فيفقد المحرك التزامن ويتباطأ حتى يتوقف.':d<-60?'اقتربت δ من <bdi class="ltr">−90°</bdi>: المحرك قرب حد فقد التزامن.':'المحرك متزامن: كلما زاد الحمل كبرت δ (بالسالب) والسرعة ثابتة.',cls:!ok?'bad':d<-60?'warn':''}}})}
   ]},

  {recap:[
   String.raw`المحرك التزامني: العضو الثابت يُغذّى بجهد ثلاثي الأوجه فيصنع مجالاً \(B_S\) يدور بالسرعة التزامنية، وملفات المجال تُغذّى بتيار مستمر فتصنع مجال الدوار \(B_R\) (ص 126).`,
   String.raw`الدائرة المكافئة مع إهمال مقاومة العضو الثابت والتيار داخل إلى الآلة، المعادلة (4-1): \(E_{ph}=V_{ph}-jX_SI_{ph}\)`,
   String.raw`الآلة تعمل محركاً عندما تكون δ سالبة في المعادلة (3-15): \(P_o=3\,V_{ph}E_{ph}\sin\delta/X_S\)`,
   String.raw`لا يبدأ المحرك وحده: يجب إيصال الدوار إلى السرعة التزامنية أو قربها قبل تغذية المجال، وبعدها لا تتغير سرعته مهما تغير الحمل ضمن الحمل المقنن.`,
   String.raw`إذا زاد الحمل عن العزم الأقصى (\(\delta<-90^\circ\)) يفقد التزامن ويتباطأ حتى يتوقف (ص 127).`]}
],
 theory:[
  {h:'الهدف العام والأهداف التفصيلية',ref:'ص 125',html:`<p><b>الهدف العام للوحدة:</b> الإلمام الشامل بكيفية تشغيل وأداء المحركات التزامنية ثلاثية الأوجه وتطبيقاتها.</p><p><b>الأهداف التفصيلية:</b></p><ol>
   <li>أن يلم المتدرب بنظرية عمل المحركات التزامنية.</li><li>أن يلم المتدرب بطرق بدء حركة المحركات التزامنية.</li><li>أن يفهم المتدرب كيفية التحكم في معامل القدرة ومنحنيات (V) للمحرك التزامني.</li><li>أن يلم المتدرب بكيفية استخدام المحرك التزامني كمكثف تزامني.</li><li>أن يتمكن المتدرب من إجراء الحسابات المتعلقة بتشغيل المحركات التزامنية ثلاثية الأوجه.</li><li>أن يتمكن المتدرب من حساب القدرة والعزم والكفاءة للمحركات التزامنية.</li><li>أن يفهم المتدرب سلوك المحرك التزامني عند تغير الحمل أو تيار المجال.</li><li>أن يتمكن المتدرب من رسم المخطط الاتجاهي وكيفية استخدامه للتحكم في هذه المحركات.</li></ol>
   <p class="sub">الوقت المتوقع والمتطلبات السابقة لم يذكرهما الكتاب لهذه الوحدة. صفحة الغلاف ص 124.</p>`},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'الهدف السادس (حساب القدرة والعزم والكفاءة) لا تغطيه الوحدة: لا توجد فيها معادلة أو مثال للعزم أو للكفاءة؛ الأمثلة تحسب القدرة الداخلة والتيار والجهد الداخلي ومعامل القدرة فقط.'+'</div>'},
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
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'ص 127: يقول الكتاب إن \\(B_R\\) «سيحاول أن يكون <b>متعامداً</b> مع \\(B_S\\) كما يحدث لقطعتي مغناطيس». والصحيح أن قطعتي المغناطيس <b>تتحاذيان</b>، فمجال الدوار يحاول أن <b>ينطبق</b> على مجال الثابت، والزاوية الصغيرة بينهما هي δ وتكبر مع الحمل (وهذا ما يرسمه الكتاب نفسه في الشكل 4-2: السهمان متقاربان). في المختبر زر «كما في الكتاب / المصحح» يبين الفرق.'+'</div>'},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'ص 127: شرط فقد التزامن مطبوع «(أي أن 90-&lt; δ)» وهي صياغة ملتبسة بسبب اتجاه الكتابة. المقصود أن مقدار δ يتجاوز <span class="ltr">90°</span>؛ وبما أن δ سالبة في المحرك حسب اصطلاح الكتاب فالشرط هو <span class="ltr">δ &lt; −90°</span>. وفي ص 127 أيضاً خطأ إملائي «أيجاد» والصحيح «إيجاد».'+'</div>'},
  {note:`<b>توضيح للمتدرب (ليس من نص الكتاب):</b> لماذا لا يبدأ المحرك وحده؟ المجال \\(B_S\\) يدور 50 أو 60 دورة في الثانية، والدوار الثقيل واقف. في نصف الدورة يجذب المجالُ القطبَ إلى الأمام، وفي النصف التالي يجذبه إلى الخلف، فمتوسط العزم صفر ويبقى الدوار يهتز في مكانه. أما إذا كان الدوار يدور قريباً من \\(n_s\\) فإن الزاوية بين المجالين تتغير ببطء، فيتمكن المجال من «الإمساك» بالقطب وسحبه معه. وسرعة المجال حسب العلاقة المعروفة \\(n_s=120f/P\\): للمحرك ذي القطبين على <span class="ltr">60 Hz</span> تكون <span class="ltr">3600 rpm</span>.`}
 ],
 lab:(el)=>{
  const sim=makeSim('none');let book=1,lastS='',sawVib=0,sawLost=0,sawRun=0;
  el.innerHTML=`<div id="l1tp"></div><div class="grid">
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
  const d40=()=>fm(-Math.asin(clamp(0.40+TP.v.fric,0,1))/D,0),d40S=()=>`<span data-l1d>${d40()}</span>`;
  const TP=B.params($('#l1tp'),'u4-l1',simDefs(),()=>{simTP(sim,TP);el.querySelectorAll('[data-l1d]').forEach(e=>e.textContent=d40())});simTP(sim,TP);
  const bkTxt=()=>{$('#l1bk').innerHTML=book?'<b>كما في الكتاب:</b> «B<sub>R</sub> سيحاول أن يكون متعامداً مع B<sub>S</sub>» — لذلك يُرسم مجال الدوار هنا متأخراً 90° زيادة على δ. لاحظ أن هذا يخالف الشكل (4-2) نفسه.':'<span class="fixnote"><b>المصحح:</b> مجال الدوار يحاول أن ينطبق على مجال الثابت كقطعتي مغناطيس؛ الزاوية بينهما هي δ فقط، صغيرة بلا حمل وتكبر مع الحمل.</span>'};bkTxt();
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
   {t:'حمّل المحرك',get x(){return `ارفع الحمل إلى نحو <span class="ltr">40%</span>: السرعة لا تتغير، لكن الدوار يتأخر عن المجال بزاوية أكبر (<span class="ltr">δ ≈ ${d40S()}°</span>؛ أكبر قليلاً من حمل 40% وحده لأن المحاكاة تحسب الاحتكاك أيضاً)، ويطول E<sub>ph</sub>sin δ في المخطط الاتجاهي.`},done:()=>sim.locked&&sim.TL>=0.38},
   {t:'تجاوز العزم الأقصى',x:'ارفع الحمل فوق <span class="ltr">100%</span>: تبلغ δ القيمة −90° ثم يفقد الدوار التزامن ويتباطأ حتى يتوقف (ص 127).',done:()=>sawLost},
   {t:'أعد التشغيل',x:'اضغط «إعادة» وكرر التشغيل الصحيح: العضو الثابت ← محرك البدء ← تيار المجال ← افصل محرك البدء.'}]);
  loopOn(el,dt=>{simTP(sim,TP);sim.step(dt);if(sim.field==='dc'&&sim.stator&&!sim.locked&&sim.w<0.02&&sim.vibT>1.2)sawVib=1;if(sim.lost&&sim.w<0.02)sawLost=1;
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
 stations:[
  {intro:true},

  {st:1,short:'المحرك الخارجي',title:'1- البدء باستخدام المحرك الخارجي',ref:'ص 128',
   q:'رأينا في الدرس السابق أن الدوار يجب أن يصل إلى السرعة التزامنية أو قربها قبل تغذية المجال… فمن يوصله إليها؟ أبسط فكرة: محرك آخر يديره.',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="محرك بدء صغير على عمود المحرك التزامني نفسه، ومفتاح تيار المجال المستمر" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><line data-tip="عمود دوران واحد مشترك: محرك البدء والمحرك التزامني مركّبان عليه معاً." x1="30" y1="160" x2="330" y2="160" stroke="#8A9A93" stroke-width="8" stroke-linecap="round"/><g data-tip="محرك البدء (المحرك الخارجي): يدير المحرك التزامني حتى يصل إلى السرعة التزامنية، ثم يُفصل."><rect x="44" y="122" width="76" height="76" rx="10" fill="#4FB3A9" stroke="#2C4A40" stroke-width="3"/><line x1="56" y1="126" x2="56" y2="194" stroke="#2C4A40" stroke-width="1.5" opacity=".5"/><line x1="66" y1="126" x2="66" y2="194" stroke="#2C4A40" stroke-width="1.5" opacity=".5"/><line x1="76" y1="126" x2="76" y2="194" stroke="#2C4A40" stroke-width="1.5" opacity=".5"/><line x1="86" y1="126" x2="86" y2="194" stroke="#2C4A40" stroke-width="1.5" opacity=".5"/><line x1="96" y1="126" x2="96" y2="194" stroke="#2C4A40" stroke-width="1.5" opacity=".5"/><line x1="106" y1="126" x2="106" y2="194" stroke="#2C4A40" stroke-width="1.5" opacity=".5"/></g><g data-tip="المحرك التزامني: لا يبدأ الدوران وحده، فيديره محرك البدء أولاً."><rect x="168" y="96" width="140" height="128" rx="14" fill="#CFE6DB" stroke="#2C4A40" stroke-width="3"/><line x1="182" y1="102" x2="182" y2="218" stroke="#2C4A40" stroke-width="1.5" opacity=".45"/><line x1="194" y1="102" x2="194" y2="218" stroke="#2C4A40" stroke-width="1.5" opacity=".45"/><line x1="206" y1="102" x2="206" y2="218" stroke="#2C4A40" stroke-width="1.5" opacity=".45"/><line x1="218" y1="102" x2="218" y2="218" stroke="#2C4A40" stroke-width="1.5" opacity=".45"/><line x1="230" y1="102" x2="230" y2="218" stroke="#2C4A40" stroke-width="1.5" opacity=".45"/><line x1="242" y1="102" x2="242" y2="218" stroke="#2C4A40" stroke-width="1.5" opacity=".45"/><line x1="254" y1="102" x2="254" y2="218" stroke="#2C4A40" stroke-width="1.5" opacity=".45"/><line x1="266" y1="102" x2="266" y2="218" stroke="#2C4A40" stroke-width="1.5" opacity=".45"/><line x1="278" y1="102" x2="278" y2="218" stroke="#2C4A40" stroke-width="1.5" opacity=".45"/><line x1="290" y1="102" x2="290" y2="218" stroke="#2C4A40" stroke-width="1.5" opacity=".45"/></g><rect data-tip="وصلة (قارنة) تربط عمودي المحركين." x="136" y="146" width="18" height="28" rx="3" fill="#2C4A40"/><text x="82" y="108" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">محرك البدء</text><text x="238" y="84" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">المحرك التزامني</text><g data-tip="مفتاح تيار المجال: يُغلق فيُغذّى المجال بالتيار المستمر عندما تصل السرعة إلى السرعة التزامنية، وعندها يُفصل محرك البدء."><rect x="196" y="262" width="88" height="30" rx="8" fill="#E8735A"/><text x="240" y="282" text-anchor="middle" font-size="13" fill="#FFFFFF" font-weight="700" direction="rtl">تيار مستمر</text><path d="M240 262V246M240 246L256 234M240 232V224" fill="none" stroke="#E8735A" stroke-width="3" stroke-linecap="round"/><circle cx="240" cy="246" r="3.5" fill="#E8735A"/><circle cx="240" cy="232" r="3.5" fill="#E8735A"/></g><path d="M60 232 A40 14 0 0 0 104 232" fill="none" stroke="#2C4A40" stroke-width="3"/><line x1="98" y1="236" x2="98" y2="236" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><polygon points="106,230 100.7,239.6 95.3,232.4" fill="#2C4A40"/><text x="82" y="262" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="600" direction="rtl">يدير أولاً</text></svg>`,
   cap:'محرك البدء يدير المحرك التزامني على العمود نفسه، ثم يُغذّى المجال ويُفصل محرك البدء.<br><b>مرّر المؤشر على المحركين والعمود والمفتاح (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'متى نغذي ملفات المجال بالتيار المستمر في هذه الطريقة؟',opts:[
     ['قبل تشغيل محرك البدء، والدوار واقف',false,'والدوار واقف لا يستطيع الدوار أن يلحق بالمجال (الدرس السابق).'],
     ['عندما تصل السرعة إلى السرعة التزامنية، ثم يُفصل محرك البدء',true,'هذا ترتيب الكتاب: «حتى تصل السرعة إلى السرعة التزامنية وعندها تغذى ملفات المجال بالتيار المستمر ويفصل محرك البدء».'],
     ['لا نغذيها أبداً؛ محرك البدء يبقى يدير المحرك',false,'محرك البدء يُفصل بعد الوصول إلى التزامن، والمحرك التزامني يكمل وحده بعزمه.']]}}
   ],
   body:[
    {book:String.raw`<p>بحيث يدار المحرك التزامني بواسطة محرك يركب على نفس العمود حتى تصل السرعة إلى السرعة التزامنية وعندها تغذى ملفات المجال بالتيار المستمر ويفصل محرك البدء وعندها ينتج عزم ذا اتجاه واحد يجعل المحرك يحافظ على السرعة التزامنية مهما تغير الحمل ضمن الحمل المقنن ما لم يفقد التزامن.</p>`,ref:'ص 128'},
    {tip:String.raw`<p>محرك البدء يحتاج أن يحمل المحرك التزامني فقط (وهو بلا حمل أثناء البدء)، لذلك يكفي أن يكون محركاً صغيراً. لكنه جهاز إضافي على العمود، وخطوات التشغيل متتابعة: شغّل محرك البدء ← انتظر السرعة التزامنية ← غذِّ المجال ← افصل محرك البدء.</p>`,title:'ماذا يعني ذلك عملياً؟'},
    {title:'مختبر مصغّر: رتّب خطوات البدء بالمحرك الخارجي',widget:(el,B)=>DCML.order(el,B,{steps:[
  ['أدر المحرك التزامني بمحرك بدء مركب على نفس العمود','لا شيء يبدأ قبل أن يُدار الدوار.'],
  ['عندما تصل السرعة إلى السرعة التزامنية غذِّ ملفات المجال بالتيار المستمر','نغذي المجال بعد الوصول إلى السرعة التزامنية، لا قبلها.'],
  ['افصل محرك البدء','لا نفصل محرك البدء قبل تغذية المجال، وإلا تباطأ الدوار.'],
  ['يحافظ المحرك على السرعة التزامنية مهما تغير الحمل ضمن المقنن','هذه النتيجة بعد اكتمال الخطوات.']],
 done:'وتذكّر الملاحظة العامة (المحطة 5): قبل تغذية المجال تكون ملفاته مقصورة عبر مقاومة.'})}
   ]},

  {st:2,short:'قضبان التخميد',title:'2- البدء باستخدام قضبان التخميد',ref:'ص 128',
   q:'ماذا لو جعلنا المحرك التزامني يبدأ «كأنه محرك حثي»، ثم يتحول إلى تزامني عند الوصول قرب السرعة التزامنية؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="حذاء قطب فيه قضبان تخميد مقصورة بحلقتين نحاسيتين من الجهتين مثل القفص السنجابي" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><rect data-tip="جسم القطب البارز، وعليه ملفات المجال." x="140" y="196" width="80" height="70" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2.5"/><rect data-tip="حذاء القطب: الجزء العريض من القطب المقابل للثغرة الهوائية، وفيه تُركّب قضبان التخميد." x="70" y="96" width="220" height="100" rx="16" fill="#E4F1EA" stroke="#2C4A40" stroke-width="3"/><g data-tip="قضبان التخميد: قضبان مركّبة في أحذية الأقطاب، يتولد فيها تيار بالحث أثناء البدء فتعطي عزماً كالمحرك الحثي."><rect x="84" y="110" width="192" height="9" rx="4.5" fill="#F2C14E" stroke="#B9852A" stroke-width="1.2"/><rect x="84" y="128" width="192" height="9" rx="4.5" fill="#F2C14E" stroke="#B9852A" stroke-width="1.2"/><rect x="84" y="146" width="192" height="9" rx="4.5" fill="#F2C14E" stroke="#B9852A" stroke-width="1.2"/><rect x="84" y="164" width="192" height="9" rx="4.5" fill="#F2C14E" stroke="#B9852A" stroke-width="1.2"/><rect x="84" y="178" width="192" height="9" rx="4.5" fill="#F2C14E" stroke="#B9852A" stroke-width="1.2"/></g><g data-tip="حلقة نحاسية من كل جهة تقصر القضبان، فيصير الشكل ما يشبه القفص السنجابي في المحركات الحثية."><rect x="72" y="102" width="14" height="88" rx="5" fill="#E8735A"/><rect x="274" y="102" width="14" height="88" rx="5" fill="#E8735A"/></g><text x="180" y="60" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" direction="rtl">قضبان التخميد في حذاء القطب</text><text x="180" y="80" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="600" direction="rtl">مقصورة بحلقتين من الجهتين</text><text x="180" y="292" text-anchor="middle" font-size="14" fill="#B9852A" font-weight="700" direction="rtl">تبدأ كقفص سنجابي</text></svg>`,
   cap:'قضبان في أحذية الأقطاب مقصورة بحلقتين نحاسيتين: تشبه القفص السنجابي (رسم توضيحي؛ لا يوجد شكل في الكتاب).<br><b>مرّر المؤشر على القضبان والحلقتين والقطب (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'بعد أن يصل المحرك إلى السرعة التزامنية، كم يكون التيار في قضبان التخميد؟',opts:[
     ['أكبر ما يمكن، لأنها تحمل الحمل كله',false,'عند السرعة التزامنية لا يقطع المجال الدوار القضبان، فلا يتولد فيها جهد ولا تيار.'],
     ['نصف تيار البدء تقريباً',false,'لا: التيار فيها يعتمد على الفرق بين سرعة المجال وسرعة الدوار، وهذا الفرق صار صفراً.'],
     ['صفر، فيتلاشى تأثيرها ويصبح العزم عزم المحرك التزامني',true,'نص الكتاب: «يتلاشى تأثير قضبان التخميد لأن التيارات المارة بها عند السرعة التزامنية تساوي صفراً».']]}}
   ],
   body:[
    {book:String.raw`<p>وذلك بتركيب مجموعة من القضبان في أحذية الأقطاب ثم تقصر هذه القضبان بحلقات نحاسية من الجهتين بحيث تكون ما يشبه <b>القفص السنجابي</b> في المحركات الحثية، وفي هذه الحالة وعند توصيل التيار الكهربائي <b>يبدأ المحرك بالدوران على أساس أنه محرك حثي</b>، وعندما تصل السرعة إلى قرب السرعة التزامنية تغذى ملفات المجال بالتيار المستمر وعندها يتكون مجال مغناطيسي دوار آخر يؤدي وجوده مع المجال الناتج عن العضو الثابت إلى نقل المحرك إلى السرعة التزامنية، وعندها يتلاشى تأثير قضبان التخميد لأن التيارات المارة بها عند السرعة التزامنية تساوي صفراً، ويكون العزم الناتج في هذه الحالة هو عزم المحرك التزامني وليس الحثي، ويحافظ المحرك على سرعته عند السرعة التزامنية مهما تغير الحمل ما لم يفقد التزامن.</p>`,ref:'ص 128'},
    {title:'تابع البدء بقضبان التخميد خطوة خطوة',widget:(el,B)=>{
      const S=['وصّل العضو الثابت بالمصدر','يقطع المجال الدوار القضبان فيمر فيها تيار بالحث','يبدأ الدوران كمحرك حثي','قرب السرعة التزامنية: غذِّ ملفات المجال بالتيار المستمر','ينتقل المحرك إلى السرعة التزامنية','تيار القضبان = صفر، والعزم عزم المحرك التزامني'];
      el.innerHTML=`<p class="sub" style="margin:0 0 10px">اضغط «ابدأ» وتابع ترتيب الخطوات كما يصفها الكتاب.</p><div class="chain">${S.map((s,i)=>`<span class="ck${i===S.length-1?' end':''}">${s}</span>${i<S.length-1?'<span class="ar">←</span>':''}`).join('')}</div><div class="w-row"><button class="btn pri" type="button" data-go>ابدأ</button><button class="btn" type="button" data-rs>إعادة</button></div>`;
      const ks=[...el.querySelectorAll('.ck')];let tm=[];
      const rs=()=>{tm.forEach(clearTimeout);tm=[];ks.forEach(k=>k.classList.remove('on'))};
      el.querySelector('[data-go]').onclick=()=>{rs();ks.forEach((k,i)=>tm.push(setTimeout(()=>k.classList.add('on'),i*650)))};
      el.querySelector('[data-rs]').onclick=rs;
    }},
    {tip:String.raw`<p>قضبان التخميد مدمجة في الدوار نفسه، فلا تحتاج جهازاً إضافياً على العمود كما في الطريقة الأولى. والمحرك يبدأ وحده عند توصيله بالمصدر، ثم نغذي المجال قرب السرعة التزامنية.</p>`,title:'ما الذي كسبناه؟'}
   ]},

  {st:3,short:'التيارات الدوامية',title:'3- البدء باستخدام ظاهرة التيارات الدوامية',ref:'ص 128',
   q:'هل يمكن أن يبدأ المحرك التزامني دون قضبان تخميد ودون محرك خارجي؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="عضو دوار مصمت تتولد فيه تيارات دوامية داخل مجال العضو الثابت الدوار" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="156" r="146" fill="#F7DCC8"/><circle data-tip="العضو الثابت: يصنع المجال الدوار." cx="180" cy="156" r="122" fill="#2C4A40"/><circle cx="180" cy="156" r="100" fill="#FBF6EE"/><circle data-tip="عضو دوار مصمت: قطعة حديد واحدة بلا قضبان تخميد." cx="180" cy="156" r="86" fill="#C9D3CF" stroke="#2C4A40" stroke-width="2.5"/><g data-tip="تيارات دوامية: تتولد بالحث في جسم الدوار المصمت أثناء البدء، فتعطي عزماً مشابهاً لعزم المحرك الحثي، وتتلاشى عند السرعة التزامنية."><ellipse cx="140" cy="120" rx="26" ry="15" fill="none" stroke="#E8735A" stroke-width="3" stroke-dasharray="6 4"/><line x1="164" y1="116" x2="163.8" y2="115.3" stroke="#E8735A" stroke-width="2.5" stroke-linecap="round"/><polygon points="166,123 160.3,116.3 167.3,114.3" fill="#E8735A"/><ellipse cx="222" cy="128" rx="24" ry="14" fill="none" stroke="#E8735A" stroke-width="3" stroke-dasharray="6 4"/><line x1="244" y1="124" x2="243.8" y2="123.3" stroke="#E8735A" stroke-width="2.5" stroke-linecap="round"/><polygon points="246,131 240.3,124.3 247.3,122.3" fill="#E8735A"/><ellipse cx="150" cy="196" rx="24" ry="14" fill="none" stroke="#E8735A" stroke-width="3" stroke-dasharray="6 4"/><line x1="172" y1="192" x2="171.8" y2="191.3" stroke="#E8735A" stroke-width="2.5" stroke-linecap="round"/><polygon points="174,199 168.3,192.3 175.3,190.3" fill="#E8735A"/><ellipse cx="216" cy="190" rx="26" ry="15" fill="none" stroke="#E8735A" stroke-width="3" stroke-dasharray="6 4"/><line x1="240" y1="186" x2="239.8" y2="185.3" stroke="#E8735A" stroke-width="2.5" stroke-linecap="round"/><polygon points="242,193 236.3,186.3 243.3,184.3" fill="#E8735A"/></g><g data-tip="المجال الدوار من العضو الثابت: يدور بالسرعة التزامنية ⟦ns⟧."><path d="M297.8 88A136 136 0 0 0 226.5 28.2" fill="none" stroke="#3B6FB6" stroke-width="3"/><line x1="235.3" y1="31.8" x2="228" y2="29.5" stroke="#3B6FB6" stroke-width="3" stroke-linecap="round"/><polygon points="217.5,26.3 229.5,24.8 226.5,34.2" fill="#3B6FB6"/><text x="300" y="52" text-anchor="middle" font-size="15" fill="#3B6FB6" font-weight="700" direction="ltr" font-family="var(--mono)">n<tspan font-size="10" dy="4">s</tspan><tspan dy="-4">&#8203;</tspan></text></g><text x="180" y="152" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">دوار</text><text x="180" y="170" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">مصمت</text><text x="180" y="300" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">للمحركات التزامنية الصغيرة</text></svg>`,
   cap:'عضو دوار مصمت تتولد فيه تيارات دوامية فتعطي عزماً كالمحرك الحثي (رسم توضيحي؛ لا يوجد شكل في الكتاب).<br><b>مرّر المؤشر على الدوار والحلقات المتقطعة والسهم (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'لأي المحركات التزامنية تناسب هذه الطريقة حسب الكتاب؟',opts:[
     ['للمحركات التزامنية الكبيرة جداً',false,'الكتاب يقول العكس.'],
     ['للمحركات التزامنية الصغيرة',true,'نص الكتاب: «وهذه الطريقة مناسبة للمحركات التزامنية الصغيرة».'],
     ['لكل المحركات التزامنية بلا استثناء',false,'الكتاب يحددها للمحركات الصغيرة.']]}}
   ],
   body:[
    {book:String.raw`<p>وجدت حديثاً محركات تزامنية ذات <b>عضو دوار مصمت</b> وبدون قضبان تخميد تبدأ حركتها على هذا الأساس بحيث تكون التيارات الدوامية المتولدة في العضو الدوار المصمت عزم مشابه لعزم المحرك الحثي، وعندما يتسارع العضو الدوار وتصل سرعته قرب السرعة التزامنية سيعلق بالمجال المغناطيسي الدوار الناتج عن العضو الثابت وسيدور معه بنفس السرعة وعندئذ ستتلاشى التيارات الدوامية، وهذه الطريقة <b>مناسبة للمحركات التزامنية الصغيرة</b>.</p>`,ref:'ص 128'},
    {tip:String.raw`<p>التيارات الدوامية هنا تقوم بعمل قضبان التخميد نفسه: تيارات تتولد بالحث في جسم الدوار الحديدي المصمت أثناء البدء فتعطي عزماً، ثم تتلاشى عند السرعة التزامنية لأن المجال لم يعد يقطع الدوار.</p>`,title:'تشبه قضبان التخميد'},
    {add:String.raw`<p>التيارات الدوامية نفسها هي التي نحاول <b>تقليلها</b> في المحولات وقلوب المحركات العادية باستخدام رقائق حديد معزولة، لأنها تسبب حرارة وفقداً. هنا يُستفاد منها عمداً في البدء.</p>`,title:'ظاهرة تعرفها من قبل'},
    {title:'مختبر مصغّر: صح أم خطأ؟',widget:(el,B)=>DCML.tf(el,B,{items:[
  ['هذه الطريقة تستعمل عضواً دواراً مصمتاً بدون قضبان تخميد.',true,'«محركات تزامنية ذات عضو دوار مصمت وبدون قضبان تخميد».'],
  ['التيارات الدوامية تبقى في الدوار بعد الوصول إلى السرعة التزامنية.',false,'«وعندئذ ستتلاشى التيارات الدوامية».'],
  ['هذه الطريقة مناسبة للمحركات التزامنية الكبيرة.',false,'«وهذه الطريقة مناسبة للمحركات التزامنية الصغيرة».']]})}
   ]},

  {st:4,short:'مصدر متغير التردد',title:'4- البدء باستخدام مصدر جهد متغير التردد',ref:'ص 129',
   q:'المشكلة أن المجال يدور بسرعة كبيرة والدوار واقف… فماذا لو جعلنا المجال نفسه يبدأ بطيئاً جداً؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="رسم التردد مع الزمن: يبدأ منخفضاً جداً ثم يرتفع تدريجياً حتى السرعة المطلوبة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DCEAF7"/><rect data-tip="مصدر جهد متغير التردد: يعتمد على إلكترونيات القدرة، ويغذي العضو الثابت بتردد نختاره." x="90" y="22" width="180" height="34" rx="9" fill="#3B6FB6"/><text x="180" y="45" text-anchor="middle" font-size="14" fill="#FFFFFF" font-weight="700" direction="rtl">مصدر متغير التردد</text><path d="M62 76V262H318" fill="none" stroke="#2C4A40" stroke-width="2.5"/><line x1="62" y1="262" x2="62" y2="85.5" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><polygon points="62,70 69,85.5 55,85.5" fill="#2C4A40"/><line x1="62" y1="262" x2="310.5" y2="262" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><polygon points="326,262 310.5,269 310.5,255" fill="#2C4A40"/><text x="48" y="86" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">f</text><text x="318" y="284" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">t</text><line data-tip="التردد المطلوب: يصل إليه المحرك في النهاية، والدوار يدور مع المجال بالسرعة نفسها ما لم يفقد التزامن." x1="62" y1="112" x2="312" y2="112" stroke="#8A9A93" stroke-width="2" stroke-dasharray="6 5"/><text x="262" y="104" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="600" direction="rtl">التردد المطلوب</text><g data-tip="البداية: تردد منخفض جداً، فيدور المجال ببطء شديد ويتمكن الدوار من أن يعلق به."><circle cx="78" cy="242" r="7" fill="#E8735A"/></g><path data-tip="يرفع التردد تدريجياً، فتزداد سرعة المجال والدوار معه، حتى يصل المحرك إلى السرعة المطلوبة." d="M78 242L222 112H312" fill="none" stroke="#E8735A" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><text x="150" y="236" text-anchor="middle" font-size="13" fill="#C4552F" font-weight="700" direction="rtl">يبدأ منخفضاً جداً</text><text x="138" y="168" text-anchor="middle" font-size="13" fill="#C4552F" font-weight="700" direction="rtl" transform="rotate(-38 138 168)">ثم يُرفع تدريجياً</text></svg>`,
   cap:'التردد يبدأ منخفضاً جداً ثم يُرفع تدريجياً، والدوار يدور مع المجال طوال الوقت.<br><b>مرّر المؤشر على النقطة والخط والمصدر (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'لماذا نخفض التردد في بداية التشغيل؟',opts:[
     ['حتى تصبح سرعة المجال الدوار قليلة جداً فيتمكن الدوار من أن يعلق به',true,'نص الكتاب: «بخفض التردد إلى أن تصبح سرعة المجال المغناطيسي الدوار قليلة جداً بحيث يتمكن العضو الدوار من أن يعلق به».'],
     ['لنقلل تيار المجال المستمر',false,'تيار المجال لا يتعلق بالتردد؛ التردد يحدد سرعة المجال الدوار.'],
     ['حتى يعمل المحرك كمحرك حثي',false,'هذا ما تفعله قضبان التخميد، لا المصدر متغير التردد.']]}}
   ],
   body:[
    {book:String.raw`<p>يمكن بدء دوران المحرك التزامني بسهولة إذا كان يغذى من <b>مصدر جهد متغير التردد</b> والذي بدأ ينتشر في السنوات الأخيرة بفضل التقدم في تقنية إلكترونيات القدرة، وذلك بخفض التردد إلى أن تصبح سرعة المجال المغناطيسي الدوار قليلة جداً بحيث يتمكن العضو الدوار من أن يعلق به، وعندما يبدأ العضو الدوار في الدوران <b>يرفع التردد تدريجياً</b> حتى يصل المحرك إلى السرعة المطلوبة. وسيستمر العضو الدوار في الدوران بنفس سرعة المجال المغناطيسي ما لم يفقد التزامن.</p>`,ref:'ص 129'},
    {tip:String.raw`<p>السرعة التزامنية تتناسب مع التردد، لذلك رفع التردد يرفع سرعة المجال، والدوار المتعلق به يرتفع معه. ولهذا تسمح هذه الطريقة بالوصول إلى <b>السرعة المطلوبة</b> وليس إلى سرعة واحدة فقط.</p>`,title:'لماذا تعمل؟'},
    {watch:String.raw`<p>كلمة «تدريجياً» مهمة: لو رُفع التردد بسرعة كبيرة لسبق المجالُ الدوارَ واتسعت الزاوية بينهما ففقد التزامن، كما في الدرس السابق.</p>`},
    {title:'مختبر مصغّر: رتّب خطوات البدء بمصدر متغير التردد',widget:(el,B)=>DCML.order(el,B,{steps:[
  ['اخفض التردد حتى تصبح سرعة المجال الدوار قليلة جداً','نبدأ بمجال بطيء جداً؛ هذا أساس الطريقة.'],
  ['يعلق العضو الدوار بالمجال البطيء ويبدأ الدوران','الدوار لا يعلق بالمجال إلا إذا كان بطيئاً.'],
  ['ارفع التردد تدريجياً','نرفع التردد بعد أن يدور الدوار مع المجال، لا قبل.'],
  ['يصل المحرك إلى السرعة المطلوبة ويستمر مع المجال ما لم يفقد التزامن','هذه النتيجة الأخيرة.']]})}
   ]},

  {st:5,short:'قصر ملفات المجال',title:'ملاحظة عامة: قصر ملفات المجال أثناء البدء',ref:'ص 129',
   q:'أثناء البدء والمجال الدوار يقطع ملفات المجال بسرعة كبيرة… ماذا يحدث لو تركنا أطرافها مفتوحة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ملفات المجال توصل بمفتاح إلى مقاومة أثناء البدء ثم إلى مصدر التيار المستمر" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><g data-tip="ملفات المجال على العضو الدوار. أثناء البدء يقطعها المجال الدوار فيتولد على أطرافها جهد عالٍ إن تُركت مفتوحة."><path d="M66 96A12 12 0 0 1 66 120A12 12 0 0 1 66 144A12 12 0 0 1 66 168A12 12 0 0 1 66 192A12 12 0 0 1 66 216A12 12 0 0 1 66 240" fill="none" stroke="#F2C14E" stroke-width="4"/></g><text x="104" y="160" text-anchor="middle" font-size="13" fill="#B9852A" font-weight="700" direction="rtl">ملفات</text><text x="104" y="178" text-anchor="middle" font-size="13" fill="#B9852A" font-weight="700" direction="rtl">المجال</text><path d="M66 96V72H120M66 240V264H120" fill="none" stroke="#2C4A40" stroke-width="3"/><g data-tip="حلقات الانزلاق: يدخل منها التيار إلى ملفات المجال الدوارة. لو تُركت الملفات مفتوحة أثناء البدء قد تحدث شرارة بينها أو ينهار العازل."><ellipse cx="128" cy="72" rx="7" ry="16" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><ellipse cx="128" cy="264" rx="7" ry="16" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/></g><text x="128" y="300" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="600" direction="rtl">حلقات الانزلاق</text><path d="M135 72H180M135 264H180V200" fill="none" stroke="#2C4A40" stroke-width="3"/><path d="M180 72V120" stroke="#2C4A40" stroke-width="3"/><g data-tip="المفتاح أثناء البدء: يوصل ملفات المجال بالمقاومة، أي تكون مقصورة عبر مقاومة."><line x1="180" y1="120" x2="234" y2="98" stroke="#12855A" stroke-width="4" stroke-linecap="round"/><circle cx="180" cy="120" r="4.5" fill="#2C4A40"/></g><circle cx="240" cy="96" r="4.5" fill="#2C4A40"/><circle cx="240" cy="146" r="4.5" fill="#2C4A40"/><path d="M240 96H300V110" fill="none" stroke="#2C4A40" stroke-width="3"/><g data-tip="المقاومة: تُقصر عليها ملفات المجال أثناء البدء، فيمر تيار ولا يرتفع الجهد على أطرافها."><path d="M300 110L309 112.5L291 117.5L309 122.5L291 127.5L309 132.5L291 137.5L309 142.5L291 147.5L309 152.5L291 157.5L309 162.5L291 167.5L300 170" fill="none" stroke="#12855A" stroke-width="3"/></g><path d="M300 170V200H180" fill="none" stroke="#2C4A40" stroke-width="3"/><text x="300" y="86" text-anchor="middle" font-size="13" fill="#12855A" font-weight="700" direction="rtl">مقاومة</text><path d="M240 146H262" fill="none" stroke="#2C4A40" stroke-width="3"/><g data-tip="مصدر التيار المستمر: يُوصل إلى ملفات المجال بعد أن يقترب الدوار من السرعة التزامنية."><line x1="262" y1="134" x2="262" y2="158" stroke="#E8735A" stroke-width="3"/><line x1="270" y1="140" x2="270" y2="152" stroke="#E8735A" stroke-width="5"/></g><path d="M270 146H282V200" fill="none" stroke="#2C4A40" stroke-width="3"/><text x="246" y="126" text-anchor="middle" font-size="12" fill="#C4552F" font-weight="700" direction="rtl">تيار مستمر</text><text x="236" y="240" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">أثناء البدء: مقصورة عبر مقاومة</text></svg>`,
   cap:'أثناء البدء يوصل المفتاح ملفات المجال بالمقاومة، وبعد الاقتراب من السرعة التزامنية يوصلها بالتيار المستمر.<br><b>مرّر المؤشر على الملفات والحلقات والمقاومة والمصدر (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'ماذا قد يحدث لو تُركت ملفات المجال مفتوحة أثناء البدء؟',opts:[
     ['لا شيء؛ لا يمر فيها تيار فلا خطر',false,'لا يمر تيار، لكن يتولد على أطرافها جهد عالٍ، وهذا هو الخطر.'],
     ['يتولد جهد عالٍ على أطرافها قد يؤدي إلى انهيار العازل أو شرارة بين حلقات الانزلاق',true,'هذا نص الكتاب ص 129.'],
     ['يدور المحرك أسرع من السرعة التزامنية',false,'الملفات المفتوحة لا تزيد السرعة؛ المشكلة جهد عالٍ على أطرافها.']]}}
   ],
   body:[
    {book:String.raw`<p>ويلاحظ في جميع الطرق السابقة أنه أثناء عملية البدء وقبل توصيل التيار المستمر إلى ملفات المجال <b>يجب أن تكون ملفات المجال مقصورة عبر مقاومة</b>، لأن تعرضها للمجال المغناطيسي الدوار الناتج عن العضو الثابت سيؤدي إلى تولد جهد عالٍ على أطراف ملفات المجال قد يؤدي إلى <b>انهيار العازل</b> أو حدوث <b>شرارة بين حلقات الانزلاق</b>.</p>`,ref:'ص 129'},
    {tip:String.raw`<p>الجهد المتولد في ملفات المجال يكبر كلما كان المجال الدوار يقطعها أسرع. عند البدء والدوار واقف يكون الفرق بين السرعتين أكبر ما يمكن فيكون الجهد أكبر ما يمكن، ويقل كلما اقترب الدوار من السرعة التزامنية. المقاومة تسمح بمرور تيار في الملفات فلا يرتفع الجهد على أطرافها.</p>`,title:'من أين يأتي الجهد العالي؟'},
    {watch:String.raw`<p>الملاحظة تنطبق على <b>جميع</b> طرق البدء، لا على طريقة واحدة. والكتاب لا يرسم أي شكل لطرق البدء، فرسوم هذا الدرس توضيحية.</p>`},
    {title:'مختبر مصغّر: ماذا لو؟',widget:(el,B)=>DCML.cases(el,B,{cases:[
  {q:'أثناء البدء تركنا أطراف ملفات المجال مفتوحة. ما الخطر؟',opts:[
   ['لا خطر، لأنه لا يمر فيها تيار',false,'المجال الدوار للعضو الثابت يقطعها فيولد على أطرافها جهداً، حتى لو لم يمر تيار.'],
   ['جهد عالٍ على أطرافها قد يؤدي إلى انهيار العازل أو شرارة بين حلقات الانزلاق',true,'نص الملاحظة العامة (ص 129).'],
   ['يدور المحرك في الاتجاه المعاكس',false,'المشكلة ليست في الاتجاه بل في الجهد العالي.']]},
  {q:'هل تخص هذه الملاحظة طريقة قضبان التخميد وحدها؟',opts:[
   ['نعم',false,'الكتاب: «ويلاحظ في جميع الطرق السابقة».'],
   ['لا، تخص جميع طرق البدء قبل توصيل التيار المستمر إلى ملفات المجال',true,'في كل الطرق تتعرض ملفات المجال للمجال الدوار قبل تغذيتها.']]}]})}
   ]},

  {recap:[
   String.raw`المحرك التزامني لا يبدأ وحده، فيُوصل الدوار إلى السرعة التزامنية أو قربها ثم تُغذّى ملفات المجال بالتيار المستمر (ص 128).`,
   String.raw`المحرك الخارجي: يدير المحرك على العمود نفسه حتى السرعة التزامنية، ثم يُغذّى المجال ويُفصل محرك البدء.`,
   String.raw`قضبان التخميد (في أحذية الأقطاب) أو التيارات الدوامية (في دوار مصمت، للمحركات الصغيرة): يبدأ كمحرك حثي، وتتلاشى تياراتها عند السرعة التزامنية.`,
   String.raw`مصدر متغير التردد: تردد منخفض جداً يعلق به الدوار، ثم يُرفع تدريجياً حتى السرعة المطلوبة (ص 129).`,
   String.raw`في جميع الطرق: ملفات المجال مقصورة عبر مقاومة أثناء البدء، وإلا تولد جهد عالٍ قد يهدم العازل أو يسبب شرارة بين حلقات الانزلاق.`]}
],
 theory:[
  {h:'طرق بدء حركة المحرك التزامني',ref:'ص 128',html:'<p>رأينا في الدرس السابق أن الدوار يجب أن يدار بالسرعة التزامنية أو قريباً منها قبل تغذية ملفات المجال. يذكر الكتاب أربع طرق لذلك:</p>'},
  {h:'1- باستخدام المحرك الخارجي',ref:'ص 128',html:`<p>${METH.pony.txt}</p>`},
  {h:'2- باستخدام قضبان التخميد',ref:'ص 128',html:`<p>«وذلك بتركيب مجموعة من القضبان في أحذية الأقطاب ثم تقصر هذه القضبان بحلقات نحاسية من الجهتين بحيث تكون ما يشبه القفص السنجابي في المحركات الحثية، وفي هذه الحالة وعند توصيل التيار الكهربائي يبدأ المحرك بالدوران على أساس أنه محرك حثي، وعندما تصل السرعة إلى قرب السرعة التزامنية تغذى ملفات المجال بالتيار المستمر وعندها يتكون مجال مغناطيسي دوار آخر يؤدي وجوده مع المجال الناتج عن العضو الثابت إلى نقل المحرك إلى السرعة التزامنية، وعندها يتلاشى تأثير قضبان التخميد لأن التيارات المارة بها عند السرعة التزامنية تساوي صفراً، ويكون العزم الناتج في هذه الحالة هو عزم المحرك التزامني وليس الحثي، ويحافظ المحرك على سرعته عند السرعة التزامنية مهما تغير الحمل ما لم يفقد التزامن.»</p>`},
  {fig:'—',ref:'ص 128',caption:'رسم توضيحي (لا يوجد شكل في الكتاب): قضبان التخميد في أحذية الأقطاب (الدوائر الصغيرة الرمادية)، مقصورة بحلقتين من الجهتين فتعمل كقفص سنجابي',draw:()=>box(crossSVG({phiS:104,phiR:90,damper:true}),300)},
  {h:'3- باستخدام ظاهرة التيارات الدوامية',ref:'ص 128',html:`<p>«وجدت حديثاً محركات تزامنية ذات عضو دوار مصمت وبدون قضبان تخميد تبدأ حركتها على هذا الأساس بحيث تكون التيارات الدوامية المتولدة في العضو الدوار المصمت عزم مشابه لعزم المحرك الحثي، وعندما يتسارع العضو الدوار وتصل سرعته قرب السرعة التزامنية سيعلق بالمجال المغناطيسي الدوار الناتج عن العضو الثابت وسيدور معه بنفس السرعة وعندئذ ستتلاشى التيارات الدوامية، وهذه الطريقة <b>مناسبة للمحركات التزامنية الصغيرة</b>.»</p>`},
  {h:'4- باستخدام مصدر جهد متغير التردد',ref:'ص 129',html:`<p>«يمكن بدء دوران المحرك التزامني بسهولة إذا كان يغذى من مصدر جهد متغير التردد والذي بدأ ينتشر في السنوات الأخيرة بفضل التقدم في تقنية إلكترونيات القدرة، وذلك بخفض التردد إلى أن تصبح سرعة المجال المغناطيسي الدوار قليلة جداً بحيث يتمكن العضو الدوار من أن يعلق به، وعندما يبدأ العضو الدوار في الدوران يرفع التردد تدريجياً حتى يصل المحرك إلى السرعة المطلوبة. وسيستمر العضو الدوار في الدوران بنفس سرعة المجال المغناطيسي ما لم يفقد التزامن.»</p>`},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'ص 129: «في السنوات <b>الأخير</b>» والصحيح «الأخيرة» (خطأ إملائي).'+'</div>'},
  {h:'ملاحظة عامة: قصر ملفات المجال أثناء البدء',ref:'ص 129',html:`<p>«ويلاحظ في جميع الطرق السابقة أنه أثناء عملية البدء وقبل توصيل التيار المستمر إلى ملفات المجال <b>يجب أن تكون ملفات المجال مقصورة عبر مقاومة</b>، لأن تعرضها للمجال المغناطيسي الدوار الناتج عن العضو الثابت سيؤدي إلى تولد جهد عالٍ على أطراف ملفات المجال قد يؤدي إلى <b>انهيار العازل</b> أو حدوث <b>شرارة بين حلقات الانزلاق</b>.»</p>`},
  {note:`<b>توضيح للمتدرب (ليس من نص الكتاب):</b> الجهد المتولد في ملفات المجال يتناسب مع سرعة قطع المجال الدوار لها، أي مع الانزلاق. عند البدء (الدوار واقف) يكون الانزلاق 100% فيكون الجهد أكبر ما يمكن، ويقل كلما اقترب الدوار من \\(n_s\\). المقاومة تسمح بمرور تيار فتمنع ارتفاع الجهد. والكتاب لا يرسم أي شكل لطرق البدء، فكل الرسوم في هذا الدرس توضيحية.`}
 ],
 lab:(el)=>{
  const sim=makeSim('pony');let sdone=0,meth='pony',lastS='',auto=null,hist=[],ht=0,sparkSeen=0;
  el.innerHTML=`<div id="l2tp"></div><div class="grid">
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
  const TP=B.params($('#l2tp'),'u4-l2',simDefs(),()=>simTP(sim,TP));simTP(sim,TP);
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
  const PLAN={pony:[[act.field('R'),0.6],[act.stator,0.8],[act.pony(1),s=>s.w>0.985-Math.max(0,s.fric-0.03)/5],[act.field('dc'),s=>s.locked&&s.t-s.lockedT>1.2],[act.pony(0),0]],
   damper:[[act.field('R'),0.6],[act.stator,s=>s.w>0.94],[act.field('dc'),0]],eddy:[[act.stator,0]],vfd:[[act.field('dc'),0.6],[act.stator,1.0],[act.ramp,0]]};
  $('#l2au').onclick=()=>{reset();auto={i:0,t:0,plan:PLAN[meth]}};
  setUI();
  loopOn(el,dt=>{simTP(sim,TP);
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
const DEFK={VK,ESAT:520,P3:36};                // القيم التوضيحية (المختبر يستبدلها بقيم المدرب إن وُجدت)
const Ef=(IF,sat,k)=>{k=k||DEFK;return sat?k.ESAT*Math.tanh(k.VK*IF/k.ESAT):k.VK*IF};
const LOADS=[[13690,'P<sub>1</sub>'],[24880,'P<sub>2</sub>'],[36000,'P<sub>3</sub>']];
const loadP=(i,k)=>i===2?(k||DEFK).P3*1000:LOADS[i][0];
const niceUp=x=>{const e=Math.pow(10,Math.floor(Math.log10(x)));return [1,2,2.5,5,10].map(m=>m*e).find(v=>v>=x*(1-1e-9))};
const ifMax=k=>niceUp(500/(k||DEFK).VK);        // محور تيار المجال يغطي E حتى 500 V تقريباً
function vcurve(P,sat,k){const pts=[];let lim=null;const x1=ifMax(k);for(let i=0;i<=200;i++){const IF=i*x1/200;const m=motor(EX.V,Ef(IF,sat,k),EX.Xs,P);if(m.ok)pts.push([IF,m.Im]);else lim=IF}return {pts,lim}}
const unityIF=(P,sat,k)=>{k=k||DEFK;const E=Math.hypot(EX.V,EX.Xs*P/(3*EX.V));if(!sat)return E/k.VK;return k.ESAT/k.VK*Math.atanh(Math.min(0.999,E/k.ESAT))};
function vSVG(o){o=o||{};const sat=!!o.sat,k=o.k||DEFK;const list=o.cond&&!o.all?[]:o.only!=null?[o.only]:[0,1,2];
  const x1=ifMax(k),xs=x1/10;const cur=(o.cond?[{pts:vcurve(0,sat,k).pts,col:'--blue',w:2.8}]:[]).concat(list.map(i=>({pts:vcurve(loadP(i,k),sat,k).pts,col:o.hi===i?'--live':'--fg',w:o.hi===i?3:2})));
  const imx=Math.max(0,...cur.map(c=>Math.max(0,...c.pts.map(p=>p[1])))),y1=Math.max(140,Math.ceil(imx*1.05/20)*20),ys=y1/140,yst=y1<=160?20:niceUp(y1/7);
  const Pend=Math.max(40000,loadP(2,k)*1.1);
  return plotSVG({w:520,h:330,x0:0,x1,y0:0,y1,xt:Array.from({length:6},(_,i)=>+(i*x1/5).toPrecision(6)),yt:Array.from({length:Math.floor(y1/yst+1e-9)+1},(_,i)=>i*yst),xl:'IF (A)',yl:'Iph (A)',clip:o.clip||'vc',aria:'منحنيات V',
   under:(X,Y)=>{let s='';const u=[];for(let P=0;P<=Pend;P+=2000)u.push([unityIF(P,sat,k),P/(3*EX.V)]);s+=`<path d="${u.map((p,i)=>(i?'L':'M')+fx(X(p[0]))+' '+fx(Y(p[1]))).join('')}" stroke="var(--muted)" stroke-dasharray="6 5" stroke-width="1.6" fill="none"/>`;return s},
   series:cur,
   extra:(X,Y)=>{let s='';list.forEach(i=>{const c=vcurve(loadP(i,k),sat,k).pts,p=c[c.length-1];if(p)s+=`<text class="txt" x="${fx(X(p[0])-4)}" y="${fx(Y(p[1])-6)}" text-anchor="end">P<tspan font-size="9" dy="3">${i+1}</tspan></text>`});
     s+=`<text class="txt m" x="${fx(X(unityIF(0,sat,k))+4)}" y="${fx(Y(0)-6)}" text-anchor="start">cos θ = 1.0</text>`;
     s+=arT(X(1.6*xs),Y(130*ys),'معامل القدرة متخلف',{fs:12.5,col:'--live'})+arT(X(8.2*xs),Y(130*ys),'معامل القدرة متقدم',{fs:12.5,col:'--blue-ink'});
     if(o.cond){s+=arT(X(2.0*xs),Y(25*ys),'Q من الشبكة إلى المحرك',{fs:11.5,col:'--muted'})+arT(X(7.3*xs),Y(25*ys),'Q من المحرك إلى الشبكة',{fs:11.5,col:'--muted'});if(sat)s+=arT(X(8.6*xs),Y(88*ys),'منطقة التشبع',{fs:12,col:'--stop'})}
     if(o.pt)s+=`<circle cx="${fx(X(o.pt[0]))}" cy="${fx(Y(o.pt[1]))}" r="6.5" fill="var(--live)" stroke="var(--surface)" stroke-width="2"/>`;return s}})}
function tnSVG(o){o=o||{};const Tr=o.Tr!=null?o.Tr:0.45;return plotSVG({w:520,h:280,x0:0,x1:1.2,y0:0,y1:1.25,xt:[0,1],xf:v=>v?'ns':'0',yt:[0],xl:'n',yl:'T',clip:o.clip||'tn',aria:'منحنى العزم والسرعة',
  under:(X,Y)=>`<path d="M${X(0)} ${fx(Y(1))}H${X(1.2)}" stroke="var(--stop)" stroke-dasharray="6 5" stroke-width="1.6"/><path d="M${X(0)} ${fx(Y(Tr))}H${X(1.2)}" stroke="var(--blue)" stroke-dasharray="6 5" stroke-width="1.6"/>`,
  series:[{pts:[[1,0],[1,1]],col:'--fg',w:3.2}],
  extra:(X,Y)=>arT(X(0.42),Y(1)-7,'العزم الأقصى T<tspan font-size="9" dy="3">max</tspan>',{fs:12.5,col:'--stop'})+arT(X(0.42),Y(Tr)-7,'العزم المقنن T<tspan font-size="9" dy="3">rated</tspan>',{fs:12.5,col:'--blue-ink'})+
   (o.pt?`<circle cx="${fx(X(o.pt[0]))}" cy="${fx(Y(o.pt[1]))}" r="7" fill="var(${o.pt[2]||'--live'})" stroke="var(--surface)" stroke-width="2"/>`:'')})}

B.lesson({
 id:'u4-l3',unit:4,order:3,pages:'129–132',
 title:'منحنيات V، والعزم مع السرعة، والاستخدامات، والمكثف التزامني',
 summary:'بتيار المجال نتحكم في معامل قدرة المحرك التزامني: أقل تيار منتج عند معامل قدرة = 1، وتحته يكون متأخراً (يسحب Q) وفوقه متقدماً (يعطي Q). السرعة ثابتة حتى العزم الأقصى، ومن أشهر الاستخدامات المكثف التزامني لتحسين معامل القدرة.',
 stations:[
  {intro:true},

  {st:1,short:'منحنيات V',title:'منحنيات (V) للمحرك التزامني',ref:'ص 129–130',
   q:'المحرك الحثي يسحب دائماً قدرة غير فعالة من الشبكة… فهل يستطيع المحرك التزامني أن يفعل العكس ويعطيها للشبكة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ثلاثة منحنيات على شكل حرف V لمستويات قدرة مختلفة، وخط متقطع يمر بأدنى نقاطها عند معامل قدرة يساوي واحداً" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="158" r="146" fill="#FBE6C4"/><path d="M52 270V38M52 270H326" fill="none" stroke="#2C4A40" stroke-width="2.5"/><line x1="52" y1="270" x2="52" y2="45.5" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><polygon points="52,30 59,45.5 45,45.5" fill="#2C4A40"/><line x1="52" y1="270" x2="318.5" y2="270" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><polygon points="334,270 318.5,277 318.5,263" fill="#2C4A40"/><text x="48" y="22" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="10" dy="4">Ph</tspan><tspan dy="-4">&#8203;</tspan></text><text x="330" y="294" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="10" dy="4">F</tspan><tspan dy="-4">&#8203;</tspan></text><path data-tip="منحنى عند مستوى قدرة فعالة ⟦P1⟧ (الأصغر). كل منحنى يمثل مستوى محدداً من القدرة الفعالة." d="M70 150L114 229.2Q120 243 128 235L230 170" fill="none" stroke="#4FB3A9" stroke-width="4" stroke-linecap="round"/><text x="236" y="172" text-anchor="start" font-size="14" fill="#4FB3A9" font-weight="700" direction="ltr" font-family="var(--mono)">P<tspan font-size="10" dy="4">1</tspan><tspan dy="-4">&#8203;</tspan></text><path data-tip="منحنى عند مستوى قدرة فعالة ⟦P2⟧ أكبر من ⟦P1⟧." d="M100 115L144 194.2Q150 208 158 200L260 135" fill="none" stroke="#3B6FB6" stroke-width="4" stroke-linecap="round"/><text x="266" y="137" text-anchor="start" font-size="14" fill="#3B6FB6" font-weight="700" direction="ltr" font-family="var(--mono)">P<tspan font-size="10" dy="4">2</tspan><tspan dy="-4">&#8203;</tspan></text><path data-tip="منحنى عند مستوى قدرة فعالة ⟦P3⟧ (الأكبر). القدرة الأكبر تحتاج تيار مجال أكبر لمعامل قدرة = 1." d="M135 75L179 154.2Q185 168 193 160L295 95" fill="none" stroke="#7A5BC7" stroke-width="4" stroke-linecap="round"/><text x="301" y="97" text-anchor="start" font-size="14" fill="#7A5BC7" font-weight="700" direction="ltr" font-family="var(--mono)">P<tspan font-size="10" dy="4">3</tspan><tspan dy="-4">&#8203;</tspan></text><line data-tip="الخط المتقطع يمر بأدنى نقطة في كل منحنى: عندها معامل القدرة = ⟦1⟧، وتيار المنتج أقل ما يمكن، والمحرك يستهلك القدرة الفعالة فقط." x1="105" y1="257" x2="205" y2="142" stroke="#2C4A40" stroke-width="2.2" stroke-dasharray="6 5"/><text x="170" y="260" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">cosθ = 1.0</text><g data-tip="يسار الخط: تيار المجال أقل، فيستهلك المحرك قدرة غير فعالة ⟦Q⟧ إضافة إلى ⟦P⟧ — يعمل كأنه ملف."><text x="86" y="58" text-anchor="middle" font-size="12" fill="#B9852A" font-weight="700" direction="rtl">معامل القدرة</text><text x="86" y="74" text-anchor="middle" font-size="13" fill="#B9852A" font-weight="700" direction="rtl">متخلف</text></g><g data-tip="يمين الخط: تيار المجال أكبر، فيعطي المحرك قدرة غير فعالة ⟦Q⟧ للشبكة مع استهلاكه ⟦P⟧ — يعمل كأنه مكثف."><text x="292" y="196" text-anchor="middle" font-size="12" fill="#3B6FB6" font-weight="700" direction="rtl">معامل القدرة</text><text x="292" y="212" text-anchor="middle" font-size="13" fill="#3B6FB6" font-weight="700" direction="rtl">متقدم</text></g></svg>`,
   cap:'الشكل <span class="ltr">(4-3)</span>: منحنيات V لثلاثة مستويات من القدرة <span class="ltr">P<sub>1</sub> &lt; P<sub>2</sub> &lt; P<sub>3</sub></span> (رسم توضيحي بلا أرقام).<br><b>مرّر المؤشر على المنحنيات والخط المتقطع والكتابتين (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'على منحنى V واحد (القدرة ثابتة)، متى يكون تيار المنتج أقل ما يمكن؟',opts:[
     ['عندما يكون تيار المجال أكبر ما يمكن',false,'عند تيار مجال كبير جداً يكون التيار متقدماً وكبيراً (الفرع الأيمن).'],
     ['عندما يكون معامل القدرة مساوياً للواحد',true,'نص الكتاب: «في كل منحنى أقل قيمة لتيار المنتج تحدث عندما يكون معامل القدرة مساوياً للواحد».'],
     ['عندما يكون تيار المجال صفراً',false,'تيار المجال الصغير يجعل التيار متأخراً وكبيراً (الفرع الأيسر)، والصفر لا يكفي لحمل القدرة أصلاً.']]}}
   ],
   body:[
    {book:String.raw`<p>هي منحنيات تحدد خواص تشغيل المحرك التزامني وتربط بين <b>تيار المجال \(I_F\)</b> و<b>تيار المنتج \(I_{Ph}\)</b> انظر الشكل (4-3)، وكل منحنى يمثل مستوى محدداً من القدرة الفعالة P.</p>
     <ul><li>في كل منحنى <b>أقل قيمة لتيار المنتج</b> تحدث عندما يكون <b>معامل القدرة مساوياً للواحد</b>، وعند هذه القيمة لتيار المجال يكون المحرك مستهلكاً للقدرة الفعالة P فقط.</li>
     <li>وعند أي قيمة <b>أقل</b> من هذه القيمة لتيار المجال يكون المحرك مستهلكاً للقدرة غير الفعالة Q بالإضافة إلى القدرة الفعالة P ويكون معامل القدرة <b>متأخر</b>.</li>
     <li>إلا أنه عندما يكون تيار المجال <b>أكبر</b> من هذه القيمة يكون المحرك <b>معطياً للقدرة غير الفعالة Q</b> بالإضافة إلى استهلاكه للقدرة الفعالة P ويكون معامل القدرة <b>متقدماً</b> في هذه الحالة.</li></ul>
     <p>وهذا يعني أنه يمكننا بالتحكم في تيار المجال أن نجعل المحرك التزامني إما مستهلكاً للقدرة غير الفعالة أو مزوداً للشبكة بالقدرة غير الفعالة أي أن المحرك التزامني يمكن أن يعمل كأنه <b>ملف</b> أو <b>مكثف</b>.</p>`,ref:'ص 129–130'},
    {title:'غيّر تيار المجال وشاهد سلوك المحرك',widget:(el,B)=>{
      const R=[
       ['أقل من القيمة المناسبة','متأخر','يستهلك Q من الشبكة إضافة إلى P','ملف (حمل حثي)','أكبر من أقل قيمة','الفرع الأيسر'],
       ['عند القيمة المناسبة','يساوي الواحد','يستهلك P فقط','لا ملف ولا مكثف','أقل قيمة على المنحنى','أدنى نقطة'],
       ['أكبر من القيمة المناسبة','متقدم','يعطي Q للشبكة مع استهلاكه P','مكثف (حمل سعوي)','أكبر من أقل قيمة','الفرع الأيمن']];
      let k=1;
      el.innerHTML=`<p class="sub" style="margin:0 0 10px">القدرة الفعالة P ثابتة (منحنى واحد). اختر تيار المجال:</p>
       <div class="w-row" style="margin-top:0"><span class="mseg">${R.map((r,i)=>`<button type="button" data-v="${i}" aria-pressed="${i===k}" style="font-family:var(--font)">${r[0]}</button>`).join('')}</span></div>
       <div class="w-facts"><div><span>معامل القدرة</span><b data-o="1" style="font-family:var(--font)"></b></div><div><span>القدرة غير الفعالة Q</span><b data-o="2" style="font-family:var(--font)"></b></div><div><span>يعمل كأنه</span><b data-o="3" style="font-family:var(--font)"></b></div><div><span>تيار المنتج</span><b data-o="4" style="font-family:var(--font)"></b></div></div>
       <p class="sub" style="margin-top:8px">موضعه على منحنى V: <b data-o="5"></b></p>`;
      const draw=()=>{for(let j=1;j<=5;j++)el.querySelector(`[data-o="${j}"]`).textContent=R[k][j];el.querySelectorAll('.mseg button').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.v===k))};
      el.querySelectorAll('.mseg button').forEach(b=>b.onclick=()=>{k=+b.dataset.v;draw()});
      draw();
    }},
    {tip:String.raw`<p>لماذا شكل V؟ القدرة ثابتة على المنحنى الواحد، فالجزء الفعّال من التيار ثابت. عند تيار المجال المناسب يكون التيار كله فعّالاً فهو أصغر ما يمكن. إذا نقص تيار المجال أو زاد يُضاف إلى التيار جزء غير فعّال (متأخر أو متقدم) فيكبر التيار على الجانبين.</p>
     <p>ولماذا يميل الخط المتقطع إلى اليمين؟ القدرة الأكبر تحتاج تيار مجال أكبر حتى يبقى معامل القدرة واحداً.</p>`,title:'اقرأ الشكل'}
   ]},

  {st:2,short:'العزم مع السرعة',title:'منحنى العزم مع السرعة للمحرك التزامني',ref:'ص 130–131',
   q:'في المحرك الحثي تقل السرعة كلما زاد العزم المطلوب… فكيف يبدو هذا المنحنى في المحرك التزامني؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="منحنى العزم مع السرعة للمحرك التزامني: خط رأسي عند السرعة التزامنية من الصفر حتى العزم الأقصى" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><path d="M56 262V44M56 262H322" fill="none" stroke="#2C4A40" stroke-width="2.5"/><line x1="56" y1="262" x2="56" y2="51.5" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><polygon points="56,36 63,51.5 49,51.5" fill="#2C4A40"/><line x1="56" y1="262" x2="314.5" y2="262" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><polygon points="330,262 314.5,269 314.5,255" fill="#2C4A40"/><text x="52" y="28" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">T</text><text x="326" y="286" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">n</text><text x="44" y="280" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">0</text><line data-tip="العزم الأقصى ⟦Tmax⟧: إذا زاد الحمل عنه يفقد المحرك التزامن. الكتاب لا يرسم ما بعده." x1="56" y1="86" x2="250" y2="86" stroke="#B23A2A" stroke-width="2.2" stroke-dasharray="6 5"/><text x="150" y="78" text-anchor="middle" font-size="13" fill="#B23A2A" font-weight="700" direction="rtl">العزم الأقصى</text><line data-tip="العزم المقنن ⟦Trated⟧: العزم الذي صُمم المحرك ليعمل عنده باستمرار، وهو أقل من العزم الأقصى." x1="56" y1="162" x2="250" y2="162" stroke="#12855A" stroke-width="2.2" stroke-dasharray="6 5"/><text x="150" y="154" text-anchor="middle" font-size="13" fill="#12855A" font-weight="700" direction="rtl">العزم المقنن</text><line data-tip="السرعة ثابتة عند ⟦ns⟧ لأي عزم من الصفر حتى العزم الأقصى." x1="250" y1="262" x2="250" y2="86" stroke="#E8735A" stroke-width="6" stroke-linecap="round"/><text x="250" y="286" text-anchor="middle" font-size="15" fill="#E8735A" font-weight="700" direction="ltr" font-family="var(--mono)">n<tspan font-size="10" dy="4">s</tspan><tspan dy="-4">&#8203;</tspan></text><text x="290" y="92" text-anchor="middle" font-size="13" fill="#B23A2A" font-weight="700" direction="ltr" font-family="var(--mono)">T<tspan font-size="9" dy="4">max</tspan><tspan dy="-4">&#8203;</tspan></text><text x="296" y="168" text-anchor="middle" font-size="13" fill="#12855A" font-weight="700" direction="ltr" font-family="var(--mono)">T<tspan font-size="9" dy="4">rated</tspan><tspan dy="-4">&#8203;</tspan></text></svg>`,
   cap:'الشكل <span class="ltr">(4-4)</span>: السرعة ثابتة عند <span class="ltr">n<sub>s</sub></span> لأي عزم من الصفر حتى العزم الأقصى.<br><b>مرّر المؤشر على الخطوط (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'زاد الحمل على محرك تزامني من الحمل المقنن إلى ما دون العزم الأقصى بقليل. ماذا يحدث لسرعته؟',opts:[
     ['تقل قليلاً كالمحرك الحثي',false,'هذا سلوك المحرك الحثي. سرعة التزامني مرتبطة بتردد المصدر.'],
     ['تقل إلى النصف',false,'لا تتغير السرعة أصلاً ما دام المحرك متزامناً.'],
     ['تبقى ثابتة عند السرعة التزامنية',true,'الكتاب: «سرعة المحرك لن تتغير مهما تغير الحمل المسلط عليه ما دام ضمن الحمل المقنن» — والخط الرأسي في الشكل (4-4) يمتد حتى العزم الأقصى.']]}}
   ],
   body:[
    {book:String.raw`<p>المحرك التزامني عادةً يدير أحمالاً تتطلب سرعة ثابتة وغالباً يتم تغذيته من مصدر كهربائي ضخم بحيث يظهر بالنسبة للمحرك <b>كأنه قضيب لا نهائي</b> وهذا يعني أن جهد الأطراف للمحرك وتردد المصدر لا يمكن أن يتغيرا مهما تغيرت القدرة المسحوبة من المصدر بواسطة المحرك، وبما أن سرعة المحرك مرتبطة بتردد المصدر فهذا يعني أن سرعة المحرك لن تتغير مهما تغير الحمل المسلط عليه ما دام ضمن الحمل المقنن، وعليه فإن عزم المحرك سيبقى ثابتاً عند السرعة التزامنية مهما تغير الحمل ما دام ضمن الحمل المقنن كما هو موضح في الشكل (4-4).</p>`,ref:'ص 130–131'},
    {tip:String.raw`<p>«القضيب اللانهائي» شبكة كبيرة جداً مقارنة بالمحرك، فلا يستطيع المحرك أن يغيّر جهدها أو ترددها مهما سحب منها. ولأن السرعة التزامنية يحددها التردد، تبقى السرعة ثابتة. والذي يتغير مع الحمل هو زاوية العزم δ (الدرس الرابع)، لا السرعة.</p>`,title:'ما معنى «قضيب لا نهائي»؟'},
    {watch:String.raw`<p>الخط الرأسي ينتهي عند <b>العزم الأقصى</b>. فوقه لا يوجد تشغيل متزامن: يفقد المحرك التزامن ويتباطأ حتى يتوقف (الدرس الأول). والكتاب لا يرسم ما بعد العزم الأقصى.</p>`},
    {title:'مختبر مصغّر: زد الحمل وراقب السرعة',widget:(el,B)=>DCML.lab(el,B,{intro:'منحنى الشكل (4-4) بالشكل فقط: الخط الرأسي عند السرعة التزامنية. حرّك الحمل على العمود كنسبة من أقصى عزم يتحمله المحرك (أرقام تختارها أنت).',
 predict:{q:'زاد الحمل من نصف المقنن إلى المقنن. ماذا يحدث لسرعة المحرك التزامني؟',opts:[
  ['تقل قليلاً كما في المحرك الحثي',false,'هذا سلوك المحرك الحثي. سرعة التزامني مرتبطة بتردد المصدر.'],
  ['تبقى السرعة التزامنية نفسها',true,'«سرعة المحرك لن تتغير مهما تغير الحمل المسلط عليه ما دام ضمن الحمل المقنن» (ص 130–131).'],
  ['تزيد قليلاً',false,'لا شيء يرفع السرعة فوق التزامنية.']]},
 ins:[{k:'L',l:'الحمل (نسبة من أقصى عزم)',min:0,max:120,step:10,v:50,u:'%',dp:0}],
 calc:(s,v,B)=>{const ok=s.L<=100,T=s.L/100;
  return {facts:[['السرعة',ok?'التزامنية':'فقد التزامن',ok?'hi':'bad']],
   plot:{xr:[0,1.2],yr:[0,1.25],xt:[0,1],fx:v=>v?'ns':'0',yt:[0],noYt:true,xl:'n',yl:'T',curves:[{pts:[[1,0],[1,1]],col:'--blue',w:3}],cur:ok?[1,T]:null},
   msg:ok?'النقطة تتحرك على الخط الرأسي فقط: العزم يتغير والسرعة ثابتة.':'تجاوز الحمل العزم الأقصى: يفقد المحرك التزامن (الدرس 4.1).',cls:ok?'':'bad'}}})}
   ]},

  {st:3,short:'الاستخدامات',title:'استخدامات المحرك التزامني',ref:'ص 131',
   q:'إذا كان المحرك التزامني ثابت السرعة ويحسّن معامل القدرة، فلماذا لا نراه في كل مكان بدلاً من المحرك الحثي؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="المحرك التزامني يُختار لثبات السرعة، ويحتاج نظام إثارة ونظام بدء حركة يرفعان ثمنه" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><g data-tip="المحرك التزامني: سرعته ثابتة عند السرعة التزامنية مهما تغير الحمل ضمن الحمل المقنن."><rect x="120" y="104" width="120" height="96" rx="14" fill="#CFE6DB" stroke="#2C4A40" stroke-width="3"/><line x1="132" y1="110" x2="132" y2="194" stroke="#2C4A40" stroke-width="1.5" opacity=".45"/><line x1="144" y1="110" x2="144" y2="194" stroke="#2C4A40" stroke-width="1.5" opacity=".45"/><line x1="156" y1="110" x2="156" y2="194" stroke="#2C4A40" stroke-width="1.5" opacity=".45"/><line x1="168" y1="110" x2="168" y2="194" stroke="#2C4A40" stroke-width="1.5" opacity=".45"/><line x1="180" y1="110" x2="180" y2="194" stroke="#2C4A40" stroke-width="1.5" opacity=".45"/><line x1="192" y1="110" x2="192" y2="194" stroke="#2C4A40" stroke-width="1.5" opacity=".45"/><line x1="204" y1="110" x2="204" y2="194" stroke="#2C4A40" stroke-width="1.5" opacity=".45"/><line x1="216" y1="110" x2="216" y2="194" stroke="#2C4A40" stroke-width="1.5" opacity=".45"/><line x1="228" y1="110" x2="228" y2="194" stroke="#2C4A40" stroke-width="1.5" opacity=".45"/></g><line x1="240" y1="152" x2="300" y2="152" stroke="#8A9A93" stroke-width="8" stroke-linecap="round"/><text x="180" y="90" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">المحرك التزامني</text><g data-tip="نظام الإثارة ⟦Excitation System⟧: يغذي ملفات المجال بالتيار المستمر. لا يحتاجه المحرك الحثي."><rect x="30" y="226" width="130" height="34" rx="9" fill="#E8735A"/><text x="95" y="248" text-anchor="middle" font-size="13" fill="#FFFFFF" font-weight="700" direction="rtl">نظام إثارة</text><line x1="120" y1="226" x2="150" y2="200" stroke="#E8735A" stroke-width="3"/></g><g data-tip="نظام بدء الحركة: لأن المحرك التزامني لا يبدأ وحده (الدرس السابق)."><rect x="200" y="226" width="130" height="34" rx="9" fill="#4FB3A9"/><text x="265" y="248" text-anchor="middle" font-size="13" fill="#FFFFFF" font-weight="700" direction="rtl">نظام بدء حركة</text><line x1="240" y1="226" x2="212" y2="200" stroke="#4FB3A9" stroke-width="3"/></g><g data-tip="ثبات السرعة: المطلب الأساسي الذي يُختار المحرك التزامني من أجله."><rect x="112" y="30" width="136" height="32" rx="16" fill="#12855A"/><text x="180" y="51" text-anchor="middle" font-size="13" fill="#FFFFFF" font-weight="700" direction="rtl">ثبات السرعة</text></g><text x="180" y="292" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">إضافات ترفع ثمنه</text></svg>`,
   cap:'يُختار المحرك التزامني من أجل ثبات السرعة، لكنه يحتاج نظام إثارة ونظام بدء حركة.<br><b>مرّر المؤشر على المحرك والأنظمة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'لماذا يُستغنى عن المحرك التزامني إذا لم يكن ثبات السرعة مطلباً أساسياً؟',opts:[
     ['لارتفاع ثمنه، لأنه يحتاج نظام إثارة ونظام بدء حركة',true,'نص الكتاب ص 131.'],
     ['لأنه لا يتحمل الأحمال',false,'يتحمل الحمل حتى العزم الأقصى؛ السبب الذي يذكره الكتاب هو الثمن.'],
     ['لأن سرعته تتغير كثيراً مع الحمل',false,'العكس: سرعته ثابتة، وهذه ميزته.']]}}
   ],
   body:[
    {book:String.raw`<p>يستخدم المحرك التزامني على نطاق ضيق وذلك في التطبيقات التي يكون فيها <b>ثبات السرعة مطلباً أساسياً</b>، وفي حالة كون ثبات السرعة غير مطلب أساسي فيستغنى عن المحرك التزامني بغيره نظراً لارتفاع ثمنه حيث إنه يحتاج إلى <b>نظام إثارة</b> <span class="ltr">Excitation System</span> و<b>نظام بدء حركة</b>، ومن أشهر تطبيقاته استخدامه كمكثف تزامني <span class="ltr">Synchronous Condenser</span>.</p>`,ref:'ص 131'},
    {add:String.raw`<p>من الأحمال التي يهمها ثبات السرعة: الضواغط والمضخات الكبيرة في المصانع، والمطاحن، وخطوط الإنتاج التي يجب أن تتحرك أجزاؤها معاً بسرعة واحدة. وفي هذه الأحمال الكبيرة يُستفاد أيضاً من قدرة المحرك التزامني على تحسين معامل القدرة.</p>`,title:'أين تجده؟'},
    {title:'مختبر مصغّر: تزامني أم حثي؟',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل حالة اختر المحرك الذي يناسبها حسب الكتاب.',cats:['المحرك التزامني','المحرك الحثي'],items:[
  ['حمل يكون فيه ثبات السرعة مطلباً أساسياً',0,'«يستخدم المحرك التزامني ... في التطبيقات التي يكون فيها ثبات السرعة مطلباً أساسياً».'],
  ['ثبات السرعة ليس مطلباً أساسياً، والثمن مهم',1,'«فيستغنى عن المحرك التزامني بغيره نظراً لارتفاع ثمنه».'],
  ['تحسين معامل القدرة في الشبكة (مكثف تزامني)',0,'«ومن أشهر تطبيقاته استخدامه كمكثف تزامني».']]})}
   ]},

  {st:4,short:'المكثف التزامني',title:'المكثف التزامني',ref:'ص 131–132',
   q:'محرك تزامني لا يدير أي حمل، وليس له عمود خارج منه أصلاً… فما فائدته؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="منحنى V للمكثف التزامني: أدنى نقطة قرب الصفر، ويساره متخلف ويمينه متقدم ثم منطقة التشبع" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><path d="M52 262V42M52 262H326" fill="none" stroke="#2C4A40" stroke-width="2.5"/><line x1="52" y1="262" x2="52" y2="49.5" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><polygon points="52,34 59,49.5 45,49.5" fill="#2C4A40"/><line x1="52" y1="262" x2="318.5" y2="262" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><polygon points="334,262 318.5,269 318.5,255" fill="#2C4A40"/><text x="48" y="26" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="10" dy="4">Ph</tspan><tspan dy="-4">&#8203;</tspan></text><text x="330" y="286" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="10" dy="4">F</tspan><tspan dy="-4">&#8203;</tspan></text><path data-tip="منحنى V للمكثف التزامني: يعمل بدون حمل، فأدنى نقطة فيه يكاد تيار المنتج عندها يكون صفراً." d="M78 70L156 252Q164 266 172 252L246 110Q266 78 312 66" fill="none" stroke="#7A5BC7" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="منطقة التشبع: زيادة تيار المجال بعدها لا تزيد المجال المغناطيسي بالقدر نفسه، فينحني المنحنى ويتسطح."><text x="282" y="54" text-anchor="middle" font-size="12" fill="#7A5BC7" font-weight="700" direction="rtl">منطقة التشبع</text><rect x="250" y="56" width="70" height="40" fill="transparent"/></g><g data-tip="الفرع الأيسر: تيار مجال صغير، معامل القدرة متخلف، والقدرة غير الفعالة تنتقل من الشبكة إلى المحرك (يعمل كأنه ملف)."><text x="98" y="196" text-anchor="middle" font-size="13" fill="#B9852A" font-weight="700" direction="rtl">متخلف</text><text x="98" y="214" text-anchor="middle" font-size="12" fill="#B9852A" font-weight="600" direction="rtl">يأخذ Q</text><text x="98" y="230" text-anchor="middle" font-size="12" fill="#B9852A" font-weight="600" direction="rtl">من الشبكة</text></g><g data-tip="الفرع الأيمن: تيار مجال كبير، معامل القدرة متقدم، والقدرة غير الفعالة تنتقل من المحرك إلى الشبكة (يعمل كأنه مكثف)."><text x="276" y="176" text-anchor="middle" font-size="13" fill="#3B6FB6" font-weight="700" direction="rtl">متقدم</text><text x="276" y="194" text-anchor="middle" font-size="12" fill="#3B6FB6" font-weight="600" direction="rtl">يعطي Q</text><text x="276" y="210" text-anchor="middle" font-size="12" fill="#3B6FB6" font-weight="600" direction="rtl">للشبكة</text></g></svg>`,
   cap:'الشكل <span class="ltr">(4-5)</span>: منحنى V للمحرك التزامني عندما يعمل كمكثف تزامني (بدون حمل).<br><b>مرّر المؤشر على المنحنى والكتابات (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'لكي يظهر المكثف التزامني على الشبكة كأنه مكثف، نجعل تيار المجال:',opts:[
     ['أقل من القيمة التي تجعل معامل القدرة واحداً',false,'هذا يجعل التيار متأخراً، فيظهر كأنه ملف لا مكثف.'],
     ['صفراً',false,'بلا تيار مجال لا يعمل المحرك التزامني متزامناً أصلاً.'],
     ['كبيراً، حتى يتقدم تيار المنتج على الجهد بزاوية قريبة من 90°',true,'نص الكتاب: «يزاد تيار المجال إلى قيمة معينة بحيث يتقدم تيار المنتج على جهد الأطراف بزاوية قريبة من 90°».']]}}
   ],
   body:[
    {book:String.raw`<p>من التطبيقات الهامة للمحرك التزامني استخدامه كمكثف تزامني وذلك من أجل <b>تحسين معامل القدرة</b>، ولهذا الغرض يصنع المحرك التزامني <b>بدون عمود خارج منه</b> وذلك لأنه يعمل بدون حمل، من أجل ذلك يزاد تيار المجال إلى قيمة معينة بحيث يتقدم تيار المنتج على جهد الأطراف بزاوية قريبة من <span class="ltr">90°</span> وهذا يجعله يظهر على الشبكة كأنه مكثف. يبين الشكل (4-5) منحنى V للمحرك التزامني عندما يعمل كمكثف تزامني.</p>
     <p>ولا يزال المكثف التزامني متواجداً بأعداد كبيرة في الأنظمة الكهربائية القديمة، أما في الوقت الحاضر فقد بدأ يقل استخدامه لهذا الغرض حيث تم استبداله بالمكثفات الساكنة <span class="ltr">static capacitors</span> نظراً لقلة ثمنها وقلة متطلبات صيانتها.</p>`,ref:'ص 131–132'},
    {tip:String.raw`<p>المصنع المليء بالمحركات الحثية يسحب من الشبكة قدرة غير فعالة متأخرة، فيسوء معامل القدرة. المكثف التزامني بتيار مجال كبير <b>يعطي</b> قدرة غير فعالة متقدمة، فيغطي جزءاً مما يحتاجه المصنع، فيقل ما تسحبه الشبكة ويقترب معامل القدرة من الواحد.</p>
     <p>ولأنه بلا حمل تكون القدرة الفعالة التي يأخذها صغيرة جداً، لذلك تكاد أدنى نقطة في منحنى V تلامس المحور.</p>`,title:'كيف يحسّن معامل القدرة؟'},
    {watch:String.raw`<p>انتبه لاتجاه القدرة غير الفعالة في الشكل (4-5): يسار أدنى نقطة تنتقل <b>من الشبكة إلى المحرك</b> (متخلف)، ويمينها تنتقل <b>من المحرك إلى الشبكة</b> (متقدم). المكثف التزامني يعمل في الجهة اليمنى.</p>`},
    {title:'مختبر مصغّر: محرك بلا حمل يصبح مكثفاً',widget:(el,B)=>DCML.lab(el,B,{intro:String.raw`محرك بلا حمل (القدرة الفعالة صفر تقريباً)، \(V_{ph} = 208\ \text{V}\) و\(X_S = 2.5\ \Omega\) من مثال (4-1). غيّر تيار المجال وراقب تيار المنتج. علاقة \(E_{ph}\) بتيار المجال (<bdi class="ltr">50 V</bdi> لكل أمبير) قيمة توضيحية ليست من الكتاب.`,
 predict:{q:'لكي يظهر المحرك على الشبكة كأنه مكثف، ماذا نفعل بتيار المجال؟',opts:[
  ['ننقصه حتى يتأخر التيار',false,'التيار المتأخر يجعل المحرك يأخذ قدرة غير فعالة كالحمل الحثي.'],
  ['نفصله تماماً',false,'بلا تيار مجال يسحب المحرك تياراً متأخراً كبيراً.'],
  ['نزيده حتى يتقدم تيار المنتج على الجهد بزاوية قريبة من <bdi class="ltr">90°</bdi>',true,'«يزاد تيار المجال إلى قيمة معينة بحيث يتقدم تيار المنتج على جهد الأطراف بزاوية قريبة من <bdi class="ltr">90°</bdi>» (ص 131).']]},
 ins:[{k:'I',l:'تيار المجال <bdi class="ltr">I<sub>F</sub></bdi>',min:0,max:10,step:0.2,v:3,u:'A',dp:1}],
 calc:(s,v,B)=>{const E=DEFK.VK*s.I,Ia=Math.abs(E-208)/2.5,typ=E>208+2?'متقدم':E<208-2?'متأخر':'—';
  return {facts:[['<bdi class="ltr">E<sub>ph</sub></bdi> (توضيحي)',DCML.fm(B,E,0)+' V'],['تيار المنتج <bdi class="ltr">I<sub>ph</sub></bdi>',DCML.fm(B,Ia,1)+' A','hi'],['التيار مقارنة بالجهد (بزاوية <bdi class="ltr">90°</bdi> تقريباً)',typ,E>208+2?'hi':'']],
   plot:{xr:[0,10],yr:[0,120],xt:[0,2,4,6,8,10],yt:[0,40,80,120],xl:'IF (A)',yl:'Iph (A)',curves:[{f:x=>Math.abs(DEFK.VK*x-208)/2.5,col:'--blue'}],cur:[s.I,Ia]},
   msg:E>208+2?'المحرك يعطي الشبكة قدرة غير فعالة: يظهر عليها كأنه مكثف.':E<208-2?'المحرك يأخذ قدرة غير فعالة من الشبكة: يظهر كأنه حمل حثي.':'أقل تيار: قاع منحنى V.'}}})}
   ]},

  {recap:[
   String.raw`منحنى V يربط تيار المجال \(I_F\) بتيار المنتج \(I_{Ph}\) عند قدرة ثابتة: أقل تيار عند معامل قدرة = 1 (ص 129–130).`,
   String.raw`تيار مجال أقل ← معامل قدرة متأخر ويستهلك Q (كأنه ملف). تيار مجال أكبر ← متقدم ويعطي Q (كأنه مكثف).`,
   String.raw`السرعة ثابتة عند \(n_s\) مهما تغير الحمل حتى العزم الأقصى، لأن المصدر «قضيب لا نهائي» (الشكل 4-4).`,
   String.raw`يُستخدم حين يكون ثبات السرعة مطلباً أساسياً؛ وهو أغلى لأنه يحتاج نظام إثارة ونظام بدء حركة.`,
   String.raw`المكثف التزامني: محرك بلا حمل وبتيار مجال كبير، تيار منتجه متقدم بزاوية قريبة من \(90^\circ\)، لتحسين معامل القدرة (ص 131–132).`]}
],
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
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'عنوان هذا البند في الفهرس «منحنى العزم مع السرعة»، وفي المتن «منحنى العزم مع السرعة للمحرك التزامني» (اختلاف بسيط في العنوان فقط).'+'</div>'},
  {h:'استخدامات المحرك التزامني',ref:'ص 131',html:`<p>«يستخدم المحرك التزامني على نطاق ضيق وذلك في التطبيقات التي يكون فيها <b>ثبات السرعة مطلباً أساسياً</b>، وفي حالة كون ثبات السرعة غير مطلب أساسي فيستغنى عن المحرك التزامني بغيره نظراً لارتفاع ثمنه حيث إنه يحتاج إلى <b>نظام إثارة</b> <span class="ltr">Excitation System</span> و<b>نظام بدء حركة</b>، ومن أشهر تطبيقاته استخدامه كمكثف تزامني <span class="ltr">Synchronous Condenser</span>.»</p>`},
  {h:'المكثف التزامني',ref:'ص 131–132',html:`<p>«من التطبيقات الهامة للمحرك التزامني استخدامه كمكثف تزامني وذلك من أجل <b>تحسين معامل القدرة</b>، ولهذا الغرض يصنع المحرك التزامني <b>بدون عمود خارج منه</b> وذلك لأنه يعمل بدون حمل، من أجل ذلك يزاد تيار المجال إلى قيمة معينة بحيث يتقدم تيار المنتج على جهد الأطراف بزاوية قريبة من <span class="ltr">90°</span> وهذا يجعله يظهر على الشبكة كأنه مكثف. يبين الشكل (4-5) منحنى V للمحرك التزامني عندما يعمل كمكثف تزامني.»</p>
   <p>«ولا يزال المكثف التزامني متواجداً بأعداد كبيرة في الأنظمة الكهربائية القديمة، أما في الوقت الحاضر فقد بدأ يقل استخدامه لهذا الغرض حيث تم استبداله بالمكثفات الساكنة <span class="ltr">static capacitors</span> نظراً لقلة ثمنها وقلة متطلبات صيانتها.»</p>`},
  {fig:'(4-5)',ref:'ص 132',caption:'منحنى V للمكثف التزامني (بدون حمل): نقطته الدنيا تلامس محور \\(I_F\\) تقريباً. يساره معامل قدرة متخلف والقدرة غير الفعالة تنتقل من الشبكة إلى المحرك، ويمينه متقدم وتنتقل من المحرك إلى الشبكة، وينحني الفرع الأيمن في أعلاه في «منطقة التشبع» (أرقام توضيحية)',draw:()=>box(vSVG({cond:1,sat:1,clip:'f45'}),540)},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> الكتاب لا يعطي مثالاً عددياً لتحسين معامل قدرة مصنع بالمكثف التزامني. في المختبر لوحة توضيحية بأرقام افتراضية: مصنع يسحب قدرة غير فعالة متأخرة، والمكثف التزامني (بتيار مجال كبير) يعطي قدرة غير فعالة متقدمة فيقل ما تسحبه الشبكة ويقترب معامل القدرة من الواحد.'}
 ],
 lab:(el)=>{
  let li=0,IF=4.6,sat=0,FP=100,Fpf=0.75,CIF=4.2,TL=0.3,nT=1,lostT=0,lastA='',lastB='',lastC='';
  el.innerHTML=`<div id="l3tp"></div><div class="grid">
   <div class="panel c7"><h2>لوحة منحنيات V <small>مبنية على الشكلين (4-3) ص 130 و(4-5) ص 132</small></h2>
    <div class="sm-row">${segHTML('ld',[[0,'P<sub>1</sub> = 13.69 kW'],[1,'P<sub>2</sub> = 24.88 kW'],[2,'P<sub>3</sub> = <span id="l3p3">36</span> kW'],[3,'بدون حمل (مكثف تزامني)']],0)}</div>
    <div class="svgbox" id="l3v"></div>
    ${sl('l3if','تيار المجال I<sub>F</sub>',0,10,0.05,IF)}
    <div class="sm-row">${swHTML('l3sat','sat','إظهار التشبع (الشكل 4-5)',0)}</div>
    <p class="sub">P<sub>1</sub> و P<sub>2</sub> هما القدرتان الداخلتان في مثال (4-1)، و P<sub>3</sub> توضيحية. الآلة: <span class="ltr">V<sub>ph</sub> = 208 V</span>، <span class="ltr">X<sub>S</sub> = 2.5 Ω</span>، و <span class="ltr">E<sub>ph</sub> = <span id="l3vk">50</span>·I<sub>F</sub></span> (توضيحي، خطي كما يفترض الكتاب في مثال 4-2).</p></div>
   <div class="panel c5"><h2>عند النقطة الحالية</h2><div id="l3chip" style="margin-top:6px"></div>
    <div class="facts">${fact('E<sub>ph</sub>','l3e')}${fact('δ','l3d')}${fact('I<sub>ph</sub>','l3i')}${fact('معامل القدرة (↑ متقدم، ↓ متأخر)','l3pf')}${fact('Q (لكل الأوجه)','l3q')}</div>
    <div class="svgbox" id="l3ph" style="max-width:420px;margin-inline:auto"></div><div id="l3msg" class="sm-msg"></div></div>
   <div class="panel c12"><h2>المكثف التزامني يحسّن معامل قدرة مصنع <small>توضيحي — لا يوجد مثال عددي في الكتاب؛ أرقام توضيحية</small></h2>
    <div class="sm-two"><div>${sl('l3fp','قدرة المصنع الفعالة',20,150,1,FP)}${sl('l3fpf','معامل قدرة المصنع (متأخر)',0.6,0.95,0.01,Fpf)}${sl('l3cif','تيار مجال المكثف التزامني',0,10,0.05,CIF)}
     <div class="facts">${fact('Q المصنع (يسحب)','l3qf')}${fact('Q المكثف التزامني','l3qc')}${fact('Q من الشبكة','l3qn')}${fact('معامل القدرة قبل → بعد','l3pp')}${fact('تيار الخط قبل → بعد','l3il')}</div></div>
     <div><div class="svgbox" id="l3tri"></div><p class="sub">المكثف التزامني هنا هو آلة مثال (4-1) نفسها بلا حمل (δ ≈ 0)، على شبكة <span class="ltr">208 V</span> دلتا: <span class="ltr">Q = 3·V·(E − V)/X<sub>S</sub></span>. نهمل مفاقيده.</p></div></div></div>
   <div class="panel c12"><h2>العزم مع السرعة <small>مبني على الشكل (4-4) ص 131 — العزم المقنن <span id="l3trp">45</span>% من الأقصى (توضيحي)</small></h2>
    <div class="sm-two"><div class="svgbox" id="l3tn"></div><div>${sl('l3tl','عزم الحمل (نسبة من العزم الأقصى)',0,130,1,TL*100)}<div class="facts">${fact('السرعة','l3n')}${fact('الحالة','l3st')}</div><div class="sm-row"><button class="btn" id="l3re">أعد التشغيل</button></div><div id="l3tm" class="sm-msg"></div></div></div></div>
   <div class="panel c12"><h2>جرّب خطوة خطوة</h2><ol class="steps" id="l3steps"></ol></div></div>`;
  B.math(el);
  const $=s=>el.querySelector(s);let seenLag=0,seenLead=0,seenU=0,seenCond=0,seenLost=0,seenPF=0;
  const nf=x=>fm(+x.toPrecision(3));
  // حدود تيار المجال في خطوات «جرّب» مكتوبة بالجهد الداخلي: 175 V (متأخر)، 300 V (متقدم)، 400 V (مكثف) ÷ (E/I_F)
  const kIF={lag:175,lead:300,cond:400},thr=n=>kIF[n]/TP.v.VK,thS=n=>`<span data-l3k="${n}">${nf(thr(n))}</span>`;
  const K=()=>({VK:TP.v.VK,ESAT:TP.v.ESAT,P3:TP.v.P3});
  const txt=()=>{$('#l3p3').textContent=fm(TP.v.P3);$('#l3vk').textContent=fm(TP.v.VK);$('#l3trp').textContent=fm(TP.v.Tr);el.querySelectorAll('[data-l3k]').forEach(e=>e.textContent=nf(thr(e.dataset.l3k)))};
  const rng=()=>{const x1=ifMax(K());['#l3if','#l3cif'].forEach(q=>{const r=$(q);r.max=x1;r.step=x1/200});IF=Math.min(IF,x1);CIF=Math.min(CIF,x1);$('#l3if').value=IF;$('#l3cif').value=CIF};
  let vk0=50;
  const TP=B.params($('#l3tp'),'u4-l3',[
   {k:'VK',label:'الجهد الداخلي E<sub>ph</sub> لكل أمبير من تيار المجال',unit:'V/A',value:50,min:5,max:2000},
   {k:'P3',label:'القدرة الداخلة للمنحنى الثالث P<sub>3</sub>',unit:'kW',value:36,min:25,max:100},
   {k:'ESAT',label:'أعلى جهد داخلي عند التشبع',unit:'V',value:520,min:250,max:5000},
   {k:'Tr',label:'العزم المقنن (نسبة من العزم الأقصى)',unit:'%',value:45,min:5,max:95}],v=>{
    IF*=vk0/v.VK;CIF*=vk0/v.VK;vk0=v.VK;rng();txt();lastA=lastB=lastC=''});
  if(TP.v.VK!==50){IF*=50/TP.v.VK;CIF*=50/TP.v.VK;vk0=TP.v.VK;rng()}txt();
  el.querySelectorAll('[data-ld]').forEach(b=>b.onclick=()=>{li=+b.dataset.ld;segSet(el,'ld',li);lastA=''});
  $('#l3if').oninput=e=>{IF=+e.target.value};$('#l3sat').onclick=()=>{sat=sat?0:1;swSet($('#l3sat'),sat);lastA=''};
  $('#l3fp').oninput=e=>{FP=+e.target.value};$('#l3fpf').oninput=e=>{Fpf=+e.target.value};$('#l3cif').oninput=e=>{CIF=+e.target.value};
  $('#l3tl').oninput=e=>{TL=+e.target.value/100};$('#l3re').onclick=()=>{if(TL<=1){nT=1;lostT=0}};
  const steps=stepsUI($('#l3steps'),[
   {t:'معامل قدرة متأخر',get x(){return `على P<sub>1</sub> اخفض I<sub>F</sub> إلى أقل من <span class="ltr">${thS('lag')} A</span>: التيار متأخر عن الجهد والمحرك يسحب Q من الشبكة (كأنه ملف).`},done:()=>seenLag},
   {t:'معامل قدرة = 1',x:'حرّك I<sub>F</sub> حتى تصل إلى أدنى نقطة في المنحنى (على الخط المتقطع): أقل تيار منتج ومعامل قدرة ≈ 1.',done:()=>seenU},
   {t:'معامل قدرة متقدم',get x(){return `زد I<sub>F</sub> فوق <span class="ltr">${thS('lead')} A</span>: التيار متقدم والمحرك يعطي Q للشبكة (كأنه مكثف).`},done:()=>seenLead},
   {t:'قدرة أكبر',x:'اختر P<sub>3</sub>: المنحنى أعلى ونقطته الدنيا أبعد إلى اليمين، أي نحتاج تيار مجال أكبر لمعامل قدرة = 1.',done:()=>li===2},
   {t:'المكثف التزامني',get x(){return `اختر «بدون حمل» واضبط I<sub>F</sub> على <span class="ltr">${thS('cond')} A</span> أو أكثر: التيار متقدم بزاوية قريبة من 90° (ص 131).`},done:()=>seenCond},
   {t:'حسّن معامل قدرة المصنع',x:'في لوحة المصنع ارفع تيار مجال المكثف التزامني حتى يصبح معامل القدرة بعد التحسين 0.95 أو أكثر، ولاحظ نقص تيار الخط.',done:()=>seenPF},
   {t:'العزم الأقصى',x:'في لوحة العزم مع السرعة ارفع عزم الحمل فوق 100%: يفقد المحرك التزامن وتهبط السرعة إلى الصفر.',done:()=>seenLost}]);
  loopOn(el,dt=>{
   $('#l3if-v').textContent=fm(IF,2)+' A';$('#l3fp-v').textContent=FP+' kW';$('#l3fpf-v').textContent=fm(Fpf,2);$('#l3cif-v').textContent=fm(CIF,2)+' A';$('#l3tl-v').textContent=Math.round(TL*100)+' %';
   const sgA=[li,IF,sat].join();
   if(sgA!==lastA){lastA=sgA;const P=li<3?loadP(li,K()):0,E=Ef(IF,sat,K()),m=motor(EX.V,E,EX.Xs,P);
    $('#l3v').innerHTML=vSVG({sat,k:K(),hi:li<3?li:-1,cond:li===3,all:1,pt:m.ok?[IF,m.Im]:null});
    $('#l3e').textContent=fm(E,1)+' V';
    if(m.ok){$('#l3d').textContent=fm(m.d,1)+'°';$('#l3i').textContent=fm(m.Im,2)+' A';$('#l3pf').textContent=fm(m.pf,3)+(m.lead>0?' ↑':m.lead<0?' ↓':'');$('#l3q').textContent=fm(Math.abs(m.Q)/1000,2)+' kvar';
     $('#l3chip').innerHTML=m.lead>0?chip('يعطي Q للشبكة — يتصرف كمكثف','blue'):m.lead<0?chip('يسحب Q من الشبكة — يتصرف كملف','warn'):chip('معامل القدرة = 1 — P فقط','ok');
     if(m.lead<0&&li===0&&IF<thr('lag'))seenLag=1;if(m.lead>0&&li===0&&IF>thr('lead'))seenLead=1;if(Math.abs(m.th)<3&&li<3)seenU=1;if(li===3&&m.th>80&&IF>=thr('cond')-1e-9)seenCond=1;
     const kI=li===3?1.2:1.6;$('#l3ph').innerHTML=phSVG({view:{x0:-60,x1:Math.max(300,E+30),y0:-170,y1:200},W:420,H:340,vecs:onePoint(EX.V,m,{kI}),arcs:phArcs(m)});
     $('#l3msg').innerHTML=`<div class="callout">${m.lead>0?'القدرة غير الفعالة تنتقل <b>من المحرك إلى الشبكة</b>.':m.lead<0?'القدرة غير الفعالة تنتقل <b>من الشبكة إلى المحرك</b>.':'لا تنتقل قدرة غير فعالة تقريباً.'}</div>`}
    else{['#l3d','#l3i','#l3pf','#l3q'].forEach(k=>$(k).textContent='—');$('#l3chip').innerHTML=chip('تيار المجال لا يكفي لهذا الحمل: فقد التزامن','bad');$('#l3ph').innerHTML='';$('#l3msg').innerHTML='<div class="callout err">لهذا الحمل يلزم <span class="ltr">sin|δ| = X<sub>S</sub>P/(3VE)</span> أكبر من 1، أي أن E صغير جداً: المحرك لا يستطيع حمل هذه القدرة. زد تيار المجال.</div>'}}
   const sgB=[FP,Fpf,CIF].join();
   if(sgB!==lastB){lastB=sgB;const Qf=FP*Math.tan(Math.acos(Fpf)),E=Ef(CIF,0,K()),Qc=3*EX.V*(E-EX.V)/EX.Xs/1000,Qn=Qf-Qc,pf2=FP/Math.hypot(FP,Qn);
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
   if(sgC!==lastC){lastC=sgC;$('#l3tn').innerHTML=tnSVG({clip:'l3tnc',Tr:TP.v.Tr/100,pt:[nT,Math.min(TL,1.2),lostT?'--stop':'--live']});$('#l3n').textContent=fm(nT*3600,0)+' rpm';
    $('#l3st').innerHTML=lostT?chip('فقد التزامن','bad'):TL>TP.v.Tr/100?chip('فوق العزم المقنن','warn'):chip('متزامن','ok');
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
 stations:[
  {intro:true},

  {st:1,short:'ماذا يحدث عند زيادة الحمل؟',title:'زيادة الحمل وتيار المجال ثابت',ref:'ص 132',
   q:'سرعة المحرك التزامني لا تتغير مع الحمل… فإذا كانت السرعة ثابتة، فمن أين يأتي العزم الإضافي الذي يحتاجه الحمل الأكبر؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مخطط اتجاهي لمحرك تزامني عند معامل قدرة متقدم: الجهد الداخلي على دائرة ثابتة، والمسافة الرأسية تتناسب مع القدرة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="146" fill="#FBE6C4"/><path data-tip="دائرة نصف قطرها ⟦Eph⟧: تيار المجال ثابت، فطول ⟦Eph⟧ ثابت، ورأسه يتحرك على هذه الدائرة عندما يتغير الحمل." d="M296.7 93.7A275.4 275.4 0 0 1 262.5 269.7" fill="none" stroke="#8A9A93" stroke-width="1.8" stroke-dasharray="6 5"/><g data-tip="جهد الوجه ⟦Vph⟧: المرجع الأفقي بزاوية ⟦0°⟧، ثابت لأن المصدر ضخم."><line x1="24" y1="132" x2="232.1" y2="132" stroke="#2C4A40" stroke-width="3.5" stroke-linecap="round"/><polygon points="248.6,132 232.1,139.4 232.1,124.6" fill="#2C4A40"/></g><g data-tip="المتجه ⟦jXS·Iph⟧: يبدأ من رأس ⟦Eph⟧ وينتهي عند رأس ⟦Vph⟧، وهو عمودي على التيار."><line x1="293" y1="191.2" x2="258" y2="144.5" stroke="#2E8C83" stroke-width="2.6" stroke-linecap="round"/><polygon points="248.6,132 263.6,140.3 252.4,148.7" fill="#2E8C83"/></g><g data-tip="الجهد الداخلي ⟦Eph⟧: يتأخر عن ⟦Vph⟧ بزاوية العزم δ."><line x1="24" y1="132" x2="276.8" y2="187.7" stroke="#E8735A" stroke-width="3.5" stroke-linecap="round"/><polygon points="293,191.2 275.2,194.9 278.4,180.4" fill="#E8735A"/></g><g data-tip="تيار المنتج ⟦Iph⟧: متقدم على ⟦Vph⟧ بالزاوية θ في هذه الحالة."><line x1="24" y1="132" x2="76.8" y2="92.5" stroke="#12855A" stroke-width="3.2" stroke-linecap="round"/><polygon points="89.8,82.8 81.2,98.3 72.5,86.6" fill="#12855A"/></g><path d="M116 132A92 92 0 0 1 113.8 151.8" fill="none" stroke="#E8735A" stroke-width="2"/><text x="128" y="148" text-anchor="middle" font-size="15" fill="#E8735A" font-weight="700" direction="rtl">δ</text><path d="M70 132A46 46 0 0 0 60.8 104.4" fill="none" stroke="#12855A" stroke-width="2"/><text x="80" y="118" text-anchor="middle" font-size="15" fill="#12855A" font-weight="700" direction="rtl">θ</text><g data-tip="المسافة الرأسية بين ⟦Vph⟧ ورأس ⟦Eph⟧ (أي ⟦Eph sinδ⟧) تتناسب مع القدرة P التي يأخذها المحرك."><path d="M309 132V191.2M304 132h10M304 191.2h10" stroke="#B23A2A" stroke-width="2.4" fill="none"/><text x="315" y="166.6" text-anchor="start" font-size="14" fill="#B23A2A" font-weight="700" direction="ltr" font-family="var(--mono)">∝P</text></g><text x="242.6" y="120" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">V<tspan font-size="10" dy="4">ph</tspan><tspan dy="-4">&#8203;</tspan></text><text x="289" y="213.2" text-anchor="middle" font-size="14" fill="#E8735A" font-weight="700" direction="ltr" font-family="var(--mono)">E<tspan font-size="10" dy="4">ph</tspan><tspan dy="-4">&#8203;</tspan></text><text x="93.8" y="74.8" text-anchor="start" font-size="14" fill="#12855A" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="10" dy="4">ph</tspan><tspan dy="-4">&#8203;</tspan></text><text x="260.8" y="169.6" text-anchor="end" font-size="13" fill="#2E8C83" font-weight="700" direction="ltr" font-family="var(--mono)">jX<tspan font-size="10" dy="4">S</tspan><tspan dy="-4">I</tspan><tspan font-size="10" dy="4">ph</tspan></text><text x="180" y="292" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">محرك يعمل عند معامل قدرة متقدم</text></svg>`,
   cap:'الشكل <span class="ltr">(4-6)</span> أ: محرك يعمل عند معامل قدرة متقدم. المسافة الرأسية الحمراء تتناسب مع القدرة.<br><b>مرّر المؤشر على الأسهم والقوس والدائرة المتقطعة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'زاد الحمل على عمود المحرك وتيار المجال ثابت. ماذا يتغير بعد أن يستقر المحرك من جديد؟',opts:[
     ['تقل السرعة وتبقى أقل من السرعة التزامنية',false,'السرعة تقل لحظياً فقط، ثم تعود إلى السرعة التزامنية.'],
     [String.raw`يزداد طول \(E_{ph}\)`,false,String.raw`طول \(E_{ph}\) يحدده تيار المجال، وتيار المجال ثابت هنا.`],
     ['تكبر زاوية العزم δ، فيأخذ المحرك قدرة أكبر والسرعة تعود تزامنية',true,'نص الكتاب: تعود السرعة إلى السرعة التزامنية «ولكن عند زاوية عزم (δ) أكبر، مما يعني استهلاكاً لقدرة أكبر».']]}}
   ],
   body:[
    {book:String.raw`<p>عندما يدار حمل ما بمحرك تزامني فإن المحرك سوف ينتج ما يكفي من العزم لكي يحافظ على سرعة دورانه عند السرعة التزامنية.</p>
     <p>لكي نفهم ما يحدث عند تغير الحمل، نفترض أن المحرك يعمل عند معامل قدرة متقدماً كما هو موضح في الشكل (4-6)أ، فإذا ازداد الحمل على عمود الدوران فإن سرعة المحرك ستقل ونتيجة لذلك <b>زاوية العزم (δ) سوف تزداد</b> وبالتالي سوف يزداد العزم المتولد طبقاً للمعادلة (3-17) والذي بدوره سيزيد من سرعة العضو الدوار إلى أن تصل إلى السرعة التزامنية مرة أخرى ولكن عند زاوية عزم (δ) أكبر، مما يعني استهلاكاً لقدرة أكبر، وهكذا كلما ازداد الحمل على المحرك كما هو واضح من المخطط الاتجاهي في الشكل (4-6) ب، ويحدث العكس تماماً عندما يقل الحمل على المحرك.</p>`,ref:'ص 132'},
    {title:'تابع السلسلة خطوة خطوة',widget:(el,B)=>{
      const S=['زاد الحمل على العمود','قلّت السرعة لحظياً','زادت زاوية العزم δ','زاد العزم المتولد','عادت السرعة إلى السرعة التزامنية','يستقر عند δ أكبر: قدرة أكبر'];
      el.innerHTML=`<p class="sub" style="margin:0 0 10px">اضغط «زِد الحمل» وتابع كيف ينتقل الأثر من حلقة إلى التي بعدها.</p><div class="chain">${S.map((s,i)=>`<span class="ck${i===S.length-1?' end':''}">${s}</span>${i<S.length-1?'<span class="ar">←</span>':''}`).join('')}</div><div class="w-row"><button class="btn pri" type="button" data-go>زِد الحمل</button><button class="btn" type="button" data-rs>إعادة</button></div>`;
      const ks=[...el.querySelectorAll('.ck')];let tm=[];
      const rs=()=>{tm.forEach(clearTimeout);tm=[];ks.forEach(k=>k.classList.remove('on'))};
      el.querySelector('[data-go]').onclick=()=>{rs();ks.forEach((k,i)=>tm.push(setTimeout(()=>k.classList.add('on'),i*600)))};
      el.querySelector('[data-rs]').onclick=rs;
    }},
    {watch:String.raw`<p>يقول الكتاب «طبقاً للمعادلة (3-17)»، لكن (3-17) في الوحدة الثالثة <b>شكل</b> (مخطط سريان القدرة داخل المولد، ص 109) وليس معادلة. العلاقة التي تربط القدرة بزاوية العزم هي المعادلة (3-15) ص 108، وهي نفسها التي يستعملها مثال (4-1) لإيجاد δ. على الأرجح المقصود (3-15):</p>
     <div class="eq">$$P_o=\frac{3\,V_{ph}E_{ph}\sin\delta}{X_S}$$<span class="eqno">(3-15)</span></div>`,fix:true},
    {tip:String.raw`<p>من (3-15) القدرة تتناسب مع \(\sin\delta\). والسرعة ثابتة، والعزم = القدرة ÷ السرعة، فالعزم أيضاً يزداد مع δ حتى أقصاه عند \(\delta=-90^\circ\). لذلك عندما يزداد الحمل تكبر δ حتى يتساوى عزم المحرك مع عزم الحمل.</p>`,title:'العزم الإضافي من δ'}
   ]},

  {st:2,short:'E على دائرة',title:'المخطط الاتجاهي: رأس E يتحرك على دائرة',ref:'ص 132–133',
   q:'تيار المجال لم يتغير، فطول E ثابت… فكيف يتغير التيار ومعامل القدرة كلما زاد الحمل؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="أربعة متجهات للجهد الداخلي متساوية الطول على دائرة، تزداد زاويتها مع الحمل، وتيارات تدور من متقدم إلى متأخر" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="150" fill="#DDEFE6"/><path data-tip="رؤوس ⟦Eph1⟧ إلى ⟦Eph4⟧ على دائرة واحدة: تيار المجال لم يتغير، فالطول ثابت والذي يتغير هو الزاوية δ فقط." d="M261.1 83.3A239.7 239.7 0 0 1 156 298.7" fill="none" stroke="#8A9A93" stroke-width="1.8" stroke-dasharray="6 5"/><g data-tip="جهد الوجه ⟦Vph⟧: ثابت (مرجع)."><line x1="22" y1="100" x2="201" y2="100" stroke="#2C4A40" stroke-width="3.5" stroke-linecap="round"/><polygon points="217.5,100 201,107.4 201,92.6" fill="#2C4A40"/></g><line x1="256.1" y1="151.6" x2="217.5" y2="100" stroke="#2E8C83" stroke-width="1.6"/><g data-tip="الجهد الداخلي ⟦Eph1⟧: الحمل الأصغر، زاوية δ صغيرة."><line x1="22" y1="100" x2="240.7" y2="148.2" stroke="#E8735A" stroke-width="2.8" stroke-linecap="round"/><polygon points="256.1,151.6 239.1,155.1 242.2,141.2" fill="#E8735A"/></g><g data-tip="التيار ⟦Iph1⟧: متقدم بوضوح."><line x1="22" y1="100" x2="60" y2="71.6" stroke="#5DBB8A" stroke-width="2.6" stroke-linecap="round"/><polygon points="72.5,62.3 64.2,77.2 55.8,66" fill="#5DBB8A"/></g><text x="250.1" y="167.6" text-anchor="middle" font-size="12" fill="#E8735A" font-weight="700" direction="ltr" font-family="var(--mono)">E<tspan font-size="8" dy="4">ph1</tspan><tspan dy="-4">&#8203;</tspan></text><text x="77.5" y="58.3" text-anchor="start" font-size="12" fill="#5DBB8A" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="8" dy="4">ph1</tspan><tspan dy="-4">&#8203;</tspan></text><path data-tip="المسافة الرأسية بين ⟦Vph⟧ ورأس ⟦Eph1⟧ تتناسب مع القدرة ⟦P1⟧؛ تكبر مع الحمل." d="M300 100V151.6" stroke="#B23A2A" stroke-width="2.4" fill="none"/><line x1="260.1" y1="151.6" x2="300" y2="151.6" stroke="#B23A2A" stroke-width="1" stroke-dasharray="2 3"/><line x1="242.6" y1="193.7" x2="217.5" y2="100" stroke="#2E8C83" stroke-width="1.6"/><g data-tip="الجهد الداخلي ⟦Eph2⟧: حمل أكبر، زاوية δ أكبر."><line x1="22" y1="100" x2="228.1" y2="187.5" stroke="#D9622F" stroke-width="2.8" stroke-linecap="round"/><polygon points="242.6,193.7 225.3,194.1 230.9,181" fill="#D9622F"/></g><g data-tip="التيار ⟦Iph2⟧: أقل تقدماً وأطول."><line x1="22" y1="100" x2="98.6" y2="79.5" stroke="#2E9E68" stroke-width="2.6" stroke-linecap="round"/><polygon points="113.7,75.4 100.5,86.2 96.8,72.7" fill="#2E9E68"/></g><text x="236.6" y="209.7" text-anchor="middle" font-size="12" fill="#D9622F" font-weight="700" direction="ltr" font-family="var(--mono)">E<tspan font-size="8" dy="4">ph2</tspan><tspan dy="-4">&#8203;</tspan></text><text x="118.7" y="71.4" text-anchor="start" font-size="12" fill="#2E9E68" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="8" dy="4">ph2</tspan><tspan dy="-4">&#8203;</tspan></text><path data-tip="المسافة الرأسية بين ⟦Vph⟧ ورأس ⟦Eph2⟧ تتناسب مع القدرة ⟦P2⟧؛ تكبر مع الحمل." d="M314 100V193.7" stroke="#B23A2A" stroke-width="2.4" fill="none"/><line x1="246.6" y1="193.7" x2="314" y2="193.7" stroke="#B23A2A" stroke-width="1" stroke-dasharray="2 3"/><line x1="217.6" y1="238.6" x2="217.5" y2="100" stroke="#2E8C83" stroke-width="1.6"/><g data-tip="الجهد الداخلي ⟦Eph3⟧: حمل أكبر أيضاً."><line x1="22" y1="100" x2="204.7" y2="229.5" stroke="#B8481F" stroke-width="2.8" stroke-linecap="round"/><polygon points="217.6,238.6 200.6,235.3 208.8,223.7" fill="#B8481F"/></g><g data-tip="التيار ⟦Iph3⟧: تقريباً على اتجاه ⟦Vph⟧."><line x1="22" y1="100" x2="142" y2="100" stroke="#12855A" stroke-width="2.6" stroke-linecap="round"/><polygon points="157.6,99.9 142,107 142,92.9" fill="#12855A"/></g><text x="211.6" y="254.6" text-anchor="middle" font-size="12" fill="#B8481F" font-weight="700" direction="ltr" font-family="var(--mono)">E<tspan font-size="8" dy="4">ph3</tspan><tspan dy="-4">&#8203;</tspan></text><text x="162.6" y="90.9" text-anchor="start" font-size="12" fill="#12855A" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="8" dy="4">ph3</tspan><tspan dy="-4">&#8203;</tspan></text><path data-tip="المسافة الرأسية بين ⟦Vph⟧ ورأس ⟦Eph3⟧ تتناسب مع القدرة ⟦P3⟧؛ تكبر مع الحمل." d="M328 100V238.6" stroke="#B23A2A" stroke-width="2.4" fill="none"/><line x1="221.6" y1="238.6" x2="328" y2="238.6" stroke="#B23A2A" stroke-width="1" stroke-dasharray="2 3"/><line x1="179.4" y1="280.8" x2="217.5" y2="100" stroke="#2E8C83" stroke-width="1.6"/><g data-tip="الجهد الداخلي ⟦Eph4⟧: الحمل الأكبر، أكبر زاوية δ."><line x1="22" y1="100" x2="169" y2="268.9" stroke="#8E3412" stroke-width="2.8" stroke-linecap="round"/><polygon points="179.4,280.8 163.7,273.5 174.4,264.2" fill="#8E3412"/></g><g data-tip="التيار ⟦Iph4⟧: متأخر، وهو الأطول."><line x1="22" y1="100" x2="183.7" y2="134.1" stroke="#0B5E3E" stroke-width="2.6" stroke-linecap="round"/><polygon points="198.9,137.3 182.2,140.9 185.1,127.2" fill="#0B5E3E"/></g><text x="165.4" y="296.8" text-anchor="middle" font-size="12" fill="#8E3412" font-weight="700" direction="ltr" font-family="var(--mono)">E<tspan font-size="8" dy="4">ph4</tspan><tspan dy="-4">&#8203;</tspan></text><text x="203.9" y="153.3" text-anchor="start" font-size="12" fill="#0B5E3E" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="8" dy="4">ph4</tspan><tspan dy="-4">&#8203;</tspan></text><path data-tip="المسافة الرأسية بين ⟦Vph⟧ ورأس ⟦Eph4⟧ تتناسب مع القدرة ⟦P4⟧؛ تكبر مع الحمل." d="M342 100V280.8" stroke="#B23A2A" stroke-width="2.4" fill="none"/><line x1="183.4" y1="280.8" x2="342" y2="280.8" stroke="#B23A2A" stroke-width="1" stroke-dasharray="2 3"/><text x="213.5" y="88" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">V<tspan font-size="10" dy="4">ph</tspan><tspan dy="-4">&#8203;</tspan></text><text x="328" y="90" text-anchor="middle" font-size="13" fill="#B23A2A" font-weight="700" direction="ltr" font-family="var(--mono)">∝P</text></svg>`,
   cap:'الشكل <span class="ltr">(4-6)</span> ب: أربع حالات تحميل متزايدة. رؤوس الجهود على دائرة واحدة، والتيار يطول ويدور من متقدم إلى متأخر (رسم توضيحي بلا أرقام).<br><b>مرّر المؤشر على أي سهم أو خط (أو المسه في الجوال) لتعرف معناه.</b>',
   side:[
    {predict:{q:'محرك يعمل بتيار متقدم، وزاد حمله كثيراً وتيار المجال ثابت. ماذا يحدث لتياره؟',opts:[
     ['يطول ويقل تقدمه، وقد يصير متأخراً إذا استمرت زيادة الحمل',true,String.raw`هذا ما يرسمه الشكل (4-6) ب: \(I_{ph1}\) متقدم بوضوح … \(I_{ph4}\) متأخر، وكل تيار أطول من السابق.`],
     ['يقصر ويزداد تقدمه',false,'العكس: الحمل الأكبر يحتاج تياراً أكبر، ويدور التيار نحو التأخر.'],
     ['لا يتغير لأن تيار المجال ثابت',false,'تيار المجال الثابت يُبقي طول E ثابتاً، لكن التيار يتغير مع δ.']]}}
   ],
   body:[
    {book:String.raw`<p>مع ملاحظة أن قيمة \(E_{Ph}\) <b>تبقى ثابتة دائماً</b> بسبب عدم تغير قيمة تيار المجال وفي المخطط الاتجاهي يتحرك المتجه \(E_{Ph}\) <b>راسماً دائرة</b> يمثل نصف قطرها، المثال التالي يوضح هذا السلوك للمحرك التزامني.</p>`,ref:'ص 132'},
    {tip:String.raw`<p>اقرأ الشكل (4-6) ب على ثلاث خطوات:</p><ol>
     <li>\(V_{ph}\) ثابت (الشبكة ضخمة)، و\(E_{ph}\) ثابت الطول (تيار المجال ثابت)، فرأسه على دائرة.</li>
     <li>كلما زاد الحمل نزل رأس \(E_{ph}\) على الدائرة: δ تكبر، والمسافة الرأسية بينه وبين \(V_{ph}\) (وهي \(E\sin\delta\)) تكبر مع القدرة \(P\).</li>
     <li>المتجه \(jX_SI_{ph}\) من رأس \(E_{ph}\) إلى رأس \(V_{ph}\) يطول ويدور، والتيار عمودي عليه، فيطول التيار ويدور من متقدم نحو متأخر.</li></ol>`,title:'اقرأ الشكل'},
    {watch:String.raw`<p>معامل القدرة <b>يتغير</b> مع الحمل في هذه الحالة. إذا أردت أن يبقى متقدماً عند حمل كبير يجب أن تزيد تيار المجال أيضاً، وهذا موضوع الدرس القادم.</p>`},
    {title:'مختبر مصغّر: رأس E على الدائرة',widget:(el,B)=>DCML.lab(el,B,{intro:String.raw`محرك مثال (4-1): \(V_{ph} = 208\ \text{V}\)، \(X_S = 2.5\ \Omega\)، وتيار المجال ثابت فـ \(E_{ph} = 255\ \text{V}\) ثابت. زد القدرة الداخلة (أرقام تختارها أنت؛ نقطتا الكتاب 13.69 و24.88 kW).`,
 predict:{q:String.raw`تيار المجال ثابت ونزيد الحمل. على أي خط يتحرك رأس المتجه \(E_{ph}\)؟`,opts:[
  ['على خط رأسي',false,'الخط الثابت يظهر في الدرس التالي (تغيير تيار المجال والحمل ثابت).'],
  [String.raw`على دائرة نصف قطرها \(E_{ph}\)`,true,String.raw`«قيمة \(E_{Ph}\) تبقى ثابتة دائماً بسبب عدم تغير قيمة تيار المجال ... يتحرك المتجه \(E_{Ph}\) راسماً دائرة».`],
  ['لا يتحرك',false,String.raw`طوله ثابت، لكن زاويته \(\delta\) تكبر مع الحمل.`]]},
 ins:[{k:'P',l:'القدرة الداخلة P',min:0,max:60,step:0.5,v:13.5,u:'kW',dp:1}],
 calc:(s,v,B)=>{const m=motor(208,255,2.5,s.P*1000);if(!m.ok)return {msg:'خارج حد التزامن.',cls:'bad'};
  return {pic:phSVG({W:440,H:330,view:{x0:-40,x1:290,y0:-260,y1:130},circles:[{r:255}],vecs:onePoint(208,m,{kI:1}),arcs:phArcs(m)}),
   facts:[['زاوية العزم δ',DCML.fm(B,m.d,1)+'°'],['تيار الوجه <bdi class="ltr">I<sub>ph</sub></bdi>',DCML.fm(B,m.Im,1)+' A','hi'],['معامل القدرة',DCML.fm(B,Math.abs(m.pf),3)+' '+pfT(m)]],
   msg:Math.abs(s.P-13.5)<0.3?String.raw`قرب نقطة الكتاب عند <bdi class="ltr">15 hp</bdi>: \(\delta = -12.4^\circ\) و\(I_{ph} = 27.4\angle 36.87^\circ\ \text{A}\).`:Math.abs(s.P-25)<0.3?String.raw`قرب نقطة الكتاب عند <bdi class="ltr">30 hp</bdi>: \(\delta = -23^\circ\) و\(I_{ph} \approx 41.2\angle 15^\circ\ \text{A}\).`:m.lead<0?'التيار صار متأخراً: الحمل كبير على هذا التيار للمجال.':'كلما زاد الحمل تكبر δ ويطول التيار ويقل تقدمه.'}}})}
   ]},

  {st:3,short:'مثال (4-1)',title:'مثال (4-1)',ref:'ص 133–136',
   q:'محرك يدير 15 hp، ثم يتضاعف الحمل إلى 30 hp وتيار المجال ثابت. ماذا يصير التيار ومعامل القدرة؟ الحل الكامل خطوة بخطوة في تبويب «الأمثلة المحلولة».',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مخطط مثال 4-1 قبل زيادة الحمل وبعدها: الجهد الداخلي بنفس الطول وزاوية أكبر، والتيار أطول وأقل تقدماً" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="156" r="148" fill="#F7DCC8"/><path d="M287.7 92.3A265.2 265.2 0 0 1 243.9 268.3" fill="none" stroke="#8A9A93" stroke-width="1.8" stroke-dasharray="6 5"/><g data-tip="جهد الوجه ⟦Vph = 208∠0° V⟧ (توصيل دلتا)."><line x1="24" y1="120" x2="223.8" y2="120" stroke="#2C4A40" stroke-width="3.5" stroke-linecap="round"/><polygon points="240.3,120 223.8,127.4 223.8,112.6" fill="#2C4A40"/></g><line x1="283" y1="176.9" x2="240.3" y2="120" stroke="#2E8C83" stroke-width="2"/><g data-tip="قبل زيادة الحمل ⟦15 hp⟧: ⟦Eph = 255∠−12.4° V⟧."><line x1="24" y1="120" x2="268" y2="173.6" stroke="#F2A08C" stroke-width="2.4" stroke-linecap="round"/><polygon points="283,176.9 266.5,180.4 269.5,166.9" fill="#F2A08C"/></g><g data-tip="قبل زيادة الحمل: ⟦Iph = 27.4∠36.87° A⟧ (متقدم، معامل القدرة 0.8)."><line x1="24" y1="120" x2="68.8" y2="86.4" stroke="#7CC8A0" stroke-width="2.1999999999999997" stroke-linecap="round"/><polygon points="81,77.3 72.9,91.8 64.7,80.9" fill="#7CC8A0"/></g><line x1="81" y1="77.3" x2="81" y2="120" stroke="#8A9A93" stroke-width="1.2" stroke-dasharray="3 4"/><text x="291" y="170.9" text-anchor="start" font-size="13" fill="#F2A08C" font-weight="700" direction="ltr" font-family="var(--mono)">E<tspan font-size="9" dy="4">ph</tspan><tspan dy="-4">&#8203;</tspan></text><text x="87" y="73.3" text-anchor="start" font-size="13" fill="#7CC8A0" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="9" dy="4">ph</tspan><tspan dy="-4">&#8203;</tspan></text><line x1="268.1" y1="223.6" x2="240.3" y2="120" stroke="#2E8C83" stroke-width="2"/><g data-tip="بعد زيادة الحمل إلى ⟦30 hp⟧: الطول نفسه ⟦255 V⟧ والزاوية أكبر ⟦−23°⟧."><line x1="24" y1="120" x2="253" y2="217.2" stroke="#E8735A" stroke-width="3.4" stroke-linecap="round"/><polygon points="268.1,223.6 250.1,224 255.9,210.4" fill="#E8735A"/></g><g data-tip="بعد زيادة الحمل: ⟦Iph = 41.2∠15° A⟧ أطول وأقل تقدماً."><line x1="24" y1="120" x2="111.8" y2="96.5" stroke="#12855A" stroke-width="3.1999999999999997" stroke-linecap="round"/><polygon points="127.5,92.3 113.7,103.5 109.9,89.4" fill="#12855A"/></g><line x1="127.5" y1="92.3" x2="127.5" y2="120" stroke="#8A9A93" stroke-width="1.2" stroke-dasharray="3 4"/><text x="276.1" y="241.6" text-anchor="start" font-size="13" fill="#E8735A" font-weight="700" direction="ltr" font-family="var(--mono)">E<tspan font-size="9" dy="4">ph</tspan><tspan dy="-4">′</tspan></text><text x="133.5" y="88.3" text-anchor="start" font-size="13" fill="#12855A" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="9" dy="4">ph</tspan><tspan dy="-4">′</tspan></text><text x="238.3" y="108" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">V<tspan font-size="9" dy="4">ph</tspan><tspan dy="-4">&#8203;</tspan></text><text x="180" y="290" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">مثال (4-1) بعد زيادة الحمل</text></svg>`,
   cap:'الشكل <span class="ltr">(4-7)</span> ب: قبل زيادة الحمل (فاتح) وبعدها (داكن). طول E ثابت وزاويته أكبر، والتيار أطول وأقل تقدماً.<br><b>مرّر المؤشر على الأسهم (أو المسها في الجوال) لتعرف قيمها من الكتاب.</b>',
   side:[
    {book:String.raw`<p>محرك تزامني ملفاته موصلة على شكل دلتا، جهد المصدر <span class="ltr">208 V</span> والتردد <span class="ltr">60 Hz</span>، ممانعته التزامنية <span class="ltr">2.5 Ω</span> ومقاومة ملفات المنتج مهملة، المفاقيد الحديدية <span class="ltr">1.0 kw</span> ومفاقيد الاحتكاك <span class="ltr">1.5 kw</span>، يدير حملاً قدرته <span class="ltr">15 hp</span> عند معامل قدرة <span class="ltr">0.8</span> متقدماً:</p>
     <p>أ) ارسم المخطط الاتجاهي للمحرك. ب) أوجد قيم \(I_L\)، \(I_{Ph}\)، \(E_{Ph}\). جـ) عندما يزداد الحمل إلى <span class="ltr">30 hp</span> وضح سلوك المحرك باستخدام المخطط الاتجاهي. د) أوجد قيم \(I_L\)، \(I_{Ph}\)، \(E_{Ph}\) بعد زيادة الحمل. هـ) احسب معامل القدرة بعد زيادة الحمل.</p>`,ref:'ص 133'},
    {predict:{q:String.raw`بعد زيادة الحمل إلى <span class="ltr">30 hp</span>، كم يصير طول \(E_{Ph}\)؟`,opts:[
     [String.raw`أكبر من <span class="ltr">255 V</span> لأن الحمل زاد`,false,'طول E يحدده تيار المجال، والحمل لا يغيره.'],
     [String.raw`أقل من <span class="ltr">255 V</span>`,false,'تيار المجال ثابت، فلا سبب لأن يقل E.'],
     [String.raw`يبقى <span class="ltr">255 V</span> والذي يتغير هو الزاوية δ`,true,String.raw`الكتاب: «بعد زيادة الحمل قيمة \(E_{Ph}\) لم تتغير وإنما ازدادت الزاوية (δ)»، فيصير \(E_{Ph}=255\angle{-23^\circ}\).`]]}}
   ],
   body:[
    {html:String.raw`<div class="exl">
     <div class="exc"><header>قبل زيادة الحمل <span class="ltr">15 hp</span> <span class="ref">ص 134–135</span></header>
      <div class="kv-row"><small>القدرة</small><span class="kv ltr">\(P_o=11.19\ \text{kw}\)</span><span class="kv ltr">\(P_{in}=13.69\ \text{kw}\)</span></div>
      <div class="kv-row"><small>النتائج</small><span class="kv res ltr">\(I_L=47.5\ \text{A}\)</span><span class="kv res ltr">\(I_{ph}=27.4\angle{36.87^\circ}\ \text{A}\)</span><span class="kv res ltr">\(E_{Ph}=255\angle{-12.4^\circ}\ \text{V}\)</span></div></div>
     <div class="exc"><header>بعد زيادة الحمل <span class="ltr">30 hp</span> <span class="ref">ص 135–136</span></header>
      <div class="kv-row"><small>القدرة</small><span class="kv ltr">\(P_{in}=24.88\ \text{kw}\)</span><span class="kv ltr">\(\delta=23^\circ\)</span></div>
      <div class="kv-row"><small>النتائج</small><span class="kv res ltr">\(E_{Ph}=255\angle{-23^\circ}\ \text{V}\)</span><span class="kv res ltr">\(I_{Ph}=41.2\angle{15^\circ}\ \text{A}\)</span><span class="kv res ltr">\(I_L=71.4\ \text{A}\)</span><span class="kv res ltr">\(\cos\theta=0.966\)</span></div></div>
     <div class="w-row"><button class="btn pri" type="button" onclick="var b=document.querySelector('.ltabs button[data-tab=examples]');if(b)b.click()">افتح الأمثلة المحلولة وغيّر الأرقام</button></div></div>`},
    {book:String.raw`<p>جـ) عند زيادة الحمل إلى <span class="ltr">30 hp</span> فإن العضو الدوار سيتباطأ قليلاً وعندها تزداد الزاوية (δ) بين المجالين مما يعني ازدياد عزم المحرك لكي تصل سرعته إلى وضعها السابق وهذا يعني انفراج الزاوية بين \(V_{Ph}\) و \(E_{Ph}\) كما هو موضح في المخطط الاتجاهي في الشكل رقم (4-7)ب.</p>
     <p>د) … بعد زيادة الحمل قيمة \(E_{Ph}\) لم تتغير وإنما ازدادت الزاوية (δ) بينها وبين \(V_{Ph}\) هذه الزاوية الجديدة يمكن إيجادها بتطبيق المعادلة (3-15) كما يلي:</p>
     $$\begin{aligned}\delta&=\sin^{-1}\left(\frac{X_SP}{3\,V_{Ph}E_{Ph}}\right)\\&=\sin^{-1}\left(\frac{2.5\times24.88\times10^3}{3\times208\times255}\right)\\&=\sin^{-1}(0.391)=23^\circ\end{aligned}$$`,ref:'ص 135–136'},
    {tip:String.raw`<p>خطوات الحل كلها من أداتين: <b>القدرة الداخلة</b> = القدرة الخارجة + المفاقيد (ونحاس المنتج صفر لإهمال المقاومة)، ثم <b>المعادلة (4-1)</b> لإيجاد \(E_{Ph}\) أو \(I_{Ph}\). وبعد زيادة الحمل نستعمل (3-15) مقلوبة لإيجاد δ الجديدة، لأن طول \(E_{Ph}\) لم يتغير.</p>`,title:'الفكرة في الحل'},
    {watch:String.raw`<ul><li>صيغة تيار الخط في الكتاب (ص 134) مكتوبة بجهد الوجه \(I_L=P_{in}/(\sqrt3\,V_{ph}\cos\theta)\)، والصيغة العامة بجهد الخط \(V_L\). النتيجة صحيحة هنا لأن التوصيل دلتا (جهد الخط = جهد الوجه = <span class="ltr">208 V</span>)؛ في توصيل النجمة انتبه.</li>
     <li>معامل القدرة بعد زيادة الحمل <span class="ltr">0.966</span> لم يكتب الكتاب أنه «متقدم»، لكن زاوية التيار <span class="ltr">+15°</span> موجبة، أي أنه ما زال <b>متقدماً</b>.</li>
     <li>طُبع \(208\angle{0^\circ}-255\angle{-23^\circ}=103.1\angle{105^\circ}\)، والقيمة الدقيقة <span class="ltr">103.2</span>، فيصبح \(I_{Ph}=41.3\angle{15^\circ}\) A و\(I_L=71.5\) A بدلاً من <span class="ltr">41.2</span> و<span class="ltr">71.4</span>. في «الأمثلة المحلولة» تجد الحل بقيمة الكتاب والحل المصحح.</li></ul>`,fix:true},
    {title:'مختبر مصغّر: رتّب خطوات الحل',widget:(el,B)=>DCML.order(el,B,{intro:'اضغط خطوات حل مثال (4-1) بالترتيب.',steps:[
  [String.raw`القدرة الداخلة = الخارجة + المفاقيد: \(P_{in} = 11.19 + 1.0 + 1.5 = 13.69\ \text{kW}\)`,'نبدأ بالقدرة الداخلة، فالتيار يُحسب منها.'],
  [String.raw`التيار من القدرة ومعامل القدرة: \(I_L = 47.5\ \text{A}\) و\(I_{ph} = 27.4\angle 36.87^\circ\ \text{A}\)`,'نحتاج التيار قبل حساب الجهد الداخلي.'],
  [String.raw`\(E_{ph} = V_{ph} - jX_S I_{ph}\) (4-1) ومنها \(E_{ph} = 255\angle -12.4^\circ\ \text{V}\)`,String.raw`\(E_{ph}\) يحتاج \(I_{ph}\) أولاً.`],
  [String.raw`بعد زيادة الحمل: \(E_{ph}\) ثابت، و\(\delta = \sin^{-1}\left(\frac{X_S P}{3V_{ph}E_{ph}}\right) = 23^\circ\)`,String.raw`لا نحسب الزاوية الجديدة قبل أن نعرف \(E_{ph}\).`],
  [String.raw`التيار الجديد من (4-1)، ومعامل القدرة \(\cos 15^\circ = 0.966\)`,'معامل القدرة آخر خطوة، لأنه زاوية التيار الجديد.']],
 done:String.raw`الفكرة: \(E_{ph}\) يُحسب مرة واحدة ثم يبقى طوله ثابتاً بعد زيادة الحمل.`})}
   ]},

  {recap:[
   String.raw`عند زيادة الحمل يتباطأ الدوار لحظياً فتكبر δ ويزداد العزم حتى تعود السرعة تزامنية عند δ أكبر وقدرة أكبر (ص 132).`,
   String.raw`القدرة تتناسب مع \(\sin\delta\)، المعادلة (3-15): \(P_o=3\,V_{ph}E_{ph}\sin\delta/X_S\)`,
   String.raw`تيار المجال ثابت ← طول \(E_{Ph}\) ثابت ورأسه يتحرك على دائرة؛ والتيار يطول ويدور من متقدم نحو متأخر.`,
   String.raw`مثال (4-1): من <span class="ltr">15 hp</span> إلى <span class="ltr">30 hp</span>: \(E_{Ph}\) من \(255\angle{-12.4^\circ}\) إلى \(255\angle{-23^\circ}\)، والتيار من \(27.4\angle{36.87^\circ}\) إلى \(41.2\angle{15^\circ}\) A بالمعادلة (4-1).`]}
],
 theory:[
  {h:'سلوك المحرك التزامني في حالة تغيير الحمل مع ثبات تيار المجال',ref:'ص 132',html:`<p>«عندما يدار حمل ما بمحرك تزامني فإن المحرك سوف ينتج ما يكفي من العزم لكي يحافظ على سرعة دورانه عند السرعة التزامنية.»</p>
   <p>«لكي نفهم ما يحدث عند تغير الحمل، نفترض أن المحرك يعمل عند معامل قدرة متقدماً كما هو موضح في الشكل (4-6)أ، فإذا ازداد الحمل على عمود الدوران فإن سرعة المحرك ستقل ونتيجة لذلك زاوية العزم (δ) سوف تزداد وبالتالي سوف يزداد العزم المتولد طبقاً للمعادلة (3-17) <b>[من الوحدة الثالثة — انظر الملاحظة أدناه]</b> والذي بدوره سيزيد من سرعة العضو الدوار إلى أن تصل إلى السرعة التزامنية مرة أخرى ولكن عند زاوية عزم (δ) أكبر، مما يعني استهلاكاً لقدرة أكبر، وهكذا كلما ازداد الحمل على المحرك كما هو واضح من المخطط الاتجاهي في الشكل (4-6) ب، ويحدث العكس تماماً عندما يقل الحمل على المحرك.»</p>
   <p>«مع ملاحظة أن قيمة \\(E_{Ph}\\) تبقى ثابتة دائماً بسبب عدم تغير قيمة تيار المجال وفي المخطط الاتجاهي يتحرك المتجه \\(E_{Ph}\\) راسماً دائرة يمثل نصف قطرها.»</p>`},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'ص 132: يقول الكتاب «سوف يزداد العزم المتولد طبقاً للمعادلة (3-17)». لكن (3-17) في الوحدة الثالثة هو <b>شكل</b> (مخطط سريان القدرة داخل المولد، ص 109) وليس معادلة. العلاقة التي تربط القدرة بزاوية العزم هي المعادلة (3-15) ص 108: \\(P_o=3V_{ph}E_{ph}\\sin\\delta/X_S\\)، وهي نفسها التي يستعملها المثال (4-1) لإيجاد δ. على الأرجح المقصود (3-15).'+'</div>'},
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
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'ص 134 (وكذلك ص 138): صيغة تيار الخط مكتوبة \\(I_L=P_{in}/(\\sqrt3\\,V_{ph}\\cos\\theta)\\). الصيغة العامة تستعمل <b>جهد الخط</b> \\(V_L\\): \\(I_L=P_{in}/(\\sqrt3\\,V_L\\cos\\theta)\\). النتيجة صحيحة هنا فقط لأن التوصيل دلتا فجهد الخط = جهد الوجه = 208 V. أما في توصيل النجمة (كالتمرين 9) فيجب الانتباه.'+'</div>'},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'ص 136: كُتب معامل القدرة بعد زيادة الحمل <span class="ltr">cos(15°) = 0.966</span> دون كلمة «متقدم»، مع أن زاوية التيار <span class="ltr">+15°</span> موجبة، أي أن التيار ما زال متقدماً. وفي صيغة \\(I_{Ph}=(V_{Ph}-E_{Ph})/jX_S\\) بعد التغيير كُتب \\(E_{Ph}\\) بلا شرطة والمقصود الجهد بالزاوية الجديدة (اختلاف ترميز فقط).'+'</div>'},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'ص 136: طُبع \\(208\\angle{0^\\circ}-255\\angle{-23^\\circ}=103.1\\angle{105^\\circ}\\)، والقيمة الدقيقة <span class="ltr">103.16</span> أي <b>103.2</b> بالتقريب الصحيح. فيصبح \\(I_{Ph}=41.3\\angle{15^\\circ}\\) A و \\(I_L=71.5\\) A بدلاً من 41.2 و71.4. معامل القدرة لا يتغير (0.966). في «الأمثلة المحلولة» تجد الحل بقيمة الكتاب والحل المصحح.'+'</div>'},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'ص 133: «ممانعته التزامنية <b>له</b> 2.5 Ω» — كلمة «له» زائدة (خطأ صياغة).'+'</div>'}
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
   note:'<span class="fixnote"><b>ملاحظة على الكتاب:</b> بقيم الكتاب تعرض الحاسبة الرقم المطبوع <span class="ltr">103.1∠105°</span> (والدقيق 103.16 أي 103.2). </span>إذا غيّرت أي رقم تحسب الحاسبة هذه الخطوة بالتقريب الصحيح. <span class="fixnote">وصيغة تيار الخط في الكتاب مكتوبة بجهد الوجه؛ تصح هنا لأن التوصيل دلتا.</span>'},
  {title:'مثال (4-1) — الحل المصحح',ref:'ص 133–136',q:'<p>نفس المثال بتقريب صحيح للمقدار <span class="ltr">|208∠0° − 255∠−23°| = 103.2</span>. (حساب مصحح — ليس من الكتاب.)</p>',
   given:G41,solve:(g)=>solveLoad(g,{hp:1}).st,note:'<span class="fixnote">الفرق عن الكتاب 0.1 A في تيار المنتج (41.3 بدلاً من 41.2) و0.1 A في تيار الخط (71.5 بدلاً من 71.4)؛ ومعامل القدرة نفسه 0.966 متقدم.</span>'}
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
 stations:[
  {intro:true},

  {st:1,short:'ماذا يحدث عند زيادة تيار المجال؟',title:'زيادة تيار المجال والحمل ثابت',ref:'ص 136–137',
   q:'لا تتغير السرعة ولا العزم ولا القدرة… فما الذي يتغير إذا زدنا تيار المجال؟ ولماذا يهم ذلك للشبكة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مخطط اتجاهي لمحرك تزامني عند معامل قدرة متأخر: التيار تحت جهد الوجه" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="146" fill="#DCEAF7"/><g data-tip="جهد الوجه ⟦Vph⟧: المرجع الأفقي بزاوية ⟦0°⟧، ثابت لأن المصدر ضخم."><line x1="36" y1="118" x2="269.1" y2="118" stroke="#2C4A40" stroke-width="3.5" stroke-linecap="round"/><polygon points="285.6,118 269.1,125.4 269.1,110.6" fill="#2C4A40"/></g><g data-tip="المتجه ⟦jXS·Iph⟧: يبدأ من رأس ⟦Eph⟧ وينتهي عند رأس ⟦Vph⟧، وهو عمودي على التيار."><line x1="244.3" y1="183.7" x2="277.3" y2="131.2" stroke="#2E8C83" stroke-width="2.6" stroke-linecap="round"/><polygon points="285.6,118 283.2,134.9 271.4,127.5" fill="#2E8C83"/></g><g data-tip="الجهد الداخلي ⟦Eph⟧: قيمته منخفضة (تيار مجال قليل)، ويتأخر عن ⟦Vph⟧ بالزاوية δ."><line x1="36" y1="118" x2="228.6" y2="178.7" stroke="#E8735A" stroke-width="3.5" stroke-linecap="round"/><polygon points="244.3,183.7 226.3,185.8 230.8,171.6" fill="#E8735A"/></g><g data-tip="تيار المنتج ⟦Iph⟧: متأخر عن ⟦Vph⟧ (تحته) في هذه الحالة، فالمحرك يعمل كأنه حمل حثي."><line x1="36" y1="118" x2="92.4" y2="153" stroke="#12855A" stroke-width="3.2" stroke-linecap="round"/><polygon points="106.2,161.5 88.6,159.2 96.2,146.8" fill="#12855A"/></g><path d="M156 118A120 120 0 0 1 150.4 154.1" fill="none" stroke="#E8735A" stroke-width="2"/><text x="170" y="144" text-anchor="middle" font-size="15" fill="#E8735A" font-weight="700" direction="rtl">δ</text><path d="M88 118A52 52 0 0 1 80.2 145.4" fill="none" stroke="#12855A" stroke-width="2"/><text x="98" y="140" text-anchor="middle" font-size="15" fill="#12855A" font-weight="700" direction="rtl">θ</text><text x="279.6" y="106" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">V<tspan font-size="10" dy="4">ph</tspan><tspan dy="-4">&#8203;</tspan></text><text x="240.3" y="205.7" text-anchor="middle" font-size="14" fill="#E8735A" font-weight="700" direction="ltr" font-family="var(--mono)">E<tspan font-size="10" dy="4">ph</tspan><tspan dy="-4">&#8203;</tspan></text><text x="96.2" y="181.5" text-anchor="middle" font-size="14" fill="#12855A" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="10" dy="4">ph</tspan><tspan dy="-4">&#8203;</tspan></text><text x="274.9" y="156.8" text-anchor="start" font-size="13" fill="#2E8C83" font-weight="700" direction="ltr" font-family="var(--mono)">jX<tspan font-size="10" dy="4">S</tspan><tspan dy="-4">I</tspan><tspan font-size="10" dy="4">ph</tspan></text><text x="180" y="292" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">محرك يعمل عند معامل قدرة متأخر</text></svg>`,
   cap:'الشكل <span class="ltr">(4-8)</span> أ: محرك يعمل عند معامل قدرة متأخر، فالتيار تحت <span class="ltr">V<sub>ph</sub></span>.<br><b>مرّر المؤشر على الأسهم (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'محرك تزامني يعمل بتيار متأخر. زدنا تيار المجال تدريجياً والحمل ثابت. ماذا يحدث لتيار المنتج؟',opts:[
     ['يزداد باستمرار',false,'ليس من البداية: يقل أولاً ثم يزداد.'],
     ['يقل أولاً، ثم يزداد بعد ذلك',true,String.raw`نص الكتاب: «زيادة \(E_{Ph}\) تعني النقص في قيمة \(I_{Ph}\) أولاً ثم يزداد بعد ذلك».`],
     ['لا يتغير لأن القدرة ثابتة',false,'القدرة ثابتة، لكن الجزء غير الفعال من التيار يتغير، فيتغير التيار كله.']]}}
   ],
   body:[
    {book:String.raw`<p>لكي يتضح تأثير التغيير في تيار المجال على سلوك المحرك التزامني، افترض أن محركاً تزامنياً يعمل عند معامل قدرة متأخر كما هو موضح في الشكل (4-8) أ، عند زيادة تيار المجال \(I_F\) فإن \(E_{Ph}\) سيزداد أما <b>سرعة الدوران وعزم المحرك فلن يتغيرا</b>، هذا يعني أنه كلما زادت قيمة \(I_F\) فإن \(E_{Ph}\) سيزداد مع ثبات القدرة الخارجة من المحرك، وعليه فإن زيادة \(E_{Ph}\) تعني <b>النقص في قيمة \(I_{Ph}\) أولاً ثم يزداد بعد ذلك</b> كما هو موضح في الشكل (4-8)ب.</p>`,ref:'ص 136–137'},
    {title:'تابع السلسلة خطوة خطوة',widget:(el,B)=>{
      const S=['زاد تيار المجال','زاد الجهد الداخلي E','السرعة والعزم والقدرة ثابتة','تيار المنتج يقل حتى معامل قدرة = 1','ثم يزداد وهو متقدم','المحرك تحوّل من حمل حثي إلى حمل سعوي'];
      el.innerHTML=`<p class="sub" style="margin:0 0 10px">اضغط «زِد تيار المجال» وتابع كيف ينتقل الأثر من حلقة إلى التي بعدها.</p><div class="chain">${S.map((s,i)=>`<span class="ck${i===S.length-1?' end':''}">${s}</span>${i<S.length-1?'<span class="ar">←</span>':''}`).join('')}</div><div class="w-row"><button class="btn pri" type="button" data-go>زِد تيار المجال</button><button class="btn" type="button" data-rs>إعادة</button></div>`;
      const ks=[...el.querySelectorAll('.ck')];let tm=[];
      const rs=()=>{tm.forEach(clearTimeout);tm=[];ks.forEach(k=>k.classList.remove('on'))};
      el.querySelector('[data-go]').onclick=()=>{rs();ks.forEach((k,i)=>tm.push(setTimeout(()=>k.classList.add('on'),i*600)))};
      el.querySelector('[data-rs]').onclick=rs;
    }},
    {tip:String.raw`<p>هذه هي منحنيات V من الدرس الثالث وقد رأيناها من الداخل: السير على منحنى V واحد من اليسار إلى اليمين = زيادة تيار المجال والقدرة ثابتة. التيار يقل حتى أدنى نقطة (معامل قدرة = 1) ثم يزداد.</p>`,title:'تذكّر منحنى V'}
   ]},

  {st:2,short:'خطان ثابتان',title:'المخطط الاتجاهي: خطان ثابتان والقدرة ثابتة',ref:'ص 137',
   q:'في الدرس السابق تحرك رأس E على دائرة… فعلى أي خط يتحرك هنا، والقدرة ثابتة وطول E هو الذي يتغير؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="أربعة جهود داخلية رؤوسها على خط أفقي واحد، وأربعة تيارات رؤوسها على خط رأسي واحد: من متأخر إلى متقدم" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="150" fill="#E6E2F8"/><line data-tip="خط أفقي ثابت: رؤوس الجهود ⟦Eph1⟧ إلى ⟦Eph4⟧ كلها عليه، لأن المسافة الرأسية ⟦E sinδ⟧ تتناسب مع القدرة، والقدرة ثابتة." x1="24" y1="170.1" x2="338" y2="170.1" stroke="#8A9A93" stroke-width="1.8" stroke-dasharray="6 5"/><line data-tip="خط رأسي ثابت: رؤوس التيارات كلها عليه، لأن الجزء الأفقي من التيار ⟦I cosθ⟧ يتناسب مع القدرة، والقدرة ثابتة." x1="89.8" y1="30" x2="89.8" y2="182" stroke="#8A9A93" stroke-width="1.8" stroke-dasharray="6 5"/><g data-tip="جهد الوجه ⟦Vph⟧: ثابت (مرجع)."><line x1="24" y1="112" x2="228" y2="112" stroke="#2C4A40" stroke-width="3.5" stroke-linecap="round"/><polygon points="244.5,112 228,119.4 228,104.6" fill="#2C4A40"/></g><line x1="208" y1="170.1" x2="244.5" y2="112" stroke="#2E8C83" stroke-width="1.6"/><g data-tip="الجهد ⟦Eph1⟧: أصغر جهد داخلي (تيار مجال قليل)."><line x1="24" y1="112" x2="192.9" y2="165.4" stroke="#E8735A" stroke-width="2.8" stroke-linecap="round"/><polygon points="208,170.1 190.7,172.2 195,158.6" fill="#E8735A"/></g><g data-tip="التيار ⟦Iph1⟧: متأخر: المحرك يعمل كأنه حمل حثي."><line x1="24" y1="112" x2="76.6" y2="145.1" stroke="#5DBB8A" stroke-width="2.6" stroke-linecap="round"/><polygon points="89.8,153.4 72.9,151 80.3,139.1" fill="#5DBB8A"/></g><text x="194" y="188.1" text-anchor="middle" font-size="12" fill="#E8735A" font-weight="700" direction="ltr" font-family="var(--mono)">E<tspan font-size="8" dy="4">ph1</tspan><tspan dy="-4">&#8203;</tspan></text><text x="95.8" y="157.4" text-anchor="start" font-size="12" fill="#5DBB8A" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="8" dy="4">ph1</tspan><tspan dy="-4">&#8203;</tspan></text><line x1="244.5" y1="170.1" x2="244.5" y2="112" stroke="#2E8C83" stroke-width="1.6"/><g data-tip="الجهد ⟦Eph2⟧: جهد أكبر: هنا يكون التيار على اتجاه ⟦Vph⟧."><line x1="24" y1="112" x2="229.2" y2="166.1" stroke="#D9622F" stroke-width="2.8" stroke-linecap="round"/><polygon points="244.5,170.1 227.4,173 231,159.2" fill="#D9622F"/></g><g data-tip="التيار ⟦Iph2⟧: على اتجاه ⟦Vph⟧: معامل القدرة = 1، وهو أقصر تيار."><line x1="24" y1="112" x2="74.2" y2="112" stroke="#2E9E68" stroke-width="2.6" stroke-linecap="round"/><polygon points="89.8,112 74.2,119 74.2,105" fill="#2E9E68"/></g><text x="240.5" y="204.1" text-anchor="middle" font-size="12" fill="#D9622F" font-weight="700" direction="ltr" font-family="var(--mono)">E<tspan font-size="8" dy="4">ph2</tspan><tspan dy="-4">&#8203;</tspan></text><text x="93.8" y="104" text-anchor="start" font-size="12" fill="#2E9E68" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="8" dy="4">ph2</tspan><tspan dy="-4">&#8203;</tspan></text><line x1="277.1" y1="170.1" x2="244.5" y2="112" stroke="#2E8C83" stroke-width="1.6"/><g data-tip="الجهد ⟦Eph3⟧: جهد أكبر."><line x1="24" y1="112" x2="261.7" y2="166.6" stroke="#B8481F" stroke-width="2.8" stroke-linecap="round"/><polygon points="277.1,170.1 260.1,173.5 263.3,159.7" fill="#B8481F"/></g><g data-tip="التيار ⟦Iph3⟧: متقدم: المحرك يعمل كأنه حمل سعوي."><line x1="24" y1="112" x2="76.2" y2="82.7" stroke="#12855A" stroke-width="2.6" stroke-linecap="round"/><polygon points="89.8,75.1 79.6,88.8 72.8,76.6" fill="#12855A"/></g><text x="273.1" y="188.1" text-anchor="middle" font-size="12" fill="#B8481F" font-weight="700" direction="ltr" font-family="var(--mono)">E<tspan font-size="8" dy="4">ph3</tspan><tspan dy="-4">&#8203;</tspan></text><text x="95.8" y="79.1" text-anchor="start" font-size="12" fill="#12855A" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="8" dy="4">ph3</tspan><tspan dy="-4">&#8203;</tspan></text><line x1="325.9" y1="170.1" x2="244.5" y2="112" stroke="#2E8C83" stroke-width="1.6"/><g data-tip="الجهد ⟦Eph4⟧: أكبر جهد داخلي (تيار مجال كبير)."><line x1="24" y1="112" x2="310.3" y2="167.2" stroke="#8E3412" stroke-width="2.8" stroke-linecap="round"/><polygon points="325.9,170.1 309,174.1 311.7,160.2" fill="#8E3412"/></g><g data-tip="التيار ⟦Iph4⟧: أكثر تقدماً وأطول."><line x1="24" y1="112" x2="80.7" y2="32.6" stroke="#0B5E3E" stroke-width="2.6" stroke-linecap="round"/><polygon points="89.8,19.9 86.5,36.7 75,28.5" fill="#0B5E3E"/></g><text x="321.9" y="204.1" text-anchor="middle" font-size="12" fill="#8E3412" font-weight="700" direction="ltr" font-family="var(--mono)">E<tspan font-size="8" dy="4">ph4</tspan><tspan dy="-4">&#8203;</tspan></text><text x="95.8" y="23.9" text-anchor="start" font-size="12" fill="#0B5E3E" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="8" dy="4">ph4</tspan><tspan dy="-4">&#8203;</tspan></text><text x="258.5" y="104" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">V<tspan font-size="9" dy="4">ph</tspan><tspan dy="-4">&#8203;</tspan></text><text x="180" y="300" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">تيار المجال يزيد والقدرة ثابتة</text></svg>`,
   cap:'الشكل <span class="ltr">(4-8)</span> ب: أربع قيم متزايدة لتيار المجال والقدرة ثابتة. رؤوس الجهود على خط أفقي، ورؤوس التيارات على خط رأسي (رسم توضيحي بلا أرقام).<br><b>مرّر المؤشر على الأسهم والخطين المتقطعين (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'عند أي قيمة للجهد الداخلي يعمل المحرك كأنه حمل سعوي (مكثف)؟',opts:[
     ['عند القيم المرتفعة للجهد الداخلي، حين يكون التيار متقدماً',true,'نص الكتاب: «عند القيم المرتفعة للجهد الداخلي يكون تيار المنتج متقدم … يعمل كأنه حمل سعوي».'],
     ['عند القيم المنخفضة للجهد الداخلي',false,'عند القيم المنخفضة يكون التيار متأخراً، فيعمل كأنه حمل حثي.'],
     ['لا يعمل أبداً كحمل سعوي',false,'يستطيع ذلك بزيادة تيار المجال، وهذه فكرة المكثف التزامني.']]}}
   ],
   body:[
    {book:String.raw`<p>ويلاحظ أنه عند القيم المنخفضة للجهد الداخلي \(E_{Ph}\) يكون تيار المنتج متأخراً وبالتالي نجد أن المحرك يعمل كأنه <b>حمل حثي</b> <span class="ltr">Inductive Load</span> بينما عند القيم المرتفعة للجهد الداخلي \(E_{Ph}\) يكون تيار المنتج متقدماً وبالتالي نجد أن المحرك يعمل كأنه <b>حمل سعوي</b> <span class="ltr">Capacitive Load</span>، هذا السلوك للمحرك التزامني موضح في المثال (4-2).</p>`,ref:'ص 137'},
    {tip:String.raw`<p>لماذا الخطان ثابتان؟</p><ul>
     <li>القدرة \(P=3\,V_{ph}I_{ph}\cos\theta\) و\(V_{ph}\) ثابت، فالجزء الأفقي من التيار \(I\cos\theta\) ثابت: <b>رأس التيار على خط رأسي</b>.</li>
     <li>ومن المعادلة (3-15) \(P_o=3\,V_{ph}E_{ph}\sin\delta/X_S\)، فالمسافة الرأسية \(E\sin\delta\) ثابتة: <b>رأس E على خط أفقي</b>.</li></ul>
     <p>كلما طال E انزلق رأسه إلى اليمين على الخط الأفقي، فدار التيار على الخط الرأسي من الأسفل (متأخر) إلى الأعلى (متقدم).</p>`,title:'اقرأ الشكل'},
    {watch:String.raw`<p>لا تخلط بين الدرسين: في الدرس الرابع <b>طول</b> E ثابت والحمل يتغير (دائرة)، وهنا <b>القدرة</b> ثابتة وطول E يتغير (خط أفقي).</p>`},
    {title:'مختبر مصغّر: رأس E على خط ثابت',widget:(el,B)=>DCML.lab(el,B,{intro:String.raw`محرك مثال (4-2): \(P_{in} = 13.69\ \text{kW}\) ثابتة، و\(E_{ph} = 182\ \text{V}\) قبل التغيير. غيّر تيار المجال كنسبة من قيمته في المثال (\(E_{ph}\) يتناسب معه كما يفترض الكتاب؛ 1.25 قيمة الكتاب).`,
 predict:{q:'نزيد تيار المجال تدريجياً من قيمة صغيرة. ماذا يحدث لتيار المنتج؟',opts:[
  ['يزيد دائماً',false,'في البداية التيار متأخر، وزيادة المجال تقلل الجزء المتأخر منه أولاً.'],
  ['يقل دائماً',false,'بعد معامل القدرة الواحد يبدأ التيار يتقدم ويكبر من جديد.'],
  ['يقل أولاً ثم يزيد',true,String.raw`«زيادة \(E_{Ph}\) تعني النقص في قيمة \(I_{Ph}\) أولاً ثم يزداد بعد ذلك» (ص 136–137).`]]},
 ins:[{k:'k',l:'تيار المجال / قيمته في المثال',min:0.8,max:1.6,step:0.05,v:1,dp:2}],
 calc:(s,v,B)=>{const E=182*s.k,m=motor(208,E,2.5,13690);if(!m.ok)return {msg:'خارج حد التزامن.',cls:'bad'};
  const yE=m.Ec.im,kI=1.6,xI=m.Im*kI*Math.cos(m.th*Math.PI/180);
  return {pic:phSVG({W:440,H:280,view:{x0:-20,x1:300,y0:-100,y1:90},lines:[{a:[-10,yE],b:[300,yE],col:'--live'},{a:[xI,-95],b:[xI,85],col:'--on'}],vecs:onePoint(208,m,{kI}),arcs:phArcs(m)}),
   facts:[['<bdi class="ltr">E<sub>ph</sub></bdi>',DCML.fm(B,E,1)+' V'],['زاوية العزم δ',DCML.fm(B,m.d,1)+'°'],['تيار الوجه <bdi class="ltr">I<sub>ph</sub></bdi>',DCML.fm(B,m.Im,1)+' A','hi'],['معامل القدرة',DCML.fm(B,Math.abs(m.pf),3)+' '+pfT(m)]],
   msg:Math.abs(s.k-1)<1e-9?String.raw`حالة الكتاب قبل التغيير: \(E_{ph} = 182\angle -17.5^\circ\ \text{V}\) و\(I_{ph} = 25.8\angle -31.8^\circ\ \text{A}\) (متأخر).`:Math.abs(s.k-1.25)<1e-9?String.raw`حالة الكتاب بعد زيادة 25%: \(E'_{ph} = 227.5\ \text{V}\)، \(\delta' = -13.9^\circ\)، \(I_{ph} = 22.5\angle 13.2^\circ\ \text{A}\) (متقدم).`:String.raw`رأس \(E_{ph}\) يتحرك على الخط البرتقالي الأفقي (\(E_{ph}\sin\delta\) ثابت)، ورأس التيار على الخط الأخضر الرأسي (\(I_{ph}\cos\theta\) ثابت): القدرة ثابتة.`}}})}
   ]},

  {st:3,short:'مثال (4-2)',title:'مثال (4-2)',ref:'ص 137–140',
   q:'المحرك نفسه يدير 15 hp بمعامل قدرة 0.85 متأخر. نزيد تيار المجال 25%… هل يصير متقدماً؟ الحل الكامل خطوة بخطوة في تبويب «الأمثلة المحلولة».',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مخطط مثال 4-2: التيار يتحول من متأخر إلى متقدم والجهد الداخلي يطول ورأسه على الخط الأفقي نفسه" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="148" fill="#DDEFE6"/><line data-tip="رأسا ⟦Eph⟧ و⟦E′ph⟧ على خط أفقي واحد: ⟦E sinδ⟧ ثابت لأن القدرة ثابتة." x1="26" y1="178.3" x2="340" y2="178.3" stroke="#8A9A93" stroke-width="1.6" stroke-dasharray="6 5"/><g data-tip="جهد الوجه ⟦Vph = 208∠0° V⟧."><line x1="26" y1="118" x2="238.3" y2="118" stroke="#2C4A40" stroke-width="3.5" stroke-linecap="round"/><polygon points="254.8,118 238.3,125.4 238.3,110.6" fill="#2C4A40"/></g><line x1="216.9" y1="178.2" x2="254.8" y2="118" stroke="#2E8C83" stroke-width="2"/><g data-tip="قبل زيادة تيار المجال: ⟦Eph = 182∠−17.5° V⟧."><line x1="26" y1="118" x2="202.2" y2="173.6" stroke="#F2A08C" stroke-width="2.4" stroke-linecap="round"/><polygon points="216.9,178.2 200.2,180.2 204.3,167" fill="#F2A08C"/></g><g data-tip="قبل: ⟦Iph = 25.8∠−31.8° A⟧ متأخر (معامل القدرة 0.85 متأخر)."><line x1="26" y1="118" x2="87.6" y2="156.2" stroke="#7CC8A0" stroke-width="2.1999999999999997" stroke-linecap="round"/><polygon points="100.6,164.2 84,162 91.2,150.4" fill="#7CC8A0"/></g><text x="202.9" y="198.2" text-anchor="middle" font-size="13" fill="#F2A08C" font-weight="700" direction="ltr" font-family="var(--mono)">E<tspan font-size="9" dy="4">ph</tspan><tspan dy="-4">&#8203;</tspan></text><text x="106.6" y="180.2" text-anchor="start" font-size="13" fill="#7CC8A0" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="9" dy="4">ph</tspan><tspan dy="-4">&#8203;</tspan></text><line x1="268.9" y1="178.1" x2="254.8" y2="118" stroke="#2E8C83" stroke-width="2"/><g data-tip="بعد زيادة تيار المجال ⟦25%⟧: ⟦E′ph = 227.5∠−13.9° V⟧ أطول، وزاويته أصغر."><line x1="26" y1="118" x2="253" y2="174.2" stroke="#E8735A" stroke-width="3.4" stroke-linecap="round"/><polygon points="268.9,178.1 251.2,181.3 254.8,167" fill="#E8735A"/></g><g data-tip="بعد: ⟦Iph = 22.5∠13.2° A⟧ متقدم."><line x1="26" y1="118" x2="84.7" y2="104.2" stroke="#12855A" stroke-width="3.1999999999999997" stroke-linecap="round"/><polygon points="100.5,100.5 86.4,111.3 83,97.1" fill="#12855A"/></g><text x="278.9" y="198.1" text-anchor="start" font-size="13" fill="#E8735A" font-weight="700" direction="ltr" font-family="var(--mono)">E<tspan font-size="9" dy="4">ph</tspan><tspan dy="-4">′</tspan></text><text x="106.5" y="96.5" text-anchor="start" font-size="13" fill="#12855A" font-weight="700" direction="ltr" font-family="var(--mono)">I<tspan font-size="9" dy="4">ph</tspan><tspan dy="-4">′</tspan></text><line data-tip="رأسا ⟦Iph⟧ و⟦I′ph⟧ على خط رأسي واحد: ⟦I cosθ⟧ ثابت لأن القدرة ثابتة." x1="100.6" y1="40" x2="100.6" y2="198" stroke="#8A9A93" stroke-width="1.6" stroke-dasharray="6 5"/><text x="266.8" y="110" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">V<tspan font-size="9" dy="4">ph</tspan><tspan dy="-4">&#8203;</tspan></text><text x="180" y="296" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">مثال (4-2): تيار المجال يزيد 25%</text></svg>`,
   cap:'الشكل <span class="ltr">(4-9)</span>: قبل زيادة تيار المجال (فاتح) وبعدها (داكن). التيار يتحول من متأخر إلى متقدم.<br><b>مرّر المؤشر على الأسهم والخطين المتقطعين (أو المسها في الجوال) لتعرف قيمها من الكتاب.</b>',
   side:[
    {book:String.raw`<p>افترض أن المحرك التزامني في المثال السابق يدير حملاً قدرته <span class="ltr">15 hp</span> عند معامل قدرة <span class="ltr">0.85</span> متأخر:</p>
     <p>أ) ارسم المخطط الاتجاهي للمحرك. ب) أوجد قيم \(I_L\)، \(I_{Ph}\)، \(E_{Ph}\). جـ) إذا ازداد تيار المجال بنسبة <span class="ltr">25%</span> وضح سلوك المحرك باستخدام المخطط الاتجاهي ثم أوجد قيم \(I_L\)، \(I_{Ph}\)، \(E_{Ph}\) بعد زيادة تيار المجال. د) احسب معامل القدرة بعد زيادة تيار المجال.</p>`,ref:'ص 137'},
    {predict:{q:String.raw`كان \(E_{Ph}=182\) V، وزاد تيار المجال <span class="ltr">25%</span>. كم يصير الجهد الداخلي حسب الكتاب؟`,opts:[
     [String.raw`<span class="ltr">182 V</span> لأن القدرة ثابتة`,false,String.raw`القدرة الثابتة تُبقي \(E\sin\delta\) ثابتاً، لا E نفسه.`],
     [String.raw`<span class="ltr">145.6 V</span>`,false,'هذا ناتج القسمة على 1.25؛ زيادة تيار المجال تزيد E ولا تنقصه.'],
     [String.raw`<span class="ltr">227.5 V</span>`,true,String.raw`الكتاب: الفيض يزداد بالنسبة نفسها، فـ \(E'_{Ph}=1.25(182)=227.5\) V.`]]}}
   ],
   body:[
    {html:String.raw`<div class="exl">
     <div class="exc"><header>قبل زيادة تيار المجال <span class="ref">ص 138</span></header>
      <div class="kv-row"><small>المعطيات</small><span class="kv ltr">\(P_{in}=13.69\ \text{kw}\)</span><span class="kv">0.85 متأخر</span></div>
      <div class="kv-row"><small>النتائج</small><span class="kv res ltr">\(I_L=44.7\ \text{A}\)</span><span class="kv res ltr">\(I_{ph}=25.8\angle{-31.8^\circ}\ \text{A}\)</span><span class="kv res ltr">\(E_{Ph}=182\angle{-17.5^\circ}\ \text{V}\)</span></div></div>
     <div class="exc"><header>بعد زيادة تيار المجال <span class="ltr">25%</span> <span class="ref">ص 139–140</span></header>
      <div class="kv-row"><small>الجهد</small><span class="kv ltr">\(E'_{Ph}=227.5\ \text{V}\)</span><span class="kv ltr">\(\delta'=-13.9^\circ\)</span></div>
      <div class="kv-row"><small>النتائج</small><span class="kv res ltr">\(I_{Ph}=22.5\angle{13.2^\circ}\ \text{A}\)</span><span class="kv res ltr">\(I_L=38.97\ \text{A}\)</span><span class="kv res ltr">\(\cos\theta=0.974\)</span></div></div>
     <div class="w-row"><button class="btn pri" type="button" onclick="var b=document.querySelector('.ltabs button[data-tab=examples]');if(b)b.click()">افتح الأمثلة المحلولة وغيّر الأرقام</button></div></div>`},
    {book:String.raw`<p>جـ) عند زيادة تيار المجال \(I_F\) بنسبة <span class="ltr">25%</span> فإن الفيض المغناطيسي سيزداد بنفس النسبة وبالتالي الجهد الداخلي \(E_{Ph}\) سيزداد بنفس النسبة كما يلي:</p>
     $$E'_{Ph}=1.25\,E_{Ph}=1.25(182)=227.5\ \text{V}$$
     <p>ورغم زيادة \(E_{Ph}\) إلا أن القدرة الخارجة من المحرك تبقى ثابتة وتتناسب مع طول المتجه (\(E_{Ph}\sin\delta\)) كما هو موضح في الشكل (4-9). بما أن طول المتجه (\(E_{Ph}\sin\delta\)) يبقى ثابتاً قبل زيادة تيار المجال وبعد ذلك، لذا يمكننا حساب زاوية العزم الجديدة كما يلي:</p>
     $$\begin{aligned}E_{Ph}\sin\delta&=E'_{Ph}\sin\delta'\\ \delta'&=\sin^{-1}\left(\frac{E_{Ph}}{E'_{Ph}}\sin\delta\right)\\&=\sin^{-1}\left(\frac{182}{227.5}\sin(-17.5)\right)\\&=\sin^{-1}(-0.24)=-13.9^\circ\end{aligned}$$`,ref:'ص 139'},
    {tip:String.raw`<p>الحل يختلف عن مثال (4-1) في نقطة واحدة: هناك كان <b>طول E ثابتاً</b> فاستعملنا (3-15) لإيجاد δ، وهنا <b>\(E\sin\delta\) ثابت</b> فنجد δ′ من النسبة بين الجهدين. ثم نجد التيار الجديد من المعادلة (4-1) كالعادة.</p>`,title:'الفكرة في الحل'},
    {watch:String.raw`<ul><li>معامل القدرة الجديد <span class="ltr">0.974</span> لم يكتب الكتاب أنه «متقدم»، لكن الزاوية <span class="ltr">+13.2°</span> موجبة: تغيّر معامل القدرة من <b>0.85 متأخر</b> إلى <b>0.974 متقدم</b>.</li>
     <li>الكتاب يفترض أن E يتناسب خطياً مع تيار المجال (زيادة <span class="ltr">25%</span> في \(I_F\) ⇐ زيادة <span class="ltr">25%</span> في E)، أي يتجاهل <b>التشبع المغناطيسي</b>، مع أن الشكل (4-5) نفسه يُظهر «منطقة التشبع». في آلة قريبة من التشبع تكون زيادة E أقل.</li>
     <li>طُبع \(208\angle{0^\circ}-227.5\angle{-13.9^\circ}=56.2\angle{103.2^\circ}\)، والقيمة الدقيقة <span class="ltr">56.1</span>، فيصبح \(I_{Ph}=22.4\angle{13.2^\circ}\) A و\(I_L=38.80\) A بدلاً من <span class="ltr">22.5</span> و<span class="ltr">38.97</span>. وصيغة تيار الخط (ص 138) مكتوبة بجهد الوجه، وتصح هنا لأن التوصيل دلتا.</li></ul>`,fix:true},
    {title:'مختبر مصغّر: صح أم خطأ؟',widget:(el,B)=>DCML.tf(el,B,{intro:'عن حل مثال (4-2).',items:[
  [String.raw`عند زيادة تيار المجال 25% يزيد \(E_{ph}\) بالنسبة نفسها: \(1.25\times 182 = 227.5\ \text{V}\).`,true,'«فإن الفيض المغناطيسي سيزداد بنفس النسبة وبالتالي الجهد الداخلي سيزداد بنفس النسبة».'],
  ['القدرة الخارجة من المحرك تزيد مع زيادة تيار المجال.',false,'«رغم زيادة E إلا أن القدرة الخارجة من المحرك تبقى ثابتة».'],
  [String.raw`طول المتجه \(E_{ph}\sin\delta\) يبقى ثابتاً قبل زيادة تيار المجال وبعدها.`,true,String.raw`ومنه حسب الكتاب الزاوية الجديدة \(\delta'\).`],
  [String.raw`زاوية العزم تكبر (بالقيمة المطلقة) بعد زيادة تيار المجال.`,false,String.raw`تصغر: من \(-17.5^\circ\) إلى \(-13.9^\circ\)، لأن \(E_{ph}\) أطول و\(E_{ph}\sin\delta\) ثابت.`]]})}
   ]},

  {recap:[
   String.raw`زيادة تيار المجال تزيد \(E_{Ph}\) ولا تغير السرعة ولا العزم ولا القدرة الخارجة (ص 136).`,
   String.raw`تيار المنتج يقل أولاً حتى معامل قدرة = 1 ثم يزداد: E منخفض ← تيار متأخر (حمل حثي)، E مرتفع ← تيار متقدم (حمل سعوي).`,
   String.raw`القدرة ثابتة ← \(E\sin\delta\) ثابت من المعادلة (3-15) \(P_o=3\,V_{ph}E_{ph}\sin\delta/X_S\)، فرأس E على خط أفقي ورأس التيار على خط رأسي.`,
   String.raw`مثال (4-2): زيادة تيار المجال <span class="ltr">25%</span>: \(E\) من \(182\angle{-17.5^\circ}\) إلى \(227.5\angle{-13.9^\circ}\)، والتيار من \(25.8\angle{-31.8^\circ}\) إلى \(22.5\angle{13.2^\circ}\) A بالمعادلة (4-1): من <span class="ltr">0.85</span> متأخر إلى <span class="ltr">0.974</span> متقدم.`]}
],
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
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'ص 138: صيغة تيار الخط مكتوبة بجهد الوجه \\(V_{ph}\\) والصحيح عموماً بجهد الخط \\(V_L\\)؛ النتيجة صحيحة هنا لأن التوصيل دلتا (انظر الدرس السابق).'+'</div>'},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'ص 140: كُتب معامل القدرة بعد زيادة تيار المجال <span class="ltr">0.974</span> دون كلمة «متقدم»، مع أن الزاوية <span class="ltr">+13.2°</span> موجبة: تغيّر معامل القدرة من <b>0.85 متأخر</b> إلى <b>0.974 متقدم</b>.'+'</div>'},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'ص 139: الكتاب يفترض أن E يتناسب خطياً مع تيار المجال (زيادة 25% في \\(I_F\\) ⇒ زيادة 25% في E)، أي يتجاهل <b>التشبع المغناطيسي</b>، مع أن الشكل (4-5) نفسه يُظهر «منطقة التشبع». في آلة حقيقية قريبة من التشبع تكون زيادة E أقل من 25%. الحاسبة تتبع افتراض الكتاب.'+'</div>'},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'ص 139: طُبع \\(208\\angle{0^\\circ}-227.5\\angle{-13.9^\\circ}=56.2\\angle{103.2^\\circ}\\)، والقيمة الدقيقة <span class="ltr">56.14</span> أي <b>56.1</b>. فيصبح \\(I_{Ph}=22.4\\angle{13.2^\\circ}\\) A و\\(I_L=38.80\\) A بدلاً من 22.5 و38.97؛ ومعامل القدرة لا يتغير (0.974). وفي الصيغة نفسها كُتب \\(E_{Ph}\\) والمقصود \\(E\'_{Ph}\\) (ترميز فقط).'+'</div>'}
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
   note:'<span class="fixnote"><b>ملاحظة على الكتاب:</b> بقيم الكتاب تعرض الحاسبة الرقم المطبوع <span class="ltr">56.2∠103.2°</span> (والدقيق 56.14 أي 56.1). </span>والحساب يفترض أن E يتناسب خطياً مع تيار المجال (يتجاهل التشبع)، وهذا افتراض الكتاب.'},
  {title:'مثال (4-2) — الحل المصحح',ref:'ص 137–140',q:'<p>نفس المثال بتقريب صحيح للمقدار <span class="ltr">|208∠0° − 227.5∠−13.9°| = 56.1</span>. (حساب مصحح — ليس من الكتاب.)</p>',
   given:G42,solve:(g)=>solveField(g,{}).st,note:'<span class="fixnote">الفرق عن الكتاب: تيار المنتج 22.4 A بدلاً من 22.5 A، وتيار الخط 38.80 A بدلاً من 38.97 A؛ ومعامل القدرة نفسه 0.974 متقدم.</span>'}
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
const R9a=solveLoad(gv(G9),{conn:'star',vmode:'div'}).R,R10=solveField(gv(G10),{hp:1}).R;
const ex9txt=(R,lab)=>`<b>${lab}</b> \\(V_{ph}=${n_(R.Vph)}\\) V؛ \\(P_{in}=${n_(R.Pin1)}\\) kw؛ \\(I_L=I_{ph}=${fm(R.IL,1)}\\) A؛ \\(I_{ph}=${fm(R.Iph,1)}\\angle{${ang(R.ia)}^\\circ}\\) A؛ \\(E_{Ph}=${n_(R.Em)}\\angle{${ang(R.Ea)}^\\circ}\\) V. بعد زيادة الحمل: \\(P_{in}=${n_(R.Pin2)}\\) kw، \\(\\delta=${n_(R.d)}^\\circ\\)، \\(E_{Ph}=${n_(R.Em)}\\angle{-${n_(R.d)}^\\circ}\\) V، \\(I_{ph}=I_L=${fm(R.I2,1)}\\angle{${ang(R.I2a)}^\\circ}\\) A، \\(\\cos\\theta=${fm(R.pf2,3)}\\) ${R.I2a>0?'متقدم':'متأخر'}.`;
B.lesson({
 id:'u4-l6',unit:4,order:6,pages:'141–143',
 title:'أسئلة الوحدة الرابعة وتمارينها',
 summary:'أسئلة الوحدة وتمارينها، مع إجابات مقترحة من نص الوحدة، وحاسبات للتمرينين 9 و10 بخطوات المثالين (4-1) و(4-2)، وجدول المراجع.',
 stations:[
  {intro:true},

  {st:1,short:'الأسئلة 1–4',title:'أسئلة التشغيل والبدء (1–4)',ref:'ص 141',
   q:'أربعة أسئلة عن كيف يعمل المحرك التزامني وكيف يبدأ. حاول أن تجيب بنفسك أولاً، ثم افتح الإجابة المقترحة.',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="سرعة الدوار مع الزمن أثناء البدء: تتسارع والمجال مقصور عبر مقاومة، ثم يوصل التيار المستمر فيعلق بالسرعة التزامنية" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><path d="M50 262V48M50 262H328" fill="none" stroke="#2C4A40" stroke-width="2.5"/><line x1="50" y1="262" x2="50" y2="55.5" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><polygon points="50,40 57,55.5 43,55.5" fill="#2C4A40"/><line x1="50" y1="262" x2="320.5" y2="262" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><polygon points="336,262 320.5,269 320.5,255" fill="#2C4A40"/><text x="46" y="32" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">n</text><text x="332" y="286" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">t</text><line x1="50" y1="96" x2="320" y2="96" stroke="#8A9A93" stroke-width="1.6" stroke-dasharray="6 5"/><text x="32" y="101" text-anchor="middle" font-size="14" fill="#3B6FB6" font-weight="700" direction="ltr" font-family="var(--mono)">n<tspan font-size="10" dy="4">s</tspan><tspan dy="-4">&#8203;</tspan></text><rect data-tip="أثناء البدء: ملفات المجال مقصورة عبر مقاومة، والدوار يتسارع بإحدى طرق البدء (محرك خارجي، قضبان تخميد، تيارات دوامية، مصدر متغير التردد)." x="52" y="40" width="150" height="222" fill="#F4D9C8" opacity=".55"/><path d="M50 262C110 250 150 130 200 108" fill="none" stroke="#E8735A" stroke-width="4.5" stroke-linecap="round"/><path data-tip="بعد توصيل التيار المستمر يعلق الدوار بالمجال الدوار ويدور بالسرعة التزامنية ⟦ns⟧ تماماً." d="M200 108Q212 96 226 96H320" fill="none" stroke="#12855A" stroke-width="4.5" stroke-linecap="round"/><g data-tip="لحظة توصيل التيار المستمر إلى ملفات المجال: والدوار قريب من السرعة التزامنية، فتكون الزاوية بين المجالين صغيرة."><line x1="202" y1="60" x2="202" y2="262" stroke="#2C4A40" stroke-width="2.2"/><circle cx="202" cy="108" r="6" fill="#2C4A40"/></g><text x="118" y="116" text-anchor="middle" font-size="13" fill="#B9852A" font-weight="700" direction="rtl">مقصورة</text><text x="118" y="132" text-anchor="middle" font-size="13" fill="#B9852A" font-weight="700" direction="rtl">عبر مقاومة</text><text x="270" y="76" text-anchor="middle" font-size="14" fill="#12855A" font-weight="700" direction="rtl">متزامن</text><text x="202" y="52" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="rtl">توصيل التيار المستمر</text></svg>`,
   cap:'سرعة الدوار أثناء البدء: يتسارع وملفات المجال مقصورة عبر مقاومة، ثم يُوصل التيار المستمر قرب <span class="ltr">n<sub>s</sub></span> فيعلق بالسرعة التزامنية (رسم توضيحي).<br><b>مرّر المؤشر على المنطقة الملونة والخطين (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'أي الطرق التالية مناسبة للمحركات التزامنية الصغيرة فقط حسب الكتاب؟',opts:[
     ['المحرك الخارجي',false,'لم يحددها الكتاب بحجم معين.'],
     ['قضبان التخميد',false,'لم يحددها الكتاب بحجم معين.'],
     ['التيارات الدوامية في دوار مصمت',true,'الكتاب ص 128: «وهذه الطريقة مناسبة للمحركات التزامنية الصغيرة».'],
     ['المصدر متغير التردد',false,'لم يحدده الكتاب بحجم معين؛ يذكر أنه انتشر بفضل إلكترونيات القدرة.']]}}
   ],
   body:[
    {book:String.raw`<ol><li>كيف يعمل المحرك التزامني؟</li><li>لماذا لا يستطيع المحرك التزامني البدء من تلقاء نفسه؟</li><li>قارن بين طرق بدء المحرك التزامني من حيث: سهولة الاستخدام والتكلفة.</li><li>لماذا يجب قصر ملفات المجال أثناء عملية البدء؟</li></ol>`,ref:'ص 141'},
    {tip:String.raw`<p>الكتاب لا يعطي إجابات؛ هذه إجابات مقترحة مكتوبة من نص الوحدة ويعتمدها المدرب.</p>
     <details class="sm-q"><summary>1. كيف يعمل المحرك التزامني؟</summary><p>يغذى العضو الثابت بجهد ثلاثي الأوجه فينشأ مجال دوار \(B_S\) بالسرعة التزامنية، وتغذى ملفات المجال بتيار مستمر فينشأ مجال الدوار \(B_R\). بعد إيصال الدوار إلى السرعة التزامنية أو قريباً منها تُغذى ملفات المجال، فتكون الزاوية بين المجالين صغيرة، فيلحق مجال الدوار (ومعه الدوار) بمجال الثابت ويدور بالسرعة التزامنية نفسها ولا تتغير مهما تغير الحمل ضمن الحمل المقنن؛ والحمل الأكبر تقابله زاوية عزم δ أكبر. وإذا زاد الحمل عن العزم الأقصى يفقد التزامن (ص 126–127).</p></details>
     <details class="sm-q"><summary>2. لماذا لا يستطيع البدء من تلقاء نفسه؟</summary><p>لأن مجال العضو الثابت يدور بالسرعة التزامنية والدوار واقف، فيحاول مجال الدوار اللحاق به لكنه لا يتمكن بسبب اتساع الزاوية بينهما (ص 127). يجذب المجالُ القطبَ ثم يدفعه في كل دورة فيكون متوسط العزم صفراً.</p></details>
     <details class="sm-q"><summary>3. قارن بين طرق البدء: سهولة الاستخدام والتكلفة</summary><p>الكتاب يصف الطرق ولا يقارنها صراحة؛ مقارنة مقترحة من وصفه:</p><ul>
      <li><b>المحرك الخارجي:</b> محرك إضافي على العمود نفسه وخطوات تشغيل متتابعة ← تكلفة أعلى واستخدام أصعب.</li>
      <li><b>قضبان التخميد:</b> مدمجة في أحذية الأقطاب ويبدأ المحرك كمحرك حثي ← سهل وتكلفته الإضافية قليلة.</li>
      <li><b>التيارات الدوامية:</b> دوار مصمت بلا قضبان يعلق وحده ← الأسهل، لكنها للمحركات الصغيرة فقط.</li>
      <li><b>المصدر متغير التردد:</b> بدء سهل بخفض التردد ثم رفعه، لكنه يحتاج إلكترونيات قدرة ← الأعلى تكلفة.</li></ul></details>
     <details class="sm-q"><summary>4. لماذا يجب قصر ملفات المجال أثناء البدء؟</summary><p>لأن تعرضها للمجال المغناطيسي الدوار الناتج عن العضو الثابت يولد جهداً عالياً على أطرافها قد يؤدي إلى انهيار العازل أو حدوث شرارة بين حلقات الانزلاق؛ لذلك تُقصر عبر مقاومة حتى يوصل التيار المستمر (ص 129).</p></details>`,title:'إجابات مقترحة'},
    {title:'مختبر مصغّر: صح أم خطأ؟',widget:(el,B)=>DCML.tf(el,B,{intro:'احكم على هذه العبارات قبل أن تكتب إجاباتك.',items:[
  ['المحرك التزامني لا يبدأ وحده، لأن الدوار لا يستطيع اللحاق بالمجال الدوار السريع.',true,'الدرس 4.1 (ص 127).'],
  ['تبقى قضبان التخميد تحمل تياراً بعد الوصول إلى السرعة التزامنية.',false,'«يتلاشى تأثير قضبان التخميد لأن التيارات المارة بها عند السرعة التزامنية تساوي صفراً».'],
  ['تُقصر ملفات المجال عبر مقاومة أثناء البدء لتجنب الجهد العالي على أطرافها.',true,'الجهد العالي «قد يؤدي إلى انهيار العازل أو حدوث شرارة بين حلقات الانزلاق» (ص 129).'],
  ['البدء بالتيارات الدوامية طريقة مناسبة للمحركات التزامنية الصغيرة.',true,'نص الكتاب (ص 128).']]})}
   ]},

  {st:2,short:'الأسئلة 5–8',title:'أسئلة معامل القدرة والمقارنة (5–8)',ref:'ص 141',
   q:'كيف نغيّر معامل القدرة دون أن نغيّر القدرة؟ ومتى نختار التزامني بدلاً من الحثي؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="السرعة مع الحمل: التزامني ثابت عند السرعة التزامنية، والحثي أقل منها ويتناقص مع الحمل" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><path d="M56 250V48M56 250H322" fill="none" stroke="#2C4A40" stroke-width="2.5"/><line x1="56" y1="250" x2="56" y2="55.5" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><polygon points="56,40 63,55.5 49,55.5" fill="#2C4A40"/><line x1="56" y1="250" x2="314.5" y2="250" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><polygon points="330,250 314.5,257 314.5,243" fill="#2C4A40"/><text x="52" y="32" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">n</text><text x="326" y="274" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" direction="rtl">الحمل</text><line x1="56" y1="96" x2="318" y2="96" stroke="#8A9A93" stroke-width="1.4" stroke-dasharray="6 5"/><text x="38" y="101" text-anchor="middle" font-size="14" fill="#3B6FB6" font-weight="700" direction="ltr" font-family="var(--mono)">n<tspan font-size="10" dy="4">s</tspan><tspan dy="-4">&#8203;</tspan></text><line data-tip="المحرك التزامني: سرعته ثابتة عند ⟦ns⟧ مهما تغير الحمل ضمن الحمل المقنن (ص 130)." x1="56" y1="96" x2="300" y2="96" stroke="#E8735A" stroke-width="5" stroke-linecap="round"/><path data-tip="المحرك الحثي (من الوحدة الأولى): يدور أقل من ⟦ns⟧ بانزلاق يزداد مع الحمل." d="M56 108L300 150" fill="none" stroke="#4FB3A9" stroke-width="5" stroke-linecap="round"/><text x="250" y="84" text-anchor="middle" font-size="14" fill="#C4552F" font-weight="700" direction="rtl">التزامني</text><text x="250" y="176" text-anchor="middle" font-size="14" fill="#2E8C83" font-weight="700" direction="rtl">الحثي</text><line data-tip="العزم الأقصى: إذا زاد الحمل عنه يفقد المحرك التزامني التزامن ويتباطأ حتى يتوقف." x1="300" y1="70" x2="300" y2="250" stroke="#B23A2A" stroke-width="2" stroke-dasharray="4 4"/><text x="300" y="62" text-anchor="middle" font-size="12" fill="#B23A2A" font-weight="700" direction="rtl">العزم الأقصى</text></svg>`,
   cap:'السرعة مع الحمل: التزامني ثابت عند <span class="ltr">n<sub>s</sub></span> حتى العزم الأقصى، والحثي أقل منها ويتناقص مع الحمل (رسم توضيحي).<br><b>مرّر المؤشر على الخطين (أو المسهما في الجوال) لتعرف معناهما.</b>',
   side:[
    {predict:{q:'تريد أن تغيّر معامل قدرة محرك تزامني من متأخر إلى متقدم دون أن تتغير القدرة الخارجة منه. ماذا تفعل؟',opts:[
     ['تقلل الحمل',false,'تقليل الحمل يغيّر القدرة الخارجة، والمطلوب أن تبقى ثابتة.'],
     ['تزيد تيار المجال',true,'زيادة تيار المجال تزيد E والقدرة ثابتة، فيتحول التيار من متأخر إلى متقدم (ص 136–137، مثال 4-2).'],
     ['تعكس ترتيب الأوجه',false,'عكس ترتيب الأوجه يعكس اتجاه الدوران ولا يغير معامل القدرة.']]}}
   ],
   body:[
    {book:String.raw`<ol start="5"><li>اشرح كيف يمكن تغيير معامل القدرة للمحرك التزامني من متقدم إلى متأخر أو العكس دون حدوث تغيير في القدرة الخارجة منه.</li><li>متى يفضل استخدام المحرك التزامني على الحثي؟</li><li>ماذا يعني فقد التزامن بالنسبة للمحرك التزامني؟</li><li>قارن بين المحرك الحثي والتزامني من حيث: التكلفة وطرق البدء والسرعة والعزم.</li></ol>`,ref:'ص 141'},
    {tip:String.raw`<details class="sm-q"><summary>5. تغيير معامل القدرة دون تغيير القدرة</summary><p>بالتحكم في تيار المجال \(I_F\): تغييره يغير \(E_{Ph}\) ولا يغير السرعة ولا العزم ولا القدرة الخارجة (يبقى \(E\sin\delta\) و\(I\cos\theta\) ثابتين). زيادة \(I_F\) فوق قيمة معامل القدرة = 1 تجعل التيار متقدماً (حمل سعوي يعطي Q)، وإنقاصه تحتها تجعله متأخراً (حمل حثي يسحب Q) (ص 129، 136–137).</p></details>
     <details class="sm-q"><summary>6. متى يفضل التزامني على الحثي؟</summary><p>في التطبيقات التي يكون فيها ثبات السرعة مطلباً أساسياً، وكذلك عند الحاجة إلى تحسين معامل القدرة (المكثف التزامني). وإن لم يكن ثبات السرعة مطلباً أساسياً يُستغنى عنه لارتفاع ثمنه (ص 131).</p></details>
     <details class="sm-q"><summary>7. ماذا يعني فقد التزامن؟</summary><p>أن يزيد الحمل عن العزم الأقصى للمحرك (مقدار δ يتجاوز <span class="ltr">90°</span>) فلا يستطيع الدوار البقاء مع المجال الدوار، فيبدأ بالتباطؤ التدريجي حتى يتوقف (ص 127).</p></details>
     <details class="sm-q"><summary>8. مقارنة الحثي والتزامني</summary><ul>
      <li><b>التكلفة:</b> التزامني أغلى لأنه يحتاج نظام إثارة ونظام بدء حركة (ص 131).</li>
      <li><b>البدء:</b> التزامني لا يبدأ وحده ويحتاج إحدى طرق البدء (ص 128–129)؛ والحثي يبدأ وحده.</li>
      <li><b>السرعة:</b> التزامني ثابت عند \(n_s\) مهما تغير الحمل ضمن المقنن (ص 130)؛ والحثي يدور أقل من \(n_s\) بانزلاق يزداد مع الحمل (من الوحدة الأولى).</li>
      <li><b>العزم:</b> في التزامني يتغير العزم مع δ والسرعة ثابتة حتى العزم الأقصى ثم يفقد التزامن (الشكل 4-4)؛ والحثي يغير عزمه بتغير الانزلاق (من الوحدة الأولى).</li></ul></details>`,title:'إجابات مقترحة'},
    {title:'مختبر مصغّر: تزامني أم حثي؟',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل صفة اختر المحرك الذي تخصه.',cats:['التزامني','الحثي'],items:[
  ['سرعته ثابتة مهما تغير الحمل ضمن المقنن',0,'السرعة مرتبطة بتردد المصدر (ص 130–131).'],
  ['تقل سرعته قليلاً كلما زاد الحمل',1,'هذا سلوك المحرك الحثي.'],
  ['أغلى ثمناً لأنه يحتاج نظام إثارة ونظام بدء حركة',0,'ص 131.'],
  ['يمكن جعل معامل قدرته متقدماً بزيادة تيار المجال',0,'منحنيات V (ص 129–130).'],
  ['يبدأ الدوران وحده عند توصيله بالمصدر',1,'المحرك التزامني يحتاج وسيلة بدء (الدرس 4.2).']]})}
   ]},

  {st:3,short:'التمرين 9',title:'التمرين 9: تغيير الحمل (على طريقة مثال 4-1)',ref:'ص 141',
   q:'محرك موصل نجمة هذه المرة، والحمل يزيد من 11 إلى 18 kW. ما الذي يختلف عن مثال (4-1)؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="التمرين 9" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="145" fill="#F7DCC8"/><rect x="40" y="30" width="280" height="262" rx="14" fill="#F1EBDD" stroke="#2C4A40" stroke-width="3"/><path data-tip="بيانات التمرين 9 كما في الكتاب (ص 141)." d="M40 44a14 14 0 0 1 14 -14h252a14 14 0 0 1 14 14v22h-280z" fill="#2C4A40"/><text x="180" y="55" text-anchor="middle" font-size="14" fill="#FBF6EE" font-weight="700" direction="rtl">التمرين 9</text><g data-tip="توصيل النجمة: جهد الوجه = جهد الخط ÷ ⟦√3⟧، وتيار الوجه = تيار الخط."><text x="300" y="90" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="600" direction="rtl">التوصيل</text><text x="60" y="90" text-anchor="end" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">نجمة Y</text><rect x="52" y="73" width="256" height="24" fill="transparent"/></g><line x1="56" y1="98" x2="304" y2="98" stroke="#CFC6B4"/><g data-tip="جهد الخط للمصدر كما في الكتاب."><text x="300" y="116" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="600" direction="rtl">جهد الخط</text><text x="60" y="116" text-anchor="start" font-size="14" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">360 V</text><rect x="52" y="99" width="256" height="24" fill="transparent"/></g><line x1="56" y1="124" x2="304" y2="124" stroke="#CFC6B4"/><text x="300" y="142" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="600" direction="rtl">التردد</text><text x="60" y="142" text-anchor="start" font-size="14" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">50 Hz</text><rect x="52" y="125" width="256" height="24" fill="transparent"/><line x1="56" y1="150" x2="304" y2="150" stroke="#CFC6B4"/><g data-tip="الممانعة التزامنية ⟦XS⟧ لكل وجه، ومقاومة ملفات المنتج مهملة."><text x="300" y="168" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="600" direction="rtl">الممانعة التزامنية</text><text x="60" y="168" text-anchor="start" font-size="14" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">2.1 Ω</text><rect x="52" y="151" width="256" height="24" fill="transparent"/></g><line x1="56" y1="176" x2="304" y2="176" stroke="#CFC6B4"/><text x="300" y="194" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="600" direction="rtl">المفاقيد الحديدية</text><text x="60" y="194" text-anchor="start" font-size="14" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">960 W</text><rect x="52" y="177" width="256" height="24" fill="transparent"/><line x1="56" y1="202" x2="304" y2="202" stroke="#CFC6B4"/><text x="300" y="220" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="600" direction="rtl">مفاقيد الاحتكاك</text><text x="60" y="220" text-anchor="start" font-size="14" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">1420 W</text><rect x="52" y="203" width="256" height="24" fill="transparent"/><line x1="56" y1="228" x2="304" y2="228" stroke="#CFC6B4"/><g data-tip="الحمل يزداد من ⟦11 kW⟧ إلى ⟦18 kW⟧، ويُفهم قدرةً خارجة كما في مثال (4-1)."><text x="300" y="246" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="600" direction="rtl">الحمل</text><text x="60" y="246" text-anchor="start" font-size="14" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">11 → 18 kW</text><rect x="52" y="229" width="256" height="24" fill="transparent"/></g><line x1="56" y1="254" x2="304" y2="254" stroke="#CFC6B4"/><text x="300" y="272" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="600" direction="rtl">معامل القدرة</text><text x="60" y="272" text-anchor="end" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">0.8 متقدم</text><rect x="52" y="255" width="256" height="24" fill="transparent"/></svg>`,
   cap:'بيانات التمرين 9 من الكتاب.<br><b>مرّر المؤشر على الأسطر (أو المسها في الجوال) لتعرف ملاحظاتنا عليها.</b>',
   side:[
    {predict:{q:String.raw`التوصيل نجمة وجهد الخط <span class="ltr">360 V</span>. أي جهد تضعه مكان \(V_{ph}\) في المعادلة (4-1)؟`,opts:[
     [String.raw`<span class="ltr">360 V</span> كما هو`,false,'في النجمة جهد الوجه أقل من جهد الخط؛ 360 V هو جهد الخط.'],
     [String.raw`<span class="ltr">360 × √3</span>`,false,'هذا يكبّر الجهد، والصحيح القسمة على √3 لا الضرب.'],
     [String.raw`<span class="ltr">360 ÷ √3</span>`,true,'في توصيل النجمة: جهد الوجه = جهد الخط ÷ √3، وتيار الوجه = تيار الخط.']]}}
   ],
   body:[
    {book:String.raw`<p>9. محرك تزامني ملفاته موصلة على شكل نجمة، جهد الخط للمصدر <span class="ltr">360 V</span> والتردد <span class="ltr">50 Hz</span>، ممانعته التزامنية <span class="ltr">2.1 Ω</span> ومقاومة ملفات المنتج مهملة، المفاقيد الحديدية <span class="ltr">960 W</span> ومفاقيد الاحتكاك <span class="ltr">1420 W</span>، يدير حملاً قدره <span class="ltr">11 kw</span> عند معامل قدرة <span class="ltr">0.8</span> متقدماً، أوجد ما يلي:</p>
     <p>أ) ارسم المخطط الاتجاهي للمحرك. ب) أوجد قيم \(I_L\)، \(I_{Ph}\)، \(E_{Ph}\). جـ) عندما يزداد الحمل إلى <span class="ltr">18 kw</span> وضح سلوك المحرك باستخدام المخطط الاتجاهي. د) أوجد قيم \(I_L\)، \(I_{Ph}\)، \(E_{Ph}\) بعد زيادة الحمل. هـ) احسب معامل القدرة بعد زيادة الحمل.</p>`,ref:'ص 141'},
    {tip:String.raw`<ol><li>القدرة الداخلة = الحمل + المفاقيد الحديدية + مفاقيد الاحتكاك (الحمل <span class="ltr">11 kw</span> يُفهم قدرةً خارجة كما في مثال 4-1).</li>
     <li>جهد الوجه = جهد الخط ÷ √3 (نجمة)، ثم تيار الخط، وتيار الوجه = تيار الخط.</li>
     <li>\(E_{Ph}\) من المعادلة (4-1) بتيار متقدم.</li>
     <li>بعد زيادة الحمل: طول \(E_{Ph}\) ثابت، فـ δ الجديدة من المعادلة (3-15) مقلوبة، ثم التيار الجديد من (4-1)، ثم معامل القدرة.</li></ol>
     <p>المخطط (أ و جـ) مثل الشكل (4-7): بعد زيادة الحمل يبقى طول E ثابتاً وتكبر δ، ويطول التيار ويقل تقدمه. الحل المقترح خطوة بخطوة في تبويب «الأمثلة المحلولة».</p>
     <div class="w-row"><button class="btn pri" type="button" onclick="var b=document.querySelector('.ltabs button[data-tab=examples]');if(b)b.click()">افتح الحل المقترح</button></div>`,title:'خطوات الحل'},
    {watch:String.raw`<p>هنا التوصيل <b>نجمة</b>، فجهد الوجه يختلف عن جهد الخط؛ لذلك نقسم على √3 أولاً.</p>`},
    {watch:String.raw`<ul><li>صيغة تيار الخط في الكتاب (ص 134) مكتوبة بجهد الوجه، وكانت تصح في مثال (4-1) لأن التوصيل دلتا، ولا تصح في توصيل النجمة.</li>
     <li>جهد الخط <span class="ltr">360 V</span> قيمة غير قياسية (ربما المقصود <span class="ltr">380 V</span>)، وتُركت كما هي في الكتاب.</li></ul>`,fix:true},
    {title:'مختبر مصغّر: قبل أن تحل',widget:(el,B)=>DCML.cases(el,B,{cases:[
  {q:'المحرك في التمرين 9 موصل نجمة وجهد الخط 360 V. كم جهد الوجه تقريباً؟',opts:[
   ['360 V',false,'هذا جهد الخط. في النجمة جهد الوجه أصغر منه.'],
   ['207.85 V',true,String.raw`في النجمة \(V_{ph} = V_L/\sqrt3 = 360/1.732 \approx 207.85\ \text{V}\).`],
   ['623.5 V',false,'هذا ضرب في √3 بدلاً من القسمة.']]},
  {q:'عندما يزيد الحمل من 11 إلى 18 kW وتيار المجال ثابت، أي كمية تبقى ثابتة؟',opts:[
   [String.raw`زاوية العزم \(\delta\)`,false,String.raw`\(\delta\) تكبر مع الحمل.`],
   [String.raw`مقدار \(E_{ph}\)`,true,'كما في مثال (4-1): تيار المجال ثابت، فطول E ثابت ورأسه يتحرك على دائرة.'],
   ['تيار المنتج',false,'التيار يتغير مع الحمل.']]}]})}
   ]},

  {st:4,short:'التمرين 10',title:'التمرين 10: تغيير تيار المجال (على طريقة مثال 4-2)',ref:'ص 142',
   q:'محرك كبير (400 hp) يعمل متقدماً أصلاً، ونزيد تيار المجال 10%… هل يقل التيار كما في مثال (4-2)؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="التمرين 10" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="145" fill="#E6E2F8"/><rect x="40" y="30" width="280" height="236" rx="14" fill="#F1EBDD" stroke="#2C4A40" stroke-width="3"/><path data-tip="بيانات التمرين 10 كما في الكتاب (ص 142)." d="M40 44a14 14 0 0 1 14 -14h252a14 14 0 0 1 14 14v22h-280z" fill="#2C4A40"/><text x="180" y="55" text-anchor="middle" font-size="14" fill="#FBF6EE" font-weight="700" direction="rtl">التمرين 10</text><g data-tip="توصيل الدلتا: جهد الوجه = جهد الخط، كما في المثالين (4-1) و(4-2)."><text x="300" y="90" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="600" direction="rtl">التوصيل</text><text x="60" y="90" text-anchor="end" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">دلتا Δ</text><rect x="52" y="73" width="256" height="24" fill="transparent"/></g><line x1="56" y1="98" x2="304" y2="98" stroke="#CFC6B4"/><text x="300" y="116" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="600" direction="rtl">جهد المصدر</text><text x="60" y="116" text-anchor="start" font-size="14" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">480 V</text><rect x="52" y="99" width="256" height="24" fill="transparent"/><line x1="56" y1="124" x2="304" y2="124" stroke="#CFC6B4"/><g data-tip="الممانعة التزامنية ⟦XS⟧ لكل وجه، ومقاومة ملفات المنتج مهملة."><text x="300" y="142" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="600" direction="rtl">الممانعة التزامنية</text><text x="60" y="142" text-anchor="start" font-size="14" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">1 Ω</text><rect x="52" y="125" width="256" height="24" fill="transparent"/></g><line x1="56" y1="150" x2="304" y2="150" stroke="#CFC6B4"/><g data-tip="المفاقيد الحديدية ومفاقيد الاحتكاك مهملة، فالقدرة الداخلة = القدرة الخارجة."><text x="300" y="168" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="600" direction="rtl">المفاقيد</text><text x="60" y="168" text-anchor="end" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">مهملة</text><rect x="52" y="151" width="256" height="24" fill="transparent"/></g><line x1="56" y1="176" x2="304" y2="176" stroke="#CFC6B4"/><text x="300" y="194" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="600" direction="rtl">الحمل</text><text x="60" y="194" text-anchor="start" font-size="14" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">400 hp</text><rect x="52" y="177" width="256" height="24" fill="transparent"/><line x1="56" y1="202" x2="304" y2="202" stroke="#CFC6B4"/><text x="300" y="220" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="600" direction="rtl">معامل القدرة</text><text x="60" y="220" text-anchor="end" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">0.85 متقدم</text><rect x="52" y="203" width="256" height="24" fill="transparent"/><line x1="56" y1="228" x2="304" y2="228" stroke="#CFC6B4"/><g data-tip="في الجزء (ب): تيار المجال يزداد ⟦10%⟧ والحمل ثابت، كما في مثال (4-2)."><text x="300" y="246" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="600" direction="rtl">زيادة تيار المجال</text><text x="60" y="246" text-anchor="start" font-size="14" fill="#2C4A40" font-weight="700" direction="ltr" font-family="var(--mono)">10%</text><rect x="52" y="229" width="256" height="24" fill="transparent"/></g></svg>`,
   cap:'بيانات التمرين 10 من الكتاب.<br><b>مرّر المؤشر على الأسطر (أو المسها في الجوال) لتعرف ملاحظاتنا عليها.</b>',
   side:[
    {predict:{q:'التيار متقدم أصلاً (0.85 متقدم)، ثم زاد تيار المجال 10% والحمل ثابت. ماذا يحدث للتيار؟',opts:[
     ['يزداد ويزداد تقدمه',true,'المحرك في الفرع الأيمن من منحنى V أصلاً، فزيادة تيار المجال تبعده أكثر عن أدنى نقطة: يطول التيار ويزداد تقدمه.'],
     ['يقل حتى يصير معامل القدرة واحداً',false,'هذا يحدث إذا كان التيار متأخراً في البداية (كمثال 4-2). هنا هو متقدم أصلاً.'],
     ['يصير متأخراً',false,'زيادة تيار المجال تزيد التقدم ولا تجعله متأخراً.']]}}
   ],
   body:[
    {book:String.raw`<p>10. محرك تزامني ملفاته موصلة على شكل دلتا، يغذى من مصدر جهده <span class="ltr">480 V</span>، ممانعته التزامنية <span class="ltr">1 Ω</span> ومقاومة ملفات المنتج مهملة والمفاقيد الحديدية ومفاقيد الاحتكاك مهملة أيضاً. أوجد ما يلي:</p>
     <p>أ) إذا كان يدير حملاً قدرته <span class="ltr">400 hp</span> عند معامل قدرة <span class="ltr">0.85</span> متقدماً، أوجد قيمة وزاوية كل من \(I_{Ph}\)، \(E_{Ph}\). ب) إذا ازداد تيار المجال بنسبة <span class="ltr">10%</span> وضح سلوك المحرك باستخدام المخطط الاتجاهي ثم أوجد قيم \(I_{Ph}\)، \(E_{Ph}\) وكذلك معامل القدرة الجديد.</p>`,ref:'ص 142'},
    {tip:String.raw`<ol><li>المفاقيد مهملة، فالقدرة الداخلة = <span class="ltr">400 × 0.746</span> kw.</li>
     <li>التوصيل دلتا، فجهد الوجه = <span class="ltr">480 V</span>؛ ثم تيار الخط وتيار الوجه = تيار الخط ÷ √3 بزاوية متقدمة.</li>
     <li>\(E_{Ph}\) من المعادلة (4-1).</li>
     <li>بعد زيادة تيار المجال: \(E'_{Ph}=1.1\,E_{Ph}\)، و\(E\sin\delta\) ثابت فنجد δ′، ثم التيار الجديد من (4-1) ومعامل القدرة.</li></ol>
     <p>الحل المقترح خطوة بخطوة في تبويب «الأمثلة المحلولة».</p>
     <div class="w-row"><button class="btn pri" type="button" onclick="var b=document.querySelector('.ltabs button[data-tab=examples]');if(b)b.click()">افتح الحل المقترح</button></div>`,title:'خطوات الحل'},
    {watch:String.raw`<p>الكتاب لا يعطي إجابة للتمرينين 9 و10؛ الحلول في «الأمثلة المحلولة» حساب مقترح بخطوات المثالين (4-1) و(4-2) ويعتمده المدرب.</p>`},
    {title:'مختبر مصغّر: قبل أن تحل',widget:(el,B)=>DCML.cases(el,B,{cases:[
  {q:String.raw`زاد تيار المجال 10%. كم يصير \(E_{ph}\)؟`,opts:[
   [String.raw`\(1.1\,E_{ph}\)`,true,'كما في مثال (4-2): الفيض والجهد الداخلي يزيدان بنسبة زيادة تيار المجال.'],
   [String.raw`\(E_{ph}\) لا يتغير`,false,String.raw`\(E_{ph}\) يتبع تيار المجال.`],
   [String.raw`\(0.9\,E_{ph}\)`,false,'الزيادة 10% لا النقص.']]},
  {q:'المحرك يعمل أصلاً بمعامل قدرة 0.85 متقدم، ثم زاد تيار المجال. ماذا يحدث لتيار المنتج؟',opts:[
   ['يقل كما في مثال <bdi class="ltr">(4-2)</bdi>',false,'في مثال (4-2) كان التيار متأخراً فقلّ أولاً. هنا هو متقدم أصلاً.'],
   ['يزيد ويزداد تقدمه',true,'على الجانب المتقدم من منحنى V، كل زيادة في تيار المجال تزيد التيار (ص 129–130).'],
   ['لا يتغير',false,'تغيير تيار المجال يغير التيار ومعامل القدرة، والقدرة وحدها ثابتة.']]}]})}
   ]},

  {st:5,short:'المراجع',title:'المراجع',ref:'ص 143',
   q:'من أين جاءت هذه الوحدة؟ وأين تبحث إذا أردت أن تتوسع؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="خمسة كتب مراجع الوحدة مرصوصة: Chapman وMcPherson وSarma وTheraja وDel Toro" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="Electric Machinery Fundamentals — Stephen J. Chapman، ⟦McGRAW-Hill, 1991⟧"><rect x="65" y="58" width="230" height="34" rx="5" fill="#3B6FB6" stroke="#2C4A40" stroke-width="2"/><rect x="73" y="58" width="10" height="34" fill="#2C4A40" opacity=".35"/><text x="180" y="81" text-anchor="middle" font-size="15" fill="#FFFFFF" font-weight="700" direction="ltr" font-family="var(--mono)">Chapman · 1991</text></g><g data-tip="An Introduction to Electrical Machines and Transformers — George McPherson، ⟦John Wiley &amp; Sons, 1981⟧"><rect x="55" y="100" width="250" height="34" rx="5" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/><rect x="63" y="100" width="10" height="34" fill="#2C4A40" opacity=".35"/><text x="180" y="123" text-anchor="middle" font-size="15" fill="#FFFFFF" font-weight="700" direction="ltr" font-family="var(--mono)">McPherson · 1981</text></g><g data-tip="Electric Machines — M. S. Sarma، ⟦West Publishing Company, 1994⟧"><rect x="73" y="142" width="214" height="34" rx="5" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><rect x="81" y="142" width="10" height="34" fill="#2C4A40" opacity=".35"/><text x="180" y="165" text-anchor="middle" font-size="15" fill="#FFFFFF" font-weight="700" direction="ltr" font-family="var(--mono)">Sarma · 1994</text></g><g data-tip="Electrical Technology Construction &amp; Development — Theraja and A. K. Theraja، ⟦Nirja, 1989⟧"><rect x="60" y="184" width="240" height="34" rx="5" fill="#7A5BC7" stroke="#2C4A40" stroke-width="2"/><rect x="68" y="184" width="10" height="34" fill="#2C4A40" opacity=".35"/><text x="180" y="207" text-anchor="middle" font-size="15" fill="#FFFFFF" font-weight="700" direction="ltr" font-family="var(--mono)">Theraja · 1989</text></g><g data-tip="Electric Machines and Power Systems — Vincent Del Toro، ⟦1985⟧"><rect x="69" y="226" width="222" height="34" rx="5" fill="#12855A" stroke="#2C4A40" stroke-width="2"/><rect x="77" y="226" width="10" height="34" fill="#2C4A40" opacity=".35"/><text x="180" y="249" text-anchor="middle" font-size="15" fill="#FFFFFF" font-weight="700" direction="ltr" font-family="var(--mono)">Del Toro · 1985</text></g><rect x="60" y="270" width="240" height="10" rx="3" fill="#2C4A40"/></svg>`,
   cap:'مراجع الوحدة الخمسة.<br><b>مرّر المؤشر على أي كتاب (أو المسه في الجوال) لتعرف عنوانه كاملاً.</b>',
   side:[
    {predict:{q:'تريد أن تتوسع في منحنيات V والمخطط الاتجاهي للمحرك التزامني. أين تبحث أولاً؟',opts:[
     ['في كتاب عن الإلكترونيات الرقمية',false,'موضوعه بعيد عن الآلات الكهربائية.'],
     ['لا يوجد مرجع؛ الوحدة مكتوبة من الصفر',false,'الكتاب يذكر خمسة مراجع في ص 143.'],
     ['في أحد مراجع الوحدة، مثل Electric Machinery Fundamentals لـ Chapman',true,'قائمة المراجع تدلك على الكتب التي بُنيت عليها الوحدة، وكلها عن الآلات الكهربائية.']]}}
   ],
   body:[
    {book:String.raw`<div class="tablebox"><table class="tt"><thead><tr><th>اسم المرجع</th><th>المؤلف</th></tr></thead><tbody>
     <tr><td class="ltr">Electric Machinery Fundamentals, McGRAW-Hill, 1991</td><td class="ltr">Stephen J. Chapman</td></tr>
     <tr><td class="ltr">An Introduction to Electrical Machines and Transformers, 1981</td><td class="ltr">George McPherson, John Wiley &amp; Sons</td></tr>
     <tr><td class="ltr">Electric Machines, 1994</td><td class="ltr">M. S. Sarma, West Publishing Company</td></tr>
     <tr><td class="ltr">Electrical Technology Construction &amp; Development, 1989</td><td class="ltr">Theraja and A. K. Theraja, Nirja</td></tr>
     <tr><td class="ltr">Electric Machines and Power Systems</td><td class="ltr">Vincent del Toro 1985</td></tr></tbody></table></div>`,ref:'ص 143'},
    {tip:String.raw`<p>المراجع كلها باللغة الإنجليزية، فاحفظ المصطلحات الإنجليزية التي مرت بك في الوحدة لتبحث بها: <span class="ltr">Synchronous Motor</span> (المحرك التزامني)، <span class="ltr">Excitation System</span> (نظام الإثارة)، <span class="ltr">Synchronous Condenser</span> (المكثف التزامني)، <span class="ltr">Inductive / Capacitive Load</span> (حمل حثي / سعوي).</p>`,title:'كيف تستفيد منها؟'}
   ]},

  {recap:[
   String.raw`المحرك التزامني لا يبدأ وحده؛ أربع طرق للبدء، وفي كلها تُقصر ملفات المجال عبر مقاومة (ص 128–129).`,
   String.raw`تغيير تيار المجال يغيّر معامل القدرة دون تغيير القدرة: أقل ← متأخر، أكثر ← متقدم (ص 136–137).`,
   String.raw`تغيير الحمل وتيار المجال ثابت: طول \(E_{Ph}\) ثابت وδ تتغير حسب المعادلة (3-15) \(P_o=3\,V_{ph}E_{ph}\sin\delta/X_S\).`,
   String.raw`في كل التمارين: \(E_{ph}=V_{ph}-jX_SI_{ph}\) المعادلة (4-1)، وانتبه لجهد الوجه في توصيل النجمة.`]}
],
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
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'التمرين 9 ص 141: جهد الخط <span class="ltr">360 V</span> قيمة غير قياسية (ربما المقصود 380 V)، وتُركت كما هي. وصيغة تيار الخط في الكتاب مكتوبة بجهد الوجه (ص 134)، وفي توصيل النجمة يختلف جهد الوجه عن جهد الخط؛ لذلك تعرض الإجابة المقترحة والحاسبة طريقتين.'+'</div>'},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'التمرين 10 ص 142: «عند معامل <b>قدره</b> 0.85» والصحيح «معامل قدرة» (خطأ إملائي).'+'</div>'},
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
