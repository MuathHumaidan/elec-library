/* دوائر كهربائية-1 — الوحدة الأولى «المكثفات الكهربائية» (ص 1–24): المقدمة والتمهيد + الدروس u1-l1 … u1-l4 */
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

/* الشكل (1-1): capacitor photo (drawn) + parallel plates */
function fig11SVG(){let s=`<svg viewBox="0 0 640 230" role="img" aria-label="مكثف مكون من لوحين متوازيين">`;
  // left: three real capacitors (drawn instead of the photo)
  s+=`<rect x="30" y="70" width="130" height="64" rx="16" fill="var(--blue-soft)" stroke="var(--blue)" stroke-width="2"/><path d="M10 102H30M160 102H180" stroke="var(--wire)" stroke-width="3"/>`+S.t(95,98,'1000 μF','b')+S.t(95,116,'35 V','b');
  s+=`<rect x="200" y="62" width="44" height="64" rx="10" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.6"/><rect x="230" y="62" width="10" height="64" fill="var(--muted)" opacity=".5"/><path d="M212 126V176M232 126V170" stroke="var(--wire)" stroke-width="2.4"/>`;
  s+=`<ellipse cx="290" cy="90" rx="26" ry="24" fill="var(--live-soft)" stroke="var(--live)" stroke-width="2"/><path d="M280 112V170M300 112V170" stroke="var(--wire)" stroke-width="2.4"/>`;
  s+=arT(160,206,'أمثلة لمكثفات: إلكتروليتي كبير، إلكتروليتي صغير، سيراميكي قرصي',{fs:12,col:'--muted'});
  // right: plates
  s+=`<path d="M490 20V70M490 160V210" stroke="var(--fg)" stroke-width="2.4"/><rect x="400" y="70" width="180" height="12" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/><rect x="400" y="148" width="180" height="12" fill="var(--blue)" stroke="var(--fg)" stroke-width="1.6"/><rect x="400" y="82" width="180" height="66" fill="var(--surface-2)" opacity=".8"/>`;
  s+=arrow(620,60,584,74,'--stop',1.8)+arrow(620,60,584,152,'--stop',1.8)+arT(616,48,'لوحين',{fs:13,a:'middle'});
  s+=arrow(372,190,440,128,'--stop',1.8)+arT(372,208,'طبقة عازلة',{fs:13});
  return s+'</svg>'}
/* الشكل (1-2): symbols table */
function fig12SVG(){let s=`<svg viewBox="0 0 600 210" role="img" aria-label="رموز أنواع المكثفات">`;
  const cols=[[500,'مكثف عادي',{}],[300,'مكثف مستقطب',{pol:1}],[100,'مكثف متغير',{vari:1}]];
  s+=`<rect x="10" y="10" width="580" height="190" rx="8" fill="none" stroke="var(--line)"/><path d="M10 46H590M200 10V200M400 10V200" stroke="var(--line)"/>`;
  cols.forEach(([cx,t,o])=>{s+=arT(cx,34,t,{fs:14});
    [[100,'curved'],[160,o.pol?'hollow':'']].forEach(([y,kind])=>{s+=`<path class="w" d="M${cx-60} ${y}H${cx-5}M${cx+5} ${y}H${cx+60}" style="stroke:var(--fg)"/>`+capSym(cx,y,{kind,pol:o.pol,vari:o.vari,h:28})})});
  return s+'</svg>'}

/* ======================================================================
   Lesson 1 — المقدمة والتمهيد + المكثف وسعته (ص 1، 6–10)
   ====================================================================== */
