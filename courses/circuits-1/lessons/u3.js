/* دوائر كهربائية-1 — Unit 3 (part A) — مبادئ ودوائر التيار المستمر (ص 43–71)
   Lessons u3-l1 … u3-l6 (source: c1_b.md). Lessons u3-l7 … are in u3b.js. B.unit is called in course.js. */
(function(B){
const {S}=B;
const fm=(x,d)=>B.fmtN(x,d);
const fx=v=>(+v).toFixed(1);
const lt=s=>`<span class="ltr">${s}</span>`;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const near=(a,b,t)=>Math.abs(a-b)<=(t==null?1e-6:t);
const SUPD={'-':'⁻','0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'};
const sup=n=>String(n).replace(/[-0-9]/g,c=>SUPD[c]);
/* "5.128 × 10⁻⁴" (plain text, d = decimals of the mantissa) */
function sciT(x,d){if(!isFinite(x))return '∞';if(x===0)return '0';d=d==null?3:d;let e=Math.floor(Math.log10(Math.abs(x)));let m=B.round(x/Math.pow(10,e),d);if(Math.abs(m)>=10){m=B.round(m/10,d);e++}return e===0?fm(m,null):`${fm(m,null)} × 10${sup(e)}`}
/* LaTeX version: 5.128\\times10^{-4} */
function sciTex(x,d){if(!isFinite(x)||x===0)return String(x);d=d==null?3:d;let e=Math.floor(Math.log10(Math.abs(x)));let m=B.round(x/Math.pow(10,e),d);if(Math.abs(m)>=10){m=B.round(m/10,d);e++}return e===0?fm(m,null):`${fm(m,null)}\\times10^{${e}}`}
/* engineering prefix: 0.00438 → "4.38 m" */
function eng(x,unit,sig){unit=unit||'';if(!isFinite(x))return '∞ '+unit;if(x===0)return '0 '+unit;const a=Math.abs(x);sig=sig||4;
  const P=[[1e9,'G'],[1e6,'M'],[1e3,'k'],[1,''],[1e-3,'m'],[1e-6,'µ'],[1e-9,'n']];
  for(const [f,p] of P){if(a>=f*0.99995){const v=x/f;return `${fm(+v.toPrecision(sig),null)} ${p}${unit}`}}return sciT(x,2)+' '+unit}

/* ---------- styles used only by this file (CSS variables only) ---------- */
(function css(){if(typeof document==='undefined'||document.getElementById('c1u3a-css'))return;const s=document.createElement('style');s.id='c1u3a-css';s.textContent=`
.c3-sl{display:flex;flex-direction:column;gap:2px;font-size:13.5px;margin-top:10px;min-width:0}
.c3-sl .c3-h{display:flex;justify-content:space-between;gap:8px;align-items:baseline}
.c3-sl b{font-family:var(--mono);direction:ltr;unicode-bidi:isolate;color:var(--blue-ink);font-size:14px}
.c3-sl input[type=range]{width:100%;accent-color:var(--blue);direction:ltr;margin:4px 0}
.c3-row{display:flex;gap:10px;flex-wrap:wrap;margin-top:10px;align-items:center}
.c3-row .sub{margin:0}
.c3-lab .seg{flex-wrap:wrap;max-width:100%}
.c3-lab .seg button{white-space:nowrap}
.c3-chip{display:inline-block;padding:2px 10px;border-radius:999px;font-size:12.5px;font-weight:700;background:var(--surface-2);color:var(--muted)}
.c3-chip.ok{background:var(--on-soft);color:var(--on)}
.c3-chip.warn{background:var(--stop-soft);color:var(--stop)}
.c3-chip.hot{background:var(--live-soft);color:var(--live)}
.c3-tbl{overflow-x:auto}
.c3-tbl table.tt td,.c3-tbl table.tt th{padding:6px 6px}
.c3-rec{width:100%;border-collapse:collapse;font-size:13.5px;margin-top:8px}
.c3-rec th,.c3-rec td{border-bottom:1px solid var(--line);padding:5px 6px;text-align:center}
.c3-rec td.l{font-family:var(--mono);direction:ltr}
.c3-eq{background:var(--surface-2);border-radius:10px;padding:8px 12px;margin-top:10px;overflow-x:auto;min-height:44px}
.c3-msg{margin-top:8px;font-size:14px;min-height:22px}
.c3-msg.ok{color:var(--on)}.c3-msg.no{color:var(--stop)}
.c3-list{display:flex;flex-direction:column;gap:6px;margin-top:8px}
.c3-item{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:8px;align-items:center;background:var(--surface-2);border-radius:10px;padding:4px 10px}
.c3-item .c3-sl{margin-top:0}
.c3-item .btn{padding:4px 10px}
.c3-item b.n{font-family:var(--mono);direction:ltr;unicode-bidi:isolate}
.c3-bar{display:flex;height:26px;border-radius:8px;overflow:hidden;margin-top:8px;background:var(--surface-2);direction:ltr}
.c3-bar span{display:flex;align-items:center;justify-content:center;font:600 12px var(--mono);color:#fff;white-space:nowrap;overflow:hidden}
.c3-q{border:1px solid var(--line);border-radius:12px;padding:10px 14px;margin:10px 0;background:var(--surface)}
.c3-q summary{cursor:pointer;font-weight:600}
.c3-figs{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:10px}
.svgbox.c3-wide svg{min-width:560px}
`;document.head.appendChild(s)})();

/* ---------- small lab helpers ---------- */
function loopOn(el,fn){let last=performance.now();const f=now=>{if(!document.body.contains(el))return;const dt=Math.min(0.05,Math.max(0,(now-last)/1000));last=now;try{fn(dt)}catch(e){console.error(e);return}requestAnimationFrame(f)};requestAnimationFrame(f)}
function stepsUI(host,steps){let i=0;
  const draw=()=>{host.innerHTML=steps.map((s,j)=>`<li class="${j<i?'done':j===i?'cur':''}"><span class="k">${j<i?'✓':j+1}</span><div><h4>${s.t}</h4><p>${s.x}</p>${j===i?`<div class="act">${s.done?'<span class="hint">بانتظار تنفيذك…</span> <button class="btn" data-next>تخطَّ</button>':'<button class="btn primary" data-next>التالي</button>'}</div>`:''}</div></li>`).join('')+
    (i>=steps.length?`<li class="cur"><span class="k">✓</span><div><h4>أحسنت، أنهيت التجربة</h4><p style="display:block">جرّب قيماً أخرى، أو أعد التجربة من أولها.</p><div class="act"><button class="btn" data-restart>إعادة التجربة</button></div></div></li>`:'');B.math(host)};
  host.addEventListener('click',e=>{if(e.target.closest('[data-next]')){i++;draw()}if(e.target.closest('[data-restart]')){i=0;draw()}});draw();
  return {check(){const s=steps[i];if(s&&s.done&&s.done()){i++;draw()}},redraw:draw};}
const sl=(id,label,min,max,step,val)=>`<label class="c3-sl"><span class="c3-h"><span>${label}</span><b id="${id}-v"></b></span><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}" aria-label="${label.replace(/<[^>]+>/g,'')}"></label>`;
const segHTML=(attr,items,cur)=>`<div class="seg" role="group">${items.map(([v,l])=>`<button data-${attr}="${v}" aria-pressed="${String(v)===String(cur)}">${l}</button>`).join('')}</div>`;
const segSet=(el,attr,v)=>el.querySelectorAll(`[data-${attr}]`).forEach(b=>b.setAttribute('aria-pressed',String(String(b.dataset[attr])===String(v))));
const segBind=(el,attr,fn)=>el.querySelectorAll(`[data-${attr}]`).forEach(b=>b.addEventListener('click',()=>{segSet(el,attr,b.dataset[attr]);fn(b.dataset[attr])}));
const swHTML=(id,b,label,on)=>`<button class="sw" id="${id}" aria-pressed="${on?'true':'false'}"><span class="knob"></span><b>${b}</b><small>${label}</small></button>`;
const fact=(l,id)=>`<div class="fact"><span>${l}</span><b id="${id}">—</b></div>`;
const arT=(x,y,s,o)=>{o=o||{};return `<text class="txt ar" x="${x}" y="${y}" text-anchor="${o.a||'middle'}"${o.fs?` font-size="${o.fs}"`:''}${o.col?` style="fill:var(${o.col})"`:''}>${s}</text>`};
const box=(svg,max,wide)=>`<div class="svgbox${wide?' c3-wide':''}" style="margin-inline:auto;${max?`max-width:${max}px`:''}">${svg}</div>`;
const tryNote=s=>`<p class="sub">${s}</p>`;
/* set a range slider readout */
const setV=(el,id,txt)=>{const b=el.querySelector('#'+id+'-v');if(b)b.textContent=txt};
function arrow(x1,y1,x2,y2,col,w){w=w||2.4;const a=Math.atan2(y2-y1,x2-x1),L=Math.hypot(x2-x1,y2-y1);if(L<3)return '';const h=Math.min(11,L*0.7)+w;
  const bx=x2-h*Math.cos(a),by=y2-h*Math.sin(a),px=-Math.sin(a)*h*0.45,py=Math.cos(a)*h*0.45;
  return `<path d="M${fx(x1)} ${fx(y1)}L${fx(bx)} ${fx(by)}" stroke="var(${col})" stroke-width="${w}" fill="none" stroke-linecap="round"/><path d="M${fx(x2)} ${fx(y2)}L${fx(bx+px)} ${fx(by+py)}L${fx(bx-px)} ${fx(by-py)}Z" fill="var(${col})"/>`}
/* simple SVG x-y plot. o:{w,h,x0,x1,y0,y1,xt,yt,xl,yl,series:[{pts,col,w,dash}],extra(X,Y)} */
function plotSVG(o){const W=o.w||520,H=o.h||260,L=o.left||46,R=14,T=14,Bm=38;
  const X=x=>L+(x-o.x0)/(o.x1-o.x0)*(W-L-R),Y=y=>H-Bm-(y-o.y0)/(o.y1-o.y0)*(H-T-Bm);
  let s='';(o.yt||[]).forEach(v=>{s+=`<path d="M${L} ${fx(Y(v))}H${W-R}" stroke="var(--line)"/>`+S.t(L-6,fx(Y(v)+4),o.yf?o.yf(v):v,'m','end')});
  (o.xt||[]).forEach(v=>{s+=`<path d="M${fx(X(v))} ${T}V${H-Bm}" stroke="var(--line)" stroke-dasharray="3 3"/>`+S.t(fx(X(v)),H-Bm+15,o.xf?o.xf(v):v,'m')});
  s+=`<path d="M${L} ${T}V${H-Bm}H${W-R}" stroke="var(--fg)" fill="none" stroke-width="1.4"/>`;
  if(o.y0<0&&o.y1>0)s+=`<path d="M${L} ${fx(Y(0))}H${W-R}" stroke="var(--fg)" stroke-width="1"/>`;
  if(o.x0<0&&o.x1>0)s+=`<path d="M${fx(X(0))} ${T}V${H-Bm}" stroke="var(--fg)" stroke-width="1"/>`;
  if(o.xl)s+=S.t(W-R,H-4,o.xl,'','end');if(o.yl)s+=S.t(L+4,T+10,o.yl,'','start');
  if(o.under)s+=o.under(X,Y);
  (o.series||[]).forEach(se=>{if(!se.pts.length)return;s+=`<path d="${se.pts.map((p,i)=>(i?'L':'M')+fx(X(p[0]))+' '+fx(Y(clamp(p[1],o.y0-1e6,o.y1+1e6)))).join('')}" fill="none" stroke="var(${se.col})" stroke-width="${se.w||2.4}" ${se.dash?`stroke-dasharray="${se.dash}"`:''} stroke-linejoin="round"/>`});
  if(o.extra)s+=o.extra(X,Y);
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${o.aria||'منحنى'}">${s}</svg>`}
const niceMax=v=>{const t=Math.max(v,1e-9),e=Math.pow(10,Math.floor(Math.log10(t)));return [1,2,2.5,5,10].map(k=>k*e).find(x=>x>=t-1e-12)};
const ticks=(m,n)=>{n=n||5;const r=[];for(let i=0;i<=n;i++)r.push(+(m*i/n).toPrecision(6));return r};

/* ---------- circuit drawing ---------- */
/* zig-zag resistor path between A and B */
function zigD(A,Bp,n){n=n||6;const dx=Bp[0]-A[0],dy=Bp[1]-A[1],len=Math.hypot(dx,dy),ux=dx/len,uy=dy/len,nx=-uy,ny=ux,lead=len*0.08,seg=(len-2*lead)/n;let p=`M${fx(A[0])} ${fx(A[1])}L${fx(A[0]+ux*lead)} ${fx(A[1]+uy*lead)}`;
  for(let i=0;i<n;i++){const s=(i%2?-1:1)*7,m=lead+seg*(i+0.5);p+=`L${fx(A[0]+ux*m+nx*s)} ${fx(A[1]+uy*m+ny*s)}`}
  return p+`L${fx(Bp[0]-ux*lead)} ${fx(Bp[1]-uy*lead)}L${fx(Bp[0])} ${fx(Bp[1])}`}
const pth=(pts)=>pts.map((p,i)=>(i?'L':'M')+fx(p[0])+' '+fx(p[1])).join('');
/* one edge P→Q with an element e:{k:'R'|'E'|'W',lab:[lines],plus:'f'|'t' (battery + / resistor + terminal),side,signs}
   flow: +1 current P→Q, −1 Q→P, 0 none ; hl: css var for highlight */
function edgeSVG(P,Q,e,o){o=o||{};const dx=Q[0]-P[0],dy=Q[1]-P[1],L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L,nx=-uy,ny=ux;const mx=(P[0]+Q[0])/2,my=(P[1]+Q[1])/2;
  const cx=o.cx==null?mx:o.cx,cy=o.cy==null?my:o.cy;const side=e.side||(((mx-cx)*nx+(my-cy)*ny)>=0?1:-1);
  const k=e.k||'W';const hw=k==='R'?Math.min(e.len||28,L*0.36):k==='E'?5:0;
  const A=[mx-ux*hw,my-uy*hw],Bq=[mx+ux*hw,my+uy*hw];
  const fl=o.flow||0;const wc=fl?'w flow':'w';const st=o.hl?` style="stroke:var(${o.hl});stroke-width:3.6"`:'';
  const seg=(p,q)=>`<path class="${wc}"${st} d="${fl<0?pth([q,p]):pth([p,q])}"/>`;
  let s='';
  if(k==='W'){s+=seg(P,Q)}
  else{s+=seg(P,A)+seg(Bq,Q);
    if(k==='R'){s+=`<path class="w${fl?' live':''}" d="${fl<0?zigD(Bq,A):zigD(A,Bq)}"${o.hl?` style="stroke:var(${o.hl});stroke-width:3.4"`:fl?'':' style="stroke:var(--fg)"'}/>`}
    else{const plusQ=e.plus==='t';const pa=[mx-ux*4,my-uy*4],pb=[mx+ux*4,my+uy*4];const lg=17,sh=9;
      const plate=(p,lng)=>`<path d="M${fx(p[0]-nx*(lng?lg:sh))} ${fx(p[1]-ny*(lng?lg:sh))}L${fx(p[0]+nx*(lng?lg:sh))} ${fx(p[1]+ny*(lng?lg:sh))}" stroke="var(${o.hl||'--fg'})" stroke-width="${lng?2.2:4.4}"/>`;
      s+=plate(pa,!plusQ)+plate(pb,plusQ);
      if(e.signs!==false){const sp=plusQ?pb:pa,sm=plusQ?pa:pb,off=-side*26;const dir=plusQ?1:-1;
        s+=S.t(fx(sp[0]+ux*dir*8+nx*off),fx(sp[1]+uy*dir*8+ny*off+4),'+','',null,13)+S.t(fx(sm[0]-ux*dir*8+nx*off),fx(sm[1]-uy*dir*8+ny*off+4),'−','',null,13)}}
    if(k==='R'&&e.plus){const pf=e.plus==='f';const off=side*16;const a1=[mx-ux*(hw+6)+nx*off,my-uy*(hw+6)+ny*off],a2=[mx+ux*(hw+6)+nx*off,my+uy*(hw+6)+ny*off];
      s+=S.t(fx(a1[0]),fx(a1[1]+4),pf?'+':'−','b',null,13)+S.t(fx(a2[0]),fx(a2[1]+4),pf?'−':'+','b',null,13)}}
  const lab=e.lab?(Array.isArray(e.lab)?e.lab:[e.lab]):[];
  if(lab.length){const off=(k==='E'?26:k==='R'?(e.plus?30:20):14)*side;const tx=mx+nx*off,ty=my+ny*off;const vert=Math.abs(nx)>0.5;
    const anc=vert?((nx*side)>0?'start':'end'):'middle';const up=!vert&&(ny*side)<0;
    lab.forEach((t,i)=>{const yy=vert?ty+4+(i-(lab.length-1)/2)*15:(up?ty-(lab.length-1-i)*15:ty+10+i*15);s+=S.t(fx(tx),fx(yy),t,i?'b':'',anc)})}
  return s}
/* generic circuit: sp={w,h,nodes:{id:[x,y]},edges:[{f,t,k,lab,plus,side}],arrows:[{e,at,dir,lab,side}],labels:{id:'a'},ground:id,dots:[id]}
   o={flow:[...per edge], hl:{i:'--blue'}, extra:svg} */
function circ(sp,o){o=o||{};const N=sp.nodes;const xs=Object.values(N).map(p=>p[0]),ys=Object.values(N).map(p=>p[1]);const cx=(Math.min(...xs)+Math.max(...xs))/2,cy=(Math.min(...ys)+Math.max(...ys))/2;
  let s=`<svg viewBox="${sp.vb||`0 0 ${sp.w} ${sp.h}`}" role="img" aria-label="${sp.aria||'دائرة كهربائية'}">`;
  sp.edges.forEach((e,i)=>{s+=edgeSVG(N[e.f],N[e.t],e,{cx,cy,flow:o.flow?o.flow[i]:0,hl:o.hl&&o.hl[i]})});
  (sp.arrows||[]).forEach(a=>{const e=sp.edges[a.e],P=N[e.f],Q=N[e.t];const at=a.at==null?0.2:a.at;const x=P[0]+(Q[0]-P[0])*at,y=P[1]+(Q[1]-P[1])*at;const L=Math.hypot(Q[0]-P[0],Q[1]-P[1]),ux=(Q[0]-P[0])/L*(a.dir||1),uy=(Q[1]-P[1])/L*(a.dir||1);
    s+=arrow(x-ux*12,y-uy*12,x+ux*12,y+uy*12,'--blue',2.4);if(a.lab){const nx=-uy,ny=ux;const sd=a.side||1;const vert=Math.abs(ux)<0.5;s+=S.t(fx(x+nx*16*sd+(vert?0:0)),fx(y+ny*16*sd+4),a.lab,'b',vert?((nx*sd)>0?'start':'end'):'middle')}});
  Object.entries(sp.labels||{}).forEach(([id,t])=>{const p=N[id];const dx=p[0]-cx,dy=p[1]-cy,m=Math.hypot(dx,dy)||1;s+=`<circle cx="${p[0]}" cy="${p[1]}" r="3.4" fill="var(--fg)"/>`+S.t(fx(p[0]+dx/m*16),fx(p[1]+dy/m*16+4),t,'b')});
  (sp.dots||[]).forEach(id=>{const p=N[id];s+=`<circle cx="${p[0]}" cy="${p[1]}" r="3.4" fill="var(--fg)"/>`});
  if(sp.ground){const p=N[sp.ground];s+=`<path d="M${p[0]} ${p[1]}V${p[1]+14}M${p[0]-14} ${p[1]+14}H${p[0]+14}M${p[0]-9} ${p[1]+19}H${p[0]+9}M${p[0]-4} ${p[1]+24}H${p[0]+4}" stroke="var(--fg)" stroke-width="2"/>`}
  if(o.extra)s+=o.extra;if(sp.extra)s+=sp.extra;
  return s+'</svg>'}
/* rectangular loop: sides in clockwise order: top L→R, right T→B, bottom R→L, left B→T. each side = list of elements */
function loopSpec(o){const x0=o.x0,y0=o.y0,x1=o.x1,y1=o.y1;const nodes={tl:[x0,y0],tr:[x1,y0],br:[x1,y1],bl:[x0,y1]};const edges=[],map={};
  const side=(nm,a,b,els)=>{els=els&&els.length?els:[{k:'W'}];map[nm]=[];const A=nodes[a],Bq=nodes[b];let prev=a;
    els.forEach((e,j)=>{let nxt=b;if(j<els.length-1){nxt=nm+(j+1);const f=(j+1)/els.length;nodes[nxt]=[A[0]+(Bq[0]-A[0])*f,A[1]+(Bq[1]-A[1])*f]}map[nm].push(edges.length);edges.push(Object.assign({f:prev,t:nxt},e));prev=nxt})};
  side('top','tl','tr',o.top);side('right','tr','br',o.right);side('bottom','br','bl',o.bottom);side('left','bl','tl',o.left);
  const arrows=(o.arrows||[]).map(a=>Object.assign({},a,{e:map[a.s][a.i||0]}));
  return {w:o.w,h:o.h,vb:o.vb,nodes,edges,arrows,labels:o.labels,ground:o.ground,dots:o.dots,map,aria:o.aria,extra:o.extra}}
/* a meter (A / V) drawn on top of a wire */
const meterSVG=(x,y,l,val)=>`<circle cx="${x}" cy="${y}" r="17" fill="var(--surface)" stroke="var(--fg)" stroke-width="2"/>`+S.t(x,y+5,l,'',null,15)+(val!=null?S.t(x,y+34,val,'b'):'');
const lampSVG=(x,y,b)=>{b=clamp(b||0,0,1);return `<circle cx="${x}" cy="${y}" r="${fx(16+10*b)}" fill="#ffd54a" opacity="${fx(0.55*b)}"/><circle cx="${x}" cy="${y}" r="14" fill="${b>0.02?'#ffe58a':'var(--surface)'}" stroke="var(--fg)" stroke-width="2"/><path d="M${x-9} ${y-9}L${x+9} ${y+9}M${x+9} ${y-9}L${x-9} ${y+9}" stroke="var(--fg)" stroke-width="1.8"/>`};
/* point along a polyline at fraction s (0..1) */
function polyLen(P){let L=0;for(let i=1;i<P.length;i++)L+=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);return L}
function polyAt(P,s){const L=polyLen(P);let d=((s%1)+1)%1*L;for(let i=1;i<P.length;i++){const l=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);if(d<=l||i===P.length-1){const f=l?d/l:0;return [P[i-1][0]+(P[i][0]-P[i-1][0])*f,P[i-1][1]+(P[i][1]-P[i-1][1])*f,Math.atan2(P[i][1]-P[i-1][1],P[i][0]-P[i-1][0])]}d-=l}return [P[0][0],P[0][1],0]}
const elec=(x,y,r)=>`<circle cx="${fx(x)}" cy="${fx(y)}" r="${r||6}" fill="var(--blue-soft)" stroke="var(--blue)" stroke-width="1.4"/><path d="M${fx(x-3)} ${fx(y)}H${fx(x+3)}" stroke="var(--blue-ink)" stroke-width="1.8"/>`;
/* book-notes block */
const notesBlock=items=>({err:`<b>أخطاء طباعية صُحّحت في هذا الدرس:</b><ol>${items.map(x=>`<li>${x}</li>`).join('')}</ol>`});
const ADD='<b>توضيح للمتدرب — ليس من الكتاب:</b> ';

/* ======================================================================
   Lesson 1 — unit cover/objectives, electric current, current density, charge (ص 43–48)
   ====================================================================== */
const E_CH=1.602e-19;   // شحنة الإلكترون (C) — ثابت فيزيائي، ليس من الكتاب
/* الشكل (3-1): (أ) الناقل وحده (ب) مع مصباح ومقياس أمبير */
function frame31(ox,withLoad){const P=[[ox+210,205],[ox+210,178],[ox+272,178],[ox+272,40],[ox+28,40],[ox+28,178],[ox+90,178],[ox+90,205]];
  let s=`<path d="${pth(P)}" fill="none" stroke="var(--fg)" stroke-width="13" stroke-linejoin="miter"/><path d="${pth(P)}" fill="none" stroke="var(--surface)" stroke-width="8.6" stroke-linejoin="miter"/>`;
  s+=`<rect x="${ox+60}" y="205" width="180" height="48" rx="6" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.8"/><rect x="${ox+82}" y="198" width="16" height="9" fill="var(--fg)"/><rect x="${ox+202}" y="198" width="16" height="9" fill="var(--fg)"/>`;
  s+=S.t(ox+90,232,'+','',null,18)+S.t(ox+210,232,'−','',null,18);
  [0.06,0.2,0.34,0.5,0.64,0.8,0.94].forEach(f=>{const [x,y,a]=polyAt(P,f);if(withLoad&&((f>0.3&&f<0.36)||(f>0.47&&f<0.53)))return;s+=elec(x,y,5.4);s+=arrow(x+Math.cos(a)*9,y+Math.sin(a)*9,x+Math.cos(a)*24,y+Math.sin(a)*24,'--blue',1.6)});
  if(withLoad){s+=lampSVG(ox+110,40,0)+meterSVG(ox+200,40,'A');s+=`<path d="M${ox+200} 40L${ox+209} 31" stroke="var(--stop)" stroke-width="2"/>`;s+=S.t(ox+110,18,'2','b')+S.t(ox+200,14,'3','b')}
  s+=S.t(ox+150,270,'1','b');
  return s}
function fig31SVG(){return `<svg viewBox="0 0 640 300" role="img" aria-label="التيار الكهربائي: خلية جافة وناقل">${frame31(10,false)}${frame31(330,true)}${arT(160,294,'(أ)',{fs:14})}${arT(480,294,'(ب)',{fs:14})}</svg>`}
/* الشكل (3-2): قطعة سلك منتظم، المجال E لليسار والإلكترونات لليمين */
function fig32SVG(o){o=o||{};const r=o.r||50,cy=130,x0=90,x1=530;const ph=o.ph||0;
  let s=`<svg viewBox="0 0 620 ${cy+r+70}" role="img" aria-label="قطعة من سلك موصل منتظم">`;
  s+=`<path d="M${x0} ${cy-r}H${x1}A18 ${r} 0 0 1 ${x1} ${cy+r}H${x0}" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.8"/><ellipse cx="${x0}" cy="${cy}" rx="18" ry="${r}" fill="var(--live-soft)" stroke="var(--fg)" stroke-width="1.8"/>`;
  s+=S.t(x0,cy+5,'A','',null,15)+S.t(x0-14,cy-r-8,'a','b')+S.t(x1+30,cy+5,'b','b');
  const sa=250,sb=360;[sa,sb].forEach(x=>{s+=`<ellipse cx="${x}" cy="${cy}" rx="18" ry="${r}" fill="none" stroke="var(--muted)" stroke-dasharray="5 4"/>`});
  s+=`<path d="M${sa} ${cy+r+14}V${cy+r+30}M${sb} ${cy+r+14}V${cy+r+30}" stroke="var(--fg)"/>`+arrow(sa+52,cy+r+22,sa+2,cy+r+22,'--fg',1.4)+arrow(sb-52,cy+r+22,sb-2,cy+r+22,'--fg',1.4)+S.t((sa+sb)/2,cy+r+46,'v dt','');
  const rows=[-0.55,0,0.55],cols=[150,205,300,410,470];let k=0;
  rows.forEach((ry,i)=>cols.forEach((cx0,j)=>{const x=x0+30+(((cx0-x0-30)+i*28+ph)%(x1-x0-50));const y=cy+ry*r*0.9;s+=elec(x,y,6);s+=arrow(x+9,y,x+24,y,'--blue',1.5);k++}));
  s+=arrow(380,26,250,26,'--stop',2.4)+S.t(392,30,'I','','start')+arrow(380,52,250,52,'--fg',2.2)+S.t(392,56,'E','','start');
  s+=S.t(x0,cy+r+22,'−','',null,15)+arrow(x1-30,cy+r+22,x1+20,cy+r+22,'--blue',2)+S.t(x1+28,cy+r+26,'v','b','start');
  return s+'</svg>'}

B.lesson({
 id:'u3-l1',unit:3,order:1,pages:'43–48',
 title:'مدخل الوحدة الثالثة: التيار الكهربائي وشدته وكثافته وكمية الكهرباء',
 summary:'أهداف الوحدة، ثم التيار الكهربائي واتجاهه الاصطلاحي (عكس حركة الإلكترونات)، وشدة التيار I = Q/t ووحدتها الأمبير، والعلاقة I = n e v A داخل السلك، وكثافة التيار J = I/A، وكمية الكهرباء Q = I·t.',
 theory:[
  {h:'الوحدة الثالثة: مبادئ ودوائر التيار المستمر',ref:'ص 43–44',html:`<p><b>الهدف العام للوحدة:</b> معرفة القواعد الأساسية للدوائر الكهربائية ذات التيار المستمر وكيفية التعامل مع العناصر الكهربائية والكميات الكهربائية ووحداتها والقوانين التي تحكم الدائرة الكهربائية.</p>
   <p><b>الأهداف التفصيلية:</b></p>
   <ol><li>أن يعرف المتدرب التعريفات الأساسية لعناصر الدائرة الكهربائية للتيار المستمر ووحداتها مثل شدة التيار، وفرق الجهد، والمقاومة وكذلك العلاقات المختلفة مثل قانون أوم وطرق حساب القدرة والطاقة الكهربائية.</li>
   <li>أن يتقن المتدرب حل الدوائر الكهربائية الموصلة على التوالي وتطبيق قانون كيرشوف للجهد وقاعدة توزيع الجهد.</li>
   <li>أن يتقن المتدرب حل الدوائر الكهربائية الموصلة على التوازي وتطبيق قانون كيرشوف للتيار وكذلك قاعدة توزيع التيار.</li>
   <li>أن يتقن المتدرب حساب الكميات الكهربائية المختلفة للدوائر الموصلة على التوالي والتوازي معاً.</li>
   <li>أن يتقن المتدرب حل الدوائر الكهربائية الموصلة على الشكل نجمة أو على الشكل دلتا وإجراء التحويل في الربط من نجمة إلى دلتا أو العكس.</li></ol>
   <p class="sub">الدروس من الأول إلى السادس في هذه الوحدة تغطي الهدفين 1 و2، والتوازي والتوالي-التوازي والنجمة والدلتا في الدروس التالية.</p>`},
  {h:'مبادئ التيار المستمر — مقدمة',ref:'ص 45',html:`<p>تقوم المنظومات الكهربائية بوظيفتين، فإما أن تكون وسيطاً في استغلال الطاقة المتوفرة في الطبيعة بأنواعها المختلفة، وذلك بتحويلها إلى طاقة كهربائية يسهل نقلها وتوزيعها إلى حيث الحاجة، فيعاد تحويلها إلى الشكل الذي يستفاد منه كطاقة حرارية أو ميكانيكية أو غير ذلك. وإما أن تقوم المنظومة الكهربائية بدور الوسيط <b>لنقل المعلومات</b>، وعندئذ تكون الطاقة الكهربائية واسطة نقل معلومات، ويلزم لذلك الحد الأدنى من الطاقة التي تكفي لتحويل المعلومات إلى إشارات كهربائية يمكن أن تنقل إلى أماكن بعيدة، ومن ثم يعاد تحويلها إلى الصيغ التي يستفاد منها لكي تكون إشارات صوتية أو إشارات توجيه أو سيطرة.</p>
   <p>وفي هذا الفصل سيتم شرح التعريفات الأساسية للكميات الكهربائية المستخدمة في دوائر التيار المستمر مثل شدة التيار وفرق الجهد والمقاومة والقدرة والطاقة الكهربائية بالإضافة إلى دراسة العلاقات والقوانين الهامة مثل قانون أوم وطرق حساب القدرة والطاقة الكهربائية والكفاءة.</p>`},
  {h:'شدة التيار الكهربائي (Electric Current)',ref:'ص 45–46',html:`<p>يقصد بالتيار الكهربائي <b>تحرك أو سريان الشحنة الكهربائية</b> في اتجاه ما تحت تأثير قوة المجال الكهربائي. وحيث أن ذرة المادة تتكون من نواة تحتوي على نيوترونات متعادلة الشحنة وبروتونات موجبة الشحنة ويدور في المدار الخارجي للذرة إلكترونات سالبة الشحنة، فإنه يوجد نوعان من الشحنة الكهربائية: شحنة موجبة (شحنة البروتون) وشحنة سالبة (شحنة الإلكترون). وسريان شحنة موجبة في اتجاه ما يكافئ سريان شحنة سالبة متساوية في المقدار ومتضادة في الاتجاه؛ لأن انتقال شحنة سالبة من مكان ما يترك وراءه نقصاً في الشحنة السالبة أي زيادة مساوية في الشحنة الموجبة.</p>
   <p>ولقد <b>اصطُلح على اعتبار اتجاه التيار الكهربائي بأنه اتجاه سريان الشحنة الموجبة</b>، أي إن اتجاه التيار هو <b>عكس اتجاه سريان الإلكترونات الحرة</b>.</p>
   <p>إن التيار الكهربائي المزود من البطاريات (خلايا جافة) هو تيار ثابت. وإذا نظرنا إلى البطارية الجافة المبينة بالشكل (3-1) نجد أن لها طرفين (قطبين): القطب السالب والقطب الموجب. فإذا وصلنا ناقلاً سلكياً بين القطبين نجد أن الشحنات السالبة سوف تتحرك <b>من القطب السالب إلى القطب الموجب</b> باستمرار، وهي عكس اتجاه التيار الكهربائي. فإذا وضعنا مصباحاً كهربائياً بين طرفي الناقل كما في الشكل (3-1ب) نجد أن المصباح يضيء، وهذا دليل على مرور التيار. وإذا وضعنا مقياس الأمبير بين طرفي الناقل فإن المؤشر سوف يتحرك، مما يدل على مرور التيار الكهربائي عبر الناقل.</p>`},
  {fig:'(3-1)',ref:'ص 46',caption:'التيار الكهربائي: (أ) ناقل بين قطبي خلية جافة، (ب) نفس الناقل وعليه مصباح ومقياس أمبير. الدوائر الصغيرة (−) إلكترونات تتحرك من القطب السالب إلى القطب الموجب عبر الناقل. 1- خلية جافة. 2- مصباح. 3- مقياس الأمبير.',draw:()=>box(fig31SVG(),620)},
  {note:ADD+'خارج الخلية تخرج الإلكترونات من القطب السالب (−) وتدخل القطب الموجب (+). أما <b>السهم الذي نرسمه للتيار</b> في الدوائر فيخرج من القطب الموجب ويدخل القطب السالب. الاتجاهان متعاكسان لكنهما يصفان نفس الشيء، وفي كل الدوائر القادمة نستعمل الاتجاه الاصطلاحي (اتجاه الشحنة الموجبة).'},
  {html:`<p>وتعرف <b>شدة التيار الكهربائي</b> المار في موصل عبر مقطع ما بأنها <b>كمية الشحنة الموجبة (أو ما يكافئها من الشحنة السالبة) التي تعبر هذا المقطع في الثانية الواحدة</b>. ويرمز لشدة التيار بالرمز \\(I\\) والشحنة بالرمز \\(Q\\) والزمن بالرمز \\(t\\)، وعليه فإن شدة التيار تعطى بالمعادلة: <span class="ref">ص 46</span></p>
   $$I=\\frac{dQ}{dt}\\quad \\text{Coulomb/second (C/s)}\\qquad (3\\text{-}1)$$
   <p>ووحدة التيار هي <b>الأمبير (Ampere)</b> ويرمز له بالرمز A في النظام العالمي، أي أن: \\(1\\ \\text{Ampere}=1\\ \\text{Coulomb/second}\\).</p>
   <p>وحيث إن <b>التيار المستمر</b> هو تيار ثابت في المقدار والاتجاه (لا يعتمد على الزمن) فإنه يأخذ الصورة: <span class="ref">ص 47</span></p>
   $$I=\\frac{Q}{t}\\quad \\text{Ampere (A)}\\qquad (3\\text{-}2)$$
   <p>ويعبَّر عن التيارات الصغيرة بالملي أمبير <span class="ltr">(mA)</span> ويساوي <span class="ltr">0.001 A</span>، وبالميكرو أمبير <span class="ltr">(µA)</span> ويساوي <span class="ltr">0.000001 A</span>. واتجاه التيار المصطلح هو عكس اتجاه تحرك الشحنات السالبة في الموصلات. وإذا أخذنا اتجاه التيار وعلاقته باتجاه هذه الشحنة فإن المعادلة (3-2) يمكن كتابتها بالصورة التالية:</p>
   $$I=\\frac{dQ}{dt}\\qquad (3\\text{-}2\\text{-}a)$$`},
  {err:'المعادلة <span class="ltr">(3-2-a)</span> ص 47 مطبوعة مطابقة تماماً للمعادلة <span class="ltr">(3-1)</span>، ولا يظهر فيها شيء يعبّر عن «علاقة الاتجاه» المذكورة قبلها. المعنى المقصود: الشحنة المحسوبة هي الشحنة الموجبة المكافئة، فإذا تحركت إلكترونات (شحنة سالبة) في اتجاه كان التيار في الاتجاه المعاكس.'},
  {h:'التيار داخل السلك: I = n e v A',ref:'ص 47',html:`<p>إذا تعرضت قطعة من سلك موصل منتظم، الشكل (3-2)، لمجال كهربائي شدته \\(E\\) ومتجه إلى اليسار فإن الإلكترونات ستتحرك إلى اليمين. فإذا فرضنا أن كل إلكترون يسير بسرعة ثابتة مقدارها \\(v\\) فإنه سيقطع مسافة قدرها \\(v\\,dt\\) في زمن قدره \\(dt\\). وإذا كانت مساحة مقطع السلك \\(A\\) وكانت \\(n\\) عدد الإلكترونات الحرة في وحدة الحجم، فإن عدد الإلكترونات التي تمر من مقطع السلك في الزمن \\(dt\\) يساوي \\(n\\times A\\times v\\times dt\\). فإذا كانت \\(e\\) تمثل شحنة الإلكترون فإن الشحنة الكلية التي تمر في الزمن \\(dt\\) هي:</p>
   $$dq=e\\times n\\times v\\times A\\times dt\\qquad (3\\text{-}3)$$
   $$I=\\frac{dQ}{dt}=n\\times e\\times v\\times A\\qquad (3\\text{-}4)$$`},
  {fig:'(3-2)',ref:'ص 47',caption:'قطعة من سلك موصل منتظم مساحة مقطعه A: المجال E والتيار I إلى اليسار، والإلكترونات تتحرك إلى اليمين بسرعة v فتقطع المسافة v dt بين المقطعين في الزمن dt.',draw:()=>box(fig32SVG(),600)},
  {h:'كثافة التيار',ref:'ص 48',html:`<p>تعرف <b>كثافة التيار</b> \\((J)\\) لموصل ما بأنها خارج قسمة التيار على مساحة مقطع الموصل أي أن:</p>
   $$J=\\frac{I}{A}=n\\times e\\times v\\qquad (3\\text{-}5)$$
   <p>وتحدد المعادلة (3-5) متوسط كثافة التيار في المساحة \\(A\\). فإذا لم يكن التيار موزعاً بانتظام فإنه يمكن اعتبار مرور التيار خلال مساحة متناهية في الصغر مقدارها \\(dA\\) وبذلك يمكن كتابة كثافة التيار بالصيغة التالية:</p>
   $$J=\\frac{dI}{dA}\\qquad (3\\text{-}6)$$
   <p>أي إن كثافة التيار عبارة عن <b>التيار خلال وحدة المساحة العمودية على اتجاه سريان الشحنة</b>.</p>`},
  {note:ADD+'وحدة كثافة التيار هي <span class="ltr">A/m²</span> (أمبير لكل متر مربع)، ويستعمل الفنيون كثيراً <span class="ltr">A/mm²</span>: سلك مساحة مقطعه <span class="ltr">2.5 mm²</span> يمر فيه <span class="ltr">10 A</span> كثافة التيار فيه <span class="ltr">10 / 2.5 = 4 A/mm²</span>. كلما زادت كثافة التيار زادت سخونة السلك.'},
  {h:'كمية الكهرباء (Quantity of Charge)',ref:'ص 48',html:`<p>تعرف كمية الكهرباء على أنها عدد الإلكترونات التي تمر خلال مساحة مقطع مستعرض لموصل في الثانية الواحدة. ويرمز لكمية الكهرباء بالرمز \\(Q\\) ووحدتها <b>الكولوم</b> (وحدة الشحنة الكهربائية)، وبالتالي يمكن الحصول على كمية الكهرباء من التعريف السابق لشدة التيار، أي أن:</p>
   $$Q=I\\times t\\quad \\text{Ampere-second (Coulomb)}\\qquad (3\\text{-}7)$$
   <p>حيث \\(I\\) هي شدة التيار الكهربائي و\\(t\\) هو الزمن. أي إنه يمكن الحصول على كمية كهرباء قدرها <b>1 كولوم</b> عند مرور تيار كهربائي مقداره <b>واحد أمبير</b> لفترة مقدارها <b>ثانية واحدة</b>.</p>`},
  {err:'تعريف كمية الكهرباء ص 48 («عدد الإلكترونات التي تمر … في الثانية الواحدة») يصف <b>شدة التيار</b> لا الشحنة. التعريف الذي تتفق معه المعادلة (3-7): كمية الكهرباء هي <b>الشحنة الكلية</b> التي تمر خلال المقطع في زمن معين \\(t\\)، وتقاس بالكولوم.'},
  {note:ADD+'شحنة الإلكترون الواحد صغيرة جداً: <span class="ltr">e = 1.602 × 10⁻¹⁹ C</span>، لذلك فإن <span class="ltr">1 C</span> تعني مرور نحو <span class="ltr">6.24 × 10¹⁸</span> إلكتروناً. ومثال: تيار <span class="ltr">2 A</span> لمدة دقيقة واحدة ينقل <span class="ltr">Q = 2 × 60 = 120 C</span>.'},
  notesBlock(['في الشكل (3-2) ص 47 كُتب عند سهم سرعة الإلكترونات «V+»، والمقصود السرعة \\(v\\)؛ كُتبت هنا v.'])
 ],
 lab:(el)=>{
  let on=false,I=1,view='both',D=1,count=false,t=0,Q=0,ph=0,wph=0;const did={};
  el.innerHTML=`<div id="c31tp"></div><div class="grid c3-lab">
   <div class="panel c7"><h2>الخلية والمصباح ومقياس الأمبير <small>مبنية على الشكل (3-1ب) ص 46</small></h2>
    <div class="c3-row">${swHTML('c31sw','S','المفتاح',0)}<div><div class="sub">ماذا أعرض؟</div>${segHTML('vw',[['e','حركة الإلكترونات'],['i','اتجاه التيار'],['both','الاثنان']],view)}</div></div>
    ${sl('c31I','شدة التيار I',0,5,0.1,I)}
    <div class="svgbox" id="c31c" style="max-width:560px;margin-inline:auto"></div>
    <p class="sub">الدوائر الزرقاء (−) إلكترونات، والأسهم البرتقالية اتجاه التيار الاصطلاحي. المفتاح S ليس في شكل الكتاب: أضفناه لنفتح الدائرة ونغلقها. سرعة الإلكترونات في الرسم مكبّرة جداً (سرعتها الحقيقية في الأسفل).</p></div>
   <div class="panel c5"><h2>عدّاد الشحنة عند مقطع في السلك <small>المعادلتان (3-2) و(3-7)</small></h2>
    <div class="c3-row"><button class="btn primary" id="c31go">ابدأ العد</button><button class="btn" id="c31rs">صفّر العداد</button></div>
    <div class="facts">${fact('الزمن t','c31t')}${fact('الشحنة المارة Q = I × t','c31q')}${fact('التيار بالملي أمبير','c31ma')}${fact('عدد الإلكترونات المارة Q / e','c31n')}</div>
    <p class="c3-msg" id="c31msg"></p>
    <p class="sub">العدّاد يجمع الشحنة التي تعبر الخط المتقطع في الرسم. قيمة e ثابت فيزيائي (ليس من الكتاب).</p></div>
   <div class="panel c12"><h2>داخل السلك <small>مبنية على الشكل (3-2) ص 47 والمعادلتين (3-4) و(3-5)</small></h2>
    ${sl('c31D','قطر السلك D',0.5,4,0.5,D)}
    <div class="svgbox" id="c31w" style="max-width:640px;margin-inline:auto"></div>
    <div class="facts">${fact('مساحة المقطع A = πD²/4','c31A')}${fact('كثافة التيار J = I / A (3-5)','c31J')}${fact('سرعة الإلكترونات v = I / (n e A) من (3-4)','c31v')}</div>
    <p class="sub" id="c31wn"></p></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="c31st"></ol></div></div>`;
  const $=s=>el.querySelector(s);
  const TP=B.params($('#c31tp'),'u3-l1',[{k:'n28',label:'عدد الإلكترونات الحرة في وحدة الحجم n بوحدة 10²⁸ لكل متر مكعب (النحاس نحو 8.5)',unit:'× 10²⁸ m⁻³',value:8.5,min:0.01,max:100,step:0.1}],()=>{facts();steps.redraw()});
  const Ie=()=>on?I:0;
  const Am2=()=>Math.PI*Math.pow(D*1e-3,2)/4;
  const vd=()=>Ie()/(TP.v.n28*1e28*E_CH*Am2())*1000;   // mm/s
  const P=[[400,206],[400,178],[480,178],[480,40],[60,40],[60,178],[160,178],[160,206]];
  const drawC=()=>{let s=`<svg viewBox="0 0 540 290" role="img" aria-label="دائرة خلية جافة ومصباح ومقياس أمبير">`;
   s+=`<path class="w${on&&I>0?' live':''}" d="${pth(P)}" style="stroke-width:5"/>`;
   s+=`<rect x="120" y="206" width="320" height="52" rx="6" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.8"/><rect x="152" y="198" width="16" height="9" fill="var(--fg)"/><rect x="392" y="198" width="16" height="9" fill="var(--fg)"/>`+S.t(160,236,'+','',null,18)+S.t(400,236,'−','',null,18)+arT(280,240,'خلية جافة',{fs:13});
   // section line for the counter
   s+=`<path d="M44 110H76" stroke="var(--stop)" stroke-width="2.4" stroke-dasharray="4 3"/>`;
   // switch on right edge
   s+=`<rect x="468" y="88" width="24" height="56" fill="var(--surface)"/><circle cx="480" cy="92" r="3.5" fill="var(--fg)"/><circle cx="480" cy="140" r="3.5" fill="var(--fg)"/><path d="M480 140L${on?480:500} 96" stroke="var(--fg)" stroke-width="3" stroke-linecap="round"/>`+S.t(502,124,'S','','start');
   const b=on?I/5:0;s+=lampSVG(200,40,b)+meterSVG(340,40,'A');const na=(-60+120*Math.min(1,Ie()/5))*Math.PI/180;s+=`<path d="M340 52L${fx(340+15*Math.sin(na))} ${fx(52-15*Math.cos(na))}" stroke="var(--stop)" stroke-width="2"/>`+S.t(340,76,fm(Ie(),1)+' A','b');
   s+=S.t(200,16,'2','m')+S.t(340,14,'3','m');
   if(view!=='i'){for(let k=0;k<20;k++){const f=(k/20+ph)%1;const [x,y]=polyAt(P,f);if(Math.hypot(x-200,y-40)<20||Math.hypot(x-340,y-40)<20||(x>466&&x<494&&y>86&&y<146))continue;s+=elec(x,y,5.6)}}
   if(view!=='e'){[0.1,0.3,0.46,0.66,0.86].forEach(f=>{const [x,y,a]=polyAt(P,f);const ux=-Math.cos(a),uy=-Math.sin(a);s+=arrow(x-ux*12,y-uy*12+(Math.abs(uy)<0.5?-12:0)+0,x+ux*12,y+uy*12+(Math.abs(uy)<0.5?-12:0),'--live',2.6)})}
   $('#c31c').innerHTML=s+'</svg>'};
  const drawW=()=>{$('#c31w').innerHTML=fig32SVG({r:16+D*11,ph:wph})};
  const facts=()=>{setV(el,'c31I',fm(I,1)+' A');setV(el,'c31D',fm(D,1)+' mm');
   $('#c31t').textContent=fm(t,1)+' s';$('#c31q').textContent=fm(Q,2)+' C';$('#c31ma').textContent=fm(Ie()*1000,0)+' mA';$('#c31n').textContent=sciT(Q/E_CH,2);
   const Amm=Am2()*1e6;$('#c31A').textContent=fm(Amm,3)+' mm²';$('#c31J').textContent=fm(Ie()/Amm,3)+' A/mm²';$('#c31v').textContent=fm(vd(),4)+' mm/s';
   $('#c31wn').innerHTML=`كثافة التيار بالوحدة الأساسية: <span class="ltr">J = ${sciT(Ie()/Am2(),2)} A/m²</span>. وبسرعة <span class="ltr">${fm(vd(),4)} mm/s</span> يحتاج الإلكترون نحو <span class="ltr">${vd()>0?fm(1000/vd()/60,1):'∞'}</span> دقيقة ليقطع متراً واحداً من السلك.`;
   $('#c31msg').className='c3-msg'+(count?' ok':'');$('#c31msg').textContent=count?(on?'العدّاد يعمل…':'العدّاد يعمل لكن الدائرة مفتوحة: لا تمر شحنة.'):'العدّاد متوقف.';$('#c31go').textContent=count?'أوقف العد':'ابدأ العد'};
  $('#c31sw').onclick=()=>{on=!on;$('#c31sw').setAttribute('aria-pressed',String(on))};
  segBind(el,'vw',v=>{view=v;did.vw=1});
  $('#c31I').oninput=e=>{I=+e.target.value};$('#c31D').oninput=e=>{D=+e.target.value;if(near(D,1))did.d1=1};
  $('#c31go').onclick=()=>{count=!count};$('#c31rs').onclick=()=>{t=0;Q=0};
  const steps=stepsUI($('#c31st'),[
   {t:'أغلق الدائرة',x:'شغّل المفتاح S: يضيء المصباح ويتحرك مؤشر مقياس الأمبير — دليل على مرور التيار (ص 46).',done:()=>on&&I>0},
   {t:'اتجاه الإلكترونات واتجاه التيار',x:'اختر «الاثنان»: الإلكترونات (−) تخرج من القطب السالب وتدخل القطب الموجب عبر الناقل، والتيار الاصطلاحي (الأسهم البرتقالية) في الاتجاه المعاكس (ص 45–46).',done:()=>view==='both'&&did.vw},
   {t:'شحنة 10 كولوم',x:'اضبط <span class="ltr">I = 2 A</span>، اضغط «صفّر العداد» ثم «ابدأ العد» واتركه 5 ثوانٍ والدائرة مغلقة: تقرأ <span class="ltr">Q = I × t = 2 × 5 = 10 C</span> — المعادلة (3-7).',done:()=>near(I,2)&&t>=5&&Q>=9.9&&Q<=10.6},
   {t:'الملي أمبير',x:'اضبط <span class="ltr">I = 0.5 A</span>: تقرأ <span class="ltr">500 mA</span> لأن <span class="ltr">1 mA = 0.001 A</span> (ص 47).',done:()=>on&&near(I,0.5)},
   {t:'سلك أسمك',x:'في «داخل السلك» اجعل القطر <span class="ltr">1 mm</span> ثم <span class="ltr">2 mm</span> مع ثبات التيار: المساحة تصبح أربعة أضعاف فتقل كثافة التيار J إلى الربع، وتقل سرعة الإلكترونات إلى الربع — المعادلتان (3-4) و(3-5).',done:()=>near(D,2)&&did.d1&&on},
   {t:'الإلكترون بطيء',get x(){return `اقرأ v: إلكترونات النحاس تتحرك ببطء شديد (أجزاء من المليمتر في الثانية مع \\(n = ${fm(TP.v.n28)}\\times10^{28}\\)). ومع ذلك يضيء المصباح فور إغلاق المفتاح، لأن الإلكترونات موجودة في السلك كله وتبدأ الحركة كلها معاً.`}}
  ]);
  if(near(D,1))did.d1=1;
  loopOn(el,dt=>{if(on){ph=(ph+dt*I*0.035)%1;wph=(wph+dt*Math.min(160,30*I/(Am2()*1e6)))%400}if(count){t+=dt;Q+=Ie()*dt}drawC();drawW();facts();steps.check()});
 },
 examples:[
  {title:'حاسبة: الشحنة والتيار وكثافة التيار',ref:'المعادلات (3-2)، (3-5)، (3-7)',
   q:'<p><b>توضيح للمتدرب — ليس مثالاً من الكتاب</b> (لا توجد أمثلة محلولة في هذا الجزء من الكتاب): غيّر الأرقام لتحسب كمية الكهرباء وكثافة التيار في سلك دائري.</p>',
   given:[{id:'I',label:'شدة التيار',sym:'I',unit:'A',value:2},{id:'t',label:'الزمن',sym:'t',unit:'s',value:60},{id:'D',label:'قطر السلك',sym:'D',unit:'mm',value:1.5}],
   solve:g=>{const Q=g.I*g.t,A=Math.PI*g.D*g.D/4;return [
    {t:'كمية الكهرباء من المعادلة (3-7):',f:`Q=I\\times t=${fm(g.I)}\\times ${fm(g.t)}`,v:B.round(Q,4),unit:'C',final:true},
    {t:'وللتحقق، التيار من المعادلة (3-2):',f:`I=\\frac{Q}{t}=\\frac{${fm(B.round(Q,4))}}{${fm(g.t)}}`,v:B.round(Q/g.t,4),unit:'A'},
    {t:'مساحة مقطع السلك:',f:`A=\\frac{\\pi D^2}{4}=\\frac{\\pi\\times ${fm(g.D)}^2}{4}`,v:B.round(A,4),unit:'mm²'},
    {t:'كثافة التيار من المعادلة (3-5):',f:`J=\\frac{I}{A}=\\frac{${fm(g.I)}}{${fm(B.round(A,4))}}`,v:B.round(g.I/A,4),unit:'A/mm²',final:true},
    {t:'نفس كثافة التيار بالوحدة الأساسية (1 mm² = 10⁻⁶ m²):',v:sciT(g.I/A*1e6,3),unit:'A/m²'},
    {t:'عدد الإلكترونات التي عبرت المقطع (e = 1.602 × 10⁻¹⁹ C):',f:`N=\\frac{Q}{e}`,v:sciT(Q/E_CH,3)}]}}
 ],
 quiz:[
  {q:'اصطُلح على أن اتجاه التيار الكهربائي هو:',o:['اتجاه حركة الإلكترونات الحرة','اتجاه سريان الشحنة الموجبة، أي عكس حركة الإلكترونات','اتجاه النيوترونات','لا اتجاه له'],c:1,e:'ص 45.'},
  {q:'في الشكل (3-1) تتحرك الإلكترونات في الناقل:',o:['من القطب الموجب إلى السالب','من القطب السالب إلى الموجب','في الاتجاهين','لا تتحرك'],c:1,e:'ص 46: «الشحنات السالبة سوف تتحرك من القطب السالب إلى القطب الموجب باستمرار».'},
  {q:'الأمبير الواحد يساوي:',o:['1 كولوم × ثانية','1 كولوم / ثانية','1 فولت / ثانية','1 جول / كولوم'],c:1,e:'المعادلة (3-1): <span class="ltr">1 A = 1 C/s</span>.'},
  {q:'التيار <span class="ltr">250 mA</span> يساوي:',o:['25 A','2.5 A','0.25 A','0.025 A'],c:2,e:'<span class="ltr">1 mA = 0.001 A</span>.'},
  {q:'يمر تيار <span class="ltr">3 A</span> لمدة دقيقة واحدة. كمية الكهرباء المارة:',o:['3 C','20 C','180 C','0.05 C'],c:2,e:'\\(Q=I\\,t=3\\times 60=180\\) C — المعادلة (3-7).'},
  {q:'كثافة التيار J هي:',o:['التيار × المساحة','التيار ÷ مساحة المقطع','الشحنة ÷ الزمن','الجهد ÷ التيار'],c:1,e:'المعادلة (3-5).'},
  {q:'سلكان من نفس المادة يمر فيهما نفس التيار، مساحة مقطع الثاني ضعف الأول. كثافة التيار في الثاني:',o:['ضعف الأول','نصف الأول','مساوية','ربع الأول'],c:1,e:'\\(J=I/A\\): المساحة ضعف ← الكثافة نصف.'},
  {q:'في الشكل (3-2) المجال E متجه إلى اليسار، لذلك تتحرك الإلكترونات:',o:['إلى اليسار','إلى اليمين','عمودياً على السلك','لا تتحرك'],c:1,e:'ص 47: الإلكترونات سالبة فتتحرك عكس المجال.'}
 ]
});

/* ======================================================================
   Lesson 2 — potential, EMF, resistance & Ohm's law, R = ρL/A, σ, G (ص 49–52 + مثال 3-1 ص 53–54)
   ====================================================================== */
function fig33SVG(){let s=`<svg viewBox="0 0 360 120" role="img" aria-label="اتجاه التيار وفرق الجهد عبر المقاومة">`;
  s+=edgeSVG([30,62],[330,62],{k:'R',plus:'f',lab:[]},{cy:200});s+=S.t(180,24,'V','',null,15)+S.t(180,100,'R','',null,15)+arrow(60,62,100,62,'--blue',2.4)+S.t(80,86,'I','b');
  return s+'</svg>'}
function fig34SVG(){return plotSVG({w:520,h:300,x0:0,x1:32,y0:0,y1:6.6,xt:[0,5,10,15,20,25,30],yt:[0,1,2,3,4,5,6],xl:'V (volts)',yl:'I (amperes)',aria:'العلاقة بين فرق الجهد والتيار',
  series:[{pts:[[0,0],[30,6]],col:'--blue',w:2.6}],
  extra:(X,Y)=>{let s='';[[10,2],[25,5]].forEach(([v,i])=>{s+=`<path d="M${fx(X(v))} ${fx(Y(i))}V${fx(Y(0))}M${fx(X(v))} ${fx(Y(i))}H${fx(X(0))}" stroke="var(--muted)" stroke-dasharray="5 4" fill="none"/><circle cx="${fx(X(v))}" cy="${fx(Y(i))}" r="5" fill="var(--live)"/>`});
   s+=arrow(X(29),Y(5.8),X(30.6),Y(6.12),'--blue',2.6)+S.t(fx(X(19)),fx(Y(4.6)),'R = 5 Ω','b','end');return s}})}
/* wire drawing for the resistance builder */
function wireSVG(L,D,col){const len=110+420*Math.sqrt(Math.min(L,100)/100),r=4+D*4.2,cy=70,x0=40;
  let s=`<svg viewBox="0 0 600 150" role="img" aria-label="موصل طوله L وقطره D">`;
  s+=`<path d="M${x0} ${cy-r}H${fx(x0+len)}A${fx(r*0.35)} ${fx(r)} 0 0 1 ${fx(x0+len)} ${fx(cy+r)}H${x0}" fill="var(${col})" stroke="var(--fg)" stroke-width="1.6"/><ellipse cx="${x0}" cy="${cy}" rx="${fx(r*0.35)}" ry="${fx(r)}" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/>`;
  s+=`<path d="M${x0} ${fx(cy+r+14)}H${fx(x0+len)}" stroke="var(--muted)"/>`+arrow(x0+len/2-30,cy+r+14,x0+3,cy+r+14,'--muted',1.4)+arrow(x0+len/2+30,cy+r+14,x0+len-3,cy+r+14,'--muted',1.4)+S.t(fx(x0+len/2),fx(cy+r+32),'L = '+fm(L)+' m','b');
  s+=S.t(x0,fx(cy-r-8),'D = '+fm(D)+' mm','b','start');
  return s+'</svg>'}
const MATS={cu:{n:'نحاس',book:true,col:'--live-soft'},al:{n:'ألمنيوم',col:'--surface-2'},fe:{n:'حديد',col:'--line'},nc:{n:'نيكروم',col:'--stop-soft'}};
function ex31Steps(g){const D=g.D,A6=B.round(D*D/4,4);const A=Math.PI*D*D/4*1e-6;const R=g.rho*1e-8*g.L/(Math.PI*A6*1e-6);return [
  {t:'مساحة المقطع الدائري \\(A=\\pi D^2/4\\) والقطر بالمتر \\(D = '+fm(D)+'\\times10^{-3}\\) m:',f:`A=\\frac{\\pi D^2}{4}=\\frac{\\pi\\,(${fm(D)}\\times10^{-3})^2}{4}=${fm(A6)}\\,\\pi\\times10^{-6}`,v:`${fm(A6)}π × 10⁻⁶`,unit:'m²'},
  {t:'بالأرقام (توضيح، ليس من الكتاب):',v:sciT(A,3),unit:'m²'},
  {t:'المقاومة من المعادلة (3-9):',f:`R=\\frac{\\rho L}{A}=\\frac{(${fm(g.rho)}\\times10^{-8})(${fm(g.L)})}{${fm(A6)}\\,\\pi\\times10^{-6}}`,v:B.round(R*1000,2),unit:'mΩ',dp:2,final:true},
  {t:'أي بالأوم (توضيح):',v:sciT(R,2),unit:'Ω'},
  {t:'والموصلية \\(G=1/R\\) (توضيح):',v:B.round(1/R,2),unit:'S'}]}

B.lesson({
 id:'u3-l2',unit:3,order:2,pages:'49–52، 53–54',
 title:'الجهد والقوة الدافعة الكهربائية، والمقاومة وقانون أوم، والعوامل المؤثرة في المقاومة',
 summary:'فرق الجهد شغل تحريك وحدة الشحنات، والقوة الدافعة الكهربائية للبطاريات والمولدات، ثم قانون أوم R = V/I وخطه المستقيم، والمقاومة R = ρL/A، والموصلية النوعية σ والموصلية G. مع مثال (3-1).',
 theory:[
  {h:'الجهد الكهربائي (Electric Potential)',ref:'ص 49',html:`<p>يصحب أي انفصال في الشحنة الكهربائية استهلاك في الطاقة، أو شغل. وتكتسب الإلكترونات جزءاً من الطاقة المستهلكة عند فصل الشحنات. ويمكّن هذا الشغل الإلكترونات من المرور عبر دائرة كهربائية مقفلة إلى القطب الموجب لمصدر الجهد، مسببة توازناً في الشحنات. ويسمى الشغل هذا بالجهد الكهربائي.</p>
   <p>أو بمعنى أصح يعرف <b>فرق الجهد الكهربائي بين نقطتين</b> بأنه <b>الشغل المبذول لتحريك وحدة الشحنات الموجبة بين النقطتين</b> في اتجاه عكس المجال الكهربائي الموجود بينهما.</p>`},
  {note:ADD+'من هذا التعريف: فرق الجهد = الشغل ÷ الشحنة، أي \\(V=W/Q\\)، و <span class="ltr">1 V = 1 J/C</span>. فبطارية <span class="ltr">12 V</span> تعطي كل كولوم يمر فيها <span class="ltr">12 J</span> من الطاقة.'},
  {h:'القوة الدافعة الكهربائية (Electromotive Force)',ref:'ص 49',html:`<p>ومن المنابع التي لها فرق جهد ما يلي:</p>
   <p><b>(1) البطاريات:</b> سبق شرحها في الوحدة الثانية، وفيها تتحول الطاقة الكيميائية أثناء عملية التفريغ إلى طاقة كهربائية، وهي تتيح لنا فروق جهد صغيرة نسبياً بين طرفيها. ويسري التيار الكهربائي <b>خارج البطارية من القطب الموجب</b> عبر الأحمال المختلفة <b>إلى القطب السالب</b>. والتيار لابد أن يسري في مسار مقفل، أي إنه لابد أن يسري <b>داخل البطارية من القطب السالب إلى القطب الموجب</b>. والشغل المبذول لتحريك وحدة الشحنات من القطب السالب إلى القطب الموجب داخل البطارية يسمى <b>القوة الدافعة الكهربائية</b> للبطارية، ويرمز لها بالرمز \\(E\\) ووحدتها هي وحدة فرق الجهد أي <b>الفولت (Volt)</b> ويرمز لها بالرمز V.</p>
   <p><b>(2) المولدات الكهربائية:</b> في مولدات التيار المستمر تتحول الطاقة الحركية إلى طاقة كهربائية، وهذه الطاقة تتيح فرق جهد عالياً نسبياً. ومثل البطاريات فإن هناك قوة دافعة كهربائية تدفع التيار إلى المرور من القطب السالب للمولد إلى القطب الموجب داخل أسلاك المولد نفسه، ويرمز لها أيضاً بالرمز \\(E\\).</p>`},
  {h:'المقاومة وقانون أوم (Resistance and Ohm\'s law)',ref:'ص 50',html:`<p>يمر التيار الكهربائي نتيجة تحرك الشحنات الكهربائية، وهذه الشحنات المتحركة تلقى معارضة للحركة نتيجة لتصادمها مع ذرات وأيونات الوسط الذي تتحرك فيه. ويطلق على هذه المعارضة <b>«المقاومة»</b> ويسمى الوسط الذي تحدث فيه بالوسط المقاوم، ويرمز لها بالرمز \\(R\\).</p>
   <p>وتعرف المقاومة بأنها <b>خارج قسمة فرق الجهد المسلط بين طرفي المقاومة على شدة التيار المار فيها</b>، أي أن:</p>
   $$R=\\frac{V}{I}\\qquad (3\\text{-}8)$$
   <p>حيث \\(R\\) هي المقاومة، و\\(V\\) فرق الجهد المسلط، و\\(I\\) التيار المار. ووحدة \\(R\\) هي Volt/Ampere ويطلق عليها <b>أوم (Ohm)</b> نسبة إلى العالم الألماني <b>جورج سيمون أوم</b> الذي يعتبر أول من لاحظ هذه العلاقة عام <span class="ltr">1827</span> م. ويرمز للأوم بالحرف اللاتيني أوميغا \\(\\Omega\\). وتعرف العلاقة (3-8) بقانون أوم. والشكل (3-3) يوضح اتجاه التيار \\(I\\) وفرق الجهد \\(V\\) عبر المقاومة \\(R\\).</p>`},
  {fig:'(3-3)',ref:'ص 50',caption:'اتجاه التيار I وفرق الجهد V عبر المقاومة R: التيار يدخل المقاومة من طرفها الموجب.',draw:()=>box(fig33SVG(),360)},
  {html:`<p>ولقد لاحظ أوم أن مقاومة الموصلات المعدنية <b>ثابتة عند درجة حرارة معينة</b> ولا تتوقف على فرق الجهد أو التيار. أي أن العلاقة بين فرق الجهد \\(V\\) المسلط عبر طرفيه وبين التيار الناتج \\(I\\) هي <b>علاقة خطية</b> عند درجة حرارة معينة، تمثل بخط مستقيم كما في الشكل (3-4). وميل هذا الخط المستقيم بالنسبة لمحور التيار هو المقاومة \\(R\\)، ومن أمثلة المقاومات الخطية الموصلات المعدنية. <span class="ref">ص 50–51</span></p>`},
  {fig:'(3-4)',ref:'ص 51',caption:'العلاقة بين فرق الجهد والتيار المار في الموصل: خط مستقيم يمر بالأصل، ومنه النقطتان (10 V, 2 A) و(25 V, 5 A)، أي R = 5 Ω.',draw:()=>box(fig34SVG(),520)},
  {note:ADD+'في الشكل (3-4) الجهد على المحور الأفقي والتيار على الرأسي، فنقرأ المقاومة هكذا: \\(R=\\frac{\\Delta V}{\\Delta I}=\\frac{25-10}{5-2}=5\\ \\Omega\\). ومن قانون أوم نحصل على الصيغتين اللتين يستعملهما الكتاب في الأمثلة: \\(V=I\\,R\\) و \\(I=V/R\\).'},
  {h:'العوامل التي تتوقف عليها مقاومة موصل',ref:'ص 51',html:`<ol><li><b>طول الموصل \\((L)\\):</b> المقاومة تتناسب تناسباً طردياً مع طول الموصل.</li><li><b>مساحة المقطع \\((A)\\):</b> مقاومة الموصل تتناسب تناسباً عكسياً مع مساحة مقطع الموصل.</li><li><b>المقاومة النوعية للموصل \\((\\rho)\\):</b> مقاومة الموصل تتوقف على نوع مادة الموصل.</li><li><b>درجة الحرارة \\((T)\\)</b> — الدرس التالي.</li></ol>
   <p>تتناسب مقاومة الموصل تناسباً طردياً مع طوله وعكسياً مع مساحة مقطعه وذلك عند ثبوت درجة الحرارة، ولذلك أمكن الحصول على العلاقة:</p>
   $$R=\\frac{\\rho\\,L}{A}\\quad (\\Omega)\\qquad (3\\text{-}9)$$
   <p>حيث \\(\\rho\\) ثابت يتوقف على نوع المادة ويسمى <b>المقاومة النوعية (Resistivity)</b> ووحدته <b>أوم-متر</b> <span class="ltr">(Ω·m)</span>، و\\(L\\) طول الموصل بالمتر <span class="ltr">(m)</span>، و\\(A\\) مساحة مقطعه بالمتر المربع <span class="ltr">(m²)</span>. وجدير بالذكر أن نعرف هنا ما يسمى <b>الموصلية النوعية (Conductivity)</b> \\(\\sigma\\) وهي مقلوب المقاومة النوعية \\(\\rho\\)، أي أن:</p>
   $$\\sigma=\\frac{1}{\\rho}=\\frac{L}{R\\,A}\\quad (\\text{S/m})\\qquad (3\\text{-}10)$$
   <p>ووحدة \\(\\sigma\\) هي <span class="ltr">(Ω·m)⁻¹</span> أو <span class="ltr">S/m</span> حيث <span class="ltr">1 siemens (S) = 1 (ohm)⁻¹</span>.</p>`},
  {h:'الموصلية G',ref:'ص 52',html:`<p>ويجدر بنا أيضاً أن نعرف ما يعرف <b>بالموصلية \\(G\\) (Conductance)</b> وهي مقلوب المقاومة، أي أن:</p>
   $$G=\\frac{1}{R}\\quad (\\text{mho})$$
   <p>أي أن وحدة \\(G\\) هي mho، أو <span class="ltr">(ohm)⁻¹</span>، أو <span class="ltr">S</span> (Siemens).</p>`},
  {err:'بجانب المعادلة (3-10) ص 51 كتب الكتاب الوحدة «(mho)»، ثم قال بعدها إن وحدة \\(\\sigma\\) هي <span class="ltr">(Ω·m)⁻¹</span> أو <span class="ltr">S/m</span>. الصحيح <span class="ltr">S/m</span> (أو mho/m) كما في نص الكتاب؛ أما mho وحدها فهي وحدة الموصلية \\(G\\) لا الموصلية النوعية \\(\\sigma\\).'},
  {h:'مثال (3-1)',ref:'ص 53–54',html:`<p>موصل نحاسي طوله <span class="ltr">5 m</span> وقطر مقطعه الدائري المستعرض <span class="ltr">5 mm</span>، احسب مقاومته عند درجة حرارة <span class="ltr">20°C</span> إذا كانت المقاومة النوعية للنحاس عند <span class="ltr">20°C</span> تساوي <span class="ltr">1.72 × 10⁻⁸ Ω·m</span>.</p>
   <p><b>الحل:</b></p>$$A=\\frac{\\pi D^2}{4}=\\frac{\\pi(5\\times10^{-3})^2}{4}=6.25\\,\\pi\\times10^{-6}\\ \\text{m}^2$$ $$R=\\frac{\\rho L}{A}=\\frac{(1.72\\times10^{-8})(5)}{6.25\\,\\pi\\times10^{-6}}=4.38\\ \\text{m}\\Omega$$<p>الحل خطوة بخطوة (وبأرقامك) في تبويب «الأمثلة المحلولة».</p>
   <p class="sub">يقع هذا المثال في الكتاب بعد قسم تأثير درجة الحرارة (ص 53–54)، وعرضناه هنا لأنه تطبيق للمعادلة (3-9).</p>`},
  notesBlock(['في حل مثال (3-1) ص 54 طُبعت الأسس هكذا: «10-3» و«10-8» و«10-6»، والمقصود \\(10^{-3}\\) و\\(10^{-8}\\) و\\(10^{-6}\\).'])
 ],
 lab:(el)=>{
  let V=10,R=5,rec=[],mat='cu',L=10,D=2;const did={};
  el.innerHTML=`<div class="grid c3-lab">
   <div class="panel c6"><h2>منضدة قانون أوم <small>مبنية على الشكلين (3-3) و(3-4) ص 50–51</small></h2>
    ${sl('c32V','جهد المنبع V',0,30,0.5,V)}${sl('c32R','المقاومة R',1,20,0.5,R)}
    <div class="svgbox" id="c32c" style="max-width:480px;margin-inline:auto"></div>
    <div class="facts">${fact('قراءة الأميتر I = V / R','c32I')}${fact('R = V / I (3-8)','c32Rr')}${fact('الموصلية G = 1 / R','c32G')}</div>
    <div class="c3-row"><button class="btn primary" id="c32rec">سجّل القراءة</button><button class="btn" id="c32clr">امسح الجدول</button></div></div>
   <div class="panel c6"><h2>منحنى V–I <small>كالشكل (3-4): كل قراءة تسجلها نقطة</small></h2>
    <div class="svgbox" id="c32p"></div>
    <div class="c3-tbl"><table class="c3-rec"><thead><tr><th>V (V)</th><th>I (A)</th><th>V / I (Ω)</th></tr></thead><tbody id="c32tb"></tbody></table></div></div>
   <div class="c12" id="c32tp"></div>
   <div class="panel c12"><h2>اصنع موصلاً واحسب مقاومته <small>المعادلات (3-9) و(3-10) و G = 1/R</small></h2>
    <div class="c3-row"><div><div class="sub">المادة</div>${segHTML('mt',Object.entries(MATS).map(([k,m])=>[k,m.n]),mat)}</div><button class="btn" id="c32ex">مثال (3-1): نحاس 5 m و 5 mm</button></div>
    ${sl('c32L','الطول L',0.5,100,0.5,L)}${sl('c32D','القطر D',0.5,10,0.5,D)}
    <div class="svgbox" id="c32w" style="max-width:600px;margin-inline:auto"></div>
    <div class="facts">${fact('ρ (Ω·m)','c32rho')}${fact('A = πD²/4','c32A')}${fact('R = ρL / A (3-9)','c32Rw')}${fact('G = 1 / R','c32Gw')}${fact('σ = 1 / ρ (3-10)','c32s')}</div>
    <p class="sub" id="c32wn"></p></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="c32st"></ol></div></div>`;
  const $=s=>el.querySelector(s);
  const TP=B.params($('#c32tp'),'u3-l2',[
   {k:'al',label:'المقاومة النوعية للألمنيوم بوحدة 10⁻⁸ Ω·m',unit:'× 10⁻⁸ Ω·m',value:2.82,min:0.1,max:1000,step:0.01},
   {k:'fe',label:'المقاومة النوعية للحديد بوحدة 10⁻⁸ Ω·m',unit:'× 10⁻⁸ Ω·m',value:10,min:0.1,max:1000,step:0.1},
   {k:'nc',label:'المقاومة النوعية للنيكروم بوحدة 10⁻⁸ Ω·m',unit:'× 10⁻⁸ Ω·m',value:110,min:0.1,max:1000,step:1}],()=>{drawW()});
  const rho8=()=>mat==='cu'?1.72:TP.v[mat];
  const drawO=()=>{const I=V/R;setV(el,'c32V',fm(V,1)+' V');setV(el,'c32R',fm(R,1)+' Ω');
   const sp=loopSpec({w:440,h:250,x0:70,y0:50,x1:300,y1:210,left:[{k:'E',plus:'t',lab:['V = '+fm(V,1)+' V'],side:-1}],top:[{k:'W'},{k:'W'}],right:[{k:'R',plus:'f',lab:['R = '+fm(R,1)+' Ω'],side:1}],bottom:[{k:'W'}]});
   const fl=V>0?sp.edges.map(()=>1):null;
   let ex=meterSVG(185,50,'A',fm(I,2)+' A');ex+=`<path class="w" d="M300 80H390V113M390 157V185H300"/><circle cx="300" cy="80" r="3.4" fill="var(--fg)"/><circle cx="300" cy="185" r="3.4" fill="var(--fg)"/>`+meterSVG(390,135,'V',fm(V,1)+' V');
   $('#c32c').innerHTML=circ(sp,{flow:fl,extra:ex}).replace('aria-label="دائرة كهربائية"','aria-label="منبع ومقاومة وأميتر وفولتميتر"');
   $('#c32I').textContent=fm(I,3)+' A';$('#c32Rr').textContent=V>0?fm(V/I,3)+' Ω':'—';$('#c32G').textContent=fm(1/R,4)+' S';
   const ym=Math.max(6,Math.ceil(30/R));const ytk=ym<=6?[0,1,2,3,4,5,6]:ticks(niceMax(ym),5);const y1=ytk[ytk.length-1]*1.08;
   $('#c32p').innerHTML=plotSVG({w:460,h:280,x0:0,x1:32,y0:0,y1,xt:[0,5,10,15,20,25,30],yt:ytk,xl:'V (volts)',yl:'I (amperes)',aria:'منحنى الجهد والتيار',
    series:[{pts:[[0,0],[30,30/R]],col:'--blue',w:2.2,dash:'6 4'}],
    extra:(X,Y)=>{let s='';rec.forEach(r=>{s+=`<circle cx="${fx(X(r.V))}" cy="${fx(Y(r.I))}" r="5" fill="var(--blue)"/>`});s+=`<path d="M${fx(X(V))} ${fx(Y(I))}V${fx(Y(0))}M${fx(X(V))} ${fx(Y(I))}H${fx(X(0))}" stroke="var(--muted)" stroke-dasharray="4 4"/><circle cx="${fx(X(V))}" cy="${fx(Y(I))}" r="7" fill="var(--live)" stroke="var(--surface)" stroke-width="2"/>`+S.t(fx(X(31)),fx(Y(0)-10),'R = '+fm(R,1)+' Ω','b','end');return s}});
   $('#c32tb').innerHTML=rec.length?rec.map(r=>`<tr><td class="l">${fm(r.V,1)}</td><td class="l">${fm(r.I,3)}</td><td class="l">${fm(r.V/r.I,2)}</td></tr>`).join(''):'<tr><td colspan="3">لا قراءات بعد. اضغط «سجّل القراءة».</td></tr>'};
  const drawW=()=>{setV(el,'c32L',fm(L,1)+' m');setV(el,'c32D',fm(D,1)+' mm');const rho=rho8()*1e-8,A=Math.PI*Math.pow(D*1e-3,2)/4,Rw=rho*L/A;
   $('#c32w').innerHTML=wireSVG(L,D,MATS[mat].col);
   $('#c32rho').textContent=sciT(rho,3);$('#c32A').textContent=fm(A*1e6,4)+' mm²';$('#c32Rw').textContent=eng(Rw,'Ω',4);$('#c32Gw').textContent=eng(1/Rw,'S',4);$('#c32s').textContent=sciT(1/rho,3)+' S/m';
   $('#c32wn').innerHTML=(mat==='cu'?'المقاومة النوعية للنحاس <span class="ltr">1.72 × 10⁻⁸ Ω·m</span> من مثال (3-1).':`المقاومة النوعية لـ${MATS[mat].n} رقم توضيحي من خارج الكتاب (يغيّره المدرب من «قيم المدرب» أعلاه).`)+' الرسم يكبر مع الطول والقطر لكن ليس بمقياس رسم حقيقي.'};
  const ui=()=>{$('#c32V').value=V;$('#c32R').value=R;$('#c32L').value=L;$('#c32D').value=D;segSet(el,'mt',mat)};
  $('#c32V').oninput=e=>{V=+e.target.value;drawO()};$('#c32R').oninput=e=>{R=+e.target.value;drawO()};
  $('#c32rec').onclick=()=>{if(V<=0)return;if(!rec.find(r=>near(r.V,V)&&near(r.I,V/R)))rec.push({V,I:V/R,R});rec.sort((a,b)=>a.V-b.V);drawO()};
  $('#c32clr').onclick=()=>{rec=[];drawO()};
  segBind(el,'mt',v=>{mat=v;drawW()});$('#c32L').oninput=e=>{L=+e.target.value;drawW()};$('#c32D').oninput=e=>{D=+e.target.value;drawW()};
  $('#c32ex').onclick=()=>{mat='cu';L=5;D=5;ui();drawW()};
  const ex31=()=>mat==='cu'&&near(L,5)&&near(D,5);
  const steps=stepsUI($('#c32st'),[
   {t:'نقطة من الشكل (3-4)',x:'اضبط <span class="ltr">R = 5 Ω</span> و <span class="ltr">V = 10 V</span>: يقرأ الأميتر <span class="ltr">I = 2 A</span> وهي النقطة الأولى في الشكل (3-4).',done:()=>near(R,5)&&near(V,10)},
   {t:'النقطة الثانية',x:'ارفع الجهد إلى <span class="ltr">25 V</span>: التيار <span class="ltr">5 A</span>. الجهد زاد 2.5 مرة فزاد التيار 2.5 مرة.',done:()=>near(R,5)&&near(V,25)},
   {t:'خط مستقيم',x:'مع <span class="ltr">R = 5 Ω</span> سجّل ثلاث قراءات على الأقل بجهود مختلفة: تقع كلها على خط مستقيم يمر بالأصل، و V/I ثابتة = 5 Ω (قانون أوم).',done:()=>rec.filter(r=>near(r.R,5)).length>=3},
   {t:'مقاومة أكبر',x:'اجعل <span class="ltr">R = 10 Ω</span>: يميل الخط أقل — نفس الجهد يعطي نصف التيار.',done:()=>near(R,10)},
   {t:'مثال (3-1)',x:'في «اصنع موصلاً» اضغط زر مثال (3-1): نحاس طوله <span class="ltr">5 m</span> وقطره <span class="ltr">5 mm</span> مقاومته <span class="ltr">4.38 mΩ</span> فقط.',done:()=>ex31()},
   {t:'الطول والمقطع',x:'ضاعف الطول إلى <span class="ltr">10 m</span>: تتضاعف المقاومة (طردي). ثم أرجع الطول <span class="ltr">5 m</span> وضاعف القطر إلى <span class="ltr">10 mm</span>: تصبح المقاومة الربع لأن المساحة أربعة أضعاف (عكسي).',done:()=>{if(mat==='cu'&&near(L,10)&&near(D,5))did.l2=1;return did.l2&&mat==='cu'&&near(L,5)&&near(D,10)}}
  ]);
  ui();drawO();drawW();
  loopOn(el,()=>steps.check());
 },
 examples:[
  {title:'مثال (3-1)',ref:'ص 53–54',q:'<p>موصل نحاسي طوله <span class="ltr">5 m</span> وقطر مقطعه الدائري المستعرض <span class="ltr">5 mm</span>، احسب مقاومته عند درجة حرارة <span class="ltr">20°C</span> إذا كانت المقاومة النوعية للنحاس عند <span class="ltr">20°C</span> تساوي <span class="ltr">1.72 × 10⁻⁸ Ω·m</span>.</p>',
   given:[{id:'L',label:'طول الموصل',sym:'L',unit:'m',value:5},{id:'D',label:'قطر المقطع',sym:'D',unit:'mm',value:5},{id:'rho',label:'المقاومة النوعية (× 10⁻⁸)',sym:'\\rho',unit:'Ω·m',value:1.72}],
   solve:g=>ex31Steps(g)}
 ],
 quiz:[
  {q:'يعرف فرق الجهد بين نقطتين بأنه:',o:['عدد الإلكترونات المارة بينهما','الشغل المبذول لتحريك وحدة الشحنات الموجبة بين النقطتين','التيار ÷ المقاومة','الشحنة × الزمن'],c:1,e:'ص 49.'},
  {q:'داخل البطارية يسري التيار:',o:['من القطب الموجب إلى السالب','من القطب السالب إلى الموجب','لا يسري تيار داخلها','في الاتجاهين'],c:1,e:'ص 49: والشغل المبذول لذلك هو القوة الدافعة الكهربائية E.'},
  {q:'في مولدات التيار المستمر تتحول:',o:['الطاقة الكيميائية إلى كهربائية','الطاقة الحركية إلى كهربائية','الطاقة الحرارية إلى كيميائية','الطاقة الكهربائية إلى حركية'],c:1,e:'ص 49.'},
  {q:'مقاومة يمر فيها <span class="ltr">3 A</span> عند جهد <span class="ltr">12 V</span>. قيمتها:',o:['36 Ω','4 Ω','0.25 Ω','15 Ω'],c:1,e:'\\(R=V/I=12/3=4\\ \\Omega\\) — المعادلة (3-8).'},
  {q:'في الشكل (3-4) المقاومة تساوي:',o:['2 Ω','5 Ω','10 Ω','0.2 Ω'],c:1,e:'مكتوب على الخط R = 5 Ω، و \\(10/2=25/5=5\\).'},
  {q:'إذا ضوعف طول موصل مع ثبات مساحة مقطعه ومادته وحرارته فإن مقاومته:',o:['تتضاعف','تنقص للنصف','لا تتغير','تصبح أربعة أضعاف'],c:0,e:'المعادلة (3-9): R تتناسب طردياً مع L.'},
  {q:'إذا ضوعف قطر موصل (مع ثبات الطول) فإن مقاومته تصبح:',o:['الضعف','النصف','الربع','أربعة أضعاف'],c:2,e:'المساحة \\(\\pi D^2/4\\) تصبح أربعة أضعاف، والمقاومة تتناسب عكسياً مع المساحة.'},
  {q:'وحدة الموصلية G هي:',o:['Ω·m','S (أو mho)','S/m','V/A'],c:1,e:'ص 52: G = 1/R ووحدتها mho أو S. أما S/m فوحدة الموصلية النوعية σ.'}
 ]
});

/* ======================================================================
   Lesson 3 — temperature effect on resistance (ص 52–55), أمثلة (3-2) و(3-3)
   ====================================================================== */
function fig35aSVG(){return plotSVG({w:300,h:220,left:30,x0:-100,x1:120,y0:0,y1:10,xt:[],yt:[],xl:'T°C',yl:'ρ',aria:'المقاومة النوعية ودرجة الحرارة للموصلات',
  series:[{pts:Array.from({length:45},(_,i)=>{const T=-90+i*4.8;return [T,4+0.025*T+0.00009*T*T]}),col:'--blue',w:2.6}],
  extra:(X,Y)=>`<circle cx="${fx(X(0))}" cy="${fx(Y(4))}" r="4" fill="var(--live)"/>`+S.t(fx(X(0)-6),fx(Y(4)-6),'ρ0','b','end')+S.t(fx(X(0)),fx(Y(0)+15),'0','m')})}
function fig35bSVG(){return plotSVG({w:300,h:220,left:30,x0:0,x1:30,y0:0,y1:10,xt:[],yt:[],xl:'T(K)',yl:'ρ',aria:'المقاومة النوعية ودرجة الحرارة للمواد فائقة التوصيل',
  series:[{pts:[[0,0.05],[9,0.05],[9.6,5.2],[11,6.3],[14,6.9],[20,7.2],[29,7.35]],col:'--blue',w:2.6}],
  extra:(X,Y)=>S.t(fx(X(9.2)),fx(Y(0)+15),'Tc','b')+S.t(fx(X(0)),fx(Y(0)+15),'0','m')})}
const trunc=(x,dp)=>{const p=Math.pow(10,dp);return Math.trunc(x*p+1e-9*Math.sign(x))/p};
function ex32Steps(g){const a=(g.RT-g.R0)/(g.RT*g.T),a0=(g.RT-g.R0)/(g.R0*g.T);return [
  {t:'نستعمل المعادلة (3-14):',f:'R_{T_2}=R_{T_1}\\left[1+\\alpha_{T_1}(T_2-T_1)\\right]'},
  {t:`نأخذ \\(T_1=${fm(g.T)}^\\circ C\\) (حيث المقاومة ${fm(g.RT)} Ω) و \\(T_2=0^\\circ C\\) (حيث المقاومة ${fm(g.R0)} Ω):`,f:`${fm(g.R0)}=${fm(g.RT)}\\left[1+\\alpha_{${fm(g.T)}}\\,(0-${fm(g.T)})\\right]`},
  {t:'ومنها معامل درجة حرارة المعدن عند '+fm(g.T)+'°C:',f:`\\alpha_{${fm(g.T)}}=\\frac{${fm(g.RT)}-${fm(g.R0)}}{${fm(g.RT)}\\times ${fm(g.T)}}=\\frac{${fm(B.round(g.RT-g.R0,6))}}{${fm(B.round(g.RT*g.T,6))}}`,v:sciT(a,3),unit:'°C⁻¹',final:true},
  {t:'تحقق (توضيح، ليس من الكتاب): المعامل منسوباً للصفر من (3-12) ثم التحويل بالمعادلة (3-15):',f:`\\alpha_0=\\frac{${fm(B.round(g.RT-g.R0,6))}}{${fm(g.R0)}\\times ${fm(g.T)}}=${sciTex(a0,3)} \\;\\Rightarrow\\; \\alpha_{${fm(g.T)}}=\\frac{\\alpha_0}{1+\\alpha_0\\,${fm(g.T)}}`,v:sciT(a0/(1+a0*g.T),3),unit:'°C⁻¹'}]}
function ex33Steps(g){const R2=B.round(g.R1*(1+g.p/100),4),k=R2/g.R1;const a=trunc((k-1)/(g.T2-k*g.T1),7);const R0=B.round(g.R1/(1+g.T1*a),4);const T=B.round((g.Rx/R0-1)/a,0);return [
  {t:'نستعمل المعادلة (3-12) \\(R_T=R_0(1+\\alpha_0T)\\) عند الحرارتين:',f:`R_{${fm(g.T1)}}=${fm(g.R1)}=R_0(1+${fm(g.T1)}\\,\\alpha_0)\\;,\\quad R_{${fm(g.T2)}}=${fm(g.R1)}+${fm(B.round(R2-g.R1,4))}=${fm(R2)}=R_0(1+${fm(g.T2)}\\,\\alpha_0)`,v:R2,unit:'Ω'},
  {t:'بحل المعادلتين معاً (بقسمة الثانية على الأولى):',f:`\\frac{${fm(R2)}}{${fm(g.R1)}}=\\frac{1+${fm(g.T2)}\\alpha_0}{1+${fm(g.T1)}\\alpha_0}\\;\\Rightarrow\\;\\alpha_0`,v:a,unit:'°C⁻¹',dp:7},
  {t:'ومن المعادلة الأولى:',f:`R_0=\\frac{${fm(g.R1)}}{1+${fm(g.T1)}\\times ${fm(a)}}`,v:R0,unit:'Ω',dp:4},
  {t:`درجة حرارة الموصل عندما تكون مقاومته ${fm(g.Rx)} Ω:`,f:`${fm(g.Rx)}=${fm(R0)}\\,(1+${fm(a)}\\,T)`,v:T,unit:'°C',dp:0},
  {t:'الارتفاع في درجة الحرارة فوق درجة الحرارة المحيطة:',f:`\\Delta T=${fm(T)}-${fm(g.Ta)}`,v:B.round(T-g.Ta,0),unit:'°C',dp:0,final:true}]}

B.lesson({
 id:'u3-l3',unit:3,order:3,pages:'52–55',
 title:'تأثير درجة الحرارة على مقاومة الموصل',
 summary:'المقاومة النوعية والمقاومة تتغيران مع درجة الحرارة: RT = R0 (1 + α0 T)، والانتقال من حرارة إلى أخرى بالمعادلة (3-14). المعامل موجب للمعادن، وسالب للسوائل الموصلة وأشباه الموصلات، وتختفي المقاومة في المواد فائقة التوصيل. مع المثالين (3-2) و(3-3).',
 theory:[
  {h:'تأثير درجة الحرارة على مقاومة الموصل',ref:'ص 52',html:`<p>تتغير المقاومة النوعية للمواد المختلفة مع تغير درجة الحرارة، وتأخذ الصورة:</p>
   $$\\rho_T=\\rho_0\\,(1+\\alpha_0\\,T)\\qquad (3\\text{-}11)$$
   <p>حيث \\(T\\) درجة الحرارة مقاسة بالتقدير المئوي، و\\(\\alpha_0\\) يسمى <b>المعامل الحراري للمقاومة النوعية منسوباً للصفر المئوي</b>. ويمكن الحصول على العلاقة التي تمثل تغير المقاومة مع درجة الحرارة كالآتي:</p>
   $$R_T=\\frac{\\rho_T\\,L}{A}\\ (\\Omega)\\;,\\qquad R_0=\\frac{\\rho_0\\,L}{A}\\ (\\Omega)$$
   <p>وبالتالي يمكن الحصول على الصورة:</p>
   $$R_T=\\frac{\\rho_T\\,L}{A}=\\frac{\\rho_0\\,L}{A}\\,(1+\\alpha_0\\,T)$$
   <p>أي أن:</p>
   $$R_T=R_0\\,(1+\\alpha_0\\,T)\\qquad (3\\text{-}12)$$`},
  {html:`<p>ويمكن الآن إيجاد المقاومة عندما ترتفع درجة الحرارة من \\(T_1\\) إلى \\(T_2\\) كالآتي: <span class="ref">ص 52–53</span></p>
   $$R_{T_1}=R_0\\,(1+\\alpha_0\\,T_1)\\;,\\qquad R_{T_2}=R_0\\,(1+\\alpha_0\\,T_2)\\qquad (3\\text{-}13)$$
   <p>وبالتالي يمكن الحصول على الصورة:</p>
   $$R_{T_2}=R_{T_1}\\left[1+\\alpha_{T_1}\\,(T_2-T_1)\\right]\\qquad (3\\text{-}14)$$
   <p>حيث أن:</p>
   $$\\alpha_{T_1}=\\frac{\\alpha_0}{1+\\alpha_0\\,T_1}\\qquad (3\\text{-}15)$$
   <p>\\(\\alpha_{T_1}\\) هو <b>المعامل الحراري للمقاومة النوعية منسوباً لدرجة الحرارة \\(T_1\\)</b>. وهذا المعامل يكون <b>موجباً للموصلات المعدنية</b>، أي أن المقاومة \\(R\\) تزداد بازدياد درجة الحرارة \\(T\\).</p>`},
  {note:ADD+'نحصل على (3-14) بقسمة معادلتي (3-13): \\(\\frac{R_{T_2}}{R_{T_1}}=\\frac{1+\\alpha_0T_2}{1+\\alpha_0T_1}=1+\\frac{\\alpha_0}{1+\\alpha_0T_1}(T_2-T_1)\\). لذلك نحتاج معاملاً «منسوباً» لحرارة البداية \\(T_1\\): إذا عرفت المقاومة عند <span class="ltr">20°C</span> فاستعمل \\(\\alpha_{20}\\) (كما في مثال 3-8 حيث \\(\\alpha_{20}=0.00393\\) للنحاس).'},
  {h:'المعامل الحراري الموجب والمعامل الحراري السالب',ref:'ص 53',html:`<p>العلاقات المستنتجة أعلاه تصلح فقط <b>للمعادن</b>. أما في حالة <b>السوائل الموصلة</b> فإن المقاومة <b>تنخفض</b> بارتفاع درجة الحرارة نتيجة انخفاض لزوجة المحلول بارتفاع الحرارة مما يؤدي إلى زيادة سرعة الأيونات، ولهذا فإن <b>المعامل الحراري للمقاومة يكون سالباً</b>. وفي حالة <b>أشباه الموصلات</b> تقل المقاومة بارتفاع درجة الحرارة بسبب زيادة عدد الإلكترونات الحرة.</p>
   <p>ويلاحظ أن هناك طائفة من المعادن تسمى بالموصلات <b>فائقة (مفرطة) التوصيل</b>، الشكل (3-5)، والتي <b>تختفي فيها المقاومة تماماً</b> عند درجات حرارة أقل من 10 درجات مطلقة، ولذلك سميت بالمواد فائقة التوصيل مرتفعة الحرارة وتصنع من مواد خزفية.</p>
   <table class="tt"><thead><tr><th>المادة (ص 53)</th><th>عند ارتفاع الحرارة</th><th>المعامل الحراري</th><th>السبب</th></tr></thead><tbody>
   <tr><td>المعادن (الموصلات المعدنية)</td><td>المقاومة تزداد</td><td>موجب</td><td>—</td></tr>
   <tr><td>السوائل الموصلة</td><td>المقاومة تنخفض</td><td>سالب</td><td>انخفاض لزوجة المحلول فتزيد سرعة الأيونات</td></tr>
   <tr><td>أشباه الموصلات</td><td>المقاومة تقل</td><td>سالب</td><td>زيادة عدد الإلكترونات الحرة</td></tr>
   <tr><td>المواد فائقة التوصيل</td><td>المقاومة صفر تحت درجة حرجة</td><td>—</td><td>—</td></tr></tbody></table>`},
  {html:`<div class="c3-figs"><figure class="fig">${box(fig35aSVG(),300)}<figcaption>(أ) العلاقة بين المقاومة النوعية ρ ودرجة الحرارة T للموصلات</figcaption></figure><figure class="fig">${box(fig35bSVG(),300)}<figcaption>(ب) العلاقة بين المقاومة النوعية ρ ودرجة الحرارة T للمواد فائقة التوصيل</figcaption></figure></div>
   <p class="sub"><b>الشكل (3-5)</b> <span class="ref">ص 53</span> — في (أ) يقطع المنحنى المحور الرأسي عند ρ<sub>0</sub> (عند الصفر المئوي) ويستمر لدرجات الحرارة السالبة دون أن يصل للصفر. في (ب) المقاومة النوعية صفر من 0 K حتى الدرجة الحرجة T<sub>c</sub> ثم تقفز فجأة.</p>`},
  {err:'الجملة الأخيرة عن المواد فائقة التوصيل ص 53 متناقضة: تقول إن المقاومة تختفي «عند درجات حرارة أقل من 10 درجات مطلقة» ثم «لذلك سميت بالمواد فائقة التوصيل مرتفعة الحرارة وتصنع من مواد خزفية». المعادن فائقة التوصيل (كما في الشكل 3-5ب) تعمل تحت نحو <span class="ltr">10 K</span>؛ أما المواد الخزفية فائقة التوصيل «مرتفعة الحرارة» فنوع آخر يعمل فوق نحو <span class="ltr">77 K</span> (حرارة النيتروجين السائل). ودرجات الحرارة المطلقة بالكلفن: <span class="ltr">T(K) = T(°C) + 273</span>.'},
  {h:'المثالان (3-2) و(3-3)',ref:'ص 54–55',html:`<table class="tt"><thead><tr><th>المثال</th><th>المعطيات</th><th>النتيجة</th></tr></thead><tbody>
   <tr><td>(3-2) ص 54</td><td>7 Ω عند 0°C و 7.8 Ω عند 200°C</td><td>\\(\\alpha_{200}=5.128\\times10^{-4}\\ ^\\circ C^{-1}\\)</td></tr>
   <tr><td>(3-3) ص 55</td><td>25 Ω تزيد 10% من 15° إلى 50°C، ثم 30 Ω، والمحيط 20°C</td><td>\\(\\alpha_0=0.0029850\\)، \\(R_0=23.9286\\ \\Omega\\)، \\(T=85^\\circ C\\)، \\(\\Delta T=65^\\circ C\\)</td></tr></tbody></table>
   <p>الحل خطوة بخطوة (وبأرقامك) في تبويب «الأمثلة المحلولة»، والمثال (3-3) حي في «المختبر».</p>`},
  notesBlock(['الطرف الثاني من المعادلة (3-13) ص 53 طُبع \\(R_{T_2}=R_1(1+\\alpha_1T_2)\\)، والصحيح \\(R_{T_2}=R_0(1+\\alpha_0T_2)\\) كما كُتب أعلاه (منه ومن الطرف الأول نحصل على 3-14).',
   'في حل مثال (3-2) ص 54 طُبع السطر الأوسط \\(\\alpha_{T_1}=-.8/(7.8\\times200)=-5.128\\times10^{-4}\\) بإشارة سالبة، ثم النتيجة موجبة. الصحيح \\(7=7.8(1-200\\,\\alpha)\\) ومنها \\(\\alpha_{200}=+0.8/(7.8\\times200)=5.128\\times10^{-4}\\). النتيجة النهائية في الكتاب صحيحة.',
   'في مثال (3-3) ص 55 طُبع \\(\\alpha_0=0.0029850\\) والقيمة الأدق \\(0.1/33.5=0.0029851\\) (فرق في الرقم السابع، لا يغيّر النتيجة 85°C). الحاسبة تعرض رقم الكتاب.'])
 ],
 lab:(el)=>{
  let mode='pos',T=20,Tk=20,T1=20,R0=23.9286,a0=0.002985;
  el.innerHTML=`<div id="c33tp"></div><div class="grid c3-lab">
   <div class="panel c5"><h2>سخّن الموصل أو برّده <small>مبنية على ص 52–53 والشكل (3-5)</small></h2>
    <div class="c3-row"><div><div class="sub">نوع المادة</div>${segHTML('md',[['pos','معدن (معامل موجب)'],['neg','سائل موصل / شبه موصل (معامل سالب)'],['sc','فائق التوصيل']],mode)}</div></div>
    <div id="c33pos"><div class="c3-row"><span class="sub">قيم جاهزة:</span><button class="btn" data-pr="33">مثال (3-3)</button><button class="btn" data-pr="32">مثال (3-2)</button><button class="btn" data-pr="38">ملف النحاس مثال (3-8)</button></div>
     <div class="c3-row"><label class="ex-in"><span>المقاومة عند الصفر R<sub>0</sub> (Ω)</span><span class="ex-inbox"><input type="number" step="any" id="c33R0"><em>Ω</em></span></label><label class="ex-in"><span>المعامل α<sub>0</sub></span><span class="ex-inbox"><input type="number" step="any" id="c33a0"><em>°C⁻¹</em></span></label></div></div>
    <div id="c33Tw">${sl('c33T','درجة الحرارة T',-50,200,1,T)}</div><div id="c33Kw">${sl('c33K','درجة الحرارة المطلقة T',0,30,0.1,Tk)}</div>
    <div class="svgbox" id="c33v" style="max-width:340px;margin-inline:auto"></div></div>
   <div class="panel c7"><h2>المقاومة مع درجة الحرارة <small id="c33ph"></small></h2>
    <div class="svgbox" id="c33p"></div>
    <div class="facts">${fact('المقاومة الآن R<sub>T</sub>','c33R')}${fact('التغير عن R<sub>0</sub>','c33d')}${fact('الحالة','c33ch')}</div>
    <div id="c33t1">${sl('c33T1','حرارة مرجعية T<sub>1</sub> للمعادلتين (3-14) و(3-15)',0,200,1,T1)}
     <div class="facts">${fact('R<sub>T1</sub> من (3-12)','c33RT1')}${fact('α<sub>T1</sub> من (3-15)','c33aT1')}${fact('R<sub>T</sub> من (3-14)','c33R14')}</div>
     <p class="sub">المعادلة (3-14) تعطي نفس المقاومة التي تعطيها (3-12) مهما اخترت T<sub>1</sub>، بشرط استعمال المعامل المنسوب إلى T<sub>1</sub>.</p></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="c33st"></ol></div></div>`;
  const $=s=>el.querySelector(s);
  const TP=B.params($('#c33tp'),'u3-l3',[
   {k:'Rn0',label:'مادة المعامل السالب: المقاومة عند الصفر المئوي',unit:'Ω',value:100,min:0.01,max:100000},
   {k:'an',label:'مادة المعامل السالب: المعامل الحراري α<sub>0</sub> (سالب)',unit:'°C⁻¹',value:-0.002,min:-0.0049,max:-0.00001,step:0.0001},
   {k:'Tc',label:'فائق التوصيل: الدرجة الحرجة T<sub>c</sub>',unit:'K',value:9.2,min:0.5,max:29,step:0.1},
   {k:'Rn',label:'فائق التوصيل: المقاومة فوق T<sub>c</sub>',unit:'Ω',value:0.5,min:0.001,max:1000}],()=>{draw();steps.redraw()});
  const P=()=>mode==='neg'?{R0:TP.v.Rn0,a:TP.v.an}:{R0,a:a0};
  const RT=x=>{const p=P();return p.R0*(1+p.a*x)};
  const Rnow=()=>mode==='sc'?(Tk<TP.v.Tc?0:TP.v.Rn):RT(T);
  const ui=()=>{$('#c33pos').style.display=mode==='pos'?'':'none';$('#c33Tw').style.display=mode==='sc'?'none':'';$('#c33Kw').style.display=mode==='sc'?'':'none';$('#c33t1').style.display=mode==='sc'?'none':'';$('#c33R0').value=R0;$('#c33a0').value=a0};
  const viewSVG=()=>{const hot=mode==='sc'?0:clamp((T+50)/250,0,1),cold=mode==='sc'?clamp(1-Tk/30,0,1):clamp(-T/50,0,1);const R=Rnow();
   let s=`<svg viewBox="0 0 340 230" role="img" aria-label="موصل داخل حمام حراري مع مقياس أوم">`;
   s+=`<rect x="20" y="20" width="200" height="150" rx="14" fill="var(--live-soft)" opacity="${fx(0.15+0.85*hot)}" stroke="var(--fg)" stroke-width="1.6"/><rect x="20" y="20" width="200" height="150" rx="14" fill="var(--blue-soft)" opacity="${fx(cold)}"/>`;
   s+=`<path class="w" d="${zigD([40,95],[200,95],8)}" style="stroke:var(--fg);stroke-width:3"/><path class="w" d="M40 95H20M200 95H230V60H262M20 95H8V200H262" style="stroke:var(--fg)"/>`;
   s+=`<rect x="250" y="40" width="80" height="120" rx="10" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.6"/><rect x="258" y="54" width="64" height="30" rx="4" fill="var(--surface)" stroke="var(--line)"/>`+S.t(290,74,R<1e-9?'0.000':fm(+R.toPrecision(4)),'b',null,13)+S.t(290,104,'Ω','',null,16)+S.t(290,148,'OHM','m');
   s+=`<path d="M262 60V48M262 200V160" stroke="var(--fg)" stroke-width="2"/>`;
   const th=mode==='sc'?Tk:T,tl=mode==='sc'?fm(Tk,1)+' K':fm(T,0)+' °C';s+=arT(120,195,mode==='sc'?'تبريد شديد (درجات مطلقة)':T>=0?'تسخين':'تبريد',{fs:13});s+=S.t(120,48,tl,'',null,16);
   return s+'</svg>'};
  const draw=()=>{setV(el,'c33T',fm(T,0)+' °C');setV(el,'c33K',fm(Tk,1)+' K');setV(el,'c33T1',fm(T1,0)+' °C');
   $('#c33v').innerHTML=viewSVG();const R=Rnow();
   if(mode==='sc'){$('#c33ph').textContent='الشكل (3-5ب)';const Rn=TP.v.Rn,Tc=TP.v.Tc;const ym=niceMax(Rn*1.3);
    $('#c33p').innerHTML=plotSVG({w:560,h:280,x0:0,x1:30,y0:0,y1:ym*1.05,xt:[0,5,10,15,20,25,30],yt:ticks(ym,5),yf:v=>fm(v),xl:'T (K)',yl:'R (Ω)',aria:'مقاومة مادة فائقة التوصيل',
     series:[{pts:[[0,0],[Tc,0],[Tc,Rn],[30,Rn]],col:'--blue',w:2.6}],extra:(X,Y)=>`<circle cx="${fx(X(Tk))}" cy="${fx(Y(R))}" r="7" fill="var(--live)" stroke="var(--surface)" stroke-width="2"/>`+S.t(fx(X(Tc)),fx(Y(0)-8),'Tc = '+fm(Tc)+' K','b','start')})}
   else{$('#c33ph').textContent='المعادلة (3-12) — مثل الشكل (3-5أ) لكن للمقاومة R';const p=P();const lo=RT(-50),hi=RT(200);const ym=niceMax(Math.max(lo,hi)*1.1);
    $('#c33p').innerHTML=plotSVG({w:560,h:280,x0:-50,x1:200,y0:0,y1:ym*1.05,xt:[-50,0,50,100,150,200],yt:ticks(ym,5),yf:v=>fm(v),xl:'T (°C)',yl:'R (Ω)',aria:'المقاومة مع درجة الحرارة',
     series:[{pts:[[-50,lo],[200,hi]],col:'--blue',w:2.6}],extra:(X,Y)=>`<path d="M${fx(X(T1))} ${fx(Y(0))}V${fx(Y(RT(T1)))}" stroke="var(--muted)" stroke-dasharray="4 4"/><circle cx="${fx(X(T1))}" cy="${fx(Y(RT(T1)))}" r="5" fill="var(--muted)"/>`+S.t(fx(X(T1)),fx(Y(0)-6),'T1','m')+`<circle cx="${fx(X(0))}" cy="${fx(Y(p.R0))}" r="4" fill="var(--fg)"/>`+S.t(fx(X(0)+6),fx(Y(p.R0)-8),'R0','','start')+`<circle cx="${fx(X(T))}" cy="${fx(Y(R))}" r="7" fill="var(--live)" stroke="var(--surface)" stroke-width="2"/>`});
    const aT1=p.a/(1+p.a*T1),RT1=RT(T1);$('#c33RT1').textContent=fm(+RT1.toPrecision(6))+' Ω';$('#c33aT1').textContent=sciT(aT1,4)+' °C⁻¹';$('#c33R14').textContent=fm(+(RT1*(1+aT1*(T-T1))).toPrecision(6))+' Ω'}
   $('#c33R').textContent=R<1e-12?'0 Ω':fm(+R.toPrecision(6))+' Ω';
   const p=P();$('#c33d').textContent=mode==='sc'?'—':(R>=p.R0?'+':'')+fm(B.round((R/p.R0-1)*100,2))+' %';
   const ch=$('#c33ch');if(mode==='sc'){ch.innerHTML=R===0?'<span class="c3-chip ok">مقاومة صفر</span>':'<span class="c3-chip">مقاومة عادية</span>'}else ch.innerHTML=p.a>0?'<span class="c3-chip hot">ترتفع مع الحرارة</span>':'<span class="c3-chip">تنخفض مع الحرارة</span>'};
  segBind(el,'md',v=>{mode=v;ui();draw()});
  el.querySelectorAll('[data-pr]').forEach(b=>b.onclick=()=>{const k=b.dataset.pr;if(k==='33'){R0=23.9286;a0=0.002985}else if(k==='32'){R0=7;a0=+(0.8/1400).toPrecision(5)}else{a0=+(0.00393/(1-20*0.00393)).toPrecision(5);R0=+(55/(1+20*a0)).toPrecision(6)}ui();draw()});
  $('#c33R0').oninput=e=>{const v=parseFloat(e.target.value);if(isFinite(v)&&v>0){R0=v;draw()}};
  $('#c33a0').oninput=e=>{const v=parseFloat(e.target.value);if(isFinite(v)&&v>-0.0049&&v<0.05){a0=v;draw()}};
  $('#c33T').oninput=e=>{T=+e.target.value;draw()};$('#c33K').oninput=e=>{Tk=+e.target.value;draw()};$('#c33T1').oninput=e=>{T1=+e.target.value;draw()};
  const is33=()=>mode==='pos'&&near(R0,23.9286,1e-3)&&near(a0,0.002985,1e-7),is32=()=>mode==='pos'&&near(R0,7)&&near(a0,0.8/1400,1e-8);
  const steps=stepsUI($('#c33st'),[
   {t:'مثال (3-3) عند 15°C',x:'اختر «معدن» واضغط «مثال (3-3)» ثم اجعل <span class="ltr">T = 15 °C</span>: المقاومة <span class="ltr">25 Ω</span>.',done:()=>is33()&&T===15},
   {t:'زيادة 10%',x:'ارفع الحرارة إلى <span class="ltr">50 °C</span>: المقاومة <span class="ltr">27.5 Ω</span> أي زادت 10% (2.5 Ω) كما في المثال.',done:()=>is33()&&T===50},
   {t:'متى تصبح 30 Ω؟',x:'حرّك الحرارة حتى تقرأ نحو <span class="ltr">30 Ω</span>: تجدها عند <span class="ltr">85 °C</span>، أي أعلى من المحيط (20°C) بـ <span class="ltr">65 °C</span>.',done:()=>is33()&&T===85},
   {t:'المعامل المنسوب إلى 200°C',x:'اضغط «مثال (3-2)» (7 Ω عند الصفر) واجعل <span class="ltr">T<sub>1</sub> = 200 °C</span>: \\(R_{T_1}=7.8\\ \\Omega\\) و \\(\\alpha_{200}=5.128\\times10^{-4}\\) — نتيجة مثال (3-2). لاحظ أنه أصغر من \\(\\alpha_0\\).',done:()=>is32()&&T1===200},
   {t:'معامل سالب',get x(){return `اختر «سائل موصل / شبه موصل» وارفع الحرارة إلى <span class="ltr">150 °C</span> أو أكثر: تنخفض المقاومة من <span class="ltr">${fm(+TP.v.Rn0.toPrecision(5))} Ω</span> إلى نحو <span class="ltr">${fm(+(TP.v.Rn0*(1+TP.v.an*150)).toPrecision(4))} Ω</span> (أرقام توضيحية بالمعادلة 3-12 مع معامل سالب).`},done:()=>mode==='neg'&&T>=150},
   {t:'فائق التوصيل',get x(){return `اختر «فائق التوصيل» وبرّد المادة تحت <span class="ltr">T<sub>c</sub> = ${fm(TP.v.Tc)} K</span>: تختفي المقاومة تماماً (الشكل 3-5ب).`},done:()=>mode==='sc'&&Tk<TP.v.Tc}
  ]);
  ui();draw();loopOn(el,()=>steps.check());
 },
 examples:[
  {title:'مثال (3-2)',ref:'ص 54',q:'<p>إذا كانت مقاومة موصل معدني <span class="ltr">7 Ω</span> عند <span class="ltr">0°C</span>، وتصبح <span class="ltr">7.8 Ω</span> عند <span class="ltr">200°C</span>، احسب معامل درجة حرارة المعدن عند <span class="ltr">200°C</span>.</p>',
   given:[{id:'R0',label:'المقاومة عند 0°C',sym:'R_0',unit:'Ω',value:7},{id:'RT',label:'المقاومة عند الحرارة الأعلى',sym:'R_T',unit:'Ω',value:7.8},{id:'T',label:'الحرارة الأعلى',sym:'T',unit:'°C',value:200}],
   solve:g=>ex32Steps(g),note:'الكتاب طبع إشارة سالبة في السطر الأوسط ثم النتيجة موجبة؛ الحاسبة تعرض الحساب بالإشارة الصحيحة، والنتيجة \\(5.128\\times10^{-4}\\) كما في الكتاب.'},
  {title:'مثال (3-3)',ref:'ص 55',q:'<p>موصل مقاومته <span class="ltr">25 Ω</span> تزداد مقاومته بمقدار <span class="ltr">10%</span> عندما تزداد درجة حرارته من <span class="ltr">15°</span> إلى <span class="ltr">50°C</span>، احسب متوسط ارتفاع درجة حرارة الموصل عند درجة حرارة محيطة تبلغ <span class="ltr">20°C</span> عندما تكون مقاومته <span class="ltr">30 Ω</span> ويكون معامل درجة الحرارة ثابتاً.</p>',
   given:[{id:'R1',label:'المقاومة عند الحرارة الأولى',sym:'R_{T_1}',unit:'Ω',value:25},{id:'p',label:'نسبة الزيادة',sym:'',unit:'%',value:10},{id:'T1',label:'الحرارة الأولى',sym:'T_1',unit:'°C',value:15},{id:'T2',label:'الحرارة الثانية',sym:'T_2',unit:'°C',value:50},{id:'Rx',label:'المقاومة المطلوب حرارتها',sym:'R_T',unit:'Ω',value:30},{id:'Ta',label:'درجة الحرارة المحيطة',sym:'T_a',unit:'°C',value:20}],
   solve:g=>ex33Steps(g),note:'تقريب الكتاب: \\(\\alpha_0\\) مقطوعة عند الرقم العشري السابع (0.0029850، والأدق 0.0029851)، و\\(R_0\\) بأربعة أرقام عشرية، و\\(T\\) لأقرب درجة. الحل بقسمة المعادلتين توضيح لعبارة الكتاب «بحل المعادلتين السابقتين معاً».'}
 ],
 quiz:[
  {q:'المعادلة التي تعطي المقاومة عند درجة الحرارة T بدلالة المقاومة عند الصفر المئوي:',o:['\\(R_T=R_0(1-\\alpha_0T)\\)','\\(R_T=R_0(1+\\alpha_0T)\\)','\\(R_T=R_0\\,\\alpha_0\\,T\\)','\\(R_T=R_0/(1+\\alpha_0T)\\)'],c:1,e:'المعادلة (3-12).'},
  {q:'المعامل الحراري للموصلات المعدنية:',o:['موجب: المقاومة تزيد بارتفاع الحرارة','سالب','صفر','يتغير إشارته'],c:0,e:'ص 53.'},
  {q:'لماذا تنخفض مقاومة السوائل الموصلة بارتفاع الحرارة؟',o:['لزيادة لزوجتها','لانخفاض لزوجة المحلول فتزيد سرعة الأيونات','لزيادة طولها','لأنها فائقة التوصيل'],c:1,e:'ص 53.'},
  {q:'سبب نقص مقاومة أشباه الموصلات بارتفاع الحرارة:',o:['زيادة عدد الإلكترونات الحرة','نقص عدد الإلكترونات','تمدد المادة','انخفاض اللزوجة'],c:0,e:'ص 53.'},
  {q:'في المواد فائقة التوصيل تحت الدرجة الحرجة تكون المقاومة:',o:['كبيرة جداً','صفراً','سالبة','مثل المعادن'],c:1,e:'ص 53 والشكل (3-5ب).'},
  {q:'سلك مقاومته <span class="ltr">10 Ω</span> عند <span class="ltr">0°C</span> و \\(\\alpha_0=0.004\\). مقاومته عند <span class="ltr">50°C</span>:',o:['10.2 Ω','12 Ω','14 Ω','20 Ω'],c:1,e:'\\(10(1+0.004\\times50)=12\\ \\Omega\\).'},
  {q:'\\(\\alpha_{T_1}\\) في المعادلة (3-15) مقارنة بـ \\(\\alpha_0\\) لمعدن (عند \\(T_1\\) موجبة):',o:['أكبر','أصغر','مساوٍ','سالب'],c:1,e:'\\(\\alpha_{T_1}=\\alpha_0/(1+\\alpha_0T_1)\\) والمقام أكبر من 1 (مثال 3-2: 5.128×10⁻⁴ أصغر من 5.714×10⁻⁴).'}
 ]
});

/* ======================================================================
   Lesson 4 — electric power, energy, efficiency (ص 56–59), أمثلة (3-4) … (3-8)
   ====================================================================== */
/* energy flow (توضيح) */
function flowSVG(){let s=`<svg viewBox="0 0 560 170" role="img" aria-label="مسار القدرة من المنبع إلى الحمل">`;
  s+=`<rect x="20" y="50" width="130" height="70" rx="10" fill="var(--blue-soft)" stroke="var(--blue)"/>`+arT(85,80,'المنبع',{fs:14})+S.t(85,104,'Pi = E I','b');
  s+=`<rect x="400" y="50" width="140" height="70" rx="10" fill="var(--on-soft)" stroke="var(--on)"/>`+arT(470,80,'الحمل',{fs:14})+S.t(470,104,'Po','b');
  s+=`<path d="M150 72H400V98H150Z" fill="var(--blue-soft)" opacity=".6"/><path d="M262 98C262 130 270 140 290 150H320C300 140 292 130 292 98Z" fill="var(--stop-soft)" stroke="var(--stop)"/>`+arrow(300,85,396,85,'--on',3)+arT(300,166,'المفقود في الموصلات Ploss = I²R',{fs:12.5,col:'--stop'});
  s+=S.t(275,40,'Pi = Po + Ploss','',null,13)+S.t(275,24,'η = Po / Pi','b',null,13);
  return s+'</svg>'}
function meterKWh(kwh,ang){let s=`<svg viewBox="0 0 220 200" role="img" aria-label="عداد الطاقة">`;
  s+=`<rect x="20" y="10" width="180" height="180" rx="14" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.6"/><rect x="40" y="30" width="140" height="36" rx="4" fill="var(--surface)" stroke="var(--line)"/>`+S.t(110,54,fm(B.round(kwh,1),1),'b',null,17)+S.t(110,84,'kWh','m');
  s+=`<ellipse cx="110" cy="140" rx="70" ry="14" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.4"/>`;const x=110+64*Math.cos(ang);s+=`<rect x="${fx(x-5)}" y="128" width="10" height="24" fill="var(--stop)" opacity="${fx(0.4+0.6*Math.abs(Math.sin(ang+1.57)))}"/>`;
  return s+'</svg>'}

B.lesson({
 id:'u3-l4',unit:3,order:4,pages:'56–59',
 title:'القدرة والطاقة الكهربائية والكفاءة',
 summary:'القدرة معدل تحول الطاقة P = VI = I²R = V²/R، وقدرة المنبع P = EI، والطاقة W = P·t، والكفاءة η = Po/Pi حيث Pi = Po + Ploss. مع الأمثلة (3-4) إلى (3-8).',
 theory:[
  {h:'القدرة والطاقة الكهربائية (Electric Power and Energy)',ref:'ص 56',html:`<p>عند مرور تيار كهربائي قدره \\(I\\) في موصل مقاومته \\(R\\) فإن طاقة كهربائية تتحول إلى <b>طاقة حرارية</b> تعمل على رفع درجة حرارة المقاومة. فإذا كان الجهد بين طرفي هذا الموصل هو \\(V\\) فإن شحنة قدرها \\(dQ\\) تمر في زمن قدره \\(dt\\) تعطى بالعلاقة:</p>
   $$dQ=I\\,dt$$
   <p>وتكون بالتالي الطاقة التي تكتسبها هذه الشحنة:</p>
   $$dW=V\\,dQ=V\\,I\\,dt$$
   <p>والقدرة الكهربائية التي تعرف على أنها <b>معدل تغير الطاقة بالنسبة للزمن</b> تكون:</p>
   $$P=\\frac{dW}{dt}=\\frac{V\\,I\\,dt}{dt}=V\\,I\\qquad (3\\text{-}16)$$
   <p>أي أن القدرة الكهربائية \\(P\\) تعطى قيمتها من شدة التيار وفرق الجهد، ووحدتها <span class="ltr">joule/s</span> أو <b>الوات (Watt)</b>. ومن قانون أوم نجد أن \\(V=I\\times R\\) و \\(I=V/R\\)، لذلك يمكن أن تأخذ القدرة \\(P\\) الصور التالية:</p>
   $$P=V\\times I=I^2R=\\frac{V^2}{R}\\quad \\text{Watt}\\qquad (3\\text{-}17)$$
   <p>في حالة <b>المنبع الكهربائي</b> فإن الشحنة تتحرك داخله من النقطة الأقل جهداً إلى النقطة الأعلى جهداً، أي أنها تكتسب طاقة كهربائية أثناء مرورها داخل المنبع، وهذا لابد أن يأتي من صورة مختلفة من صور الطاقة؛ فإذا كان المنبع بطارية فإن الطاقة الكيميائية تتحول إلى طاقة كهربائية، وتكون القدرة في هذه الحالة:</p>
   $$P=E\\times I\\quad \\text{Watt}\\qquad (3\\text{-}18)$$
   <p>حيث \\(E\\) هي القوة الدافعة الكهربائية للبطارية. ويمكننا الحصول على الطاقة الكهربائية المفقودة أو المكتسبة \\(W\\) كالآتي:</p>
   $$W=P\\times t\\quad (\\text{Watt-sec or Joules})\\qquad (3\\text{-}19)$$`},
  {note:ADD+'الصيغ الثلاث في (3-17) متساوية؛ نختار التي معطياتها عندنا: نعرف التيار والمقاومة ← \\(I^2R\\)، نعرف الجهد والمقاومة ← \\(V^2/R\\). وفي فواتير الكهرباء تقاس الطاقة بالكيلووات ساعة: <span class="ltr">1 kWh = 1000 W × 3600 s = 3.6 × 10⁶ J</span>.'},
  {h:'الكفاءة (Efficiency)',ref:'ص 57',html:`<p>تنتقل الطاقة الكهربائية من المصدر الكهربائي إلى الأحمال عبر الموصلات الكهربائية، ويمكننا أن نعرف عندئذ <b>الكفاءة</b> \\(\\eta\\) للنظام كالآتي:</p>
   $$\\eta=\\frac{P_o}{P_i}\\qquad (3\\text{-}20)$$
   <p>حيث \\(P_o\\) القدرة الخارجة بالوات (قدرة الحمل) و\\(P_i\\) القدرة الداخلة بالوات (قدرة المنبع) والتي يمكن حسابها كالآتي:</p>
   $$P_i=E\\times I\\quad \\text{Watt}\\qquad (3\\text{-}21)$$
   <p>حيث \\(E\\) جهد المنبع و\\(I\\) التيار الداخل. ويمكن كذلك حساب \\(P_i\\) كما يلي:</p>
   $$P_i=P_o+P_{loss}\\qquad (3\\text{-}22)$$
   <p>حيث \\(P_{loss}\\) هي القدرة المفقودة في الموصل، والتي يمكن حسابها كالآتي: \\(P_{loss}=I^2R\\)، حيث \\(I\\) شدة التيار و\\(R\\) المقاومة. ويمكننا كذلك أن نعرف الكفاءة بدلالة الطاقة:</p>
   $$\\eta=\\frac{W_o}{W_i}$$
   <p>حيث \\(W_o\\) الطاقة الخارجة و\\(W_i\\) الطاقة الداخلة.</p>`},
  {fig:'',ref:'',caption:'<b>توضيح للمتدرب — ليس من الكتاب:</b> مسار القدرة: ما يعطيه المنبع \\(P_i\\) يصل معظمه إلى الحمل \\(P_o\\)، والباقي يتحول حرارة في الموصلات \\(P_{loss}\\). الكفاءة أقل من 1 دائماً، وتقرب من 1 كلما قلت المفاقيد.',draw:()=>box(flowSVG(),540)},
  {h:'الأمثلة (3-4) إلى (3-8)',ref:'ص 57–59',html:`<table class="tt"><thead><tr><th>المثال</th><th>المطلوب</th><th>النتيجة</th></tr></thead><tbody>
   <tr><td>(3-4) ص 57</td><td>التيار في 2 kΩ عند 16 V</td><td>8 mA</td></tr>
   <tr><td>(3-5) ص 58</td><td>القدرة المفقودة في 5 Ω يمر بها 4 A</td><td>80 W</td></tr>
   <tr><td>(3-6) ص 58</td><td>طاقة مصباح 60 W لمدة سنة</td><td>525.6 kWh</td></tr>
   <tr><td>(3-7) ص 58–59</td><td>قدرة محرك كفاءته 80% يأخذ 8 A عند 120 V</td><td>768 W = 1.029 hp</td></tr>
   <tr><td>(3-8) ص 59</td><td>ملف نحاسي 220 W عند 110 V و 20°C، قدرته عند 120°C</td><td>157.93 W</td></tr></tbody></table>
   <p>كل مثال محلول خطوة بخطوة في تبويب «الأمثلة المحلولة»، والمثالان (3-5) و(3-7) والمثال (3-6) حية في «المختبر».</p>`},
  {note:ADD+'في مثال (3-8) تقل القدرة عند ارتفاع الحرارة لأن مقاومة النحاس تزيد (الدرس السابق) والجهد ثابت، و\\(P=V^2/R\\). وفي مثال (3-7) الحصان <span class="ltr">1 hp = 746 W</span>.'},
  notesBlock(['في مثال (3-6) ص 58 طُبعت الوحدة «KWh» والصحيح <span class="ltr">kWh</span> (الحرف k صغير).','في مثال (3-7) ص 59 طُبع «hourse_Power» والصحيح <span class="ltr">horse power (hp)</span>.','في مثال (3-8) ص 59 طُبع \\(R_{20}=55\\) بلا وحدة، والوحدة Ω.'])
 ],
 lab:(el)=>{
  let E=120,r=3,RL=12,Pw=60,h=24,ang=0;
  el.innerHTML=`<div class="grid c3-lab">
   <div class="panel c7"><h2>من المنبع إلى الحمل عبر الموصلات <small>المعادلات (3-16) إلى (3-22)</small></h2>
    <div class="c3-row"><span class="sub">قيم جاهزة:</span><button class="btn" id="c34x7">مثال (3-7)</button><button class="btn" id="c34x5">مثال (3-5)</button></div>
    ${sl('c34E','جهد المنبع E',0,240,1,E)}${sl('c34r','مقاومة الموصلات (الخطين معاً) R',0,10,0.5,r)}${sl('c34L','مقاومة الحمل R<sub>L</sub>',1,100,1,RL)}
    <div class="svgbox" id="c34c" style="max-width:520px;margin-inline:auto"></div>
    <p class="sub">الحمل هنا مقاومة (سخان مثلاً). في مثال (3-7) الحمل محرك: مثلناه بمقاومة <span class="ltr">12 Ω</span> وموصلات <span class="ltr">3 Ω</span> حتى نحصل على أرقام المثال (8 A و 80%) — هذا التقسيم توضيح منا، والكتاب يعطي الكفاءة مباشرة.</p></div>
   <div class="panel c5"><h2>القدرات والكفاءة</h2>
    <div class="facts">${fact('التيار I = E / (R + R<sub>L</sub>)','c34I')}${fact('قدرة المنبع P<sub>i</sub> = E I (3-21)','c34Pi')}${fact('المفقود P<sub>loss</sub> = I²R','c34Pl')}${fact('قدرة الحمل P<sub>o</sub> = I²R<sub>L</sub>','c34Po')}${fact('الكفاءة η = P<sub>o</sub>/P<sub>i</sub> (3-20)','c34eta')}${fact('P<sub>o</sub> بالحصان (÷ 746)','c34hp')}</div>
    <div class="c3-bar" id="c34bar"></div><p class="sub" id="c34chk"></p></div>
   <div class="panel c12"><h2>عداد الطاقة W = P × t <small>المعادلة (3-19) ومثال (3-6)</small></h2>
    <div class="grid" style="margin-top:0"><div class="c7">${sl('c34P','قدرة الجهاز P',0,2000,10,Pw)}${sl('c34h','مدة التشغيل t',0,8760,1,h)}
     <div class="c3-row"><span class="sub">المدة:</span><button class="btn" data-hh="1">ساعة</button><button class="btn" data-hh="24">يوم</button><button class="btn" data-hh="168">أسبوع</button><button class="btn" data-hh="720">شهر (30 يوماً)</button><button class="btn" data-hh="8760">سنة</button><button class="btn" id="c34x6">مثال (3-6)</button></div>
     <div class="facts">${fact('W بالوات ساعة','c34Wh')}${fact('W بالكيلووات ساعة','c34kWh')}${fact('W بالجول (W·s)','c34J')}</div></div>
     <div class="c5"><div class="svgbox" id="c34m" style="max-width:220px;margin-inline:auto"></div><p class="sub" style="text-align:center">قرص العداد يدور أسرع كلما زادت القدرة (سرعة الرسم توضيحية).</p></div></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="c34st"></ol></div></div>`;
  const $=s=>el.querySelector(s);
  const calc=()=>{const I=E/(r+RL);const Pi=E*I,Pl=I*I*r,Po=I*I*RL;return {I,Pi,Pl,Po,eta:Pi>0?Po/Pi:NaN}};
  const draw=()=>{setV(el,'c34E',fm(E)+' V');setV(el,'c34r',fm(r,1)+' Ω');setV(el,'c34L',fm(RL)+' Ω');const c=calc();
   const sp=loopSpec({w:440,h:260,x0:60,y0:50,x1:330,y1:210,left:[{k:'E',plus:'t',lab:['E = '+fm(E)+' V'],side:-1}],top:[{k:'W'},{k:'R',lab:['R/2 = '+fm(r/2,2)+' Ω']}],right:[{k:'R',lab:['RL = '+fm(RL)+' Ω','VL = '+fm(B.round(c.I*RL,2))+' V']}],bottom:[{k:'R',lab:['R/2 = '+fm(r/2,2)+' Ω']}]});
   $('#c34c').innerHTML=circ(sp,{flow:E>0?sp.edges.map(()=>1):null,extra:meterSVG(127,50,'A',fm(B.round(c.I,3))+' A')});
   $('#c34I').textContent=fm(B.round(c.I,3))+' A';$('#c34Pi').textContent=fm(B.round(c.Pi,2))+' W';$('#c34Pl').textContent=fm(B.round(c.Pl,2))+' W';$('#c34Po').textContent=fm(B.round(c.Po,2))+' W';
   $('#c34eta').textContent=isFinite(c.eta)?fm(B.round(c.eta*100,2))+' %':'—';$('#c34hp').textContent=fm(B.round(c.Po/746,3))+' hp';
   const po=c.Pi>0?c.Po/c.Pi*100:0;$('#c34bar').innerHTML=c.Pi>0?`<span style="width:${fx(po)}%;background:var(--on)">Po ${fm(B.round(po,1))}%</span><span style="width:${fx(100-po)}%;background:var(--stop)">${100-po>8?'Ploss '+fm(B.round(100-po,1))+'%':''}</span>`:'';
   $('#c34chk').innerHTML=c.Pi>0?`التحقق من (3-22): <span class="ltr">P<sub>o</sub> + P<sub>loss</sub> = ${fm(B.round(c.Po,2))} + ${fm(B.round(c.Pl,2))} = ${fm(B.round(c.Po+c.Pl,2))} W = P<sub>i</sub></span>`:'المنبع صفر: لا تيار ولا قدرة.';
   setV(el,'c34P',fm(Pw)+' W');setV(el,'c34h',fm(h)+' h');const Wh=Pw*h;$('#c34Wh').textContent=fm(Wh)+' Wh';$('#c34kWh').textContent=fm(B.round(Wh/1000,3))+' kWh';$('#c34J').textContent=sciT(Wh*3600,3)+' J'};
  const ui=()=>{$('#c34E').value=E;$('#c34r').value=r;$('#c34L').value=RL;$('#c34P').value=Pw;$('#c34h').value=h};
  $('#c34E').oninput=e=>{E=+e.target.value;draw()};$('#c34r').oninput=e=>{r=+e.target.value;draw()};$('#c34L').oninput=e=>{RL=+e.target.value;draw()};
  $('#c34P').oninput=e=>{Pw=+e.target.value;draw()};$('#c34h').oninput=e=>{h=+e.target.value;draw()};
  el.querySelectorAll('[data-hh]').forEach(b=>b.onclick=()=>{h=+b.dataset.hh;ui();draw()});
  $('#c34x7').onclick=()=>{E=120;r=3;RL=12;ui();draw()};$('#c34x5').onclick=()=>{E=20;r=0;RL=5;ui();draw()};$('#c34x6').onclick=()=>{Pw=60;h=8760;ui();draw()};
  const steps=stepsUI($('#c34st'),[
   {t:'مثال (3-7)',x:'اضغط «مثال (3-7)»: المنبع <span class="ltr">120 V</span> والتيار <span class="ltr">8 A</span>، فالقدرة الداخلة <span class="ltr">960 W</span>، وقدرة الحمل <span class="ltr">768 W = 1.029 hp</span>، والكفاءة <span class="ltr">80%</span>.',done:()=>E===120&&r===3&&RL===12},
   {t:'موصلات مثالية',x:'اجعل مقاومة الموصلات <span class="ltr">0</span>: لا مفاقيد فتصبح الكفاءة <span class="ltr">100%</span> وكل القدرة تصل الحمل.',done:()=>r===0&&E>0},
   {t:'موصلات أطول',x:'ارجع إلى <span class="ltr">E = 120 V</span> و <span class="ltr">R<sub>L</sub> = 12 Ω</span> واجعل R = <span class="ltr">6 Ω</span>: يقل التيار وتزيد نسبة المفقود فتنخفض الكفاءة إلى نحو <span class="ltr">66.7%</span>.',done:()=>E===120&&r===6&&RL===12},
   {t:'مثال (3-5)',x:'اضغط «مثال (3-5)» (أو اضبط <span class="ltr">E = 20 V</span> و <span class="ltr">R = 0</span> و <span class="ltr">R<sub>L</sub> = 5 Ω</span>): يمر <span class="ltr">4 A</span> وقدرة المقاومة \\(I^2R = 4^2\\times5 = 80\\) W.',done:()=>E===20&&r===0&&RL===5},
   {t:'مثال (3-6)',x:'في عداد الطاقة اجعل <span class="ltr">P = 60 W</span> والمدة سنة (<span class="ltr">8760 h</span>): الطاقة <span class="ltr">525.6 kWh</span>.',done:()=>Pw===60&&h===8760},
   {t:'ضاعف القدرة',x:'ضاعف القدرة إلى <span class="ltr">120 W</span> لنفس المدة: تتضاعف الطاقة (\\(W = P\\,t\\)) ويدور القرص أسرع.',done:()=>Pw===120&&h===8760}
  ]);
  ui();draw();
  loopOn(el,dt=>{ang=(ang+dt*Pw/120)%(2*Math.PI);$('#c34m').innerHTML=meterKWh(Pw*h/1000,ang);steps.check()});
 },
 examples:[
  {title:'مثال (3-4)',ref:'ص 57',q:'<p>احسب التيار المار في المقاومة <span class="ltr">2 kΩ</span> إذا كان فرق الجهد بين طرفيها <span class="ltr">16 V</span>.</p>',
   given:[{id:'V',label:'فرق الجهد',sym:'V',unit:'V',value:16},{id:'R',label:'المقاومة',sym:'R',unit:'kΩ',value:2}],
   solve:g=>[{t:'طبقاً لقانون أوم:',f:`I=\\frac{V}{R}=\\frac{${fm(g.V)}}{${fm(B.round(g.R*1000,6))}}`,v:B.round(g.V/g.R,4),unit:'mA',final:true}]},
  {title:'مثال (3-5)',ref:'ص 58',q:'<p>احسب القدرة المفقودة في المقاومة <span class="ltr">5 Ω</span> إذا كان التيار المار بها <span class="ltr">4 A</span>.</p>',
   given:[{id:'R',label:'المقاومة',sym:'R',unit:'Ω',value:5},{id:'I',label:'التيار',sym:'I',unit:'A',value:4}],
   solve:g=>[{t:'القدرة المفقودة في المقاومة من (3-17):',f:`P=I^2R=(${fm(g.I)})^2(${fm(g.R)})`,v:B.round(g.I*g.I*g.R,4),unit:'W',final:true}]},
  {title:'مثال (3-6)',ref:'ص 58',q:'<p>احسب الطاقة الكهربائية اللازمة لإضاءة مصباح كهربائي قدرته <span class="ltr">60 W</span> لمدة سنة.</p>',
   given:[{id:'P',label:'قدرة المصباح',sym:'P',unit:'W',value:60},{id:'h',label:'ساعات اليوم',sym:'',unit:'h',value:24},{id:'d',label:'عدد الأيام',sym:'',unit:'يوم',value:365}],
   solve:g=>{const W=g.P*g.h*g.d/1000;return [{t:'من المعادلة (3-19) والزمن بالساعات:',f:`W=P\\times t=\\frac{${fm(g.P)}\\,(${fm(g.h)})(${fm(g.d)})}{1000}`,v:B.round(W,4),unit:'kWh',final:true},
    {t:'نفس الطاقة بالجول (توضيح، ليس من الكتاب: 1 kWh = 3.6 × 10⁶ J):',v:sciT(W*3.6e6,4),unit:'J'}]}},
  {title:'مثال (3-7)',ref:'ص 58–59',q:'<p>احسب قدرة المحرك الكهربائي إذا كانت الكفاءة <span class="ltr">80%</span> وكان التيار المغذي للمحرك <span class="ltr">8 A</span> عند جهد <span class="ltr">120 V</span>.</p>',
   given:[{id:'eta',label:'الكفاءة',sym:'\\eta',unit:'%',value:80},{id:'I',label:'التيار',sym:'I',unit:'A',value:8},{id:'V',label:'الجهد',sym:'V',unit:'V',value:120}],
   solve:g=>{const Pi=g.V*g.I,e=g.eta/100,Po=B.round(e*Pi,4);return [
    {t:'الكفاءة تعطى بالعلاقة:',f:'\\eta\\,\\% =\\frac{P_o}{P_i}\\,(100\\,\\%)'},
    {t:'القدرة الداخلة:',f:`P_i=V\\,I=(${fm(g.V)})(${fm(g.I)})`,v:B.round(Pi,4),unit:'W'},
    {t:'ولذلك نحصل على قدرة المحرك:',f:`${fm(e)}=\\frac{P_o}{${fm(B.round(Pi,4))}}\\;\\Rightarrow\\;P_o=(${fm(e)})\\times(${fm(B.round(Pi,4))})`,v:Po,unit:'W',final:true},
    {t:'قدرة المحرك بالحصان:',f:`P_o=${fm(Po)}\\ \\text{W}\\left(\\frac{1\\ \\text{hp}}{746\\ \\text{W}}\\right)`,v:B.round(Po/746,3),unit:'hp',dp:3,final:true},
    {t:'المفقود (توضيح، ليس من الكتاب) من (3-22):',f:`P_{loss}=P_i-P_o`,v:B.round(Pi-Po,4),unit:'W'}]}},
  {title:'مثال (3-8)',ref:'ص 59',q:'<p>تبلغ القدرة التي يأخذها ملف مقاوم مصنوع من سلك نحاسي <span class="ltr">220 W</span> عند <span class="ltr">110 V</span> و <span class="ltr">20°C</span>. احسب القدرة التي يستهلكها الملف عند <span class="ltr">110 V</span> و <span class="ltr">120°C</span>، إذا كان معامل درجة الحرارة عند <span class="ltr">20°C</span> هو <span class="ltr">0.00393 °C⁻¹</span>.</p>',
   given:[{id:'P1',label:'القدرة عند الحرارة الأولى',sym:'P_{20}',unit:'W',value:220},{id:'V',label:'الجهد',sym:'V',unit:'V',value:110},{id:'T1',label:'الحرارة الأولى',sym:'T_1',unit:'°C',value:20},{id:'T2',label:'الحرارة الثانية',sym:'T_2',unit:'°C',value:120},{id:'a',label:'معامل الحرارة عند T₁',sym:'\\alpha_{20}',unit:'°C⁻¹',value:0.00393}],
   solve:g=>{const R1=B.round(g.V*g.V/g.P1,4),R2=B.round(R1*(1+g.a*(g.T2-g.T1)),3),P2=B.round(g.V*g.V/R2,2);return [
    {t:'من (3-17):',f:`P_{${fm(g.T1)}}=\\frac{V^2}{R_{${fm(g.T1)}}}\\;\\Rightarrow\\;R_{${fm(g.T1)}}=\\frac{V^2}{P_{${fm(g.T1)}}}=\\frac{(${fm(g.V)})^2}{${fm(g.P1)}}`,v:R1,unit:'Ω'},
    {t:'المقاومة عند الحرارة الجديدة من (3-14):',f:`R_{${fm(g.T2)}}=R_{${fm(g.T1)}}\\left[1+\\alpha_{${fm(g.T1)}}(${fm(g.T2)}-${fm(g.T1)})\\right]=${fm(R1)}\\left[1+${fm(g.a)}\\,(${fm(B.round(g.T2-g.T1,6))})\\right]`,v:R2,unit:'Ω',dp:3},
    {t:'القدرة عند الحرارة الجديدة:',f:`P_{${fm(g.T2)}}=\\frac{V^2}{R_{${fm(g.T2)}}}=\\frac{(${fm(g.V)})^2}{${fm(R2)}}`,v:P2,unit:'W',dp:2,final:true}]}}
 ],
 quiz:[
  {q:'القدرة الكهربائية هي:',o:['الطاقة × الزمن','معدل تغير الطاقة بالنسبة للزمن','الجهد ÷ التيار','الشحنة ÷ الزمن'],c:1,e:'ص 56: \\(P=dW/dt\\).'},
  {q:'أي مما يلي <b>ليس</b> صيغة صحيحة للقدرة في مقاومة؟',o:['\\(VI\\)','\\(I^2R\\)','\\(V^2/R\\)','\\(V^2R\\)'],c:3,e:'المعادلة (3-17).'},
  {q:'سخان مقاومته <span class="ltr">20 Ω</span> على جهد <span class="ltr">220 V</span>. قدرته:',o:['11 W','2420 W','4400 W','240 W'],c:1,e:'\\(V^2/R=220^2/20=2420\\) W.'},
  {q:'جهاز <span class="ltr">2 kW</span> يعمل 3 ساعات. الطاقة المستهلكة:',o:['6 kWh','0.67 kWh','5 kWh','6000 kWh'],c:0,e:'\\(W=P\\,t=2\\times3=6\\) kWh — المعادلة (3-19).'},
  {q:'محرك يأخذ <span class="ltr">1000 W</span> ويعطي <span class="ltr">850 W</span>. كفاءته:',o:['85%','15%','117%','150%'],c:0,e:'\\(\\eta=P_o/P_i=850/1000\\).'},
  {q:'حسب المعادلة (3-22) فإن القدرة الداخلة تساوي:',o:['\\(P_o-P_{loss}\\)','\\(P_o+P_{loss}\\)','\\(P_o\\times P_{loss}\\)','\\(P_o/\\eta^2\\)'],c:1,e:'ص 57.'},
  {q:'في مثال (3-8) عند ارتفاع حرارة الملف النحاسي مع ثبات الجهد فإن قدرته:',o:['تزيد','تقل','لا تتغير','تصبح صفراً'],c:1,e:'المقاومة زادت من 55 إلى 76.615 Ω فقلّت \\(V^2/R\\) من 220 إلى 157.93 W.'}
 ]
});

/* ======================================================================
   Lesson 5 — series resistors and series sources (ص 60–65), أمثلة (3-9) … (3-13)
   ====================================================================== */
const L5=(o)=>loopSpec(Object.assign({w:400,h:290,x0:80,y0:72,x1:320,y1:240},o));
const fig36=()=>L5({left:[{k:'E',plus:'t',lab:['E'],side:-1}],top:[{k:'R',lab:['R1','V1']}],right:[{k:'R',lab:['R2','V2']}],bottom:[{k:'R',lab:['R3','V3']}],arrows:[{s:'top',at:0.14,dir:1,lab:'I',side:-1}]});
const fig37=()=>L5({left:[{k:'E',plus:'t',lab:['20 V'],side:-1}],top:[{k:'R',lab:['2 Ω','V1']}],right:[{k:'R',lab:['1 Ω','V2']}],bottom:[{k:'R',lab:['5 Ω','V3']}],arrows:[{s:'top',at:0.14,dir:1,lab:'I',side:-1}]});
const fig38=()=>L5({w:440,x1:350,left:[{k:'E',plus:'f',lab:['E','50 V'],side:-1}],top:[{k:'R',lab:['7 Ω']},{k:'R',plus:'t',lab:['R2 = 4 Ω','V2']}],right:[{k:'R',lab:['7 Ω']}],bottom:[{k:'R',lab:['7 Ω']}],arrows:[{s:'top',i:0,at:0.2,dir:-1,lab:'I',side:-1},{s:'bottom',at:0.85,dir:-1,lab:'I',side:1}]});
const fig39=()=>L5({w:440,x1:350,left:[{k:'E',plus:'t',signs:false,lab:['E'],side:-1}],top:[{k:'R',lab:['R1']},{k:'R',lab:['R2 = 4 kΩ']}],right:[{k:'R',lab:['R3 = 6 kΩ']}],bottom:[{k:'W'}],arrows:[{s:'top',i:1,at:0.18,dir:1,lab:'I = 6 mA',side:1},{s:'right',at:0.85,dir:1,lab:'I',side:-1}]});
/* sources on top (clockwise = left→right), one resistor at the bottom */
const srcLoop=(vals,R,o)=>loopSpec(Object.assign({w:430,h:250,x0:40,y0:60,x1:390,y1:200,top:vals.map(([v,d])=>({k:'E',plus:d>0?'t':'f',lab:[v+' V'],side:-1})),right:[{k:'W'}],bottom:[{k:'R',lab:['R = '+R+' Ω']}],left:[{k:'W'}],arrows:[{s:'right',at:0.5,dir:1,lab:'I',side:-1}]},o||{}));
const svgs=list=>`<div class="c3-figs">${list.map(([sv,t])=>`<div>${box(sv,430)}${t?`<p class="sub" style="text-align:center">${t}</p>`:''}</div>`).join('')}</div>`;
function seriesSteps(g){const RT=B.round(g.R1+g.R2+g.R3,6),I=B.round(g.E/RT,4),V=[g.R1,g.R2,g.R3].map(r=>B.round(I*r,4)),P=[g.R1,g.R2,g.R3].map(r=>B.round(I*I*r,4)),Pd=B.round(g.E*I,4);return [
  {t:'(أ) المقاومة الكلية من المعادلة (3-23):',f:`R_T=R_1+R_2+R_3=${fm(g.R1)}+${fm(g.R2)}+${fm(g.R3)}`,v:RT,unit:'Ω',final:true},
  {t:'وطبقاً لقانون أوم التيار المار في الدائرة (3-24):',f:`I=\\frac{E}{R_T}=\\frac{${fm(g.E)}}{${fm(RT)}}`,v:I,unit:'A',final:true},
  {t:'(ب) فروق الجهد عبر المقاومات (3-25):',f:`V_1=I R_1=(${fm(I)})(${fm(g.R1)})`,v:V[0],unit:'V'},
  {f:`V_2=I R_2=(${fm(I)})(${fm(g.R2)})`,v:V[1],unit:'V'},{f:`V_3=I R_3=(${fm(I)})(${fm(g.R3)})`,v:V[2],unit:'V'},
  {t:'ونلاحظ أن مجموعها يساوي جهد البطارية:',f:`V_1+V_2+V_3=${fm(V[0])}+${fm(V[1])}+${fm(V[2])}`,v:B.round(V[0]+V[1]+V[2],4),unit:'V'},
  {t:'(ج) القدرة المفقودة في المقاومات (3-26):',f:`P_1=I^2R_1=(${fm(I)})^2(${fm(g.R1)})\\;,\\quad P_1=V_1I=(${fm(V[0])})(${fm(I)})`,v:P[0],unit:'W'},
  {f:`P_2=I^2R_2=(${fm(I)})^2(${fm(g.R2)})\\;,\\quad P_2=V_2I=(${fm(V[1])})(${fm(I)})`,v:P[1],unit:'W'},
  {f:`P_3=I^2R_3=(${fm(I)})^2(${fm(g.R3)})\\;,\\quad P_3=V_3I=(${fm(V[2])})(${fm(I)})`,v:P[2],unit:'W'},
  {t:'وقدرة المنبع:',f:`P_{del}=E\\,I=(${fm(g.E)})(${fm(I)})`,v:Pd,unit:'W',final:true},
  {t:'ونلاحظ أن \\(P_1+P_2+P_3=P_{del}\\) (3-27):',f:`${fm(P[0])}+${fm(P[1])}+${fm(P[2])}`,v:B.round(P[0]+P[1]+P[2],4),unit:'W'}]}
const SRC13=[[15,-1],[30,1],[50,1],[25,-1],[20,1]];
function ex313Steps(g,isBook){const v=[g.e1,g.e2,g.e3,g.e4,g.e5],d=SRC13.map(x=>x[1]);const pos=v.filter((x,i)=>d[i]>0).reduce((a,b)=>a+b,0),neg=v.filter((x,i)=>d[i]<0).reduce((a,b)=>a+b,0);const ET=pos-neg;
  const terms=[4,3,2,1,0].map((i,k)=>(d[i]>0?(k?'+':''):'-')+fm(v[i])).join('');
  return [
   {t:'(أ) مجموع المنابع التي قطبها الموجب على اليمين، ومجموع المنابع الموصلة بطريقة عكسية (قطبها الموجب على اليسار):',f:`${fm(v[1])}+${fm(v[2])}+${fm(v[4])}=${fm(pos)}\\ \\text{V}\\;,\\qquad ${fm(v[0])}+${fm(v[3])}=${fm(neg)}\\ \\text{V}`},
   {t:'ولذلك يكون الجهد الكلي:',f:`E_T=${terms}`,v:isBook?100:ET,unit:'V',final:true},
   isBook?{t:'<b>هكذا طُبع في الكتاب (100 V)</b>، والصحيح \\(20-25+50+30-15=60\\) V (أي 100 − 40)، وهي القيمة المرسومة في الشكل (3-11) والمستعملة في (ب). قارن بالحل المصحح أسفل هذه الصفحة.'}:null,
   {t:'(ب) التيار المار بتطبيق قانون أوم:',f:`I=\\frac{E_T}{R}=\\frac{${fm(ET)}}{${fm(g.R)}}`,v:B.round(ET/g.R,4),unit:'A',final:true}].filter(Boolean)}
const G313=[{id:'e1',label:'المنبع الأول من اليسار (موجبه يساراً)',sym:'',unit:'V',value:15},{id:'e2',label:'الثاني (موجبه يميناً)',sym:'',unit:'V',value:30},{id:'e3',label:'الثالث (موجبه يميناً)',sym:'',unit:'V',value:50},{id:'e4',label:'الرابع (موجبه يساراً)',sym:'',unit:'V',value:25},{id:'e5',label:'الخامس (موجبه يميناً)',sym:'',unit:'V',value:20},{id:'R',label:'المقاومة',sym:'R',unit:'Ω',value:10}];
const Q313='<p>في الدائرة الموضحة بالشكل (3-11)، إذا كانت خمسة مصادر جهد موصلة على التوالي وتغذي مقاومة <span class="ltr">R = 10 Ω</span>، احسب: (أ) قيمة الجهد الكلي (ب) التيار المار في المقاومة.</p>';
/* the lab's series circuit */
function seriesSVG(src,res,uk,I){const n=src.length;const sp=loopSpec({w:790,h:330,x0:70,y0:90,x1:650,y1:250,
   top:src.map((s,i)=>({k:'E',plus:s.d>0?'t':'f',lab:['E'+(i+1)+' = '+fm(s.v)+' V'],side:-1})),right:[{k:'W'}],
   bottom:res.map((r,i)=>({k:'R',plus:Math.abs(I)<1e-12?undefined:(I>0?'f':'t'),lab:['R'+(i+1)+' = '+fm(r)+(uk?' kΩ':' Ω'),'V'+(i+1)+' = '+fm(B.round(Math.abs(I)*r,3))+' V'],side:1})),left:[{k:'W'}],
   arrows:Math.abs(I)>1e-12?[{s:'right',at:0.5,dir:I>0?1:-1,lab:'I = '+fm(B.round(Math.abs(I),4))+(uk?' mA':' A'),side:-1}]:[]});
  const fl=Math.abs(I)<1e-12?0:I>0?1:-1;let ex='';
  sp.map.top.forEach((ei,i)=>{const e=sp.edges[ei],P=sp.nodes[e.f],Q=sp.nodes[e.t];ex+=`<rect data-flip="${i}" x="${fx((P[0]+Q[0])/2-40)}" y="${fx(P[1]-56)}" width="80" height="80" fill="transparent" style="cursor:pointer"><title>اضغط لعكس المنبع</title></rect>`});
  return circ(sp,{flow:sp.edges.map(()=>fl),extra:ex}).replace('aria-label="دائرة كهربائية"','aria-label="دائرة توالٍ: منابع ومقاومات"')}

B.lesson({
 id:'u3-l5',unit:3,order:5,pages:'60–65',
 title:'توصيل المقاومات والمنابع الكهربائية على التوالي',
 summary:'في التوالي يمر نفس التيار في كل العناصر: RT = R1 + R2 + … ، I = E/RT، وجهد كل مقاومة I·R، وقدرة المنبع تساوي مجموع القدرات المفقودة. والمنابع على التوالي تجمع جهودها، وتطرح جهود المنابع الموصلة عكسياً. مع الأمثلة (3-9) إلى (3-13).',
 theory:[
  {h:'مقدمة',ref:'ص 60',html:'<p>في هذه الوحدة سيتم شرح كيفية توصيل المقاومات والبطاريات على التوالي في الدوائر الكهربائية، بالإضافة إلى شرح قانون كيرشوف للجهد وقاعدة توزيع الجهد، مع توضيح ذلك بأمثلة متنوعة.</p>'},
  {h:'توصيل المقاومات على التوالي',ref:'ص 60',html:`<p>إذا ما تم توصيل عدد من المقاومات بشكل ما بحيث <b>يسري نفس التيار في كل منها</b>، فإن هذا التوصيل يسمى بالتوصيل على التوالي كما هو موضح في الشكل (3-6). من هذا الشكل يمكننا إيجاد المقاومة الكلية \\(R_T\\) كالآتي:</p>
   $$R_T=R_1+R_2+R_3\\quad \\Omega$$`},
  {fig:'(3-6)',ref:'ص 60',caption:'توصيل المقاومات على التوالي: بطارية E والمقاومات R1 و R2 و R3 يمر فيها نفس التيار I، وعلى كل مقاومة فرق جهد V1 و V2 و V3.',draw:()=>box(circ(fig36()),400)},
  {html:`<p>ويمكننا إيجاد المقاومة الكلية في الصورة العامة لعدد \\(N\\) من المقاومات الموصلة على التوالي كما يلي:</p>
   $$R_T=R_1+R_2+R_3+\\dots+R_N\\quad \\Omega\\qquad (3\\text{-}23)$$
   <p>ويمكن الحصول كذلك من الشكل (3-6) على التيار \\(I\\) طبقاً لقانون أوم، أي أن:</p>
   $$I=\\frac{E}{R_T}\\quad \\text{A}\\qquad (3\\text{-}24)$$
   <p>حيث \\(E\\) هي القوة الدافعة الكهربائية للبطارية. ويمكن كذلك إيجاد فرق الجهد عبر كل مقاومة في الصورة العامة طبقاً لقانون أوم كما يلي:</p>
   $$V_1=I\\,R_1\\;,\\;V_2=I\\,R_2\\;,\\;V_3=I\\,R_3\\;,\\;\\dots\\;,\\;V_N=I\\,R_N\\quad \\text{V}\\qquad (3\\text{-}25)$$
   <p>والقدرة المفقودة في كل مقاومة يمكن حسابها باستخدام أي من المعادلات التالية (في حالة المقاومة \\(R_1\\)): <span class="ref">ص 61</span></p>
   $$P_1=V_1\\,I_1=I_1^2\\,R_1=\\frac{V_1^2}{R_1}\\quad \\text{W}\\qquad (3\\text{-}26)$$
   <p>وقدرة المنبع تكون في هذه الحالة \\(P_{del}=E\\times I\\) W، ولأي عدد \\(N\\) من المقاومات موصلة على التوالي تكون القدرة المفقودة في هذه المقاومات:</p>
   $$P_{del}=P_1+P_2+P_3+\\dots+P_N\\qquad (3\\text{-}27)$$
   <p>ونلاحظ هنا أن <b>قدرة المنبع \\((P_{delivered})\\) تساوي القدرة المفقودة في المقاومات</b> المتصلة على التوالي بهذا المنبع.</p>
   <p>وفي حالة توصيل عدد \\(N\\) من <b>مقاومات متساوية</b> \\(R\\) على التوالي تكون المقاومة الكلية: <span class="ref">ص 62</span></p>
   $$R_T=N\\times R$$`},
  {note:ADD+'في التوالي: <b>التيار واحد</b> في كل العناصر، و<b>الجهود تُجمع</b> لتساوي جهد المنبع، والمقاومة الأكبر يقع عليها الجهد الأكبر وتفقد القدرة الأكبر. وإذا انقطعت مقاومة واحدة انقطع التيار عن الدائرة كلها.'},
  {h:'مثال (3-9)',ref:'ص 61–62',html:'<p>للدائرة الموضحة في الشكل (3-7)، احسب: (أ) المقاومة الكلية والتيار الكهربائي. (ب) فرق الجهد الكهربائي V1 و V2 و V3 عبر المقاومات R1 و R2 و R3. (ج) القدرة المفقودة في المقاومات R1 و R2 و R3، وكذلك قدرة المنبع.</p><p><b>النتائج:</b></p>$$R_T=8\\ \\Omega\\qquad I=2.5\\ \\text{A}$$ $$V_1=5\\ ,\\ V_2=2.5\\ ,\\ V_3=12.5\\ \\text{V}\\quad(\\Sigma=20\\ \\text{V})$$ $$P_1=12.5\\ ,\\ P_2=6.25\\ ,\\ P_3=31.25\\ \\text{W}\\qquad P_{del}=50\\ \\text{W}$$'},
  {fig:'(3-7)',ref:'ص 61',caption:'دائرة مثال (3-9): بطارية 20 V ومقاومات 2 Ω و 1 Ω و 5 Ω على التوالي.',draw:()=>box(circ(fig37()),400)},
  {h:'مثال (3-10)',ref:'ص 62',html:'<p>احسب المقاومة الكلية \\(R_T\\) والتيار \\(I\\) وفرق الجهد \\(V_2\\) للدائرة في الشكل (3-8).</p><p><b>الحل:</b> لأن المقاومات \(R_1=R_3=R_4\):</p>$$R_T=N\\times R_1+R_2=(3)(7)+4=25\\ \\Omega$$ $$I=\\frac{E}{R_T}=\\frac{50}{25}=2\\ \\text{A}\\qquad V_2=I\\,R_2=(2)(4)=8\\ \\text{V}$$'},
  {fig:'(3-8)',ref:'ص 62',caption:'دائرة مثال (3-10): بطارية 50 V (موجبها أسفل) وثلاث مقاومات 7 Ω و R2 = 4 Ω. التيار يخرج من القطب الموجب ويدور عكس عقارب الساعة. أسماء R1 و R3 و R4 غير مكتوبة على الشكل.',draw:()=>box(circ(fig38()),440)},
  {h:'مثال (3-11)',ref:'ص 63',html:'<p>في الدائرة الموضحة بالشكل (3-9)، إذا كانت المقاومة الكلية للدائرة \\(R_T=12\\ \\text{k}\\Omega\\) والتيار المار في الدائرة \\(I=6\\) mA، احسب: (أ) المقاومة R1 (ب) جهد البطارية E (جـ) الجهد على طرفي كل مقاومة.</p><p><b>النتائج:</b></p>$$R_1=12-10=2\\ \\text{k}\\Omega\\qquad E=I\\,R_T=72\\ \\text{V}$$ $$V_1=12\\ ,\\ V_2=24\\ ,\\ V_3=36\\ \\text{V}\\qquad 12+24+36=72\\ \\text{V}=E$$'},
  {fig:'(3-9)',ref:'ص 63',caption:'دائرة مثال (3-11): بطارية E مجهولة، R1 مجهولة، R2 = 4 kΩ، R3 = 6 kΩ، والتيار 6 mA.',draw:()=>box(circ(fig39()),440)},
  {h:'توصيل المنابع الكهربائية على التوالي',ref:'ص 64',html:'<p>عندما يكون في الدائرة الكهربائية أكثر من مصدر جهد يكون <b>الجهد الكلي الناتج عبارة عن مجموع مصادر الجهد</b> إذا كانت جميعها موصلة معاً على التوالي، وأن يكون الطرف الموجب للمصدر الأول متصلاً مع الطرف السالب للمصدر الثاني الذي يليه، ثم الطرف الموجب للمصدر الثاني متصلاً مع الطرف السالب الذي يليه وهكذا، وكمثال انظر إلى الشكل (3-10).</p>'},
  {h:'مثال (3-12)',ref:'ص 64',html:'<p>في الدائرة الموضحة بالشكل (3-10)، إذا كانت ثلاثة مصادر جهد موصلة على التوالي وتغذي مقاومة <span class="ltr">R = 100 Ω</span>، احسب: (أ) قيمة الجهد الكلي (ب) التيار المار في المقاومة.</p><p><b>الحل:</b> القطب الموجب لكل مصدر موصل بالقطب السالب للمصدر الذي يليه، فالجهد الكلي مجموعها:</p>$$E_T=E_1+E_2+E_3=50+30+40=120\\ \\text{V}\\qquad I=\\frac{E_T}{R}=\\frac{120}{100}=1.2\\ \\text{A}$$'},
  {fig:'(3-10)',ref:'ص 64',caption:'مثال (3-12): يساراً ثلاثة مصادر 50 V و 30 V و 40 V بنفس الاتجاه (الموجب جهة اليمين) تغذي R = 100 Ω، ويميناً الدائرة المكافئة بمصدر واحد E<sub>T</sub> = 120 V.',draw:()=>svgs([[circ(srcLoop([[50,1],[30,1],[40,1]],100,{arrows:[{s:'right',at:0.5,dir:1,lab:'I',side:-1}]})),'E1 = 50 V ، E2 = 30 V ، E3 = 40 V'],[circ(srcLoop([[120,1]],100)),'E<sub>T</sub> = 120 V']])},
  {html:'<p>وفي بعض الأحيان تكون مصادر الجهد <b>متصلة بطريقة عكسية</b>: يكون القطب الموجب للمصدر الأول متصلاً على التوالي مع القطب الموجب للمصدر الثاني، أو القطب السالب للمصدر الأول متصلاً بالقطب السالب للمصدر الثاني، وهكذا. <span class="ref">ص 65</span></p>'},
  {note:ADD+'نختار اتجاهاً (مثلاً اتجاه عقارب الساعة)، ونجمع جهود المصادر التي تدفع في هذا الاتجاه ونطرح جهود المصادر المعاكسة. إذا خرج المجموع سالباً فالتيار يسري في الاتجاه المعاكس لما اخترناه.'},
  {h:'مثال (3-13)',ref:'ص 65',html:'<p>في الدائرة الموضحة بالشكل (3-11)، إذا كانت خمسة مصادر جهد موصلة على التوالي وتغذي مقاومة <span class="ltr">R = 10 Ω</span>، احسب: (أ) قيمة الجهد الكلي (ب) التيار المار في المقاومة.</p><p><b>الحل:</b> مجموع المصادر الموصلة على التوالي وقطبها الموجب على اليمين <span class="ltr">100 V</span> (30 + 50 + 20)، ومجموع المصادر الموصلة بطريقة عكسية وقطبها الموجب على اليسار <span class="ltr">40 V</span> (15 + 25)، فالجهد الكلي:</p>$$E_T=20-25+50+30-15=60\\ \\text{V}\\qquad I=\\frac{E_T}{R}=\\frac{60}{10}=6\\ \\text{A}$$'},
  {fig:'(3-11)',ref:'ص 65',caption:'مثال (3-13): الدائرة الأصلية بخمسة مصادر، ثم تجميعها في مصدرين 40 V (موجبه يساراً) و 100 V (موجبه يميناً)، ثم الدائرة المكافئة بمصدر 60 V.',draw:()=>svgs([[circ(srcLoop(SRC13,10,{arrows:[]})),'الأصل: 15 ، 30 ، 50 ، 25 ، 20 V'],[circ(srcLoop([[40,-1],[100,1]],10,{arrows:[]})),'التجميع: 40 V و 100 V'],[circ(srcLoop([[60,1]],10)),'المكافئة: 60 V']])},
  {err:'في حل مثال (3-13) ص 65 طُبع \\(E_T=20-25+50+30-15=100\\ \\text{V}\\)، وهذا خطأ حسابي: الناتج الصحيح <b>60 V</b> (أي 100 − 40)، وهو المرسوم في الدائرة المكافئة بالشكل (3-11) والمستعمل في الفرع (ب): \\(I=60/10=6\\) A. في «الأمثلة المحلولة» الحل مرتين: كما في الكتاب، والمصحح.'},
  notesBlock(['معادلة \\(R_T=N\\times R\\) ص 62 مرقمة في الكتاب «(5-6)»، وهو رقم خارج تسلسل الوحدة (بعد 3-27 تأتي 3-28)؛ عرضناها بلا رقم.','في مثال (3-11) ص 63 طُبع «1_2 = R1 + 4 + 6» والمقصود \\(12=R_1+4+6\\).','في مثال (3-11) ص 63 طُبع \\(V_3=(6\\times10^{-3})(5)\\times(6\\times10^{3})=36\\) V وفيه عامل زائد (5)؛ الصحيح \\((6\\times10^{-3})\\times(6\\times10^{3})=36\\) V (النتيجة صحيحة).','في مثال (3-12) ص 64 طُبع «وبالتلي» والمقصود «وبالتالي».'])
 ],
 lab:(el)=>{
  let src=[{v:20,d:1}],res=[2,1,5],uk=false;
  el.innerHTML=`<div class="grid c3-lab">
   <div class="panel c12"><h2>ابنِ دائرة توالٍ <small>مبنية على الأشكال (3-6) إلى (3-11) ص 60–65</small></h2>
    <div class="c3-row"><span class="sub">دوائر الكتاب:</span><button class="btn" data-px="39">مثال (3-9)</button><button class="btn" data-px="310">مثال (3-10)</button><button class="btn" data-px="311">مثال (3-11)</button><button class="btn" data-px="312">مثال (3-12)</button><button class="btn" data-px="313">مثال (3-13)</button></div>
    <div class="svgbox c3-wide" id="c35c" style="max-width:820px;margin-inline:auto"></div>
    <p class="sub">المنابع في الأعلى والمقاومات في الأسفل. اضغط على أي منبع في الرسم (أو زر «اعكس») لعكس قطبيه. الأسهم والخطوط المتحركة تبين اتجاه التيار الاصطلاحي، وإشارة + على كل مقاومة عند الطرف الذي يدخل منه التيار.</p></div>
   <div class="panel c6"><h2>المنابع <small>حتى 5</small></h2><div class="c3-list" id="c35sl"></div><div class="c3-row"><button class="btn" id="c35as">أضف منبعاً</button></div></div>
   <div class="panel c6"><h2>المقاومات <small>حتى 6</small></h2><div class="c3-row"><span class="sub">الوحدة:</span>${segHTML('uk',[['0','Ω'],['1','kΩ']],'0')}</div><div class="c3-list" id="c35rl"></div><div class="c3-row"><button class="btn" id="c35ar">أضف مقاومة</button></div></div>
   <div class="panel c12"><h2>النتائج</h2>
    <div class="facts">${fact('الجهد الكلي E<sub>T</sub> (مع اتجاه عقارب الساعة)','c35ET')}${fact('المقاومة الكلية R<sub>T</sub> (3-23)','c35RT')}${fact('التيار I = E<sub>T</sub>/R<sub>T</sub> (3-24)','c35I')}${fact('مجموع جهود المقاومات','c35SV')}${fact('قدرة المنبع P<sub>del</sub> = E<sub>T</sub> I','c35Pd')}${fact('مجموع القدرات المفقودة (3-27)','c35SP')}</div>
    <div class="c3-bar" id="c35bar"></div><p class="sub">الشريط: كيف يتوزع الجهد الكلي على المقاومات (كل جزء = V = I R من المعادلة 3-25).</p>
    <div class="c3-tbl"><table class="tt"><thead><tr><th>المقاومة</th><th>R</th><th>V = I R (3-25)</th><th>P = I² R (3-26)</th></tr></thead><tbody id="c35tb"></tbody></table></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="c35st"></ol></div></div>`;
  const $=s=>el.querySelector(s);
  const ET=()=>src.reduce((a,s)=>a+s.v*s.d,0),RT=()=>res.reduce((a,b)=>a+b,0),Icur=()=>ET()/RT();
  const COLS=['--blue','--live','--stop','--muted','--blue-ink','--on'];
  const lists=()=>{
   $('#c35sl').innerHTML=src.map((s,i)=>`<div class="c3-item"><b class="n">E${i+1}</b>${sl('c35s'+i,s.d>0?'موجبه جهة اليمين (يدفع مع عقارب الساعة)':'موجبه جهة اليسار (موصل عكسياً)',0,100,1,s.v)}<span><button class="btn" data-fl="${i}">اعكس</button>${src.length>1?` <button class="btn" data-rs="${i}" aria-label="احذف">×</button>`:''}</span></div>`).join('');
   $('#c35rl').innerHTML=res.map((r,i)=>`<div class="c3-item"><b class="n">R${i+1}</b>${sl('c35r'+i,'المقاومة',1,100,1,r)}<span>${res.length>1?`<button class="btn" data-rr="${i}" aria-label="احذف">×</button>`:''}</span></div>`).join('');
   src.forEach((s,i)=>{$('#c35s'+i).oninput=e=>{src[i].v=+e.target.value;draw()}});res.forEach((r,i)=>{$('#c35r'+i).oninput=e=>{res[i]=+e.target.value;draw()}});
   $('#c35as').disabled=src.length>=5;$('#c35ar').disabled=res.length>=6};
  const draw=()=>{const I=Icur(),u=uk?' kΩ':' Ω',iu=uk?' mA':' A',pu=uk?' mW':' W';
   src.forEach((s,i)=>setV(el,'c35s'+i,fm(s.v)+' V'));res.forEach((r,i)=>setV(el,'c35r'+i,fm(r)+u));
   $('#c35c').innerHTML=seriesSVG(src,res,uk,I);
   $('#c35ET').textContent=fm(ET())+' V';$('#c35RT').textContent=fm(RT())+u;$('#c35I').textContent=(I<0?'−':'')+fm(B.round(Math.abs(I),4))+iu+(I<0?' (عكس عقارب الساعة)':'');
   const Vs=res.map(r=>Math.abs(I)*r);$('#c35SV').textContent=fm(B.round(Vs.reduce((a,b)=>a+b,0),3))+' V';
   $('#c35Pd').textContent=fm(B.round(Math.abs(ET()*I),4))+pu;$('#c35SP').textContent=fm(B.round(res.reduce((a,r)=>a+I*I*r,0),4))+pu;
   const tot=Math.abs(ET());$('#c35bar').innerHTML=tot>0?Vs.map((v,i)=>`<span style="width:${fx(v/tot*100)}%;background:var(${COLS[i%6]})">${v/tot>0.09?'V'+(i+1):''}</span>`).join(''):'';
   $('#c35tb').innerHTML=res.map((r,i)=>`<tr><td>R${i+1}</td><td>${lt(fm(r)+u)}</td><td>${lt(fm(B.round(Math.abs(I)*r,4))+' V')}</td><td>${lt(fm(B.round(I*I*r,4))+pu)}</td></tr>`).join('')};
  const set=(s,r,k)=>{src=s.map(([v,d])=>({v,d}));res=r.slice();uk=!!k;segSet(el,'uk',uk?'1':'0');lists();draw()};
  const PX={39:[[[20,1]],[2,1,5]],310:[[[50,1]],[7,4,7,7]],311:[[[72,1]],[2,4,6],1],312:[[[50,1],[30,1],[40,1]],[100]],313:[SRC13,[10]]};
  el.querySelectorAll('[data-px]').forEach(b=>b.onclick=()=>{const p=PX[b.dataset.px];set(p[0],p[1],p[2])});
  el.addEventListener('click',e=>{const f=e.target.closest('[data-fl],[data-flip]');if(f){const i=+(f.dataset.fl!=null?f.dataset.fl:f.dataset.flip);src[i].d*=-1;lists();draw();return}
   const a=e.target.closest('[data-rs]');if(a){src.splice(+a.dataset.rs,1);lists();draw();return}
   const c=e.target.closest('[data-rr]');if(c){res.splice(+c.dataset.rr,1);lists();draw()}});
  $('#c35as').onclick=()=>{if(src.length<5){src.push({v:10,d:1});lists();draw()}};$('#c35ar').onclick=()=>{if(res.length<6){res.push(10);lists();draw()}};
  segBind(el,'uk',v=>{uk=v==='1';draw()});
  const is=(s,r)=>src.length===s.length&&s.every(([v,d],i)=>src[i].v===v&&src[i].d===d)&&res.length===r.length&&r.every((x,i)=>res[i]===x);
  const steps=stepsUI($('#c35st'),[
   {t:'مثال (3-9)',x:'اضغط «مثال (3-9)»: \\(R_T=8\\ \\Omega\\) و \\(I=2.5\\) A، والجهود 5 و 2.5 و 12.5 V مجموعها 20 V، وقدرة المنبع 50 W = مجموع القدرات.',done:()=>is([[20,1]],[2,1,5])},
   {t:'أضف مقاومة',x:'أضف مقاومة رابعة إلى نفس الدائرة: تزيد المقاومة الكلية فيقل التيار، ويقل جهد كل مقاومة قديمة، ويبقى مجموع الجهود 20 V.',done:()=>src.length===1&&src[0].v===20&&res.length===4&&res[0]===2&&res[1]===1&&res[2]===5},
   {t:'مثال (3-12)',x:'اضغط «مثال (3-12)»: ثلاثة منابع بنفس الاتجاه تجمع: \\(E_T=120\\) V و \\(I=1.2\\) A.',done:()=>is([[50,1],[30,1],[40,1]],[100])},
   {t:'اعكس منبعاً',x:'اعكس المنبع الثاني (30 V): أصبح موصلاً بطريقة عكسية فيُطرح: \\(E_T=50-30+40=60\\) V و \\(I=0.6\\) A.',done:()=>is([[50,1],[30,-1],[40,1]],[100])},
   {t:'مثال (3-13)',x:'اضغط «مثال (3-13)»: المنابع التي موجبها يميناً 100 V والعكسية 40 V، فالجهد الكلي <b>60 V</b> (لا 100 V كما طُبع في الحل) والتيار 6 A.',done:()=>is(SRC13,[10])},
   {t:'التيار ينعكس',x:'اعكس منابع حتى يصبح مجموع المنابع العكسية أكبر: \\(E_T\\) سالب، فيسري التيار عكس عقارب الساعة وتنتقل إشارة + إلى الطرف الآخر من كل مقاومة.',done:()=>ET()<0}
  ]);
  lists();draw();loopOn(el,()=>steps.check());
 },
 examples:[
  {title:'مثال (3-9)',ref:'ص 61–62',q:'<p>للدائرة الموضحة في الشكل (3-7)، احسب: (أ) المقاومة الكلية والتيار الكهربائي. (ب) فرق الجهد الكهربائي V1 و V2 و V3 عبر المقاومات R1 و R2 و R3. (ج) القدرة المفقودة في المقاومات R1 و R2 و R3، وكذلك قدرة المنبع.</p>',
   given:[{id:'E',label:'جهد البطارية',sym:'E',unit:'V',value:20},{id:'R1',label:'',sym:'R_1',unit:'Ω',value:2},{id:'R2',label:'',sym:'R_2',unit:'Ω',value:1},{id:'R3',label:'',sym:'R_3',unit:'Ω',value:5}],solve:g=>seriesSteps(g)},
  {title:'مثال (3-10)',ref:'ص 62',q:'<p>احسب المقاومة الكلية \\(R_T\\) والتيار \\(I\\) وفرق الجهد \\(V_2\\) للدائرة في الشكل (3-8).</p>',
   given:[{id:'E',label:'جهد البطارية',sym:'E',unit:'V',value:50},{id:'N',label:'عدد المقاومات المتساوية',sym:'N',unit:'',value:3,step:1,min:1},{id:'R',label:'قيمة كل منها',sym:'R_1',unit:'Ω',value:7},{id:'R2',label:'المقاومة',sym:'R_2',unit:'Ω',value:4}],
   solve:g=>{const RT=B.round(g.N*g.R+g.R2,6),I=B.round(g.E/RT,4);return [
    {t:'لأن المقاومات \\(R_1=R_3=R_4\\) فإن المقاومة الكلية:',f:`R_T=N\\times R_1+R_2=(${fm(g.N)})\\times(${fm(g.R)})+${fm(g.R2)}`,v:RT,unit:'Ω',final:true},
    {f:`I=\\frac{E}{R_T}=\\frac{${fm(g.E)}}{${fm(RT)}}`,v:I,unit:'A',final:true},
    {f:`V_2=I\\times R_2=(${fm(I)})\\times(${fm(g.R2)})`,v:B.round(I*g.R2,4),unit:'V',final:true}]}},
  {title:'مثال (3-11)',ref:'ص 63',q:'<p>في الدائرة الموضحة بالشكل (3-9)، إذا كانت المقاومة الكلية للدائرة \\(R_T=12\\ \\text{k}\\Omega\\) والتيار المار في الدائرة \\(I=6\\) mA، احسب: (أ) المقاومة R1 (ب) جهد البطارية E (جـ) الجهد على طرفي كل مقاومة.</p>',
   given:[{id:'RT',label:'المقاومة الكلية',sym:'R_T',unit:'kΩ',value:12},{id:'I',label:'التيار',sym:'I',unit:'mA',value:6},{id:'R2',label:'',sym:'R_2',unit:'kΩ',value:4},{id:'R3',label:'',sym:'R_3',unit:'kΩ',value:6}],
   solve:g=>{const R1=B.round(g.RT-g.R2-g.R3,6),E=B.round(g.I*g.RT,4),V=[R1,g.R2,g.R3].map(r=>B.round(g.I*r,4));return [
    {t:'(أ) حساب المقاومة R1:',f:`R_T=R_1+R_2+R_3\\;\\Rightarrow\\;${fm(g.RT)}=R_1+${fm(g.R2)}+${fm(g.R3)}\\;\\Rightarrow\\;R_1=${fm(g.RT)}-${fm(B.round(g.R2+g.R3,6))}`,v:R1,unit:'kΩ',final:true},
    R1<=0?{t:'تنبيه: R1 خرجت صفراً أو سالبة — المقاومة الكلية يجب أن تكون أكبر من R2 + R3.'}:null,
    {t:'(ب) جهد البطارية بتطبيق قانون أوم:',f:`E=I\\,R_T=(${fm(g.I)}\\times10^{-3})\\times(${fm(g.RT)}\\times10^{3})`,v:E,unit:'V',final:true},
    {t:'(جـ) الجهد على طرفي كل مقاومة:',f:`V_1=I\\,R_1=(${fm(g.I)}\\times10^{-3})\\times(${fm(R1)}\\times10^{3})`,v:V[0],unit:'V'},
    {f:`V_2=I\\,R_2=(${fm(g.I)}\\times10^{-3})\\times(${fm(g.R2)}\\times10^{3})`,v:V[1],unit:'V'},
    {f:`V_3=I\\,R_3=(${fm(g.I)}\\times10^{-3})\\times(${fm(g.R3)}\\times10^{3})`,v:V[2],unit:'V'},
    {t:'للتأكد: مجموع الجهود الثلاثة يساوي جهد المصدر:',f:`V_1+V_2+V_3=${fm(V[0])}+${fm(V[1])}+${fm(V[2])}`,v:B.round(V[0]+V[1]+V[2],4),unit:'V'}].filter(Boolean)}},
  {title:'مثال (3-12)',ref:'ص 64',q:'<p>في الدائرة الموضحة بالشكل (3-10)، إذا كانت ثلاثة مصادر جهد موصلة على التوالي وتغذي مقاومة <span class="ltr">R = 100 Ω</span>، احسب: (أ) قيمة الجهد الكلي (ب) التيار المار في المقاومة.</p>',
   given:[{id:'E1',label:'',sym:'E_1',unit:'V',value:50},{id:'E2',label:'',sym:'E_2',unit:'V',value:30},{id:'E3',label:'',sym:'E_3',unit:'V',value:40},{id:'R',label:'المقاومة',sym:'R',unit:'Ω',value:100}],
   solve:g=>{const ET=B.round(g.E1+g.E2+g.E3,6);return [{t:'(أ) القطب الموجب لكل مصدر موصل بالقطب السالب للذي يليه، فالجهد الكلي مجموع المصادر:',f:`E_T=E_1+E_2+E_3=${fm(g.E1)}+${fm(g.E2)}+${fm(g.E3)}`,v:ET,unit:'V',final:true},
    {t:'(ب) التيار بتطبيق قانون أوم:',f:`I=\\frac{E_T}{R}=\\frac{${fm(ET)}}{${fm(g.R)}}`,v:B.round(ET/g.R,4),unit:'A',final:true}]}},
  {title:'مثال (3-13) — الحل كما في الكتاب',ref:'ص 65',q:Q313,given:G313,solve:(g,B,isBook)=>ex313Steps(g,isBook),
   note:'<b>ملاحظة على الكتاب:</b> بقيم الكتاب تعرض الحاسبة \\(E_T=100\\) V كما طُبع (خطأ حسابي، الصحيح 60 V)، ثم الفرع (ب) بالقيمة 60 V كما في الكتاب. إذا غيّرت أي رقم تحسب الحاسبة الجهد الكلي صحيحاً.'},
  {title:'مثال (3-13) — الحل المصحح',ref:'ص 65',q:'<p>نفس المثال بجمع صحيح للجهد الكلي. (حساب مصحح — ليس من الكتاب.)</p>',given:G313,solve:g=>ex313Steps(g,false),
   note:'الفرع (ب) يطابق الكتاب: <span class="ltr">I = 6 A</span>. التصحيح في (أ) فقط: <span class="ltr">E<sub>T</sub> = 60 V</span>.'}
 ],
 quiz:[
  {q:'في دائرة التوالي، أي كمية واحدة في كل المقاومات؟',o:['الجهد','التيار','القدرة','المقاومة'],c:1,e:'ص 60: «يسري نفس التيار في كل منها».'},
  {q:'ثلاث مقاومات 3 Ω و 5 Ω و 12 Ω على التوالي. المقاومة الكلية:',o:['1.7 Ω','20 Ω','180 Ω','6.7 Ω'],c:1,e:'المعادلة (3-23).'},
  {q:'خمس مقاومات متساوية كل منها 4 Ω على التوالي:',o:['0.8 Ω','9 Ω','20 Ω','4 Ω'],c:2,e:'\\(R_T=N\\times R=5\\times4\\).'},
  {q:'بطارية 24 V مع مقاومتين 4 Ω و 8 Ω على التوالي. جهد المقاومة 8 Ω:',o:['8 V','12 V','16 V','24 V'],c:2,e:'\\(I=24/12=2\\) A، و \\(V=2\\times8=16\\) V.'},
  {q:'في دائرة التوالي قدرة المنبع:',o:['أكبر من مجموع القدرات المفقودة','تساوي مجموع القدرات المفقودة في المقاومات','أقل منها','لا علاقة بينهما'],c:1,e:'المعادلة (3-27).'},
  {q:'منبعان 12 V و 9 V على التوالي موصلان بطريقة عكسية (موجب مع موجب). الجهد الكلي:',o:['21 V','3 V','108 V','0 V'],c:1,e:'ص 65: الموصل عكسياً يُطرح.'},
  {q:'في مثال (3-13) الجهد الكلي الصحيح هو:',o:['100 V','40 V','60 V','140 V'],c:2,e:'100 − 40 = 60 V، والكتاب طبع 100 V خطأً ثم استعمل 60 V في حساب التيار.'},
  {q:'في مثال (3-11) إذا كانت R<sub>T</sub> = 12 kΩ و I = 6 mA فإن جهد البطارية:',o:['2 V','72 V','0.5 V','18 V'],c:1,e:'\\(E=I\\,R_T=6\\times10^{-3}\\times12\\times10^{3}\\).'}
 ]
});

/* ======================================================================
   Lesson 6 — Kirchhoff's voltage law and the voltage divider rule (ص 66–71), أمثلة (3-14) … (3-17)
   ====================================================================== */
const L6=(o)=>loopSpec(Object.assign({w:440,h:280,x0:90,y0:55,x1:350,y1:225},o));
const fig312=()=>L6({labels:{tl:'a',tr:'b',br:'c',bl:'d'},left:[{k:'E',plus:'t',lab:['E'],side:-1}],top:[{k:'R',plus:'f',lab:['R1','V1']}],right:[{k:'R',plus:'f',lab:['R2','V2']}],bottom:[{k:'R',plus:'f',lab:['R3','V3']}],arrows:[{s:'top',at:0.13,dir:1,lab:'I',side:1}]});
const fig313=()=>L6({labels:{tl:'a',tr:'d',br:'c',bl:'b'},left:[{k:'E',plus:'f',lab:['E = 54 V'],side:-1}],top:[{k:'R',plus:'t',lab:['R3','V3 = 15 V']}],right:[{k:'R',plus:'t',lab:['R2 = 7 Ω','V2']}],bottom:[{k:'R',plus:'t',lab:['R1','V1 = 18 V']}],arrows:[{s:'top',at:0.88,dir:-1,lab:'I',side:1}]});
const fig314=()=>L6({w:520,x1:430,left:[{k:'E',plus:'t',lab:['50 V'],side:-1}],top:[{k:'R',lab:['4 Ω']},{k:'E',plus:'f',lab:['12.5 V']},{k:'R',plus:'f',lab:['7 Ω','V']}],right:[{k:'W'}],bottom:[{k:'R',lab:['4 Ω']}],arrows:[{s:'top',i:0,at:0.14,dir:1,lab:'I',side:1}]});
const fig315=()=>({w:600,h:300,nodes:{B:[80,50],C:[300,50],E:[520,50],A:[80,250],D:[300,250],F:[520,250],m1:[80,150],m2:[520,150]},
  edges:[{f:'A',t:'m1',k:'R',lab:['2 Ω'],side:-1},{f:'m1',t:'B',k:'E',plus:'t',lab:['6 V'],side:-1},{f:'B',t:'C',k:'W'},{f:'C',t:'D',k:'R',lab:['10 Ω'],side:1},{f:'D',t:'A',k:'W'},{f:'D',t:'F',k:'W'},{f:'F',t:'m2',k:'R',lab:['3 Ω'],side:-1},{f:'m2',t:'E',k:'E',plus:'t',lab:['4 V'],side:-1},{f:'E',t:'C',k:'W'}],
  arrows:[{e:2,at:0.3,dir:1,lab:'I1',side:-1},{e:8,at:0.3,dir:1,lab:'I2',side:1},{e:3,at:0.2,dir:1,lab:'I1+I2',side:-1}],labels:{A:'A',B:'B',C:'C',D:'D',E:'E',F:'F'}});
const fig316=()=>L6({left:[{k:'E',plus:'t',signs:false,lab:['E'],side:-1}],top:[{k:'R',plus:'f',lab:['R1','+ V1 −'],side:1},{k:'R',plus:'f',lab:['R2','+ V2 −'],side:1}],right:[{k:'W'}],bottom:[{k:'W'}],arrows:[{s:'left',at:0.85,dir:1,lab:'I',side:1},{s:'right',at:0.85,dir:1,lab:'I',side:-1}]});
const divSpec=(E,R,V)=>loopSpec({w:440,h:330,x0:130,y0:40,x1:300,y1:290,left:[{k:'E',plus:'t',lab:['E = '+fm(E)+' V'],side:-1}],top:[{k:'W'}],right:R.map((r,i)=>({k:'R',plus:'f',lab:['R'+(i+1)+' = '+fm(r)+' kΩ','V'+(i+1)+' = '+fm(B.round(V[i],3))+' V'],side:1})),bottom:[{k:'W'},{k:'W'}],ground:'bottom1',arrows:[{s:'top',at:0.5,dir:1,lab:'I',side:-1}]});
/* the book's 4 sign rules (ص 67) */
const RULES=['المرور على بطارية من قطبها السالب إلى قطبها الموجب: ارتفاع في الجهد، توضع إشارة البطارية بالموجب.','المرور على بطارية من قطبها الموجب إلى قطبها السالب: انخفاض في الجهد، توضع إشارة البطارية بالسالب.','المرور على مقاومة في نفس اتجاه التيار: انخفاض في الجهد، توضع إشارة جهد المقاومة بالسالب.','المرور على مقاومة عكس اتجاه التيار: ارتفاع في الجهد، توضع إشارة جهد المقاومة بالموجب.'];
function kvl316(g){const a11=g.R1+g.Rm,a12=g.Rm,a21=g.Rm,a22=g.R3+g.Rm;const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b]}return a};
  const int=[a11,a21].every(x=>Number.isInteger(x));const gg=int?gcd(a11,a21):1;const k1=a21/gg,k2=a11/gg;
  const I2x=(k1*g.E1-k2*g.E2)/(k1*a12-k2*a22),I1x=(g.E1-a12*I2x)/a11;const I2=B.round(I2x,4),I1=B.round(I1x,4);return {a11,a12,a21,a22,k1,k2,I1,I2,I1x,I2x}}
