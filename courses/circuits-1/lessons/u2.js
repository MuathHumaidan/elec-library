/* دوائر كهربائية-1 — الوحدة الثانية «البطاريات» (ص 25–42): الدروس u2-l1 … u2-l4 */
(function(B){
const {S}=B;
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
  {err:'<b>ملاحظة على الكتاب (ص 29):</b> طُبع «القطب السالب (المهبط) … القطب الموجب (المصعد)»، والتسمية معكوسة: في الخلية التي تعطي تياراً <b>القطب السالب هو المصعد (الأنود)</b> حيث يتأكسد الزنك، و<b>القطب الموجب هو المهبط (الكاثود)</b>. حذفنا الكلمتين من النص أعلاه.'},
  {h:'الأنواع الرئيسة من البطاريات الأولية الجافة',ref:'ص 29–31',html:`<ol><li><b>خلايا الكربون-الخارصين</b>: «تستعمل في كشّافات الضوء اليدوية، ووحدات توليد الومضات الكهربائية لأجهزة وآلات التصوير، وفي لعب الأطفال. وتسمى هذه الخلايا أيضاً عمود لكلانشيه الجاف، وهي مُصممة داخل عبوة من الخارصين. وتستخدم العلبة كإناء لمحتويات الخلية، وفي الوقت نفسه تقوم بعمل القطب السالب. يعمل عمود الكربون الموجود في مركز الخلية كمجمع تيار للقطب الموجب، إلا أن المادة الفعلية المكوّنة للقطب الموجب هي خليط من ثاني أكسيد المنجنيز ومسحوق الكربون … ويوجد الإلكتروليت في هذه الخلايا في صورة معجون يتكوّن من كلوريد الأمونيوم وكلوريد الخارصين والماء.» والعازل الرقيق بين القطبين «يمنع المواد المكونة للأقطاب من الاختلاط … مثل هذا الاختلاط من شأنه أن يؤدي إلى تآكل القطب السّالب الخارصيني قبل الأوان، والتقليل من العمر الافتراضي للبطارية.»</li>
   <li><b>الخلايا القاعدية</b>: «تشبه خلايا الكربون-الخارصين» في مواد القطبين، لكن قطبها السالب «من الخارصين يغلب عليه التكوين المسامي الذي يتأكسد بدرجة أسرع»، والإلكتروليت «محلول قلوي قوي يحتوي على مركب <b>هيدروكسيد البوتاسيوم</b>» يوصل الكهرباء بفاعلية أكبر، فتولد «تياراً عالياً يستمر بكفاءة أعلى». «عمرها الافتراضي أطول بما يتراوح بين <b>5 و 8 مرات</b>».</li>
   <li><b>خلايا الزئبق</b>: «قطب سالب من الخارصين، وقطب موجب من أكسيد الزئبقيك، تحتوي على إلكتروليت هيدروكسيد البوتاسيوم. ويتحول الخارصين إلى أكسيد الخارصين، ويتحوّل أكسيد الزئبقيك إلى زئبق خلال عملية الاستهلاك، كما يتبقّى مركّب هيدروكسيد البوتاسيوم دون تغير.»</li></ol>`},
  {err:'<b>ملاحظات على الكتاب:</b> (1) ص 26: رقم الهدف الأخير طُبع (5) مكرراً والصحيح (7)، وطُبع «الأنواع البطاريات» — صُحّحا في قائمة الأهداف أعلاه. (2) ص 28: كُتب اسم الخلية «Laclanche» والصحيح <span class="ltr">Leclanché</span> (لكلانشيه).'}
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
  {err:'<b>ملاحظات على الكتاب:</b> (1) ص 33: طُبع أن القطب السالب في خلية <b>النيكل-حديد</b> «من الكادميوم الإسفنجي»، والصحيح أنه من <b>الحديد</b> (ولهذا سميت نيكل-حديد). (2) ص 32: الإشارة إلى «الشكل (2-2)» بعد جهود الشحن لا تناسب، فالشكل رسم تركيبي لا يبين الجهود. (3) أخطاء طباعة صُحّحت في النص: «حام» ← «حامض»، «كبريتلت» ← «كبريتات». (4) ص 33: العنوان يذكر «تيار الشحن» ولا يشرحه (أضفنا توضيحاً).'}
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
  const draw=()=>{const {n,m,E,r,R}=st,N=n*m,rb=n*r/m,I=groupI(n,m,E,r,R);
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
  {err:'<b>ملاحظات على الكتاب:</b> (1) ص 37–39: رقّم الكتاب أمثلة الوحدة الثانية «(3-1)، (3-1)، (3-2)» والصحيح (2-1)، (2-2)، (2-3) — استعملنا الترقيم الصحيح. (2) ص 37: نص المثال (2-1) ج يقول «بكل صف خليتان <b>متوازيتان</b>» والحل والشكل يعاملان الخليتين على التوالي — صحّحناها في النص. والخطأ نفسه في تمرين 1 ج (ص 42)، وفيه أيضاً «خليتان» مع أن الخلايا ثمانٍ (انظر الإجابة المقترحة). (3) ص 39: كُتب «1/4 + 1/4 = 2Ω»، والصحيح \\(1/r=1/4+1/4=0.5\\) فتكون \\(r=2\\ \\Omega\\) (النتيجة صحيحة). (4) ص 35: جملة المقاومة الداخلية لتجميع التوازي ناقصة في الكتاب («لمجموعة خلايا قدره خلية…») وأعدنا صياغتها. (5) طباعة: «ما يالي» و«التولي». لا أخطاء حسابية.'}
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
  {err:'<b>ملاحظات على الكتاب:</b> (1) ص 40–41: المثالان مرقمان في الكتاب «(3-1)» و«(3-2)» (ورقم (3-1) مكرر مع المثال السابق) والصحيح (2-2) و(2-3). (2) ص 41: رقّم الكتاب المعادلتين «(4.1)» و«(4.2)» ثم أشار إليهما بـ «(1-4) في (2-4)» — رقّمناهما (1) و(2). (3) ص 39: \\(dP/dI=E-2Ir\\) طُبعت بلا الدليل i، وفي ص 40 طُبع شرطا أقصى تيار «r.i ≪ R» و«R ≪ r×i»، والمقصود \\(n\\,r_i\\ll R\\) للتوالي و \\(R\\ll r_i/n\\) للتوازي. لا أخطاء حسابية.'}
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
