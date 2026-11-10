/* دوائر كهربائية-1 — الوحدة الثانية «البطاريات» (ص 25–42): الدروس u2-l1 … u2-l4 */
(function(B){
const {S}=B;
/* «اكتشف العطل» و«تحدي المحاكاة» (challenge.js): chF و chOn دائماً false خارج وضع التحدي، و chOut لا يفعل شيئاً خارجه
   chOut: قراءات بوحدات ثابتة في عنصر مخفي يقرؤها نشاط «تحدي المحاكاة» (نفس ما تعرضه أجهزة المختبر) */
const chF=f=>!!(B.chF&&B.chF(f)),chOn=()=>!!(B.chOn&&B.chOn());
const chOut=(el,id,rows)=>{if(!chOn())return;let d=el.querySelector('#'+id);if(!d){d=document.createElement('div');d.id=id;d.hidden=true;el.appendChild(d)}d.innerHTML=rows.map(r=>`<div><span>${r[0]}</span><b>${typeof r[1]==='number'&&isFinite(r[1])?r[1].toFixed(6):'—'}</b></div>`).join('')};
const fm=(x,d)=>d==null?B.fmtN(x):B.fmtN(B.round(x,d));
const fx=v=>(+v).toFixed(1);
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const lt=s=>`<span class="ltr">${s}</span>`;

/* ---------- styles used only by this course's unit files (CSS variables only) ---------- */
(function css(){if(typeof document==='undefined'||document.getElementById('c1cx-css'))return;const s=document.createElement('style');s.id='c1cx-css';s.textContent=`
.cx-sl{display:flex;flex-direction:column;gap:2px;font-size:13.5px;margin-top:10px;min-width:0}
.cx-sl .cx-h{display:flex;justify-content:space-between;gap:8px;align-items:baseline}
.cx-sl b{font-family:var(--mono);direction:ltr;unicode-bidi:isolate;color:var(--blue-ink);font-size:14px;white-space:nowrap}
.cx-sl input[type=range]{width:100%;accent-color:var(--blue);direction:ltr;margin:4px 0}
.cx-row{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;align-items:center}
.cx-row .sub{margin:0}
.cx-parts{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
.cx-parts .btn[aria-pressed="true"]{border-color:var(--stop);background:var(--stop-soft)}
.cx-q{border:1px solid var(--line);border-radius:12px;padding:10px 14px;margin:10px 0;background:var(--surface)}
.cx-q summary{cursor:pointer;font-weight:600;line-height:1.7}
.cx-ans{margin-top:8px;border-inline-start:3px solid var(--blue);padding:6px 12px;background:var(--blue-soft);border-radius:0 10px 10px 0}
.cx-tbl{overflow-x:auto;max-width:100%}
.cx-tbl table.tt td,.cx-tbl table.tt th{padding:6px 6px}
.cx-tbl tr.cur td{background:var(--live-soft);font-weight:700}
.cx-chip{display:inline-block;padding:2px 10px;border-radius:999px;font-size:12.5px;font-weight:700;background:var(--surface-2);color:var(--muted)}
.cx-chip.ok{background:var(--on-soft);color:var(--on)}
.cx-chip.ld{background:var(--blue-soft);color:var(--blue-ink)}
.cx-chip.warn{background:var(--stop-soft);color:var(--stop)}
.cx-chip.hot{background:var(--live-soft);color:var(--live)}
.cx-try{margin:6px 0 0;padding-inline-start:20px}
.cx-lab .seg{flex-wrap:wrap;max-width:100%}
.cx-lab .seg button{white-space:nowrap}
.cx-lab .facts{grid-template-columns:repeat(auto-fit,minmax(130px,1fr))}
.cx-figs{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px}
.cx-figs figure{margin:0;text-align:center;font-size:13px;color:var(--muted)}
.cx-rec{width:100%;border-collapse:collapse;font-size:13.5px;margin-top:8px}
.cx-rec th,.cx-rec td{border-bottom:1px solid var(--line);padding:5px 6px;text-align:center}
.cx-rec td.l{font-family:var(--mono);direction:ltr;unicode-bidi:isolate}
.cx-rec tr.cur td{background:var(--live-soft);font-weight:700}
.cx-sliders{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:0 14px}
.cx-card{border:1px solid var(--line);border-radius:12px;padding:8px 12px;background:var(--surface);margin-top:8px}
.cx-card h4{margin:0 0 4px;font-size:14.5px}
.cx-card p{margin:2px 0;font-size:13.5px;line-height:1.7}
.cx-sort{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
.cx-sort .btn.ok{border-color:var(--on);background:var(--on-soft)}
.cx-sort .btn.no{border-color:var(--stop);background:var(--stop-soft)}
`;document.head.appendChild(s)})();

/* ---------- small lab helpers (local copies) ---------- */
function loopOn(el,fn){let last=performance.now();const f=now=>{if(!document.body.contains(el))return;const dt=Math.min(0.05,Math.max(0,(now-last)/1000));last=now;try{fn(dt)}catch(e){console.error(e);return}requestAnimationFrame(f)};requestAnimationFrame(f)}
function stepsUI(host,steps){let i=0;
  const draw=()=>{host.innerHTML=steps.map((s,j)=>`<li class="${j<i?'done':j===i?'cur':''}"><span class="k">${j<i?'✓':j+1}</span><div><h4>${s.t}</h4><p>${s.x}</p>${j===i?`<div class="act">${s.done?'<span class="hint">بانتظار تنفيذك…</span> <button class="btn" data-next>تخطَّ</button>':'<button class="btn primary" data-next>التالي</button>'}</div>`:''}</div></li>`).join('')+
    (i>=steps.length?`<li class="cur"><span class="k">✓</span><div><h4>أحسنت، أنهيت التجربة</h4><p style="display:block">جرّب قيماً أخرى، أو أعد التجربة من أولها.</p><div class="act"><button class="btn" data-restart>إعادة التجربة</button></div></div></li>`:'');B.math(host)};
  host.addEventListener('click',e=>{if(e.target.closest('[data-next]')){i++;draw()}if(e.target.closest('[data-restart]')){i=0;draw()}});draw();
  return {check(){const s=steps[i];if(s&&s.done&&s.done()){i++;draw()}},redraw:draw};}
const sl=(id,label,min,max,step,val)=>`<label class="cx-sl"><span class="cx-h"><span>${label}</span><b id="${id}-v"></b></span><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}" aria-label="${label.replace(/<[^>]+>/g,'')}"></label>`;
const segHTML=(attr,items,cur)=>`<div class="seg" role="group">${items.map(([v,l])=>`<button data-${attr}="${v}" aria-pressed="${String(v)===String(cur)}">${l}</button>`).join('')}</div>`;
const segSet=(el,attr,v)=>el.querySelectorAll(`[data-${attr}]`).forEach(b=>b.setAttribute('aria-pressed',String(String(b.dataset[attr])===String(v))));
const segBind=(el,attr,fn)=>el.querySelectorAll(`[data-${attr}]`).forEach(b=>b.addEventListener('click',()=>{segSet(el,attr,b.dataset[attr]);fn(b.dataset[attr])}));
const fact=(l,id)=>`<div class="fact"><span>${l}</span><b id="${id}">—</b></div>`;
const tryList=items=>`<div class="callout"><b>جرّب:</b><ol class="cx-try">${items.map(x=>`<li>${x}</li>`).join('')}</ol></div>`;
const arT=(x,y,s,o)=>{o=o||{};return `<text class="txt ar" x="${x}" y="${y}" text-anchor="${o.a||'middle'}"${o.fs?` font-size="${o.fs}"`:''}${o.col?` style="fill:var(${o.col})"`:''}>${s}</text>`};
const sb=(b,x)=>`${b}<tspan font-size="9" dy="4">${x}</tspan><tspan dy="-4"> </tspan>`;
const box=(svg,max)=>`<div class="svgbox" style="margin-inline:auto;${max?`max-width:${max}px`:''}">${svg}</div>`;
function arrow(x1,y1,x2,y2,col,w){w=w||2.4;const a=Math.atan2(y2-y1,x2-x1),L=Math.hypot(x2-x1,y2-y1);if(L<3)return '';const h=Math.min(10,L*0.7)+w;
  const bx=x2-h*Math.cos(a),by=y2-h*Math.sin(a),px=-Math.sin(a)*h*0.45,py=Math.cos(a)*h*0.45;
  return `<path d="M${fx(x1)} ${fx(y1)}L${fx(bx)} ${fx(by)}" stroke="var(${col})" stroke-width="${w}" fill="none" stroke-linecap="round"/><path d="M${fx(x2)} ${fx(y2)}L${fx(bx+px)} ${fx(by+py)}L${fx(bx-px)} ${fx(by-py)}Z" fill="var(${col})"/>`}
function dArrow(x1,x2,y,label,col){col=col||'--muted';const m=(x1+x2)/2;return arrow(m,y,x1,y,col,1.4)+arrow(m,y,x2,y,col,1.4)+(label?S.t(fx(m),y+15,label,'b'):'')}
function zig(x1,y1,x2,y2,n,cls,st){n=n||6;const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy),ux=dx/len,uy=dy/len,nx=-uy,ny=ux,lead=len*0.16,seg=(len-2*lead)/n;let p=`M${fx(x1)} ${fx(y1)}L${fx(x1+ux*lead)} ${fx(y1+uy*lead)}`;
  for(let i=0;i<n;i++){const s=(i%2?-1:1)*6,m=lead+seg*(i+0.5);p+=`L${fx(x1+ux*m+nx*s)} ${fx(y1+uy*m+ny*s)}`}
  return `<path class="w ${cls||''}" ${st||''} d="${p}L${fx(x2-ux*lead)} ${fx(y2-uy*lead)}L${fx(x2)} ${fx(y2)}"/>`}
/* simple SVG x-y plot. o:{w,h,x0,x1,y0,y1,xt,yt,xl,yl,series:[{pts,col,w,dash}],under(X,Y),extra(X,Y)} */
function plotSVG(o){const W=o.w||520,H=o.h||260,L=o.left||50,R=14,T=14,Bm=38;
  const X=x=>L+(x-o.x0)/(o.x1-o.x0)*(W-L-R),Y=y=>H-Bm-(y-o.y0)/(o.y1-o.y0)*(H-T-Bm);
  let s='';(o.yt||[]).forEach(v=>{s+=`<path d="M${L} ${fx(Y(v))}H${W-R}" stroke="var(--line)"/>`+S.t(L-6,fx(Y(v)+4),o.yf?o.yf(v):fm(v),'m','end')});
  (o.xt||[]).forEach(v=>{s+=`<path d="M${fx(X(v))} ${T}V${H-Bm}" stroke="var(--line)" stroke-dasharray="3 3"/>`+S.t(fx(X(v)),H-Bm+15,o.xf?o.xf(v):fm(v),'m')});
  s+=`<path d="M${L} ${T}V${H-Bm}H${W-R}" stroke="var(--fg)" fill="none" stroke-width="1.4"/>`;
  if(o.xl)s+=S.t(W-R,H-4,o.xl,'','end');if(o.yl)s+=S.t(L+4,T+10,o.yl,'','start');
  if(o.under)s+=o.under(X,Y);
  (o.series||[]).forEach(se=>{if(!se.pts.length)return;s+=`<path d="${se.pts.map((p,i)=>(i?'L':'M')+fx(X(p[0]))+' '+fx(Y(clamp(p[1],o.y0-1e6,o.y1+1e6)))).join('')}" fill="none" stroke="var(${se.col})" stroke-width="${se.w||2.4}" ${se.dash?`stroke-dasharray="${se.dash}"`:''} stroke-linejoin="round"/>`});
  if(o.extra)s+=o.extra(X,Y);
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${o.aria||'منحنى'}">${s}</svg>`}
const niceMax=v=>{const t=Math.max(v,1e-12),e=Math.pow(10,Math.floor(Math.log10(t)));return [1,1.2,1.5,2,2.5,3,4,5,6,8,10].map(k=>k*e).find(x=>x>=t*0.999)};
const ticks=(m,n)=>{n=n||4;return Array.from({length:n+1},(_,i)=>m*i/n)};
const Qd=(n,q,ans)=>`<details class="cx-q"><summary>${n}: ${q}</summary><div class="cx-ans"><b>إجابة مقترحة (ليست من الكتاب):</b> ${ans}</div></details>`;
/* scientific notation like the book: x = m × 10^e with a FIXED exponent e */
const SUP={'-':'⁻','0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'};
const sup=e=>String(e).split('').map(c=>SUP[c]||c).join('');
const sci=(x,e,dp)=>e?`${fm(x/Math.pow(10,e),dp)} × 10${sup(e)}`:fm(x,dp);
const tsci=(x,e,dp)=>e?`${fm(x/Math.pow(10,e),dp)}\\times10^{${e}}`:fm(x,dp);
/* engineering formats for live readouts */
const fmtF=c=>{const a=Math.abs(c);if(!isFinite(c))return '—';if(a>=1)return fm(c,4)+' F';if(a>=1e-3)return fm(c*1e3,3)+' mF';if(a>=1e-6)return fm(c*1e6,3)+' μF';if(a>=1e-9)return fm(c*1e9,3)+' nF';return fm(c*1e12,3)+' pF'};
const fmtC=q=>{const a=Math.abs(q);if(a===0)return '0 C';if(a>=1)return fm(q,4)+' C';if(a>=1e-3)return fm(q*1e3,4)+' mC';if(a>=1e-6)return fm(q*1e6,4)+' μC';if(a>=1e-9)return fm(q*1e9,4)+' nC';return fm(q*1e12,4)+' pC'};
const fmtJ=w=>{const a=Math.abs(w);if(a===0)return '0 J';if(a>=1e-3)return fm(w,4)+' J';if(a>=1e-6)return fm(w*1e3,4)+' mJ';return fm(w*1e6,4)+' μJ'};
const tE=x=>{if(x===0)return '0';const e=Math.floor(Math.log10(Math.abs(x)));return tsci(x,e,3)};
const eSci=x=>{if(x===0)return '0';const e=Math.floor(Math.log10(Math.abs(x)));return sci(x,e,3)};

/* ======================================================================
   Drawings
   ====================================================================== */
/* capacitor symbol, horizontal leads: plates at cx±5 */
function capSym(cx,y,o){o=o||{};const h=o.h||30,g=5;const col=o.hi?'var(--stop)':'var(--fg)';let s='';
  if(o.fill>0)s+=`<rect x="${cx-g+1.5}" y="${y-h/2}" width="${2*g-3}" height="${h}" fill="var(--live)" opacity="${(0.15+0.65*clamp(o.fill,0,1)).toFixed(2)}"/>`;
  if(o.kind==='curved')s+=`<path d="M${cx-g} ${y-h/2}V${y+h/2}" stroke="${col}" stroke-width="3"/><path d="M${cx+g+4} ${y-h/2}Q${cx+g-3} ${y} ${cx+g+4} ${y+h/2}" stroke="${col}" stroke-width="3" fill="none"/>`;
  else if(o.kind==='hollow')s+=`<rect x="${cx-g-4}" y="${y-h/2}" width="6" height="${h}" fill="var(--surface)" stroke="${col}" stroke-width="1.6"/><rect x="${cx+g-2}" y="${y-h/2}" width="6" height="${h}" fill="${col}"/>`;
  else s+=`<path d="M${cx-g} ${y-h/2}V${y+h/2}M${cx+g} ${y-h/2}V${y+h/2}" stroke="${col}" stroke-width="3"/>`;
  if(o.pol)s+=S.t(cx-g-9,y-h/2+6,'+','');
  if(o.vari)s+=arrow(cx-18,y+18,cx+18,y-20,'--fg',1.6);
  return s}
const term=(x,y)=>`<circle cx="${x}" cy="${y}" r="4" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.8"/>`;
const wire=d=>`<path class="w" d="${d}"/>`;
/* capacitor network: parallel group P (left) then series caps S (right).
   cap: {top, q, bot, va, hi, fill, pol}. o:{P,S,src:'box'|'arrow'|'none', vl, gva, live, pts:{a,b,c}, srcText} */
function netSVG(o){
  const P=o.P||[],Sr=o.S||[],live=!!o.live,k=P.length,gap=live?72:56,half=k?(k-1)/2*gap:0;
  const Ym=44+half,x0=30,WG=live?190:140,WS=live?132:104;let x=x0,s='';const va=[];
  if(k){const xL=x+24,xR=xL+WG,cx=(xL+xR)/2;
    s+=wire(`M${x} ${Ym}H${xL}`);if(k>1)s+=wire(`M${xL} ${Ym-half}V${Ym+half}M${xR} ${Ym-half}V${Ym+half}`);
    P.forEach((c,i)=>{const y=Ym-half+i*gap;s+=wire(`M${xL} ${y}H${cx-5}M${cx+5} ${y}H${xR}`)+capSym(cx,y,c);
      if(c.top)s+=S.t(cx,y-21,c.top,c.hi?'b':'');if(c.q)s+=S.t(xL+8,y-7,c.q,'b','start');if(c.bot)s+=S.t(cx,y+29,c.bot,'m');});
    if(k>1)s+=S.dot(xL,Ym)+S.dot(xR,Ym);
    if(o.pts&&o.pts.a)s+=S.t(xL-6,Ym-8,o.pts.a,'','end');if(o.pts&&o.pts.b)s+=S.t(xR+6,Ym-8,o.pts.b,'','start');
    if(o.gva)va.push([xL+6,xR-6,o.gva]);x=xR;}
  else if(o.pts&&o.pts.a)s+=S.t(x0+4,Ym-10,o.pts.a,'','start');
  Sr.forEach(c=>{const cx=x+WS/2;s+=wire(`M${x} ${Ym}H${cx-5}M${cx+5} ${Ym}H${x+WS}`)+capSym(cx,Ym,c);
    if(c.top)s+=S.t(cx,Ym-22,c.top,c.hi?'b':'');if(c.q)s+=S.t(cx-12,Ym-6,c.q,'b','end');if(c.bot)s+=S.t(cx,Ym+30,c.bot,'m');
    if(c.va)va.push([x+10,x+WS-10,c.va]);x+=WS;});
  const xE=x+24;s+=wire(`M${x} ${Ym}H${xE}`);if(o.pts&&o.pts.c)s+=S.t(xE-2,Ym-10,o.pts.c,'','end');
  const Yva=Ym+half+(live?50:32),Yb=Yva+(va.length?(o.src==='arrow'||o.src==='none'?30:42):4);va.forEach(([a,b,l])=>{s+=dArrow(a,b,Yva,l)});
  let H=Yb+24;
  if(o.src==='arrow'){s+=term(x0,Ym)+term(xE,Ym)+dArrow(x0,xE,Yb,o.vl||'');H=Yb+26}
  else if(o.src==='none'){s+=term(x0,Ym)+term(xE,Ym);H=Yva+(va.length?24:10)}
  else{const xm=(x0+xE)/2,bw=Math.min(130,(xE-x0)*0.6);s+=wire(`M${xE} ${Ym}V${Yb}H${xm+bw/2}M${xm-bw/2} ${Yb}H${x0}V${Ym}`)+`<rect x="${fx(xm-bw/2)}" y="${Yb-14}" width="${fx(bw)}" height="28" rx="4" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/>`+S.t(fx(xm),Yb+4,o.srcText||'power supply','');H=Yb+22}
  const W=xE+30;
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${o.aria||'دائرة مكثفات'}" style="max-width:${Math.round(W*1.25)}px;margin-inline:auto">${s}</svg>`}


/* ---------- battery drawings ---------- */
/* cell symbol (horizontal): short thick (−) on the left, long thin (+) on the right, centred at x */
function cellSym(x,y,hi){const c=hi?'var(--stop)':'var(--fg)';return `<path d="M${x-4} ${y-8}V${y+8}" stroke="${c}" stroke-width="5"/><path d="M${x+4} ${y-15}V${y+15}" stroke="${c}" stroke-width="2.2"/>`}
/* n cells in series per row, m rows in parallel, load R at the bottom. o:{n,m,lblE,lblR,lblL,I,flow,title} */
function gridSVG(o){const n=o.n,m=o.m,SW=n>8?62:80,RG=n*m>24?38:50,x0=40,xL=x0,xR=xL+20+n*SW+20,lab=n*m<=24;let s='';
  const rowY=j=>34+j*RG,yLast=rowY(m-1),Yb=yLast+58,cls=o.flow?'flow':'';
  for(let j=0;j<m;j++){const y=rowY(j);let x=xL+20;s+=`<path class="w ${cls}" d="M${xL} ${y}H${x}"/>`;
    for(let i=0;i<n;i++){const cx=x+16;s+=`<path class="w ${cls}" d="M${x} ${y}H${cx-4}M${cx+4} ${y}H${x+26}"/>`+cellSym(cx,y)+zig(x+26,y,x+SW-6,y,4,cls)+`<path class="w ${cls}" d="M${x+SW-6} ${y}H${x+SW}"/>`;
      if(lab){s+=S.t(cx,y-19,o.lblE,'m');s+=S.t(x+SW/2+10,y-12,o.lblR,'m')}x+=SW}
    s+=`<path class="w ${cls}" d="M${x} ${y}H${xR}"/>`}
  if(m>1)s+=`<path class="w ${cls}" d="M${xL} ${rowY(0)}V${yLast}M${xR} ${rowY(0)}V${yLast}"/>`;
  const xm=(xL+xR)/2;s+=`<path class="w ${cls}" d="M${xR} ${rowY(0)}V${Yb}H${xm+40}M${xm-40} ${Yb}H${xL}V${rowY(0)}"/>`+zig(xm+40,Yb,xm-40,Yb,6,cls)+S.t(xm,Yb+24,o.lblL,'b');
  if(o.I!=null)s+=arrow(xR-30,Yb,xR-70,Yb,'--live',2)+S.t(xR-50,Yb-8,o.I,'b');
  if(o.title)s+=`<text class="txt ar" x="${xm}" y="${Yb+44}" text-anchor="middle" font-size="13">${o.title}</text>`;
  const W=xR+30,H=Yb+(o.title?54:34);return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="تجميع خلايا" style="max-width:${Math.round(W*1.2)}px;margin-inline:auto">${s}</svg>`}
/* الشكل (2-1) dry cell, clickable parts */
const DRY=[
 {k:'pos',n:'قطب موجب',side:'R',y:30,d:'الغطاء المعدني البارز فوق عمود الكربون: الطرف الموجب للخلية (الشكل 2-1).'},
 {k:'air',n:'مكان للهواء',side:'R',y:74,d:'فراغ صغير تحت الغطاء (الشكل 2-1).'},
 {k:'mno2',n:'ثاني أكسيد المنجنيز',side:'R',y:150,d:'«المادة الفعلية المكوّنة للقطب الموجب هي خليط من ثاني أكسيد المنجنيز ومسحوق الكربون، وهذا الخليط مضغوط حول العمود» (ص 30). وفي خلية لكلانشيه «القطب الموجب مصنوع من ثاني أكسيد المنجنيز (MnO₂)» (ص 28).'},
 {k:'el',n:'الكتروليت',side:'R',y:200,d:'«يوجد الإلكتروليت في هذه الخلايا في صورة معجون يتكوّن من كلوريد الأمونيوم وكلوريد الخارصين والماء» (ص 30). «يستبدل السائل الإلكتروليتي بعجينة من محلول كلوريد النوشادر المخلوط بنشارة الخشب والدقيق والخميرة» (ص 29).'},
 {k:'jacket',n:'غلاف ورقي أو معدني',side:'R',y:250,d:'الغلاف الخارجي للخلية (الشكل 2-1).'},
 {k:'top',n:'الغطاء الأعلى',side:'L',y:44,d:'غطاء الخلية من أعلى (الشكل 2-1).'},
 {k:'asph',n:'غطاء أسفلت',side:'L',y:66,d:'طبقة مانعة تحت الغطاء الأعلى (الشكل 2-1). <i>توضيح — ليس من الكتاب: تحبس العجينة داخل الخلية فلا تتسرب.</i>'},
 {k:'rod',n:'عمود كربون',side:'L',y:110,d:'«يعمل عمود الكربون الموجود في مركز الخلية كمجمع تيار للقطب الموجب» (ص 30).'},
 {k:'sep',n:'عازل فاصل',side:'L',y:170,d:'«يفصل القطبان السالب والموجب بشريحة من مادة مساميّة مثل الورق … سبق غمسها في الإلكتروليت. وتُسمى هذه الطبقة الرّقيقة العازل، وهي تمنع المواد المكونة للأقطاب من الاختلاط معاً أو التفاعل في حالة عدم استعمال البطارية» (ص 30).'},
 {k:'zn',n:'حاوية زنك',side:'L',y:226,d:'«مُصممة داخل عبوة من الخارصين. وتستخدم العلبة كإناء لمحتويات الخلية، وفي الوقت نفسه تقوم بعمل القطب السالب» (ص 30). «ومصدر الطاقة هنا هو في تحويل الزنك إلى أكسيد الزنك» (ص 29).'},
 {k:'bot',n:'الغطاء السفلي',side:'L',y:300,d:'غطاء الخلية من أسفل (الشكل 2-1).'},
 {k:'neg',n:'القطب السالب',side:'L',y:322,d:'الطرف السالب للخلية في أسفلها، متصل بعلبة الزنك (الشكل 2-1).'}];
function drySVG(o){o=o||{};const hi=o.hi||'',dis=o.dis||0,zt=8-5*dis;const g=(k,inner)=>`<g data-part="${k}" style="cursor:pointer;${hi&&hi!==k?'opacity:.45':''}">${inner}</g>`;
  const X1=230,X2=390,T=48,Bt=300,cx=(X1+X2)/2;let s=`<svg viewBox="0 0 620 340" role="img" aria-label="بطارية جافة">`;
  s+=g('jacket',`<rect x="${X1}" y="${T}" width="${X2-X1}" height="${Bt-T}" rx="6" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.6"/>`);
  s+=g('zn',`<rect x="${X1+6}" y="${T+18}" width="${X2-X1-12}" height="${Bt-T-24}" fill="var(--blue)" opacity="${(0.9-0.4*dis).toFixed(2)}"/>`);
  s+=`<rect x="${fx(X1+6+zt)}" y="${T+18}" width="${fx(X2-X1-12-2*zt)}" height="${Bt-T-24-zt}" fill="var(--surface)"/>`;
  s+=g('sep',`<rect x="${fx(X1+6+zt+1)}" y="${T+20}" width="${fx(X2-X1-14-2*zt)}" height="${Bt-T-28-zt}" fill="none" stroke="var(--stop)" stroke-width="2.4"/>`);
  s+=g('el',`<rect x="${fx(X1+6+zt+3)}" y="${T+28}" width="${fx(X2-X1-18-2*zt)}" height="${Bt-T-38-zt}" fill="var(--live-soft)"/>`);
  s+=g('mno2',`<rect x="${cx-46}" y="${T+40}" width="92" height="${Bt-T-64}" rx="8" fill="${dis>0.5?'var(--surface-2)':'var(--live)'}" opacity="${(0.55-0.25*dis).toFixed(2)}"/>`);
  s+=g('rod',`<rect x="${cx-9}" y="${T-6}" width="18" height="${Bt-T-30}" fill="var(--muted)" stroke="var(--fg)" stroke-width="1"/>`);
  s+=g('asph',`<rect x="${X1+6}" y="${T+8}" width="${X2-X1-12}" height="10" fill="var(--fg)" opacity=".75"/>`);
  s+=g('air',`<rect x="${X1+10}" y="${T+18}" width="${X2-X1-20}" height="8" fill="var(--surface)" stroke="var(--line)" stroke-dasharray="3 2"/>`);
  s+=g('top',`<rect x="${X1}" y="${T}" width="${X2-X1}" height="8" fill="var(--surface-2)" stroke="var(--fg)"/>`);
  s+=g('pos',`<rect x="${cx-16}" y="${T-20}" width="32" height="14" rx="3" fill="var(--live)" stroke="var(--fg)"/>`);
  s+=g('bot',`<rect x="${X1}" y="${Bt-6}" width="${X2-X1}" height="8" fill="var(--surface-2)" stroke="var(--fg)"/>`);
  s+=g('neg',`<rect x="${cx-40}" y="${Bt+2}" width="80" height="8" rx="2" fill="var(--muted)" stroke="var(--fg)"/>`);
  const tgt={pos:[cx+16,T-13],air:[X2-14,T+22],mno2:[cx+40,150],el:[X2-24,200],jacket:[X2,250],top:[X1+4,T+4],asph:[X1+14,T+13],rod:[cx-9,110],sep:[fx(X1+8+zt),170],zn:[X1+9,226],bot:[X1+4,Bt-2],neg:[cx-40,Bt+6]};
  DRY.forEach(p=>{const [tx,ty]=tgt[p.k],lx=p.side==='R'?X2+46:X1-46;s+=`<g data-part="${p.k}" style="cursor:pointer"><path d="M${lx} ${p.y}L${tx} ${ty}" stroke="${hi===p.k?'var(--stop)':'var(--muted)'}" stroke-width="1"/>`+arT(p.side==='R'?lx+4:lx-4,p.y+4,p.n,{a:p.side==='R'?'start':'end',fs:13,col:hi===p.k?'--stop':'--fg'})+'</g>'});
  return s+'</svg>'}
/* الشكل (2-2) lead-acid battery (simplified cut-away) */
function leadSVG(){let s=`<svg viewBox="0 0 640 300" role="img" aria-label="أجزاء بطارية تخزين الحمض والرصاص">`;
  s+=`<rect x="170" y="70" width="300" height="200" rx="8" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.8"/><rect x="160" y="54" width="320" height="22" rx="5" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/>`;
  s+=`<rect x="205" y="30" width="22" height="26" rx="4" fill="var(--blue)"/><rect x="413" y="30" width="22" height="26" rx="4" fill="var(--blue)"/>`+S.t(216,24,'−','')+S.t(424,24,'+','');
  s+=`<rect x="270" y="46" width="100" height="8" rx="3" fill="var(--surface)" stroke="var(--fg)"/>`;
  // cell cut-away: plates
  s+=`<rect x="190" y="100" width="150" height="160" fill="var(--blue-soft)" stroke="var(--fg)"/>`;
  for(let i=0;i<7;i++){const x=198+i*20;const neg=i%2===0;s+=`<rect x="${x}" y="108" width="8" height="140" fill="${neg?'var(--stop)':'var(--live)'}" opacity=".75"/>`;if(i<6)s+=`<rect x="${x+11}" y="112" width="4" height="132" fill="var(--on)" opacity=".7"/>`}
  s+=`<path d="M340 100H470" stroke="var(--fg)"/><rect x="335" y="84" width="20" height="14" fill="var(--muted)"/>`;
  const L=[[120,40,'غطاء ثقب التهوية',[290,50]],[120,80,'قطب الأطراف',[205,42]],[120,124,'الصندوق',[170,140]],[120,168,'البطارية (جدار الخلية)',[190,190]],[120,212,'صفائح رصاص (سالب)',[200,220]],[120,256,'مقسّم',[211,240]],[560,240,'صفائح رصاص (موجب)',[220,236]],[560,84,'موصل البطارية الأخرى',[350,90]]];
  L.forEach(([x,y,t,[tx,ty]])=>{s+=`<path d="M${x+(x<300?6:-6)} ${y-4}L${tx} ${ty}" stroke="var(--muted)" stroke-width="1"/>`+arT(x,y,t,{a:x<300?'end':'start',fs:12.5})});
  return s+'</svg>'}
/* الشكل (2-3) */
function ohmSVG(){return `<svg viewBox="0 0 360 120" role="img" aria-label="قانون أوم">${wire('M20 60H120')}${zig(120,60,240,60,6,'')}${wire('M240 60H340')}${S.t(180,100,'R','')}${S.t(180,26,'V','')}${S.t(124,40,'+','')}${S.t(236,40,'−','')}${arrow(40,76,96,76,'--blue',2)}${S.t(68,98,'I','b')}</svg>`}

/* ======================================================================
   Lesson 5 — مقدمة البطاريات والبطاريات الجافة الأولية (ص 25–31)
   ====================================================================== */
const TYPES={
 cz:{n:'خلايا الكربون-الخارصين',ref:'ص 29–30',neg:'علبة الخارصين نفسها',pos:'خليط ثاني أكسيد المنجنيز ومسحوق الكربون حول عمود كربون (مجمع التيار)',el:'معجون من كلوريد الأمونيوم وكلوريد الخارصين والماء',x:'تسمى أيضاً «عمود لكلانشيه الجاف». متعددة الاستعمالات.',use:'كشافات الضوء اليدوية، ووحدات توليد الومضات لآلات التصوير، ولعب الأطفال.'},
 alk:{n:'الخلايا القاعدية',ref:'ص 30',neg:'خارصين يغلب عليه التكوين المسامي، يتأكسد بدرجة أسرع',pos:'نفس مواد خلية الكربون-الخارصين',el:'محلول قلوي قوي يحتوي على هيدروكسيد البوتاسيوم، يوصل الكهرباء بفاعلية أكبر',x:'تولد تياراً عالياً يستمر بكفاءة أعلى، وعمرها الافتراضي أطول بما يتراوح بين 5 و 8 مرات (في لعب الأطفال التي تتطلب كمية عالية من الكهرباء).',use:'مصابيح الدراجات، وآلات الحلاقة، وأجهزة التلفاز خفيفة الحمل، وأجهزة التخاطب الإلكترونية، ولعب الأطفال.'},
 hg:{n:'خلايا الزئبق',ref:'ص 30–31',neg:'الخارصين',pos:'أكسيد الزئبقيك',el:'هيدروكسيد البوتاسيوم (يبقى دون تغير)',x:'خلال الاستهلاك يتحول الخارصين إلى أكسيد الخارصين، ويتحول أكسيد الزئبقيك إلى زئبق.',use:'(الكتاب لا يذكر استعمالاتها.)'}};
const SORT=[['خلية الكربون-الخارصين','p'],['الخلية القاعدية','p'],['خلية الزئبق','p'],['خلية لكلانشيه (المنجنية)','p'],['بطارية الرصاص-الحمض','s'],['خلية النيكل-كادميوم','s'],['خلية النيكل-حديد','s']];
B.lesson({
 id:'u2-l1',unit:2,order:1,pages:'25–31',
 title:'البطاريات: أنواعها والبطاريات الجافة الأولية',
 summary:'البطارية مجموعة خلايا تنتج الكهرباء بتفاعلات كيميائية كهربائية. تنقسم إلى أولية (تُرمى بعد نفادها) وثانوية (يعاد شحنها). ثم الخلية المنجنية (لكلانشيه) والبطارية الجافة وأجزاؤها، والأنواع الثلاثة للبطاريات الأولية الجافة.',
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

  {st:1,short:'أهداف الوحدة',title:'الوحدة الثانية: البطاريات — الأهداف',ref:'ص 25–26',
   q:'ما الذي يُنتظر منك أن تتقنه حين تنتهي من وحدة البطاريات؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="سبعة أهداف للوحدة الثانية، والأول مميز بدائرة خضراء" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><rect x="26" y="30" width="308" height="262" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="180" y="60" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" direction="rtl">أهداف الوحدة الثانية</text><g data-tip="يُدرس في هذا الدرس."><circle cx="306" cy="92" r="10.5" fill="#12855A" stroke="#12855A" stroke-width="2"/><text x="306" y="96.5" text-anchor="middle" font-size="11.5" fill="#FBF6EE" font-weight="700" direction="ltr">1</text><text x="290" y="96.5" text-anchor="start" font-size="12.2" fill="#2C4A40" direction="rtl">أنواع البطاريات الأولية الجافة</text><rect x="40" y="80" width="280" height="24" fill="transparent"/></g><g data-tip="في الدرس التالي: الحامضية والقلوية."><circle cx="306" cy="117" r="10.5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="306" y="121.5" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="ltr">2</text><text x="290" y="121.5" text-anchor="start" font-size="12.2" fill="#2C4A40" direction="rtl">البطاريات الثانوية الشائعة</text><rect x="40" y="105" width="280" height="24" fill="transparent"/></g><g data-tip="في الدرس التالي: الكبرتة وشروط المحافظة على البطارية."><circle cx="306" cy="142" r="10.5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="306" y="146.5" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="ltr">3</text><text x="290" y="146.5" text-anchor="start" font-size="12.2" fill="#2C4A40" direction="rtl">المحافظة على البطارية</text><rect x="40" y="130" width="280" height="24" fill="transparent"/></g><g data-tip="السعة في الدرس التالي، وتجميع الخلايا في الدرس الثالث من الوحدة."><circle cx="306" cy="167" r="10.5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="306" y="171.5" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="ltr">4</text><text x="290" y="171.5" text-anchor="start" font-size="12.2" fill="#2C4A40" direction="rtl">السعة وتيار الشحن والتجميع</text><rect x="40" y="155" width="280" height="24" fill="transparent"/></g><g data-tip="في الدرس الرابع من الوحدة."><circle cx="306" cy="192" r="10.5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="306" y="196.5" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="ltr">5</text><text x="290" y="196.5" text-anchor="start" font-size="12.2" fill="#2C4A40" direction="rtl">القدرة القصوى للحمل</text><rect x="40" y="180" width="280" height="24" fill="transparent"/></g><g data-tip="في الدرس التالي: جودة الأمبير ساعة والوات ساعة."><circle cx="306" cy="217" r="10.5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="306" y="221.5" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="ltr">6</text><text x="290" y="221.5" text-anchor="start" font-size="12.2" fill="#2C4A40" direction="rtl">جودة البطاريات</text><rect x="40" y="205" width="280" height="24" fill="transparent"/></g><g data-tip="في الدرس الثالث من الوحدة."><circle cx="306" cy="242" r="10.5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="306" y="246.5" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="ltr">7</text><text x="290" y="246.5" text-anchor="start" font-size="12.2" fill="#2C4A40" direction="rtl">التوصيل توالي وتوازي ومشاكله</text><rect x="40" y="230" width="280" height="24" fill="transparent"/></g><g data-tip="الدائرة الخضراء: هدف يغطيه هذا الدرس."><circle cx="250" cy="272" r="8" fill="#12855A" stroke="#12855A" stroke-width="0"/><text x="236" y="277" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="600" direction="rtl">يُدرس في هذا الدرس</text></g></svg>`,
   cap:'أهداف الوحدة السبعة مختصرة، والدائرة الخضراء هي ما يغطيه هذا الدرس.<br><b>مرّر المؤشر على الأهداف (أو المسها في الجوال) لتعرف في أي درس يُدرس كل منها.</b>',
   side:[
    {predict:{q:'هذا الدرس عن البطاريات الجافة الأولية. أي هدف من أهداف الوحدة يخدمه؟',opts:[
     ['الهدف 5: القدرة القصوى التي تعطيها بطارية للحمل',false,'هذا في الدرس الرابع من الوحدة.'],
     ['الهدف 2: البطاريات الثانوية الأكثر شيوعاً',false,'البطاريات الثانوية في الدرس التالي.'],
     ['الهدف 7: توصيل الخلايا على التوالي والتوازي',false,'التوصيل في الدرس الثالث من الوحدة.'],
     ['الهدف 1: الأنواع الرئيسية من البطاريات الأولية الجافة',true,'الدرس يشرح البطارية الجافة وأنواعها الثلاثة الرئيسة.']]}}
   ],
   body:[
    {book:String.raw`<p><b>الهدف العام للوحدة:</b> معرفة العناصر الرئيسية المكونة للبطارية وفهم النوعين الأساسيين للخلايا: الابتدائية والثانوية، وكذلك معرفة وفهم الطرق المختلفة لتجميع البطاريات.</p>
     <p><b>الأهداف:</b></p>
     <ol><li>أن يعرف المتدرب الأنواع الرئيسية من البطاريات الأولية الجافة.</li><li>أن يعرف المتدرب أنواع البطاريات الثانوية الأكثر شيوعاً مثل البطاريات الحامضية والبطاريات القلوية.</li><li>أن يحدد المتدرب النقاط التي يجب مراعاتها للمحافظة على البطارية وبقائها في حالة جيدة.</li><li>أن يعرف المتدرب سعة البطارية وتيار الشحن، وكيفية تجميع الخلايا في البطاريات.</li><li>أن يتمكن المتدرب من حساب القدرة القصوى التي تعطيها بطارية للحمل.</li><li>أن يحدد المتدرب جودة البطاريات (كفاءة الأمبير/ساعة وكفاءة الواط/ساعة).</li><li>أن يتمكن المتدرب من توصيل الخلايا الكهربائية على التوالي – والتوازي ومشاكل التوصيل.</li></ol>`,ref:'ص 26'},
    {tip:String.raw`<p>الوحدة في هذا الموقع أربعة دروس: <b>هذا الدرس</b> (الأنواع والبطاريات الجافة الأولية)، ثم <b>البطاريات الثانوية والسعة والجودة</b>، ثم <b>تجميع الخلايا</b>، ثم <b>القدرة القصوى</b>.</p>`},
    {title:'مختبر مصغّر: أين يُدرس كل هدف؟',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل هدف من أهداف الوحدة اختر الدرس الذي يغطيه في هذا الموقع.',cats:['هذا الدرس','الثانوية والسعة والجودة','تجميع الخلايا','القدرة القصوى'],items:[
 ['حساب القدرة القصوى التي تعطيها بطارية للحمل',3,'الهدف 5، في الدرس الرابع من الوحدة.'],
 ['الأنواع الرئيسية من البطاريات الأولية الجافة',0,'الهدف 1: موضوع هذا الدرس.'],
 ['توصيل الخلايا على التوالي والتوازي',2,'الهدف 7، في الدرس الثالث.'],
 ['البطاريات الحامضية والقلوية',1,'الهدف 2: البطاريات الثانوية في الدرس الثاني.'],
 ['جودة البطاريات (كفاءة الأمبير ساعة والوات ساعة)',1,'الهدف 6، في الدرس الثاني مع البطاريات القلوية.']]})}
   ]},

  {st:2,short:'مقدمة',title:'مقدمة: ما البطارية؟',ref:'ص 27',
   q:'لماذا لا يجوز أن نصل قطبي البطارية بسلك وحده، مع أن السلك ينقل الإلكترونات؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="بطارية تغذي مصباحاً، والإلكترونات تنتقل في السلك من القطب السالب إلى الموجب" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="البطارية: علبة مملوءة بمواد كيميائية تنتج الإلكترونات بتفاعلات كيميائية كهربائية."><rect x="70" y="110" width="90" height="130" rx="10" fill="#4FB3A9" stroke="#2C4A40" stroke-width="3"/><rect x="98" y="96" width="34" height="14" rx="3" fill="#2C4A40" stroke="#2C4A40" stroke-width="0"/><text x="115" y="166" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">مواد</text><text x="115" y="184" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">كيميائية</text></g><text x="115" y="88" text-anchor="middle" font-size="18" fill="#E8735A" font-weight="700" direction="ltr">+</text><text x="115" y="262" text-anchor="middle" font-size="20" fill="#2C4A40" font-weight="700" direction="ltr">−</text><line x1="115" y1="96" x2="115" y2="60" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><line x1="115" y1="60" x2="270" y2="60" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><line x1="270" y1="60" x2="270" y2="140" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><line x1="115" y1="240" x2="115" y2="276" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><line x1="115" y1="276" x2="270" y2="276" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><line x1="270" y1="276" x2="270" y2="196" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><g data-tip="الحمل الكهربائي (مصباح هنا): يجب أن يكون في الدائرة. توصيل القطبين بسلك وحده خطر: انفجار أو حريق أو تفريغ شبه فوري (ص 27)."><circle cx="270" cy="168" r="28" fill="#F2C14E" stroke="#2C4A40" stroke-width="3"/><path d="M256 172 q7 -18 14 0 q7 18 14 0" fill="none" stroke="#2C4A40" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/><text x="316" y="172" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">حمل</text></g><g data-tip="اتجاه حركة الإلكترونات: تتجمع عند القطب السالب وتنتقل عبر السلك إلى القطب الموجب."><line x1="200" y1="276" x2="232.8" y2="276" stroke="#E8735A" stroke-width="3" stroke-linecap="round"/><polygon points="240.0,276.0 231.0,280.9 231.0,271.1" fill="#E8735A"/><line x1="270" y1="120" x2="270" y2="99.2" stroke="#E8735A" stroke-width="3" stroke-linecap="round"/><polygon points="270.0,92.0 274.9,101.0 265.1,101.0" fill="#E8735A"/><line x1="210" y1="60" x2="177.2" y2="60" stroke="#E8735A" stroke-width="3" stroke-linecap="round"/><polygon points="170.0,60.0 179.0,55.0 179.0,65.0" fill="#E8735A"/><rect x="160" y="262" width="100" height="28" fill="transparent"/><rect x="150" y="46" width="100" height="28" fill="transparent"/></g><text x="196" y="300" text-anchor="middle" font-size="12.5" fill="#E8735A" font-weight="600" direction="rtl">الإلكترونات: من السالب إلى الموجب</text></svg>`,
   cap:'بطارية تغذي حملاً (مصباحاً)، والإلكترونات تنتقل في السلك من القطب السالب إلى الموجب.<br><b>مرّر المؤشر على البطارية والحمل والأسهم (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'يشير مصطلح «البطارية» في الواقع إلى:',opts:[
     ['خلية واحدة فقط',false,'المصطلح يستعمل أحياناً لخلية واحدة، لكن معناه في الواقع أوسع.'],
     ['مجموعة من الخلايا (الأعمدة) المتصلة ببعضها',true,'نص الكتاب: «ويشير مصطلح البطارية في الواقع إلى مجموعة من الخلايا (الأعمدة) المتّصلة ببعضها».'],
     ['سلك يصل قطبين',false,'السلك موصل خارجي، والبطارية هي مصدر الإلكترونات.']]}}
   ],
   body:[
    {book:String.raw`<p>البطارية في أبسط صورها هي علبة مملوءة بالمواد الكيميائية التي تنتج إلكترونات وتسمى التفاعلات التي تنتج عنها تلك الإلكترونات <b>تفاعلات كيميائية كهربائية</b>. ولابد أن تحتوي كل بطارية على <b>قطبين أحدهما موجب والآخر سالب</b> حيث تتجمع الإلكترونات وتنتقل منه إلى القطب الموجب في حالة التوصيل بينهما خارجياً بموصل "سلك" كهربائي ولكن <b>من الخطورة الشديدة الاقتصار على ذلك الموصل دون إضافة أحمال كهربائية عليه</b> لأن من شأن ذلك إحداث انفجار أو حريق أو على أقل تقدير تفريغ البطارية من شحنتها بالشكل شبه فوري.</p>
     <p>ويشير مصطلح البطارية في الواقع إلى مجموعة من الخلايا (الأعمدة) المتّصلة ببعضها، إلاّ أنّ المصطلح غالباً ما يستخدم للدلالة على خلية واحدة كتلك المستعملة في الكشّافات الضوئية اليدوية ولعب الأطفال الكهربائية.</p>
     <p>تُستَخدَم البطاريات بمثابة مصادر مريحة للطاقة الكهربائية. فهي تمد الأجهزة خفيفة الحمل مثل المذياع، والمسجلات الصوتية والتلفاز، بالطاقة الكهربائية. وتمدّ بطارية السيارة بالطاقة الكهربائية اللازمة لإدارة المحرّك، كما تمدّ البطاريات أيضاً سفن الفضاء والغوّاصات بالكهرباء. وخلال فترات انقطاع التيار، تمدّ البطاريات أجهزة الهاتف، وأجهزة إنذار الحرائق والمستشفيات وغيرها من المباني الأساسية بالكهرباء في حالات الطوارئ.</p>`,ref:'ص 27'},
    {tip:String.raw`<p>لكل خلية مقاومة داخلية صغيرة (للخلية المنجنية بين <span class="ltr">0.2</span> و<span class="ltr">0.5</span> أوم كما سيأتي في المحطة 4). إذا وصلنا القطبين بسلك مقاومته شبه صفر يمر تيار يساوي تقريباً \(E/r\): من خلية <span class="ltr">1.5 V</span> يكون بين \(1.5/0.5=3\ \text{A}\) و\(1.5/0.2=7.5\ \text{A}\)، وهو تيار كبير لخلية صغيرة، فتسخن وتفرغ بسرعة.</p>`,title:'لماذا السلك وحده خطر؟'},
    {watch:String.raw`<p>لا تضع بطارية في جيب فيه مفاتيح أو عملات معدنية: قد تلمس القطبين معاً فتصنع قصراً (دائرة بلا حمل) فتسخن البطارية.</p>`},
    {add:String.raw`<p>من الأمثلة التي ذكرها الكتاب: الأجهزة في المستشفيات وأجهزة إنذار الحرائق تعمل على البطاريات عند انقطاع الكهرباء. وتسمى هذه المنظومات عادة «مصادر الطاقة غير المنقطعة» <span class="ltr">UPS</span>.</p>`},
    {title:'مختبر مصغّر: سلك وحده بين القطبين',widget:(el,B)=>DCML.lab(el,B,{intro:'خلية منجنية <span class="ltr">1.5 V</span>، ومقاومتها الداخلية بين <span class="ltr">0.2</span> و<span class="ltr">0.5 Ω</span> (من الكتاب، المحطة 4). نصل قطبيها بسلك مقاومته شبه صفر، فلا يحدّ التيار إلا المقاومة الداخلية: \\(I\\approx E/r\\).',
 predict:{q:'خلية مقاومتها الداخلية <b>أصغر</b> قُصر قطباها بسلك. التيار:',opts:[
  ['أصغر، فهي أكثر أماناً',false,'المقاومة الداخلية وحدها تحدّ التيار؛ كلما صغرت كبر التيار.'],
  ['أكبر، فتسخن الخلية أسرع',true,'\\(I\\approx E/r\\): مقاومة أصغر ← تيار أكبر، وكل القدرة تتحول حرارة داخل الخلية.'],
  ['لا يتغير',false,'التيار يعتمد على المقاومة الداخلية في هذه الحالة.']]},
 ins:[{k:'r',l:'المقاومة الداخلية r',u:'Ω',min:0.2,max:0.5,step:0.05,v:0.5}],
 calc:(s,P,B)=>{const I=1.5/s.r;return {facts:[['تيار القصر '+((x)=>'<bdi class="ltr">'+x+'</bdi>')('≈ E ÷ r'),DCML.fm(B,B.round(I,2))+' A','bad'],['حرارة داخل الخلية '+((x)=>'<bdi class="ltr">'+x+'</bdi>')('≈ E × I'),DCML.fm(B,B.round(1.5*I,2))+' W','bad']],bars:[{l:'التيار',v:I,max:7.5,u:'A',col:'--stop'}],
  msg:'لا حمل يأخذ الطاقة: كلها تتحول حرارة داخل الخلية، فتسخن وتفرغ بسرعة. لذلك لا نصل القطبين بسلك وحده.',cls:'warn'}}})}
   ]},

  {st:3,short:'أنواع البطاريات',title:'أنواع البطاريات',ref:'ص 27–28',
   q:'بطارية الكشاف ترميها حين تنفد، وبطارية السيارة تعيد شحنها. ما الفرق بينهما؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="تصنيف البطاريات: أولية وثانوية، وأمثلة الجهد" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><rect x="120" y="34" width="120" height="34" rx="10" fill="#2C4A40" stroke="#2C4A40" stroke-width="0"/><text x="180" y="57" text-anchor="middle" font-size="15" fill="#FBF6EE" font-weight="700" direction="rtl">البطاريات</text><line x1="180" y1="68" x2="180" y2="84" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><line x1="95" y1="84" x2="265" y2="84" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><line x1="95" y1="84" x2="95" y2="98" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><line x1="265" y1="84" x2="265" y2="98" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><g data-tip="البطاريات الأولية: تتوقف عن العمل بعد استهلاك إحدى موادها الكيميائية ويجب التخلص منها."><rect x="200" y="98" width="130" height="58" rx="10" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><text x="265" y="122" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" direction="rtl">أولية</text><text x="265" y="143" text-anchor="middle" font-size="12" fill="#2C4A40" direction="rtl">تُرمى بعد نفادها</text></g><g data-tip="البطاريات الثانوية (بطاريات التخزين): يمكن إعادة استعمالها بعد نفاد طاقتها بإعادة شحنها."><rect x="30" y="98" width="130" height="58" rx="10" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><text x="95" y="122" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" direction="rtl">ثانوية</text><text x="95" y="143" text-anchor="middle" font-size="12" fill="#2C4A40" direction="rtl">يعاد شحنها</text></g><g data-tip="الخلية الأولية في كاشفات الضوء اليدوية جهدها ⟦1.5 V⟧."><rect x="215" y="172" width="100" height="44" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="265" y="191" text-anchor="middle" font-size="12" fill="#2C4A40" direction="rtl">كشاف يدوي</text><text x="265" y="209" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="ltr">1.5 V</text></g><g data-tip="أغلب البطاريات الثانوية في السيارات جهدها ⟦12 V⟧: ست خلايا كل منها ⟦2 V⟧ على التوالي."><rect x="45" y="172" width="100" height="44" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="95" y="191" text-anchor="middle" font-size="12" fill="#2C4A40" direction="rtl">بطارية سيارة</text><text x="95" y="209" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="ltr">12 V = 6 × 2 V</text></g><line x1="265" y1="156" x2="265" y2="172" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><line x1="95" y1="156" x2="95" y2="172" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><text x="180" y="244" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">حسب الإلكتروليت</text><g data-tip="الخلايا الجافة: الإلكتروليت فيها مواد جيلاتينية أو تشبه المعجون (لا تنساب)."><rect x="190" y="256" width="110" height="30" rx="15" fill="#E9B949" stroke="#2C4A40" stroke-width="2"/><text x="245" y="276" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="rtl">خلايا جافة</text></g><g data-tip="الخلايا السائلة: أنواع قليلة من الأولية، وأغلب الثانوية، فيها إلكتروليت سائل."><rect x="60" y="256" width="110" height="30" rx="15" fill="#BFE3DF" stroke="#2C4A40" stroke-width="2"/><text x="115" y="276" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="rtl">خلايا سائلة</text></g></svg>`,
   cap:'تصنيف البطاريات حسب إمكان إعادة الشحن، وأمثلة الجهد، والتصنيف حسب الإلكتروليت.<br><b>مرّر المؤشر على البطاقات (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:String.raw`بطارية السيارة <span class="ltr">12 V</span>. من كم خلية تتكوّن حسب الكتاب؟`,opts:[
     ['ثماني خلايا',false,'ثماني خلايا جهد كل منها 1.5 V تعطي 12 V، لكن الكتاب يتكلم عن خلايا 2 V.'],
     ['ست خلايا، كل منها 2 فولت على التوالي',true,'نص الكتاب: «وهي تتكوّن من ست خلايا كل منها ينتج 2 فولت متصلة ببعضها على التوالي».'],
     ['خلية واحدة كبيرة',false,'الجهد يأتي من خلايا على التوالي.']]}}
   ],
   body:[
    {book:String.raw`<p>تنتج المصانع أنواعاً عديدة ومختلفة من البطاريات التي يمكن أن تُصنف حسب تصميماتها الأساسية. ويحدِّد تصميم البطارية كمية الكهرباء المولِّدة. وتتوقف بعض البطاريات التي تُسمى <b>البطاريات الأولية</b> عن العمل، وينتهي مفعولها، ويجب التخلص منها بعد استهلاك إحدى المواد الكيميائية المكونة لها. ويمكن إعادة استعمال أنواع أخرى من البطاريات بعد نفاد طاقتها وذلك بإعادة شحنها. ويسمى مثل هذا النوع <b>البطاريات الثانوية، أو بطاريات التخزين</b>.</p>
     <p>يمكن أيضاً تصنيف البطاريات حسب محتوياتها الإلكتروليتية وهي المادة الموصلة للتيار الكهربائي داخل الخلية. وتحتوي العديد من أنواع البطاريات الأولية على الإلكتروليت على هيئة مواد جيلاتينية، أو على هيئة مواد تشبه المعجون. وتُعرَف مثل هذه البطاريات التي تحتوي على مكوّنات غير قابلة للانسياب <b>بالخلايا الجافة</b>. وتسمى أنواع قليلة من البطاريات الأولية <b>بالخلايا السائلة</b> لاحتوائها على مواد كيميائية سائلة. وتحتوي أغلب أنواع البطاريات الثانوية على إلكتروليت سائل.</p>
     <p>وتختلف البطاريات أيضاً في الجهد المتولد. فالخلية الأولية كتلك المستعمل في كاشفات الضوء اليدوية جهدها <b>١,٥ فولت</b>. أما أغلب البطاريات الثانوية، والمستعملة في السيارات، فهي بطاريات جهدها <b>١٢ فولت</b>، وهي تتكوّن من <b>ست خلايا كل منها ينتج ٢ فولت</b> متصلة ببعضها على التوالي.</p>
     <p>إذن ملخص لما سبق، البطارية عبارة عن مجموعة من الخلايا الكهربائية موصلة على التوالي أو على التوازي أو على التوالي والتوازي معاً لتعطي جهداً معيناً وتياراً معيناً. وتنقسم الخلايا الكهربائية إلى نوعين هما <b>الخلايا الابتدائية والخلايا الثانوية</b>.</p>`,ref:'ص 27–28'},
    {tip:String.raw`<div style="position:relative;overflow-x:auto"><table class="tt"><thead><tr><th></th><th>الأولية (الابتدائية)</th><th>الثانوية (التخزين)</th></tr></thead><tbody>
     <tr><td>بعد نفاد الطاقة</td><td>يُتخلص منها</td><td>يعاد شحنها</td></tr>
     <tr><td>الإلكتروليت غالباً</td><td>جيلاتيني أو معجون (جافة)</td><td>سائل</td></tr>
     <tr><td>مثال من الكتاب</td><td>خلية الكشاف <span class="ltr">1.5 V</span></td><td>بطارية السيارة <span class="ltr">12 V</span></td></tr></tbody></table></div>`,title:'الأولية والثانوية في جدول'},
    {add:String.raw`<p>البطاريات الأسطوانية الصغيرة في جهاز التحكم عن بعد أولية في الغالب، أما بطارية الجوال فثانوية تعيد شحنها كل يوم.</p>`},
    {title:'مختبر مصغّر: أولية أم ثانوية؟',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل وصف اختر نوع البطارية.',cats:['أولية','ثانوية (تخزين)'],items:[
 ['خلية الكشاف اليدوي <span class="ltr">1.5 V</span>',0,'مثال الكتاب للخلية الأولية.'],
 ['تتوقف عن العمل ويجب التخلص منها بعد استهلاك إحدى موادها',0,'هذا تعريف البطاريات الأولية (ص 27).'],
 ['بطارية السيارة <span class="ltr">12 V</span> من ست خلايا <span class="ltr">2 V</span>',1,'«أغلب البطاريات الثانوية، والمستعملة في السيارات، فهي بطاريات جهدها 12 فولت».'],
 ['يعاد استعمالها بعد نفاد طاقتها بإعادة شحنها',1,'هذا تعريف البطاريات الثانوية أو بطاريات التخزين.'],
 ['أغلب أنواعها تحتوي على إلكتروليت سائل',1,'«وتحتوي أغلب أنواع البطاريات الثانوية على إلكتروليت سائل».']]})}
   ]},

  {st:4,short:'البطاريات الجافة الأولية',title:'البطاريات الجافة الأولية: الخلية المنجنية',ref:'ص 28–29',
   q:'ما الذي يوجد داخل البطارية الجافة، وأيّ أجزائها هو القطب السالب؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مقطع طولي في البطارية الجافة وأجزاؤها" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E2ECF3"/><g data-tip="الغلاف الخارجي: ورقي أو معدني."><rect x="126" y="64" width="108" height="214" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/></g><g data-tip="حاوية الزنك: إناء الخلية وهي القطب السالب."><rect x="134" y="76" width="92" height="194" rx="6" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/></g><g data-tip="العازل الفاصل: يمنع مواد القطبين من الاختلاط."><rect x="140" y="92" width="80" height="172" rx="4" fill="#E8735A" stroke="#2C4A40" stroke-width="0"/></g><g data-tip="الإلكتروليت: عجينة من كلوريد النوشادر بدلاً من السائل."><rect x="144" y="96" width="72" height="164" rx="3" fill="#CDE7C9" stroke="#2C4A40" stroke-width="0"/></g><g data-tip="ثاني أكسيد المنجنيز ⟦MnO₂⟧: مادة القطب الموجب."><rect x="152" y="104" width="56" height="148" rx="3" fill="#F3C6B8" stroke="#2C4A40" stroke-width="0"/></g><g data-tip="عمود الكربون: يجمع التيار من القطب الموجب."><rect x="173" y="70" width="14" height="180" rx="3" fill="#59605C" stroke="#2C4A40" stroke-width="0"/></g><g data-tip="غطاء الأسفلت: طبقة مانعة تغلق الخلية من الأعلى."><rect x="134" y="76" width="92" height="10" rx="0" fill="#3B3B3B" stroke="#2C4A40" stroke-width="0"/></g><g data-tip="مكان للهواء: فراغ صغير تحت الغطاء."><rect x="152" y="88" width="56" height="10" rx="0" fill="#FBF6EE" stroke="#2C4A40" stroke-width="0"/></g><g data-tip="القطب الموجب: الغطاء المعدني البارز فوق عمود الكربون."><rect x="166" y="48" width="28" height="18" rx="4" fill="#E9B949" stroke="#2C4A40" stroke-width="2.5"/><text x="180" y="40" text-anchor="middle" font-size="18" fill="#E8735A" font-weight="700" direction="ltr">+</text></g><g data-tip="القطب السالب: الغطاء السفلي المتصل بحاوية الزنك."><rect x="140" y="278" width="80" height="12" rx="4" fill="#8A9A93" stroke="#2C4A40" stroke-width="2.5"/><text x="180" y="306" text-anchor="middle" font-size="20" fill="#2C4A40" font-weight="700" direction="ltr">−</text></g><text x="60" y="58" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="rtl">قطب موجب</text><line x1="88" y1="58" x2="164" y2="56" stroke="#2C4A40" stroke-width="1.2" stroke-linecap="round"/><text x="60" y="128" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="rtl">عمود كربون</text><line x1="90" y1="128" x2="172" y2="128" stroke="#2C4A40" stroke-width="1.2" stroke-linecap="round"/><text x="60" y="190" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="rtl">ثاني أكسيد</text><text x="60" y="204" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="rtl">المنجنيز</text><line x1="88" y1="196" x2="154" y2="196" stroke="#2C4A40" stroke-width="1.2" stroke-linecap="round"/><text x="300" y="108" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="rtl">حاوية زنك</text><line x1="272" y1="108" x2="226" y2="108" stroke="#2C4A40" stroke-width="1.2" stroke-linecap="round"/><text x="300" y="170" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="rtl">الكتروليت</text><line x1="272" y1="170" x2="214" y2="170" stroke="#2C4A40" stroke-width="1.2" stroke-linecap="round"/><text x="300" y="230" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="rtl">عازل فاصل</text><line x1="272" y1="230" x2="220" y2="230" stroke="#2C4A40" stroke-width="1.2" stroke-linecap="round"/><text x="300" y="288" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="rtl">قطب سالب</text><line x1="272" y1="286" x2="222" y2="284" stroke="#2C4A40" stroke-width="1.2" stroke-linecap="round"/></svg>`,
   cap:'رسم مبسط للشكل <span class="ltr">(2-1)</span>: مقطع طولي في بطارية جافة.<br><b>مرّر المؤشر على أي جزء (أو المسه في الجوال) لتعرف اسمه ودوره.</b>',
   side:[
    {predict:{q:'في الخلية المنجنية، من أي مادة يُصنع القطب <b>السالب</b>؟',opts:[
     ['من ثاني أكسيد المنجنيز',false,'ثاني أكسيد المنجنيز هو القطب الموجب.'],
     ['من الكربون',false,'عمود الكربون يجمع التيار من القطب الموجب.'],
     ['من الزنك',true,'نص الكتاب: «والقطب السالب مصنوع من الزنك (Zn)».']]}}
   ],
   body:[
    {book:String.raw`<p>البطاريات الجافة الأولية الشكل (2-1) هي أكثر أنواع الخلايا الجافة الأولية شيوعاً. وتختلف هذه الأنواع من البطاريات في العديد من النواحي، ولكنّها تشترك جميعاً في مكوِّنات أساسية معيّنة. ويوجد في كلّ بطارية جافة أولية مكونان يسميان القطبين، ويتكون كل قطب من نوع مختلف من المواد الكيميائية الفعالة.</p>
     <p>وتنتج الطاقة الكهربية هنا نتيجة لتفاعلات كيميائية تتغير معها المواد المستعملة مما يستدعي تغييرها لإعادة استخدام الخلية. وتتكون الخلية هنا من قطبين مغمورين في محلول إلكتروليتي ومثال ذلك <b>خلية لكلانشيه <span class="ltr">(Leclanché Cell)</span></b> والتي تسمى أيضاً <b>الخلية المنجنية <span class="ltr">(Manganic Cell)</span></b> حيث تستخدم ثاني أوكسيد المنجنيز الشكل (2-1)، فالقطب الموجب مصنوع من ثاني أوكسيد المنجنيز \((\mathrm{MnO_2})\)، والقطب السالب مصنوع من الزنك \((\mathrm{Zn})\)، والمحلول الإلكتروليتي عبارة عن محلول ملح من أملاح النوشادر مثل محلول كلوريد النوشادر بنسبة <b>٢٠٪</b> \((\mathrm{NH_4Cl})\). وتعطي الخلية جهداً قدره <b>١,٥ فولت</b> ومقاومتها الداخلية بين <b>٠,٢ و ٠,٥ أوم</b>. ومصدر الطاقة هنا هو في تحويل الزنك إلى أكسيد الزنك، وتتوقف قيمة الطاقة التي تعطيها الخلية بالأمبير ساعة على وزن المواد المستخدمة (الأقطاب).</p>
     <p>والبطارية الجافة عبارة عن حالة من هذا النوع من الخلايا حيث يستبدل السائل الإلكتروليتي بعجينة من محلول كلوريد النوشادر المخلوط بنشارة الخشب والدقيق والخميرة....إلخ.</p>`,ref:'ص 28–29'},
    {tip:String.raw`<div style="position:relative;overflow-x:auto"><table class="tt"><tbody><tr><th>القطب الموجب</th><td>ثاني أكسيد المنجنيز \((\mathrm{MnO_2})\)</td></tr><tr><th>القطب السالب</th><td>الزنك \((\mathrm{Zn})\)</td></tr><tr><th>الإلكتروليت</th><td>كلوريد النوشادر <span class="ltr">20%</span> \((\mathrm{NH_4Cl})\) — عجينة في البطارية الجافة</td></tr><tr><th>الجهد</th><td><span class="ltr">1.5 V</span></td></tr><tr><th>المقاومة الداخلية</th><td>بين <span class="ltr">0.2</span> و<span class="ltr">0.5</span> أوم</td></tr></tbody></table></div>`,title:'بطاقة الخلية المنجنية'},
    {book:String.raw`<p>يتسبب الإلكتروليت الموجود بين الأقطاب في شحن أحدها وهو القطب السالب (المهبط) بشحنة سالبة، والآخر ويسمى القطب الموجب (المصعد) بشحنة موجبة. ويساعد الإلكتروليت في استمرار تعزيز التفاعلات الكيميائية التي تحدث عند القطبين.</p>
     <p>وهناك ثلاثة أنواع رئيسة من البطاريات الأولية الجافة، هي:</p>
     <ol><li>خلايا الكربون ـ الخارصين.</li><li>الخلايا القاعدية.</li><li>خلايا الزئبق.</li></ol>`,ref:'ص 29'},
    {watch:String.raw`<p>التسمية بين القوسين في الكتاب معكوسة: في الخلية التي تعطي تياراً <b>القطب السالب هو المصعد (الأنود)</b> حيث يتأكسد الزنك، و<b>القطب الموجب هو المهبط (الكاثود)</b>.</p>`,fix:true},
    {add:String.raw`<p>«الخارصين» هو الاسم العربي القديم للزنك؛ الكتاب يستعمل الكلمتين بالمعنى نفسه. والمحطات الثلاث التالية لكل نوع من الأنواع الثلاثة.</p>`},
    {title:'مختبر مصغّر: بطاقة الخلية المنجنية',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل مادة اختر دورها في الخلية المنجنية (خلية لكلانشيه).',cats:['القطب الموجب','القطب السالب','الإلكتروليت'],items:[
 ['الزنك \\((\\mathrm{Zn})\\)',1,'«والقطب السالب مصنوع من الزنك».'],
 ['محلول كلوريد النوشادر <span class="ltr">20%</span> \\((\\mathrm{NH_4Cl})\\)',2,'هو المحلول الإلكتروليتي، ويصير عجينة في البطارية الجافة.'],
 ['ثاني أكسيد المنجنيز \\((\\mathrm{MnO_2})\\)',0,'«فالقطب الموجب مصنوع من ثاني أوكسيد المنجنيز»؛ ومنه جاء اسم الخلية المنجنية.']]})}
   ]},

  {st:5,short:'الكربون ـ الخارصين',title:'خلايا الكربون ـ الخارصين',ref:'ص 29–30',
   q:'علبة الزنك في هذه الخلية لها عملان في وقت واحد. ما هما؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="أدوار أجزاء خلية الكربون والخارصين" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><rect x="36" y="70" width="84" height="190" rx="10" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><rect x="46" y="82" width="64" height="166" rx="6" fill="#F3C6B8" stroke="#2C4A40" stroke-width="0"/><rect x="72" y="56" width="12" height="190" rx="3" fill="#59605C" stroke="#2C4A40" stroke-width="0"/><rect x="68" y="46" width="20" height="12" rx="3" fill="#E9B949" stroke="#2C4A40" stroke-width="2"/><text x="78" y="284" text-anchor="middle" font-size="18" fill="#2C4A40" font-weight="700" direction="ltr">−</text><text x="78" y="38" text-anchor="middle" font-size="16" fill="#E8735A" font-weight="700" direction="ltr">+</text><g data-tip="علبة الخارصين: إناء لمحتويات الخلية، وفي الوقت نفسه القطب السالب."><rect x="150" y="50" width="180" height="48" rx="10" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><text x="240" y="70" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">علبة الخارصين</text><text x="240" y="89" text-anchor="middle" font-size="12" fill="#2C4A40" direction="rtl">إناء + القطب السالب</text></g><g data-tip="عمود الكربون في المركز: مجمع تيار للقطب الموجب، وليس هو المادة الفعالة."><rect x="150" y="110" width="180" height="48" rx="10" fill="#C9CCCA" stroke="#2C4A40" stroke-width="2.5"/><text x="240" y="130" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">عمود الكربون</text><text x="240" y="149" text-anchor="middle" font-size="12" fill="#2C4A40" direction="rtl">مجمع تيار للقطب الموجب</text></g><g data-tip="خليط ثاني أكسيد المنجنيز ومسحوق الكربون مضغوط حول العمود: المادة الفعلية للقطب الموجب."><rect x="150" y="170" width="180" height="48" rx="10" fill="#F3C6B8" stroke="#2C4A40" stroke-width="2.5"/><text x="240" y="190" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">MnO₂ + مسحوق كربون</text><text x="240" y="209" text-anchor="middle" font-size="12" fill="#2C4A40" direction="rtl">القطب الموجب الفعلي</text></g><g data-tip="الإلكتروليت معجون من كلوريد الأمونيوم وكلوريد الخارصين والماء، والعازل شريحة مسامية مغموسة فيه."><rect x="150" y="230" width="180" height="48" rx="10" fill="#CDE7C9" stroke="#2C4A40" stroke-width="2.5"/><text x="240" y="250" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">معجون + عازل مسامي</text><text x="240" y="269" text-anchor="middle" font-size="12" fill="#2C4A40" direction="rtl">الإلكتروليت والفاصل</text></g><line x1="120" y1="74" x2="150" y2="74" stroke="#2C4A40" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="3 3"/><line x1="84" y1="134" x2="150" y2="134" stroke="#2C4A40" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="3 3"/><line x1="104" y1="194" x2="150" y2="194" stroke="#2C4A40" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="3 3"/></svg>`,
   cap:'دور كل جزء في خلية الكربون ـ الخارصين.<br><b>مرّر المؤشر على البطاقات (أو المسها في الجوال) لتعرف التفصيل.</b>',
   side:[
    {predict:{q:'ما المادة <b>الفعلية</b> المكوّنة للقطب الموجب في خلية الكربون ـ الخارصين؟',opts:[
     ['عمود الكربون وحده',false,'عمود الكربون مجمع تيار للقطب الموجب فقط.'],
     ['خليط من ثاني أكسيد المنجنيز ومسحوق الكربون',true,'نص الكتاب: «إلا أن المادة الفعلية المكوّنة للقطب الموجب هي خليط من ثاني أكسيد المنجنيز ومسحوق الكربون».'],
     ['علبة الخارصين',false,'العلبة هي القطب السالب.']]}}
   ],
   body:[
    {book:String.raw`<p><b>خلايا الكربون ـ الخارصين:</b> متعددة الاستعمالات، حيث تستعمل في كشّافات الضوء اليدوية، ووحدات توليد الومضات الكهربائية لأجهزة وآلات التصوير، وفي لعب الأطفال. وتسمى هذه الخلايا أيضاً عمود لكلانشيه الجاف، وهي مُصممة داخل عبوة من الخارصين. وتستخدم العلبة كإناء لمحتويات الخلية، وفي الوقت نفسه تقوم بعمل القطب السالب. يعمل عمود الكربون الموجود في مركز الخلية، كمجمع تيار للقطب الموجب، إلا أن المادة الفعلية المكوّنة للقطب الموجب هي خليط من ثاني أكسيد المنجنيز ومسحوق الكربون، وهذا الخليط مضغوط حول العمود، ويوجد الإلكتروليت في هذه الخلايا في صورة معجون يتكوّن من كلوريد الأمونيوم وكلوريد الخارصين والماء.</p>
     <p>يفصل القطبان السالب والموجب بشريحة من مادة مساميّة مثل الورق أو الكربون التي سبق غمسها في الإلكتروليت. وتُسمى هذه الطبقة الرّقيقة العازل، وهي تمنع المواد المكونة للأقطاب من الاختلاط معاً أو التفاعل في حالة عدم استعمال البطارية، مثل هذا الاختلاط من شأنه أن يؤدي إلى تآكل القطب السّالب الخارصيني قبل الأوان، والتقليل من العمر الافتراضي للبطارية.</p>`,ref:'ص 29–30'},
    {title:'تابع السلسلة: ماذا لو لم يوجد العازل؟',widget:(el,B)=>{
      const S=['لا عازل بين القطبين','مواد القطبين تختلط وتتفاعل حتى والبطارية غير مستعملة','تآكل القطب السالب الخارصيني قبل الأوان','عمر افتراضي أقصر للبطارية'];
      el.innerHTML=`<div class="chain">${S.map((s,i)=>`<span class="ck${i===S.length-1?' end':''}">${s}</span>${i<S.length-1?'<span class="ar">←</span>':''}`).join('')}</div><div class="w-row"><button class="btn pri" type="button" data-go>تتبّع السلسلة</button><button class="btn" type="button" data-rs>إعادة</button></div>`;
      const ks=[...el.querySelectorAll('.ck')];let tm=[];
      const rs=()=>{tm.forEach(clearTimeout);tm=[];ks.forEach(k=>k.classList.remove('on'))};
      el.querySelector('[data-go]').onclick=()=>{rs();ks.forEach((k,i)=>tm.push(setTimeout(()=>k.classList.add('on'),i*600)))};
      el.querySelector('[data-rs]').onclick=rs;
    }},
    {watch:String.raw`<p>كلمة «العازل» هنا تعني الشريحة المسامية بين القطبين داخل الخلية، وهي غير «العازل الكهربائي» بين لوحي المكثف في الوحدة الأولى.</p>`}
   ]},

  {st:6,short:'القاعدية',title:'الخلايا القاعدية',ref:'ص 30',
   q:'تشبه خلية الكربون ـ الخارصين في موادها… فلماذا تدوم أطول بكثير؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="العمر الافتراضي للخلية القاعدية من 5 إلى 8 أضعاف خلية الكربون والخارصين" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><text x="180" y="58" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">العمر الافتراضي في لعب الأطفال</text><text x="300" y="108" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="rtl">كربون - خارصين</text><g data-tip="خلية الكربون - الخارصين: نعدّ عمرها وحدة واحدة للمقارنة."><rect x="40" y="118" width="28" height="28" rx="4" fill="#E9B949" stroke="#2C4A40" stroke-width="2"/></g><text x="300" y="180" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="rtl">قاعدية</text><g data-tip="الخلية القاعدية: عمرها الافتراضي أطول بما بين ⟦5⟧ و⟦8⟧ مرات (ص 30)."><rect x="40" y="190" width="140" height="28" rx="4" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/><rect x="180" y="190" width="84" height="28" rx="4" fill="#BFE3DF" stroke="#2C4A40" stroke-width="2" stroke-dasharray="4 3"/></g><text x="110" y="236" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="ltr">× 5</text><text x="250" y="236" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">حتى × 8</text><g data-tip="الإلكتروليت في القاعدية محلول قلوي قوي فيه هيدروكسيد البوتاسيوم ⟦KOH⟧، يوصل الكهرباء بفاعلية أكبر."><rect x="70" y="256" width="220" height="30" rx="15" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="180" y="276" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="rtl">الإلكتروليت: هيدروكسيد البوتاسيوم</text></g></svg>`,
   cap:'العمر الافتراضي للخلية القاعدية مقارنة بخلية الكربون ـ الخارصين في لعب الأطفال (ص 30).<br><b>مرّر المؤشر على الأعمدة والإلكتروليت (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'بكم مرة يطول العمر الافتراضي للخلية القاعدية عن خلية الكربون ـ الخارصين في لعب الأطفال؟',opts:[
     ['بين 5 و 8 مرات',true,'نص الكتاب: «لأن عمرها الافتراضي أطول بما يتراوح بين ٥ و ٨ مرات».'],
     ['مرتين فقط',false,'الفرق في الكتاب أكبر من ذلك بكثير.'],
     ['العمر نفسه، لكنها أرخص',false,'الكتاب يقول إنها أكفأ اقتصادياً لأن عمرها أطول.']]}}
   ],
   body:[
    {book:String.raw`<p><b>الخلايا القاعدية:</b> تشبه خلايا الكربون ـ الخارصين، ففي كليهما نجد نفس المواد المكوّنة للقطب السالب والقطب الموجب، وتقوم هذه المواد بتفاعلات كيميائية متشابهة؛ إلا أن هذين النوعين من الخلايا الأولية الجافة يختلفان في عديد من النواحي.</p>
     <p>تحتوي الخلية القاعدية على قطب سالب من الخارصين يغلب عليه التكوين المسامي الذي يتأكسد بدرجة أسرع من ذلك الموجود في خلية الكربون ـ الخارصين، والإلكتروليت في الخلية القاعدية عبارة عن محلول قلوي قوي يحتوي على مركب <b>هيدروكسيد البوتاسيوم</b> ويوصل هذا المركب الكهرباء داخل الخلية بدرجة أكثر فاعلية من محلول كلوريد الأمونيوم، وكلوريد الخارصين في خلية الكربون ـ الخارصين، وتمكن هذه المواصفات الخلية القاعدية من توليد تيّار عالٍ يستمر بكفاءة أعلى من خليّة الكربون ـ الخارصين.</p>
     <p>تستخدم الخلايا القاعدية مصدراً ممتازاً للإضاءة في مصابيح الدراجات، وآلات الحلاقة، وأجهزة التلفاز خفيفة الحمل، وأجهزة التخاطب الإلكترونية. هذه الخلايا أكفأ اقتصادياً في حالة استعمالها في لعب الأطفال الكهربائية التي تتطلب كمية عالية من الكهرباء، عن خلايا الكربون ـ الخارصين، وذلك لأن عمرها الافتراضي أطول بما يتراوح بين <b>٥ و ٨ مرات</b>.</p>`,ref:'ص 30'},
    {tip:String.raw`<div style="position:relative;overflow-x:auto"><table class="tt"><thead><tr><th></th><th>الكربون ـ الخارصين</th><th>القاعدية</th></tr></thead><tbody>
     <tr><td>القطب السالب</td><td>علبة خارصين</td><td>خارصين مسامي يتأكسد أسرع</td></tr>
     <tr><td>الإلكتروليت</td><td>معجون كلوريد الأمونيوم وكلوريد الخارصين</td><td>محلول قلوي قوي (هيدروكسيد البوتاسيوم)</td></tr>
     <tr><td>التيار</td><td>أقل</td><td>تيار عالٍ يستمر بكفاءة أعلى</td></tr>
     <tr><td>العمر في لعب الأطفال</td><td>الأساس</td><td>أطول <span class="ltr">5–8</span> مرات</td></tr></tbody></table></div>`,title:'مقارنة بين النوعين'},
    {add:String.raw`<p>كلمة <span class="ltr">Alkaline</span> المطبوعة على كثير من البطاريات الأسطوانية في الأسواق تعني «قاعدية» (قلوية).</p>`},
    {title:'مختبر مصغّر: أي الخليتين؟',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل وصف اختر الخلية التي يصفها الكتاب.',cats:['الكربون ـ الخارصين','القاعدية'],items:[
 ['الإلكتروليت محلول قلوي قوي من هيدروكسيد البوتاسيوم',1,'هذا إلكتروليت الخلية القاعدية.'],
 ['الإلكتروليت معجون من كلوريد الأمونيوم وكلوريد الخارصين والماء',0,'هذا إلكتروليت خلية الكربون ـ الخارصين (المحطة السابقة).'],
 ['قطب سالب من خارصين مسامي يتأكسد بدرجة أسرع',1,'هذا من أوجه اختلاف الخلية القاعدية.'],
 ['عمرها في لعب الأطفال أطول <span class="ltr">5</span> إلى <span class="ltr">8</span> مرات',1,'لذلك هي أكفأ اقتصادياً في اللعب التي تتطلب كمية عالية من الكهرباء.']]})}
   ]},

  {st:7,short:'الزئبق',title:'خلايا الزئبق',ref:'ص 30–31',
   q:'أثناء الاستهلاك تتحول مواد القطبين. هل يتحول الإلكتروليت أيضاً؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="خلية الزئبق: ما يتحول وما يبقى أثناء الاستهلاك" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><text x="165" y="60" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">قبل</text><text x="59" y="60" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">بعد</text><g data-tip="الخارصين ⟦Zn⟧ يتحول إلى أكسيد الخارصين ⟦ZnO⟧."><rect x="230" y="76" width="100" height="40" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="280" y="101" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="rtl">القطب السالب</text><rect x="130" y="76" width="70" height="40" rx="8" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="165" y="101" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="ltr">Zn</text><line x1="124" y1="96" x2="102.4" y2="96" stroke="#E8735A" stroke-width="2.5" stroke-linecap="round"/><polygon points="96.0,96.0 104.0,91.6 104.0,100.4" fill="#E8735A"/><rect x="26" y="76" width="66" height="40" rx="8" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/><text x="59" y="101" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="ltr">ZnO</text></g><g data-tip="أكسيد الزئبقيك ⟦HgO⟧ يتحول إلى زئبق ⟦Hg⟧."><rect x="230" y="136" width="100" height="40" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="280" y="161" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="rtl">القطب الموجب</text><rect x="130" y="136" width="70" height="40" rx="8" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="165" y="161" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="ltr">HgO</text><line x1="124" y1="156" x2="102.4" y2="156" stroke="#E8735A" stroke-width="2.5" stroke-linecap="round"/><polygon points="96.0,156.0 104.0,151.6 104.0,160.4" fill="#E8735A"/><rect x="26" y="136" width="66" height="40" rx="8" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/><text x="59" y="161" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="ltr">Hg</text></g><g data-tip="هيدروكسيد البوتاسيوم ⟦KOH⟧ يبقى دون تغير."><rect x="230" y="196" width="100" height="40" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="280" y="221" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="rtl">الإلكتروليت</text><rect x="130" y="196" width="70" height="40" rx="8" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="165" y="221" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="ltr">KOH</text><line x1="124" y1="216" x2="102.4" y2="216" stroke="#E8735A" stroke-width="2.5" stroke-linecap="round"/><polygon points="96.0,216.0 104.0,211.6 104.0,220.4" fill="#E8735A"/><rect x="26" y="196" width="66" height="40" rx="8" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/><text x="59" y="221" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="ltr">KOH</text></g><text x="180" y="272" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">أثناء الاستهلاك</text></svg>`,
   cap:'ما يحدث لمواد خلية الزئبق أثناء الاستهلاك.<br><b>مرّر المؤشر على كل صف (أو المسه في الجوال) لتعرف أسماء المواد.</b>',
   side:[
    {predict:{q:'أي مادة في خلية الزئبق تبقى <b>دون تغير</b> أثناء الاستهلاك؟',opts:[
     ['الخارصين',false,'الخارصين يتحول إلى أكسيد الخارصين.'],
     ['أكسيد الزئبقيك',false,'أكسيد الزئبقيك يتحول إلى زئبق.'],
     ['هيدروكسيد البوتاسيوم',true,'نص الكتاب: «كما يتبقّى مركّب هيدروكسيد البوتاسيوم دون تغير».']]}}
   ],
   body:[
    {book:String.raw`<p><b>خلايا الزئبق:</b> هي خلايا ذات قطب سالب من الخارصين، وقطب موجب من أكسيد الزئبقيك، تحتوي على إلكتروليت هيدروكسيد البوتاسيوم. ويتحول الخارصين إلى أكسيد الخارصين، ويتحوّل أكسيد الزئبقيك إلى زئبق خلال عملية الاستهلاك، كما يتبقّى مركّب هيدروكسيد البوتاسيوم دون تغير.</p>`,ref:'ص 30–31'},
    {tip:String.raw`<div style="position:relative;overflow-x:auto"><table class="tt"><thead><tr><th>الجزء</th><th>المادة</th><th>بعد الاستهلاك</th></tr></thead><tbody>
     <tr><td>القطب السالب</td><td>الخارصين</td><td>أكسيد الخارصين</td></tr>
     <tr><td>القطب الموجب</td><td>أكسيد الزئبقيك</td><td>زئبق</td></tr>
     <tr><td>الإلكتروليت</td><td>هيدروكسيد البوتاسيوم</td><td>دون تغير</td></tr></tbody></table></div>`,title:'خلية الزئبق في جدول'},
    {add:String.raw`<p>الزئبق مادة سامة، ولهذا قلّ استعمال خلايا الزئبق كثيراً ومُنعت في دول عديدة. وأي بطارية مستهلكة لا تُرمى مع النفايات العادية، بل في حاويات جمع البطاريات إن وُجدت.</p>`},
    {title:'مختبر مصغّر: ماذا يصير بعد الاستهلاك؟',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل مادة في خلية الزئبق اختر ما يحدث لها أثناء الاستهلاك.',cats:['يتحول إلى أكسيد الخارصين','يتحول إلى زئبق','يبقى دون تغير'],items:[
 ['أكسيد الزئبقيك (القطب الموجب)',1,'«ويتحوّل أكسيد الزئبقيك إلى زئبق خلال عملية الاستهلاك».'],
 ['هيدروكسيد البوتاسيوم (الإلكتروليت)',2,'«كما يتبقّى مركّب هيدروكسيد البوتاسيوم دون تغير».'],
 ['الخارصين (القطب السالب)',0,'«ويتحول الخارصين إلى أكسيد الخارصين».']]})}
   ]},

  {recap:[
   String.raw`البطارية علبة مواد كيميائية تنتج إلكترونات بتفاعلات كيميائية كهربائية، ولها قطبان؛ ولا يجوز وصل القطبين بسلك دون حمل (ص 27).`,
   String.raw`الأولية تُرمى بعد نفادها، والثانوية (التخزين) يعاد شحنها. خلية الكشاف <span class="ltr">1.5 V</span>، وبطارية السيارة <span class="ltr">12 V</span> من ست خلايا كل منها <span class="ltr">2 V</span> (ص 27–28).`,
   String.raw`الخلية المنجنية (لكلانشيه): الموجب ثاني أكسيد المنجنيز، والسالب الزنك، والإلكتروليت كلوريد النوشادر؛ جهدها <span class="ltr">1.5 V</span> ومقاومتها الداخلية بين <span class="ltr">0.2</span> و<span class="ltr">0.5</span> أوم — الشكل (2-1).`,
   String.raw`الأنواع الرئيسة الثلاثة: الكربون ـ الخارصين (العلبة إناء وقطب سالب)، والقاعدية (هيدروكسيد البوتاسيوم، عمرها أطول <span class="ltr">5–8</span> مرات)، والزئبق (الإلكتروليت لا يتغير) (ص 29–31).`]}
],
 theory:[
  {h:'الوحدة الثانية: البطاريات — الأهداف',ref:'ص 25–26',html:`<p><b>الهدف العام للوحدة:</b> «معرفة العناصر الرئيسية المكونة للبطارية وفهم النوعين الأساسيين للخلايا: الابتدائية والثانوية، وكذلك معرفة وفهم الطرق المختلفة لتجميع البطاريات.»</p>
   <p><b>الأهداف:</b> أن:</p><ol><li>يعرف المتدرب الأنواع الرئيسية من البطاريات الأولية الجافة.</li><li>يعرف المتدرب أنواع البطاريات الثانوية الأكثر شيوعاً مثل البطاريات الحامضية والبطاريات القلوية.</li><li>يحدد المتدرب النقاط التي يجب مراعاتها للمحافظة على البطارية وبقائها في حالة جيدة.</li><li>يعرف المتدرب سعة البطارية وتيار الشحن، وكيفية تجميع الخلايا في البطاريات.</li><li>يتمكن المتدرب من حساب القدرة القصوى التي تعطيها بطارية للحمل.</li><li>يحدد المتدرب جودة البطاريات (كفاءة الأمبير/ساعة وكفاءة الواط/ساعة).</li><li>يتمكن المتدرب من توصيل الخلايا الكهربائية على التوالي والتوازي ومشاكل التوصيل.</li></ol>
   <p class="sub">هذا الدرس يغطي الهدف 1، والدرس التالي الهدفين 2 و3 والسعة والجودة، ثم التجميع (u2-l3) والقدرة القصوى (u2-l4).</p>`},
  {h:'مقدمة',ref:'ص 27',html:`<p>«البطارية في أبسط صورها هي علبة مملوءة بالمواد الكيميائية التي تنتج إلكترونات وتسمى التفاعلات التي تنتج عنها تلك الإلكترونات <b>تفاعلات كيميائية كهربائية</b>. ولابد أن تحتوي كل بطارية على <b>قطبين أحدهما موجب والآخر سالب</b> حيث تتجمع الإلكترونات وتنتقل منه إلى القطب الموجب في حالة التوصيل بينهما خارجياً بموصل "سلك" كهربائي <b>ولكن من الخطورة الشديدة الاقتصار على ذلك الموصل دون إضافة أحمال كهربائية</b> عليه لأن من شأن ذلك إحداث انفجار أو حريق أو على أقل تقدير تفريغ البطارية من شحنتها بالشكل شبه فوري.»</p>
   <p>«ويشير مصطلح البطارية في الواقع إلى <b>مجموعة من الخلايا (الأعمدة) المتّصلة ببعضها</b>، إلاّ أنّ المصطلح غالباً ما يستخدم للدلالة على خلية واحدة كتلك المستعملة في الكشّافات الضوئية اليدوية ولعب الأطفال الكهربائية.»</p>
   <p>«تُستَخدَم البطاريات بمثابة مصادر مريحة للطاقة الكهربائية»: المذياع والمسجلات والتلفاز، و«بطارية السيارة … لإدارة المحرّك»، وسفن الفضاء والغوّاصات، و«خلال فترات انقطاع التيار» أجهزة الهاتف وإنذار الحرائق والمستشفيات.</p>`},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب: لماذا السلك وحده خطر؟</b> لكل خلية مقاومة داخلية صغيرة (للخلية المنجنية بين 0.2 و 0.5 أوم كما سيأتي). إذا وصلنا القطبين بسلك مقاومته شبه صفر يكون التيار \\(I=E/r\\) كبيراً جداً: \\(1.5/0.3=5\\ A\\) من خلية صغيرة، فتسخن وتفرغ بسرعة. جرّب ذلك في المختبر.'},
  {h:'أنواع البطاريات',ref:'ص 27–28',html:`<ul><li>«تتوقف بعض البطاريات التي تُسمى <b>البطاريات الأولية</b> عن العمل، وينتهي مفعولها، ويجب التخلص منها بعد استهلاك إحدى المواد الكيميائية المكونة لها.»</li>
   <li>«ويمكن إعادة استعمال أنواع أخرى من البطاريات بعد نفاد طاقتها وذلك بإعادة شحنها. ويسمى مثل هذا النوع <b>البطاريات الثانوية، أو بطاريات التخزين</b>.»</li></ul>
   <p>«يمكن أيضاً تصنيف البطاريات حسب محتوياتها الإلكتروليتية وهي <b>المادة الموصلة للتيار الكهربائي داخل الخلية</b>». البطاريات التي تحتوي على مكوّنات غير قابلة للانسياب (مواد جيلاتينية أو تشبه المعجون) تعرف <b>بالخلايا الجافة</b>، وأنواع قليلة من الأولية تسمى <b>بالخلايا السائلة</b>، «وتحتوي أغلب أنواع البطاريات الثانوية على إلكتروليت سائل».</p>
   <p>«وتختلف البطاريات أيضاً في الجهد المتولد. فالخلية الأولية كتلك المستعمل في كاشفات الضوء اليدوية جهدها <b>1.5 فولت</b>. أما أغلب البطاريات الثانوية، والمستعملة في السيارات، فهي بطاريات جهدها <b>12 فولت</b>، وهي تتكوّن من <b>ست خلايا كل منها ينتج 2 فولت</b> متصلة ببعضها على التوالي.»</p>
   <p>«إذن … البطارية عبارة عن مجموعة من الخلايا الكهربائية موصلة على التوالي أو على التوازي أو على التوالي والتوازي معاً لتعطي جهداً معيناً وتياراً معيناً. وتنقسم الخلايا الكهربائية إلى نوعين هما <b>الخلايا الابتدائية والخلايا الثانوية</b>.»</p>`},
  {h:'البطاريات الجافة الأولية',ref:'ص 28–29',html:`<p>«وتنتج الطاقة الكهربية هنا نتيجة لتفاعلات كيميائية تتغير معها المواد المستعملة مما يستدعي تغييرها لإعادة استخدام الخلية. وتتكون الخلية هنا من قطبين مغمورين في محلول إلكتروليتي ومثال ذلك <b>خلية لكلانشيه <span class="ltr">(Leclanché Cell)</span></b> والتي تسمى أيضاً <b>الخلية المنجنية <span class="ltr">(Manganic Cell)</span></b>»:</p>
   <table class="tt"><tbody><tr><th>القطب الموجب</th><td>ثاني أكسيد المنجنيز \\((MnO_2)\\)</td></tr><tr><th>القطب السالب</th><td>الزنك \\((Zn)\\)</td></tr><tr><th>المحلول الإلكتروليتي</th><td>محلول ملح من أملاح النوشادر مثل كلوريد النوشادر بنسبة 20% \\((NH_4Cl)\\)</td></tr><tr><th>الجهد</th><td>1.5 فولت</td></tr><tr><th>المقاومة الداخلية</th><td>بين 0.2 و 0.5 أوم</td></tr></tbody></table>
   <p>«ومصدر الطاقة هنا هو في <b>تحويل الزنك إلى أكسيد الزنك</b>، وتتوقف قيمة الطاقة التي تعطيها الخلية بالأمبير ساعة على وزن المواد المستخدمة (الأقطاب).» «والبطارية الجافة عبارة عن حالة من هذا النوع من الخلايا حيث يستبدل السائل الإلكتروليتي بعجينة من محلول كلوريد النوشادر المخلوط بنشارة الخشب والدقيق والخميرة....إلخ.» <span class="ref">ص 29</span></p>`},
  {fig:'(2-1)',ref:'ص 29',caption:'بطارية جافة: مقطع طولي في خلية أسطوانية. اضغط على أي جزء في المختبر لتقرأ وصفه.',draw:()=>box(drySVG({}),620)},
  {html:`<p>«يتسبب الإلكتروليت الموجود بين الأقطاب في شحن أحدها وهو <b>القطب السالب</b> بشحنة سالبة، والآخر ويسمى <b>القطب الموجب</b> بشحنة موجبة. ويساعد الإلكتروليت في استمرار تعزيز التفاعلات الكيميائية التي تحدث عند القطبين.» <span class="ref">ص 29</span></p>`},
  {err:'<span class="fixnote"><b>ملاحظة على الكتاب (ص 29):</b> طُبع «القطب السالب (المهبط) … القطب الموجب (المصعد)»، والتسمية معكوسة: في الخلية التي تعطي تياراً <b>القطب السالب هو المصعد (الأنود)</b> حيث يتأكسد الزنك، و<b>القطب الموجب هو المهبط (الكاثود)</b>. حذفنا الكلمتين من النص أعلاه.</span>'},
  {h:'الأنواع الرئيسة من البطاريات الأولية الجافة',ref:'ص 29–31',html:`<ol><li><b>خلايا الكربون-الخارصين</b>: «تستعمل في كشّافات الضوء اليدوية، ووحدات توليد الومضات الكهربائية لأجهزة وآلات التصوير، وفي لعب الأطفال. وتسمى هذه الخلايا أيضاً عمود لكلانشيه الجاف، وهي مُصممة داخل عبوة من الخارصين. وتستخدم العلبة كإناء لمحتويات الخلية، وفي الوقت نفسه تقوم بعمل القطب السالب. يعمل عمود الكربون الموجود في مركز الخلية كمجمع تيار للقطب الموجب، إلا أن المادة الفعلية المكوّنة للقطب الموجب هي خليط من ثاني أكسيد المنجنيز ومسحوق الكربون … ويوجد الإلكتروليت في هذه الخلايا في صورة معجون يتكوّن من كلوريد الأمونيوم وكلوريد الخارصين والماء.» والعازل الرقيق بين القطبين «يمنع المواد المكونة للأقطاب من الاختلاط … مثل هذا الاختلاط من شأنه أن يؤدي إلى تآكل القطب السّالب الخارصيني قبل الأوان، والتقليل من العمر الافتراضي للبطارية.»</li>
   <li><b>الخلايا القاعدية</b>: «تشبه خلايا الكربون-الخارصين» في مواد القطبين، لكن قطبها السالب «من الخارصين يغلب عليه التكوين المسامي الذي يتأكسد بدرجة أسرع»، والإلكتروليت «محلول قلوي قوي يحتوي على مركب <b>هيدروكسيد البوتاسيوم</b>» يوصل الكهرباء بفاعلية أكبر، فتولد «تياراً عالياً يستمر بكفاءة أعلى». «عمرها الافتراضي أطول بما يتراوح بين <b>5 و 8 مرات</b>».</li>
   <li><b>خلايا الزئبق</b>: «قطب سالب من الخارصين، وقطب موجب من أكسيد الزئبقيك، تحتوي على إلكتروليت هيدروكسيد البوتاسيوم. ويتحول الخارصين إلى أكسيد الخارصين، ويتحوّل أكسيد الزئبقيك إلى زئبق خلال عملية الاستهلاك، كما يتبقّى مركّب هيدروكسيد البوتاسيوم دون تغير.»</li></ol>`},
  {err:'<span class="fixnote"><b>ملاحظات على الكتاب:</b> (1) ص 26: رقم الهدف الأخير طُبع (5) مكرراً والصحيح (7)، وطُبع «الأنواع البطاريات» — صُحّحا في قائمة الأهداف أعلاه. (2) ص 28: كُتب اسم الخلية «Laclanche» والصحيح <span class="ltr">Leclanché</span> (لكلانشيه).</span>'}
 ],
 lab:(el)=>{
  let hi='',dis=0,type='cz',r=0.3,load='lamp';const seen=new Set(),tseen=new Set(['cz']);const sorted={};const did={};
  el.innerHTML=`<div id="b1tp"></div><div class="grid cx-lab">
   <div class="panel c8"><h2>فكّك البطارية الجافة <small>مبنية على الشكل (2-1) ص 29</small></h2><div class="svgbox" id="b1v" style="max-width:620px;margin-inline:auto"></div>
    ${sl('b1d','مقدار ما استُهلك من الخلية',0,100,1,0)}<p class="sub">مع الاستهلاك يتحول الزنك إلى أكسيد الزنك (ص 29) فترق علبة الزنك، ويتغير خليط ثاني أكسيد المنجنيز. (الرسم توضيحي.)</p></div>
   <div class="panel c4"><h2>الجزء المختار</h2><div class="cx-parts" id="b1parts"></div><div id="b1info"></div><p class="sub" id="b1seen"></p></div>
   <div class="panel c6"><h2>الأنواع الثلاثة للبطاريات الأولية الجافة <small>ص 29–31</small></h2>${segHTML('bt',[['cz','كربون-خارصين'],['alk','قاعدية'],['hg','زئبق']],type)}<div id="b1type"></div></div>
   <div class="panel c6"><h2>الخلية والحمل: لماذا لا نصل القطبين بسلك؟ <small>مقدمة ص 27 وخلية لكلانشيه ص 28</small></h2>
    ${sl('b1r','المقاومة الداخلية للخلية r (الكتاب: 0.2–0.5 Ω)',0.2,0.5,0.01,r)}
    <div class="cx-row">${segHTML('bl',[['lamp','مصباح (حمل)'],['wire','سلك فقط']],load)}</div>
    <div class="svgbox" id="b1c" style="max-width:420px;margin-inline:auto"></div>
    <div class="facts">${fact('القوة الدافعة E','b1E')}${fact('التيار I = E/(R+r)','b1I')}${fact('الجهد على الطرفين','b1V')}${fact('القدرة الضائعة داخل الخلية','b1P')}</div><div id="b1msg"></div></div>
   <div class="panel c12"><h2>صنّف: أولية أم ثانوية؟ <small>ص 27–33</small></h2><div id="b1sort"></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="b1st"></ol></div></div>`;
  const $=s=>el.querySelector(s);
  const TP=B.params($('#b1tp'),'u2-l1',[{k:'RL',label:'مقاومة المصباح (الحمل) R',unit:'Ω',value:5,min:0.1,max:1000,step:0.1}],()=>{cell()});
  const draw=()=>{$('#b1v').innerHTML=drySVG({hi,dis});$('#b1d-v').textContent=fm(dis*100,0)+' %';
   $('#b1parts').innerHTML=DRY.map(p=>`<button class="btn" data-pk="${p.k}" aria-pressed="${p.k===hi}">${p.n}</button>`).join('');
   const p=DRY.find(x=>x.k===hi);$('#b1info').innerHTML=p?`<div class="callout"><b>${p.n}:</b> ${p.d}</div>`:'<div class="callout">اضغط على جزء في الرسم أو على اسمه.</div>';
   $('#b1seen').textContent=`تعرفت على ${seen.size} من ${DRY.length} أجزاء.`};
  const tdraw=()=>{const t=TYPES[type];$('#b1type').innerHTML=`<div class="cx-card"><h4>${t.n} <span class="ref">${t.ref}</span></h4><p><b>القطب السالب:</b> ${t.neg}</p><p><b>القطب الموجب:</b> ${t.pos}</p><p><b>الإلكتروليت:</b> ${t.el}</p><p>${t.x}</p><p><b>تستعمل في:</b> ${t.use}</p></div>`+
   (type==='alk'?`<div class="cx-card"><h4>العمر الافتراضي مقارنة بخلية الكربون-الخارصين</h4><svg viewBox="0 0 400 70" role="img" aria-label="مقارنة العمر"><rect x="10" y="10" width="40" height="18" fill="var(--muted)"/><rect x="10" y="40" width="200" height="18" fill="var(--blue)"/><rect x="210" y="40" width="120" height="18" fill="var(--blue)" opacity=".35"/>${S.t(56,24,'×1','m','start')}${S.t(336,54,'×5 … ×8','b','start')}</svg><p class="sub">الكتاب: «أطول بما يتراوح بين 5 و 8 مرات» (ص 30).</p></div>`:'')};
  const cell=()=>{const E=1.5,R=load==='lamp'?TP.v.RL:0,I=E/(R+r),V=I*R;$('#b1r-v').textContent=fm(r,2)+' Ω';
   $('#b1c').innerHTML=`<svg viewBox="0 0 420 170" role="img" aria-label="خلية وحمل">${wire('M60 40H360V130H260')}${wire('M160 130H60V92')}${wire('M60 78V40')}<path d="M45 78H75" stroke="var(--fg)" stroke-width="2.2"/><path d="M52 92H68" stroke="var(--fg)" stroke-width="5"/>${S.t(40,74,'+','','end')}${S.t(40,100,'−','','end')}${wire('M160 130H260')}`+
    (load==='lamp'?`<circle cx="210" cy="40" r="14" fill="${I>0.05?'#ffd34d':'var(--lamp-off)'}" stroke="var(--fg)" stroke-width="1.6"/>`:`<path d="M196 40H224" stroke="var(--stop)" stroke-width="4"/>`)+S.t(84,90,'E = 1.5 V','','start')+S.t(84,108,'r = '+fm(r,2)+' Ω','m','start')+S.t(210,158,load==='lamp'?'R = '+fm(TP.v.RL)+' Ω':'R ≈ 0','m')+arrow(320,40,350,40,'--live',2)+S.t(330,30,'I','b')+`</svg>`;
   $('#b1E').textContent='1.5 V';$('#b1I').textContent=fm(I,3)+' A';$('#b1V').textContent=fm(V,3)+' V';$('#b1P').textContent=fm(I*I*r,3)+' W';
   $('#b1msg').innerHTML=load==='wire'?`<div class="callout err"><b>خطر:</b> السلك وحده (مقاومته نعتبرها صفراً) يجعل التيار \\(E/r=${fm(I,2)}\\ A\\) وكل القدرة تضيع حرارة داخل الخلية. «من شأن ذلك إحداث انفجار أو حريق أو على أقل تقدير تفريغ البطارية من شحنتها بالشكل شبه فوري» (ص 27).</div>`:`<div class="callout">مع الحمل يمر تيار معتدل، ويضيع جزء صغير فقط داخل الخلية.</div>`;B.math($('#b1msg'))};
  const sdraw=()=>{$('#b1sort').innerHTML=`<div class="cx-sort">${SORT.map(([n,a],i)=>`<span class="cx-card" style="display:inline-flex;gap:6px;align-items:center;margin:0">${n} <button class="btn ${sorted[i]?sorted[i]===a?'ok':'no':''}" data-so="${i}" data-sv="p">أولية</button><button class="btn ${sorted[i]?sorted[i]===a?'ok':'no':''}" data-so="${i}" data-sv="s">ثانوية</button>${sorted[i]?(sorted[i]===a?' ✓':' ✗'):''}</span>`).join('')}</div><p class="sub">صحيح: ${SORT.filter(([n,a],i)=>sorted[i]===a).length} من ${SORT.length}. (الأخضر = إجابتك صحيحة، الأحمر = خطأ.)</p>`;
   el.querySelectorAll('[data-so]').forEach(b=>b.onclick=()=>{sorted[b.dataset.so]=b.dataset.sv;sdraw()})};
  el.addEventListener('click',e=>{const b=e.target.closest('[data-pk]'),g=e.target.closest('[data-part]');const k=b?b.dataset.pk:g?g.dataset.part:null;if(k){hi=k;seen.add(k);draw()}});
  $('#b1d').oninput=e=>{dis=+e.target.value/100;draw()};$('#b1r').oninput=e=>{r=+e.target.value;cell()};
  segBind(el,'bt',v=>{type=v;tseen.add(v);tdraw()});segBind(el,'bl',v=>{load=v;if(v==='wire')did.wire=1;cell()});
  const steps=stepsUI($('#b1st'),[
   {t:'أجزاء البطارية الجافة',x:'اضغط على ستة أجزاء على الأقل في الشكل (2-1)، منها <b>حاوية زنك</b> و<b>عمود كربون</b>: أيهما القطب السالب؟ وما وظيفة الآخر؟',done:()=>seen.size>=6&&seen.has('zn')&&seen.has('rod')},
   {t:'الاستهلاك',x:'حرّك «مقدار ما استُهلك» إلى 100%: مصدر الطاقة هو تحويل الزنك إلى أكسيد الزنك، لذلك ترق علبة الزنك. والخلية الأولية تُرمى بعدها.',done:()=>dis>=0.99},
   {t:'الأنواع الثلاثة',x:'افتح «قاعدية» ثم «زئبق»: ما الإلكتروليت المشترك بينهما؟ (هيدروكسيد البوتاسيوم).',done:()=>tseen.has('alk')&&tseen.has('hg')},
   {t:'سلك بلا حمل',x:'اختر «سلك فقط»: يقفز التيار إلى <span class="ltr">E/r</span> (أكثر من 3 أمبير) — هذا ما يحذر منه الكتاب في ص 27.',done:()=>load==='wire'&&did.wire},
   {t:'صنّف',x:'صنّف الخلايا السبع: أولية أم ثانوية؟',done:()=>SORT.every(([n,a],i)=>sorted[i]===a)}
  ]);
  draw();tdraw();cell();sdraw();loopOn(el,()=>steps.check());
 },
 quiz:[
  {q:'البطارية الأولية هي التي:',o:['يعاد شحنها بعد نفادها','ينتهي مفعولها ويجب التخلص منها بعد استهلاك إحدى موادها','جهدها 12 فولت','إلكتروليتها سائل دائماً'],c:1,e:'ص 27.'},
  {q:'بطارية السيارة 12 فولت تتكون من:',o:['8 خلايا كل منها 1.5 V','ست خلايا كل منها 2 V على التوالي','خليتين كل منهما 6 V','ست خلايا على التوازي'],c:1,e:'ص 28.'},
  {q:'في خلية لكلانشيه (المنجنية) القطب السالب مصنوع من:',o:['ثاني أكسيد المنجنيز','الكربون','الزنك','الرصاص'],c:2,e:'ص 28.'},
  {q:'جهد خلية لكلانشيه ومقاومتها الداخلية:',o:['2 V و 0.01 Ω','1.5 V وبين 0.2 و 0.5 Ω','12 V و 5 Ω','1.2 V و 2 Ω'],c:1,e:'ص 28.'},
  {q:'وظيفة عمود الكربون في خلية الكربون-الخارصين:',o:['القطب السالب','مجمع تيار للقطب الموجب','عازل بين القطبين','الإلكتروليت'],c:1,e:'ص 30.'},
  {q:'الإلكتروليت في الخلية القاعدية:',o:['حامض الكبريتيك','كلوريد الأمونيوم','هيدروكسيد البوتاسيوم','الماء المقطر'],c:2,e:'ص 30.'},
  {q:'لماذا يمنع الكتاب وصل قطبي البطارية بسلك دون حمل؟',o:['لأن السلك يعزل القطبين','لأنه قد يحدث انفجاراً أو حريقاً أو تفريغاً شبه فوري','لأن الجهد يرتفع','لأن البطارية تشحن'],c:1,e:'ص 27.'},
  {q:'في خلية الزئبق خلال الاستهلاك:',o:['يتحول أكسيد الزئبقيك إلى زئبق والخارصين إلى أكسيد الخارصين','يتحول الزئبق إلى خارصين','يتحلل هيدروكسيد البوتاسيوم','لا يتغير شيء'],c:0,e:'ص 31.'}
 ]
});

/* ======================================================================
   Lesson 6 — البطاريات الثانوية وسعة البطارية (ص 31–33)
   ====================================================================== */
function leadCellSVG(o){const lv=o.level,soc=o.soc,sulf=o.sulf;const T=40,Bt=220,top=Bt-(Bt-T-20)*lv,ptop=Bt-(Bt-T-20)*0.8;let s=`<svg viewBox="0 0 520 250" role="img" aria-label="خلية رصاص-حمض">`;
  s+=`<rect x="40" y="${T}" width="260" height="${Bt-T}" rx="6" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.8"/>`;
  s+=`<rect x="42" y="${fx(top)}" width="256" height="${fx(Bt-top-2)}" fill="var(--blue)" opacity="${(0.15+0.35*soc).toFixed(2)}"/>`;
  for(let i=0;i<7;i++){const x=62+i*32,neg=i%2===0;s+=`<rect x="${x}" y="${fx(ptop)}" width="12" height="${fx(Bt-ptop-12)}" fill="${neg?'var(--stop)':'var(--live)'}" opacity=".8"/>`;
    const nd=Math.round(sulf*10);for(let k=0;k<nd;k++)s+=`<circle cx="${x+3+(k%2)*6}" cy="${fx(ptop+10+k*((Bt-ptop-30)/10))}" r="2.6" fill="var(--surface)" stroke="var(--muted)" stroke-width=".6"/>`}
  if(lv<0.8)s+=`<rect x="42" y="${fx(ptop)}" width="256" height="${fx(top-ptop)}" fill="var(--stop-soft)" opacity=".7"/>`+arT(170,fx(ptop-6),'الألواح مكشوفة للهواء!',{fs:12,col:'--stop'});
  s+=`<rect x="70" y="${T-14}" width="20" height="14" fill="var(--blue)"/><rect x="250" y="${T-14}" width="20" height="14" fill="var(--blue)"/>`+S.t(80,T-18,'−','')+S.t(260,T-18,'+','');
  // hydrometer
  const hx=400,ht=50,hb=220,d=o.dens,fy=hb-(d-1.15)/(0.08)*(hb-ht-40)-20;
  s+=`<rect x="${hx-22}" y="${ht}" width="44" height="${hb-ht}" rx="20" fill="var(--surface-2)" stroke="var(--fg)"/><rect x="${hx-20}" y="${ht+40}" width="40" height="${hb-ht-42}" fill="var(--blue)" opacity=".3"/>`;
  s+=`<rect x="${hx-5}" y="${fx(fy-60)}" width="10" height="60" rx="4" fill="var(--surface)" stroke="var(--fg)"/><circle cx="${hx}" cy="${fx(fy+6)}" r="9" fill="var(--muted)"/>`;
  s+=S.t(hx+30,fx(fy-30),fm(d,3),'b','start')+arT(hx,hb+22,'الهيدرومتر',{fs:12,col:'--muted'});
  return s+'</svg>'}
B.lesson({
 id:'u2-l2',unit:2,order:2,pages:'31–33',
 title:'البطاريات الثانوية (الحامضية والقلوية) وسعة البطارية',
 summary:'البطارية الثانوية يمكن عكس تفاعلاتها فيعاد شحنها. بطارية الرصاص-الحمض: أقطابها وإلكتروليتها، جهد الخلية 2.2 ← 1.8 V والكثافة 1.21 ← 1.18، والكبرتة والمحافظة على البطارية. والخلايا القلوية (نيكل-كادميوم، نيكل-حديد) وجودتها، وسعة البطارية بالأمبير ساعة.',
 stations:[
  {intro:true},

  {st:1,short:'البطاريات الثانوية',title:'البطاريات الثانوية',ref:'ص 31',
   q:'ما الذي يسمح لبطارية السيارة أن تُشحن من جديد، بينما ترمي بطارية الكشاف؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="البطارية الثانوية: تفريغ ثم شحن يعكس التفاعل" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E2ECF3"/><rect x="220" y="120" width="100" height="70" rx="12" fill="#4FB3A9" stroke="#2C4A40" stroke-width="3"/><text x="270" y="152" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">مشحونة</text><text x="270" y="172" text-anchor="middle" font-size="11.5" fill="#2C4A40" direction="rtl">مواد فعالة</text><rect x="40" y="120" width="100" height="70" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><text x="90" y="152" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">مفرغة</text><text x="90" y="172" text-anchor="middle" font-size="11.5" fill="#2C4A40" direction="rtl">مواد متحولة</text><g data-tip="التفريغ: التفاعل الكيميائي يسير في اتجاه، فتعطي البطارية طاقة كهربائية."><path d="M250 116 C220 60 140 60 110 112" fill="none" stroke="#E8735A" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><polygon points="110.0,116.0 108.6,104.7 118.8,108.8" fill="#E8735A"/><text x="180" y="58" text-anchor="middle" font-size="14" fill="#E8735A" font-weight="700" direction="rtl">تفريغ</text></g><g data-tip="الشحن: نعكس التفاعل إلى الاتجاه المضاد فتعود المواد إلى حالتها الأولى."><path d="M110 194 C140 250 220 250 250 198" fill="none" stroke="#12855A" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><polygon points="250.0,194.0 251.4,205.3 241.2,201.2" fill="#12855A"/><text x="180" y="268" text-anchor="middle" font-size="14" fill="#12855A" font-weight="700" direction="rtl">شحن</text></g><text x="180" y="300" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">التفاعل يمكن عكسه</text></svg>`,
   cap:'دورة البطارية الثانوية: التفريغ يعطي طاقة، والشحن يعكس التفاعل.<br><b>مرّر المؤشر على السهمين (أو المسهما في الجوال) لتعرف معناهما.</b>',
   side:[
    {predict:{q:'ما الميزة التي تجعل البطارية الثانوية قابلة لإعادة الشحن؟',opts:[
     ['أن إلكتروليتها سائل',false,'أغلبها سائل فعلاً، لكن هذا ليس سبب إمكان الشحن.'],
     ['أن جهدها عالٍ',false,'الجهد لا علاقة له بإمكان إعادة الشحن.'],
     ['أن تفاعلاتها الكيميائية يمكن عكسها إلى الاتجاه المضاد',true,'نص الكتاب: «صممت البطارية الثانوية بطريقة يمكن بها عكس التفاعلات الكيميائية إلى الاتجاه المضاد».']]}}
   ],
   body:[
    {book:String.raw`<p>صممت البطارية الثانوية بطريقة يمكن بها <b>عكس التفاعلات الكيميائية إلى الاتجاه المضاد</b>. وتُمكّن هذه الميزة من إعادة شحن البطارية بكفاءة بعد نفاد الطاقة الكهربائية التي يمكن توليدها. وأكثر أنواع البطاريات الثانوية شيوعاً هي:</p>
     <ol><li>بطاريات التخزين رصاص ـ حمض (البطاريات الحامضية) الشكل (2-2).</li><li>بطاريات التخزين نيكل ـ كادميوم (البطاريات القلوية).</li></ol>`,ref:'ص 31'},
    {tip:String.raw`<p>عند <b>التفريغ</b> تتحول المواد الفعالة إلى مواد أخرى وتخرج طاقة كهربائية. وعند <b>الشحن</b> ندخل طاقة كهربائية من شاحن فتعود المواد إلى حالتها الأولى. في البطارية الأولية لا يمكن هذا الرجوع.</p>`},
    {title:'تحقق سريع: البطاريات الثانوية',widget:(el,B)=>DCML.tf(el,B,{items:[
 ['البطارية الثانوية يمكن إعادة شحنها لأن تفاعلاتها الكيميائية يمكن عكسها إلى الاتجاه المضاد.',true,'هذا نص الكتاب (ص 31).'],
 ['بطاريات النيكل ـ كادميوم من البطاريات الحامضية.',false,'هي البطاريات القلوية؛ الحامضية هي الرصاص ـ حمض.'],
 ['أكثر البطاريات الثانوية شيوعاً نوعان: الرصاص ـ حمض، والنيكل ـ كادميوم.',true,'هذان النوعان اللذان ذكرهما الكتاب.']]})}
   ]},

  {st:2,short:'الخلايا الحامضية',title:'(أ) الخلايا الحامضية (رصاص ـ حمض)',ref:'ص 31–32',
   q:'كيف تعرف أن بطارية السيارة تحتاج شحناً قبل أن تتلف؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="أجزاء بطارية تخزين الحمض والرصاص: ست خلايا وصفائح موجبة وسالبة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="الصندوق: يحتوي ست خلايا تفصلها جدران."><rect x="40" y="96" width="280" height="170" rx="8" fill="#9AA8A2" stroke="#2C4A40" stroke-width="3"/></g><g data-tip="الإلكتروليت: محلول حامض الكبريتيك ⟦H₂SO₄⟧ يحيط بالصفائح في كل خلية."><rect x="50" y="108" width="40" height="148" rx="3" fill="#BFE3DF" stroke="#2C4A40" stroke-width="1.5"/><rect x="95" y="108" width="40" height="148" rx="3" fill="#BFE3DF" stroke="#2C4A40" stroke-width="1.5"/><rect x="140" y="108" width="40" height="148" rx="3" fill="#BFE3DF" stroke="#2C4A40" stroke-width="1.5"/><rect x="185" y="108" width="40" height="148" rx="3" fill="#BFE3DF" stroke="#2C4A40" stroke-width="1.5"/><rect x="230" y="108" width="40" height="148" rx="3" fill="#BFE3DF" stroke="#2C4A40" stroke-width="1.5"/><rect x="275" y="108" width="40" height="148" rx="3" fill="#BFE3DF" stroke="#2C4A40" stroke-width="1.5"/></g><g data-tip="صفائح رصاص (سالب): من الرصاص ⟦Pb⟧ (الوردية)."><rect x="54" y="122" width="5" height="122" rx="1" fill="#F3C6B8" stroke="#2C4A40" stroke-width="0"/><rect x="72" y="122" width="5" height="122" rx="1" fill="#F3C6B8" stroke="#2C4A40" stroke-width="0"/><rect x="99" y="122" width="5" height="122" rx="1" fill="#F3C6B8" stroke="#2C4A40" stroke-width="0"/><rect x="117" y="122" width="5" height="122" rx="1" fill="#F3C6B8" stroke="#2C4A40" stroke-width="0"/><rect x="144" y="122" width="5" height="122" rx="1" fill="#F3C6B8" stroke="#2C4A40" stroke-width="0"/><rect x="162" y="122" width="5" height="122" rx="1" fill="#F3C6B8" stroke="#2C4A40" stroke-width="0"/><rect x="189" y="122" width="5" height="122" rx="1" fill="#F3C6B8" stroke="#2C4A40" stroke-width="0"/><rect x="207" y="122" width="5" height="122" rx="1" fill="#F3C6B8" stroke="#2C4A40" stroke-width="0"/><rect x="234" y="122" width="5" height="122" rx="1" fill="#F3C6B8" stroke="#2C4A40" stroke-width="0"/><rect x="252" y="122" width="5" height="122" rx="1" fill="#F3C6B8" stroke="#2C4A40" stroke-width="0"/><rect x="279" y="122" width="5" height="122" rx="1" fill="#F3C6B8" stroke="#2C4A40" stroke-width="0"/><rect x="297" y="122" width="5" height="122" rx="1" fill="#F3C6B8" stroke="#2C4A40" stroke-width="0"/></g><g data-tip="صفائح رصاص (موجب): من أكسيد الرصاص ⟦PbO₂⟧ (البرتقالية)."><rect x="63" y="122" width="5" height="122" rx="1" fill="#E8735A" stroke="#2C4A40" stroke-width="0"/><rect x="81" y="122" width="5" height="122" rx="1" fill="#E8735A" stroke="#2C4A40" stroke-width="0"/><rect x="108" y="122" width="5" height="122" rx="1" fill="#E8735A" stroke="#2C4A40" stroke-width="0"/><rect x="126" y="122" width="5" height="122" rx="1" fill="#E8735A" stroke="#2C4A40" stroke-width="0"/><rect x="153" y="122" width="5" height="122" rx="1" fill="#E8735A" stroke="#2C4A40" stroke-width="0"/><rect x="171" y="122" width="5" height="122" rx="1" fill="#E8735A" stroke="#2C4A40" stroke-width="0"/><rect x="198" y="122" width="5" height="122" rx="1" fill="#E8735A" stroke="#2C4A40" stroke-width="0"/><rect x="216" y="122" width="5" height="122" rx="1" fill="#E8735A" stroke="#2C4A40" stroke-width="0"/><rect x="243" y="122" width="5" height="122" rx="1" fill="#E8735A" stroke="#2C4A40" stroke-width="0"/><rect x="261" y="122" width="5" height="122" rx="1" fill="#E8735A" stroke="#2C4A40" stroke-width="0"/><rect x="288" y="122" width="5" height="122" rx="1" fill="#E8735A" stroke="#2C4A40" stroke-width="0"/><rect x="306" y="122" width="5" height="122" rx="1" fill="#E8735A" stroke="#2C4A40" stroke-width="0"/></g><g data-tip="مقسّم: رقائق من البلاستيك أو المطاط تفصل الصفائح عن بعضها (الصفراء)."><rect x="59.5" y="126" width="2.5" height="114" rx="1" fill="#F2C14E" stroke="#2C4A40" stroke-width="0"/><rect x="68.5" y="126" width="2.5" height="114" rx="1" fill="#F2C14E" stroke="#2C4A40" stroke-width="0"/><rect x="77.5" y="126" width="2.5" height="114" rx="1" fill="#F2C14E" stroke="#2C4A40" stroke-width="0"/><rect x="104.5" y="126" width="2.5" height="114" rx="1" fill="#F2C14E" stroke="#2C4A40" stroke-width="0"/><rect x="113.5" y="126" width="2.5" height="114" rx="1" fill="#F2C14E" stroke="#2C4A40" stroke-width="0"/><rect x="122.5" y="126" width="2.5" height="114" rx="1" fill="#F2C14E" stroke="#2C4A40" stroke-width="0"/><rect x="149.5" y="126" width="2.5" height="114" rx="1" fill="#F2C14E" stroke="#2C4A40" stroke-width="0"/><rect x="158.5" y="126" width="2.5" height="114" rx="1" fill="#F2C14E" stroke="#2C4A40" stroke-width="0"/><rect x="167.5" y="126" width="2.5" height="114" rx="1" fill="#F2C14E" stroke="#2C4A40" stroke-width="0"/><rect x="194.5" y="126" width="2.5" height="114" rx="1" fill="#F2C14E" stroke="#2C4A40" stroke-width="0"/><rect x="203.5" y="126" width="2.5" height="114" rx="1" fill="#F2C14E" stroke="#2C4A40" stroke-width="0"/><rect x="212.5" y="126" width="2.5" height="114" rx="1" fill="#F2C14E" stroke="#2C4A40" stroke-width="0"/><rect x="239.5" y="126" width="2.5" height="114" rx="1" fill="#F2C14E" stroke="#2C4A40" stroke-width="0"/><rect x="248.5" y="126" width="2.5" height="114" rx="1" fill="#F2C14E" stroke="#2C4A40" stroke-width="0"/><rect x="257.5" y="126" width="2.5" height="114" rx="1" fill="#F2C14E" stroke="#2C4A40" stroke-width="0"/><rect x="284.5" y="126" width="2.5" height="114" rx="1" fill="#F2C14E" stroke="#2C4A40" stroke-width="0"/><rect x="293.5" y="126" width="2.5" height="114" rx="1" fill="#F2C14E" stroke="#2C4A40" stroke-width="0"/><rect x="302.5" y="126" width="2.5" height="114" rx="1" fill="#F2C14E" stroke="#2C4A40" stroke-width="0"/></g><rect x="40" y="84" width="280" height="16" rx="5" fill="#7E8C86" stroke="#2C4A40" stroke-width="2.5"/><g data-tip="قطب الأطراف السالب."><rect x="60" y="62" width="26" height="24" rx="4" fill="#2C4A40" stroke="#2C4A40" stroke-width="2"/><text x="73" y="56" text-anchor="middle" font-size="18" fill="#2C4A40" font-weight="700" direction="ltr">−</text></g><g data-tip="قطب الأطراف الموجب."><rect x="274" y="62" width="26" height="24" rx="4" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><text x="287" y="56" text-anchor="middle" font-size="16" fill="#E8735A" font-weight="700" direction="ltr">+</text></g><g data-tip="غطاء ثقب التهوية: يسمح بإضافة الماء وتسريب الغازات."><rect x="118" y="76" width="18" height="10" rx="3" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.5"/><rect x="148" y="76" width="18" height="10" rx="3" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.5"/><rect x="178" y="76" width="18" height="10" rx="3" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.5"/><rect x="208" y="76" width="18" height="10" rx="3" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.5"/></g><text x="180" y="290" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700" direction="rtl">ست خلايا في صندوق واحد</text></svg>`,
   cap:'رسم مبسط للشكل <span class="ltr">(2-2)</span>: صندوق فيه ست خلايا، في كل خلية صفائح موجبة وسالبة.<br><b>مرّر المؤشر على الصفائح والأطراف والأغطية (أو المسها في الجوال) لتعرف اسم كل جزء.</b>',
   side:[
    {predict:{q:'جهد الخلية الحامضية المشحونة <span class="ltr">2.2 V</span>. عند أي جهد يجب أن تُشحن؟',opts:[
     [String.raw`<span class="ltr">2.0 V</span>`,false,'الكتاب لا يذكر هذه القيمة حداً للشحن.'],
     [String.raw`<span class="ltr">1.8 V</span>`,true,'نص الكتاب: «ويصل مع التفريغ إلى 1.8 فولت حيث يجب أن تشحن الخلية عندئذ، وإلا فإن التفاعل يصير غير تبادلي».'],
     [String.raw`<span class="ltr">0 V</span>`,false,'لا تُترك حتى تفرغ تماماً؛ هذا يتلفها (الكبرتة في المحطة التالية).']]}}
   ],
   body:[
    {book:String.raw`<p>تحتوي غالبية بطاريات التخزين رصاص ـ حامض على <b>ست خلايا</b> الشكل (2-2) وتحتوي كل خلية على مجموعتين من أقطاب الرصاص تسمى الصفائح. وتفصل الصفائح عن بعضها برقائق من البلاستيك أو المطاط. ويحيط محلول من حامض الكبريتيك والمسمى الإلكتروليت، بهذه الصفائح. يتصل كل قطب والمنتهي على سطح البطارية بمجموعة من هذه الصفائح. فتحات التهوية بجدار البطارية تسمح بإضافة الماء إلى الإلكتروليت، كما تسمح بتسريب الغازات الناتجة إلى الخارج. ويصنع قطبي البطارية من الرصاص <b>(Pb) للقطب السالب</b> وأكسيد الرصاص <b>\((\mathrm{PbO_2})\) للقطب الموجب</b>، والسائل الإلكتروليتي هو <b>حامض الكبريتيك \((\mathrm{H_2SO_4})\)</b>.</p>
     <p>عند التفريغ يتحول الرصاص إلى كبريتات الرصاص ويقل تركيز حامض الكبريتيك، بينما أثناء الشحن تتحول كبريتات الرصاص إلى أكسيد الرصاص والرصاص نفسه مع ارتفاع في تركيز حامض الكبريتيك، وهكذا تعود الخلية إلى حالتها الأولى.</p>
     <p>ويتأثر عمر الخلية بكمية كبريتات الرصاص المتراكمة على ألواح الرصاص والارتفاع الزائد لتركيز الحامض مما يدعو إلى الاهتمام بقياس درجة تركيز الحامض باستمرار بواسطة <b>هيدرومتر</b> (جهاز قياس الكثافة) وتكون الكثافة في حالة الشحن <b>1.21</b> ويجب ألا تقل عن <b>1.18</b> عند التفريغ ويبلغ جهد الخلية المشحونة <b>2.2 فولت</b> ويصل مع التفريغ إلى <b>1.8 فولت</b> حيث يجب أن تشحن الخلية عندئذ، وإلا فإن التفاعل يصير غير تبادلي، هذا ويرتفع الجهد عند الشحن حتى <b>2.6 فولت</b> الشكل (2-2).</p>`,ref:'ص 31–32'},
    {title:'حالات الخلية الحامضية (أرقام الكتاب)',widget:(el,B)=>{
      const D={c:['مشحونة','2.2 V','1.21','الخلية جاهزة.'],d:['نهاية التفريغ','1.8 V','لا تقل عن 1.18','يجب أن تُشحن الآن، وإلا صار التفاعل غير تبادلي.'],g:['أثناء الشحن','حتى 2.6 V','—','الجهد يرتفع أثناء الشحن، ويرتفع تركيز الحامض.']};let k='c';
      const draw=()=>{const d=D[k];el.innerHTML=`<div class="w-row" style="margin-top:0"><span class="mseg">${Object.keys(D).map(v=>`<button type="button" data-k="${v}" aria-pressed="${v===k}" style="font-family:var(--font)">${D[v][0]}</button>`).join('')}</span></div>
        <div class="w-facts" style="grid-template-columns:1fr 1fr"><div><span>جهد الخلية</span><b>${d[1]}</b></div><div><span>كثافة الحامض (الهيدرومتر)</span><b style="font-family:var(--font);font-size:15px">${d[2]}</b></div></div><p class="sub" style="margin:8px 0 0">${d[3]}</p>`;
        el.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{k=b.dataset.k;draw()})};draw();
    }},
    {watch:String.raw`<p>في آخر الفقرة يشير الكتاب إلى «الشكل (2-2)» بعد ذكر جهود الشحن، والشكل رسم لتركيب البطارية ولا يبين الجهود.</p>`,fix:true},
    {add:String.raw`<p>الهيدرومتر يشبه قطّارة كبيرة: تسحب به قليلاً من سائل الخلية، فتطفو فيه عوامة مدرّجة تقرأ عليها الكثافة. كلما كانت الخلية أكثر شحناً كان الحامض أكثف وطفت العوامة أعلى.</p>`}
   ]},

  {st:3,short:'الكبرتة',title:'كبرتة الأقطاب بالبطاريات الحامضية <span class="ltr">(Sulfation)</span>',ref:'ص 32',
   q:'تركت سيارتك أشهراً دون تشغيل، ثم لم تعد بطاريتها تحتفظ بالشحن. ماذا حدث داخلها؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="كبرتة الأقطاب: لوح سليم ولوح تراكمت عليه بلورات كبريتات الرصاص" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><text x="270" y="56" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700" direction="rtl">لوح سليم</text><text x="90" y="56" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700" direction="rtl">لوح مكبرت</text><g data-tip="لوح رصاص سليم: سطحه نظيف ويتفاعل مع الإلكتروليت بسهولة."><rect x="235" y="70" width="70" height="150" rx="4" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5"/></g><g data-tip="بلورات كبريتات الرصاص ⟦PbSO₄⟧ لم تُختزل أثناء الشحن وتغطي اللوح."><rect x="55" y="70" width="70" height="150" rx="4" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5"/><rect x="60" y="78" width="14" height="9" rx="2" fill="#F4F4F0" stroke="#2C4A40" stroke-width="1"/><rect x="83" y="115" width="14" height="9" rx="2" fill="#F4F4F0" stroke="#2C4A40" stroke-width="1"/><rect x="106" y="152" width="14" height="9" rx="2" fill="#F4F4F0" stroke="#2C4A40" stroke-width="1"/><rect x="74" y="189" width="14" height="9" rx="2" fill="#F4F4F0" stroke="#2C4A40" stroke-width="1"/><rect x="97" y="96" width="14" height="9" rx="2" fill="#F4F4F0" stroke="#2C4A40" stroke-width="1"/><rect x="65" y="133" width="14" height="9" rx="2" fill="#F4F4F0" stroke="#2C4A40" stroke-width="1"/><rect x="88" y="170" width="14" height="9" rx="2" fill="#F4F4F0" stroke="#2C4A40" stroke-width="1"/><rect x="111" y="207" width="14" height="9" rx="2" fill="#F4F4F0" stroke="#2C4A40" stroke-width="1"/><rect x="79" y="114" width="14" height="9" rx="2" fill="#F4F4F0" stroke="#2C4A40" stroke-width="1"/><rect x="102" y="151" width="14" height="9" rx="2" fill="#F4F4F0" stroke="#2C4A40" stroke-width="1"/><rect x="70" y="188" width="14" height="9" rx="2" fill="#F4F4F0" stroke="#2C4A40" stroke-width="1"/><rect x="93" y="95" width="14" height="9" rx="2" fill="#F4F4F0" stroke="#2C4A40" stroke-width="1"/><rect x="61" y="132" width="14" height="9" rx="2" fill="#F4F4F0" stroke="#2C4A40" stroke-width="1"/><rect x="84" y="169" width="14" height="9" rx="2" fill="#F4F4F0" stroke="#2C4A40" stroke-width="1"/></g><g data-tip="السبب: ترك البطارية مفرغة مدة طويلة، أو الشحن الزائد أحياناً."><line x1="222" y1="140" x2="148" y2="140" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><polygon points="140.0,140.0 150.0,134.5 150.0,145.5" fill="#2C4A40"/><text x="180" y="128" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="rtl">مفرغة</text><text x="180" y="166" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="rtl">مدة طويلة</text></g><g data-tip="النتيجة: ارتفاع المقاومة الداخلية للخلية ونقص جودتها."><rect x="40" y="236" width="280" height="50" rx="12" fill="#F3C6B8" stroke="#2C4A40" stroke-width="2"/><text x="180" y="257" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">المقاومة الداخلية ترتفع</text><text x="180" y="277" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">وجودة الخلية تنقص</text></g></svg>`,
   cap:'لوح سليم ولوح تراكمت عليه بلورات كبريتات الرصاص.<br><b>مرّر المؤشر على اللوحين والسهم والنتيجة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'عند نقص السائل في البطارية الحامضية، ماذا نضيف؟',opts:[
     ['حامض كبريتيك مركّز',false,'الكتاب ينص على الماء المقطر فقط.'],
     ['ماء الصنبور',false,'الكتاب يشترط الماء المقطر.'],
     ['الماء المقطر فقط',true,'نص الكتاب: «مع إضافة الماء المقطر (فقط) عند اللزوم عند نقص السائل».']]}}
   ],
   body:[
    {book:String.raw`<p>عند ترك البطارية مفرغة لمدة طويلة فإنها لا تشحن بانتظام وإن كبريتات الرصاص \((\mathrm{PbSO_4})\) المكونة على الألواح أثناء التفريغ لا تختزل بالكامل إلى أكسيد الرصاص أو الرصاص وينتج عن ذلك <b>ارتفاع في المقاومة الداخلية للخلية ونقص في جودتها</b>. وتنتج نفس الظاهرة أحياناً من الشحن الزائد أيضاً. ويمكن إزالة هذه الكبرتة <b>بالشحن المتوالي للبطارية عدة مرات بدون تفريغ</b> حتى تزول الكبرتة.</p>
     <p>وللمحافظة على البطارية في حالة جيدة يجب مراعاة الآتي:</p>
     <ol><li>عدم ترك البطارية بدون شحن خاصة عندما يبلغ جهدها أقل قيمة للجهد.</li><li>عدم ترك البطارية فارغة لمدة طويلة.</li><li>يجب بقاء مستوى السائل الإلكتروليتي مغطياً الألواح تماماً وعدم تعريض الألواح للهواء مع إضافة الماء المقطر (فقط) عند اللزوم عند نقص السائل.</li></ol>`,ref:'ص 32'},
    {tip:String.raw`<p>السبب ← الكبرتة ← النتيجة:</p><ul><li><b>السبب:</b> ترك البطارية مفرغة مدة طويلة، أو الشحن الزائد أحياناً.</li><li><b>ما يحدث:</b> كبريتات الرصاص على الألواح لا تعود كلها إلى رصاص وأكسيد رصاص.</li><li><b>النتيجة:</b> المقاومة الداخلية ترتفع والجودة تنقص.</li><li><b>العلاج:</b> الشحن المتوالي عدة مرات بدون تفريغ.</li></ul>`,title:'الكبرتة في أربع كلمات'},
    {add:String.raw`<p>كثير من بطاريات السيارات اليوم «مغلقة لا تحتاج صيانة»، فلا يضاف إليها ماء؛ أما البطاريات ذات الأغطية فيُفحص مستوى سائلها دورياً.</p>`},
    {title:'مختبر مصغّر: ماذا تفعل؟',widget:(el,B)=>DCML.cases(el,B,{intro:'ثلاثة مواقف مع بطارية حامضية. اختر ما يقوله الكتاب.',cases:[
 {q:'انخفض مستوى السائل حتى كادت الألواح تظهر للهواء.',opts:[['أضيف حامض كبريتيك',false,'الكتاب لا يذكر إضافة الحامض.'],['أضيف الماء المقطر فقط',true,'«مع إضافة الماء المقطر (فقط) عند اللزوم عند نقص السائل»، ويجب أن يغطي السائل الألواح تماماً.'],['أتركها كما هي حتى الشحن القادم',false,'يجب ألا تتعرض الألواح للهواء.']]},
 {q:'بطارية تُركت مفرغة مدة طويلة فأصابتها الكبرتة.',opts:[['الشحن المتوالي عدة مرات بدون تفريغ',true,'«ويمكن إزالة هذه الكبرتة بالشحن المتوالي للبطارية عدة مرات بدون تفريغ».'],['تفريغها تماماً ثم شحنها مرة واحدة',false,'التفريغ يزيد كبريتات الرصاص على الألواح.'],['لا علاج لها',false,'الكتاب يذكر علاجاً للكبرتة.']]},
 {q:'ما الذي يحدث لمقاومة الخلية الداخلية مع الكبرتة؟',opts:[['تنقص',false,'كبريتات الرصاص المتبقية على الألواح تعيق التفاعل.'],['لا تتغير',false,'الكتاب يذكر تغيراً فيها.'],['ترتفع، وتنقص جودة الخلية',true,'«وينتج عن ذلك ارتفاع في المقاومة الداخلية للخلية ونقص في جودتها».']]}]})}
   ]},

  {st:4,short:'الخلايا القلوية',title:'(ب) الخلايا القلوية',ref:'ص 32',
   q:'«قلوية» وصف للإلكتروليت. فما النوعان الشائعان منها؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="نوعا الخلايا القلوية: نيكل-كادميوم ونيكل-حديد" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><rect x="190" y="52" width="140" height="170" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="260" y="80" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">نيكل - كادميوم</text><rect x="200" y="96" width="120" height="46" rx="8" fill="#E8735A" stroke="#2C4A40" stroke-width="1.8"/><text x="260" y="115" text-anchor="middle" font-size="11" fill="#FBF6EE" font-weight="600" direction="rtl">القطب الموجب</text><text x="260" y="133" text-anchor="middle" font-size="12" fill="#FBF6EE" font-weight="700" direction="rtl">إيدروكسيد النيكل</text><g data-tip="القطب السالب في خلية النيكل - كادميوم: الكادميوم الإسفنجي."><rect x="200" y="152" width="120" height="46" rx="8" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.8"/><text x="260" y="171" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="600" direction="rtl">القطب السالب</text><text x="260" y="189" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="rtl">الكادميوم الإسفنجي</text></g><rect x="30" y="52" width="140" height="170" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="100" y="80" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">نيكل - حديد</text><rect x="40" y="96" width="120" height="46" rx="8" fill="#E8735A" stroke="#2C4A40" stroke-width="1.8"/><text x="100" y="115" text-anchor="middle" font-size="11" fill="#FBF6EE" font-weight="600" direction="rtl">القطب الموجب</text><text x="100" y="133" text-anchor="middle" font-size="12" fill="#FBF6EE" font-weight="700" direction="rtl">إيدروكسيد النيكل</text><g data-tip="القطب السالب في خلية النيكل - حديد: الحديد (ومنه اسمها). الكتاب طبع هنا «الكادميوم الإسفنجي»؛ انظر المحطة 6."><rect x="40" y="152" width="120" height="46" rx="8" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.8"/><text x="100" y="171" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="600" direction="rtl">القطب السالب</text><text x="100" y="189" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="rtl">الحديد</text></g><g data-tip="الإلكتروليت في النوعين محلول البوتاس (إيدروكسيد البوتاسيوم)، وتركيزه لا يتغير أثناء التفاعل."><rect x="50" y="238" width="260" height="40" rx="12" fill="#E9B949" stroke="#2C4A40" stroke-width="2.5"/><text x="180" y="263" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700" direction="rtl">الإلكتروليت: محلول البوتاس</text></g></svg>`,
   cap:'نوعا الخلايا القلوية ومادة كل قطب فيهما.<br><b>مرّر المؤشر على القطبين السالبين والإلكتروليت (أو المسها في الجوال) لتعرف التفصيل.</b>',
   side:[
    {predict:{q:'ما النوعان الشائعا الاستعمال من الخلايا القلوية؟',opts:[
     ['الرصاص ـ حمض والنيكل ـ كادميوم',false,'الرصاص ـ حمض من البطاريات الحامضية لا القلوية.'],
     ['النيكل ـ كادميوم والنيكل ـ حديد',true,'نص الكتاب: «يوجد نوعان شائعا الاستعمال من هذه الخلايا وهي خلية النيكل ـ كادميوم وخلايا النيكل ـ حديد».'],
     ['الكربون ـ الخارصين والزئبق',false,'هذه من البطاريات الأولية الجافة.']]}}
   ],
   body:[
    {book:String.raw`<p>يوجد نوعان شائعا الاستعمال من هذه الخلايا وهي خلية النيكل ـ كادميوم وخلايا النيكل ـ حديد.</p>`,ref:'ص 32'},
    {tip:String.raw`<p>الاسم يدل على مادتي القطبين: <b>النيكل</b> (إيدروكسيد النيكل) للقطب الموجب في النوعين، ثم <b>الكادميوم</b> أو <b>الحديد</b> للقطب السالب. والإلكتروليت في النوعين قلوي: محلول البوتاس.</p>`},
    {title:'مختبر مصغّر: صنّف الخلية',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل خلية اختر صنفها.',cats:['ثانوية حامضية','ثانوية قلوية','أولية جافة'],items:[
 ['النيكل ـ حديد',1,'من النوعين الشائعين للخلايا القلوية.'],
 ['الرصاص ـ حمض',0,'البطاريات الحامضية (المحطة 2).'],
 ['الكربون ـ الخارصين',2,'من البطاريات الأولية الجافة (الدرس السابق).'],
 ['النيكل ـ كادميوم',1,'من النوعين الشائعين للخلايا القلوية.']]})}
   ]},

  {st:5,short:'نيكل ـ كادميوم',title:'خلايا النيكل ـ كادميوم <span class="ltr">(Nickel – Cadmium)</span>',ref:'ص 33',
   q:'لماذا تكون البطارية القلوية أصغر حجماً من الحامضية لنفس السعة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="كمية السائل في بطارية 100 أمبير ساعة: 6.8 لتر في الحامضية و1.2 لتر في القلوية" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E2ECF3"/><text x="180" y="48" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">بطارية 100 أمبير ساعة</text><g data-tip="البطارية الحامضية ⟦100 AH⟧ تحوي ⟦6.8⟧ لتراً من السائل."><rect x="200" y="70" width="100" height="190" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><rect x="204" y="93" width="92" height="163" rx="4" fill="#BFE3DF" stroke="#2C4A40" stroke-width="0"/></g><g data-tip="البطارية القلوية ⟦100 AH⟧ تحوي ⟦1.2⟧ لتراً فقط، لأن تركيز الإلكتروليت لا يتغير فيكفي قليل منه."><rect x="60" y="70" width="100" height="190" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><rect x="64" y="227" width="92" height="29" rx="4" fill="#BFE3DF" stroke="#2C4A40" stroke-width="0"/></g><text x="250" y="180" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700" direction="ltr">6.8 L</text><text x="110" y="218" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700" direction="ltr">1.2 L</text><text x="250" y="284" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700" direction="rtl">حامضية</text><text x="110" y="284" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700" direction="rtl">قلوية</text></svg>`,
   cap:'كمية السائل في بطاريتين سعة كل منهما <span class="ltr">100</span> أمبير ساعة (ص 33).<br><b>مرّر المؤشر على الوعاءين (أو المسهما في الجوال) لتعرف السبب.</b>',
   side:[
    {predict:{q:'لماذا يكفي البطارية القلوية قليل من السائل الإلكتروليتي؟',opts:[
     ['لأن تركيز إيدروكسيد البوتاسيوم لا يتغير أثناء التفاعل',true,'نص الكتاب: «ويلاحظ أن تركيز إيدروكسيد البوتاسيوم لا يتغير أثناء التفاعل ولذا فإنه يمكن استعمال كمية قليلة من السائل».'],
     ['لأن جهدها أقل',false,'الكتاب يربط قلة السائل بثبات التركيز، لا بالجهد.'],
     ['لأن أقطابها من الحديد المطلي',false,'مادة الأقطاب لا تفسر قلة السائل.']]}}
   ],
   body:[
    {book:String.raw`<p>القطب الموجب هنا مصنوع من إيدروكسيد النيكل، بينما القطب السالب من الكادميوم الإسفنجي. والسائل الإلكتروليتي عبارة عن محلول البوتاس بنسبة <b>20%</b>. وتصنع الأقطاب من ألواح من الحديد المطلية بالنيكل وبها ثقوب تحمل المادة الفعالة، والإناء الحاوي يصنع أيضاً من الحديد المطلي بالنيكل. ويلاحظ أن تركيز إيدروكسيد البوتاسيوم لا يتغير أثناء التفاعل ولذا فإنه يمكن استعمال كمية قليلة من السائل الإلكتروليتي مما يجعل البطارية أقل حجماً.</p>
     <p>فمثلاً البطارية الحامضية <b>100 أمبير ساعة تحوي 6.8 لتراً</b> من السائل بينما البطارية القلوية <b>100 أمبير ساعة تحوي 1.2 لتراً</b> من السائل.</p>`,ref:'ص 33'},
    {tip:String.raw`<p>في الحامضية يدخل حامض الكبريتيك في التفاعل فيقل تركيزه عند التفريغ (المحطة 2)، فنحتاج كمية كبيرة منه. أما في القلوية فالإلكتروليت يوصل التيار ولا يُستهلك، فيكفي قليل منه: <span class="ltr">6.8 L</span> مقابل <span class="ltr">1.2 L</span> لنفس السعة.</p>`},
    {title:'مختبر مصغّر: أجزاء خلية النيكل ـ كادميوم',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل مادة اختر مكانها في الخلية.',cats:['القطب الموجب','القطب السالب','الإلكتروليت','الألواح والإناء'],items:[
 ['الكادميوم الإسفنجي',1,'«بينما القطب السالب من الكادميوم الإسفنجي».'],
 ['الحديد المطلي بالنيكل',3,'تصنع منه ألواح الأقطاب (وبها ثقوب تحمل المادة الفعالة) والإناء الحاوي.'],
 ['إيدروكسيد النيكل',0,'«القطب الموجب هنا مصنوع من إيدروكسيد النيكل».'],
 ['محلول البوتاس <span class="ltr">20%</span>',2,'وتركيزه لا يتغير أثناء التفاعل، فتكفي كمية قليلة منه.']]})}
   ]},

  {st:6,short:'نيكل ـ حديد وجودة القلوية',title:'خلايا النيكل ـ حديد، ومزايا البطاريات القلوية وجودتها',ref:'ص 33',
   q:'إذا أدخلت في البطارية 100 أمبير ساعة بالشحن، فكم تأخذ منها عند التفريغ؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="جودة البطاريات القلوية: الأمبير ساعة 66.6 بالمئة، والوات ساعة 50 للكادميوم و48 للحديد" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><text x="180" y="50" text-anchor="middle" font-size="14.5" fill="#2C4A40" font-weight="700" direction="rtl">جودة البطاريات القلوية</text><g data-tip="من كل ⟦100⟧ أمبير ساعة ندخلها بالشحن نأخذ ⟦66.6⟧ عند التفريغ."><text x="320" y="80" text-anchor="start" font-size="12.5" fill="#2C4A40" font-weight="700" direction="rtl">جودة الأمبير ساعة</text><rect x="60" y="88" width="260" height="22" rx="6" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.5"/><rect x="146.84" y="88" width="173.16" height="22" rx="6" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.5"/><text x="140.84" y="104" text-anchor="end" font-size="13" fill="#2C4A40" font-weight="700" direction="ltr">66.6%</text></g><g data-tip="جودة الوات ساعة لخلية النيكل - كادميوم ⟦50%⟧."><text x="320" y="150" text-anchor="start" font-size="12.5" fill="#2C4A40" font-weight="700" direction="rtl">جودة الوات ساعة — كادميوم</text><rect x="60" y="158" width="260" height="22" rx="6" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.5"/><rect x="190" y="158" width="130" height="22" rx="6" fill="#E8735A" stroke="#2C4A40" stroke-width="1.5"/><text x="184" y="174" text-anchor="end" font-size="13" fill="#2C4A40" font-weight="700" direction="ltr">50%</text></g><g data-tip="جودة الوات ساعة لخلية النيكل - حديد ⟦48%⟧."><text x="320" y="220" text-anchor="start" font-size="12.5" fill="#2C4A40" font-weight="700" direction="rtl">جودة الوات ساعة — حديد</text><rect x="60" y="228" width="260" height="22" rx="6" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.5"/><rect x="195.2" y="228" width="124.8" height="22" rx="6" fill="#E9B949" stroke="#2C4A40" stroke-width="1.5"/><text x="189.2" y="244" text-anchor="end" font-size="13" fill="#2C4A40" font-weight="700" direction="ltr">48%</text></g></svg>`,
   cap:'جودة البطاريات القلوية كما في الكتاب.<br><b>مرّر المؤشر على كل عمود (أو المسه في الجوال) لتعرف معناه.</b>',
   side:[
    {predict:{q:'جودة الأمبير ساعة للبطاريات القلوية <span class="ltr">66.6%</span>. ماذا تعني؟',opts:[
     ['أن البطارية تفقد <span class="ltr">66.6%</span> من شحنتها كل يوم',false,'الجودة نسبة ما نأخذه إلى ما ندخله، لا فقد يومي.'],
     ['أن جهدها <span class="ltr">66.6%</span> من جهد الحامضية',false,'الجودة لا تقارن الجهود.'],
     ['أننا نأخذ عند التفريغ <span class="ltr">66.6</span> أمبير ساعة مقابل كل <span class="ltr">100</span> ندخلها بالشحن',true,'جودة الأمبير ساعة = الأمبير ساعة الخارجة ÷ الأمبير ساعة الداخلة.']]}}
   ],
   body:[
    {book:String.raw`<p><b>خلايا النيكل ـ حديد:</b> ويتكون القطب الموجب من إيدروكسيد النيكل بينما القطب السالب من الكادميوم الإسفنجي، والسائل الإلكتروليتي هو محلول البوتاس. ويلاحظ هنا أيضاً عدم تغير تركيز السائل الإلكتروليتي مما يجعل وزن وحجم البطارية صغيراً.</p>`,ref:'ص 33'},
    {watch:String.raw`<p>طُبع في الكتاب أن القطب السالب في خلية <b>النيكل ـ حديد</b> «من الكادميوم الإسفنجي»، والصحيح أنه من <b>الحديد</b> (ولهذا سميت نيكل ـ حديد). الكادميوم الإسفنجي هو القطب السالب لخلية النيكل ـ كادميوم في المحطة السابقة.</p>`,fix:true},
    {book:String.raw`<p>ومن مزايا البطاريات القلوية ثبات المواد الفعالة على الألواح مما يجعلها <b>أكثر تحملاً للصدمات</b> وهي كذلك <b>أخف وزناً وأقل حجماً</b> لنفس السعة.</p>
     <p>وتقدر جودة البطاريات القلوية بالآتي:</p>
     <p>جودة الأمبير ساعة <b>66.6%</b> جودة الوات ساعة <b>50% للكادميوم، 48% للحديد</b>.</p>`,ref:'ص 33'},
    {tip:String.raw`<p><b>جودة الأمبير ساعة:</b> من كل <span class="ltr">100</span> أمبير ساعة ندخلها عند الشحن نأخذ <span class="ltr">66.6</span> عند التفريغ.</p><p><b>جودة الوات ساعة</b> (الطاقة) أقل منها: <span class="ltr">50%</span> للنيكل ـ كادميوم و<span class="ltr">48%</span> للنيكل ـ حديد، لأن جهد الشحن أعلى من جهد التفريغ، فالطاقة الداخلة أكبر.</p>`,title:'ماذا تعني الجودة؟'},
    {title:'مختبر مصغّر: كم تأخذ مما أدخلت؟',widget:(el,B)=>DCML.lab(el,B,{intro:'الجودة من الكتاب: الأمبير ساعة <span class="ltr">66.6%</span>، والوات ساعة <span class="ltr">50%</span> للكادميوم و<span class="ltr">48%</span> للحديد. اختر ما تدخله بالشحن (أرقام تختارها أنت).',
 predict:{q:'أدخلت في بطارية قلوية <span class="ltr">150</span> أمبير ساعة بالشحن. كم تأخذ منها عند التفريغ تقريباً؟',opts:[
  ['<span class="ltr">150</span> أمبير ساعة',false,'الجودة أقل من <span class="ltr">100%</span>، فنأخذ أقل مما أدخلنا.'],
  ['<span class="ltr">100</span> أمبير ساعة',true,'\\(150\\times0.666\\approx100\\).'],
  ['<span class="ltr">75</span> أمبير ساعة',false,'هذا بجودة <span class="ltr">50%</span>، وهي جودة الوات ساعة لا الأمبير ساعة.']]},
 ins:[{k:'q',l:'الأمبير ساعة الداخلة بالشحن',u:'AH',min:0,max:300,step:10,v:150},{k:'t',l:'نوع الخلية',seg:[['cd','نيكل ـ كادميوم'],['fe','نيكل ـ حديد']],v:'cd'},{k:'w',l:'الوات ساعة الداخلة بالشحن',u:'Wh',min:0,max:500,step:10,v:200}],
 calc:(s,P,B)=>{const ah=s.q*0.666,ew=s.t==='cd'?0.5:0.48;return {facts:[['الأمبير ساعة الخارجة',DCML.fm(B,B.round(ah,1))+' AH','hi'],['الوات ساعة الخارجة',DCML.fm(B,B.round(s.w*ew,1))+' Wh','hi']],
  bars:[{l:'أمبير ساعة: داخل',v:s.q,max:300,u:'AH',col:'--muted'},{l:'أمبير ساعة: خارج',v:B.round(ah,1),max:300,u:'AH'},{l:'وات ساعة: داخل',v:s.w,max:500,u:'Wh',col:'--muted'},{l:'وات ساعة: خارج',v:s.w*ew,max:500,u:'Wh',col:'--live'}],
  msg:'جودة الوات ساعة أقل من جودة الأمبير ساعة، لأن جهد الشحن أعلى من جهد التفريغ.'}}})}
   ]},

  {st:7,short:'السعة وتيار الشحن',title:'سعة البطارية وتيار الشحن',ref:'ص 33',
   q:'بطارية مكتوب عليها 300 أمبير ساعة: كم ساعة تدوم؟ هل يكفي هذا الرقم للإجابة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="سعة البطارية 300 أمبير ساعة: بتيار نصف أمبير تدوم 600 ساعة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="سعة البطارية ⟦300 AH⟧ (أمبير ساعة)."><rect x="40" y="92" width="110" height="90" rx="10" fill="#4FB3A9" stroke="#2C4A40" stroke-width="3"/><rect x="70" y="80" width="14" height="14" rx="3" fill="#2C4A40" stroke="#2C4A40" stroke-width="0"/><rect x="106" y="80" width="14" height="14" rx="3" fill="#E8735A" stroke="#2C4A40" stroke-width="0"/><text x="95" y="144" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700" direction="ltr">300 AH</text></g><g data-tip="تيار السحب ⟦0.5 A⟧ (نصف أمبير)."><line x1="160" y1="137" x2="198" y2="137" stroke="#E8735A" stroke-width="3" stroke-linecap="round"/><polygon points="206.0,137.0 196.0,142.5 196.0,131.5" fill="#E8735A"/><text x="183" y="124" text-anchor="middle" font-size="13" fill="#E8735A" font-weight="700" direction="ltr">0.5 A</text></g><g data-tip="زمن السحب ⟦600⟧ ساعة = ⟦300 ÷ 0.5⟧."><circle cx="262" cy="137" r="46" fill="#FBF6EE" stroke="#2C4A40" stroke-width="3"/><line x1="262" y1="137" x2="262" y2="107" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><line x1="262" y1="137" x2="284" y2="149" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><circle cx="262" cy="137" r="4" fill="#2C4A40"/></g><text x="262" y="206" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700" direction="ltr">600 h</text><rect x="60" y="236" width="240" height="40" rx="12" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><text x="180" y="262" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700" direction="ltr">AH = A × H</text></svg>`,
   cap:'مثال الكتاب: بطارية <span class="ltr">300 AH</span> بتيار سحب نصف أمبير تدوم <span class="ltr">600</span> ساعة.<br><b>مرّر المؤشر على البطارية والسهم والساعة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'إذا ضاعفنا التيار المسحوب من البطارية نفسها، فإن زمن الاستعمال:',opts:[
     ['يتضاعف',false,'العكس: «كلما زاد التيار المسحوب يقل زمن الاستعمال».'],
     ['يقل إلى النصف',true,'السعة ثابتة = التيار × الزمن، فضعف التيار يعني نصف الزمن.'],
     ['لا يتغير',false,'الزمن يعتمد على التيار المسحوب.']]}}
   ],
   body:[
    {book:String.raw`<div class="eq" style="position:relative;overflow-x:auto">$$\text{سعة البطارية (AH)}=\text{التيار المسحوب بالأمبير (A)}\times\text{زمن السحب في الساعة (H)}$$<span></span></div>
     <p>فإذا كانت سعة البطارية <span class="ltr">300</span> أمبير ساعة <span class="ltr">(300AH)</span>، معنى ذلك أنه إذا كان: تيار السحب = نصف أمبير، فإن زمن السحب <span class="ltr">600</span> ساعة. ومن ذلك نستنتج أنه <b>كلما زاد التيار المسحوب يقل زمن الاستعمال</b>، والعكس صحيح.</p>`,ref:'ص 33'},
    {title:'غيّر تيار السحب من بطارية 300 أمبير ساعة',widget:(el,B)=>{
      el.innerHTML=`<p class="sub" style="margin:0">السعة <span class="ltr">300 AH</span> من مثال الكتاب. حرّك تيار السحب وانظر الزمن (القيمة الأولى من الكتاب: نصف أمبير).</p>
       <label class="w-sl"><span>تيار السحب <b class="ltr" data-o="i"></b></span><input type="range" min="0.5" max="30" step="0.5" value="0.5" dir="ltr"></label>
       <div class="w-facts" style="grid-template-columns:1fr 1fr"><div><span>زمن السحب = 300 ÷ التيار</span><b data-o="t"></b></div><div><span>بالأيام تقريباً</span><b data-o="d"></b></div></div>`;
      const r=el.querySelector('input');const draw=()=>{const I=+r.value,T=300/I;el.querySelector('[data-o=i]').textContent=B.fmtN(I)+' A';el.querySelector('[data-o=t]').textContent=B.fmtN(B.round(T,1))+' h';el.querySelector('[data-o=d]').textContent=B.fmtN(B.round(T/24,1))};
      r.oninput=draw;draw();
    }},
    {tip:String.raw`<p>عنوان الفقرة يذكر «تيار الشحن» لكن الكتاب لا يشرحه. تيار الشحن هو التيار الذي ندخله إلى البطارية لإعادة شحنها، ويحدده عادة صانع البطارية. وزمن الشحن التقريبي = الأمبير ساعة المطلوب إدخالها ÷ تيار الشحن، مع مراعاة الجودة: نُدخل أكثر مما نأخذ (المحطة السابقة).</p>`,title:'وتيار الشحن؟'},
    {watch:String.raw`<p>العلاقة «السعة = التيار × الزمن» تقريب مفيد. في البطاريات الحقيقية تقل السعة الفعلية قليلاً عند السحب بتيارات كبيرة جداً.</p>`}
   ]},

  {recap:[
   String.raw`البطارية الثانوية يمكن عكس تفاعلاتها فيعاد شحنها؛ وأشهرها الرصاص ـ حمض (الحامضية) والنيكل ـ كادميوم (القلوية) (ص 31).`,
   String.raw`الحامضية: السالب رصاص Pb، والموجب أكسيد الرصاص \(\mathrm{PbO_2}\)، والإلكتروليت حامض الكبريتيك؛ الخلية المشحونة <span class="ltr">2.2 V</span> وكثافتها <span class="ltr">1.21</span>، وتُشحن عند <span class="ltr">1.8 V</span> — الشكل (2-2).`,
   String.raw`الكبرتة: ترك البطارية مفرغة طويلاً يرفع مقاومتها الداخلية؛ ونحافظ عليها بالشحن وعدم تركها فارغة وإضافة الماء المقطر فقط (ص 32).`,
   String.raw`القلوية: إلكتروليتها لا يتغير تركيزه فهي أصغر وأخف وأكثر تحملاً للصدمات؛ جودة الأمبير ساعة <span class="ltr">66.6%</span> والوات ساعة <span class="ltr">50%</span> و<span class="ltr">48%</span> (ص 33).`,
   String.raw`سعة البطارية (AH) = التيار (A) × الزمن (H): <span class="ltr">300 AH</span> بتيار <span class="ltr">0.5 A</span> تدوم <span class="ltr">600</span> ساعة (ص 33).`]}
],
 theory:[
  {h:'البطاريات الثانوية',ref:'ص 31',html:`<p>«صممت البطارية الثانوية بطريقة يمكن بها <b>عكس التفاعلات الكيميائية إلى الاتجاه المضاد</b>. وتُمكّن هذه الميزة من إعادة شحن البطارية بكفاءة بعد نفاد الطاقة الكهربائية التي يمكن توليدها. وأكثر أنواع البطاريات الثانوية شيوعاً هي:»</p><ol><li>بطاريات التخزين رصاص-حمض (البطاريات الحامضية) الشكل (2-2).</li><li>بطاريات التخزين نيكل-كادميوم (البطاريات القلوية).</li></ol>`},
  {fig:'(2-2)',ref:'ص 31',caption:'أجزاء بطارية تخزين الحمض والرصاص: صندوق مقطوع جزئياً يظهر خلية من الداخل بصفائح الرصاص السالبة والموجبة والمقسّمات بينها. (رسم مبسط لصورة الكتاب.)',draw:()=>box(leadSVG(),640)},
  {h:'(أ) الخلايا الحامضية',ref:'ص 31–32',html:`<p>«تحتوي غالبية بطاريات التخزين رصاص-حامض على <b>ست خلايا</b> … وتحتوي كل خلية على مجموعتين من أقطاب الرصاص تسمى الصفائح. وتفصل الصفائح عن بعضها برقائق من البلاستيك أو المطاط. ويحيط محلول من حامض الكبريتيك والمسمى الإلكتروليت، بهذه الصفائح. … فتحات التهوية بجدار البطارية تسمح بإضافة الماء إلى الإلكتروليت، كما تسمح بتسريب الغازات الناتجة إلى الخارج.»</p>
   <table class="tt"><tbody><tr><th>القطب السالب</th><td>الرصاص \\((Pb)\\)</td></tr><tr><th>القطب الموجب</th><td>أكسيد الرصاص \\((PbO_2)\\)</td></tr><tr><th>الإلكتروليت</th><td>حامض الكبريتيك \\((H_2SO_4)\\)</td></tr></tbody></table>
   <p>«عند <b>التفريغ</b> يتحول الرصاص إلى كبريتات الرصاص ويقل تركيز حامض الكبريتيك، بينما أثناء <b>الشحن</b> تتحول كبريتات الرصاص إلى أكسيد الرصاص والرصاص نفسه مع ارتفاع في تركيز حامض الكبريتيك، وهكذا تعود الخلية إلى حالتها الأولى.»</p>
   <p>«ويتأثر عمر الخلية بكمية كبريتات الرصاص المتراكمة على ألواح الرصاص والارتفاع الزائد لتركيز الحامض مما يدعو إلى الاهتمام بقياس درجة تركيز الحامض باستمرار بواسطة <b>هيدرومتر</b> (جهاز قياس الكثافة)»:</p>
   <table class="tt"><thead><tr><th>الحالة</th><th>كثافة الحامض</th><th>جهد الخلية</th></tr></thead><tbody><tr><td>مشحونة</td><td>1.21</td><td>2.2 V</td></tr><tr><td>نهاية التفريغ</td><td>يجب ألا تقل عن 1.18</td><td>1.8 V «حيث يجب أن تشحن الخلية عندئذ، وإلا فإن التفاعل يصير غير تبادلي»</td></tr><tr><td>أثناء الشحن</td><td>—</td><td>يرتفع حتى 2.6 V</td></tr></tbody></table>`},
  {h:'كبرتة الأقطاب بالبطاريات الحامضية (Sulfation)',ref:'ص 32',html:`<p>«عند ترك البطارية مفرغة لمدة طويلة فإنها لا تشحن بانتظام وإن كبريتات الرصاص \\((PbSO_4)\\) المكونة على الألواح أثناء التفريغ لا تختزل بالكامل إلى أكسيد الرصاص أو الرصاص وينتج عن ذلك <b>ارتفاع في المقاومة الداخلية للخلية ونقص في جودتها</b>. وتنتج نفس الظاهرة أحياناً من الشحن الزائد أيضاً. ويمكن إزالة هذه الكبرتة <b>بالشحن المتوالي للبطارية عدة مرات بدون تفريغ</b> حتى تزول الكبرتة.»</p>
   <p><b>وللمحافظة على البطارية في حالة جيدة يجب مراعاة الآتي:</b></p><ol><li>عدم ترك البطارية بدون شحن خاصة عندما يبلغ جهدها أقل قيمة للجهد.</li><li>عدم ترك البطارية فارغة لمدة طويلة.</li><li>يجب بقاء مستوى السائل الإلكتروليتي مغطياً الألواح تماماً وعدم تعريض الألواح للهواء مع إضافة <b>الماء المقطر (فقط)</b> عند اللزوم عند نقص السائل.</li></ol>`},
  {h:'(ب) الخلايا القلوية',ref:'ص 32–33',html:`<p>«يوجد نوعان شائعا الاستعمال من هذه الخلايا وهي خلية النيكل-كادميوم وخلايا النيكل-حديد.»</p>
   <table class="tt"><thead><tr><th></th><th>النيكل-كادميوم</th><th>النيكل-حديد</th></tr></thead><tbody>
   <tr><td>القطب الموجب</td><td>إيدروكسيد النيكل</td><td>إيدروكسيد النيكل</td></tr>
   <tr><td>القطب السالب</td><td>الكادميوم الإسفنجي</td><td>الحديد (انظر ملاحظة الكتاب)</td></tr>
   <tr><td>الإلكتروليت</td><td colspan="2">محلول البوتاس (إيدروكسيد البوتاسيوم) بنسبة 20% — تركيزه لا يتغير أثناء التفاعل</td></tr></tbody></table>
   <p>«وتصنع الأقطاب من ألواح من الحديد المطلية بالنيكل وبها ثقوب تحمل المادة الفعالة، والإناء الحاوي يصنع أيضاً من الحديد المطلي بالنيكل. ويلاحظ أن تركيز إيدروكسيد البوتاسيوم لا يتغير أثناء التفاعل ولذا فإنه يمكن استعمال كمية قليلة من السائل الإلكتروليتي مما يجعل البطارية أقل حجماً.» «فمثلاً البطارية الحامضية <b>100 أمبير ساعة تحوي 6.8 لتراً</b> من السائل بينما البطارية القلوية <b>100 أمبير ساعة تحوي 1.2 لتراً</b>.»</p>
   <p>«ومن مزايا البطاريات القلوية ثبات المواد الفعالة على الألواح مما يجعلها <b>أكثر تحملاً للصدمات</b> وهي كذلك <b>أخف وزناً وأقل حجماً</b> لنفس السعة.» «وتقدر جودة البطاريات القلوية بالآتي: جودة الأمبير ساعة <b>66.6%</b>، جودة الوات ساعة <b>50% للكادميوم، 48% للحديد</b>.»</p>`},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب:</b> «جودة الأمبير ساعة 66.6%» تعني أننا نأخذ من البطارية عند التفريغ 66.6 أمبير ساعة مقابل كل 100 أمبير ساعة ندخلها عند الشحن. وجودة الوات ساعة أقل لأن جهد الشحن أعلى من جهد التفريغ.'},
  {h:'سعة البطارية وتيار الشحن',ref:'ص 33',html:`$$\\text{سعة البطارية (AH)}=\\text{التيار المسحوب (A)}\\times\\text{زمن السحب (H)}$$
   <p>«فإذا كانت سعة البطارية 300 أمبير ساعة <span class="ltr">(300AH)</span>، معنى ذلك أنه إذا كان: تيار السحب = نصف أمبير، فإن زمن السحب 600 ساعة. ومن ذلك نستنتج أنه <b>كلما زاد التيار المسحوب يقل زمن الاستعمال</b>، والعكس صحيح.»</p>`},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب:</b> عنوان الفقرة يذكر «تيار الشحن» لكن الكتاب لا يشرحه. تيار الشحن هو التيار الذي ندخله إلى البطارية لإعادة شحنها، ويحدده عادة صانع البطارية؛ وزمن الشحن التقريبي = الأمبير ساعة المطلوب إدخالها ÷ تيار الشحن (مع مراعاة الجودة: نُدخل أكثر مما نأخذ).'},
  {err:'<span class="fixnote"><b>ملاحظات على الكتاب:</b> (1) ص 33: طُبع أن القطب السالب في خلية <b>النيكل-حديد</b> «من الكادميوم الإسفنجي»، والصحيح أنه من <b>الحديد</b> (ولهذا سميت نيكل-حديد). (2) ص 32: الإشارة إلى «الشكل (2-2)» بعد جهود الشحن لا تناسب، فالشكل رسم تركيبي لا يبين الجهود. (3) أخطاء طباعة صُحّحت في النص: «حام» ← «حامض»، «كبريتلت» ← «كبريتات». (4) ص 33: العنوان يذكر «تيار الشحن» ولا يشرحه (أضفنا توضيحاً).</span>'}
 ],
 lab:(el)=>{
  let soc=1,mode='rest',sulf=0,level=1,th=0;const hist=[];const did={};let AH=300,Ic2=0.5,alk='cd',ahOut=100;
  el.innerHTML=`<div id="b2tp"></div><div class="grid cx-lab">
   <div class="panel c7"><h2>خلية رصاص-حمض تُشحن وتُفرغ <small>مبنية على ص 31–32 والشكل (2-2)</small></h2>
    <div class="cx-row">${segHTML('bm',[['dis','تفريغ في حمل'],['rest','راحة (بلا حمل)'],['chg','شحن']],mode)}<button class="btn" id="b2w">أضف ماءً مقطراً</button></div>
    <div class="svgbox" id="b2v" style="max-width:520px;margin-inline:auto"></div>
    <p class="sub">العرض مسرّع: كل ثانية = نصف ساعة. الجهد والكثافة يتغيران بخط مستقيم مبسط بين أرقام الكتاب (2.2 ← 1.8 V عند التفريغ، وحتى 2.6 V عند الشحن؛ والكثافة 1.21 ← 1.18). سرعة ظهور الكبرتة ونقص الماء توضيحية.</p></div>
   <div class="panel c5"><h2>القراءات</h2><div class="facts">${fact('حالة الشحن','b2soc')}${fact('جهد الخلية','b2vc')}${fact('جهد البطارية (6 خلايا)','b2vb')}${fact('كثافة الحامض','b2d')}${fact('الكبرتة','b2s')}${fact('الزمن المنقضي','b2t')}</div><div id="b2msg"></div></div>
   <div class="panel c12"><h2>جهد الخلية مع الزمن <small>آخر 40 ساعة</small></h2><div class="svgbox" id="b2plot"></div></div>
   <div class="panel c6"><h2>سعة البطارية <small>ص 33</small></h2>${sl('b2ah','سعة البطارية',10,500,10,AH)}${sl('b2i','تيار السحب',0.1,50,0.1,Ic2)}<div id="b2cap"></div></div>
   <div class="panel c6"><h2>جودة البطاريات القلوية <small>ص 33</small></h2>${segHTML('ba',[['cd','نيكل-كادميوم'],['fe','نيكل-حديد']],alk)}${sl('b2o','الأمبير ساعة التي نريد أخذها',10,300,10,ahOut)}<div id="b2alk"></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="b2st"></ol></div></div>`;
  const $=s=>el.querySelector(s);
  const TP=B.params($('#b2tp'),'u2-l2',[
   {k:'cap',label:'سعة البطارية في المحاكاة',unit:'AH',value:60,min:1,max:3000},
   {k:'Id',label:'تيار التفريغ (الحمل)',unit:'A',value:3,min:0.1,max:500,step:0.1},
   {k:'Ic',label:'تيار الشحن',unit:'A',value:6,min:0.1,max:500,step:0.1}]);
  segBind(el,'bm',v=>{mode=v});$('#b2w').onclick=()=>{if(level<0.999)did.water=1;level=1};
  const side=()=>{AH=+$('#b2ah').value;Ic2=+$('#b2i').value;$('#b2ah-v').textContent=fm(AH,0)+' AH';$('#b2i-v').textContent=fm(Ic2,1)+' A';
   $('#b2cap').innerHTML=`<div class="ex-f">${B.tex(`\\text{زمن السحب}=\\frac{${fm(AH,0)}\\ \\text{AH}}{${fm(Ic2,1)}\\ \\text{A}}=${fm(AH/Ic2,2)}\\ \\text{h}`,true)}</div><p class="sub">كلما زاد التيار المسحوب يقل زمن الاستعمال.</p>`;
   ahOut=+$('#b2o').value;$('#b2o-v').textContent=fm(ahOut,0)+' AH';const ew=alk==='cd'?0.5:0.48;
   $('#b2alk').innerHTML=`<div class="facts"><div class="fact"><span>جودة الأمبير ساعة</span><b>66.6 %</b></div><div class="fact"><span>نُدخل عند الشحن</span><b>${fm(ahOut/0.666,1)} AH</b></div><div class="fact"><span>جودة الوات ساعة</span><b>${fm(ew*100,0)} %</b></div><div class="fact"><span>لكل 100 Wh نأخذها نُدخل</span><b>${fm(100/ew,1)} Wh</b></div></div>
    <p class="sub">حجم الإلكتروليت لبطارية 100 AH (ص 33): حامضية <b>6.8 L</b> — قلوية <b>1.2 L</b>.</p><svg viewBox="0 0 400 60" role="img" aria-label="حجم الإلكتروليت"><rect x="10" y="8" width="${fx(6.8/6.8*300)}" height="16" fill="var(--live)" opacity=".7"/><rect x="10" y="34" width="${fx(1.2/6.8*300)}" height="16" fill="var(--blue)"/>${S.t(316,21,'6.8 L','m','start')}${S.t(70,47,'1.2 L','m','start')}</svg>`};
  ['b2ah','b2i','b2o'].forEach(k=>$('#'+k).oninput=side);segBind(el,'ba',v=>{alk=v;did.alk=did.alk||v==='fe';side()});
  const steps=stepsUI($('#b2st'),[
   {t:'فرّغ البطارية',x:'اختر «تفريغ»: ينزل جهد الخلية من 2.2 V وتنقص كثافة الحامض (الرصاص يتحول إلى كبريتات). تابع حتى 1.8 V: هنا «يجب أن تشحن الخلية».',done:()=>soc<=0.001},
   {t:'اتركها مفرغة',x:'اختر «راحة» واتركها مفرغة: تتراكم كبريتات الرصاص على الألواح (الكبرتة) وترتفع المقاومة الداخلية.',done:()=>sulf>=0.3},
   {t:'الشحن المتوالي',x:'اختر «شحن» واترك الشحن مستمراً بعد امتلاء البطارية (شحن متوالٍ بلا تفريغ) حتى تزول الكبرتة. لاحظ الجهد يصل 2.6 V والكثافة 1.21.',done:()=>soc>=0.999&&sulf<0.03&&mode==='chg'},
   {t:'مستوى الإلكتروليت',x:'مع الشحن تخرج الغازات من فتحات التهوية فينقص السائل. عندما تنكشف الألواح اضغط «أضف ماءً مقطراً» (فقط ماء مقطر).',done:()=>did.water},
   {t:'سعة البطارية',x:'في «سعة البطارية» بقيم الكتاب <span class="ltr">300 AH</span> و <span class="ltr">0.5 A</span> يكون الزمن <span class="ltr">600 h</span>. ضاعف التيار إلى <span class="ltr">1 A</span>: ينقص الزمن إلى النصف.',done:()=>AH===300&&Math.abs(Ic2-1)<1e-9},
   {t:'الجودة',x:'اختر «نيكل-حديد»: جودة الوات ساعة 48% بدل 50%.',done:()=>alk==='fe'}
  ]);
  side();
  loopOn(el,dt=>{const dh=dt*0.5;th+=dh;
   if(mode==='dis'){soc=Math.max(0,soc-TP.v.Id*dh/TP.v.cap*(1+sulf))}
   else if(mode==='chg'){if(soc<1)soc=Math.min(1,soc+TP.v.Ic*dh/TP.v.cap*(1-0.7*sulf));else sulf=Math.max(0,sulf-dt*0.08);level=Math.max(0.55,level-dt*0.006)}
   if(mode!=='chg'&&soc<0.05)sulf=Math.min(1,sulf+dt*0.04);
   const vc=mode==='chg'?2.2+0.4*soc:1.8+0.4*soc,d=1.18+0.03*soc;
   hist.push([th,vc]);while(hist.length&&hist[0][0]<th-40)hist.shift();
   $('#b2v').innerHTML=leadCellSVG({level,soc,sulf,dens:d});
   $('#b2soc').textContent=fm(soc*100,0)+' %';$('#b2vc').textContent=fm(vc,2)+' V';$('#b2vb').textContent=fm(6*vc,1)+' V';$('#b2d').textContent=fm(d,3);$('#b2s').textContent=sulf<0.03?'لا توجد':sulf<0.3?'بداية':'شديدة';$('#b2t').textContent=fm(th,1)+' h';
   const m=[];if(soc<=0.001&&mode!=='chg')m.push('<div class="callout err">وصل جهد الخلية 1.8 V: يجب الشحن الآن «وإلا فإن التفاعل يصير غير تبادلي».</div>');
   if(sulf>=0.03)m.push(`<div class="callout err">كبرتة: المقاومة الداخلية مرتفعة والجودة ناقصة، والشحن «لا يتم بانتظام» (أبطأ). تزول بالشحن المتوالي عدة مرات.</div>`);
   if(level<0.8)m.push('<div class="callout err">مستوى السائل أقل من أعلى الألواح: أضف ماءً مقطراً فقط.</div>');
   if(soc>=0.999&&mode==='chg'&&sulf<0.03)m.push('<div class="callout">البطارية مشحونة: الجهد 2.6 V أثناء الشحن، والكثافة 1.21.</div>');
   const mh=m.join('');if($('#b2msg').innerHTML!==mh)$('#b2msg').innerHTML=mh;
   $('#b2plot').innerHTML=plotSVG({w:760,h:200,x0:Math.max(0,th-40),x1:Math.max(40,th),y0:1.7,y1:2.7,yt:[1.8,2.0,2.2,2.4,2.6],xt:[],xl:'t (h)',yl:'V cell',series:[{pts:hist,col:'--live',w:2}],aria:'جهد الخلية'});
   steps.check()});
 },
 examples:[
  {title:'سعة البطارية (المثال المدمج في النص)',ref:'ص 33',q:'<p>«إذا كانت سعة البطارية 300 أمبير ساعة (300AH)، معنى ذلك أنه إذا كان: تيار السحب = نصف أمبير، فإن زمن السحب 600 ساعة.»</p>',
   given:[{id:'AH',label:'سعة البطارية',sym:'',unit:'AH',value:300},{id:'I',label:'تيار السحب',sym:'I',unit:'A',value:0.5}],
   solve:g=>[{t:'سعة البطارية = التيار × الزمن، إذن:',f:`H=\\frac{AH}{A}=\\frac{${fm(g.AH)}}{${fm(g.I)}}`,v:fm(g.AH/g.I,4),unit:'h',final:true}]}
 ],
 quiz:[
  {q:'ما الذي يميز البطارية الثانوية؟',o:['جهدها أعلى','يمكن عكس تفاعلاتها فيعاد شحنها','إلكتروليتها جاف','لا تحتوي على أقطاب'],c:1,e:'ص 31.'},
  {q:'في بطارية الرصاص-الحمض القطب الموجب من:',o:['الرصاص','أكسيد الرصاص PbO₂','الكادميوم','النيكل'],c:1,e:'ص 32.'},
  {q:'عند التفريغ في الخلية الحامضية:',o:['يزيد تركيز الحامض','يتحول الرصاص إلى كبريتات الرصاص ويقل تركيز الحامض','يتحول الرصاص إلى أكسيد الرصاص','لا يتغير شيء'],c:1,e:'ص 32.'},
  {q:'جهد الخلية الحامضية المشحونة وجهدها عند نهاية التفريغ:',o:['2.6 و 2.2 V','2.2 و 1.8 V','1.5 و 1 V','12 و 6 V'],c:1,e:'ص 32.'},
  {q:'بماذا تقاس كثافة الحامض؟',o:['الأوميتر','الهيدرومتر','الفولتميتر','الأميتر'],c:1,e:'ص 32.'},
  {q:'تزال الكبرتة بـ:',o:['إضافة حامض','الشحن المتوالي عدة مرات بدون تفريغ','ترك البطارية مفرغة','التفريغ السريع'],c:1,e:'ص 32.'},
  {q:'عند نقص سائل البطارية الحامضية نضيف:',o:['حامض الكبريتيك','ماء الصنبور','الماء المقطر فقط','هيدروكسيد البوتاسيوم'],c:2,e:'ص 32.'},
  {q:'بطارية سعتها 300 AH تغذي حملاً يسحب 2 A. زمن الاستعمال:',o:['600 h','150 h','300 h','60 h'],c:1,e:'300 / 2 = 150 h.'}
 ]
});

/* ======================================================================
   Lesson 7 — تجميع الخلايا (ص 34–39، 42)
   ====================================================================== */
const groupI=(n,m,E,r,R)=>n*E/(R+n*r/m);
const divs=N=>{const a=[];for(let m=1;m<=N;m++)if(N%m===0)a.push(m);return a};
function cellsLab(el,cfg){
  const st=Object.assign({},cfg.start);st.preset=cfg.start.k;st.dirty=false;const seen=new Set([st.preset]);const PRE=Object.fromEntries(cfg.presets.map(p=>[p.k,p]));const id=cfg.id;
  el.innerHTML=`<div class="grid cx-lab">
   <div class="panel c12"><h2>${cfg.title} <small>${cfg.ref}</small></h2><div class="svgbox" id="${id}g" style="max-width:900px;margin-inline:auto"></div><p class="sub">n خلية على التوالي في كل صف، و m صفاً على التوازي، وكل خلية مرسومة برمزها ومقاومتها الداخلية r. الخطوط المتحركة = مرور التيار.</p></div>
   <div class="panel c5"><h2>البناء</h2><div class="sub">أمثلة الكتاب وتمارينه:</div><div class="cx-row">${cfg.presets.map(p=>`<button class="btn" data-${id}p="${p.k}">${p.label}</button>`).join('')}</div>
    <div class="cx-sliders">${sl(id+'n','n: خلايا على التوالي في الصف',1,12,1,st.n)}${sl(id+'m','m: صفوف على التوازي',1,8,1,st.m)}${sl(id+'E','E: جهد الخلية',0.5,3,0.1,st.E)}${sl(id+'r','r: المقاومة الداخلية للخلية',0,5,0.1,st.r)}</div>${sl(id+'R','R: مقاومة الحمل',0.1,50,0.1,st.R)}</div>
   <div class="panel c7"><h2>القراءات</h2><div class="facts">${fact('N = m × n','x'+id+'N')}${fact('جهد البطارية n E','x'+id+'Eb')}${fact('المقاومة الداخلية n r / m','x'+id+'rb')}${fact('التيار I','x'+id+'I')}${fact('تيار كل صف I/m','x'+id+'Ir')}${fact('الجهد على الحمل V = I R','x'+id+'V')}${fact('قدرة الحمل I² R','x'+id+'P')}${fact('الجودة η = R/(R + r<sub>b</sub>)','x'+id+'eta')}</div><div id="${id}c"></div></div>
   <div class="panel c12"><h2>كل التشكيلات الممكنة لعدد الخلايا نفسه N <small>المعادلتان m n = N و m R = n r (ص 37)</small></h2><div class="cx-tbl" id="${id}t"></div></div>
   ${cfg.extra||''}
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="${id}st"></ol></div></div>`;
  const $=s=>el.querySelector(s);
  /* أعطال مخفية (وضع التحدي فقط) في خلية من الصف الأول: موصلة بالعكس، فارغة (قوتها الدافعة صفر ومقاومتها كبيرة)، مقطوعة من الداخل؛
     أو كل الخلايا قديمة (مقاومتها الداخلية ثلاثة أضعاف). التيار المقاس من الصفوف المتوازية بمكافئ ثفنن */
  const chX=()=>chF('rev')||chF('dead')||chF('open')||chF('aged');
  const chI=(n,m,E,r,R)=>{if(chF('aged'))return groupI(n,m,E,3*r,R);const rows=[];for(let j=0;j<m;j++)rows.push([n*E,n*r]);
    if(chF('rev'))rows[0][0]=(n-2)*E;else if(chF('dead'))rows[0]=[(n-1)*E,(n-1)*r+Math.max(10*r,5)];else if(chF('open'))rows.shift();
    if(!rows.length)return 0;let G=0,J=0;rows.forEach(([e,p])=>{p=Math.max(p,1e-3);G+=1/p;J+=e/p});return (J/G)/(R+1/G)};
  const draw=()=>{const {n,m,E,r,R}=st,N=n*m,rb=n*r/m;let I=groupI(n,m,E,r,R);if(chX())I=chI(n,m,E,r,R);
   [['n',0],['m',0],['E',1],['r',1],['R',1]].forEach(([k,d])=>{$('#'+id+k).value=st[k];$('#'+id+k+'-v').textContent=fm(st[k],d)+({E:' V',r:' Ω',R:' Ω'}[k]||'')});
   $('#'+id+'g').innerHTML=gridSVG({n,m,lblE:fm(E)+'V',lblR:fm(r)+'Ω',lblL:'R = '+fm(R)+' Ω',I:'I = '+fm(I,3)+' A',flow:I>0});
   $('#x'+id+'N').textContent=`${m} × ${n} = ${N}`;$('#x'+id+'Eb').textContent=fm(n*E,3)+' V';$('#x'+id+'rb').textContent=fm(rb,4)+' Ω';$('#x'+id+'I').textContent=fm(I,4)+' A';$('#x'+id+'Ir').textContent=fm(I/m,4)+' A';$('#x'+id+'V').textContent=fm(I*R,4)+' V';$('#x'+id+'P').textContent=fm(I*I*R,4)+' W';$('#x'+id+'eta').textContent=fm(100*R/(R+rb),1)+' %';
   const k=m*R-n*r;$('#'+id+'c').innerHTML=`<div class="callout">${Math.abs(k)<1e-9?`<b>m R = n r</b> (${fm(m*R)} = ${fm(n*r)}): المقاومة الخارجية = المقاومة الداخلية للبطارية، فهذا التشكيل يعطي أعلى تيار ممكن من N خلية، والجودة 50%.`:k>0?`m R = ${fm(m*R,3)} أكبر من n r = ${fm(n*r,3)}: الحمل كبير بالنسبة للمقاومة الداخلية — خلايا أكثر على التوالي تزيد التيار.`:`m R = ${fm(m*R,3)} أصغر من n r = ${fm(n*r,3)}: الحمل صغير بالنسبة للمقاومة الداخلية — صفوف أكثر على التوازي تزيد التيار.`}</div>`;
   const all=divs(N).map(mm=>({m:mm,n:N/mm,I:groupI(N/mm,mm,E,r,R)})),best=all.reduce((a,b)=>b.I>a.I+1e-12?b:a,all[0]);
   $('#'+id+'t').innerHTML=`<table class="cx-rec"><thead><tr><th>m صفوف</th><th>n في الصف</th><th>الوصف</th><th>I</th><th>η</th></tr></thead><tbody>${all.map(o=>`<tr class="${o.m===m?'cur':''}"><td class="l">${o.m}</td><td class="l">${o.n}</td><td>${o.m===1?'توالي':o.n===1?'توازي':'مركب'}${o===best?' — <b>أعلى تيار</b>':''}</td><td class="l">${fm(o.I,4)} A</td><td class="l">${fm(100*R/(R+o.n*r/o.m),1)} %</td></tr>`).join('')}</tbody></table><p class="sub">الصف الملون = تشكيلك الحالي. \\(m^2=N r/R=${fm(N*r/R,4)}\\) فالقيمة المثالية \\(m\\approx${fm(Math.sqrt(N*r/R),3)}\\).</p>`;B.math($('#'+id+'t'));
   if(cfg.after)cfg.after(st,$);};
  const touch=()=>{st.dirty=true;st.preset=null};
  ['n','m','E','r','R'].forEach(k=>$('#'+id+k).oninput=e=>{st[k]=+e.target.value;touch();draw()});
  el.querySelectorAll(`[data-${id}p]`).forEach(b=>b.onclick=()=>{const p=PRE[b.dataset[id+'p']];Object.assign(st,p);st.preset=p.k;st.dirty=false;seen.add(p.k);draw()});
  draw();const steps=stepsUI($('#'+id+'st'),cfg.steps({st,seen,is:k=>st.preset===k&&!st.dirty}));loopOn(el,()=>steps.check());
  return {st,draw};
}
function ex21(g){const st=[],E4=4*g.E,r4=4*g.r,Ia=E4/(r4+g.R),rp=g.r/4,Ib=g.E/(rp+g.R),E2=2*g.E,rr=2*g.r,rc=1/(1/rr+1/rr),Ic=E2/(rc+g.R);
  st.push({t:'أ- على التوالي: القوة الدافعة الكهربائية:',f:`E=${fm(g.E)}\\times4`,v:fm(E4,6),unit:'V'},{t:'المقاومة الداخلية للبطارية:',f:`r_{int}=${fm(g.r)}\\times4`,v:fm(r4,6),unit:'Ω'},{t:'التيار المسحوب:',f:`I=\\frac{E}{r_{int}+r_{ext}}=\\frac{${fm(E4,6)}}{${fm(r4,6)}+${fm(g.R)}}`,v:fm(Ia,4),unit:'A',final:true});
  st.push({t:'ب- على التوازي: القوة الدافعة الكهربائية للعمود الواحد:',f:`E=${fm(g.E)}`,v:fm(g.E,6),unit:'V'},{t:'المقاومة الداخلية للبطارية:',f:`r_{int}=\\frac{${fm(g.r)}}{4}`,v:fm(rp,6),unit:'Ω'},{t:'التيار المسحوب:',f:`I=\\frac{${fm(g.E)}}{${fm(rp,6)}+${fm(g.R)}}`,v:fm(Ib,4),unit:'A',final:true});
  st.push({t:'ج- صفان متوازيان بكل صف خليتان على التوالي: القوة الدافعة للصف الواحد:',f:`E=${fm(g.E)}\\times2`,v:fm(E2,6),unit:'V'},{t:'المقاومة للفرع الواحد (خليتان على التوالي):',f:`${fm(g.r)}\\times2`,v:fm(rr,6),unit:'Ω'},{t:'المقاومة الكلية للفرعين على التوازي:',f:`\\frac1{r_{int}}=\\frac1{${fm(rr,6)}}+\\frac1{${fm(rr,6)}}`,v:fm(rc,6),unit:'Ω'},{t:'التيار المسحوب:',f:`I=\\frac{${fm(E2,6)}}{${fm(rc,6)}+${fm(g.R)}}`,v:fm(Ic,4),unit:'A',final:true});
  return st}
function grpSteps(n,m,g,lbl){const Eb=n*g.E,rb=n*g.r/m,I=Eb/(rb+g.R);return [{t:lbl+' جهد البطارية = جهد الصف الواحد:',f:`E_b=n\\,E=${n}\\times${fm(g.E)}`,v:fm(Eb,6),unit:'V'},{t:'المقاومة الداخلية:',f:`r_b=\\frac{n\\,r}{m}=\\frac{${n}\\times${fm(g.r)}}{${m}}`,v:fm(rb,6),unit:'Ω'},{t:'التيار:',f:`I=\\frac{E_b}{R+r_b}=\\frac{${fm(Eb,6)}}{${fm(g.R)}+${fm(rb,6)}}`,v:fm(I,4),unit:'A',final:true}]}
B.lesson({
 id:'u2-l3',unit:2,order:3,pages:'34–39، 42',
 title:'تجميع الخلايا في بطاريات: التوالي والتوازي والمركب',
 summary:'قانون أوم، ثم تجميع الخلايا على التوالي (يزيد الجهد والمقاومة الداخلية) أو على التوازي (يبقى الجهد وتقل المقاومة الداخلية) أو تجميعاً مركباً من عدة صفوف، وشرط أعلى تيار (المقاومة الداخلية للبطارية = مقاومة الحمل)، وجودة المجموعة. مع المثال (2-1) والتمرينين 1 و2.',
 stations:[
  {intro:true},

  {st:1,short:'المقاومة وقانون أوم',title:'تجميع الخلايا في بطاريات: المقاومة وقانون أوم',ref:'ص 34',
   q:'قبل أن نجمع الخلايا: ما الذي يعارض حركة الشحنات، وكيف نحسبه؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الشكل 2-3: مقاومة R عليها فرق جهد V والتيار I يدخل من الطرف الموجب" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><line x1="30" y1="130" x2="110" y2="130" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><polyline points="110,130 115.833,142 127.5,118 139.167,142 150.833,118 162.5,142 174.167,118 185.833,142 197.5,118 209.167,142 220.833,118 232.5,142 244.167,118 250,130" fill="none" stroke="#2C4A40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><line x1="250" y1="130" x2="330" y2="130" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><g data-tip="⟦R⟧: المقاومة، معارضة الوسط لحركة الشحنات."><text x="180" y="172" text-anchor="middle" font-size="18" fill="#2C4A40" font-weight="700" direction="ltr">R</text><rect x="110" y="112" width="140" height="36" fill="transparent"/></g><g data-tip="⟦V⟧: فرق الجهد المسلط بين طرفي المقاومة؛ الطرف الموجب يساراً."><text x="180" y="92" text-anchor="middle" font-size="18" fill="#E8735A" font-weight="700" direction="ltr">V</text><text x="110" y="96" text-anchor="middle" font-size="18" fill="#E8735A" font-weight="700" direction="ltr">+</text><text x="250" y="96" text-anchor="middle" font-size="20" fill="#E8735A" font-weight="700" direction="ltr">−</text></g><g data-tip="⟦I⟧: التيار المار؛ يدخل من الطرف الموجب."><line x1="40" y1="152" x2="85.6" y2="152" stroke="#12855A" stroke-width="2.5" stroke-linecap="round"/><polygon points="92.0,152.0 84.0,156.4 84.0,147.6" fill="#12855A"/><text x="66" y="176" text-anchor="middle" font-size="17" fill="#12855A" font-weight="700" direction="ltr">I</text></g><rect x="70" y="214" width="220" height="40" rx="12" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><text x="180" y="240" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700" direction="ltr">V = I × R</text><text x="180" y="286" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700" direction="ltr">R = V / I</text></svg>`,
   cap:'رسم الشكل <span class="ltr">(2-3)</span>: المقاومة R وفرق الجهد V عليها والتيار I.<br><b>مرّر المؤشر على R و V و I (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'ما وحدة المقاومة؟',opts:[
     ['الأوم، وهي فولت ÷ أمبير',true,'نص الكتاب: «ووحدة المقاومة R هي Volt/Ampere ويطلق عليها أوم (Ohm)».'],
     ['الأمبير',false,'الأمبير وحدة التيار.'],
     ['الفولت × أمبير',false,'هذه وحدة القدرة (الوات)؛ المقاومة قسمة لا ضرب.']]}}
   ],
   body:[
    {book:String.raw`<p>إن التيار الكهربائي هو نتيجة تحرك شحنات كهربائية، وهذه الشحنات المتحركة تلقى معارضة للحركة نتيجة لتصادمها مع ذرات وأيونات الوسط الذي تتحرك فيه. ويطلق على هذه المعارضة المقاومة ويسمى الوسط الذي تحدث فيه هذه المقاومة بالوسط المقاوم. ويرمز لها بالرمز R.</p>
     <p>وتعرف المقاومة بأنها خارج قسمة فرق الجهد المسلط بين طرفي المقاومة على شدة التيار المار فيه. أي أن:</p>
     <div class="eq" style="position:relative;overflow-x:auto">$$R=\frac{V}{I}$$<span></span></div>
     <p>وبالتالي يمكن كتابة قانون أوم كالآتي:</p>
     <div class="eq" style="position:relative;overflow-x:auto">$$V=I\times R$$<span></span></div>
     <p>حيث R هي المقاومة (Resistance)، V هو فرق الجهد المسلط، I هو التيار المار، ووحدة المقاومة R هي Volt/Ampere ويطلق عليها أوم (Ohm) نسبة إلى العالم الألماني جورج سيمون أوم الذي يعتبر أول من لاحظ هذه العلاقة عام <span class="ltr">١٨٢٧</span> م. ويرمز للأوم بالحرف اللاتيني (Omega Ω). وتعرف العلاقة السابقة بقانون أوم (Ohm's law). والشكل (2-3) يوضح اتجاه التيار I وكذلك فرق الجهد V عبر المقاومة R. وعموماً سوف يتم شرح هذا القانون بالتفصيل في الوحدة الثالثة.</p>
     <p>وتجمع الخلايا في مجموعات موصلة على التوالي والتوازي لتكوين بطارية أو مراكم، ونلاحظ في هذه الحالة ما يلي:</p>`,ref:'ص 34'},
    {tip:String.raw`<p>في المحطات التالية نستعمل هذه الرموز:</p>
     <div style="position:relative;overflow-x:auto"><table class="tt"><tbody><tr><th>n</th><td>عدد الخلايا (في الخط الواحد في التجميع المركب)</td></tr><tr><th>m</th><td>عدد الخطوط على التوازي (في التجميع المركب)</td></tr><tr><th>E</th><td>جهد (القوة الدافعة) للخلية الواحدة</td></tr><tr><th>r</th><td>المقاومة الداخلية للخلية الواحدة</td></tr><tr><th>R</th><td>مقاومة الحمل الخارجي</td></tr></tbody></table></div>
     <p>وكل الحسابات تطبيق لقانون أوم: التيار = الجهد الكلي ÷ المقاومة الكلية (الداخلية + الحمل).</p>`,title:'رموز التجميع'},
    {title:'مختبر مصغّر: قانون أوم',widget:(el,B)=>DCML.lab(el,B,{intro:'غيّر فرق الجهد والمقاومة (أرقام تختارها أنت) وراقب التيار \\(I=V/R\\).',
 predict:{q:'ضاعفنا المقاومة وبقي الجهد كما هو. التيار:',opts:[
  ['يتضاعف',false,'المقاومة معارضة للحركة؛ زيادتها لا تزيد التيار.'],
  ['يقل إلى النصف',true,'\\(I=V/R\\): المقاومة في المقام.'],
  ['لا يتغير',false,'التيار يعتمد على الجهد والمقاومة معاً.']]},
 ins:[{k:'V',l:'فرق الجهد V',u:'V',min:0,max:12,step:0.5,v:6},{k:'R',l:'المقاومة R',u:'Ω',min:1,max:20,step:1,v:4}],
 calc:(s,P,B)=>{const I=s.V/s.R;return {pic:DCML.gauge(B,{v:I,max:12,lab:'A',txt:DCML.fm(B,B.round(I,3))+' A'}),facts:[['I = V ÷ R',DCML.fm(B,B.round(I,3))+' A','hi'],['تحقق: I × R',DCML.fm(B,B.round(I*s.R,3))+' V']]}}})}
   ]},

  {st:2,short:'(أ) التوالي',title:'(أ) تجميع التوالي',ref:'ص 35',
   q:'هل توصيل الخلايا على التوالي يزيد التيار دائماً؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="خلايا على التوالي تغذي مقاومة حمل" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E2ECF3"/><g data-tip="كل خلية: قوتها الدافعة ⟦E⟧ ومقاومتها الداخلية ⟦r⟧. الموجب لكل خلية متصل بسالب التي تليها."><line x1="58" y1="110" x2="67" y2="110" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="67" y1="99" x2="67" y2="121" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="butt"/><line x1="75" y1="104.5" x2="75" y2="115.5" stroke="#2C4A40" stroke-width="5" stroke-linecap="butt"/><line x1="75" y1="110" x2="79" y2="110" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><polyline points="79,110 81.0833,114 85.25,106 89.4167,114 93.5833,106 97.75,114 101.917,106 104,110" fill="none" stroke="#2C4A40" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/><line x1="104" y1="110" x2="110" y2="110" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="110" y1="110" x2="119" y2="110" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="119" y1="99" x2="119" y2="121" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="butt"/><line x1="127" y1="104.5" x2="127" y2="115.5" stroke="#2C4A40" stroke-width="5" stroke-linecap="butt"/><line x1="127" y1="110" x2="131" y2="110" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><polyline points="131,110 133.083,114 137.25,106 141.417,114 145.583,106 149.75,114 153.917,106 156,110" fill="none" stroke="#2C4A40" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/><line x1="156" y1="110" x2="162" y2="110" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="162" y1="110" x2="171" y2="110" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="171" y1="99" x2="171" y2="121" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="butt"/><line x1="179" y1="104.5" x2="179" y2="115.5" stroke="#2C4A40" stroke-width="5" stroke-linecap="butt"/><line x1="179" y1="110" x2="183" y2="110" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><polyline points="183,110 185.083,114 189.25,106 193.417,114 197.583,106 201.75,114 205.917,106 208,110" fill="none" stroke="#2C4A40" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/><line x1="208" y1="110" x2="214" y2="110" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><rect x="58" y="90" width="156" height="40" fill="transparent"/></g><text x="84" y="82" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="ltr">E</text><text x="106" y="82" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="ltr">r</text><text x="240" y="114" text-anchor="middle" font-size="20" fill="#2C4A40" font-weight="700" direction="ltr">…</text><line x1="214" y1="110" x2="226" y2="110" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="254" y1="110" x2="270" y2="110" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="270" y1="110" x2="279" y2="110" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="279" y1="99" x2="279" y2="121" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="butt"/><line x1="287" y1="104.5" x2="287" y2="115.5" stroke="#2C4A40" stroke-width="5" stroke-linecap="butt"/><line x1="287" y1="110" x2="291" y2="110" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><polyline points="291,110 292.583,114 295.75,106 298.917,114 302.083,106 305.25,114 308.417,106 310,110" fill="none" stroke="#2C4A40" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/><line x1="40" y1="110" x2="58" y2="110" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="40" y1="110" x2="40" y2="220" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><line x1="310" y1="110" x2="320" y2="110" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="320" y1="110" x2="320" y2="220" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><g data-tip="مقاومة الحمل ⟦R⟧ بين سالب أول خلية وموجب آخر خلية."><line x1="40" y1="220" x2="130" y2="220" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><polyline points="130,220 135,228 145,212 155,228 165,212 175,228 185,212 195,228 205,212 215,228 225,212 230,220" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><line x1="230" y1="220" x2="320" y2="220" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><text x="180" y="252" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" direction="ltr">R</text></g><text x="180" y="62" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">n خلية على التوالي</text><rect x="60" y="264" width="240" height="36" rx="12" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><text x="180" y="288" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" direction="ltr">I = nE / (R + nr)</text></svg>`,
   cap:'خلايا على التوالي، لكل منها قوة دافعة E ومقاومة داخلية r، تغذي حملاً R.<br><b>مرّر المؤشر على الخلايا والحمل (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'متى يُستعمل تجميع التوالي حسب الكتاب؟',opts:[
     ['عندما تكون مقاومة الحمل صغيرة جداً',false,String.raw`في هذه الحالة يبقى التيار قريباً من تيار خلية واحدة \(E/r\).`],
     ['عندما تكون مقاومة الحمل كبيرة بالنسبة للمقاومة الداخلية للبطارية',true,'نص الكتاب: «فإن تجميع التوالي يستعمل في حالة كون مقاومة الحمل كبيرة بالنسبة للمقاومة الداخلية للبطارية».'],
     ['دائماً، لأنه يزيد التيار في كل الحالات',false,'إذا كانت R صغيرة جداً لا يزيد التيار بزيادة الخلايا.']]}}
   ],
   body:[
    {book:String.raw`<p>يوصل القطب الموجب لكل بطارية بالقطب السالب للبطارية التي تليها ثم توصل مقاومة الحمل بين القطب السالب لأول بطارية والقطب الموجب لآخر بطارية.</p>
     <p>إذا فرضنا أن عدد الخلايا الموصلة مع بعضها البعض على التوالي n، وجهد كل خلية E، ومقاومتها الداخلية r، فيكون:</p>
     <ul><li>الجهد الكلي للبطارية = \(n\,E\) فولت</li><li>المقاومة الداخلية الكلية = \(n\,r\) أوم</li><li>المقاومة الكلية بالدائرة = \(R+n\,r\) أوم</li></ul>
     <p>ويكون التيار المار في الدائرة (طبقاً لقانون أوم) هو:</p>
     <div class="eq" style="position:relative;overflow-x:auto">$$I=\frac{n\times E}{R+n\times r}$$<span></span></div>
     <p>فإذا كانت \(R\ll n\,r\) فيكون:</p>
     <div class="eq" style="position:relative;overflow-x:auto">$$I=\frac{n\times E}{n\times r}=\frac{E}{r}$$<span></span></div>
     <p>أي أن التيار I في هذه الحالة هو تيار الخلية الواحدة، وهو لا يزيد بتوصيل الخلايا على التوالي. أما إذا كانت \(n\,r\ll R\) فإن التيار يصبح:</p>
     <div class="eq" style="position:relative;overflow-x:auto">$$I=\frac{n\times E}{R}=n\left(\frac{E}{R}\right)$$<span></span></div>
     <p>أي أن التيار يزيد هنا بعدد n مرة من التيار الناتج عن خلية واحدة. ولذلك فإن البطارية تعطي أقصى تيار للحمل إذا كانت مقاومة الخلايا صغيرة جداً بالنسبة لمقاومة الحمل R. وعلى هذا الأساس فإن <b>تجميع التوالي يستعمل في حالة كون مقاومة الحمل كبيرة بالنسبة للمقاومة الداخلية للبطارية</b>.</p>`,ref:'ص 35'},
    {tip:String.raw`<p>في التوالي يكبر <b>الجهد</b> n مرة، لكن <b>المقاومة الداخلية</b> تكبر n مرة أيضاً. فإذا كانت المقاومة الداخلية هي الغالبة (حمل صغير) ألغت كل منهما الأخرى وبقي التيار \(E/r\). وإذا كان الحمل هو الغالب استفدنا من الجهد الكبير.</p>`,title:'لماذا لا يزيد التيار دائماً؟'},
    {watch:String.raw`<p>الرمز \(\ll\) يعني «أصغر بكثير من»، وليس «أصغر من» فقط. المعادلتان المختصرتان تقريب صالح فقط عندما يكون الفرق كبيراً.</p>`},
    {title:'مختبر مصغّر: أضف خلايا على التوالي',widget:(el,B)=>DCML.lab(el,B,{intro:'كل خلية \\(E=1.5\\ V\\) و\\(r=2\\ \\Omega\\) (أرقام مثال 2-1). غيّر عدد الخلايا n ومقاومة الحمل R (أرقام تختارها أنت)، وقارن بتيار خلية واحدة.',
 predict:{q:'الحمل صغير جداً (\\(R=0.1\\ \\Omega\\)). زدنا الخلايا على التوالي من <span class="ltr">1</span> إلى <span class="ltr">8</span>. التيار:',opts:[
  ['يبقى تقريباً \\(E/r\\)',true,'الجهد يكبر n مرة والمقاومة الداخلية n مرة أيضاً، والحمل صغير جداً فلا أثر له: \\(I\\approx E/r\\).'],
  ['يصبح ثمانية أضعاف',false,'هذا يحدث فقط إذا كان الحمل كبيراً جداً مقارنة بـ \\(nr\\).'],
  ['يصبح صفراً',false,'التيار لا ينعدم بزيادة الخلايا.']]},
 ins:[{k:'n',l:'عدد الخلايا n',min:1,max:8,step:1,v:4},{k:'R',l:'مقاومة الحمل R',seg:[[0.1,'0.1 Ω'],[2,'2 Ω'],[20,'20 Ω'],[200,'200 Ω']],v:2}],
 calc:(s,P,B)=>{const E=1.5,r=2,I=n=>n*E/(s.R+n*r),i=I(s.n),i1=I(1);const pts=[1,2,3,4,5,6,7,8].map(n=>[n,I(n)]);const ym=Math.max(...pts.map(p=>p[1]))*1.15;
  return {facts:[['الجهد الكلي nE',DCML.fm(B,B.round(s.n*E,2))+' V'],['المقاومة الداخلية nr',DCML.fm(B,s.n*r)+' Ω'],['التيار I',DCML.fm(B,B.round(i,3))+' A','hi'],['التيار ÷ تيار خلية واحدة',DCML.fm(B,B.round(i/i1,2))]],
   plot:{xr:[1,8],yr:[0,ym],xl:'n',yl:'I (A)',xt:[1,2,3,4,5,6,7,8],curves:[{pts}],dots:pts.map(p=>[p[0],p[1]]),cur:[s.n,i]},
   msg:s.R<=0.1?'الحمل صغير جداً: التيار يبقى تقريباً \\(E/r\\) مهما زدنا الخلايا.':s.R>=200?'الحمل كبير جداً: التيار يكاد يتضاعف مع n، أي \\(I\\approx n(E/R)\\).':'الحالة الوسطى: التيار يزيد مع n لكن أقل من n مرة.'}}})}
   ]},

  {st:3,short:'(ب) التوازي',title:'(ب) تجميع التوازي',ref:'ص 35–36',
   q:'وصلنا الخلايا كلها موجباً مع موجب وسالباً مع سالب. ماذا يحدث للجهد وللمقاومة الداخلية؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="خلايا على التوازي تغذي مقاومة حمل" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><line x1="80" y1="60" x2="80" y2="220" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><line x1="280" y1="60" x2="280" y2="220" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><line x1="80" y1="70" x2="140" y2="70" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="140" y1="70" x2="149" y2="70" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="149" y1="59" x2="149" y2="81" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="butt"/><line x1="157" y1="64.5" x2="157" y2="75.5" stroke="#2C4A40" stroke-width="5" stroke-linecap="butt"/><line x1="157" y1="70" x2="161" y2="70" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><polyline points="161,70 164.25,74 170.75,66 177.25,74 183.75,66 190.25,74 196.75,66 200,70" fill="none" stroke="#2C4A40" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/><line x1="200" y1="70" x2="280" y2="70" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="80" y1="120" x2="140" y2="120" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="140" y1="120" x2="149" y2="120" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="149" y1="109" x2="149" y2="131" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="butt"/><line x1="157" y1="114.5" x2="157" y2="125.5" stroke="#2C4A40" stroke-width="5" stroke-linecap="butt"/><line x1="157" y1="120" x2="161" y2="120" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><polyline points="161,120 164.25,124 170.75,116 177.25,124 183.75,116 190.25,124 196.75,116 200,120" fill="none" stroke="#2C4A40" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/><line x1="200" y1="120" x2="280" y2="120" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="80" y1="170" x2="140" y2="170" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="140" y1="170" x2="149" y2="170" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="149" y1="159" x2="149" y2="181" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="butt"/><line x1="157" y1="164.5" x2="157" y2="175.5" stroke="#2C4A40" stroke-width="5" stroke-linecap="butt"/><line x1="157" y1="170" x2="161" y2="170" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><polyline points="161,170 164.25,174 170.75,166 177.25,174 183.75,166 190.25,174 196.75,166 200,170" fill="none" stroke="#2C4A40" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/><line x1="200" y1="170" x2="280" y2="170" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><g data-tip="كل الأقطاب الموجبة معاً وكل الأقطاب السالبة معاً: جهد البطارية ⟦E⟧ مثل الخلية الواحدة."><rect x="80" y="55" width="200" height="135" fill="transparent"/></g><text x="300" y="124" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="ltr">n</text><text x="150" y="54" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr">E</text><text x="182" y="54" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700" direction="ltr">r</text><g data-tip="مقاومة الحمل ⟦R⟧."><line x1="80" y1="220" x2="130" y2="220" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><polyline points="130,220 135,228 145,212 155,228 165,212 175,228 185,212 195,228 205,212 215,228 225,212 230,220" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><line x1="230" y1="220" x2="280" y2="220" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><text x="180" y="252" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" direction="ltr">R</text></g><rect x="60" y="264" width="240" height="36" rx="12" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><text x="180" y="288" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" direction="ltr">I = E / (R + r/n)</text></svg>`,
   cap:'n خلية على التوازي تغذي حملاً R.<br><b>مرّر المؤشر على الفروع والحمل (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'ما جهد البطارية عند توصيل n خلية متماثلة على التوازي؟',opts:[
     [String.raw`\(E/n\)`,false,'الجهد لا يقسم على عدد الخلايا.'],
     [String.raw`\(n\,E\)`,false,'هذا جهد التوالي.'],
     [String.raw`\(E\) نفسه، جهد الخلية الواحدة`,true,'نص الكتاب: «وبذلك يكون جهد البطارية E مساوياً لجهد الخلية الواحدة».']]}}
   ],
   body:[
    {book:String.raw`<p>وتوصل جميع الأقطاب الموجبة مع بعضها والأقطاب السالبة مع بعضها البعض، وبذلك يكون جهد البطارية E مساوياً لجهد الخلية الواحدة. والمقاومة الداخلية لمجموعة خلايا قدره خلية، ومقاومة كل منها \((1/n)\,r\) أوم، وتكون المقاومة الكلية بالدائرة:</p>
     <div class="eq" style="position:relative;overflow-x:auto">$$R+\frac{r}{n}$$<span></span></div>
     <p>وتيار الحمل يصبح:</p>
     <div class="eq" style="position:relative;overflow-x:auto">$$I=\frac{E}{R+\dfrac{r}{n}}$$<span></span></div>
     <p>فإذا كانت \(r/n\ll R\) فإن</p>
     <div class="eq" style="position:relative;overflow-x:auto">$$I=\frac{E}{R}$$<span></span></div>
     <p>أي يصبح التيار مساوياً للتيار الناتج عن خلية واحدة. أي لا فائدة تعود من هذه التوصيلة بهذا الوضع.</p>
     <p>أما إذا كانت \(R\ll r/n\) فإن \(I=n\,(E/r)\) وهو يساوي (n) مرة التيار الذي يمكن أن نحصل عليه من خلية واحدة. ولذا <b>نستعمل مجموعات التوازي إذا كانت مقاومة الحمل صغيرة جداً</b> بالنسبة لمقاومة البطارية.</p>`,ref:'ص 35–36'},
    {watch:String.raw`<p>الجملة الأولى عن المقاومة الداخلية ناقصة في الكتاب («لمجموعة خلايا قدره خلية…»). المقصود: <b>المقاومة الداخلية لمجموعة من n خلية، مقاومة كل منها r، تكون \(r/n\) أوم</b>.</p>`,fix:true},
    {tip:String.raw`<p>التوازي <b>لا يرفع الجهد</b>، لكنه يقسم المقاومة الداخلية على n (كأن الخلايا تتقاسم التيار). لذلك يفيد عندما تكون المقاومة الداخلية هي الغالبة، أي مع حمل صغير المقاومة.</p>
     <div style="position:relative;overflow-x:auto"><table class="tt"><thead><tr><th></th><th>التوالي</th><th>التوازي</th></tr></thead><tbody>
     <tr><td>الجهد</td><td>\(nE\)</td><td>\(E\)</td></tr><tr><td>المقاومة الداخلية</td><td>\(nr\)</td><td>\(r/n\)</td></tr><tr><td>يفيد مع حمل</td><td>كبير</td><td>صغير جداً</td></tr></tbody></table></div>`,title:'التوالي والتوازي معاً'},
    {title:'مختبر مصغّر: أضف خلايا على التوازي',widget:(el,B)=>DCML.lab(el,B,{intro:'كل خلية \\(E=1.5\\ V\\) و\\(r=2\\ \\Omega\\) (أرقام مثال 2-1). غيّر عدد الخلايا n ومقاومة الحمل R (أرقام تختارها أنت).',
 predict:{q:'الحمل كبير (\\(R=200\\ \\Omega\\)). زدنا الخلايا على التوازي من <span class="ltr">1</span> إلى <span class="ltr">8</span>. التيار:',opts:[
  ['يصبح ثمانية أضعاف',false,'هذا يحدث فقط إذا كان الحمل صغيراً جداً مقارنة بـ \\(r/n\\).'],
  ['يقل',false,'المقاومة الداخلية تقل فلا يقل التيار.'],
  ['يبقى تقريباً \\(E/R\\)',true,'الجهد يبقى E، والمقاومة الداخلية صغيرة أصلاً مقارنة بالحمل؛ «أي لا فائدة تعود من هذه التوصيلة بهذا الوضع».']]},
 ins:[{k:'n',l:'عدد الخلايا n',min:1,max:8,step:1,v:4},{k:'R',l:'مقاومة الحمل R',seg:[[0.1,'0.1 Ω'],[2,'2 Ω'],[20,'20 Ω'],[200,'200 Ω']],v:2}],
 calc:(s,P,B)=>{const E=1.5,r=2,I=n=>E/(s.R+r/n),i=I(s.n),i1=I(1);const pts=[1,2,3,4,5,6,7,8].map(n=>[n,I(n)]);const ym=Math.max(...pts.map(p=>p[1]))*1.15;
  return {facts:[['الجهد E',DCML.fm(B,E)+' V'],['المقاومة الداخلية r/n',DCML.fm(B,B.round(r/s.n,3))+' Ω'],['التيار I',DCML.fm(B,B.round(i,4))+' A','hi'],['التيار ÷ تيار خلية واحدة',DCML.fm(B,B.round(i/i1,2))]],
   plot:{xr:[1,8],yr:[0,ym],xl:'n',yl:'I (A)',xt:[1,2,3,4,5,6,7,8],curves:[{pts}],dots:pts.map(p=>[p[0],p[1]]),cur:[s.n,i]},
   msg:s.R<=0.1?'الحمل صغير جداً: التيار يكاد يتضاعف مع n، أي \\(I\\approx n(E/r)\\). هنا يفيد التوازي.':s.R>=200?'الحمل كبير: التيار يبقى تقريباً \\(E/R\\)؛ التوازي لا يفيد هنا.':'الحالة الوسطى: التيار يزيد مع n لكن أقل من n مرة.'}}})}
   ]},

  {st:4,short:'(ج) المركب',title:'(ج) التجميع المركب',ref:'ص 36–37',
   q:'عندك عدد ثابت من الخلايا: كم تضع في كل خط، وكم خطاً تجعل، لتحصل على أكبر تيار؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="تجميع مركب: عدة خطوط على التوازي، في كل خط خلايا على التوالي" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><line x1="50" y1="70" x2="50" y2="210" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><line x1="310" y1="70" x2="310" y2="210" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><line x1="50" y1="80" x2="70" y2="80" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="70" y1="80" x2="79" y2="80" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="79" y1="69" x2="79" y2="91" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="butt"/><line x1="87" y1="74.5" x2="87" y2="85.5" stroke="#2C4A40" stroke-width="5" stroke-linecap="butt"/><line x1="87" y1="80" x2="91" y2="80" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><polyline points="91,80 93.0833,84 97.25,76 101.417,84 105.583,76 109.75,84 113.917,76 116,80" fill="none" stroke="#2C4A40" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/><line x1="116" y1="80" x2="122" y2="80" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="122" y1="80" x2="131" y2="80" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="131" y1="69" x2="131" y2="91" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="butt"/><line x1="139" y1="74.5" x2="139" y2="85.5" stroke="#2C4A40" stroke-width="5" stroke-linecap="butt"/><line x1="139" y1="80" x2="143" y2="80" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><polyline points="143,80 145.083,84 149.25,76 153.417,84 157.583,76 161.75,84 165.917,76 168,80" fill="none" stroke="#2C4A40" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/><line x1="168" y1="80" x2="174" y2="80" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="174" y1="80" x2="183" y2="80" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="183" y1="69" x2="183" y2="91" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="butt"/><line x1="191" y1="74.5" x2="191" y2="85.5" stroke="#2C4A40" stroke-width="5" stroke-linecap="butt"/><line x1="191" y1="80" x2="195" y2="80" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><polyline points="195,80 197.083,84 201.25,76 205.417,84 209.583,76 213.75,84 217.917,76 220,80" fill="none" stroke="#2C4A40" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/><line x1="220" y1="80" x2="226" y2="80" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><text x="242" y="85" text-anchor="middle" font-size="18" fill="#2C4A40" font-weight="700" direction="ltr">…</text><line x1="226" y1="80" x2="232" y2="80" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="254" y1="80" x2="310" y2="80" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="50" y1="140" x2="70" y2="140" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="70" y1="140" x2="79" y2="140" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="79" y1="129" x2="79" y2="151" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="butt"/><line x1="87" y1="134.5" x2="87" y2="145.5" stroke="#2C4A40" stroke-width="5" stroke-linecap="butt"/><line x1="87" y1="140" x2="91" y2="140" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><polyline points="91,140 93.0833,144 97.25,136 101.417,144 105.583,136 109.75,144 113.917,136 116,140" fill="none" stroke="#2C4A40" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/><line x1="116" y1="140" x2="122" y2="140" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="122" y1="140" x2="131" y2="140" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="131" y1="129" x2="131" y2="151" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="butt"/><line x1="139" y1="134.5" x2="139" y2="145.5" stroke="#2C4A40" stroke-width="5" stroke-linecap="butt"/><line x1="139" y1="140" x2="143" y2="140" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><polyline points="143,140 145.083,144 149.25,136 153.417,144 157.583,136 161.75,144 165.917,136 168,140" fill="none" stroke="#2C4A40" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/><line x1="168" y1="140" x2="174" y2="140" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="174" y1="140" x2="183" y2="140" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="183" y1="129" x2="183" y2="151" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="butt"/><line x1="191" y1="134.5" x2="191" y2="145.5" stroke="#2C4A40" stroke-width="5" stroke-linecap="butt"/><line x1="191" y1="140" x2="195" y2="140" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><polyline points="195,140 197.083,144 201.25,136 205.417,144 209.583,136 213.75,144 217.917,136 220,140" fill="none" stroke="#2C4A40" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/><line x1="220" y1="140" x2="226" y2="140" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><text x="242" y="145" text-anchor="middle" font-size="18" fill="#2C4A40" font-weight="700" direction="ltr">…</text><line x1="226" y1="140" x2="232" y2="140" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="254" y1="140" x2="310" y2="140" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><text x="180" y="182" text-anchor="middle" font-size="22" fill="#2C4A40" font-weight="700" direction="ltr">⋮</text><g data-tip="الخط الواحد: ⟦n⟧ خلية على التوالي، جهده ⟦nE⟧ ومقاومته ⟦nr⟧."><rect x="50" y="62" width="260" height="36" fill="transparent"/><text x="282" y="72" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="rtl">n خلية</text></g><g data-tip="عدد الخطوط على التوازي ⟦m⟧؛ المقاومة الداخلية للبطارية ⟦nr/m⟧."><text x="30" y="145" text-anchor="middle" font-size="15" fill="#E8735A" font-weight="700" direction="ltr">m</text><line x1="30" y1="84.8" x2="30" y2="123.2" stroke="#E8735A" stroke-width="2" stroke-linecap="round"/><polygon points="30.0,128.0 26.7,122.0 33.3,122.0" fill="#E8735A"/><polygon points="30.0,80.0 33.3,86.0 26.7,86.0" fill="#E8735A"/></g><g data-tip="مقاومة الحمل ⟦R⟧."><line x1="50" y1="210" x2="130" y2="210" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><polyline points="130,210 135,218 145,202 155,218 165,202 175,218 185,202 195,218 205,202 215,218 225,202 230,210" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><line x1="230" y1="210" x2="310" y2="210" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><text x="180" y="240" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" direction="ltr">R</text></g><g data-tip="شرط أعلى تيار: المقاومة الخارجية = المقاومة الداخلية للبطارية، والجودة عندها ⟦50%⟧."><rect x="70" y="258" width="220" height="36" rx="12" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><text x="180" y="282" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700" direction="ltr">mR = nr</text></g></svg>`,
   cap:'m خطاً على التوازي، في كل خط n خلية على التوالي، تغذي حملاً R.<br><b>مرّر المؤشر على الخط والحرف m والحمل والشرط (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'متى يكون تيار التجميع المركب أكبر ما يمكن؟',opts:[
     ['عندما تكون مقاومة الحمل صفراً',false,'الشرط في الكتاب مساواة بين المقاومتين، لا حمل صفري.'],
     [String.raw`عندما \(m\times R=n\times r\)، أي المقاومة الخارجية = المقاومة الداخلية للبطارية`,true,'نص الكتاب: «أي أن المقاومة الخارجية = المقاومة الداخلية للبطارية».'],
     ['عندما تكون كل الخلايا على التوالي',false,'التوالي وحده ليس الأفضل دائماً؛ يعتمد على مقاومة الحمل.']]}}
   ],
   body:[
    {book:String.raw`<p>إذا كان عدد الخلايا الموصلة على التوالي في كل خط n خلية، وكان عدد الخطوط الموصلة على التوازي m خطاً، فتكون</p>
     <ul><li>المقاومة الداخلية لخلايا الخط الواحد = \(n\times r\) أوم،</li></ul>
     <p>وتكون:</p>
     <ul><li>المقاومة الكلية لعدد m خطاً = \(n\times r/m\) أوم.</li><li>المقاومة الكلية بالدائرة = \(R+(n\,r/m)\).</li><li>جهد البطارية = جهد الخط الواحد = \(E\,n\) فولت.</li></ul>
     <p>تيار البطارية:</p>
     <div class="eq" style="position:relative;overflow-x:auto">$$I=\frac{n\times E}{R+\dfrac{n\times r}{m}}=\frac{m\times n\,E}{m\times R+n\,r}=\frac{N\times E}{m\times R+n\times r}$$<span></span></div>
     <p>حيث العدد الكلي للخلايا N هو:</p>
     <div class="eq" style="position:relative;overflow-x:auto">$$N=m\times n$$<span></span></div>
     <p>والقيمة القصوى للتيار تكون عندما يصير المقام \((m\times R+n\times r)\) أقل ما يمكن، وبفرض أن:</p>
     <div class="eq" style="position:relative;overflow-x:auto">$$y=m\times R+n\times r=\left(\sqrt{m\times R}\right)^2+\left(\sqrt{n\times r}\right)^2$$<span></span></div>
     <div class="eq" style="position:relative;overflow-x:auto">$$=\left(\sqrt{m\times R}-\sqrt{n\times r}\right)^2+2\sqrt{m\times R}\,\sqrt{n\,r}$$<span></span></div>
     <p>ويكون هذا المقدار أقل ما يمكن عندما يكون المقدار الذي بين القوسين أقل ما يمكن، أي أن:</p>
     <div class="eq" style="position:relative;overflow-x:auto">$$m\times R=n\times r$$<span></span></div>
     <p>أي أن <b>المقاومة الخارجية = المقاومة الداخلية للبطارية</b>.</p>
     <p>وتكون الجودة (الكفاءة) في هذه الحالة <b>٥٠٪</b>، ويعني هذا أن نصف القدرة المعطاة من البطارية يستنفد في الحمل الخارجي والنصف الآخر يستنفد في المقاومة الداخلية للبطارية.</p>
     <p>ويلاحظ أنه يمكن حساب التكوين الذي يعطي أعلى تيار من المعادلتين:</p>
     <div class="eq" style="position:relative;overflow-x:auto">$$m\times n=N,\qquad m\times R=n\times r$$<span></span></div>
     <p>جودة المجموعة المركبة η يمكن حسابها كالآتي:</p>
     <div class="eq" style="position:relative;overflow-x:auto">$$\eta=\frac{\text{output}}{\text{input}}=\frac{\text{useful power}}{\text{total power produced}}$$<span></span></div>
     <div class="eq" style="position:relative;overflow-x:auto">$$\eta=\frac{I^2R}{I^2R+I^2r}=\frac{R}{R+r}$$<span></span></div>
     <p>حيث r هي المقاومة الداخلية الكلية للبطارية و R هي مقاومة الحمل.</p>`,ref:'ص 36–37'},
    {tip:String.raw`<p>الحيلة في الكتاب: المقدار بين القوسين مربّع، فأصغر قيمة له صفر، وذلك عندما \(\sqrt{mR}=\sqrt{nr}\). عندها يصغر المقام ويكبر التيار.</p>
     <p>وبكلمات عملية: حمل كبير المقاومة ← خلايا أكثر على التوالي (n كبير)؛ حمل صغير المقاومة ← خطوط أكثر على التوازي (m كبير). وأفضل تشكيل يجعل \(nr/m=R\).</p>`,title:'لماذا هذا الشرط؟'},
    {watch:String.raw`<p>في معادلة الجودة \(\eta=R/(R+r)\) الحرف r هو المقاومة الداخلية <b>الكلية</b> للبطارية (\(nr/m\) في التجميع المركب)، وليس مقاومة خلية واحدة.</p>`},
    {title:'مختبر مصغّر: ابحث عن أفضل تشكيل',widget:(el,B)=>DCML.lab(el,B,{intro:'<span class="ltr">12</span> خلية، كل منها \\(E=1.5\\ V\\) و\\(r=1\\ \\Omega\\) (أرقام نختارها للتجربة). اختر عدد الخطوط m (و\\(n=12/m\\) في كل خط) ومقاومة الحمل R.',
 predict:{q:'الحمل كبير المقاومة. الأفضل لأكبر تيار أن نجعل:',opts:[
  ['خطوطاً كثيرة على التوازي (m كبير)',false,'هذا يناسب الحمل الصغير المقاومة.'],
  ['خلايا كثيرة على التوالي في كل خط (n كبير)',true,'المقاومة الداخلية \\(nr/m\\) تكبر حتى تقترب من R الكبيرة: الشرط \\(mR=nr\\).'],
  ['لا فرق بين التشكيلات',false,'التيار يتغير كثيراً مع التشكيل؛ جرّب.']]},
 ins:[{k:'m',l:'عدد الخطوط m',seg:[[1,'1 × 12'],[2,'2 × 6'],[3,'3 × 4'],[4,'4 × 3'],[6,'6 × 2'],[12,'12 × 1']],v:3},{k:'R',l:'مقاومة الحمل R',seg:[[0.25,'0.25 Ω'],[1,'1 Ω'],[3,'3 Ω'],[12,'12 Ω']],v:1}],
 calc:(s,P,B)=>{const E=1.5,r=1,N=12,I=m=>{const n=N/m;return n*E/(s.R+n*r/m)};const n=N/s.m,ri=n*r/s.m,i=I(s.m),best=Math.max(...[1,2,3,4,6,12].map(I));
  return {facts:[['خلايا كل خط n',String(n)],['المقاومة الداخلية '+((x)=>'<bdi class="ltr">'+x+'</bdi>')('nr/m'),DCML.fm(B,B.round(ri,3))+' Ω',Math.abs(ri-s.R)<1e-9?'hi':''],['التيار I',DCML.fm(B,B.round(i,3))+' A','hi'],['الجودة '+((x)=>'<bdi class="ltr">'+x+'</bdi>')('R ÷ (R + nr/m)'),DCML.fm(B,B.round(100*s.R/(s.R+ri),1))+' %']],
   bars:[{l:'التيار مقارنة بأفضل تشكيل لهذا الحمل',v:B.round(i,3),max:best,u:'A',col:Math.abs(i-best)<1e-9?'--on':'--blue'}],
   msg:Math.abs(i-best)<1e-9?(Math.abs(ri-s.R)<1e-9?'أكبر تيار: المقاومة الداخلية = مقاومة الحمل \\((mR=nr)\\)، والجودة <span class="ltr">50%</span>.':'أكبر تيار بين التشكيلات الممكنة: المقاومة الداخلية أقرب ما تكون إلى الحمل.'):'جرّب تشكيلاً تقترب فيه \\(nr/m\\) من R.'}}})}
   ]},

  {st:5,short:'مثال (2-1)',title:'مثال <span class="ltr">(2-1)</span>: أربع خلايا بثلاث طرق',ref:'ص 37–39',
   q:'الخلايا الأربع نفسها والحمل نفسه: أي طريقة توصيل تعطي أكبر تيار؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الشكل 2-4: أربع خلايا 1.5 فولت و2 أوم بثلاث طرق، والحمل 2 أوم" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><text x="180" y="40" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">توصيل توالي</text><line x1="80" y1="62" x2="90" y2="62" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><line x1="90" y1="62" x2="99" y2="62" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="99" y1="51" x2="99" y2="73" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="butt"/><line x1="107" y1="56.5" x2="107" y2="67.5" stroke="#2C4A40" stroke-width="5" stroke-linecap="butt"/><line x1="107" y1="62" x2="111" y2="62" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><polyline points="111,62 112.083,66 114.25,58 116.417,66 118.583,58 120.75,66 122.917,58 124,62" fill="none" stroke="#2C4A40" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/><line x1="124" y1="62" x2="130" y2="62" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="130" y1="62" x2="139" y2="62" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="139" y1="51" x2="139" y2="73" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="butt"/><line x1="147" y1="56.5" x2="147" y2="67.5" stroke="#2C4A40" stroke-width="5" stroke-linecap="butt"/><line x1="147" y1="62" x2="151" y2="62" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><polyline points="151,62 152.083,66 154.25,58 156.417,66 158.583,58 160.75,66 162.917,58 164,62" fill="none" stroke="#2C4A40" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/><line x1="164" y1="62" x2="170" y2="62" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="170" y1="62" x2="179" y2="62" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="179" y1="51" x2="179" y2="73" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="butt"/><line x1="187" y1="56.5" x2="187" y2="67.5" stroke="#2C4A40" stroke-width="5" stroke-linecap="butt"/><line x1="187" y1="62" x2="191" y2="62" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><polyline points="191,62 192.083,66 194.25,58 196.417,66 198.583,58 200.75,66 202.917,58 204,62" fill="none" stroke="#2C4A40" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/><line x1="204" y1="62" x2="210" y2="62" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="210" y1="62" x2="219" y2="62" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="219" y1="51" x2="219" y2="73" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="butt"/><line x1="227" y1="56.5" x2="227" y2="67.5" stroke="#2C4A40" stroke-width="5" stroke-linecap="butt"/><line x1="227" y1="62" x2="231" y2="62" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><polyline points="231,62 232.083,66 234.25,58 236.417,66 238.583,58 240.75,66 242.917,58 244,62" fill="none" stroke="#2C4A40" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/><line x1="244" y1="62" x2="250" y2="62" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="250" y1="62" x2="270" y2="62" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><line x1="80" y1="62" x2="80" y2="100" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><line x1="270" y1="62" x2="270" y2="100" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><line x1="80" y1="100" x2="150" y2="100" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><polyline points="150,100 153.125,105 159.375,95 165.625,105 171.875,95 178.125,105 184.375,95 190.625,105 196.875,95 200,100" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/><line x1="200" y1="100" x2="270" y2="100" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><g data-tip="التوالي: ⟦E = 6 V⟧، المقاومة الداخلية ⟦8 Ω⟧، التيار ⟦0.6 A⟧."><rect x="76" y="50" width="198" height="56" fill="transparent"/></g><text x="300" y="82" text-anchor="middle" font-size="12.5" fill="#E8735A" font-weight="700" direction="ltr">0.6 A</text><text x="265" y="138" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">توصيل توازي</text><line x1="210" y1="150" x2="210" y2="240" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><line x1="320" y1="150" x2="320" y2="240" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><line x1="210" y1="154" x2="240" y2="154" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><line x1="240" y1="154" x2="249" y2="154" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="249" y1="143" x2="249" y2="165" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="butt"/><line x1="257" y1="148.5" x2="257" y2="159.5" stroke="#2C4A40" stroke-width="5" stroke-linecap="butt"/><line x1="257" y1="154" x2="261" y2="154" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><polyline points="261,154 262.583,158 265.75,150 268.917,158 272.083,150 275.25,158 278.417,150 280,154" fill="none" stroke="#2C4A40" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/><line x1="280" y1="154" x2="320" y2="154" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><line x1="210" y1="176" x2="240" y2="176" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><line x1="240" y1="176" x2="249" y2="176" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="249" y1="165" x2="249" y2="187" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="butt"/><line x1="257" y1="170.5" x2="257" y2="181.5" stroke="#2C4A40" stroke-width="5" stroke-linecap="butt"/><line x1="257" y1="176" x2="261" y2="176" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><polyline points="261,176 262.583,180 265.75,172 268.917,180 272.083,172 275.25,180 278.417,172 280,176" fill="none" stroke="#2C4A40" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/><line x1="280" y1="176" x2="320" y2="176" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><line x1="210" y1="198" x2="240" y2="198" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><line x1="240" y1="198" x2="249" y2="198" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="249" y1="187" x2="249" y2="209" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="butt"/><line x1="257" y1="192.5" x2="257" y2="203.5" stroke="#2C4A40" stroke-width="5" stroke-linecap="butt"/><line x1="257" y1="198" x2="261" y2="198" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><polyline points="261,198 262.583,202 265.75,194 268.917,202 272.083,194 275.25,202 278.417,194 280,198" fill="none" stroke="#2C4A40" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/><line x1="280" y1="198" x2="320" y2="198" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><line x1="210" y1="220" x2="240" y2="220" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><line x1="240" y1="220" x2="249" y2="220" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="249" y1="209" x2="249" y2="231" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="butt"/><line x1="257" y1="214.5" x2="257" y2="225.5" stroke="#2C4A40" stroke-width="5" stroke-linecap="butt"/><line x1="257" y1="220" x2="261" y2="220" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><polyline points="261,220 262.583,224 265.75,216 268.917,224 272.083,216 275.25,224 278.417,216 280,220" fill="none" stroke="#2C4A40" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/><line x1="280" y1="220" x2="320" y2="220" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><line x1="210" y1="240" x2="240" y2="240" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><polyline points="240,240 243.125,245 249.375,235 255.625,245 261.875,235 268.125,245 274.375,235 280.625,245 286.875,235 290,240" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/><line x1="290" y1="240" x2="320" y2="240" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><g data-tip="التوازي: ⟦E = 1.5 V⟧، المقاومة الداخلية ⟦0.5 Ω⟧، التيار ⟦0.6 A⟧."><rect x="206" y="146" width="118" height="100" fill="transparent"/></g><text x="265" y="266" text-anchor="middle" font-size="12.5" fill="#E8735A" font-weight="700" direction="ltr">0.6 A</text><text x="95" y="138" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">توصيل مركب</text><line x1="40" y1="150" x2="40" y2="240" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><line x1="150" y1="150" x2="150" y2="240" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><line x1="40" y1="165" x2="48" y2="165" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><line x1="48" y1="165" x2="57" y2="165" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="57" y1="154" x2="57" y2="176" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="butt"/><line x1="65" y1="159.5" x2="65" y2="170.5" stroke="#2C4A40" stroke-width="5" stroke-linecap="butt"/><line x1="65" y1="165" x2="69" y2="165" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><polyline points="69,165 70.5833,169 73.75,161 76.9167,169 80.0833,161 83.25,169 86.4167,161 88,165" fill="none" stroke="#2C4A40" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/><line x1="88" y1="165" x2="94" y2="165" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="94" y1="165" x2="103" y2="165" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="103" y1="154" x2="103" y2="176" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="butt"/><line x1="111" y1="159.5" x2="111" y2="170.5" stroke="#2C4A40" stroke-width="5" stroke-linecap="butt"/><line x1="111" y1="165" x2="115" y2="165" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><polyline points="115,165 116.583,169 119.75,161 122.917,169 126.083,161 129.25,169 132.417,161 134,165" fill="none" stroke="#2C4A40" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/><line x1="134" y1="165" x2="140" y2="165" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="140" y1="165" x2="150" y2="165" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><line x1="40" y1="205" x2="48" y2="205" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><line x1="48" y1="205" x2="57" y2="205" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="57" y1="194" x2="57" y2="216" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="butt"/><line x1="65" y1="199.5" x2="65" y2="210.5" stroke="#2C4A40" stroke-width="5" stroke-linecap="butt"/><line x1="65" y1="205" x2="69" y2="205" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><polyline points="69,205 70.5833,209 73.75,201 76.9167,209 80.0833,201 83.25,209 86.4167,201 88,205" fill="none" stroke="#2C4A40" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/><line x1="88" y1="205" x2="94" y2="205" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="94" y1="205" x2="103" y2="205" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="103" y1="194" x2="103" y2="216" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="butt"/><line x1="111" y1="199.5" x2="111" y2="210.5" stroke="#2C4A40" stroke-width="5" stroke-linecap="butt"/><line x1="111" y1="205" x2="115" y2="205" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><polyline points="115,205 116.583,209 119.75,201 122.917,209 126.083,201 129.25,209 132.417,201 134,205" fill="none" stroke="#2C4A40" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/><line x1="134" y1="205" x2="140" y2="205" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="140" y1="205" x2="150" y2="205" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><line x1="40" y1="240" x2="70" y2="240" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><polyline points="70,240 73.125,245 79.375,235 85.625,245 91.875,235 98.125,245 104.375,235 110.625,245 116.875,235 120,240" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/><line x1="120" y1="240" x2="150" y2="240" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><g data-tip="المركب (صفان، بكل صف خليتان على التوالي): ⟦E = 3 V⟧، المقاومة الداخلية ⟦2 Ω⟧، التيار ⟦0.75 A⟧."><rect x="36" y="146" width="118" height="100" fill="transparent"/></g><text x="95" y="266" text-anchor="middle" font-size="12.5" fill="#E8735A" font-weight="700" direction="ltr">0.75 A</text><text x="230" y="298" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="600" direction="rtl">كل خلية 1.5V و 2Ω</text><text x="100" y="298" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="600" direction="rtl">الحمل 2Ω</text></svg>`,
   cap:'رسم الشكل <span class="ltr">(2-4)</span>: توالي في الأعلى، ومركب وتوازٍ في الأسفل، مع تيار كل دائرة من حل الكتاب.<br><b>مرّر المؤشر على كل دائرة (أو المسها في الجوال) لتعرف نتائجها.</b>',
   side:[
    {predict:{q:'أي طريقة توصيل للأعمدة الأربعة تعطي أكبر تيار في الحمل <span class="ltr">2Ω</span>؟',opts:[
     ['التوالي',false,String.raw`التوالي يعطي \(6/(8+2)=0.6\ \text{A}\).`],
     ['التوازي',false,String.raw`التوازي يعطي \(1.5/(0.5+2)=0.6\ \text{A}\).`],
     ['المركب: صفان بكل صف خليتان',true,String.raw`المركب يعطي \(3/(2+2)=0.75\ \text{A}\)، لأن المقاومة الداخلية (2 Ω) تساوي الحمل (2 Ω).`]]}}
   ],
   body:[
    {book:String.raw`<p>أربعة أعمدة، القوة الدافعة للعمود الواحد <span class="ltr">1.5V</span> والمقاومة الداخلية <span class="ltr">2Ω</span> للعمود الواحد، تغذي مقاومة خارجية قدرها <span class="ltr">2Ω</span> الشكل (2-4). احسب التيار المار إذا كانت الخلايا موصلة.</p>
     <p>أ- على التوالي</p><p>ب- على التوازي</p><p>ج- على هيئة صفين (فرعين) متوازيين، بكل صف خليتان على التوالي.</p>`,ref:'ص 37'},
    {title:'غيّر طريقة التوصيل (بأرقام المثال)',widget:(el,B)=>{
      const D={s:['توالي','E = 1.5 × 4 = 6 V','r = 2 × 4 = 8 Ω','I = 6/(8 + 2) = 0.6 A',0.6],p:['توازي','E = 1.5 V','r = 2/4 = 0.5 Ω','I = 1.5/(0.5 + 2) = 0.6 A',0.6],m:['مركب (2 × 2)','E = 1.5 × 2 = 3 V','r = 4/2 = 2 Ω','I = 3/(2 + 2) = 0.75 A',0.75]};let k='s';
      const draw=()=>{const d=D[k];el.innerHTML=`<div class="w-row" style="margin-top:0"><span class="mseg">${Object.keys(D).map(v=>`<button type="button" data-k="${v}" aria-pressed="${v===k}" style="font-family:var(--font)">${D[v][0]}</button>`).join('')}</span></div>
        <div class="w-facts" style="grid-template-columns:repeat(3,minmax(0,1fr))"><div><span>جهد البطارية</span><b style="font-size:14px">${d[1]}</b></div><div><span>المقاومة الداخلية</span><b style="font-size:14px">${d[2]}</b></div><div><span>التيار (الحمل 2 Ω)</span><b style="font-size:14px">${d[3]}</b></div></div>
        <div style="background:var(--surface-2);border-radius:8px;margin-top:10px;height:14px;overflow:hidden"><div style="height:100%;width:${d[4]/0.75*100}%;background:${d[4]===0.75?'var(--on)':'var(--blue)'}"></div></div>
        <p class="sub" style="margin:8px 0 0">${k==='m'?'المقاومة الداخلية (2 Ω) = مقاومة الحمل (2 Ω): هذا شرط أعلى تيار.':'المقاومة الداخلية لا تساوي مقاومة الحمل هنا.'}</p>`;
        el.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{k=b.dataset.k;draw()})};draw();
    }},
    {watch:String.raw`<p>طُبع في نص المثال «بكل صف خليتان <b>متوازيتان</b>»، والحل والشكل يعاملان الخليتين في كل صف <b>على التوالي</b>، وهكذا كتبناها أعلاه. وفي الحل طُبع <span class="ltr">«1/4 + 1/4 = 2Ω»</span>، والصحيح \(1/r=1/4+1/4=0.5\) فتكون \(r=2\ \Omega\) (النتيجة صحيحة). ورقّم الكتاب هذا المثال «(3-1)»، والصحيح <span class="ltr">(2-1)</span>.</p>`,fix:true},
    {tip:String.raw`<p>تحقق من الشرط: \(m\times R=2\times2=4\) و\(n\times r=2\times2=4\). الشرط متحقق، لذلك أعطى المركب أكبر تيار.</p>`}
   ]},

  {st:6,short:'تمرينا 1 و 2',title:'تمرينا الوحدة الثانية <span class="ltr">1</span> و <span class="ltr">2</span>',ref:'ص 42',
   q:'حلّهما بنفسك: الجهد، ثم المقاومة الداخلية، ثم التيار.',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="تمرين 2: عشرون خلية في أربعة أفرع على التوازي، بكل فرع خمس خلايا، والحمل 10 أوم" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E2ECF3"/><line x1="60" y1="70" x2="60" y2="220" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><line x1="300" y1="70" x2="300" y2="220" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><g data-tip="أربعة أفرع على التوازي، بكل فرع خمس خلايا على التوالي؛ كل خلية ⟦2 V⟧ و⟦1.5 Ω⟧."><line x1="70" y1="80" x2="280" y2="80" stroke="#2C4A40" stroke-width="1.6" stroke-linecap="round"/><rect x="94" y="70" width="12" height="20" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><rect x="134" y="70" width="12" height="20" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><rect x="174" y="70" width="12" height="20" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><rect x="214" y="70" width="12" height="20" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><rect x="254" y="70" width="12" height="20" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><line x1="70" y1="120" x2="280" y2="120" stroke="#2C4A40" stroke-width="1.6" stroke-linecap="round"/><rect x="94" y="110" width="12" height="20" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><rect x="134" y="110" width="12" height="20" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><rect x="174" y="110" width="12" height="20" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><rect x="214" y="110" width="12" height="20" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><rect x="254" y="110" width="12" height="20" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><line x1="70" y1="160" x2="280" y2="160" stroke="#2C4A40" stroke-width="1.6" stroke-linecap="round"/><rect x="94" y="150" width="12" height="20" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><rect x="134" y="150" width="12" height="20" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><rect x="174" y="150" width="12" height="20" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><rect x="214" y="150" width="12" height="20" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><rect x="254" y="150" width="12" height="20" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><line x1="70" y1="200" x2="280" y2="200" stroke="#2C4A40" stroke-width="1.6" stroke-linecap="round"/><rect x="94" y="190" width="12" height="20" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><rect x="134" y="190" width="12" height="20" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><rect x="174" y="190" width="12" height="20" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><rect x="214" y="190" width="12" height="20" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><rect x="254" y="190" width="12" height="20" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><rect x="60" y="66" width="240" height="130" fill="transparent"/></g><line x1="70" y1="80" x2="60" y2="80" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><line x1="70" y1="120" x2="60" y2="120" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><line x1="70" y1="160" x2="60" y2="160" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><line x1="70" y1="200" x2="60" y2="200" stroke="#2C4A40" stroke-width="2" stroke-linecap="round"/><line x1="280" y1="80" x2="300" y2="80" stroke="#2C4A40" stroke-width="1.6" stroke-linecap="round"/><line x1="280" y1="120" x2="300" y2="120" stroke="#2C4A40" stroke-width="1.6" stroke-linecap="round"/><line x1="280" y1="160" x2="300" y2="160" stroke="#2C4A40" stroke-width="1.6" stroke-linecap="round"/><line x1="280" y1="200" x2="300" y2="200" stroke="#2C4A40" stroke-width="1.6" stroke-linecap="round"/><text x="180" y="52" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="rtl">كل خلية 2V و 1.5Ω</text><g data-tip="الحمل ⟦10 Ω⟧ (الجزء و من التمرين)."><line x1="60" y1="220" x2="60" y2="248" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><line x1="300" y1="220" x2="300" y2="248" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><line x1="60" y1="248" x2="130" y2="248" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/><polyline points="130,248 135,256 145,240 155,256 165,240 175,256 185,240 195,256 205,240 215,256 225,240 230,248" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><line x1="230" y1="248" x2="300" y2="248" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round"/></g><text x="180" y="280" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="ltr">10Ω</text><text x="36" y="145" text-anchor="middle" font-size="15" fill="#E8735A" font-weight="700" direction="ltr">4</text><text x="180" y="232" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="600" direction="rtl">5 خلايا في كل فرع</text></svg>`,
   cap:'دائرة تمرين 2: أربعة أفرع على التوازي، بكل فرع خمس خلايا على التوالي.<br><b>مرّر المؤشر على الخلايا والحمل (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'تمرين 2: ما الجهد الكلي على طرفي الدائرة (أربعة أفرع، بكل فرع خمس خلايا 2 V)؟',opts:[
     [String.raw`<span class="ltr">40 V</span>`,false,'هذا جهد عشرين خلية على التوالي؛ والأفرع هنا على التوازي.'],
     [String.raw`<span class="ltr">10 V</span>`,true,String.raw`جهد الفرع \(5\times2=10\ \text{V}\)، والأفرع على التوازي فالجهد الكلي جهد فرع واحد.`],
     [String.raw`<span class="ltr">2 V</span>`,false,'هذا جهد خلية واحدة.']]}}
   ],
   body:[
    {book:String.raw`<ol><li>ثمانية خلايا، القوة الدافعة للخلية الواحدة <span class="ltr">1.5V</span> والمقاومة الداخلية لها <span class="ltr">1.0Ω</span>، تغذي مقاومة خارجية قدرها <span class="ltr">4Ω</span>، احسب التيار المسحوب إذا كانت الخلايا موصلة: أ- على التوالي ب- على التوازي ج- على هيئة فرعين متوازيين، بكل فرع خليتان على التوالي.</li>
     <li>عشرون خلية، القوة الدافعة الكهربائية للخلية <span class="ltr">2V</span> والمقاومة الداخلية لها <span class="ltr">1.5Ω</span>، وصلت على أربعة أفرع على التوازي، بحيث يكون كل فرع يشتمل على خمسة خلايا على التوالي والمطلوب: أ- الجهد على طرفي كل فرع ب- الجهد الكلي على طرفي الدائرة ج- المقاومة لكل فرع د- المقاومة الكلية على طرفي الدائرة و- إذا وصلت على طرفي الدائرة حمل مقاومته <span class="ltr">10Ω</span> أوم فأحسب التيار المار في الحمل.</li></ol>`,ref:'ص 42'},
    {watch:String.raw`<p>تمرين 1 (ج): طُبع «بكل فرع خليتان <b>متوازيتان</b>» والمقصود على التوالي (كما في مثال 2-1). وفيه أيضاً «خليتان» مع أن الخلايا ثمانٍ؛ انظر الإجابة المقترحة.</p>`,fix:true},
    {tip:String.raw`<p class="sub" style="margin-top:0">الكتاب لا يعطي إجابات. اضغط على التمرين لترى إجابة مقترحة.</p>
     <details class="cx-q"><summary>تمرين 1</summary><div class="cx-ans">أ) \(E=12\ V\)، \(r=8\ \Omega\)، \(I=12/(8+4)=1\ A\). ب) \(E=1.5\ V\)، \(r=1/8=0.125\ \Omega\)، \(I=1.5/4.125\approx0.364\ A\). ج) نص التمرين «فرعين … بكل فرع خليتان» لا يستعمل إلا 4 خلايا من 8؛ <b>بافتراض فرعين بكل منهما أربع خلايا على التوالي</b> (كل الخلايا الثماني): \(E=6\ V\)، \(r=4/2=2\ \Omega\)، \(I=6/(2+4)=1\ A\). (ولو أخذنا النص حرفياً — فرعان × خليتان — لكان \(E=3\ V\)، \(r=1\ \Omega\)، \(I=3/5=0.6\ A\).)</div></details>
     <details class="cx-q"><summary>تمرين 2</summary><div class="cx-ans">أ) \(5\times2=10\ V\). ب) \(10\ V\) (الفروع على التوازي). ج) \(5\times1.5=7.5\ \Omega\). د) \(7.5/4=1.875\ \Omega\). و) \(I=10/(10+1.875)\approx0.842\ A\).</div></details>`,title:'إجابات مقترحة (ليست من الكتاب)'},
    {title:'مختبر مصغّر: تحقق من حل التمرين 2',widget:(el,B)=>DCML.cases(el,B,{intro:'عشرون خلية في أربعة أفرع على التوازي، بكل فرع خمس خلايا على التوالي.',cases:[
 {q:'المقاومة الكلية على طرفي الدائرة مقارنة بمقاومة الفرع الواحد:',opts:[['أربعة أضعافها',false,'هذا كان سيصح لو وُصلت الأفرع على التوالي.'],['ربعها',true,'أربعة أفرع متساوية على التوازي: \\(7.5/4=1.875\\ \\Omega\\).'],['تساويها',false,'كل فرع إضافي على التوازي يقلل المقاومة الكلية.']]},
 {q:'لو وصلنا الخلايا العشرين كلها على التوالي بدلاً من ذلك، يصبح الجهد الكلي:',opts:[['<span class="ltr">10 V</span>',false,'هذا جهد التشكيل الذي في التمرين (فرع واحد).'],['<span class="ltr">2 V</span>',false,'هذا جهد خلية واحدة.'],['<span class="ltr">40 V</span>',true,'\\(nE=20\\times2=40\\ V\\).']]}]})}
   ]},

  {recap:[
   String.raw`قانون أوم: \(R=V/I\) و\(V=I\times R\)، والمقاومة بالأوم Ω (ص 34) — الشكل (2-3).`,
   String.raw`التوالي: الجهد \(nE\) والمقاومة الداخلية \(nr\) و\(I=\frac{nE}{R+nr}\)؛ يفيد مع حمل كبير المقاومة (ص 35).`,
   String.raw`التوازي: الجهد \(E\) والمقاومة الداخلية \(r/n\) و\(I=\frac{E}{R+r/n}\)؛ يفيد مع حمل صغير جداً (ص 35–36).`,
   String.raw`المركب: \(I=\frac{NE}{mR+nr}\)، وأكبر تيار عندما \(mR=nr\) (المقاومة الخارجية = الداخلية) والجودة عندها <span class="ltr">50%</span>؛ \(\eta=\frac{R}{R+r}\) (ص 36–37).`,
   String.raw`مثال (2-1): الأعمدة الأربعة تعطي <span class="ltr">0.6 A</span> توالياً و<span class="ltr">0.6 A</span> توازياً و<span class="ltr">0.75 A</span> مركباً.`]}
],
 theory:[
  {h:'المقاومة وقانون أوم',ref:'ص 34',html:`<p>«إن التيار الكهربائي هو نتيجة تحرك شحنات كهربائية، وهذه الشحنات المتحركة تلقى معارضة للحركة نتيجة لتصادمها مع ذرات وأيونات الوسط الذي تتحرك فيه. ويطلق على هذه المعارضة <b>المقاومة</b> … ويرمز لها بالرمز R.» «وتعرف المقاومة بأنها خارج قسمة فرق الجهد المسلط بين طرفي المقاومة على شدة التيار المار فيه»:</p>
   $$R=\\frac{V}{I}\\qquad\\Rightarrow\\qquad V=I\\times R$$
   <p>«ووحدة المقاومة R هي Volt/Ampere ويطلق عليها <b>أوم (Ohm)</b> نسبة إلى العالم الألماني جورج سيمون أوم الذي يعتبر أول من لاحظ هذه العلاقة عام 1827م. ويرمز للأوم بالحرف (Ω).» الشكل (2-3) «يوضح اتجاه التيار I وكذلك فرق الجهد V عبر المقاومة R»، وسيأتي شرحه بالتفصيل في الوحدة الثالثة.</p>`},
  {fig:'(2-3)',ref:'ص 34',caption:'المقاومة R، وفرق الجهد V عليها (+ على الطرف الأيسر و − على الأيمن)، والتيار I يدخل من الطرف الموجب.',draw:()=>box(ohmSVG(),360)},
  {h:'تجميع الخلايا',ref:'ص 34',html:'<p>«وتجمع الخلايا في مجموعات موصلة على التوالي والتوازي لتكوين بطارية أو مراكم، ونلاحظ في هذه الحالة ما يلي»: نرمز لعدد الخلايا n، وجهد كل خلية E، ومقاومتها الداخلية r، ومقاومة الحمل R.</p>'},
  {h:'(أ) تجميع التوالي',ref:'ص 35',html:`<p>«يوصل القطب الموجب لكل بطارية بالقطب السالب للبطارية التي تليها ثم توصل مقاومة الحمل بين القطب السالب لأول بطارية والقطب الموجب لآخر بطارية.»</p>
   <ul><li>الجهد الكلي للبطارية = \\(nE\\) فولت</li><li>المقاومة الداخلية الكلية = \\(nr\\) أوم</li><li>المقاومة الكلية بالدائرة = \\(R+nr\\) أوم</li></ul>
   $$I=\\frac{n\\,E}{R+n\\,r}$$
   <p>«فإذا كانت \\(R\\ll nr\\)» يكون \\(I=E/r\\): «تيار الخلية الواحدة، وهو لا يزيد بتوصيل الخلايا على التوالي. أما إذا كانت \\(nr\\ll R\\)» فإن \\(I=n(E/R)\\): «التيار يزيد هنا بعدد n مرة … وعلى هذا الأساس فإن <b>تجميع التوالي يستعمل في حالة كون مقاومة الحمل كبيرة</b> بالنسبة للمقاومة الداخلية للبطارية.»</p>`},
  {h:'(ب) تجميع التوازي',ref:'ص 35–36',html:`<p>«وتوصل جميع الأقطاب الموجبة مع بعضها والأقطاب السالبة مع بعضها البعض، وبذلك يكون جهد البطارية E مساوياً لجهد الخلية الواحدة.» والمقاومة الداخلية لمجموعة من n خلية مقاومة كل منها r تكون \\(r/n\\) أوم، و«المقاومة الكلية بالدائرة» \\(R+r/n\\):</p>
   $$I=\\frac{E}{R+\\dfrac{r}{n}}$$
   <p>«فإذا كانت \\(r/n\\ll R\\)» فإن \\(I=E/R\\): «التيار مساوياً للتيار الناتج عن خلية واحدة. أي لا فائدة تعود من هذه التوصيلة بهذا الوضع. أما إذا كانت \\(R\\ll r/n\\) فإن \\(I=n(E/r)\\) … ولذا <b>نستعمل مجموعات التوازي إذا كانت مقاومة الحمل صغيرة جداً</b> بالنسبة لمقاومة البطارية.»</p>`},
  {h:'(ج) التجميع المركب',ref:'ص 36–37',html:`<p>«إذا كان عدد الخلايا الموصلة على التوالي في كل خط n خلية، وكان عدد الخطوط الموصلة على التوازي m خطاً»:</p>
   <ul><li>المقاومة الداخلية لخلايا الخط الواحد = \\(n r\\)، والمقاومة الكلية لعدد m خطاً = \\(nr/m\\) أوم.</li><li>المقاومة الكلية بالدائرة = \\(R+nr/m\\)، وجهد البطارية = جهد الخط الواحد = \\(nE\\) فولت.</li></ul>
   $$I=\\frac{nE}{R+\\dfrac{nr}{m}}=\\frac{m\\,n\\,E}{mR+nr}=\\frac{N\\,E}{mR+nr}\\qquad N=m\\times n$$
   <p>«والقيمة القصوى للتيار تكون عندما يصير المقام \\((mR+nr)\\) أقل ما يمكن»:</p>
   $$y=mR+nr=\\left(\\sqrt{mR}\\right)^2+\\left(\\sqrt{nr}\\right)^2=\\left(\\sqrt{mR}-\\sqrt{nr}\\right)^2+2\\sqrt{mR}\\,\\sqrt{nr}$$
   <p>«ويكون هذا المقدار أقل ما يمكن عندما يكون المقدار الذي بين القوسين أقل ما يمكن، أي أن» \\(mR=nr\\)، «أي أن <b>المقاومة الخارجية = المقاومة الداخلية للبطارية</b>» \\((R=nr/m)\\). «وتكون الجودة (الكفاءة) في هذه الحالة <b>50%</b>، ويعني هذا أن نصف القدرة المعطاة من البطارية يستنفد في الحمل الخارجي والنصف الآخر يستنفد في المقاومة الداخلية للبطارية.»</p>
   <p>«ويلاحظ أنه يمكن حساب التكوين الذي يعطي أعلى تيار من المعادلتين» \\(m\\times n=N\\) و \\(m\\times R=n\\times r\\). «جودة المجموعة المركبة η يمكن حسابها كالآتي»:</p>
   $$\\eta=\\frac{\\text{output}}{\\text{input}}=\\frac{I^2R}{I^2R+I^2r}=\\frac{R}{R+r}$$
   <p>«حيث r هي المقاومة الداخلية الكلية للبطارية و R هي مقاومة الحمل.»</p>`},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب:</b> القاعدة العملية: حمل كبير المقاومة ← خلايا أكثر على التوالي (نحتاج جهداً)؛ حمل صغير المقاومة ← صفوف أكثر على التوازي (نحتاج مقاومة داخلية أصغر). وأفضل تشكيل يجعل المقاومة الداخلية للبطارية تساوي مقاومة الحمل. في المختبر جدول بكل التشكيلات الممكنة لعدد الخلايا نفسه.'},
  {h:'مثال (2-1)',ref:'ص 37–39',html:`<p>«أربعة أعمدة، القوة الدافعة للعمود الواحد <span class="ltr">1.5V</span> والمقاومة الداخلية <span class="ltr">2Ω</span> للعمود الواحد، تغذي مقاومة خارجية قدرها <span class="ltr">2Ω</span> الشكل (2-4). احسب التيار المار إذا كانت الخلايا موصلة: أ- على التوالي ب- على التوازي ج- على هيئة صفين (فرعين) متوازيين، بكل صف خليتان على التوالي.»</p>
   <table class="tt"><thead><tr><th>التوصيل</th><th>E</th><th>r الداخلية</th><th>I</th></tr></thead><tbody><tr><td>أ- توالي</td><td>6 V</td><td>8 Ω</td><td>6/(8+2) = 0.6 A</td></tr><tr><td>ب- توازي</td><td>1.5 V</td><td>0.5 Ω</td><td>1.5/(0.5+2) = 0.6 A</td></tr><tr><td>ج- مركب 2 × 2</td><td>3 V</td><td>2 Ω</td><td>3/(2+2) = 0.75 A</td></tr></tbody></table>`},
  {fig:'(2-4)',ref:'ص 38',caption:'المثال (2-1): توصيل توالي (أربع خلايا 1.5V + 2Ω متتالية)، وتوصيل توازي (أربعة فروع)، وتوصيل مركب (فرعان بكل منهما خليتان)، والحمل 2Ω في كل دائرة.',draw:()=>`<div class="cx-figs">${[[4,1,'توصيل توالي'],[1,4,'توصيل توازي'],[2,2,'توصيل مركب']].map(([n,m,t])=>`<figure>${gridSVG({n,m,lblE:'1.5V',lblR:'2Ω',lblL:'2Ω',title:t})}</figure>`).join('')}</div>`},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب:</b> في (ج) تحقق شرط أعلى تيار: \\(mR=2\\times2=4\\) و \\(nr=2\\times2=4\\)، لذلك أعطى التجميع المركب أكبر تيار (0.75 A) من التوالي والتوازي (0.6 A).'},
  {h:'تمرينا الوحدة الثانية 1 و 2',ref:'ص 42',html:Qd('تمرين 1','ثمانية خلايا، القوة الدافعة للخلية الواحدة <span class="ltr">1.5V</span> والمقاومة الداخلية لها <span class="ltr">1.0Ω</span>، تغذي مقاومة خارجية قدرها <span class="ltr">4Ω</span>، احسب التيار المسحوب إذا كانت الخلايا موصلة: أ- على التوالي ب- على التوازي ج- على هيئة فرعين متوازيين، بكل فرع خليتان على التوالي.',
    'أ) \\(E=12\\ V\\)، \\(r=8\\ \\Omega\\)، \\(I=12/(8+4)=1\\ A\\). ب) \\(E=1.5\\ V\\)، \\(r=1/8=0.125\\ \\Omega\\)، \\(I=1.5/4.125\\approx0.364\\ A\\). ج) نص التمرين «فرعين … بكل فرع خليتان» لا يستعمل إلا 4 خلايا من 8؛ <b>بافتراض فرعين بكل منهما أربع خلايا على التوالي</b> (كل الخلايا الثماني): \\(E=6\\ V\\)، \\(r=4/2=2\\ \\Omega\\)، \\(I=6/(2+4)=1\\ A\\). (ولو أخذنا النص حرفياً — فرعان × خليتان — لكان \\(E=3\\ V\\)، \\(r=1\\ \\Omega\\)، \\(I=3/5=0.6\\ A\\).)')+
   Qd('تمرين 2','عشرون خلية، القوة الدافعة الكهربائية للخلية <span class="ltr">2V</span> والمقاومة الداخلية لها <span class="ltr">1.5Ω</span>، وصلت على أربعة أفرع على التوازي، بحيث يكون كل فرع يشتمل على خمسة خلايا على التوالي والمطلوب: أ- الجهد على طرفي كل فرع ب- الجهد الكلي على طرفي الدائرة ج- المقاومة لكل فرع د- المقاومة الكلية على طرفي الدائرة و- إذا وصلت على طرفي الدائرة حمل مقاومته <span class="ltr">10Ω</span> فأحسب التيار المار في الحمل.',
    'أ) \\(5\\times2=10\\ V\\). ب) \\(10\\ V\\) (الفروع على التوازي). ج) \\(5\\times1.5=7.5\\ \\Omega\\). د) \\(7.5/4=1.875\\ \\Omega\\). و) \\(I=10/(10+1.875)\\approx0.842\\ A\\).')},
  {err:'<span class="fixnote"><b>ملاحظات على الكتاب:</b> (1) ص 37–39: رقّم الكتاب أمثلة الوحدة الثانية «(3-1)، (3-1)، (3-2)» والصحيح (2-1)، (2-2)، (2-3) — استعملنا الترقيم الصحيح. (2) ص 37: نص المثال (2-1) ج يقول «بكل صف خليتان <b>متوازيتان</b>» والحل والشكل يعاملان الخليتين على التوالي — صحّحناها في النص. والخطأ نفسه في تمرين 1 ج (ص 42)، وفيه أيضاً «خليتان» مع أن الخلايا ثمانٍ (انظر الإجابة المقترحة). (3) ص 39: كُتب «1/4 + 1/4 = 2Ω»، والصحيح \\(1/r=1/4+1/4=0.5\\) فتكون \\(r=2\\ \\Omega\\) (النتيجة صحيحة). (4) ص 35: جملة المقاومة الداخلية لتجميع التوازي ناقصة في الكتاب («لمجموعة خلايا قدره خلية…») وأعدنا صياغتها. (5) طباعة: «ما يالي» و«التولي». لا أخطاء حسابية.</span>'}
 ],
 lab:(el)=>cellsLab(el,{id:'g3',title:'ابنِ بطارية من خلايا',ref:'مبنية على الشكل (2-4) ص 38 وعلاقات ص 35–37',
  start:{k:'e21a',n:4,m:1,E:1.5,r:2,R:2},
  presets:[{k:'e21a',label:'مثال (2-1) أ',n:4,m:1,E:1.5,r:2,R:2},{k:'e21b',label:'مثال (2-1) ب',n:1,m:4,E:1.5,r:2,R:2},{k:'e21c',label:'مثال (2-1) ج',n:2,m:2,E:1.5,r:2,R:2},{k:'t1a',label:'تمرين 1 أ',n:8,m:1,E:1.5,r:1,R:4},{k:'t1b',label:'تمرين 1 ب',n:1,m:8,E:1.5,r:1,R:4},{k:'t1c',label:'تمرين 1 ج (4 × 2)',n:4,m:2,E:1.5,r:1,R:4},{k:'t2',label:'تمرين 2',n:5,m:4,E:2,r:1.5,R:10}],
  steps:({st,seen,is})=>[
   {t:'مثال (2-1) بثلاث طرق',x:'اضغط «مثال (2-1) أ» ثم «ب» ثم «ج»: <span class="ltr">0.6 A</span> و <span class="ltr">0.6 A</span> ثم <span class="ltr">0.75 A</span>.',done:()=>seen.has('e21a')&&seen.has('e21b')&&is('e21c')},
   {t:'شرط أعلى تيار',x:'في (ج) لاحظ الرسالة: \\(mR=nr\\) والجودة 50%، والصف «أعلى تيار» في الجدول هو تشكيلك.',done:()=>is('e21c')},
   {t:'حمل كبير',x:'اجعل <span class="ltr">R = 40 Ω</span> أو أكثر: يصبح أفضل تشكيل في الجدول هو التوالي.',done:()=>st.R>=40&&st.n*st.m===4},
   {t:'حمل صغير',x:'اجعل <span class="ltr">R = 0.2 Ω</span> أو أقل: يصبح أفضل تشكيل هو التوازي.',done:()=>st.R<=0.2&&st.n*st.m===4},
   {t:'تحقق من التمرينين',x:'اضغط «تمرين 1 أ» و«ب» و«ج» ثم «تمرين 2» وقارن القراءات بإجاباتك.',done:()=>['t1a','t1b','t1c','t2'].every(k=>seen.has(k))}
  ]}),
 examples:[
  {title:'مثال (2-1)',ref:'ص 37–39',q:'<p>«أربعة أعمدة، القوة الدافعة للعمود الواحد 1.5V والمقاومة الداخلية 2Ω للعمود الواحد، تغذي مقاومة خارجية قدرها 2Ω الشكل (2-4). احسب التيار المار إذا كانت الخلايا موصلة: أ- على التوالي ب- على التوازي ج- على هيئة صفين (فرعين) متوازيين، بكل صف خليتان على التوالي.»</p>',
   given:[{id:'E',label:'القوة الدافعة للعمود',sym:'E',unit:'V',value:1.5},{id:'r',label:'المقاومة الداخلية للعمود',sym:'r',unit:'Ω',value:2},{id:'R',label:'المقاومة الخارجية',sym:'R',unit:'Ω',value:2}],solve:g=>ex21(g)},
  {title:'تمرين 1 — إجابة مقترحة (ليست من الكتاب)',ref:'ص 42',q:'<p>ثماني خلايا، E = 1.5V و r = 1.0Ω لكل خلية، والحمل 4Ω. (في ج نفترض فرعين بكل منهما أربع خلايا على التوالي.)</p>',
   given:[{id:'E',label:'جهد الخلية',sym:'E',unit:'V',value:1.5},{id:'r',label:'المقاومة الداخلية للخلية',sym:'r',unit:'Ω',value:1},{id:'R',label:'مقاومة الحمل',sym:'R',unit:'Ω',value:4}],
   solve:g=>grpSteps(8,1,g,'أ- توالي (n = 8):').concat(grpSteps(1,8,g,'ب- توازي (m = 8):'),grpSteps(4,2,g,'ج- فرعان × 4 خلايا:'))},
  {title:'تمرين 2 — إجابة مقترحة (ليست من الكتاب)',ref:'ص 42',q:'<p>عشرون خلية (2V و 1.5Ω لكل خلية) في أربعة أفرع على التوازي بكل فرع خمس خلايا على التوالي، والحمل 10Ω.</p>',
   given:[{id:'E',label:'جهد الخلية',sym:'E',unit:'V',value:2},{id:'r',label:'المقاومة الداخلية للخلية',sym:'r',unit:'Ω',value:1.5},{id:'n',label:'خلايا الفرع',sym:'n',unit:'',value:5,min:1},{id:'m',label:'عدد الفروع',sym:'m',unit:'',value:4,min:1},{id:'R',label:'مقاومة الحمل',sym:'R',unit:'Ω',value:10}],
   solve:g=>{const Vb=g.n*g.E,rb=g.n*g.r,rt=rb/g.m;return [{t:'أ- الجهد على طرفي كل فرع:',f:`n\\,E=${fm(g.n)}\\times${fm(g.E)}`,v:fm(Vb,6),unit:'V',final:true},{t:'ب- الجهد الكلي (الفروع على التوازي):',v:fm(Vb,6),unit:'V',final:true},{t:'ج- المقاومة لكل فرع:',f:`n\\,r=${fm(g.n)}\\times${fm(g.r)}`,v:fm(rb,6),unit:'Ω',final:true},{t:'د- المقاومة الكلية:',f:`\\frac{n\\,r}{m}=\\frac{${fm(rb,6)}}{${fm(g.m)}}`,v:fm(rt,6),unit:'Ω',final:true},{t:'و- التيار في الحمل:',f:`I=\\frac{${fm(Vb,6)}}{${fm(g.R)}+${fm(rt,6)}}`,v:fm(Vb/(g.R+rt),4),unit:'A',final:true}]}}
 ],
 quiz:[
  {q:'n خلية على التوالي، جهد كل منها E ومقاومتها r. جهد البطارية ومقاومتها الداخلية:',o:['E و r/n','nE و nr','nE و r/n','E و nr'],c:1,e:'ص 35.'},
  {q:'n خلية على التوازي: جهد البطارية ومقاومتها الداخلية:',o:['E و r/n','nE و nr','nE و r','E و nr'],c:0,e:'ص 35.'},
  {q:'متى يستعمل تجميع التوالي؟',o:['عندما تكون مقاومة الحمل كبيرة بالنسبة للمقاومة الداخلية','عندما تكون مقاومة الحمل صغيرة جداً','دائماً','لا يستعمل'],c:0,e:'ص 35.'},
  {q:'شرط أعلى تيار في التجميع المركب:',o:['m n = R r','m R = n r','n R = m r','m = n'],c:1,e:'ص 37.'},
  {q:'جودة المجموعة عند شرط أعلى تيار:',o:['100%','75%','50%','25%'],c:2,e:'ص 37: نصف القدرة في الحمل والنصف في المقاومة الداخلية.'},
  {q:'في مثال (2-1) التيار مع التجميع المركب (صفان × خليتان):',o:['0.6 A','0.75 A','1 A','0.5 A'],c:1,e:'\\(3/(2+2)=0.75\\ A\\).'},
  {q:'الجودة η للمجموعة تساوي:',o:['\\(r/(R+r)\\)','\\(R/(R+r)\\)','\\(R/r\\)','\\(I^2R\\)'],c:1,e:'ص 37.'},
  {q:'وحدة المقاومة الأوم تساوي:',o:['Volt × Ampere','Volt / Ampere','Ampere / Volt','Watt'],c:1,e:'ص 34.'}
 ]
});

/* ======================================================================
   Lesson 8 — القدرة القصوى (ص 39–42)
   ====================================================================== */
function bestGroup(N,E,r,R){return divs(N).map(m=>({m,n:N/m,I:groupI(N/m,m,E,r,R)})).reduce((a,b)=>b.I>a.I+1e-12?b:a)}
function ex23(g){const N=g.N,k=g.R/g.r,m2=N*g.r/g.R,b=bestGroup(N,g.E,g.r,g.R),I=groupI(b.n,b.m,g.E,g.r,g.R);const alt=divs(N).map(m=>`m=${m}: ${fm(groupI(N/m,m,g.E,g.r,g.R),3)}\\,A`).join('\\;,\\;');return [
  {t:'شرط الحصول على أعلى تيار:',f:`m\\times n=N\\qquad m\\times R=n\\times r`},
  {t:'(1) من الشرط الثاني:',f:`m\\times R=n\\times r\\quad\\text{or}\\quad ${fm(g.R)}\\,m=${fm(g.r)}\\,n\\quad\\text{or}\\quad n=\\frac{${fm(g.R)}}{${fm(g.r)}}\\,m`,v:'n = '+fm(k,4)+' m'},
  {t:'(2) وكذلك:',f:`m\\times n=N=${fm(N)}`},
  {t:'وبالتعويض من (1) في (2):',f:`m\\cdot\\frac{${fm(g.R)}}{${fm(g.r)}}\\,m=${fm(N)}\\quad\\Rightarrow\\quad m^2=\\frac{${fm(N)}\\times${fm(g.r)}}{${fm(g.R)}}`,v:fm(m2,4),unit:''},
  {t:`\\(\\sqrt{${fm(m2,4)}}\\approx${fm(Math.sqrt(m2),3)}\\)، ولأن m يجب أن يكون عدداً صحيحاً يقسم N نختار التشكيل الصحيح الأقرب الذي يعطي أكبر تيار:`,v:`m = ${b.m} ، n = ${b.n}`,final:true},
  {t:'قيمة التيار المار في الحمل في هذه الحالة:',f:`I=\\frac{n\\times E}{R+\\frac{n\\times r}{m}}=\\frac{${b.n}\\times${fm(g.E)}}{${fm(g.R)}+\\frac{${b.n}\\times${fm(g.r)}}{${b.m}}}`,v:fm(B.round(I,2),2),unit:'A',final:true},
  {t:'للمقارنة (توضيح — ليس من الكتاب): التيار في كل التشكيلات الممكنة:',f:alt}]}
B.lesson({
 id:'u2-l4',unit:2,order:4,pages:'39–42',
 title:'القدرة القصوى التي تعطيها البطارية للحمل وأفضل تشكيل للخلايا',
 summary:'تعطي البطارية أكبر قدرة للحمل عندما تساوي مقاومة الحمل مقاومتها الداخلية، وللمجموعة المركبة عندما يتساوى (عدد الخطوط × مقاومة الحمل) مع (عدد خلايا الخط × مقاومة الخلية). مع المثالين (2-2) و(2-3) والتمرين 3 (إيجاد المقاومة الداخلية والجهد من قراءتين).',
 stations:[
  {intro:true},

  {st:1,short:'القدرة القصوى',title:'القدرة القصوى التي تعطيها بطارية للحمل',ref:'ص 39',
   q:'إذا صغّرت مقاومة الحمل زاد التيار. فهل تزيد القدرة في الحمل بلا حدود؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="بطارية بمقاومتها الداخلية تغذي حملاً، ومنحنى القدرة تبلغ قمته عندما تتساوى المقاومتان" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="البطارية: قوتها الدافعة ⟦E⟧ ومقاومتها الداخلية ⟦rᵢ⟧ داخلها."><rect x="40" y="46" width="130" height="70" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2" stroke-dasharray="5 4"/><line x1="66" y1="67" x2="66" y2="95" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="butt"/><line x1="74" y1="74" x2="74" y2="88" stroke="#2C4A40" stroke-width="5" stroke-linecap="butt"/><text x="58" y="71" text-anchor="middle" font-size="12" fill="#E8735A" font-weight="700" direction="ltr">+</text><line x1="74" y1="81" x2="92" y2="81" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><polyline points="92,81 95.625,87 102.875,75 110.125,87 117.375,75 124.625,87 131.875,75 139.125,87 146.375,75 150,81" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/><text x="70" y="108" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="ltr">E</text><text x="121" y="108" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="ltr">rᵢ</text></g><line x1="40" y1="81" x2="30" y2="81" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="30" y1="81" x2="30" y2="130" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="150" y1="81" x2="180" y2="81" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="180" y1="81" x2="330" y2="81" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="330" y1="81" x2="330" y2="130" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><g data-tip="مقاومة الحمل ⟦R⟧، وعليها الجهد الخارجي ⟦V⟧."><line x1="30" y1="130" x2="200" y2="130" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><polyline points="200,130 204.5,137 213.5,123 222.5,137 231.5,123 240.5,137 249.5,123 258.5,137 267.5,123 276.5,137 285.5,123 290,130" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><line x1="290" y1="130" x2="330" y2="130" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><text x="245" y="154" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="ltr">R</text></g><line x1="70" y1="280" x2="320" y2="280" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="70" y1="280" x2="70" y2="176" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><polygon points="326.0,280.0 318.0,284.4 318.0,275.6" fill="#2C4A40"/><polygon points="70.0,170.0 74.4,178.0 65.6,178.0" fill="#2C4A40"/><text x="330" y="302" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="ltr">R</text><text x="54" y="180" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="ltr">P</text><g data-tip="منحنى القدرة في الحمل: تزيد ثم تنقص، وقمتها عند ⟦R = rᵢ⟧."><path d="M72 278 C100 190 140 192 160 192 C200 192 260 230 316 252" fill="none" stroke="#E8735A" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/></g><g data-tip="القمة: أكبر قدرة عندما تساوي مقاومة الحمل المقاومة الداخلية ⟦R = rᵢ⟧."><line x1="158" y1="192" x2="158" y2="280" stroke="#2C4A40" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="4 4"/><circle cx="158" cy="192" r="5" fill="#E8735A"/><text x="158" y="300" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="ltr">R = rᵢ</text></g></svg>`,
   cap:'في الأعلى بطارية (E ومقاومتها الداخلية) تغذي حملاً R، وفي الأسفل شكل منحنى القدرة في الحمل (بلا أرقام).<br><b>مرّر المؤشر على البطارية والحمل والمنحنى وقمته (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'متى تعطي البطارية أكبر قدرة للحمل؟',opts:[
     ['عندما تكون مقاومة الحمل صفراً',false,'عندها التيار كبير لكن الجهد على الحمل صفر، فالقدرة في الحمل صفر.'],
     ['عندما تكون مقاومة الحمل كبيرة جداً',false,'عندها التيار صغير جداً فالقدرة صغيرة.'],
     ['عندما تساوي مقاومة الحمل المقاومة الداخلية للبطارية',true,'نص الكتاب: «أي أن البطارية تعطي أكبر قدرة للحمل عندما تكون مقاومة الحمل مساوية للمقاومة الداخلية للبطارية».']]}}
   ],
   body:[
    {book:String.raw`<p>نفرض أن:</p>
     <ul><li>جهد البطارية = E فولت</li><li>مقاومة البطارية الداخلية = \(r_i\) أوم</li><li>مقاومة الحمل = R أوم</li><li>الجهد الخارجي = V فولت</li></ul>
     <div class="eq" style="position:relative;overflow-x:auto">$$V=E-I\times r_i=I\times R$$<span></span></div>
     <div class="eq" style="position:relative;overflow-x:auto">$$E=I\,(R+r_i)$$<span></span></div>
     <div class="eq" style="position:relative;overflow-x:auto">$$P=V\times I=E\times I-I^2\times r_i$$<span></span></div>
     <div class="eq" style="position:relative;overflow-x:auto">$$\frac{dP}{dI}=E-2\times I\times r_i$$<span></span></div>
     <p>القدرة القصوى يعني: \(dP/dI=\) صفر</p>
     <div class="eq" style="position:relative;overflow-x:auto">$$E=2\times I\times r_i$$<span></span></div>
     <div class="eq" style="position:relative;overflow-x:auto">$$I\,(R+r_i)=E=2\times I\times r_i$$<span></span></div>
     <p>أي أن:</p>
     <div class="eq" style="position:relative;overflow-x:auto">$$R=r_i$$<span></span></div>
     <p>أي أن <b>البطارية تعطي أكبر قدرة للحمل عندما تكون مقاومة الحمل مساوية للمقاومة الداخلية للبطارية</b>.</p>`,ref:'ص 39'},
    {tip:String.raw`<p>القدرة في الحمل \(P=V\times I\) حاصل ضرب كميتين تتعاكسان: إذا صغّرنا R زاد التيار لكن نقص الجهد على الحمل، وإذا كبّرنا R زاد الجهد لكن نقص التيار. أفضل حاصل ضرب في المنتصف: عند \(R=r_i\).</p>
     <p>وعندها \(I=E/2r_i\)، و\(P_{max}=E^2/4r_i\)، ونصف القدرة يضيع داخل البطارية (الجودة <span class="ltr">50%</span>).</p>`,title:'لماذا في المنتصف؟'},
    {title:'حرّك نسبة مقاومة الحمل إلى المقاومة الداخلية',widget:(el,B)=>{
      el.innerHTML=`<p class="sub" style="margin:0">لا نحتاج أرقام بطارية: نقارن بالنسب فقط. القدرة مقسومة على أكبر قدرة ممكنة، والجودة \\(R/(R+r_i)\\).</p>
       <label class="w-sl"><span>النسبة <span class="ltr">R / rᵢ</span> = <b class="ltr" data-o="x"></b></span><input type="range" min="0.1" max="5" step="0.1" value="1" dir="ltr"></label>
       <div class="w-facts" style="grid-template-columns:1fr 1fr"><div><span>القدرة في الحمل ÷ القدرة القصوى</span><b data-o="p"></b></div><div><span>الجودة</span><b data-o="e"></b></div></div>
       <div style="display:grid;gap:6px;margin-top:10px"><div style="background:var(--surface-2);border-radius:8px;height:12px;overflow:hidden"><div data-o="pb" style="height:100%;background:var(--live)"></div></div><div style="background:var(--surface-2);border-radius:8px;height:12px;overflow:hidden"><div data-o="eb" style="height:100%;background:var(--blue)"></div></div></div>
       <p class="sub" data-o="m" style="margin:8px 0 0"></p>`;
      B.math(el);const r=el.querySelector('input');
      const draw=()=>{const x=+r.value,P=4*x/((1+x)*(1+x)),E=x/(1+x);el.querySelector('[data-o=x]').textContent=B.fmtN(x);
        el.querySelector('[data-o=p]').textContent=B.fmtN(B.round(P*100,1))+'%';el.querySelector('[data-o=e]').textContent=B.fmtN(B.round(E*100,1))+'%';
        el.querySelector('[data-o=pb]').style.width=P*100+'%';el.querySelector('[data-o=eb]').style.width=E*100+'%';
        el.querySelector('[data-o=m]').textContent=Math.abs(x-1)<0.05?'R = rᵢ: أكبر قدرة، والجودة 50%.':x>1?'R أكبر من rᵢ: القدرة أقل من القصوى، لكن الجودة أعلى.':'R أصغر من rᵢ: القدرة أقل من القصوى، والجودة أقل من 50%.'};
      r.oninput=draw;draw();
    }},
    {watch:String.raw`<p>القدرة <b>القصوى</b> ليست الجودة <b>القصوى</b>. عند \(R=r_i\) تضيع نصف القدرة حرارةً داخل البطارية. ولهذا لا نشغّل البطاريات عادةً عند هذا الشرط إذا كان المهم هو الجودة.</p>`}
   ]},

  {st:2,short:'شروط المجموعات',title:'القدرة القصوى وأقصى تيار للمجموعات',ref:'ص 40',
   q:'المجموعة المختلطة، والتوالي، والتوازي: لكل منها شرطها. هل تتذكرها من الدرس السابق؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="شروط أقصى تيار أو قدرة للمجموعات المختلطة والتوالي والتوازي" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="المجموعة المختلطة: أكبر قدرة للحمل عندما ⟦m × R = n × rᵢ⟧."><rect x="30" y="36" width="300" height="68" rx="12" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><text x="250" y="66" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700" direction="rtl">مجموعة مختلطة</text><text x="250" y="88" text-anchor="middle" font-size="11" fill="#2C4A40" direction="rtl">أقصى تيار / قدرة</text><rect x="48" y="50" width="120" height="40" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="108" y="76" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="ltr">mR = n rᵢ</text></g><g data-tip="التوالي: أقصى تيار عندما تكون المقاومة الداخلية صغيرة جداً بالنسبة لمقاومة الحمل."><rect x="30" y="122" width="300" height="68" rx="12" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><text x="250" y="152" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700" direction="rtl">على التوالي</text><text x="250" y="174" text-anchor="middle" font-size="11" fill="#2C4A40" direction="rtl">أقصى تيار / قدرة</text><rect x="48" y="136" width="120" height="40" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="108" y="162" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="ltr">n rᵢ ≪ R</text></g><g data-tip="التوازي: أقصى تيار عندما تكون مقاومة الحمل صغيرة جداً بالنسبة لمقاومة البطارية."><rect x="30" y="208" width="300" height="68" rx="12" fill="#BFE3DF" stroke="#2C4A40" stroke-width="2.5"/><text x="250" y="238" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700" direction="rtl">على التوازي</text><text x="250" y="260" text-anchor="middle" font-size="11" fill="#2C4A40" direction="rtl">أقصى تيار / قدرة</text><rect x="48" y="222" width="120" height="40" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="108" y="248" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="ltr">R ≪ rᵢ / n</text></g></svg>`,
   cap:'شروط أقصى قدرة أو أقصى تيار لكل نوع من المجموعات.<br><b>مرّر المؤشر على كل لوحة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'مجموعة بطاريات على <b>التوازي</b>: متى تعطي أقصى تيار؟',opts:[
     ['عندما تكون مقاومة الحمل صغيرة جداً بالنسبة لمقاومة المجموعة',true,String.raw`وهذا ما رأيته في تجميع التوازي: \(R\ll r_i/n\) يعطي \(I=n(E/r)\).`],
     ['عندما تكون مقاومة الحمل كبيرة جداً',false,'هذا شرط التوالي.'],
     ['عندما تتساوى مقاومة الحمل مع مقاومة خلية واحدة',false,'هذا شرط القدرة القصوى لبطارية واحدة، لا أقصى تيار للتوازي.']]}}
   ],
   body:[
    {book:String.raw`<p>وفي حالة المجموعة المختلطة تكون القدرة القصوى التي تعطيها المجموعة للحمل عندما يكون:</p>
     <div class="eq" style="position:relative;overflow-x:auto">$$m\times R=n\times r_i$$<span></span></div>
     <p>وفي حالات مجموعة البطاريات على التوالي فإن أقصى تيار \(I_{max}\) تعطيه المجموعة عندما يكون</p>
     <div class="eq" style="position:relative;overflow-x:auto">$$n\,r_i\ll R$$<span></span></div>
     <p>وفي حالة مجموعة البطاريات على التوازي فإن أقصى تيار \(I_{max}\) تعطيه المجموعة عندما يكون</p>
     <div class="eq" style="position:relative;overflow-x:auto">$$R\ll \frac{r_i}{n}$$<span></span></div>`,ref:'ص 40'},
    {watch:String.raw`<p>طُبع الشرطان في الكتاب «<span class="ltr">r.i ≪ R</span>» و«<span class="ltr">R ≪ r×i</span>»، والمقصود \(n\,r_i\ll R\) للتوالي و\(R\ll r_i/n\) للتوازي، كما في تجميع التوالي والتوازي (ص 35–36).</p>`,fix:true},
    {tip:String.raw`<p>الشروط الثلاثة فكرة واحدة: قارن المقاومة الداخلية <b>الكلية</b> للمجموعة بمقاومة الحمل. المختلطة: اجعلهما متساويتين للقدرة القصوى. التوالي: يفيد إذا كانت الداخلية صغيرة جداً. التوازي: يفيد إذا كان الحمل صغيراً جداً.</p>`},
    {title:'مختبر مصغّر: لكل مجموعة شرطها',widget:(el,B)=>DCML.sort(el,B,{intro:'لكل شرط اختر المجموعة التي يخصها.',cats:['مختلطة: القدرة القصوى','توالي: أقصى تيار','توازي: أقصى تيار'],items:[
 ['\\(R\\ll r_i/n\\): الحمل صغير جداً بالنسبة لمقاومة المجموعة',2,'التوازي يقسم المقاومة الداخلية على n، فيفيد مع حمل صغير جداً.'],
 ['\\(m\\times R=n\\times r_i\\)',0,'المقاومة الخارجية = المقاومة الداخلية للمجموعة المختلطة.'],
 ['\\(n\\,r_i\\ll R\\): المقاومة الداخلية صغيرة جداً بالنسبة للحمل',1,'عندها \\(I\\approx n(E/R)\\): التوالي يضاعف التيار n مرة.']]})}
   ]},

  {st:3,short:'مثال (2-2)',title:'مثال <span class="ltr">(2-2)</span>: خمس عشرة خلية تغذي حملاً',ref:'ص 40',
   q:'هل الجهد على طرفي البطارية وهي تعطي تياراً يساوي جهدها بلا حمل؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مثال 2-2: خمس عشرة خلية على التوالي تغذي حملاً 30 أوم" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><g data-tip="خمس عشرة خلية: كل منها ⟦1.4 V⟧ ومقاومتها الداخلية ⟦0.8 Ω⟧."><line x1="38" y1="70" x2="318" y2="70" stroke="#2C4A40" stroke-width="1.6" stroke-linecap="round"/><rect x="52" y="59" width="10" height="22" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><rect x="70" y="59" width="10" height="22" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><rect x="88" y="59" width="10" height="22" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><rect x="106" y="59" width="10" height="22" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><rect x="124" y="59" width="10" height="22" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><rect x="142" y="59" width="10" height="22" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><rect x="160" y="59" width="10" height="22" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><rect x="178" y="59" width="10" height="22" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><rect x="196" y="59" width="10" height="22" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><rect x="214" y="59" width="10" height="22" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><rect x="232" y="59" width="10" height="22" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><rect x="250" y="59" width="10" height="22" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><rect x="268" y="59" width="10" height="22" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><rect x="286" y="59" width="10" height="22" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><rect x="304" y="59" width="10" height="22" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><rect x="36" y="52" width="290" height="40" fill="transparent"/></g><text x="180" y="42" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="rtl">خمس عشرة خلية، كل منها 1.4V و 0.8Ω</text><line x1="38" y1="70" x2="38" y2="200" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="318" y1="70" x2="318" y2="200" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><g data-tip="مقاومة الحمل ⟦30 Ω⟧."><line x1="38" y1="200" x2="130" y2="200" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><polyline points="130,200 135,208 145,192 155,208 165,192 175,208 185,192 195,208 205,192 215,208 225,192 230,200" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><line x1="230" y1="200" x2="318" y2="200" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><text x="180" y="228" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="ltr">30Ω</text></g><g data-tip="النتيجة: ⟦E = 21 V⟧، المقاومة الداخلية ⟦12 Ω⟧، الكلية ⟦42 Ω⟧."><rect x="70" y="104" width="220" height="56" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="180" y="128" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="ltr">E = 21 V</text><text x="180" y="150" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="ltr">r = 12 Ω</text></g><g data-tip="تيار التغذية ⟦I = 21/42 = 0.5 A⟧، والجهد على طرفي البطارية ⟦15 V⟧."><rect x="60" y="250" width="240" height="40" rx="12" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><text x="120" y="276" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="ltr">I = 0.5 A</text><text x="240" y="276" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="ltr">V = 15 V</text></g></svg>`,
   cap:'معطيات المثال ونتائجه كما في الحل.<br><b>مرّر المؤشر على الخلايا والنتائج والحمل (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:String.raw`جهد البطارية بلا حمل <span class="ltr">21 V</span>، والتيار <span class="ltr">0.5 A</span>. كم الجهد على طرفيها وهي تغذي الحمل؟`,opts:[
     [String.raw`<span class="ltr">21 V</span>`,false,'جزء من الجهد يضيع على المقاومة الداخلية.'],
     [String.raw`<span class="ltr">6 V</span>`,false,String.raw`هذا الجهد الضائع داخل البطارية \(0.5\times12\).`],
     [String.raw`<span class="ltr">15 V</span>`,true,String.raw`\(V=E-I\,r=21-0.5\times12=15\ \text{V}\)، أو \(V=IR=0.5\times30=15\ \text{V}\).`]]}}
   ],
   body:[
    {book:String.raw`<p>مجموعة بطاريات تتكون من <span class="ltr">15</span> خلية كل منها <span class="ltr">1.4 V</span> ولها مقاومة داخلية <span class="ltr">0.8Ω</span> ومحملة بمقاومة قدرها <span class="ltr">30Ω</span>. أوجد: (أ) تيار التغذية، (ب) الجهد على طرفي البطارية.</p>`,ref:'ص 40'},
    {html:String.raw`<div class="exl"><div class="exc"><header>نتائج الحل في الكتاب <span class="ref">ص 40</span></header>
      <div class="kv-row"><small>البطارية</small><span class="kv ltr">\(E=15\times1.4=21\ V\)</span><span class="kv ltr">\(r=0.8\times15=12\ \Omega\)</span><span class="kv ltr">\(12+30=42\ \Omega\)</span></div>
      <div class="kv-row"><small>(أ)</small><span class="kv res ltr">\(I=21/42=0.5\ A\)</span></div>
      <div class="kv-row"><small>(ب)</small><span class="kv res ltr">\(V=I\times R=0.5\times30=15\ V\)</span><span class="kv res ltr">\(V=E-I\times r=21-0.5\times12=15\ V\)</span></div></div>
      <div class="w-row"><button class="btn pri" type="button" onclick="var b=document.querySelector('.ltabs button[data-tab=examples]');if(b)b.click()">افتح الحل خطوة بخطوة في «الأمثلة المحلولة»</button></div></div>`},
    {tip:String.raw`<p>نص المثال لا يذكر طريقة التوصيل صراحة، والحل يعامل الخلايا على التوالي. ولاحظ أن \(R=30\ \Omega\) أكبر من \(r=12\ \Omega\): البطارية هنا لا تعطي القدرة القصوى (تعطي \(0.5^2\times30=7.5\ W\)، والقصوى \(21^2/(4\times12)\approx9.19\ W\) عند \(R=12\ \Omega\)) لكن جودتها أعلى: \(30/42\approx71\%\).</p>`},
    {watch:String.raw`<p>رقّم الكتاب هذا المثال «(3-1)» (مكرراً مع المثال السابق)، والصحيح <span class="ltr">(2-2)</span>.</p>`,fix:true},
    {title:'مختبر مصغّر: غيّر الحمل على البطارية نفسها',widget:(el,B)=>DCML.lab(el,B,{intro:'البطارية من المثال: \\(E=21\\ V\\) و\\(r=12\\ \\Omega\\). القيمة <span class="ltr">30 Ω</span> للحمل من الكتاب؛ حرّكها (أرقام تختارها أنت) وراقب الجهد على الطرفين والقدرة.',
 predict:{q:'لو خفضنا الحمل من <span class="ltr">30 Ω</span> إلى <span class="ltr">12 Ω</span>، فإن القدرة في الحمل:',opts:[
  ['تزيد إلى أكبر قيمة ممكنة',true,'عند \\(R=r=12\\ \\Omega\\) تعطي البطارية أكبر قدرة \\(E^2/4r\\approx9.19\\ W\\)؛ لكن الجودة تنزل إلى <span class="ltr">50%</span>.'],
  ['تقل لأن الجهد على الطرفين يقل',false,'الجهد يقل فعلاً، لكن التيار يزيد بنسبة أكبر.'],
  ['لا تتغير',false,'القدرة تعتمد على R؛ جرّب.']]},
 ins:[{k:'R',l:'مقاومة الحمل R',u:'Ω',min:1,max:60,step:1,v:30}],
 calc:(s,P,B)=>{const E=21,r=12,I=E/(s.R+r),V=I*s.R,Pw=I*V;const pts=[];for(let R=1;R<=60;R+=1)pts.push([R,E*E*R/((R+r)**2)]);
  return {facts:[['التيار I',DCML.fm(B,B.round(I,3))+' A'],['الجهد على الطرفين '+((x)=>'<bdi class="ltr">'+x+'</bdi>')('V = E − Ir'),DCML.fm(B,B.round(V,2))+' V','hi'],['القدرة في الحمل',DCML.fm(B,B.round(Pw,2))+' W','hi'],['الجودة '+((x)=>'<bdi class="ltr">'+x+'</bdi>')('R ÷ (R + r)'),DCML.fm(B,B.round(100*s.R/(s.R+r),1))+' %']],
   plot:{xr:[0,60],yr:[0,10],xl:'R (Ω)',yl:'P (W)',curves:[{pts}],cur:[s.R,Pw]},
   msg:s.R===12?'\\(R=r\\): أكبر قدرة، ونصفها يضيع داخل البطارية.':s.R===30?'أرقام الكتاب: <span class="ltr">0.5 A</span> و<span class="ltr">15 V</span>.':''}}})}
   ]},

  {st:4,short:'مثال (2-3)',title:'مثال <span class="ltr">(2-3)</span>: أحسن تشكيل لأربع وعشرين خلية',ref:'ص 41',
   q:'الحساب يعطي عدد خطوط 3.1 تقريباً. كيف نبني 3.1 خط؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مثال 2-3: أربع وعشرون خلية في ثلاثة خطوط بكل خط ثماني خلايا، والحمل 5 أوم" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E2ECF3"/><text x="180" y="40" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="rtl">كل خلية 2.1V و 2Ω</text><line x1="40" y1="74" x2="40" y2="200" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="320" y1="74" x2="320" y2="200" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><g data-tip="أحسن تشكيل: ⟦m = 3⟧ خطوط على التوازي، بكل خط ⟦n = 8⟧ خلايا على التوالي."><line x1="50" y1="80" x2="300" y2="80" stroke="#2C4A40" stroke-width="1.6" stroke-linecap="round"/><rect x="69" y="70" width="12" height="20" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><rect x="99" y="70" width="12" height="20" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><rect x="129" y="70" width="12" height="20" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><rect x="159" y="70" width="12" height="20" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><rect x="189" y="70" width="12" height="20" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><rect x="219" y="70" width="12" height="20" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><rect x="249" y="70" width="12" height="20" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><rect x="279" y="70" width="12" height="20" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><line x1="50" y1="128" x2="300" y2="128" stroke="#2C4A40" stroke-width="1.6" stroke-linecap="round"/><rect x="69" y="118" width="12" height="20" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><rect x="99" y="118" width="12" height="20" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><rect x="129" y="118" width="12" height="20" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><rect x="159" y="118" width="12" height="20" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><rect x="189" y="118" width="12" height="20" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><rect x="219" y="118" width="12" height="20" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><rect x="249" y="118" width="12" height="20" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><rect x="279" y="118" width="12" height="20" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><line x1="50" y1="176" x2="300" y2="176" stroke="#2C4A40" stroke-width="1.6" stroke-linecap="round"/><rect x="69" y="166" width="12" height="20" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><rect x="99" y="166" width="12" height="20" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><rect x="129" y="166" width="12" height="20" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><rect x="159" y="166" width="12" height="20" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><rect x="189" y="166" width="12" height="20" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><rect x="219" y="166" width="12" height="20" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><rect x="249" y="166" width="12" height="20" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><rect x="279" y="166" width="12" height="20" rx="2" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.4"/><rect x="40" y="64" width="280" height="120" fill="transparent"/></g><line x1="50" y1="80" x2="40" y2="80" stroke="#2C4A40" stroke-width="1.6" stroke-linecap="round"/><line x1="50" y1="128" x2="40" y2="128" stroke="#2C4A40" stroke-width="1.6" stroke-linecap="round"/><line x1="50" y1="176" x2="40" y2="176" stroke="#2C4A40" stroke-width="1.6" stroke-linecap="round"/><line x1="300" y1="80" x2="320" y2="80" stroke="#2C4A40" stroke-width="1.6" stroke-linecap="round"/><line x1="300" y1="128" x2="320" y2="128" stroke="#2C4A40" stroke-width="1.6" stroke-linecap="round"/><line x1="300" y1="176" x2="320" y2="176" stroke="#2C4A40" stroke-width="1.6" stroke-linecap="round"/><text x="22" y="132" text-anchor="middle" font-size="12" fill="#E8735A" font-weight="700" direction="ltr">m=3</text><text x="180" y="62" text-anchor="middle" font-size="12" fill="#E8735A" font-weight="700" direction="ltr">n = 8</text><g data-tip="مقاومة الحمل ⟦5 Ω⟧."><line x1="40" y1="200" x2="40" y2="224" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="320" y1="200" x2="320" y2="224" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="40" y1="224" x2="130" y2="224" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><polyline points="130,224 135,232 145,216 155,232 165,216 175,232 185,216 195,232 205,216 215,232 225,216 230,224" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/><line x1="230" y1="224" x2="320" y2="224" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><text x="180" y="252" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="ltr">5Ω</text></g><g data-tip="التيار في الحمل بهذا التشكيل ⟦1.63 A⟧."><rect x="90" y="262" width="180" height="34" rx="12" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><text x="180" y="285" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700" direction="ltr">I = 1.63 A</text></g></svg>`,
   cap:'أحسن تشكيل من حل الكتاب: ثلاثة خطوط، بكل خط ثماني خلايا.<br><b>مرّر المؤشر على الخلايا والحمل والتيار (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:String.raw`\(m^2=9.6\) فيكون \(m\approx3.1\). لماذا اختار الكتاب \(m=3\)؟`,opts:[
     ['لأن عدد الخطوط يجب أن يكون عدداً صحيحاً يقسم 24',true,String.raw`لا يمكن بناء جزء من خط، ويجب أن يكون \(m\times n=24\) بعدد صحيح من الخلايا في كل خط.`],
     ['لأن الكتاب يقرّب دائماً إلى الأسفل',false,'السبب ليس قاعدة تقريب؛ بل أن m يجب أن يقسم 24.'],
     ['لأن 3 خطوط تعطي جهداً أكبر',false,'جهد البطارية يعتمد على n لا على m.']]}}
   ],
   body:[
    {book:String.raw`<p>يوجد <span class="ltr">٢٤</span> خلية والمطلوب تشكيل هذه الخلايا في بطارية مجمعة لتعطي أكبر تيار في مقاومة حمل قدرها <span class="ltr">5 Ω</span>، فإذا كان جهد اللاحمل لكل خلية <span class="ltr">2.1 V</span> ومقاومتها الداخلية <span class="ltr">2 Ω</span>، أوجد أحسن تشكيل وقيمة التيار في الحمل.</p>
     <p>شرط الحصول على أعلى تيار هو:</p>
     <div class="eq" style="position:relative;overflow-x:auto">$$m\times n=N,\qquad m\times R=n\times r$$<span></span></div>
     <p>حيث أن r هي مقاومة الخلية الواحدة، R هي مقاومة الحمل، n هو عدد الخلايا الموصلة على التوالي في كل خط، m هو عدد الخطوط الموصلة على التوازي، N هو العدد الكلي للخلايا.</p>
     <div class="eq" style="position:relative;overflow-x:auto">$$m\times R=n\times r\quad\text{or}\quad 5\,m=2\,n\quad\text{or}\quad n=\tfrac52\,m$$<span class="eqno">(1)</span></div>
     <p>وكذلك</p>
     <div class="eq" style="position:relative;overflow-x:auto">$$m\times n=N=24$$<span class="eqno">(2)</span></div>
     <p>وبالتعويض من (1) في (2) نحصل على</p>
     <div class="eq" style="position:relative;overflow-x:auto">$$m\,\tfrac52\,m=\tfrac52\,m^2=24\quad\text{or}\quad m^2=\frac{24\times2}{5}=9.6$$<span></span></div>
     <p>وبالتالي يمكن أن نحسب m = 3 خطاً، فيكون n = 8 خلية في كل خط. وتكون قيمة التيار المار في الحمل في هذه الحالة:</p>
     <div class="eq" style="position:relative;overflow-x:auto">$$I=\frac{n\times E}{R+\dfrac{n\times r}{m}}=\frac{8\times2.1}{5+\dfrac{8\times2}{3}}=1.63\ A$$<span></span></div>`,ref:'ص 41'},
    {title:'جرّب كل التشكيلات الممكنة لـ 24 خلية (أرقام المثال)',widget:(el,B)=>{
      const E=2.1,r=2,R=5,N=24,ms=[1,2,3,4,6,8,12,24];let m=3;
      const I=m=>{const n=N/m;return n*E/(R+n*r/m)};const best=Math.max(...ms.map(I));
      const draw=()=>{const n=N/m,i=I(m);el.innerHTML=`<p class="sub" style="margin:0">اختر عدد الخطوط m (يجب أن يقسم 24)، ويُحسب n = 24 ÷ m والتيار من معادلة التجميع المركب.</p>
        <div class="w-row"><span class="w-l">m =</span><span class="mseg">${ms.map(v=>`<button type="button" data-m="${v}" aria-pressed="${v===m}">${v}</button>`).join('')}</span></div>
        <div class="w-facts" style="grid-template-columns:repeat(3,minmax(0,1fr))"><div><span>خلايا كل خط n</span><b>${n}</b></div><div><span>المقاومة الداخلية nr/m</span><b>${B.fmtN(B.round(n*r/m,3))} Ω</b></div><div><span>التيار في الحمل</span><b>${B.fmtN(B.round(i,3))} A</b></div></div>
        <div style="background:var(--surface-2);border-radius:8px;margin-top:10px;height:14px;overflow:hidden"><div style="height:100%;width:${i/best*100}%;background:${i===best?'var(--on)':'var(--blue)'}"></div></div>
        <p class="sub" style="margin:8px 0 0">${i===best?'هذا أكبر تيار: المقاومة الداخلية (5.333 Ω) أقرب ما تكون إلى الحمل (5 Ω).':'جرّب m = 3.'}</p>`;
        el.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{m=+b.dataset.m;draw()})};draw();
    }},
    {watch:String.raw`<p>رقّم الكتاب المعادلتين «(4.1)» و«(4.2)» ثم أشار إليهما بـ «(1-4) في (2-4)»؛ رقّمناهما (1) و(2). ورقّم المثال «(3-2)» والصحيح <span class="ltr">(2-3)</span>.</p>`,fix:true},
    {tip:String.raw`<p>\(\sqrt{9.6}\approx3.1\)، لكن m يجب أن يقسم 24. نقارن الأقرب: \(m=3,n=8\) يعطي <span class="ltr">1.63 A</span>، و\(m=4,n=6\) يعطي <span class="ltr">1.575 A</span>، و\(m=2,n=12\) يعطي <span class="ltr">1.48 A</span>. فالتشكيل <span class="ltr">3 × 8</span> هو الأفضل فعلاً.</p>`,title:'لماذا m = 3؟'}
   ]},

  {st:5,short:'تمرين 3',title:'تمرين <span class="ltr">3</span>: بطارية مجهولة من قراءتين',ref:'ص 42',
   q:'لا نعرف جهد البطارية ولا مقاومتها الداخلية، لكن عندنا قراءتان. هل تكفيان؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="تمرين 3: البطارية نفسها مع حملين: 0.6 أمبير مع 2 أوم و0.2 أمبير مع 12 أوم" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="القراءة الأولى: حمل ⟦2 Ω⟧ والتيار ⟦0.6 A⟧."><rect x="200" y="70" width="120" height="60" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5" stroke-dasharray="5 4"/><text x="260" y="96" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="ltr">E = ?</text><text x="260" y="118" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="ltr">r = ?</text><line x1="220" y1="130" x2="220" y2="240" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="300" y1="130" x2="300" y2="240" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><circle cx="220" cy="180" r="16" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.2"/><text x="220" y="185" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="ltr">A</text><line x1="220" y1="240" x2="235" y2="240" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><polyline points="235,240 238.125,246 244.375,234 250.625,246 256.875,234 263.125,246 269.375,234 275.625,246 281.875,234 285,240" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/><line x1="285" y1="240" x2="300" y2="240" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><text x="260" y="268" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="ltr">2.0Ω</text><text x="260" y="200" text-anchor="middle" font-size="14" fill="#E8735A" font-weight="700" direction="ltr">0.6A</text></g><g data-tip="القراءة الثانية: حمل ⟦12 Ω⟧ والتيار ⟦0.2 A⟧."><rect x="40" y="70" width="120" height="60" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5" stroke-dasharray="5 4"/><text x="100" y="96" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="ltr">E = ?</text><text x="100" y="118" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="ltr">r = ?</text><line x1="60" y1="130" x2="60" y2="240" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><line x1="140" y1="130" x2="140" y2="240" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><circle cx="60" cy="180" r="16" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.2"/><text x="60" y="185" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="ltr">A</text><line x1="60" y1="240" x2="75" y2="240" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><polyline points="75,240 78.125,246 84.375,234 90.625,246 96.875,234 103.125,246 109.375,234 115.625,246 121.875,234 125,240" fill="none" stroke="#2C4A40" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/><line x1="125" y1="240" x2="140" y2="240" stroke="#2C4A40" stroke-width="2.2" stroke-linecap="round"/><text x="100" y="268" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="ltr">12Ω</text><text x="100" y="200" text-anchor="middle" font-size="14" fill="#E8735A" font-weight="700" direction="ltr">0.2A</text></g><g data-tip="البطارية نفسها في الحالتين: ⟦E⟧ و⟦r⟧ مجهولان لكنهما لا يتغيران."><text x="180" y="52" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700" direction="rtl">البطارية نفسها</text></g><text x="180" y="300" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="ltr">E = I (R + r)</text></svg>`,
   cap:'البطارية نفسها مع حملين مختلفين، والتيار في كل حالة.<br><b>مرّر المؤشر على كل دائرة (أو المسها في الجوال) لتعرف قراءتها.</b>',
   side:[
    {predict:{q:'ما الذي <b>لا يتغير</b> بين القراءتين؟',opts:[
     ['التيار',false,'التيار تغيّر من 0.6 A إلى 0.2 A.'],
     ['جهد اللاحمل E والمقاومة الداخلية r',true,String.raw`البطارية نفسها، فنكتب \(E=I(R+r)\) مرتين ونساوي بينهما.`],
     ['مقاومة الحمل',false,'الحمل تغيّر من 2 Ω إلى 12 Ω.']]}}
   ],
   body:[
    {book:String.raw`<ol start="3"><li>بطارية تعطي تياراً قدره <span class="ltr">0.6A</span> عندما تكون المقاومة الخارجية <span class="ltr">2.0Ω</span> وتعطي تياراً قدره <span class="ltr">0.2A</span> عندما تكون المقاومة الخارجية <span class="ltr">12Ω</span> أوجد: أ- المقاومة الداخلية. ب- جهد البطارية في حالة اللاحمل.</li></ol>`,ref:'ص 42'},
    {tip:String.raw`<p class="sub" style="margin-top:0">الكتاب لا يعطي إجابات. اضغط لترى إجابة مقترحة.</p>
     <details class="cx-q"><summary>تمرين 3</summary><div class="cx-ans">\(E=I(R+r)\) في الحالتين: \(0.6(2+r)=0.2(12+r)\) ← \(1.2+0.6r=2.4+0.2r\) ← \(0.4r=1.2\) ← <b>\(r=3\ \Omega\)</b>، ثم \(E=0.6\times(2+3)=\) <b><span class="ltr">3 V</span></b>. (تحقق: \(0.2\times(12+3)=3\ V\).)</div></details>`,title:'إجابة مقترحة (ليست من الكتاب)'},
    {title:'مختبر مصغّر: ابحث عن r التي تتفق معها القراءتان',widget:(el,B)=>DCML.lab(el,B,{intro:'من كل قراءة نحسب جهد اللاحمل \\(E=I(R+r)\\). حرّك قيمة r المقترحة حتى تعطي القراءتان الجهد نفسه — عندها تكون r هي المقاومة الداخلية الحقيقية.',
 ins:[{k:'r',l:'r المقترحة',u:'Ω',min:0,max:6,step:0.5,v:1}],
 calc:(s,P,B)=>{const e1=0.6*(2+s.r),e2=0.2*(12+s.r),ok=Math.abs(e1-e2)<1e-9;
  return {facts:[['من القراءة 1: '+((x)=>'<bdi class="ltr">'+x+'</bdi>')('0.6 × (2 + r)'),DCML.fm(B,B.round(e1,2))+' V',ok?'hi':''],['من القراءة 2: '+((x)=>'<bdi class="ltr">'+x+'</bdi>')('0.2 × (12 + r)'),DCML.fm(B,B.round(e2,2))+' V',ok?'hi':'']],
   bars:[{l:'E من القراءة 1',v:e1,max:4,u:'V'},{l:'E من القراءة 2',v:e2,max:4,u:'V',col:'--live'}],
   msg:ok?'القراءتان تتفقان: هذه هي المقاومة الداخلية، وجهد اللاحمل هو القيمة المشتركة. قارن بحلك.':'القيمتان مختلفتان؛ البطارية واحدة فلا بد أن يتفق الجهدان. حرّك r.',cls:ok?'':'warn'}}})}
   ]},

  {recap:[
   String.raw`القدرة في الحمل \(P=EI-I^2r_i\)، وأكبر قدرة عندما \(dP/dI=0\) أي \(R=r_i\): مقاومة الحمل = المقاومة الداخلية (ص 39).`,
   String.raw`عند القدرة القصوى نصف القدرة يضيع داخل البطارية (الجودة <span class="ltr">50%</span>)؛ القدرة القصوى ليست الجودة القصوى.`,
   String.raw`المختلطة: \(mR=nr_i\) للقدرة القصوى؛ التوالي: أقصى تيار عندما \(nr_i\ll R\)؛ التوازي: عندما \(R\ll r_i/n\) (ص 40).`,
   String.raw`مثال (2-2): <span class="ltr">15</span> خلية توالياً على <span class="ltr">30 Ω</span> ← <span class="ltr">0.5 A</span> والجهد على الطرفين <span class="ltr">15 V</span> = \(E-Ir\).`,
   String.raw`مثال (2-3): أحسن تشكيل لـ <span class="ltr">24</span> خلية على <span class="ltr">5 Ω</span> ثلاثة خطوط × ثماني خلايا، والتيار <span class="ltr">1.63 A</span>؛ m عدد صحيح يقسم N.`]}
],
 theory:[
  {h:'القدرة القصوى التي تعطيها بطارية للحمل',ref:'ص 39',html:`<p>«نفرض أن: جهد البطارية = E فولت، مقاومة البطارية الداخلية = \\(r_i\\) أوم، مقاومة الحمل = R أوم، الجهد الخارجي = V فولت»:</p>
   $$V=E-I\\,r_i=I\\,R\\qquad E=I\\,(R+r_i)$$
   $$P=V\\times I=E\\times I-I^2\\,r_i\\qquad \\frac{dP}{dI}=E-2\\,I\\,r_i$$
   <p>«القدرة القصوى يعني: \\(dP/dI=\\) صفر»:</p>
   $$E=2\\,I\\,r_i\\qquad I\\,(R+r_i)=E=2\\,I\\,r_i\\qquad\\Rightarrow\\qquad R=r_i$$
   <p>«أي أن <b>البطارية تعطي أكبر قدرة للحمل عندما تكون مقاومة الحمل مساوية للمقاومة الداخلية للبطارية</b>.»</p>`},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب:</b> عند \\(R=r_i\\) يكون التيار \\(I=E/2r_i\\) والقدرة القصوى \\(P_{max}=E^2/4r_i\\)، ونصف القدرة يضيع داخل البطارية (الجودة 50%). فالقدرة القصوى ليست أعلى جودة: كلما كبرت R زادت الجودة وقلت القدرة. منحنى P مع I قطع مكافئ قمته عند \\(I=E/2r_i\\) — ارسمه في المختبر.'},
  {h:'المجموعات',ref:'ص 40',html:`<p>«وفي حالة المجموعة المختلطة تكون القدرة القصوى التي تعطيها المجموعة للحمل عندما يكون» \\(m\\times R=n\\times r_i\\).</p>
   <p>«وفي حالات مجموعة البطاريات على التوالي فإن أقصى تيار \\(I_{max}\\) تعطيه المجموعة عندما يكون» \\(n\\,r_i\\ll R\\)، «وفي حالة مجموعة البطاريات على التوازي فإن أقصى تيار \\(I_{max}\\) تعطيه المجموعة عندما يكون» \\(R\\ll r_i/n\\).</p>`},
  {h:'مثال (2-2)',ref:'ص 40',html:`<p>«مجموعة بطاريات تتكون من <span class="ltr">15</span> خلية كل منها <span class="ltr">1.4 V</span> ولها مقاومة داخلية <span class="ltr">0.8Ω</span> ومحملة بمقاومة قدرها <span class="ltr">30Ω</span>. أوجد: (أ) تيار التغذية، (ب) الجهد على طرفي البطارية.»</p>
   <p>الحل (الخلايا على التوالي): \\(E=15\\times1.4=21\\ V\\)، المقاومة الداخلية \\(0.8\\times15=12\\ \\Omega\\)، الكلية \\(12+30=42\\ \\Omega\\)؛ (أ) \\(I=21/42=0.5\\ A\\)؛ (ب) \\(V=IR=0.5\\times30=15\\ V\\) «أو» \\(V=E-Ir=21-0.5\\times12=15\\ V\\).</p>`},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب:</b> نص المثال لا يذكر طريقة التوصيل صراحة، والحل يعامل الخلايا على التوالي. لاحظ أن \\(R=30\\) أكبر من \\(r=12\\): البطارية هنا لا تعطي القدرة القصوى (تعطي 7.5 W، والقصوى 9.19 W عند R = 12 Ω) لكن جودتها أعلى (71%).'},
  {h:'مثال (2-3)',ref:'ص 41',html:`<p>«يوجد <span class="ltr">24</span> خلية والمطلوب تشكيل هذه الخلايا في بطارية مجمعة لتعطي أكبر تيار في مقاومة حمل قدرها <span class="ltr">5 Ω</span>، فإذا كان جهد اللاحمل لكل خلية <span class="ltr">2.1 V</span> ومقاومتها الداخلية <span class="ltr">2 Ω</span>، أوجد أحسن تشكيل وقيمة التيار في الحمل.»</p>
   <p>«شرط الحصول على أعلى تيار هو» \\(m\\times n=N,\\ m\\times R=n\\times r\\) «حيث أن r هي مقاومة الخلية الواحدة، R هي مقاومة الحمل، n هو عدد الخلايا الموصلة على التوالي في كل خط، m هو عدد الخطوط الموصلة على التوازي، N هو العدد الكلي للخلايا.»</p>
   $$m\\times R=n\\times r\\quad\\text{or}\\quad 5m=2n\\quad\\text{or}\\quad n=\\tfrac52\\,m \\qquad (1)$$ $$m\\times n=N=24 \\qquad (2)$$
   <p>«وبالتعويض من (1) في (2) نحصل على» \\(\\tfrac52 m^2=24\\) أو \\(m^2=24\\times2/5=9.6\\). «وبالتالي يمكن أن نحسب m = 3 خطاً، فيكون n = 8 خلية في كل خط»، والتيار:</p>
   $$I=\\frac{n\\times E}{R+\\frac{n\\times r}{m}}=\\frac{8\\times2.1}{5+\\frac{8\\times2}{3}}=1.63\\ A$$`},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب: لماذا m = 3؟</b> \\(\\sqrt{9.6}\\approx3.1\\)، لكن عدد الخطوط يجب أن يكون عدداً صحيحاً يقسم 24 (1، 2، 3، 4، 6، …). نقارن الأقرب: \\(m=3,n=8\\) يعطي <span class="ltr">1.63 A</span>، و \\(m=4,n=6\\) يعطي <span class="ltr">1.575 A</span>، و \\(m=2,n=12\\) يعطي <span class="ltr">1.48 A</span>؛ فالتشكيل 3 × 8 هو الأفضل فعلاً.'},
  {h:'تمرين 3',ref:'ص 42',html:Qd('تمرين 3','بطارية تعطي تياراً قدره <span class="ltr">0.6A</span> عندما تكون المقاومة الخارجية <span class="ltr">2.0Ω</span> وتعطي تياراً قدره <span class="ltr">0.2A</span> عندما تكون المقاومة الخارجية <span class="ltr">12Ω</span> أوجد: أ- المقاومة الداخلية. ب- جهد البطارية في حالة اللاحمل.',
    'جهد اللاحمل E والمقاومة الداخلية r لا يتغيران، و \\(E=I(R+r)\\) في الحالتين: \\(0.6(2+r)=0.2(12+r)\\) ← \\(1.2+0.6r=2.4+0.2r\\) ← \\(0.4r=1.2\\) ← <b>\\(r=3\\ \\Omega\\)</b>، ثم \\(E=0.6\\times(2+3)=\\) <b>3 V</b>. (تحقق: \\(0.2\\times(12+3)=3\\ V\\).) جرّب «البطارية المجهولة» في المختبر.')},
  {err:'<span class="fixnote"><b>ملاحظات على الكتاب:</b> (1) ص 40–41: المثالان مرقمان في الكتاب «(3-1)» و«(3-2)» (ورقم (3-1) مكرر مع المثال السابق) والصحيح (2-2) و(2-3). (2) ص 41: رقّم الكتاب المعادلتين «(4.1)» و«(4.2)» ثم أشار إليهما بـ «(1-4) في (2-4)» — رقّمناهما (1) و(2). (3) ص 39: \\(dP/dI=E-2Ir\\) طُبعت بلا الدليل i، وفي ص 40 طُبع شرطا أقصى تيار «r.i ≪ R» و«R ≪ r×i»، والمقصود \\(n\\,r_i\\ll R\\) للتوالي و \\(R\\ll r_i/n\\) للتوازي. لا أخطاء حسابية.</span>'}
 ],
 lab:(el)=>{
  let E=21,ri=12,R=30;const G={N:24,E:2.1,r:2,R:5,preset:'e23',dirty:false};const seenG=new Set(['e23']);const MY={mode:'t3',E:3,r:3,R:2,rec:[],solved:false};const did={};
  el.innerHTML=`<div class="grid cx-lab">
   <div class="panel c5"><h2>بطارية وحمل <small>مبنية على ص 39–40 (القيم الابتدائية من مثال 2-2)</small></h2>
    ${sl('p4E','E: جهد البطارية (اللاحمل)',1,30,0.1,E)}${sl('p4r','r<sub>i</sub>: المقاومة الداخلية',0.1,20,0.1,ri)}${sl('p4R','R: مقاومة الحمل',0.1,100,0.1,R)}
    <div class="cx-row"><button class="btn" id="p4m">اجعل R = r<sub>i</sub></button><button class="btn" id="p4e">قيم مثال (2-2)</button></div>
    <div class="facts">${fact('I = E/(R + r<sub>i</sub>)','p4I')}${fact('V = E − I r<sub>i</sub>','p4V')}${fact('P = V I (في الحمل)','p4P')}${fact('P<sub>max</sub> = E²/4r<sub>i</sub>','p4Pm')}${fact('الضائع داخل البطارية','p4Pi')}${fact('الجودة η','p4eta')}</div><div id="p4msg"></div></div>
   <div class="panel c7"><h2>القدرة في الحمل مع مقاومة الحمل</h2><div class="svgbox" id="p4pr"></div><h2 style="margin-top:12px">القدرة مع التيار \\(P=EI-I^2r_i\\) <small>كما في اشتقاق الكتاب</small></h2><div class="svgbox" id="p4pi"></div></div>
   <div class="panel c12"><h2>أفضل تشكيل لعدد من الخلايا <small>مثال (2-3) ص 41</small></h2>
    <div class="cx-row"><button class="btn" data-p4g="e23">مثال (2-3)</button><button class="btn" data-p4g="e22">مثال (2-2): 15 خلية</button></div>
    <div class="cx-sliders">${sl('p4gN','N: عدد الخلايا',1,48,1,G.N)}${sl('p4gE','E: جهد الخلية',0.5,3,0.1,G.E)}${sl('p4gr','r: مقاومة الخلية',0.1,5,0.1,G.r)}${sl('p4gR','R: مقاومة الحمل',0.1,50,0.1,G.R)}</div>
    <div id="p4gt" class="cx-tbl"></div><div class="svgbox" id="p4gg" style="max-width:820px;margin-inline:auto"></div></div>
   <div class="panel c12"><h2>البطارية المجهولة <small>تمرين 3 ص 42</small></h2>
    <div class="cx-row">${segHTML('my',[['t3','بطارية تمرين 3'],['rnd','بطارية عشوائية']],MY.mode)}</div>
    <p class="sub">لا نعرف E ولا r. غيّر مقاومة الحمل واقرأ الأميتر، وسجّل قراءتين، ثم احسب r و E واكتبهما.</p>
    ${sl('p4yR','مقاومة الحمل R',0.5,30,0.5,MY.R)}
    <div class="facts">${fact('قراءة الأميتر I','p4yI')}</div><div class="cx-row"><button class="btn" id="p4yrec">سجّل القراءة</button><button class="btn" id="p4yclr">امسح التسجيل</button></div><div id="p4yt"></div>
    <div class="cx-row"><label class="ex-in" style="max-width:170px"><span>r (Ω)</span><span class="ex-inbox"><input type="number" step="any" id="p4yr"></span></label><label class="ex-in" style="max-width:170px"><span>E (V)</span><span class="ex-inbox"><input type="number" step="any" id="p4yE"></span></label><button class="btn primary" id="p4ychk">تحقق</button></div><div id="p4ymsg"></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="p4st"></ol></div></div>`;
  B.math(el);const $=s=>el.querySelector(s);
  const draw=()=>{const I=E/(R+ri),V=E-I*ri,P=V*I,Pm=E*E/(4*ri);
   $('#p4E').value=E;$('#p4r').value=ri;$('#p4R').value=R;$('#p4E-v').textContent=fm(E,1)+' V';$('#p4r-v').textContent=fm(ri,1)+' Ω';$('#p4R-v').textContent=fm(R,1)+' Ω';
   $('#p4I').textContent=fm(I,4)+' A';$('#p4V').textContent=fm(V,4)+' V';$('#p4P').textContent=fm(P,4)+' W';$('#p4Pm').textContent=fm(Pm,4)+' W';$('#p4Pi').textContent=fm(I*I*ri,4)+' W';$('#p4eta').textContent=fm(100*R/(R+ri),1)+' %';
   $('#p4msg').innerHTML=Math.abs(R-ri)<0.05?'<div class="callout"><b>R = r<sub>i</sub>:</b> القدرة في الحمل أكبر ما يمكن، والجودة 50%.</div>':`<div class="callout">القدرة الآن ${fm(100*P/Pm,1)}% من القدرة القصوى. ${R>ri?'R أكبر من r<sub>i</sub>: جودة أعلى وقدرة أقل.':'R أصغر من r<sub>i</sub>: تيار أكبر لكن معظم القدرة يضيع داخل البطارية.'}</div>`;
   const Rm=niceMax(Math.max(4*ri,R*1.2)),pts=[],ptsE=[];for(let i=0;i<=200;i++){const x=Rm*i/200,ii=E/(x+ri);pts.push([x,ii*ii*x]);ptsE.push([x,Pm*x/(x+ri)])}
   const ym=niceMax(Pm*1.1);
   $('#p4pr').innerHTML=plotSVG({w:620,h:220,x0:0,x1:Rm,y0:0,y1:ym,yt:ticks(ym),xt:ticks(Rm),xl:'R (Ω)',yl:'P (W)',series:[{pts:ptsE,col:'--muted',w:1.4,dash:'5 4'},{pts,col:'--live'}],
    extra:(X,Y)=>`<path d="M${fx(X(ri))} ${fx(Y(0))}V${fx(Y(ym))}" stroke="var(--blue)" stroke-dasharray="4 3"/>`+S.t(fx(X(ri)+4),fx(Y(ym)+12),'R = ri','b','start')+`<circle cx="${fx(X(R))}" cy="${fx(Y(P))}" r="5" fill="var(--live)"/>`,aria:'القدرة مع مقاومة الحمل'})+`<p class="sub">البرتقالي: القدرة في الحمل. المتقطع الرمادي: الجودة η (على مقياس P<sub>max</sub> = 100%).</p>`;
   const Im=E/ri,pi=[];for(let i=0;i<=200;i++){const x=Im*i/200;pi.push([x,E*x-x*x*ri])}
   $('#p4pi').innerHTML=plotSVG({w:620,h:200,x0:0,x1:Im,y0:0,y1:ym,yt:ticks(ym),xt:ticks(Im,4),xf:v=>fm(v,2),xl:'I (A)',yl:'P (W)',series:[{pts:pi,col:'--blue'}],extra:(X,Y)=>`<path d="M${fx(X(Im/2))} ${fx(Y(0))}V${fx(Y(ym))}" stroke="var(--muted)" stroke-dasharray="4 3"/>`+S.t(fx(X(Im/2)+4),fx(Y(ym)+12),'I = E/2ri','m','start')+`<circle cx="${fx(X(I))}" cy="${fx(Y(P))}" r="5" fill="var(--live)"/>`,aria:'القدرة مع التيار'});};
  const gdraw=()=>{['N','E','r','R'].forEach(k=>{$('#p4g'+k).value=G[k];$('#p4g'+k+'-v').textContent=fm(G[k],k==='N'?0:1)+({E:' V',r:' Ω',R:' Ω'}[k]||'')});
   const all=divs(G.N).map(m=>({m,n:G.N/m,I:groupI(G.N/m,m,G.E,G.r,G.R)})),b=bestGroup(G.N,G.E,G.r,G.R);
   $('#p4gt').innerHTML=`<div class="ex-f">${B.tex(`m^2=\\frac{N\\,r}{R}=\\frac{${G.N}\\times${fm(G.r)}}{${fm(G.R)}}=${fm(G.N*G.r/G.R,4)}\\quad\\Rightarrow\\quad m\\approx${fm(Math.sqrt(G.N*G.r/G.R),3)}`,true)}</div><table class="cx-rec"><thead><tr><th>m</th><th>n</th><th>I</th><th>P في الحمل</th><th>η</th></tr></thead><tbody>${all.map(o=>`<tr class="${o.m===b.m?'cur':''}"><td class="l">${o.m}</td><td class="l">${o.n}</td><td class="l">${fm(o.I,4)} A</td><td class="l">${fm(o.I*o.I*G.R,4)} W</td><td class="l">${fm(100*G.R/(G.R+o.n*G.r/o.m),1)} %</td></tr>`).join('')}</tbody></table><p class="sub">الصف الملون = أحسن تشكيل (m = ${b.m}، n = ${b.n})، ورسمه تحت الجدول.</p>`;
   $('#p4gg').innerHTML=gridSVG({n:b.n,m:b.m,lblE:fm(G.E)+'V',lblR:fm(G.r)+'Ω',lblL:'R = '+fm(G.R)+' Ω',I:'I = '+fm(b.I,3)+' A',flow:true})};
  const GP={e23:{N:24,E:2.1,r:2,R:5},e22:{N:15,E:1.4,r:0.8,R:30}};
  el.querySelectorAll('[data-p4g]').forEach(b=>b.onclick=()=>{Object.assign(G,GP[b.dataset.p4g],{preset:b.dataset.p4g,dirty:false});seenG.add(b.dataset.p4g);gdraw()});
  ['N','E','r','R'].forEach(k=>$('#p4g'+k).oninput=e=>{G[k]=+e.target.value;G.dirty=true;G.preset=null;gdraw()});
  $('#p4E').oninput=e=>{E=+e.target.value;draw()};$('#p4r').oninput=e=>{ri=+e.target.value;draw()};$('#p4R').oninput=e=>{R=+e.target.value;draw()};
  $('#p4m').onclick=()=>{R=ri;draw()};$('#p4e').onclick=()=>{E=21;ri=12;R=30;draw()};
  const ydraw=()=>{const I=MY.E/(MY.R+MY.r);$('#p4yR-v').textContent=fm(MY.R,1)+' Ω';$('#p4yI').textContent=fm(I,3)+' A';
   $('#p4yt').innerHTML=MY.rec.length?`<table class="cx-rec"><thead><tr><th>#</th><th>R</th><th>I</th></tr></thead><tbody>${MY.rec.map((x,i)=>`<tr><td>${i+1}</td><td class="l">${fm(x[0])} Ω</td><td class="l">${fm(x[1],3)} A</td></tr>`).join('')}</tbody></table><p class="sub">من قراءتين: \\(I_1(R_1+r)=I_2(R_2+r)\\).</p>`:'';B.math($('#p4yt'))};
  const newRnd=()=>{MY.E=+(1.5+Math.round(Math.random()*20)/2).toFixed(1);MY.r=+(0.5+Math.round(Math.random()*9)/2).toFixed(1)};
  segBind(el,'my',v=>{MY.mode=v;if(v==='t3'){MY.E=3;MY.r=3}else newRnd();MY.rec=[];MY.solved=false;$('#p4ymsg').innerHTML='';ydraw()});
  $('#p4yR').oninput=e=>{MY.R=+e.target.value;ydraw()};$('#p4yrec').onclick=()=>{MY.rec.push([MY.R,+(MY.E/(MY.R+MY.r)).toFixed(3)]);if(MY.rec.length>4)MY.rec.shift();ydraw()};$('#p4yclr').onclick=()=>{MY.rec=[];ydraw()};
  $('#p4ychk').onclick=()=>{const gr=parseFloat($('#p4yr').value),gE=parseFloat($('#p4yE').value);const ok=Math.abs(gr-MY.r)<=0.05*MY.r+0.02&&Math.abs(gE-MY.E)<=0.03*MY.E+0.02;if(ok&&MY.mode==='t3')MY.solved=true;
   $('#p4ymsg').innerHTML=ok?`<div class="callout"><b>صحيح:</b> r = ${fm(MY.r)} Ω و E = ${fm(MY.E)} V.</div>`:`<div class="callout err">ليس بعد. ${MY.rec.length<2?'سجّل قراءتين بمقاومتين مختلفتين أولاً.':'راجع المعادلة: \\(r=\\frac{I_2R_2-I_1R_1}{I_1-I_2}\\) ثم \\(E=I_1(R_1+r)\\).'}</div>`;B.math($('#p4ymsg'))};
  const steps=stepsUI($('#p4st'),[
   {t:'مثال (2-2)',x:'بالقيم الابتدائية (15 خلية × 1.4 V، المقاومة الداخلية 12 Ω، الحمل 30 Ω): \\(I=0.5\\ A\\) و \\(V=15\\ V\\).'},
   {t:'القدرة القصوى',x:'حرّك R حتى تساوي r<sub>i</sub> (أو اضغط «اجعل R = r<sub>i</sub>»): النقطة على قمة المنحنيين، والقدرة \\(E^2/4r_i\\)، والجودة 50%.',done:()=>Math.abs(R-ri)<0.05},
   {t:'جودة أعلى',x:'اجعل R أكبر من أربعة أضعاف r<sub>i</sub>: تزيد الجودة فوق 80% بينما تنقص القدرة في الحمل.',done:()=>R>=4*ri},
   {t:'أحسن تشكيل',x:'في «أفضل تشكيل» اضغط «مثال (2-3)»: \\(m^2=9.6\\)، والصف الملون m = 3 و n = 8 بتيار 1.63 A. قارنه بـ m = 4.',done:()=>seenG.has('e23')&&G.preset==='e23'},
   {t:'البطارية المجهولة',x:'في «بطارية تمرين 3»: اجعل R = 2 Ω وسجّل، ثم R = 12 Ω وسجّل (0.6 A و 0.2 A كما في التمرين)، واحسب r و E واكتبهما ثم «تحقق».',done:()=>MY.solved}
  ]);
  draw();gdraw();ydraw();loopOn(el,()=>steps.check());
 },
 examples:[
  {title:'مثال (2-2)',ref:'ص 40',q:'<p>«مجموعة بطاريات تتكون من 15 خلية كل منها 1.4 V ولها مقاومة داخلية 0.8Ω ومحملة بمقاومة قدرها 30Ω. أوجد: (أ) تيار التغذية، (ب) الجهد على طرفي البطارية.»</p>',
   given:[{id:'N',label:'عدد الخلايا',sym:'n',unit:'',value:15,min:1},{id:'E',label:'جهد الخلية',sym:'E',unit:'V',value:1.4},{id:'r',label:'المقاومة الداخلية للخلية',sym:'r',unit:'Ω',value:0.8},{id:'R',label:'مقاومة الحمل',sym:'R',unit:'Ω',value:30}],
   solve:g=>{const Eb=g.N*g.E,rb=g.N*g.r,Rt=rb+g.R,I=Eb/Rt;return [{t:'جهد البطارية:',f:`E=${fm(g.N)}\\times${fm(g.E)}`,v:fm(Eb,6),unit:'V'},{t:'المقاومة الداخلية الكلية للمجموعة:',f:`${fm(g.r)}\\times${fm(g.N)}`,v:fm(rb,6),unit:'Ω'},{t:'المقاومة الكلية للدائرة:',f:`${fm(rb,6)}+${fm(g.R)}`,v:fm(Rt,6),unit:'Ω'},
    {t:'(أ) تيار التغذية:',f:`I=\\frac{${fm(Eb,6)}}{${fm(Rt,6)}}`,v:fm(I,4),unit:'A',final:true},{t:'(ب) الجهد على طرفي البطارية:',f:`V=I\\times R=${fm(I,4)}\\times${fm(g.R)}`,v:fm(I*g.R,4),unit:'V',final:true},{t:'أو:',f:`V=E-I\\times r=${fm(Eb,6)}-${fm(I,4)}\\times${fm(rb,6)}`,v:fm(Eb-I*rb,4),unit:'V'}]}},
  {title:'مثال (2-3)',ref:'ص 41',q:'<p>«يوجد 24 خلية والمطلوب تشكيل هذه الخلايا في بطارية مجمعة لتعطي أكبر تيار في مقاومة حمل قدرها 5 Ω، فإذا كان جهد اللاحمل لكل خلية 2.1 V ومقاومتها الداخلية 2 Ω، أوجد أحسن تشكيل وقيمة التيار في الحمل.»</p>',
   given:[{id:'N',label:'العدد الكلي للخلايا',sym:'N',unit:'',value:24,min:1,step:1},{id:'E',label:'جهد اللاحمل للخلية',sym:'E',unit:'V',value:2.1},{id:'r',label:'المقاومة الداخلية للخلية',sym:'r',unit:'Ω',value:2},{id:'R',label:'مقاومة الحمل',sym:'R',unit:'Ω',value:5}],solve:g=>ex23({N:Math.max(1,Math.round(g.N)),E:g.E,r:g.r,R:g.R})},
  {title:'تمرين 3 — إجابة مقترحة (ليست من الكتاب)',ref:'ص 42',q:'<p>بطارية تعطي 0.6A مع مقاومة خارجية 2.0Ω، و 0.2A مع 12Ω. أوجد: أ- المقاومة الداخلية. ب- جهد البطارية في حالة اللاحمل.</p>',
   given:[{id:'I1',label:'التيار الأول',sym:'I_1',unit:'A',value:0.6},{id:'R1',label:'المقاومة الأولى',sym:'R_1',unit:'Ω',value:2},{id:'I2',label:'التيار الثاني',sym:'I_2',unit:'A',value:0.2},{id:'R2',label:'المقاومة الثانية',sym:'R_2',unit:'Ω',value:12}],
   solve:g=>{const r=(g.I2*g.R2-g.I1*g.R1)/(g.I1-g.I2),E=g.I1*(g.R1+r);return [{t:'جهد اللاحمل E والمقاومة الداخلية r ثابتان، فمن \\(E=I(R+r)\\) في الحالتين:',f:`${fm(g.I1)}(${fm(g.R1)}+r)=${fm(g.I2)}(${fm(g.R2)}+r)`},
    {t:'أ- المقاومة الداخلية:',f:`r=\\frac{I_2R_2-I_1R_1}{I_1-I_2}=\\frac{${fm(g.I2*g.R2,6)}-${fm(g.I1*g.R1,6)}}{${fm(g.I1)}-${fm(g.I2)}}`,v:fm(r,4),unit:'Ω',final:true},
    {t:'ب- جهد اللاحمل:',f:`E=I_1(R_1+r)=${fm(g.I1)}\\times(${fm(g.R1)}+${fm(r,4)})`,v:fm(E,4),unit:'V',final:true},{t:'تحقق بالقراءة الثانية:',f:`I_2(R_2+r)`,v:fm(g.I2*(g.R2+r),4),unit:'V'}]}}
 ],
 quiz:[
  {q:'تعطي البطارية أكبر قدرة للحمل عندما:',o:['تكون مقاومة الحمل صفراً','تساوي مقاومة الحمل المقاومة الداخلية للبطارية','تكون مقاومة الحمل لا نهائية','يكون التيار أكبر ما يمكن'],c:1,e:'ص 39–40.'},
  {q:'من اشتقاق الكتاب: \\(P=EI-I^2r_i\\)، القدرة القصوى عندما:',o:['\\(E=I\\,r_i\\)','\\(E=2\\,I\\,r_i\\)','\\(I=0\\)','\\(E=I^2r_i\\)'],c:1,e:'\\(dP/dI=E-2Ir_i=0\\).'},
  {q:'بطارية \\(E=12\\ V\\) و \\(r_i=3\\ \\Omega\\). القدرة القصوى التي تعطيها للحمل:',o:['48 W','12 W','36 W','6 W'],c:1,e:'عند R = 3 Ω: \\(I=2\\ A\\) و \\(P=2^2\\times3=12\\ W\\) (\\(E^2/4r_i\\)).'},
  {q:'في مثال (2-2) الجهد على طرفي البطارية:',o:['21 V','15 V','12 V','6 V'],c:1,e:'\\(V=0.5\\times30=15\\ V\\).'},
  {q:'شرط القدرة القصوى للمجموعة المختلطة:',o:['\\(m\\times R=n\\times r_i\\)','\\(m=n\\)','\\(R=n\\,r_i\\)','\\(R=r_i/m\\)'],c:0,e:'ص 40.'},
  {q:'في مثال (2-3) أحسن تشكيل لـ 24 خلية:',o:['4 خطوط × 6 خلايا','3 خطوط × 8 خلايا','2 × 12','24 على التوالي'],c:1,e:'ص 41: m = 3، n = 8، و I = 1.63 A.'},
  {q:'بطارية تعطي 0.6 A مع 2 Ω و 0.2 A مع 12 Ω. مقاومتها الداخلية:',o:['1 Ω','2 Ω','3 Ω','5 Ω'],c:2,e:'تمرين 3: \\(0.6(2+r)=0.2(12+r)\\).'},
  {q:'عند القدرة القصوى تكون جودة البطارية:',o:['100%','50%','25%','66.6%'],c:1,e:'نصف القدرة في الحمل ونصفها داخل البطارية (ص 37).'}
 ]
});

})(PLCBOOK);
