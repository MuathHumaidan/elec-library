/* Unit 1 (part B) — المحركات الحثية ثلاثية الأوجه: الفصل الثالث «القدرة والعزم» والفصل الرابع «طرق بدء الحركة والتحكم في السرعة» (ص 38–70) */
(function(B){
const PI=Math.PI,SQ3=Math.sqrt(3);
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const fm=(x,d)=>B.fmtN(x,d);
const R=(x,d)=>B.round(x,d);
const lt=s=>`<span class="ltr">${s}</span>`;
const fx=v=>(+v).toFixed(1);
const eq=n=>`\\qquad (${n.replace('-','\\text{-}')})`;
let UID=0;

/* ---------- styles used only by this file (CSS variables only) ---------- */
(function css(){if(typeof document==='undefined'||document.getElementById('u1b-css'))return;const s=document.createElement('style');s.id='u1b-css';s.textContent=`
.u1b-sl{display:flex;flex-direction:column;gap:2px;font-size:13.5px;margin-top:9px}
.u1b-sl .h{display:flex;justify-content:space-between;gap:8px;align-items:baseline}
.u1b-sl b{font-family:var(--mono);direction:ltr;unicode-bidi:isolate;color:var(--blue-ink);font-size:14px}
.u1b-sl input[type=range]{width:100%;accent-color:var(--blue);direction:ltr;margin:4px 0}
.u1b-row{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;align-items:center}
.u1b-row .lab{font-size:13px;color:var(--muted)}
.u1b-seg{flex-wrap:wrap}
.u1b-seg button{padding:6px 11px;font-size:13.5px}
.u1b-leg{display:flex;gap:14px;flex-wrap:wrap;font-size:12.5px;color:var(--muted);margin-top:6px}
.u1b-leg i{display:inline-block;width:18px;height:3px;border-radius:2px;vertical-align:middle;margin-inline-end:5px}
.u1b-leg i.d{background:none!important;border-top:3px dashed currentColor;height:0}
.u1b-q{border:1px solid var(--line);border-radius:12px;padding:10px 14px;margin:10px 0;background:var(--surface)}
.u1b-q summary{cursor:pointer;font-weight:600;line-height:1.7}
.u1b-ans{margin-top:8px;border-inline-start:3px solid var(--blue);padding:6px 12px;background:var(--blue-soft);border-radius:0 10px 10px 0;line-height:1.8}
.u1b-msg{margin-top:10px}
.u1b-msg:empty{display:none}
.u1b-k{cursor:pointer}
.u1b-k:focus{outline:none}
.u1b-k:focus-visible .kb{stroke:var(--blue);stroke-width:3}
.u1b-stg{margin:6px 0 0;padding-inline-start:22px;font-size:14px;line-height:1.75;color:var(--muted)}
.u1b-stg li.on{color:var(--fg);font-weight:700}
.u1b-stg li.ok::marker{color:var(--on)}
.u1b-two{display:grid;grid-template-columns:1fr 1fr;gap:12px}
@media (max-width:760px){.u1b-two{grid-template-columns:1fr}}
.u1b-tbl{width:100%;border-collapse:collapse;font-size:13.5px;margin-top:8px}
.u1b-tbl th,.u1b-tbl td{border:1px solid var(--line);padding:5px 8px;text-align:center}
.u1b-tbl th{background:var(--surface-2)}
`;document.head.appendChild(s)})();

/* ---------- small lab helpers ---------- */
function loopOn(el,fn){let last=performance.now();const f=now=>{if(!document.body.contains(el))return;const dt=Math.min(0.05,Math.max(0,(now-last)/1000));last=now;try{fn(dt)}catch(e){console.error(e);return}requestAnimationFrame(f)};requestAnimationFrame(f)}
function stepsUI(host,steps,getW){let i=0;
  const draw=()=>{host.innerHTML=steps.map((s,j)=>`<li class="${j<i?'done':j===i?'cur':''}"><span class="k">${j<i?'✓':j+1}</span><div><h4>${s.t}</h4><p>${s.x}</p>${j===i?`<div class="act">${s.done?'<span class="hint">بانتظار تنفيذك…</span> <button class="btn" data-next>تخطَّ</button>':'<button class="btn primary" data-next>التالي</button>'}</div>`:''}</div></li>`).join('')+
    (i>=steps.length?`<li class="cur"><span class="k">✓</span><div><h4>أحسنت، أنهيت التجربة</h4><p style="display:block">جرّب قيماً أخرى، أو أعد التجربة من أولها.</p><div class="act"><button class="btn" data-restart>إعادة التجربة</button></div></div></li>`:'');B.math(host)};
  host.addEventListener('click',e=>{if(e.target.closest('[data-next]')){i++;draw()}if(e.target.closest('[data-restart]')){i=0;draw()}});draw();
  return {check(){const s=steps[i];if(s&&s.done&&s.done(getW())){i++;draw()}}};}
const sl=(id,label,min,max,step,val)=>`<label class="u1b-sl"><span class="h"><span>${label}</span><b id="${id}-v"></b></span><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}" aria-label="${label.replace(/<[^>]+>/g,'')}"></label>`;
const segHTML=(attr,items,cur)=>`<div class="seg u1b-seg" role="group">${items.map(([v,l])=>`<button data-${attr}="${v}" aria-pressed="${String(v)===String(cur)}">${l}</button>`).join('')}</div>`;
const segSet=(el,attr,v)=>el.querySelectorAll(`[data-${attr}]`).forEach(b=>b.setAttribute('aria-pressed',String(b.dataset[attr])===String(v)));
const fact=(l,id)=>`<div class="fact"><span>${l}</span><b id="${id}">—</b></div>`;
const tryList=items=>`<div class="callout"><b>جرّب:</b><ol style="margin:6px 0 0;padding-inline-start:20px">${items.map(x=>`<li>${x}</li>`).join('')}</ol></div>`;
const legend=items=>`<div class="u1b-leg">${items.map(([c,l,d])=>`<span><i class="${d?'d':''}" style="${d?'color':'background'}:var(${c})"></i>${l}</span>`).join('')}</div>`;
const box=(svg,max)=>`<div class="svgbox" style="margin-inline:auto;${max?`max-width:${max}px`:''}">${svg}</div>`;
const Q=(n,q,ans,opts)=>`<details class="u1b-q"><summary>${n}- ${q}</summary>${opts?`<ol style="list-style:none;padding-inline-start:6px">${opts.map(o=>`<li>${o}</li>`).join('')}</ol>`:''}<div class="u1b-ans"><b>إجابة مقترحة (ليست من الكتاب):</b> ${ans}</div></details>`;
/* svg text: Latin (LTR) and Arabic */
const tx=(x,y,s,cls,anchor,fs,col)=>`<text class="txt ${cls||''}" x="${fx(x)}" y="${fx(y)}" text-anchor="${anchor||'middle'}"${fs?` font-size="${fs}"`:''}${col?` style="fill:var(${col})"`:''}>${s}</text>`;
const ar=(x,y,s,o)=>{o=o||{};return `<text class="txt ar" x="${fx(x)}" y="${fx(y)}" text-anchor="${o.a||'middle'}"${o.fs?` font-size="${o.fs}"`:''}${o.col?` style="fill:var(${o.col})"`:''}>${s}</text>`};
const sb=(b,x)=>`${b}<tspan font-size="0.72em" dy="3">${x}</tspan><tspan dy="-3"> </tspan>`;
function arrow(x1,y1,x2,y2,col,w){w=w||2.2;const a=Math.atan2(y2-y1,x2-x1),L=Math.hypot(x2-x1,y2-y1);if(L<3)return '';const h=Math.min(10,L*0.6)+w;
  const bx=x2-h*Math.cos(a),by=y2-h*Math.sin(a),px=-Math.sin(a)*h*0.42,py=Math.cos(a)*h*0.42;
  return `<path d="M${fx(x1)} ${fx(y1)}L${fx(bx)} ${fx(by)}" stroke="var(${col})" stroke-width="${w}" fill="none" stroke-linecap="round"/><path d="M${fx(x2)} ${fx(y2)}L${fx(bx+px)} ${fx(by+py)}L${fx(bx-px)} ${fx(by-py)}Z" fill="var(${col})"/>`}
const dot=(x,y)=>`<circle cx="${fx(x)}" cy="${fx(y)}" r="3.2" fill="var(--fg)"/>`;
/* monotone cubic interpolation through [[x,y]] (sorted by x) */
function mono(P){const n=P.length,dx=[],m=[],t=[];for(let i=0;i<n-1;i++){dx[i]=P[i+1][0]-P[i][0];m[i]=(P[i+1][1]-P[i][1])/dx[i]}
  t[0]=m[0];t[n-1]=m[n-2];for(let i=1;i<n-1;i++)t[i]=m[i-1]*m[i]<=0?0:(m[i-1]+m[i])/2;
  for(let i=0;i<n-1;i++){if(m[i]===0){t[i]=t[i+1]=0;continue}const a=t[i]/m[i],b=t[i+1]/m[i],h=a*a+b*b;if(h>9){const k=3/Math.sqrt(h);t[i]=k*a*m[i];t[i+1]=k*b*m[i]}}
  return x=>{if(x<=P[0][0])return P[0][1];if(x>=P[n-1][0])return P[n-1][1];let i=0;while(x>P[i+1][0])i++;const h=dx[i],u=(x-P[i][0])/h,u2=u*u,u3=u2*u;
    return (2*u3-3*u2+1)*P[i][1]+(u3-2*u2+u)*h*t[i]+(-2*u3+3*u2)*P[i+1][1]+(u3-u2)*h*t[i+1]}}
function niceStep(range,n){const raw=range/n,p=Math.pow(10,Math.floor(Math.log10(raw))),m=raw/p;return (m<1.5?1:m<3?2:m<7?5:10)*p}
const ticks=(a,b,n)=>{const st=niceStep(b-a,n||5),r=[];for(let v=Math.ceil(a/st-1e-9)*st;v<=b+1e-9;v+=st)r.push(+v.toFixed(8));return r};
/* generic SVG x-y chart. o:{W,H,L,R,T,B,x0,x1,y0,y1,xt,xf,yt,yf,xl,yl,under(X,Y),series:[{pts,col,w,dash,op}],extra(X,Y),aria} */
function chartSVG(o){const W=o.W||520,H=o.H||300,L=o.L||50,Rm=o.R||14,T=o.T||16,Bm=o.B||42,cid='u1bc'+(++UID);
  const X=x=>L+(x-o.x0)/(o.x1-o.x0)*(W-L-Rm),Y=y=>H-Bm-(y-o.y0)/(o.y1-o.y0)*(H-T-Bm);
  let s=`<defs><clipPath id="${cid}"><rect x="${L}" y="${T-2}" width="${W-L-Rm}" height="${H-T-Bm+2}"/></clipPath></defs>`;
  (o.yt||[]).forEach(v=>{s+=`<path d="M${L} ${fx(Y(v))}H${W-Rm}" stroke="var(--line)" stroke-width="1"/>`+(o.yf===false?'':tx(L-6,Y(v)+4,o.yf?o.yf(v):fm(v),'m','end'))});
  (o.xt||[]).forEach(v=>{s+=`<path d="M${fx(X(v))} ${T}V${H-Bm}" stroke="var(--line)" stroke-dasharray="3 3"/>`+(o.xf===false?'':tx(X(v),H-Bm+15,o.xf?o.xf(v):fm(v),'m'))});
  if(o.under)s+=`<g clip-path="url(#${cid})">${o.under(X,Y)}</g>`;
  s+=`<path d="M${L} ${T-4}V${H-Bm}H${W-Rm+4}" stroke="var(--fg)" fill="none" stroke-width="1.5"/>`;
  if(o.xl)s+=tx(W-Rm,H-4,o.xl,'m','end');
  if(o.yl)s+=tx(L+6,T+8,o.yl,'m','start');
  s+=`<g clip-path="url(#${cid})">`;
  (o.series||[]).forEach(se=>{if(!se.pts||se.pts.length<2)return;s+=`<path d="${se.pts.map((p,i)=>(i?'L':'M')+fx(X(p[0]))+' '+fx(Y(p[1]))).join('')}" fill="none" stroke="var(${se.col})" stroke-width="${se.w||2.4}"${se.dash?` stroke-dasharray="${se.dash}"`:''}${se.op?` opacity="${se.op}"`:''} stroke-linejoin="round" stroke-linecap="round"/>`});
  s+='</g>';
  if(o.extra)s+=o.extra(X,Y);
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${o.aria||'منحنى'}">${s}</svg>`}

/* ================= Torque model (equations 1-31 … 1-38) ================= */
const TQ={
 K:ns=>R(180/(2*PI*ns),4),                                                          // (1-32), rounded to 4 places as the book does (0.0159)
 full:(s,p)=>{const a=p.R1+p.R2/s,X=p.X1+p.X2;return TQ.K(p.ns)*p.V*p.V*p.R2/((a*a+X*X)*s)},   // (1-34)
 book:(s,p)=>{const a=p.R2/s;return TQ.K(p.ns)*p.V*p.V*p.R2/((a*a+p.X2*p.X2)*s)},  // (1-35) stator impedance neglected
 I2:(s,p)=>p.V/Math.hypot(p.R1+p.R2/s,p.X1+p.X2),                                   // (1-33)
 smF:p=>p.R2/Math.hypot(p.R1,p.X1+p.X2),                                            // exact peak of (1-34)  (not in the book)
 tmF:p=>TQ.K(p.ns)*p.V*p.V/(2*(p.R1+Math.hypot(p.R1,p.X1+p.X2))),
 smB:p=>p.R2/p.X2,                                                                  // (1-36)
 tmB:p=>TQ.K(p.ns)*p.V*p.V/(2*p.X2),                                                // (1-37)
 tst:p=>TQ.full(1,p),                                                               // (1-38)
 opS(p,TL){const sm=Math.min(TQ.smF(p),1);if(TL<=0)return 0;if(TL>TQ.full(sm,p))return null;let a=1e-9,b=sm;for(let i=0;i<70;i++){const m=(a+b)/2;if(TQ.full(m,p)<TL)a=m;else b=m}return (a+b)/2}
};
const sGrid=(()=>{const a=[];for(let i=1;i<=260;i++){a.push(Math.pow(i/260,1.7))}return a})();

/* torque–slip / torque–speed chart (figures 1-19, 1-20, 1-21)
   o:{p, orient:'s'(fig 1-19) | 'n'(fig 1-20), mode:'book'|'full', TL, fam:[k...], sel:k, symbolic, regions, W,H} */
function torqueSVG(o){const p=o.p,sym=!!o.symbolic,orient=o.orient||'n',W=o.W||520,H=o.H||330;
  const ks=o.fam||[1],sel=o.sel||1,pk=k=>Object.assign({},p,{R2:p.R2*k}),P=pk(sel);
  const xs=s=>orient==='s'?s:1-s;
  const smf=TQ.smF(P),tmf=TQ.tmF(P),tst=TQ.tst(P),smb=TQ.smB(P),tmb=TQ.tmB(P);
  let ym=Math.max(...ks.map(k=>TQ.tmF(pk(k))),o.TL||0);
  const bookPts=o.mode==='book'?sGrid.map(s=>[xs(s),TQ.book(s,P)]):null;
  if(bookPts)ym=Math.max(ym,...bookPts.map(q=>q[1]));
  ym*=1.14;const yt=sym?[]:ticks(0,ym,5);
  const series=[];
  ks.forEach(k=>{if(k===sel)return;const q=pk(k);series.push({pts:sGrid.map(s=>[xs(s),TQ.full(s,q)]),col:'--muted',w:1.5,op:.75})});
  if(bookPts)series.push({pts:bookPts,col:'--live',w:2,dash:'7 5'});
  series.push({pts:sGrid.map(s=>[xs(s),TQ.full(s,P)]),col:'--blue',w:2.8});
  const Bm=sym?40:50;
  return chartSVG({W,H,L:sym?34:52,B:Bm,x0:0,x1:1,y0:0,y1:ym,yt,xt:sym?[]:[0,.2,.4,.6,.8,1],xf:false,aria:'منحنى العزم والانزلاق',
   under:(X,Y)=>{if(o.regions===false)return '';const a=X(xs(0)),b=X(xs(Math.min(smf,1))),c=X(xs(1));
     return `<rect x="${fx(Math.min(a,b))}" y="0" width="${fx(Math.abs(b-a))}" height="${H}" fill="var(--on)" opacity=".10"/>`+(smf<1?`<rect x="${fx(Math.min(b,c))}" y="0" width="${fx(Math.abs(c-b))}" height="${H}" fill="var(--stop)" opacity=".07"/>`:'')},
   series,
   extra:(X,Y)=>{let s='';const yb=H-Bm;
     // axis rows: S and n
     if(sym){s+=tx(X(xs(0)),yb+15,'0','m')+tx(X(xs(1)),yb+15,'1','m')+tx(X(xs(0)),yb+31,'ns','m')+tx(X(xs(1)),yb+31,'0','m');
       s+=tx(X(orient==='s'?1:0)+(orient==='s'?14:-14),yb+15,'S','b')+tx(X(orient==='s'?1:0)+(orient==='s'?14:-14),yb+31,'n','b');}
     else{[0,.2,.4,.6,.8,1].forEach(v=>{s+=tx(X(v),yb+15,fm(orient==='s'?v:1-v),'m')+tx(X(v),yb+31,fm(Math.round(p.ns*(orient==='s'?1-v:v))),'m')});
       s+=tx(4,yb+15,'S','b','start')+tx(4,yb+31,'n','b','start')}
     s+=tx(sym?20:46,14,'T'+(sym?'':' (Nm)'),'b',sym?'middle':'end');
     // region labels
     if(o.regions!==false){const mid=(a,b)=>(X(xs(a))+X(xs(b)))/2;const yy=ks.length>1?Y(ym*0.45):Y(ym)+16;
       if(Math.abs(X(xs(Math.min(smf,1)))-X(xs(0)))>70){s+=ar(mid(0,Math.min(smf,1)),yy,'منطقة التشغيل',{fs:11,col:'--on'})+ar(mid(0,Math.min(smf,1)),yy+14,'المستقر',{fs:11,col:'--on'})}
       if(smf<1&&Math.abs(X(xs(1))-X(xs(smf)))>70){s+=ar(mid(smf,1),yy,'منطقة التشغيل',{fs:11,col:'--stop'})+ar(mid(smf,1),yy+14,'غير المستقر',{fs:11,col:'--stop'})}}
     // family labels
     if(ks.length>1)ks.forEach(k=>{const q=pk(k),sm=TQ.smF(q),sx=Math.min(sm,1);const lab=k===1?'Ro':k+'Ro';s+=tx(X(xs(sx))+(orient==='s'?-1:1)*(sm>=1?-16:0),Y(TQ.full(sx,q))-7,lab,k===sel?'b':'m','middle',11)});
     // Tst
     s+=arrow(X(xs(1))+(orient==='s'?-10:10),yb,X(xs(1))+(orient==='s'?-10:10),Y(tst)+1,'--stop',1.6)+tx(X(xs(1))+(orient==='s'?-14:14),Y(tst)-8,sym?'Tst':'Tst = '+fm(R(tst,1)),'',orient==='s'?'end':'start',11,'--stop');
     // Tmax of the drawn (full) curve
     if(smf<=1){const xm=X(xs(smf)),ymx=Y(tmf);s+=`<path d="M${fx(xm)} ${fx(ymx)}V${yb}" stroke="var(--blue)" stroke-dasharray="4 4" stroke-width="1.4"/><circle cx="${fx(xm)}" cy="${fx(ymx)}" r="4.5" fill="var(--blue)"/>`;
       s+=tx(xm,ymx-9,sym?'Tmax':(o.mode==='book'?'قمة المنحنى ':'Tmax = ')+fm(R(tmf,1)),sym?'b':'b','middle',11).replace('txt b','txt b'+(o.mode==='book'&&!sym?' ar':''));
       if(sym&&o.smMark!==false)s+=tx(xm,yb+15,'Sm','b')}
     // the book's Tmax (equation 1-37) on the simplified curve (1-35)
     if(o.mode==='book'&&!sym){if(smb<=1){const xm=X(xs(smb)),ymx=Y(tmb);s+=`<path d="M${fx(xm)} ${fx(ymx)}V${yb}" stroke="var(--live)" stroke-dasharray="3 3" stroke-width="1.3"/><circle cx="${fx(xm)}" cy="${fx(ymx)}" r="4.5" fill="var(--live)"/>`+tx(xm,ymx+20,'Tmax(1-37) = '+fm(R(tmb,2)),'','middle',11,'--live')}
       else s+=tx(X(xs(1)),Y(tmb)-6,'Sm > 1','','middle',11,'--live')}
     // load line and operating point
     if(o.TL!=null&&!sym){const yl=Y(o.TL);s+=`<path d="M${X(0)} ${fx(yl)}H${X(1)}" stroke="var(--stop)" stroke-width="1.6" stroke-dasharray="8 4"/>`+tx(X(orient==='s'?0:1)+(orient==='s'?4:-4),yl-5,'TL = '+fm(R(o.TL,1)),'',orient==='s'?'start':'end',11,'--stop');
       const so=TQ.opS(P,o.TL);if(so!=null&&so>0)s+=`<circle cx="${fx(X(xs(so)))}" cy="${fx(yl)}" r="6" fill="var(--live)" stroke="var(--surface)" stroke-width="2"/>`}
     return s}})}

/* ================= Power-flow diagram (figure 1-18) ================= */
function sankeySVG(v,sym){
  const W=560,x0=150,wMax=120,sc=v.Pin>0?wMax/v.Pin:0,r0=8;
  const bw=P=>P<=1e-9?0:Math.max(2.2,P*sc);
  const bCu1=bw(v.Pcu1),bCor=bw(v.Pcor),bCu2=bw(v.Pcu2),bF=bw(v.PF);
  let w=bw(v.Pin);const blue='--blue',red='--stop';let s='',lab='';
  const yS=46,y1=yS+34,y2=y1+bCu1+r0+14,yG=y2+bCor+r0+30,y3=yG+30,yM=y3+bCu2+r0+28,y4=yM+28,yO=y4+bF+r0+26;
  const col=(ya,yb,wd,c)=>wd>0.5?`<rect x="${x0}" y="${fx(ya)}" width="${fx(wd)}" height="${fx(yb-ya)}" fill="var(${c})" opacity=".85"/>`:'';
  const xEnd=356;
  const branch=(y,b,c,label,val)=>{if(b<=0)return {svg:'',yl:y+r0};const xr=x0+w,yl=y+r0+b/2;const p=`M${fx(xr-b)} ${fx(y)}A${fx(r0+b)} ${fx(r0+b)} 0 0 0 ${fx(xr+r0)} ${fx(y+r0+b)}L${xEnd} ${fx(y+r0+b)}L${xEnd} ${fx(y+r0)}L${fx(xr+r0)} ${fx(y+r0)}A${r0} ${r0} 0 0 1 ${fx(xr)} ${fx(y)}Z`;
    w-=b;return {svg:`<path d="${p}" fill="var(${c})" opacity=".72"/>`+`<path d="M${xEnd} ${fx(yl-Math.max(5,b/2+3))}L${xEnd+12} ${fx(yl)}L${xEnd} ${fx(yl+Math.max(5,b/2+3))}Z" fill="var(${c})"/>`+tx(372,yl+4,label+(sym?'':' = '+val),'','start',12),yl}};
  const fk=x=>fm(R(x,3))+' kW';
  // column + branches
  const wIn=w;s+=col(yS,y1,wIn,blue);
  const b1=branch(y1,bCu1,red,sb('P','cu1'),fk(v.Pcu1));const w1=w;s+=col(y1,y2,w1,blue);
  const b2=branch(y2,bCor,red,sb('P','cor'),fk(v.Pcor));const wG=w;s+=col(y2,y3,wG,blue);
  const b3=branch(y3,bCu2,red,sb('P','cu2'),fk(v.Pcu2));const wM=w;s+=col(y3,y4,wM,'--on');
  const b4=branch(y4,bF,red,sb('P','F'),fk(v.PF));const wO=w;s+=col(y4,yO,wO,'--on');
  if(wO>0.5)s+=`<path d="M${x0-6} ${yO}L${fx(x0+wO+6)} ${yO}L${fx(x0+wO/2)} ${yO+16}Z" fill="var(--on)"/>`;
  s=b1.svg+b2.svg+b3.svg+b4.svg+s;
  // downward double-arrows inside the column
  [[yS+14,wIn],[(y2+y3)/2+8,wG],[(y3+y4)/2+6,wM],[yO-12,wO]].forEach(([y,wd])=>{if(wd>14)s+=`<path d="M${fx(x0+wd/2-5)} ${fx(y-6)}L${fx(x0+wd/2)} ${fx(y)}L${fx(x0+wd/2+5)} ${fx(y-6)}M${fx(x0+wd/2-5)} ${fx(y-12)}L${fx(x0+wd/2)} ${fx(y-6)}L${fx(x0+wd/2+5)} ${fx(y-12)}" stroke="var(--surface)" stroke-width="2" fill="none"/>`});
  // level labels (left)
  const L=(y,a,b)=>tx(x0-10,y,a,'b','end',13)+(b?tx(x0-10,y+15,b,'m','end',11):'');
  s+=L(yS+14,sb('P','in'),sym?'3Vph·Iph·cosθ':fk(v.Pin));
  s+=L(yG+14,sb('P','g'),sym?'':fk(v.Pg));
  s+=L(yM+12,sb('P','m'),sym?'':fk(v.Pm));
  s+=L(yO+4,sb('P','o'),sym?'':fk(v.Po));
  // stator / rotor separation (dashed line at the level of Pg)
  const yd=yG-4;s+=`<path d="M8 ${yd}H${xEnd-6}" stroke="var(--muted)" stroke-dasharray="5 4" stroke-width="1.3"/>`;
  s+=ar(54,yd-30,'العضو الثابت',{fs:12})+ar(54,yd+40,'العضو الدوار',{fs:12})+arrow(16,yd-6,16,yd-44,'--muted',1.4)+arrow(16,yd+6,16,yd+44,'--muted',1.4);
  // losses box
  const by0=y1-22,by1=b4.yl+22;s+=`<rect x="362" y="${fx(by0)}" width="192" height="${fx(by1-by0)}" rx="8" fill="none" stroke="var(--muted)" stroke-dasharray="4 4"/>`+ar(458,by0-7,'القدرة المفقودة في المحرك',{fs:12});
  // Ps bracket
  if(bCu1>0||bCor>0){const ya=b1.yl-6,yb=b2.yl+6;s+=`<path d="M${sym?470:497} ${fx(ya)}h5V${fx(yb)}h-5" fill="none" stroke="var(--fg)" stroke-width="1.3"/>`+tx(sym?482:506,(ya+yb)/2+(sym?4:-2),sb('P','s'),'b','start',12)+(sym?'':tx(506,(ya+yb)/2+12,fm(R(v.Pcu1+v.Pcor,3)),'m','start',10))}
  const H=Math.max(300,yO+30);return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="مخطط سريان القدرة داخل المحرك">${s}</svg>`}

/* ============================== Lesson 1.7 — power flow ============================== */
B.lesson({
 id:'u1-l7',unit:1,order:7,pages:'38–45',
 title:'القدرة في المحرك الحثي: سريان القدرة والمفاقيد والكفاءة',
 summary:'كيف تنساب القدرة الكهربائية الداخلة إلى العضو الثابت عبر الثغرة الهوائية إلى العضو الدوار حتى تخرج قدرةً ميكانيكية على العمود (الشكل 1-18)، وما يُفقد منها في كل مرحلة، ودور الانزلاق S في مفاقيد العضو الدوار والكفاءة، مع المثالين (1-6) و (1-7).',
 theory:[
  {h:'أولاً: القدرة في المحرك الحثي ثلاثي الأوجه',ref:'ص 38',html:`<p>«عادةً ما يوصف المحرك الحثي ثلاثي الأوجه بأنه <b>محول دوار</b>، والدخل قدرة كهربائية في شكل جهود وتيارات ثلاثية الأوجه والخرج هو قدرة ميكانيكية تظهر على عمود الدوران.» والعلاقة بين القدرة الكهربائية الداخلة والقدرة الميكانيكية الخارجة موضحة في الشكل (1-18) الذي يصف كيف تنساب القدرة داخل المحرك.</p>
   <p>القدرة الداخلة إلى العضو الثابت تعتمد قيمتها على حمل المحرك المتمثل في التيار ومعامل القدرة، وتعطى من المعادلة:</p>
   $$P_{in} = 3V_{ph}I_{ph}\\cos\\theta$$ $$P_{in} = \\sqrt{3}\\,V_L I_L\\cos\\theta ${eq('1-16')}$$
   <p>حيث: \\(V_{ph}\\) جهد الوجه للعضو الثابت؛ \\(I_{ph}\\) تيار الوجه للعضو الثابت؛ \\(V_L\\) جهد الخط للعضو الثابت؛ \\(I_L\\) تيار الخط للعضو الثابت؛ \\(\\theta\\) الزاوية بين الجهد والتيار وجيب تمامها هو معامل القدرة.</p>
   <p>«هذه القدرة الداخلة \\(P_{in}\\) سيفقد منها جزء في مقاومة ملفات العضو الثابت \\(R_1\\) على شكل حرارة وتسمى <b>مفاقيد نحاسية في العضو الثابت</b>»:</p>
   $$P_{cu1} = 3R_1 I_{ph}^2 ${eq('1-17')}$$`},
  {h:'مفاقيد العضو الثابت والقدرة المنتقلة عبر الثغرة الهوائية',ref:'ص 39',html:`<p>الجزء المتبقي من \\(P_{in}\\) سيفقد جزء منه في القلب الحديدي للعضو الثابت «وذلك بسبب وجود التيارات الدوامية وظاهرة التخلف المغناطيسي وتسمى <b>مفاقيد حديدية</b> \\(P_{cor}\\)»، وتمثلها المقاومة \\(R_c\\) في الدائرة المكافئة. مجموع النوعين يسمى <b>مفاقيد العضو الثابت</b> \\(P_S\\):</p>
   $$P_S = P_{cu1} + P_{cor} ${eq('1-18')}$$
   <p>الجزء المتبقي من \\(P_{in}\\) ينتقل عبر الثغرة الهوائية إلى العضو الدوار ويسمى «القدرة المنتقلة عبر الثغرة الهوائية من العضو الثابت إلى العضو الدوار» \\(P_g\\):</p>
   $$P_g = P_{in} - P_S ${eq('1-19')}$$
   <p>ويمكن حسابها أيضاً من:</p>$$P_g = 3\\frac{R'_2}{S} I'^2_2 ${eq('1-20')}$$
   <p>القدرة الداخلة إلى العضو الدوار \\(P_g\\) سيفقد جزء منها في مقاومة ملفات العضو الدوار على شكل حرارة وتسمى <b>مفاقيد نحاسية في العضو الدوار</b>:</p>
   $$P_{cu2} = 3R'_2 I'^2_2 ${eq('1-21')}$$`},
  {h:'القدرة الميكانيكية المتحولة والقدرة الخارجة',ref:'ص 40',html:`<p>الجزء المتبقي يتحول من قدرة كهربائية إلى قدرة ميكانيكية ويسمى <b>القدرة الميكانيكية المتحولة</b> \\(P_m\\):</p>
   $$P_m = P_g - P_{cu2} ${eq('1-22')}$$
   <p>«المقاومة \\(R'_2\\left(\\frac{1-S}{S}\\right)\\) في الدائرة المكافئة هي التي تمثل القدرة الميكانيكية المتحولة» وبالتالي:</p>
   $$P_m = 3R'_2\\frac{(1-S)}{S} I'^2_2 ${eq('1-23')}$$
   <p>\\(P_m\\) سيفقد جزء منها بسبب الاحتكاك الذي يتعرض له العضو الدوار مع الهواء وكراسي التحميل؛ مفاقيد الاحتكاك يرمز لها \\(P_F\\). والقدرة الميكانيكية الخارجة \\(P_o\\) هي الباقي:</p>
   $$P_o = P_m - P_F ${eq('1-24')}$$`},
  {fig:'(1-18)',ref:'ص 41',caption:'مخطط سريان القدرة داخل المحرك الحثي ثلاثي الأوجه: العمود من الأعلى إلى الأسفل Pin ← Pg ← Pm ← Po، والفروع إلى «القدرة المفقودة في المحرك». الخط المتقطع عند مستوى Pg يفصل العضو الثابت عن العضو الدوار. (عرض الأشرطة هنا للتوضيح فقط؛ جرّبه حيّاً في «المختبر».)',draw:()=>box(sankeySVG({Pin:100,Pcu1:6,Pcor:5,Pcu2:4.45,PF:3,Pg:89,Pm:84.55,Po:81.55},true),620)},
  {h:'مقارنة Pg و Pcu2 و Pm',ref:'ص 41–42',html:`<p>«يلاحظ أن المفاقيد الحديدية في العضو الدوار مهملة وذلك لارتباطها بتردد تيارات العضو الدوار.» ومن المعادلات (1-20) و (1-21) و (1-23) يمكن إجراء المقارنة التالية:</p>
   <table class="tt"><thead><tr><th>\\(P_g\\)</th><th>\\(P_m\\)</th><th>\\(P_{Cu2}\\)</th></tr></thead><tbody><tr><td>\\(3\\frac{R'_2}{S}I'^2_2\\)</td><td>\\(3R'_2\\frac{(1-S)}{S}I'^2_2\\)</td><td>\\(3R'_2 I'^2_2\\)</td></tr></tbody></table>
   <p>«نلاحظ من المقارنة أعلاه أنه عند ضرب \\(P_g\\) بالانزلاق \\(S\\) فإننا نحصل على \\(P_{Cu2}\\)»:</p>
   $$P_{cu2} = S\\, P_g ${eq('1-25')}$$
   <p>وكذلك عند ضرب \\(P_g\\) بالمعامل \\((1-S)\\) نحصل على \\(P_m\\):</p>
   $$P_m = (1-S)\\,P_g ${eq('1-26')}$$
   <p>«يتضح من هذا أن معامل الانزلاق \\(S\\) يلعب دوراً مهماً جداً في تحديد نسبة المفاقيد النحاسية في العضو الدوار \\(P_{Cu2}\\)، فعند زيادة الانزلاق تزداد المفاقيد النحاسية في العضو الدوار، وبالتالي <b>يجب أن يكون الانزلاق صغيراً بقدر الإمكان</b> لكي تقل المفاقيد النحاسية في العضو الدوار وبالتالي تزداد كفاءة المحرك.»</p>
   <p>إذا عُرفت القدرة الداخلة والخارجة تحسب الكفاءة:</p>
   $$\\eta_{\\%} = \\frac{P_o}{P_{in}}\\times 100 ${eq('1-27')}$$`},
  {note:`<b>توضيح للمتدرب (ليس من نص الكتاب):</b> القدرة التي تعبر الثغرة الهوائية \\(P_g\\) تنقسم دائماً بنسبة الانزلاق: جزء \\(S\\) يصير حرارة في نحاس العضو الدوار، والباقي \\((1-S)\\) يصير قدرة ميكانيكية. مثلاً إذا كانت <span class="ltr">P<sub>g</sub> = 100 kW</span> و <span class="ltr">S = 0.04</span> فإن <span class="ltr">P<sub>cu2</sub> = 4 kW</span> و <span class="ltr">P<sub>m</sub> = 96 kW</span>. ولو ارتفع الانزلاق إلى <span class="ltr">0.2</span> لصار <span class="ltr">20 kW</span> حرارة! لذلك المحرك الجيد انزلاقه صغير.`},
  {note:`<b>تذكير بمعادلات من الفصل الأول تستعملها حلول الأمثلة:</b> السرعة التزامنية \\(n_s = \\frac{120 f_s}{p}\\) (1-1)، والانزلاق \\(S = \\frac{n_s-n}{n_s} = \\frac{f_r}{f_s}\\) (1-3)، وسرعة العضو الدوار \\(n = n_s(1-S)\\) (1-4). وفي مثال (1-7) يحوّل الكتاب الكيلوواط إلى حصان بالقسمة على <span class="ltr">0.746</span>.`},
  {h:'أمثلة محلولة: مثال (1-6) ومثال (1-7)',ref:'ص 43–45',html:`<p><b>مثال (1-6):</b> محرك 6 أقطاب على مصدر <span class="ltr">440 V، 50 Hz</span>، القدرة الداخلة إلى العضو الدوار <span class="ltr">80 kW</span> وتردد تيار العضو الدوار <span class="ltr">1.67 Hz</span>. نتائج الكتاب: <span class="ltr">S = 0.0334</span>، <span class="ltr">n = 966.6 rpm</span>، <span class="ltr">P<sub>m</sub> = 77.33 kW</span>، <span class="ltr">P<sub>cu2</sub> = 2.67 kW</span>، <span class="ltr">R'<sub>2</sub> = 0.21 Ω</span> (عند تيار <span class="ltr">65 A</span>).</p>
   <p><b>مثال (1-7):</b> محرك 8 أقطاب على <span class="ltr">50 Hz</span> يدور بسرعة <span class="ltr">732 rpm</span>، <span class="ltr">P<sub>in</sub> = 40 kW</span>، مفاقيد العضو الثابت <span class="ltr">1 kW</span>، والاحتكاك <span class="ltr">2 kW</span>. «بتتبع مسار انتقال القدرة داخل المحرك في الشكل (1-18)»: <span class="ltr">S = 0.024</span>، <span class="ltr">P<sub>g</sub> = 39 kW</span>، <span class="ltr">P<sub>m</sub> = 38.064 kW</span>، <span class="ltr">P<sub>o</sub> = 36.064 kW = 48.343 hp</span>، <span class="ltr">P<sub>cu2</sub> = 0.936 kW</span>، <span class="ltr">η = 90.16 %</span>.</p>
   <p>الحل خطوة بخطوة بأرقام الكتاب في تبويب «الأمثلة المحلولة»، ويمكنك تغيير الأرقام.</p>`},
  {err:'في حل مثال (1-7) ص 44 طُبع: \\(n_s = \\frac{120\\times 50}{8} = 732\\ rpm\\)، والصحيح <b><span class="ltr">750 rpm</span></b> (‏<span class="ltr">6000 ÷ 8 = 750</span>). والكتاب نفسه يستعمل <span class="ltr">750</span> في السطر التالي \\(S=\\frac{750-732}{750}\\)، لذلك بقية النتائج صحيحة ولا تتأثر. الحاسبة تعرض 750.'},
  {note:'في مثال (1-6) الجهد <span class="ltr">440 V</span> معطى في السؤال ولا يُستخدم في الحل (ليس خطأ). وفي الفرع (هـ) يستعمل الكتاب القيمة المقرّبة <span class="ltr">P<sub>cu2</sub> = 2.67 kW = 2670 W</span>.'}
 ],
 lab:(el)=>{
  const st={mode:'p',Pin:40,VL:380,IL:70,pf:0.85,Pcu1:0.5,Pcor:0.5,S:0.024,PF:2,p:8,f:50,pre:0};
  el.innerHTML=`<div class="grid">
   <div class="panel c7"><h2>سريان القدرة حيّاً <small>مبني على الشكل (1-18) ص 41 والمعادلات (1-16) إلى (1-27)</small></h2>
    <p class="sub">عرض كل شريط يتناسب مع القدرة التي يحملها. الأزرق في العضو الثابت، والأخضر في العضو الدوار، والأحمر ما يُفقد.</p>
    <div class="svgbox" id="pfS" style="max-width:640px;margin-inline:auto"></div>
    <div class="facts">${fact('<bdi dir="ltr">P<sub>in</sub></bdi> (1-16)','pfPin')}${fact('<bdi dir="ltr">P<sub>s</sub> = P<sub>cu1</sub>+P<sub>cor</sub></bdi>','pfPs')}${fact('<bdi dir="ltr">P<sub>g</sub> = P<sub>in</sub> − P<sub>s</sub></bdi>','pfPg')}${fact('<bdi dir="ltr">P<sub>cu2</sub> = S·P<sub>g</sub></bdi>','pfCu2')}${fact('<bdi dir="ltr">P<sub>m</sub> = (1−S)·P<sub>g</sub></bdi>','pfPm')}${fact('<bdi dir="ltr">P<sub>o</sub> = P<sub>m</sub> − P<sub>F</sub></bdi>','pfPo')}${fact('<bdi dir="ltr">P<sub>o</sub></bdi> بالحصان','pfHp')}${fact('الكفاءة <bdi dir="ltr">η</bdi> (1-27)','pfEta')}${fact('سرعة العضو الدوار <bdi dir="ltr">n</bdi>','pfN')}</div>
    <div id="pfMsg" class="u1b-msg"></div></div>
   <div class="panel c5"><h2>المتغيرات</h2>
    <div class="u1b-row"><span class="lab">القدرة الداخلة:</span>${segHTML('pm',[['p','أدخلها مباشرة'],['vi','من الجهد والتيار']],'p')}</div>
    <div id="pfA">${sl('pfin','القدرة الداخلة <span class="ltr">P<sub>in</sub></span>',1,250,0.5,st.Pin)}</div>
    <div id="pfB" hidden>${sl('pfvl','جهد الخط <span class="ltr">V<sub>L</sub></span>',200,600,5,st.VL)}${sl('pfil','تيار الخط <span class="ltr">I<sub>L</sub></span>',1,400,1,st.IL)}${sl('pfpf','معامل القدرة <span class="ltr">cosθ</span>',0.5,1,0.01,st.pf)}</div>
    ${sl('pfc1','المفاقيد النحاسية في الثابت <span class="ltr">P<sub>cu1</sub></span>',0,10,0.1,st.Pcu1)}
    ${sl('pfco','المفاقيد الحديدية <span class="ltr">P<sub>cor</sub></span>',0,10,0.1,st.Pcor)}
    ${sl('pfs','الانزلاق <span class="ltr">S</span>',0,0.5,0.001,st.S)}
    ${sl('pff','مفاقيد الاحتكاك <span class="ltr">P<sub>F</sub></span>',0,10,0.1,st.PF)}
    <div class="u1b-row"><span class="lab">عدد الأقطاب:</span>${segHTML('pp',[[2,'2'],[4,'4'],[6,'6'],[8,'8']],st.p)}<span class="lab">التردد:</span>${segHTML('pf',[[50,'50 Hz'],[60,'60 Hz']],st.f)}</div>
    <div class="u1b-row"><button class="btn primary" id="pf17">أرقام مثال (1-7)</button><button class="btn" id="pf11">أرقام التمرين 11 ص 55</button></div>
    <p class="sub" style="margin-top:8px">الكتاب يعطي مجموع مفاقيد العضو الثابت فقط (<span class="ltr">P<sub>s</sub></span>)، فقسمناه عند الضغط على الزرين نصفين بين <span class="ltr">P<sub>cu1</sub></span> و <span class="ltr">P<sub>cor</sub></span> للتوضيح؛ النتائج لا تتأثر بالتقسيم.</p></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="pfSt"></ol></div></div>`;
  B.math(el);
  const $=s=>el.querySelector(s);
  const bind=(id,k)=>{$('#'+id).oninput=e=>{st[k]=+e.target.value;st.pre=0;draw()}};
  bind('pfin','Pin');bind('pfvl','VL');bind('pfil','IL');bind('pfpf','pf');bind('pfc1','Pcu1');bind('pfco','Pcor');bind('pfs','S');bind('pff','PF');
  el.querySelectorAll('[data-pm]').forEach(b=>b.onclick=()=>{st.mode=b.dataset.pm;segSet(el,'pm',st.mode);$('#pfA').hidden=st.mode!=='p';$('#pfB').hidden=st.mode!=='vi';draw()});
  el.querySelectorAll('[data-pp]').forEach(b=>b.onclick=()=>{st.p=+b.dataset.pp;segSet(el,'pp',st.p);draw()});
  el.querySelectorAll('[data-pf]').forEach(b=>b.onclick=()=>{st.f=+b.dataset.pf;segSet(el,'pf',st.f);draw()});
  const preset=(o,k)=>{Object.assign(st,o,{mode:'p',pre:k});segSet(el,'pm','p');segSet(el,'pp',st.p);segSet(el,'pf',st.f);$('#pfA').hidden=false;$('#pfB').hidden=true;
    [['pfin','Pin'],['pfc1','Pcu1'],['pfco','Pcor'],['pfs','S'],['pff','PF']].forEach(([id,kk])=>{$('#'+id).value=st[kk]});draw()};
  $('#pf17').onclick=()=>preset({Pin:40,Pcu1:0.5,Pcor:0.5,S:0.024,PF:2,p:8,f:50},17);
  $('#pf11').onclick=()=>preset({Pin:200,Pcu1:1.5,Pcor:1.5,S:0.05,PF:6,p:4,f:60},11);
  const calc=()=>{const Pin=st.mode==='p'?st.Pin:SQ3*st.VL*st.IL*st.pf/1000;const Ps=st.Pcu1+st.Pcor,Pg=Pin-Ps,Pcu2=st.S*Pg,Pm=(1-st.S)*Pg,Po=Pm-st.PF;return {Pin,Ps,Pg,Pcu2,Pm,Po,eta:Pin>0?Po/Pin*100:0}};
  const steps=stepsUI($('#pfSt'),[
   {t:'أرقام مثال (1-7)',x:'اضغط «أرقام مثال (1-7)». قارن بالكتاب: <span class="ltr">P<sub>g</sub> = 39 kW</span> و <span class="ltr">P<sub>m</sub> = 38.064 kW</span> و <span class="ltr">P<sub>o</sub> = 36.064 kW</span> و <span class="ltr">η = 90.16 %</span>، والسرعة <span class="ltr">732 rpm</span>.',done:()=>st.pre===17},
   {t:'زد الانزلاق',x:'ارفع <span class="ltr">S</span> إلى <span class="ltr">0.1</span> أو أكثر: يتضخم الشريط الأحمر <span class="ltr">P<sub>cu2</sub></span> وتهبط الكفاءة، و <span class="ltr">P<sub>g</sub></span> لم يتغير (السؤال 1 و 3 ص 55).',done:()=>st.S>=0.1},
   {t:'انزلاق صغير',x:'اخفض <span class="ltr">S</span> إلى <span class="ltr">0.01</span> أو أقل: تكاد مفاقيد العضو الدوار تختفي وترتفع الكفاءة، ولهذا «يجب أن يكون الانزلاق صغيراً بقدر الإمكان» (ص 42).',done:()=>st.S<=0.01},
   {t:'الاحتكاك',x:'زد <span class="ltr">P<sub>F</sub></span> إلى <span class="ltr">5 kW</span> أو أكثر: يتغير الشريط الأخير فقط <span class="ltr">P<sub>o</sub></span>، أما <span class="ltr">P<sub>g</sub></span> و <span class="ltr">P<sub>m</sub></span> فلا تتغير.',done:()=>st.PF>=5},
   {t:'القدرة من الجهد والتيار',x:'اختر «من الجهد والتيار» وحرّك <span class="ltr">cosθ</span>: تتغير <span class="ltr">P<sub>in</sub> = √3 V<sub>L</sub> I<sub>L</sub> cosθ</span> (1-16) ومعها كل الأشرطة.',done:()=>st.mode==='vi'}
  ],()=>({}));
  const draw=()=>{const c=calc();
   $('#pfin-v').textContent=fm(st.Pin,1)+' kW';$('#pfvl-v').textContent=st.VL+' V';$('#pfil-v').textContent=st.IL+' A';$('#pfpf-v').textContent=fm(st.pf,2);
   $('#pfc1-v').textContent=fm(st.Pcu1,1)+' kW';$('#pfco-v').textContent=fm(st.Pcor,1)+' kW';$('#pfs-v').textContent=fm(st.S,3);$('#pff-v').textContent=fm(st.PF,1)+' kW';
   const ok=c.Pg>0&&c.Po>0;
   $('#pfS').innerHTML=sankeySVG({Pin:c.Pin,Pcu1:st.Pcu1,Pcor:st.Pcor,Pcu2:Math.max(0,c.Pcu2),PF:Math.min(st.PF,Math.max(0,c.Pm)),Pg:c.Pg,Pm:c.Pm,Po:Math.max(0,c.Po)},false);
   const k=x=>fm(R(x,3))+' kW';
   $('#pfPin').textContent=k(c.Pin);$('#pfPs').textContent=k(c.Ps);$('#pfPg').textContent=k(c.Pg);$('#pfCu2').textContent=k(c.Pcu2);$('#pfPm').textContent=k(c.Pm);$('#pfPo').textContent=k(c.Po);
   $('#pfHp').textContent=fm(R(c.Po/0.746,3))+' hp';$('#pfEta').textContent=ok?fm(R(c.eta,2))+' %':'—';
   const ns=120*st.f/st.p;$('#pfN').textContent=fm(R(ns*(1-st.S),1))+' rpm';
   $('#pfMsg').innerHTML=!ok?'<div class="callout err">المفاقيد أكبر من القدرة الداخلة بهذه الأرقام؛ قلّل المفاقيد أو زد P<sub>in</sub>.</div>':
     `<div class="callout">السرعة التزامنية <span class="ltr">n<sub>s</sub> = 120×${st.f}÷${st.p} = ${fm(ns)} rpm</span>، ونسبة التقسيم في العضو الدوار: <span class="ltr">P<sub>cu2</sub> : P<sub>m</sub> = S : (1−S) = ${fm(R(st.S,3))} : ${fm(R(1-st.S,3))}</span>.${st.S===0?' <b>عند S = 0 لا يتولد عزم أصلاً</b> (توضيح: لا تيار في العضو الدوار)، فالمحرك الحقيقي لا يصل إلى السرعة التزامنية.':''}</div>`;
   steps.check()};
  draw();
 },
 examples:[
  {title:'مثال (1-6)',ref:'ص 43–44',
   q:'<p>«محرك حثي ثلاثي الأوجه ذو ستة أقطاب يعمل على مصدر جهده <span class="ltr">440 V</span> وتردده <span class="ltr">50 Hz</span>، فإذا كانت القدرة الداخلة إلى العضو الدوار <span class="ltr">80 kw</span> وتردد التيار في العضو الدوار <span class="ltr">1.67 Hz</span> احسب ما يلي: أ) الانزلاق ب) سرعة العضو الدوار جـ) القدرة الميكانيكية المتحولة د) القدرة المفقودة في العضو الدوار هـ) مقاومة ملفات العضو الدوار لكل وجه إذا كان التيار المار في ملفات العضو الدوار <span class="ltr">65A</span>»</p>',
   given:[{id:'p',label:'عدد الأقطاب',sym:'p',unit:'',value:6},{id:'f',label:'تردد المصدر',sym:'f_s',unit:'Hz',value:50},{id:'V',label:'جهد المصدر (لا يدخل في الحل)',sym:'V',unit:'V',value:440},
    {id:'Pg',label:'القدرة الداخلة إلى العضو الدوار',sym:'P_g',unit:'kW',value:80},{id:'fr',label:'تردد تيار العضو الدوار',sym:'f_r',unit:'Hz',value:1.67},{id:'I2',label:'تيار العضو الدوار',sym:"I'_2",unit:'A',value:65}],
   solve:(g)=>{const S=R(g.fr/g.f,4),ns=R(120*g.f/g.p,2),n=R(ns*(1-S),2),Pm=R((1-S)*g.Pg,2),Pc=R(S*g.Pg,2),R2=R(Pc*1000/(3*g.I2*g.I2),2);return [
    {t:'أ) الانزلاق من المعادلة (1-3):',f:`S=\\frac{f_r}{f_s}=\\frac{${g.fr}}{${g.f}}`,v:S,final:true},
    {t:'ب) نحسب أولاً السرعة التزامنية من المعادلة (1-1):',f:`n_s=\\frac{120 f_s}{p}=\\frac{120\\times ${g.f}}{${g.p}}`,v:ns,unit:'rpm'},
    {t:'ثم سرعة العضو الدوار من المعادلة (1-4):',f:`n=n_s(1-S)=${fm(ns)}\\,(1-${S})`,v:n,unit:'rpm',final:true},
    {t:'جـ) القدرة الميكانيكية المتحولة من المعادلة (1-26):',f:`P_m=(1-S)P_g=(1-${S})\\times ${g.Pg}`,v:Pm,unit:'kW',final:true},
    {t:'د) القدرة المفقودة في العضو الدوار من المعادلة (1-25):',f:`P_{cu2}=S\\,P_g=${S}\\times ${g.Pg}`,v:Pc,unit:'kW',final:true},
    {t:'هـ) مقاومة ملفات العضو الدوار لكل وجه من المعادلة (1-21) (بالواط: P<sub>cu2</sub> × 1000):',f:`R'_2=\\frac{P_{cu2}}{3I'^2_2}=\\frac{${fm(Pc*1000)}}{3\\times(${g.I2})^2}`,v:R2,unit:'Ω',final:true}]},
   note:'كل أرقام الكتاب في هذا المثال صحيحة (<span class="ltr">77.328 → 77.33</span>، <span class="ltr">2.672 → 2.67</span>، <span class="ltr">2670 ÷ 12675 = 0.2107 → 0.21</span>). الجهد <span class="ltr">440 V</span> لا يدخل في الحل.'},
  {title:'مثال (1-7)',ref:'ص 44–45',
   q:'<p>«محرك حثي ثلاثي الأوجه ذو ثمانية أقطاب يتغذى من مصدر تردده <span class="ltr">50Hz</span> ويدور بسرعة <span class="ltr">732 rpm</span>. فإذا كانت القدرة الداخلة إلى المحرك <span class="ltr">40 kw</span> ومفاقيد العضو الثابت <span class="ltr">1 kw</span> والمفاقيد الميكانيكية بسبب الاحتكاك <span class="ltr">2 kw</span> احسب ما يلي: أ) معامل الانزلاق ب) القدرة الميكانيكية الخارجة بالحصان جـ) المفاقيد النحاسية في العضو الدوار د) كفاءة المحرك»</p>',
   given:[{id:'p',label:'عدد الأقطاب',sym:'p',unit:'',value:8},{id:'f',label:'تردد المصدر',sym:'f_s',unit:'Hz',value:50},{id:'n',label:'سرعة العضو الدوار',sym:'n',unit:'rpm',value:732},
    {id:'Pin',label:'القدرة الداخلة',sym:'P_{in}',unit:'kW',value:40},{id:'Ps',label:'مفاقيد العضو الثابت',sym:'P_s',unit:'kW',value:1},{id:'PF',label:'مفاقيد الاحتكاك',sym:'P_F',unit:'kW',value:2}],
   solve:(g)=>{const ns=R(120*g.f/g.p,2),S=R((ns-g.n)/ns,4),Pg=R(g.Pin-g.Ps,3),Pm=R((1-S)*Pg,3),Po=R(Pm-g.PF,3),hp=R(Po/0.746,3),Pc=R(S*Pg,3),eta=R(Po/g.Pin*100,2);return [
    {t:'أ) نحسب أولاً السرعة التزامنية من المعادلة (1-1) (الكتاب طبع هنا 732 خطأً، انظر الملاحظة):',f:`n_s=\\frac{120 f_s}{p}=\\frac{120\\times ${g.f}}{${g.p}}`,v:ns,unit:'rpm'},
    {t:'ثم الانزلاق من المعادلة (1-3):',f:`S=\\frac{n_s-n}{n_s}=\\frac{${fm(ns)}-${g.n}}{${fm(ns)}}`,v:S,final:true},
    {t:'ب) بتتبع مسار انتقال القدرة داخل المحرك في الشكل (1-18):',f:`P_g=P_{in}-P_s=${g.Pin}-${g.Ps}`,v:Pg,unit:'kW'},
    {t:'',f:`P_m=(1-S)P_g=(1-${S})\\times ${fm(Pg)}`,v:Pm,unit:'kW'},
    {t:'',f:`P_o=P_m-P_F=${fm(Pm)}-${g.PF}`,v:Po,unit:'kW'},
    {t:'القدرة الخارجة بالحصان:',f:`P_o(hp)=\\frac{${fm(Po)}}{0.746}`,v:hp,unit:'hp',final:true},
    {t:'جـ) المفاقيد النحاسية في العضو الدوار من المعادلة (1-25):',f:`P_{cu2}=S\\,P_g=${S}\\times ${fm(Pg)}`,v:Pc,unit:'kW',final:true},
    {t:'د) كفاءة المحرك (1-27):',f:`\\eta_{\\%}=\\frac{P_o}{P_{in}}\\times100=\\frac{${fm(Po)}}{${g.Pin}}\\times 100`,v:eta,unit:'%',final:true}]},
   note:'<b>ملاحظة على الكتاب:</b> في ص 44 طُبع <span class="ltr">n<sub>s</sub> = 120×50/8 = 732 rpm</span>، والصحيح <span class="ltr">750 rpm</span>؛ الكتاب نفسه يستعمل 750 في السطر التالي، فبقية النتائج صحيحة ولا تتأثر. الحاسبة تعرض 750.'}
 ],
 quiz:[
  {q:'يوصف المحرك الحثي ثلاثي الأوجه في الكتاب بأنه:',o:['مولد تزامني','محول دوار','مقوم','محرك تيار مستمر'],c:1,e:'ص 38: «عادةً ما يوصف المحرك الحثي ثلاثي الأوجه بأنه محول دوار».'},
  {q:'مفاقيد العضو الثابت \\(P_S\\) هي مجموع:',o:['\\(P_{cu1}+P_{cor}\\)','\\(P_{cu2}+P_F\\)','\\(P_{cu1}+P_{cu2}\\)','\\(P_{cor}+P_F\\)'],c:0,e:'المعادلة (1-18): المفاقيد النحاسية في R1 والمفاقيد الحديدية في Rc.'},
  {q:'لماذا تهمل المفاقيد الحديدية في العضو الدوار؟',o:['لأن العضو الدوار من النحاس','لارتباطها بتردد تيارات العضو الدوار (وهو صغير)','لأنها تساوي مفاقيد الاحتكاك','لأن العضو الدوار لا يدور'],c:1,e:'ص 41: «لارتباطها بتردد تيارات العضو الدوار». (توضيح: تردد العضو الدوار f<sub>r</sub> = S·f<sub>s</sub> صغير جداً عند التشغيل.)'},
  {q:'إذا كانت \\(P_g = 50\\ kW\\) و \\(S = 0.04\\) فإن المفاقيد النحاسية في العضو الدوار:',o:['48 kW','2 kW','0.04 kW','52 kW'],c:1,e:'المعادلة (1-25): P<sub>cu2</sub> = S·P<sub>g</sub> = 0.04 × 50 = 2 kW.'},
  {q:'القدرة الميكانيكية المتحولة تساوي:',o:['\\(S\\,P_g\\)','\\((1-S)\\,P_g\\)','\\(P_{in}-P_F\\)','\\(P_g/S\\)'],c:1,e:'المعادلة (1-26).'},
  {q:'ماذا يحدث لكفاءة المحرك إذا زاد الانزلاق (مع ثبات باقي المفاقيد)؟',o:['تزيد','تقل','لا تتغير','تصبح 100%'],c:1,e:'ص 42: عند زيادة الانزلاق تزداد المفاقيد النحاسية في العضو الدوار فتقل الكفاءة.'},
  {q:'محرك 8 أقطاب على 50 Hz. سرعته التزامنية:',o:['732 rpm','750 rpm','1000 rpm','375 rpm'],c:1,e:'n<sub>s</sub> = 120 × 50 ÷ 8 = 750 rpm (والكتاب طبع 732 خطأً في مثال 1-7).'},
  {q:'في مثال (1-7) كانت كفاءة المحرك:',o:['97.5 %','90.16 %','95.16 %','36.06 %'],c:1,e:'η = 36.064 ÷ 40 × 100 = 90.16 %.'}
 ]
});

/* ============================== Lesson 1.8 — torque ============================== */
const P18={V:240,R1:0.4,R2:0.6,X1:1,X2:1,ns:1800};
const PFIG={V:240,R1:0.4,R2:0.4,X1:1,X2:1,ns:1800};      // illustrative values used to redraw figures 1-19 … 1-21
function torqueSteps(g,o){o=o||{};const Y=g.conn===0,V=Y?R(g.VL/SQ3,2):g.VL,K=R(180/(2*PI*g.ns),4),X=g.X1+g.X2,st=[];
  st.push(Y?{t:'ملفات المحرك موصلة على شكل نجمة، فجهد الوجه:',f:`V_{ph}=\\frac{V_L}{\\sqrt{3}}=\\frac{${g.VL}}{\\sqrt{3}}`,v:V,unit:'V'}:{t:'بما أن ملفات المحرك موصلة على شكل دلتا فإن:',f:`V_{ph}=V_L=${g.VL}`,v:V,unit:'V'});
  const P=o.part||(k=>'');
  if(o.fl){const S=R((g.ns-g.n)/g.ns,4);
   st.push({t:P(0)+'لحساب تيار الحمل الكامل أو عزم الحمل الكامل يجب أولاً أن نحسب الانزلاق الذي يحدث عنده الحمل الكامل:',f:`S=\\frac{n_s-n}{n_s}=\\frac{${g.ns}-${g.n}}{${g.ns}}`,v:S});
   const I2=R(V/Math.hypot(g.R1+g.R2/S,X),2);
   if(o.showI!==false)st.push({t:'في الدائرة المكافئة التقريبية يعتبر أن I<sub>ph</sub> ≅ I\'<sub>2</sub>، وبالتالي يحسب تيار الحمل الكامل من (1-33):',f:`I'_2=\\frac{V_{ph}}{\\sqrt{(R_1+\\frac{R'_2}{S})^2+X_{eq}^2}}=\\frac{${V}}{\\sqrt{(${g.R1}+\\frac{${g.R2}}{${S}})^2+(${g.X1}+${g.X2})^2}}`,v:I2,unit:'A',final:true});
   else st.push({t:'تيار الحمل الكامل من (1-33) (I<sub>ph</sub> ≅ I\'<sub>2</sub>):',f:`I'_2=\\frac{${V}}{\\sqrt{(${g.R1}+\\frac{${g.R2}}{${S}})^2+(${g.X1}+${g.X2})^2}}`,v:I2,unit:'A'});
   st.push({t:P(1)+'عزم الحمل الكامل يحسب بعد إيجاد التيار من المعادلة (1-31). ثابت المحرك (1-32):',f:`K=\\frac{3\\times60}{2\\pi n_s}=\\frac{3\\times 60}{2\\times\\pi\\times ${g.ns}}`,v:K});
   const T=o.bookT?69.74:R(K*g.R2/S*I2*I2,2);
   st.push({t:'',f:`T=K\\frac{R'_2}{S}I'^2_2=${K}\\times\\frac{${g.R2}}{${S}}\\times(${I2})^2`,v:T,unit:'Nm',final:true});
   if(o.cmpT)st.push({t:o.cmpT(R(K*g.R2/S*I2*I2,2))});
  } else st.push({t:'ثابت المحرك من (1-32):',f:`K=\\frac{3\\times60}{2\\pi n_s}=\\frac{3\\times 60}{2\\times\\pi\\times ${g.ns}}`,v:K});
  const Ist=R(V/Math.hypot(g.R1+g.R2,X),2),Tst=R(K*g.R2*Ist*Ist,2);
  st.push({t:P(2)+'تيار البدء يحسب من المعادلة (1-33) عندما S = 1:',f:`I'_{2st}=\\frac{V_{ph}}{\\sqrt{(R_1+R'_2)^2+X_{eq}^2}}=\\frac{${V}}{\\sqrt{(${g.R1}+${g.R2})^2+(${g.X1}+${g.X2})^2}}`,v:Ist,unit:'A',final:true});
  st.push({t:P(3)+'عزم البدء يحسب مباشرة من المعادلة (1-38) أو من (1-31) بعد التعويض عن تيار البدء والتعويض عن الانزلاق بالواحد:',f:`T_{st}=K R'_2 I'^2_{2st}=${K}\\times ${g.R2}\\times(${Ist})^2`,v:Tst,unit:'Nm',final:true});
  const Tm=R(K*V*V/(2*g.X2),2),Sm=R(g.R2/g.X2,4);
  st.push({t:P(4)+'العزم الأقصى يحسب مباشرة من المعادلة (1-37)، أما الانزلاق الذي يحدث عنده فمن المعادلة (1-36):',f:`T_{max}=\\frac{K V_{ph}^2}{2X'_2}=\\frac{${K}\\times(${V})^2}{2\\times ${g.X2}}`,v:Tm,unit:'Nm',final:true});
  st.push({t:'',f:`S_m=\\frac{R'_2}{X'_2}=\\frac{${g.R2}}{${g.X2}}`,v:Sm,final:true});
  if(o.add!=null){const R2n=R(g.R2+o.add,4),I3=R(V/Math.hypot(g.R1+R2n,X),2),T3=R(K*R2n*I3*I3,2);
   st.push({t:P(5)+`بإضافة ${o.add} Ω إلى كل وجه من العضو الدوار تصبح المقاومة R'<sub>2</sub> = ${fm(g.R2)} + ${o.add}:`,f:`I'_{2st}=\\frac{${V}}{\\sqrt{(${g.R1}+${fm(R2n)})^2+(${g.X1}+${g.X2})^2}}`,v:I3,unit:'A'});
   st.push({t:'',f:`T_{st}=K R'_2 I'^2_{2st}=${K}\\times ${fm(R2n)}\\times(${I3})^2`,v:T3,unit:'Nm',final:true})}
  if(o.full){const p={V,R1:g.R1,R2:g.R2,X1:g.X1,X2:g.X2,ns:g.ns};st.push({t:'<b>للمقارنة (ليس من الكتاب):</b> قمة المنحنى الكامل (1-34) بدون إهمال معاوقة العضو الثابت، عند <span class="ltr">S = R\'<sub>2</sub>/√(R<sub>1</sub>² + X<sub>eq</sub>²) = '+fm(R(TQ.smF(p),3))+'</span>:',v:R(TQ.tmF(p),2),unit:'Nm'})}
  return st}
