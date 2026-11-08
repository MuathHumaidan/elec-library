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
  return {check(){const s=steps[i];if(s&&s.done&&s.done(getW())){i++;draw()}},redraw:draw};}
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
 stations:[
  {intro:true},

  {st:1,short:'القدرة الداخلة',title:'القدرة الداخلة إلى المحرك',ref:'ص 38',
   q:'الكهرباء تدخل المحرك من ثلاثة أسلاك وتخرج حركةً على العمود… هل يخرج كل ما دخل؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="محرك حثي: ثلاثة أسلاك تدخل من اليسار بقدرة كهربائية، وعمود يخرج من اليمين بقدرة ميكانيكية، وحرارة تخرج من جسم المحرك" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><g data-tip="الأسلاك الثلاثة للأوجه الثلاثة: يدخل منها الجهد والتيار فتدخل القدرة الكهربائية ⟦Pin⟧ إلى العضو الثابت، المعادلة (1-16)."><rect x="40" y="128" width="80" height="48" fill="transparent"/><line x1="44" y1="138" x2="112" y2="138" stroke="#E8735A" stroke-width="5" stroke-linecap="round"/><line x1="44" y1="152" x2="112" y2="152" stroke="#F2C14E" stroke-width="5" stroke-linecap="round"/><line x1="44" y1="166" x2="112" y2="166" stroke="#4FB3A9" stroke-width="5" stroke-linecap="round"/></g><rect data-tip="جسم المحرك: بداخله العضو الثابت (يشبه ابتدائي المحول) والعضو الدوار (يشبه الثانوي)، ولذلك يسمى المحرك الحثي «محولاً دواراً»." x="112" y="104" width="130" height="100" rx="16" fill="#2C4A40"/><g stroke="#4A6B60" stroke-width="3"><line x1="132" y1="112" x2="132" y2="196"/><line x1="152" y1="112" x2="152" y2="196"/><line x1="172" y1="112" x2="172" y2="196"/><line x1="192" y1="112" x2="192" y2="196"/><line x1="212" y1="112" x2="212" y2="196"/></g><rect x="150" y="214" width="54" height="12" rx="4" fill="#2C4A40"/><rect data-tip="عمود الدوران: تظهر عليه القدرة الميكانيكية الخارجة ⟦Po⟧ التي تدير الحمل." x="242" y="146" width="74" height="16" rx="4" fill="#E9B949" stroke="#B9852A" stroke-width="1.5"/><path d="M328 136 A18 18 0 1 1 312 172" fill="none" stroke="#2C4A40" stroke-width="3"/><polygon points="306,166 318,176 304,180" fill="#2C4A40"/><g data-tip="حرارة: جزء من القدرة الداخلة يضيع حرارة داخل المحرك (المفاقيد)، لذلك يسخن جسم المحرك أثناء العمل."><rect x="132" y="56" width="92" height="42" fill="transparent"/><path d="M146 92 q-8 -9 0 -18 q8 -9 0 -18" fill="none" stroke="#E8735A" stroke-width="3" stroke-linecap="round"/><path d="M178 92 q-8 -9 0 -18 q8 -9 0 -18" fill="none" stroke="#E8735A" stroke-width="3" stroke-linecap="round"/><path d="M210 92 q-8 -9 0 -18 q8 -9 0 -18" fill="none" stroke="#E8735A" stroke-width="3" stroke-linecap="round"/></g><text x="80" y="116" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">قدرة كهربائية</text><text x="80" y="198" text-anchor="middle" font-size="16" fill="#2C4A40" direction="ltr" font-family="var(--mono)">P<tspan font-size="11" dy="4">in</tspan></text><text x="284" y="128" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">قدرة ميكانيكية</text><text x="280" y="196" text-anchor="middle" font-size="16" fill="#2C4A40" direction="ltr" font-family="var(--mono)">P<tspan font-size="11" dy="4">o</tspan></text><text x="180" y="262" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">ما يدخل أكبر دائماً مما يخرج</text></svg>`,
   cap:'تدخل القدرة كهربائيةً من الأسلاك، وتخرج ميكانيكيةً على العمود، وبينهما يضيع جزء حرارةً.<br><b>مرّر المؤشر على الأسلاك والجسم والعمود والحرارة (أو المسه في الجوال) لتعرف معناها.</b>',
   side:[
    {add:String.raw`<p>إذا لمست جسم محرك مضخة أو مروحة بعد ساعة من التشغيل تجده دافئاً. هذه الحرارة جزء من الكهرباء التي دفعنا ثمنها ولم تتحول إلى حركة. هذا الدرس يتتبع القدرة من لحظة دخولها إلى المحرك حتى خروجها من العمود، ويحسب ما يضيع منها في كل مرحلة.</p>`},
    {predict:{q:String.raw`القدرة الداخلة إلى العضو الثابت \(P_{in}\) تعتمد قيمتها على…`,opts:[
     ['عدد أقطاب المحرك فقط',false,'عدد الأقطاب يحدد السرعة التزامنية، ولا يظهر في معادلة القدرة الداخلة (1-16).'],
     ['حمل المحرك: التيار ومعامل القدرة',true,String.raw`هذا نص الكتاب في ص 38؛ ولذلك في المعادلة (1-16) تظهر \(I\) و\(\cos\theta\) مع الجهد.`],
     ['سرعة المجال المغناطيسي الدوار',false,'السرعة لا تظهر في معادلة القدرة الداخلة (1-16)؛ تظهر فيها الجهود والتيارات ومعامل القدرة.']]}}
   ],
   body:[
    {book:String.raw`<p>عادةً ما يوصف المحرك الحثي ثلاثي الأوجه بأنه <b>محول دوار</b>، والدخل قدرة كهربائية في شكل جهود وتيارات ثلاثية الأوجه والخرج هو قدرة ميكانيكية تظهر على عمود الدوران.</p>
     <p>العلاقة بين القدرة الكهربائية الداخلة والقدرة الميكانيكية الخارجة موضحة في الشكل (1-18) الذي يصف كيفية انسياب القدرة داخل المحرك.</p>
     <p>القدرة الداخلة إلى العضو الثابت تعتمد قيمتها على حمل المحرك والمتمثل في التيار ومعامل القدرة، وتعطى من المعادلة:</p>
     <div class="eq">$$P_{in}=3\,V_{ph}I_{ph}\cos\theta$$</div>
     <div class="eq">$$P_{in}=\sqrt{3}\,V_LI_L\cos\theta$$<span class="eqno">(1-16)</span></div>
     <p>حيث: \(V_{ph}\) جهد الوجه للعضو الثابت؛ \(I_{ph}\) تيار الوجه للعضو الثابت؛ \(V_L\) جهد الخط للعضو الثابت؛ \(I_L\) تيار الخط للعضو الثابت؛ \(\theta\) الزاوية بين الجهد والتيار وجيب تمامها هو معامل القدرة.</p>`,ref:'ص 38'},
    {book:String.raw`<p>هذه القدرة الداخلة \(P_{in}\) سيفقد منها جزء في مقاومة ملفات العضو الثابت \(R_1\) على شكل حرارة وتسمى <b>مفاقيد نحاسية في العضو الثابت</b>، وتحسب من:</p>
     <div class="eq">$$P_{cu1}=3R_1I_{ph}^2$$<span class="eqno">(1-17)</span></div>`,ref:'ص 38'},
    {tip:String.raw`<p>الصيغتان في (1-16) تعطيان القدرة نفسها: الأولى بقيم <b>الوجه</b> مضروبة في 3 (ثلاثة أوجه)، والثانية بقيم <b>الخط</b> مضروبة في \(\sqrt3\). اختر الصيغة حسب ما يعطيك السؤال.</p>
     <p>وفي (1-17) الرقم 3 لأن لكل وجه ملفاً له مقاومة \(R_1\) يسخن بمرور تيار الوجه فيه.</p>`},
    {watch:String.raw`<p>لا تخلط القيم: إذا كتبت \(\sqrt3\) فاستعمل جهد الخط وتيار الخط معاً، وإذا كتبت 3 فاستعمل جهد الوجه وتيار الوجه معاً.</p>`}
   ]},

  {st:2,short:'مفاقيد الثابت و Pg',title:'مفاقيد العضو الثابت والقدرة المنتقلة عبر الثغرة الهوائية',ref:'ص 39',
   q:'بعد أن تأخذ ملفات العضو الثابت نصيبها حرارةً… أين يضيع جزء آخر قبل أن تعبر القدرة إلى العضو الدوار؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مقطع في محرك: العضو الثابت بملفاته وقلبه الحديدي، وأسهم صفراء تعبر الثغرة الهوائية إلى العضو الدوار" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><circle data-tip="القلب الحديدي للعضو الثابت: تضيع فيه القدرة ⟦Pcor⟧ (مفاقيد حديدية) بسبب التيارات الدوامية وظاهرة التخلف المغناطيسي، وتمثلها المقاومة ⟦Rc⟧ في الدائرة المكافئة." cx="180" cy="160" r="120" fill="#2C4A40"/><circle data-tip="الثغرة الهوائية: المسافة الصغيرة بين العضو الثابت والعضو الدوار. تعبرها القدرة ⟦Pg⟧." cx="180" cy="160" r="86" fill="#FBF6EE"/><g data-tip="ملفات العضو الثابت: لها مقاومة ⟦R1⟧ تسخن بمرور التيار، فتضيع فيها ⟦Pcu1⟧ (مفاقيد نحاسية في العضو الثابت)."><rect x="171" y="46" width="18" height="26" rx="4" fill="#E8735A" transform="rotate(0 180 160)"/><rect x="171" y="46" width="18" height="26" rx="4" fill="#E8735A" transform="rotate(90 180 160)"/><rect x="171" y="46" width="18" height="26" rx="4" fill="#E8735A" transform="rotate(180 180 160)"/><rect x="171" y="46" width="18" height="26" rx="4" fill="#E8735A" transform="rotate(270 180 160)"/></g><g data-tip="القدرة المنتقلة عبر الثغرة الهوائية من العضو الثابت إلى العضو الدوار ⟦Pg = Pin − Ps⟧، المعادلة (1-19)."><g transform="rotate(45 180 160)"><line x1="180" y1="52" x2="180" y2="74" stroke="#F2C14E" stroke-width="6" stroke-linecap="round"/><polygon points="180,90 170,72 190,72" fill="#F2C14E"/></g><g transform="rotate(135 180 160)"><line x1="180" y1="52" x2="180" y2="74" stroke="#F2C14E" stroke-width="6" stroke-linecap="round"/><polygon points="180,90 170,72 190,72" fill="#F2C14E"/></g><g transform="rotate(225 180 160)"><line x1="180" y1="52" x2="180" y2="74" stroke="#F2C14E" stroke-width="6" stroke-linecap="round"/><polygon points="180,90 170,72 190,72" fill="#F2C14E"/></g><g transform="rotate(315 180 160)"><line x1="180" y1="52" x2="180" y2="74" stroke="#F2C14E" stroke-width="6" stroke-linecap="round"/><polygon points="180,90 170,72 190,72" fill="#F2C14E"/></g></g><circle data-tip="العضو الدوار: تصل إليه القدرة ⟦Pg⟧، ويضيع جزء منها في مقاومة ملفاته ⟦R'2⟧ حرارةً ⟦Pcu2⟧، المعادلة (1-21)." cx="180" cy="160" r="74" fill="#CFE6DB" stroke="#2C4A40" stroke-width="3"/><g fill="#E9B949" stroke="#B9852A" stroke-width="1.5"><circle cx="242" cy="160" r="6"/><circle cx="223.8" cy="203.8" r="6"/><circle cx="180" cy="222" r="6"/><circle cx="136.2" cy="203.8" r="6"/><circle cx="118" cy="160" r="6"/><circle cx="136.2" cy="116.2" r="6"/><circle cx="180" cy="98" r="6"/><circle cx="223.8" cy="116.2" r="6"/></g><circle cx="180" cy="160" r="14" fill="#2C4A40"/><text x="180" y="304" text-anchor="middle" font-size="15" fill="#2C4A40" direction="ltr" font-family="var(--mono)">P<tspan font-size="11" dy="4">s</tspan><tspan dy="-4"> = P</tspan><tspan font-size="11" dy="4">cu1</tspan><tspan dy="-4"> + P</tspan><tspan font-size="11" dy="4">cor</tspan></text></svg>`,
   cap:'الملفات البرتقالية تسخن، والقلب الحديدي الداكن يسخن أيضاً، والباقي يعبر الثغرة (الأسهم الصفراء) إلى العضو الدوار.<br><b>مرّر المؤشر على الملفات والقلب والأسهم والعضو الدوار (أو المسه في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'أيّ هذه المفاقيد لا يحدث في العضو الثابت؟',opts:[
     [String.raw`المفاقيد النحاسية \(P_{cu1}\)`,false,String.raw`هذه في مقاومة ملفات العضو الثابت \(R_1\)، فهي من مفاقيد العضو الثابت.`],
     [String.raw`المفاقيد الحديدية \(P_{cor}\)`,false,'هذه في القلب الحديدي للعضو الثابت، فهي من مفاقيد العضو الثابت أيضاً.'],
     [String.raw`المفاقيد النحاسية \(P_{cu2}\)`,true,String.raw`هذه تحدث بعد عبور الثغرة، في مقاومة ملفات العضو الدوار \(R'_2\)، المعادلة (1-21).`]]}}
   ],
   body:[
    {book:String.raw`<p>الجزء المتبقي من \(P_{in}\) سيفقد جزء منه في القلب الحديدي للعضو الثابت وذلك بسبب وجود التيارات الدوامية وظاهرة التخلف المغناطيسي وتسمى <b>مفاقيد حديدية</b> \(P_{cor}\). هذه القدرة المفقودة تمثلها المقاومة \(R_c\) في الدائرة المكافئة.</p>
     <p>مجموع هذين النوعين (المفاقيد النحاسية في \(R_1\) والحديدية في \(R_c\)) يسمى <b>مفاقيد العضو الثابت</b> ويرمز لها \(P_S\):</p>
     <div class="eq">$$P_S=P_{cu1}+P_{cor}$$<span class="eqno">(1-18)</span></div>
     <p>الجزء المتبقي من \(P_{in}\) ينتقل عبر الثغرة الهوائية إلى العضو الدوار ويسمى <b>القدرة المنتقلة عبر الثغرة الهوائية من العضو الثابت إلى العضو الدوار</b> ويرمز لها \(P_g\):</p>
     <div class="eq">$$P_g=P_{in}-P_S$$<span class="eqno">(1-19)</span></div>
     <p>ويمكن حسابها أيضاً من:</p>
     <div class="eq">$$P_g=3\frac{R'_2}{S}I'^2_2$$<span class="eqno">(1-20)</span></div>
     <p>القدرة الداخلة إلى العضو الدوار \(P_g\) سيفقد جزء منها في مقاومة ملفات العضو الدوار على شكل حرارة وتسمى <b>مفاقيد نحاسية في العضو الدوار</b>:</p>
     <div class="eq">$$P_{cu2}=3R'_2I'^2_2$$<span class="eqno">(1-21)</span></div>`,ref:'ص 39'},
    {tip:String.raw`<p>فكّر في القدرة كماء يمر في أنبوب له تسربات: يدخل \(P_{in}\)، ويتسرب منه في العضو الثابت \(P_{cu1}\) و\(P_{cor}\) (معاً \(P_S\))، والباقي \(P_g\) يعبر الثغرة إلى العضو الدوار. ولهذا تحسب \(P_g\) بالطرح في (1-19).</p>
     <p>في مثال (1-7) يعطيك الكتاب مفاقيد العضو الثابت مجموعةً \(P_S = 1\ \text{kW}\)، فلا تحتاج حساب كل نوع وحده.</p>`},
    {watch:String.raw`<p>في (1-20) تُقسم \(R'_2\) على الانزلاق \(S\)، أما في (1-21) فلا تُقسم. الفرق بين المعادلتين هو قلب الدرس كله، كما سترى في المحطة الرابعة.</p>`}
   ]},

  {st:3,short:'Pm و Po',title:'القدرة الميكانيكية المتحولة والقدرة الخارجة',ref:'ص 40',
   q:'وصلت القدرة إلى العضو الدوار وتحولت إلى حركة… هل كل هذه الحركة تصل إلى الحمل؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="العضو الدوار على عموده بين كرسيي تحميل، تدخله القدرة الميكانيكية المتحولة ويخرج من طرف العمود ما بقي بعد الاحتكاك" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><rect data-tip="عمود الدوران: ينقل الحركة من العضو الدوار إلى الحمل." x="34" y="152" width="292" height="16" rx="5" fill="#E9B949" stroke="#B9852A" stroke-width="1.5"/><g data-tip="العضو الدوار: فيه تتحول القدرة من كهربائية إلى ميكانيكية، وتسمى القدرة الميكانيكية المتحولة ⟦Pm⟧. وأثناء دورانه يحتك بالهواء."><rect x="122" y="104" width="116" height="112" rx="12" fill="#CFE6DB" stroke="#2C4A40" stroke-width="3"/><g stroke="#E9B949" stroke-width="5"><line x1="140" y1="112" x2="140" y2="208"/><line x1="160" y1="112" x2="160" y2="208"/><line x1="180" y1="112" x2="180" y2="208"/><line x1="200" y1="112" x2="200" y2="208"/><line x1="220" y1="112" x2="220" y2="208"/></g></g><g data-tip="كرسي تحميل (رولمان): يحمل العمود ويحتك به، فيضيع جزء من القدرة الميكانيكية. مفاقيد الاحتكاك يرمز لها ⟦PF⟧."><rect x="70" y="134" width="26" height="52" rx="7" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><circle cx="83" cy="146" r="4" fill="#2C4A40"/><circle cx="83" cy="174" r="4" fill="#2C4A40"/></g><g data-tip="كرسي تحميل (رولمان): يحمل العمود ويحتك به، فيضيع جزء من القدرة الميكانيكية. مفاقيد الاحتكاك يرمز لها ⟦PF⟧."><rect x="264" y="134" width="26" height="52" rx="7" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><circle cx="277" cy="146" r="4" fill="#2C4A40"/><circle cx="277" cy="174" r="4" fill="#2C4A40"/></g><g data-tip="القدرة الميكانيكية الخارجة ⟦Po⟧: ما يبقى على طرف العمود بعد خصم الاحتكاك، وهي التي تدير الحمل."><rect x="300" y="190" width="56" height="40" fill="transparent"/><line x1="306" y1="200" x2="338" y2="200" stroke="#12855A" stroke-width="6" stroke-linecap="round"/><polygon points="352,200 336,190 336,210" fill="#12855A"/></g><text x="180" y="88" text-anchor="middle" font-size="17" fill="#2C4A40" direction="ltr" font-family="var(--mono)">P<tspan font-size="12" dy="4">m</tspan></text><text x="83" y="212" text-anchor="middle" font-size="15" fill="#2C4A40" direction="ltr" font-family="var(--mono)">P<tspan font-size="11" dy="4">F</tspan></text><text x="277" y="122" text-anchor="middle" font-size="15" fill="#2C4A40" direction="ltr" font-family="var(--mono)">P<tspan font-size="11" dy="4">F</tspan></text><text x="326" y="246" text-anchor="middle" font-size="16" fill="#2C4A40" direction="ltr" font-family="var(--mono)">P<tspan font-size="11" dy="4">o</tspan></text><text x="180" y="290" text-anchor="middle" font-size="16" fill="#2C4A40" direction="ltr" font-family="var(--mono)">P<tspan font-size="11" dy="4">o</tspan><tspan dy="-4"> = P</tspan><tspan font-size="11" dy="4">m</tspan><tspan dy="-4"> − P</tspan><tspan font-size="11" dy="4">F</tspan></text></svg>`,
   cap:'العضو الدوار يحوّل القدرة إلى حركة، وكرسيا التحميل والهواء يأخذان نصيبهما احتكاكاً، والباقي يخرج من طرف العمود (السهم الأخضر).<br><b>مرّر المؤشر على العضو الدوار وكرسيي التحميل والسهم الأخضر (أو المسه في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'أيّ مقاومة في الدائرة المكافئة تمثل القدرة الميكانيكية المتحولة؟',opts:[
     [String.raw`\(R'_2\left(\frac{1-S}{S}\right)\)`,true,'هذا نص الكتاب في ص 40: المقاومة التي تتغير بالانزلاق تمثل الحمل الميكانيكي، فالقدرة فيها هي القدرة المتحولة إلى حركة.'],
     [String.raw`\(R_1\)`,false,String.raw`\(R_1\) مقاومة ملفات العضو الثابت، والقدرة فيها حرارة \(P_{cu1}\).`],
     [String.raw`\(R_c\)`,false,String.raw`\(R_c\) تمثل المفاقيد الحديدية في القلب \(P_{cor}\).`]]}}
   ],
   body:[
    {book:String.raw`<p>الجزء المتبقي يتحول من قدرة كهربائية إلى قدرة ميكانيكية ويسمى <b>القدرة الميكانيكية المتحولة</b> \(P_m\):</p>
     <div class="eq">$$P_m=P_g-P_{cu2}$$<span class="eqno">(1-22)</span></div>
     <p>المقاومة \(R'_2\left(\frac{1-S}{S}\right)\) في الدائرة المكافئة هي التي تمثل القدرة الميكانيكية المتحولة، وبالتالي:</p>
     <div class="eq">$$P_m=3R'_2\frac{(1-S)}{S}I'^2_2$$<span class="eqno">(1-23)</span></div>
     <p>\(P_m\) سيفقد جزء منها بسبب الاحتكاك الذي يتعرض له العضو الدوار مع الهواء وكراسي التحميل. مفاقيد الاحتكاك يرمز لها \(P_F\). القدرة الميكانيكية الخارجة \(P_o\) هي المتبقي بعد خصم الاحتكاك:</p>
     <div class="eq">$$P_o=P_m-P_F$$<span class="eqno">(1-24)</span></div>`,ref:'ص 40'},
    {tip:String.raw`<p>\(P_m\) هي القدرة التي «صُنعت» حركةً داخل العضو الدوار، و\(P_o\) هي ما يستلمه الحمل فعلاً. الفرق بينهما احتكاك فقط \(P_F\).</p>
     <p>وعلى لوحة بيانات المحرك تُكتب القدرة الخارجة \(P_o\)، وهي القدرة التي تختار بها المحرك المناسب للحمل.</p>`},
    {watch:String.raw`<p>لا تخلط بين \(P_m\) و\(P_o\): في مثال (1-7) \(P_m = 38.064\ \text{kW}\) لكن \(P_o = 36.064\ \text{kW}\) بعد خصم احتكاك قدره \(2\ \text{kW}\).</p>`}
   ]},

  {st:4,short:'مخطط القدرة والكفاءة',title:'مخطط سريان القدرة، ودور الانزلاق في الكفاءة',ref:'ص 41–42',
   q:'القدرة التي تعبر الثغرة تنقسم إلى حرارة وحركة… فما الذي يقرر نصيب كل منهما؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مخطط سريان القدرة: عمود رأسي من القدرة الداخلة إلى القدرة الخارجة، وفروع إلى اليمين للمفاقيد" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><rect x="204" y="62" width="140" height="196" rx="10" fill="none" stroke="#2C4A40" stroke-width="1.5" stroke-dasharray="5 4"/><text x="274" y="54" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">القدرة المفقودة في المحرك</text><g data-tip="الجزء الخاص بالعضو الثابت: تدخل ⟦Pin⟧ ويتفرع منها ⟦Pcu1⟧ و⟦Pcor⟧، فيبقى ⟦Pg⟧."><rect x="140" y="34" width="44" height="54" fill="#4FB3A9"/><rect x="140" y="88" width="38" height="28" fill="#4FB3A9"/><rect x="140" y="116" width="32" height="40" fill="#4FB3A9"/></g><g data-tip="الجزء الخاص بالعضو الدوار: تدخله ⟦Pg⟧ ويتفرع منها ⟦Pcu2⟧ فيبقى ⟦Pm⟧، ثم يتفرع ⟦PF⟧ فيبقى ⟦Po⟧."><rect x="140" y="156" width="32" height="40" fill="#12855A"/><rect x="140" y="196" width="26" height="46" fill="#12855A"/><rect x="140" y="242" width="20" height="30" fill="#12855A"/><polygon points="132,272 168,272 150,292" fill="#12855A"/></g><line data-tip="الخط المنقط عند مستوى ⟦Pg⟧ يفصل بين العضو الثابت (فوقه) والعضو الدوار (تحته)." x1="40" y1="156" x2="200" y2="156" stroke="#2C4A40" stroke-width="2" stroke-dasharray="5 4"/><g data-tip="المفاقيد النحاسية في العضو الثابت ⟦Pcu1⟧، المعادلة (1-17)."><rect x="184" y="78" width="34" height="10" fill="#E8735A"/><polygon points="230,83 216,74 216,92" fill="#E8735A"/></g><g data-tip="المفاقيد الحديدية ⟦Pcor⟧ في قلب العضو الثابت."><rect x="178" y="106" width="40" height="10" fill="#E8735A"/><polygon points="230,111 216,102 216,120" fill="#E8735A"/></g><g data-tip="المفاقيد النحاسية في العضو الدوار ⟦Pcu2 = S·Pg⟧، المعادلة (1-25)."><rect x="172" y="186" width="46" height="10" fill="#E8735A"/><polygon points="230,191 216,182 216,200" fill="#E8735A"/></g><g data-tip="مفاقيد الاحتكاك ⟦PF⟧ مع الهواء وكراسي التحميل."><rect x="166" y="232" width="52" height="10" fill="#E8735A"/><polygon points="230,237 216,228 216,246" fill="#E8735A"/></g><g font-family="var(--mono)" font-size="14" fill="#2C4A40" direction="ltr"><text x="240" y="88">P<tspan font-size="10" dy="4">cu1</tspan></text><text x="240" y="116">P<tspan font-size="10" dy="4">cor</tspan></text><text x="240" y="196">P<tspan font-size="10" dy="4">cu2</tspan></text><text x="240" y="242">P<tspan font-size="10" dy="4">F</tspan></text><text x="306" y="102">P<tspan font-size="10" dy="4">s</tspan></text></g><path data-tip="⟦Ps⟧: مجموع مفاقيد العضو الثابت ⟦Pcu1 + Pcor⟧، المعادلة (1-18)." d="M292 76 h6 v42 h-6" fill="none" stroke="#2C4A40" stroke-width="2"/><g font-family="var(--mono)" font-size="15" fill="#2C4A40" font-weight="700" direction="ltr" text-anchor="end"><text x="132" y="58">P<tspan font-size="11" dy="4">in</tspan></text><text x="132" y="176">P<tspan font-size="11" dy="4">g</tspan></text><text x="132" y="224">P<tspan font-size="11" dy="4">m</tspan></text><text x="126" y="290">P<tspan font-size="11" dy="4">o</tspan></text></g><text x="70" y="124" text-anchor="middle" font-size="12" fill="#2C4A40">العضو الثابت</text><text x="70" y="196" text-anchor="middle" font-size="12" fill="#2C4A40">العضو الدوار</text></svg>`,
   cap:'رسم مبسط للشكل <span class="ltr">(1-18)</span>: العمود يضيق كلما خرج منه فرع مفقود، والخط المنقط يفصل العضو الثابت عن العضو الدوار.<br><b>مرّر المؤشر على العمود والفروع والخط المنقط (أو المسه في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>يلاحظ أن المفاقيد الحديدية في العضو الدوار مهملة وذلك لارتباطها بتردد تيارات العضو الدوار.</p>
     <p>من المعادلات (1-20) و(1-21) و(1-23) يمكن إجراء المقارنة التالية:</p>
     <table class="tt"><thead><tr><th>\(P_g\)</th><th>\(P_m\)</th><th>\(P_{Cu2}\)</th></tr></thead><tbody><tr><td>\(3\frac{R'_2}{S}I'^2_2\)</td><td>\(3R'_2\frac{(1-S)}{S}I'^2_2\)</td><td>\(3R'_2I'^2_2\)</td></tr></tbody></table>`,ref:'ص 41'}
   ],
   body:[
    {book:String.raw`<p>نلاحظ من المقارنة أعلاه أنه عند ضرب \(P_g\) بالانزلاق \(S\) فإننا نحصل على \(P_{Cu2}\):</p>
     <div class="eq">$$P_{cu2}=S\,P_g$$<span class="eqno">(1-25)</span></div>
     <p>وكذلك عند ضرب \(P_g\) بالمعامل \((1-S)\) نحصل على \(P_m\):</p>
     <div class="eq">$$P_m=(1-S)\,P_g$$<span class="eqno">(1-26)</span></div>
     <p>يتضح من هذا أن معامل الانزلاق \(S\) يلعب دوراً مهماً جداً في تحديد نسبة المفاقيد النحاسية في العضو الدوار \(P_{Cu2}\)، فعند زيادة الانزلاق تزداد المفاقيد النحاسية في العضو الدوار وبالتالي <b>يجب أن يكون الانزلاق صغيراً بقدر الإمكان</b> لكي تقل المفاقيد النحاسية في العضو الدوار وبالتالي تزداد كفاءة المحرك.</p>
     <p>إذا عُرفت القدرة الداخلة والخارجة تحسب الكفاءة:</p>
     <div class="eq">$$\eta_{\%}=\frac{P_o}{P_{in}}\times 100$$<span class="eqno">(1-27)</span></div>`,ref:'ص 41–42'},
    {title:'غيّر الانزلاق وشاهد أين تذهب القدرة بأرقام مثال (1-7)',widget:(el,B)=>{
      const Pin=40,Ps=1,PF=2,Pg=Pin-Ps;let S=0.024;
      const fm=(x,d)=>{let s=(+x).toFixed(d);if(s.indexOf('.')>=0)s=s.replace(/0+$/,'').replace(/\.$/,'');return s};
      el.innerHTML=`<p class="sub" style="margin:0 0 6px">من مثال <span class="ltr">(1-7)</span>: القدرة الداخلة <span class="ltr">40 kW</span>، ومفاقيد العضو الثابت <span class="ltr">1 kW</span>، والاحتكاك <span class="ltr">2 kW</span>، فتكون <span class="ltr">P<sub>g</sub> = 39 kW</span>. حرّك الانزلاق وحده وانظر كيف تنقسم <span class="ltr">P<sub>g</sub></span>.</p>
       <label class="w-sl"><span>معامل الانزلاق <span class="ltr">S = <b data-o="S"></b></span></span><input type="range" min="0" max="0.2" step="0.002" dir="ltr" value="${S}"></label>
       <div class="w-row"><button class="btn" type="button" data-s="0.024">قيمة مثال <span class="ltr">(1-7)</span> <span class="ltr">S = 0.024</span></button></div>
       <div class="spd" dir="ltr"><div class="spd-bar"><i class="spd-n"></i><i class="spd-gap"></i></div><div class="spd-ax"><span>0</span><span>P<sub>g</sub> = 39 kW</span></div></div>
       <p class="sub" style="margin-top:4px">الأخضر = القدرة الميكانيكية المتحولة <span class="ltr">P<sub>m</sub></span>، والأصفر = المفاقيد النحاسية في العضو الدوار <span class="ltr">P<sub>cu2</sub></span>.</p>
       <div class="w-facts"><div><span>المفاقيد النحاسية <bdi dir="ltr">(1-25)</bdi></span><b data-o="cu"></b></div><div><span>المتحولة <bdi dir="ltr">(1-26)</bdi></span><b data-o="pm"></b></div><div><span>الخارجة <bdi dir="ltr">(1-24)</bdi></span><b data-o="po"></b></div><div><span>الكفاءة <bdi dir="ltr">(1-27)</bdi></span><b data-o="eta"></b></div></div>`;
      const o=k=>el.querySelector(`[data-o="${k}"]`),rg=el.querySelector('input');
      const draw=()=>{const cu=S*Pg,pm=(1-S)*Pg,po=pm-PF;o('S').textContent=fm(S,3);o('cu').textContent=fm(cu,3)+' kW';o('pm').textContent=fm(pm,3)+' kW';o('po').textContent=fm(po,3)+' kW';o('eta').textContent=fm(po/Pin*100,2)+' %';
        el.querySelector('.spd-n').style.width=(1-S)*100+'%';el.querySelector('.spd-gap').style.width=S*100+'%'};
      rg.oninput=()=>{S=+rg.value;draw()};
      el.querySelector('[data-s]').onclick=()=>{S=0.024;rg.value=S;draw()};
      draw();
    }},
    {tip:String.raw`<p>من (1-25) و(1-26): \(P_g\) تنقسم دائماً بنسبة الانزلاق. جزء \(S\) منها يصير حرارة في العضو الدوار، والجزء \((1-S)\) يصير حركة. فالمحرك الذي انزلاقه صغير يحوّل أغلب \(P_g\) إلى حركة.</p>`},
    {predict:{q:String.raw`في مثال (1-6) القدرة الداخلة إلى العضو الدوار \(80\ \text{kW}\) والانزلاق \(0.0334\). كم المفاقيد النحاسية في العضو الدوار؟`,opts:[
     [String.raw`<span class="ltr">77.33 kW</span>`,false,String.raw`هذه \(P_m=(1-S)P_g\)، أي الجزء الذي صار حركة، وليست المفاقيد.`],
     [String.raw`<span class="ltr">80 kW</span>`,false,String.raw`هذه \(P_g\) نفسها قبل أن تنقسم.`],
     [String.raw`<span class="ltr">0.0334 kW</span>`,false,'هذا الانزلاق نفسه، ويجب ضربه في القدرة.'],
     [String.raw`<span class="ltr">2.67 kW</span>`,true,String.raw`\(P_{cu2}=S\,P_g=0.0334\times 80=2.67\ \text{kW}\) من المعادلة (1-25)، كما في حل الكتاب.`]]}},
    {watch:String.raw`<p>المعادلتان (1-25) و(1-26) تُستعملان مع \(P_g\)، لا مع \(P_{in}\). اطرح مفاقيد العضو الثابت أولاً بالمعادلة (1-19) ثم اضرب في \(S\) أو \((1-S)\).</p>`}
   ]},

  {st:5,short:'الأمثلة',title:'أمثلة محلولة',ref:'ص 43–45',
   q:'مثالان من الكتاب يتتبعان القدرة خطوة خطوة. الحل الكامل في تبويب «الأمثلة المحلولة».',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="لوحة بيانات توضيحية بأرقام مثال (1-7): ثمانية أقطاب، 50 هرتز، 732 لفة في الدقيقة، القدرة الداخلة 40 كيلوواط" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><rect x="64" y="70" width="232" height="186" rx="14" fill="#F1EBDD" stroke="#2C4A40" stroke-width="4"/><path data-tip="محرك حثي ثلاثي الأوجه (INDUCTION MOTOR)، والرمز ⟦3~⟧ يعني تياراً متردداً ثلاثي الأوجه." d="M64 84 a14 14 0 0 1 14 -14 h204 a14 14 0 0 1 14 14 v28 h-232z" fill="#2C4A40"/><text x="180" y="98" text-anchor="middle" font-size="14" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">3~ INDUCTION MOTOR</text><rect data-tip="عدد الأقطاب (POLES): ⟦p = 8⟧، ومعه التردد تحسب السرعة التزامنية من المعادلة (1-1)." x="86" y="123" width="190" height="24" fill="transparent"/><text x="94" y="140" font-size="14" fill="#2C4A40" font-family="var(--mono)" direction="ltr">POLES</text><text x="268" y="140" text-anchor="end" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">8</text><line x1="94" y1="149" x2="268" y2="149" stroke="#CFC6B4" stroke-width="1"/><rect data-tip="تردد المصدر (f): ⟦fs = 50 Hz⟧." x="86" y="149" width="190" height="24" fill="transparent"/><text x="94" y="166" font-size="14" fill="#2C4A40" font-family="var(--mono)" direction="ltr">f</text><text x="268" y="166" text-anchor="end" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">50 Hz</text><line x1="94" y1="175" x2="268" y2="175" stroke="#CFC6B4" stroke-width="1"/><rect data-tip="سرعة العضو الدوار (n): 732 rpm، أقل قليلاً من السرعة التزامنية بسبب الانزلاق." x="86" y="175" width="190" height="24" fill="transparent"/><text x="94" y="192" font-size="14" fill="#2C4A40" font-family="var(--mono)" direction="ltr">n</text><text x="268" y="192" text-anchor="end" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">732 rpm</text><line x1="94" y1="201" x2="268" y2="201" stroke="#CFC6B4" stroke-width="1"/><rect data-tip="القدرة الداخلة إلى المحرك (Pin): 40 kW. ومن نص المثال أيضاً: مفاقيد العضو الثابت 1 kW والاحتكاك 2 kW." x="86" y="201" width="190" height="24" fill="transparent"/><text x="94" y="218" font-size="14" fill="#2C4A40" font-family="var(--mono)" direction="ltr">P<tspan font-size="10" dy="4">in</tspan></text><text x="268" y="218" text-anchor="end" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">40 kW</text><circle cx="78" cy="124" r="5" fill="#2C4A40"/><circle cx="282" cy="124" r="5" fill="#2C4A40"/><circle cx="78" cy="244" r="5" fill="#2C4A40"/><circle cx="282" cy="244" r="5" fill="#2C4A40"/></svg>`,
   cap:'لوحة بيانات توضيحية بأرقام مثال <span class="ltr">(1-7)</span>.<br><b>مرّر المؤشر على أي سطر في اللوحة (أو المسه في الجوال) لتعرف معناه.</b>',
   side:[
    {html:String.raw`<div class="exl">
     <div class="exc"><header>مثال (1-6) <span class="ref">ص 43–44</span></header>
      <div class="kv-row"><small>المعطيات</small><span class="kv">6 أقطاب</span><span class="kv ltr">\(f_s=50\ \text{Hz}\)</span><span class="kv ltr">\(P_g=80\ \text{kW}\)</span><span class="kv ltr">\(f_r=1.67\ \text{Hz}\)</span><span class="kv ltr">\(I'_2=65\ \text{A}\)</span></div>
      <div class="kv-row"><small>النتائج</small><span class="kv res ltr">\(S=0.0334\)</span><span class="kv res ltr">\(n=966.6\ \text{rpm}\)</span><span class="kv res ltr">\(P_m=77.33\ \text{kW}\)</span><span class="kv res ltr">\(P_{cu2}=2.67\ \text{kW}\)</span><span class="kv res ltr">\(R'_2=0.21\ \Omega\)</span></div></div>
     <div class="exc"><header>مثال (1-7) <span class="ref">ص 44–45</span></header>
      <div class="kv-row"><small>المعطيات</small><span class="kv">8 أقطاب</span><span class="kv ltr">\(f_s=50\ \text{Hz}\)</span><span class="kv ltr">\(n=732\ \text{rpm}\)</span><span class="kv ltr">\(P_{in}=40\ \text{kW}\)</span><span class="kv ltr">\(P_s=1\ \text{kW}\)</span><span class="kv ltr">\(P_F=2\ \text{kW}\)</span></div>
      <div class="kv-row"><small>النتائج</small><span class="kv res ltr">\(S=0.024\)</span><span class="kv res ltr">\(P_o=48.343\ \text{hp}\)</span><span class="kv res ltr">\(P_{cu2}=0.936\ \text{kW}\)</span><span class="kv res ltr">\(\eta=90.16\%\)</span></div></div>
     <div class="w-row"><button class="btn pri" type="button" onclick="var b=document.querySelector('.ltabs button[data-tab=examples]');if(b)b.click()">افتح الأمثلة المحلولة وغيّر الأرقام</button></div></div>`}
   ],
   body:[
    {predict:{q:String.raw`في مثال (1-6) الجهد <span class="ltr">440 V</span> معطى في السؤال. هل يدخل في الحل؟`,opts:[
     ['نعم، في حساب الانزلاق',false,String.raw`الانزلاق يحسب من الترددين فقط: \(S=f_r/f_s\).`],
     ['لا، الحل كله من التردد والقدرة والتيار',true,'الجهد معطى ولا يُستخدم في أي فرع من الحل، وهذا ليس خطأً في الكتاب.'],
     ['نعم، في حساب المفاقيد النحاسية',false,String.raw`المفاقيد تحسب من \(P_{cu2}=S\,P_g\) ولا يظهر فيها الجهد.`]]}},
    {watch:String.raw`<p>في حل مثال (1-7) ص 44 طُبع: \(n_s=\frac{120\times 50}{8}=732\ rpm\)، والصحيح <b><span class="ltr">750 rpm</span></b> (\(6000\div 8=750\)). والكتاب نفسه يستعمل 750 في السطر التالي \(S=\frac{750-732}{750}\)، لذلك بقية النتائج صحيحة ولا تتأثر.</p>`,fix:true},
    {tip:String.raw`<p>في مثال (1-7) يحوّل الكتاب الكيلوواط إلى حصان بالقسمة على <span class="ltr">0.746</span>: \(36.064\div 0.746=48.343\ \text{hp}\).</p>`}
   ]},

  {recap:[
   String.raw`القدرة الداخلة، المعادلة (1-16): \(P_{in}=\sqrt3\,V_LI_L\cos\theta\)، ويضيع منها في العضو الثابت \(P_S=P_{cu1}+P_{cor}\)، المعادلة (1-18).`,
   String.raw`ما يعبر الثغرة الهوائية إلى العضو الدوار، المعادلة (1-19): \(P_g=P_{in}-P_S\)`,
   String.raw`\(P_g\) تنقسم بالانزلاق: المعادلة (1-25) \(P_{cu2}=S\,P_g\) والمعادلة (1-26) \(P_m=(1-S)\,P_g\)؛ لذلك يجب أن يكون الانزلاق صغيراً.`,
   String.raw`القدرة الخارجة، المعادلة (1-24): \(P_o=P_m-P_F\)، والكفاءة، المعادلة (1-27): \(\eta_\%=\frac{P_o}{P_{in}}\times100\)`]}
 ],
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
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'في حل مثال (1-7) ص 44 طُبع: \\(n_s = \\frac{120\\times 50}{8} = 732\\ rpm\\)، والصحيح <b><span class="ltr">750 rpm</span></b> (‏<span class="ltr">6000 ÷ 8 = 750</span>). والكتاب نفسه يستعمل <span class="ltr">750</span> في السطر التالي \\(S=\\frac{750-732}{750}\\)، لذلك بقية النتائج صحيحة ولا تتأثر. الحاسبة تعرض 750.'+'</div>'},
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
    {t:'أ) نحسب أولاً السرعة التزامنية من المعادلة (1-1) <span class="fixnote">(الكتاب طبع هنا 732 خطأً، انظر الملاحظة)</span>:',f:`n_s=\\frac{120 f_s}{p}=\\frac{120\\times ${g.f}}{${g.p}}`,v:ns,unit:'rpm'},
    {t:'ثم الانزلاق من المعادلة (1-3):',f:`S=\\frac{n_s-n}{n_s}=\\frac{${fm(ns)}-${g.n}}{${fm(ns)}}`,v:S,final:true},
    {t:'ب) بتتبع مسار انتقال القدرة داخل المحرك في الشكل (1-18):',f:`P_g=P_{in}-P_s=${g.Pin}-${g.Ps}`,v:Pg,unit:'kW'},
    {t:'',f:`P_m=(1-S)P_g=(1-${S})\\times ${fm(Pg)}`,v:Pm,unit:'kW'},
    {t:'',f:`P_o=P_m-P_F=${fm(Pm)}-${g.PF}`,v:Po,unit:'kW'},
    {t:'القدرة الخارجة بالحصان:',f:`P_o(hp)=\\frac{${fm(Po)}}{0.746}`,v:hp,unit:'hp',final:true},
    {t:'جـ) المفاقيد النحاسية في العضو الدوار من المعادلة (1-25):',f:`P_{cu2}=S\\,P_g=${S}\\times ${fm(Pg)}`,v:Pc,unit:'kW',final:true},
    {t:'د) كفاءة المحرك (1-27):',f:`\\eta_{\\%}=\\frac{P_o}{P_{in}}\\times100=\\frac{${fm(Po)}}{${g.Pin}}\\times 100`,v:eta,unit:'%',final:true}]},
   note:'<span class="fixnote"><b>ملاحظة على الكتاب:</b> في ص 44 طُبع <span class="ltr">n<sub>s</sub> = 120×50/8 = 732 rpm</span>، والصحيح <span class="ltr">750 rpm</span>؛ الكتاب نفسه يستعمل 750 في السطر التالي، فبقية النتائج صحيحة ولا تتأثر. الحاسبة تعرض 750.</span>'}
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
 stations:[
  {intro:true},

  {st:1,short:'العزم',title:'العزم في المحرك الحثي',ref:'ص 45',
   q:'المحرك يُشترى ليدير شيئاً… فما الكمية التي تخبرنا بقوة الإدارة، وكيف نحسبها من القدرة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ذراع مثبت على عمود، وقوة تدفع طرف الذراع إلى الأسفل فيدور العمود حول مركزه" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="العمود: يدور حول مركزه عندما تؤثر عليه قوة بعيدة عن المركز."><circle cx="130" cy="160" r="34" fill="#2C4A40"/></g><rect data-tip="ذراع مثبت على العمود: القوة على طرفه تنتج دوراناً. هذا الأثر الدوراني هو العزم." x="130" y="152" width="160" height="16" rx="5" fill="#E9B949" stroke="#B9852A" stroke-width="1.5"/><circle data-tip="مركز الدوران: النقطة التي يدور حولها الجسم." cx="130" cy="160" r="8" fill="#FBF6EE"/><g data-tip="القوة المؤثرة على طرف الذراع."><rect x="268" y="170" width="28" height="84" fill="transparent"/><line x1="282" y1="174" x2="282" y2="236" stroke="#E8735A" stroke-width="6" stroke-linecap="round"/><polygon points="282,254 270,232 294,232" fill="#E8735A"/></g><g data-tip="اتجاه الدوران الناتج عن القوة."><path d="M130 216 A56 56 0 0 1 74 160" fill="none" stroke="#12855A" stroke-width="5" stroke-linecap="round"/><polygon points="74,146 63,166 85,166" fill="#12855A"/></g><g data-tip="بُعد القوة عن مركز الدوران: كلما زاد زاد الأثر الدوراني للقوة نفسها (إضافة للتوضيح)."><line x1="130" y1="132" x2="282" y2="132" stroke="#2C4A40" stroke-width="1.5"/><line x1="130" y1="125" x2="130" y2="139" stroke="#2C4A40" stroke-width="1.5"/><line x1="282" y1="125" x2="282" y2="139" stroke="#2C4A40" stroke-width="1.5"/><rect x="150" y="104" width="112" height="32" fill="transparent"/></g><text x="206" y="124" text-anchor="middle" font-size="13" fill="#2C4A40">بُعد القوة عن المركز</text><text x="282" y="276" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">قوة</text><text x="62" y="234" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">دوران</text><text x="180" y="304" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">قوة تُدير الجسم حول مركزه = عزم</text></svg>`,
   cap:'قوة على طرف الذراع تدير العمود حول مركزه، وهذا الأثر الدوراني هو العزم.<br><b>مرّر المؤشر على أجزاء الرسمة (أو المسه في الجوال) لتعرف معناها.</b>',
   side:[
    {add:String.raw`<p>عندما تفك صامولة بمفتاح طويل تحتاج قوة أقل مما تحتاجه بمفتاح قصير. القوة نفسها تعطي أثراً دورانياً أكبر كلما بعدت عن المركز. هذا الأثر الدوراني هو <b>العزم</b>، وهو ما «يشعر» به الحمل الموصول بعمود المحرك.</p>`},
    {predict:{q:String.raw`لماذا يفضّل الكتاب حساب العزم من \(P_g\) و\(\omega_s\) بدلاً من \(P_m\) و\(\omega\)؟`,opts:[
     ['لأن القدرة الميكانيكية المتحولة لا يمكن حسابها',false,String.raw`يمكن حسابها من (1-26)، لكن السبب في السرعة لا في القدرة.`],
     ['لأن سرعة العمود تتغير بتغير الحمل، أما السرعة التزامنية فثابتة',true,'هذا تعليل الكتاب في ص 45.'],
     ['لأن العزمين مختلفان، والعزم الصحيح هو الثاني فقط',false,String.raw`العزمان متساويان: \(P_m=(1-S)P_g\) و\(\omega=(1-S)\omega_s\) فيختصر العامل \((1-S)\).`]]}}
   ],
   body:[
    {book:String.raw`<p>العزم أو عزم الدوران (Torque) هو القوة المؤثرة على جسم ما فينتج عنها دوران ذلك الجسم حول مركزه، ويقاس بوحدة نيوتن متر Nm، هذا هو التعريف العام للعزم.</p>
     <p>أما العزم الذي يؤثر على عمود الدوران في المحرك الحثي ثلاثي الأوجه فهو حاصل قسمة القدرة الميكانيكية المتحولة \(P_m\) على السرعة الزاوية لدوران العمود:</p>
     <div class="eq">$$T=\frac{P_m}{\omega}\quad Nm$$<span class="eqno">(1-28)</span></div>
     <p>حيث \(\omega\) السرعة الزاوية للعمود، و \(T\) العزم الميكانيكي الناشئ على عمود الدوران.</p>
     <p>وحيث أن السرعة الزاوية لعمود الدوران متغيرة بتغير الحمل، لذلك يفضل استخدام <b>السرعة التزامنية الزاوية</b> بدلاً منها، ولكن نستخدم معها القدرة المنتقلة خلال الثغرة الهوائية \(P_g\) بدلاً من استخدام القدرة الميكانيكية المتحولة \(P_m\):</p>
     <div class="eq">$$T=\frac{P_g}{\omega_s}\quad Nm$$<span class="eqno">(1-29)</span></div>
     <p>حيث \(\omega_s\) السرعة الزاوية للمجال المغناطيسي الدوار:</p>
     <div class="eq">$$\omega_s=\frac{2\pi n_s}{60}\quad rad/sec$$<span class="eqno">(1-30)</span></div>
     <p>بالتعويض من (1-20) و(1-30) في (1-29):</p>
     <div class="eq">$$T=\frac{P_g}{\omega_s}=\frac{3\frac{R'_2}{S}I'^2_2}{\frac{2\pi n_s}{60}}$$</div>
     <p>وبعد قليل من الترتيب:</p>
     <div class="eq">$$T=K\frac{R'_2}{S}I'^2_2$$<span class="eqno">(1-31)</span></div>`,ref:'ص 45'},
    {tip:String.raw`<p>السرعة الزاوية \(\omega\) هي السرعة نفسها لكن بوحدة <b>راديان في الثانية</b> بدل <b>دورة في الدقيقة</b>: الدورة الواحدة \(2\pi\) راديان، والدقيقة 60 ثانية؛ ومن هنا جاءت (1-30).</p>
     <p>ولماذا تعطي (1-28) و(1-29) العزم نفسه؟ لأن \(P_m=(1-S)P_g\) والسرعة الزاوية للعمود \(\omega=(1-S)\,\omega_s\)، فعند القسمة يختصر العامل \((1-S)\).</p>`},
    {watch:String.raw`<p>لا تقسم القدرة على السرعة بوحدة <span class="ltr">rpm</span> مباشرة. حوّل السرعة أولاً إلى <span class="ltr">rad/sec</span> بالمعادلة (1-30)، وإلا خرج العزم خطأً.</p>`}
   ]},

  {st:2,short:'معادلة العزم والانزلاق',title:'ثابت المحرك ومعادلة العزم والانزلاق',ref:'ص 46–47',
   q:'نريد معادلة واحدة تعطي العزم عند أي سرعة… من أين نأتي بالتيار الذي فيها؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الدائرة المكافئة التقريبية لوجه واحد: المصدر وفرع المغنطة، ثم مقاومة العضو الثابت والمعاوقة الحثية المكافئة ومقاومة تتغير بالانزلاق" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><g fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"><path d="M50 152 V110 H160 M200 110 H215 M263 110 H300 V130 M300 210 V230 H50 V188"/></g><g data-tip="جهد الوجه ⟦Vph⟧: جهد المصدر على ملف الوجه الواحد."><circle cx="50" cy="170" r="18" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M40 170 q5 -10 10 0 q5 10 10 0" fill="none" stroke="#2C4A40" stroke-width="2.5"/></g><g data-tip="فرع المغنطة ⟦Rc ∥ Xm⟧ عند أطراف الدخل: لا يدخل في حساب التيار ⟦I'2⟧ في المعادلة (1-33)." opacity=".45"><path d="M92 110 V140 l7 4 l-14 8 l14 8 l-14 8 l14 8 l-14 8 l7 4 V230 M124 110 V146 a6 6 0 0 1 0 12 a6 6 0 0 1 0 12 a6 6 0 0 1 0 12 a6 6 0 0 1 0 12 V230" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round"/><rect x="80" y="110" width="58" height="120" fill="transparent"/></g><g data-tip="مقاومة ملف العضو الثابت ⟦R1⟧."><path d="M160 110 l4 -8 l8 16 l8 -16 l8 16 l8 -16 l4 8" fill="none" stroke="#E8735A" stroke-width="3" stroke-linejoin="round"/><rect x="156" y="96" width="48" height="28" fill="transparent"/></g><g data-tip="المعاوقة الحثية المكافئة ⟦Xeq = X1 + X'2⟧ (كما يتضح من حل مثال 1-8)."><path d="M215 110 a6 6 0 0 1 12 0 a6 6 0 0 1 12 0 a6 6 0 0 1 12 0 a6 6 0 0 1 12 0" fill="none" stroke="#4FB3A9" stroke-width="3"/><rect x="212" y="96" width="54" height="22" fill="transparent"/></g><g data-tip="مقاومة العضو الدوار مقسومة على الانزلاق ⟦R'2/S⟧: تتغير مع السرعة، وهي مجموع ⟦R'2⟧ والمقاومة ⟦R'2(1−S)/S⟧ التي تمثل الحمل الميكانيكي."><path d="M300 130 l8 5 l-16 10 l16 10 l-16 10 l16 10 l-16 10 l16 10 l-16 10 l8 5" fill="none" stroke="#12855A" stroke-width="3" stroke-linejoin="round"/><line x1="280" y1="206" x2="316" y2="138" stroke="#2C4A40" stroke-width="2"/><polygon points="320,130 309,140 320,145" fill="#2C4A40"/><rect x="282" y="126" width="38" height="88" fill="transparent"/></g><g data-tip="تيار العضو الدوار المحوّل ⟦I'2⟧ من المعادلة (1-33)."><line x1="140" y1="110" x2="150" y2="110" stroke="#2C4A40"/><polygon points="152,110 140,103 140,117" fill="#2C4A40"/><rect x="132" y="80" width="26" height="36" fill="transparent"/></g><g font-family="var(--mono)" fill="#2C4A40" direction="ltr" text-anchor="middle"><text x="50" y="262" font-size="15">V<tspan font-size="11" dy="4">ph</tspan></text><text x="144" y="94" font-size="14">I'<tspan font-size="10" dy="4">2</tspan></text><text x="180" y="92" font-size="15">R<tspan font-size="11" dy="4">1</tspan></text><text x="240" y="92" font-size="15">X<tspan font-size="11" dy="4">eq</tspan></text><text x="258" y="178" font-size="15">R'<tspan font-size="11" dy="4">2</tspan><tspan dy="-4">/S</tspan></text></g><text x="180" y="300" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="600">الدائرة المكافئة التقريبية لوجه واحد</text></svg>`,
   cap:'التيار <span class="ltr">I\'<sub>2</sub></span> يمر في <span class="ltr">R<sub>1</sub></span> و<span class="ltr">X<sub>eq</sub></span> و<span class="ltr">R\'<sub>2</sub>/S</span> على التوالي، ولذلك تظهر الثلاثة في مقام المعادلة <span class="ltr">(1-33)</span>.<br><b>مرّر المؤشر على عناصر الدائرة (أو المسه في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:String.raw`في المعادلة (1-34)، إذا تضاعف جهد الوجه \(V_{ph}\) وبقي كل شيء آخر كما هو، فإن العزم عند الانزلاق نفسه…`,opts:[
     ['يتضاعف',false,String.raw`الجهد في المعادلة مربع \(V_{ph}^2\)، فالأثر أكبر من الضعف.`],
     ['لا يتغير',false,'الجهد في بسط المعادلة (1-34)، فأي تغيير فيه يغيّر العزم.'],
     ['يصبح أربعة أضعاف',true,String.raw`لأن العزم يتناسب مع \(V_{ph}^2\) في (1-34): \(2^2=4\).`]]}}
   ],
   body:[
    {book:String.raw`<p>حيث K يسمى <b>ثابت المحرك الحثي ثلاثي الأوجه</b>:</p>
     <div class="eq">$$K=\frac{3\times 60}{2\pi n_s}$$<span class="eqno">(1-32)</span></div>
     <p>بالرجوع إلى الدائرة المكافئة التقريبية في الشكل (1-12) يمكن إيجاد التيار \(I'_2\):</p>
     <div class="eq">$$I'_2=\frac{V_{ph}}{Z_{eq}}=\frac{V_{ph}}{\sqrt{\left(R_1+\frac{R'_2}{S}\right)^2+X_{eq}^2}}$$<span class="eqno">(1-33)</span></div>
     <p>بالتعويض عن \(I'_2\) في (1-31):</p>
     <div class="eq">$$T=\frac{K\,V_{ph}^2\,R'_2}{\left[\left(R_1+\frac{R'_2}{S}\right)^2+X_{eq}^2\right]S}$$<span class="eqno">(1-34)</span></div>
     <p>المعادلة (1-34) تمثل العلاقة بين العزم ومعامل الانزلاق ومنها يمكن حساب العزم عند أي قيمة للانزلاق. عند رسم العلاقة بين (العزم ومعامل الانزلاق) في المعادلة (1-34) فإننا نحصل على منحنى مشابه للمنحنى الموضح في الشكل (1-19).</p>`,ref:'ص 46'},
    {book:String.raw`<p>يلاحظ في المنحنى أعلاه أن محور معامل الانزلاق في الوضع الطبيعي بينما محور السرعة معكوس، لذلك يفضل إعادة رسم المنحنى معكوساً لكي يتناسب مع محور السرعة كما هو موضح في الشكل التالي.</p>`,ref:'ص 47'},
    {title:'ثابت المحرك والسرعة الزاوية لمحركات الكتاب',widget:(el,B)=>{
      const L=[[1800,'مثال (1-8)'],[1000,'مثال (1-6)'],[750,'مثال (1-7)'],[1500,'التمرين 16']];let ns=1800;
      el.innerHTML=`<p class="sub" style="margin:0 0 6px">اختر السرعة التزامنية لمحرك من الكتاب، وانظر كيف تتغير السرعة الزاوية <span class="ltr">(1-30)</span> وثابت المحرك <span class="ltr">(1-32)</span>.</p>
       <div class="w-row" style="margin-top:0">${L.map(([v,t])=>`<button class="btn" type="button" data-n="${v}"><span class="ltr">${v} rpm</span> · ${t.replace(/\((1-\d)\)/,'<span class="ltr">($1)</span>')}</button>`).join('')}</div>
       <div class="w-facts"><div><span>السرعة التزامنية</span><b data-o="ns"></b></div><div><span>السرعة الزاوية <bdi dir="ltr">(1-30)</bdi></span><b data-o="w"></b></div><div><span>ثابت المحرك <bdi dir="ltr">(1-32)</bdi></span><b data-o="k"></b></div></div>
       <p class="sub" style="margin-top:8px">لاحظ: كلما زادت السرعة التزامنية صغر ثابت المحرك <span class="ltr">K</span>. والكتاب يقرّب <span class="ltr">K</span> إلى أربعة أرقام عشرية (مثل <span class="ltr">0.0159</span> في مثال <span class="ltr">(1-8)</span>).</p>`;
      const o=k=>el.querySelector(`[data-o="${k}"]`);
      const draw=()=>{const w=2*Math.PI*ns/60,K=180/(2*Math.PI*ns);o('ns').textContent=ns+' rpm';o('w').textContent=w.toFixed(2)+' rad/s';o('k').textContent=K.toFixed(4);
        el.querySelectorAll('[data-n]').forEach(b=>b.classList.toggle('pri',+b.dataset.n===ns))};
      el.querySelectorAll('[data-n]').forEach(b=>b.onclick=()=>{ns=+b.dataset.n;draw()});draw();
    }},
    {tip:String.raw`<p>المعادلة (1-34) طويلة لكن فكرتها بسيطة: هي (1-31) بعد أن وضعنا مكان التيار قيمته من الدائرة المكافئة (1-33). كل ما فيها ثابت للمحرك إلا <b>الانزلاق S</b>؛ لذلك عندما يتغير S (أي تتغير السرعة) يتغير العزم، ويرسم المنحنى الذي ستراه في المحطة القادمة.</p>`},
    {watch:String.raw`<p>الكتاب لا يعرّف \(X_{eq}\) في هذا الفصل؛ ويتضح من حل مثال (1-8) أنها \(X_{eq}=X_1+X'_2\) (المعاوقة الحثية للعضو الثابت + المعاوقة الحثية المحولة للعضو الدوار).</p>`,fix:true}
   ]},

  {st:3,short:'منطقتا التشغيل',title:'منحنى العزم والسرعة ومنطقتا التشغيل',ref:'ص 48',
   q:'على المنحنى نفسه نقطتان لهما العزم نفسه… لماذا يعمل المحرك عند إحداهما ويتوقف عند الأخرى؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="منحنى العزم والسرعة: يبدأ بعزم البدء ويرتفع إلى العزم الأقصى ثم يهبط إلى الصفر عند السرعة التزامنية، والمنطقة قبل القمة غير مستقرة وبعدها مستقرة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="190" cy="160" r="140" fill="#DDEFE6"/><rect data-tip="منطقة التشغيل غير المستقر: قبل موضع العزم الأقصى. لا يستطيع المحرك أن يدير فيها أي حمل." x="60" y="70" width="158" height="180" fill="#F7DCC8" opacity=".9"/><rect data-tip="منطقة التشغيل المستقر: بعد موضع العزم الأقصى. فيها يدير المحرك حمله المقنن." x="218" y="70" width="102" height="180" fill="#CFE6DB"/><path d="M60 60 V250 H330" fill="none" stroke="#2C4A40" stroke-width="2"/><path data-tip="منحنى العزم والسرعة من المعادلة (1-34)، مرسوماً بمحور السرعة كما في الشكل (1-20)." d="M320.0 249.9L319.5 248.0L318.4 243.7L316.8 237.5L314.8 229.8L312.4 220.8L309.7 210.7L306.6 199.9L303.1 188.5L299.4 176.7L295.4 164.8L291.0 153.1L286.4 141.8L281.5 131.1L276.4 121.2L270.9 112.2L265.2 104.3L259.3 97.5L253.1 91.9L246.7 87.5L240.0 84.1L233.1 81.8L225.9 80.5L218.5 80.0L210.9 80.3L203.1 81.3L195.0 82.9L186.7 85.0L178.2 87.4L169.5 90.2L160.6 93.3L151.4 96.5L142.1 99.9L132.5 103.4L122.8 107.0L112.8 110.5L102.6 114.1L92.3 117.7L81.7 121.2L71.0 124.6L60.0 128.0" fill="none" stroke="#2C4A40" stroke-width="3.5" stroke-linejoin="round"/><line data-tip="موضع العزم الأقصى: الانزلاق ⟦Sm⟧ الذي يحدث عنده ⟦Tmax⟧." x1="218" y1="80" x2="218" y2="250" stroke="#2C4A40" stroke-width="1.5" stroke-dasharray="5 4"/><circle data-tip="العزم الأقصى ⟦Tmax⟧: أعلى عزم يستطيع المحرك أن يعطيه." cx="218" cy="80" r="7" fill="#E8735A" stroke="#FBF6EE" stroke-width="2"/><g data-tip="عزم البدء ⟦Tst⟧: العزم عند السكون ⟦n = 0⟧ أي ⟦S = 1⟧. إذا كان عزم الحمل أكبر منه لا يبدأ المحرك بالدوران."><line x1="70" y1="246" x2="70" y2="140" stroke="#E8735A" stroke-width="3"/><polygon points="70,130 63,144 77,144" fill="#E8735A"/><rect x="60" y="110" width="40" height="140" fill="transparent"/></g><g font-family="var(--mono)" fill="#2C4A40" direction="ltr" text-anchor="middle" font-size="14"><text x="218" y="64">T<tspan font-size="10" dy="4">max</tspan></text><text x="92" y="124">T<tspan font-size="10" dy="4">st</tspan></text><text x="60" y="50">T</text><text x="60" y="268">0</text><text x="320" y="268">n<tspan font-size="10" dy="4">s</tspan></text><text x="344" y="268">n</text><text x="60" y="290">1</text><text x="218" y="290">S<tspan font-size="10" dy="4">m</tspan></text><text x="320" y="290">0</text><text x="344" y="290">S</text></g><text x="138" y="196" text-anchor="middle" font-size="13" fill="#9A3B22" font-weight="700">غير المستقر</text><text x="280" y="230" text-anchor="middle" font-size="13" fill="#12855A" font-weight="700">المستقر</text></svg>`,
   cap:'رسم مبسط للشكل <span class="ltr">(1-20)</span> بلا أرقام: محور السرعة من الصفر إلى السرعة التزامنية، وتحته محور الانزلاق من 1 إلى 0.<br><b>مرّر المؤشر على المنطقتين والقمة وسهم عزم البدء (أو المسه في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'محرك عزم حمله أكبر من عزم البدء. ماذا يحدث عند توصيله بالمصدر؟',opts:[
     ['لا يستطيع بدء الدوران',true,'هذا نص الكتاب في ص 48؛ لذلك ينصح ببدء تشغيله بحمل خفيف ثم إضافة بقية الأحمال.'],
     ['يبدأ ببطء ثم يصل إلى سرعته العادية',false,'لكي يتسارع يجب أن يكون عزم المحرك أكبر من عزم الحمل، وهنا هو أصغر منذ اللحظة الأولى.'],
     ['يدور بسرعة ثابتة في المنطقة غير المستقرة',false,'لا يستطيع المحرك أن يدير أي حمل في المنطقة غير المستقرة.']]}}
   ],
   body:[
    {book:String.raw`<p>منحنى (العزم والسرعة) ينقسم إلى منطقتين:</p>
     <ul><li><b>الأولى منطقة التشغيل غير المستقر</b> وهي المنطقة التي تسبق موضع العزم الأقصى، في هذه المنطقة لا يستطيع المحرك إدارة أي حمل وإذا حدث أن حمل المحرك في هذه المنطقة فإنه سوف يتباطأ حتى يتوقف عن الدوران.</li>
     <li><b>الأخرى منطقة التشغيل المستقر</b> وهي المنطقة التي بعد موضع العزم الأقصى، والتي يستطيع المحرك إدارة الحمل المقنن له، وعادة يكون <b>عزم الحمل الكامل مساوياً تقريباً لنصف العزم الأقصى</b> للمحرك بشرط أن لا يزيد عن عزم البدء، وفي حالة كون عزم الحمل أكبر من عزم البدء فإن المحرك لا يستطيع بدء الدوران، لذلك ينصح في هذه الحالة بدء تشغيل المحرك بحمل خفيف وبعد أن يصل إلى منطقة التشغيل المستقر تضاف بقية الأحمال.</li></ul>`,ref:'ص 48'},
    {title:'ماذا يحدث إذا زاد الحمل قليلاً؟',widget:(el,B)=>{
      const C={st:['زاد الحمل قليلاً','قلّت السرعة','زاد الانزلاق S','في هذه المنطقة: زاد العزم','يلحق المحرك بالحمل ويستقر عند سرعة أقل بقليل'],
               un:['زاد الحمل قليلاً','قلّت السرعة','زاد الانزلاق S','في هذه المنطقة: قلّ العزم','قلّت السرعة أكثر… حتى يتوقف المحرك']};
      el.innerHTML=`<p class="sub" style="margin:0 0 10px">اختر مكان نقطة التشغيل، ثم تابع السلسلة حلقةً بعد حلقة.</p><div class="w-row" style="margin-top:0"><button class="btn pri" type="button" data-m="st">في المنطقة المستقرة</button><button class="btn" type="button" data-m="un">في المنطقة غير المستقرة</button></div><div class="chain" style="margin-top:12px"></div>`;
      const ch=el.querySelector('.chain');let tm=[];
      const run=m=>{tm.forEach(clearTimeout);tm=[];const S=C[m];ch.innerHTML=S.map((s,i)=>`<span class="ck${i===S.length-1?' end':''}">${s}</span>${i<S.length-1?'<span class="ar">←</span>':''}`).join('');
        const ks=[...ch.querySelectorAll('.ck')];ks.forEach((k,i)=>tm.push(setTimeout(()=>k.classList.add('on'),i*550)));
        el.querySelectorAll('[data-m]').forEach(b=>b.classList.toggle('pri',b.dataset.m===m))};
      el.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>run(b.dataset.m));run('st');
    }},
    {tip:String.raw`<p>في المنطقة المستقرة (يمين القمة) كل زيادة في الانزلاق <b>تزيد</b> العزم، فيلحق المحرك بالحمل. أما يسار القمة فكل زيادة في الانزلاق <b>تُنقص</b> العزم، فيزداد البطء حتى يتوقف المحرك. لذلك يعمل المحرك دائماً في الجزء الهابط الحاد القريب من السرعة التزامنية.</p>`},
    {watch:String.raw`<p>في الشكل (1-19) محور الانزلاق في وضعه الطبيعي (من 0 إلى 1) فتظهر المنطقة المستقرة على <b>اليسار</b>، وفي الشكل (1-20) محور السرعة في وضعه الطبيعي فتظهر المستقرة على <b>اليمين</b>. المنحنى واحد؛ تغيّر اتجاه المحور فقط.</p>`}
   ]},

  {st:4,short:'موضع العزم الأقصى',title:'التحكم في موضع العزم الأقصى',ref:'ص 48–50',
   q:'هل نستطيع أن ننقل قمة المنحنى إلى مكان آخر دون أن نغيّر المحرك نفسه؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="عضو دوار ملفوف بثلاث حلقات انزلاق، تتصل عبر فرش بثلاث مقاومات خارجية متغيرة موصلة نجمة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><rect data-tip="عمود الدوران." x="30" y="152" width="170" height="14" rx="4" fill="#E9B949" stroke="#B9852A" stroke-width="1.5"/><g data-tip="العضو الدوار الملفوف (ذو حلقات الانزلاق): ملفاته ثلاثية الأوجه وأطرافها تخرج إلى الحلقات، فنستطيع أن نصل بها مقاومات من الخارج."><rect x="46" y="104" width="76" height="110" rx="10" fill="#CFE6DB" stroke="#2C4A40" stroke-width="3"/><g stroke="#E8735A" stroke-width="4"><line x1="62" y1="112" x2="62" y2="206"/><line x1="84" y1="112" x2="84" y2="206"/><line x1="106" y1="112" x2="106" y2="206"/></g></g><g data-tip="حلقات الانزلاق: ثلاث حلقات نحاسية على العمود، كل حلقة متصلة بطرف وجه من ملفات العضو الدوار."><rect x="136" y="128" width="10" height="62" rx="3" fill="#B9852A"/><rect x="154" y="128" width="10" height="62" rx="3" fill="#B9852A"/><rect x="172" y="128" width="10" height="62" rx="3" fill="#B9852A"/></g><g data-tip="الفرش الكربونية: تلامس الحلقات وهي تدور، فتنقل تيار العضو الدوار إلى المقاومات الخارجية."><rect x="134" y="110" width="14" height="16" rx="2" fill="#2C4A40"/><rect x="152" y="110" width="14" height="16" rx="2" fill="#2C4A40"/><rect x="170" y="110" width="14" height="16" rx="2" fill="#2C4A40"/></g><g fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round"><path d="M141 110 V44 H300 V120"/><path d="M159 110 V58 H270 V120"/><path d="M177 110 V72 H240 V120"/><path d="M240 200 V236 H300 V200 M270 200 V236"/></g><g data-tip="مقاومات خارجية متغيرة: تضاف على التوالي مع ملفات العضو الدوار، فتزيد ⟦R'2⟧ وتنقل موضع العزم الأقصى ⟦Sm⟧ حسب المعادلة (1-36)."><g fill="none" stroke="#12855A" stroke-width="3" stroke-linejoin="round"><path d="M240 120 l7 5 l-14 10 l14 10 l-14 10 l14 10 l-14 10 l14 10 l-14 10 l7 5"/><path d="M270 120 l7 5 l-14 10 l14 10 l-14 10 l14 10 l-14 10 l14 10 l-14 10 l7 5"/><path d="M300 120 l7 5 l-14 10 l14 10 l-14 10 l14 10 l-14 10 l14 10 l-14 10 l7 5"/></g><g stroke="#2C4A40" stroke-width="2"><line x1="228" y1="190" x2="252" y2="130"/><line x1="258" y1="190" x2="282" y2="130"/><line x1="288" y1="190" x2="312" y2="130"/></g><g fill="#2C4A40"><polygon points="255,122 245,131 255,135"/><polygon points="285,122 275,131 285,135"/><polygon points="315,122 305,131 315,135"/></g><rect x="226" y="116" width="92" height="88" fill="transparent"/></g><circle data-tip="نقطة النجمة: تربط الأطراف الأخرى للمقاومات الثلاث معاً." cx="270" cy="236" r="5" fill="#2C4A40"/><text x="160" y="214" text-anchor="middle" font-size="12" fill="#2C4A40">حلقات الانزلاق</text><text x="270" y="262" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">مقاومات مضافة</text><text x="84" y="236" text-anchor="middle" font-size="12" fill="#2C4A40">العضو الدوار</text></svg>`,
   cap:'في المحرك ذي حلقات الانزلاق تُوصل مقاومات خارجية مع ملفات العضو الدوار عبر الحلقات والفرش.<br><b>مرّر المؤشر على الحلقات والفرش والمقاومات (أو المسه في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:String.raw`لكي يزيد الانزلاق الذي يحدث عنده العزم الأقصى \(S_m\) نضيف مقاومة…`,opts:[
     ['على التوالي مع ملفات العضو الثابت',false,String.raw`المعادلة (1-36) \(S_m=R'_2/X'_2\) لا تحتوي على مقاومة العضو الثابت.`],
     ['على التوازي مع المصدر',false,'هذا لا يغيّر النسبة بين مقاومة العضو الدوار ومعاوقته.'],
     ['على التوالي مع ملفات العضو الدوار الملفوف',true,String.raw`فتزيد \(R'_2\) فيزيد \(S_m=R'_2/X'_2\)، كما يقول الكتاب في ص 49.`]]}}
   ],
   body:[
    {book:String.raw`<p>معادلة العزم (1-34) تعتبر دالة رياضية بدلالة الانزلاق (S)، القيمة العظمى لها (\(T_{max}\)) يتغير موضعها بتغير ثوابت الدائرة المكافئة الداخلة فيها، وإذا أردنا إيجاد قيمة الانزلاق الذي تتحقق عنده القيمة العظمى لهذه الدالة فإن ذلك ممكن، وذلك بعد مفاضلتها ثم مساواتها بالصفر.</p>`,ref:'ص 48'},
    {book:String.raw`<p>قبل إجراء عملية التفاضل يفضل <b>إهمال معاوقة العضو الثابت</b> للتبسيط:</p>
     <div class="eq">$$T=\frac{K\,V_{ph}^2\,R'_2}{\left[\left(\frac{R'_2}{S}\right)^2+X'^2_2\right]S}$$<span class="eqno">(1-35)</span></div>
     <p>بعد مفاضلة (1-35) بالنسبة للانزلاق ومساواتها بالصفر نحصل على قيمة الانزلاق الذي يتحقق عنده العزم الأقصى:</p>
     <div class="eq">$$S_m=\frac{R'_2}{X'_2}$$<span class="eqno">(1-36)</span></div>
     <p>إذاً: موضع العزم الأقصى (\(T_{max}\)) يمكن أن يتغير وذلك بتغير النسبة (\(R'_2/X'_2\))، ويمكن تحقيق ذلك عملياً بإضافة مقاومة موصلة على التوالي مع ملفات العضو الدوار الملفوف (ذو حلقات الانزلاق) وبالتالي يتغير موضع العزم الأقصى للمحرك بتغيير قيمة \(S_m\) كما هو موضح في الشكل التالي.</p>`,ref:'ص 49'},
    {title:'الشكل (1-21): زِد مقاومة العضو الدوار وانظر أين تذهب القمة',widget:(el,B)=>{
      const K=[1,2,3,4,5,6];let k=1;
      el.innerHTML=`<p class="sub" style="margin:0 0 6px">اختر مقاومة العضو الدوار: <span class="ltr">Ro</span> هي الأصلية، ثم ضعفها وثلاثة أضعافها… كما في الشكل <span class="ltr">(1-21)</span> ص 50. (المنحنيات بلا أرقام، مرسومة من المعادلة <span class="ltr">(1-34)</span>.)</p>
       <div class="w-row" style="margin-top:0">${K.map(v=>`<button class="btn" type="button" data-k="${v}"><span class="ltr">${v===1?'Ro':v+'Ro'}</span></button>`).join('')}</div>
       <div data-c style="margin-top:10px"></div><p class="sub" data-t></p>`;
      const draw=()=>{el.querySelector('[data-c]').innerHTML=box(torqueSVG({p:PFIG,orient:'n',symbolic:true,regions:false,fam:K,sel:k,H:300}),560);
        el.querySelector('[data-t]').innerHTML=k<5?'القمة انتقلت نحو بداية الحركة، وارتفع عزم البدء، وبقي ارتفاع القمة كما هو تقريباً.':k===5?'وصلت القمة تقريباً إلى لحظة البدء: عزم البدء الآن أكبر ما يمكن.':'تجاوزت القمة لحظة البدء، فصار عزم البدء <b>أقل</b> من المنحنى السابق (انظر المحطة السادسة).';
        el.querySelectorAll('[data-k]').forEach(b=>b.classList.toggle('pri',+b.dataset.k===k))};
      el.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{k=+b.dataset.k;draw()});draw();
    }},
    {tip:String.raw`<p>كلما زادت \(R'_2\) زاد \(S_m\)، أي ابتعد موضع القمة عن السرعة التزامنية واقترب من لحظة البدء \((S=1)\). في الشكل (1-21) تسمى المقاومات \(R_1=2R_o\) و\(R_2=3R_o\)… وكتبناها هنا <span class="ltr">2Ro</span> و<span class="ltr">3Ro</span> حتى لا تختلط بمقاومة العضو الثابت \(R_1\).</p>`},
    {watch:String.raw`<p>هذه الطريقة للمحرك ذي <b>العضو الدوار الملفوف</b> فقط؛ لأن القفص السنجابي قضبانه مقصورة داخل المحرك ولا توجد أطراف نصل بها مقاومات.</p>`}
   ]},

  {st:5,short:'العزم الأقصى',title:'قيمة العزم الأقصى',ref:'ص 50',
   q:'القمة انتقلت من مكانها… فهل تغيّر ارتفاعها أيضاً؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ثلاثة منحنيات عزم وسرعة لمقاومات دوار مختلفة، قممها كلها على الارتفاع نفسه" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="190" cy="160" r="140" fill="#E6E2F8"/><path d="M60 60 V250 H330" fill="none" stroke="#2C4A40" stroke-width="2"/><line data-tip="العزم الأقصى ⟦Tmax⟧ من المعادلة (1-37): لا تظهر فيها ⟦R'2⟧، فارتفاع القمة لا يتغير بتغير مقاومة العضو الدوار." x1="60" y1="80" x2="320" y2="80" stroke="#E8735A" stroke-width="2" stroke-dasharray="6 4"/><path data-tip="المنحنى بالمقاومة الأصلية ⟦Ro⟧." d="M320.0 249.8L319.5 246.1L318.4 237.4L316.8 225.3L314.8 210.6L312.4 194.0L309.7 176.4L306.6 158.6L303.1 141.5L299.4 125.7L295.4 111.9L291.0 100.5L286.4 91.7L281.5 85.5L276.4 81.7L270.9 80.1L265.2 80.4L259.3 82.1L253.1 85.1L246.7 89.0L240.0 93.5L233.1 98.5L225.9 103.7L218.5 109.0L210.9 114.4L203.1 119.7L195.0 124.9L186.7 130.0L178.2 134.9L169.5 139.6L160.6 144.1L151.4 148.3L142.1 152.4L132.5 156.3L122.8 160.0L112.8 163.5L102.6 166.8L92.3 170.0L81.7 173.0L71.0 175.8L60.0 178.5" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round"/><path data-tip="المنحنى بمقاومة ⟦2Ro⟧: القمة انتقلت نحو لحظة البدء." d="M320.0 249.9L319.5 248.0L318.4 243.7L316.8 237.5L314.8 229.8L312.4 220.8L309.7 210.7L306.6 199.9L303.1 188.5L299.4 176.7L295.4 164.8L291.0 153.1L286.4 141.8L281.5 131.1L276.4 121.2L270.9 112.2L265.2 104.3L259.3 97.5L253.1 91.9L246.7 87.5L240.0 84.1L233.1 81.8L225.9 80.5L218.5 80.0L210.9 80.3L203.1 81.3L195.0 82.9L186.7 85.0L178.2 87.4L169.5 90.2L160.6 93.3L151.4 96.5L142.1 99.9L132.5 103.4L122.8 107.0L112.8 110.5L102.6 114.1L92.3 117.7L81.7 121.2L71.0 124.6L60.0 128.0" fill="none" stroke="#4FB3A9" stroke-width="3" stroke-linejoin="round"/><path data-tip="المنحنى بمقاومة ⟦4Ro⟧: القمة انتقلت أكثر نحو لحظة البدء." d="M320.0 249.9L319.5 249.0L318.4 246.8L316.8 243.7L314.8 239.8L312.4 235.1L309.7 229.8L306.6 224.0L303.1 217.7L299.4 210.9L295.4 203.8L291.0 196.3L286.4 188.7L281.5 180.9L276.4 173.0L270.9 165.1L265.2 157.3L259.3 149.6L253.1 142.1L246.7 134.9L240.0 128.0L233.1 121.5L225.9 115.4L218.5 109.7L210.9 104.6L203.1 99.9L195.0 95.8L186.7 92.1L178.2 89.0L169.5 86.4L160.6 84.2L151.4 82.5L142.1 81.3L132.5 80.5L122.8 80.1L112.8 80.0L102.6 80.3L92.3 80.9L81.7 81.7L71.0 82.8L60.0 84.1" fill="none" stroke="#12855A" stroke-width="3" stroke-linejoin="round"/><g fill="#E8735A" stroke="#FBF6EE" stroke-width="2"><circle cx="268" cy="80" r="6"/><circle cx="218" cy="80" r="6"/><circle cx="116" cy="80" r="6"/></g><g data-tip="اتجاه انتقال القمة عند زيادة مقاومة العضو الدوار ⟦R'2⟧."><line x1="258" y1="56" x2="134" y2="56" stroke="#2C4A40" stroke-width="2.5"/><polygon points="122,56 136,49 136,63" fill="#2C4A40"/><rect x="120" y="36" width="140" height="28" fill="transparent"/></g><g font-family="var(--mono)" fill="#2C4A40" direction="ltr" text-anchor="middle" font-size="14"><text x="190" y="46">R'<tspan font-size="10" dy="4">2</tspan><tspan dy="-4"> ↑</tspan></text><text x="336" y="84" font-size="13">T<tspan font-size="9" dy="4">max</tspan></text><text x="60" y="50">T</text><text x="60" y="268">0</text><text x="320" y="268">n<tspan font-size="10" dy="4">s</tspan></text><text x="344" y="268">n</text><text x="286" y="74" font-size="11">Ro</text><text x="238" y="74" font-size="11">2Ro</text><text x="136" y="74" font-size="11">4Ro</text></g><text x="190" y="300" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">القمة تتحرك… وارتفاعها ثابت</text></svg>`,
   cap:'ثلاثة منحنيات من الشكل <span class="ltr">(1-21)</span> بلا أرقام: القمم كلها على الخط المتقطع نفسه.<br><b>مرّر المؤشر على المنحنيات والخط المتقطع والسهم (أو المسه في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:String.raw`إذا زادت مقاومة العضو الدوار \(R'_2\)، فإن قيمة العزم الأقصى \(T_{max}\) في المعادلة (1-37)…`,opts:[
     ['تزداد',false,String.raw`\(R'_2\) لا تظهر في (1-37) أصلاً.`],
     ['لا تتغير؛ يتغير موضعها فقط',true,String.raw`(1-37) فيها \(K\) و\(V_{ph}\) و\(X'_2\) فقط، ولهذا القمم في الشكل (1-21) على الارتفاع نفسه تقريباً.`],
     ['تقل',false,String.raw`\(R'_2\) لا تظهر في (1-37)، فلا تؤثر على قيمة العزم الأقصى.`]]}}
   ],
   body:[
    {book:String.raw`<p>ويمكن أيضا من المعادلة (1-34) حساب قيمة العزم الأقصى للمحرك وذلك عندما ننقل موضع العزم الأقصى إلى لحظة البدء أي أن (\(S_m=1\ \&\ R'_2=X'_2\)) فتصبح المعادلة كما يلي:</p>
     <div class="eq">$$T_{max}=\frac{K\,V_{ph}^2}{2X'_2}$$<span class="eqno">(1-37)</span></div>`,ref:'ص 50'},
    {tip:String.raw`<p>العزم الأقصى يكبر مع <b>مربع الجهد</b> ويصغر كلما كبرت المعاوقة الحثية للعضو الدوار \(X'_2\). أما مقاومة العضو الدوار فتحدد <b>أين</b> تقع القمة لا <b>كم</b> ارتفاعها.</p>`},
    {watch:String.raw`<p>تعليل الكتاب للمعادلة (1-37) مربك: الصيغة لا تحتاج أن يكون \(S_m=1\)؛ فهي تنتج مباشرة بالتعويض بـ \(S=S_m=R'_2/X'_2\) في المعادلة المبسطة (1-35) لأي قيمة لـ \(R'_2\)، ولذلك لا تحتوي الصيغة على \(R'_2\). والصيغة مأخوذة من (1-35) التي أُهملت فيها معاوقة العضو الثابت، وليس من (1-34) الكاملة كما يقول النص.</p>`,fix:true}
   ]},

  {st:6,short:'عزم البدء',title:'حساب عزم البدء',ref:'ص 50–51',
   q:'لحظة الضغط على زر التشغيل والمحرك ما زال واقفاً… كم عزماً يعطي، وكيف نزيده؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="منحنيان للعزم والسرعة: بمقاومة دوار أكبر يرتفع العزم عند السرعة صفر" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="190" cy="160" r="140" fill="#FBE6C4"/><path d="M60 60 V250 H330" fill="none" stroke="#2C4A40" stroke-width="2"/><path data-tip="المنحنى بالمقاومة الأصلية ⟦Ro⟧: عزم البدء صغير نسبياً." d="M320.0 249.8L319.5 246.1L318.4 237.4L316.8 225.3L314.8 210.6L312.4 194.0L309.7 176.4L306.6 158.6L303.1 141.5L299.4 125.7L295.4 111.9L291.0 100.5L286.4 91.7L281.5 85.5L276.4 81.7L270.9 80.1L265.2 80.4L259.3 82.1L253.1 85.1L246.7 89.0L240.0 93.5L233.1 98.5L225.9 103.7L218.5 109.0L210.9 114.4L203.1 119.7L195.0 124.9L186.7 130.0L178.2 134.9L169.5 139.6L160.6 144.1L151.4 148.3L142.1 152.4L132.5 156.3L122.8 160.0L112.8 163.5L102.6 166.8L92.3 170.0L81.7 173.0L71.0 175.8L60.0 178.5" fill="none" stroke="#4FB3A9" stroke-width="3" stroke-linejoin="round"/><path data-tip="المنحنى بمقاومة دوار أكبر ⟦3Ro⟧: عزم البدء أكبر." d="M320.0 249.9L319.5 248.7L318.4 245.8L316.8 241.6L314.8 236.4L312.4 230.3L309.7 223.4L306.6 215.7L303.1 207.5L299.4 198.9L295.4 189.9L291.0 180.6L286.4 171.3L281.5 162.0L276.4 152.8L270.9 143.8L265.2 135.2L259.3 127.1L253.1 119.5L246.7 112.5L240.0 106.1L233.1 100.5L225.9 95.5L218.5 91.3L210.9 87.8L203.1 85.0L195.0 82.9L186.7 81.3L178.2 80.4L169.5 80.0L160.6 80.1L151.4 80.7L142.1 81.6L132.5 82.9L122.8 84.5L112.8 86.3L102.6 88.4L92.3 90.7L81.7 93.1L71.0 95.6L60.0 98.3" fill="none" stroke="#E8735A" stroke-width="3" stroke-linejoin="round"/><circle data-tip="عزم البدء بالمقاومة الأصلية ⟦Ro⟧ عند ⟦S = 1⟧." cx="60" cy="178.5" r="7" fill="#4FB3A9" stroke="#FBF6EE" stroke-width="2"/><circle data-tip="عزم البدء بالمقاومة ⟦3Ro⟧ عند ⟦S = 1⟧." cx="60" cy="98.3" r="7" fill="#E8735A" stroke="#FBF6EE" stroke-width="2"/><g data-tip="زيادة مقاومة العضو الدوار ترفع عزم البدء، إلى أن تصل القمة إلى لحظة البدء ⟦Sm = 1⟧."><line x1="40" y1="172" x2="40" y2="112" stroke="#2C4A40" stroke-width="2.5"/><polygon points="40,100 33,114 47,114" fill="#2C4A40"/><rect x="28" y="96" width="24" height="80" fill="transparent"/></g><g font-family="var(--mono)" fill="#2C4A40" direction="ltr" text-anchor="middle" font-size="14"><text x="60" y="50">T</text><text x="60" y="268">0</text><text x="320" y="268">n<tspan font-size="10" dy="4">s</tspan></text><text x="344" y="268">n</text><text x="60" y="290">S = 1</text><text x="96" y="194" font-size="13">T<tspan font-size="9" dy="4">st</tspan></text><text x="96" y="122" font-size="13">T<tspan font-size="9" dy="4">st</tspan></text><text x="282" y="72" font-size="12">Ro</text><text x="176" y="72" font-size="12">3Ro</text></g><text x="200" y="300" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">عزم البدء = العزم عند السكون</text></svg>`,
   cap:'عزم البدء هو ارتفاع المنحنى عند السرعة صفر، ويرتفع بزيادة مقاومة العضو الدوار.<br><b>مرّر المؤشر على النقطتين والمنحنيين والسهم (أو المسه في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:String.raw`عزم البدء يحسب من المعادلة (1-34) بالتعويض عن الانزلاق بـ…`,opts:[
     [String.raw`\(S=1\)`,true,'عند البدء يكون العضو الدوار ثابتاً فيكون الانزلاق واحداً، كما في نص الكتاب ص 50.'],
     [String.raw`\(S=0\)`,false,'الانزلاق صفر يعني الدوران بالسرعة التزامنية، وعندها يكون العزم صفراً.'],
     [String.raw`\(S=S_m\)`,false,String.raw`عند \(S_m\) نحصل على العزم الأقصى لا عزم البدء.`]]}}
   ],
   body:[
    {book:String.raw`<p>يلاحظ من الشكل رقم (1-21) أن عزم البدء يزداد كلما زادت مقاومة ملفات العضو الدوار، أي أنه يمكن التحكم في قيمة عزم البدء وذلك بتغيير قيمة مقاومة ملفات العضو الدوار \(R'_2\) وذلك بإضافة مقاومة موصلة على التوالي مع ملفات العضو الدوار كما هو واضح من المنحنيات في الشكل (1-21). أما قيمة عزم البدء فيمكن إيجادها مباشرة من المعادلة (1-34) عندما يكون (S = 1):</p>
     <div class="eq">$$T_{st}=\frac{K\,V_{ph}^2\,R'_2}{\left[(R_1+R'_2)^2+X_{eq}^2\right]}$$<span class="eqno">(1-38)</span></div>`,ref:'ص 50–51'},
    {tip:String.raw`<p>(1-38) هي (1-34) نفسها بعد وضع \(S=1\): يختفي \(S\) من المقام، ويصبح \(R'_2/S\) مجرد \(R'_2\).</p>`},
    {watch:String.raw`<p>يقول الكتاب: «عزم البدء يزداد كلما زادت مقاومة ملفات العضو الدوار». لكن في الشكل (1-21) نفسه منحنى <span class="ltr">R5 = 6Ro</span> عزمه عند <span class="ltr">S = 1</span> <b>أقل</b> من منحنى <span class="ltr">R4 = 5Ro</span>، لأن قمته تجاوزت <span class="ltr">S = 1</span>. الزيادة صحيحة فقط إلى أن يصل موضع العزم الأقصى إلى لحظة البدء \((S_m=1)\)، وبعدها يقل عزم البدء. جرّب ذلك بزر <span class="ltr">6Ro</span> في المحطة الرابعة.</p>`,fix:true}
   ]},

  {st:7,short:'مثال <span class="ltr">(1-8)</span>',title:'مثال <span class="ltr">(1-8)</span>',ref:'ص 52–54',
   q:'مثال واحد يطبّق معادلات الدرس كلها على محرك واحد. الحل الكامل في تبويب «الأمثلة المحلولة».',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="لوحة بيانات توضيحية بأرقام مثال (1-8): دلتا 240 فولت، عناصر الدائرة المكافئة، والسرعتان" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><rect x="64" y="56" width="232" height="214" rx="14" fill="#F1EBDD" stroke="#2C4A40" stroke-width="4"/><path d="M64 70 a14 14 0 0 1 14 -14 h204 a14 14 0 0 1 14 14 v26 h-232z" fill="#2C4A40"/><text x="180" y="82" text-anchor="middle" font-size="14" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">3~ INDUCTION MOTOR</text><g font-family="var(--mono)" font-size="14" fill="#2C4A40" direction="ltr"><rect data-tip="جهد المصدر 240 V، والرمز Δ يعني أن الملفات موصلة دلتا، فجهد الوجه = جهد الخط." x="86" y="104" width="190" height="24" fill="transparent"/><text x="94" y="121">V</text><text x="268" y="121" text-anchor="end" font-weight="700">240 V  Δ</text><rect data-tip="مقاومة ملف العضو الثابت ⟦R1⟧ ومقاومة العضو الدوار المحولة ⟦R'2⟧." x="86" y="130" width="190" height="24" fill="transparent"/><text x="94" y="147">R1 / R'2</text><text x="268" y="147" text-anchor="end" font-weight="700">0.4 / 0.6 Ω</text><rect data-tip="المعاوقتان الحثيتان ⟦X1⟧ و⟦X'2⟧، ومجموعهما ⟦Xeq = 2 Ω⟧ كما في حل الكتاب." x="86" y="156" width="190" height="24" fill="transparent"/><text x="94" y="173">X1 / X'2</text><text x="268" y="173" text-anchor="end" font-weight="700">1.0 / 1.0 Ω</text><rect data-tip="السرعة التزامنية ⟦ns⟧." x="86" y="182" width="190" height="24" fill="transparent"/><text x="94" y="199">ns</text><text x="268" y="199" text-anchor="end" font-weight="700">1800 rpm</text><rect data-tip="سرعة العضو الدوار عند الحمل الكامل ⟦n⟧." x="86" y="208" width="190" height="24" fill="transparent"/><text x="94" y="225">n</text><text x="268" y="225" text-anchor="end" font-weight="700">1710 rpm</text></g><g stroke="#CFC6B4" stroke-width="1"><line x1="94" y1="130" x2="268" y2="130"/><line x1="94" y1="156" x2="268" y2="156"/><line x1="94" y1="182" x2="268" y2="182"/><line x1="94" y1="208" x2="268" y2="208"/></g><circle cx="78" cy="256" r="5" fill="#2C4A40"/><circle cx="282" cy="256" r="5" fill="#2C4A40"/></svg>`,
   cap:'لوحة بيانات توضيحية بأرقام مثال <span class="ltr">(1-8)</span>.<br><b>مرّر المؤشر على أي سطر في اللوحة (أو المسه في الجوال) لتعرف معناه.</b>',
   side:[
    {html:String.raw`<div class="exl">
     <div class="exc"><header>مثال (1-8) <span class="ref">ص 52–54</span></header>
      <div class="kv-row"><small>المعطيات</small><span class="kv">دلتا</span><span class="kv ltr">\(V_L=240\ \text{V}\)</span><span class="kv ltr">\(R_1=0.4\ \Omega\)</span><span class="kv ltr">\(R'_2=0.6\ \Omega\)</span><span class="kv ltr">\(X_1=X'_2=1\ \Omega\)</span><span class="kv ltr">\(n_s=1800\ \text{rpm}\)</span><span class="kv ltr">\(n=1710\ \text{rpm}\)</span></div>
      <div class="kv-row"><small>النتائج</small><span class="kv res ltr">\(S=0.05\)</span><span class="kv res ltr">\(I'_2=19.11\ \text{A}\)</span><span class="kv res ltr">\(K=0.0159\)</span><span class="kv res ltr">\(T=69.74\ \text{Nm}\)</span><span class="kv res ltr">\(I'_{2st}=107.33\ \text{A}\)</span><span class="kv res ltr">\(T_{st}=109.9\ \text{Nm}\)</span><span class="kv res ltr">\(T_{max}=457.92\ \text{Nm}\)</span><span class="kv res ltr">\(S_m=0.6\)</span></div></div>
     <div class="w-row"><button class="btn pri" type="button" onclick="var b=document.querySelector('.ltabs button[data-tab=examples]');if(b)b.click()">افتح الأمثلة المحلولة وغيّر الأرقام</button></div></div>`}
   ],
   body:[
    {predict:{q:String.raw`في مثال (1-8) الملفات موصلة دلتا والمصدر <span class="ltr">240 V</span>. كم جهد الوجه \(V_{ph}\)؟`,opts:[
     [String.raw`<span class="ltr">138.56 V</span>`,false,String.raw`هذا \(240/\sqrt3\) ويصلح للتوصيل نجمة، لا دلتا.`],
     [String.raw`<span class="ltr">240 V</span>`,true,String.raw`في الدلتا يقع جهد الخط كاملاً على كل ملف: \(V_{ph}=V_L=240\ V\)، كما في حل الكتاب.`],
     [String.raw`<span class="ltr">415.7 V</span>`,false,String.raw`هذا \(240\times\sqrt3\)، ولا يحدث في أي توصيل هنا.`]]}},
    {watch:String.raw`<p>في الفرع (ب) ص 53 طُبع: \(T=0.0159\times\frac{0.6}{0.05}\times(19.11)^2=69.74\ Nm\). بالأرقام المكتوبة نفسها الناتج <b><span class="ltr">69.68 Nm</span></b>؛ والرقم 69.74 قريب مما يخرج لو استُعمل K بدون تقريب (<span class="ltr">0.015915…</span>). الفرق صغير.</p>`,fix:true},
    {watch:String.raw`<p>في الفرع (هـ) ص 54 حُسب العزم الأقصى من (1-37) <b>بإهمال معاوقة العضو الثابت</b> (\(X'_2=1\) فقط وبدون \(R_1\))، بينما الفروع (أ)–(د) استعملت الدائرة الكاملة (\(R_1\) و\(X_{eq}=2\)). لذلك <span class="ltr">457.92 Nm</span> لا تطابق قمة منحنى (1-34) لنفس المحرك. هذا تبسيط من الكتاب وليس خطأً حسابياً، وفي «المختبر» مفتاح يقارن الطريقتين.</p>`,fix:true}
   ]},

  {recap:[
   String.raw`العزم من القدرة، المعادلة (1-29): \(T=\frac{P_g}{\omega_s}\) حيث \(\omega_s=\frac{2\pi n_s}{60}\)، المعادلة (1-30).`,
   String.raw`معادلة العزم والانزلاق (1-34) تعطي العزم عند أي انزلاق؛ والمحرك يعمل في المنطقة المستقرة بعد موضع العزم الأقصى.`,
   String.raw`موضع العزم الأقصى، المعادلة (1-36): \(S_m=\frac{R'_2}{X'_2}\)، ويتغير بإضافة مقاومة إلى العضو الدوار الملفوف.`,
   String.raw`قيمة العزم الأقصى، المعادلة (1-37): \(T_{max}=\frac{K\,V_{ph}^2}{2X'_2}\) ولا تتغير بتغير \(R'_2\).`,
   String.raw`عزم البدء، المعادلة (1-38): \(T_{st}\) هو (1-34) عند \(S=1\)، ويزداد بزيادة \(R'_2\) حتى يصل \(S_m\) إلى 1.`]}
 ],
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
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'يقول الكتاب في ص 50: «يلاحظ من الشكل رقم (1-21) أن <b>عزم البدء يزداد كلما زادت مقاومة ملفات العضو الدوار</b>». لكن في الشكل نفسه منحنى <span class="ltr">R5 = 6Ro</span> عزمه عند <span class="ltr">S = 1</span> <b>أقل</b> من منحنى <span class="ltr">R4 = 5Ro</span>، لأن قمته تجاوزت <span class="ltr">S = 1</span>. الزيادة صحيحة فقط إلى أن يصل موضع العزم الأقصى إلى لحظة البدء (<span class="ltr">S<sub>m</sub> = 1</span>)، وبعدها يقل عزم البدء. رسمنا المنحنيات كما يظهرها الشكل.'+'</div>'},
  {h:'العزم الأقصى',ref:'ص 50',html:`<p>«ويمكن أيضا من المعادلة (1-34) حساب قيمة العزم الأقصى للمحرك وذلك عندما ننقل موضع العزم الأقصى إلى لحظة البدء أي أن (\\(S_m = 1\\ \\&\\ R'_2 = X'_2\\)) فتصبح المعادلة كما يلي»:</p>
   $$T_{max} = \\frac{K V_{ph}^2}{2X'_2} ${eq('1-37')}$$`},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'تعليل الكتاب للمعادلة (1-37) مربك: الصيغة لا تحتاج أن يكون <span class="ltr">S<sub>m</sub> = 1</span>؛ فهي تنتج مباشرة بالتعويض بـ \\(S=S_m=R\'_2/X\'_2\\) في المعادلة المبسطة (1-35) لأي قيمة لـ \\(R\'_2\\)، ولذلك لا تحتوي الصيغة على \\(R\'_2\\) (العزم الأقصى لا يتغير بتغير مقاومة العضو الدوار، بل يتغير موضعه فقط، كما في الشكل 1-21). والصيغة مأخوذة من (1-35) التي أُهملت فيها معاوقة العضو الثابت، وليس من (1-34) الكاملة كما يقول النص.'+'</div>'},
  {h:'حساب عزم البدء',ref:'ص 50–51',html:`<p>«يلاحظ من الشكل رقم (1-21) أن عزم البدء يزداد كلما زادت مقاومة ملفات العضو الدوار، أي أنه يمكن التحكم في قيمة عزم البدء وذلك بتغيير قيمة مقاومة ملفات العضو الدوار \\(R'_2\\) وذلك بإضافة مقاومة موصلة على التوالي مع ملفات العضو الدوار كما هو واضح من المنحنيات في الشكل (1-21). أما قيمة عزم البدء فيمكن إيجادها مباشرة من المعادلة (1-34) عندما يكون (S = 1)»:</p>
   $$T_{st} = \\frac{K V_{ph}^2 R'_2}{\\left[(R_1+R'_2)^2 + X_{eq}^2\\right]} ${eq('1-38')}$$`},
  {h:'مثال (1-8)',ref:'ص 52–54',html:`${Q18}<p>نتائج الكتاب: <span class="ltr">S = 0.05</span>، <span class="ltr">I'<sub>2</sub> = 19.11 A</span>، <span class="ltr">K = 0.0159</span>، <span class="ltr">T = 69.74 Nm</span>، <span class="ltr">I'<sub>2st</sub> = 107.33 A</span>، <span class="ltr">T<sub>st</sub> = 109.9 Nm</span>، <span class="ltr">T<sub>max</sub> = 457.92 Nm</span> عند <span class="ltr">S<sub>m</sub> = 0.6</span>. الحل خطوة بخطوة في تبويب «الأمثلة المحلولة» بنسختين: «كما في الكتاب» و«المصحح».</p>`},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'في الفرع (ب) ص 53 طُبع: \\(T = 0.0159\\times\\frac{0.6}{0.05}\\times(19.11)^2 = 69.74\\ Nm\\). بالأرقام المكتوبة نفسها الناتج <b><span class="ltr">69.68 Nm</span></b> (‏<span class="ltr">0.0159 × 12 × 365.19 = 69.68</span>)؛ والرقم 69.74 قريب مما يخرج لو استُعمل K بدون تقريب (<span class="ltr">0.015915…</span>). الفرق صغير. الحاسبة «كما في الكتاب» تعرض 69.74، و«المصحح» تعرض 69.68.'+'</div>'},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'في الفرع (هـ) ص 54 حُسب العزم الأقصى من (1-37) <b>بإهمال معاوقة العضو الثابت</b> (‏<span class="ltr">X\'<sub>2</sub> = 1</span> فقط وبدون R<sub>1</sub>)، بينما الفروع (أ)–(د) استعملت الدائرة الكاملة (‏<span class="ltr">R<sub>1</sub></span> و <span class="ltr">X<sub>eq</sub> = 2</span>). لذلك <span class="ltr">457.92 Nm</span> لا تطابق قمة منحنى (1-34) لنفس المحرك: قمته الفعلية نحو <span class="ltr">188 Nm</span> عند <span class="ltr">S ≈ 0.29</span> (حساب توضيحي ليس من الكتاب). هذا تبسيط من الكتاب وليس خطأً حسابياً؛ نعتمد 457.92 في الحاسبة كما في الكتاب، وفي «المختبر» تجد مفتاحاً يقارن «طريقة الكتاب (بإهمال معاوقة الثابت)» بـ«المنحنى الكامل».'+'</div>'}
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
   {k:'TL',label:'عزم الحمل T<sub>L</sub> (زر الشكل 1-21)',unit:'Nm',value:60,min:0,max:600,step:0.1}],()=>{fLbl();if(st.pre===21)applyF(st.k);steps.redraw()});
  const fLblT=()=>TP.trainer?'قيم المدرب':'قيم توضيحية',fLbl=()=>{$('#tqFl').textContent=fLblT()};fLbl();
  const fq=k=>{const P={V:240,R1:.4,R2:TP.v.Ro*k,X1:1,X2:1,ns:1800};return {sm:TQ.smF(P),tst:TQ.tst(P)}};   // the figure (1-21) preset at k×Ro (live)
  const applyF=k=>{Object.assign(st,{VL:240,conn:'d',R1:.4,R2:TP.v.Ro,X1:1,X2:1,ns:1800,k:k||1,fam:1,TL:TP.v.TL,pre:21});$('#tqfam').checked=true;setAll();draw()};
  $('#tqF').onclick=()=>applyF();
  const W=()=>{const P=Object.assign(prm(),{R2:st.R2*st.k});return {P,tst:TQ.tst(P),tmf:TQ.tmF(P),so:TQ.opS(P,st.TL)}};
  const steps=stepsUI($('#tqSt'),[
   {t:'قيم مثال (1-8)',x:'اضغط «قيم مثال (1-8)». لاحظ <span class="ltr">T<sub>st</sub> ≈ 109.9 Nm</span> و <span class="ltr">I\'<sub>2st</sub> ≈ 107.33 A</span>، وهي نتائج المثال.',done:()=>st.pre===18},
   {t:'نقطة الحمل الكامل',x:'اجعل عزم الحمل <span class="ltr">T<sub>L</sub> ≈ 69.7 Nm</span>: تقع نقطة التشغيل عند <span class="ltr">S ≈ 0.05</span> أي <span class="ltr">n ≈ 1710 rpm</span>، وهي سرعة الحمل الكامل في المثال.',done:w=>w.so!=null&&Math.abs(w.so-0.05)<0.003},
   {t:'اقلب المحور',x:'اختر «الشكل (1-19): محور S» ثم ارجع إلى الشكل (1-20). هو المنحنى نفسه، والفرق اتجاه المحور فقط.',done:()=>st.orient==='s'},
   {t:'العزم الأقصى بطريقتين',x:'اختر «المنحنى الكامل»: قمة منحنى (1-34) نحو <span class="ltr">188 Nm</span> عند <span class="ltr">S ≈ 0.29</span>. ثم ارجع إلى «طريقة الكتاب»: المنحنى المتقطع البرتقالي (1-35) قمته <span class="ltr">457.92 Nm</span> عند <span class="ltr">S<sub>m</sub> = 0.6</span> لأنه يهمل R<sub>1</sub> و X<sub>1</sub>.',done:()=>st.mode==='full'},
   {t:'حمل أكبر من عزم البدء',x:'ارفع <span class="ltr">T<sub>L</sub></span> فوق عزم البدء وتحت العزم الأقصى: المحرك لا يستطيع أن يبدأ بهذا الحمل، ويستطيع أن يحمله إذا بدأ بحمل خفيف (ص 48).',done:w=>st.TL>w.tst&&st.TL<w.tmf},
   {t:'مقاومة العضو الدوار',get x(){const a=fq(4),b=fq(5);return `اضغط زر «${fLblT()} للشكل (1-21)» ثم اختر <span class="ltr">4Ro</span> ثم <span class="ltr">5Ro</span>: `+(b.sm<1?`تنتقل القمة نحو <span class="ltr">S = 1</span> (من <span class="ltr">S ≈ ${fm(R(a.sm,2))}</span> إلى <span class="ltr">S ≈ ${fm(R(b.sm,2))}</span>)`:a.sm<1?`القمة تنتقل من <span class="ltr">S ≈ ${fm(R(a.sm,2))}</span> وتخرج عن <span class="ltr">S = 1</span> عند 5Ro (<span class="ltr">S ≈ ${fm(R(b.sm,2))}</span>)`:`القمتان خارج <span class="ltr">S = 1</span> بهذه القيم (<span class="ltr">S ≈ ${fm(R(a.sm,2))}</span> ثم <span class="ltr">${fm(R(b.sm,2))}</span>)`)+` و${b.tst>=a.tst?'يرتفع':'ينخفض'} عزم البدء (من <span class="ltr">${fm(R(a.tst,1))}</span> إلى <span class="ltr">${fm(R(b.tst,1))} Nm</span>)، وارتفاع القمة لا يتغير.`},done:()=>st.pre===21&&st.k===5},
   {t:'بعد أن تتجاوز القمة لحظة البدء',get x(){const b=fq(5),c=fq(6),lo=c.tst<b.tst;return `اختر <span class="ltr">6Ro</span>: `+(c.sm>=1?`قمته خارج <span class="ltr">S = 1</span> (<span class="ltr">S ≈ ${fm(R(c.sm,2))}</span>)`:`قمته ما زالت قبل <span class="ltr">S = 1</span> (<span class="ltr">S ≈ ${fm(R(c.sm,2))}</span>)`)+` فصار عزم البدء <b>${lo?'أقل':'أكبر'}</b> من 5Ro (<span class="ltr">${fm(R(c.tst,1))}</span> مقابل <span class="ltr">${fm(R(b.tst,1))} Nm</span>)`+(lo&&c.sm>=1&&b.sm<1?'، كما في الشكل (1-21) (انظر ملاحظة الكتاب في الشرح).':'. عزم البدء يكون أكبر ما يمكن عندما تقع القمة عند <span class="ltr">S = 1</span> تماماً (انظر ملاحظة الكتاب في الشرح).')},done:()=>st.k===6}
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
   note:'<span class="fixnote"><b>ملاحظة على الكتاب:</b> بقيم الكتاب تعرض الحاسبة عزم الحمل الكامل <span class="ltr">69.74 Nm</span> كما طُبع، مع أن الأرقام المكتوبة في السطر نفسه (<span class="ltr">0.0159 × 12 × 19.11²</span>) تعطي <span class="ltr">69.68 Nm</span> (انظر الحل المصحح أسفل). </span>إذا غيّرت أي رقم تحسب الحاسبة بخطوات الكتاب وتقريبه (K بأربع خانات). والعزم الأقصى <span class="ltr">457.92 Nm</span> محسوب بطريقة الكتاب (1-37) التي تهمل معاوقة العضو الثابت.'},
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
const JM=2.0;                                                      // acceleration time constant (s) for the static theory figures; the lab uses the trainer field TP.v.tau (default = JM)
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
 stations:[
  {intro:true},

  {st:1,short:'لماذا تيار البدء عالٍ؟',title:'تيار البدء ولماذا نحتاج طرقاً لتقليله',ref:'ص 58–59',
   q:'لحظة تشغيل محرك كبير قد تخفت الإضاءة في المبنى كله… فمن أين يأتي هذا التيار الكبير؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="شاشة أوسيلسكوب: موجة التيار كبيرة جداً لحظة البدء ثم تصغر وتستقر" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><rect x="30" y="64" width="300" height="190" rx="14" fill="#2C4A40"/><rect data-tip="شاشة الأوسيلسكوب: جهاز يرسم شكل التيار مع الزمن. كل مربع أفقي يمثل ⟦0.1 s⟧ كما هو مكتوب أسفل الشكل (1-22)." x="44" y="80" width="272" height="140" fill="#1F3A31"/><g stroke="#3F6457" stroke-width="1"><path d="M72.6 80V220M101.3 80V220M129.9 80V220M158.5 80V220M187.2 80V220M215.8 80V220M244.4 80V220M273.1 80V220M301.7 80V220"/><path d="M44 100H316M44 120H316M44 140H316M44 160H316M44 180H316M44 200H316"/></g><path d="M44.0 150.0L44.4 150.0L44.9 150.0L45.3 150.0L45.8 150.0L46.2 150.0L46.6 150.0L47.1 150.0L47.5 150.0L48.0 150.0L48.4 150.0L48.8 150.0L49.3 150.0L49.7 150.0L50.1 150.0L50.6 150.0L51.0 150.0L51.5 150.0L51.9 150.0L52.3 150.0L52.8 150.0L53.2 150.0L53.7 150.0L54.1 150.0L54.5 150.0L55.0 150.0L55.4 150.0L55.9 150.0L56.3 150.0L56.7 150.0L57.2 150.0L57.6 150.0L58.0 150.0L58.5 150.0L58.9 150.0L59.4 150.0L59.8 150.0L60.2 150.0L60.7 150.0L61.1 150.0L61.6 150.0L62.0 150.0L62.4 150.0L62.9 150.0L63.3 150.0L63.8 150.0L64.2 139.5L64.6 112.5L65.1 94.5L65.5 89.4L66.0 98.0L66.4 118.2L66.8 145.1L67.3 172.5L67.7 194.3L68.1 205.6L68.6 204.1L69.0 190.5L69.5 168.1L69.9 142.0L70.3 118.3L70.8 102.2L71.2 97.2L71.7 104.2L72.1 121.4L72.5 144.6L73.0 168.7L73.4 188.0L73.9 198.4L74.3 197.7L74.7 186.2L75.2 166.8L75.6 144.0L76.0 123.0L76.5 108.4L76.9 103.5L77.4 109.2L77.8 124.0L78.2 144.3L78.7 165.6L79.1 183.0L79.6 192.6L80.0 192.5L80.4 182.7L80.9 165.8L81.3 145.6L81.8 126.7L82.2 113.4L82.6 108.6L83.1 113.2L83.5 126.1L84.0 144.1L84.4 163.2L84.8 179.0L85.3 188.0L85.7 188.3L86.1 179.9L86.6 164.9L87.0 146.8L87.5 129.7L87.9 117.4L88.3 112.7L88.8 116.4L89.2 127.7L89.7 143.9L90.1 161.2L90.5 175.7L91.0 184.2L91.4 184.9L91.9 177.6L92.3 164.2L92.7 147.8L93.2 132.1L93.6 120.6L94.0 116.0L94.5 119.0L94.9 129.1L95.4 143.7L95.8 159.6L96.2 173.1L96.7 181.2L97.1 182.2L97.6 175.8L98.0 163.7L98.4 148.7L98.9 134.1L99.3 123.2L99.8 118.6L100.2 121.1L100.6 130.1L101.1 143.6L101.5 158.3L102.0 171.0L102.4 178.8L102.8 180.0L103.3 174.4L103.7 163.3L104.1 149.4L104.6 135.7L105.0 125.4L105.5 120.7L105.9 122.8L106.3 131.0L106.8 143.4L107.2 157.2L107.7 169.2L108.1 176.8L108.5 178.2L109.0 173.3L109.4 163.1L109.9 150.0L110.3 137.0L110.7 127.1L111.2 122.5L111.6 124.1L112.0 131.6L112.5 143.2L112.9 156.2L113.4 167.8L113.8 175.2L114.2 176.8L114.7 172.4L115.1 162.9L115.6 150.6L116.0 138.2L116.4 128.6L116.9 123.9L117.3 125.2L117.8 132.0L118.2 143.0L118.6 155.4L119.1 166.5L119.5 173.9L120.0 175.7L120.4 171.7L120.8 162.8L121.3 151.1L121.7 139.2L122.1 129.8L122.6 125.0L123.0 126.0L123.5 132.4L123.9 142.7L124.3 154.7L124.8 165.5L125.2 172.8L125.7 174.8L126.1 171.2L126.5 162.8L127.0 151.5L127.4 140.0L127.9 130.8L128.3 126.0L128.7 126.6L129.2 132.6L129.6 142.5L130.0 154.0L130.5 164.6L130.9 171.8L131.4 174.1L131.8 170.8L132.2 162.8L132.7 152.0L133.1 140.7L133.6 131.6L134.0 126.7L134.4 127.1L134.9 132.7L135.3 142.2L135.8 153.4L136.2 163.8L136.6 171.1L137.1 173.5L137.5 170.5L137.9 162.9L138.4 152.4L138.8 141.4L139.3 132.4L139.7 127.4L140.1 127.5L140.6 132.8L141.0 141.9L141.5 152.9L141.9 163.2L142.3 170.4L142.8 173.0L143.2 170.3L143.7 163.1L144.1 152.9L144.5 142.0L145.0 133.0L145.4 127.9L145.9 127.8L146.3 132.8L146.7 141.6L147.2 152.4L147.6 162.5L148.0 169.8L148.5 172.6L148.9 170.2L149.4 163.2L149.8 153.3L150.2 142.6L150.7 133.6L151.1 128.4L151.6 128.1L152.0 132.8L152.4 141.3L152.9 151.9L153.3 162.0L153.8 169.3L154.2 172.3L154.6 170.1L155.1 163.4L155.5 153.7L155.9 143.1L156.4 134.2L156.8 128.8L157.3 128.3L157.7 132.7L158.1 141.0L158.6 151.4L159.0 161.4L159.5 168.8L159.9 172.0L160.3 170.1L160.8 163.7L161.2 154.1L161.7 143.7L162.1 134.7L162.5 129.2L163.0 128.4L163.4 132.6L163.9 140.7L164.3 150.9L164.7 160.9L165.2 168.4L165.6 171.7L166.0 170.1L166.5 163.9L166.9 154.5L167.4 144.1L167.8 135.1L168.2 129.5L168.7 128.5L169.1 132.4L169.6 140.4L170.0 150.5L170.4 160.4L170.9 168.0L171.3 171.5L171.8 170.1L172.2 164.1L172.6 154.9L173.1 144.6L173.5 135.5L173.9 129.8L174.4 128.6L174.8 132.3L175.3 140.0L175.7 150.0L176.1 160.0L176.6 167.7L177.0 171.4L177.5 170.2L177.9 164.4L178.3 155.3L178.8 145.1L179.2 136.0L179.7 130.0L180.1 128.7L180.5 132.1L181.0 139.7L181.4 149.6L181.9 159.5L182.3 167.3L182.7 171.2L183.2 170.2L183.6 164.7L184.0 155.8L184.5 145.6L184.9 136.4L185.4 130.3L185.8 128.7L186.2 132.0L186.7 139.3L187.1 149.1L187.6 159.1L188.0 167.0L188.4 171.0L188.9 170.3L189.3 164.9L189.8 156.2L190.2 146.0L190.6 136.8L191.1 130.5L191.5 128.7L191.9 131.8L192.4 139.0L192.8 148.7L193.3 158.7L193.7 166.7L194.1 170.9L194.6 170.4L195.0 165.2L195.5 156.6L195.9 146.5L196.3 137.2L196.8 130.8L197.2 128.8L197.7 131.6L198.1 138.6L198.5 148.2L199.0 158.2L199.4 166.4L199.9 170.8L200.3 170.4L200.7 165.5L201.2 157.0L201.6 146.9L202.0 137.5L202.5 131.0L202.9 128.8L203.4 131.4L203.8 138.3L204.2 147.8L204.7 157.8L205.1 166.0L205.6 170.6L206.0 170.5L206.4 165.7L206.9 157.4L207.3 147.3L207.8 137.9L208.2 131.3L208.6 128.8L209.1 131.3L209.5 137.9L209.9 147.3L210.4 157.4L210.8 165.7L211.3 170.5L211.7 170.6L212.1 166.0L212.6 157.8L213.0 147.8L213.5 138.3L213.9 131.5L214.3 128.9L214.8 131.1L215.2 137.6L215.7 146.9L216.1 156.9L216.5 165.4L217.0 170.3L217.4 170.6L217.9 166.3L218.3 158.2L218.7 148.2L219.2 138.7L219.6 131.7L220.0 128.9L220.5 130.9L220.9 137.2L221.4 146.5L221.8 156.5L222.2 165.1L222.7 170.2L223.1 170.7L223.6 166.5L224.0 158.6L224.4 148.7L224.9 139.1L225.3 132.0L225.8 129.0L226.2 130.7L226.6 136.9L227.1 146.1L227.5 156.1L227.9 164.7L228.4 170.0L228.8 170.8L229.3 166.8L229.7 159.0L230.1 149.1L230.6 139.5L231.0 132.2L231.5 129.0L231.9 130.6L232.3 136.6L232.8 145.6L233.2 155.7L233.7 164.4L234.1 169.9L234.5 170.8L235.0 167.0L235.4 159.4L235.9 149.6L236.3 139.9L236.7 132.5L237.2 129.1L237.6 130.4L238.0 136.2L238.5 145.2L238.9 155.2L239.4 164.1L239.8 169.7L240.2 170.9L240.7 167.3L241.1 159.7L241.6 150.0L242.0 140.3L242.4 132.7L242.9 129.1L243.3 130.3L243.8 135.9L244.2 144.8L244.6 154.8L245.1 163.7L245.5 169.6L245.9 170.9L246.4 167.5L246.8 160.1L247.3 150.4L247.7 140.6L248.1 133.0L248.6 129.2L249.0 130.1L249.5 135.6L249.9 144.3L250.3 154.4L250.8 163.4L251.2 169.4L251.7 171.0L252.1 167.8L252.5 160.5L253.0 150.9L253.4 141.0L253.9 133.3L254.3 129.3L254.7 130.0L255.2 135.3L255.6 143.9L256.0 153.9L256.5 163.1L256.9 169.2L257.4 171.0L257.8 168.0L258.2 160.9L258.7 151.3L259.1 141.4L259.6 133.5L260.0 129.4L260.4 129.9L260.9 135.0L261.3 143.5L261.8 153.5L262.2 162.7L262.6 169.0L263.1 171.0L263.5 168.2L263.9 161.3L264.4 151.8L264.8 141.9L265.3 133.8L265.7 129.4L266.1 129.8L266.6 134.7L267.0 143.1L267.5 153.1L267.9 162.4L268.3 168.8L268.8 171.0L269.2 168.4L269.7 161.6L270.1 152.2L270.5 142.3L271.0 134.1L271.4 129.5L271.9 129.6L272.3 134.4L272.7 142.7L273.2 152.6L273.6 162.0L274.0 168.6L274.5 171.0L274.9 168.6L275.4 162.0L275.8 152.6L276.2 142.7L276.7 134.4L277.1 129.6L277.6 129.5L278.0 134.1L278.4 142.3L278.9 152.2L279.3 161.6L279.8 168.4L280.2 171.0L280.6 168.8L281.1 162.3L281.5 153.1L281.9 143.1L282.4 134.7L282.8 129.8L283.3 129.5L283.7 133.8L284.1 141.9L284.6 151.8L285.0 161.3L285.5 168.2L285.9 171.0L286.3 169.0L286.8 162.7L287.2 153.5L287.7 143.5L288.1 135.0L288.5 129.9L289.0 129.4L289.4 133.5L289.8 141.5L290.3 151.3L290.7 160.9L291.2 168.0L291.6 171.0L292.0 169.2L292.5 163.0L292.9 153.9L293.4 143.9L293.8 135.3L294.2 130.0L294.7 129.3L295.1 133.3L295.6 141.1L296.0 150.9L296.4 160.5L296.9 167.7L297.3 170.9L297.8 169.4L298.2 163.4L298.6 154.4L299.1 144.4L299.5 135.6L299.9 130.2L300.4 129.2L300.8 133.0L301.3 140.7L301.7 150.4L302.1 160.1L302.6 167.5L303.0 170.9L303.5 169.5L303.9 163.7L304.3 154.8L304.8 144.8L305.2 135.9L305.7 130.3L306.1 129.2L306.5 132.8L307.0 140.3L307.4 150.0" fill="none" stroke="#F2C14E" stroke-width="1.2"/><rect data-tip="لحظة البدء: التيار كبير جداً، يتراوح عادةً من 6 إلى 8 أضعاف التيار المقنن." x="56" y="82" width="44" height="136" fill="transparent"/><rect data-tip="بعد أن يتسارع المحرك يصغر التيار ويستقر على قيمة ثابتة أصغر بكثير." x="160" y="110" width="150" height="80" fill="transparent"/><text x="316" y="240" text-anchor="end" font-size="11" fill="#FBF6EE" direction="ltr" font-family="var(--mono)">scale: 0.1 sec. / div.</text><text x="180" y="290" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">تيار البدء لمحرك صغير</text></svg>`,
   cap:'رسم مبسط للشكل <span class="ltr">(1-22)</span>: الموجة كبيرة في البداية ثم تصغر خلال جزء من الثانية.<br><b>مرّر المؤشر على بداية الموجة ونهايتها والشاشة (أو المسه في الجوال) لتعرف معناها.</b>',
   side:[
    {add:String.raw`<p>ربما لاحظت أن الإضاءة في البيت تخفت لحظةً عندما يشتغل ضاغط المكيف أو مضخة الماء. هذا هو «هبوط الجهد» الذي يذكره الكتاب في المشكلة الثالثة: تيار البدء الكبير يسحب جزءاً من الجهد على الأسلاك فينقص الجهد عند بقية الأجهزة في الخط نفسه.</p>`},
    {predict:{q:'لماذا يكون تيار البدء عالياً جداً؟',opts:[
     ['لأن جهد المصدر يرتفع لحظة التشغيل',false,'جهد المصدر ثابت؛ ما يتغير هو المعاوقة التي يراها التيار.'],
     ['لأن الانزلاق عند البدء يساوي 1، فالمقاومة الممثلة للحمل تصبح صفراً (مقصورة)',true,String.raw`\(R'_2\left(\frac{1-1}{1}\right)=0\) فلا يحد التيار إلا مقاومات الملفات ومعاوقاتها الصغيرة، كما في ص 58.`],
     ['لأن المحرك يكون بارداً فتقل مقاومة ملفاته',false,'هذا ليس تعليل الكتاب؛ السبب هو الانزلاق الذي يساوي 1 لحظة البدء.']]}}
   ],
   body:[
    {book:String.raw`<p>بالرجوع إلى الدائرة المكافئة نجد أن المقاومة \(R'_2\left(\frac{1-S}{S}\right)\) تعتمد على قيمة الانزلاق، وحيث إن قيمة الانزلاق تكون مساوية للواحد عند بدء تشغيل المحرك، فهذا يعني أن المقاومة \(R'_2\left(\frac{1-S}{S}\right)\) أصبحت <b>مقصورة عند البدء</b> لأن (\(R'_2\left(\frac{1-1}{1}\right)=0\)) وهذا يعني أن تيار البدء أصبح عالياً جداً. (تيار البدء عادةً يتراوح من <b>6 إلى 8 أضعاف</b> التيار المقنن)، انظر الشكل (1-22).</p>
     <p>هذا التيار العالي عند البدء يتسبب في وجود بعض المشاكل مثل:</p>
     <ol><li>رفع درجة حرارة ملفات المحرك مما يؤدي مع تكرار البدء إلى انهيار عزلها.</li><li>التأثير على وسائل توصيل الكهرباء إلى المحرك كالكيابل والقواطع وأجهزة الحماية.</li><li>حدوث هبوط في جهد الأجهزة المشتركة مع المحرك في نفس الخط.</li></ol>
     <p>لذلك لابد من إيجاد وسائل لتقليل قيمة تيار البدء خصوصاً في المحركات الكبيرة. فيما يلي عدة طرق لتقليل تيار البدء جميعها تعتمد على المعادلة (1-39) وذلك <b>إما بتقليل البسط (الجهد)</b> و<b>إما بزيادة المقام</b> (مقاومات العضو الثابت أو الدوار).</p>`,ref:'ص 58'},
    {book:String.raw`<div class="eq">$$I'_{2st}=\frac{V_{ph}}{\sqrt{(R_1+R'_2)^2+X_{eq}^2}}$$<span class="eqno">(1-39)</span></div>`,ref:'ص 59'},
    {title:'كل طريقة تغيّر جزءاً من المعادلة (1-39)',widget:(el,B)=>{
      const M=[['مقاومات على التوالي مع العضو الثابت','n','تقلل الجهد المسلط على العضو الثابت (ص 59).'],['المحول الذاتي','n','يخفض الجهد المسلط على ملفات العضو الثابت (ص 61).'],['نجمة / دلتا','n',String.raw`جهد الوجه يقل إلى \(\frac{1}{\sqrt3}\) من جهد المصدر (ص 62).`],['مقاومات مع العضو الدوار','d',String.raw`تضاف إلى \(R'_2\) فتزيد المقام (ص 64).`],['الأجهزة الإلكترونية','n','تتحكم بنعومة في الجهد مع مراقبة التيار (ص 65).']];
      el.innerHTML=`<p class="sub" style="margin:0 0 8px">اضغط على طريقة لترى أي جزء من المعادلة تغيّره: البسط (الجهد) أم المقام (المقاومات).</p>
       <div dir="ltr" style="text-align:center;font-size:1.2em;margin:10px 0"><span data-p="n" style="padding:2px 8px;border-radius:8px">\\(V_{ph}\\)</span> <span>÷</span> <span data-p="d" style="padding:2px 8px;border-radius:8px">\\(\\sqrt{(R_1+R'_2)^2+X_{eq}^2}\\)</span></div>
       <div class="w-row">${M.map((m,i)=>`<button class="btn" type="button" data-i="${i}">${m[0]}</button>`).join('')}</div><p class="sub" data-t style="margin-top:10px"></p>`;
      B.math(el);
      const pick=i=>{const m=M[i];el.querySelectorAll('[data-p]').forEach(s=>{const on=s.dataset.p===m[1];s.style.background=on?'var(--live-soft)':'';s.style.outline=on?'2px solid var(--live)':''});
        const t=el.querySelector('[data-t]');t.innerHTML=`<b>${m[1]==='n'?'تقليل البسط (الجهد)':'زيادة المقام (المقاومة)'}:</b> ${m[2]}`;B.math(t);
        el.querySelectorAll('[data-i]').forEach(b=>b.classList.toggle('pri',+b.dataset.i===i))};
      el.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>pick(+b.dataset.i));pick(0);
    }},
    {tip:String.raw`<p>المعادلة (1-39) هي المعادلة (1-33) نفسها بعد وضع \(S=1\). لذلك كل طرق البدء تفعل أحد أمرين: تخفض الجهد على الملفات، أو تضيف مقاومة في طريق التيار، ثم تُلغي ذلك بعد أن يتسارع المحرك.</p>`}
   ]},

  {st:2,short:'مقاومات الثابت',title:'1ـ توصيل مقاومات على التوالي مع ملفات العضو الثابت',ref:'ص 59–60',
   q:'أبسط فكرة: نضع مقاومة في طريق التيار ثم نزيلها… فما الثمن؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ثلاثة خطوط من المصدر تمر بمقاومات على التوالي قبل أن تصل إلى المحرك، والمقاومات تسخن" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><g fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round"><path d="M120 40 V108 M180 40 V108 M240 40 V108"/><path d="M120 188 V214 L162 244 M180 188 V236 M240 188 V214 L198 244"/></g><g data-tip="مقاومات على التوالي مع ملفات العضو الثابت (واحدة لكل وجه): يهبط عليها جزء من الجهد فيقل الجهد على الملفات ويقل تيار البدء حسب المعادلة (1-39)."><g fill="none" stroke="#E8735A" stroke-width="3.5" stroke-linejoin="round"><path d="M120 108 l9 5 l-18 10 l18 10 l-18 10 l18 10 l-18 10 l18 10 l-18 10 l9 5"/><path d="M180 108 l9 5 l-18 10 l18 10 l-18 10 l18 10 l-18 10 l18 10 l-18 10 l9 5"/><path d="M240 108 l9 5 l-18 10 l18 10 l-18 10 l18 10 l-18 10 l18 10 l-18 10 l9 5"/></g><rect x="104" y="104" width="152" height="88" fill="transparent"/></g><g data-tip="الحرارة في المقاومات: هي عيب هذه الطريقة، زيادة المفاقيد النحاسية، ولذلك لا تناسب المحركات الكبيرة."><rect x="268" y="112" width="44" height="66" fill="transparent"/><path d="M276 172 q-7 -8 0 -16 q7 -8 0 -16 q-7 -8 0 -16" fill="none" stroke="#E8735A" stroke-width="3" stroke-linecap="round"/><path d="M300 172 q-7 -8 0 -16 q7 -8 0 -16 q-7 -8 0 -16" fill="none" stroke="#E8735A" stroke-width="3" stroke-linecap="round"/></g><g data-tip="المحرك الحثي ثلاثي الأوجه ⟦M 3~⟧."><circle cx="180" cy="262" r="26" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><text x="180" y="262" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)">M</text><text x="180" y="277" text-anchor="middle" font-size="11" fill="#2C4A40" font-family="var(--mono)">3~</text></g><g font-family="var(--mono)" font-size="13" fill="#2C4A40" text-anchor="middle"><text x="120" y="34">L1</text><text x="180" y="34">L2</text><text x="240" y="34">L3</text></g><text x="60" y="154" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">مقاومات</text></svg>`,
   cap:'المقاومات البرتقالية في طريق التيار تخفض الجهد على الملفات عند البدء، لكنها تسخن.<br><b>مرّر المؤشر على المقاومات والحرارة والمحرك (أو المسه في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'ما عيب البدء بمقاومات على التوالي مع ملفات العضو الثابت؟',opts:[
     ['لا تقلل تيار البدء',false,'بل تقلله، لأنها تقلل الجهد المسلط على العضو الثابت.'],
     ['تحتاج محركاً ذا حلقات انزلاق',false,'هذا شرط طريقة مقاومات العضو الدوار، لا العضو الثابت.'],
     ['تزيد المفاقيد النحاسية، فلا تناسب المحركات الكبيرة',true,'هذا ما يذكره الكتاب في ص 59.']]}}
   ],
   body:[
    {book:String.raw`<p>إن توصيل مقاومات على التوالي مع ملفات العضو الثابت يؤدي إلى تقليل الجهد المسلط على العضو الثابت وبالتالي يقل تيار البدء طبقاً للمعادلة (1-39)، ثم بعد اجتياز فترة البدء يمكن إلغاء هذه المقاومات تدريجياً. <b>عيب هذه الطريقة</b> هو زيادة المفاقيد النحاسية مما يجعلها غير مناسبة للاستخدام خصوصاً مع المحركات الكبيرة انظر الشكلين (1-23) و (1-24).</p>`,ref:'ص 59'},
    {book:String.raw`<p><b>مراحل التشغيل:</b></p><ul>
     <li><b>المرحلة الأولى:</b> يتم التوصيل عبر كامل المقاومة بواسطة إغلاق القاطع رقم 1 ويقابله على منحنيات التشغيل الجزء المشار إليه بالرقم 1.</li>
     <li><b>المرحلة الثانية:</b> يتم التوصيل عبر نصف المقاومة بواسطة إغلاق القاطع رقم 2 ويقابله على منحنيات التشغيل الجزء المشار إليه بالرقم 2.</li>
     <li><b>المرحلة الثالثة:</b> يتم التوصيل المباشر بإزالة الجزء المتبقي من المقاومة بواسطة إغلاق القاطع رقم 3 ويقابله على منحنيات التشغيل الجزء المشار إليه بالرقم 3.</li></ul>`,ref:'ص 60'},
    {title:'الشكلان (1-23) و(1-24): نفّذ المراحل',widget:(el,B)=>{
      const mk='sr',P=[{"1":1},{"1":1,"2":1},{"1":1,"2":1,"3":1}],N=["المرحلة الأولى","المرحلة الثانية","المرحلة الثالثة"],tr=autoRun(mk);let k=0;
      el.innerHTML=`<p class="sub" style="margin:0 0 8px">اختر المرحلة لترى القواطع المغلقة (الدائرة الخضراء) ومسار التيار في مخطط التوصيل، وأين تقع المرحلة على منحنيي العزم والتيار (القيم منسوبة إلى المقننة، ومقدرة من شكل الكتاب).</p><div class="w-row" style="margin-top:0">${N.map((t,i)=>`<button class="btn" type="button" data-k="${i}">${t}</button>`).join('')}</div><div class="u1b-two" style="margin-top:10px"><div data-c></div><div data-g></div></div>${scLegend}`;
      const draw=()=>{const c=Object.assign(C0(),P[k]),s=SM[mk].state(c),t=tr.filter(q=>q[3]<=k),pt=t[t.length-1];
        el.querySelector('[data-c]').innerHTML=box(circSVG(mk,c,1),360);
        el.querySelector('[data-g]').innerHTML=box(scChart('T',mk,t,pt,s.cv),440)+box(scChart('I',mk,t,pt,s.cv),440);
        el.querySelectorAll('[data-k]').forEach(b=>b.classList.toggle('pri',+b.dataset.k===k))};
      el.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{k=+b.dataset.k;draw()});draw();
    }},
    {tip:String.raw`<p>في كل مرحلة نزيل جزءاً من المقاومة، فيقفز التيار والعزم قليلاً ثم يعودان للنقصان مع ازدياد السرعة. بعد المرحلة الثالثة يعمل المحرك كأنه موصول مباشرة.</p>`}
   ]},

  {st:3,short:'المحول الذاتي',title:'2ـ باستخدام محول ذاتي (التحكم في الجهد)',ref:'ص 61–62',
   q:'هل يمكن أن نخفض الجهد عند البدء دون أن نحرق جزءاً من القدرة في مقاومات؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="محول ذاتي: ملف واحد يتصل طرفه العلوي بالمصدر، ويؤخذ من نقطة في منتصفه جهد أقل إلى المحرك" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round"><path d="M140 36 V70"/><path d="M140 250 V272 H220"/><path d="M152 160 H262 V200"/></g><g data-tip="ملف المحول الذاتي: ملف واحد على قلب حديدي، يتصل طرفه العلوي بالمصدر وطرفه السفلي بنقطة النجمة."><path d="M140 70 a12 10 0 0 1 0 20 a12 10 0 0 1 0 20 a12 10 0 0 1 0 20 a12 10 0 0 1 0 20 a12 10 0 0 1 0 20 a12 10 0 0 1 0 20 a12 10 0 0 1 0 20 a12 10 0 0 1 0 20 a12 10 0 0 1 0 20" fill="none" stroke="#4FB3A9" stroke-width="4"/><rect x="118" y="66" width="40" height="188" fill="transparent"/><line x1="108" y1="70" x2="108" y2="250" stroke="#2C4A40" stroke-width="4"/><line x1="100" y1="70" x2="100" y2="250" stroke="#2C4A40" stroke-width="4"/></g><g data-tip="نقطة التفريعة (tap): يؤخذ منها جهد أقل من جهد المصدر يتناسب مع تيار البدء المسموح به."><circle cx="152" cy="160" r="7" fill="#E8735A"/><rect x="142" y="150" width="20" height="20" fill="transparent"/></g><g data-tip="المحرك يأخذ الجهد المخفض عند البدء، ثم بعد البدء يُسلَّط عليه جهد المصدر كاملاً بفصل المحول."><circle cx="262" cy="224" r="26" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><text x="262" y="224" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)">M</text><text x="262" y="239" text-anchor="middle" font-size="11" fill="#2C4A40" font-family="var(--mono)">3~</text></g><text x="140" y="30" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">جهد المصدر</text><text x="214" y="150" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">جهد أقل</text><text x="250" y="290" text-anchor="middle" font-size="12" fill="#2C4A40">إلى نقطة النجمة</text></svg>`,
   cap:'رسم مبسط لوجه واحد: المحرك يأخذ جهده من نقطة في منتصف ملف المحول، فيبدأ بجهد أقل.<br><b>مرّر المؤشر على الملف ونقطة التفريعة والمحرك (أو المسه في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'لماذا يصف الكتاب طريقة المحول الذاتي بأنها «مثالية جداً»؟',opts:[
     ['لأنه لا يوجد فيها أي قدرة مفقودة',true,'المحول يخفض الجهد دون مقاومات تسخن، كما في نص ص 61.'],
     ['لأنها تزيد عزم البدء على التوصيل المباشر',false,'خفض الجهد يقلل العزم أيضاً؛ ميزتها عدم فقد القدرة.'],
     ['لأنها لا تحتاج أي قواطع',false,'تحتاج ثلاثة قواطع كما في الشكل (1-25).']]}}
   ],
   body:[
    {book:String.raw`<p>في هذه الطريقة يتم توصيل أطراف العضو الثابت إلى محول ذاتي ثلاثي الأوجه بحيث يخفض الجهد المسلط على ملفات العضو الثابت إلى قيمة تتناسب مع تيار البدء المسموح به، وبعد اجتياز المحرك لفترة البدء يتم تسليط جهد المصدر كاملاً على ملفات العضو الثابت وذلك بفصل المحول. هذه الطريقة <b>مثالية جداً حيث لا يوجد فيها أي قدرة مفقودة</b>. كما أنها تعتبر <b>الخيار الأفضل للمحركات التي تم توصيل ملفاتها داخلياً من قبل المصنع على شكل نجمة</b>. انظر الشكلين (1-25) و (1-26).</p>`,ref:'ص 61'},
    {book:String.raw`<p><b>مراحل التشغيل:</b></p><ul>
     <li><b>المرحلة الأولى:</b> يتم التوصيل عبر المحول الذاتي بواسطة إغلاق القاطعين رقم 3 و 1 معاً ويقابله على منحنيات التشغيل الجزء المشار إليه بالرقم 1.</li>
     <li><b>المرحلة الثانية:</b> يتم فتح القاطع رقم 3 مع بقاء القاطع رقم 1 مغلقاً ويقابله على منحنيات التشغيل الجزء المشار إليه بالرقم 2.</li>
     <li><b>المرحلة الثالثة:</b> يتم التوصيل المباشر بإزالة المحول الذاتي تماماً بواسطة إغلاق القاطع رقم 2 ويقابله على منحنيات التشغيل الجزء المشار إليه بالرقم 3.</li></ul>`,ref:'ص 62'},
    {title:'الشكلان (1-25) و(1-26): نفّذ المراحل',widget:(el,B)=>{
      const mk='at',P=[{"1":1,"3":1},{"1":1},{"1":1,"2":1}],N=["المرحلة الأولى","المرحلة الثانية","المرحلة الثالثة"],tr=autoRun(mk);let k=0;
      el.innerHTML=`<p class="sub" style="margin:0 0 8px">اختر المرحلة لترى القواطع المغلقة (الدائرة الخضراء) ومسار التيار في مخطط التوصيل، وأين تقع المرحلة على منحنيي العزم والتيار (القيم منسوبة إلى المقننة، ومقدرة من شكل الكتاب).</p><div class="w-row" style="margin-top:0">${N.map((t,i)=>`<button class="btn" type="button" data-k="${i}">${t}</button>`).join('')}</div><div class="u1b-two" style="margin-top:10px"><div data-c></div><div data-g></div></div>${scLegend}`;
      const draw=()=>{const c=Object.assign(C0(),P[k]),s=SM[mk].state(c),t=tr.filter(q=>q[3]<=k),pt=t[t.length-1];
        el.querySelector('[data-c]').innerHTML=box(circSVG(mk,c,1),360);
        el.querySelector('[data-g]').innerHTML=box(scChart('T',mk,t,pt,s.cv),440)+box(scChart('I',mk,t,pt,s.cv),440);
        el.querySelectorAll('[data-k]').forEach(b=>b.classList.toggle('pri',+b.dataset.k===k))};
      el.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{k=+b.dataset.k;draw()});draw();
    }},
    {tip:String.raw`<p>لا يذكر الكتاب فتح القاطع 1 في المرحلة الثالثة. إغلاق القاطع 2 يوصل الخط بنقطة التفريعة مباشرة فيُقصر الجزء العلوي من ملف المحول ولا يمر فيه تيار، لذلك يعمل المحرك مباشرة سواء بقي القاطع 1 مغلقاً أو فُتح. وفي المرحلة الثانية يبقى الجزء العلوي من الملف على التوالي مع المحرك فيعمل كممانعة تحد التيار.</p>`}
   ]},

  {st:4,short:'نجمة / دلتا',title:'3ـ تغيير توصيل ملفات العضو الثابت من نجمة إلى دلتا',ref:'ص 62–63',
   q:'الملفات نفسها، بلا مقاومات ولا محول… فقط نغيّر طريقة توصيلها لحظة البدء. كيف يقل التيار؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الملفات الثلاثة موصلة نجمة عند البدء، ثم دلتا في التشغيل العادي" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="توصيل نجمة ⟦Y⟧ عند البدء: يقع على كل ملف جهد الوجه، وهو ⟦1/√3⟧ من جهد المصدر، فينخفض تيار الخط إلى ⟦1/3⟧ تيار الدلتا."><rect x="40" y="70" width="120" height="150" fill="transparent"/><g stroke="#4FB3A9" stroke-width="7" stroke-linecap="round"><line x1="100" y1="150" x2="100" y2="88"/><line x1="100" y1="150" x2="46.3" y2="181"/><line x1="100" y1="150" x2="153.7" y2="181"/></g><circle cx="100" cy="150" r="7" fill="#2C4A40"/><g fill="#2C4A40"><circle cx="100" cy="84" r="5"/><circle cx="43" cy="183" r="5"/><circle cx="157" cy="183" r="5"/></g></g><g data-tip="توصيل دلتا ⟦Δ⟧ في التشغيل العادي: يقع جهد المصدر (الخط) كاملاً على كل ملف."><rect x="200" y="70" width="130" height="150" fill="transparent"/><g stroke="#E8735A" stroke-width="7" stroke-linecap="round"><line x1="265" y1="88" x2="210" y2="183"/><line x1="210" y1="183" x2="320" y2="183"/><line x1="320" y1="183" x2="265" y2="88"/></g><g fill="#2C4A40"><circle cx="265" cy="84" r="5"/><circle cx="207" cy="186" r="5"/><circle cx="323" cy="186" r="5"/></g></g><g data-tip="بعد أن يجتاز المحرك فترة البدء يعاد توصيل الملفات دلتا."><line x1="160" y1="134" x2="196" y2="134" stroke="#2C4A40" stroke-width="3"/><polygon points="206,134 192,126 192,142" fill="#2C4A40"/><rect x="158" y="120" width="50" height="28" fill="transparent"/></g><text x="100" y="234" text-anchor="middle" font-size="22" fill="#2C4A40" font-weight="700" font-family="var(--mono)">Y</text><text x="265" y="234" text-anchor="middle" font-size="22" fill="#2C4A40" font-weight="700" font-family="var(--mono)">Δ</text><text x="100" y="262" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">عند البدء</text><text x="265" y="262" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">التشغيل العادي</text></svg>`,
   cap:'الملفات الثلاثة نفسها: نجمة عند البدء، ثم دلتا بعد أن يتسارع المحرك.<br><b>مرّر المؤشر على النجمة والدلتا والسهم (أو المسه في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'عند البدء نجمة بدلاً من دلتا، يصبح تيار الخط…',opts:[
     [String.raw`\(\frac{1}{\sqrt3}\) تيار الدلتا`,false,String.raw`هذه نسبة الجهد على الملف لا نسبة تيار الخط.`],
     [String.raw`نصف تيار الدلتا`,false,'النسبة في الكتاب ليست النصف.'],
     [String.raw`\(\frac{1}{3}\) تيار الدلتا`,true,'هذا نص الكتاب في ص 62.'],
     ['مثل تيار الدلتا تماماً',false,'تغيير التوصيل يغيّر الجهد على كل ملف، فيتغير التيار.']]}}
   ],
   body:[
    {book:String.raw`<p>هذه الطريقة مناسبة <b>للمحركات ذات الستة أطراف والتي توصل ملفاتها على شكل دلتا أثناء التشغيل العادي</b> حيث توصل ملفات العضو الثابت عند البدء على شكل نجمة ونتيجةً لذلك فإن جهد الوجه سيقل إلى (\(1/\sqrt{3}\)) من جهد المصدر وينخفض تيار الخط إلى (\(1/3\)) التيار المار في حالة التوصيل على شكل دلتا، وبعد أن يجتاز المحرك فترة البدء يتم إعادة توصيل الملفات على شكل دلتا، انظر الشكلين (1-27) و (1-28).</p>`,ref:'ص 62'},
    {book:String.raw`<p><b>مراحل التشغيل:</b></p><ul>
     <li><b>المرحلة الأولى:</b> يتم التشغيل بواسطة إغلاق القاطعين رقم 2 و1 وبهذه الحالة تكون ملفات المحرك موصلة على شكل Y ويقابله على منحنيات التشغيل الجزء المشار إليه بالرمز Y.</li>
     <li><b>المرحلة الثانية:</b> يتم التشغيل بواسطة فتح القاطع رقم 2 وإغلاق القاطع رقم 3 مع بقاء القاطع رقم 1 مغلقاً وبهذه الحالة تكون ملفات المحرك موصلة على شكل Δ ويقابله على منحنيات التشغيل الجزء المشار إليه بالرمز Δ.</li></ul>`,ref:'ص 63'},
    {title:'الشكلان (1-27) و(1-28): نفّذ المراحل',widget:(el,B)=>{
      const mk='sd',P=[{"1":1,"2":1},{"1":1,"3":1}],N=["المرحلة الأولى (Y)","المرحلة الثانية (Δ)"],tr=autoRun(mk);let k=0;
      el.innerHTML=`<p class="sub" style="margin:0 0 8px">اختر المرحلة لترى القواطع المغلقة (الدائرة الخضراء) ومسار التيار في مخطط التوصيل، وأين تقع المرحلة على منحنيي العزم والتيار (القيم منسوبة إلى المقننة، ومقدرة من شكل الكتاب).</p><div class="w-row" style="margin-top:0">${N.map((t,i)=>`<button class="btn" type="button" data-k="${i}">${t}</button>`).join('')}</div><div class="u1b-two" style="margin-top:10px"><div data-c></div><div data-g></div></div>${scLegend}`;
      const draw=()=>{const c=Object.assign(C0(),P[k]),s=SM[mk].state(c),t=tr.filter(q=>q[3]<=k),pt=t[t.length-1];
        el.querySelector('[data-c]').innerHTML=box(circSVG(mk,c,1),360);
        el.querySelector('[data-g]').innerHTML=box(scChart('T',mk,t,pt,s.cv),440)+box(scChart('I',mk,t,pt,s.cv),440);
        el.querySelectorAll('[data-k]').forEach(b=>b.classList.toggle('pri',+b.dataset.k===k))};
      el.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{k=+b.dataset.k;draw()});draw();
    }},
    {tip:String.raw`<p>من أين جاء الثلث؟ في النجمة يقل الجهد على كل ملف إلى \(\frac{1}{\sqrt3}\) فيقل تيار الملف بالنسبة نفسها. وفي الدلتا تيار الخط أكبر من تيار الملف بـ \(\sqrt3\)، فيصبح تيار الخط في النجمة \(\frac{1}{\sqrt3}\times\frac{1}{\sqrt3}=\frac13\) تيار الخط في الدلتا.</p>`},
    {watch:String.raw`<p>لا يُغلق قاطع النجمة (2) وقاطع الدلتا (3) معاً أبداً: هذا قصر بين الأوجه. لذلك يُفتح القاطع 2 أولاً ثم يُغلق القاطع 3، كما في ترتيب المرحلة الثانية.</p>`}
   ]},

  {st:5,short:'مقاومات الدوار',title:'4ـ إضافة مقاومات موصلة على التوالي مع ملفات العضو الدوار',ref:'ص 64–65',
   q:'في محرك حلقات الانزلاق نستطيع أن نصل إلى ملفات العضو الدوار نفسها… فماذا نكسب من ذلك عند البدء؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="عضو دوار ملفوف بثلاث حلقات انزلاق، تتصل عبر فرش بثلاث مقاومات بدء موصلة نجمة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><rect x="30" y="152" width="170" height="14" rx="4" fill="#E9B949" stroke="#B9852A" stroke-width="1.5"/><g data-tip="العضو الدوار الملفوف (ذو حلقات الانزلاق): هذه الطريقة خاصة به فقط."><rect x="46" y="104" width="76" height="110" rx="10" fill="#CFE6DB" stroke="#2C4A40" stroke-width="3"/><g stroke="#E8735A" stroke-width="4"><line x1="62" y1="112" x2="62" y2="206"/><line x1="84" y1="112" x2="84" y2="206"/><line x1="106" y1="112" x2="106" y2="206"/></g></g><g data-tip="حلقات الانزلاق والفرش: أطراف العضو الدوار ⟦R S T⟧ تخرج عبرها إلى المقاومات."><rect x="136" y="128" width="10" height="62" rx="3" fill="#B9852A"/><rect x="154" y="128" width="10" height="62" rx="3" fill="#B9852A"/><rect x="172" y="128" width="10" height="62" rx="3" fill="#B9852A"/><rect x="134" y="110" width="14" height="16" rx="2" fill="#2C4A40"/><rect x="152" y="110" width="14" height="16" rx="2" fill="#2C4A40"/><rect x="170" y="110" width="14" height="16" rx="2" fill="#2C4A40"/></g><g fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round"><path d="M141 110 V44 H300 V120"/><path d="M159 110 V58 H270 V120"/><path d="M177 110 V72 H240 V120"/><path d="M240 200 V236 H300 V200 M270 200 V236"/></g><g data-tip="مقاومات البدء: تزيد المقام في المعادلة (1-39) فيقل تيار البدء، وتضاف إلى ⟦R'2⟧ فينتقل موضع العزم الأقصى. تُزال تدريجياً بعد البدء لتجنب زيادة المفاقيد."><g fill="none" stroke="#12855A" stroke-width="3" stroke-linejoin="round"><path d="M240 120 l7 5 l-14 10 l14 10 l-14 10 l14 10 l-14 10 l14 10 l-14 10 l7 5"/><path d="M270 120 l7 5 l-14 10 l14 10 l-14 10 l14 10 l-14 10 l14 10 l-14 10 l7 5"/><path d="M300 120 l7 5 l-14 10 l14 10 l-14 10 l14 10 l-14 10 l14 10 l-14 10 l7 5"/></g><rect x="226" y="116" width="92" height="88" fill="transparent"/></g><circle cx="270" cy="236" r="5" fill="#2C4A40"/><text x="270" y="262" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">مقاومات البدء</text><text x="84" y="236" text-anchor="middle" font-size="12" fill="#2C4A40">العضو الدوار</text></svg>`,
   cap:'مقاومات البدء تتصل بملفات العضو الدوار عبر حلقات الانزلاق والفرش، وتُزال على مراحل بعد البدء.<br><b>مرّر المؤشر على العضو الدوار والحلقات والمقاومات (أو المسه في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'هذه الطريقة تناسب…',opts:[
     ['المحرك ذا القفص السنجابي',false,'قضبان القفص مقصورة داخل المحرك ولا أطراف لها نصل بها مقاومات.'],
     ['المحرك ذا حلقات الانزلاق فقط',true,'هذا نص الكتاب في ص 64، وهي الأفضل له.'],
     ['كل المحركات الحثية',false,'تحتاج الوصول إلى ملفات العضو الدوار، ولا يتوفر ذلك إلا بحلقات الانزلاق.']]}}
   ],
   body:[
    {book:String.raw`<p>هذه الطريقة <b>خاصة فقط بالمحرك ذو حلقات الانزلاق</b> حيث يمكن توصيل مقاومات على التوالي مع ملفات العضو الدوار، وبالتالي فإن تيار البدء يقل نتيجة لزيادة المقاومة في المعادلة (1-39)، وبعد أن يجتاز المحرك فترة البدء يتم إزالة هذه المقاومات تدريجياً وذلك لتجنب زيادة المفاقيد في دائرة العضو الدوار. هذه الطريقة تعتبر الأفضل للمحركات ذات حلقات الانزلاق، كما أنها <b>تزيد من عزم البدء</b> للمحرك وذلك لأن مقاومة البدء تضاف إلى \(R'_2\) وبالتالي فإن الانزلاق الذي يحدث عنده أعلى عزم يزداد وبالتالي ينتقل موضع العزم الأقصى إلى الأمام مما يؤدي إلى زيادة عزم البدء، انظر الشكلين (1-29) و (1-30).</p>`,ref:'ص 64'},
    {book:String.raw`<p><b>مراحل التشغيل:</b></p><ul>
     <li><b>المرحلة الأولى:</b> يتم قصر أطراف العضو الدوار عبر كامل المقاومة المضافة بواسطة فتح القاطعين رقم 2 و1 ويقابله على منحنيات التشغيل الجزء المشار إليه بالرقم 1.</li>
     <li><b>المرحلة الثانية:</b> يتم القصر عبر نصف المقاومة المضافة بواسطة إغلاق القاطع رقم 1 فقط ويقابله على منحنيات التشغيل الجزء المشار إليه بالرقم 2.</li>
     <li><b>المرحلة الثالثة:</b> يتم قصر أطراف العضو الدوار مباشرة بواسطة إغلاق القاطع رقم 2 بالإضافة إلى القاطع رقم 1 ويقابله على منحنيات التشغيل الجزء المشار إليه بالرقم 3.</li></ul>`,ref:'ص 65'},
    {title:'الشكلان (1-29) و(1-30): نفّذ المراحل',widget:(el,B)=>{
      const mk='rr',P=[{"CB":1},{"1":1,"CB":1},{"1":1,"2":1,"CB":1}],N=["المرحلة الأولى","المرحلة الثانية","المرحلة الثالثة"],tr=autoRun(mk);let k=0;
      el.innerHTML=`<p class="sub" style="margin:0 0 8px">اختر المرحلة لترى القواطع المغلقة (الدائرة الخضراء) ومسار التيار في مخطط التوصيل، وأين تقع المرحلة على منحنيي العزم والتيار (القيم منسوبة إلى المقننة، ومقدرة من شكل الكتاب).</p><div class="w-row" style="margin-top:0">${N.map((t,i)=>`<button class="btn" type="button" data-k="${i}">${t}</button>`).join('')}</div><div class="u1b-two" style="margin-top:10px"><div data-c></div><div data-g></div></div>${scLegend}`;
      const draw=()=>{const c=Object.assign(C0(),P[k]),s=SM[mk].state(c),t=tr.filter(q=>q[3]<=k),pt=t[t.length-1];
        el.querySelector('[data-c]').innerHTML=box(circSVG(mk,c,1),360);
        el.querySelector('[data-g]').innerHTML=box(scChart('T',mk,t,pt,s.cv),440)+box(scChart('I',mk,t,pt,s.cv),440);
        el.querySelectorAll('[data-k]').forEach(b=>b.classList.toggle('pri',+b.dataset.k===k))};
      el.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{k=+b.dataset.k;draw()});draw();
    }},
    {watch:String.raw`<p>يقول النص في ص 64 إن مقاومات العضو الدوار «تزيد من عزم البدء»، لكن الشكل (1-30) في الصفحة نفسها يُظهر عزم البدء عبر المقاومات نحو <span class="ltr">0.4 T<sub>n</sub></span> وهو <b>أقل</b> من عزم البدء بالتوصيل المباشر (نحو <span class="ltr">2 T<sub>n</sub></span>). رسمنا المنحنيات كما في الشكل. والنص صحيح إذا اختيرت المقاومة بحيث لا تتجاوز قمة العزم لحظة البدء (الشكل 1-21)؛ أما المقاومة الكبيرة جداً فتنقص عزم البدء.</p>`},
    {watch:String.raw`<p>صياغة المرحلة الأولى مربكة: «يتم قصر أطراف العضو الدوار عبر كامل المقاومة المضافة بواسطة <b>فتح</b> القاطعين». المقصود أن القاطعين مفتوحان فيمر تيار العضو الدوار في كامل المقاومات (والمقاومات هي التي تغلق الدائرة عند نقطة نجمتها)، لا أن الفتح يحدث قصراً.</p>`}
   ]},

  {st:6,short:'الأجهزة الإلكترونية',title:'5ـ باستخدام أجهزة إلكترونية',ref:'ص 65–66',
   q:'كل الطرق السابقة تبدّل على مراحل فيقفز التيار والعزم… هل يمكن بدء بلا قفزات؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="جهاز بدء إلكتروني بين المصدر والمحرك، على شاشته تيار ثابت" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g fill="none" stroke="#2C4A40" stroke-width="3"><path d="M140 34 V70 M180 34 V70 M220 34 V70 M140 200 V226 L168 250 M180 200 V246 M220 200 V226 L192 250"/></g><g font-family="var(--mono)" font-size="13" fill="#2C4A40" text-anchor="middle"><text x="140" y="28">L1</text><text x="180" y="28">L2</text><text x="220" y="28">L3</text></g><g data-tip="جهاز البدء الإلكتروني: يستخدم تقنية إلكترونيات القدرة، ويتحكم بدقة ونعومة في الجهد مع مراقبة التيار، وفيه حماية للمحرك."><rect x="96" y="70" width="168" height="130" rx="12" fill="#2C4A40"/><rect x="112" y="166" width="20" height="14" rx="3" fill="#4FB3A9"/><rect x="140" y="166" width="20" height="14" rx="3" fill="#4FB3A9"/><rect x="168" y="166" width="20" height="14" rx="3" fill="#4FB3A9"/><rect x="216" y="160" width="34" height="24" rx="4" fill="#E8735A"/></g><g data-tip="الشاشة: التيار يبقى ثابتاً طوال فترة البدء (الخط الأفقي)، كما في الشكل ⟦(1-32)⟧."><rect x="112" y="84" width="136" height="66" rx="6" fill="#FBF6EE"/><path d="M120 140 V92 M120 140 H240" fill="none" stroke="#2C4A40" stroke-width="1.5"/><path d="M122 108 H206 Q214 108 220 124 T236 136" fill="none" stroke="#E8735A" stroke-width="3"/><text x="128" y="102" font-size="10" fill="#2C4A40" font-family="var(--mono)">I</text></g><g data-tip="المحرك ⟦M 3~⟧: يتسارع بنعومة بلا وقفات أو قفزات مفاجئة."><circle cx="180" cy="270" r="24" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><text x="180" y="270" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)">M</text><text x="180" y="284" text-anchor="middle" font-size="11" fill="#2C4A40" font-family="var(--mono)">3~</text></g></svg>`,
   cap:'الجهاز بين المصدر والمحرك يرفع الجهد تدريجياً ويُبقي التيار ثابتاً أثناء البدء.<br><b>مرّر المؤشر على الجهاز وشاشته والمحرك (أو المسه في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'ما شكل التيار أثناء البدء بجهاز إلكتروني؟',opts:[
     ['يقفز عند كل مرحلة ثم ينقص',false,'هذا في الطرق التقليدية ذات المراحل.'],
     ['يبدأ 6 إلى 8 أضعاف ثم ينقص تدريجياً',false,'هذا التوصيل المباشر بلا أي طريقة بدء.'],
     ['يبقى ثابتاً طوال فترة البدء',true,'الجهاز يراقب التيار ويتحكم في الجهد فيجعل التيار ثابتاً، كما في نص ص 65 والشكل (1-32).']]}}
   ],
   body:[
    {book:String.raw`<p>ظهرت حديثاً أجهزة لبدء المحركات الكهربائية تستخدم تقنية إلكترونيات القدرة، هذه الأجهزة تعتمد على مبدأ التحكم الدقيق والناعم في الجهد مع مراقبة التيار في نفس الوقت وبالتالي <b>تجعل التيار ثابتاً طيلة فترة البدء مع عزم مستقر</b>. هذه الطريقة تعتبر الأفضل وذلك لأنها توفر للمحرك تسارعاً ناعماً بدون وقفات أو قفزات مفاجئة أو تذبذب أو إجهاد ميكانيكي كما هو الحال في الطرق التقليدية، كما أن هذه الأجهزة تتوفر فيها جميع أنواع الحماية التي يتطلبها المحرك عادةً مما يعني توفير تكلفة أجهزة الحماية مقابل ارتفاع ثمن الجهاز، كما أنها أيضا تستخدم أثناء فرملة المحرك. هذه الأجهزة متوفرة بقدرات تصل إلى <span class="ltr">500 kw</span>، انظر الشكلين (1-31) و (1-32).</p>`,ref:'ص 65'},
    {html:`<figure class="fig">${scFig('el')}${scLegend}<figcaption><b>الشكل (1-32)</b> منحنى العزم والتيار بواسطة نظام بدء إلكتروني: التيار ثابت حتى يلتقي منحنى التوصيل المباشر، والعزم يرتفع بنعومة بلا قفزات (القيم مقدرة من شكل الكتاب). <span class="ref">ص 66</span></figcaption></figure>`},
    {add:String.raw`<p>في الورش والمصانع يسمى هذا الجهاز عادةً «البادئ الناعم» <span class="ltr">(Soft Starter)</span>، وتراه في لوحات المضخات والضواغط الكبيرة.</p>`,title:'اسمه في الواقع'},
    {tip:String.raw`<p><b>مقارنة سريعة بين الطرق</b> (من نص الكتاب، وتيارات البدء مقدرة من أشكاله منسوبة إلى التيار المقنن \(I_n\)):</p><table class="u1b-tbl"><thead><tr><th>الطريقة</th><th>تيار البدء تقريباً</th><th>ما يقوله الكتاب</th></tr></thead><tbody>
     <tr><td>توصيل مباشر</td><td><span class="ltr">7 I<sub>n</sub></span></td><td>من 6 إلى 8 أضعاف التيار المقنن</td></tr>
     <tr><td>مقاومات الثابت</td><td><span class="ltr">4 I<sub>n</sub></span></td><td>عيبها زيادة المفاقيد النحاسية</td></tr>
     <tr><td>محول ذاتي</td><td><span class="ltr">2 I<sub>n</sub></span></td><td>لا قدرة مفقودة؛ الأفضل للمحركات الموصلة نجمة داخلياً</td></tr>
     <tr><td>نجمة / دلتا</td><td>ثلث المباشر</td><td>للمحركات ذات الستة أطراف التي تعمل دلتا</td></tr>
     <tr><td>مقاومات الدوار</td><td><span class="ltr">3 I<sub>n</sub></span></td><td>خاصة بمحرك حلقات الانزلاق، والأفضل له</td></tr>
     <tr><td>بادئ إلكتروني</td><td><span class="ltr">3 I<sub>n</sub></span> ثابت</td><td>الأفضل: تسارع ناعم وحماية، لكنه أغلى</td></tr></tbody></table>`}
   ]},

  {recap:[
   String.raw`عند البدء \(S=1\) فتصبح \(R'_2\frac{1-S}{S}=0\)، فيكون تيار البدء من 6 إلى 8 أضعاف التيار المقنن (ص 58).`,
   String.raw`تيار البدء، المعادلة (1-39): \(I'_{2st}=\frac{V_{ph}}{\sqrt{(R_1+R'_2)^2+X_{eq}^2}}\)؛ نقلله بتقليل البسط (الجهد) أو بزيادة المقام (المقاومات).`,
   'تقليل الجهد: مقاومات الثابت (عيبها المفاقيد)، والمحول الذاتي (بلا قدرة مفقودة)، ونجمة/دلتا (تيار الخط يقل إلى الثلث)، والأجهزة الإلكترونية (تيار ثابت وتسارع ناعم).',
   'زيادة المقام: مقاومات العضو الدوار، للمحرك ذي حلقات الانزلاق فقط، وتُزال على مراحل بعد البدء.']}
 ],
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
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'يقول النص في ص 64 إن مقاومات العضو الدوار «<b>تزيد من عزم البدء</b> للمحرك»، لكن الشكل (1-30) في الصفحة نفسها يُظهر عزم البدء عبر المقاومات نحو <span class="ltr">0.4 T<sub>n</sub></span> وهو <b>أقل</b> من عزم البدء بالتوصيل المباشر (نحو <span class="ltr">2 T<sub>n</sub></span>). رسمنا المنحنيات كما في الشكل. والنص صحيح إذا اختيرت المقاومة بحيث لا تتجاوز قمة العزم لحظة البدء (انظر الشكل 1-21 في الدرس السابق)؛ أما المقاومة الكبيرة جداً فتنقص عزم البدء.'+'</div>'},
  {html:`<p><b>مراحل التشغيل:</b> <span class="ref">ص 65</span></p><ul><li>${SM.rr.stages.join('</li><li>')}</li></ul>`},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'صياغة المرحلة الأولى في ص 65 مربكة: «يتم قصر أطراف العضو الدوار عبر كامل المقاومة المضافة بواسطة <b>فتح</b> القاطعين رقم 2 و 1». المقصود أن القاطعين مفتوحان فيمر تيار العضو الدوار في كامل المقاومات (المقاومات هي التي تغلق الدائرة عند نقطة نجمتها)، لا أن الفتح يحدث قصراً. وتوصيلات الشكل (1-29) الدقيقة لا تتضح من الرسم، فاعتمدنا وصف المراحل.'+'</div>'},
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
   {k:'T1',label:'عزم الحمل عند السرعة التزامنية (نسبة إلى T<sub>n</sub>)',unit:'',value:0.75,min:0,max:3,step:0.01},
   {k:'tau',label:'ثابت زمن التسارع (يكبر مع ثقل العضو الدوار)',unit:'s',value:JM,min:0.2,max:30,step:0.1}],()=>{tpUI();tChart=1});
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
   {const tau=TP.v.tau,nS=Math.max(1,Math.ceil(dt*40/tau)),h=dt/nS;   // du/dt = (T − TL)/tau ; sub-steps only when tau is small (default: one step)
    for(let j=0;j<nS;j++){const Tj=j?(s.cv?CUR[s.cv].T(u):0):T;u=clamp(u+(Tj-TLl(u))/tau*h,0,0.995)}}
   if(!s.cv&&u<0.002)u=0;
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
 stations:[
  {intro:true},

  {st:1,short:'ثلاث طرق',title:'ثانياً: التحكم في السرعة',ref:'ص 67',
   q:'المحرك الحثي يدور بسرعة شبه ثابتة… فإذا احتجنا سرعة أخرى، أيّ رقم في المعادلة نستطيع أن نغيّره؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="شجرة: سرعة العضو الدوار تعتمد على الانزلاق والسرعة التزامنية، والسرعة التزامنية تعتمد على عدد الأقطاب والتردد" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g stroke="#2C4A40" stroke-width="2.5" fill="none"><path d="M150 78 L90 124 M210 78 L250 124 M230 156 L205 196 M270 156 L295 196 M90 156 V232 M205 228 V232 M295 228 V232"/></g><g data-tip="المعادلة (1-4): سرعة العضو الدوار ⟦n = ns(1 − S)⟧. نغيّر السرعة إما بتغيير الانزلاق ⟦S⟧ أو بتغيير السرعة التزامنية ⟦ns⟧."><rect x="96" y="44" width="168" height="36" rx="10" fill="#2C4A40"/><text x="180" y="68" text-anchor="middle" font-size="16" fill="#FBF6EE" font-family="var(--mono)" direction="ltr">n = n<tspan font-size="11" dy="4">s</tspan><tspan dy="-4">(1 − S)</tspan></text></g><g data-tip="الانزلاق ⟦S⟧: يتغير بتوصيل مقاومات مع العضو الدوار (للمحرك ذي حلقات الانزلاق)."><rect x="62" y="124" width="56" height="32" rx="10" fill="#F2C14E"/><text x="90" y="146" text-anchor="middle" font-size="16" fill="#2C4A40" font-family="var(--mono)">S</text></g><g data-tip="المعادلة (1-1): السرعة التزامنية ⟦ns = 120 fs / p⟧ تتغير بتغيير عدد الأقطاب ⟦p⟧ أو تردد المصدر ⟦fs⟧."><rect x="196" y="124" width="108" height="32" rx="10" fill="#4FB3A9"/><text x="250" y="146" text-anchor="middle" font-size="14" fill="#2C4A40" font-family="var(--mono)" direction="ltr">n<tspan font-size="10" dy="4">s</tspan><tspan dy="-4"> = 120 f / p</tspan></text></g><g data-tip="عدد الأقطاب ⟦p⟧: يتغير بإعادة توصيل ملفات العضو الثابت."><rect x="181" y="196" width="48" height="32" rx="10" fill="#E8735A"/><text x="205" y="218" text-anchor="middle" font-size="16" fill="#FBF6EE" font-family="var(--mono)">p</text></g><g data-tip="تردد المصدر ⟦f⟧: يتغير بمصدر جهد ثلاثي الأوجه ذي تردد قابل للتغيير."><rect x="271" y="196" width="48" height="32" rx="10" fill="#E8735A"/><text x="295" y="218" text-anchor="middle" font-size="16" fill="#FBF6EE" font-family="var(--mono)">f</text></g><g font-size="12" fill="#2C4A40" font-weight="700" text-anchor="middle"><text x="90" y="250">1ـ الانزلاق</text><text x="205" y="250">2ـ الأقطاب</text><text x="295" y="250">3ـ التردد</text></g></svg>`,
   cap:'السرعة تتغير من ثلاثة أبواب فقط: الانزلاق، أو عدد الأقطاب، أو التردد.<br><b>مرّر المؤشر على كل صندوق (أو المسه في الجوال) لتعرف معناه.</b>',
   side:[
    {predict:{q:'أيّ مما يلي ليس من طرق التحكم في السرعة الثلاث التي يذكرها الكتاب؟',opts:[
     ['تغيير الانزلاق',false,'هذه الطريقة الأولى في الكتاب.'],
     ['تغيير عدد الأقطاب',false,'هذه الطريقة الثانية في الكتاب.'],
     ['تغيير تردد المصدر',false,'هذه الطريقة الثالثة في الكتاب.'],
     ['تغيير جهد المصدر وحده',true,'الكتاب يذكر ثلاث طرق فقط: الانزلاق والأقطاب والتردد. والجهد يُغيَّر في الطريقة الثالثة مع التردد لا وحده.']]}}
   ],
   body:[
    {book:String.raw`<p>المحرك الحثي ثلاثي الأوجه يعتبر المحرك المثالي للتطبيقات التي لا تتطلب تغيراً في السرعة وذلك لأن سرعته ثابتة تقريباً عند قيمة أقل من السرعة التزامنية بقدر بسيط وعندما يتغير الحمل تتغير سرعته بشكل طفيف، ولذلك فهو يعتبر <b>محركاً ذا سرعة ثابتة تقريباً</b>. ونظراً لوجود بعض التطبيقات التي تتطلب التحكم في السرعة. يمكن التحكم المحدود في سرعة المحرك بعدد من الطرق. بالرجوع إلى المعادلة رقم (1-4) نجد أن سرعة العضو الدوار يمكن التحكم فيها إما بتغيير الانزلاق أو بتغيير السرعة التزامنية، التي يمكن أن تتغير بتغير عدد الأقطاب أو بتغير تردد المصدر وذلك طبقاً للمعادلة (1-1). وبناءً عليه يمكن التحكم في سرعة المحرك الحثي ثلاثي الأوجه بإحدى ثلاث طرق: <b>بتغيير الانزلاق</b> أو <b>بتغيير عدد الأقطاب</b> أو <b>بتغيير تردد المصدر</b>.</p>`,ref:'ص 67'},
    {tip:String.raw`<p>تذكير بالمعادلتين من الفصل الأول:</p>
     <div class="eq">$$n=n_s(1-S)$$<span class="eqno">(1-4)</span></div>
     <div class="eq">$$n_s=\frac{120\,f_s}{p}$$<span class="eqno">(1-1)</span></div>
     <p>لاحظ أن الكتاب يسمي التحكم «محدوداً»: لا يعطي المحرك الحثي مدى واسعاً من السرعات بسهولة.</p>`,title:'المعادلتان اللتان يرجع إليهما الكتاب'}
   ]},

  {st:2,short:'تغيير الانزلاق',title:'1ـ تغيير قيمة الانزلاق',ref:'ص 67',
   q:'نستطيع أن نُبطئ المحرك بمقاومة في العضو الدوار… فلماذا لا نُبطئه كما نشاء؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="عداد سرعة من الصفر إلى السرعة التزامنية، والمنطقة الخضراء القريبة من السرعة التزامنية هي مدى التحكم المحبذ" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="170" r="140" fill="#FBE6C4"/><path d="M70 200 A110 110 0 0 1 290 200" fill="none" stroke="#CFC6B4" stroke-width="18"/><path data-tip="مدى التحكم المحبذ بهذه الطريقة: لا يزيد عن ⟦15%⟧ من السرعة التزامنية، لأن زيادة المقاومة تزيد المفاقيد النحاسية في العضو الدوار وتقلل الكفاءة." d="M278.0 150.1 A110 110 0 0 1 290 200" fill="none" stroke="#12855A" stroke-width="18"/><g data-tip="مؤشر سرعة العضو الدوار ⟦n⟧: كلما زادت مقاومة العضو الدوار زاد الانزلاق ونزلت السرعة حسب المعادلة (1-4)."><line x1="180" y1="200" x2="265.6" y2="172.2" stroke="#2C4A40" stroke-width="5" stroke-linecap="round"/><circle cx="180" cy="200" r="12" fill="#2C4A40"/></g><g font-family="var(--mono)" fill="#2C4A40" text-anchor="middle" direction="ltr"><text x="70" y="226" font-size="14">0</text><text x="290" y="226" font-size="14">n<tspan font-size="10" dy="4">s</tspan></text><text x="306" y="136" font-size="14" font-weight="700">15%</text></g><text x="180" y="96" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">سرعة العضو الدوار</text><text x="180" y="262" text-anchor="middle" font-size="13" fill="#2C4A40">الأخضر: المدى المحبذ للتحكم</text></svg>`,
   cap:'المقاومة المضافة تُنزل السرعة، لكن الكتاب يحبذ ألا يزيد ذلك عن <span class="ltr">15%</span> من السرعة التزامنية.<br><b>مرّر المؤشر على المنطقة الخضراء والمؤشر (أو المسه في الجوال) لتعرف معناهما.</b>',
   side:[
    {predict:{q:'لماذا يحبذ الكتاب ألا يزيد التحكم بهذه الطريقة عن 15% من السرعة التزامنية؟',opts:[
     ['لأن زيادة المقاومة تزيد المفاقيد النحاسية في العضو الدوار فتقل الكفاءة',true,'هذا تعليل الكتاب في ص 67.'],
     ['لأن المقاومة لا تستطيع تغيير السرعة أكثر من ذلك',false,'المقاومة الأكبر تُبطئ أكثر، لكن الثمن حرارة أكبر.'],
     ['لأن عزم المحرك يصبح صفراً بعد ذلك',false,'ليس هذا تعليل الكتاب؛ السبب المفاقيد والكفاءة.']]}}
   ],
   body:[
    {book:String.raw`<p>هذه الطريقة تستخدم فقط مع المحركات ذات حلقات الانزلاق وذلك بتوصيل مقاومات على التوالي مع ملفات العضو الدوار، انظر الشكل (1-29). إن أي تغيير في مقاومة ملفات العضو الدوار سيؤدي إلى تغيير موضع العزم الأقصى طبقاً للمعادلة (1-37) وبالتالي تتغير السرعة مع تغير الانزلاق طبقاً للمعادلة (1-4).</p>
     <p>هذه الطريقة تعطي تحكماً محدوداً في السرعة <b>ويحبذ أن لا يزيد عن 15% من السرعة التزامنية</b> وذلك لأن زيادة هذه المقاومة تؤدي إلى زيادة المفاقيد النحاسية في العضو الدوار وبالتالي قلة كفاءة المحرك.</p>`,ref:'ص 67'},
    {watch:String.raw`<p>يحيل الكتاب هنا إلى «المعادلة (1-37)» لتغير موضع العزم الأقصى، والمعادلة التي تحدد موضع العزم الأقصى هي <b>(1-36)</b>: \(S_m=R'_2/X'_2\). أما (1-37) فهي قيمة العزم الأقصى نفسه، ولا تتغير بتغير مقاومة العضو الدوار.</p>`,fix:true},
    {title:'كم يضيع حرارةً إذا أبطأنا المحرك؟',widget:(el,B)=>{
      let d=10;
      el.innerHTML=`<p class="sub" style="margin:0 0 6px">إبطاء المحرك بنسبة من السرعة التزامنية يعني انزلاقاً بالنسبة نفسها، ومن المعادلتين <span class="ltr">(1-25)</span> و<span class="ltr">(1-26)</span> نعرف كيف تنقسم القدرة <span class="ltr">P<sub>g</sub></span> التي تعبر الثغرة.</p>
       <label class="w-sl"><span>نسبة الإبطاء عن السرعة التزامنية: <span class="ltr"><b data-o="d"></b> %</span></span><input type="range" min="0" max="40" step="1" dir="ltr" value="${d}"></label>
       <div class="spd" dir="ltr"><div class="spd-bar"><i class="spd-n"></i><i class="spd-gap"></i></div><div class="spd-ax"><span>0</span><span>P<sub>g</sub></span></div></div>
       <p class="sub" style="margin-top:4px">الأخضر = ما يصير حركة <span class="ltr">P<sub>m</sub></span>، والأصفر = ما يصير حرارة في العضو الدوار والمقاومات <span class="ltr">P<sub>cu2</sub></span>.</p>
       <div class="w-facts"><div><span>الانزلاق</span><b data-o="S"></b></div><div><span>الحرارة من <bdi dir="ltr">P<sub>g</sub></bdi></span><b data-o="cu"></b></div><div><span>الحركة من <bdi dir="ltr">P<sub>g</sub></bdi></span><b data-o="pm"></b></div></div>
       <p class="sub" data-w style="margin-top:8px"></p>`;
      const o=k=>el.querySelector(`[data-o="${k}"]`),rg=el.querySelector('input');
      const draw=()=>{const S=d/100;o('d').textContent=d;o('S').textContent=S.toFixed(2);o('cu').textContent=d+' %';o('pm').textContent=(100-d)+' %';
        el.querySelector('.spd-n').style.width=(100-d)+'%';el.querySelector('.spd-gap').style.width=d+'%';
        el.querySelector('[data-w]').innerHTML=d>15?'<b>تجاوزت <span class="ltr">15%</span>:</b> هذا أكثر مما يحبذه الكتاب؛ جزء كبير من القدرة يضيع حرارة فتقل الكفاءة.':'في حدود ما يحبذه الكتاب (لا يزيد عن <span class="ltr">15%</span> من السرعة التزامنية).'};
      rg.oninput=()=>{d=+rg.value;draw()};draw();
    }},
    {tip:String.raw`<p>هذه هي المقاومات نفسها التي رأيتها في طريقة البدء الرابعة (الشكل 1-29)؛ لكن هناك تُزال بعد البدء، وهنا تبقى أثناء التشغيل لتُبقي السرعة منخفضة، ولذلك تستمر حرارتها طوال الوقت.</p>`}
   ]},

  {st:3,short:'تغيير الأقطاب',title:'2ـ تغيير عدد الأقطاب',ref:'ص 67–68',
   q:'إذا ضاعفنا عدد الأقطاب انخفضت السرعة التزامنية إلى النصف… فكيف نضاعف الأقطاب دون أن نغيّر المحرك؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="عضو ثابت بقطبين وآخر بأربعة أقطاب، والسرعة التزامنية في الثاني نصف الأول" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><g data-tip="توصيل الملفات على شكل قطبين: قطب شمالي ⟦N⟧ وقطب جنوبي ⟦S⟧، كما في الشكل (1-33)."><circle cx="100" cy="150" r="62" fill="#2C4A40"/><circle cx="100" cy="150" r="40" fill="#FBF6EE"/><rect x="88" y="90" width="24" height="26" rx="4" fill="#E8735A"/><rect x="88" y="184" width="24" height="26" rx="4" fill="#4FB3A9"/><text x="100" y="109" text-anchor="middle" font-size="14" fill="#FBF6EE" font-weight="700" font-family="var(--mono)">N</text><text x="100" y="203" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)">S</text></g><g data-tip="إعادة توصيل الملفات نفسها تعطي أربعة أقطاب ⟦N S N S⟧، كما في الشكل (1-34)، فتقل السرعة التزامنية إلى النصف."><circle cx="262" cy="150" r="62" fill="#2C4A40"/><circle cx="262" cy="150" r="40" fill="#FBF6EE"/><rect x="250" y="90" width="24" height="26" rx="4" fill="#E8735A"/><rect x="250" y="184" width="24" height="26" rx="4" fill="#E8735A"/><rect x="202" y="138" width="26" height="24" rx="4" fill="#4FB3A9"/><rect x="296" y="138" width="26" height="24" rx="4" fill="#4FB3A9"/><g font-size="14" font-weight="700" font-family="var(--mono)" text-anchor="middle"><text x="262" y="109" fill="#FBF6EE">N</text><text x="262" y="203" fill="#FBF6EE">N</text><text x="215" y="155" fill="#2C4A40">S</text><text x="309" y="155" fill="#2C4A40">S</text></g></g><text x="100" y="238" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">قطبان</text><text x="262" y="238" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">أربعة أقطاب</text><g font-family="var(--mono)" fill="#2C4A40" text-anchor="middle" direction="ltr" font-size="15"><text x="100" y="264">n<tspan font-size="10" dy="4">s</tspan></text><text x="262" y="264">n<tspan font-size="10" dy="4">s</tspan><tspan dy="-4"> ÷ 2</tspan></text></g></svg>`,
   cap:'الملفات نفسها بتوصيلين: قطبان أو أربعة أقطاب، فتكون للمحرك سرعتان تزامنيتان.<br><b>مرّر المؤشر على كل عضو ثابت (أو المسه في الجوال) لتعرف معناه.</b>',
   side:[
    {predict:{q:'لماذا لا تناسب طريقة تغيير الأقطاب المحرك ذا العضو الدوار الملفوف؟',opts:[
     ['لأن عضوه الدوار لا يتحمل السرعات العالية',false,'ليس هذا تعليل الكتاب.'],
     ['لأنه يلزم إعادة توصيل ملفات العضو الدوار أيضاً لتساوي أقطابه أقطاب العضو الثابت كلما غيّرنا السرعة',true,'هذا نص الكتاب في ص 67؛ أما القفص السنجابي فيتلاءم تلقائياً مع أي عدد من الأقطاب.'],
     ['لأن حلقات الانزلاق تقصر الملفات',false,'حلقات الانزلاق لا تمنع ذلك؛ المشكلة في إعادة توصيل ملفات العضو الدوار.']]}}
   ],
   body:[
    {book:String.raw`<p>يمكن تغيير عدد أقطاب العضو الثابت في المحرك الحثي ذو القفص السنجابي بإعادة توصيل ملفاته بطريقة مختلفة بحيث نحصل على <b>نصف عدد الأقطاب أو الضعف</b> وبهذه الطريقة يصبح لدينا سرعتان تزامنيتان. فإذا كانت الأقطاب الأساسية قطبين كما هو موضح في الشكل (1-33) يمكن إعادة التوصيل بحيث تصبح أربعة أقطاب وبالتالي تقل السرعة إلى النصف كما هو موضح في الشكل (1-34).</p>
     <p>إذا كانت هذه الطريقة لا تعطي السرعة المطلوبة فإنه بالإمكان وضع <b>طبقتين منفصلتين من الملفات</b> في العضو الثابت كل طبقة ذات عدد من الأقطاب يختلف عن الآخر، مثلاً يمكن أن تكون الطبقة الأولى ذات ثمانية أقطاب بينما الثانية تكون ذات ستة أقطاب، كما أنه بالإمكان دمج الطريقتين معاً لنحصل على <b>محرك ذي أربع سرعات</b>.</p>
     <p>هذه الطريقة <b>غير مناسبة للمحرك ذو العضو الدوار الملفوف</b> لأن ذلك يستدعي إعادة توصيل ملفات العضو الدوار لكي تصبح أقطابه متساوية مع أقطاب العضو الثابت كلما أردنا تغيير السرعة وهذا غير مناسب. بينما العضو الدوار ذو القفص السنجابي يتلاءم تلقائياً مع أي عدد موجود من الأقطاب في العضو الثابت.</p>`,ref:'ص 67–68'},
    {title:'الشكلان (1-33) و(1-34): بدّل التوصيل',widget:(el,B)=>{
      let p=2,f=50;
      el.innerHTML=`<p class="sub" style="margin:0 0 8px">بدّل بين التوصيلين وراقب اتجاه التيار في الملف الثاني وترتيب الأقطاب، والسرعة التزامنية من المعادلة <span class="ltr">(1-1)</span>.</p>
       <div class="w-row" style="margin-top:0"><button class="btn" type="button" data-p="2">قطبان</button><button class="btn" type="button" data-p="4">أربعة أقطاب</button><span class="w-l">التردد</span><span class="mseg"><button type="button" data-f="50">50 Hz</button><button type="button" data-f="60">60 Hz</button></span></div>
       <div data-c style="margin-top:10px"></div><div class="w-facts"><div><span>عدد الأقطاب</span><b data-o="p"></b></div><div><span>السرعة التزامنية <bdi dir="ltr">(1-1)</bdi></span><b data-o="ns"></b></div></div>`;
      const o=k=>el.querySelector(`[data-o="${k}"]`);
      const draw=()=>{el.querySelector('[data-c]').innerHTML=box(coilsSVG(p),460);o('p').textContent=p;o('ns').textContent=(120*f/p)+' rpm';
        el.querySelectorAll('[data-p]').forEach(b=>b.classList.toggle('pri',+b.dataset.p===p));el.querySelectorAll('[data-f]').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.f===f))};
      el.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{p=+b.dataset.p;draw()});el.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{f=+b.dataset.f;draw()});draw();
    }},
    {tip:String.raw`<p>في التوصيل الأول يدور التيار في الملفين في اتجاهين متعاكسين فيكون أحدهما شمالياً والآخر جنوبياً (قطبان). وفي التوصيل الثاني يدور في الاتجاه نفسه فيكون الملفان شماليين، وتتكون أقطاب جنوبية بينهما (أربعة أقطاب).</p>
     <p>ومحرك الأربع سرعات: طبقتان (مثلاً ثمانية أقطاب وستة أقطاب)، وكل طبقة توصل بعدد أقطابها أو نصفه، فتكون أربع سرعات تزامنية.</p>`},
    {add:String.raw`<p>بعض مراوح التهوية والشفاطات الصناعية لها سرعتان («سريع / بطيء») بمفتاح واحد؛ كثير منها محركات قفص سنجابي تتغير أقطابها بإعادة توصيل الملفات بهذه الطريقة.</p>`,title:'من الواقع'}
   ]},

  {st:4,short:'تغيير التردد',title:'3ـ تغيير تردد المصدر',ref:'ص 69',
   q:'السرعة التزامنية تتناسب مع التردد… فلماذا نحتاج أن نغيّر الجهد أيضاً؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مصدر ثابت التردد يدخل جهازاً إلكترونياً يخرج جهداً وتردداً متغيرين إلى المحرك" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><g data-tip="المصدر العادي: جهد ثلاثي الأوجه بتردد ثابت."><g stroke="#2C4A40" stroke-width="3"><line x1="34" y1="136" x2="100" y2="136"/><line x1="34" y1="150" x2="100" y2="150"/><line x1="34" y1="164" x2="100" y2="164"/></g><rect x="30" y="126" width="72" height="48" fill="transparent"/></g><g data-tip="جهاز تحكم إلكتروني ذو قدرة عالية ⟦(cycloconverter)⟧: يعطي جهداً ثلاثي الأوجه بتردد قابل للتغيير، ويضبط الجهد متناسباً مع التردد."><rect x="100" y="96" width="122" height="108" rx="12" fill="#2C4A40"/><text x="161" y="134" text-anchor="middle" font-size="11" fill="#FBF6EE" font-family="var(--mono)" direction="ltr">cycloconverter</text><circle cx="161" cy="168" r="18" fill="#4FB3A9"/><line x1="161" y1="168" x2="172" y2="155" stroke="#2C4A40" stroke-width="4" stroke-linecap="round"/></g><g data-tip="الخرج: تردد متغير، والجهد يتغير معه بالنسبة نفسها للحفاظ على فيض ثابت في الثغرة الهوائية."><g stroke="#E8735A" stroke-width="3"><line x1="222" y1="136" x2="278" y2="136"/><line x1="222" y1="150" x2="278" y2="150"/><line x1="222" y1="164" x2="278" y2="164"/></g><rect x="222" y="126" width="56" height="48" fill="transparent"/></g><g data-tip="المحرك الحثي ⟦M 3~⟧: تتغير سرعته التزامنية مع التردد."><circle cx="304" cy="150" r="26" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><text x="304" y="150" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)">M</text><text x="304" y="165" text-anchor="middle" font-size="11" fill="#2C4A40" font-family="var(--mono)">3~</text></g><text x="66" y="118" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">تردد ثابت</text><text x="250" y="118" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">تردد متغير</text><text x="250" y="196" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">وجهد متغير</text><text x="180" y="262" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="600">الجهد يتغير مع التردد</text></svg>`,
   cap:'جهاز إلكتروني بين المصدر والمحرك يغيّر التردد، ويغيّر الجهد معه بالنسبة نفسها.<br><b>مرّر المؤشر على الجهاز والأسلاك والمحرك (أو المسه في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'لماذا يُضبط الجهد الخارج متناسباً مع التردد؟',opts:[
     ['لزيادة سرعة المحرك فوق السرعة التزامنية',false,'السرعة يحددها التردد؛ الجهد يُضبط لسبب آخر.'],
     ['لتقليل ثمن الجهاز',false,'الكتاب يقول إن هذه الأجهزة مكلفة عادةً.'],
     ['للحفاظ على قيمة ثابتة للفيض المغناطيسي في الثغرة الهوائية',true,'هذا تعليل الكتاب في ص 69.']]}}
   ],
   body:[
    {book:String.raw`<p>يمكن التحكم في السرعة التزامنية للمحرك الحثي ثلاثي الأوجه عن طريق التحكم في تردد المصدر المغذي لملفات العضو الثابت، و هذا يتطلب وجود مصدر جهد ثلاثي الأوجه ذو تردد قابل للتغيير. هذا النوع من المصادر هو عبارة عن أجهزة تحكم إلكترونية ذات قدرات عالية (cycloconverter).</p>
     <p>كما أن <b>الجهد الخارج يضبط بحيث يكون متناسباً مع التردد المطلوب</b> وذلك للحفاظ على قيمة ثابتة للفيض المغناطيسي في الثغرة الهوائية. مثل هذه الأجهزة تكون عادةً مكلفة ولا يلجأ إليها إلا في التطبيقات التي تحتاج إلى تحكم دقيق في السرعة.</p>
     <p>الشكل (1-35) يوضح منحنيات (العزم و السرعة) لمحرك ذو أربعة أقطاب عند ترددات مختلفة، ويلاحظ أن العزم يزداد عند انخفاض التردد وذلك بسبب زيادة الجهد والعكس يحدث عند زيادة التردد وذلك للمحافظة على كمية ثابتة للفيض المغناطيسي في الثغرة الهوائية.</p>`,ref:'ص 69'},
    {title:'حرّك التردد وشاهد السرعة التزامنية (محرك أربعة أقطاب)',widget:(el,B)=>{
      let f=60;
      el.innerHTML=`<p class="sub" style="margin:0 0 6px">الشكل <span class="ltr">(1-35)</span> لمحرك ذي أربعة أقطاب، فمن المعادلة <span class="ltr">(1-1)</span>: <span class="ltr">n<sub>s</sub> = 120 f / 4 = 30 f</span>.</p>
       <label class="w-sl"><span>تردد المصدر <span class="ltr">f = <b data-o="f"></b> Hz</span></span><input type="range" min="5" max="120" step="5" dir="ltr" value="${f}"></label>
       <div class="w-row"><span class="w-l">الترددات المعنونة في الشكل:</span><button class="btn" type="button" data-v="60">المقنن <span class="ltr">60 Hz</span></button><button class="btn" type="button" data-v="90"><span class="ltr">90 Hz</span></button><button class="btn" type="button" data-v="120"><span class="ltr">120 Hz</span></button></div>
       <div class="spd" dir="ltr"><div class="spd-bar"><i class="spd-n"></i></div><div class="spd-ax"><span>0</span><span>3600 rpm</span></div></div>
       <div class="w-facts"><div><span>السرعة التزامنية <bdi dir="ltr">(1-1)</bdi></span><b data-o="ns"></b></div><div><span>بالنسبة إلى التردد المقنن</span><b data-o="r"></b></div></div>`;
      const o=k=>el.querySelector(`[data-o="${k}"]`),rg=el.querySelector('input');
      const draw=()=>{o('f').textContent=f;o('ns').textContent=(30*f)+' rpm';o('r').textContent=Math.round(f/60*100)+' %';el.querySelector('.spd-n').style.width=(f/120*100)+'%'};
      rg.oninput=()=>{f=+rg.value;draw()};el.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>{f=+b.dataset.v;rg.value=f;draw()});draw();
    }},
    {watch:String.raw`<p>جملة الكتاب «العزم <b>يزداد</b> عند انخفاض التردد وذلك بسبب <b>زيادة الجهد</b>» تتعارض مع ما قبلها مباشرة (الجهد يُضبط «متناسباً مع التردد» أي <b>ينخفض</b> معه)، ومع الشكل (1-35) نفسه الذي يُظهر أن قمم العزم تحت 60 Hz <b>أقل</b> من قمة 60 Hz لا أكبر. الصحيح في الشكل: أعلى قمة عند التردد المقنن 60 Hz وتنخفض القمم في الاتجاهين.</p>`,fix:true},
    {add:String.raw`<p>يذكر الكتاب الـ <span class="ltr">cycloconverter</span>؛ والأشيع اليوم في المصانع هو «مغيّر السرعة» أو العاكس <span class="ltr">(inverter / VFD)</span>، وفكرته واحدة: جهد وتردد متغيران معاً. تراه في المصاعد الحديثة ومضخات المياه والمراوح الكبيرة.</p>`,title:'من الواقع'}
   ]},

  {recap:[
   String.raw`المحرك الحثي ذو سرعة ثابتة تقريباً، ونتحكم في سرعته من المعادلة (1-4) \(n=n_s(1-S)\) والمعادلة (1-1) \(n_s=\frac{120f_s}{p}\).`,
   'تغيير الانزلاق: مقاومات مع العضو الدوار (حلقات الانزلاق فقط)، ويحبذ ألا يزيد عن 15% من السرعة التزامنية بسبب المفاقيد.',
   'تغيير عدد الأقطاب: إعادة توصيل ملفات العضو الثابت (قفص سنجابي)، فنحصل على سرعتين، أو أربع سرعات بطبقتين من الملفات.',
   'تغيير التردد: مصدر بتردد متغير، والجهد يتناسب مع التردد للحفاظ على فيض ثابت؛ دقيق لكنه مكلف.']}
 ],
 theory:[
  {h:'ثانياً: التحكم في السرعة',ref:'ص 67',html:`<p>«المحرك الحثي ثلاثي الأوجه يعتبر المحرك المثالي للتطبيقات التي لا تتطلب تغيراً في السرعة وذلك لأن سرعته ثابتة تقريباً عند قيمة أقل من السرعة التزامنية بقدر بسيط وعندما يتغير الحمل تتغير سرعته بشكل طفيف، ولذلك فهو يعتبر <b>محركاً ذا سرعة ثابتة تقريباً</b>. ونظراً لوجود بعض التطبيقات التي تتطلب التحكم في السرعة، يمكن التحكم المحدود في سرعة المحرك بعدد من الطرق. بالرجوع إلى المعادلة رقم (1-4) نجد أن سرعة العضو الدوار يمكن التحكم فيها إما بتغيير الانزلاق أو بتغيير السرعة التزامنية، التي يمكن أن تتغير بتغير عدد الأقطاب أو بتغير تردد المصدر وذلك طبقاً للمعادلة (1-1). وبناءً عليه يمكن التحكم في سرعة المحرك الحثي ثلاثي الأوجه بإحدى ثلاث طرق: <b>بتغيير الانزلاق</b> أو <b>بتغيير عدد الأقطاب</b> أو <b>بتغيير تردد المصدر</b>.»</p>
   $$n = n_s(1-S) \\qquad\\qquad n_s=\\frac{120 f_s}{p}$$`},
  {note:'<b>تذكير:</b> المعادلتان (1-4) و (1-1) من الفصل الأول، بالصيغة التي استعملتها حلول الأمثلة في الفصل الثالث.'},
  {h:'1ـ تغيير قيمة الانزلاق',ref:'ص 67',html:`<p>«هذه الطريقة تستخدم فقط مع المحركات ذات حلقات الانزلاق وذلك بتوصيل مقاومات على التوالي مع ملفات العضو الدوار، انظر الشكل (1-29). إن أي تغيير في مقاومة ملفات العضو الدوار سيؤدي إلى تغيير موضع العزم الأقصى طبقاً للمعادلة (1-37) وبالتالي تتغير السرعة مع تغير الانزلاق طبقاً للمعادلة (1-4).»</p>
   <p>«هذه الطريقة تعطي تحكماً محدوداً في السرعة <b>ويحبذ أن لا يزيد عن 15% من السرعة التزامنية</b> وذلك لأن زيادة هذه المقاومة تؤدي إلى زيادة المفاقيد النحاسية في العضو الدوار وبالتالي قلة كفاءة المحرك.»</p>`},
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'في ص 67 يحيل الكتاب إلى «المعادلة (1-37)» لتغير موضع العزم الأقصى، والمعادلة التي تحدد موضع العزم الأقصى هي <b>(1-36)</b>: \\(S_m = R\'_2/X\'_2\\). أما (1-37) فهي قيمة العزم الأقصى نفسه، ولا تتغير بتغير مقاومة العضو الدوار.'+'</div>'},
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
  {html:'<div class="callout err fixnote"><b>ملاحظة على الكتاب:</b> '+'جملة ص 69 «العزم <b>يزداد</b> عند انخفاض التردد وذلك بسبب <b>زيادة الجهد</b>» تتعارض مع ما قبلها مباشرة (الجهد يُضبط «متناسباً مع التردد» أي <b>ينخفض</b> معه)، ومع الشكل (1-35) نفسه الذي يُظهر أن قمم العزم تحت 60 Hz <b>أقل</b> من قمة 60 Hz لا أكبر. الصحيح في الشكل: أعلى قمة عند التردد المقنن 60 Hz وتنخفض القمم في الاتجاهين. رسمنا المنحنيات كما يظهرها الشكل.'+'</div>'},
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
 stations:[
  {intro:true},

  {st:1,short:'أسئلة الفصل الثالث',title:'أسئلة وتمارين الفصل الثالث: القدرة والعزم',ref:'ص 55–57',
   q:'ثمانية أسئلة للفهم وثمانية تمارين حسابية… كلها تمشي على طريق القدرة نفسه من الدخل إلى الخرج.',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="خريطة الفصل الثالث: سلم القدرة من القدرة الداخلة إلى الخارجة، وفرع العزم من القدرة عبر الثغرة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g stroke="#2C4A40" stroke-width="2.5" fill="none"><path d="M130 76 V100 M130 140 V164 M130 204 V228"/><path d="M178 120 H230"/></g><g fill="#2C4A40"><polygon points="130,106 124,96 136,96"/><polygon points="130,170 124,160 136,160"/><polygon points="130,234 124,224 136,224"/><polygon points="238,120 228,114 228,126"/></g><g data-tip="القدرة الداخلة ⟦Pin⟧ من المعادلة (1-16). تمارين 10 و12 و13 تطلب منها تيار الخط بمعلومية الجهد ومعامل القدرة."><rect x="82" y="44" width="96" height="32" rx="10" fill="#4FB3A9"/><text x="130" y="66" text-anchor="middle" font-size="16" fill="#2C4A40" font-family="var(--mono)" direction="ltr">P<tspan font-size="11" dy="4">in</tspan></text></g><g data-tip="القدرة عبر الثغرة ⟦Pg = Pin − Ps⟧، المعادلة (1-19). منها: ⟦Pcu2 = S·Pg⟧ و⟦Pm = (1 − S)·Pg⟧."><rect x="82" y="104" width="96" height="36" rx="10" fill="#4FB3A9"/><text x="130" y="128" text-anchor="middle" font-size="16" fill="#2C4A40" font-family="var(--mono)" direction="ltr">P<tspan font-size="11" dy="4">g</tspan></text></g><g data-tip="القدرة الميكانيكية المتحولة ⟦Pm⟧، المعادلة (1-26). في التمرين 9 معطاة، ونرجع منها إلى ⟦Pg⟧ ثم ⟦Pin⟧."><rect x="82" y="168" width="96" height="36" rx="10" fill="#12855A"/><text x="130" y="192" text-anchor="middle" font-size="16" fill="#FBF6EE" font-family="var(--mono)" direction="ltr">P<tspan font-size="11" dy="4">m</tspan></text></g><g data-tip="القدرة الخارجة ⟦Po = Pm − PF⟧، المعادلة (1-24)، والكفاءة من المعادلة (1-27)."><rect x="82" y="232" width="96" height="32" rx="10" fill="#12855A"/><text x="130" y="254" text-anchor="middle" font-size="16" fill="#FBF6EE" font-family="var(--mono)" direction="ltr">P<tspan font-size="11" dy="4">o</tspan></text></g><g data-tip="العزم ⟦T = Pg / ωs⟧، المعادلة (1-29)، وتمارين 15 و16 بطريقة مثال (1-8) من المعادلات (1-33) إلى (1-38)."><rect x="240" y="102" width="70" height="36" rx="10" fill="#E8735A"/><text x="275" y="126" text-anchor="middle" font-size="16" fill="#FBF6EE" font-family="var(--mono)">T</text></g><text x="275" y="160" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">العزم</text><text x="236" y="210" text-anchor="middle" font-size="12" fill="#2C4A40">الطريق الذي تمشي عليه</text><text x="236" y="228" text-anchor="middle" font-size="12" fill="#2C4A40">تمارين الفصل</text></svg>`,
   cap:'خريطة للفصل: كل تمرين يبدأ من مرحلة في سلم القدرة ويصل إلى مرحلة أخرى.<br><b>مرّر المؤشر على كل صندوق (أو المسه في الجوال) لتعرف أي التمارين تستعمله.</b>',
   side:[
    {predict:{q:String.raw`محركان لهما القدرة نفسها عبر الثغرة \(P_g\)، انزلاق الأول أكبر. أيهما كفاءته أعلى (والمفاقيد الأخرى متساوية)؟`,opts:[
     ['الأول، لأن انزلاقه أكبر',false,String.raw`الانزلاق الأكبر يعني \(P_{cu2}=S\,P_g\) أكبر، أي حرارة أكثر.`],
     ['الثاني، لأن انزلاقه أصغر',true,String.raw`\(P_m=(1-S)P_g\) أكبر عند الانزلاق الأصغر، فتزيد القدرة الخارجة والكفاءة. وهذه فكرة السؤال 1.`],
     ['كفاءتهما متساوية',false,'الانزلاق يحدد نصيب الحرارة من القدرة عبر الثغرة، فلا تتساوى الكفاءتان.']]}}
   ],
   body:[
    {book:String.raw`<ol>
     <li>هل زيادة معامل الانزلاق أو نقصانه يؤثر على كفاءة المحرك؟ وَضّحْ ذلك؟</li>
     <li>لماذا تهمل المفاقيد الحديدية في العضو الدوار ؟</li>
     <li>هل تؤثر زيادة المفاقيد النحاسية في العضو الدوار على سرعة المحرك؟ بيّنْ ذلك؟</li>
     <li>ما المقصود بعزم الدوران Torque ؟</li>
     <li>ما المقصود بالسرعة الزاوية؟</li>
     <li>كيف يمكن التحكم في موضع العزم الأقصى للمحرك؟</li>
     <li>كيف يمكن التحكم في عزم البدء؟</li>
     <li>هل التحكم في موضع العزم الأقصى يؤثر على كفاءة المحرك؟ بَيّنْ ذلك؟</li></ol>`,ref:'ص 55'},
    {book:String.raw`<ol start="9">
     <li>محرك حثي ثلاثي الأوجه سرعته التزامنية 1000 rpm يعطي قدره ميكانيكية متحولة قدرها 5 hp عندما تكون سرعة العضو الدوار 935 rpm، احسب القدرة الداخلة إلى هذا المحرك إذا كانت مفاقيد العضو الثابت 400 w.</li>
     <li>محرك حثي ثلاثي الأوجه ذو ستة أقطاب يتغذى من مصدر جهده 500 V وتردده 60 Hz، يعطي قدره ميكانيكية خارجة قدرها 20 hp عندما تكون سرعته 1140 rpm، فإذا كانت مفاقيد الاحتكاك 1 hp، احسب ما يلي: أ) معامل الانزلاق ب) المفاقيد النحاسية في العضو الدوار جـ) القدرة الداخلة إلى المحرك إذا كانت مفاقيد العضو الثابت 1500 W د) تيار الخط الداخل إلى المحرك إذا كان معامل القدرة 0.86</li>
     <li>إذا كانت القدرة الكهربائية الداخلة إلى محرك حثي ثلاثي الأوجه ذو أربعة أقطاب هي 200 KW عندما تكون سرعته 1710 rpm ويتغذى من مصدر جهده 450 V وتردده 60Hz فإذا كانت مفاقيد العضو الثابت 3 KW والمفاقيد الميكانيكية 6 KW. احسب ما يلي: أ) معامل الانزلاق ب) القدرة الميكانيكية المتحولة جـ) المفاقيد النحاسية في العضو الدوار د) كفاءة المحرك</li>
     <li>محرك حثي ثلاثي الأوجه ذو أربعة أقطاب يعمل على مصدر جهده 220 V وتردده 50 Hz، سرعة المحرك 1440 rpm عند معامل قدرة 0.8 متأخر، القدرة الخارجة منه 10.8 KW، فإذا كانت مفاقيد العضو الثابت 1060 W والمفاقيد الميكانيكية 390 W احسب ما يلي: أ) المفاقيد النحاسية في العضو الدوار. ب) تردد التيارات في العضو الدوار. جـ) تيار الخط. د) كفاءة المحرك</li>
     <li>محرك حثي ثلاثي الأوجه ذو أربعة أقطاب يعمل على مصدر جهده 220 V وتردده 60 Hz، سرعة المحرك 1710 rpm عند معامل قدرة 0.83 متأخر، القدرة الخارجة منه 11 KW، فإذا كانت مفاقيد العضو الثابت 1100 W والمفاقيد الميكانيكية 420 W احسب ما يلي: أ) المفاقيد النحاسية في العضو الدوار ب) تردد التيارات في العضو الدوار جـ) تيار الخط</li>
     <li>محرك حثي ثلاثي الأوجه ذو ثمانية أقطاب يعمل على مصدر جهده 380 V وتردده 60 Hz، فإذا كانت سرعة المحرك عند الحمل الكامل 864 rpm، القدرة الداخلة إليه 10 KW، وكانت مفاقيد العضو الثابت 600 W و المفاقيد الميكانيكية 350 W احسب ما يلي: أ) المفاقيد النحاسية في العضو الدوار. ب) كفاءة المحرك. جـ) عزم المحرك عند الحمل الكامل.</li>
     <li>محرك حثي ثلاثي الأوجه ذو أربعة أقطاب يعمل على مصدر جهده 380 V وتردده 60 Hz، عناصر الدائرة المكافئة لهذا المحرك كما يلي: <span class="ltr">R<sub>1</sub> = 0.12 Ω، R'<sub>2</sub> = 0.16 Ω، X<sub>1</sub> = 0.45 Ω، X'<sub>2</sub> = 0.52 Ω</span> فإذا كانت ملفات المحرك موصلة على شكل نجمة احسب ما يلي: أ) تيار البدء. ب) عزم البدء. جـ) العزم الأقصى للمحرك وعند أي انزلاق. د) عزم البدء عند إضافة مقاومة قيمتها 1 Ω إلى كل وجه من أوجه العضو الدوار</li>
     <li>محرك حثي ثلاثي الأوجه ملفاته موصلة على شكل دلتا يتغذى من مصدر جهده 220 V، عناصر الدائرة المكافئة له كما يلي: <span class="ltr">R<sub>1</sub> = 0.4 Ω، R'<sub>2</sub> = 0.6 Ω، X<sub>1</sub> = 0.82 Ω، X'<sub>2</sub> = 0.86 Ω</span> فإذا كانت السرعة التزامنية لهذا المحرك 1500 rpm وسرعة العضو الدوار عند الحمل الكامل 1440 rpm، احسب ما يلي: أ) عزم الحمل الكامل ب) عزم البدء</li></ol>`,ref:'ص 55–57'},
    {tip:'<p class="sub">الكتاب لا يعطي إجابات. اضغط على رقم السؤال لترى إجابة مقترحة مكتوبة من نص الكتاب. الأرقام بتقريب طريقة الكتاب، و <span class="ltr">1 hp = 0.746 kW</span> كما في مثال (1-7).</p>'+[[1,'نعم. من (1-25) \\(P_{cu2}=S\\,P_g\\): زيادة الانزلاق تزيد المفاقيد النحاسية في العضو الدوار فتقل القدرة الميكانيكية \\(P_m=(1-S)P_g\\) وتقل الكفاءة، ونقصانه يزيدها؛ «لذلك يجب أن يكون الانزلاق صغيراً بقدر الإمكان» (ص 42).'],
     [2,'«لارتباطها بتردد تيارات العضو الدوار» (ص 41)، وهذا التردد \\(f_r=S\\,f_s\\) صغير جداً أثناء التشغيل (مثلاً 1.67 Hz في مثال 1-6) فتكون مفاقيد التيارات الدوامية والتخلف المغناطيسي في قلب الدوار صغيرة جداً.'],
     [3,'نعم. \\(P_{cu2}=S\\,P_g\\)؛ فزيادة \\(P_{cu2}\\) (لنفس \\(P_g\\)) تعني انزلاقاً أكبر، ومن (1-4) \\(n=n_s(1-S)\\) تقل السرعة. وهذا ما يحدث عند إضافة مقاومة للعضو الدوار للتحكم في السرعة (ص 67).'],
     [4,'«القوة المؤثرة على جسم ما فينتج عنها دوران ذلك الجسم حول مركزه، ويقاس بوحدة نيوتن متر Nm». وفي المحرك الحثي هو حاصل قسمة القدرة الميكانيكية المتحولة على السرعة الزاوية للعمود \\(T=P_m/\\omega\\) (1-28)، أو \\(T=P_g/\\omega_s\\) (1-29) (ص 45).'],
     [5,'سرعة الدوران مقيسة بالراديان في الثانية بدلاً من الدورة في الدقيقة؛ للمجال الدوار \\(\\omega_s=\\frac{2\\pi n_s}{60}\\ rad/sec\\) (1-30)، وللعمود \\(\\omega=\\frac{2\\pi n}{60}\\). (الكتاب يستعمل المصطلح دون تعريف لفظي منفصل.)'],
     [6,'بتغيير النسبة \\(R\'_2/X\'_2\\) لأن \\(S_m=R\'_2/X\'_2\\) (1-36)؛ «عملياً بإضافة مقاومة موصلة على التوالي مع ملفات العضو الدوار الملفوف (ذو حلقات الانزلاق)» فينتقل موضع العزم الأقصى نحو S = 1 (الشكل 1-21، ص 49–50).'],
     [7,'بتغيير مقاومة ملفات العضو الدوار \\(R\'_2\\) بإضافة مقاومة على التوالي معها (المعادلة 1-38 والشكل 1-21، ص 50)؛ يزداد عزم البدء إلى أن يصل موضع العزم الأقصى إلى لحظة البدء (\\(S_m=1\\))، وبعدها يقل (منحنى 6Ro في الشكل). ويتأثر أيضاً بجهد الوجه \\(V_{ph}^2\\).'],
     [8,'نعم. تحريك موضع العزم الأقصى يتم بزيادة مقاومة العضو الدوار، فيزداد الانزلاق عند الحمل نفسه وتزداد المفاقيد النحاسية في العضو الدوار \\(P_{cu2}=S P_g\\) فتقل الكفاءة؛ ولهذا تزال المقاومات بعد البدء (ص 64)، ولا يزيد التحكم في السرعة بها عن 15% (ص 67).'],
     [9,`${A}S = (1000 − 935)/1000 = 0.065${E}؛ ${A}P<sub>m</sub> = 5 × 746 = 3730 W${E}؛ من (1-26): ${A}P<sub>g</sub> = P<sub>m</sub>/(1 − S) = 3730/0.935 = 3989.3 W${E}؛ ${A}P<sub>in</sub> = P<sub>g</sub> + P<sub>s</sub> = 3989.3 + 400 = 4389.3 W ≈ 4.39 kW${E}.`],
     [10,`${A}n<sub>s</sub> = 120×60/6 = 1200 rpm${E}. أ) ${A}S = (1200 − 1140)/1200 = 0.05${E}. ب) ${A}P<sub>m</sub> = P<sub>o</sub> + P<sub>F</sub> = 21 hp = 15666 W${E}، ${A}P<sub>g</sub> = 15666/0.95 = 16490.5 W${E}، ${A}P<sub>cu2</sub> = 0.05 × 16490.5 = 824.5 W${E}. جـ) ${A}P<sub>in</sub> = 16490.5 + 1500 = 17990.5 W${E}. د) من (1-16): ${A}I<sub>L</sub> = 17990.5/(√3 × 500 × 0.86) = 24.16 A${E}.`],
     [11,`${A}n<sub>s</sub> = 1800 rpm${E}. أ) ${A}S = 90/1800 = 0.05${E}. ${A}P<sub>g</sub> = 200 − 3 = 197 kW${E}. ب) ${A}P<sub>m</sub> = 0.95 × 197 = 187.15 kW${E}. جـ) ${A}P<sub>cu2</sub> = 0.05 × 197 = 9.85 kW${E}. د) ${A}P<sub>o</sub> = 187.15 − 6 = 181.15 kW${E}، ${A}η = 181.15/200 × 100 = 90.58 %${E}. (جرّبه في مختبر الدرس 1.7 بزر «أرقام التمرين 11».)`],
     [12,`${A}n<sub>s</sub> = 1500 rpm، S = 0.04${E}. ${A}P<sub>m</sub> = 10800 + 390 = 11190 W${E}، ${A}P<sub>g</sub> = 11190/0.96 = 11656.25 W${E}. أ) ${A}P<sub>cu2</sub> = 0.04 × 11656.25 = 466.25 W${E}. ب) ${A}f<sub>r</sub> = S f<sub>s</sub> = 0.04 × 50 = 2 Hz${E}. جـ) ${A}P<sub>in</sub> = 11656.25 + 1060 = 12716.25 W${E}، ${A}I<sub>L</sub> = 12716.25/(√3 × 220 × 0.8) = 41.71 A${E}. د) ${A}η = 10800/12716.25 × 100 = 84.93 %${E}.`],
     [13,`${A}n<sub>s</sub> = 1800 rpm، S = 0.05${E}. ${A}P<sub>m</sub> = 11000 + 420 = 11420 W${E}، ${A}P<sub>g</sub> = 11420/0.95 = 12021.05 W${E}. أ) ${A}P<sub>cu2</sub> = 0.05 × 12021.05 = 601.05 W${E}. ب) ${A}f<sub>r</sub> = 0.05 × 60 = 3 Hz${E}. جـ) ${A}P<sub>in</sub> = 12021.05 + 1100 = 13121.05 W${E}، ${A}I<sub>L</sub> = 13121.05/(√3 × 220 × 0.83) = 41.49 A${E}.`],
     [14,`${A}n<sub>s</sub> = 900 rpm، S = 0.04، P<sub>g</sub> = 9400 W${E}. أ) ${A}P<sub>cu2</sub> = 376 W${E}. ب) ${A}P<sub>m</sub> = 9024 W، P<sub>o</sub> = 8674 W، η = 86.74 %${E}. جـ) من (1-29): ${A}T = P<sub>g</sub>/ω<sub>s</sub> = 9400/94.25 = 99.73 Nm${E}. الحل خطوة بخطوة في تبويب «الأمثلة المحلولة».`],
     [15,`بطريقة مثال (1-8): ${A}n<sub>s</sub> = 1800 rpm${E} (أربعة أقطاب و 60 Hz، لم تذكر صراحة)، ${A}V<sub>ph</sub> = 380/√3 = 219.39 V${E}، ${A}K = 0.0159${E}. أ) ${A}I'<sub>2st</sub> ≈ 217.3 A${E}. ب) ${A}T<sub>st</sub> ≈ 120.13 Nm${E}. جـ) ${A}T<sub>max</sub> = KV<sub>ph</sub>²/2X'<sub>2</sub> ≈ 735.87 Nm${E} عند ${A}S<sub>m</sub> = 0.16/0.52 = 0.3077${E}. د) نعتبر المقاومة مضافة إلى R'<sub>2</sub> (لم تذكر نسبة التحويل): ${A}R'<sub>2</sub> = 1.16 Ω، I'<sub>2st</sub> ≈ 136.6 A، T<sub>st</sub> ≈ 344.2 Nm${E} أي نحو ثلاثة أضعاف. الحل في تبويب «الأمثلة المحلولة».`],
     [16,`بطريقة مثال (1-8): ${A}S = 0.04، K = 0.0191، I'<sub>2</sub> ≈ 14.2 A${E}. أ) ${A}T ≈ 57.77 Nm${E}. ب) ${A}I'<sub>2st</sub> ≈ 112.53 A، T<sub>st</sub> ≈ 145.1 Nm${E}. الحل في تبويب «الأمثلة المحلولة».`]].map(([n,a])=>`<details class="u1b-q"><summary>السؤال ${n}</summary><div class="u1b-ans">${a}</div></details>`).join(''),title:'إجابات مقترحة (ليست من الكتاب)'},
    {predict:{q:String.raw`في التمرين 9 أعطاك الكتاب \(P_m\) والانزلاق يحسب من السرعتين. أي معادلة تعيدك من \(P_m\) إلى \(P_g\)؟`,opts:[
     [String.raw`\(P_g=P_m\times S\)`,false,String.raw`هذا قريب من (1-25) لكنها تعطي \(P_{cu2}\) من \(P_g\)، لا \(P_g\) من \(P_m\).`],
     [String.raw`\(P_g=P_m+P_F\)`,false,String.raw`هذه تعطي \(P_m\) من \(P_o\) (عكس (1-24))، لا \(P_g\).`],
     [String.raw`\(P_g=\frac{P_m}{1-S}\)`,true,String.raw`من (1-26) \(P_m=(1-S)P_g\)، فنقسم على \((1-S)\). ثم \(P_{in}=P_g+P_S\).`]]}},
    {watch:String.raw`<p>السؤال 16 في ص 57 ينتهي عند الفرع (ب) كما طُبع. وفي السؤال 15 لم تذكر السرعة التزامنية صراحة (تحسب من أربعة أقطاب و 60 Hz = 1800 rpm)، ولم يذكر في (د) هل الـ 1 Ω محولة إلى العضو الثابت؛ افترضنا في الإجابة إضافتها إلى \(R'_2\).</p>`,fix:true},
    {html:`<div class="w-row"><button class="btn pri" type="button" onclick="var b=document.querySelector('.ltabs button[data-tab=examples]');if(b)b.click()">افتح حلول التمارين 14 و15 و16 خطوة بخطوة</button></div>`}
   ]},

  {st:2,short:'أسئلة الفصل الرابع',title:'أسئلة وتمارين الفصل الرابع: البدء والتحكم في السرعة',ref:'ص 70',
   q:'أسئلة الفصل الرابع كلها «لماذا» و«كيف»… وأغلب إجاباتها معادلة واحدة من الدرسين السابقين.',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="خريطة الفصل الرابع: خمس طرق لبدء الحركة وثلاث طرق للتحكم في السرعة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><g data-tip="طرق بدء الحركة الخمس (الأسئلة 1 إلى 6): كلها تقلل تيار البدء من المعادلة (1-39)، إما بتقليل الجهد أو بزيادة المقاومة."><rect x="190" y="44" width="140" height="34" rx="10" fill="#2C4A40"/><text x="260" y="66" text-anchor="middle" font-size="13" fill="#FBF6EE" font-weight="700">طرق بدء الحركة</text><g font-size="12" fill="#2C4A40" text-anchor="middle"><rect x="196" y="88" width="128" height="26" rx="8" fill="#F2C14E"/><text x="260" y="106">مقاومات الثابت</text><rect x="196" y="120" width="128" height="26" rx="8" fill="#F2C14E"/><text x="260" y="138">محول ذاتي</text><rect x="196" y="152" width="128" height="26" rx="8" fill="#F2C14E"/><text x="260" y="170">نجمة / دلتا</text><rect x="196" y="184" width="128" height="26" rx="8" fill="#F2C14E"/><text x="260" y="202">مقاومات الدوار</text><rect x="196" y="216" width="128" height="26" rx="8" fill="#F2C14E"/><text x="260" y="234">أجهزة إلكترونية</text></g></g><g data-tip="طرق التحكم في السرعة الثلاث (الأسئلة 7 إلى 9): من المعادلتين (1-4) و(1-1)."><rect x="34" y="44" width="140" height="34" rx="10" fill="#2C4A40"/><text x="104" y="66" text-anchor="middle" font-size="13" fill="#FBF6EE" font-weight="700">التحكم في السرعة</text><g font-size="12" fill="#2C4A40" text-anchor="middle"><rect x="40" y="88" width="128" height="26" rx="8" fill="#4FB3A9"/><text x="104" y="106">تغيير الانزلاق</text><rect x="40" y="120" width="128" height="26" rx="8" fill="#4FB3A9"/><text x="104" y="138">تغيير عدد الأقطاب</text><rect x="40" y="152" width="128" height="26" rx="8" fill="#4FB3A9"/><text x="104" y="170">تغيير التردد</text></g></g><g data-tip="السؤال 10: ثماني علاقات «يقل / يزداد»، تعلّل كل واحدة منها بمعادلة أو منحنى."><rect x="40" y="196" width="128" height="46" rx="10" fill="#E8735A"/><text x="104" y="216" text-anchor="middle" font-size="12" fill="#FBF6EE" font-weight="700">السؤال 10</text><text x="104" y="234" text-anchor="middle" font-size="12" fill="#FBF6EE">يقل أم يزداد؟</text></g></svg>`,
   cap:'خريطة للفصل: يمين الرسم طرق البدء، ويساره طرق التحكم في السرعة، وتحته السؤال العاشر.<br><b>مرّر المؤشر على كل مجموعة (أو المسه في الجوال) لتعرف أي الأسئلة تخصها.</b>',
   side:[
    {predict:{q:'(من السؤال 10) إذا زاد تحميل المحرك فإن الانزلاق…',opts:[
     ['يقل',false,'الحمل الأكبر يُبطئ المحرك، والبطء يعني انزلاقاً أكبر.'],
     ['يزداد',true,'الحمل الأكبر يُبطئ المحرك فيزيد الانزلاق \\(S=(n_s-n)/n_s\\)، حتى يتساوى عزم المحرك وعزم الحمل في المنطقة المستقرة.']]}}
   ],
   body:[
    {book:String.raw`<ol>
     <li>لماذا يكون تيار البدء عالياً في المحركات الحثية؟</li>
     <li>هل يفضل توصيل المقاومات على التوالي مع ملفات العضو الثابت من أجل تقليل تيار البدء، ولماذا؟</li>
     <li>ما مميزات استخدام المحول الذاتي في عملية البدء؟</li>
     <li>ما مواصفات المحرك الذي يمكنه البدء بطريقة (Δ / Y)؟</li>
     <li>اشرح كيف تؤدي إضافة مقاومة إلى ملفات العضو الدوار إلى تقليل تيار البدء؟</li>
     <li>اذكر مميزات أجهزة البدء الإلكترونية؟</li>
     <li>وَضّحْ كيف يمكن التحكم في سرعة المحرك عن طريق إضافة مقاومة إلى دائرة العضو الدوار</li>
     <li>كيف يمكن الحصول على محرك حثي ذو أربع سرعات؟</li>
     <li>لماذا يجب تغيير الجهد عند تغيير تردد المصدر من أجل التحكم في سرعة المحرك؟</li>
     <li>فيما يلي اختر الإجابة الصحيحة مع التعليل إما بكتابة معادلة أو رسم منحنى:
      <ol type="a" style="list-style:none;padding-inline-start:6px">
       <li>أ) إذا زاد تحميل المحرك فإن الانزلاق ( يقل / يزداد )</li>
       <li>ب) عند زيادة مقاومة العضو الدوار فإن تيار البدء ( يقل / يزداد )</li>
       <li>جـ) عند زيادة مقاومة العضو الدوار فإن سرعة المحرك ( تقل / تزداد )</li>
       <li>د) إذا قل الانزلاق فإن القدرة المفقودة في العضو الدائر ( تقل / تزداد )</li>
       <li>هـ) إذا قل تردد المصدر فإن سرعة المجال المغناطيسي الدوار ( تقل / تزداد )</li>
       <li>و) إذا زاد الانزلاق فإن تردد التيارات داخل ملفات العضو الدوار ( يقل / يزداد )</li>
       <li>ز) إذا زادت سرعة المحرك فإن قيم التيارات داخل ملفات العضو الدوار ( تقل / تزداد )</li>
       <li>حـ) إذا زاد عدد أقطاب العضو الثابت فإن سرعة المجال المغناطيسي الدوار ( تقل / تزداد )</li></ol></li></ol>`,ref:'ص 70'},
    {predict:{q:'(من السؤال 10) عند زيادة مقاومة العضو الدوار فإن تيار البدء…',opts:[
     ['يقل',true,String.raw`المقاومة في مقام المعادلة (1-39) \(I'_{2st}=V_{ph}/\sqrt{(R_1+R'_2)^2+X_{eq}^2}\)، فكلما كبرت صغر التيار.`],
     ['يزداد',false,'المقاومة في المقام لا في البسط؛ زيادتها تنقص التيار.']]}},
    {predict:{q:'(من السؤال 10) إذا زاد الانزلاق فإن تردد التيارات داخل ملفات العضو الدوار…',opts:[
     ['يقل',false,String.raw`العلاقة طردية: \(f_r=S\,f_s\).`],
     ['يزداد',true,String.raw`من المعادلة (1-5) \(f_r=S\,f_s\): كلما زاد الانزلاق زاد تردد تيارات العضو الدوار.`]]}},
    {tip:[[1,'لأن الانزلاق عند البدء يساوي واحداً فتصبح المقاومة الممثلة للحمل \\(R\'_2\\frac{1-S}{S}=0\\) أي مقصورة، فلا يحد التيار إلا مقاومات ومعاوقات الملفات الصغيرة (المعادلة 1-39)؛ ويصل التيار إلى 6–8 أضعاف التيار المقنن (ص 58).'],
     [2,'لا يفضل خصوصاً مع المحركات الكبيرة، لأن عيبها زيادة المفاقيد النحاسية (الحرارة في المقاومات) (ص 59)، رغم أنها تقلل الجهد على الملفات فيقل تيار البدء.'],
     [3,'يخفض الجهد على ملفات العضو الثابت إلى قيمة تتناسب مع تيار البدء المسموح به، و«مثالية جداً حيث لا يوجد فيها أي قدرة مفقودة»، وهي «الخيار الأفضل للمحركات التي تم توصيل ملفاتها داخلياً من قبل المصنع على شكل نجمة» (ص 61).'],
     [4,'المحرك ذو الستة أطراف (بدايات ونهايات الملفات الثلاثة ظاهرة) والذي توصل ملفاته على شكل دلتا أثناء التشغيل العادي (ص 62)؛ أي أن جهد ملفه المقنن يساوي جهد الخط.'],
     [5,'المقاومة المضافة تزيد \\(R\'_2\\) في مقام المعادلة (1-39) \\(I\'_{2st}=V_{ph}/\\sqrt{(R_1+R\'_2)^2+X_{eq}^2}\\) فيقل تيار البدء؛ ثم تزال تدريجياً بعد البدء لتجنب زيادة المفاقيد (ص 64). وهي للمحرك ذي حلقات الانزلاق فقط.'],
     [6,'(ص 65) تحكم دقيق وناعم في الجهد مع مراقبة التيار فيبقى التيار ثابتاً طوال البدء مع عزم مستقر؛ تسارع ناعم بلا وقفات أو قفزات أو تذبذب أو إجهاد ميكانيكي؛ فيها جميع أنواع الحماية فتوفر تكلفة أجهزة الحماية؛ تستخدم أيضاً أثناء فرملة المحرك؛ متوفرة بقدرات تصل إلى 500 kW. (عيبها ارتفاع ثمن الجهاز.)'],
     [7,'في المحرك ذي حلقات الانزلاق توصل مقاومات على التوالي مع ملفات العضو الدوار (الشكل 1-29)، فيتغير موضع العزم الأقصى (\\(S_m=R\'_2/X\'_2\\)) وتنزاح نقطة التشغيل إلى انزلاق أكبر، فتقل السرعة حسب \\(n=n_s(1-S)\\). التحكم محدود ويحبذ ألا يزيد عن 15% من السرعة التزامنية بسبب زيادة المفاقيد وقلة الكفاءة (ص 67).'],
     [8,'بوضع طبقتين منفصلتين من الملفات في العضو الثابت لكل منهما عدد أقطاب مختلف (مثلاً 8 و 6)، مع إمكانية إعادة توصيل كل طبقة لتعطي نصف عدد أقطابها أو ضعفه؛ دمج الطريقتين يعطي أربع سرعات (ص 67). وذلك في محرك القفص السنجابي.'],
     [9,'للحفاظ على قيمة ثابتة للفيض المغناطيسي في الثغرة الهوائية، فيضبط الجهد متناسباً مع التردد (ص 69). (توضيح: لو خُفض التردد مع بقاء الجهد لزاد الفيض وتشبع القلب وارتفع التيار، ولو رُفع التردد لضعف الفيض والعزم.)'],
     [10,'<ol type="a" style="list-style:none;padding-inline-start:4px;margin:4px 0"><li>أ) <b>يزداد</b>: الحمل الأكبر يحتاج عزماً أكبر فتقل السرعة ويزيد S (منحنى العزم والسرعة في المنطقة المستقرة).</li><li>ب) <b>يقل</b>: المعادلة (1-39).</li><li>جـ) <b>تقل</b>: يزيد الانزلاق عند الحمل نفسه، \\(n=n_s(1-S)\\).</li><li>د) <b>تقل</b>: \\(P_{cu2}=S\\,P_g\\).</li><li>هـ) <b>تقل</b>: \\(n_s=120f/p\\).</li><li>و) <b>يزداد</b>: \\(f_r=S\\,f_s\\).</li><li>ز) <b>تقل</b>: بزيادة السرعة يقل S فيقل \\(I\'_2\\) حسب (1-33).</li><li>حـ) <b>تقل</b>: \\(n_s=120f/p\\).</li></ol>']].map(([n,a])=>`<details class="u1b-q"><summary>السؤال ${n}</summary><div class="u1b-ans">${a}</div></details>`).join(''),title:'إجابات مقترحة (ليست من الكتاب)'}
   ]},

  {recap:[
   String.raw`أسئلة القدرة تمشي على سلم واحد: \(P_{in}\) ثم \(P_g\) بالمعادلة (1-19) ثم \(P_m\) بالمعادلة (1-26) ثم \(P_o\) بالمعادلة (1-24)، والكفاءة بالمعادلة (1-27).`,
   String.raw`أسئلة العزم: \(T=P_g/\omega_s\) بالمعادلة (1-29)، و\(S_m\) بالمعادلة (1-36)، و\(T_{max}\) بالمعادلة (1-37)، و\(T_{st}\) بالمعادلة (1-38).`,
   String.raw`أسئلة البدء ترجع إلى المعادلة (1-39): تقليل الجهد أو زيادة المقاومة.`,
   String.raw`أسئلة السرعة ترجع إلى المعادلة (1-4) \(n=n_s(1-S)\) والمعادلة (1-1) \(n_s=120f_s/p\).`]}
 ],
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
  {note:'<span class="fixnote">السؤال 16 في ص 57 ينتهي عند الفرع (ب) كما طُبع. وفي السؤال 15 لم تذكر السرعة التزامنية صراحة (تحسب من أربعة أقطاب و 60 Hz = 1800 rpm)، ولم يذكر في (د) هل الـ 1 Ω محولة إلى الثابت؛ افترضنا إضافتها إلى R\'<sub>2</sub>.</span>'},
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
