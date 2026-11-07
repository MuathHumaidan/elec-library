/* دوائر كهربائية-1 — الوحدة السادسة: الدوائر المغناطيسية (ص 157–182)
   Lessons u6-l1 … u6-l4 (source: /home/claude/c4/ex/c1_d.md lessons 6–9). Helpers are copied from u5.js. */
(function(B){
const {S}=B;
const PI=Math.PI,D=PI/180,MU0=4*PI*1e-7;
const fm=(x,d)=>B.fmtN(x,d);
const fx=v=>(+v).toFixed(1);
const lt=s=>`<span class="ltr">${s}</span>`;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const sig=(x,n)=>(!isFinite(x)||x===0)?x:+(+x).toPrecision(n);
/* scientific text: 2.5e-5 → "2.5 × 10⁻⁵" (HTML) */
const SUP={'-':'⁻','0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'};
function sci(x,n){if(Math.abs(x)<1e-15)return '0';if(!isFinite(x))return '∞';n=n||3;const e=Math.floor(Math.log10(Math.abs(x)));if(e>=-2&&e<=4)return fm(sig(x,n));const m=sig(x/Math.pow(10,e),n);return `${fm(m)} × 10${String(e).split('').map(c=>SUP[c]).join('')}`}
/* LaTeX scientific: 2.5e-5 → 2.5\times10^{-5} */
function sx(x,n){if(x===0)return '0';n=n||3;const e=Math.floor(Math.log10(Math.abs(x)));if(e>=-2&&e<=4)return String(fm(sig(x,n)));const m=sig(x/Math.pow(10,e),n);return `${fm(m)}\\times10^{${e}}`}
/* value with SI prefix */
function eng(x,u,n){if(!isFinite(x))return '∞ '+u;if(Math.abs(x)<1e-13)return '0 '+u;const a=Math.abs(x);const P=[[1e3,'k'],[1,''],[1e-3,'m'],[1e-6,'μ'],[1e-9,'n']];let p=P.find(q=>a>=q[0]*0.9995)||P[P.length-1];if(a>=1e6)p=[1e3,'k'];return `${fm(sig(x/p[0],n||3))} ${p[1]}${u}`}

/* ---------- styles used only by the circuits-1 magnetism units (CSS variables only) ---------- */
(function css(){if(typeof document==='undefined'||document.getElementById('c1mg-css'))return;const s=document.createElement('style');s.id='c1mg-css';s.textContent=`
.mg-sl{display:flex;flex-direction:column;gap:2px;font-size:13.5px;margin-top:10px;min-width:0}
.mg-sl .mg-h{display:flex;justify-content:space-between;gap:8px;align-items:baseline}
.mg-sl b{font-family:var(--mono);direction:ltr;unicode-bidi:isolate;color:var(--blue-ink);font-size:14px;white-space:nowrap}
.mg-sl input[type=range]{width:100%;accent-color:var(--blue);direction:ltr;margin:4px 0}
.mg-row{display:flex;gap:8px 12px;flex-wrap:wrap;margin-top:10px;align-items:center}
.mg-row .sub{margin:0}
.mg-lab .seg{flex-wrap:wrap;max-width:100%}
.mg-lab .seg button{white-space:nowrap}
.mg-q{border:1px solid var(--line);border-radius:12px;padding:10px 14px;margin:10px 0;background:var(--surface)}
.mg-q summary{cursor:pointer;font-weight:600;line-height:1.7}
.mg-ans{margin-top:8px;border-inline-start:3px solid var(--blue);padding:6px 12px;background:var(--blue-soft);border-radius:0 10px 10px 0}
.mg-chip{display:inline-block;padding:2px 10px;border-radius:999px;font-size:12.5px;font-weight:700;background:var(--surface-2);color:var(--muted)}
.mg-chip.ok{background:var(--on-soft);color:var(--on)}
.mg-chip.ld{background:var(--blue-soft);color:var(--blue-ink)}
.mg-chip.warn{background:var(--stop-soft);color:var(--stop)}
.mg-chip.hot{background:var(--live-soft);color:var(--live)}
.mg-try{margin:6px 0 0;padding-inline-start:20px}
.mg-figs{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;align-items:end}
.mg-figs figure{margin:0;text-align:center;font-size:13px;color:var(--muted)}
.mg-svg svg{touch-action:none}
.mg-bar{display:flex;height:22px;border-radius:6px;overflow:hidden;border:1px solid var(--line);margin-top:6px;font-size:11.5px;font-weight:700}
.mg-bar i{display:flex;align-items:center;justify-content:center;font-style:normal;color:var(--surface);overflow:hidden;white-space:nowrap}
.mg-tbl{overflow-x:auto}
.mg-tbl table.tt td,.mg-tbl table.tt th{padding:6px 8px}
.ex-q .seg{margin:6px 0 2px}
.mg-num{width:92px;font:inherit;font-family:var(--mono);direction:ltr;padding:3px 6px;border:1px solid var(--line);border-radius:8px;background:var(--surface);color:var(--fg)}
`;document.head.appendChild(s)})();

/* ---------- «كما في الكتاب / المصحح» toggle inside a worked example ----------
   bfSeg(key) goes in the example's q html; solve() reads bfMode(key).
   Clicking re-runs the example (dispatches 'input' on one of its given fields). */
const BF=(typeof window!=='undefined')?(window.C1BF=window.C1BF||{}):{};
const bfMode=k=>BF[k]||'book';
const bfSeg=k=>`<div class="seg" role="group" data-bfk="${k}"><button data-bf="book" aria-pressed="${bfMode(k)==='book'}">كما في الكتاب</button><button data-bf="fixed" aria-pressed="${bfMode(k)==='fixed'}">المصحح</button></div>`;
if(typeof document!=='undefined'&&!window.C1BFON){window.C1BFON=1;document.addEventListener('click',e=>{const b=e.target.closest('[data-bf]');if(!b)return;const g=b.closest('[data-bfk]');if(!g)return;
  BF[g.dataset.bfk]=b.dataset.bf;g.querySelectorAll('[data-bf]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
  const sec=g.closest('.ex');const inp=sec&&sec.querySelector('[data-g]');if(inp)inp.dispatchEvent(new Event('input'));});}

/* ---------- small lab helpers ---------- */
function loopOn(el,fn){let last=performance.now();const f=now=>{if(!document.body.contains(el))return;const dt=Math.min(0.05,Math.max(0,(now-last)/1000));last=now;try{fn(dt)}catch(e){console.error(e);return}requestAnimationFrame(f)};requestAnimationFrame(f)}
function stepsUI(host,steps){let i=0;
  const draw=()=>{host.innerHTML=steps.map((s,j)=>`<li class="${j<i?'done':j===i?'cur':''}"><span class="k">${j<i?'✓':j+1}</span><div><h4>${s.t}</h4><p>${s.x}</p>${j===i?`<div class="act">${s.done?'<span class="hint">بانتظار تنفيذك…</span> <button class="btn" data-next>تخطَّ</button>':'<button class="btn primary" data-next>التالي</button>'}</div>`:''}</div></li>`).join('')+
    (i>=steps.length?`<li class="cur"><span class="k">✓</span><div><h4>أحسنت، أنهيت التجربة</h4><p style="display:block">جرّب قيماً أخرى، أو أعد التجربة من أولها.</p><div class="act"><button class="btn" data-restart>إعادة التجربة</button></div></div></li>`:'');B.math(host)};
  host.addEventListener('click',e=>{if(e.target.closest('[data-next]')){i++;draw()}if(e.target.closest('[data-restart]')){i=0;draw()}});draw();
  return {check(){const s=steps[i];if(s&&s.done&&s.done()){i++;draw()}},redraw:draw};}
const sl=(id,label,min,max,step,val)=>`<label class="mg-sl"><span class="mg-h"><span>${label}</span><b id="${id}-v"></b></span><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}" aria-label="${label.replace(/<[^>]+>/g,'')}"></label>`;
const segHTML=(attr,items,cur)=>`<div class="seg" role="group">${items.map(([v,l])=>`<button data-${attr}="${v}" aria-pressed="${String(v)===String(cur)}">${l}</button>`).join('')}</div>`;
const segSet=(el,attr,v)=>el.querySelectorAll(`[data-${attr}]`).forEach(b=>b.setAttribute('aria-pressed',String(String(b.dataset[attr])===String(v))));
const segBind=(el,attr,fn)=>el.querySelectorAll(`[data-${attr}]`).forEach(b=>b.addEventListener('click',()=>{segSet(el,attr,b.dataset[attr]);fn(b.dataset[attr])}));
const fact=(l,id)=>`<div class="fact"><span>${l}</span><b id="${id}">—</b></div>`;
const tryList=items=>`<div class="callout"><b>جرّب:</b><ol class="mg-try">${items.map(x=>`<li>${x}</li>`).join('')}</ol></div>`;
const arT=(x,y,s,o)=>{o=o||{};return `<text class="txt ar" x="${x}" y="${y}" text-anchor="${o.a||'middle'}"${o.fs?` font-size="${o.fs}"`:''}${o.col?` style="fill:var(${o.col})"`:''}>${s}</text>`};
const sb=(b,x)=>`${b}<tspan font-size="9" dy="4">${x}</tspan><tspan dy="-4"> </tspan>`;
const box=(svg,max)=>`<div class="svgbox" style="margin-inline:auto;${max?`max-width:${max}px`:''}">${svg}</div>`;
const Q=(n,q,ans)=>`<details class="mg-q"><summary>${n}: ${q}</summary><div class="mg-ans"><b>إجابة مقترحة (ليست من الكتاب):</b> ${ans}</div></details>`;
function arrow(x1,y1,x2,y2,col,w){w=w||2.4;const a=Math.atan2(y2-y1,x2-x1),L=Math.hypot(x2-x1,y2-y1);if(L<3)return '';const h=Math.min(11,L*0.7)+w;
  const bx=x2-h*Math.cos(a),by=y2-h*Math.sin(a),px=-Math.sin(a)*h*0.45,py=Math.cos(a)*h*0.45;
  return `<path d="M${fx(x1)} ${fx(y1)}L${fx(bx)} ${fx(by)}" stroke="var(${col})" stroke-width="${w}" fill="none" stroke-linecap="round"/><path d="M${fx(x2)} ${fx(y2)}L${fx(bx+px)} ${fx(by+py)}L${fx(bx-px)} ${fx(by-py)}Z" fill="var(${col})"/>`}
/* arrow head only, at (x,y) pointing along angle a */
function head(x,y,a,col,s){s=s||7;const c=Math.cos(a),n=Math.sin(a);return `<path d="M${fx(x+c*s)} ${fx(y+n*s)}L${fx(x-c*s*0.7-n*s*0.6)} ${fx(y-n*s*0.7+c*s*0.6)}L${fx(x-c*s*0.7+n*s*0.6)} ${fx(y-n*s*0.7-c*s*0.6)}Z" fill="var(${col})"/>`}
function zig(x1,y1,x2,y2,n,cls,st){n=n||6;const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy),ux=dx/len,uy=dy/len,nx=-uy,ny=ux,lead=len*0.16,seg=(len-2*lead)/n;let p=`M${fx(x1)} ${fx(y1)}L${fx(x1+ux*lead)} ${fx(y1+uy*lead)}`;
  for(let i=0;i<n;i++){const s=(i%2?-1:1)*7,m=lead+seg*(i+0.5);p+=`L${fx(x1+ux*m+nx*s)} ${fx(y1+uy*m+ny*s)}`}
  return `<path class="w ${cls||''}" ${st||''} d="${p}L${fx(x2-ux*lead)} ${fx(y2-uy*lead)}L${fx(x2)} ${fx(y2)}"/>`}
function ind(x1,y1,x2,y2,n,cls,st){n=n||4;const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy),ux=dx/len,uy=dy/len;const lead=len*0.14,seg=(len-2*lead)/n,r=seg/2;
  let p=`M${fx(x1)} ${fx(y1)}L${fx(x1+ux*lead)} ${fx(y1+uy*lead)}`;for(let i=1;i<=n;i++){p+=`A${fx(r)} ${fx(r)} 0 0 1 ${fx(x1+ux*(lead+seg*i))} ${fx(y1+uy*(lead+seg*i))}`}
  return `<path class="w ${cls||''}" ${st||''} d="${p}L${fx(x2)} ${fx(y2)}"/>`}
/* simple SVG x-y plot. o:{w,h,x0,x1,y0,y1,xt,yt,xl,yl,series:[{pts,col,w,dash}],extra(X,Y)} */
function plotSVG(o){const W=o.w||520,H=o.h||260,L=o.left||50,R=14,T=14,Bm=38;
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
/* SVG pointer → user coords */
function svgPt(svg,e){const p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;const m=svg.getScreenCTM();if(!m)return {x:0,y:0};const q=p.matrixTransform(m.inverse());return {x:q.x,y:q.y}}
const nice=t=>{t=Math.max(t,1e-12);const e=Math.pow(10,Math.floor(Math.log10(t)));return [1,2,5,10].map(k=>k*e).find(v=>v>=t*0.999)};

/* ======================================================================
   2-D field engine
   sources: {t:'q',x,y,q} magnetic pole (3-D 1/r² law, for magnet pictures)
            {t:'w',x,y,I}  long straight wire ⊥ page, I>0 = out of the page (⊙)
            {t:'u',bx,by}  uniform field
   (SVG coordinates, y downward; a wire with I>0 gives a counter-clockwise field on screen)
   ====================================================================== */
function fieldAt(src,x,y){let bx=0,by=0;for(const s of src){
  if(s.t==='u'){bx+=s.bx;by+=s.by;continue}
  const dx=x-s.x,dy=y-s.y,r2=dx*dx+dy*dy+1e-6;
  if(s.t==='q'){const r3=r2*Math.sqrt(r2);bx+=s.q*dx/r3;by+=s.q*dy/r3}
  else{bx+=s.I*dy/r2;by+=-s.I*dx/r2}}
  return [bx,by]}
/* stream function of 2-D current systems (level lines = field lines) */
function psiAt(src,x,y,rmin){let p=0;for(const s of src){if(s.t==='u'){p+=-s.by*x+s.bx*y;continue}if(s.t==='w'){const r=Math.max(rmin||6,Math.hypot(x-s.x,y-s.y));p+=s.I*Math.log(r)}}return p}
/* marching squares → one SVG path of all level lines psi = L0 + kΔ */
function contourPath(f,x0,y0,x1,y1,st,L0,dl){const nx=Math.ceil((x1-x0)/st),ny=Math.ceil((y1-y0)/st),W=nx+1;const V=new Float64Array(W*(ny+1));
  for(let j=0;j<=ny;j++)for(let i=0;i<=nx;i++)V[j*W+i]=f(x0+i*st,y0+j*st);
  let d='';const P=(xa,ya,va,xb,yb,vb,L)=>{const t=(L-va)/(vb-va);return [xa+(xb-xa)*t,ya+(yb-ya)*t]};
  for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){const a=V[j*W+i],b=V[j*W+i+1],c=V[(j+1)*W+i+1],e=V[(j+1)*W+i];
    const mn=Math.min(a,b,c,e),mx=Math.max(a,b,c,e);if(!isFinite(mn)||!isFinite(mx))continue;
    const k0=Math.ceil((mn-L0)/dl),k1=Math.floor((mx-L0)/dl);if(k1<k0||k1-k0>40)continue;
    const xa=x0+i*st,ya=y0+j*st,xb=xa+st,yb=ya+st;
    for(let k=k0;k<=k1;k++){const L=L0+k*dl;const pts=[];
      if((a<L)!==(b<L))pts.push(P(xa,ya,a,xb,ya,b,L));
      if((b<L)!==(c<L))pts.push(P(xb,ya,b,xb,yb,c,L));
      if((e<L)!==(c<L))pts.push(P(xa,yb,e,xb,yb,c,L));
      if((a<L)!==(e<L))pts.push(P(xa,ya,a,xa,yb,e,L));
      for(let q=0;q+1<pts.length;q+=2)d+=`M${fx(pts[q][0])} ${fx(pts[q][1])}L${fx(pts[q+1][0])} ${fx(pts[q+1][1])}`;}}
  return d}
/* arrowheads where the level lines cross a probe segment */
function probeHeads(src,f,xa,ya,xb,yb,L0,dl,col,skip){let s='';const n=Math.ceil(Math.hypot(xb-xa,yb-ya));let pv=f(xa,ya),lx=-1e9,ly=-1e9;
  for(let i=1;i<=n;i++){const x=xa+(xb-xa)*i/n,y=ya+(yb-ya)*i/n,v=f(x,y);const ka=Math.floor((pv-L0)/dl),kb=Math.floor((v-L0)/dl);
    if(ka!==kb&&(!skip||!skip(x,y))&&Math.hypot(x-lx,y-ly)>11){const [bx,by]=fieldAt(src,x,y);if(Math.hypot(bx,by)>0){s+=head(x,y,Math.atan2(by,bx),col,5.5);lx=x;ly=y}}pv=v}
  return s}
/* trace one field line (RK4) from a point; dir=+1 along B, −1 against */
function traceLine(src,x0,y0,dir,o){const h=o.h||3,pts=[[x0,y0]];let x=x0,y=y0;const bd=o.bounds||[-40,-40,700,460];
  const f=(x,y)=>{const b=fieldAt(src,x,y),m=Math.hypot(b[0],b[1])||1e-12;return [dir*b[0]/m,dir*b[1]/m]};
  for(let i=0;i<(o.n||900);i++){const k1=f(x,y),k2=f(x+k1[0]*h/2,y+k1[1]*h/2),k3=f(x+k2[0]*h/2,y+k2[1]*h/2),k4=f(x+k3[0]*h,y+k3[1]*h);
    x+=h*(k1[0]+2*k2[0]+2*k3[0]+k4[0])/6;y+=h*(k1[1]+2*k2[1]+2*k3[1]+k4[1])/6;pts.push([x,y]);
    if(x<bd[0]||y<bd[1]||x>bd[2]||y>bd[3])break;if(o.stop&&o.stop(x,y))break;}
  return pts}
const ptsD=p=>p.map((q,i)=>(i?'L':'M')+fx(q[0])+' '+fx(q[1])).join('');
/* magnet picture: lines leave each N pole (q>0) and end on S poles */
function magnetLines(src,o){o=o||{};let d='',hd='';const Ns=src.filter(s=>s.t==='q'&&s.q>0),Ss=src.filter(s=>s.t==='q'&&s.q<0);
  const stop=(x,y)=>Ss.some(s=>Math.hypot(x-s.x,y-s.y)<6);
  Ns.forEach(n=>{const k=o.n||12,a0=(o.a0!=null?o.a0:50)*D,a1=(o.a1!=null?o.a1:310)*D,ref=n.ang||0;
    for(let i=0;i<k;i++){const a=ref+a0+(a1-a0)*i/(k-1);const p=traceLine(src,n.x+6*Math.cos(a),n.y+6*Math.sin(a),1,{stop,bounds:o.bounds,n:o.steps||800});
      if(p.length<4)continue;d+=ptsD(p);const m=p[Math.floor(p.length*0.45)],m2=p[Math.floor(p.length*0.45)+1]||m;hd+=head(m[0],m[1],Math.atan2(m2[1]-m[1],m2[0]-m[0]),o.col||'--blue',5)}});
  /* lines arriving at S from far away (traced backwards); skip those that end on an N pole (already drawn) */
  const stopN=(x,y)=>Ns.some(s=>Math.hypot(x-s.x,y-s.y)<6);
  Ss.forEach(n=>{const k=o.n||12,a0=(o.a0!=null?o.a0:50)*D,a1=(o.a1!=null?o.a1:310)*D,ref=(n.ang!=null?n.ang:PI);
    for(let i=0;i<k;i++){const a=ref+a0+(a1-a0)*i/(k-1);const p=traceLine(src,n.x+6*Math.cos(a),n.y+6*Math.sin(a),-1,{stop:stopN,bounds:o.bounds,n:o.steps||800});
      if(p.length<4)continue;const e=p[p.length-1];if(stopN(e[0],e[1]))continue;p.reverse();d+=ptsD(p);const m=p[Math.floor(p.length*0.55)],m2=p[Math.floor(p.length*0.55)+1]||m;hd+=head(m[0],m[1],Math.atan2(m2[1]-m[1],m2[0]-m[0]),o.col||'--blue',5)}});
  return {d,hd}}
/* iron filings: short dashes along B */
function filings(src,x0,y0,x1,y1,st,bref,skip){let d='';let seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
  for(let y=y0;y<=y1;y+=st)for(let x=x0;x<=x1;x+=st){const px=x+(rnd()-0.5)*st*0.7,py=y+(rnd()-0.5)*st*0.7;if(skip&&skip(px,py))continue;
    const [bx,by]=fieldAt(src,px,py),m=Math.hypot(bx,by);if(m<bref*0.02)continue;const L=4.5*clamp(Math.pow(m/bref,0.25),0.5,1.3),c=bx/m,s=by/m;
    d+=`M${fx(px-c*L)} ${fx(py-s*L)}L${fx(px+c*L)} ${fx(py+s*L)}`}
  return `<path d="${d}" stroke="var(--fg)" stroke-width="1.6" opacity=".55" stroke-linecap="round"/>`}
/* compass needle at (x,y) pointing along angle a (red = N end) */
function compassSVG(x,y,a,id,r){r=r||20;const c=Math.cos(a),s=Math.sin(a),w=4.5;
  return `<g ${id?`id="${id}"`:''} style="cursor:grab"><circle cx="${fx(x)}" cy="${fx(y)}" r="${r+4}" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6" opacity=".95"/>
   <path d="M${fx(x+c*r)} ${fx(y+s*r)}L${fx(x-s*w)} ${fx(y+c*w)}L${fx(x+s*w)} ${fx(y-c*w)}Z" fill="var(--stop)"/>
   <path d="M${fx(x-c*r)} ${fx(y-s*r)}L${fx(x-s*w)} ${fx(y+c*w)}L${fx(x+s*w)} ${fx(y-c*w)}Z" fill="var(--muted)"/><circle cx="${fx(x)}" cy="${fx(y)}" r="2" fill="var(--fg)"/></g>`}
/* bar magnet body (N red / S grey); horizontal unless vert */
function barSVG(x,y,w,h,flip,vert){const nC='var(--stop)',sC='var(--lamp-off)';
  if(vert)return `<rect x="${x}" y="${y}" width="${w}" height="${h/2}" fill="${flip?sC:nC}" stroke="var(--fg)"/><rect x="${x}" y="${y+h/2}" width="${w}" height="${h/2}" fill="${flip?nC:sC}" stroke="var(--fg)"/>`+S.t(x+w/2,y+h/4+5,flip?'S':'N','')+S.t(x+w/2,y+3*h/4+5,flip?'N':'S','');
  return `<rect x="${x}" y="${y}" width="${w/2}" height="${h}" fill="${flip?sC:nC}" stroke="var(--fg)"/><rect x="${x+w/2}" y="${y}" width="${w/2}" height="${h}" fill="${flip?nC:sC}" stroke="var(--fg)"/>`+S.t(x+w/4,y+h/2+5,flip?'S':'N','',null,14)+S.t(x+3*w/4,y+h/2+5,flip?'N':'S','',null,14)}
/* wire cross-section ⊙ / ⊗ */
function wireDot(x,y,I,r,lbl){r=r||10;const out=I>=0;return `<circle cx="${fx(x)}" cy="${fx(y)}" r="${r}" fill="var(--live-soft)" stroke="var(--live)" stroke-width="2.4"/>`+(out?`<circle cx="${fx(x)}" cy="${fx(y)}" r="${r*0.28}" fill="var(--live)"/>`:`<path d="M${fx(x-r*0.55)} ${fx(y-r*0.55)}L${fx(x+r*0.55)} ${fx(y+r*0.55)}M${fx(x+r*0.55)} ${fx(y-r*0.55)}L${fx(x-r*0.55)} ${fx(y+r*0.55)}" stroke="var(--live)" stroke-width="2.4"/>`)+(lbl?S.t(fx(x),fx(y-r-6),lbl,'b'):'')}

const NC='var(--stop)',SC='var(--lamp-off)';
/* ---------- B–H curves read approximately from الشكل (3) ص 182 (linear H axis) ---------- */
const BH={
 wi:{n:'حديد مطاوع Wrought iron',p:[[0,0],[50,0.1],[100,0.4],[200,0.85],[400,1.15],[700,1.3],[1000,1.4],[2000,1.52],[4000,1.62],[6000,1.7],[10000,1.8]]},
 ms:{n:'صلب طري وصفائح Mild & Sheet Steel',p:[[0,0],[60,0.08],[120,0.3],[250,0.75],[400,1.0],[700,1.25],[1000,1.35],[2000,1.5],[4000,1.6],[6000,1.67],[10000,1.75]]},
 st:{n:'ستالوي Stalloy',p:[[0,0],[25,0.08],[60,0.45],[100,0.75],[200,1.0],[400,1.2],[1000,1.35],[2000,1.45],[4000,1.55],[10000,1.68]]},
 cs:{n:'صلب مسبوك Cast Steel',p:[[0,0],[150,0.1],[300,0.3],[500,0.55],[1000,1.0],[2000,1.4],[3000,1.52],[5000,1.62],[10000,1.7]]},
 ci:{n:'حديد مسبوك (زهر) Cast Iron',p:[[0,0],[300,0.08],[600,0.18],[1000,0.3],[2000,0.5],[3000,0.6],[5000,0.7],[7000,0.8],[10000,0.9]]}};
/* linear interpolation in a monotone table; beyond the end: slope μ0 (air-like) */
function interp(p,x,ix,iy){if(x<=p[0][ix])return p[0][iy];for(let k=1;k<p.length;k++){if(x<=p[k][ix]){const a=p[k-1],b=p[k];return a[iy]+(b[iy]-a[iy])*(x-a[ix])/(b[ix]-a[ix])}}
  const e=p[p.length-1];return ix===0?e[1]+MU0*(x-e[0]):e[0]+(x-e[1])/MU0}
const BofH=(m,H)=>interp(BH[m].p,H,0,1),HofB=(m,Bv)=>interp(BH[m].p,Bv,1,0);
/* magnetic core picture: rectangular frame, coil on left leg, optional air gap on right leg */
function coreSVG(o){o=o||{};const W=o.W||420,Hh=o.H||300,x0=o.x0||110,y0=o.y0||40,w=o.w||220,h=o.h||210,t=o.t||40,g=o.g||0;
  let s=`<svg viewBox="0 0 ${W} ${Hh}" role="img" aria-label="${o.aria||'دائرة مغناطيسية'}">`;
  const gy=y0+h/2;
  s+=`<path d="M${x0} ${y0}H${x0+w}V${gy-g/2}H${x0+w-t}V${y0+t}H${x0+t}V${y0+h-t}H${x0+w-t}V${gy+g/2}H${x0+w}V${y0+h}H${x0}Z" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.6"/>`;
  if(g>0)s+=`<path d="M${x0+w-t} ${gy-g/2}H${x0+w}M${x0+w-t} ${gy+g/2}H${x0+w}" stroke="var(--fg)" stroke-width="1.6"/>`;
  if(o.fringe&&g>0)for(let k=-1;k<=1;k+=2)s+=`<path d="M${x0+w-t+4} ${gy-g/2}C${x0+w-t-14+(k>0?t+28:0)} ${gy-g/2+4} ${x0+w-t-14+(k>0?t+28:0)} ${gy+g/2-4} ${x0+w-t+4+(k>0?t-8:0)} ${gy+g/2}" fill="none" stroke="var(--stop)" stroke-width="1.4" opacity=".8"/>`;
  const mp=`M${x0+t/2} ${y0+t/2}H${x0+w-t/2}V${y0+h-t/2}H${x0+t/2}Z`;s+=`<path d="${mp}" fill="none" stroke="var(--blue)" stroke-width="${o.fw||1.6}" stroke-dasharray="${o.solid?'':'6 4'}"/>`;
  const fl=o.flow==null?1:o.flow;if(fl){s+=head(x0+w/2,y0+t/2,0,'--blue',7)+head(x0+w-t/2,y0+h*0.8,PI/2,'--blue',7)+head(x0+w/2,y0+h-t/2,PI,'--blue',7)+head(x0+t/2,y0+h*0.2,-PI/2,'--blue',7)}
  if(o.leak)s+=`<ellipse cx="${x0+t/2}" cy="${y0+h/2}" rx="${t*1.6}" ry="${h*0.3}" fill="none" stroke="var(--live)" stroke-width="1.4" stroke-dasharray="4 3"/>`+arT(x0-t*0.6,y0+h*0.2-6,'فيض متسرب',{fs:11.5,col:'--live'});
  const nT=o.nT||7,cy0=y0+h*0.28,cy1=y0+h*0.72;for(let k=0;k<nT;k++){const yy=cy0+(k+0.5)*(cy1-cy0)/nT;s+=`<ellipse cx="${x0+t/2}" cy="${fx(yy)}" rx="${t/2+8}" ry="5" fill="none" stroke="var(--live)" stroke-width="2.2"/>`}
  s+=`<path class="w ${o.on?'flow':''}" d="M${x0-8} ${fx(cy0+4)}H${x0-50}M${x0-8} ${fx(cy1-4)}H${x0-50}"/>`+arrow(x0-46,cy0-8,x0-16,cy0-8,'--live',2)+S.t(x0-56,cy0-4,'I','','end',13)+S.t(x0-56,(cy0+cy1)/2+4,'N','','end',13);
  return s+(o.extra||'')+'</svg>'}
function fig61(){return box(coreSVG({extra:S.t(220,30,'mean core length ℓc','m','middle')+`<rect x="290" y="128" width="40" height="44" fill="var(--blue-soft)" stroke="var(--blue)" opacity=".8"/>`+S.t(340,150,'Ac','b','start',13)+S.t(220,150,'μ','','middle',16)}),400)}
/* analogy circuits (fig 6-2) — o.vals {E,R,I,F,Rm,Phi} text */
function analogySVG(o){o=o||{};const v=o.vals||{};let s=`<svg viewBox="0 0 640 210" role="img" aria-label="الدائرة الكهربائية والدائرة المغناطيسية المكافئة">`;
  const one=(x,src,res,cur,eq,vs,vr,vc)=>{let g=`<path class="w" d="M${x} 40H${x+200}V160H${x}Z"/><circle cx="${x}" cy="100" r="18" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/>`+S.t(x,105,src,'','middle',14);
   g+=`<rect x="${x+188}" y="64" width="24" height="72" fill="var(--surface)"/>`+zig(x+200,64,x+200,136,6,'')+S.t(x+218,104,res,'','start',14)+arrow(x+70,40,x+130,40,'--blue',2.4)+S.t(x+100,30,cur,'b','middle',14);
   g+=S.t(x+100,190,eq,'','middle',14);if(vs)g+=S.t(x-24,100,vs,'b','end');if(vr)g+=S.t(x+182,152,vr,'b','end');if(vc)g+=S.t(x+100,62,vc,'b','middle');return g};
  s+=one(50,'E','R','I','I = E/R',v.E,v.R,v.I)+one(390,'ℑ','ℜc','φc','φc = ℑ/ℜ',v.F,v.Rm,v.Phi);
  return s+'</svg>'}
function bhAxes(o){return plotSVG(Object.assign({w:560,h:280,x0:0,x1:10000,y0:0,y1:2,xt:[0,2000,4000,6000,8000,10000],yt:[0,0.4,0.8,1.2,1.6,2],left:46,xl:'H (A/m)',yl:'B (T)',aria:'منحنى المغنطة'},o))}
function fig64(){const pts=[];for(let k=0;k<=100;k++){const H=k*100;pts.push([H,BofH('cs',H)])}return bhAxes({series:[{pts,col:'--fg'}],extra:(X,Y)=>`<circle cx="${fx(X(2000))}" cy="${fx(Y(1.4))}" r="6" fill="var(--stop)"/>`+arrow(X(2000),Y(1.4)-50,X(2000),Y(1.4)-10,'--fg',2)+S.t(X(2000)+10,Y(1.4)-40,'C','','start',15)})}
function fig65a(){const pts=[];for(let k=0;k<=100;k++){const H=k*100;pts.push([H,BofH('cs',H)])}
  const tan=(H,len,c)=>{const b=BofH('cs',H),sl=(BofH('cs',H+50)-BofH('cs',H-50))/100;return [[H-len,b-sl*len],[H+len,b+sl*len]]};
  return bhAxes({series:[{pts,col:'--fg'},{pts:tan(150,900),col:'--blue',w:1.6},{pts:tan(750,500),col:'--blue',w:1.6},{pts:tan(3000,2500),col:'--blue',w:1.6}],
   extra:(X,Y)=>arT(X(1300),Y(0.15),'μ منخفضة',{fs:12,col:'--blue'})+arT(X(1600),Y(0.8),'μ عالية',{fs:12,col:'--blue'})+arT(X(6500),Y(1.85),'تشبع: μ تقل',{fs:12,col:'--blue'})})}
const LOG5B=[['فاناديوم برمندور',[[1,0],[50,0.1],[100,0.6],[200,1.6],[1000,2.05],[10000,2.25]]],['حديد الصلب',[[10,0],[100,0.3],[1000,1.3],[10000,1.8]]],['معدن دلتا',[[1,0],[6,0.2],[8,1.4],[20,1.55],[10000,1.55]]],['48 NI',[[1,0.05],[5,0.6],[50,1.2],[10000,1.5]]],['M-19',[[15,0],[50,0.8],[100,1.3],[1000,1.6],[10000,1.8]]],['AISI 1020',[[30,0],[200,0.5],[1000,1.3],[10000,1.8]]],['رقائق برمالوي',[[1,0.38],[3,0.6],[10,0.72],[10000,0.72]]],['حديد طري',[[40,0],[300,0.12],[10000,0.35]]]];
function fig65b(){const X0=0,X1=4,cols=['--stop','--fg','--blue','--live','--on','--muted','--blue-ink','--stop'];
  return plotSVG({w:620,h:300,x0:X0,x1:X1,y0:0,y1:2.4,xt:[0,1,2,3,4],xf:v=>String(Math.pow(10,v)),yt:[0,0.4,0.8,1.2,1.6,2,2.4],left:46,xl:'H (A/m) — مقياس لوغاريتمي',yl:'B (T)',
   series:LOG5B.map((c,i)=>({pts:c[1].map(p=>[Math.log10(p[0]),p[1]]),col:cols[i],w:1.8,dash:i>5?'5 3':''})),
   extra:(X,Y)=>LOG5B.map((c,i)=>{const p=c[1][c[1].length-1];return arT(X(Math.log10(p[0]))-4,Y(p[1])-5-(i===2?10:0)-(i===4?8:0),c[0],{fs:11,a:'end',col:cols[i]})}).join(''),aria:'منحنيات المغنطة لبعض المواد'})}

B.lesson({
 id:'u6-l1',unit:6,order:1,pages:'157–165',
 title:'الدائرة المغناطيسية: القوة الدافعة المغناطيسية والممانعة ومنحنى المغنطة',
 summary:'الدائرة المغناطيسية مسار مغلق للفيض فيه مصدر قوة دافعة مغناطيسية ℑ = NI وممانعة ℜ = ℓ/(μA)، ويربطهما «قانون أوم المغناطيسي» φ = ℑ/ℜ. ثم الفيض المتسرب والتقوس عند الثغرة الهوائية، ومنحنى المغنطة والتشبع، وجدول المقارنة مع الدائرة الكهربائية.',
 theory:[
  {h:'الوحدة السادسة: الدوائر المغناطيسية',ref:'ص 157–158',html:`<p><b>الهدف العام للوحدة:</b> معرفة أساسيات الكهرومغناطيسية اللازمة لفهم دوائر وقياسات التيار المتردد.</p><p><b>الأهداف التفصيلية:</b></p>
   <ol><li>أن يعرف المتدرب التعريفات الخاصة بالدوائر المغناطيسية (التدفق المغناطيسي، والقوة الدافعة المغناطيسية، والممانعة المغناطيسية).</li><li>أن يعرف المتدرب الممانعة المغناطيسية (المقاومة المغناطيسية) والعوامل التي تؤثر عليها وكيفية حسابها.</li><li>أن يقارن المتدرب بين الدوائر المغناطيسية والدوائر الكهربائية.</li><li>أن يتمكن المتدرب من تطبيق قانون أوم للدوائر المغناطيسية.</li><li>أن يتمكن المتدرب من تطبيق قانوني كيرشوف للدوائر المغناطيسية.</li><li>أن يرسم المتدرب منحنى التمغنط لبعض المواد المغناطيسية.</li><li>أن يتمكن المتدرب من تركيب بعض التطبيقات على دوائر مغناطيسية بسيطة.</li></ol>
   <p class="sub">دروس الوحدة: (1) هذا الدرس، (2) قانونا كيرشوف والدوائر المكافئة، (3) حسابات عددية بثغرات هوائية وجداول B-H، (4) الملفات وأنواعها وسلوكها في التيارين، وتمارين الوحدة.</p>`},
  {h:'الدوائر المغناطيسية',ref:'ص 159',html:`<p>تعتبر الدائرة المغناطيسية غالباً مكافئة للدائرة الكهربية، وهي <b>مسار مغلق يجري فيه فيض مغناطيسي</b> ويحتوي مصدر قوة محركة مغناطيسية وممانعة تعاكس حركة الفيض. فوجود قوة محركة مغناطيسية ينتج تدفقاً مغناطيسياً كما أن القوة المحركة الكهربائية تنتج تياراً كهربائياً، وممانعة الدائرة المغناطيسية مكافئة لمقاومة الدائرة الكهربائية بينما تكافئ النفاذية الموصلية. وتتكون الدائرة عادة من قلب مغناطيسي بطول متوسط \\(\\ell\\) ومساحة مقطع عرضي \\(A\\).</p>
   <p>وكما ثبت في قوانين ماكسويل فإنه لا وجود للشحنة المغناطيسية، والذي يقطع الدائرة المغناطيسية هو الفيض المغناطيسي الذي يمثل خطوط المجال التي تقطع مساحة ما. ويجب التأكيد أن القوة المحركة المغناطيسية — على عكس ما يوحي الاسم — <b>ليست قوة ميكانيكية</b>. وتستخدم الدوائر المغناطيسية في المحولات والآلات الكهربائية والعديد من النبائط الكهروميكانيكية.</p>
   <p>تتكون الدائرة المغناطيسية من مسار مقفل للفيض يتولد عادة نتيجة لمرور تيار في سلك ملفوف ومحيط بمسار الفيض. وكما عرفنا كثافة المجال \\(B\\) في الوحدة السابقة بمعادلة القوة:</p>
   $$F=B\\,I\\,\\ell\\quad\\text{N} \\qquad (6\\text{-}1)$$
   <p>حيث \\(F\\) القوة المغناطيسية (الميكانيكية) بالنيوتن التي تظهر على موصل مستقيم طوله \\(\\ell\\) بالمتر يمر به تيار \\(I\\) بالأمبير في وضع متعامد مع مجال كثافته \\(B\\) بالتسلا. والعلاقة بين الفيض وكثافته والمساحة:</p>
   $$\\Phi=B\\,A\\quad\\text{أو}\\quad B=\\frac{\\Phi}{A} \\qquad (6\\text{-}2)$$ <p>ووحدة الفيض الويبر، وتبين (6-2) أن \\(1.0\\ \\text{Wb/m}^2=1.0\\ \\text{T}\\).</p>`},
  {h:'القوة الدافعة المغناطيسية والممانعة',ref:'ص 160–161',html:`<p>مصادر المجال المغناطيسي إما مغناطيس دائم، أو تيار كهربائي يمر في ملف. ولقياس فاعلية التيار في إنتاج الفيض نعرّف <b>القوة الدافعة المغناطيسية (mmf)</b>:</p>
   $$\\Im=N\\times I\\quad(\\text{Ampere-turns AT}) \\qquad (6\\text{-}3)$$ $$\\Im=\\Re\\times\\phi\\quad(\\text{AT}) \\qquad (6\\text{-}4)$$ $$\\Re=\\frac{\\ell}{\\mu A}\\quad(\\text{AT/Wb}) \\qquad (6\\text{-}5)$$
   <p>حيث \\(I\\) التيار المار في ملف عدد لفاته \\(N\\)، وتقدر \\(\\Im\\) بالأمبير لفة (AT). ويبين الشكل (٦-١) رسماً تخطيطياً لدائرة مغناطيسية تحتوي القوة الدافعة المغناطيسية والفيض. ويمكن استنتاج العلاقة بين التيار \\(I\\) وشدة المجال \\(H\\) من قانون أمبير الدائري:</p>
   $$\\oint H\\,d\\ell=N\\times I \\qquad (6\\text{-}6)$$ $$H_C\\times\\ell_C=N\\times I \\qquad (6\\text{-}7)$$
   <p>ويحدد قانون أمبير الدائري وحدة شدة المجال بالقيمة 1 أمبير/متر. ويكون قلب الدائرة عادة من الحديد المغناطيسي، والعلاقة بين شدة المجال وكثافة الفيض:</p>
   $$B_C=\\mu H_C \\qquad (6\\text{-}8)\\qquad\\quad B_C=\\mu_r\\mu_0H_C\\qquad \\mu_0=4\\pi\\times10^{-7}\\ \\text{Wb/AT·m}$$`},
  {fig:'(٦-١)',ref:'ص 160',caption:'دائرة مغناطيسية: ملف عدد لفاته N يمر فيه التيار I على قلب نفاذيته μ، طول مساره المتوسط ℓc (المتقطع) ومساحة مقطعه Ac.',draw:fig61},
  {h:'قانون أوم للدوائر المغناطيسية',ref:'ص 162',html:`$$\\Im_m=\\phi\\times\\Re_m=N I\\qquad \\Re_m=\\frac{\\ell}{\\mu A}$$ $$\\phi=\\frac{\\Im_m}{\\Re_m}=\\frac{\\mu N I A}{\\ell}=N I\\left(\\frac{\\mu_r\\mu_0A}{\\ell}\\right)=\\Im_m\\left(\\frac{\\mu_r\\mu_0A}{\\ell}\\right) \\qquad (6\\text{-}9)$$
   <p>تتبع الدوائر المغناطيسية قانوناً يطابق قانون أوم بعد تنظير الكميات الكهربائية والمغناطيسية (الشكل ٦-٢)، ويبين الجدول (٦-١) التناظر بين الدائرتين.</p>`},
  {fig:'(٦-٢)',ref:'ص 162',caption:'الدائرة المكافئة المغناطيسية بالتناظر مع الدائرة الكهربائية.',draw:()=>box(analogySVG(),600)},
  {h:'الفرق بين الدائرة الكهربائية والدائرة المغناطيسية',ref:'ص 162–163',html:`<ol><li>في الدائرة الكهربائية يوجد فقد في القدرة يقاس بالوات قيمته \\(RI^2\\) في المقاومة، بينما لا يوجد فقد يسمى \\(\\Re\\Phi^2\\) في الممانعة المغناطيسية.</li>
   <li>يمكن أن يتخذ الفيض المغناطيسي مسارات تسريبية (الشكل ٦-٣)، بينما لا يوجد ذلك للتيارات الكهربائية المارة خلال المقاومات.<br>يتسرب جزء من الفيض الناشئ في الدائرة ويأخذ مسارات عشوائية، ويسمى هذا الجزء <b>بالفيض المتسرب Leakage flux</b> ويعتبر غير مفيد في الدائرة. ويحسب <b>معامل التسرب</b>: $$\\text{معامل التسرب}=\\frac{\\text{الفيض الكلي}}{\\text{الفيض المفيد}}$$ ويتراوح هذا المعامل في الآلات الكهربائية الحديثة بين <b>1.1 و 1.25</b>.</li>
   <li>في الدوائر المغناطيسية المحتوية على ثغرات هوائية نأخذ في الاعتبار مقدار <b>التقوس Fringing</b> في خطوط الفيض (الشكل ٦-٣)، بينما لا يوجد تقوس للتيارات في الدوائر الكهربائية. ويزداد التقوس كلما زاد طول الثغرة الهوائية، ويزيد من المساحة الفعالة لمقطع الثغرة.</li></ol>`},
  {note:'<b>إضافة من خارج الكتاب — الرمز λ:</b> يستعمل الكتاب في مثال (٦-٦) الرمز \\(\\lambda\\) لمعامل التسرب دون أن يعرّفه رمزاً: \\(\\lambda=\\Phi_{\\text{الكلي}}/\\Phi_{\\text{المفيد}}\\ge1\\). فإذا كان المطلوب فيضاً مفيداً \\(\\Phi_g\\) في الثغرة، فإن الفيض الذي يجب أن يمر في الحديد قرب الملف هو \\(\\lambda\\,\\Phi_g\\). \\(\\lambda=1\\) يعني لا تسرب.'},
  {fig:'(٦-٣)',ref:'ص 163',caption:'دائرة مغناطيسية محتوية على ثغرة هوائية: فيض القلب (Core flux)، والفيض المتسرب حول الملف (Leakage flux)، والتقوس حول الثغرة (Fringing flux)، و F = NI.',draw:()=>box(coreSVG({g:16,leak:true,fringe:true,extra:S.t(345,155,'Air gap','m','start')+S.t(220,240,'F = NI','','middle',13)}),420)},
  {h:'منحنى المغنطة (التشبع)',ref:'ص 163–164',html:`<p>إن النفاذية النسبية \\(\\mu_r\\) للمواد المغناطيسية لا تكون عادة ثابتة على طول المدى، وإنما تبدأ في النقصان بعد قيمة معينة لكثافة الفيض \\(B\\)، وتسمى هذه الحالة <b>بالتشبع Saturation</b> (الشكل ٦-٤). والمنحنى الذي يبين تغير \\(B\\) مع \\(H\\) يسمى <b>منحنى المغنطة</b> (الشكل ٦-٥أ). ويبين الشكل (٦-٥ب) منحنيات المغنطة لبعض المواد المغناطيسية.</p>
   <p>نلاحظ من الشكل (٦-٥) أن ميل المنحنى يكون كبيراً في الجزء الأول، بمعنى أن \\(\\mu_r\\) تكون مرتفعة عندما تكون \\(B\\) منخفضة، وتقل \\(\\mu_r\\) مع ازدياد \\(B\\). وكلما زادت قيمة \\(\\mu_r\\) كانت المادة المغناطيسية أجود.</p>`},
  {fig:'(٦-٤)',ref:'ص 163',caption:'منحنى المغنطة B–H: عند النقطة C تبدأ المادة بالتشبع ويصبح المنحنى شبه أفقي.',draw:()=>box(fig64(),520)},
  {fig:'(٦-٥أ)',ref:'ص 164',caption:'ميل المنحنى (μ): صغير جداً عند البداية، كبير في الجزء الأوسط، ويقل عند التشبع.',draw:()=>box(fig65a(),520)},
  {note:'<b>توضيح للمتدرب (ليس من الكتاب):</b> عبارة «ميل المنحنى يكون كبيراً في الجزء الأول» تعني الجزء الحاد الصاعد بعد البداية مباشرة؛ فالشكل (٦-٥أ) نفسه يبين أن الميل صغير جداً عند نقطة البداية (μ is low) ثم كبير (μ is high) ثم يقل عند التشبع.'},
  {fig:'(٦-٥ب)',ref:'ص 164',caption:'منحنيات المغنطة لبعض المواد المغناطيسية (المحور الأفقي لوغاريتمي من 1 إلى 10 000 A/m). القيم مقروءة تقريبياً من الرسم.',draw:()=>box(fig65b(),600)},
  {h:'مقارنة بين الدوائر المغناطيسية والدوائر الكهربائية',ref:'ص 165',html:`<div class="mg-tbl"><table class="tt"><caption style="caption-side:top;font-weight:700;margin-bottom:6px">جدول (٦-١): مقارنة بين الدائرة الكهربائية والدائرة المغناطيسية</caption><thead><tr><th>م</th><th>الدائرة الكهربائية</th><th>الدائرة المغناطيسية</th></tr></thead><tbody>
   <tr><td>1</td><td>مصدر الجهد الكهربائي: المولد أو البطارية.</td><td>مصدر الجهد المغناطيسي: ملف حامل للتيار ذو قلب حديدي.</td></tr>
   <tr><td>2</td><td>الجهد الكهربائي V بالفولت هو المسبب للتيار I بالأمبير.</td><td>القوة الدافعة المغناطيسية ℑ بالأمبير-لفة هي المسبب للتدفق (الفيض) المغناطيسي Φ.</td></tr>
   <tr><td>3</td><td>تتدفق الإلكترونات في الدائرة الكهربائية.</td><td>لا يسري أو يتدفق شيء في الدائرة المغناطيسية؛ فالمجال المغناطيسي ساكن.</td></tr>
   <tr><td>4</td><td>تقاس شدة التيار I بالأمبير.</td><td>تقاس قيمة التدفق Φ بالويبر أو بالفولت·ثانية.</td></tr>
   <tr><td>5</td><td>كثافة التيار J هي قيمة التيار لكل مليمتر مربع من مقطع الموصل: \\(J=I/A\\).</td><td>كثافة التدفق B هي قيمة التدفق لكل متر مربع من المقطع الفولاذي، بالتسلا أو فولت·ثانية/متر مربع.</td></tr>
   <tr><td>6</td><td>قانون أوم: \\(V=RI\\) volt</td><td>قانون أوم: \\(\\Im=\\Re_m\\Phi\\) AT</td></tr>
   <tr><td>7</td><td>المقاومة الكهربائية: \\(R=\\rho L/A\\)؛ L طول الموصل، ρ المقاومة النوعية، A مساحة المقطع. تزداد R كلما زاد الطول ونقصت مساحة المقطع.</td><td>المقاومة المغناطيسية (Reluctance): \\(\\Re_m=L/(\\mu A)\\)؛ L طول الدائرة، μ النفاذية، A مساحة مقطع الفولاذ أو الهواء. تزداد \\(\\Re_m\\) كلما زاد الطول ونقصت النفاذية ونقصت مساحة المقطع.</td></tr>
   <tr><td>8</td><td>الهبوط في الجهد بين نقطتين a و b: \\(V_{ab}=I\\times R_{ab}\\)</td><td>الهبوط في القوة الدافعة المغناطيسية بين a و b: \\(\\Im_{ab}=\\phi\\times\\Re_{ab}\\)</td></tr></tbody></table></div>`},
  {err:`<ol style="margin:4px 0 0;padding-inline-start:20px"><li>الهدف العام للوحدة السادسة (ص 158) منقول حرفياً من الوحدة الخامسة.</li>
   <li>ص 159: سُمّيت F في المعادلة (6-1) «القوة الدافعة المغناطيسية»، والمقصود القوة المغناطيسية (الميكانيكية) على الموصل بالنيوتن؛ و«باتسلا» = بالتسلا. صُحح في النص.</li>
   <li>(6-7) ص 160: طُبعت «\\(H_C\\times I_C=N\\times I\\)» والصحيح \\(H_C\\times\\ell_C=N\\times I\\) حيث \\(\\ell_C\\) طول المسار المتوسط للقلب.</li>
   <li>جدول (٦-١): الترقيم يقفز من 5 إلى 7 (أعدنا الترقيم 1–8)، وصياغة البند 2 مضطربة («وصلية التدفق … هو المسبب») وأعيدت بمعناها، وقانون أوم مطبوع بترتيب مضطرب «= ℜm Φ ℑ».</li>
   <li>الرمز λ لمعامل التسرب مستعمل في مثال (٦-٦) دون تعريف — انظر الإضافة أعلاه.</li></ol>`}
 ],
 lab:(el)=>{
  let N=6000,ImA=20,lc=15,Ac=0.8,mur=800,lg=0.75,lam=1,mode='lin',mat='ms',Hs=1000,mat2='ms',did={};
  el.innerHTML=`<div class="grid mg-lab">
   <div class="panel c12"><h2>قانون أوم المغناطيسي مع ثغرة هوائية <small>الأشكال (٦-١) إلى (٦-٣) والمعادلات (6-3) إلى (6-9)؛ القيم الأولى من تمرين 1 ص 181</small></h2>
    <div class="grid"><div class="c7"><div class="svgbox" id="g1a" style="max-width:440px;margin:auto"></div><div class="svgbox" id="g1an"></div>
      <div class="sub" style="margin-top:6px">توزيع الأمبير-لفة NI بين الحديد والثغرة (Hℓ لكل جزء):</div><div class="mg-bar" id="g1bar"></div></div>
     <div class="c5">${sl('g1N','عدد اللفات N',100,10000,100,N)}${sl('g1I','التيار I',1,1000,1,ImA)}${sl('g1l','طول المسار المتوسط في الحديد ℓc',5,100,1,lc)}${sl('g1A','مساحة المقطع A',0.1,50,0.1,Ac)}
      <div class="sub" style="margin-top:8px">الحديد</div>${segHTML('md',[['lin','نفاذية ثابتة μᵣ'],['bh','من منحنى B–H']],mode)}
      <div id="g1linw">${sl('g1m','النفاذية النسبية μᵣ',50,10000,50,mur)}</div><div id="g1bhw" style="margin-top:6px">${segHTML('mat',Object.keys(BH).map(k=>[k,BH[k].n.split(' ').slice(0,2).join(' ')]),mat)}</div>
      ${sl('g1g','طول الثغرة الهوائية ℓg',0,5,0.05,lg)}${sl('g1lam','معامل التسرب λ',1,1.3,0.01,lam)}
      <div class="mg-row"><button class="btn" id="g1ex">قيم تمرين 1</button></div>
      <div class="facts">${fact('ℑ = NI','v1')}${fact('ℜ الحديد','v2')}${fact('ℜ الثغرة','v3')}${fact('φ = ℑ/ℜ (6-9)','v4')}${fact('B = φ/A','v5')}${fact('μᵣ الفعلية للحديد','v6')}${fact('الفيض الكلي = λφ','v7')}</div><p class="sub" id="g1n"></p></div></div></div>
   <div class="panel c12"><h2>منحنى المغنطة والتشبع <small>الشكلان (٦-٤) و(٦-٥) ص 163–164؛ المنحنيات من الشكل (3) ص 182 مقروءة تقريبياً</small></h2>
    <div class="grid"><div class="c7"><div class="svgbox" id="g1bh"></div><div class="svgbox" id="g1mu"></div></div>
     <div class="c5">${segHTML('mat2',Object.keys(BH).map(k=>[k,BH[k].n.split(' ').slice(0,2).join(' ')]),mat2)}${sl('g1H','شدة المجال H',0,10000,10,Hs)}
      <div class="facts">${fact('B من المنحنى','w1')}${fact('μᵣ = B/(μ₀H)','w2')}${fact('الميل الآن dB/dH ÷ μ₀','w3')}</div><div class="mg-row"><span class="mg-chip" id="w4"></span></div></div></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="g1st"></ol></div></div>`;
  const $=s=>el.querySelector(s);
  const solve=()=>{const F=N*ImA/1000,A=Ac*1e-4,l=lc/100,g=lg/1000;let Bv,Hc;
   if(mode==='lin'){const Rc=l/(MU0*mur*A),Rg=g/(MU0*A);Bv=F/(Rc+Rg)/A;Hc=Bv/(MU0*mur)}
   else{let lo=0,hi=3;for(let k=0;k<60;k++){const m=(lo+hi)/2;const need=HofB(mat,m)*l+m*g/MU0;if(need>F)hi=m;else lo=m}Bv=lo;Hc=HofB(mat,Bv)}
   const Hg=Bv/MU0;return {F,A,l,g,Bv,Hc,Hg,phi:Bv*A,Rc:Hc*l/Math.max(Bv*A,1e-30),Rg:g/(MU0*A),mr:Bv/(MU0*Math.max(Hc,1e-12))}};
  const drawA=()=>{const r=solve();$('#g1linw').style.display=mode==='lin'?'':'none';$('#g1bhw').style.display=mode==='bh'?'':'none';
   ['g1N','g1I','g1l','g1A','g1m','g1g','g1lam'].forEach((k,i)=>{$('#'+k+'-v').textContent=[N,ImA+' mA',lc+' cm',fm(Ac,1)+' cm²',mur,fm(lg,2)+' mm',fm(lam,2)][i]});
   const gp=clamp(lg*8,0,40);$('#g1a').innerHTML=coreSVG({g:gp,leak:lam>1.001,fringe:gp>0,on:true,fw:clamp(1+r.Bv*4,1,8),solid:true,extra:gp>0?S.t(345,155,'ℓg','m','start'):''});
   $('#g1an').innerHTML=analogySVG({vals:{E:'',F:fm(sig(r.F,4))+' AT',Rm:sci(r.Rc+r.Rg,3)+' AT/Wb',Phi:sci(r.phi,3)+' Wb'}});
   const a=r.Hc*r.l,b=r.Hg*r.g,tot=Math.max(a+b,1e-12);$('#g1bar').innerHTML=`<i style="width:${fx(a/tot*100)}%;background:var(--muted)">${a/tot>0.12?'الحديد '+fm(sig(a,3))+' AT':''}</i><i style="width:${fx(b/tot*100)}%;background:var(--blue)">${b/tot>0.12?'الثغرة '+fm(sig(b,3))+' AT':''}</i>`;
   $('#v1').textContent=fm(sig(r.F,4))+' AT';$('#v2').textContent=sci(r.Rc,3)+' AT/Wb';$('#v3').textContent=sci(r.Rg,3)+' AT/Wb';$('#v4').textContent=sci(r.phi,3)+' Wb';$('#v5').textContent=fm(sig(r.Bv,3))+' T';$('#v6').textContent=fm(sig(r.mr,3));$('#v7').textContent=sci(r.phi*lam,3)+' Wb';
   $('#g1n').textContent=(mode==='bh'&&r.Bv>0.85*BH[mat].p[BH[mat].p.length-1][1]?'الحديد قرب التشبع: زيادة التيار لا تزيد الفيض إلا قليلاً. ':'')+(lam>1.001?`الملف يجب أن ينتج فيضاً كلياً أكبر بـ ${fm(Math.round((lam-1)*100))} % لأن جزءاً يتسرب (λ). `:'')+(lg>0?'':'بلا ثغرة: كل الأمبير-لفة للحديد.');
   S1.r=r};const S1={};
  const drawB=()=>{const pts=[];for(let k=0;k<=200;k++){const H=k*50;pts.push([H,BofH(mat2,H)])};const b=BofH(mat2,Hs),mr=Hs>0?b/(MU0*Hs):0,sl=(BofH(mat2,Hs+25)-BofH(mat2,Math.max(0,Hs-25)))/(Hs>=25?50:Hs+25)/MU0;
   const others=Object.keys(BH).filter(k=>k!==mat2).map(k=>({pts:BH[k].p.map(p=>[p[0],p[1]]),col:'--line',w:1.4}));
   $('#g1bh').innerHTML=bhAxes({series:others.concat([{pts,col:'--blue',w:2.6}]),extra:(X,Y)=>`<path d="M${fx(X(Hs))} ${fx(Y(0))}V${fx(Y(b))}H${fx(X(0))}" stroke="var(--stop)" stroke-dasharray="4 3" fill="none"/><circle cx="${fx(X(Hs))}" cy="${fx(Y(b))}" r="6" fill="var(--stop)"/>`});
   const mp=[];for(let k=1;k<=200;k++){const H=k*50;mp.push([H,BofH(mat2,H)/(MU0*H)])}const ym=nice(Math.max(...mp.map(p=>p[1])));
   $('#g1mu').innerHTML=plotSVG({w:560,h:180,x0:0,x1:10000,y0:0,y1:ym,xt:[0,2000,4000,6000,8000,10000],yt:[0,ym/2,ym],left:56,xl:'H (A/m)',yl:'μr',series:[{pts:mp,col:'--live',w:2}],extra:(X,Y)=>Hs>0?`<circle cx="${fx(X(Hs))}" cy="${fx(Y(mr))}" r="5" fill="var(--stop)"/>`:'',aria:'النفاذية النسبية مع H'});
   $('#g1H-v').textContent=Hs+' A/m';$('#w1').textContent=fm(sig(b,3))+' T';$('#w2').textContent=Hs>0?fm(Math.round(mr)):'—';$('#w3').textContent=fm(Math.round(sl));
   const bm=BH[mat2].p[BH[mat2].p.length-1][1],ch=$('#w4');if(b<0.12*bm){ch.className='mg-chip ld';ch.textContent='بداية المنحنى: الميل صغير (μ منخفضة)'}else if(b<0.8*bm){ch.className='mg-chip ok';ch.textContent='الجزء الحاد: μ عالية'}else{ch.className='mg-chip warn';ch.textContent='بعد الركبة: تشبع، μ تقل'}};
  [['g1N',v=>N=v],['g1I',v=>ImA=v],['g1l',v=>lc=v],['g1A',v=>Ac=v],['g1m',v=>mur=v],['g1g',v=>{lg=v;did.g=1}],['g1lam',v=>lam=v]].forEach(([k,f])=>$('#'+k).oninput=e=>{f(+e.target.value);drawA()});
  segBind(el,'md',v=>{mode=v;drawA()});segBind(el,'mat',v=>{mat=v;drawA()});segBind(el,'mat2',v=>{mat2=v;did['m'+v]=1;drawB()});$('#g1H').oninput=e=>{Hs=+e.target.value;drawB()};
  $('#g1ex').onclick=()=>{N=6000;ImA=20;lc=15;Ac=0.8;mur=800;lg=0.75;lam=1;mode='lin';segSet(el,'md','lin');[['g1N',N],['g1I',ImA],['g1l',lc],['g1A',Ac],['g1m',mur],['g1g',lg],['g1lam',lam]].forEach(([k,v])=>$('#'+k).value=v);did.ex=1;drawA()};
  const steps=stepsUI($('#g1st'),[
   {t:'تمرين 1',x:'اضغط «قيم تمرين 1»: 6000 لفة، 20 mA، حديد μᵣ = 800 طوله 15 cm، ثغرة 0.75 mm ⇐ <span class="ltr">B ≈ 0.161 T</span>. لاحظ في الشريط أن الثغرة الصغيرة تأخذ معظم الأمبير-لفة.',done:()=>did.ex&&mode==='lin'&&lg===0.75},
   {t:'أغلق الثغرة',x:'اجعل طول الثغرة صفراً: تقل الممانعة كثيراً ويقفز الفيض (الهواء نفاذيته أقل من الحديد بـ μᵣ مرة).',done:()=>did.ex&&lg===0},
   {t:'معامل التسرب',x:'ارفع λ إلى 1.2: الفيض المفيد كما هو، لكن الفيض الكلي الذي يجب أن ينتجه الملف أكبر بـ 20 %.',done:()=>lam>=1.2},
   {t:'منحنى B–H',x:'اختر «من منحنى B–H» ثم ارفع التيار حتى 1000 mA: الفيض لا يزيد بنسبة التيار عندما يقترب الحديد من التشبع.',done:()=>mode==='bh'&&ImA>=900},
   {t:'الركبة والتشبع',x:'في لوحة المنحنى حرّك H من الصفر إلى 10000 A/m: يتغير الوصف من «μ منخفضة» إلى «μ عالية» ثم «تشبع»، ومنحنى μᵣ يرتفع ثم يهبط.',done:()=>Hs>=9000},
   {t:'قارن المواد',x:'اختر «حديد مسبوك»: أضعف المواد في الشكل — يحتاج H أكبر بكثير لنفس B.',done:()=>mat2==='ci'}
  ]);
  drawA();drawB();loopOn(el,()=>steps.check());
 },
 quiz:[
  {q:'وحدة القوة الدافعة المغناطيسية:',o:['الفولت','الأمبير-لفة AT','الويبر','AT/Wb'],c:1,e:'(6-3): ℑ = NI.'},
  {q:'الممانعة المغناطيسية ℜ = ℓ/(μA). تزداد الممانعة عندما:',o:['تزيد مساحة المقطع','يزيد الطول وتقل النفاذية','تزيد النفاذية','يقل الطول'],c:1,e:'جدول (٦-١) ص 165.'},
  {q:'في التناظر بين الدائرتين يقابل التيار الكهربائي:',o:['الممانعة','الفيض المغناطيسي','القوة الدافعة المغناطيسية','النفاذية'],c:1,e:'الشكل (٦-٢): φ = ℑ/ℜ مقابل I = E/R.'},
  {q:'ملف 500 لفة يمر فيه 2 A على قلب ممانعته 2×10⁵ AT/Wb. الفيض:',o:['5×10⁻³ Wb','2×10⁸ Wb','1000 Wb','0.5 Wb'],c:0,e:'φ = 1000/(2×10⁵) = 5×10⁻³ Wb.'},
  {q:'أي مما يلي ليس من الفروق بين الدائرتين حسب الكتاب؟',o:['لا يوجد فقد ℜΦ² في الدائرة المغناطيسية','الفيض يمكن أن يتسرب','التقوس عند الثغرات','الدائرة المغناطيسية لها قانون أوم مماثل'],c:3,e:'التشابه في قانون أوم ليس فرقاً.'},
  {q:'معامل التسرب في الآلات الحديثة يتراوح بين:',o:['0.5 و 0.8','1.1 و 1.25','2 و 5','10 و 20'],c:1,e:'ص 163.'},
  {q:'عند التشبع فإن:',o:['μr تزداد كثيراً','زيادة H لا تزيد B إلا قليلاً','B تساوي صفراً','الممانعة تقل'],c:1,e:'ص 163: μr تبدأ في النقصان بعد قيمة معينة لـ B.'},
  {q:'لماذا تأخذ الثغرة الهوائية الصغيرة جزءاً كبيراً من الأمبير-لفة؟',o:['لأن طولها كبير','لأن نفاذية الهواء أقل من الحديد بآلاف المرات','لأن الفيض فيها أكبر','لأنها تسخن'],c:1,e:'ℜ = ℓ/(μA): μ الهواء = μ₀ فقط.'}
 ]
});

/* ======================================================================
   Lesson u6-l2 — قانونا كيرشوف للدوائر المغناطيسية (ص 166–172)
   ====================================================================== */
/* three-limb (shell) core. o:{coils:{L,C,R,BL}, flux:{L,C,R,TL,TR,BL}: [label, dir(rad), width], nodes:bool, gapC} */
function shellSVG(o){o=o||{};const W=o.W||460,H=o.H||300,x0=70,y0=40,w=320,h=220,t=36,cx=x0+w/2;
  let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${o.aria||'قلب بثلاث سيقان'}">`;
  s+=`<path d="M${x0} ${y0}H${x0+w}V${y0+h}H${x0}Z M${x0+t} ${y0+t}H${cx-t/2}V${y0+h-t}H${x0+t}Z M${cx+t/2} ${y0+t}H${x0+w-t}V${y0+h-t}H${cx+t/2}Z" fill="var(--surface-2)" fill-rule="evenodd" stroke="var(--fg)" stroke-width="1.6"/>`;
  if(o.gapC)s+=`<rect x="${cx-t/2-1}" y="${y0+h/2-5}" width="${t+2}" height="10" fill="var(--surface)" stroke="var(--fg)"/>`;
  const coil=(x,y,vert,lab,side)=>{let g='';for(let k=0;k<6;k++){if(vert){const yy=y-36+k*14;g+=`<ellipse cx="${x}" cy="${yy}" rx="${t/2+7}" ry="4.5" fill="none" stroke="var(--live)" stroke-width="2.2"/>`}else{const xx=x-36+k*14;g+=`<ellipse cx="${xx}" cy="${y}" rx="4.5" ry="${t/2+7}" fill="none" stroke="var(--live)" stroke-width="2.2"/>`}}
   return g+S.t(vert?x+(side||-1)*(t/2+12):x,vert?y+4:y+t/2+22,lab,'','middle',13).replace('text-anchor="middle"',`text-anchor="${vert?((side||-1)<0?'end':'start'):'middle'}"`)};
  const C=o.coils||{};if(C.L)s+=coil(x0+t/2,y0+h/2,true,C.L,-1);if(C.C)s+=coil(cx,y0+h/2+(o.gapC?40:0),true,C.C,1);if(C.R)s+=coil(x0+w-t/2,y0+h/2,true,C.R,1);if(C.BL)s+=coil((x0+cx)/2,y0+h-t/2,false,C.BL);
  const P={L:[x0+t/2,y0+h*0.3],C:[cx,y0+h*0.3],R:[x0+w-t/2,y0+h*0.3],TL:[(x0+cx)/2,y0+t/2],TR:[(cx+x0+w)/2,y0+t/2],BL:[(x0+cx)/2-50,y0+h-t/2],BR:[(cx+x0+w)/2,y0+h-t/2]};
  Object.entries(o.flux||{}).forEach(([k,f])=>{const [x,y]=P[k];const a=f[1],L=18+(f[2]||0);s+=arrow(x-Math.cos(a)*L/2,y-Math.sin(a)*L/2,x+Math.cos(a)*L/2,y+Math.sin(a)*L/2,f[3]||'--on',f[2]?clamp(1.5+f[2]/8,1.5,6):2.6)+S.t(x+(Math.abs(Math.cos(a))>0.5?0:16),y+(Math.abs(Math.cos(a))>0.5?-10:4),f[0],'b',Math.abs(Math.cos(a))>0.5?'middle':'start',13)});
  if(o.nodes){[['a',cx,y0+t/2],['b',x0+w-t/2,y0+t/2],['c',cx,y0+h-t/2],['d',x0+t/2,y0+h-t/2]].forEach(([n,x,y])=>{s+=`<circle cx="${x}" cy="${y}" r="4" fill="var(--fg)"/>`+S.t(x+8,y-6,n,'','start',14)});
    s+=`<path d="M${x0+t/2} ${y0+t/2}H${x0+w-t/2}V${y0+h-t/2}H${x0+t/2}Z M${cx} ${y0+t/2}V${y0+h-t/2}" fill="none" stroke="var(--muted)" stroke-dasharray="5 4"/>`}
  return s+(o.extra||'')+'</svg>'}
/* equivalent-circuit primitives */
const relH=(x1,x2,y,lab,val)=>`<rect x="${x1}" y="${y-9}" width="${x2-x1}" height="18" rx="2" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.4"/>`+S.t((x1+x2)/2,y-14,lab,'','middle',12)+(val?S.t((x1+x2)/2,y+26,val,'b','middle',11):'');
const relV=(x,y1,y2,lab,val,side)=>`<rect x="${x-9}" y="${y1}" width="18" height="${y2-y1}" rx="2" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.4"/>`+S.t(x+(side||1)*14,(y1+y2)/2+4,lab,'',(side||1)>0?'start':'end',12)+(val?S.t(x+(side||1)*14,(y1+y2)/2+18,val,'b',(side||1)>0?'start':'end',11):'');
const srcV=(x,y,lab,up,val,side)=>`<circle cx="${x}" cy="${y}" r="15" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/>`+S.t(x,y-3,up===false?'−':'+','','middle',11)+S.t(x,y+10,up===false?'+':'−','','middle',11)+S.t(x+(side||-1)*20,y+4,lab,'',(side||-1)<0?'end':'start',12)+(val?S.t(x+(side||-1)*20,y+18,val,'b',(side||-1)<0?'end':'start',11):'');
const srcH=(x,y,lab,val)=>`<circle cx="${x}" cy="${y}" r="15" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/>`+S.t(x-6,y+4,'+','','middle',11)+S.t(x+6,y+4,'−','','middle',11)+S.t(x,y-20,lab,'','middle',12)+(val?S.t(x,y+30,val,'b','middle',11):'');
/* fig 6-6 equivalent (one source, Rm1 top-left, Rm2 centre, Rm3 top-right) */
function eq66(o){o=o||{};const v=o.v||{};let s=`<svg viewBox="0 0 420 250" role="img" aria-label="الدائرة المكافئة">`;
  s+=`<path class="w" d="M50 40H370V210H50Z M210 40V210"/>`+srcV(50,125,'NI',true,v.F)+relH(90,170,40,'Rm1',v.R1)+relV(210,90,160,'Rm2',v.R2)+relH(250,330,40,'Rm3',v.R3);
  s+=arrow(100,62,150,62,'--on',2)+arrow(228,110,228,150,'--on',2)+arrow(262,62,312,62,'--on',2)+S.t(124,80,'φ1','b')+S.t(242,136,'φ2','b','start')+S.t(286,80,'φ3','b');
  if(o.loop)s+=`<rect x="64" y="54" width="132" height="142" rx="16" fill="none" stroke="var(--on)" stroke-width="2.4" stroke-dasharray="7 4"/>`+head(130,54,0,'--on',8);
  return s+'</svg>'}
function fig69eq(v){v=v||{};let s=`<svg viewBox="-50 0 560 260" role="img" aria-label="الدائرة المكافئة لتمرين ٦-٢">`;
  s+=`<path class="w" d="M50 50H410V220H50Z M230 50V220"/>`+srcV(50,140,'N1i1',true,v.s1)+relH(100,190,50,'Radc',v.R1)+srcV(410,140,'N3i3',true,v.s3,1)+relH(270,360,50,'Rabc',v.R3)+relV(230,80,140,'Rac',v.R2)+srcV(230,180,'N2i2',false,v.s2,1);
  s+=`<circle cx="230" cy="50" r="4" fill="var(--fg)"/>`+S.t(230,38,'a','','middle',14)+arrow(196,72,222,72,'--on',2)+arrow(264,72,238,72,'--on',2)+arrow(212,96,212,128,'--on',2)+S.t(200,90,'φ1','b','end')+S.t(262,90,'φ3','b','start')+S.t(204,116,'φ2','b','end');
  s+=`<path class="w" d="M230 220V236M222 236H238M225 241H235"/>`;
  return s+'</svg>'}
function fig610eq(v,mode){v=v||{};let s=`<svg viewBox="-50 0 560 250" role="img" aria-label="الدائرة المكافئة لتمرين ٦-٣">`;
  s+=`<path class="w" d="M50 40H410V210H50Z M230 40V210"/>`+srcV(50,125,'N1I1',true,v.s1)+relH(100,190,40,'ℜ1',v.R1)+relV(230,90,160,'ℜ2',v.R2)+relH(270,360,40,'ℜ3',v.R3)+srcV(410,125,'N3I3',true,v.s3,1)+srcH(140,210,'N2I2',v.s2);
  s+=`<path d="M150 125m-34 0a34 34 0 1 0 68 0a34 34 0 1 0 -68 0" fill="none" stroke="var(--on)" stroke-width="1.6" stroke-dasharray="5 4"/>`+head(184,125,PI/2,'--on',7)+S.t(150,130,'φ1','b','middle',13);
  s+=`<path d="M320 125m-34 0a34 34 0 1 0 68 0a34 34 0 1 0 -68 0" fill="none" stroke="var(--on)" stroke-width="1.6" stroke-dasharray="5 4"/>`+head(286,125,PI/2,'--on',7)+S.t(320,130,'φ3','b','middle',13);
  return s+'</svg>'}
function fig611(){let s=`<svg viewBox="0 0 460 280" role="img" aria-label="قلب مستطيل بثغرة هوائية">`;
  s+=coreSVG({W:460,H:280,x0:120,y0:40,w:240,h:190,t:40,g:10,flow:0}).replace(/^<svg[^>]*>/,'').replace('</svg>','');
  s+=`<path d="M120 22H360" stroke="var(--fg)"/>`+head(120,22,PI,'--fg',5)+head(360,22,0,'--fg',5)+S.t(240,16,'60 cm','','middle')+S.t(368,140,'0.2 cm','','start')+S.t(240,224,'4 cm','m','middle')+S.t(380,248,'5 cm','m','start');
  return s+'</svg>'}
function fig612(gx){gx=gx||22;let s=`<svg viewBox="0 0 520 260" role="img" aria-label="قلبان على شكل C متقابلان بثغرتين">`;
  const c1=`M60 40H${250-gx/2}V76H96V184H${250-gx/2}V220H60Z`,c2=`M${270+gx/2-20} 40H460V220H${270+gx/2-20}V184H424V76H${270+gx/2-20}Z`;
  s+=`<path d="${c1}" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.6"/><path d="${c2}" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.6"/>`;
  for(let k=0;k<6;k++){s+=`<ellipse cx="78" cy="${96+k*14}" rx="26" ry="4.5" fill="none" stroke="var(--live)" stroke-width="2.2"/><ellipse cx="442" cy="${96+k*14}" rx="26" ry="4.5" fill="none" stroke="var(--live)" stroke-width="2.2"/>`}
  s+=arrow(78,190,78,150,'--on',2.6)+S.t(64,170,'φ1','b','end')+arrow(442,190,442,150,'--on',2.6)+S.t(456,170,'φ2','b','start')+S.t(30,134,'N1','','middle',13)+S.t(490,134,'N2','','middle',13);
  s+=arrow(10,104,46,104,'--live',2)+S.t(14,96,'i1','','start')+arrow(510,104,474,104,'--live',2)+S.t(506,96,'i2','','end');
  s+=`<path d="M${250-gx/2} 244H${270+gx/2-20}" stroke="var(--fg)"/>`+S.t(260-10,256,'x','','middle',13);
  return s+'</svg>'}
function fig612eq(v){v=v||{};let s=`<svg viewBox="-50 0 560 240" role="img" aria-label="الدائرة المكافئة لتمرين ٦-٥">`;
  s+=`<path class="w" d="M50 40H410V200H50Z"/>`+srcV(50,120,'N1I1',true,v.s1)+relH(110,190,40,'ℜ1',v.R1)+relH(260,340,40,'ℜg(x)',v.Rg)+relV(410,70,120,'ℜ2',v.R2,1)+srcV(410,160,'N2I2',true,v.s2,1)+relH(200,280,200,'ℜg(x)',v.Rg);
  s+=arrow(150,62,200,62,'--on',2)+S.t(176,80,'φ1','b','middle');return s+'</svg>'}

B.lesson({
 id:'u6-l2',unit:6,order:2,pages:'166–172',
 title:'قانونا كيرشوف للدوائر المغناطيسية والدوائر المكافئة',
 summary:'القانون الأول: مجموع الفيض الداخل إلى نقطة تجميع يساوي مجموع الخارج منها. القانون الثاني: في أي مسار مغلق مجموع الأمبير-لفة يساوي مجموع Hℓ = Σφℜ. نرسم لكل قلب دائرته المكافئة ونكتب معادلاتها: مثال (٦-١) والتمارين المحلولة (٦-٢) إلى (٦-٥).',
 theory:[
  {h:'قانونا كيرشوف للدوائر المغناطيسية',ref:'ص 166',html:`<p>قانونا كيرشوف للدائرة الكهربائية اللذان عُرضا في الوحدة الثالثة يطبقان على الدوائر المغناطيسية (الشكل ٦-٦). <b>القانون الأول:</b> «مجموع التدفق المغناطيسي الداخل إلى نقطة تجميع يساوي مجموع التدفق المغناطيسي الخارج منها». في الشكل (٦-٦) التدفق \\(\\phi_1\\) تجزأ إلى جزأين \\(\\phi_2\\) و\\(\\phi_3\\):</p>
   $$\\phi_1=\\phi_2+\\phi_3\\qquad\\qquad \\sum_{k=1}\\phi_k=0 \\qquad (6\\text{-}10)$$`},
  {fig:'(٦-٦)',ref:'ص 166',caption:'قلب بثلاث سيقان وملف على الساق اليسرى، والدائرة المكافئة: مصدر NI و Rm1 للمسار الأيسر و Rm2 للساق الوسطى و Rm3 للمسار الأيمن.',draw:()=>`<div class="mg-figs"><figure>${box(shellSVG({coils:{L:'N I'},flux:{TL:['φ1',0],C:['φ2',PI/2],TR:['φ3',0]}}),420)}</figure><figure>${box(eq66(),380)}</figure></div>`},
  {h:'قانون كيرشوف للجهد',ref:'ص 166',html:`<p>في أي دائرة مغناطيسية مغلقة، القوة المغناطيسية تساوي مجموع حاصل ضرب شدة المجال \\(H\\) (AT/m) في طول الجزء المار فيه \\(\\ell\\):</p>
   $$\\sum m.m.f=\\sum H\\ell=\\sum NI=\\sum\\phi\\Re \\qquad (6\\text{-}11)$$ $$N\\times I=\\Re_{m1}\\phi_1+\\Re_{m2}\\phi_2+\\Re_{m3}\\phi_3$$`},
  {note:'<b>توضيح للمتدرب (ليس من الكتاب):</b> القانون الثاني يطبق على <b>مسار مغلق واحد</b> في كل مرة، كالحلقة الخضراء في الشكل (٦-٧). في الشكل (٦-٦) الفيضان \\(\\phi_2\\) و\\(\\phi_3\\) يمران في فرعين متوازيين، فالحلقة اليسرى تعطي \\(NI=\\Re_{m1}\\phi_1+\\Re_{m2}\\phi_2\\)، والحلقة الخارجية تعطي \\(NI=\\Re_{m1}\\phi_1+\\Re_{m3}\\phi_3\\)، والحلقة اليمنى تعطي \\(\\Re_{m2}\\phi_2=\\Re_{m3}\\phi_3\\). جرّب ذلك في المختبر.'},
  {fig:'(٦-٧)',ref:'ص 167',caption:'نفس القلب، والحلقة الخضراء على الدائرة المكافئة تبين مسار تطبيق قانون كيرشوف للجهد على الحلقة اليسرى.',draw:()=>box(eq66({loop:true}),380)},
  {h:'مثال (٦-١)',ref:'ص 167–168',html:`<p>لتكن الدائرة المبينة في الشكل (٦-٨) [مطابقة للشكل (٦-٣)]: ارسم الدائرة المغناطيسية المكافئة واكتب قانون كيرشوف للجهد (KVL) وقانون كيرشوف للتيار (KCL) لهذه الدائرة.</p>
   <div class="mg-figs"><figure>${box(coreSVG({g:16,leak:true,fringe:true,extra:S.t(345,155,'Air gap','m','start')+S.t(220,240,'F = NI','','middle',13)}),360)}<figcaption><b>الشكل (٦-٨)</b> ص 167</figcaption></figure>
   <figure>${box(`<svg viewBox="0 0 300 230" role="img" aria-label="الدائرة المكافئة لمثال ٦-١"><path class="w" d="M60 30H240V200H60Z"/>${srcV(60,115,'F',true)}${relV(240,50,105,'Rc')}${relV(240,125,180,'Rg')}${arrow(120,30,170,30,'--on',2.4)}${S.t(146,20,'φ','b','middle',14)}</svg>`,260)}<figcaption>الدائرة المكافئة — ص 168</figcaption></figure></div>
   <p><b>الحل:</b> بتطبيق قانون كيرشوف للجهد:</p>
   $$\\Im=NI=H_C\\ell_C+H_g\\ell_g$$ $$H_C\\ell_C=\\frac{B_C}{\\mu_C}\\ell_C=\\frac{\\phi_C}{\\mu_CA_C}\\ell_C=\\phi_C\\Re_C\\qquad H_g\\ell_g=\\frac{B_g}{\\mu_g}\\ell_g=\\frac{\\phi_g}{\\mu_gA_g}\\ell_g=\\phi_g\\Re_g$$
   <p>وحيث إن الدائرة توالٍ فإن التدفق المغناطيسي ثابت (وهذا هو قانون التيار KCL هنا):</p> $$\\phi_C=\\phi_g=\\phi\\qquad\\qquad \\Im=(\\Re_C+\\Re_g)\\,\\phi$$`},
  {h:'تمرين (٦-٢) — محلول',ref:'ص 168–169',html:`<p>لتكن الدائرة في الشكل (٦-٩): 1- ارسم الدائرة المكافئة. 2- استنتج المقاومة المغناطيسية لكل من الساق الأيمن والأوسط وكذلك الساق الأيسر. 3- استنتج قانون كيرشوف في العقدة a.</p>
   <div class="mg-figs"><figure>${box(shellSVG({nodes:true,coils:{L:'N1 i1',C:'N2 i2',R:'N3 i3'},flux:{TL:['φ1',0],TR:['φ3',PI],C:['φ2',PI/2]}}),420)}<figcaption><b>الشكل (٦-٩)</b> ص 169</figcaption></figure><figure>${box(fig69eq(),420)}<figcaption>الدائرة المكافئة — ص 169</figcaption></figure></div>
   <p><b>الحل:</b></p> $$\\Re_{ac}=\\frac{\\ell_{ac}}{\\mu A},\\quad \\Re_{adc}=\\frac{\\ell_{adc}}{\\mu A},\\quad \\Re_{abc}=\\frac{\\ell_{abc}}{\\mu A}$$
   <p>بتطبيق كيرشوف عند العقدة a:</p> $$\\phi_1-\\phi_2+\\phi_3=0$$
   $$\\phi_1=\\frac{N_1i_1-\\Im_a}{\\Re_{adc}},\\quad \\phi_2=\\frac{\\Im_a+N_2i_2}{\\Re_{ac}},\\quad \\phi_3=\\frac{N_3i_3-\\Im_a}{\\Re_{abc}}$$
   $$\\frac{N_1i_1}{\\Re_{adc}}-\\frac{N_2i_2}{\\Re_{ac}}+\\frac{N_3i_3}{\\Re_{abc}}-\\Im_a\\left[\\frac1{\\Re_{adc}}+\\frac1{\\Re_{ac}}+\\frac1{\\Re_{abc}}\\right]=0$$
   $$\\Im_a=\\frac{\\dfrac{N_1i_1}{\\Re_{adc}}-\\dfrac{N_2i_2}{\\Re_{ac}}+\\dfrac{N_3i_3}{\\Re_{abc}}}{\\dfrac1{\\Re_{adc}}+\\dfrac1{\\Re_{ac}}+\\dfrac1{\\Re_{abc}}}$$
   <p class="sub">\\(\\Im_a\\) هو «الجهد المغناطيسي» للعقدة a بالنسبة للضلع السفلي المشترك (المرسوم بالأرضي) — مثل طريقة التحليل العقدي في الوحدة الرابعة.</p>`},
  {h:'تمرين (٦-٣) — محلول',ref:'ص 170',html:`<p>لتكن الدائرة المغناطيسية في الشكل (٦-١٠): 1- ارسم الدائرة المكافئة. 2- استنتج قوانين كيرشوف في كل من الحلقتين.</p>
   <div class="mg-figs"><figure>${box(shellSVG({coils:{L:'N1 i1',BL:'N2 i2',R:'N3 i3'},flux:{L:['φ1',-PI/2],BL:['φ2',PI],R:['φ3',PI/2]}}),420)}<figcaption><b>الشكل (٦-١٠)</b> ص 170</figcaption></figure><figure>${box(fig610eq(),420)}<figcaption>الدائرة المكافئة — ص 170</figcaption></figure></div>
   <p><b>الحل:</b> الفيض في الساق السفلى اليسرى هو نفسه فيض الساق اليسرى (فرع واحد)، والساق الوسطى يمر فيها الفرق بين فيضي الحلقتين:</p>
   $$\\phi_1=\\phi_2$$ $$N_1I_1+N_2I_2=\\Re_1\\phi_1+\\Re_2(\\phi_1-\\phi_3)$$ $$N_3I_3=\\Re_3\\phi_3+\\Re_2(\\phi_3-\\phi_1)$$`},
  {err:'في المعادلة الثانية من حل تمرين (٦-٣) طُبع \\(\\Re_2(\\phi_1-\\phi_2)\\)، وهذا الحد يساوي صفراً لأن \\(\\phi_1=\\phi_2\\)؛ والصحيح \\(\\Re_2(\\phi_1-\\phi_3)\\) ليتسق مع المعادلة الثالثة (الساق الوسطى يمر فيها الفرق بين فيضي الحلقتين). في المختبر وفي الحاسبة مفتاح «كما في الكتاب / المصحح» يبين أثر هذا الخطأ على الأرقام.'},
  {h:'تمرين (٦-٤) — محلول',ref:'ص 171',html:`<p>قلب حلقي من الصلب المعتدل مساحة مقطعه \\(5\\ \\text{cm}^2\\) وطول محيط الحلقة 40 cm ملفوف عليها ملف 200 لفة. احسب قيمة التيار المار في الملف لتوليد فيض مغناطيسي في الحلقة \\(800\\ \\mu\\text{Wb}\\)، وكانت شدة المجال في الحلقة 3500 AT/m من الشكل (٦-١١).</p>
   <figure class="fig" style="margin:8px 0">${box(fig611(),420)}<figcaption><b>الشكل (٦-١١)</b> ص 171 — كما طُبع (قلب مستطيل بثغرة هوائية، لا يطابق نص التمرين)</figcaption></figure>
   $$B=\\frac{\\phi}{A}=\\frac{800\\times10^{-6}}{5\\times10^{-4}}=1.6\\ \\text{Wb/m}^2\\qquad m.m.f=H\\ell=3500\\times0.4=1400\\ \\text{AT}\\qquad I=\\frac{m.m.f}{N}=\\frac{1400}{200}=7\\ \\text{A}$$`},
  {note:'<b>توضيح للمتدرب (ليس من الكتاب):</b> في تمرين (٦-٤) أُعطيت H مباشرة (من منحنى B–H للصلب عند B = 1.6 T)، لذلك لا نحتاج حساب B في إيجاد التيار؛ قيمة B تخبرنا فقط من أي نقطة على المنحنى قُرئت H.'},
  {h:'تمرين (٦-٥) — محلول',ref:'ص 171–172',html:`<p>لتكن دائرة مغناطيسية في الشكل (٦-١٢): 1- ارسم الدائرة المكافئة. 2- استنتج قانون كيرشوف.</p>
   <div class="mg-figs"><figure>${box(fig612(),460)}<figcaption><b>الشكل (٦-١٢)</b> ص 172</figcaption></figure><figure>${box(fig612eq(),420)}<figcaption>الدائرة المكافئة (مصححة) — ص 172</figcaption></figure></div>
   $$\\phi_1=\\phi_2$$ $$N_1I_1-N_2I_2=[\\Re_1+\\Re_2+2\\Re_g(x)]\\,\\phi_1$$ $$N_1I_1-N_2I_2=\\Re(x)\\,\\phi_1$$
   <p class="sub">الثغرتان على التوالي مع القلبين، والملفان متعاكسا الاتجاه بالنسبة للفيض، لذلك يطرح \\(N_2I_2\\). الممانعة الكلية تعتمد على طول الثغرة x.</p>`},
  {err:`<ol style="margin:4px 0 0;padding-inline-start:20px"><li>معادلة (6-11) ص 166: \\(N\\times I=\\Re_{m1}\\phi_1+\\Re_{m2}\\phi_2+\\Re_{m3}\\phi_3\\) تجمع الفروع الثلاثة في حلقة واحدة، بينما \\(\\phi_2\\) و\\(\\phi_3\\) في فرعين متوازيين — انظر التوضيح أعلاه.</li>
   <li>الشكل (٦-٧) غير مشار إليه في النص، وتسميات ممانعاته تختلف عن الشكل (٦-٦).</li>
   <li>مثال (٦-١): يطلب المثال KVL و KCL، والحل لم يكتب KCL صراحة سوى أن التدفق واحد في الدائرة المتوالية.</li>
   <li>تمرين (٦-٢): طُبعت \\(N_1\\ell_1\\) و\\(N_2\\ell_2\\) و\\(N_3\\ell_3\\) والمقصود \\(N_1i_1\\) و\\(N_2i_2\\) و\\(N_3i_3\\)؛ وطُبع \\(\\aleph_{adc}\\) مكان \\(\\Re_{adc}\\)؛ وفي الرسم رُمز للتدفقات بـ I1 و I2 و I3. صُححت في النص.</li>
   <li>تمرين (٦-٣): الخطأ في الحد \\(\\Re_2(\\phi_1-\\phi_2)\\) — انظر الملاحظة أعلاه.</li>
   <li>تمرين (٦-٤): الشكل (٦-١١) لا يطابق نص التمرين (قلب مستطيل بثغرة بدل القلب الحلقي)، وB = 1.6 Wb/m² محسوبة ولا تُستعمل.</li>
   <li>تمرين (٦-٥): في رسم الدائرة المكافئة مصدر N₂I₂ مكرر في الضلع السفلي (بقايا من رسم التمرين ٦-٣)، والمعادلة فيها N₂I₂ مرة واحدة؛ رسمناه مرة واحدة. والرمز مطبوع ℜs(x) في الرسم و ℜg(x) في المعادلة.</li></ol>`}
 ],
 lab:(el)=>{
  let md='node',F1=1000,F2=0,F3=0,R1=4,R2=2,R3=4,gap=false,bk='fixed',G1=1000,G2=0,G3=500,Q1=4,Q2=2,Q3=4,did={};
  el.innerHTML=`<div class="grid mg-lab">
   <div class="panel c12"><h2>قلب بثلاث سيقان: الفيض في كل ساق <small>الأشكال (٦-٦) و(٦-٩) و(٦-١٠) والمعادلتان (6-10) و(6-11) ص 166–170</small></h2>
    <div class="mg-row">${segHTML('md',[['node','طريقة العقدة a — تمرين (٦-٢)'],['mesh','طريقة الحلقتين — تمرين (٦-٣)']],md)}</div>
    <div class="grid" style="margin-top:4px"><div class="c7"><div class="svgbox" id="g2c" style="max-width:460px;margin:auto"></div><div class="svgbox" id="g2e" style="max-width:460px;margin:auto"></div></div>
     <div class="c5"><div id="g2n">${sl('g2f1','N₁i₁ (الساق اليسرى)',-2000,2000,50,F1)}${sl('g2f2','N₂i₂ (الساق الوسطى)',-2000,2000,50,F2)}${sl('g2f3','N₃i₃ (الساق اليمنى)',-2000,2000,50,F3)}
       ${sl('g2r1','ℜadc (المسار الأيسر) × 10⁵ AT/Wb',0.5,50,0.5,R1)}${sl('g2r2','ℜac (الساق الوسطى) × 10⁵',0.5,50,0.5,R2)}${sl('g2r3','ℜabc (المسار الأيمن) × 10⁵',0.5,50,0.5,R3)}<div class="mg-row"><button class="btn" id="g2gap">ثغرة في الساق الوسطى</button></div></div>
      <div id="g2m">${sl('g2q1','N₁I₁ (الساق اليسرى)',-2000,2000,50,G1)}${sl('g2q2','N₂I₂ (الضلع السفلي الأيسر)',-2000,2000,50,G2)}${sl('g2q3','N₃I₃ (الساق اليمنى)',-2000,2000,50,G3)}
       ${sl('g2s1','ℜ₁ × 10⁵ AT/Wb',0.5,50,0.5,Q1)}${sl('g2s2','ℜ₂ (الساق الوسطى) × 10⁵',0.5,50,0.5,Q2)}${sl('g2s3','ℜ₃ × 10⁵',0.5,50,0.5,Q3)}<div class="mg-row"><span class="sub">المعادلة الثانية:</span>${segHTML('bk',[['book','كما في الكتاب'],['fixed','المصحح']],bk)}</div></div>
      <div class="facts" id="g2f"></div><div id="g2k"></div></div></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="g2st"></ol></div></div>`;
  const $=s=>el.querySelector(s);const E5=1e5;
  const wb=x=>sci(x,3)+' Wb';
  const draw=()=>{$('#g2n').style.display=md==='node'?'':'none';$('#g2m').style.display=md==='mesh'?'':'none';
   ['g2f1','g2f2','g2f3','g2q1','g2q2','g2q3'].forEach(k=>$('#'+k+'-v').textContent=$('#'+k).value+' AT');['g2r1','g2r2','g2r3','g2s1','g2s2','g2s3'].forEach(k=>$('#'+k+'-v').textContent=fm(+$('#'+k).value)+' × 10⁵');
   let h='',k='';
   if(md==='node'){const r1=R1*E5,r2=(R2+(gap?20:0))*E5,r3=R3*E5;const Fa=(F1/r1-F2/r2+F3/r3)/(1/r1+1/r2+1/r3);const p1=(F1-Fa)/r1,p2=(Fa+F2)/r2,p3=(F3-Fa)/r3;const mx=Math.max(Math.abs(p1),Math.abs(p2),Math.abs(p3),1e-12);
    const fl=(lab,p,a)=>[lab+'',p>=0?a:a+PI,Math.abs(p)/mx*30,'--on'];
    $('#g2c').innerHTML=shellSVG({nodes:true,gapC:gap,coils:{L:F1?'N1i1':'',C:F2?'N2i2':'',R:F3?'N3i3':''},flux:{TL:fl('φ1',p1,0),TR:fl('φ3',p3,PI),C:fl('φ2',p2,PI/2)}});
    $('#g2e').innerHTML=fig69eq({s1:F1+' AT',s2:F2+' AT',s3:F3+' AT',R1:fm(R1)+'e5',R2:fm(R2+(gap?20:0))+'e5'+(gap?' +gap':''),R3:fm(R3)+'e5'});
    h=fact('ℑa (جهد العقدة a)','h0')+fact('φ1 (من اليسار نحو a)','h1')+fact('φ2 (نازل في الوسطى)','h2')+fact('φ3 (من اليمين نحو a)','h3');$('#g2f').innerHTML=h;$('#h0').textContent=fm(sig(Fa,4))+' AT';$('#h1').textContent=wb(p1);$('#h2').textContent=wb(p2);$('#h3').textContent=wb(p3);
    const L1=F1+F2,L1r=r1*p1+r2*p2,L2=F3+F2,L2r=r3*p3+r2*p2;
    k=`<div class="callout"><b>KCL عند a (6-10):</b> <span class="ltr">φ1 − φ2 + φ3 = ${sci(p1-p2+p3+0,2)}</span> ✓<br><b>KVL الحلقة اليسرى:</b> <span class="ltr">N1i1 + N2i2 = ${fm(sig(L1,4))} AT</span> و <span class="ltr">ℜadc·φ1 + ℜac·φ2 = ${fm(sig(L1r,4))} AT</span> ✓<br><b>KVL الحلقة اليمنى:</b> <span class="ltr">N3i3 + N2i2 = ${fm(sig(L2,4))}</span> و <span class="ltr">ℜabc·φ3 + ℜac·φ2 = ${fm(sig(L2r,4))}</span> ✓</div>`;
    S2.p=[p1,p2,p3]}
   else{const r1=Q1*E5,r2=Q2*E5,r3=Q3*E5,A1=G1+G2;let p1,p3;
    if(bk==='book'){p1=A1/r1;p3=(G3+r2*p1)/(r2+r3)}else{const det=(r1+r2)*(r2+r3)-r2*r2;p1=(A1*(r2+r3)+r2*G3)/det;p3=((r1+r2)*G3+r2*A1)/det}
    const pc=p1-p3,mx=Math.max(Math.abs(p1),Math.abs(p3),Math.abs(pc),1e-12);const fl=(lab,p,a)=>[lab,p>=0?a:a+PI,Math.abs(p)/mx*30,'--on'];
    $('#g2c').innerHTML=shellSVG({coils:{L:G1?'N1I1':'',BL:G2?'N2I2':'',R:G3?'N3I3':''},flux:{L:fl('φ1',p1,-PI/2),R:fl('φ3',p3,PI/2),C:fl('φ1−φ3',pc,PI/2),BL:fl('φ2',p1,PI)}});
    $('#g2e').innerHTML=fig610eq({s1:G1+' AT',s2:G2+' AT',s3:G3+' AT',R1:fm(Q1)+'e5',R2:fm(Q2)+'e5',R3:fm(Q3)+'e5'});
    h=fact('φ1 = φ2 (الحلقة اليسرى)','h1')+fact('φ3 (الحلقة اليمنى)','h3')+fact('فيض الساق الوسطى φ1 − φ3','h2');$('#g2f').innerHTML=h;$('#h1').textContent=wb(p1);$('#h3').textContent=wb(p3);$('#h2').textContent=wb(pc);
    const resL=A1-(r1*p1+r2*(p1-p3)),resR=G3-(r3*p3+r2*(p3-p1));const ok=Math.abs(resL)<1e-6*Math.max(1,Math.abs(A1))&&Math.abs(resR)<1e-6*Math.max(1,Math.abs(G3));
    k=`<div class="callout${bk==='book'?' err':''}"><b>${bk==='book'?'كما في الكتاب:':'المصحح:'}</b> ${bk==='book'?'المعادلة الثانية \\(N_1I_1+N_2I_2=\\Re_1\\phi_1+\\Re_2(\\phi_1-\\phi_2)\\) وحدّها الثاني صفر، فتعطي \\(\\phi_1=(N_1I_1+N_2I_2)/\\Re_1\\).':'\\(N_1I_1+N_2I_2=\\Re_1\\phi_1+\\Re_2(\\phi_1-\\phi_3)\\) و \\(N_3I_3=\\Re_3\\phi_3+\\Re_2(\\phi_3-\\phi_1)\\) تحلّان معاً.'}<br>
     تحقق من الحلقة اليسرى الحقيقية: <span class="ltr">N1I1 + N2I2 − [ℜ1φ1 + ℜ2(φ1−φ3)] = ${fm(sig(resL,4))} AT</span> ${ok?'✓ القانون متحقق':'✗ القانون غير متحقق — الأرقام خاطئة'}</div>`;B.math($('#g2k'))}
   $('#g2k').innerHTML=k;B.math($('#g2k'))};const S2={};
  ['g2f1','g2f2','g2f3','g2r1','g2r2','g2r3'].forEach((id,i)=>$('#'+id).oninput=e=>{const v=+e.target.value;[()=>F1=v,()=>F2=v,()=>F3=v,()=>R1=v,()=>R2=v,()=>R3=v][i]();if(i===1&&v)did.f2=1;draw()});
  ['g2q1','g2q2','g2q3','g2s1','g2s2','g2s3'].forEach((id,i)=>$('#'+id).oninput=e=>{const v=+e.target.value;[()=>G1=v,()=>G2=v,()=>G3=v,()=>Q1=v,()=>Q2=v,()=>Q3=v][i]();draw()});
  $('#g2gap').onclick=()=>{gap=!gap;$('#g2gap').textContent=gap?'أزل الثغرة':'ثغرة في الساق الوسطى';did.gap=1;draw()};
  segBind(el,'md',v=>{md=v;draw()});segBind(el,'bk',v=>{bk=v;did['bk'+v]=1;draw()});
  const steps=stepsUI($('#g2st'),[
   {t:'ملف واحد',x:'بملف الساق اليسرى فقط: الفيض φ1 يتفرع عند العقدة a إلى φ2 في الوسطى و φ3 في المسار الأيمن، و φ1 = φ2 + φ3 (KCL).',done:()=>md==='node'&&F1!==0&&F2===0&&F3===0},
   {t:'ثغرة في الساق الوسطى',x:'اضغط «ثغرة في الساق الوسطى»: تكبر ممانعتها فيتحول معظم الفيض إلى المسار الأيمن.',done:()=>did.gap&&gap},
   {t:'ملف ثانٍ',x:'أضف أمبير-لفة للساق الوسطى N₂i₂ (موجبة أو سالبة) وراقب تغير جهد العقدة ℑa، وتحقق أن KVL للحلقتين ما زال متحققاً.',done:()=>did.f2&&md==='node'},
   {t:'طريقة الحلقتين: المصحح',x:'اختر «طريقة الحلقتين — تمرين (٦-٣)» مع «المصحح»: الحلقتان تتحققان (✓) والساق الوسطى يمر فيها φ1 − φ3.',done:()=>md==='mesh'&&bk==='fixed'},
   {t:'كما في الكتاب',x:'اختر «كما في الكتاب»: تتغير الفيوض، والتحقق من الحلقة اليسرى يفشل (✗) — هذا أثر الخطأ \\(\\Re_2(\\phi_1-\\phi_2)\\).',done:()=>md==='mesh'&&bk==='book'}
  ]);
  draw();loopOn(el,()=>steps.check());
 },
 examples:[
  {title:'مثال (٦-١) بأرقام توضيحية',ref:'ص 167–168',q:'<p>حل الكتاب هذا المثال بالرموز فقط. هنا الحاسبة نفسها بأرقام توضيحية (ليست من الكتاب) لترى كيف تتوزع الأمبير-لفة على القلب والثغرة: \\(\\Im=(\\Re_C+\\Re_g)\\phi\\).</p>',
   given:[{id:'N',label:'عدد اللفات',sym:'N',unit:'',value:500},{id:'I',label:'التيار',sym:'I',unit:'A',value:2},{id:'lc',label:'طول القلب',sym:'\\ell_C',unit:'m',value:0.4},{id:'A',label:'مساحة المقطع (× 10⁻⁴)',sym:'A',unit:'m²',value:4},{id:'mr',label:'النفاذية النسبية',sym:'\\mu_r',unit:'',value:2000},{id:'lg',label:'طول الثغرة',sym:'\\ell_g',unit:'mm',value:1}],
   solve:g=>{const A=g.A*1e-4,Rc=g.lc/(MU0*g.mr*A),Rg=g.lg/1000/(MU0*A),F=g.N*g.I,p=F/(Rc+Rg);return [
    {t:'',f:`\\Im=NI=${g.N}\\times${g.I}`,v:F,unit:'AT'},{t:'',f:`\\Re_C=\\frac{\\ell_C}{\\mu_0\\mu_rA}=\\frac{${g.lc}}{4\\pi\\times10^{-7}\\times${g.mr}\\times${sx(A,3)}}`,v:sci(Rc,4),unit:'AT/Wb'},
    {t:'',f:`\\Re_g=\\frac{\\ell_g}{\\mu_0A}=\\frac{${g.lg}\\times10^{-3}}{4\\pi\\times10^{-7}\\times${sx(A,3)}}`,v:sci(Rg,4),unit:'AT/Wb'},
    {t:'التدفق واحد في الدائرة المتوالية:',f:`\\phi=\\frac{\\Im}{\\Re_C+\\Re_g}`,v:sci(p,4),unit:'Wb',final:true},{t:'الهبوط في القلب والثغرة:',f:`\\phi\\Re_C=${fm(sig(p*Rc,4))}\\ \\text{AT}\\qquad \\phi\\Re_g=${fm(sig(p*Rg,4))}\\ \\text{AT}`}]}},
  {title:'تمرين (٦-٢) بأرقام توضيحية',ref:'ص 168–169',q:'<p>الكتاب حل التمرين بالرموز. ضع قيماً (التوضيحية هنا ليست من الكتاب) لتحسب جهد العقدة a ثم الفيوض الثلاثة بمعادلات الحل.</p>',
   given:[{id:'F1',label:'N₁i₁',sym:'',unit:'AT',value:1000},{id:'F2',label:'N₂i₂',sym:'',unit:'AT',value:200},{id:'F3',label:'N₃i₃',sym:'',unit:'AT',value:500},{id:'R1',label:'ℜadc (× 10⁵)',sym:'',unit:'AT/Wb',value:4},{id:'R2',label:'ℜac (× 10⁵)',sym:'',unit:'AT/Wb',value:2},{id:'R3',label:'ℜabc (× 10⁵)',sym:'',unit:'AT/Wb',value:4}],
   solve:g=>{const r1=g.R1*1e5,r2=g.R2*1e5,r3=g.R3*1e5,Fa=(g.F1/r1-g.F2/r2+g.F3/r3)/(1/r1+1/r2+1/r3),p1=(g.F1-Fa)/r1,p2=(Fa+g.F2)/r2,p3=(g.F3-Fa)/r3;return [
    {t:'جهد العقدة a:',f:`\\Im_a=\\frac{\\frac{${g.F1}}{${g.R1}\\times10^5}-\\frac{${g.F2}}{${g.R2}\\times10^5}+\\frac{${g.F3}}{${g.R3}\\times10^5}}{\\frac1{${g.R1}\\times10^5}+\\frac1{${g.R2}\\times10^5}+\\frac1{${g.R3}\\times10^5}}`,v:sig(Fa,4),unit:'AT'},
    {t:'',f:`\\phi_1=\\frac{N_1i_1-\\Im_a}{\\Re_{adc}}`,v:sci(p1,4),unit:'Wb',final:true},{t:'',f:`\\phi_2=\\frac{\\Im_a+N_2i_2}{\\Re_{ac}}`,v:sci(p2,4),unit:'Wb',final:true},{t:'',f:`\\phi_3=\\frac{N_3i_3-\\Im_a}{\\Re_{abc}}`,v:sci(p3,4),unit:'Wb',final:true},
    {t:'تحقق KCL:',f:`\\phi_1-\\phi_2+\\phi_3=${sx(p1-p2+p3+1e-30,2)}\\approx0`}]}},
  {title:'تمرين (٦-٣) بأرقام توضيحية',ref:'ص 170',q:`<p>الكتاب حل التمرين بالرموز. هنا تُحل معادلتا الحلقتين بأرقام توضيحية (ليست من الكتاب): «كما في الكتاب» بالحد المطبوع \\(\\Re_2(\\phi_1-\\phi_2)=0\\)، و«المصحح» بالحد \\(\\Re_2(\\phi_1-\\phi_3)\\).</p>${bfSeg('e63')}`,
   given:[{id:'F1',label:'N₁I₁',sym:'',unit:'AT',value:1000},{id:'F2',label:'N₂I₂',sym:'',unit:'AT',value:0},{id:'F3',label:'N₃I₃',sym:'',unit:'AT',value:500},{id:'R1',label:'ℜ₁ (× 10⁵)',sym:'',unit:'AT/Wb',value:4},{id:'R2',label:'ℜ₂ (× 10⁵)',sym:'',unit:'AT/Wb',value:2},{id:'R3',label:'ℜ₃ (× 10⁵)',sym:'',unit:'AT/Wb',value:4}],
   solve:g=>{const bk=bfMode('e63')==='book';const r1=g.R1*1e5,r2=g.R2*1e5,r3=g.R3*1e5,A1=g.F1+g.F2;let p1,p3;
    if(bk){p1=A1/r1;p3=(g.F3+r2*p1)/(r2+r3)}else{const det=(r1+r2)*(r2+r3)-r2*r2;p1=(A1*(r2+r3)+r2*g.F3)/det;p3=((r1+r2)*g.F3+r2*A1)/det}
    const res=A1-(r1*p1+r2*(p1-p3));return [
    {t:bk?'<b>كما في الكتاب:</b> الحد الثاني صفر:':'<b>المصحح:</b> نحل المعادلتين معاً:',f:bk?`N_1I_1+N_2I_2=\\Re_1\\phi_1+\\Re_2(\\phi_1-\\phi_2)=\\Re_1\\phi_1`:`\\begin{cases}N_1I_1+N_2I_2=\\Re_1\\phi_1+\\Re_2(\\phi_1-\\phi_3)\\\\ N_3I_3=\\Re_3\\phi_3+\\Re_2(\\phi_3-\\phi_1)\\end{cases}`},
    {t:'',f:'\\phi_1=\\phi_2',v:sci(p1,4),unit:'Wb',final:true},{t:'',f:'\\phi_3',v:sci(p3,4),unit:'Wb',final:true},{t:'فيض الساق الوسطى:',f:'\\phi_1-\\phi_3',v:sci(p1-p3,4),unit:'Wb'},
    {t:'تحقق من الحلقة اليسرى (KVL الصحيح):',f:`N_1I_1+N_2I_2-[\\Re_1\\phi_1+\\Re_2(\\phi_1-\\phi_3)]=${fm(sig(Math.abs(res)<1e-6?0:res,4))}\\ \\text{AT}`,v:Math.abs(res)<1e-6?'✓ صفر':'✗ ليس صفراً'}]},
   note:'الحد \\(\\Re_2(\\phi_1-\\phi_2)\\) المطبوع يساوي صفراً لأن \\(\\phi_1=\\phi_2\\)، فتتجاهل المعادلة الساق الوسطى. اختر «المصحح».'},
  {title:'تمرين (٦-٤)',ref:'ص 171',q:'<p>قلب حلقي من الصلب المعتدل مساحة مقطعه 5 cm² وطول محيط الحلقة 40 cm ملفوف عليها ملف 200 لفة. احسب قيمة التيار المار في الملف لتوليد فيض في الحلقة 800 μWb، وكانت شدة المجال في الحلقة 3500 AT/m.</p>',
   given:[{id:'A',label:'مساحة المقطع',sym:'A',unit:'cm²',value:5},{id:'l',label:'طول المحيط',sym:'\\ell',unit:'cm',value:40},{id:'N',label:'عدد اللفات',sym:'N',unit:'',value:200},{id:'p',label:'الفيض',sym:'\\phi',unit:'μWb',value:800},{id:'H',label:'شدة المجال (من المنحنى)',sym:'H',unit:'AT/m',value:3500}],
   solve:g=>{const Bv=g.p*1e-6/(g.A*1e-4),F=g.H*g.l/100;return [{t:'كثافة الفيض في الحلقة:',f:`B=\\frac{\\phi}{A}=\\frac{${g.p}\\times10^{-6}}{${g.A}\\times10^{-4}}`,v:sig(Bv,4),unit:'Wb/m²'},
    {t:'',f:`m.m.f=H\\ell=${g.H}\\times${g.l/100}`,v:sig(F,4),unit:'AT'},{t:'',f:`I=\\frac{m.m.f}{N}=\\frac{${fm(sig(F,4))}}{${g.N}}`,v:sig(F/g.N,4),unit:'A',final:true}]}},
  {title:'تمرين (٦-٥) بأرقام توضيحية',ref:'ص 171–172',q:'<p>الكتاب حل التمرين بالرموز: \\(N_1I_1-N_2I_2=[\\Re_1+\\Re_2+2\\Re_g(x)]\\phi_1\\). هنا بأرقام توضيحية (ليست من الكتاب) ومساحة مقطع الثغرة A لنرى أثر طول الثغرة x.</p>',
   given:[{id:'F1',label:'N₁I₁',sym:'',unit:'AT',value:800},{id:'F2',label:'N₂I₂',sym:'',unit:'AT',value:300},{id:'R1',label:'ℜ₁ (× 10⁵)',sym:'',unit:'AT/Wb',value:1},{id:'R2',label:'ℜ₂ (× 10⁵)',sym:'',unit:'AT/Wb',value:1},{id:'x',label:'طول كل ثغرة x',sym:'x',unit:'mm',value:0.5},{id:'A',label:'مساحة الثغرة (× 10⁻⁴)',sym:'A',unit:'m²',value:4}],
   solve:g=>{const Rg=g.x/1000/(MU0*g.A*1e-4),R=g.R1*1e5+g.R2*1e5+2*Rg;return [{t:'ممانعة كل ثغرة:',f:`\\Re_g(x)=\\frac{x}{\\mu_0A}=\\frac{${g.x}\\times10^{-3}}{4\\pi\\times10^{-7}\\times${g.A}\\times10^{-4}}`,v:sci(Rg,4),unit:'AT/Wb'},
    {t:'',f:`\\Re(x)=\\Re_1+\\Re_2+2\\Re_g(x)`,v:sci(R,4),unit:'AT/Wb'},{t:'',f:`\\phi_1=\\frac{N_1I_1-N_2I_2}{\\Re(x)}=\\frac{${g.F1}-${g.F2}}{${sx(R,4)}}`,v:sci((g.F1-g.F2)/R,4),unit:'Wb',final:true}]}}
 ],
 quiz:[
  {q:'قانون كيرشوف الأول للدوائر المغناطيسية ينص على أن:',o:['مجموع الأمبير-لفة في مسار مغلق صفر','مجموع الفيض الداخل إلى نقطة تجميع يساوي مجموع الخارج منها','الفيض يتناسب مع الممانعة','الفيض ثابت في كل الدوائر'],c:1,e:'ص 166 والمعادلة (6-10).'},
  {q:'في مسار مغلق من دائرة مغناطيسية مجموع NI يساوي:',o:['مجموع φℜ (أي مجموع Hℓ)','مجموع B','صفر دائماً','مجموع μ'],c:0,e:'(6-11).'},
  {q:'فيض 6 mWb يدخل عقدة ويخرج منها فرعان أحدهما 2.5 mWb. الفرع الآخر:',o:['8.5 mWb','3.5 mWb','2.5 mWb','6 mWb'],c:1,e:'φ1 = φ2 + φ3.'},
  {q:'في دائرة متوالية (قلب وثغرة) فإن الفيض في القلب والثغرة:',o:['مختلف','متساوٍ','الثغرة صفر','القلب صفر'],c:1,e:'مثال (٦-١): φC = φg = φ.'},
  {q:'في تمرين (٦-٤) H = 3500 AT/m وطول المسار 0.4 m و 200 لفة. التيار:',o:['7 A','17.5 A','1400 A','3.5 A'],c:0,e:'1400/200 = 7 A.'},
  {q:'في قلب بثلاث سيقان (تمرين ٦-٣) الساق الوسطى يمر فيها:',o:['φ1 فقط','φ3 فقط','الفرق بين فيضي الحلقتين φ1 − φ3','مجموعهما دائماً'],c:2,e:'لهذا الحد الصحيح ℜ₂(φ1 − φ3).'},
  {q:'إضافة ثغرة هوائية في أحد فرعين متوازيين يجعل الفيض:',o:['يزيد في ذلك الفرع','يتحول أكثره إلى الفرع الآخر','يتساوى في الفرعين','ينعدم في الدائرة كلها'],c:1,e:'مثل التيار في المقاومات المتوازية: يفضل المسار ذا الممانعة الأقل.'}
 ]
});

/* ======================================================================
   Lesson u6-l3 — حسابات الدوائر المغناطيسية عددياً (ص 172–176)
   ====================================================================== */
const CAST=[[1,900],[1.1,1020],[1.2,1220]],IRON=[[1.2,590],[1.4,1200],[1.45,1650]];   // [B,H] tables of مثال (٦-٨)
/* table lookup with linear interpolation; ext=true when outside the table */
function tabH(tb,Bv){let ext=Bv<tb[0][0]||Bv>tb[tb.length-1][0];let k=1;while(k<tb.length-1&&Bv>tb[k][0])k++;const a=tb[k-1],b=tb[k];return {v:a[1]+(b[1]-a[1])*(Bv-a[0])/(b[0]-a[0]),ext}}
function tabB(tb,H){let ext=H<tb[0][1]||H>tb[tb.length-1][1];let k=1;while(k<tb.length-1&&H>tb[k][1])k++;const a=tb[k-1],b=tb[k];return {v:a[0]+(b[0]-a[0])*(H-a[1])/(b[1]-a[1]),ext}}
function fig613(){let s=`<svg viewBox="0 0 520 300" role="img" aria-label="دائرة مغناطيسية على شكل U ونير وثغرتين">`;
  const x0=80,x1=440,top=70,bot=250;
  s+=`<path d="M${x0} ${top+14}H${x0+45}V${bot-45}H${x1-45}V${top+14}H${x1}V${bot}H${x0}Z" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.6"/>`;
  s+=`<rect x="${x0}" y="${top-26}" width="${x1-x0}" height="34" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.6"/>`+S.t((x0+x1)/2,top-5,'D','','middle',15);
  s+=S.t(x0+22,top+120,'A','','middle',15)+S.t(x1-22,top+120,'C','','middle',15)+S.t((x0+x1)/2,bot-18,'B','','middle',15);
  for(let k=0;k<6;k++){s+=`<ellipse cx="${x0+22}" cy="${top+50+k*12}" rx="30" ry="4.5" fill="none" stroke="var(--live)" stroke-width="2"/><ellipse cx="${x1-22}" cy="${top+50+k*12}" rx="30" ry="4.5" fill="none" stroke="var(--live)" stroke-width="2"/>`}
  s+=S.t(x0+22,top+11,'1.5 mm','m','middle')+S.t(x1-22,top+11,'1.5 mm','m','middle');
  s+=`<path d="M${x0} 280H${x1}" stroke="var(--fg)"/>`+head(x0,280,PI,'--fg',5)+head(x1,280,0,'--fg',5)+S.t((x0+x1)/2,294,'320 mm','','middle');
  s+=`<path d="M${x1+24} ${top+14}V${bot}" stroke="var(--fg)"/>`+head(x1+24,top+14,-PI/2,'--fg',5)+head(x1+24,bot,PI/2,'--fg',5)+S.t(x1+30,(top+bot)/2,'180 mm','','start');
  s+=S.t(x0+22,bot+18,'40 mm','m','middle')+S.t(x0-8,top-8,'30 mm','m','end')+S.t((x0+x1)/2,bot+18,'40 mm','m','middle');
  return s+'</svg>'}
function fig614(o){o=o||{};const cx=170,cy=150,R=120,r=90;let s=`<svg viewBox="0 0 360 300" role="img" aria-label="حلقة من الحديد المسبوك بداخلها قضيب">`;
  s+=`<circle cx="${cx}" cy="${cy}" r="${(R+r)/2}" fill="none" stroke="var(--surface-2)" stroke-width="${R-r}"/><circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="var(--fg)" stroke-width="1.4"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--fg)" stroke-width="1.4"/>`;
  s+=`<rect x="${cx-7}" y="${cy-r}" width="14" height="${2*r}" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.4"/>`+S.t(cx+14,cy+4,'D','','start',15);
  for(let k=0;k<5;k++){const a=(150+k*15)*D;s+=`<path d="M${fx(cx+(r-6)*Math.cos(a))} ${fx(cy+(r-6)*Math.sin(a))}L${fx(cx+(R+6)*Math.cos(a))} ${fx(cy+(R+6)*Math.sin(a))}" stroke="var(--live)" stroke-width="3"/>`}
  s+=S.t(cx-R-10,cy-40,'A','','end',15)+S.t(cx+R+10,cy-40,'C','','start',15);
  const w=o.w||{};const pa=(R+r)/2;s+=head(cx-pa,cy+40,-PI/2,'--on',7+(w.A||0))+head(cx+pa*0.71,cy-pa*0.71,PI/4,'--on',7+(w.C||0))+head(cx,cy+30,PI/2,'--on',7+(w.D||0));
  s+=`<path d="M${cx} ${cy}L${cx+R} ${cy}" stroke="var(--muted)" stroke-dasharray="3 3"/>`+S.t(cx+R*0.5,cy+16,'12 cm','m','middle')+S.t(cx-14,cy-r*0.5,'18 cm','m','end');
  return s+'</svg>'}
function ringGapSVG(o){o=o||{};const cx=180,cy=140,R=110,t=26,gp=clamp(o.g||0,0,30);let s=`<svg viewBox="0 0 360 290" role="img" aria-label="حلقة حديدية بثغرة هوائية">`;
  const ga=gp/R/2;s+=`<path d="M${fx(cx+R*Math.cos(ga))} ${fx(cy+R*Math.sin(ga))}A${R} ${R} 0 1 1 ${fx(cx+R*Math.cos(-ga))} ${fx(cy+R*Math.sin(-ga))}" fill="none" stroke="var(--surface-2)" stroke-width="${t}"/>`;
  s+=`<path d="M${fx(cx+R*Math.cos(ga))} ${fx(cy+R*Math.sin(ga))}A${R} ${R} 0 1 1 ${fx(cx+R*Math.cos(-ga))} ${fx(cy+R*Math.sin(-ga))}" fill="none" stroke="var(--blue)" stroke-width="${clamp(1+(o.b||0)*6,1,10)}" opacity=".8"/>`;
  for(let k=0;k<8;k++){const a=(150+k*8)*D;s+=`<path d="M${fx(cx+(R-t/2-5)*Math.cos(a))} ${fx(cy+(R-t/2-5)*Math.sin(a))}L${fx(cx+(R+t/2+5)*Math.cos(a))} ${fx(cy+(R+t/2+5)*Math.sin(a))}" stroke="var(--live)" stroke-width="2.6"/>`}
  if(o.lam>1.001)s+=`<ellipse cx="${cx-R}" cy="${cy}" rx="40" ry="62" fill="none" stroke="var(--live)" stroke-dasharray="4 3"/>`;
  s+=S.t(cx+R+20,cy+4,'ℓg','m','start')+S.t(cx-R-48,cy+4,'N','','end',14);return s+'</svg>'}

B.lesson({
 id:'u6-l3',unit:6,order:3,pages:'172–176',
 title:'حسابات الدوائر المغناطيسية: ثغرات هوائية وتسرب وجداول B–H',
 summary:'خطوات حساب الأمبير-لفة اللازمة: لكل جزء B = Φ/A ثم H (من μ أو من جدول B–H) ثم Hℓ، ثم نجمع للأجزاء المتوالية، ونتذكر أن الأجزاء المتوازية عليها نفس الأمبير-لفة. الأمثلة (٦-٦) حلقة بثغرة وتسرب، (٦-٧) قلب U بنير وثغرتين، (٦-٨) حلقة بقضيب على التوازي.',
 theory:[
  {h:'طريقة الحساب',ref:'ص 172–176',html:`<p>في الأمثلة الثلاثة نطبق قانون كيرشوف للجهد (6-11): \\(NI=\\sum H\\ell\\). لكل جزء من الدائرة:</p>
   <ol><li>نحسب كثافة الفيض \\(B=\\Phi/A\\) (مع ضرب الفيض في معامل التسرب \\(\\lambda\\) للأجزاء الحديدية إذا وُجد تسرب).</li><li>نحسب شدة المجال: في الهواء \\(H_g=B_g/\\mu_0\\)، وفي الحديد \\(H=B/(\\mu_0\\mu_r)\\) أو من جدول/منحنى B–H.</li><li>نحسب الأمبير-لفة \\(AT=H\\,\\ell\\).</li><li>نجمع AT للأجزاء المتوالية؛ والأجزاء المتوازية عليها <b>نفس</b> الأمبير-لفة ويتجمع فيضها عند العقد.</li><li>التيار \\(I=AT/N\\).</li></ol>`},
  {h:'مثال (٦-٦)',ref:'ص 172–173',html:`<p>حلقة حديدية طول محيطها المتوسط 3 m ومساحة مقطعها \\(25\\ \\text{cm}^2\\) وبها قطع يمثل ثغرة هوائية طولها 1 مم. أحيط بالحلقة ملف به 350 لفة. فإذا كان معامل النفاذ النسبي لمادة الحلقة 800 وكان معامل التسرب المغناطيسي 1.2، فأوجد التيار الكهربائي اللازم إمراره في الملف للحصول على فيض قدره 0.3 mWb في الثغرة الهوائية.</p>
   <p><b>الحل كما طُبع:</b> في الثغرة: \\(B_g=0.3\\times10^{-3}/5\\times10^{-4}=0.6\\) Wb/m²، \\(H_g=B_g/\\mu_0=47.7\\times10^4\\) AT/m، \\(AT_g=477\\) AT. في الحلقة: \\(B_i=\\lambda\\Phi_g/A=1.2\\times0.6=0.72\\) Wb/m²، \\(H_i=B_i/(\\mu_0\\mu_r)=715\\) AT/m، \\(AT_i=715\\times3=2145\\) AT. الأمبير-لفة الكلي \\(477+2145=2622\\) AT، والتيار \\(I=2622/350=7.5\\) A.</p>`},
  {err:'مثال (٦-٦): المعطى \\(25\\ \\text{cm}^2=25\\times10^{-4}\\ \\text{m}^2\\) لكن الحل عوّض \\(5\\times10^{-4}\\ \\text{m}^2\\)، وحساباته الداخلية متسقة مع 5 cm² (فإما أن المعطى الصحيح 5 cm² أو أن التعويض خاطئ). بالمعطى 25 cm²: \\(B_g=0.12\\) T، \\(AT_g\\approx95.5\\)، \\(B_i=0.144\\) T، \\(AT_i\\approx429.7\\)، المجموع ≈ 525.2 AT و\\(I\\approx1.5\\) A. كذلك \\(H_i\\) بأرقام الكتاب 716.2 لا 715. في الحاسبة مفتاح «كما في الكتاب / المصحح».'},
  {h:'مثال (٦-٧)',ref:'ص 173–174',html:`<p>دائرة مغناطيسية أبعادها كما في الشكل (٦-١٣). مقطع الأجزاء A و B و C مربع بينما الجزء D مستطيل (40 × 30 mm). يمر بالدائرة فيض ناتج من ملفين على الجزأين A و C موصلين على التوالي ويحوي كل منهما 1500 لفة. إذا كانت معاملات النفاذ النسبي 900 للأجزاء A و B و C و750 للجزء D، فأوجد تيار المغنطة اللازم لإمرار فيض 1.6 mWb في الثغرة الهوائية.</p>`},
  {fig:'(٦-١٣)',ref:'ص 173',caption:'قلب على شكل U (الساقان A و C والقاعدة B، عرض كل منها 40 mm) فوقه نير D سمكه 30 mm تفصله عنه ثغرتان طول كل منهما 1.5 mm.',draw:()=>box(fig613(),500)},
  {html:`<p><b>الحل</b> <span class="ref">ص 174</span>: في الثغرتين \\(B_g=1.6\\times10^{-3}/(40\\times40\\times10^{-6})=1\\) Wb/m²، \\(H_g=1/\\mu_0=79.54\\times10^4\\) AT/m، \\(\\ell_g=2\\times1.5=3\\) mm، \\(AT_g=2386\\) AT. الأجزاء A و B و C: \\(B=1\\)، \\(H=1/(4\\pi\\times10^{-7}\\times900)=884\\) AT/m، \\(\\ell=160+280+160=600\\) mm، \\(AT=530\\). الجزء D: \\(B=1.6\\times10^{-3}/(30\\times40\\times10^{-6})=4/3\\) Wb/m²، \\(H=(4/3)/(4\\pi\\times10^{-7}\\times750)=1415\\) AT/m، \\(\\ell=320-2\\times20=280\\) mm، \\(AT=396\\). المجموع \\(2386+530+396=3312\\) AT، والملفان على التوالي (3000 لفة): \\(I=3312/3000\\).</p>`},
  {err:'مثال (٦-٧): طُبع \\(I=3312/3000=1.014\\) A والصحيح <b>1.104 A</b>. كذلك \\(H_g=1/\\mu_0\\) طُبعت \\(79.54\\times10^4\\) والدقيق \\(79.58\\times10^4\\) (فيكون \\(AT_g\\approx2387\\)). وفي سطر الأجزاء A و B و C سقط البسط «1» من \\(H=1/(4\\pi\\times10^{-7}\\times900)\\)، وفي الجزء D طُبعت «×» مكان القسمة؛ الناتجان 884 و1415 صحيحان. في الحاسبة مفتاح «كما في الكتاب / المصحح».'},
  {h:'مثال (٦-٨)',ref:'ص 174–176',html:`<p>حلقة مصنوعة من الحديد المسبوك بالشكل والأبعاد المبينة في الشكل (٦-١٤) ومقطعها مربع طول ضلعه 3 سم، ومثبت بداخلها قضيب حديدي طوله 18 cm ومقطعه 0.4 cm × 3 بدون ثغرات هوائية بينه وبين الحلقة. احسب الأمبير لفات اللازمة على الجزء A للحصول على مجال مغناطيسي كثافته 1 ويبر لكل متر مربع في الجزء C من الحلقة. الخواص المغناطيسية للمواد:</p>
   <div class="mg-figs"><div class="mg-tbl"><table class="tt"><caption style="caption-side:top;font-weight:700">الحديد المسبوك</caption><tr><th>B [T]</th><td>1</td><td>1.1</td><td>1.2</td></tr><tr><th>H [A/m]</th><td>900</td><td>1020</td><td>1220</td></tr></table></div>
   <div class="mg-tbl"><table class="tt"><caption style="caption-side:top;font-weight:700">الحديد</caption><tr><th>B [T]</th><td>1.2</td><td>1.4</td><td>1.45</td></tr><tr><th>H [A/m]</th><td>590</td><td>1200</td><td>1650</td></tr></table></div></div>`},
  {fig:'(٦-١٤)',ref:'ص 175',caption:'الحلقة: النصف الأيسر A وعليه الملف، والنصف الأيمن C، والقضيب D على القطر الرأسي (طوله 18 cm). نصف القطر الخارجي 12 cm.',draw:()=>box(fig614(),340)},
  {html:`<p><b>الحل:</b></p><ol><li><b>الجزء C:</b> من الجدول عندما \\(B=1\\) Wb/m² فإن \\(H_C=900\\) AT/m. طول المسار \\(L_C=\\pi(24-3)/2=66/2=33\\) cm، و\\(AT_C=900\\times0.33=297\\).</li>
   <li><b>الجزء D:</b> لأن D على التوازي مع C فإن نفس الأمبير لفات موجودة عليه: \\(AT_D=297=H_D\\ell_D\\) ⇐ \\(H_D=297/0.18=1650\\) AT/m، ومن جدول الحديد \\(B_D=1.45\\) Wb/m².<br>
   \\(\\Phi_C=B_CA_C=1\\times9\\times10^{-4}=9\\times10^{-4}\\) Wb، \\(\\Phi_D=B_DA_D=1.45\\times0.4\\times3\\times10^{-4}=1.74\\times10^{-4}\\) Wb.<br>
   \\(\\Phi_A=\\Phi_C+\\Phi_D=10.74\\times10^{-4}\\) Wb، \\(B_A=\\Phi_A/A_A=10.74\\times10^{-4}/(3\\times3\\times10^{-4})=1.193\\) Wb/m².<br>
   من الجدول وبالتقريب \\(H_A=1200\\) AT/m، و\\(AT_A=H_A\\ell_A=1200\\times0.33=396\\).</li></ol>
   <p>والأمبير لفات الكلية: \\(AT_t=396+297=693\\) AT.</p>`},
  {note:'<b>توضيح للمتدرب (ليس من الكتاب):</b> \\(B_A=1.193\\) تقع بين 1.1 (1020) و1.2 (1220) في جدول الحديد المسبوك؛ بالاستكمال الخطي \\(H_A\\approx1020+200\\times0.933\\approx1207\\) AT/m، والكتاب قرّبها إلى 1200 — الفرق صغير (AT الكلية ≈ 695 بدل 693). المختبر يحسب بالاستكمال الخطي ويريك أين تقع كل قيمة في الجدول.'},
  {err:`<ol style="margin:4px 0 0;padding-inline-start:20px"><li>مثال (٦-٦): «حيط بالحلقة» صُححت «أحيط»، والرمز λ غير معرّف (انظر الإضافة في الدرس 6.1)، وخطأ المساحة أعلاه.</li>
   <li>مثال (٦-٨) ص 175: سقط من نص السؤال اسما الجزأين (صُحح من الحل: الأمبير لفات على الجزء A للحصول على 1 Wb/m² في الجزء C)، و«Wb/m» صوابها Wb/m². الشكل يكتب 32 cm لطول كل نصف بينما الحل يحسبه 33 cm، ويسمي القضيب B في الرسم وD في الحل (استعملنا D).</li></ol>`}
 ],
 lab:(el)=>{
  let Pg=0.3,Acm=25,li=3,lg=1,mur=800,lam=1.2,N=350,Bc=1,did={};
  el.innerHTML=`<div class="grid mg-lab">
   <div class="panel c12"><h2>حلقة حديدية بثغرة هوائية وتسرب <small>مثال (٦-٦) ص 172–173</small></h2>
    <div class="grid"><div class="c5"><div class="svgbox" id="g3a" style="max-width:340px;margin:auto"></div><div class="sub">الأمبير-لفة الكلية مقسمة بين الثغرة والحديد:</div><div class="mg-bar" id="g3bar"></div></div>
     <div class="c7"><div class="mg-row"><button class="btn" data-p6="b">مثال (٦-٦) بالمساحة التي عوّضها الكتاب 5 cm²</button><button class="btn" data-p6="f">مثال (٦-٦) بالمعطى 25 cm²</button></div>
      ${sl('g3p','الفيض المطلوب في الثغرة Φg',0.05,1.5,0.05,Pg)}${sl('g3A','مساحة المقطع A',1,50,1,Acm)}${sl('g3g','طول الثغرة ℓg',0,5,0.1,lg)}${sl('g3l','طول المسار في الحديد ℓi',0.5,5,0.1,li)}${sl('g3m','النفاذية النسبية μᵣ',100,5000,50,mur)}${sl('g3lam','معامل التسرب λ',1,1.3,0.01,lam)}${sl('g3N','عدد اللفات N',50,2000,10,N)}
      <div class="facts">${fact('Bg = Φg/A','k1')}${fact('Hg = Bg/μ₀','k2')}${fact('ATg = Hg·ℓg','k3')}${fact('Bi = λΦg/A','k4')}${fact('Hi = Bi/(μ₀μᵣ)','k5')}${fact('ATi = Hi·ℓi','k6')}${fact('AT الكلي','k7')}${fact('I = AT/N','k8')}</div></div></div></div>
   <div class="panel c12"><h2>مساران على التوازي بجداول B–H <small>مثال (٦-٨) ص 174–176</small></h2>
    <div class="grid"><div class="c5"><div class="svgbox" id="g3r" style="max-width:340px;margin:auto"></div></div>
     <div class="c7">${sl('g3b','كثافة الفيض المطلوبة في الجزء C',0.9,1.25,0.01,Bc)}<div class="mg-tbl"><table class="tt" id="g3t"></table></div><p class="sub" id="g3w"></p>
      <div class="grid"><div class="c6"><div class="svgbox" id="g3p1"></div></div><div class="c6"><div class="svgbox" id="g3p2"></div></div></div></div></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="g3st"></ol></div></div>`;
  const $=s=>el.querySelector(s);
  const drawA=()=>{const A=Acm*1e-4,Bg=Pg*1e-3/A,Hg=Bg/MU0,ATg=Hg*lg/1000,Bi=lam*Pg*1e-3/A,Hi=Bi/(MU0*mur),ATi=Hi*li,T=ATg+ATi,I=T/N;
   $('#g3a').innerHTML=ringGapSVG({g:lg*6,b:Bi,lam});
   ['g3p','g3A','g3g','g3l','g3m','g3lam','g3N'].forEach((k,i)=>$('#'+k+'-v').textContent=[fm(Pg,2)+' mWb',Acm+' cm²',fm(lg,1)+' mm',fm(li,1)+' m',mur,fm(lam,2),N][i]);
   $('#k1').textContent=fm(sig(Bg,3))+' T';$('#k2').textContent=sci(Hg,3)+' AT/m';$('#k3').textContent=fm(sig(ATg,4))+' AT';$('#k4').textContent=fm(sig(Bi,3))+' T';$('#k5').textContent=fm(sig(Hi,4))+' AT/m';$('#k6').textContent=fm(sig(ATi,4))+' AT';$('#k7').textContent=fm(sig(T,4))+' AT';$('#k8').textContent=fm(sig(I,3))+' A';
   const t=Math.max(T,1e-9);$('#g3bar').innerHTML=`<i style="width:${fx(ATg/t*100)}%;background:var(--blue)">${ATg/t>0.15?'الثغرة '+fm(Math.round(ATg)):''}</i><i style="width:${fx(ATi/t*100)}%;background:var(--muted)">${ATi/t>0.15?'الحديد '+fm(Math.round(ATi)):''}</i>`;S3.I=I};const S3={};
  const drawB=()=>{const lc=0.33,lD=0.18,Ac=9e-4,AD=1.2e-4;const hc=tabH(CAST,Bc),ATc=hc.v*lc,HD=ATc/lD,bD=tabB(IRON,HD),pc=Bc*Ac,pD=bD.v*AD,pA=pc+pD,BA=pA/Ac,hA=tabH(CAST,BA),ATA=hA.v*lc,T=ATA+ATc;
   const r=(a,b,c)=>`<tr><td>${a}</td><td><span class="ltr">${b}</span></td><td><span class="ltr">${c}</span></td></tr>`;
   $('#g3t').innerHTML=`<tr><th>الجزء</th><th>B</th><th>H و AT</th></tr>`+r('C (من الجدول)',fm(Bc,2)+' T',`H = ${fm(Math.round(hc.v))} ⇐ AT = ${fm(Math.round(ATc))}`)+r('D (نفس AT لأنه موازٍ لـ C)',`B = ${fm(sig(bD.v,3))} T`,`H = ${fm(Math.round(HD))}`)+r('الفيوض',`ΦC = ${sci(pc,3)}`,`ΦD = ${sci(pD,3)} ⇐ ΦA = ${sci(pA,4)} Wb`)+r('A',`B = ${fm(sig(BA,4))} T`,`H = ${fm(Math.round(hA.v))} ⇐ AT = ${fm(Math.round(ATA))}`)+`<tr class="cur"><td>الكلي</td><td></td><td><b class="ltr">AT = ${fm(Math.round(T))}</b></td></tr>`;
   $('#g3w').textContent=(hc.ext||bD.ext||hA.ext)?'تنبيه: قيمة خارج الجدول — النتيجة باستكمال خارجي غير موثوق؛ الجداول في المثال تغطي B من 1 إلى 1.2 T للحديد المسبوك و1.2 إلى 1.45 T للحديد.':(Math.abs(Bc-1)<1e-9?'بقيم المثال: بالاستكمال الخطي HA ≈ 1207 و AT ≈ 695، والكتاب قرّب HA إلى 1200 فكانت AT = 693.':'');
   $('#g3b-v').textContent=fm(Bc,2)+' T';$('#g3r').innerHTML=fig614({w:{A:clamp(BA*3,0,6),C:clamp(Bc*3,0,6),D:clamp(bD.v*2,0,5)}});
   const tp=(tb,mk,lab,cid)=>plotSVG({w:300,h:200,x0:tb[0][1]-150,x1:tb[tb.length-1][1]+150,y0:tb[0][0]-0.1,y1:tb[tb.length-1][0]+0.1,xt:tb.map(p=>p[1]),yt:tb.map(p=>p[0]),left:40,xl:'H',yl:lab,series:[{pts:tb.map(p=>[p[1],p[0]]),col:'--blue',w:2}],extra:(X,Y)=>tb.map(p=>`<circle cx="${fx(X(p[1]))}" cy="${fx(Y(p[0]))}" r="3.5" fill="var(--blue)"/>`).join('')+mk.map(m=>`<circle cx="${fx(X(m[0]))}" cy="${fx(Y(m[1]))}" r="5.5" fill="none" stroke="var(--stop)" stroke-width="2.4"/>`+S.t(X(m[0])+8,Y(m[1])+14,m[2],'','start',12)).join(''),aria:lab});
   $('#g3p1').innerHTML=tp(CAST,[[hc.v,Bc,'C'],[hA.v,BA,'A']],'B (cast)');$('#g3p2').innerHTML=tp(IRON,[[HD,bD.v,'D']],'B (iron)');S3.T=T};
  [['g3p',v=>Pg=v],['g3A',v=>Acm=v],['g3g',v=>lg=v],['g3l',v=>li=v],['g3m',v=>mur=v],['g3lam',v=>lam=v],['g3N',v=>N=v]].forEach(([k,f])=>$('#'+k).oninput=e=>{f(+e.target.value);drawA()});
  el.querySelectorAll('[data-p6]').forEach(b=>b.onclick=()=>{Pg=0.3;Acm=b.dataset.p6==='b'?5:25;li=3;lg=1;mur=800;lam=1.2;N=350;[['g3p',Pg],['g3A',Acm],['g3g',lg],['g3l',li],['g3m',mur],['g3lam',lam],['g3N',N]].forEach(([k,v])=>$('#'+k).value=v);did['p'+b.dataset.p6]=1;drawA()});
  $('#g3b').oninput=e=>{Bc=+e.target.value;drawB()};
  const steps=stepsUI($('#g3st'),[
   {t:'كما عوّض الكتاب',x:'اضغط «… 5 cm²»: تحصل على أرقام الكتاب تقريباً: ATg = 477، ATi ≈ 2148، I ≈ 7.5 A.',done:()=>did.pb&&Acm===5},
   {t:'بالمعطى الصحيح',x:'اضغط «… 25 cm²»: الفيض نفسه في مساحة أكبر ⇐ B أصغر بخمس مرات ⇐ I ≈ 1.5 A.',done:()=>did.pf&&Acm===25},
   {t:'بلا تسرب',x:'اجعل λ = 1: يقل AT الحديد لأن الحديد يحمل الفيض المفيد فقط.',done:()=>lam===1},
   {t:'الثغرة',x:'ارفع طول الثغرة إلى 3 mm: يكبر نصيب الثغرة من الأمبير-لفة بسرعة لأن نفاذية الهواء μ₀ فقط.',done:()=>lg>=3},
   {t:'مثال (٦-٨)',x:'في لوحة المسارين المتوازيين ابدأ من B = 1 T في الجزء C: AT الكلية ≈ 695 (الكتاب 693 بتقريب HA = 1200).',done:()=>Math.abs(Bc-1)<1e-9},
   {t:'خارج الجدول',x:'ارفع B في الجزء C إلى 1.1 T: تصبح H في القضيب D أكبر من آخر قيمة في جدول الحديد (1650) فيظهر التنبيه.',done:()=>Bc>=1.1}
  ]);
  drawA();drawB();loopOn(el,()=>steps.check());
 },
 examples:[
  {title:'مثال (٦-٦)',ref:'ص 172–173',q:`<p>حلقة حديدية طول محيطها المتوسط 3 m ومساحة مقطعها 25 cm² وبها ثغرة هوائية طولها 1 مم، وملف به 350 لفة. معامل النفاذ النسبي 800 ومعامل التسرب 1.2. أوجد التيار اللازم للحصول على فيض 0.3 mWb في الثغرة.</p>${bfSeg('e66')}`,
   given:[{id:'p',label:'الفيض في الثغرة',sym:'\\Phi_g',unit:'mWb',value:0.3},{id:'A',label:'مساحة المقطع',sym:'A',unit:'cm²',value:25},{id:'lg',label:'طول الثغرة',sym:'\\ell_g',unit:'mm',value:1},{id:'li',label:'طول المسار في الحديد',sym:'\\ell_i',unit:'m',value:3},{id:'mr',label:'النفاذية النسبية',sym:'\\mu_r',unit:'',value:800},{id:'lam',label:'معامل التسرب',sym:'\\lambda',unit:'',value:1.2},{id:'N',label:'عدد اللفات',sym:'N',unit:'',value:350}],
   solve:(g,B,isBook)=>{const bk=bfMode('e66')==='book',pb=isBook&&bk;const Acm=pb?5:g.A,A=Acm*1e-4;
    const Bg=B.round(g.p*1e-3/A,3),Hg=sig(Bg/MU0,3),ATg=Math.round(Hg*g.lg/1000*10)/10,Bi=B.round(g.lam*g.p*1e-3/A,3),Hi=pb?715:B.round(Bi/(MU0*g.mr),1),ATi=B.round(Hi*g.li,1),T=B.round(ATg+ATi,1);
    return [{t:pb?'<b>كما في الكتاب:</b> عُوِّضت المساحة 5 × 10⁻⁴ m² (المعطى 25 cm²). في الثغرة الهوائية:':'في الثغرة الهوائية:',f:`B_g=\\frac{\\Phi}{A}=\\frac{${g.p}\\times10^{-3}}{${Acm}\\times10^{-4}}`,v:Bg,unit:'Wb/m²'},
     {t:'',f:`H_g=\\frac{B_g}{\\mu_0}=\\frac{${fm(Bg)}}{4\\pi\\times10^{-7}}`,v:fm(sig(Hg/1e4,3))+' × 10⁴',unit:'AT/m'},{t:'',f:`AT_g=H_g\\,\\ell_g=${sx(Hg,3)}\\times${g.lg}\\times10^{-3}`,v:ATg,unit:'AT'},
     {t:'في الحلقة الحديدية:',f:`B_i=\\frac{\\lambda\\Phi_g}{A}=${g.lam}\\left[\\frac{${g.p}\\times10^{-3}}{${Acm}\\times10^{-4}}\\right]`,v:Bi,unit:'Wb/m²'},
     {t:pb?'<span class="sub">(كما طُبع 715 — الدقيق 716.2)</span>':'',f:`H_i=\\frac{B_i}{\\mu_0\\mu_r}=\\frac{${fm(Bi)}}{4\\pi\\times10^{-7}\\times${g.mr}}`,v:Hi,unit:'AT/m'},{t:'',f:`AT_i=H_i\\,\\ell_i=${fm(Hi)}\\times${g.li}`,v:ATi,unit:'AT'},
     {t:'الأمبير لفة الكلي:',f:`AT=${fm(ATg)}+${fm(ATi)}`,v:T,unit:'AT'},{t:'والتيار المطلوب:',f:`I=\\frac{AT}{N}=\\frac{${fm(T)}}{${g.N}}`,v:B.round(T/g.N,pb?1:2),unit:'A',final:true}]},
   note:'<b>ملاحظة على الكتاب:</b> «كما في الكتاب» تعرض الحل المطبوع الذي عوّض 5 cm² (النتيجة 7.5 A). «المصحح» يستعمل المعطى 25 cm² فيكون التيار ≈ 1.5 A. والحساب الداخلي للكتاب متسق مع 5 cm²، فربما المعطى الصحيح 5 cm² — يقرر المدرب.'},
  {title:'مثال (٦-٧)',ref:'ص 173–174',q:`<p>دائرة مغناطيسية أبعادها في الشكل (٦-١٣). مقطع الأجزاء A و B و C مربع (40 × 40 mm) والجزء D مستطيل (40 × 30 mm). ملفان على A و C على التوالي في كل منهما 1500 لفة. μᵣ = 900 للأجزاء A و B و C و750 للجزء D. أوجد تيار المغنطة اللازم لفيض 1.6 mWb في الثغرة الهوائية.</p>${bfSeg('e67')}`,
   given:[{id:'p',label:'الفيض',sym:'\\Phi',unit:'mWb',value:1.6},{id:'a',label:'ضلع مقطع A و B و C',sym:'a',unit:'mm',value:40},{id:'dD',label:'سمك D',sym:'',unit:'mm',value:30},{id:'g',label:'طول كل ثغرة',sym:'\\ell_g',unit:'mm',value:1.5},{id:'m1',label:'μᵣ للأجزاء A و B و C',sym:'',unit:'',value:900},{id:'m2',label:'μᵣ للجزء D',sym:'',unit:'',value:750},{id:'L1',label:'طول المسار A + B + C',sym:'',unit:'mm',value:600},{id:'L2',label:'طول المسار في D',sym:'',unit:'mm',value:280},{id:'N',label:'لفات كل ملف',sym:'N',unit:'',value:1500}],
   solve:(g,B,isBook)=>{const pb=isBook&&bfMode('e67')==='book';const Bg=g.p*1e-3/(g.a*g.a*1e-6),Hg=pb?79.54e4:sig(Bg/MU0,4),lgt=2*g.g,ATg=Math.round(Hg*lgt/1000);
    const H1=Math.round(Bg/(MU0*g.m1)),AT1=Math.round(H1*g.L1/1000),BD=g.p*1e-3/(g.dD*g.a*1e-6),HD=Math.round(BD/(MU0*g.m2)),ATD=Math.round(HD*g.L2/1000),T=ATg+AT1+ATD,I=T/(2*g.N);
    return [{t:'في الثغرات الهوائية (مساحة الثغرة = مقطع الساق):',f:`B_g=\\frac{${g.p}\\times10^{-3}}{${g.a}\\times${g.a}\\times10^{-6}}`,v:sig(Bg,4),unit:'Wb/m²'},
     {t:pb?'<span class="sub">(كما طُبع 79.54 × 10⁴ — الدقيق 79.58 × 10⁴)</span>':'',f:`H_g=\\frac{B_g}{\\mu_0}=\\frac{${fm(sig(Bg,4))}}{4\\pi\\times10^{-7}}`,v:fm(sig(Hg/1e4,4))+' × 10⁴',unit:'AT/m'},
     {t:'',f:`\\ell_g=2\\times${g.g}=${fm(lgt)}\\ \\text{mm}\\qquad AT_g=H_g\\,\\ell_g`,v:ATg,unit:'AT'},
     {t:'الأجزاء A و B و C:',f:`H=\\frac{${fm(sig(Bg,4))}}{4\\pi\\times10^{-7}\\times${g.m1}}`,v:H1,unit:'AT/m'},{t:'',f:`AT=${H1}\\times${g.L1}\\times10^{-3}`,v:AT1,unit:'AT'},
     {t:'الجزء D:',f:`B=\\frac{${g.p}\\times10^{-3}}{${g.dD}\\times${g.a}\\times10^{-6}}`,v:sig(BD,4),unit:'Wb/m²'},{t:'',f:`H=\\frac{${fm(sig(BD,4))}}{4\\pi\\times10^{-7}\\times${g.m2}}`,v:HD,unit:'AT/m'},{t:'',f:`AT=${HD}\\times${g.L2}\\times10^{-3}`,v:ATD,unit:'AT'},
     {t:'',f:`\\text{Total AT}=${ATg}+${AT1}+${ATD}`,v:T,unit:'AT'},
     {t:pb?'<b>كما في الكتاب</b> (الملفان على التوالي = 3000 لفة): <span class="sub">طُبع 1.014 — والصحيح 1.104</span>':'الملفان على التوالي (2N لفة):',f:`I=\\frac{${T}}{${2*g.N}}`,v:pb?1.014:B.round(I,3),unit:'A',dp:3,final:true}]},
   note:'<b>ملاحظة على الكتاب:</b> \\(3312/3000=1.104\\) A لا 1.014 A (تبديل رقمين). اختر «المصحح».'},
  {title:'مثال (٦-٨)',ref:'ص 174–176',q:'<p>حلقة من الحديد المسبوك (الشكل ٦-١٤) مقطعها مربع ضلعه 3 cm، وبداخلها قضيب حديدي طوله 18 cm ومقطعه 0.4 cm × 3 cm. احسب الأمبير لفات اللازمة على الجزء A للحصول على 1 Wb/m² في الجزء C. (جدولا B–H في تبويب الشرح.)</p>',
   given:[{id:'Bc',label:'كثافة الفيض في C',sym:'B_C',unit:'T',value:1},{id:'lc',label:'طول كل نصف من الحلقة',sym:'\\ell_C=\\ell_A',unit:'m',value:0.33},{id:'lD',label:'طول القضيب',sym:'\\ell_D',unit:'m',value:0.18},{id:'Ac',label:'مقطع الحلقة',sym:'A_C',unit:'cm²',value:9},{id:'AD',label:'مقطع القضيب',sym:'A_D',unit:'cm²',value:1.2}],
   solve:(g,B,isBook)=>{const hc=tabH(CAST,g.Bc),ATc=Math.round(hc.v*g.lc),HD=ATc/g.lD,bD=tabB(IRON,HD),pc=g.Bc*g.Ac*1e-4,pD=bD.v*g.AD*1e-4,pA=pc+pD,BA=pA/(g.Ac*1e-4),hA=tabH(CAST,BA),HA=isBook?1200:Math.round(hA.v),ATA=Math.round(HA*g.lc);
    const out=[{t:'1. الجزء C: من جدول الحديد المسبوك:',f:`H_C=${fm(Math.round(hc.v))}\\ \\text{AT/m}\\qquad AT_C=${fm(Math.round(hc.v))}\\times${g.lc}`,v:ATc,unit:'AT'},
     {t:'2. الجزء D على التوازي مع C ⇐ نفس الأمبير لفات:',f:`H_D=\\frac{${ATc}}{${g.lD}}`,v:Math.round(HD),unit:'AT/m'},{t:'ومن جدول الحديد:',f:'B_D',v:sig(bD.v,3),unit:'Wb/m²'},
     {t:'',f:`\\Phi_C=${g.Bc}\\times${g.Ac}\\times10^{-4}\\qquad \\Phi_D=${fm(sig(bD.v,3))}\\times${g.AD}\\times10^{-4}`,v:sci(pD,3),unit:'Wb (Φ_D)'},
     {t:'',f:`\\Phi_A=\\Phi_C+\\Phi_D`,v:sci(pA,4),unit:'Wb'},{t:'',f:`B_A=\\frac{\\Phi_A}{A_A}`,v:B.round(BA,3),unit:'Wb/m²',dp:3},
     {t:isBook?'من الجدول وبالتقريب (الاستكمال الخطي يعطي 1207):':'من الجدول بالاستكمال الخطي:',f:`H_A\\qquad AT_A=H_A\\times${g.lc}`,v:HA,unit:'AT/m'},{t:'',f:'AT_A',v:ATA,unit:'AT'},
     {t:'الأمبير لفات الكلية:',f:`AT_t=${ATA}+${ATc}`,v:ATA+ATc,unit:'AT',final:true}];
    if(hc.ext||bD.ext||hA.ext)out.push({t:'تنبيه: إحدى القيم خارج الجدولين — النتيجة باستكمال خارجي.'});return out}}
 ],
 quiz:[
  {q:'لحساب الأمبير-لفة لجزء من الحديد بنفاذية معلومة نحسب أولاً:',o:['H = B·μ','B = Φ/A ثم H = B/(μ₀μᵣ)','AT = Φ·A','I = B/N'],c:1,e:'ص 172–174.'},
  {q:'في دائرة بها ثغرة هوائية 1 mm وحديد طوله 3 m (μᵣ = 800) وكثافة الفيض متساوية، أي الجزأين يحتاج أمبير-لفة أكثر؟',o:['الحديد دائماً','الثغرة: 1 mm هواء تعادل 0.8 m حديد','متساويان','لا يمكن المقارنة'],c:1,e:'ℓg·μᵣ = 1 mm × 800 = 0.8 m مكافئ من الحديد.'},
  {q:'معامل التسرب λ = 1.2 يعني أن الفيض في الحديد قرب الملف:',o:['أقل من فيض الثغرة بـ 20 %','أكبر من فيض الثغرة بـ 20 %','يساوي فيض الثغرة','صفر'],c:1,e:'مثال (٦-٦): Bi = λΦg/A.'},
  {q:'الأجزاء المتوازية في الدائرة المغناطيسية يكون عليها:',o:['نفس الفيض','نفس الأمبير-لفة','نفس كثافة الفيض','نفس الطول'],c:1,e:'مثال (٦-٨): D على التوازي مع C فعليه نفس الأمبير لفات.'},
  {q:'في مثال (٦-٧) لماذا قُسمت 3312 على 3000؟',o:['لأن الثغرتين على التوالي','لأن الملفين (1500 لفة لكل منهما) موصلان على التوالي','لأن μᵣ = 3000','خطأ في الكتاب'],c:1,e:'NI الكلية = 3000 × I.'},
  {q:'إذا كانت قيمة B بين نقطتين في جدول B–H نحصل على H:',o:['بأخذ أكبر قيمة','بالاستكمال الخطي بين النقطتين','بقسمة B على μ₀','بأخذ المتوسط دائماً'],c:1,e:'مثال (٦-٨): H_A ≈ 1207 بالاستكمال، والكتاب قرّبها إلى 1200.'},
  {q:'زيادة طول الثغرة الهوائية مع بقاء الفيض المطلوب ثابتاً تتطلب:',o:['تياراً أقل','تياراً أكبر','نفس التيار','قلباً أقصر فقط'],c:1,e:'ATg = Hg·ℓg يزيد مع ℓg.'}
 ]
});

/* ======================================================================
   Lesson u6-l4 — الملفات: أنواعها وسلوكها في التيارين + تمارين الوحدة السادسة (ص 176–182)
   ====================================================================== */
const coilSym=(x,y,n,core,lab)=>{let s=`<path class="w" d="M${x-46} ${y}H${x-30}`;for(let k=0;k<(n||4);k++)s+=`A7.5 7.5 0 0 1 ${x-30+15*(k+1)} ${y}`;s+=`H${x+46}"/>`;
  if(core==='iron')s+=`<path d="M${x-30} ${y-14}H${x+30}M${x-30} ${y-19}H${x+30}" stroke="var(--fg)" stroke-width="2"/>`;
  if(core==='fer'||core==='var')s+=`<path d="M${x-30} ${y-14}H${x+30}M${x-30} ${y-19}H${x+30}" stroke="var(--fg)" stroke-width="2" stroke-dasharray="6 4"/>`;
  if(core==='var')s+=arrow(x-26,y+16,x+28,y-32,'--fg',1.6);
  return s+arT(x,y+38,lab,{fs:12})};
function fig620(){let s=`<svg viewBox="0 0 640 120" role="img" aria-label="الصور الرمزية لأنواع الملفات">`;
  s+=coilSym(570,56,4,'','ملف قلب هوائي')+coilSym(445,56,4,'iron','ملف قلب حديدي')+coilSym(320,56,4,'fer','ملف قلب فيرايت')+coilSym(195,56,4,'var','ملف فيرايت متغير');
  s+=`<path class="w" d="M50 20V30A7.5 7.5 0 0 1 50 45A7.5 7.5 0 0 1 50 60A7.5 7.5 0 0 1 50 75A7.5 7.5 0 0 1 50 90V100M100 20V30A7.5 7.5 0 0 0 100 45A7.5 7.5 0 0 0 100 60A7.5 7.5 0 0 0 100 75A7.5 7.5 0 0 0 100 90V100"/><path d="M71 26V94M79 26V94" stroke="var(--fg)" stroke-width="2"/>`+arT(75,116,'ملف المحول',{fs:12});
  return s+'</svg>'}
function fig615(){let s=`<svg viewBox="0 0 420 170" role="img" aria-label="ملف ذو قلب هوائي">`;for(let k=0;k<20;k++){const x=90+k*12;s+=`<ellipse cx="${x}" cy="90" rx="7" ry="34" fill="none" stroke="var(--live)" stroke-width="3"/>`}
  s+=arrow(40,40,80,70,'--stop',2.4)+arrow(330,110,380,140,'--live',2.4)+arT(210,160,'BOBINE — COIL (بلا قلب)',{fs:12,col:'--muted'})+coilSym(330,26,4,'','')+arT(250,30,'الصورة الرمزية',{fs:11.5,col:'--muted'});return s+'</svg>'}
function fig616(){let s=`<svg viewBox="0 0 420 200" role="img" aria-label="ملف على قلب من شرائح EI">`;
  for(let k=0;k<7;k++)s+=`<path d="M${110+k*4} ${40-k*3}H${300+k*4}V${170-k*3}H${110+k*4}Z M${150+k*4} ${70-k*3}H${185+k*4}V${140-k*3}H${150+k*4}Z M${225+k*4} ${70-k*3}H${260+k*4}V${140-k*3}H${225+k*4}Z" fill="var(--surface-2)" fill-rule="evenodd" stroke="var(--fg)" stroke-width=".8"/>`;
  s+=`<rect x="178" y="56" width="58" height="92" rx="8" fill="var(--live-soft)" stroke="var(--live)" stroke-width="2"/>`+arT(210,192,'شرائح معزولة على شكل E و I لتقاوم التيارات الدوامية',{fs:12});return s+'</svg>'}
function fig617(){let s=`<svg viewBox="0 0 420 150" role="img" aria-label="ملفات على قلوب من مسحوق الحديد">`;const cols=['--live','--stop','--on','--muted','--blue'];
  for(let k=0;k<5;k++){const cx=50+k*80,cy=70;s+=`<circle cx="${cx}" cy="${cy}" r="30" fill="none" stroke="var(${cols[k]})" stroke-width="14"/>`;for(let j=0;j<16;j++){const a=j*PI/8;s+=`<path d="M${fx(cx+20*Math.cos(a))} ${fx(cy+20*Math.sin(a))}L${fx(cx+40*Math.cos(a))} ${fx(cy+40*Math.sin(a))}" stroke="var(--live)" stroke-width="1.4"/>`}}
  return s+arT(210,140,'ملفات حلقية على قلوب من مسحوق الحديد',{fs:12})+'</svg>'}
function fig618(){let s=`<svg viewBox="0 0 420 130" role="img" aria-label="ملف على قضيب فيرايت">`;s+=`<rect x="40" y="52" width="340" height="30" rx="14" fill="var(--fg)" opacity=".75"/>`;for(let k=0;k<12;k++)s+=`<ellipse cx="${140+k*12}" cy="67" rx="6" ry="22" fill="none" stroke="var(--live)" stroke-width="3"/>`;
  s+=`<path d="M140 45V10M272 45V10" stroke="var(--live)" stroke-width="2"/>`+arT(210,120,'ملف نحاسي على قضيب فيرايت',{fs:12});return s+'</svg>'}
/* solenoid actuator (fig 6-21): p = plunger position 0 (out) … 1 (pulled in) */
function solActSVG(p,on){let s=`<svg viewBox="0 0 520 170" role="img" aria-label="ملف لولبي كهروميكانيكي">`;
  s+=`<rect x="250" y="40" width="200" height="90" rx="6" fill="var(--live-soft)" stroke="var(--live)" stroke-width="2"/>`;for(let k=0;k<14;k++)s+=`<path d="M${262+k*13} 44V126" stroke="var(--live)" stroke-width="2" opacity=".55"/>`;
  const x=110+p*130;s+=`<rect x="${x}" y="70" width="220" height="30" rx="6" fill="var(--muted)" stroke="var(--fg)"/>`+S.t(x+200,90,'P','','middle',13);
  const sx0=40,sx1=x;let d=`M${sx0} 85`;const n=10;for(let k=1;k<=n;k++)d+=`L${fx(sx0+(sx1-sx0)*(k-0.5)/n)} ${k%2?72:98}`;s+=`<rect x="28" y="60" width="12" height="50" fill="var(--fg)"/><path d="${d}L${sx1} 85" fill="none" stroke="var(--blue)" stroke-width="2.4"/>`;
  s+=`<path class="w ${on?'flow':''}" d="M300 130V158H400V130"/>`+S.t(350,152,on?'ON':'OFF','','middle',13).replace('class="txt "',`class="txt " style="fill:var(${on?'--stop':'--muted'})"`)+arT(350,30,'الملف Coil',{fs:12})+arT(80,140,'نابض',{fs:12,col:'--blue'});
  return s+'</svg>'}
/* exercise figures */
function exFig1(){return coreSVG({W:420,H:290,g:10,flow:1,extra:S.t(220,268,'N = 6000','','middle',13)}).replace(/<path d="M(\d+) (\d+)H(\d+)V/,(m)=>m)}
function exFig2(){return shellSVG({coils:{C:'500 T'},gapC:true,extra:S.t(230,26,'1 mm gap — 120 mm — 300 mm','m','middle')})}
function exFig3(){const pts=['wi','ms','st','cs','ci'].map((k,i)=>({pts:BH[k].p.map(p=>[p[0],p[1]]),col:['--fg','--blue','--on','--live','--stop'][i],w:2}));
  return plotSVG({w:560,h:300,x0:0,x1:10000,y0:0,y1:1.8,xt:[0,2000,4000,6000,8000,10000],yt:[0,0.4,0.8,1.2,1.6,1.8],left:46,xl:'Magnetic field strength [A/m]',yl:'Flux density [T]',series:pts,
   extra:(X,Y)=>[['Wrought iron',9000,1.79,'--fg'],['Mild & Sheet Steel',9000,1.65,'--blue'],['Stalloy',9000,1.55,'--on'],['Cast Steel',7000,1.6,'--live'],['Cast Iron',9000,0.86,'--stop']].map(a=>`<text class="txt" x="${fx(X(a[1]))}" y="${fx(Y(a[2])+(a[0]==='Cast Steel'?14:-6))}" text-anchor="end" font-size="11" style="fill:var(${a[3]})">${a[0]}</text>`).join(''),aria:'منحنيات B-H'})}
function exFig4(){return shellSVG({W:520,coils:{L:'N1=100',R:'N2=50'},gapC:true,flux:{TL:['ΦA',0],TR:['ΦB',0],C:['ΦC',PI/2]},extra:S.t(230,290,'μr = 2000','','middle',13)})}

B.lesson({
 id:'u6-l4',unit:6,order:4,pages:'176–182',
 title:'الملفات: أنواعها وسلوكها في التيار المستمر والمتردد، وتمارين الوحدة',
 summary:'تركيب الملفات وأنواعها حسب القلب (هوائي، حديدي، مسحوق حديد، فيرايت) وحسب التردد، ورموزها، وسلوك الملف عند توصيله وفصله في التيار المستمر، ومعاكسته للتغير في التيار المتردد، والملف اللولبي الكهروميكانيكي، ثم تمارين الوحدة السادسة.',
 theory:[
  {h:'الملفات المجوفة (اللولبية): تركيب الملفات',ref:'ص 176',html:`<p>يتركب الملف من سلك معزول ملفوف على إطار من مادة عازلة، ويمكن أن يكون على عدة أشكال وأنواع منها:</p><p><b>أولاً: من حيث القلب</b> — تصنف الملفات وفقاً للمادة التي تشغل الحيز داخل الإطار:</p>
   <ol><li><b>ملفات ذات قلب هوائي</b> (مجوفة): يشغل الهواء ما بداخل إطارها، والحث الذاتي لمثل هذه الملفات صغير (الشكل ٦-١٥).</li></ol>`},
  {fig:'(٦-١٥)',ref:'ص 176',caption:'ملف حلزوني نحاسي بلا قلب، ورمزه.',draw:()=>box(fig615(),400)},
  {html:`<ol start="2"><li><b>ملفات ذات قلب حديدي:</b> إذا وُضع داخل الملف قلب حديدي (الشكل ٦-١٦) فإن المجال يتركز داخل وحول الملف ولا يشرد كثيراً خارجه، فيزيد حث الملف، وقد يصل حث هذا النوع إلى <b>10 هنري</b>. ويعيبه أن تيارات متولدة بالحث داخل القلب تسمى <b>التيارات الإعصارية أو الدوامية</b> تتحرك في اتجاهات عشوائية داخل القلب فترفع حرارته وتسبب فقداً في الطاقة؛ ولذلك يقسم القلب الحديدي إلى <b>شرائح معزولة</b> عن بعضها لتقاوم التيارات الدوامية. وتستخدم الملفات ذات القلب الحديدي في التنعيم في دوائر تقويم التيار المتناوب وفي دوائر المصابيح الفلورسنتية. <span class="ref">ص 177</span></li></ol>`},
  {fig:'(٦-١٦)',ref:'ص 177',caption:'ملف على قلب من شرائح مكدسة على شكل حرفي E و I، معزولة بعضها عن بعض لتقاوم التيارات الإعصارية أو الدوامية.',draw:()=>box(fig616(),400)},
  {html:`<ol start="3"><li><b>ملفات ذات قلب من مسحوق الحديد:</b> يخلط مسحوق الحديد بمادة عازلة ويضغط ليعطي قلباً مغناطيسياً ذا مقاومة كهربية عالية، فتقل التيارات الدوامية إلى حد كبير (الشكل ٦-١٧).</li>
   <li><b>ملفات ذات قلب من الفيرايت:</b> الفيرايت مادة مغناطيسية مقاومتها الكهربية عالية جداً، وبذلك نضمن عدم سريان التيارات الإعصارية داخلها (الشكل ٦-١٨). <span class="ref">ص 178</span></li></ol>
   <div class="mg-figs"><figure>${box(fig617(),400)}<figcaption><b>الشكل (٦-١٧)</b> ص 177</figcaption></figure><figure>${box(fig618(),400)}<figcaption><b>الشكل (٦-١٨)</b> ص 178</figcaption></figure></div>
   <p><b>ثانياً: من حيث الترددات</b> <span class="ref">ص 178</span></p><ol><li><b>ملفات التردد المنخفض:</b> تستخدم في الترددات الصوتية (من 20 هرتز إلى 20 كيلوهرتز)، وهي من الملفات ذات القلب الحديدي.</li>
   <li><b>ملفات التردد المتوسط:</b> التردد المتوسط في أجهزة الراديو ذات تعديل السعة AM يساوي 465 كيلوهرتز، وهي من الملفات ذات القلب من مسحوق الحديد أو الفيرايت.</li>
   <li><b>ملفات التردد العالي:</b> تستخدم في الترددات التي تزيد عن 2 ميجاهرتز مثل دوائر التنعيم في أجهزة الراديو، وهي ذات قلب هوائي. في حالة التردد العالي تكون ممانعة الملفات كبيرة، وفي حالة التردد المنخفض تكون صغيرة، وهذا يمكننا من فصل الترددات الصوتية عن الترددات العالية في الدوائر التي يقترن فيها الاثنان.</li></ol>
   <p>يمكن أن يغلف الملف بغلاف من حديد عند الرغبة في ألا يتأثر بالمجالات المغناطيسية الخارجية، وقد يغلف بغلاف من البلاستيك لحمايته، وقد يترك بدون تغليف (الشكل ٦-١٩: مجموعة متنوعة من الملفات والمحولات الصغيرة — صورة في الكتاب). <span class="ref">ص 179</span></p>
   <p>الملف المجوف (اللولبي) هو الاسم الذي يعطى لملف من السلك صُنع لإحداث مجال مغناطيسي؛ يُلف على حديد (ملف ذو قلب حديدي) أو على مادة غير مغناطيسية (ملف ذو قلب هوائي). والشكل (٦-٢٠) يوضح الصور الرمزية لأنواع مختلفة من الملفات.</p>`},
  {fig:'(٦-٢٠)',ref:'ص 179',caption:'الصور الرمزية لأنواع الملفات: قلب هوائي، قلب حديدي (خطان متصلان)، قلب فيرايت (خطان متقطعان)، فيرايت متغير (سهم مائل)، وملفا المحول.',draw:()=>box(fig620(),620)},
  {h:'أساسيات الملف المجوف الخطي',ref:'ص 179',html:`<p>عندما يُحدث تيار كهربائي مجالاً مغناطيسياً في الحديد تتحرك في هذا المعدن جسيمات الميادين المجهرية لتنتظم في صف متوازٍ مع المجال. وبما أنه من السهل على التدفق المغناطيسي المرور في الحديد، فالتيار ينتج المزيد من التدفق في وحدة مساحة المقطع، أي أن كثافة الدفق تشتد.</p>`},
  {h:'الملف في دوائر التيار المستمر',ref:'ص 180',html:`<p>إذا سُلط جهد مستمر على ملف فإن التيار الذي يمر بالملف <b>لا يصل إلى قيمته العظمى منذ اللحظة الأولى</b> بسبب تولد جهد مستنتج بالحث الذاتي يعارض مرور التيار. فالتيار يتزايد تدريجياً عند توصيل الملف بالتيار المستمر. وإذا فُصل الجهد المستمر عن الملف فإن الجهد المستنتج بالحث الذاتي يعارض تناقص التيار، لذا فإن التيار لا يصل إلى الصفر بمجرد الفصل بل يستمر إلى حين. <b>يتزايد التيار تدريجياً عند وصل الملف مع التيار المستمر، ويتناقص تدريجياً عند فصله.</b></p>`},
  {note:'<b>توضيح للمتدرب (ليس من الكتاب):</b> سرعة الارتفاع يحددها <b>ثابت الزمن</b> \\(\\tau=L/R\\): بعد زمن τ يصل التيار إلى نحو 63 % من قيمته النهائية \\(V/R\\)، وبعد نحو 5τ يكون قد استقر. وعند الفصل يحتاج التيار مساراً يكمل فيه (في المختبر نوصل ثنائياً على الملف)، وإلا ظهر جهد عالٍ وشرارة عند المفتاح.'},
  {h:'الملفات في دوائر التيار المتردد',ref:'ص 180',html:`<p>بما أن التيار المتناوب يتغير باستمرار في قيمته واتجاهه، فإن الملفات يتولد فيها جهد مستنتج بالحث الذاتي <b>يعارض الزيادة أو النقص أو تغيير الاتجاه</b> عندما توصل في دوائر التيار المتناوب.</p>`},
  {note:'<b>توضيح للمتدرب (ليس من الكتاب):</b> هذه المعارضة تسمى المفاعلة الحثية \\(X_L=2\\pi fL\\) وتقاس بالأوم؛ تكبر مع التردد ومع الحث، لذلك يقل التيار عند التردد العالي (وهو ما ذكره الكتاب في ملفات التردد العالي)، ويتأخر التيار عن الجهد. تدرسها بالتفصيل في «دوائر كهربائية-2».'},
  {h:'الملف اللولبي الكهروميكانيكي',ref:'ص 180',html:`<p>الملفات المجوفة هي أجهزة كهروميكانيكية تحول الطاقة الكهربائية إلى حركة ميكانيكية، وتُستخدم هذه الحركة عموماً لنقل الحمولة إلى مسافة محددة. وجميع الملفات اللولبية الخطية هي أساساً <b>من نوع سحب</b> (الشكل ٦-٢١): يُسحب الغواص داخل الملف حين يكون الملف مهيجاً (٦-٢١أ)، أما عند فصل الكهرباء عن الملف (٦-٢١ب) فيعود القضيب إلى وضعه الأصلي.</p>`},
  {fig:'(٦-٢١)',ref:'ص 180',caption:'(أ) الملف مهيج: الغواص P مسحوب إلى داخل الملف. (ب) الملف غير مهيج: النابض يعيد الغواص. جرّبه في المختبر.',draw:()=>`<div class="mg-figs"><figure>${box(solActSVG(1,true),420)}<figcaption>(أ) الملف مهيج</figcaption></figure><figure>${box(solActSVG(0,false),420)}<figcaption>(ب) الملف غير مهيج</figcaption></figure></div>`},
  {h:'تمارين على الوحدة السادسة',ref:'ص 181–182',html:[
   Q('تمرين 1','يمر تيار قدره 20 mA في الملف الذي يحتوي على 6000 لفة (الشكل 1) فيحدث فيض مغناطيسي عبر الحديد والفجوة الهوائية. إذا كانت مساحة مقطع الحديد <span class="ltr">0.8×10⁻⁴ m²</span>، وطول المسار المتوسط في الحديد 0.15 m، ومعامل النفاذ النسبي للحديد 800، والفجوة الهوائية 0.75 mm، احسب كثافة الفيض المغناطيسي (يهمل عامل التقوس).',
     `${box(exFig1(),360)}<p><b>الحل:</b> \\(NI=6000\\times0.02=120\\) AT. الدائرة توالٍ والمساحة واحدة: \\(NI=\\dfrac{B}{\\mu_0}\\left(\\dfrac{\\ell_i}{\\mu_r}+\\ell_g\\right)\\) ⇐ \\(B=\\dfrac{120\\times4\\pi\\times10^{-7}}{0.15/800+0.75\\times10^{-3}}\\approx0.161\\) T. (الحاسبة في «الأمثلة المحلولة».)</p>`),
   Q('تمرين 2','لتكن الدائرة المغناطيسية (الشكل 2): الساق الوسطى تحتوي على 500 لفة ومساحة مقطعها 800 mm²، أما الساقان الأيمن والأيسر فمساحة مقطعهما 500 mm²، والفجوة الهوائية 1 mm. احسب التيار المطلوب للحصول على 1.3 mWb في الساق الوسطى (يهمل التسرب والتقوس). أبعاد المسارات موضحة على الشكل (2)، استعمل منحنى B-H الشكل (3).',
     `${box(exFig2(),400)}${box(exFig3(),520)}<p class="sub"><b>الشكل (2)</b> ص 181 و<b>الشكل (3)</b> ص 182 (منحنيات مقروءة تقريبياً).</p><p><b>الحل المقترح (بافتراضات نذكرها):</b> الكتاب لا يحدد مادة القلب؛ نفترض «صلب طري وصفائح» من الشكل (3)، ونفهم أن طول كل مسار متقطع 300 mm يشمل الساق الوسطى (120 mm)، فيبقى 180 mm للجزء الجانبي. بالتماثل يتوزع الفيض نصفين على الساقين الجانبيتين، ويكفي تطبيق KVL على حلقة واحدة:</p>
     <ul><li>الساق الوسطى: \\(B=1.3\\times10^{-3}/800\\times10^{-6}=1.625\\) T ⇐ من المنحنى \\(H\\approx4700\\) A/m، على طول \\(120-1=119\\) mm ⇐ ≈ 560 AT.</li><li>الثغرة: \\(H_g=1.625/\\mu_0\\approx1.293\\times10^6\\) ⇐ ≈ 1293 AT.</li><li>الساق الجانبية: \\(B=0.65\\times10^{-3}/500\\times10^{-6}=1.3\\) T ⇐ \\(H\\approx850\\) A/m على 180 mm ⇐ ≈ 153 AT.</li></ul>
     <p>المجموع ≈ 2006 AT ⇐ \\(I\\approx2006/500\\approx4.0\\) A. (قراءات المنحنى تقريبية؛ الحاسبة تقبل قراءاتك.)</p>`),
   Q('تمرين 3','الشكل (4) يبين محولاً ذا ملفين: الابتدائي 100 لفة والثانوي 50 لفة، ونفاذية الحديد 2000 (يهمل التسرب والتقوس). احسب شدة التيار الابتدائي إذا كان التيار الثانوي 20 A وكانت القيمة العظمى لكثافة الفيض في الساق الوسطى C هي 0.6 T. (مقطع الساقين A و B = 12 cm²، مقطع الساق C = 24 cm²، طول مسار A = 15 cm، B = 15 cm، C = 5 cm، الفجوة 0.4 cm.)',
     `${box(exFig4(),440)}<p><b>الحل المقترح (بافتراضات نذكرها):</b> نعتبر طول الساق C الحديدي 5 cm تضاف إليه الفجوة 0.4 cm، وأن قوة الملف الثانوي تعاكس فيض الساق B (فعل المحول وقانون لنز)، والفيض \\(\\Phi_A=\\Phi_B+\\Phi_C\\). الممانعات: \\(\\Re_A=\\Re_B\\approx4.97\\times10^4\\)، \\(\\Re_C\\approx8.3\\times10^3+1.326\\times10^6\\approx1.335\\times10^6\\) AT/Wb.</p>
     <ul><li>\\(\\Phi_C=0.6\\times24\\times10^{-4}=1.44\\) mWb ⇐ \\(\\Re_C\\Phi_C\\approx1922\\) AT.</li><li>حلقة B–C: \\(\\Re_C\\Phi_C-\\Re_B\\Phi_B=N_2I_2=1000\\) ⇐ \\(\\Phi_B\\approx18.5\\) mWb.</li><li>حلقة A–C: \\(N_1I_1=\\Re_A\\Phi_A+\\Re_C\\Phi_C\\approx993+1922\\) ⇐ \\(I_1\\approx29\\) A.</li></ul>
     <p><b>تنبيه:</b> هذا الحل يعطي كثافة فيض في الساق B تزيد على 15 T، وهذا مستحيل عملياً (الحديد يتشبع قرب 2 T). أي أن معطيات التمرين لا تتسق مع نموذج نفاذية ثابتة، أو أن المقصود طريقة أبسط لم يذكرها الكتاب — يُرجع فيه إلى المدرب. الحاسبة في «الأمثلة المحلولة» تتيح تغيير الافتراضات.</p><p><b>نشاط: اكتشف الخطأ.</b> لماذا يستحيل الحل؟ الفجوة الهوائية 0.4 cm تحتاج وحدها نحو 1920 AT ليمر 0.6 T في الساق C، بينما يعطي الثانوي 50 × 20 = 1000 AT فقط؛ والفرق يدفع فيضاً هائلاً في حديد الساق B لأن ممانعته صغيرة جداً. الأرجح أن أحد أرقام التمرين منقول خطأ.</p><p><b>حل بديل بافتراض منا (ليس من الكتاب): التيار الثانوي 40 A بدل 20 A.</b></p><ul><li>\\(N_2I_2=50\\times40=2000\\) AT، و \\(\\Re_C\\Phi_C\\approx1922\\) AT كما سبق.</li><li>حلقة B–C: \\(\\Phi_B=(1922-2000)/(4.97\\times10^4)\\approx-1.57\\) mWb ⇐ \\(B_B\\approx1.31\\) T (الإشارة السالبة: فيض الساق B عكس السهم المرسوم). قيمة ممكنة عملياً.</li><li>\\(\\Phi_A=\\Phi_B+\\Phi_C\\approx-0.13\\) mWb (صغير جداً).</li><li>حلقة A–C: \\(N_1I_1=\\Re_A\\Phi_A+\\Re_C\\Phi_C\\approx-6.5+1922\\) ⇐ <b>\\(I_1\\approx19.2\\) A</b>.</li></ul><p class="sub">جرّب في الحاسبة («الأمثلة المحلولة») قيماً أخرى للتيار الثانوي: عند نحو 38.4 A يصبح فيض الساق B صفراً.</p>`)].join('')},
  {err:`<ol style="margin:4px 0 0;padding-inline-start:20px"><li>ص 178: «ذات التعديل السعوي A M» والمقصود تعديل السعة AM؛ وكُتبت «الفرريت/الفيرريت» بأكثر من صورة؛ صُححت في النص.</li>
   <li>ص 180: الفقرة تنتقل من الملفات في التيار المتردد إلى الملف اللولبي الكهروميكانيكي دون ربط، ولا تذكر المفاعلة الحثية \\(X_L\\) ولا ثابت الزمن \\(\\tau=L/R\\) — أضفناهما في توضيحين.</li>
   <li>تمرين 1: «معامل النفاد» صوابها «النفاذ».</li>
   <li>تمرين 2: لا يحدد الكتاب مادة القلب التي يُقرأ منحناها من الشكل (3).</li>
   <li>تمرين 3: المعطيات تقود إلى كثافة فيض غير واقعية في الساق B (انظر التنبيه في الحل المقترح).</li>
   <li>الإجابات غير مذكورة في الكتاب؛ كل الحلول أعلاه مقترحة.</li></ol>`}
 ],
 lab:(el)=>{
  let md='dc',core='fe',sw=false,i=0,t=0,hist=[],f=50,act=false,pp=0,did={};
  const CORES=[['air','قلب هوائي'],['pw','مسحوق حديد'],['fr','فيرايت'],['fe','حديد (شرائح)']];
  el.innerHTML=`<div id="g4tp"></div><div class="grid mg-lab">
   <div class="panel c12"><h2>الملف في التيار المستمر والمتردد <small>ص 180</small></h2>
    <div class="mg-row">${segHTML('md',[['dc','تيار مستمر'],['ac','تيار متردد']],md)}${segHTML('core',CORES,core)}</div>
    <div class="grid" style="margin-top:4px"><div class="c5"><div class="svgbox" id="g4c"></div><div class="mg-row" id="g4dcw"><button class="btn primary" id="g4sw">صِل الجهد</button></div><div id="g4acw">${sl('g4f','التردد f',1,200,1,f)}</div></div>
     <div class="c7"><div class="svgbox" id="g4p"></div><div class="facts" id="g4f2"></div><p class="sub" id="g4n"></p></div></div></div>
   <div class="panel c12"><h2>الملف اللولبي الكهروميكانيكي <small>الشكل (٦-٢١) ص 180</small></h2><div class="grid"><div class="c7"><div class="svgbox" id="g4s" style="max-width:520px;margin:auto"></div></div><div class="c5"><button class="btn primary" id="g4act">هيّج الملف</button><p class="sub" id="g4sn"></p></div></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="g4st"></ol></div></div>`;
  const $=s=>el.querySelector(s);
  const TP=B.params($('#g4tp'),'u6-l4',[
   {k:'V',label:'جهد المصدر (المستمر، والقيمة العظمى للمتردد)',unit:'V',value:12,min:0.1,max:1000,step:0.1},
   {k:'R',label:'مقاومة الدائرة (السلك + المقاومة)',unit:'Ω',value:20,min:0.1,max:100000,step:0.1},
   {k:'La',label:'حث الملف بقلب هوائي',unit:'H',value:0.01,min:0.00001,max:100,step:0.00001},
   {k:'Lp',label:'حث الملف بقلب من مسحوق الحديد',unit:'H',value:0.5,min:0.00001,max:100,step:0.00001},
   {k:'Lf',label:'حث الملف بقلب فيرايت',unit:'H',value:2,min:0.00001,max:100,step:0.00001},
   {k:'Li',label:'حث الملف بقلب حديدي',unit:'H',value:10,min:0.00001,max:100,step:0.00001}],()=>{hist=[];drawAC()});
  const L=()=>({air:TP.v.La,pw:TP.v.Lp,fr:TP.v.Lf,fe:TP.v.Li})[core];
  const cktSVG=(on,ac)=>{let s=`<svg viewBox="0 0 320 210" role="img" aria-label="ملف ومقاومة ومصدر">`;s+=`<path class="w ${on?'flow':''}" d="M50 40H130M170 40H270V170H50V40"/>`;
   if(ac)s+=`<circle cx="50" cy="105" r="20" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/><path d="M38 105Q44 92 50 105T62 105" fill="none" stroke="var(--fg)" stroke-width="1.6"/>`;else s+=`<rect x="34" y="92" width="32" height="28" fill="var(--surface)"/><path d="M38 98H62M43 108H57" stroke="var(--fg)" stroke-width="3"/>`+S.t(72,98,'+','','start',12);
   s+=(on?`<path d="M130 40H170" stroke="var(--fg)" stroke-width="3"/>`:`<path d="M130 40L164 20" stroke="var(--stop)" stroke-width="3"/>`)+`<circle cx="130" cy="40" r="3" fill="var(--fg)"/><circle cx="170" cy="40" r="3" fill="var(--fg)"/>`;
   s+=`<rect x="258" y="70" width="24" height="70" fill="var(--surface)"/>`+ind(270,70,270,140,4,'')+(core!=='air'?`<path d="M290 72V138M295 72V138" stroke="var(--fg)" stroke-width="2" ${core==='fe'?'':'stroke-dasharray="5 3"'}/>`:'')+S.t(302,108,'L','','start',13);
   s+=`<rect x="120" y="160" width="80" height="20" fill="var(--surface)"/>`+zig(120,170,200,170,6,'')+S.t(160,196,'R','','middle',13);
   if(!ac)s+=`<path class="w" d="M230 40V80M230 130V170"/><path d="M220 112H240L230 96Z" fill="var(--fg)"/><path d="M220 96H240" stroke="var(--fg)" stroke-width="2"/>`+S.t(224,148,'D','m','end');
   return s+'</svg>'};
  const drawAC=()=>{if(md!=='ac')return;const Lv=L(),XL=2*PI*f*Lv,Z=Math.hypot(TP.v.R,XL),Im=TP.v.V/Z,ph=Math.atan2(XL,TP.v.R);
   const T=2/f,pv=[],pi=[];for(let k=0;k<=400;k++){const tt=k/400*T;pv.push([tt*1000,TP.v.V*Math.sin(2*PI*f*tt)]);pi.push([tt*1000,Im*Math.sin(2*PI*f*tt-ph)])}
   const ki=TP.v.V/Math.max(Im,1e-12)*0.8;const pis=pi.map(p=>[p[0],p[1]*ki]);
   $('#g4p').innerHTML=plotSVG({w:620,h:240,x0:0,x1:T*1000,y0:-TP.v.V*1.1,y1:TP.v.V*1.1,xt:[0,T*250,T*500,T*750,T*1000].map(v=>+v.toPrecision(3)),yt:[-TP.v.V,0,TP.v.V],left:50,xl:'t (ms)',yl:'v , i',series:[{pts:pv,col:'--blue',w:2},{pts:pis,col:'--live',w:2.4}],aria:'الجهد والتيار في الملف'})+`<div class="sub" style="text-align:center">الأزرق: الجهد v — البرتقالي: التيار i (مكبّر ليظهر على نفس الرسم)</div>`;
   $('#g4f2').innerHTML=fact('المفاعلة X<sub>L</sub> = 2πfL (توضيح)','a1')+fact('القيمة العظمى للتيار','a2')+fact('تأخر التيار عن الجهد','a3');$('#a1').textContent=eng(XL,'Ω');$('#a2').textContent=eng(Im,'A');$('#a3').textContent=fm(B.round(ph/D,1),1)+'°';
   $('#g4n').textContent=XL>10*TP.v.R?'المفاعلة أكبر بكثير من المقاومة: الملف يعارض التغير بقوة فيصغر التيار ويتأخر نحو 90°.':XL<0.1*TP.v.R?'المفاعلة صغيرة: الملف لا يكاد يعارض التيار (تردد منخفض أو حث صغير).':'زد التردد أو اختر قلباً حديدياً وراقب صِغَر التيار وتأخره.';
   $('#g4f-v').textContent=f+' Hz';$('#g4c').innerHTML=cktSVG(true,true)};
  const ui=()=>{$('#g4dcw').style.display=md==='dc'?'':'none';$('#g4acw').style.display=md==='ac'?'':'none';hist=[];if(md==='ac')drawAC()};
  segBind(el,'md',v=>{md=v;did[v]=1;ui()});segBind(el,'core',v=>{core=v;did['c'+v]=1;hist=[];drawAC()});$('#g4f').oninput=e=>{f=+e.target.value;did.fmax=Math.max(did.fmax||0,f);drawAC()};
  $('#g4sw').onclick=()=>{sw=!sw;$('#g4sw').textContent=sw?'افصل الجهد':'صِل الجهد';did[sw?'on':'off']=1;if(!sw)did.offAt=t};
  $('#g4act').onclick=()=>{act=!act;$('#g4act').textContent=act?'افصل الكهرباء عن الملف':'هيّج الملف';did[act?'aon':'aoff']=1};
  const steps=stepsUI($('#g4st'),[
   {t:'صِل الجهد المستمر',x:'مع القلب الحديدي اضغط «صِل الجهد»: يرتفع التيار تدريجياً ولا يصل إلى V/R فوراً (ص 180).',done:()=>md==='dc'&&core==='fe'&&sw&&i>0.95*TP.v.V/TP.v.R},
   {t:'افصل الجهد',x:'اضغط «افصل الجهد»: لا يهبط التيار إلى الصفر فوراً بل يتناقص تدريجياً عبر الثنائي D.',done:()=>md==='dc'&&did.off&&!sw&&i<0.05*TP.v.V/TP.v.R},
   {t:'قلب هوائي',x:'اختر «قلب هوائي» وكرر الوصل: الحث صغير فيكاد التيار يصل إلى قيمته فوراً.',done:()=>md==='dc'&&core==='air'&&sw},
   {t:'تيار متردد',x:'اختر «تيار متردد» مع القلب الحديدي: التيار صغير ومتأخر عن الجهد.',done:()=>md==='ac'&&core==='fe'},
   {t:'غيّر التردد',x:'اختر «قلب هوائي» وحرّك التردد من 1 إلى 200 Hz: كلما زاد التردد صغر التيار وزاد تأخره.',done:()=>md==='ac'&&core==='air'&&(did.fmax||0)>=150},
   {t:'الملف اللولبي',x:'اضغط «هيّج الملف» ثم «افصل»: يُسحب الغواص للداخل ثم يعيده النابض (الشكل ٦-٢١).',done:()=>did.aon&&did.aoff&&pp<0.05}
  ]);
  ui();
  loopOn(el,dt=>{t+=dt;
   if(md==='dc'){const tau=L()/TP.v.R,iss=sw?TP.v.V/TP.v.R:0;i=iss+(i-iss)*Math.exp(-dt/Math.max(tau,1e-9));if(Math.abs(i-iss)<1e-12)i=iss;
    hist.push([t,i]);while(hist.length&&hist[0][0]<t-5)hist.shift();const Imax=TP.v.V/TP.v.R;
    $('#g4c').innerHTML=cktSVG(sw||i>Imax*0.01,false);
    $('#g4p').innerHTML=plotSVG({w:620,h:240,x0:0,x1:5,y0:0,y1:Imax*1.15,xt:[0,1,2,3,4,5],xf:v=>fm(v-5),yt:[0,Imax/2,Imax],yf:v=>fm(sig(v,3)),left:56,xl:'t (s)',yl:'i (A)',series:[{pts:hist.map(p=>[p[0]-t+5,p[1]]),col:'--live',w:2.4}],extra:(X,Y)=>`<path d="M${X(0)} ${fx(Y(Imax))}H${X(5)}" stroke="var(--muted)" stroke-dasharray="5 4"/>`+S.t(X(5)-4,Y(Imax)-6,'V/R','m','end'),aria:'التيار مع الزمن'});
    $('#g4f2').innerHTML=fact('التيار i','d1')+fact('القيمة النهائية V/R','d2')+fact('جهد الحث الذاتي المعاكس','d3')+fact('ثابت الزمن τ = L/R (توضيح)','d4');
    $('#d1').textContent=eng(i,'A');$('#d2').textContent=eng(Imax,'A');$('#d3').textContent=eng(sw?TP.v.V-TP.v.R*i:-TP.v.R*i,'V');$('#d4').textContent=eng(tau,'s');
    $('#g4n').textContent=sw?(i<0.99*Imax?'التيار يتزايد تدريجياً: جهد الحث الذاتي يعارض الزيادة.':'استقر التيار: لا تغير ⇐ لا جهد حث ذاتي.'):(i>0.01*Imax?'التيار يتناقص تدريجياً: جهد الحث الذاتي يعارض النقص (يمر في الثنائي D).':'لا تيار.')}
   pp+=((act?1:0)-pp)*Math.min(1,dt*8);if(Math.abs(pp-(act?1:0))<0.002)pp=act?1:0;$('#g4s').innerHTML=solActSVG(pp,act);$('#g4sn').textContent=act?'الملف مهيج: المجال يسحب الغواص الحديدي إلى داخله.':'الملف غير مهيج: النابض يعيد الغواص إلى وضعه الأصلي.';
   steps.check()});
 },
 examples:[
  {title:'تمرين 1 — إجابة مقترحة (ليست من الكتاب)',ref:'ص 181',q:'<p>تيار 20 mA في ملف 6000 لفة على قلب حديدي (مقطع <span class="ltr">0.8×10⁻⁴ m²</span>، طول المسار 0.15 m، μᵣ = 800) به فجوة هوائية 0.75 mm. احسب كثافة الفيض (يهمل التقوس).</p>',
   given:[{id:'N',label:'عدد اللفات',sym:'N',unit:'',value:6000},{id:'I',label:'التيار',sym:'I',unit:'mA',value:20},{id:'A',label:'المساحة (× 10⁻⁴)',sym:'A',unit:'m²',value:0.8},{id:'l',label:'طول المسار في الحديد',sym:'\\ell_i',unit:'m',value:0.15},{id:'mr',label:'النفاذية النسبية',sym:'\\mu_r',unit:'',value:800},{id:'g',label:'الفجوة',sym:'\\ell_g',unit:'mm',value:0.75}],
   solve:g=>{const F=g.N*g.I/1000,A=g.A*1e-4,Ri=g.l/(MU0*g.mr*A),Rg=g.g/1000/(MU0*A),p=F/(Ri+Rg),b=p/A;return [{t:'',f:`NI=${g.N}\\times${g.I}\\times10^{-3}`,v:sig(F,4),unit:'AT'},
    {t:'ممانعة الحديد والفجوة (6-5):',f:`\\Re_i=\\frac{\\ell_i}{\\mu_0\\mu_rA}\\qquad \\Re_g=\\frac{\\ell_g}{\\mu_0A}`,v:sci(Ri,3)+' ; '+sci(Rg,3),unit:'AT/Wb'},
    {t:'(6-9):',f:`\\phi=\\frac{NI}{\\Re_i+\\Re_g}`,v:sci(p,3),unit:'Wb'},{t:'',f:`B=\\frac{\\phi}{A}`,v:B.round(b,3),unit:'T',dp:3,final:true}]}},
  {title:'تمرين 2 — إجابة مقترحة (ليست من الكتاب)',ref:'ص 181–182',q:'<p>الساق الوسطى 500 لفة ومقطعها 800 mm² وبها فجوة 1 mm، والساقان الجانبيتان مقطعهما 500 mm². التيار اللازم لفيض 1.3 mWb في الساق الوسطى. <span class="sub">افتراضاتنا: طول كل مسار 300 mm يشمل الساق الوسطى (120 mm)؛ قيم H تُقرأ من منحنى المادة في الشكل (3) — القيم الافتراضية هنا قراءتنا التقريبية لمنحنى «الصلب الطري»، غيّرها بقراءتك.</span></p>',
   given:[{id:'p',label:'الفيض في الساق الوسطى',sym:'\\Phi',unit:'mWb',value:1.3},{id:'Ac',label:'مقطع الساق الوسطى',sym:'',unit:'mm²',value:800},{id:'As',label:'مقطع الساق الجانبية',sym:'',unit:'mm²',value:500},{id:'g',label:'الفجوة',sym:'\\ell_g',unit:'mm',value:1},{id:'lc',label:'طول الساق الوسطى',sym:'',unit:'mm',value:120},{id:'lp',label:'طول المسار الكامل',sym:'',unit:'mm',value:300},{id:'Hc',label:'H للساق الوسطى (من المنحنى)',sym:'',unit:'A/m',value:4700},{id:'Hs',label:'H للساق الجانبية (من المنحنى)',sym:'',unit:'A/m',value:850},{id:'N',label:'عدد اللفات',sym:'N',unit:'',value:500}],
   solve:g=>{const Bc=g.p*1e-3/(g.Ac*1e-6),Bs=g.p/2*1e-3/(g.As*1e-6),ATg=Bc/MU0*g.g/1000,ATc=g.Hc*(g.lc-g.g)/1000,ATs=g.Hs*(g.lp-g.lc)/1000,T=ATg+ATc+ATs;return [
    {t:'الساق الوسطى:',f:`B_c=\\frac{${g.p}\\times10^{-3}}{${g.Ac}\\times10^{-6}}`,v:B.round(Bc,3),unit:'T',dp:3},{t:'كل ساق جانبية تحمل نصف الفيض:',f:`B_s=\\frac{${g.p/2}\\times10^{-3}}{${g.As}\\times10^{-6}}`,v:B.round(Bs,3),unit:'T',dp:3},
    {t:'الفجوة:',f:`AT_g=\\frac{B_c}{\\mu_0}\\ell_g`,v:Math.round(ATg),unit:'AT'},{t:'حديد الساق الوسطى:',f:`AT_c=${g.Hc}\\times(${g.lc}-${g.g})\\times10^{-3}`,v:Math.round(ATc),unit:'AT'},{t:'الساق الجانبية:',f:`AT_s=${g.Hs}\\times(${g.lp}-${g.lc})\\times10^{-3}`,v:Math.round(ATs),unit:'AT'},
    {t:'KVL على حلقة واحدة (التماثل):',f:`I=\\frac{AT_g+AT_c+AT_s}{N}=\\frac{${Math.round(T)}}{${g.N}}`,v:B.round(T/g.N,2),unit:'A',dp:2,final:true}]}},
  {title:'تمرين 3 — إجابة مقترحة (ليست من الكتاب)',ref:'ص 182',q:'<p>محول على قلب ثلاثي السيقان (الشكل 4): الابتدائي 100 لفة على A والثانوي 50 لفة على B، μᵣ = 2000، I₂ = 20 A، B العظمى في الساق C = 0.6 T. <span class="sub">افتراضاتنا: قوة الثانوي تعاكس فيض الساق B، والفجوة 0.4 cm تضاف إلى طول C الحديدي 5 cm، و ΦA = ΦB + ΦC.</span></p>',
   given:[{id:'N1',label:'لفات الابتدائي',sym:'N_1',unit:'',value:100},{id:'N2',label:'لفات الثانوي',sym:'N_2',unit:'',value:50},{id:'I2',label:'التيار الثانوي',sym:'I_2',unit:'A',value:20},{id:'Bc',label:'كثافة الفيض في C',sym:'B_C',unit:'T',value:0.6},{id:'mr',label:'النفاذية النسبية',sym:'\\mu_r',unit:'',value:2000},{id:'Aab',label:'مقطع A و B',sym:'',unit:'cm²',value:12},{id:'Ac',label:'مقطع C',sym:'',unit:'cm²',value:24},{id:'lab',label:'طول مسار A (= B)',sym:'',unit:'cm',value:15},{id:'lc',label:'طول مسار C',sym:'',unit:'cm',value:5},{id:'g',label:'الفجوة',sym:'',unit:'cm',value:0.4}],
   solve:g=>{const mu=MU0*g.mr,RA=g.lab/100/(mu*g.Aab*1e-4),RC=g.lc/100/(mu*g.Ac*1e-4)+g.g/100/(MU0*g.Ac*1e-4),pC=g.Bc*g.Ac*1e-4,pB=(RC*pC-g.N2*g.I2)/RA,pA=pB+pC,I1=(RA*pA+RC*pC)/g.N1,BB=pB/(g.Aab*1e-4);
    const out=[{t:'الممانعات:',f:`\\Re_A=\\Re_B=\\frac{\\ell_A}{\\mu_0\\mu_rA_A}\\qquad \\Re_C=\\frac{\\ell_C}{\\mu_0\\mu_rA_C}+\\frac{\\ell_g}{\\mu_0A_C}`,v:sci(RA,3)+' ; '+sci(RC,4),unit:'AT/Wb'},
     {t:'',f:`\\Phi_C=B_CA_C\\qquad \\Re_C\\Phi_C`,v:Math.round(RC*pC),unit:'AT'},{t:'حلقة B–C:',f:`\\Phi_B=\\frac{\\Re_C\\Phi_C-N_2I_2}{\\Re_B}`,v:sci(pB,3),unit:'Wb'},{t:'',f:'\\Phi_A=\\Phi_B+\\Phi_C',v:sci(pA,3),unit:'Wb'},
     {t:'حلقة A–C:',f:`I_1=\\frac{\\Re_A\\Phi_A+\\Re_C\\Phi_C}{N_1}`,v:B.round(I1,2),unit:'A',dp:2,final:true}];
    if(Math.abs(BB)>2)out.push({t:`<b>تنبيه:</b> كثافة الفيض في الساق B = ${fm(sig(BB,3))} T — أكبر بكثير من حد التشبع (نحو 2 T). المعطيات لا تتسق مع نموذج نفاذية ثابتة؛ ارجع إلى المدرب.`});return out}},
  {title:'تمرين 3 — حل بديل بافتراض أن التيار الثانوي 40 A (افتراض منا — ليس من الكتاب)',ref:'ص 182',q:'<p>محول على قلب ثلاثي السيقان (الشكل 4): الابتدائي 100 لفة على A والثانوي 50 لفة على B، μᵣ = 2000، I₂ = <b>40 A بدل 20 A</b> (افتراض منا لأن أرقام التمرين متعارضة)، B العظمى في الساق C = 0.6 T. <span class="sub">افتراضاتنا: قوة الثانوي تعاكس فيض الساق B، والفجوة 0.4 cm تضاف إلى طول C الحديدي 5 cm، و ΦA = ΦB + ΦC.</span></p>',
   given:[{id:'N1',label:'لفات الابتدائي',sym:'N_1',unit:'',value:100},{id:'N2',label:'لفات الثانوي',sym:'N_2',unit:'',value:50},{id:'I2',label:'التيار الثانوي',sym:'I_2',unit:'A',value:40},{id:'Bc',label:'كثافة الفيض في C',sym:'B_C',unit:'T',value:0.6},{id:'mr',label:'النفاذية النسبية',sym:'\\mu_r',unit:'',value:2000},{id:'Aab',label:'مقطع A و B',sym:'',unit:'cm²',value:12},{id:'Ac',label:'مقطع C',sym:'',unit:'cm²',value:24},{id:'lab',label:'طول مسار A (= B)',sym:'',unit:'cm',value:15},{id:'lc',label:'طول مسار C',sym:'',unit:'cm',value:5},{id:'g',label:'الفجوة',sym:'',unit:'cm',value:0.4}],
   solve:g=>{const mu=MU0*g.mr,RA=g.lab/100/(mu*g.Aab*1e-4),RC=g.lc/100/(mu*g.Ac*1e-4)+g.g/100/(MU0*g.Ac*1e-4),pC=g.Bc*g.Ac*1e-4,pB=(RC*pC-g.N2*g.I2)/RA,pA=pB+pC,I1=(RA*pA+RC*pC)/g.N1,BB=pB/(g.Aab*1e-4);
    const out=[{t:'الممانعات:',f:`\\Re_A=\\Re_B=\\frac{\\ell_A}{\\mu_0\\mu_rA_A}\\qquad \\Re_C=\\frac{\\ell_C}{\\mu_0\\mu_rA_C}+\\frac{\\ell_g}{\\mu_0A_C}`,v:sci(RA,3)+' ; '+sci(RC,4),unit:'AT/Wb'},
     {t:'',f:`\\Phi_C=B_CA_C\\qquad \\Re_C\\Phi_C`,v:Math.round(RC*pC),unit:'AT'},{t:'حلقة B–C:',f:`\\Phi_B=\\frac{\\Re_C\\Phi_C-N_2I_2}{\\Re_B}`,v:sci(pB,3),unit:'Wb'},{t:'',f:'\\Phi_A=\\Phi_B+\\Phi_C',v:sci(pA,3),unit:'Wb'},
     {t:'حلقة A–C:',f:`I_1=\\frac{\\Re_A\\Phi_A+\\Re_C\\Phi_C}{N_1}`,v:B.round(I1,2),unit:'A',dp:2,final:true}];
    if(Math.abs(BB)>2)out.push({t:`<b>تنبيه:</b> كثافة الفيض في الساق B = ${fm(sig(BB,3))} T — أكبر بكثير من حد التشبع (نحو 2 T). المعطيات لا تتسق مع نموذج نفاذية ثابتة؛ ارجع إلى المدرب.`});return out}},
 ],
 quiz:[
  {q:'الملف ذو القلب الهوائي حثه الذاتي:',o:['كبير جداً','صغير','يصل إلى 10 H','لا نهائي'],c:1,e:'ص 176.'},
  {q:'لماذا يُصنع القلب الحديدي من شرائح معزولة؟',o:['لزيادة الوزن','لمقاومة التيارات الدوامية وتقليل الحرارة والفقد','لزيادة التيارات الدوامية','لتقليل عدد اللفات'],c:1,e:'ص 177.'},
  {q:'ميزة قلب الفيرايت:',o:['مقاومته الكهربية منخفضة جداً','مقاومته الكهربية عالية جداً فلا تسري فيه التيارات الإعصارية','لا يتمغنط','رخيص فقط'],c:1,e:'ص 178.'},
  {q:'ملفات التردد العالي (أكثر من 2 MHz) قلبها عادة:',o:['حديدي','هوائي','من الشرائح','من النحاس'],c:1,e:'ص 178.'},
  {q:'عند توصيل ملف بجهد مستمر فإن التيار:',o:['يصل لقيمته العظمى فوراً','يتزايد تدريجياً','يبقى صفراً','يتذبذب'],c:1,e:'ص 180.'},
  {q:'عند فصل الجهد المستمر عن ملف يمر فيه تيار:',o:['يصبح التيار صفراً فوراً','يتناقص التيار تدريجياً لأن جهد الحث الذاتي يعارض النقص','يزيد التيار','ينعكس التيار فوراً'],c:1,e:'ص 180.'},
  {q:'في الملف اللولبي الكهروميكانيكي من نوع السحب، عند تهييج الملف:',o:['يُدفع الغواص للخارج','يُسحب الغواص إلى داخل الملف','لا يتحرك شيء','يدور الغواص'],c:1,e:'ص 180 والشكل (٦-٢١).'},
  {q:'رمز الملف ذي القلب الحديدي في الشكل (٦-٢٠):',o:['أقواس فقط','أقواس فوقها خطان متصلان','أقواس فوقها خطان متقطعان','أقواس يخترقها سهم'],c:1,e:'ص 179.'}
 ]
});
})(PLCBOOK);
