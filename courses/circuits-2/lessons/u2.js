/* Unit 2 — دوائر التيار المتردد ثلاثي الأطوار (ص 75–96)
   Lessons u2-l1 … u2-l4 (c2_b.md lessons 4–7). Unit 2 is registered in course.js — no B.unit here. */
(function(B){
const {S}=B;
const PI=Math.PI,D=PI/180,SQ3=Math.sqrt(3);
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const fm=(x,d)=>B.fmtN(x,d);
const fx=v=>(+v).toFixed(1);
const lt=s=>`<span class="ltr">${s}</span>`;
const isZ=(v,d)=>B.round(Math.abs(v),d==null?6:d)===0;
const neg=(v,d)=>(v<0&&!isZ(v,d)?'−':'')+fm(Math.abs(v),d);          // printable signed number (true minus)
const ltx=(v,d)=>(v<0&&!isZ(v,d)?'-':'')+fm(Math.abs(v),d);          // signed number for LaTeX
/* complex numbers */
const C=(re,im)=>({re:+re,im:+(im||0)});
const cadd=(a,b)=>C(a.re+b.re,a.im+b.im),csub=(a,b)=>C(a.re-b.re,a.im-b.im),cmul=(a,b)=>C(a.re*b.re-a.im*b.im,a.re*b.im+a.im*b.re),
  cdiv=(a,b)=>{const d=b.re*b.re+b.im*b.im;return C((a.re*b.re+a.im*b.im)/d,(a.im*b.re-a.re*b.im)/d)},cabs=a=>Math.hypot(a.re,a.im),
  cang=a=>Math.atan2(a.im,a.re)/D,pol=(m,deg)=>C(m*Math.cos(deg*D),m*Math.sin(deg*D)),csc=(a,k)=>C(a.re*k,a.im*k),
  csum=arr=>arr.reduce((s,z)=>cadd(s,z),C(0,0)),cpar=(a,b)=>cdiv(cmul(a,b),cadd(a,b));
const wrap=a=>{a=((a+180)%360+360)%360-180;return a<=-180+1e-9?180:a};
/* strings: polar / rectangular, for HTML (true minus) and for LaTeX */
const ps=(m,a,dm,da)=>`${fm(m,dm)}∠${neg(wrap(a),da)}°`;
const rs=(re,im,d)=>`${neg(re,d)} ${im<0&&!isZ(im,d)?'−':'+'} j${fm(Math.abs(im),d)}`;
const lps=(m,a,dm,da)=>`${fm(m,dm)}\\angle ${ltx(wrap(a),da)}^\\circ`;
const lrs=(re,im,d)=>`${ltx(re,d)} ${im<0&&!isZ(im,d)?'-':'+'} j${fm(Math.abs(im),d)}`;
const zs=(z,d)=>rs(z.re,z.im,d);

/* ---------- styles used only by this file (CSS variables only) ---------- */
(function css(){if(typeof document==='undefined'||document.getElementById('c2u2-css'))return;const s=document.createElement('style');s.id='c2u2-css';s.textContent=`
.k3-sl{display:flex;flex-direction:column;gap:2px;font-size:13.5px;margin-top:10px;flex:1 1 170px;min-width:140px}
.k3-sl .k3-h{display:flex;justify-content:space-between;gap:8px;align-items:baseline}
.k3-sl b{font-family:var(--mono);direction:ltr;unicode-bidi:isolate;color:var(--blue-ink);font-size:14px}
.k3-sl input[type=range]{width:100%;accent-color:var(--blue);direction:ltr;margin:4px 0}
.k3-row{display:flex;gap:10px 14px;flex-wrap:wrap;margin-top:10px;align-items:center}
.k3-row .sub{margin:0}
.k3-sls{display:flex;gap:4px 16px;flex-wrap:wrap}
.k3-ph{border:1px solid var(--line);border-radius:10px;padding:4px 10px 8px;margin-top:8px}
.k3-ph h4{margin:4px 0 0;font-size:13.5px}
.k3-q{border:1px solid var(--line);border-radius:12px;padding:10px 14px;margin:10px 0;background:var(--surface)}
.k3-q summary{cursor:pointer;font-weight:600;line-height:1.7}
.k3-ans{margin-top:8px;border-inline-start:3px solid var(--blue);padding:6px 12px;background:var(--blue-soft);border-radius:0 10px 10px 0}
.k3-tbl{overflow-x:auto;max-width:100%}
.k3-tbl table.tt td,.k3-tbl table.tt th{padding:6px 6px}
.k3-tbl tr.cur td{background:var(--live-soft);font-weight:700}
.k3-chip{display:inline-block;padding:2px 10px;border-radius:999px;font-size:12.5px;font-weight:700;background:var(--surface-2);color:var(--muted)}
.k3-chip.ok{background:var(--on-soft);color:var(--on)}
.k3-chip.ld{background:var(--blue-soft);color:var(--blue-ink)}
.k3-chip.warn{background:var(--stop-soft);color:var(--stop)}
.k3-chip.hot{background:var(--live-soft);color:var(--live)}
.k3-try{margin:6px 0 0;padding-inline-start:20px}
.k3-lab .seg{flex-wrap:wrap;max-width:100%}
.k3-lab .seg button{white-space:nowrap}
.k3-lab .facts{grid-template-columns:repeat(auto-fit,minmax(130px,1fr))}
.k3-lab .fact b{font-size:15.5px}
.k3-figs{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;align-items:end}
.k3-figs figure{margin:0;text-align:center;font-size:13px;color:var(--muted)}
.k3-cmp{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-top:8px}
.k3-cmp div{background:var(--surface-2);border-radius:10px;padding:8px 10px;border:2px solid transparent}
.k3-cmp div.ok{border-color:var(--on)}.k3-cmp div.bad{border-color:var(--stop)}
.k3-cmp span{display:block;font-size:12px;color:var(--muted)}
.k3-cmp b{font:700 15px var(--mono);direction:ltr;unicode-bidi:isolate;display:inline-block}
.k3-zin{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:4px 16px}
.k3-zin .k3-zr{border:1px solid var(--line);border-radius:10px;padding:2px 10px 6px}
.k3-zin .k3-zr h4{margin:6px 0 0;font-size:13.5px;display:flex;justify-content:space-between;gap:6px}
.k3-zin .k3-zr h4 b{font-family:var(--mono);direction:ltr;unicode-bidi:isolate;color:var(--blue-ink)}
`;document.head.appendChild(s)})();

/* ---------- small lab helpers (local copies) ---------- */
function loopOn(el,fn){let last=performance.now();const f=now=>{if(!document.body.contains(el))return;const dt=Math.min(0.05,Math.max(0,(now-last)/1000));last=now;try{fn(dt)}catch(e){console.error(e);return}requestAnimationFrame(f)};requestAnimationFrame(f)}
function stepsUI(host,steps){let i=0;
  const draw=()=>{host.innerHTML=steps.map((s,j)=>`<li class="${j<i?'done':j===i?'cur':''}"><span class="k">${j<i?'✓':j+1}</span><div><h4>${s.t}</h4><p>${s.x}</p>${j===i?`<div class="act">${s.done?'<span class="hint">بانتظار تنفيذك…</span> <button class="btn" data-next>تخطَّ</button>':'<button class="btn primary" data-next>التالي</button>'}</div>`:''}</div></li>`).join('')+
    (i>=steps.length?`<li class="cur"><span class="k">✓</span><div><h4>أحسنت، أنهيت التجربة</h4><p style="display:block">جرّب قيماً أخرى، أو أعد التجربة من أولها.</p><div class="act"><button class="btn" data-restart>إعادة التجربة</button></div></div></li>`:'');B.math(host)};
  host.addEventListener('click',e=>{if(e.target.closest('[data-next]')){i++;draw()}if(e.target.closest('[data-restart]')){i=0;draw()}});draw();
  return {check(){const s=steps[i];if(s&&s.done&&s.done()){i++;draw()}},redraw:draw,get i(){return i}};}
const sl=(id,label,min,max,step,val)=>`<label class="k3-sl"><span class="k3-h"><span>${label}</span><b id="${id}-v"></b></span><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}" aria-label="${label.replace(/<[^>]+>/g,'')}"></label>`;
const segHTML=(attr,items,cur)=>`<div class="seg" role="group">${items.map(([v,l])=>`<button data-${attr}="${v}" aria-pressed="${String(v)===String(cur)}">${l}</button>`).join('')}</div>`;
const segSet=(el,attr,v)=>el.querySelectorAll(`[data-${attr}]`).forEach(b=>b.setAttribute('aria-pressed',String(String(b.dataset[attr])===String(v))));
const segBind=(el,attr,fn)=>el.querySelectorAll(`[data-${attr}]`).forEach(b=>b.addEventListener('click',()=>{segSet(el,attr,b.dataset[attr]);fn(b.dataset[attr])}));
const swHTML=(id,b,label,on)=>`<button class="sw" id="${id}" aria-pressed="${on?'true':'false'}"><span class="knob"></span><b>${b}</b><small>${label}</small></button>`;
const fact=(l,id)=>`<div class="fact"><span>${l}</span><b id="${id}">—</b></div>`;
const tryList=items=>`<div class="callout"><b>جرّب:</b><ol class="k3-try">${items.map(x=>`<li>${x}</li>`).join('')}</ol></div>`;
const arT=(x,y,s,o)=>{o=o||{};return `<text class="txt ar" x="${x}" y="${y}" text-anchor="${o.a||'middle'}"${o.fs?` font-size="${o.fs}"`:''}${o.col?` style="fill:var(${o.col})"`:''}>${s}</text>`};
const sb=(b,x)=>`${b}<tspan font-size="9" dy="4">${x}</tspan><tspan dy="-4"></tspan>`;
const ct=(x,y,s,col,a,fs)=>`<text class="txt" x="${fx(x)}" y="${fx(y)}" text-anchor="${a||'middle'}"${fs?` font-size="${fs}"`:''} style="fill:var(${col||'--fg'})">${s}</text>`;
const box=(svg,max)=>`<div class="svgbox" style="margin-inline:auto;${max?`max-width:${max}px`:''}">${svg}</div>`;
const Q=(n,q,ans)=>`<details class="k3-q"><summary>${n}: ${q}</summary><div class="k3-ans"><b>إجابة مقترحة (ليست من الكتاب):</b> ${ans}</div></details>`;
const PC=['--blue','--live','--stop'];     // phase colours A, B, C
function arrow(x1,y1,x2,y2,col,w,dash){w=w||2.4;const a=Math.atan2(y2-y1,x2-x1),L=Math.hypot(x2-x1,y2-y1);if(L<3)return '';const h=Math.min(11,L*0.6)+w;
  const bx=x2-h*Math.cos(a),by=y2-h*Math.sin(a),px=-Math.sin(a)*h*0.45,py=Math.cos(a)*h*0.45;
  return `<path d="M${fx(x1)} ${fx(y1)}L${fx(bx)} ${fx(by)}" stroke="var(${col})" stroke-width="${w}" fill="none" stroke-linecap="round"${dash?` stroke-dasharray="${dash}"`:''}/><path d="M${fx(x2)} ${fx(y2)}L${fx(bx+px)} ${fx(by+py)}L${fx(bx-px)} ${fx(by-py)}Z" fill="var(${col})"/>`}
const dbl=(x1,y1,x2,y2,col)=>arrow((x1+x2)/2,(y1+y2)/2,x1,y1,col||'--fg',1.4)+arrow((x1+x2)/2,(y1+y2)/2,x2,y2,col||'--fg',1.4);
/* inductor (loops) between two points */
function ind(x1,y1,x2,y2,n,col,lead){n=n||4;const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy),ux=dx/len,uy=dy/len;const ld=len*(lead==null?0.2:lead),seg=(len-2*ld)/n,r=seg/2;
  let p=`M${fx(x1)} ${fx(y1)}L${fx(x1+ux*ld)} ${fx(y1+uy*ld)}`;for(let i=1;i<=n;i++){p+=`A${fx(r)} ${fx(r)} 0 0 1 ${fx(x1+ux*(ld+seg*i))} ${fx(y1+uy*(ld+seg*i))}`}
  return `<path class="w" ${col?`style="stroke:var(${col})"`:''} d="${p}L${fx(x2)} ${fx(y2)}"/>`}
/* impedance box between two points; label on side s (+1/-1) */
function zb(x1,y1,x2,y2,lab,o){o=o||{};const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy),ux=dx/len,uy=dy/len,nx=-uy,ny=ux,mx=(x1+x2)/2,my=(y1+y2)/2,hw=o.w||20,hh=7,a=Math.atan2(dy,dx)/D;
  const cls=o.cls||'';let s=`<path class="w ${cls}" d="M${fx(x1)} ${fx(y1)}L${fx(mx-ux*hw)} ${fx(my-uy*hw)}M${fx(mx+ux*hw)} ${fx(my+uy*hw)}L${fx(x2)} ${fx(y2)}"/>`;
  s+=`<rect x="${fx(mx-hw)}" y="${fx(my-hh)}" width="${2*hw}" height="${2*hh}" rx="2" transform="rotate(${fx(a)} ${fx(mx)} ${fx(my)})" fill="${o.fill||'var(--surface)'}" stroke="var(${o.col||'--fg'})" stroke-width="1.8"/>`;
  if(lab){const sd=o.side||1,off=o.off||20;s+=ct(mx+nx*off*sd,my+ny*off*sd+4,lab,o.lcol||'--fg',o.anchor||'middle',o.fs)}
  return s}