const EPS0=8.854e-12,EPS0_BOOK=4*Math.PI*1e-7;
function plateSVG(o){const W=560,H=270,cx=330,cy=135;const Lp=Math.max(40,440*Math.sqrt(o.A/1000)),g=14+16*o.d,x1=cx-Lp/2,x2=cx+Lp/2,yt=cy-g/2,yb=cy+g/2;
  const fillM={air:'none',plastic:'var(--blue-soft)',mica:'var(--live-soft)',ceramic:'var(--surface-2)',custom:'var(--blue-soft)'}[o.mat];
  let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="مكثف لوحين متوازيين">`;
  // source on the left
  s+=wire(`M${fx(cx)} ${fx(yt-10)}V22H70V${cy-12}`)+wire(`M${fx(cx)} ${fx(yb+10)}V${H-22}H70V${cy+12}`);
  s+=`<path d="M52 ${cy-12}H88" stroke="var(--fg)" stroke-width="3"/><path d="M60 ${cy+12}H80" stroke="var(--fg)" stroke-width="5"/>`+S.t(46,cy-14,'+','','end')+S.t(46,cy+20,'−','','end')+S.t(100,cy+5,'V = '+fm(o.V,0)+' V','b','start');
  if(fillM!=='none')s+=`<rect x="${fx(x1)}" y="${fx(yt+5)}" width="${fx(Lp)}" height="${fx(g-10)}" fill="${fillM}" stroke="var(--line)"/>`;
  // field lines
  const nE=Math.min(Math.floor(Lp/12),o.nE);for(let i=0;i<nE;i++){const x=x1+Lp*(i+0.5)/nE;s+=arrow(x,yt+7,x,yb-6,'--blue',1.3)}
  s+=`<rect x="${fx(x1)}" y="${fx(yt-5)}" width="${fx(Lp)}" height="10" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/><rect x="${fx(x1)}" y="${fx(yb-5)}" width="${fx(Lp)}" height="10" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/>`;
  const nq=Math.min(Math.floor(Lp/10),o.nq);for(let i=0;i<nq;i++){const x=x1+Lp*(i+0.5)/nq;s+=`<text class="txt" x="${fx(x)}" y="${fx(yt-9)}" text-anchor="middle" style="fill:var(--stop)">+</text><text class="txt" x="${fx(x)}" y="${fx(yb+19)}" text-anchor="middle" style="fill:var(--blue-ink)">−</text>`}
  // dimension marks
  s+=`<path d="M${fx(x2+16)} ${fx(yt)}V${fx(yb)}" stroke="var(--muted)" stroke-dasharray="3 3"/>`+S.t(fx(x2+22),cy+4,'d = '+fm(o.d,1)+' mm','m','start');
  s+=S.t(cx,H-6,'A = '+fm(o.A,0)+' cm²','m');
  return s+'</svg>'}

B.lesson({
 id:'u1-l1',unit:1,order:1,pages:'1، 6–10',
 title:'المكثف الكهربائي: تعريفه وأنواعه وسعته',
 summary:'مقدمة الحقيبة وتمهيدها وأهداف الوحدة الأولى، ثم المكثف: لوحان موصلان بينهما عازل، يسمى باسم عازله، وسعته (الشحنة ÷ الجهد) بالفاراد وأجزائه، وتعتمد على مساحة اللوحين والمسافة بينهما والعازل، ورموز أنواع المكثفات.',
 theory:[
  {h:'مقدمة الحقيبة',ref:'ص 1',html:`<p>«تسعى المؤسسة العامة للتدريب التقني والمهني لتأهيل الكوادر الوطنية المدربة القادرة على شغل الوظائف التقنية والفنية والمهنية المتوفرة في سوق العمل …» وقد بنت الإدارة العامة لتصميم وتطوير المناهج برامجها على <b>المعايير المهنية الوطنية</b> التي تعدها لجان تخصصية تمثل سوق العمل والمؤسسة.</p>
   <p>«وتتناول هذه الحقيبة التدريبية "دوائر كهربائية - ١" لمتدربي تخصصات <b>الآلات والمعدات الكهربائية والقوى الكهربائية ومشغل لوحة التحكم</b> للكليات التقنية موضوعات حيوية تتناول كيفية اكتساب المهارات اللازمة لهذا التخصص» «بأسلوب مبسط يخلو من التعقيد، مدعم بالتطبيقات والأشكال».</p>`},
  {h:'تمهيد',ref:'ص 6',html:`<p>«تتناول هذه الحقيبة أهم الموضوعات المتعلقة بأساسيات الهندسة الكهربائية. وتحتوي على ست وحدات أساسية»:</p>
   <ol><li><b>المكثفات الكهربائية</b>: طرق حساب سعتها وطرق توصيلها وحساب الطاقة المختزنة فيها.</li>
   <li><b>البطاريات</b>: «مجموعة من الخلايا الكهربائية» بنوعيها الابتدائية والثانوية، وطرق تجميعها.</li>
   <li><b>دوائر التيار المستمر</b>: شدة التيار وفرق الجهد والمقاومة، قانون أوم، القدرة والطاقة، دوائر التوالي والتوازي والمركبة، وقانونا كيرشوف.</li>
   <li><b>تحليل الدوائر الكهربائية البسيطة</b>: قوانين ونظريات وطرق للتحليل.</li>
   <li><b>المغناطيسية الكهربائية</b>: المغناطيسية الطبيعية، خطوط القوى، الفيض وكثافته، والمواد المغناطيسية وغير المغناطيسية.</li>
   <li><b>الدوائر المغناطيسية</b>: العناصر والكميات المغناطيسية والقوانين التي تحكم الدائرة المغناطيسية وأساليب تحليلها.</li></ol>`},
  {h:'الوحدة الأولى: المكثفات الكهربائية — الأهداف',ref:'ص 7–8',html:`<p><b>الهدف العام للوحدة:</b> «معرفة وفهم المكثفات الكهربائية وطرق توصيلها وحساب سعتها الكلية.»</p>
   <p><b>الأهداف التفصيلية:</b> أن يتمكن المتدرب من:</p>
   <ol><li>تركيب المكثف الكهربائي وحساب سعته.</li><li>إيجاد العلاقة بين الشحنة والجهد والسعة.</li><li>توصيل المكثفات على التوازي والتوالي.</li><li>حساب السعة الإجمالية لمجموعة من المكثفات.</li><li>حساب الطاقة المخزونة في المكثفات.</li></ol>
   <p class="sub">هذا الدرس يغطي الهدفين 1 و2، والدروس التالية: التوالي (u1-l2)، التوازي والتوصيل المركب (u1-l3)، الطاقة المختزنة (u1-l4).</p>`},
  {h:'تعريف المكثف',ref:'ص 9',html:`<p>«المكثف هو عنصر يستعمل <b>لتخزين الطاقة الكهربائية</b> بفعل الإجهاد الكهروستاتيكي في المادة العازلة <span class="ltr">(Electrostatic Stress)</span>. ويتكون المكثف الكهربي من <b>لوحين من مادة موصلة بينهما مادة عازلة</b> يطلق عليها اسم العازل الكهربائي» الشكل (1-1).</p>
   <p>«يتحدد نوع المكثف على حسب المادة العازلة المستخدمة في صناعته»:</p>
   <table class="tt"><thead><tr><th>المادة العازلة</th><th>اسم المكثف</th></tr></thead><tbody>
   <tr><td>الهواء</td><td>المكثف الهوائي</td></tr><tr><td>البلاستيك</td><td>مكثف بلاستيك</td></tr><tr><td>الميكا</td><td>مكثف ميكا</td></tr><tr><td>السيراميك</td><td>المكثف السيراميك</td></tr><tr><td>محلول كيماوي</td><td>المكثف الكيماوي أو الإلكترولتي</td></tr></tbody></table>`},
  {fig:'(1-1)',ref:'ص 10',caption:'مكثف مكون من لوحين متوازيين. في الكتاب على اليسار صورة لثلاثة مكثفات حقيقية (إلكتروليتي أسطواني كبير مكتوب عليه 1000 μF 35 V تقريباً، وإلكتروليتي صغير، وسيراميكي قرصي) — هنا رسم مبسط لها — وعلى اليمين رسم اللوحين والطبقة العازلة بينهما.',draw:()=>box(fig11SVG(),640)},
  {h:'سعة المكثف الكهربائي',ref:'ص 9',html:`<p>«تعرف سعة المكثف <span class="ltr">(Capacitance)</span> بقدرته على تخزين الطاقة الكهربائية عند فرق جهد معين بين سطحيه. وهي تعرف أيضاً بقدرة المكثف على <b>تخزين الشحنة الكهربائية</b> عند فرق جهد معين. تقاس سعة المكثف بوحدة تسمى <b>الفاراد (F)</b>، فإذا اكتسب أحد اللوحين في مكثف شحنة مقدارها Q كولوم (C)، مما يؤدي إلى جعل فرق الجهد بين طرفيه V فولت فإنه … تصبح قيمة السعة C بالفاراد عبارة عن:»</p>
   $$C=\\frac{Q}{V}\\quad \\text{F (Coulomb / Volt)} \\qquad (1\\text{-}1)$$
   <p>«حيث إن:»</p>$$C=\\frac{\\varepsilon\\,A}{d} \\qquad\\qquad \\varepsilon=\\varepsilon_0\\times\\varepsilon_r$$
   <p>«حيث A هي <b>مساحة سطح اللوح</b> بالمتر المربع، d هي <b>المسافة بين اللوحين</b> بالمتر، \\(\\varepsilon_r\\) هو <b>معامل السماحية النسبية للعازل</b>، \\(\\varepsilon_0\\) معامل سماحية الفراغ (الهواء)»، وقيمته الصحيحة \\(\\varepsilon_0\\approx 8.854\\times10^{-12}\\ \\text{F/m}\\).</p>`},
  {err:'<b>ملاحظات على الكتاب (ص 9):</b> طُبعت قيمة سماحية الفراغ \\(\\varepsilon_0=4\\pi\\times10^{-7}\\)، وهذه في الحقيقة قيمة <b>النفاذية المغناطيسية للفراغ</b> \\(\\mu_0\\) (بوحدة H/m) التي ستأتي في الوحدة الخامسة. القيمة الصحيحة لسماحية الفراغ \\(\\varepsilon_0\\approx 8.854\\times10^{-12}\\ \\text{F/m}\\). لو استعملنا قيمة الكتاب لخرجت السعة أكبر بحوالي <span class="ltr">142000</span> مرة. في المختبر مفتاح «كما في الكتاب / المصحح» لترى الفرق بنفسك. (ويكتب الكتاب الرمز أحياناً ϵ وأحياناً ε، وهما الشيء نفسه.)'},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب:</b> العلاقة \\(C=\\varepsilon A/d\\) تقول ثلاثة أشياء: (1) لوحان <b>أكبر مساحة</b> يتسعان لشحنة أكبر فتزيد السعة؛ (2) لوحان <b>أقرب</b> إلى بعضهما (d أصغر) تزيد سعتهما؛ (3) العازل يضرب السعة في \\(\\varepsilon_r\\) (للهواء \\(\\varepsilon_r\\approx1\\)). قيم نموذجية تقريبية: البلاستيك نحو 2–3، الميكا نحو 5–7، والسيراميك من نحو 6 إلى آلاف حسب نوعه. والمكثف الإلكتروليتي سعته كبيرة لأن طبقته العازلة رقيقة جداً. مثال: لوحان مساحة كل منهما \\(100\\ \\text{cm}^2=0.01\\ \\text{m}^2\\) في الهواء وبينهما \\(1\\ \\text{mm}\\): \\(C=8.854\\times10^{-12}\\times0.01/0.001\\approx 88.5\\ \\text{pF}\\) فقط.'},
  {h:'رمز المكثف',ref:'ص 10',html:'<p>للمكثف رموز في المخططات حسب نوعه: <b>عادي</b>، و<b>مستقطب</b> (له طرف موجب يجب توصيله بالموجب، تدل عليه علامة +)، و<b>متغير</b> (سعته تتغير، يدل عليه سهم مائل يخترق الرمز) — الشكل (1-2).</p>'},
  {fig:'(1-2)',ref:'ص 10',caption:'رموز أنواع المكثفات: لكل نوع رمزان: خط مستقيم يقابله خط منحنٍ، ولوحان متوازيان. في المستقطب علامة + فوق اللوح الموجب (وفي رمزه الثاني لوح مفرغ مقابل لوح مصمت)، وفي المتغير سهم مائل.',draw:()=>box(fig12SVG(),600)},
  {h:'الفاراد وأجزاؤه',ref:'ص 10',html:`<p>«ويكون تعريف الفاراد في هذه الحالة أنه <b>سعة المكثف الذي يصبح فرق الجهد بين لوحيه فولتاً واحداً عندما يكتسب شحنة تساوي كولوم واحد</b>. والفاراد يعتبر وحدة كبيرة جداً من الناحية العملية ولذلك يستعمل عادة الميكروفاراد \\((1\\mu F=10^{-6}F)\\) في تحديد قيمة السعة.» «فإنه من المناسب استخدام أجزاء من الفاراد للتعبير عن سعة المكثف مثل المايكروفاراد μF أو النانوفاراد nF أو البيكوفاراد pF.»</p>
   <table class="tt"><thead><tr><th>الاختصار</th><th>Prefix</th><th>المسمى</th><th>القيمة بالفاراد</th><th>أو</th></tr></thead><tbody>
   <tr><td>p</td><td>pico</td><td>بيكو</td><td>${lt('0.000000000001')}</td><td>\\(10^{-12}\\)</td></tr>
   <tr><td>n</td><td>nano</td><td>نانو</td><td>${lt('0.000000001')}</td><td>\\(10^{-9}\\)</td></tr>
   <tr><td>μ</td><td>micro</td><td>مايكرو</td><td>${lt('0.000001')}</td><td>\\(10^{-6}\\)</td></tr>
   <tr><td>m</td><td>milli</td><td>ملي</td><td>${lt('0.001')}</td><td>\\(10^{-3}\\)</td></tr></tbody></table>`},
  {widget:(el)=>{let v=4.7,u=-6;const U=[[-12,'pF'],[-9,'nF'],[-6,'μF'],[-3,'mF'],[0,'F']];
    el.innerHTML=`<figure class="fig"><h3 class="sm" style="margin:0">حوّل بين أجزاء الفاراد <span class="sub">(توضيح للمتدرب — ليس من الكتاب)</span></h3>
     <div class="cx-row"><label class="ex-in" style="max-width:180px"><span>القيمة</span><span class="ex-inbox"><input type="number" step="any" id="cvv" value="${v}"></span></label>${segHTML('cvu',U,u)}</div>
     <div class="cx-tbl"><table class="tt" id="cvt"></table></div></figure>`;
    const draw=()=>{const F=v*Math.pow(10,u);el.querySelector('#cvt').innerHTML='<tbody>'+U.map(([e,n])=>`<tr class="${e===u?'cur':''}"><td>${n}</td><td><span class="ltr">${fm(F/Math.pow(10,e),6)} ${n}</span></td><td><span class="ltr">= ${eSci(F)} F</span></td></tr>`).join('')+'</tbody>'};
    el.querySelector('#cvv').oninput=e=>{v=parseFloat(e.target.value)||0;draw()};segBind(el,'cvu',x=>{u=+x;draw()});draw()}},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب:</b> من المعادلة (1-1) نحصل على صورتين أخريين نستعملهما كثيراً في الدروس التالية: \\(Q=C\\,V\\) و \\(V=Q/C\\). مثلاً مكثف \\(2\\ \\mu F\\) على \\(100\\ V\\) يخزن \\(Q=2\\times10^{-6}\\times100=2\\times10^{-4}\\ C\\). جرّبها في تبويب «الأمثلة المحلولة».'}
 ],
 lab:(el)=>{
  const MAT=[['air','هواء'],['plastic','بلاستيك'],['mica','ميكا'],['ceramic','سيراميك'],['custom','ε<sub>r</sub> من عندك']];
  let A=100,d=1,V=100,mat='air',erC=4,eps='fix';const did={};
  el.innerHTML=`<div id="l1tp"></div><div class="grid cx-lab">
   <div class="panel c7"><h2>مكثف اللوحين المتوازيين <small>مبنية على الشكل (1-1) ص 10 والعلاقات في ص 9</small></h2>
    <div class="svgbox" id="l1v" style="max-width:560px;margin-inline:auto"></div>
    <p class="sub">إشارات + و − على اللوحين تتناسب مع الشحنة Q، والأسهم الزرقاء (المجال بين اللوحين) تتناسب مع V/d، والمقارنة بالوضع الابتدائي (100 cm² و 1 mm وهواء و 100 V). الرسم تقريبي ولا يتسع لأكثر من عدد معين من الإشارات.</p></div>
   <div class="panel c5"><h2>التحكم</h2>
    ${sl('l1A','مساحة اللوح A',10,1000,10,A)}${sl('l1d','المسافة بين اللوحين d',0.1,10,0.1,d)}
    <div class="sub" style="margin-top:10px">المادة العازلة</div>${segHTML('mat',MAT,mat)}
    <div id="l1erB">${sl('l1er','السماحية النسبية ε<sub>r</sub>',1,100,1,erC)}</div>
    ${sl('l1V','فرق الجهد V',0,1000,10,V)}
    <div class="sub" style="margin-top:10px">قيمة ε<sub>0</sub> المستعملة</div>${segHTML('eps',[['fix','المصحح <span class="ltr">8.854×10⁻¹²</span>'],['book','كما في الكتاب <span class="ltr">4π×10⁻⁷</span>']],eps)}
    <div class="facts">${fact('ε<sub>r</sub>','l1r')}${fact('ε = ε<sub>0</sub> ε<sub>r</sub> (F/m)','l1e')}${fact('C = εA/d','l1C')}${fact('Q = C V (1-1)','l1Q')}${fact('V/d (V/m)','l1E')}</div>
    <div id="l1msg"></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l1st"></ol></div></div>`;
  const $=s=>el.querySelector(s);
  const TP=B.params($('#l1tp'),'u1-l1',[
   {k:'plastic',label:'السماحية النسبية للبلاستيك ε<sub>r</sub> (قيمة نموذجية — الكتاب لا يذكرها)',unit:'',value:3,min:1,max:10000,step:0.1},
   {k:'mica',label:'السماحية النسبية للميكا ε<sub>r</sub>',unit:'',value:6,min:1,max:10000,step:0.1},
   {k:'ceramic',label:'السماحية النسبية للسيراميك ε<sub>r</sub>',unit:'',value:10,min:1,max:10000,step:0.1}],()=>{steps.redraw();draw()});
  const er=()=>mat==='air'?1:mat==='custom'?erC:TP.v[mat];
  const Cof=(a,dd,r,e)=>(e==='book'?EPS0_BOOK:EPS0)*r*(a*1e-4)/(dd*1e-3);
  const Q0=Cof(100,1,1,'fix')*100,E0=100/1e-3;
  const draw=()=>{const r=er(),C=Cof(A,d,r,eps),Q=C*V,E=V/(d*1e-3);
   $('#l1A-v').textContent=fm(A,0)+' cm² = '+fm(A*1e-4,4)+' m²';$('#l1d-v').textContent=fm(d,1)+' mm';$('#l1V-v').textContent=fm(V,0)+' V';$('#l1er-v').textContent=fm(erC,0);
   $('#l1erB').style.display=mat==='custom'?'':'none';
   $('#l1v').innerHTML=plateSVG({A,d,V,mat,nq:clamp(Math.round(8*Q/Q0),0,999),nE:clamp(Math.round(6*E/E0),0,999)});
   $('#l1r').textContent=fm(r,2);$('#l1e').textContent=eSci((eps==='book'?EPS0_BOOK:EPS0)*r);$('#l1C').textContent=fmtF(C);$('#l1Q').textContent=fmtC(Q);$('#l1E').textContent=eSci(E);
   $('#l1msg').innerHTML=eps==='book'?`<div class="callout err">بقيمة الكتاب \\(4\\pi\\times10^{-7}\\) تخرج السعة <b>${fmtF(C)}</b> بدل <b>${fmtF(Cof(A,d,r,'fix'))}</b> — أكبر بحوالي <span class="ltr">${fm(EPS0_BOOK/EPS0,0)}</span> مرة. هذا غير ممكن لمكثف بهذه الأبعاد: \\(4\\pi\\times10^{-7}\\) هي \\(\\mu_0\\) (النفاذية المغناطيسية) وليست \\(\\varepsilon_0\\).</div>`:`<div class="callout">السعة لا تتغير بتغيير V: هي صفة في المكثف نفسه (A و d والعازل). أما الشحنة فتتناسب مع V.</div>`;
   B.math($('#l1msg'));};
  $('#l1A').oninput=e=>{A=+e.target.value;draw()};$('#l1d').oninput=e=>{d=+(+e.target.value).toFixed(1);draw()};$('#l1V').oninput=e=>{V=+e.target.value;draw()};$('#l1er').oninput=e=>{erC=+e.target.value;draw()};
  segBind(el,'mat',v=>{mat=v;draw()});segBind(el,'eps',v=>{eps=v;if(v==='book')did.book=1;draw()});
  const steps=stepsUI($('#l1st'),[
   {t:'ضاعف المساحة',x:'مع الهواء و <span class="ltr">d = 1 mm</span> اجعل <span class="ltr">A = 200 cm²</span>: تتضاعف السعة من <span class="ltr">88.5 pF</span> إلى <span class="ltr">177 pF</span>، فالسعة تتناسب طردياً مع A.',done:()=>A===200&&d===1&&mat==='air'&&eps==='fix'},
   {t:'باعد بين اللوحين',x:'أرجع A إلى <span class="ltr">100 cm²</span> واجعل <span class="ltr">d = 2 mm</span>: تنقص السعة إلى النصف (<span class="ltr">44.3 pF</span>)، فالسعة تتناسب عكسياً مع d.',done:()=>A===100&&d===2&&mat==='air'},
   {t:'غيّر المادة العازلة',get x(){return `اختر «ميكا»: تُضرب السعة في <span class="ltr">ε<sub>r</sub> = ${fm(TP.v.mica)}</span>. ولهذا يسمى المكثف باسم عازله (ص 9).`},done:()=>mat==='mica'},
   {t:'الشحنة Q = C V',x:'اجعل <span class="ltr">V = 200 V</span>: تتضاعف الشحنة بينما السعة كما هي (المعادلة 1-1).',done:()=>V===200},
   {t:'قيمة ε<sub>0</sub> في الكتاب',x:'اختر «كما في الكتاب» وانظر إلى السعة: ميكروفارادات من لوحين صغيرين! ثم ارجع إلى «المصحح».',done:()=>did.book&&eps==='fix'}
  ]);
  draw();loopOn(el,()=>steps.check());
 },
 examples:[
  {title:'حاسبة المعادلة (1-1): C = Q / V',ref:'ص 9',q:'<p>ليست مثالاً من الكتاب (الكتاب لا يضع مثالاً محلولاً لهذا الجزء): اكتب الشحنة التي اكتسبها اللوح وفرق الجهد بين اللوحين لتحسب السعة. الأرقام الابتدائية توضيحية.</p>',
   given:[{id:'Q',label:'الشحنة',sym:'Q',unit:'μC',value:200},{id:'V',label:'فرق الجهد',sym:'V',unit:'V',value:100}],
   solve:g=>{const C=g.Q/g.V;return [{t:'نحوّل الشحنة إلى كولوم:',f:`Q=${fm(g.Q)}\\ \\mu C=${tsci(g.Q*1e-6,-6)}\\ C`},
    {t:'من المعادلة (1-1):',f:`C=\\frac{Q}{V}=\\frac{${tsci(g.Q*1e-6,-6)}}{${fm(g.V)}}`,v:sci(C*1e-6,-6),unit:'F'},
    {t:'بالميكروفاراد:',v:fm(C,6),unit:'μF',final:true}]}},
  {title:'حاسبة السعة من الأبعاد: C = εA/d',ref:'ص 9',q:'<p>ليست مثالاً من الكتاب: مكثف لوحين متوازيين. تستعمل الحاسبة القيمة الصحيحة \\(\\varepsilon_0=8.854\\times10^{-12}\\ F/m\\) (راجع ملاحظة الكتاب في تبويب الشرح). الأرقام الابتدائية توضيحية.</p>',
   given:[{id:'A',label:'مساحة اللوح',sym:'A',unit:'m²',value:0.01},{id:'d',label:'المسافة بين اللوحين',sym:'d',unit:'mm',value:1},{id:'er',label:'السماحية النسبية للعازل',sym:'\\varepsilon_r',unit:'',value:1}],
   solve:g=>{const e=EPS0*g.er,C=e*g.A/(g.d*1e-3);return [{t:'السماحية:',f:`\\varepsilon=\\varepsilon_0\\,\\varepsilon_r=8.854\\times10^{-12}\\times${fm(g.er)}`,v:eSci(e),unit:'F/m'},
    {t:'نحوّل d إلى متر:',f:`d=${fm(g.d)}\\ mm=${fm(g.d*1e-3,6)}\\ m`},
    {t:'السعة:',f:`C=\\frac{\\varepsilon A}{d}=\\frac{${tE(e)}\\times${fm(g.A)}}{${fm(g.d*1e-3,6)}}`,v:eSci(C),unit:'F'},
    {t:'بالوحدة المناسبة:',v:fmtF(C),final:true},
    {t:'للمقارنة فقط — بقيمة الكتاب \\(4\\pi\\times10^{-7}\\) (خطأ) كانت ستخرج:',v:fmtF(EPS0_BOOK*g.er*g.A/(g.d*1e-3))}]}}
 ],
 quiz:[
  {q:'يتكون المكثف الكهربائي من:',o:['ملف من سلك نحاسي','لوحين من مادة موصلة بينهما مادة عازلة','لوحين عازلين بينهما موصل','قطبين مغمورين في محلول'],c:1,e:'ص 9.'},
  {q:'إذا كانت المادة العازلة في المكثف محلولاً كيماوياً سمي المكثف:',o:['هوائياً','ميكا','الكيماوي أو الإلكترولتي','سيراميك'],c:2,e:'ص 9: يتحدد نوع المكثف حسب المادة العازلة.'},
  {q:'مكثف اكتسب شحنة \\(4\\times10^{-4}\\ C\\) فصار الجهد بين لوحيه \\(200\\ V\\). سعته:',o:['\\(2\\ \\mu F\\)','\\(0.08\\ F\\)','\\(8\\ \\mu F\\)','\\(0.5\\ \\mu F\\)'],c:0,e:'\\(C=Q/V=4\\times10^{-4}/200=2\\times10^{-6}\\ F\\).'},
  {q:'الفاراد هو سعة المكثف الذي يصبح فرق الجهد بين لوحيه فولتاً واحداً عندما يكتسب شحنة:',o:['ميكروكولوم واحد','كولوم واحد','ألف كولوم','أمبير واحد'],c:1,e:'ص 10.'},
  {q:'\\(1\\ nF\\) يساوي:',o:['\\(10^{-3}\\ F\\)','\\(10^{-6}\\ F\\)','\\(10^{-9}\\ F\\)','\\(10^{-12}\\ F\\)'],c:2,e:'جدول أجزاء الفاراد ص 10.'},
  {q:'إذا ضاعفنا المسافة d بين لوحي المكثف وبقي كل شيء كما هو فإن السعة:',o:['تتضاعف','تنقص إلى النصف','لا تتغير','تصبح أربعة أضعاف'],c:1,e:'\\(C=\\varepsilon A/d\\): السعة تتناسب عكسياً مع d.'},
  {q:'القيمة الصحيحة لسماحية الفراغ \\(\\varepsilon_0\\):',o:['\\(4\\pi\\times10^{-7}\\)','\\(8.854\\times10^{-12}\\ F/m\\)','\\(1\\)','\\(9\\times10^{9}\\)'],c:1,e:'الكتاب كتب \\(4\\pi\\times10^{-7}\\) وهي قيمة \\(\\mu_0\\) المغناطيسية (راجع ملاحظة الكتاب).'},
  {q:'بماذا يتميز رمز المكثف المستقطب؟',o:['سهم مائل يخترقه','علامة + عند اللوح الموجب','دائرة حوله','خط متقطع'],c:1,e:'الشكل (1-2) ص 10. السهم المائل للمكثف المتغير.'}
 ]
});

/* ======================================================================
   Capacitor network lab (shared by lessons 2 and 3)
   ====================================================================== */