function ex316Steps(g){const s=kvl316(g);return [
  {t:'بتطبيق قانون كيرشوف للجهد على المسار ABCDA:',f:`${fm(g.E1)}-${fm(g.Rm)}(I_1+I_2)-${fm(g.R1)}I_1=0\\;\\Rightarrow\\;${fm(g.E1)}=${fm(g.R1)}I_1+${fm(g.Rm)}(I_1+I_2)`},
  {f:`${fm(g.E1)}=${fm(s.a11)}\\,I_1+${fm(s.a12)}\\,I_2\\qquad\\dots(a)`},
  {t:'وبالمثل على المسار DCEFD:',f:`-${fm(g.E2)}+${fm(g.R3)}I_2+${fm(g.Rm)}(I_1+I_2)=0\\;\\Rightarrow\\;${fm(g.E2)}=${fm(s.a21)}\\,I_1+${fm(s.a22)}\\,I_2\\qquad\\dots(b)`},
  {t:`بضرب المعادلة (a) في ${fm(s.k1)} والمعادلة (b) في ${fm(s.k2)} ثم طرح المعادلتين:`,f:`${fm(B.round(s.k1*s.a11,6))}I_1+${fm(B.round(s.k1*s.a12,6))}I_2=${fm(B.round(s.k1*g.E1,6))}\\;,\\quad ${fm(B.round(s.k2*s.a21,6))}I_1+${fm(B.round(s.k2*s.a22,6))}I_2=${fm(B.round(s.k2*g.E2,6))}`},
  {f:`I_2=\\frac{${fm(B.round(s.k1*g.E1,6))}-${fm(B.round(s.k2*g.E2,6))}}{${fm(B.round(s.k1*s.a12,6))}-${fm(B.round(s.k2*s.a22,6))}}`,v:s.I2,unit:'A',dp:4,final:true},
  {t:'وبالتعويض في (a):',f:`I_1=\\frac{${fm(g.E1)}-${fm(s.a12)}\\,I_2}{${fm(s.a11)}}`,v:s.I1,unit:'A',dp:4,final:true},
  {t:'تيار الفرع الأوسط (10 Ω):',f:`I_1+I_2=${fm(s.I1,4)}+(${fm(s.I2,4)})`,v:B.round(s.I1+s.I2,4),unit:'A',dp:4,final:true},
  s.I2<0||s.I1<0?{t:ADD+'الإشارة السالبة تعني أن التيار الحقيقي في عكس السهم المرسوم على الشكل.'}:null].filter(Boolean)}