const dot=(x,y,r)=>`<circle cx="${fx(x)}" cy="${fx(y)}" r="${r||3.4}" fill="var(--fg)"/>`;
const term=(x,y)=>`<circle cx="${fx(x)}" cy="${fx(y)}" r="4.5" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.8"/>`;
/* small arrow ON a line segment at fraction f (current direction) */
const onArrow=(x1,y1,x2,y2,f,col,len)=>{len=len||22;const L=Math.hypot(x2-x1,y2-y1),ux=(x2-x1)/L,uy=(y2-y1)/L,mx=x1+(x2-x1)*f,my=y1+(y2-y1)*f;return arrow(mx-ux*len/2,my-uy*len/2,mx+ux*len/2,my+uy*len/2,col||'--blue',2.2)};
/* simple SVG x-y plot. o:{w,h,x0,x1,y0,y1,xt,yt,xl,yl,series:[{pts,col,w,dash}],extra(X,Y)} */
function plotSVG(o){const W=o.w||520,H=o.h||260,L=o.left||50,R=14,T=14,Bm=36;
  const X=x=>L+(x-o.x0)/(o.x1-o.x0)*(W-L-R),Y=y=>H-Bm-(y-o.y0)/(o.y1-o.y0)*(H-T-Bm);
  let s='';(o.yt||[]).forEach(v=>{s+=`<path d="M${L} ${fx(Y(v))}H${W-R}" stroke="var(--line)"/>`+S.t(L-6,fx(Y(v)+4),o.yf?o.yf(v):v,'m','end')});
  (o.xt||[]).forEach(v=>{s+=`<path d="M${fx(X(v))} ${T}V${H-Bm}" stroke="var(--line)" stroke-dasharray="3 3"/>`+S.t(fx(X(v)),H-Bm+15,o.xf?o.xf(v):v,'m')});
  s+=`<path d="M${L} ${T}V${H-Bm}H${W-R}" stroke="var(--fg)" fill="none" stroke-width="1.4"/>`;
  if(o.y0<0&&o.y1>0)s+=`<path d="M${L} ${fx(Y(0))}H${W-R}" stroke="var(--fg)" stroke-width="1"/>`;
  if(o.xl)s+=S.t(W-R,H-4,o.xl,'','end');if(o.yl)s+=S.t(L+4,T+10,o.yl,'','start');
  if(o.under)s+=o.under(X,Y);
  (o.series||[]).forEach(se=>{if(!se.pts.length)return;s+=`<path d="${se.pts.map((p,i)=>(i?'L':'M')+fx(X(p[0]))+' '+fx(Y(clamp(p[1],o.y0-1e6,o.y1+1e6)))).join('')}" fill="none" stroke="var(${se.col})" stroke-width="${se.w||2.4}" ${se.dash?`stroke-dasharray="${se.dash}"`:''} stroke-linejoin="round"/>`});
  if(o.extra)s+=o.extra(X,Y);
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${o.aria||'منحنى'}">${s}</svg>`}
const niceMax=t=>{t=Math.max(t,1e-9);const e=Math.pow(10,Math.floor(Math.log10(t)));return [1,1.5,2,2.5,3,4,5,6,8,10].map(k=>k*e).find(v=>v>=t-1e-12)};

/* ---------- phasor diagram: list [{z,from,col,w,dash,lab}] ---------- */
function phasorSVG(list,o){o=o||{};const W=o.w||340,H=o.h||W,cx=o.cx==null?W/2:o.cx,cy=o.cy==null?H/2:o.cy;
  let mx=o.max||0;if(!mx)list.forEach(v=>{const f=v.from||C(0,0);mx=Math.max(mx,cabs(f),cabs(cadd(f,v.z)))});mx=mx||1;
  const k=(Math.min(W,H)/2-(o.pad||34))/mx,X=z=>cx+z.re*k,Y=z=>cy-z.im*k;
  let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${o.aria||'مخطط طوري'}">`;
  s+=`<path d="M${o.pad?8:10} ${fx(cy)}H${W-10}M${fx(cx)} 10V${H-10}" stroke="var(--line)" stroke-width="1"/>`;
  if(o.circle)s+=`<circle cx="${fx(cx)}" cy="${fx(cy)}" r="${fx(o.circle*k)}" fill="none" stroke="var(--line)" stroke-dasharray="4 4"/>`;
  if(o.under)s+=o.under(X,Y,k);
  (o.arcs||[]).forEach(a=>{const r=a.r,p1=pol(r/k,a.a1),p2=pol(r/k,a.a2),mid=pol((r+14)/k,(a.a1+a.a2)/2);const large=Math.abs(a.a2-a.a1)>180?1:0,sw=a.a2>a.a1?0:1;
    s+=`<path d="M${fx(X(p1))} ${fx(Y(p1))}A${r} ${r} 0 ${large} ${sw} ${fx(X(p2))} ${fx(Y(p2))}" fill="none" stroke="var(--muted)" stroke-width="1.2"/>`+ct(X(mid),Y(mid)+4,a.lab,'--muted','middle',11)});
  list.forEach(v=>{const f=v.from||C(0,0),t=cadd(f,v.z);s+=arrow(X(f),Y(f),X(t),Y(t),v.col||'--fg',v.w||2.4,v.dash);
    if(v.lab){const u=cabs(v.z)>1e-9?csc(v.z,1/cabs(v.z)):C(1,0);const off=v.loff||15;let lx=X(t)+u.re*off+(v.ldx||0),ly=Y(t)-u.im*off+4+(v.ldy||0);
      if(v.lmid){const m=cadd(f,csc(v.z,0.5));lx=X(m)-u.im*14;ly=Y(m)-u.re*14+4}
      s+=ct(lx,ly,v.lab,v.lcol||v.col||'--fg',Math.abs(u.re)<0.3?'middle':u.re>0?'start':'end',12)}});
  if(o.extra)s+=o.extra(X,Y,k);
  return s+'</svg>'}

/* ---------- star / delta three-phase system drawing ----------
 o={gen:'Y'|'none', load:'Y'|'D', src:[a,b,c] labels, srcSym:'coil'|'circle', z:[..3] labels (Y: an,bn,cn | D: ab,bc,ca),
    lineZ:label, neutral:'none'|'dash'|'sw', nOn, cur:{A,B,C,N}, curL:[..3] load-branch current labels, vab:label (double arrow A–B at left),
    names:{A,B,C,N,a,b,c,n}, flow:bool, hl:{a,b,c} highlight colours, lab2:[...] 2nd line under z labels } */
function sysSVG(o){o=o||{};const nm=Object.assign({A:'A',B:'B',C:'C',N:'N',a:'a',b:'b',c:'c',n:'n'},o.names||{});
  const fl=o.flow?'live':'';
  const N=[120,170],GA=[120,70],GB=[206.6,220],GC=[33.4,220];
  const n=[560,170],LA=[560,70],LB=[646.6,220],LC=[473.4,220];
  const yA=40,yB=300,yC=330;const x0=o.gen==='none'?60:null;
  let s=`<svg viewBox="0 0 700 360" role="img" aria-label="${o.aria||'نظام ثلاثي الأطوار'}">`;
  // generator
  if(o.gen!=='none'){
    const coil=(P,col,lab,k)=>{let r='';if(o.srcSym==='circle'){const mx=(N[0]+P[0])/2,my=(N[1]+P[1])/2;r+=`<path class="w" d="M${N[0]} ${N[1]}L${fx(P[0])} ${fx(P[1])}"/><circle cx="${fx(mx)}" cy="${fx(my)}" r="15" fill="var(--surface)" stroke="var(${col})" stroke-width="2"/>`+S.t(fx(mx),fx(my+4),'~','')}
      else r+=ind(N[0],N[1],P[0],P[1],4,col,0.18);
      const ux=(P[0]-N[0])/100,uy=(P[1]-N[1])/100;r+=ct(P[0]-ux*22+(k===0?12:k===1?-2:2),P[1]-uy*22+(k===0?0:-10),'+','--fg',k===0?'start':k===1?'end':'start',13);
      if(lab){const L=(o.srcSym==='circle'?[[98,124,'end'],[190,190,'start'],[48,252,'start']]:[[108,124,'end'],[178,188,'start'],[48,252,'start']])[k];r+=ct(L[0],L[1],lab,col,L[2],11.5)}
      return r};
    s+=coil(GA,PC[0],o.src&&o.src[0],0)+coil(GB,PC[1],o.src&&o.src[1],1)+coil(GC,PC[2],o.src&&o.src[2],2)+dot(N[0],N[1])+S.t(N[0]-14,N[1]+4,nm.N,'','end');
    s+=S.t(GA[0]-10,GA[1]-4,nm.A,'','end')+S.t(GB[0]+8,GB[1]+4,nm.B,'','start')+S.t(GC[0]-8,GC[1]+4,nm.C,'','end');
    s+=`<path class="w ${fl}" d="M${GA[0]} ${GA[1]}V${yA}H${LA[0]}V${LA[1]}"/>`;
    s+=`<path class="w ${fl}" d="M${fx(GB[0])} ${GB[1]}V${yB}H${fx(LB[0])}V${LB[1]}"/>`;
    s+=`<path class="w ${fl}" d="M${fx(GC[0])} ${GC[1]}V${yC}H${fx(LC[0])}V${yB+7}A7 7 0 0 0 ${fx(LC[0])} ${yB-7}V${LC[1]}"/>`;
  }else{
    s+=`<path class="w ${fl}" d="M${x0} ${yA}H${LA[0]}V${LA[1]}"/><path class="w ${fl}" d="M${x0} ${yB}H${fx(LB[0])}V${LB[1]}"/><path class="w ${fl}" d="M${x0} ${yC}H${fx(LC[0])}V${yB+7}A7 7 0 0 0 ${fx(LC[0])} ${yB-7}V${LC[1]}"/>`;
    s+=term(x0,yA)+term(x0,yB)+term(x0,yC)+S.t(x0-10,yA+4,nm.A,'','end')+S.t(x0-10,yB+4,nm.B,'','end')+S.t(x0-10,yC+4,nm.C,'','end');
  }
  if(o.vab){s+=dbl(100,yA+6,100,yB-6)+S.t(108,(yA+yB)/2+4,o.vab,'b','start')}
  // line impedances
  if(o.lineZ){[[yA,300],[yB,440],[yC,300]].forEach(([y,x])=>{s+=`<rect x="${x}" y="${y-7}" width="40" height="14" rx="2" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.8"/>`+ct(x+20,y-11,o.lineZ,'--fg','middle',11.5)})}
  // line currents
  const cur=o.cur||{};
  if(cur.A)s+=arrow(230,yA,262,yA,'--blue',2.2)+ct(246,yA-8,cur.A,'--blue-ink','middle',12);
  if(cur.B)s+=arrow(380,yB,412,yB,'--blue',2.2)+ct(396,yB-8,cur.B,'--blue-ink','middle',12);
  if(cur.C)s+=arrow(380,yC,412,yC,'--blue',2.2)+ct(396,yC+18,cur.C,'--blue-ink','middle',12);
  // neutral
  if(o.neutral&&o.neutral!=='none'&&o.gen!=='none'){const on=o.neutral==='dash'||o.nOn;
    if(o.neutral==='dash')s+=`<path class="w" d="M${N[0]} ${N[1]}H${n[0]}" stroke-dasharray="7 5"/>`;
    else{s+=`<path class="w ${on?fl:''}" d="M${N[0]} ${N[1]}H322M358 ${N[1]}H${n[0]}"/>`+dot(322,N[1],3)+dot(358,N[1],3)+(on?`<path class="w ${fl}" d="M322 ${N[1]}H358"/>`:`<path class="w" d="M322 ${N[1]}L354 ${N[1]-16}"/>`)+arT(340,N[1]-22,on?'الحيادي موصول':'الحيادي مفصول',{fs:11.5,col:on?'--muted':'--stop'})}
    if(cur.N&&on)s+=arrow(470,N[1],438,N[1],'--stop',2.2)+ct(454,N[1]+18,cur.N,'--stop','middle',12);
  }
  // load
  const hl=o.hl||{};
  if(o.load==='Y'){const br=[[LA,0],[LB,1],[LC,2]];
    br.forEach(([P,i])=>{s+=zb(n[0],n[1],P[0],P[1],i===0?(o.z&&o.z[i]):'',{side:-1,off:26,anchor:'end',col:hl[i]||'--fg',lcol:'--fg'})});
    if(o.z){if(o.z[1])s+=ct(640,262,o.z[1],'--fg','end',11.5);if(o.z[2])s+=ct(479,250,o.z[2],'--fg','start',11.5)}
    if(o.curL)br.forEach(([P,i])=>{if(o.curL[i])s+=onArrow(P[0],P[1],n[0],n[1],0.2,'--blue',18)});
    if(o.vL)s+=o.vL;
    s+=dot(n[0],n[1])+S.t(n[0]+12,n[1]+16,nm.n,'','start');
  }else if(o.load==='D'){const sides=[[LA,LB,0,1,'start'],[LB,LC,1,1,'middle'],[LC,LA,2,1,'end']];
    sides.forEach(([P1,P2,i,sd,an])=>{s+=zb(P1[0],P1[1],P2[0],P2[1],o.z&&o.z[i],{side:-1,off:i===1?24:26,anchor:i===0?'start':i===2?'end':'middle',col:hl[i]||'--fg'})});
    if(o.curL){const cl=o.curL;   // arrows just inside each side, in the book's directions a→b, b→c, c→a
      if(cl[0])s+=onArrow(LA[0]-13,LA[1]+7.5,LB[0]-13,LB[1]+7.5,0.32,'--blue',20)+ct(590,112,cl[0],'--blue-ink','end',12);
      if(cl[1])s+=onArrow(LB[0],LB[1]-14,LC[0],LC[1]-14,0.32,'--blue',20)+ct(600,196,cl[1],'--blue-ink','end',12);
      if(cl[2])s+=onArrow(LC[0]+13,LC[1]+7.5,LA[0]+13,LA[1]+7.5,0.68,'--blue',20)+ct(530,112,cl[2],'--blue-ink','start',12)}
  }
  s+=dot(LA[0],LA[1])+dot(LB[0],LB[1])+dot(LC[0],LC[1]);
  s+=S.t(LA[0]+10,LA[1]-6,nm.a,'','start')+S.t(LB[0]+10,LB[1]+4,nm.b,'','start')+S.t(LC[0]-10,LC[1]+4,nm.c,'','end');
  if(o.extra)s+=o.extra;
  return s+'</svg>'}

/* ======================================================================
   Lesson 1 — unit cover, description of the system, generation, sequence (ص 75–79)
   ====================================================================== */
/* الشكل (2-1) right part: stator with 6 slots (a c' b a' c b' clockwise from top) and a 2-pole rotor.
   o={thN: N-pole angle clockwise from top (deg), v:[va,vb,vc] instantaneous signs (optional)} */
const SLOTS=[['a',0,0,1],["c'",60,2,-1],['b',120,1,1],["a'",180,0,-1],['c',240,2,1],["b'",300,1,-1]];
function genSVG(o){o=o||{};const cx=150,cy=150,th=o.thN==null?0:o.thN,v=o.v;
  const P=(r,a)=>[cx+r*Math.sin(a*D),cy-r*Math.cos(a*D)];
  let s=`<svg viewBox="0 0 300 300" role="img" aria-label="مولد ثلاثي الأطوار">`;
  s+=`<circle cx="${cx}" cy="${cy}" r="126" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.6"/><circle cx="${cx}" cy="${cy}" r="94" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/>`;
  // dashed 120° lines (as in the book)
  [0,120,240].forEach(a=>{const [x,y]=P(86,a);s+=`<path d="M${cx} ${cy}L${fx(x)} ${fx(y)}" stroke="var(--muted)" stroke-dasharray="4 4"/>`});
  // rotor
  s+=`<g transform="rotate(${fx(th)} ${cx} ${cy})"><path d="M${cx-30} ${cy-30}V${cy-80}Q${cx} ${cy-92} ${cx+30} ${cy-80}V${cy-30}Z" fill="var(--stop-soft)" stroke="var(--stop)" stroke-width="2"/>
    <path d="M${cx-30} ${cy+30}V${cy+80}Q${cx} ${cy+92} ${cx+30} ${cy+80}V${cy+30}Z" fill="var(--blue-soft)" stroke="var(--blue)" stroke-width="2"/>
    <circle cx="${cx}" cy="${cy}" r="40" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.4"/><circle cx="${cx}" cy="${cy}" r="7" fill="var(--fg)"/>
    <text class="txt" x="${cx}" y="${cy-56}" text-anchor="middle" font-size="18" style="fill:var(--stop)">N</text><text class="txt" x="${cx}" y="${cy+70}" text-anchor="middle" font-size="18" style="fill:var(--blue-ink)">S</text></g>`;
  // slots + conductors
  SLOTS.forEach(([lab,a,ph,sg])=>{const [x,y]=P(103,a),[lx,ly]=P(140,a);const col=PC[ph];
    s+=`<circle cx="${fx(x)}" cy="${fx(y)}" r="9.5" fill="var(--surface)" stroke="var(${col})" stroke-width="2.6"/>`;
    if(v){const e=v[ph]*sg;if(Math.abs(e)>0.08){if(e>0)s+=`<circle cx="${fx(x)}" cy="${fx(y)}" r="3.4" fill="var(${col})"/>`;else s+=`<path d="M${fx(x-4.5)} ${fx(y-4.5)}L${fx(x+4.5)} ${fx(y+4.5)}M${fx(x+4.5)} ${fx(y-4.5)}L${fx(x-4.5)} ${fx(y+4.5)}" stroke="var(${col})" stroke-width="2.2"/>`}}
    s+=ct(lx,ly+5,lab,col,'middle',14)});
  return s+'</svg>'}
/* small static phasor sets for الشكل (2-1) and (2-3) */
function seqPhasor(order,o){o=o||{};const ang={A:0,B:order==='ABC'?-120:120,C:order==='ABC'?120:-120};const nm=o.nm||{A:'Va',B:'Vb',C:'Vc'};
  const list=['A','B','C'].map((k,i)=>({z:pol(1,ang[k]),col:PC[i],w:2.6,lab:nm[k]}));
  return phasorSVG(list,{w:o.w||220,h:o.h||200,max:1,pad:o.pad||40,arcs:o.arcs?[{a1:0,a2:120,r:30,lab:'120°'},{a1:120,a2:240,r:30,lab:'120°'},{a1:240,a2:360,r:30,lab:'120°'}]:null,aria:o.aria})}
/* الشكل (2-2): waveforms (α from 0 to 4π) */
const PI_LB={0:'0',120:'2π/3',240:'4π/3',360:'2π',480:'8π/3',600:'10π/3',720:'4π'};
function wavesSVG(o){o=o||{};const Vm=o.Vm||1,dir=o.dir||1,ym=o.ym||Vm;const ser=[0,1,2].map(k=>{const pts=[];for(let i=0;i<=360;i++){const a=i*2;pts.push([a,Vm*Math.sin((a-dir*120*k)*D)])}return {pts,col:PC[k],w:2.2,dash:k===1?'2 4':k===2?'10 5':null}});
  return plotSVG({w:o.w||640,h:o.h||230,x0:0,x1:720,y0:-ym*1.1,y1:ym*1.1,xt:[0,120,240,360,480,600,720],xf:v=>PI_LB[v],yt:o.yt||[-ym,0,ym],yf:o.yf||(v=>v===0?'0':v>0?'+Vm':'−Vm'),xl:'α',yl:o.yl||'v',series:ser,
    extra:(X,Y)=>{let e=['VAA\'','VBB\'','VCC\''].map((l,k)=>ct(X(((90+dir*120*k)%360+360)%360),Y(Vm)-6,l,PC[k],'middle',11.5)).join('');if(o.extra)e+=o.extra(X,Y);return e},aria:'موجات جهود نظام ثلاثي الأطوار'})}

B.lesson({
 id:'u2-l1',unit:2,order:1,pages:'75–79',
 title:'مدخل إلى النظام ثلاثي الأطوار: التوليد والتمثيل وتتابع الأطوار',
 summary:'ما النظام ثلاثي الأطوار ولماذا يفضَّل، وكيف يولّد المولد ثلاثة جهود متساوية بينها 120°، وكيف نمثلها بموجات وبمطاورات، ومعنى تتابع الأطوار A-B-C وكيف ينعكس بعكس اتجاه الدوران.',
 theory:[
  {h:'الوحدة الثانية: دوائر التيار المتردد ثلاثية الأطوار',ref:'ص 75–76',html:`<p><b>الهدف العام للوحدة:</b> «معرفة الخطوات المستعملة لتحليل دوائر التيار المتردد البسيطة.»</p>
   <p><b>الأهداف التفصيلية:</b></p>
   <ol><li>أن يلم المتدرب بكيفية توليد الجهود ثلاثية الأوجه.</li><li>أن يلم المتدرب بالعلاقة بين قيم الخط وقيم الوجه للتيار والجهد في حالتي التوصيل نجمة ودلتا.</li><li>أن يلم المتدرب بكيفية حساب القدرة في الأحمال ثلاثية الأوجه.</li><li>أن يلم المتدرب بكيفية استخدام جهاز واتميتر لقياس القدرة في الأحمال ثلاثية الأوجه.</li></ol>
   <p>تتكون الوحدة من فصلين: <b>الفصل الأول</b> «وصف نظام التيار المتردد ثلاثي الأطوار وتحليل دوائره» (ص 77–90)، و<b>الفصل الثاني</b> «القدرة في دوائر التيار المتردد ثلاثي الأطوار في حالة التحميل المتماثل» (ص 91–94)، ثم مسائل الوحدة (ص 95–96).</p>
   <div class="k3-tbl"><table class="tt"><thead><tr><th>الدرس</th><th>الموضوع</th><th>الصفحات</th></tr></thead><tbody>
   <tr><td>1 (هذا الدرس)</td><td>وصف النظام، توليد الجهود، تمثيلها وتتابعها</td><td>75–79</td></tr>
   <tr><td>2</td><td>توصيلتا النجمة والدلتا، توصيلات الأحمال والتيار الحيادي</td><td>80–87</td></tr>
   <tr><td>3</td><td>التحويل من نجمة إلى دلتا والعكس</td><td>87–90</td></tr>
   <tr><td>4</td><td>القدرة وقياسها بطريقة الواتميترين، ومسائل الوحدة</td><td>91–96</td></tr></tbody></table></div>`},
  {err:'الهدف العام المطبوع للوحدة (ص 76) «معرفة الخطوات المستعملة لتحليل دوائر التيار المتردد البسيطة» لا يطابق موضوع الوحدة (الأنظمة ثلاثية الأطوار)، ويبدو منقولاً من الوحدة الأولى. الأهداف التفصيلية الأربعة هي التي تصف الوحدة. ولا تذكر الصفحة الوقت المتوقع ولا الوسائل.'},
  {h:'2-1 وصف للنظام',ref:'ص 77',html:`<p>«التيار المتردد الذي درسناه إلى الآن يعرف بالتيار <b>أحادي الطور</b> (أو أحادي الوجه). ويتكون النظام المتعدد الأطوار من جهدين متساويين أو أكثر بينهما زوايا طور ثابتة. في النظام ذي الطور الثنائي هناك جهدان متساويان يختلفان في الطور بزاوية مقدارها <b>90 درجة</b>، بينما في النظام ذي الأطوار الثلاثة "ثلاثي الأوجه" يوجد <b>ثلاثة جهود متساوية في المقدار وزاوية فرق الطور بين كل جهدين 120°</b>، أيضاً هناك أنظمة ذات أطوار متعددة تبلغ ستة أطوار أو أكثر وهذه الأنظمة غالباً ما تستخدم في أجهزة تقويم التيار وذلك للحصول على جهد قليل التشوه.»</p>
   <p>«في الواقع معظم المولدات المستعملة في الشبكات تنتج التيار المتردد ثلاثي الأطوار (أو ثلاثي الأوجه)، وهو عبارة عن نظام ذي ثلاثة جهود (أو تيارات) مرتبطة ببعضها البعض. ومن بين أسباب تفضيل هذا النظام كونه <b>يسبب مفاقيد نحاسية في خطوط النقل أقل من النظام أحادي الوجه وذلك لنفس القدرة المنقولة</b>.»</p>
   <p>«ويكون النظام <b>متماثلاً أو (متزناً)</b> عندما تتساوى فيه القيم الفعالة للجهود (والتيارات) الثلاثة وتتقدم زاوية جهد (وتيار) الطور الأول عن زاوية الثاني بـ 120° كما تتقدم هذه الأخيرة عن زاوية الثالث بنفس الزاوية 120°. والنظام المتماثل يؤدي إلى تشغيل مكونات الشبكة وأحمالها الثلاثية الأطوار بطريقة أفضل، ولهذا يتم تصميم الشبكات بحيث تكون في حالة قريبة من النظام المتماثل.»</p>
   <div class="k3-tbl"><table class="tt"><thead><tr><th>النظام</th><th>عدد الجهود</th><th>فرق الطور بين كل جهدين</th></tr></thead><tbody><tr><td>أحادي الطور</td><td>1</td><td>—</td></tr><tr><td>ثنائي الطور</td><td>2 متساويان</td><td>90°</td></tr><tr><td>ثلاثي الأطوار</td><td>3 متساوية</td><td>120°</td></tr><tr><td>ستة أطوار أو أكثر</td><td>6 أو أكثر</td><td>(أجهزة تقويم التيار)</td></tr></tbody></table></div>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> «متزن» يحتاج شرطين معاً: (1) القيم الفعالة الثلاث متساوية، و(2) بين كل طورين 120° بالضبط. لو اختل أحدهما (جهد أقل في طور، أو زاوية غير 120°) صار النظام غير متزن.'},
  {h:'2-2 توليد الجهود ثلاثية الأطوار',ref:'ص 77–78',html:`<p>«يحتوي المولد ثلاثي الأوجه على <b>ثلاث ملفات</b> … بحيث يكون بين كل ملف والآخر زاوية مقدارها <b>120 درجة</b> كما هو موضح في الشكل 2-1 حيث أنه عند دوران المولد الكهربائي تنتج جهود ثلاثية الأوجه ذات <b>تتابع A-B-C</b> وعند <b>عكس اتجاه دوران</b> المولد الكهربائي تكون الجهود ذات <b>تتابع A-C-B</b>. … كما أنه يمكن أن تكون موصلة على شكل نجمة أو دلتا حسب الحاجة. وبما أن الملفات الثلاثة تحتوي على نفس عدد اللفات وتدور بنفس السرعة الزاوية فإن الجهود الناتجة عن طريق الحث المغناطيسي (حسب قانون فاراداي) لها <b>نفس التردد ونفس القيمة العظمى</b>، وتختلف زوايا أطوارها بـ 120° وتعطى هذه الجهود بالمعادلات»</p>
   $$\\begin{aligned}v_{AA'}&=V\\sqrt2\\,\\sin\\omega t\\\\ v_{BB'}&=V\\sqrt2\\,\\sin(\\omega t-120^\\circ)\\\\ v_{CC'}&=V\\sqrt2\\,\\sin(\\omega t-240^\\circ)\\end{aligned}\\qquad (2\\text{-}1)$$
   <p>«حيث A و A' يمثلان طرفي الملف الأول (نفس الشيء بالنسبة لـ B و B' و C و C')، و V هي <b>القيمة الفعالة</b> للجهود والتي تتساوى في الملفات الثلاثة.»</p>`},
  {fig:'(2-1)',ref:'ص 78',caption:'يسار ووسط: مخططان طوريان للجهود الثلاثة (مواضع b و c متبادلة بينهما). يمين: رسم المولد — عضو ثابت عليه ستة مجارٍ a، c\'، b، a\'، c، b\' مع عقارب الساعة، وعضو دوار ذو قطبين N و S، وبين محاور الملفات 120°.',draw:()=>`<div class="k3-figs" style="direction:ltr"><figure>${box(seqPhasor('ACB',{w:200,h:190}),200)}<figcaption dir="rtl">المخطط الأيسر</figcaption></figure><figure>${box(seqPhasor('ABC',{w:200,h:190}),200)}<figcaption dir="rtl">المخطط الأوسط</figcaption></figure><figure>${box(genSVG({thN:0}),240)}<figcaption dir="rtl">المولد</figcaption></figure></div>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب) — أي المخططين لأي تتابع؟</b> الكتاب لا يسمّي المخططين. المطاورات تدور عكس عقارب الساعة، والتتابع هو ترتيب مرورها على خط ثابت. في <b>المخطط الأوسط</b> يأتي بعد V<sub>a</sub> المتجه V<sub>b</sub> (متأخر 120°) ثم V<sub>c</sub>: هذا <b>تتابع A-B-C</b> وهو نفس الشكل 2-3 والمعادلات (2-2). وفي <b>المخطط الأيسر</b> يأتي V<sub>c</sub> أولاً بعد V<sub>a</sub>: هذا <b>تتابع A-C-B</b> (عكس الدوران).'},
  {err:'النص (ص 77) يقول إن الملفات الثلاثة «مثبتة على العضو الدوار» و«تدور في مجال مغناطيسي ثابت»، بينما رسم المولد في الشكل 2-1 يضع الملفات في مجاري <b>العضو الثابت</b> والقطبين N و S على <b>العضو الدوار</b>. الحالتان تعطيان النتيجة نفسها (المهم هو الحركة النسبية بين الملفات والمجال)، والمولدات الكبيرة في الواقع مبنية كما في الشكل. المحاكاة في تبويب «المختبر» مبنية على الشكل.'},
  {h:'2-3 تمثيل الجهود وتتابعها',ref:'ص 78–79',html:`<p>«يبين الشكل 2-2 موجات الجهود ثلاثية الأطوار المستحثة أما الشكل 2-3 فيبين <b>الجهود المطاورة</b> والتي تعطى بالمعادلات»</p>
   $$\\begin{aligned}\\bar V_{AA'}&=V\\angle 0^\\circ\\\\ \\bar V_{BB'}&=V\\angle -120^\\circ\\\\ \\bar V_{CC'}&=V\\angle -240^\\circ=V\\angle 120^\\circ\\end{aligned}\\qquad (2\\text{-}2)$$
   <p>«والأحمال المغذاة من طرف المولدات ثلاثية الأطوار تحتوي على ثلاثة فروع وتكون <b>متزنة إذا تساوت معاوقات فروعها الثلاثة</b>.»</p>`},
  {fig:'(2-2)',ref:'ص 79',caption:'موجات جهود نظام ثلاثي الأطوار: V<sub>AA\'</sub> (متصل) يبدأ من الصفر صاعداً عند α = 0، و V<sub>BB\'</sub> (منقط) يعبر الصفر صاعداً عند 2π/3، و V<sub>CC\'</sub> (متقطع) عند 4π/3.',draw:()=>box(wavesSVG({}),660)},
  {fig:'(2-3)',ref:'ص 79',caption:'الجهود المطاورة لنظام ثلاثي الأطوار: V<sub>AA\'</sub> مرجع أفقي، و V<sub>CC\'</sub> عند 120°، و V<sub>BB\'</sub> عند −120°، وبين كل متجهين 120°.',draw:()=>box(seqPhasor('ABC',{w:260,h:240,arcs:1,nm:{A:"VAA'",B:"VBB'",C:"VCC'"}}),260)},
  {html:`<p>«وكما هو ملاحظ فإن الجهود تتابع (<b>A ثم B ثم C</b>) وذلك لأن الجهد في الملف AA' يمر بقيمته العظمى قبل الملف BB' والجهد في هذا الأخير يمر بقيمته العظمى قبل الملف CC'، ونستطيع <b>تغيير تتابع الجهود بتغيير اتجاه دوران العضو الدوار</b>. وكما هو معلوم فإن معرفة تتابع الجهود له <b>أهمية قصوى في حالة ربط المولدات مع شبكة النقل والتوزيع</b>.» <span class="ref">ص 79</span></p>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b><ul><li>القيمة العظمى لكل جهد = القيمة الفعالة × √2. مثلاً جهد طور فعال <span class="ltr">220 V</span> قيمته العظمى <span class="ltr">220 × 1.414 = 311 V</span>.</li><li>في أي لحظة: مجموع الجهود الثلاثة اللحظية = صفر (عندما يكون أحدها في قمته الموجبة يكون الآخران عند نصف القمة سالبين). سيذكر الكتاب ذلك للمطاورات في ص 81، ويمكنك التحقق منه في المختبر.</li><li>تغيير التتابع عملياً يكون بتبديل طرفين من الأطراف الثلاثة؛ وهو ما يعكس اتجاه دوران المحرك ثلاثي الأطوار الموصول بالشبكة.</li></ul>'},
  {h:'ملاحظات على الكتاب',html:`<ul><li>ص 76: الهدف العام للوحدة لا يطابق موضوعها (انظر أعلاه).</li><li>ص 77–78: النص يضع الملفات على العضو الدوار، والشكل 2-1 يضعها في العضو الثابت.</li><li>ص 78: المخططان الطوريان في الشكل 2-1 بلا تسمية؛ أضفنا توضيحاً بأيهما A-B-C وأيهما A-C-B.</li><li>أرقام صفحات الوحدة الثانية في الفهرس (ص 3–4) أعلى من الفعلي بصفحة أو صفحتين؛ أرقام الصفحات هنا هي المطبوعة في تذييل الصفحات.</li></ul>`}
 ],
 lab:(el)=>{
  let alpha=0,run=false,dir=1,V=220,f=50,pv='rot',sp=60;const peaks=[];const did={};
  el.innerHTML=`<div class="grid k3-lab">
   <div class="panel c5"><h2>المولد <small>مبني على الشكل (2-1) ص 78</small></h2>
    <div class="svgbox" id="g1gen" style="max-width:290px;margin-inline:auto"></div>
    <p class="sub">القطب N أحمر. في كل مجرى: نقطة = الجهد اللحظي في الموصل موجب، وعلامة × = سالب. العرض مبطأ جداً (الدورة الحقيقية تستغرق <span id="g1T"></span>).</p>
    <div class="k3-row"><button class="btn primary" id="g1run">تشغيل</button>${segHTML('dir',[[1,'الدوران مع عقارب الساعة'],[-1,'عكس عقارب الساعة']],dir)}</div>
    <div class="k3-sls">${sl('g1sp','سرعة العرض (درجة كل ثانية)',10,180,5,sp)}${sl('g1a','زاوية الدوران α (حرّكها يدوياً)',0,360,1,0)}</div></div>
   <div class="panel c7"><h2>الموجات والمطاورات <small>الشكلان (2-2) و(2-3) والمعادلتان (2-1) و(2-2)</small></h2>
    <div class="k3-row">${sl('g1V','القيمة الفعالة لجهد كل ملف V',0,400,1,V)}<div><div class="sub">التردد</div>${segHTML('f',[[50,lt('50 Hz')],[60,lt('60 Hz')]],f)}</div><div><div class="sub">المطاورات</div>${segHTML('pv',[['rot','دوّارة'],['fix','ثابتة كالشكل (2-3)']],pv)}</div></div>
    <div class="svgbox" id="g1wv"></div>
    <div class="k3-row" style="align-items:flex-start"><div class="svgbox" id="g1ph" style="max-width:250px;flex:1 1 210px;margin-top:0"></div>
     <div style="flex:2 1 250px;min-width:0"><div class="facts">${fact(lt("v<sub>AA'</sub>"),'g1va')}${fact(lt("v<sub>BB'</sub>"),'g1vb')}${fact(lt("v<sub>CC'</sub>"),'g1vc')}${fact('مجموع الثلاثة','g1sum')}${fact('القيمة العظمى V√2','g1vm')}${fact('الزمن t = α/(360 f)','g1t')}</div>
     <div class="k3-row"><span class="sub">ترتيب القمم الأخيرة:</span><span id="g1pk" class="k3-chip"></span><span id="g1chip" class="k3-chip"></span></div></div></div>
    <p class="sub">الخط الرأسي على الموجات = اللحظة الحالية. في المطاورات الدوّارة: إسقاط رأس كل متجه على المحور الرأسي هو الجهد اللحظي.</p></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="g1st"></ol></div></div>`;
  B.math(el);const $=s=>el.querySelector(s);
  const runBtn=()=>{$('#g1run').textContent=run?'إيقاف مؤقت':'تشغيل';$('#g1run').className='btn '+(run?'':'primary')};
  $('#g1run').onclick=()=>{run=!run;if(run)did.ran=0;runBtn()};
  segBind(el,'dir',v=>{dir=+v;peaks.length=0});segBind(el,'f',v=>{f=+v});segBind(el,'pv',v=>{pv=v});
  $('#g1sp').oninput=e=>{sp=+e.target.value};
  $('#g1a').oninput=e=>{run=false;runBtn();alpha=+e.target.value;did.drag=(did.drag||0)+1};
  $('#g1V').oninput=e=>{V=+e.target.value};
  const steps=stepsUI($('#g1st'),[
   {t:'شغّل المولد',x:'اضغط «تشغيل» واترك العضو الدوار يكمل دورة كاملة. راقب الموصلات: كلما مر القطب N أو S على موصل كبر جهده.',done:()=>run&&did.ran>=360},
   {t:'ترتيب القمم: A ثم B ثم C',x:'والدوران مع عقارب الساعة، انتظر حتى يتكرر في «ترتيب القمم» الترتيب <span class="ltr">A → B → C</span>: الجهد v<sub>AA\'</sub> يبلغ قمته أولاً، ثم v<sub>BB\'</sub> بعد 120°، ثم v<sub>CC\'</sub> (ص 79). هذا هو المخطط الأوسط في الشكل 2-1.',done:()=>dir===1&&['ABC','BCA','CAB'].includes(peaks.slice(-3).join(''))},
   {t:'أوقف عند قمة v<sub>AA\'</sub>',x:'حرّك منزلق الزاوية إلى <span class="ltr">α = 90°</span>: v<sub>AA\'</sub> في قمته الموجبة <span class="ltr">V√2</span>، والجهدان الآخران كل منهما نصف القمة سالباً، والمجموع صفر.',done:()=>!run&&Math.abs(alpha-90)<0.5},
   {t:'المجموع صفر دائماً',x:'حرّك منزلق الزاوية إلى أي موضع: مجموع الجهود الثلاثة اللحظية يبقى صفراً (توضيح — ليس من الكتاب).',done:()=>(did.drag||0)>=6},
   {t:'اعكس اتجاه الدوران',x:'اختر «عكس عقارب الساعة» ثم «تشغيل»: يتكرر ترتيب القمم <span class="ltr">A → C → B</span>، أي تتابع A-C-B (ص 78)، وهو المخطط الأيسر في الشكل 2-1.',done:()=>dir===-1&&['ACB','CBA','BAC'].includes(peaks.slice(-3).join(''))},
   {t:'القيمة العظمى',x:'اضبط القيمة الفعالة على <span class="ltr">127 V</span> (جهد طور مثال 2-1-1): القيمة العظمى <span class="ltr">127 × √2 = 179.6 V</span>.',done:()=>V===127}
  ]);
  runBtn();
  loopOn(el,dt=>{
   if(run){const da=sp*dt,a0=alpha;alpha+=da;did.ran=(did.ran||0)+da;
    // peak detection: phase k peaks when (alpha - dir*120k) crosses 90 (mod 360)
    for(let k=0;k<3;k++){const p0=a0-dir*120*k-90,p1=alpha-dir*120*k-90;if(Math.floor(p0/360)!==Math.floor(p1/360))peaks.push('ABC'[k])}
    if(peaks.length>6)peaks.splice(0,peaks.length-6);
    if(alpha>=720)alpha-=720;$('#g1a').value=Math.round(alpha%360)}
   const a=alpha,Vm=V*Math.SQRT2,v=[0,1,2].map(k=>Vm*Math.sin((a-dir*120*k)*D));
   $('#g1gen').innerHTML=genSVG({thN:dir*(a-90),v:v.map(x=>Vm>0?x/Vm:0)});
   const ym=niceMax(Math.max(Vm,1)),a7=a%720;
   $('#g1wv').innerHTML=wavesSVG({Vm:Math.max(Vm,1e-6),dir,ym,yt:[-ym,-ym/2,0,ym/2,ym],yf:x=>neg(x,0),yl:'v (V)',w:640,h:220,
     extra:(X,Y)=>`<path d="M${fx(X(a7))} 14V${220-36}" stroke="var(--fg)" stroke-width="1.6"/>`+v.map((x,k)=>`<circle cx="${fx(X(a7))}" cy="${fx(Y(x))}" r="4.5" fill="var(${PC[k]})" stroke="var(--surface)" stroke-width="1.5"/>`).join('')});
   const list=[0,1,2].map(k=>({z:pol(Math.max(Vm,1e-6),(pv==='rot'?a:0)-dir*120*k),col:PC[k],w:2.6,lab:["VAA'","VBB'","VCC'"][k]}));
   $('#g1ph').innerHTML=phasorSVG(list,{w:250,h:250,max:Math.max(Vm,1e-6),pad:40,circle:Math.max(Vm,1e-6),aria:'المطاورات الثلاثة',
     extra:(X,Y)=>pv!=='rot'?'':list.map((it,k)=>{const t=it.z;return `<path d="M${fx(X(t))} ${fx(Y(t))}H${fx(X(C(0,0)))}" stroke="var(${PC[k]})" stroke-dasharray="3 3" stroke-width="1.2"/><circle cx="${fx(X(C(0,0)))}" cy="${fx(Y(t))}" r="3.6" fill="var(${PC[k]})"/>`}).join('')});
   ['g1va','g1vb','g1vc'].forEach((id,k)=>{$('#'+id).textContent=neg(v[k],1)+' V'});
   const sm=v[0]+v[1]+v[2];$('#g1sum').textContent=neg(Math.abs(sm)<1e-6?0:sm,1)+' V';
   $('#g1vm').textContent=fm(Vm,1)+' V';$('#g1t').textContent=fm(((a%360)/360)/f*1000,2)+' ms';$('#g1T').textContent=fm(1000/f,0)+' ms';
   $('#g1sp-v').textContent=sp+'°/s';$('#g1a-v').textContent=Math.round(a%360)+'°';$('#g1V-v').textContent=V+' V';
   const pk=peaks.slice(-6);$('#g1pk').textContent=pk.length?pk.join(' → '):'—';$('#g1pk').style.direction='ltr';
   const ch=$('#g1chip');ch.className='k3-chip '+(dir===1?'ok':'hot');ch.textContent=dir===1?'التتابع A-B-C':'التتابع A-C-B';
   steps.check()});
 },
 quiz:[
  {q:'في النظام ثلاثي الأطوار المتزن تكون الجهود الثلاثة:',o:['مختلفة المقدار وبينها 90°','متساوية المقدار وبين كل جهدين 120°','متساوية المقدار وفي طور واحد','متساوية المقدار وبين كل جهدين 60°'],c:1,e:'ص 77.'},
  {q:'في النظام ذي الطور الثنائي فرق الطور بين الجهدين:',o:['120°','180°','90°','60°'],c:2,e:'ص 77.'},
  {q:'من أسباب تفضيل النظام ثلاثي الأطوار في الشبكات:',o:['لا يحتاج إلى مولدات','مفاقيده النحاسية في خطوط النقل أقل من أحادي الوجه لنفس القدرة المنقولة','تردده أعلى','لا يحتاج إلى عوازل'],c:1,e:'ص 77.'},
  {q:'إذا كان \\(v_{AA\'}=V\\sqrt2\\sin\\omega t\\) فإن \\(v_{BB\'}\\) في التتابع A-B-C هو:',o:['\\(V\\sqrt2\\sin(\\omega t+120^\\circ)\\)','\\(V\\sqrt2\\sin(\\omega t-120^\\circ)\\)','\\(V\\sqrt2\\cos\\omega t\\)','\\(V\\sin(\\omega t-240^\\circ)\\)'],c:1,e:'المعادلة (2-1) ص 78.'},
  {q:'المطاور \\(V\\angle -240^\\circ\\) يساوي:',o:['\\(V\\angle 240^\\circ\\)','\\(V\\angle -120^\\circ\\)','\\(V\\angle 120^\\circ\\)','\\(V\\angle 0^\\circ\\)'],c:2,e:'المعادلة (2-2): \\(-240^\\circ+360^\\circ=120^\\circ\\).'},
  {q:'كيف نغيّر تتابع الجهود من A-B-C إلى A-C-B في المولد؟',o:['بزيادة السرعة','بعكس اتجاه دوران العضو الدوار','بتغيير عدد اللفات','بزيادة المجال'],c:1,e:'ص 78–79.'},
  {q:'قيمة V في المعادلات (2-1) هي:',o:['القيمة العظمى','القيمة الفعالة','القيمة المتوسطة','القيمة اللحظية'],c:1,e:'ص 78: V هي القيمة الفعالة، والقيمة العظمى V√2.'},
  {q:'متى يكون الحمل ثلاثي الأطوار متزناً؟',o:['إذا تساوت معاوقات فروعه الثلاثة','إذا كان موصلاً نجمة','إذا كان موصلاً دلتا','إذا كان مقاومة فقط'],c:0,e:'ص 79.'}
 ]
});

/* ======================================================================
   Lesson 2 — star & delta: line/phase relations, load connections, neutral current (ص 80–87)
   ====================================================================== */
/* الشكل (2-4): star-connected generator. o.vals={VAN,VAB,IA,IAA} */
function genYSVG(o){o=o||{};const L=o.vals||{},fl=o.flow?'live':'';const N=[140,170],A=[140,60],Bp=[226.6,220],Cp=[53.4,220];
  let s=`<svg viewBox="0 0 600 330" role="img" aria-label="توصيلة النجمة في المولد">`;
  s+=ind(N[0],N[1],A[0],A[1],4,PC[0],0.18)+ind(N[0],N[1],Bp[0],Bp[1],4,PC[1],0.18)+ind(N[0],N[1],Cp[0],Cp[1],4,PC[2],0.18);
  s+=`<path class="w ${fl}" d="M140 60V40H520"/><path class="w" d="M140 170H520" stroke-dasharray="7 5"/><path class="w ${fl}" d="M226.6 220V260H520"/><path class="w ${fl}" d="M53.4 220V300H520"/>`;
  s+=dot(140,170)+S.t(126,66,'A','','end')+S.t(126,150,"A'",'','end')+S.t(236,228,'B','','start')+S.t(158,208,"B'",'','start')+S.t(44,228,'C','','end')+S.t(122,208,"C'",'','end')+S.t(152,162,'N','','start');
  [[40,'A'],[170,'N'],[260,'B'],[300,'C']].forEach(([y,l])=>{s+=term(520,y)+S.t(532,y+4,l,'','start')});
  s+=arrow(158,146,158,92,'--blue',2)+ct(164,122,L.IAA?`IA'A = ${L.IAA}`:"IA'A",'--blue-ink','start',11.5);
  s+=arrow(282,40,318,40,'--blue',2.2)+ct(300,30,L.IA?`IA = ${L.IA}`:'IA','--blue-ink','middle',12);
  s+=dbl(410,46,410,164)+ct(402,58,'+','--fg','end',13)+ct(402,162,'−','--fg','end',13)+ct(418,112,L.VAN?`VAN = ${L.VAN}`:'VAN','--fg','start',12);
  s+=dbl(470,46,470,254)+ct(478,58,'+','--fg','start',13)+ct(478,252,'−','--fg','start',13)+ct(478,206,L.VAB?`VAB`:'VAB','--fg','start',12)+(L.VAB?ct(478,222,L.VAB,'--fg','start',12):'');
  return s+'</svg>'}
/* الشكل (2-6): delta-connected generator. o.vals={IAB,IBC,IB,VAB} */
function genDSVG(o){o=o||{};const L=o.vals||{},fl=o.flow?'live':'';const A=[140,50],Cp=[50,206],Bp=[230,206];
  let s=`<svg viewBox="0 0 600 300" role="img" aria-label="توصيلة الدلتا في المولد">`;
  s+=ind(A[0],A[1],Bp[0],Bp[1],4,PC[0],0.2)+ind(Bp[0],Bp[1],Cp[0],Cp[1],4,PC[1],0.2)+ind(Cp[0],Cp[1],A[0],A[1],4,PC[2],0.2);
  s+=`<path class="w ${fl}" d="M140 50H520"/><path class="w ${fl}" d="M230 206H520"/><path class="w ${fl}" d="M50 206V264H520"/>`;
  s+=dot(140,50)+dot(230,206)+dot(50,206);
  s+=S.t(128,46,"A , C'",'','end')+S.t(236,226,"B , A'",'','start')+S.t(56,228,"C , B'",'','middle');
  [[50,'A'],[206,'B'],[264,'C']].forEach(([y,l])=>{s+=term(520,y)+S.t(532,y+4,l,'','start')});
  // IAB along the right side (A→B), IBC along the bottom (B→C)
  s+=arrow(202,104,226,146,'--blue',2.2)+ct(222,116,L.IAB?`IAB = ${L.IAB}`:'IAB','--blue-ink','start',12);
  s+=arrow(160,186,120,186,'--blue',2.2)+ct(140,176,L.IBC?`IBC = ${L.IBC}`:'IBC','--blue-ink','middle',12);
  s+=arrow(300,206,336,206,'--blue',2.2)+ct(318,196,L.IB?`IB = ${L.IB}`:'IB','--blue-ink','middle',12);
  s+=dbl(450,56,450,200)+ct(442,68,'+','--fg','end',13)+ct(442,198,'−','--fg','end',13)+ct(458,124,'VAB','--fg','start',12)+(L.VAB?ct(458,140,L.VAB,'--fg','start',12):'');
  return s+'</svg>'}
/* الشكلان (2-5) و (2-7): phasors of phase and line quantities. kind 'V' (star) or 'I' (delta) */
function lpPhasor(kind,o){o=o||{};const m=o.m||1,sel=o.sel||(kind==='V'?'AB':'B'),W=o.w||330;
  let ph,ln,cons;
  if(kind==='V'){ph=[['VAN',0],['VBN',-120],['VCN',120]].map(([l,a],i)=>({z:pol(m,a),col:PC[i],lab:l,w:2.4}));
    ln=[['VAB',30,'AB'],['VBC',-90,'BC'],['VCA',150,'CA']].map(([l,a,k])=>({z:pol(m*SQ3,a),col:'--fg',lab:l,w:sel===k?3.4:2.2,k}));
    const P={AB:[0,1],BC:[1,2],CA:[2,0]}[sel];cons={z:csc(ph[P[1]].z,-1),from:ph[P[0]].z,col:PC[P[1]],w:1.6,dash:'5 4',lab:'−'+ph[P[1]].lab,lcol:'--muted',lmid:1};}
  else{ph=[['IAB',0],['IBC',-120],['ICA',120]].map(([l,a],i)=>({z:pol(m,a),col:PC[i],lab:l,w:2.4}));
    ln=[['IB',30,'B'],['IC',-90,'C'],['IA',150,'A']].map(([l,a,k])=>({z:pol(m*SQ3,a),col:'--fg',lab:l,w:sel===k?3.4:2.2,k}));
    const P={B:[0,1],C:[1,2],A:[2,0]}[sel];cons={z:csc(ph[P[1]].z,-1),from:ph[P[0]].z,col:PC[P[1]],w:1.6,dash:'5 4',lab:'−'+ph[P[1]].lab,lcol:'--muted',lmid:1};}
  const selLn=ln.find(v=>v.k===sel),sa=cang(selLn.z),pa=cang(cons.from);
  const list=[...ph,...ln,cons];
  return phasorSVG(list,{w:W,h:o.h||W,max:m*SQ3,pad:46,aria:kind==='V'?'مطاورات جهود الأطوار والخطوط':'مطاورات تيارات الأطوار والخطوط',
    arcs:[{a1:Math.min(pa,sa),a2:Math.max(pa,sa),r:44,lab:'30°'}].filter(a=>Math.abs(a.a2-a.a1)<=90)})}

/* three-phase star load: E per phase, Z array [{re,im}], neutral on? → currents & voltages */
function ySolve(E,Z,nOn){const Es=[pol(E,0),pol(E,-120),pol(E,120)];let VnN=C(0,0);
  if(!nOn){const Y=Z.map(z=>cdiv(C(1,0),z));VnN=cdiv(csum(Es.map((e,i)=>cmul(e,Y[i]))),csum(Y))}
  const Vl=Es.map(e=>csub(e,VnN)),I=Vl.map((v,i)=>cdiv(v,Z[i])),IN=nOn?csum(I):C(0,0);return {Es,Vl,I,IN,VnN}}

/* worked examples 2-1-1 / 2-1-3 (star–star) */
function exYY(g,o){const V=g.V,R=g.R,X=g.X,out=[];
  if(o.seq)out.push({t:'بما أن تتابع الأطوار هو ABC فإن:',f:'\\theta_2=-120^\\circ\\qquad \\theta_3=-240^\\circ=120^\\circ'});
  const VL=B.round(SQ3*V,0);out.push({t:o.seq?'القيمة الفعالة لجهود الخطوط:':'القيمة الفعالة لجهد الخط:',f:`${o.seq?'V_{AB}=V_{BC}=V_{CA}':'V_L'}=\\sqrt3\\,V=\\sqrt3\\times ${fm(V)}`,v:VL,unit:'V'});
  const Zm=B.round(Math.hypot(R,X),2),Za=B.round(Math.atan2(X,R)/D,1);
  if(!(Zm>0))return [{t:'المعاوقة صفر: لا يمكن الحساب.'}];
  const I=B.round(V/Zm,2),nm=['a','b','c'],NM=['A','B','C'],ea=[0,-120,120];
  const ang=ea.map(a=>B.round(wrap(a-Za),1));
  out.push({t:'معاوقة كل فرع بالصيغة القطبية:',f:`Z=${lrs(R,X)}=${lps(Zm,Za)}\\ \\Omega`});
  out.push({t:o.seq?'تيارات الخطوط (تساوي تيارات الأطوار في توصيلة النجمة):':'تيارات الأطوار:'});
  const dR=o.dR,cm=ang.map(a=>[B.round(I*Math.cos(a*D),dR),B.round(I*Math.sin(a*D),dR)]);
  ang.forEach((a,i)=>{const lhs=o.seq?`\\bar I_{${NM[i]}${nm[i]}}=\\bar I_{${nm[i]}n}`:`\\bar I_{${nm[i]}n}`;
    out.push({f:`${lhs}=\\frac{\\bar V_{${nm[i]}n}}{Z}=\\frac{${lps(V,ea[i])}}{${lps(Zm,Za)}}=${lps(I,a)}\\ A${o.seq?`=${lrs(cm[i][0],cm[i][1],dR)}\\ A`:''}`})});
  if(!o.seq)out.push({t:'وبما أن التوصيلة نجمة فإن تيارات الخط تساوي تيارات الطور:',f:ang.map((a,i)=>`\\bar I_{${NM[i]}${nm[i]}}=${lps(I,a)}`).join('\\quad ')+'\\ A'});
  const sr=B.round(cm.reduce((s,c)=>s+c[0],0),dR),si=B.round(cm.reduce((s,c)=>s+c[1],0),dR);
  out.push({t:o.seq?'بتطبيق قانون كيرشوف للتيار:':'التيار في الحيادي:',f:`\\bar I_N=\\bar I_{Aa}+\\bar I_{Bb}+\\bar I_{Cc}=${cm.map(c=>`(${lrs(c[0],c[1],dR)})`).join('+')}`,v:(isZ(sr,dR)&&isZ(si,dR))?0:rs(sr,si,dR),unit:'A',final:true});
  out.push({t:(isZ(sr,dR)&&isZ(si,dR))?'وهذا طبيعي لأن الحمل متزن.':'الناتج قريب جداً من الصفر؛ الفرق الصغير من تقريب المركبات فقط، لأن الحمل متزن.'});
  return out}
/* worked example 2-1-2 (star generator, delta load) */
function exYD(g,isBook,o){o=o||{};const V=g.V,R=g.R,X=g.X,out=[];const exact=SQ3*V,VL=isBook?380:B.round(exact,0);
  const Zm=B.round(Math.hypot(R,X),2),Za=B.round(Math.atan2(X,R)/D,1);if(!(Zm>0))return [{t:'المعاوقة صفر: لا يمكن الحساب.'}];
  const I=B.round(VL/Zm,2),la=[30,-90,150],nm=[['ab','AB','AN','BN'],['bc','BC','BN','CN'],['ca','CA','CN','AN']],ea={AN:0,BN:-120,CN:120};
  out.push({t:'تيارات الأطوار: جهد كل فرع من الحمل هو جهد الخط بين طرفيه:'});
  la.forEach((a,i)=>{const [p,P,x,y]=nm[i];out.push({f:`\\bar I_{${p}}=\\frac{\\bar V_{${P}}}{Z}=\\frac{\\bar V_{${x}}-\\bar V_{${y}}}{Z}=\\frac{${lps(V,ea[x])}-${lps(V,ea[y])}}{${lrs(R,X)}}=\\frac{${lps(VL,a)}}{${lps(Zm,Za)}}=${lps(I,B.round(wrap(a-Za),1))}\\ A`})});
  if(isBook)out.push({t:`<span class="sub">الفرق الدقيق \\(\\sqrt3\\times ${fm(V)}=${fm(exact,2)}\\) V وقرّبه الكتاب إلى 380 V.</span>`});
  const IL=B.round(SQ3*I,1);out.push({t:'القيمة الفعالة لتيار الخط:',f:`I_L=\\sqrt3\\,I_{ph}=\\sqrt3\\times ${fm(I)}`,v:IL,unit:'A',final:true});
  return out}
const G211=[{id:'V',label:'جهد طور المولد',sym:'E_{AN}',unit:'V',value:127},{id:'R',label:'مقاومة كل فرع من الحمل',sym:'R',unit:'Ω',value:3},{id:'X',label:'ممانعة كل فرع',sym:'X',unit:'Ω',value:4}];
const G212=[{id:'V',label:'جهد طور المولد',sym:'E_{AN}',unit:'V',value:220},{id:'R',label:'مقاومة كل فرع من حمل الدلتا',sym:'R',unit:'Ω',value:6},{id:'X',label:'ممانعة كل فرع',sym:'X',unit:'Ω',value:8}];
const G213=[{id:'V',label:'جهد طور المولد',sym:'E_{AN}',unit:'V',value:120},{id:'R',label:'مقاومة كل فرع من الحمل',sym:'R',unit:'Ω',value:3},{id:'X',label:'ممانعة كل فرع',sym:'X',unit:'Ω',value:4}];

const FIG28=()=>box(sysSVG({gen:'Y',src:['EAN 127∠0° V','127∠−120° V','127∠120° V'],load:'Y',z:['Z = 3+j4 Ω','Z','Z'],neutral:'dash',cur:{A:'IAa'},curL:[1],aria:'الشكل 2-8'}),640);
const FIG29=(z)=>box(sysSVG({gen:'Y',src:['EAN 220∠0° V','220∠−120° V','220∠120° V'],load:'D',z:[`Z = ${z||'6+j8'} Ω`,'Z','Z'],neutral:'none',curL:['Iab','Ibc','Ica'],aria:'الشكل 2-9'}),640);
const FIG210=()=>box(sysSVG({gen:'Y',src:['EAN 120∠0° V','120∠θ2 V','120∠θ3 V'],load:'Y',z:['Z = 3+j4 Ω','Z','Z'],neutral:'dash',cur:{A:'IAa'},curL:[1],aria:'الشكل 2-10'}),640);

B.lesson({
 id:'u2-l2',unit:2,order:2,pages:'80–87',
 title:'توصيلتا النجمة والدلتا: قيم الخط وقيم الطور، وتوصيلات الأحمال والتيار الحيادي',
 summary:'في النجمة: جهد الخط = √3 × جهد الطور ويتقدم عليه 30°، وتيار الخط = تيار الطور. في الدلتا: جهد الخط = جهد الطور وتيار الخط = √3 × تيار الطور. وفي الحمل النجمي المتزن تيار الحيادي صفر. مع الأمثلة (2-1-1) و(2-1-2) و(2-1-3).',
 theory:[
  {h:'2-4 التوصيل على شكل نجمة ودلتا والعلاقة بين قيم الخط وقيم الوجه للتيار والجهد',ref:'ص 80',html:'<p>«هناك طريقتان لتوصيل أطراف ملفات المولدات ببعضها البعض: <b>توصيلة النجمة</b> و<b>توصيلة الدلتا</b>. وكلتا التوصيلتين تستعمل كذلك لربط الأحمال ثلاثية الأطوار. وفيما يلي ندرس تفاصيل التوصيلتين في حالة الاتزان.»</p>'},
  {h:'2-4-1 مولد موصول بتوصيلة النجمة',ref:'ص 80–81',html:`<p>«في هذا النوع من التوصيلة نربط أطراف ملفات المولد A' و B' و C' مع بعضها البعض، وتسمى النقطة الناتجة <b>بالطرف المحايد أو المتعادل</b> ويرمز لها بالرمز <b>N</b> (الشكل 2-4)، أما الأطراف A و B و C فإنها توصل بالأحمال بموصلات تسمى <b>الخطوط</b>.»</p>
   <ul><li><b>جهد الطور:</b> «الجهد بين أي خط من الخطوط الثلاثة والحيادي» — مثلاً \\(v_{AN}\\) بين الطور A والحيادي (ويساوي \\(v_{AA'}\\) في المعادلة 2-1).</li>
   <li><b>جهد الخط:</b> «الجهد بين أي خطين» — مثلاً \\(v_{AB}\\) بين الطرف A والطرف B.</li>
   <li><b>تيار الطور:</b> «التيار المار في أحد ملفات المولد» — مثلاً \\(I_{A'A}\\) المار في الملف AA'.</li>
   <li><b>تيار الخط:</b> «التيار المار في أحد الخطوط» — مثلاً \\(I_A\\) المار في الخط الخارج من الطرف A.</li></ul>
   <p>«وهذه الجهود والتيارات مبينة في الشكل 2-4، حيث لم نبين كل التيارات والجهود وذلك لتوضيح الشكل.»</p>`},
  {fig:'(2-4)',ref:'ص 80',caption:'توصيلة النجمة في المولدات: الأطراف A\' و B\' و C\' مربوطة في N، والخطوط من A و B و C، والحيادي متقطع من N.',draw:()=>box(genYSVG({}),600)},
  {html:`<p>«وكما نرى فإن <b>تيارات الأطوار تتساوى مع تيارات الخطوط</b>، أما العلاقة بين جهود الأطوار وجهود الخطوط فنستنتجها كما يلي: باستعمال المعادلات 2-2 نجد جهد الخط \\(V_{AB}\\)» <span class="ref">ص 81</span></p>
   $$\\bar V_{AB}=\\bar V_{AN}-\\bar V_{BN}=V_{ph}\\angle 0^\\circ-V_{ph}\\angle -120^\\circ=V_{ph}\\sqrt3\\angle 30^\\circ\\qquad (2\\text{-}3)$$
   <p>«وكما نلاحظ فإن القيمة الفعالة لجهد الخط \\(V_L\\) في توصيلة النجمة تساوي \\(\\sqrt3\\) مرة القيمة الفعالة لجهد الطور (الوجه)، أي»</p>
   $$V_L=V_{ph}\\sqrt3\\qquad (2\\text{-}4)$$
   <p>«ويبين الشكل 2-5 المطاور لجهود الأطوار والخطوط، ونلاحظ أن <b>زاوية أي من جهود الخط تختلف عن زاوية أي من جهود الطور</b>. كما نلاحظ أن <b>مجموع جهود الخط يساوي الصفر وكذلك مجموع جهود الطور</b>.»</p>`},
  {fig:'(2-5)',ref:'ص 81',caption:'الشكل المطاور لجهود الأطوار والخطوط: V<sub>AB</sub> أطول من V<sub>AN</sub> بنسبة √3 ويتقدم عليه 30°. الخط المتقطع هو −V<sub>BN</sub> مضافاً إلى V<sub>AN</sub>.',draw:()=>box(lpPhasor('V',{w:330}),330)},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب) — من أين جاء √3؟</b> المثلث المكون من \\(\\bar V_{AN}\\) و \\(-\\bar V_{BN}\\) متساوي الساقين وزاوية رأسه 120°، فقاعدته \\(=2\\,V_{ph}\\cos30^\\circ=2\\times0.866\\,V_{ph}=1.732\\,V_{ph}\\). مثال: جهد طور <span class="ltr">220 V</span> يعطي جهد خط <span class="ltr">381 V</span> (يُكتب عادة 380 V)، وجهد طور <span class="ltr">127 V</span> يعطي <span class="ltr">220 V</span>.'},
  {h:'2-4-2 مولد موصول بتوصيلة الدلتا',ref:'ص 81–83',html:`<p>«كما هو موضح في الشكل 2-6، عند ربط أطراف ملفات المولد <b>A مع C' و B مع A' و C مع B'</b>، وربط الخطوط الخارجة بالأطراف A و B و C، نحصل على توصيلة الدلتا. وعلى العكس من توصيلة النجمة، فإنه في هذا النوع من التوصيلة <b>لا يوجد طرف محايد</b> كما أنه <b>يتساوى جهد الطور مع جهد الخط</b>.»</p>`},
  {fig:'(2-6)',ref:'ص 82',caption:'توصيلة الدلتا في المولدات: ملف AA\' على الضلع A–B، و BB\' على B–C، و CC\' على C–A. التيار I<sub>AB</sub> في الملف من A نحو B، و I<sub>BC</sub> من B نحو C، وتيار الخط I<sub>B</sub> خارجاً من B.',draw:()=>box(genDSVG({}),600)},
  {html:`<p>«ولإيجاد العلاقة بين تيارات الأطوار وتيارات الخطوط نفترض ما يلي:»</p>
   $$\\bar I_{AB}=I\\angle 0^\\circ\\qquad \\bar I_{BC}=I\\angle -120^\\circ\\qquad \\bar I_{CA}=I\\angle -240^\\circ=I\\angle 120^\\circ\\qquad (2\\text{-}5)$$
   <p>«حيث I هي القيمة الفعالة لتيار الطور. وباستعمال قانون كيرشوف نحصل على المعادلة»</p>
   $$\\bar I_B=\\bar I_{AB}-\\bar I_{BC}=I\\angle 0^\\circ-I\\angle -120^\\circ=I\\sqrt3\\angle 30^\\circ\\qquad (2\\text{-}6)$$
   <p>«وكما نلاحظ فإن القيمة الفعالة لتيار الخط \\(I_L\\) تساوي \\(\\sqrt3\\) مرة القيمة الفعالة لتيار الطور \\((I_{ph})\\)، أي»</p>
   $$I_L=I_{ph}\\sqrt3\\qquad (2\\text{-}7)$$
   <p>«ويبين الشكل 2-7 المطاور لتيارات الأطوار والخطوط، وهنا كذلك نلاحظ أن زاوية أي من تيارات الخط تختلف عن زاوية أي من تيارات الطور. كما نلاحظ أن مجموع تيارات الخط يساوي الصفر وكذلك مجموع تيارات الطور.»</p>`},
  {fig:'(2-7)',ref:'ص 83',caption:'الشكل المطاور لتيارات الأطوار والخطوط: I<sub>B</sub> أطول من I<sub>AB</sub> بنسبة √3 ويتقدم عليه 30°.',draw:()=>box(lpPhasor('I',{w:330}),330)},
  {note:`<b>توضيح للمتدرب (ليس من نص الكتاب) — خلاصة العلاقات في حالة الاتزان:</b><div class="k3-tbl"><table class="tt"><thead><tr><th>التوصيلة</th><th>الجهد</th><th>التيار</th><th>الحيادي</th></tr></thead><tbody><tr><td>نجمة Y</td><td>\\(V_L=\\sqrt3\\,V_{ph}\\) (يتقدم 30°)</td><td>\\(I_L=I_{ph}\\)</td><td>يوجد N</td></tr><tr><td>دلتا Δ</td><td>\\(V_L=V_{ph}\\)</td><td>\\(I_L=\\sqrt3\\,I_{ph}\\) (المعادلة 2-6)</td><td>لا يوجد</td></tr></tbody></table></div>`},
  {h:'2-5 توصيلات الأحمال',ref:'ص 83',html:`<p>«نستطيع توصيل العناصر الثلاثة الممثلة للحمل على هيئة النجمة أو الدلتا. ولتحقيق الاتزان يجب أن تكون معاوقات الفروع الثلاثة متساوية. وفي توصيلة النجمة فإن <b>التيار المار في الحيادي يكون معدوماً في حالة الاتزان</b> لأنه يساوي مجموع تيارات الخطوط، وهذه التيارات متساوية في القيمة الفعالة وتختلف زوايا أطوارها بـ 120°، أي»</p>
   $$\\bar I_N=\\bar I_A+\\bar I_B+\\bar I_C=0\\qquad (2\\text{-}8)$$
   <p>«وبذلك يمكن إزالة الموصل الحيادي دون أي تأثير على النظام، وستؤدي هذه الإزالة إلى كابلات تحتوي على <b>ثلاثة أسلاك عوضاً عن أربعة</b>. وفي الواقع فإن <b>كثيراً من الأحمال ليست متزنة وتبقى الحاجة إلى الموصل الحيادي قائمة</b>.»</p>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> إذا لم يكن الحمل النجمي متزناً فإن مجموع تيارات الخطوط لا يساوي صفراً ويمر الفرق في الحيادي. وإذا فُصل الحيادي في هذه الحالة تنتقل نقطة النجمة n عن N فتختلف جهود فروع الحمل: بعضها يرتفع فوق جهد الطور وبعضها ينخفض. لهذا «تبقى الحاجة إلى الموصل الحيادي قائمة». جرّب ذلك في المختبر.'},
  {h:'مثال 2-1-1',ref:'ص 83–84',html:'<p>«يغذي مولد حمل حيث أن كلاً من المولد والحمل ثلاثي الأطوار موصول بتوصيلة نجمة كما هو موضح في الشكل 2-8. احسب القيمة الفعالة لجهد الخط وتيارات الخطوط المطاورة، وبين أن التيار الحيادي معدوم.»</p>'},
  {fig:'(2-8)',ref:'ص 84',caption:'مولد نجمة وحمل نجمة متزن \\(Z=3+j4\\ \\Omega\\) والحيادي (متقطع) بين N و n.',draw:FIG28},
  {html:`<p><b>الحل:</b> \\(V_L=\\sqrt3\\times127=220\\) V. \\(Z=3+j4=5\\angle53.1^\\circ\\ \\Omega\\)، فتيارات الأطوار (= تيارات الخطوط):</p>
   $$\\bar I_{an}=\\frac{127\\angle0^\\circ}{5\\angle53.1^\\circ}=25.4\\angle-53.1^\\circ\\ A,\\quad \\bar I_{bn}=25.4\\angle-173.1^\\circ\\ A,\\quad \\bar I_{cn}=25.4\\angle66.9^\\circ\\ A$$
   $$\\bar I_N=(15.25-j20.31)+(-25.22-j3.05)+(9.97+j23.36)=0$$<p>«وهذا طبيعي لأن الحمل متزن.» الحل بخطواته في تبويب «الأمثلة المحلولة».</p>`},
  {h:'مثال 2-1-2',ref:'ص 85–86',html:'<p>«وصل حمل ثلاثي الأطوار توصيلة دلتا بمولد ذي توصيلة نجمة كما هو مبين في الشكل 2-9. احسب تيار كل طور من الحمل وكذلك القيمة الفعالة لتيار الخط.»</p>'},
  {fig:'(2-9)',ref:'ص 85',caption:'مولد نجمة (220 V للطور) وحمل دلتا \\(Z=6+j8\\ \\Omega\\) في كل ضلع، بلا حيادي.',draw:()=>FIG29()},
  {html:`<p><b>الحل:</b> جهد كل فرع من الدلتا هو جهد خط: \\(\\bar V_{AB}=220\\angle0^\\circ-220\\angle-120^\\circ=380\\angle30^\\circ\\) V، و \\(Z=10\\angle53.1^\\circ\\):</p>
   $$\\bar I_{ab}=\\frac{380\\angle30^\\circ}{10\\angle53.1^\\circ}=38\\angle-23.1^\\circ,\\quad \\bar I_{bc}=38\\angle-143.1^\\circ,\\quad \\bar I_{ca}=38\\angle96.9^\\circ\\ A$$
   $$I_L=\\sqrt3\\,I_{ph}=\\sqrt3\\times38=65.8\\ A$$`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> الفرق الدقيق \\(\\sqrt3\\times220=381.05\\) V، وقرّبه الكتاب إلى 380 V (القيمة المعتادة لجهد الشبكة). لو استعملنا 381.05 لكان تيار الطور 38.1 A وتيار الخط 66.0 A.'},
  {h:'مثال 2-1-3',ref:'ص 86–87',html:'<p>«تتابع الأطوار للمولد الموصل على شكل نجمة في الشكل 2-10 هو ABC والمطلوب ما يلي: أوجد زوايا الطور \\(\\theta_2,\\theta_3\\). أوجد مقدار جهود الخطوط. أوجد تيارات الخطوط. اثبت أنه عندما تكون الأحمال متزنة فإن التيار الحيادي معدوم.»</p>'},
  {fig:'(2-10)',ref:'ص 86',caption:'مثل الشكل 2-8 لكن جهد الطور 120 V وزاويتا الطورين B و C مجهولتان \\(\\theta_2,\\theta_3\\).',draw:FIG210},
  {html:`<p><b>الحل:</b> \\(\\theta_2=-120^\\circ\\)، \\(\\theta_3=-240^\\circ=120^\\circ\\)؛ \\(V_{AB}=V_{BC}=V_{CA}=\\sqrt3\\times120=208\\) V؛</p>
   $$\\bar I_{Aa}=24\\angle-53.1^\\circ=14.4-j19.2,\\quad \\bar I_{Bb}=24\\angle-173.1^\\circ=-23.8-j2.9,\\quad \\bar I_{Cc}=24\\angle66.9^\\circ=9.4+j22.1\\ A$$
   $$\\bar I_N=14.4-j19.2-23.8-j2.9+9.4+j22.1=0$$`},
  {h:'ملاحظات على الكتاب',html:'<ul><li>ص 87، مثال 2-1-3: طُبع الجزء التخيلي الأخير «j22,1» بفاصلة؛ المقصود <span class="ltr">j22.1</span> (صُحح هنا).</li><li>في المثالين 2-1-2 و 2-2-2 يقرّب الكتاب \\(\\sqrt3\\times220=381.05\\) إلى 380 V؛ نتبع تقريبه في الحاسبات بقيم الكتاب.</li></ul>'}
 ],
 lab:(el)=>{
  let mode='rel',conn='Y',Vph=220,Iph=10,sel='AB',selD='B';
  let E=127,bal=true,nOn=true,pre='',Z=[C(3,4),C(3,4),C(3,4)];
  el.innerHTML=`<div id="l2tp"></div><div class="grid k3-lab">
   <div class="panel c12"><h2>ماذا تريد أن تجرب؟</h2>${segHTML('md',[['rel','علاقات الخط والطور (الأشكال 2-4 – 2-7)'],['load','الحمل النجمي والتيار الحيادي (الأشكال 2-8 – 2-10)']],mode)}</div>
   <div class="panel c7" id="l2relA"><h2 id="l2rh"></h2>
    <div class="k3-row"><div><div class="sub">التوصيلة</div>${segHTML('cn',[['Y','مولد نجمة'],['D','مولد دلتا']],conn)}</div><div id="l2selw"></div></div>
    <div class="k3-sls">${sl('l2vp','جهد الطور V<sub>ph</sub> (القيمة الفعالة)',50,400,1,Vph)}<span id="l2ipw" style="display:contents">${sl('l2ip','تيار الطور I<sub>ph</sub> (القيمة الفعالة)',1,100,0.1,Iph)}</span></div>
    <div class="svgbox" id="l2c" style="max-width:600px;margin-inline:auto"></div></div>
   <div class="panel c5" id="l2relB"><h2>المطاورات</h2><div class="svgbox" id="l2ph" style="max-width:340px;margin-inline:auto"></div><div class="facts" id="l2rf"></div><p class="sub" id="l2rn"></p></div>
   <div class="panel c7" id="l2ldA"><h2>مولد نجمة يغذي حملاً نجمياً <small>مبنية على الشكلين (2-8) و(2-10)</small></h2>
    <div class="k3-row"><button class="btn" data-pre="e1">مثال (2-1-1)</button><button class="btn" data-pre="e3">مثال (2-1-3)</button><button class="btn" data-pre="ub">حمل غير متزن</button>${swHTML('l2bal','متزن','حرّك فرعاً تتحرك الثلاثة',bal)}${swHTML('l2N','N – n','الموصل الحيادي',nOn)}</div>
    <div class="k3-sls">${sl('l2E','جهد طور المولد E (القيمة الفعالة)',50,400,1,E)}</div>
    <div class="k3-zin">${[0,1,2].map(k=>`<div class="k3-zr"><h4><span>معاوقة الفرع ${'abc'[k]}–n</span><b id="l2z${k}"></b></h4><div class="k3-sls">${sl('l2r'+k,'R',0.5,20,0.1,3)}${sl('l2x'+k,'X (موجبة: حثية، سالبة: سعوية)',-20,20,0.1,4)}</div></div>`).join('')}</div>
    <div class="svgbox" id="l2lc" style="max-width:660px;margin-inline:auto"></div></div>
   <div class="panel c5" id="l2ldB"><h2>مطاورات التيارات <small>ومضلع جمعها</small></h2><div class="svgbox" id="l2lph" style="max-width:340px;margin-inline:auto"></div><div class="facts" id="l2lf"></div><div class="k3-row"><span id="l2chip" class="k3-chip"></span></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l2st"></ol></div></div>`;
  B.math(el);const $=s=>el.querySelector(s);
  const TP=B.params($('#l2tp'),'u2-l2',[
   {k:'Rb',label:'زر «حمل غير متزن»: مقاومة الفرع b',unit:'Ω',value:8,min:0.5,max:20,step:0.1},
   {k:'Xb',label:'زر «حمل غير متزن»: ممانعة الفرع b',unit:'Ω',value:0,min:-20,max:20,step:0.1},
   {k:'Rc',label:'زر «حمل غير متزن»: مقاومة الفرع c',unit:'Ω',value:4,min:0.5,max:20,step:0.1},
   {k:'Xc',label:'زر «حمل غير متزن»: ممانعة الفرع c',unit:'Ω',value:-3,min:-20,max:20,step:0.1}],()=>{if(pre==='ub')preset('ub');steps.redraw();draw()});
  const ubZ=()=>[C(3,4),C(TP.v.Rb,TP.v.Xb),C(TP.v.Rc,TP.v.Xc)];
  const isBal=()=>Z.every(z=>Math.abs(z.re-Z[0].re)<1e-9&&Math.abs(z.im-Z[0].im)<1e-9);
  const syncZ=()=>{[0,1,2].forEach(k=>{$('#l2r'+k).value=Z[k].re;$('#l2x'+k).value=Z[k].im})};
  const preset=p=>{pre=p;if(p==='e1'){E=127;Z=[C(3,4),C(3,4),C(3,4)];bal=true}else if(p==='e3'){E=120;Z=[C(3,4),C(3,4),C(3,4)];bal=true}else{E=127;Z=ubZ();bal=false}
    $('#l2E').value=E;$('#l2bal').setAttribute('aria-pressed',String(bal));syncZ();draw()};
  el.querySelectorAll('[data-pre]').forEach(b=>b.onclick=()=>preset(b.dataset.pre));
  $('#l2bal').onclick=()=>{bal=!bal;$('#l2bal').setAttribute('aria-pressed',String(bal));if(bal){Z=[Z[0],Z[0],Z[0]].map(z=>C(z.re,z.im));syncZ()}pre='';draw()};
  $('#l2N').onclick=()=>{nOn=!nOn;$('#l2N').setAttribute('aria-pressed',String(nOn));draw()};
  $('#l2E').oninput=e=>{E=+e.target.value;pre='';draw()};
  [0,1,2].forEach(k=>{const f=()=>{const z=C(+$('#l2r'+k).value,+$('#l2x'+k).value);if(bal)Z=[0,1,2].map(()=>C(z.re,z.im));else Z[k]=z;pre='';syncZ();draw()};$('#l2r'+k).oninput=f;$('#l2x'+k).oninput=f});
  segBind(el,'md',v=>{mode=v;ui();draw()});segBind(el,'cn',v=>{conn=v;ui();draw()});
  $('#l2vp').oninput=e=>{Vph=+e.target.value;draw()};$('#l2ip').oninput=e=>{Iph=+e.target.value;draw()};
  const ui=()=>{const r=mode==='rel';['#l2relA','#l2relB'].forEach(s=>$(s).style.display=r?'':'none');['#l2ldA','#l2ldB'].forEach(s=>$(s).style.display=r?'none':'');
   $('#l2ipw').style.display=conn==='D'?'contents':'none';
   $('#l2rh').innerHTML=conn==='Y'?'مولد موصول نجمة <small>الشكلان (2-4) و(2-5) والمعادلتان (2-3) و(2-4)</small>':'مولد موصول دلتا <small>الشكلان (2-6) و(2-7) والمعادلات (2-5) – (2-7)</small>';
   $('#l2selw').innerHTML=conn==='Y'?`<div class="sub">ارسم بناء</div>${segHTML('sv',[['AB','V<sub>AB</sub> = V<sub>AN</sub> − V<sub>BN</sub>'],['BC','V<sub>BC</sub> = V<sub>BN</sub> − V<sub>CN</sub>'],['CA','V<sub>CA</sub> = V<sub>CN</sub> − V<sub>AN</sub>']],sel)}`:`<div class="sub">ارسم بناء</div>${segHTML('sd',[['B','I<sub>B</sub> = I<sub>AB</sub> − I<sub>BC</sub>'],['C','I<sub>C</sub> = I<sub>BC</sub> − I<sub>CA</sub>'],['A','I<sub>A</sub> = I<sub>CA</sub> − I<sub>AB</sub>']],selD)}`;
   segBind($('#l2selw'),'sv',v=>{sel=v;draw()});segBind($('#l2selw'),'sd',v=>{selD=v;draw()})};
  let last=null;
  const draw=()=>{
   $('#l2vp-v').textContent=Vph+' V';$('#l2ip-v').textContent=fm(Iph,1)+' A';$('#l2E-v').textContent=E+' V';
   [0,1,2].forEach(k=>{$('#l2r'+k+'-v').textContent=fm(Z[k].re,1)+' Ω';$('#l2x'+k+'-v').textContent=neg(Z[k].im,1)+' Ω';$('#l2z'+k).textContent=zs(Z[k],1)+' Ω'});
   if(mode==='rel'){
    if(conn==='Y'){const VL=SQ3*Vph,la={AB:30,BC:-90,CA:150}[sel];
     $('#l2c').innerHTML=genYSVG({vals:{VAN:ps(Vph,0,0,0)+' V',VAB:ps(VL,30,1,0)+' V'},flow:true});
     $('#l2ph').innerHTML=lpPhasor('V',{m:Vph,sel,w:340});
     $('#l2rf').innerHTML=fact('جهد الطور V<sub>ph</sub>','f1')+fact('جهد الخط V<sub>L</sub>','f2')+fact('V<sub>L</sub> ÷ V<sub>ph</sub>','f3')+fact('زاوية V<sub>'+sel+'</sub>','f4')+fact('مجموع جهود الخطوط','f5')+fact('تيار الخط ÷ تيار الطور','f6');
     const q=s=>$('#l2rf').querySelector(s);q('#f1').textContent=fm(Vph,0)+' V';q('#f2').textContent=fm(VL,1)+' V';q('#f3').textContent=fm(SQ3,3);q('#f4').textContent=neg(la,0)+'°';q('#f5').textContent='0 V';q('#f6').textContent='1';
     $('#l2rn').innerHTML=`المتقطع = −V<sub>${{AB:'BN',BC:'CN',CA:'AN'}[sel]}</sub> مضافاً إلى رأس V<sub>${{AB:'AN',BC:'BN',CA:'CN'}[sel]}</sub>: الناتج هو جهد الخط، أطول بنسبة √3 ومتقدم 30°.`}
    else{const IL=SQ3*Iph,la={B:30,C:-90,A:150}[selD];
     $('#l2c').innerHTML=genDSVG({vals:{IAB:ps(Iph,0,1,0)+' A',IBC:ps(Iph,-120,1,0)+' A',IB:ps(IL,30,1,0)+' A',VAB:fm(Vph,0)+' V'},flow:true});
     $('#l2ph').innerHTML=lpPhasor('I',{m:Iph,sel:selD,w:340});
     $('#l2rf').innerHTML=fact('تيار الطور I<sub>ph</sub>','f1')+fact('تيار الخط I<sub>L</sub>','f2')+fact('I<sub>L</sub> ÷ I<sub>ph</sub>','f3')+fact('زاوية I<sub>'+selD+'</sub>','f4')+fact('مجموع تيارات الخطوط','f5')+fact('جهد الخط = جهد الطور','f6');
     const q=s=>$('#l2rf').querySelector(s);q('#f1').textContent=fm(Iph,1)+' A';q('#f2').textContent=fm(IL,1)+' A';q('#f3').textContent=fm(SQ3,3);q('#f4').textContent=neg(la,0)+'°';q('#f5').textContent='0 A';q('#f6').textContent=fm(Vph,0)+' V';
     $('#l2rn').innerHTML=`المتقطع = −I<sub>${{B:'BC',C:'CA',A:'AB'}[selD]}</sub> مضافاً إلى رأس I<sub>${{B:'AB',C:'BC',A:'CA'}[selD]}</sub> (قانون كيرشوف عند العقدة ${selD}).`}
   }else{
    const r=ySolve(E,Z,nOn);last=r;const IN=cabs(r.IN),Vn=cabs(r.VnN);
    const pI=i=>ps(cabs(r.I[i]),cang(r.I[i]),2,1)+' A';
    $('#l2lc').innerHTML=sysSVG({gen:'Y',src:[`EAN ${fm(E,0)}∠0° V`,`${fm(E,0)}∠−120° V`,`${fm(E,0)}∠120° V`],load:'Y',z:Z.map(z=>zs(z,1)+' Ω'),neutral:'sw',nOn,flow:true,
      cur:{A:'IAa = '+pI(0),B:'IBb = '+pI(1),C:'ICc = '+pI(2),N:'IN = '+ps(IN,cang(r.IN),2,1)+' A'},
      extra:!nOn?ct(400,192,'VnN = '+ps(Vn,cang(r.VnN),1,1)+' V','--stop','middle',12):'',aria:'مولد نجمة وحمل نجمة'});
    const sumP=[C(0,0),r.I[0],cadd(r.I[0],r.I[1])];
    const list=r.I.map((z,i)=>({z,col:PC[i],w:2.6,lab:['IA','IB','IC'][i]}));
    const poly=r.I.slice(1).map((z,i)=>({z,from:sumP[i+1],col:PC[i+1],w:1.4,dash:'4 3'}));
    if(nOn&&IN>1e-6)list.push({z:r.IN,col:'--stop',w:3,lab:'IN'});
    $('#l2lph').innerHTML=phasorSVG(list.concat(poly),{w:340,h:340,pad:40,aria:'مطاورات تيارات الخطوط'});
    $('#l2lf').innerHTML=[['I<sub>A</sub>',pI(0)],['I<sub>B</sub>',pI(1)],['I<sub>C</sub>',pI(2)],['I<sub>N</sub> = I<sub>A</sub>+I<sub>B</sub>+I<sub>C</sub>',nOn?fm(IN,2)+' A':'لا يوجد حيادي'],
      ['جهد بين n و N',fm(Vn,1)+' V'],['جهود فروع الحمل',r.Vl.map(v=>fm(cabs(v),1)).join(' / ')+' V']].map(([a,b])=>`<div class="fact"><span>${a}</span><b>${b}</b></div>`).join('');
    const ch=$('#l2chip'),b=isBal();
    if(b&&nOn){ch.className='k3-chip ok';ch.textContent='حمل متزن: IN = 0 (المعادلة 2-8)'}
    else if(b){ch.className='k3-chip ok';ch.textContent='حمل متزن بلا حيادي: لا شيء تغير (ص 83)'}
    else if(nOn){ch.className='k3-chip hot';ch.textContent='حمل غير متزن: يمر تيار في الحيادي'}
    else{ch.className='k3-chip warn';ch.textContent='غير متزن والحيادي مفصول: جهود الفروع غير متساوية!'}
   }
   steps.check()};
  const st=()=>last||ySolve(E,Z,nOn);
  const steps=stepsUI($('#l2st'),[
   {t:'جهد الخط في النجمة',x:'في «علاقات الخط والطور» و«مولد نجمة» اضبط جهد الطور على <span class="ltr">127 V</span>: جهد الخط <span class="ltr">√3 × 127 = 220 V</span> كما في مثال 2-1-1، والنسبة دائماً 1.732.',done:()=>mode==='rel'&&conn==='Y'&&Vph===127},
   {t:'بناء جهد خط آخر',x:'اختر بناء <b>V<sub>BC</sub></b>: الجهد V<sub>BC</sub> = V<sub>BN</sub> − V<sub>CN</sub> يقع عند <span class="ltr">−90°</span>، أي متقدماً 30° على V<sub>BN</sub> (−120°).',done:()=>mode==='rel'&&conn==='Y'&&sel==='BC'},
   {t:'تيار الخط في الدلتا',x:'اختر «مولد دلتا» واضبط تيار الطور على <span class="ltr">38 A</span>: تيار الخط <span class="ltr">√3 × 38 = 65.8 A</span> كما في مثال 2-1-2، والجهد بين الخطين يساوي جهد الطور.',done:()=>mode==='rel'&&conn==='D'&&Math.abs(Iph-38)<1e-9},
   {t:'حمل متزن: الحيادي بلا تيار',x:'انتقل إلى «الحمل النجمي والتيار الحيادي» واضغط «مثال (2-1-1)»: كل تيار <span class="ltr">25.4 A</span> وبينها 120°، ومضلع الجمع يُغلق فيكون <span class="ltr">I<sub>N</sub> = 0</span>.',done:()=>mode==='load'&&isBal()&&nOn&&E===127&&Math.abs(Z[0].re-3)<1e-9&&Math.abs(Z[0].im-4)<1e-9},
   {t:'حمل غير متزن',get x(){const u=ubZ();return `اضغط «حمل غير متزن» (Z<sub>b</sub> = ${lt(zs(u[1],1)+' Ω')} و Z<sub>c</sub> = ${lt(zs(u[2],1)+' Ω')}${TP.trainer?' من قيم المدرب':'، أرقام توضيحية'}) أو أطفئ «متزن» وحرّك أي فرع: مضلع الجمع لا يُغلق ويمر تيار في الحيادي.`},done:()=>mode==='load'&&!isBal()&&nOn&&cabs(st().IN)>0.1},
   {t:'افصل الحيادي والحمل غير متزن',x:'أطفئ مفتاح «N – n»: تنتقل نقطة n عن N (يظهر جهد بينهما) وتصبح جهود فروع الحمل غير متساوية — لهذا «تبقى الحاجة إلى الموصل الحيادي قائمة» (ص 83).',done:()=>mode==='load'&&!isBal()&&!nOn&&cabs(st().VnN)>1},
   {t:'حمل متزن بلا حيادي',x:'اضغط «مثال (2-1-3)» والحيادي مفصول: جهود الفروع كلها <span class="ltr">120 V</span> والتيارات <span class="ltr">24 A</span> كما لو كان الحيادي موصولاً، فيمكن إزالته في الحمل المتزن (ص 83).',done:()=>mode==='load'&&isBal()&&!nOn&&E===120}
  ]);
  ui();syncZ();draw();
 },
 examples:[
  {title:'مثال (2-1-1)',ref:'ص 83–84',q:'<p>«يغذي مولد حمل حيث أن كلاً من المولد والحمل ثلاثي الأطوار موصول بتوصيلة نجمة كما هو موضح في الشكل 2-8. احسب القيمة الفعالة لجهد الخط وتيارات الخطوط المطاورة، وبين أن التيار الحيادي معدوم.»</p>'+FIG28(),
   given:G211,solve:g=>exYY(g,{dR:2})},
  {title:'مثال (2-1-2)',ref:'ص 85–86',q:'<p>«وصل حمل ثلاثي الأطوار توصيلة دلتا بمولد ذي توصيلة نجمة كما هو مبين في الشكل 2-9. احسب تيار كل طور من الحمل وكذلك القيمة الفعالة لتيار الخط.»</p>'+FIG29(),
   given:G212,solve:(g,B,isBook)=>exYD(g,isBook),note:'بقيم الكتاب يُستعمل جهد الخط 380 V كما قرّبه الكتاب؛ إذا غيّرت الأرقام يُقرَّب جهد الخط إلى أقرب فولت.'},
  {title:'مثال (2-1-3)',ref:'ص 86–87',q:'<p>«تتابع الأطوار للمولد الموصل على شكل نجمة في الشكل 2-10 هو ABC والمطلوب ما يلي: أوجد زوايا الطور θ<sub>2</sub>, θ<sub>3</sub>. أوجد مقدار جهود الخطوط. أوجد تيارات الخطوط. اثبت أنه عندما تكون الأحمال متزنة فإن التيار الحيادي معدوم.»</p>'+FIG210(),
   given:G213,solve:g=>exYY(g,{dR:1,seq:true})}
 ],
 quiz:[
  {q:'في توصيلة النجمة، جهد الطور هو الجهد بين:',o:['خطين','أي خط والحيادي','طرفي الحمل كله','الحيادي والأرض'],c:1,e:'ص 80.'},
  {q:'مولد نجمة جهد طوره 127 V. جهد الخط:',o:['127 V','73.3 V','220 V','381 V'],c:2,e:'\\(V_L=\\sqrt3\\times127=220\\) V (مثال 2-1-1).'},
  {q:'في توصيلة النجمة، جهد الخط \\(\\bar V_{AB}\\) بالنسبة لجهد الطور \\(\\bar V_{AN}\\):',o:['متأخر 30°','متقدم 30°','في نفس الطور','متقدم 120°'],c:1,e:'المعادلة (2-3): \\(V_{ph}\\sqrt3\\angle30^\\circ\\).'},
  {q:'في توصيلة الدلتا:',o:['جهد الخط = √3 × جهد الطور','تيار الخط = تيار الطور','جهد الخط = جهد الطور وتيار الخط = √3 × تيار الطور','يوجد طرف محايد'],c:2,e:'ص 82 والمعادلة (2-7).'},
  {q:'حمل دلتا تيار كل طور فيه 38 A. تيار الخط:',o:['38 A','21.9 A','65.8 A','114 A'],c:2,e:'\\(\\sqrt3\\times38=65.8\\) A (مثال 2-1-2).'},
  {q:'في حمل نجمي متزن، التيار في الحيادي:',o:['يساوي تيار الخط','يساوي ثلاثة أضعاف تيار الخط','صفر','√3 × تيار الخط'],c:2,e:'المعادلة (2-8).'},
  {q:'لماذا تبقى الحاجة إلى الموصل الحيادي قائمة في الواقع؟',o:['لأن الجهد مرتفع','لأن كثيراً من الأحمال ليست متزنة','لأن الدلتا تحتاجه','لتقليل التردد'],c:1,e:'ص 83.'},
  {q:'في مثال 2-1-3: تتابع الأطوار ABC. الزاوية θ<sub>2</sub> للطور B:',o:['120°','−120°','−240°','0°'],c:1,e:'ص 87: θ2 = −120° و θ3 = −240° = 120°.'}
 ]
});

/* ======================================================================
   Lesson 3 — star ↔ delta conversion (ص 87–90)
   ====================================================================== */
const lz=(re,im)=>{const r=B.round(re,6),i=B.round(im,6);const jt=v=>Math.abs(v)===1?'j':'j'+fm(Math.abs(v));if(i===0)return ltx(r);if(r===0)return (i<0?'-':'')+jt(i);return `${ltx(r)}${i<0?'-':'+'}${jt(i)}`};
/* الأشكال (2-11) – (2-13): delta (left) and star (right). o={d:[ab,bc,ca],y:[an,bn,cn],ar:'both'|'toD'|'toY',hl:'AB'|'BC'|'CA',bad} */
function dyeSVG(o){o=o||{};const d=o.d||['','',''],y=o.y||['','',''],hl=o.hl||'';
  const A=[190,62],Cq=[100,215],Bq=[280,215],N=[500,130],YA=[500,40],YC=[410,215],YB=[590,215];
  const tm=(x,y,l,on,dx,dy,an)=>`<circle cx="${x}" cy="${y}" r="6" fill="${on?'var(--stop-soft)':'var(--surface)'}" stroke="var(${on?'--stop':'--fg'})" stroke-width="2"/>`+S.t(x+(dx||0),y+(dy||0),l,on?'':'',an||'middle');
  const on=k=>hl.indexOf(k)>=0;
  let s=`<svg viewBox="0 0 660 270" role="img" aria-label="${o.aria||'التحويل بين النجمة والدلتا'}">`;
  // delta
  s+=`<path class="w" d="M190 62V22M100 215H64M280 215H316"/>`;
  s+=zb(A[0],A[1],Bq[0],Bq[1],d[0],{side:-1,off:24,anchor:'start',col:o.dcol||'--fg'})+zb(Bq[0],Bq[1],Cq[0],Cq[1],d[1],{side:-1,off:24,anchor:'middle',col:o.dcol||'--fg'})+zb(Cq[0],Cq[1],A[0],A[1],d[2],{side:-1,off:24,anchor:'end',col:o.dcol||'--fg'});
  s+=ct(216,148,'ZAB','--muted','end',11)+ct(190,200,'ZBC','--muted','middle',11)+ct(164,148,'ZCA','--muted','start',11);
  s+=dot(A[0],A[1])+dot(Bq[0],Bq[1])+dot(Cq[0],Cq[1]);
  s+=tm(190,22,'A',on('A'),-14,5,'end')+tm(316,215,'B',on('B'),0,24)+tm(64,215,'C',on('C'),0,24);
  // star
  s+=`<path class="w" d="M410 215H384M590 215H616"/>`;
  s+=zb(N[0],N[1],YA[0],YA[1]+6,y[0],{side:1,off:22,anchor:'start',col:o.ycol||'--fg'})+zb(N[0],N[1],YB[0],YB[1],y[1],{side:-1,off:22,anchor:'start',col:o.ycol||'--fg'})+zb(N[0],N[1],YC[0],YC[1],y[2],{side:1,off:22,anchor:'end',col:o.ycol||'--fg'});
  s+=ct(484,92,'ZAN','--muted','end',11)+ct(532,192,'ZBN','--muted','end',11)+ct(468,192,'ZCN','--muted','start',11);
  s+=dot(N[0],N[1])+S.t(N[0]-10,N[1]+4,'N','','end');
  s+=tm(500,40,'A',on('A'),-14,5,'end')+tm(616,215,'B',on('B'),0,24)+tm(384,215,'C',on('C'),0,24);
  // arrow
  const ar=o.ar||'both';if(ar==='both')s+=dbl(318,60,378,60,'--blue');else if(ar==='toD')s+=arrow(378,60,318,60,'--blue',2.4);else s+=arrow(318,60,378,60,'--blue',2.4);
  s+=arT(190,262,'دلتا Δ',{fs:13,col:'--muted'})+arT(500,262,'نجمة Y',{fs:13,col:'--muted'});
  if(o.bad)s+=arT(348,40,'غير متكافئتين!',{fs:12,col:'--stop'});
  return s+'</svg>'}
/* conversions (2-9), (2-10) */
const y2d=(a,b,c)=>{const n=csum([cmul(a,b),cmul(b,c),cmul(c,a)]);return {n,ab:cdiv(n,c),bc:cdiv(n,a),ca:cdiv(n,b)}};
const d2y=(ab,bc,ca)=>{const s=csum([ab,bc,ca]);return {s,an:cdiv(cmul(ab,ca),s),bn:cdiv(cmul(ab,bc),s),cn:cdiv(cmul(bc,ca),s)}};
const cstr=(z,d)=>`(${lz(B.round(z.re,d==null?6:d),B.round(z.im,d==null?6:d))})`;
const G214=[{id:'Ra',label:'Z<sub>AN</sub>: المقاومة',sym:'',unit:'Ω',value:3},{id:'Xa',label:'Z<sub>AN</sub>: الممانعة',sym:'',unit:'Ω',value:2},
 {id:'Rb',label:'Z<sub>BN</sub>: المقاومة',sym:'',unit:'Ω',value:1},{id:'Xb',label:'Z<sub>BN</sub>: الممانعة',sym:'',unit:'Ω',value:1},
 {id:'Rc',label:'Z<sub>CN</sub>: المقاومة',sym:'',unit:'Ω',value:1},{id:'Xc',label:'Z<sub>CN</sub>: الممانعة',sym:'',unit:'Ω',value:2}];
const G215=[{id:'Rab',label:'Z<sub>AB</sub>: المقاومة',sym:'',unit:'Ω',value:0},{id:'Xab',label:'Z<sub>AB</sub>: الممانعة',sym:'',unit:'Ω',value:4},
 {id:'Rbc',label:'Z<sub>BC</sub>: المقاومة',sym:'',unit:'Ω',value:2},{id:'Xbc',label:'Z<sub>BC</sub>: الممانعة',sym:'',unit:'Ω',value:3},
 {id:'Rca',label:'Z<sub>CA</sub>: المقاومة',sym:'',unit:'Ω',value:1},{id:'Xca',label:'Z<sub>CA</sub>: الممانعة',sym:'',unit:'Ω',value:3}];
function ex214(g){const a=C(g.Ra,g.Xa),b=C(g.Rb,g.Xb),c=C(g.Rc,g.Xc);const r=y2d(a,b,c);const sa=cstr(a),sb_=cstr(b),sc=cstr(c);
  if([a,b,c].some(z=>cabs(z)<1e-9))return [{t:'إحدى معاوقات النجمة صفر: لا يمكن القسمة عليها.'}];
  const num=`${sa}${sb_}+${sb_}${sc}+${sc}${sa}`;const out=[];
  out.push({t:'البسط المشترك في القوانين 2-9 (خطوة توضيحية — الكتاب يكتب النتيجة مباشرة):',f:`Z_{AN}Z_{BN}+Z_{BN}Z_{CN}+Z_{CN}Z_{AN}=${cstr(cmul(a,b),4)}+${cstr(cmul(b,c),4)}+${cstr(cmul(c,a),4)}`,v:rs(B.round(r.n.re,4),B.round(r.n.im,4)),unit:'Ω²'});
  out.push({t:'بتطبيق القوانين 2-9 نحصل على:',f:`Z_{AB}=\\frac{${num}}{${sc}}`,v:rs(r.ab.re,r.ab.im,1),unit:'Ω',final:true});
  out.push({f:`Z_{BC}=\\frac{${num}}{${sa}}`,v:rs(r.bc.re,r.bc.im,1),unit:'Ω',final:true});
  out.push({f:`Z_{CA}=\\frac{${num}}{${sb_}}`,v:rs(r.ca.re,r.ca.im,1),unit:'Ω',final:true});
  return out}
function ex215(g,bookAN){const ab=C(g.Rab,g.Xab),bc=C(g.Rbc,g.Xbc),ca=C(g.Rca,g.Xca);const r=d2y(ab,bc,ca);
  if(cabs(r.s)<1e-9)return [{t:'مجموع معاوقات الدلتا صفر: لا يمكن القسمة عليه.'}];
  const den=`${cstr(ab)}+${cstr(bc)}+${cstr(ca)}`;const out=[];
  out.push({t:'مقام القوانين 2-10 (خطوة توضيحية):',f:`Z_{AB}+Z_{BC}+Z_{CA}=${den}`,v:rs(B.round(r.s.re,4),B.round(r.s.im,4)),unit:'Ω'});
  if(bookAN){out.push({t:'بتطبيق القوانين 2-10 (كما طُبع في الكتاب):',f:`Z_{AN}=\\frac{${cstr(ab)}${cstr(ca)}}{${den}}`,v:'0.04 + j1.10',unit:'Ω'});
    out.push({t:'<span style="color:var(--stop)">خطأ حسابي في الكتاب: الجزء التخيلي الصحيح 1.21 وليس 1.10 — \\(\\frac{-12+j4}{3+j10}=\\frac{4+j132}{109}\\).</span> المصحح:',v:rs(r.an.re,r.an.im,2),unit:'Ω',final:true})}
  else out.push({t:'بتطبيق القوانين 2-10 نحصل على:',f:`Z_{AN}=\\frac{${cstr(ab)}${cstr(ca)}}{${den}}`,v:rs(r.an.re,r.an.im,2),unit:'Ω',final:true});
  out.push({f:`Z_{BN}=\\frac{${cstr(ab)}${cstr(bc)}}{${den}}`,v:rs(r.bn.re,r.bn.im,1),unit:'Ω',final:true});
  out.push({f:`Z_{CN}=\\frac{${cstr(bc)}${cstr(ca)}}{${den}}`,v:rs(r.cn.re,r.cn.im,1),unit:'Ω',final:true});
  return out}
const Q214='<p>«ارسم دائرة الدلتا المكافئة لدائرة النجمة الموضحة في الشكل 2-12.»</p>';
const Q215='<p>«ارسم دائرة النجمة المكافئة لدائرة الدلتا الموضحة في الشكل 2-13.»</p>';
const FIG212=()=>box(dyeSVG({y:['3+j2 Ω','1+j Ω','1+j2 Ω'],ar:'toD',aria:'الشكل 2-12'}),640);
const FIG213=()=>box(dyeSVG({d:['j4 Ω','2+j3 Ω','1+j3 Ω'],ar:'toY',aria:'الشكل 2-13'}),640);

B.lesson({
 id:'u2-l3',unit:2,order:3,pages:'87–90',
 title:'التحويل من أحمال موصلة نجمة إلى دلتا والعكس',
 summary:'قانونان يحولان ثلاث معاوقات نجمة إلى دلتا مكافئة (2-9) أو العكس (2-10) حتى تسهل الحسابات، وفي الحمل المتزن تكون معاوقة الدلتا ثلاثة أضعاف معاوقة النجمة. مع المثالين (2-1-4) و(2-1-5).',
 theory:[
  {h:'2-6 التحويل من أحمال موصلة نجمة إلى دلتا والعكس',ref:'ص 87',html:'<p>«في كثير من الحالات نحتاج إلى تحويل توصيلة النجمة للأحمال إلى توصيلة دلتا مكافئة والعكس وذلك <b>لتسهيل الحسابات</b>، ويوضح الشكل 2-11 كيفية التحويل.»</p>'},
  {fig:'(2-11)',ref:'ص 87',caption:'دلتا (يسار) معاوقاتها Z<sub>AB</sub> و Z<sub>BC</sub> و Z<sub>CA</sub>، ونجمة (يمين) معاوقاتها Z<sub>AN</sub> و Z<sub>BN</sub> و Z<sub>CN</sub>، والأطراف A و B و C نفسها في الدائرتين.',draw:()=>box(dyeSVG({ar:'both',aria:'الشكل 2-11'}),640)},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب) — ما معنى «مكافئة»؟</b> لو قسنا المعاوقة بين أي طرفين (والطرف الثالث مفتوح) لوجدناها متساوية في الدائرتين، فلا يميز المصدر الموصول بالأطراف A و B و C بين الدائرتين. سترى ذلك بالقياس في المختبر.'},
  {h:'2-6-1 التحويل من توصيلة نجمة إلى توصيلة دلتا مكافئة',ref:'ص 87–88',html:`<p>«في هذه الحالة تكون <b>معاوقات النجمة معلومة</b> ونحسب معاوقات الدلتا المكافئة بالقوانين التالية:»</p>
   $$\\begin{aligned}Z_{AB}&=\\frac{Z_{AN}Z_{BN}+Z_{BN}Z_{CN}+Z_{CN}Z_{AN}}{Z_{CN}}\\\\ Z_{BC}&=\\frac{Z_{AN}Z_{BN}+Z_{BN}Z_{CN}+Z_{CN}Z_{AN}}{Z_{AN}}\\\\ Z_{CA}&=\\frac{Z_{AN}Z_{BN}+Z_{BN}Z_{CN}+Z_{CN}Z_{AN}}{Z_{BN}}\\end{aligned}\\qquad (2\\text{-}9)$$`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب) — طريقة الحفظ:</b> البسط واحد في القوانين الثلاثة (مجموع حواصل ضرب كل معاوقتين). والمقام هو معاوقة النجمة <b>المقابلة</b> لضلع الدلتا (التي لا تلمس طرفيه): الضلع AB يقابله Z<sub>CN</sub>، والضلع BC يقابله Z<sub>AN</sub>، والضلع CA يقابله Z<sub>BN</sub>.'},
  {h:'مثال 2-1-4',ref:'ص 88',html:Q214},
  {fig:'(2-12)',ref:'ص 88',caption:'المعطى نجمة: Z<sub>AN</sub> = 3+j2 Ω و Z<sub>BN</sub> = 1+j Ω و Z<sub>CN</sub> = 1+j2 Ω، والمطلوب الدلتا المكافئة (السهم من النجمة إلى الدلتا).',draw:FIG212},
  {html:`<p><b>الحل:</b> «بتطبيق القوانين 2-9 نحصل على»</p>
   $$Z_{AB}=\\frac{(3+j2)(1+j2)+(1+j2)(1+j)+(1+j)(3+j2)}{1+j2}=6.2+j3.6\\ \\Omega$$
   $$Z_{BC}=\\frac{(3+j2)(1+j2)+(1+j2)(1+j)+(1+j)(3+j2)}{3+j2}=2.2+j3.8\\ \\Omega$$
   $$Z_{CA}=\\frac{(3+j2)(1+j2)+(1+j2)(1+j)+(1+j)(3+j2)}{1+j}=7.5+j8.5\\ \\Omega$$
   <p class="sub">البسط في الثلاثة = \\((-1+j8)+(-1+j3)+(1+j5)=-1+j16\\) (توضيح).</p>`},
  {h:'2-6-2 التحويل من توصيلة دلتا إلى توصيلة نجمة مكافئة',ref:'ص 88–89',html:`<p>«أما في هذه الحالة فتكون <b>معاوقات الدلتا معلومة</b> ونحسب معاوقات النجمة المكافئة بالقوانين التالية:»</p>
   $$\\begin{aligned}Z_{AN}&=\\frac{Z_{AB}Z_{CA}}{Z_{AB}+Z_{BC}+Z_{CA}}\\\\ Z_{BN}&=\\frac{Z_{AB}Z_{BC}}{Z_{AB}+Z_{BC}+Z_{CA}}\\\\ Z_{CN}&=\\frac{Z_{BC}Z_{CA}}{Z_{AB}+Z_{BC}+Z_{CA}}\\end{aligned}\\qquad (2\\text{-}10)$$
   <p>«وإذا كانت الأحمال متزنة أي \\(Z_{AN}=Z_{BN}=Z_{CN}=Z_Y\\) فستكون \\(Z_{AB}=Z_{BC}=Z_{CA}=Z_\\Delta\\) مع»</p>
   $$Z_\\Delta=3\\,Z_Y\\qquad\\left(Z_Y=\\frac{Z_\\Delta}{3}\\right)\\qquad (2\\text{-}11)$$`},
  {err:'المعادلة (2-11) طُبعت \\(Z_\\Delta=\\dfrac{Z_Y}{3}\\) وهذا خطأ؛ الصحيح \\(Z_\\Delta=3Z_Y\\). من (2-9) مع ثلاث معاوقات متساوية: \\(Z_\\Delta=\\dfrac{3Z_Y^2}{Z_Y}=3Z_Y\\)، ومن (2-10): \\(Z_Y=\\dfrac{Z_\\Delta^2}{3Z_\\Delta}=\\dfrac{Z_\\Delta}{3}\\). في المختبر مفتاح «كما في الكتاب / المصحح» للمعادلة (2-11) يبين بالقياس أن صيغة الكتاب لا تعطي دائرة مكافئة.'},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> حمل دلتا متزن \\(6+j8\\ \\Omega\\) (مثال 2-1-2) يكافئ نجمة \\(2+j2.67\\ \\Omega\\). بجهد طور <span class="ltr">220 V</span> يكون تيار الخط \\(220/|2+j2.67|=220/3.33=66.0\\) A مباشرة دون حساب تيارات الدلتا — نفس نتيجة المثال (65.8 A في الكتاب لأنه قرّب جهد الخط إلى 380 V). هذا هو «تسهيل الحسابات».'},
  {h:'مثال 2-1-5',ref:'ص 89–90',html:Q215},
  {fig:'(2-13)',ref:'ص 89',caption:'المعطى دلتا: Z<sub>AB</sub> = j4 Ω و Z<sub>BC</sub> = 2+j3 Ω و Z<sub>CA</sub> = 1+j3 Ω، والمطلوب النجمة المكافئة (السهم من الدلتا إلى النجمة).',draw:FIG213},
  {html:`<p><b>الحل:</b> «بتطبيق القوانين 2-10 نحصل على» (المقام \\(=(1+j3)+(j4)+(2+j3)=3+j10\\)):</p>
   $$Z_{AN}=\\frac{(1+j3)(j4)}{(1+j3)+(j4)+(2+j3)}=0.04+j1.21\\ \\Omega\\quad(\\text{طُبع في الكتاب } 0.04+j1.10)$$
   $$Z_{BN}=\\frac{(2+j3)(j4)}{(1+j3)+(j4)+(2+j3)}=0.4+j1.3\\ \\Omega\\qquad Z_{CN}=\\frac{(1+j3)(2+j3)}{(1+j3)+(j4)+(2+j3)}=0.6+j0.9\\ \\Omega$$`},
  {err:'مثال 2-1-5 (ص 90): طُبع \\(Z_{AN}=0.04+j1.10\\ \\Omega\\)، والصحيح \\(\\dfrac{(1+j3)(j4)}{3+j10}=\\dfrac{-12+j4}{3+j10}=\\dfrac{4+j132}{109}=0.04+j1.21\\ \\Omega\\). قيمتا Z<sub>BN</sub> و Z<sub>CN</sub> صحيحتان. في تبويب «الأمثلة المحلولة» حلّان: كما في الكتاب، والمصحح.'},
  {h:'ملاحظات على الكتاب',html:`<ul><li>ص 88: نص مثال 2-1-4 طُبع «ارسم دائرة النجمة المكافئة لدائرة الدلتا» بينما المعطى نجمة والمطلوب دلتا (السهم في الشكل 2-12 والحل بالقوانين 2-9). وص 89: نص مثال 2-1-5 طُبع «ارسم دائرة الدلتا المكافئة لدائرة النجمة» والمعطى دلتا. أي أن النصين متبادلان؛ كُتبا هنا مصححين.</li>
   <li>ص 89: المعادلة (2-11) مطبوعة \\(Z_\\Delta=Z_Y/3\\) والصحيح \\(Z_\\Delta=3Z_Y\\) (كُتبت هنا مصححة).</li>
   <li>ص 90: \\(Z_{AN}\\) في مثال 2-1-5 = \\(0.04+j1.21\\) وليس \\(0.04+j1.10\\).</li></ul>`}
 ],
 lab:(el)=>{
  let dir='y2d',inp=[C(3,2),C(1,1),C(1,2)],bal=false,rule='fix',pair='AB',pre='e4';const did={};
  el.innerHTML=`<div class="grid k3-lab">
   <div class="panel c12"><h2>محوِّل نجمة ↔ دلتا مع جهاز قياس المعاوقة <small>مبني على الأشكال (2-11) – (2-13) والقوانين (2-9) – (2-11)</small></h2>
    <div class="k3-row"><div><div class="sub">الاتجاه</div>${segHTML('dr',[['y2d','نجمة معلومة ← دلتا مكافئة (2-9)'],['d2y','دلتا معلومة ← نجمة مكافئة (2-10)']],dir)}</div></div>
    <div class="k3-row"><button class="btn" data-pre="e4">مثال (2-1-4)</button><button class="btn" data-pre="e5">مثال (2-1-5)</button><button class="btn" data-pre="bal">حمل متزن ${lt('3+j4 Ω')}</button>${swHTML('l3bal','متزن','الفروع الثلاثة معاً',bal)}</div>
    <div class="k3-zin" id="l3in"></div>
    <div id="l3rw" class="k3-row"></div></div>
   <div class="panel c7"><h2>الدائرتان <small id="l3cap"></small></h2><div class="svgbox" id="l3c" style="max-width:660px;margin-inline:auto"></div>
    <div class="facts" id="l3out"></div><p class="sub" id="l3n"></p></div>
   <div class="panel c5"><h2>القياس بين طرفين <small>والطرف الثالث مفتوح</small></h2>
    <div class="k3-row">${segHTML('pr',[['AB','A – B'],['BC','B – C'],['CA','C – A']],pair)}</div>
    <div id="l3m"></div><p class="sub">نجمة: معاوقتان على التوالي. دلتا: ضلع على التوازي مع الضلعين الآخرين على التوالي (توضيح — ليس من الكتاب).</p></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l3st"></ol></div></div>`;
  B.math(el);const $=s=>el.querySelector(s);
  const names=()=>dir==='y2d'?['Z<sub>AN</sub>','Z<sub>BN</sub>','Z<sub>CN</sub>']:['Z<sub>AB</sub>','Z<sub>BC</sub>','Z<sub>CA</sub>'];
  const isBal=()=>inp.every(z=>Math.abs(z.re-inp[0].re)<1e-9&&Math.abs(z.im-inp[0].im)<1e-9);
  const buildIn=()=>{$('#l3in').innerHTML=[0,1,2].map(k=>`<div class="k3-zr"><h4><span>${names()[k]} (المعلومة)</span><b id="l3z${k}"></b></h4><div class="k3-sls">${sl('l3r'+k,'R',0,10,0.1,inp[k].re)}${sl('l3x'+k,'X',-10,10,0.1,inp[k].im)}</div></div>`).join('');
   [0,1,2].forEach(k=>{const f=()=>{const z=C(+$('#l3r'+k).value,+$('#l3x'+k).value);if(bal)inp=[0,1,2].map(()=>C(z.re,z.im));else inp[k]=z;pre='';syncIn();draw()};$('#l3r'+k).oninput=f;$('#l3x'+k).oninput=f})};
  const syncIn=()=>[0,1,2].forEach(k=>{$('#l3r'+k).value=inp[k].re;$('#l3x'+k).value=inp[k].im});
  const preset=p=>{pre=p;if(p==='e4'){dir='y2d';inp=[C(3,2),C(1,1),C(1,2)];bal=false}else if(p==='e5'){dir='d2y';inp=[C(0,4),C(2,3),C(1,3)];bal=false}else{inp=[C(3,4),C(3,4),C(3,4)];bal=true}
   segSet(el,'dr',dir);$('#l3bal').setAttribute('aria-pressed',String(bal));buildIn();draw()};
  el.querySelectorAll('[data-pre]').forEach(b=>b.onclick=()=>preset(b.dataset.pre));
  $('#l3bal').onclick=()=>{bal=!bal;$('#l3bal').setAttribute('aria-pressed',String(bal));if(bal){inp=[0,1,2].map(()=>C(inp[0].re,inp[0].im));syncIn()}pre='';draw()};
  segBind(el,'dr',v=>{dir=v;pre='';buildIn();draw()});segBind(el,'pr',v=>{pair=v;did['p'+v]=1;draw()});
  const calc=()=>{const bl=isBal();const z0=inp[0];let Y,Dl,bad=false;
   if(inp.some(z=>cabs(z)<1e-9))return {err:'إحدى المعاوقات صفر (R = 0 و X = 0): لا يمكن التحويل. حرّك أحد المنزلقين.'};
   if(dir==='y2d'){Y=inp.slice();if(bl&&rule==='book'){Dl=[0,1,2].map(()=>csc(z0,1/3));bad=true}else{const r=y2d(...inp);Dl=[r.ab,r.bc,r.ca]}}
   else{Dl=inp.slice();if(bl&&rule==='book'){Y=[0,1,2].map(()=>csc(z0,3));bad=true}else{const s=csum(inp);if(cabs(s)<1e-9)return {err:'مجموع معاوقات الدلتا صفر: لا يمكن القسمة عليه.'};const r=d2y(...inp);Y=[r.an,r.bn,r.cn]}}
   const PR={AB:[0,1,0,1,2],BC:[1,2,1,2,0],CA:[2,0,2,0,1]};
   const meas=k=>{const [y1,y2,d0,d1,d2]=PR[k];return {y:cadd(Y[y1],Y[y2]),d:cpar(Dl[d0],cadd(Dl[d1],Dl[d2]))}};
   return {Y,Dl,bad,M:{AB:meas('AB'),BC:meas('BC'),CA:meas('CA')}}};
  let R=null;
  const draw=()=>{const bl=isBal();
   [0,1,2].forEach(k=>{$('#l3r'+k+'-v').textContent=fm(inp[k].re,1)+' Ω';$('#l3x'+k+'-v').textContent=neg(inp[k].im,1)+' Ω';$('#l3z'+k).textContent=zs(inp[k],1)+' Ω'});
   $('#l3rw').innerHTML=bl?`<div><div class="sub">الحمل متزن: طريقة الحساب</div>${segHTML('rl',[['fix','المعادلة (2-11) المصححة: Z<sub>Δ</sub> = 3 Z<sub>Y</sub>'],['book','المعادلة (2-11) كما في الكتاب: Z<sub>Δ</sub> = Z<sub>Y</sub>/3']],rule)}</div>`:'<span class="sub">الحمل غير متزن: تُستعمل القوانين العامة (2-9) أو (2-10). (مفتاح المعادلة 2-11 يظهر عندما تتساوى الفروع الثلاثة.)</span>';
   segBind($('#l3rw'),'rl',v=>{rule=v;did['r'+v]=1;draw()});
   R=calc();
   $('#l3cap').textContent=dir==='y2d'?'المعلوم: النجمة (أزرق) — المحسوب: الدلتا':'المعلوم: الدلتا (أزرق) — المحسوب: النجمة';
   if(R.err){$('#l3c').innerHTML=dyeSVG({ar:dir==='y2d'?'toD':'toY'});$('#l3out').innerHTML='';$('#l3m').innerHTML=`<div class="callout err">${R.err}</div>`;$('#l3n').textContent='';steps.check();return}
   const lab=z=>zs(z,2)+' Ω';
   $('#l3c').innerHTML=dyeSVG({d:R.Dl.map(lab),y:R.Y.map(lab),ar:dir==='y2d'?'toD':'toY',hl:pair,dcol:dir==='d2y'?'--blue':(R.bad?'--stop':'--fg'),ycol:dir==='y2d'?'--blue':(R.bad?'--stop':'--fg'),bad:R.bad&&!sameAll()});
   const outN=dir==='y2d'?['Z<sub>AB</sub>','Z<sub>BC</sub>','Z<sub>CA</sub>']:['Z<sub>AN</sub>','Z<sub>BN</sub>','Z<sub>CN</sub>'],outV=dir==='y2d'?R.Dl:R.Y;
   $('#l3out').innerHTML=outV.map((z,i)=>`<div class="fact"><span>${outN[i]} المحسوبة</span><b>${zs(z,2)} Ω</b></div>`).join('')+(bl?`<div class="fact"><span>Z<sub>Δ</sub> ÷ Z<sub>Y</sub></span><b>${fm(cabs(R.Dl[0])/cabs(R.Y[0]),3)}</b></div>`:'');
   $('#l3n').innerHTML=pre==='e5'?'Z<sub>AN</sub> الصحيحة <span class="ltr">0.04 + j1.21 Ω</span>، وطبعها الكتاب <span class="ltr">0.04 + j1.10 Ω</span> (خطأ حسابي).':pre==='e4'?'بتقريب الكتاب لرقم عشري واحد: <span class="ltr">6.2 + j3.6</span> و <span class="ltr">2.2 + j3.8</span> و <span class="ltr">7.5 + j8.5 Ω</span>.':'';
   $('#l3m').innerHTML=`<div class="k3-cmp">${['AB','BC','CA'].map(k=>{const m=R.M[k],ok=cabs(csub(m.y,m.d))<1e-6*Math.max(1,cabs(m.y));return `<div class="${ok?'ok':'bad'}" ${k===pair?'style="outline:2px solid var(--blue)"':''}><span>بين ${k[0]} و ${k[1]} — في النجمة</span><b>${zs(m.y,3)} Ω</b><span>في الدلتا</span><b>${zs(m.d,3)} Ω</b><span>${ok?'✓ متساويتان: الدائرتان متكافئتان':'✗ مختلفتان: ليست دائرة مكافئة'}</span></div>`}).join('')}</div>`;
   steps.check()};
  const sameAll=()=>R&&!R.err&&['AB','BC','CA'].every(k=>cabs(csub(R.M[k].y,R.M[k].d))<1e-6*Math.max(1,cabs(R.M[k].y)));
  const steps=stepsUI($('#l3st'),[
   {t:'مثال (2-1-4): نجمة ← دلتا',x:'اضغط «مثال (2-1-4)»: المعلوم نجمة \\(3+j2\\) و \\(1+j\\) و \\(1+j2\\ \\Omega\\)، والدلتا المكافئة من القوانين (2-9): \\(6.2+j3.6\\) و \\(2.23+j3.85\\) و \\(7.5+j8.5\\ \\Omega\\).',done:()=>pre==='e4'&&dir==='y2d'},
   {t:'تحقق بالقياس',x:'اختر القياس بين <b>B – C</b> ثم <b>C – A</b>: المعاوقة بين كل طرفين واحدة في النجمة والدلتا — هذا معنى «مكافئة».',done:()=>did.pBC&&did.pCA&&sameAll()},
   {t:'مثال (2-1-5): دلتا ← نجمة',x:'اضغط «مثال (2-1-5)»: النجمة المكافئة من القوانين (2-10): \\(Z_{AN}=0.04+j1.21\\)، \\(Z_{BN}=0.40+j1.32\\)، \\(Z_{CN}=0.63+j0.89\\ \\Omega\\). لاحظ أن الكتاب طبع \\(j1.10\\) لـ \\(Z_{AN}\\).',done:()=>pre==='e5'&&dir==='d2y'},
   {t:'حمل متزن',x:'اختر «نجمة معلومة ← دلتا مكافئة» ثم «حمل متزن 3+j4 Ω»: الدلتا المكافئة \\(9+j12\\ \\Omega\\) في كل ضلع، أي \\(Z_\\Delta=3Z_Y\\) (النسبة 3).',done:()=>isBal()&&dir==='y2d'&&rule==='fix'&&Math.abs(inp[0].re-3)<1e-9&&Math.abs(inp[0].im-4)<1e-9},
   {t:'المعادلة (2-11) كما في الكتاب',x:'اختر «المعادلة (2-11) كما في الكتاب»: تصبح الدلتا \\(1+j1.33\\ \\Omega\\) والقياسات بين الأطراف لا تتساوى (أحمر) — صيغة الكتاب خطأ. ارجع إلى «المصححة».',done:()=>isBal()&&rule==='book'},
   {t:'جرّب أرقامك',x:'أطفئ «متزن» وحرّك أي منزلق: مهما كانت المعاوقات، القياس بين كل طرفين يبقى متساوياً في الدائرتين ما دام الحساب بالقوانين (2-9) و(2-10).'}
  ]);
  buildIn();draw();
 },
 examples:[
  {title:'مثال (2-1-4)',ref:'ص 88',q:Q214+FIG212(),given:G214,solve:g=>ex214(g),note:'بتقريب الكتاب لرقم عشري واحد. الدقيق: \\(Z_{BC}=2.23+j3.85\\ \\Omega\\).'},
  {title:'مثال (2-1-5) — كما في الكتاب',ref:'ص 89–90',q:Q215+FIG213(),given:G215,solve:(g,B,isBook)=>ex215(g,isBook),
   note:'<b>ملاحظة على الكتاب:</b> بقيم الكتاب يُعرض \\(Z_{AN}\\) كما طُبع (0.04 + j1.10) ثم القيمة المصححة. إذا غيّرت الأرقام تحسب الحاسبة بالطريقة الصحيحة.'},
  {title:'مثال (2-1-5) — المصحح',ref:'ص 89–90',q:'<p>نفس المثال بحساب صحيح لـ \\(Z_{AN}\\) (حساب مصحح — ليس من الكتاب).</p>',given:G215,solve:g=>ex215(g,false),note:'النتائج المصححة: \\(Z_{AN}=0.04+j1.21\\)، \\(Z_{BN}=0.4+j1.3\\)، \\(Z_{CN}=0.6+j0.9\\ \\Omega\\).'}
 ],
 quiz:[
  {q:'لماذا نحول توصيلة النجمة إلى دلتا مكافئة أو العكس؟',o:['لتغيير القدرة','لتسهيل الحسابات','لتغيير التردد','لإلغاء الحيادي'],c:1,e:'ص 87.'},
  {q:'في القانون (2-9)، مقام \\(Z_{AB}\\) هو:',o:['\\(Z_{AN}\\)','\\(Z_{BN}\\)','\\(Z_{CN}\\)','\\(Z_{AN}+Z_{BN}\\)'],c:2,e:'المقام هو معاوقة النجمة المقابلة للضلع AB.'},
  {q:'في القانون (2-10): \\(Z_{AN}=\\)',o:['\\(\\frac{Z_{AB}Z_{BC}}{Z_{AB}+Z_{BC}+Z_{CA}}\\)','\\(\\frac{Z_{AB}Z_{CA}}{Z_{AB}+Z_{BC}+Z_{CA}}\\)','\\(\\frac{Z_{BC}Z_{CA}}{Z_{AB}+Z_{BC}+Z_{CA}}\\)','\\(Z_{AB}+Z_{CA}\\)'],c:1,e:'ص 89: حاصل ضرب الضلعين الملامسين للطرف A على مجموع الأضلاع.'},
  {q:'حمل نجمة متزن \\(Z_Y=3+j4\\ \\Omega\\). معاوقة كل ضلع في الدلتا المكافئة:',o:['\\(1+j1.33\\ \\Omega\\)','\\(3+j4\\ \\Omega\\)','\\(9+j12\\ \\Omega\\)','\\(6+j8\\ \\Omega\\)'],c:2,e:'\\(Z_\\Delta=3Z_Y\\) (المعادلة 2-11 المصححة).'},
  {q:'حمل دلتا متزن \\(Z_\\Delta=6+j9\\ \\Omega\\). معاوقة كل فرع في النجمة المكافئة:',o:['\\(2+j3\\ \\Omega\\)','\\(18+j27\\ \\Omega\\)','\\(6+j9\\ \\Omega\\)','\\(3+j4.5\\ \\Omega\\)'],c:0,e:'\\(Z_Y=Z_\\Delta/3\\).'},
  {q:'في مثال 2-1-4 كانت النتيجة \\(Z_{CA}=7.5+j8.5\\ \\Omega\\). على أي معاوقة قُسم البسط؟',o:['\\(Z_{AN}=3+j2\\)','\\(Z_{BN}=1+j\\)','\\(Z_{CN}=1+j2\\)','\\(Z_{AB}\\)'],c:1,e:'\\(Z_{CA}\\) مقامها \\(Z_{BN}\\): \\((-1+j16)/(1+j)=7.5+j8.5\\).'},
  {q:'متى تكون النجمة والدلتا «متكافئتين»؟',o:['إذا تساوت المعاوقات في الدائرتين','إذا تساوت المعاوقة المقاسة بين كل طرفين في الدائرتين','إذا كان لهما حيادي','إذا كانت كل المعاوقات مقاومات'],c:1,e:'توضيح: المصدر الموصول بالأطراف لا يميز بينهما.'}
 ]
});

/* ======================================================================
   Lesson 4 — three-phase power, two-wattmeter method, unit problems (ص 91–96)
   ====================================================================== */
/* الشكل (2-16): two-wattmeter connection. o={W1,W2,rev1,rev2,flow} */
function twoWattSVG(o){o=o||{};const fl=o.flow?'live':'';const ya=60,yb=150,yc=240;
  let s=`<svg viewBox="0 0 680 300" role="img" aria-label="طريقة قياس القدرة باستخدام الواتميترين">`;
  s+=`<path class="w ${fl}" d="M40 ${ya}H150M214 ${ya}H470"/><path class="w ${fl}" d="M40 ${yb}H470"/><path class="w ${fl}" d="M40 ${yc}H150M214 ${yc}H470"/>`;
  [[ya,'a'],[yb,'b'],[yc,'c']].forEach(([y,l])=>{s+=term(40,y)+S.t(28,y+4,l,'','end')+S.t(484,y+4,l,'','start')});
  const cc=(y,rev)=>`<rect x="150" y="${y-7}" width="64" height="14" rx="3" fill="var(--surface)" stroke="var(${rev?'--stop':'--fg'})" stroke-width="2.4"/>`+(rev?ct(182,y+4,'⇄','--stop','middle',12):'');
  s+=cc(ya,o.rev1)+cc(yc,o.rev2);
  s+=`<path class="w" d="M262 ${ya}V76"/>`+ind(262,76,262,134,4,'',0.05)+`<path class="w" d="M262 134V${yb}"/>`;
  s+=`<path class="w" d="M262 ${yc}V224"/>`+ind(262,224,262,166,4,'',0.05)+`<path class="w" d="M262 166V${yb}"/>`;
  s+=dot(262,ya)+dot(262,yb)+dot(262,yc);
  s+=`<rect x="136" y="32" width="154" height="94" rx="6" fill="none" stroke="var(--muted)" stroke-dasharray="6 4"/><rect x="136" y="174" width="154" height="94" rx="6" fill="none" stroke="var(--muted)" stroke-dasharray="6 4"/>`;
  s+=S.t(150,48,'W1','b','start')+S.t(150,262,'W2','b','start');
  s+=ct(304,104,'V ab','--muted','start',11)+ct(304,200,'V cb','--muted','start',11);
  if(o.W1)s+=ct(213,22,o.W1,o.r1neg?'--stop':'--blue-ink','middle',12.5);if(o.W2)s+=ct(213,292,o.W2,o.r2neg?'--stop':'--blue-ink','middle',12.5);
  if(o.rev1)s+=arT(214,96,'ملف التيار معكوس',{fs:11,col:'--stop'});if(o.rev2)s+=arT(214,214,'ملف التيار معكوس',{fs:11,col:'--stop'});
  s+=`<rect x="470" y="30" width="180" height="240" rx="8" fill="var(--surface-2)" stroke="var(--fg)" stroke-dasharray="7 5"/>`;
  s+=arT(566,140,'حمل متزن أو غير متزن',{fs:13})+arT(566,164,'توصيلة Y أو Δ',{fs:13});
  return s+'</svg>'}
/* analog wattmeter */
function meterSVG(val,full,lab){const cx=110,cy=112,R=88;const f=val/full,pin=f<-1e-9,fd=pin?-0.06:Math.min(f,1.04),a=(180-180*fd)*D;
  let s=`<svg viewBox="0 0 220 128" role="img" aria-label="${lab}"><path d="M${cx-R} ${cy}A${R} ${R} 0 0 1 ${cx+R} ${cy}" fill="none" stroke="var(--fg)" stroke-width="2"/>`;
  [0,0.25,0.5,0.75,1].forEach(t=>{const b=(180-180*t)*D;s+=`<path d="M${fx(cx+78*Math.cos(b))} ${fx(cy-78*Math.sin(b))}L${fx(cx+R*Math.cos(b))} ${fx(cy-R*Math.sin(b))}" stroke="var(--fg)" stroke-width="1.6"/>`+ct(cx+64*Math.cos(b),cy-64*Math.sin(b)+4,fm(full*t/1000,full>=20000?0:1),'--muted','middle',10)});
  s+=`<path d="M${cx-R-4} ${cy+4}l8 -4" stroke="var(--stop)" stroke-width="3"/>`;
  s+=`<path d="M${cx} ${cy}L${fx(cx+80*Math.cos(a))} ${fx(cy-80*Math.sin(a))}" stroke="var(${pin?'--stop':'--blue'})" stroke-width="3" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="6" fill="var(--fg)"/>`;
  s+=ct(cx,cy-30,lab,'--fg','middle',14)+ct(cx,cy-14,'kW','--muted','middle',10);
  return s+'</svg>'}
const FIG214=()=>box(sysSVG({gen:'none',vab:'380 V',load:'D',z:['Z','Z','Z'],aria:'الشكل 2-14'}),620);
const FIG215=()=>box(sysSVG({gen:'Y',src:['220∠0° V','220∠−120° V','220∠120° V'],load:'D',z:['3−j4 Ω','3−j4 Ω','3−j4 Ω'],neutral:'none',aria:'الشكل 2-15'}),640);
const FIGP1=()=>box(sysSVG({gen:'Y',srcSym:'circle',src:['220∠0° V','220∠−120° V','220∠−240° V'],lineZ:'2−j2 Ω',load:'Y',z:['8+j8 Ω','8+j8 Ω','8+j8 Ω'],neutral:'none',names:{A:'a',B:'b',C:'c',N:'n',a:'A',b:'B',c:'C',n:''},aria:'شكل 1 من مسائل الوحدة'}),640);
const FIGP2=()=>box(sysSVG({gen:'Y',srcSym:'circle',src:['Van','Vbn','Vcn'],load:'D',z:['Z','Z','Z'],cur:{A:'Ia',B:'Ib',C:'Ic'},curL:['IAB','IBC','ICA'],neutral:'none',names:{A:'a',B:'b',C:'c',N:'n',a:'A',b:'B',c:'C'},aria:'شكل 2 من مسائل الوحدة'}),640);
const PRB=(n,q,fig,ans)=>`<div class="k3-q"><p><b>${n}</b> ${q}</p>${fig||''}<details><summary>إجابة مقترحة (ليست من الكتاب)</summary><div class="k3-ans">${ans}</div></details></div>`;

/* worked examples */
function ex221(g){const out=[],Zm=B.round(Math.hypot(g.R,g.X),2),th=B.round(Math.atan2(g.X,g.R)/D,1);if(!(Zm>0))return [{t:'المعاوقة صفر.'}];
  out.push({f:`Z=${lrs(g.R,g.X)}\\ \\Omega=${lps(Zm,th)}\\ \\Omega`});
  const Ip=B.round(g.VL/Zm,2);out.push({t:'تيار الطور (جهد الطور في الدلتا = جهد الخط):',f:`I_{ph}=\\frac{V_L}{Z}=\\frac{${fm(g.VL)}}{${fm(Zm)}}`,v:Ip,unit:'A'});
  const IL=B.round(SQ3*Ip,1);out.push({f:`I_L=\\sqrt3\\,I_{ph}=\\sqrt3\\times ${fm(Ip)}`,v:IL,unit:'A'});
  const S0=SQ3*g.VL*IL;
  out.push({t:'القدرة الفعالة (2-12):',f:`P_T=\\sqrt3\\,V_LI_L\\cos\\theta=\\sqrt3\\times${fm(g.VL)}\\times${fm(IL)}\\times\\cos(${ltx(th,1)}^\\circ)`,v:B.round(S0*Math.cos(th*D)/1000,1),unit:'kW',final:true});
  out.push({t:'القدرة غير الفعالة (2-13):',f:`Q_T=\\sqrt3\\,V_LI_L\\sin\\theta=\\sqrt3\\times${fm(g.VL)}\\times${fm(IL)}\\times\\sin(${ltx(th,1)}^\\circ)`,v:B.round(S0*Math.sin(th*D)/1000,1),unit:'kVAR',final:true});
  out.push({t:'القدرة الظاهرية (2-14):',f:`S_T=\\sqrt3\\,V_LI_L=\\sqrt3\\times${fm(g.VL)}\\times${fm(IL)}`,v:B.round(S0/1000,1),unit:'kVA',final:true});
  if(th<0)out.push({t:'Q سالبة لأن الحمل سعوي (الممانعة سالبة).'});
  return out}
function ex222(g,isBook,fixed){const out=[],exact=SQ3*g.V,VL=isBook?380:B.round(exact,0);const Zm=B.round(Math.hypot(g.R,g.X),2),th=B.round(Math.atan2(g.X,g.R)/D,1);if(!(Zm>0))return [{t:'المعاوقة صفر.'}];
  out.push({f:`V_L=\\sqrt3\\,V_{ph}=\\sqrt3\\times ${fm(g.V)}`,v:VL,unit:'V'});
  if(isBook)out.push({t:`<span class="sub">الدقيق ${fm(exact,2)} V وقرّبه الكتاب إلى 380 V.</span>`});
  out.push({f:`Z=${lrs(g.R,g.X)}\\ \\Omega=${lps(Zm,th)}\\ \\Omega`});
  const I=B.round(VL/Zm,2);out.push({f:`I=\\frac{V_L}{Z}=\\frac{${fm(VL)}}{${fm(Zm)}}`,v:I,unit:'A'});
  const IL=B.round(SQ3*I,1);out.push({f:`I_L=\\sqrt3\\,I_{ph}=\\sqrt3\\times ${fm(I)}`,v:IL,unit:'A'});
  const S0=SQ3*VL*IL,P=B.round(S0*Math.cos(th*D)/1000,0),Qv=B.round(S0*Math.sin(th*D)/1000,0);
  const fP=`P_T=\\sqrt3\\,V_LI_L\\cos\\theta=\\sqrt3\\times${fm(VL)}\\times${fm(IL)}\\times\\cos(${ltx(th,1)}^\\circ)`;
  if(isBook&&!fixed){out.push({t:'كما طُبع في الكتاب (خطأ حسابي):',f:fP,v:25,unit:'kW'});out.push({t:`<span style="color:var(--stop)">المصحح: \\(\\sqrt3\\times380\\times131.6=86.6\\) kVA، و \\(86.6\\times0.6=52\\) kW.</span>`,v:P,unit:'kW',final:true})}
  else out.push({t:'القدرة الفعالة:',f:fP,v:P,unit:'kW',final:true});
  out.push({t:'القدرة غير الفعالة:',f:`Q_T=\\sqrt3\\,V_LI_L\\sin\\theta=\\sqrt3\\times${fm(VL)}\\times${fm(IL)}\\times\\sin(${ltx(th,1)}^\\circ)`,v:Qv,unit:'kVAR',final:true});
  return out}
function exPF(g){const out=[],w1=g.W1,w2=g.W2,P=w1+w2;
  out.push({t:'القدرة الكلية = المجموع الجبري للقراءتين (القراءة السالبة بإشارتها):',f:`P=W_1+W_2=${ltx(w1)}+(${ltx(w2)})`,v:B.round(P,3),unit:'kW'});
  if(Math.abs(P)<1e-9)return out.concat([{t:'P = 0: الحمل مفاعلة نقية، θ = 90° ومعامل القدرة صفر.'}]);
  const t=SQ3*Math.abs(w1-w2)/P,th=Math.atan(t)/D;
  out.push({t:'ظل زاوية الحمل من القراءتين:',f:`\\tan\\theta=\\frac{\\sqrt3\\,|W_1-W_2|}{W_1+W_2}=\\frac{\\sqrt3\\times${fm(Math.abs(w1-w2))}}{${fm(B.round(P,3))}}`,v:B.round(t,3)});
  out.push({f:`\\theta=\\tan^{-1}(${fm(B.round(t,3))})`,v:B.round(th,1),unit:'°'});
  const pf=Math.cos(th*D);out.push({t:'معامل القدرة:',f:`\\cos\\theta=\\cos(${fm(B.round(th,1))}^\\circ)`,v:B.round(pf,3),final:true});
  out.push({t:'القدرة غير الفعالة (مقدارها):',f:`|Q|=\\sqrt3\\,|W_1-W_2|`,v:B.round(SQ3*Math.abs(w1-w2),2),unit:'kVAR'});
  out.push({t:pf<0.5-1e-9?'المعامل أقل من 0.5 — متفق مع قاعدة الكتاب: إحدى القراءتين سالبة.':pf>0.5+1e-9?'المعامل أكبر من 0.5 — القراءتان موجبتان.':'المعامل 0.5 — إحدى القراءتين صفر.'});
  return out}
/* unit problems (suggested answers) */
function pr1(g){const out=[],Zt=C(g.Rl+g.R,g.Xl+g.X),Zm=cabs(Zt),za=cang(Zt);if(!(Zm>0))return [{t:'المعاوقة صفر.'}];
  out.push({t:'المصدر والحمل متزنان، فنقطتا النجمة على جهد واحد (حتى بلا حيادي) ونحل طوراً واحداً: معاوقة الخط على التوالي مع معاوقة الحمل:',f:`Z_T=(${lrs(g.Rl,g.Xl)})+(${lrs(g.R,g.X)})=${lrs(Zt.re,Zt.im,2)}=${lps(Zm,za,2,2)}\\ \\Omega`});
  const I=g.V/Zm;[0,-120,-240].forEach((a,i)=>out.push({t:i?'':'تيارات الخطوط (تساوي تيارات أطوار الحمل):',f:`\\bar I_${'ABC'[i]}=\\frac{${g.V}\\angle ${a}^\\circ}{${lps(Zm,za,2,2)}}=${lps(I,wrap(a-za),2,2)}\\ A`,v:ps(I,wrap(a-za),2,2),unit:'A',final:true}));
  out.push({t:'(إضافة) جهد طور الحمل:',f:`V_{AN}=I\\,|Z_{load}|=${fm(I,2)}\\times${fm(Math.hypot(g.R,g.X),2)}`,v:B.round(I*Math.hypot(g.R,g.X),1),unit:'V'});
  return out}
function pr2(g){const out=[],Z=pol(g.Z,g.za);if(!(g.Z>0))return [{t:'المعاوقة صفر.'}];
  const V=[pol(g.V,g.va),pol(g.V,g.va-120),pol(g.V,g.va+120)],I=V.map(v=>cdiv(v,Z)),nm=['AB','BC','CA'];
  out.push({t:'نفرض تتابع الأطوار ABC (لم يذكره الكتاب)، فجهود الخطوط:',f:`\\bar V_{AB}=${lps(g.V,g.va)},\\ \\bar V_{BC}=${lps(g.V,wrap(g.va-120))},\\ \\bar V_{CA}=${lps(g.V,wrap(g.va+120))}\\ V`});
  I.forEach((z,i)=>out.push({t:i?'':'تيارات الأطوار (جهد كل ضلع من الدلتا = جهد الخط):',f:`\\bar I_{${nm[i]}}=\\frac{\\bar V_{${nm[i]}}}{Z_\\Delta}=\\frac{${lps(g.V,cang(V[i]),2,1)}}{${lps(g.Z,g.za)}}`,v:ps(cabs(z),cang(z),2,1),unit:'A',final:true}));
  const L=[csub(I[0],I[2]),csub(I[1],I[0]),csub(I[2],I[1])];
  L.forEach((z,i)=>out.push({t:i?'':'تيارات الخطوط بقانون كيرشوف عند كل عقدة (= √3 تيار الطور متأخراً 30°):',f:`\\bar I_${'abc'[i]}=\\bar I_{${['AB','BC','CA'][i]}}-\\bar I_{${['CA','AB','BC'][i]}}`,v:ps(cabs(z),cang(z),2,1),unit:'A',final:true}));
  return out}
function pr3(g){const out=[],Z=C(g.R,g.X),Zm=cabs(Z),za=cang(Z);if(!(Zm>0))return [{t:'المعاوقة صفر.'}];
  out.push({f:`Z=${lrs(g.R,g.X)}=${lps(Zm,za,2,2)}\\ \\Omega`});
  const I=g.V/Zm,a=wrap(g.va-za);
  out.push({t:'في الدلتا جهد الحمل في كل طور هو جهد الخط:',f:`\\bar I_{ab}=\\frac{\\bar V_{ab}}{Z}=\\frac{${lps(g.V,g.va)}}{${lps(Zm,za,2,2)}}`,v:ps(I,a,3,2),unit:'A',final:true});
  out.push({t:'وبفرض التتابع ABC:',f:`\\bar I_{bc}=${lps(I,wrap(a-120),3,2)}\\ A,\\qquad \\bar I_{ca}=${lps(I,wrap(a+120),3,2)}\\ A`});
  out.push({t:'(إضافة) تيار الخط:',f:`I_L=\\sqrt3\\,I_{ph}=\\sqrt3\\times${fm(I,3)}`,v:B.round(SQ3*I,2),unit:'A'});
  return out}
const G221=[{id:'VL',label:'جهد الخط',sym:'V_L',unit:'V',value:380},{id:'R',label:'مقاومة كل ضلع',sym:'R',unit:'Ω',value:6},{id:'X',label:'ممانعة كل ضلع (سالبة: سعوية)',sym:'X',unit:'Ω',value:-8}];
const G222=[{id:'V',label:'جهد طور المولد',sym:'V_{ph}',unit:'V',value:220},{id:'R',label:'مقاومة كل ضلع',sym:'R',unit:'Ω',value:3},{id:'X',label:'ممانعة كل ضلع (سالبة: سعوية)',sym:'X',unit:'Ω',value:-4}];
const G223=[{id:'W1',label:'قراءة الجهاز الأول',sym:'W_1',unit:'kW',value:6},{id:'W2',label:'قراءة الثاني بعد عكس ملف تياره',sym:'W_2',unit:'kW',value:2}];
const GPF=[{id:'W1',label:'قراءة W1 بإشارتها',sym:'W_1',unit:'kW',value:6},{id:'W2',label:'قراءة W2 بإشارتها (سالبة إذا عُكس ملفه)',sym:'W_2',unit:'kW',value:-2}];
const GP1=[{id:'V',label:'جهد طور المصدر',sym:'V',unit:'V',value:220},{id:'Rl',label:'معاوقة الخط: R',sym:'',unit:'Ω',value:2},{id:'Xl',label:'معاوقة الخط: X',sym:'',unit:'Ω',value:-2},{id:'R',label:'معاوقة الحمل: R',sym:'',unit:'Ω',value:8},{id:'X',label:'معاوقة الحمل: X',sym:'',unit:'Ω',value:8}];
const GP2=[{id:'V',label:'مقدار V<sub>AB</sub>',sym:'',unit:'V',value:180},{id:'va',label:'زاوية V<sub>AB</sub>',sym:'',unit:'°',value:-20},{id:'Z',label:'مقدار Z<sub>Δ</sub>',sym:'',unit:'Ω',value:20},{id:'za',label:'زاوية Z<sub>Δ</sub>',sym:'',unit:'°',value:40}];
const GP3=[{id:'V',label:'مقدار V<sub>ab</sub>',sym:'',unit:'V',value:22.5},{id:'va',label:'زاوية V<sub>ab</sub>',sym:'',unit:'°',value:35},{id:'R',label:'مقاومة كل ضلع',sym:'R',unit:'Ω',value:18},{id:'X',label:'ممانعة كل ضلع',sym:'X',unit:'Ω',value:12}];
const GP4=[{id:'V',label:'جهد طور المولد',sym:'E_{AN}',unit:'V',value:220},{id:'R',label:'مقاومة كل ضلع',sym:'R',unit:'Ω',value:6},{id:'X',label:'ممانعة كل ضلع',sym:'X',unit:'Ω',value:7}];
const Q221='<p>«احسب القدرات الفعالة والمفاعلة والظاهرية التي يستهلكها الحمل الموضح في الشكل 2-14 علماً أن النظام متزن وأن \\(Z=6-j8\\ \\Omega\\).»</p>';
const Q222='<p>«احسب القدرة الفعالة والقدرة غير الفعالة المستهلكة بالحمل المبين في الشكل 2-15.»</p>';
const Q223='<p>«عند قياس القدرة المستهلكة بالحمل ثلاثي الأطوار باستعمال طريقة الواتميتر، كانت قراءة أحد الجهازين <span class="ltr">6 kW</span>، بينما كانت قراءة الآخر بعد عكس توصيل ملف تياره <span class="ltr">2 kW</span>. احسب القدرة المستهلكة (P).»</p>';

B.lesson({
 id:'u2-l4',unit:2,order:4,pages:'91–96',
 title:'القدرة في الأحمال ثلاثية الأطوار المتزنة وقياسها بطريقة الواتميترين، ومسائل الوحدة',
 summary:'القدرة الكلية للحمل المتزن تساوي √3 × جهد الخط × تيار الخط × معامل القدرة، ومثلها للمفاعلة والظاهرية في النجمة والدلتا، وقياس القدرة بواتميترين وقاعدة القراءة السالبة عندما يقل معامل القدرة عن 0.5، مع إضافة لحساب معامل القدرة من القراءتين، ومسائل الوحدة الثانية.',
 theory:[
  {h:'الفصل الثاني: القدرة في دوائر التيار المتردد ثلاثي الأطوار في حالة التحميل المتماثل',ref:'ص 91'},
  {h:'2-7 حساب القدرات',ref:'ص 91',html:`<p>«كما في دوائر التيار المتردد أحادي الطور، نقسم القدرة إلى <b>فعالة ومفاعلة وظاهرية</b>. والقدرة الفعالة الكلية التي يستهلكها الحمل ثلاثي الأطوار هي مجموع القدرات الفعالة التي يستهلكها كل طور، وإذا كان الحمل متزناً فإن هذه القدرة الكلية هي <b>ثلاثة أضعاف قدرة كل طور</b>. وفيما يلي نحسب هذه القدرات في توصيلتي النجمة والدلتا في حالة الاتزان وبدلالة <b>كميات الخط</b> (تيار الخط وجهد الخط) لأنها أكثر استعمالاً من كميات الطور.»</p>
   <p>«تعطى القدرة الفعالة التي يستهلكها طور واحد بالمعادلة:» \\(P=VI\\cos\\theta\\) «حيث θ هي الزاوية بين تيار الطور I وجهد الطور V. والقدرة الفعالة الكلية للحمل هي» \\(P_T=3P\\) «وفي كلتا التوصيلتين (النجمة والدلتا) نستنتج»</p>
   $$P_T=\\sqrt3\\,V_LI_L\\cos\\theta\\qquad (2\\text{-}12)$$
   <p>«وبنفس الطريقة نحصل على القدرة غير الفعالة الكلية للحمل»</p>
   $$Q_T=\\sqrt3\\,V_LI_L\\sin\\theta\\qquad (2\\text{-}13)$$
   <p>«أما القدرة الظاهرية الكلية فهي»</p>
   $$S_T=\\sqrt3\\,V_LI_L\\qquad (2\\text{-}14)$$`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب) — كيف جاء \\(\\sqrt3\\)؟</b> الكتاب لا يعرض الخطوات. في <b>النجمة</b>: \\(V_{ph}=V_L/\\sqrt3\\) و \\(I_{ph}=I_L\\)، فإن \\(P_T=3\\,\\frac{V_L}{\\sqrt3}\\,I_L\\cos\\theta=\\sqrt3\\,V_LI_L\\cos\\theta\\). وفي <b>الدلتا</b>: \\(V_{ph}=V_L\\) و \\(I_{ph}=I_L/\\sqrt3\\)، فالنتيجة نفسها. انتبه: θ تبقى <b>زاوية الطور</b> (زاوية معاوقة الحمل)، لا الزاوية بين جهد الخط وتيار الخط. وإذا كانت المعاوقة سعوية (ممانعة سالبة) تكون θ سالبة و Q سالبة.'},
  {h:'مثال 2-2-1',ref:'ص 91–92',html:Q221},
  {fig:'(2-14)',ref:'ص 92',caption:'حمل دلتا متزن على شبكة جهد خطها 380 V.',draw:FIG214},
  {html:'<p><b>الحل:</b> \\(Z=6-j8=10\\angle-53.1^\\circ\\ \\Omega\\)، \\(I_{ph}=380/10=38\\) A، \\(I_L=\\sqrt3\\times38=65.8\\) A؛ \\(P_T=\\sqrt3\\times380\\times65.8\\times\\cos(-53.1^\\circ)=26\\) kW، \\(Q_T=\\sqrt3\\times380\\times65.8\\times\\sin(-53.1^\\circ)=-34.6\\) kVAR، \\(S_T=\\sqrt3\\times380\\times65.8=43.3\\) kVA.</p>'},
  {h:'مثال 2-2-2',ref:'ص 92–93',html:Q222},
  {fig:'(2-15)',ref:'ص 92',caption:'مولد نجمة جهد طوره 220 V يغذي حمل دلتا \\(3-j4\\ \\Omega\\) في كل ضلع.',draw:FIG215},
  {html:'<p><b>الحل:</b> \\(V_L=\\sqrt3\\times220=380\\) V، \\(Z=3-j4=5\\angle-53.1^\\circ\\ \\Omega\\)، \\(I=380/5=76\\) A، \\(I_L=\\sqrt3\\times76=131.6\\) A؛ \\(P_T=\\sqrt3\\times380\\times131.6\\times\\cos(-53.1^\\circ)=52\\) kW، \\(Q_T=\\sqrt3\\times380\\times131.6\\times\\sin(-53.1^\\circ)=-69\\) kVAR.</p>'},
  {err:'مثال 2-2-2 (ص 93): طُبع \\(P_T=25\\) kW، والصحيح \\(\\sqrt3\\times380\\times131.6=86.6\\) kVA، و \\(86.6\\times0.6=52\\) kW (تحقق: \\(3\\times76^2\\times3\\ \\Omega=52\\) kW). قيمة \\(Q_T=-69\\) kVAR صحيحة. في تبويب «الأمثلة المحلولة» حلّان: كما في الكتاب، والمصحح.'},
  {h:'2-8 قياس القدرة في دوائر التيار المتردد ثلاثي الأطوار',ref:'ص 93–94',html:`<p>«نستطيع قياس القدرة التي يستهلكها حمل ثلاثي الأطوار باستعمال <b>ثلاثة واتميتر</b>، ولكن في نظام ذي ثلاثة أسلاك، نستعمل غالباً <b>طريقة الواتميترين</b> الموضحة في الشكل 2-16 والتي تستخدم سواء كان الحمل موصل نجمة أو دلتا وسواء أكان متزناً أم غير متزن. في هذه الطريقة نوصل ملف تيار الواتميتر W1 على التوالي مع الطور a وملف تيار الواتميتر W2 على التوالي مع الطور c، أما ملفا الجهد للجهازين فإنهما يقيسان جهدي الخط \\(V_{ab}\\) و \\(V_{cb}\\).»</p>`},
  {fig:'(2-16)',ref:'ص 93',caption:'طريقة قياس القدرة باستخدام الواتميترين: ملف تيار W1 على الخط a وملف تيار W2 على الخط c، وطرفا ملفي الجهد الحران يلتقيان على الخط b.',draw:()=>box(twoWattSVG({}),660)},
  {html:`<p>«ومجموع قراءتي الواتميترين تمثل القدرة المستهلكة بالحمل. ولكن إذا كان الحمل متزناً فإن القدرة المستهلكة بالحمل ترتبط بقراءتي الجهازين حسب معامل قدرة الحمل كما يلي:» <span class="ref">ص 94</span></p>
   <ul><li>«إذا كان معامل القدرة <b>أكبر من 0.5</b> (سواء أكان مادياً-حثياً أو مادياً-سعوياً) فإن: <b>P = W1 + W2</b>. وإذا كان الحمل <b>مادياً نقياً</b> فإن <b>W1 = W2</b>.»</li>
   <li>«إذا كان معامل القدرة <b>أصغر من 0.5</b> … فإن أحد الجهازين (مثلاً W2) سيعطي <b>قراءة سالبة</b> وسيحاول مؤشره الدوران إلى الخلف، وللحصول على قراءة في هذا الجهاز يجب <b>عكس التيار المار في أحد ملفيه</b>. وهنا فإن <b>P = W1 − W2</b>.»</li>
   <li>«إذا كان معامل القدرة <b>0.5</b> … تكون قراءة أحد الجهازين <b>صفراً</b> وتعطى القدرة المستهلكة بالحمل بقراءة الواتميتر الآخر.»</li></ul>
   <div class="k3-tbl"><table class="tt"><thead><tr><th>معامل القدرة</th><th>القراءتان</th><th>القدرة</th></tr></thead><tbody><tr><td>1 (مادي نقي)</td><td>W1 = W2</td><td>P = W1 + W2</td></tr><tr><td>أكبر من 0.5</td><td>موجبتان</td><td>P = W1 + W2</td></tr><tr><td>0.5</td><td>إحداهما صفر</td><td>P = قراءة الآخر</td></tr><tr><td>أصغر من 0.5</td><td>إحداهما سالبة (يُعكس ملفها)</td><td>P = W1 − W2</td></tr></tbody></table></div>`},
  {h:'مثال 2-2-3',ref:'ص 94',html:Q223+'<p><b>الحل:</b> «معامل قدرة الحمل أقل من 0.5 لأن أحد الواتميترين أعطى قراءة سالبة. أما القدرة المستهلكة فهي» \\(P=W_1-W_2=6-2=4\\) kW.</p>'},
  {h:'إضافة من خارج الكتاب: معامل القدرة من قراءتي الواتميترين',html:`<div class="callout"><b>إضافة من خارج الكتاب.</b> الكتاب يستعمل القراءتين لمعرفة القدرة فقط، ولا يذكر كيف نعرف معامل القدرة منهما. للحمل <b>المتزن</b> وبتوصيل الشكل 2-16 وتتابع ABC، وبزاوية الحمل θ (موجبة للحثي):</div>
   $$W_1=V_LI_L\\cos(30^\\circ+\\theta)\\qquad W_2=V_LI_L\\cos(30^\\circ-\\theta)$$
   <p>بجمعهما: \\(W_1+W_2=2V_LI_L\\cos30^\\circ\\cos\\theta=\\sqrt3V_LI_L\\cos\\theta=P_T\\) (المعادلة 2-12). وبطرحهما: \\(W_2-W_1=V_LI_L\\sin\\theta\\)، ومنها:</p>
   $$\\tan\\theta=\\frac{\\sqrt3\\,(W_2-W_1)}{W_1+W_2}\\qquad \\cos\\theta=\\cos\\left[\\tan^{-1}\\frac{\\sqrt3\\,(W_2-W_1)}{W_1+W_2}\\right]\\qquad |Q_T|=\\sqrt3\\,|W_2-W_1|$$
   <ul><li>القراءات تؤخذ <b>بإشارتها</b>: القراءة التي احتاجت إلى عكس الملف تُكتب سالبة. عندها «P = W1 − W2» في الكتاب هي نفسها المجموع الجبري.</li>
   <li>θ = 0: القراءتان متساويتان. θ = 60° (cos θ = 0.5): \\(W_1=V_LI_L\\cos90^\\circ=0\\). θ أكبر من 60°: \\(W_1\\) سالبة. وهذا يفسر قواعد الكتاب الثلاث.</li>
   <li>أي الجهازين يصبح سالباً يعتمد على نوع الحمل (حثي أو سعوي) وعلى تتابع الأطوار؛ لذلك قال الكتاب «مثلاً W2». في التوصيل والتتابع أعلاه: الحثي يجعل W1 أصغر، والسعوي يجعل W2 أصغر.</li></ul>
   <p><b>تطبيق على مثال 2-2-3:</b> القراءتان بإشارتهما 6 kW و −2 kW: \\(\\tan\\theta=\\frac{\\sqrt3\\,(6-(-2))}{6+(-2)}=\\frac{\\sqrt3\\times8}{4}=3.464\\)، \\(\\theta=73.9^\\circ\\)، \\(\\cos\\theta=0.277\\) — أقل من 0.5 كما استنتج الكتاب. الحاسبة في تبويب «الأمثلة المحلولة».</p>`},
  {h:'مسائل الوحدة الثانية',ref:'ص 95–96',html:`<p>الكتاب لا يطبع إجاباتها. تحت كل مسألة إجابة مقترحة، وفي تبويب «الأمثلة المحلولة» حاسبة لكل مسألة.</p>
   ${PRB('1.','«احسب قيمة التيارات في الدائرة ثلاثية الأوجه الموصلة على شكل Y − Y كما هو موضح بالرسم.»',`<figure class="fig">${FIGP1()}<figcaption><b>شكل 1</b> مصدر نجمة 220 V للطور، ومعاوقة كل خط \\(2-j2\\ \\Omega\\)، وحمل نجمة \\(8+j8\\ \\Omega\\) في كل فرع، بلا حيادي. <span class="ref">ص 95</span></figcaption></figure>`,
     'المصدر والحمل متزنان فنحل طوراً واحداً (نقطتا النجمة على جهد واحد): \\(Z_T=(2-j2)+(8+j8)=10+j6=11.66\\angle30.96^\\circ\\ \\Omega\\). <br>\\(\\bar I_A=\\frac{220\\angle0^\\circ}{11.66\\angle30.96^\\circ}=18.86\\angle-30.96^\\circ\\) A، \\(\\bar I_B=18.86\\angle-150.96^\\circ\\) A، \\(\\bar I_C=18.86\\angle89.04^\\circ\\) A (= ∠−270.96°). <br>وجهد طور الحمل \\(18.86\\times|8+j8|=18.86\\times11.31=213.4\\) V.')}
   ${PRB('2.','«احسب قيمة تيارات الخطوط والأوجه في الدائرة ثلاثية الأوجه المتزنة الموصلة على شكل نجمة – دلتا كما هو موضح بالرسم شكل (2) علماً بأن: \\(\\bar V_{AB}=180\\angle-20^\\circ\\) V و \\(Z_\\Delta=20\\angle40^\\circ\\ \\Omega\\).»',`<figure class="fig">${FIGP2()}<figcaption><b>شكل 2</b> مصدر نجمة (V<sub>an</sub> و V<sub>bn</sub> و V<sub>cn</sub>) وحمل دلتا Z. أعيد رسمه بنفس توصيل الأطراف (a إلى A، b إلى B، c إلى C)؛ في الكتاب العقدة B في أسفل يسار المثلث و C في أسفل يمينه. <span class="ref">ص 95</span></figcaption></figure>`,
     'بفرض التتابع ABC: تيارات الأطوار \\(\\bar I_{AB}=\\frac{180\\angle-20^\\circ}{20\\angle40^\\circ}=9\\angle-60^\\circ\\) A، \\(\\bar I_{BC}=9\\angle180^\\circ\\) A، \\(\\bar I_{CA}=9\\angle60^\\circ\\) A. <br>تيارات الخطوط: \\(\\bar I_a=\\bar I_{AB}-\\bar I_{CA}=15.59\\angle-90^\\circ\\) A، \\(\\bar I_b=15.59\\angle150^\\circ\\) A، \\(\\bar I_c=15.59\\angle30^\\circ\\) A (\\(9\\sqrt3=15.59\\)، متأخرة 30° عن تيارات الأطوار).')}
   ${PRB('3.','«إذا كانت قيمة الأحمال المتزنة الموصلة في صورة دلتا \\(18+j12\\) أوم وموصلة مع مولد موصل في صورة دلتا \\((V_{ab}=22.5\\angle35^\\circ)\\). احسب تيار الوجه للدائرة على الأحمال.»','',
     'في دلتا–دلتا جهد كل طور من الحمل هو جهد الخط: \\(Z=18+j12=21.63\\angle33.69^\\circ\\ \\Omega\\)، \\(\\bar I_{ab}=\\frac{22.5\\angle35^\\circ}{21.63\\angle33.69^\\circ}=1.040\\angle1.31^\\circ\\) A، وبفرض التتابع ABC: \\(\\bar I_{bc}=1.040\\angle-118.69^\\circ\\) و \\(\\bar I_{ca}=1.040\\angle121.31^\\circ\\) A. (تيار الخط \\(\\sqrt3\\times1.040=1.80\\) A.) افترضنا أن الجهد بالفولت لأن الكتاب لم يذكر وحدته.')}
   ${PRB('4.','«وصل حمل ثلاثي الأطوار توصيلة دلتا بمولد ذي توصيلة نجمة كما هو مبين في الشكل 3. احسب تيار كل طور من الحمل وكذلك القيمة الفعالة لتيار الخط.»',`<figure class="fig">${FIG29('6+j7')}<figcaption><b>شكل 3</b> مثل الشكل 2-9 لكن \\(Z=6+j7\\ \\Omega\\). <span class="ref">ص 96</span></figcaption></figure>`,
     'كمثال 2-1-2: \\(\\bar V_{AB}=380\\angle30^\\circ\\) V (بتقريب الكتاب)، \\(Z=6+j7=9.22\\angle49.4^\\circ\\ \\Omega\\). <br>\\(\\bar I_{ab}=\\frac{380\\angle30^\\circ}{9.22\\angle49.4^\\circ}=41.2\\angle-19.4^\\circ\\) A، \\(\\bar I_{bc}=41.2\\angle-139.4^\\circ\\) A، \\(\\bar I_{ca}=41.2\\angle100.6^\\circ\\) A، و \\(I_L=\\sqrt3\\times41.2=71.4\\) A. (بالجهد الدقيق 381.05 V: 41.3 A و 71.6 A.)')}`},
  {h:'ملاحظات على الكتاب',html:`<ul><li>ص 93، مثال 2-2-2: \\(P_T\\) طُبعت 25 kW والصحيح 52 kW (انظر أعلاه).</li>
   <li>ص 93، القسم 2-8: طُبع أن ملفي الجهد يقيسان «\\(V_{ac}\\) و \\(V_{cb}\\)»، والصحيح حسب الشكل 2-16 \\(V_{ab}\\) و \\(V_{cb}\\) (ملفا الجهد يلتقيان على الخط b). كُتب هنا مصححاً.</li>
   <li>ص 95، مسألة 2: طُبع «Vam» على المصدر العلوي والمقصود V<sub>an</sub>. ومسألة 3 بلا وحدة للجهد. وأخطاء إملائية («عل شكل»، «الاوجة») صُححت في النص.</li>
   <li>المسائل 2 و 3 لا تذكر تتابع الأطوار؛ افترضنا ABC في الإجابات المقترحة.</li></ul>`}
 ],
 lab:(el)=>{
  let conn='D',VL=380,Zm=10,th=-53.1,rev1=false,rev2=false,pre='e1';
  el.innerHTML=`<div class="grid k3-lab">
   <div class="panel c7"><h2>قياس القدرة بطريقة الواتميترين <small>مبني على الشكل (2-16) ص 93 والمعادلات (2-12) – (2-14)</small></h2>
    <div class="k3-row"><button class="btn" data-pre="e1">مثال (2-2-1)</button><button class="btn" data-pre="e2">مثال (2-2-2)</button><button class="btn" data-pre="e3">مثال (2-2-3)</button><div><div class="sub">توصيل الحمل</div>${segHTML('cn',[['Y','نجمة Y'],['D','دلتا Δ']],conn)}</div></div>
    <div class="k3-sls">${sl('l4V','جهد الخط V<sub>L</sub>',100,600,1,VL)}${sl('l4Z','مقدار معاوقة كل طور |Z|',1,50,0.1,Zm)}${sl('l4t','زاوية الحمل θ (موجبة: حثي متأخر، سالبة: سعوي متقدم)',-90,90,0.1,th)}</div>
    <div class="svgbox" id="l4c" style="max-width:660px;margin-inline:auto"></div>
    <div class="k3-row">${swHTML('l4r1','W1','اعكس ملف التيار',rev1)}${swHTML('l4r2','W2','اعكس ملف التيار',rev2)}<span id="l4chip" class="k3-chip"></span></div></div>
   <div class="panel c5"><h2>الجهازان والقدرة</h2>
    <div class="k3-row" style="justify-content:center"><div class="svgbox" id="l4m1" style="max-width:200px;flex:1 1 150px;margin-top:0"></div><div class="svgbox" id="l4m2" style="max-width:200px;flex:1 1 150px;margin-top:0"></div></div>
    <div id="l4warn"></div><div class="facts" id="l4f"></div></div>
   <div class="panel c12"><h2>القراءتان والقدرة مع زاوية الحمل <small>بالجهد والمعاوقة الحاليين — المنطقة المظللة: معامل القدرة أقل من 0.5</small></h2><div class="svgbox" id="l4pl" style="max-width:820px;margin-inline:auto"></div>
    <div class="k3-tbl" id="l4tb"></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l4st"></ol></div></div>`;
  B.math(el);const $=s=>el.querySelector(s);
  const sync=()=>{$('#l4V').value=VL;$('#l4Z').value=Zm;$('#l4t').value=th;segSet(el,'cn',conn);$('#l4r1').setAttribute('aria-pressed',String(rev1));$('#l4r2').setAttribute('aria-pressed',String(rev2))};
  const preset=p=>{pre=p;conn='D';VL=380;rev1=false;rev2=false;
   if(p==='e1'){Zm=10;th=-53.1}else if(p==='e2'){Zm=5;th=-53.1}
   else{const t=Math.atan(SQ3*8/4)/D,IL=4000/(SQ3*380*Math.cos(t*D));th=t;Zm=380/(IL/SQ3)}   // gives W2 = 6 kW, W1 = −2 kW
   sync();draw()};
  el.querySelectorAll('[data-pre]').forEach(b=>b.onclick=()=>preset(b.dataset.pre));
  segBind(el,'cn',v=>{conn=v;pre='';draw()});
  $('#l4V').oninput=e=>{VL=+e.target.value;pre='';draw()};$('#l4Z').oninput=e=>{Zm=+e.target.value;pre='';draw()};$('#l4t').oninput=e=>{th=+e.target.value;pre=pre==='e3'?'':pre;if(pre)pre='';draw()};
  $('#l4r1').onclick=()=>{rev1=!rev1;$('#l4r1').setAttribute('aria-pressed',String(rev1));draw()};
  $('#l4r2').onclick=()=>{rev2=!rev2;$('#l4r2').setAttribute('aria-pressed',String(rev2));draw()};
  const calc=()=>{const Vph=conn==='Y'?VL/SQ3:VL,Iph=Vph/Zm,IL=conn==='Y'?Iph:SQ3*Iph,c=Math.cos(th*D),s=Math.sin(th*D);
   const W1=VL*IL*Math.cos((30+th)*D),W2=VL*IL*Math.cos((30-th)*D);return {Vph,Iph,IL,P:SQ3*VL*IL*c,Q:SQ3*VL*IL*s,S:SQ3*VL*IL,pf:c,W1,W2,r1:rev1?-W1:W1,r2:rev2?-W2:W2}};
  let K=null;
  const kw=w=>neg(w/1000,2)+' kW';
  const draw=()=>{K=calc();const k=K;
   $('#l4V-v').textContent=VL+' V';$('#l4Z-v').textContent=fm(Zm,2)+' Ω';$('#l4t-v').textContent=neg(th,1)+'°';
   const full=niceMax(VL*k.IL*1.02);
   $('#l4c').innerHTML=twoWattSVG({W1:'W1 = '+kw(k.r1),W2:'W2 = '+kw(k.r2),rev1,rev2,flow:true,r1neg:k.r1<-1e-6,r2neg:k.r2<-1e-6});
   $('#l4m1').innerHTML=meterSVG(k.r1,full,'W1');$('#l4m2').innerHTML=meterSVG(k.r2,full,'W2');
   const neg1=k.r1<-0.5,neg2=k.r2<-0.5;let w='';
   if(neg1||neg2)w=`<div class="callout err">مؤشر ${neg1?'W1':'W2'} يحاول الدوران إلى الخلف (قراءة سالبة) — «يجب عكس التيار المار في أحد ملفيه» (ص 94). اضغط «اعكس ملف التيار» لهذا الجهاز.</div>`;
   const revd=(rev1&&k.W1<0)||(rev2&&k.W2<0);let Pb,rule;
   if(neg1||neg2){Pb=null;rule='—'}else if(rev1&&!rev2){Pb=k.r2-k.r1;rule='P = W2 − W1'}else if(rev2&&!rev1){Pb=k.r1-k.r2;rule='P = W1 − W2'}else if(rev1&&rev2){Pb=-(k.r1+k.r2);rule='الجهازان معكوسان: P = −(W1 + W2)'}else{Pb=k.r1+k.r2;rule='P = W1 + W2'}
   if((rev1&&k.W1>0.5)||(rev2&&k.W2>0.5))w+='<div class="callout err">عكستَ ملف جهاز قراءته الأصلية موجبة؛ أعده كما كان.</div>';
   $('#l4warn').innerHTML=w;
   const den=k.W1+k.W2,thE=Math.abs(den)<1e-9?90:Math.atan(SQ3*(k.W2-k.W1)/den)/D;
   $('#l4f').innerHTML=[['جهد الخط V<sub>L</sub>',fm(VL,0)+' V'],['تيار الخط I<sub>L</sub>',fm(k.IL,2)+' A'],['معامل القدرة cos θ',fm(Math.abs(k.pf),3)+(th>0.05?' متأخر':th<-0.05?' متقدم':'')],
     ['P<sub>T</sub> (2-12)',kw(k.P)],['Q<sub>T</sub> (2-13)',neg(k.Q/1000,2)+' kVAR'],['S<sub>T</sub> (2-14)',fm(k.S/1000,2)+' kVA'],
     ['القدرة من القراءتين '+lt(rule),Pb==null?'اعكس الملف أولاً':kw(Pb)],['إضافة: cos θ من القراءتين',fm(Math.cos(thE*D),3)]].map(([a,b])=>`<div class="fact"><span>${a}</span><b>${b}</b></div>`).join('');
   const ch=$('#l4chip'),pf=Math.abs(k.pf);
   if(Math.abs(pf-0.5)<0.0009){ch.className='k3-chip ld';ch.innerHTML='معامل القدرة 0.5: إحدى القراءتين صفر'}else if(pf>0.5){ch.className='k3-chip ok';ch.innerHTML=Math.abs(th)<0.05?'مادي نقي: '+lt('W1 = W2'):'معامل القدرة أكبر من 0.5: القراءتان موجبتان، '+lt('P = W1 + W2')}else{ch.className='k3-chip warn';ch.innerHTML='معامل القدرة أقل من 0.5: إحدى القراءتين سالبة، '+lt('P = W1 − W2')}
   // curves vs θ
   const ym=niceMax(VL*k.IL*SQ3)/1000,pts=f=>{const a=[];for(let t=-90;t<=90;t+=1)a.push([t,f(t)/1000]);return a};
   $('#l4pl').innerHTML=plotSVG({w:800,h:260,x0:-90,x1:90,y0:-ym*0.55,y1:ym,xt:[-90,-60,-30,0,30,60,90],xf:v=>v+'°',yt:[-ym/2,0,ym/2,ym],yf:v=>neg(v,ym<20?1:0),xl:'θ',yl:'kW',
     under:(X,Y)=>`<rect x="${fx(X(-90))}" y="14" width="${fx(X(-60)-X(-90))}" height="${fx(Y(-ym*0.55)-14)}" fill="var(--stop-soft)" opacity=".6"/><rect x="${fx(X(60))}" y="14" width="${fx(X(90)-X(60))}" height="${fx(Y(-ym*0.55)-14)}" fill="var(--stop-soft)" opacity=".6"/>`,
     series:[{pts:pts(t=>VL*k.IL*Math.cos((30+t)*D)),col:'--blue',w:2.4},{pts:pts(t=>VL*k.IL*Math.cos((30-t)*D)),col:'--live',w:2.4},{pts:pts(t=>SQ3*VL*k.IL*Math.cos(t*D)),col:'--fg',w:1.8,dash:'6 4'}],
     extra:(X,Y)=>`<path d="M${fx(X(th))} 14V${260-36}" stroke="var(--fg)" stroke-width="1.4"/>`+[[k.W1,'--blue'],[k.W2,'--live'],[k.P,'--fg']].map(([v,c])=>`<circle cx="${fx(X(th))}" cy="${fx(Y(v/1000))}" r="5" fill="var(${c})" stroke="var(--surface)" stroke-width="1.5"/>`).join('')+
       ct(X(-80),30,'W1','--blue','start',12)+ct(X(-80)+34,30,'W2','--live','start',12)+ct(X(-80)+68,30,'P = W1 + W2','--fg','start',12),aria:'قراءتا الواتميترين والقدرة مع زاوية الحمل'});
   const row=pf>0.5+0.0009?(Math.abs(th)<0.05?0:1):Math.abs(pf-0.5)<=0.0009?2:3;
   $('#l4tb').innerHTML=`<table class="tt"><thead><tr><th>معامل القدرة (ص 94)</th><th>القراءتان</th><th>القدرة</th></tr></thead><tbody>${[['1 (مادي نقي)','W1 = W2','P = W1 + W2'],['أكبر من 0.5','موجبتان','P = W1 + W2'],['0.5','إحداهما صفر','P = قراءة الآخر'],['أصغر من 0.5','إحداهما سالبة (يُعكس ملفها)','P = W1 − W2']].map((r,i)=>`<tr class="${i===row?'cur':''}">${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
   steps.check()};
  const steps=stepsUI($('#l4st'),[
   {t:'مثال (2-2-1)',x:'اضغط «مثال (2-2-1)»: حمل دلتا \\(6-j8\\ \\Omega\\) على 380 V. القدرة \\(P_T=26\\) kW و \\(Q_T=-34.6\\) kVAR (سعوي). القراءتان موجبتان ومجموعهما = 26 kW.',done:()=>pre==='e1'},
   {t:'حمل مادي نقي',x:'حرّك زاوية الحمل إلى <span class="ltr">θ = 0°</span>: تتساوى القراءتان W1 = W2 (ص 94).',done:()=>Math.abs(th)<0.05},
   {t:'معامل القدرة 0.5',x:'حرّك الزاوية إلى <span class="ltr">60°</span> (أو −60°): إحدى القراءتين صفر، والقدرة كلها في الجهاز الآخر.',done:()=>Math.abs(Math.abs(th)-60)<0.05},
   {t:'معامل القدرة أقل من 0.5',x:'زد الزاوية فوق 60° (حمل حثي): مؤشر W1 يحاول الدوران إلى الخلف. اضغط «اعكس ملف التيار» تحت W1 فتظهر قراءة موجبة، والقدرة = W2 − W1 (قاعدة الكتاب P = W1 − W2 بتسمية الجهاز الأكبر W1).',done:()=>(th>60.05&&rev1&&!rev2)||(th<-60.05&&rev2&&!rev1)},
   {t:'مثال (2-2-3)',x:'اضغط «مثال (2-2-3)» ثم اعكس ملف W1: القراءتان <span class="ltr">6 kW</span> و <span class="ltr">2 kW</span>، والقدرة <span class="ltr">6 − 2 = 4 kW</span>.',done:()=>pre==='e3'&&rev1&&!rev2},
   {t:'إضافة: معامل القدرة من القراءتين',x:'قارن «cos θ من القراءتين» بمعامل القدرة الفعلي: متساويان دائماً للحمل المتزن. في مثال 2-2-3: <span class="ltr">cos θ = 0.277</span>.'}
  ]);
  sync();draw();
 },
 examples:[
  {title:'مثال (2-2-1)',ref:'ص 91–92',q:Q221+FIG214(),given:G221,solve:g=>ex221(g)},
  {title:'مثال (2-2-2) — كما في الكتاب',ref:'ص 92–93',q:Q222+FIG215(),given:G222,solve:(g,B,isBook)=>ex222(g,isBook),note:'<b>ملاحظة على الكتاب:</b> بقيم الكتاب يُعرض \\(P_T=25\\) kW كما طُبع ثم القيمة المصححة 52 kW. إذا غيّرت الأرقام تحسب الحاسبة بالطريقة الصحيحة.'},
  {title:'مثال (2-2-2) — المصحح',ref:'ص 92–93',q:'<p>نفس المثال بحساب صحيح للقدرة الفعالة (حساب مصحح — ليس من الكتاب).</p>',given:G222,solve:(g,B,isBook)=>ex222(g,isBook,true),note:'النتائج المصححة: \\(P_T=52\\) kW و \\(Q_T=-69\\) kVAR.'},
  {title:'مثال (2-2-3)',ref:'ص 94',q:Q223,given:G223,solve:g=>[{t:'معامل قدرة الحمل أقل من 0.5 لأن أحد الواتميترين أعطى قراءة سالبة. أما القدرة المستهلكة فهي:',f:`P=W_1-W_2=${fm(g.W1)}-${fm(g.W2)}`,v:B.round(g.W1-g.W2,3),unit:'kW',final:true}]},
  {title:'إضافة من خارج الكتاب — معامل القدرة من قراءتي الواتميترين',ref:'بيانات مثال 2-2-3',q:'<p>حمل متزن، القراءتان بإشارتهما (القراءة التي عُكس ملفها تُكتب سالبة). احسب القدرة وزاوية الحمل ومعامل القدرة.</p>',given:GPF,solve:g=>exPF(g),note:'هذه الحاسبة إضافة من خارج الكتاب. صالحة للحمل المتزن فقط.'},
  {title:'مسألة 1 — إجابة مقترحة (ليست من الكتاب)',ref:'ص 95',q:'<p>«احسب قيمة التيارات في الدائرة ثلاثية الأوجه الموصلة على شكل Y − Y كما هو موضح بالرسم.»</p>'+FIGP1(),given:GP1,solve:g=>pr1(g)},
  {title:'مسألة 2 — إجابة مقترحة (ليست من الكتاب)',ref:'ص 95',q:'<p>«احسب قيمة تيارات الخطوط والأوجه في الدائرة … نجمة – دلتا … علماً بأن \\(\\bar V_{AB}=180\\angle-20^\\circ\\) V و \\(Z_\\Delta=20\\angle40^\\circ\\ \\Omega\\).»</p>'+FIGP2(),given:GP2,solve:g=>pr2(g)},
  {title:'مسألة 3 — إجابة مقترحة (ليست من الكتاب)',ref:'ص 95',q:'<p>«أحمال متزنة دلتا \\(18+j12\\) أوم موصلة مع مولد دلتا \\((V_{ab}=22.5\\angle35^\\circ)\\). احسب تيار الوجه للدائرة على الأحمال.»</p>',given:GP3,solve:g=>pr3(g)},
  {title:'مسألة 4 — إجابة مقترحة (ليست من الكتاب)',ref:'ص 96',q:'<p>«وصل حمل ثلاثي الأطوار توصيلة دلتا بمولد ذي توصيلة نجمة كما هو مبين في الشكل 3. احسب تيار كل طور من الحمل وكذلك القيمة الفعالة لتيار الخط.»</p>'+FIG29('6+j7'),given:GP4,solve:(g,B,isBook)=>exYD(g,isBook),note:'بقيم المسألة يُستعمل جهد الخط 380 V كما في مثال 2-1-2.'}
 ],
 quiz:[
  {q:'القدرة الفعالة الكلية لحمل ثلاثي الأطوار متزن بدلالة كميات الخط:',o:['\\(3V_LI_L\\cos\\theta\\)','\\(\\sqrt3V_LI_L\\cos\\theta\\)','\\(V_LI_L\\cos\\theta\\)','\\(\\sqrt3V_LI_L\\sin\\theta\\)'],c:1,e:'المعادلة (2-12)، لتوصيلتي النجمة والدلتا.'},
  {q:'في المعادلة (2-12) الزاوية θ هي الزاوية بين:',o:['جهد الخط وتيار الخط','جهد الطور وتيار الطور','جهدي خطين','تياري خطين'],c:1,e:'ص 91.'},
  {q:'حمل متزن: V<sub>L</sub> = 380 V و I<sub>L</sub> = 10 A. القدرة الظاهرية:',o:['3.8 kVA','6.58 kVA','11.4 kVA','2.19 kVA'],c:1,e:'\\(S_T=\\sqrt3\\times380\\times10=6582\\) VA.'},
  {q:'طريقة الواتميترين تستعمل:',o:['للحمل المتزن فقط','للنجمة فقط','لأي حمل نجمة أو دلتا متزن أو غير متزن في نظام ثلاثة أسلاك','للتيار المستمر'],c:2,e:'ص 93.'},
  {q:'حمل متزن مادي نقي، قراءتا الواتميترين:',o:['W1 = 0','W1 = W2','W1 = −W2','W1 = 2W2'],c:1,e:'ص 94.'},
  {q:'إذا كان معامل القدرة أصغر من 0.5 فإن:',o:['القراءتين متساويتان','إحدى القراءتين سالبة ويُعكس ملف أحد ملفي الجهاز، و P = W1 − W2','P = W1 + W2 والقراءتان موجبتان','القراءتين صفر'],c:1,e:'ص 94.'},
  {q:'قراءتا الواتميترين 6 kW و 2 kW بعد عكس ملف الثاني. القدرة:',o:['8 kW','4 kW','12 kW','3 kW'],c:1,e:'مثال 2-2-3.'},
  {q:'(إضافة) إذا كانت إحدى القراءتين صفراً في حمل متزن فمعامل القدرة:',o:['1','0.866','0.5','صفر'],c:2,e:'ص 94: عند معامل القدرة 0.5 تكون قراءة أحد الجهازين صفراً.'}
 ]
});

})(PLCBOOK);