function capSolve(mode,P,Sx,V){
  if(mode==='series'){const C=1/Sx.reduce((a,c)=>a+1/c,0),Q=C*V;return {C,Q,caps:Sx.map((c,i)=>({n:'C'+(i+1),C:c,V:Q/c,Q,w:'S',i}))}}
  if(mode==='parallel'){const C=P.reduce((a,c)=>a+c,0);return {C,Q:C*V,caps:P.map((c,i)=>({n:'C'+(i+1),C:c,V,Q:c*V,w:'P',i}))}}
  const CP=P.reduce((a,c)=>a+c,0),C=1/(1/CP+Sx.reduce((a,c)=>a+1/c,0)),Q=C*V,Vg=Q/CP;
  return {C,Q,CP,Vg,caps:Sx.map((c,i)=>({n:'C'+(i+1),C:c,V:Q/c,Q,w:'S',i})).concat(P.map((c,j)=>({n:'C'+(Sx.length+j+1),C:c,V:Vg,Q:c*Vg,w:'P',i:j})))}}
function capLab(el,cfg){
  const id=cfg.id,st={mode:cfg.start.mode,P:cfg.start.P.slice(),S:cfg.start.S.slice(),V:cfg.start.V,preset:cfg.start.k,dirty:false};const seen=new Set([cfg.start.k]);
  const PRE=Object.fromEntries(cfg.presets.map(p=>[p.k,p]));
  el.innerHTML=`<div class="grid cx-lab">
   <div class="panel c12"><h2>${cfg.title} <small>${cfg.ref}</small></h2>
    <div class="cx-row">${cfg.modes.length>1?`<div><div class="sub">طريقة التوصيل</div>${segHTML(id+'m',cfg.modes,st.mode)}</div>`:''}<div id="${id}cnt" class="cx-row" style="margin:0"></div></div>
    <div class="svgbox" id="${id}net" style="max-width:860px;margin-inline:auto"></div>
    <p class="sub">يغمق لون الفراغ بين لوحي المكثف كلما زاد الجهد عليه (نسبة إلى جهد المصدر). تحت كل مكثف جهده وشحنته.</p></div>
   <div class="panel c5"><h2>القيم</h2><div class="sub">أمثلة الكتاب وتمارينه:</div><div class="cx-row" id="${id}pre">${cfg.presets.map(p=>`<button class="btn" data-${id}p="${p.k}">${p.label}</button>`).join('')}</div>
    <div class="cx-sliders" id="${id}sl"></div>${sl(id+'V','جهد المصدر V',10,1000,10,st.V)}</div>
   <div class="panel c7"><h2>النتائج</h2><div class="facts">${fact('السعة المكافئة C','x'+id+'C')}${fact('الشحنة الكلية Q من المصدر','x'+id+'Q')}${fact('التحقق','x'+id+'k')}</div>
    <div class="cx-tbl" id="${id}tb"></div><div id="${id}msg"></div></div>
   <div class="panel c12"><h2>خطوات الاختزال <small>كما في الشكل (1-9) ص 19</small></h2><div class="cx-figs" id="${id}red"></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="${id}st"></ol></div></div>`;
  const $=s=>el.querySelector(s);
  const refs=()=>st.mode==='series'?st.S.map((v,i)=>['S',i,'C'+(i+1)]):st.mode==='parallel'?st.P.map((v,i)=>['P',i,'C'+(i+1)]):st.S.map((v,i)=>['S',i,'C'+(i+1)]).concat(st.P.map((v,j)=>['P',j,'C'+(st.S.length+j+1)]));
  const counts=()=>{let h='';if(st.mode==='series')h=`<div><div class="sub">عدد المكثفات</div>${segHTML(id+'ns',[[2,'2'],[3,'3'],[4,'4']],st.S.length)}</div>`;
    else if(st.mode==='parallel')h=`<div><div class="sub">عدد الفروع</div>${segHTML(id+'np',[[2,'2'],[3,'3'],[4,'4']],st.P.length)}</div>`;
    else h=`<div><div class="sub">فروع مجموعة التوازي</div>${segHTML(id+'np',[[2,'2'],[3,'3']],st.P.length)}</div><div><div class="sub">مكثفات على التوالي معها</div>${segHTML(id+'ns',[[1,'1'],[2,'2']],st.S.length)}</div>`;
    $('#'+id+'cnt').innerHTML=h;
    segBind($('#'+id+'cnt'),id+'ns',v=>{v=+v;while(st.S.length<v)st.S.push(10);st.S.length=v;touch();sliders();draw()});
    segBind($('#'+id+'cnt'),id+'np',v=>{v=+v;while(st.P.length<v)st.P.push(10);st.P.length=v;touch();sliders();draw()});};
  const sliders=()=>{$('#'+id+'sl').innerHTML=refs().map(([a,i,n])=>sl(`${id}c${a}${i}`,`${n}${st.mode==='mixed'?(a==='P'?' (توازي)':' (توالي)'):''}`,1,50,1,st[a][i])).join('');
    refs().forEach(([a,i])=>{const r=$(`#${id}c${a}${i}`);r.oninput=e=>{st[a][i]=+e.target.value;touch();draw()}})};
  const touch=()=>{st.dirty=true;st.preset=null};
  const load=k=>{const p=PRE[k];st.mode=p.mode;st.P=p.P.slice();st.S=p.S.slice();st.V=p.V;st.preset=k;st.dirty=false;seen.add(k);if(cfg.modes.length>1)segSet(el,id+'m',st.mode);$('#'+id+'V').value=st.V;counts();sliders();draw()};
  const capObj=(c,sol,live)=>({top:`${c.n} = ${fm(c.C)} μF`,bot:live?`${fm(c.V,4)} V · ${fm(c.Q,4)} μC`:'',fill:live?c.V/st.V:0,va:c.w==='S'&&st.mode!=='parallel'?('V'+(c.i+1)):''});
  const draw=()=>{const sol=capSolve(st.mode,st.P,st.S,st.V);$('#'+id+'V-v').textContent=fm(st.V,0)+' V';
    refs().forEach(([a,i])=>{const b=$(`#${id}c${a}${i}-v`);if(b)b.textContent=fm(st[a][i])+' μF'});
    const Sc=sol.caps.filter(c=>c.w==='S'),Pc=sol.caps.filter(c=>c.w==='P');
    const src=`V = ${fm(st.V,0)} V`;let net;
    if(st.mode==='series')net=netSVG({S:Sc.map(c=>capObj(c,sol,1)),src:'box',srcText:src,live:true});
    else if(st.mode==='parallel')net=netSVG({P:Pc.map(c=>capObj(c,sol,1)),src:'box',srcText:src,live:true});
    else net=netSVG({P:Pc.map(c=>capObj(c,sol,1)),S:Sc.map(c=>capObj(c,sol,1)).reverse(),gva:'V'+(st.S.length+1),pts:{a:'a',b:'b',c:'c'},src:'box',srcText:src,live:true});
    $('#'+id+'net').innerHTML=net;
    $('#x'+id+'C').textContent=fm(sol.C,5)+' μF';$('#x'+id+'Q').textContent=fm(sol.Q,5)+' μC';
    let chk;if(st.mode==='series')chk=`ΣV = ${fm(Sc.reduce((a,c)=>a+c.V,0),4)} V`;else if(st.mode==='parallel')chk=`ΣQ = ${fm(Pc.reduce((a,c)=>a+c.Q,0),5)} μC`;else chk=`V${st.S.length+1} + ΣV = ${fm(sol.Vg+Sc.reduce((a,c)=>a+c.V,0),4)} V`;
    $('#x'+id+'k').textContent=chk;
    $('#'+id+'tb').innerHTML=`<table class="cx-rec"><thead><tr><th>المكثف</th><th>C</th><th>V</th><th>Q</th><th>Q بالكولوم</th></tr></thead><tbody>${sol.caps.map(c=>`<tr><td>${c.n}${st.mode==='mixed'?(c.w==='P'?' <span class="sub">توازي</span>':' <span class="sub">توالي</span>'):''}</td><td class="l">${fm(c.C)} μF</td><td class="l">${fm(c.V,4)} V</td><td class="l">${fm(c.Q,5)} μC</td><td class="l">${eSci(c.Q*1e-6)} C</td></tr>`).join('')}</tbody></table>`;
    const minC=Math.min(...sol.caps.map(c=>c.C)),maxV=sol.caps.reduce((a,c)=>c.V>a.V?c:a,sol.caps[0]);
    $('#'+id+'msg').innerHTML=st.mode==='series'?`<div class="callout">التوالي: <b>الشحنة واحدة</b> في كل المكثفات، والسعة المكافئة <span class="ltr">${fm(sol.C,4)} μF</span> أقل من أصغر سعة (<span class="ltr">${fm(minC)} μF</span>). أكبر جهد على أصغر مكثف: ${maxV.n}.</div>`
      :st.mode==='parallel'?`<div class="callout">التوازي: <b>الجهد واحد</b> على كل المكثفات، والسعة المكافئة مجموع السعات، والشحنة الكلية تتجزأ على الفروع بنسبة سعاتها.</div>`
      :`<div class="callout">المركب: مجموعة التوازي بين a و b سعتها <span class="ltr">C<sub>ab</sub> = ${fm(sol.CP)} μF</span> وجهدها <span class="ltr">${fm(sol.Vg,4)} V</span>، وهي على التوالي مع ${st.S.length===1?'C1':'C1 و C2'} فتحمل الشحنة الكلية نفسها.</div>`;
    // reduction stages
    const lab=c=>({top:`${c.n}=${fm(c.C)}μF`});let red=[];
    if(st.mode==='series')red=[['الدائرة',netSVG({S:Sc.map(lab),src:'arrow',vl:src})],['السعة المكافئة',netSVG({S:[{top:`C=${fm(sol.C,4)}μF`}],src:'arrow',vl:src})]];
    else if(st.mode==='parallel')red=[['الدائرة',netSVG({P:Pc.map(lab),src:'arrow',vl:src})],['السعة المكافئة',netSVG({S:[{top:`C=${fm(sol.C,4)}μF`}],src:'arrow',vl:src})]];
    else red=[['(أ) الدائرة',netSVG({P:Pc.map(lab),S:Sc.map(lab).reverse(),pts:{a:'a',b:'b',c:'c'},src:'arrow',vl:src})],['(ب) مجموعة التوازي ← C_ab',netSVG({S:[{top:`Cab=${fm(sol.CP)}μF`}].concat(Sc.map(lab).reverse()),pts:{a:'a',c:'c'},src:'arrow',vl:src})],['(جـ) السعة المكافئة',netSVG({S:[{top:`Cac=${fm(sol.C,4)}μF`}],pts:{a:'a',c:'c'},src:'arrow',vl:src})]];
    $('#'+id+'red').innerHTML=red.map(([t,s])=>`<figure>${s}<figcaption>${t}</figcaption></figure>`).join('');
  };
  if(cfg.modes.length>1)segBind(el,id+'m',v=>{const all=st.S.concat(st.P);st.mode=v;
    if(v==='series')st.S=all.slice(0,4),st.P=[];else if(v==='parallel')st.P=all.slice(0,4),st.S=[];else{st.P=all.slice(0,2);st.S=[all[2]||10]}
    if(st.mode==='series'&&st.S.length<2)st.S.push(10);if(st.mode==='parallel'&&st.P.length<2)st.P.push(10);if(st.mode==='mixed'&&st.P.length<2)st.P.push(10);touch();counts();sliders();draw()});
  el.querySelectorAll(`[data-${id}p]`).forEach(b=>b.onclick=()=>load(b.dataset[id+'p']));
  $('#'+id+'V').oninput=e=>{st.V=+e.target.value;touch();draw()};
  counts();sliders();draw();
  const steps=stepsUI($('#'+id+'st'),cfg.steps({st,seen,sol:()=>capSolve(st.mode,st.P,st.S,st.V),is:k=>st.preset===k&&!st.dirty}));
  loopOn(el,()=>steps.check());
}

/* ---------- worked-example step builders (book's order) ---------- */
const ex=(x,e)=>e==null?eSci(x):sci(x,e);
const tex=(x,e)=>e==null?tE(x):tsci(x,e);
const nm=(i,b)=>`${b||'C'}_{${i}}`;
function seriesSteps(Cs,V,o){o=o||{};const n=Cs.length,inv=Cs.map(c=>1/c),sum=inv.reduce((a,b)=>a+b,0),C=1/sum,Q=C*V,eQ=o.eQ,eC=o.eC==null?-6:o.eC;const st=[];
  if(n===2&&o.two){st.push({t:`(أ) المكثفان على التوالي، فمن المعادلة (1-6):`,f:`C=\\frac{C_1\\times C_2}{C_1+C_2}=\\frac{${fm(Cs[0])}\\times${fm(Cs[1])}}{${fm(Cs[0])}+${fm(Cs[1])}}=\\frac{${fm(Cs[0]*Cs[1])}}{${fm(Cs[0]+Cs[1])}}`,v:fm(C,6),unit:'μF'})}
  else{st.push({t:o.ta||'(أ) المكثفات على التوالي، فالسعة المكافئة من المعادلة (1-4):',f:`\\frac1C=${Cs.map((c,i)=>'\\frac1{'+nm(i+1)+'}').join('+')}=${Cs.map(c=>'\\frac1{'+fm(c)+'}').join('+')}=${inv.map(x=>fm(x)).join('+')}`,v:fm(sum),unit:''});
    st.push({t:'السعة الكلية:',f:`C=\\frac{1}{${fm(sum)}}`,v:fm(C,6),unit:'μF'})}
  st.push({t:'بالفاراد:',v:ex(C*1e-6,eC),unit:'F',final:true});
  st.push({t:'(ب) في التوالي الشحنة في كل المكثفات واحدة:',f:`Q=${Cs.map((c,i)=>nm(i+1,'Q')).join('=')}=C\\times V=${tex(C*1e-6,eC)}\\times${fm(V)}`,v:ex(Q*1e-6,eQ),unit:'C',final:true});
  st.push({t:'(جـ) فرق الجهد على كل مكثف مختلف:'});
  Cs.forEach((c,i)=>st.push({f:`V_{${i+1}}=\\frac{Q}{${nm(i+1)}}=\\frac{${tex(Q*1e-6,eQ)}}{${tsci(c*1e-6,-6)}}`,v:fm(Q/c,6),unit:'V',final:true}));
  st.push({t:'للتأكد: مجموع الجهود يساوي جهد المصدر:',f:`${Cs.map((c,i)=>'V_{'+(i+1)+'}').join('+')}=${Cs.map(c=>fm(Q/c,6)).join('+')}`,v:fm(Cs.reduce((a,c)=>a+Q/c,0),6),unit:'V'});
  return st}
function parallelSteps(Cs,V,o){o=o||{};const C=Cs.reduce((a,b)=>a+b,0),eq=o.eq||Cs.map(()=>null),st=[];
  st.push({t:o.ta||'(أ) المكثفات على التوازي، فمن المعادلة (1-11):',f:`C=${Cs.map((c,i)=>nm(i+1)).join('+')}=${Cs.map(c=>fm(c)).join('+')}`,v:fm(C,6),unit:'μF'});
  st.push({t:'بالفاراد:',v:sci(C*1e-6,-6),unit:'F',final:true});
  st.push({t:o.tb||'(ب) في التوازي فرق الجهد على أطراف المكثفات ثابت ويساوي جهد المصدر:',f:`V=${Cs.map((c,i)=>'V_{'+(i+1)+'}').join('=')}`,v:fm(V,6),unit:'V',final:true});
  st.push({t:o.tc||'(جـ) الشحنة في المكثفات مختلفة لأن سعاتها مختلفة:'});
  Cs.forEach((c,i)=>st.push({f:`Q_{${i+1}}=V\\times ${nm(i+1)}=${fm(V)}\\times${tsci(c*1e-6,-6)}`,v:ex(V*c*1e-6,eq[i]),unit:'C',final:true}));
  if(o.total!==false){st.push({t:o.td||'(د) الشحنة الكلية من المصدر تتجزأ على المكثفات:',f:`Q=${Cs.map(c=>tex(V*c*1e-6,o.eT)).join('+')}`,v:ex(V*C*1e-6,o.eT),unit:'C',final:true});
    st.push({t:'حل آخر: الشحنة الكلية = السعة الكلية × فرق الجهد:',f:`Q=V\\times C=${fm(V)}\\times${tsci(C*1e-6,-6)}`,v:ex(V*C*1e-6,o.eT),unit:'C'})}
  return st}
