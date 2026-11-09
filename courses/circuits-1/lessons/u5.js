/* دوائر كهربائية-1 — الوحدة الخامسة: المغناطيسية الكهربائية (ص 123–156)
   Lessons u5-l1 … u5-l5 (source: /home/claude/c4/ex/c1_d.md lessons 1–5). */
(function(B){
const {S}=B;
/* «اكتشف العطل» و«تحدي المحاكاة» (challenge.js): chF و chOn دائماً false خارج وضع التحدي، و chOut لا يفعل شيئاً خارجه
   chOut: قراءات بوحدات ثابتة في عنصر مخفي يقرؤها نشاط «تحدي المحاكاة» (نفس ما تعرضه أجهزة المختبر) */
const chF=f=>!!(B.chF&&B.chF(f)),chOn=()=>!!(B.chOn&&B.chOn());
const chOut=(el,id,rows)=>{if(!chOn())return;let d=el.querySelector('#'+id);if(!d){d=document.createElement('div');d.id=id;d.hidden=true;el.appendChild(d)}d.innerHTML=rows.map(r=>`<div><span>${r[0]}</span><b>${typeof r[1]==='number'&&isFinite(r[1])?r[1].toFixed(6):'—'}</b></div>`).join('')};
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

/* ======================================================================
   Lesson u5-l1 — مدخل المغناطيسية (ص 123–129)
   ====================================================================== */
const NC='var(--stop)',SC='var(--lamp-off)';
/* small magnet (domain) centred at (x,y), angle a (rad), N half red pointing along a */
function miniMag(x,y,a,w,h){w=w||30;h=h||12;return `<g transform="translate(${fx(x)} ${fx(y)}) rotate(${fx(a/D)})"><rect x="0" y="${-h/2}" width="${w/2}" height="${h}" fill="${NC}" stroke="var(--fg)" stroke-width=".8"/><rect x="${-w/2}" y="${-h/2}" width="${w/2}" height="${h}" fill="${SC}" stroke="var(--fg)" stroke-width=".8"/></g>`}
function fig51(){let s=`<svg viewBox="0 0 520 210" role="img" aria-label="تقسيم المغناطيسات">`;
  const bar=(x,y,w)=>barSVG(x,y,w,30,false);
  s+=bar(100,14,320);s+=bar(70,86,170)+bar(280,86,170);s+=bar(70,160,80)+bar(170,160,80);s+=arT(370,182,'… وهكذا حتى الذرة',{fs:13,col:'--muted'});
  return s+'</svg>'}
const DOM_ANG=[38,-120,75,160,-30,110,-75,20,-160,135,-45,95];
function domainSVG(sx,W){W=W||640;const cx=W/2,cy=86;let s=`<svg viewBox="0 0 ${W} 172" role="img" aria-label="العزوم المغناطيسية الذرية">`;
  s+=`<rect x="${cx-150}" y="${cy-66}" width="300" height="132" rx="8" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.4"/>`;
  const op=clamp(sx,0,1);
  s+=`<g opacity="${fx(0.15+0.85*op)}"><rect x="${cx-250}" y="${cy-60}" width="70" height="120" fill="${NC}" stroke="var(--fg)"/>${S.t(cx-215,cy+6,'N','',null,18)}<rect x="${cx+180}" y="${cy-60}" width="70" height="120" fill="${SC}" stroke="var(--fg)"/>${S.t(cx+215,cy+6,'S','',null,18)}</g>`;
  if(op>0.02)for(let k=0;k<4;k++){const y=cy-48+k*32;s+=arrow(cx-176,y,cx+176,y,'--blue',1.2).replace(/stroke="var\(--blue\)"/,`stroke="var(--blue)" opacity="${fx(op*0.6)}"`)}
  for(let r=0;r<3;r++)for(let c=0;c<4;c++){const i=r*4+c,a=DOM_ANG[i]*D*(1-op);s+=miniMag(cx-105+c*70,cy-40+r*40,a)}
  return s+'</svg>'}
function fig52(){return `<div class="mg-figs"><figure>${box(domainSVG(0,480).replace('viewBox="0 0 480 172"','viewBox="60 0 360 172"'),360)}<figcaption>(أ) قبل وضع المادة في المجال الخارجي</figcaption></figure><figure>${box(domainSVG(1,520),400)}<figcaption>(ب) بعد وضعها في المجال الخارجي</figcaption></figure></div>`}
/* fig 5-3: bar and horseshoe magnets with traced lines */
function fig53(){const W=640,H=300;let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="خطوط المجال حول مغناطيس قضيبي ومغناطيس على شكل حدوة">`;
  const a=[{t:'q',x:160,y:100,q:1,ang:90*D},{t:'q',x:160,y:200,q:-1,ang:-90*D}];const L1=magnetLines(a,{n:14,bounds:[0,0,320,H]});
  s+=`<path d="${L1.d}" fill="none" stroke="var(--on)" stroke-width="1.5"/>${L1.hd.replace(/--blue/g,'--on')}`+barSVG(146,96,28,108,false,true);
  const b=[{t:'q',x:440,y:120,q:1,ang:90*D},{t:'q',x:520,y:120,q:-1,ang:90*D}];const L2=magnetLines(b,{n:13,a0:40,a1:300,bounds:[320,0,W,H]});
  s+=`<path d="${L2.d}" fill="none" stroke="var(--on)" stroke-width="1.5"/>${L2.hd.replace(/--blue/g,'--on')}`;
  s+=`<path d="M426 116V250Q426 280 456 280H504Q534 280 534 250V116H506V244Q506 252 498 252H462Q454 252 454 244V116Z" fill="var(--surface-2)" stroke="var(--fg)"/><rect x="426" y="116" width="28" height="34" fill="${NC}" stroke="var(--fg)"/><rect x="506" y="116" width="28" height="34" fill="${SC}" stroke="var(--fg)"/>`+S.t(440,138,'N','')+S.t(520,138,'S','');
  return s+'</svg>'}
/* fig 5-4: inclined wire, current I and circular B lines */
function wire3D(x1,y1,x2,y2,up,lab){let s='';const mx=(x1+x2)/2,my=(y1+y2)/2,a=Math.atan2(y2-y1,x2-x1);
  [[-46,22],[0,34],[46,46]].forEach(([o,r],k)=>{const cx=mx+o*Math.cos(a),cy=my+o*Math.sin(a);s+=`<ellipse cx="${fx(cx)}" cy="${fx(cy)}" rx="${r}" ry="${fx(r*0.36)}" transform="rotate(${fx(a/D+90)} ${fx(cx)} ${fx(cy)})" fill="none" stroke="var(--stop)" stroke-width="1.8"/>`;
   const t=(up?1:-1);const px=cx+r*Math.cos(a+PI/2)*0.98,py=cy+r*Math.sin(a+PI/2)*0.98;s+=head(px,py,a+(t>0?0:PI),'--stop',6)});
  s+=`<path d="M${x1} ${y1}L${x2} ${y2}" stroke="var(--on)" stroke-width="9" stroke-linecap="round"/><circle cx="${x1}" cy="${y1}" r="6" fill="var(--live)"/><circle cx="${x2}" cy="${y2}" r="6" fill="var(--live)"/>`;
  s+=S.t(x1-12,y1+16,up?'+':'−','',null,18)+S.t(x2+14,y2-6,up?'−':'+','',null,18);
  const ux=Math.cos(a),uy=Math.sin(a);const q=up?1:-1;s+=arrow(mx-ux*22*q+18,my-uy*22*q+14,mx+ux*22*q+18,my+uy*22*q+14,'--blue',2.4)+S.t(mx+30,my+34,'I','b')+`<text class="txt" x="${fx(mx+58)}" y="${fx(my-30)}" font-size="15" style="fill:var(--stop)">B</text>`;
  return s+arT(mx,y1+42,lab,{fs:13})}
function fig54(){return `<svg viewBox="0 0 560 250" role="img" aria-label="المجال حول سلك مستقيم وانعكاسه بعكس التيار">${wire3D(40,190,230,40,false,'(ب)')}${wire3D(320,190,510,40,true,'(أ)')}</svg>`}
/* fig 5-5: top view, iron filings + compasses around a vertical wire */
function fig55(){let s=`<svg viewBox="0 0 600 230" role="img" aria-label="برادة الحديد وإبر البوصلة حول سلك يمر به تيار">`;
  const one=(cx,I,lbl)=>{const src=[{t:'w',x:cx,y:112,I}];let g=filings(src,cx-95,20,cx+95,205,11,Math.abs(I)/40,(x,y)=>Math.hypot(x-cx,y-112)<14);
    [[0,-62],[62,0],[0,62],[-62,0]].forEach(([dx,dy])=>{const [bx,by]=fieldAt(src,cx+dx,112+dy);g+=compassSVG(cx+dx,112+dy,Math.atan2(by,bx),'',12)});
    g+=wireDot(cx,112,I,9)+arT(cx,226,lbl,{fs:12.5});return g};
  s+=one(100,-4,'(أ) التيار نازل في السلك (⊗)')+one(300,-4,'(ب) «+» في الأعلى: التيار نازل')+one(500,4,'(ب) «−» في الأعلى: التيار صاعد');
  return s+'</svg>'}

B.lesson({
 id:'u5-l1',unit:5,order:1,pages:'123–129',
 title:'مدخل المغناطيسية: المغناطيس والمجال وخطوط القوى',
 summary:'ما المغناطيسية الكهربائية؟ المغناطيس الطبيعي والمغناطيسات الذرية، المغناطيس الكهربائي، المجال المغناطيسي وتمثيله بخطوط القوى، والمجال الدائري حول سلك يحمل تياراً كما تظهره برادة الحديد والبوصلة.',
 stations:[
  {intro:true},

  {st:1,short:'أهداف الوحدة',title:'الوحدة الخامسة: ماذا سنتعلم؟',ref:'ص 124',
   q:'دوائر التيار المتردد التي ستدرسها لاحقاً مليئة بالملفات… فلماذا نبدأ بالمغناطيس قبل التيار المتردد؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="لوح أهداف فيه ستة أهداف تفصيلية للوحدة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><rect x="92" y="44" width="176" height="236" rx="14" fill="#F1EBDD" stroke="#2C4A40" stroke-width="4"/><rect x="140" y="30" width="80" height="28" rx="8" fill="#2C4A40"/><text x="180" y="88" text-anchor="middle" font-size="15" font-weight="700" fill="#2C4A40" direction="rtl" unicode-bidi="embed">الأهداف التفصيلية</text><g data-tip="الهدف الأول: أساسيات المغناطيسية الطبيعية وطريقة تصنيف المواد مغناطيسياً (الدرسان الأول والثاني)."><rect x="112" y="104" width="136" height="24" fill="transparent"/><rect x="222" y="108" width="18" height="18" rx="4" fill="#4FB3A9"/><path d="M226 117l4 4 7-8" stroke="#FBF6EE" stroke-width="2.5" fill="none"/><line x1="120" y1="117" x2="210" y2="117" stroke="#CFC6B4" stroke-width="7" stroke-linecap="round"/></g><g data-tip="الهدف الثاني: الكميات المغناطيسية ووحداتها، مثل الفيض ⟦Wb⟧ وكثافة الفيض ⟦T⟧."><rect x="112" y="132" width="136" height="24" fill="transparent"/><rect x="222" y="136" width="18" height="18" rx="4" fill="#4FB3A9"/><path d="M226 145l4 4 7-8" stroke="#FBF6EE" stroke-width="2.5" fill="none"/><line x1="120" y1="145" x2="200" y2="145" stroke="#CFC6B4" stroke-width="7" stroke-linecap="round"/></g><g data-tip="الهدف الثالث: العلاقة بين الكميات المغناطيسية (مثل ⟦B = μH⟧)."><rect x="112" y="160" width="136" height="24" fill="transparent"/><rect x="222" y="164" width="18" height="18" rx="4" fill="#4FB3A9"/><path d="M226 173l4 4 7-8" stroke="#FBF6EE" stroke-width="2.5" fill="none"/><line x1="120" y1="173" x2="210" y2="173" stroke="#CFC6B4" stroke-width="7" stroke-linecap="round"/></g><g data-tip="الهدف الرابع: حساب شدة المجال المغناطيسي والفيض المغناطيسي."><rect x="112" y="188" width="136" height="24" fill="transparent"/><rect x="222" y="192" width="18" height="18" rx="4" fill="#4FB3A9"/><path d="M226 201l4 4 7-8" stroke="#FBF6EE" stroke-width="2.5" fill="none"/><line x1="120" y1="201" x2="195" y2="201" stroke="#CFC6B4" stroke-width="7" stroke-linecap="round"/></g><g data-tip="الهدف الخامس: القوى الكهرومغناطيسية والآثار المغناطيسية للتيار الكهربائي (الدرس الثالث)."><rect x="112" y="216" width="136" height="24" fill="transparent"/><rect x="222" y="220" width="18" height="18" rx="4" fill="#4FB3A9"/><path d="M226 229l4 4 7-8" stroke="#FBF6EE" stroke-width="2.5" fill="none"/><line x1="120" y1="229" x2="210" y2="229" stroke="#CFC6B4" stroke-width="7" stroke-linecap="round"/></g><g data-tip="الهدف السادس: الحثية الذاتية والتبادلية (الدرسان الرابع والخامس)."><rect x="112" y="244" width="136" height="24" fill="transparent"/><rect x="222" y="248" width="18" height="18" rx="4" fill="#4FB3A9"/><path d="M226 257l4 4 7-8" stroke="#FBF6EE" stroke-width="2.5" fill="none"/><line x1="120" y1="257" x2="200" y2="257" stroke="#CFC6B4" stroke-width="7" stroke-linecap="round"/></g><text x="180" y="306" text-anchor="middle" font-size="14" font-weight="600" fill="#2C4A40" direction="rtl" unicode-bidi="embed">ستة أهداف تفصيلية</text></svg>`,
   cap:'الأهداف التفصيلية الستة للوحدة الخامسة.<br><b>مرّر المؤشر على أي سطر في اللوح (أو المسه في الجوال) لتعرف الهدف.</b>',
   side:[
    {book:String.raw`<p><b>الهدف العام للوحدة:</b> معرفة أساسيات الكهرومغناطيسية اللازمة لفهم دوائر وقياسات التيار المتردد.</p>`,ref:'ص 124'},
    {predict:{q:'حسب الهدف العام، لماذا ندرس الكهرومغناطيسية في هذا المقرر؟',opts:[
     ['لأنها لازمة لفهم دوائر وقياسات التيار المتردد',true,'هذا هو الهدف العام كما في ص 124: الملفات والمحولات وأجهزة القياس كلها تعتمد على المغناطيسية.'],
     ['لأنها تحل محل قانون أوم في الدوائر',false,'قانون أوم يبقى كما هو؛ الكهرومغناطيسية تضيف فهماً جديداً ولا تلغيه.'],
     ['لأنها خاصة بالمغانط الطبيعية فقط',false,'الوحدة تدرس المغناطيس الطبيعي والمجال الناتج عن التيار معاً، والهدف هو التيار المتردد.']]}}
   ],
   body:[
    {book:String.raw`<p><b>الأهداف التفصيلية:</b></p><ol><li>أن يعرف المتدرب أساسيات المغناطيسية الطبيعية وطريقة تصنيف المواد من وجهة النظر المغناطيسي.</li><li>أن يعرف المتدرب الكميات المغناطيسية ووحداتها.</li><li>أن يعرف المتدرب العلاقة بين الكميات المغناطيسية.</li><li>أن يتمكن المتدرب من حساب شدة المجال المغناطيسي و الفيض المغناطيسي.</li><li>أن يعرف المتدرب القوى الكهرومغناطيسية والآثار المغناطيسية للتيار الكهربائي.</li><li>أن يعرف المتدرب الحثية الذاتية والتبادلية.</li></ol>`,ref:'ص 124'},
    {tip:String.raw`<p>دروس الوحدة هنا خمسة: (1) هذا المدخل: المغناطيس والمجال، (2) الفيض والنفاذية وشدة المجال، (3) المجال حول سلك والقوى على الموصلات، (4) الحث الذاتي والمتبادل وتوصيل الملفات، (5) قانونا فارادي ولينز وتمارين الوحدة.</p>`,title:'خريطة الوحدة'}
   ]},

  {st:2,short:'المغناطيسية الكهربائية',title:'المغناطيسية الكهربائية: حقلان لا يفترقان',ref:'ص 125',
   q:'الشحنة الساكنة تصنع حقلاً كهربائياً… فماذا يحدث حولها إذا بدأت تتحرك؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="شحنة ساكنة حولها حقل كهربائي، وشحنة متحركة حولها حقل مغناطيسي دائري" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><g data-tip="خطوط الحقل الكهربائي: تخرج من الشحنة الموجبة الساكنة في كل الاتجاهات."><g stroke="#2C4A40" stroke-width="2.5"><line x1="128" y1="150" x2="150" y2="150"/><line x1="128" y1="150" x2="150" y2="150" transform="rotate(45 98 150)"/><line x1="128" y1="150" x2="150" y2="150" transform="rotate(90 98 150)"/><line x1="128" y1="150" x2="150" y2="150" transform="rotate(135 98 150)"/><line x1="128" y1="150" x2="150" y2="150" transform="rotate(180 98 150)"/><line x1="128" y1="150" x2="150" y2="150" transform="rotate(225 98 150)"/><line x1="128" y1="150" x2="150" y2="150" transform="rotate(270 98 150)"/><line x1="128" y1="150" x2="150" y2="150" transform="rotate(315 98 150)"/></g><g fill="#2C4A40"><polygon points="158,150 149,145 149,155"/><polygon points="158,150 149,145 149,155" transform="rotate(45 98 150)"/><polygon points="158,150 149,145 149,155" transform="rotate(90 98 150)"/><polygon points="158,150 149,145 149,155" transform="rotate(135 98 150)"/><polygon points="158,150 149,145 149,155" transform="rotate(180 98 150)"/><polygon points="158,150 149,145 149,155" transform="rotate(225 98 150)"/><polygon points="158,150 149,145 149,155" transform="rotate(270 98 150)"/><polygon points="158,150 149,145 149,155" transform="rotate(315 98 150)"/></g></g><g data-tip="شحنة كهربائية ساكنة (موجبة هنا): ينشأ عنها حقل كهربائي فقط، وقوتها على الشحنات الأخرى يحددها قانون كولوم."><circle cx="98" cy="150" r="22" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5"/><path d="M88 150h20M98 140v20" stroke="#FBF6EE" stroke-width="4"/></g><g data-tip="الحقل المغناطيسي: حلقات تحيط بالشحنة المتحركة، ولا يظهر إلا عندما تتحرك الشحنة."><ellipse cx="262" cy="150" rx="40" ry="13" fill="none" stroke="#3A7CA5" stroke-width="3"/><ellipse cx="262" cy="150" rx="62" ry="21" fill="none" stroke="#3A7CA5" stroke-width="3"/><polygon points="256,137 266,132 266,142" fill="#3A7CA5"/><polygon points="252,129 262,124 262,134" fill="#3A7CA5"/></g><g data-tip="اتجاه حركة الشحنة: الشحنات المتحركة معاً تكوّن التيار الكهربائي."><line x1="262" y1="214" x2="262" y2="88" stroke="#F2C14E" stroke-width="6" stroke-linecap="round"/><polygon points="262,72 251,92 273,92" fill="#F2C14E" stroke="#2C4A40" stroke-width="1.5"/></g><g data-tip="شحنة كهربائية متحركة ضمن تيار: ينشأ عنها حقل مغناطيسي يحيط بها (إضافة إلى حقلها الكهربائي)."><circle cx="262" cy="150" r="14" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/></g><text x="98" y="236" text-anchor="middle" font-size="14" font-weight="700" fill="#2C4A40" direction="rtl" unicode-bidi="embed">شحنة ساكنة</text><text x="98" y="256" text-anchor="middle" font-size="12.5" fill="#2C4A40" direction="rtl" unicode-bidi="embed">حقل كهربائي</text><text x="262" y="236" text-anchor="middle" font-size="14" font-weight="700" fill="#2C4A40" direction="rtl" unicode-bidi="embed">شحنة متحركة</text><text x="262" y="256" text-anchor="middle" font-size="12.5" fill="#2C4A40" direction="rtl" unicode-bidi="embed">حقل مغناطيسي</text><text x="180" y="298" text-anchor="middle" font-size="14" font-weight="600" fill="#2C4A40" direction="rtl" unicode-bidi="embed">الحقل الكهرومغناطيسي = الاثنان معاً</text></svg>`,
   cap:'يسار: شحنة ساكنة وحقلها الكهربائي. يمين: شحنة متحركة وحولها حلقات الحقل المغناطيسي.<br><b>مرّر المؤشر على الشحنتين والأسهم والحلقات (أو المسه في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>الكهرومغناطيسية (المغناطيسية الكهربائية) وهي العلاقة بين المغناطيس والكهرباء أو بتعبير آخر الكهرومغناطيسية هي فيزياء الحقل (المجال) الكهرومغناطيسي أي إنها فرع الفيزياء الذي يدرس الحقل الكهرومغناطيسي الذي يتألف بدوره من <b>حقل كهربائي</b> و <b>حقل مغناطيسي</b>.</p>`,ref:'ص 125'},
    {predict:{q:'شحنة كهربائية ساكنة لا تتحرك. ماذا ينشأ حولها؟',opts:[
     ['حقل مغناطيسي فقط',false,'الحقل المغناطيسي يحتاج شحنة متحركة أو مغناطيساً، والشحنة هنا ساكنة.'],
     ['حقلان: كهربائي ومغناطيسي',false,'الحقل المغناطيسي لا يظهر إلا عندما تتحرك الشحنة ضمن تيار.'],
     ['حقل كهربائي فقط',true,'الكتاب: ينشأ الحقل الكهربائي عن الشحنات الساكنة، أما المغناطيسي فعن المغانط والشحنات المتحركة.']]}}
   ],
   body:[
    {book:String.raw`<p>ينشأ الحقل الكهربائي عن الشحنات الكهربائية الساكنة التي تسبب القوى الكهربائية المسؤولة عن الكهرباء الساكنة و المحددة بقانون كولوم. تقود هذه الحقول الكهربائية أيضاً إلى سريان التيار الكهربائي في الموصلات الكهربائية. أما الحقل المغناطيسي فهو ينتج عن المغانط المختلفة إضافة للشحنات الكهربائية المتحركة، فعندما تسير شحنة كهربائية ضمن تيار كهربائي ينشأ عنها حقل مغناطيسي محيط بها. لذلك يصعب فصل هذين الحقلين عن بعضهما البعض في الكثير من الحالات.</p>`,ref:'ص 125'},
    {tip:String.raw`<p>«الحقل» و«المجال» كلمتان لمعنى واحد، والكتاب يستعمل الاثنتين. السلسلة باختصار: شحنة ساكنة ← حقل كهربائي. شحنة متحركة (تيار) ← حقل كهربائي <b>وحقل مغناطيسي</b>. لذلك كل سلك يمر فيه تيار يصنع حوله مجالاً مغناطيسياً، وهذا ما ستراه في المحطة السابعة.</p>`,title:'الفكرة في سطرين'},
    {add:String.raw`<p>الضوء وموجات الراديو وإشارة الجوال والواي فاي كلها «موجات كهرومغناطيسية»: حقل كهربائي وحقل مغناطيسي يتغيران معاً وينتقلان في الفضاء. هذا مثال على أن الحقلين لا يفترقان.</p>`,title:'من حولك'}
   ]},

  {st:3,short:'المغناطيس الطبيعي',title:'المغناطيس الطبيعي: مغناطيسات صغيرة داخل المادة',ref:'ص 125–126',
   q:'لو كسرت مغناطيساً إلى نصفين… هل تحصل على قطب شمالي وحده في يد وقطب جنوبي وحده في اليد الأخرى؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="قضيب مغناطيسي يُكسر إلى نصفين ثم إلى أربع قطع، وكل قطعة لها قطب شمالي وجنوبي" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="قضيب مغناطيسي واحد: قطبه الشمالي ⟦N⟧ (الأحمر) وقطبه الجنوبي ⟦S⟧ (الرمادي)."><rect x="70" y="62" width="110" height="36" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5"/><rect x="180" y="62" width="110" height="36" fill="#C9D3CE" stroke="#2C4A40" stroke-width="2.5"/><text x="125" y="86" text-anchor="middle" font-size="16" font-weight="700" fill="#FBF6EE" font-family="var(--mono)">N</text><text x="235" y="86" text-anchor="middle" font-size="16" font-weight="700" fill="#2C4A40" font-family="var(--mono)">S</text></g><g data-tip="بعد الكسر إلى نصفين: مغناطيسان كاملان، لكل منهما قطب شمالي ⟦N⟧ وقطب جنوبي ⟦S⟧."><rect x="70" y="138" width="50" height="34" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5"/><rect x="120" y="138" width="50" height="34" fill="#C9D3CE" stroke="#2C4A40" stroke-width="2.5"/><rect x="190" y="138" width="50" height="34" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5"/><rect x="240" y="138" width="50" height="34" fill="#C9D3CE" stroke="#2C4A40" stroke-width="2.5"/><text x="95" y="161" text-anchor="middle" font-size="14" font-weight="700" fill="#FBF6EE" font-family="var(--mono)">N</text><text x="145" y="161" text-anchor="middle" font-size="14" font-weight="700" fill="#2C4A40" font-family="var(--mono)">S</text><text x="215" y="161" text-anchor="middle" font-size="14" font-weight="700" fill="#FBF6EE" font-family="var(--mono)">N</text><text x="265" y="161" text-anchor="middle" font-size="14" font-weight="700" fill="#2C4A40" font-family="var(--mono)">S</text></g><g data-tip="بعد كسر آخر: أربعة مغناطيسات كاملة. ولو استمر الكسر حتى الذرة لوجدنا أن الذرة نفسها مغناطيس صغير (المغناطيسات الذرية)."><rect x="70" y="212" width="22" height="30" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><rect x="92" y="212" width="22" height="30" fill="#C9D3CE" stroke="#2C4A40" stroke-width="2"/><rect x="128" y="212" width="22" height="30" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><rect x="150" y="212" width="22" height="30" fill="#C9D3CE" stroke="#2C4A40" stroke-width="2"/><rect x="188" y="212" width="22" height="30" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><rect x="210" y="212" width="22" height="30" fill="#C9D3CE" stroke="#2C4A40" stroke-width="2"/><rect x="246" y="212" width="22" height="30" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><rect x="268" y="212" width="22" height="30" fill="#C9D3CE" stroke="#2C4A40" stroke-width="2"/></g><path d="M180 104v26M180 178v26" stroke="#2C4A40" stroke-width="2.5" stroke-dasharray="5 4"/><polygon points="180,136 174,126 186,126" fill="#2C4A40"/><polygon points="180,210 174,200 186,200" fill="#2C4A40"/><text x="180" y="280" text-anchor="middle" font-size="14" font-weight="600" fill="#2C4A40" direction="rtl" unicode-bidi="embed">كل قطعة مغناطيس كامل</text></svg>`,
   cap:'تقسيم المغناطيسات كما في الشكل (٥-١): الأحمر قطب شمالي والرمادي قطب جنوبي.<br><b>مرّر المؤشر على كل صف (أو المسه في الجوال) لتعرف ما حدث فيه.</b>',
   side:[
    {book:String.raw`<p>إذا كسرنا قضيباً مغناطيسياً نتج لدينا مغناطيسان لكل منهما قطب شمالي و قطب جنوبي، و يمكن عن طريق التكسير المتتالي تقسيم المغناطيس إلى أي عدد كبير من المغناطيسات الشكل (٥-١). و يمكن أن نتصور استمرار هذه العملية حتى أصغر جسيم، و هو الذرة، لنصل إلى افتراض أن الذرة أيضاً مغناطيس له قطب شمالي و قطب جنوبي. و على ذلك فإن المغناطيس يتكون من عدد كبير من المغناطيسات المفردة الصغيرة، و هي ما تسمى <b>بالمغناطيسات الذرية</b> أو المغناطيسات الجزيئية.</p>`,ref:'ص 125'},
    {predict:{q:'كسرنا مغناطيساً قضيبياً إلى نصفين. ماذا نحصل؟',opts:[
     ['قطب شمالي منفرد وقطب جنوبي منفرد',false,'لا يمكن فصل القطبين: كل قطعة ناتجة يظهر فيها قطبان جديدان عند مكان الكسر.'],
     ['مغناطيسان كاملان، لكل منهما قطب شمالي وجنوبي',true,'هذا ما يقوله الكتاب ويبينه الشكل (٥-١)، ويستمر حتى الذرة.'],
     ['قطعتان فقدتا المغناطيسية',false,'المغناطيسية لا تزول بالكسر؛ لأنها موجودة في كل ذرة من ذرات المادة.']]}}
   ],
   body:[
    {book:String.raw`<p>تتألف جميع المواد من ذرات بها نواة موجبة الشحنة تدور حولها إلكترونات سالبة الشحنة فحركة هذه الشحنات السالبة تكون تيارات كهربائية صغيرة مما يتسبب في إحداث مجال مغناطيسي ذري له <b>عزم مغناطيسي ذري</b>.</p>
     <p>وفي حالة عدم وجود أي مجال مغناطيسي خارجي تكون التيارات الصغيرة في اتجاهات مختلفة عشوائية كما في الشكل (٥-٢أ) مما يتسبب في إحداث مجالات مغناطيسية ذرية محددة في حجم الذرة و محصلة التيارات و العزوم المغناطيسية في المادة تلغي بعضها بعضاً و بذلك لا يظهر أي أثر للمجال المغناطيسي. و يشذ عن هذه الحالة <b>المغناطيس الدائم</b>.</p>
     <p>أما إذا وضعت المادة في مجال مغناطيسي خارجي، حثه \(B\)، فإن القوة المغناطيسية المؤثرة على الشحنات المتحركة تغير من اتجاه مدار الإلكترونات في الذرات و مسار التيار للإلكترونات الحرة في المعادن، ولذلك يتولد مجال مغناطيسي يكون اتجاهه <b>مع</b> اتجاه المجال الخارجي كما في حال المواد <b>البارامغناطيسية</b> كما في الشكل (٥-٢ب) أو <b>عكس</b> اتجاه المجال الخارجي كما في حالة المواد <b>الدايامغناطيسية</b>.</p>`,ref:'ص 126'},
    {tip:String.raw`<p>تخيّل فصلاً فيه طلاب كل واحد ينظر في اتجاه: لا يوجد اتجاه «عام» للفصل. هذا حال المغناطيسات الذرية في قطعة حديد عادية (الشكل ٥-٢أ)، فلا يظهر لها أثر. عندما يدخل المجال الخارجي تنتظم الذرات في اتجاهه (الشكل ٥-٢ب) فيظهر الأثر. حرّك منزلق «شدة المجال الخارجي» في لوحة «المغناطيسات الذرية» في تبويب المختبر لترى ذلك.</p>`,title:'لماذا لا تجذب قطعة الحديد العادية شيئاً؟'},
    {predict:{q:'مادة دايامغناطيسية وُضعت في مجال مغناطيسي خارجي. اتجاه المجال الذي يتولد فيها يكون:',opts:[
     ['مع اتجاه المجال الخارجي',false,'هذا سلوك المواد البارامغناطيسية (الشكل ٥-٢ب).'],
     ['عمودياً على المجال الخارجي',false,'الكتاب يذكر حالتين فقط: مع الاتجاه أو عكسه.'],
     ['عكس اتجاه المجال الخارجي',true,'الكتاب: يتولد مجال عكس اتجاه المجال الخارجي كما في حالة المواد الدايامغناطيسية (ص 126).']]}}
   ]},

  {st:4,short:'المغناطيس الكهربائي',title:'المغناطيس الكهربائي: مغناطيس له مفتاح',ref:'ص 127',
   q:'مغناطيس الثلاجة يبقى ممغنطاً دائماً… فكيف نصنع مغناطيساً نشغّله ونطفئه متى أردنا؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="قضيب حديدي ملفوف حوله سلك بلفات كثيرة متصل ببطارية" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><g data-tip="قضيب حديدي داخل الملف: يتحول إلى مغناطيس مؤقت ما دام التيار يمر في الملف، فيقوى المجال كثيراً."><rect x="70" y="118" width="220" height="44" rx="6" fill="#9AA5A0" stroke="#2C4A40" stroke-width="2.5"/></g><g data-tip="ملف من السلك بعدد لفات كبير: كل لفة تضيف مجالها إلى مجال اللفات الأخرى، فيزداد التأثير المغناطيسي." fill="none" stroke="#B9852A" stroke-width="5" stroke-linecap="round"><path d="M100 110 L110 170"/><path d="M116 110 L126 170"/><path d="M132 110 L142 170"/><path d="M148 110 L158 170"/><path d="M164 110 L174 170"/><path d="M180 110 L190 170"/><path d="M196 110 L206 170"/><path d="M212 110 L222 170"/><path d="M228 110 L238 170"/><path d="M244 110 L254 170"/></g><g data-tip="سلكا التوصيل: ينقلان التيار من البطارية إلى الملف ثم يعيدانه إليها." fill="none" stroke="#2C4A40" stroke-width="3"><path d="M100 110 V92 H60 V250 H150"/><path d="M254 170 V196 H300 V250 H210"/></g><g data-tip="البطارية: مصدر التيار المستمر الذي يمر في الملف. إذا فُصل التيار زالت مغناطيسية القضيب الحديدي."><rect x="150" y="234" width="60" height="32" rx="5" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><rect x="210" y="242" width="6" height="16" fill="#2C4A40"/><text x="164" y="256" font-size="16" font-weight="700" fill="#2C4A40" font-family="var(--mono)">+</text><text x="186" y="256" font-size="16" font-weight="700" fill="#2C4A40" font-family="var(--mono)">−</text></g><g data-tip="طرفا القضيب مكشوفان: يصبح أحدهما قطباً شمالياً ⟦N⟧ والآخر جنوبياً ⟦S⟧ ما دام التيار يمر."><circle cx="56" cy="140" r="0" fill="none"/><text x="50" y="146" text-anchor="middle" font-size="18" font-weight="700" fill="#E8735A" font-family="var(--mono)">N</text><text x="310" y="146" text-anchor="middle" font-size="18" font-weight="700" fill="#2C4A40" font-family="var(--mono)">S</text></g><text x="180" y="300" text-anchor="middle" font-size="14" font-weight="600" fill="#2C4A40" direction="rtl" unicode-bidi="embed">ملف + قلب حديدي + تيار</text></svg>`,
   cap:'المغناطيس الكهربائي: ملف بلفات كثيرة حول قضيب حديدي، والتيار من البطارية.<br><b>مرّر المؤشر على القضيب واللفات والبطارية والقطبين (أو المسه في الجوال) لتعرف دور كل جزء.</b>',
   side:[
    {book:String.raw`<p>المغناطيس الكهربائي عبارة عن مغناطيس تتولد فيه المغناطيسية فقط بسبب تدفق تيار كهربائي خلال سلك ما. وعادة ما تُصنع المغناطيسات الكهربائية من <b>ملف من السلك بعدد لفات كبير</b> لزيادة التأثير المغناطيسي. ويُمكن زيادة المجال المغناطيسي الذي ينتجه الملف بوضع مادة مغناطيسية، كقضيب حديدي، داخل الملف. ويتسبب التيار المار خلال الملف في تحول الحديد إلى <b>مغناطيس مؤقت</b>.</p>`,ref:'ص 127'}
   ],
   body:[
    {predict:{q:'تريد مغناطيساً كهربائياً أقوى دون تغيير البطارية. ماذا تفعل حسب الكتاب؟',opts:[
     ['تقلل عدد لفات الملف',false,'العكس: الكتاب يقول إن اللفات الكثيرة تزيد التأثير المغناطيسي.'],
     ['تزيد عدد اللفات وتضع قضيباً حديدياً داخل الملف',true,'الطريقتان مذكورتان في ص 127: لفات كثيرة، ومادة مغناطيسية (قضيب حديدي) داخل الملف.'],
     ['تلف السلك حول قضيب بلاستيكي',false,'البلاستيك ليس مادة مغناطيسية، فلا يقوّي المجال كما يفعل الحديد.']]}},
    {tip:String.raw`<p>الكلمة المهمة هي «<b>مؤقت</b>»: الحديد داخل الملف يصبح مغناطيساً ما دام التيار يمر، ويفقد معظم مغناطيسيته عند فصل التيار. هذا الفرق بينه وبين المغناطيس الدائم (المحطة السابقة).</p>`},
    {add:String.raw`<p>جرس الباب القديم، والمرحّل (الريليه) في لوحات التحكم، والقفل الكهربائي للأبواب، وصمام الماء في الغسالة… كلها مغناطيسات كهربائية: ملف حول قلب حديدي يجذب قطعة معدنية عندما يمر التيار ويتركها عندما يُفصل.</p>`,title:'أين تجده؟'}
   ]},

  {st:5,short:'توليد مجال كهرومغناطيسي',title:'توليد مجال كهرومغناطيسي: رافعة الخردة',ref:'ص 127',
   q:'كيف ترفع رافعة واحدة سيارة كاملة دون خطاف ولا حبال… ثم تتركها في المكان الذي تريده؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="رافعة في ساحة خردة يتدلى منها مغناطيس كهربائي يحمل سيارة قديمة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><rect x="58" y="70" width="22" height="210" fill="#2C4A40"/><path d="M58 280 h70" stroke="#2C4A40" stroke-width="6" stroke-linecap="round"/><path d="M69 74 L262 54" stroke="#2C4A40" stroke-width="10" stroke-linecap="round"/><path d="M69 74 L120 118" stroke="#2C4A40" stroke-width="4"/><g data-tip="الكابل: يحمل المغناطيس ويوصل إليه التيار الكهربائي."><path d="M250 56 V128" stroke="#2C4A40" stroke-width="3"/><path d="M244 56 V128" stroke="#F2C14E" stroke-width="2" stroke-dasharray="4 3"/></g><g data-tip="مغناطيس كهربائي ضخم: ملف حول قلب حديدي. ما دام التيار يمر فيه يجذب السيارة الحديدية ويحملها."><rect x="206" y="128" width="84" height="26" rx="7" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5"/><path d="M216 141 h64" stroke="#FBF6EE" stroke-width="2" stroke-dasharray="6 4"/></g><g data-tip="سيارة قديمة من الحديد الخردة: الحديد مادة مغناطيسية فتنجذب إلى المغناطيس الكهربائي."><path d="M192 196 V176 Q194 168 204 166 L222 158 H268 L288 168 Q302 170 304 180 V196 Z" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><path d="M226 162 H262 L276 168 H218 Z" fill="#FBF6EE" stroke="#2C4A40" stroke-width="1.5"/><circle cx="214" cy="198" r="11" fill="#2C4A40"/><circle cx="282" cy="198" r="11" fill="#2C4A40"/><circle cx="214" cy="198" r="4" fill="#FBF6EE"/><circle cx="282" cy="198" r="4" fill="#FBF6EE"/></g><path d="M150 280 h150" stroke="#9AA5A0" stroke-width="6" stroke-linecap="round"/><text x="180" y="306" text-anchor="middle" font-size="14" font-weight="600" fill="#2C4A40" direction="rtl" unicode-bidi="embed">التيار يمر: السيارة مرفوعة</text></svg>`,
   cap:'رافعة الخردة التي يذكرها الكتاب: مغناطيس كهربائي يحمل سيارة قديمة.<br><b>مرّر المؤشر على المغناطيس والسيارة والكابل (أو المسه في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>عندما يمر تيار كهربائي خلال جزء من السلك فإنه يتولد مجال مغناطيسي حوله. وعند لف السلك حول قطعة من المعدن، مع ترك القطبين الشمالي والجنوبي مكشوفين يتمغنط المعدن، بحيث يصبح مغناطيسًا كهربائيًا. وعادة ما يستخدم تجار الحديد الخردة مغناطيسات كهربائية ضخمة لالتقاط السيارات القديمة، وعند فصل التيار الكهربائي عن المغناطيس فإنه يفقد قوته ويمكن إسقاط السيارة في مكان آخر.</p>`,ref:'ص 127'},
    {predict:{q:'الرافعة تحمل السيارة فوق المكان المطلوب. ماذا يفعل المشغّل ليتركها؟',opts:[
     ['يعكس اتجاه التيار في الملف',false,'عكس التيار يعكس القطبين فقط، والسيارة الحديدية تنجذب إلى أي قطب؛ فتبقى معلقة.'],
     ['يفصل التيار عن المغناطيس',true,'الكتاب: عند فصل التيار يفقد المغناطيس قوته ويمكن إسقاط السيارة في مكان آخر.'],
     ['يزيد التيار في الملف',false,'زيادة التيار تقوّي المغناطيس فتزيد قوة الإمساك بالسيارة.']]}}
   ],
   body:[
    {title:'شغّل المغناطيس وافصله',widget:(el,B)=>{
      let on=true;
      const draw=()=>{const y=on?0:96;
       el.querySelector('[data-v]').innerHTML=`<svg viewBox="0 0 320 250" role="img" aria-label="${on?'المغناطيس يعمل والسيارة مرفوعة':'المغناطيس مفصول والسيارة على الأرض'}" style="font-family:var(--font);max-width:360px;display:block;margin:auto"><path d="M160 0V40" stroke="#2C4A40" stroke-width="3"/><rect x="116" y="40" width="88" height="26" rx="7" fill="${on?'#E8735A':'#C9D3CE'}" stroke="#2C4A40" stroke-width="2.5"/>${on?'<path d="M126 74l-6 8M160 74v9M194 74l6 8" stroke="#E8735A" stroke-width="2.5" stroke-linecap="round"/>':''}<g transform="translate(0 ${y})"><path d="M104 110V90Q106 82 116 80L134 72H180L200 82Q214 84 216 94V110Z" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/><circle cx="126" cy="112" r="11" fill="#2C4A40"/><circle cx="194" cy="112" r="11" fill="#2C4A40"/></g><path d="M40 220H280" stroke="#9AA5A0" stroke-width="6" stroke-linecap="round"/><text x="160" y="244" text-anchor="middle" font-size="14" font-weight="700" fill="#2C4A40" direction="rtl" unicode-bidi="embed">${on?'التيار يمر: الحديد ممغنط والسيارة معلقة':'التيار مفصول: فقد المغناطيس قوته فسقطت السيارة'}</text></svg>`;
       el.querySelector('[data-t]').textContent=on?'افصل التيار':'أعد توصيل التيار'};
      el.innerHTML=`<p class="sub" style="margin:0 0 8px">اضغط الزر وراقب السيارة: المغناطيس الكهربائي يعمل ما دام التيار يمر فقط.</p><div data-v></div><div class="w-row"><button class="btn pri" type="button" data-t></button></div>`;
      el.querySelector('[data-t]').onclick=()=>{on=!on;draw()};draw();
    }},
    {watch:String.raw`<p>عند إعادة توصيل التيار لن «تقفز» السيارة من الأرض إلى المغناطيس؛ في الواقع يُنزل المشغّل المغناطيس حتى يلامس الخردة ثم يوصل التيار ويرفعها. الرسم مبسّط.</p>`}
   ]},

  {st:6,short:'المجال المغناطيسي',title:'المجال المغناطيسي وخطوط القوى',ref:'ص 127–128',
   q:'المغناطيس يجذب المسمار من بعيد دون أن يلمسه… فكيف نرسم «المنطقة» التي يصل إليها أثره؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مغناطيس قضيبي تخرج خطوط المجال من قطبه الشمالي وتدخل قطبه الجنوبي، وبوصلتان على الخطوط" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><g data-tip="خطوط القوى المغناطيسية: تخرج من القطب الشمالي ⟦N⟧ وتدخل القطب الجنوبي ⟦S⟧ خارج المغناطيس." fill="none" stroke="#3A7CA5" stroke-width="2.5"><path d="M122 152 C 92 100, 268 100, 238 152"/><path d="M122 150 C 72 70, 288 70, 238 150"/><path d="M122 148 C 52 40, 308 40, 238 148"/><path d="M122 168 C 92 220, 268 220, 238 168"/><path d="M122 170 C 72 250, 288 250, 238 170"/><path d="M122 172 C 52 280, 308 280, 238 172"/><path d="M118 160 H 48"/><path d="M312 160 H 242"/></g><g data-tip="سهم على الخط: يبين اتجاه المجال ⟦B⟧ عند تلك النقطة (من الشمالي إلى الجنوبي خارج المغناطيس)." fill="#3A7CA5"><polygon points="187,113 177,108 177,118"/><polygon points="187,90 177,85 177,95"/><polygon points="187,68 177,63 177,73"/><polygon points="187,207 177,202 177,212"/><polygon points="187,230 177,225 177,235"/><polygon points="187,252 177,247 177,257"/><polygon points="62,160 72,155 72,165"/><polygon points="268,160 278,155 278,165"/></g><g data-tip="المغناطيس القضيبي: قطبه الشمالي ⟦N⟧ (الأحمر) وقطبه الجنوبي ⟦S⟧ (الرمادي)."><rect x="120" y="142" width="60" height="36" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5"/><rect x="180" y="142" width="60" height="36" fill="#C9D3CE" stroke="#2C4A40" stroke-width="2.5"/><text x="150" y="166" text-anchor="middle" font-size="16" font-weight="700" fill="#FBF6EE" font-family="var(--mono)">N</text><text x="210" y="166" text-anchor="middle" font-size="16" font-weight="700" fill="#2C4A40" font-family="var(--mono)">S</text></g><g data-tip="إبرة بوصلة على الخط: طرفها الأحمر (الشمالي) يشير في اتجاه المماس لخط القوى، أي اتجاه المجال ⟦B⟧ في مكانها."><circle cx="234" cy="215" r="15" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><polygon points="243.4,207.5 236.5,218.1 231.5,211.9" fill="#E8735A"/><polygon points="224.6,222.5 236.5,218.1 231.5,211.9" fill="#9AA5A0"/></g><g data-tip="بوصلة على محور المغناطيس قرب القطب الشمالي: طرفها الأحمر يشير بعيداً عن ⟦N⟧ لأن الخطوط تخرج منه."><circle cx="86" cy="160" r="15" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><polygon points="72,160 88,156 88,164" fill="#E8735A"/><polygon points="100,160 84,156 84,164" fill="#9AA5A0"/></g><text x="180" y="304" text-anchor="middle" font-size="14" font-weight="600" fill="#2C4A40" direction="rtl" unicode-bidi="embed">الخطوط تخرج من N وتدخل S</text></svg>`,
   cap:'خطوط القوى حول مغناطيس قضيبي كما في الشكل (٥-٣)، وإبر البوصلة تتجه مع الخطوط.<br><b>مرّر المؤشر على الخطوط والأسهم والبوصلتين (أو المسه في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>المجال (الحقل) المغناطيسي هي قوة مغناطيسية تنشأ في الحيز المحيط بالجسم المغناطيسي أو الموصل الذي يمر به تيار كهربائي؛ أو بتعبير أبسط يمكن وصفها بأنها <b>المنطقة المحيطة بالمغناطيس ويظهر فيها أثره</b> (على مواد معينة). فإذا وضعت إبرة بوصلة في المجال المغناطيسي ذو قوة ما فإنها توجه نفسها في اتجاه معين في كل جزء من المجال، والخطوط المرسومة في اتجاه الإبرة عند النقط المختلفة تحدد الوضع العام للخطوط التي هي عليها القوة المغناطيسية في المجال.</p>`,ref:'ص 127'}
   ],
   body:[
    {book:String.raw`<p>ويمكن تمثيل المجال المغناطيسي <b>بخطوط القوى المغناطيسية</b> الشكل (٥-٣) بحيث تكون كثافة الخطوط لكل وحدة مساحات من عنصر مساحة عمودية على اتجاه خطوط القوى وهي مقدار المجال المغناطيسي. ويكون اتجاه المماس لخط القوى عند أية نقطة عليه معطياً اتجاه المجال المغناطيسي \(B\) عند تلك النقطة.</p>`,ref:'ص 127–128'},
    {predict:{q:'نقطة تقع على أحد خطوط القوى. كيف نعرف اتجاه المجال \\(B\\) عندها؟',opts:[
     ['نأخذ اتجاه المماس لخط القوى عند تلك النقطة',true,'الكتاب: اتجاه المماس لخط القوى عند أية نقطة عليه يعطي اتجاه المجال B عندها.'],
     ['نأخذ الاتجاه العمودي على الخط',false,'العمودي على الخط يستعمل لقياس الكثافة (عدد الخطوط لكل وحدة مساحة)، لا لتحديد الاتجاه.'],
     ['المجال يتجه دائماً نحو مركز المغناطيس',false,'خارج المغناطيس يتجه المجال من N إلى S على طول الخط، وليس نحو المركز.']]}},
    {tip:String.raw`<p>الخطوط ترسم شيئين في وقت واحد: <b>الاتجاه</b> (المماس للخط، وتتبعه إبرة البوصلة)، و<b>المقدار</b> (كثافة الخطوط: قرب القطبين تتزاحم الخطوط فيكون المجال أقوى، وبعيداً عنهما تتباعد فيضعف).</p>`,title:'ماذا يخبرنا الرسم؟'},
    {add:String.raw`<p>إذا نثرت برادة حديد على ورقة فوق مغناطيس وطرقت الورقة برفق، تترتب البرادة على شكل هذه الخطوط تماماً. جرّب ذلك في تبويب المختبر: اختر «برادة حديد» واسحب البوصلة حول المغناطيس.</p>`,title:'تراها بعينك'}
   ]},

  {st:7,short:'المجال حول سلك',title:'المجال المغناطيسي حول موصل مستقيم يحمل تياراً مستمراً',ref:'ص 128–129',
   q:'سلك نحاسي عادي لا يجذب الحديد… فلماذا تنحرف إبرة البوصلة بجانبه عندما يمر فيه تيار؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="منظر من أعلى: سلك يخرج تياره من الورقة وحوله دوائر المجال وبوصلتان مماسيتان" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><g data-tip="خطوط المجال: دوائر مركزها السلك. تتقارب قرب السلك (مجال أقوى) وتتباعد كلما ابتعدنا عنه (مجال أضعف)." fill="none" stroke="#3A7CA5" stroke-width="2.5"><circle cx="180" cy="150" r="30"/><circle cx="180" cy="150" r="52"/><circle cx="180" cy="150" r="82"/><circle cx="180" cy="150" r="120"/></g><g data-tip="اتجاه المجال على الدوائر: مع التيار الخارج من الورقة ⟦⊙⟧ يدور المجال عكس عقارب الساعة كما تراه من أعلى." fill="#3A7CA5"><polygon points="170,120 180,115 180,125"/><polygon points="170,98 180,93 180,103"/><polygon points="170,68 180,63 180,73"/><polygon points="170,30 180,25 180,35"/></g><g data-tip="مقطع السلك: الرمز ⟦⊙⟧ يعني أن التيار خارج من الورقة نحوك. ولو كان داخلاً فيها لرُسم ⟦⊗⟧."><circle cx="180" cy="150" r="13" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><circle cx="180" cy="150" r="4" fill="#2C4A40"/></g><g data-tip="إبرة بوصلة يمين السلك: تأخذ اتجاه المماس للدائرة، وطرفها الأحمر يشير إلى أعلى هنا."><circle cx="262" cy="150" r="15" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><polygon points="262,137 258,151 266,151" fill="#E8735A"/><polygon points="262,163 258,149 266,149" fill="#9AA5A0"/></g><g data-tip="إبرة بوصلة يسار السلك: على الدائرة نفسها، لكن طرفها الأحمر يشير إلى أسفل؛ لأن المجال يلتف حول السلك."><circle cx="98" cy="150" r="15" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><polygon points="98,163 94,149 102,149" fill="#E8735A"/><polygon points="98,137 94,151 102,151" fill="#9AA5A0"/></g><text x="180" y="300" text-anchor="middle" font-size="14" font-weight="600" fill="#2C4A40" direction="rtl" unicode-bidi="embed">منظر من أعلى الورقة</text></svg>`,
   cap:'سلك يخترق الورقة ويخرج تياره نحوك، وحوله دوائر المجال وإبرتا بوصلة.<br><b>مرّر المؤشر على السلك والدوائر والأسهم والبوصلتين (أو المسه في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>عند وضع قطعة مغناطيس صغيرة بالقرب من سلك يحمل تيارا نرى أن المغناطيس يصبح تحت تأثير قوة شبيهة بالقوة التي تظهر بين قطبين مغناطيسيين. و بهذا فإن السلك الحامل للتيار يسلك سلوك قطب مغناطيسي و يؤثر في قطعة المغناطيس المجاورة له. فنقول عن قطعة المغناطيس بأنها واقعة في المجال المغناطيسي الناشئ عن مرور التيار في السلك و نمثل المجال المغناطيسي الذي يولده التيار <b>بخطوط دائرية مركزها السلك</b> و يكون الاتجاه المحدد على الخطوط هو اتجاه القوة المؤثرة في قطب شمالي مجاور للسلك وكما هو موضح في الشكل (٥-٤أ) و <b>ينعكس اتجاه خطوط المجال عند عكس اتجاه التيار</b> الشكل (٥-٤ب).</p>`,ref:'ص 128'}
   ],
   body:[
    {predict:{q:'عكسنا اتجاه التيار في السلك (صار داخلاً في الورقة ⊗). ماذا يحدث لإبرتي البوصلة؟',opts:[
     ['لا تتغيران؛ الدوائر لم تتغير',false,'شكل الدوائر لا يتغير، لكن اتجاهها ينعكس، والإبرة تتبع الاتجاه.'],
     ['تنقلب كل منهما فيشير طرفها الأحمر إلى الجهة المعاكسة',true,'الكتاب: ينعكس اتجاه خطوط المجال عند عكس اتجاه التيار (الشكل ٥-٤ب)، فتنقلب الإبرتان.'],
     ['تتجه الإبرتان نحو السلك',false,'الإبرة تبقى مماسية للدائرة دائماً؛ لا تتجه نحو السلك.']]}},
    {book:String.raw`<p>ويمكن مشاهدة توزيع المجال المغناطيسي بنثر برادة حديد على ورقة يمر خلالها سلك يمر به تيار كهربائي الشكل (٥-٥أ) أو على ورقة موضوعة على قضيب مغناطيسي.</p>
     <p>تتمثل القوة أو شدة المجال المغناطيسي بكثافة الخطوط التي تقطع مساحة متر مربع متعامدة معها. <b>فكلما اقتربنا من السلك ازدادت القوة أو شدة المجال</b> و بذلك ازدادت كثافة الخطوط و أصبحت الدوائر متقاربة. في حين أن المسافة تزداد بين الدوائر و تقل كثافة الخطوط عند الابتعاد عن السلك.</p>`,ref:'ص 129'},
    {watch:String.raw`<p>في الكتاب جاءت العبارة «برادة حديد على ورقة موضوعة على قضيب مغناطيسي الشكل (٥-٥أ)»، لكن الرسم (أ) يبين سلكاً يخترق الورقة وحوله البرادة في دوائر، وليس قضيباً مغناطيسياً. رتبنا العبارة لتطابق الرسم.</p>`,fix:true},
    {tip:String.raw`<p>عنوان هذه الفقرة في الكتاب يذكر «قاعدة اليد اليمنى»، ونص القاعدة يأتي في الدرسين التاليين (ص 135 و138): <b>اقبض على السلك باليد اليمنى بحيث يشير الإبهام إلى اتجاه التيار، فتشير الأصابع الملتفة إلى اتجاه خطوط المجال.</b> جرّبها على الرسم: الإبهام نحوك (التيار خارج ⊙) فتلتف أصابعك عكس عقارب الساعة، كما تبين الأسهم.</p>`,title:'قاعدة اليد اليمنى'},
    {add:String.raw`<p>لهذا السبب لا يُنصح بوضع البوصلة قرب أسلاك الكهرباء أو بطارية السيارة عند قراءتها: التيار المار يصنع مجالاً يحرف الإبرة عن اتجاه الشمال.</p>`,title:'من الواقع'}
   ]},

  {recap:[
   String.raw`الحقل الكهرومغناطيسي حقلان: كهربائي من الشحنات الساكنة، ومغناطيسي من المغانط والشحنات المتحركة (ص 125).`,
   String.raw`المغناطيس مكوّن من مغناطيسات ذرية؛ عشوائية الاتجاه فلا يظهر أثرها، وتنتظم في المجال الخارجي: معه في المواد البارامغناطيسية وعكسه في الدايامغناطيسية (ص 125–126).`,
   String.raw`المغناطيس الكهربائي ملف بلفات كثيرة حول قلب حديدي؛ مغناطيس مؤقت يعمل ما دام التيار يمر (ص 127).`,
   String.raw`خطوط القوى تخرج من N وتدخل S، واتجاه المماس لها هو اتجاه \(B\)، وكثافتها مقدار المجال (ص 127–128).`,
   String.raw`حول السلك الذي يحمل تياراً دوائر مركزها السلك، تتقارب قربه وتتباعد بعيداً عنه، وينعكس اتجاهها بعكس التيار (ص 128–129).`]}
],
 theory:[
  {h:'الوحدة الخامسة: المغناطيسية الكهربائية',ref:'ص 123–124',html:`<p><b>الهدف العام للوحدة:</b> معرفة أساسيات الكهرومغناطيسية اللازمة لفهم دوائر وقياسات التيار المتردد.</p>
   <p><b>الأهداف التفصيلية:</b></p><ol><li>أن يعرف المتدرب أساسيات المغناطيسية الطبيعية وطريقة تصنيف المواد من وجهة النظر المغناطيسي.</li><li>أن يعرف المتدرب الكميات المغناطيسية ووحداتها.</li><li>أن يعرف المتدرب العلاقة بين الكميات المغناطيسية.</li><li>أن يتمكن المتدرب من حساب شدة المجال المغناطيسي والفيض المغناطيسي.</li><li>أن يعرف المتدرب القوى الكهرومغناطيسية والآثار المغناطيسية للتيار الكهربائي.</li><li>أن يعرف المتدرب الحثية الذاتية والتبادلية.</li></ol>
   <p class="sub">دروس الوحدة: (1) هذا المدخل، (2) الفيض والنفاذية وشدة المجال، (3) المجال حول سلك والقوى على الموصلات، (4) الحث الذاتي والمتبادل وتوصيل الملفات، (5) قانونا فارادي ولنز وتمارين الوحدة.</p>`},
  {h:'المغناطيسية الكهربائية',ref:'ص 125',html:`<p>الكهرومغناطيسية (المغناطيسية الكهربائية) هي العلاقة بين المغناطيس والكهرباء، أو بتعبير آخر هي فيزياء الحقل (المجال) الكهرومغناطيسي، أي إنها فرع الفيزياء الذي يدرس الحقل الكهرومغناطيسي الذي يتألف بدوره من <b>حقل كهربائي</b> و<b>حقل مغناطيسي</b>.</p>
   <ul><li>ينشأ الحقل الكهربائي عن الشحنات الكهربائية الساكنة التي تسبب القوى الكهربائية المسؤولة عن الكهرباء الساكنة والمحددة بقانون كولوم، وتقود هذه الحقول أيضاً إلى سريان التيار الكهربائي في الموصلات.</li>
   <li>أما الحقل المغناطيسي فينتج عن المغانط المختلفة إضافة للشحنات الكهربائية المتحركة: فعندما تسير شحنة كهربائية ضمن تيار كهربائي ينشأ عنها حقل مغناطيسي محيط بها.</li></ul>
   <p>لذلك يصعب فصل هذين الحقلين عن بعضهما في الكثير من الحالات.</p>`},
  {h:'المغناطيس الطبيعي',ref:'ص 125–126',html:`<p>إذا كسرنا قضيباً مغناطيسياً نتج لدينا مغناطيسان لكل منهما قطب شمالي وقطب جنوبي، ويمكن عن طريق التكسير المتتالي تقسيم المغناطيس إلى أي عدد كبير من المغناطيسات (الشكل ٥-١). ويمكن أن نتصور استمرار هذه العملية حتى أصغر جسيم وهو الذرة، لنصل إلى أن الذرة أيضاً مغناطيس له قطب شمالي وقطب جنوبي. وعلى ذلك فإن المغناطيس يتكون من عدد كبير من المغناطيسات المفردة الصغيرة، وهي ما تسمى <b>بالمغناطيسات الذرية</b> أو المغناطيسات الجزيئية.</p>`},
  {fig:'(٥-١)',ref:'ص 125',caption:'تقسيم المغناطيسات: كل قطعة ناتجة عن الكسر مغناطيس كامل له قطب شمالي N وقطب جنوبي S.',draw:()=>box(fig51(),480)},
  {html:`<p>تتألف جميع المواد من ذرات بها نواة موجبة الشحنة تدور حولها إلكترونات سالبة الشحنة، فحركة هذه الشحنات السالبة تكوّن تيارات كهربائية صغيرة مما يتسبب في إحداث مجال مغناطيسي ذري له <b>عزم مغناطيسي ذري</b>.</p>
   <p>في حالة عدم وجود أي مجال مغناطيسي خارجي تكون التيارات الصغيرة في اتجاهات مختلفة عشوائية كما في الشكل (٥-٢أ)، فتكون محصلة التيارات والعزوم المغناطيسية في المادة صفراً (تلغي بعضها بعضاً) ولا يظهر أي أثر للمجال المغناطيسي. ويشذ عن هذه الحالة <b>المغناطيس الدائم</b>.</p>
   <p>أما إذا وضعت المادة في مجال مغناطيسي خارجي حثه \\(B\\)، فإن القوة المغناطيسية المؤثرة على الشحنات المتحركة تغير من اتجاه مدار الإلكترونات في الذرات ومسار التيار للإلكترونات الحرة في المعادن، ولذلك يتولد مجال مغناطيسي يكون اتجاهه <b>مع</b> اتجاه المجال الخارجي كما في المواد <b>البارامغناطيسية</b> (الشكل ٥-٢ب)، أو <b>عكس</b> اتجاه المجال الخارجي كما في المواد <b>الدايامغناطيسية</b>.</p>`},
  {fig:'(٥-٢)',ref:'ص 126',caption:'أ- العزوم المغناطيسية في اتجاهات مختلفة عشوائية وذلك قبل وضعها في المجال المغناطيسي الخارجي. ب- العزوم بعد وضعها في المجال الخارجي.',draw:()=>fig52()},
  {h:'المغناطيس الكهربائي',ref:'ص 127',html:`<p>المغناطيس الكهربائي عبارة عن مغناطيس تتولد فيه المغناطيسية فقط بسبب تدفق تيار كهربائي خلال سلك ما. وعادة ما تُصنع المغناطيسات الكهربائية من <b>ملف من السلك بعدد لفات كبير</b> لزيادة التأثير المغناطيسي. ويمكن زيادة المجال الذي ينتجه الملف بوضع مادة مغناطيسية، كقضيب حديدي، داخل الملف، ويتسبب التيار المار في الملف في تحول الحديد إلى <b>مغناطيس مؤقت</b>.</p>`},
  {h:'توليد مجال كهرومغناطيسي',ref:'ص 127',html:`<p>عندما يمر تيار كهربائي خلال جزء من السلك فإنه يتولد مجال مغناطيسي حوله. وعند لف السلك حول قطعة من المعدن، مع ترك القطبين الشمالي والجنوبي مكشوفين، يتمغنط المعدن بحيث يصبح مغناطيساً كهربائياً. ويستخدم تجار الحديد الخردة مغناطيسات كهربائية ضخمة لالتقاط السيارات القديمة، وعند فصل التيار عن المغناطيس فإنه يفقد قوته ويمكن إسقاط السيارة في مكان آخر.</p>`},
  {h:'المجال المغناطيسي',ref:'ص 127–128',html:`<p>المجال (الحقل) المغناطيسي قوة مغناطيسية تنشأ في الحيز المحيط بالجسم المغناطيسي أو الموصل الذي يمر به تيار كهربائي؛ أو بتعبير أبسط: <b>المنطقة المحيطة بالمغناطيس ويظهر فيها أثره</b> (على مواد معينة). فإذا وضعت إبرة بوصلة في المجال فإنها توجه نفسها في اتجاه معين في كل جزء منه، والخطوط المرسومة في اتجاه الإبرة عند النقط المختلفة تحدد الوضع العام لخطوط القوة المغناطيسية في المجال.</p>
   <p>ويمكن تمثيل المجال المغناطيسي <b>بخطوط القوى المغناطيسية</b> (الشكل ٥-٣) بحيث تكون كثافة الخطوط لكل وحدة مساحة من عنصر مساحة عمودي على اتجاه خطوط القوى هي مقدار المجال المغناطيسي. ويكون اتجاه المماس لخط القوى عند أية نقطة عليه معطياً اتجاه المجال \\(B\\) عند تلك النقطة.</p>`},
  {fig:'(٥-٣)',ref:'ص 128',caption:'خطوط المجال حول مغناطيس قضيبي (يسار) ومغناطيس على شكل حدوة (يمين): تخرج من القطب الشمالي N وتدخل القطب الجنوبي S. (الخطوط هنا محسوبة رسماً.)',draw:()=>box(fig53(),600)},
  {h:'المجال المغناطيسي الناتج عن موصل مستقيم يحمل تياراً مستمراً',ref:'ص 128–129',html:`<p>عند وضع قطعة مغناطيس صغيرة بالقرب من سلك يحمل تياراً نرى أن المغناطيس يصبح تحت تأثير قوة شبيهة بالقوة التي تظهر بين قطبين مغناطيسيين، وبهذا فإن السلك الحامل للتيار يسلك سلوك قطب مغناطيسي ويؤثر في قطعة المغناطيس المجاورة له. فنقول إن قطعة المغناطيس واقعة في المجال المغناطيسي الناشئ عن مرور التيار في السلك.</p>
   <p>نمثل المجال الذي يولده التيار <b>بخطوط دائرية مركزها السلك</b>، ويكون الاتجاه المحدد على الخطوط هو اتجاه القوة المؤثرة في قطب شمالي مجاور للسلك كما في الشكل (٥-٤أ)، <b>وينعكس اتجاه خطوط المجال عند عكس اتجاه التيار</b> (الشكل ٥-٤ب).</p>`},
  {fig:'(٥-٤)',ref:'ص 128',caption:'(أ) التيار I في السلك من الطرف + نحو الطرف −، وحوله حلقات المجال B. (ب) عكس التيار يعكس اتجاه الحلقات.',draw:()=>box(fig54(),540)},
  {note:'<b>توضيح للمتدرب (ليس من الكتاب):</b> عنوان هذه الفقرة في الكتاب يذكر «قاعدة اليد اليمنى»، أما نص القاعدة فيأتي في ص 135 و138 (الدرسان التاليان): اقبض على السلك باليد اليمنى بحيث يشير الإبهام إلى اتجاه التيار، فتشير الأصابع الملتفة إلى اتجاه خطوط المجال. جرّبها الآن على الشكل (٥-٤).'},
  {html:`<p>ويمكن مشاهدة توزيع المجال المغناطيسي بنثر <b>برادة حديد</b> على ورقة يخترقها سلك يمر به تيار كهربائي (الشكل ٥-٥أ)، أو على ورقة موضوعة على قضيب مغناطيسي. تتجمع البرادة في دوائر حول السلك، وتأخذ إبر البوصلة الصغيرة اتجاه المماس لهذه الدوائر (الشكل ٥-٥ب).</p>
   <p>تتمثل القوة (شدة المجال المغناطيسي) بكثافة الخطوط التي تقطع مساحة متر مربع متعامدة معها: <b>فكلما اقتربنا من السلك ازدادت شدة المجال</b> وازدادت كثافة الخطوط وأصبحت الدوائر متقاربة، في حين أن المسافة تزداد بين الدوائر وتقل كثافة الخطوط عند الابتعاد عن السلك.</p>`},
  {fig:'(٥-٥)',ref:'ص 129',caption:'منظر من أعلى الورقة: البرادة تتجمع في دوائر حول السلك، وإبر البوصلة مماسية لها. عكس التيار يعكس اتجاه الإبر.',draw:()=>box(fig55(),600)},
  {err:`<div class="fixnote"><ol style="margin:4px 0 0;padding-inline-start:20px"><li>الهدف التفصيلي الرابع (ص 124) طُبع «منحساب» وصُحح في النص إلى «من حساب».</li>
   <li>ص 129: يقول النص «بنثر برادة حديد على ورقة موضوعة على قضيب مغناطيسي الشكل (٥-٥أ)»، لكن الرسم (أ) يبين سلكاً رأسياً يخترق الورقة وحوله البرادة في دوائر، وليس قضيباً مغناطيسياً. رتبنا العبارة لتطابق الرسم.</li>
   <li>عنوان الفقرة ص 128 يذكر «قاعدة اليد اليمنى» دون نص القاعدة هنا؛ النص في ص 135 و138.</li>
   <li>الشكل (٥-٢ب): رسمنا كل مغناطيس ذري بحيث يتجه قطبه الشمالي (الأحمر) مع اتجاه المجال الخارجي (من N إلى S)، وهو ما يصفه النص للمواد البارامغناطيسية.</li></ol></div>`}
 ],
 lab:(el)=>{
  let src='bar',pieces=1,view='lines',I=4,out=true,comp={x:300,y:84},dragged=false,ext=0,did={};
  el.innerHTML=`<div class="grid mg-lab">
   <div class="panel c7"><h2>خطوط المجال والبوصلة <small>مبنية على الأشكال (٥-١) و(٥-٣) و(٥-٤) و(٥-٥) ص 125–129</small></h2>
    <div class="svgbox mg-svg" id="f1v"></div>
    <p class="sub">اسحب البوصلة بإصبعك أو بالفأرة. الطرف الأحمر للإبرة هو قطبها الشمالي، ويشير في اتجاه المجال B عند مكانها. المقياس في حالة السلك: 1 cm لكل مربع صغير (10 بكسل).</p></div>
   <div class="panel c5"><h2>التحكم</h2>
    <div class="sub">مصدر المجال</div>${segHTML('src',[['bar','مغناطيس قضيبي'],['horse','حدوة حصان'],['wire','سلك يحمل تياراً']],src)}
    <div class="sub" style="margin-top:10px">طريقة العرض</div>${segHTML('vw',[['lines','خطوط القوى'],['fil','برادة حديد'],['both','الاثنان']],view)}
    <div id="f1bar"><div class="sub" style="margin-top:10px">اكسر المغناطيس (الشكل ٥-١)</div>${segHTML('pc',[[1,'قطعة واحدة'],[2,'نصفان'],[4,'أربع قطع']],pieces)}</div>
    <div id="f1wire"><div class="sub" style="margin-top:10px">اتجاه التيار</div>${segHTML('dir',[['out','خارج من الورقة ⊙'],['in','داخل في الورقة ⊗']],'out')}${sl('f1I','شدة التيار I',1,10,1,I)}</div>
    <div class="facts" id="f1f"></div><div class="mg-row"><span class="mg-chip ld" id="f1chip"></span></div></div>
   <div class="panel c12"><h2>المغناطيسات الذرية <small>الشكل (٥-٢) ص 126</small></h2>${sl('f1e','شدة المجال الخارجي',0,100,1,0)}<div class="svgbox" id="f1d" style="max-width:640px;margin-inline:auto"></div><p class="sub" id="f1dn"></p></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="f1st"></ol></div></div>`;
  const $=s=>el.querySelector(s);
  let scene=null;
  const build=()=>{const S2=[];let body='',lines='',Ns=[],Ss=[];
   if(src==='bar'){const Lm=240,h=40,g=28,lp=Lm/pieces,tot=Lm+(pieces-1)*g,x0=320-tot/2;
     for(let k=0;k<pieces;k++){const xl=x0+k*(lp+g);S2.push({t:'q',x:xl,y:200,q:1},{t:'q',x:xl+lp,y:200,q:-1});Ns.push([xl,200]);Ss.push([xl+lp,200]);body+=barSVG(xl,200-h/2,lp,h,false)}}
   else if(src==='horse'){S2.push({t:'q',x:270,y:160,q:1,ang:90*D},{t:'q',x:370,y:160,q:-1,ang:90*D});Ns.push([270,160]);Ss.push([370,160]);
     body=`<path d="M252 156V300Q252 336 288 336H352Q388 336 388 300V156H352V292Q352 302 342 302H298Q288 302 288 292V156Z" fill="var(--surface-2)" stroke="var(--fg)"/><rect x="252" y="156" width="36" height="40" fill="${NC}" stroke="var(--fg)"/><rect x="352" y="156" width="36" height="40" fill="${SC}" stroke="var(--fg)"/>`+S.t(270,182,'N','',null,15)+S.t(370,182,'S','',null,15)}
   else{S2.push({t:'w',x:320,y:200,I:out?I:-I});body=wireDot(320,200,out?1:-1,11)}
   const skip=(x,y)=>src==='bar'?(Math.abs(y-200)<24&&S2.some((s,i)=>i%2===0&&x>s.x-3&&x<S2[i+1].x+3)):src==='horse'?(x>248&&x<392&&y>152&&y<340&&!(x>292&&x<348&&y<300)):Math.hypot(x-320,y-200)<16;
   if(view!=='fil'){
     if(src==='wire'){let c='';for(let k=0;k<60;k++){const r=16*Math.exp(k*1.0/I);if(r>330)break;c+=`<circle cx="320" cy="200" r="${fx(r)}" fill="none" stroke="var(--blue)" stroke-width="1.4"/>`;[[0,-r],[0,r]].forEach(([dx,dy])=>{if(200+dy<4||200+dy>396)return;const [bx,by]=fieldAt(S2,320+dx,200+dy);c+=head(320+dx,200+dy,Math.atan2(by,bx),'--blue',5)})}lines=c}
     else{const L=magnetLines(S2,{n:src==='horse'?13:pieces===1?14:pieces===2?10:8,a0:src==='horse'?40:50,a1:src==='horse'?300:310,bounds:[-30,-30,670,430]});lines=`<path d="${L.d}" fill="none" stroke="var(--blue)" stroke-width="1.4"/>${L.hd}`}}
   if(view!=='lines')lines+=filings(S2,10,10,630,390,15,src==='wire'?0.05:1/6400,skip);
   let grid='';if(src==='wire'){for(let x=20;x<=620;x+=10)grid+=`M${x} 0V400`;for(let y=0;y<=400;y+=10)grid+=`M0 ${y}H640`;grid=`<path d="${grid}" stroke="var(--line)" stroke-width=".5" opacity=".6"/>`}
   scene={S2,body,lines,grid,Ns,Ss,skip}};
  const compAng=()=>{const [bx,by]=fieldAt(scene.S2,comp.x,comp.y);return Math.atan2(by,bx)};
  const drawComp=()=>{const g=$('#f1c');if(g)g.outerHTML=compassSVG(comp.x,comp.y,compAng(),'f1c');facts()};
  const draw=()=>{build();$('#f1v').innerHTML=`<svg viewBox="0 0 640 400" role="img" aria-label="خطوط المجال">${scene.grid}${scene.lines}${scene.body}${compassSVG(comp.x,comp.y,compAng(),'f1c')}</svg>`;
   $('#f1bar').style.display=src==='bar'?'':'none';$('#f1wire').style.display=src==='wire'?'':'none';$('#f1I-v').textContent=I+' A';facts();bindDrag()};
  const facts=()=>{let h='';const chip=$('#f1chip');
   if(src==='wire'){const a=Math.max(0.5,Math.hypot(comp.x-320,comp.y-200)/10),Bv=MU0*I/(2*PI*a/100),Hv=I/(2*PI*a/100);
     h=fact('بعد البوصلة عن السلك a','f1a')+fact('B = μ₀I/(2πa) (5-7)','f1B')+fact('H = I/(2πa) (5-8)','f1H');$('#f1f').innerHTML=h;$('#f1a').textContent=fm(a,1)+' cm';$('#f1B').textContent=eng(Bv,'T');$('#f1H').textContent=fm(Hv,1)+' A/m';
     chip.textContent=out?'التيار خارج من الورقة: المجال عكس عقارب الساعة':'التيار داخل في الورقة: المجال مع عقارب الساعة';}
   else{const dN=Math.min(...scene.Ns.map(p=>Math.hypot(comp.x-p[0],comp.y-p[1]))),dS=Math.min(...scene.Ss.map(p=>Math.hypot(comp.x-p[0],comp.y-p[1])));
     $('#f1f').innerHTML=fact('أقرب قطب للبوصلة','f1n')+fact('عدد الأقطاب الشمالية','f1k');$('#f1n').textContent=dN<dS?'شمالي N':'جنوبي S';$('#f1k').textContent=scene.Ns.length;
     chip.textContent=dN<dS?'قرب N: الإبرة تشير بعيداً عن القطب الشمالي':'قرب S: الإبرة تشير نحو القطب الجنوبي'}};
  let drag=false;
  const bindDrag=()=>{const svg=$('#f1v svg');svg.addEventListener('pointerdown',e=>{const p=svgPt(svg,e);if(Math.hypot(p.x-comp.x,p.y-comp.y)<30){drag=true;svg.setPointerCapture(e.pointerId);e.preventDefault()}});
   svg.addEventListener('pointermove',e=>{if(!drag)return;const p=svgPt(svg,e);comp={x:clamp(p.x,22,618),y:clamp(p.y,22,378)};dragged=true;drawComp()});
   const up=()=>{drag=false};svg.addEventListener('pointerup',up);svg.addEventListener('pointercancel',up)};
  const drawDom=()=>{$('#f1d').innerHTML=domainSVG(ext/100);$('#f1e-v').textContent=ext+' %';const m=DOM_ANG.reduce((s,a)=>s+Math.cos(a*D*(1-ext/100)),0)/12;
   $('#f1dn').textContent=ext===0?'لا يوجد مجال خارجي: العزوم عشوائية ومحصلتها تقارب الصفر (الشكل ٥-٢أ).':`المحصلة في اتجاه المجال الخارجي ≈ ${fm(m*100,0)} % من أقصاها${ext>=100?' — العزوم كلها في اتجاه المجال (الشكل ٥-٢ب).':''}`};
  segBind(el,'src',v=>{src=v;did[v]=1;draw()});segBind(el,'vw',v=>{view=v;draw()});segBind(el,'pc',v=>{pieces=+v;draw()});
  segBind(el,'dir',v=>{out=v==='out';did.rev=1;draw()});$('#f1I').oninput=e=>{I=+e.target.value;draw()};$('#f1e').oninput=e=>{ext=+e.target.value;drawDom()};
  const nearN=()=>scene&&scene.Ns.some(p=>Math.hypot(comp.x-p[0],comp.y-p[1])<75),nearS=()=>scene&&scene.Ss.some(p=>Math.hypot(comp.x-p[0],comp.y-p[1])<75);
  const steps=stepsUI($('#f1st'),[
   {t:'القطب الشمالي',x:'اسحب البوصلة قرب القطب الشمالي N للمغناطيس القضيبي: يشير طرفها الأحمر <b>بعيداً</b> عن N لأن الخطوط تخرج منه.',done:()=>src==='bar'&&dragged&&nearN()},
   {t:'القطب الجنوبي',x:'حرّكها إلى جوار القطب الجنوبي S: يشير الطرف الأحمر <b>نحو</b> S لأن الخطوط تدخله.',done:()=>src==='bar'&&nearS()},
   {t:'اكسر المغناطيس',x:'اختر «نصفان» ثم «أربع قطع»: كل قطعة مغناطيس كامل له N و S (الشكل ٥-١)، والخطوط تعبر الفجوات بين القطع.',done:()=>src==='bar'&&pieces===4},
   {t:'حدوة الحصان',x:'اختر «حدوة حصان»: الخطوط تنتقل من N إلى S فوق الفتحة كما في الشكل (٥-٣).',done:()=>src==='horse'},
   {t:'سلك يحمل تياراً',x:'اختر «سلك يحمل تياراً» ثم «برادة حديد»: البرادة تتجمع في دوائر مركزها السلك (الشكل ٥-٥).',done:()=>src==='wire'&&view!=='lines'},
   {t:'اعكس التيار',x:'اختر «داخل في الورقة ⊗»: ينعكس اتجاه الدوائر وتنقلب إبرة البوصلة (الشكل ٥-٤ب).',done:()=>src==='wire'&&did.rev&&!out},
   {t:'زد التيار واقترب',x:'ارفع التيار إلى <span class="ltr">8 A</span> أو أكثر: تتقارب الدوائر (مجال أقوى). قرّب البوصلة من السلك وراقب B تكبر كلما صغرت a.',done:()=>src==='wire'&&I>=8},
   {t:'التمغنط',x:'في لوحة «المغناطيسات الذرية» ارفع المجال الخارجي إلى <span class="ltr">100 %</span>: تنتظم العزوم في اتجاه المجال.',done:()=>ext>=100}
  ]);
  draw();drawDom();
  loopOn(el,()=>steps.check());
 },
 quiz:[
  {q:'إذا كسرنا قضيباً مغناطيسياً إلى نصفين فإننا نحصل على:',o:['قطب شمالي منفرد وقطب جنوبي منفرد','مغناطيسين لكل منهما قطب شمالي وقطب جنوبي','قطعتين غير ممغنطتين','مغناطيس واحد وقطعة حديد'],c:1,e:'ص 125 والشكل (٥-١).'},
  {q:'لماذا لا يظهر أثر مغناطيسي لقطعة حديد عادية خارج أي مجال؟',o:['لأنها لا تحتوي إلكترونات','لأن العزوم الذرية في اتجاهات عشوائية تلغي بعضها','لأن الحديد مادة دايامغناطيسية','لأن الحديد لا يتأثر بالمجال'],c:1,e:'ص 126: محصلة العزوم في المادة تلغي بعضها بعضاً (الشكل ٥-٢أ).'},
  {q:'المادة البارامغناطيسية الموضوعة في مجال خارجي يتولد فيها مجال:',o:['عكس اتجاه المجال الخارجي','مع اتجاه المجال الخارجي','عمودي على المجال الخارجي','لا يتولد فيها مجال'],c:1,e:'ص 126.'},
  {q:'كيف نزيد المجال الذي ينتجه مغناطيس كهربائي؟',o:['نقلل عدد اللفات','نضع قضيباً حديدياً داخل الملف ونزيد عدد اللفات','نستعمل سلكاً من البلاستيك','نفصل التيار'],c:1,e:'ص 127.'},
  {q:'ماذا يحدث لمغناطيس الخردة الكهربائي عند فصل التيار؟',o:['يبقى ممغنطاً للأبد','يفقد قوته فتسقط السيارة','يصبح أقوى','ينعكس قطباه فقط'],c:1,e:'ص 127.'},
  {q:'اتجاه المجال المغناطيسي عند نقطة على خط القوى هو:',o:['عمودي على الخط','اتجاه المماس للخط عند تلك النقطة','نحو مركز المغناطيس دائماً','لا يمكن تحديده'],c:1,e:'ص 128.'},
  {q:'شكل خطوط المجال حول سلك مستقيم يحمل تياراً:',o:['خطوط مستقيمة موازية للسلك','دوائر مركزها السلك','خطوط تخرج من السلك نصف قطرية','لا توجد خطوط'],c:1,e:'ص 128 والشكل (٥-٤).'},
  {q:'عند الابتعاد عن السلك الحامل للتيار فإن الدوائر:',o:['تتقارب ويقوى المجال','تتباعد ويضعف المجال','تبقى على نفس التباعد','تختفي فجأة'],c:1,e:'ص 129: تقل كثافة الخطوط عند الابتعاد عن السلك.'}
 ]
});

/* ======================================================================
   Lesson u5-l2 — الفيض، الملف الحلزوني والحلقي، النفاذية، شدة المجال (ص 129–137)
   ====================================================================== */
function fig56(){let s=`<svg viewBox="0 0 420 220" role="img" aria-label="عنصر مساحة dA على سطح غير منتظم">`;
  s+=`<path d="M60 150C40 90 120 40 200 60C280 30 380 80 360 150C350 200 250 210 190 190C130 210 75 195 60 150Z" fill="var(--blue-soft)" stroke="var(--blue)" stroke-width="1.6"/>`;
  s+=`<path d="M190 118L222 108L232 132L200 142Z" fill="var(--blue)" opacity=".85"/>`+arrow(212,124,262,52,'--fg',2.4)+S.t(270,48,'dA','','start',14)+arrow(212,124,330,124,'--blue',2.6)+S.t(338,128,'B','b','start',14);
  s+=`<path d="M246 124A34 34 0 0 0 234 96" fill="none" stroke="var(--fg)" stroke-width="1.4"/>`+S.t(252,108,'θ','','start',14);
  return s+'</svg>'}
function fig57(){let s=`<svg viewBox="0 0 360 170" role="img" aria-label="المجال موازٍ للسطح: الفيض صفر">`;
  s+=`<rect x="70" y="88" width="220" height="18" fill="var(--live-soft)" stroke="var(--live)"/>`;for(let x=80;x<290;x+=14)s+=`<path d="M${x} 88L${x+10} 106" stroke="var(--live)" stroke-width="1"/>`;
  s+=arrow(180,88,180,24,'--fg',2.4)+S.t(192,30,'dA','','start',14)+arrow(40,70,320,70,'--blue',2.4)+arrow(40,128,320,128,'--blue',2.4)+S.t(328,74,'B','b','start',14);
  return s+'</svg>'}
function fig58(){let s=`<svg viewBox="0 0 360 200" role="img" aria-label="المجال عمودي على السطح: الفيض = BA">`;
  s+=`<rect x="160" y="30" width="18" height="140" fill="var(--live-soft)" stroke="var(--live)"/>`;for(let y=36;y<168;y+=14)s+=`<path d="M160 ${y}L178 ${y+10}" stroke="var(--live)" stroke-width="1"/>`;
  [60,100,140].forEach(y=>{s+=arrow(30,y,330,y,'--blue',2.2)});s+=arrow(178,100,250,100,'--fg',3)+S.t(232,92,'dA','','middle',14)+S.t(336,64,'B','b','start',14);
  return s+'</svg>'}
/* disc (area) seen at an angle; normal at angle th (rad) from +x */
function discSVG(cx,cy,r,th,o){o=o||{};const a=th+PI/2;return `<ellipse cx="${fx(cx)}" cy="${fx(cy)}" rx="${fx(r)}" ry="${fx(r*0.3)}" transform="rotate(${fx(a/D)} ${fx(cx)} ${fx(cy)})" fill="${o.fill||'var(--surface-2)'}" stroke="var(--fg)" stroke-width="1.6" opacity="${o.op||0.92}"/>`}
function fig512(){let s=`<svg viewBox="0 0 360 200" role="img" aria-label="الفيض يخترق المساحة A">`;
  [70,100,130].forEach(y=>{s+=`<path d="M30 ${y}H160" stroke="var(--blue)" stroke-width="2"/>`});s+=discSVG(180,100,74,0);[70,100,130].forEach(y=>{s+=arrow(196,y,330,y,'--blue',2)});
  s+=S.t(300,60,'Φ','b','middle',16)+S.t(196,190,'A = 0.5 m²','','start');return s+'</svg>'}
function fig513(){let s=`<svg viewBox="0 0 380 260" role="img" aria-label="مساحتان متعامدتان A1 وA2">`;
  s+=discSVG(220,80,60,0)+S.t(300,60,'A1 = 0.6 m²','','start')+discSVG(220,200,60,PI/2)+S.t(300,206,'A2 = 0.6 m²','','start');
  s+=arrow(40,80,150,80,'--blue',2.6)+S.t(60,70,'B','b','middle',15);return s+'</svg>'}
/* solenoid cross-section scene: n turns, current sign sg (+1: top ⊙ bottom ⊗ → field inside to the right) */
function solScene(o){const n=o.n||9,x0=o.x0||200,x1=o.x1||440,yt=o.yt||120,yb=o.yb||220,sg=o.sg||1,src=[];
  for(let k=0;k<n;k++){const x=x0+(k+0.5)*(x1-x0)/n;src.push({t:'w',x,y:yt,I:sg},{t:'w',x,y:yb,I:-sg})}return src}
function solenoidSVG(o){o=o||{};const W=o.W||640,H=o.H||340,n=o.n||9,x0=o.x0||200,x1=o.x1||440,yt=o.yt||120,yb=o.yb||220,sg=o.sg||1,yc=(yt+yb)/2;
  const src=solScene({n,x0,x1,yt,yb,sg});const f=(x,y)=>psiAt(src,x,y,7);const dl=o.dl||1.5,L0=dl*0.5;
  let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${o.aria||'خطوط المجال لملف حلزوني'}">`;
  if(o.core)s+=`<rect x="${x0+4}" y="${yt+14}" width="${x1-x0-8}" height="${yb-yt-28}" rx="4" fill="var(--surface-2)" stroke="var(--muted)"/>`+arT((x0+x1)/2,yc+5,o.core,{fs:12,col:'--muted'});
  if(o.fil)s+=filings(src,8,8,W-8,H-8,12,n*0.02,(x,y)=>src.some(w=>Math.hypot(x-w.x,y-w.y)<9));
  else s+=`<path d="${contourPath(f,0,0,W,H,5,L0,dl)}" fill="none" stroke="var(--blue)" stroke-width="1.3"/>`+probeHeads(src,f,(x0+x1)/2-30,4,(x0+x1)/2-30,H-4,L0,dl,'--blue',(x,y)=>Math.abs(y-yt)<12||Math.abs(y-yb)<12);
  // turns (side view hint) + conductors
  for(let k=0;k<n;k++){const x=x0+(k+0.5)*(x1-x0)/n;s+=`<path d="M${fx(x)} ${yt}L${fx(x+(x1-x0)/n*0.5)} ${yb}" stroke="var(--live)" stroke-width="1.2" opacity=".35"/>`}
  src.forEach(w=>{s+=wireDot(w.x,w.y,w.I,8)});
  const nE=sg>0?x1:x0,sE=sg>0?x0:x1;
  s+=`<text class="txt" x="${nE+(sg>0?22:-22)}" y="${yc-8}" font-size="18" text-anchor="middle" style="fill:var(--stop)">N</text><text class="txt" x="${sE+(sg>0?-22:22)}" y="${yc-8}" font-size="18" text-anchor="middle" style="fill:var(--muted)">S</text>`;
  if(o.comp){[[x0-70,yc],[x1+70,yc]].forEach(([x,y])=>{const [bx,by]=fieldAt(src,x,y);s+=compassSVG(x,y,Math.atan2(by,bx),'',16)})}
  return {svg:s+'</svg>',src}}
/* end view of a turn: circulation as seen by an observer looking at that end */
function endView(x,y,ccw,lbl){return `<circle cx="${x}" cy="${y}" r="22" fill="none" stroke="var(--live)" stroke-width="2.4"/>`+head(x+(ccw?-1:1)*0,y-22,ccw?PI:0,'--live',7)+head(x,y+22,ccw?0:PI,'--live',7)+S.t(x,y+5,lbl,'','middle',14)}
function fig59(){const a=solenoidSVG({fil:true,comp:true,sg:-1,aria:'برادة الحديد حول ملف حلزوني'}).svg,b=solenoidSVG({sg:-1}).svg;
  return `<div class="mg-figs"><figure>${box(a,420)}<figcaption>(أ) برادة الحديد حول الملف</figcaption></figure><figure>${box(b,420)}<figcaption>(ب) خطوط المجال: الطرف الأيسر شمالي</figcaption></figure></div>`}
function toroidSVG(o){o=o||{};const cx=o.cx||170,cy=o.cy||160,R1=o.R1||80,R2=o.R2||130,R=o.R||105,nT=o.nT||30;let s=`<svg viewBox="0 0 ${o.W||340} ${o.H||320}" role="img" aria-label="ملف حلقي">`;
  s+=`<circle cx="${cx}" cy="${cy}" r="${(R1+R2)/2}" fill="none" stroke="var(--surface-2)" stroke-width="${R2-R1}"/><circle cx="${cx}" cy="${cy}" r="${R1}" fill="none" stroke="var(--fg)" stroke-width="1.4"/><circle cx="${cx}" cy="${cy}" r="${R2}" fill="none" stroke="var(--fg)" stroke-width="1.4"/>`;
  for(let k=0;k<nT;k++){const a=k*2*PI/nT+0.12;const c=Math.cos(a),sn=Math.sin(a);s+=`<path d="M${fx(cx+c*(R1-4))} ${fx(cy+sn*(R1-4))}L${fx(cx+c*(R2+4))} ${fx(cy+sn*(R2+4))}" stroke="var(--live)" stroke-width="2.2" opacity=".8"/>`}
  s+=`<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="var(--blue)" stroke-width="1.8" stroke-dasharray="6 4"/>`;
  const dir=o.dir||1;[30,120,210,300].forEach(dg=>{const a=dg*D;s+=head(cx+R*Math.cos(a),cy+R*Math.sin(a),a+dir*PI/2,'--blue',7)});
  const pa=-35*D;s+=arrow(cx,cy,cx+R*Math.cos(pa),cy+R*Math.sin(pa),'--fg',1.6)+`<circle cx="${fx(cx+R*Math.cos(pa))}" cy="${fx(cy+R*Math.sin(pa))}" r="4" fill="var(--fg)"/>`+S.t(fx(cx+R*Math.cos(pa)+12),fx(cy+R*Math.sin(pa)-4),'p','','start',13)+S.t(fx(cx+R*0.5*Math.cos(pa)+8),fx(cy+R*0.5*Math.sin(pa)-6),'R','','start',13);
  s+=arrow(cx,cy,cx-R1*0.71,cy+R1*0.71,'--muted',1.2)+S.t(cx-R1*0.4-14,cy+R1*0.4+4,'R1','m')+arrow(cx,cy,cx+R2*0.2,cy+R2*0.98,'--muted',1.2)+S.t(cx+R2*0.12+14,cy+R2*0.8,'R2','m','start');
  s+=S.t(cx+R*0.8,cy-R*0.8-8,'B','b','middle',15);
  const lx=cx+R2*Math.cos(165*D),ly=cy+R2*Math.sin(165*D);s+=arrow(lx-40,ly-6,lx-4,ly-6,'--live',2)+arrow(lx-4,ly+10,lx-40,ly+10,'--live',2)+S.t(lx-46,ly+6,'I','','end',13);
  return s+'</svg>'}
function fig511(){let s=`<svg viewBox="0 0 560 200" role="img" aria-label="تركيز المادة الفيرومغناطيسية لخطوط الفيض">`;
  s+=`<rect x="220" y="80" width="120" height="40" rx="4" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.4"/>`;
  for(let k=0;k<7;k++){const y=28+k*24,yi=86+k*(28/6);s+=`<path d="M20 ${y}C120 ${y} 150 ${fx(yi)} 220 ${fx(yi)}H340C410 ${fx(yi)} 440 ${y} 540 ${y}" fill="none" stroke="var(--blue)" stroke-width="1.6"/>`+head(80,y,0,'--blue',5)+head(490,y,0,'--blue',5)}
  return s+'</svg>'}

const MATS=[['air','هواء / فراغ',1],['al','ألمنيوم (بارا)',1.000022],['dia','دايامغناطيسية',0.99],['fe','حديد (فيرو)',5000]];
B.lesson({
 id:'u5-l2',unit:5,order:2,pages:'129–137',
 title:'الفيض المغناطيسي والنفاذية وشدة المجال',
 summary:'الفيض المغناطيسي Φ = B·A·cosθ ووحداته، المجال داخل الملف الحلزوني والملف الحلقي، النفاذية μ وμr وتصنيف المواد (بارا ودايا وفيرو)، قواعد تعيين اتجاه المجال، وشدة المجال H = B/μ. مع الأمثلة (٥-١) إلى (٥-٣).',
 stations:[
  {intro:true},

  {st:1,short:'الفيض المغناطيسي',title:'الفيض (التدفق) المغناطيسي: كم خطاً يعبر السطح؟',ref:'ص 129–131',
   q:'تمسك إطاراً في مجرى ريح: يمر فيه أكبر قدر من الهواء وهو مواجه للريح… فماذا يحدث إذا أدرته حتى صار موازياً لها؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="سطح مائل في مجال منتظم، ومتجه المساحة dA عمودي عليه بزاوية θ مع المجال B" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="خطوط المجال المغناطيسي ⟦B⟧: مجال منتظم اتجاهه نحو اليمين." stroke="#3A7CA5" stroke-width="2.5"><line x1="40" y1="90" x2="312" y2="90"/><line x1="40" y1="125" x2="312" y2="125"/><line x1="40" y1="195" x2="312" y2="195"/><line x1="40" y1="230" x2="312" y2="230"/><line x1="40" y1="160" x2="150" y2="160"/><line x1="220" y1="160" x2="312" y2="160"/><g fill="#3A7CA5" stroke="none"><polygon points="322,90 310,84 310,96"/><polygon points="322,125 310,119 310,131"/><polygon points="322,160 310,154 310,166"/><polygon points="322,195 310,189 310,201"/><polygon points="322,230 310,224 310,236"/></g></g><g data-tip="السطح الذي يعبره الفيض، ومساحته ⟦A⟧. هنا هو مائل على اتجاه المجال."><ellipse cx="180" cy="160" rx="26" ry="84" transform="rotate(-30 180 160)" fill="#F2C14E" fill-opacity=".75" stroke="#2C4A40" stroke-width="2.5"/></g><g data-tip="متجه المساحة ⟦dA⟧: قيمته مقدار المساحة، واتجاهه دائماً عمودي على السطح."><line x1="180" y1="160" x2="242" y2="124" stroke="#2C4A40" stroke-width="4" stroke-linecap="round"/><polygon points="256,116 238,118 246,132" fill="#2C4A40"/><text x="262" y="110" font-size="16" font-weight="700" fill="#2C4A40" font-family="var(--mono)">dA</text></g><g data-tip="الزاوية ⟦θ⟧ بين متجه المساحة ⟦dA⟧ واتجاه المجال ⟦B⟧. الفيض ⟦Φ = B × A cosθ⟧."><path d="M224 160 A44 44 0 0 0 218 138" fill="none" stroke="#E8735A" stroke-width="3"/><text x="232" y="152" font-size="16" font-weight="700" fill="#E8735A" font-family="var(--mono)">θ</text></g><text x="330" y="80" text-anchor="middle" font-size="16" font-weight="700" fill="#3A7CA5" font-family="var(--mono)">B</text><text x="180" y="298" text-anchor="middle" font-size="14" font-weight="600" fill="#2C4A40" direction="rtl" unicode-bidi="embed">الفيض يعتمد على الميل</text></svg>`,
   cap:'سطح مساحته A في مجال منتظم B، ومتجه المساحة dA عمودي عليه، كما في الشكل (٥-٦).<br><b>مرّر المؤشر على الخطوط والسطح والسهم والزاوية (أو المسه في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>الفيض المغناطيسي وكما عرف بالفيض الكهربائي سابقاً يمكن تعريفه على أنه <b>عدد الخطوط المغناطيسية التي تعبر وحدة المساحات العمودية</b>. افترض أن \(dA\) عبارة عن جزء مساحة صغير من سطح غير منتظم كما في الشكل (٥-٦)، فالفيض المغناطيسي يعبر عنه بشدة المجال المغناطيسي \(B\) مضروب في المساحة العمودية \(dA\). ويرمز للفيض المغناطيسي بالرمز \(\Phi_m\).</p>
     <div class="eq">$$\Phi_m=\int B\,dA$$<span class="eqno">(5-1)</span></div>
     <div class="eq">$$\Phi_m=B\times A\cos\theta$$</div>`,ref:'ص 129–130'}
   ],
   body:[
    {book:String.raw`<p>إذ يمثل \(A\) المساحة التي يقطعها الفيض \(\Phi\). و تقاس \(\Phi\) بوحدة <b>الويبر Wb</b> (Weber). أما \(B\) فإنها تقاس <b>بالتسلا</b> ويرمز لها بالرمز T</p>
     <div class="eq">$$\frac{\text{Newton}}{\text{Coulomb}\times\text{meter/second}}=\frac{\text{Newton}}{\text{Ampere}\cdot\text{meter}}=\text{Tesla}=\frac{\text{Weber}}{\text{m}^2}$$</div>
     <p>ووحدة Tesla هي وحدة كبيرة ويمكن استخدام وحدة <b>الجاوس</b> في نظام جاوس للوحدات حيث إن: <span class="ltr">Tesla = 10<sup>4</sup> Gauss</span></p>
     <p>حيث إن \(dA\) هو متجه المساحة وقيمته تعطي مقدار المساحة واتجاهه يكون دائماً عمودياً على المساحة.</p>`,ref:'ص 130'},
    {book:String.raw`<p>في الشكل (٥-٧) الفيض المغناطيسي يساوي صفراً لأن المتجه \(dA\) عمودي على متجه المجال \(B\). أي أن الفيض المغناطيسي يساوي صفرا عندما يكون المجال المغناطيس \(B\) <b>موازيا لسطح المساحة</b> ولا يقطعها وليس عموديا عليها.</p>
     <p>في حالة الشكل (٥-٨) الفيض المغناطيسي يساوي \(B\times A\) لأن المتجه \(dA\) في نفس اتجاه متجه المجال \(B\) والزاوية المحصورة تساوي صفراً.</p>`,ref:'ص 130–131'},
    {predict:{q:'أدرنا السطح حتى صار موازياً لخطوط المجال (\\(dA\\) عمودي على \\(B\\)). كم يصبح الفيض؟',opts:[
     ['أكبر قيمة: \\(B\\times A\\)',false,'هذه حالة الشكل (٥-٨): \\(dA\\) في اتجاه \\(B\\) والزاوية صفر.'],
     ['نصف القيمة العظمى',false,'النصف يكون عند \\(\\theta=60^\\circ\\) لأن \\(\\cos60^\\circ=0.5\\)، لا عند التوازي.'],
     ['صفراً',true,'الشكل (٥-٧): المجال موازٍ للسطح فلا يقطعه، و\\(\\cos90^\\circ=0\\).']]}},
    {tip:String.raw`<p>العامل \(\cos\theta\) هو «نسبة المواجهة»: \(\cos0^\circ=1\) (السطح يواجه المجال تماماً: أكبر فيض)، \(\cos60^\circ=0.5\) (نصف الفيض)، \(\cos90^\circ=0\) (لا فيض). جرّب ذلك بتدوير السطح في لوحة «الفيض الذي يعبر سطحاً» في تبويب المختبر.</p>`,title:'دور الزاوية'},
    {watch:String.raw`<p>انتبه لمعنى \(\theta\): هي الزاوية بين المجال و<b>متجه المساحة العمودي على السطح</b>، لا بين المجال والسطح نفسه. السطح الموازي للمجال يعني \(\theta=90^\circ\).</p>`}
   ]},

  {st:2,short:'الملف الحلزوني',title:'المجال المغناطيسي الناتج عن ملف حلزوني يحمل تياراً مستمراً',ref:'ص 131–132',
   q:'لو لففت السلك المستقيم على شكل لولب طويل… هل يصبح له قطب شمالي وقطب جنوبي مثل المغناطيس القضيبي؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ملف حلزوني: خطوط مستقيمة متوازية داخله وخطوط منحنية خارجه، وطرفه الأيسر شمالي" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="150" r="140" fill="#F7DCC8"/><g data-tip="خارج الملف: يشبه مجال ساق ممغنط ويكون ضعيفاً جداً، واتجاهه من الشمالي ⟦N⟧ إلى الجنوبي ⟦S⟧." fill="none" stroke="#3A7CA5" stroke-width="2.5"><path d="M100 140 C 40 50, 320 50, 260 140"/><path d="M100 180 C 40 270, 320 270, 260 180"/></g><g fill="#3A7CA5"><polygon points="190,72 178,66 178,78"/><polygon points="190,248 178,242 178,254"/></g><g data-tip="داخل الملف: خطوط مستقيمة متوازية (مجال منتظم)، واتجاهها من الجنوبي إلى الشمالي، أي نحو اليسار هنا." stroke="#3A7CA5" stroke-width="3"><line x1="88" y1="145" x2="272" y2="145"/><line x1="88" y1="160" x2="272" y2="160"/><line x1="88" y1="175" x2="272" y2="175"/><g fill="#3A7CA5" stroke="none"><polygon points="80,145 92,140 92,150"/><polygon points="80,160 92,155 92,165"/><polygon points="80,175 92,170 92,180"/></g></g><g data-tip="لفات الملف الحلزوني: سلك ملفوف على شكل لولب يمر فيه تيار مستمر." fill="none" stroke="#B9852A" stroke-width="5" stroke-linecap="round"><path d="M110 126 L120 194"/><path d="M128 126 L138 194"/><path d="M146 126 L156 194"/><path d="M164 126 L174 194"/><path d="M182 126 L192 194"/><path d="M200 126 L210 194"/><path d="M218 126 L228 194"/><path d="M236 126 L246 194"/></g><text x="64" y="166" text-anchor="middle" font-size="20" font-weight="700" fill="#E8735A" font-family="var(--mono)">N</text><text x="296" y="166" text-anchor="middle" font-size="20" font-weight="700" fill="#2C4A40" font-family="var(--mono)">S</text><g data-tip="الطرف الأيسر كما تراه من الخارج: التيار يدور عكس حركة عقارب الساعة، فيكون قطباً شمالياً ⟦N⟧."><circle cx="90" cy="282" r="17" fill="#FBF6EE" stroke="#B9852A" stroke-width="3"/><polygon points="84,265 94,259 94,271" fill="#B9852A"/><text x="90" y="287" text-anchor="middle" font-size="14" font-weight="700" fill="#E8735A" font-family="var(--mono)">N</text></g><g data-tip="الطرف الأيمن كما تراه من الخارج: التيار يدور مع حركة عقارب الساعة، فيكون قطباً جنوبياً ⟦S⟧."><circle cx="270" cy="282" r="17" fill="#FBF6EE" stroke="#B9852A" stroke-width="3"/><polygon points="276,265 266,259 266,271" fill="#B9852A"/><text x="270" y="287" text-anchor="middle" font-size="14" font-weight="700" fill="#2C4A40" font-family="var(--mono)">S</text></g><text x="180" y="287" text-anchor="middle" font-size="13" font-weight="600" fill="#2C4A40" direction="rtl" unicode-bidi="embed">منظر الطرفين</text></svg>`,
   cap:'المجال داخل الملف الحلزوني وخارجه كما في الشكل (٥-٩)، وفي الأسفل كل طرف كما يراه من ينظر إليه من الخارج.<br><b>مرّر المؤشر على الخطوط واللفات ودائرتي الطرفين (أو المسه في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p><b>شكل المجال الشكل (٥-٩أ):</b></p><ul><li>داخل الملف: خطوط مستقيمة متوازية (مجال منتظم).</li><li>خارج الملف يشبه المجال المغناطيسي لساق ممغنط و يكون المجال ضعيفاً جداً.</li><li>اتجاه المجال: في الداخل من الجنوبي إلى الشمالي و في الخارج من الشمالي إلى الجنوبي.</li><li>القاعدة المستخدمة: <b>البريمة اليمنى لماكسويل</b> (اللولب يميني اللف) إذا أدرنا رأس البريمة داخل الملف على محوره في نفس اتجاه التيار في الملف يكون اتجاه تقدم البريمة هو نفس اتجاه خطوط المجال داخل الملف.</li></ul>`,ref:'ص 131–132'}
   ],
   body:[
    {book:String.raw`<p><b>تحديد قطبي الملف الشكل (٥-٩ب):</b></p><p>طرف الملف الذي يكون فيه اتجاه التيار <b>مع حركة عقارب الساعة يكون قطباً جنوبياً</b> والطرف الآخر مع عكس حركة عقارب الساعة يكون شمالياً، طرف الملف الذي يدخل إليه التيار تدخل إليه خطوط المجال ويكون جنوبياً والعكس للطرف الآخر.</p>`,ref:'ص 132'},
    {predict:{q:'نظرت إلى أحد طرفي ملف حلزوني فرأيت التيار يدور فيه مع حركة عقارب الساعة. هذا الطرف:',opts:[
     ['قطب جنوبي',true,'الكتاب: الطرف الذي يكون فيه التيار مع حركة عقارب الساعة يكون قطباً جنوبياً (ص 132).'],
     ['قطب شمالي',false,'الشمالي هو الطرف الذي يدور فيه التيار عكس عقارب الساعة.'],
     ['لا قطبية له؛ الأقطاب للمغانط الطبيعية فقط',false,'الملف الحلزوني الذي يمر فيه تيار يسلك سلوك ساق ممغنط له قطبان.']]}},
    {tip:String.raw`<p>طريقة سهلة للحفظ: ارسم حرف <b>S</b> على طرف الملف وضع سهماً على طرفيه: يلتفان مع عقارب الساعة. وارسم حرف <b>N</b> وضع سهماً على طرفيه: يلتفان عكس عقارب الساعة.</p>`,title:'حيلة للحفظ'},
    {watch:String.raw`<p>داخل الملف يكون المجال <b>من S إلى N</b>، عكس ما تعودت عليه خارج المغناطيس (من N إلى S). الخطوط حلقات مغلقة: تخرج من N وتلتف من الخارج إلى S ثم تعود داخل الملف إلى N.</p>`},
    {add:String.raw`<p>الملف الحلزوني هو قلب المرحّل (الريليه) والكونتاكتور وصمامات الماء الكهربائية (السولينويد): عندما يمر التيار يصبح الملف مغناطيساً يسحب قلباً حديدياً متحركاً داخله.</p>`,title:'أين تجده؟'}
   ]},

  {st:3,short:'الملف الحلقي',title:'المجال المغناطيسي الناتج عن ملف حلقي يحمل تياراً مستمراً',ref:'ص 132–133',
   q:'إذا ثنيت الملف الحلزوني حتى التقى طرفاه في حلقة مغلقة… أين يذهب القطبان؟',
   art:(()=>{let t='';for(let k=0;k<24;k++)t+=`<line x1="180" y1="57" x2="180" y2="103" transform="rotate(${k*15+7} 180 150)"/>`;
    return `<svg viewBox="0 0 360 320" role="img" aria-label="ملف حلقي ملفوف على حلقة، ومسار متقطع نصف قطره R داخله يمر بالنقطة p" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="150" r="140" fill="#E6E2F8"/><g data-tip="قلب الملف الحلقي: حلقة نصف قطرها الداخلي ⟦R1⟧ والخارجي ⟦R2⟧."><circle cx="180" cy="150" r="75" fill="none" stroke="#F1EBDD" stroke-width="40"/><circle cx="180" cy="150" r="55" fill="none" stroke="#2C4A40" stroke-width="2"/><circle cx="180" cy="150" r="95" fill="none" stroke="#2C4A40" stroke-width="2"/></g><g data-tip="لفات الملف الحلقي: عددها ⟦N⟧، ملفوفة بانتظام على الحلقة كلها." stroke="#B9852A" stroke-width="3.5" stroke-linecap="round">${t}</g><g data-tip="المسار الدائري داخل الملف (نصف قطره ⟦R⟧): كل نقاطه متناظرة بالنسبة للحلقة، لذلك ⟦B⟧ متساوية عندها كلها، والأسهم تبين اتجاهها."><circle cx="180" cy="150" r="75" fill="none" stroke="#3A7CA5" stroke-width="2.5" stroke-dasharray="7 5"/><polygon points="192,75 180,69 180,81" fill="#3A7CA5"/><polygon points="255,162 249,150 261,150" fill="#3A7CA5"/><polygon points="168,225 180,219 180,231" fill="#3A7CA5"/><polygon points="105,138 99,150 111,150" fill="#3A7CA5"/></g><g data-tip="⟦R⟧: بعد النقطة ⟦p⟧ عن مركز الحلقة. كلما زاد ⟦R⟧ قلت ⟦B⟧ لأنه في المقام في المعادلة (5-2)."><line x1="180" y1="150" x2="241" y2="106" stroke="#2C4A40" stroke-width="2.5"/><circle cx="241" cy="106" r="5" fill="#E8735A"/><text x="252" y="102" font-size="15" font-weight="700" fill="#E8735A" font-family="var(--mono)">p</text><text x="204" y="118" font-size="15" font-weight="700" fill="#2C4A40" font-family="var(--mono)">R</text></g><circle cx="180" cy="150" r="4" fill="#2C4A40"/><text x="150" y="168" font-size="12" fill="#2C4A40" font-family="var(--mono)">R1</text><text x="180" y="262" text-anchor="middle" font-size="12" fill="#2C4A40" font-family="var(--mono)">R2</text><text x="180" y="304" text-anchor="middle" font-size="14" font-weight="600" fill="#2C4A40" direction="rtl" unicode-bidi="embed">المجال محصور داخل الحلقة</text></svg>`})(),
   cap:'ملف حلقي كما في الشكل (٥-١٠): المسار المتقطع داخل اللفات يمر بالنقطة p على بعد R من المركز.<br><b>مرّر المؤشر على الحلقة واللفات والمسار والنقطة p (أو المسه في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>يمكن حساب كثافة التدفق المغناطيسي في أية نقطة داخل ملف حلقي الشكل (٥-١٠) على بعد \(R\) من المركز بالعلاقة التالية:</p>
     <div class="eq">$$B=\frac{\mu_0\,N\,I}{2\pi R}$$<span class="eqno">(5-2)</span></div>
     <p>حيث: \(N\) عدد اللفات لملف حلقي، \(R_1\) نصف القطر الداخلي، \(R_2\) نصف القطر الخارجي، \(I\) شدة التيار المار في الملف.</p>`,ref:'ص 132'}
   ],
   body:[
    {book:String.raw`<p>بما أن جميع النقاط الواقعة على هذا المسار متناظرة بالنسبة للحلقة، إذاً كثافة المجال متساوية عند جميع هذه النقاط.</p><p>وإذا كان الفرق بين \(R_1\) , \(R_2\) صغيراً تكون \(B\) متساوية عند جميع النقاط داخل الملف وتساوي \(B=\mu_0NI/(2\pi R)\).</p>`,ref:'ص 133'},
    {predict:{q:'انتقلنا بالنقطة p من قرب الحافة الداخلية \\(R_1\\) إلى قرب الحافة الخارجية \\(R_2\\). ماذا يحدث لـ \\(B\\)؟',opts:[
     ['تزداد لأن النقطة أقرب إلى اللفات الخارجية',false,'المعادلة (5-2) تقول العكس: \\(R\\) في المقام.'],
     ['لا تتغير أبداً مهما كان عرض الحلقة',false,'تكون متساوية تقريباً فقط إذا كان الفرق بين \\(R_1\\) و\\(R_2\\) صغيراً.'],
     ['تقل قليلاً لأن \\(R\\) في المقام',true,'\\(B=\\mu_0NI/(2\\pi R)\\): كلما زاد \\(R\\) قلت \\(B\\). جرّبها بمنزلق R في تبويب المختبر.']]}},
    {tip:String.raw`<p>الملف الحلقي ملف حلزوني ثُني على شكل دائرة حتى التقى طرفاه، فلا يبقى له طرفان مكشوفان ولا قطبان ظاهران: خطوط المجال تدور داخل الحلقة وتبقى محصورة فيها. والمقدار \(2\pi R\) في المعادلة هو طول المسار الدائري الذي تقع عليه النقطة.</p>`,title:'لماذا 2πR؟'},
    {watch:String.raw`<p>في الكتاب سُمّي الملف في جملة المعادلة (5-2) «ملف لولبي»، والمقصود والمرسوم ملف حلقي كما في العنوان. والكتاب لا يعرّف \(R\) في قائمة الرموز، وهو بعد النقطة عن المركز.</p>`,fix:true},
    {add:String.raw`<p>المحولات الحلقية (Toroidal) في أجهزة الصوت ومزودات الطاقة تستعمل هذا الشكل: لأن مجالها محصور داخل الحلقة فهي لا تشوّش على الأجهزة المجاورة.</p>`,title:'من الواقع'}
   ]},

  {st:4,short:'النفاذية',title:'النفاذية: كم تسمح المادة بمرور خطوط القوى؟',ref:'ص 133',
   q:'الملف نفسه بالتيار نفسه… لماذا يصبح مجاله أقوى بكثير عندما نضع في داخله قضيباً من الحديد؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="قطعتان: فراغ تمر فيه خطوط قليلة، وحديد تتجمع فيه خطوط كثيرة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="الفراغ (والهواء قريب منه جداً): نفاذيته ⟦μ0 = 4π × 10⁻⁷ H/m⟧، وهي المرجع الذي نقارن به المواد."><rect x="58" y="78" width="104" height="150" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><g stroke="#3A7CA5" stroke-width="2.5"><line x1="74" y1="118" x2="146" y2="118"/><line x1="74" y1="153" x2="146" y2="153"/><line x1="74" y1="188" x2="146" y2="188"/></g></g><g data-tip="مادة نفاذيتها كبيرة مثل الحديد: تسمح بمرور خطوط قوى أكثر بكثير، أي كثافة فيض أكبر."><rect x="198" y="78" width="104" height="150" rx="8" fill="#9AA5A0" stroke="#2C4A40" stroke-width="2.5"/><g stroke="#3A7CA5" stroke-width="2.5"><line x1="214" y1="94" x2="286" y2="94"/><line x1="214" y1="109" x2="286" y2="109"/><line x1="214" y1="124" x2="286" y2="124"/><line x1="214" y1="139" x2="286" y2="139"/><line x1="214" y1="154" x2="286" y2="154"/><line x1="214" y1="169" x2="286" y2="169"/><line x1="214" y1="184" x2="286" y2="184"/><line x1="214" y1="199" x2="286" y2="199"/><line x1="214" y1="214" x2="286" y2="214"/></g></g><text x="110" y="256" text-anchor="middle" font-size="16" font-weight="700" fill="#2C4A40" font-family="var(--mono)">μ0</text><text x="250" y="256" text-anchor="middle" font-size="16" font-weight="700" fill="#2C4A40" font-family="var(--mono)">μ = μr μ0</text><text x="110" y="64" text-anchor="middle" font-size="14" font-weight="700" fill="#2C4A40" direction="rtl" unicode-bidi="embed">فراغ</text><text x="250" y="64" text-anchor="middle" font-size="14" font-weight="700" fill="#2C4A40" direction="rtl" unicode-bidi="embed">حديد</text><text x="180" y="292" text-anchor="middle" font-size="14" font-weight="600" fill="#2C4A40" direction="rtl" unicode-bidi="embed">النفاذية = سماحية المرور</text></svg>`,
   cap:'المجال نفسه، والمادة تغير عدد الخطوط التي تمر فيها (الرسم توضيحي، وعدد الخطوط فيه ليس نسبة حقيقية).<br><b>مرّر المؤشر على القطعتين (أو المسه في الجوال) لتعرف معناهما.</b>',
   side:[
    {book:String.raw`<p>تعتمد كثافة الفيض على الخواص المغناطيسية للمادة المحيطة بالسلك أو الموضوعة في المجال المغناطيسي وتسمى <b>بالنفاذية</b> ويرمز لها بالرمز \(\mu\) وحدتها الهنري لكل متر (Henry/m) ورمزها (H/m). ونستعمل نفاذية الفراغ كمرجع ويرمز لها بالرمز \(\mu_0\) وقيمتها.</p>
     <div class="eq">$$\mu_0=4\pi\times10^{-7}\ \text{H/m}$$<span class="eqno">(5-3)</span></div>`,ref:'ص 133'}
   ],
   body:[
    {book:String.raw`<p>وقيمة نفاذية الهواء قريبة جداً من \(\mu_0\). ونسمي النسبة بين نفاذية مادة ما والنفاذية \(\mu_0\) <b>النفاذية النسبية</b> لهذه المادة ويرمز لها بالرمز \(\mu_r\)، أي</p>
     <div class="eq">$$\mu_r=\frac{\mu}{\mu_0}$$<span class="eqno">(5-4)</span></div>
     <p>وتعبر النفاذية على مدى سماحية المادة لمرور خطوط القوى المغناطيسية.</p>`,ref:'ص 133'},
    {predict:{q:'كم تساوي النفاذية النسبية \\(\\mu_r\\) للهواء تقريباً؟',opts:[
     ['\\(4\\pi\\times10^{-7}\\)',false,'هذه \\(\\mu_0\\) نفسها بوحدة H/m، أما \\(\\mu_r\\) فنسبة بلا وحدة.'],
     ['صفر',false,'لو كانت صفراً لما مر أي مجال في الهواء، والمجال يمر فيه بسهولة.'],
     ['واحد تقريباً',true,'نفاذية الهواء قريبة جداً من \\(\\mu_0\\)، فالنسبة \\(\\mu/\\mu_0\\approx1\\).']]}},
    {tip:String.raw`<p>\(\mu\) لها وحدة (H/m)، أما \(\mu_r\) فرقم بلا وحدة يقول «كم مرة» هذه المادة أفضل من الفراغ في تمرير خطوط القوى. فإذا قيل إن \(\mu_r=1000\) فمعناه \(\mu=1000\times4\pi\times10^{-7}\ \text{H/m}\).</p>`,title:'μ أم μr؟'}
   ]},

  {st:5,short:'تصنيف المواد',title:'تصنيف المواد من حيث خواصها المغناطيسية',ref:'ص 133–135',
   q:'المسمار ينجذب بقوة إلى المغناطيس، والعلبة الألمنيوم لا يكاد يظهر عليها أثر، والنحاس… يبتعد قليلاً! كيف نرتب هذه المواد؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ثلاث مواد في مجال: الحديد يجمع الخطوط، والألمنيوم لا يكاد يغيرها، والنحاس يبعدها" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="مادة حديدومغناطيسية ⟦(Ferromagnetic)⟧ مثل الحديد: تجمع خطوط الفيض داخلها بقوة، فتزداد ⟦B⟧ زيادة كبيرة."><path d="M40 52 C 110 52, 125 68, 150 68 H 210 C 235 68, 250 52, 320 52" fill="none" stroke="#3A7CA5" stroke-width="2.5"/><path d="M40 108 C 110 108, 125 92, 150 92 H 210 C 235 92, 250 108, 320 108" fill="none" stroke="#3A7CA5" stroke-width="2.5"/><line x1="150" y1="80" x2="210" y2="80" stroke="#3A7CA5" stroke-width="2.5"/><rect x="150" y="62" width="60" height="36" rx="5" fill="#9AA5A0" fill-opacity=".85" stroke="#2C4A40" stroke-width="2.5"/></g><g data-tip="مادة بارامغناطيسية ⟦(Paramagnetic)⟧ مثل الألمنيوم: تنجذب نحو المغناطيس قليلاً، وتزداد ⟦B⟧ فيها زيادة طفيفة جداً."><path d="M40 146 C 110 146, 125 143, 150 143 H 210 C 235 143, 250 146, 320 146" fill="none" stroke="#3A7CA5" stroke-width="2.5"/><path d="M40 182 C 110 182, 125 185, 150 185 H 210 C 235 185, 250 182, 320 182" fill="none" stroke="#3A7CA5" stroke-width="2.5"/><rect x="150" y="146" width="60" height="36" rx="5" fill="#DDE3E0" fill-opacity=".85" stroke="#2C4A40" stroke-width="2.5"/></g><g data-tip="مادة دايامغناطيسية ⟦(Diamagnetic)⟧ مثل النحاس والبزموت: تبعد الخطوط عنها، فتقل ⟦B⟧ فيها، ونفاذيتها النسبية أقل من الواحد."><path d="M40 232 C 110 232, 125 222, 150 222 H 210 C 235 222, 250 232, 320 232" fill="none" stroke="#3A7CA5" stroke-width="2.5"/><path d="M40 268 C 110 268, 125 278, 150 278 H 210 C 235 278, 250 268, 320 268" fill="none" stroke="#3A7CA5" stroke-width="2.5"/><rect x="150" y="232" width="60" height="36" rx="5" fill="#D9895B" stroke="#2C4A40" stroke-width="2.5"/></g><g fill="#3A7CA5"><polygon points="82,52 70,46 70,58"/><polygon points="82,108 70,102 70,114"/><polygon points="82,146 70,140 70,152"/><polygon points="82,182 70,176 70,188"/><polygon points="82,232 70,226 70,238"/><polygon points="82,268 70,262 70,274"/></g><text x="180" y="86" text-anchor="middle" font-size="13" font-weight="700" fill="#FBF6EE" direction="rtl" unicode-bidi="embed">حديد</text><text x="180" y="170" text-anchor="middle" font-size="13" font-weight="700" fill="#2C4A40" direction="rtl" unicode-bidi="embed">ألمنيوم</text><text x="180" y="256" text-anchor="middle" font-size="13" font-weight="700" fill="#FBF6EE" direction="rtl" unicode-bidi="embed">نحاس</text></svg>`,
   cap:'سلوك الأنواع الثلاثة في المجال (الانحناءات مبالغ فيها للتوضيح، خاصة في الألمنيوم والنحاس).<br><b>مرّر المؤشر على كل صف (أو المسه في الجوال) لتعرف نوع المادة وسلوكها.</b>',
   side:[
    {book:String.raw`<p>جميع المواد على اختلاف أنواعها سواء الغازات أو السوائل أو المواد الصلبة لها خواص مغناطيسية، نتيجة لتأثرها بالمجال المغناطيسي، و لكن بدرجات متفاوتة فبعض المواد لها خواص مغناطيسية ضعيفة و بعضها متوسطة وبعضها قوية. كما أن لدرجة الحرارة أثراً كبيراً على هذه الخواص كذلك توجد مواد أخرى لها خواص مغناطيسية عكسية أي إن اتجاه المجال فيها يعاكس المجال المسبب. و المواد من حيث خواصها المغناطيسية تنقسم إلى قسمين رئيسين هما:</p>`,ref:'ص 133'},
    {predict:{q:'النحاس معامل نفاذيته النسبية أقل من الواحد. إلى أي نوع ينتمي؟',opts:[
     ['حديدومغناطيسي',false,'الحديدومغناطيسية (الحديد والنيكل والكوبالت) تتميز بكبر معامل النفاذية.'],
     ['دايامغناطيسي',true,'الكتاب: من المواد الدايامغناطيسية البزموت والنحاس، ومعامل نفاذيتها أقل من الواحد (ص 134).'],
     ['بارامغناطيسي',false,'البارامغناطيسية تنجذب نحو المغناطيس، مثل الألمنيوم والتيتانيوم والأوكسجين.']]}}
   ],
   body:[
    {book:String.raw`<p><b>١- مواد متسامتة التمغنط (بارامغناطيسية) Paramagnetic</b><br>هذه المواد تميل للحركة من المناطق الضعيفة في المجال المغناطيسي إلى المناطق القوية و بمعنى آخر فإنها تنجذب نحو المغناطيس، و إذا كانت حرة الدوران اتجهت أطوالها اتجاها يوازي المجال. و من هذه المواد الألمنيوم و التيتانيوم و الأوكسجين و أما الحديد و النيكل و الكوبالت و سبائكها و مركباتها فإنها مواد بارامغناطيسية قوية جداً لهذا يطلق عليها المواد <b>الحديدومغناطيسية (Ferromagnetic)</b> التي تتميز بكبر معامل النفاذية، و التأثيرية المغناطيسية لها موجبة.</p>
     <p><b>٢- مواد دايامغناطيسية (Diamagnetic)</b><br>و هذه تميل إلى الابتعاد عن المجال المغناطيسي مهما كان اتجاهه، و إذا أتيحت لها حرية الدوران فإنها تجعل أطوال محاورها متعامدة على خطوط القوى. ومن هذه المواد البزموت و النحاس و تتميز بأن معامل نفاذيتها <b>أقل من الواحد</b> و القابلية المغناطيسية لها سالبة.</p>`,ref:'ص 134'},
    {book:String.raw`<p>واذا كانت كثافة الفيض المغناطيسي في الفراغ المطلق المحيط بالسلك هي \(B_0\) فإن استبدال الفراغ أو الهواء بوسط آخر يؤدي إلى رفع كثافة الفيض إلى \(B\) و أن معامل الزيادة في الفيض يمثل خاصية المادة في قابلية تركيزها للفيض:</p>
     <div class="eq">$$\mu_r=\frac{B}{B_0}$$<span class="eqno">(5-5)</span></div>
     <p>و كما نرى في الشكل (٥-١١) فإن المادة الفيرومغناطيسية تؤدي إلى تركيز الفيض و تسلك إلى حد كبير سلوك <b>الأنبوب الذي يحدد مسار السائل</b> دون أن يدعه يتسرب.</p>`,ref:'ص 134'},
    {book:String.raw`<p>إذا استبدل الهواء بمادة مغناطيسية نجد أن هناك ثلاثة احتمالات هي:</p><ol><li>تزداد قيمة \(B\) زيادة كبيرة في حالة المواد الحديدية و المغناطيسية.</li><li>تزداد قيمة \(B\) زيادة طفيفة جداً في حالة المواد البارامغناطيسية.</li><li>تقل قيمة \(B\) في حالة المواد الدايامغناطيسية.</li></ol>`,ref:'ص 135'},
    {tip:String.raw`<div class="tablebox"><table class="tt"><thead><tr><th>النوع</th><th>أمثلة من الكتاب</th><th>\(\mu_r\)</th><th>أثر وضعها مكان الهواء</th></tr></thead><tbody>
     <tr><td>حديدومغناطيسية</td><td>الحديد، النيكل، الكوبالت</td><td>كبيرة جداً</td><td>\(B\) تزداد كثيراً</td></tr>
     <tr><td>بارامغناطيسية</td><td>الألمنيوم، التيتانيوم، الأوكسجين</td><td>أكبر من 1 بقليل</td><td>\(B\) تزداد زيادة طفيفة</td></tr>
     <tr><td>دايامغناطيسية</td><td>البزموت، النحاس</td><td>أقل من 1</td><td>\(B\) تقل</td></tr></tbody></table></div>`,title:'الأنواع في جدول'},
    {add:String.raw`<p>لهذا تُصنع قلوب المحولات والمحركات من رقائق الحديد (حديدومغناطيسي)، بينما تُصنع الأسلاك من النحاس: لا نريد أن يحمل السلك فيضاً، بل تياراً.</p>`,title:'من الورشة'}
   ]},

  {st:6,short:'تعيين اتجاه المجال',title:'تعيين اتجاه خطوط المجال حول الموصل',ref:'ص 135',
   q:'خطوط المجال حول السلك لا تُرى… فكيف تعرف أنها تدور مع عقارب الساعة أم عكسها؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="يد يمنى تقبض على سلك رأسي، الإبهام إلى أعلى مع التيار، وحلقات المجال حول السلك" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><g data-tip="الموصل (السلك) والتيار ⟦I⟧ فيه إلى أعلى."><line x1="180" y1="44" x2="180" y2="296" stroke="#2C4A40" stroke-width="12" stroke-linecap="round"/><line x1="180" y1="44" x2="180" y2="296" stroke="#F2C14E" stroke-width="7" stroke-linecap="round"/><polygon points="180,26 168,48 192,48" fill="#2C4A40"/><text x="200" y="44" font-size="16" font-weight="700" fill="#2C4A40" font-family="var(--mono)">I</text></g><g data-tip="خطوط المجال: حلقات حول السلك. الجزء الأمامي من الحلقة (الأسفل في الرسم) يتجه نحو اليمين، أي أن الحلقات تدور عكس عقارب الساعة إذا نظرت إليها من أعلى."><ellipse cx="180" cy="104" rx="66" ry="16" fill="none" stroke="#3A7CA5" stroke-width="2.5"/><ellipse cx="180" cy="70" rx="46" ry="11" fill="none" stroke="#3A7CA5" stroke-width="2.5"/><polygon points="196,120 184,114 184,126" fill="#3A7CA5"/><polygon points="196,81 184,75 184,87" fill="#3A7CA5"/><polygon points="164,88 176,82 176,94" fill="#3A7CA5"/></g><g data-tip="الإبهام: يشير إلى اتجاه التيار ⟦I⟧."><rect x="170" y="132" width="20" height="52" rx="10" fill="#F1C7A3" stroke="#2C4A40" stroke-width="2.5"/></g><g data-tip="الأصابع الملتفة حول السلك: تشير أطرافها إلى اتجاه خطوط المجال."><rect x="142" y="174" width="76" height="80" rx="18" fill="#F1C7A3" stroke="#2C4A40" stroke-width="2.5"/><path d="M146 194 H214 M146 214 H214 M146 234 H214" stroke="#2C4A40" stroke-width="1.8"/></g><rect x="152" y="252" width="56" height="36" rx="6" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2.5"/></svg>`,
   cap:'قاعدة قبضة اليد اليمنى: الإبهام مع التيار، والأصابع الملتفة مع خطوط المجال.<br><b>مرّر المؤشر على الإبهام والأصابع والحلقات (أو المسه في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<ol><li><b>قاعدة قبضة اليد اليمنى:</b> عندما تقبض اليد اليمنى على الموصل بحيث يشير الإبهام إلى اتجاه التيار الكهربائي فإن اتجاه الأصابع الملتفة حول السلك يحدد اتجاه خطوط الفيض المغناطيسي.</li></ol>`,ref:'ص 135'},
    {predict:{q:'في قاعدة قبضة اليد اليمنى، إلى أي شيء يشير الإبهام؟',opts:[
     ['إلى اتجاه خطوط المجال',false,'خطوط المجال تبينها الأصابع الملتفة حول السلك، لا الإبهام.'],
     ['إلى القطب الشمالي للأرض',false,'القاعدة لا علاقة لها بأقطاب الأرض؛ هي تربط التيار بالمجال حوله.'],
     ['إلى اتجاه التيار',true,'الكتاب: يشير الإبهام إلى اتجاه التيار، والأصابع الملتفة تحدد اتجاه خطوط الفيض.']]}}
   ],
   body:[
    {book:String.raw`<ol start="2"><li><b>قاعدة البريمة اليمنى لماكسويل:</b> إذا أدرت بريمة بحيث يشير اتجاه اندفاعها إلى اتجاه التيار فإن اتجاه دوراتها يحدد اتجاه خطوط المجال المغناطيسي (تسمى أيضاً هذه القاعدة – قاعدة اللولب اليميني اللف).</li><li><b>باستخدام بوصلة مغناطيسية صغيرة:</b> إذا وضعت بوصلة على لوح الورق المقوى الذي يخترقه الموصل فإن الاتجاه الذي يتخذه قطبها الشمالي يدل على اتجاه خطوط الفيض المغناطيسي.</li></ol>`,ref:'ص 135'},
    {tip:String.raw`<p>البريمة اليمنى هي المفك أو البرغي العادي: عندما تديره مع عقارب الساعة يتقدم البرغي إلى الأمام (داخل الخشب). فإذا كان التيار يتجه بعيداً عنك داخل الورقة \((\otimes)\) فالمجال يدور مع عقارب الساعة، وإذا كان التيار نحوك \((\odot)\) فالمجال يدور عكسها. القواعد الثلاث تعطي النتيجة نفسها.</p>`,title:'البريمة = البرغي'},
    {predict:{q:'تيار يدخل في الورقة بعيداً عنك (⊗). كيف تدور خطوط المجال حوله كما تراها؟',opts:[
     ['مع حركة عقارب الساعة',true,'البرغي الذي يتقدم بعيداً عنك يدور مع عقارب الساعة (قاعدة البريمة اليمنى).'],
     ['عكس حركة عقارب الساعة',false,'هذا عندما يكون التيار خارجاً من الورقة نحوك (⊙).'],
     ['لا تدور؛ الخطوط مستقيمة نحو السلك',false,'خطوط المجال حول السلك دوائر مركزها السلك، لا خطوط نحو السلك.']]}},
    {watch:String.raw`<p>استعمل اليد <b>اليمنى</b> هنا. ستتعلم في الدرس التالي قاعدة فليمنج لليد <b>اليسرى</b> وهي لشيء آخر (اتجاه القوة على السلك). الخلط بين اليدين يعطي اتجاهاً معاكساً.</p>`}
   ]},

  {st:7,short:'العوامل',title:'العوامل التي تتوقف عليها شدة المجال المغناطيسي',ref:'ص 135',
   q:'تريد مجالاً أقوى عند نقطة معينة قرب سلك أو ملف… ما الذي يمكنك تغييره؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ثلاثة عوامل: التيار وبعد النقطة وعدد اللفات، وأثر زيادة كل منها على B" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><g data-tip="شدة التيار ⟦I⟧: يتناسب المجال طردياً معها ⟦(B ∝ I)⟧. التيار أكبر = مجال أقوى."><rect x="62" y="48" width="236" height="64" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><circle cx="96" cy="80" r="11" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><circle cx="96" cy="80" r="3.5" fill="#2C4A40"/><text x="140" y="87" text-anchor="middle" font-size="20" font-weight="700" fill="#2C4A40" font-family="var(--mono)">I</text><polygon points="160,72 168,60 176,72" fill="#12855A"/><rect x="164" y="72" width="8" height="18" fill="#12855A"/><text x="226" y="87" text-anchor="middle" font-size="20" font-weight="700" fill="#3A7CA5" font-family="var(--mono)">B</text><polygon points="246,72 254,60 262,72" fill="#12855A"/><rect x="250" y="72" width="8" height="18" fill="#12855A"/></g><g data-tip="بعد النقطة عن السلك ⟦d⟧: يتناسب المجال عكسياً معه ⟦(B ∝ 1/d)⟧. كلما ابتعدنا ضعف المجال."><rect x="62" y="128" width="236" height="64" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><circle cx="84" cy="160" r="8" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><line x1="94" y1="160" x2="118" y2="160" stroke="#2C4A40" stroke-width="2" stroke-dasharray="3 3"/><circle cx="121" cy="160" r="3.5" fill="#E8735A"/><text x="140" y="167" text-anchor="middle" font-size="20" font-weight="700" fill="#2C4A40" font-family="var(--mono)">d</text><polygon points="160,152 168,140 176,152" fill="#12855A"/><rect x="164" y="152" width="8" height="18" fill="#12855A"/><text x="226" y="167" text-anchor="middle" font-size="20" font-weight="700" fill="#3A7CA5" font-family="var(--mono)">B</text><rect x="250" y="148" width="8" height="18" fill="#E8735A"/><polygon points="246,166 254,178 262,166" fill="#E8735A"/></g><g data-tip="عدد لفات الملف ⟦N⟧: يتناسب المجال طردياً معه ⟦(B ∝ N)⟧. لفات أكثر = مجال أقوى."><rect x="62" y="208" width="236" height="64" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><path d="M78 226l6 28M88 226l6 28M98 226l6 28M108 226l6 28" stroke="#B9852A" stroke-width="3.5" stroke-linecap="round"/><text x="140" y="247" text-anchor="middle" font-size="20" font-weight="700" fill="#2C4A40" font-family="var(--mono)">N</text><polygon points="160,232 168,220 176,232" fill="#12855A"/><rect x="164" y="232" width="8" height="18" fill="#12855A"/><text x="226" y="247" text-anchor="middle" font-size="20" font-weight="700" fill="#3A7CA5" font-family="var(--mono)">B</text><polygon points="246,232 254,220 262,232" fill="#12855A"/><rect x="250" y="232" width="8" height="18" fill="#12855A"/></g><text x="180" y="300" text-anchor="middle" font-size="14" font-weight="600" fill="#2C4A40" direction="rtl" unicode-bidi="embed">إذا زاد العامل ماذا يحدث للمجال؟</text></svg>`,
   cap:'السهم الأخضر = زيادة، والأحمر = نقصان.<br><b>مرّر المؤشر على كل صف (أو المسه في الجوال) لتعرف العلاقة.</b>',
   side:[
    {book:String.raw`<ol><li>شدة التيار الكهربائي \((I)\) يتناسب التيار تناسبا طرديا مع شدة المجال \((B\propto I)\)</li><li>بعد النقطة عن السلك \((d)\) تتناسب تناسبا عكسيا مع شدة المجال \((B\propto 1/d)\)</li><li>عدد لفات الملف \((N)\) التي يمر فيها التيار وهي تتناسب تناسبا طرديا \((B\propto N)\)</li></ol>`,ref:'ص 135'}
   ],
   body:[
    {title:'ضاعف عاملاً وراقب المجال',widget:(el,B)=>{
      const st={I:1,d:1,N:1};const L={I:'شدة التيار I',d:'بعد النقطة d',N:'عدد اللفات N'};
      const fm=x=>{const s=(+x).toFixed(3);return s.replace(/0+$/,'').replace(/\.$/,'')};
      el.innerHTML=`<p class="sub" style="margin:0 0 8px">ابدأ من الوضع الأصلي، ثم ضاعف أي عامل أو أنقصه إلى النصف. الأرقام هنا «كم مرة» وليست قيماً حقيقية.</p>${['I','d','N'].map(k=>`<div class="w-row"><span class="w-l" style="min-width:120px">${L[k]}</span><button class="btn" type="button" data-k="${k}" data-f="0.5">÷ 2</button><button class="btn" type="button" data-k="${k}" data-f="2">× 2</button><b class="ltr" data-o="${k}"></b></div>`).join('')}<div class="w-facts"><div><span>المجال B يصبح</span><b data-o="B"></b></div></div><div class="spd" dir="ltr"><div class="spd-bar"><i class="spd-n"></i></div></div><div class="w-row"><button class="btn" type="button" data-rs>إعادة</button></div>`;
      const o=k=>el.querySelector(`[data-o="${k}"]`);
      const draw=()=>{const b=st.I*st.N/st.d;['I','d','N'].forEach(k=>o(k).textContent='× '+fm(st[k]));o('B').textContent='× '+fm(b)+' من قيمته الأصلية';el.querySelector('.spd-n').style.width=Math.min(100,b/16*100)+'%'};
      el.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{const k=b.dataset.k;st[k]=Math.min(8,Math.max(0.125,st[k]*+b.dataset.f));draw()});
      el.querySelector('[data-rs]').onclick=()=>{st.I=st.d=st.N=1;draw()};draw();
    }},
    {predict:{q:'ضاعفنا التيار في السلك وضاعفنا في الوقت نفسه بعد النقطة عنه. ماذا يحدث لشدة المجال عند النقطة الجديدة؟',opts:[
     ['تتضاعف',false,'مضاعفة التيار تضاعف المجال، لكن مضاعفة البعد تنصّفه.'],
     ['تبقى كما هي',true,'\\(B\\propto I/d\\): الأثران يلغي أحدهما الآخر (× 2 ثم ÷ 2). جرّبه في التجربة أعلاه.'],
     ['تصبح أربعة أضعاف',false,'هذا لو ضاعفنا التيار وعدد اللفات معاً، لا التيار والبعد.']]}},
    {tip:String.raw`<p>«طردياً» تعني: إذا تضاعف العامل تضاعف المجال. و«عكسياً» تعني: إذا تضاعف العامل نقص المجال إلى النصف. ستجد هذه العوامل الثلاثة مجتمعة في معادلات الدرس التالي، مثل \(B=\mu I/(2\pi a)\) للسلك المستقيم.</p>`}
   ]},

  {st:8,short:'شدة المجال H',title:'شدة المجال المغناطيسي H: ما يصنعه المصدر',ref:'ص 136–137',
   q:'ملفان متطابقان بالتيار نفسه، أحدهما فيه قلب حديدي… هل «المصدر» في الملفين أقوى، أم المادة هي التي تغيّر النتيجة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ملفان متطابقان بالتيار نفسه، أحدهما بقلب هوائي والآخر بقلب حديدي: H متساوية و B مختلفة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="ملف بقلب هوائي: شدة المجال ⟦H⟧ تحددها اللفات والتيار، وكثافة الفيض ⟦B = μ0 H⟧."><rect x="62" y="104" width="100" height="70" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><g stroke="#3A7CA5" stroke-width="2.5"><line x1="70" y1="124" x2="154" y2="124"/><line x1="70" y1="139" x2="154" y2="139"/><line x1="70" y1="154" x2="154" y2="154"/></g></g><g data-tip="ملف مطابق بقلب حديدي: ⟦H⟧ نفسها لأن اللفات والتيار نفسها، لكن ⟦B = μ H⟧ أكبر بكثير لأن نفاذية الحديد كبيرة."><rect x="198" y="104" width="100" height="70" rx="8" fill="#9AA5A0" stroke="#2C4A40" stroke-width="2.5"/><g stroke="#3A7CA5" stroke-width="2.5"><line x1="206" y1="112" x2="290" y2="112"/><line x1="206" y1="121" x2="290" y2="121"/><line x1="206" y1="130" x2="290" y2="130"/><line x1="206" y1="139" x2="290" y2="139"/><line x1="206" y1="148" x2="290" y2="148"/><line x1="206" y1="157" x2="290" y2="157"/><line x1="206" y1="166" x2="290" y2="166"/></g></g><g stroke="#B9852A" stroke-width="4.5" stroke-linecap="round" fill="none"><path d="M76 96l8 86M96 96l8 86M116 96l8 86M136 96l8 86"/><path d="M212 96l8 86M232 96l8 86M252 96l8 86M272 96l8 86"/></g><text x="112" y="80" text-anchor="middle" font-size="14" font-weight="700" fill="#2C4A40" direction="rtl" unicode-bidi="embed">هواء</text><text x="248" y="80" text-anchor="middle" font-size="14" font-weight="700" fill="#2C4A40" direction="rtl" unicode-bidi="embed">حديد</text><rect x="70" y="208" width="220" height="34" rx="9" fill="#4FB3A9"/><text x="180" y="231" text-anchor="middle" font-size="15" font-weight="700" fill="#FBF6EE" direction="rtl" unicode-bidi="embed">H متساوية في الملفين</text><rect x="70" y="250" width="220" height="34" rx="9" fill="#E8735A"/><text x="180" y="273" text-anchor="middle" font-size="15" font-weight="700" fill="#FBF6EE" direction="rtl" unicode-bidi="embed">B أكبر بكثير في الحديد</text></svg>`,
   cap:'الملفان متطابقان (اللفات نفسها والتيار نفسه)، والفرق في القلب فقط.<br><b>مرّر المؤشر على الملفين (أو المسه في الجوال) لتعرف الفرق.</b>',
   side:[
    {book:String.raw`<p>شدة المجال المغناطيسي \(H\) في نقطة ما هي النسبة بين كثافة الفيض المغناطيسي والنفاذية المطلقة للمادة الموجودة في تلك النقطة، أي أن</p>
     <div class="eq">$$H=\frac{B}{\mu}$$<span class="eqno">(5-6)</span></div>`,ref:'ص 136'}
   ],
   body:[
    {book:String.raw`<p>وحدة شدة المجال المغناطيسي هي <b>أمبير لفة لكل متر (AT/m)</b>، وسنرى سبب اختيار هذه الوحدة عندما ندرس العلاقة بين التيار الكهربائي والمجال المغناطيسي. وعلى العكس من كثافة الفيض، فإن شدة المجال المغناطيسي <b>لا تعتمد على نوع المادة</b> المتواجدة في المجال، وإنما تعتمد على مصدر المجال (المغناطيس) فقط. وشدة المجال المغناطيسي هي قيمة متجهه لها مقدار ولها نفس اتجاه كثافة الفيض.</p>`,ref:'ص 137'},
    {predict:{q:'أدخلنا قلباً حديدياً في ملف دون أن نغير التيار. ماذا يحدث لـ \\(H\\) و\\(B\\)؟',opts:[
     ['\\(H\\) تبقى كما هي، و\\(B\\) تزداد كثيراً',true,'\\(H\\) لا تعتمد على نوع المادة بل على المصدر فقط، و\\(B=\\mu H\\) تكبر مع \\(\\mu\\) الحديد.'],
     ['\\(H\\) تزداد و\\(B\\) تبقى كما هي',false,'العكس: المادة لا تغير \\(H\\)، وإنما تغير \\(B\\).'],
     ['الاثنتان تبقيان كما هما',false,'\\(B=\\mu H\\)، ونفاذية الحديد أكبر بكثير من الهواء، فتكبر \\(B\\).']]}},
    {tip:String.raw`<p>فكّر في \(H\) على أنها «الجهد الذي يبذله المصدر» (اللفات والتيار)، وفي \(B\) على أنها «النتيجة داخل المادة». المصدر نفسه يعطي \(H\) نفسها في أي مادة، لكن الحديد يستجيب له بفيض أكبر بكثير من الهواء. من (5-6): \(B=\mu H\).</p>`,title:'H السبب و B النتيجة'}
   ]},

  {st:9,short:'الأمثلة',title:'أمثلة محلولة',ref:'ص 135–137',
   q:'ثلاثة أمثلة من الكتاب: كثافة الفيض من الفيض والمساحة، والفيض في مساحتين متعامدتين، وكثافة الفيض في أربع مواد. الحل الكامل خطوة بخطوة في تبويب «الأمثلة المحلولة».',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مساحة A تساوي 0.5 متر مربع يخترقها الفيض Φ عمودياً، كما في مثال 5-1" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="خطوط الفيض ⟦Φ⟧ تخترق المساحة عمودياً. في مثال (٥-١) الفيض ⟦2 × 10⁻⁵ Wb⟧." stroke="#3A7CA5" stroke-width="3"><line x1="50" y1="110" x2="300" y2="110"/><line x1="50" y1="150" x2="300" y2="150"/><line x1="50" y1="190" x2="300" y2="190"/><g fill="#3A7CA5" stroke="none"><polygon points="314,110 300,103 300,117"/><polygon points="314,150 300,143 300,157"/><polygon points="314,190 300,183 300,197"/></g></g><g data-tip="المساحة ⟦A = 0.5 m²⟧ في مثال (٥-١)، والفيض عمودي عليها فتكون ⟦B = Φ / A⟧."><ellipse cx="180" cy="150" rx="30" ry="86" fill="#C9D3CE" fill-opacity=".85" stroke="#2C4A40" stroke-width="2.5"/></g><text x="300" y="86" text-anchor="middle" font-size="18" font-weight="700" fill="#3A7CA5" font-family="var(--mono)">Φ</text><text x="180" y="270" text-anchor="middle" font-size="16" font-weight="700" fill="#2C4A40" font-family="var(--mono)">A = 0.5 m²</text></svg>`,
   cap:'المساحة والفيض في مثال (٥-١) كما في الشكل (٥-١٢).<br><b>مرّر المؤشر على الخطوط والمساحة (أو المسه في الجوال) لتعرف معناها.</b>',
   side:[
    {html:String.raw`<div class="exl">
     <div class="exc"><header>مثال (٥-١) <span class="ref">ص 135–136</span></header>
      <div class="kv-row"><small>المعطيات</small><span class="kv ltr">\(\Phi=2\times10^{-5}\ \text{Wb}\)</span><span class="kv ltr">\(A=0.5\ \text{m}^2\)</span></div>
      <div class="kv-row"><small>النتيجة</small><span class="kv res ltr">\(B=4\times10^{-5}\ \text{T}\)</span></div></div>
     <div class="exc"><header>مثال (٥-٢) <span class="ref">ص 136</span></header>
      <div class="kv-row"><small>المعطيات</small><span class="kv ltr">\(B=10^{-5}\ \text{T}\)</span><span class="kv ltr">\(A_1=A_2=0.6\ \text{m}^2\)</span></div>
      <div class="kv-row"><small>النتائج</small><span class="kv res ltr">\(\Phi_1=0.6\times10^{-5}\ \text{Wb}\)</span><span class="kv res ltr">\(\Phi_2=0\)</span></div></div>
     <div class="exc"><header>مثال (٥-٣) <span class="ref">ص 137</span></header>
      <div class="kv-row"><small>المعطيات</small><span class="kv ltr">\(H=20\ \text{AT/m}\)</span><span class="kv">أربع مواد</span></div>
      <div class="kv-row"><small>النتائج</small><span class="kv res ltr">\(2.51\times10^{-5}\ \text{T}\)</span><span class="kv res ltr">\(2.513\times10^{-5}\ \text{T}\)</span><span class="kv res ltr">\(2.49\times10^{-5}\ \text{T}\)</span><span class="kv res ltr">\(0.126\ \text{T}\)</span></div></div>
     <div class="w-row"><button class="btn pri" type="button" onclick="var b=document.querySelector('.ltabs button[data-tab=examples]');if(b)b.click()">افتح الأمثلة المحلولة وغيّر الأرقام</button></div></div>`}
   ],
   body:[
    {predict:{q:'في مثال (٥-٢) لماذا يكون الفيض في المساحة \\(A_2\\) صفراً رغم أنها مساوية لـ \\(A_1\\)؟',opts:[
     ['لأن المجال موازٍ لسطحها فلا تمر خطوطه داخلها',true,'الكتاب: خطوط المجال لا تمر داخل هذه المساحة وهي موازية للسطح (الزاوية بين dA و B تساوي 90°).'],
     ['لأن المجال عندها أضعف',false,'المجال منتظم في المنطقة كلها \\((B=10^{-5}\\ \\text{T})\\)؛ الفرق في الاتجاه فقط.'],
     ['لأن مساحتها أصغر',false,'المساحتان متساويتان \\((0.6\\ \\text{m}^2)\\).']]}},
    {book:String.raw`<p>وكما نرى فإن كثافة الفيض لا تتغير بصورة ملحوظة في مكان ما إلا إذا وضعنا فيه مادة مغناطيسية.</p>`,ref:'ص 137'},
    {watch:String.raw`<p>في مثال (٥-٣): طبع الكتاب ناتج (ج) <span class="ltr">2.48 × 10⁻⁵ T</span> والدقيق <span class="ltr">2.49 × 10⁻⁵ T</span>. وفي (د) كتب \(10^{-5}\) مكان شدة المجال 20 ولم يكمل الحساب؛ الصحيح \(B=5000\times4\pi\times10^{-7}\times20=0.126\ \text{T}\)، أي 5000 ضعف قيمة الهواء. في تبويب الأمثلة مفتاح «كما في الكتاب / المصحح».</p>`,fix:true},
    {tip:String.raw`<p>قارن نتائج مثال (٥-٣): الهواء والألمنيوم والمادة الدايامغناطيسية أعطت أرقاماً متقاربة جداً حول \(2.5\times10^{-5}\ \text{T}\)، أما الحديد فأعطى \(0.126\ \text{T}\). هذا هو معنى الجملة أعلاه.</p>`}
   ]},

  {recap:[
   String.raw`الفيض المغناطيسي، المعادلة (5-1): \(\Phi_m=\int B\,dA\)؛ ويقاس بالويبر، و\(B\) بالتسلا \((\text{T}=\text{Wb/m}^2)\). يكون صفراً إذا كان المجال موازياً للسطح (ص 129–131).`,
   String.raw`الملف الحلزوني: مجال منتظم في داخله، وطرفه الذي يدور فيه التيار مع عقارب الساعة جنوبي. الملف الحلقي، المعادلة (5-2): \(B=\dfrac{\mu_0NI}{2\pi R}\)`,
   String.raw`النفاذية، المعادلة (5-3): \(\mu_0=4\pi\times10^{-7}\ \text{H/m}\)، والنفاذية النسبية، المعادلة (5-4): \(\mu_r=\mu/\mu_0\)، والمعادلة (5-5): \(\mu_r=B/B_0\).`,
   String.raw`المواد: حديدومغناطيسية (\(B\) تزداد كثيراً)، بارامغناطيسية (زيادة طفيفة)، دايامغناطيسية (\(B\) تقل). و\(B\) تتناسب طردياً مع \(I\) و\(N\) وعكسياً مع البعد \(d\) (ص 133–135).`,
   String.raw`شدة المجال، المعادلة (5-6): \(H=B/\mu\) بوحدة AT/m، ولا تعتمد على نوع المادة بل على المصدر فقط (ص 136–137).`]}
],
 theory:[
  {h:'الفيض (التدفق) المغناطيسي',ref:'ص 129–130',html:`<p>الفيض المغناطيسي — كما عُرّف الفيض الكهربائي سابقاً — هو <b>عدد الخطوط المغناطيسية التي تعبر وحدة المساحات العمودية</b>. افترض أن \\(dA\\) جزء مساحة صغير من سطح غير منتظم كما في الشكل (٥-٦)، فالفيض المغناطيسي يعبر عنه بشدة المجال \\(B\\) مضروبة في المساحة العمودية \\(dA\\)، ويرمز له بالرمز \\(\\Phi_m\\):</p>
   $$\\Phi_m=\\int B\\,dA \\qquad (5\\text{-}1)$$ $$\\Phi_m=B\\times A\\cos\\theta$$
   <p>إذ يمثل \\(A\\) المساحة التي يقطعها الفيض. ويقاس \\(\\Phi\\) بوحدة <b>الويبر Wb</b> (Weber)، أما \\(B\\) فيقاس <b>بالتسلا T</b>:</p>
   $$\\frac{\\text{Newton}}{\\text{Coulomb}\\times\\text{meter/second}}=\\frac{\\text{Newton}}{\\text{Ampere}\\cdot\\text{meter}}=\\text{Tesla}=\\frac{\\text{Weber}}{\\text{m}^2}$$
   <p>ووحدة التسلا وحدة كبيرة، ويمكن استخدام وحدة <b>الجاوس</b> في نظام جاوس للوحدات حيث \\(1\\ \\text{Tesla}=10^4\\ \\text{Gauss}\\). و\\(dA\\) هو متجه المساحة: قيمته تعطي مقدار المساحة واتجاهه دائماً عمودي على المساحة.</p>`},
  {fig:'(٥-٦)',ref:'ص 130',caption:'عنصر مساحة صغير dA على سطح غير منتظم، والزاوية θ بين متجه المساحة dA والمجال B.',draw:()=>box(fig56(),400)},
  {html:`<div class="mg-figs"><figure>${box(fig57(),340)}<figcaption><b>الشكل (٥-٧)</b> ص 130: \\(dA\\) عمودي على \\(B\\) ⇐ \\(\\Phi=0\\)</figcaption></figure><figure>${box(fig58(),340)}<figcaption><b>الشكل (٥-٨)</b> ص 131: \\(dA\\) في اتجاه \\(B\\) ⇐ \\(\\Phi=BA\\)</figcaption></figure></div>
   <p>في الشكل (٥-٧) الفيض يساوي صفراً لأن المتجه \\(dA\\) عمودي على متجه المجال \\(B\\)؛ أي أن الفيض يساوي صفراً عندما يكون المجال <b>موازياً لسطح المساحة</b> ولا يقطعها. وفي الشكل (٥-٨) الفيض يساوي \\(B\\times A\\) لأن المتجه \\(dA\\) في نفس اتجاه المجال والزاوية المحصورة صفر.</p>`},
  {note:'<b>توضيح للمتدرب (ليس من الكتاب):</b> \\(\\cos 0^\\circ=1\\) (أكبر فيض)، و\\(\\cos 60^\\circ=0.5\\) (نصف الفيض)، و\\(\\cos 90^\\circ=0\\) (لا فيض). جرّب ذلك في المختبر بتدوير السطح.'},
  {h:'المجال المغناطيسي الناتج عن ملف حلزوني يحمل تياراً مستمراً',ref:'ص 131–132',html:`<p><b>شكل المجال</b> (الشكل ٥-٩أ):</p><ul><li>داخل الملف: خطوط مستقيمة متوازية (مجال منتظم).</li><li>خارج الملف يشبه المجال المغناطيسي لساق ممغنط ويكون المجال ضعيفاً جداً.</li><li>اتجاه المجال: في الداخل من الجنوبي إلى الشمالي، وفي الخارج من الشمالي إلى الجنوبي.</li>
   <li>القاعدة المستخدمة: <b>البريمة اليمنى لماكسويل</b> (اللولب يميني اللف): إذا أدرنا رأس البريمة داخل الملف على محوره في نفس اتجاه التيار في الملف يكون اتجاه تقدم البريمة هو نفس اتجاه خطوط المجال داخل الملف.</li></ul>
   <p><b>تحديد قطبي الملف</b> (الشكل ٥-٩ب): طرف الملف الذي يكون فيه اتجاه التيار <b>مع حركة عقارب الساعة</b> يكون قطباً <b>جنوبياً</b>، والطرف الآخر (عكس عقارب الساعة) يكون <b>شمالياً</b>. طرف الملف الذي تدخل إليه خطوط المجال يكون جنوبياً والعكس للطرف الآخر.</p>`},
  {fig:'(٥-٩)',ref:'ص 131',caption:'مقطع طولي في ملف حلزوني: ⊙ تيار خارج من الورقة و⊗ داخل فيها. الخطوط داخل الملف مستقيمة متوازية، وخارجه كمغناطيس قضيبي. (الخطوط محسوبة رسماً.)',draw:()=>fig59()},
  {h:'المجال المغناطيسي الناتج عن ملف حلقي يحمل تياراً مستمراً',ref:'ص 132–133',html:`<p>يمكن حساب كثافة التدفق المغناطيسي في أية نقطة داخل ملف حلقي (الشكل ٥-١٠) على بعد \\(R\\) من المركز بالعلاقة:</p>
   $$B=\\frac{\\mu_0\\,N\\,I}{2\\pi R} \\qquad (5\\text{-}2)$$
   <p>حيث \\(N\\) عدد لفات الملف الحلقي، و\\(R_1\\) نصف القطر الداخلي، و\\(R_2\\) نصف القطر الخارجي، و\\(I\\) شدة التيار المار في الملف (و\\(R\\) بعد النقطة عن المركز). بما أن جميع النقاط الواقعة على المسار الدائري متناظرة بالنسبة للحلقة فإن كثافة المجال متساوية عند جميع هذه النقاط. وإذا كان الفرق بين \\(R_1\\) و\\(R_2\\) صغيراً تكون \\(B\\) متساوية تقريباً عند جميع النقاط داخل الملف.</p>`},
  {fig:'(٥-١٠)',ref:'ص 133',caption:'ملف حلقي (toroid): المسار المتقطع نصف قطره R يمر بالنقطة p، والأسهم عليه اتجاه B.',draw:()=>box(toroidSVG(),320)},
  {h:'النفاذية',ref:'ص 133',html:`<p>تعتمد كثافة الفيض على الخواص المغناطيسية للمادة المحيطة بالسلك أو الموضوعة في المجال، وتسمى <b>النفاذية</b> ويرمز لها بالرمز \\(\\mu\\) ووحدتها الهنري لكل متر (H/m). ونستعمل نفاذية الفراغ كمرجع ويرمز لها بالرمز \\(\\mu_0\\):</p>
   $$\\mu_0=4\\pi\\times10^{-7}\\ \\text{H/m} \\qquad (5\\text{-}3)$$
   <p>وقيمة نفاذية الهواء قريبة جداً من \\(\\mu_0\\). ونسمي النسبة بين نفاذية مادة ما و\\(\\mu_0\\) <b>النفاذية النسبية</b> \\(\\mu_r\\):</p>
   $$\\mu_r=\\frac{\\mu}{\\mu_0} \\qquad (5\\text{-}4)$$ <p>وتعبر النفاذية عن مدى سماحية المادة لمرور خطوط القوى المغناطيسية.</p>`},
  {h:'تصنيف المواد من حيث خواصها المغناطيسية',ref:'ص 133–135',html:`<p>جميع المواد — الغازات والسوائل والمواد الصلبة — لها خواص مغناطيسية بدرجات متفاوتة: ضعيفة أو متوسطة أو قوية، ولدرجة الحرارة أثر كبير عليها، وتوجد مواد لها خواص عكسية أي أن اتجاه المجال فيها يعاكس المجال المسبب. وتنقسم المواد إلى قسمين رئيسين:</p>
   <ol><li><b>مواد متسامتة التمغنط (بارامغناطيسية) Paramagnetic:</b> تميل للحركة من المناطق الضعيفة في المجال إلى المناطق القوية، أي تنجذب نحو المغناطيس، وإذا كانت حرة الدوران اتجهت أطوالها موازية للمجال. منها الألمنيوم والتيتانيوم والأوكسجين. أما الحديد والنيكل والكوبالت وسبائكها ومركباتها فهي مواد بارامغناطيسية قوية جداً ويطلق عليها <b>الحديدومغناطيسية (Ferromagnetic)</b> وتتميز بكبر معامل النفاذية، والتأثيرية المغناطيسية لها موجبة.</li>
   <li><b>مواد دايامغناطيسية (Diamagnetic):</b> تميل إلى الابتعاد عن المجال مهما كان اتجاهه، وإذا أتيحت لها حرية الدوران تجعل محاورها متعامدة على خطوط القوى. منها البزموت والنحاس، ومعامل نفاذيتها <b>أقل من الواحد</b> والقابلية المغناطيسية لها سالبة.</li></ol>
   <p>وإذا كانت كثافة الفيض في الفراغ المحيط بالسلك \\(B_0\\) فإن استبدال الفراغ أو الهواء بوسط آخر يغير كثافة الفيض إلى \\(B\\)، ومعامل الزيادة يمثل قابلية المادة لتركيز الفيض:</p>
   $$\\mu_r=\\frac{B}{B_0} \\qquad (5\\text{-}5)$$
   <p>وكما في الشكل (٥-١١) فإن المادة الفيرومغناطيسية تركّز الفيض وتسلك إلى حد كبير سلوك الأنبوب الذي يحدد مسار السائل دون أن يدعه يتسرب.</p>`},
  {fig:'(٥-١١)',ref:'ص 134',caption:'تأثير المادة المغناطيسية في خطوط الفيض: الخطوط تتجمع داخل القضيب.',draw:()=>box(fig511(),520)},
  {html:`<p>إذا استبدل الهواء بمادة مغناطيسية فهناك ثلاثة احتمالات <span class="ref">ص 135</span>:</p><ol><li>تزداد قيمة \\(B\\) زيادة كبيرة في حالة المواد الحديدية والمغناطيسية.</li><li>تزداد قيمة \\(B\\) زيادة طفيفة جداً في حالة المواد البارامغناطيسية.</li><li>تقل قيمة \\(B\\) في حالة المواد الدايامغناطيسية.</li></ol>`},
  {h:'تعيين اتجاه خطوط المجال حول الموصل',ref:'ص 135',html:`<ol><li><b>قاعدة قبضة اليد اليمنى:</b> عندما تقبض اليد اليمنى على الموصل بحيث يشير الإبهام إلى اتجاه التيار فإن اتجاه الأصابع الملتفة حول السلك يحدد اتجاه خطوط الفيض.</li>
   <li><b>قاعدة البريمة اليمنى لماكسويل:</b> إذا أدرت بريمة بحيث يشير اتجاه اندفاعها إلى اتجاه التيار فإن اتجاه دورانها يحدد اتجاه خطوط المجال (تسمى أيضاً قاعدة اللولب اليميني اللف).</li>
   <li><b>باستخدام بوصلة مغناطيسية صغيرة:</b> إذا وضعت بوصلة على لوح الورق المقوى الذي يخترقه الموصل فإن الاتجاه الذي يتخذه قطبها الشمالي يدل على اتجاه خطوط الفيض.</li></ol>`},
  {h:'العوامل التي تتوقف عليها شدة المجال المغناطيسي',ref:'ص 135',html:`<ol><li>شدة التيار الكهربائي \\(I\\): تتناسب طردياً مع شدة المجال \\((B\\propto I)\\).</li><li>بعد النقطة عن السلك \\(d\\): تتناسب عكسياً مع شدة المجال \\((B\\propto 1/d)\\).</li><li>عدد لفات الملف \\(N\\) التي يمر فيها التيار: تتناسب طردياً \\((B\\propto N)\\).</li></ol>`},
  {h:'شدة المجال المغناطيسي',ref:'ص 136–137',html:`<p>شدة المجال المغناطيسي \\(H\\) في نقطة ما هي النسبة بين كثافة الفيض المغناطيسي والنفاذية المطلقة للمادة الموجودة في تلك النقطة:</p>
   $$H=\\frac{B}{\\mu} \\qquad (5\\text{-}6)$$
   <p>ووحدتها <b>أمبير لفة لكل متر (AT/m)</b>. وعلى العكس من كثافة الفيض، فإن شدة المجال <b>لا تعتمد على نوع المادة</b> الموجودة في المجال، وإنما تعتمد على مصدر المجال فقط. وشدة المجال قيمة متجهة لها نفس اتجاه كثافة الفيض.</p>`},
  {h:'أمثلة محلولة',ref:'ص 135–137',html:`<p>في تبويب «الأمثلة المحلولة»: مثال (٥-١) كثافة الفيض من الفيض والمساحة (الشكل ٥-١٢)، ومثال (٥-٢) الفيض في مساحتين متعامدتين (الشكل ٥-١٣)، ومثال (٥-٣) كثافة الفيض في أربع مواد مختلفة. ونلاحظ من مثال (٥-٣) أن كثافة الفيض لا تتغير بصورة ملحوظة في مكان ما إلا إذا وضعنا فيه مادة مغناطيسية.</p>
   <div class="mg-figs"><figure>${box(fig512(),340)}<figcaption><b>الشكل (٥-١٢)</b> ص 136</figcaption></figure><figure>${box(fig513(),340)}<figcaption><b>الشكل (٥-١٣)</b> ص 136</figcaption></figure></div>`},
  {err:`<div class="fixnote"><ol style="margin:4px 0 0;padding-inline-start:20px"><li>ص 130: وحدة التسلا طُبعت «Coulomb × meyer/second» وصُححت إلى meter.</li>
   <li>ص 132: سُمّي الملف في نص المعادلة (5-2) «ملف لولبي»، والمقصود والمرسوم <b>ملف حلقي</b> كما في العنوان؛ صُحح في النص. والكتاب لا يعرّف \\(R\\) في قائمة الرموز، وهو بعد النقطة عن المركز.</li>
   <li>ص 134: «النفادية» صُححت إلى «النفاذية».</li>
   <li>مثال (٥-٣) ج ص 137: الناتج المطبوع \\(2.48\\times10^{-5}\\) T والدقيق \\(2.488\\times10^{-5}\\approx2.49\\times10^{-5}\\) T.</li>
   <li>مثال (٥-٣) د ص 137: طُبع \\(B=5000\\times4\\pi\\times10^{-7}\\times10^{-5}\\) (كُتب \\(10^{-5}\\) مكان شدة المجال 20) ولم يُحسب الناتج. والصحيح \\(B=5000\\times4\\pi\\times10^{-7}\\times20=0.126\\) T. في الحاسبة مفتاح «كما في الكتاب / المصحح».</li></ol></div>`}
 ],
 lab:(el)=>{
  let Bm=4,A=0.5,th=0,typ='sol',N=200,I=2,sg=1,len=20,R=10.5,mat='air',did={},R0=10.5;
  el.innerHTML=`<div class="grid mg-lab">
   <div class="panel c7"><h2>الفيض الذي يعبر سطحاً <small>مبنية على الأشكال (٥-٦) إلى (٥-٨) و(٥-١٢) و(٥-١٣) ص 130–136</small></h2><div class="svgbox" id="f2a"></div>
    <p class="sub">الخطوط الزرقاء الغامقة هي التي تعبر السطح. السهم الأسود dA عمودي على السطح، و θ الزاوية بينه وبين B.</p></div>
   <div class="panel c5"><h2>التحكم</h2>${sl('f2B','كثافة الفيض B (× 10⁻⁵ T)',0,10,0.1,Bm)}${sl('f2A','المساحة A',0.1,1,0.05,A)}${sl('f2t','الزاوية θ بين dA و B',0,180,1,th)}
    <div class="mg-row"><button class="btn" data-pr="1">مثال (٥-١)</button><button class="btn" data-pr="2">مثال (٥-٢): A₁</button><button class="btn" data-pr="3">مثال (٥-٢): A₂</button></div>
    <div class="facts">${fact('Φ = B·A·cosθ','f2phi')}${fact('cos θ','f2cos')}${fact('B بالجاوس','f2G')}</div></div>
   <div class="panel c12"><h2>الملف الحلزوني والملف الحلقي والمادة داخلهما <small>الأشكال (٥-٩) و(٥-١٠) والمعادلات (5-2) و(5-5) و(5-6)، و(5-17) ص 145</small></h2>
    <div class="mg-row">${segHTML('typ',[['sol','ملف حلزوني'],['tor','ملف حلقي']],typ)}${segHTML('dir',[['1','الاتجاه الأصلي'],['-1','اعكس التيار']],'1')}</div>
    <div class="grid" style="margin-top:6px"><div class="c7"><div class="svgbox" id="f2s"></div><div id="f2ev"></div></div>
     <div class="c5">${sl('f2N','عدد اللفات N',10,2000,10,N)}${sl('f2I','شدة التيار I',0,5,0.1,I)}<div id="f2lw">${sl('f2l','طول الملف ℓ',5,100,1,len)}</div><div id="f2Rw">${sl('f2R','بعد النقطة p عن المركز R (بين R₁ = 8 cm و R₂ = 13 cm)',8,13,0.1,R)}</div>
      <div class="sub" style="margin-top:8px">المادة داخل الملف (قيم مثال ٥-٣)</div>${segHTML('mat',MATS.map(m=>[m[0],m[1]]),mat)}
      <div class="facts">${fact('H (لا تتغير بالمادة)','f2H')}${fact('B₀ في الهواء = μ₀H','f2B0')}${fact('B = μ₀μᵣH','f2Bv')}${fact('μᵣ = B/B₀ (5-5)','f2mr')}</div></div></div>
    <div id="f2tor"></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="f2st"></ol></div></div>`;
  const $=s=>el.querySelector(s);
  const drawA=()=>{const W=640,H=300,cx=320,cy=150,r=110*Math.sqrt(A),t=th*D;let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="سطح في مجال منتظم">`;
   const ext=r*Math.abs(Math.cos(t));let n=0;const nl=Math.max(3,Math.round(3+Bm*1.1));
   const ys=[];for(let k=0;k<nl;k++)ys.push(30+k*(H-60)/(nl-1));
   ys.forEach(y=>{const hit=Math.abs(y-cy)<ext-1&&Math.abs(Math.cos(t))>0.01;if(hit)n++;s+=`<path d="M20 ${fx(y)}H${W-30}" stroke="var(${hit?'--blue':'--muted'})" stroke-width="${hit?2.4:1.2}" opacity="${hit?1:0.55}"/>`+head(W-28,y,0,hit?'--blue':'--muted',6)});
   if(Bm===0)s+=arT(cx,22,'B = 0: لا خطوط',{fs:13,col:'--muted'});
   s+=discSVG(cx,cy,r,-t,{fill:'var(--live-soft)'})+arrow(cx,cy,cx+75*Math.cos(-t),cy+75*Math.sin(-t),'--fg',2.6)+S.t(fx(cx+92*Math.cos(-t)),fx(cy+92*Math.sin(-t)+4),'dA','','middle',14);
   if(th>0&&th<180){s+=`<path d="M${cx+40} ${cy}A40 40 0 0 0 ${fx(cx+40*Math.cos(-t))} ${fx(cy+40*Math.sin(-t))}" fill="none" stroke="var(--stop)" stroke-width="1.8"/>`+S.t(fx(cx+56*Math.cos(-t/2)),fx(cy+56*Math.sin(-t/2)+4),'θ','','middle',14)}
   s+=S.t(W-20,22,'B','b','end',16)+arT(90,H-10,`خطوط تعبر السطح: ${n}`,{fs:13});
   $('#f2a').innerHTML=s+'</svg>';const ph=Bm*1e-5*A*Math.cos(t);
   $('#f2B-v').textContent=fm(Bm,1)+' × 10⁻⁵ T';$('#f2A-v').textContent=fm(A,2)+' m²';$('#f2t-v').textContent=th+'°';
   chOut(el,'f2cha',[['phi',ph*1e6]]);$('#f2phi').textContent=Math.abs(ph)<1e-12?'0 Wb':sci(ph,3)+' Wb';$('#f2cos').textContent=fm(B.round(Math.cos(t),3),3);$('#f2G').textContent=fm(Bm*1e-5*1e4,3)+' G'};
  const mu=()=>MATS.find(m=>m[0]===mat)[2];
  const drawS=()=>{const Hv=typ==='sol'?N*I/(len/100):N*I/(2*PI*R/100),B0=MU0*Hv,Bv=B0*mu();
   $('#f2lw').style.display=typ==='sol'?'':'none';$('#f2Rw').style.display=typ==='tor'?'':'none';
   $('#f2N-v').textContent=N;$('#f2I-v').textContent=fm(I,1)+' A';$('#f2l-v').textContent=len+' cm';$('#f2R-v').textContent=fm(R,1)+' cm';
   chOut(el,'f2chs',[['B',Bv*1e3]]);$('#f2H').textContent=fm(sig(Hv,4))+' AT/m';$('#f2B0').textContent=sci(B0,4)+' T';$('#f2Bv').textContent=sci(Bv,mat==='al'?7:4)+' T';$('#f2mr').textContent=mat==='al'?'1.000022':fm(mu());const sat=Bv>2?' <span class="mg-chip warn">نموذج خطي: μᵣ ثابتة هنا، والحديد الحقيقي يتشبع قرب 1.5–2 T (الدرس 6.1)</span>':'';
   if(typ==='sol'){const o=solenoidSVG({sg,comp:true,core:mat==='air'?'':MATS.find(m=>m[0]===mat)[1],dl:I<=0?1e9:(mat==='fe'?0.8:1.5)});$('#f2s').innerHTML=I<=0?o.svg.replace(/<path d="M[^"]*" fill="none" stroke="var\(--blue\)" stroke-width="1.3"\/>/,''):o.svg;
     $('#f2ev').innerHTML=`<svg viewBox="0 0 640 70" role="img" aria-label="منظر الطرفين">${endView(80,35,sg<0,sg<0?'N':'S')}${arT(200,40,sg<0?'الطرف الأيسر: التيار عكس عقارب الساعة ⇐ شمالي':'الطرف الأيسر: التيار مع عقارب الساعة ⇐ جنوبي',{fs:12.5})}${endView(560,35,sg>0,sg>0?'N':'S')}${arT(440,40,sg>0?'الطرف الأيمن: عكس عقارب الساعة ⇐ شمالي':'الطرف الأيمن: مع عقارب الساعة ⇐ جنوبي',{fs:12.5})}</svg>${sat}<p class="sub">كل طرف كما يراه شخص ينظر إليه من الخارج (قاعدة تحديد القطبين ص 132). المعادلة \\(B=\\mu_0\\mu_r N I/\\ell\\) هي (5-17) ص 145 للملف الطويل.</p>`;B.math($('#f2ev'));$('#f2tor').innerHTML=''}
   else{$('#f2s').innerHTML=toroidSVG({R:80+(R-8)/5*50,dir:sg,W:340,H:320}).replace('<svg ','<svg style="max-width:340px;display:block;margin:auto" ');$('#f2ev').innerHTML=sat+'<p class="sub">الخطوط محصورة داخل الحلقة (لا مجال خارجها). اسحب «R» لتنقل النقطة p بين الحافة الداخلية والخارجية.</p>';
     const pts=[];for(let k=0;k<=50;k++){const r=8+k*0.1;pts.push([r,MU0*mu()*N*I/(2*PI*r/100)])}const ym=nice(Math.max(...pts.map(p=>p[1]))*1.05||1e-6);
     $('#f2tor').innerHTML=`<div class="svgbox" style="max-width:640px;margin:8px auto 0">${plotSVG({w:640,h:200,x0:8,x1:13,y0:0,y1:ym,xt:[8,9,10,11,12,13],yt:[0,ym/2,ym],yf:v=>sci(v,2),left:70,xl:'R (cm)',yl:'B (T)',series:[{pts,col:'--blue'}],extra:(X,Y)=>`<circle cx="${fx(X(R))}" cy="${fx(Y(Bv))}" r="5" fill="var(--stop)"/>`,aria:'B مع بعد النقطة عن المركز'})}</div>`}};
  $('#f2B').oninput=e=>{Bm=+e.target.value;drawA()};$('#f2A').oninput=e=>{A=+e.target.value;drawA()};$('#f2t').oninput=e=>{th=+e.target.value;drawA()};
  el.querySelectorAll('[data-pr]').forEach(b=>b.onclick=()=>{const k=b.dataset.pr;if(k==='1'){Bm=4;A=0.5;th=0}else{Bm=1;A=0.6;th=k==='2'?0:90}$('#f2B').value=Bm;$('#f2A').value=A;$('#f2t').value=th;did['p'+k]=1;drawA()});
  segBind(el,'typ',v=>{typ=v;drawS()});segBind(el,'dir',v=>{sg=+v;did.rev=1;drawS()});segBind(el,'mat',v=>{mat=v;drawS()});
  $('#f2N').oninput=e=>{N=+e.target.value;drawS()};$('#f2I').oninput=e=>{I=+e.target.value;drawS()};$('#f2l').oninput=e=>{len=+e.target.value;drawS()};$('#f2R').oninput=e=>{R=+e.target.value;did.Rmin=Math.min(did.Rmin||R0,R);did.Rmax=Math.max(did.Rmax||R0,R);drawS()};
  const steps=stepsUI($('#f2st'),[
   {t:'مثال (٥-١)',x:'اضغط «مثال (٥-١)»: <span class="ltr">A = 0.5 m²</span> عمودية على المجال و <span class="ltr">B = 4 × 10⁻⁵ T</span>، فيكون <span class="ltr">Φ = 2 × 10⁻⁵ Wb</span> كما في المثال.',done:()=>Bm===4&&A===0.5&&th===0},
   {t:'الزاوية 60°',x:'دوّر السطح حتى <span class="ltr">θ = 60°</span>: يقل عدد الخطوط العابرة ويصبح الفيض نصف قيمته لأن <span class="ltr">cos 60° = 0.5</span>.',done:()=>th===60},
   {t:'السطح موازٍ للمجال',x:'اجعل <span class="ltr">θ = 90°</span>: لا خط يعبر السطح و <span class="ltr">Φ = 0</span> (الشكل ٥-٧، والمساحة A₂ في مثال ٥-٢).',done:()=>th===90},
   {t:'اعكس التيار في الملف',x:'في لوحة الملف اضغط «اعكس التيار»: يتبادل القطبان N و S وتنقلب البوصلتان (قاعدة البريمة اليمنى).',done:()=>did.rev&&typ==='sol'},
   {t:'ضع قلباً حديدياً',x:'اختر «حديد (فيرو)»: تبقى H كما هي لأنها لا تعتمد على المادة، بينما تصبح B أكبر بـ 5000 مرة (المعادلة 5-5). جرّب الألمنيوم والدايامغناطيسية: التغير طفيف جداً.',done:()=>mat==='fe'},
   {t:'الملف الحلقي',x:'اختر «ملف حلقي» وحرّك R من الحافة الداخلية <span class="ltr">8 cm</span> إلى الخارجية <span class="ltr">13 cm</span>: تقل B لأن R في المقام في المعادلة (5-2).',done:()=>typ==='tor'&&did.Rmin<=8.5&&did.Rmax>=12.5}
  ]);
  drawA();drawS();loopOn(el,()=>steps.check());
 },
 examples:[
  {title:'مثال (٥-١)',ref:'ص 135–136',q:'<p>إذا كان الفيض المغناطيسي في المساحة A المبينة في الشكل (٥-١٢) <span class="ltr">2×10⁻⁵ Wb</span> احسب كثافة الفيض حول هذه المساحة.</p>',
   given:[{id:'phi',label:'الفيض المغناطيسي (× 10⁻⁵)',sym:'\\Phi',unit:'Wb',value:2},{id:'A',label:'المساحة',sym:'A',unit:'m²',value:0.5}],
   solve:g=>{const b=g.phi*1e-5/g.A;return [{t:'الفيض عمودي على المساحة، إذاً:',f:`B=\\frac{\\Phi}{A}=\\frac{${g.phi}\\times10^{-5}}{${g.A}}=${sx(b,3)}\\ \\text{T}`,v:sci(b,3),unit:'T',final:true}]}},
  {title:'مثال (٥-٢)',ref:'ص 136',q:'<p>احسب الفيض المغناطيسي في المساحتين المتعامدتين A₁ و A₂ (الشكل ٥-١٣) إذا كانت كثافة الفيض في المنطقة المحيطة بالمساحتين <span class="ltr">B = 10⁻⁵ T</span>، وكان اتجاهها عمودياً على المساحة A₁.</p>',
   given:[{id:'B',label:'كثافة الفيض (× 10⁻⁵)',sym:'B',unit:'T',value:1},{id:'A1',label:'المساحة الأولى',sym:'A_1',unit:'m²',value:0.6},{id:'A2',label:'المساحة الثانية',sym:'A_2',unit:'m²',value:0.6}],
   solve:g=>{const p1=g.B*1e-5*g.A1;return [{t:'الفيض في المساحة A₁ (المجال عمودي عليها، θ = 0):',f:`\\Phi_1=B\\times A_1=${g.B}\\times10^{-5}\\times${g.A1}`,v:fm(sig(g.B*g.A1,4))+' × 10⁻⁵',unit:'Wb',final:true},
    {t:'الفيض في المساحة A₂ يساوي الصفر لأن خطوط المجال لا تمر داخل هذه المساحة وهي موازية للسطح (θ = 90°):',f:`\\Phi_2=B\\,A_2\\cos90^\\circ=0`,v:0,unit:'Wb',final:true}]}},
  {title:'مثال (٥-٣)',ref:'ص 137',q:`<p>ينتج مغناطيس مجالاً شدته <span class="ltr">20 AT/m</span> في نقطة معينة من الفضاء المجاور له. احسب كثافة الفيض في هذه النقطة إذا كانت نفاذية الفضاء المحيط بها تساوي: أ- μ₀ (الفراغ أو الهواء)، ب- <span class="ltr">1.000022 μ₀</span> (الألمنيوم: مادة بارامغناطيسية)، ج- <span class="ltr">0.99 μ₀</span> (مادة دايامغناطيسية)، د- <span class="ltr">5000 μ₀</span> (نوع من الحديد: مادة مغناطيسية).</p>${bfSeg('e53')}`,
   given:[{id:'H',label:'شدة المجال',sym:'H',unit:'AT/m',value:20},{id:'m2',label:'النفاذية النسبية (ب)',sym:'\\mu_r',unit:'',value:1.000022},{id:'m3',label:'النفاذية النسبية (ج)',sym:'\\mu_r',unit:'',value:0.99},{id:'m4',label:'النفاذية النسبية (د)',sym:'\\mu_r',unit:'',value:5000}],
   solve:(g,B,isBook)=>{const bk=isBook&&bfMode('e53')==='book';const b1=MU0*g.H,b2=g.m2*MU0*g.H,b3=g.m3*MU0*g.H,b4=g.m4*MU0*g.H;
    const out=[{t:'من المعادلة (5-6) نستنتج أن \\(B=\\mu H\\):'},
     {t:'أ- الفراغ:',f:`B=\\mu_0H=4\\pi\\times10^{-7}\\times${g.H}`,v:sci(b1,3),unit:'T',final:true},
     {t:'ب- الألمنيوم:',f:`B=${g.m2}\\times4\\pi\\times10^{-7}\\times${g.H}`,v:sci(b2,4),unit:'T',final:true},
     {t:'ج- المادة الدايامغناطيسية:'+(bk?' <span class="sub">(كما طُبع: 2.48 — الدقيق 2.488 ≈ 2.49)</span>':''),f:`B=${g.m3}\\times4\\pi\\times10^{-7}\\times${g.H}`,v:bk?'2.48 × 10⁻⁵':sci(b3,3),unit:'T',final:true}];
    if(bk)out.push({t:'د- الحديد: <b>كما طُبع في الكتاب</b> — كُتب \\(10^{-5}\\) مكان شدة المجال 20، ولم يُحسب الناتج:',f:`B=5000\\,\\mu_0\\times H=5000\\times4\\pi\\times10^{-7}\\times10^{-5}\\ \\text{T}\\ \\ (?)`});
    else out.push({t:'د- الحديد'+(bfMode('e53')==='fixed'?' (المصحح):':':'),f:`B=${g.m4}\\times4\\pi\\times10^{-7}\\times${g.H}`,v:sig(b4,3),unit:'T',final:true});
    out.push({t:'كما نرى فإن كثافة الفيض لا تتغير بصورة ملحوظة إلا إذا وضعنا مادة مغناطيسية (الحديد).'});return out},
   note:'<span class="fixnote"><b>ملاحظة على الكتاب:</b> في (ج) طبع الكتاب <span class="ltr">2.48 × 10⁻⁵ T</span> والدقيق <span class="ltr">2.49 × 10⁻⁵ T</span>. وفي (د) كتب \\(10^{-5}\\) بدل 20 ولم يكمل الحساب؛ الناتج الصحيح <span class="ltr">0.126 T</span> — أي 5000 ضعف قيمة الهواء. اختر «المصحح» لترى الحل الصحيح.</span>'}
 ],
 quiz:[
  {q:'وحدة الفيض المغناطيسي هي:',o:['التسلا T','الويبر Wb','الأمبير لفة AT','الهنري H'],c:1,e:'ص 130.'},
  {q:'1 تسلا يساوي:',o:['1 Wb/m²','1 Wb·m²','10⁻⁴ Gauss','1 AT/m'],c:0,e:'ص 130: Tesla = Weber/m²، و Tesla = 10⁴ Gauss.'},
  {q:'يكون الفيض المغناطيسي عبر سطح صفراً عندما:',o:['يكون المجال عمودياً على السطح','يكون المجال موازياً للسطح','تكون المساحة كبيرة','يكون المجال قوياً'],c:1,e:'ص 130 والشكل (٥-٧): dA عمودي على B.'},
  {q:'سطح مساحته 0.4 m² في مجال 0.5 T والزاوية بين dA و B تساوي 60°. الفيض:',o:['0.2 Wb','0.1 Wb','0.17 Wb','0 Wb'],c:1,e:'\\(\\Phi=BA\\cos\\theta=0.5\\times0.4\\times0.5=0.1\\) Wb.'},
  {q:'طرف الملف الحلزوني الذي يكون فيه التيار مع حركة عقارب الساعة (عند النظر إليه) يكون:',o:['قطباً شمالياً','قطباً جنوبياً','بلا قطبية','يعتمد على المادة'],c:1,e:'ص 132.'},
  {q:'المادة التي نفاذيتها النسبية أقل من الواحد هي مادة:',o:['حديدومغناطيسية','بارامغناطيسية','دايامغناطيسية','موصلة'],c:2,e:'ص 134: مثل البزموت والنحاس.'},
  {q:'عند وضع قلب حديدي داخل ملف مع بقاء التيار كما هو، فإن:',o:['H تزيد و B ثابتة','H ثابتة و B تزيد كثيراً','الاثنتان ثابتتان','الاثنتان تقلان'],c:1,e:'ص 137: H لا تعتمد على نوع المادة، و B = μH.'},
  {q:'في الملف الحلقي (المعادلة 5-2)، كلما زاد بعد النقطة R عن المركز:',o:['تزيد B','تقل B','لا تتغير B','تنعكس B'],c:1,e:'\\(B=\\mu_0NI/(2\\pi R)\\): R في المقام.'}
 ]
});

/* ======================================================================
   Lesson u5-l3 — B و H حول سلك، القوة على موصل، القوة بين موصلين (ص 138–142)
   ====================================================================== */
function fig514(){let s=`<svg viewBox="0 0 460 200" role="img" aria-label="قاعدة اليد اليمنى">`;
  s+=`<path d="M20 100H440" stroke="var(--fg)" stroke-width="5"/>`+head(40,100,PI,'--fg',10);
  [0,1,2].forEach(k=>{const x=120+k*26,ry=34+k*16;s+=`<ellipse cx="${x}" cy="100" rx="${10+k*3}" ry="${ry}" fill="none" stroke="var(--blue)" stroke-width="2"/>`+head(x+(10+k*3),100-6,PI/2,'--stop',6)});
  s+=`<path d="M250 70Q250 58 262 58H360Q372 58 372 70V130Q372 142 360 142H262Q250 142 250 130Z" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.6"/>`;
  for(let k=0;k<4;k++)s+=`<path d="M${270+k*24} 58V142" stroke="var(--fg)" stroke-width="1" opacity=".5"/>`;
  s+=`<path d="M372 80H400Q420 80 420 100Q420 120 400 120H372" fill="var(--blue-soft)" stroke="var(--fg)"/><path d="M255 76Q215 72 214 92L250 96" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.6"/>`+arrow(236,84,196,84,'--fg',2.4);
  s+=arT(300,176,'الإبهام = اتجاه التيار، والأصابع الملتفة = اتجاه المجال',{fs:13});
  return s+'</svg>'}
function fig515(){let s=`<svg viewBox="0 0 320 240" role="img" aria-label="المجال حول سلك مستقيم طويل">`;
  s+=`<ellipse cx="160" cy="130" rx="110" ry="34" fill="none" stroke="var(--blue)" stroke-width="1.8"/><path d="M160 20V230" stroke="var(--live)" stroke-width="7"/>`+head(160,40,-PI/2,'--live',9)+S.t(176,44,'I','','start',14);
  s+=arrow(160,130,268,130,'--fg',1.6)+S.t(214,124,'a','','middle',14)+arrow(270,130,250,94,'--blue',2.4)+S.t(244,86,'H','b','middle',14);
  return s+'</svg>'}
function flemingSVG(o){o=o||{};const cx=o.cx||110,cy=o.cy||110,L=o.L||70;let s='';
  const ax=[[L,0,'--blue',o.bl||'المجال (السبابة)'],[-L*0.55,L*0.55,'--live',o.il||'التيار (الوسطى)'],[0,-L,'--stop',o.fl||'القوة (الإبهام)']];
  ax.forEach(([dx,dy,c,t])=>{s+=arrow(cx,cy,cx+dx,cy+dy,c,3)+arT(cx+dx*1.1+(dx<0?-6:dx>0?6:0),cy+dy*1.12+(dy>0?14:dy<0?-6:4),t,{fs:12.5,a:dx<0?'end':dx>0?'start':'middle',col:c})});
  return s+`<circle cx="${cx}" cy="${cy}" r="5" fill="var(--fg)"/>`}
function fig516(){return `<svg viewBox="0 0 300 210" role="img" aria-label="قاعدة فليمنج لليد اليسرى">${flemingSVG({cx:120,cy:120})}${arT(150,204,'اليد اليسرى: الأصابع الثلاثة متعامدة',{fs:12.5,col:'--muted'})}</svg>`}
function fig517(){let s=`<svg viewBox="0 0 460 250" role="img" aria-label="موصلان متوازيان يحملان تيارين">`;
  s+=`<circle cx="240" cy="170" r="90" fill="var(--live-soft)" opacity=".5" stroke="var(--stop)" stroke-dasharray="6 4"/>`;
  s+=`<path d="M40 80H440" stroke="var(--muted)" stroke-width="12" stroke-linecap="round" opacity=".6"/><path d="M40 170H440" stroke="var(--muted)" stroke-width="12" stroke-linecap="round" opacity=".6"/>`;
  s+=arrow(300,80,370,80,'--blue',2.6)+S.t(390,72,'I1','b')+S.t(30,76,'1','','end',14)+arrow(300,170,370,170,'--blue',2.6)+S.t(390,162,'I2','b')+S.t(30,174,'2','','end',14);
  s+=arrow(240,80,190,80,'--blue',2.4)+S.t(186,70,'B2','b','end')+arrow(240,80,240,124,'--fg',4)+S.t(252,118,'F1','','start',14);
  s+=`<path d="M60 52H420" stroke="var(--fg)" stroke-width="1"/>`+head(60,52,PI,'--fg',5)+head(420,52,0,'--fg',5)+S.t(240,46,'ℓ','','middle',14);
  s+=`<path d="M450 80V170" stroke="var(--fg)" stroke-width="1"/>`+head(450,80,-PI/2,'--fg',5)+head(450,170,PI/2,'--fg',5)+S.t(444,130,'a','','end',14)+arrow(240,170,240,92,'--stop',1.2);
  return s+'</svg>'}
const lgI=v=>Math.pow(10,v/100-1),lgPos=I=>Math.round((Math.log10(Math.max(I,0.1))+1)*100);
const r3=x=>+(+x).toPrecision(x>=100?3:2);

B.lesson({
 id:'u5-l3',unit:5,order:3,pages:'138–142',
 title:'المجال حول سلك مستقيم والقوة على الموصلات',
 summary:'كثافة الفيض وشدة المجال حول سلك مستقيم طويل (5-7) و(5-8)، والقوة على موصل يحمل تياراً في مجال مغناطيسي F = BIℓ sinθ وقاعدة فليمنج لليد اليسرى، والقوة المتبادلة بين موصلين متوازيين: تجاذب إذا كان التياران في اتجاه واحد وتنافر إذا تعاكسا. مع الأمثلة (٥-٤) إلى (٥-٨).',
 stations:[
  {intro:true},

  {st:1,short:'المجال حول سلك مستقيم',title:'شدة المجال الناتج عن موصل مستقيم يحمل تياراً مستمراً',ref:'ص 138',
   q:'عرفنا أن المجال حول السلك دوائر تضعف كلما ابتعدنا… فكم يساوي بالأرقام عند نقطة تبعد عنه مسافة معينة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="سلك رأسي يمر فيه تيار إلى أعلى، ودائرة نصف قطرها a حوله، وسهم H مماسي للدائرة" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><g data-tip="خط مجال دائري حول السلك: كل نقاطه على البعد نفسه ⟦a⟧ من السلك، فلها جميعاً القيمة نفسها لـ ⟦B⟧ و⟦H⟧."><ellipse cx="180" cy="176" rx="118" ry="38" fill="none" stroke="#3A7CA5" stroke-width="3"/></g><g data-tip="السلك المستقيم الطويل والتيار ⟦I⟧ فيه إلى أعلى."><line x1="180" y1="40" x2="180" y2="292" stroke="#2C4A40" stroke-width="12" stroke-linecap="round"/><line x1="180" y1="40" x2="180" y2="292" stroke="#F2C14E" stroke-width="7" stroke-linecap="round"/><polygon points="180,22 168,46 192,46" fill="#2C4A40"/><text x="202" y="46" font-size="17" font-weight="700" fill="#2C4A40" font-family="var(--mono)">I</text></g><g data-tip="⟦a⟧: المسافة بين النقطة والمسقط العمودي لها على محور السلك، أي البعد العمودي عن السلك."><line x1="186" y1="176" x2="292" y2="176" stroke="#2C4A40" stroke-width="2.5" stroke-dasharray="6 4"/><text x="236" y="168" text-anchor="middle" font-size="17" font-weight="700" fill="#2C4A40" font-family="var(--mono)">a</text></g><circle cx="298" cy="176" r="6" fill="#E8735A" stroke="#2C4A40" stroke-width="1.5"/><g data-tip="⟦H⟧ (ومعها ⟦B⟧) عند النقطة: مماسية للدائرة، واتجاهها حسب قاعدة اليد اليمنى: هنا إلى الخلف بعيداً عنك."><line x1="298" y1="176" x2="282" y2="132" stroke="#E8735A" stroke-width="4" stroke-linecap="round"/><polygon points="277,116 274,136 290,131" fill="#E8735A"/><text x="290" y="114" font-size="17" font-weight="700" fill="#E8735A" font-family="var(--mono)">H</text></g><text x="180" y="308" text-anchor="middle" font-size="14" font-weight="600" fill="#2C4A40" direction="rtl" unicode-bidi="embed">النقطة على بعد a من السلك</text></svg>`,
   cap:'المجال المغناطيسي الناتج عن مرور تيار في سلك مستقيم طويل، كما في الشكل (٥-١٥).<br><b>مرّر المؤشر على السلك والدائرة والمسافة a والسهم H (أو المسه في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>ترتبط خطوط القوى المغناطيسية باتجاه التيار الذي ولدها حسب <b>قاعدة اليد اليمنى</b> الموضحة في الشكل (٥-١٤) نصت هذه القاعدة على أنه عند القبض على السلك الحامل للتيار باليد اليمنى، بحيث يشير الإبهام إلى اتجاه التيار، فإن أطراف باقي الأصابع تشير إلى اتجاه المجال.</p>`,ref:'ص 138'},
    {predict:{q:'في الرسم التيار إلى أعلى. طبّق قاعدة اليد اليمنى: كيف تدور خطوط المجال إذا نظرت إليها من أعلى؟',opts:[
     ['مع حركة عقارب الساعة',false,'هذا عندما يكون التيار إلى أسفل (بعيداً عن عينك وأنت تنظر من أعلى).'],
     ['عكس حركة عقارب الساعة',true,'الإبهام إلى أعلى نحو عينك، فتلتف الأصابع عكس عقارب الساعة؛ لذلك يتجه H عند النقطة اليمنى إلى الخلف (بعيداً عنك) كما في الرسم.'],
     ['لا تدور؛ تخرج من السلك إلى الخارج',false,'خطوط المجال حول السلك دوائر مغلقة مركزها السلك.']]}}
   ],
   body:[
    {book:String.raw`<p>ويعطى الحث المغناطيسي الناتج عن التيار \(I\) المار في سلك مستقيم طويل بالمعادلة</p>
     <div class="eq">$$B=\frac{\mu\,I}{2\pi a}$$<span class="eqno">(5-7)</span></div>
     <p>حيث \(a\) هي المسافة بين النقطة التي نحسب عندها الحث والمسقط العمودي لهذه النقطة على محور السلك، كما هو موضح في الشكل (٥-١٥).<br>و باستعمال القانون (5-6) نجد أن شدة المجال الناشئ عن هذا التيار هي</p>
     <div class="eq">$$H=\frac{I}{2\pi a}$$<span class="eqno">(5-8)</span></div>
     <p>من هذه العلاقة نفهم اختيار وحدة AT/m لشدة المجال، ونلاحظ أن شدة المجال <b>لاتعتمد على نفاذية الوسط</b> كما أشرنا إلى ذلك في نهاية الفصل السابق.</p>`,ref:'ص 138'},
    {predict:{q:'نقطة على بعد \\(a\\) من سلك. ابتعدنا حتى صار البعد \\(2a\\) مع بقاء التيار. ماذا يحدث لـ \\(B\\)؟',opts:[
     ['تقل إلى الربع',false,'الربع يكون لو كان \\(a^2\\) في المقام. في (5-7) البعد \\(a\\) وحده في المقام.'],
     ['لا تتغير',false,'\\(a\\) في مقام المعادلة (5-7)، فتغيّرها يغيّر \\(B\\).'],
     ['تقل إلى النصف',true,'\\(B=\\mu I/(2\\pi a)\\): مضاعفة \\(a\\) تنصّف \\(B\\)، وهذا هو التناسب العكسي \\(B\\propto1/d\\) من الدرس السابق.']]}},
    {tip:String.raw`<p>المقام \(2\pi a\) هو محيط الدائرة التي تقع عليها النقطة؛ التيار «يتوزع» أثره على هذا المحيط، فكلما كبرت الدائرة ضعف المجال. ومن (5-8): \(H=I/(2\pi a)\) أي «أمبير» مقسوماً على «متر»، ومن هنا وحدة AT/m. مثال (٥-٤) من الكتاب: سلك يحمل <span class="ltr">15 A</span> في الفراغ، على بعد <span class="ltr">4 cm</span> منه: \(B=7.5\times10^{-5}\ \text{T}\) و<span class="ltr">H = 59.7 A/m</span>.</p>`,title:'لماذا 2πa؟'},
    {watch:String.raw`<p>(5-7) فيها \(\mu\) فتتغير \(B\) بتغير الوسط، أما (5-8) فليس فيها \(\mu\): شدة المجال \(H\) واحدة في الهواء أو الحديد. وحوّل \(a\) إلى المتر قبل التعويض (<span class="ltr">4 cm = 4 × 10⁻² m</span>).</p>`}
   ]},

  {st:2,short:'القوة على موصل',title:'القوة الميكانيكية المؤثرة على موصل يحمل تياراً مستمراً في مجال مغناطيسي',ref:'ص 139–140',
   q:'وضعنا سلكاً يمر فيه تيار بين قطبي مغناطيس… فقفز السلك فجأة! إلى أين يتحرك، وبأي قوة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="سلك بين قطبي مغناطيس يخرج تياره من الورقة، والقوة عليه إلى أعلى، ومحاور قاعدة فليمنج لليد اليسرى" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="القطب الشمالي ⟦N⟧ للمغناطيس."><rect x="40" y="92" width="58" height="136" rx="6" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5"/><text x="69" y="168" text-anchor="middle" font-size="20" font-weight="700" fill="#FBF6EE" font-family="var(--mono)">N</text></g><g data-tip="القطب الجنوبي ⟦S⟧ للمغناطيس."><rect x="262" y="92" width="58" height="136" rx="6" fill="#C9D3CE" stroke="#2C4A40" stroke-width="2.5"/><text x="291" y="168" text-anchor="middle" font-size="20" font-weight="700" fill="#2C4A40" font-family="var(--mono)">S</text></g><g data-tip="خطوط مجال المغناطيس ⟦B⟧: من ⟦N⟧ إلى ⟦S⟧ (السبابة في قاعدة فليمنج)." stroke="#3A7CA5" stroke-width="2.5"><line x1="100" y1="112" x2="252" y2="112"/><line x1="100" y1="208" x2="252" y2="208"/><line x1="100" y1="132" x2="252" y2="132"/><line x1="100" y1="188" x2="252" y2="188"/><g fill="#3A7CA5" stroke="none"><polygon points="260,112 248,106 248,118"/><polygon points="260,132 248,126 248,138"/><polygon points="260,188 248,182 248,194"/><polygon points="260,208 248,202 248,214"/></g></g><g data-tip="مقطع السلك: ⟦⊙⟧ يعني أن التيار ⟦I⟧ خارج من الورقة نحوك (الإصبع الوسطى)."><circle cx="180" cy="160" r="16" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><circle cx="180" cy="160" r="5" fill="#2C4A40"/></g><g data-tip="القوة ⟦F⟧ على السلك: إلى أعلى هنا (الإبهام). تكون أكبر ما يمكن ⟦BℓI⟧ عندما يكون السلك عمودياً على المجال."><line x1="180" y1="140" x2="180" y2="68" stroke="#2C4A40" stroke-width="6" stroke-linecap="round"/><polygon points="180,48 166,72 194,72" fill="#2C4A40"/><text x="200" y="64" font-size="18" font-weight="700" fill="#2C4A40" font-family="var(--mono)">F</text></g><text x="180" y="262" text-anchor="middle" font-size="14" font-weight="700" fill="#2C4A40" direction="rtl" unicode-bidi="embed">السبابة: المجال</text><text x="180" y="282" text-anchor="middle" font-size="14" font-weight="700" fill="#2C4A40" direction="rtl" unicode-bidi="embed">الوسطى: التيار</text><text x="180" y="302" text-anchor="middle" font-size="14" font-weight="700" fill="#2C4A40" direction="rtl" unicode-bidi="embed">الإبهام: القوة</text></svg>`,
   cap:'سلك بين قطبي مغناطيس: المجال من N إلى S، والتيار خارج نحوك، فتكون القوة إلى أعلى.<br><b>مرّر المؤشر على القطبين والخطوط والسلك والسهم F (أو المسه في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>يحدد اتجاه القوة \(F\) التي تظهر على سلك حامل لتيار كهربائي \(I\) عند وضعه في مجال مغناطيسي كثافة فيضه \(B\) باستخدام <b>قاعدة فليمنج لليد اليسرى</b> الموضحة في الشكل (٥-١٦) التي تنص على ما يلي: <b>إذا أشارت السبابة إلى اتجاه المجال، وأشارت الوسطى إلى اتجاه التيار فإن الإبهام سيشير إلى اتجاه القوة.</b></p>`,ref:'ص 139'},
    {predict:{q:'في الرسم: لو عكسنا اتجاه التيار فقط (صار داخلاً في الورقة ⊗)، إلى أين تتجه القوة؟',opts:[
     ['تبقى إلى أعلى',false,'عكس التيار يعكس اتجاه الوسطى، فيعكس الإبهام معه.'],
     ['تنعدم',false,'القوة تنعدم عندما يكون السلك موازياً للمجال، لا عند عكس التيار.'],
     ['إلى أسفل',true,'طبّق اليد اليسرى: السبابة نحو S، والوسطى داخل الورقة، فيشير الإبهام إلى أسفل.']]}}
   ],
   body:[
    {book:String.raw`<p>أما قيمة هذه القوة فهي:</p>
     <div class="eq">$$F=B\times\ell\times I\times\sin\theta$$<span class="eqno">(5-9)</span></div>
     <p>حيث \(\ell\) هو طول السلك ، \(\theta\) هي الزاوية بين اتجاه التيار وخطوط المجال. ونستنتج أن القوة تصل إلى قيمتها القصوى \(B\ell I\) عندما يكون السلك عمودياً على المجال أي عندما \(\theta=90^\circ\). أما إذاً كان السلك موازياً للمجال أي \(\theta=0^\circ\) فإن القوة تنعدم.</p>`,ref:'ص 139–140'},
    {predict:{q:'سلك يحمل تياراً وُضع موازياً لخطوط المجال تماماً \\((\\theta=0^\\circ)\\). كم القوة عليه؟',opts:[
     ['صفر',true,'\\(\\sin0^\\circ=0\\)، فالقوة تنعدم كما يقول الكتاب.'],
     ['أكبر قيمة \\(B\\ell I\\)',false,'أكبر قيمة عند \\(\\theta=90^\\circ\\) (السلك عمودي على المجال).'],
     ['نصف القيمة العظمى',false,'النصف عند \\(\\theta=30^\\circ\\) لأن \\(\\sin30^\\circ=0.5\\).']]}},
    {tip:String.raw`<p>مجال السلك (دوائر حوله) يُضاف إلى مجال المغناطيس في جهة ويُطرح منه في الجهة الأخرى. في الرسم: فوق السلك يتعاكسان فتقل الخطوط، وتحته يتفقان فتتكاثف الخطوط. الخطوط المتكاثفة «تدفع» السلك نحو الجهة الخفيفة، أي إلى أعلى: الاتجاه نفسه الذي تعطيه قاعدة فليمنج. تراه في لوحة «القوة على موصل بين قطبي مغناطيس» في تبويب المختبر.</p>`,title:'لماذا يُدفع السلك؟'},
    {watch:String.raw`<p>هنا اليد <b>اليسرى</b> (للقوة على سلك في مجال)، أما في المحطة السابقة فاليد <b>اليمنى</b> (لاتجاه المجال حول السلك). واجعل الأصابع الثلاثة متعامدة.</p>`},
    {add:String.raw`<p>هذه القوة هي التي تدير كل محرك كهربائي: موصلات العضو الدوار يمر فيها تيار وهي داخل مجال مغناطيسي، فتؤثر عليها قوى تصنع عزماً. ومن أمثلتها الصغيرة سماعة الجوال: ملف خفيف داخل مغناطيس يتحرك ذهاباً وإياباً مع التيار.</p>`,title:'من حولك'}
   ]},

  {st:3,short:'القوة بين موصلين',title:'القوة المغناطيسية المتبادلة بين موصلين يمر بهما تيار كهربائي',ref:'ص 140–141',
   q:'كل سلك يصنع مجالاً، وكل سلك في مجال تؤثر عليه قوة… فماذا يحدث لسلكين متجاورين يمر في كل منهما تيار؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="موصلان متوازيان على بعد a يمر فيهما تياران في الاتجاه نفسه، والقوتان بينهما تجاذب" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="الموصل 1 والتيار ⟦I1⟧ فيه نحو اليمين."><line x1="50" y1="100" x2="300" y2="100" stroke="#2C4A40" stroke-width="14" stroke-linecap="round"/><line x1="50" y1="100" x2="300" y2="100" stroke="#C9D3CE" stroke-width="9" stroke-linecap="round"/><polygon points="268,90 288,100 268,110" fill="#3A7CA5"/><text x="246" y="84" font-size="15" font-weight="700" fill="#3A7CA5" font-family="var(--mono)">I1</text><text x="34" y="105" text-anchor="middle" font-size="15" font-weight="700" fill="#2C4A40" font-family="var(--mono)">1</text></g><g data-tip="الموصل 2 والتيار ⟦I2⟧ فيه نحو اليمين أيضاً (في الاتجاه نفسه)."><line x1="50" y1="220" x2="300" y2="220" stroke="#2C4A40" stroke-width="14" stroke-linecap="round"/><line x1="50" y1="220" x2="300" y2="220" stroke="#C9D3CE" stroke-width="9" stroke-linecap="round"/><polygon points="268,210 288,220 268,230" fill="#3A7CA5"/><text x="246" y="250" font-size="15" font-weight="700" fill="#3A7CA5" font-family="var(--mono)">I2</text><text x="34" y="225" text-anchor="middle" font-size="15" font-weight="700" fill="#2C4A40" font-family="var(--mono)">2</text></g><g data-tip="⟦a⟧: المسافة بين الموصلين. الموصل 1 يقع في مجال الموصل 2 على هذا البعد."><line x1="318" y1="108" x2="318" y2="212" stroke="#2C4A40" stroke-width="2"/><polygon points="318,104 313,114 323,114" fill="#2C4A40"/><polygon points="318,216 313,206 323,206" fill="#2C4A40"/><text x="332" y="166" font-size="16" font-weight="700" fill="#2C4A40" font-family="var(--mono)">a</text></g><g data-tip="القوة ⟦F1⟧ على الموصل 1: نحو الموصل 2، لأن التيارين في الاتجاه نفسه (تجاذب)."><line x1="140" y1="110" x2="140" y2="142" stroke="#E8735A" stroke-width="5"/><polygon points="140,156 130,138 150,138" fill="#E8735A"/><text x="156" y="146" font-size="15" font-weight="700" fill="#E8735A" font-family="var(--mono)">F1</text></g><g data-tip="القوة ⟦F2⟧ على الموصل 2: تساوي ⟦F1⟧ في القيمة وتعاكسها في الاتجاه، أي نحو الموصل 1."><line x1="140" y1="210" x2="140" y2="178" stroke="#E8735A" stroke-width="5"/><polygon points="140,164 130,182 150,182" fill="#E8735A"/><text x="156" y="186" font-size="15" font-weight="700" fill="#E8735A" font-family="var(--mono)">F2</text></g><text x="180" y="300" text-anchor="middle" font-size="14" font-weight="600" fill="#2C4A40" direction="rtl" unicode-bidi="embed">تياران في اتجاه واحد: تجاذب</text></svg>`,
   cap:'موصلان متوازيان طول كل منهما ℓ والمسافة بينهما a، كما في الشكل (٥-١٧).<br><b>مرّر المؤشر على الموصلين والقوتين والمسافة a (أو المسه في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>حيث أن كل موصل يمر فيه تيار ينشأ حوله مجال مغناطيسي وأن لكل مجال مغناطيسي قوة مغناطيسية تؤثر على الموصل الذي يمر به التيار ولهذا إذا وجد موصلين كما في الشكل (٥-١٧) ويمر بكل منهما تيار كهربائي \(I_1\) ، \(I_2\) فإن المجال المغناطيسي \(B_2\) الناشئ عن التيار الثاني يؤثر بقوة مقدارها \(F_1\) ,يمكن التعبير عن القوة التي يؤثر بها موصل على آخر كما في الخطوات التالية:</p>`,ref:'ص 140–141'},
    {predict:{q:'موصلان متوازيان يمر فيهما تياران في اتجاهين متعاكسين. ماذا يحدث؟',opts:[
     ['يتجاذبان',false,'التجاذب عندما يكون التياران في الاتجاه نفسه، كما في الرسم.'],
     ['يتنافران',true,'الكتاب: يتنافران إذا كان التياران في عكس الاتجاه (ص 141).'],
     ['لا يؤثر أحدهما في الآخر',false,'كل منهما يقع في مجال الآخر ويمر فيه تيار، فلا بد من قوة.']]}}
   ],
   body:[
    {book:String.raw`<p>لنعتبر المجال المغناطيسي الناشئ عن الموصل 2 والتي تعطى قيمته بالمعادلة التالية:</p>
     <div class="eq">$$B_2=\frac{\mu_0 I_2}{2\pi\times a}$$<span class="eqno">(5-10)</span></div>
     <p>يقع الموصل الأول في المجال المغناطيسي للموصل الثاني والذي يبعد عنه مسافة \(a\) كما في الشكل (٥-١٧) ، وبالتالي فإن القوة المغناطيسية \(F_1\) تعطى بالمعادلة التالية:</p>
     <div class="eq">$$F_1=B_2\times I_1\times\ell=I_1\times\ell\left(\frac{\mu_0I_2}{2\pi\times a}\right)=\frac{\ell\,\mu_0 I_1 I_2}{2\pi\times a}$$<span class="eqno">(5-11)</span></div>
     <p>والقوة لكل وحدة أطوال تعطى بالعلاقة التالية :</p>
     <div class="eq">$$\frac{F_1}{\ell}=\frac{\mu_0 I_1 I_2}{2\pi\times a}$$<span class="eqno">(5-12)</span></div>
     <p>و بالمثل نحصل على القوة المؤثرة على كل وحدة طول من الموصل 2 ، \(F_2\) ، وهي تساوي القوة \(F_1\) في القيمة وتعاكسها في الاتجاه. أما اتجاه القوتين فإنه يعتمد على اتجاه التيارين، <b>فإذا كان التياران في نفس الاتجاه يتجاذب الموصلان، ويتنافران إذا كان التياران في عكس الاتجاه.</b></p>`,ref:'ص 141'},
    {watch:String.raw`<p>في الكتاب طُبعت الجملة «يقع الموصل الثاني في المجال المغناطيسي للموصل الأول»، والمعادلتان (5-10) و(5-11) تعنيان العكس: الموصل <b>الأول</b> في مجال الموصل <b>الثاني</b>؛ كتبناها هنا بحسب المعادلات.</p>`,fix:true},
    {predict:{q:'ضاعفنا التيار في الموصلين كليهما (كل منهما × 2) مع بقاء المسافة. ماذا يحدث للقوة بينهما؟',opts:[
     ['تتضاعف',false,'القوة تتناسب مع حاصل الضرب \\(I_1I_2\\)، وكلاهما تضاعف.'],
     ['تبقى كما هي',false,'التياران في بسط المعادلة (5-12)، فزيادتهما تزيد القوة.'],
     ['تصبح أربعة أضعاف',true,'\\(F/\\ell\\propto I_1I_2=2\\times2=4\\). لهذا تكون القوى هائلة عند القصر (مثال ٥-٨).']]}},
    {tip:String.raw`<p>القوة على السلك 1 من المعادلة (5-9) نفسها مع \(\sin90^\circ=1\) (السلك عمودي على دوائر مجال السلك 2): \(F_1=B_2I_1\ell\)، ثم نعوض \(B_2\) من (5-10)، وهي المعادلة (5-7) للسلك المستقيم في الفراغ. لا جديد إلا تركيب معادلتين عرفتهما.</p>`,title:'من أين جاءت (5-11)؟'},
    {add:String.raw`<p>في لوحات التوزيع الكبيرة تُثبت القضبان النحاسية (Busbars) بعوازل قوية على مسافات محسوبة؛ لأن تيار القصر قد يولد بينها قوى تثنيها أو تقتلعها، كما يبين مثال (٥-٨).</p>`,title:'من الواقع'}
   ]},

  {st:4,short:'الأمثلة',title:'أمثلة محلولة',ref:'ص 139–142',
   q:'خمسة أمثلة من الكتاب على المعادلات من (5-7) إلى (5-12). الحل الكامل خطوة بخطوة في تبويب «الأمثلة المحلولة».',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="قضيبا توزيع متوازيان يبعدان 30 سم ويمر فيهما 600 أمبير في اتجاهين متضادين، كما في مثال 5-8" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><g data-tip="قضيب التوزيع الأول: يمر فيه ⟦600 A⟧ نحو اليمين في مثال (٥-٨)."><rect x="56" y="96" width="248" height="20" rx="4" fill="#D9895B" stroke="#2C4A40" stroke-width="2.5"/><polygon points="276,84 296,90 276,96" fill="#2C4A40"/><text x="236" y="80" font-size="14" font-weight="700" fill="#2C4A40" font-family="var(--mono)">600 A</text></g><g data-tip="قضيب التوزيع الثاني: يمر فيه ⟦600 A⟧ في الاتجاه المضاد (نحو اليسار)، فتكون القوة بينهما تنافراً."><rect x="56" y="204" width="248" height="20" rx="4" fill="#D9895B" stroke="#2C4A40" stroke-width="2.5"/><polygon points="84,236 64,230 84,224" fill="#2C4A40"/><text x="96" y="252" font-size="14" font-weight="700" fill="#2C4A40" font-family="var(--mono)">600 A</text></g><g data-tip="المسافة بين القضيبين ⟦a = 30 cm = 0.3 m⟧."><line x1="180" y1="122" x2="180" y2="198" stroke="#2C4A40" stroke-width="2" stroke-dasharray="5 4"/><text x="196" y="166" font-size="14" font-weight="700" fill="#2C4A40" font-family="var(--mono)">30 cm</text></g><g data-tip="قوتا التنافر: تدفعان القضيبين بعيداً عن بعضهما. عند القصر ⟦72000 A⟧ تزداد القوة كثيراً لأنها تتناسب مع حاصل ضرب التيارين." fill="#E8735A"><polygon points="110,92 100,72 120,72"/><rect x="106" y="60" width="8" height="14"/><polygon points="110,228 100,248 120,248"/><rect x="106" y="246" width="8" height="14"/></g><text x="180" y="300" text-anchor="middle" font-size="14" font-weight="600" fill="#2C4A40" direction="rtl" unicode-bidi="embed">تياران متضادان: تنافر</text></svg>`,
   cap:'قضيبا التوزيع في مثال (٥-٨).<br><b>مرّر المؤشر على القضيبين والمسافة والأسهم (أو المسه في الجوال) لتعرف معناها.</b>',
   side:[
    {html:String.raw`<div class="exl">
     <div class="exc"><header>مثال (٥-٤) <span class="ref">ص 139</span></header>
      <div class="kv-row"><small>المعطيات</small><span class="kv ltr">\(I=15\ \text{A}\)</span><span class="kv ltr">\(a=4\ \text{cm}\)</span><span class="kv">في الفراغ</span></div>
      <div class="kv-row"><small>النتائج</small><span class="kv res ltr">\(B=7.5\times10^{-5}\ \text{T}\)</span><span class="kv res ltr">\(H=59.7\ \text{A/m}\)</span></div></div>
     <div class="exc"><header>مثال (٥-٥) <span class="ref">ص 140</span></header>
      <div class="kv-row"><small>المعطيات</small><span class="kv ltr">\(\ell=10\ \text{cm}\)</span><span class="kv ltr">\(I=2\ \text{A}\)</span><span class="kv ltr">\(F=0.04\ \text{N}\)</span></div>
      <div class="kv-row"><small>النتائج</small><span class="kv res ltr">\(B=0.2\ \text{T}\ (90^\circ)\)</span><span class="kv res ltr">\(B=0.4\ \text{T}\ (30^\circ)\)</span></div></div>
     <div class="exc"><header>مثال (٥-٦) <span class="ref">ص 141–142</span></header>
      <div class="kv-row"><small>المعطيات</small><span class="kv ltr">\(a=30\ \text{cm}\)</span><span class="kv ltr">\(F/\ell=20\times10^{-7}\ \text{N/m}\)</span><span class="kv ltr">\(I_1=2\ \text{A}\)</span></div>
      <div class="kv-row"><small>النتيجة</small><span class="kv res ltr">\(I_2=1.5\ \text{A}\)</span></div></div>
     <div class="exc"><header>مثال (٥-٧) <span class="ref">ص 142</span></header>
      <div class="kv-row"><small>المعطيات</small><span class="kv ltr">\(\ell=1\ \text{m}\)</span><span class="kv ltr">\(I_1=I_2=1\ \text{A}\)</span><span class="kv ltr">\(a=1\ \text{m}\)</span></div>
      <div class="kv-row"><small>النتيجة</small><span class="kv res ltr">\(F=2\times10^{-7}\ \text{N}\)</span></div></div>
     <div class="exc"><header>مثال (٥-٨) <span class="ref">ص 142</span></header>
      <div class="kv-row"><small>المعطيات</small><span class="kv ltr">\(a=30\ \text{cm}\)</span><span class="kv ltr">\(I=600\ \text{A}\)</span><span class="kv ltr">\(I_{sc}=72000\ \text{A}\)</span></div>
      <div class="kv-row"><small>النتائج</small><span class="kv res ltr">\(0.24\ \text{N/m}\)</span><span class="kv res ltr">\(3456\ \text{N/m}\)</span></div></div>
     <div class="w-row"><button class="btn pri" type="button" onclick="var b=document.querySelector('.ltabs button[data-tab=examples]');if(b)b.click()">افتح الأمثلة المحلولة وغيّر الأرقام</button></div></div>`}
   ],
   body:[
    {predict:{q:'في مثال (٥-٨) التياران في قضيبي التوزيع متضادان. ما نوع القوة بينهما؟',opts:[
     ['تجاذب',false,'التجاذب عندما يكون التياران في الاتجاه نفسه.'],
     ['لا قوة لأن التيارين متساويان',false,'تساوي التيارين لا يلغي القوة؛ مقدارها من (5-12).'],
     ['تنافر',true,'الكتاب: وهي قوة تنافر بين قضيبي التوزيع، لأن التيارين متضادان.']]}},
    {book:String.raw`<p>يتضح من النتائج أن قصر الدائرة قد يؤدي إلى تحطيم قضبان التوزيع نتيجة للزيادة الهائلة في القوى الكهرومغناطيسية.</p>`,ref:'ص 142'},
    {watch:String.raw`<p>في مثال (٥-٨) طُبع ناتج القوة عند القصر <span class="ltr">2456 N</span>، والصحيح <span class="ltr">3456 N</span>: التيار زاد 120 مرة فتزيد القوة \(120^2=14400\) مرة، و<span class="ltr">0.24 × 14400 = 3456</span>. وفي مثال (٥-٤) يذكر الحل «المعادلتين (5-5) و(5-6)» والمستعمل فعلاً (5-7) و(5-8). في تبويب الأمثلة مفتاح «كما في الكتاب / المصحح» لمثال (٥-٨).</p>`,fix:true},
    {tip:String.raw`<p>مثال (٥-٧) ليس مسألة عادية: القوة \(2\times10^{-7}\ \text{N}\) لكل متر بين تيارين كل منهما <span class="ltr">1 A</span> على بعد <span class="ltr">1 m</span> هي التي عُرّفت بها وحدة الأمبير زمناً طويلاً.</p>`,title:'لماذا مثال (٥-٧) مهم؟'}
   ]},

  {recap:[
   String.raw`حول سلك مستقيم طويل: المعادلة (5-7): \(B=\dfrac{\mu I}{2\pi a}\)، والمعادلة (5-8): \(H=\dfrac{I}{2\pi a}\) ولا تعتمد على نفاذية الوسط. والاتجاه بقاعدة اليد اليمنى (ص 138).`,
   String.raw`القوة على موصل في مجال، المعادلة (5-9): \(F=B\ell I\sin\theta\)؛ أكبر ما يمكن عند \(90^\circ\) وتنعدم عند \(0^\circ\)، واتجاهها بقاعدة فليمنج لليد اليسرى (ص 139–140).`,
   String.raw`بين موصلين متوازيين: المعادلة (5-10): \(B_2=\dfrac{\mu_0I_2}{2\pi a}\)، والمعادلة (5-11): \(F_1=\dfrac{\ell\mu_0I_1I_2}{2\pi a}\)، والمعادلة (5-12): \(\dfrac{F_1}{\ell}=\dfrac{\mu_0I_1I_2}{2\pi a}\)`,
   String.raw`تياران في اتجاه واحد: تجاذب، ومتعاكسان: تنافر. والقوة تتناسب مع حاصل ضرب التيارين، لذلك تكون هائلة عند القصر (مثال ٥-٨).`]}
],
 theory:[
  {h:'شدة المجال الناتج عن موصل مستقيم يحمل تياراً مستمراً',ref:'ص 138',html:`<p>ترتبط خطوط القوى المغناطيسية باتجاه التيار الذي ولدها حسب <b>قاعدة اليد اليمنى</b> الموضحة في الشكل (٥-١٤): عند القبض على السلك الحامل للتيار باليد اليمنى بحيث يشير الإبهام إلى اتجاه التيار، فإن أطراف باقي الأصابع تشير إلى اتجاه المجال.</p>
   <p>ويعطى الحث المغناطيسي الناتج عن التيار \\(I\\) المار في سلك مستقيم طويل بالمعادلة:</p>
   $$B=\\frac{\\mu\\,I}{2\\pi a} \\qquad (5\\text{-}7)$$
   <p>حيث \\(a\\) المسافة بين النقطة التي نحسب عندها الحث والمسقط العمودي لهذه النقطة على محور السلك (الشكل ٥-١٥). وباستعمال القانون (5-6) نجد أن شدة المجال الناشئ عن هذا التيار:</p>
   $$H=\\frac{I}{2\\pi a} \\qquad (5\\text{-}8)$$
   <p>من هذه العلاقة نفهم اختيار وحدة AT/m لشدة المجال، ونلاحظ أن شدة المجال <b>لا تعتمد على نفاذية الوسط</b>.</p>`},
  {html:`<div class="mg-figs"><figure>${box(fig514(),440)}<figcaption><b>الشكل (٥-١٤)</b> قاعدة اليد اليمنى — ص 138</figcaption></figure><figure>${box(fig515(),300)}<figcaption><b>الشكل (٥-١٥)</b> المجال المغناطيسي الناتج عن مرور تيار في سلك مستقيم طويل — ص 138</figcaption></figure></div>`},
  {h:'القوة الميكانيكية المؤثرة على موصل يحمل تياراً مستمراً في مجال مغناطيسي',ref:'ص 139–140',html:`<p>يحدد اتجاه القوة \\(F\\) التي تظهر على سلك حامل لتيار \\(I\\) عند وضعه في مجال مغناطيسي كثافة فيضه \\(B\\) باستخدام <b>قاعدة فليمنج لليد اليسرى</b> (الشكل ٥-١٦): <b>إذا أشارت السبابة إلى اتجاه المجال، وأشارت الوسطى إلى اتجاه التيار فإن الإبهام سيشير إلى اتجاه القوة.</b> أما قيمة هذه القوة:</p>
   $$F=B\\times\\ell\\times I\\times\\sin\\theta \\qquad (5\\text{-}9)$$
   <p>حيث \\(\\ell\\) طول السلك، و\\(\\theta\\) الزاوية بين اتجاه التيار وخطوط المجال. تصل القوة إلى قيمتها القصوى \\(B\\ell I\\) عندما يكون السلك عمودياً على المجال \\((\\theta=90^\\circ)\\)، وتنعدم إذا كان السلك موازياً للمجال \\((\\theta=0^\\circ)\\).</p>`},
  {fig:'(٥-١٦)',ref:'ص 140',caption:'قاعدة فليمنج لليد اليسرى: السبابة للمجال، والوسطى للتيار، والإبهام للقوة.',draw:()=>box(fig516(),300)},
  {note:'<b>توضيح للمتدرب (ليس من الكتاب):</b> مجال السلك يضاف إلى مجال المغناطيس في جهة ويطرح منه في الجهة الأخرى، فتتكاثف الخطوط في جهة وتتخلخل في الأخرى، ويُدفع السلك من الجهة الكثيفة نحو الجهة الخفيفة. تراه في المختبر مع اتجاه القوة نفسه الذي تعطيه قاعدة فليمنج.'},
  {h:'القوة المغناطيسية المتبادلة بين موصلين يمر بهما تيار كهربائي',ref:'ص 140–141',html:`<p>كل موصل يمر فيه تيار ينشأ حوله مجال مغناطيسي، ولكل مجال قوة تؤثر على الموصل الذي يمر به تيار. فإذا وجد موصلان كما في الشكل (٥-١٧) يمر بكل منهما تيار \\(I_1\\) و\\(I_2\\) فإن المجال \\(B_2\\) الناشئ عن التيار الثاني يؤثر على الموصل الأول بقوة \\(F_1\\). المجال الناشئ عن الموصل 2:</p>
   $$B_2=\\frac{\\mu_0 I_2}{2\\pi a} \\qquad (5\\text{-}10)$$
   <p>يقع الموصل الأول في المجال المغناطيسي للموصل الثاني على بعد \\(a\\) منه، وبالتالي فإن القوة \\(F_1\\):</p>
   $$F_1=B_2\\,I_1\\,\\ell=I_1\\,\\ell\\left(\\frac{\\mu_0 I_2}{2\\pi a}\\right)=\\frac{\\ell\\,\\mu_0 I_1 I_2}{2\\pi a} \\qquad (5\\text{-}11)$$
   <p>والقوة لكل وحدة أطوال:</p>
   $$\\frac{F_1}{\\ell}=\\frac{\\mu_0 I_1 I_2}{2\\pi a} \\qquad (5\\text{-}12)$$
   <p>وبالمثل نحصل على القوة \\(F_2\\) المؤثرة على الموصل 2، وهي تساوي \\(F_1\\) في القيمة وتعاكسها في الاتجاه. أما اتجاه القوتين فيعتمد على اتجاه التيارين: <b>إذا كان التياران في نفس الاتجاه يتجاذب الموصلان، ويتنافران إذا كان التياران في عكس الاتجاه.</b></p>`},
  {fig:'(٥-١٧)',ref:'ص 141',caption:'الموصل 1 يقع على الدائرة التي نصف قطرها a حول الموصل 2؛ المجال B₂ عنده مماسي، والقوة F₁ نحو الموصل 2 (التياران في اتجاه واحد: تجاذب).',draw:()=>box(fig517(),460)},
  {h:'أمثلة محلولة',ref:'ص 139–142',html:`<p>في تبويب «الأمثلة المحلولة»: (٥-٤) B و H على بعد 4 cm من سلك يحمل 15 A، (٥-٥) كثافة الفيض من القوة على سلك عند 90° و30°، (٥-٦) التيار في موصل ثانٍ من قوة التجاذب، (٥-٧) القوة بين موصلين متر واحد وأمبير واحد، (٥-٨) القوة بين قضيبي توزيع في التشغيل العادي وعند القصر. يتضح من مثال (٥-٨) أن قصر الدائرة قد يؤدي إلى تحطيم قضبان التوزيع نتيجة للزيادة الهائلة في القوى الكهرومغناطيسية (القوة تتناسب مع مربع التيار).</p>`},
  {err:`<div class="fixnote"><ol style="margin:4px 0 0;padding-inline-start:20px"><li>عنوان الشكل (٥-١٥) طُبع «المغناطيس الناتج عن مرور تيار…» وصُحح إلى «المجال المغناطيسي الناتج…».</li>
   <li>ص 141: طُبع «يقع الموصل الثاني في المجال المغناطيسي للموصل الأول»، والمعادلات (5-10) و(5-11) تعني العكس: الموصل الأول في مجال الموصل الثاني؛ صُحح في النص.</li>
   <li>مثال (٥-٤) ص 139: يذكر الحل «المعادلتين (5-5) و(5-6)» والمستعمل فعلاً (5-7) و(5-8).</li>
   <li>مثال (٥-٦): استعمل الحل الرمز d للمسافة (وهي a)، و\\(F_{21}\\) للقوة لكل وحدة طول.</li>
   <li>مثال (٥-٨) ص 142: ناتج القوة عند القصر طُبع <span class="ltr">2456 N</span>، والصحيح <span class="ltr">3456 N</span> (= 0.24 × 14400 لأن التيار زاد 120 مرة). في الحاسبة مفتاح «كما في الكتاب / المصحح».</li></ol></div>`}
 ],
 lab:(el)=>{
  let Bf=0.2,I=2,out=true,len=10,th=90,fr=1,did={};
  let md='two',I1=2,I2=1.5,s1=1,s2=1,a=30,ll=1;
  el.innerHTML=`<div class="grid mg-lab">
   <div class="panel c7"><h2>القوة على موصل بين قطبي مغناطيس <small>الشكل (٥-١٦) والمعادلة (5-9) ص 139–140</small></h2><div class="svgbox" id="f3a"></div>
    <p class="sub">مقطع في السلك (⊙ التيار خارج نحوك، ⊗ داخل). الخطوط محصلة مجال المغناطيس ومجال السلك. السهم الأحمر = القوة F.</p></div>
   <div class="panel c5"><h2>التحكم</h2>${sl('f3B','كثافة فيض المغناطيس B',0,1,0.01,Bf)}${sl('f3I','شدة التيار I',0,10,0.1,I)}${sl('f3l','طول السلك داخل المجال ℓ',1,60,1,len)}${sl('f3t','الزاوية θ بين السلك والمجال',0,90,1,th)}
    <div class="mg-row">${segHTML('dir',[['out','التيار ⊙'],['in','التيار ⊗']],'out')}${segHTML('fr',[['1','N يسار'],['-1','N يمين']],'1')}</div>
    <div class="mg-row"><button class="btn" data-p3="a">مثال (٥-٥) 90°</button><button class="btn" data-p3="b">مثال (٥-٥) 30°</button><button class="btn" data-p3="c">تمرين 2</button><button class="btn" data-p3="d">تمرين 3</button></div>
    <div class="facts">${fact('F = B·ℓ·I·sinθ','f3F')}${fact('اتجاه القوة','f3d')}</div><div class="svgbox" id="f3top" style="max-width:320px;margin:8px auto 0"></div></div>
   <div class="panel c12"><h2>موصلان متوازيان <small>الشكل (٥-١٧) والمعادلات (5-7) و(5-8) و(5-10) إلى (5-12) ص 138–141</small></h2>
    <div class="mg-row">${segHTML('md',[['two','موصلان'],['one','سلك واحد ونقطة على بعد a']],md)}</div>
    <div class="grid" style="margin-top:4px"><div class="c7"><div class="svgbox" id="f3b"></div><p class="sub">عدد الخطوط للرسم فقط (يتغير بنسبة التيارين). الأسهم الحمراء = القوة على كل موصل.</p></div>
     <div class="c5"><div id="f3w1">${sl('f3i1','التيار I₁ (الموصل 1 — يسار)',0,600,1,lgPos(I1))}${segHTML('s1',[['1','⊙'],['-1','⊗']],'1')}</div>${sl('f3i2','التيار I₂ (الموصل 2 — يمين)',0,600,1,lgPos(I2))}${segHTML('s2',[['1','⊙'],['-1','⊗']],'1')}${sl('f3a2','المسافة a',1,100,1,a)}
      <div class="mg-row"><button class="btn" data-p4="54">مثال (٥-٤)</button><button class="btn" data-p4="56">مثال (٥-٦)</button><button class="btn" data-p4="57">مثال (٥-٧)</button><button class="btn" data-p4="58">مثال (٥-٨)</button><button class="btn" data-p4="58s">(٥-٨) عند القصر</button><button class="btn" data-p4="t4">تمرين 4</button></div>
      <div class="facts" id="f3f"></div><div class="mg-row"><span class="mg-chip" id="f3chip"></span></div></div></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="f3st"></ol></div></div>`;
  const $=s=>el.querySelector(s);
  const drawA=()=>{const W=640,H=360,cx=320,cy=180,sI=out?1:-1,F=Bf*I*len/100*Math.sin(th*D);
   const fdir=-sI*fr; // screen y direction of force (−1 = up)
   const dy=clamp(F/0.5,0,1)*40*fdir;const wy=cy+dy;
   const src=[{t:'u',bx:fr*1,by:0}];if(I>0&&th>0)src.push({t:'w',x:cx,y:wy,I:sI*clamp(45*Math.sqrt(I/2)*Math.sqrt(0.2/Math.max(Bf,0.02))*Math.sin(th*D),4,130)});
   if(Bf===0)src[0].bx=0.0001*fr;
   const f=(x,y)=>psiAt(src,x,y,8);const dl=16;let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="سلك بين قطبي مغناطيس">`;
   s+=`<rect x="0" y="20" width="70" height="${H-40}" fill="${fr>0?NC:SC}" stroke="var(--fg)"/><rect x="${W-70}" y="20" width="70" height="${H-40}" fill="${fr>0?SC:NC}" stroke="var(--fg)"/>`+S.t(35,cy+6,fr>0?'N':'S','',null,20)+S.t(W-35,cy+6,fr>0?'S':'N','',null,20);
   if(Bf>0)s+=`<path d="${contourPath(f,72,22,W-72,H-22,5,dl*0.5,dl)}" fill="none" stroke="var(--blue)" stroke-width="1.3"/>`+probeHeads(src,f,110,22,110,H-22,dl*0.5,dl,'--blue')+probeHeads(src,f,W-110,22,W-110,H-22,dl*0.5,dl,'--blue');
   else if(I>0)s+=`<path d="${contourPath(f,72,22,W-72,H-22,5,0.5,25)}" fill="none" stroke="var(--blue)" stroke-width="1.3"/>`;
   s+=wireDot(cx,wy,sI,13);if(F>1e-9)s+=arrow(cx+30,wy,cx+30,wy+fdir*(30+50*clamp(F/0.5,0,1)),'--stop',4)+S.t(cx+44,wy+fdir*40,'F','','start',16);
   $('#f3a').innerHTML=s+'</svg>';
   ['f3B','f3I','f3l','f3t'].forEach((k,i)=>{$('#'+k+'-v').textContent=[fm(Bf,2)+' T',fm(I,1)+' A',len+' cm',th+'°'][i]});
   $('#f3F').textContent=fm(sig(F,4))+' N';$('#f3d').textContent=F<1e-9?'لا قوة':fdir<0?'إلى أعلى':'إلى أسفل';
   // top view: field arrows, wire at angle θ
   let t=`<svg viewBox="0 0 320 150" role="img" aria-label="منظر علوي: زاوية السلك مع المجال">`;for(let k=0;k<4;k++){const y=25+k*33;t+=arrow(fr>0?20:300,y,fr>0?300:20,y,'--blue',1.2)}
   const c=Math.cos(th*D),sn=Math.sin(th*D);t+=`<path d="M${fx(160-c*70)} ${fx(75+sn*70)}L${fx(160+c*70)} ${fx(75-sn*70)}" stroke="var(--live)" stroke-width="6" stroke-linecap="round"/>`+arrow(160-c*30,75+sn*30,160+c*30,75-sn*30,'--fg',2);
   t+=arT(160,146,'منظر من أعلى: السلك والمجال، θ = '+th+'°',{fs:12,col:'--muted'});$('#f3top').innerHTML=t+'</svg>'};
  const I1v=()=>md==='one'?0:I1;
  const drawB=()=>{const W=640,H=340,cy=170,dpx=60+150*Math.log10(a),x1=320-dpx/2,x2=320+dpx/2,mx=Math.max(I1v(),I2,1e-9);
   const src=[{t:'w',x:x2,y:cy,I:s2*I2/mx*2.5}];if(md==='two')src.push({t:'w',x:x1,y:cy,I:s1*I1/mx*2.5});
   const f=(x,y)=>psiAt(src,x,y,9),dl=0.55;let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="موصلان متوازيان وخطوط المجال">`;
   s+=`<path d="${contourPath(f,0,0,W,H,5,dl*0.37,dl)}" fill="none" stroke="var(--blue)" stroke-width="1.2"/>`+probeHeads(src,f,4,cy,W-4,cy,dl*0.37,dl,'--blue',(x,y)=>Math.abs(x-x1)<14||Math.abs(x-x2)<14);
   const Fl=MU0*I1v()*I2/(2*PI*a/100),att=s1*s2>0;
   if(md==='two'){const L=Fl>0?clamp(26+12*Math.log10(Fl/2e-7+1),26,90):0;s+=wireDot(x1,cy,s1,12,'1')+wireDot(x2,cy,s2,12,'2');
     if(L)s+=arrow(x1,cy-26,x1+(att?1:-1)*L,cy-26,'--stop',3.4)+arrow(x2,cy+26,x2+(att?-1:1)*L,cy+26,'--stop',3.4)+S.t(x1,cy-36,'F1','','middle',13)+S.t(x2,cy+48,'F2','','middle',13);}
   else{s+=wireDot(x2,cy,s2,12,'')+`<circle cx="${fx(x1)}" cy="${cy}" r="6" fill="var(--stop)"/>`+S.t(x1,cy-14,'P','','middle',13);const [bx,by]=fieldAt(src,x1,cy);s+=arrow(x1,cy,x1+bx/Math.hypot(bx,by)*40,cy+by/Math.hypot(bx,by)*40,'--fg',2.4)+S.t(x1-12,cy+by/Math.hypot(bx,by)*40,'B','','end',13)}
   s+=`<path d="M${fx(x1)} ${H-24}H${fx(x2)}" stroke="var(--fg)" stroke-width="1"/>`+head(x1,H-24,PI,'--fg',5)+head(x2,H-24,0,'--fg',5)+S.t(320,H-30,'a = '+fm(a)+' cm','','middle',13);
   $('#f3b').innerHTML=s+'</svg>';
   $('#f3i1-v').textContent=fm(r3(I1))+' A';$('#f3i2-v').textContent=fm(r3(I2))+' A';$('#f3a2-v').textContent=a+' cm';$('#f3w1').style.display=md==='two'?'':'none';
   const B2=MU0*I2/(2*PI*a/100),H2=I2/(2*PI*a/100);
   if(md==='two'){$('#f3f').innerHTML=fact('B₂ عند الموصل 1 (5-10)','x1')+fact('F/ℓ (5-12)','x2')+fact('F على طول 1 m','x3');$('#x1').textContent=sci(B2,3)+' T';$('#x2').textContent=sci(Fl,3)+' N/m';$('#x3').textContent=sci(Fl,4)+' N';
     const ch=$('#f3chip');ch.className='mg-chip '+(att?'ok':'warn');ch.textContent=att?'التياران في اتجاه واحد: تجاذب':'التياران متعاكسان: تنافر'}
   else{$('#f3f').innerHTML=fact('B عند P (5-7)','x1')+fact('H عند P (5-8)','x2');$('#x1').textContent=sci(B2,3)+' T';$('#x2').textContent=fm(sig(H2,4))+' A/m';const ch=$('#f3chip');ch.className='mg-chip ld';ch.textContent='كلما زادت a قلت B و H'}};
  $('#f3B').oninput=e=>{Bf=+e.target.value;drawA()};$('#f3I').oninput=e=>{I=+e.target.value;drawA()};$('#f3l').oninput=e=>{len=+e.target.value;drawA()};$('#f3t').oninput=e=>{th=+e.target.value;drawA()};
  segBind(el,'dir',v=>{out=v==='out';did.rev=1;drawA()});segBind(el,'fr',v=>{fr=+v;did.fr=1;drawA()});
  el.querySelectorAll('[data-p3]').forEach(b=>b.onclick=()=>{const P={a:[0.2,2,10,90],b:[0.4,2,10,30],c:[0.06,4,10,90],d:[0.4,8,50,15]}[b.dataset.p3];[Bf,I,len,th]=P;$('#f3B').value=Bf;$('#f3I').value=I;$('#f3l').value=len;$('#f3t').value=th;did['p'+b.dataset.p3]=1;drawA()});
  segBind(el,'md',v=>{md=v;drawB()});segBind(el,'s1',v=>{s1=+v;drawB()});segBind(el,'s2',v=>{s2=+v;drawB()});
  $('#f3i1').oninput=e=>{I1=r3(lgI(+e.target.value));drawB()};$('#f3i2').oninput=e=>{I2=r3(lgI(+e.target.value));drawB()};$('#f3a2').oninput=e=>{a=+e.target.value;drawB()};
  el.querySelectorAll('[data-p4]').forEach(b=>b.onclick=()=>{const k=b.dataset.p4;const P={'54':['one',0,15,1,1,4],'56':['two',2,1.5,1,1,30],'57':['two',1,1,1,1,100],'58':['two',600,600,1,-1,30],'58s':['two',72000,72000,1,-1,30],'t4':['two',2,4,1,1,8]}[k];
   [md,I1,I2,s1,s2,a]=P;segSet(el,'md',md);segSet(el,'s1',s1);segSet(el,'s2',s2);$('#f3i1').value=lgPos(I1||0.1);$('#f3i2').value=lgPos(I2);$('#f3a2').value=a;did['q'+k]=1;drawB()});
  const steps=stepsUI($('#f3st'),[
   {t:'مثال (٥-٥)',x:'اضغط «مثال (٥-٥) 90°»: <span class="ltr">ℓ = 10 cm</span>، <span class="ltr">I = 2 A</span>، <span class="ltr">B = 0.2 T</span> فتكون <span class="ltr">F = 0.04 N</span>. لاحظ تكاثف الخطوط في جهة وتخلخلها في الأخرى.',done:()=>Math.abs(Bf-0.2)<1e-9&&I===2&&len===10&&th===90},
   {t:'قاعدة فليمنج',x:'غيّر اتجاه التيار إلى ⊗ ثم اقلب المغناطيس: في كل مرة طبّق اليد اليسرى (السبابة للمجال من N إلى S، الوسطى للتيار) وتأكد أن الإبهام يشير إلى السهم الأحمر.',done:()=>did.rev&&did.fr},
   {t:'السلك موازٍ للمجال',x:'اجعل <span class="ltr">θ = 0°</span>: تنعدم القوة. ثم <span class="ltr">θ = 30°</span> مع <span class="ltr">B = 0.4 T</span>: نفس القوة 0.04 N (الجزء الثاني من مثال ٥-٥).',done:()=>th===30&&Math.abs(Bf-0.4)<1e-9},
   {t:'موصلان: نفس الاتجاه',x:'اضغط «مثال (٥-٦)»: التياران 2 A و 1.5 A في اتجاه واحد على بعد 30 cm: تجاذب، و <span class="ltr">F/ℓ = 2 × 10⁻⁶ N/m</span> (أي <span class="ltr">20 × 10⁻⁷</span>).',done:()=>did.q56&&md==='two'&&s1*s2>0},
   {t:'تياران متعاكسان',x:'اضغط «مثال (٥-٨)»: قضيبا توزيع بتيارين متعاكسين 600 A: تنافر بقوة <span class="ltr">0.24 N/m</span>.',done:()=>did.q58},
   {t:'القصر',x:'اضغط «(٥-٨) عند القصر»: <span class="ltr">72000 A</span> ⇐ <span class="ltr">3456 N/m</span> (القوة × 14400 لأن التيار × 120).',done:()=>did.q58s},
   {t:'سلك واحد',x:'اضغط «مثال (٥-٤)»: سلك يحمل 15 A ونقطة على بعد 4 cm: <span class="ltr">B = 7.5 × 10⁻⁵ T</span> و <span class="ltr">H = 59.7 A/m</span>. ثم زد a وراقب B تقل.',done:()=>did.q54&&md==='one'&&a>4}
  ]);
  drawA();drawB();loopOn(el,()=>steps.check());
 },
 examples:[
  {title:'مثال (٥-٤)',ref:'ص 139',q:'<p>يمر تيار كهربائي شدته 15 A في سلك مستقيم طويل موضوع في الفراغ. احسب قيمة الحث المغناطيسي وشدة المجال الناتجين على بعد 4 cm من السلك.</p>',
   given:[{id:'I',label:'التيار',sym:'I',unit:'A',value:15},{id:'a',label:'البعد عن السلك',sym:'a',unit:'cm',value:4}],
   solve:g=>{const b=MU0*g.I/(2*PI*g.a/100),h=g.I/(2*PI*g.a/100);return [{t:'نطبق المعادلتين (5-7) و(5-8) علماً أن في الفراغ \\(\\mu=\\mu_0=4\\pi\\times10^{-7}\\) H/m:',f:`B=\\frac{\\mu I}{2\\pi a}=\\frac{4\\pi\\times10^{-7}\\times${g.I}}{2\\pi\\times${g.a}\\times10^{-2}}=${sx(b,3)}\\ \\text{T}`,v:sci(b,3),unit:'T',final:true},
    {t:'',f:`H=\\frac{I}{2\\pi a}=\\frac{${g.I}}{2\\pi\\times${g.a}\\times10^{-2}}`,v:B.round(h,1),unit:'A/m',dp:1,final:true}]},note:'<span class="fixnote">الحل في الكتاب يذكر «المعادلتين (5-5) و(5-6)»، والصحيح (5-7) و(5-8) كما هنا.</span>'},
  {title:'مثال (٥-٥)',ref:'ص 140',q:'<p>وضع سلك طوله 10 cm عمودياً على مجال مغناطيسي. إذا كانت شدة التيار المار في السلك 2 A، وكانت القوة الناتجة على السلك 0.04 N، احسب كثافة الفيض المغناطيسي، ثم احسبه من جديد عندما تكون الزاوية بين السلك والمجال تساوي 30°.</p>',
   given:[{id:'l',label:'طول السلك',sym:'\\ell',unit:'cm',value:10},{id:'I',label:'التيار',sym:'I',unit:'A',value:2},{id:'F',label:'القوة',sym:'F',unit:'N',value:0.04},{id:'t',label:'الزاوية الثانية',sym:'\\theta',unit:'°',value:30}],
   solve:g=>{const b1=g.F/(g.I*g.l/100),b2=g.F/(g.I*g.l/100*Math.sin(g.t*D));return [{t:'من المعادلة (5-9) نستنتج:',f:`B=\\frac{F}{I\\,\\ell\\sin\\theta}=\\frac{${g.F}}{${g.I}\\times${g.l}\\times10^{-2}\\times\\sin90^\\circ}`,v:sig(b1,4),unit:'T',final:true},
    {t:`عندما تكون الزاوية θ = ${g.t}° تصبح كثافة الفيض:`,f:`B=\\frac{${g.F}}{${g.I}\\times${g.l}\\times10^{-2}\\times\\sin${g.t}^\\circ}`,v:sig(b2,4),unit:'T',final:true}]}},
  {title:'مثال (٥-٦)',ref:'ص 141–142',q:'<p>عند قياس قوة التجاذب بين موصلين طويلين متوازيين يمر فيهما تياران موضوعين في الفراغ، إذا كانت المسافة بينهما 30 cm، وجد أنها تساوي <span class="ltr">20×10⁻⁷ N/m</span>. احسب شدة التيار المار في الموصل الثاني إذا كانت شدة التيار المار في الموصل الأول 2 A.</p>',
   given:[{id:'d',label:'المسافة',sym:'a',unit:'cm',value:30},{id:'F',label:'القوة لكل متر (× 10⁻⁷)',sym:'F/\\ell',unit:'N/m',value:20},{id:'I1',label:'تيار الموصل الأول',sym:'I_1',unit:'A',value:2}],
   solve:g=>{const i2=2*PI*g.d/100*g.F*1e-7/(MU0*g.I1);return [{t:'من المعادلة (5-12) نستنتج:',f:`I_2=\\frac{2\\pi\\,a\\,(F/\\ell)}{\\mu_0 I_1}=\\frac{2\\pi\\times${g.d}\\times10^{-2}\\times${g.F}\\times10^{-7}}{4\\pi\\times10^{-7}\\times${g.I1}}`,v:sig(i2,4),unit:'A',final:true}]},note:'استعمل الكتاب الرمز d للمسافة a، والرمز \\(F_{21}\\) للقوة لكل وحدة طول.'},
  {title:'مثال (٥-٧)',ref:'ص 142',q:'<p>موصلان طول كل منهما متر واحد ويحمل كل واحد منهما تياراً مقداره أمبير واحد. فإذا كانت المسافة بين الموصلين متراً واحداً، احسب قوة التجاذب بين الموصلين.</p>',
   given:[{id:'l',label:'الطول',sym:'\\ell',unit:'m',value:1},{id:'I1',label:'التيار الأول',sym:'I_1',unit:'A',value:1},{id:'I2',label:'التيار الثاني',sym:'I_2',unit:'A',value:1},{id:'a',label:'المسافة',sym:'a',unit:'m',value:1}],
   solve:g=>{const F=g.l*MU0*g.I1*g.I2/(2*PI*g.a);return [{t:'من المعادلة (5-11):',f:`F=\\frac{\\ell\\,\\mu_0 I_1 I_2}{2\\pi a}=\\frac{${g.l}\\times4\\pi\\times10^{-7}\\times${g.I1}\\times${g.I2}}{2\\pi\\times${g.a}}`,v:sci(F,3),unit:'N',final:true}]},
   note:'<b>توضيح للمتدرب (ليس من الكتاب):</b> هذه القوة الصغيرة \\(2\\times10^{-7}\\) N لكل متر بين تيارين 1 A على بعد 1 m هي أساس التعريف الكلاسيكي لوحدة الأمبير.'},
  {title:'مثال (٥-٨)',ref:'ص 142',q:`<p>قضيبا توزيع يبعدان عن بعضهما مسافة 30 سم يمر في كل منهما تيار مقداره 600 A في اتجاهين متضادين. احسب مقدار القوة بينهما لكل متر طولي. وإذا حدث قصر في الدائرة بحيث زاد التيار فيهما إلى 72000 A فاحسب مقدار القوة الكهرومغناطيسية في تلك الحال.</p>${bfSeg('e58')}`,
   given:[{id:'a',label:'المسافة',sym:'a',unit:'m',value:0.3},{id:'I',label:'التيار العادي',sym:'I',unit:'A',value:600},{id:'Is',label:'تيار القصر',sym:'I_{sc}',unit:'A',value:72000}],
   solve:(g,B,isBook)=>{const bk=isBook&&bfMode('e58')==='book';const F1=MU0*g.I*g.I/(2*PI*g.a),F2=MU0*g.Is*g.Is/(2*PI*g.a);
    return [{t:'من المعادلة (5-12):',f:`F=\\frac{\\mu_0 I_1 I_2}{2\\pi a}=\\frac{4\\pi\\times10^{-7}\\times${g.I}\\times${g.I}}{2\\pi\\times${g.a}}`,v:sig(F1,4),unit:'N/m',final:true},
     {t:'وهي قوة <b>تنافر</b> بين قضيبي التوزيع (التياران متضادان). وعند حدوث القصر:'+(bk?' <span class="sub">(كما طُبع في الكتاب: 2456 — والصحيح 3456)</span>':''),f:`F=\\frac{4\\pi\\times10^{-7}\\times${g.Is}\\times${g.Is}}{2\\pi\\times${g.a}}`,v:bk?2456:Math.round(F2),unit:'N/m',final:true},
     {t:`يتضح من النتائج أن قصر الدائرة قد يؤدي إلى تحطيم قضبان التوزيع نتيجة للزيادة الهائلة في القوى الكهرومغناطيسية${bk?'':` (القوة زادت ${fm(sig(F2/F1,4))} مرة = مربع نسبة التيارين)`}.`}]},
   note:'<span class="fixnote"><b>ملاحظة على الكتاب:</b> ناتج القوة عند القصر طُبع <span class="ltr">2456 N</span>، والصحيح <span class="ltr">3456 N</span>: <span class="ltr">0.24 × (72000/600)² = 0.24 × 14400 = 3456</span>. اختر «المصحح».</span>'}
 ],
 quiz:[
  {q:'في قاعدة اليد اليمنى للسلك المستقيم يشير الإبهام إلى:',o:['اتجاه المجال','اتجاه التيار','اتجاه القوة','القطب الشمالي'],c:1,e:'ص 138: والأصابع الملتفة تشير إلى اتجاه المجال.'},
  {q:'إذا ضاعفنا المسافة a عن سلك مستقيم فإن B:',o:['تتضاعف','تقل إلى النصف','تقل إلى الربع','لا تتغير'],c:1,e:'(5-7): \\(B=\\mu I/(2\\pi a)\\).'},
  {q:'شدة المجال H حول سلك مستقيم:',o:['تعتمد على نفاذية الوسط','لا تعتمد على نفاذية الوسط','تساوي صفراً في الهواء','تقاس بالتسلا'],c:1,e:'ص 138: H = I/(2πa).'},
  {q:'في قاعدة فليمنج لليد اليسرى تشير الوسطى إلى:',o:['المجال','التيار','القوة','الحركة'],c:1,e:'ص 139: السبابة للمجال، الوسطى للتيار، الإبهام للقوة.'},
  {q:'تنعدم القوة على سلك يحمل تياراً في مجال مغناطيسي عندما يكون السلك:',o:['عمودياً على المجال','موازياً للمجال','بزاوية 45°','قصيراً'],c:1,e:'(5-9): sin 0° = 0.'},
  {q:'سلك طوله 0.2 m يحمل 5 A عمودياً على مجال 0.3 T. القوة:',o:['0.3 N','3 N','0.03 N','1.5 N'],c:0,e:'\\(F=0.3\\times0.2\\times5\\times1=0.3\\) N.'},
  {q:'موصلان متوازيان يمر فيهما تياران في اتجاه واحد:',o:['يتنافران','يتجاذبان','لا يؤثر أحدهما في الآخر','يدوران'],c:1,e:'ص 141.'},
  {q:'إذا تضاعف التيار في موصلين متوازيين (كلاهما) فإن القوة بينهما:',o:['تتضاعف','تزيد أربع مرات','لا تتغير','تقل للنصف'],c:1,e:'(5-12): F ∝ I₁I₂ — لهذا تكون قوى القصر هائلة (مثال ٥-٨).'}
 ]
});

/* ======================================================================
   Lesson u5-l4 — الحث الذاتي والمتبادل وتوصيل الملفات (ص 143–151)
   ====================================================================== */
function fig518(){let s=`<svg viewBox="0 0 420 220" role="img" aria-label="دائرة بطارية ومقاومة ومفتاح">`;
  s+=`<path class="w" d="M60 60H150M190 60H360V170H60V60"/>`;
  s+=`<path d="M150 60L186 40" stroke="var(--stop)" stroke-width="3" stroke-linecap="round"/><circle cx="150" cy="60" r="3.5" fill="var(--fg)"/><circle cx="190" cy="60" r="3.5" fill="var(--fg)"/>`+S.t(168,30,'S','','middle',14);
  s+=`<path d="M352 100H368M346 112H374" stroke="var(--fg)" stroke-width="3"/><rect x="340" y="98" width="40" height="18" fill="var(--surface)" stroke="none"/><path d="M346 100H374" stroke="var(--fg)" stroke-width="3"/><path d="M352 114H368" stroke="var(--fg)" stroke-width="5"/>`+S.t(392,112,'ε','','start',16);
  s+=`<rect x="160" y="160" width="100" height="20" fill="var(--surface)"/>`+zig(160,170,260,170,6,'')+S.t(210,200,'R','','middle',14);
  s+=arrow(250,60,300,60,'--blue',2.4)+S.t(276,52,'I','b','middle',14)+`<ellipse cx="280" cy="60" rx="10" ry="26" fill="none" stroke="var(--blue)" stroke-width="1.6"/>`+head(270,48,PI/2,'--blue',5)+S.t(300,28,'B','b','start',14);
  return s+'</svg>'}
function coilSide(x,y,w,h,n,col,dirUp){let s=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="var(--surface-2)" stroke="var(--muted)"/>`;
  for(let k=0;k<n;k++){const xx=x+(k+0.5)*w/n;s+=`<path d="M${fx(xx-w/n*0.3)} ${y-3}L${fx(xx+w/n*0.3)} ${y+h+3}" stroke="var(${col})" stroke-width="2.2"/>`;if(k===Math.floor(n/2))s+=head(xx,y+h/2,dirUp?-PI/2+0.3:PI/2+0.3,col,6)}
  return s}
function fig519(){let s=`<svg viewBox="0 0 520 240" role="img" aria-label="ملفان متجاوران والحث المتبادل">`;
  [[40,0.9],[70,0.65],[100,0.4]].forEach(([r,o])=>{s+=`<ellipse cx="230" cy="120" rx="${200-r*0.5}" ry="${r}" fill="none" stroke="var(--blue)" stroke-width="1.5" opacity="${o+0.1}"/>`});
  s+=`<path d="M40 120H480" stroke="var(--blue)" stroke-width="1.5"/>`+head(170,120,0,'--blue',6)+head(330,120,0,'--blue',6);
  s+=coilSide(110,80,120,80,8,'--live',false)+coilSide(300,90,100,60,6,'--muted',false);
  s+=S.t(170,196,'Coil 1','','middle')+S.t(170,214,'N1   I1','b','middle')+S.t(350,186,'Coil 2','','middle')+S.t(350,204,'N2   I2','b','middle');
  return s+'</svg>'}
function seriesCoils(aid,o){o=o||{};const W=o.W||520;let s=`<svg viewBox="0 0 ${W} 200" role="img" aria-label="${aid?'ملفان على التوالي ومجالاهما في اتجاه واحد':'ملفان على التوالي ومجالاهما متعاكسان'}">`;
  const gx=o.gap||40;const x1=60,w=160,x2=x1+w+gx;
  s+=coilSide(x1,80,w,60,8,'--live',false)+coilSide(x2,80,w,60,8,'--live',!aid);
  s+=`<path class="w" d="M${x1} 70V40"/>`+head(x1,52,PI/2,'--fg',6)+`<path class="w" d="M${x1+w} 70V40H${x2}V70"/>`+head((x1+w+x2)/2,40,0,'--fg',6)+`<path class="w" d="M${x2+w} 70V40"/>`+head(x2+w,48,-PI/2,'--fg',6);
  s+=S.t(x1-10,36,'I','b','end',13)+S.t((x1+w+x2)/2,30,'I','b','middle',13);
  s+=arrow(x1+40,170,x1+120,170,'--blue',2.6)+S.t(x1+80,192,'B1','b','middle')+(aid?arrow(x2+40,170,x2+120,170,'--blue',2.6):arrow(x2+120,170,x2+40,170,'--blue',2.6))+S.t(x2+80,192,'B2','b','middle');
  s+=S.t(x1+w/2,112,'L1','','middle',14)+S.t(x2+w/2,112,'L2','','middle',14)+S.t((x1+w+x2)/2,116,'M','','middle',14);
  return s+'</svg>'}
function fig520(){return `<div class="mg-figs"><figure>${box(seriesCoils(true),460)}<figcaption>(أ) المجالان في نفس الاتجاه</figcaption></figure><figure>${box(seriesCoils(false),460)}<figcaption>(ب) المجالان متعاكسان</figcaption></figure></div>`}

const L4CORE=[['1','هواء μᵣ=1'],['500','حديد μᵣ=500'],['1000','حديد μᵣ=1000'],['5000','حديد μᵣ=5000']];
B.lesson({
 id:'u5-l4',unit:5,order:4,pages:'143–151',
 title:'الحث الذاتي والحث المتبادل وتوصيل الملفات',
 summary:'لماذا لا يصل التيار إلى قيمته فوراً عند غلق المفتاح؟ الحث الذاتي L وحسابه من أبعاد الملف L = μN²A/ℓ، الحث المتبادل M بين ملفين، وتوصيل الملفات على التوالي (L₁ + L₂ ± 2M) وعلى التوازي. مع المثالين (٥-٩) و(٥-١٠).',
 stations:[
  {intro:true},

  {st:1,short:'الحث الذاتي والمتبادل',title:'الحث الذاتي والحث المتبادل: الملف يقاوم تغيّر تياره',ref:'ص 143',
   q:'عرفنا أن تغيّر الفيض يولد تياراً… فهل يمكن أن يؤثر الملف في نفسه بالفيض الذي يصنعه هو؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ملف واحد يؤثر في نفسه (حث ذاتي)، وملفان يؤثر أحدهما في الآخر (حث متبادل)" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><g data-tip="الحث الذاتي: تغيّر التيار في الملف يغيّر فيضه هو، فتتولد فيه نفسه قوة دافعة تعاكس هذا التغيّر."><rect x="56" y="118" width="96" height="56" rx="8" fill="#F1EBDD" stroke="#2C4A40" stroke-width="2.5"/><path d="M68 112l8 68M84 112l8 68M100 112l8 68M116 112l8 68M132 112l8 68" stroke="#B9852A" stroke-width="4.5" stroke-linecap="round"/><path d="M104 104 C 150 50, 40 50, 92 100" fill="none" stroke="#E8735A" stroke-width="3"/><polygon points="96,106 84,96 98,92" fill="#E8735A"/></g><g data-tip="الحث المتبادل: تغيّر التيار في الملف الأول يغيّر الفيض الذي يقطع الملف الثاني، فتتولد في الثاني قوة دافعة."><rect x="196" y="118" width="54" height="56" rx="8" fill="#F1EBDD" stroke="#2C4A40" stroke-width="2.5"/><path d="M204 112l8 68M220 112l8 68M236 112l8 68" stroke="#B9852A" stroke-width="4.5" stroke-linecap="round"/><rect x="270" y="118" width="54" height="56" rx="8" fill="#F1EBDD" stroke="#2C4A40" stroke-width="2.5"/><path d="M278 112l8 68M294 112l8 68M310 112l8 68" stroke="#9AA5A0" stroke-width="4.5" stroke-linecap="round"/><path d="M224 104 C 240 64, 280 64, 294 100" fill="none" stroke="#E8735A" stroke-width="3"/><polygon points="297,108 286,98 300,94" fill="#E8735A"/></g><text x="104" y="214" text-anchor="middle" font-size="15" font-weight="700" fill="#2C4A40" direction="rtl" unicode-bidi="embed">حث ذاتي</text><text x="260" y="214" text-anchor="middle" font-size="15" font-weight="700" fill="#2C4A40" direction="rtl" unicode-bidi="embed">حث متبادل</text><text x="104" y="236" text-anchor="middle" font-size="12.5" fill="#2C4A40" direction="rtl" unicode-bidi="embed">الملف يؤثر في نفسه</text><text x="260" y="236" text-anchor="middle" font-size="12.5" fill="#2C4A40" direction="rtl" unicode-bidi="embed">ملف يؤثر في آخر</text></svg>`,
   cap:'السهم الأحمر = أثر تغيّر الفيض: يعود إلى الملف نفسه، أو يصل إلى ملف مجاور.<br><b>مرّر المؤشر على كل جزء (أو المسه في الجوال) لتعرف معناه.</b>',
   side:[
    {book:String.raw`<p>تعلمنا فيما سبق أن التيار ينشأ في الدائرة الكهربائية عندما يتغير الفيض المغناطيسي خلال الدائرة مع الزمن. وفيما سيلي سندرس <b>الحث الذاتي Self Inductance</b> الذي ينشأ في الدائرة نفسها عند مرور تيار كهربائي فيها أو بمعنى أدق عند غلق أو فتح الدائرة الكهربائية. وهذا التأثير (الحث الذاتي) يلعب دوراً أساسياً في دوائر التيار المتردد حيث أن التيار يتغير باستمرار مع الزمن.</p>`,ref:'ص 143'},
    {predict:{q:'متى يظهر أثر الحث الذاتي في دائرة تيار مستمر بسيطة؟',opts:[
     ['طوال الوقت ما دام التيار يمر بقيمة ثابتة',false,'التيار الثابت لا يغيّر الفيض، فلا يتولد شيء.'],
     ['عند غلق الدائرة أو فتحها، أي عندما يتغير التيار',true,'الكتاب: ينشأ الحث الذاتي عند غلق أو فتح الدائرة؛ لأن التيار يتغير عندها.'],
     ['لا يظهر أبداً في دوائر التيار المستمر',false,'يظهر لحظة الغلق والفتح، أما في التيار المتردد فيظهر باستمرار.']]}}
   ],
   body:[
    {tip:String.raw`<p>كلمة السر في هذا الدرس هي «<b>التغيّر</b>». التيار الثابت يصنع فيضاً ثابتاً ولا يولّد شيئاً. أما التيار المتغير فيصنع فيضاً متغيراً، وهذا يولّد قوة دافعة كهربائية: في الملف نفسه (حث ذاتي) أو في ملف مجاور (حث متبادل). وفي التيار المتردد يتغير التيار باستمرار، لذلك هذا الدرس أساس لما بعده.</p>`,title:'الفكرة في سطر'}
   ]},

  {st:2,short:'الحث الذاتي',title:'الحث الذاتي: لماذا لا يصل التيار إلى قيمته فوراً؟',ref:'ص 143–144',
   q:'تغلق المفتاح… فهل يقفز التيار إلى قيمته العظمى في اللحظة نفسها؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="دائرة فيها بطارية ومقاومة ومفتاح، والتيار I وحوله المجال B" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><path d="M70 90 H140 M190 90 H290 V230 H70 V90" fill="none" stroke="#2C4A40" stroke-width="4"/><g data-tip="المفتاح ⟦S⟧: عند غلقه يبدأ التيار بالمرور، لكنه يزداد تدريجياً لا فجأة."><circle cx="140" cy="90" r="5" fill="#2C4A40"/><circle cx="190" cy="90" r="5" fill="#2C4A40"/><line x1="140" y1="90" x2="182" y2="62" stroke="#E8735A" stroke-width="5" stroke-linecap="round"/><text x="164" y="52" text-anchor="middle" font-size="16" font-weight="700" fill="#2C4A40" font-family="var(--mono)">S</text></g><g data-tip="البطارية ⟦ε⟧: مصدر القوة الدافعة الكهربائية في الدائرة."><rect x="276" y="140" width="28" height="40" fill="#DDEFE6"/><line x1="272" y1="150" x2="308" y2="150" stroke="#2C4A40" stroke-width="4"/><line x1="280" y1="166" x2="300" y2="166" stroke="#2C4A40" stroke-width="7"/><text x="320" y="166" font-size="18" font-weight="700" fill="#2C4A40" font-family="var(--mono)">ε</text></g><g data-tip="المقاومة ⟦R⟧ في الدائرة."><rect x="130" y="218" width="100" height="24" fill="#DDEFE6"/><path d="M130 230 l8 -10 l12 20 l12 -20 l12 20 l12 -20 l12 20 l12 -20 l10 10" fill="none" stroke="#E8735A" stroke-width="3.5"/><text x="180" y="266" text-anchor="middle" font-size="16" font-weight="700" fill="#2C4A40" font-family="var(--mono)">R</text></g><g data-tip="التيار ⟦I⟧: يزداد مع الزمن بعد غلق المفتاح."><polygon points="250,82 266,90 250,98" fill="#3A7CA5"/><text x="234" y="78" font-size="16" font-weight="700" fill="#3A7CA5" font-family="var(--mono)">I</text></g><g data-tip="المجال ⟦B⟧ حول السلك: يزداد مع ازدياد التيار، فيزداد الفيض خلال الدائرة."><ellipse cx="226" cy="90" rx="10" ry="26" fill="none" stroke="#3A7CA5" stroke-width="2.5"/><polygon points="216,84 211,96 221,96" fill="#3A7CA5"/><text x="206" y="62" font-size="16" font-weight="700" fill="#3A7CA5" font-family="var(--mono)">B</text></g><text x="180" y="300" text-anchor="middle" font-size="14" font-weight="600" fill="#2C4A40" direction="rtl" unicode-bidi="embed">لحظة غلق المفتاح</text></svg>`,
   cap:'الدائرة في الشكل (٥-١٨): بطارية ε ومقاومة R ومفتاح S.<br><b>مرّر المؤشر على المفتاح والبطارية والمقاومة والتيار والمجال (أو المسه في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>اعتبر دائرة كهربائية مكونة من بطارية ومقاومة ومفتاح كهربائي كما في الشكل (٥-١٨)، عند غلقها فإن التيار المار في الدائرة <b>لن يصل إلى قيمته العظمى فور غلق المفتاح</b> إنما سوف يستغرق بعضاً من الوقت نتيجة لقانون فارادي. كيف ذلك؟<br>عند غلق المفتاح في الدائرة الكهربائية يحدث ما يلي:</p>
     <ol><li>يزداد التيار المار في الدائرة مع الزمن.</li><li>يزداد الفيض المغناطيسي خلال الدائرة نتيجة لازدياد التيار.</li><li>الفيض المتزايد يؤدي إلى توليد قوة دافعة كهربائية في الدائرة ليعاكس الزيادة في الفيض المغناطيسي Lenz's Law.</li></ol>`,ref:'ص 143'}
   ],
   body:[
    {title:'تابع ما يحدث لحظة غلق المفتاح',widget:(el,B)=>{
      const S=['أُغلق المفتاح','يبدأ التيار بالزيادة','يزداد الفيض خلال الدائرة','تتولد قوة دافعة تعاكس الزيادة (لينز)','يتباطأ ارتفاع التيار','يصل التيار إلى قيمته العظمى بعد بعض الوقت'];
      el.innerHTML=`<p class="sub" style="margin:0 0 10px">اضغط «اغلق المفتاح» وتابع الأثر من حلقة إلى التي بعدها.</p><div class="chain">${S.map((s,i)=>`<span class="ck${i===S.length-1?' end':''}">${s}</span>${i<S.length-1?'<span class="ar">←</span>':''}`).join('')}</div><div class="w-row"><button class="btn pri" type="button" data-go>اغلق المفتاح</button><button class="btn" type="button" data-rs>إعادة</button></div>`;
      const ks=[...el.querySelectorAll('.ck')];let tm=[];
      const rs=()=>{tm.forEach(clearTimeout);tm=[];ks.forEach(k=>k.classList.remove('on'))};
      el.querySelector('[data-go]').onclick=()=>{rs();ks.forEach((k,i)=>tm.push(setTimeout(()=>k.classList.add('on'),i*550)))};
      el.querySelector('[data-rs]').onclick=rs;
    }},
    {book:String.raw`<p>هذه القوة الدافعة الكهربائية المتولدة في الدائرة تعمل في اتجاه معاكس للتيار الأصلي وهذا نتج عن الزيادة في الفيض المغناطيسي نتيجة لزيادة التيار عند غلق المفتاح... هذا التأثير في الدائرة يعرف باسم <b>التأثير الحثي الذاتي</b>. Self Induction</p>
     <p>من قانون فارادي يمكننا إيجاد صيغة رياضية للتعبير عن الحث الذاتي. حيث أن الفيض المغناطيسي يتناسب مع المجال المغناطيسي والأخير يتناسب مع التيار في الدائرة لذا فإن القوة الدافعة الكهربائية للحث الذاتي تتناسب مع التغير في التيار الكهربائي.</p>
     <div class="eq">$$E=-N\frac{d\phi_m}{dt}=-L\frac{dI}{dt}$$<span class="eqno">(5-13)</span></div>
     <p>حيث أن الحث الذاتي \(L\) في المغناطيسية يناظر السعة الكهربية \(C\) ويمكن التعبير عن الحث الذاتي \(L\) بالأبعاد الهندسية للدائرة. فإذا افترضنا ملفاً عدد لفاته \(N\) فإن \(L\) تعطى بالعلاقة التالية:</p>
     <div class="eq">$$L=\frac{N\,\phi_m}{I}$$<span class="eqno">(5-14)</span></div>
     <p>كما يمكن التعبير عن الحث الذاتي بالمعادلة التالية:</p>
     <div class="eq">$$L=-\frac{E}{dI/dt}$$<span class="eqno">(5-15)</span></div>
     <p>وهذه المعادلة تعطي قيمة الحث الذاتي للدائرة بغض النظر عن أبعادها الهندسية وإنما تعتمد على قياس الكميات الفيزيائية مثل القوة الدافعة الكهربائية والتغيير في التيار. و وحدة قياس الحث الذاتي هي <b>الهنري Henry</b>.</p>`,ref:'ص 144'},
    {predict:{q:'ملفان يمر فيهما التيار نفسه، والتيار في الأول يتغير بمعدل أسرع. في أيهما تتولد قوة دافعة ذاتية أكبر (إذا تساوى \\(L\\))؟',opts:[
     ['في الملف الذي يتغير تياره أسرع',true,'\\(E=-L\\,dI/dt\\): كلما كبر معدل التغير \\(dI/dt\\) كبرت القوة الدافعة.'],
     ['في الملف الذي تياره أكبر قيمةً',false,'قيمة التيار نفسها لا تهم؛ المهم سرعة تغيّره.'],
     ['متساويتان دائماً',false,'تتساويان فقط إذا تساوى معدل التغير أيضاً.']]}},
    {tip:String.raw`<p>الإشارة السالبة في (5-13) تعني «يعاكس»: إذا كان التيار يزداد تولدت قوة دافعة تحاول إنقاصه، وإذا كان ينقص (عند فتح المفتاح) تولدت قوة دافعة تحاول إبقاءه. الملف «يكره» التغيّر، كما يقاوم الجسم الثقيل أي تغيير في سرعته.</p>`,title:'الملف كالجسم الثقيل'},
    {add:String.raw`<p>عند فتح دائرة فيها ملف كبير (مثل ملف كونتاكتور أو محرك) قد تظهر شرارة بين نقاط التلامس: التيار يهبط فجأة فيتولد جهد ذاتي كبير يحاول إبقاءه. لهذا تُركّب أحياناً عناصر حماية على أطراف الملفات.</p>`,title:'من الورشة'}
   ]},

  {st:3,short:'الحث من الأبعاد',title:'إيجاد الحث الذاتي من خلال قياس الأبعاد الهندسية',ref:'ص 144–145',
   q:'إذا أردت ملفاً حثه أكبر… هل تزيد عدد اللفات، أم تطيل الملف، أم تجعله أعرض؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ملف حلزوني طويل عدد لفاته N وطوله ℓ ومساحة مقطعه A" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="مساحة مقطع الملف ⟦A⟧: كلما زادت زاد الحث ⟦L⟧ (تتناسب معه طردياً)."><ellipse cx="80" cy="160" rx="16" ry="44" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.5"/><text x="80" y="230" text-anchor="middle" font-size="17" font-weight="700" fill="#2C4A40" font-family="var(--mono)">A</text></g><path d="M80 116 H280 M80 204 H280" stroke="#2C4A40" stroke-width="2"/><ellipse cx="280" cy="160" rx="16" ry="44" fill="#F1EBDD" stroke="#2C4A40" stroke-width="2"/><g data-tip="لفات الملف وعددها ⟦N⟧: الحث يتناسب مع مربعها ⟦N²⟧، فمضاعفة اللفات تضاعف الحث أربع مرات."><path d="M96 110l10 100M118 110l10 100M140 110l10 100M162 110l10 100M184 110l10 100M206 110l10 100M228 110l10 100M250 110l10 100" stroke="#B9852A" stroke-width="5" stroke-linecap="round"/><text x="180" y="96" text-anchor="middle" font-size="17" font-weight="700" fill="#B9852A" font-family="var(--mono)">N</text></g><g data-tip="طول الملف ⟦ℓ⟧ (أكبر بكثير من نصف قطره): الحث يتناسب عكسياً معه."><line x1="84" y1="252" x2="276" y2="252" stroke="#2C4A40" stroke-width="2.5"/><polygon points="80,252 92,246 92,258" fill="#2C4A40"/><polygon points="280,252 268,246 268,258" fill="#2C4A40"/><text x="180" y="276" text-anchor="middle" font-size="18" font-weight="700" fill="#2C4A40" font-family="var(--mono)">ℓ</text></g><g data-tip="خطوط المجال داخل الملف: منتظمة، ⟦B = μ0 (N/ℓ) I⟧ من المعادلة (5-17)." stroke="#3A7CA5" stroke-width="2.5"><line x1="100" y1="146" x2="262" y2="146"/><line x1="100" y1="174" x2="262" y2="174"/><polygon points="272,146 260,140 260,152" fill="#3A7CA5" stroke="none"/><polygon points="272,174 260,168 260,180" fill="#3A7CA5" stroke="none"/></g></svg>`,
   cap:'ملف طويل: عدد لفاته N وطوله ℓ ومساحة مقطعه A.<br><b>مرّر المؤشر على المقطع واللفات والطول والخطوط (أو المسه في الجوال) لتعرف أثر كل منها.</b>',
   side:[
    {book:String.raw`<p>اعتبر ملفاً عدد لفاته \(N\) لفة وطوله \(\ell\) أكبر بكثير من نصف قطر الملف. ينشأ عنه مجال مغناطيسي يعطى بالعلاقة التالية:</p>
     <div class="eq">$$B=\mu_0\,\frac{N}{\ell}\times I$$<span class="eqno">(5-17)</span></div>
     <p>أما الفيض المغناطيسي فيعطى بالعلاقة التالية:</p>
     <div class="eq">$$\phi_m=B\times A=\mu_0\,\frac{N\times A}{\ell}\times I$$<span class="eqno">(5-18)</span></div>
     <div class="eq">$$L=\frac{N\,\phi_m}{I}=\frac{\mu_0 N^2 A}{\ell}$$<span class="eqno">(5-19)</span></div>
     <p>ومن هذا يتضح أن الحث الذاتي للملف يعتمد على خواصه الهندسية (الطول والمساحة وعدد اللفات)</p>`,ref:'ص 144–145'}
   ],
   body:[
    {predict:{q:'ضاعفنا عدد لفات ملف طويل مع بقاء طوله ومساحة مقطعه. ماذا يحدث لحثه الذاتي؟',opts:[
     ['يتضاعف',false,'\\(N\\) في المعادلة (5-19) مربعة، لا من الدرجة الأولى.'],
     ['يقل إلى النصف',false,'\\(N\\) في البسط، فزيادتها تزيد الحث.'],
     ['يصبح أربعة أضعاف',true,'\\(L=\\mu_0N^2A/\\ell\\): \\(2^2=4\\). مرة لأن المجال يتضاعف، ومرة لأن كل لفة من اللفات المضاعفة يقطعها هذا المجال.']]}},
    {tip:String.raw`<p>لماذا \(N^2\)؟ من (5-17): لفات أكثر تعطي مجالاً أقوى (مرة أولى \(N\)). ومن (5-14): \(L=N\phi_m/I\)، أي أن الفيض يُحسب مرة لكل لفة (مرة ثانية \(N\)). وإذا وُضع قلب نفاذيته النسبية \(\mu_r\) نضع \(\mu=\mu_0\mu_r\) مكان \(\mu_0\): \(L=\mu_0\mu_rN^2A/\ell\)، وهذا ما يستعمله مثالا (٥-٩) و(٥-١١). جرّب الأبعاد بنفسك في لوحة «الحث الذاتي من أبعاد الملف» في تبويب المختبر.</p>`,title:'من أين جاء المربع؟'},
    {watch:String.raw`<p>رقّم الكتاب المعادلات هنا (5-17) ثم (5-18) و(5-19)؛ لا توجد معادلة (5-16) في الكتاب. وكُتب طول الملف في النص بالحرف L، واستعملنا \(\ell\) حتى لا يختلط بالحث \(L\).</p>`,fix:true}
   ]},

  {st:4,short:'الحث المتبادل',title:'الحث المتبادل Mutual Inductance: ملف يؤثر في جاره',ref:'ص 145–146',
   q:'ملفان متجاوران لا يتصلان بأي سلك… كيف يمكن لتيار في الأول أن يولّد جهداً في الثاني؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ملفان متجاوران: خطوط مجال الملف الأول يمر بعضها خلال الملف الثاني" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="خطوط مجال الملف الأول: حلقات مغلقة يمر بعضها خلال الملف الثاني، وهذا الجزء هو الفيض ⟦Φ21⟧." fill="none" stroke="#3A7CA5" stroke-width="2.5"><path d="M60 160 H318"/><path d="M80 146 C 40 70, 300 60, 300 146"/><path d="M80 174 C 40 250, 300 260, 300 174"/><path d="M90 138 C 70 96, 190 90, 190 138"/><path d="M90 182 C 70 224, 190 230, 190 182"/></g><g fill="#3A7CA5"><polygon points="140,160 128,154 128,166"/><polygon points="268,160 256,154 256,166"/></g><g data-tip="الملف الأول ⟦(Coil 1)⟧: عدد لفاته ⟦N1⟧ ويمر فيه التيار ⟦I1⟧ الذي يصنع المجال."><rect x="84" y="128" width="96" height="64" rx="8" fill="#E8735A" fill-opacity=".35" stroke="#2C4A40" stroke-width="2.5"/><path d="M94 122l8 76M110 122l8 76M126 122l8 76M142 122l8 76M158 122l8 76" stroke="#E8735A" stroke-width="5" stroke-linecap="round"/><text x="132" y="222" text-anchor="middle" font-size="15" font-weight="700" fill="#2C4A40" font-family="var(--mono)">N1  I1</text></g><g data-tip="الملف الثاني ⟦(Coil 2)⟧: عدد لفاته ⟦N2⟧. إذا تغيّر ⟦I1⟧ تغيّر الفيض الذي يقطعه فتتولد فيه قوة دافعة وتيار حثي ⟦I2⟧."><rect x="216" y="136" width="66" height="48" rx="8" fill="#C9D3CE" fill-opacity=".6" stroke="#2C4A40" stroke-width="2.5"/><path d="M224 130l8 60M240 130l8 60M256 130l8 60" stroke="#9AA5A0" stroke-width="5" stroke-linecap="round"/><text x="250" y="210" text-anchor="middle" font-size="15" font-weight="700" fill="#2C4A40" font-family="var(--mono)">N2  I2</text></g><text x="180" y="296" text-anchor="middle" font-size="14" font-weight="600" fill="#2C4A40" direction="rtl" unicode-bidi="embed">لا سلك بينهما… الفيض هو الرابط</text></svg>`,
   cap:'ملفان متجاوران كما في الشكل (٥-١٩).<br><b>مرّر المؤشر على الملفين والخطوط (أو المسه في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>يؤدي التغير في التيار الكهربائي في دائرة إلى تغيير في الفيض المغناطيسي في دائرة كهربائية مجاورة. وهذا بالتأكيد يولد قوة دافعة كهربائية في تلك الدائرة ويسمى هذا التأثير <b>بالتأثير الحثي المتبادل Mutual Inductance</b> لأنه نتج من تأثير دائرة كهربائية على أخرى.</p>
     <p>في الشكل (٥-١٩) توضيح للتأثير الحثي المتبادل حيث يوجد ملفان متجاوران يمر في الملف الأول وعدد لفاته \(N_1\) تيار كهربائي قيمته \(I_1\) ينشئ مجالا مغناطيسياً يؤثر على الملف الثاني وعدد لفاته \(N_2\) بفيض مغناطيسي \(\Phi_{21}\) يؤدي إلى تيار حثي في الملف الثاني وقيمته \(I_2\).</p>`,ref:'ص 145'},
    {predict:{q:'يمر في الملف الأول تيار مستمر ثابت القيمة. هل تتولد قوة دافعة في الملف الثاني؟',opts:[
     ['نعم، ما دام التيار يمر في الأول',false,'الفيض الثابت لا يولّد شيئاً؛ المعادلة (5-23) فيها معدل التغير \\(dI_1/dt\\).'],
     ['لا، لأن التيار لا يتغير',true,'\\(E_2=-M_{21}\\,dI_1/dt\\)، و\\(dI_1/dt=0\\) للتيار الثابت.'],
     ['نعم، لكن في الملف الأول فقط',false,'السؤال عن الملف الثاني، والتيار الثابت لا يولّد قوة دافعة حثية في أي منهما.']]}}
   ],
   body:[
    {book:String.raw`<p>يعرف التأثير الحثي المتبادل \(M_{21}\) في الملف الثاني من خلال المعادلة التالية:</p>
     <div class="eq">$$M_{21}=\frac{N_2\,\phi_{21}}{I_1}$$<span class="eqno">(5-21)</span></div>
     <div class="eq">$$\phi_{21}=\frac{M_{21}}{N_2}\,I_1$$<span class="eqno">(5-22)</span></div>
     <p>إذا كان التيار \(I_1\) في الملف الأول متغيراً مع الزمن فإنه من قانون فارادي تكون القوة الدافعة الكهربائية المتولدة في الملف الثاني نتيجة للملف الأول:</p>
     <div class="eq">$$E_2=-N_2\frac{d\phi_{21}}{dt}=-M_{21}\frac{dI_1}{dt}$$<span class="eqno">(5-23)</span></div>
     <p>وبنفس الفكرة إذا كان التيار \(I_2\) في الملف الثاني متغيراً مع الزمن فإن من قانون فارادي تكون القوة الدافعة الكهربائية المتولدة في الملف الأول نتيجة للملف الثاني :</p>
     <div class="eq">$$E_1=-M_{12}\frac{dI_2}{dt}$$<span class="eqno">(5-24)</span></div>
     <p>أي أن القوة الدافعة الكهربائية المتولدة في ملف تتناسب طردياً مع معدل التغير في التيار الكهربائي في الملف الآخر.</p>`,ref:'ص 146'},
    {book:String.raw`<p><b>حالة خاصة:</b><br>في حالة ما يكون معدل التغير في التيار \((dI_1/dt)=(dI_2/dt)\) فإن القوة الدافعة الكهربائية</p>
     <div class="eq">$$E_1=E_2$$<span class="eqno">(5-25)</span></div>
     <p>وهذا يعني أن</p>
     <div class="eq">$$M_{21}=M_{12}=M$$<span class="eqno">(5-26)</span></div>
     <p>وتكون قيمة القوة الدافعة الكهربائية في الملفين تعطى بـ</p>
     <div class="eq">$$E_1=-M\frac{dI_2}{dt}\ ,\quad E_2=-M\frac{dI_1}{dt}$$<span class="eqno">(5-27)</span></div>
     <p>وتكون وحدة الحث المتبادل هي الهنري Henry</p>`,ref:'ص 146'},
    {tip:String.raw`<p>قارن (5-21) بـ (5-14): في الحث الذاتي \(L=N\phi/I\) الفيض والتيار في الملف نفسه، وفي الحث المتبادل \(M_{21}=N_2\phi_{21}/I_1\) التيار في الملف الأول والفيض الذي يقطع الملف الثاني. والصيغة نفسها تقريباً لقانون القوة الدافعة: \(E=-L\,dI/dt\) و\(E_2=-M\,dI_1/dt\).</p>`,title:'قارن بالحث الذاتي'},
    {add:String.raw`<p>المحول الكهربائي وشاحن الجوال اللاسلكي يعملان بالحث المتبادل: تيار متردد في ملف يولّد جهداً في ملف آخر قريب منه دون أي توصيل بينهما.</p>`,title:'من حولك'},
    {watch:String.raw`<p>الترقيم في الكتاب يقفز من (5-19) إلى (5-21)؛ لا توجد معادلة (5-20). أبقينا الأرقام كما طُبعت حتى تطابق الكتاب.</p>`,fix:true}
   ]},

  {st:5,short:'التوصيل على التوالي',title:'توصيل الملفات على التوالي: مجالان يتعاونان أو يتعاكسان',ref:'ص 147–149',
   q:'ملفان على التوالي… هل الحث الكلي هو مجموعهما فقط كما في المقاومات؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ملفان على التوالي مرتين: (أ) المجالان B1 وB2 في اتجاه واحد، (ب) متعاكسان" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><text x="30" y="96" font-size="15" font-weight="700" fill="#2C4A40" direction="rtl" unicode-bidi="embed">(أ)</text><g data-tip="(أ) الملفان ملفوفان في الاتجاه نفسه: المجالان ⟦B1⟧ و⟦B2⟧ في اتجاه واحد، فيكون ⟦L' = L1 + L2 + 2M⟧."><rect x="60" y="74" width="110" height="40" rx="7" fill="#F1EBDD" stroke="#2C4A40" stroke-width="2"/><rect x="190" y="74" width="110" height="40" rx="7" fill="#F1EBDD" stroke="#2C4A40" stroke-width="2"/><path d="M70 70l8 48M86 70l8 48M102 70l8 48M118 70l8 48M134 70l8 48M150 70l8 48" stroke="#B9852A" stroke-width="4" stroke-linecap="round"/><path d="M200 70l8 48M216 70l8 48M232 70l8 48M248 70l8 48M264 70l8 48M280 70l8 48" stroke="#B9852A" stroke-width="4" stroke-linecap="round"/><path d="M70 70 V52 M158 70 V58 H208 V70 M288 70 V52" fill="none" stroke="#2C4A40" stroke-width="2.5"/><line x1="86" y1="134" x2="140" y2="134" stroke="#3A7CA5" stroke-width="4"/><polygon points="152,134 138,127 138,141" fill="#3A7CA5"/><line x1="216" y1="134" x2="270" y2="134" stroke="#3A7CA5" stroke-width="4"/><polygon points="282,134 268,127 268,141" fill="#3A7CA5"/></g><g data-tip="(ب) لفات الملف الثاني معكوسة: المجالان ⟦B1⟧ و⟦B2⟧ متعاكسان، فيكون ⟦L'' = L1 + L2 − 2M⟧."><rect x="60" y="190" width="110" height="40" rx="7" fill="#F1EBDD" stroke="#2C4A40" stroke-width="2"/><rect x="190" y="190" width="110" height="40" rx="7" fill="#F1EBDD" stroke="#2C4A40" stroke-width="2"/><path d="M70 186l8 48M86 186l8 48M102 186l8 48M118 186l8 48M134 186l8 48M150 186l8 48" stroke="#B9852A" stroke-width="4" stroke-linecap="round"/><path d="M208 186l-8 48M224 186l-8 48M240 186l-8 48M256 186l-8 48M272 186l-8 48M288 186l-8 48" stroke="#E8735A" stroke-width="4" stroke-linecap="round"/><path d="M70 186 V168 M158 186 V174 H208 V186 M288 186 V168" fill="none" stroke="#2C4A40" stroke-width="2.5"/><line x1="86" y1="250" x2="140" y2="250" stroke="#3A7CA5" stroke-width="4"/><polygon points="152,250 138,243 138,257" fill="#3A7CA5"/><line x1="232" y1="250" x2="286" y2="250" stroke="#3A7CA5" stroke-width="4"/><polygon points="220,250 234,243 234,257" fill="#3A7CA5"/></g><text x="30" y="212" font-size="15" font-weight="700" fill="#2C4A40" direction="rtl" unicode-bidi="embed">(ب)</text><text x="115" y="158" text-anchor="middle" font-size="14" font-weight="700" fill="#3A7CA5" font-family="var(--mono)">B1</text><text x="245" y="158" text-anchor="middle" font-size="14" font-weight="700" fill="#3A7CA5" font-family="var(--mono)">B2</text><text x="115" y="274" text-anchor="middle" font-size="14" font-weight="700" fill="#3A7CA5" font-family="var(--mono)">B1</text><text x="255" y="274" text-anchor="middle" font-size="14" font-weight="700" fill="#3A7CA5" font-family="var(--mono)">B2</text></svg>`,
   cap:'توصيل الملفات على التوالي كما في الشكل (٥-٢٠): (أ) مجالان لهما نفس الاتجاه، (ب) متعاكسان (لفات الملف الثاني بالأحمر معكوسة).<br><b>مرّر المؤشر على كل صف (أو المسه في الجوال) لتعرف الحث المكافئ له.</b>',
   side:[
    {book:String.raw`<p>توصل ملفات الحث، كما توصل غيرها من عناصر الدوائر الكهربائية، إما على التوالي أو التوازي أو في شبكات أكثر تعقيداً. و لكي نستطيع مناقشة توصيل الملفات نبدأ بتعريف الحث الذاتي المكافئ كما يلي:</p>
     <p><b>الحث الذاتي المكافئ للشبكة</b> هو نسبة القوة الدافعة الكهربائية الكلية (ذاتية و تبادلية) المستحثة بين طرفي الشبكة إلى معدل تغيير التيار المسبب لتوليد هذه القوة الدافعة الكهربائية.</p>`,ref:'ص 147'},
    {predict:{q:'ملفان على التوالي، وعكسنا طرفي أحدهما فصار مجالاهما متعاكسين. الحث المكافئ:',opts:[
     ['يزداد: \\(L_1+L_2+2M\\)',false,'هذا عندما يكون المجالان في اتجاه واحد (الشكل ٥-٢٠أ).'],
     ['يقل: \\(L_1+L_2-2M\\)',true,'المعادلة (5-33): الحث المتبادل يُطرح مرتين عندما يتعاكس المجالان.'],
     ['يبقى \\(L_1+L_2\\) دائماً',false,'هذا فقط عندما \\(M=0\\)، أي الملفان متباعدان (المعادلة 5-34).']]}}
   ],
   body:[
    {book:String.raw`<p>إذا فرضنا كما في الشكل (٥-٢٠) وجود ملفين أحدهما حثه الذاتي \(L_1\) و الثاني حثه الذاتي \(L_2\) و معامل الحث المتبادل \(M\) واتصل هذان الملفان على التوالي و مر بهما التيار \(I\) بحيث تكون كثافة الفيض المغناطيسي لهما \(B_1\) ، \(B_2\) في اتجاه واحد كما في الشكل(٥-٢٠أ).</p>
     <p>إذا تغيرت شدة التيار المار فيهما فإن القوة الدافعة الكهربائية التأثيرية الذاتية و المتبادلة في كل من الملفين تكون في اتجاه واحد أيضاً.</p>
     <p>و تكون القوة الدافعة التأثرية المتولدة في الملف (1) تساوي:</p>
     <div class="eq">$$E_1=L_1\frac{dI}{dt}+M\frac{dI}{dt}$$<span class="eqno">(5-28)</span></div>
     <p>أما القوة الدافعة الكهربائية المتولدة في الملف (2) فتساوي:</p>
     <div class="eq">$$E_2=L_2\frac{dI}{dt}+M\frac{dI}{dt}$$<span class="eqno">(5-29)</span></div>
     <p>و بذلك تكون القوة الدافعة التأثيرية الكلية:</p>
     <div class="eq">$$E=E_1+E_2=(L_1+L_2+2M)\frac{dI}{dt}$$<span class="eqno">(5-30)</span></div>
     <div class="eq">$$E=L'\frac{dI}{dt}$$<span class="eqno">(5-31)</span></div>
     <p>و هكذا فإن الحث الذاتي المكافئ \(L'\) يساوي:</p>
     <div class="eq">$$L'=L_1+L_2+2M$$<span class="eqno">(5-32)</span></div>
     <p>و إذا مر التيار \(I\) بحيث يؤدي إلى أن تكون \(B_1\) ، \(B_2\) في اتجاه مضاد كما هو موضح بالشكل (٥-٢٠ب) فإن محصلة القوة الدافعة التأثيرية الذاتية و المتبادلة المتولدة (نتيجة تغيير شدة التيار) في الملفين هي:</p>
     <div class="eq">$$L''=L_1+L_2-2M$$<span class="eqno">(5-33)</span></div>`,ref:'ص 147–148'},
    {book:String.raw`<p><b>ملحوظات مهمة:</b></p><ol><li>إذا كان الفيض الناشئ في أحد الملفين لا يقطع الملف الآخر نظراً لابتعادهما عن بعضهما البعض فإن \(M=0\) و يكون الحث الذاتي المكافئ طبقاً للمعادلتين (5-32) ، (5-33)
     <div class="eq">$$L=L_1+L_2$$<span class="eqno">(5-34)</span></div></li>
     <li>بطرح المعادلة (5-33) من المعادلة (5-32) ينتج أن الحث المتبادل بين الملفين هو:
     <div class="eq">$$M=\tfrac14\,(L'-L'')$$<span class="eqno">(5-35)</span></div>
     <div class="eq">$$M^2=K^2\,L_1\times L_2$$</div>
     <div class="eq">$$M=K\sqrt{L_1\times L_2}$$<span class="eqno">(5-36)</span></div>
     أي أن الحث المتبادل بين ملفين يساوي الجذر التربيعي لحاصل ضرب حثهما الذاتي و ذلك عند تلاصق الملفين.</li></ol>`,ref:'ص 148–149'},
    {tip:String.raw`<p>لماذا \(2M\)؟ كل ملف يتأثر بالآخر: الملف (1) يأخذ \(M\) من الملف (2) في (5-28)، والملف (2) يأخذ \(M\) من الملف (1) في (5-29)؛ المجموع \(2M\). إذا كان المجالان متعاونين يُضاف، وإذا تعاكسا يُطرح. ومن الطرح نحصل على (5-35): \(L'-L''=4M\).</p>`,title:'من أين جاء 2M؟'},
    {add:String.raw`<p>يستعمل الكتاب الرمز \(K\) في (5-36) دون تعريفه. \(K\) هو <b>معامل الاقتران</b>: نسبة فيض الملف الأول الذي يقطع الملف الثاني إلى كل فيض الملف الأول، وقيمته بين 0 و1. عند \(K=0\) (ملفان متباعدان) يكون \(M=0\) كما في الملحوظة 1، وعند \(K=1\) (اقتران تام، ملفان متلاصقان أو على قلب حديدي مشترك) يكون \(M=\sqrt{L_1L_2}\)، وهي الحالة التي تقصدها جملة الكتاب «عند تلاصق الملفين».</p>`,title:'معامل الاقتران K'},
    {watch:String.raw`<p>طُبعت المعادلة \(L=L_1+L_2\) في الكتاب برقم «(9-34)» والصحيح (5-34). والانتقال من (5-35) إلى (5-36) في الكتاب بلا اشتقاق، وعبارة «يساوي الجذر التربيعي…» تصح فقط عند \(K=1\).</p>`,fix:true}
   ]},

  {st:6,short:'التوصيل على التوازي',title:'توصيل الملفات على التوازي',ref:'ص 149–150',
   q:'في المقاومات على التوازي تكون المقاومة المكافئة أصغر من أصغرها… فهل تتصرف الملفات بالطريقة نفسها؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ملفان على التوازي بين خطين، والتيار الكلي I يتفرع إلى I1 وI2" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><path d="M60 160 H100 M100 100 V220 M100 100 H140 M220 100 H260 M100 220 H140 M220 220 H260 M260 100 V220 M260 160 H300" fill="none" stroke="#2C4A40" stroke-width="3.5"/><g data-tip="الملف الأول: حثه الذاتي ⟦L1⟧ ويمر فيه التيار ⟦I1⟧."><rect x="140" y="84" width="80" height="32" rx="7" fill="#F1EBDD" stroke="#2C4A40" stroke-width="2"/><path d="M148 80l6 40M162 80l6 40M176 80l6 40M190 80l6 40M204 80l6 40" stroke="#B9852A" stroke-width="4" stroke-linecap="round"/><text x="180" y="72" text-anchor="middle" font-size="15" font-weight="700" fill="#2C4A40" font-family="var(--mono)">L1</text></g><g data-tip="الملف الثاني: حثه الذاتي ⟦L2⟧ ويمر فيه التيار ⟦I2⟧."><rect x="140" y="204" width="80" height="32" rx="7" fill="#F1EBDD" stroke="#2C4A40" stroke-width="2"/><path d="M148 200l6 40M162 200l6 40M176 200l6 40M190 200l6 40M204 200l6 40" stroke="#B9852A" stroke-width="4" stroke-linecap="round"/><text x="180" y="262" text-anchor="middle" font-size="15" font-weight="700" fill="#2C4A40" font-family="var(--mono)">L2</text></g><g data-tip="التيار الكلي ⟦I⟧ يتفرع بين الملفين: ⟦I = I1 + I2⟧ (المعادلة 5-37)."><polygon points="78,152 94,160 78,168" fill="#3A7CA5"/><text x="70" y="146" font-size="15" font-weight="700" fill="#3A7CA5" font-family="var(--mono)">I</text><polygon points="116,92 132,100 116,108" fill="#3A7CA5"/><text x="112" y="88" font-size="13" font-weight="700" fill="#3A7CA5" font-family="var(--mono)">I1</text><polygon points="116,212 132,220 116,228" fill="#3A7CA5"/><text x="112" y="246" font-size="13" font-weight="700" fill="#3A7CA5" font-family="var(--mono)">I2</text></g><text x="180" y="300" text-anchor="middle" font-size="14" font-weight="600" fill="#2C4A40" direction="rtl" unicode-bidi="embed">الملفان متباعدان: لا حث متبادل</text></svg>`,
   cap:'ملفان على التوازي، والتيار الكلي يتفرع بينهما.<br><b>مرّر المؤشر على الملفين والأسهم (أو المسه في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>إذا فرضنا أن الملفين متصلان على التوازي ففي هذه الحالة يتفرع التيار \(I\) بين الملفين و يكون التيار الكلي كما يلي:</p>
     <div class="eq">$$I=I_1+I_2+\dots$$<span class="eqno">(5-37)</span></div>
     <p>حيث إن التيار \(I_1\) المار في الملف الذي حثه الذاتي \(L_1\) وكذلك التيار \(I_2\) المار في الملف الذي حثه الذاتي \(L_2\).</p>`,ref:'ص 149'},
    {predict:{q:'ملفان متماثلان (كل منهما \\(L\\)) على التوازي، ولا تأثير متبادل بينهما. الحث المكافئ:',opts:[
     ['\\(2L\\)',false,'هذا للتوالي بلا حث متبادل (المعادلة 5-34).'],
     ['\\(L\\)',false,'التوازي يقلل الحث المكافئ، كما في المقاومات.'],
     ['\\(L/2\\)',true,'من (5-42): \\(1/L_{eq}=1/L+1/L=2/L\\)، أي \\(L_{eq}=L/2\\).']]}}
   ],
   body:[
    {book:String.raw`<p>و يكون معدل تغير التيار الكلي بالنسبة للزمن مساوياً لمجموع معدل التغير لكل من \(I_1\) و \(I_2\) ويتم ذلك بتفاضل المعادلة (5-37) بالنسبة للزمن:</p>
     <div class="eq">$$\frac{dI}{dt}=\frac{dI_1}{dt}+\frac{dI_2}{dt}$$<span class="eqno">(5-38)</span></div>
     <p>و بما أن :</p>
     <div class="eq">$$\frac{dI}{dt}=-\frac{E}{L}$$<span class="eqno">(5-39)</span></div>
     <div class="eq">$$\frac{dI_1}{dt}=-\frac{E_1}{L_1}$$<span class="eqno">(5-40)</span></div>
     <div class="eq">$$\frac{dI_2}{dt}=-\frac{E_2}{L_2}$$<span class="eqno">(5-41)</span></div>
     <p>و بالتعويض في المعادلة (5-38)، و إذاً كان هناك عدد من الملفات يزيد على اثنين نجد أن :</p>
     <div class="eq">$$\frac1L=\frac1{L_1}+\frac1{L_2}+\frac1{L_3}+\dots+\frac1{L_n}$$<span class="eqno">(5-42)</span></div>
     <p>و يتم هذا على شرط أن نقوم باتخاذ احتياطات معينة تمنع تأثير المجالات المغناطيسية لهذه الملفات على بعضها البعض حتى لا يحدث ارتباط مغناطيسي بينهما نتيجة للتأثير المتبادل.</p>`,ref:'ص 149–150'},
    {tip:String.raw`<p>الخطوة التي لم يكتبها الكتاب: الملفات المتوازية متصلة بين النقطتين نفسيهما، فعليها الجهد نفسه: \(E=E_1=E_2\). نعوض (5-39) إلى (5-41) في (5-38) ثم نقسم الطرفين على \(-E\) فنحصل على (5-42). والنتيجة مثل المقاومات تماماً: الحث المكافئ <b>أصغر من أصغر ملف</b>.</p>`,title:'الخطوة الناقصة'},
    {watch:String.raw`<p>(5-42) صحيحة فقط إذا لم يكن بين الملفات حث متبادل (\(M=0\))، ولهذا يشترط الكتاب «احتياطات تمنع تأثير المجالات… على بعضها».</p>`},
    {watch:String.raw`<p>في الكتاب طُبع «بالتعويض في المعادلة (9-38)» والصحيح (5-38).</p>`,fix:true}
   ]},

  {st:7,short:'الأمثلة',title:'أمثلة محلولة',ref:'ص 150–151',
   q:'مثالان من الكتاب: حث ملف ذي قلب حديدي ثم بعد نزع القلب، والنفاذية النسبية لحلقة حديدية والحث الذاتي لملفها. الحل الكامل في تبويب «الأمثلة المحلولة».',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ملف مثال 5-9: مئة لفة على قلب حديدي طوله 10 سم وقطره 5 مم ونفاذيته النسبية 1000" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="القلب الحديدي في مثال (٥-٩): نفاذيته النسبية ⟦μr = 1000⟧. إذا نُزع تنخفض الحثية بنسبة ⟦μr⟧."><rect x="70" y="140" width="220" height="40" rx="6" fill="#9AA5A0" stroke="#2C4A40" stroke-width="2.5"/><text x="180" y="166" text-anchor="middle" font-size="15" font-weight="700" fill="#FBF6EE" font-family="var(--mono)">μr = 1000</text></g><g data-tip="الملف: ⟦N = 100⟧ لفة." stroke="#B9852A" stroke-width="4.5" stroke-linecap="round"><path d="M84 134l8 52M106 134l8 52M128 134l8 52M222 134l8 52M244 134l8 52M266 134l8 52"/></g><text x="180" y="116" text-anchor="middle" font-size="16" font-weight="700" fill="#B9852A" font-family="var(--mono)">N = 100</text><g data-tip="طول الملف ⟦ℓ = 10 cm⟧، وهو أكبر بكثير من القطر، فتصلح المعادلة ⟦B = μNI/ℓ⟧."><line x1="74" y1="216" x2="286" y2="216" stroke="#2C4A40" stroke-width="2.5"/><polygon points="70,216 82,210 82,222" fill="#2C4A40"/><polygon points="290,216 278,210 278,222" fill="#2C4A40"/><text x="180" y="240" text-anchor="middle" font-size="15" font-weight="700" fill="#2C4A40" font-family="var(--mono)">ℓ = 10 cm</text></g><g data-tip="قطر القلب ⟦d = 5 mm⟧، ومنه مساحة المقطع ⟦A = πd²/4⟧."><line x1="306" y1="140" x2="306" y2="180" stroke="#2C4A40" stroke-width="2.5"/><text x="300" y="132" font-size="14" font-weight="700" fill="#2C4A40" font-family="var(--mono)">d = 5 mm</text></g></svg>`,
   cap:'معطيات مثال (٥-٩).<br><b>مرّر المؤشر على القلب واللفات والأبعاد (أو المسه في الجوال) لتعرف معناها.</b>',
   side:[
    {html:String.raw`<div class="exl">
     <div class="exc"><header>مثال (٥-٩) <span class="ref">ص 150</span></header>
      <div class="kv-row"><small>المعطيات</small><span class="kv ltr">\(N=100\)</span><span class="kv ltr">\(\ell=10\ \text{cm}\)</span><span class="kv ltr">\(\mu_r=1000\)</span><span class="kv ltr">\(d=5\ \text{mm}\)</span></div>
      <div class="kv-row"><small>النتائج</small><span class="kv res ltr">\(L=2.5\ \text{mH}\)</span><span class="kv res ltr">\(L=2.5\ \mu\text{H}\) بلا قلب</span></div></div>
     <div class="exc"><header>مثال (٥-١٠) <span class="ref">ص 151</span></header>
      <div class="kv-row"><small>المعطيات</small><span class="kv ltr">\(A=1\ \text{cm}^2\)</span><span class="kv ltr">\(\ell=40\ \text{cm}\)</span><span class="kv ltr">\(N=4000\)</span><span class="kv ltr">\(I=0.5\ \text{A}\)</span><span class="kv ltr">\(B=0.4\ \text{Wb/m}^2\)</span></div>
      <div class="kv-row"><small>النتائج</small><span class="kv res ltr">\(H=5000\ \text{AT/m}\)</span><span class="kv res ltr">\(\mu_r\approx63.7\)</span><span class="kv res ltr">\(L=0.32\ \text{H}\)</span></div></div>
     <div class="w-row"><button class="btn pri" type="button" onclick="var b=document.querySelector('.ltabs button[data-tab=examples]');if(b)b.click()">افتح الأمثلة المحلولة وغيّر الأرقام</button></div></div>`}
   ],
   body:[
    {predict:{q:'في مثال (٥-٩) نزعنا القلب الحديدي \\((\\mu_r=1000)\\). ماذا يحدث للحثية؟',opts:[
     ['لا تتغير لأن اللفات نفسها',false,'الحثية تتناسب مع نفاذية القلب، وقد تغيرت.'],
     ['تقل 1000 مرة',true,'الكتاب: لو نزعنا القلب الحديدي فإن الحثية تنخفض بنسبة μr، فتصبح <span class="ltr">2.5 μH</span> بدل <span class="ltr">2.5 mH</span>.'],
     ['تزيد 1000 مرة',false,'الحديد هو الذي يزيد الحثية؛ نزعه ينقصها.']]}},
    {book:String.raw`<p>ونلاحظ أن الحثية في الملفات الطويلة تتناسب مع نفاذية ومساحة مقطع القلب ومع مربع عدد اللفات كما تتناسب عكسياً مع طول الملف.</p>`,ref:'ص 150'},
    {watch:String.raw`<p>في مثال (٥-١٠) عُوِّضت المساحة <span class="ltr">1 cm²</span> على أنها <span class="ltr">0.01 m²</span>، والصحيح <span class="ltr">1 × 10⁻⁴ m²</span>، فيكون الحث <span class="ltr">0.32 H</span> لا <span class="ltr">32 H</span> كما طُبع. وناتج \(\mu_r\) المطبوع 63.69 والدقيق 63.66. وفي مثال (٥-٩) يذكر الحل «المعادلة (5-2)» وهي للملف الحلقي، والمستعمل فعلاً \(B=\mu NI/\ell\) المعطاة في نص المثال، ثم \(L=N\Phi/I\) أي (5-14). في تبويب الأمثلة مفتاح «كما في الكتاب / المصحح» لمثال (٥-١٠).</p>`,fix:true},
    {tip:String.raw`<p>تحويل المساحة: \(1\ \text{m}=100\ \text{cm}\) لذلك \(1\ \text{m}^2=100\times100=10^4\ \text{cm}^2\)، فـ \(1\ \text{cm}^2=10^{-4}\ \text{m}^2\). خطأ شائع أن نقسم على 100 فقط.</p>`,title:'تحويل الوحدات المربعة'}
   ]},

  {recap:[
   String.raw`الحث الذاتي: الملف يقاوم تغيّر تياره. المعادلة (5-13): \(E=-N\dfrac{d\phi_m}{dt}=-L\dfrac{dI}{dt}\)، والمعادلة (5-14): \(L=\dfrac{N\phi_m}{I}\)، ووحدته الهنري.`,
   String.raw`حث الملف الطويل من أبعاده، المعادلة (5-19): \(L=\dfrac{\mu_0N^2A}{\ell}\): يتناسب مع مربع اللفات ومع المساحة، وعكسياً مع الطول.`,
   String.raw`الحث المتبادل، المعادلة (5-21): \(M_{21}=\dfrac{N_2\phi_{21}}{I_1}\)، والقوة الدافعة في الملف الثاني، المعادلة (5-23): \(E_2=-M_{21}\dfrac{dI_1}{dt}\)`,
   String.raw`التوالي، المعادلة (5-32): \(L'=L_1+L_2+2M\) (مجالان متعاونان)، والمعادلة (5-33): \(L''=L_1+L_2-2M\) (متعاكسان)، والمعادلة (5-36): \(M=K\sqrt{L_1L_2}\)`,
   String.raw`التوازي بلا حث متبادل، المعادلة (5-42): \(\dfrac1L=\dfrac1{L_1}+\dfrac1{L_2}+\dots\)، فالحث المكافئ أصغر من أصغر ملف.`]}
],
 theory:[
  {h:'الحث الذاتي والحث المتبادل',ref:'ص 143',html:`<p>تعلمنا أن التيار ينشأ في الدائرة الكهربائية عندما يتغير الفيض المغناطيسي خلالها مع الزمن. وفيما يلي ندرس <b>الحث الذاتي Self Inductance</b> الذي ينشأ في الدائرة نفسها عند مرور تيار فيها، أو بمعنى أدق عند غلق أو فتح الدائرة. وهذا التأثير يلعب دوراً أساسياً في دوائر التيار المتردد حيث يتغير التيار باستمرار مع الزمن.</p>`},
  {h:'الحث الذاتي',ref:'ص 143–144',html:`<p>اعتبر دائرة مكونة من بطارية ومقاومة ومفتاح كما في الشكل (٥-١٨). عند غلقها فإن التيار لن يصل إلى قيمته العظمى فور غلق المفتاح وإنما يستغرق بعض الوقت نتيجة لقانون فارادي. عند غلق المفتاح يحدث ما يلي:</p>
   <ol><li>يزداد التيار المار في الدائرة مع الزمن.</li><li>يزداد الفيض المغناطيسي خلال الدائرة نتيجة لازدياد التيار.</li><li>الفيض المتزايد يؤدي إلى توليد قوة دافعة كهربائية في الدائرة تعاكس الزيادة في الفيض (قانون لنز Lenz's Law).</li></ol>
   <p>هذه القوة الدافعة المتولدة تعمل في اتجاه معاكس للتيار الأصلي، ويعرف هذا التأثير باسم <b>التأثير الحثي الذاتي Self Induction</b>. وحيث إن الفيض يتناسب مع المجال، والمجال يتناسب مع التيار، فإن القوة الدافعة للحث الذاتي تتناسب مع معدل التغير في التيار:</p>
   $$E=-N\\frac{d\\phi_m}{dt}=-L\\frac{dI}{dt} \\qquad (5\\text{-}13)$$
   <p>والحث الذاتي \\(L\\) في المغناطيسية يناظر السعة \\(C\\) في الكهربية، ويمكن التعبير عنه بالأبعاد الهندسية للدائرة. لملف عدد لفاته \\(N\\):</p>
   $$L=\\frac{N\\,\\phi_m}{I} \\qquad (5\\text{-}14)$$ $$L=-\\frac{E}{dI/dt} \\qquad (5\\text{-}15)$$
   <p>والمعادلة (5-15) تعطي قيمة الحث الذاتي بغض النظر عن الأبعاد الهندسية، من قياس الكميات الفيزيائية: القوة الدافعة والتغير في التيار. ووحدة الحث الذاتي <b>الهنري Henry (H)</b>.</p>`},
  {fig:'(٥-١٨)',ref:'ص 143',caption:'دائرة بطارية ε ومقاومة R ومفتاح S: عند الغلق يزداد التيار I تدريجياً ويزداد معه المجال B حول السلك.',draw:()=>box(fig518(),420)},
  {h:'إيجاد الحث الذاتي من خلال قياس الأبعاد الهندسية',ref:'ص 144–145',html:`<p>اعتبر ملفاً عدد لفاته \\(N\\) وطوله \\(\\ell\\) أكبر بكثير من نصف قطره. ينشأ عنه مجال:</p>
   $$B=\\mu_0\\frac{N}{\\ell}\\,I \\qquad (5\\text{-}17)$$
   <p>أما الفيض المغناطيسي فيعطى بالعلاقة:</p>
   $$\\phi_m=B\\times A=\\mu_0\\frac{N\\,A}{\\ell}\\,I \\qquad (5\\text{-}18)$$ $$L=\\frac{N\\phi_m}{I}=\\frac{\\mu_0 N^2 A}{\\ell} \\qquad (5\\text{-}19)$$
   <p>ومن هذا يتضح أن الحث الذاتي للملف يعتمد على خواصه الهندسية (الطول والمساحة وعدد اللفات).</p>`},
  {note:'<b>توضيح للمتدرب (ليس من الكتاب):</b> لأن \\(N\\) مربعة في (5-19) فإن مضاعفة عدد اللفات تضاعف الحث أربع مرات. وإذا وُضع قلب نفاذيته النسبية \\(\\mu_r\\) نضرب في \\(\\mu_r\\): \\(L=\\mu_0\\mu_r N^2A/\\ell\\) — وهو ما يستعمله مثال (٥-٩) ومثال (٥-١١).'},
  {h:'الحث المتبادل Mutual Inductance',ref:'ص 145–146',html:`<p>يؤدي التغير في التيار في دائرة إلى تغيير في الفيض في دائرة مجاورة، وهذا يولد قوة دافعة كهربائية في تلك الدائرة، ويسمى هذا <b>التأثير الحثي المتبادل</b> لأنه نتج من تأثير دائرة على أخرى. في الشكل (٥-١٩) ملفان متجاوران: يمر في الأول (\\(N_1\\) لفة) تيار \\(I_1\\) ينشئ مجالاً يؤثر على الملف الثاني (\\(N_2\\) لفة) بفيض \\(\\Phi_{21}\\) يؤدي إلى تيار حثي \\(I_2\\) في الملف الثاني. يعرف التأثير الحثي المتبادل \\(M_{21}\\):</p>
   $$M_{21}=\\frac{N_2\\,\\phi_{21}}{I_1} \\qquad (5\\text{-}21)$$ $$\\phi_{21}=\\frac{M_{21}}{N_2}\\,I_1 \\qquad (5\\text{-}22)$$
   <p>إذا كان التيار \\(I_1\\) متغيراً مع الزمن فإنه من قانون فارادي تكون القوة الدافعة المتولدة في الملف الثاني:</p>
   $$E_2=-N_2\\frac{d\\phi_{21}}{dt}=-M_{21}\\frac{dI_1}{dt} \\qquad (5\\text{-}23)$$
   <p>وبنفس الفكرة إذا كان \\(I_2\\) متغيراً: \\(E_1=-M_{12}\\,dI_2/dt\\) (5-24)، أي أن القوة الدافعة المتولدة في ملف تتناسب طردياً مع معدل تغير التيار في الملف الآخر.</p>
   <p><b>حالة خاصة:</b> إذا كان \\(dI_1/dt=dI_2/dt\\) فإن \\(E_1=E_2\\) (5-25)، وهذا يعني أن \\(M_{21}=M_{12}=M\\) (5-26)، وتكون:</p>
   $$E_1=-M\\frac{dI_2}{dt}\\ ,\\quad E_2=-M\\frac{dI_1}{dt} \\qquad (5\\text{-}27)$$ <p>ووحدة الحث المتبادل الهنري.</p>`},
  {fig:'(٥-١٩)',ref:'ص 145',caption:'خطوط مجال الملف 1 يمر بعضها خلال الملف 2.',draw:()=>box(fig519(),500)},
  {h:'توصيل الملفات على التوالي',ref:'ص 147–149',html:`<p>توصل ملفات الحث — كغيرها من عناصر الدوائر — على التوالي أو التوازي أو في شبكات أكثر تعقيداً. <b>الحث الذاتي المكافئ للشبكة</b> هو نسبة القوة الدافعة الكهربائية الكلية (ذاتية وتبادلية) المستحثة بين طرفي الشبكة إلى معدل تغير التيار المسبب لها.</p>
   <p>إذا فرضنا ملفين \\(L_1\\) و\\(L_2\\) ومعامل الحث المتبادل بينهما \\(M\\) متصلين على التوالي ويمر بهما التيار \\(I\\) بحيث يكون مجالاهما \\(B_1\\) و\\(B_2\\) في اتجاه واحد (الشكل ٥-٢٠أ)، فإن القوة الدافعة الذاتية والمتبادلة في كل ملف تكون في اتجاه واحد أيضاً:</p>
   $$E_1=L_1\\frac{dI}{dt}+M\\frac{dI}{dt} \\qquad (5\\text{-}28)$$ $$E_2=L_2\\frac{dI}{dt}+M\\frac{dI}{dt} \\qquad (5\\text{-}29)$$
   $$E=E_1+E_2=(L_1+L_2+2M)\\frac{dI}{dt} \\qquad (5\\text{-}30)$$ $$E=L'\\frac{dI}{dt} \\qquad (5\\text{-}31)$$ $$L'=L_1+L_2+2M \\qquad (5\\text{-}32)$$
   <p>وإذا مر التيار بحيث يكون \\(B_1\\) و\\(B_2\\) في اتجاهين متضادين (الشكل ٥-٢٠ب):</p>
   $$L''=L_1+L_2-2M \\qquad (5\\text{-}33)$$`},
  {fig:'(٥-٢٠)',ref:'ص 147',caption:'توصيل الملفات على التوالي: (أ) ينتج عن مرور التيار فيهما مجالان لهما نفس الاتجاه. (ب) متعاكسان في الاتجاه (لفات L₂ معكوسة).',draw:()=>fig520()},
  {html:`<p><b>ملحوظات مهمة</b> <span class="ref">ص 148–149</span>:</p><ol><li>إذا كان فيض أحد الملفين لا يقطع الآخر نظراً لابتعادهما فإن \\(M=0\\) ويكون الحث المكافئ طبقاً للمعادلتين (5-32) و(5-33): $$L=L_1+L_2 \\qquad (5\\text{-}34)$$</li>
   <li>بطرح المعادلة (5-33) من المعادلة (5-32) ينتج أن الحث المتبادل بين الملفين: $$M=\\tfrac14\\,(L'-L'') \\qquad (5\\text{-}35)$$ $$M^2=K^2\\,L_1L_2 \\qquad\\quad M=K\\sqrt{L_1L_2} \\qquad (5\\text{-}36)$$ أي أن الحث المتبادل بين ملفين يساوي الجذر التربيعي لحاصل ضرب حثهما الذاتي وذلك عند تلاصق الملفين.</li></ol>`},
  {note:`<b>إضافة من خارج الكتاب — معامل الاقتران K:</b> يستعمل الكتاب الرمز \\(K\\) في (5-36) دون تعريفه. \\(K\\) هو <b>معامل الاقتران</b>: نسبة فيض الملف الأول الذي يقطع الملف الثاني إلى كل فيض الملف الأول، وقيمته بين 0 و 1:
   <ul><li>\\(K=0\\): الملفان متباعدان لا يقطع فيض أحدهما الآخر ⇐ \\(M=0\\) (الملحوظة 1).</li><li>\\(K=1\\): اقتران تام (الملفان ملتصقان أو على قلب حديدي مشترك) ⇐ \\(M=\\sqrt{L_1L_2}\\) — وهذه هي الحالة التي تقصدها جملة الكتاب «يساوي الجذر التربيعي … عند تلاصق الملفين».</li><li>بينهما: \\(M=K\\sqrt{L_1L_2}\\). الملفات ذات القلب الهوائي المتجاورة \\(K\\) فيها صغير، وملفات المحول على قلب حديدي \\(K\\) قريب من 1.</li></ul>
   والمعادلة (5-35) طريقة عملية لقياس M: نقيس الحث المكافئ مرة بتوصيل متساعد (\\(L'\\)) ومرة بعكس طرفي أحد الملفين (\\(L''\\)).`},
  {h:'توصيل الملفات على التوازي',ref:'ص 149–150',html:`<p>إذا كان الملفان متصلين على التوازي يتفرع التيار بينهما ويكون التيار الكلي:</p>
   $$I=I_1+I_2+\\dots \\qquad (5\\text{-}37)$$
   <p>ومعدل تغير التيار الكلي يساوي مجموع معدلي التغير بتفاضل (5-37) بالنسبة للزمن:</p>
   $$\\frac{dI}{dt}=\\frac{dI_1}{dt}+\\frac{dI_2}{dt} \\qquad (5\\text{-}38)$$ $$\\frac{dI}{dt}=-\\frac{E}{L}\\ (5\\text{-}39)\\qquad \\frac{dI_1}{dt}=-\\frac{E_1}{L_1}\\ (5\\text{-}40)\\qquad \\frac{dI_2}{dt}=-\\frac{E_2}{L_2}\\ (5\\text{-}41)$$
   <p>وبالتعويض في المعادلة (5-38)، وإذا كان هناك عدد من الملفات يزيد على اثنين نجد أن:</p>
   $$\\frac1L=\\frac1{L_1}+\\frac1{L_2}+\\frac1{L_3}+\\dots+\\frac1{L_n} \\qquad (5\\text{-}42)$$
   <p>ويتم هذا على شرط أن نتخذ احتياطات تمنع تأثير المجالات المغناطيسية لهذه الملفات على بعضها حتى لا يحدث ارتباط مغناطيسي بينها نتيجة للتأثير المتبادل (أي \\(M=0\\)).</p>`},
  {note:'<b>توضيح للمتدرب (ليس من الكتاب):</b> للوصول إلى (5-42) نستعمل أن الملفات المتوازية عليها نفس الجهد: \\(E=E_1=E_2\\)، فنقسم طرفي (5-38) على \\(-E\\). والنتيجة مثل المقاومات على التوازي: الحث المكافئ أصغر من أصغر ملف.'},
  {h:'أمثلة محلولة',ref:'ص 150–151',html:`<p>في تبويب «الأمثلة المحلولة»: مثال (٥-٩) حث ملف ذي قلب حديدي ثم بعد نزع القلب، ومثال (٥-١٠) النفاذية النسبية لحلقة حديدية والحث الذاتي لملفها. ونلاحظ من مثال (٥-٩) أن الحثية في الملفات الطويلة تتناسب مع نفاذية ومساحة مقطع القلب ومع مربع عدد اللفات، وتتناسب عكسياً مع طول الملف.</p>`},
  {err:`<div class="fixnote"><ol style="margin:4px 0 0;padding-inline-start:20px"><li>ترقيم المعادلات يقفز من (5-15) إلى (5-17) ومن (5-19) إلى (5-21): لا توجد معادلتان (5-16) و(5-20) في الكتاب. أبقينا الأرقام كما طُبعت.</li>
   <li>ص 148: المعادلة \\(L=L_1+L_2\\) مرقمة «(9-34)»، وص 150 «بالتعويض في المعادلة (9-38)» — والصحيح (5-34) و(5-38).</li>
   <li>ص 145: «أما الفيض الكهربائي فيعطى…» والصحيح «الفيض المغناطيسي». ورُمز لطول الملف بـ L في النص ثم ℓ في المعادلات؛ استعملنا ℓ حتى لا يختلط بالحث L.</li>
   <li>(5-36): الرمز K غير معرّف، والانتقال من (5-35) إلى (5-36) بلا اشتقاق، وعبارة «يساوي الجذر التربيعي» تصح فقط عند K = 1 — انظر الإضافة أعلاه.</li>
   <li>مثال (٥-٩): يذكر الحل «باستعمال المعادلة (5-2)» وهي للملف الحلقي؛ المستعمل فعلاً B = μNI/ℓ المعطاة في نص المثال. ويذكر «بالتعويض في المعادلة (5 – 9) سنتنتج» والمقصود L = NΦ/I أي (5-14) و«نستنتج».</li>
   <li>مثال (٥-١٠) ص 151: عُوِّضت المساحة <span class="ltr">1 cm²</span> على أنها <span class="ltr">0.01 m²</span>، والصحيح <span class="ltr">1 × 10⁻⁴ m²</span>، فيكون الحث <span class="ltr">0.32 H</span> لا <span class="ltr">32 H</span>. وناتج μᵣ المطبوع 63.69 والدقيق 63.66. في الحاسبة مفتاح «كما في الكتاب / المصحح».</li></ol></div>`}
 ],
 lab:(el)=>{
  let N=100,d=5,len=10,mur=1000,did={};
  let L1=40,L2=10,K=0.5,cn='aid',dIdt=10,rec={};
  el.innerHTML=`<div class="grid mg-lab">
   <div class="panel c12"><h2>الحث الذاتي من أبعاد الملف <small>المعادلة (5-19) ومثالا (٥-٩) و(٥-١١) ص 145، 150، 154</small></h2>
    <div class="grid"><div class="c7"><div class="svgbox" id="f4a"></div></div>
     <div class="c5">${sl('f4N','عدد اللفات N',10,2000,10,N)}${sl('f4d','قطر الملف d',1,60,0.5,d)}${sl('f4l','طول الملف ℓ',1,100,1,len)}
      <div class="sub" style="margin-top:8px">القلب</div>${segHTML('mu',L4CORE,mur)}
      <div class="mg-row"><button class="btn" data-p5="9">مثال (٥-٩)</button><button class="btn" data-p5="11">مثال (٥-١١)</button><button class="btn" data-p5="t5">تمرين 5</button></div>
      <div class="facts">${fact('مساحة المقطع A = πd²/4','f4A')}${fact('L = μ₀μᵣN²A/ℓ','f4L')}</div><p class="sub" id="f4warn"></p></div></div></div>
   <div class="panel c12"><h2>ملفان: توالٍ متساعد ومتعاكس وتوازٍ <small>الشكل (٥-٢٠) والمعادلات (5-28) إلى (5-36) و(5-42) ص 147–150</small></h2>
    <div class="mg-row">${segHTML('cn',[['aid','توالٍ: المجالان في اتجاه واحد (أ)'],['opp','توالٍ: المجالان متعاكسان (ب)'],['par','توازٍ']],cn)}</div>
    <div class="grid" style="margin-top:4px"><div class="c7"><div class="svgbox" id="f4b"></div></div>
     <div class="c5">${sl('f4L1','الحث الذاتي L₁',1,100,1,L1)}${sl('f4L2','الحث الذاتي L₂',1,100,1,L2)}${sl('f4K','معامل الاقتران K (إضافة من خارج الكتاب)',0,1,0.01,K)}${sl('f4r','معدل تغير التيار dI/dt',-50,50,1,dIdt)}
      <div class="facts" id="f4f"></div><div class="mg-row"><button class="btn" id="f4rec">سجّل قراءة L المكافئ</button><span class="sub" id="f4rv"></span></div><div id="f4add"></div></div></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="f4st"></ol></div></div>`;
  const $=s=>el.querySelector(s);
  const drawA=()=>{const A=PI*Math.pow(d/1000,2)/4,L=MU0*mur*N*N*A/(len/100);
   const W=640,H=230,lp=clamp(120+len*4,120,520),dp=clamp(16+d*2.4,16,150),x0=(W-lp)/2,yc=110,nT=Math.min(N,70);let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="ملف بالأبعاد المختارة">`;
   if(mur>1)s+=`<rect x="${x0-14}" y="${yc-dp/2+3}" width="${lp+28}" height="${dp-6}" rx="3" fill="var(--surface-2)" stroke="var(--muted)"/>`;
   for(let k=0;k<nT;k++){const x=x0+(k+0.5)*lp/nT;s+=`<path d="M${fx(x)} ${fx(yc-dp/2)}L${fx(x+lp/nT*0.6)} ${fx(yc+dp/2)}" stroke="var(--live)" stroke-width="${clamp(lp/nT*0.6,0.8,3)}"/>`}
   s+=`<path d="M${x0} ${yc+dp/2+22}H${x0+lp}" stroke="var(--fg)"/>`+head(x0,yc+dp/2+22,PI,'--fg',5)+head(x0+lp,yc+dp/2+22,0,'--fg',5)+S.t(W/2,yc+dp/2+38,'ℓ = '+len+' cm','','middle');
   s+=`<path d="M${x0-26} ${yc-dp/2}V${yc+dp/2}" stroke="var(--fg)"/>`+S.t(x0-32,yc+4,'d = '+fm(d)+' mm','','end');
   s+=arT(W/2,22,N>nT?`مرسوم ${nT} لفة فقط من ${N}`:`${N} لفة`,{fs:12,col:'--muted'});
   $('#f4a').innerHTML=s+'</svg>';$('#f4N-v').textContent=N;$('#f4d-v').textContent=fm(d)+' mm';$('#f4l-v').textContent=len+' cm';
   $('#f4A').textContent=sci(A,3)+' m²';$('#f4L').textContent=eng(L,'H',4);chOut(el,'f4ch',[['L',L*1e3]]);$('#f4warn').textContent=len*10<d*3?'تنبيه: المعادلة (5-19) تصح للملف الطويل (طوله أكبر بكثير من قطره).':''};
  const M=()=>K*Math.sqrt(L1*L2);
  const Leq=()=>cn==='aid'?L1+L2+2*M():cn==='opp'?L1+L2-2*M():(K===0?1/(1/L1+1/L2):(L1*L2-M()*M())/(L1+L2-2*M()));
  const drawB=()=>{const W=560,gap=20+(1-K)*140;let s='';
   if(cn!=='par'){s=seriesCoils(cn==='aid',{W:W,gap});}
   else{s=`<svg viewBox="0 0 ${W} 200" role="img" aria-label="ملفان على التوازي">`+coilSide(60,40,160,50,8,'--live',false)+coilSide(60+160+gap,40,160,50,8,'--live',false)+`<path class="w" d="M60 65V28H${220+gap}V65M220 65V100H230V172M${380+gap} 65V100H${390+gap}V172M20 28H60M20 172H${390+gap}"/>`+`<circle cx="20" cy="28" r="4" fill="var(--fg)"/><circle cx="20" cy="172" r="4" fill="var(--fg)"/>`+S.t(140,120,'L1','','middle',14)+S.t(300+gap,120,'L2','','middle',14)+'</svg>'}
   const nl=Math.round(K*6);let fl='';for(let k=0;k<nl;k++){const ry=14+k*7;fl+=`<ellipse cx="${fx(140+(80+gap/2)*0.5)}" cy="${cn==='par'?65:110}" rx="${fx(100+gap/2+ry*1.2)}" ry="${ry}" fill="none" stroke="var(--blue)" stroke-width="1.2" opacity=".55"/>`}
   s=s.replace('</svg>',fl+arT(W/2,14,K===0?'K = 0: لا فيض مشترك':`K = ${fm(K,2)}: جزء من فيض كل ملف يقطع الآخر`,{fs:12,col:'--muted'})+'</svg>');
   $('#f4b').innerHTML=s;
   $('#f4L1-v').textContent=L1+' mH';$('#f4L2-v').textContent=L2+' mH';$('#f4K-v').textContent=fm(K,2);$('#f4r-v').textContent=dIdt+' A/s';
   const m=M(),Le=Leq();let h=fact('M = K√(L₁L₂) (5-36)','g1')+fact(cn==='par'?'L المكافئ':cn==='aid'?"L' = L₁+L₂+2M (5-32)":"L'' = L₁+L₂−2M (5-33)",'g2');
   if(cn!=='par')h+=fact(cn==='aid'?'E₁ = (L₁+M)dI/dt (5-28)':'E₁ = (L₁−M)dI/dt','g3')+fact(cn==='aid'?'E₂ = (L₂+M)dI/dt (5-29)':'E₂ = (L₂−M)dI/dt','g4')+fact('E = L·dI/dt (5-31)','g5');
   $('#f4f').innerHTML=h;$('#g1').textContent=fm(sig(m,4))+' mH';$('#g2').textContent=fm(sig(Le,4))+' mH';
   if(cn!=='par'){const sgm=cn==='aid'?1:-1;$('#g3').textContent=fm(sig((L1+sgm*m)*dIdt/1000,4))+' V';$('#g4').textContent=fm(sig((L2+sgm*m)*dIdt/1000,4))+' V';$('#g5').textContent=fm(sig(Le*dIdt/1000,4))+' V'}
   $('#f4add').innerHTML=cn==='par'?(K===0?`<p class="sub">الكتاب (5-42): \\(1/L=1/L_1+1/L_2\\) ⇐ الحث المكافئ أصغر من أصغر ملف.</p>`:`<div class="callout"><b>إضافة من خارج الكتاب:</b> المعادلة (5-42) تشترط \\(M=0\\). مع وجود اقتران (والمجالان في اتجاه واحد) يصبح \\(L=\\dfrac{L_1L_2-M^2}{L_1+L_2-2M}\\)، وهي القيمة المعروضة. اجعل K = 0 لتعود إلى معادلة الكتاب.</div>`):'';B.math($('#f4add'));
   const rv=[];if(rec.aid!=null)rv.push(`L' = ${fm(sig(rec.aid,4))} mH`);if(rec.opp!=null)rv.push(`L'' = ${fm(sig(rec.opp,4))} mH`);if(rec.aid!=null&&rec.opp!=null)rv.push(`⇐ M = (L'−L'')/4 = ${fm(sig((rec.aid-rec.opp)/4,4))} mH (5-35)`);$('#f4rv').textContent=rv.join('   ')};
  $('#f4N').oninput=e=>{N=+e.target.value;drawA()};$('#f4d').oninput=e=>{d=+e.target.value;drawA()};$('#f4l').oninput=e=>{len=+e.target.value;drawA()};segBind(el,'mu',v=>{mur=+v;did['mu'+v]=1;drawA()});
  el.querySelectorAll('[data-p5]').forEach(b=>b.onclick=()=>{const P={'9':[100,5,10,1000],'11':[1000,27.64,100,1],'t5':[200,3,8,5000]}[b.dataset.p5];[N,d,len,mur]=P;$('#f4N').value=N;$('#f4d').value=d;$('#f4l').value=len;segSet(el,'mu',mur);did['p'+b.dataset.p5]=1;drawA()});
  $('#f4L1').oninput=e=>{L1=+e.target.value;rec={};drawB()};$('#f4L2').oninput=e=>{L2=+e.target.value;rec={};drawB()};$('#f4K').oninput=e=>{K=+e.target.value;rec={};drawB()};$('#f4r').oninput=e=>{dIdt=+e.target.value;drawB()};
  segBind(el,'cn',v=>{cn=v;did[v]=1;drawB()});$('#f4rec').onclick=()=>{if(cn!=='par')rec[cn]=Leq();drawB()};
  const steps=stepsUI($('#f4st'),[
   {t:'مثال (٥-٩)',x:'اضغط «مثال (٥-٩)»: 100 لفة، ℓ = 10 cm، d = 5 mm، قلب μᵣ = 1000 ⇐ <span class="ltr">L ≈ 2.47 mH</span> (الكتاب قرّبها إلى 2.5 mH).',done:()=>did.p9&&N===100&&mur===1000},
   {t:'انزع القلب',x:'اختر «هواء μᵣ=1»: يقل الحث 1000 مرة إلى نحو <span class="ltr">2.47 μH</span>.',done:()=>did.p9&&mur===1&&N===100},
   {t:'ضاعف اللفات',x:'ضاعف N (مثلاً من 100 إلى 200): يصبح L أربعة أضعاف لأن N مربعة في (5-19).',done:()=>N===200&&len===10&&d===5},
   {t:'توالٍ متساعد ومتعاكس',x:'في لوحة الملفين سجّل القراءة في «توالٍ (أ)» ثم اختر «توالٍ (ب)» وسجّل مرة أخرى: يظهر M من (5-35) ويساوي K√(L₁L₂).',done:()=>rec.aid!=null&&rec.opp!=null},
   {t:'ملفان متباعدان',x:'اجعل K = 0: يصبح L المكافئ في الحالتين <span class="ltr">L₁ + L₂</span> (5-34).',done:()=>K===0&&cn!=='par'},
   {t:'على التوازي',x:'اختر «توازٍ» مع K = 0: <span class="ltr">L = L₁L₂/(L₁+L₂)</span> أصغر من أصغر الملفين (5-42).',done:()=>cn==='par'&&K===0}
  ]);
  drawA();drawB();loopOn(el,()=>steps.check());
 },
 examples:[
  {title:'مثال (٥-٩)',ref:'ص 150',q:'<p>تعطى كثافة الفيض المغناطيسي في محور ملف مكون من N لفة، ذي قلب (حديدي أو غير حديدي) نفاذيته μ وطوله ℓ، بالمعادلة <span class="ltr">B = μNI/ℓ</span>، حيث I التيار المار في هذا الملف. وهذه المعادلة لا تصلح إلا إذا كان طول القلب أكبر بكثير من قطره d. احسب الحثية الذاتية للملف عندما تكون <span class="ltr">N = 100</span> لفة، <span class="ltr">ℓ = 10 cm</span>، <span class="ltr">μᵣ = 1000</span> (قلب حديدي) و <span class="ltr">d = 5 mm</span>. كم تصبح هذه الحثية لو نزعنا القلب الحديدي؟</p>',
   given:[{id:'N',label:'عدد اللفات',sym:'N',unit:'',value:100},{id:'l',label:'الطول',sym:'\\ell',unit:'cm',value:10},{id:'mr',label:'النفاذية النسبية',sym:'\\mu_r',unit:'',value:1000},{id:'d',label:'القطر',sym:'d',unit:'mm',value:5}],
   solve:(g,B,isBook)=>{const L=MU0*g.mr*g.N*g.N*PI*Math.pow(g.d/1000,2)/(4*g.l/100);const Lb=isBook?2.5e-3:sig(L,3),L0=Lb/g.mr;
    return [{t:'الفيض المغناطيسي:',f:`\\Phi=BA=\\left(\\frac{\\mu N I}{\\ell}\\right)A\\qquad A=\\frac{\\pi d^2}{4}`},
     {t:'وبالتعويض في \\(L=N\\Phi/I\\) (المعادلة 5-14) نستنتج الحثية:',f:`L=\\frac{\\mu N^2A}{\\ell}=\\frac{\\mu_0\\mu_rN^2\\pi d^2}{4\\ell}=\\frac{4\\pi\\times10^{-7}\\times${g.mr}\\times(${g.N})^2\\,\\pi(${g.d}\\times10^{-3})^2}{4\\times${g.l}\\times10^{-2}}`,v:fm(B.round(Lb*1e3,isBook?1:3)),unit:'mH',final:true},
     {t:'لو نزعنا القلب الحديدي فإن الحثية تنخفض بنسبة μᵣ:',f:`L=\\frac{${isBook?'2.5':fm(sig(Lb*1e3,3))}\\times10^{-3}}{${g.mr}}`,v:fm(sig(L0*1e6,isBook?2:3)),unit:'μH',final:true}]},
   note:'قرّب الكتاب الناتج إلى <span class="ltr">2.5 mH</span>؛ القيمة الدقيقة <span class="ltr">2.467 mH</span> (وبدون القلب <span class="ltr">2.467 μH</span>). غيّر أي رقم لترى الحساب بثلاثة أرقام معنوية.'},
  {title:'مثال (٥-١٠)',ref:'ص 151',q:`<p>حلقة دائرية من الحديد مساحة مقطعها <span class="ltr">1 cm²</span> ومتوسط طولها <span class="ltr">40 cm</span> وملفوف عليها ملف به 4000 لفة. إذا مر تيار مقداره <span class="ltr">0.5 A</span> في الملف فإن كثافة الفيض في الحلقة تكون <span class="ltr">0.4 Wb/m²</span>. أوجد النفاذية النسبية لمادة الحلقة والحث الذاتي للملف.</p>${bfSeg('e510')}`,
   given:[{id:'A',label:'مساحة المقطع',sym:'A',unit:'cm²',value:1},{id:'l',label:'متوسط الطول',sym:'\\ell',unit:'cm',value:40},{id:'N',label:'عدد اللفات',sym:'N',unit:'',value:4000},{id:'I',label:'التيار',sym:'I',unit:'A',value:0.5},{id:'Bv',label:'كثافة الفيض',sym:'B',unit:'T',value:0.4}],
   solve:(g,B,isBook)=>{const bk=bfMode('e510')==='book';const H=g.N*g.I/(g.l/100),mu=g.Bv/H,mr=mu/MU0;const Am=bk?g.A*1e-2:g.A*1e-4;const L=g.N*g.Bv*Am/g.I;
    return [{t:'شدة المجال:',f:`H=\\frac{N I}{\\ell}=\\frac{${g.N}\\times${g.I}}{${g.l/100}}`,v:sig(H,4),unit:'AT/m'},
     {t:'',f:`\\mu=\\frac{B}{H}=\\frac{${g.Bv}}{${fm(sig(H,4))}}`,v:sci(mu,3),unit:'H/m'},
     {t:'\\(\\mu=\\mu_0\\mu_r\\):'+(bk&&isBook?' <span class="sub">(كما طُبع: 63.69 — الدقيق 63.66)</span>':''),f:`\\mu_r=\\frac{${sx(mu,3)}}{4\\pi\\times10^{-7}}`,v:bk&&isBook?63.69:B.round(mr,2),dp:2,final:true},
     {t:bk?'<b>كما في الكتاب:</b> عُوِّضت المساحة 1 cm² على أنها 0.01 m² (التحويل خاطئ):':'<b>المصحح:</b> \\(1\\ \\text{cm}^2=1\\times10^{-4}\\ \\text{m}^2\\):',f:`L=\\frac{N\\Phi}{I}=\\frac{NBA}{I}=\\frac{${g.N}\\times${g.Bv}\\times${bk?fm(Am):sx(Am,3)}}{${g.I}}`,v:sig(L,4),unit:'H',final:true}]},
   note:'<span class="fixnote"><b>ملاحظة على الكتاب:</b> طبع الكتاب <span class="ltr">L = 32 H</span> لأنه حوّل <span class="ltr">1 cm²</span> إلى <span class="ltr">0.01 m²</span>؛ والصحيح <span class="ltr">10⁻⁴ m²</span> فيكون <span class="ltr">L = 0.32 H</span>. اختر «المصحح».</span>'}
 ],
 quiz:[
  {q:'عند غلق مفتاح دائرة فيها ملف، فإن التيار:',o:['يصل إلى قيمته العظمى فوراً','يزداد تدريجياً بسبب القوة الدافعة الذاتية المعاكسة','يبقى صفراً','يتذبذب دائماً'],c:1,e:'ص 143–144.'},
  {q:'وحدة الحث الذاتي:',o:['الويبر','الهنري','التسلا','الفاراد'],c:1,e:'ص 144.'},
  {q:'ملف ينتج فيه تغير التيار بمعدل 20 A/s قوة دافعة 4 V. حثه الذاتي:',o:['80 H','0.2 H','5 H','24 H'],c:1,e:'(5-15): L = E/(dI/dt) = 4/20 = 0.2 H.'},
  {q:'إذا ضاعفنا عدد لفات ملف طويل مع بقاء أبعاده فإن حثه الذاتي:',o:['يتضاعف','يصبح أربعة أضعاف','يقل للنصف','لا يتغير'],c:1,e:'(5-19): L ∝ N².'},
  {q:'ملفان L₁ = 4 mH و L₂ = 9 mH والحث المتبادل M = 3 mH على التوالي ومجالاهما في اتجاه واحد. الحث المكافئ:',o:['13 mH','19 mH','7 mH','16 mH'],c:1,e:'(5-32): 4 + 9 + 2×3 = 19 mH.'},
  {q:'إذا قسنا L′ = 20 mH (متساعد) و L″ = 12 mH (متعاكس) فإن M تساوي:',o:['8 mH','4 mH','2 mH','32 mH'],c:2,e:'(5-35): M = (20 − 12)/4 = 2 mH.'},
  {q:'ملفان 6 mH و 3 mH على التوازي بلا تأثير متبادل. الحث المكافئ:',o:['9 mH','2 mH','4.5 mH','18 mH'],c:1,e:'(5-42): 1/L = 1/6 + 1/3 ⇐ L = 2 mH.'},
  {q:'معامل الاقتران K = 1 يعني (إضافة من خارج الكتاب):',o:['لا يوجد فيض مشترك','كل فيض أحد الملفين يقطع الآخر فيكون M = √(L₁L₂)','الملفان على التوازي','الحث صفر'],c:1,e:'K بين 0 و 1؛ عند الاقتران التام M = √(L₁L₂).'}
 ]
});

/* ======================================================================
   Lesson u5-l5 — قانون فارادي وقانون لنز + تمارين الوحدة الخامسة (ص 151–156)
   ====================================================================== */
/* galvanometer: centre-zero dial, needle angle a (deg, + = right) */
function galvSVG(x,y,a,lbl){let s=`<rect x="${x-46}" y="${y-40}" width="92" height="74" rx="8" fill="var(--live-soft)" stroke="var(--live)" stroke-width="1.6"/>`;
  s+=`<path d="M${x-34} ${y+6}A36 36 0 0 1 ${x+34} ${y+6}" fill="none" stroke="var(--fg)" stroke-width="1.2"/>`;
  for(let k=-4;k<=4;k++){const t=(k*12-90)*D;s+=`<path d="M${fx(x+34*Math.cos(t))} ${fx(y+18+34*Math.sin(t))}L${fx(x+(k?29:26)*Math.cos(t))} ${fx(y+18+(k?29:26)*Math.sin(t))}" stroke="var(--fg)" stroke-width="1"/>`}
  const t=(clamp(a,-55,55)-90)*D;s+=`<path d="M${x} ${y+18}L${fx(x+32*Math.cos(t))} ${fx(y+18+32*Math.sin(t))}" stroke="var(--stop)" stroke-width="2.4" stroke-linecap="round"/><circle cx="${x}" cy="${y+18}" r="3.5" fill="var(--fg)"/>`;
  return s+S.t(x,y+30,lbl||'G','m','middle')}
function fig521(){const one=(ox,dir,ang,lab)=>{let s=galvSVG(ox+60,110,ang)+`<path class="w" d="M${ox+106} 100H${ox+150}M${ox+106} 124H${ox+150}"/><ellipse cx="${ox+160}" cy="112" rx="12" ry="54" fill="none" stroke="var(--live)" stroke-width="3"/>`;
   for(let k=-2;k<=2;k++)s+=`<path d="M${ox+170} ${112+k*14}C${ox+200} ${112+k*20} ${ox+220} ${112+k*20} ${ox+232} ${112+k*8}" fill="none" stroke="var(--blue)" stroke-width="1.2" opacity=".7"/>`;
   s+=barSVG(ox+232,98,110,28,false)+arrow(ox+290,80,ox+290+dir*40,80,'--stop',3)+arT(ox+170,210,lab,{fs:12.5});return s};
  return `<svg viewBox="0 0 760 220" role="img" aria-label="تقريب المغناطيس وإبعاده عن حلقة موصلة بجلفانومتر">${one(380,-1,30,'(أ) تقريب المغناطيس: ينحرف المؤشر')}${one(0,1,-30,'(ب) إبعاده: ينحرف في الاتجاه الآخر')}</svg>`}
function ringSVG(o){o=o||{};const on=!!o.on,W=o.W||640;let s=`<svg viewBox="0 0 ${W} 240" role="img" aria-label="حلقة حديدية عليها ملفان، بطارية ومفتاح وجلفانومتر">`;
  const cx=W/2,cy=120;s+=`<circle cx="${cx}" cy="${cy}" r="80" fill="none" stroke="var(--blue-soft)" stroke-width="26"/><circle cx="${cx}" cy="${cy}" r="80" fill="none" stroke="var(--blue)" stroke-width="1" opacity=".5"/>`+S.t(cx,cy+4,'Iron','m','middle');
  for(let k=0;k<7;k++){const yy=cy-42+k*14;s+=`<ellipse cx="${cx-80}" cy="${yy}" rx="18" ry="5" fill="none" stroke="var(${on?'--live':'--fg'})" stroke-width="2"/><ellipse cx="${cx+80}" cy="${yy}" rx="18" ry="5" fill="none" stroke="var(--fg)" stroke-width="2"/>`}
  s+=`<path class="w ${on?'flow':''}" d="M${cx-98} ${cy-42}H${cx-200}V${cy-10}M${cx-98} ${cy+42}H${cx-200}V${cy+20}"/>`;
  s+=`<rect x="${cx-224}" y="${cy-10}" width="48" height="30" rx="4" fill="var(--lamp-off)" stroke="var(--fg)"/>`+S.t(cx-200,cy+10,'+  −','','middle');
  s+=`<rect x="${cx-180}" y="${cy-56}" width="40" height="22" fill="var(--surface)"/>`+(on?`<path d="M${cx-180} ${cy-42}H${cx-140}" stroke="var(--fg)" stroke-width="3"/>`:`<path d="M${cx-180} ${cy-42}L${cx-146} ${cy-62}" stroke="var(--stop)" stroke-width="3"/>`)+`<circle cx="${cx-180}" cy="${cy-42}" r="3" fill="var(--fg)"/><circle cx="${cx-140}" cy="${cy-42}" r="3" fill="var(--fg)"/>`;
  s+=S.t(cx-200,cy+44,'Battery','m','middle')+S.t(cx-160,cy-66,'Switch','m','middle');
  s+=`<path class="w" d="M${cx+98} ${cy-42}H${cx+190}V${cy-30}M${cx+98} ${cy+42}H${cx+190}V${cy+20}"/>`+galvSVG(cx+190,cy-6,o.g||0,'Galvanometer');
  return s+'</svg>'}

B.lesson({
 id:'u5-l5',unit:5,order:5,pages:'151–156',
 title:'قانون فارادي وقانون لنز وتمارين الوحدة',
 summary:'الحصول على تيار من المجال المغناطيسي: تقريب مغناطيس من حلقة أو غلق وفتح دائرة ملف مجاور يولد قوة دافعة حثية تتناسب مع معدل تغير الفيض E = −N dΦ/dt، والإشارة السالبة هي قانون لنز. مع المثالين (٥-١١) و(٥-١٢) وتمارين الوحدة الخامسة.',
 stations:[
  {intro:true},

  {st:1,short:'فارادي ولينز',title:'قانون فارادي وقانون لينز: تيار من المغناطيس',ref:'ص 151–152',
   q:'التيار يصنع مجالاً مغناطيسياً… فهل يستطيع المجال المغناطيسي أن يصنع تياراً؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="جلفانومتر موصل بحلقة سلكية، ومغناطيس قطبه الشمالي يقترب من الحلقة فينحرف المؤشر" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><g data-tip="الجلفانومتر ⟦(Galvanometer)⟧: جهاز حساس يكشف مرور تيار صغير، ويبين اتجاهه بانحراف مؤشره يميناً أو يساراً."><rect x="34" y="96" width="100" height="78" rx="10" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5"/><path d="M52 150 A32 32 0 0 1 116 150" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><line x1="84" y1="150" x2="84" y2="124" stroke="#9AA5A0" stroke-width="1.5" stroke-dasharray="3 3"/><line x1="84" y1="150" x2="104" y2="130" stroke="#2C4A40" stroke-width="3" stroke-linecap="round"/><circle cx="84" cy="150" r="4" fill="#2C4A40"/></g><path d="M100 174 V216 H190 V190 M70 174 V232 H200 V188" fill="none" stroke="#2C4A40" stroke-width="3"/><g data-tip="حلقة سلكية (ملف من لفة واحدة) موصلة بالجلفانومتر، ولا توجد فيها أي بطارية."><ellipse cx="196" cy="140" rx="16" ry="50" fill="none" stroke="#B9852A" stroke-width="6"/></g><g data-tip="خطوط مجال المغناطيس: تخرج من قطبه الشمالي ⟦N⟧ ويمر بعضها خلال الحلقة. كلما اقترب المغناطيس زاد عدد الخطوط التي تعبر الحلقة." fill="none" stroke="#3A7CA5" stroke-width="2.2"><path d="M246 140 H160"/><path d="M246 132 C 220 112, 200 106, 160 104"/><path d="M246 148 C 220 168, 200 174, 160 176"/></g><g data-tip="مغناطيس قضيبي: قطبه الشمالي ⟦N⟧ (الأحمر) يواجه الحلقة."><rect x="246" y="124" width="44" height="32" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5"/><rect x="290" y="124" width="44" height="32" fill="#C9D3CE" stroke="#2C4A40" stroke-width="2.5"/><text x="268" y="146" text-anchor="middle" font-size="16" font-weight="700" fill="#FBF6EE" font-family="var(--mono)">N</text><text x="312" y="146" text-anchor="middle" font-size="16" font-weight="700" fill="#2C4A40" font-family="var(--mono)">S</text></g><g data-tip="اتجاه حركة المغناطيس: نقرّبه من الحلقة. أثناء الحركة فقط ينحرف المؤشر."><line x1="320" y1="104" x2="262" y2="104" stroke="#2C4A40" stroke-width="5" stroke-linecap="round"/><polygon points="248,104 266,94 266,114" fill="#2C4A40"/></g><text x="180" y="286" text-anchor="middle" font-size="14" font-weight="600" fill="#2C4A40" direction="rtl" unicode-bidi="embed">الحركة تولّد التيار</text></svg>`,
   cap:'تجربة الشكل (٥-٢١أ): تقريب مغناطيس من حلقة موصلة بجلفانومتر.<br><b>مرّر المؤشر على الجلفانومتر والحلقة والمغناطيس والخطوط والسهم (أو المسه في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>درسنا فيما سبق كيفية الحصول على مجال مغناطيسي من تيار يمر في أشكال مختلفة من السلك، وتجدر الإشارة هنا إلى التساؤل <b>هل يمكن الحصول على تيار كهربائي من المجال المغناطيسي</b>. وهذا ما أجاب عنه كل من العالمين مايكل فارادي البريطاني وجوزيف هنري الأمريكي حيث اكتشف قانون فارادي عام <span class="ltr">1831</span> بعد أن قام كل منهما بعدة تجارب أدت إلى نتائج متشابهة وهي ما تعرف <b>بقانون فارادي للحث Faraday's law of induction</b>. والتي من خلالها يمكن الحصول على تيار كهربائي من المجال المغناطيسي.</p>`,ref:'ص 151'}
   ],
   body:[
    {book:String.raw`<p>لوحظ أنه عند اقتراب مغناطيس من الدائرة المبينة كما في الشكل(٥-٢١أ) يتحرك مؤشر الجلفانومتر وعند ثبوت المغناطيس يعود مؤشر الجلفانومتر إلى الصفر أما عند سحب المغناطيس في الاتجاه المعاكس الشكل (٥-٢١ب) ينحرف مؤشر الجلفانومتر في الاتجاه الآخر مما يشير إلى مرور تيار كهربائي في الدائرة عند حركة المغناطيس ، وهذا التيار يعرف <b>بالتيار الحثي Induced Current</b> وهو ناشئ من <b>قوة دافعة كهربائية متولدة Induced Electromotive Force</b>.</p>`,ref:'ص 152'},
    {predict:{q:'قرّبنا المغناطيس من الحلقة ثم أوقفناه ثابتاً قربها. ماذا يقرأ الجلفانومتر وهو ثابت؟',opts:[
     ['صفراً: يعود المؤشر إلى الصفر',true,'الكتاب: عند ثبوت المغناطيس يعود مؤشر الجلفانومتر إلى الصفر؛ التيار يظهر أثناء الحركة فقط.'],
     ['أكبر قراءة، لأن المغناطيس صار أقرب ما يمكن',false,'القرب وحده لا يكفي؛ المهم أن يتغير الفيض، والفيض ثابت ما دام المغناطيس ثابتاً.'],
     ['ينحرف في الاتجاه الآخر',false,'الانحراف في الاتجاه الآخر يحدث عند سحب المغناطيس بعيداً (الشكل ٥-٢١ب).']]}},
    {book:String.raw`<p>في تجربة أخرى مبينة في الشكل(٥-٢٢) نلاحظ عند لحظة إغلاق مفتاح الدائرة الكهربائية ولحظة فتح الدائرة الكهربائية مرور تيار في الدائرة الثانوية، وهذا يعود إلى أنه في حالة فتح الدائرة الكهربائية أو إغلاقها فإن التيار يتغير بين القيمة صفر وأقصى قيمة مما يؤدي إلى تغيير في المجال المغناطيسي المتولد في الملف على الجانب الأيسر للدائرة ، وهذا يؤدي إلى تيار كهربائي يمر في الدائرة الثانوية.</p>`,ref:'ص 152'},
    {tip:String.raw`<p>في التجربتين لا شيء مشترك إلا <b>تغيّر الفيض</b> الذي يمر خلال الدائرة: في الأولى بحركة المغناطيس، وفي الثانية (الشكل ٥-٢٢: ملفان على حلقة حديدية، الأيسر ببطارية ومفتاح والأيمن بجلفانومتر) بتغيّر تيار الملف الأيسر لحظة الغلق والفتح. وبعد الغلق، والتيار ثابت، لا يمر شيء في الدائرة الثانوية. هذه هي فكرة الحث المتبادل من الدرس السابق. جرّب التجربتين في تبويب المختبر.</p>`,title:'ما المشترك بين التجربتين؟'},
    {add:String.raw`<p>كل محطة توليد كهرباء تطبّق هذه التجربة: مغناطيسات تدور قرب ملفات ضخمة فيتغير الفيض باستمرار ويتولد جهد متردد. والدينامو الصغير في الدراجة يعمل بالفكرة نفسها.</p>`,title:'من حولك'}
   ]},

  {st:2,short:'سبب التيار الحثي',title:'ما السبب في التيار الحثي؟',ref:'ص 153',
   q:'المغناطيس المتحرك وغلق المفتاح تجربتان مختلفتان… فما القانون الواحد الذي يجمعهما؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ثلاث طرق لتغيير الفيض: تغيير المجال، وتغيير المساحة، وتغيير الزاوية" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="الطريقة الأولى: تغيير المجال المغناطيسي ⟦B⟧ الذي يمر في الحلقة، مثلاً بتقريب مغناطيس أو إبعاده أو بتغيير تيار ملف مجاور."><rect x="54" y="40" width="252" height="74" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><ellipse cx="110" cy="77" rx="10" ry="26" fill="none" stroke="#B9852A" stroke-width="5"/><rect x="146" y="64" width="26" height="26" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><rect x="172" y="64" width="26" height="26" fill="#C9D3CE" stroke="#2C4A40" stroke-width="2"/><polygon points="132,77 146,70 146,84" fill="#2C4A40"/><text x="256" y="84" text-anchor="middle" font-size="18" font-weight="700" fill="#2C4A40" font-family="var(--mono)">B</text></g><g data-tip="الطريقة الثانية: تغيير مساحة الدائرة الكهربائية ⟦A⟧ التي يعبرها المجال، مثلاً بسحب الحلقة لتصغر."><rect x="54" y="124" width="252" height="74" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><ellipse cx="128" cy="161" rx="44" ry="27" fill="none" stroke="#B9852A" stroke-width="5"/><ellipse cx="128" cy="161" rx="24" ry="14" fill="none" stroke="#B9852A" stroke-width="2.5" stroke-dasharray="4 3"/><polygon points="176,161 186,155 186,167" fill="#2C4A40"/><text x="256" y="168" text-anchor="middle" font-size="18" font-weight="700" fill="#2C4A40" font-family="var(--mono)">A</text></g><g data-tip="الطريقة الثالثة: تغيير الزاوية ⟦θ⟧ بين متجه المساحة العمودي على الحلقة ومتجه المجال، مثلاً بتدوير الحلقة داخل المجال كما في المولد."><rect x="54" y="208" width="252" height="74" rx="12" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><ellipse cx="128" cy="245" rx="14" ry="28" transform="rotate(-35 128 245)" fill="none" stroke="#B9852A" stroke-width="5"/><path d="M96 222 A40 40 0 0 0 96 268" fill="none" stroke="#2C4A40" stroke-width="2.5"/><polygon points="96,272 90,260 102,262" fill="#2C4A40"/><text x="256" y="252" text-anchor="middle" font-size="18" font-weight="700" fill="#2C4A40" font-family="var(--mono)">θ</text></g></svg>`,
   cap:'الفيض <span class="ltr">Φ = B A cosθ</span>، فتغيير أي من الثلاثة يغيّر الفيض.<br><b>مرّر المؤشر على كل صف (أو المسه في الجوال) لتعرف الطريقة.</b>',
   side:[
    {book:String.raw`<p>والسؤال الآن ما هو السبب في التيار الحثي الذي ينشأ بواسطة التغيير في المجال المغناطيسي؟</p>
     <p>من الملاحظات العملية على التجارب سابقة الذكر نستنتج أن القوة الدافعة الكهربائية في الدائرة <b>تتناسب طردياً مع المعدل الزمني للتغير في الفيض المغناطيسي</b> خلال الدائرة. أي أن:</p>
     <div class="eq">$$E=-\frac{d\phi_m}{dt}$$<span class="eqno">(5-43)</span></div>`,ref:'ص 152–153'}
   ],
   body:[
    {book:String.raw`<p>حيث إن عدد لفات الملف تساوي الوحدة \((N=1.0\ \text{T})\) ، \(\Phi_m\) هي الفيض المغناطيسي المار خلال الدائرة المغناطيسية. والتي تحسب من القانون التالي:</p>
     <div class="eq">$$\phi_m=\int B\times dA$$<span class="eqno">(5-44)</span></div>
     <p>في حالة مرور التيار في ملف يتكون من عدد لفاته \(N\) فإن قانون فارادي للحث يصبح في الصورة التالية:</p>
     <div class="eq">$$E=-N\frac{d\phi_m}{dt}$$<span class="eqno">(5-45)</span></div>
     <p>ولتغيير الفيض المغناطيسي يمكن استخدام عدة طرق وهي:</p><ul><li>تغيير المجال المغناطيسي.</li><li>تغيير مساحة الدائرة الكهربائية.</li><li>تغيير الزاوية بين متجه المساحة العمودي على المساحة ومتجه المجال المغناطيسي.</li></ul>`,ref:'ص 153'},
    {predict:{q:'استبدلنا الحلقة (لفة واحدة) بملف فيه 100 لفة، وحركنا المغناطيس بالطريقة نفسها. القوة الدافعة الحثية:',opts:[
     ['تبقى كما هي',false,'كل لفة يقطعها الفيض المتغير نفسه، فتتولد فيها قوة دافعة تُجمع مع البقية.'],
     ['تصبح 100 ضعف',true,'المعادلة (5-45): \\(E=-N\\,d\\phi_m/dt\\)، فالقوة الدافعة تتناسب مع عدد اللفات.'],
     ['تقل إلى \\(1/100\\)',false,'\\(N\\) في البسط، فزيادة اللفات تزيد القوة الدافعة.']]}},
    {tip:String.raw`<p>انتبه للفرق: القوة الدافعة لا تتعلق بمقدار الفيض بل بـ<b>سرعة تغيّره</b> \(d\phi_m/dt\). مغناطيس قوي ثابت لا يولّد شيئاً، ومغناطيس ضعيف يتحرك بسرعة يولّد قوة دافعة. حرّك المغناطيس ببطء ثم بسرعة في تبويب المختبر وقارن قراءة الجلفانومتر.</p>`,title:'السرعة هي المهمة'},
    {watch:String.raw`<p>في جملة الكتاب \((N=1.0\ \text{T})\) الحرف T يعني «لفة» (Turn) وليس وحدة التسلا. ستجد هذا الاستعمال أيضاً في مثال (٥-١٢): <span class="ltr">N₁ = 1000T</span>.</p>`}
   ]},

  {st:3,short:'الإشارة السالبة',title:'المعنى الفيزيائي للإشارة السالبة: قانون لينز',ref:'ص 153',
   q:'لو كان التيار الحثي يساعد المغناطيس على الاقتراب، لتسارع المغناطيس وحده وزادت الطاقة دون مقابل… فما الذي يمنع ذلك؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مغناطيس يقترب بقطبه الشمالي من حلقة، فيصبح وجه الحلقة المقابل قطباً شمالياً ويتنافران" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#E6E2F8"/><g data-tip="الحلقة: التيار الحثي فيها يجعل وجهها المقابل للمغناطيس قطباً شمالياً ⟦N⟧ عند التقريب، فيعاكس زيادة الفيض."><ellipse cx="120" cy="150" rx="20" ry="62" fill="none" stroke="#B9852A" stroke-width="7"/><circle cx="160" cy="150" r="17" fill="#FBF6EE" stroke="#E8735A" stroke-width="2.5"/><text x="160" y="156" text-anchor="middle" font-size="16" font-weight="700" fill="#E8735A" font-family="var(--mono)">N</text></g><g data-tip="الفيض الناشئ عن التيار الحثي: يتجه بعيداً عن المغناطيس، أي عكس الفيض المتزايد الذي أنشأه." stroke="#E8735A" stroke-width="3"><line x1="140" y1="112" x2="80" y2="112"/><line x1="140" y1="188" x2="80" y2="188"/><polygon points="70,112 84,105 84,119" fill="#E8735A" stroke="none"/><polygon points="70,188 84,181 84,195" fill="#E8735A" stroke="none"/></g><g data-tip="المغناطيس يقترب بقطبه الشمالي ⟦N⟧، فيزداد الفيض في الحلقة."><rect x="214" y="134" width="50" height="32" fill="#E8735A" stroke="#2C4A40" stroke-width="2.5"/><rect x="264" y="134" width="50" height="32" fill="#C9D3CE" stroke="#2C4A40" stroke-width="2.5"/><text x="239" y="156" text-anchor="middle" font-size="16" font-weight="700" fill="#FBF6EE" font-family="var(--mono)">N</text><text x="289" y="156" text-anchor="middle" font-size="16" font-weight="700" fill="#2C4A40" font-family="var(--mono)">S</text><line x1="306" y1="112" x2="246" y2="112" stroke="#2C4A40" stroke-width="5" stroke-linecap="round"/><polygon points="232,112 250,102 250,122" fill="#2C4A40"/></g><g data-tip="قوة تنافر بين الوجه الشمالي للحلقة والقطب الشمالي للمغناطيس: تقاوم الاقتراب، فتحتاج يدك إلى بذل شغل."><line x1="200" y1="190" x2="244" y2="190" stroke="#3A7CA5" stroke-width="4"/><polygon points="256,190 242,183 242,197" fill="#3A7CA5"/></g><text x="180" y="262" text-anchor="middle" font-size="14" font-weight="700" fill="#2C4A40" direction="rtl" unicode-bidi="embed">تقريب N يصنع N مقابله</text><text x="180" y="284" text-anchor="middle" font-size="14" font-weight="700" fill="#2C4A40" direction="rtl" unicode-bidi="embed">فيتنافران ويقاوم الاقتراب</text></svg>`,
   cap:'قانون لينز عند تقريب القطب الشمالي من الحلقة.<br><b>مرّر المؤشر على الحلقة والأسهم والمغناطيس (أو المسه في الجوال) لتعرف معناها.</b>',
   side:[
    {book:String.raw`<p>تدل الإشارة السالبة في قانون فارادي على اتجاه التيار الحثي الذي يتولد في الدائرة الكهربائية نتيجة للتغير في الفيض المغناطيسي بالنسبة للزمن. وباستخدام <b>قانون لينز</b> يمكن تحديد اتجاه التيار الحثي، وينص قانون لينز على ما يلي:</p>
     <p><b>يكون اتجاه التيار الحثي في الدائرة الكهربائية بحيث يعاكس الفيض المغناطيسي الناشئ عنه الفيض المغناطيسي الذي أنشأه.</b></p>`,ref:'ص 153'}
   ],
   body:[
    {predict:{q:'الآن نسحب القطب الشمالي بعيداً عن الحلقة. أي قطب يصبح وجه الحلقة المقابل للمغناطيس؟',opts:[
     ['قطباً شمالياً، فيدفع المغناطيس بعيداً',false,'هذا يساعد الابتعاد بدل أن يقاومه، وهو عكس قانون لينز.'],
     ['لا قطب؛ التيار الحثي يتولد عند التقريب فقط',false,'الإبعاد يغيّر الفيض أيضاً (ينقصه)، فيتولد تيار في الاتجاه الآخر (الشكل ٥-٢١ب).'],
     ['قطباً جنوبياً، فيجذب المغناطيس ويقاوم ابتعاده',true,'الفيض ينقص، فيصنع التيار الحثي فيضاً في اتجاه الفيض الأصلي ليعوّض النقص: الوجه يصبح S فيجذب الشمالي.']]}},
    {tip:String.raw`<p>«يعاكس» في قانون لينز معناها يعاكس <b>التغيّر</b>، لا الفيض نفسه:</p><ul><li>الفيض يزداد (تقريب) ← التيار الحثي يصنع فيضاً معاكساً ← تنافر يقاوم الاقتراب.</li><li>الفيض ينقص (إبعاد) ← التيار الحثي يصنع فيضاً في الاتجاه نفسه ← تجاذب يقاوم الابتعاد.</li></ul><p>في الحالتين تحتاج يدك إلى بذل شغل لتحريك المغناطيس، وهذا الشغل هو مصدر الطاقة الكهربائية في الحلقة. راقب الحرف على وجه الحلقة في تبويب المختبر وأنت تقرّب المغناطيس وتبعده.</p>`,title:'يعاكس التغيّر'},
    {tip:String.raw`<p>الآن تفهم الإشارة السالبة في (5-13) أيضاً: القوة الدافعة الذاتية \(E=-L\,dI/dt\) تعاكس تغيّر التيار في الملف نفسه، وهذا قانون لينز مطبقاً على الملف وحده.</p>`,title:'ربط بالحث الذاتي'},
    {add:String.raw`<p>المكابح المغناطيسية في بعض القطارات وألعاب الملاهي (السقوط الحر) تعمل بقانون لينز: صفائح معدنية تمر بسرعة بين مغناطيسات فتتولد فيها تيارات حثية تعاكس الحركة وتبطئها دون أي احتكاك.</p>`,title:'من الواقع'}
   ]},

  {st:4,short:'الأمثلة',title:'أمثلة محلولة',ref:'ص 154–155',
   q:'مثالان من الكتاب: الحث الذاتي لملف حلزوني بقلب هوائي ثم حديدي، والحث المتبادل بين ملف حلزوني وملف صغير حول منتصفه. الحل الكامل في تبويب «الأمثلة المحلولة».',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ملف حلزوني طوله متر واحد وعدد لفاته 1000، وحول منتصفه ملف صغير عدد لفاته 20، كما في مثال 5-12" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="الملف الحلزوني (1): ⟦N1 = 1000⟧ لفة، ومساحة مقطعه ⟦A = 6 × 10⁻⁴ m²⟧، وبداخله هواء."><rect x="54" y="132" width="252" height="48" rx="8" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M66 126l6 60M84 126l6 60M102 126l6 60M120 126l6 60M138 126l6 60M210 126l6 60M228 126l6 60M246 126l6 60M264 126l6 60M282 126l6 60" stroke="#B9852A" stroke-width="3.5" stroke-linecap="round"/><text x="100" y="114" text-anchor="middle" font-size="15" font-weight="700" fill="#B9852A" font-family="var(--mono)">N1 = 1000</text></g><g data-tip="الملف الصغير (2): ⟦N2 = 20⟧ لفة ملفوفة حول منتصف الملف (1)، يقطعها فيض الملف (1) كله."><path d="M162 118l6 76M172 118l6 76M182 118l6 76M192 118l6 76" stroke="#E8735A" stroke-width="5" stroke-linecap="round"/><text x="250" y="114" text-anchor="middle" font-size="15" font-weight="700" fill="#E8735A" font-family="var(--mono)">N2 = 20</text></g><g data-tip="طول الملف الحلزوني ⟦ℓ = 1.0 m⟧."><line x1="58" y1="222" x2="302" y2="222" stroke="#2C4A40" stroke-width="2.5"/><polygon points="54,222 66,216 66,228" fill="#2C4A40"/><polygon points="306,222 294,216 294,228" fill="#2C4A40"/><text x="180" y="246" text-anchor="middle" font-size="15" font-weight="700" fill="#2C4A40" font-family="var(--mono)">ℓ = 1.0 m</text></g></svg>`,
   cap:'الملفان في مثال (٥-١٢).<br><b>مرّر المؤشر على الملفين والطول (أو المسه في الجوال) لتعرف المعطيات.</b>',
   side:[
    {html:String.raw`<div class="exl">
     <div class="exc"><header>مثال (٥-١١) <span class="ref">ص 154</span></header>
      <div class="kv-row"><small>المعطيات</small><span class="kv ltr">\(\ell=1.0\ \text{m}\)</span><span class="kv ltr">\(A=6\times10^{-4}\ \text{m}^2\)</span><span class="kv ltr">\(N=1000\)</span><span class="kv ltr">\(\mu_r=500\)</span><span class="kv ltr">\(di/dt=15\ \text{A/s}\)</span></div>
      <div class="kv-row"><small>النتائج</small><span class="kv res ltr">\(L=7.54\times10^{-4}\ \text{H}\)</span><span class="kv res ltr">\(L=0.377\ \text{H}\)</span><span class="kv res ltr">\(E=-5.655\ \text{V}\)</span></div></div>
     <div class="exc"><header>مثال (٥-١٢) <span class="ref">ص 154–155</span></header>
      <div class="kv-row"><small>المعطيات</small><span class="kv ltr">\(\ell=1.0\ \text{m}\)</span><span class="kv ltr">\(A=6\times10^{-4}\ \text{m}^2\)</span><span class="kv ltr">\(N_1=1000\)</span><span class="kv ltr">\(N_2=20\)</span><span class="kv ltr">\(dI_1/dt=10\ \text{A/s}\)</span></div>
      <div class="kv-row"><small>النتائج</small><span class="kv res ltr">\(M=1.508\times10^{-5}\ \text{H}\)</span><span class="kv res ltr">\(E_2\approx-151\ \mu\text{V}\)</span></div></div>
     <div class="w-row"><button class="btn pri" type="button" onclick="var b=document.querySelector('.ltabs button[data-tab=examples]');if(b)b.click()">افتح الأمثلة المحلولة وغيّر الأرقام</button></div></div>`}
   ],
   body:[
    {predict:{q:'في مثال (٥-١١) وضعنا قضيب حديد \\((\\mu_r=500)\\) داخل الملف. كم مرة يزيد الحث الذاتي؟',opts:[
     ['500 مرة',true,'\\(L=\\mu_0\\mu_rN^2A/\\ell\\): \\(7.54\\times10^{-4}\\times500\\approx0.377\\) H.'],
     ['مرتين فقط',false,'الحث يتناسب مع النفاذية النسبية كلها، لا مع عدد ثابت.'],
     ['لا يتغير',false,'الحث يعتمد على نفاذية القلب، والحديد يرفعها كثيراً.']]}},
    {book:String.raw`<p>في الملف (1) تكون كثافة الفيض المغناطيسي في اتجاه محور الملف الحلزوني نتيجة مرور تيار قيمته \(I\)</p>
     <div class="eq">$$B=\frac{\mu_0N_1I}{\ell}$$</div>
     <p>عندئذ يساوي التدفق المار بالمقطع المركزي المقدار:</p>
     <div class="eq">$$\phi=B\times A=\frac{\mu_0N_1IA}{\ell}$$</div>
     <p>و لما كان هذا التدفق يتصل بالملف (2) فإن معامل الحث المتبادل :</p>
     <div class="eq">$$M=\frac{N_2\times\Phi}{I}=\mu_0\,\frac{N_2N_1A}{\ell}$$</div>`,ref:'ص 154–155'},
    {watch:String.raw`<p>في مثال (٥-١٢) أخطاء في الكتاب: (1) يلي معادلة \(M\) سطران مكرران \(L=\dots=0.377\) H منسوخان من المثال السابق ولا علاقة لهما بهذا المثال (لا قلب حديدي هنا). (2) في حساب القوة الدافعة عُوِّض \(M=25.1\times10^{-6}\) H بدل القيمة المحسوبة \(15.07\times10^{-6}\) H، فطُبع \(E_2=-251\ \mu\text{V}\) والصحيح \(-151\ \mu\text{V}\). وفي مثال (٥-١١) أسقط الكتاب الإشارة السالبة في الناتج (طُبع <span class="ltr">5.655 V</span>). في تبويب الأمثلة مفتاح «كما في الكتاب / المصحح» لمثال (٥-١٢).</p>`,fix:true},
    {tip:String.raw`<p>قارن نتيجتي مثال (٥-١١): القلب الحديدي \((\mu_r=500)\) جعل الحث 500 ضعف: \(7.54\times10^{-4}\times500=0.377\) H. وفي مثال (٥-١٢) استعملنا فكرة (5-21): الفيض الذي يصنعه الملف (1) يقطع كل لفة من لفات الملف (2)، فنضربه في \(N_2\) ونقسم على التيار المسبب.</p>`}
   ]},

  {st:5,short:'تمارين الوحدة',title:'تمارين على الوحدة الخامسة',ref:'ص 156',
   q:'ستة تمارين تجمع الوحدة كلها. هل تعرف أي معادلة يحتاجها كل تمرين قبل أن تبدأ الحساب؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ورقة تمارين فيها ستة تمارين، وبجانب كل تمرين المعادلة التي يحتاجها" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><rect x="82" y="40" width="196" height="248" rx="14" fill="#F1EBDD" stroke="#2C4A40" stroke-width="4"/><rect x="140" y="28" width="80" height="26" rx="8" fill="#2C4A40"/><text x="180" y="80" text-anchor="middle" font-size="15" font-weight="700" fill="#2C4A40" direction="rtl" unicode-bidi="embed">تمارين الوحدة</text><g data-tip="التمرين 1: سلك مستقيم ⟦2 A⟧ في الهواء ونقطة على بعد ⟦8 cm⟧: المعادلتان (5-7) و(5-8)."><rect x="98" y="94" width="164" height="28" rx="6" fill="#FBF6EE"/><text x="250" y="113" text-anchor="end" font-size="13" font-weight="700" fill="#2C4A40" font-family="var(--mono)">1</text><text x="110" y="113" font-size="13" fill="#3A7CA5" font-family="var(--mono)">(5-7) (5-8)</text></g><g data-tip="التمرين 2: قوة على سلك ⟦4 A⟧ طوله ⟦10 cm⟧ في مجال ⟦0.06 T⟧ عمودياً ثم بزاوية ⟦40°⟧: المعادلة (5-9)."><rect x="98" y="126" width="164" height="28" rx="6" fill="#FBF6EE"/><text x="250" y="145" text-anchor="end" font-size="13" font-weight="700" fill="#2C4A40" font-family="var(--mono)">2</text><text x="110" y="145" font-size="13" fill="#3A7CA5" font-family="var(--mono)">(5-9)</text></g><g data-tip="التمرين 3: سلك ⟦0.5 m⟧ يحمل ⟦8 A⟧ في مجال ⟦0.40 T⟧ بزاوية ⟦15°⟧: المعادلة (5-9)."><rect x="98" y="158" width="164" height="28" rx="6" fill="#FBF6EE"/><text x="250" y="177" text-anchor="end" font-size="13" font-weight="700" fill="#2C4A40" font-family="var(--mono)">3</text><text x="110" y="177" font-size="13" fill="#3A7CA5" font-family="var(--mono)">(5-9)</text></g><g data-tip="التمرين 4: سلكان متوازيان على بعد ⟦8 cm⟧ بتيارين ⟦2 A⟧ و⟦4 A⟧ في اتجاه واحد: المعادلة (5-12)."><rect x="98" y="190" width="164" height="28" rx="6" fill="#FBF6EE"/><text x="250" y="209" text-anchor="end" font-size="13" font-weight="700" fill="#2C4A40" font-family="var(--mono)">4</text><text x="110" y="209" font-size="13" fill="#3A7CA5" font-family="var(--mono)">(5-12)</text></g><g data-tip="التمرين 5: حث ملف ⟦200⟧ لفة طوله ⟦8 cm⟧ بقلب ⟦μr = 5000⟧ وقطره ⟦3.0 mm⟧: (5-19) مع ⟦μr⟧، كما في مثال (٥-٩)."><rect x="98" y="222" width="164" height="28" rx="6" fill="#FBF6EE"/><text x="250" y="241" text-anchor="end" font-size="13" font-weight="700" fill="#2C4A40" font-family="var(--mono)">5</text><text x="110" y="241" font-size="13" fill="#3A7CA5" font-family="var(--mono)">(5-19)</text></g><g data-tip="التمرين 6: قوة دافعة في ملف ⟦100⟧ لفة: المعادلة (5-45). نص السؤال في الكتاب ناقص (لا يذكر معدل تغير الفيض)."><rect x="98" y="254" width="164" height="28" rx="6" fill="#FBF6EE"/><text x="250" y="273" text-anchor="end" font-size="13" font-weight="700" fill="#2C4A40" font-family="var(--mono)">6</text><text x="110" y="273" font-size="13" fill="#3A7CA5" font-family="var(--mono)">(5-45)</text></g></svg>`,
   cap:'رقم كل تمرين والمعادلة التي يحتاجها.<br><b>مرّر المؤشر على أي تمرين (أو المسه في الجوال) لتعرف معطياته.</b>',
   side:[
    {predict:{q:'في التمرين 4: سلكان متوازيان يمر فيهما تياران في اتجاه واحد. القوة بينهما:',opts:[
     ['تنافرية',false,'التنافر عندما يكون التياران متعاكسين.'],
     ['تجاذبية',true,'التياران في اتجاه واحد فيتجاذب الموصلان (ص 141).'],
     ['لا توجد قوة لأن التيارين مختلفان',false,'القوة موجودة مهما كانت قيمتا التيارين، ومقدارها من (5-12).']]}}
   ],
   body:[
    {book:String.raw`<ol><li>يمر تيار شدته <span class="ltr">2A</span> في سلك طويل مستقيم موضوع في الهواء. احسب كثافة الفيض المغناطيسي الناتج وشدة المجال عند نقطة تبعد <span class="ltr">8cm</span> عن السلك.</li>
     <li>يمر تيار شدته <span class="ltr">4A</span> في سلك مستقيم طوله <span class="ltr">10cm</span>. احسب القوة الميكانيكية التي تظهر على السلك إذاً وضع عمودياً على خطوط مجال مغناطيسي كثافة فيضه <span class="ltr">0.06T</span>. كم تصبح هذه القوة إذاً كانت الزاوية بين السلك والمجال <span class="ltr">40°</span> ؟</li>
     <li>وضع سلك طوله <span class="ltr">0.5m</span> وحامل لتيار شدته <span class="ltr">8A</span> في مجال مغناطيسي كثافة فيضه <span class="ltr">0.40T</span> . ما القوة التي سيخضع لها السلك إذاً كانت الزاوية بين السلك والمجال <span class="ltr">15°</span> ؟</li>
     <li>سلكين طويلين متوازيين يبعدان <span class="ltr">8cm</span> عن بعضهما يمر فيهما تيارين في اتجاه واحد قيمة كل منهم <span class="ltr">2A</span> و <span class="ltr">4A</span> . احسب القوة بين السلكين. هل هذه القوة تجاذبية أو تنافرية</li>
     <li>احسب الحثية الذاتية لملف عدد لفاته 200، طوله <span class="ltr">8cm</span>، ذي قلب حديدي نفاذيته النسبية 5000 وقطره <span class="ltr">3.0mm</span></li>
     <li>احسب القوة الدافعة الكهربائية المستحثة في ملف عدد لفاته 100 إذا وضعناه في مجال مغناطيسي يتغير فيضه</li></ol>`,ref:'ص 156'},
    {watch:String.raw`<p>طريقة التمرين 6: \(E=-N\,d\Phi/dt=-100\times(d\Phi/dt)\) بعد أن يحدد المدرب معدل تغير الفيض. والكتاب لا يذكر إجابات التمارين.</p>`},
    {watch:String.raw`<p>نص التمرين 6 في الكتاب مبتور: لا يذكر معدل تغير الفيض، فلا يمكن حسابه رقمياً.</p>`,fix:true},
    {tip:String.raw`<p>لكل تمرين إجابة مقترحة (ليست من الكتاب) مع حاسبة في تبويب «الأمثلة المحلولة». حاول الحل أولاً، ثم قارن. تذكّر تحويل <span class="ltr">cm</span> و<span class="ltr">mm</span> إلى المتر قبل التعويض.</p>`,title:'قبل أن تبدأ'}
   ]},

  {recap:[
   String.raw`تغيّر الفيض خلال دائرة يولّد فيها قوة دافعة وتياراً حثياً: بحركة مغناطيس، أو بغلق وفتح دائرة ملف مجاور (ص 151–152).`,
   String.raw`قانون فارادي للفة واحدة، المعادلة (5-43): \(E=-\dfrac{d\phi_m}{dt}\)، والفيض، المعادلة (5-44): \(\phi_m=\int B\times dA\)`,
   String.raw`لملف عدد لفاته \(N\)، المعادلة (5-45): \(E=-N\dfrac{d\phi_m}{dt}\). ونغيّر الفيض بتغيير المجال أو المساحة أو الزاوية (ص 153).`,
   String.raw`قانون لينز (الإشارة السالبة): التيار الحثي يصنع فيضاً يعاكس التغيّر الذي أنشأه، فيقاوم الاقتراب والابتعاد معاً (ص 153).`]}
],
 theory:[
  {h:'قانون فارادي وقانون لنز',ref:'ص 151–152',html:`<p>درسنا كيفية الحصول على مجال مغناطيسي من تيار يمر في أشكال مختلفة من السلك، والسؤال الآن: <b>هل يمكن الحصول على تيار كهربائي من المجال المغناطيسي؟</b> أجاب عن ذلك العالمان مايكل فارادي البريطاني وجوزيف هنري الأمريكي، واكتُشف قانون فارادي عام 1831 بعد تجارب أدت إلى نتائج متشابهة، وهو ما يعرف <b>بقانون فارادي للحث Faraday's law of induction</b>.</p>
   <p>لوحظ أنه عند اقتراب مغناطيس من الدائرة المبينة في الشكل (٥-٢١أ) يتحرك مؤشر الجلفانومتر، وعند ثبوت المغناطيس يعود المؤشر إلى الصفر، أما عند سحب المغناطيس في الاتجاه المعاكس (الشكل ٥-٢١ب) ينحرف المؤشر في الاتجاه الآخر، مما يشير إلى مرور تيار في الدائرة عند حركة المغناطيس. هذا التيار يعرف <b>بالتيار الحثي Induced Current</b> وهو ناشئ من <b>قوة دافعة كهربائية متولدة Induced Electromotive Force</b>.</p>`},
  {fig:'(٥-٢١)',ref:'ص 152',caption:'جلفانومتر موصل بحلقة سلكية، ومغناطيس قطبه N يواجه الحلقة: (أ) التقريب، (ب) الإبعاد.',draw:()=>box(fig521(),720)},
  {html:`<p>وفي تجربة أخرى (الشكل ٥-٢٢) نلاحظ عند لحظة إغلاق مفتاح الدائرة ولحظة فتحها مرور تيار في الدائرة الثانوية؛ لأن التيار عند الفتح أو الإغلاق يتغير بين الصفر وأقصى قيمة مما يغير المجال المتولد في الملف على الجانب الأيسر، وهذا يؤدي إلى تيار يمر في الدائرة الثانوية.</p>`},
  {fig:'(٥-٢٢)',ref:'ص 152',caption:'حلقة حديدية (Iron): الملف الأيسر موصل ببطارية عبر مفتاح، والأيمن موصل بجلفانومتر.',draw:()=>box(ringSVG(),600)},
  {h:'السبب في التيار الحثي',ref:'ص 153',html:`<p>من الملاحظات العملية نستنتج أن القوة الدافعة الكهربائية في الدائرة تتناسب طردياً مع المعدل الزمني للتغير في الفيض المغناطيسي خلال الدائرة:</p>
   $$E=-\\frac{d\\phi_m}{dt} \\qquad (5\\text{-}43)$$
   <p>حيث عدد لفات الملف يساوي الوحدة (\\(N=1\\) لفة)، و\\(\\Phi_m\\) الفيض المار خلال الدائرة:</p>
   $$\\phi_m=\\int B\\times dA \\qquad (5\\text{-}44)$$
   <p>وفي حالة ملف عدد لفاته \\(N\\) يصبح قانون فارادي:</p>
   $$E=-N\\frac{d\\phi_m}{dt} \\qquad (5\\text{-}45)$$
   <p>ولتغيير الفيض المغناطيسي يمكن استخدام عدة طرق:</p><ul><li>تغيير المجال المغناطيسي.</li><li>تغيير مساحة الدائرة الكهربائية.</li><li>تغيير الزاوية بين متجه المساحة العمودي على المساحة ومتجه المجال.</li></ul>`},
  {h:'المعنى الفيزيائي للإشارة السالبة',ref:'ص 153',html:`<p>تدل الإشارة السالبة في قانون فارادي على اتجاه التيار الحثي الذي يتولد في الدائرة نتيجة للتغير في الفيض بالنسبة للزمن، وباستخدام <b>قانون لنز</b> يمكن تحديد اتجاه التيار الحثي:</p>
   <div class="callout"><b>قانون لنز:</b> يكون اتجاه التيار الحثي في الدائرة الكهربائية بحيث يعاكس الفيض المغناطيسي الناشئ عنه الفيض المغناطيسي الذي أنشأه.</div>`},
  {note:'<b>توضيح للمتدرب (ليس من الكتاب):</b> «يعاكس» يعني يعاكس <b>التغير</b>: عند تقريب القطب N يصبح وجه الحلقة المقابل له قطباً N فيتنافران (يقاوم الاقتراب)، وعند الإبعاد يصبح الوجه قطباً S فيتجاذبان (يقاوم الابتعاد). لذلك تحتاج إلى بذل شغل لتحريك المغناطيس — وهذا الشغل هو مصدر الطاقة الكهربائية. تراه في المختبر.'},
  {h:'أمثلة محلولة',ref:'ص 154–155',html:`<p>في تبويب «الأمثلة المحلولة»: مثال (٥-١١) الحث الذاتي لملف حلزوني بقلب هوائي ثم بقلب حديدي، والقوة الدافعة الذاتية عند تغير التيار بمعدل 15 A/s؛ ومثال (٥-١٢) الحث المتبادل بين ملف حلزوني وملف صغير ملفوف حول منتصفه والقوة الدافعة في الملف الثاني. في مثال (٥-١٢): كثافة الفيض في الملف (1) \\(B=\\mu_0N_1I/\\ell\\)، والتدفق المار بالمقطع المركزي \\(\\phi=BA=\\mu_0N_1IA/\\ell\\)، ولما كان هذا التدفق يتصل بالملف (2) فإن \\(M=N_2\\Phi/I=\\mu_0N_2N_1A/\\ell\\).</p>`},
  {h:'تمارين على الوحدة الخامسة',ref:'ص 156',html:[
   Q('تمرين 1','يمر تيار شدته 2 A في سلك طويل مستقيم موضوع في الهواء. احسب كثافة الفيض المغناطيسي الناتج وشدة المجال عند نقطة تبعد 8 cm عن السلك.','من (5-7) و(5-8): \\(B=\\dfrac{4\\pi\\times10^{-7}\\times2}{2\\pi\\times0.08}=5\\times10^{-6}\\) T، و\\(H=\\dfrac{2}{2\\pi\\times0.08}\\approx3.98\\) A/m. الحاسبة في تبويب «الأمثلة المحلولة».'),
   Q('تمرين 2','يمر تيار شدته 4 A في سلك مستقيم طوله 10 cm. احسب القوة الميكانيكية التي تظهر على السلك إذا وضع عمودياً على خطوط مجال مغناطيسي كثافة فيضه 0.06 T. كم تصبح هذه القوة إذا كانت الزاوية بين السلك والمجال 40°؟','من (5-9): \\(F=0.06\\times0.1\\times4\\times\\sin90^\\circ=0.024\\) N، وعند 40°: \\(F=0.024\\times\\sin40^\\circ\\approx0.0154\\) N.'),
   Q('تمرين 3','وضع سلك طوله 0.5 m وحامل لتيار شدته 8 A في مجال مغناطيسي كثافة فيضه 0.40 T. ما القوة التي سيخضع لها السلك إذا كانت الزاوية بين السلك والمجال 15°؟','\\(F=0.4\\times0.5\\times8\\times\\sin15^\\circ=1.6\\times0.2588\\approx0.414\\) N.'),
   Q('تمرين 4','سلكان طويلان متوازيان يبعدان 8 cm عن بعضهما يمر فيهما تياران في اتجاه واحد قيمة كل منهما 2 A و 4 A. احسب القوة بين السلكين. هل هذه القوة تجاذبية أو تنافرية؟','من (5-12): \\(F/\\ell=\\dfrac{4\\pi\\times10^{-7}\\times2\\times4}{2\\pi\\times0.08}=2\\times10^{-5}\\) N/m، وهي قوة <b>تجاذب</b> لأن التيارين في اتجاه واحد.'),
   Q('تمرين 5','احسب الحثية الذاتية لملف عدد لفاته 200، طوله 8 cm، ذي قلب حديدي نفاذيته النسبية 5000 وقطره 3.0 mm.','كما في مثال (٥-٩): \\(L=\\dfrac{\\mu_0\\mu_rN^2\\pi d^2}{4\\ell}=\\dfrac{4\\pi\\times10^{-7}\\times5000\\times200^2\\times\\pi(3\\times10^{-3})^2}{4\\times0.08}\\approx0.0222\\) H = 22.2 mH.'),
   Q('تمرين 6','احسب القوة الدافعة الكهربائية المستحثة في ملف عدد لفاته 100 إذا وضعناه في مجال مغناطيسي يتغير فيضه …','<span class="fixnote">نص السؤال في الكتاب ناقص: لا يذكر معدل تغير الفيض.</span> الطريقة: \\(E=-N\\,d\\Phi/dt=-100\\times(d\\Phi/dt)\\). مثلاً لو تغير الفيض بمعدل 0.05 Wb/s تكون \\(E=-5\\) V. الحاسبة في تبويب «الأمثلة المحلولة» تأخذ المعدل الذي يحدده المدرب.')].join('')},
  {err:`<div class="fixnote"><ol style="margin:4px 0 0;padding-inline-start:20px"><li>ص 153: «عدد لفات الملف تساوي الوحدة (N = 1.0 T)» — الحرف T هنا يعني لفة (Turn) لا التسلا.</li>
   <li>مثال (٥-١١) ص 154: أسقط الكتاب الإشارة السالبة في الناتج: \\(E=-L\\,di/dt=-5.655\\) V (المقدار 5.655 V صحيح).</li>
   <li>مثال (٥-١٢) ص 155: يلي معادلة M سطران مكرران \\(L=\\mu N^2A/\\ell=\\dots=0.377\\) H منسوخان من المثال السابق ولا علاقة لهما بهذا المثال (لا قلب حديدي هنا)؛ حذفناهما.</li>
   <li>مثال (٥-١٢): في حساب القوة الدافعة عُوِّض \\(M=25.1\\times10^{-6}\\) H بدل القيمة المحسوبة \\(15.07\\times10^{-6}\\) H، فطُبع \\(E_2=-251\\ \\mu\\text{V}\\) والصحيح \\(-151\\ \\mu\\text{V}\\). وناتج M المطبوع 1.507 والدقيق 1.508. في الحاسبة مفتاح «كما في الكتاب / المصحح».</li>
   <li>التمرين 6 ص 156: نص السؤال مبتور (لا يذكر معدل تغير الفيض).</li></ol></div>`}
 ],
 lab:(el)=>{
  let N=100,v=20,flip=false,xm=520,auto=0,prevPhi=null,emf=0,t=0,hist=[],did={},hold=0,peak=0;
  let sw=false,I1=0,emf2=0,hist2=[],did2={};
  el.innerHTML=`<div id="f5tp"></div><div class="grid mg-lab">
   <div class="panel c12"><h2>مغناطيس وحلقة وجلفانومتر <small>مبنية على الشكل (٥-٢١) ص 152 والمعادلة (5-45)</small></h2>
    <div class="grid"><div class="c7"><div class="svgbox mg-svg" id="f5a"></div><p class="sub">اسحب المغناطيس أفقياً، أو استعمل الأزرار. الحرف على وجه الحلقة هو القطب الذي يصنعه التيار الحثي (قانون لنز).</p></div>
     <div class="c5"><div class="mg-row"><button class="btn" id="f5in">قرّب ←</button><button class="btn" id="f5st">أوقف</button><button class="btn" id="f5out">→ أبعد</button></div>
      ${sl('f5v','سرعة الحركة بالأزرار',5,60,1,v)}${sl('f5N','عدد لفات الملف N',1,200,1,N)}
      <div class="mg-row">${segHTML('fl',[['n','القطب N يواجه الحلقة'],['s','اقلب المغناطيس (S يواجهها)']],'n')}</div>
      <div class="facts">${fact('الفيض في الحلقة Φ','f5p')}${fact('E = −N dΦ/dt','f5e')}${fact('التيار الحثي','f5i')}</div><div class="mg-row"><span class="mg-chip" id="f5chip"></span></div></div></div>
    <div class="svgbox" id="f5plot" style="margin-top:8px"></div></div>
   <div class="c12" id="f5tpb"></div>
   <div class="panel c12"><h2>غلق وفتح دائرة ملف مجاور <small>مبنية على الشكل (٥-٢٢) ص 152 والمعادلة (5-23)</small></h2>
    <div class="grid"><div class="c7"><div class="svgbox" id="f5b"></div></div>
     <div class="c5"><div class="mg-row"><button class="btn primary" id="f5sw">اغلق المفتاح</button></div>
      <div class="facts">${fact('تيار الملف الابتدائي I₁','f5I1')}${fact('E₂ = −M dI₁/dt','f5e2')}${fact('تيار الجلفانومتر','f5i2')}</div><p class="sub" id="f5bn"></p></div></div>
    <div class="svgbox" id="f5plot2" style="margin-top:8px"></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="f5stp"></ol></div></div>`;
  const $=s=>el.querySelector(s);
  const TP=B.params($('#f5tp'),'u5-l5',[
   {k:'Phi0',label:'أكبر فيض يمر في الحلقة (المغناطيس ملاصق لها)',unit:'mWb',value:0.5,min:0.01,max:100,step:0.01},
   {k:'R',label:'مقاومة دائرة الحلقة والجلفانومتر',unit:'Ω',value:10,min:0.1,max:10000,step:0.1},
   {k:'G',label:'أكبر تيار على تدريج الجلفانومتر',unit:'mA',value:50,min:0.01,max:10000,step:0.01}],()=>{});
  const TP2=B.params($('#f5tpb'),'u5-l5-b',[
   {k:'I1',label:'التيار النهائي في الملف الابتدائي',unit:'A',value:1,min:0.01,max:100,step:0.01},
   {k:'tau',label:'زمن ارتفاع وهبوط التيار (ثابت زمن الملف الابتدائي)',unit:'s',value:0.2,min:0.02,max:5,step:0.01},
   {k:'M',label:'الحث المتبادل بين الملفين',unit:'H',value:0.05,min:0.0001,max:10,step:0.0001},
   {k:'R2',label:'مقاومة دائرة الجلفانومتر',unit:'Ω',value:10,min:0.1,max:10000,step:0.1},
   {k:'G2',label:'أكبر تيار على تدريج الجلفانومتر',unit:'mA',value:50,min:0.01,max:10000,step:0.01}],()=>{});
  const CX=300,a=5; // loop x (px); loop radius a (cm) — drawing scale 10 px = 1 cm
  const dist=()=>Math.max(0,(xm-60-CX-14)/10); // cm from loop to facing pole
  const phi=()=>(flip?-1:1)*TP.v.Phi0*1e-3/Math.pow(1+Math.pow(dist()/a,2),1.5);
  /* أعطال مخفية (وضع التحدي فقط): دائرة الحلقة مقطوعة (لا تيار)، طرفا الجلفانومتر معكوسان (المؤشر وقراءته بالعكس)؛
     والمغناطيس الضعيف ومقاومة الدائرة الكبيرة تغيّر أرقام المحاكاة (p في challenge.js) */
  const chI=()=>chF('open')?0:emf/TP.v.R,chG=()=>chF('grev')?-1:1;
  const drawA=()=>{const W=640,H=260,cy=130;const i=chI(),ang=clamp(-chG()*i*1000/TP.v.G*50,-58,58);
   let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="مغناطيس وحلقة وجلفانومتر">`+galvSVG(90,cy-6,ang);
   s+=`<path class="w ${Math.abs(i)>1e-6?'flow':''}" d="M136 ${cy-20}H${CX}V${cy-74}M136 ${cy+16}H${CX-30}V${cy+74}H${CX}"/>`;
   const ph=phi(),dl=Math.abs(ph)/(TP.v.Phi0*1e-3);for(let k=-3;k<=3;k++){const yy=cy+k*16;const reach=CX+14+(xm-60-CX-14)*(1-Math.abs(k)*0.12);if(dl>0.05)s+=`<path d="M${fx(xm-60)} ${fx(cy+k*6)}C${fx((xm-60+CX)/2)} ${fx(yy)} ${fx(CX+20)} ${fx(yy)} ${fx(CX-60)} ${fx(cy+k*22)}" fill="none" stroke="var(--blue)" stroke-width="1.2" opacity="${fx(clamp(dl*1.5,0.15,0.8))}"/>`}
   s+=`<ellipse cx="${CX}" cy="${cy}" rx="14" ry="74" fill="none" stroke="var(--live)" stroke-width="${clamp(2+N/40,2,7)}"/>`;
   const face=Math.abs(i)<TP.v.G*1e-3*0.02?'':((emfSign>0)?'N':'S');
   if(face){s+=`<text class="txt" x="${CX+30}" y="${cy-80}" font-size="20" text-anchor="middle" style="fill:var(${face==='N'?'--stop':'--muted'})">${face}</text>`+head(CX-14,cy,face==='N'?PI/2:-PI/2,'--live',9)+arT(CX,cy+100,'تيار حثي',{fs:12,col:'--live'})}
   s+=`<g id="f5mag" style="cursor:grab">`+barSVG(xm-60,cy-18,120,36,flip)+`</g>`;
   s+=`<path d="M${CX+14} ${H-14}H${xm-60}" stroke="var(--muted)"/>`+S.t((CX+xm-46)/2,H-20,fm(dist(),1)+' cm','m','middle');
   $('#f5a').innerHTML=s+'</svg>';bindDrag()};
  let emfSign=0,drag=false,dragX0=0;
  const bindDrag=()=>{const svg=$('#f5a svg');svg.onpointerdown=e=>{const p=svgPt(svg,e);if(Math.abs(p.x-xm)<64&&Math.abs(p.y-130)<30){drag=true;auto=0;dragX0=p.x-xm;svg.setPointerCapture(e.pointerId);e.preventDefault()}};
   svg.onpointermove=e=>{if(!drag)return;const p=svgPt(svg,e);xm=clamp(p.x-dragX0,CX+14+60,630-60)};svg.onpointerup=svg.onpointercancel=()=>{drag=false}};
  $('#f5in').onclick=()=>{auto=-1};$('#f5out').onclick=()=>{auto=1};$('#f5st').onclick=()=>{auto=0};
  $('#f5v').oninput=e=>{v=+e.target.value};$('#f5N').oninput=e=>{N=+e.target.value;did.N=1};segBind(el,'fl',x=>{flip=x==='s';prevPhi=null;did.flip=flip});
  $('#f5sw').onclick=()=>{sw=!sw;$('#f5sw').textContent=sw?'افتح المفتاح':'اغلق المفتاح';did2[sw?'close':'open']=1};
  const plot=(h,id,lab,ym)=>{const pts=h.map(p=>[p[0]-t+6,p[1]]);$(id).innerHTML=plotSVG({w:760,h:170,x0:0,x1:6,y0:-ym,y1:ym,xt:[0,1,2,3,4,5,6],xf:x=>fm(x-6),yt:[-ym,0,ym],yf:v=>fm(sig(v,2)),left:60,xl:'t (s)',yl:lab,series:[{pts,col:'--live',w:2}],aria:lab})};
  const steps=stepsUI($('#f5stp'),[
   {t:'قرّب المغناطيس',x:'اضغط «قرّب» أو اسحب المغناطيس نحو الحلقة: ينحرف مؤشر الجلفانومتر إلى اليمين، ويصبح وجه الحلقة المقابل قطباً N يتنافر مع المغناطيس.',done:()=>did.app},
   {t:'ثبّت المغناطيس',x:'أوقف المغناطيس: يعود المؤشر إلى الصفر رغم أن الفيض كبير — المهم <b>تغير</b> الفيض لا قيمته.',done:()=>did.app&&hold>0.6},
   {t:'أبعد المغناطيس',x:'اضغط «أبعد»: ينحرف المؤشر في الاتجاه الآخر، ويصبح وجه الحلقة S يجذب المغناطيس (يقاوم الابتعاد).',done:()=>did.away},
   {t:'أسرع ولفات أكثر',x:'ارفع السرعة إلى <span class="ltr">40 cm/s</span> أو أكثر وعدد اللفات إلى 150 أو أكثر ثم قرّب: تكبر القوة الدافعة (E = −N dΦ/dt).',done:()=>did.fast},
   {t:'اقلب المغناطيس',x:'اختر «اقلب المغناطيس» ثم قرّب: ينحرف المؤشر إلى اليسار هذه المرة.',done:()=>did.flipApp},
   {t:'أغلق المفتاح',x:'في اللوحة الثانية اضغط «اغلق المفتاح»: يتحرك مؤشر الجلفانومتر لحظة الغلق فقط ثم يعود للصفر عندما يثبت التيار.',done:()=>did2.close&&Math.abs(I1-TP2.v.I1)<TP2.v.I1*0.02},
   {t:'افتح المفتاح',x:'اضغط «افتح المفتاح»: يتحرك المؤشر لحظة الفتح في الاتجاه المعاكس.',done:()=>did2.open&&did2.kickOpen}
  ]);
  drawA();
  loopOn(el,dt=>{t+=dt;if(auto&&!drag){xm+=auto*v*10*dt;const lo=CX+14+60,hi=630-60;if(xm<=lo){xm=lo;auto=0}if(xm>=hi){xm=hi;auto=0}}
   const ph=phi();let dp=prevPhi==null?0:(ph-prevPhi)/Math.max(dt,1e-3);prevPhi=ph;const e=-N*dp;emf+=(e-emf)*Math.min(1,dt/0.06);emfSign=dp>1e-12?1:dp<-1e-12?-1:0;
   const i=chI();const moving=Math.abs(dp)>1e-9;hold=moving?0:hold+dt;
   if(-i*1000/TP.v.G*50>8&&!flip)did.app=1;if(-i*1000/TP.v.G*50<-8&&!flip&&did.app)did.away=1;if(flip&&-i*1000/TP.v.G*50<-8&&auto<=0)did.flipApp=1;
   if(N>=150&&(auto<0||drag)&&v>=40&&moving&&!flip)did.fast=1;
   hist.push([t,emf]);while(hist.length&&hist[0][0]<t-6)hist.shift();
   drawA();$('#f5N-v').textContent=N;$('#f5v-v').textContent=v+' cm/s';
   $('#f5p').textContent=sci(ph,3)+' Wb';$('#f5e').textContent=eng(emf,'V');$('#f5i').textContent=eng(chG()*i,'A');chOut(el,'f5ch',[['phi',ph*1e3],['E',emf*1e3],['i',chG()*i*1e3]]);
   const ch=$('#f5chip');if(!moving){ch.className='mg-chip';ch.textContent='لا تغير في الفيض ⇐ لا تيار'}else{ch.className='mg-chip '+(dp*(flip?-1:1)>0?'hot':'ld');ch.textContent=(flip?(dp<0?'S يقترب':'S يبتعد'):(dp>0?'N يقترب':'N يبتعد'))+' ⇐ وجه الحلقة '+(dp>0?'N':'S')+' يعاكس التغير'}
   const ym=nice(Math.max(1e-6,...hist.map(p=>Math.abs(p[1])))*1.1);plot(hist,'#f5plot','E (V)',ym);
   // panel B
   const tgt=sw?TP2.v.I1:0,dI=(tgt-I1)/TP2.v.tau;I1+=dI*dt;if(Math.abs(I1-tgt)<1e-6)I1=tgt;const e2=-TP2.v.M*dI;emf2=e2;const i2=e2/TP2.v.R2,g2=clamp(-i2*1000/TP2.v.G2*50,-58,58);
   if(did2.open&&!sw&&g2<-8)did2.kickOpen=1;
   $('#f5b').innerHTML=ringSVG({on:sw&&I1>1e-4||I1>1e-3,g:g2});$('#f5I1').textContent=eng(I1,'A');$('#f5e2').textContent=eng(e2,'V');$('#f5i2').textContent=eng(i2,'A');
   $('#f5bn').textContent=Math.abs(dI)<1e-4?(I1>0?'التيار ثابت ⇐ الفيض في الحلقة ثابت ⇐ لا قوة دافعة في الملف الثاني.':'لا تيار ولا تغير.'):(dI>0?'التيار يزداد (لحظة الغلق) ⇐ الفيض يزداد ⇐ قوة دافعة في الملف الثاني.':'التيار يتناقص (لحظة الفتح) ⇐ قوة دافعة في الاتجاه المعاكس.');
   hist2.push([t,e2]);while(hist2.length&&hist2[0][0]<t-6)hist2.shift();const ym2=nice(Math.max(1e-6,TP2.v.M*TP2.v.I1/TP2.v.tau)*1.1);plot(hist2,'#f5plot2','E2 (V)',ym2);
   steps.check()});
 },
 examples:[
  {title:'مثال (٥-١١)',ref:'ص 154',q:'<p>احسب معامل الحث الذاتي لملف حلزوني بداخله هواء طوله <span class="ltr">1.0 m</span> ومساحة مقطعه <span class="ltr">6×10⁻⁴ m²</span> وعدد لفاته 1000 لفة. ثم أوجد معامل حثه الذاتي إذا وضع بداخله قضيب من الحديد معامل نفاذيته النسبية 500، ثم احسب القوة الدافعة الكهربائية الذاتية المتولدة فيه إذا تغير التيار الأصلي المار فيه بمعدل 15 أمبير/ثانية.</p>',
   given:[{id:'l',label:'الطول',sym:'\\ell',unit:'m',value:1},{id:'A',label:'المساحة (× 10⁻⁴)',sym:'A',unit:'m²',value:6},{id:'N',label:'عدد اللفات',sym:'N',unit:'',value:1000},{id:'mr',label:'نفاذية الحديد النسبية',sym:'\\mu_r',unit:'',value:500},{id:'r',label:'معدل تغير التيار',sym:'di/dt',unit:'A/s',value:15}],
   solve:g=>{const L0=MU0*g.N*g.N*g.A*1e-4/g.l,L=B.round(g.mr*L0,3);return [{t:'الملف بقلب هوائي (5-19):',f:`L=\\frac{\\mu_0N^2A}{\\ell}=\\frac{4\\pi\\times10^{-7}\\times(${g.N})^2\\times${g.A}\\times10^{-4}}{${g.l}}`,v:sci(L0,3),unit:'H',final:true},
    {t:'وفي حالة لف الملف على قضيب من الحديد:',f:`L=\\frac{\\mu_0\\mu_rN^2A}{\\ell}=${g.mr}\\times${sx(L0,3)}`,v:L,unit:'H',dp:3,final:true},
    {t:'القوة الدافعة الذاتية (5-13):',f:`E=-L\\frac{di}{dt}=-${fm(L)}\\times${g.r}`,v:B.round(-L*g.r,3),unit:'V',dp:3,final:true}]},
   note:'<span class="fixnote">طبع الكتاب الناتج <span class="ltr">5.655 V</span> دون الإشارة السالبة؛ الإشارة تعني أن القوة الدافعة تعاكس تغير التيار (قانون لنز).</span>'},
  {title:'مثال (٥-١٢)',ref:'ص 154–155',q:`<p>ملف حلزوني طوله <span class="ltr">1.0 m</span> ومساحة مقطعه <span class="ltr">6×10⁻⁴ m²</span> وعدد لفاته N₁ = 1000 لفة، التف حول منتصفه ملف آخر صغير عدد لفاته N₂ = 20 لفة. احسب: 1- الحث المتبادل بين الملفين. 2- قيمة القوة الدافعة الحثية في الدائرة الثانية نتيجة تغير التيار في الدائرة (1) بمقدار 10 أمبير/الثانية.</p>${bfSeg('e512')}`,
   given:[{id:'l',label:'الطول',sym:'\\ell',unit:'m',value:1},{id:'A',label:'المساحة (× 10⁻⁴)',sym:'A',unit:'m²',value:6},{id:'N1',label:'لفات الملف الأول',sym:'N_1',unit:'',value:1000},{id:'N2',label:'لفات الملف الثاني',sym:'N_2',unit:'',value:20},{id:'r',label:'معدل تغير التيار',sym:'dI_1/dt',unit:'A/s',value:10}],
   solve:(g,B,isBook)=>{const bk=isBook&&bfMode('e512')==='book';const M=MU0*g.N2*g.N1*g.A*1e-4/g.l;const Mp=bk?1.507e-5:sig(M,4);const Mu=bk?25.1e-6:Mp;const E=-Mu*g.r;
    return [{t:'كثافة الفيض في الملف (1) في اتجاه محوره، ثم التدفق المار بالمقطع المركزي:',f:`B=\\frac{\\mu_0N_1I}{\\ell}\\qquad \\phi=BA=\\frac{\\mu_0N_1IA}{\\ell}`},
     {t:'ولما كان هذا التدفق يتصل بالملف (2):'+(bk?' <span class="sub">(كما طُبع: 1.507 — الدقيق 1.508)</span>':''),f:`M=\\frac{N_2\\phi}{I}=\\frac{\\mu_0N_2N_1A}{\\ell}=\\frac{4\\pi\\times10^{-7}\\times${g.N2}\\times${g.N1}\\times${g.A}\\times10^{-4}}{${g.l}}`,v:sci(Mp,4),unit:'H',final:true},
     {t:bk?'2. <b>كما في الكتاب:</b> عُوِّض M بالقيمة 25.1 × 10⁻⁶ بدل المحسوبة:':'2. القوة الدافعة الحثية في الدائرة (2) (5-23):',f:`E_2=-M\\frac{dI_1}{dt}=-${bk?'25.1\\times10^{-6}':sx(Mp,4)}\\times${g.r}`,v:fm(sig(E*1e6,3)),unit:'μV',final:true}]},
   note:'<span class="fixnote"><b>ملاحظة على الكتاب:</b> طبع الكتاب <span class="ltr">E₂ = −25.1×10⁻⁶ × 10 = −251 μV</span>، والصحيح باستعمال M المحسوبة <span class="ltr">−1.508×10⁻⁵ × 10 ≈ −151 μV</span>. وفي الكتاب سطران مكرران (L = 0.377 H) منسوخان من المثال السابق — حذفناهما.</span>'},
  {title:'تمرين 1 — إجابة مقترحة (ليست من الكتاب)',ref:'ص 156',q:'<p>يمر تيار شدته 2 A في سلك طويل مستقيم موضوع في الهواء. احسب كثافة الفيض المغناطيسي الناتج وشدة المجال عند نقطة تبعد 8 cm عن السلك.</p>',
   given:[{id:'I',label:'التيار',sym:'I',unit:'A',value:2},{id:'a',label:'البعد',sym:'a',unit:'cm',value:8}],
   solve:g=>{const b=MU0*g.I/(2*PI*g.a/100),h=g.I/(2*PI*g.a/100);return [{t:'(5-7):',f:`B=\\frac{\\mu_0I}{2\\pi a}=\\frac{4\\pi\\times10^{-7}\\times${g.I}}{2\\pi\\times${g.a/100}}`,v:sci(b,3),unit:'T',final:true},{t:'(5-8):',f:`H=\\frac{I}{2\\pi a}`,v:B.round(h,2),unit:'A/m',dp:2,final:true}]}},
  {title:'تمرين 2 — إجابة مقترحة (ليست من الكتاب)',ref:'ص 156',q:'<p>يمر تيار شدته 4 A في سلك مستقيم طوله 10 cm. احسب القوة الميكانيكية على السلك إذا وضع عمودياً على مجال كثافة فيضه 0.06 T. كم تصبح إذا كانت الزاوية 40°؟</p>',
   given:[{id:'I',label:'التيار',sym:'I',unit:'A',value:4},{id:'l',label:'الطول',sym:'\\ell',unit:'cm',value:10},{id:'B',label:'كثافة الفيض',sym:'B',unit:'T',value:0.06},{id:'t',label:'الزاوية الثانية',sym:'\\theta',unit:'°',value:40}],
   solve:g=>{const F=g.B*g.l/100*g.I;return [{t:'(5-9) عند 90°:',f:`F=B\\ell I=${g.B}\\times${g.l/100}\\times${g.I}`,v:sig(F,4),unit:'N',final:true},{t:`عند ${g.t}°:`,f:`F=${fm(sig(F,4))}\\times\\sin${g.t}^\\circ`,v:sig(F*Math.sin(g.t*D),3),unit:'N',final:true}]}},
  {title:'تمرين 3 — إجابة مقترحة (ليست من الكتاب)',ref:'ص 156',q:'<p>سلك طوله 0.5 m يحمل 8 A في مجال كثافة فيضه 0.40 T. ما القوة عليه إذا كانت الزاوية بين السلك والمجال 15°؟</p>',
   given:[{id:'l',label:'الطول',sym:'\\ell',unit:'m',value:0.5},{id:'I',label:'التيار',sym:'I',unit:'A',value:8},{id:'B',label:'كثافة الفيض',sym:'B',unit:'T',value:0.4},{id:'t',label:'الزاوية',sym:'\\theta',unit:'°',value:15}],
   solve:g=>[{t:'(5-9):',f:`F=B\\ell I\\sin\\theta=${g.B}\\times${g.l}\\times${g.I}\\times\\sin${g.t}^\\circ`,v:sig(g.B*g.l*g.I*Math.sin(g.t*D),3),unit:'N',final:true}]},
  {title:'تمرين 4 — إجابة مقترحة (ليست من الكتاب)',ref:'ص 156',q:'<p>سلكان طويلان متوازيان يبعدان 8 cm يمر فيهما تياران في اتجاه واحد 2 A و 4 A. احسب القوة بينهما. هل هي تجاذبية أم تنافرية؟</p>',
   given:[{id:'a',label:'المسافة',sym:'a',unit:'cm',value:8},{id:'I1',label:'التيار الأول',sym:'I_1',unit:'A',value:2},{id:'I2',label:'التيار الثاني',sym:'I_2',unit:'A',value:4}],
   solve:g=>[{t:'(5-12) القوة لكل متر:',f:`\\frac{F}{\\ell}=\\frac{\\mu_0I_1I_2}{2\\pi a}=\\frac{4\\pi\\times10^{-7}\\times${g.I1}\\times${g.I2}}{2\\pi\\times${g.a/100}}`,v:sci(MU0*g.I1*g.I2/(2*PI*g.a/100),3),unit:'N/m',final:true},{t:'التياران في اتجاه واحد ⇐ القوة <b>تجاذبية</b>.'}]},
  {title:'تمرين 5 — إجابة مقترحة (ليست من الكتاب)',ref:'ص 156',q:'<p>احسب الحثية الذاتية لملف عدد لفاته 200، طوله 8 cm، ذي قلب حديدي نفاذيته النسبية 5000 وقطره 3.0 mm.</p>',
   given:[{id:'N',label:'عدد اللفات',sym:'N',unit:'',value:200},{id:'l',label:'الطول',sym:'\\ell',unit:'cm',value:8},{id:'mr',label:'النفاذية النسبية',sym:'\\mu_r',unit:'',value:5000},{id:'d',label:'القطر',sym:'d',unit:'mm',value:3}],
   solve:g=>{const L=MU0*g.mr*g.N*g.N*PI*Math.pow(g.d/1000,2)/(4*g.l/100);return [{t:'كما في مثال (٥-٩):',f:`L=\\frac{\\mu_0\\mu_rN^2\\pi d^2}{4\\ell}=\\frac{4\\pi\\times10^{-7}\\times${g.mr}\\times${g.N}^2\\times\\pi(${g.d}\\times10^{-3})^2}{4\\times${g.l/100}}`,v:sig(L,3),unit:'H',final:true}]}},
  {title:'تمرين 6 — إجابة مقترحة (ليست من الكتاب)',ref:'ص 156',q:'<p>احسب القوة الدافعة الكهربائية المستحثة في ملف عدد لفاته 100 إذا وضعناه في مجال مغناطيسي يتغير فيضه … <span class="sub">(نص السؤال في الكتاب ناقص: لم يُذكر معدل تغير الفيض. اكتب المعدل الذي يحدده المدرب؛ القيمة 0.05 Wb/s افتراضية للتوضيح فقط.)</span></p>',
   given:[{id:'N',label:'عدد اللفات',sym:'N',unit:'',value:100},{id:'r',label:'معدل تغير الفيض (افتراضي)',sym:'d\\Phi/dt',unit:'Wb/s',value:0.05}],
   solve:g=>[{t:'قانون فارادي (5-45):',f:`E=-N\\frac{d\\Phi}{dt}=-${g.N}\\times${g.r}`,v:sig(-g.N*g.r,4),unit:'V',final:true}]}
 ],
 quiz:[
  {q:'عند تثبيت المغناطيس بجوار الحلقة (دون حركة) فإن مؤشر الجلفانومتر:',o:['ينحرف لأقصى قيمة','يعود إلى الصفر','يتذبذب','ينحرف ببطء'],c:1,e:'ص 152: لا تغير في الفيض ⇐ لا تيار.'},
  {q:'تتناسب القوة الدافعة الحثية طردياً مع:',o:['قيمة الفيض','معدل تغير الفيض مع الزمن','مقاومة الدائرة','مساحة السلك'],c:1,e:'ص 153: E = −dΦ/dt.'},
  {q:'ملف 50 لفة يتغير الفيض فيه بمعدل 0.02 Wb/s. مقدار القوة الدافعة:',o:['1 V','0.4 V','2.5 V','0.001 V'],c:0,e:'(5-45): 50 × 0.02 = 1 V.'},
  {q:'أي مما يلي لا يغير الفيض المار في حلقة؟',o:['تغيير المجال','تغيير مساحة الحلقة','تغيير الزاوية بين المساحة والمجال','تحريك الحلقة داخل مجال منتظم دون تغيير زاويتها'],c:3,e:'ص 153: طرق تغيير الفيض هي تغيير المجال أو المساحة أو الزاوية.'},
  {q:'الإشارة السالبة في قانون فارادي تدل على:',o:['أن القوة الدافعة صغيرة','اتجاه التيار الحثي حسب قانون لنز','أن الفيض سالب','أن التيار متردد'],c:1,e:'ص 153.'},
  {q:'عند تقريب القطب الشمالي لمغناطيس من حلقة، يصبح وجه الحلقة المقابل له:',o:['قطباً جنوبياً فيجذبه','قطباً شمالياً فيتنافر معه','بلا قطبية','قطباً شمالياً فيجذبه'],c:1,e:'قانون لنز: التيار الحثي يعاكس التغير الذي أنشأه.'},
  {q:'في الشكل (٥-٢٢) يمر تيار في الدائرة الثانوية:',o:['طوال غلق المفتاح','لحظة الغلق ولحظة الفتح فقط','عند الفتح فقط','لا يمر أبداً'],c:1,e:'ص 152: التيار يتغير فقط عند الفتح والإغلاق.'},
  {q:'حث متبادل M = 0.02 H وتيار الملف الأول يتغير بمعدل 50 A/s. مقدار القوة الدافعة في الملف الثاني:',o:['1 V','2500 V','0.0004 V','0.04 V'],c:0,e:'(5-23): 0.02 × 50 = 1 V.'}
 ]
});
})(PLCBOOK);
