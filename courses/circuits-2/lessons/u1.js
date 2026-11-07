/* دوائر كهربائية-2 — الوحدة الأولى (الجزء الأول): المقدمة والتمهيد + الفصل الأول + بداية الفصل الثاني (ص 1–42)
   Lessons u1-l1 … u1-l7. (u1-l8 … u1-l14 are in u1b.js; B.unit is called in course.js.) */
(function(B){
const {S}=B;
const PI=Math.PI,D=PI/180,SQ2=Math.SQRT2;
const fm=(x,d)=>B.fmtN(x,d);
const fx=v=>(+v).toFixed(1);
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
/* rounding like a calculator (half away from zero, immune to 204.45 → 204.4 float issues) */
const rd=(x,dp)=>{if(!isFinite(x))return x;const s=x<0?-1:1;return s*B.round(Math.abs(x)*(1+1e-12)+1e-12,dp)};
const lt=s=>`<span class="ltr">${s}</span>`;

/* ---------- complex numbers ---------- */
const Cx=(re,im)=>({re,im:im||0});
const cadd=(a,b)=>Cx(a.re+b.re,a.im+b.im),csub=(a,b)=>Cx(a.re-b.re,a.im-b.im);
const cmul=(a,b)=>Cx(a.re*b.re-a.im*b.im,a.re*b.im+a.im*b.re);
const cdiv=(a,b)=>{const d=b.re*b.re+b.im*b.im||1e-300;return Cx((a.re*b.re+a.im*b.im)/d,(a.im*b.re-a.re*b.im)/d)};
const cabs=a=>Math.hypot(a.re,a.im),cang=a=>(Math.abs(a.re)<1e-12&&Math.abs(a.im)<1e-12)?0:Math.atan2(a.im,a.re)/D;
const pol=(m,deg)=>Cx(m*Math.cos(deg*D),m*Math.sin(deg*D));
const fP=(z,dm,da)=>{da=da==null?1:da;const a=rd(cang(z),da)||0;return `${fm(cabs(z),dm==null?2:dm)}∠${fm(a,da)}°`};
const fPr=z=>fPm(rd(cabs(z),2),rd(cang(z),1)||0);
const fPm=(m,a,dm,da)=>`${fm(m,dm)}∠${fm(a,da)}°`;
const fR=(z,d)=>{d=d==null?2:d;const re=Math.abs(z.re)<5*Math.pow(10,-d-1)?0:z.re,im=z.im;return `${fm(re,d)} ${im<0?'−':'+'} j${fm(Math.abs(im),d)}`};
const nAng=a=>{a=((a+180)%360+360)%360-180;return a===-180?180:a};

/* ---------- styles used only by this file (CSS variables only) ---------- */
(function css(){if(typeof document==='undefined'||document.getElementById('c2u1a-css'))return;const s=document.createElement('style');s.id='c2u1a-css';s.textContent=`
.ca-sl{display:flex;flex-direction:column;gap:2px;font-size:13.5px;margin-top:10px;min-width:0}
.ca-sl .ca-h{display:flex;justify-content:space-between;gap:8px;align-items:baseline}
.ca-sl b{font-family:var(--mono);direction:ltr;unicode-bidi:isolate;color:var(--blue-ink);font-size:14px}
.ca-sl input[type=range]{width:100%;accent-color:var(--blue);direction:ltr;margin:4px 0}
.ca-row{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;align-items:center}
.ca-row .sub{margin:0}
.ca-lab .seg{flex-wrap:wrap;max-width:100%}
.ca-lab .seg button{white-space:nowrap}
.ca-q{border:1px solid var(--line);border-radius:12px;padding:10px 14px;margin:10px 0;background:var(--surface)}
.ca-q summary{cursor:pointer;font-weight:600;line-height:1.7}
.ca-ans{margin-top:8px;border-inline-start:3px solid var(--blue);padding:6px 12px;background:var(--blue-soft);border-radius:0 10px 10px 0}
.ca-tbl{overflow-x:auto;max-width:100%}
.ca-chip{display:inline-block;padding:2px 10px;border-radius:999px;font-size:12.5px;font-weight:700;background:var(--surface-2);color:var(--muted)}
.ca-chip.ok{background:var(--on-soft);color:var(--on)}
.ca-chip.ld{background:var(--blue-soft);color:var(--blue-ink)}
.ca-chip.warn{background:var(--stop-soft);color:var(--stop)}
.ca-chip.hot{background:var(--live-soft);color:var(--live)}
.ca-try{margin:6px 0 0;padding-inline-start:20px}
.ca-stage{display:grid;grid-template-columns:minmax(0,1fr);gap:4px;border-top:1px dashed var(--line);padding-top:8px;margin-top:8px}
.ca-stage p{margin:0;font-size:13.5px}
.ca-stage .lb{color:var(--live);font-weight:700}
.ca-num{direction:ltr;justify-content:flex-end;display:flex;gap:6px;flex-wrap:wrap;align-items:center;font-size:13.5px}
.ca-num input{width:84px;font:inherit;font-family:var(--mono);direction:ltr;padding:3px 6px;border:1px solid var(--line);border-radius:8px;background:var(--surface);color:var(--fg)}
.ca-fine{display:flex;gap:4px;flex-wrap:wrap;margin-top:4px}
.ca-fine .btn{padding:4px 10px;font-family:var(--mono);direction:ltr}
.ca-drag{touch-action:none;cursor:grab}
.fact b.ar{font-family:var(--font);font-size:15px}
`;document.head.appendChild(s)})();

/* ---------- small lab helpers ---------- */
function loopOn(el,fn){let last=performance.now();const f=now=>{if(!document.body.contains(el))return;const dt=Math.min(0.05,Math.max(0,(now-last)/1000));last=now;try{fn(dt)}catch(e){console.error(e);return}requestAnimationFrame(f)};requestAnimationFrame(f)}
function stepsUI(host,steps){let i=0;
  const draw=()=>{host.innerHTML=steps.map((s,j)=>`<li class="${j<i?'done':j===i?'cur':''}"><span class="k">${j<i?'✓':j+1}</span><div><h4>${ar(s.t)}</h4><p>${ar(s.x)}</p>${j===i?`<div class="act">${s.done?'<span class="hint">بانتظار تنفيذك…</span> <button class="btn" data-next>تخطَّ</button>':'<button class="btn primary" data-next>التالي</button>'}</div>`:''}</div></li>`).join('')+
    (i>=steps.length?`<li class="cur"><span class="k">✓</span><div><h4>أحسنت، أنهيت التجربة</h4><p style="display:block">جرّب قيماً أخرى، أو أعد التجربة من أولها.</p><div class="act"><button class="btn" data-restart>إعادة التجربة</button></div></div></li>`:'');B.math(host)};
  host.addEventListener('click',e=>{if(e.target.closest('[data-next]')){i++;draw()}if(e.target.closest('[data-restart]')){i=0;draw()}});draw();
  return {check(){const s=steps[i];if(s&&s.done&&s.done()){i++;draw()}},redraw:draw};}
const sl=(id,label,min,max,step,val)=>`<label class="ca-sl"><span class="ca-h"><span>${label}</span><b id="${id}-v"></b></span><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}" aria-label="${label.replace(/<[^>]+>/g,'')}"></label>`;
const segHTML=(attr,items,cur)=>`<div class="seg" role="group">${items.map(([v,l])=>`<button data-${attr}="${v}" aria-pressed="${String(v)===String(cur)}">${l}</button>`).join('')}</div>`;
const segSet=(el,attr,v)=>el.querySelectorAll(`[data-${attr}]`).forEach(b=>b.setAttribute('aria-pressed',String(String(b.dataset[attr])===String(v))));
const segBind=(el,attr,fn)=>el.querySelectorAll(`[data-${attr}]`).forEach(b=>b.addEventListener('click',()=>{segSet(el,attr,b.dataset[attr]);fn(b.dataset[attr])}));
const swHTML=(id,b,label,on)=>`<button class="sw" id="${id}" aria-pressed="${on?'true':'false'}"><span class="knob"></span><b>${b}</b><small>${label}</small></button>`;
const fact=(l,id)=>`<div class="fact"><span>${l}</span><b id="${id}">—</b></div>`;
const tryList=items=>`<div class="callout"><b>جرّب:</b><ol class="ca-try">${items.map(x=>`<li>${x}</li>`).join('')}</ol></div>`;
const arT=(x,y,s,o)=>{o=o||{};return `<text class="txt ar" x="${x}" y="${y}" text-anchor="${o.a||'middle'}"${o.fs?` font-size="${o.fs}"`:''}${o.col?` style="fill:var(${o.col})"`:''}>${s}</text>`};
const sb=(b,x)=>`${b}<tspan font-size="9" dy="4">${x}</tspan><tspan dy="-4"> </tspan>`;
const box=(svg,max)=>`<div class="svgbox" style="margin-inline:auto;${max?`max-width:${max}px`:''}">${svg}</div>`;
const Q=(n,q,ans)=>`<details class="ca-q"><summary>${n}: ${q}</summary><div class="ca-ans"><b>إجابة مقترحة (ليست من الكتاب):</b> ${ans}</div></details>`;
const colTxt=(col,s)=>`<b style="color:var(${col})">${s}</b>`;
function arrow(x1,y1,x2,y2,col,w,dash){w=w||2.4;const a=Math.atan2(y2-y1,x2-x1),L=Math.hypot(x2-x1,y2-y1);if(L<2)return '';const h=Math.min(11,L*0.6)+w;
  const bx=x2-h*Math.cos(a),by=y2-h*Math.sin(a),px=-Math.sin(a)*h*0.42,py=Math.cos(a)*h*0.42;
  return `<path d="M${fx(x1)} ${fx(y1)}L${fx(bx)} ${fx(by)}" stroke="var(${col})" stroke-width="${w}" fill="none" stroke-linecap="round"${dash?` stroke-dasharray="${dash}"`:''}/><path d="M${fx(x2)} ${fx(y2)}L${fx(bx+px)} ${fx(by+py)}L${fx(bx-px)} ${fx(by-py)}Z" fill="var(${col})"/>`}
/* resistor zig-zag between two points */
function zig(x1,y1,x2,y2,n,st){n=n||6;const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy),ux=dx/len,uy=dy/len,nx=-uy,ny=ux,lead=len*0.16,seg=(len-2*lead)/n;let p=`M${fx(x1)} ${fx(y1)}L${fx(x1+ux*lead)} ${fx(y1+uy*lead)}`;
  for(let i=0;i<n;i++){const s=(i%2?-1:1)*7,m=lead+seg*(i+0.5);p+=`L${fx(x1+ux*m+nx*s)} ${fx(y1+uy*m+ny*s)}`}
  return `<path class="w" ${st||''} d="${p}L${fx(x2-ux*lead)} ${fx(y2-uy*lead)}L${fx(x2)} ${fx(y2)}"/>`}
/* inductor loops between two points */
function ind(x1,y1,x2,y2,n,st){n=n||4;const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy),ux=dx/len,uy=dy/len;const lead=len*0.14,seg=(len-2*lead)/n,r=seg/2;
  let p=`M${fx(x1)} ${fx(y1)}L${fx(x1+ux*lead)} ${fx(y1+uy*lead)}`;for(let i=1;i<=n;i++){p+=`A${fx(r)} ${fx(r)} 0 0 1 ${fx(x1+ux*(lead+seg*i))} ${fx(y1+uy*(lead+seg*i))}`}
  return `<path class="w" ${st||''} d="${p}L${fx(x2)} ${fx(y2)}"/>`}
/* capacitor between two points (plates perpendicular to the line) */
function cap(x1,y1,x2,y2,st){const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy),ux=dx/len,uy=dy/len,nx=-uy,ny=ux,mx=(x1+x2)/2,my=(y1+y2)/2,g=5,h=14;
  const a=[mx-ux*g,my-uy*g],b=[mx+ux*g,my+uy*g];
  return `<path class="w" ${st||''} d="M${fx(x1)} ${fx(y1)}L${fx(a[0])} ${fx(a[1])}M${fx(b[0])} ${fx(b[1])}L${fx(x2)} ${fx(y2)}"/><path class="w" ${st||''} style="stroke-width:3" d="M${fx(a[0]+nx*h)} ${fx(a[1]+ny*h)}L${fx(a[0]-nx*h)} ${fx(a[1]-ny*h)}M${fx(b[0]+nx*h)} ${fx(b[1]+ny*h)}L${fx(b[0]-nx*h)} ${fx(b[1]-ny*h)}"/>`}
/* impedance box between two points */
function zbox(x1,y1,x2,y2,st){const mx=(x1+x2)/2,my=(y1+y2)/2,hor=Math.abs(x2-x1)>Math.abs(y2-y1),w=hor?Math.abs(x2-x1)*0.5:22,h=hor?22:Math.abs(y2-y1)*0.5;
  return `<path class="w" d="M${x1} ${y1}L${hor?mx-w/2:x1} ${hor?y1:my-h/2}M${hor?mx+w/2:x2} ${hor?y2:my+h/2}L${x2} ${y2}"/><rect x="${fx(mx-w/2)}" y="${fx(my-h/2)}" width="${fx(w)}" height="${fx(h)}" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.8" ${st||''}/>`}
/* AC voltage source (circle with a sine) */
function acSrc(cx,cy,r){return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.8"/><path d="M${fx(cx-r*0.55)} ${cy}q${fx(r*0.275)} ${fx(-r*0.55)} ${fx(r*0.55)} 0t${fx(r*0.55)} 0" fill="none" stroke="var(--fg)" stroke-width="1.6"/>`}
/* simple SVG x-y plot. o:{w,h,x0,x1,y0,y1,xt,yt,xl,yl,series:[{pts,col,w,dash}],under(X,Y),extra(X,Y)} */
function plotSVG(o){const W=o.w||520,H=o.h||260,L=o.left||46,R=14,T=14,Bm=38;
  const X=x=>L+(x-o.x0)/(o.x1-o.x0)*(W-L-R),Y=y=>H-Bm-(y-o.y0)/(o.y1-o.y0)*(H-T-Bm);
  let s='';(o.yt||[]).forEach(v=>{s+=`<path d="M${L} ${fx(Y(v))}H${W-R}" stroke="var(--line)"/>`+S.t(L-6,fx(Y(v)+4),o.yf?o.yf(v):v,'m','end')});
  (o.xt||[]).forEach(v=>{s+=`<path d="M${fx(X(v))} ${T}V${H-Bm}" stroke="var(--line)" stroke-dasharray="3 3"/>`+S.t(fx(X(v)),H-Bm+15,o.xf?o.xf(v):v,'m')});
  s+=`<path d="M${L} ${T}V${H-Bm}H${W-R}" stroke="var(--fg)" fill="none" stroke-width="1.4"/>`;
  if(o.y0<0&&o.y1>0)s+=`<path d="M${L} ${fx(Y(0))}H${W-R}" stroke="var(--fg)" stroke-width="1"/>`;
  if(o.xl)s+=S.t(W-R,H-4,o.xl,'','end');if(o.yl)s+=S.t(L+4,T+10,o.yl,'','start');
  if(o.under)s+=o.under(X,Y);
  (o.series||[]).forEach(se=>{if(!se.pts.length)return;s+=`<path d="${se.pts.map((p,i)=>(i?'L':'M')+fx(X(p[0]))+' '+fx(Y(clamp(p[1],o.y0-(o.y1-o.y0),o.y1+(o.y1-o.y0))))).join('')}" fill="none" stroke="var(${se.col})" stroke-width="${se.w||2.4}" ${se.dash?`stroke-dasharray="${se.dash}"`:''} stroke-linejoin="round" clip-path="url(#${o.cid||'caclip'})"/>`});
  if(o.extra)s+=o.extra(X,Y);
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${o.aria||'منحنى'}"><defs><clipPath id="${o.cid||'caclip'}"><rect x="${L}" y="${T-2}" width="${W-L-R}" height="${H-T-Bm+4}"/></clipPath></defs>${s}</svg>`}
const niceMax=v=>{v=Math.max(Math.abs(v),1e-9);const e=Math.pow(10,Math.floor(Math.log10(v)));return [1,1.5,2,2.5,3,4,5,6,8,10].map(k=>k*e).find(x=>x>=v*0.999)};
/* phasor / complex-plane diagram.
   o:{w,h,vecs:[{x,y,fx,fy,col,lb,dash,wd,lbOff}],axes:[xLabel,yLabel],arcs:[{a0,a1,r,lb,col}],fixed:{xmin,xmax,ymin,ymax},out:{}} */
function phasorSVG(o){const W=o.w||360,H=o.h||300,pad=o.pad||30;const V=o.vecs||[];
  let xmin,xmax,ymin,ymax;
  if(o.fixed){({xmin,xmax,ymin,ymax}=o.fixed)}else{const xs=[0],ys=[0];V.forEach(v=>{const a=v.fx||0,b=v.fy||0;xs.push(a,a+v.x);ys.push(b,b+v.y)});
    xmin=Math.min(...xs);xmax=Math.max(...xs);ymin=Math.min(...ys);ymax=Math.max(...ys);const span=Math.max(xmax-xmin,ymax-ymin,1e-9);
    const ex=(lo,hi)=>{const m=Math.max(span*0.3,hi-lo);const c=(lo+hi)/2;return [Math.min(lo,c-m/2),Math.max(hi,c+m/2)]};[xmin,xmax]=ex(xmin,xmax);[ymin,ymax]=ex(ymin,ymax);
    const mg=span*0.08;xmin-=mg;xmax+=mg;ymin-=mg;ymax+=mg;}
  const s=Math.min((W-2*pad)/(xmax-xmin),(H-2*pad)/(ymax-ymin));
  const ox=pad+((W-2*pad)-(xmax-xmin)*s)/2-xmin*s,oy=pad+((H-2*pad)-(ymax-ymin)*s)/2+ymax*s;
  const X=x=>ox+x*s,Y=y=>oy-y*s;if(o.out){o.out.X=X;o.out.Y=Y;o.out.s=s;o.out.ox=ox;o.out.oy=oy}
  let g='';
  if(o.grid){const st=o.grid;for(let k=Math.ceil(xmin/st);k<=Math.floor(xmax/st);k++)g+=`<path d="M${fx(X(k*st))} 6V${H-6}" stroke="var(--line)" stroke-width=".6"/>`;for(let k=Math.ceil(ymin/st);k<=Math.floor(ymax/st);k++)g+=`<path d="M6 ${fx(Y(k*st))}H${W-6}" stroke="var(--line)" stroke-width=".6"/>`}
  g+=arrow(6,oy,W-6,oy,'--muted',1.2)+arrow(ox,H-6,ox,6,'--muted',1.2);
  const ax=o.axes||['Real','Imag'];g+=S.t(W-8,oy-8,ax[0],'m','end')+S.t(ox+6,16,ax[1],'m','start');
  (o.arcs||[]).forEach(a=>{const r=a.r||30,a0=a.a0*D,a1=a.a1*D;if(Math.abs(a.a1-a.a0)<0.5)return;const large=Math.abs(a.a1-a.a0)>180?1:0,sw=a.a1>a.a0?0:1;
    g+=`<path d="M${fx(ox+r*Math.cos(a0))} ${fx(oy-r*Math.sin(a0))}A${r} ${r} 0 ${large} ${sw} ${fx(ox+r*Math.cos(a1))} ${fx(oy-r*Math.sin(a1))}" fill="none" stroke="var(${a.col||'--muted'})" stroke-width="1.3"/>`;
    if(a.lb){const am=(a0+a1)/2;g+=S.t(fx(ox+(r+14)*Math.cos(am)),fx(oy-(r+14)*Math.sin(am)+4),a.lb,'m')}});
  V.forEach(v=>{const x0=X(v.fx||0),y0=Y(v.fy||0),x1=X((v.fx||0)+v.x),y1=Y((v.fy||0)+v.y);g+=arrow(x0,y0,x1,y1,v.col||'--fg',v.wd||2.4,v.dash);
    if(v.lb){const L=Math.hypot(x1-x0,y1-y0)||1,ux=(x1-x0)/L,uy=(y1-y0)/L,off=v.lbOff||14;const tx=x1+ux*off+(v.lbN||0)*-uy,ty=y1+uy*off+(v.lbN||0)*ux;g+=`<text class="txt" x="${fx(tx)}" y="${fx(ty+4)}" text-anchor="middle" style="fill:var(${v.col||'--fg'})">${v.lb}</text>`}});
  if(o.extra)g+=o.extra(X,Y);
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${o.aria||'مخطط اتجاهي'}">${g}</svg>`}

/* RTL fix: wrap section/figure/equation numbers like 1-2 or 1-1-3 so they are not shown reversed */
const NUMRE=/(^|[^\w\-\\{>="'.\/])(\d+-\d+(?:-\d+)?)(?![\w\-}])/g;
const ar=s=>typeof s==='string'?s.replace(/(<[^>]*>)|([^<]+)/g,(m,tag,txt)=>tag?tag:txt.replace(NUMRE,'$1<bdi dir="ltr">$2</bdi>')):s;
function lesson(L){(L.theory||[]).forEach(b=>{['h','html','caption','note','err'].forEach(k=>{if(typeof b[k]==='string')b[k]=ar(b[k])});if(b.fig)b.fig=`<span class="ltr">${b.fig}</span>`;if(typeof b.draw==='function'&&!b._w){const d=b.draw;b.draw=(...a)=>{const r=d(...a);return /^<svg/.test(r)?r:ar(r)}}});
  (L.examples||[]).forEach(x=>{x.title=ar(x.title);x.q=ar(x.q);x.note=ar(x.note);const so=x.solve;x.solve=(...a)=>(so(...a)||[]).map(st=>Object.assign({},st,{t:ar(st.t)}))});
  (L.quiz||[]).forEach(q=>{q.q=ar(q.q);q.o=q.o.map(ar);q.e=ar(q.e)});L.summary=(L.summary||'').replace(NUMRE,'$1\u2066$2\u2069');B.lesson(L)}

/* ======================================================================
   Lesson 1 — AC definition, generation, sine wave, f and T
   ====================================================================== */
/* end-on view of a coil rotating between N (top) and S (bottom); a in degrees (0 = coil plane ⟂ field → e = 0) */
function genSVG(a,o){o=o||{};const W=o.w||470,cx=180,cy=150,r=70,v=Math.sin(a*D),Vm=o.Vm||1;
  let s=`<svg viewBox="0 0 ${o.noMeter?360:W} 300" role="img" aria-label="مولد بسيط: ملف يدور بين قطبين">`;
  s+=`<circle cx="${cx}" cy="${cy}" r="136" fill="none" stroke="var(--line)" stroke-width="10"/>`;
  s+=`<path d="M110 22H250V62Q180 78 110 62Z" fill="var(--stop-soft)" stroke="var(--stop)" stroke-width="2"/><path d="M110 278H250V238Q180 222 110 238Z" fill="var(--blue-soft)" stroke="var(--blue)" stroke-width="2"/>`;
  s+=S.t(180,48,'N','')+S.t(180,262,'S','');
  for(let x=118;x<=242;x+=31)s+=arrow(x,74,x,226,'--blue',1.1,'5 5');
  s+=S.t(262,214,'ϕ','b','start');
  [['A',cx+r+20,cy+4],['B',cx+24,cy-r+2],['C',cx-r-20,cy+4],['D',cx+24,cy+r+8]].forEach(([t,x,y])=>{s+=`<text class="txt" x="${x}" y="${y}" text-anchor="middle" style="fill:var(--live)">${t}</text>`});
  s+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--muted)" stroke-dasharray="3 4"/>`;
  const c1=[cx+r*Math.cos(a*D),cy-r*Math.sin(a*D)],c2=[cx-r*Math.cos(a*D),cy+r*Math.sin(a*D)];
  s+=`<path d="M${fx(c1[0])} ${fx(c1[1])}L${fx(c2[0])} ${fx(c2[1])}" stroke="var(--live)" stroke-width="5" stroke-linecap="round" opacity=".55"/>`;
  // rotation arrow (counter-clockwise)
  s+=`<path d="M${cx+28} ${cy-14}A31 31 0 0 0 ${cx-28} ${cy-14}" fill="none" stroke="var(--fg)" stroke-width="1.4"/>`+arrow(cx-20,cy-24,cx-29,cy-12,'--fg',1.4)+S.t(cx,cy+6,'ω','');
  // conductors with current direction (• out, × in)
  const cond=(p,sg)=>{let q=`<circle cx="${fx(p[0])}" cy="${fx(p[1])}" r="11" fill="var(--surface)" stroke="var(--fg)" stroke-width="2"/>`;
    if(Math.abs(sg)>0.04){if(sg>0)q+=`<circle cx="${fx(p[0])}" cy="${fx(p[1])}" r="3.4" fill="var(--fg)"/>`;else q+=`<path d="M${fx(p[0]-5)} ${fx(p[1]-5)}l10 10M${fx(p[0]+5)} ${fx(p[1]-5)}l-10 10" stroke="var(--fg)" stroke-width="2"/>`}return q};
  // velocity arrows (tangent, ccw)
  [c1,c2].forEach((p,i)=>{const ang=Math.atan2(-(p[1]-cy),p[0]-cx),tx=-Math.sin(ang),ty=-Math.cos(ang);s+=arrow(p[0]+tx*14,p[1]+ty*14,p[0]+tx*40,p[1]+ty*40,'--on',1.6)});
  s+=cond(c1,v)+cond(c2,-v);
  if(!o.noMeter){const gx=400,gy=176,R=52;s+=`<path d="M${gx-R} ${gy}A${R} ${R} 0 0 1 ${gx+R} ${gy}" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.6"/>`;
    for(let k=-4;k<=4;k++){const t=(k*18)*D;s+=`<path d="M${fx(gx+R*0.86*Math.sin(t))} ${fx(gy-R*0.86*Math.cos(t))}L${fx(gx+R*Math.sin(t))} ${fx(gy-R*Math.cos(t))}" stroke="var(--fg)" stroke-width="${k===0?2:1}"/>`}
    const t=clamp(v,-1.05,1.05)*72*D;s+=`<path d="M${gx} ${gy}L${fx(gx+R*0.8*Math.sin(t))} ${fx(gy-R*0.8*Math.cos(t))}" stroke="var(--live)" stroke-width="2.6" stroke-linecap="round"/><circle cx="${gx}" cy="${gy}" r="4" fill="var(--fg)"/>`;
    s+=S.t(gx-R+4,gy+16,'−','m','start')+S.t(gx+R-4,gy+16,'+','m','end')+S.t(gx,gy+20,'V','')+S.t(gx,gy+40,fm(rd(v*Vm,1),1)+' V','b');
}
  return s+'</svg>'}
/* one stage of الشكل 1-2: coil + partial wave up to angle aMax */
function stageSVG(aMax){let s=`<svg viewBox="0 0 520 150" role="img" aria-label="مرحلة من توليد الموجة">`;
  const cx=70,cy=75,r=36;s+=`<rect x="34" y="6" width="72" height="16" rx="3" fill="var(--stop-soft)" stroke="var(--stop)"/><rect x="34" y="128" width="72" height="16" rx="3" fill="var(--blue-soft)" stroke="var(--blue)"/>`+S.t(70,19,'N','')+S.t(70,141,'S','');
  const c1=[cx+r*Math.cos(aMax*D),cy-r*Math.sin(aMax*D)],c2=[cx-r*Math.cos(aMax*D),cy+r*Math.sin(aMax*D)];
  s+=`<path d="M${fx(c1[0])} ${fx(c1[1])}L${fx(c2[0])} ${fx(c2[1])}" stroke="var(--live)" stroke-width="4" stroke-linecap="round"/><circle cx="${fx(c1[0])}" cy="${fx(c1[1])}" r="6" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/><circle cx="${fx(c2[0])}" cy="${fx(c2[1])}" r="6" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/>`;
  const X=a=>150+a/360*350,Y=v=>75-v*52;s+=`<path d="M150 75H510M150 18V132" stroke="var(--fg)" stroke-width="1.2"/>`;
  [0,90,180,270,360].forEach(a=>{s+=`<path d="M${fx(X(a))} 18V132" stroke="var(--line)" stroke-dasharray="3 3"/>`+S.t(fx(X(a)),146,a+'°','m')});
  if(aMax>0){let p=`M${X(0)} ${Y(0)}`;for(let a=0;a<=aMax;a+=3)p+=`L${fx(X(a))} ${fx(Y(Math.sin(a*D)))}`;
    s+=`<path d="${p}L${fx(X(aMax))} 75Z" fill="var(--live-soft)" stroke="none"/><path d="${p.replace(/^M/,'M')}" fill="none" stroke="var(--live)" stroke-width="2.4"/>`;
    s+=`<circle cx="${fx(X(aMax))}" cy="${fx(Y(Math.sin(aMax*D)))}" r="4" fill="var(--live)"/>`}
  return s+'</svg>'}
function sineFig13(){return plotSVG({w:560,h:240,x0:0,x1:700,y0:-1.25,y1:1.25,xt:[90,180,270,360],xf:v=>v+'°',yt:[],xl:'t',yl:'V',cid:'c13',
  series:[{pts:Array.from({length:141},(_,i)=>[i*5,Math.sin(i*5*D)]),col:'--live'}],
  extra:(X,Y)=>`<path d="M${X(0)} ${fx(Y(1))}H${X(700)}" stroke="var(--live)" stroke-dasharray="5 4"/>`+S.t(X(0)+6,fx(Y(1)-6),sb('V','m'),'','start')+S.t(X(0)-8,Y(0)+14,'O','m','end')+arrow(X(180),Y(-1.15),X(0)+2,Y(-1.15),'--fg',1.2)+arrow(X(180),Y(-1.15),X(360)-2,Y(-1.15),'--fg',1.2)+S.t(X(180),Y(-1.15)-5,'T','')})}
function fig14(){const N=5,tw=4;return plotSVG({w:560,h:220,x0:0,x1:4.3,y0:-1.3,y1:1.6,xt:[0,1,2,3,4],yt:[],xl:'t (µs)',yl:'V',cid:'c14',
  series:[{pts:Array.from({length:401},(_,i)=>{const t=i/100;return [t,Math.sin(2*PI*N*t/tw)]}),col:'--live',w:2}],
  extra:(X,Y)=>arrow(X(2),Y(1.35),X(0)+2,Y(1.35),'--fg',1.2)+arrow(X(2),Y(1.35),X(4)-2,Y(1.35),'--fg',1.2)+arT(X(2),Y(1.35)-6,'5 دورات',{fs:12})})}

const L1_ERR=`<b>ملاحظات على الكتاب (هذا الدرس):</b><ol style="margin:6px 0 0;padding-inline-start:20px">
 <li>ص 8: النص يقول إن <b>القطبين يدوران</b> ويذكر أشكالاً (a) و(b) و(c) و(d)، بينما الشكل 1-1 فيه الحروف A وB وC وD فقط، والشكل 1-2 يرسم <b>ملفاً يدور</b> بين قطبين ثابتين. فهمنا الحروف على أنها مواضع الموصل (A وC: الجهد صفر، B: أعلى قيمة، D: أعلى قيمة بالاتجاه المعاكس)، والحركة النسبية واحدة في الحالتين.</li>
 <li>ص 10–11: رقما الشكلين مطبوعان «3-1» و«4-1» بعكس الترتيب، وصحّحناهما هنا إلى (1-3) و(1-4) كما في النص.</li>
 <li>مثال 1-1-2 ص 11: كُتب تحت السؤال «أ- 50 Hz ب- 60 Hz» وهما منقولان من المثال السابق ولا علاقة لهما بالسؤال، فحذفناهما. وعنوان المحور الأفقي في الشكل «T(µs)» والمقصود الزمن \\(t\\).</li>
 <li>مثال 1-1-2 ص 12: طُبع \\(f=\\frac{1}{0.8\\times10^{-6}}=1.2\\ \\text{MHz}\\) والصحيح <b>1.25 MHz</b>. انظر المفتاح «كما في الكتاب / المصحح» أعلاه، والحاسبة في تبويب «الأمثلة المحلولة».</li></ol>`;

lesson({
 id:'u1-l1',unit:1,order:1,pages:'1، 5–12',
 title:'التيار المتردد: تعريفه وتوليده وموجته وتردده',
 summary:'ما هو التيار المتردد، وكيف يولده ملف يدور في مجال مغناطيسي، وشكل الموجة الجيبية ونصفاها الموجب والسالب، والتحويل بين الدرجات والراديان، والتردد f والزمن الدوري T = 1/f. مع مقدمة الحقيبة وتمهيدها وأهداف الوحدة الأولى.',
 stations:[
  {intro:true},

  {st:1,short:'مقدمة الحقيبة',title:'مقدمة الحقيبة: لمن كُتبت هذه الحقيبة؟',ref:'ص 1',
   q:'هذه الحقيبة تُدرَّس لأكثر من تخصص. ما هذه التخصصات، ولماذا يحتاجها كل منها؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="بطاقة الحقيبة: دوائر كهربائية - 2 وثلاثة تخصصات" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><rect x="70" y="40" width="220" height="96" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><text x="180" y="78" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="600" direction="rtl">الحقيبة التدريبية</text><text x="180" y="108" text-anchor="middle" font-size="19" fill="#2C4A40" font-weight="700" direction="rtl">دوائر كهربائية - 2</text><text x="180" y="168" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">لمتدربي تخصصات:</text><rect x="80" y="184" width="200" height="28" rx="14" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="180" y="203" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">الآلات والمعدات الكهربائية</text><rect x="80" y="220" width="200" height="28" rx="14" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/><text x="180" y="239" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">القوى الكهربائية</text><rect x="80" y="256" width="200" height="28" rx="14" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><text x="180" y="275" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">مشغل لوحة التحكم</text><text x="180" y="300" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="600" direction="rtl">الكليات التقنية</text></svg>`,
   cap:'غلاف الحقيبة مختصراً: اسمها والتخصصات الثلاثة التي تُدرَّس لها.',
   side:[
    {predict:{q:'أي التخصصات التالية <b>ليس</b> من التخصصات التي ذكرتها مقدمة الحقيبة؟',opts:[
     ['الآلات والمعدات الكهربائية',false,'هذا أول التخصصات المذكورة في المقدمة.'],
     ['مشغل لوحة التحكم',false,'هذا من التخصصات الثلاثة المذكورة.'],
     ['الإلكترونيات والاتصالات',true,'المقدمة ذكرت ثلاثة تخصصات فقط: الآلات والمعدات الكهربائية، والقوى الكهربائية، ومشغل لوحة التحكم.'],
     ['القوى الكهربائية',false,'هذا من التخصصات الثلاثة المذكورة.']]}}
   ],
   body:[
    {book:String.raw`<p>تسعى المؤسسة العامة للتدريب التقني والمهني لتأهيل الكوادر الوطنية المدربة القادرة على شغل الوظائف التقنية والفنية والمهنية المتوفرة في سوق العمل، ويأتي هذا الاهتمام نتيجة للتوجهات السديدة من لدن قادة هذا الوطن التي تصب في مجملها نحو إيجاد وطن متكامل يعتمد ذاتياً على الله ثم على موارده وعلى قوة شبابه المسلح بالعلم والإيمان من أجل الاستمرار قدماً في دفع عجلة التقدم التنموي: لتصل بعون الله تعالى إلى مصاف الدول المتقدمة صناعياً.</p>
     <p>وقد خطت الإدارة العامة لتصميم وتطوير المناهج خطوة إيجابية تتفق مع التجارب الدولية المتقدمة في بناء البرامج التدريبية، وفق أساليب علمية حديثة تحاكي متطلبات سوق العمل بكافة تخصصاته لتلبي متطلباته، وقد تمثلت هذه الخطوة في مشروع إعداد <b>المعايير المهنية الوطنية</b> الذي يمثل الركيزة الأساسية في بناء البرامج التدريبية، إذ تعتمد المعايير في بنائها على تشكيل لجان تخصصية تمثل سوق العمل والمؤسسة العامة للتدريب التقني والمهني بحيث تتوافق الرؤية العلمية مع الواقع العملي الذي تفرضه متطلبات سوق العمل، لتخرج هذه اللجان في النهاية بنظرة متكاملة لبرنامج تدريبي أكثر التصاقاً بسوق العمل، وأكثر واقعية في تحقيق متطلباته الأساسية.</p>
     <p>وتتناول هذه الحقيبة التدريبية " دوائر كهربائية - 2 " لمتدربي تخصصات " <b>الآلات والمعدات الكهربائية والقوى الكهربائية ومشغل لوحة التحكم</b> " للكليات التقنية موضوعات حيوية تتناول كيفية اكتساب المهارات اللازمة لهذا التخصص.</p>
     <p>والإدارة العامة لتصميم وتطوير المناهج وهي تضع بين يديك هذه الحقيبة التدريبية تأمل من الله عز وجل أن تسهم بشكل مباشر في تأصيل المهارات الضرورية اللازمة، بأسلوب مبسط يخلو من التعقيد، مدعم بالتطبيقات والأشكال التي تدعم عملية اكتساب هذه المهارات.</p>`,ref:'ص 1'},
    {tip:String.raw`<p>الفكرة باختصار: هذه الحقيبة بُنيت على <b>المعايير المهنية الوطنية</b>، أي على ما يطلبه سوق العمل فعلاً من الفني الكهربائي. والتيار المتردد هو ما ستتعامل معه في المحركات واللوحات والشبكات، لذلك يحتاجه التخصصات الثلاثة.</p>`}
   ]},

  {st:2,short:'تمهيد',title:'تمهيد: ماذا ستدرس في هذا المقرر؟',ref:'ص 5',
   q:'المقرر كله وحدتان. ما موضوع كل وحدة، وأين يقع ما ستدرسه الآن؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="بطاقتان للوحدتين، والأولى مظللة وفيها فصولها الثلاثة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="الوحدة الأولى: ثلاثة فصول. الدروس السبعة الأولى في هذا الموقع تغطي الفصل الأول كاملاً وبداية الفصل الثاني."><rect x="186" y="44" width="140" height="210" rx="14" fill="#F2C14E" stroke="#2C4A40" stroke-width="3"/><circle cx="304" cy="66" r="12" fill="#2C4A40" stroke="#2C4A40" stroke-width="0"/><text x="304" y="71" text-anchor="middle" font-size="13" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">1</text><text x="256" y="92" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700" direction="rtl">الوحدة الأولى</text><text x="256" y="112" text-anchor="middle" font-size="12" fill="#2C4A40" direction="rtl">مبادئ التيار المتردد</text><text x="256" y="128" text-anchor="middle" font-size="12" fill="#2C4A40" direction="rtl">وتحليل دوائره</text><rect x="196" y="150" width="120" height="24" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.6"/><text x="256" y="166" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="600" direction="rtl">التيار المتردد</text><rect x="196" y="182" width="120" height="24" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.6"/><text x="256" y="198" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="600" direction="rtl">المعاوقات والتوصيلات</text><rect x="196" y="214" width="120" height="24" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.6"/><text x="256" y="230" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="600" direction="rtl">القدرة ومعامل القدرة</text></g><rect x="34" y="44" width="140" height="210" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><circle cx="152" cy="66" r="12" fill="#2C4A40" stroke="#2C4A40" stroke-width="0"/><text x="152" y="71" text-anchor="middle" font-size="13" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">2</text><text x="104" y="92" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700" direction="rtl">الوحدة الثانية</text><text x="104" y="112" text-anchor="middle" font-size="12" fill="#2C4A40" direction="rtl">دوائر التيار المتردد</text><text x="104" y="128" text-anchor="middle" font-size="12" fill="#2C4A40" direction="rtl">ثلاثية الأوجه</text><rect x="44" y="150" width="120" height="24" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.6"/><text x="104" y="166" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="600" direction="rtl">نجمة ودلتا</text><rect x="44" y="182" width="120" height="24" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.6"/><text x="104" y="198" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="600" direction="rtl">القدرة والواتميتر</text><text x="180" y="290" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">الحقيبة وحدتان رئيستان</text></svg>`,
   cap:'الحقيبة وحدتان: الأولى (المظللة) فيها ثلاثة فصول، والثانية فيها فصلان.<br><b>مرّر المؤشر على بطاقة الوحدة الأولى (أو المسها في الجوال) لتعرف موقع هذه الدروس منها.</b>',
   side:[
    {predict:{q:'في أي وحدة تدرس دوائر التيار المتردد <b>ثلاثية الأوجه</b> وتوصيلتي النجمة والدلتا؟',opts:[
     ['الوحدة الثانية',true,'نص التمهيد: «الوحدة الثانية فسندرس فيها دوائر التيار المتردد ثلاثية الأوجه والتوصيلات المختلفة المستعملة في هذه الدوائر».'],
     ['الوحدة الأولى',false,'الوحدة الأولى عن مبادئ التيار المتردد وتحليل دوائره (أحادية الوجه).'],
     ['في الفصل الثالث من الوحدة الأولى',false,'الفصل الثالث عن أنواع القدرة ومعامل القدرة والواتميتر.']]}}
   ],
   body:[
    {book:String.raw`<p>فإن مقرر الدوائر الكهربائية -2 يهدف إلى تعريف المتدرب بأساسيات وبمبادئ التيار المتردد وتحليل دوائره بالإضافة إلى دوائر التيار المتردد ثلاثية الأوجه. ودراسة هذا المقرر ستمكن المتدرب إن شاء الله من:</p>
     <ul><li>الإلمام بمبادئ التيار المتردد وكيفية تحليل دوائره.</li><li>فهم التوصيلات المختلفة للمعاوقات في دوائر التيار المتردد.</li><li>الإلمام بدوائر التيار المتردد ثلاثي الأطوار (الأوجه).</li></ul>
     <p>ولتحقيق هذه الأهداف بإذن الله تعالى فقد قسمت هذه الحقيبة التدريبية إلى وحدتين رئيستين:</p>
     <p><b>الوحدة الأولى:</b> تعنى الوحدة الأولى بدراسة مبادئ التيار المتردد وتحليل دوائره، وقد قسمت إلى ثلاثة فصول: الفصل الأول يتطرق إلى تعريف التيار المتردد وشرح خصائصه، فنعرف الدورة والتردد والقيمة اللحظية والقيمة الفعالة. الفصل الثاني ومنه سنعرف الأنواع المختلفة للمعاوقات كما نعرف مفهوم المطاور الذي يسهل كثيراً تحليل دوائر التيار المتردد. بعد ذلك سنشرح التوصيلات المختلفة للمعاوقات (التوصيل على التوالي، والتوصيل على التوازي، والتوصيل على التوالي والتوازي)، وسنبين بالأمثلة الخطوات المستعملة في التحليل.</p>
     <p>أما الفصل الثالث فإنه يعنى بتعريف الأنواع المختلفة للقدرة الكهربائية في دوائر التيار المتردد وبتعريف معامل القدرة ذي الأهمية الكبرى في التقنية الكهربائية. كما سندرس الواتميتر المستعمل لقياس القدرة الفعالة.</p>
     <p><b>الوحدة الثانية</b> فسندرس فيها دوائر التيار المتردد ثلاثية الأوجه والتوصيلات المختلفة المستعملة في هذه الدوائر. وقد قسمت إلى فصلين: في الفصل الأول سنقوم بوصف نظام التيار المتردد ثلاثي الأطوار مع ذكر طريقة توليد هذا النظام وتتابع الأطوار وكذلك سنتطرق إلى دراسة التوصيل على شكل نجمة ودلتا والعلاقة بين قيم الخط وقيم الوجه للتيار والجهد في حالتي التوصيلتين السابقتين. وفي الفصل الأخير القدرة في الدوائر ثلاثية الأوجه كما سنشرح طريقة قياس القدرة باستعمال جهازي الواتميتر.</p>`,ref:'ص 5'},
    {tip:String.raw`<p>الدروس السبعة الأولى في هذا الموقع تغطي <b>الفصل الأول كاملاً</b> (التيار المتردد وخصائصه) و<b>بداية الفصل الثاني</b> حتى الرنين في دوائر التوالي.</p>`}
   ]},

  {st:3,short:'أهداف الوحدة',title:'الوحدة الأولى: الهدف العام والأهداف التفصيلية',ref:'ص 7',
   q:'حين تنتهي من الوحدة الأولى، ما الذي يُنتظر منك أن تتقنه؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="قائمة بأهداف الوحدة الخمسة، والأربعة الأولى مميزة بدائرة خضراء" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><rect x="30" y="34" width="300" height="240" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><text x="180" y="66" text-anchor="middle" font-size="14.5" fill="#2C4A40" font-weight="700" direction="rtl">الأهداف التفصيلية للوحدة</text><g data-tip="يبدأ في الدروس السبعة الأولى (الفصل الأول وبداية الفصل الثاني)."><circle cx="300" cy="100" r="11" fill="#12855A" stroke="#12855A" stroke-width="2"/><text x="300" y="104.5" text-anchor="middle" font-size="12" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">1</text><text x="282" y="104.5" text-anchor="start" font-size="12.5" fill="#2C4A40" direction="rtl">خواص التيار المتردد وتوليده</text></g><g data-tip="يبدأ في الدروس السبعة الأولى (الفصل الأول وبداية الفصل الثاني)."><circle cx="300" cy="134" r="11" fill="#12855A" stroke="#12855A" stroke-width="2"/><text x="300" y="138.5" text-anchor="middle" font-size="12" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">2</text><text x="282" y="138.5" text-anchor="start" font-size="12.5" fill="#2C4A40" direction="rtl">الموجة والزمن الدوري والتردد</text></g><g data-tip="يبدأ في الدروس السبعة الأولى (الفصل الأول وبداية الفصل الثاني)."><circle cx="300" cy="168" r="11" fill="#12855A" stroke="#12855A" stroke-width="2"/><text x="300" y="172.5" text-anchor="middle" font-size="12" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">3</text><text x="282" y="172.5" text-anchor="start" font-size="12.5" fill="#2C4A40" direction="rtl">الممانعات الحثية والسعوية</text></g><g data-tip="يبدأ في الدروس السبعة الأولى (الفصل الأول وبداية الفصل الثاني)."><circle cx="300" cy="202" r="11" fill="#12855A" stroke="#12855A" stroke-width="2"/><text x="300" y="206.5" text-anchor="middle" font-size="12" fill="#FBF6EE" font-weight="700" font-family="var(--mono)" direction="ltr">4</text><text x="282" y="206.5" text-anchor="start" font-size="12.5" fill="#2C4A40" direction="rtl">دوائر الرنين</text></g><circle cx="300" cy="236" r="11" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="300" y="240.5" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">5</text><text x="282" y="240.5" text-anchor="start" font-size="12.5" fill="#2C4A40" direction="rtl">القدرة الظاهرية والفعالة وغير الفعالة</text><g data-tip="الدائرة الخضراء: هدف يبدأ في هذه الدروس السبعة. الهدف الخامس (أنواع القدرة) في الفصل الثالث."><circle cx="252" cy="298" r="8" fill="#12855A" stroke="#12855A" stroke-width="0"/><text x="238" y="303" text-anchor="start" font-size="12.5" fill="#2C4A40" font-weight="600" direction="rtl">يبدأ في هذه الدروس السبعة</text></g></svg>`,
   cap:'الأهداف الخمسة مختصرة، والدوائر الخضراء أهداف تبدأ في هذه الدروس السبعة.<br><b>مرّر المؤشر على الأهداف الخضراء أو على الدائرة أسفل القائمة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'ما <b>الهدف العام</b> للوحدة الأولى؟',opts:[
     ['حساب القدرة في الدوائر ثلاثية الأوجه',false,'هذا من موضوعات الوحدة الثانية.'],
     ['معرفة الخطوات المستعملة لتحليل دوائر التيار المتردد البسيطة',true,'هذا نص الهدف العام في ص 7.'],
     ['تصميم المولدات الكهربائية',false,'الوحدة تشرح فكرة توليد التيار المتردد فقط، ولا تتناول التصميم.']]}}
   ],
   body:[
    {book:String.raw`<p><b>الهدف العام للوحدة:</b> معرفة الخطوات المستعملة لتحليل دوائر التيار المتردد البسيطة.</p>
     <p><b>الأهداف التفصيلية:</b></p>
     <ol><li>أن يلم المتدرب بخواص التيار المتردد وكيفية توليده.</li><li>أن يلم المتدرب بتعريف الموجة – الزمن الدوري – التردد.</li><li>أن يلم المتدرب بالممانعات الحثية والسعوية.</li><li>أن يلم المتدرب بدوائر الرنين.</li><li>أن يلم المتدرب بتعريف القدرة الظاهرية والفعالة وغير الفعالة.</li></ol>`,ref:'ص 7'},
    {tip:String.raw`<p>الهدفان 1 و2 في الفصل الأول (هذا الدرس والدروس <span class="ltr">2–4</span>)، والهدف 3 في الدرس الخامس، والهدف 4 يبدأ في الدرس السابع (الرنين على التوالي). أما الهدف 5 فهو في الفصل الثالث.</p>`}
   ]},

  {st:4,short:'الفصل الأول',title:'الفصل الأول: التيار المتردد',ref:'ص 8',
   q:'لماذا يبدأ المقرر بالتيار المتردد قبل أي دائرة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="رمز التيار المتردد: موجة داخل دائرة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DCEAF5"/><circle cx="180" cy="138" r="74" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><path d="M130 138 L131.7 134.9 L133.3 131.8 L135 128.7 L136.7 125.8 L138.3 123 L140 120.4 L141.7 117.9 L143.3 115.7 L145 113.7 L146.7 112 L148.3 110.6 L150 109.5 L151.7 108.7 L153.3 108.2 L155 108 L156.7 108.2 L158.3 108.7 L160 109.5 L161.7 110.6 L163.3 112 L165 113.7 L166.7 115.7 L168.3 117.9 L170 120.4 L171.7 123 L173.3 125.8 L175 128.7 L176.7 131.8 L178.3 134.9 L180 138 L181.7 141.1 L183.3 144.2 L185 147.3 L186.7 150.2 L188.3 153 L190 155.6 L191.7 158.1 L193.3 160.3 L195 162.3 L196.7 164 L198.3 165.4 L200 166.5 L201.7 167.3 L203.3 167.8 L205 168 L206.7 167.8 L208.3 167.3 L210 166.5 L211.7 165.4 L213.3 164 L215 162.3 L216.7 160.3 L218.3 158.1 L220 155.6 L221.7 153 L223.3 150.2 L225 147.3 L226.7 144.2 L228.3 141.1 L230 138" stroke="#E8735A" stroke-width="5" fill="none" stroke-linejoin="round" stroke-linecap="round"/><g data-tip="⟦AC⟧ اختصار ⟦Alternating Current⟧ أي «التيار المتردد». والرمز ⟦~⟧ يُكتب على الأجهزة والمقابس للدلالة عليه."><text x="180" y="196" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">AC ~</text><rect x="140" y="178" width="80" height="26" fill="transparent"/></g><text x="180" y="250" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700" direction="rtl">الأكثر استعمالاً</text><text x="180" y="276" text-anchor="middle" font-size="13" fill="#2C4A40" direction="rtl">في كل مجالات التقنية الكهربائية</text></svg>`,
   cap:'رمز التيار المتردد كما تراه على الأجهزة واللوحات.<br><b>مرّر المؤشر على الرمز <span class="ltr">AC ~</span> (أو المسه في الجوال) لتعرف معناه.</b>',
   side:[
    {add:String.raw`<p>الكهرباء التي تصل إلى المنازل والمصانع من الشبكة هي تيار متردد، وعليها تعمل المحركات والمكيفات والإنارة. أما البطاريات فتعطي تياراً مستمراً (درسته في دوائر كهربائية-1).</p>`},
    {predict:{q:'لماذا يجب فهم خصائص التيار المتردد جيداً حسب الكتاب؟',opts:[
     ['لأنه أسهل في الحساب من التيار المستمر',false,'الكتاب لم يقل ذلك؛ بل سيقدم أدوات خاصة (المطاور والأعداد المركبة) لأن حساباته أصعب.'],
     ['لأنه الأكثر استعمالاً في كل مجالات التقنية الكهربائية',true,'نص الكتاب في ص 8.'],
     ['لأنه لا يحتاج إلى مولدات',false,'العكس: سنرى في هذا الدرس كيف يولده المولد.']]}}
   ],
   body:[
    {book:String.raw`<p>التيار المتردد هو الأكثر استعمالاً في كل مجالات التقنية الكهربائية، ولهذا يجب فهم خصائصه جيداً. وسنحاول شرح هذه الخصائص في هذا الفصل بإيجاز غير مخل.</p>`,ref:'ص 8'},
    {tip:String.raw`<p>خصائص التيار المتردد التي ستدرسها في هذا الفصل: تعريفه وتوليده، شكل موجته، التردد والزمن الدوري، القيمة اللحظية، القيمة المتوسطة والفعالة، ثم تمثيله بالمتجهات (المطاور).</p>`}
   ]},

  {st:5,short:'تعريف التيار المتردد',title:'<span class="ltr">1-1-1</span> تعريف التيار المتردد',ref:'ص 8',
   q:'ما الذي يجعل التيار «متردداً»: تغير قيمته فقط، أم شيء آخر أيضاً؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="موجة تيار متردد: دورتان متطابقتان، كل دورة نصف موجب ونصف سالب" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><line x1="44" y1="150" x2="318" y2="150" stroke="#7A8A84" stroke-width="1.4" stroke-linecap="round"/><polygon points="326,150 318,153.6 318,146.4" fill="#7A8A84"/><line x1="50" y1="250" x2="50" y2="58" stroke="#7A8A84" stroke-width="1.4" stroke-linecap="round"/><polygon points="50,50 53.6,58 46.4,58" fill="#7A8A84"/><text x="322" y="166" text-anchor="end" font-size="11" fill="#7A8A84" font-family="var(--mono)" direction="ltr">t</text><g data-tip="النصف الأول من الدورة: التيار في اتجاه (موجب) وقيمته تكبر ثم تصغر."><path d="M50 150 L52.2 142.7 L54.3 135.4 L56.5 128.4 L58.7 121.5 L60.8 115 L63 108.9 L65.2 103.2 L67.3 98 L69.5 93.4 L71.7 89.4 L73.8 86.1 L76 83.4 L78.2 81.5 L80.3 80.4 L82.5 80 L84.7 80.4 L86.8 81.5 L89 83.4 L91.2 86.1 L93.3 89.4 L95.5 93.4 L97.7 98 L99.8 103.2 L102 108.9 L104.2 115 L106.3 121.5 L108.5 128.4 L110.7 135.4 L112.8 142.7 L115 150 L117.2 157.3 L119.3 164.6 L121.5 171.6 L123.7 178.5 L125.8 185 L128 191.1 L130.2 196.8 L132.3 202 L134.5 206.6 L136.7 210.6 L138.8 213.9 L141 216.6 L143.2 218.5 L145.3 219.6 L147.5 220 L149.7 219.6 L151.8 218.5 L154 216.6 L156.2 213.9 L158.3 210.6 L160.5 206.6 L162.7 202 L164.8 196.8 L167 191.1 L169.2 185 L171.3 178.5 L173.5 171.6 L175.7 164.6 L177.8 157.3 L180 150 L180 150 L50 150 Z" stroke="#E8735A" stroke-width="0" fill="#F6C9B6" stroke-linejoin="round" stroke-linecap="round" opacity="0.9"/><rect x="50" y="80" width="65" height="70" fill="transparent"/></g><g data-tip="النصف الثاني: التيار يعكس اتجاهه (سالب) وقيمته تكبر ثم تصغر."><path d="M115 150 L117.2 157.3 L119.3 164.6 L121.5 171.6 L123.7 178.5 L125.8 185 L128 191.1 L130.2 196.8 L132.3 202 L134.5 206.6 L136.7 210.6 L138.8 213.9 L141 216.6 L143.2 218.5 L145.3 219.6 L147.5 220 L149.7 219.6 L151.8 218.5 L154 216.6 L156.2 213.9 L158.3 210.6 L160.5 206.6 L162.7 202 L164.8 196.8 L167 191.1 L169.2 185 L171.3 178.5 L173.5 171.6 L175.7 164.6 L177.8 157.3 L180 150 L180 150 L115 150 Z" stroke="#4FB3A9" stroke-width="0" fill="#BFE3DE" stroke-linejoin="round" stroke-linecap="round"/><rect x="115" y="150" width="65" height="70" fill="transparent"/></g><path d="M180 150 L182.2 142.7 L184.3 135.4 L186.5 128.4 L188.7 121.5 L190.8 115 L193 108.9 L195.2 103.2 L197.3 98 L199.5 93.4 L201.7 89.4 L203.8 86.1 L206 83.4 L208.2 81.5 L210.3 80.4 L212.5 80 L214.7 80.4 L216.8 81.5 L219 83.4 L221.2 86.1 L223.3 89.4 L225.5 93.4 L227.7 98 L229.8 103.2 L232 108.9 L234.2 115 L236.3 121.5 L238.5 128.4 L240.7 135.4 L242.8 142.7 L245 150 L247.2 157.3 L249.3 164.6 L251.5 171.6 L253.7 178.5 L255.8 185 L258 191.1 L260.2 196.8 L262.3 202 L264.5 206.6 L266.7 210.6 L268.8 213.9 L271 216.6 L273.2 218.5 L275.3 219.6 L277.5 220 L279.7 219.6 L281.8 218.5 L284 216.6 L286.2 213.9 L288.3 210.6 L290.5 206.6 L292.7 202 L294.8 196.8 L297 191.1 L299.2 185 L301.3 178.5 L303.5 171.6 L305.7 164.6 L307.8 157.3 L310 150 L310 150 L180 150 Z" stroke="#E8735A" stroke-width="0" fill="#F6C9B6" stroke-linejoin="round" stroke-linecap="round"/><path d="M50 150 L52.2 142.7 L54.3 135.4 L56.5 128.4 L58.7 121.5 L60.8 115 L63 108.9 L65.2 103.2 L67.3 98 L69.5 93.4 L71.7 89.4 L73.8 86.1 L76 83.4 L78.2 81.5 L80.3 80.4 L82.5 80 L84.7 80.4 L86.8 81.5 L89 83.4 L91.2 86.1 L93.3 89.4 L95.5 93.4 L97.7 98 L99.8 103.2 L102 108.9 L104.2 115 L106.3 121.5 L108.5 128.4 L110.7 135.4 L112.8 142.7 L115 150 L117.2 157.3 L119.3 164.6 L121.5 171.6 L123.7 178.5 L125.8 185 L128 191.1 L130.2 196.8 L132.3 202 L134.5 206.6 L136.7 210.6 L138.8 213.9 L141 216.6 L143.2 218.5 L145.3 219.6 L147.5 220 L149.7 219.6 L151.8 218.5 L154 216.6 L156.2 213.9 L158.3 210.6 L160.5 206.6 L162.7 202 L164.8 196.8 L167 191.1 L169.2 185 L171.3 178.5 L173.5 171.6 L175.7 164.6 L177.8 157.3 L180 150 L182.2 142.7 L184.3 135.4 L186.5 128.4 L188.7 121.5 L190.8 115 L193 108.9 L195.2 103.2 L197.3 98 L199.5 93.4 L201.7 89.4 L203.8 86.1 L206 83.4 L208.2 81.5 L210.3 80.4 L212.5 80 L214.7 80.4 L216.8 81.5 L219 83.4 L221.2 86.1 L223.3 89.4 L225.5 93.4 L227.7 98 L229.8 103.2 L232 108.9 L234.2 115 L236.3 121.5 L238.5 128.4 L240.7 135.4 L242.8 142.7 L245 150 L247.2 157.3 L249.3 164.6 L251.5 171.6 L253.7 178.5 L255.8 185 L258 191.1 L260.2 196.8 L262.3 202 L264.5 206.6 L266.7 210.6 L268.8 213.9 L271 216.6 L273.2 218.5 L275.3 219.6 L277.5 220 L279.7 219.6 L281.8 218.5 L284 216.6 L286.2 213.9 L288.3 210.6 L290.5 206.6 L292.7 202 L294.8 196.8 L297 191.1 L299.2 185 L301.3 178.5 L303.5 171.6 L305.7 164.6 L307.8 157.3 L310 150" stroke="#2C4A40" stroke-width="2.6" fill="none" stroke-linejoin="round" stroke-linecap="round"/><g data-tip="الدورة الثانية تمر بنفس التغيرات التي مرت بها الدورة الأولى: تغير «دوري منتظم»."><line x1="50" y1="262" x2="176" y2="262" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><line x1="184" y1="262" x2="310" y2="262" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><text x="115" y="282" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">دورة</text><text x="245" y="282" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">نفس الدورة تتكرر</text><rect x="50" y="250" width="260" height="40" fill="transparent"/></g><text x="82.5" y="64" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="600" direction="rtl">اتجاه</text><text x="147.5" y="246" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="600" direction="rtl">الاتجاه المعاكس</text></svg>`,
   cap:'دورتان متطابقتان: في كل دورة يسير التيار في اتجاه ثم يعكس اتجاهه، وتتكرر الدورة بنفس التغيرات.<br><b>مرّر المؤشر على النصفين وعلى الأقواس تحت الدورتين (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'أي وصف ينطبق على التيار المتردد؟',opts:[
     ['تتغير قيمته مع الزمن واتجاهه ثابت دائماً',false,'لا يكفي تغير القيمة؛ المتردد يغير <b>اتجاهه</b> أيضاً.'],
     ['يغير اتجاهه مرة واحدة فقط عند تشغيل الدائرة',false,'التغير في المتردد دوري منتظم: يتكرر في كل دورة.'],
     ['تبقى قيمته واتجاهه ثابتين مع الزمن',false,'هذا وصف التيار المستمر.'],
     ['يتغير اتجاهه وقيمته بشكل دوري منتظم مع الزمن',true,'نص التعريف في ص 8: «يكون التيار (أو الجهد) متردداً إذا تغير اتجاهه وقيمته بشكل دوري منتظم مع الزمن t».']]}}
   ],
   body:[
    {book:String.raw`<p>يكون التيار (أو الجهد) <b>متردداً</b> إذا <b>تغير اتجاهه وقيمته بشكل دوري منتظم مع الزمن</b> \(t\)، بحيث يمر في كل دورة بنفس التغيرات التي مر بها في الدورة السابقة.</p>`,ref:'ص 8'},
    {tip:String.raw`<p>في التعريف شرطان معاً:</p><ul><li><b>يتغير اتجاهه وقيمته:</b> يسير التيار في الدائرة باتجاه، ثم يعكس اتجاهه، وقيمته تكبر وتصغر.</li><li><b>بشكل دوري منتظم:</b> كل دورة نسخة من التي قبلها، فإذا عرفت دورة واحدة عرفت الموجة كلها.</li></ul>`},
    {watch:String.raw`<p>تيار تتغير قيمته لكن لا يعكس اتجاهه أبداً <b>ليس</b> تياراً متردداً بهذا التعريف.</p>`}
   ]},

  {st:6,short:'توليد التيار المتردد',title:'<span class="ltr">1-1-2</span> كيفية توليد التيار المتردد',ref:'ص <span class=\"ltr\"><span class="ltr">8–9</span></span>',
   q:'ملف يدور بين قطبي مغناطيس… لماذا يخرج منه جهد يتغير اتجاهه بدلاً من جهد ثابت؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مولد بسيط: قطب شمالي في الأعلى وجنوبي في الأسفل وبينهما ملف يدور، والحروف A وB وC وD مواضع الموصل" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><circle cx="180" cy="150" r="128" fill="none" stroke="#7A8A84" stroke-width="8"/><g data-tip="القطب الشمالي ⟦N⟧ للمغناطيس."><path d="M118 30 H242 V64 Q180 78 118 64 Z" stroke="#2C4A40" stroke-width="2" fill="#F6C9B6" stroke-linejoin="round" stroke-linecap="round"/><text x="180" y="54" text-anchor="middle" font-size="18" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">N</text></g><g data-tip="القطب الجنوبي ⟦S⟧ للمغناطيس."><path d="M118 270 H242 V236 Q180 222 118 236 Z" stroke="#2C4A40" stroke-width="2" fill="#BFD6EA" stroke-linejoin="round" stroke-linecap="round"/><text x="180" y="258" text-anchor="middle" font-size="18" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">S</text></g><g data-tip="خطوط المجال المغناطيسي ⟦ϕ⟧: من القطب الشمالي إلى الجنوبي."><line x1="126" y1="82" x2="126" y2="212" stroke="#3E7CB1" stroke-width="1.4" stroke-linecap="round" stroke-dasharray="5 5"/><polygon points="126,220 122.4,212 129.6,212" fill="#3E7CB1"/><line x1="150" y1="82" x2="150" y2="212" stroke="#3E7CB1" stroke-width="1.4" stroke-linecap="round" stroke-dasharray="5 5"/><polygon points="150,220 146.4,212 153.6,212" fill="#3E7CB1"/><line x1="210" y1="82" x2="210" y2="212" stroke="#3E7CB1" stroke-width="1.4" stroke-linecap="round" stroke-dasharray="5 5"/><polygon points="210,220 206.4,212 213.6,212" fill="#3E7CB1"/><line x1="234" y1="82" x2="234" y2="212" stroke="#3E7CB1" stroke-width="1.4" stroke-linecap="round" stroke-dasharray="5 5"/><polygon points="234,220 230.4,212 237.6,212" fill="#3E7CB1"/><text x="222" y="206" text-anchor="middle" font-size="16" fill="#3E7CB1" font-weight="700" font-family="var(--mono)" direction="ltr">ϕ</text><rect x="118" y="80" width="130" height="140" fill="transparent"/></g><circle cx="180" cy="150" r="62" fill="none" stroke="#7A8A84" stroke-width="1.4" stroke-dasharray="3 4"/><g data-tip="الملف (المنظور من طرفه): موصلاه عند ⟦B⟧ و⟦D⟧. يدور بسرعة زاوية ⟦ω⟧ فيقطع خطوط المجال."><line x1="180" y1="88" x2="180" y2="212" stroke="#E8735A" stroke-width="5" stroke-linecap="round"/><circle cx="180" cy="88" r="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.2"/><circle cx="180" cy="212" r="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.2"/><circle cx="180" cy="88" r="3.2" fill="#2C4A40" stroke="#2C4A40" stroke-width="0"/><path d="M175 207 l10 10 M185 207 l-10 10" stroke="#2C4A40" stroke-width="2" fill="none" stroke-linejoin="round" stroke-linecap="round"/><path d="M202 136 A26 26 0 0 0 158 136" stroke="#2C4A40" stroke-width="1.6" fill="none" stroke-linejoin="round" stroke-linecap="round"/><line x1="166" y1="127" x2="160.7" y2="132.8" stroke="#2C4A40" stroke-width="1.6" stroke-linecap="round"/><polygon points="156,138 158.4,130.7 163,134.9" fill="#2C4A40"/><text x="196" y="152" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">ω</text><rect x="150" y="80" width="60" height="140" fill="transparent"/></g><g data-tip="الموضع ⟦A⟧: الموصل يتحرك موازياً لخطوط المجال، فالجهد صفر."><circle cx="264" cy="150" r="11" fill="#FBF6EE" stroke="#E8735A" stroke-width="2"/><text x="264" y="155" text-anchor="middle" font-size="13" fill="#E8735A" font-weight="700" font-family="var(--mono)" direction="ltr">A</text></g><g data-tip="الموضع ⟦B⟧: الموصل يقطع خطوط المجال عمودياً، فالتيار في قيمته العظمى."><circle cx="202" cy="75" r="11" fill="#FBF6EE" stroke="#E8735A" stroke-width="2"/><text x="202" y="80" text-anchor="middle" font-size="13" fill="#E8735A" font-weight="700" font-family="var(--mono)" direction="ltr">B</text></g><g data-tip="الموضع ⟦C⟧: الموصل موازٍ لخطوط المجال مرة أخرى، فالجهد صفر."><circle cx="96" cy="150" r="11" fill="#FBF6EE" stroke="#E8735A" stroke-width="2"/><text x="96" y="155" text-anchor="middle" font-size="13" fill="#E8735A" font-weight="700" font-family="var(--mono)" direction="ltr">C</text></g><g data-tip="الموضع ⟦D⟧: القيمة العظمى في الاتجاه المعاكس."><circle cx="202" cy="225" r="11" fill="#FBF6EE" stroke="#E8735A" stroke-width="2"/><text x="202" y="230" text-anchor="middle" font-size="13" fill="#E8735A" font-weight="700" font-family="var(--mono)" direction="ltr">D</text></g><text x="180" y="306" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700" direction="rtl">مولد تيار متردد بسيط</text></svg>`,
   cap:'رسم مبسط للشكل <span class="ltr">(1-1)</span>: الملف منظور من طرفه، والنقطة في الموصل العلوي تعني تياراً خارجاً من الصفحة، والعلامة × تعني تياراً داخلاً إليها.<br><b>مرّر المؤشر على القطبين وخطوط المجال والملف والحروف (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'في أي موضع من مواضع الموصل يكون الجهد المتولد <b>صفراً</b>؟',opts:[
     ['عند B و D',false,'عند B و D يقطع الموصل خطوط المجال عمودياً، فيكون التيار في قيمته العظمى.'],
     ['عند A و C',true,'الكتاب: «ويمر بالصفر في الشكلين (a) و(c)»، وعندهما يتحرك الموصل موازياً لخطوط المجال فلا يقطعها.'],
     ['عند B فقط',false,'عند B يمر التيار بقيمته العظمى.']]}}
   ],
   body:[
    {book:String.raw`<p>إذا وضع موصل كهربائي في مجال مغناطيسي متغير فإنه ينتج فيه <b>قوة دافعة كهربائية مستحثة</b> حسب قانون "فاراداي". والشكل <span class="ltr">1-1</span> يوضح مولد تيار متردد يحتوي على قطبين مغناطيسيين شمالي <span class="ltr">(N)</span> وجنوبي <span class="ltr">(S)</span> يدوران في اتجاه عقارب الساعة. المجال المغناطيسي الذي يقطع موصلات الملفين سيولد قوة دافعة كهربائية في هذه الموصلات. هذه القوة ستسبب مرور تيار إذا أغلقت دائرة الملفات عن طريق الحمل. ويكون اتجاه التيار متردداً ويمر بالصفر في الشكلين <span class="ltr">(a)</span> و<span class="ltr">(c)</span> كما يمر بقيمته العظمى في الشكل <span class="ltr">(b)</span> ويمر بقيمته العظمى في الاتجاه المعاكس في الشكل <span class="ltr">(d)</span>. والشكل <span class="ltr">1-2</span> يوضح بالرسم عملية توليد الموجة خلال الأربع مراحل السابقة.</p>`,ref:'ص 8'},
    {watch:String.raw`<p>النص يذكر أشكالاً <span class="ltr">(a)</span> و<span class="ltr">(b)</span> و<span class="ltr">(c)</span> و<span class="ltr">(d)</span>، بينما الشكل <span class="ltr">(1-1)</span> فيه الحروف A وB وC وD فقط؛ فهمناها <b>مواضع الموصل</b>: A وC الجهد صفر، وB أعلى قيمة، وD أعلى قيمة بالاتجاه المعاكس. والنص يقول إن <b>القطبين يدوران</b>، بينما الشكل <span class="ltr">(1-2)</span> يرسم <b>ملفاً يدور</b> بين قطبين ثابتين؛ والنتيجة واحدة لأن المهم هو الحركة النسبية بين الموصل والمجال.</p>`},
    {tip:String.raw`<p>الجهد يتولد عندما <b>يقطع</b> الموصل خطوط المجال. في الموضعين A وC يتحرك الموصل موازياً لخطوط المجال (لا يقطعها) فالجهد صفر، وفي B وD يتحرك عمودياً عليها (يقطع أكبر عدد منها) فالجهد أكبر ما يمكن. ولأن الموصل يقطع الخطوط مرة نازلاً ومرة صاعداً، ينعكس اتجاه الجهد كل نصف دورة.</p>`},
    {title:'المراحل الأربع لتوليد الموجة — الشكل <span class="ltr">(1-2)</span>',widget:(el,B)=>{
      const S=[[0,'لاحظ وضع الملف في هذا الموقع الجهد يساوي صفراً وبالتالي لا يوجد تيار كهربائي.','جهد صفر — الموقع الأول'],
       [90,'عند تحرك الملف 90 درجة الجهد وصل إلى أعلى قيمة إيجابية له.','أعلى جهد إيجابي — الموقع الثاني'],
       [180,'عندما يصل الملف إلى 180 درجة يهبط الجهد مجدداً إلى صفر.','الجهد ينزل إلى صفر — نصف دورة'],
       [270,'أما عندما يصل الملف إلى 270 درجة يصل الجهد إلى أعلى قيمة سالبة له.','أعلى جهد سلبي — ثلاثة أرباع الدورة أو 270 درجة'],
       [360,'أخيراً، عندما يكمل الملف دورة كاملة أي عند 360 درجة يهبط الجهد إلى صفر.','جهد صفر — دورة كاملة']];
      const D=Math.PI/180,f1=x=>x.toFixed(1);let k=0;
      const pic=a=>{const cx=62,cy=80,r=34,p1=[cx+r*Math.cos(a*D),cy-r*Math.sin(a*D)],p2=[cx-r*Math.cos(a*D),cy+r*Math.sin(a*D)];
        const X=d=>130+d*0.6,Y=v=>80-v*52;let w='',ar='';
        for(let d=0;d<=a;d+=4){w+=(d?'L':'M')+f1(X(d))+' '+f1(Y(Math.sin(d*D)))}
        if(a>0){w+='L'+f1(X(a))+' '+f1(Y(Math.sin(a*D)));ar=`<path d="${w}L${f1(X(a))} 80L130 80Z" fill="#F6C9B6"/><path d="${w}" fill="none" stroke="#E8735A" stroke-width="3" stroke-linejoin="round"/><circle cx="${f1(X(a))}" cy="${f1(Y(Math.sin(a*D)))}" r="5" fill="#E8735A"/>`}
        let g='';[0,90,180,270,360].forEach(d=>{g+=`<line x1="${X(d)}" y1="22" x2="${X(d)}" y2="138" stroke="#7A8A84" stroke-width="1" stroke-dasharray="3 3"/><text x="${X(d)}" y="154" text-anchor="middle" font-size="11" fill="#2C4A40" font-family="var(--mono)" direction="ltr">${d}°</text>`});
        return `<svg viewBox="0 0 360 160" role="img" aria-label="وضع الملف عند ${a} درجة والجزء المرسوم من الموجة" style="font-family:var(--font);width:100%;max-width:520px;display:block;margin-inline:auto" xmlns="http://www.w3.org/2000/svg">
         <rect x="26" y="8" width="72" height="18" rx="4" fill="#F6C9B6" stroke="#2C4A40" stroke-width="1.6"/><text x="62" y="22" text-anchor="middle" font-size="13" font-weight="700" fill="#2C4A40" font-family="var(--mono)" direction="ltr">N</text>
         <rect x="26" y="134" width="72" height="18" rx="4" fill="#BFD6EA" stroke="#2C4A40" stroke-width="1.6"/><text x="62" y="148" text-anchor="middle" font-size="13" font-weight="700" fill="#2C4A40" font-family="var(--mono)" direction="ltr">S</text>
         <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#7A8A84" stroke-dasharray="3 4"/>
         <line x1="${f1(p1[0])}" y1="${f1(p1[1])}" x2="${f1(p2[0])}" y2="${f1(p2[1])}" stroke="#E8735A" stroke-width="4" stroke-linecap="round"/>
         <circle cx="${f1(p1[0])}" cy="${f1(p1[1])}" r="7" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><circle cx="${f1(p2[0])}" cy="${f1(p2[1])}" r="7" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/>
         ${g}<line x1="130" y1="80" x2="350" y2="80" stroke="#2C4A40" stroke-width="1.4"/><line x1="130" y1="22" x2="130" y2="138" stroke="#2C4A40" stroke-width="1.4"/>${ar}</svg>`};
      const draw=()=>{const s=S[k];
        el.innerHTML=`<div class="w-row" style="margin-top:0"><span class="w-l">موضع الملف:</span><span class="mseg">${S.map((x,i)=>`<button type="button" data-i="${i}" aria-pressed="${i===k}">${x[0]}°</button>`).join('')}</span></div>
         <div style="margin-top:10px">${pic(s[0])}</div>
         <p style="margin:8px 0 0"><b>${k+1}.</b> ${s[1]} <b style="color:var(--live)">${s[2]}</b></p>`;
        el.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{k=+b.dataset.i;draw()})};
      draw();
    }}
   ]},

  {st:7,short:'الجيبي',title:'<span class="ltr">1-1-3</span> التيار المتردد الجيبي',ref:'ص 10',
   q:'من بين كل أشكال الموجات الممكنة، لماذا نهتم بالموجة الجيبية بالذات؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الجهد المتردد الجيبي: قمته Vm عند 90 درجة وقاعه عند 270 درجة، والسهم T طول الدورة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><line x1="44" y1="160" x2="334" y2="160" stroke="#7A8A84" stroke-width="1.4" stroke-linecap="round"/><polygon points="342,160 334,163.6 334,156.4" fill="#7A8A84"/><line x1="52" y1="280" x2="52" y2="48" stroke="#7A8A84" stroke-width="1.4" stroke-linecap="round"/><polygon points="52,40 55.6,48 48.4,48" fill="#7A8A84"/><text x="338" y="176" text-anchor="end" font-size="11" fill="#7A8A84" font-family="var(--mono)" direction="ltr">t</text><text x="58" y="50" text-anchor="start" font-size="11" fill="#7A8A84" font-family="var(--mono)" direction="ltr">V</text><text x="44" y="176" text-anchor="end" font-size="12" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">O</text><g data-tip="القيمة العظمى ⟦Vm⟧: أكبر قيمة يصلها الجهد."><line x1="52" y1="70" x2="322" y2="70" stroke="#E8735A" stroke-width="1.4" stroke-linecap="round" stroke-dasharray="5 4"/><text x="320" y="64" text-anchor="end" font-size="13" fill="#E8735A" font-weight="700" font-family="var(--mono)" direction="ltr">Vm</text><rect x="52" y="56" width="270" height="20" fill="transparent"/></g><path d="M52 160 L56.5 150.6 L61 141.3 L65.5 132.2 L70 123.4 L74.5 115 L79 107.1 L83.5 99.8 L88 93.1 L92.5 87.2 L97 82.1 L101.5 77.8 L106 74.4 L110.5 72 L115 70.5 L119.5 70 L124 70.5 L128.5 72 L133 74.4 L137.5 77.8 L142 82.1 L146.5 87.2 L151 93.1 L155.5 99.8 L160 107.1 L164.5 115 L169 123.4 L173.5 132.2 L178 141.3 L182.5 150.6 L187 160 L191.5 169.4 L196 178.7 L200.5 187.8 L205 196.6 L209.5 205 L214 212.9 L218.5 220.2 L223 226.9 L227.5 232.8 L232 237.9 L236.5 242.2 L241 245.6 L245.5 248 L250 249.5 L254.5 250 L259 249.5 L263.5 248 L268 245.6 L272.5 242.2 L277 237.9 L281.5 232.8 L286 226.9 L290.5 220.2 L295 212.9 L299.5 205 L304 196.6 L308.5 187.8 L313 178.7 L317.5 169.4 L322 160" stroke="#E8735A" stroke-width="3" fill="none" stroke-linejoin="round" stroke-linecap="round"/><line x1="119.5" y1="156" x2="119.5" y2="164" stroke="#2C4A40" stroke-width="1.4" stroke-linecap="round"/><text x="119.5" y="178" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-family="var(--mono)" direction="ltr">90°</text><line x1="187" y1="156" x2="187" y2="164" stroke="#2C4A40" stroke-width="1.4" stroke-linecap="round"/><text x="187" y="178" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-family="var(--mono)" direction="ltr">180°</text><line x1="254.5" y1="156" x2="254.5" y2="164" stroke="#2C4A40" stroke-width="1.4" stroke-linecap="round"/><text x="254.5" y="178" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-family="var(--mono)" direction="ltr">270°</text><line x1="322" y1="156" x2="322" y2="164" stroke="#2C4A40" stroke-width="1.4" stroke-linecap="round"/><text x="322" y="178" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-family="var(--mono)" direction="ltr">360°</text><g data-tip="الزمن الدوري ⟦T⟧: الزمن اللازم لإكمال دورة كاملة (من ⟦0°⟧ إلى ⟦360°⟧)."><line x1="187" y1="272" x2="62" y2="272" stroke="#2C4A40" stroke-width="1.6" stroke-linecap="round"/><polygon points="54,272 62,268.4 62,275.6" fill="#2C4A40"/><line x1="187" y1="272" x2="312" y2="272" stroke="#2C4A40" stroke-width="1.6" stroke-linecap="round"/><polygon points="320,272 312,275.6 312,268.4" fill="#2C4A40"/><text x="187" y="266" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T</text><rect x="52" y="256" width="270" height="24" fill="transparent"/></g></svg>`,
   cap:'رسم مبسط للشكل <span class="ltr">(1-3)</span>: الجهد المتردد الجيبي خلال دورة واحدة.<br><b>مرّر المؤشر على الخط المتقطع والسهم T (أو المسهما في الجوال) لتعرف معناهما.</b>',
   side:[
    {predict:{q:'عند أي زاوية يبلغ الجهد الجيبي في الشكل <span class="ltr">(1-3)</span> قيمته العظمى الموجبة <span class="ltr">V<sub>m</sub></span>؟',opts:[
     ['<span class="ltr">90°</span>',true,'القمة <span class="ltr">V<sub>m</sub></span> عند <span class="ltr">90°</span>، ثم يعبر الصفر عند <span class="ltr">180°</span> ويبلغ قاعه عند <span class="ltr">270°</span>.'],
     ['<span class="ltr">180°</span>',false,'عند <span class="ltr">180°</span> يعبر الجهد الصفر.'],
     ['<span class="ltr">360°</span>',false,'عند <span class="ltr">360°</span> يعود الجهد إلى الصفر وتكتمل الدورة.']]}}
   ],
   body:[
    {book:String.raw`<p>إذا كان تغير التيار (أو الجهد) مع الزمن على شكل <b>دالة جيبية</b> فنقول إن التيار (أو الجهد) <b>متردد جيبي</b>، وهذا الشكل هو الأكثر استعمالاً حيث إن المولدات المستعملة في الشبكات الكهربائية تنتج جهوداً قريبة جداً منه. ويمثل الشكل <span class="ltr">1-3</span> جهداً متردداً جيبياً.</p>`,ref:'ص 10'},
    {tip:String.raw`<p>«دالة جيبية» يعني أن قيمة الجهد تتبع الدالة <span class="ltr">sin</span> التي تعرفها من الآلة الحاسبة: <span class="ltr">sin 0° = 0</span>، و<span class="ltr">sin 90° = 1</span>، و<span class="ltr">sin 180° = 0</span>، و<span class="ltr">sin 270° = −1</span>. لذلك تأخذ الموجة قمتها عند <span class="ltr">90°</span> وقاعها عند <span class="ltr">270°</span>، كما في المولد الذي رأيته في المحطة السابقة.</p>`},
    {watch:String.raw`<p>في الكتاب طُبع رقم هذا الشكل «<span class="ltr">3-1</span>» تحت الرسم، والمقصود الشكل <span class="ltr">(1-3)</span> كما في النص.</p>`}
   ]},

  {st:8,short:'الدرجات والراديان',title:'حالة خاصة: التحويل بين الدرجات والراديان',ref:'ص 10',
   q:'الزاوية نفسها يمكن أن تُكتب بوحدتين. كيف تنتقل من إحداهما إلى الأخرى؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="دائرة عليها زاوية 30 درجة تساوي π على 6 راديان، ونصف الدائرة 180 درجة تساوي π" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><circle cx="180" cy="150" r="92" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.6"/><line x1="78" y1="150" x2="282" y2="150" stroke="#7A8A84" stroke-width="1.2" stroke-linecap="round"/><line x1="180" y1="48" x2="180" y2="252" stroke="#7A8A84" stroke-width="1.2" stroke-linecap="round"/><g data-tip="نصف الدورة: ⟦180°⟧ = ⟦π⟧ راديان."><path d="M272 150 A92 92 0 0 0 88 150" stroke="#4FB3A9" stroke-width="6" fill="none" stroke-linejoin="round" stroke-linecap="round"/><text x="84" y="170" text-anchor="middle" font-size="15" fill="#12855A" font-weight="700" font-family="var(--mono)" direction="ltr">π</text><text x="90" y="142" text-anchor="middle" font-size="12" fill="#12855A" font-weight="700" font-family="var(--mono)" direction="ltr">180°</text></g><g data-tip="زاوية ⟦30°⟧ وتساوي ⟦π/6⟧ راديان (مثال الكتاب)."><line x1="180" y1="150" x2="259.7" y2="104" stroke="#E8735A" stroke-width="3.4" stroke-linecap="round"/><path d="M218 150 A38 38 0 0 0 212.9 131" stroke="#E8735A" stroke-width="2.4" fill="none" stroke-linejoin="round" stroke-linecap="round"/><text x="236" y="138" text-anchor="middle" font-size="13" fill="#E8735A" font-weight="700" font-family="var(--mono)" direction="ltr">30°</text></g><text x="180" y="276" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">30° = π/6 rad</text></svg>`,
   cap:'زاوية <span class="ltr">30°</span> تساوي <span class="ltr">π/6</span> راديان، ونصف الدائرة <span class="ltr">180°</span> يساوي <span class="ltr">π</span> راديان.<br><b>مرّر المؤشر على الزاوية وعلى نصف الدائرة الأخضر (أو المسهما في الجوال) لتعرف معناهما.</b>',
   side:[
    {predict:{q:'حوّل الزاوية <span class="ltr">30°</span> إلى الراديان:',opts:[
     ['<span class="ltr">π/3 rad</span>',false,'<span class="ltr">π/3</span> تساوي <span class="ltr">60°</span>.'],
     ['<span class="ltr">30π rad</span>',false,'نسيت القسمة على <span class="ltr">180°</span>.'],
     ['<span class="ltr">π/6 rad</span>',true,String.raw`\(30^\circ\times\frac{\pi}{180^\circ}=\frac{\pi}{6}\ \text{rad}\)، وهو مثال الكتاب في ص 10.`]]}}
   ],
   body:[
    {book:String.raw`<p>للتحويل من التمثيل الزاوي إلى الدرجي أو العكس نستخدم العلاقة التالية:</p>
     <div class="eq">$$\text{Radians}=\frac{\pi}{180^\circ}\times\text{Degrees}$$<span class="eqno"></span></div>
     <div class="eq">$$\text{Degrees}=\frac{180^\circ}{\pi}\times\text{Radians}$$<span class="eqno"></span></div>
     <p><b>مثال:</b> حول القيمة التالية من <span class="ltr">Degrees</span> إلى <span class="ltr">Radians</span> \((30^\circ)\)؟</p>
     $$30^\circ\ \Rightarrow\ 30^\circ\times\frac{\pi}{180^\circ}=\frac{\pi}{6}\ \text{rad}$$`,ref:'ص 10'},
    {title:'حوّل بنفسك',widget:(el,B)=>{
      let d=30;const gcd=(a,b)=>b?gcd(b,a%b):a;
      const frac=d=>{if(d===0)return '0';const g=gcd(d,180),n=d/g,m=180/g;return (n===1?'':n)+'π'+(m===1?'':'/'+m)};
      el.innerHTML=`<label class="w-sl"><span>الزاوية بالدرجات: <b class="ltr" data-o="d"></b></span><input type="range" min="0" max="360" step="15" dir="ltr" value="${d}"></label>
       <div class="w-facts"><div><span>بالراديان (كسر من π)</span><b data-o="f"></b></div><div><span>بالراديان (رقم عشري)</span><b data-o="r"></b></div><div><span>جزء من الدورة</span><b data-o="c"></b></div><div><span>العودة إلى الدرجات</span><b data-o="b"></b></div></div>`;
      const o=k=>el.querySelector(`[data-o="${k}"]`),rg=el.querySelector('input');
      const draw=()=>{const r=d*Math.PI/180;o('d').textContent=d+'°';o('f').textContent=frac(d)+' rad';o('r').textContent=r.toFixed(3)+' rad';o('c').textContent=(d/360).toFixed(3).replace(/0+$/,'').replace(/\.$/,'');o('b').textContent=(r*180/Math.PI).toFixed(0)+'°'};
      rg.oninput=()=>{d=+rg.value;draw()};draw();
    }},
    {tip:String.raw`<p>احفظ هذه الأزواج: <span class="ltr">360° = 2π rad</span> (دورة كاملة)، <span class="ltr">180° = π rad</span>، <span class="ltr">90° = π/2 rad</span>. وفي الآلة الحاسبة انتبه لوضع الزاوية: <span class="ltr">DEG</span> للدرجات و<span class="ltr">RAD</span> للراديان؛ إذا كتبت <span class="ltr">sin(π/6)</span> والحاسبة على <span class="ltr">DEG</span> فالناتج خطأ.</p>`}
   ]},

  {st:9,short:'الموجة',title:'<span class="ltr">1-1-4</span> الموجة',ref:'ص 10',
   q:'حين نرسم الجهد على ورقة مع الزمن، ماذا نسمي هذا الرسم، وماذا نسمي جزأيه؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="موجة جيبية: النصف فوق المحور مظلل باللون البرتقالي والنصف تحته بالأخضر" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><line x1="42" y1="150" x2="318" y2="150" stroke="#7A8A84" stroke-width="1.4" stroke-linecap="round"/><polygon points="326,150 318,153.6 318,146.4" fill="#7A8A84"/><line x1="50" y1="260" x2="50" y2="48" stroke="#7A8A84" stroke-width="1.4" stroke-linecap="round"/><polygon points="50,40 53.6,48 46.4,48" fill="#7A8A84"/><text x="322" y="166" text-anchor="end" font-size="11" fill="#7A8A84" font-family="var(--mono)" direction="ltr">t</text><g data-tip="النصف الموجب: الجزء من الموجة فوق المحور الأفقي."><path d="M50 150 L54.3 140.6 L58.7 131.3 L63 122.2 L67.3 113.4 L71.7 105 L76 97.1 L80.3 89.8 L84.7 83.1 L89 77.2 L93.3 72.1 L97.7 67.8 L102 64.4 L106.3 62 L110.7 60.5 L115 60 L119.3 60.5 L123.7 62 L128 64.4 L132.3 67.8 L136.7 72.1 L141 77.2 L145.3 83.1 L149.7 89.8 L154 97.1 L158.3 105 L162.7 113.4 L167 122.2 L171.3 131.3 L175.7 140.6 L180 150 L180 150 L50 150 Z" stroke="#E8735A" stroke-width="2" fill="#F6C9B6" stroke-linejoin="round" stroke-linecap="round"/><rect x="50" y="60" width="130" height="90" fill="transparent"/></g><g data-tip="النصف السالب: الجزء من الموجة تحت المحور الأفقي."><path d="M180 150 L184.3 159.4 L188.7 168.7 L193 177.8 L197.3 186.6 L201.7 195 L206 202.9 L210.3 210.2 L214.7 216.9 L219 222.8 L223.3 227.9 L227.7 232.2 L232 235.6 L236.3 238 L240.7 239.5 L245 240 L249.3 239.5 L253.7 238 L258 235.6 L262.3 232.2 L266.7 227.9 L271 222.8 L275.3 216.9 L279.7 210.2 L284 202.9 L288.3 195 L292.7 186.6 L297 177.8 L301.3 168.7 L305.7 159.4 L310 150 L310 150 L180 150 Z" stroke="#4FB3A9" stroke-width="2" fill="#BFE3DE" stroke-linejoin="round" stroke-linecap="round"/><rect x="180" y="150" width="130" height="90" fill="transparent"/></g><path d="M50 150 L54.3 140.6 L58.7 131.3 L63 122.2 L67.3 113.4 L71.7 105 L76 97.1 L80.3 89.8 L84.7 83.1 L89 77.2 L93.3 72.1 L97.7 67.8 L102 64.4 L106.3 62 L110.7 60.5 L115 60 L119.3 60.5 L123.7 62 L128 64.4 L132.3 67.8 L136.7 72.1 L141 77.2 L145.3 83.1 L149.7 89.8 L154 97.1 L158.3 105 L162.7 113.4 L167 122.2 L171.3 131.3 L175.7 140.6 L180 150 L184.3 159.4 L188.7 168.7 L193 177.8 L197.3 186.6 L201.7 195 L206 202.9 L210.3 210.2 L214.7 216.9 L219 222.8 L223.3 227.9 L227.7 232.2 L232 235.6 L236.3 238 L240.7 239.5 L245 240 L249.3 239.5 L253.7 238 L258 235.6 L262.3 232.2 L266.7 227.9 L271 222.8 L275.3 216.9 L279.7 210.2 L284 202.9 L288.3 195 L292.7 186.6 L297 177.8 L301.3 168.7 L305.7 159.4 L310 150" stroke="#2C4A40" stroke-width="2.8" fill="none" stroke-linejoin="round" stroke-linecap="round"/><text x="115" y="120" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700" direction="rtl">النصف الموجب</text><text x="245" y="188" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700" direction="rtl">النصف السالب</text><text x="180" y="290" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700" direction="rtl">الموجة: مسار الجهد مع الزمن</text></svg>`,
   cap:'الموجة هي المسار الذي يرسمه الجهد مع الزمن، ولها نصف موجب فوق المحور ونصف سالب تحته.<br><b>مرّر المؤشر على النصفين الملونين (أو المسهما في الجوال) لتعرف اسم كل منهما.</b>',
   side:[
    {predict:{q:'ماذا نسمي جزء الموجة الذي يقع <b>تحت</b> المحور الأفقي؟',opts:[
     ['النصف الموجب',false,'النصف الموجب هو الذي فوق المحور الأفقي.'],
     ['الزمن الدوري',false,'الزمن الدوري زمن الدورة الكاملة (المحطة التالية)، وليس جزءاً من الموجة.'],
     ['النصف السالب',true,'نص الكتاب في ص 10: «ونسمي نصف الموجة فوق المحور الأفقي النصف الموجب، أما النصف الآخر فيسمى النصف السالب».']]}}
   ],
   body:[
    {book:String.raw`<p>هي <b>المسار الذي يرسمه الجهد (أو التيار) بدلالة الزمن</b> أو بدلالة كمية أخرى (كزاوية الطور كما سنرى فيما بعد). ونسمي نصف الموجة فوق المحور الأفقي <b>النصف الموجب</b>، أما النصف الآخر فيسمى <b>النصف السالب</b>.</p>`,ref:'ص 10'},
    {tip:String.raw`<p>المحور الأفقي في رسم الموجة يمكن أن يكون الزمن \(t\) (بالثواني) أو الزاوية (بالدرجات أو الراديان)؛ والشكل نفسه لا يتغير. في النصف الموجب يسير التيار في اتجاه، وفي النصف السالب يسير في الاتجاه المعاكس.</p>`}
   ]},

  {st:10,short:'التردد والزمن الدوري',title:'<span class="ltr">1-1-5</span> التردد <span class="ltr">(f)</span> والزمن الدوري <span class="ltr">(T)</span>',ref:'ص 11',
   q:'إذا أصبحت الدورة الواحدة أقصر، فهل يزيد عدد الدورات في الثانية أم يقل؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ثلاث دورات، تحت كل دورة سهم T، وتحتها العلاقة f = 1/T" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DCEAF5"/><line x1="34" y1="140" x2="328" y2="140" stroke="#7A8A84" stroke-width="1.4" stroke-linecap="round"/><polygon points="336,140 328,143.6 328,136.4" fill="#7A8A84"/><line x1="40" y1="230" x2="40" y2="58" stroke="#7A8A84" stroke-width="1.4" stroke-linecap="round"/><polygon points="40,50 43.6,58 36.4,58" fill="#7A8A84"/><text x="332" y="156" text-anchor="end" font-size="11" fill="#7A8A84" font-family="var(--mono)" direction="ltr">t</text><path d="M40 140 L41.6 133.5 L43.1 127.1 L44.7 120.8 L46.2 114.8 L47.8 109 L49.3 103.6 L50.9 98.5 L52.4 93.9 L54 89.8 L55.6 86.3 L57.1 83.4 L58.7 81 L60.2 79.4 L61.8 78.3 L63.3 78 L64.9 78.3 L66.4 79.4 L68 81 L69.6 83.4 L71.1 86.3 L72.7 89.8 L74.2 93.9 L75.8 98.5 L77.3 103.6 L78.9 109 L80.4 114.8 L82 120.8 L83.6 127.1 L85.1 133.5 L86.7 140 L88.2 146.5 L89.8 152.9 L91.3 159.2 L92.9 165.2 L94.4 171 L96 176.4 L97.6 181.5 L99.1 186.1 L100.7 190.2 L102.2 193.7 L103.8 196.6 L105.3 199 L106.9 200.6 L108.4 201.7 L110 202 L111.6 201.7 L113.1 200.6 L114.7 199 L116.2 196.6 L117.8 193.7 L119.3 190.2 L120.9 186.1 L122.4 181.5 L124 176.4 L125.6 171 L127.1 165.2 L128.7 159.2 L130.2 152.9 L131.8 146.5 L133.3 140 L134.9 133.5 L136.4 127.1 L138 120.8 L139.6 114.8 L141.1 109 L142.7 103.6 L144.2 98.5 L145.8 93.9 L147.3 89.8 L148.9 86.3 L150.4 83.4 L152 81 L153.6 79.4 L155.1 78.3 L156.7 78 L158.2 78.3 L159.8 79.4 L161.3 81 L162.9 83.4 L164.4 86.3 L166 89.8 L167.6 93.9 L169.1 98.5 L170.7 103.6 L172.2 109 L173.8 114.8 L175.3 120.8 L176.9 127.1 L178.4 133.5 L180 140 L181.6 146.5 L183.1 152.9 L184.7 159.2 L186.2 165.2 L187.8 171 L189.3 176.4 L190.9 181.5 L192.4 186.1 L194 190.2 L195.6 193.7 L197.1 196.6 L198.7 199 L200.2 200.6 L201.8 201.7 L203.3 202 L204.9 201.7 L206.4 200.6 L208 199 L209.6 196.6 L211.1 193.7 L212.7 190.2 L214.2 186.1 L215.8 181.5 L217.3 176.4 L218.9 171 L220.4 165.2 L222 159.2 L223.6 152.9 L225.1 146.5 L226.7 140 L228.2 133.5 L229.8 127.1 L231.3 120.8 L232.9 114.8 L234.4 109 L236 103.6 L237.6 98.5 L239.1 93.9 L240.7 89.8 L242.2 86.3 L243.8 83.4 L245.3 81 L246.9 79.4 L248.4 78.3 L250 78 L251.6 78.3 L253.1 79.4 L254.7 81 L256.2 83.4 L257.8 86.3 L259.3 89.8 L260.9 93.9 L262.4 98.5 L264 103.6 L265.6 109 L267.1 114.8 L268.7 120.8 L270.2 127.1 L271.8 133.5 L273.3 140 L274.9 146.5 L276.4 152.9 L278 159.2 L279.6 165.2 L281.1 171 L282.7 176.4 L284.2 181.5 L285.8 186.1 L287.3 190.2 L288.9 193.7 L290.4 196.6 L292 199 L293.6 200.6 L295.1 201.7 L296.7 202 L298.2 201.7 L299.8 200.6 L301.3 199 L302.9 196.6 L304.4 193.7 L306 190.2 L307.6 186.1 L309.1 181.5 L310.7 176.4 L312.2 171 L313.8 165.2 L315.3 159.2 L316.9 152.9 L318.4 146.5 L320 140" stroke="#E8735A" stroke-width="2.8" fill="none" stroke-linejoin="round" stroke-linecap="round"/><g data-tip="⟦T⟧: زمن دورة واحدة كاملة (الزمن الدوري)."><line x1="86.7" y1="222" x2="49" y2="222" stroke="#2C4A40" stroke-width="1.4" stroke-linecap="round"/><polygon points="42,222 49,218.8 49,225.2" fill="#2C4A40"/><line x1="86.7" y1="222" x2="124.3" y2="222" stroke="#2C4A40" stroke-width="1.4" stroke-linecap="round"/><polygon points="131.3,222 124.3,225.2 124.3,218.8" fill="#2C4A40"/><text x="86.7" y="216" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T</text><rect x="40" y="206" width="93.3" height="22" fill="transparent"/></g><g data-tip="⟦T⟧: زمن دورة واحدة كاملة (الزمن الدوري)."><line x1="180" y1="222" x2="142.3" y2="222" stroke="#2C4A40" stroke-width="1.4" stroke-linecap="round"/><polygon points="135.3,222 142.3,218.8 142.3,225.2" fill="#2C4A40"/><line x1="180" y1="222" x2="217.7" y2="222" stroke="#2C4A40" stroke-width="1.4" stroke-linecap="round"/><polygon points="224.7,222 217.7,225.2 217.7,218.8" fill="#2C4A40"/><text x="180" y="216" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T</text><rect x="133.3" y="206" width="93.3" height="22" fill="transparent"/></g><g data-tip="⟦T⟧: زمن دورة واحدة كاملة (الزمن الدوري)."><line x1="273.3" y1="222" x2="235.7" y2="222" stroke="#2C4A40" stroke-width="1.4" stroke-linecap="round"/><polygon points="228.7,222 235.7,218.8 235.7,225.2" fill="#2C4A40"/><line x1="273.3" y1="222" x2="311" y2="222" stroke="#2C4A40" stroke-width="1.4" stroke-linecap="round"/><polygon points="318,222 311,225.2 311,218.8" fill="#2C4A40"/><text x="273.3" y="216" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T</text><rect x="226.7" y="206" width="93.3" height="22" fill="transparent"/></g><g data-tip="التردد ⟦f⟧: عدد الدورات في الثانية، ووحدته الهرتز ⟦Hz⟧."><rect x="70" y="248" width="220" height="44" rx="12" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="180" y="276" text-anchor="middle" font-size="17" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">f = 1/T</text></g></svg>`,
   cap:'تحت كل دورة سهم طوله الزمن الدوري T، وعدد الدورات في الثانية هو التردد f.<br><b>مرّر المؤشر على أسهم T وعلى العلاقة في الأسفل (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'إذا قلّ الزمن الدوري لموجة إلى النصف، فماذا يحدث لترددها؟',opts:[
     ['يقل إلى النصف',false,'العلاقة عكسية لا طردية.'],
     ['يبقى كما هو',false,String.raw`التردد يتغير مع الزمن الدوري لأن \(f=1/T\).`],
     ['يتضاعف',true,'العلاقة عكسية: «كلما قصر زمن الدورة ازداد التردد بنفس النسبة»، فنصف الزمن يعطي ضعف التردد.']]}}
   ],
   body:[
    {book:String.raw`<p><b>التردد <span class="ltr">(f)</span></b> هو عدد الدورات التي ترسمها الموجة في زمن معين، ووحدته <b>الهرتز</b> <span class="ltr">Hertz</span> ورمزه <span class="ltr">Hz</span> وهو يمثل عدد الدورات في الثانية. والزمن اللازم لإكمال موجة كاملة يسمى <b>الزمن الدوري</b> أو زمن الدورة \((T)\) وبما أنه كلما قصر زمن الدورة ازداد التردد بنفس النسبة أي أن العلاقة بين الزمن الدوري والتردد علاقة عكسية، نستخلص أن</p>
     <div class="eq">$$T=\frac{1}{f}$$<span class="eqno"><span class="ltr">(1-1)</span></span></div>`,ref:'ص 11'},
    {tip:String.raw`<p>إذا عرفت عدد الدورات \(N\) التي تكملها الموجة في زمن \(t\) فإن زمن الدورة الواحدة \(T=t/N\)، والتردد \(f=N/t\). وستحتاج هذا في مثال <span class="ltr">1-1-2</span> وفي مسائل الفصل.</p>`,title:'من عدد الدورات إلى T و f'},
    {tip:String.raw`<p>البادئات التي ستقابلها: <span class="ltr">ms</span> ملّي \(=10^{-3}\)، <span class="ltr">µs</span> ميكرو \(=10^{-6}\)، <span class="ltr">kHz</span> كيلو \(=10^{3}\)، <span class="ltr">MHz</span> ميغا \(=10^{6}\).</p>`,title:'البادئات'}
   ]},

  {st:11,short:'مثال <span class="ltr">1-1-1</span>',title:'مثال <span class="ltr">1-1-1</span>: زمن دورة الشبكة',ref:'ص 11',
   q:'ما زمن الدورة الواحدة لجهد الشبكة الكهربائية في المملكة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="دورة واحدة لموجة 50 هرتز طولها 20 ملي ثانية، ودورة لموجة 60 هرتز أقصر طولها 16.67 ملي ثانية" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="تردد ⟦50 Hz⟧: زمن الدورة ⟦20 ms⟧."><line x1="50" y1="90" x2="300" y2="90" stroke="#7A8A84" stroke-width="1.2" stroke-linecap="round"/><path d="M50 90 L54 85.8 L58 81.7 L62 77.6 L66 73.7 L70 70 L74 66.5 L78 63.2 L82 60.3 L86 57.6 L90 55.4 L94 53.5 L98 52 L102 50.9 L106 50.2 L110 50 L114 50.2 L118 50.9 L122 52 L126 53.5 L130 55.4 L134 57.6 L138 60.3 L142 63.2 L146 66.5 L150 70 L154 73.7 L158 77.6 L162 81.7 L166 85.8 L170 90 L174 94.2 L178 98.3 L182 102.4 L186 106.3 L190 110 L194 113.5 L198 116.8 L202 119.7 L206 122.4 L210 124.6 L214 126.5 L218 128 L222 129.1 L226 129.8 L230 130 L234 129.8 L238 129.1 L242 128 L246 126.5 L250 124.6 L254 122.4 L258 119.7 L262 116.8 L266 113.5 L270 110 L274 106.3 L278 102.4 L282 98.3 L286 94.2 L290 90" stroke="#4FB3A9" stroke-width="3" fill="none" stroke-linejoin="round" stroke-linecap="round"/><line x1="170" y1="146" x2="59" y2="146" stroke="#2C4A40" stroke-width="1.4" stroke-linecap="round"/><polygon points="52,146 59,142.8 59,149.2" fill="#2C4A40"/><line x1="170" y1="146" x2="281" y2="146" stroke="#2C4A40" stroke-width="1.4" stroke-linecap="round"/><polygon points="288,146 281,149.2 281,142.8" fill="#2C4A40"/><text x="170" y="140" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">20 ms</text><rect x="232" y="26" width="72" height="26" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.6"/><text x="268" y="44" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">50 Hz</text><rect x="44" y="24" width="264" height="128" fill="transparent"/></g><g data-tip="تردد ⟦60 Hz⟧: زمن الدورة ⟦16.67 ms⟧. وهو التردد المستعمل في المملكة العربية السعودية."><line x1="50" y1="200" x2="300" y2="200" stroke="#7A8A84" stroke-width="1.2" stroke-linecap="round"/><path d="M50 200 L53.3 195.8 L56.7 191.7 L60 187.6 L63.3 183.7 L66.7 180 L70 176.5 L73.3 173.2 L76.7 170.3 L80 167.6 L83.3 165.4 L86.7 163.5 L90 162 L93.3 160.9 L96.7 160.2 L100 160 L103.3 160.2 L106.7 160.9 L110 162 L113.3 163.5 L116.7 165.4 L120 167.6 L123.3 170.3 L126.7 173.2 L130 176.5 L133.3 180 L136.7 183.7 L140 187.6 L143.3 191.7 L146.7 195.8 L150 200 L153.3 204.2 L156.7 208.3 L160 212.4 L163.3 216.3 L166.7 220 L170 223.5 L173.3 226.8 L176.7 229.7 L180 232.4 L183.3 234.6 L186.7 236.5 L190 238 L193.3 239.1 L196.7 239.8 L200 240 L203.3 239.8 L206.7 239.1 L210 238 L213.3 236.5 L216.7 234.6 L220 232.4 L223.3 229.7 L226.7 226.8 L230 223.5 L233.3 220 L236.7 216.3 L240 212.4 L243.3 208.3 L246.7 204.2 L250 200" stroke="#E8735A" stroke-width="3" fill="none" stroke-linejoin="round" stroke-linecap="round"/><line x1="150" y1="256" x2="59" y2="256" stroke="#2C4A40" stroke-width="1.4" stroke-linecap="round"/><polygon points="52,256 59,252.8 59,259.1" fill="#2C4A40"/><line x1="150" y1="256" x2="241" y2="256" stroke="#2C4A40" stroke-width="1.4" stroke-linecap="round"/><polygon points="248,256 241,259.1 241,252.8" fill="#2C4A40"/><text x="150" y="250" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">16.67 ms</text><rect x="232" y="136" width="72" height="26" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.6"/><text x="268" y="154" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">60 Hz</text><rect x="44" y="134" width="264" height="128" fill="transparent"/></g></svg>`,
   cap:'دورة <span class="ltr">60 Hz</span> أقصر من دورة <span class="ltr">50 Hz</span> لأن التردد أكبر.<br><b>مرّر المؤشر على كل موجة (أو المسها في الجوال) لتعرف زمن دورتها.</b>',
   side:[
    {predict:{q:'أي الترددين دورته أقصر: <span class="ltr">50 Hz</span> أم <span class="ltr">60 Hz</span>؟',opts:[
     ['<span class="ltr">50 Hz</span>',false,'دورة <span class="ltr">50 Hz</span> زمنها <span class="ltr">20 ms</span>، وهي الأطول.'],
     ['<span class="ltr">60 Hz</span>',true,'التردد الأكبر دورته أقصر: <span class="ltr">16.67 ms</span> مقابل <span class="ltr">20 ms</span>.'],
     ['زمنا الدورتين متساويان',false,String.raw`الزمن الدوري يتغير مع التردد لأن \(T=1/f\).`]]}}
   ],
   body:[
    {book:String.raw`<p><b>مثال <span class="ltr">1-1-1</span>:</b> احسب زمن دورة موجة مترددة ترددها يساوي: أ- <span class="ltr">50 Hz</span> ب- <span class="ltr">60 Hz</span></p>
     <p><b>الحل:</b></p>
     <p>أ- \(T=\frac{1}{f}=\frac{1}{50}=0.02\ \text{s}=20\ \text{ms}\)</p>
     <p>ب- \(T=\frac{1}{f}=\frac{1}{60}=0.01667\ \text{s}=16.67\ \text{ms}\)</p>
     <p>وهذان الترددان هما المستعملان في الشبكات الكهربائية عبر العالم (في المملكة العربية السعودية تستعمل <span class="ltr">60 Hz</span>).</p>`,ref:'ص 11'},
    {title:'احسب الزمن الدوري',widget:(el,B)=>{
      let f=60;
      const draw=()=>{const T=1/f;
        el.innerHTML=`<div class="w-row" style="margin-top:0"><span class="w-l">التردد:</span><span class="mseg">${[50,60].map(v=>`<button type="button" data-f="${v}" aria-pressed="${v===f}">${v} Hz</button>`).join('')}</span></div>
         <div class="eq">${B.tex(`T=\\frac{1}{f}=\\frac{1}{${f}}=${f===50?'0.02':'0.01667'}\\ \\text{s}=${f===50?'20':'16.67'}\\ \\text{ms}`,true)}<span class="eqno"><span class="ltr">(1-1)</span></span></div>
         <p class="sub" style="margin:4px 0 0">أي أن الموجة تكمل <span class="ltr">${f}</span> دورة في الثانية الواحدة، وكل دورة تستغرق <span class="ltr">${f===50?'20':'16.67'} ms</span>.</p>`;
        el.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{f=+b.dataset.f;draw()})};
      draw();
    }},
    {add:String.raw`<p>الشبكة الكهربائية في المملكة ترددها <span class="ltr">60 Hz</span> (كما ذكر الكتاب)، لذلك تجد على لوحة بيانات المحركات والأجهزة هنا عبارة <span class="ltr">60 Hz</span>. والجهاز المصنوع لشبكة <span class="ltr">50 Hz</span> قد لا يعمل بالأداء نفسه على شبكة <span class="ltr">60 Hz</span>.</p>`}
   ]},

  {st:12,short:'مثال <span class="ltr">1-1-2</span>',title:'مثال <span class="ltr">1-1-2</span>: الزمن الدوري والتردد من الرسم',ref:'ص <span class=\"ltr\"><span class="ltr">11–12</span></span>',
   q:'رسم موجة عليه عدد الدورات والزمن فقط… كيف تستخرج منه T و f؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="موجة تكمل خمس دورات خلال 4 ميكروثانية" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><line x1="38" y1="150" x2="318" y2="150" stroke="#7A8A84" stroke-width="1.4" stroke-linecap="round"/><polygon points="326,150 318,153.6 318,146.4" fill="#7A8A84"/><line x1="44" y1="250" x2="44" y2="68" stroke="#7A8A84" stroke-width="1.4" stroke-linecap="round"/><polygon points="44,60 47.6,68 40.4,68" fill="#7A8A84"/><text x="322" y="166" text-anchor="end" font-size="11" fill="#7A8A84" font-family="var(--mono)" direction="ltr">t (µs)</text><text x="50" y="70" text-anchor="start" font-size="11" fill="#7A8A84" font-family="var(--mono)" direction="ltr">V</text><path d="M44 150 L44.9 143.9 L45.7 137.9 L46.6 132.1 L47.5 126.4 L48.3 121 L49.2 115.9 L50.1 111.2 L50.9 106.9 L51.8 103.1 L52.7 99.8 L53.5 97 L54.4 94.8 L55.3 93.3 L56.1 92.3 L57 92 L57.9 92.3 L58.7 93.3 L59.6 94.8 L60.5 97 L61.3 99.8 L62.2 103.1 L63.1 106.9 L63.9 111.2 L64.8 115.9 L65.7 121 L66.5 126.4 L67.4 132.1 L68.3 137.9 L69.1 143.9 L70 150 L70.9 156.1 L71.7 162.1 L72.6 167.9 L73.5 173.6 L74.3 179 L75.2 184.1 L76.1 188.8 L76.9 193.1 L77.8 196.9 L78.7 200.2 L79.5 203 L80.4 205.2 L81.3 206.7 L82.1 207.7 L83 208 L83.9 207.7 L84.7 206.7 L85.6 205.2 L86.5 203 L87.3 200.2 L88.2 196.9 L89.1 193.1 L89.9 188.8 L90.8 184.1 L91.7 179 L92.5 173.6 L93.4 167.9 L94.3 162.1 L95.1 156.1 L96 150 L96.9 143.9 L97.7 137.9 L98.6 132.1 L99.5 126.4 L100.3 121 L101.2 115.9 L102.1 111.2 L102.9 106.9 L103.8 103.1 L104.7 99.8 L105.5 97 L106.4 94.8 L107.3 93.3 L108.1 92.3 L109 92 L109.9 92.3 L110.7 93.3 L111.6 94.8 L112.5 97 L113.3 99.8 L114.2 103.1 L115.1 106.9 L115.9 111.2 L116.8 115.9 L117.7 121 L118.5 126.4 L119.4 132.1 L120.3 137.9 L121.1 143.9 L122 150 L122.9 156.1 L123.7 162.1 L124.6 167.9 L125.5 173.6 L126.3 179 L127.2 184.1 L128.1 188.8 L128.9 193.1 L129.8 196.9 L130.7 200.2 L131.5 203 L132.4 205.2 L133.3 206.7 L134.1 207.7 L135 208 L135.9 207.7 L136.7 206.7 L137.6 205.2 L138.5 203 L139.3 200.2 L140.2 196.9 L141.1 193.1 L141.9 188.8 L142.8 184.1 L143.7 179 L144.5 173.6 L145.4 167.9 L146.3 162.1 L147.1 156.1 L148 150 L148.9 143.9 L149.7 137.9 L150.6 132.1 L151.5 126.4 L152.3 121 L153.2 115.9 L154.1 111.2 L154.9 106.9 L155.8 103.1 L156.7 99.8 L157.5 97 L158.4 94.8 L159.3 93.3 L160.1 92.3 L161 92 L161.9 92.3 L162.7 93.3 L163.6 94.8 L164.5 97 L165.3 99.8 L166.2 103.1 L167.1 106.9 L167.9 111.2 L168.8 115.9 L169.7 121 L170.5 126.4 L171.4 132.1 L172.3 137.9 L173.1 143.9 L174 150 L174.9 156.1 L175.7 162.1 L176.6 167.9 L177.5 173.6 L178.3 179 L179.2 184.1 L180.1 188.8 L180.9 193.1 L181.8 196.9 L182.7 200.2 L183.5 203 L184.4 205.2 L185.3 206.7 L186.1 207.7 L187 208 L187.9 207.7 L188.7 206.7 L189.6 205.2 L190.5 203 L191.3 200.2 L192.2 196.9 L193.1 193.1 L193.9 188.8 L194.8 184.1 L195.7 179 L196.5 173.6 L197.4 167.9 L198.3 162.1 L199.1 156.1 L200 150 L200.9 143.9 L201.7 137.9 L202.6 132.1 L203.5 126.4 L204.3 121 L205.2 115.9 L206.1 111.2 L206.9 106.9 L207.8 103.1 L208.7 99.8 L209.5 97 L210.4 94.8 L211.3 93.3 L212.1 92.3 L213 92 L213.9 92.3 L214.7 93.3 L215.6 94.8 L216.5 97 L217.3 99.8 L218.2 103.1 L219.1 106.9 L219.9 111.2 L220.8 115.9 L221.7 121 L222.5 126.4 L223.4 132.1 L224.3 137.9 L225.1 143.9 L226 150 L226.9 156.1 L227.7 162.1 L228.6 167.9 L229.5 173.6 L230.3 179 L231.2 184.1 L232.1 188.8 L232.9 193.1 L233.8 196.9 L234.7 200.2 L235.5 203 L236.4 205.2 L237.3 206.7 L238.1 207.7 L239 208 L239.9 207.7 L240.7 206.7 L241.6 205.2 L242.5 203 L243.3 200.2 L244.2 196.9 L245.1 193.1 L245.9 188.8 L246.8 184.1 L247.7 179 L248.5 173.6 L249.4 167.9 L250.3 162.1 L251.1 156.1 L252 150 L252.9 143.9 L253.7 137.9 L254.6 132.1 L255.5 126.4 L256.3 121 L257.2 115.9 L258.1 111.2 L258.9 106.9 L259.8 103.1 L260.7 99.8 L261.5 97 L262.4 94.8 L263.3 93.3 L264.1 92.3 L265 92 L265.9 92.3 L266.7 93.3 L267.6 94.8 L268.5 97 L269.3 99.8 L270.2 103.1 L271.1 106.9 L271.9 111.2 L272.8 115.9 L273.7 121 L274.5 126.4 L275.4 132.1 L276.3 137.9 L277.1 143.9 L278 150 L278.9 156.1 L279.7 162.1 L280.6 167.9 L281.5 173.6 L282.3 179 L283.2 184.1 L284.1 188.8 L284.9 193.1 L285.8 196.9 L286.7 200.2 L287.5 203 L288.4 205.2 L289.3 206.7 L290.1 207.7 L291 208 L291.9 207.7 L292.7 206.7 L293.6 205.2 L294.5 203 L295.3 200.2 L296.2 196.9 L297.1 193.1 L297.9 188.8 L298.8 184.1 L299.7 179 L300.5 173.6 L301.4 167.9 L302.3 162.1 L303.1 156.1 L304 150" stroke="#E8735A" stroke-width="2.4" fill="none" stroke-linejoin="round" stroke-linecap="round"/><line x1="44" y1="146" x2="44" y2="154" stroke="#2C4A40" stroke-width="1.4" stroke-linecap="round"/><text x="44" y="230" text-anchor="middle" font-size="12" fill="#2C4A40" font-family="var(--mono)" direction="ltr">0</text><line x1="44" y1="208" x2="44" y2="214" stroke="#7A8A84" stroke-width="1" stroke-linecap="round"/><line x1="109" y1="146" x2="109" y2="154" stroke="#2C4A40" stroke-width="1.4" stroke-linecap="round"/><text x="109" y="230" text-anchor="middle" font-size="12" fill="#2C4A40" font-family="var(--mono)" direction="ltr">1</text><line x1="109" y1="208" x2="109" y2="214" stroke="#7A8A84" stroke-width="1" stroke-linecap="round"/><line x1="174" y1="146" x2="174" y2="154" stroke="#2C4A40" stroke-width="1.4" stroke-linecap="round"/><text x="174" y="230" text-anchor="middle" font-size="12" fill="#2C4A40" font-family="var(--mono)" direction="ltr">2</text><line x1="174" y1="208" x2="174" y2="214" stroke="#7A8A84" stroke-width="1" stroke-linecap="round"/><line x1="239" y1="146" x2="239" y2="154" stroke="#2C4A40" stroke-width="1.4" stroke-linecap="round"/><text x="239" y="230" text-anchor="middle" font-size="12" fill="#2C4A40" font-family="var(--mono)" direction="ltr">3</text><line x1="239" y1="208" x2="239" y2="214" stroke="#7A8A84" stroke-width="1" stroke-linecap="round"/><line x1="304" y1="146" x2="304" y2="154" stroke="#2C4A40" stroke-width="1.4" stroke-linecap="round"/><text x="304" y="230" text-anchor="middle" font-size="12" fill="#2C4A40" font-family="var(--mono)" direction="ltr">4</text><line x1="304" y1="208" x2="304" y2="214" stroke="#7A8A84" stroke-width="1" stroke-linecap="round"/><g data-tip="الموجة تكمل ⟦5⟧ دورات من ⟦0⟧ إلى ⟦4 µs⟧."><line x1="174" y1="74" x2="54" y2="74" stroke="#2C4A40" stroke-width="1.5" stroke-linecap="round"/><polygon points="46,74 54,70.4 54,77.6" fill="#2C4A40"/><line x1="174" y1="74" x2="294" y2="74" stroke="#2C4A40" stroke-width="1.5" stroke-linecap="round"/><polygon points="302,74 294,77.6 294,70.4" fill="#2C4A40"/><text x="174" y="66" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">5 دورات</text><rect x="44" y="54" width="260" height="26" fill="transparent"/></g><text x="180" y="282" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" font-family="var(--mono)" direction="ltr">T = 4 µs / 5</text></svg>`,
   cap:'رسم مبسط للشكل <span class="ltr">(1-4)</span>: خمس دورات بين <span class="ltr">0</span> و<span class="ltr">4 µs</span>.<br><b>مرّر المؤشر على السهم العلوي (أو المسه في الجوال) لتعرف معناه.</b>',
   side:[
    {predict:{q:'موجة تكمل <span class="ltr">5</span> دورات في <span class="ltr">4 µs</span>. كم زمن الدورة الواحدة؟',opts:[
     ['<span class="ltr">1.25 µs</span>',false,'هذا ناتج <span class="ltr">5 ÷ 4</span>؛ والمطلوب الزمن ÷ عدد الدورات.'],
     ['<span class="ltr">20 µs</span>',false,'هذا حاصل الضرب <span class="ltr">5 × 4</span>.'],
     ['<span class="ltr">0.8 µs</span>',true,String.raw`\(T=\frac{1}{5}\times4\times10^{-6}=0.8\ \mu s\)، كما في حل الكتاب.`]]}}
   ],
   body:[
    {book:String.raw`<p><b>مثال <span class="ltr">1-1-2</span>:</b> حدد الزمن الدوري والتردد للموجة الموضحة في الشكل <span class="ltr">(1-4)</span>.</p>
     <p><b>الحل:</b></p>
     $$T=\frac{1}{5}\times4\times10^{-6}=0.8\ \mu s$$
     $$f=\frac{1}{T}=\frac{1}{0.8\times10^{-6}}=1.2\times10^{6}=1.2\ \text{MHz}$$`,ref:'ص <span class=\"ltr\"><span class="ltr">11–12</span></span>'},
    {watch:String.raw`<p>ناتج التردد في الكتاب <b>خطأ في القسمة</b>: \(1\div0.8=1.25\) وليس <span class="ltr">1.2</span>، فالتردد الصحيح \(f=1.25\times10^{6}\ \text{Hz}=1.25\ \text{MHz}\). وكُتب تحت سؤال المثال في الكتاب «أ- <span class="ltr">50 Hz</span> ب- <span class="ltr">60 Hz</span>» منقولاً من المثال السابق ولا علاقة له بالسؤال، وعنوان المحور الأفقي في الشكل «<span class="ltr">T(µs)</span>» والمقصود الزمن \(t\).</p>`},
    {title:'ناتج التردد: كما في الكتاب / المصحح',widget:(el,B)=>{
      let v='book';
      const draw=()=>{el.innerHTML=`<div class="w-row" style="margin-top:0"><span class="mseg">${[['book','كما في الكتاب'],['fixed','المصحح']].map(([k,l])=>`<button type="button" data-v="${k}" aria-pressed="${k===v}" style="font-family:var(--font)">${l}</button>`).join('')}</span></div>
        <div class="eq">${B.tex(v==='book'?'f=\\frac{1}{0.8\\times10^{-6}}=1.2\\times10^{6}=1.2\\ \\text{MHz}':'f=\\frac{1}{0.8\\times10^{-6}}=1.25\\times10^{6}\\ \\text{Hz}=1.25\\ \\text{MHz}',true)}<span class="eqno"></span></div>
        <p class="sub" style="margin:4px 0 0">${v==='book'?'هذا الرقم مطبوع في الكتاب، والقسمة غير صحيحة: <span class="ltr">1 ÷ 0.8 = 1.25</span> وليس <span class="ltr">1.2</span>.':'القسمة الصحيحة: <span class="ltr">1 ÷ 0.8 = 1.25</span>، فالتردد <b>1.25 ميغاهرتز</b> أي <span class="ltr">1 250 000</span> دورة في الثانية.'}</p>`;
        el.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>{v=b.dataset.v;draw()})};
      draw();
    }},
    {tip:String.raw`<p>الطريقة: عدد الدورات في الرسم <span class="ltr">5</span>، والزمن الكلي <span class="ltr">4 µs</span>، فزمن الدورة \(T=4\div5=0.8\ \mu s\). ثم \(f=1/T\). لاحظ أن هذا التردد أكبر بكثير من تردد الشبكة: الموجة تكمل أكثر من مليون دورة في الثانية.</p>`}
   ]},

  {recap:[
   String.raw`التيار المتردد يتغير اتجاهه وقيمته بشكل دوري منتظم مع الزمن، وكل دورة تكرر التغيرات نفسها (ص 8).`,
   String.raw`يتولد عندما يقطع موصل خطوط مجال مغناطيسي (قانون فاراداي): الجهد صفر عند A وC، وأعلى قيمة عند B، وأعلى قيمة بالاتجاه المعاكس عند D (ص <span class="ltr">8–9</span>).`,
   String.raw`الموجة الجيبية قمتها \(V_m\) عند <span class="ltr">90°</span> وقاعها عند <span class="ltr">270°</span>، ولها نصف موجب ونصف سالب؛ و \(\text{Radians}=\frac{\pi}{180^\circ}\times\text{Degrees}\) (ص 10).`,
   String.raw`التردد عدد الدورات في الثانية ووحدته Hz، والزمن الدوري \(T=\frac{1}{f}\) <span class="ltr">(1-1)</span>: <span class="ltr">50 Hz</span> ← <span class="ltr">20 ms</span>، و<span class="ltr">60 Hz</span> ← <span class="ltr">16.67 ms</span> (تردد المملكة) (ص 11).`]}
],
 theory:[
  {h:'مقدمة الحقيبة',ref:'ص 1',html:`<p>تسعى المؤسسة العامة للتدريب التقني والمهني لتأهيل الكوادر الوطنية المدربة القادرة على شغل الوظائف التقنية والفنية والمهنية المتوفرة في سوق العمل. وقد خطت الإدارة العامة لتصميم وتطوير المناهج خطوة في بناء البرامج التدريبية تمثلت في مشروع إعداد <b>المعايير المهنية الوطنية</b> الذي تشترك في بنائه لجان تخصصية تمثل سوق العمل والمؤسسة.</p>
   <p>«وتتناول هذه الحقيبة التدريبية "دوائر كهربائية - 2" لمتدربي تخصصات "<b>الآلات والمعدات الكهربائية والقوى الكهربائية ومشغل لوحة التحكم</b>" للكليات التقنية موضوعات حيوية تتناول كيفية اكتساب المهارات اللازمة لهذا التخصص»، بأسلوب مبسط مدعم بالتطبيقات والأشكال.</p>`},
  {h:'تمهيد',ref:'ص 5',html:`<p>يهدف مقرر الدوائر الكهربائية-2 إلى تعريف المتدرب بأساسيات ومبادئ التيار المتردد وتحليل دوائره بالإضافة إلى دوائر التيار المتردد ثلاثية الأوجه. ودراسة هذا المقرر ستمكن المتدرب من:</p>
   <ul><li>الإلمام بمبادئ التيار المتردد وكيفية تحليل دوائره.</li><li>فهم التوصيلات المختلفة للمعاوقات في دوائر التيار المتردد.</li><li>الإلمام بدوائر التيار المتردد ثلاثي الأطوار (الأوجه).</li></ul>
   <p>وقد قسمت الحقيبة إلى وحدتين:</p>
   <div class="ca-tbl"><table class="tt"><thead><tr><th>الوحدة</th><th>محتواها</th></tr></thead><tbody>
   <tr><td><b>الأولى:</b> مبادئ التيار المتردد وتحليل دوائره</td><td>ثلاثة فصول: (1) تعريف التيار المتردد وخصائصه: الدورة والتردد والقيمة اللحظية والقيمة الفعالة. (2) أنواع المعاوقات ومفهوم المطاور، والتوصيل على التوالي والتوازي والتوالي-التوازي مع أمثلة التحليل. (3) أنواع القدرة ومعامل القدرة والواتميتر.</td></tr>
   <tr><td><b>الثانية:</b> دوائر التيار المتردد ثلاثية الأوجه</td><td>فصلان: (1) توليد النظام ثلاثي الأطوار وتتابع الأطوار، وتوصيلتا النجمة والدلتا والعلاقة بين قيم الخط وقيم الوجه. (2) القدرة في الدوائر ثلاثية الأوجه وقياسها بجهازي واتميتر.</td></tr></tbody></table></div>`},
  {h:'الوحدة الأولى: مبادئ التيار المتردد وتحليل دوائره',ref:'ص 6–7',html:`<p><b>الهدف العام للوحدة:</b> معرفة الخطوات المستعملة لتحليل دوائر التيار المتردد البسيطة.</p>
   <p><b>الأهداف التفصيلية:</b></p><ol><li>أن يلم المتدرب بخواص التيار المتردد وكيفية توليده.</li><li>أن يلم المتدرب بتعريف الموجة – الزمن الدوري – التردد.</li><li>أن يلم المتدرب بالممانعات الحثية والسعوية.</li><li>أن يلم المتدرب بدوائر الرنين.</li><li>أن يلم المتدرب بتعريف القدرة الظاهرية والفعالة وغير الفعالة.</li></ol>
   <p class="sub">هذا الدرس والدروس الستة التالية تغطي الفصل الأول كاملاً وبداية الفصل الثاني حتى الرنين في دوائر التوالي.</p>`},
  {h:'الفصل الأول: التيار المتردد',ref:'ص 8',html:'<p>التيار المتردد هو الأكثر استعمالاً في كل مجالات التقنية الكهربائية، ولهذا يجب فهم خصائصه جيداً. وسنشرح هذه الخصائص في هذا الفصل بإيجاز غير مخل.</p>'},
  {h:'1-1-1 تعريف التيار المتردد',ref:'ص 8',html:'<p>يكون التيار (أو الجهد) <b>متردداً</b> إذا <b>تغير اتجاهه وقيمته بشكل دوري منتظم مع الزمن</b> \\(t\\)، بحيث يمر في كل دورة بنفس التغيرات التي مر بها في الدورة السابقة.</p>'},
  {h:'1-1-2 كيفية توليد التيار المتردد',ref:'ص 8–9',html:`<p>إذا وضع موصل كهربائي في مجال مغناطيسي متغير فإنه ينتج فيه <b>قوة دافعة كهربائية مستحثة</b> حسب قانون «فاراداي». والشكل 1-1 يوضح مولد تيار متردد يحتوي على قطبين مغناطيسيين شمالي (N) وجنوبي (S). المجال المغناطيسي الذي يقطع موصلات الملف سيولد قوة دافعة كهربائية في هذه الموصلات، وهذه القوة ستسبب مرور تيار إذا أغلقت دائرة الملف عن طريق الحمل.</p>
   <p>ويكون اتجاه التيار متردداً: <b>يمر بالصفر</b> عندما يكون الموصل في الموضعين A وC، و<b>يمر بقيمته العظمى</b> في الموضع B، و<b>بقيمته العظمى في الاتجاه المعاكس</b> في الموضع D.</p>`},
  {fig:'1-1',ref:'ص 8',caption:'مولد بسيط: قطب N في الأعلى وقطب S في الأسفل وخطوط المجال \\(\\phi\\) بينهما، وفي المركز ملف يدور بسرعة زاوية \\(\\omega\\) وموصلاه (الدائرتان). الحروف A وB وC وD مواضع الموصل. • تيار خارج من الصفحة، × تيار داخل إليها، والأسهم الخضراء اتجاه حركة الموصل. هنا الملف عند الموضع B (أعلى جهد).',draw:()=>box(genSVG(90,{noMeter:1}),360)},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب:</b> الجهد يتولد عندما <b>يقطع</b> الموصل خطوط المجال. في الموضعين A وC يتحرك الموصل موازياً لخطوط المجال (لا يقطعها) فالجهد صفر، وفي B وD يتحرك عمودياً عليها (يقطع أكبر عدد منها) فالجهد أكبر ما يمكن. ودوران القطبين حول ملف ثابت يعطي نفس النتيجة كدوران الملف بين قطبين ثابتين، لأن المهم هو الحركة النسبية.'},
  {fig:'1-2',ref:'ص 9',caption:'عملية توليد الموجة خلال المراحل الأربع: في كل لقطة وضع الملف بين القطبين، وإلى جانبه الجزء المرسوم من الموجة حتى تلك اللحظة.',draw:()=>[[0,'لاحظ وضع الملف في هذا الموقع: الجهد يساوي صفراً وبالتالي لا يوجد تيار كهربائي.','جهد صفر — الموقع الأول'],[90,'عند تحرك الملف 90 درجة الجهد وصل إلى أعلى قيمة إيجابية له.','أعلى جهد إيجابي — الموقع الثاني'],[180,'عندما يصل الملف إلى 180 درجة يهبط الجهد مجدداً إلى صفر.','الجهد ينزل إلى صفر — نصف دورة'],[270,'أما عندما يصل الملف إلى 270 درجة يصل الجهد إلى أعلى قيمة سالبة له.','أعلى جهد سلبي — ثلاثة أرباع الدورة أو 270 درجة'],[360,'أخيراً، عندما يكمل الملف دورة كاملة أي عند 360 درجة يهبط الجهد إلى صفر.','جهد صفر — دورة كاملة']].map(([a,t,l],i)=>`<div class="ca-stage">${box(stageSVG(a),520)}<p><b>${i+1}.</b> ${t} <span class="lb">${l}</span></p></div>`).join('')},
  {h:'1-1-3 التيار المتردد الجيبي',ref:'ص 10',html:'<p>إذا كان تغير التيار (أو الجهد) مع الزمن على شكل <b>دالة جيبية</b> فنقول إن التيار (أو الجهد) <b>متردد جيبي</b>، وهذا الشكل هو الأكثر استعمالاً حيث إن المولدات المستعملة في الشبكات الكهربائية تنتج جهوداً قريبة جداً منه. ويمثل الشكل 1-3 جهداً متردداً جيبياً.</p>'},
  {fig:'1-3',ref:'ص 10',caption:'الجهد المتردد الجيبي: قمته \\(V_m\\) عند 90°، ويعبر الصفر عند 180°، وقاعه عند 270°، ويعود للصفر عند 360°. السهم T طول دورة كاملة.',draw:()=>box(sineFig13(),560)},
  {h:'حالة خاصة: التحويل بين الدرجات والراديان',ref:'ص 10',html:`<p>للتحويل من التمثيل الزاوي (الراديان) إلى الدرجي أو العكس نستخدم العلاقتين:</p>
   $$\\text{Radians}=\\frac{\\pi}{180^\\circ}\\times\\text{Degrees} \\qquad\\qquad \\text{Degrees}=\\frac{180^\\circ}{\\pi}\\times\\text{Radians}$$
   <p><b>مثال:</b> حول القيمة \\(30^\\circ\\) من الدرجات إلى الراديان:</p>$$30^\\circ\\times\\frac{\\pi}{180^\\circ}=\\frac{\\pi}{6}\\ \\text{rad}$$`},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب:</b> الدورة الكاملة \\(360^\\circ=2\\pi\\) راديان ≈ <span class="ltr">6.283 rad</span>، ونصف الدورة \\(180^\\circ=\\pi\\)، والربع \\(90^\\circ=\\pi/2\\). الراديان الواحد ≈ <span class="ltr">57.3°</span>. في الآلة الحاسبة انتبه لوضع الزاوية: <span class="ltr">DEG</span> للدرجات و<span class="ltr">RAD</span> للراديان.'},
  {h:'1-1-4 الموجة',ref:'ص 10',html:'<p>الموجة هي <b>المسار الذي يرسمه الجهد (أو التيار) بدلالة الزمن</b> أو بدلالة كمية أخرى (كزاوية الطور كما سنرى فيما بعد). ونسمي نصف الموجة فوق المحور الأفقي <b>النصف الموجب</b>، أما النصف الآخر فيسمى <b>النصف السالب</b>.</p>'},
  {h:'1-1-5 التردد (f) والزمن الدوري (T)',ref:'ص 11',html:`<p><b>التردد (f)</b> هو عدد الدورات التي ترسمها الموجة في زمن معين، ووحدته <b>الهرتز</b> <span class="ltr">Hertz</span> ورمزه <span class="ltr">Hz</span> وهو يمثل عدد الدورات في الثانية. والزمن اللازم لإكمال موجة كاملة يسمى <b>الزمن الدوري</b> أو زمن الدورة \\((T)\\). وكلما قصر زمن الدورة ازداد التردد بنفس النسبة، أي أن العلاقة بين الزمن الدوري والتردد علاقة عكسية:</p>
   $$T=\\frac{1}{f} \\qquad (1\\text{-}1)$$
   <p><b>مثال 1-1-1:</b> زمن دورة موجة ترددها <span class="ltr">50 Hz</span> هو <span class="ltr">T = 1/50 = 0.02 s = 20 ms</span>، وترددها <span class="ltr">60 Hz</span>: <span class="ltr">T = 1/60 = 0.01667 s = 16.67 ms</span>. وهذان الترددان هما المستعملان في الشبكات الكهربائية عبر العالم، و<b>في المملكة العربية السعودية تستعمل 60 Hz</b>.</p>
   <p><b>مثال 1-1-2:</b> حدد الزمن الدوري والتردد للموجة الموضحة في الشكل (1-4): الموجة تكمل <b>5 دورات</b> في <span class="ltr">4 µs</span>، إذن</p>
   $$T=\\frac{1}{5}\\times 4\\times10^{-6}=0.8\\ \\mu s \\qquad f=\\frac{1}{T}=\\frac{1}{0.8\\times10^{-6}}$$`},
  {fig:'1-4',ref:'ص 11',caption:'موجة تكمل 5 دورات خلال <span class="ltr">4 µs</span> (المحور الأفقي هو الزمن t بالميكروثانية).',draw:()=>box(fig14(),560)},
  {widget:(el)=>{let v='book';const draw=()=>{el.innerHTML=`<figure class="fig"><h3 class="sm" style="margin:0">ناتج التردد في مثال <span class="ltr">1-1-2</span> <span class="ref">ص 12</span></h3><div class="ca-row">${segHTML('f12',[['book','كما في الكتاب'],['fixed','المصحح']],v)}</div>
     <div class="callout${v==='book'?' err':''}">${B.tex(v==='book'?'f=\\frac{1}{0.8\\times10^{-6}}=1.2\\times10^{6}=1.2\\ \\text{MHz}':'f=\\frac{1}{0.8\\times10^{-6}}=1.25\\times10^{6}\\ \\text{Hz}=1.25\\ \\text{MHz}',true)}${v==='book'?'هذا الرقم مطبوع في الكتاب، والقسمة غير صحيحة: 1 ÷ 0.8 = 1.25 وليس 1.2.':'القسمة الصحيحة: 1 ÷ 0.8 = 1.25، فالتردد <b>1.25 ميغاهرتز</b> أي <span class="ltr">1 250 000</span> دورة في الثانية.'}</div></figure>`;segBind(el,'f12',x=>{v=x;draw()})};draw()}},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب:</b> البادئات: <span class="ltr">ms</span> ملّي = \\(10^{-3}\\)، <span class="ltr">µs</span> ميكرو = \\(10^{-6}\\)، <span class="ltr">kHz</span> كيلو = \\(10^{3}\\)، <span class="ltr">MHz</span> ميغا = \\(10^{6}\\). وإذا عرفت عدد الدورات N في زمن t فإن \\(T=t/N\\) و\\(f=N/t\\).'},
  {err:L1_ERR}
 ],
 lab:(el)=>{
  let mode='auto',ang=0,f=60,cyc=0,N=5,tw=4,tu='us';const did={};const at={};
  el.innerHTML=ar(`<div id="l1tp"></div><div class="grid ca-lab">
   <div class="panel c7"><h2>المولد البسيط <small>مبني على الشكلين 1-1 و1-2 ص 8–9</small></h2>
    <div class="svgbox" id="l1g" style="max-width:470px;margin-inline:auto"></div>
    <div class="ca-row">${segHTML('md',[['auto','دوران تلقائي'],['man','تحريك يدوي']],mode)}</div>
    <div id="l1man">${sl('l1a','زاوية الملف (من الموضع A)',0,720,1,0)}<div class="ca-row" id="l1pos">${[0,90,180,270,360].map(a=>`<button class="btn" data-pa="${a}">${a}°</button>`).join('')}</div></div>
    <p class="sub">العرض مبطأ كثيراً لتراه بعينك: الدورة الحقيقية تستغرق الزمن الدوري T المكتوب يميناً.</p></div>
   <div class="panel c5"><h2>القراءات</h2><div class="facts">${fact('زاوية الملف','l1fa')}${fact('الجهد اللحظي v','l1fv')}${fact('الدورات المكتملة','l1fc')}</div>
    ${sl('l1f','التردد f',1,100,1,f)}<div class="facts">${fact('الزمن الدوري T = 1/f (1-1)','l1fT')}${fact('الدورات في ثانية واحدة','l1fn')}</div><div class="ca-row"><span id="l1chip" class="ca-chip"></span></div></div>
   <div class="panel c12"><h2>الموجة المتولدة <small>بدلالة الزاوية (يمين) وبدلالة الزمن لدورتين (يسار)</small></h2><div class="grid"><div class="c6"><div class="svgbox" id="l1w1"></div></div><div class="c6"><div class="svgbox" id="l1w2"></div></div></div></div>
   <div class="panel c12"><h2>اقرأ الموجة: من عدد الدورات إلى T و f <small>مبني على الشكل 1-4 ومثال 1-1-2 ص 11–12</small></h2>
    <div class="grid"><div class="c5">${sl('l1N','عدد الدورات الظاهرة N',1,20,1,N)}${sl('l1t','الزمن الكلي t',1,100,0.5,tw)}<div class="ca-row"><span class="sub">وحدة الزمن</span>${segHTML('tu',[['us','µs'],['ms','ms'],['s','s']],tu)}</div>
     <div class="ca-row"><button class="btn" id="l1p14">الشكل 1-4: 5 دورات في 4 µs</button><button class="btn" id="l1pq1">المسألة 1: 4 دورات في 30 ms</button></div></div>
     <div class="c7"><div class="svgbox" id="l1rw"></div><div class="facts">${fact('T = t / N','l1rT')}${fact('f = 1 / T','l1rf')}</div></div></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l1st"></ol></div></div>`);
  B.math(el);const $=s=>el.querySelector(s);
  const TP=B.params($('#l1tp'),'u1-l1',[{k:'Vm',label:'القيمة العظمى للجهد المتولد V<sub>m</sub>',unit:'V',value:100,min:0.1,max:100000,step:'any'}],()=>{steps.redraw()});
  const ui=()=>{$('#l1man').style.opacity=mode==='man'?1:.45;};
  segBind(el,'md',v=>{mode=v;if(v==='man'){ang=Math.round(ang)%720;$('#l1a').value=ang;did.man=1}ui()});
  $('#l1a').oninput=e=>{mode='man';segSet(el,'md','man');ang=+e.target.value;did.man=1;ui()};
  el.querySelectorAll('[data-pa]').forEach(b=>b.onclick=()=>{mode='man';segSet(el,'md','man');ang=+b.dataset.pa;$('#l1a').value=ang;at[ang]=1;did.man=1;ui()});
  $('#l1f').oninput=e=>{f=+e.target.value};
  $('#l1N').oninput=e=>{N=+e.target.value;rw()};$('#l1t').oninput=e=>{tw=+e.target.value;rw()};segBind(el,'tu',v=>{tu=v;rw()});
  $('#l1p14').onclick=()=>{N=5;tw=4;tu='us';$('#l1N').value=5;$('#l1t').value=4;segSet(el,'tu','us');did.p14=1;rw()};
  $('#l1pq1').onclick=()=>{N=4;tw=30;tu='ms';$('#l1N').value=4;$('#l1t').value=30;segSet(el,'tu','ms');rw()};
  const UF={us:1e-6,ms:1e-3,s:1},UL={us:'µs',ms:'ms',s:'s'};
  const fmtT=T=>T<1e-3?fm(rd(T*1e6,4))+' µs':T<1?fm(rd(T*1e3,4))+' ms':fm(rd(T,4))+' s';
  const fmtF=F=>F>=1e6?fm(rd(F/1e6,4))+' MHz':F>=1e3?fm(rd(F/1e3,4))+' kHz':fm(rd(F,4))+' Hz';
  function rw(){$('#l1N-v').textContent=N;$('#l1t-v').textContent=fm(tw)+' '+UL[tu];const T=tw*UF[tu]/N;
   $('#l1rT').textContent=fmtT(T);$('#l1rf').textContent=fmtF(1/T);
   $('#l1rw').innerHTML=plotSVG({w:520,h:190,x0:0,x1:tw*1.06,y0:-1.3,y1:1.6,xt:[0,tw/4,tw/2,3*tw/4,tw].map(v=>rd(v,3)),yt:[],xl:'t ('+UL[tu]+')',yl:'v',cid:'l1rwc',
    series:[{pts:Array.from({length:601},(_,i)=>{const t=i/600*tw;return [t,Math.sin(2*PI*N*t/tw)]}),col:'--live',w:1.8}],
    extra:(X,Y)=>arrow(X(tw/2),Y(1.38),X(0)+2,Y(1.38),'--fg',1.1)+arrow(X(tw/2),Y(1.38),X(tw)-2,Y(1.38),'--fg',1.1)+arT(X(tw/2),Y(1.38)-6,N+' دورات / '+fm(tw)+' '+UL[tu],{fs:12})+(N<=12?`<path d="M${X(0)} ${fx(Y(-1.15))}H${fx(X(tw/N))}" stroke="var(--blue)" stroke-width="3"/>`+S.t(fx(X(tw/N/2)),fx(Y(-1.15)+14),'T','b'):'')});}
  const steps=stepsUI($('#l1st'),[
   {t:'شاهد التوليد',x:'اترك «دوران تلقائي» حتى يكمل الملف دورة واحدة على الأقل. لاحظ مؤشر الجهاز: يتحرك يميناً ثم يرجع ثم يساراً — هذا هو الجهد المتردد.',done:()=>cyc>=1},
   {t:'الموقع الأول (0°)',x:'اختر «تحريك يدوي» واضغط <b>0°</b>: الموصلان عند A وC يتحركان موازيين لخطوط المجال، فالجهد صفر.',done:()=>mode==='man'&&at[0]&&ang===0},
   {t:'الموقع الثاني (90°)',get x(){return `اضغط <b>90°</b>: الموصل عند B يقطع خطوط المجال عمودياً، فالجهد أعلى قيمة موجبة <span class="ltr">+V<sub>m</sub> = +${fm(TP.v.Vm)} V</span>.`},done:()=>mode==='man'&&ang===90},
   {t:'نصف دورة وثلاثة أرباع',get x(){return `اضغط <b>180°</b> (الجهد يرجع إلى صفر) ثم <b>270°</b>: الجهد أعلى قيمة سالبة <span class="ltr">−${fm(TP.v.Vm)} V</span> والتيار في الاتجاه المعاكس (لاحظ • و × على الموصلين).`},done:()=>mode==='man'&&at[180]&&ang===270},
   {t:'التردد والزمن الدوري',x:'حرّك التردد إلى <span class="ltr">50 Hz</span>: الزمن الدوري <span class="ltr">T = 20 ms</span> (مثال 1-1-1). ثم أرجعه إلى <span class="ltr">60 Hz</span> تردد المملكة: <span class="ltr">T = 16.67 ms</span>.',done:()=>{if(f===50)did.f50=1;return did.f50&&f===60}},
   {t:'اقرأ الموجة (مثال 1-1-2)',x:'في اللوحة الأخيرة اضغط «الشكل 1-4»: <span class="ltr">T = 4 µs ÷ 5 = 0.8 µs</span> والتردد <span class="ltr">1.25 MHz</span> (طُبع في الكتاب 1.2 MHz خطأً).',done:()=>N===5&&tw===4&&tu==='us'}
  ]);
  ui();rw();
  loopOn(el,dt=>{
   if(mode==='auto'){const prev=ang;ang=(ang+dt*90)%720;if(ang<prev||(prev<360&&ang>=360))cyc++;}
   const a=ang,v=Math.sin(a*D)*TP.v.Vm;
   $('#l1a-v').textContent=fm(Math.round(a))+'°';$('#l1f-v').textContent=f+' Hz';
   $('#l1g').innerHTML=genSVG(a%360,{Vm:TP.v.Vm});
   $('#l1fa').textContent=fm(Math.round(a%360))+'°';$('#l1fv').textContent=fm(rd(v,2))+' V';$('#l1fc').textContent=String(cyc);
   const T=1/f;$('#l1fT').textContent=fm(rd(T*1000,2))+' ms';$('#l1fn').textContent=String(f);
   const am=a%360,ch=$('#l1chip');const sv=Math.sin(am*D);
   if(Math.abs(sv)<0.02){ch.className='ca-chip';ch.textContent='الجهد صفر: الموصل يتحرك موازياً للمجال'}else if(sv>0.98){ch.className='ca-chip ok';ch.textContent='أعلى قيمة موجبة +Vm'}else if(sv<-0.98){ch.className='ca-chip warn';ch.textContent='أعلى قيمة سالبة −Vm'}else{ch.className='ca-chip ld';ch.textContent=sv>0?'النصف الموجب':'النصف السالب'}
   const Vm=TP.v.Vm,ym=niceMax(Vm*1.1);
   $('#l1w1').innerHTML=plotSVG({w:520,h:220,x0:0,x1:360,y0:-ym,y1:ym,xt:[0,90,180,270,360],xf:v=>v+'°',yt:[-ym,-ym/2,0,ym/2,ym],yf:v=>fm(rd(v,1)),xl:'α',yl:'v (V)',cid:'l1c1',
    series:[{pts:Array.from({length:121},(_,i)=>[i*3,Vm*Math.sin(i*3*D)]),col:'--line',w:1.4},{pts:Array.from({length:Math.floor(am/2)+1},(_,i)=>[i*2,Vm*Math.sin(i*2*D)]).concat([[am,Vm*Math.sin(am*D)]]),col:'--live',w:2.6}],
    extra:(X,Y)=>`<circle cx="${fx(X(am))}" cy="${fx(Y(v))}" r="5" fill="var(--live)"/>`});
   const tt=(a/360)*T,tm=(tt%(2*T))*1000;
   $('#l1w2').innerHTML=plotSVG({w:520,h:220,x0:0,x1:2*T*1000,y0:-ym,y1:ym,xt:[0,T*500,T*1000,T*1500,T*2000].map(x=>rd(x,2)),yt:[-ym,0,ym],yf:v=>fm(rd(v,1)),xl:'t (ms)',yl:'v (V)',cid:'l1c2',
    series:[{pts:Array.from({length:201},(_,i)=>{const x=i/200*2*T;return [x*1000,Vm*Math.sin(2*PI*f*x)]}),col:'--live',w:2}],
    extra:(X,Y)=>`<path d="M${fx(X(tm))} 14V${fx(Y(-ym))}" stroke="var(--blue)" stroke-width="1.4"/><circle cx="${fx(X(tm))}" cy="${fx(Y(Vm*Math.sin(2*PI*f*tm/1000)))}" r="5" fill="var(--blue)"/>`+arrow(X(T*500),Y(-ym*0.85),X(0)+2,Y(-ym*0.85),'--fg',1.1)+arrow(X(T*500),Y(-ym*0.85),X(T*1000)-2,Y(-ym*0.85),'--fg',1.1)+S.t(X(T*500),Y(-ym*0.85)-5,'T = '+fm(rd(T*1000,2))+' ms','')});
   steps.check()});
 },
 examples:[
  {title:'مثال: التحويل من الدرجات إلى الراديان',ref:'ص 10',q:'<p>حول القيمة التالية من الدرجات <span class="ltr">Degrees</span> إلى الراديان <span class="ltr">Radians</span>: <span class="ltr">30°</span>.</p>',
   given:[{id:'deg',label:'الزاوية بالدرجات',sym:'',unit:'°',value:30}],
   solve:g=>{const r=g.deg*PI/180,n=180/g.deg,isF=Math.abs(n-Math.round(n))<1e-9&&Math.abs(n)>=1;return [
    {t:'نضرب في \\(\\pi/180^\\circ\\):',f:`${fm(g.deg)}^\\circ\\times\\frac{\\pi}{180^\\circ}=${isF?(Math.round(n)===1?'\\pi':`\\frac{\\pi}{${Math.round(n)}}`):fm(rd(g.deg/180,4))+'\\,\\pi'}\\ \\text{rad}`},
    {t:'وبالأرقام:',v:rd(r,4),unit:'rad',final:true}]}},
  {title:'مثال 1-1-1',ref:'ص 11',q:'<p>احسب زمن دورة موجة مترددة ترددها يساوي: أ- <span class="ltr">50 Hz</span> ب- <span class="ltr">60 Hz</span>.</p>',
   given:[{id:'f1',label:'التردد في (أ)',sym:'f',unit:'Hz',value:50},{id:'f2',label:'التردد في (ب)',sym:'f',unit:'Hz',value:60}],
   solve:g=>[{t:'أ- بالمعادلة (1-1):',f:`T=\\frac{1}{f}=\\frac{1}{${fm(g.f1)}}`,v:rd(1/g.f1,5),unit:'s'},{t:'بالملّي ثانية:',v:rd(1000/g.f1,2),unit:'ms',final:true},
    {t:'ب-',f:`T=\\frac{1}{${fm(g.f2)}}`,v:rd(1/g.f2,5),unit:'s'},{t:'بالملّي ثانية:',v:rd(1000/g.f2,2),unit:'ms',final:true},
    {t:'وهذان الترددان هما المستعملان في الشبكات الكهربائية عبر العالم (في المملكة العربية السعودية تستعمل 60 Hz).'}]},
  {title:'مثال 1-1-2',ref:'ص 11–12',q:'<p>حدد الزمن الدوري والتردد للموجة الموضحة في الشكل (1-4): تكمل الموجة <b>5 دورات</b> في <span class="ltr">4 µs</span>.</p>'+box(fig14(),480),
   given:[{id:'N',label:'عدد الدورات',sym:'N',unit:'',value:5},{id:'t',label:'الزمن الكلي',sym:'t',unit:'µs',value:4}],
   solve:(g,B,isBook)=>{const T=g.t/g.N,f=1/(T*1e-6);const out=[{t:'الزمن الدوري = الزمن الكلي ÷ عدد الدورات:',f:`T=\\frac{1}{${fm(g.N)}}\\times ${fm(g.t)}\\times10^{-6}`,v:rd(T,4),unit:'µs'},
    {t:'التردد بالمعادلة (1-1):',f:`f=\\frac{1}{T}=\\frac{1}{${fm(rd(T,4))}\\times10^{-6}}`}];
    if(isBook)out.push({t:'كما طُبع في الكتاب (خطأ في القسمة):',v:1.2,unit:'MHz'},{t:'المصحح:',v:1.25,unit:'MHz',final:true});
    else out.push({v:rd(f/1e6,4),unit:'MHz',final:true});return out},
   note:'<b>ملاحظة على الكتاب:</b> طُبع الناتج <span class="ltr">1.2 MHz</span> والصحيح <span class="ltr">1/0.8 = 1.25</span> أي <span class="ltr">1.25 MHz</span>. بقيم الكتاب تعرض الحاسبة الرقمين، وبأرقامك تحسب الناتج الصحيح. وحذفنا من نص السؤال «أ- 50 Hz ب- 60 Hz» المنقولين خطأً من المثال السابق.'}
 ],
 quiz:[
  {q:'يكون التيار متردداً إذا:',o:['بقيت قيمته ثابتة','تغير اتجاهه وقيمته بشكل دوري منتظم مع الزمن','تغيرت قيمته فقط دون اتجاهه','كان صادراً من بطارية'],c:1,e:'التعريف 1-1-1 ص 8.'},
  {q:'حسب أي قانون تتولد القوة الدافعة الكهربائية في موصل يقطع مجالاً مغناطيسياً متغيراً؟',o:['قانون أوم','قانون كيرشوف','قانون فاراداي','قانون كولوم'],c:2,e:'ص 8: «قوة دافعة كهربائية مستحثة حسب قانون فاراداي».'},
  {q:'في المولد البسيط يكون الجهد المتولد صفراً عندما يكون الملف عند:',o:['90° و 270°','0° و 180° و 360°','45° فقط','270° فقط'],c:1,e:'الشكل 1-2: جهد صفر عند الموقع الأول ونصف الدورة والدورة الكاملة.'},
  {q:'أعلى قيمة سالبة للجهد تكون عند زاوية:',o:['90°','180°','270°','360°'],c:2,e:'الشكل 1-2 ص 9.'},
  {q:'الزاوية \\(60^\\circ\\) بالراديان تساوي:',o:['\\(\\pi/6\\)','\\(\\pi/3\\)','\\(\\pi/2\\)','\\(3\\pi\\)'],c:1,e:'\\(60\\times\\pi/180=\\pi/3\\).'},
  {q:'الزمن الدوري لموجة ترددها <span class="ltr">60 Hz</span>:',o:['60 s','0.6 s','16.67 ms','20 ms'],c:2,e:'\\(T=1/60=0.01667\\ \\text{s}\\) (مثال 1-1-1).'},
  {q:'موجة تكمل 10 دورات في <span class="ltr">2 ms</span>. ترددها:',o:['5 Hz','200 Hz','5 kHz','20 kHz'],c:2,e:'\\(T=2/10=0.2\\ \\text{ms}\\) و \\(f=1/0.2\\,\\text{ms}=5000\\ \\text{Hz}\\).'},
  {q:'التردد المستعمل في الشبكة الكهربائية في المملكة العربية السعودية:',o:['50 Hz','60 Hz','100 Hz','400 Hz'],c:1,e:'ص 11.'}
 ]
});

/* ======================================================================
   Lesson 2 — instantaneous value, angular frequency (الشكل 1-5)
   ====================================================================== */
/* rotating radius OA + projection Aa + wave vs phase angle */
function rotWaveSVG(al,Vm,vmax,o){o=o||{};const cx=130,cy=135,R=105*Vm/vmax,x0=270,x1=610,X=a=>x0+a/360*(x1-x0),Y=v=>cy-v*105/vmax;
  const am=((al%360)+360)%360,Ax=cx+R*Math.cos(al*D),Ay=cy-R*Math.sin(al*D),v=Vm*Math.sin(al*D);
  let s=`<svg viewBox="0 0 630 275" role="img" aria-label="تحديد القيمة اللحظية بنصف قطر دوار">`;
  s+=`<circle cx="${cx}" cy="${cy}" r="${fx(R)}" fill="none" stroke="var(--blue)" stroke-width="1.6"/>`+arrow(cx-120,cy,cx+122,cy,'--muted',1.2)+arrow(cx,cy+122,cx,cy-122,'--muted',1.2);
  s+=`<path d="M${x0} ${cy}H${x1+8}M${x0} ${cy-118}V${cy+118}" stroke="var(--fg)" stroke-width="1.2"/>`;
  [90,180,270,360].forEach(a=>{s+=`<path d="M${fx(X(a))} ${cy-110}V${cy+110}" stroke="var(--line)" stroke-dasharray="3 3"/>`+S.t(fx(X(a)),cy+128,a===90?'π/2':a===180?'π':a===270?'3π/2':'2π','m')});
  s+=S.t(x1+6,cy-6,'α','','end')+S.t(x0+4,cy-112,'v','','start');
  let p='';for(let a=0;a<=360;a+=3)p+=(a?'L':'M')+fx(X(a))+' '+fx(Y(Vm*Math.sin(a*D)));s+=`<path d="${p}" fill="none" stroke="var(--live)" stroke-width="2.2"/>`;
  s+=`<path d="M${fx(Ax)} ${fx(Ay)}H${fx(X(am))}" stroke="var(--blue)" stroke-dasharray="5 4"/>`;
  s+=`<path d="M${fx(Ax)} ${fx(Ay)}V${cy}" stroke="var(--live)" stroke-width="3.2"/>`+`<path d="M${fx(X(am))} ${fx(Y(v))}V${cy}" stroke="var(--live)" stroke-width="3.2" opacity=".6"/>`;
  s+=arrow(cx,cy,Ax,Ay,'--live',2.6)+`<circle cx="${fx(Ax)}" cy="${fx(Ay)}" r="4.5" fill="var(--live)"/><circle cx="${fx(X(am))}" cy="${fx(Y(v))}" r="5" fill="var(--live)"/>`;
  const r0=26,large=am>180?1:0;if(am>0.5)s+=`<path d="M${cx+r0} ${cy}A${r0} ${r0} 0 ${large} 0 ${fx(cx+r0*Math.cos(am*D))} ${fx(cy-r0*Math.sin(am*D))}" fill="none" stroke="var(--fg)" stroke-width="1.2"/>`;
  s+=S.t(fx(cx+(r0+12)*Math.cos(am/2*D)),fx(cy-(r0+12)*Math.sin(am/2*D)+4),'α','b');
  s+=S.t(cx-8,cy+16,'O','m','end')+S.t(fx(Ax+(Math.cos(al*D)>=0?10:-10)),fx(Ay+(Math.sin(al*D)>=0?-8:16)),'A','',Math.cos(al*D)>=0?'start':'end')+S.t(fx(Ax+(Math.cos(al*D)>=0?8:-8)),cy+(v>=0?16:-6),'a','',Math.cos(al*D)>=0?'start':'end');
  if(!o.noVal)s+=S.t(cx,268,'Aa = v = '+fm(rd(v,2))+' V','b')+S.t(x0+8,fx(Y(Vm)-6),'Vm = '+fm(Vm)+' V','m','start');
  return s+'</svg>'}

const L2_ERR=`<b>ملاحظات على الكتاب (هذا الدرس):</b><ol style="margin:6px 0 0;padding-inline-start:20px">
 <li>مثال 1-1-4 ص 13: كُتب في البند (ب) «زاوية الطور عند بداية الزمن (θm)» والمقصود \\(\\theta_v\\) كما في الحل.</li>
 <li>الشكل 1-5 ص 13 لا يحمل الحرفين A وa المذكورين في النص؛ أضفناهما في الرسم هنا.</li></ol>`;

lesson({
 id:'u1-l2',unit:1,order:2,pages:'12–13',
 title:'القيمة اللحظية والتردد الزاوي',
 summary:'القيمة اللحظية v هي قيمة الجهد في لحظة معينة، ونحسبها بنقطة تدور على دائرة نصف قطرها Vm بسرعة زاوية ω = 2πf: الإسقاط Aa هو القيمة اللحظية، وزاوية الطور α = ωt + θv، و v(t) = Vm sin(ωt + θv). مع المثالين 1-1-3 و1-1-4.',
 theory:[
  {h:'1-1-6 القيمة اللحظية',ref:'ص 12',html:`<p>نسمي قيمة الجهد (أو التيار) في زمن معين \\(t\\) <b>بالقيمة اللحظية</b> للجهد (أو للتيار)، ونرمز لها بـ \\(v\\) (أو \\(i\\)). وأكبر قيمة للقيمة اللحظية تسمى <b>القيمة العظمى</b> للجهد (أو للتيار) ورمزها \\(V_m\\) (أو \\(I_m\\)).</p>
   <p>ونستطيع أن نحسب القيمة اللحظية للجهد باستعمال الطريقة الموضحة في الشكل 1-5: نمثل مسار الجهد بنقطة A تدور في محيط دائرة بسرعة زاوية \\(\\omega\\) (وتسمى كذلك <b>التردد الزاوي</b> ووحدتها الراديان لكل ثانية <span class="ltr">rad/s</span>) بحيث إن المسافة <b>Aa</b> من النقطة A إلى الإسقاط العمودي لهذه النقطة على المحور الأفقي تعطي القيمة اللحظية. ويساوي <b>نصف قطر الدائرة القيمة العظمى</b> للجهد، أما الزاوية \\(\\alpha\\) بين نصف القطر OA والمحور الأفقي فإنها تسمى <b>زاوية طور الجهد</b> وتعطى بالمعادلة</p>
   $$\\alpha=\\omega t+\\theta_v \\qquad (1\\text{-}2)$$
   <p>حيث \\(\\theta_v\\) هي زاوية طور الجهد في بداية الزمن \\((t=0)\\).</p>`},
  {fig:'1-5',ref:'ص 13',caption:'طريقة تحديد القيمة اللحظية لموجة جيبية (يسار)، والجهد المتردد الجيبي بدلالة الطور (يمين). نصف القطر OA = V<sub>m</sub>، والخط الأحمر الرأسي Aa هو القيمة اللحظية، والخط المتقطع ينقلها إلى الموجة. مرسوم هنا عند \\(\\alpha=45^\\circ\\).',draw:()=>box(rotWaveSVG(45,1,1.1,{noVal:1}),620)},
  {html:`<p>بما أن التردد يعطي عدد الدورات في وحدة الزمن، وحيث إن دورة واحدة تناسبها زاوية \\(2\\pi\\) راديان، فإن العلاقة بين السرعة الزاوية والتردد هي</p>
   $$\\omega=2\\pi f \\qquad (1\\text{-}3)$$
   <p>بناء على ما سبق نكتب القيمة اللحظية للجهد كما يلي</p>
   $$v(t)=V_m\\sin\\alpha=V_m\\sin(\\omega t+\\theta_v)=V_m\\sin(2\\pi f t+\\theta_v) \\qquad (1\\text{-}4)$$
   <p>ونمثل موجة الجهد (أو التيار) بدلالة الزاوية \\(\\alpha\\) كما في الشكل 1-5.</p>`},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب:</b> كيف تقرأ معادلة موجة مثل \\(v=100\\sin(377t+\\pi/6)\\)؟ الرقم أمام sin هو \\(V_m\\)، والرقم المضروب في t هو \\(\\omega\\) (ومنه \\(f=\\omega/2\\pi\\))، والزاوية المضافة هي \\(\\theta_v\\). وانتبه: \\(\\omega t\\) بالراديان، فإذا كانت \\(\\theta_v\\) بالدرجات حوّل أحدهما قبل الجمع.'},
  {h:'المثالان 1-1-3 و1-1-4',ref:'ص 13–14',html:`<p><b>مثال 1-1-3:</b> التردد الزاوي لموجة ترددها <span class="ltr">60 Hz</span>: \\(\\omega=2\\pi f=2\\pi\\times60=377\\ \\text{rad/s}\\).</p>
   <p><b>مثال 1-1-4:</b> إذا كانت معادلة موجة الجهد هي \\(v(t)=100\\sin(377t+\\pi/6)\\ \\text{V}\\) استنتج: أ- القيمة العظمى. ب- زاوية الطور عند بداية الزمن. ج- زاوية الطور عند الزمن <span class="ltr">t = 0.025 s</span> بالدرجات. د- القيمة اللحظية عند <span class="ltr">t = 0.025 s</span>.</p>
   <div class="ca-tbl"><table class="tt"><tbody><tr><td>أ</td><td>\\(V_m=100\\ \\text{V}\\)</td></tr><tr><td>ب</td><td>\\(\\theta_v=\\pi/6\\ \\text{rad}=30^\\circ\\)</td></tr><tr><td>ج</td><td>\\(\\alpha=377\\times0.025+\\pi/6=9.95\\ \\text{rad}=(9.95\\times180^\\circ/\\pi)=570^\\circ\\)</td></tr><tr><td>د</td><td>\\(v=100\\times\\sin570^\\circ=-50\\ \\text{V}\\)</td></tr></tbody></table></div>
   <p class="sub">الحل التفصيلي بحاسبة في تبويب «الأمثلة المحلولة»، وفي المختبر زر يضبط هذا المثال.</p>`},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب:</b> لماذا \\(\\sin570^\\circ=\\sin210^\\circ\\)؟ لأن كل \\(360^\\circ\\) دورة كاملة تعيد النقطة A إلى نفس مكانها: \\(570-360=210^\\circ\\)، وهي في النصف السالب من الدورة، فالجهد سالب.'},
  {err:L2_ERR}
 ],
 lab:(el)=>{
  let Vm=100,f=60,th=30,t=0,play=0;const did={};
  el.innerHTML=ar(`<div class="grid ca-lab">
   <div class="panel c12"><h2>النقطة الدوارة والقيمة اللحظية <small>مبنية على الشكل 1-5 والمعادلات 1-2 إلى 1-4 ص 12–13</small></h2>
    <div class="svgbox" id="l2v" style="max-width:640px;margin-inline:auto"></div>
    <div class="ca-row"><button class="btn primary" id="l2play">تشغيل الزمن</button><button class="btn" id="l2t0">t = 0</button><button class="btn" id="l2ex">اضبط مثال 1-1-4</button></div>
    <p class="sub">التشغيل مبطأ 100 مرة: كل ثانية على الشاشة = <span class="ltr">0.01 s</span> من الزمن الحقيقي.</p></div>
   <div class="panel c6"><h2>المعطيات</h2>${sl('l2Vm','القيمة العظمى V<sub>m</sub>',10,400,1,Vm)}${sl('l2f','التردد f',1,100,1,f)}${sl('l2th','زاوية الطور عند بداية الزمن θ<sub>v</sub>',-180,180,5,th)}${sl('l2t','الزمن t',0,0.05,0.0005,t)}</div>
   <div class="panel c6"><h2>الحساب الحي</h2><div class="facts">${fact('ω = 2πf (1-3)','l2w')}${fact('ωt (rad)','l2wt')}${fact('α = ωt + θ<sub>v</sub> (1-2)','l2a')}${fact('α بالدرجات','l2ad')}${fact('sin α','l2s')}${fact('v = V<sub>m</sub> sin α (1-4)','l2vv')}</div><div class="ca-row"><span class="ca-chip" id="l2chip"></span></div></div>
   <div class="panel c12"><h2>v(t) مع الزمن <small>من 0 إلى 0.05 s</small></h2><div class="svgbox" id="l2tw"></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l2st"></ol></div></div>`);
  B.math(el);const $=s=>el.querySelector(s);
  const bind=(id,fn)=>{$('#'+id).oninput=e=>{fn(+e.target.value);did.moved=1}};
  bind('l2Vm',v=>Vm=v);bind('l2f',v=>f=v);bind('l2th',v=>th=v);bind('l2t',v=>{t=v;play=0;pl()});
  const pl=()=>{$('#l2play').textContent=play?'إيقاف':'تشغيل الزمن'};
  $('#l2play').onclick=()=>{play=!play;if(play)did.play=1;pl()};$('#l2t0').onclick=()=>{t=0;play=0;pl();$('#l2t').value=0};
  $('#l2ex').onclick=()=>{Vm=100;f=60;th=30;t=0.025;play=0;pl();[['l2Vm',100],['l2f',60],['l2th',30],['l2t',0.025]].forEach(([i,v])=>$('#'+i).value=v);did.ex=1};
  const steps=stepsUI($('#l2st'),[
   {t:'البداية: θv = 0 و t = 0',x:'اضبط θ<sub>v</sub> على 0 واضغط «t = 0»: النقطة A على المحور الأفقي، فالمسافة Aa صفر والجهد اللحظي صفر.',done:()=>th===0&&t===0},
   {t:'زاوية الطور الابتدائية',x:'اجعل θ<sub>v</sub> = 30° والزمن صفر: تبدأ A مرفوعة بزاوية 30° والقيمة اللحظية \\(V_m\\sin30^\\circ=0.5V_m\\).',done:()=>th===30&&t===0},
   {t:'التردد الزاوي (مثال 1-1-3)',x:'اضبط التردد على <span class="ltr">60 Hz</span>: \\(\\omega=2\\pi\\times60=377\\ \\text{rad/s}\\).',done:()=>f===60&&th===30},
   {t:'دع الزمن يجري',x:'اضغط «تشغيل الزمن»: تدور A بالسرعة ω، ويرسم إسقاطها الموجة الجيبية. لاحظ أن α تزيد بلا توقف بينما تتكرر الموجة كل دورة.',done:()=>did.play&&t>0.012},
   {t:'مثال 1-1-4',x:'اضغط «اضبط مثال 1-1-4»: \\(\\alpha=9.95\\) rad = 570°، و \\(v=100\\sin570^\\circ=-50\\ \\text{V}\\).',done:()=>did.ex&&Vm===100&&f===60&&th===30&&Math.abs(t-0.025)<1e-9},
   {t:'متى يبلغ الجهد قمته؟',x:'بنفس المثال حرّك الزمن من الصفر حتى يصبح v = +100 V لأول مرة (α = 90°). الجواب: \\(t=(\\pi/2-\\pi/6)/377\\approx 2.8\\ \\text{ms}\\).',done:()=>Vm===100&&f===60&&th===30&&t>0&&t<0.004&&Math.sin((2*PI*f*t+th*D))>0.995}
  ]);
  loopOn(el,dt=>{if(play){t+=dt/100;if(t>0.05)t=0;$('#l2t').value=t}
   const w=2*PI*f,al=w*t+th*D,ad=al/D,v=Vm*Math.sin(al);
   $('#l2Vm-v').textContent=Vm+' V';$('#l2f-v').textContent=f+' Hz';$('#l2th-v').textContent=th+'°';$('#l2t-v').textContent=fm(rd(t,4))+' s';
   $('#l2w').textContent=fm(rd(w,2))+' rad/s';$('#l2wt').textContent=fm(rd(w*t,3));$('#l2a').textContent=fm(rd(al,3))+' rad';$('#l2ad').textContent=fm(rd(ad,1))+'°'+(ad>=360||ad<0?' ≡ '+fm(rd(((ad%360)+360)%360,1))+'°':'');
   $('#l2s').textContent=fm(rd(Math.sin(al),4));$('#l2vv').textContent=fm(rd(v,2))+' V';
   const ch=$('#l2chip'),sn=Math.sin(al);ch.className='ca-chip '+(sn>0.995?'ok':sn<-0.995?'warn':'ld');ch.textContent=sn>0.995?'القمة الموجبة +Vm':sn<-0.995?'القمة السالبة −Vm':Math.abs(sn)<0.01?'الجهد يعبر الصفر':sn>0?'النصف الموجب':'النصف السالب';
   $('#l2v').innerHTML=rotWaveSVG(ad,Vm,niceMax(Vm*1.08));
   const ym=niceMax(Vm*1.05);
   $('#l2tw').innerHTML=plotSVG({w:760,h:200,x0:0,x1:0.05,y0:-ym,y1:ym,xt:[0,0.01,0.02,0.025,0.03,0.04,0.05],yt:[-ym,0,ym],xl:'t (s)',yl:'v (V)',cid:'l2c',
    series:[{pts:Array.from({length:801},(_,i)=>{const x=i/800*0.05;return [x,Vm*Math.sin(w*x+th*D)]}),col:'--live',w:1.8}],
    extra:(X,Y)=>`<path d="M${fx(X(t))} 14V${fx(Y(-ym))}" stroke="var(--blue)" stroke-width="1.4"/><circle cx="${fx(X(t))}" cy="${fx(Y(v))}" r="5" fill="var(--blue)"/>`});
   steps.check()});
 },
 examples:[
  {title:'مثال 1-1-3',ref:'ص 13',q:'<p>احسب التردد الزاوي لموجة مترددة ترددها <span class="ltr">60 Hz</span>.</p>',given:[{id:'f',label:'التردد',sym:'f',unit:'Hz',value:60}],
   solve:g=>[{t:'بالمعادلة (1-3):',f:`\\omega=2\\pi f=2\\pi\\times${fm(g.f)}`,v:rd(2*PI*g.f,0),unit:'rad/s',final:true}]},
  {title:'مثال 1-1-4',ref:'ص 13–14',q:'<p>إذا كانت معادلة موجة الجهد هي \\(v(t)=100\\sin(377t+\\pi/6)\\ \\text{V}\\) استنتج ما يلي: أ- القيمة العظمى \\((V_m)\\). ب- زاوية الطور عند بداية الزمن \\((\\theta_v)\\). ج- زاوية الطور عند الزمن <span class="ltr">t = 0.025 s</span> بالدرجات. د- القيمة اللحظية عند الزمن <span class="ltr">t = 0.025 s</span>.</p>',
   given:[{id:'Vm',label:'القيمة العظمى',sym:'V_m',unit:'V',value:100},{id:'w',label:'التردد الزاوي',sym:'\\omega',unit:'rad/s',value:377},{id:'th',label:'زاوية الطور الابتدائية',sym:'\\theta_v',unit:'°',value:30},{id:'t',label:'الزمن',sym:'t',unit:'s',value:0.025}],
   solve:g=>{const thr=g.th*D,al=rd(g.w*g.t+thr,2),ad=rd(al*180/PI,0),v=rd(g.Vm*Math.sin(ad*D),2);return [
    {t:'أ- القيمة العظمى هي الرقم أمام sin:',v:g.Vm,unit:'V'},
    {t:'ب- زاوية الطور عند بداية الزمن:',f:`\\theta_v=${fm(rd(thr,4))}\\ \\text{rad}=${fm(g.th)}^\\circ`},
    {t:'ج- بالمعادلة (1-2):',f:`\\alpha=${fm(g.w)}\\times${fm(g.t)}+${fm(rd(thr,4))}=${fm(al)}\\ \\text{rad}`},
    {t:'نحولها إلى درجات:',f:`\\alpha=${fm(al)}\\times\\frac{180^\\circ}{\\pi}`,v:ad,unit:'°'},
    {t:'د- القيمة اللحظية بالمعادلة (1-4):',f:`v=${fm(g.Vm)}\\times\\sin ${fm(ad)}^\\circ`,v,unit:'V',final:true}]},
   note:'كتب الكتاب في البند (ب) «θm» والمقصود \\(\\theta_v\\). وأدخلنا \\(\\pi/6\\) هنا بالدرجات (30°) لتستطيع تغييرها.'}
 ],
 quiz:[
  {q:'القيمة اللحظية للجهد هي:',o:['أكبر قيمة للجهد','قيمة الجهد في زمن معين t','متوسط الجهد خلال دورة','قيمة الجهد المستمر المكافئ'],c:1,e:'ص 12.'},
  {q:'في الشكل 1-5 نصف قطر الدائرة يساوي:',o:['القيمة الفعالة','القيمة العظمى V<sub>m</sub>','التردد','الزمن الدوري'],c:1,e:'ص 12: «ويساوي نصف قطر الدائرة القيمة العظمى للجهد».'},
  {q:'وحدة التردد الزاوي ω:',o:['Hz','rad/s','s','V'],c:1,e:'ص 12.'},
  {q:'العلاقة بين التردد الزاوي والتردد:',o:['\\(\\omega=f/2\\pi\\)','\\(\\omega=2\\pi f\\)','\\(\\omega=1/f\\)','\\(\\omega=\\pi f\\)'],c:1,e:'المعادلة (1-3).'},
  {q:'التردد الزاوي لموجة ترددها <span class="ltr">50 Hz</span> تقريباً:',o:['50 rad/s','157 rad/s','314 rad/s','377 rad/s'],c:2,e:'\\(2\\pi\\times50=314.2\\).'},
  {q:'في الموجة \\(v=200\\sin(314t+45^\\circ)\\) زاوية الطور عند بداية الزمن:',o:['200','314','45°','0°'],c:2,e:'\\(\\theta_v\\) هي الزاوية المضافة إلى \\(\\omega t\\).'},
  {q:'إذا كانت α = 570° فإن sin α يساوي:',o:['0.5','−0.5','1','0'],c:1,e:'\\(570^\\circ\\) تكافئ \\(210^\\circ\\) و \\(\\sin210^\\circ=-0.5\\) (مثال 1-1-4).'}
 ]
});

/* ======================================================================
   Lesson 3 — average, RMS, form factor, peak factor
   ====================================================================== */
const WAVES={
 sine:{n:'جيبية',f:x=>Math.sin(2*PI*x),alt:1,pr:'√2',prv:SQ2,fr:'1.11'},
 full:{n:'موجة كاملة موحدة',f:x=>Math.abs(Math.sin(2*PI*x)),alt:0,pr:'√2',prv:SQ2,fr:'1.11'},
 half:{n:'نصف موجة موحدة',f:x=>Math.max(0,Math.sin(2*PI*x)),alt:0,pr:'2',prv:2,fr:'1.57'},
 tri:{n:'مثلثية',f:x=>x<0.25?4*x:x<0.75?2-4*x:4*x-4,alt:1,pr:'√3',prv:Math.sqrt(3),fr:'1.155'},
 sq:{n:'مربعة',f:x=>x<0.5?1:-1,alt:1,pr:'1',prv:1,fr:'1'},
 dist:{n:'مشوهة (الشكل 1-7)',f:null,alt:1,pr:'—',fr:'—'}};
const distF=k=>{const g=x=>Math.sin(2*PI*x)+k*Math.sin(6*PI*x);let m=0;for(let i=0;i<=400;i++)m=Math.max(m,Math.abs(g(i/400)));return x=>g(x)/m};
function waveStats(fn,alt){const N=4000;let s2=0,sAll=0,sH=0,mx=0;for(let i=0;i<N;i++){const x=(i+0.5)/N,v=fn(x);s2+=v*v;sAll+=v;if(x<0.5)sH+=v;mx=Math.max(mx,Math.abs(v))}
  const rms=Math.sqrt(s2/N),avFull=sAll/N,avHalf=sH/(N/2),av=alt?avHalf:avFull;return {rms,avFull,avHalf,av,mx,FR:rms/av,PR:mx/rms}}
function miniWave(fn,cycles){cycles=cycles||1.5;let p='';for(let i=0;i<=150;i++){const x=i/150*cycles;p+=(i?'L':'M')+fx(6+i/150*148)+' '+fx(30-22*fn(x%1))}
  return `<svg viewBox="0 0 160 60" role="img" aria-label="شكل الموجة" style="max-width:160px"><path d="M6 30H156" stroke="var(--line)"/><path d="${p}" fill="none" stroke="var(--blue)" stroke-width="2"/></svg>`}
/* الشكل 1-6 */
function heatSVG(o){o=o||{};const s1=!!o.s1,s2=!!o.s2,T=o.T==null?25:o.T,Tmax=o.Tmax||100,Tamb=o.Tamb==null?25:o.Tamb;
  let s=`<svg viewBox="0 0 470 260" role="img" aria-label="تجربة قياس القيمة الفعالة">`;
  const top=40,bot=225;
  s+=`<path class="w${s1||s2?' live':''}" d="M60 ${top}H360M60 ${bot}H360"/>`;
  const sw=(x,on,id,lb)=>`<g data-sw="${id}" style="cursor:pointer"><rect x="${x-26}" y="${top+6}" width="52" height="56" fill="transparent"/><path class="w" d="M${x} ${top}V${top+14}"/><circle cx="${x}" cy="${top+14}" r="3" fill="var(--fg)"/><path d="M${x} ${top+14}L${on?x:x+18} ${top+46}" stroke="var(${on?'--on':'--fg'})" stroke-width="3" stroke-linecap="round"/><circle cx="${x}" cy="${top+48}" r="3" fill="var(--fg)"/><path class="w" d="M${x} ${top+48}V${top+70}"/></g>`+arT(x-30,top+34,lb,{fs:12.5,a:'end'});
  s+=sw(60,s1,'1','مفتاح 1')+sw(190,s2,'2','مفتاح 2');
  // battery
  s+=`<path class="w" d="M60 ${top+70}V128M60 146V${bot}"/><path d="M42 128H78" stroke="var(--fg)" stroke-width="3"/><path d="M50 146H70" stroke="var(--fg)" stroke-width="5"/>`+S.t(84,126,'+','m','start')+arT(60,bot+22,'مصدر تيار مستمر',{fs:12});
  s+=`<path class="w" d="M190 ${top+70}V118M190 162V${bot}"/>`+acSrc(190,140,22)+arT(190,bot+22,'مصدر تيار متردد',{fs:12});
  // tank
  const lv=clamp((T-Tamb)/Math.max(Tmax-Tamb,1),0,1);
  s+=`<path d="M280 70V232H440V70" fill="none" stroke="var(--fg)" stroke-width="2.4"/><rect x="282" y="92" width="156" height="138" fill="var(--blue-soft)"/>`;
  s+=`<path class="w${s1||s2?' live':''}" d="M360 ${top}V100M360 ${bot}V200" />`+zig(360,100,360,200,7,s1||s2?'style="stroke:var(--live)"':'')+S.t(376,154,'R','','start');
  s+=`<rect x="404" y="50" width="12" height="150" rx="6" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/><circle cx="410" cy="206" r="11" fill="var(--live)" stroke="var(--fg)" stroke-width="1.6"/><rect x="406.5" y="${fx(196-140*lv)}" width="7" height="${fx(140*lv+6)}" fill="var(--live)"/>`;
  s+=S.t(410,40,fm(rd(T,1))+' °C','b');
  return s+'</svg>'}
function fig17(){const g=distF(0.18);return plotSVG({w:520,h:200,x0:0,x1:1.05,y0:-1.25,y1:1.25,xt:[],yt:[],xl:'t',yl:'v',cid:'c17',series:[{pts:Array.from({length:301},(_,i)=>[i/300,g(i/300)]),col:'--live'}]})}

const L3_ERR=`<b>ملاحظات على الكتاب (هذا الدرس):</b><ol style="margin:6px 0 0;padding-inline-start:20px">
 <li>مثال 1-1-5 ص 14: يشير إلى «الشكل 2-1» والمقصود الشكل 1-3 (الجهد الجيبي).</li>
 <li>مثال 1-1-6 ص 16: \\(I_m=\\sqrt2\\times4.4=6.2\\ \\text{A}\\) بتقريب الكتاب، والقيمة الأدق <span class="ltr">6.22 A</span>.</li>
 <li>عرّف الكتاب معامل الشكل لكنه لم يحسب قيمته لأي موجة؛ القيم المكتوبة هنا (مثل 1.11 للجيبية) توضيح من خارج الكتاب.</li></ol>`;

lesson({
 id:'u1-l3',unit:1,order:3,pages:'14–18',
 title:'القيمة المتوسطة والقيمة الفعالة ومعاملا الشكل والقيمة العظمى',
 summary:'القيمة المتوسطة هي المساحة تحت المنحنى مقسومة على الزمن (صفر لدورة جيبية كاملة و 0.637 Vm لنصف دورة)، والقيمة الفعالة هي التيار المستمر الذي يعطي نفس الحرارة في مقاومة: Vrms = Vm/√2 = 0.707 Vm. ثم الموجة المشوهة ومعامل الشكل ومعامل القيمة العظمى (الجدول 1-1). مع المثالين 1-1-5 و1-1-6.',
 theory:[
  {h:'1-1-7 القيمة المتوسطة (Average Value)',ref:'ص 14',html:`<p>تعرف القيمة المتوسطة خلال الفترة الزمنية \\(T_0\\) لأي دالة \\(a(t)\\) تتغير مع الزمن بالمعادلة</p>
   $$A_{av}=\\frac{1}{T_0}\\int_0^{T_0}a(t)\\,dt \\qquad (1\\text{-}5)$$
   <p>وهي <b>المساحة المحصورة بين منحنى الدالة والمحور الأفقي مقسومة على الفترة الزمنية</b> التي نحسب خلالها هذه القيمة المتوسطة. وتجدر الإشارة إلى أن المساحة تعتبر <b>موجبة</b> إذا كان المنحنى فوق المحور الأفقي وتعتبر <b>سالبة</b> إذا كان المنحنى تحته.</p>`},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب:</b> لا تخف من علامة التكامل \\(\\int\\): معناها هنا «المساحة تحت المنحنى». في المختبر ترى المساحة الموجبة والسالبة ملونتين، والحاسبة تجمعها لك.'},
  {h:'مثال 1-1-5',ref:'ص 14',html:`<p>أوجد القيمة المتوسطة للجهد الجيبي المبين في الشكل 1-3 خلال: أ- دورة كاملة T. ب- نصف دورة T/2.</p>
   <p><b>الحل:</b> أ- بما أن المساحة الموجبة لموجة الجهد تساوي المساحة السالبة خلال دورة كاملة نستنتج أن <b>القيمة المتوسطة للجهد الجيبي خلال دورة كاملة تساوي الصفر</b>.</p>
   <p>ب- خلال نصف دورة نعوض \\(T_0\\) بـ \\(T/2\\) في المعادلة 1-5:</p>
   $$V_{av}=\\frac{1}{T/2}\\int_0^{T/2}V_m\\sin(\\omega t+\\theta_v)\\,dt=\\frac{2}{\\pi}V_m=0.637\\,V_m$$`},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب:</b> النتيجة \\(\\frac{2}{\\pi}V_m\\) صحيحة عندما يبدأ نصف الدورة من الصفر (أي \\(\\theta_v=0\\)، النصف الموجب كاملاً)، وهذا ما يقصده الكتاب.'},
  {h:'القيمة الفعالة (Effective Value)',ref:'ص 14–15',html:`<p>نعرف القيمة الفعالة لتيار متردد بأنها <b>القيمة التي تنتج نفس القدرة الحرارية في مقاومة R كالتي ينتجها تيار مستمر معين</b>. بما أن قيمة التيار المتردد تتغير، فإن القدرة الحرارية الناتجة هي القدرة المتوسطة (خلال دورة T) والتي تساوي</p>
   $$P_{ac}=\\frac{1}{T}\\int_0^{T}R\\,i(t)^2\\,dt$$
   <p>أما القدرة التي ينتجها تيار مستمر \\(I_{dc}\\) فهي \\(P_{dc}=R\\,I_{dc}^2\\). بما أن \\(P_{ac}=P_{dc}\\) نستنتج أن</p>
   $$I_{dc}=\\sqrt{\\frac{1}{T}\\int_0^{T}i(t)^2\\,dt} \\qquad (1\\text{-}6)$$
   <p>ونرمز للقيمة الفعالة (التي تساوي \\(I_{dc}\\)) بالرمز \\(I\\) أو \\(I_{rms}\\). والرمز الأخير يعني <b>الجذر التربيعي لمتوسط مربع التيار</b> <span class="ltr">(Root Mean Square)</span> والتسمية مستخرجة من المعادلة 1-6. وبنفس الطريقة نعرف القيمة الفعالة للجهد:</p>
   $$V_{rms}=\\sqrt{\\frac{1}{T}\\int_0^{T}v(t)^2\\,dt} \\qquad (1\\text{-}7)$$
   <p>وباستعمال المعادلة 1-7 نستنتج أن</p>
   $$V_{rms}=\\frac{V_m}{\\sqrt2}=0.707\\,V_m \\qquad (1\\text{-}8)$$ $$I_{rms}=\\frac{I_m}{\\sqrt2}=0.707\\,I_m \\qquad (1\\text{-}9)$$`},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب:</b> عندما نقول «جهد المنزل <span class="ltr">220 V</span>» فهذه قيمة فعالة، وقيمته العظمى \\(220\\times\\sqrt2\\approx311\\ \\text{V}\\). وأجهزة القياس العادية تقرأ القيمة الفعالة.'},
  {h:'تجربة قياس القيمة الفعالة',ref:'ص 15–16',html:'<p>نستطيع قياس القيمة الفعالة لتيار متردد بإجراء التجربة الموضحة في الشكل 1-6: نأخذ مقاومة R معلومة القيمة ونغمرها في إناء مملوء بالماء ثم نوصلها إلى مصدر تيار مستمر ذي جهد معلوم بإغلاق <b>المفتاح 1</b>، وعندئذ يمر التيار المستمر I وقيمته V/R، وترتفع درجة حرارة الماء إلى قيمة معينة. بعد ذلك نفتح المفتاح 1 ونترك الماء يبرد ويرجع إلى حرارته قبل بدء التجربة. ثم نغلق <b>المفتاح 2</b> ونزيد في القيمة العظمى لجهد مصدر التيار المتردد حتى تصل درجة حرارة الماء إلى <b>نفس القيمة</b> التي وصلت إليها عند تطبيق التيار المستمر. عندئذ تكون القيمة العظمى للتيار المتردد تساوي \\(I/0.707\\) حسب المعادلة 1-9.</p>'},
  {fig:'1-6',ref:'ص 16',caption:'تجربة لقياس القيمة الفعالة لتيار متردد: مصدر تيار مستمر عبر المفتاح 1، ومصدر تيار متردد عبر المفتاح 2، ومقاومة R مغمورة في إناء ماء فيه مقياس حرارة. جرّبها في المختبر.',draw:()=>box(heatSVG({}),470)},
  {h:'مثال 1-1-6',ref:'ص 16',html:'<p>في الشكل 1-6 إذا كانت \\(R=50\\ \\Omega\\) وجهد التيار المستمر \\(V_{dc}=220\\ \\text{V}\\): \\(I_{dc}=220/50=4.4\\ \\text{A}\\)، والقيمة الفعالة للتيار المتردد \\(I_{rms}=I_{dc}=4.4\\ \\text{A}\\)، وقيمته العظمى \\(I_m=\\sqrt2\\times4.4=6.2\\ \\text{A}\\)، والقدرة \\(P=R\\,I^2=50\\times4.4^2=968\\ \\text{W}\\). (الحل التفصيلي في تبويب «الأمثلة المحلولة».)</p>'},
  {h:'1-1-8 معامل الشكل ومعامل القيمة العظمى',ref:'ص 17',html:'<p>نسعى دائماً لتوليد الجهود المترددة ذات الموجات الجيبية، وذلك لأنها الأحسن في الاستعمال من حيث التقليل من مفاقيد القدرة وغير ذلك. ولكن ولأسباب عدة تكون موجات التيارات والجهود غير جيبية، وفي هذه الحالة نقول إن <b>الموجة مشوهة</b>. ويوضح الشكل 1-7 مثالاً لموجة مشوهة، وكلما كان شكل الموجة قريباً من الشكل الجيبي كانت درجة التشويه أقل.</p><p>وهناك قانون «فورييه» <span class="ltr">(Fourier)</span> ينص على أن أي موجة مترددة يمكن أن تعوض بموجة جيبية لها نفس تردد الموجة الأصلية تسمى <b>المكونة الأساسية</b>، مضافاً إليها مجموعة موجات ذات ترددات مضاعفة للتردد الأصلي ولكن ذات قيم عظمى أقل.</p>'},
  {fig:'1-7',ref:'ص 17',caption:'موجة جهد مترددة غير جيبية: قمة مسطحة قليلاً وانحناءات عند الكتفين، والنصف السالب مماثل للموجب. (رسمناها هنا موجة جيبية مضافاً إليها مكونة بثلاثة أضعاف ترددها — جرّب ذلك في المختبر.)',draw:()=>box(fig17(),520)},
  {html:`<p>نعرف <b>معامل الشكل</b> بأنه النسبة بين القيمة الفعالة والقيمة المتوسطة للموجة، ونعرف <b>معامل القيمة العظمى</b> بالنسبة بين القيمة العظمى والقيمة الفعالة للموجة:</p>
   $$FR=\\frac{V_{rms}}{V_{av}} \\qquad\\qquad PR=\\frac{V_m}{V_{rms}}$$
   <p>ويعطي الجدول 1-1 معاملات القيمة العظمى لبعض الموجات المترددة.</p>`},
  {h:'الجدول 1-1: معامل القيمة العظمى لبعض الموجات',ref:'ص 18',html:`<div class="ca-tbl"><table class="tt"><thead><tr><th>اسم الموجة</th><th>شكل الموجة</th><th>معامل القيمة العظمى</th></tr></thead><tbody>${['sine','full','half','tri','sq'].map(k=>`<tr><td>${WAVES[k].n}</td><td>${miniWave(WAVES[k].f)}</td><td><b class="ltr">${WAVES[k].pr}</b></td></tr>`).join('')}</tbody></table></div>`},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب:</b> للموجة الجيبية \\(FR=\\frac{0.707V_m}{0.637V_m}=1.11\\) و \\(PR=\\sqrt2=1.414\\). القيمة المتوسطة للموجة المترددة تؤخذ لنصف دورة (لأن متوسط الدورة الكاملة صفر)، أما للموجات الموحدة فلدورة كاملة. وفي المختبر تحسب المعاملين لكل موجة.'},
  {err:L3_ERR}
 ],
 lab:(el)=>{
  let wk='sine',Vm=100,k3=0.18,sq=1,s1=0,s2=0,Vdc=220,R=50,Vac=0,Tw=null,Trec=null;const did={};
  el.innerHTML=ar(`<div id="l3tp"></div><div class="grid ca-lab">
   <div class="panel c12"><h2>محلل الموجات <small>مبني على المعادلات 1-5 إلى 1-8 والجدول 1-1 والشكل 1-7 ص 14–18</small></h2>
    <div class="ca-row">${segHTML('wv',Object.keys(WAVES).map(k=>[k,WAVES[k].n]),wk)}</div>
    <div class="grid"><div class="c4">${sl('l3Vm','القيمة العظمى V<sub>m</sub>',1,400,1,Vm)}<div id="l3kb">${sl('l3k','مقدار المكونة ذات التردد الثلاثي (فورييه)',-0.3,0.3,0.01,k3)}</div>
     <div class="ca-row">${swHTML('l3sq','v²','أظهر مربع الجهد',1)}</div></div>
     <div class="c8"><div class="facts">${fact('V<sub>av</sub> لدورة كاملة','l3a1')}${fact('<span id="l3avl">V<sub>av</sub> لنصف دورة</span>','l3a2')}${fact('V<sub>rms</sub> (1-7)','l3r')}${fact('FR = V<sub>rms</sub>/V<sub>av</sub>','l3fr')}${fact('PR = V<sub>m</sub>/V<sub>rms</sub>','l3pr')}${fact('PR في الجدول 1-1','l3tb')}</div></div></div>
    <div class="grid"><div class="c6"><div class="svgbox" id="l3w"></div></div><div class="c6"><div class="svgbox" id="l3w2"></div></div></div>
    <p class="sub">يمين: الموجة والمساحة تحتها (المساحة فوق المحور موجبة وتحته سالبة) وخط القيمة المتوسطة. يسار: مربع الجهد v² ومتوسطه؛ الجذر التربيعي لهذا المتوسط هو القيمة الفعالة.</p></div>
   <div class="panel c7"><h2>تجربة الحوض <small>الشكل 1-6 ومثال 1-1-6 ص 15–16</small></h2>
    <div class="svgbox" id="l3h" style="max-width:470px;margin-inline:auto"></div>
    <p class="sub">اضغط على المفتاح في الرسم أو على الأزرار. أرقام تسخين الماء توضيحية (ليست من الكتاب)، أما V<sub>dc</sub> و R فمن مثال 1-1-6.</p>
    <div class="ca-row"><button class="btn" id="l3b1">المفتاح 1</button><button class="btn" id="l3b2">المفتاح 2</button><button class="btn" id="l3rec">سجّل درجة الحرارة</button><button class="btn" id="l3cool">برّد الماء فوراً</button></div><div id="l3warn"></div></div>
   <div class="panel c5"><h2>المصادر والقراءات</h2>${sl('l3Vdc','جهد المصدر المستمر V<sub>dc</sub>',0,300,1,Vdc)}${sl('l3R','المقاومة R',5,200,1,R)}${sl('l3Vac','القيمة العظمى لجهد المصدر المتردد V<sub>m</sub>',0,450,0.5,Vac)}
    <div class="ca-fine">${[-10,-1,-0.5,0.5,1,10].map(k=>`<button class="btn" data-fv="${k}">${k>0?'+':''}${k}</button>`).join('')}</div>
    <div class="facts">${fact('التيار المار','l3I')}${fact('القدرة الحرارية','l3P')}${fact('حرارة الماء','l3T')}${fact('الحرارة المسجلة (مستمر)','l3Tr')}${fact('I<sub>m</sub> للتيار المتردد','l3Im')}${fact('I<sub>rms</sub> = 0.707 I<sub>m</sub>','l3Ir')}</div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l3st"></ol></div></div>`);
  B.math(el);const $=s=>el.querySelector(s);
  const TP=B.params($('#l3tp'),'u1-l3',[
   {k:'Tamb',label:'حرارة الماء في البداية',unit:'°C',value:25,min:0,max:60},
   {k:'kth',label:'ارتفاع حرارة الماء لكل واط',unit:'°C/W',value:0.02,min:0.001,max:1,step:0.001},
   {k:'tau',label:'ثابت زمن تسخين الماء وتبريده',unit:'s',value:6,min:0.5,max:120,step:0.5}],()=>{if(Tw!=null&&!s1&&!s2)Tw=TP.v.Tamb});
  Tw=TP.v.Tamb;
  const fn=()=>wk==='dist'?distF(k3):WAVES[wk].f;
  const wdraw=()=>{const W=WAVES[wk],f=fn(),st=waveStats(f,W.alt);$('#l3kb').style.display=wk==='dist'?'':'none';
   $('#l3Vm-v').textContent=Vm+' V';$('#l3k-v').textContent=fm(k3,2);
   $('#l3avl').innerHTML=W.alt?'V<sub>av</sub> لنصف دورة':'V<sub>av</sub> (الموجة موحدة)';
   $('#l3a1').textContent=fm(rd(st.avFull*Vm,2))+' V';$('#l3a2').textContent=fm(rd(st.av*Vm,2))+' V = '+fm(rd(st.av,3))+' Vm';$('#l3r').textContent=fm(rd(st.rms*Vm,2))+' V = '+fm(rd(st.rms,3))+' Vm';
   $('#l3fr').textContent=fm(rd(st.FR,3));$('#l3pr').textContent=fm(rd(st.PR,3));$('#l3tb').textContent=W.pr+(W.prv?' = '+fm(rd(W.prv,3)):'');
   const ym=niceMax(Vm*1.05),pts=Array.from({length:401},(_,i)=>{const x=i/400*2;return [x,Vm*f(x%1)]});
   $('#l3w').innerHTML=plotSVG({w:520,h:230,x0:0,x1:2,y0:-ym,y1:ym,xt:[0,0.5,1,1.5,2],xf:v=>v===0?'0':v===1?'T':v===2?'2T':v===0.5?'T/2':'3T/2',yt:[-ym,0,ym],xl:'t',yl:'v (V)',cid:'l3c1',
    under:(X,Y)=>{let pp='',pn='';pts.forEach(([x,v],i)=>{pp+=(i?'L':'M')+fx(X(x))+' '+fx(Y(Math.max(v,0)));pn+=(i?'L':'M')+fx(X(x))+' '+fx(Y(Math.min(v,0)))});return `<path d="${pp}L${X(2)} ${Y(0)}L${X(0)} ${Y(0)}Z" fill="var(--blue-soft)"/><path d="${pn}L${X(2)} ${Y(0)}L${X(0)} ${Y(0)}Z" fill="var(--live-soft)"/>`},
    series:[{pts,col:'--live',w:2.2}],extra:(X,Y)=>`<path d="M${X(0)} ${fx(Y(st.av*Vm))}H${X(2)}" stroke="var(--blue)" stroke-width="1.6" stroke-dasharray="6 4"/>`+S.t(X(2)-4,fx(Y(st.av*Vm)-5),'Vav','b','end')+`<path d="M${X(0)} ${fx(Y(st.rms*Vm))}H${X(2)}" stroke="var(--on)" stroke-width="1.6" stroke-dasharray="2 3"/>`+S.t(X(0)+30,fx(Y(st.rms*Vm)-5),'Vrms','','start')});
   const y2=niceMax(Vm*Vm*1.05);
   $('#l3w2').innerHTML=sq?plotSVG({w:520,h:230,x0:0,x1:2,y0:0,y1:y2,xt:[0,1,2],xf:v=>v===0?'0':v===1?'T':'2T',yt:[0,y2/2,y2],yf:v=>fm(rd(v,0)),xl:'t',yl:'v² (V²)',cid:'l3c2',left:58,
    under:(X,Y)=>`<path d="${pts.map(([x,v],i)=>(i?'L':'M')+fx(X(x))+' '+fx(Y(v*v))).join('')}L${X(2)} ${Y(0)}L${X(0)} ${Y(0)}Z" fill="var(--on-soft)"/>`,
    series:[{pts:pts.map(([x,v])=>[x,v*v]),col:'--on',w:2}],extra:(X,Y)=>`<path d="M${X(0)} ${fx(Y(st.rms*st.rms*Vm*Vm))}H${X(2)}" stroke="var(--fg)" stroke-width="1.6" stroke-dasharray="6 4"/>`+S.t(X(2)-4,fx(Y(st.rms*st.rms*Vm*Vm)-5),'mean(v²) = '+fm(rd(st.rms*st.rms*Vm*Vm,1)),'','end')}):'<p class="sub">شغّل «v²» لترى مربع الجهد.</p>';
   if(wk==='sq')did.sq=1;if(wk==='half')did.half=1;if(wk==='dist')did.dist=1;};
  segBind(el,'wv',v=>{wk=v;wdraw()});$('#l3Vm').oninput=e=>{Vm=+e.target.value;wdraw()};$('#l3k').oninput=e=>{k3=+e.target.value;did.k=1;wdraw()};
  $('#l3sq').onclick=()=>{sq=sq?0:1;$('#l3sq').setAttribute('aria-pressed',sq?'true':'false');wdraw()};
  const warn=m=>{$('#l3warn').innerHTML=m?`<div class="callout err">${m}</div>`:''};
  const tog=n=>{if(n===1){if(!s1&&s2){warn('افتح المفتاح 2 أولاً: لا نوصل المصدرين معاً على المقاومة.');return}s1=!s1;if(s1)did.s1=1}else{if(!s2&&s1){warn('افتح المفتاح 1 أولاً، واترك الماء يبرد قبل تجربة التيار المتردد.');return}s2=!s2;if(s2)did.s2=1}warn('')};
  $('#l3b1').onclick=()=>tog(1);$('#l3b2').onclick=()=>tog(2);$('#l3h').addEventListener('click',e=>{const g=e.target.closest('[data-sw]');if(g)tog(+g.dataset.sw)});
  $('#l3rec').onclick=()=>{if(!s1){warn('سجّل درجة الحرارة وأنت تستعمل التيار المستمر (المفتاح 1 مغلق).');return}Trec=Tw;did.rec=1;warn('')};
  $('#l3cool').onclick=()=>{Tw=TP.v.Tamb;did.cool=1};
  $('#l3Vdc').oninput=e=>{Vdc=+e.target.value};$('#l3R').oninput=e=>{R=+e.target.value};$('#l3Vac').oninput=e=>{Vac=+e.target.value};
  el.addEventListener('click',e=>{const b=e.target.closest('[data-fv]');if(b){Vac=clamp(rd(Vac+ +b.dataset.fv,1),0,450);$('#l3Vac').value=Vac}});
  const steps=stepsUI($('#l3st'),[
   {t:'القيمة المتوسطة للجيبية',x:'اختر «جيبية»: متوسط الدورة الكاملة صفر (المساحتان متساويتان)، ومتوسط نصف الدورة \\(0.637\\,V_m\\) (مثال 1-1-5). والقيمة الفعالة \\(0.707\\,V_m\\).',done:()=>wk==='sine'},
   {t:'الجدول 1-1',x:'اختر «مربعة» ثم «نصف موجة موحدة»: معامل القيمة العظمى 1 ثم 2، كما في الجدول.',done:()=>did.sq&&did.half},
   {t:'موجة مشوهة (فورييه)',x:'اختر «مشوهة» وحرّك المكونة ذات التردد الثلاثي: الموجة الأساسية + موجة ترددها ثلاثة أضعاف وقيمتها أصغر تعطي قمة مسطحة كالشكل 1-7، ويتغير المعاملان.',done:()=>did.dist&&did.k},
   {t:'التيار المستمر (مثال 1-1-6)',x:'أغلق <b>المفتاح 1</b> (\\(V_{dc}=220\\ \\text{V}\\) و \\(R=50\\ \\Omega\\)): التيار <span class="ltr">4.4 A</span> والقدرة <span class="ltr">968 W</span>. انتظر حتى تستقر حرارة الماء ثم اضغط «سجّل درجة الحرارة».',done:()=>did.rec&&Trec!=null},
   {t:'برّد الماء',x:'افتح المفتاح 1 واترك الماء يبرد (أو اضغط «برّد الماء فوراً»).',done:()=>!s1&&Math.abs(Tw-TP.v.Tamb)<0.3},
   {t:'التيار المتردد',x:'أغلق <b>المفتاح 2</b> وزد القيمة العظمى للجهد المتردد حتى تصل حرارة الماء إلى الحرارة المسجلة. ستجد \\(V_m\\approx311\\ \\text{V}\\) أي \\(I_m=6.22\\ \\text{A}\\) = \\(4.4/0.707\\): القيمة الفعالة للتيار المتردد هي <span class="ltr">4.4 A</span> نفسها.',done:()=>s2&&Trec!=null&&Math.abs(Vac/R/SQ2-Vdc/R)<0.01*Vdc/R+1e-9&&Math.abs(Tw-Trec)<0.3}
  ]);
  wdraw();
  loopOn(el,dt=>{const P=s1?Vdc*Vdc/R:s2?(Vac/SQ2)*(Vac/SQ2)/R:0,Tss=TP.v.Tamb+TP.v.kth*P;Tw+=(Tss-Tw)*(1-Math.exp(-dt/TP.v.tau));
   $('#l3Vdc-v').textContent=Vdc+' V';$('#l3R-v').textContent=R+' Ω';$('#l3Vac-v').textContent=fm(Vac,1)+' V';
   $('#l3h').innerHTML=heatSVG({s1,s2,T:Tw,Tamb:TP.v.Tamb,Tmax:TP.v.Tamb+TP.v.kth*Math.max(1500,Vdc*Vdc/R*1.3)});
   $('#l3b1').textContent=s1?'افتح المفتاح 1':'أغلق المفتاح 1';$('#l3b2').textContent=s2?'افتح المفتاح 2':'أغلق المفتاح 2';
   const I=s1?Vdc/R:s2?Vac/R/SQ2:0;$('#l3I').textContent=s1?fm(rd(I,3))+' A (مستمر)':s2?fm(rd(I,3))+' A (فعال)':'0 A';$('#l3P').textContent=fm(rd(P,1))+' W';
   $('#l3T').textContent=fm(rd(Tw,1))+' °C';$('#l3Tr').textContent=Trec==null?'—':fm(rd(Trec,1))+' °C';$('#l3Im').textContent=fm(rd(Vac/R,3))+' A';$('#l3Ir').textContent=fm(rd(Vac/R/SQ2,3))+' A';
   steps.check()});
 },
 examples:[
  {title:'مثال 1-1-5',ref:'ص 14',q:'<p>أوجد القيمة المتوسطة للجهد الجيبي المبين في الشكل 1-3 خلال: أ- دورة كاملة T. ب- نصف دورة T/2.</p><p class="sub">الكتاب يحل بالرموز؛ اكتب قيمة \\(V_m\\) لترى الناتج بالفولت (القيمة 1 تعني الناتج بوحدات \\(V_m\\)).</p>',
   given:[{id:'Vm',label:'القيمة العظمى',sym:'V_m',unit:'V',value:1}],
   solve:g=>[{t:'أ- المساحة الموجبة تساوي المساحة السالبة خلال دورة كاملة:',f:'V_{av}(T)=0',v:0,unit:'V'},
    {t:'ب- نعوض \\(T_0=T/2\\) في المعادلة (1-5):',f:'V_{av}=\\frac{1}{T/2}\\int_0^{T/2}V_m\\sin\\omega t\\,dt=\\frac{2}{\\pi}V_m=0.637\\,V_m'},{t:'بالأرقام:',v:rd(0.637*g.Vm,3),unit:'V',final:true}]},
  {title:'مثال 1-1-6',ref:'ص 16',q:'<p>في الشكل 1-6 إذا كانت قيمة \\(R=50\\ \\Omega\\)، وكان جهد التيار المستمر \\(V_{dc}=220\\ \\text{V}\\)، احسب القيمة العظمى للتيار المتردد الذي ينتج نفس القدرة في المقاومة، واحسب قيمة هذه القدرة.</p>',
   given:[{id:'R',label:'المقاومة',sym:'R',unit:'Ω',value:50},{id:'V',label:'جهد التيار المستمر',sym:'V_{dc}',unit:'V',value:220}],
   solve:g=>{const I=rd(g.V/g.R,2);return [{t:'نحسب التيار المستمر بقانون أوم:',f:`I_{dc}=\\frac{V_{dc}}{R}=\\frac{${fm(g.V)}}{${fm(g.R)}}`,v:I,unit:'A'},
    {t:'القيمة الفعالة للتيار المتردد تساوي التيار المستمر الذي يعطي نفس القدرة:',f:'I_{rms}=I_{dc}',v:I,unit:'A'},
    {t:'القيمة العظمى بالمعادلة (1-9):',f:`I_m=\\sqrt2\\,I_{rms}=\\sqrt2\\times${fm(I)}`,v:rd(SQ2*I,1),unit:'A',final:true},
    {t:'القدرة الحرارية الناتجة في المقاومة:',f:`P=R\\,I^2=${fm(g.R)}\\times${fm(I)}^2`,v:rd(g.R*I*I,2),unit:'W',final:true}]},
   note:'الكتاب يقرب \\(I_m\\) إلى رقم عشري واحد (6.2 A)؛ القيمة الأدق 6.22 A.'}
 ],
 quiz:[
  {q:'القيمة المتوسطة لجهد جيبي خلال دورة كاملة:',o:['\\(0.637V_m\\)','\\(0.707V_m\\)','صفر','\\(V_m\\)'],c:2,e:'المساحة الموجبة تساوي السالبة (مثال 1-1-5).'},
  {q:'القيمة المتوسطة لجهد جيبي خلال نصف دورة:',o:['\\(0.637V_m\\)','\\(0.707V_m\\)','\\(1.414V_m\\)','صفر'],c:0,e:'\\(\\frac{2}{\\pi}V_m\\).'},
  {q:'القيمة الفعالة لتيار متردد هي:',o:['أكبر قيمة له','قيمة التيار المستمر الذي ينتج نفس القدرة الحرارية في نفس المقاومة','متوسط التيار خلال نصف دورة','قيمته عند t = 0'],c:1,e:'ص 14.'},
  {q:'جهد جيبي قيمته العظمى <span class="ltr">311 V</span>. قيمته الفعالة تقريباً:',o:['198 V','220 V','311 V','440 V'],c:1,e:'\\(311\\times0.707\\approx220\\).'},
  {q:'معنى الرمز rms:',o:['القيمة العظمى','الجذر التربيعي لمتوسط المربع','متوسط القيمة المطلقة','القيمة اللحظية'],c:1,e:'<span class="ltr">Root Mean Square</span> (ص 15).'},
  {q:'معامل القيمة العظمى PR هو:',o:['\\(V_{rms}/V_{av}\\)','\\(V_m/V_{rms}\\)','\\(V_{av}/V_m\\)','\\(V_m/V_{av}\\)'],c:1,e:'ص 17.'},
  {q:'حسب الجدول 1-1 معامل القيمة العظمى للموجة المربعة:',o:['1','√2','√3','2'],c:0,e:'الجدول 1-1 ص 18.'},
  {q:'حسب قانون فورييه، أي موجة مترددة تتكون من:',o:['موجة مستمرة فقط','مكونة أساسية بنفس التردد + موجات بترددات مضاعفة وقيم عظمى أقل','موجات بترددات أقل من الأصلي','موجة مربعة دائماً'],c:1,e:'ص 17.'}
 ]
});

/* ======================================================================
   Lesson 4 — phasors and complex algebra + chapter-1 problems
   ====================================================================== */
function fig18(){const v=phasorSVG({w:300,h:260,vecs:[{x:1.6*Math.cos(40*D),y:1.6*Math.sin(40*D),col:'--live',lb:'Vm'},{x:1.0*Math.cos(20*D),y:1.0*Math.sin(20*D),col:'--blue',lb:'Im'}],arcs:[{a0:0,a1:40,r:62,lb:'θv',col:'--live'},{a0:0,a1:20,r:40,lb:'θi',col:'--blue'}],axes:['',''],fixed:{xmin:-0.3,xmax:1.8,ymin:-0.4,ymax:1.4}});
  const w=plotSVG({w:420,h:260,x0:-60,x1:400,y0:-1.25,y1:1.25,xt:[0,90,180,270,360],xf:v=>v+'°',yt:[],xl:'α',cid:'c18',series:[{pts:Array.from({length:231},(_,i)=>{const a=-60+i*2;return [a,Math.sin((a+40)*D)]}),col:'--live'},{pts:Array.from({length:231},(_,i)=>{const a=-60+i*2;return [a,0.95*Math.sin((a+20)*D)]}),col:'--blue'}],
   extra:(X,Y)=>arrow(X(-40),Y(0)-8,X(0),Y(0)-8,'--live',1.4)+S.t(X(-20),Y(0)-14,'θv','')+arrow(X(-20),Y(0)+10,X(0),Y(0)+10,'--blue',1.4)+S.t(X(-10),Y(0)+26,'θi','')+S.t(X(50),Y(1)-4,'V','')+S.t(X(70),Y(0.95)+16,'I','')});
  return `<div class="grid"><div class="c5">${box(v,300)}</div><div class="c7">${box(w,420)}</div></div>`}
function fig19(){return phasorSVG({w:300,h:250,vecs:[{x:2,y:0,col:'--live',lb:'A',lbOff:12},{x:0,y:3.4,col:'--live',lb:'B'},{x:2,y:3.4,col:'--live',lb:'C'}],arcs:[{a0:0,a1:59.5,r:34,lb:'θ'}],axes:['Real','Imaginary'],fixed:{xmin:-0.5,xmax:3,ymin:-0.4,ymax:4},
  extra:(X,Y)=>`<path d="M${X(2)} ${Y(0)}V${Y(3.4)}H${X(0)}" fill="none" stroke="var(--blue)" stroke-dasharray="5 4"/>`})}
function fig110(){return phasorSVG({w:300,h:250,vecs:[{x:2.5,y:0.9,col:'--blue',lb:'C1'},{fx:2.5,fy:0.9,x:0.9,y:2.5,col:'--stop',lb:'C2'},{x:3.4,y:3.4,col:'--live',lb:'C'}],axes:['Real','Imag'],fixed:{xmin:-0.4,xmax:4,ymin:-0.4,ymax:4}})}

const L4_ERR=`<b>ملاحظات على الكتاب (هذا الدرس):</b><ol style="margin:6px 0 0;padding-inline-start:20px">
 <li>ص 21: طُبعت قاعدة الجمع والطرح \\(C=C_1\\pm C_2=(A_1+A_2)\\pm j(B_1+B_2)\\)، والصحيح \\((A_1\\pm A_2)+j(B_1\\pm B_2)\\) كما كتبناها أعلاه، وكما يطبقها الكتاب نفسه في مثال 1-1-8.</li>
 <li>مثال 1-1-8 ص 24: سقطت الفواصل العشرية في الطباعة («A=2045 cos1913=−2005 ; B=2045 sin1913=−401») والمقصود \\(A=204.5\\cos191.3^\\circ=-200.5\\) و \\(B=-40.1\\)؛ وكُتبت «2,19» و«j1,58» بفاصلة والمقصود 2.19 و 1.58.</li>
 <li>مثال 1-1-8: نتيجة الضرب \\(204.5\\angle191.3^\\circ\\) جاءت من تقريب \\(|C_1|=23.5\\) و \\(|C_2|=8.7\\) قبل الضرب؛ الضرب المباشر بالصيغة المتعامدة يعطي \\(-201.5-j40.5=205.5\\angle191.4^\\circ\\). ليس خطأ بل أثر التقريب (المختبر يحسب بلا تقريب).</li>
 <li>مسائل الفصل ص 25: صياغة السؤالين 1 و2 «احسب دورة الزمن الدوري (T) مترددة جيبية…» ناقصة، والمقصود «احسب الزمن الدوري لموجة مترددة جيبية…». وفي السؤال 2 يقول النص «100 دورة» والرسم يبين 4 دورات في <span class="ltr">20 ms</span>؛ أعطينا الجوابين.</li></ol>`;
const waveQ=(n,A,w,ph,ty)=>({title:`مسائل الفصل الأول — س4 وس5: الموجة ${n} — إجابة مقترحة (ليست من الكتاب)`,ref:'ص 25',
  q:`<p>احسب القيمة القصوى والتردد والطور في بداية الزمن للموجة \\(${A<0?'-':''}${fm(Math.abs(A))}\\,${ty===2?'\\cos':'\\sin'}(${fm(w)}t${ph?'+'+fm(ph)+'^\\circ':''})\\)، ثم قيمتها الفعالة إذا كانت جهداً.</p>`,
  given:[{id:'A',label:'الرقم أمام الدالة (بإشارته)',sym:'',unit:'V',value:A},{id:'w',label:'التردد الزاوي',sym:'\\omega',unit:'rad/s',value:w},{id:'ph',label:'الزاوية المضافة',sym:'',unit:'°',value:ph},{id:'ty',label:'نوع الدالة (1 = sin، 2 = cos)',sym:'',unit:'',value:ty,step:1,min:1,max:2}],
  solve:g=>{const Vm=Math.abs(g.A),f=g.w/(2*PI);let th=g.ph+(g.ty===2?90:0)+(g.A<0?180:0);th=nAng(th);const out=[
   {t:'القيمة القصوى = القيمة المطلقة للرقم أمام الدالة:',f:`V_m=${fm(Vm)}`,v:Vm,unit:'V'},
   {t:'التردد من \\(\\omega=2\\pi f\\):',f:`f=\\frac{\\omega}{2\\pi}=\\frac{${fm(g.w)}}{2\\pi}`,v:rd(f,2),unit:'Hz'}];
   if(g.ty===2)out.push({t:'نكتب cos بدلالة sin: \\(\\cos x=\\sin(x+90^\\circ)\\) (توضيح للمتدرب — ليس من الكتاب).'});
   if(g.A<0)out.push({t:'الإشارة السالبة تعني إزاحة \\(180^\\circ\\): \\(-\\sin x=\\sin(x+180^\\circ)\\).'});
   out.push({t:'الطور في بداية الزمن (بالنسبة لدالة sin):',v:th,unit:'°'},{t:'س5 — القيمة الفعالة بالمعادلة (1-8):',f:`V_{rms}=\\frac{${fm(Vm)}}{\\sqrt2}`,v:rd(Vm/SQ2,2),unit:'V',final:true});return out}});

lesson({
 id:'u1-l4',unit:1,order:4,pages:'18–25',
 title:'المطاور (Phasor) وجبر الأعداد المركبة',
 summary:'نمثل الجهد أو التيار الجيبي بمتجه طوله القيمة الفعالة وزاويته الطور الابتدائي: V = V∠θv، أو بعدد مركب V cos θv + jV sin θv. ثم جبر الأعداد المركبة: الجمع والطرح بالصيغة المتعامدة، والضرب والقسمة بالصيغة القطبية. مع المثالين 1-1-7 و1-1-8 ومسائل الفصل الأول.',
 theory:[
  {h:'1-1-9 التمثيل الاتجاهي والمطاور (Phasor)',ref:'ص 18–19',html:`<p>لكي يتم تطبيق قانون أوم (وقوانين كيرشوف) في دوائر التيار المتردد بطريقة سهلة نستعمل مفهوم <b>الجهد المطاور والتيار المطاور</b> ومفهوم <b>المعاوقة المركبة</b>. لقد رأينا من قبل (الشكل 1-5) أننا نستطيع تمثيل الجهد (أو التيار) الجيبي بمتجه يساوي قياسه القيمة القصوى للجهد ويدور بسرعة زاوية تساوي التردد الزاوي لهذا الجهد.</p>
   <p>وبما أن كل تيارات وجهود الدائرة لها نفس التردد الزاوي، فإن متجهاتها تدور بنفس السرعة، وبهذا <b>تبقى الزاوية الفاصلة بين أي متجهين ثابتة</b> بالنسبة للزمن وتساوي قيمتها عند الزمن \\(t=0\\). ولتسهيل الحسابات <b>نرسم كل المتجهات عند بداية الزمن</b>. ويمثل الشكل 1-8 العلاقة بين الكميات الجيبية v و i ومتجهاتها \\(V_m\\) و \\(I_m\\)، حيث إن طوري v و i عند بداية الزمن هما \\(\\theta_v\\) و \\(\\theta_i\\).</p>`},
  {fig:'1-8',ref:'ص 19',caption:'العلاقة بين موجتي الجهد والتيار ومتجهاتهما: المتجه V<sub>m</sub> بزاوية θ<sub>v</sub> والمتجه I<sub>m</sub> بزاوية θ<sub>i</sub> (هنا θ<sub>v</sub> &gt; θ<sub>i</sub> فالجهد متقدم على التيار)، وكل موجة تبدأ قبل الأصل بزاوية طورها.',draw:fig18},
  {html:`<p>وعلماً بأننا نستعمل <b>القيم الفعالة</b> للجهود والتيارات في تحليل الدوائر عوضاً عن القيم القصوى وذلك لاعتبارات القدرة، فإنه من الأفضل أخذ القيمة الفعالة كطول للمتجه (أي نقسم قيم المتجهات على \\(\\sqrt2\\)). وفي هذه الحالة نرمز لمتجه v بالرمز <b>V</b> بدلاً من <b>V<sub>m</sub></b>.</p>
   <p>ونستطيع تمثيل متجه الجهد (أو التيار) بعدد مركب، قيمته الحقيقية هي إحداثية المتجه على المحور الأفقي وقيمته التخيلية هي إحداثيته على المحور العمودي، يسمى <b>الجهد (أو التيار) المطاور</b>. وهكذا نحول الجهد الجيبي إلى الجهد المطاور:</p>
   $$v(t)=V_m\\sin(\\omega t+\\theta_v)=V\\sqrt2\\sin(\\omega t+\\theta_v)\\quad\\Rightarrow\\quad \\mathbf{V}=V\\angle\\theta_v \\qquad (1\\text{-}10)$$
   <p>حيث V مقياس الجهد المطاور (القيمة الفعالة) و \\(\\theta_v\\) إزاحته الزاوية. هذه هي <b>الصيغة القطبية</b> <span class="ltr">(Polar)</span> وهي تسهل الضرب والقسمة. أما <b>الصيغة المتعامدة</b> <span class="ltr">(Rectangular)</span> التي تسهل الجمع والطرح فهي</p>
   $$\\mathbf{V}=V\\cos\\theta_v+jV\\sin\\theta_v \\qquad (1\\text{-}11)$$
   <p>حيث \\(j=\\sqrt{-1}\\). ويسمى المخطط المبين للجهود والتيارات المطاورة في دائرة ما <b>بالشكل المطاور</b> <span class="ltr">(Phasor Diagram)</span>.</p>
   <p><b>مثال 1-1-7:</b> الجهد المطاور للجهد \\(v(t)=141.4\\sin(377t+30^\\circ)\\ \\text{V}\\): القيمة الفعالة \\(V=141.4/\\sqrt2=100\\ \\text{V}\\)، إذن \\(\\mathbf{V}=100\\angle30^\\circ\\ \\text{V}\\).</p>`},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب:</b> المطاور لا يحمل التردد؛ فهو يصلح فقط لمقارنة كميات لها <b>نفس التردد</b>. ولكي ترجع من المطاور إلى الموجة: اضرب الطول في \\(\\sqrt2\\) وأضف \\(\\omega t\\) إلى الزاوية.'},
  {h:'1-1-10 جبر المتجهات',ref:'ص 20–21',html:`<p>نحتاج في أغلب الحالات إلى الجمع أو الطرح أو الضرب أو القسمة بين التيارات والجهود المترددة. وبما أنها (والمعاوقات) تمثل بمتجهات أو أعداد مركبة وجب شرح جبر الأعداد المركبة. ويمكن تحليل المتجه C إلى المركبة A على المحور الأفقي <span class="ltr">(Real)</span> والمركبة B على المحور التخيلي <span class="ltr">(Imaginary)</span> كما في الشكل 1-9.</p>`},
  {fig:'1-9',ref:'ص 21',caption:'تمثيل متجه أو عدد مركب: المركبة الحقيقية A والتخيلية B والمتجه C بزاوية θ.',draw:()=>box(fig19(),300)},
  {html:`$$C=A+jB \\qquad (1\\text{-}12)$$ $$C=|C|(\\cos\\theta+j\\sin\\theta)=|C|\\angle\\theta \\qquad (1\\text{-}13)$$
   $$|C|=\\sqrt{A^2+B^2}\\ ;\\quad \\theta=\\tan^{-1}\\frac{B}{A} \\qquad (1\\text{-}14)$$ $$A=|C|\\cos\\theta\\ ;\\quad B=|C|\\sin\\theta \\qquad (1\\text{-}15)$$
   <p><b>جمع وطرح الأعداد المركبة:</b> يكون الجزء الحقيقي للناتج هو جمع (أو طرح) الأجزاء الحقيقية، ويكون الجزء التخيلي هو جمع (أو طرح) الأجزاء التخيلية:</p>
   $$C_1=A_1+jB_1\\ ;\\ C_2=A_2+jB_2\\ ;\\quad C=C_1\\pm C_2=(A_1\\pm A_2)+j(B_1\\pm B_2)$$
   <p>ولتسهيل الجمع والطرح نستعمل التمثيل المتعامد. ويمثل الشكل 1-10 جمع عددين مركبين بيانياً.</p>`},
  {fig:'1-10',ref:'ص 22',caption:'جمع عددين مركبين: نرسم C<sub>2</sub> من رأس C<sub>1</sub>، والمحصلة C من الأصل إلى رأس C<sub>2</sub>.',draw:()=>box(fig110(),300)},
  {html:`<p><b>ضرب وقسمة الأعداد المركبة:</b> في الضرب تكون القيمة المطلقة للناتج حاصل ضرب القيم المطلقة، وزاويته حاصل جمع الزوايا. وفي القسمة نقسم القيم المطلقة ونطرح الزوايا:</p>
   $$C=C_1\\times C_2=|C_1||C_2|\\angle(\\theta_1+\\theta_2) \\qquad C=\\frac{C_1}{C_2}=\\frac{|C_1|}{|C_2|}\\angle(\\theta_1-\\theta_2)$$
   <p>ولتسهيل الضرب والقسمة نستعمل التمثيل القطبي.</p>`},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب:</b> عند حساب \\(\\theta=\\tan^{-1}(B/A)\\) انتبه للربع: إذا كان A سالباً أضف \\(180^\\circ\\) لناتج الآلة الحاسبة. مثال: \\(-3.5+j8\\): الحاسبة تعطي \\(\\tan^{-1}(8/-3.5)=-66.4^\\circ\\)، والزاوية الصحيحة \\(-66.4+180=113.6^\\circ\\) (كما في مثال 1-1-8). وضرب \\(j\\times j=-1\\)، والضرب في j يدير المتجه \\(90^\\circ\\).'},
  {h:'مثال 1-1-8',ref:'ص 23–24',html:`<p>إذا كان \\(C_1=5+j23\\) و \\(C_2=-3.5+j8\\)، أوجد بالصيغتين: (1) \\(C_1+C_2\\) (2) \\(C_1-C_2\\) (3) \\(C_1C_2\\) (4) \\(C_1/C_2\\).</p>
   <div class="ca-tbl"><table class="tt"><thead><tr><th>العملية</th><th>المتعامدة</th><th>القطبية</th></tr></thead><tbody>
   <tr><td>الجمع</td><td class="ltr">1.5 + j31</td><td class="ltr">31.04∠87.2°</td></tr><tr><td>الطرح</td><td class="ltr">8.5 + j15</td><td class="ltr">17.2∠60.5°</td></tr>
   <tr><td>الضرب (\\(C_1=23.5\\angle77.7^\\circ\\)، \\(C_2=8.7\\angle113.6^\\circ\\))</td><td class="ltr">−200.5 − j40.1</td><td class="ltr">204.5∠191.3°</td></tr><tr><td>القسمة</td><td class="ltr">2.19 − j1.58</td><td class="ltr">2.7∠−35.9°</td></tr></tbody></table></div>
   <p class="sub">الحل خطوة بخطوة في تبويب «الأمثلة المحلولة»، وفي المختبر زر يضع العددين على المستوى المركب.</p>`},
  {h:'مسائل الفصل الأول',ref:'ص 25',html:[
    Q('السؤال 1','احسب الزمن الدوري (T) لموجة مترددة جيبية تكمل 4 دورات في زمن قدره <span class="ltr">30 ms</span>.','\\(T=30/4=7.5\\ \\text{ms}\\) (والتردد \\(1/7.5\\,\\text{ms}=133.3\\ \\text{Hz}\\)).'),
    Q('السؤال 2','احسب الزمن الدوري (T) لموجة مترددة جيبية تكمل 100 دورة في زمن قدره <span class="ltr">20 ms</span> كما في الشكل التالي.'+box(plotSVG({w:460,h:170,x0:0,x1:4.3,y0:-1.3,y1:1.3,xt:[1,2,3,4],yt:[],xl:'t',cid:'q2',series:[{pts:Array.from({length:401},(_,i)=>[i/100,Math.sin(2*PI*i/100)]),col:'--live',w:1.8}],extra:(X,Y)=>`<path d="M${X(0)} ${Y(-1.18)}H${X(1)}" stroke="var(--blue)" stroke-width="3"/>`+S.t(X(0.5),Y(-1.18)-5,'T','b')+`<path d="M${X(0)} ${Y(1.2)}H${X(4)}" stroke="var(--fg)" stroke-dasharray="2 3"/>`+S.t(X(2),Y(1.2)-4,'t = 20 ms','')}),460),'بنص السؤال (100 دورة): \\(T=20/100=0.2\\ \\text{ms}\\). وبحسب الرسم (4 دورات في 20 ms): \\(T=20/4=5\\ \\text{ms}\\). النص والرسم متعارضان في الكتاب.'),
    Q('السؤال 3','ما الزمن اللازم لموجة جيبية لتكمل 6 دورات إذا كان ترددها يساوي <span class="ltr">60 Hz</span>؟','\\(T=1/60=16.67\\ \\text{ms}\\)، فالزمن \\(6\\times T=6/60=0.1\\ \\text{s}\\).'),
    Q('السؤال 4','احسب القيمة القصوى والتردد وكذلك الطور في بداية الزمن للموجات: \\(8.4\\sin10000t\\) ؛ \\(100\\cos(754t+45^\\circ)\\) ؛ \\(-30\\sin942t\\) ؛ \\(50\\sin(314t+30^\\circ)\\).','<div class="ca-tbl"><table class="tt"><thead><tr><th>الموجة</th><th>V<sub>m</sub></th><th>f</th><th>الطور (بالنسبة لـ sin)</th></tr></thead><tbody><tr><td class="ltr">8.4 sin 10000t</td><td>8.4</td><td>1591.55 Hz</td><td>0°</td></tr><tr><td class="ltr">100 cos(754t + 45°)</td><td>100</td><td>120 Hz</td><td>135° (أو 45° بالنسبة لـ cos)</td></tr><tr><td class="ltr">−30 sin 942t</td><td>30</td><td>149.9 Hz</td><td>180°</td></tr><tr><td class="ltr">50 sin(314t + 30°)</td><td>50</td><td>49.97 ≈ 50 Hz</td><td>30°</td></tr></tbody></table></div>'),
    Q('السؤال 5','إذا كانت موجات المسألة الرابعة تمثل جهوداً، احسب القيمة الفعالة لكل منها.','\\(V=V_m/\\sqrt2\\): <span class="ltr">5.94 V</span> ، <span class="ltr">70.71 V</span> ، <span class="ltr">21.21 V</span> ، <span class="ltr">35.36 V</span>.')].join('')+'<p class="sub">لكل سؤال حاسبة في تبويب «الأمثلة المحلولة».</p>'},
  {err:L4_ERR}
 ],
 lab:(el)=>{
  let c1=Cx(5,23),c2=Cx(-3.5,8),op='+',drag=0,fixB=null,wVm=141.4,wTh=30;const did={};
  el.innerHTML=ar(`<div class="grid ca-lab">
   <div class="panel c7"><h2>المستوى المركب <small>مبني على الأشكال 1-9 و1-10 والمعادلات 1-12 إلى 1-15 ص 20–23</small></h2>
    <div class="ca-row">${segHTML('op',[['+','C1 + C2'],['-','C1 − C2'],['*','C1 × C2'],['/','C1 ÷ C2']],op)}</div>
    <div class="svgbox" id="l4p" style="max-width:460px;margin-inline:auto"></div>
    <p class="sub">اسحب رأس C<sub>1</sub> (الأخضر) أو C<sub>2</sub> (الأحمر) بالفأرة أو بإصبعك، أو اكتب الأرقام. الناتج C بالبرتقالي.</p>
    <div class="ca-row"><button class="btn" id="l4ex">ضع أعداد مثال 1-1-8</button></div></div>
   <div class="panel c5"><h2>الأرقام</h2>
    <div class="ca-num"><b style="color:var(--blue)">C<sub>1</sub> =</b><input type="number" step="0.5" id="l4a1"><span>+ j</span><input type="number" step="0.5" id="l4b1"></div>
    <div class="ca-num" style="margin-top:6px"><b style="color:var(--stop)">C<sub>2</sub> =</b><input type="number" step="0.5" id="l4a2"><span>+ j</span><input type="number" step="0.5" id="l4b2"></div>
    <div class="facts">${fact('C<sub>1</sub> قطبية (1-14)','l4p1')}${fact('C<sub>2</sub> قطبية (1-14)','l4p2')}${fact('الناتج C متعامدة','l4cr')}${fact('الناتج C قطبية','l4cp')}</div><div id="l4how" class="callout"></div></div>
   <div class="panel c12"><h2>لماذا نجمع المطاورات؟ <small>كل عدد مركب = موجة جيبية بتردد 60 Hz قيمتها الفعالة |C| وطورها θ</small></h2><div class="svgbox" id="l4w"></div><p class="sub" id="l4wn"></p></div>
   <div class="panel c12"><h2>من الموجة إلى المطاور <small>المعادلة 1-10 ومثال 1-1-7 ص 19–20</small></h2>
    <div class="grid"><div class="c6">${sl('l4Vm','القيمة العظمى V<sub>m</sub>',1,400,0.1,wVm)}${sl('l4th','زاوية الطور θ<sub>v</sub>',-180,180,1,wTh)}</div>
    <div class="c6"><div class="facts">${fact('الموجة','l4wv')}${fact('V = V<sub>m</sub>/√2','l4wr')}${fact('المطاور V∠θ<sub>v</sub>','l4wp')}${fact('الصيغة المتعامدة (1-11)','l4wq')}</div><div class="ca-row"><button class="btn" id="l4put">ضع المطاور في C<sub>1</sub></button></div></div></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l4st"></ol></div></div>`);
  B.math(el);const $=s=>el.querySelector(s);
  const res=()=>op==='+'?cadd(c1,c2):op==='-'?csub(c1,c2):op==='*'?cmul(c1,c2):cdiv(c1,c2);
  const bounds=()=>{const r=res();const m=Math.max(Math.abs(c1.re),Math.abs(c1.im),Math.abs(c2.re),Math.abs(c2.im),Math.abs(r.re),Math.abs(r.im),op==='+'||op==='-'?Math.abs(c1.re)+Math.abs(c2.re):0,op==='+'||op==='-'?Math.abs(c1.im)+Math.abs(c2.im):0,1);const M=niceMax(m*1.1);return {xmin:-M,xmax:M,ymin:-M,ymax:M}};
  const out={};
  const draw=()=>{const r=res(),bd=fixB||bounds(),M=bd.xmax;const vecs=[];
   if(op==='+'){vecs.push({fx:c1.re,fy:c1.im,x:c2.re,y:c2.im,col:'--stop',dash:'6 4',wd:1.8})}
   if(op==='-'){vecs.push({fx:c1.re,fy:c1.im,x:-c2.re,y:-c2.im,col:'--stop',dash:'6 4',wd:1.8,lb:'−C2'})}
   vecs.push({x:c1.re,y:c1.im,col:'--blue',lb:'C1'},{x:c2.re,y:c2.im,col:'--stop',lb:'C2'},{x:r.re,y:r.im,col:'--live',lb:'C',wd:3});
   const arcs=op==='*'||op==='/'?[{a0:0,a1:cang(c1),r:30,col:'--blue'},{a0:0,a1:cang(c2),r:44,col:'--stop'},{a0:0,a1:cang(r),r:58,col:'--live',lb:'θ'}]:[];
   const grid=M/5;
   let svg=phasorSVG({w:460,h:460,pad:20,vecs,arcs,fixed:bd,grid,out,axes:['Real','Imag'],
    extra:(X,Y)=>`<circle data-h="1" class="ca-drag" cx="${fx(X(c1.re))}" cy="${fx(Y(c1.im))}" r="13" fill="var(--blue)" fill-opacity=".22" stroke="var(--blue)"/><circle data-h="2" class="ca-drag" cx="${fx(X(c2.re))}" cy="${fx(Y(c2.im))}" r="13" fill="var(--stop)" fill-opacity=".22" stroke="var(--stop)"/>`+S.t(454,Y(0)+16,fm(M),'m','end')+S.t(X(0)-6,30,fm(M),'m','end')});
   $('#l4p').innerHTML=svg;
   const set=(id,v)=>{const e=$(id);if(document.activeElement!==e)e.value=rd(v,3)};set('#l4a1',c1.re);set('#l4b1',c1.im);set('#l4a2',c2.re);set('#l4b2',c2.im);
   $('#l4p1').textContent=fP(c1,2,1);$('#l4p2').textContent=fP(c2,2,1);$('#l4cr').textContent=fR(r,2);$('#l4cp').textContent=fP(r,2,1);
   const h={'+':`الجمع بالصيغة المتعامدة: \\((${fm(rd(c1.re,2))}${c2.re<0?'':'+'}${fm(rd(c2.re,2))})+j(${fm(rd(c1.im,2))}${c2.im<0?'':'+'}${fm(rd(c2.im,2))})\\). بيانياً: نرسم C<sub>2</sub> من رأس C<sub>1</sub> (الشكل 1-10).`,
    '-':`الطرح: \\((A_1-A_2)+j(B_1-B_2)\\) — أي نجمع C<sub>1</sub> مع المتجه المعكوس −C<sub>2</sub>.`,
    '*':`الضرب بالصيغة القطبية: \\(${fm(rd(cabs(c1),2))}\\times${fm(rd(cabs(c2),2))}\\angle(${fm(rd(cang(c1),1))}^\\circ${cang(c2)<0?'':'+'}${fm(rd(cang(c2),1))}^\\circ)\\): الأطوال تضرب والزوايا تجمع.`,
    '/':`القسمة بالصيغة القطبية: \\(\\frac{${fm(rd(cabs(c1),2))}}{${fm(rd(cabs(c2),2))}}\\angle(${fm(rd(cang(c1),1))}^\\circ-(${fm(rd(cang(c2),1))}^\\circ))\\): الأطوال تقسم والزوايا تطرح.`}[op];
   $('#l4how').innerHTML=h;B.math($('#l4how'));
   // waves
   const w=2*PI*60,T=1/60,f1=t=>SQ2*cabs(c1)*Math.sin(w*t+cang(c1)*D),f2=t=>SQ2*cabs(c2)*Math.sin(w*t+cang(c2)*D),fr=t=>SQ2*cabs(r)*Math.sin(w*t+cang(r)*D);
   if(op==='+'||op==='-'){const sg=op==='+'?1:-1,ym=niceMax(SQ2*Math.max(cabs(c1),cabs(c2),cabs(r))*1.05),N=300,ts=Array.from({length:N+1},(_,i)=>i/N*2*T);
    $('#l4w').innerHTML=plotSVG({w:760,h:220,x0:0,x1:2*T*1000,y0:-ym,y1:ym,xt:[0,8.33,16.67,25,33.33],yt:[-ym,0,ym],xl:'t (ms)',cid:'l4c',
     series:[{pts:ts.map(t=>[t*1000,f1(t)]),col:'--blue',w:1.6},{pts:ts.map(t=>[t*1000,f2(t)]),col:'--stop',w:1.6},{pts:ts.map(t=>[t*1000,f1(t)+sg*f2(t)]),col:'--live',w:4},{pts:ts.map(t=>[t*1000,fr(t)]),col:'--fg',w:1.4,dash:'5 4'}]});
    $('#l4wn').innerHTML=`الأخضر موجة C<sub>1</sub> والأحمر موجة C<sub>2</sub>. البرتقالي العريض = جمع الموجتين لحظة بلحظة (${op==='+'?'v₁ + v₂':'v₁ − v₂'})، والخط الأسود المتقطع = الموجة التي يمثلها المطاور الناتج C. ينطبقان تماماً: جمع المطاورات يغني عن جمع الموجات.`}
   else{$('#l4w').innerHTML='';$('#l4wn').innerHTML='الضرب والقسمة لا يقابلهما ضرب موجتين؛ نستعملهما مع المعاوقات في قانون أوم (V = Z I) كما في الفصل الثاني.'}
  };
  segBind(el,'op',v=>{op=v;did['op'+v]=1;draw()});
  const inp=()=>{const g=id=>{const v=parseFloat($(id).value);return isFinite(v)?v:0};c1=Cx(g('#l4a1'),g('#l4b1'));c2=Cx(g('#l4a2'),g('#l4b2'));draw()};
  ['#l4a1','#l4b1','#l4a2','#l4b2'].forEach(i=>$(i).addEventListener('input',inp));
  $('#l4ex').onclick=()=>{c1=Cx(5,23);c2=Cx(-3.5,8);did.ex=1;draw()};
  const isEx=()=>c1.re===5&&c1.im===23&&c2.re===-3.5&&c2.im===8;
  const toW=(ev)=>{const sv=$('#l4p svg');if(!sv||!out.s)return null;const pt=sv.createSVGPoint();pt.x=ev.clientX;pt.y=ev.clientY;const p=pt.matrixTransform(sv.getScreenCTM().inverse());const sn=fixB.xmax<=40?0.5:fixB.xmax<=200?1:5;return Cx(Math.round((p.x-out.ox)/out.s/sn)*sn,Math.round((out.oy-p.y)/out.s/sn)*sn)};
  $('#l4p').addEventListener('pointerdown',e=>{const h=e.target.closest('[data-h]');if(!h)return;drag=+h.dataset.h;fixB=bounds();e.preventDefault()});
  const mv=e=>{if(!drag)return;const z=toW(e);if(!z)return;if(drag===1)c1=z;else c2=z;did.drag=1;draw()};
  const up=()=>{if(drag){drag=0;fixB=null;draw()}};
  window.addEventListener('pointermove',mv);window.addEventListener('pointerup',up);
  const wv=()=>{$('#l4Vm-v').textContent=fm(wVm)+' V';$('#l4th-v').textContent=wTh+'°';const V=wVm/SQ2;
   $('#l4wv').textContent=`${fm(wVm)} sin(377t ${wTh<0?'−':'+'} ${Math.abs(wTh)}°)`;$('#l4wr').textContent=fm(rd(V,2))+' V';$('#l4wp').textContent=fPm(rd(V,2),wTh,null,null)+' V';$('#l4wq').textContent=fR(pol(V,wTh),2)};
  $('#l4Vm').oninput=e=>{wVm=+e.target.value;wv()};$('#l4th').oninput=e=>{wTh=+e.target.value;wv()};
  $('#l4put').onclick=()=>{c1=pol(wVm/SQ2,wTh);c1=Cx(rd(c1.re,2),rd(c1.im,2));if(Math.abs(wVm-141.4)<1e-9&&wTh===30)did.w2p=1;draw()};
  const steps=stepsUI($('#l4st'),[
   {t:'الجمع (مثال 1-1-8)',x:'اضغط «ضع أعداد مثال 1-1-8» واختر C1 + C2: الناتج \\(1.5+j31=31.04\\angle87.2^\\circ\\). لاحظ C<sub>2</sub> المرسوم من رأس C<sub>1</sub>.',done:()=>isEx()&&op==='+'},
   {t:'الطرح',x:'اختر C1 − C2: الناتج \\(8.5+j15=17.24\\angle60.5^\\circ\\) (الكتاب: 17.2).',done:()=>isEx()&&op==='-'},
   {t:'الضرب',x:'اختر C1 × C2: الطول \\(23.54\\times8.73=205.5\\) والزاوية \\(77.7+113.6=191.3^\\circ\\). الكتاب كتب 204.5 لأنه قرّب الطولين إلى 23.5 و8.7 قبل الضرب.',done:()=>isEx()&&op==='*'},
   {t:'القسمة',x:'اختر C1 ÷ C2: \\(2.7\\angle-35.9^\\circ=2.18-j1.58\\).',done:()=>isEx()&&op==='/'},
   {t:'اجعل المحصلة حقيقية',x:'اختر C1 + C2 ثم اسحب رأس C<sub>2</sub> حتى يقع الناتج C على المحور الأفقي (الجزء التخيلي صفر)، أي \\(B_2=-B_1\\).',done:()=>did.drag&&op==='+'&&Math.abs(cadd(c1,c2).im)<1e-9&&Math.abs(cadd(c1,c2).re)>0.1},
   {t:'من الموجة إلى المطاور (مثال 1-1-7)',x:'في اللوحة الأخيرة اجعل \\(V_m=141.4\\) و \\(\\theta_v=30^\\circ\\): المطاور \\(100\\angle30^\\circ\\ \\text{V}\\) = \\(86.6+j50\\). اضغط «ضع المطاور في C1».',done:()=>did.w2p}
  ]);
  draw();wv();
  loopOn(el,()=>{steps.check();if(!document.body.contains(el)){window.removeEventListener('pointermove',mv);window.removeEventListener('pointerup',up)}});
  const obs=setInterval(()=>{if(!document.body.contains(el)){window.removeEventListener('pointermove',mv);window.removeEventListener('pointerup',up);clearInterval(obs)}},2000);
 },
 examples:[
  {title:'مثال 1-1-7',ref:'ص 20',q:'<p>أوجد الجهد المطاور للجهد المتردد \\(v(t)=141.4\\sin(377t+30^\\circ)\\ \\text{V}\\).</p>',
   given:[{id:'Vm',label:'القيمة العظمى',sym:'V_m',unit:'V',value:141.4},{id:'th',label:'زاوية الطور',sym:'\\theta_v',unit:'°',value:30}],
   solve:g=>{const V=rd(g.Vm/SQ2,1);return [{t:'القيمة الفعالة للجهد:',f:`V=\\frac{V_m}{\\sqrt2}=\\frac{${fm(g.Vm)}}{\\sqrt2}`,v:V,unit:'V'},{t:'الجهد المطاور بالمعادلة (1-10):',v:fPm(V,g.th),unit:'V',final:true}]}},
  {title:'مثال 1-1-8',ref:'ص 23–24',q:'<p>إذا كان \\(C_1=5+j23\\) و \\(C_2=-3.5+j8\\)، أوجد بالصيغتين المتعامدة والقطبية: (1) \\(C_1+C_2\\). (2) \\(C_1-C_2\\). (3) \\(C_1C_2\\). (4) \\(C_1/C_2\\).</p>',
   given:[{id:'A1',label:'الجزء الحقيقي لـ C1',sym:'A_1',unit:'',value:5},{id:'B1',label:'الجزء التخيلي لـ C1',sym:'B_1',unit:'',value:23},{id:'A2',label:'الجزء الحقيقي لـ C2',sym:'A_2',unit:'',value:-3.5},{id:'B2',label:'الجزء التخيلي لـ C2',sym:'B_2',unit:'',value:8}],
   solve:g=>{const s=Cx(g.A1+g.A2,g.B1+g.B2),d=Cx(g.A1-g.A2,g.B1-g.B2);const m1=rd(cabs(Cx(g.A1,g.B1)),1),t1=rd(cang(Cx(g.A1,g.B1)),1),m2=rd(cabs(Cx(g.A2,g.B2)),1),t2=rd(cang(Cx(g.A2,g.B2)),1);
    const mp=rd(m1*m2,1),tp=rd(t1+t2,1),md=rd(m1/m2,1),td=rd(t1-t2,1);const sg=x=>x<0?'-':'+',ab=x=>fm(Math.abs(rd(x,2)));return [
    {t:'(1) الجمع:',f:`C=(${fm(g.A1)}${sg(g.A2)}${ab(g.A2)})+j(${fm(g.B1)}${sg(g.B2)}${ab(g.B2)})=${fm(rd(s.re,2))}${sg(s.im)}j${ab(s.im)}`},
    {t:'وبالقانون (1-14):',f:`|C|=\\sqrt{(${fm(rd(s.re,2))})^2+(${fm(rd(s.im,2))})^2}\\ ;\\ \\theta=\\tan^{-1}\\frac{${fm(rd(s.im,2))}}{${fm(rd(s.re,2))}}`,v:fPm(rd(cabs(s),2),rd(cang(s),1)),final:true},
    {t:'(2) الطرح:',f:`C=(${fm(g.A1)}${sg(-g.A2)}${ab(g.A2)})+j(${fm(g.B1)}${sg(-g.B2)}${ab(g.B2)})=${fm(rd(d.re,2))}${sg(d.im)}j${ab(d.im)}`},
    {t:'وبالقانون (1-14):',v:fPm(rd(cabs(d),1),rd(cang(d),1)),final:true},
    {t:'(3) الضرب: نحول العددين للصيغة القطبية بالقانون (1-14):',f:`C_1=${fm(m1)}\\angle${fm(t1)}^\\circ\\ ;\\ C_2=${fm(m2)}\\angle${fm(t2)}^\\circ`},
    {t:'نضرب الأطوال ونجمع الزوايا:',f:`|C|=${fm(m1)}\\times${fm(m2)}\\ ;\\ \\theta=${fm(t1)}+${fm(t2)}`,v:fPm(mp,tp)},
    {t:'وبالقانون (1-15):',f:`A=${fm(mp)}\\cos${fm(tp)}^\\circ\\ ;\\ B=${fm(mp)}\\sin${fm(tp)}^\\circ`,v:fR(Cx(rd(mp*Math.cos(tp*D),1),rd(mp*Math.sin(tp*D),1)),1),final:true},
    {t:'(4) القسمة: نقسم الأطوال ونطرح الزوايا:',f:`|C|=\\frac{${fm(m1)}}{${fm(m2)}}\\ ;\\ \\theta=${fm(t1)}-${fm(t2)}`,v:fPm(md,td)},
    {t:'وبالقانون (1-15):',v:fR(Cx(rd(md*Math.cos(td*D),2),rd(md*Math.sin(td*D),2)),2),final:true}]},
   note:'الحاسبة تقرب كما يقرب الكتاب: الأطوال والزوايا إلى رقم عشري واحد قبل الضرب والقسمة. في الكتاب سقطت الفواصل العشرية في سطر الضرب (2045 بدل 204.5 …).'},
  {title:'مسائل الفصل الأول — س1 وس2 وس3 — إجابة مقترحة (ليست من الكتاب)',ref:'ص 25',q:'<p>س1: موجة تكمل 4 دورات في <span class="ltr">30 ms</span>. س2: 100 دورة (بالنص) أو 4 دورات (بالرسم) في <span class="ltr">20 ms</span>. س3: كم يلزم لـ 6 دورات بتردد <span class="ltr">60 Hz</span>؟</p>',
   given:[{id:'N1',label:'س1: عدد الدورات',sym:'',unit:'',value:4},{id:'t1',label:'س1: الزمن',sym:'',unit:'ms',value:30},{id:'N2',label:'س2: عدد الدورات بالنص',sym:'',unit:'',value:100},{id:'N2f',label:'س2: عدد الدورات بالرسم',sym:'',unit:'',value:4},{id:'t2',label:'س2: الزمن',sym:'',unit:'ms',value:20},{id:'N3',label:'س3: عدد الدورات',sym:'',unit:'',value:6},{id:'f3',label:'س3: التردد',sym:'',unit:'Hz',value:60}],
   solve:g=>[{t:'س1:',f:`T=\\frac{${fm(g.t1)}}{${fm(g.N1)}}`,v:rd(g.t1/g.N1,3),unit:'ms',final:true},
    {t:'س2 بنص السؤال:',f:`T=\\frac{${fm(g.t2)}}{${fm(g.N2)}}`,v:rd(g.t2/g.N2,3),unit:'ms',final:true},{t:'س2 بحسب الرسم:',f:`T=\\frac{${fm(g.t2)}}{${fm(g.N2f)}}`,v:rd(g.t2/g.N2f,3),unit:'ms',final:true},
    {t:'س3: الزمن = عدد الدورات × T:',f:`t=${fm(g.N3)}\\times\\frac{1}{${fm(g.f3)}}`,v:rd(g.N3/g.f3,4),unit:'s',final:true}]},
  waveQ(1,8.4,10000,0,1),waveQ(2,100,754,45,2),waveQ(3,-30,942,0,1),waveQ(4,50,314,30,1)
 ],
 quiz:[
  {q:'لماذا نرسم كل المتجهات (المطاورات) عند بداية الزمن t = 0؟',o:['لأن الدائرة تبدأ من الصفر','لأنها تدور كلها بنفس السرعة فتبقى الزوايا بينها ثابتة','لأن التردد صفر','لأن القيم الفعالة صفر عند t = 0'],c:1,e:'ص 18–19.'},
  {q:'طول المطاور في التحليل يؤخذ:',o:['القيمة العظمى','القيمة الفعالة','القيمة المتوسطة','التردد'],c:1,e:'ص 19: نقسم قيم المتجهات على √2.'},
  {q:'المطاور للجهد \\(v=311\\sin(\\omega t-20^\\circ)\\):',o:['\\(311\\angle-20^\\circ\\)','\\(220\\angle-20^\\circ\\)','\\(220\\angle20^\\circ\\)','\\(440\\angle-20^\\circ\\)'],c:1,e:'\\(311/\\sqrt2\\approx220\\).'},
  {q:'أي صيغة تسهل الجمع والطرح؟',o:['القطبية','المتعامدة','كلاهما سواء','لا يمكن جمع الأعداد المركبة'],c:1,e:'ص 20–21.'},
  {q:'\\((3+j4)+(1-j2)=\\)',o:['\\(4+j2\\)','\\(4+j6\\)','\\(2+j6\\)','\\(3-j8\\)'],c:0,e:'نجمع الحقيقيين ثم التخيليين.'},
  {q:'\\(10\\angle30^\\circ\\times2\\angle15^\\circ=\\)',o:['\\(20\\angle45^\\circ\\)','\\(12\\angle45^\\circ\\)','\\(20\\angle15^\\circ\\)','\\(5\\angle15^\\circ\\)'],c:0,e:'تضرب الأطوال وتجمع الزوايا.'},
  {q:'\\(|3+j4|\\) و زاويته:',o:['7 و 45°','5 و 53.1°','5 و 36.9°','25 و 53.1°'],c:1,e:'\\(\\sqrt{9+16}=5\\)، \\(\\tan^{-1}(4/3)=53.1^\\circ\\).'},
  {q:'\\(\\frac{20\\angle50^\\circ}{4\\angle-10^\\circ}=\\)',o:['\\(5\\angle40^\\circ\\)','\\(5\\angle60^\\circ\\)','\\(80\\angle40^\\circ\\)','\\(16\\angle60^\\circ\\)'],c:1,e:'\\(20/4=5\\) و \\(50-(-10)=60^\\circ\\).'}
 ]
});

/* ======================================================================
   Lesson 5 — R, L and C in AC; complex impedance (الأشكال 1-11 … 1-16)
   ====================================================================== */
const EL={R:{n:'مقاومة R',sh:0},L:{n:'ملف L',sh:-90},C:{n:'مكثف C',sh:90}};
function elemSVG(k,o){o=o||{};let s=`<svg viewBox="0 0 230 210" role="img" aria-label="عنصر في دائرة تيار متردد">`;
  s+=`<circle cx="60" cy="30" r="5" fill="var(--surface)" stroke="var(--fg)" stroke-width="2"/><circle cx="60" cy="180" r="5" fill="var(--surface)" stroke="var(--fg)" stroke-width="2"/><path class="w" d="M60 35H140V60M140 150V175H60"/>`;
  s+=k==='R'?zig(140,60,140,150,6):k==='L'?ind(140,60,140,150,4):cap(140,60,140,150);
  s+=S.t(162,110,k,'','start')+(o.val?S.t(162,126,o.val,'b','start'):'');
  s+=S.t(60,16,'+','')+S.t(60,204,'−','')+S.t(40,110,'V(t)','','end')+arrow(80,22,120,22,'--blue',2)+S.t(100,14,'i(t)','b');
  return s+'</svg>'}
function viWave(sh,o){o=o||{};const ki=o.ki||0.6,cid=o.cid||'vw';return plotSVG({w:o.w||460,h:o.h||220,x0:-30,x1:720,y0:-1.25,y1:1.25,xt:[0,90,180,270,360,450,540,630,720].filter(v=>v<=720),xf:v=>v%180===0?v+'°':'',yt:[],xl:'α',cid,
  series:[{pts:Array.from({length:376},(_,i)=>{const a=-30+i*2;return [a,Math.sin((a+(o.thv||0))*D)]}),col:'--live',w:2.4},{pts:Array.from({length:376},(_,i)=>{const a=-30+i*2;return [a,ki*Math.sin((a+(o.thv||0)+sh)*D)]}),col:'--blue',w:2.4}],
  extra:(X,Y)=>`<path d="M${X(-30)} ${fx(Y(1))}H${X(720)}" stroke="var(--live)" stroke-dasharray="4 4" stroke-width=".9"/><path d="M${X(-30)} ${fx(Y(ki))}H${X(720)}" stroke="var(--blue)" stroke-dasharray="4 4" stroke-width=".9"/>`+S.t(X(-30)+4,Y(1)-4,'Vm','','start')+S.t(X(-30)+4,Y(ki)-4,'Im','b','start')+(o.extra?o.extra(X,Y):'')})}
function viPhasor(thv,sh,o){o=o||{};const ki=o.ki||0.6,thi=thv+sh;return phasorSVG({w:o.w||260,h:o.h||240,vecs:[{x:Math.cos(thv*D),y:Math.sin(thv*D),col:'--live',lb:'V'},{x:ki*Math.cos(thi*D),y:ki*Math.sin(thi*D),col:'--blue',lb:'I'}],
  arcs:[{a0:0,a1:thv,r:52,lb:'θv',col:'--live'}].concat(sh?[{a0:thi,a1:thv,r:28,col:'--fg',lb:'90°'}]:[]),axes:['x','y'],fixed:{xmin:-1.15,xmax:1.15,ymin:-1.15,ymax:1.15}})}

const L5_ERR=`<b>ملاحظات على الكتاب (هذا الدرس):</b><ol style="margin:6px 0 0;padding-inline-start:20px">
 <li>مدخل الفصل الثاني ص 26: يقول «وفي نهاية الفصل سنتطرق إلى دراسة مقومات التيار المتردد البسيطة»، ولا يوجد في الفصل أي موضوع عن المقومات؛ الفصل ينتهي بقوانين كيرشوف والمسائل. لذلك حذفنا هذه الجملة.</li>
 <li>ص 29: في معادلات تيار المكثف كُتب \\(\\theta\\) بدل \\(\\theta_v\\)؛ كتبناها \\(\\theta_v\\).</li>
 <li>ص 30–31: في المعادلتين 1-27 و1-28 كُتب \\(\\frac{V}{I}\\angle\\theta_v-(\\theta_v-90^\\circ)\\) بلا أقواس حول الزاوية؛ كتبناها \\(\\angle[\\theta_v-(\\theta_v-90^\\circ)]\\).</li>
 <li>هذا الجزء من الكتاب (ص 26–31) ليس فيه أمثلة محلولة؛ أرقام المختبر الابتدائية مأخوذة من المثالين 1-2-1 و1-2-2 في الدرس التالي.</li></ol>`;

lesson({
 id:'u1-l5',unit:1,order:5,pages:'26–31',
 title:'المقاومة والملف والمكثف في دائرة التيار المتردد والمعاوقة المركبة',
 summary:'في المقاومة الجهد والتيار لهما نفس الطور (I = V/R)، وفي الملف يتأخر التيار عن الجهد 90° والممانعة الحثية XL = ωL، وفي المكثف يتقدم التيار 90° والممانعة السعوية XC = 1/ωC. ثم قانون أوم بالأعداد المركبة V = Z I: ZR = R، وZL = jXL، وZC = −jXC، والمخطط الاتجاهي لكل عنصر.',
 theory:[
  {h:'الفصل الثاني: المقاومات الأومية والممانعات الحثية والسعوية في دوائر التيار المتردد',ref:'ص 26',html:'<p>هناك عدة طرق لتحليل دوائر التيار المتردد مهما تعقدت الدائرة، وكلها تستعمل <b>قانون أوم وقوانين كيرشوف</b>. وفي هذا الفصل سنشرح الخطوات المستعملة لتحليل الدوائر البسيطة فقط، وقبل ذلك نعرف <b>المعاوقة المركبة</b>.</p>'},
  {h:'1-2-1 المقاومة المادية في دائرة التيار المتردد',ref:'ص 26',html:`<p>ينص قانون أوم على أن التيار المار في مقاومة R يتناسب في كل لحظة مع الجهد بين طرفيها (الشكل 1-11a)، فإذا كان الجهد \\(v(t)=V_m\\sin(\\omega t+\\theta_v)\\) فإن التيار الناتج هو</p>
   $$i(t)=\\frac{v(t)}{R}=\\frac{V_m}{R}\\sin(\\omega t+\\theta_v)=I_m\\sin(\\omega t+\\theta_v)\\qquad I_m=\\frac{V_m}{R}$$
   <p>وباستعمال القيم الفعالة نحصل على العلاقة</p>$$I=\\frac{V}{R} \\qquad (1\\text{-}16)$$
   <p>وكما نرى فإن <b>الجهد والتيار في مقاومة لهما نفس الطور</b>، وهذا موضح في الشكل 1-11b حيث أخذنا \\(\\theta_v=0\\) لتبسيط الرسم.</p>`},
  {fig:'1-11',ref:'ص 26',caption:'التيار والجهد في مقاومة مادية: (a) المقاومة بين طرفين. (b) موجة الجهد (برتقالي) وموجة التيار (أخضر) تبدآن معاً وتعبران الصفر معاً.',draw:()=>`<div class="grid"><div class="c4">${box(elemSVG('R'),230)}</div><div class="c8">${box(viWave(0,{cid:'f111'}),460)}</div></div>`},
  {h:'1-2-2 الممانعة الحثية في دائرة التيار المتردد',ref:'ص 27–28',html:`<p>رأينا في مقرر دوائر كهربائية-1 أنه عند تسليط تيار متردد \\(i(t)\\) على ملف محاثته L (الشكل 1-12a) تنتج قوة دافعة كهربائية \\(e(t)\\) تحاول أن تعاكس الجهد \\(v(t)\\) بين أطراف الملف الذي تسبب في توليد التيار، وهكذا فإن العلاقة بين التيار والجهد في الملف هي</p>
   $$v(t)=-e(t)=L\\frac{di(t)}{dt} \\qquad (1\\text{-}17)$$
   <p>فعندما يمر التيار \\(i(t)=I_m\\sin(\\omega t+\\theta_i)\\) في ملف، فإن الجهد بين طرفيه يكون</p>
   $$v(t)=\\omega L I_m\\cos(\\omega t+\\theta_i)=\\omega L I_m\\sin(\\omega t+\\theta_i+90^\\circ)=V_m\\sin(\\omega t+\\theta_i+90^\\circ)$$
   <p>نلاحظ أن القيمة القصوى للجهد تتناسب مع القيمة القصوى للتيار</p>$$V_m=\\omega L\\,I_m \\qquad (1\\text{-}18)$$
   <p>ونسمي الكمية</p>$$X_L=\\omega L \\qquad (1\\text{-}19)$$
   <p><b>بالممانعة الحثية</b> للملف، وذلك لأنها تعارض مرور التيار فيه. وباستعمال القيم الفعالة</p>$$V=\\omega L\\,I=X_L\\,I \\qquad (1\\text{-}20)$$
   <p>ونلاحظ أن <b>موجة التيار تتخلف عن موجة الجهد بـ 90°</b>، وهذا موضح في الشكل 1-12b حيث أخذنا \\(\\theta_i=0\\).</p>`},
  {fig:'1-12',ref:'ص 27',caption:'التيار والجهد في ممانعة حثية: موجة الجهد تبدأ قبل الأصل بـ 90° (قمتها عند الأصل)، وموجة التيار تبدأ من الأصل: الجهد متقدم على التيار بـ 90°.',draw:()=>`<div class="grid"><div class="c4">${box(elemSVG('L'),230)}</div><div class="c8">${box(viWave(-90,{thv:90,cid:'f112'}),460)}</div></div>`},
  {html:'<p>ونتنبه إلى أن السلك الذي يلف منه الملف له بعض المقاومة، ولهذا توجد للملف خاصيتان: <b>الحثية والمقاومة</b>. وتصمم الملفات غالباً بحيث تكون ممانعاتها الحثية كبيرة مقارنة بمقاوماتها. والملف الذي لا يحتوي على أي مقاومة (ملف مثالي) يسمى <b>ملفاً نقياً</b>، وفي هذه الوحدة سنعتبر أن كل الملفات نقية.</p>'},
  {h:'1-2-3 الممانعة السعوية في دائرة التيار المتردد',ref:'ص 28–29',html:`<p>رأينا في مقرر دوائر كهربائية-1 أن سعة المكثف C تمثل النسبة بين شحنته والجهد بين طرفيه. وحيث إن التيار يساوي تغير الشحنة بالنسبة للزمن، فإن العلاقة بين التيار والجهد في المكثف (الشكل 1-13a) هي</p>
   $$i(t)=C\\frac{dv(t)}{dt} \\qquad (1\\text{-}21)$$
   <p>فعندما يكون الجهد بين طرفي المكثف \\(v(t)=V_m\\sin(\\omega t+\\theta_v)\\) فإن التيار الناتج هو</p>
   $$i(t)=\\omega C V_m\\cos(\\omega t+\\theta_v)=\\omega C V_m\\sin(\\omega t+\\theta_v+90^\\circ)=I_m\\sin(\\omega t+\\theta_v+90^\\circ)$$
   $$V_m=\\frac{1}{\\omega C}I_m \\qquad (1\\text{-}22)$$
   <p>ونسمي الكمية</p>$$X_C=\\frac{1}{\\omega C} \\qquad (1\\text{-}23)$$
   <p><b>بالممانعة السعوية</b> للمكثف، وذلك لأنها تعارض مرور التيار فيه. وباستعمال القيم الفعالة</p>$$V=\\frac{1}{\\omega C}I=X_C\\,I \\qquad (1\\text{-}24)$$
   <p>كما نلاحظ أن <b>موجة التيار تتقدم على موجة الجهد بـ 90°</b>، وهذا موضح في الشكل 1-13b حيث أخذنا \\(\\theta_v=0\\).</p>`},
  {fig:'1-13',ref:'ص 28',caption:'التيار والجهد في ممانعة سعوية: موجة الجهد تبدأ من الأصل، وموجة التيار تبدأ قبل الأصل بـ 90°: التيار متقدم على الجهد بـ 90°.',draw:()=>`<div class="grid"><div class="c4">${box(elemSVG('C'),230)}</div><div class="c8">${box(viWave(90,{cid:'f113'}),460)}</div></div>`},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب:</b> لتتذكر: في الملف (L) الجهد يسبق، وفي المكثف (C) التيار يسبق. ولاحظ أن \\(X_L\\) تكبر مع التردد (الملف يعارض الترددات العالية)، و \\(X_C\\) تصغر مع التردد (المكثف يمرر الترددات العالية). وفي التيار المستمر (f = 0): \\(X_L=0\\) و \\(X_C\\) لا نهائية. جرّب ذلك في المختبر.'},
  {h:'1-2-4 قانون أوم والمخطط الاتجاهي — المعاوقة المركبة',ref:'ص 29',html:`<p>بما أن معاوقة أي عنصر هي النسبة بين الجهد <b>V</b> بين أطرافه والتيار <b>I</b> المار فيه فإننا نستطيع تمثيلها كذلك بعدد مركب يسمى <b>المعاوقة المركبة Z</b>، وهكذا نكتب قانون أوم كما يلي:</p>
   $$\\mathbf{V}=\\mathbf{Z}\\,\\mathbf{I} \\qquad (1\\text{-}25)$$
   <p>ويجب أن ننتبه إلى أنه على العكس من الجهود والتيارات المطاورة، فإن <b>المعاوقة Z لا تمثل دالة جيبية</b>. وفيما يلي نطبق مفهوم المعاوقة المركبة على العناصر الثلاثة.</p>`},
  {h:'المقاومة المادية',ref:'ص 29–30',html:`<p>الجهد والتيار في المقاومة لهما نفس الطور، فلو كان \\(\\mathbf{V}=V\\angle\\theta_v\\) فإن \\(\\mathbf{I}=I\\angle\\theta_v\\)، والنسبة بينهما</p>
   $$\\mathbf{Z}_R=\\frac{V\\angle\\theta_v}{I\\angle\\theta_v}=\\frac{V}{I}\\angle(\\theta_v-\\theta_v)=R\\angle0^\\circ=R \\qquad (1\\text{-}26)$$
   <p>فالمعاوقة المركبة لمقاومة مادية <b>عدد حقيقي</b>. ويبين الشكل 1-14 المخطط الاتجاهي لمقاومة مادية.</p>`},
  {fig:'1-14',ref:'ص 30',caption:'المخطط الاتجاهي لمقاومة مادية: V و I على نفس الخط بزاوية θ<sub>v</sub>.',draw:()=>box(viPhasor(40,0),260)},
  {h:'الممانعة الحثية (X<sub>L</sub>)',ref:'ص 30',html:`<p>الجهد بين طرفي الملف يتقدم على التيار بزاوية 90°، أي \\(\\theta_i=\\theta_v-90^\\circ\\)، وعليه</p>
   $$\\mathbf{Z}_L=\\frac{V\\angle\\theta_v}{I\\angle(\\theta_v-90^\\circ)}=\\frac{V}{I}\\angle[\\theta_v-(\\theta_v-90^\\circ)]=X_L\\angle90^\\circ=jX_L \\qquad (1\\text{-}27)$$
   <p>وكما نعلم فإن العدد التخيلي j قيمته المطلقة الواحد وإزاحته الزاوية 90°، فالمعاوقة المركبة لملف <b>عدد تخيلي نقي</b>. ويبين الشكل 1-15 المخطط الاتجاهي لملف.</p>`},
  {fig:'1-15',ref:'ص 31',caption:'المخطط الاتجاهي لممانعة حثية: I بزاوية θ<sub>i</sub>، و V متقدم عليه بزاوية قائمة.',draw:()=>box(viPhasor(130,-90),260)},
  {h:'الممانعة السعوية (X<sub>C</sub>)',ref:'ص 31',html:`<p>الجهد بين طرفي المكثف يتأخر عن التيار بزاوية 90°، أي \\(\\theta_i=\\theta_v+90^\\circ\\)، وعليه</p>
   $$\\mathbf{Z}_C=\\frac{V\\angle\\theta_v}{I\\angle(\\theta_v+90^\\circ)}=\\frac{V}{I}\\angle[\\theta_v-(\\theta_v+90^\\circ)]=X_C\\angle-90^\\circ=-jX_C \\qquad (1\\text{-}28)$$
   <p>والعدد \\(-j\\) قيمته المطلقة الواحد وإزاحته الزاوية \\(-90^\\circ\\)، فالمعاوقة المركبة لمكثف <b>عدد تخيلي نقي</b> سالب. ويبين الشكل 1-16 المخطط الاتجاهي لمكثف.</p>`},
  {fig:'1-16',ref:'ص 31',caption:'المخطط الاتجاهي لممانعة سعوية: V بزاوية θ<sub>v</sub>، و I متقدم عليه بزاوية قائمة.',draw:()=>box(viPhasor(35,90),260)},
  {html:`<div class="ca-tbl"><table class="tt"><thead><tr><th>العنصر</th><th>المعاوقة</th><th>القيمة</th><th>الطور</th></tr></thead><tbody>
   <tr><td>مقاومة</td><td>\\(\\mathbf Z_R=R\\angle0^\\circ\\)</td><td>R</td><td>V و I متفقان</td></tr>
   <tr><td>ملف</td><td>\\(\\mathbf Z_L=jX_L\\)</td><td>\\(X_L=\\omega L\\)</td><td>I يتأخر 90°</td></tr>
   <tr><td>مكثف</td><td>\\(\\mathbf Z_C=-jX_C\\)</td><td>\\(X_C=1/\\omega C\\)</td><td>I يتقدم 90°</td></tr></tbody></table></div><p class="sub">ملخص (توضيح للمتدرب — ليس من الكتاب).</p>`},
  {err:L5_ERR}
 ],
 lab:(el)=>{
  let ek='R',V=100,f=60,R=7,Lm=8,Cu=332,thv=0,rot=0,ph=0;const seen={};const did={};
  el.innerHTML=ar(`<div class="grid ca-lab">
   <div class="panel c12"><h2>عنصر واحد على مصدر متردد <small>مبني على الأشكال 1-11 إلى 1-16 والمعادلات 1-16 إلى 1-28 ص 26–31</small></h2>
    <div class="ca-row">${segHTML('ek',[['R','مقاومة R'],['L','ملف L'],['C','مكثف C']],ek)} ${swHTML('l5rot','دوّر','حرّك الزمن',0)}</div>
    <div class="grid"><div class="c4"><div class="svgbox" id="l5c" style="max-width:230px;margin-inline:auto"></div></div><div class="c8"><div class="svgbox" id="l5w"></div></div></div>
    <p class="sub">البرتقالي = الجهد، الأخضر = التيار (مرسوم بمقياس مختلف ليظهر بجوار الجهد). الخط العمودي = اللحظة الحالية.</p></div>
   <div class="panel c4"><h2>المصدر والعنصر</h2>${sl('l5V','الجهد الفعال V',0,240,1,V)}${sl('l5f','التردد f',1,200,1,f)}${sl('l5th','زاوية طور الجهد θ<sub>v</sub>',-90,90,5,thv)}
    <div id="l5sR">${sl('l5R','المقاومة R',1,100,0.5,R)}</div><div id="l5sL">${sl('l5L','المحاثة L',1,100,0.5,Lm)}</div><div id="l5sC">${sl('l5C','السعة C',10,1000,1,Cu)}</div></div>
   <div class="panel c4"><h2>المخطط الاتجاهي</h2><div class="svgbox" id="l5p" style="max-width:300px;margin-inline:auto"></div><div class="ca-row"><span id="l5chip" class="ca-chip"></span></div></div>
   <div class="panel c4"><h2>الحساب</h2><div class="facts">${fact('<span id="l5xl">X</span>','l5x')}${fact('المعاوقة المركبة Z','l5z')}${fact('التيار I = V / X','l5i')}${fact('I<sub>m</sub> = √2 I','l5im')}${fact('المطاور V','l5vp')}${fact('المطاور I = V / Z','l5ip')}</div></div>
   <div class="panel c12"><h2>الممانعة مع التردد</h2><div class="svgbox" id="l5xf"></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l5st"></ol></div></div>`);
  B.math(el);const $=s=>el.querySelector(s);
  const X=()=>{const w=2*PI*f;return ek==='R'?R:ek==='L'?w*Lm*1e-3:1/(w*Cu*1e-6)};
  const ui=()=>{$('#l5sR').style.display=ek==='R'?'':'none';$('#l5sL').style.display=ek==='L'?'':'none';$('#l5sC').style.display=ek==='C'?'':'none';$('#l5c').innerHTML=elemSVG(ek,{val:ek==='R'?fm(R)+' Ω':ek==='L'?fm(Lm)+' mH':fm(Cu)+' µF'})};
  segBind(el,'ek',v=>{ek=v;seen[v]=1;ui()});seen.R=1;
  [['l5V',v=>V=v],['l5f',v=>f=v],['l5th',v=>thv=v],['l5R',v=>R=v],['l5L',v=>Lm=v],['l5C',v=>Cu=v]].forEach(([i,fn])=>{$('#'+i).oninput=e=>{fn(+e.target.value);ui()}});
  $('#l5rot').onclick=()=>{rot=rot?0:1;$('#l5rot').setAttribute('aria-pressed',rot?'true':'false');if(rot)did.rot=1};
  const steps=stepsUI($('#l5st'),[
   {t:'المقاومة',x:'مع «مقاومة R» شغّل «دوّر»: الموجتان تعبران الصفر معاً والمتجهان على خط واحد — نفس الطور، و \\(I=V/R\\) (1-16).',done:()=>ek==='R'&&did.rot},
   {t:'الملف',x:'اختر «ملف L» (<span class="ltr">L = 8 mH</span> و <span class="ltr">f = 60 Hz</span>): \\(X_L=\\omega L\\approx3.02\\ \\Omega\\)، والتيار <b>يتأخر</b> عن الجهد 90°.',done:()=>ek==='L'&&f===60&&Lm===8},
   {t:'ضاعف التردد',x:'ارفع التردد إلى <span class="ltr">120 Hz</span>: تتضاعف \\(X_L\\) وينقص التيار إلى النصف.',done:()=>ek==='L'&&f===120},
   {t:'المكثف',x:'اختر «مكثف C» واجعل <span class="ltr">C = 332 µF</span> و <span class="ltr">f = 60 Hz</span>: \\(X_C=1/\\omega C\\approx7.99\\ \\Omega\\) والتيار <b>يتقدم</b> على الجهد 90°.',done:()=>ek==='C'&&f===60&&Cu===332},
   {t:'المكثف والتردد العالي',x:'ارفع التردد فوق <span class="ltr">150 Hz</span>: تصغر \\(X_C\\) ويكبر التيار — عكس الملف.',done:()=>ek==='C'&&f>=150},
   {t:'غيّر زاوية الجهد',x:'حرّك θ<sub>v</sub>: يدور المتجهان معاً وتبقى الزاوية بينهما ثابتة (90° هنا)، كما في الشكل 1-16.',done:()=>ek==='C'&&thv!==0}
  ]);
  ui();
  loopOn(el,dt=>{if(rot)ph=(ph+dt*90)%720;
   const x=X(),I=V/Math.max(x,1e-9),sh=EL[ek].sh,thi=thv+sh;
   $('#l5V-v').textContent=V+' V';$('#l5f-v').textContent=f+' Hz';$('#l5th-v').textContent=thv+'°';$('#l5R-v').textContent=fm(R)+' Ω';$('#l5L-v').textContent=fm(Lm)+' mH';$('#l5C-v').textContent=fm(Cu)+' µF';
   $('#l5xl').innerHTML=ek==='R'?'R':ek==='L'?'X<sub>L</sub> = ωL (1-19)':'X<sub>C</sub> = 1/ωC (1-23)';
   $('#l5x').textContent=fm(rd(x,3))+' Ω';$('#l5z').textContent=ek==='R'?fm(rd(x,3))+'∠0° Ω':ek==='L'?'j'+fm(rd(x,3))+' Ω':'−j'+fm(rd(x,3))+' Ω';
   $('#l5i').textContent=fm(rd(I,3))+' A';$('#l5im').textContent=fm(rd(I*SQ2,3))+' A';$('#l5vp').textContent=fPm(V,thv,1,0)+' V';$('#l5ip').textContent=fPm(rd(I,3),thi,null,0)+' A';
   const ch=$('#l5chip');ch.className='ca-chip '+(sh===0?'ok':sh<0?'hot':'ld');ch.textContent=sh===0?'نفس الطور':sh<0?'التيار يتأخر عن الجهد 90°':'التيار يتقدم على الجهد 90°';
   $('#l5w').innerHTML=viWave(sh,{thv,cid:'l5wc',w:560,extra:(X_,Y_)=>{const a=ph-30>720?720:ph;return `<path d="M${fx(X_(a%720))} 14V${fx(Y_(-1.25))}" stroke="var(--fg)" stroke-width="1.2"/><circle cx="${fx(X_(a%720))}" cy="${fx(Y_(Math.sin((a+thv)*D)))}" r="4.5" fill="var(--live)"/><circle cx="${fx(X_(a%720))}" cy="${fx(Y_(0.6*Math.sin((a+thv+sh)*D)))}" r="4.5" fill="var(--blue)"/>`}});
   const pr=rot?ph:0;
   $('#l5p').innerHTML=phasorSVG({w:300,h:280,vecs:[{x:Math.cos((thv+pr)*D),y:Math.sin((thv+pr)*D),col:'--live',lb:'V'},{x:0.6*Math.cos((thi+pr)*D),y:0.6*Math.sin((thi+pr)*D),col:'--blue',lb:'I',lbN:sh?0:14}],arcs:sh?[{a0:thi+pr,a1:thv+pr,r:30,col:'--fg',lb:'90°'}]:[],axes:['Real','Imag'],fixed:{xmin:-1.15,xmax:1.15,ymin:-1.15,ymax:1.15}});
   const xs=Array.from({length:200},(_,i)=>{const ff=1+i;const w=2*PI*ff;return [ff,ek==='R'?R:ek==='L'?w*Lm*1e-3:1/(w*Cu*1e-6)]});const ym=niceMax(Math.min(Math.max(x*2.5,ek==='R'?R*1.5:0,ek==='L'?xs[199][1]*1.05:0,1),ek==='C'?x*4:1e9));
   $('#l5xf').innerHTML=plotSVG({w:760,h:200,x0:0,x1:200,y0:0,y1:ym,xt:[0,50,60,100,150,200],yt:[0,ym/2,ym],yf:v=>fm(rd(v,2)),xl:'f (Hz)',yl:(ek==='R'?'R':ek==='L'?'XL':'XC')+' (Ω)',cid:'l5xc',series:[{pts:xs,col:'--blue',w:2.4}],
    extra:(X_,Y_)=>`<circle cx="${fx(X_(f))}" cy="${fx(Y_(Math.min(x,ym*1.02)))}" r="6" fill="var(--live)"/>`+S.t(fx(X_(f)+8),fx(Y_(Math.min(x,ym))-8),fm(rd(x,2))+' Ω','','start')});
   steps.check()});
 },
 quiz:[
  {q:'في المقاومة المادية، الجهد والتيار:',o:['لهما نفس الطور','التيار يتأخر 90°','التيار يتقدم 90°','بينهما 180°'],c:0,e:'ص 26.'},
  {q:'الممانعة الحثية تساوي:',o:['\\(1/\\omega L\\)','\\(\\omega L\\)','\\(\\omega C\\)','\\(L/\\omega\\)'],c:1,e:'المعادلة (1-19).'},
  {q:'ملف محاثته <span class="ltr">0.1 H</span> على <span class="ltr">60 Hz</span>. ممانعته تقريباً:',o:['6 Ω','37.7 Ω','377 Ω','0.026 Ω'],c:1,e:'\\(377\\times0.1=37.7\\ \\Omega\\).'},
  {q:'في المكثف:',o:['التيار يتأخر عن الجهد 90°','التيار يتقدم على الجهد 90°','نفس الطور','لا يمر تيار متردد'],c:1,e:'ص 29.'},
  {q:'عند مضاعفة التردد فإن الممانعة السعوية:',o:['تتضاعف','تنقص إلى النصف','لا تتغير','تصبح صفراً'],c:1,e:'\\(X_C=1/\\omega C\\).'},
  {q:'المعاوقة المركبة لملف نقي:',o:['\\(X_L\\angle0^\\circ\\)','\\(jX_L\\)','\\(-jX_L\\)','\\(R+jX_L\\)'],c:1,e:'المعادلة (1-27).'},
  {q:'المعاوقة المركبة لمكثف:',o:['\\(jX_C\\)','\\(-jX_C\\)','\\(X_C\\)','\\(1/X_C\\)'],c:1,e:'المعادلة (1-28).'},
  {q:'الملف النقي هو:',o:['ملف من النحاس النقي','ملف لا يحتوي على أي مقاومة','ملف بلا قلب حديدي','ملف ممانعته صفر'],c:1,e:'ص 28.'}
 ]
});

/* ======================================================================
   Lesson 6 — series circuits and the voltage-divider rule
   ====================================================================== */
/* series circuit: items [{k:'R'|'L'|'C'|'Z'|'dots'|'wire',top,val,vl,hl}] ; o:{src,v1:index,I} */
function serCkt(items,o){o=o||{};const n=items.length,sw=118,x0=104,W=x0+n*sw+40,T=50,Bt=210;
  let s=`<svg viewBox="0 0 ${W} 262" role="img" aria-label="دائرة توالي">`;
  s+=`<path class="w" d="M50 ${T}H${x0}M${x0+n*sw} ${T}H${W-24}V${Bt}H50V${T}"/>`;
  s+=`<rect x="28" y="108" width="44" height="44" fill="var(--surface)" stroke="none"/>`+acSrc(50,130,22);
  if(o.src)s+=S.t(50,96,o.src,'','middle');
  s+=arrow(58,T-12,92,T-12,'--blue',2)+(o.I?S.t(80,186,o.I,'b','start')+S.t(75,T-18,'I','b'):S.t(75,T-18,'I','b'));
  items.forEach((it,i)=>{const a=x0+i*sw+14,b=x0+(i+1)*sw-14,m=(a+b)/2,st=it.hl?'style="stroke:var(--live);stroke-width:2.6"':'';
   s+=`<path class="w" d="M${x0+i*sw} ${T}H${a}M${b} ${T}H${x0+(i+1)*sw}"/>`;
   if(it.k==='R')s+=zig(a,T,b,T,6,st);else if(it.k==='L')s+=ind(a,T,b,T,4,st);else if(it.k==='C')s+=cap(a,T,b,T,st);else if(it.k==='Z')s+=zbox(a,T,b,T,st);
   else if(it.k==='dots')s+=`<path d="M${a} ${T}H${b}" stroke="var(--wire)" stroke-width="2.4" stroke-dasharray="2 6"/>`;else s+=`<path class="w" d="M${a} ${T}H${b}" stroke-dasharray="6 4"/>`+arT(m,T+30,'مقصور',{fs:11,col:'--muted'});
   if(it.top)s+=`<text class="txt" x="${m}" y="${T-18}" text-anchor="middle">${it.top}</text>`;
   if(it.val)s+=`<text class="txt b" x="${m}" y="${T+34}" text-anchor="middle">${it.val}</text>`;
   if(it.vl)s+=`<text class="txt${it.hl?'':' m'}" x="${m}" y="${T+56}" text-anchor="middle"${it.hl?' style="fill:var(--live)"':''}>+ ${it.vl} −</text>`});
  if(o.v1!=null){const x=x0+o.v1*sw;s+=`<circle cx="${x}" cy="${T}" r="3.5" fill="var(--fg)"/><path d="M${x} ${T+70}V${Bt-6}" stroke="var(--live)" stroke-dasharray="5 4" stroke-width="1.6"/>`+S.t(x-8,T+84,'+','','end')+S.t(x-8,Bt-8,'−','','end')+S.t(x+6,(T+Bt)/2+30,o.v1l||'V1','','start')}
  if(o.box){const a=x0+o.box[0]*sw+4,b=x0+(o.box[1]+1)*sw-4;s+=`<rect x="${a}" y="${T-34}" width="${b-a}" height="100" rx="6" fill="none" stroke="var(--muted)" stroke-dasharray="6 4"/>`}
  return s+'</svg>'}
function eqCkt(lb){let s=`<svg viewBox="0 0 220 262" role="img" aria-label="الدائرة المكافئة"><path class="w" d="M50 50H170V100M170 160V210H50V50"/><rect x="28" y="108" width="44" height="44" fill="var(--surface)"/>`+acSrc(50,130,22)+zbox(170,90,170,170)+S.t(184,134,lb||'ZT','','start')+arrow(70,38,110,38,'--blue',2)+S.t(90,30,'I','b')+S.t(18,134,'V','','end');return s+'</svg>'}
/* impedance diagram: R, XL, XC (book figs 1-18, 1-20a, 1-22a, 1-24a) */
function impSVG(R,XL,XC,o){o=o||{};const X=XL-XC,vecs=[{x:R,y:0,col:'--fg',lb:o.rl||'R',lbOff:16,lbN:-12}];
  if(XL&&XC){vecs.push({fx:R,fy:0,x:0,y:XL,col:'--live',dash:'5 4',wd:1.8,lb:o.xll||'jXL',lbOff:-10,lbN:24},{fx:R,fy:XL,x:0,y:-XC,col:'--blue',dash:'2 3',wd:1.8,lb:o.xcl||'−jXC',lbN:-26,lbOff:-8})}
  else if(XL)vecs.push({fx:R,fy:0,x:0,y:XL,col:'--live',dash:'5 4',wd:1.8,lb:o.xll||'jXL',lbN:24,lbOff:-8});else if(XC)vecs.push({fx:R,fy:0,x:0,y:-XC,col:'--blue',dash:'5 4',wd:1.8,lb:o.xcl||'−jXC',lbN:-26,lbOff:-8});
  vecs.push({x:R,y:X,col:'--stop',lb:o.zl||'ZT',wd:2.8});const th=Math.atan2(X,R)/D;
  return phasorSVG({w:o.w||300,h:o.h||240,vecs,arcs:Math.abs(th)>0.5?[{a0:0,a1:th,r:34,lb:o.al||fm(rd(th,1))+'°',col:'--stop'}]:[],axes:['','j']})}
/* series phasor diagram: V, I (scaled), VR, VL, VC from origin + head-to-tail dashes */
function serPhasor(V,I,VR,VL,VC,o){o=o||{};const ki=0.45*cabs(V)/Math.max(cabs(I),1e-9);const vecs=[];
  if(VL&&cabs(VL)>1e-9)vecs.push({fx:VR.re,fy:VR.im,x:VL.re,y:VL.im,col:'--live',dash:'4 4',wd:1.3});
  if(VC&&cabs(VC)>1e-9){const b=VL?cadd(VR,VL):VR;vecs.push({fx:b.re,fy:b.im,x:VC.re,y:VC.im,col:'--stop',dash:'4 4',wd:1.3})}
  vecs.push({x:V.re,y:V.im,col:'--fg',lb:'V',wd:3},{x:I.re*ki,y:I.im*ki,col:'--blue',lb:'I'},{x:VR.re,y:VR.im,col:'--muted',lb:'VR',wd:2.2});
  if(VL&&cabs(VL)>1e-9)vecs.push({x:VL.re,y:VL.im,col:'--live',lb:'VL',wd:2});if(VC&&cabs(VC)>1e-9)vecs.push({x:VC.re,y:VC.im,col:'--stop',lb:'VC',wd:2});
  return phasorSVG({w:o.w||340,h:o.h||300,vecs,arcs:[{a0:cang(I),a1:cang(V),r:40,col:'--blue',lb:fm(rd(cang(V)-cang(I),1))+'°'}],axes:['Real','j']})}

const L6_ERR=`<b>ملاحظات على الكتاب (هذا الدرس):</b><ol style="margin:6px 0 0;padding-inline-start:20px">
 <li>المثالان 1-2-1 و1-2-2: كُتب «المانعة» والمقصود «الممانعة»؛ وفي مثال 1-2-2 طُبع \\(V_C=-Jx_c I\\) والمقصود \\(-jX_C\\mathbf I\\).</li>
 <li>الشكل 1-24b ص 37: كُتبت زاوية \\(V_L\\) «66.8°» (منقولة من الشكل 1-20b)، والصحيح <b>59°</b> كما في الحل.</li>
 <li>مثال 1-2-3 ص 37: عند التحقق من \\(\\mathbf V=\\mathbf V_R+\\mathbf V_L+\\mathbf V_C\\) طُبعت المركبات \\(73.6-j44.3\\) و \\(61.9+j103.2\\) و \\(-35.5-j59\\) والمجموع «100 V». بالحساب من القيم القطبية نفسها: \\(73.7-j44.3\\) و \\(62.0+j103.2\\) و \\(-35.4-j59.0\\)، ومجموعها \\(100.3-j0.1\\approx100.3\\angle0^\\circ\\ \\text{V}\\). الفرق الصغير عن 100 سببه تقريب التيار إلى 17.2 A (الحساب بلا تقريب يعطي 100 تماماً). انظر المفتاح أدناه والحاسبة.</li>
 <li>في المختبر نحسب بـ \\(\\omega=2\\pi\\times60=376.99\\) وبلا تقريب، فتختلف بعض الأرقام قليلاً عن الكتاب (مثلاً \\(X_L=3.016\\) بدل 3).</li></ol>`;

lesson({
 id:'u1-l6',unit:1,order:6,pages:'32–38',
 title:'دوائر التوالي وقانون توزيع الجهد',
 summary:'في دائرة التوالي يمر نفس التيار في كل المعاوقات، فالمعاوقة المكافئة هي مجموعها ZT = RT + jXT، وزاويتها θ = tan⁻¹(XT/RT) هي تأخر التيار عن الجهد. شكل المعاوقة والمخطط الاتجاهي، ثم قانون توزيع الجهد VX = V·ZX/ZT. مع الأمثلة 1-2-1 إلى 1-2-4.',
 theory:[
  {h:'1-2-5 التوصيل على التوالي',ref:'ص 32',html:'<p>يبين الشكل 1-17 دائرة توالي وهي تتكون من مصدر جهد ومن معاوقات <b>يمر فيها نفس التيار</b>. ونستطيع تمثيل هذه المعاوقات بمعاوقة مكافئة \\(\\mathbf Z_T\\).</p>'},
  {fig:'1-17',ref:'ص 32',caption:'دائرة التوالي: مصدر V ومعاوقات Z<sub>1</sub> و Z<sub>2</sub> … Z<sub>N</sub> يمر فيها التيار I، وتحت كل معاوقة جهدها. يميناً الدائرة المكافئة بمعاوقة واحدة Z<sub>T</sub>.',draw:()=>`<div class="grid"><div class="c8">${box(serCkt([{k:'Z',top:'Z1',vl:'V1'},{k:'Z',top:'Z2',vl:'V2'},{k:'dots'},{k:'Z',top:'ZN',vl:'VN'}],{src:'V'}),620)}</div><div class="c4">${box(eqCkt(),220)}</div></div>`},
  {html:`<p>وباستعمال قانون كيرشوف للجهد \\(\\mathbf V=\\mathbf V_1+\\mathbf V_2+\\dots+\\mathbf V_N\\) وقانون أوم \\(\\mathbf V_x=\\mathbf Z_x\\mathbf I\\) و \\(\\mathbf V=\\mathbf Z_T\\mathbf I\\) حيث \\(x=1,2,\\dots,N\\)، نستنتج</p>
   $$\\mathbf Z_T=\\mathbf Z_1+\\mathbf Z_2+\\dots+\\mathbf Z_N \\qquad (1\\text{-}29)$$
   <p>والشكل العام للمعاوقة \\(\\mathbf Z_T\\) هو</p>$$\\mathbf Z_T=R_T+jX_T=Z_T\\angle\\theta \\qquad (1\\text{-}30)$$
   <p>والجزء الحقيقي \\(R_T\\) يمثل المقاومة الكلية وهو موجب، أو معدوم (إذا لم تكن هناك أي مقاومة في الدائرة). أما الجزء التخيلي \\(X_T\\) فيمثل الممانعة الكلية ويمكن أن يكون:</p>
   <ul><li><b>موجباً:</b> إذا كانت الممانعة الحثية الكلية أكبر من الممانعة السعوية الكلية.</li><li><b>معدوماً:</b> إذا تساوت الممانعتان الحثية والسعوية الكليتان، أو إذا لم تكن هناك أي ممانعة في الدائرة.</li><li><b>سالباً:</b> إذا كانت الممانعة الحثية الكلية أصغر من الممانعة السعوية الكلية.</li></ul>
   $$Z_T=\\sqrt{R_T^2+X_T^2} \\qquad (1\\text{-}31)$$ $$\\theta=\\tan^{-1}\\frac{X_T}{R_T} \\qquad (1\\text{-}32)$$
   <p>وتمثل هذه الزاوية <b>تأخر التيار المطاور عن الجهد المطاور</b>.</p>`},
  {h:'شكل المعاوقة (Impedance Diagram)',ref:'ص 33',html:'<p>يمكن توضيح المعاوقة في مستوى مركب. ولما كانت المقاومة لا تأخذ قيماً سالبة أبداً فإننا نحتاج إلى الربعين الأول والرابع فقط. ونسمي الشكل الناتج <b>بشكل المعاوقة</b>: المقاومة R ترسم على المحور الأفقي، والممانعة الحثية \\(X_L\\) على محور j الموجب، والممانعة السعوية \\(X_C\\) على محور j السالب.</p>'},
  {fig:'1-18',ref:'ص 33',caption:'أشكال المعاوقة: يميناً حمل حثي (Z في الربع الأول)، ويساراً حمل سعوي (Z في الربع الرابع).',draw:()=>`<div class="grid"><div class="c6">${box(impSVG(4,3,0,{zl:'Z',al:' '}),280)}</div><div class="c6">${box(impSVG(4,0,3,{zl:'Z',al:' '}),280)}</div></div>`},
  {h:'مثال 1-2-1 (دائرة R-L)',ref:'ص 33–34',html:`<p>في دائرة التوالي الموضحة في الشكل 1-19، \\(R=7\\ \\Omega\\)، \\(L=8\\ \\text{mH}\\)، \\(v=100\\sqrt2\\sin(377t)\\ \\text{V}\\). احسب المعاوقة المكافئة وارسم شكلها، ثم احسب التيار والجهدين \\(\\mathbf V_R\\) و \\(\\mathbf V_L\\)، وارسم المخطط الاتجاهي.</p>
   <p><b>الحل:</b></p>$$X_L=\\omega L=377\\times8\\times10^{-3}=3\\ \\Omega$$$$\\mathbf Z_T=7+j3=7.6\\angle23.2^\\circ\\ \\Omega$$$$\\mathbf V=100\\angle0^\\circ\\ \\text{V}$$$$\\mathbf I=\\frac{100\\angle0^\\circ}{7.6\\angle23.2^\\circ}=13.2\\angle-23.2^\\circ\\ \\text{A}$$$$\\mathbf V_R=7\\times13.2\\angle-23.2^\\circ=92.4\\angle-23.2^\\circ\\ \\text{V}$$$$\\mathbf V_L=3\\angle90^\\circ\\times13.2\\angle-23.2^\\circ=39.6\\angle66.8^\\circ\\ \\text{V}$$`},
  {fig:'1-19 و 1-20',ref:'ص 33–34',caption:'الدائرة (1-19)، وشكل المعاوقة (1-20a): 7 على محور R و j3 والوتر 7.6 بزاوية 23.2°، والمخطط الاتجاهي (1-20b): V أفقي، و I متأخر 23.2° وعليه V<sub>R</sub>، و V<sub>L</sub> عند 66.8°، و V = V<sub>R</sub> + V<sub>L</sub> (التيار مرسوم بمقياس مختلف).',draw:()=>`<div class="grid"><div class="c12">${box(serCkt([{k:'R',top:'R',val:'7 Ω'},{k:'L',top:'L',val:'8 mH'}],{src:'v'}),400)}</div><div class="c6">${box(impSVG(7,3,0,{zl:'7.6',xll:'j3',rl:'7',al:'23.2°'}),300)}</div><div class="c6">${box(serPhasor(Cx(100),pol(13.2,-23.2),pol(92.4,-23.2),pol(39.6,66.8)),340)}</div></div>`},
  {html:'<p>وعلى العموم فإن <b>التيار يتأخر عن الجهد بزاوية بين 0 و 90°</b> في أي دائرة توالي تحتوي على مقاومات وممانعات حثية (حمل مادي - حثي).</p>'},
  {h:'مثال 1-2-2 (دائرة R-C)',ref:'ص 34–36',html:`<p>احسب المعاوقة المكافئة للدائرة الموضحة في الشكل 1-21 وارسم شكلها، ثم ارسم المخطط الاتجاهي للتيار والجهود، علماً أن \\(R=5\\ \\Omega\\)، \\(C=332\\ \\mu F\\)، \\(v=200\\sqrt2\\sin(377t)\\ \\text{V}\\).</p>
   <p><b>الحل:</b></p>$$X_C=\\frac{1}{377\\times332\\times10^{-6}}=8\\ \\Omega$$$$\\mathbf Z_T=5-j8=9.4\\angle-58^\\circ\\ \\Omega$$$$\\mathbf I=\\frac{200\\angle0^\\circ}{9.4\\angle-58^\\circ}=21.3\\angle58^\\circ\\ \\text{A}$$$$\\mathbf V_R=106.5\\angle58^\\circ\\ \\text{V}$$$$\\mathbf V_C=-jX_C\\mathbf I=8\\angle-90^\\circ\\times21.3\\angle58^\\circ=170.4\\angle-32^\\circ\\ \\text{V}$$`},
  {fig:'1-21 و 1-22',ref:'ص 35–36',caption:'الدائرة (1-21)، وشكل المعاوقة (1-22a): 5 و −j8 والوتر 9.4 بزاوية −58°، والمخطط الاتجاهي (1-22b): I متقدم 58° وعليه V<sub>R</sub>، و V<sub>C</sub> عند −32°.',draw:()=>`<div class="grid"><div class="c12">${box(serCkt([{k:'R',top:'R',val:'5 Ω'},{k:'C',top:'C',val:'332 µF'}],{src:'v'}),400)}</div><div class="c6">${box(impSVG(5,0,8,{zl:'9.4',xcl:'−j8',rl:'5',al:'−58°'}),300)}</div><div class="c6">${box(serPhasor(Cx(200),pol(21.3,58),pol(106.5,58),null,pol(170.4,-32)),340)}</div></div>`},
  {html:'<p>وعلى العموم فإن <b>التيار يتقدم على الجهد بزاوية بين 0 و 90°</b> في أي دائرة توالي تحتوي على مقاومات وممانعات سعوية (حمل مادي - سعوي).</p>'},
  {h:'مثال 1-2-3 (دائرة R-L-C)',ref:'ص 36–37',html:`<p>في دائرة التوالي الموضحة في الشكل 1-23 احسب \\(\\mathbf Z_T\\) والتيار \\(\\mathbf I\\) وبين أن مجموع الهبوط في الجهد يساوي الجهد المؤثر، ثم ارسم شكل المعاوقة والمخطط الاتجاهي.</p>
   <p><b>الحل:</b></p>$$\\mathbf Z_T=5+j7-j4=5+j3=5.8\\angle31^\\circ\\ \\Omega$$$$\\mathbf I=\\frac{100\\angle0^\\circ}{5.8\\angle31^\\circ}=17.2\\angle-31^\\circ\\ \\text{A}$$$$\\mathbf V_R=86\\angle-31^\\circ$$$$\\mathbf V_L=7\\angle90^\\circ\\times17.2\\angle-31^\\circ=120.4\\angle59^\\circ$$$$\\mathbf V_C=4\\angle-90^\\circ\\times17.2\\angle-31^\\circ=68.8\\angle-121^\\circ\\ \\text{V}$$`},
  {widget:(el)=>{let v='book';const draw=()=>{el.innerHTML=`<figure class="fig"><h3 class="sm" style="margin:0">التحقق: \\(\\mathbf V=\\mathbf V_R+\\mathbf V_L+\\mathbf V_C\\) <span class="ref">ص 37</span></h3><div class="ca-row">${segHTML('k123',[['book','كما في الكتاب'],['fixed','المصحح']],v)}</div>
     <div class="callout${v==='book'?' err':''}">${B.tex(v==='book'?'\\mathbf V=(73.6-j44.3)+(61.9+j103.2)+(-35.5-j59)=100\\ \\text{V}':'\\mathbf V=(73.7-j44.3)+(62.0+j103.2)+(-35.4-j59.0)=100.3-j0.1\\approx100.3\\angle0^\\circ\\ \\text{V}',true)}${v==='book'?'هذه المركبات مطبوعة في الكتاب؛ ثلاث منها لا تطابق القيم القطبية التي قبلها (73.6 و 61.9 و −35.5).':'المركبات محسوبة بالقانون (1-15) من القيم القطبية نفسها. المجموع 100.3 وليس 100 بالضبط لأن التيار قُرّب إلى 17.2 A؛ بلا تقريب يكون المجموع 100 تماماً.'}</div></figure>`;B.math(el);segBind(el,'k123',x=>{v=x;draw()})};draw()}},
  {fig:'1-23 و 1-24',ref:'ص 36–37',caption:'الدائرة (1-23)، وشكل المعاوقة (1-24a): 5 و j7 ثم −j4 والوتر 5.8 بزاوية 31°، والمخطط الاتجاهي (1-24b): V<sub>L</sub> عند 59° (طُبعت 66.8° في الكتاب) و V<sub>C</sub> عند −121°.',draw:()=>`<div class="grid"><div class="c12">${box(serCkt([{k:'R',top:'ZR',val:'5 Ω'},{k:'L',top:'ZL',val:'j7 Ω'},{k:'C',top:'ZC',val:'−j4 Ω'}],{src:'100∠0° V'}),520)}</div><div class="c6">${box(impSVG(5,7,4,{zl:'5.8',xll:'j7',xcl:'−j4',rl:'5',al:'31°'}),300)}</div><div class="c6">${box(serPhasor(Cx(100),pol(17.2,-31),pol(86,-31),pol(120.4,59),pol(68.8,-121)),340)}</div></div>`},
  {html:'<p>في هذا المثال نرى أن المعاوقة حثية، ولهذا فإن التيار يتخلف عن الجهد المؤثر بزاوية 31° تساوي الإزاحة الزاوية للمعاوقة المكافئة. ونلاحظ أن هبوط الجهد \\(\\mathbf V_R\\) في المقاومة في اتجاه التيار، وأن \\(\\mathbf V_L\\) في الملف يتقدم عن التيار بزاوية 90°، بينما يتخلف \\(\\mathbf V_C\\) في المكثف عن التيار بزاوية 90°.</p>'},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب:</b> لاحظ أن جهد الملف (120.4 V) أكبر من جهد المصدر (100 V)! في التيار المتردد نجمع الجهود <b>جمعاً اتجاهياً</b> لا جبرياً، وجهدا الملف والمكثف متعاكسان فيلغي جزء منهما الآخر.'},
  {h:'1-2-6 قانون توزيع الجهد',ref:'ص 37–38',html:`<p>يتوزع الجهد في معاوقات دائرة التوالي حسب القانون التالي</p>$$\\mathbf V_X=\\mathbf V\\,\\frac{\\mathbf Z_X}{\\mathbf Z_T}$$
   <p>حيث \\(\\mathbf V_X\\) هو الجهد بين طرفي معاوقات متجاورة معاوقتها المكافئة \\(\\mathbf Z_X\\)، و \\(\\mathbf Z_T\\) المعاوقة المكافئة للدائرة، و \\(\\mathbf V\\) الجهد المؤثر.</p>
   <p><b>مثال 1-2-4:</b> احسب الجهود \\(\\mathbf V_R\\) و \\(\\mathbf V_L\\) و \\(\\mathbf V_C\\) و \\(\\mathbf V_1\\) في دائرة التوالي المبينة في الشكل 1-25، باستعمال قانون توزيع الجهد.</p>`},
  {fig:'1-25',ref:'ص 38',caption:'مصدر 100∠0° V ومقاومة 6 Ω وملف 7 Ω ومكثف 15 Ω على التوالي. الجهد V<sub>1</sub> بين نقطة الوصل بعد المقاومة والخط السفلي، أي على الملف والمكثف معاً.',draw:()=>box(serCkt([{k:'R',val:'6 Ω',vl:'VR'},{k:'L',val:'7 Ω',vl:'VL'},{k:'C',val:'15 Ω',vl:'VC'}],{src:'100∠0° V',v1:1}),520)},
  {html:`<p><b>الحل:</b> \\(\\mathbf Z_T=6+j7-j15=6-j8=10\\angle-53.1^\\circ\\ \\Omega\\)</p>
   $$\\mathbf V_R=\\frac{6\\angle0^\\circ\\times100\\angle0^\\circ}{10\\angle-53.1^\\circ}=60\\angle53.1^\\circ\\ \\text{V}\\qquad \\mathbf V_L=\\frac{7\\angle90^\\circ\\times100\\angle0^\\circ}{10\\angle-53.1^\\circ}=70\\angle143.1^\\circ\\ \\text{V}$$
   $$\\mathbf V_C=\\frac{15\\angle-90^\\circ\\times100\\angle0^\\circ}{10\\angle-53.1^\\circ}=150\\angle-36.9^\\circ\\ \\text{V}\\qquad \\mathbf V_1=\\frac{(7\\angle90^\\circ-15\\angle90^\\circ)\\,100\\angle0^\\circ}{10\\angle-53.1^\\circ}=\\frac{8\\angle-90^\\circ\\times100\\angle0^\\circ}{10\\angle-53.1^\\circ}=80\\angle-36.9^\\circ\\ \\text{V}$$`},
  {err:L6_ERR}
 ],
 lab:(el)=>{
  const W60=2*PI*60;
  const P={e1:{R:7,L:8,C:332,inc:{R:1,L:1,C:0},V:100,div:'R'},e2:{R:5,L:8,C:332,inc:{R:1,L:0,C:1},V:200,div:'C'},e3:{R:5,L:7/W60*1000,C:1e6/(W60*4),inc:{R:1,L:1,C:1},V:100,div:'L'},e4:{R:6,L:7/W60*1000,C:1e6/(W60*15),inc:{R:1,L:1,C:1},V:100,div:'LC'}};
  let R=7,Lm=8,Cu=332,f=60,V=100,inc={R:1,L:1,C:0},div='R',pre='e1',mod=0;const did={};
  el.innerHTML=ar(`<div class="grid ca-lab">
   <div class="panel c12"><h2>ابنِ دائرة التوالي <small>مبنية على الأشكال 1-17 إلى 1-25 والمعادلات 1-29 إلى 1-32 ص 32–38</small></h2>
    <div class="ca-row"><span class="sub">ضبط جاهز:</span>${segHTML('pre',[['e1','مثال 1-2-1 (R-L)'],['e2','مثال 1-2-2 (R-C)'],['e3','مثال 1-2-3 (R-L-C)'],['e4','مثال 1-2-4 (توزيع الجهد)']],pre)}</div>
    <div class="ca-row">${swHTML('l6iR','R','المقاومة موصلة',1)}${swHTML('l6iL','L','الملف موصل',1)}${swHTML('l6iC','C','المكثف موصل',0)}</div>
    <div class="svgbox" id="l6c" style="max-width:620px;margin-inline:auto"></div><p class="sub">العنصر غير الموصل نستبدله بسلك (مقصور). الجهد المظلل بالبرتقالي هو الجهد الذي تقيسه بقانون توزيع الجهد.</p></div>
   <div class="panel c4"><h2>القيم</h2>${sl('l6V','الجهد الفعال V (زاويته 0°)',1,250,1,V)}${sl('l6f','التردد f',1,200,1,f)}${sl('l6R','المقاومة R',0.5,50,0.5,R)}${sl('l6L','المحاثة L',0.5,200,0.5,Lm)}${sl('l6C','السعة C',10,2000,1,Cu)}</div>
   <div class="panel c4"><h2>شكل المعاوقة</h2><div class="svgbox" id="l6z" style="max-width:300px;margin-inline:auto"></div><div class="facts">${fact('X<sub>L</sub> = ωL','l6xl')}${fact('X<sub>C</sub> = 1/ωC','l6xc')}${fact('Z<sub>T</sub> (1-29)','l6zt')}${fact('Z<sub>T</sub>∠θ (1-31، 1-32)','l6zp')}</div><div class="ca-row"><span id="l6chip" class="ca-chip"></span></div></div>
   <div class="panel c4"><h2>المخطط الاتجاهي</h2><div class="svgbox" id="l6p" style="max-width:340px;margin-inline:auto"></div><p class="sub">التيار I مرسوم بمقياس مختلف. الخطوط المتقطعة تجمع الجهود رأساً بذيل.</p></div>
   <div class="panel c12"><h2>الجهود والتيار</h2><div class="facts">${fact('I = V / Z<sub>T</sub>','l6i')}${fact('V<sub>R</sub> = R I','l6vr')}${fact('V<sub>L</sub> = jX<sub>L</sub> I','l6vl')}${fact('V<sub>C</sub> = −jX<sub>C</sub> I','l6vc')}${fact('V<sub>R</sub> + V<sub>L</sub> + V<sub>C</sub>','l6sum')}</div>
    <h3 class="sm">قانون توزيع الجهد: اختر الجهد المطلوب</h3><div class="ca-row">${segHTML('dv',[['R','على R'],['L','على L'],['C','على C'],['LC','على L و C معاً (V₁)'],['RL','على R و L معاً']],div)}</div><div id="l6dv" class="callout"></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l6st"></ol></div></div>`);
  B.math(el);const $=s=>el.querySelector(s);
  const swSet=()=>['R','L','C'].forEach(k=>$('#l6i'+k).setAttribute('aria-pressed',inc[k]?'true':'false'));
  const sliders=()=>{[['l6V',V],['l6f',f],['l6R',R],['l6L',Lm],['l6C',Cu]].forEach(([i,v])=>$('#'+i).value=v)};
  const load=k=>{const p=P[k];R=p.R;Lm=p.L;Cu=p.C;inc=Object.assign({},p.inc);V=p.V;f=60;div=p.div;pre=k;mod=0;segSet(el,'dv',div);swSet();sliders();draw()};
  segBind(el,'pre',v=>load(v));segBind(el,'dv',v=>{div=v;draw()});
  ['R','L','C'].forEach(k=>$('#l6i'+k).onclick=()=>{inc[k]=inc[k]?0:1;if(!inc.R&&!inc.L&&!inc.C){inc[k]=1;return}mod=1;if(k==='C'&&!inc.C)did.offC=1;swSet();draw()});
  [['l6V',v=>V=v],['l6f',v=>f=v],['l6R',v=>R=v],['l6L',v=>Lm=v],['l6C',v=>Cu=v]].forEach(([i,fn])=>{$('#'+i).oninput=e=>{fn(+e.target.value);mod=1;draw()}});
  let st={};
  function draw(){const w=2*PI*f,XL=inc.L?w*Lm/1000:0,XC=inc.C?1/(w*Cu*1e-6):0,RR=inc.R?R:0;const ZR=Cx(RR),ZL=Cx(0,XL),ZC=Cx(0,-XC),Z=Cx(RR,XL-XC);
   const Vp=Cx(V),I=cabs(Z)<1e-9?Cx(0):cdiv(Vp,Z),VR=cmul(ZR,I),VL=cmul(ZL,I),VC=cmul(ZC,I);st={Z,I,VR,VL,VC};
   $('#l6V-v').textContent=V+' V';$('#l6f-v').textContent=f+' Hz';$('#l6R-v').textContent=fm(rd(R,2))+' Ω';$('#l6L-v').textContent=fm(rd(Lm,2))+' mH';$('#l6C-v').textContent=fm(rd(Cu,1))+' µF';
   const hl=k=>div===k||(div==='LC'&&(k==='L'||k==='C'))||(div==='RL'&&(k==='R'||k==='L'));
   const it=[inc.R?{k:'R',top:'R',val:fm(rd(R,2))+' Ω',vl:'VR',hl:hl('R')}:{k:'wire',top:'R'},inc.L?{k:'L',top:'L',val:'j'+fm(rd(XL,2))+' Ω',vl:'VL',hl:hl('L')}:{k:'wire',top:'L'},inc.C?{k:'C',top:'C',val:'−j'+fm(rd(XC,2))+' Ω',vl:'VC',hl:hl('C')}:{k:'wire',top:'C'}];
   $('#l6c').innerHTML=serCkt(it,{src:fm(V)+'∠0° V',v1:div==='LC'?1:null,I:'I = '+fP(I,2,1)+' A'});
   $('#l6z').innerHTML=impSVG(RR,XL,XC,{zl:'ZT'});
   $('#l6xl').textContent=inc.L?fm(rd(XL,3))+' Ω':'—';$('#l6xc').textContent=inc.C?fm(rd(XC,3))+' Ω':'—';$('#l6zt').textContent=fR(Z,3)+' Ω';$('#l6zp').textContent=fP(Z,3,2)+' Ω';
   const th=cang(Z),ch=$('#l6chip');ch.className='ca-chip '+(Math.abs(th)<0.05?'ok':th>0?'hot':'ld');ch.textContent=Math.abs(th)<0.05?'حمل مادي: التيار والجهد في طور واحد':th>0?`حمل حثي: التيار يتأخر ${fm(rd(th,2))}°`:`حمل سعوي: التيار يتقدم ${fm(rd(-th,2))}°`;
   $('#l6p').innerHTML=serPhasor(Vp,I,VR,inc.L?VL:null,inc.C?VC:null);
   $('#l6i').textContent=fP(I,3,2)+' A';$('#l6vr').textContent=fP(VR,2,2)+' V';$('#l6vl').textContent=inc.L?fP(VL,2,2)+' V':'—';$('#l6vc').textContent=inc.C?fP(VC,2,2)+' V':'—';$('#l6sum').textContent=fR(cadd(cadd(VR,VL),VC),2)+' V';
   const ZX={R:ZR,L:ZL,C:ZC,LC:cadd(ZL,ZC),RL:cadd(ZR,ZL)}[div],VX=cmul(Vp,cdiv(ZX,Z));const nm={R:'V_R',L:'V_L',C:'V_C',LC:'V_1',RL:'V_{RL}'}[div];
   $('#l6dv').innerHTML=`${B.tex(`\\mathbf ${nm}=\\mathbf V\\frac{\\mathbf Z_X}{\\mathbf Z_T}=\\frac{(${fR(ZX,2).replace('j','j\\,')})\\times${fm(V)}\\angle0^\\circ}{${fm(rd(cabs(Z),3))}\\angle${fm(rd(th,2))}^\\circ}=${fm(rd(cabs(VX),2))}\\angle${fm(rd(cang(VX),2))}^\\circ\\ \\text{V}`,true)}`;}
  const steps=stepsUI($('#l6st'),[
   {t:'حمل مادي - حثي (مثال 1-2-1)',x:'اختر «مثال 1-2-1»: \\(\\mathbf Z_T\\approx7+j3\\) والتيار يتأخر عن الجهد نحو 23°. (الكتاب يقرب: 7.6∠23.2° و 13.2 A.)',done:()=>pre==='e1'&&!mod},
   {t:'حمل مادي - سعوي (مثال 1-2-2)',x:'اختر «مثال 1-2-2»: الزاوية سالبة (−58°) فالتيار <b>يتقدم</b>، و \\(V_C\\approx170\\ \\text{V}\\).',done:()=>pre==='e2'&&!mod},
   {t:'الجمع الاتجاهي (مثال 1-2-3)',x:'اختر «مثال 1-2-3»: \\(V_L\\approx120\\ \\text{V}\\) أكبر من جهد المصدر 100 V! ومع ذلك \\(\\mathbf V_R+\\mathbf V_L+\\mathbf V_C=100+j0\\) — انظر الخطوط المتقطعة في المخطط.',done:()=>pre==='e3'&&!mod},
   {t:'قانون توزيع الجهد (مثال 1-2-4)',x:'اختر «مثال 1-2-4» ثم «على L و C معاً (V₁)»: \\(\\mathbf V_1=80\\angle-36.9^\\circ\\ \\text{V}\\).',done:()=>pre==='e4'&&div==='LC'},
   {t:'اجعل X<sub>T</sub> = 0',x:'بنفس الدائرة حرّك السعة C (أو المحاثة) حتى تصبح زاوية المعاوقة صفراً تقريباً (أقل من 1°): يصبح \\(\\mathbf Z_T=R\\) والتيار في طور الجهد وأكبر ما يمكن — هذا هو الرنين (الدرس القادم).',done:()=>inc.L&&inc.C&&inc.R&&mod&&Math.abs(cang(st.Z))<1},
   {t:'افصل المكثف',x:'اضغط مفتاح C لفصل المكثف (نستبدله بسلك): تصبح الدائرة R-L ويتأخر التيار.',done:()=>did.offC}
  ]);
  draw();loopOn(el,()=>steps.check());
 },
 examples:[
  {title:'مثال 1-2-1',ref:'ص 33–34',q:'<p>في دائرة التوالي الموضحة في الشكل 1-19، \\(R=7\\ \\Omega\\)، \\(L=8\\ \\text{mH}\\)، \\(v=100\\sqrt2\\sin(377t)\\ \\text{V}\\). احسب المعاوقة المكافئة، ثم التيار المار في الدائرة والجهدين \\(\\mathbf V_R\\) و \\(\\mathbf V_L\\).</p>'+box(serCkt([{k:'R',top:'R',val:'7 Ω'},{k:'L',top:'L',val:'8 mH'}],{src:'v'}),380),
   given:[{id:'R',label:'المقاومة',sym:'R',unit:'Ω',value:7},{id:'L',label:'المحاثة',sym:'L',unit:'mH',value:8},{id:'V',label:'الجهد الفعال',sym:'V',unit:'V',value:100},{id:'w',label:'التردد الزاوي',sym:'\\omega',unit:'rad/s',value:377}],
   solve:g=>{const XL=rd(g.w*g.L/1000,1),Z=rd(Math.hypot(g.R,XL),1),th=rd(Math.atan2(XL,g.R)/D,1),I=rd(g.V/Z,1);return [
    {t:'الممانعة الحثية:',f:`X_L=\\omega L=${fm(g.w)}\\times${fm(g.L)}\\times10^{-3}`,v:XL,unit:'Ω'},
    {t:'المعاوقة المكافئة:',f:`\\mathbf Z_T=R+jX_L=${fm(g.R)}+j${fm(XL)}`,v:fPm(Z,th),unit:'Ω'},
    {t:'الجهد الكلي:',v:fPm(g.V,0),unit:'V'},
    {t:'التيار:',f:`\\mathbf I=\\frac{${fm(g.V)}\\angle0^\\circ}{${fm(Z)}\\angle${fm(th)}^\\circ}`,v:fPm(I,-th),unit:'A',final:true},
    {t:'الجهد بين طرفي المقاومة:',f:`\\mathbf V_R=R\\,\\mathbf I=${fm(g.R)}\\times${fm(I)}\\angle${fm(-th)}^\\circ`,v:fPm(rd(g.R*I,1),-th),unit:'V',final:true},
    {t:'الجهد بين طرفي الحثية:',f:`\\mathbf V_L=jX_L\\mathbf I=${fm(XL)}\\angle90^\\circ\\times${fm(I)}\\angle${fm(-th)}^\\circ`,v:fPm(rd(XL*I,1),rd(90-th,1)),unit:'V',final:true}]},
   note:'الحاسبة تقرب كالكتاب: \\(X_L\\) و \\(Z_T\\) والتيار إلى رقم عشري واحد (الدقيق \\(X_L=3.016\\) و \\(I=13.12\\ \\text{A}\\)).'},
  {title:'مثال 1-2-2',ref:'ص 34–36',q:'<p>احسب المعاوقة المكافئة للدائرة الموضحة في الشكل 1-21، ثم التيار والجهود \\(\\mathbf V_R\\) و \\(\\mathbf V_C\\)، علماً أن \\(R=5\\ \\Omega\\)، \\(C=332\\ \\mu F\\)، \\(v=200\\sqrt2\\sin(377t)\\ \\text{V}\\).</p>'+box(serCkt([{k:'R',top:'R',val:'5 Ω'},{k:'C',top:'C',val:'332 µF'}],{src:'v'}),380),
   given:[{id:'R',label:'المقاومة',sym:'R',unit:'Ω',value:5},{id:'C',label:'السعة',sym:'C',unit:'µF',value:332},{id:'V',label:'الجهد الفعال',sym:'V',unit:'V',value:200},{id:'w',label:'التردد الزاوي',sym:'\\omega',unit:'rad/s',value:377}],
   solve:g=>{const XC=rd(1/(g.w*g.C*1e-6),1),Z=rd(Math.hypot(g.R,XC),1),th=rd(Math.atan2(-XC,g.R)/D,1),I=rd(g.V/Z,1);return [
    {t:'الممانعة السعوية:',f:`X_C=\\frac{1}{\\omega C}=\\frac{1}{${fm(g.w)}\\times${fm(g.C)}\\times10^{-6}}`,v:XC,unit:'Ω'},
    {t:'المعاوقة المكافئة:',f:`\\mathbf Z_T=R-jX_C=${fm(g.R)}-j${fm(XC)}`,v:fPm(Z,th),unit:'Ω'},
    {t:'التيار:',f:`\\mathbf I=\\frac{${fm(g.V)}\\angle0^\\circ}{${fm(Z)}\\angle${fm(th)}^\\circ}`,v:fPm(I,-th),unit:'A',final:true},
    {t:'الجهد بين طرفي المقاومة:',f:`\\mathbf V_R=R\\,\\mathbf I`,v:fPm(rd(g.R*I,1),-th),unit:'V',final:true},
    {t:'الجهد بين طرفي المكثفة:',f:`\\mathbf V_C=-jX_C\\mathbf I=${fm(XC)}\\angle-90^\\circ\\times${fm(I)}\\angle${fm(-th)}^\\circ`,v:fPm(rd(XC*I,1),rd(-th-90,1)),unit:'V',final:true}]}},
  {title:'مثال 1-2-3',ref:'ص 36–37',q:'<p>في دائرة التوالي الموضحة في الشكل 1-23 احسب المعاوقة المكافئة \\(\\mathbf Z_T\\) والتيار \\(\\mathbf I\\) وبين أن مجموع الهبوط في الجهد يساوي الجهد المطاور المؤثر.</p>'+box(serCkt([{k:'R',top:'ZR',val:'5 Ω'},{k:'L',top:'ZL',val:'j7 Ω'},{k:'C',top:'ZC',val:'−j4 Ω'}],{src:'100∠0° V'}),480),
   given:[{id:'R',label:'المقاومة',sym:'R',unit:'Ω',value:5},{id:'XL',label:'الممانعة الحثية',sym:'X_L',unit:'Ω',value:7},{id:'XC',label:'الممانعة السعوية',sym:'X_C',unit:'Ω',value:4},{id:'V',label:'الجهد',sym:'V',unit:'V',value:100}],
   solve:(g,B,isBook)=>{const X=g.XL-g.XC,Z=rd(Math.hypot(g.R,X),1),th=rd(Math.atan2(X,g.R)/D,0),I=rd(g.V/Z,1);const vr=rd(g.R*I,1),vl=rd(g.XL*I,1),vc=rd(g.XC*I,1),aR=-th,aL=90-th,aC=-90-th;
    const VR=pol(vr,aR),VL=pol(vl,aL),VC=pol(vc,aC),Sm=cadd(cadd(VR,VL),VC);const out=[
    {t:'المعاوقة المكافئة:',f:`\\mathbf Z_T=${fm(g.R)}+j${fm(g.XL)}-j${fm(g.XC)}=${fm(g.R)}${X<0?'-':'+'}j${fm(Math.abs(X))}`,v:fPm(Z,th),unit:'Ω'},
    {t:'التيار:',f:`\\mathbf I=\\frac{${fm(g.V)}\\angle0^\\circ}{${fm(Z)}\\angle${fm(th)}^\\circ}`,v:fPm(I,-th),unit:'A',final:true},
    {t:'الجهود:',f:`\\mathbf V_R=${fm(vr)}\\angle${fm(aR)}^\\circ\\ ;\\ \\mathbf V_L=${fm(vl)}\\angle${fm(aL)}^\\circ\\ ;\\ \\mathbf V_C=${fm(vc)}\\angle${fm(aC)}^\\circ\\ \\text{V}`}];
    if(isBook)out.push({t:'التحقق كما طُبع في الكتاب:',f:'\\mathbf V=(73.6-j44.3)+(61.9+j103.2)+(-35.5-j59)',v:100,unit:'V'},{t:'المصحح (المركبات محسوبة بالقانون 1-15 من القيم نفسها):',f:`\\mathbf V=(${fR(VR,1)})+(${fR(VL,1)})+(${fR(VC,1)})`.replace(/j/g,'j\\,'),v:fR(Sm,1)+' = '+fP(Sm,1,0),unit:'V',final:true});
    else out.push({t:'التحقق: مجموع الجهود',f:`\\mathbf V=(${fR(VR,1)})+(${fR(VL,1)})+(${fR(VC,1)})`.replace(/j/g,'j\\,'),v:fR(Sm,1)+' = '+fP(Sm,1,0),unit:'V',final:true});
    return out},
   note:'<b>ملاحظة على الكتاب:</b> مركبات التحقق المطبوعة (73.6 و 61.9 و −35.5) لا تطابق القيم القطبية تماماً، والمجموع الصحيح من هذه القيم المقربة \\(100.3\\angle0^\\circ\\) (الفرق من تقريب التيار). الحاسبة تعرض الرقمين بقيم الكتاب. والكتاب يقرب زاوية \\(Z_T\\) هنا إلى عدد صحيح (31°).'},
  {title:'مثال 1-2-4',ref:'ص 37–38',q:'<p>احسب الجهود \\(\\mathbf V_R\\) و \\(\\mathbf V_L\\) و \\(\\mathbf V_C\\) و \\(\\mathbf V_1\\) في دائرة التوالي المبينة في الشكل 1-25، باستعمال قانون توزيع الجهد.</p>'+box(serCkt([{k:'R',val:'6 Ω',vl:'VR'},{k:'L',val:'7 Ω',vl:'VL'},{k:'C',val:'15 Ω',vl:'VC'}],{src:'100∠0° V',v1:1}),480),
   given:[{id:'R',label:'المقاومة',sym:'R',unit:'Ω',value:6},{id:'XL',label:'الممانعة الحثية',sym:'X_L',unit:'Ω',value:7},{id:'XC',label:'الممانعة السعوية',sym:'X_C',unit:'Ω',value:15},{id:'V',label:'الجهد',sym:'V',unit:'V',value:100}],
   solve:g=>{const X=g.XL-g.XC,Z=rd(Math.hypot(g.R,X),1),th=rd(Math.atan2(X,g.R)/D,1);const r=(m,a)=>fPm(rd(m*g.V/Z,1),rd(a-th,1));const X1=Math.abs(X),a1=X<0?-90:90;return [
    {t:'المعاوقة المكافئة:',f:`\\mathbf Z_T=${fm(g.R)}+j${fm(g.XL)}-j${fm(g.XC)}=${fm(g.R)}${X<0?'-':'+'}j${fm(X1)}`,v:fPm(Z,th),unit:'Ω'},
    {t:'بقانون توزيع الجهد:',f:`\\mathbf V_R=\\frac{${fm(g.R)}\\angle0^\\circ\\times${fm(g.V)}\\angle0^\\circ}{${fm(Z)}\\angle${fm(th)}^\\circ}`,v:r(g.R,0),unit:'V',final:true},
    {f:`\\mathbf V_L=\\frac{${fm(g.XL)}\\angle90^\\circ\\times${fm(g.V)}\\angle0^\\circ}{${fm(Z)}\\angle${fm(th)}^\\circ}`,v:r(g.XL,90),unit:'V',final:true},
    {f:`\\mathbf V_C=\\frac{${fm(g.XC)}\\angle-90^\\circ\\times${fm(g.V)}\\angle0^\\circ}{${fm(Z)}\\angle${fm(th)}^\\circ}`,v:r(g.XC,-90),unit:'V',final:true},
    {t:'الجهد \\(V_1\\) على الملف والمكثف معاً:',f:`\\mathbf V_1=\\frac{(${fm(g.XL)}\\angle90^\\circ-${fm(g.XC)}\\angle90^\\circ)\\,${fm(g.V)}\\angle0^\\circ}{${fm(Z)}\\angle${fm(th)}^\\circ}=\\frac{${fm(X1)}\\angle${a1}^\\circ\\times${fm(g.V)}\\angle0^\\circ}{${fm(Z)}\\angle${fm(th)}^\\circ}`,v:r(X1,a1),unit:'V',final:true}]}}
 ],
 quiz:[
  {q:'في دائرة التوالي:',o:['الجهد واحد على كل المعاوقات','التيار واحد في كل المعاوقات','التيار يتوزع على المعاوقات','المعاوقة الكلية أصغر معاوقة'],c:1,e:'ص 32.'},
  {q:'المعاوقة المكافئة لمعاوقات على التوالي:',o:['مجموع مقلوباتها','مجموعها الاتجاهي (المركب)','حاصل ضربها','مجموع قيمها المطلقة دائماً'],c:1,e:'المعادلة (1-29).'},
  {q:'\\(\\mathbf Z_T=6+j8\\). قيمتها وزاويتها:',o:['14∠53.1°','10∠53.1°','10∠36.9°','10∠−53.1°'],c:1,e:'\\(\\sqrt{36+64}=10\\)، \\(\\tan^{-1}(8/6)=53.1^\\circ\\).'},
  {q:'إذا كان \\(X_T\\) سالباً فالحمل:',o:['حثي والتيار متأخر','سعوي والتيار متقدم','مادي','لا يمر تيار'],c:1,e:'ص 32 و 36.'},
  {q:'في دائرة R-L على التوالي يتأخر التيار عن الجهد بزاوية:',o:['90° تماماً','بين 0 و 90°','بين 90° و 180°','صفر دائماً'],c:1,e:'ص 34.'},
  {q:'في المخطط الاتجاهي لدائرة التوالي يكون \\(\\mathbf V_R\\):',o:['متقدماً على التيار 90°','في اتجاه التيار','متأخراً 90°','عكس التيار'],c:1,e:'ص 37.'},
  {q:'قانون توزيع الجهد:',o:['\\(\\mathbf V_X=\\mathbf V\\,\\mathbf Z_T/\\mathbf Z_X\\)','\\(\\mathbf V_X=\\mathbf V\\,\\mathbf Z_X/\\mathbf Z_T\\)','\\(\\mathbf V_X=\\mathbf I/\\mathbf Z_X\\)','\\(\\mathbf V_X=\\mathbf V-\\mathbf Z_X\\)'],c:1,e:'ص 37.'},
  {q:'هل يمكن أن يكون جهد الملف في دائرة توالي أكبر من جهد المصدر؟',o:['لا أبداً','نعم، لأن الجهود تجمع اتجاهياً وجهدا L و C متعاكسان','فقط في التيار المستمر','فقط إذا لم توجد مقاومة'],c:1,e:'مثال 1-2-3: \\(V_L=120.4\\ \\text{V}\\) والمصدر 100 V.'}
 ]
});

/* ======================================================================
   Lesson 7 — series resonance
   ====================================================================== */
function fig126(){const fr=1;return plotSVG({w:460,h:220,x0:0,x1:2,y0:0,y1:1.15,xt:[1],xf:()=>'fr',yt:[],xl:'f',yl:'V or I',cid:'c126',series:[{pts:Array.from({length:201},(_,i)=>{const f=i/100+1e-3;const x=8*(f-1/f);return [f,1/Math.sqrt(1+x*x)]}),col:'--live',w:2.6}]})}
function resPhasor(o){o=o||{};const vl=o.vl||1.4,vr=o.vr||1,ii=o.i||0.5;return phasorSVG({w:o.w||300,h:o.h||280,vecs:[{x:0,y:vl,col:'--live',lb:'VL'},{x:0,y:-vl,col:'--stop',lb:'VC'},{x:vr,y:0,col:'--on',lb:'VR',lbN:12,wd:3},{x:vr,y:0,col:'--fg',dash:'5 4',wd:1.4,lb:'Vs',lbN:-14},{x:ii,y:0,col:'--blue',lb:'I',lbN:14,wd:2}],axes:['','']})}

const L7_ERR=`<b>ملاحظات على الكتاب (هذا الدرس):</b><ol style="margin:6px 0 0;padding-inline-start:20px">
 <li>يستعمل الكتاب \\(f_r\\) في النص والشكل 1-26، و \\(f_s\\) و \\(\\omega_s\\) في المعادلتين 1-35 و1-36 للشيء نفسه (تردد الرنين).</li>
 <li>مثال 1-2-6 ص 42: البند الثاني من الحل مرقم «ت» والمقصود «ب».</li>
 <li>المثالان لا يذكران التردد ولا قيم L و C؛ يعطيان الممانعات عند الرنين فقط. في المختبر اخترنا تردد رنين <span class="ltr">60 Hz</span> وحسبنا منه L و C (اختيار توضيحي — ليس من الكتاب).</li></ol>`;

lesson({
 id:'u1-l7',unit:1,order:7,pages:'38–42',
 title:'الرنين في دوائر التوالي',
 summary:'دائرة RLC على التوالي تعطي أكبر تيار عند تردد واحد: تردد الرنين، حيث XL = XC فتصبح المعاوقة ZT = R فقط، والتيار في طور الجهد، و fs = 1/(2π√LC). منحنى الاستجابة وانتقاء الترددات (كالراديو)، والمخطط الاتجاهي عند الرنين، مع المثالين 1-2-5 و1-2-6.',
 theory:[
  {h:'1-2-7 الرنين في دوائر التوالي',ref:'ص 38–39',html:`<p>دوائر الرنين من الدوائر الضرورية لتشغيل كثير من الأنظمة الكهربائية والإلكترونية، وهي تشكيل من العناصر الأساسية R-L-C. يوضح الشكل 1-26 <b>منحنى الاستجابة</b> لدائرة رنين، وهو تغير القيمة الفعالة للجهد بين طرفي أحد مكونات الدائرة أو التيار المار فيها بدلالة تردد جهد المصدر. وكما نرى فإن الاستجابة القصوى تحدث عندما يساوي التردد \\(f_r\\)، وتقل الاستجابة إلى اليمين وإلى اليسار من \\(f_r\\)؛ بمعنى آخر: <b>دائرة الرنين تنتقي مدى معيناً من الترددات</b> تكون الاستجابة عنده قريبة من القيمة القصوى.</p>
   <p>دائرة الاستقبال في جهاز الراديو أو التلفزيون لها منحنى استجابة مشابه، وبالتالي لا يمكن التقاط أي محطة إلا بعد ضبط التردد على \\(f_r\\) أو قريباً منه، أما المحطات التي ترسل على ترددات بعيدة عن \\(f_r\\) فلا تلتقط. وعندما نحصل على استجابة قصوى نقول إن الدائرة في <b>حالة رنين</b>، وهذا يحدث عند <b>تردد الرنين</b> \\(f_r\\).</p>`},
  {fig:'1-26',ref:'ص 39',caption:'منحنى الاستجابة لدائرة رنين: القمة عند f<sub>r</sub> والمنحنى ينزل متماثلاً تقريباً على الجانبين.',draw:()=>box(fig126(),460)},
  {html:'<p>وهناك نوعان من دوائر الرنين: الموصلة على <b>التوالي</b> والموصلة على <b>التوازي</b>. ندرس هنا دوائر التوالي، ونرجئ دوائر التوازي إلى ما بعد. يوضح الشكل 1-27 دائرة الرنين على التوالي حيث \\(R_L\\) المقاومة الداخلية للملف، و \\(R_s\\) مقاومة المصدر إضافة إلى أي مقاومة أخرى مضافة للتأثير على شكل منحنى الاستجابة.</p>'},
  {fig:'1-27',ref:'ص 39',caption:'دائرة الرنين الموصلة على التوالي: R<sub>s</sub> ثم الملف الحقيقي (المستطيل المتقطع: R<sub>L</sub> و X<sub>L</sub>) ثم المكثف X<sub>C</sub>.',draw:()=>box(serCkt([{k:'R',top:'Rs'},{k:'R',top:'RL'},{k:'L',top:'XL'},{k:'C',top:'XC'}],{src:'Vs',box:[1,2]}),620)},
  {html:`<p>اعتبر أن \\(R=R_s+R_L\\)، إذن المعاوقة الكلية لهذه الدائرة هي</p>$$\\mathbf Z_T=R+jX_L-jX_C=R+j(X_L-X_C)$$
   <p>الرنين يحدث عندما</p>$$X_L=X_C \\qquad (1\\text{-}33)$$<p>إذن المعاوقة الكلية عند حدوث الرنين هي</p>$$\\mathbf Z_T=R \\qquad (1\\text{-}34)$$
   <p>ويمكن الحصول على تردد الرنين بدلالة المحاثة L والسعة C من المعادلة 1-33، بما أن \\(X_L=\\omega_sL\\) و \\(X_C=\\frac{1}{\\omega_sC}\\):</p>
   $$\\omega_sL=\\frac{1}{\\omega_sC}\\ \\Rightarrow\\ \\omega_s^2LC=1\\ \\Rightarrow\\ \\omega_s=\\frac{1}{\\sqrt{LC}} \\qquad (1\\text{-}35)$$
   <p>ويكون تردد الرنين</p>$$f_s=\\frac{\\omega_s}{2\\pi}=\\frac{1}{2\\pi\\sqrt{LC}} \\qquad (1\\text{-}36)$$
   <p>التيار خلال الدائرة أثناء الرنين هو</p>$$\\mathbf I=I\\angle\\theta_i=\\frac{V_s\\angle\\theta_V}{R}=\\frac{V_s}{R}\\angle\\theta_V$$
   <p>ويلاحظ أن <b>التيار يصل إلى أعلى قيمة له عند حدوث الرنين</b>، وأن التيار وجهد المصدر لهما <b>نفس زاوية الطور</b> \\((\\theta_V=\\theta_i)\\). وبما أن نفس التيار يمر خلال الملف والمكثف فإن <b>الجهد عبر كل منهما متساوٍ في المقدار ومختلف في زاوية الطور بمقدار 180°</b>. ويمثل الشكل 1-28 المخطط الاتجاهي للجهود والتيار، وكما نلاحظ فإن الجهد بين طرفي المقاومة يساوي جهد المصدر عند حدوث الرنين.</p>`},
  {fig:'1-28',ref:'ص 41',caption:'المخطط الاتجاهي لدائرة الرنين عند حدوث الرنين: V<sub>L</sub> لأعلى و V<sub>C</sub> لأسفل بنفس الطول فيلغي أحدهما الآخر، و I أفقي وعليه V<sub>R</sub>، و V<sub>s</sub> (متقطع) منطبق على V<sub>R</sub>.',draw:()=>box(resPhasor(),300)},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب:</b> عند الرنين قد يكون جهد الملف وجهد المكثف <b>أكبر بكثير من جهد المصدر</b> (في مثال 1-2-5: 50 V على كل منهما والمصدر 10 V فقط، أي خمسة أضعاف). النسبة \\(V_L/V_s=X_L/R\\)، وكلما صغرت المقاومة كبرت هذه النسبة وضاق منحنى الاستجابة. لذلك يجب أن يتحمل المكثف هذا الجهد العالي. ولاحظ أيضاً: تحت \\(f_r\\) تكون \\(X_C>X_L\\) فالدائرة سعوية، وفوقه تكون حثية.'},
  {h:'مثال 1-2-5',ref:'ص 41',html:'<p>في دائرة الرنين الموضحة في الشكل 1-29 أوجد I و V<sub>R</sub> و V<sub>L</sub> و V<sub>C</sub>.</p>'},
  {fig:'1-29',ref:'ص 41',caption:'مصدر 10∠0° V ومقاومة 2 Ω وملف 10 Ω ومكثف 10 Ω على التوالي.',draw:()=>box(serCkt([{k:'R',val:'2 Ω',vl:'VR'},{k:'L',val:'10 Ω',vl:'VL'},{k:'C',val:'10 Ω',vl:'VC'}],{src:'10∠0° V'}),520)},
  {html:'<p><b>الحل:</b> عند حدوث الرنين </p>$$\\mathbf Z_T=R=2\\ \\Omega$$$$\\mathbf I=\\frac{10\\angle0^\\circ}{2\\angle0^\\circ}=5\\angle0^\\circ\\ \\text{A}$$$$\\mathbf V_R=5\\angle0^\\circ\\times2=10\\angle0^\\circ\\ \\text{V}$$$$\\mathbf V_L=5\\angle0^\\circ\\times10\\angle90^\\circ=50\\angle90^\\circ\\ \\text{V}$$$$\\mathbf V_C=5\\angle0^\\circ\\times10\\angle-90^\\circ=50\\angle-90^\\circ\\ \\text{V}$$'},
  {h:'مثال 1-2-6',ref:'ص 42',html:'<p>في دائرة الرنين الموضحة في الشكل 1-30 أوجد: أ- قيمة \\(X_C\\) عند الرنين. ب- قيمة التيار I وقيم الجهود V<sub>R</sub> و V<sub>C</sub> و V<sub>L</sub> عند الرنين.</p>'},
  {fig:'1-30',ref:'ص 42',caption:'مصدر 50∠0° V ومقاومة 5 Ω وملف 30 Ω ومكثف مجهول.',draw:()=>box(serCkt([{k:'R',val:'5 Ω',vl:'VR'},{k:'L',val:'30 Ω',vl:'VL'},{k:'C',val:'?',vl:'VC'}],{src:'50∠0° V'}),520)},
  {html:'<p><b>الحل:</b> أ- عند الرنين </p>$$X_C=X_L=30\\ \\Omega$$<p>ب- عند الرنين</p>$$\\mathbf I=\\frac{50\\angle0^\\circ}{5\\angle0^\\circ}=10\\angle0^\\circ\\ \\text{A}$$$$\\mathbf V_R=\\mathbf V_s=50\\angle0^\\circ\\ \\text{V}$$$$\\mathbf V_L=10\\angle0^\\circ\\times30\\angle90^\\circ=300\\angle90^\\circ\\ \\text{V}$$$$\\mathbf V_C=10\\angle0^\\circ\\times30\\angle-90^\\circ=300\\angle-90^\\circ\\ \\text{V}$$'},
  {err:L7_ERR}
 ],
 lab:(el)=>{
  const W60=2*PI*60;const P={e5:{Rs:2,RL:0,L:10/W60*1000,C:1e6/(W60*10),V:10},e6:{Rs:5,RL:0,L:30/W60*1000,C:1e6/(W60*30),V:50}};
  let Rs=2,RL=0,Lm=P.e5.L,Cu=P.e5.C,V=10,f=60,qty='I',pre='e5',mod=0;const did={};let C0=Cu;
  el.innerHTML=ar(`<div class="grid ca-lab">
   <div class="panel c12"><h2>دائرة الرنين على التوالي <small>مبنية على الأشكال 1-26 إلى 1-30 والمعادلات 1-33 إلى 1-36 ص 38–42</small></h2>
    <div class="ca-row"><span class="sub">ضبط جاهز:</span>${segHTML('pre',[['e5','مثال 1-2-5'],['e6','مثال 1-2-6']],pre)}<span class="sub">(تردد الرنين في الضبطين 60 Hz — اختيار توضيحي، الكتاب يعطي الممانعات فقط)</span></div>
    <div class="svgbox" id="l7c" style="max-width:620px;margin-inline:auto"></div></div>
   <div class="panel c4"><h2>القيم</h2>${sl('l7f','تردد المصدر f',1,300,0.1,f)}<div class="ca-row"><button class="btn primary" id="l7tune">اضبط f على تردد الرنين</button></div>
    ${sl('l7V','جهد المصدر V<sub>s</sub>',1,100,1,V)}${sl('l7Rs','R<sub>s</sub> (المصدر + مقاومة مضافة)',0,30,0.5,Rs)}${sl('l7RL','R<sub>L</sub> (مقاومة الملف الداخلية)',0,20,0.5,RL)}${sl('l7L','المحاثة L',1,200,0.1,Lm)}${sl('l7C','السعة C',10,1000,0.1,Cu)}</div>
   <div class="panel c8"><h2>منحنى الاستجابة <small>الشكل 1-26</small></h2><div class="ca-row">${segHTML('q',[['I','التيار I'],['VR','V<sub>R</sub>'],['VL','V<sub>L</sub>'],['VC','V<sub>C</sub>']],qty)}</div><div class="svgbox" id="l7r"></div>
    <p class="sub">النقطة البرتقالية = تردد المصدر الآن، والخط المتقطع = تردد الرنين f<sub>s</sub>.</p></div>
   <div class="panel c4"><h2>المخطط الاتجاهي <small>الشكل 1-28</small></h2><div class="svgbox" id="l7p" style="max-width:320px;margin-inline:auto"></div><div class="ca-row"><span id="l7chip" class="ca-chip"></span></div></div>
   <div class="panel c8"><h2>الحساب</h2><div class="facts">${fact('ω<sub>s</sub> = 1/√LC (1-35)','l7ws')}${fact('f<sub>s</sub> (1-36)','l7fs')}${fact('X<sub>L</sub>','l7xl')}${fact('X<sub>C</sub>','l7xc')}${fact('Z<sub>T</sub> = R + j(X<sub>L</sub> − X<sub>C</sub>)','l7z')}${fact('I','l7i')}${fact('V<sub>R</sub>','l7vr')}${fact('V<sub>L</sub>','l7vl')}${fact('V<sub>C</sub>','l7vc')}${fact('V<sub>L</sub> / V<sub>s</sub>','l7k')}</div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l7st"></ol></div></div>`);
  B.math(el);const $=s=>el.querySelector(s);
  const fs=()=>1/(2*PI*Math.sqrt(Lm*1e-3*Cu*1e-6));
  const sync=()=>[['l7f',f],['l7V',V],['l7Rs',Rs],['l7RL',RL],['l7L',Lm],['l7C',Cu]].forEach(([i,v])=>$('#'+i).value=v);
  const load=k=>{const p=P[k];Rs=p.Rs;RL=p.RL;Lm=p.L;Cu=p.C;V=p.V;f=60;pre=k;mod=0;C0=Cu;sync()};
  segBind(el,'pre',v=>load(v));segBind(el,'q',v=>{qty=v});
  $('#l7tune').onclick=()=>{f=fs();$('#l7f').value=f;if(Math.abs(Cu-C0)>0.05)did.retune=1};
  [['l7f',v=>f=v],['l7V',v=>{V=v;mod=1}],['l7Rs',v=>{Rs=v;mod=1}],['l7RL',v=>{RL=v;mod=1}],['l7L',v=>{Lm=v;mod=1}],['l7C',v=>{Cu=v;mod=1}]].forEach(([i,fn])=>{$('#'+i).oninput=e=>fn(+e.target.value)});
  const calc=ff=>{const w=2*PI*ff,R=Rs+RL,XL=w*Lm/1000,XC=1/(w*Cu*1e-6),Z=Cx(R,XL-XC),I=cabs(Z)<1e-12?0:V/cabs(Z);return {R,XL,XC,Z,I,VR:I*R,VL:I*XL,VC:I*XC}};
  const near=()=>Math.abs(f-fs())<0.5;
  const steps=stepsUI($('#l7st'),[
   {t:'الرنين (مثال 1-2-5)',x:'في «مثال 1-2-5» اضغط «اضبط f على تردد الرنين»: \\(X_L=X_C=10\\ \\Omega\\)، و \\(Z_T=R=2\\ \\Omega\\)، والتيار \\(5\\angle0^\\circ\\ \\text{A}\\)، و \\(V_L=V_C=50\\ \\text{V}\\).',done:()=>pre==='e5'&&!mod&&near()},
   {t:'ابتعد عن الرنين',x:'حرّك تردد المصدر بعيداً عن \\(f_s\\) (أكثر من 15 Hz): ينخفض التيار بسرعة ويظهر فرق بين X<sub>L</sub> و X<sub>C</sub>، ويتأخر التيار (فوق f<sub>s</sub>) أو يتقدم (تحته).',done:()=>pre==='e5'&&Math.abs(f-fs())>15},
   {t:'أثر المقاومة',x:'ارفع \\(R_s\\) أو \\(R_L\\) حتى تصبح المقاومة الكلية 6 Ω أو أكثر: قمة المنحنى تنخفض ويصبح أعرض (الدائرة تنتقي الترددات بدقة أقل). لهذا يذكر الكتاب أن \\(R_s\\) قد تضاف «للتأثير على شكل منحنى الاستجابة».',done:()=>pre==='e5'&&Rs+RL>=6},
   {t:'مثال 1-2-6',x:'اختر «مثال 1-2-6» ثم اضبط على الرنين: \\(X_C=X_L=30\\ \\Omega\\)، والتيار \\(10\\ \\text{A}\\)، و \\(V_L=V_C=300\\ \\text{V}\\) — ستة أضعاف جهد المصدر.',done:()=>pre==='e6'&&!mod&&near()},
   {t:'غيّر السعة',x:'غيّر السعة C ثم اضغط «اضبط f على تردد الرنين»: يتغير \\(f_s=1/(2\\pi\\sqrt{LC})\\) — هكذا نضبط محطة الراديو بمكثف متغير.',done:()=>did.retune&&near()}
  ]);
  loopOn(el,()=>{const c=calc(f),fr=fs();
   $('#l7f-v').textContent=fm(rd(f,2))+' Hz';$('#l7V-v').textContent=V+' V';$('#l7Rs-v').textContent=fm(Rs)+' Ω';$('#l7RL-v').textContent=fm(RL)+' Ω';$('#l7L-v').textContent=fm(rd(Lm,2))+' mH';$('#l7C-v').textContent=fm(rd(Cu,2))+' µF';
   $('#l7c').innerHTML=serCkt([{k:'R',top:'Rs',val:fm(Rs)+' Ω',vl:'VRs'},{k:'R',top:'RL',val:fm(RL)+' Ω'},{k:'L',top:'XL',val:fm(rd(c.XL,2))+' Ω',vl:'VL'},{k:'C',top:'XC',val:fm(rd(c.XC,2))+' Ω',vl:'VC'}],{src:fm(V)+'∠0° V',box:[1,2],I:'I = '+fm(rd(c.I,3))+' A'});
   $('#l7ws').textContent=fm(rd(2*PI*fr,2))+' rad/s';$('#l7fs').textContent=fm(rd(fr,2))+' Hz';$('#l7xl').textContent=fm(rd(c.XL,3))+' Ω';$('#l7xc').textContent=fm(rd(c.XC,3))+' Ω';
   $('#l7z').textContent=fR(c.Z,2)+' = '+fP(c.Z,2,1)+' Ω';$('#l7i').textContent=fP(cdiv(Cx(V),c.Z.re===0&&c.Z.im===0?Cx(1e-9):c.Z),3,1)+' A';$('#l7vr').textContent=fm(rd(c.VR,2))+' V';$('#l7vl').textContent=fm(rd(c.VL,2))+' V';$('#l7vc').textContent=fm(rd(c.VC,2))+' V';$('#l7k').textContent=fm(rd(c.VL/V,2))+' ×';
   const th=cang(c.Z),ch=$('#l7chip');ch.className='ca-chip '+(Math.abs(th)<0.5?'ok':th>0?'hot':'ld');ch.textContent=Math.abs(th)<0.5?'رنين: XL = XC والتيار في طور الجهد':th>0?'فوق الرنين: الدائرة حثية':'تحت الرنين: الدائرة سعوية';
   const Ip=cdiv(Cx(V),cabs(c.Z)<1e-12?Cx(1e-9):c.Z),VRp=cmul(Cx(c.R),Ip),VLp=cmul(Cx(0,c.XL),Ip),VCp=cmul(Cx(0,-c.XC),Ip);
   $('#l7p').innerHTML=serPhasor(Cx(V),Ip,VRp,VLp,VCp,{w:320,h:300});
   const fmax=Math.max(120,Math.min(1000,fr*2.5,Math.max(fr*2.5,f*1.2))),N=300,key={I:'I',VR:'VR',VL:'VL',VC:'VC'}[qty];
   const pts=Array.from({length:N+1},(_,i)=>{const ff=Math.max(0.5,i/N*fmax);return [ff,calc(ff)[key]]});const ym=niceMax(Math.max(...pts.map(p=>p[1]),c[key])*1.08||1);
   $('#l7r').innerHTML=plotSVG({w:560,h:240,x0:0,x1:fmax,y0:0,y1:ym,xt:[0,fmax/4,fmax/2,3*fmax/4,fmax].map(v=>rd(v,0)),yt:[0,ym/2,ym],yf:v=>fm(rd(v,2)),xl:'f (Hz)',yl:(qty==='I'?'I (A)':qty+' (V)'),cid:'l7rc',series:[{pts,col:'--blue',w:2.4}],
    extra:(X_,Y_)=>(fr<=fmax?`<path d="M${fx(X_(fr))} 14V${fx(Y_(0))}" stroke="var(--fg)" stroke-dasharray="5 4"/>`+S.t(fx(X_(fr)),12,'fs','','middle'):'')+`<circle cx="${fx(X_(Math.min(f,fmax)))}" cy="${fx(Y_(Math.min(c[key],ym)))}" r="6" fill="var(--live)"/>`});
   steps.check()});
  load('e5');
 },
 examples:[
  {title:'مثال 1-2-5',ref:'ص 41',q:'<p>في دائرة الرنين الموضحة في الشكل 1-29 أوجد I، V<sub>R</sub>، V<sub>L</sub>، V<sub>C</sub>.</p>'+box(serCkt([{k:'R',val:'2 Ω',vl:'VR'},{k:'L',val:'10 Ω',vl:'VL'},{k:'C',val:'10 Ω',vl:'VC'}],{src:'10∠0° V'}),480),
   given:[{id:'V',label:'جهد المصدر',sym:'V',unit:'V',value:10},{id:'R',label:'المقاومة',sym:'R',unit:'Ω',value:2},{id:'XL',label:'الممانعة الحثية',sym:'X_L',unit:'Ω',value:10},{id:'XC',label:'الممانعة السعوية',sym:'X_C',unit:'Ω',value:10}],
   solve:g=>{const X=g.XL-g.XC,res=Math.abs(X)<1e-9,Z=Cx(g.R,X),I=cdiv(Cx(g.V),Z);const out=[];
    if(res)out.push({t:'\\(X_L=X_C\\): الدائرة في حالة رنين، والمعاوقة الكلية بالمعادلة (1-34):',f:`\\mathbf Z_T=R=${fm(g.R)}\\ \\Omega`});
    else out.push({t:'تنبيه: \\(X_L\\ne X_C\\) فالدائرة ليست في رنين بهذه الأرقام؛ نحسب المعاوقة كاملة:',f:`\\mathbf Z_T=${fm(g.R)}+j(${fm(g.XL)}-${fm(g.XC)})`,v:fP(Z,2,1),unit:'Ω'});
    out.push({t:'التيار:',f:`\\mathbf I=\\frac{${fm(g.V)}\\angle0^\\circ}{${fP(Z,2,1).replace('∠','\\angle ')}}`,v:fPr(I),unit:'A',final:true},
     {t:'',f:'\\mathbf V_R=\\mathbf I R',v:fPr(cmul(I,Cx(g.R))),unit:'V',final:true},{f:'\\mathbf V_L=\\mathbf I\\,X_L\\angle90^\\circ',v:fPr(cmul(I,Cx(0,g.XL))),unit:'V',final:true},{f:'\\mathbf V_C=\\mathbf I\\,X_C\\angle-90^\\circ',v:fPr(cmul(I,Cx(0,-g.XC))),unit:'V',final:true});return out}},
  {title:'مثال 1-2-6',ref:'ص 42',q:'<p>في دائرة الرنين الموضحة في الشكل 1-30 أوجد: أ- قيمة \\(X_C\\) عند الرنين. ب- قيمة التيار I وقيم الجهود V<sub>R</sub> و V<sub>C</sub> و V<sub>L</sub> عند الرنين.</p>'+box(serCkt([{k:'R',val:'5 Ω',vl:'VR'},{k:'L',val:'30 Ω',vl:'VL'},{k:'C',val:'?',vl:'VC'}],{src:'50∠0° V'}),480),
   given:[{id:'V',label:'جهد المصدر',sym:'V',unit:'V',value:50},{id:'R',label:'المقاومة',sym:'R',unit:'Ω',value:5},{id:'XL',label:'الممانعة الحثية',sym:'X_L',unit:'Ω',value:30}],
   solve:g=>{const I=g.V/g.R;return [{t:'أ- عند الرنين بالمعادلة (1-33):',f:`X_C=X_L`,v:g.XL,unit:'Ω',final:true},
    {t:'ب- عند الرنين \\(\\mathbf Z_T=R\\):',f:`\\mathbf I=\\frac{${fm(g.V)}\\angle0^\\circ}{${fm(g.R)}\\angle0^\\circ}`,v:fPm(rd(I,2),0),unit:'A',final:true},
    {f:'\\mathbf V_R=\\mathbf V_s',v:fPm(g.V,0),unit:'V',final:true},{f:`\\mathbf V_L=${fm(rd(I,2))}\\angle0^\\circ\\times${fm(g.XL)}\\angle90^\\circ`,v:fPm(rd(I*g.XL,2),90),unit:'V',final:true},{f:`\\mathbf V_C=${fm(rd(I,2))}\\angle0^\\circ\\times${fm(g.XL)}\\angle-90^\\circ`,v:fPm(rd(I*g.XL,2),-90),unit:'V',final:true}]},
   note:'في الكتاب رُقّم البند الثاني «ت» والمقصود «ب».'}
 ],
 quiz:[
  {q:'يحدث الرنين في دائرة RLC على التوالي عندما:',o:['R = X<sub>L</sub>','X<sub>L</sub> = X<sub>C</sub>','R = 0','X<sub>C</sub> = 0'],c:1,e:'المعادلة (1-33).'},
  {q:'المعاوقة الكلية عند الرنين في دائرة التوالي:',o:['صفر','R','X<sub>L</sub> + X<sub>C</sub>','لا نهائية'],c:1,e:'المعادلة (1-34).'},
  {q:'تردد الرنين:',o:['\\(2\\pi\\sqrt{LC}\\)','\\(\\frac{1}{2\\pi\\sqrt{LC}}\\)','\\(\\frac{1}{LC}\\)','\\(\\sqrt{L/C}\\)'],c:1,e:'المعادلة (1-36).'},
  {q:'عند الرنين في دائرة التوالي، التيار:',o:['أقل ما يمكن ومتأخر','أكبر ما يمكن وفي طور الجهد','صفر','متقدم 90°'],c:1,e:'ص 40.'},
  {q:'جهدا الملف والمكثف عند الرنين:',o:['متساويان ومتفقان في الطور','متساويان في المقدار وبينهما 180°','جهد الملف ضعف جهد المكثف','كلاهما صفر'],c:1,e:'ص 40.'},
  {q:'دائرة رنين: V<sub>s</sub> = 20 V، R = 4 Ω، X<sub>L</sub> = X<sub>C</sub> = 40 Ω. جهد الملف:',o:['20 V','40 V','200 V','800 V'],c:2,e:'\\(I=20/4=5\\ \\text{A}\\) و \\(V_L=5\\times40=200\\ \\text{V}\\).'},
  {q:'لماذا يلتقط الراديو محطة واحدة فقط؟',o:['لأن الهوائي قصير','لأن دائرة الرنين تعطي استجابة قصوى عند f<sub>r</sub> وتضعف للترددات البعيدة','لأن المحطات لا ترسل معاً','بسبب المقاومة فقط'],c:1,e:'ص 38–39.'},
  {q:'إذا زادت السعة C في دائرة الرنين على التوالي فإن تردد الرنين:',o:['يزيد','يقل','لا يتغير','يصبح صفراً'],c:1,e:'\\(f_s\\propto1/\\sqrt{LC}\\).'}
 ]
});






})(PLCBOOK);