function mixedSteps(P,Sx,V,o){o=o||{};const s=Sx.length,CP=P.reduce((a,b)=>a+b,0),pn=P.map((c,j)=>nm(s+j+1)),C=1/(1/CP+Sx.reduce((a,c)=>a+1/c,0)),Q=C*V,Vg=Q/CP,eQ=o.eQ,st=[];
  st.push({t:`(أ) ${pn.join(' و ')} على التوازي بين النقطتين a و b، فالسعة بينهما:`,f:`C_{ab}=${pn.join('+')}=${P.map(c=>fm(c)).join('+')}`,v:fm(CP,6),unit:'μF'});
  if(s===1)st.push({t:`و C<sub>ab</sub> و C<sub>1</sub> على التوالي بين a و c:`,f:`C_{ac}=\\frac{C_1\\,C_{ab}}{C_1+C_{ab}}=\\frac{${fm(Sx[0])}\\times${fm(CP)}}{${fm(Sx[0])}+${fm(CP)}}`,v:fm(C,6),unit:'μF'});
  else st.push({t:`و C<sub>ab</sub> على التوالي مع ${Sx.map((c,i)=>'C<sub>'+(i+1)+'</sub>').join(' و ')}، فمن المعادلة (1-4):`,f:`\\frac1C=${Sx.map((c,i)=>'\\frac1{'+nm(i+1)+'}').join('+')}+\\frac1{C_{ab}}=${Sx.map(c=>'\\frac1{'+fm(c)+'}').join('+')}+\\frac1{${fm(CP)}}=${fm(1/C)}`,v:fm(C,6),unit:'μF'});
  st.push({t:'بالفاراد:',v:sci(C*1e-6,-6),unit:'F',final:true});
  st.push({t:'(ب) في التوالي الشحنة ثابتة وتساوي الشحنة الكلية من المصدر:',f:`Q=C\\,V=${tsci(C*1e-6,-6)}\\times${fm(V)}`,v:ex(Q*1e-6,eQ),unit:'C'});
  Sx.forEach((c,i)=>st.push({f:`V_{${i+1}}=\\frac{Q}{C_{${i+1}}}=\\frac{${tex(Q*1e-6,eQ)}}{${tsci(c*1e-6,-6)}}`,v:fm(Q/c,6),unit:'V',final:true}));
  st.push({f:`V_{${s+1}}=\\frac{Q}{C_{ab}}=\\frac{${tex(Q*1e-6,eQ)}}{${tsci(CP*1e-6,-6)}}`,v:fm(Vg,6),unit:'V',final:true});
  st.push({t:`(جـ) الشحنة في كل مكثف (${pn.join(' و ')} على جهد مجموعة التوازي نفسه):`});
  Sx.forEach((c,i)=>st.push({f:`Q_{${i+1}}=Q`,v:ex(Q*1e-6,eQ),unit:'C',final:true}));
  P.forEach((c,j)=>st.push({f:`Q_{${s+j+1}}=C_{${s+j+1}}\\,V_{${s+1}}=${tsci(c*1e-6,-6)}\\times${fm(Vg,6)}`,v:ex(c*Vg*1e-6,o.eP?o.eP[j]:null),unit:'C',final:true}));
  st.push({t:'للتأكد: مجموع شحنات فروع التوازي = Q:',f:`${P.map((c,j)=>'Q_{'+(s+j+1)+'}').join('+')}=${P.map((c,j)=>tex(c*Vg*1e-6,o.eP?o.eP[j]:null)).join('+')}`,v:ex(Q*1e-6,eQ),unit:'C'});
  return st}
const gC=(id,l,v)=>({id,label:l||('سعة '+id),sym:id.replace(/(\d)/,'_$1'),unit:'μF',value:v,min:0.001});
const gV=v=>({id:'V',label:'جهد المصدر',sym:'V',unit:'V',value:v});

/* ======================================================================
   Lesson 2 — التوالي (ص 11–14)
   ====================================================================== */
const F13=()=>netSVG({S:[{top:'C1',va:'v1'},{top:'C2',va:'v2'},{top:'C3',va:'v3'}],src:'box',aria:'توصيل المكثفات على التوالي'});
const F14=()=>netSVG({S:[{top:'C1',q:'Q',va:'v1'},{top:'C2',q:'Q',va:'v2'},{top:'C3',q:'Q',va:'v3'}],src:'arrow',vl:'V=600V',aria:'توصيل ثلاثة مكثفات على التوالي'});
B.lesson({
 id:'u1-l2',unit:1,order:2,pages:'11–14، 23',
 title:'توصيل المكثفات على التوالي',
 summary:'في التوالي الشحنة واحدة في كل المكثفات والجهد يتجزأ عليها، فتكون السعة المكافئة أقل من أصغر سعة: مقلوبها يساوي مجموع مقلوبات السعات، ولمكثفين هي حاصل الضرب على المجموع. مع المثالين (1-1) و(1-2) والتمرينين 1 و2.',
 theory:[
  {h:'توصيل المكثفات',ref:'ص 11',html:'<p>«توصل المكثفات إما على التوالي أو التوازي للحصول على قيمة معينة من السعة».</p>'},
  {h:'توصيل المكثفات على التوالي: Series-connected capacitors',ref:'ص 11',html:`<p>«توصل المكثفات على التوالي للحصول على <b>سعة كلية صغيرة أقل من أصغر سعة مكثف</b> موجودة في الدائرة. وتوصيل المكثفات على التوالي الشكل (1-3) <b>يعاكس توصيل المقاومات على التوالي</b> حيث تكون المقاومة الكلية أعلى من أكبر مقاومة بالدائرة، أما بالنسبة للجهد فإنه يتجزأ أيضاً.»</p>`},
  {fig:'(1-3)',ref:'ص 11',caption:'توصيل المكثفات على التوالي: C1 و C2 و C3 في الفرع العلوي وتحت كل منها جهده v1 و v2 و v3، وفي الفرع السفلي مصدر الجهد (power supply).',draw:()=>box(F13(),520)},
  {html:`<p>«في هذه الحالة الجهد يتجزأ وبالتالي:»</p>
   $$V=V_1+V_2+V_3 \\qquad (1\\text{-}2)$$ $$C=\\frac{Q}{V} \\qquad (1\\text{-}3)$$
   $$V=\\frac{Q}{C}\\qquad\\Rightarrow\\qquad \\frac{Q}{C}=\\frac{Q_1}{C_1}+\\frac{Q_2}{C_2}+\\frac{Q_3}{C_3}$$
   <p>«وبما أن في حالة توصيل التوالي <b>الشحنة لا تتجزأ</b>، إذاً الشحنة المخزنة في كل مكثف متساوية» <span class="ref">ص 11–12</span></p>
   $$\\frac{1}{C}=\\frac{1}{C_1}+\\frac{1}{C_2}+\\frac{1}{C_3} \\qquad (1\\text{-}4)$$ $$Q=Q_1=Q_2=Q_3 \\qquad (1\\text{-}5)$$`},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب: لماذا الشحنة واحدة؟</b> اللوح الأيمن من C1 واللوح الأيسر من C2 قطعة معدنية واحدة معزولة عن المصدر، لا تدخلها شحنة ولا تخرج منها. فإذا ظهرت على أحد طرفيها شحنة \\(-Q\\) لا بد أن تظهر على الطرف الآخر \\(+Q\\). لذلك تنتقل الشحنة نفسها Q «عبر» كل المكثفات، ويأخذ كل مكثف جهداً \\(V_i=Q/C_i\\): <b>المكثف الأصغر سعة يأخذ الجهد الأكبر</b>.'},
  {h:'حالة خاصة: مكثفان على التوالي',ref:'ص 12',html:`<p>«في حالة وجود مكثفين موصلين معاً على التوالي تكون السعة الكلية»:</p>
   $$\\frac{1}{C}=\\frac{1}{C_1}+\\frac{1}{C_2}=\\frac{C_1+C_2}{C_1\\times C_2}\\qquad\\Rightarrow\\qquad C=\\frac{C_1\\times C_2}{C_1+C_2} \\qquad (1\\text{-}6)$$
   <p>«وبصفة عامة لعدد n من المكثفات الموصلة على التوالي»:</p>$$\\frac{1}{C}=\\sum_{i=1}^{n}\\frac{1}{C_i} \\qquad (1\\text{-}7)$$`},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب:</b> إذا كانت المكثفات n متساوية وسعة كل منها C<sub>0</sub> فإن \\(C=C_0/n\\) ويتوزع الجهد عليها بالتساوي \\(V/n\\). مثلاً ثلاثة مكثفات كل منها \\(9\\ \\mu F\\) على التوالي تعطي \\(3\\ \\mu F\\).'},
  {h:'مثال (1-1)',ref:'ص 12–13',html:`<p>«ثلاثة مكثفات كهربائية (\\(C_1=20\\mu F\\) و \\(C_2=4\\mu F\\) و \\(C_3=5\\mu F\\))، وصلت على التوالي إلى مصدر جهد قيمته <span class="ltr">600 V</span>، أحسب: (أ) السعة المكافئة بالفاراد (ب) الشحنة في كل مكثف (جـ) فرق الجهد على كل مكثف.»</p>
   <p>الحل في تبويب «الأمثلة المحلولة»: \\(1/C=0.05+0.25+0.2=0.5\\) فتكون \\(C=2\\mu F\\)، و \\(Q=1200\\times10^{-6}\\ C\\)، والجهود <span class="ltr">60 V</span> و <span class="ltr">300 V</span> و <span class="ltr">240 V</span> ومجموعها <span class="ltr">600 V</span>. «نلاحظ أن السعة الكلية هي دائماً أقل من سعة أي من المكثفات المتصلة على التوالي.»</p>`},
  {fig:'(1-4)',ref:'ص 13',caption:'توصيل ثلاثة مكثفات على التوالي: بجانب كل مكثف الحرف Q (الشحنة نفسها)، وتحتها v1 و v2 و v3، والسهم السفلي V = 600 V بطول الدائرة.',draw:()=>box(F14(),520)},
  {h:'مثال (1-2)',ref:'ص 14',html:`<p>«مكثفان سعتهما <span class="ltr">4μF</span> و <span class="ltr">12μF</span> وصلا على التوالي، فإذا كان فرق الجهد الكلي على المكثفين <span class="ltr">100 V</span>، أحسب: (أ) السعة المكافئة للمكثفين بالفاراد (ب) الشحنة في كل مكثف (جـ) فرق الجهد على كل مكثف.»</p>
   <p>بالمعادلة (1-6): \\(C=48/16=3\\mu F\\)، و \\(Q=3\\times10^{-6}\\times100=3\\times10^{-4}\\ C\\)، و \\(V_1=75\\ V\\) و \\(V_2=25\\ V\\) ومجموعهما <span class="ltr">100 V</span>.</p>`},
  {fig:'(بلا رقم)',ref:'ص 14',caption:'رسم توضيحي لمثال (1-2) — ليس في الكتاب: مكثفان على التوالي على 100 V.',draw:()=>box(netSVG({S:[{top:'C1=4μF',va:'V1'},{top:'C2=12μF',va:'V2'}],src:'arrow',vl:'V=100V'}),380)},
  {err:'<b>ملاحظات على الكتاب (ص 14، مثال 1-2):</b> (1) يقول الحل «كما هو موضح بالشكل (1-5)» والشكل (1-5) هو شكل التوازي العام، ولا يوجد شكل خاص بهذا المثال — رسمنا له شكلاً توضيحياً. (2) طُبع «السعة المكافئة للمكثفان» والصحيح «للمكثفين». (3) في الجزء (جـ) طُبع «فرق الجهد على المكثفات الثلاثة» والمثال فيه مكثفان فقط. لا توجد أخطاء حسابية.'},
  {h:'تمرينا الوحدة الأولى 1 و 2',ref:'ص 23',html:Qd('تمرين 1','ثلاثة مكثفات كهربائية وصلت على التوالي فإذا كانت السعة لكل منها <span class="ltr">2μF</span> و <span class="ltr">4μF</span> و <span class="ltr">20μF</span> على الترتيب، فإذا كان فرق الجهد المسلط على المجموعة يساوي <span class="ltr">200V</span>، أحسب: (أ) السعة المكافئة بالفاراد (ب) الشحنة في كل مكثف (جـ) فرق الجهد على كل مكثف.',
    '\\(1/C=0.5+0.25+0.05=0.8\\) فتكون \\(C=1.25\\ \\mu F=1.25\\times10^{-6}\\ F\\)؛ الشحنة واحدة \\(Q=1.25\\times10^{-6}\\times200=2.5\\times10^{-4}\\ C\\)؛ الجهود \\(V_1=125\\ V\\) و \\(V_2=62.5\\ V\\) و \\(V_3=12.5\\ V\\) ومجموعها <span class="ltr">200 V</span>. الحاسبة في تبويب «الأمثلة المحلولة».')+
   Qd('تمرين 2','مكثفان سعتهما <span class="ltr">6μF</span> و <span class="ltr">12μF</span> وصلا على التوالي، فإذا كان فرق الجهد الكلي على المكثفين يساوي <span class="ltr">300V</span>، أحسب: (أ) السعة المكافئة للمكثفين بالفاراد (ب) الشحنة في كل مكثف (ج) فرق الجهد على كل مكثف.',
    '\\(C=6\\times12/(6+12)=4\\ \\mu F=4\\times10^{-6}\\ F\\)؛ \\(Q=4\\times10^{-6}\\times300=1.2\\times10^{-3}\\ C\\)؛ \\(V_1=200\\ V\\) على مكثف \\(6\\mu F\\) و \\(V_2=100\\ V\\) على مكثف \\(12\\mu F\\).')},
  {err:'<b>ملاحظة على الكتاب (ص 23، تمرين 2):</b> طُبعت الجملة «فرق الجهد الكلي يساوي 300V المكثفين» و«للمكثفان»، وصحّحناهما في النص أعلاه.'}
 ],
 lab:(el)=>capLab(el,{id:'l2',title:'ابنِ سلسلة مكثفات على التوالي',ref:'مبنية على الشكلين (1-3) و(1-4) ص 11–13 والمعادلات (1-2) إلى (1-7)',
  modes:[['series','توالي']],start:{k:'e11',mode:'series',P:[],S:[20,4,5],V:600},
  presets:[{k:'e11',label:'مثال (1-1)',mode:'series',P:[],S:[20,4,5],V:600},{k:'e12',label:'مثال (1-2)',mode:'series',P:[],S:[4,12],V:100},{k:'t1',label:'تمرين 1',mode:'series',P:[],S:[2,4,20],V:200},{k:'t2',label:'تمرين 2',mode:'series',P:[],S:[6,12],V:300}],
  steps:({st,seen,is})=>[
   {t:'مثال (1-1)',x:'اضغط «مثال (1-1)»: السعة المكافئة <span class="ltr">2 μF</span>، والشحنة <span class="ltr">1200 μC</span> (أي \\(1200\\times10^{-6}\\ C\\)) في كل مكثف، والجهود <span class="ltr">60</span> و <span class="ltr">300</span> و <span class="ltr">240 V</span> ومجموعها <span class="ltr">600 V</span>.',done:()=>is('e11')},
   {t:'أصغر سعة = أكبر جهد',x:'حرّك C1 إلى <span class="ltr">2 μF</span> (مع C2 = 4 و C3 = 5): يصبح C1 أصغر مكثف فيأخذ أكبر جهد، وتنقص السعة المكافئة إلى أقل من <span class="ltr">2 μF</span>.',done:()=>st.S.length===3&&st.S[0]===2&&st.S[1]===4&&st.S[2]===5},
   {t:'أضف مكثفاً',x:'اختر «4» في عدد المكثفات: كل مكثف جديد على التوالي ينقص السعة المكافئة أكثر.',done:()=>st.S.length===4},
   {t:'مكثفات متساوية',x:'اجعل كل السعات متساوية: يتوزع الجهد بالتساوي \\(V/n\\)، والسعة المكافئة = سعة المكثف ÷ عددها.',done:()=>st.S.length>=2&&st.S.every(c=>c===st.S[0])},
   {t:'مثال (1-2) والتمرينان',x:'اضغط «مثال (1-2)» (<span class="ltr">3 μF</span>، \\(3\\times10^{-4}\\ C\\)، <span class="ltr">75 V</span> و <span class="ltr">25 V</span>)، ثم «تمرين 1» و«تمرين 2» وقارن بإجاباتك.',done:()=>seen.has('e12')&&seen.has('t1')&&seen.has('t2')}
  ]}),
 examples:[
  {title:'مثال (1-1)',ref:'ص 12–13',q:'<p>«ثلاثة مكثفات كهربائية (\\(C_1=20\\mu F\\) و \\(C_2=4\\mu F\\) و \\(C_3=5\\mu F\\))، وصلت على التوالي إلى مصدر جهد قيمته 600 V، أحسب: (أ) السعة المكافئة بالفاراد (ب) الشحنة في كل مكثف (جـ) فرق الجهد على كل مكثف.»</p>',
   given:[gC('C1','سعة المكثف الأول',20),gC('C2','سعة المكثف الثاني',4),gC('C3','سعة المكثف الثالث',5),gV(600)],solve:g=>seriesSteps([g.C1,g.C2,g.C3],g.V,{eQ:-6,ta:'(أ) المكثفات الثلاثة موصلة على التوالي كما في الشكل (1-4)، فالسعة المكافئة:'})},
  {title:'مثال (1-2)',ref:'ص 14',q:'<p>«مكثفان سعتهما 4μF و 12μF وصلا على التوالي، فإذا كان فرق الجهد الكلي على المكثفين 100 V، أحسب: (أ) السعة المكافئة للمكثفين بالفاراد (ب) الشحنة في كل مكثف (جـ) فرق الجهد على كل مكثف.»</p>',
   given:[gC('C1','سعة المكثف الأول',4),gC('C2','سعة المكثف الثاني',12),gV(100)],solve:g=>seriesSteps([g.C1,g.C2],g.V,{two:true,eQ:-4})},
  {title:'تمرين 1 — إجابة مقترحة (ليست من الكتاب)',ref:'ص 23',q:'<p>ثلاثة مكثفات على التوالي: <span class="ltr">2μF</span> و <span class="ltr">4μF</span> و <span class="ltr">20μF</span>، والجهد المسلط <span class="ltr">200V</span>. أحسب السعة المكافئة والشحنة وفرق الجهد على كل مكثف.</p>',
   given:[gC('C1','سعة المكثف الأول',2),gC('C2','سعة المكثف الثاني',4),gC('C3','سعة المكثف الثالث',20),gV(200)],solve:g=>seriesSteps([g.C1,g.C2,g.C3],g.V,{})},
  {title:'تمرين 2 — إجابة مقترحة (ليست من الكتاب)',ref:'ص 23',q:'<p>مكثفان <span class="ltr">6μF</span> و <span class="ltr">12μF</span> على التوالي، والجهد الكلي <span class="ltr">300V</span>. أحسب السعة المكافئة والشحنة وفرق الجهد على كل مكثف.</p>',
   given:[gC('C1','سعة المكثف الأول',6),gC('C2','سعة المكثف الثاني',12),gV(300)],solve:g=>seriesSteps([g.C1,g.C2],g.V,{two:true})}
 ],
 quiz:[
  {q:'السعة الكلية لمجموعة مكثفات على التوالي تكون:',o:['أكبر من أكبر سعة','أقل من أصغر سعة','مساوية لمجموع السعات','مساوية لمتوسط السعات'],c:1,e:'ص 11.'},
  {q:'ما الكمية المتساوية في كل المكثفات الموصلة على التوالي؟',o:['فرق الجهد','الشحنة','الطاقة','السعة'],c:1,e:'المعادلة (1-5): \\(Q=Q_1=Q_2=Q_3\\).'},
  {q:'مكثفان \\(6\\mu F\\) و \\(3\\mu F\\) على التوالي. السعة المكافئة:',o:['\\(9\\ \\mu F\\)','\\(2\\ \\mu F\\)','\\(4.5\\ \\mu F\\)','\\(18\\ \\mu F\\)'],c:1,e:'\\(C=6\\times3/(6+3)=2\\ \\mu F\\) — المعادلة (1-6).'},
  {q:'في التوالي، على أي مكثف يكون أكبر فرق جهد؟',o:['أكبرها سعة','أصغرها سعة','أولها من جهة المصدر','الجهد متساوٍ على الجميع'],c:1,e:'\\(V_i=Q/C_i\\) والشحنة واحدة، فالسعة الأصغر تأخذ الجهد الأكبر (في مثال 1-1 أخذ \\(4\\mu F\\) جهد 300 V).'},
  {q:'ثلاثة مكثفات متساوية كل منها \\(9\\mu F\\) على التوالي. السعة المكافئة:',o:['\\(27\\ \\mu F\\)','\\(9\\ \\mu F\\)','\\(3\\ \\mu F\\)','\\(1\\ \\mu F\\)'],c:2,e:'\\(1/C=3/9\\) فتكون \\(C=3\\ \\mu F\\).'},
  {q:'في مثال (1-2) (\\(4\\mu F\\) و \\(12\\mu F\\) على 100 V) الجهد على المكثف \\(4\\mu F\\):',o:['25 V','50 V','75 V','100 V'],c:2,e:'\\(Q=3\\times10^{-4}\\ C\\) و \\(V_1=Q/C_1=75\\ V\\).'},
  {q:'توصيل المكثفات على التوالي من حيث السعة الكلية يشبه:',o:['توصيل المقاومات على التوالي','توصيل المقاومات على التوازي','لا يشبه أي توصيل','توصيل البطاريات على التوالي'],c:1,e:'ص 11: يعاكس توصيل المقاومات على التوالي — فالكلية أقل من الأصغر، كما في المقاومات على التوازي.'}
 ]
});