/* walker circuits: sp + per-edge walker data + loops */
function walkC(k,v){
  if(k==='312'){const RT=v.R1+v.R2+v.R3,I=v.E/RT;return {sp:L6({labels:{tl:'a',tr:'b',br:'c',bl:'d'},left:[{k:'E',plus:'t',lab:['E = '+fm(v.E)+' V'],side:-1}],top:[{k:'R',plus:'f',lab:['R1 = '+fm(v.R1)+' Ω']}],right:[{k:'R',plus:'f',lab:['R2 = '+fm(v.R2)+' Ω']}],bottom:[{k:'R',plus:'f',lab:['R3 = '+fm(v.R3)+' Ω']}],arrows:[{s:'top',at:0.13,dir:1,lab:'I = '+fm(B.round(I,4))+' A',side:1}]}),
    w:[{sym:'IR_1',n:'R1',num:I*v.R1,idir:1},{sym:'IR_2',n:'R2',num:I*v.R2,idir:1},{sym:'IR_3',n:'R3',num:I*v.R3,idir:1},{sym:'E',n:'البطارية E',num:v.E}],start:'tl',seq:[[0,1],[1,1],[2,1],[3,1]],res:`بالأرقام: \\(I=E/R_T=${fm(v.E)}/${fm(RT)}=${fm(B.round(I,4))}\\) A.`}}
  if(k==='314')return {sp:fig313(),w:[{sym:'V_3',n:'R3',num:15,idir:-1},{sym:'V_2',n:'R2',num:21,idir:-1},{sym:'V_1',n:'R1',num:18,idir:-1},{sym:'E',n:'البطارية 54 V',num:54}],start:'tl',seq:[[0,1],[1,1],[2,1],[3,1]],res:'ومنها \\(V_2=E-V_1-V_3=54-18-15=21\\) V ، \\(I=V_2/R_2=21/7=3\\) A ، \\(R_1=18/3=6\\ \\Omega\\) ، \\(R_3=15/3=5\\ \\Omega\\) — مثال (3-14).'};
  if(k==='315')return {sp:fig314(),w:[{sym:'4I',n:'المقاومة 4 Ω',num:10,idir:1},{sym:'12.5',n:'البطارية 12.5 V',num:12.5},{sym:'7I',n:'المقاومة 7 Ω',num:17.5,idir:1},{k:'W'},{sym:'4I',n:'المقاومة 4 Ω (السفلية)',num:10,idir:1},{sym:'50',n:'البطارية 50 V',num:50}],start:'bl',seq:[[5,1],[0,1],[1,1],[2,1],[3,1],[4,1]],res:'ومنها \\(37.5=15\\,I\\) أي \\(I=2.5\\) A ، و \\(V_{7\\Omega}=17.5\\) V ، و \\(P_{7\\Omega}=43.75\\) W — مثال (3-15).'};
  const I1=38/56,I2=-12/56;const w=[{sym:'2I_1',n:'المقاومة 2 Ω',num:2*I1,idir:1},{sym:'6',n:'البطارية 6 V',num:6},{k:'W'},{sym:'10(I_1+I_2)',n:'المقاومة 10 Ω',num:10*(I1+I2),idir:1},{k:'W'},{k:'W'},{sym:'3I_2',n:'المقاومة 3 Ω',num:3*I2,idir:1},{sym:'4',n:'البطارية 4 V',num:4},{k:'W'}];
  if(k==='316a')return {sp:fig315(),w,start:'A',seq:[[0,1],[1,1],[2,1],[3,1],[4,1]],res:'هذه المعادلة (a): \\(6=12I_1+10I_2\\). ومع المعادلة (b) نحصل على \\(I_1=0.6786\\) A و \\(I_2=-0.2143\\) A — مثال (3-16). (الأرقام أعلاه بهذه القيم.)'};
  return {sp:fig315(),w,start:'D',seq:[[3,-1],[8,-1],[7,-1],[6,-1],[5,-1]],res:'هذه المعادلة (b): \\(4=10I_1+13I_2\\) — مثال (3-16).'}}