const G18=[{id:'VL',label:'جهد المصدر',sym:'V_L',unit:'V',value:240},{id:'conn',label:'التوصيل (1 = دلتا، 0 = نجمة)',sym:'',unit:'',value:1,step:1,min:0,max:1},
 {id:'R1',label:'مقاومة الثابت',sym:'R_1',unit:'Ω',value:0.4},{id:'R2',label:'مقاومة الدوار المحولة',sym:"R'_2",unit:'Ω',value:0.6},{id:'X1',label:'معاوقة الثابت',sym:'X_1',unit:'Ω',value:1},{id:'X2',label:'معاوقة الدوار المحولة',sym:"X'_2",unit:'Ω',value:1},
 {id:'ns',label:'السرعة التزامنية',sym:'n_s',unit:'rpm',value:1800},{id:'n',label:'السرعة عند الحمل الكامل',sym:'n',unit:'rpm',value:1710}];
const Q18='<p>«محرك حثي ثلاثي الأوجه ملفاته موصلة على شكل دلتا يتغذى من مصدر جهده <span class="ltr">240 V</span> عناصر الدائرة المكافئة له كما يلي: <span class="ltr">R<sub>1</sub> = 0.4Ω، R\'<sub>2</sub> = 0.6Ω، X<sub>1</sub> = 1.0Ω، X\'<sub>2</sub> = 1.0Ω</span>. فإذا كانت السرعة التزامنية لهذا المحرك <span class="ltr">1800 rpm</span> وسرعة العضو الدوار عند الحمل الكامل <span class="ltr">1710 rpm</span>، احسب ما يلي: أ) تيار الحمل الكامل ب) عزم الحمل الكامل جـ) تيار البدء د) عزم البدء هـ) أقصى عزم للمحرك وعند أي انزلاق يحدث»</p>';
const part=k=>['أ) ','ب) ','جـ) ','د) ','هـ) ','و) '][k];