/* ======================================================================
   Lesson 3 — التوازي والتوصيل المركب (ص 15–20، 23–24)
   ====================================================================== */
const F15=()=>netSVG({P:[{top:'C1',q:'Q1'},{top:'C2',q:'Q2'},{top:'C3',q:'Q3'}],src:'box',aria:'توصيل المكثفات على التوازي'});
const F16=()=>netSVG({P:[{top:'8μF',q:'Q1'},{top:'12μF',q:'Q2'},{top:'10μF',q:'Q3'}],src:'arrow',vl:'V=200V',aria:'المكثفات الثلاثة على التوازي'});
const F17=()=>netSVG({S:[{top:'C1',q:'+Q',va:'V1',pol:1},{top:'C2',q:'+Q',va:'V2',pol:1}],src:'arrow',vl:'V=300V',aria:'مكثفان على التوالي'});
const F18=()=>netSVG({P:[{top:'C1=2μF',q:'Q1'},{top:'C2=8μF',q:'Q2'}],src:'arrow',vl:'V=300V',aria:'مكثفان على التوازي'});
const F19=()=>`<div class="cx-figs"><figure>${netSVG({P:[{top:'C2'},{top:'C3'}],S:[{top:'C1',va:'V1'}],gva:'V2',pts:{a:'a',b:'b',c:'c'},src:'arrow',vl:'V=100V'})}<figcaption>(أ) الدائرة الأصلية</figcaption></figure><figure>${netSVG({S:[{top:'Cab',va:'V2'},{top:'C1',va:'V1'}],pts:{a:'a',c:'c'},src:'arrow',vl:'100V'})}<figcaption>(ب) C2 و C3 ← Cab</figcaption></figure><figure>${netSVG({S:[{top:'Cac'}],pts:{a:'a',c:'c'},src:'arrow',vl:'100V'})}<figcaption>(جـ) مكثف واحد Cac</figcaption></figure></div>`;
const F110=()=>netSVG({P:[{top:'16μF'},{top:'4μF'}],S:[{top:'5μF',va:'V1'}],gva:'V2',src:'arrow',vl:'120V',aria:'الشكل 1-10'});
const F111=()=>netSVG({P:[{top:'10μF'},{top:'3μF'},{top:'7μF'}],S:[{top:'4μF',va:'V2'},{top:'5μF',va:'V1'}],gva:'V3',src:'arrow',vl:'V=600V',aria:'الشكل 1-11'});
function ex14(g){const C=g.C1*g.C2/(g.C1+g.C2),Q=C*g.V,Cp=g.C1+g.C2;return [
  {t:'(أ) عند توصيل المكثفين على التوالي كما في الشكل (1-7) تكون السعة المكافئة:',f:`C=\\frac{C_1\\times C_2}{C_1+C_2}=\\frac{${fm(g.C1)}\\times${fm(g.C2)}}{${fm(g.C1)}+${fm(g.C2)}}`,v:fm(C,6),unit:'μF',final:true},
  {f:`Q=C\\times V=${tsci(C*1e-6,-6)}\\times${fm(g.V)}`,v:sci(Q*1e-6,-4),unit:'C'},
  {t:'المكثفان على التوالي فالشحنة متساوية ولكن فرق الجهد مختلف:',f:`Q_1=Q_2=Q`,v:sci(Q*1e-6,-4),unit:'C',final:true},
  {f:`V_1=\\frac{Q}{C_1}=\\frac{${tsci(Q*1e-6,-4)}}{${tsci(g.C1*1e-6,-6)}}`,v:fm(Q/g.C1,6),unit:'V',final:true},
  {f:`V_2=\\frac{Q}{C_2}=\\frac{${tsci(Q*1e-6,-4)}}{${tsci(g.C2*1e-6,-6)}}`,v:fm(Q/g.C2,6),unit:'V',final:true},
  {t:'(ب) عند توصيل المكثفين على التوازي كما في الشكل (1-8) تكون السعة المكافئة:',f:`C=C_1+C_2=${fm(g.C1)}+${fm(g.C2)}`,v:fm(Cp,6),unit:'μF',final:true},
  {t:'في هذه الحالة يكون فرق الجهد متساوياً بينما تكون الشحنة مختلفة:',f:'V_1=V_2=V',v:fm(g.V,6),unit:'V',final:true},
  {f:`Q_1=C_1V=${tsci(g.C1*1e-6,-6)}\\times${fm(g.V)}`,v:sci(g.C1*g.V*1e-6,-4),unit:'C',final:true},
  {f:`Q_2=C_2V=${tsci(g.C2*1e-6,-6)}\\times${fm(g.V)}`,v:sci(g.C2*g.V*1e-6,-3),unit:'C',final:true}]}