/* sign of the term when crossing edge e of circuit C in direction d (+1 f→t) */
function termSign(C,ei,d){const e=C.sp.edges[ei],w=C.w[ei];if(e.k==='E'){const rise=(d>0)===(e.plus==='t');return rise?1:-1}if(e.k==='R')return d===w.idir?-1:1;return 0}

B.lesson({
 id:'u3-l6',unit:3,order:6,pages:'66–71',
 title:'قانون كيرشوف للجهد وقاعدة توزيع الجهد',
 summary:'في أي مسار مغلق المجموع الجبري لجهود المنابع والهبوط على المقاومات يساوي صفراً، مع قواعد الإشارات الأربع. ثم قاعدة توزيع الجهد Vx = Rx E / RT لمقاومات على التوالي. مع الأمثلة (3-14) إلى (3-17).',
 theory:[
  {h:'قانون كيرشوف للجهد (Kirchhoff\'s Voltage Law)',ref:'ص 66',html:`<p>بالرغم من أن قانون أوم يعتبر من أهم القوانين في علوم الكهرباء إلا أنه لا يمكن استخدامه لتحليل الدوائر المعقدة، لذلك قام العالم كيرشوف بوضع قوانينه التي تمكننا من استخدام قانون أوم لحل الدوائر المعقدة.</p>
   <p>فما هي إذاً قوانين كيرشوف؟ القانون الأول (قانون كيرشوف للجهد)، والقانون الثاني (قانون كيرشوف للتيار). ويعرف القانون الأول على أنه:</p>
   <p class="callout">«في أي دائرة مقفلة (مغلقة)، <b>المجموع الجبري لكل مصادر الجهد (للمنابع) والهبوط في الجهد على طرفي المقاومات في الدائرة يساوي الصفر</b>».<br>أو: «في أي دائرة مغلقة (مسار مغلق)، <b>مجموع الجهود لمصادر الجهد = مجموع الجهود على طرفي المقاومات</b>».</p>
   <p>ويلاحظ هنا أن <b>اتجاه الهبوط في الجهد على أية مقاومة يضاد اتجاه التيار المار في هذه المقاومة</b>. ولتوضيح تطبيق هذا القانون بدون الوقوع في بعض الأخطاء الشائعة نفرض أن الشكل (3-12) يمثل إحدى الدوائر المقفلة التي تتكون منها دائرة كهربائية والتي يراد تطبيق القانون عليها. نبدأ بتطبيق القانون من نقطة معينة ما.</p>`},
  {fig:'(3-12)',ref:'ص 66',caption:'دائرة مقفلة بأربع نقاط a و b و c و d: البطارية E والمقاومات R1 و R2 و R3، والتيار I مع عقارب الساعة. إشارة + على كل مقاومة عند الطرف الذي يدخل منه التيار.',draw:()=>box(circ(fig312()),440)},
  {html:`<p>طبقاً لقانون كيرشوف يجب أن يكون مجموع القوى الدافعة الكهربائية ومجموع مقادير الهبوط في الجهد في مقاومات الدائرة المختلفة مساوياً للصفر ابتداءً من النقطة a حتى نعود إليها في أي الاتجاهين، أي أنه في الاتجاه الأول <span class="ltr">a, b, c, d, a</span> يكون:</p>
   $$-I_1R_1-I_2R_2-I_3R_3+E=0\\;,\\quad\\text{or}\\quad E=I_1R_1+I_2R_2+I_3R_3$$
   <p>أو في الاتجاه الآخر <span class="ltr">a, d, c, b, a</span> يكون: <span class="ref">ص 67</span></p>
   $$-E+I_3R_3+I_2R_2+I_1R_1=0\\;,\\quad\\text{or}\\quad E=I_1R_1+I_2R_2+I_3R_3$$
   <p>يلاحظ من المعادلتين السابقتين أن القوة الدافعة الكهربائية للبطارية تدخل في المعادلة <b>بإشارة موجبة</b> عندما يكون المرور عليها أثناء تطبيق القانون <b>من القطب السالب إلى القطب الموجب</b>، كما أن مقدار الهبوط في الجهد على المقاومة يدخل في المعادلة <b>بإشارة سالبة</b> عندما يكون المرور على المقاومة أثناء تطبيق القانون <b>في اتجاه التيار</b>.</p>
   <p>ولكي نتجنب الخطأ في تطبيق قانون كيرشوف للجهد في حالة البدء من نقطة معينة في مسار مغلق في اتجاه ما حتى نعود إلى نفس نقطة البداية يجب اتباع الخطوات التالية:</p>
   <table class="tt"><thead><tr><th>العنصر</th><th>اتجاه المرور</th><th>الجهد</th><th>الإشارة</th></tr></thead><tbody>
   <tr><td>بطارية</td><td>من قطبها السالب إلى قطبها الموجب</td><td>ارتفاع</td><td>+</td></tr>
   <tr><td>بطارية</td><td>من قطبها الموجب إلى قطبها السالب</td><td>انخفاض</td><td>−</td></tr>
   <tr><td>مقاومة</td><td>في نفس اتجاه التيار</td><td>انخفاض</td><td>−</td></tr>
   <tr><td>مقاومة</td><td>عكس اتجاه التيار</td><td>ارتفاع</td><td>+</td></tr></tbody></table>`},
  {note:ADD+'في الدائرة البسيطة (3-12) التيار واحد، فالرموز \\(I_1\\) و\\(I_2\\) و\\(I_3\\) في المعادلتين كلها نفس التيار \\(I\\) (لأن المقاومات على التوالي). جرّب «امشِ حول الحلقة» في المختبر: تختار أنت الإشارة عند كل عنصر.'},
  {h:'مثال (3-14)',ref:'ص 67–68',html:'<p>للدائرة الموضحة في الشكل (3-13)، أوجد فرق الجهد V2 والتيار I وأوجد كذلك قيمة المقاومتين R1 و R3.</p><p><b>الحل:</b> بتطبيق قانون كيرشوف للجهد (بأخذ المسار في اتجاه عقارب الساعة من a):</p>$$-E+V_3+V_2+V_1=0\\;\\Rightarrow\\;V_2=E-V_1-V_3=54-18-15=21\\ \\text{V}$$ $$I=\\frac{V_2}{R_2}=\\frac{21}{7}=3\\ \\text{A}\\qquad R_1=\\frac{18}{3}=6\\ \\Omega\\qquad R_3=\\frac{15}{3}=5\\ \\Omega$$'},
  {fig:'(3-13)',ref:'ص 68',caption:'دائرة مثال (3-14): بطارية 54 V موجبها عند b، والتيار I يدور عكس عقارب الساعة، فمسار عقارب الساعة يمر على كل مقاومة عكس التيار (ارتفاع) وعلى البطارية من + إلى − (انخفاض).',draw:()=>box(circ(fig313()),440)},
  {h:'مثال (3-15)',ref:'ص 68–69',html:'<p>احسب التيار المار في الدائرة المبينة في الشكل (3-14) واحسب فرق الجهد على طرفي المقاومة 7 Ω وكذلك القدرة المفقودة في المقاومة 7 Ω.</p><p><b>الحل:</b> بتطبيق قانون كيرشوف للجهد (مع عقارب الساعة):</p>$$50-12.5-I(4+4+7)=0\\;\\Rightarrow\\;37.5=15\\times I\\;\\Rightarrow\\;I=2.5\\ \\text{A}$$ $$V_{7\\Omega}=(2.5)(7)=17.5\\ \\text{V}\\qquad P_{7\\Omega}=(2.5)^2(7)=43.75\\ \\text{W}$$'},
  {fig:'(3-14)',ref:'ص 68',caption:'دائرة مثال (3-15): بطارية 50 V وبطارية 12.5 V معاكسة لها على الضلع العلوي، ومقاومات 4 Ω و 7 Ω و 4 Ω.',draw:()=>box(circ(fig314()),520)},
  {h:'مثال (3-16)',ref:'ص 69',html:'<p>باستخدام قانون كيرشوف للجهد احسب قيمة التيارات المارة في الأفرع \\(I_1\\) و\\(I_2\\) و\\((I_1+I_2)\\) في الدائرة الموضحة بالشكل (3-15).</p><p><b>الحل:</b> على المسار ABCDA ثم على المسار DCEFD:</p>$$6-10(I_1+I_2)-2I_1=0\\;\\Rightarrow\\;6=12I_1+10I_2\\quad\\dots(a)$$ $$-4+3I_2+10(I_1+I_2)=0\\;\\Rightarrow\\;4=10I_1+13I_2\\quad\\dots(b)$$<p>بضرب (a) في 5 و(b) في 6 وطرح المعادلتين:</p>$$I_2=-0.2143\\ \\text{A}\\qquad I_1=0.6786\\ \\text{A}\\qquad I_1+I_2=0.4643\\ \\text{A}$$'},
  {fig:'(3-15)',ref:'ص 69',caption:'دائرة مثال (3-16): حلقتان وثلاثة أفرع؛ الأيسر بطارية 6 V ومقاومة 2 Ω، والأوسط 10 Ω، والأيمن بطارية 4 V ومقاومة 3 Ω. التيار I1 من B نحو C و I2 من E نحو C، وفي الفرع الأوسط I1 + I2 نزولاً.',draw:()=>box(circ(fig315()),560)},
  {note:ADD+'خرج \\(I_2\\) سالباً، ومعناه أن التيار الحقيقي في الفرع الأيمن عكس السهم المرسوم (أي من C نحو E). لا مشكلة في ذلك: نفرض أي اتجاه للتيار، وإذا خرجت الإشارة سالبة نعرف أن الاتجاه الحقيقي معاكس.'},
  {h:'قاعدة توزيع الجهد (Voltage Divider Rule)',ref:'ص 70',html:`<p>في حالة توصيل مقاومات على التوالي مع منبع جهد كهربائي، فإن التيار المار في هذه المقاومات ثابت، وفرق الجهد على طرفي أية مقاومة يساوي حاصل ضرب هذه المقاومة في التيار المار فيها (حيث أن قيمة هذا التيار تساوي جهد المنبع مقسوماً على المقاومة الكلية للدائرة). ويمكن استنتاج هذه القاعدة من الدائرة الموضحة في الشكل (3-16) كالآتي:</p>
   $$R_T=R_1+R_2\\;,\\qquad I=\\frac{E}{R_T}$$
   $$V_1=I\\,R_1=\\left(\\frac{E}{R_T}\\right)R_1=\\frac{R_1\\times E}{R_T}\\;,\\qquad V_2=I\\,R_2=\\left(\\frac{E}{R_T}\\right)R_2=\\frac{R_2\\times E}{R_T}$$
   <p>ويمكن كتابة هذه القاعدة في الصورة العامة، أي أن:</p>
   $$V_x=\\frac{R_x\\times E}{R_T}\\qquad (3\\text{-}28)$$
   <p>حيث \\(x\\) تمثل رقم المقاومة \\((R_1, R_2, R_3 \\dots)\\) ورقم الجهد بين طرفيها \\((V_1, V_2, V_3 \\dots)\\). فإذا كانت الدائرة تحتوي على ستة مقاومات مربوطة على التوالي فإن الجهد بين طرفي المقاومة \\(R_6\\) قيمته \\(V_6=\\frac{R_6\\times E}{R_T}\\).</p>`},
  {fig:'(3-16)',ref:'ص 70',caption:'دائرة استنتاج قاعدة توزيع الجهد: بطارية E ومقاومتان R1 و R2 على التوالي.',draw:()=>box(circ(fig316()),440)},
  {note:ADD+'القاعدة تعطينا جهد أي مقاومة مباشرة دون حساب التيار: <b>نصيب المقاومة من الجهد = نصيبها من المقاومة الكلية</b>. فإذا كانت \\(R_1\\) ربع \\(R_T\\) أخذت ربع جهد المنبع.'},
  {h:'مثال (3-17)',ref:'ص 71',html:'<p>باستخدام قاعدة توزيع الجهد، احسب فرقي الجهد V1 و V3 للدائرة المبينة في الشكل (3-17).</p><p><b>الحل:</b></p>$$V_1=\\frac{R_1\\times E}{R_T}=\\frac{2\\times10^3\\times45}{(2+5+8)\\times10^3}=\\frac{90}{15}=6\\ \\text{V}$$ $$V_3=\\frac{R_3\\times E}{R_T}=\\frac{8\\times10^3\\times45}{(2+5+8)\\times10^3}=\\frac{360}{15}=24\\ \\text{V}$$'},
  {fig:'(3-17)',ref:'ص 71',caption:'دائرة مثال (3-17): بطارية 45 V، والمقاومات R1 = 2 kΩ و R2 = 5 kΩ و R3 = 8 kΩ على الضلع الأيمن، والأرضي في منتصف الضلع السفلي.',draw:()=>box(circ(divSpec(45,[2,5,8],[6,15,24])),400)},
  notesBlock(['في نص مثال (3-15) ص 68 طُبع «عل طرفي» والمقصود «على طرفي».','في نص مثال (3-16) ص 69 طُبع «I1، I2، I3» بينما يسمّي الشكل تيار الفرع الأوسط \\(I_1+I_2\\)؛ كتبناه \\(I_1\\) و\\(I_2\\) و\\((I_1+I_2)\\).','في حل مثال (3-16) ص 69 طُبعت المعادلة (a) «\\(6=12I_1+I_2\\)» والصحيح \\(6=12I_1+10I_2\\) (الحل مبني على الصحيحة).','وفيه أيضاً «بضرب … وجمع المعادلتين» والصحيح طرح المعادلتين: \\(60I_1+50I_2=30\\) و \\(60I_1+78I_2=24\\) ومنها \\(28I_2=-6\\).','في حل مثال (3-17) ص 71 كُتب السطر الأخير «V1 = 360/15 = 24 V» والمقصود \\(V_3\\).'])
 ],
 lab:(el)=>{
  let ck='312',dr=1,v={E:12,R1:2,R2:3,R3:1},pos=0,terms=[],errs=0,msg='',msgc='',rule=-1;const did={};
  let dE=45,dR=[2,5,8];
  el.innerHTML=`<div class="grid c3-lab">
   <div class="panel c12"><h2>امشِ حول الحلقة <small>قانون كيرشوف للجهد وقواعد الإشارات ص 66–67، والأشكال (3-12) إلى (3-15)</small></h2>
    <div class="c3-row"><div><div class="sub">الدائرة</div>${segHTML('ck',[['312','الشكل (3-12)'],['314','مثال (3-14)'],['315','مثال (3-15)'],['316a','مثال (3-16): ABCDA'],['316b','مثال (3-16): DCEFD']],ck)}</div><div><div class="sub">اتجاه المسار</div>${segHTML('dr',[['1','مع عقارب الساعة'],['-1','عكس عقارب الساعة']],'1')}</div></div>
    <div id="c36v312" class="grid" style="margin-top:0"><div class="c6">${sl('c36E','E',1,50,1,v.E)}${sl('c36R1','R1',1,20,1,v.R1)}</div><div class="c6">${sl('c36R2','R2',1,20,1,v.R2)}${sl('c36R3','R3',1,20,1,v.R3)}</div></div>
    <div class="grid" style="margin-top:0"><div class="c7"><div class="svgbox" id="c36c" style="max-width:600px;margin-inline:auto"></div></div>
     <div class="c5"><div id="c36q" class="callout"></div>
      <div class="c3-row"><button class="btn primary" id="c36up">ارتفاع في الجهد (+)</button><button class="btn primary" id="c36dn">انخفاض في الجهد (−)</button></div>
      <p class="c3-msg" id="c36m"></p>
      <div class="c3-row"><button class="btn" id="c36auto">أكمل تلقائياً</button><button class="btn" id="c36rs">ابدأ من جديد</button><span class="c3-chip" id="c36e"></span></div></div></div>
    <div class="c3-eq" id="c36eq"></div><p class="sub" id="c36res"></p>
    <ol class="sub" id="c36rules" style="padding-inline-start:20px"></ol></div>
   <div class="panel c12"><h2>قاعدة توزيع الجهد <small>المعادلة (3-28) والشكل (3-17) ص 71</small></h2>
    <div class="grid" style="margin-top:0"><div class="c5">${sl('c36dE','جهد المنبع E',0,100,1,dE)}${sl('c36d1','R1',0.5,20,0.5,dR[0])}${sl('c36d2','R2',0.5,20,0.5,dR[1])}${sl('c36d3','R3',0.5,20,0.5,dR[2])}
      <div class="c3-row"><button class="btn" id="c36x17">مثال (3-17)</button></div>
      <div class="facts">${fact('R<sub>T</sub>','c36RT')}${fact('I = E / R<sub>T</sub>','c36I')}${fact('V1 + V2 + V3','c36sum')}</div></div>
     <div class="c7"><div class="svgbox" id="c36d" style="max-width:420px;margin-inline:auto"></div><div class="c3-eq" id="c36deq"></div></div></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="c36st"></ol></div></div>`;
  const $=s=>el.querySelector(s);
  let C=walkC(ck,v);
  const seq=()=>dr>0?C.seq:C.seq.slice().reverse().map(([e,d])=>[e,-d]);
  const skipW=()=>{const s=seq();while(pos<s.length&&C.sp.edges[s[pos][0]].k==='W')pos++};
  const reset=()=>{pos=0;terms=[];errs=0;msg='';msgc='';rule=-1;skipW();drawW()};
  const ruleOf=(ei,d)=>{const e=C.sp.edges[ei];if(e.k==='E')return termSign(C,ei,d)>0?0:1;return termSign(C,ei,d)<0?2:3};
  const answer=sg=>{const s=seq();if(pos>=s.length)return;const [ei,d]=s[pos];const ok=termSign(C,ei,d);const r=ruleOf(ei,d);rule=r;
   if(sg===ok){terms.push({ei,sg});msg='صحيح. '+RULES[r];msgc='ok';pos++;skipW();if(pos>=s.length)did[ck+(dr>0?'cw':'ccw')]=1}else{errs++;msg='ليس هذا. '+RULES[r];msgc='no'}drawW()};
  const texTerms=withNum=>terms.map((t,i)=>{const w=C.w[t.ei];const sg=t.sg<0?'-':(i?'+':'');if(!withNum)return sg+w.sym;const n=B.round(w.num,4);return sg+(n<0?`(${fm(n)})`:fm(n))}).join('');
  const drawW=()=>{const s=seq();const hl={};terms.forEach(t=>{hl[t.ei]='--on'});s.slice(0,pos).forEach(([e])=>{if(!hl[e])hl[e]='--on'});const cur=pos<s.length?s[pos]:null;if(cur)hl[cur[0]]='--blue';
   const N=C.sp.nodes;const st=N[C.start];const here=cur?N[cur[1]>0?C.sp.edges[cur[0]].f:C.sp.edges[cur[0]].t]:st;
   const ex=`<circle cx="${fx(st[0])}" cy="${fx(st[1])}" r="11" fill="none" stroke="var(--stop)" stroke-width="2" stroke-dasharray="3 3"/><circle cx="${fx(here[0])}" cy="${fx(here[1])}" r="7" fill="var(--stop)"/>`;
   $('#c36c').innerHTML=circ(C.sp,{hl,extra:ex});
   const fin=pos>=s.length;
   if(!fin){const e=C.sp.edges[cur[0]],w=C.w[cur[0]];$('#c36q').innerHTML=e.k==='E'?`<b>تمر الآن على ${w.n}.</b> انظر إلى قطبيها في الرسم: هل تدخلها من القطب السالب أم الموجب؟`:`<b>تمر الآن على ${w.n}.</b> هل اتجاه مسيرك مع سهم التيار المفروض أم عكسه؟`}
   else $('#c36q').innerHTML='<b>عدت إلى نقطة البداية.</b> المجموع الجبري يساوي صفراً.';
   $('#c36up').disabled=fin;$('#c36dn').disabled=fin;$('#c36auto').disabled=fin;
   $('#c36m').className='c3-msg '+msgc;$('#c36m').textContent=msg;$('#c36e').textContent='أخطاء: '+errs;
   $('#c36eq').innerHTML=B.tex((terms.length?texTerms(false):'\\dots')+(fin?'=0':'\\;\\dots'),true)+(fin?B.tex(texTerms(true)+'='+fm(B.round(terms.reduce((a,t)=>a+t.sg*C.w[t.ei].num,0),3)),true):'');
   $('#c36res').innerHTML=fin?C.res:'المعادلة تكتمل عندما تعود إلى نقطة البداية (الدائرة الحمراء المتقطعة).';
   $('#c36rules').innerHTML=RULES.map((r,i)=>`<li style="${i===rule?'color:var(--fg);font-weight:700':''}">${r}</li>`).join('');
   $('#c36v312').style.display=ck==='312'?'':'none';['E','R1','R2','R3'].forEach(k=>setV(el,'c36'+k,fm(v[k])+(k==='E'?' V':' Ω')));
   B.math($('#c36res'));B.math($('#c36q'))};
  segBind(el,'ck',x=>{ck=x;C=walkC(ck,v);reset()});segBind(el,'dr',x=>{dr=+x;reset()});
  ['E','R1','R2','R3'].forEach(k=>{$('#c36'+k).oninput=e=>{v[k]=+e.target.value;C=walkC(ck,v);drawW()}});
  $('#c36up').onclick=()=>answer(1);$('#c36dn').onclick=()=>answer(-1);$('#c36rs').onclick=reset;
  $('#c36auto').onclick=()=>{const s=seq();while(pos<s.length){const [ei,d]=s[pos];answer(termSign(C,ei,d))}};
  const drawD=()=>{const RT=dR[0]+dR[1]+dR[2],V=dR.map(r=>r*dE/RT);setV(el,'c36dE',fm(dE)+' V');dR.forEach((r,i)=>setV(el,'c36d'+(i+1),fm(r)+' kΩ'));
   const sp=divSpec(dE,dR,V);const n1=sp.nodes.right1,n2=sp.nodes.right2;
   const ex=S.t(fx(sp.nodes.tr[0]+88),fx(sp.nodes.tr[1]+4),fm(B.round(dE,3))+' V','m','start')+S.t(fx(n1[0]+88),fx(n1[1]+4),fm(B.round(V[1]+V[2],3))+' V','m','start')+S.t(fx(n2[0]+88),fx(n2[1]+4),fm(B.round(V[2],3))+' V','m','start')+S.t(fx(sp.nodes.br[0]+88),fx(sp.nodes.br[1]+4),'0 V','m','start');
   $('#c36d').innerHTML=circ(sp,{flow:dE>0?sp.edges.map(()=>1):null,extra:ex});
   $('#c36RT').textContent=fm(RT)+' kΩ';$('#c36I').textContent=fm(B.round(dE/RT,4))+' mA';$('#c36sum').textContent=fm(B.round(V[0]+V[1]+V[2],3))+' V';
   $('#c36deq').innerHTML=V.map((x,i)=>B.tex(`V_${i+1}=\\frac{R_${i+1}\\times E}{R_T}=\\frac{${fm(dR[i])}\\times ${fm(dE)}}{${fm(RT)}}=${fm(B.round(x,3))}\\ \\text{V}`,true)).join('')+'<p class="sub">الأرقام الرمادية يمين الرسم: جهد كل نقطة بالنسبة للأرضي.</p>'};
  ['dE','d1','d2','d3'].forEach((k,i)=>{$('#c36'+k).oninput=e=>{if(i===0)dE=+e.target.value;else dR[i-1]=+e.target.value;drawD()}});
  $('#c36x17').onclick=()=>{dE=45;dR=[2,5,8];$('#c36dE').value=45;$('#c36d1').value=2;$('#c36d2').value=5;$('#c36d3').value=8;drawD()};
  const steps=stepsUI($('#c36st'),[
   {t:'الشكل (3-12) مع عقارب الساعة',x:'اختر «الشكل (3-12)» و«مع عقارب الساعة» وابدأ من a: عند كل عنصر اختر ارتفاعاً أو انخفاضاً حتى تعود إلى a. تحصل على \\(-IR_1-IR_2-IR_3+E=0\\).',done:()=>did['312cw']},
   {t:'نفس الحلقة في الاتجاه الآخر',x:'اختر «عكس عقارب الساعة» وامشِ من جديد: كل الإشارات تنعكس، والمعادلة النهائية هي نفسها \\(E=IR_1+IR_2+IR_3\\) (ص 67).',done:()=>did['312ccw']},
   {t:'مثال (3-14)',x:'اختر «مثال (3-14)» وامشِ مع عقارب الساعة من a: التيار يدور عكس مسيرك، فالمقاومات ارتفاع والبطارية انخفاض: \\(-E+V_3+V_2+V_1=0\\) ومنها \\(V_2=21\\) V.',done:()=>did['314cw']||did['314ccw']},
   {t:'مثال (3-16): الحلقة ABCDA',x:'اختر «مثال (3-16): ABCDA» وامشِ: \\(-2I_1+6-10(I_1+I_2)=0\\) وهي المعادلة (a). لاحظ أن الأسلاك لا تدخل في المعادلة.',done:()=>did['316acw']||did['316accw']},
   {t:'قاعدة توزيع الجهد',x:'في «قاعدة توزيع الجهد» اضغط «مثال (3-17)»: \\(V_1=6\\) V و \\(V_3=24\\) V، ومجموع الجهود الثلاثة 45 V.',done:()=>dE===45&&dR[0]===2&&dR[1]===5&&dR[2]===8},
   {t:'مقاومة أكبر تأخذ جهداً أكبر',x:'اجعل <span class="ltr">R3 = 16 kΩ</span>: زاد نصيبها من المقاومة الكلية فزاد جهدها إلى نحو <span class="ltr">31.3 V</span> وقلّ جهد المقاومتين الأخريين.',done:()=>dE===45&&dR[0]===2&&dR[1]===5&&dR[2]===16}
  ]);
  reset();drawD();loopOn(el,()=>steps.check());
 },
 examples:[
  {title:'مثال (3-14)',ref:'ص 67–68',q:'<p>للدائرة الموضحة في الشكل (3-13)، أوجد فرق الجهد V2 والتيار I وأوجد كذلك قيمة المقاومتين R1 و R3.</p>',
   given:[{id:'E',label:'جهد البطارية',sym:'E',unit:'V',value:54},{id:'V1',label:'',sym:'V_1',unit:'V',value:18},{id:'V3',label:'',sym:'V_3',unit:'V',value:15},{id:'R2',label:'',sym:'R_2',unit:'Ω',value:7}],
   solve:g=>{const V2=B.round(g.E-g.V1-g.V3,6),I=B.round(V2/g.R2,4);return [
    {t:'بتطبيق قانون كيرشوف للجهد (بأخذ المسار في اتجاه عقارب الساعة):',f:'-E+V_3+V_2+V_1=0'},
    {t:'ومنها:',f:`V_2=E-V_1-V_3=${fm(g.E)}-${fm(g.V1)}-${fm(g.V3)}`,v:V2,unit:'V',final:true},
    {f:`I=\\frac{V_2}{R_2}=\\frac{${fm(V2)}}{${fm(g.R2)}}`,v:I,unit:'A',final:true},
    {f:`R_1=\\frac{V_1}{I}=\\frac{${fm(g.V1)}}{${fm(I)}}`,v:B.round(g.V1/I,4),unit:'Ω',final:true},
    {f:`R_3=\\frac{V_3}{I}=\\frac{${fm(g.V3)}}{${fm(I)}}`,v:B.round(g.V3/I,4),unit:'Ω',final:true},
    V2<=0?{t:'تنبيه: V2 خرج صفراً أو سالباً — مجموع V1 و V3 يجب أن يكون أقل من E.'}:null].filter(Boolean)}},
  {title:'مثال (3-15)',ref:'ص 68–69',q:'<p>احسب التيار المار في الدائرة المبينة في الشكل (3-14) واحسب فرق الجهد على طرفي المقاومة 7 Ω وكذلك القدرة المفقودة في المقاومة 7 Ω.</p>',
   given:[{id:'E1',label:'البطارية اليسرى',sym:'E_1',unit:'V',value:50},{id:'E2',label:'البطارية المعاكسة',sym:'E_2',unit:'V',value:12.5},{id:'Ra',label:'العلوية',sym:'R_a',unit:'Ω',value:4},{id:'Rb',label:'السفلية',sym:'R_b',unit:'Ω',value:4},{id:'R7',label:'المطلوب جهدها',sym:'R',unit:'Ω',value:7}],
   solve:g=>{const net=B.round(g.E1-g.E2,6),RT=B.round(g.Ra+g.Rb+g.R7,6),I=B.round(net/RT,4);return [
    {t:'بتطبيق قانون كيرشوف للجهد (بأخذ المسار في اتجاه عقارب الساعة):',f:`${fm(g.E1)}-${fm(g.E2)}-I(${fm(g.Ra)}+${fm(g.Rb)}+${fm(g.R7)})=0`},
    {f:`${fm(net)}=${fm(RT)}\\times I`},
    {f:`I=\\frac{E}{R_T}=\\frac{${fm(net)}}{${fm(RT)}}`,v:I,unit:'A',final:true},
    {f:`V_{${fm(g.R7)}\\Omega}=I\\times R=(${fm(I)})\\times(${fm(g.R7)})`,v:B.round(I*g.R7,4),unit:'V',final:true},
    {f:`P_{${fm(g.R7)}\\Omega}=I^2R=(${fm(I)})^2\\times(${fm(g.R7)})`,v:B.round(I*I*g.R7,4),unit:'W',final:true},
    I<0?{t:ADD+'التيار سالب: الاتجاه الحقيقي عكس عقارب الساعة لأن البطارية المعاكسة أكبر.'}:null].filter(Boolean)}},
  {title:'مثال (3-16)',ref:'ص 69',q:'<p>باستخدام قانون كيرشوف للجهد احسب قيمة التيارات المارة في الأفرع \\(I_1\\) و\\(I_2\\) و\\((I_1+I_2)\\) في الدائرة الموضحة بالشكل (3-15).</p>',
   given:[{id:'E1',label:'بطارية الفرع الأيسر',sym:'E_1',unit:'V',value:6},{id:'R1',label:'مقاومة الفرع الأيسر',sym:'',unit:'Ω',value:2},{id:'Rm',label:'مقاومة الفرع الأوسط',sym:'',unit:'Ω',value:10},{id:'E2',label:'بطارية الفرع الأيمن',sym:'E_2',unit:'V',value:4},{id:'R3',label:'مقاومة الفرع الأيمن',sym:'',unit:'Ω',value:3}],
   solve:g=>ex316Steps(g),note:'المعادلة (a) طُبعت في الكتاب \\(6=12I_1+I_2\\) و«جمع» بدل «طرح»؛ الحاسبة تعرض الصحيح، والنتائج 0.6786 و −0.2143 و 0.4643 A كما في الكتاب. معاملا الضرب (5 و 6 بقيم الكتاب) يُحسبان بحيث يتساوى معامل \\(I_1\\) في المعادلتين.'},
  {title:'مثال (3-17)',ref:'ص 71',q:'<p>باستخدام قاعدة توزيع الجهد، احسب فرقي الجهد V1 و V3 للدائرة المبينة في الشكل (3-17).</p>',
   given:[{id:'E',label:'جهد البطارية',sym:'E',unit:'V',value:45},{id:'R1',label:'',sym:'R_1',unit:'kΩ',value:2},{id:'R2',label:'',sym:'R_2',unit:'kΩ',value:5},{id:'R3',label:'',sym:'R_3',unit:'kΩ',value:8}],
   solve:g=>{const RT=B.round(g.R1+g.R2+g.R3,6);const n1=B.round(g.R1*g.E,6),n3=B.round(g.R3*g.E,6);return [
    {t:'بتطبيق قاعدة توزيع الجهد (3-28):',f:`V_1=\\frac{R_1\\times E}{R_T}=\\frac{${fm(g.R1)}\\times10^3\\times ${fm(g.E)}}{(${fm(g.R1)}+${fm(g.R2)}+${fm(g.R3)})\\times10^3}`},
    {f:`V_1=\\frac{${fm(n1)}}{${fm(RT)}}`,v:B.round(n1/RT,4),unit:'V',final:true},
    {f:`V_3=\\frac{R_3\\times E}{R_T}=\\frac{${fm(g.R3)}\\times10^3\\times ${fm(g.E)}}{(${fm(g.R1)}+${fm(g.R2)}+${fm(g.R3)})\\times10^3}`},
    {f:`V_3=\\frac{${fm(n3)}}{${fm(RT)}}`,v:B.round(n3/RT,4),unit:'V',final:true},
    {t:'للتحقق (توضيح، ليس من الكتاب): جهد R2 ومجموع الجهود الثلاثة:',f:`V_2=\\frac{${fm(g.R2)}\\times ${fm(g.E)}}{${fm(RT)}}=${fm(B.round(g.R2*g.E/RT,4))}\\;,\\quad V_1+V_2+V_3=${fm(B.round(g.E,4))}`}]}}
 ],
 quiz:[
  {q:'قانون كيرشوف للجهد: في أي مسار مغلق المجموع الجبري لجهود المنابع والهبوط على المقاومات يساوي:',o:['جهد المنبع','صفراً','التيار الكلي','المقاومة الكلية'],c:1,e:'ص 66.'},
  {q:'عند المرور على بطارية من قطبها السالب إلى قطبها الموجب نضع إشارتها:',o:['موجبة (ارتفاع)','سالبة (انخفاض)','صفراً','حسب التيار'],c:0,e:'القاعدة الأولى ص 67.'},
  {q:'عند المرور على مقاومة في نفس اتجاه التيار يكون جهدها:',o:['ارتفاعاً (+)','انخفاضاً (−)','صفراً','مساوياً لجهد المنبع'],c:1,e:'القاعدة الثالثة ص 67.'},
  {q:'في مثال (3-14): E = 54 V، V1 = 18 V، V3 = 15 V. قيمة V2:',o:['87 V','21 V','51 V','33 V'],c:1,e:'\\(V_2=54-18-15=21\\) V.'},
  {q:'في مثال (3-15) بطاريتان 50 V و 12.5 V متعاكستان ومقاومات مجموعها 15 Ω. التيار:',o:['4.17 A','2.5 A','3.33 A','0.83 A'],c:1,e:'\\((50-12.5)/15=2.5\\) A.'},
  {q:'في مثال (3-16) خرج I2 = −0.2143 A. معنى الإشارة السالبة:',o:['خطأ في الحل','التيار الحقيقي عكس السهم المفروض','لا يمر تيار','البطارية تالفة'],c:1,e:'نفرض اتجاهاً للتيار، والإشارة السالبة تعني أن الحقيقي معاكس.'},
  {q:'مقاومتان 3 kΩ و 9 kΩ على التوالي مع 24 V. جهد المقاومة 3 kΩ بقاعدة توزيع الجهد:',o:['6 V','8 V','18 V','12 V'],c:0,e:'\\(V_1=\\frac{3\\times24}{12}=6\\) V — المعادلة (3-28).'},
  {q:'في قاعدة توزيع الجهد، المقاومة الأكبر في دائرة التوالي:',o:['يقع عليها جهد أصغر','يقع عليها جهد أكبر','يمر فيها تيار أكبر','لا يقع عليها جهد'],c:1,e:'\\(V_x\\) تتناسب مع \\(R_x\\).'}
 ]
});

})(PLCBOOK);