B.lesson({
 id:'u1-l8',unit:1,order:8,pages:'45–54',
 title:'العزم في المحرك الحثي ومنحنى العزم والسرعة',
 summary:'معادلة العزم بدلالة الانزلاق (1-34) ومنحناها (الشكلان 1-19 و 1-20)، ومنطقتا التشغيل المستقر وغير المستقر، والتحكم في موضع العزم الأقصى بمقاومة العضو الدوار (الشكل 1-21)، والعزم الأقصى وعزم البدء، مع مثال (1-8).',
 theory:[
  {h:'ثانياً: العزم في المحرك الحثي ثلاثي الأوجه',ref:'ص 45',html:`<p>«العزم أو عزم الدوران <span class="ltr">(Torque)</span> هو القوة المؤثرة على جسم ما فينتج عنها دوران ذلك الجسم حول مركزه، ويقاس بوحدة نيوتن متر <span class="ltr">Nm</span>، هذا هو التعريف العام للعزم.»</p>
   <p>«أما العزم الذي يؤثر على عمود الدوران في المحرك الحثي ثلاثي الأوجه فهو حاصل قسمة القدرة الميكانيكية المتحولة \\(P_m\\) على السرعة الزاوية لدوران العمود»:</p>
   $$T = \\frac{P_m}{\\omega}\\quad Nm ${eq('1-28')}$$
   <p>حيث \\(\\omega\\) السرعة الزاوية للعمود، و \\(T\\) العزم الميكانيكي الناشئ على عمود الدوران. «وحيث أن السرعة الزاوية لعمود الدوران متغيرة بتغير الحمل، لذلك يفضل استخدام <b>السرعة التزامنية الزاوية</b> بدلاً منها، ولكن نستخدم معها القدرة المنتقلة خلال الثغرة الهوائية \\(P_g\\) بدلاً من \\(P_m\\)»:</p>
   $$T = \\frac{P_g}{\\omega_s}\\quad Nm ${eq('1-29')}$$
   <p>حيث \\(\\omega_s\\) السرعة الزاوية للمجال المغناطيسي الدوار:</p>
   $$\\omega_s = \\frac{2\\pi n_s}{60}\\quad rad/sec ${eq('1-30')}$$
   <p>بالتعويض من (1-20) و (1-30) في (1-29):</p>
   $$T = \\frac{P_g}{\\omega_s} = \\frac{3\\frac{R'_2}{S}I'^2_2}{\\frac{2\\pi n_s}{60}}$$
   <p>وبعد قليل من الترتيب:</p>
   $$T = K\\frac{R'_2}{S}I'^2_2 ${eq('1-31')}$$`},
  {note:`<b>توضيح للمتدرب (ليس من نص الكتاب):</b> المعادلتان (1-28) و (1-29) تعطيان العزم نفسه، لأن \\(P_m=(1-S)P_g\\) و \\(\\omega=(1-S)\\omega_s\\)؛ فالعامل \\((1-S)\\) يختصر. مثال: \\(P_g = 10\\ kW\\) و \\(n_s = 1500\\ rpm\\) ⇒ \\(\\omega_s = 157.08\\ rad/s\\) ⇒ \\(T \\approx 63.66\\ Nm\\) مهما كان الانزلاق.`},
  {h:'ثابت المحرك ومعادلة العزم والانزلاق',ref:'ص 46',html:`<p>حيث K يسمى <b>ثابت المحرك الحثي ثلاثي الأوجه</b>:</p>
   $$K = \\frac{3\\times 60}{2\\pi n_s} ${eq('1-32')}$$
   <p>وبالرجوع إلى الدائرة المكافئة التقريبية في الشكل (1-12) يمكن إيجاد التيار \\(I'_2\\):</p>
   $$I'_2 = \\frac{V_{ph}}{Z_{eq}} = \\frac{V_{ph}}{\\sqrt{\\left(R_1+\\frac{R'_2}{S}\\right)^2 + X_{eq}^2}} ${eq('1-33')}$$
   <p>وبالتعويض عن \\(I'_2\\) في (1-31):</p>
   $$T = \\frac{K V_{ph}^2 R'_2}{\\left[\\left(R_1+\\frac{R'_2}{S}\\right)^2 + X_{eq}^2\\right]S} ${eq('1-34')}$$
   <p>«المعادلة (1-34) تمثل العلاقة بين العزم ومعامل الانزلاق ومنها يمكن حساب العزم عند أي قيمة للانزلاق. عند رسم العلاقة بين (العزم ومعامل الانزلاق) في المعادلة (1-34) فإننا نحصل على منحنى مشابه للمنحنى الموضح في الشكل (1-19).»</p>`},
  {note:'<b>توضيح:</b> الكتاب لا يعرّف \\(X_{eq}\\) في هذا الفصل؛ ويتضح من حل مثال (1-8) أنها \\(X_{eq}=X_1+X\'_2\\) (المعاوقة الحثية للثابت + المعاوقة الحثية المحولة للدوار).'},
  {fig:'(1-19)',ref:'ص 47',caption:'العلاقة بين (العزم و الانزلاق) أو (العزم و السرعة): محور الانزلاق S من 0 إلى 1 في وضعه الطبيعي، ومحور السرعة n تحته معكوس (من ns إلى 0). رُسم هنا من المعادلة (1-34) بقيم توضيحية.',draw:()=>box(torqueSVG({p:PFIG,orient:'s',symbolic:true,regions:false,smMark:false,H:290}),560)},
  {html:'<p>«يلاحظ في المنحنى أعلاه أن محور معامل الانزلاق في الوضع الطبيعي بينما محور السرعة معكوس، لذلك يفضل إعادة رسم المنحنى معكوساً لكي يتناسب مع محور السرعة كما هو موضح في الشكل التالي.»</p>'},
  {fig:'(1-20)',ref:'ص 48',caption:'العلاقة بين (العزم و معامل الانزلاق) أو (العزم و السرعة): محور السرعة n من 0 إلى ns، ومحور S تحته من 1 إلى 0. يبدأ المنحنى بعزم البدء Tst ويرتفع إلى العزم الأقصى Tmax عند Sm ثم يهبط بحدة إلى الصفر عند ns.',draw:()=>box(torqueSVG({p:PFIG,orient:'n',symbolic:true,H:290}),560)},
  {h:'منطقتا التشغيل',ref:'ص 48',html:`<p>منحنى (العزم والسرعة) ينقسم إلى منطقتين:</p>
   <ul><li><b>منطقة التشغيل غير المستقر:</b> «وهي المنطقة التي تسبق موضع العزم الأقصى، في هذه المنطقة لا يستطيع المحرك إدارة أي حمل وإذا حدث أن حمل المحرك في هذه المنطقة فإنه سوف يتباطأ حتى يتوقف عن الدوران.»</li>
   <li><b>منطقة التشغيل المستقر:</b> «وهي المنطقة التي بعد موضع العزم الأقصى، والتي يستطيع المحرك إدارة الحمل المقنن له، وعادة يكون <b>عزم الحمل الكامل مساوياً تقريباً لنصف العزم الأقصى</b> للمحرك بشرط أن لا يزيد عن عزم البدء، وفي حالة كون عزم الحمل أكبر من عزم البدء فإن المحرك لا يستطيع بدء الدوران، لذلك ينصح في هذه الحالة بدء تشغيل المحرك بحمل خفيف وبعد أن يصل إلى منطقة التشغيل المستقر تضاف بقية الأحمال.»</li></ul>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> لماذا المنطقة اليمنى مستقرة؟ إذا زاد الحمل قليلاً تبطؤ السرعة فيزيد الانزلاق، وفي هذه المنطقة زيادة الانزلاق <b>تزيد</b> العزم، فيلحق المحرك بالحمل ويستقر عند سرعة أقل بقليل. أما يسار القمة فالبطء يُنقص العزم فيزداد البطء حتى يتوقف المحرك. جرّب ذلك بخط الحمل في «المختبر».'},
  {h:'التحكم في موضع العزم الأقصى',ref:'ص 48–49',html:`<p>«معادلة العزم (1-34) تعتبر دالة رياضية بدلالة الانزلاق (S)، القيمة العظمى لها (\\(T_{max}\\)) يتغير موضعها بتغير ثوابت الدائرة المكافئة الداخلة فيها، وإذا أردنا إيجاد قيمة الانزلاق الذي تتحقق عنده القيمة العظمى لهذه الدالة فإن ذلك ممكن، وذلك بعد مفاضلتها ثم مساواتها بالصفر.» <span class="ref">ص 49</span> «قبل إجراء عملية التفاضل يفضل <b>إهمال معاوقة العضو الثابت</b> للتبسيط»:</p>
   $$T = \\frac{K V_{ph}^2 R'_2}{\\left[\\left(\\frac{R'_2}{S}\\right)^2 + X'^2_2\\right]S} ${eq('1-35')}$$
   <p>بعد مفاضلة (1-35) بالنسبة للانزلاق ومساواتها بالصفر نحصل على قيمة الانزلاق الذي يتحقق عنده العزم الأقصى:</p>
   $$S_m = \\frac{R'_2}{X'_2} ${eq('1-36')}$$
   <p>«إذاً: موضع العزم الأقصى (\\(T_{max}\\)) يمكن أن يتغير وذلك بتغير النسبة (\\(R'_2/X'_2\\))، ويمكن تحقيق ذلك عملياً بإضافة مقاومة موصلة على التوالي مع ملفات العضو الدوار الملفوف (ذو حلقات الانزلاق) وبالتالي يتغير موضع العزم الأقصى للمحرك بتغيير قيمة \\(S_m\\) كما هو موضح في الشكل التالي.»</p>`},
  {fig:'(1-21)',ref:'ص 50',caption:'تأثير تغير مقاومة العضو الدوار على موضع العزم الأقصى: ستة منحنيات Ro ثم R1 = 2Ro و R2 = 3Ro و R3 = 4Ro و R4 = 5Ro و R5 = 6Ro (كتبناها هنا 2Ro … 6Ro حتى لا تختلط بمقاومة الثابت R1). القمم بنفس الارتفاع تقريباً وتنتقل نحو S = 1 كلما زادت المقاومة. مرسومة من (1-34) بقيم توضيحية.',draw:()=>box(torqueSVG({p:PFIG,orient:'n',symbolic:true,regions:false,smMark:false,fam:[1,2,3,4,5,6],sel:1,H:300}),560)},
  {err:'يقول الكتاب في ص 50: «يلاحظ من الشكل رقم (1-21) أن <b>عزم البدء يزداد كلما زادت مقاومة ملفات العضو الدوار</b>». لكن في الشكل نفسه منحنى <span class="ltr">R5 = 6Ro</span> عزمه عند <span class="ltr">S = 1</span> <b>أقل</b> من منحنى <span class="ltr">R4 = 5Ro</span>، لأن قمته تجاوزت <span class="ltr">S = 1</span>. الزيادة صحيحة فقط إلى أن يصل موضع العزم الأقصى إلى لحظة البدء (<span class="ltr">S<sub>m</sub> = 1</span>)، وبعدها يقل عزم البدء. رسمنا المنحنيات كما يظهرها الشكل.'},
  {h:'العزم الأقصى',ref:'ص 50',html:`<p>«ويمكن أيضا من المعادلة (1-34) حساب قيمة العزم الأقصى للمحرك وذلك عندما ننقل موضع العزم الأقصى إلى لحظة البدء أي أن (\\(S_m = 1\\ \\&\\ R'_2 = X'_2\\)) فتصبح المعادلة كما يلي»:</p>
   $$T_{max} = \\frac{K V_{ph}^2}{2X'_2} ${eq('1-37')}$$`},
  {err:'تعليل الكتاب للمعادلة (1-37) مربك: الصيغة لا تحتاج أن يكون <span class="ltr">S<sub>m</sub> = 1</span>؛ فهي تنتج مباشرة بالتعويض بـ \\(S=S_m=R\'_2/X\'_2\\) في المعادلة المبسطة (1-35) لأي قيمة لـ \\(R\'_2\\)، ولذلك لا تحتوي الصيغة على \\(R\'_2\\) (العزم الأقصى لا يتغير بتغير مقاومة العضو الدوار، بل يتغير موضعه فقط، كما في الشكل 1-21). والصيغة مأخوذة من (1-35) التي أُهملت فيها معاوقة العضو الثابت، وليس من (1-34) الكاملة كما يقول النص.'},
  {h:'حساب عزم البدء',ref:'ص 50–51',html:`<p>«يلاحظ من الشكل رقم (1-21) أن عزم البدء يزداد كلما زادت مقاومة ملفات العضو الدوار، أي أنه يمكن التحكم في قيمة عزم البدء وذلك بتغيير قيمة مقاومة ملفات العضو الدوار \\(R'_2\\) وذلك بإضافة مقاومة موصلة على التوالي مع ملفات العضو الدوار كما هو واضح من المنحنيات في الشكل (1-21). أما قيمة عزم البدء فيمكن إيجادها مباشرة من المعادلة (1-34) عندما يكون (S = 1)»:</p>
   $$T_{st} = \\frac{K V_{ph}^2 R'_2}{\\left[(R_1+R'_2)^2 + X_{eq}^2\\right]} ${eq('1-38')}$$`},
  {h:'مثال (1-8)',ref:'ص 52–54',html:`${Q18}<p>نتائج الكتاب: <span class="ltr">S = 0.05</span>، <span class="ltr">I'<sub>2</sub> = 19.11 A</span>، <span class="ltr">K = 0.0159</span>، <span class="ltr">T = 69.74 Nm</span>، <span class="ltr">I'<sub>2st</sub> = 107.33 A</span>، <span class="ltr">T<sub>st</sub> = 109.9 Nm</span>، <span class="ltr">T<sub>max</sub> = 457.92 Nm</span> عند <span class="ltr">S<sub>m</sub> = 0.6</span>. الحل خطوة بخطوة في تبويب «الأمثلة المحلولة» بنسختين: «كما في الكتاب» و«المصحح».</p>`},
  {err:'في الفرع (ب) ص 53 طُبع: \\(T = 0.0159\\times\\frac{0.6}{0.05}\\times(19.11)^2 = 69.74\\ Nm\\). بالأرقام المكتوبة نفسها الناتج <b><span class="ltr">69.68 Nm</span></b> (‏<span class="ltr">0.0159 × 12 × 365.19 = 69.68</span>)؛ والرقم 69.74 قريب مما يخرج لو استُعمل K بدون تقريب (<span class="ltr">0.015915…</span>). الفرق صغير. الحاسبة «كما في الكتاب» تعرض 69.74، و«المصحح» تعرض 69.68.'},
  {err:'في الفرع (هـ) ص 54 حُسب العزم الأقصى من (1-37) <b>بإهمال معاوقة العضو الثابت</b> (‏<span class="ltr">X\'<sub>2</sub> = 1</span> فقط وبدون R<sub>1</sub>)، بينما الفروع (أ)–(د) استعملت الدائرة الكاملة (‏<span class="ltr">R<sub>1</sub></span> و <span class="ltr">X<sub>eq</sub> = 2</span>). لذلك <span class="ltr">457.92 Nm</span> لا تطابق قمة منحنى (1-34) لنفس المحرك: قمته الفعلية نحو <span class="ltr">188 Nm</span> عند <span class="ltr">S ≈ 0.29</span> (حساب توضيحي ليس من الكتاب). هذا تبسيط من الكتاب وليس خطأً حسابياً؛ نعتمد 457.92 في الحاسبة كما في الكتاب، وفي «المختبر» تجد مفتاحاً يقارن «طريقة الكتاب (بإهمال معاوقة الثابت)» بـ«المنحنى الكامل».'}
 ],
 lab:(el)=>{
  const st={VL:240,conn:'d',R1:.4,R2:.6,X1:1,X2:1,ns:1800,TL:69.7,orient:'n',mode:'book',fam:0,k:1,pre:0};
  el.innerHTML=`<div id="tqtp"></div><div class="grid">
   <div class="panel c7"><h2>منحنى العزم والانزلاق حيّاً <small>المعادلة (1-34)، والأشكال (1-19) و (1-20) و (1-21) ص 47–50</small></h2>
    <div class="u1b-row"><span class="lab">المحور:</span>${segHTML('to',[['s','الشكل (1-19): محور S'],['n','الشكل (1-20): محور n']],st.orient)}</div>
    <div class="u1b-row"><span class="lab">العزم الأقصى:</span>${segHTML('tm',[['book','طريقة الكتاب (بإهمال معاوقة الثابت)'],['full','المنحنى الكامل']],st.mode)}</div>
    <div class="svgbox" id="tqC"></div>
    <div id="tqLeg"></div>
    <div id="tqMsg" class="u1b-msg"></div>
    <div class="facts">${fact('ثابت المحرك <bdi dir="ltr">K</bdi> (1-32)','tqK')}${fact('تيار البدء <bdi dir="ltr">I\'<sub>2st</sub></bdi>','tqIs')}${fact('عزم البدء <bdi dir="ltr">T<sub>st</sub></bdi> (1-38)','tqTs')}${fact('<span id="tqTmL">العزم الأقصى</span>','tqTm')}${fact('<span id="tqSmL">انزلاقه</span>','tqSm')}${fact('انزلاق التشغيل <bdi dir="ltr">S</bdi>','tqS')}${fact('سرعة التشغيل <bdi dir="ltr">n</bdi>','tqN')}${fact('تيار التشغيل <bdi dir="ltr">I\'<sub>2</sub></bdi>','tqI')}</div></div>
   <div class="panel c5"><h2>المحرك والحمل</h2>
    ${sl('tqvl','جهد الخط <span class="ltr">V<sub>L</sub></span>',100,500,1,st.VL)}
    <div class="u1b-row"><span class="lab">التوصيل:</span>${segHTML('tc',[['d','دلتا Δ'],['y','نجمة Y']],st.conn)}</div>
    ${sl('tqr1','مقاومة الثابت <span class="ltr">R<sub>1</sub></span>',0,2,0.01,st.R1)}
    ${sl('tqr2','مقاومة الدوار <span class="ltr">R\'<sub>2</sub></span> (Ro)',0.05,3,0.01,st.R2)}
    ${sl('tqx1','معاوقة الثابت <span class="ltr">X<sub>1</sub></span>',0.1,3,0.01,st.X1)}
    ${sl('tqx2','معاوقة الدوار <span class="ltr">X\'<sub>2</sub></span>',0.1,3,0.01,st.X2)}
    <div class="u1b-row"><span class="lab">السرعة التزامنية:</span>${segHTML('tn',[[3000,'3000'],[1800,'1800'],[1500,'1500'],[1000,'1000'],[750,'750']],st.ns)}</div>
    ${sl('tqtl','عزم الحمل <span class="ltr">T<sub>L</sub></span>',0,600,0.1,st.TL)}
    <div class="u1b-row"><span class="lab">مقاومة العضو الدوار (الشكل 1-21):</span>${segHTML('tk',[[1,'Ro'],[2,'2Ro'],[3,'3Ro'],[4,'4Ro'],[5,'5Ro'],[6,'6Ro']],st.k)}</div>
    <div class="u1b-row"><label style="display:flex;gap:6px;align-items:center;font-size:14px"><input type="checkbox" id="tqfam"> اعرض عائلة المنحنيات الست</label></div>
    <div class="u1b-row"><button class="btn primary" id="tq18">قيم مثال (1-8)</button><button class="btn" id="tqF"><span id="tqFl">قيم توضيحية</span> للشكل (1-21)</button></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="tqSt"></ol></div></div>`;
  B.math(el);
  const $=s=>el.querySelector(s);
  const prm=()=>({V:st.conn==='d'?st.VL:st.VL/SQ3,R1:st.R1,R2:st.R2,X1:st.X1,X2:st.X2,ns:st.ns});
  const bind=(id,k)=>{$('#'+id).oninput=e=>{st[k]=+e.target.value;if(k!=='TL')st.pre=0;draw()}};
  bind('tqvl','VL');bind('tqr1','R1');bind('tqr2','R2');bind('tqx1','X1');bind('tqx2','X2');bind('tqtl','TL');
  const segs=[['to','orient',0],['tm','mode',0],['tc','conn',0],['tn','ns',1],['tk','k',1]];
  segs.forEach(([a,k,num])=>el.querySelectorAll(`[data-${a}]`).forEach(b=>b.onclick=()=>{st[k]=num?+b.dataset[a]:b.dataset[a];segSet(el,a,st[k]);if(k==='conn'||k==='ns')st.pre=0;draw()}));
  $('#tqfam').onchange=e=>{st.fam=e.target.checked?1:0;draw()};
  const setAll=()=>{[['tqvl','VL'],['tqr1','R1'],['tqr2','R2'],['tqx1','X1'],['tqx2','X2'],['tqtl','TL']].forEach(([id,k])=>{$('#'+id).value=st[k]});segs.forEach(([a,k])=>segSet(el,a,st[k]))};
  $('#tq18').onclick=()=>{Object.assign(st,{VL:240,conn:'d',R1:.4,R2:.6,X1:1,X2:1,ns:1800,k:1,pre:18});setAll();draw()};
  const TP=B.params($('#tqtp'),'u1-l8',[
   {k:'Ro',label:'مقاومة الدوار Ro (زر الشكل 1-21)',unit:'Ω',value:0.4,min:0.05,max:3,step:0.01},
   {k:'TL',label:'عزم الحمل T<sub>L</sub> (زر الشكل 1-21)',unit:'Nm',value:60,min:0,max:600,step:0.1}],()=>{fLbl();if(st.pre===21)applyF(st.k)});
  const fLbl=()=>{$('#tqFl').textContent=TP.trainer?'قيم المدرب':'قيم توضيحية'};fLbl();
  const applyF=k=>{Object.assign(st,{VL:240,conn:'d',R1:.4,R2:TP.v.Ro,X1:1,X2:1,ns:1800,k:k||1,fam:1,TL:TP.v.TL,pre:21});$('#tqfam').checked=true;setAll();draw()};
  $('#tqF').onclick=()=>applyF();
  const W=()=>{const P=Object.assign(prm(),{R2:st.R2*st.k});return {P,tst:TQ.tst(P),tmf:TQ.tmF(P),so:TQ.opS(P,st.TL)}};
  const steps=stepsUI($('#tqSt'),[
   {t:'قيم مثال (1-8)',x:'اضغط «قيم مثال (1-8)». لاحظ <span class="ltr">T<sub>st</sub> ≈ 109.9 Nm</span> و <span class="ltr">I\'<sub>2st</sub> ≈ 107.33 A</span>، وهي نتائج المثال.',done:()=>st.pre===18},
   {t:'نقطة الحمل الكامل',x:'اجعل عزم الحمل <span class="ltr">T<sub>L</sub> ≈ 69.7 Nm</span>: تقع نقطة التشغيل عند <span class="ltr">S ≈ 0.05</span> أي <span class="ltr">n ≈ 1710 rpm</span>، وهي سرعة الحمل الكامل في المثال.',done:w=>w.so!=null&&Math.abs(w.so-0.05)<0.003},
   {t:'اقلب المحور',x:'اختر «الشكل (1-19): محور S» ثم ارجع إلى الشكل (1-20). هو المنحنى نفسه، والفرق اتجاه المحور فقط.',done:()=>st.orient==='s'},
   {t:'العزم الأقصى بطريقتين',x:'اختر «المنحنى الكامل»: قمة منحنى (1-34) نحو <span class="ltr">188 Nm</span> عند <span class="ltr">S ≈ 0.29</span>. ثم ارجع إلى «طريقة الكتاب»: المنحنى المتقطع البرتقالي (1-35) قمته <span class="ltr">457.92 Nm</span> عند <span class="ltr">S<sub>m</sub> = 0.6</span> لأنه يهمل R<sub>1</sub> و X<sub>1</sub>.',done:()=>st.mode==='full'},
   {t:'حمل أكبر من عزم البدء',x:'ارفع <span class="ltr">T<sub>L</sub></span> فوق عزم البدء وتحت العزم الأقصى: المحرك لا يستطيع أن يبدأ بهذا الحمل، ويستطيع أن يحمله إذا بدأ بحمل خفيف (ص 48).',done:w=>st.TL>w.tst&&st.TL<w.tmf},
   {t:'مقاومة العضو الدوار',x:'اضغط زر «قيم توضيحية للشكل (1-21)» (أو «قيم المدرب للشكل (1-21)») ثم اختر <span class="ltr">4Ro</span> ثم <span class="ltr">5Ro</span>: تنتقل القمة نحو <span class="ltr">S = 1</span> ويرتفع عزم البدء، وارتفاع القمة لا يتغير.',done:()=>st.pre===21&&st.k===5},
   {t:'بعد أن تتجاوز القمة لحظة البدء',x:'اختر <span class="ltr">6Ro</span>: قمته خرجت عن <span class="ltr">S = 1</span> فصار عزم البدء <b>أقل</b> من 5Ro، كما في الشكل (1-21) (انظر ملاحظة الكتاب في الشرح).',done:()=>st.k===6}
  ],W);
  const draw=()=>{const P0=prm(),w=W(),P=w.P,K=TQ.K(st.ns);
   $('#tqvl-v').textContent=st.VL+' V'+(st.conn==='y'?' (Vph = '+fm(R(P0.V,2))+' V)':'');$('#tqr1-v').textContent=fm(st.R1,2)+' Ω';$('#tqr2-v').textContent=fm(st.R2,2)+' Ω'+(st.k>1?' × '+st.k+' = '+fm(R(st.R2*st.k,2))+' Ω':'');$('#tqx1-v').textContent=fm(st.X1,2)+' Ω';$('#tqx2-v').textContent=fm(st.X2,2)+' Ω';$('#tqtl-v').textContent=fm(st.TL,1)+' Nm';
   $('#tqC').innerHTML=torqueSVG({p:P0,orient:st.orient,mode:st.mode,TL:st.TL,fam:st.fam?[1,2,3,4,5,6]:[st.k],sel:st.k,H:340});
   $('#tqLeg').innerHTML=legend([['--blue','منحنى (1-34) الكامل'].concat([]),...(st.mode==='book'?[['--live','المنحنى المبسط (1-35) بإهمال معاوقة الثابت',1]]:[]),['--stop','عزم الحمل',1],...(st.fam?[['--muted','بقية منحنيات الشكل (1-21)']]:[])]);
   const tst=w.tst,Is=TQ.I2(1,P);$('#tqK').textContent=fm(R(K,4));$('#tqIs').textContent=fm(R(Is,2))+' A';$('#tqTs').textContent=fm(R(tst,2))+' Nm';
   if(st.mode==='book'){$('#tqTmL').innerHTML='العزم الأقصى (1-37)';$('#tqSmL').innerHTML='<bdi dir="ltr">S<sub>m</sub></bdi> (1-36)';$('#tqTm').textContent=fm(R(TQ.tmB(P),2))+' Nm';$('#tqSm').textContent=fm(R(TQ.smB(P),3))}
   else{$('#tqTmL').innerHTML='قمة المنحنى الكامل';$('#tqSmL').innerHTML='انزلاق القمة (حساب توضيحي)';$('#tqTm').textContent=fm(R(w.tmf,2))+' Nm';$('#tqSm').textContent=fm(R(TQ.smF(P),3))}
   const so=w.so;$('#tqS').textContent=so==null?'—':fm(R(so,4));$('#tqN').textContent=so==null?'0 (توقف)':fm(R(st.ns*(1-so),1))+' rpm';$('#tqI').textContent=so==null?'—':fm(R(so>0?TQ.I2(so,P):0,2))+' A';
   let m='';
   if(so==null)m=`<div class="callout err"><b>عزم الحمل أكبر من العزم الأقصى للمحرك (${fm(R(w.tmf,1))} Nm):</b> لا توجد نقطة تشغيل؛ المحرك يتباطأ حتى يتوقف عن الدوران.</div>`;
   else if(st.TL>tst)m=`<div class="callout err"><b>عزم الحمل أكبر من عزم البدء (${fm(R(tst,1))} Nm):</b> «المحرك لا يستطيع بدء الدوران» بهذا الحمل. إن بدأ بحمل خفيف ثم أضيف الحمل بعد وصوله إلى منطقة التشغيل المستقر فإنه يعمل عند النقطة البرتقالية (ص 48).</div>`;
   else m=`<div class="callout">نقطة التشغيل (البرتقالية) في <b>منطقة التشغيل المستقر</b>: العزم الناتج يساوي عزم الحمل عند <span class="ltr">S = ${fm(R(so,4))}</span>.${st.mode==='book'&&TQ.smB(P)>1?' (في الطريقة المبسطة <span class="ltr">S<sub>m</sub> = R\'<sub>2</sub>/X\'<sub>2</sub></span> أكبر من 1 فقمتها خارج الرسم.)':''}</div>`;
   if(st.mode==='book')m+=`<div class="callout"><b>طريقة الكتاب:</b> <span class="ltr">T<sub>max</sub> = KV<sub>ph</sub>²/2X'<sub>2</sub></span> (1-37) و <span class="ltr">S<sub>m</sub> = R'<sub>2</sub>/X'<sub>2</sub></span> (1-36) تأتيان من المعادلة المبسطة (1-35) التي <b>تهمل R<sub>1</sub> و X<sub>1</sub></b> (المنحنى البرتقالي المتقطع)، أما المنحنى الأزرق فهو (1-34) الكامل الذي يعطي عزم البدء والتيار في المثال. لذلك قمة الأزرق (${fm(R(w.tmf,1))} Nm) أقل من رقم الكتاب (${fm(R(TQ.tmB(P),2))} Nm).</div>`;
   else m+=`<div class="callout"><b>المنحنى الكامل (توضيح، ليس من الكتاب):</b> قمة (1-34) تحدث عند <span class="ltr">S = R'<sub>2</sub>/√(R<sub>1</sub>² + X<sub>eq</sub>²)</span>، وهي أصغر من قيمة الكتاب لأن معاوقة العضو الثابت تأخذ جزءاً من الجهد.</div>`;
   $('#tqMsg').innerHTML=m;steps.check()};
  draw();
 },
 examples:[
  {title:'مثال (1-8) — الحل كما في الكتاب',ref:'ص 52–54',q:Q18,given:G18,
   solve:(g,B,isBook)=>torqueSteps(g,{fl:true,part,bookT:isBook}),
   note:'<b>ملاحظة على الكتاب:</b> بقيم الكتاب تعرض الحاسبة عزم الحمل الكامل <span class="ltr">69.74 Nm</span> كما طُبع، مع أن الأرقام المكتوبة في السطر نفسه (<span class="ltr">0.0159 × 12 × 19.11²</span>) تعطي <span class="ltr">69.68 Nm</span> (انظر الحل المصحح أسفل). إذا غيّرت أي رقم تحسب الحاسبة بخطوات الكتاب وتقريبه (K بأربع خانات). والعزم الأقصى <span class="ltr">457.92 Nm</span> محسوب بطريقة الكتاب (1-37) التي تهمل معاوقة العضو الثابت.'},
  {title:'مثال (1-8) — الحل المصحح',ref:'ص 52–54',q:'<p>نفس المثال، لكن عزم الحمل الكامل محسوب بالأرقام المطبوعة نفسها (<span class="ltr">K = 0.0159</span> و <span class="ltr">I\'<sub>2</sub> = 19.11 A</span>). وأضفنا في آخره للمقارنة قمة المنحنى الكامل (1-34). (تصحيح — ليس من الكتاب.)</p>',given:G18,
   solve:(g)=>torqueSteps(g,{fl:true,part,full:true}),
   note:'الناتج المصحح لعزم الحمل الكامل <span class="ltr">69.68 Nm</span> (الكتاب 69.74)، وبقية الأرقام مطابقة للكتاب. العزم الأقصى يبقى <span class="ltr">457.92 Nm</span> بطريقة الكتاب (1-37)؛ وقمة المنحنى الكامل نحو <span class="ltr">188 Nm</span> للمقارنة فقط.'}
 ],
 quiz:[
  {q:'العزم في المحرك الحثي حسب المعادلة (1-29) يساوي:',o:['\\(P_g\\,\\omega_s\\)','\\(P_g/\\omega_s\\)','\\(P_o/P_{in}\\)','\\(P_{cu2}/S\\)'],c:1,e:'«نستخدم السرعة التزامنية الزاوية مع القدرة المنتقلة خلال الثغرة الهوائية»: T = P<sub>g</sub>/ω<sub>s</sub>.'},
  {q:'لماذا يفضل الكتاب استعمال \\(\\omega_s\\) بدلاً من سرعة العمود \\(\\omega\\)؟',o:['لأن سرعة العمود متغيرة بتغير الحمل','لأن ω<sub>s</sub> أصغر','لأن ω لا تقاس','لأن ω<sub>s</sub> تساوي صفراً'],c:0,e:'ص 45: «وحيث أن السرعة الزاوية لعمود الدوران متغيرة بتغير الحمل…».'},
  {q:'محرك سرعته التزامنية 1800 rpm. ثابت المحرك K تقريباً:',o:['0.0159','0.0318','0.159','188.5'],c:0,e:'K = 3×60 ÷ (2π×1800) ≈ 0.0159 (كما في مثال 1-8).'},
  {q:'في منطقة التشغيل غير المستقر:',o:['يستطيع المحرك إدارة الحمل المقنن','المحرك يتباطأ حتى يتوقف إذا حُمّل','يكون الانزلاق صفراً','يكون العزم ثابتاً'],c:1,e:'ص 48: المنطقة التي تسبق موضع العزم الأقصى.'},
  {q:'عادة يكون عزم الحمل الكامل مساوياً تقريباً لـ:',o:['ضعف العزم الأقصى','نصف العزم الأقصى','عزم البدء تماماً','صفر'],c:1,e:'ص 48: «عادة يكون عزم الحمل الكامل مساوياً تقريباً لنصف العزم الأقصى».'},
  {q:'حسب المعادلة (1-36) يمكن تحريك موضع العزم الأقصى بتغيير:',o:['\\(R\'_2/X\'_2\\)','جهد المصدر فقط','مفاقيد الاحتكاك','عدد الفرش'],c:0,e:'S<sub>m</sub> = R\'<sub>2</sub>/X\'<sub>2</sub>؛ عملياً بإضافة مقاومة على التوالي مع ملفات العضو الدوار الملفوف.'},
  {q:'إضافة مقاومة إلى العضو الدوار (الشكل 1-21) تجعل:',o:['قيمة العزم الأقصى تكبر كثيراً','قيمة العزم الأقصى ثابتة تقريباً وموضعه ينتقل نحو S = 1','العزم الأقصى يختفي','السرعة التزامنية تتغير'],c:1,e:'القمم بنفس الارتفاع تقريباً وتنتقل نحو S = 1 كلما زادت المقاومة.'},
  {q:'إذا كان عزم الحمل أكبر من عزم البدء، ينصح الكتاب:',o:['بزيادة التردد','ببدء المحرك بحمل خفيف ثم إضافة بقية الأحمال','بعكس اتجاه الدوران','بفصل العضو الدوار'],c:1,e:'ص 48.'}
 ]
});


/* ============================== Lesson 1.9 — starting methods ============================== */
/* direct-on-line curves read from the figures (1-24 … 1-32): T/Tn and I/In against n/ns (estimated from the drawings) */
const Td=mono([[0,2],[0.15,1.85],[0.3,1.72],[0.45,1.8],[0.6,2.05],[0.72,2.4],[0.85,2.85],[0.92,2.2],[0.96,1.25],[0.98,0.7],[1,0]]);
const Id=mono([[0,7],[0.2,6.85],[0.4,6.6],[0.6,6.1],[0.75,5.3],[0.85,4.3],[0.92,3.1],[0.96,1.4],[0.98,0.95],[1,0.4]]);
const aR=(u,r)=>{const z=1/Id(u);return z/(z+r)};                // voltage share left for the motor with a series impedance r (per unit)
const TLoad=u=>0.2+0.55*u*u;                                       // illustrative load torque
const JM=2.0;                                                      // illustrative inertia (slowed down so the start can be watched)
const CUR={
 dol:{T:Td,I:Id},
 sr1:{T:u=>aR(u,.108)**2*Td(u),I:u=>aR(u,.108)*Id(u)},
 sr2:{T:u=>aR(u,.054)**2*Td(u),I:u=>aR(u,.054)*Id(u)},
 at1:{T:u=>.3136*Td(u),I:u=>.3136*Id(u)},
 at2:{T:u=>aR(u,.12)**2*Td(u),I:u=>aR(u,.12)*Id(u)},
 y:{T:u=>Td(u)/3,I:u=>Id(u)/3},
 rr1:{T:mono([[0,0.4],[0.3,0.6],[0.55,0.85],[0.75,0.72],[0.9,0.38],[1,0]]),I:mono([[0,3],[0.3,2.7],[0.55,2.2],[0.75,1.6],[0.9,0.85],[1,0.3]])},
 rr2:{T:mono([[0,0.9],[0.4,1.3],[0.75,1.6],[0.88,1.25],[0.95,0.6],[1,0]]),I:mono([[0,4.5],[0.5,3.6],[0.75,2.7],[0.88,1.6],[0.95,0.9],[1,0.3]])},
 el:{T:(()=>{const f=mono([[0,0.5],[0.15,0.45],[0.4,0.55],[0.6,0.8],[0.75,1.15],[0.85,1.7],[0.92,2.2]]);return u=>u<0.92?f(u):Td(u)})(),I:u=>Math.min(3,Id(u))}   // torque shape read from figure (1-32)
};
const SM={
 dol:{name:'توصيل مباشر',fig:'مرجع المقارنة (منحنى «توصيل مباشر» في الأشكال)',keys:['1'],tags:[''],
  stages:['إغلاق القاطع رقم 1: يتصل المحرك بجهد المصدر كاملاً (للمقارنة فقط، الكتاب لا يعدّه طريقة لتقليل تيار البدء).'],
  state:c=>c[1]?{cv:'dol',stage:0,lbl:'توصيل مباشر'}:{cv:null,stage:-1,lbl:'مفصول'}},
 sr:{name:'مقاومات الثابت',fig:'الشكلان (1-23) و (1-24) ص 59–60',keys:['1','2','3'],tags:['1','2','3'],
  stages:['المرحلة الأولى: يتم التوصيل عبر كامل المقاومة بواسطة إغلاق القاطع رقم 1 (الجزء 1).','المرحلة الثانية: يتم التوصيل عبر نصف المقاومة بواسطة إغلاق القاطع رقم 2 (الجزء 2).','المرحلة الثالثة: يتم التوصيل المباشر بإزالة الجزء المتبقي من المقاومة بواسطة إغلاق القاطع رقم 3 (الجزء 3).'],
  state:c=>!c[1]?{cv:null,stage:-1,lbl:'مفصول'}:c[3]?{cv:'dol',stage:2,lbl:'توصيل مباشر'}:c[2]?{cv:'sr2',stage:1,lbl:'عبر نصف المقاومة'}:{cv:'sr1',stage:0,lbl:'عبر كامل المقاومة'}},
 at:{name:'محول ذاتي',fig:'الشكلان (1-25) و (1-26) ص 61–62',keys:['1','2','3'],tags:['1','2','3'],
  stages:['المرحلة الأولى: يتم التوصيل عبر المحول الذاتي بواسطة إغلاق القاطعين رقم 3 و 1 معاً (الجزء 1).','المرحلة الثانية: يتم فتح القاطع رقم 3 مع بقاء القاطع رقم 1 مغلقاً (الجزء 2).','المرحلة الثالثة: يتم التوصيل المباشر بإزالة المحول الذاتي تماماً بواسطة إغلاق القاطع رقم 2 (الجزء 3).'],
  state:c=>c[2]&&c[3]?{cv:null,stage:-1,fault:'القاطعان 2 و 3 مغلقان معاً: يتصل الخط مباشرة بنقطة نجمة المحول عبر الجزء السفلي من ملفه فيمر تيار كبير في المحول. فُصلت كل القواطع.'}:
   c[2]?{cv:'dol',stage:2,lbl:'توصيل مباشر'}:c[1]&&c[3]?{cv:'at1',stage:0,lbl:'عبر المحول الذاتي'}:c[1]?{cv:'at2',stage:1,lbl:'جزء من ملف المحول على التوالي'}:{cv:null,stage:-1,lbl:'مفصول'}},
 sd:{name:'نجمة / دلتا',fig:'الشكلان (1-27) و (1-28) ص 62–63',keys:['1','2','3'],tags:['Y','Δ'],
  stages:['المرحلة الأولى: يتم التشغيل بإغلاق القاطعين رقم 2 و 1، فتكون الملفات موصلة على شكل Y (الجزء Y).','المرحلة الثانية: يتم فتح القاطع رقم 2 وإغلاق القاطع رقم 3 مع بقاء القاطع رقم 1 مغلقاً، فتكون الملفات موصلة على شكل Δ (الجزء Δ).'],
  state:c=>!c[1]?{cv:null,stage:-1,lbl:'مفصول'}:c[2]&&c[3]?{cv:null,stage:-1,fault:'قاطع النجمة 2 وقاطع الدلتا 3 مغلقان معاً: قصر بين الأوجه! فُصلت كل القواطع. افتح القاطع 2 أولاً ثم أغلق 3.'}:
   c[2]?{cv:'y',stage:0,lbl:'نجمة Y'}:c[3]?{cv:'dol',stage:1,lbl:'دلتا Δ'}:{cv:null,stage:-1,lbl:'نهايات الملفات مفتوحة: لا تيار'}},
 rr:{name:'مقاومات الدوار',fig:'الشكلان (1-29) و (1-30) ص 64–65',keys:['CB','1','2'],tags:['1','2','3'],
  stages:['المرحلة الأولى: (بعد إغلاق القاطع الرئيسي CB) يتم قصر أطراف العضو الدوار عبر كامل المقاومة المضافة بواسطة فتح القاطعين رقم 2 و 1 (الجزء 1).','المرحلة الثانية: يتم القصر عبر نصف المقاومة المضافة بواسطة إغلاق القاطع رقم 1 فقط (الجزء 2).','المرحلة الثالثة: يتم قصر أطراف العضو الدوار مباشرة بواسطة إغلاق القاطع رقم 2 بالإضافة إلى القاطع رقم 1 (الجزء 3).'],
  state:c=>!c.CB?{cv:null,stage:-1,lbl:'مفصول'}:c[2]?{cv:'dol',stage:2,lbl:'الدوار مقصور مباشرة'}:c[1]?{cv:'rr2',stage:1,lbl:'عبر نصف المقاومة'}:{cv:'rr1',stage:0,lbl:'عبر كامل المقاومة'}},
 el:{name:'بادئ إلكتروني',fig:'الشكلان (1-31) و (1-32) ص 65–66',keys:['1'],tags:[''],
  stages:['إغلاق القاطع رقم 1: يتحكم الجهاز في الجهد بنعومة ويراقب التيار فيبقيه ثابتاً طوال فترة البدء.'],
  state:c=>c[1]?{cv:'el',stage:0,lbl:'بدء إلكتروني'}:{cv:null,stage:-1,lbl:'مفصول'}}
};
const MKS=['dol','sr','at','sd','rr','el'];

/* ---- circuit drawing helpers ---- */
const wc=(live,flow)=>flow?'flow':live?'live':'';
const cw=(d,cls)=>`<path class="w ${cls||''}" d="${d}"/>`;
function blade(x,y,on){return `<circle cx="${x}" cy="${y}" r="2.3" fill="var(--fg)"/><circle cx="${x}" cy="${y+16}" r="2.3" fill="var(--fg)"/>`+(on?`<path d="M${x} ${y}V${y+16}" stroke="var(--fg)" stroke-width="2.6"/>`:`<path d="M${x} ${y+16}L${x-10} ${y+3}" stroke="var(--fg)" stroke-width="2.6" stroke-linecap="round"/>`)}
function kGroup(k,xs,y,on,side,stat){const a=Math.min(...xs),b=Math.max(...xs),lx=side==='r'?b+26:a-26,x0=Math.min(a-12,lx-14),x1=Math.max(b+6,lx+14);
  let g=stat?'<g>':`<g class="u1b-k" data-k="${k}" tabindex="0" role="button" aria-pressed="${!!on}" aria-label="القاطع ${k}">`;
  g+=`<rect x="${x0}" y="${y-6}" width="${x1-x0}" height="30" fill="transparent"/>`;
  xs.forEach(x=>{g+=blade(x,y,on)});
  g+=`<path d="M${side==='r'?a-6:lx+12} ${y+9}H${side==='r'?lx-12:b-6}" stroke="var(--muted)" stroke-dasharray="4 3" stroke-width="1.3"/>`;
  g+=`<circle class="kb" cx="${lx}" cy="${y+9}" r="12" fill="var(${on?'--on':'--surface'})" stroke="var(${on?'--on':'--fg'})" stroke-width="1.6"/>`+tx(lx,y+13,k,'','middle',k.length>1?9:12,on?'--surface':null);
  return g+'</g>'}
function zigV(x,y1,y2,cls){const n=6,st=(y2-y1)*0.7/n,s=y1+(y2-y1)*0.15;let p=`M${x} ${y1}V${fx(s)}`;for(let i=0;i<n;i++)p+=`L${x+(i%2?-6:6)} ${fx(s+st*(i+0.5))}`;return cw(p+`L${x} ${fx(s+st*n)}V${y2}`,cls)}
function coilV(x,y1,y2,n,cls){const h=(y2-y1)/n;let p=`M${x} ${y1}`;for(let i=1;i<=n;i++)p+=`A${fx(h/2)} ${fx(h/2)} 0 0 1 ${x} ${fx(y1+h*i)}`;return cw(p,cls)}
const motor=(cx,cy,r)=>`<circle cx="${cx}" cy="${cy}" r="${r}" fill="var(--surface)" stroke="var(--fg)" stroke-width="2"/>`+tx(cx,cy-1,'M','','middle',15)+tx(cx,cy+14,'3~','m','middle',11);
const PH=['L1','L2','L3'],XX=[90,200,310];
function supply(F,y2){return XX.map((x,i)=>tx(x,15,PH[i],'b')+cw(`M${x} 22V${y2}`,wc(1,F))).join('')}
/* circuits: c = contactor states, s = state from SM[..].state, stat = static figure */
const CIRC={
 dol(c,s,st){const F=!!s.cv;let g=supply(F,56);
  XX.forEach((x,i)=>{g+=cw(`M${x} 72V196L${200+(i-1)*20} 238`,wc(c[1],F))+tx(x+8,190,['U1','V1','W1'][i],'m','start',10)});
  g+=kGroup('1',XX,56,c[1],'l',st)+motor(200,262,28);return {g,H:300}},
 sr(c,s,st){const F=!!s.cv,k=s.stage;let g=supply(F,52);
  XX.forEach((x,i)=>{g+=cw(`M${x} 68V118`,wc(c[1],F));g+=zigV(x,118,158,wc(c[1],F&&k===0))+dot(x,158)+zigV(x,158,198,wc(c[1],F&&k<=1))+cw(`M${x} 198V225`,wc(c[1],F&&k<=1))+dot(x,225)+cw(`M${x} 225V256L${200+(i-1)*20} 292`,wc(c[1],F))+dot(x,100);
   g+=cw(`M${x} 100H${x+28}V108`,wc(c[1],0))+cw(`M${x+28} 124V158H${x}`,wc(c[1]&&c[2],F&&k===1));
   g+=cw(`M${x} 100H${x-28}V180`,wc(c[1],0))+cw(`M${x-28} 196V225H${x}`,wc(c[1]&&c[3],F&&k===2));
   g+=tx(x+8,250,['U1','V1','W1'][i],'m','start',10)});
  g+=kGroup('1',XX,52,c[1],'l',st)+kGroup('2',XX.map(x=>x+28),108,c[2],'r',st)+kGroup('3',XX.map(x=>x-28),180,c[3],'l',st)+motor(200,316,26);return {g,H:350}},
 at(c,s,st){const F=!!s.cv,k=s.stage;let g=supply(F,42);
  XX.forEach((x,i)=>{g+=dot(x,42)+cw(`M${x} 42V56`,wc(1,F&&k<=1))+cw(`M${x} 72V104`,wc(c[1],F&&k<=1))+coilV(x,104,164,4,wc(c[1]||c[2],F&&k<=1))+dot(x,164)+coilV(x,164,224,4,wc(c[1]||c[2],F&&k===0));
   g+=cw(`M${x} 224V240`,wc(c[1]||c[2],F&&k===0))+cw(`M${x} 256V268`,wc((c[1]||c[2])&&c[3],F&&k===0));
   g+=cw(`M${x} 42H${x+34}V100`,wc(1,F&&k===2))+cw(`M${x+34} 116V164`,wc(c[2]||c[1],F&&k===2))+cw(`M${x} 164H${x+34}`,wc(c[1]||c[2],F))+dot(x+34,164)+cw(`M${x+34} 164V296L${234+(i-1)*20} 312`,wc(c[1]||c[2],F));
   g+=tx(x+40,290,['U1','V1','W1'][i],'m','start',10)});
  g+=cw(`M${XX[0]} 268H${XX[2]}`,wc((c[1]||c[2])&&c[3],F&&k===0))+dot(XX[1],268);
  g+=kGroup('1',XX,56,c[1],'l',st)+kGroup('2',XX.map(x=>x+34),100,c[2],'r',st)+kGroup('3',XX,240,c[3],'l',st)+motor(234,334,22);return {g,H:364}},
 sd(c,s,st){const F=!!s.cv,k=s.stage,on=c[1];let g=supply(F,50);
  g+=`<rect x="62" y="118" width="268" height="104" rx="10" fill="none" stroke="var(--muted)" stroke-dasharray="5 4"/>`+tx(66,112,'M 3~','m','start',11);
  XX.forEach((x,i)=>{const j=(i+2)%3,yj=228+10*j;
   g+=cw(`M${x} 66V128`,wc(on,F))+dot(x,96)+coilV(x,132,208,5,wc(on,F))+cw(`M${x} 128V132M${x} 208V212`,wc(on,F))+tx(x+8,130,['U1','V1','W1'][i],'m','start',10)+tx(x+8,216,['U2','V2','W2'][i],'m','start',10);
   g+=cw(`M${x} 96H${x+40}V150`,wc(on,0))+cw(`M${x+40} 166V${yj}H${XX[j]}`,wc(on&&c[3],F&&k===1))+dot(XX[j],yj)});
  XX.forEach((x,j)=>{const yj=228+10*j;g+=cw(`M${x} 212V${yj}`,wc(on,F))+(j===1?cw(`M${x} ${yj}V300`,wc(on,F&&k===0))+dot(x,300):cw(`M${x} ${yj}V262`,wc(on,F&&k===0))+cw(`M${x} 278V300`,wc(on&&c[2],F&&k===0)))});
  g+=cw(`M${XX[0]} 300H${XX[2]}`,wc(on&&c[2],F&&k===0));
  g+=kGroup('1',XX,50,c[1],'l',st)+kGroup('2',[XX[0],XX[2]],262,c[2],'l',st)+kGroup('3',XX.map(x=>x+40),150,c[3],'r',st);return {g,H:320}},
 rr(c,s,st){const F=!!s.cv,k=s.stage,on=c.CB;let g=supply(F,50);
  XX.forEach((x,i)=>{const mx=200+(i-1)*22;g+=cw(`M${x} 66V96L${mx} 116`,wc(on,F))+tx(x+8,92,['U1','V1','W1'][i],'m','start',10);
   g+=cw(`M${mx} 186L${x} 220V250`,wc(on,F))+dot(x,250)+tx(x+8,232,['R','S','T'][i],'m','start',10);
   g+=cw(`M${x} 250H${x+30}V258`,wc(on,0))+cw(`M${x+30} 274V290`,wc(on&&c[2],F&&k===2));
   g+=cw(`M${x} 250V310`,wc(on,F&&k<=1))+zigV(x,310,345,wc(on,F&&k<=1))+dot(x,345)+zigV(x,345,380,wc(on,F&&k===0))+cw(`M${x} 380V410`,wc(on,F&&k===0));
   g+=cw(`M${x} 345H${x-30}V350`,wc(on,F&&k===1))+cw(`M${x-30} 366V392`,wc(on&&c[1],F&&k===1))});
  g+=cw(`M${XX[0]+30} 290H${XX[2]+30}`,wc(on&&c[2],F&&k===2))+cw(`M${XX[0]-30} 392H${XX[2]-30}`,wc(on&&c[1],F&&k===1))+cw(`M${XX[0]} 410H${XX[2]}`,wc(on,F&&k===0));
  g+=`<circle cx="200" cy="150" r="40" fill="var(--surface)" stroke="var(--fg)" stroke-width="2"/><circle cx="200" cy="150" r="25" fill="none" stroke="var(--muted)" stroke-dasharray="4 3"/>`+tx(200,149,'M','','middle',15)+tx(200,163,'3~','m','middle',11);
  g+=kGroup('CB',XX,50,c.CB,'l',st)+kGroup('2',XX.map(x=>x+30),258,c[2],'r',st)+kGroup('1',XX.map(x=>x-30),350,c[1],'l',st);return {g,H:422}},
 el(c,s,st){const F=!!s.cv;let g=supply(F,50);
  XX.forEach((x,i)=>{g+=cw(`M${x} 66V112`,wc(c[1],F))+cw(`M${x} 228V262L${200+(i-1)*20} 296`,wc(c[1],F))+dot(x,112)+dot(x,228)+tx(x+8,256,['U1','V1','W1'][i],'m','start',10)});
  g+=`<rect x="60" y="112" width="280" height="116" rx="10" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.6"/><rect x="82" y="130" width="150" height="42" rx="4" fill="var(--surface)" stroke="var(--fg)"/>`;
  g+=tx(157,156,s.cv?'I = 3.0 In':'READY','b','middle',13);
  for(let r=0;r<2;r++)for(let q=0;q<3;q++)g+=`<rect x="${250+q*26}" y="${132+r*22}" width="18" height="14" rx="2" fill="var(--surface)" stroke="var(--fg)"/>`;
  for(let q=0;q<5;q++)g+=`<rect x="${86+q*30}" y="190" width="20" height="14" rx="2" fill="var(--surface)" stroke="var(--fg)"/>`;
  g+=kGroup('1',XX,50,c[1],'l',st)+motor(200,318,24);return {g,H:350}}
};
function circSVG(mk,c,stat){const s=SM[mk].state(c);const r=CIRC[mk](c,s,stat);return `<svg viewBox="0 0 400 ${r.H}" role="img" aria-label="مخطط التوصيل">${r.g}</svg>`}
const C0=()=>({CB:0,1:0,2:0,3:0});
/* run the book's sequence automatically (for the static figures) */
function autoRun(mk){const plan={dol:[[0,{1:1}]],sr:[[0,{1:1}],[0.8,{1:1,2:1}],[0.93,{1:1,2:1,3:1}]],at:[[0,{1:1,3:1}],[0.85,{1:1}],[0.93,{1:1,2:1}]],sd:[[0,{1:1,2:1}],[0.9,{1:1,3:1}]],rr:[[0,{CB:1}],[0.75,{CB:1,1:1}],[0.91,{CB:1,1:1,2:1}]],el:[[0,{1:1}]]}[mk];
  let u=0,k=0,c=plan[0][1],t=0,n=0;const tr=[],dt=0.004;
  while(t<120){if(k+1<plan.length&&u>=plan[k+1][0]){k++;c=plan[k][1]}const s=SM[mk].state(c),cv=CUR[s.cv],T=cv.T(u),I=cv.I(u);
   if(n++%6===0||!tr.length||tr[tr.length-1][3]!==s.stage)tr.push([u,T,I,s.stage]);
   const du=(T-TLoad(u))/JM*dt;if(k===plan.length-1&&Math.abs(du)<2e-7)break;u=clamp(u+du,0,0.999);t+=dt}
  return tr}
function scChart(which,mk,tr,pt,cvKey,W,tl){tl=tl||TLoad;const isT=which==='T',ym=isT?3:7,us=[];for(let i=0;i<=120;i++)us.push(i/120);
  const ser=[{pts:us.map(u=>[u,isT?Td(u):Id(u)]),col:'--muted',w:1.7,dash:'6 4'}];
  if(isT)ser.push({pts:us.map(u=>[u,tl(u)]),col:'--stop',w:1.3,dash:'2 4'});
  if(cvKey&&cvKey!=='dol'){const cv=CUR[cvKey];ser.push({pts:us.map(u=>[u,isT?cv.T(u):cv.I(u)]),col:'--blue',w:1.4,op:.6})}
  if(tr.length>1)ser.push({pts:tr.map(q=>[q[0],isT?q[1]:q[2]]),col:'--live',w:3});
  return chartSVG({W:W||440,H:230,L:40,B:34,x0:0,x1:1,y0:0,y1:ym,yt:isT?[0,1,2,3]:[0,1,2,3,4,5,6,7],xt:[0,.25,.5,.75,1],xf:v=>v===0?'0':v===1?'ns':'',xl:'n',yl:isT?'T/Tn':'I/In',series:ser,aria:isT?'منحنى العزم':'منحنى التيار',
   extra:(X,Y)=>{let s='';const tags=SM[mk].tags;let a=0;
    for(let i=1;i<=tr.length;i++){if(i===tr.length||tr[i][3]!==tr[a][3]){const m=tr[Math.floor((a+i-1)/2)],lab=tags[tr[a][3]]||'';if(lab&&i-a>1)s+=`<circle cx="${fx(X(m[0]))}" cy="${fx(Y(isT?m[1]:m[2])-15)}" r="9" fill="var(--surface)" stroke="var(--live)"/>`+tx(X(m[0]),Y(isT?m[1]:m[2])-11,lab,'','middle',11,'--live');a=i}}
    if(pt)s+=`<circle cx="${fx(X(pt[0]))}" cy="${fx(Y(isT?pt[1]:pt[2]))}" r="5.5" fill="var(--live)" stroke="var(--surface)" stroke-width="2"/>`;
    s+=tx(X(isT?0.03:0.5),Y(isT?2.75:6.6),'DOL','m','start',10);return s}})}
const scLegend=legend([['--muted','توصيل مباشر',1],['--live','مسار التشغيل بالطريقة المختارة'],['--blue','منحنى التوصيلة الحالية'],['--stop','عزم الحمل (توضيحي)',1]]);
function scFig(mk){const tr=autoRun(mk);return `<div class="u1b-two">${box(scChart('T',mk,tr),460)}${box(scChart('I',mk,tr),460)}</div>`}
/* figure (1-22): oscilloscope picture of the starting current */
function scopeSVG(){const W=500,H=300,L=20,T=20,w=460,h=250;let s=`<rect x="${L}" y="${T}" width="${w}" height="${h}" fill="var(--surface-2)" stroke="var(--fg)"/>`;
  for(let i=1;i<10;i++)s+=`<path d="M${L+i*w/10} ${T}V${T+h}" stroke="var(--line)"/>`;for(let i=1;i<8;i++)s+=`<path d="M${L} ${T+i*h/8}H${L+w}" stroke="var(--line)"/>`;
  s+=`<path d="M${L} ${T+h/2}H${L+w}" stroke="var(--muted)"/>`;let p='';
  for(let i=0;i<=3000;i++){const t=0.03+i/3000*0.92,A=t<0.1?0:(1+2*Math.exp(-(t-0.1)/0.09)),v=A*Math.sin(2*PI*50*t);p+=(i?'L':'M')+fx(L+(t-0.03)/0.95*w)+' '+fx(T+h/2-v*38)}
  s+=`<path d="${p}" fill="none" stroke="var(--blue)" stroke-width="1"/>`+tx(L+w-6,T+h+16,'scale: 0.1 sec. / div.','m','end',11);
  return `<svg viewBox="0 0 ${W} ${H+20}" role="img" aria-label="تيار البدء على شاشة الأوسيلسكوب">${s}</svg>`}

B.lesson({
 id:'u1-l9',unit:1,order:9,pages:'58–66',
 title:'طرق بدء الحركة للمحرك الحثي ثلاثي الأوجه',
 summary:'لماذا يكون تيار البدء عالياً (6 إلى 8 أضعاف التيار المقنن) ومشاكله، ثم خمس طرق لتقليله من المعادلة (1-39): مقاومات الثابت، والمحول الذاتي، ونجمة/دلتا، ومقاومات الدوار، والأجهزة الإلكترونية، مع منحنيات العزم والتيار لكل طريقة.',
 theory:[
  {h:'أولاً: طرق بدء الحركة',ref:'ص 58',html:`<p>«بالرجوع إلى الدائرة المكافئة نجد أن المقاومة \\(R'_2\\left(\\frac{1-S}{S}\\right)\\) تعتمد على قيمة الانزلاق، وحيث إن قيمة الانزلاق تكون مساوية للواحد عند بدء تشغيل المحرك، فهذا يعني أن المقاومة \\(R'_2\\left(\\frac{1-S}{S}\\right)\\) أصبحت <b>مقصورة عند البدء</b> لأن \\(R'_2\\left(\\frac{1-1}{1}\\right) = 0\\) وهذا يعني أن تيار البدء أصبح عالياً جداً. (تيار البدء عادةً يتراوح من <b>6 إلى 8 أضعاف</b> التيار المقنن)، انظر الشكل (1-22).»</p>`},
  {fig:'(1-22)',ref:'ص 58',caption:'تيار البدء لمحرك صغير (الصورة بواسطة الأوسيلسكوب): الموجة كبيرة جداً في البداية ثم تتناقص خلال جزء من الثانية وتستقر على قيمة أصغر. (أُعيد رسمها للتوضيح.)',draw:()=>box(scopeSVG(),560)},
  {html:`<p>«هذا التيار العالي عند البدء يتسبب في وجود بعض المشاكل مثل:</p><ol><li>رفع درجة حرارة ملفات المحرك مما يؤدي مع تكرار البدء إلى انهيار عزلها.</li><li>التأثير على وسائل توصيل الكهرباء إلى المحرك كالكيابل والقواطع وأجهزة الحماية.</li><li>حدوث هبوط في جهد الأجهزة المشتركة مع المحرك في نفس الخط.»</li></ol>
   <p>«لذلك لابد من إيجاد وسائل لتقليل قيمة تيار البدء خصوصاً في المحركات الكبيرة. فيما يلي عدة طرق لتقليل تيار البدء جميعها تعتمد على المعادلة (1-39) وذلك <b>إما بتقليل البسط (الجهد)</b> و<b>إما بزيادة المقام</b> (مقاومات العضو الثابت أو الدوار).» <span class="ref">ص 59</span></p>
   $$I'_{2st} = \\frac{V_{ph}}{\\sqrt{(R_1+R'_2)^2 + X_{eq}^2}} ${eq('1-39')}$$`},
  {note:`<b>توضيح للمتدرب (ليس من نص الكتاب) — كيف تقرأ منحنيات الطرق:</b> كل طريقة لها رسمان فوق بعض يشتركان في محور السرعة n من 0 إلى n<sub>s</sub>: العلوي العزم منسوباً إلى العزم المقنن \\(T/T_n\\)، والسفلي التيار منسوباً إلى التيار المقنن \\(I/I_n\\). المنحنى المتقطع هو «التوصيل المباشر» (تيار البدء نحو 7 أضعاف). الخطوط الرأسية هي لحظات التبديل (المراحل 1، 2، 3). الأرقام في رسومنا مقدرة من أشكال الكتاب (الكتاب لا يكتبها)، وعزم الحمل المرسوم توضيحي.`},
  {h:'1ـ توصيل مقاومات على التوالي مع ملفات العضو الثابت',ref:'ص 59',html:`<p>«إن توصيل مقاومات على التوالي مع ملفات العضو الثابت يؤدي إلى تقليل الجهد المسلط على العضو الثابت وبالتالي يقل تيار البدء طبقاً للمعادلة (1-39)، ثم بعد اجتياز فترة البدء يمكن إلغاء هذه المقاومات تدريجياً. <b>عيب هذه الطريقة</b> هو زيادة المفاقيد النحاسية مما يجعلها غير مناسبة للاستخدام خصوصاً مع المحركات الكبيرة.»</p>`},
  {fig:'(1-23)',ref:'ص 59',caption:'مخطط التوصيل باستخدام مقاومات على التوالي مع ملفات العضو الثابت: القاطع 1 رئيسي، والقاطع 2 يوصل الخط إلى منتصف المقاومات، والقاطع 3 يقصر المقاومات كلها.',draw:()=>box(circSVG('sr',C0(),1),420)},
  {fig:'(1-24)',ref:'ص 59',caption:'منحنى العزم والتيار (توصيل عبر المقاومات): الأجزاء 1 و 2 و 3 تقابل المراحل.',draw:()=>scFig('sr')},
  {html:`<p><b>مراحل التشغيل:</b> <span class="ref">ص 60</span></p><ul><li>${SM.sr.stages.join('</li><li>')}</li></ul>`},
  {h:'2- باستخدام محول ذاتي (التحكم في الجهد)',ref:'ص 61',html:`<p>«في هذه الطريقة يتم توصيل أطراف العضو الثابت إلى محول ذاتي ثلاثي الأوجه بحيث يخفض الجهد المسلط على ملفات العضو الثابت إلى قيمة تتناسب مع تيار البدء المسموح به، وبعد اجتياز المحرك لفترة البدء يتم تسليط جهد المصدر كاملاً على ملفات العضو الثابت وذلك بفصل المحول. هذه الطريقة <b>مثالية جداً حيث لا يوجد فيها أي قدرة مفقودة</b>. كما أنها تعتبر <b>الخيار الأفضل للمحركات التي تم توصيل ملفاتها داخلياً من قبل المصنع على شكل نجمة</b>.»</p>`},
  {fig:'(1-25)',ref:'ص 61',caption:'مخطط التوصيل باستخدام محول ذاتي: القاطع 1 إلى أعلى ملف المحول، والقاطع 2 من الخط مباشرة إلى نقطة التفريعة الموصلة بالمحرك، والقاطع 3 يربط الأطراف السفلية للملفات (نقطة نجمة المحول).',draw:()=>box(circSVG('at',C0(),1),420)},
  {fig:'(1-26)',ref:'ص 61',caption:'منحنى العزم والتيار (توصيل عبر المحول): تيار البدء نحو 2 بدلاً من 7.',draw:()=>scFig('at')},
  {html:`<p><b>مراحل التشغيل:</b> <span class="ref">ص 62</span></p><ul><li>${SM.at.stages.join('</li><li>')}</li></ul>`},
  {note:'<b>توضيح (ليس من نص الكتاب):</b> لا يذكر الكتاب فتح القاطع 1 في المرحلة الثالثة. إغلاق القاطع 2 يوصل الخط بنقطة التفريعة مباشرة فيُقصر الجزء العلوي من ملف المحول ولا يمر فيه تيار، لذلك يعمل المحرك مباشرة سواء بقي القاطع 1 مغلقاً أو فُتح. وفي المرحلة الثانية يبقى الجزء العلوي من الملف على التوالي مع المحرك فيعمل كممانعة تحد التيار.'},
  {h:'3ـ تغيير توصيل ملفات العضو الثابت من نجمة إلى دلتا',ref:'ص 62',html:`<p>«هذه الطريقة مناسبة <b>للمحركات ذات الستة أطراف والتي توصل ملفاتها على شكل دلتا أثناء التشغيل العادي</b> حيث توصل ملفات العضو الثابت عند البدء على شكل نجمة ونتيجةً لذلك فإن جهد الوجه سيقل إلى \\(\\frac{1}{\\sqrt{3}}\\) من جهد المصدر وينخفض تيار الخط إلى \\(\\frac{1}{3}\\) التيار المار في حالة التوصيل على شكل دلتا، وبعد أن يجتاز المحرك فترة البدء يتم إعادة توصيل الملفات على شكل دلتا.»</p>`},
  {fig:'(1-27)',ref:'ص 63',caption:'مخطط التوصيل باستخدام توصيلة نجمة دلتا: القاطع 1 رئيسي إلى بدايات الملفات U1 V1 W1، والقاطع 2 (ملامسان) يربط النهايات U2 V2 W2 معاً (نجمة)، والقاطع 3 يوصل كل خط بنهاية ملف آخر (دلتا).',draw:()=>box(circSVG('sd',C0(),1),420)},
  {fig:'(1-28)',ref:'ص 63',caption:'منحنى العزم والتيار: الجزء Y ثم قفزة إلى المنحنى المباشر عند التحويل إلى Δ.',draw:()=>scFig('sd')},
  {html:`<p><b>مراحل التشغيل:</b> <span class="ref">ص 63</span></p><ul><li>${SM.sd.stages.join('</li><li>')}</li></ul>`},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> في الدلتا يقع على كل ملف جهد الخط كاملاً (مثلاً <span class="ltr">380 V</span>)، وفي النجمة يقع عليه <span class="ltr">380 ÷ √3 ≈ 220 V</span>. تيار الملف يقل بالنسبة نفسها \\(1/\\sqrt3\\)، وتيار الخط في الدلتا أكبر من تيار الملف بـ \\(\\sqrt3\\)، فيصبح تيار الخط في النجمة \\(\\frac{1}{\\sqrt3}\\times\\frac{1}{\\sqrt3}=\\frac13\\) تيار الخط في الدلتا. والعزم يتناسب مع مربع الجهد فيقل أيضاً إلى الثلث. <b>تحذير:</b> لا يُغلق قاطع النجمة وقاطع الدلتا معاً أبداً (قصر بين الأوجه).'},
  {h:'4ـ إضافة مقاومات موصلة على التوالي مع ملفات العضو الدوار',ref:'ص 64',html:`<p>«هذه الطريقة <b>خاصة فقط بالمحرك ذو حلقات الانزلاق</b> حيث يمكن توصيل مقاومات على التوالي مع ملفات العضو الدوار، وبالتالي فإن تيار البدء يقل نتيجة لزيادة المقاومة في المعادلة (1-39)، وبعد أن يجتاز المحرك فترة البدء يتم إزالة هذه المقاومات تدريجياً وذلك لتجنب زيادة المفاقيد في دائرة العضو الدوار. هذه الطريقة تعتبر الأفضل للمحركات ذات حلقات الانزلاق، كما أنها <b>تزيد من عزم البدء</b> للمحرك وذلك لأن مقاومة البدء تضاف إلى \\(R'_2\\) وبالتالي فإن الانزلاق الذي يحدث عنده أعلى عزم يزداد وبالتالي ينتقل موضع العزم الأقصى إلى الأمام مما يؤدي إلى زيادة عزم البدء.»</p>`},
  {fig:'(1-29)',ref:'ص 64',caption:'مخطط التوصيل باستخدام مقاومات على التوالي مع ملفات العضو الدوار: القاطع الرئيسي CB للعضو الثابت، وأطراف الدوار R S T إلى ثلاث مقاومات أطرافها السفلية مربوطة معاً؛ القاطع 1 يقصر عند منتصف المقاومات، والقاطع 2 يقصر أطراف العضو الدوار مباشرة. (رُسمت التوصيلات حسب نص «مراحل التشغيل» لأن رسم الكتاب صغير.)',draw:()=>box(circSVG('rr',C0(),1),420)},
  {fig:'(1-30)',ref:'ص 64',caption:'منحنى العزم والتيار (توصيل عبر المقاومات): رسمناه كما يظهر في الشكل، وعزم البدء فيه نحو 0.4 من العزم المقنن.',draw:()=>scFig('rr')},
  {err:'يقول النص في ص 64 إن مقاومات العضو الدوار «<b>تزيد من عزم البدء</b> للمحرك»، لكن الشكل (1-30) في الصفحة نفسها يُظهر عزم البدء عبر المقاومات نحو <span class="ltr">0.4 T<sub>n</sub></span> وهو <b>أقل</b> من عزم البدء بالتوصيل المباشر (نحو <span class="ltr">2 T<sub>n</sub></span>). رسمنا المنحنيات كما في الشكل. والنص صحيح إذا اختيرت المقاومة بحيث لا تتجاوز قمة العزم لحظة البدء (انظر الشكل 1-21 في الدرس السابق)؛ أما المقاومة الكبيرة جداً فتنقص عزم البدء.'},
  {html:`<p><b>مراحل التشغيل:</b> <span class="ref">ص 65</span></p><ul><li>${SM.rr.stages.join('</li><li>')}</li></ul>`},
  {err:'صياغة المرحلة الأولى في ص 65 مربكة: «يتم قصر أطراف العضو الدوار عبر كامل المقاومة المضافة بواسطة <b>فتح</b> القاطعين رقم 2 و 1». المقصود أن القاطعين مفتوحان فيمر تيار العضو الدوار في كامل المقاومات (المقاومات هي التي تغلق الدائرة عند نقطة نجمتها)، لا أن الفتح يحدث قصراً. وتوصيلات الشكل (1-29) الدقيقة لا تتضح من الرسم، فاعتمدنا وصف المراحل.'},
  {h:'5ـ باستخدام أجهزة إلكترونية',ref:'ص 65',html:`<p>«ظهرت حديثاً أجهزة لبدء المحركات الكهربائية تستخدم تقنية إلكترونيات القدرة، هذه الأجهزة تعتمد على مبدأ التحكم الدقيق والناعم في الجهد مع مراقبة التيار في نفس الوقت وبالتالي <b>تجعل التيار ثابتاً طيلة فترة البدء مع عزم مستقر</b>. هذه الطريقة تعتبر الأفضل وذلك لأنها توفر للمحرك تسارعاً ناعماً بدون وقفات أو قفزات مفاجئة أو تذبذب أو إجهاد ميكانيكي كما هو الحال في الطرق التقليدية، كما أن هذه الأجهزة تتوفر فيها جميع أنواع الحماية التي يتطلبها المحرك عادةً مما يعني توفير تكلفة أجهزة الحماية مقابل ارتفاع ثمن الجهاز، كما أنها أيضا تستخدم أثناء فرملة المحرك. هذه الأجهزة متوفرة بقدرات تصل إلى <span class="ltr">500 kw</span>.»</p>`},
  {fig:'(1-31)',ref:'ص 66',caption:'مخطط التوصيل باستخدام أجهزة إلكترونية: القاطع 1 ثم جهاز البدء الإلكتروني ثم المحرك.',draw:()=>box(circSVG('el',C0(),1),420)},
  {fig:'(1-32)',ref:'ص 66',caption:'منحنى العزم والتيار (بواسطة نظام بدء إلكتروني): التيار ثابت عند نحو 3 أضعاف حتى يلتقي منحنى التوصيل المباشر، والعزم يرتفع بنعومة بلا قفزات.',draw:()=>scFig('el')},
  {note:`<b>ملخص للمقارنة (من نص الكتاب، والتيارات مقدرة من أشكاله):</b><table class="u1b-tbl"><thead><tr><th>الطريقة</th><th>تيار البدء تقريباً</th><th>ما يقوله الكتاب</th></tr></thead><tbody>
   <tr><td>توصيل مباشر</td><td>7 I<sub>n</sub></td><td>تيار البدء 6 إلى 8 أضعاف التيار المقنن</td></tr>
   <tr><td>مقاومات الثابت</td><td>4 I<sub>n</sub></td><td>عيبها زيادة المفاقيد النحاسية؛ غير مناسبة للمحركات الكبيرة</td></tr>
   <tr><td>محول ذاتي</td><td>2 I<sub>n</sub></td><td>مثالية: لا قدرة مفقودة؛ الأفضل للمحركات الموصلة نجمة داخلياً</td></tr>
   <tr><td>نجمة / دلتا</td><td>2.2 I<sub>n</sub> (ثلث المباشر)</td><td>للمحركات ذات الستة أطراف التي تعمل دلتا</td></tr>
   <tr><td>مقاومات الدوار</td><td>3 I<sub>n</sub></td><td>خاصة بمحرك حلقات الانزلاق، والأفضل له</td></tr>
   <tr><td>بادئ إلكتروني</td><td>3 I<sub>n</sub> ثابت</td><td>الأفضل: تسارع ناعم وحماية، لكنه أغلى</td></tr></tbody></table>`}
 ],
 lab:(el)=>{
  let mk='sd',c=C0(),u=0,tr=[],Imax=0,msg='',lastSig='',tChart=0,ang=0,visited=[],trip=0;
  el.innerHTML=`<div id="sTp"></div><div class="grid">
   <div class="panel c7"><h2>لوحة البدء <small id="sFig"></small></h2>
    <div class="u1b-row">${segHTML('sm',MKS.map(k=>[k,SM[k].name]),mk)}</div>
    <p class="sub" style="margin-top:8px">اضغط على رقم القاطع في الرسم (أو على المفاتيح تحته) لتغلقه أو تفتحه. نفّذ «مراحل التشغيل» بترتيب الكتاب.</p>
    <div class="svgbox" id="sC" style="max-width:440px;margin-inline:auto"></div>
    <div class="u1b-row" id="sB"></div>
    <div id="sMsg" class="u1b-msg"></div>
    <h3 class="sm" style="margin-top:12px">مراحل التشغيل <span class="ref" id="sRef"></span></h3><ol class="u1b-stg" id="sStg"></ol></div>
   <div class="panel c5"><h2>المحرك <small><span id="sTpL">أرقام توضيحية</span>، والزمن مُبطّأ</small></h2>
    <div class="svgbox" style="max-width:260px;margin-inline:auto"><svg viewBox="0 0 220 150" role="img" aria-label="سرعة المحرك"><circle cx="110" cy="70" r="52" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="2"/><g id="sRot"><path d="M110 70L110 24" stroke="var(--live)" stroke-width="5" stroke-linecap="round"/><path d="M110 70L150 93M110 70L70 93" stroke="var(--muted)" stroke-width="3" stroke-linecap="round"/></g><circle cx="110" cy="70" r="6" fill="var(--fg)"/><rect x="20" y="132" width="180" height="10" rx="5" fill="var(--surface-2)" stroke="var(--line)"/><rect id="sBar" x="20" y="132" width="0" height="10" rx="5" fill="var(--on)"/></svg></div>
    <div class="facts">${fact('السرعة <bdi dir="ltr">n</bdi> (n<sub>s</sub> = <span id="sNs">1500</span>)','sN')}${fact('التيار <bdi dir="ltr">I/I<sub>n</sub></bdi>','sI')}${fact('العزم <bdi dir="ltr">T/T<sub>n</sub></bdi>','sT')}${fact('أعلى تيار في هذا التشغيل','sMax')}${fact('التوصيلة','sL')}</div>
    <div class="u1b-row"><button class="btn" id="sRst">افصل الكل وأعد التجربة</button></div></div>
   <div class="panel c12"><h2>منحنى العزم والتيار <small>مثل الأشكال (1-24) و (1-26) و (1-28) و (1-30) و (1-32)</small></h2>
    <div class="u1b-two"><div class="svgbox" id="sCT"></div><div class="svgbox" id="sCI"></div></div>${scLegend}</div>
   <div class="panel c12">${tryList(['اختر «نجمة / دلتا»: أغلق القاطع 2 ثم القاطع 1. يبدأ المحرك بتيار نحو <span class="ltr">2.3 I<sub>n</sub></span> (ثلث المباشر). عندما تقترب السرعة من الثبات افتح 2 ثم أغلق 3: يقفز التيار والعزم إلى منحنى التوصيل المباشر (الشكل 1-28).','جرّب إغلاق 3 والقاطع 2 ما زال مغلقاً: قصر بين الأوجه وتُفصل القواطع.','اختر «توصيل مباشر» وأغلق 1: لاحظ التيار نحو <span class="ltr">7 I<sub>n</sub></span> عند البدء (الشكل 1-22)، ثم قارنه بكل طريقة.','«مقاومات الثابت» و«مقاومات الدوار»: نفّذ المراحل 1 ثم 2 ثم 3 ولاحظ القفزات في كل مرحلة (الشكلان 1-24 و 1-30).','«بادئ إلكتروني»: أغلق 1 وراقب التيار ثابتاً عند <span class="ltr">3 I<sub>n</sub></span> والعزم يرتفع بنعومة بلا قفزات (الشكل 1-32).'])}</div></div>`;
  B.math(el);const $=s=>el.querySelector(s);
  const TP=B.params($('#sTp'),'u1-l9',[
   {k:'ns',label:'السرعة التزامنية للمحرك n<sub>s</sub>',unit:'rpm',value:1500,min:100,max:3600,step:1},
   {k:'T0',label:'عزم الحمل عند البدء (نسبة إلى العزم المقنن T/T<sub>n</sub>)',unit:'',value:0.2,min:0,max:3,step:0.01},
   {k:'T1',label:'عزم الحمل عند السرعة التزامنية (نسبة إلى T<sub>n</sub>)',unit:'',value:0.75,min:0,max:3,step:0.01}],()=>{tpUI();tChart=1});
  const tpUI=()=>{$('#sNs').textContent=fm(TP.v.ns);$('#sTpL').textContent=TP.trainer?'قيم المدرب':'أرقام توضيحية'};tpUI();
  const TLl=u=>TP.v.T0+(TP.v.T1-TP.v.T0)*u*u;   // load torque (default = TLoad: 0.2 + 0.55u²)
  const st=()=>SM[mk].state(c);
  const reset=()=>{c=C0();u=0;tr=[];Imax=0;msg='';visited=[];trip=0;lastSig=''};
  const toggle=k=>{if(trip){trip=0}const before=st();c[k]=c[k]?0:1;const s=st();
   if(s.fault){msg=`<div class="callout err"><b>خطأ في الترتيب:</b> ${s.fault}</div>`;c=C0();trip=1}
   else if(s.cv&&s.stage>=0){const last=visited.length?visited[visited.length-1]:-1;if(s.stage>last+1&&mk!=='dol')msg=`<div class="callout err"><b>انتبه:</b> تخطيت ${last<0?'المرحلة الأولى':'المرحلة '+(last+2)} فقفز التيار مباشرة؛ الكتاب يمر بالمراحل بالترتيب.</div>`;else if(s.stage!==before.stage)msg='';if(!visited.includes(s.stage))visited.push(s.stage)}
   else msg=s.lbl&&before.cv&&!s.cv?'<div class="callout">فُصل المحرك عن المصدر فبدأ يتباطأ.</div>':'';
   lastSig=''};
  $('#sC').addEventListener('click',e=>{const g=e.target.closest('.u1b-k');if(g)toggle(g.dataset.k)});
  $('#sC').addEventListener('keydown',e=>{const g=e.target.closest('.u1b-k');if(g&&(e.key==='Enter'||e.key===' ')){e.preventDefault();toggle(g.dataset.k)}});
  $('#sB').addEventListener('click',e=>{const b=e.target.closest('[data-kk]');if(b)toggle(b.dataset.kk)});
  el.querySelectorAll('[data-sm]').forEach(b=>b.onclick=()=>{mk=b.dataset.sm;segSet(el,'sm',mk);reset()});
  $('#sRst').onclick=reset;
  let prevOn=0;
  loopOn(el,dt=>{const s=st();let T=0,I=0;if(s.cv){const cv=CUR[s.cv];T=cv.T(u);I=cv.I(u)}
   if(s.cv&&!prevOn&&u<0.02){tr=[];Imax=0}prevOn=s.cv?1:0;
   const du=(T-TLl(u))/JM*dt;u=clamp(u+du,0,0.995);if(!s.cv&&u<0.002)u=0;
   if(s.cv){const l=tr[tr.length-1];if(!l||Math.abs(u-l[0])>0.003||Math.abs(T-l[1])>0.04||l[3]!==s.stage){tr.push([u,T,I,s.stage]);if(tr.length>3000)tr.shift()}Imax=Math.max(Imax,I)}
   ang=(ang+u*360*dt*1.6)%360;$('#sRot').setAttribute('transform',`rotate(${ang.toFixed(1)} 110 70)`);$('#sBar').setAttribute('width',(180*u).toFixed(1));
   const sig=mk+JSON.stringify(c)+trip;
   if(sig!==lastSig){lastSig=sig;$('#sFig').textContent=SM[mk].fig;$('#sC').innerHTML=circSVG(mk,c,0);
    $('#sB').innerHTML=SM[mk].keys.map(k=>`<button class="sw" data-kk="${k}" aria-pressed="${c[k]?'true':'false'}"><span class="knob"></span><b>${k}</b><small>${k==='CB'?'القاطع الرئيسي':'القاطع '+k}</small></button>`).join('');
    $('#sRef').textContent=SM[mk].fig.replace(/^.*?ص/,'ص');
    $('#sStg').innerHTML=SM[mk].stages.map((t,i)=>`<li class="${i===s.stage?'on':''} ${visited.includes(i)&&i!==s.stage?'ok':''}">${t}${i===s.stage?' ◀':''}</li>`).join('');$('#sMsg').innerHTML=msg}
   tChart+=dt;if(tChart>0.08){tChart=0;
    $('#sCT').innerHTML=scChart('T',mk,tr,s.cv?[u,T,I]:null,s.cv,0,TLl);$('#sCI').innerHTML=scChart('I',mk,tr,s.cv?[u,T,I]:null,s.cv,0,TLl);
    $('#sN').textContent=fm(Math.round(u*TP.v.ns))+' rpm';$('#sI').textContent=fm(R(I,2));$('#sT').textContent=fm(R(T,2));$('#sMax').textContent=Imax?fm(R(Imax,2))+' In':'—';$('#sL').textContent=trip?'فُصل (خطأ)':(s.lbl||'—')}});
 },
 quiz:[
  {q:'لماذا يكون تيار البدء عالياً في المحرك الحثي؟',o:['لأن المقاومة \\(R\'_2\\frac{1-S}{S}\\) تساوي صفراً عند البدء (S = 1)','لأن الجهد يرتفع عند البدء','لأن التردد يقل','لأن مفاقيد الاحتكاك كبيرة'],c:0,e:'ص 58: عند S = 1 تصبح المقاومة الممثلة للحمل مقصورة فيرتفع التيار.'},
  {q:'تيار البدء عادة يتراوح بين:',o:['1 و 2 ضعف التيار المقنن','6 و 8 أضعاف التيار المقنن','نصف التيار المقنن','20 و 30 ضعفاً'],c:1,e:'ص 58.'},
  {q:'جميع طرق تقليل تيار البدء تعتمد على المعادلة (1-39) وذلك:',o:['بزيادة الجهد','بتقليل البسط (الجهد) أو زيادة المقام (المقاومات)','بزيادة التردد','بعكس اتجاه الدوران'],c:1,e:'ص 58.'},
  {q:'عيب توصيل مقاومات على التوالي مع ملفات العضو الثابت:',o:['زيادة المفاقيد النحاسية','لا يقل التيار','يحتاج محركاً بستة أطراف','يحتاج حلقات انزلاق'],c:0,e:'ص 59: غير مناسبة خصوصاً مع المحركات الكبيرة.'},
  {q:'الطريقة التي «لا يوجد فيها أي قدرة مفقودة» حسب الكتاب:',o:['مقاومات الثابت','المحول الذاتي','مقاومات الدوار','التوصيل المباشر'],c:1,e:'ص 61.'},
  {q:'عند البدء بالنجمة بدلاً من الدلتا ينخفض تيار الخط إلى:',o:['النصف','\\(1/\\sqrt3\\)','الثلث','الربع'],c:2,e:'ص 62: جهد الوجه يقل إلى 1/√3 وتيار الخط إلى 1/3.'},
  {q:'في طريقة نجمة/دلتا، المرحلة الثانية هي:',o:['إغلاق 2 و 3 معاً','فتح القاطع 2 وإغلاق القاطع 3 مع بقاء 1 مغلقاً','فتح القاطع 1','إغلاق 2 فقط'],c:1,e:'ص 63. إغلاق 2 و 3 معاً قصر بين الأوجه.'},
  {q:'طريقة إضافة مقاومات إلى العضو الدوار تصلح لـ:',o:['محرك القفص السنجابي','المحرك ذي حلقات الانزلاق فقط','كل المحركات','محركات التيار المستمر'],c:1,e:'ص 64.'}
 ]
});

/* ============================== Lesson 1.10 — speed control ============================== */
const pFreq=f=>({V:240*Math.min(1,f/60),R1:.4,R2:.6,X1:f/60,X2:f/60,ns:30*f});   // 4-pole motor of example (1-8) supplied at frequency f
function coilsSVG(poles){const cx=[130,290],dir=poles===2?[1,-1]:[1,1];let s='';
  cx.forEach((x,k)=>{s+=`<path d="M${x-50} 110L${x-30} 40H${x+30}L${x+50} 110L${x+30} 180H${x-30}Z" fill="var(--surface-2)" stroke="var(--live)" stroke-width="3"/>`;
   const d=dir[k];s+=arrow(x-62,110-26*d,x-62,110+26*d,'--blue',2.2)+arrow(x+62,110+26*d,x+62,110-26*d,'--blue',2.2)});
  if(poles===2){s+=tx(130,118,'N','b','middle',22)+tx(290,118,'S','','middle',22,'--stop')}
  else{s+=tx(130,118,'N','b','middle',22)+tx(290,118,'N','b','middle',22)+tx(210,118,'S','','middle',22,'--stop')+tx(378,118,'S','','middle',22,'--stop')}
  // connections at the bottom (2 poles: crossed so the second coil carries the opposite current)
  const a1=110,b1=150,a2=270,b2=310;s+=`<path class="w live" d="M${a1} 180V214H190V246"/>`;
  if(poles===2)s+=`<path class="w live" d="M${b1} 180V200L${b2} 200V180M${a2} 180V226H230V246"/>`;else s+=`<path class="w live" d="M${b1} 180V200H${a2}V180M${b2} 180V226H230V246"/>`;
  s+=`<circle cx="190" cy="250" r="4" fill="var(--surface)" stroke="var(--fg)" stroke-width="2"/><circle cx="230" cy="250" r="4" fill="var(--surface)" stroke="var(--fg)" stroke-width="2"/>`+arrow(250,262,250,236,'--blue',1.8)+tx(258,256,'I','b','start',13);
  return `<svg viewBox="0 0 420 270" role="img" aria-label="توصيل الملفات">${s}</svg>`}
function freqSVG(fsel,TL,W){const FS=[5,15,30,45,60,75,90,105,120];const ser=[];let ym=0;
  FS.concat(FS.includes(fsel)?[]:[fsel]).forEach(f=>{const p=pFreq(f);ym=Math.max(ym,TQ.tmF(p));ser.push({pts:sGrid.map(s=>[p.ns*(1-s)/100,TQ.full(s,p)]),col:f===fsel?'--blue':'--muted',w:f===fsel?3:1.4,op:f===fsel?1:.8})});
  ser.sort((a,b)=>(a.col==='--blue')-(b.col==='--blue'));ym*=1.15;
  return chartSVG({W:W||560,H:320,L:46,B:40,x0:0,x1:37,y0:0,y1:ym,yt:ticks(0,ym,5),xt:[0,5,10,15,20,25,30,35],xl:'n (rpm) ×100',yl:'T (Nm)',series:ser,aria:'منحنيات العزم والسرعة عند ترددات مختلفة',
   extra:(X,Y)=>{let s='';[[60,'f = 60Hz'],[90,'f = 90Hz'],[120,'f = 120Hz']].forEach(([f,l])=>{const p=pFreq(f),sm=TQ.smF(p);s+=tx(X(p.ns*(1-sm)/100),Y(TQ.tmF(p))-8,l,f===fsel?'b':'m','middle',11)});
    if(TL!=null){s+=`<path d="M${X(0)} ${fx(Y(TL))}H${X(37)}" stroke="var(--stop)" stroke-dasharray="8 4" stroke-width="1.5"/>`;const p=pFreq(fsel),so=TQ.opS(p,TL);if(so!=null&&so>0)s+=`<circle cx="${fx(X(p.ns*(1-so)/100))}" cy="${fx(Y(TL))}" r="6" fill="var(--live)" stroke="var(--surface)" stroke-width="2"/>`}
    const ns=30*fsel;s+=tx(X(ns/100),Y(0)+28,'ns','b','middle',11);return s}})}

B.lesson({
 id:'u1-l10',unit:1,order:10,pages:'67–69',
 title:'التحكم في سرعة المحرك الحثي ثلاثي الأوجه',
 summary:'المحرك الحثي محرك ذو سرعة ثابتة تقريباً، ويمكن التحكم المحدود في سرعته بثلاث طرق من المعادلتين (1-1) و (1-4): تغيير الانزلاق بمقاومات العضو الدوار، وتغيير عدد الأقطاب (الشكلان 1-33 و 1-34)، وتغيير تردد المصدر (الشكل 1-35).',
 theory:[
  {h:'ثانياً: التحكم في السرعة',ref:'ص 67',html:`<p>«المحرك الحثي ثلاثي الأوجه يعتبر المحرك المثالي للتطبيقات التي لا تتطلب تغيراً في السرعة وذلك لأن سرعته ثابتة تقريباً عند قيمة أقل من السرعة التزامنية بقدر بسيط وعندما يتغير الحمل تتغير سرعته بشكل طفيف، ولذلك فهو يعتبر <b>محركاً ذا سرعة ثابتة تقريباً</b>. ونظراً لوجود بعض التطبيقات التي تتطلب التحكم في السرعة، يمكن التحكم المحدود في سرعة المحرك بعدد من الطرق. بالرجوع إلى المعادلة رقم (1-4) نجد أن سرعة العضو الدوار يمكن التحكم فيها إما بتغيير الانزلاق أو بتغيير السرعة التزامنية، التي يمكن أن تتغير بتغير عدد الأقطاب أو بتغير تردد المصدر وذلك طبقاً للمعادلة (1-1). وبناءً عليه يمكن التحكم في سرعة المحرك الحثي ثلاثي الأوجه بإحدى ثلاث طرق: <b>بتغيير الانزلاق</b> أو <b>بتغيير عدد الأقطاب</b> أو <b>بتغيير تردد المصدر</b>.»</p>
   $$n = n_s(1-S) \\qquad\\qquad n_s=\\frac{120 f_s}{p}$$`},
  {note:'<b>تذكير:</b> المعادلتان (1-4) و (1-1) من الفصل الأول، بالصيغة التي استعملتها حلول الأمثلة في الفصل الثالث.'},
  {h:'1ـ تغيير قيمة الانزلاق',ref:'ص 67',html:`<p>«هذه الطريقة تستخدم فقط مع المحركات ذات حلقات الانزلاق وذلك بتوصيل مقاومات على التوالي مع ملفات العضو الدوار، انظر الشكل (1-29). إن أي تغيير في مقاومة ملفات العضو الدوار سيؤدي إلى تغيير موضع العزم الأقصى طبقاً للمعادلة (1-37) وبالتالي تتغير السرعة مع تغير الانزلاق طبقاً للمعادلة (1-4).»</p>
   <p>«هذه الطريقة تعطي تحكماً محدوداً في السرعة <b>ويحبذ أن لا يزيد عن 15% من السرعة التزامنية</b> وذلك لأن زيادة هذه المقاومة تؤدي إلى زيادة المفاقيد النحاسية في العضو الدوار وبالتالي قلة كفاءة المحرك.»</p>`},
  {err:'في ص 67 يحيل الكتاب إلى «المعادلة (1-37)» لتغير موضع العزم الأقصى، والمعادلة التي تحدد موضع العزم الأقصى هي <b>(1-36)</b>: \\(S_m = R\'_2/X\'_2\\). أما (1-37) فهي قيمة العزم الأقصى نفسه، ولا تتغير بتغير مقاومة العضو الدوار.'},
  {note:'<b>توضيح للمتدرب (ليس من نص الكتاب):</b> مع حمل عزمه ثابت تبقى القدرة عبر الثغرة \\(P_g = T\\,\\omega_s\\) ثابتة، فكلما أبطأنا المحرك بزيادة الانزلاق زاد الجزء \\(S\\,P_g\\) الذي يتحول حرارة في المقاومات. إبطاء المحرك 15% يعني أن نحو 15% من \\(P_g\\) يضيع حرارة، ولهذا يحدّ الكتاب الطريقة بـ 15%.'},
  {h:'2ـ تغيير عدد الأقطاب',ref:'ص 67–68',html:`<p>«يمكن تغيير عدد أقطاب العضو الثابت في المحرك الحثي ذو القفص السنجابي بإعادة توصيل ملفاته بطريقة مختلفة بحيث نحصل على <b>نصف عدد الأقطاب أو الضعف</b> وبهذه الطريقة يصبح لدينا سرعتان تزامنيتان. فإذا كانت الأقطاب الأساسية قطبين كما هو موضح في الشكل (1-33) يمكن إعادة التوصيل بحيث تصبح أربعة أقطاب وبالتالي تقل السرعة إلى النصف كما هو موضح في الشكل (1-34).»</p>
   <p>«إذا كانت هذه الطريقة لا تعطي السرعة المطلوبة فإنه بالإمكان وضع <b>طبقتين منفصلتين من الملفات</b> في العضو الثابت كل طبقة ذات عدد من الأقطاب يختلف عن الآخر، مثلاً يمكن أن تكون الطبقة الأولى ذات ثمانية أقطاب بينما الثانية تكون ذات ستة أقطاب، كما أنه بالإمكان دمج الطريقتين معاً لنحصل على <b>محرك ذي أربع سرعات</b>.»</p>
   <p>«هذه الطريقة <b>غير مناسبة للمحرك ذو العضو الدوار الملفوف</b> لأن ذلك يستدعي إعادة توصيل ملفات العضو الدوار لكي تصبح أقطابه متساوية مع أقطاب العضو الثابت كلما أردنا تغيير السرعة وهذا غير مناسب. بينما العضو الدوار ذو القفص السنجابي يتلاءم تلقائياً مع أي عدد موجود من الأقطاب في العضو الثابت.»</p>`},
  {fig:'(1-33)',ref:'ص 68',caption:'توصيل الملفات على شكل قطبين: التيار يدور في الملفين في اتجاهين متعاكسين (أسلاك التوصيل متقاطعة) فيتكون قطب N وقطب S.',draw:()=>box(coilsSVG(2),460)},
  {fig:'(1-34)',ref:'ص 68',caption:'توصيل الملفات على شكل أربعة أقطاب: التيار يدور في الملفين في الاتجاه نفسه، فيكون كل ملف قطب N وتتكون أقطاب S بينهما وعلى جانبهما (N S N S).',draw:()=>box(coilsSVG(4),460)},
  {h:'3ـ تغيير تردد المصدر',ref:'ص 69',html:`<p>«يمكن التحكم في السرعة التزامنية للمحرك الحثي ثلاثي الأوجه عن طريق التحكم في تردد المصدر المغذي لملفات العضو الثابت، و هذا يتطلب وجود مصدر جهد ثلاثي الأوجه ذو تردد قابل للتغيير. هذا النوع من المصادر هو عبارة عن أجهزة تحكم إلكترونية ذات قدرات عالية <span class="ltr">(cycloconverter)</span>.»</p>
   <p>«كما أن <b>الجهد الخارج يضبط بحيث يكون متناسباً مع التردد المطلوب</b> وذلك للحفاظ على قيمة ثابتة للفيض المغناطيسي في الثغرة الهوائية. مثل هذه الأجهزة تكون عادةً مكلفة ولا يلجأ إليها إلا في التطبيقات التي تحتاج إلى تحكم دقيق في السرعة.»</p>
   <p>«الشكل (1-35) يوضح منحنيات (العزم و السرعة) لمحرك ذو أربعة أقطاب عند ترددات مختلفة، ويلاحظ أن العزم يزداد عند انخفاض التردد وذلك بسبب زيادة الجهد والعكس يحدث عند زيادة التردد وذلك للمحافظة على كمية ثابتة للفيض المغناطيسي في الثغرة الهوائية.»</p>`},
  {fig:'(1-35)',ref:'ص 69',caption:'منحنيات (العزم و السرعة) لمحرك ذو أربعة أقطاب عند ترددات مختلفة: كل منحنى ينتهي عند سرعته التزامنية <span class="ltr">n<sub>s</sub> = 30 f</span>. أعلى قمة عند التردد المقنن <span class="ltr">60 Hz</span>، وتقل القمم فوقه (90 و 120 Hz) وتحته. رُسمت كما في الشكل بمحرك مثال (1-8) (أربعة أقطاب، 60 Hz) مع جهد يتناسب مع التردد حتى 60 Hz ثم يبقى عند الجهد المقنن (توضيح).',draw:()=>box(freqSVG(60,null),600)},
  {err:'جملة ص 69 «العزم <b>يزداد</b> عند انخفاض التردد وذلك بسبب <b>زيادة الجهد</b>» تتعارض مع ما قبلها مباشرة (الجهد يُضبط «متناسباً مع التردد» أي <b>ينخفض</b> معه)، ومع الشكل (1-35) نفسه الذي يُظهر أن قمم العزم تحت 60 Hz <b>أقل</b> من قمة 60 Hz لا أكبر. الصحيح في الشكل: أعلى قمة عند التردد المقنن 60 Hz وتنخفض القمم في الاتجاهين. رسمنا المنحنيات كما يظهرها الشكل.'},
  {note:'<b>توضيح (ليس من نص الكتاب):</b> يذكر الكتاب الـ <span class="ltr">cycloconverter</span> مصدراً للتردد المتغير؛ والأشيع اليوم في المصانع هو «مغيّر السرعة» أو العاكس <span class="ltr">(inverter / VFD)</span>، وفكرته واحدة: جهد وتردد متغيران معاً. لماذا تقل القمم تحت 60 Hz؟ لأن هبوط الجهد على مقاومة الثابت R<sub>1</sub> يصبح نسبته أكبر كلما صغر الجهد. ولماذا تقل فوق 60 Hz؟ لأن الجهد لا يمكن رفعه فوق المقنن فيقل الفيض.'}
 ],
 lab:(el)=>{
  const st={mode:'slip',Rx:0,TL:69.7,poles:2,f:50,ff:60,TLf:50,TLp:20};
  el.innerHTML=`<div class="grid">
   <div class="panel c12"><div class="u1b-row"><span class="lab">الطريقة:</span>${segHTML('vm',[['slip','1ـ تغيير الانزلاق'],['poles','2ـ تغيير عدد الأقطاب'],['freq','3ـ تغيير التردد']],st.mode)}</div></div>
   <div class="panel c7"><h2 id="vH"></h2><div class="svgbox" id="vC"></div><div id="vLeg"></div><div id="vMsg" class="u1b-msg"></div></div>
   <div class="panel c5"><h2>المتغيرات</h2><div id="vCtl"></div><div class="facts" id="vF"></div><div id="vX"></div></div>
   <div class="panel c12" id="vTry"></div></div>`;
  const $=s=>el.querySelector(s);const F=(l,v)=>`<div class="fact"><span>${l}</span><b>${v}</b></div>`;
  const ctl={
   slip:()=>`${sl('vrx','المقاومة المضافة إلى العضو الدوار <span class="ltr">R<sub>add</sub></span>',0,3,0.05,st.Rx)}${sl('vtl','عزم الحمل <span class="ltr">T<sub>L</sub></span>',0,150,0.1,st.TL)}<p class="sub">المحرك: قيم مثال (1-8) (<span class="ltr">240 V</span> دلتا، <span class="ltr">n<sub>s</sub> = 1800 rpm</span>)، ونفترض للتوضيح أنه ذو حلقات انزلاق.</p>`,
   poles:()=>`<div class="u1b-row"><span class="lab">التوصيل:</span>${segHTML('vp',[[2,'قطبان (1-33)'],[4,'أربعة أقطاب (1-34)']],st.poles)}</div><div class="u1b-row"><span class="lab">التردد:</span>${segHTML('vf',[[50,'50 Hz'],[60,'60 Hz']],st.f)}</div>${sl('vtp','عزم الحمل <span class="ltr">T<sub>L</sub></span>',0,60,0.5,st.TLp)}`,
   freq:()=>`${sl('vff','تردد المصدر <span class="ltr">f</span>',5,120,5,st.ff)}${sl('vtf','عزم الحمل <span class="ltr">T<sub>L</sub></span>',0,150,0.5,st.TLf)}<p class="sub">محرك أربعة أقطاب (قيم مثال 1-8 عند <span class="ltr">60 Hz</span>). الجهد يتناسب مع التردد حتى 60 Hz ثم يبقى <span class="ltr">240 V</span> (توضيح).</p>`};
  const tries={
   slip:['ابدأ بـ <span class="ltr">R<sub>add</sub> = 0</span> وحمل <span class="ltr">69.7 Nm</span>: السرعة <span class="ltr">1710 rpm</span> كما في مثال (1-8).','زد المقاومة تدريجياً: ينتقل موضع العزم الأقصى نحو S = 1 (المعادلة 1-36) فتنزاح نقطة التشغيل وتقل السرعة.','راقب <span class="ltr">P<sub>cu2</sub> = S·P<sub>g</sub></span>: يزداد مع كل إبطاء. عند تجاوز 15% من n<sub>s</sub> يظهر تحذير الكتاب.'],
   poles:['بدّل بين «قطبان» و«أربعة أقطاب»: لاحظ في الرسم اتجاه التيار في الملف الثاني وترتيب الأقطاب، والسرعة التزامنية تنقص إلى النصف.','غيّر التردد بين 50 و 60 Hz: <span class="ltr">3000 ↔ 1500</span> أو <span class="ltr">3600 ↔ 1800 rpm</span>.','انظر جدول المحرك ذي الأربع سرعات أسفل المتغيرات.'],
   freq:['حرّك التردد من 60 إلى 30 Hz: تنتقل السرعة التزامنية من 1800 إلى 900 rpm، وتقل قمة العزم قليلاً.','ارفع التردد إلى 90 ثم 120 Hz: تزيد السرعة لكن قمة العزم تقل بوضوح كما في الشكل (1-35).','ارفع عزم الحمل حتى لا يجد المحرك نقطة تشغيل عند الترددات العالية.']};
  const draw=()=>{const m=st.mode;let h='',c='',lg='',f='',msg='',xx='';
   if(m==='slip'){const P0=Object.assign({},P18),P=Object.assign({},P18,{R2:P18.R2+st.Rx}),s0=TQ.opS(P0,st.TL),s=TQ.opS(P,st.TL);
    h='تغيير الانزلاق بمقاومة العضو الدوار <small>المعادلات (1-34) و (1-36) و (1-4) — ص 67</small>';
    const ym=Math.max(TQ.tmF(P0),st.TL)*1.15,X=s=>1800*(1-s);
    c=chartSVG({W:560,H:320,L:46,B:40,x0:0,x1:1800,y0:0,y1:ym,yt:ticks(0,ym,5),xt:[0,300,600,900,1200,1500,1800],xl:'n (rpm)',yl:'T (Nm)',aria:'منحنى العزم والسرعة',
     series:[{pts:sGrid.map(q=>[X(q),TQ.full(q,P0)]),col:'--muted',w:1.6,dash:'6 4'},{pts:sGrid.map(q=>[X(q),TQ.full(q,P)]),col:'--blue',w:3}],
     extra:(Xf,Y)=>{let t=`<path d="M${Xf(0)} ${fx(Y(st.TL))}H${Xf(1800)}" stroke="var(--stop)" stroke-dasharray="8 4" stroke-width="1.5"/><path d="M${fx(Xf(1530))} ${Y(ym)}V${Y(0)}" stroke="var(--live)" stroke-dasharray="3 4"/>`+tx(Xf(1530)-4,Y(ym)+14,'85% ns','','end',10,'--live');
      if(s0!=null&&s0>0)t+=`<circle cx="${fx(Xf(X(s0)))}" cy="${fx(Y(st.TL))}" r="5" fill="var(--muted)"/>`;if(s!=null&&s>0)t+=`<circle cx="${fx(Xf(X(s)))}" cy="${fx(Y(st.TL))}" r="6.5" fill="var(--live)" stroke="var(--surface)" stroke-width="2"/>`;return t}});
    lg=legend([['--muted','بدون مقاومة مضافة',1],['--blue','مع المقاومة المضافة'],['--stop','عزم الحمل',1]]);
    if(s==null)f=F('الحالة','لا نقطة تشغيل');
    else{const Pg=st.TL*2*PI*1800/60/1000;f=F('الانزلاق S',fm(R(s,4)))+F('السرعة n',fm(R(1800*(1-s),1))+' rpm')+F('الإبطاء من n<sub>s</sub>',fm(R(s*100,1))+' %')+F('<bdi dir="ltr">P<sub>g</sub> = Tω<sub>s</sub></bdi>',fm(R(Pg,3))+' kW')+F('<bdi dir="ltr">P<sub>cu2</sub> = S·P<sub>g</sub></bdi>',fm(R(s*Pg,3))+' kW')+F('<bdi dir="ltr">P<sub>m</sub> = (1−S)P<sub>g</sub></bdi>',fm(R((1-s)*Pg,3))+' kW');
     msg=s>0.15?'<div class="callout err"><b>تجاوزت 15% من السرعة التزامنية:</b> «يحبذ أن لا يزيد عن 15% من السرعة التزامنية وذلك لأن زيادة هذه المقاومة تؤدي إلى زيادة المفاقيد النحاسية في العضو الدوار وبالتالي قلة كفاءة المحرك» (ص 67).</div>':'<div class="callout">زيادة المقاومة تنقل موضع العزم الأقصى نحو S = 1 (المعادلة 1-36) فتنزاح نقطة التشغيل إلى سرعة أقل، وقمة العزم لا تتغير.</div>'}
    if(s==null)msg='<div class="callout err">عزم الحمل أكبر من العزم الأقصى: لا توجد نقطة تشغيل.</div>'}
   else if(m==='poles'){const ns=120*st.f/st.poles,P=Object.assign({},P18,{ns}),P2=Object.assign({},P18,{ns:120*st.f/(st.poles===2?4:2)});
    h=`توصيل الملفات على شكل ${st.poles===2?'قطبين':'أربعة أقطاب'} <small>الشكلان (1-33) و (1-34) ص 68</small>`;
    const nmax=120*st.f/2,ym=Math.max(TQ.tmF(P),TQ.tmF(P2),st.TLp)*1.15;
    const ch=chartSVG({W:560,H:250,L:46,B:40,x0:0,x1:nmax,y0:0,y1:ym,yt:ticks(0,ym,4),xt:ticks(0,nmax,6),xl:'n (rpm)',yl:'T (Nm)',aria:'منحنيا العزم للسرعتين',
     series:[{pts:sGrid.map(q=>[P2.ns*(1-q),TQ.full(q,P2)]),col:'--muted',w:1.6,dash:'6 4'},{pts:sGrid.map(q=>[ns*(1-q),TQ.full(q,P)]),col:'--blue',w:3}],
     extra:(X,Y)=>{let t=`<path d="M${X(0)} ${fx(Y(st.TLp))}H${X(nmax)}" stroke="var(--stop)" stroke-dasharray="8 4" stroke-width="1.5"/>`;const so=TQ.opS(P,st.TLp);if(so!=null&&so>0)t+=`<circle cx="${fx(X(ns*(1-so)))}" cy="${fx(Y(st.TLp))}" r="6" fill="var(--live)" stroke="var(--surface)" stroke-width="2"/>`;return t}});
    c=coilsSVG(st.poles)+'</div><div class="svgbox">'+ch;lg=legend([['--blue','عدد الأقطاب المختار'],['--muted','التوصيل الآخر',1],['--stop','عزم الحمل',1]])+'<p class="sub">منحنيا العزم مرسومان بقيم مثال (1-8) للتوضيح.</p>';
    const so=TQ.opS(P,st.TLp);f=F('عدد الأقطاب p',st.poles)+F('<bdi dir="ltr">n<sub>s</sub> = 120f/p</bdi>',fm(ns)+' rpm')+F('السرعة n',so==null?'—':fm(R(ns*(1-so),1))+' rpm');
    const T4=(p1,p2,fq)=>[p1,p2].map(p=>fm(120*fq/p)).join(' و ');
    xx=`<h3 class="sm" style="margin-top:12px">محرك ذو أربع سرعات (مثال توضيحي، ليس من الكتاب)</h3><table class="u1b-tbl"><thead><tr><th>الطبقة</th><th>الأقطاب</th><th>السرعات التزامنية عند ${st.f} Hz</th></tr></thead><tbody><tr><td>الأولى</td><td>4 ↔ 8</td><td>${T4(4,8,st.f)} rpm</td></tr><tr><td>الثانية</td><td>6 ↔ 12</td><td>${T4(6,12,st.f)} rpm</td></tr></tbody></table>`;
    msg='<div class="callout">'+(st.poles===2?'التيار في الملفين متعاكس (الأسلاك متقاطعة): قطب N وقطب S.':'التيار في الملفين بالاتجاه نفسه: كل ملف قطب N، وتتكون أقطاب S بينهما وعلى جانبهما، فيصبح العدد أربعة أقطاب وتقل السرعة إلى النصف.')+' هذه الطريقة للقفص السنجابي فقط.</div>'}
   else{const p=pFreq(st.ff),so=TQ.opS(p,st.TLf);h='تغيير تردد المصدر <small>الشكل (1-35) ص 69</small>';c=freqSVG(st.ff,st.TLf);
    lg=legend([['--blue','التردد المختار'],['--muted','ترددات أخرى (مثل الشكل)'],['--stop','عزم الحمل',1]]);
    f=F('<bdi dir="ltr">n<sub>s</sub> = 120f/4</bdi>',fm(p.ns)+' rpm')+F('الجهد',fm(R(p.V,1))+' V')+F('<bdi dir="ltr">V/f</bdi>',fm(R(p.V/st.ff,2)))+F('قمة العزم',fm(R(TQ.tmF(p),1))+' Nm')+F('السرعة n',so==null?'—':fm(R(p.ns*(1-so),1))+' rpm');
    msg=so==null?'<div class="callout err">عزم الحمل أكبر من قمة العزم عند هذا التردد: لا توجد نقطة تشغيل.</div>':`<div class="callout">${st.ff<60?'تحت التردد المقنن: الجهد يقل مع التردد (V/f ثابت) فيبقى الفيض ثابتاً تقريباً، والقمة أقل قليلاً من قمة 60 Hz.':st.ff>60?'فوق التردد المقنن: الجهد عند قيمته المقننة فيقل الفيض وتقل قمة العزم، كما في المنحنيين 90 و 120 Hz في الشكل.':'عند التردد المقنن 60 Hz: أعلى قمة عزم في الشكل.'}</div>`}
   $('#vH').innerHTML=h;$('#vC').innerHTML=c;$('#vLeg').innerHTML=lg;$('#vF').innerHTML=f;$('#vX').innerHTML=xx;$('#vMsg').innerHTML=msg;
   const v=(id,t)=>{const e=$('#'+id+'-v');if(e)e.textContent=t};v('vrx',fm(st.Rx,2)+' Ω');v('vtl',fm(st.TL,1)+' Nm');v('vtp',fm(st.TLp,1)+' Nm');v('vff',st.ff+' Hz');v('vtf',fm(st.TLf,1)+' Nm')};
  const build=()=>{$('#vCtl').innerHTML=ctl[st.mode]();$('#vTry').innerHTML=tryList(tries[st.mode]);
   [['vrx','Rx'],['vtl','TL'],['vtp','TLp'],['vff','ff'],['vtf','TLf']].forEach(([id,k])=>{const e=$('#'+id);if(e)e.oninput=()=>{st[k]=+e.value;draw()}});
   el.querySelectorAll('[data-vp]').forEach(b=>b.onclick=()=>{st.poles=+b.dataset.vp;segSet(el,'vp',st.poles);draw()});
   el.querySelectorAll('[data-vf]').forEach(b=>b.onclick=()=>{st.f=+b.dataset.vf;segSet(el,'vf',st.f);draw()});draw()};
  el.querySelectorAll('[data-vm]').forEach(b=>b.onclick=()=>{st.mode=b.dataset.vm;segSet(el,'vm',st.mode);build()});
  build();
 },
 quiz:[
  {q:'لماذا يعتبر المحرك الحثي «ذا سرعة ثابتة تقريباً»؟',o:['لأن سرعته أقل من التزامنية بقدر بسيط وتتغير بشكل طفيف مع الحمل','لأنه لا يتأثر بالتردد','لأنه بلا انزلاق','لأن عزمه ثابت'],c:0,e:'ص 67.'},
  {q:'الطرق الثلاث للتحكم في سرعة المحرك الحثي حسب الكتاب:',o:['تغيير الانزلاق، أو عدد الأقطاب، أو التردد','تغيير الجهد فقط','تغيير اتجاه الدوران','تغيير المروحة والكراسي'],c:0,e:'ص 67، من المعادلتين (1-4) و (1-1).'},
  {q:'يحبذ ألا يزيد التحكم بتغيير الانزلاق عن:',o:['5% من السرعة التزامنية','15% من السرعة التزامنية','50%','100%'],c:1,e:'ص 67، لأن زيادة المقاومة تزيد المفاقيد النحاسية في العضو الدوار.'},
  {q:'عند إعادة توصيل ملفات محرك قطبين ليصبح أربعة أقطاب على 50 Hz تصبح السرعة التزامنية:',o:['3000 rpm','1500 rpm','6000 rpm','750 rpm'],c:1,e:'n<sub>s</sub> = 120 × 50 ÷ 4 = 1500 rpm (تقل إلى النصف).'},
  {q:'طريقة تغيير عدد الأقطاب غير مناسبة لـ:',o:['المحرك ذي العضو الدوار الملفوف','محرك القفص السنجابي','كل المحركات','المحركات الصغيرة'],c:0,e:'ص 68: يحتاج إعادة توصيل ملفات العضو الدوار أيضاً.'},
  {q:'عند تغيير التردد للتحكم في السرعة يُضبط الجهد بحيث:',o:['يبقى ثابتاً','يتناسب مع التردد للحفاظ على فيض ثابت','يتناسب عكسياً مع التردد','يصبح صفراً'],c:1,e:'ص 69.'},
  {q:'محرك أربعة أقطاب يغذى بتردد 90 Hz. سرعته التزامنية:',o:['1800 rpm','2700 rpm','3600 rpm','1350 rpm'],c:1,e:'n<sub>s</sub> = 120 × 90 ÷ 4 = 2700 rpm (المنحنى المعنون f = 90Hz في الشكل 1-35).'},
  {q:'حسب الشكل (1-35)، أعلى قمة عزم تكون عند:',o:['أصغر تردد','التردد المقنن 60 Hz','أعلى تردد 120 Hz','كل الترددات متساوية'],c:1,e:'الشكل يُظهر أعلى قمة عند 60 Hz وتقل القمم فوقه وتحته (انظر ملاحظة الكتاب على نص ص 69).'}
 ]
});

/* ============================== Lesson 1.11 — chapter questions ============================== */
function pfSteps(g){const ns=R(120*g.f/g.p,2),S=R((ns-g.n)/ns,4),Pg=R(g.Pin-g.Ps,2),Pc=R(S*Pg,2),Pm=R((1-S)*Pg,2),Po=R(Pm-g.PF,2),eta=R(Po/g.Pin*100,2),ws=R(2*PI*ns/60,2),T=R(Pg/ws,2);return [
  {t:'السرعة التزامنية (1-1):',f:`n_s=\\frac{120f}{p}=\\frac{120\\times ${g.f}}{${g.p}}`,v:ns,unit:'rpm'},
  {t:'الانزلاق (1-3):',f:`S=\\frac{n_s-n}{n_s}=\\frac{${fm(ns)}-${g.n}}{${fm(ns)}}`,v:S},
  {t:'القدرة عبر الثغرة الهوائية (1-19):',f:`P_g=P_{in}-P_s=${g.Pin}-${g.Ps}`,v:Pg,unit:'W'},
  {t:'أ) المفاقيد النحاسية في العضو الدوار (1-25):',f:`P_{cu2}=S\\,P_g=${S}\\times ${fm(Pg)}`,v:Pc,unit:'W',final:true},
  {t:'القدرة الميكانيكية المتحولة (1-26) ثم الخارجة (1-24):',f:`P_m=(1-S)P_g=${fm(Pm)}\\ W,\\quad P_o=P_m-P_F=${fm(Pm)}-${g.PF}`,v:Po,unit:'W'},
  {t:'ب) كفاءة المحرك (1-27):',f:`\\eta_{\\%}=\\frac{${fm(Po)}}{${g.Pin}}\\times100`,v:eta,unit:'%',final:true},
  {t:'جـ) عزم المحرك عند الحمل الكامل (1-29) و (1-30):',f:`\\omega_s=\\frac{2\\pi n_s}{60}=${fm(ws)},\\qquad T=\\frac{P_g}{\\omega_s}=\\frac{${fm(Pg)}}{${fm(ws)}}`,v:T,unit:'Nm',final:true}]}
const A='<span class="ltr">';const E='</span>';
B.lesson({
 id:'u1-l11',unit:1,order:11,pages:'55–57، 70',
 title:'أسئلة وتمارين الفصلين الثالث والرابع',
 summary:'أسئلة وتمارين الفصل الثالث «القدرة والعزم» (ص 55–57) والفصل الرابع «طرق بدء الحركة والتحكم في السرعة» (ص 70)، تحت كل سؤال إجابة مقترحة من نص الكتاب، وحاسبات للتمارين 14 و 15 و 16.',
 theory:[
  {h:'أسئلة وتمارين الفصل الثالث',ref:'ص 55–57',html:`<p class="sub">الكتاب لا يعطي إجابات. اضغط على السؤال لترى إجابة مقترحة مكتوبة من نص الكتاب. الأرقام بتقريب طريقة الكتاب، و <span class="ltr">1 hp = 0.746 kW</span> كما في مثال (1-7).</p>
   ${Q(1,'هل زيادة معامل الانزلاق أو نقصانه يؤثر على كفاءة المحرك؟ وَضّحْ ذلك؟','نعم. من (1-25) \\(P_{cu2}=S\\,P_g\\): زيادة الانزلاق تزيد المفاقيد النحاسية في العضو الدوار فتقل القدرة الميكانيكية \\(P_m=(1-S)P_g\\) وتقل الكفاءة، ونقصانه يزيدها؛ «لذلك يجب أن يكون الانزلاق صغيراً بقدر الإمكان» (ص 42).')}
   ${Q(2,'لماذا تهمل المفاقيد الحديدية في العضو الدوار؟','«لارتباطها بتردد تيارات العضو الدوار» (ص 41)، وهذا التردد \\(f_r=S\\,f_s\\) صغير جداً أثناء التشغيل (مثلاً 1.67 Hz في مثال 1-6) فتكون مفاقيد التيارات الدوامية والتخلف المغناطيسي في قلب الدوار صغيرة جداً.')}
   ${Q(3,'هل تؤثر زيادة المفاقيد النحاسية في العضو الدوار على سرعة المحرك؟ بيّنْ ذلك؟','نعم. \\(P_{cu2}=S\\,P_g\\)؛ فزيادة \\(P_{cu2}\\) (لنفس \\(P_g\\)) تعني انزلاقاً أكبر، ومن (1-4) \\(n=n_s(1-S)\\) تقل السرعة. وهذا ما يحدث عند إضافة مقاومة للعضو الدوار للتحكم في السرعة (ص 67).')}
   ${Q(4,'ما المقصود بعزم الدوران Torque؟','«القوة المؤثرة على جسم ما فينتج عنها دوران ذلك الجسم حول مركزه، ويقاس بوحدة نيوتن متر Nm». وفي المحرك الحثي هو حاصل قسمة القدرة الميكانيكية المتحولة على السرعة الزاوية للعمود \\(T=P_m/\\omega\\) (1-28)، أو \\(T=P_g/\\omega_s\\) (1-29) (ص 45).')}
   ${Q(5,'ما المقصود بالسرعة الزاوية؟','سرعة الدوران مقيسة بالراديان في الثانية بدلاً من الدورة في الدقيقة؛ للمجال الدوار \\(\\omega_s=\\frac{2\\pi n_s}{60}\\ rad/sec\\) (1-30)، وللعمود \\(\\omega=\\frac{2\\pi n}{60}\\). (الكتاب يستعمل المصطلح دون تعريف لفظي منفصل.)')}
   ${Q(6,'كيف يمكن التحكم في موضع العزم الأقصى للمحرك؟','بتغيير النسبة \\(R\'_2/X\'_2\\) لأن \\(S_m=R\'_2/X\'_2\\) (1-36)؛ «عملياً بإضافة مقاومة موصلة على التوالي مع ملفات العضو الدوار الملفوف (ذو حلقات الانزلاق)» فينتقل موضع العزم الأقصى نحو S = 1 (الشكل 1-21، ص 49–50).')}
   ${Q(7,'كيف يمكن التحكم في عزم البدء؟','بتغيير مقاومة ملفات العضو الدوار \\(R\'_2\\) بإضافة مقاومة على التوالي معها (المعادلة 1-38 والشكل 1-21، ص 50)؛ يزداد عزم البدء إلى أن يصل موضع العزم الأقصى إلى لحظة البدء (\\(S_m=1\\))، وبعدها يقل (منحنى 6Ro في الشكل). ويتأثر أيضاً بجهد الوجه \\(V_{ph}^2\\).')}
   ${Q(8,'هل التحكم في موضع العزم الأقصى يؤثر على كفاءة المحرك؟ بَيّنْ ذلك؟','نعم. تحريك موضع العزم الأقصى يتم بزيادة مقاومة العضو الدوار، فيزداد الانزلاق عند الحمل نفسه وتزداد المفاقيد النحاسية في العضو الدوار \\(P_{cu2}=S P_g\\) فتقل الكفاءة؛ ولهذا تزال المقاومات بعد البدء (ص 64)، ولا يزيد التحكم في السرعة بها عن 15% (ص 67).')}
   ${Q(9,'محرك حثي ثلاثي الأوجه سرعته التزامنية 1000 rpm يعطي قدره ميكانيكية متحولة قدرها 5 hp عندما تكون سرعة العضو الدوار 935 rpm، احسب القدرة الداخلة إلى هذا المحرك إذا كانت مفاقيد العضو الثابت 400 w.',`${A}S = (1000 − 935)/1000 = 0.065${E}؛ ${A}P<sub>m</sub> = 5 × 746 = 3730 W${E}؛ من (1-26): ${A}P<sub>g</sub> = P<sub>m</sub>/(1 − S) = 3730/0.935 = 3989.3 W${E}؛ ${A}P<sub>in</sub> = P<sub>g</sub> + P<sub>s</sub> = 3989.3 + 400 = 4389.3 W ≈ 4.39 kW${E}.`)}
   ${Q(10,'محرك حثي ثلاثي الأوجه ذو ستة أقطاب يتغذى من مصدر جهده 500 V وتردده 60 Hz، يعطي قدره ميكانيكية خارجة قدرها 20 hp عندما تكون سرعته 1140 rpm، فإذا كانت مفاقيد الاحتكاك 1 hp، احسب: أ) معامل الانزلاق ب) المفاقيد النحاسية في العضو الدوار جـ) القدرة الداخلة إلى المحرك إذا كانت مفاقيد العضو الثابت 1500 W د) تيار الخط الداخل إلى المحرك إذا كان معامل القدرة 0.86',`${A}n<sub>s</sub> = 120×60/6 = 1200 rpm${E}. أ) ${A}S = (1200 − 1140)/1200 = 0.05${E}. ب) ${A}P<sub>m</sub> = P<sub>o</sub> + P<sub>F</sub> = 21 hp = 15666 W${E}، ${A}P<sub>g</sub> = 15666/0.95 = 16490.5 W${E}، ${A}P<sub>cu2</sub> = 0.05 × 16490.5 = 824.5 W${E}. جـ) ${A}P<sub>in</sub> = 16490.5 + 1500 = 17990.5 W${E}. د) من (1-16): ${A}I<sub>L</sub> = 17990.5/(√3 × 500 × 0.86) = 24.16 A${E}.`)}
   ${Q(11,'إذا كانت القدرة الكهربائية الداخلة إلى محرك حثي ثلاثي الأوجه ذو أربعة أقطاب هي 200 KW عندما تكون سرعته 1710 rpm ويتغذى من مصدر جهده 450 V وتردده 60Hz فإذا كانت مفاقيد العضو الثابت 3 KW والمفاقيد الميكانيكية 6 KW. احسب: أ) معامل الانزلاق ب) القدرة الميكانيكية المتحولة جـ) المفاقيد النحاسية في العضو الدوار د) كفاءة المحرك',`${A}n<sub>s</sub> = 1800 rpm${E}. أ) ${A}S = 90/1800 = 0.05${E}. ${A}P<sub>g</sub> = 200 − 3 = 197 kW${E}. ب) ${A}P<sub>m</sub> = 0.95 × 197 = 187.15 kW${E}. جـ) ${A}P<sub>cu2</sub> = 0.05 × 197 = 9.85 kW${E}. د) ${A}P<sub>o</sub> = 187.15 − 6 = 181.15 kW${E}، ${A}η = 181.15/200 × 100 = 90.58 %${E}. (جرّبه في مختبر الدرس 1.7 بزر «أرقام التمرين 11».)`)}
   ${Q(12,'محرك حثي ثلاثي الأوجه ذو أربعة أقطاب يعمل على مصدر جهده 220 V وتردده 50 Hz، سرعة المحرك 1440 rpm عند معامل قدرة 0.8 متأخر، القدرة الخارجة منه 10.8 KW، فإذا كانت مفاقيد العضو الثابت 1060 W والمفاقيد الميكانيكية 390 W احسب: أ) المفاقيد النحاسية في العضو الدوار. ب) تردد التيارات في العضو الدوار. جـ) تيار الخط. د) كفاءة المحرك',`${A}n<sub>s</sub> = 1500 rpm، S = 0.04${E}. ${A}P<sub>m</sub> = 10800 + 390 = 11190 W${E}، ${A}P<sub>g</sub> = 11190/0.96 = 11656.25 W${E}. أ) ${A}P<sub>cu2</sub> = 0.04 × 11656.25 = 466.25 W${E}. ب) ${A}f<sub>r</sub> = S f<sub>s</sub> = 0.04 × 50 = 2 Hz${E}. جـ) ${A}P<sub>in</sub> = 11656.25 + 1060 = 12716.25 W${E}، ${A}I<sub>L</sub> = 12716.25/(√3 × 220 × 0.8) = 41.71 A${E}. د) ${A}η = 10800/12716.25 × 100 = 84.93 %${E}.`)}
   ${Q(13,'محرك حثي ثلاثي الأوجه ذو أربعة أقطاب يعمل على مصدر جهده 220 V وتردده 60 Hz، سرعة المحرك 1710 rpm عند معامل قدرة 0.83 متأخر، القدرة الخارجة منه 11 KW، فإذا كانت مفاقيد العضو الثابت 1100 W والمفاقيد الميكانيكية 420 W احسب: أ) المفاقيد النحاسية في العضو الدوار ب) تردد التيارات في العضو الدوار جـ) تيار الخط',`${A}n<sub>s</sub> = 1800 rpm، S = 0.05${E}. ${A}P<sub>m</sub> = 11000 + 420 = 11420 W${E}، ${A}P<sub>g</sub> = 11420/0.95 = 12021.05 W${E}. أ) ${A}P<sub>cu2</sub> = 0.05 × 12021.05 = 601.05 W${E}. ب) ${A}f<sub>r</sub> = 0.05 × 60 = 3 Hz${E}. جـ) ${A}P<sub>in</sub> = 12021.05 + 1100 = 13121.05 W${E}، ${A}I<sub>L</sub> = 13121.05/(√3 × 220 × 0.83) = 41.49 A${E}.`)}
   ${Q(14,'محرك حثي ثلاثي الأوجه ذو ثمانية أقطاب يعمل على مصدر جهده 380 V وتردده 60 Hz، فإذا كانت سرعة المحرك عند الحمل الكامل 864 rpm، القدرة الداخلة إليه 10 KW، وكانت مفاقيد العضو الثابت 600 W و المفاقيد الميكانيكية 350 W احسب: أ) المفاقيد النحاسية في العضو الدوار. ب) كفاءة المحرك. جـ) عزم المحرك عند الحمل الكامل.',`${A}n<sub>s</sub> = 900 rpm، S = 0.04، P<sub>g</sub> = 9400 W${E}. أ) ${A}P<sub>cu2</sub> = 376 W${E}. ب) ${A}P<sub>m</sub> = 9024 W، P<sub>o</sub> = 8674 W، η = 86.74 %${E}. جـ) من (1-29): ${A}T = P<sub>g</sub>/ω<sub>s</sub> = 9400/94.25 = 99.73 Nm${E}. الحل خطوة بخطوة في تبويب «الأمثلة المحلولة».`)}
   ${Q(15,'محرك حثي ثلاثي الأوجه ذو أربعة أقطاب يعمل على مصدر جهده 380 V وتردده 60 Hz، عناصر الدائرة المكافئة: R1 = 0.12Ω، R\'2 = 0.16Ω، X1 = 0.45Ω، X\'2 = 0.52Ω، فإذا كانت ملفات المحرك موصلة على شكل نجمة احسب: أ) تيار البدء. ب) عزم البدء. جـ) العزم الأقصى للمحرك وعند أي انزلاق. د) عزم البدء عند إضافة مقاومة قيمتها 1 Ω إلى كل وجه من أوجه العضو الدوار',`بطريقة مثال (1-8): ${A}n<sub>s</sub> = 1800 rpm${E} (أربعة أقطاب و 60 Hz، لم تذكر صراحة)، ${A}V<sub>ph</sub> = 380/√3 = 219.39 V${E}، ${A}K = 0.0159${E}. أ) ${A}I'<sub>2st</sub> ≈ 217.3 A${E}. ب) ${A}T<sub>st</sub> ≈ 120.13 Nm${E}. جـ) ${A}T<sub>max</sub> = KV<sub>ph</sub>²/2X'<sub>2</sub> ≈ 735.87 Nm${E} عند ${A}S<sub>m</sub> = 0.16/0.52 = 0.3077${E}. د) نعتبر المقاومة مضافة إلى R'<sub>2</sub> (لم تذكر نسبة التحويل): ${A}R'<sub>2</sub> = 1.16 Ω، I'<sub>2st</sub> ≈ 136.6 A، T<sub>st</sub> ≈ 344.2 Nm${E} أي نحو ثلاثة أضعاف. الحل في تبويب «الأمثلة المحلولة».`)}
   ${Q(16,'محرك حثي ثلاثي الأوجه ملفاته موصلة على شكل دلتا يتغذى من مصدر جهده 220 V، عناصر الدائرة المكافئة: R1 = 0.4Ω، R\'2 = 0.6Ω، X1 = 0.82Ω، X\'2 = 0.86Ω، فإذا كانت السرعة التزامنية لهذا المحرك 1500 rpm وسرعة العضو الدوار عند الحمل الكامل 1440 rpm، احسب: أ) عزم الحمل الكامل ب) عزم البدء',`بطريقة مثال (1-8): ${A}S = 0.04، K = 0.0191، I'<sub>2</sub> ≈ 14.2 A${E}. أ) ${A}T ≈ 57.77 Nm${E}. ب) ${A}I'<sub>2st</sub> ≈ 112.53 A، T<sub>st</sub> ≈ 145.1 Nm${E}. الحل في تبويب «الأمثلة المحلولة».`)}`},
  {note:'السؤال 16 في ص 57 ينتهي عند الفرع (ب) كما طُبع. وفي السؤال 15 لم تذكر السرعة التزامنية صراحة (تحسب من أربعة أقطاب و 60 Hz = 1800 rpm)، ولم يذكر في (د) هل الـ 1 Ω محولة إلى الثابت؛ افترضنا إضافتها إلى R\'<sub>2</sub>.'},
  {h:'أسئلة وتمارين الفصل الرابع',ref:'ص 70',html:`
   ${Q(1,'لماذا يكون تيار البدء عالياً في المحركات الحثية؟','لأن الانزلاق عند البدء يساوي واحداً فتصبح المقاومة الممثلة للحمل \\(R\'_2\\frac{1-S}{S}=0\\) أي مقصورة، فلا يحد التيار إلا مقاومات ومعاوقات الملفات الصغيرة (المعادلة 1-39)؛ ويصل التيار إلى 6–8 أضعاف التيار المقنن (ص 58).')}
   ${Q(2,'هل يفضل توصيل المقاومات على التوالي مع ملفات العضو الثابت من أجل تقليل تيار البدء، ولماذا؟','لا يفضل خصوصاً مع المحركات الكبيرة، لأن عيبها زيادة المفاقيد النحاسية (الحرارة في المقاومات) (ص 59)، رغم أنها تقلل الجهد على الملفات فيقل تيار البدء.')}
   ${Q(3,'ما مميزات استخدام المحول الذاتي في عملية البدء؟','يخفض الجهد على ملفات العضو الثابت إلى قيمة تتناسب مع تيار البدء المسموح به، و«مثالية جداً حيث لا يوجد فيها أي قدرة مفقودة»، وهي «الخيار الأفضل للمحركات التي تم توصيل ملفاتها داخلياً من قبل المصنع على شكل نجمة» (ص 61).')}
   ${Q(4,'ما مواصفات المحرك الذي يمكنه البدء بطريقة (Δ / Y)؟','المحرك ذو الستة أطراف (بدايات ونهايات الملفات الثلاثة ظاهرة) والذي توصل ملفاته على شكل دلتا أثناء التشغيل العادي (ص 62)؛ أي أن جهد ملفه المقنن يساوي جهد الخط.')}
   ${Q(5,'اشرح كيف تؤدي إضافة مقاومة إلى ملفات العضو الدوار إلى تقليل تيار البدء؟','المقاومة المضافة تزيد \\(R\'_2\\) في مقام المعادلة (1-39) \\(I\'_{2st}=V_{ph}/\\sqrt{(R_1+R\'_2)^2+X_{eq}^2}\\) فيقل تيار البدء؛ ثم تزال تدريجياً بعد البدء لتجنب زيادة المفاقيد (ص 64). وهي للمحرك ذي حلقات الانزلاق فقط.')}
   ${Q(6,'اذكر مميزات أجهزة البدء الإلكترونية؟','(ص 65) تحكم دقيق وناعم في الجهد مع مراقبة التيار فيبقى التيار ثابتاً طوال البدء مع عزم مستقر؛ تسارع ناعم بلا وقفات أو قفزات أو تذبذب أو إجهاد ميكانيكي؛ فيها جميع أنواع الحماية فتوفر تكلفة أجهزة الحماية؛ تستخدم أيضاً أثناء فرملة المحرك؛ متوفرة بقدرات تصل إلى 500 kW. (عيبها ارتفاع ثمن الجهاز.)')}
   ${Q(7,'وَضّحْ كيف يمكن التحكم في سرعة المحرك عن طريق إضافة مقاومة إلى دائرة العضو الدوار','في المحرك ذي حلقات الانزلاق توصل مقاومات على التوالي مع ملفات العضو الدوار (الشكل 1-29)، فيتغير موضع العزم الأقصى (\\(S_m=R\'_2/X\'_2\\)) وتنزاح نقطة التشغيل إلى انزلاق أكبر، فتقل السرعة حسب \\(n=n_s(1-S)\\). التحكم محدود ويحبذ ألا يزيد عن 15% من السرعة التزامنية بسبب زيادة المفاقيد وقلة الكفاءة (ص 67).')}
   ${Q(8,'كيف يمكن الحصول على محرك حثي ذو أربع سرعات؟','بوضع طبقتين منفصلتين من الملفات في العضو الثابت لكل منهما عدد أقطاب مختلف (مثلاً 8 و 6)، مع إمكانية إعادة توصيل كل طبقة لتعطي نصف عدد أقطابها أو ضعفه؛ دمج الطريقتين يعطي أربع سرعات (ص 67). وذلك في محرك القفص السنجابي.')}
   ${Q(9,'لماذا يجب تغيير الجهد عند تغيير تردد المصدر من أجل التحكم في سرعة المحرك؟','للحفاظ على قيمة ثابتة للفيض المغناطيسي في الثغرة الهوائية، فيضبط الجهد متناسباً مع التردد (ص 69). (توضيح: لو خُفض التردد مع بقاء الجهد لزاد الفيض وتشبع القلب وارتفع التيار، ولو رُفع التردد لضعف الفيض والعزم.)')}
   ${Q(10,'فيما يلي اختر الإجابة الصحيحة مع التعليل إما بكتابة معادلة أو رسم منحنى:','<ol type="a" style="list-style:none;padding-inline-start:4px;margin:4px 0"><li>أ) <b>يزداد</b>: الحمل الأكبر يحتاج عزماً أكبر فتقل السرعة ويزيد S (منحنى العزم والسرعة في المنطقة المستقرة).</li><li>ب) <b>يقل</b>: المعادلة (1-39).</li><li>جـ) <b>تقل</b>: يزيد الانزلاق عند الحمل نفسه، \\(n=n_s(1-S)\\).</li><li>د) <b>تقل</b>: \\(P_{cu2}=S\\,P_g\\).</li><li>هـ) <b>تقل</b>: \\(n_s=120f/p\\).</li><li>و) <b>يزداد</b>: \\(f_r=S\\,f_s\\).</li><li>ز) <b>تقل</b>: بزيادة السرعة يقل S فيقل \\(I\'_2\\) حسب (1-33).</li><li>حـ) <b>تقل</b>: \\(n_s=120f/p\\).</li></ol>',['أ) إذا زاد تحميل المحرك فإن الانزلاق ( يقل / يزداد )','ب) عند زيادة مقاومة العضو الدوار فإن تيار البدء ( يقل / يزداد )','جـ) عند زيادة مقاومة العضو الدوار فإن سرعة المحرك ( تقل / تزداد )','د) إذا قل الانزلاق فإن القدرة المفقودة في العضو الدائر ( تقل / تزداد )','هـ) إذا قل تردد المصدر فإن سرعة المجال المغناطيسي الدوار ( تقل / تزداد )','و) إذا زاد الانزلاق فإن تردد التيارات داخل ملفات العضو الدوار ( يقل / يزداد )','ز) إذا زادت سرعة المحرك فإن قيم التيارات داخل ملفات العضو الدوار ( تقل / تزداد )','حـ) إذا زادت عدد أقطاب العضو الثابت فإن سرعة المجال المغناطيسي الدوار ( تقل / تزداد )'])}`}
 ],
 examples:[
  {title:'التمرين 14 (حل مقترح — ليس من الكتاب)',ref:'ص 57',q:'<p>«محرك حثي ثلاثي الأوجه ذو ثمانية أقطاب يعمل على مصدر جهده <span class="ltr">380 V</span> وتردده <span class="ltr">60 Hz</span>، فإذا كانت سرعة المحرك عند الحمل الكامل <span class="ltr">864 rpm</span>، القدرة الداخلة إليه <span class="ltr">10 KW</span>، وكانت مفاقيد العضو الثابت <span class="ltr">600 W</span> و المفاقيد الميكانيكية <span class="ltr">350 W</span> احسب ما يلي: أ) المفاقيد النحاسية في العضو الدوار. ب) كفاءة المحرك. جـ) عزم المحرك عند الحمل الكامل.»</p>',
   given:[{id:'p',label:'عدد الأقطاب',sym:'p',unit:'',value:8},{id:'f',label:'التردد',sym:'f',unit:'Hz',value:60},{id:'n',label:'السرعة عند الحمل الكامل',sym:'n',unit:'rpm',value:864},{id:'Pin',label:'القدرة الداخلة',sym:'P_{in}',unit:'W',value:10000},{id:'Ps',label:'مفاقيد العضو الثابت',sym:'P_s',unit:'W',value:600},{id:'PF',label:'المفاقيد الميكانيكية',sym:'P_F',unit:'W',value:350}],
   solve:g=>pfSteps(g),note:'الكتاب لا يعطي ناتج هذا التمرين. العزم محسوب من (1-29) \\(T=P_g/\\omega_s\\) وهو العزم المتولد؛ عزم العمود بعد الاحتكاك \\(P_o/\\omega\\) أقل قليلاً (نحو 95.87 Nm).'},
  {title:'التمرين 15 (حل مقترح بطريقة مثال 1-8 — ليس من الكتاب)',ref:'ص 56–57',q:'<p>«محرك حثي ثلاثي الأوجه ذو أربعة أقطاب يعمل على مصدر جهده <span class="ltr">380 V</span> وتردده <span class="ltr">60 Hz</span>، عناصر الدائرة المكافئة: <span class="ltr">R<sub>1</sub> = 0.12Ω، R\'<sub>2</sub> = 0.16Ω، X<sub>1</sub> = 0.45Ω، X\'<sub>2</sub> = 0.52Ω</span> فإذا كانت ملفات المحرك موصلة على شكل نجمة احسب: أ) تيار البدء. ب) عزم البدء. جـ) العزم الأقصى للمحرك وعند أي انزلاق. د) عزم البدء عند إضافة مقاومة قيمتها 1 Ω إلى كل وجه من أوجه العضو الدوار»</p>',
   given:[{id:'VL',label:'جهد المصدر',sym:'V_L',unit:'V',value:380},{id:'conn',label:'التوصيل (1 = دلتا، 0 = نجمة)',sym:'',unit:'',value:0,step:1,min:0,max:1},{id:'R1',label:'مقاومة الثابت',sym:'R_1',unit:'Ω',value:0.12},{id:'R2',label:'مقاومة الدوار المحولة',sym:"R'_2",unit:'Ω',value:0.16},{id:'X1',label:'معاوقة الثابت',sym:'X_1',unit:'Ω',value:0.45},{id:'X2',label:'معاوقة الدوار المحولة',sym:"X'_2",unit:'Ω',value:0.52},{id:'ns',label:'السرعة التزامنية (4 أقطاب، 60 Hz)',sym:'n_s',unit:'rpm',value:1800},{id:'Ra',label:'المقاومة المضافة في (د)',sym:'R_{add}',unit:'Ω',value:1}],
   solve:g=>torqueSteps(g,{add:g.Ra,part:k=>['','','أ) ','ب) ','جـ) ','د) '][k]}),note:'الكتاب لا يعطي ناتج هذا التمرين. افترضنا أن المقاومة المضافة في (د) تضاف إلى R\'<sub>2</sub> مباشرة، وأن <span class="ltr">n<sub>s</sub> = 120 × 60 ÷ 4 = 1800 rpm</span>. العزم الأقصى بطريقة الكتاب (1-37).'},
  {title:'التمرين 16 (حل مقترح بطريقة مثال 1-8 — ليس من الكتاب)',ref:'ص 57',q:'<p>«محرك حثي ثلاثي الأوجه ملفاته موصلة على شكل دلتا يتغذى من مصدر جهده <span class="ltr">220 V</span>، عناصر الدائرة المكافئة: <span class="ltr">R<sub>1</sub> = 0.4Ω، R\'<sub>2</sub> = 0.6Ω، X<sub>1</sub> = 0.82Ω، X\'<sub>2</sub> = 0.86Ω</span> فإذا كانت السرعة التزامنية لهذا المحرك <span class="ltr">1500 rpm</span> وسرعة العضو الدوار عند الحمل الكامل <span class="ltr">1440 rpm</span>، احسب: أ) عزم الحمل الكامل ب) عزم البدء»</p>',
   given:[{id:'VL',label:'جهد المصدر',sym:'V_L',unit:'V',value:220},{id:'conn',label:'التوصيل (1 = دلتا، 0 = نجمة)',sym:'',unit:'',value:1,step:1,min:0,max:1},{id:'R1',label:'مقاومة الثابت',sym:'R_1',unit:'Ω',value:0.4},{id:'R2',label:'مقاومة الدوار المحولة',sym:"R'_2",unit:'Ω',value:0.6},{id:'X1',label:'معاوقة الثابت',sym:'X_1',unit:'Ω',value:0.82},{id:'X2',label:'معاوقة الدوار المحولة',sym:"X'_2",unit:'Ω',value:0.86},{id:'ns',label:'السرعة التزامنية',sym:'n_s',unit:'rpm',value:1500},{id:'n',label:'السرعة عند الحمل الكامل',sym:'n',unit:'rpm',value:1440}],
   solve:g=>torqueSteps(g,{fl:true,showI:false,part:k=>['','أ) ','','ب) ',''][k]}).filter((x,i,a)=>!/T_\{max\}|S_m/.test(x.f||'')),note:'الكتاب لا يعطي ناتج هذا التمرين. السؤال يطلب عزم الحمل الكامل وعزم البدء فقط (تيار البدء خطوة في الطريق).'}
 ],
 quiz:[
  {q:'إذا زاد تحميل المحرك فإن الانزلاق:',o:['يقل','يزداد'],c:1,e:'الحمل الأكبر يُبطئ المحرك فيزداد الانزلاق (المنطقة المستقرة من منحنى العزم والسرعة).'},
  {q:'عند زيادة مقاومة العضو الدوار فإن تيار البدء:',o:['يقل','يزداد'],c:0,e:'المعادلة (1-39): المقاومة في المقام.'},
  {q:'عند زيادة مقاومة العضو الدوار فإن سرعة المحرك (عند الحمل نفسه):',o:['تقل','تزداد'],c:0,e:'يزداد الانزلاق، n = n<sub>s</sub>(1 − S).'},
  {q:'إذا قل الانزلاق فإن القدرة المفقودة في العضو الدائر:',o:['تقل','تزداد'],c:0,e:'P<sub>cu2</sub> = S·P<sub>g</sub>.'},
  {q:'إذا قل تردد المصدر فإن سرعة المجال المغناطيسي الدوار:',o:['تقل','تزداد'],c:0,e:'n<sub>s</sub> = 120f/p.'},
  {q:'إذا زاد الانزلاق فإن تردد التيارات داخل ملفات العضو الدوار:',o:['يقل','يزداد'],c:1,e:'f<sub>r</sub> = S·f<sub>s</sub>.'},
  {q:'إذا زادت سرعة المحرك فإن قيم التيارات داخل ملفات العضو الدوار:',o:['تقل','تزداد'],c:0,e:'يقل S فيكبر R\'<sub>2</sub>/S في مقام (1-33) فيقل I\'<sub>2</sub>.'},
  {q:'إذا زاد عدد أقطاب العضو الثابت فإن سرعة المجال المغناطيسي الدوار:',o:['تقل','تزداد'],c:0,e:'n<sub>s</sub> = 120f/p.'}
 ]
});

})(PLCBOOK);