B.lesson({
 id:'u1-l3',unit:1,order:3,pages:'15–20، 23–24',
 title:'توصيل المكثفات على التوازي والتوصيل المركب',
 summary:'في التوازي الجهد واحد على كل المكثفات والشحنة تتجزأ عليها، فالسعة المكافئة تساوي مجموع السعات. وفي التوصيل المركب نختزل الدائرة خطوة خطوة. مع الأمثلة (1-3) و(1-4) و(1-5) والتمارين 3 و4 و5.',
 theory:[
  {h:'توصيل المكثفات على التوازي: Parallel-connected capacitors',ref:'ص 15',html:`<p>«إن الهدف من توصيل المكثفات على التوازي هو الحصول على <b>سعة كلية (مكافئة) كبيرة تساوي مجموع سعة المكثفات</b> المتصلة على التوازي في الدائرة. ولو تم عمل مقارنة بين توصيل المكثفات على التوازي شكل (1-5) وتوصيل المقاومات على التوازي نجد أن:»</p>
   <ol><li>«عند توصيل المكثفات على التوازي نحصل على قيمة السعة الكلية تساوي المجموع الجبري لجميع قيم المكثفات الموصلة توازي (<b>السعة الكلية تزيد</b>) وبالعكس في حالة توصيل المقاومات على التوازي فإن المقاومة الكلية تكون أقل من أقل أي قيم للمقاومات.»</li>
   <li>«في حالة توصيل المكثفات على التوازي <b>تتجزأ الشحنة الكهربائية</b> المارة من المصدر، ولكن في حالة توصيل المقاومات على التوازي فإن التيار الكلي المسحوب من المصدر يتجزأ.»</li></ol>`},
  {fig:'(1-5)',ref:'ص 15',caption:'توصيل المكثفات على التوازي: C1 و C2 و C3 في ثلاثة فروع بين خطين، بجانب كل منها شحنته Q1 و Q2 و Q3، والمصدر (power supply) في الفرع الرابع، والشحنة الكلية Q تدخل من الخط الأيسر.',draw:()=>box(F15(),380)},
  {html:`<p>«نلاحظ أن الشحنة الكلية Q تتجزأ إلى Q₁، Q₂، Q₃ وبالتالي فإن:»</p>
   $$Q=Q_1+Q_2+Q_3 \\qquad (1\\text{-}8)$$ $$Q=V\\times C \\qquad\\Rightarrow\\qquad V\\times C=V\\times C_1+V\\times C_2+V\\times C_3 \\qquad (1\\text{-}9)$$
   <p>«وحيث أن الجهد في حالة التوازي <b>لا يتجزأ</b>، أي أن الجهد ثابت على جميع المكثفات الموصلة على التوازي (الجهد متساوي على أطراف المكثفات)» <span class="ref">ص 16</span></p>
   $$V=V_1=V_2=V_3=\\dots \\qquad (1\\text{-}10)$$ $$C=C_1+C_2+C_3 \\qquad (1\\text{-}11)$$ $$C=\\sum_{i=1}^{n}C_i \\qquad (1\\text{-}12)$$`},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب:</b> التوازي يشبه أن نضع اللوحات جنباً إلى جنب فتكبر المساحة A، ولهذا تزيد السعة (تذكّر \\(C=\\varepsilon A/d\\)). والمكثف الأكبر سعة يأخذ شحنة أكبر لأن \\(Q_i=C_i\\,V\\) والجهد واحد.'},
  {h:'مقارنة: التوالي والتوازي',ref:'ص 11–16',html:`<table class="tt"><thead><tr><th>البند</th><th>التوالي</th><th>التوازي</th></tr></thead><tbody>
   <tr><td>السعة المكافئة</td><td>\\(1/C=\\sum 1/C_i\\) — أقل من أصغر سعة</td><td>\\(C=\\sum C_i\\) — أكبر من أكبر سعة</td></tr>
   <tr><td>الشحنة</td><td>واحدة في كل المكثفات (1-5)</td><td>تتجزأ: \\(Q=\\sum Q_i\\) (1-8)</td></tr>
   <tr><td>الجهد</td><td>يتجزأ: \\(V=\\sum V_i\\) (1-2)</td><td>واحد على كل المكثفات (1-10)</td></tr>
   <tr><td>يشبه في المقاومات</td><td>التوازي</td><td>التوالي</td></tr></tbody></table>`},
  {h:'مثال (1-3)',ref:'ص 16–17',html:`<p>«ثلاثة مكثفات موصلة على التوازي وسعة كل منهم <span class="ltr">8μF</span> و <span class="ltr">12μF</span> و <span class="ltr">10μF</span> فإذا كان فرق الجهد المسلط على المجموعة يساوي <span class="ltr">200 V</span>، أحسب: (أ) السعة المكافئة للمكثفات بالفاراد (ب) فرق الجهد على كل مكثف (جـ) الشحنة في كل مكثف (د) الشحنة الكلية.»</p>
   <p>النتائج: \\(C=30\\mu F\\)، والجهد <span class="ltr">200 V</span> على كل مكثف، و \\(Q_1=1.6\\times10^{-3}\\) و \\(Q_2=2.4\\times10^{-3}\\) و \\(Q_3=2.0\\times10^{-3}\\ C\\)، والشحنة الكلية \\(6.0\\times10^{-3}\\ C\\) (بالجمع، أو بالحل الآخر \\(Q=V\\times C\\)).</p>`},
  {fig:'(1-6)',ref:'ص 16',caption:'توصيل المكثفات الثلاثة على التوازي: 8μF (Q1) و 12μF (Q2) و 10μF (Q3)، والسهم V = 200 V.',draw:()=>box(F16(),360)},
  {h:'مثال (1-4)',ref:'ص 17–19',html:`<p>«مكثفان سعتهما <span class="ltr">2μF</span> و <span class="ltr">8μF</span> وصلا على التوالي، فإذا كان فرق الجهد المسلط عليهما يساوي <span class="ltr">300V</span>، أحسب: (أ) السعة المكافئة وكذلك الشحنة وفرق الجهد على كل مكثف. (ب) إذا وصل المكثفين على التوازي، احسب السعة المكافئة وكذلك الشحنة في كل مكثف وفرق الجهد على كل مكثف.»</p>
   <p>(أ) توالي: \\(C=1.6\\mu F\\)، \\(Q_1=Q_2=4.8\\times10^{-4}\\ C\\)، \\(V_1=240\\ V\\)، \\(V_2=60\\ V\\). (ب) توازي: \\(C=10\\mu F\\)، \\(V_1=V_2=300\\ V\\)، \\(Q_1=6\\times10^{-4}\\ C\\)، \\(Q_2=2.4\\times10^{-3}\\ C\\). <b>المكثفان نفساهما يعطيان 1.6 μF على التوالي و 10 μF على التوازي.</b></p>`},
  {fig:'(1-7)',ref:'ص 18',caption:'المكثفان على التوالي: على اللوح الأيسر لكل مكثف +Q، والجهد V1 على C1 و V2 على C2، والسهم V = 300 V.',draw:()=>box(F17(),400)},
  {fig:'(1-8)',ref:'ص 18',caption:'المكثفان على التوازي: Q1 في فرع C1 = 2μF و Q2 في فرع C2 = 8μF، والسهم V = 300 V. (رتّبنا التسميات لتطابق الحل — انظر ملاحظات الكتاب.)',draw:()=>box(F18(),340)},
  {h:'التوصيل المركب — مثال (1-5)',ref:'ص 19–20',html:`<p>«من الدائرة الموضحة بالشكل (1-9)، إذا كانت \\(C_1=8\\mu F,\\ C_2=5\\mu F,\\ C_3=3\\mu F\\)، والجهد المسلط على الدائرة <span class="ltr">100V</span>، أحسب: (أ) السعة المكافئة (ب) فرق الجهد على كل مكثف (جـ) الشحنة في كل مكثف.»</p>
   <p>«المكثف C₂ والمكثف C₃ موصلان على التوازي بين النقطتين a, b، ولذلك فإن السعة بين هاتين النقطتين تساوي» \\(C_{ab}=C_2+C_3=8\\mu F\\). «والمكثف C<sub>ab</sub> والمكثف C₁ موصلان على التوالي بين النقطتين a, c» فتكون \\(C_{ac}=\\frac{8\\times8}{8+8}=4\\mu F\\).</p>
   <p>«في حالة توصيل التوالي تكون الشحنة ثابتة في المكثفين C₁ , C<sub>ab</sub> وتساوي الشحنة الكلية المارة من المصدر» \\(Q=4\\times10^{-4}\\ C\\)، فيكون \\(V_1=50\\ V\\) و \\(V_2=50\\ V\\)، والشحنات \\(Q_1=Q=4\\times10^{-4}\\)، \\(Q_2=2.5\\times10^{-4}\\)، \\(Q_3=1.5\\times10^{-4}\\ C\\)، وللتأكد \\(Q_2+Q_3=4\\times10^{-4}\\ C\\).</p>`},
  {fig:'(1-9)',ref:'ص 19',caption:'ثلاث مراحل اختزال: (أ) C2 و C3 على التوازي بين a و b ثم C1 على التوالي إلى c؛ (ب) Cab و C1 على التوالي؛ (جـ) مكثف واحد Cac. (حروف المراحل أ/ب/جـ مضافة؛ الكتاب يشير إلى «الشكل (1-9أ)» ولا يضع تسميات على الأجزاء.)',draw:()=>F19()},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب: طريقة حل أي توصيل مركب</b> (1) ابحث عن مكثفات على التوازي بين نقطتين واجمعها في مكثف واحد. (2) ابحث عن مكثفات على التوالي واختزلها بالمعادلة (1-4). (3) كرر حتى يبقى مكثف واحد. (4) ارجع إلى الخلف: \\(Q=CV\\) للمكثف الواحد، ثم الشحنة نفسها في عناصر التوالي، ثم الجهد نفسه في فروع التوازي. جرّبها في المختبر: تظهر مراحل الاختزال تحت الدائرة.'},
  {h:'تمارين الوحدة الأولى 3 و 4 و 5',ref:'ص 23–24',html:Qd('تمرين 3','ثلاثة مكثفات موصلة على التوازي، فإذا كانت \\(C_1=15\\mu F,\\ C_2=6\\mu F,\\ C_3=4\\mu F\\)، والجهد المسلط على الدائرة <span class="ltr">250V</span>، أحسب: (أ) السعة المكافئة (ب) فرق الجهد على كل مكثف (جـ) الشحنة في كل مكثف.',
    '\\(C=15+6+4=25\\ \\mu F\\)؛ الجهد <span class="ltr">250 V</span> على كل مكثف؛ \\(Q_1=3.75\\times10^{-3}\\)، \\(Q_2=1.5\\times10^{-3}\\)، \\(Q_3=1\\times10^{-3}\\ C\\) (والكلية \\(6.25\\times10^{-3}\\ C\\)).')+
   `<p>تمرين 4: «من الدائرة الموضحة بالشكل (1-10)، إذا كانت \\(C_1=5\\mu F,\\ C_2=16\\mu F,\\ C_3=4\\mu F\\)، والجهد المسلط على الدائرة <span class="ltr">120V</span>، أحسب: (أ) السعة المكافئة (ب) فرق الجهد على كل مكثف (جـ) الشحنة في كل مكثف.»</p>`},
  {fig:'(1-10)',ref:'ص 23',caption:'تمرين 4: مجموعة توازي (16μF أعلى و 4μF أسفل) تليها على التوالي 5μF؛ V2 على المجموعة و V1 على 5μF، والسهم 120V. (التركيب نفسه في الشكل 1-9.)',draw:()=>box(F110(),440)},
  {html:Qd('تمرين 4','الشكل (1-10): \\(C_1=5\\mu F\\) على التوالي مع \\(C_2=16\\mu F\\parallel C_3=4\\mu F\\)، والجهد 120 V.',
    '\\(C_{23}=16+4=20\\ \\mu F\\)؛ \\(C=\\frac{5\\times20}{5+20}=4\\ \\mu F\\)؛ \\(Q=4\\times10^{-6}\\times120=4.8\\times10^{-4}\\ C\\)؛ \\(V_1=Q/C_1=96\\ V\\) و \\(V_2=Q/C_{23}=24\\ V\\) (على C<sub>2</sub> و C<sub>3</sub> معاً)؛ \\(Q_1=4.8\\times10^{-4}\\)، \\(Q_2=16\\times10^{-6}\\times24=3.84\\times10^{-4}\\)، \\(Q_3=9.6\\times10^{-5}\\ C\\).')+
   `<p>تمرين 5: «من الدائرة الموضحة بالشكل (1-11)، إذا كانت \\(C_1=5\\mu F,\\ C_2=4\\mu F,\\ C_3=10\\mu F,\\ C_4=3\\mu F,\\ C_5=7\\mu F\\) والجهد المسلط على الدائرة <span class="ltr">600V</span>، أحسب: (أ) السعة المكافئة (ب) فرق الجهد على كل مكثف V₁, V₂, V₃ (جـ) الشحنة في كل مكثف.»</p>`},
  {fig:'(1-11)',ref:'ص 24',caption:'تمرين 5: ثلاثة فروع متوازية (10μF و 3μF و 7μF) تليها على التوالي 4μF ثم 5μF؛ V3 على المجموعة و V2 على 4μF و V1 على 5μF، والسهم V = 600V.',draw:()=>box(F111(),560)},
  {html:Qd('تمرين 5','الشكل (1-11).',
    '\\(C_{345}=10+3+7=20\\ \\mu F\\)؛ \\(\\frac1C=\\frac15+\\frac14+\\frac1{20}=0.5\\) فتكون \\(C=2\\ \\mu F\\)؛ \\(Q=2\\times10^{-6}\\times600=1.2\\times10^{-3}\\ C\\)؛ \\(V_1=240\\ V\\)، \\(V_2=300\\ V\\)، \\(V_3=60\\ V\\) (المجموع 600 V)؛ \\(Q_1=Q_2=1.2\\times10^{-3}\\ C\\)، \\(Q_3=6\\times10^{-4}\\)، \\(Q_4=1.8\\times10^{-4}\\)، \\(Q_5=4.2\\times10^{-4}\\ C\\).')},
  {err:'<b>ملاحظات على الكتاب:</b> (1) ص 15: «الكثفات» والصحيح «المكثفات». (2) ص 18، الشكل (1-8): كُتب Q1 بجانب المكثف 8μF، بينما الحل يحسب \\(Q_1=C_1V\\) بـ \\(C_1=2\\mu F\\) — رتّبنا التسميات في الرسم لتطابق الحل. (3) ص 20، مثال (1-5): طُبع «\\(Q_1=Q_1=4\\times10^{-4}\\)» والمقصود \\(Q_1=Q\\)؛ ويستعمل الحل \\(V_3\\) في \\(Q_3=C_3V_3\\) دون أن يذكرها، وهي \\(V_3=V_2=50\\ V\\) لأن C₂ و C₃ على التوازي. (4) ص 19: يشير الحل إلى «الشكل (1-9أ)» ولا توجد تسميات أ/ب/جـ على أجزاء الشكل. لا توجد أخطاء حسابية.'}
 ],
 lab:(el)=>capLab(el,{id:'l3',title:'ابنِ دائرة مكثفات: توازي، مركب، أو توالي للمقارنة',ref:'مبنية على الأشكال (1-5) إلى (1-11) ص 15–24',
  modes:[['parallel','توازي'],['mixed','مركب'],['series','توالي']],start:{k:'e13',mode:'parallel',P:[8,12,10],S:[],V:200},
  presets:[{k:'e13',label:'مثال (1-3)',mode:'parallel',P:[8,12,10],S:[],V:200},{k:'e14a',label:'مثال (1-4) أ',mode:'series',P:[],S:[2,8],V:300},{k:'e14b',label:'مثال (1-4) ب',mode:'parallel',P:[2,8],S:[],V:300},{k:'e15',label:'مثال (1-5)',mode:'mixed',P:[5,3],S:[8],V:100},{k:'t3',label:'تمرين 3',mode:'parallel',P:[15,6,4],S:[],V:250},{k:'t4',label:'تمرين 4',mode:'mixed',P:[16,4],S:[5],V:120},{k:'t5',label:'تمرين 5',mode:'mixed',P:[10,3,7],S:[5,4],V:600}],
  steps:({st,seen,is})=>[
   {t:'مثال (1-3)',x:'اضغط «مثال (1-3)»: <span class="ltr">C = 30 μF</span>، والجهد <span class="ltr">200 V</span> على كل مكثف، والشحنات <span class="ltr">1600</span> و <span class="ltr">2400</span> و <span class="ltr">2000 μC</span> ومجموعها <span class="ltr">6000 μC</span> = \\(6\\times10^{-3}\\ C\\).',done:()=>is('e13')},
   {t:'أضف فرعاً',x:'اختر «4» في عدد الفروع: تزيد السعة المكافئة بمقدار سعة الفرع الجديد، ويبقى الجهد على كل مكثف كما هو.',done:()=>st.mode==='parallel'&&st.P.length===4},
   {t:'المكثفان نفساهما بطريقتين',x:'اضغط «مثال (1-4) أ» ثم «مثال (1-4) ب»: <span class="ltr">1.6 μF</span> على التوالي و <span class="ltr">10 μF</span> على التوازي.',done:()=>seen.has('e14a')&&seen.has('e14b')},
   {t:'التوصيل المركب',x:'اضغط «مثال (1-5)»: انظر مراحل الاختزال: <span class="ltr">C<sub>ab</sub> = 8 μF</span> ثم <span class="ltr">C<sub>ac</sub> = 4 μF</span>، والجهد <span class="ltr">50 V</span> على C1 و <span class="ltr">50 V</span> على المجموعة.',done:()=>is('e15')},
   {t:'تحقق من تمرين 5',x:'اضغط «تمرين 5» وقارن الجدول بإجابتك: <span class="ltr">C = 2 μF</span> و V1 و V2 و V3.',done:()=>is('t5')}
  ]}),
 examples:[
  {title:'مثال (1-3)',ref:'ص 16–17',q:'<p>«ثلاثة مكثفات موصلة على التوازي وسعة كل منهم 8μF و 12μF و 10μF فإذا كان فرق الجهد المسلط على المجموعة يساوي 200 V، أحسب: (أ) السعة المكافئة للمكثفات بالفاراد (ب) فرق الجهد على كل مكثف (جـ) الشحنة في كل مكثف (د) الشحنة الكلية.»</p>',
   given:[gC('C1','سعة المكثف الأول',8),gC('C2','سعة المكثف الثاني',12),gC('C3','سعة المكثف الثالث',10),gV(200)],solve:g=>parallelSteps([g.C1,g.C2,g.C3],g.V,{eq:[-3,-3,-3],eT:-3,ta:'(أ) المكثفات على التوازي كما في الشكل (1-6)، فالسعة المكافئة:'})},
  {title:'مثال (1-4)',ref:'ص 17–19',q:'<p>«مكثفان سعتهما 2μF و 8μF وصلا على التوالي، فإذا كان فرق الجهد المسلط عليهما يساوي 300V، أحسب: (أ) السعة المكافئة وكذلك الشحنة وفرق الجهد على كل مكثف. (ب) إذا وصل المكثفين على التوازي، احسب السعة المكافئة وكذلك الشحنة في كل مكثف وفرق الجهد على كل مكثف.»</p>',
   given:[gC('C1','سعة المكثف الأول',2),gC('C2','سعة المكثف الثاني',8),gV(300)],solve:g=>ex14(g)},
  {title:'مثال (1-5)',ref:'ص 19–20',q:`<p>«من الدائرة الموضحة بالشكل (1-9)، إذا كانت C₁ = 8μF, C₂ = 5μF, C₃ = 3μF، والجهد المسلط على الدائرة 100V، أحسب: (أ) السعة المكافئة (ب) فرق الجهد على كل مكثف (جـ) الشحنة في كل مكثف.»</p>${box(netSVG({P:[{top:'C2'},{top:'C3'}],S:[{top:'C1',va:'V1'}],gva:'V2',pts:{a:'a',b:'b',c:'c'},src:'arrow',vl:'V=100V'}),360)}`,
   given:[gC('C1','سعة C₁ (على التوالي)',8),gC('C2','سعة C₂',5),gC('C3','سعة C₃',3),gV(100)],solve:g=>mixedSteps([g.C2,g.C3],[g.C1],g.V,{eQ:-4,eP:[-4,-4]})},
  {title:'تمرين 3 — إجابة مقترحة (ليست من الكتاب)',ref:'ص 23',q:'<p>ثلاثة مكثفات على التوازي: \\(C_1=15\\mu F,\\ C_2=6\\mu F,\\ C_3=4\\mu F\\)، والجهد <span class="ltr">250V</span>.</p>',
   given:[gC('C1','سعة المكثف الأول',15),gC('C2','سعة المكثف الثاني',6),gC('C3','سعة المكثف الثالث',4),gV(250)],solve:g=>parallelSteps([g.C1,g.C2,g.C3],g.V,{total:false})},
  {title:'تمرين 4 — إجابة مقترحة (ليست من الكتاب)',ref:'ص 23',q:`<p>الشكل (1-10): \\(C_1=5\\mu F,\\ C_2=16\\mu F,\\ C_3=4\\mu F\\)، والجهد <span class="ltr">120V</span>.</p>${box(F110(),380)}`,
   given:[gC('C1','سعة C₁ (على التوالي)',5),gC('C2','سعة C₂',16),gC('C3','سعة C₃',4),gV(120)],solve:g=>mixedSteps([g.C2,g.C3],[g.C1],g.V,{})},
  {title:'تمرين 5 — إجابة مقترحة (ليست من الكتاب)',ref:'ص 24',q:`<p>الشكل (1-11): \\(C_1=5\\mu F,\\ C_2=4\\mu F,\\ C_3=10\\mu F,\\ C_4=3\\mu F,\\ C_5=7\\mu F\\)، والجهد <span class="ltr">600V</span>.</p>${box(F111(),460)}`,
   given:[gC('C1','سعة C₁ (توالي)',5),gC('C2','سعة C₂ (توالي)',4),gC('C3','سعة C₃',10),gC('C4','سعة C₄',3),gC('C5','سعة C₅',7),gV(600)],solve:g=>mixedSteps([g.C3,g.C4,g.C5],[g.C1,g.C2],g.V,{})}
 ],
 quiz:[
  {q:'السعة المكافئة لمكثفات موصلة على التوازي:',o:['مجموع مقلوبات السعات','مجموع السعات','أصغر سعة فيها','حاصل ضرب السعات'],c:1,e:'المعادلة (1-11): \\(C=C_1+C_2+C_3\\).'},
  {q:'ما الكمية الثابتة على كل المكثفات الموصلة على التوازي؟',o:['الشحنة','فرق الجهد','الطاقة','لا شيء'],c:1,e:'المعادلة (1-10).'},
  {q:'في مثال (1-3) شحنة المكثف \\(8\\mu F\\) على \\(200 V\\):',o:['\\(1.6\\times10^{-3}\\ C\\)','\\(1.6\\times10^{-6}\\ C\\)','\\(25\\ C\\)','\\(4\\times10^{-5}\\ C\\)'],c:0,e:'\\(Q_1=V\\,C_1=200\\times8\\times10^{-6}\\).'},
  {q:'مكثفان \\(2\\mu F\\) و \\(8\\mu F\\): سعتهما على التوالي وعلى التوازي على الترتيب:',o:['10 و 1.6 μF','1.6 و 10 μF','5 و 16 μF','1.6 و 16 μF'],c:1,e:'مثال (1-4).'},
  {q:'في التوازي يأخذ المكثف الأكبر سعة:',o:['جهداً أكبر','شحنة أكبر','شحنة أقل','الشحنة نفسها'],c:1,e:'\\(Q_i=C_i\\,V\\) والجهد واحد.'},
  {q:'في الشكل (1-9)، C₂ و C₃ بين النقطتين a و b موصلان:',o:['على التوالي','على التوازي','لا يتصلان','مع المصدر مباشرة'],c:1,e:'ص 19: \\(C_{ab}=C_2+C_3\\).'},
  {q:'في مثال (1-5) بعد حساب \\(C_{ab}=8\\mu F\\) مع \\(C_1=8\\mu F\\) على التوالي، السعة الكلية:',o:['16 μF','8 μF','4 μF','2 μF'],c:2,e:'\\(8\\times8/(8+8)=4\\ \\mu F\\).'},
  {q:'توصيل المكثفات على التوازي من حيث السعة الكلية يشبه:',o:['توصيل المقاومات على التوالي','توصيل المقاومات على التوازي','توصيل المكثفات على التوالي','لا شيء'],c:0,e:'السعة الكلية تزيد كما تزيد المقاومة الكلية في التوالي (ص 15).'}
 ]
});

/* ======================================================================
   Lesson 4 — الطاقة المختزنة (ص 20–24)
   ====================================================================== */
function ex16(g,o){o=o||{};const Q1=g.C1*g.V1*1e-6,Q2=g.C2*g.V2*1e-6,C=(g.C1+g.C2)*1e-6,W1=0.5*g.C1*1e-6*g.V1*g.V1+0.5*g.C2*1e-6*g.V2*g.V2,Q=Q1+Q2,W2=0.5*Q*Q/C;return [
  {t:'يمكن حساب الشحنة لكل مكثف كما يلي:',f:`Q_1=C_1V_1=${tsci(g.C1*1e-6,-6)}\\times${fm(g.V1)}`,v:fm(Q1,6),unit:'C'},
  {f:`Q_2=C_2V_2=${tsci(g.C2*1e-6,-6)}\\times${fm(g.V2)}`,v:fm(Q2,6),unit:'C'},
  {t:'أما السعة الكلية (بعد التوصيل على التوازي) فهي:',f:`C=C_1+C_2=(${fm(g.C1)}+${fm(g.C2)})\\times10^{-6}`,v:sci(C,-6),unit:'F'},
  {t:'وتكون الطاقة الكلية قبل التوصيل على التوازي — المعادلة (1-13) لكل مكثف:',f:`W_1=\\tfrac12C_1V_1^2+\\tfrac12C_2V_2^2=\\tfrac12\\times${tsci(g.C1*1e-6,-6)}\\times(${fm(g.V1)})^2+\\tfrac12\\times${tsci(g.C2*1e-6,-6)}\\times(${fm(g.V2)})^2`,v:fm(W1,6),unit:'J',final:true},
  {t:'أما الطاقة الكلية بعد التوصيل فهي \\(W_2=\\tfrac12 Q^2/C\\) — المعادلة (1-14)، حيث Q هي الشحنة الكلية:',f:`Q=Q_1+Q_2=${fm(Q1,6)}+${fm(Q2,6)}`,v:fm(Q,6),unit:'C'},
  {t:'وبالتالي فإن الطاقة الكلية بعد التوصيل:',f:`W_2=\\frac12\\,\\frac{Q^2}{C}=\\frac12\\times\\frac{(${fm(Q,6)})^2}{${tsci(C,-6)}}`,v:fm(W2,6),unit:'J',final:true},
  {t:'الفقد في الطاقة الكلية:',f:`W=W_1-W_2=${fm(W1,6)}-${fm(W2,6)}`,v:fm(W1-W2,6),unit:'J',final:true},
  {t:'أما فرق الجهد الكلي بعد التوصيل:',f:`V=\\frac{Q}{C}=\\frac{${fm(Q,6)}}{${tsci(C,-6)}}`,v:fm(Q/C,6),unit:'V',final:true}]}
function shareSVG(o){const conn=o.conn;let s=`<svg viewBox="0 0 560 210" role="img" aria-label="مكثفان مشحونان يوصلان على التوازي">`;
  const cap=(x,lbl,v,fill)=>wire(`M${x} 50V${105-5}M${x} ${105+5}V160`)+`<g transform="rotate(90 ${x} 105)">${capSym(x,105,{fill,pol:0})}</g>`+S.t(x+24,100,lbl,'','start')+S.t(x+24,118,fm(v,4)+' V','b','start')+S.t(x-14,84,'+','','end')+S.t(x-14,134,'−','','end');
  s+=cap(150,o.l1,o.v1,o.f1)+cap(410,o.l2,o.v2,o.f2);
  s+=wire('M150 50H250M150 160H250M310 50H410M310 160H410');
  // two switches (positive with positive, negative with negative)
  [50,160].forEach(y=>{s+=`<circle cx="250" cy="${y}" r="3.5" fill="var(--fg)"/><circle cx="310" cy="${y}" r="3.5" fill="var(--fg)"/>`+(conn?`<path d="M250 ${y}H310" stroke="var(--live)" stroke-width="3"/>`:`<path d="M250 ${y}L304 ${y-22}" stroke="var(--fg)" stroke-width="2.6"/>`)});
  s+=`<path d="M280 70V140" stroke="var(--muted)" stroke-dasharray="4 4"/>`;
  s+=arT(280,196,conn?'موصلان: الموجب مع الموجب والسالب مع السالب':'المفتاحان مفتوحان: كل مكثف بشحنته',{fs:12.5,col:'--muted'});
  return s+'</svg>'}
B.lesson({
 id:'u1-l4',unit:1,order:4,pages:'20–24',
 title:'الطاقة المختزنة في المكثف',
 summary:'شحن المكثف يخزن طاقة في المجال الكهربائي داخل العازل تساوي نصف السعة × مربع الجهد (وصورتان أخريان بدلالة الشحنة)، ومنها طاقة وحدة الحجم من العازل. وعند توصيل مكثفين مشحونين بجهدين مختلفين على التوازي تفقد جزءاً من الطاقة. مع مثال (1-6) والتمرين 6.',
 theory:[
  {h:'الطاقة المختزنة في المكثف',ref:'ص 20',html:`<p>«يستلزم شحن المكثف إعطائه طاقة كهربائية من المنبع الكهربائي الذي يقوم بشحنه، وهذه الطاقة <b>تختزن في المجال الكهربائي الذي يتكون في العازل</b>. وعند تفريغ المكثف يضمحل هذا المجال الكهربائي فتنطلق الطاقة الكهربائية منه.»</p>
   <p>«فإذا فرضنا أنه في خلال شحن المكثف يكون فرق الجهد على طرفيه V عندما تكون الشحنة على اللوح Q نجد أن زيادة الشحنة بمقدار dQ يستلزم وضع طاقة مقدارها في المكثف \\(dW=V\\,dQ\\)»:</p>
   $$dW=V\\times dQ \\qquad Q=C\\times V \\qquad dQ=C\\times dV \\qquad\\Rightarrow\\qquad dW=C\\times V\\times dV$$
   <p>«ولذلك فإن الطاقة المختزنة في المكثف عندما يزداد الجهد من الصفر إلى V تكون:» <span class="ref">ص 21</span></p>
   $$W=\\int_0^V C\\,v\\,dv=C\\left[\\frac{v^2}{2}\\right]_0^V=\\frac12\\,C\\,V^2\\quad \\text{Joules} \\qquad (1\\text{-}13)$$
   <p>«وحيث أن \\(Q=CV,\\ V=Q/C\\) ولذلك نحصل على صور أخرى للطاقة المختزنة كالآتي:»</p>
   $$W=\\frac12CV^2=\\frac12QV=\\frac12\\frac{Q^2}{C}\\quad \\text{Joules} \\qquad (1\\text{-}14)$$`},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب:</b> لو رسمنا الشحنة Q (رأسياً) مع الجهد V (أفقياً) أثناء الشحن لحصلنا على خط مستقيم \\(Q=CV\\). الطاقة \\(\\int V\\,dQ\\) هي <b>مساحة المثلث</b> تحت هذا الخط: \\(\\tfrac12\\times V\\times Q\\). ولأن الجهد في المعادلة مربّع، <b>مضاعفة الجهد تضاعف الطاقة أربع مرات</b>. ترى المثلث يكبر في المختبر.'},
  {h:'الطاقة في وحدة الحجم من العازل',ref:'ص 21',html:`<p>«إذا كانت مساحة اللوح في المكثف A (m²) والمسافة بين اللوحين (سمك العازل الكهربائي بين اللوحين) d متر، ومعامل عزله الكهربائي ε، نجد أن الطاقة المختزنة في وحدة الحجم من العازل الكهربائي هي:»</p>
   $$W=\\frac{\\tfrac12CV^2}{A\\,d}=\\frac{\\tfrac12\\,\\frac{\\varepsilon A}{d}\\,V^2}{A\\,d}=\\frac12\\,\\varepsilon\\left(\\frac{V}{d}\\right)^2 \\qquad (1\\text{-}15)$$
   $$=\\frac12\\,\\varepsilon E^2=\\frac12\\,D\\,E=\\frac12\\,\\frac{D^2}{\\varepsilon}\\quad \\text{Joules/m}^3$$`},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب:</b> الكتاب يستعمل في المعادلة (1-15) الرمزين E و D دون تعريف. \\(E=V/d\\) هي <b>شدة المجال الكهربائي</b> بين اللوحين (بوحدة V/m)، و \\(D=\\varepsilon E\\) هي <b>كثافة الفيض الكهربائي</b> (بوحدة C/m²). مثال: مكثف هوائي عليه 100 V والمسافة 1 mm: \\(E=10^5\\ V/m\\) والطاقة في كل متر مكعب \\(\\tfrac12\\times8.854\\times10^{-12}\\times(10^5)^2\\approx0.044\\ J/m^3\\).'},
  {h:'مثال (1-6)',ref:'ص 21–22',html:`<p>«مكثفان سعة الأول <span class="ltr">20μF</span> وفرق الجهد بين طرفيه <span class="ltr">1000V</span> وسعة الثاني <span class="ltr">10μF</span> وفرق الجهد بين طرفيه <span class="ltr">100V</span>. ثم وصل المكثفات على التوازي. احسب الطاقة الكلية قبل التوصيل. ومقدار فقدان الطاقة بعد التوصيل. احسب كذلك فرق الجهد الكلي بين طرفي المكثفات بعد التوصيل.»</p>
   <p>الحل (تفصيله في «الأمثلة المحلولة»): \\(Q_1=0.02\\ C\\) و \\(Q_2=0.001\\ C\\)، والسعة الكلية \\(30\\times10^{-6}\\ F\\)، والطاقة قبل التوصيل \\(W_1=10.05\\ J\\)، وبعده \\(W_2=\\tfrac12Q^2/C=7.35\\ J\\)، فالفقد <span class="ltr">2.7 J</span>، والجهد بعد التوصيل <span class="ltr">700 V</span>.</p>`},
  {note:'<b>توضيح للمتدرب — ليس من الكتاب:</b> (1) الحل يفترض أن الطرف الموجب لكل مكثف وُصل بالموجب للآخر، فتُجمع الشحنتان \\(Q=Q_1+Q_2\\) (الشحنة لا تضيع). (2) الطاقة هي التي تنقص: تتحول إلى حرارة في أسلاك التوصيل وإلى شرارة لحظة التوصيل. (3) لو كان الجهدان متساويين قبل التوصيل لما مرّت شحنة بين المكثفين ولما فُقدت طاقة — جرّب ذلك في المختبر.'},
  {h:'تمرين 6',ref:'ص 24',html:Qd('تمرين 6','مكثفان سعة الأول <span class="ltr">25μF</span> وفرق الجهد بين طرفيه <span class="ltr">1100V</span> وسعة الثاني <span class="ltr">15μF</span> وفرق الجهد بين طرفيه <span class="ltr">150V</span>. تم وصل المكثفات على التوازي. احسب الطاقة الكلية قبل التوصيل ومقدار فقدان الطاقة بعد التوصيل. احسب كذلك فرق الجهد الكلي بين طرفي المكثفات بعد التوصيل.',
    '\\(Q_1=0.0275\\ C\\)، \\(Q_2=0.00225\\ C\\)؛ \\(W_1=15.125+0.16875=15.29375\\ J\\)؛ \\(C=40\\ \\mu F\\)، \\(Q=0.02975\\ C\\)؛ \\(W_2=\\tfrac12\\times0.02975^2/(40\\times10^{-6})\\approx11.063\\ J\\)؛ الفقد \\(\\approx4.23\\ J\\)؛ الجهد بعد التوصيل \\(V=0.02975/(40\\times10^{-6})=743.75\\ V\\). الحاسبة في «الأمثلة المحلولة».')},
  {err:'<b>ملاحظة على الكتاب (ص 21):</b> المعادلة (1-15) تستعمل E و D دون أن يعرّفهما الكتاب (عرّفناهما في التوضيح أعلاه). ولا توجد أخطاء حسابية في مثال (1-6).'}
 ],
 lab:(el)=>{
  let C=20,Vs=1000,v=0,mode='hold',t=0,Wsrc=0,Wout=0,Wst=0;const hist=[];const sh={C1:20,V1:1000,C2:10,V2:100,conn:false,preset:'e16',dirty:false};const did={};
  el.innerHTML=`<div id="l4tp"></div><div class="grid cx-lab">
   <div class="panel c7"><h2>شحن المكثف وتفريغه <small>مبنية على المعادلات (1-13) و(1-14) ص 21</small></h2>
    <div class="cx-row"><button class="btn primary" id="l4chg">شحن من المصدر</button><button class="btn" id="l4hold">افصل (احتفظ بالشحنة)</button><button class="btn" id="l4dis">فرّغ في المقاومة</button></div>
    <div class="svgbox" id="l4vt"></div>
    <p class="sub">الشحن والتفريغ عبر مقاومة \\(R\\) (توضيحية — الكتاب لا يذكر دائرة الشحن)، وثابت الزمن \\(\\tau=RC\\) = <b class="ltr" id="l4tau"></b>. بعد نحو \\(5\\tau\\) يكتمل الشحن تقريباً.</p></div>
   <div class="panel c5"><h2>التحكم</h2>${sl('l4C','سعة المكثف C',1,100,1,C)}${sl('l4V','جهد المصدر V',0,1000,10,Vs)}
    <div class="facts">${fact('جهد المكثف v','l4v')}${fact('الشحنة Q = C v','l4q')}${fact('W = ½ C v²','l4w1')}${fact('W = ½ Q v','l4w2')}${fact('W = ½ Q² / C','l4w3')}${fact('تيار الشحن','l4i')}</div></div>
   <div class="panel c12"><h2>الطاقة = مساحة المثلث تحت خط Q–V <small>توضيح للمتدرب لاشتقاق المعادلة (1-13)</small></h2><div class="svgbox" id="l4qv" style="max-width:720px;margin-inline:auto"></div>
    <div class="facts">${fact('الطاقة التي أعطاها المصدر منذ بدء الشحن (Vs × ΔQ)','l4ws')}${fact('ذهبت حرارة في المقاومة','l4wr')}${fact('خرجت من المكثف عند التفريغ','l4wo')}</div>
    <p class="sub"><b>توضيح للمتدرب — ليس من الكتاب:</b> عند الشحن من الصفر يعطي المصدر \\(Q\\,V\\) ويختزن المكثف نصفها فقط، والنصف الآخر يتحول حرارة في المقاومة مهما كانت قيمتها.</p></div>
   <div class="panel c12"><h2>مكثفان مشحونان يوصلان على التوازي <small>مثال (1-6) ص 21–22 والتمرين 6 ص 24</small></h2>
    <div class="cx-row"><button class="btn" data-l4p="e16">مثال (1-6)</button><button class="btn" data-l4p="t6">تمرين 6</button><button class="btn primary" id="l4conn"></button></div>
    <div class="cx-sliders">${sl('l4c1','C₁',1,50,1,sh.C1)}${sl('l4v1','V₁ قبل التوصيل',0,1500,10,sh.V1)}${sl('l4c2','C₂',1,50,1,sh.C2)}${sl('l4v2','V₂ قبل التوصيل',0,1500,10,sh.V2)}</div>
    <div class="svgbox" id="l4sh" style="max-width:560px;margin-inline:auto"></div>
    <div class="facts">${fact('Q₁ + Q₂ (لا تتغير)','l4sq')}${fact('الطاقة قبل التوصيل W₁','l4sw1')}${fact('الطاقة بعد التوصيل W₂','l4sw2')}${fact('الفقد W₁ − W₂','l4sl')}${fact('الجهد بعد التوصيل','l4sv')}</div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l4st"></ol></div></div>`;
  B.math(el);const $=s=>el.querySelector(s);
  const TP=B.params($('#l4tp'),'u1-l4',[{k:'R',label:'مقاومة دائرة الشحن والتفريغ R (توضيحية)',unit:'kΩ',value:50,min:0.1,max:100000,step:0.1}],()=>{hist.length=0});
  const tau=()=>TP.v.R*1e3*C*1e-6;
  const btns=()=>{['chg','hold','dis'].forEach(k=>$('#l4'+k).classList.toggle('primary',mode===k))};
  $('#l4chg').onclick=()=>{mode='chg';Wsrc=0;Wst=0.5*C*1e-6*v*v;btns()};$('#l4hold').onclick=()=>{mode='hold';btns()};$('#l4dis').onclick=()=>{mode='dis';Wout=0;btns()};
  $('#l4C').oninput=e=>{const q=C*v;C=+e.target.value;if(mode==='hold')v=q/C;hist.length=0};$('#l4V').oninput=e=>{Vs=+e.target.value};
  const shDraw=()=>{const Q1=sh.C1*sh.V1*1e-6,Q2=sh.C2*sh.V2*1e-6,Ct=(sh.C1+sh.C2)*1e-6,W1=0.5*sh.C1*1e-6*sh.V1**2+0.5*sh.C2*1e-6*sh.V2**2,Vf=(Q1+Q2)/Ct,W2=0.5*Ct*Vf*Vf;
   ['c1','v1','c2','v2'].forEach(k=>{$('#l4'+k+'-v').textContent=fm(sh[k.toUpperCase()],0)+(k[0]==='c'?' μF':' V')});
   const vm=Math.max(sh.V1,sh.V2,1);
   $('#l4sh').innerHTML=shareSVG({conn:sh.conn,l1:'C1 = '+fm(sh.C1)+' μF',l2:'C2 = '+fm(sh.C2)+' μF',v1:sh.conn?Vf:sh.V1,v2:sh.conn?Vf:sh.V2,f1:(sh.conn?Vf:sh.V1)/vm,f2:(sh.conn?Vf:sh.V2)/vm});
   $('#l4conn').textContent=sh.conn?'افصل المكثفين':'أغلق المفتاحين (وصّل على التوازي)';
   $('#l4sq').textContent=fm(Q1+Q2,6)+' C';$('#l4sw1').textContent=fm(W1,6)+' J';$('#l4sw2').textContent=sh.conn?fm(W2,6)+' J':'—';$('#l4sl').textContent=sh.conn?fm(W1-W2,6)+' J':'—';$('#l4sv').textContent=sh.conn?fm(Vf,6)+' V':'—';};
  [['c1','C1'],['v1','V1'],['c2','C2'],['v2','V2']].forEach(([k,K])=>{$('#l4'+k).oninput=e=>{sh[K]=+e.target.value;sh.conn=false;sh.dirty=true;sh.preset=null;shDraw()}});
  const SP={e16:{C1:20,V1:1000,C2:10,V2:100},t6:{C1:25,V1:1100,C2:15,V2:150}};
  el.querySelectorAll('[data-l4p]').forEach(b=>b.onclick=()=>{const p=SP[b.dataset.l4p];Object.assign(sh,p,{conn:false,preset:b.dataset.l4p,dirty:false});['c1','v1','c2','v2'].forEach(k=>{$('#l4'+k).value=sh[k.toUpperCase()]});shDraw()});
  $('#l4conn').onclick=()=>{sh.conn=!sh.conn;if(sh.conn)did.conn=1;shDraw()};
  const steps=stepsUI($('#l4st'),[
   {t:'اشحن المكثف',x:'بقيم البداية (<span class="ltr">20 μF</span> و <span class="ltr">1000 V</span> — المكثف الأول في مثال 1-6) اضغط «شحن» وانتظر حتى يصل جهده إلى جهد المصدر: \\(W=\\tfrac12\\times20\\times10^{-6}\\times1000^2=10\\ J\\)، والصور الثلاث للمعادلة (1-14) متساوية.',done:()=>mode==='chg'&&C===20&&Vs===1000&&v>0.995*Vs},
   {t:'نصف الجهد = ربع الطاقة',x:'اجعل جهد المصدر <span class="ltr">500 V</span> واشحن من جديد: تنزل الطاقة إلى <span class="ltr">2.5 J</span> (الربع) لأن الجهد مربع في المعادلة (1-13).',done:()=>C===20&&Vs===500&&Math.abs(v-500)<2.5&&mode!=='dis'},
   {t:'فرّغ المكثف',x:'اضغط «فرّغ»: «يضمحل المجال الكهربائي فتنطلق الطاقة» — تابع الطاقة الخارجة حتى يقترب الجهد من الصفر.',done:()=>mode==='dis'&&v<1},
   {t:'مثال (1-6)',x:'في اللوحة السفلية اضغط «مثال (1-6)» ثم «أغلق المفتاحين»: <span class="ltr">W₁ = 10.05 J</span>، <span class="ltr">W₂ = 7.35 J</span>، الفقد <span class="ltr">2.7 J</span>، والجهد <span class="ltr">700 V</span>.',done:()=>sh.preset==='e16'&&!sh.dirty&&sh.conn},
   {t:'بلا فقد',x:'اجعل V₂ مساوياً لـ V₁ ثم وصّل: لا تنتقل شحنة بين المكثفين فيكون الفقد صفراً.',done:()=>sh.conn&&sh.V1===sh.V2&&sh.V1>0}
  ]);
  btns();shDraw();
  loopOn(el,dt=>{t+=dt;const T=Math.max(tau(),1e-6),v0=v;
   if(mode==='chg'){v+=(Vs-v)*(1-Math.exp(-dt/T));const dq=C*1e-6*(v-v0);Wsrc+=Vs*dq}
   else if(mode==='dis'){v*=Math.exp(-dt/T);Wout+=0.5*C*1e-6*(v0*v0-v*v)}
   hist.push([t,v]);const win=clamp(6*T,1,120);while(hist.length&&hist[0][0]<t-win)hist.shift();if(hist.length>1500)hist.splice(0,hist.length-1500);
   const q=C*1e-6*v,W=0.5*C*1e-6*v*v,i=mode==='chg'?(Vs-v)/(TP.v.R*1e3):mode==='dis'?-v/(TP.v.R*1e3):0;
   $('#l4C-v').textContent=fm(C)+' μF';$('#l4V-v').textContent=fm(Vs,0)+' V';$('#l4tau').textContent=T>=1?fm(T,3)+' s':fm(T*1e3,3)+' ms';
   $('#l4v').textContent=fm(v,1)+' V';$('#l4q').textContent=fmtC(q);$('#l4w1').textContent=fmtJ(W);$('#l4w2').textContent=fmtJ(0.5*q*v);$('#l4w3').textContent=fmtJ(C>0?0.5*q*q/(C*1e-6):0);$('#l4i').textContent=Math.abs(i)>=1?fm(i,3)+' A':fm(i*1e3,3)+' mA';
   $('#l4ws').textContent=mode==='chg'?fmtJ(Wsrc):'—';$('#l4wr').textContent=mode==='chg'?fmtJ(Math.max(0,Wsrc-(W-Wst))):'—';$('#l4wo').textContent=mode==='dis'?fmtJ(Wout):'—';
   const ym=niceMax(Math.max(Vs,v,10));
   $('#l4vt').innerHTML=plotSVG({w:620,h:220,x0:Math.max(0,t-win),x1:Math.max(win,t),y0:0,y1:ym,yt:ticks(ym),xt:[],xl:'t',yl:'v (V)',series:[{pts:hist,col:'--live',w:2}],aria:'جهد المكثف مع الزمن'});
   const xm=niceMax(Math.max(Vs,v,10)),qm=C*1e-6*xm;
   $('#l4qv').innerHTML=plotSVG({w:720,h:240,x0:0,x1:xm,y0:0,y1:qm,yt:ticks(qm),yf:y=>fm(y*1e3,3),xt:ticks(xm),xl:'V (V)',yl:'Q (mC)',
    under:(X,Y)=>`<path d="M${fx(X(0))} ${fx(Y(0))}L${fx(X(v))} ${fx(Y(q))}L${fx(X(v))} ${fx(Y(0))}Z" fill="var(--live-soft)" stroke="var(--live)"/>`+S.t(fx(X(v*0.66)),fx(Y(q*0.18)),'W = '+fmtJ(W),'b'),
    series:[{pts:[[0,0],[xm,qm]],col:'--blue',w:1.6,dash:'5 4'}],extra:(X,Y)=>`<circle cx="${fx(X(v))}" cy="${fx(Y(q))}" r="5" fill="var(--live)"/>`,aria:'الشحنة مع الجهد'});
   steps.check()});
 },
 examples:[
  {title:'مثال (1-6)',ref:'ص 21–22',q:'<p>«مكثفان سعة الأول 20μF وفرق الجهد بين طرفيه 1000V وسعة الثاني 10μF وفرق الجهد بين طرفيه 100V. ثم وصل المكثفات على التوازي. احسب الطاقة الكلية قبل التوصيل. ومقدار فقدان الطاقة بعد التوصيل. احسب كذلك فرق الجهد الكلي بين طرفي المكثفات بعد التوصيل.»</p>',
   given:[gC('C1','سعة المكثف الأول',20),{id:'V1',label:'جهد المكثف الأول',sym:'V_1',unit:'V',value:1000},gC('C2','سعة المكثف الثاني',10),{id:'V2',label:'جهد المكثف الثاني',sym:'V_2',unit:'V',value:100}],solve:g=>ex16(g)},
  {title:'تمرين 6 — إجابة مقترحة (ليست من الكتاب)',ref:'ص 24',q:'<p>مكثفان: الأول <span class="ltr">25μF</span> على <span class="ltr">1100V</span> والثاني <span class="ltr">15μF</span> على <span class="ltr">150V</span>، وُصلا على التوازي.</p>',
   given:[gC('C1','سعة المكثف الأول',25),{id:'V1',label:'جهد المكثف الأول',sym:'V_1',unit:'V',value:1100},gC('C2','سعة المكثف الثاني',15),{id:'V2',label:'جهد المكثف الثاني',sym:'V_2',unit:'V',value:150}],solve:g=>ex16(g)},
  {title:'حاسبة الطاقة المختزنة — المعادلة (1-13)',ref:'ص 21',q:'<p>ليست مثالاً من الكتاب: الطاقة في مكثف سعته C مشحون إلى جهد V بالصور الثلاث للمعادلة (1-14). القيم الابتدائية من المكثف الأول في مثال (1-6).</p>',
   given:[gC('C','سعة المكثف',20),{id:'V',label:'الجهد',sym:'V',unit:'V',value:1000}],
   solve:g=>{const C=g.C*1e-6,Q=C*g.V;return [{f:`W=\\tfrac12CV^2=\\tfrac12\\times${tsci(C,-6)}\\times(${fm(g.V)})^2`,v:fm(0.5*C*g.V*g.V,6),unit:'J',final:true},{t:'الشحنة:',f:`Q=CV`,v:fm(Q,6),unit:'C'},{f:`W=\\tfrac12QV=\\tfrac12\\times${fm(Q,6)}\\times${fm(g.V)}`,v:fm(0.5*Q*g.V,6),unit:'J'},{f:`W=\\tfrac12\\frac{Q^2}{C}`,v:fm(0.5*Q*Q/C,6),unit:'J'}]}}
 ],
 quiz:[
  {q:'الطاقة المختزنة في مكثف سعته C وجهده V:',o:['\\(CV\\)','\\(\\tfrac12CV^2\\)','\\(CV^2\\)','\\(\\tfrac12C^2V\\)'],c:1,e:'المعادلة (1-13).'},
  {q:'أين تختزن طاقة المكثف؟',o:['في اللوحين المعدنيين','في المجال الكهربائي داخل العازل','في أسلاك التوصيل','في المصدر'],c:1,e:'ص 20.'},
  {q:'مكثف \\(20\\mu F\\) مشحون إلى \\(1000 V\\). طاقته:',o:['0.02 J','10 J','20 J','20000 J'],c:1,e:'\\(\\tfrac12\\times20\\times10^{-6}\\times10^6=10\\ J\\).'},
  {q:'إذا ضاعفنا جهد المكثف فإن طاقته:',o:['تتضاعف','تبقى كما هي','تصبح أربعة أضعاف','تنقص إلى النصف'],c:2,e:'الجهد مربع في \\(W=\\tfrac12CV^2\\).'},
  {q:'أي مما يلي <b>ليس</b> صورة صحيحة للطاقة المختزنة؟',o:['\\(\\tfrac12QV\\)','\\(\\tfrac12Q^2/C\\)','\\(\\tfrac12CV^2\\)','\\(\\tfrac12Q/V\\)'],c:3,e:'المعادلة (1-14).'},
  {q:'عند توصيل مكثفين مشحونين بجهدين مختلفين على التوازي:',o:['تزيد الطاقة الكلية','تنقص الطاقة الكلية وتبقى الشحنة الكلية','تنقص الشحنة الكلية','لا يتغير شيء'],c:1,e:'مثال (1-6): الطاقة 10.05 ← 7.35 J والشحنة 0.021 C في الحالتين.'},
  {q:'في مثال (1-6) الجهد على المكثفين بعد التوصيل:',o:['550 V','700 V','1100 V','900 V'],c:1,e:'\\(V=Q/C=0.021/30\\times10^{-6}=700\\ V\\).'},
  {q:'الطاقة المختزنة في وحدة الحجم من العازل:',o:['\\(\\tfrac12\\varepsilon(V/d)^2\\)','\\(\\varepsilon A/d\\)','\\(Q/V\\)','\\(\\tfrac12 CV\\)'],c:0,e:'المعادلة (1-15).'}
 ]
});

})(PLCBOOK);
