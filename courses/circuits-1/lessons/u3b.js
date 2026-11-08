/* دوائر كهربائية-1 — الوحدة الثالثة (الجزء الثاني): من «توصيل المقاومات على التوازي» حتى تمارين الوحدة (ص 72–104)
   Lessons u3-l7 … u3-l12. (u3-l1 … u3-l6 are in u3.js; course.js registers the unit — no B.unit here.) */
(function(B){
const {S}=B;
const fm=(x,d)=>B.fmtN(x,d);
const fx=v=>(+v).toFixed(1);
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const lt=s=>`<span class="ltr">${s}</span>`;
const sig=(x,n)=>(!isFinite(x)||x===0)?x:+(+x).toPrecision(n);

/* ---------- styles used only by this file (CSS variables only) ---------- */
(function css(){if(typeof document==='undefined'||document.getElementById('c3b-css'))return;const s=document.createElement('style');s.id='c3b-css';s.textContent=`
.cb-sl{display:flex;flex-direction:column;gap:2px;font-size:13.5px;margin-top:10px;min-width:0}
.cb-sl .cb-h{display:flex;justify-content:space-between;gap:8px;align-items:baseline}
.cb-sl b{font-family:var(--mono);direction:ltr;unicode-bidi:isolate;color:var(--blue-ink);font-size:14px}
.cb-sl input[type=range]{width:100%;accent-color:var(--blue);direction:ltr;margin:4px 0}
.cb-row{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;align-items:center}
.cb-row .sub{margin:0}
.cb-lab .seg{flex-wrap:wrap;max-width:100%}
.cb-lab .seg button{white-space:nowrap}
.cb-q{border:1px solid var(--line);border-radius:12px;padding:10px 14px;margin:10px 0;background:var(--surface)}
.cb-q summary{cursor:pointer;font-weight:600;line-height:1.7}
.cb-ans{margin-top:8px;border-inline-start:3px solid var(--blue);padding:6px 12px;background:var(--blue-soft);border-radius:0 10px 10px 0}
.cb-tbl{overflow-x:auto;max-width:100%}
.cb-tbl table.tt td,.cb-tbl table.tt th{padding:5px 6px}
.cb-tbl td.bad{background:var(--stop-soft);color:var(--stop);font-weight:700}
.cb-tbl td.ok{background:var(--on-soft)}
.cb-chip{display:inline-block;padding:2px 10px;border-radius:999px;font-size:12.5px;font-weight:700;background:var(--surface-2);color:var(--muted)}
.cb-chip.ok{background:var(--on-soft);color:var(--on)}
.cb-chip.warn{background:var(--stop-soft);color:var(--stop)}
.cb-chip.hot{background:var(--live-soft);color:var(--live)}
.cb-try{margin:6px 0 0;padding-inline-start:20px}
.cb-br{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px;margin-top:8px}
.cb-br .cb-cell{border:1px solid var(--line);border-radius:10px;padding:6px 10px;background:var(--surface)}
.cb-br .cb-cell.off{opacity:.55}
.cb-br .cb-cell .cb-sl{margin-top:4px}
.cb-bars{margin-top:10px}
.cb-bar{display:grid;grid-template-columns:minmax(70px,auto) 1fr minmax(70px,auto);gap:8px;align-items:center;font-size:13px;margin:3px 0}
.cb-bar .tr{height:14px;background:var(--surface-2);border-radius:7px;overflow:hidden;direction:ltr}
.cb-bar .tr i{display:block;height:100%;background:var(--live);border-radius:7px}
.cb-bar .tr i.src{background:var(--blue)}
.cb-bar b{font-family:var(--mono);direction:ltr;unicode-bidi:isolate;text-align:end}
.cb-in{width:110px;font:inherit;font-family:var(--mono);direction:ltr;padding:4px 6px;border:1px solid var(--line);border-radius:8px;background:var(--surface);color:var(--fg)}
.cb-chk{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:6px 0;padding:6px 10px;border:1px solid var(--line);border-radius:10px;background:var(--surface)}
.cb-chk>span:first-child{min-width:160px}
.cb-res{font-weight:700}
.cb-res.ok{color:var(--on)}.cb-res.no{color:var(--stop)}
.cb-figs{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:10px}
.cb-figs figure{margin:0;text-align:center;font-size:13px;color:var(--muted)}
.cb-sel{font:inherit;padding:5px 8px;border:1px solid var(--line);border-radius:8px;background:var(--surface);color:var(--fg);max-width:100%}
`;document.head.appendChild(s)})();

/* ---------- small lab helpers (same pattern as the other course files) ---------- */
function loopOn(el,fn){let last=performance.now();const f=now=>{if(!document.body.contains(el))return;const dt=Math.min(0.05,Math.max(0,(now-last)/1000));last=now;try{fn(dt)}catch(e){console.error(e);return}requestAnimationFrame(f)};requestAnimationFrame(f)}
function stepsUI(host,steps){let i=0;
  const draw=()=>{host.innerHTML=steps.map((s,j)=>`<li class="${j<i?'done':j===i?'cur':''}"><span class="k">${j<i?'✓':j+1}</span><div><h4>${s.t}</h4><p>${s.x}</p>${j===i?`<div class="act">${s.done?'<span class="hint">بانتظار تنفيذك…</span> <button class="btn" data-next>تخطَّ</button>':'<button class="btn primary" data-next>التالي</button>'}</div>`:''}</div></li>`).join('')+
    (i>=steps.length?`<li class="cur"><span class="k">✓</span><div><h4>أحسنت، أنهيت التجربة</h4><p style="display:block">جرّب قيماً أخرى، أو أعد التجربة من أولها.</p><div class="act"><button class="btn" data-restart>إعادة التجربة</button></div></div></li>`:'');B.math(host)};
  host.addEventListener('click',e=>{if(e.target.closest('[data-next]')){i++;draw()}if(e.target.closest('[data-restart]')){i=0;draw()}});draw();
  return {check(){const s=steps[i];if(s&&s.done&&s.done()){i++;draw()}},redraw:draw};}
const sl=(id,label,min,max,step,val)=>`<label class="cb-sl"><span class="cb-h"><span>${label}</span><b id="${id}-v"></b></span><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}" aria-label="${label.replace(/<[^>]+>/g,'')}"></label>`;
const segHTML=(attr,items,cur)=>`<div class="seg" role="group">${items.map(([v,l])=>`<button data-${attr}="${v}" aria-pressed="${String(v)===String(cur)}">${l}</button>`).join('')}</div>`;
const segSet=(el,attr,v)=>el.querySelectorAll(`[data-${attr}]`).forEach(b=>b.setAttribute('aria-pressed',String(String(b.dataset[attr])===String(v))));
const segBind=(el,attr,fn)=>el.querySelectorAll(`[data-${attr}]`).forEach(b=>b.addEventListener('click',()=>{segSet(el,attr,b.dataset[attr]);fn(b.dataset[attr])}));
const swHTML=(id,b,label,on)=>`<button class="sw" id="${id}" aria-pressed="${on?'true':'false'}"><span class="knob"></span><b>${b}</b><small>${label}</small></button>`;
const fact=(l,id)=>`<div class="fact"><span>${l}</span><b id="${id}">—</b></div>`;
const tryList=items=>`<div class="callout"><b>جرّب:</b><ol class="cb-try">${items.map(x=>`<li>${x}</li>`).join('')}</ol></div>`;
const arT=(x,y,s,o)=>{o=o||{};return `<text class="txt ar" x="${x}" y="${y}" text-anchor="${o.a||'middle'}"${o.fs?` font-size="${o.fs}"`:''}${o.col?` style="fill:var(${o.col})"`:''}>${s}</text>`};
const box=(svg,max)=>`<div class="svgbox" style="margin-inline:auto;${max?`max-width:${max}px`:''}">${svg}</div>`;
const Q=(n,q,ans)=>`<details class="cb-q"><summary>${n}: ${q}</summary><div class="cb-ans"><b>إجابة مقترحة (ليست من الكتاب):</b> ${ans}</div></details>`;
const NOTE_ADD='<b>توضيح للمتدرب — ليس من الكتاب:</b> ';
function stepsHTML(steps){return `<ol class="ex-steps">${steps.map(st=>`<li class="${st.final?'final':''}">${st.t?`<div class="ex-t">${st.t}</div>`:''}${st.f?`<div class="ex-f">${B.tex(st.f,true)}</div>`:''}${st.v!=null?`<div class="ex-v"><span class="ltr">${fm(st.v,st.dp)} ${st.unit||''}</span></div>`:''}</li>`).join('')}</ol>`}

/* ---------- schematic drawing kit ---------- */
/* label with subscripts: 'R_1 = 2 Ω' → R<sub>1</sub> = 2 Ω (SVG tspans) */
const lb=s=>String(s).replace(/_\{([^}]*)\}|_(\w+)/g,(m,a,b)=>`<tspan baseline-shift="sub" font-size="80%">${a!=null?a:b}</tspan>`);
const T=(x,y,s,o)=>{o=o||{};return `<text class="txt ${o.c||''}" x="${fx(x)}" y="${fx(y)}" text-anchor="${o.a||'middle'}"${o.fs?` font-size="${o.fs}"`:''}${o.col?` style="fill:var(${o.col})"`:''}>${lb(s)}</text>`};
const W=(pts,cls)=>`<path class="w ${cls||''}" d="${pts.map((p,i)=>(i?'L':'M')+fx(p[0])+' '+fx(p[1])).join('')}"/>`;
function zz(x1,y1,x2,y2,cls,n){n=n||6;const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy),ux=dx/len,uy=dy/len,nx=-uy,ny=ux,body=Math.min(46,len*0.7),lead=(len-body)/2,seg=body/n;let p=`M${fx(x1)} ${fx(y1)}L${fx(x1+ux*lead)} ${fx(y1+uy*lead)}`;
  for(let i=0;i<n;i++){const s=(i%2?-1:1)*7,m=lead+seg*(i+0.5);p+=`L${fx(x1+ux*m+nx*s)} ${fx(y1+uy*m+ny*s)}`}
  return `<path class="w ${cls||''}" d="${p}L${fx(x2-ux*lead)} ${fx(y2-uy*lead)}L${fx(x2)} ${fx(y2)}"/>`}
/* resistor with label. o:{side:'t'|'b'|'l'|'r', cls, v:second line, col} */
function Rz(x1,y1,x2,y2,l,o){o=o||{};const h=Math.abs(y2-y1)<Math.abs(x2-x1),mx=(x1+x2)/2,my=(y1+y2)/2;let s=zz(x1,y1,x2,y2,o.cls);
  const side=o.side||(h?'t':'r');let tx=mx,ty=my,a='middle';
  if(side==='t')ty=my-13;else if(side==='b')ty=my+22;else if(side==='r'){tx=mx+13;ty=my+4;a='start'}else{tx=mx-13;ty=my+4;a='end'}
  if(l)s+=T(tx,ty,l,{a,col:o.col});if(o.v)s+=T(tx,ty+(side==='t'?-17:15),o.v,{a,c:'b'});return s}
/* vertical battery between y1 (top) and y2 (bottom); positive plate up unless o.down. label left (o.side='r' for right) */
function Bv(x,y1,y2,l,o){o=o||{};const m=(y1+y2)/2,up=!o.down;const pl=up?m-4:m+4,ng=up?m+4:m-4,r=o.side==='r';
  let s=W([[x,y1],[x,m-4]],o.cls)+W([[x,m+4],[x,y2]],o.cls)+`<path d="M${x-15} ${pl}H${x+15}" stroke="var(--fg)" stroke-width="2.4"/><path d="M${x-8} ${ng}H${x+8}" stroke="var(--fg)" stroke-width="5"/>`;
  s+=T(r?x-20:x+20,up?m-8:m+17,'+',{c:'m',fs:13});if(l)s+=T(r?x+22:x-22,m+5,l,{a:r?'start':'end'});return s}
/* horizontal battery between x1 (left) and x2 (right); positive plate on the right unless o.left */
function Bh(x1,x2,y,l,o){o=o||{};const m=(x1+x2)/2,r=!o.left;const pl=r?m+4:m-4,ng=r?m-4:m+4;
  let s=W([[x1,y],[m-4,y]],o.cls)+W([[m+4,y],[x2,y]],o.cls)+`<path d="M${pl} ${y-15}V${y+15}" stroke="var(--fg)" stroke-width="2.4"/><path d="M${ng} ${y-8}V${y+8}" stroke="var(--fg)" stroke-width="5"/>`;
  s+=T(r?m+13:m-13,o.lbBelow?y-10:y+22,'+',{c:'m',fs:13});if(l)s+=T(m,o.lbBelow?y+32:y-21,l);return s}
/* current source (circle + arrow), vertical between y1,y2 ; o.down = arrow down */
function Iv(x,y1,y2,l,o){o=o||{};const m=(y1+y2)/2;let s=W([[x,y1],[x,m-15]],o.cls)+W([[x,m+15],[x,y2]],o.cls)+`<circle cx="${x}" cy="${m}" r="15" fill="var(--surface)" stroke="var(--fg)" stroke-width="2"/>`;
  s+=o.down?arrow(x,m-9,x,m+10,'--fg',2):arrow(x,m+9,x,m-10,'--fg',2);if(l)s+=T(o.side==='l'?x-20:x+20,m+4,l,{a:o.side==='l'?'end':'start'});return s}
function arrow(x1,y1,x2,y2,col,w){w=w||2.2;const a=Math.atan2(y2-y1,x2-x1),L=Math.hypot(x2-x1,y2-y1);if(L<3)return '';const h=Math.min(10,L*0.7)+w;
  const bx=x2-h*Math.cos(a),by=y2-h*Math.sin(a),px=-Math.sin(a)*h*0.45,py=Math.cos(a)*h*0.45;
  return `<path d="M${fx(x1)} ${fx(y1)}L${fx(bx)} ${fx(by)}" stroke="var(${col})" stroke-width="${w}" fill="none" stroke-linecap="round"/><path d="M${fx(x2)} ${fx(y2)}L${fx(bx+px)} ${fx(by+py)}L${fx(bx-px)} ${fx(by-py)}Z" fill="var(${col})"/>`}
/* current arrow drawn ON a wire at (x,y) pointing dir 'r'|'l'|'u'|'d', label beside */
function CA(x,y,dir,l,o){o=o||{};const col=o.col||'--stop',L=o.len||22;const d={r:[1,0],l:[-1,0],u:[0,-1],d:[0,1]}[dir];
  const x1=x-d[0]*L/2,y1=y-d[1]*L/2,x2=x+d[0]*L/2,y2=y+d[1]*L/2;let s=arrow(x1,y1,x2,y2,col,o.w||2.4);
  if(l){const h=dir==='r'||dir==='l';const tx=h?x:x+(o.side==='l'?-10:10),ty=h?y+(o.side==='b'?20:-9):y+4;s+=T(tx,ty,l,{a:h?'middle':(o.side==='l'?'end':'start'),col:o.lcol||col})}return s}
const Dot=(x,y)=>`<circle cx="${fx(x)}" cy="${fx(y)}" r="3.6" fill="var(--fg)"/>`;
const Term=(x,y,l,o)=>{o=o||{};return `<circle cx="${fx(x)}" cy="${fx(y)}" r="4.5" fill="var(--surface)" stroke="var(--fg)" stroke-width="2"/>`+(l?T(x+(o.dx||0),y+(o.dy!=null?o.dy:-9),l,{a:o.a}):'')};
const Pm=(x,y,s)=>T(x,y+4,s,{c:'m',fs:13});
const Gnd=(x,y)=>`<path d="M${x} ${y}V${y+8}M${x-11} ${y+8}H${x+11}M${x-7} ${y+12}H${x+7}M${x-3} ${y+16}H${x+3}" stroke="var(--fg)" stroke-width="1.8" fill="none"/>`;
/* R_T arrow (points to the network) */
const RTa=(x,y,l,o)=>{o=o||{};return arrow(x,y,x+(o.len||34),y,'--blue',2)+T(x+(o.len||34)/2,y-8,l||'R_T',{c:'b'})};
/* lamp symbol (circle with ×). b = brightness 0..1 (null = static) */
function Lamp(x,y,b,o){o=o||{};const r=13;const glow=b==null?'':`<circle cx="${x}" cy="${y}" r="${fx(r+4+10*Math.min(b,1.4))}" fill="var(--live)" opacity="${fx(Math.min(0.55,0.35*b))}"/>`;
  return glow+`<circle cx="${x}" cy="${y}" r="${r}" fill="${b>0.02?'var(--live-soft)':'var(--surface)'}" stroke="${o.dead?'var(--stop)':'var(--fg)'}" stroke-width="2"/><path d="M${x-9} ${y-9}L${x+9} ${y+9}M${x+9} ${y-9}L${x-9} ${y+9}" stroke="${o.dead?'var(--stop)':'var(--fg)'}" stroke-width="1.8"/>`+(o.dead?`<path d="M${x-14} ${y+16}L${x+14} ${y-16}" stroke="var(--stop)" stroke-width="3"/>`:'')}
/* horizontal fuse between x1,x2 at y */
function Fuse(x1,x2,y,blown,cls){const m=(x1+x2)/2;return W([[x1,y],[m-16,y]],cls)+W([[m+16,y],[x2,y]],cls)+`<rect x="${m-16}" y="${y-7}" width="32" height="14" rx="3" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/>`+(blown?`<path d="M${m-14} ${y}L${m-4} ${y}M${m+4} ${y}L${m+14} ${y}" stroke="var(--stop)" stroke-width="2"/><path d="M${m-3} ${y-5}L${m+3} ${y+5}" stroke="var(--stop)" stroke-width="2"/>`:`<path d="M${m-14} ${y}H${m+14}" class="w ${cls||''}"/>`)}
/* open switch (horizontal) */
function SwH(x1,x2,y,closed,cls){return Dot(x1,y)+Dot(x2,y)+(closed?W([[x1,y],[x2,y]],cls):`<path d="M${x1} ${y}L${x2-4} ${y-14}" stroke="var(--fg)" stroke-width="2.2"/>`)}
function SwV(x,y1,y2,closed,cls){return Dot(x,y1)+Dot(x,y2)+(closed?W([[x,y1],[x,y2]],cls):`<path d="M${x} ${y1}L${x+14} ${y2-4}" stroke="var(--fg)" stroke-width="2.2"/>`)}
const svg=(w,h,inner,aria)=>`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${aria||'دائرة كهربائية'}">${inner}</svg>`;
const figSVG=(w,h,inner,aria,max)=>box(svg(w,h,inner,aria),max||Math.min(620,w+40));

/* ---------- DC circuit solver (modified nodal analysis) ----------
   n nodes 0..n-1 (0 = reference). els: {t:'R',a,b,r} | {t:'V',a,b,v} (a = + terminal) | {t:'I',a,b,i} (i flows a→b through the source, i.e. into node b).
   returns {v:[node voltages], i:[current of each element: R a→b, V delivered out of +, I = i]} */
function mna(n,els){const vs=[];els.forEach((e,k)=>{if(e.t==='V')vs.push(k)});const N=n-1+vs.length;if(N<=0)return {v:[0],i:els.map(()=>0)};
  const A=Array.from({length:N},()=>new Array(N+1).fill(0));const ix=k=>k-1;
  els.forEach((e,k)=>{if(e.t==='R'){const g=1/Math.max(e.r,1e-9);[[e.a,e.a,g],[e.b,e.b,g],[e.a,e.b,-g],[e.b,e.a,-g]].forEach(([p,q,val])=>{if(p&&q)A[ix(p)][ix(q)]+=val})}
   else if(e.t==='I'){if(e.b)A[ix(e.b)][N]+=e.i;if(e.a)A[ix(e.a)][N]-=e.i}
   else if(e.t==='V'){const r=n-1+vs.indexOf(k);if(e.a){A[ix(e.a)][r]+=1;A[r][ix(e.a)]+=1}if(e.b){A[ix(e.b)][r]-=1;A[r][ix(e.b)]-=1}A[r][N]=e.v}});
  for(let c=0;c<N;c++){let p=c;for(let r=c+1;r<N;r++)if(Math.abs(A[r][c])>Math.abs(A[p][c]))p=r;[A[c],A[p]]=[A[p],A[c]];const d=A[c][c];if(Math.abs(d)<1e-15)continue;
   for(let r=0;r<N;r++){if(r===c)continue;const f=A[r][c]/d;if(f)for(let k=c;k<=N;k++)A[r][k]-=f*A[c][k]}}
  const x=A.map((row,r)=>Math.abs(row[r])<1e-15?0:row[N]/row[r]);const v=[0];for(let k=1;k<n;k++)v.push(x[k-1]);
  const cur=els.map((e,k)=>e.t==='R'?(v[e.a]-v[e.b])/Math.max(e.r,1e-9):e.t==='V'?-x[n-1+vs.indexOf(k)]:e.i);return {v,i:cur}}
/* equivalent resistance between nodes a and b of a resistor network (els with R only) */
function reqAB(n,els,a,b){const s=mna(n,els.concat([{t:'I',a:b,b:a,i:1}]));return s.v[a]-s.v[b]}
const par=(...r)=>1/r.reduce((s,x)=>s+1/x,0);
/* bars of powers */
function barsHTML(rows,max){max=Math.max(max||0,...rows.map(r=>Math.abs(r.v)),1e-9);return `<div class="cb-bars">${rows.map(r=>`<div class="cb-bar"><span>${r.l}</span><span class="tr"><i class="${r.src?'src':''}" style="width:${fx(clamp(Math.abs(r.v)/max*100,0,100))}%"></i></span><b>${r.t}</b></div>`).join('')}</div>`}
/* engineering format: value with prefix */
function eng(v,u,d){if(!isFinite(v))return '∞ '+u;const a=Math.abs(v);if(a===0)return '0 '+u;const P=[[1e6,'M'],[1e3,'k'],[1,''],[1e-3,'m'],[1e-6,'µ']];for(const [k,p] of P)if(a>=k*0.9995)return fm(sig(v/k,4),d==null?3:d)+' '+p+u;return fm(sig(v/1e-6,4),3)+' µ'+u}

/* ---------- generic figure builders ---------- */
/* vertical parallel branches between a top and a bottom rail.
   o:{src:'term'|'bat'|'in'|'isrc', E, rs:[{l,v,i,V,dash}], RT, IS, ser:{l}, dx, w} */
function parFig(o){const yt=40,yb=190,rs=o.rs,dx=o.dx||100;const xl=o.src==='term'?36:o.src==='in'?24:(o.xl||104);
  const xb0=o.ser?xl+200:xl+(o.src==='bat'||o.src==='isrc'?118:110);const xs=rs.map((r,k)=>xb0+k*dx),xr=xs[xs.length-1];let s='';
  if(o.src==='term'){s+=Term(xl,yt)+Term(xl,yb)+W([[xl+4,yt],[o.ser?xl+40:xl+4,yt]])}
  else if(o.src==='bat'){s+=Bv(xl,yt,yb,o.E||'E')+(o.IS?CA(xl+36,yt,'r',o.IS):'')}
  else if(o.src==='isrc'){s+=Iv(xl,yt,yb,o.E||'I',{side:'l'})}
  else if(o.src==='in'){s+=`<path d="M${xl} ${yt}H${xs[0]}M${xl} ${yb}H${xs[0]}" stroke="var(--wire)" stroke-width="2" stroke-dasharray="6 5" fill="none"/>`+CA(xl+40,yt,'r',o.IS||'I');}
  if(o.ser){s+=W([[xl,yt],[xl+50,yt]])+Rz(xl+50,yt,xl+150,yt,o.ser.l)+W([[xl+150,yt],[xs[0],yt]])}
  else if(o.src!=='in')s+=W([[xl,yt],[xs[0],yt]]);
  if(o.src!=='in')s+=W([[xl,yb],[xs[0],yb]]);
  s+=W([[xs[0],yt],[xr,yt]])+W([[xs[0],yb],[xr,yb]]);
  if(o.RT)s+=RTa(o.src==='term'?xl+14:xl+30,yt+(yb-yt)/2+(o.src==='bat'?-0:0),o.RT,{len:34});
  rs.forEach((r,k)=>{const x=xs[k];const dash=r.dash?'stroke-dasharray="5 5"':'';
    s+=r.dash?`<path d="M${x} ${yt}V${yb}" stroke="var(--wire)" stroke-width="2" stroke-dasharray="5 5"/>`:Rz(x,yt,x,yb,r.l,{side:'r'});
    if(r.dash&&r.l)s+=T(x+12,(yt+yb)/2+4,r.l,{a:'start'});
    if(r.i)s+=CA(x,yt+26,'d',r.i,{side:'l',len:18});
    if(r.V){s+=Pm(x-22,yt+50,'+')+Pm(x-22,yb-34,'−')+T(x-22,(yt+yb)/2+18,r.V,{a:'middle',c:'b'})}
    if(k<rs.length-1&&k>0||k===0)s+=Dot(x,yt)+Dot(x,yb)});
  return svg(xr+(o.wr||90),yb+(o.hb||22),s,o.aria)}
/* horizontal parallel branches between a left node and a right node (الأشكال 3-21، 3-31، 3-32) */
function hParFig(o){const rs=o.rs,n=rs.length,gap=o.gap||(n>2?62:96),y0=40,ys=rs.map((r,k)=>y0+k*gap),ym=(ys[0]+ys[n-1])/2,xL=120,xR=340;let s='';
  s+=W([[16,ym],[xL,ym]])+W([[xR,ym],[440,ym]])+W([[xL,ys[0]],[xL,ys[n-1]]])+W([[xR,ys[0]],[xR,ys[n-1]]])+Dot(xL,ym)+Dot(xR,ym);
  rs.forEach((r,k)=>{const y=ys[k];s+=W([[xL,y],[180,y]])+Rz(180,y,290,y,r.l,{side:'t'})+W([[290,y],[xR,y]]);if(r.i)s+=CA(150,y,'r',r.i,{len:18,side:r.ib?'b':'t'})});
  if(o.Iin)s+=CA(62,ym,'r',o.Iin);if(o.Iout)s+=CA(392,ym,'r',o.Iout);
  return svg(456,ys[n-1]+34,s,o.aria)}

/* الشكل (3-20) */
function fig320(){let s=Term(30,40)+Term(30,200)+RTa(42,120,'R_T',{len:34});
  s+=W([[34,40],[480,40]])+W([[34,200],[480,200]]);
  s+=Rz(130,40,130,200,'R_1 = 2 Ω')+Dot(130,40)+Dot(130,200);
  s+=W([[300,40],[300,70]])+W([[230,70],[370,70]])+W([[300,200],[300,170]])+W([[230,170],[370,170]])+Rz(230,70,230,170,'R_2 = 2 Ω')+Rz(370,70,370,170,'R_3 = 2 Ω')+Dot(300,40)+Dot(300,200)+Dot(300,70)+Dot(300,170);
  s+=Rz(480,40,480,200,'R_4 = 2 Ω');
  return svg(580,222,s,'أربع مقاومات متساوية على التوازي')}
/* الشكل (3-22): fan drawing + conventional drawing */
function fig322(){let s=Term(24,40)+Term(24,200)+RTa(34,120,'R_T',{len:30});
  s+=W([[28,40],[170,40]])+W([[28,200],[290,200]])+Dot(170,40);
  s+=zz(170,40,80,200)+zz(170,40,170,200)+zz(170,40,260,200)+Dot(80,200)+Dot(170,200)+Dot(260,200);
  s+=T(104,118,'R_1=2Ω',{a:'end'})+T(178,150,'R_2=4Ω',{a:'start'})+T(232,110,'R_3=5Ω',{a:'start'});
  let t='';const ox=330;t+=Term(ox,40)+Term(ox,200)+RTa(ox+10,120,'R_T',{len:30})+W([[ox+4,40],[ox+260,40]])+W([[ox+4,200],[ox+260,200]]);
  [[ox+90,'R_1 2Ω'],[ox+175,'R_2 4Ω'],[ox+260,'R_3 5Ω']].forEach(([x,l],k)=>{t+=Rz(x,40,x,200,l)+(k<2?Dot(x,40)+Dot(x,200):'')});
  return svg(660,222,s+t,'ثلاث مقاومات على التوازي مرسومة بطريقتين')}
/* الشكل (3-25): resistors to separate grounds */
function fig325(){let s=Bv(50,40,190,'E')+Gnd(50,190)+CA(50,62,'u','I_S',{side:'r',len:16})+W([[50,40],[420,40]]);
  s+=T(130,30,'R_T = 4 Ω',{c:'b'})+arrow(96,40,96,40,'--blue');
  [[200,'R_1 = 10 Ω','I_1 = 4 A'],[300,'R_2 = 20 Ω','I_2'],[400,'R_3','']].forEach(([x,l,i])=>{s+=Dot(x,40)+Rz(x,40,x,180,l)+Gnd(x,180)+(i?CA(x,66,'d',i,{side:'l',len:16}):'')});
  return svg(500,212,s,'ثلاث مقاومات على التوازي إلى أرضي')}

/* ======================================================================
   Lesson 7 (u3-l7) — توصيل المقاومات على التوازي (ص 72–78)
   ====================================================================== */
const F318=()=>parFig({src:'term',RT:'R_T',rs:[{l:'R_1'},{l:'R_2'},{l:'R_3'},{l:'R_N'}],aria:'توصيل المقاومات على التوازي'});
const F319=()=>parFig({src:'term',RT:'R_T',rs:[{l:'R_1 = 2Ω'},{l:'R_2 = 4Ω'},{l:'R_3 = 5Ω'}],aria:'ثلاث مقاومات على التوازي'});
const F321=(o)=>hParFig({Iin:'I = 12 A',Iout:(o&&o.out)||'I_3',rs:[{l:'R_1 = 2 Ω',i:'I_1'},{l:'R_2 = 4 Ω',i:'I_2',ib:1}],aria:'مقاومتان على التوازي يدخلهما تيار 12 A'});
const F323=()=>parFig({src:'term',RT:'R_T = 16 kΩ',rs:[{l:'R_1'},{l:'R_2'},{l:'R_3'}],aria:'ثلاث مقاومات مجهولة على التوازي'});
const F324=()=>parFig({src:'bat',E:'E = 27V',IS:'I_S',rs:[{l:'R_1 = 9Ω',i:'I_1',V:'V_1'},{l:'R_2 = 18Ω',i:'I_2',V:'V_2'}],dx:130,aria:'بطارية 27 V ومقاومتان على التوازي'});

const G18=[{id:'R1',label:'المقاومة الأولى',sym:'R_1',unit:'Ω',value:2},{id:'R2',label:'المقاومة الثانية',sym:'R_2',unit:'Ω',value:4},{id:'R3',label:'المقاومة الثالثة',sym:'R_3',unit:'Ω',value:5}];
const bad=t=>[{t:'تعذّر الحساب: '+t}];
function solve318(g,B,bk){if(!(g.R1>0&&g.R2>0&&g.R3>0))return bad('كل مقاومة يجب أن تكون أكبر من صفر.');
  const G=B.round(1/g.R1+1/g.R2+1/g.R3,4),R=B.round(1/G,3);
  return [{t:'باستخدام المعادلة (3-30):',f:`\\frac{1}{R_T}=\\frac{1}{R_1}+\\frac{1}{R_2}+\\frac{1}{R_3}=\\frac{1}{${fm(g.R1)}}+\\frac{1}{${fm(g.R2)}}+\\frac{1}{${fm(g.R3)}}`,v:G,unit:'S',dp:bk?2:4},
   {t:'المقاومة الكلية:',f:`R_T=\\frac{1}{${fm(G)}}`,v:R,unit:'Ω',dp:3,final:true},
   {t:'والموصلية الكلية (المعادلة 3-29):',f:'G_T=\\frac{1}{R_T}=G_1+G_2+G_3',v:G,unit:'S',dp:bk?2:4,final:true}]}
function solve321(g,B){if(!(g.R1>0&&g.R2>0&&g.R3>0))return bad('كل مقاومة يجب أن تكون أكبر من صفر.');
  const n=g.R1*g.R2*g.R3,d=g.R1*g.R2+g.R1*g.R3+g.R2*g.R3;
  return [{t:'باستخدام المعادلة (3-32):',f:`R_T=\\frac{R_1R_2R_3}{R_1R_2+R_1R_3+R_2R_3}=\\frac{(${fm(g.R1)})(${fm(g.R2)})(${fm(g.R3)})}{(${fm(g.R1)})(${fm(g.R2)})+(${fm(g.R1)})(${fm(g.R3)})+(${fm(g.R2)})(${fm(g.R3)})}=\\frac{${fm(n)}}{${fm(d)}}`,v:B.round(n/d,3),unit:'Ω',dp:3,final:true},
   {t:'نفس نتيجة مثال (3-18) بالمعادلة (3-30).'}]}
function solve320(g,B,bk){if(!(g.R1>0&&g.R2>0))return bad('المقاومتان يجب أن تكونا أكبر من صفر.');
  const R=B.round(g.R1*g.R2/(g.R1+g.R2),4),V=B.round(g.I*R,4),I1=B.round(V/g.R1,4),I2=B.round(V/g.R2,4);
  const out=[{t:'باستخدام المعادلة (3-31):',f:`R_T=\\frac{R_1R_2}{R_1+R_2}=\\frac{(${fm(g.R1)})\\times(${fm(g.R2)})}{${fm(g.R1)}+${fm(g.R2)}}`,v:R,unit:'Ω',dp:4},
   {t:'الجهد على طرفي المقاومتين (التوازي):',f:`V=I\\times R_T=${fm(g.I)}\\times ${fm(R)}`,v:V,unit:'V',dp:4},
   {t:'',f:`I_1=\\frac{V}{R_1}=\\frac{${fm(V)}}{${fm(g.R1)}}`,v:I1,unit:'A',dp:4,final:true},
   {t:'',f:`I_2=\\frac{V}{R_2}=\\frac{${fm(V)}}{${fm(g.R2)}}`,v:I2,unit:'A',dp:4,final:true}];
  if(bk)out.push({t:'الأرقام 15.9996 و 7.9998 و 3.9999 سببها تقريب R<sub>T</sub> إلى 1.3333؛ القيم الدقيقة: R<sub>T</sub> = 4/3 Ω، V = 16 V، I<sub>1</sub> = 8 A، I<sub>2</sub> = 4 A (قارن بمثال 3-26).'});
  return out}
function solve322(g,B,bk,fixed){if(!(g.RT>0&&g.k2>0&&g.k3>0))return bad('القيم يجب أن تكون أكبر من صفر.');
  const c=B.round(1+1/g.k2+1/(g.k2*g.k3),4),R1=B.round(c*g.RT,4),u=fixed?'kΩ':(bk?'Ω':'kΩ');
  return [{t:`بما أن \\(R_2=${fm(g.k2)}R_1\\) و \\(R_3=${fm(g.k3)}R_2=${fm(g.k2*g.k3)}R_1\\) نعوض في المعادلة (3-30):`,f:`\\frac{1}{${fm(g.RT)}}=\\frac{1}{R_1}+\\frac{1}{${fm(g.k2)}R_1}+\\frac{1}{${fm(g.k2*g.k3)}R_1}=${fm(c)}\\left(\\frac{1}{R_1}\\right)`,v:c,dp:null},
   {t:'ومنها:',f:`R_1=${fm(c)}\\times ${fm(g.RT)}`,v:R1,unit:u,final:true},
   {t:'',f:`R_2=${fm(g.k2)}R_1=${fm(g.k2)}\\times ${fm(R1)}`,v:B.round(g.k2*R1,4),unit:u,final:true},
   {t:'',f:`R_3=${fm(g.k2*g.k3)}R_1=${fm(g.k2*g.k3)}\\times ${fm(R1)}`,v:B.round(g.k2*g.k3*R1,4),unit:u,final:true}].concat(bk&&!fixed?[{t:'<b>كما في الكتاب:</b> الوحدة مطبوعة Ω، والصحيح kΩ لأن R<sub>T</sub> = 16 kΩ — انظر الحل المصحح.'}]:[])}
function solve323(g,B){if(!(g.R1>0&&g.R2>0))return bad('المقاومتان يجب أن تكونا أكبر من صفر.');
  const R=B.round(g.R1*g.R2/(g.R1+g.R2),4),IS=B.round(g.E/R,4),I1=B.round(g.E/g.R1,4),I2=B.round(g.E/g.R2,4);
  return [{t:'(أ) المقاومة الكلية:',f:`R_T=\\frac{R_1\\times R_2}{R_1+R_2}=\\frac{${fm(g.R1)}\\times ${fm(g.R2)}}{${fm(g.R1)}+${fm(g.R2)}}=\\frac{${fm(g.R1*g.R2)}}{${fm(g.R1+g.R2)}}`,v:R,unit:'Ω',final:true},
   {t:'',f:`I_S=\\frac{E}{R_T}=\\frac{${fm(g.E)}}{${fm(R)}}`,v:IS,unit:'A',final:true},
   {t:'جهد كل مقاومة يساوي E:',f:`I_1=\\frac{V_1}{R_1}=\\frac{E}{R_1}=\\frac{${fm(g.E)}}{${fm(g.R1)}}`,v:I1,unit:'A',final:true},
   {t:'',f:`I_2=\\frac{V_2}{R_2}=\\frac{E}{R_2}=\\frac{${fm(g.E)}}{${fm(g.R2)}}`,v:I2,unit:'A',final:true},
   {t:'للتأكد من صحة الحل:',f:`I_S=I_1+I_2=${fm(I1)}+${fm(I2)}`,v:B.round(I1+I2,4),unit:'A'},
   {t:'(ب) القدرة المفقودة في كل مقاومة وقدرة المنبع:',f:`P_1=E\\times I_1=(${fm(g.E)})\\times(${fm(I1)})`,v:B.round(g.E*I1,4),unit:'W',final:true},
   {t:'',f:`P_2=E\\times I_2=(${fm(g.E)})\\times(${fm(I2)})`,v:B.round(g.E*I2,4),unit:'W',final:true},
   {t:'',f:`P_S=E\\times I_S=(${fm(g.E)})\\times(${fm(IS)})`,v:B.round(g.E*IS,4),unit:'W',final:true},
   {t:'نلاحظ أن:',f:`P_S=P_1+P_2=${fm(B.round(g.E*I1,4))}+${fm(B.round(g.E*I2,4))}`,v:B.round(g.E*I1+g.E*I2,4),unit:'W'}]}
function solve324(g,B){if(!(g.RT>0&&g.R1>0&&g.R2>0))return bad('القيم يجب أن تكون أكبر من صفر.');
  const x=B.round(1/g.RT-1/g.R1-1/g.R2,4);
  const out=[{t:'(أ) من المعادلة (3-30):',f:`\\frac{1}{${fm(g.RT)}}=\\frac{1}{${fm(g.R1)}}+\\frac{1}{${fm(g.R2)}}+\\frac{1}{R_3}\\;\\Rightarrow\\;${fm(B.round(1/g.RT,4))}=${fm(B.round(1/g.R1+1/g.R2,4))}+\\frac{1}{R_3}`,v:null},
   {t:'',f:`\\frac{1}{R_3}=${fm(B.round(1/g.RT,4))}-${fm(B.round(1/g.R1+1/g.R2,4))}`,v:x,unit:'S'}];
  if(!(x>0)){out.push({t:'تعذّر الحساب: يجب أن تكون R<sub>T</sub> أصغر من مقاومة R<sub>1</sub> و R<sub>2</sub> على التوازي (المقاومة الكلية للتوازي أصغر من أي فرع).'});return out}
  const R3=B.round(1/x,4),E=B.round(g.I1*g.R1,4),IS=B.round(E/g.RT,4),I2=B.round(E/g.R2,4);
  return out.concat([{t:'',f:`R_3=\\frac{1}{${fm(x)}}`,v:R3,unit:'Ω',final:true},
   {t:'جهد البطارية يساوي جهد R<sub>1</sub>:',f:`E=V_1=I_1R_1=(${fm(g.I1)}\\times ${fm(g.R1)})`,v:E,unit:'V',final:true},
   {t:'تيار المنبع:',f:`I_S=\\frac{E}{R_T}=\\frac{${fm(E)}}{${fm(g.RT)}}`,v:IS,unit:'A',final:true},
   {t:'(ب) التيار في R<sub>2</sub> وقدرتها:',f:`I_2=\\frac{V_2}{R_2}=\\frac{E}{R_2}=\\frac{${fm(E)}}{${fm(g.R2)}}`,v:I2,unit:'A',final:true},
   {t:'',f:`P_2=I_2^2\\times R_2=(${fm(I2)})^2\\times(${fm(g.R2)})`,v:B.round(I2*I2*g.R2,4),unit:'W',final:true}])}

B.lesson({
 id:'u3-l7',unit:3,order:7,pages:'72–78',
 title:'توصيل المقاومات على التوازي',
 summary:'في التوازي يكون فرق الجهد على كل مقاومة متساوياً: الموصلية الكلية مجموع الموصليات، ومقلوب المقاومة الكلية مجموع المقلوبات. حالة المقاومات المتساوية R/N، وقاعدتا المقاومتين (3-31) والثلاث (3-32)، والتيارات والقدرة في دوائر التوازي — مع الأمثلة (3-18) إلى (3-24).',
 stations:[
  {intro:true},

  {st:1,short:'التوصيل على التوازي',title:'توصيل المقاومات على التوازي',ref:'ص 72',
   q:'إذا وصلت عدة مقاومات بين نفس النقطتين، فما الشيء الذي يكون متساوياً عليها كلها؟ وماذا يحدث للمقاومة الكلية كلما أضفت مقاومة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مقاومات موصلة على التوازي بين خطين: كل مقاومة طرفها العلوي على الخط العلوي وطرفها السفلي على الخط السفلي" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><circle cx="48" cy="80" r="5.5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="48" cy="232" r="5.5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M53 80 L310 80" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M53 232 L310 232" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="السهم ⟦R_T⟧: المقاومة الكلية (المكافئة) التي «تراها» من الطرفين."><path d="M58 156L81 156" stroke="#3B7DD8" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M92 156L81 161.5L81 150.5Z" fill="#3B7DD8"/><text x="75" y="146" text-anchor="middle" font-size="13" fill="#3B7DD8" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">T</tspan></text><rect x="54" y="130" width="44" height="36" fill="transparent"/></g><g data-tip="الخط العلوي: كل الأطراف العليا للمقاومات متصلة به مباشرة، فهي كلها نقطة كهربائية واحدة."><path d="M53 80 L310 80" fill="none" stroke="#E8735A" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><rect x="53" y="72" width="260" height="16" fill="transparent"/></g><g data-tip="الخط السفلي: كل الأطراف السفلى متصلة به، فهي أيضاً نقطة واحدة."><path d="M53 232 L310 232" fill="none" stroke="#4FB3A9" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><rect x="53" y="224" width="260" height="16" fill="transparent"/></g><g data-tip="المقاومة ⟦R1⟧: طرفها العلوي على الخط العلوي وطرفها السفلي على الخط السفلي، فجهدها هو نفس جهد بقية المقاومات."><path d="M130 80 L130 134 L123 137.7 L137 145 L123 152.3 L137 159.7 L123 167 L137 174.3 L130 178 L130 232" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="140" y="161" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">1</tspan></text><rect x="118" y="100" width="40" height="112" fill="transparent"/></g><circle cx="130" cy="80" r="4" fill="#2C4A40"/><circle cx="130" cy="232" r="4" fill="#2C4A40"/><g data-tip="المقاومة ⟦R2⟧: طرفها العلوي على الخط العلوي وطرفها السفلي على الخط السفلي، فجهدها هو نفس جهد بقية المقاومات."><path d="M190 80 L190 134 L183 137.7 L197 145 L183 152.3 L197 159.7 L183 167 L197 174.3 L190 178 L190 232" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="200" y="161" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">2</tspan></text><rect x="178" y="100" width="40" height="112" fill="transparent"/></g><circle cx="190" cy="80" r="4" fill="#2C4A40"/><circle cx="190" cy="232" r="4" fill="#2C4A40"/><g data-tip="المقاومة ⟦R3⟧: طرفها العلوي على الخط العلوي وطرفها السفلي على الخط السفلي، فجهدها هو نفس جهد بقية المقاومات."><path d="M250 80 L250 134 L243 137.7 L257 145 L243 152.3 L257 159.7 L243 167 L257 174.3 L250 178 L250 232" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="260" y="161" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">3</tspan></text><rect x="238" y="100" width="40" height="112" fill="transparent"/></g><circle cx="250" cy="80" r="4" fill="#2C4A40"/><circle cx="250" cy="232" r="4" fill="#2C4A40"/><g data-tip="المقاومة ⟦RN⟧: طرفها العلوي على الخط العلوي وطرفها السفلي على الخط السفلي، فجهدها هو نفس جهد بقية المقاومات."><path d="M310 80 L310 134 L303 137.7 L317 145 L303 152.3 L317 159.7 L303 167 L317 174.3 L310 178 L310 232" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="320" y="161" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">N</tspan></text><rect x="298" y="100" width="40" height="112" fill="transparent"/></g><circle cx="310" cy="80" r="4" fill="#2C4A40"/><circle cx="310" cy="232" r="4" fill="#2C4A40"/><text x="180" y="52" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">فرق جهد واحد على كل المقاومات</text><text x="180" y="268" text-anchor="middle" font-size="13" fill="#2C4A40" direction="rtl">كل مقاومة تفتح طريقاً جديداً للتيار</text></svg>`,
   cap:'الشكل <span class="ltr">(3-18)</span> بتلوين الخطين: كل الأطراف العليا على خط واحد وكل الأطراف السفلى على خط واحد.<br><b>مرّر المؤشر على الخطين والمقاومات والسهم (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'حسب تعريف الكتاب، متى نقول إن مجموعة مقاومات موصلة <b>على التوازي</b>؟',opts:[
     ['إذا مر في كل منها نفس التيار',false,'هذا وصف التوالي: التيار نفسه يمر في كل المقاومات.'],
     ['إذا كان فرق الجهد عبر أي مقاومة منها متساوياً',true,'نص الكتاب ص 72: «إذا تم توصيل عدد من المقاومات بشكل يكون فيه فرق الجهد عبر أي مقاومة منها متساوٍ، فإن هذا التوصيل يسمى بالتوصيل على التوازي».'],
     ['إذا كانت قيمها متساوية',false,'القيم قد تختلف (مثل 2 و 4 و 5 Ω في مثال 3-18)؛ الذي يتساوى هو فرق الجهد.']]}}
   ],
   body:[
    {book:String.raw`<p>سيتم شرح كيفية توصيل المقاومات على التوازي وكذلك قانون كيرشوف للتيار بالإضافة إلى قاعدة توزيع التيار، وكذلك الدوائر المفتوحة ودوائر القصر. وسيتم توضيح ذلك بأمثلة متنوعة.</p>
     <p>إذا تم توصيل عدد من المقاومات بشكل يكون فيه <b>فرق الجهد عبر أي مقاومة منها متساوٍ</b>، فإن هذا التوصيل يسمى بالتوصيل على التوازي.</p>
     <p>لأي عدد من الموصلية G موصلة على التوازي، يمكننا أن نحصل على الموصلية الكلية \(G_T\) كالآتي:</p>
     <div class="eq">$$G_T=G_1+G_2+G_3+\cdots+G_N$$<span class="eqno">(3-29)</span></div>
     <p>حيث إن G هي مقلوب المقاومة R، \((R=1/G)\)، وبالتالي فإن:</p>
     <div class="eq">$$\frac{1}{R_T}=\frac{1}{R_1}+\frac{1}{R_2}+\frac{1}{R_3}+\cdots+\frac{1}{R_N}$$<span class="eqno">(3-30)</span></div>
     <p>حيث \(R_T\) هي المقاومة الكلية كما هو موضح في الشكل (3-18).</p>`,ref:'ص 72'},
    {tip:String.raw`<p><b>الموصلية G</b> تقيس «سهولة» مرور التيار، وهي مقلوب المقاومة: \(G=1/R\)، ووحدتها <b>السيمنز S</b>. كل مقاومة تضيفها على التوازي تفتح طريقاً جديداً للتيار، فتزيد الموصلية الكلية (المعادلة 3-29) وتنقص المقاومة الكلية.</p>
     <p>لذلك المقاومة الكلية لمقاومات على التوازي تكون دائماً <b>أصغر من أصغر مقاومة</b> فيها.</p>`},
    {title:'أضف الفروع واحداً واحداً (مقاومات مثال 3-18)',widget:(el,B)=>{
      const R=[2,4,5],on=[true,false,false];const F=x=>B.fmtN(+x.toFixed(4));
      const draw=()=>{const L=R.filter((r,i)=>on[i]);const G=L.reduce((s,r)=>s+1/r,0);
       el.innerHTML=`<div class="w-row" style="margin-top:0"><span class="w-l">الفروع الموصولة:</span><span class="mseg">${R.map((r,i)=>`<button type="button" data-i="${i}" aria-pressed="${on[i]}" style="font-family:var(--font)"><span class="ltr">R<sub>${i+1}</sub> = ${r} Ω</span></button>`).join('')}</span></div>
        <table class="tt" style="margin-top:12px"><tbody>
        <tr><td>عدد الفروع الموصولة</td><td><b>${L.length}</b></td></tr>
        <tr><td>الموصلية الكلية \\(G_T\\) — المعادلة (3-29)</td><td><b class="ltr">${F(G)} S</b></td></tr>
        <tr><td>المقاومة الكلية \\(R_T=1/G_T\\) — المعادلة (3-30)</td><td><b class="ltr">${L.length?F(1/G)+' Ω':'∞'}</b></td></tr>
        <tr><td>أصغر مقاومة موصولة</td><td><span class="ltr">${L.length?Math.min(...L)+' Ω':'—'}</span></td></tr></tbody></table>
        <p class="sub" style="margin:8px 0 0">${L.length?(L.length>1?'لاحظ: \\(R_T\\) أصغر من أصغر مقاومة موصولة.':'فرع واحد فقط: المقاومة الكلية هي نفسها مقاومة الفرع.'):'لا يوجد أي فرع موصول: الدائرة مفتوحة ولا يمر تيار.'}</p>`;
       el.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{on[+b.dataset.i]=!on[+b.dataset.i];draw()});B.math(el)};
      draw();
    }},
    {watch:String.raw`<p>لا تجمع المقاومات مباشرة في التوازي (\(2+4+5\) خطأ). في التوازي نجمع <b>المقلوبات</b> (أو الموصليات)، ثم نقلب الناتج في آخر خطوة لنحصل على \(R_T\).</p>`}
   ]},

  {st:2,short:'مثال <span class="ltr">(3-18)</span>',title:'مثال <span class="ltr">(3-18)</span>: المقاومة الكلية والموصلية الكلية',ref:'ص 72–73',
   q:'ثلاث مقاومات 2 و 4 و 5 أوم على التوازي: هل تتوقع أن تكون المقاومة الكلية أكبر من 2 Ω أم أصغر؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ثلاث مقاومات على التوازي: 2 و 4 و 5 أوم" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><circle cx="48" cy="80" r="5.5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="48" cy="232" r="5.5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M53 80 L290 80" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M53 232 L290 232" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="السهم ⟦R_T⟧: المقاومة الكلية (المكافئة) التي «تراها» من الطرفين."><path d="M58 156L81 156" stroke="#3B7DD8" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M92 156L81 161.5L81 150.5Z" fill="#3B7DD8"/><text x="75" y="146" text-anchor="middle" font-size="13" fill="#3B7DD8" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">T</tspan></text><rect x="54" y="130" width="44" height="36" fill="transparent"/></g><g data-tip="⟦R1 = 2Ω⟧ وموصليتها ⟦G1 = 1/2 = 0.5 S⟧."><path d="M150 80 L150 134 L143 137.7 L157 145 L143 152.3 L157 159.7 L143 167 L157 174.3 L150 178 L150 232" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="162" y="150" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">1</tspan></text><text x="162" y="168" text-anchor="start" font-size="13" fill="#2C4A40">2Ω</text><rect x="138" y="100" width="52" height="112" fill="transparent"/></g><circle cx="150" cy="80" r="4" fill="#2C4A40"/><circle cx="150" cy="232" r="4" fill="#2C4A40"/><g data-tip="⟦R2 = 4Ω⟧ وموصليتها ⟦G2 = 1/4 = 0.25 S⟧."><path d="M220 80 L220 134 L213 137.7 L227 145 L213 152.3 L227 159.7 L213 167 L227 174.3 L220 178 L220 232" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="232" y="150" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">2</tspan></text><text x="232" y="168" text-anchor="start" font-size="13" fill="#2C4A40">4Ω</text><rect x="208" y="100" width="52" height="112" fill="transparent"/></g><circle cx="220" cy="80" r="4" fill="#2C4A40"/><circle cx="220" cy="232" r="4" fill="#2C4A40"/><g data-tip="⟦R3 = 5Ω⟧ وموصليتها ⟦G3 = 1/5 = 0.2 S⟧."><path d="M290 80 L290 134 L283 137.7 L297 145 L283 152.3 L297 159.7 L283 167 L297 174.3 L290 178 L290 232" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="302" y="150" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">3</tspan></text><text x="302" y="168" text-anchor="start" font-size="13" fill="#2C4A40">5Ω</text><rect x="278" y="100" width="52" height="112" fill="transparent"/></g><text x="180" y="274" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700">1/R<tspan baseline-shift="sub" font-size="75%">T</tspan> = 0.5 + 0.25 + 0.2 = 0.95 S</text><text x="180" y="52" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">الشكل <tspan direction="ltr" unicode-bidi="embed">(3-19)</tspan></text></svg>`,
   cap:'الشكل <span class="ltr">(3-19)</span>: ثلاث مقاومات على التوازي، وتحته ناتج جمع الموصليات.<br><b>مرّر المؤشر على أي مقاومة (أو المسها في الجوال) لتعرف موصليتها.</b>',
   side:[
    {predict:{q:String.raw`قبل الحساب: المقاومة الكلية \(R_T\) لهذه المقاومات الثلاث تكون…`,opts:[
     ['أكبر من 5 Ω',false,'هذا يحدث في التوالي، حيث تُجمع المقاومات.'],
     ['بين 2 Ω و 5 Ω',false,'في التوازي تكون المقاومة الكلية أصغر من أصغر مقاومة (2 Ω).'],
     ['أصغر من 2 Ω',true,String.raw`الناتج في الكتاب \(R_T=1.053\ \Omega\)، وهو أصغر من أصغر مقاومة.`]]}}
   ],
   body:[
    {book:String.raw`<p>للدائرة الموضحة في الشكل (3-19)، احسب المقاومة الكلية \(R_T\) وكذلك الموصلية الكلية \(G_T\).</p>
     <p><b>الحل:</b></p>
     $$\frac{1}{R_T}=\frac{1}{R_1}+\frac{1}{R_2}+\frac{1}{R_3}=\frac{1}{2}+\frac{1}{4}+\frac{1}{5}=0.95\ \text{S}$$
     $$R_T=\frac{1}{0.95}=1.053\ \Omega\qquad G_T=0.95\ \text{S}$$`,ref:'ص 72–73'},
    {tip:String.raw`<p>لاحظ أن \(1/R_T\) و\(G_T\) رقم واحد (0.95 S): الموصلية الكلية هي مقلوب المقاومة الكلية. لذلك يكتب الكتاب ناتج \(1/R_T\) بوحدة السيمنز S.</p>`},
    {html:String.raw`<div class="w-row"><button class="btn pri" type="button" onclick="var b=document.querySelector('.ltabs button[data-tab=examples]');if(b)b.click()">افتح الحل خطوة بخطوة في «الأمثلة المحلولة»</button></div>`}
   ]},

  {st:3,short:'مقاومات متساوية',title:'المقاومة الكلية لمجموعة مقاومات متساوية موصلة على التوازي',ref:'ص 73',
   q:'أربع مقاومات متساوية على التوازي: هل تحتاج إلى جمع المقلوبات، أم توجد طريقة أسرع؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="أربع مقاومات متساوية على التوازي وتحتها القاعدة R_T = R/N" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><circle cx="48" cy="80" r="5.5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="48" cy="210" r="5.5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M53 80 L280 80" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M53 210 L280 210" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="السهم ⟦R_T⟧: المقاومة الكلية (المكافئة) التي «تراها» من الطرفين."><path d="M58 145L81 145" stroke="#3B7DD8" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M92 145L81 150.5L81 139.5Z" fill="#3B7DD8"/><text x="75" y="135" text-anchor="middle" font-size="13" fill="#3B7DD8" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">T</tspan></text><rect x="54" y="119" width="44" height="36" fill="transparent"/></g><path d="M130 80 L130 123 L123 126.7 L137 134 L123 141.3 L137 148.7 L123 156 L137 163.3 L130 167 L130 210" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="140" y="150" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="700">R</text><circle cx="130" cy="80" r="4" fill="#2C4A40"/><circle cx="130" cy="210" r="4" fill="#2C4A40"/><path d="M180 80 L180 123 L173 126.7 L187 134 L173 141.3 L187 148.7 L173 156 L187 163.3 L180 167 L180 210" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="190" y="150" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="700">R</text><circle cx="180" cy="80" r="4" fill="#2C4A40"/><circle cx="180" cy="210" r="4" fill="#2C4A40"/><path d="M230 80 L230 123 L223 126.7 L237 134 L223 141.3 L237 148.7 L223 156 L237 163.3 L230 167 L230 210" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="240" y="150" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="700">R</text><circle cx="230" cy="80" r="4" fill="#2C4A40"/><circle cx="230" cy="210" r="4" fill="#2C4A40"/><path d="M280 80 L280 123 L273 126.7 L287 134 L273 141.3 L287 148.7 L273 156 L287 163.3 L280 167 L280 210" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="290" y="150" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="700">R</text><g data-tip="⟦N⟧: عدد المقاومات المتساوية. هنا أربع مقاومات، لكن القاعدة لأي عدد."><rect x="106" y="222" width="200" height="30" rx="8" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="206" y="242" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">عددها <tspan direction="ltr" unicode-bidi="embed">N</tspan>، وكل منها <tspan direction="ltr" unicode-bidi="embed">R</tspan></text></g><g data-tip="القاعدة (ص 73): المقاومة الكلية = قيمة المقاومة الواحدة ÷ عددها."><rect x="96" y="262" width="168" height="34" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="180" y="285" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">T</tspan> = R / N</text></g><text x="180" y="52" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">مقاومات متساوية على التوازي</text></svg>`,
   cap:'عدد N من المقاومات المتساوية قيمة كل منها R.<br><b>مرّر المؤشر على البطاقتين (أو المسهما في الجوال) لتعرف معناهما.</b>',
   side:[
    {predict:{q:'لو ضاعفنا عدد المقاومات المتساوية على التوازي (من N إلى 2N)، فإن المقاومة الكلية…',opts:[
     ['تتضاعف',false,'العكس: كل مقاومة إضافية تفتح طريقاً جديداً، فتنقص المقاومة الكلية.'],
     ['تنقص إلى النصف',true,String.raw`من القاعدة \(R_T=R/N\): إذا تضاعف N في المقام صارت \(R_T\) نصف ما كانت.`],
     ['لا تتغير',false,String.raw`تتغير، لأن N في مقام القاعدة \(R_T=R/N\).`]]}}
   ],
   body:[
    {book:String.raw`<p>يمكن إيجاد المقاومة الكلية لعدد N من المقاومات المتساوية قيمة كل منها R والموصلة على التوازي كالآتي:</p>
     $$\frac{1}{R_T}=\frac{1}{R}+\frac{1}{R}+\frac{1}{R}+\cdots+\frac{1}{R}=\frac{N}{R}$$
     <p>أي أن المقاومة الكلية \(R_T\) تكون كالآتي:</p>
     $$R_T=\frac{R}{N}$$
     <p>وتكون الموصلية الكلية \(G_T\) لعدد N متساوٍ من الموصلية G في هذه الحالة:</p>
     $$G_T=N\times G$$`,ref:'ص 73'},
    {tip:String.raw`<p>القاعدة \(R_T=R/N\) ليست قانوناً جديداً؛ هي المعادلة (3-30) نفسها بعد أن صارت كل الحدود متساوية: N حداً كل منها \(1/R\) مجموعها \(N/R\)، ثم نقلب الناتج. هاتان القاعدتان غير مرقمتين في الكتاب.</p>`},
    {add:String.raw`<p>مصابيح الإنارة في غرفة واحدة موصلة عادة على التوازي، وكثيراً ما تكون متساوية القدرة. فكلما أشعلت مصباحاً إضافياً نقصت المقاومة الكلية وزاد التيار المسحوب من المصدر.</p>`}
   ]},

  {st:4,short:'مثال <span class="ltr">(3-19)</span>',title:'مثال <span class="ltr">(3-19)</span>: أربع مقاومات متساوية',ref:'ص 74',
   q:'في هذا الشكل مقاومتان مرسومتان داخل مستطيل صغير. هل يغيّر ذلك طريقة توصيلهما؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="أربع مقاومات كل منها 2 أوم، اثنتان منها مرسومتان داخل مستطيل داخلي لكنها كلها على التوازي" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><circle cx="40" cy="70" r="5.5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="40" cy="250" r="5.5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M45 70 L318 70" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M45 250 L318 250" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="السهم ⟦R_T⟧: المقاومة الكلية المطلوبة."><path d="M50 160L73 160" stroke="#3B7DD8" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M84 160L73 165.5L73 154.5Z" fill="#3B7DD8"/><text x="67" y="150" text-anchor="middle" font-size="13" fill="#3B7DD8" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">T</tspan></text><rect x="46" y="134" width="44" height="36" fill="transparent"/></g><path d="M108 70 L108 138 L101 141.7 L115 149 L101 156.3 L115 163.7 L101 171 L115 178.3 L108 182 L108 250" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="118" y="158" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">1</tspan></text><text x="118" y="176" text-anchor="start" font-size="12" fill="#2C4A40">2 Ω</text><circle cx="108" cy="70" r="4" fill="#2C4A40"/><circle cx="108" cy="250" r="4" fill="#2C4A40"/><g data-tip="المستطيل الداخلي: خطه العلوي متصل بالخط الرئيسي العلوي بسلك، وخطه السفلي متصل بالخط الرئيسي السفلي بسلك. فطرفا ⟦R2⟧ وطرفا ⟦R3⟧ على نفس النقطتين مثل ⟦R1⟧ و⟦R4⟧."><path d="M210 70 L210 115" fill="none" stroke="#E8735A" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M170 115 L260 115" fill="none" stroke="#E8735A" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M170 205 L260 205" fill="none" stroke="#E8735A" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M210 205 L210 250" fill="none" stroke="#E8735A" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/><rect x="165" y="70" width="100" height="180" fill="transparent"/></g><path d="M170 115 L170 138 L163 141.7 L177 149 L163 156.3 L177 163.7 L163 171 L177 178.3 L170 182 L170 205" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="180" y="152" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">2</tspan></text><text x="180" y="170" text-anchor="start" font-size="12" fill="#2C4A40">2 Ω</text><path d="M260 115 L260 138 L253 141.7 L267 149 L253 156.3 L267 163.7 L253 171 L267 178.3 L260 182 L260 205" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="270" y="152" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">3</tspan></text><text x="270" y="170" text-anchor="start" font-size="12" fill="#2C4A40">2 Ω</text><circle cx="210" cy="70" r="4" fill="#2C4A40"/><circle cx="210" cy="250" r="4" fill="#2C4A40"/><circle cx="210" cy="115" r="4" fill="#2C4A40"/><circle cx="210" cy="205" r="4" fill="#2C4A40"/><path d="M318 70 L318 138 L311 141.7 L325 149 L311 156.3 L325 163.7 L311 171 L325 178.3 L318 182 L318 250" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="312" y="158" text-anchor="end" font-size="13" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">4</tspan></text><text x="312" y="176" text-anchor="end" font-size="12" fill="#2C4A40">2 Ω</text><text x="180" y="42" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">الشكل <tspan direction="ltr" unicode-bidi="embed">(3-20)</tspan>: كلها على التوازي</text><text x="180" y="284" text-anchor="middle" font-size="13" fill="#2C4A40" direction="rtl">انظر إلى الطرفين، لا إلى شكل الرسم</text></svg>`,
   cap:'الشكل <span class="ltr">(3-20)</span>: أربع مقاومات كل منها <span class="ltr">2 Ω</span>، والمستطيل الداخلي ملوّن.<br><b>مرّر المؤشر على المستطيل الملوّن والسهم (أو المسهما في الجوال) لتعرف معناهما.</b>',
   side:[
    {predict:{q:String.raw`كم المقاومة الكلية \(R_T\) للمقاومات الأربع (كل منها 2 Ω)؟`,opts:[
     ['8 Ω',false,'هذا جمع المقاومات كأنها على التوالي.'],
     ['1 Ω',false,'هذا ناتج مقاومتين فقط على التوازي (2/2). المقاومات هنا أربع.'],
     ['0.5 Ω',true,String.raw`الأربع كلها على التوازي ومتساوية: \(R_T=R/N=2/4=0.5\ \Omega\).`]]}}
   ],
   body:[
    {book:String.raw`<p>للدائرة الموضحة في الشكل (3-20)، احسب المقاومة الكلية \(R_T\).</p>
     <p><b>الحل:</b> كما هو موضح في الشكل (3-20) حيث المقاومات متساوية، تحسب \(R_T\) كالآتي:</p>
     $$R_T=\frac{R}{N}=\frac{2}{4}=0.5\ \Omega$$`,ref:'ص 74'},
    {tip:String.raw`<p>لتعرف هل المقاومات على التوازي لا تنظر إلى شكل الرسم بل إلى <b>طرفي كل مقاومة</b>: تتبّع السلك من طرف المقاومة حتى تصل إلى أحد الخطين الرئيسيين دون أن تمر بأي مقاومة. إذا وصل طرفاها إلى نفس النقطتين اللتين يصل إليهما طرفا المقاومات الأخرى، فهي على التوازي معها.</p>`},
    {html:String.raw`<div class="w-row"><button class="btn pri" type="button" onclick="var b=document.querySelector('.ltabs button[data-tab=examples]');if(b)b.click()">افتح الحل خطوة بخطوة في «الأمثلة المحلولة»</button></div>`}
   ]},

  {st:5,short:'قاعدة هامة',title:'قاعدة هامة: مقاومتان، وثلاث مقاومات',ref:'ص 74',
   q:'هل توجد طريقة مختصرة لحساب مقاومتين على التوازي بدون مقلوبات؟ وهل تصلح نفس الطريقة لثلاث؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="بطاقتان: قاعدة المقاومتين (3-31) وقاعدة الثلاث مقاومات (3-32)" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="المعادلة ⟦(3-31)⟧: لمقاومتين فقط. «حاصل الضرب على المجموع»."><rect x="40" y="44" width="280" height="110" rx="14" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="180" y="70" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">مقاومتان فقط</text><text x="78" y="118" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">T</tspan> =</text><text x="205" y="106" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">1</tspan> R<tspan baseline-shift="sub" font-size="75%">2</tspan></text><path d="M145 114 L265 114" fill="none" stroke="#2C4A40" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><text x="205" y="134" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">1</tspan> + R<tspan baseline-shift="sub" font-size="75%">2</tspan></text><text x="300" y="148" text-anchor="middle" font-size="11.5" fill="#2C4A40">(3-31)</text></g><g data-tip="المعادلة ⟦(3-32)⟧: لثلاث مقاومات. في المقام مجموع حواصل الضرب مثنى مثنى."><rect x="20" y="170" width="320" height="112" rx="14" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2.5"/><text x="180" y="196" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">ثلاث مقاومات</text><text x="54" y="244" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">T</tspan> =</text><text x="205" y="232" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">1</tspan> R<tspan baseline-shift="sub" font-size="75%">2</tspan> R<tspan baseline-shift="sub" font-size="75%">3</tspan></text><path d="M105 240 L305 240" fill="none" stroke="#2C4A40" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><text x="205" y="260" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">1R_2</tspan> + R<tspan baseline-shift="sub" font-size="75%">1R_3</tspan> + R<tspan baseline-shift="sub" font-size="75%">2R_3</tspan></text><text x="318" y="276" text-anchor="middle" font-size="11.5" fill="#2C4A40">(3-32)</text></g></svg>`,
   cap:'المعادلتان <span class="ltr">(3-31)</span> و<span class="ltr">(3-32)</span> في بطاقتين.<br><b>مرّر المؤشر على كل بطاقة (أو المسها في الجوال) لتعرف متى تستعملها.</b>',
   side:[
    {predict:{q:String.raw`لثلاث مقاومات على التوازي، هل يصح أن نكتب \(R_T=\frac{R_1R_2R_3}{R_1+R_2+R_3}\)؟`,opts:[
     ['نعم، هي تعميم المعادلة (3-31)',false,String.raw`ليست كذلك. جرّب 2 و 4 و 5: تعطي \(40/11=3.6\ \Omega\) وهو أكبر من 2 Ω، وهذا مستحيل في التوازي.`],
     ['لا؛ المقام في المعادلة (3-32) هو مجموع حواصل الضرب مثنى مثنى',true,String.raw`الصحيح \(R_T=\frac{R_1R_2R_3}{R_1R_2+R_1R_3+R_2R_3}\) كما في المعادلة (3-32).`],
     ['نعم إذا كانت المقاومات متساوية',false,String.raw`حتى مع التساوي لا تصح: ثلاث مقاومات 3 Ω تعطي \(27/9=3\ \Omega\)، والصحيح \(R/N=1\ \Omega\).`]]}}
   ],
   body:[
    {book:String.raw`<p>1. إذا وصلت مقاومتين فقط على التوازي \(R_1\) و \(R_2\) فتحسب المقاومة الكلية \(R_T\) كما يلي:</p>
     $$\frac{1}{R_T}=\frac{1}{R_1}+\frac{1}{R_2}=\frac{R_1+R_2}{R_1R_2}$$
     <p>أي أن:</p>
     <div class="eq">$$R_T=\frac{R_1R_2}{R_1+R_2}$$<span class="eqno">(3-31)</span></div>
     <p>2. إذا وصلت ثلاث مقاومات \(R_1\) و \(R_2\) و \(R_3\) على التوازي فتحسب المقاومة الكلية \(R_T\) كذلك كما يلي:</p>
     <div class="eq">$$R_T=\frac{R_1R_2R_3}{R_1R_2+R_1R_3+R_2R_3}$$<span class="eqno">(3-32)</span></div>`,ref:'ص 74'},
    {tip:String.raw`<p>تُحفظ المعادلة (3-31) بعبارة <b>«حاصل الضرب على المجموع»</b>، وهي لمقاومتين فقط. ولأكثر من مقاومتين تستطيع أن تطبقها مرتين: اجمع اثنتين أولاً، ثم اجمع الناتج مع الثالثة بنفس القاعدة.</p>`,title:'كيف تحفظها؟'},
    {watch:String.raw`<p>في المعادلة (3-31) البسط <b>ضرب</b> والمقام <b>جمع</b>. من يعكسهما يحصل على رقم غير معقول؛ تحقق دائماً: الناتج يجب أن يكون أصغر من أصغر المقاومتين.</p>`}
   ]},

  {st:6,short:'مثال <span class="ltr">(3-20)</span>',title:'مثال <span class="ltr">(3-20)</span>: المقاومة الكلية وتيارا الفرعين',ref:'ص 75',
   q:'تيار 12 A يدخل مقاومتين 2 Ω و 4 Ω على التوازي. أي المقاومتين يمر فيها التيار الأكبر؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="تيار 12 أمبير يدخل مقاومتين على التوازي 2 و 4 أوم ثم يخرج" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><path d="M30 160 L100 160" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M100 110 L100 210" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M260 110 L260 210" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M260 160 L330 160" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M100 110 L140 110" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M140 110 L158 110 L161.7 117 L169 103 L176.3 117 L183.7 103 L191 117 L198.3 103 L202 110 L220 110" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M220 110 L260 110" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M100 210 L140 210" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M140 210 L158 210 L161.7 217 L169 203 L176.3 217 L183.7 203 L191 217 L198.3 203 L202 210 L220 210" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M220 210 L260 210" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="100" cy="160" r="4" fill="#2C4A40"/><circle cx="260" cy="160" r="4" fill="#2C4A40"/><text x="180" y="94" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">1</tspan> = 2 Ω</text><text x="180" y="238" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">2</tspan> = 4 Ω</text><g data-tip="التيار الكلي الداخل ⟦I = 12 A⟧ (معطى في الكتاب)."><path d="M50 160L63 160" stroke="#E8735A" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M74 160L63 165.5L63 154.5Z" fill="#E8735A"/><text x="62" y="146" text-anchor="middle" font-size="13" fill="#E8735A" font-weight="700">I = 12 A</text><rect x="30" y="128" width="70" height="44" fill="transparent"/></g><g data-tip="⟦I1⟧: تيار الفرع العلوي ⟦R1 = 2 Ω⟧."><path d="M111 110L118 110" stroke="#E8735A" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M129 110L118 115.5L118 104.5Z" fill="#E8735A"/><text x="120" y="98" text-anchor="middle" font-size="12.5" fill="#E8735A" font-weight="700">I<tspan baseline-shift="sub" font-size="75%">1</tspan></text><rect x="104" y="82" width="34" height="36" fill="transparent"/></g><g data-tip="⟦I2⟧: تيار الفرع السفلي ⟦R2 = 4 Ω⟧."><path d="M111 210L118 210" stroke="#E8735A" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M129 210L118 215.5L118 204.5Z" fill="#E8735A"/><text x="120" y="234" text-anchor="middle" font-size="12.5" fill="#E8735A" font-weight="700">I<tspan baseline-shift="sub" font-size="75%">2</tspan></text><rect x="104" y="202" width="34" height="38" fill="transparent"/></g><g data-tip="السهم الخارج مكتوب في الشكل ⟦I3⟧، وهو التيار الكلي الخارج: يساوي التيار الداخل ⟦12 A⟧."><path d="M286 160L299 160" stroke="#E8735A" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M310 160L299 165.5L299 154.5Z" fill="#E8735A"/><text x="298" y="146" text-anchor="middle" font-size="13" fill="#E8735A" font-weight="700">I<tspan baseline-shift="sub" font-size="75%">3</tspan></text><rect x="262" y="128" width="70" height="44" fill="transparent"/></g><text x="180" y="56" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">الشكل <tspan direction="ltr" unicode-bidi="embed">(3-21)</tspan></text><text x="180" y="284" text-anchor="middle" font-size="13" fill="#2C4A40" direction="rtl">جهد المقاومتين واحد</text></svg>`,
   cap:'الشكل <span class="ltr">(3-21)</span>: التيار الداخل يتفرع إلى فرعين ثم يلتقيان.<br><b>مرّر المؤشر على أسهم التيار (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'أي الفرعين يأخذ التيار الأكبر؟',opts:[
     ['الفرع الذي فيه 4 Ω',false,'المقاومة الأكبر تعيق التيار أكثر، فيمر فيها تيار أقل.'],
     ['الفرع الذي فيه 2 Ω',true,String.raw`جهد الفرعين واحد، فالتيار \(I=V/R\) أكبر في المقاومة الأصغر: نحو 8 A في 2 Ω مقابل نحو 4 A في 4 Ω.`],
     ['يتساويان: 6 A لكل فرع',false,'يتساوى التيار فقط إذا تساوت المقاومتان.']]}}
   ],
   body:[
    {book:String.raw`<p>احسب المقاومة الكلية \(R_T\)، وكذلك قيمة التيارين \(I_1\) و \(I_2\) للدائرة المبينة في الشكل (3-21) باستخدام المعادلة (3-31).</p>
     <p><b>الحل:</b> باستخدام المعادلة (3-31) يمكننا حساب \(R_T\) كما يلي:</p>
     $$R_T=\frac{R_1R_2}{R_1+R_2}=\frac{(2)\times(4)}{2+4}=1.3333\ \Omega$$
     <p>الجهد على طرفي المقاومتين التوازي \(=I\times R_T=12\times1.3333=15.9996\ \text{V}\)</p>
     $$I_1=\frac{15.9996}{2}=7.9998\ \text{A}\qquad I_2=\frac{15.9996}{4}=3.9999\ \text{A}$$`,ref:'ص 75'},
    {tip:String.raw`<p>الأرقام 15.9996 و 7.9998 و 3.9999 سببها تقريب \(R_T\) إلى 1.3333. القيمة الدقيقة \(R_T=8/6=4/3\ \Omega\)، فيكون الجهد <span class="ltr">16 V</span> تماماً، و\(I_1=8\ \text{A}\) و\(I_2=4\ \text{A}\). ستجد نفس الدائرة في مثال (3-26) محلولة بقاعدة توزيع التيار.</p>`},
    {tip:String.raw`<p>السهم الخارج المسمى \(I_3\) في الشكل هو التيار الكلي الخارج من المقاومتين، ويساوي التيار الداخل <span class="ltr">12 A</span>: ما يدخل المجموعة يخرج منها.</p>`},
    {html:String.raw`<div class="w-row"><button class="btn pri" type="button" onclick="var b=document.querySelector('.ltabs button[data-tab=examples]');if(b)b.click()">افتح الحل خطوة بخطوة في «الأمثلة المحلولة»</button></div>`}
   ]},

  {st:7,short:'مثال <span class="ltr">(3-21)</span>',title:'مثال <span class="ltr">(3-21)</span>: نفس مثال <span class="ltr">(3-18)</span> بالمعادلة <span class="ltr">(3-32)</span>',ref:'ص 75–76',
   q:'المقاومات في هذا الرسم مائلة على شكل مروحة. هل ما زالت على التوازي؟ وهل يتغير الناتج إذا استعملنا معادلة أخرى؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ثلاث مقاومات تخرج من نقطة واحدة على شكل مروحة وتنتهي على خط سفلي واحد" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><circle cx="40" cy="82" r="5.5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="40" cy="240" r="5.5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M45 82 L180 82" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M45 240 L300 240" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="السهم ⟦RT⟧: المقاومة الكلية."><path d="M50 160L73 160" stroke="#3B7DD8" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M84 160L73 165.5L73 154.5Z" fill="#3B7DD8"/><text x="67" y="150" text-anchor="middle" font-size="13" fill="#3B7DD8" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">T</tspan></text><rect x="46" y="134" width="44" height="36" fill="transparent"/></g><g data-tip="النقطة العليا: الأطراف العليا للمقاومات الثلاث كلها هنا."><circle cx="180" cy="82" r="6" fill="#E8735A"/><rect x="166" y="68" width="28" height="28" fill="transparent"/></g><path d="M180 82 L149.9 141.4 L142 141.5 L151.2 154.3 L135.4 154.6 L144.6 167.4 L128.8 167.7 L138 180.5 L130.1 180.6 L100 240" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="100" cy="240" r="4" fill="#2C4A40"/><text x="112" y="168" text-anchor="end" font-size="13" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">1</tspan>=2Ω</text><path d="M180 82 L180 139 L173 142.7 L187 150 L173 157.3 L187 164.7 L173 172 L187 179.3 L180 183 L180 240" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="180" cy="240" r="4" fill="#2C4A40"/><text x="190" y="172" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">2</tspan>=4Ω</text><path d="M180 82 L214.1 141.9 L209.8 148.5 L225.6 148 L217.1 161.3 L232.9 160.7 L224.4 174 L240.2 173.5 L235.9 180.1 L270 240" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="270" cy="240" r="4" fill="#2C4A40"/><text x="238" y="150" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">3</tspan>=5Ω</text><g data-tip="الخط السفلي: الأطراف السفلى الثلاثة متصلة به. نقطتان مشتركتان ⟵ الثلاث على التوازي."><path d="M100 240 L270 240" fill="none" stroke="#4FB3A9" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><rect x="95" y="232" width="180" height="16" fill="transparent"/></g><text x="180" y="48" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">الشكل <tspan direction="ltr" unicode-bidi="embed">(3-22)</tspan>: مروحة… لكنها توازي</text><text x="180" y="280" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">T</tspan> = 40/38 = 1.053 Ω</text></svg>`,
   cap:'الشكل <span class="ltr">(3-22)</span>: المقاومات الثلاث تخرج من نقطة واحدة وتنتهي على خط واحد.<br><b>مرّر المؤشر على النقطة العليا والخط السفلي والسهم (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'ما المقام في المعادلة (3-32) لهذه المقاومات (2 و 4 و 5 Ω)؟',opts:[
     [String.raw`\(2+4+5=11\)`,false,'هذا مجموع المقاومات، وليس المقام في (3-32).'],
     [String.raw`\((2)(4)(5)=40\)`,false,'هذا هو البسط.'],
     [String.raw`\((2)(4)+(2)(5)+(4)(5)=38\)`,true,'المقام مجموع حواصل الضرب مثنى مثنى: 8 + 10 + 20 = 38.']]}}
   ],
   body:[
    {book:String.raw`<p>أعد حل مثال (3-18) باستخدام المعادلة (3-32).</p>
     <p><b>الحل:</b> باستخدام المعادلة (3-32) يمكننا حساب \(R_T\) كما هو موضح في الشكل (3-22) كالآتي:</p>
     $$R_T=\frac{R_1\times R_2\times R_3}{R_1\times R_2+R_1\times R_3+R_2\times R_3}=\frac{(2)\times(4)\times(5)}{(2)\times(4)+(2)\times(5)+(4)\times(5)}=\frac{40}{38}=1.053\ \Omega$$`,ref:'ص 75–76'},
    {tip:String.raw`<p>نفس الناتج <span class="ltr">1.053 Ω</span> الذي حصلنا عليه في مثال (3-18) بجمع المقلوبات. اختر الطريقة الأسهل لك؛ النتيجة واحدة.</p>`},
    {tip:String.raw`<p>شكل الرسم (مروحة أو خطوط مستقيمة) لا يغيّر شيئاً: الأطراف العليا الثلاثة في نقطة واحدة، والأطراف السفلى الثلاثة على خط واحد. فهي على التوازي، كما في الرسم الأيمن من الشكل (3-22) المرسوم بالطريقة المعتادة.</p>`}
   ]},

  {st:8,short:'مثال <span class="ltr">(3-22)</span>',title:'مثال <span class="ltr">(3-22)</span>: مقاومات مجهولة من المقاومة الكلية',ref:'ص 76–77',
   q:'لا نعرف أي مقاومة، لكن نعرف المقاومة الكلية والعلاقة بين المقاومات. كيف نحوّل ثلاثة مجاهيل إلى مجهول واحد؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ثلاث مقاومات مجهولة على التوازي والمقاومة الكلية 16 كيلو أوم" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><circle cx="48" cy="80" r="5.5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="48" cy="232" r="5.5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M53 80 L290 80" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M53 232 L290 232" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="المقاومة الكلية معطاة: ⟦RT = 16 kΩ⟧ (كيلو أوم)."><path d="M58 156L81 156" stroke="#3B7DD8" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M92 156L81 161.5L81 150.5Z" fill="#3B7DD8"/><text x="75" y="146" text-anchor="middle" font-size="13" fill="#3B7DD8" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">T</tspan></text><text x="75" y="178" text-anchor="middle" font-size="12" fill="#3B7DD8" font-weight="700">16 kΩ</text><rect x="52" y="130" width="46" height="56" fill="transparent"/></g><g data-tip="⟦R1⟧: المجهول الأساسي، والباقيتان مضاعفاته."><path d="M150 80 L150 134 L143 137.7 L157 145 L143 152.3 L157 159.7 L143 167 L157 174.3 L150 178 L150 232" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="162" y="150" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">1</tspan></text><rect x="138" y="100" width="58" height="112" fill="transparent"/></g><circle cx="150" cy="80" r="4" fill="#2C4A40"/><circle cx="150" cy="232" r="4" fill="#2C4A40"/><g data-tip="⟦R2 = 2R1⟧: ضعف ⟦R1⟧."><path d="M220 80 L220 134 L213 137.7 L227 145 L213 152.3 L227 159.7 L213 167 L227 174.3 L220 178 L220 232" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="232" y="150" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">2</tspan></text><text x="232" y="168" text-anchor="start" font-size="11.5" fill="#2C4A40">= 2R<tspan baseline-shift="sub" font-size="75%">1</tspan></text><rect x="208" y="100" width="58" height="112" fill="transparent"/></g><circle cx="220" cy="80" r="4" fill="#2C4A40"/><circle cx="220" cy="232" r="4" fill="#2C4A40"/><g data-tip="⟦R3 = 2R2 = 4R1⟧: ضعف ⟦R2⟧، أي أربعة أمثال ⟦R1⟧."><path d="M290 80 L290 134 L283 137.7 L297 145 L283 152.3 L297 159.7 L283 167 L297 174.3 L290 178 L290 232" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="302" y="150" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">3</tspan></text><text x="302" y="168" text-anchor="start" font-size="11.5" fill="#2C4A40">= 2R<tspan baseline-shift="sub" font-size="75%">2</tspan></text><rect x="278" y="100" width="58" height="112" fill="transparent"/></g><text x="180" y="52" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">الشكل <tspan direction="ltr" unicode-bidi="embed">(3-23)</tspan>: ثلاث مجهولات وعلاقتان</text><text x="180" y="274" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700">1/16 = 1.75 (1/R<tspan baseline-shift="sub" font-size="75%">1</tspan>)</text></svg>`,
   cap:'الشكل <span class="ltr">(3-23)</span>: المقاومة الكلية <span class="ltr">16 kΩ</span>، وكل مقاومة ضعف التي قبلها.<br><b>مرّر المؤشر على المقاومات والسهم (أو المسها في الجوال) لتعرف العلاقة بينها.</b>',
   side:[
    {predict:{q:String.raw`إذا كان \(R_2=2R_1\) و \(R_3=2R_2\)، فإن \(R_3\) بدلالة \(R_1\) تساوي…`,opts:[
     [String.raw`\(2R_1\)`,false,String.raw`هذه \(R_2\). و\(R_3\) ضعف \(R_2\).`],
     [String.raw`\(4R_1\)`,true,String.raw`\(R_3=2R_2=2(2R_1)=4R_1\) كما في حل الكتاب.`],
     [String.raw`\(3R_1\)`,false,String.raw`المضاعفات تُضرب ولا تُجمع: \(2\times2=4\).`]]}}
   ],
   body:[
    {book:String.raw`<p>احسب المقاومات \(R_1\) و \(R_2\) و \(R_3\) للدائرة المبينة في الشكل (3-23) وذلك إذا كان \(R_2=2R_1\) و \(R_3=2R_2\) وكانت المقاومة الكلية \(R_T=16\,k\Omega\).</p>
     <p><b>الحل:</b> كما هو موضح في الشكل (3-23) يمكننا أن نحصل على:</p>
     $$\frac{1}{R_T}=\frac{1}{R_1}+\frac{1}{R_2}+\frac{1}{R_3}$$
     <p>وحيث إن \(R_2=2R_1\) و \(R_3=2R_2=2(2R_1)=4R_1\) وبالتعويض في الصورة السابقة عن \(R_2\) و \(R_3\) وكذلك عن قيمة \(R_T\) نحصل على:</p>
     $$\frac{1}{16}=\left(\frac{1}{R_1}\right)+\left(\frac{1}{2R_1}\right)+\left(\frac{1}{4R_1}\right)=1.75\left(\frac{1}{R_1}\right)$$
     <p>ومنها نحصل على المقاومة \(R_1\)، أي أن</p>
     $$R_1=1.75\times16=28\ \Omega$$
     <p>وبالتالي نحصل على المقاومات \(R_2\) و \(R_3\) كما يلي:</p>
     $$R_2=2R_1=2\times28=56\ \Omega\qquad R_3=4R_1=4\times28=112\ \Omega$$`,ref:'ص 76–77'},
    {watch:String.raw`<p>طُبعت النتائج في الكتاب «28 Ω و 56 Ω و 112 Ω»، والصحيح <b>28 kΩ و 56 kΩ و 112 kΩ</b> لأن المعطى \(R_T=16\,k\Omega\) (الأرقام نفسها صحيحة). في تبويب «الأمثلة المحلولة» حلان: كما في الكتاب، والمصحح.</p>`,fix:true},
    {tip:String.raw`<p>من أين جاء الرقم 1.75؟ \(\frac{1}{R_1}+\frac{1}{2R_1}+\frac{1}{4R_1}=\frac{1}{R_1}(1+0.5+0.25)=1.75\cdot\frac{1}{R_1}\). ثم \(\frac{1}{16}=\frac{1.75}{R_1}\) ومنها \(R_1=1.75\times16\).</p>
     <p>تحقق: \(\frac{1}{28}+\frac{1}{56}+\frac{1}{112}=\frac{4+2+1}{112}=\frac{7}{112}=\frac{1}{16}\) ✓</p>`},
    {html:String.raw`<div class="w-row"><button class="btn pri" type="button" onclick="var b=document.querySelector('.ltabs button[data-tab=examples]');if(b)b.click()">افتح الحل خطوة بخطوة في «الأمثلة المحلولة»</button></div>`}
   ]},

  {st:9,short:'مثال <span class="ltr">(3-23)</span>',title:'مثال <span class="ltr">(3-23)</span>: التيارات والقدرة في دائرة التوازي',ref:'ص 77',
   q:'بطارية تغذي مقاومتين على التوازي: من أين نعرف جهد كل مقاومة؟ وهل مجموع قدرتي المقاومتين يساوي قدرة البطارية؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="بطارية 27 فولت تغذي مقاومتين على التوازي 9 و 18 أوم" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><path d="M62 80 L62 151" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M62 161 L62 232" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M46 151H78" stroke="#2C4A40" stroke-width="3"/><path d="M53 161H71" stroke="#2C4A40" stroke-width="6"/><text x="86" y="147" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">+</text><text x="40" y="162" text-anchor="end" font-size="14" fill="#2C4A40" font-weight="700">E</text><text x="40" y="180" text-anchor="end" font-size="12" fill="#2C4A40">27V</text><path d="M62 80 L300 80" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M62 232 L300 232" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="⟦IS⟧: تيار المنبع (البطارية)، وهو مجموع تياري الفرعين."><path d="M93 80L106 80" stroke="#E8735A" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M117 80L106 85.5L106 74.5Z" fill="#E8735A"/><text x="105" y="68" text-anchor="middle" font-size="13" fill="#E8735A" font-weight="700">I<tspan baseline-shift="sub" font-size="75%">S</tspan></text><rect x="88" y="50" width="36" height="40" fill="transparent"/></g><path d="M180 80 L180 134 L173 137.7 L187 145 L173 152.3 L187 159.7 L173 167 L187 174.3 L180 178 L180 232" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="192" y="150" text-anchor="start" font-size="12.5" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">1</tspan> = 9Ω</text><g data-tip="⟦I1⟧: تيار الفرع ⟦R1⟧ = ⟦E / R1⟧ لأن جهد الفرع يساوي جهد البطارية."><path d="M180 97L180 104" stroke="#E8735A" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M180 115L174.5 104L185.5 104Z" fill="#E8735A"/><text x="172" y="112" text-anchor="end" font-size="12" fill="#E8735A" font-weight="700">I<tspan baseline-shift="sub" font-size="75%">1</tspan></text><rect x="150" y="92" width="36" height="30" fill="transparent"/></g><g data-tip="⟦V1⟧: جهد ⟦R1⟧ (+ أعلى، − أسفل). في التوازي ⟦V1 = E⟧."><text x="166" y="170" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">+</text><text x="166" y="206" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700">−</text><text x="166" y="190" text-anchor="end" font-size="12" fill="#4FB3A9" font-weight="700">V<tspan baseline-shift="sub" font-size="75%">1</tspan></text><rect x="140" y="156" width="34" height="56" fill="transparent"/></g><circle cx="180" cy="80" r="4" fill="#2C4A40"/><circle cx="180" cy="232" r="4" fill="#2C4A40"/><path d="M290 80 L290 134 L283 137.7 L297 145 L283 152.3 L297 159.7 L283 167 L297 174.3 L290 178 L290 232" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="302" y="150" text-anchor="start" font-size="12.5" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">2</tspan> = 18Ω</text><g data-tip="⟦I2⟧: تيار الفرع ⟦R2⟧ = ⟦E / R2⟧ لأن جهد الفرع يساوي جهد البطارية."><path d="M290 97L290 104" stroke="#E8735A" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M290 115L284.5 104L295.5 104Z" fill="#E8735A"/><text x="282" y="112" text-anchor="end" font-size="12" fill="#E8735A" font-weight="700">I<tspan baseline-shift="sub" font-size="75%">2</tspan></text><rect x="260" y="92" width="36" height="30" fill="transparent"/></g><g data-tip="⟦V2⟧: جهد ⟦R2⟧ (+ أعلى، − أسفل). في التوازي ⟦V2 = E⟧."><text x="276" y="170" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">+</text><text x="276" y="206" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700">−</text><text x="276" y="190" text-anchor="end" font-size="12" fill="#4FB3A9" font-weight="700">V<tspan baseline-shift="sub" font-size="75%">2</tspan></text><rect x="250" y="156" width="34" height="56" fill="transparent"/></g><text x="180" y="50" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">الشكل <tspan direction="ltr" unicode-bidi="embed">(3-24)</tspan></text><text x="180" y="272" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700">P<tspan baseline-shift="sub" font-size="75%">S</tspan> = P<tspan baseline-shift="sub" font-size="75%">1</tspan> + P<tspan baseline-shift="sub" font-size="75%">2</tspan></text></svg>`,
   cap:'الشكل <span class="ltr">(3-24)</span>: بطارية <span class="ltr">27 V</span> ومقاومتان على التوازي.<br><b>مرّر المؤشر على أسهم التيار وعلامات الجهد (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:String.raw`كم التيار \(I_1\) في المقاومة 9 Ω؟`,opts:[
     ['4.5 A',false,String.raw`هذا التيار الكلي \(I_S=27/6\)، وهو يتوزع على الفرعين.`],
     ['1.5 A',false,String.raw`هذا تيار \(I_2=27/18\) في المقاومة 18 Ω.`],
     ['3 A',true,String.raw`جهد كل فرع يساوي جهد البطارية: \(I_1=E/R_1=27/9=3\ \text{A}\).`]]}}
   ],
   body:[
    {book:String.raw`<p>من دائرة التوازي الموضحة في الشكل (3-24) احسب:</p>
     <p>(أ) المقاومة الكلية \(R_T\) والتيار الكلي \(I_S\) وكذلك التيارات \(I_1\) و \(I_2\).<br>(ب) القدرة المفقودة في كل مقاومة، وكذلك قدرة المنبع (البطارية).</p>
     <p><b>الحل:</b> (أ) المقاومة الكلية \(R_T\) والتيارات \(I_S\) و \(I_1\) و \(I_2\) يمكن حسابها كما يلي:</p>
     $$R_T=\frac{R_1\times R_2}{R_1+R_2}=\frac{9\times18}{9+18}=\frac{162}{27}=6\ \Omega\qquad I_S=\frac{E}{R_T}=\frac{27}{6}=4.5\ \text{A}$$
     $$I_1=\frac{V_1}{R_1}=\frac{E}{R_1}=\frac{27}{9}=3\ \text{A}\qquad I_2=\frac{V_2}{R_2}=\frac{E}{R_2}=\frac{27}{18}=1.5\ \text{A}$$
     <p>للتأكد من صحة الحل، \(I_S=I_1+I_2=3+1.5=4.5\ \text{A}\)</p>
     <p>(ب) نوجد القدرة المفقودة في كل مقاومة، وقدرة المنبع (البطارية) كالآتي:</p>
     $$P_1=V_1\times I_1=E\times I_1=(27)\times(3)=81\ \text{W}\qquad P_2=V_2\times I_2=E\times I_2=(27)\times(1.5)=40.5\ \text{W}$$
     $$P_S=E\times I_S=(27)\times(4.5)=121.5\ \text{W}$$
     <p>نلاحظ هنا أن القدرة \(P_S=P_1+P_2\)، أي أن \(121.5=81+40.5\ \text{W}\)</p>`,ref:'ص 77'},
    {tip:String.raw`<p>المفتاح في هذا المثال: <b>في التوازي جهد كل فرع = جهد البطارية</b> \((V_1=V_2=E)\). لذلك نحسب تيار كل فرع مباشرة من \(E/R\) دون أن نحتاج إلى \(R_T\). أما \(R_T\) فنحتاجها لتيار المنبع \(I_S\).</p>
     <p>و«للتأكد من صحة الحل» نجمع تياري الفرعين فيجب أن يساويا \(I_S\)؛ وبالمثل مجموع القدرتين يساوي قدرة المنبع.</p>`},
    {add:String.raw`<p>هذا هو سبب توصيل الأجهزة في البيت على التوازي: كل جهاز يأخذ جهد المصدر كاملاً، ويعمل أو يُفصل دون أن يتأثر غيره. وكلما زاد عدد الأجهزة العاملة زاد التيار الكلي المسحوب.</p>`},
    {html:String.raw`<div class="w-row"><button class="btn pri" type="button" onclick="var b=document.querySelector('.ltabs button[data-tab=examples]');if(b)b.click()">افتح الحل خطوة بخطوة في «الأمثلة المحلولة»</button></div>`}
   ]},

  {st:10,short:'مثال <span class="ltr">(3-24)</span>',title:'مثال <span class="ltr">(3-24)</span>: مقاومة مجهولة وجهد البطارية',ref:'ص 78',
   q:'نعرف المقاومة الكلية ومقاومتين وتيار إحداهما. هل يكفي ذلك لمعرفة المقاومة الثالثة وجهد البطارية؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="بطارية وثلاث مقاومات كل منها إلى رمز أرضي منفصل، فهي على التوازي" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><path d="M62 80 L62 135" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M62 145 L62 200" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M46 135H78" stroke="#2C4A40" stroke-width="3"/><path d="M53 145H71" stroke="#2C4A40" stroke-width="6"/><text x="86" y="131" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">+</text><path d="M62 200V209M50 209H74M55 214H69M59 219H65" stroke="#2C4A40" stroke-width="2.2" fill="none"/><text x="40" y="146" text-anchor="end" font-size="14" fill="#2C4A40" font-weight="700">E</text><g data-tip="⟦IS⟧: تيار المنبع."><path d="M62 104L62 99" stroke="#E8735A" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M62 88L67.5 99L56.5 99Z" fill="#E8735A"/><text x="74" y="100" text-anchor="start" font-size="12" fill="#E8735A" font-weight="700">I<tspan baseline-shift="sub" font-size="75%">S</tspan></text><rect x="56" y="84" width="34" height="30" fill="transparent"/></g><path d="M62 80 L310 80" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="المقاومة الكلية للدائرة معطاة ⟦RT = 4 Ω⟧."><text x="118" y="66" text-anchor="middle" font-size="12.5" fill="#3B7DD8" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">T</tspan> = 4 Ω</text><rect x="84" y="52" width="70" height="20" fill="transparent"/></g><circle cx="160" cy="80" r="4" fill="#2C4A40"/><path d="M160 80 L160 116 L153 119.7 L167 127 L153 134.3 L167 141.7 L153 149 L167 156.3 L160 160 L160 196" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="170" y="150" text-anchor="start" font-size="12.5" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">1</tspan></text><text x="170" y="166" text-anchor="start" font-size="11.5" fill="#2C4A40">10 Ω</text><g data-tip="رمز الأرضي: كل الأطراف المتصلة بهذا الرمز متصلة ببعضها (نقطة مرجعية واحدة)، فكأن بينها سلكاً."><path d="M160 196V205M148 205H172M153 210H167M157 215H163" stroke="#2C4A40" stroke-width="2.2" fill="none"/><rect x="146" y="194" width="28" height="24" fill="transparent"/></g><path d="M160 100L160 105" stroke="#E8735A" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M160 116L154.5 105L165.5 105Z" fill="#E8735A"/><text x="152" y="114" text-anchor="end" font-size="11" fill="#E8735A" font-weight="700">I<tspan baseline-shift="sub" font-size="75%">1</tspan> = 4 A</text><circle cx="235" cy="80" r="4" fill="#2C4A40"/><path d="M235 80 L235 116 L228 119.7 L242 127 L228 134.3 L242 141.7 L228 149 L242 156.3 L235 160 L235 196" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="245" y="150" text-anchor="start" font-size="12.5" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">2</tspan></text><text x="245" y="166" text-anchor="start" font-size="11.5" fill="#2C4A40">20 Ω</text><g data-tip="رمز الأرضي: كل الأطراف المتصلة بهذا الرمز متصلة ببعضها (نقطة مرجعية واحدة)، فكأن بينها سلكاً."><path d="M235 196V205M223 205H247M228 210H242M232 215H238" stroke="#2C4A40" stroke-width="2.2" fill="none"/><rect x="221" y="194" width="28" height="24" fill="transparent"/></g><path d="M235 100L235 105" stroke="#E8735A" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M235 116L229.5 105L240.5 105Z" fill="#E8735A"/><text x="227" y="114" text-anchor="end" font-size="11" fill="#E8735A" font-weight="700">I<tspan baseline-shift="sub" font-size="75%">2</tspan></text><circle cx="310" cy="80" r="4" fill="#2C4A40"/><path d="M310 80 L310 116 L303 119.7 L317 127 L303 134.3 L317 141.7 L303 149 L317 156.3 L310 160 L310 196" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="320" y="150" text-anchor="start" font-size="12.5" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">3</tspan></text><text x="320" y="166" text-anchor="start" font-size="11.5" fill="#2C4A40">?</text><g data-tip="رمز الأرضي: كل الأطراف المتصلة بهذا الرمز متصلة ببعضها (نقطة مرجعية واحدة)، فكأن بينها سلكاً."><path d="M310 196V205M298 205H322M303 210H317M307 215H313" stroke="#2C4A40" stroke-width="2.2" fill="none"/><rect x="296" y="194" width="28" height="24" fill="transparent"/></g><text x="180" y="46" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">الشكل <tspan direction="ltr" unicode-bidi="embed">(3-25)</tspan></text><text x="186" y="258" text-anchor="middle" font-size="12.5" fill="#2C4A40" direction="rtl">أرضي منفصل لكل مقاومة… ولكنه نقطة واحدة</text></svg>`,
   cap:'الشكل <span class="ltr">(3-25)</span>: كل مقاومة تنتهي برمز أرضي.<br><b>مرّر المؤشر على رموز الأرضي والأسهم (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'كيف نعرف جهد البطارية E في هذا المثال؟',opts:[
     [String.raw`من \(E=I_1R_1=4\times10\)`,true,String.raw`المقاومات على التوازي مع البطارية، فجهد \(R_1\) هو جهد البطارية: \(E=V_1=I_1R_1=40\ \text{V}\).`],
     [String.raw`من \(E=I_1R_T=4\times4\)`,false,String.raw`\(I_1\) تيار فرع واحد فقط، و\(R_T\) للدائرة كلها؛ لا يجتمعان في قانون أوم.`],
     [String.raw`لا يمكن معرفته بدون قيمة \(R_3\)`,false,String.raw`يمكن: جهد \(R_1\) معلوم من تيارها ومقاومتها، وهو نفسه جهد البطارية.`]]}}
   ],
   body:[
    {book:String.raw`<p>للدائرة الموضحة في الشكل (3-25) إذا كانت المقاومة الكلية للدائرة تساوي 4Ω، احسب: (أ) المقاومة \(R_3\) وجهد البطارية E وكذلك تيار المنبع \(I_S\). (ب) التيار \(I_2\) والقدرة المفقودة في المقاومة \(R_2\) أي \(P_2\).</p>
     <p><b>الحل:</b> (أ) يمكن حساب المقاومة \(R_3\) وجهد البطارية E وكذلك تيار المنبع \(I_S\) كما يلي:</p>
     $$\frac{1}{R_T}=\frac{1}{R_1}+\frac{1}{R_2}+\frac{1}{R_3}\qquad\frac{1}{4}=\frac{1}{10}+\frac{1}{20}+\frac{1}{R_3}$$
     $$0.25=0.1+0.05+\frac{1}{R_3}=0.15+\frac{1}{R_3}\qquad\frac{1}{R_3}=0.1,\ R_3=10\ \Omega$$
     $$E=V_1=I_1R_1=(4\times10)=40\ \text{V}\qquad I_S=\frac{E}{R_T}=\frac{40}{4}=10\ \text{A}$$
     <p>(ب) يمكننا حساب التيار \(I_2\) والقدرة المفقودة في المقاومة \(R_2\) أي \(P_2\) كما يلي:</p>
     $$I_2=\frac{V_2}{R_2}=\frac{E}{R_2}=\frac{40}{20}=2\ \text{A}\qquad P_2=I_2^2\times R_2=(2)^2\times(20)=80\ \text{W}$$`,ref:'ص 78'},
    {watch:String.raw`<p>في الكتاب: الجزء الثاني مرقم «(ت)» والصحيح «(ب)»؛ وكُتب \(I_T\) بدل \(I_S\) المطلوب (نفس الكمية)؛ وفي سطر \(I_2\) طُبع الحد الأوسط \(E/R_T\) والصحيح \(E/R_2\) (الناتج \(40/20=2\ \text{A}\) صحيح). عرضناها هنا مصححة.</p>`,fix:true},
    {tip:String.raw`<p>رمز الأرضي يعني أن كل الأطراف المتصلة به متصلة ببعضها (نقطة مرجعية واحدة)، فلا داعي لرسم السلك السفلي. لذلك المقاومات الثلاث هنا على التوازي مع البطارية تماماً كما في الشكل (3-24).</p>`},
    {html:String.raw`<div class="w-row"><button class="btn pri" type="button" onclick="var b=document.querySelector('.ltabs button[data-tab=examples]');if(b)b.click()">افتح الحل خطوة بخطوة في «الأمثلة المحلولة»</button></div>`}
   ]},

  {recap:[
   String.raw`في التوازي يكون فرق الجهد عبر كل مقاومة متساوياً، والموصلية الكلية \(G_T=G_1+G_2+\cdots+G_N\) (3-29)، ومقلوب المقاومة الكلية \(\frac{1}{R_T}=\frac{1}{R_1}+\cdots+\frac{1}{R_N}\) (3-30) (ص 72).`,
   String.raw`المقاومة الكلية في التوازي أصغر دائماً من أصغر مقاومة فيه؛ ولعدد N من المقاومات المتساوية \(R_T=R/N\) و \(G_T=N\times G\) (ص 73، بلا رقم في الكتاب).`,
   String.raw`لمقاومتين: \(R_T=\frac{R_1R_2}{R_1+R_2}\) (3-31)، ولثلاث: \(R_T=\frac{R_1R_2R_3}{R_1R_2+R_1R_3+R_2R_3}\) (3-32) (ص 74).`,
   String.raw`تيار كل فرع = جهد المصدر ÷ مقاومة الفرع، ومجموع تيارات الفروع = تيار المنبع، ومجموع قدرات المقاومات = قدرة المنبع (ص 77–78).`]}
],
 theory:[
  {h:'توصيل المقاومات على التوازي',ref:'ص 72',html:`<p>«سيتم شرح كيفية توصيل المقاومات على التوازي وكذلك قانون كيرشوف للتيار بالإضافة إلى قاعدة توزيع التيار، وكذلك الدوائر المفتوحة ودوائر القصر. وسيتم توضيح ذلك بأمثلة متنوعة.»</p>
   <p>«إذا تم توصيل عدد من المقاومات بشكل يكون فيه <b>فرق الجهد عبر أي مقاومة منها متساوٍ</b>، فإن هذا التوصيل يسمى بالتوصيل على التوازي.» «لأي عدد من الموصلية G موصلة على التوازي، يمكننا أن نحصل على الموصلية الكلية \\(G_T\\) كالآتي:»</p>
   $$G_T=G_1+G_2+G_3+\\cdots+G_N \\qquad (3\\text{-}29)$$
   <p>«حيث إن G هي مقلوب المقاومة R، \\((R=1/G)\\)، وبالتالي فإن:»</p>
   $$\\frac{1}{R_T}=\\frac{1}{R_1}+\\frac{1}{R_2}+\\frac{1}{R_3}+\\cdots+\\frac{1}{R_N} \\qquad (3\\text{-}30)$$
   <p>«حيث \\(R_T\\) هي المقاومة الكلية كما هو موضح في الشكل (3-18).»</p>`},
  {fig:'(3-18)',ref:'ص 72',caption:'توصيل المقاومات على التوازي: المقاومات R1، R2، R3 … RN بين خطين، والسهم R<sub>T</sub> يدل على المقاومة المكافئة المرئية من الطرفين',draw:()=>box(F318(),560)},
  {note:NOTE_ADD+'كل مقاومة على التوازي تفتح «طريقاً» إضافياً للتيار، لذلك تزيد الموصلية الكلية مع كل فرع جديد وتنقص المقاومة الكلية: \\(R_T\\) أصغر دائماً من أصغر مقاومة في المجموعة. ووحدة الموصلية السيمنز S (مقلوب الأوم)، لذلك يكتب الكتاب ناتج \\(1/R_T\\) بالوحدة S.'},
  {h:'مثال (3-18)',ref:'ص 72–73',html:'<p>«للدائرة الموضحة في الشكل (3-19)، احسب المقاومة الكلية \\(R_T\\) وكذلك الموصلية الكلية \\(G_T\\).» النتيجة: \\(1/R_T=0.95\\ \\text{S}\\)، \\(R_T=1.053\\ \\Omega\\)، \\(G_T=0.95\\ \\text{S}\\). (الحل في تبويب «الأمثلة المحلولة».)</p>'},
  {fig:'(3-19)',ref:'ص 73',caption:'ثلاث مقاومات على التوازي: 2 Ω و 4 Ω و 5 Ω',draw:()=>box(F319(),480)},
  {h:'المقاومة الكلية لمجموعة مقاومات متساوية موصلة على التوازي',ref:'ص 73',html:`<p>«يمكن إيجاد المقاومة الكلية لعدد N من المقاومات المتساوية قيمة … كل منها R والموصلة على التوازي كالآتي:»</p>
   $$\\frac{1}{R_T}=\\frac{1}{R}+\\frac{1}{R}+\\cdots+\\frac{1}{R}=\\frac{N}{R}$$
   <p>«أي أن المقاومة الكلية \\(R_T\\) تكون كالآتي:» $$R_T=\\frac{R}{N}$$ «وتكون الموصلية الكلية \\(G_T\\) لعدد N متساوٍ من الموصلية G في هذه الحالة:» $$G_T=N\\times G$$</p>`},
  {h:'مثال (3-19)',ref:'ص 74',html:'<p>«للدائرة الموضحة في الشكل (3-20)، احسب المقاومة الكلية \\(R_T\\).» «حيث المقاومات متساوية»: \\(R_T=R/N=2/4=0.5\\ \\Omega\\).</p>'},
  {fig:'(3-20)',ref:'ص 74',caption:'أربع مقاومات كل منها 2 Ω. R2 و R3 مرسومتان داخل مستطيل داخلي، لكن طرفي كل مقاومة متصلان بالخطين الرئيسيين، فالأربع كلها على التوازي',draw:()=>box(fig320(),560)},
  {note:NOTE_ADD+'لتعرف هل المقاومات على التوازي لا تنظر إلى شكل الرسم بل إلى <b>طرفي كل مقاومة</b>: إذا اتصل طرفاها مباشرة (بأسلاك فقط) بنفس النقطتين فهي على التوازي. هذا ما يقصده الشكلان (3-20) و(3-22).'},
  {h:'قاعدة هامة',ref:'ص 74',html:`<p>١. «إذا وصلت مقاومتين فقط على التوازي \\(R_1\\) و \\(R_2\\) فتحسب المقاومة الكلية \\(R_T\\) كما يلي:» \\(\\frac{1}{R_T}=\\frac{1}{R_1}+\\frac{1}{R_2}=\\frac{R_1+R_2}{R_1R_2}\\) «أي أن:»</p>
   $$R_T=\\frac{R_1R_2}{R_1+R_2} \\qquad (3\\text{-}31)$$
   <p>٢. «إذا وصلت ثلاث مقاومات \\(R_1\\) و \\(R_2\\) و \\(R_3\\) على التوازي فتحسب المقاومة الكلية \\(R_T\\) كذلك كما يلي:»</p>
   $$R_T=\\frac{R_1R_2R_3}{R_1R_2+R_1R_3+R_2R_3} \\qquad (3\\text{-}32)$$`},
  {note:NOTE_ADD+'يحفظ المتدربون (3-31) بعبارة «حاصل الضرب على المجموع». وهي <b>لمقاومتين فقط</b>؛ لثلاث مقاومات استعمل (3-32) أو (3-30)، أو طبّق (3-31) مرتين: اجمع اثنتين أولاً ثم الناتج مع الثالثة.'},
  {h:'مثال (3-20)',ref:'ص 75',html:'<p>«احسب المقاومة الكلية \\(R_T\\)، وكذلك قيمة التيارين \\(I_1\\) و \\(I_2\\) للدائرة المبينة في الشكل (3-21) باستخدام المعادلة (3-31).» النتيجة بتقريب الكتاب: \\(R_T=1.3333\\ \\Omega\\)، الجهد 15.9996 V، \\(I_1=7.9998\\ \\text{A}\\)، \\(I_2=3.9999\\ \\text{A}\\).</p>'},
  {fig:'(3-21)',ref:'ص 75',caption:'تيار 12 A يدخل مقاومتين على التوازي 2 Ω و 4 Ω، ثم يخرج من الطرف الآخر (السهم الخارج مكتوب في الكتاب I3)',draw:()=>box(F321(),460)},
  {note:NOTE_ADD+'التيار الخارج المسمى \\(I_3\\) في الشكل هو نفسه التيار الكلي الداخل (12 A)، لأن ما يدخل المجموعة يخرج منها. الكتاب يحسبه بهذه الطريقة في مثال (3-26) بعد شرح قانون كيرشوف للتيار.'},
  {h:'مثال (3-21)',ref:'ص 75–76',html:'<p>«أعد حل مثال (3-18) باستخدام المعادلة (3-32).» \\(R_T=\\frac{(2)(4)(5)}{(2)(4)+(2)(5)+(4)(5)}=\\frac{40}{38}=1.053\\ \\Omega\\) — نفس النتيجة.</p>'},
  {fig:'(3-22)',ref:'ص 76',caption:'يساراً: المقاومات الثلاث تخرج من نقطة واحدة على شكل مروحة وتنتهي على الخط السفلي. يميناً: نفس الدائرة مرسومة بالطريقة المعتادة — الثلاث على التوازي',draw:()=>box(fig322(),640)},
  {h:'مثال (3-22)',ref:'ص 76–77',html:'<p>«احسب المقاومات \\(R_1\\) و \\(R_2\\) و \\(R_3\\) للدائرة المبينة في الشكل (3-23) وذلك إذا كان \\(R_2=2R_1\\) و \\(R_3=2R_2\\) وكانت المقاومة الكلية \\(R_T=16\\,k\\Omega\\).» بالتعويض: \\(\\frac{1}{16}=1.75\\left(\\frac{1}{R_1}\\right)\\) فتكون \\(R_1=28\\)، \\(R_2=56\\)، \\(R_3=112\\) (بالكيلو أوم — انظر الملاحظة أسفل الصفحة).</p>'},
  {fig:'(3-23)',ref:'ص 76',caption:'ثلاث مقاومات مجهولة على التوازي، والمقاومة الكلية 16 kΩ',draw:()=>box(F323(),480)},
  {h:'مثال (3-23): التيارات والقدرة في دائرة التوازي',ref:'ص 77',html:'<p>«من دائرة التوازي الموضحة في الشكل (3-24) احسب: (أ) المقاومة الكلية \\(R_T\\) والتيار الكلي \\(I_S\\) وكذلك التيارات \\(I_1\\) و \\(I_2\\). (ب) القدرة المفقودة في كل مقاومة، وكذلك قدرة المنبع (البطارية).»</p><p>لأن جهد كل فرع يساوي جهد البطارية: \\(I_1=E/R_1\\) و \\(I_2=E/R_2\\)، و«للتأكد من صحة الحل» \\(I_S=I_1+I_2\\). وفي القدرة: «نلاحظ هنا أن القدرة \\(P_S=P_1+P_2\\)، أي أن \\(121.5=81+40.5\\ \\text{W}\\)».</p>'},
  {fig:'(3-24)',ref:'ص 77',caption:'بطارية E = 27 V تغذي مقاومتين على التوازي: R1 = 9 Ω و R2 = 18 Ω، وعلى كل منهما تيارها وجهدها',draw:()=>box(F324(),520)},
  {h:'مثال (3-24)',ref:'ص 78',html:'<p>«للدائرة الموضحة في الشكل (3-25) إذا كانت المقاومة الكلية للدائرة تساوي 4Ω، احسب: (أ) المقاومة \\(R_3\\) وجهد البطارية E وكذلك تيار المنبع \\(I_S\\). (ب) التيار \\(I_2\\) والقدرة المفقودة في المقاومة \\(R_2\\) أي \\(P_2\\).» النتائج: \\(R_3=10\\ \\Omega\\)، \\(E=40\\ \\text{V}\\)، \\(I_S=10\\ \\text{A}\\)، \\(I_2=2\\ \\text{A}\\)، \\(P_2=80\\ \\text{W}\\).</p>'},
  {fig:'(3-25)',ref:'ص 78',caption:'المقاومات الثلاث موصلة من الخط العلوي إلى رموز أرضي منفصلة. الأرضي كله نقطة واحدة، فالثلاث على التوازي مع البطارية',draw:()=>box(fig325(),500)},
  {note:NOTE_ADD+'رمز الأرضي يعني أن كل هذه الأطراف متصلة ببعضها (نقطة مرجعية واحدة)، فلا داعي لرسم السلك السفلي.'},
  {h:'ملخص الأمثلة',ref:'ص 72–78',html:`<div class="cb-tbl"><table class="tt"><thead><tr><th>المثال</th><th>المعطيات</th><th>النتائج</th></tr></thead><tbody>
   <tr><td>(3-18)</td><td>2، 4، 5 Ω</td><td>G<sub>T</sub> = 0.95 S، R<sub>T</sub> = 1.053 Ω</td></tr>
   <tr><td>(3-19)</td><td>أربع × 2 Ω</td><td>R<sub>T</sub> = 0.5 Ω</td></tr>
   <tr><td>(3-20)</td><td>I = 12 A، 2 و 4 Ω</td><td>R<sub>T</sub> = 1.3333 Ω، I<sub>1</sub> ≈ 8 A، I<sub>2</sub> ≈ 4 A</td></tr>
   <tr><td>(3-21)</td><td>مثل (3-18) بالمعادلة (3-32)</td><td>40/38 = 1.053 Ω</td></tr>
   <tr><td>(3-22)</td><td>R<sub>T</sub> = 16 kΩ، R<sub>2</sub> = 2R<sub>1</sub>، R<sub>3</sub> = 2R<sub>2</sub></td><td>28، 56، 112 kΩ</td></tr>
   <tr><td>(3-23)</td><td>E = 27 V، 9 و 18 Ω</td><td>R<sub>T</sub> = 6 Ω، I<sub>S</sub> = 4.5 A، P<sub>S</sub> = 121.5 W</td></tr>
   <tr><td>(3-24)</td><td>R<sub>T</sub> = 4 Ω، I<sub>1</sub> = 4 A</td><td>R<sub>3</sub> = 10 Ω، E = 40 V، I<sub>S</sub> = 10 A، P<sub>2</sub> = 80 W</td></tr></tbody></table></div>`},
  {err:`<div class="fixnote"><ul>
   <li><b>مثال (3-22) ص 77:</b> طُبعت النتائج «28 Ω و 56 Ω و 112 Ω»، والصحيح <b>28 kΩ و 56 kΩ و 112 kΩ</b> لأن المعطى \\(R_T=16\\,k\\Omega\\) (الأرقام نفسها صحيحة). في تبويب الأمثلة حلان: كما في الكتاب، والمصحح.</li>
   <li><b>مثال (3-24) ص 78:</b> الجزء الثاني مرقم «(ت)» والصحيح «(ب)»؛ وكُتب \\(I_T\\) بدل \\(I_S\\) المطلوب (نفس الكمية)؛ وفي سطر \\(I_2\\) طُبع الحد الأوسط \\(E/R_T\\) والصحيح \\(E/R_2\\) (الناتج 40/20 = 2 A صحيح). صححناها في العرض.</li>
   <li>عنوان الشكل (3-19) مطبوع بقوس زائد «((3-19)»، وفي ص 74 كلمتا «التوازي فتحسب» ملتصقتان. أخطاء طباعية صححناها.</li></ul></div>`}
 ],
 lab:(el)=>{
  const br=[{r:9,on:1},{r:18,on:1},{r:10,on:0},{r:20,on:0},{r:2,on:0}];let E=27;
  el.innerHTML=`<div class="grid cb-lab">
   <div class="panel c12"><h2>منضدة التوازي <small>مبنية على الأشكال (3-18) و(3-24) و(3-25) ص 72–78</small></h2>
    <div class="cb-row"><span class="sub">ضع دائرة من الكتاب:</span>${segHTML('pr',[['e23','مثال (3-23)'],['e24','مثال (3-24)'],['e18','مثال (3-18)'],['e19','مثال (3-19)']],'e23')}</div>
    ${sl('l7E','جهد البطارية E',0,60,0.5,E)}
    <div class="svgbox" id="l7svg" style="max-width:640px;margin-inline:auto"></div>
    <p class="sub">الخطوط المتحركة = مسار التيار. اضغط مفتاح أي فرع لتوصيله أو فصله، وحرّك منزلقه لتغيير مقاومته. (مثالا 3-18 و 3-19 لا يذكران جهد البطارية فيبقى الجهد كما هو.)</p>
    <div class="facts">${fact('الموصلية الكلية G<sub>T</sub> (3-29)','l7G')}${fact('المقاومة الكلية R<sub>T</sub> (3-30)','l7R')}${fact('تيار المنبع I<sub>S</sub> = E/R<sub>T</sub>','l7I')}${fact('مجموع تيارات الفروع','l7sI')}${fact('قدرة المنبع P<sub>S</sub> = E·I<sub>S</sub>','l7P')}${fact('مجموع قدرات المقاومات','l7sP')}</div>
    <div class="cb-row"><span id="l7chip" class="cb-chip"></span></div></div>
   <div class="panel c12"><h2>الفروع</h2><div class="cb-br" id="l7br">${br.map((b,k)=>`<div class="cb-cell" id="l7c${k}">${swHTML('l7s'+k,'R'+(k+1),'موصّل / مفصول',b.on)}${sl('l7r'+k,'R<sub>'+(k+1)+'</sub>',0.5,100,0.5,b.r)}<div class="sub" id="l7o${k}"></div></div>`).join('')}</div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l7st"></ol></div></div>`;
  B.math(el);const $=s=>el.querySelector(s);
  const on=()=>br.map((b,k)=>[b,k]).filter(([b])=>b.on);
  const cfg=(e,list)=>(e==null||E===e)&&on().length===list.length&&on().every(([b],j)=>b.r===list[j])&&br.slice(0,list.length).every(b=>b.on);
  const setUI=()=>{br.forEach((b,k)=>{$('#l7r'+k).value=b.r;$('#l7s'+k).setAttribute('aria-pressed',b.on?'true':'false')});$('#l7E').value=E};
  const preset=p=>{const P={e23:[27,[9,18]],e24:[40,[10,20,10]],e18:[null,[2,4,5]],e19:[null,[2,2,2,2]]}[p];if(P[0]!=null)E=P[0];br.forEach((b,k)=>{if(k<P[1].length){b.r=P[1][k];b.on=1}else b.on=0});setUI();upd()};
  segBind(el,'pr',preset);
  $('#l7E').oninput=e=>{E=+e.target.value;upd()};
  br.forEach((b,k)=>{$('#l7r'+k).oninput=e=>{b.r=+e.target.value;upd()};$('#l7s'+k).onclick=()=>{b.on=b.on?0:1;$('#l7s'+k).setAttribute('aria-pressed',b.on?'true':'false');upd()}});
  const draw=(G,IS)=>{const yt=50,yb=214,live=E>0&&G>0;let s=Bv(52,yt,yb,'E = '+fm(E)+' V',{side:'r',cls:live?'live':''});
    const xs=br.map((b,k)=>176+k*96);s+=W([[52,yt],[xs[4],yt]],live?'flow':'')+W([[xs[4],yb],[52,yb]],live?'flow':'');
    if(live)s+=CA(118,yt,'r','I_S = '+fm(sig(IS,4))+' A',{len:18});
    br.forEach((b,k)=>{const x=xs[k],c=b.on&&E>0?'flow':'';const I=b.on?E/b.r:0;
     s+=W([[x,yt],[x,64]],c)+SwV(x,64,90,b.on,c)+W([[x,90],[x,100]],c)+zz(x,100,x,176,c)+W([[x,176],[x,yb]],c)+Dot(x,yt)+Dot(x,yb);
     s+=T(x+16,124,'R_'+(k+1),{a:'start',fs:11})+T(x+16,138,fm(b.r)+' Ω',{a:'start',fs:11})+(b.on?T(x+16,156,fm(sig(I,4))+' A',{a:'start',fs:11,c:'b'}):arT(x+16,156,'مفصول',{a:'end',fs:11,col:'--muted'}));
     if(b.on&&E>0)s+=CA(x,190,'d','',{len:14,col:'--live'})});
    $('#l7svg').innerHTML=svg(680,236,s,'بطارية وخمسة فروع على التوازي')};
  const upd=()=>{const L=on();const G=L.reduce((s,[b])=>s+1/b.r,0),R=G>0?1/G:Infinity,IS=E*G;
    $('#l7E-v').textContent=fm(E)+' V';
    br.forEach((b,k)=>{$('#l7r'+k+'-v').textContent=fm(b.r)+' Ω';$('#l7c'+k).classList.toggle('off',!b.on);$('#l7o'+k).innerHTML=b.on?`V = ${fm(E)} V · I = ${fm(sig(E/b.r,4))} A · P = ${fm(sig(E*E/b.r,4))} W`:'الفرع مفصول: لا تيار'});
    $('#l7G').textContent=fm(sig(G,5))+' S';$('#l7R').textContent=isFinite(R)?fm(sig(R,5))+' Ω':'∞ (لا فروع)';$('#l7I').textContent=fm(sig(IS,5))+' A';
    $('#l7sI').textContent=fm(sig(L.reduce((s,[b])=>s+E/b.r,0),5))+' A';$('#l7P').textContent=fm(sig(E*IS,5))+' W';$('#l7sP').textContent=fm(sig(L.reduce((s,[b])=>s+E*E/b.r,0),5))+' W';
    const ch=$('#l7chip');if(!L.length){ch.className='cb-chip warn';ch.innerHTML='كل الفروع مفصولة: الدائرة مفتوحة، I<sub>S</sub> = 0'}else{const mn=Math.min(...L.map(([b])=>b.r));const eq=L.every(([b])=>b.r===L[0][0].r);ch.className='cb-chip ok';ch.innerHTML=eq&&L.length>1?`مقاومات متساوية: R<sub>T</sub> = R/N = ${fm(L[0][0].r)}/${L.length} = ${fm(sig(R,5))} Ω`:`R<sub>T</sub> = ${fm(sig(R,4))} Ω أصغر من أصغر مقاومة موصولة (${fm(mn)} Ω)`}
    draw(G,IS);steps.check()};
  const steps=stepsUI($('#l7st'),[
   {t:'مثال (3-23) على المنضدة',x:'اضغط «مثال (3-23)»: <span class="ltr">E = 27 V</span> و R<sub>1</sub> = 9 Ω و R<sub>2</sub> = 18 Ω. اقرأ <span class="ltr">R<sub>T</sub> = 6 Ω</span> و <span class="ltr">I<sub>S</sub> = 4.5 A = 3 + 1.5</span>.',done:()=>cfg(27,[9,18])},
   {t:'أضف فرعاً',x:'وصّل R<sub>3</sub> (بأي قيمة): تنقص R<sub>T</sub> ويزيد I<sub>S</sub>، أما I<sub>1</sub> و I<sub>2</sub> فلا يتغيران لأن جهد كل فرع ما زال E (تعريف التوازي ص 72).',done:()=>E===27&&br[0].on&&br[1].on&&br[0].r===9&&br[1].r===18&&on().length>=3},
   {t:'R<sub>T</sub> أصغر من أصغر مقاومة',x:'غيّر المقاومات وراقب الشريط تحت القراءات: R<sub>T</sub> تبقى دائماً أصغر من أصغر مقاومة موصولة (توضيح — ليس من الكتاب).'},
   {t:'مقاومات متساوية',x:'اضغط «مثال (3-19)»: أربع مقاومات 2 Ω فتكون <span class="ltr">R<sub>T</sub> = R/N = 0.5 Ω</span>.',done:()=>cfg(null,[2,2,2,2])},
   {t:'القدرة — مثال (3-24)',x:'اضغط «مثال (3-24)»: <span class="ltr">R<sub>T</sub> = 4 Ω</span>، <span class="ltr">I<sub>S</sub> = 10 A</span>، و R<sub>2</sub> = 20 Ω يمر فيها <span class="ltr">2 A</span> وتستهلك <span class="ltr">80 W</span>. قارن قدرة المنبع بمجموع قدرات المقاومات.',done:()=>cfg(40,[10,20,10])}
  ]);
  upd();
 },
 examples:[
  {title:'مثال (3-18)',ref:'ص 72–73',q:'<p>«للدائرة الموضحة في الشكل (3-19)، احسب المقاومة الكلية \\(R_T\\) وكذلك الموصلية الكلية \\(G_T\\).»</p>'+box(F319(),420),given:G18,solve:solve318},
  {title:'مثال (3-19)',ref:'ص 74',q:'<p>«للدائرة الموضحة في الشكل (3-20)، احسب المقاومة الكلية \\(R_T\\).»</p>'+box(fig320(),460),
   given:[{id:'R',label:'قيمة كل مقاومة',sym:'R',unit:'Ω',value:2},{id:'N',label:'عدد المقاومات المتساوية',sym:'N',unit:'',value:4,step:1,min:1}],
   solve:(g,B)=>!(g.R>0&&g.N>=1)?bad('القيم يجب أن تكون موجبة.'):[{t:'كما هو موضح في الشكل (3-20) حيث المقاومات متساوية:',f:`R_T=\\frac{R}{N}=\\frac{${fm(g.R)}}{${fm(g.N)}}`,v:B.round(g.R/g.N,4),unit:'Ω',final:true},{t:'والموصلية الكلية:',f:`G_T=N\\times G=${fm(g.N)}\\times\\frac{1}{${fm(g.R)}}`,v:B.round(g.N/g.R,4),unit:'S'}]},
  {title:'مثال (3-20)',ref:'ص 75',q:'<p>«احسب المقاومة الكلية \\(R_T\\)، وكذلك قيمة التيارين \\(I_1\\) و \\(I_2\\) للدائرة المبينة في الشكل (3-21) باستخدام المعادلة (3-31).»</p>'+box(F321(),420),
   given:[{id:'I',label:'التيار الداخل',sym:'I',unit:'A',value:12},{id:'R1',label:'المقاومة الأولى',sym:'R_1',unit:'Ω',value:2},{id:'R2',label:'المقاومة الثانية',sym:'R_2',unit:'Ω',value:4}],solve:solve320},
  {title:'مثال (3-21)',ref:'ص 75–76',q:'<p>«أعد حل مثال (3-18) باستخدام المعادلة (3-32).»</p>'+box(fig322(),560),given:G18,solve:solve321},
  {title:'مثال (3-22) — الحل كما في الكتاب',ref:'ص 76–77',q:'<p>«احسب المقاومات \\(R_1\\) و \\(R_2\\) و \\(R_3\\) للدائرة المبينة في الشكل (3-23) وذلك إذا كان \\(R_2=2R_1\\) و \\(R_3=2R_2\\) وكانت المقاومة الكلية \\(R_T=16\\,k\\Omega\\).»</p>'+box(F323(),420),
   given:[{id:'RT',label:'المقاومة الكلية',sym:'R_T',unit:'kΩ',value:16},{id:'k2',label:'R2 ÷ R1',sym:'',unit:'',value:2},{id:'k3',label:'R3 ÷ R2',sym:'',unit:'',value:2}],solve:(g,B,bk)=>solve322(g,B,bk,false),
   note:'<b>ملاحظة على الكتاب:</b> بقيم الكتاب تعرض الحاسبة الوحدة كما طُبعت (Ω)، والصحيح kΩ. انظر الحل المصحح تحت هذا المثال.'},
  {title:'مثال (3-22) — الحل المصحح',ref:'ص 76–77',q:'<p>نفس المثال بالوحدة الصحيحة: المقاومة الكلية بالكيلو أوم، فالنتائج بالكيلو أوم (حل مصحح — ليس من الكتاب).</p>',
   given:[{id:'RT',label:'المقاومة الكلية',sym:'R_T',unit:'kΩ',value:16},{id:'k2',label:'R2 ÷ R1',sym:'',unit:'',value:2},{id:'k3',label:'R3 ÷ R2',sym:'',unit:'',value:2}],solve:(g,B,bk)=>solve322(g,B,bk,true),
   note:'تحقق: \\(\\frac{1}{28}+\\frac{1}{56}+\\frac{1}{112}=\\frac{7}{112}=\\frac{1}{16}\\) (بالكيلو أوم).'},
  {title:'مثال (3-23)',ref:'ص 77',q:'<p>«من دائرة التوازي الموضحة في الشكل (3-24) احسب: (أ) المقاومة الكلية \\(R_T\\) والتيار الكلي \\(I_S\\) وكذلك التيارات \\(I_1\\) و \\(I_2\\). (ب) القدرة المفقودة في كل مقاومة، وكذلك قدرة المنبع (البطارية).»</p>'+box(F324(),460),
   given:[{id:'E',label:'جهد البطارية',sym:'E',unit:'V',value:27},{id:'R1',label:'المقاومة الأولى',sym:'R_1',unit:'Ω',value:9},{id:'R2',label:'المقاومة الثانية',sym:'R_2',unit:'Ω',value:18}],solve:solve323},
  {title:'مثال (3-24)',ref:'ص 78',q:'<p>«للدائرة الموضحة في الشكل (3-25) إذا كانت المقاومة الكلية للدائرة تساوي 4Ω، احسب: (أ) المقاومة \\(R_3\\) وجهد البطارية E وكذلك تيار المنبع \\(I_S\\). (ب) التيار \\(I_2\\) والقدرة المفقودة في المقاومة \\(R_2\\) أي \\(P_2\\).»</p>'+box(fig325(),440),
   given:[{id:'RT',label:'المقاومة الكلية',sym:'R_T',unit:'Ω',value:4},{id:'R1',label:'المقاومة الأولى',sym:'R_1',unit:'Ω',value:10},{id:'R2',label:'المقاومة الثانية',sym:'R_2',unit:'Ω',value:20},{id:'I1',label:'تيار المقاومة الأولى',sym:'I_1',unit:'A',value:4}],solve:solve324,
   note:'<span class="fixnote">في الكتاب: الجزء الثاني مرقم «(ت)»، و«\\(I_T\\)» بدل \\(I_S\\)، والحد الأوسط في سطر \\(I_2\\) مطبوع \\(E/R_T\\) والصحيح \\(E/R_2\\). عرضناها مصححة؛ الأرقام لا تتغير.</span>'}
 ],
 quiz:[
  {q:'ما الكمية المتساوية لكل المقاومات الموصلة على التوازي؟',o:['التيار','فرق الجهد','القدرة','المقاومة'],c:1,e:'تعريف الكتاب (ص 72): «فرق الجهد عبر أي مقاومة منها متساوٍ».'},
  {q:'الموصلية الكلية لمقاومات على التوازي تساوي:',o:['مقلوب مجموع المقاومات','مجموع الموصليات \\(G_1+G_2+\\cdots\\)','حاصل ضرب الموصليات','أصغر موصلية'],c:1,e:'المعادلة (3-29).'},
  {q:'مقاومتان 6 Ω و 3 Ω على التوازي. المقاومة الكلية:',o:['9 Ω','4.5 Ω','2 Ω','18 Ω'],c:2,e:'(3-31): \\(\\frac{6\\times3}{6+3}=2\\ \\Omega\\).'},
  {q:'خمس مقاومات متساوية كل منها 10 Ω على التوازي. R<sub>T</sub> =',o:['50 Ω','10 Ω','2 Ω','0.5 Ω'],c:2,e:'\\(R_T=R/N=10/5=2\\ \\Omega\\) (ص 73).'},
  {q:'عند إضافة مقاومة جديدة على التوازي مع مجموعة موجودة فإن المقاومة الكلية:',o:['تزيد','تنقص','لا تتغير','تصبح صفراً'],c:1,e:'كل فرع جديد يزيد الموصلية الكلية (3-29) فتنقص R<sub>T</sub>.'},
  {q:'بطارية 12 V تغذي مقاومتين 4 Ω و 12 Ω على التوازي. تيار البطارية:',o:['0.75 A','1 A','3 A','4 A'],c:3,e:'\\(I_1=12/4=3\\ \\text{A}\\) و \\(I_2=12/12=1\\ \\text{A}\\)، و \\(I_S=I_1+I_2=4\\ \\text{A}\\) (كمثال 3-23).'},
  {q:'في مثال (3-23) (27 V، 9 Ω و 18 Ω) أي المقاومتين تستهلك قدرة أكبر؟',o:['18 Ω','9 Ω','متساويتان','لا تستهلكان قدرة'],c:1,e:'الجهد واحد، فالقدرة \\(E^2/R\\) أكبر في المقاومة الأصغر: 81 W مقابل 40.5 W.'},
  {q:'وحدة الموصلية G:',o:['الأوم Ω','السيمنز S','الفولت V','الواط W'],c:1,e:'G مقلوب R، ويكتب الكتاب \\(1/R_T=0.95\\ \\text{S}\\) في مثال (3-18).'}
 ]
});

/* ======================================================================
   Lesson 8 (u3-l8) — قانون كيرشوف للتيار وقاعدة توزيع التيار (ص 79–84)
   ====================================================================== */
/* الشكل (3-26) */
function fig326(){let s=W([[20,120],[60,120]])+Rz(60,120,150,120,'R_3')+W([[150,120],[200,120]])+CA(40,120,'r','I_3')+Dot(200,120);
  s+=W([[200,120],[230,100]])+zz(230,100,320,40)+W([[320,40],[360,40]])+arT(262,62,'',{})+T(285,58,'R_1',{a:'end'})+CA(345,40,'r','I_1');
  s+=W([[200,120],[230,140]])+zz(230,140,320,200)+W([[320,200],[360,200]])+T(285,192,'R_2',{a:'end'})+CA(345,200,'r','I_2',{side:'b'});
  s+=`<path d="M150 50Q180 60 196 112" fill="none" stroke="var(--live)" stroke-width="1.8"/>`+arrow(190,100,197,113,'--live',1.8)+arT(140,40,'(العقدة) Node',{fs:13,col:'--live'});
  return svg(380,230,s,'عقدة يدخلها I3 ويخرج منها I1 و I2')}
/* الشكل (3-27): pipe analogy */
function fig327(){const P='stroke="var(--blue-soft)" stroke-width="30" stroke-linecap="round" fill="none"',O='stroke="var(--blue)" stroke-width="34" stroke-linecap="round" fill="none"';
  const paths=['M200 20V200','M200 120L110 200','M200 120L290 200'];let s=paths.map(d=>`<path d="${d}" ${O}/>`).join('')+paths.map(d=>`<path d="${d}" ${P}/>`).join('');
  s+=arrow(200,24,200,70,'--live',3)+T(222,44,'I_1',{a:'start',col:'--live'})+arT(250,64,'التيار ١',{a:'start',fs:12,col:'--live'});
  s+=arrow(176,148,124,194,'--stop',3)+T(112,168,'I_4',{a:'end',col:'--stop'})+arT(96,186,'التيار ٤',{a:'end',fs:12,col:'--stop'});
  s+=arrow(224,148,276,194,'--stop',3)+T(290,168,'I_2',{a:'start',col:'--stop'})+arT(306,186,'التيار ٢',{a:'start',fs:12,col:'--stop'});
  s+=arrow(200,150,200,214,'--stop',3)+T(212,232,'I_3',{a:'start',col:'--stop'})+arT(236,232,'التيار ٣',{a:'start',fs:12,col:'--stop'});
  s+=arT(200,126,'عقدة',{fs:14,col:'--stop'});return svg(400,244,s,'تشبيه العقدة بتفرع أنبوب ماء')}
/* الشكل (3-28) — o: live values {I1,I2,I3,I4,I5} or null */
function fig328(o){const v=o||{};const f=(x,l,def)=>x==null?def:`${l} = ${fm(sig(Math.abs(x),4))} A`;const live=!!o;const c=x=>live&&Math.abs(x)>1e-9?'flow':'';
  const ax=200,ay=120,by=170;let s='';
  // input I1: left → a
  const in1=v.I1==null||v.I1>=0;s+=W(in1?[[20,ay],[60,ay]]:[[60,ay],[20,ay]],c(v.I1||0))+zz(60,ay,140,ay,c(v.I1||0))+W(in1?[[140,ay],[ax,ay]]:[[ax,ay],[140,ay]],c(v.I1||0))+CA(42,ay,in1?'r':'l',f(v.I1,'I_1','I_1 = 4 A'));
  // top branch I2: right → a (book: arrow to the left)
  const in2=v.I2==null||v.I2>=0;const c2=c(v.I2||0);s+=(in2?W([[440,40],[360,40]],c2)+zz(360,40,280,40,c2)+W([[280,40],[ax,40],[ax,ay]],c2):W([[ax,ay],[ax,40],[280,40]],c2)+zz(280,40,360,40,c2)+W([[360,40],[440,40]],c2));
  s+=CA(250,40,in2?'l':'r',f(v.I2,'I_2','I_2 = 3A'));
  // a → b : I3
  const d3=v.I3==null||v.I3>=0;s+=W(d3?[[ax,ay],[ax,by]]:[[ax,by],[ax,ay]],c(v.I3||0))+CA(ax,(ay+by)/2+2,d3?'d':'u',f(v.I3,'I_3','I_3'),{side:'l',len:16});
  // b → right upper (I4) and lower (I5)
  const d4=v.I4==null||v.I4>=0,d5=v.I5==null||v.I5>=0;
  s+=W(d4?[[ax,by],[300,by]]:[[300,by],[ax,by]],c(v.I4||0))+zz(300,by,380,by,c(v.I4||0))+W(d4?[[380,by],[440,by]]:[[440,by],[380,by]],c(v.I4||0))+CA(250,by,d4?'r':'l',f(v.I4,'I_4','I_4 = 1A'));
  s+=W(d5?[[ax,by],[ax,230],[300,230]]:[[300,230],[ax,230],[ax,by]],c(v.I5||0))+zz(300,230,380,230,c(v.I5||0))+W(d5?[[380,230],[440,230]]:[[440,230],[380,230]],c(v.I5||0))+CA(250,230,d5?'r':'l',f(v.I5,'I_5','I_5'),{side:'b'});
  s+=Dot(ax,ay)+Dot(ax,by)+T(ax-12,ay-8,'a',{a:'end',fs:14})+T(ax-12,by+16,'b',{a:'end',fs:14});
  return svg(460,262,s,'العقدتان a و b')}
const F329=()=>parFig({src:'in',IS:'I',rs:[{l:'R_1',i:'I_1',V:'V'},{l:'R_2',i:'I_2'},{l:'R_3',i:'I_3'},{l:'',dash:1},{l:'R_N',i:'I_N',dash:1}],dx:96,aria:'قاعدة توزيع التيار لعدد N من الفروع'});
const F330=()=>parFig({src:'in',IS:'I',rs:[{l:'R_1',i:'I_1'},{l:'R_2',i:'I_2'}],dx:130,aria:'مقاومتان على التوازي'});
const F332=()=>hParFig({Iin:'I = 27 mA',Iout:'',rs:[{l:'R_1',i:'I_1 = 21 mA'},{l:'R_2 = 7 Ω',i:'',ib:1}],aria:'إيجاد R1 من قاعدة توزيع التيار'});

function solve325(g,B){const I3=B.round(g.I1+g.I2,4),I5=B.round(I3-g.I4,4);
  return [{t:'طبقاً لقانون كيرشوف للتيار فإن التيار I<sub>3</sub> عند العقدة a يكون:',f:`I_3=I_1+I_2=${fm(g.I1)}+${fm(g.I2)}`,v:I3,unit:'A',final:true},
   {t:'وعند العقدة b:',f:`I_3=I_4+I_5\\;\\Rightarrow\\;${fm(I3)}=${fm(g.I4)}+I_5`},
   {t:'',f:`I_5=${fm(I3)}-${fm(g.I4)}`,v:I5,unit:'A',final:true}].concat(I5<0?[{t:'الإشارة السالبة تعني أن I<sub>5</sub> اتجاهه الحقيقي عكس السهم المرسوم (توضيح — ليس من الكتاب).'}]:[])}
function solve326(g,B){if(!(g.R1>0&&g.R2>0))return bad('المقاومتان يجب أن تكونا أكبر من صفر.');
  const I1=B.round(g.R2/(g.R1+g.R2)*g.I,4),I2=B.round(g.R1/(g.R1+g.R2)*g.I,4);
  return [{t:'باستخدام قاعدة توزيع التيار (3-34):',f:`I_1=\\left[\\frac{R_2}{R_1+R_2}\\right]I=\\left[\\frac{${fm(g.R2)}}{${fm(g.R1)}+${fm(g.R2)}}\\right]\\times(${fm(g.I)})`,v:I1,unit:'A',final:true},
   {t:'وبالمثل (3-35):',f:`I_2=\\left[\\frac{R_1}{R_1+R_2}\\right]\\times I=\\left[\\frac{${fm(g.R1)}}{${fm(g.R1)}+${fm(g.R2)}}\\right]\\times(${fm(g.I)})`,v:I2,unit:'A',final:true},
   {t:'ويمكن الحصول على I<sub>2</sub> بقانون كيرشوف للتيار:',f:`I_2=I-I_1=${fm(g.I)}-${fm(I1)}`,v:B.round(g.I-I1,4),unit:'A'},
   {t:'وبقانون كيرشوف للتيار أيضاً:',f:`I_3=I_1+I_2=${fm(I1)}+${fm(I2)}`,v:B.round(I1+I2,4),unit:'A',final:true},
   {t:'أو مباشرة: التيار الخارج من المقاومتين يساوي التيار الداخل إليهما:',f:'I_3=I',v:g.I,unit:'A'}]}
function solve327(g,B){if(!(g.I1>0&&g.I>g.I1&&g.R2>0))return bad('يجب أن يكون 0 < I<sub>1</sub> < I و R<sub>2</sub> > 0.');
  const R1=B.round(g.R2*(g.I-g.I1)/g.I1,4),I2=B.round(g.I-g.I1,4),V2=B.round(I2*g.R2,4);
  return [{t:'بقاعدة توزيع التيار للتيار I<sub>1</sub>:',f:'I_1=\\left[\\frac{R_2}{R_1+R_2}\\right]I\\;\\Rightarrow\\;(R_1+R_2)I_1=R_2I\\;\\Rightarrow\\;R_1I_1=R_2(I-I_1)'},
   {t:'',f:`R_1=\\frac{R_2(I-I_1)}{I_1}=\\frac{(${fm(g.R2)})(${fm(g.I)}-${fm(g.I1)})}{${fm(g.I1)}}`,v:R1,unit:'Ω',final:true},
   {t:'<b>حل آخر:</b> بقانون كيرشوف للتيار:',f:`I_2=I-I_1=${fm(g.I)}-${fm(g.I1)}`,v:I2,unit:'mA'},
   {t:'',f:`V_2=I_2R_2=(${fm(I2)})(${fm(g.R2)})`,v:V2,unit:'mV'},
   {t:'والمقاومتان على التوازي فجهدهما واحد:',f:`V_1=V_2\\;\\Rightarrow\\;R_1=\\frac{V_1}{I_1}=\\frac{${fm(V2)}\\ \\text{mV}}{${fm(g.I1)}\\ \\text{mA}}`,v:B.round(V2/g.I1,4),unit:'Ω',final:true}]}

B.lesson({
 id:'u3-l8',unit:3,order:8,pages:'79–84',
 title:'قانون كيرشوف للتيار وقاعدة توزيع التيار',
 summary:'مجموع التيارات الداخلة إلى أي عقدة يساوي مجموع التيارات الخارجة منها. ومنه قاعدة توزيع التيار: تيار أي فرع = (المقاومة الكلية ÷ مقاومة الفرع) × التيار الكلي، ولمقاومتين يأخذ كل فرع التيار مضروباً في مقاومة الفرع الآخر على المجموع. مع الأمثلة (3-25) و(3-26) و(3-27).',
 stations:[
  {intro:true},

  {st:1,short:'قانون كيرشوف للتيار',title:'قانون كيرشوف للتيار <span class="ltr">(Kirchhoff’s Current Law)</span>',ref:'ص 79',
   q:'عند نقطة يلتقي فيها أكثر من سلك: هل يمكن أن يدخلها تيار أكثر مما يخرج منها؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="عقدة يدخلها التيار I3 ويخرج منها I1 و I2" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><path d="M30 160 L60 160" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M60 160 L78 160 L81.7 167 L89 153 L96.3 167 L103.7 153 L111 167 L118.3 153 L122 160 L140 160" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M140 160 L170 160" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><text x="100" y="186" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">3</tspan></text><g data-tip="⟦I3⟧: التيار الداخل إلى العقدة."><path d="M34 160L45 160" stroke="#E8735A" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M56 160L45 165.5L45 154.5Z" fill="#E8735A"/><text x="45" y="146" text-anchor="middle" font-size="13" fill="#E8735A" font-weight="700">I<tspan baseline-shift="sub" font-size="75%">3</tspan></text><rect x="28" y="132" width="36" height="40" fill="transparent"/></g><path d="M170 160 L211.7 132.2 L218.6 136 L217 120.3 L230.8 127.9 L229.2 112.1 L243 119.7 L241.4 104 L248.3 107.8 L290 80" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M290 80 L325 80" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><text x="238" y="104" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">1</tspan></text><path d="M170 160 L211.7 187.8 L210.9 195.7 L224.7 188.1 L223.1 203.8 L236.9 196.2 L235.3 211.9 L249.1 204.3 L248.3 212.2 L290 240" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M290 240 L325 240" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><text x="238" y="232" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">2</tspan></text><g data-tip="⟦I1⟧: تيار خارج من العقدة."><path d="M299 80L310 80" stroke="#E8735A" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M321 80L310 85.5L310 74.5Z" fill="#E8735A"/><text x="310" y="66" text-anchor="middle" font-size="13" fill="#E8735A" font-weight="700">I<tspan baseline-shift="sub" font-size="75%">1</tspan></text><rect x="292" y="54" width="38" height="36" fill="transparent"/></g><g data-tip="⟦I2⟧: تيار خارج من العقدة."><path d="M299 240L310 240" stroke="#E8735A" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M321 240L310 245.5L310 234.5Z" fill="#E8735A"/><text x="310" y="228" text-anchor="middle" font-size="13" fill="#E8735A" font-weight="700">I<tspan baseline-shift="sub" font-size="75%">2</tspan></text><rect x="292" y="216" width="38" height="36" fill="transparent"/></g><g data-tip="العقدة ⟦Node⟧: النقطة التي تجمع أكثر من فرعين. لا تخزن شحنة: ما يدخلها يخرج منها."><circle cx="170" cy="160" r="8" fill="#F2C14E"/><circle cx="170" cy="160" r="8" fill="none" stroke="#2C4A40" stroke-width="2.5"/><text x="160" y="130" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">العقدة</text><rect x="146" y="118" width="48" height="58" fill="transparent"/></g><text x="180" y="46" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">الشكل <tspan direction="ltr" unicode-bidi="embed">(3-26)</tspan></text><rect x="110" y="262" width="140" height="32" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="180" y="284" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700">I<tspan baseline-shift="sub" font-size="75%">3</tspan> = I<tspan baseline-shift="sub" font-size="75%">1</tspan> + I<tspan baseline-shift="sub" font-size="75%">2</tspan></text></svg>`,
   cap:'الشكل <span class="ltr">(3-26)</span>: عقدة يدخلها تيار واحد ويخرج منها تياران.<br><b>مرّر المؤشر على العقدة والأسهم (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'ما المقصود بـ<b>العقدة</b> في الدائرة الكهربائية حسب الكتاب؟',opts:[
     ['أي نقطة على السلك',false,'ليست أي نقطة؛ نقطة على سلك واحد لا يتفرع منها شيء ليست عقدة.'],
     ['طرف البطارية الموجب',false,'طرف البطارية قد يكون عقدة وقد لا يكون؛ التعريف لا يتعلق بالبطارية.'],
     ['النقطة التي تجمع أكثر من فرعين',true,'نص الكتاب ص 79: «ويقصد بالعقدة في الدائرة الكهربائية النقطة التي تجمع أكثر من فرعين».']]}}
   ],
   body:[
    {book:String.raw`<p>ينص هذا القانون على أن <b>المجموع الجبري للتيارات الكهربائية الداخلة إلى عقدة معينة يساوي مجموع التيارات الخارجة منها</b>. ويقصد بالعقدة في الدائرة الكهربائية <b>النقطة التي تجمع أكثر من فرعين</b>. وكما هو موضح في الشكل (3-26) فإنه طبقاً لقانون كيرشوف للتيار يكون:</p>
     $$I_3=I_1+I_2$$
     <p>حيث التيار \(I_3\) هو التيار الداخل إلى العقدة والتيارات \(I_1\) و \(I_2\) هي التيارات الخارجة منها.</p>
     <p>وكذلك في الشكل (3-27) حيث التيار \(I_1\) هو التيار الداخل إلى العقدة والتيارات \(I_2\) و \(I_3\) و \(I_4\) هي التيارات الخارجة منها: \(I_1=I_2+I_3+I_4\).</p>`,ref:'ص 79'},
    {html:String.raw`<figure style="margin:0">${box(fig327(),300)}<figcaption class="sub" style="text-align:center">الشكل (3-27): العقدة كتفرّع أنبوب؛ الداخل من أعلى يتوزع على الفروع الثلاثة.</figcaption></figure>`},
    {tip:String.raw`<p>فكّر في العقدة كتفرّع أنابيب ماء (الشكل 3-27): الماء الداخل في كل ثانية يخرج كله من الفروع في نفس الثانية، لا يضيع منه شيء ولا يتجمع عند التفرع. والتيار كذلك: العقدة لا تخزن شحنة.</p>
     <p>لذلك إذا عرفت كل تيارات العقدة إلا واحداً، فالمجهول = (مجموع الداخل) − (مجموع الخارج المعلوم).</p>`},
    {watch:String.raw`<p>انتبه لاتجاه الأسهم قبل أن تكتب المعادلة: السهم المتجه <b>نحو</b> العقدة تيار داخل، والمتجه <b>بعيداً</b> عنها تيار خارج. وإذا خرج الناتج سالباً فالتيار الحقيقي عكس السهم الذي رسمته.</p>`}
   ]},

  {st:2,short:'مثال <span class="ltr">(3-25)</span>',title:'مثال <span class="ltr">(3-25)</span>: تطبيق القانون على عقدتين',ref:'ص 80',
   q:'في الشكل عقدتان متتاليتان a و b. بأي عقدة نبدأ، ولماذا؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="العقدة a يدخلها 4 و 3 أمبير ويخرج منها I3 إلى العقدة b التي يخرج منها 1 أمبير و I5" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><path d="M30 170 L60 170" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M60 170 L69 170 L72.5 177 L79.5 163 L86.5 177 L93.5 163 L100.5 177 L107.5 163 L111 170 L120 170" fill="none" stroke="#2C4A40" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M120 170 L140 170" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="⟦I1 = 4 A⟧: يدخل العقدة ⟦a⟧."><path d="M33 170L40 170" stroke="#E8735A" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M51 170L40 175.5L40 164.5Z" fill="#E8735A"/><text x="42" y="156" text-anchor="middle" font-size="11.5" fill="#E8735A" font-weight="700">I<tspan baseline-shift="sub" font-size="75%">1</tspan> = 4A</text><rect x="24" y="144" width="52" height="36" fill="transparent"/></g><path d="M140 170 L140 90 L200 90" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M200 90 L213 90 L216.7 97 L224 83 L231.3 97 L238.7 83 L246 97 L253.3 83 L257 90 L270 90" fill="none" stroke="#2C4A40" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M270 90 L310 90" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="⟦I2 = 3 A⟧: السهم متجه نحو ⟦a⟧، أي أنه تيار داخل إلى ⟦a⟧ أيضاً."><path d="M182 90L173 90" stroke="#E8735A" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M162 90L173 84.5L173 95.5Z" fill="#E8735A"/><text x="172" y="76" text-anchor="middle" font-size="11.5" fill="#E8735A" font-weight="700">I<tspan baseline-shift="sub" font-size="75%">2</tspan> = 3A</text><rect x="148" y="64" width="52" height="36" fill="transparent"/></g><g data-tip="⟦I3⟧: يخرج من ⟦a⟧ ويدخل ⟦b⟧. هو المجهول الأول."><path d="M140 170 L140 230" fill="none" stroke="#E8735A" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M154 191L154 198" stroke="#E8735A" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M154 209L148.5 198L159.5 198Z" fill="#E8735A"/><text x="164" y="205" text-anchor="start" font-size="13" fill="#E8735A" font-weight="700">I<tspan baseline-shift="sub" font-size="75%">3</tspan></text><rect x="130" y="172" width="60" height="56" fill="transparent"/></g><path d="M140 230 L140 270 L200 270" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M200 270 L213 270 L216.7 277 L224 263 L231.3 277 L238.7 263 L246 277 L253.3 263 L257 270 L270 270" fill="none" stroke="#2C4A40" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M270 270 L310 270" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M140 230 L200 230" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M200 230 L213 230 L216.7 237 L224 223 L231.3 237 L238.7 223 L246 237 L253.3 223 L257 230 L270 230" fill="none" stroke="#2C4A40" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M270 230 L310 230" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="⟦I4 = 1 A⟧: يخرج من ⟦b⟧."><path d="M281 230L288 230" stroke="#E8735A" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M299 230L288 235.5L288 224.5Z" fill="#E8735A"/><text x="290" y="218" text-anchor="middle" font-size="11.5" fill="#E8735A" font-weight="700">I<tspan baseline-shift="sub" font-size="75%">4</tspan> = 1A</text><rect x="266" y="206" width="52" height="34" fill="transparent"/></g><g data-tip="⟦I5⟧: يخرج من ⟦b⟧. هو المجهول الثاني."><path d="M281 270L288 270" stroke="#E8735A" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M299 270L288 275.5L288 264.5Z" fill="#E8735A"/><text x="290" y="292" text-anchor="middle" font-size="13" fill="#E8735A" font-weight="700">I<tspan baseline-shift="sub" font-size="75%">5</tspan></text><rect x="270" y="256" width="40" height="42" fill="transparent"/></g><circle cx="140" cy="170" r="6" fill="#2C4A40"/><text x="128" y="164" text-anchor="end" font-size="15" fill="#2C4A40" font-weight="700">a</text><circle cx="140" cy="230" r="6" fill="#2C4A40"/><text x="128" y="236" text-anchor="end" font-size="15" fill="#2C4A40" font-weight="700">b</text><text x="180" y="46" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">الشكل <tspan direction="ltr" unicode-bidi="embed">(3-28)</tspan></text></svg>`,
   cap:'الشكل <span class="ltr">(3-28)</span>: انتبه لاتجاه السهم <span class="ltr">I<sub>2</sub></span>.<br><b>مرّر المؤشر على الأسهم (أو المسها في الجوال) لتعرف هل التيار داخل أم خارج.</b>',
   side:[
    {predict:{q:String.raw`كم التيار \(I_3\) الخارج من العقدة a؟`,opts:[
     ['1 A',false,String.raw`هذا ناتج \(4-3\)، كأن \(I_2\) خارج. لكن سهم \(I_2\) متجه نحو a فهو داخل.`],
     ['7 A',true,String.raw`\(I_1\) و \(I_2\) كلاهما داخل إلى a، و\(I_3\) هو الخارج الوحيد: \(I_3=4+3=7\ \text{A}\).`],
     ['6 A',false,String.raw`هذا ناتج \(I_5\) عند العقدة b، وليس \(I_3\).`]]}}
   ],
   body:[
    {book:String.raw`<p>احسب التيارات \(I_3\) و \(I_5\) في الشكل (3-28) وذلك بتطبيق قانون كيرشوف للتيار.</p>
     <p><b>الحل:</b> طبقاً لقانون كيرشوف للتيار فإن التيار \(I_3\) عند العقدة a يكون:</p>
     $$I_3=I_1+I_2=4+3=7\ \text{A}$$
     <p>وكذلك التيار \(I_5\)، عند العقدة b نحصل عليه طبقاً لنفس القانون، أي أن</p>
     $$I_3=I_4+I_5\qquad 7=1+I_5\qquad I_5=7-1=6\ \text{A}$$`,ref:'ص 80'},
    {tip:String.raw`<p>نبدأ بالعقدة a لأن فيها مجهولاً واحداً فقط (\(I_3\)). أما العقدة b ففيها مجهولان (\(I_3\) و \(I_5\))، فلا نحلها إلا بعد أن نعرف \(I_3\) من العقدة a. <b>قاعدة عامة:</b> ابدأ دائماً بالعقدة التي فيها أقل عدد من المجاهيل.</p>`},
    {html:String.raw`<div class="w-row"><button class="btn pri" type="button" onclick="var b=document.querySelector('.ltabs button[data-tab=examples]');if(b)b.click()">افتح الحل خطوة بخطوة في «الأمثلة المحلولة»</button></div>`}
   ]},

  {st:3,short:'قاعدة توزيع التيار',title:'قاعدة توزيع التيار',ref:'ص 81',
   q:'نعرف التيار الكلي الداخل إلى مجموعة توازي. هل نستطيع أن نعرف تيار فرع واحد مباشرة دون حساب الجهد أولاً؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="تيار كلي يتوزع على عدد N من الفروع المتوازية وتحته معادلة قاعدة توزيع التيار" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><path d="M40 90 L300 90" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="7 5"/><path d="M40 220 L300 220" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="7 5"/><g data-tip="⟦I⟧: التيار الكلي الداخل إلى مجموعة التوازي."><path d="M58 90L71 90" stroke="#E8735A" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M82 90L71 95.5L71 84.5Z" fill="#E8735A"/><text x="70" y="78" text-anchor="middle" font-size="14" fill="#E8735A" font-weight="700">I</text><rect x="52" y="62" width="40" height="38" fill="transparent"/></g><path d="M110 90 L110 133 L103 136.7 L117 144 L103 151.3 L117 158.7 L103 166 L117 173.3 L110 177 L110 220" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="110" cy="90" r="4" fill="#2C4A40"/><circle cx="110" cy="220" r="4" fill="#2C4A40"/><text x="120" y="170" text-anchor="start" font-size="12.5" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">1</tspan></text><g data-tip="⟦I1⟧: تيار الفرع ⟦R1⟧ = ⟦(RT / R1) × I⟧."><path d="M110 106L110 111" stroke="#E8735A" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M110 122L104.5 111L115.5 111Z" fill="#E8735A"/><text x="120" y="120" text-anchor="start" font-size="12" fill="#E8735A" font-weight="700">I<tspan baseline-shift="sub" font-size="75%">1</tspan></text><rect x="102" y="100" width="40" height="30" fill="transparent"/></g><path d="M170 90 L170 133 L163 136.7 L177 144 L163 151.3 L177 158.7 L163 166 L177 173.3 L170 177 L170 220" fill="none" stroke="#E8735A" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="170" cy="90" r="4" fill="#2C4A40"/><circle cx="170" cy="220" r="4" fill="#2C4A40"/><text x="180" y="170" text-anchor="start" font-size="12.5" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">2</tspan></text><g data-tip="⟦I2⟧: تيار الفرع ⟦R2⟧ = ⟦(RT / R2) × I⟧."><path d="M170 106L170 111" stroke="#E8735A" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M170 122L164.5 111L175.5 111Z" fill="#E8735A"/><text x="180" y="120" text-anchor="start" font-size="12" fill="#E8735A" font-weight="700">I<tspan baseline-shift="sub" font-size="75%">2</tspan></text><rect x="162" y="100" width="40" height="30" fill="transparent"/></g><path d="M230 90 L230 133 L223 136.7 L237 144 L223 151.3 L237 158.7 L223 166 L237 173.3 L230 177 L230 220" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="230" cy="90" r="4" fill="#2C4A40"/><circle cx="230" cy="220" r="4" fill="#2C4A40"/><text x="240" y="170" text-anchor="start" font-size="12.5" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">3</tspan></text><g data-tip="⟦I3⟧: تيار الفرع ⟦R3⟧ = ⟦(RT / R3) × I⟧."><path d="M230 106L230 111" stroke="#E8735A" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M230 122L224.5 111L235.5 111Z" fill="#E8735A"/><text x="240" y="120" text-anchor="start" font-size="12" fill="#E8735A" font-weight="700">I<tspan baseline-shift="sub" font-size="75%">3</tspan></text><rect x="222" y="100" width="40" height="30" fill="transparent"/></g><path d="M300 90 L300 133 L293 136.7 L307 144 L293 151.3 L307 158.7 L293 166 L307 173.3 L300 177 L300 220" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="300" cy="90" r="4" fill="#2C4A40"/><circle cx="300" cy="220" r="4" fill="#2C4A40"/><text x="310" y="170" text-anchor="start" font-size="12.5" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">N</tspan></text><g data-tip="⟦IN⟧: تيار الفرع ⟦RN⟧ = ⟦(RT / RN) × I⟧."><path d="M300 106L300 111" stroke="#E8735A" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M300 122L294.5 111L305.5 111Z" fill="#E8735A"/><text x="310" y="120" text-anchor="start" font-size="12" fill="#E8735A" font-weight="700">I<tspan baseline-shift="sub" font-size="75%">N</tspan></text><rect x="292" y="100" width="40" height="30" fill="transparent"/></g><text x="265" y="160" text-anchor="middle" font-size="18" fill="#2C4A40" font-weight="700">…</text><g data-tip="المعادلة ⟦(3-33)⟧: الصورة العامة لقاعدة توزيع التيار، لأي فرع ⟦x⟧."><rect x="90" y="238" width="180" height="46" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="130" y="266" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700">I<tspan baseline-shift="sub" font-size="75%">x</tspan> =</text><text x="195" y="254" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">T</tspan></text><path d="M178 262 L212 262" fill="none" stroke="#2C4A40" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><text x="195" y="282" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">x</tspan></text><text x="240" y="266" text-anchor="middle" font-size="15" fill="#2C4A40" font-weight="700">× I</text></g><text x="180" y="52" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700" direction="rtl">الشكل <tspan direction="ltr" unicode-bidi="embed">(3-29)</tspan>: التيار يتوزع على الفروع</text></svg>`,
   cap:'الشكل <span class="ltr">(3-29)</span>: تيار كلي I يتوزع على N فرع (الخطوط المتقطعة تعني أن الدائرة تكمل خارج الرسم).<br><b>مرّر المؤشر على أسهم الفروع والبطاقة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:String.raw`في المعادلة \(I_x=\left(\frac{R_T}{R_x}\right)I\)، الفرع الذي مقاومته \(R_x\) أكبر يأخذ…`,opts:[
     ['تياراً أكبر',false,String.raw`\(R_x\) في المقام، فكلما كبرت صغر التيار.`],
     ['تياراً أصغر',true,String.raw`\(R_x\) في المقام: المقاومة الأكبر تأخذ الحصة الأصغر من التيار الكلي.`],
     ['نفس تيار باقي الفروع',false,'هذا فقط إذا تساوت المقاومات كلها.']]}}
   ],
   body:[
    {book:String.raw`<p>نطبق هذه القاعدة عندما نرغب في حساب التيار في أي فرع من فروع دائرة كهربائية موصلة على التوازي كما هو موضح في الشكل (3-29). فإذا أردنا مثلاً إيجاد قيمة التيار \(I_x\) المار في المقاومة \(R_x\)، فإننا نحسب أولاً التيار I حيث \(I=V/R_T\) ويكون فرق الجهد V عبر المقاومة \(R_x\) هو \(V=I_xR_x\)، أي أن:</p>
     $$I=\frac{V}{R_T}=\frac{I_xR_x}{R_T}$$
     <p>حيث \(R_T\) هي المقاومة الكلية للدائرة، وبالتالي يكون</p>
     <div class="eq">$$I_x=\left(\frac{R_T}{R_x}\right)I$$<span class="eqno">(3-33)</span></div>
     <p>المعادلة السابقة تمثل الصورة العامة لقاعدة توزيع التيار. فمثلاً لإيجاد أي تيار وليكن \(I_1\) فطبقاً لهذه القاعدة يكون:</p>
     $$I_1=\left(\frac{R_T}{R_1}\right)I$$
     <p>وهكذا يمكن إيجاد أي تيار في الدائرة الموضحة في الشكل (3-29) طبقاً لهذه القاعدة. وبالتالي يكون التيار \(I_2\)</p>
     $$I_2=\left(\frac{R_T}{R_2}\right)I$$`,ref:'ص 81'},
    {tip:String.raw`<p>الفكرة في خطوتين: كل الفروع لها نفس الجهد \(V=I\times R_T\)، وتيار أي فرع \(=V/R_x\). اجمعهما في سطر واحد تحصل على (3-33). أي أن \(R_T/R_x\) هو <b>نصيب</b> الفرع من التيار الكلي، وهو دائماً أصغر من 1 لأن \(R_T\) أصغر من أي مقاومة في التوازي.</p>`},
    {title:'من يأخذ التيار الأكبر؟ (أرقام أمثلة الكتاب)',widget:(el,B)=>{
      const C={e26:{t:'مثال (3-26)',I:12,u:'A',R:[2,4]},e27:{t:'مثال (3-27)',I:27,u:'mA',R:[2,7]}};let k='e26';const F=x=>B.fmtN(+x.toFixed(3));
      const draw=()=>{const c=C[k];const RT=1/c.R.reduce((s,r)=>s+1/r,0);const Is=c.R.map(r=>RT/r*c.I);
       el.innerHTML=`<div class="w-row" style="margin-top:0"><span class="w-l">الدائرة:</span><span class="mseg">${Object.entries(C).map(([v,o])=>`<button type="button" data-k="${v}" aria-pressed="${v===k}" style="font-family:var(--font)">${o.t}</button>`).join('')}</span></div>
        <p class="sub" style="margin:10px 0 6px">التيار الكلي <span class="ltr">I = ${c.I} ${c.u}</span>، و <span class="ltr">R<sub>T</sub> = ${F(RT)} Ω</span></p>
        <div class="cb-bars">${c.R.map((r,i)=>`<div class="cb-bar"><span class="ltr">R<sub>${i+1}</sub> = ${r} Ω</span><span class="tr"><i style="width:${(Is[i]/c.I*100).toFixed(1)}%"></i></span><b>${F(Is[i])} ${c.u}</b></div>`).join('')}</div>
        <p class="sub" style="margin:8px 0 0">المقاومة الأصغر تأخذ التيار الأكبر، ومجموع التيارين = <span class="ltr">${F(Is[0]+Is[1])} ${c.u}</span> = التيار الكلي.</p>`;
       el.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{k=b.dataset.k;draw()})};
      draw();
    }}
   ]},

  {st:4,short:'حالة المقاومتين',title:'حالة خاصة: مقاومتان على التوازي',ref:'ص 81–82',
   q:String.raw`لمقاومتين فقط: هل يمكن أن نحسب تيار كل فرع دون أن نحسب \(R_T\) أولاً؟`,
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="تيار يتوزع على مقاومتين على التوازي وتحته المعادلتان 3-34 و 3-35" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><path d="M30 160 L100 160" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M100 110 L100 210" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M260 110 L260 210" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M260 160 L330 160" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M100 110 L140 110" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M140 110 L158 110 L161.7 117 L169 103 L176.3 117 L183.7 103 L191 117 L198.3 103 L202 110 L220 110" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M220 110 L260 110" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M100 210 L140 210" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M140 210 L158 210 L161.7 217 L169 203 L176.3 217 L183.7 203 L191 217 L198.3 203 L202 210 L220 210" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M220 210 L260 210" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="100" cy="160" r="4" fill="#2C4A40"/><circle cx="260" cy="160" r="4" fill="#2C4A40"/><text x="180" y="94" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">1</tspan></text><text x="180" y="238" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">2</tspan></text><g data-tip="التيار الكلي ⟦I⟧ الداخل إلى المقاومتين."><path d="M50 160L63 160" stroke="#E8735A" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M74 160L63 165.5L63 154.5Z" fill="#E8735A"/><text x="62" y="146" text-anchor="middle" font-size="13" fill="#E8735A" font-weight="700">I</text><rect x="30" y="128" width="70" height="44" fill="transparent"/></g><g data-tip="⟦I1⟧: تيار ⟦R1⟧."><path d="M111 110L118 110" stroke="#E8735A" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M129 110L118 115.5L118 104.5Z" fill="#E8735A"/><text x="120" y="98" text-anchor="middle" font-size="12.5" fill="#E8735A" font-weight="700">I<tspan baseline-shift="sub" font-size="75%">1</tspan></text><rect x="104" y="82" width="34" height="36" fill="transparent"/></g><g data-tip="⟦I2⟧: تيار ⟦R2⟧."><path d="M111 210L118 210" stroke="#E8735A" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M129 210L118 215.5L118 204.5Z" fill="#E8735A"/><text x="120" y="234" text-anchor="middle" font-size="12.5" fill="#E8735A" font-weight="700">I<tspan baseline-shift="sub" font-size="75%">2</tspan></text><rect x="104" y="202" width="34" height="38" fill="transparent"/></g><g data-tip="المعادلة ⟦(3-34)⟧: تيار ⟦R1⟧ يُضرب في مقاومة الفرع الآخر ⟦R2⟧."><rect x="30" y="238" width="145" height="50" rx="10" fill="#FBF6EE" stroke="#E8735A" stroke-width="2.5"/><text x="62" y="268" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700">I<tspan baseline-shift="sub" font-size="75%">1</tspan> =</text><text x="128" y="256" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">I R<tspan baseline-shift="sub" font-size="75%">2</tspan></text><path d="M93 264 L163 264" fill="none" stroke="#2C4A40" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><text x="128" y="284" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">1</tspan>+R<tspan baseline-shift="sub" font-size="75%">2</tspan></text></g><g data-tip="المعادلة ⟦(3-35)⟧: تيار ⟦R2⟧ يُضرب في مقاومة الفرع الآخر ⟦R1⟧."><rect x="185" y="238" width="145" height="50" rx="10" fill="#FBF6EE" stroke="#4FB3A9" stroke-width="2.5"/><text x="217" y="268" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700">I<tspan baseline-shift="sub" font-size="75%">2</tspan> =</text><text x="283" y="256" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">I R<tspan baseline-shift="sub" font-size="75%">1</tspan></text><path d="M248 264 L318 264" fill="none" stroke="#2C4A40" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><text x="283" y="284" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">1</tspan>+R<tspan baseline-shift="sub" font-size="75%">2</tspan></text></g><text x="180" y="56" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">الشكل <tspan direction="ltr" unicode-bidi="embed">(3-30)</tspan>: مقاومتان فقط</text></svg>`,
   cap:'الشكل <span class="ltr">(3-30)</span> ومعادلتا المقاومتين.<br><b>مرّر المؤشر على البطاقتين والأسهم (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:String.raw`في المعادلة (3-34) لتيار \(R_1\)، ما المقاومة التي في البسط؟`,opts:[
     [String.raw`\(R_1\) نفسها`,false,String.raw`لو كانت \(R_1\) في البسط لأخذت المقاومة الأكبر تياراً أكبر، وهذا عكس الحقيقة.`],
     [String.raw`\(R_2\) مقاومة الفرع الآخر`,true,String.raw`\(I_1=\frac{I\times R_2}{R_1+R_2}\): كل فرع يُضرب في مقاومة الفرع <b>الآخر</b>.`],
     [String.raw`\(R_T\)`,false,String.raw`\(R_T\) في الصورة العامة (3-33)، أما في (3-34) فقد عوّضنا عنها فظهرت \(R_2\).`]]}}
   ],
   body:[
    {book:String.raw`<p>وفي حالة خاصة إذا ما كانت الدائرة الكهربائية عبارة عن مقاومتين على التوازي كما هو مبين في الشكل (3-30)، فتكون المقاومة الكلية \(R_T\) في هذه الحالة:</p>
     $$R_T=\frac{R_1\times R_2}{R_1+R_2}\qquad I_1=\left(\frac{R_T}{R_1}\right)I=\left[\frac{R_1R_2/(R_1+R_2)}{R_1}\right]I$$
     <p>أي أن التيار \(I_1\) يكون</p>
     <div class="eq">$$I_1=\frac{I\times R_2}{R_1+R_2}$$<span class="eqno">(3-34)</span></div>
     <p>وبالمثل يمكن الحصول على التيار \(I_2\)، أي أن</p>
     <div class="eq">$$I_2=\frac{I\times R_1}{R_1+R_2}$$<span class="eqno">(3-35)</span></div>`,ref:'ص 81–82'},
    {tip:String.raw`<p>لاحظ <b>«التقاطع»</b>: تيار \(R_1\) يُضرب في \(R_2\)، وتيار \(R_2\) يُضرب في \(R_1\). السبب أن الفرع ذا المقاومة الأصغر يأخذ التيار الأكبر. تحقق سريع: إذا كانت \(R_1=R_2\) انقسم التيار نصفين.</p>`,title:'كيف تتذكرها؟'},
    {watch:String.raw`<p>المعادلتان (3-34) و(3-35) <b>لمقاومتين فقط</b>. لثلاثة فروع أو أكثر استعمل الصورة العامة (3-33).</p>`}
   ]},

  {st:5,short:'مثال <span class="ltr">(3-26)</span>',title:'مثال <span class="ltr">(3-26)</span>: التيارات بقاعدة توزيع التيار',ref:'ص 82–83',
   q:'هذه دائرة مثال (3-20) نفسها. هل نصل إلى نفس التيارين بطريقة أقصر؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="تيار 12 أمبير يتوزع على مقاومتين 2 و 4 أوم" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><path d="M30 160 L100 160" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M100 110 L100 210" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M260 110 L260 210" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M260 160 L330 160" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M100 110 L140 110" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M140 110 L158 110 L161.7 117 L169 103 L176.3 117 L183.7 103 L191 117 L198.3 103 L202 110 L220 110" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M220 110 L260 110" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M100 210 L140 210" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M140 210 L158 210 L161.7 217 L169 203 L176.3 217 L183.7 203 L191 217 L198.3 203 L202 210 L220 210" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M220 210 L260 210" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="100" cy="160" r="4" fill="#2C4A40"/><circle cx="260" cy="160" r="4" fill="#2C4A40"/><text x="180" y="94" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">1</tspan> = 2 Ω</text><text x="180" y="238" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">2</tspan> = 4 Ω</text><g data-tip="التيار الداخل ⟦I = 12 A⟧."><path d="M50 160L63 160" stroke="#E8735A" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M74 160L63 165.5L63 154.5Z" fill="#E8735A"/><text x="62" y="146" text-anchor="middle" font-size="13" fill="#E8735A" font-weight="700">I = 12 A</text><rect x="30" y="128" width="70" height="44" fill="transparent"/></g><g data-tip="⟦I1⟧ = ⟦4/(2+4) × 12 = 8 A⟧."><path d="M111 110L118 110" stroke="#E8735A" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M129 110L118 115.5L118 104.5Z" fill="#E8735A"/><text x="120" y="98" text-anchor="middle" font-size="12.5" fill="#E8735A" font-weight="700">I<tspan baseline-shift="sub" font-size="75%">1</tspan></text><rect x="104" y="82" width="34" height="36" fill="transparent"/></g><g data-tip="⟦I2⟧ = ⟦2/(2+4) × 12 = 4 A⟧."><path d="M111 210L118 210" stroke="#E8735A" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M129 210L118 215.5L118 204.5Z" fill="#E8735A"/><text x="120" y="234" text-anchor="middle" font-size="12.5" fill="#E8735A" font-weight="700">I<tspan baseline-shift="sub" font-size="75%">2</tspan></text><rect x="104" y="202" width="34" height="38" fill="transparent"/></g><g data-tip="⟦I3⟧: التيار الخارج = التيار الداخل ⟦12 A⟧ (قانون كيرشوف للتيار)."><path d="M286 160L299 160" stroke="#E8735A" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M310 160L299 165.5L299 154.5Z" fill="#E8735A"/><text x="298" y="146" text-anchor="middle" font-size="13" fill="#E8735A" font-weight="700">I<tspan baseline-shift="sub" font-size="75%">3</tspan></text><rect x="262" y="128" width="70" height="44" fill="transparent"/></g><text x="180" y="56" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">الشكل <tspan direction="ltr" unicode-bidi="embed">(3-31)</tspan> = الشكل <tspan direction="ltr" unicode-bidi="embed">(3-21)</tspan></text><text x="180" y="282" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">8 A + 4 A = 12 A</text></svg>`,
   cap:'الشكل <span class="ltr">(3-31)</span>، وهو مطابق للشكل <span class="ltr">(3-21)</span>.<br><b>مرّر المؤشر على أسهم التيار (أو المسها في الجوال) لترى قيمة كل تيار.</b>',
   side:[
    {predict:{q:String.raw`بالمعادلة (3-34): \(I_1=\frac{12\times R_2}{R_1+R_2}\) مع \(R_1=2\) و \(R_2=4\). كم \(I_1\)؟`,opts:[
     ['4 A',false,String.raw`هذا \(I_2\): ضربت في 2 بدل 4.`],
     ['6 A',false,'يتقاسم الفرعان التيار بالتساوي فقط إذا تساوت المقاومتان.'],
     ['8 A',true,String.raw`\(I_1=\frac{4}{2+4}\times12=8\ \text{A}\).`]]}}
   ],
   body:[
    {book:String.raw`<p>أوجد قيمة التيارات \(I_1\) و \(I_2\) و \(I_3\) للدائرة المبينة في الشكل (3-31).</p>
     <p><b>الحل:</b> باستخدام قاعدة توزيع التيار يكون التيار \(I_1\)</p>
     $$I_1=\left[\frac{R_2}{R_1+R_2}\right]I=\left[\frac{4}{2+4}\right]\times(12)=8\ \text{A}$$
     <p>وبالمثل يمكن الحصول على التيار \(I_2\) طبقاً لنفس القاعدة، أي أن</p>
     $$I_2=\left[\frac{R_1}{R_1+R_2}\right]\times I=\left[\frac{2}{2+4}\right]\times(12)=4\ \text{A}$$
     <p>ويمكن كذلك الحصول على التيار \(I_2\) بتطبيق قانون كيرشوف للتيار، أي أن</p>
     $$I_2=I-I_1=12-8=4\ \text{A}$$
     <p>وبتطبيق قانون كيرشوف للتيار أيضاً يمكن حساب التيار \(I_3\)، أي أن</p>
     $$I_3=I_1+I_2=8+4=12\ \text{A}$$
     <p>مع ملاحظة أنه يمكن حساب التيار \(I_3\) مباشرة وذلك باعتبار أن التيار الكلي الداخل للمقاومتين \(R_1\) و \(R_2\) يجب أن يكون مساوياً للتيار الخارج منهما وذلك طبقاً لقانون كيرشوف للتيار، أي أن</p>
     $$I_3=I=12\ \text{A}$$`,ref:'ص 82–83'},
    {tip:String.raw`<p>قارن بمثال (3-20): هناك حسبنا \(R_T\) ثم الجهد ثم التيارين، فظهرت كسور التقريب (7.9998). هنا ضربنا مباشرة فخرجت القيم الدقيقة 8 و 4 A. وبعد أن تعرف أحد التيارين يكفيك قانون كيرشوف للتيار لتعرف الآخر.</p>`},
    {html:String.raw`<div class="w-row"><button class="btn pri" type="button" onclick="var b=document.querySelector('.ltabs button[data-tab=examples]');if(b)b.click()">افتح الحل خطوة بخطوة في «الأمثلة المحلولة»</button></div>`}
   ]},

  {st:6,short:'مثال <span class="ltr">(3-27)</span>',title:'مثال <span class="ltr">(3-27)</span>: مقاومة مجهولة من توزيع التيار',ref:'ص 83–84',
   q:'نعرف التيار الكلي وتيار فرع ومقاومة الفرع الآخر. هل نستطيع أن نعرف المقاومة المجهولة بطريقتين؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="تيار 27 ملي أمبير يتوزع على مقاومة مجهولة يمر فيها 21 ملي أمبير ومقاومة 7 أوم" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><path d="M30 160 L100 160" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M100 110 L100 210" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M260 110 L260 210" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M260 160 L330 160" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M100 110 L140 110" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M140 110 L158 110 L161.7 117 L169 103 L176.3 117 L183.7 103 L191 117 L198.3 103 L202 110 L220 110" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M220 110 L260 110" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M100 210 L140 210" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M140 210 L158 210 L161.7 217 L169 203 L176.3 217 L183.7 203 L191 217 L198.3 203 L202 210 L220 210" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M220 210 L260 210" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="100" cy="160" r="4" fill="#2C4A40"/><circle cx="260" cy="160" r="4" fill="#2C4A40"/><text x="180" y="94" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">1</tspan> = ?</text><text x="180" y="238" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">2</tspan> = 7 Ω</text><g data-tip="التيار الكلي ⟦I = 27 mA⟧."><path d="M50 160L63 160" stroke="#E8735A" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M74 160L63 165.5L63 154.5Z" fill="#E8735A"/><text x="62" y="146" text-anchor="middle" font-size="13" fill="#E8735A" font-weight="700">I = 27 mA</text><rect x="30" y="128" width="70" height="44" fill="transparent"/></g><g data-tip="⟦I1 = 21 mA⟧ (معطى) في المقاومة المجهولة ⟦R1⟧."><path d="M111 110L118 110" stroke="#E8735A" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M129 110L118 115.5L118 104.5Z" fill="#E8735A"/><text x="120" y="98" text-anchor="middle" font-size="12.5" fill="#E8735A" font-weight="700">I<tspan baseline-shift="sub" font-size="75%">1</tspan></text><rect x="104" y="82" width="34" height="36" fill="transparent"/></g><g data-tip="⟦I2⟧ = ⟦27 − 21 = 6 mA⟧ (قانون كيرشوف للتيار)."><path d="M111 210L118 210" stroke="#E8735A" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M129 210L118 215.5L118 204.5Z" fill="#E8735A"/><text x="120" y="234" text-anchor="middle" font-size="12.5" fill="#E8735A" font-weight="700">I<tspan baseline-shift="sub" font-size="75%">2</tspan></text><rect x="104" y="202" width="34" height="38" fill="transparent"/></g><text x="120" y="80" text-anchor="middle" font-size="11.5" fill="#E8735A" font-weight="700">21 mA</text><text x="180" y="52" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">الشكل <tspan direction="ltr" unicode-bidi="embed">(3-32)</tspan></text><text x="180" y="282" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">V<tspan baseline-shift="sub" font-size="75%">1</tspan> = V<tspan baseline-shift="sub" font-size="75%">2</tspan></text></svg>`,
   cap:'الشكل <span class="ltr">(3-32)</span>: المقاومة العليا مجهولة.<br><b>مرّر المؤشر على أسهم التيار (أو المسها في الجوال) لتعرف قيمها.</b>',
   side:[
    {predict:{q:String.raw`كم التيار \(I_2\) في المقاومة 7 Ω؟`,opts:[
     ['6 mA',true,String.raw`بقانون كيرشوف للتيار: \(I_2=I-I_1=27-21=6\ \text{mA}\).`],
     ['48 mA',false,'هذا مجموع التيارين؛ التيار الكلي 27 mA هو الذي يتوزع على الفرعين.'],
     ['21 mA',false,String.raw`هذا تيار \(R_1\) المعطى.`]]}}
   ],
   body:[
    {book:String.raw`<p>أوجد قيمة المقاومة \(R_1\) للدائرة المبينة في الشكل (3-32).</p>
     <p><b>الحل:</b> بتطبيق قاعدة توزيع التيار للدائرة المبينة في الشكل (3-32) للتيار \(I_1\)، أي أن</p>
     $$I_1=\left[\frac{R_2}{R_1+R_2}\right]I$$
     <p>أي أن</p>
     $$(R_1+R_2)I_1=R_2I\qquad R_1I_1+R_2I_1=R_2I\qquad R_1I_1=R_2I-R_2I_1=R_2(I-I_1)$$
     $$R_1=\frac{R_2(I-I_1)}{I_1}$$
     <p>وبالتعويض عن قيم I و \(I_1\) و \(R_2\) في العلاقة السابقة نحصل على المقاومة \(R_1\)، أي</p>
     $$R_1=\frac{R_2(I-I_1)}{I_1}=\frac{(7)(27-21)}{21}=\frac{(7)(6)}{21}=2\ \Omega$$
     <p><b>حل آخر:</b> بتطبيق قانون كيرشوف للتيار يمكن الحصول على التيار \(I_2\)، أي أن</p>
     $$I_2=I-I_1=27-21=6\ \text{mA}$$
     <p>وبالتالي يمكن حساب فرق الجهد \(V_2\) و \(V_1\) وكذلك المقاومة \(R_1\) كما يلي:</p>
     $$V_2=I_2R_2=(6)(7)=42\ \text{mV}\qquad V_1=I_1R_1=V_2=42\ \text{mV}\qquad R_1=\frac{V_1}{I_1}=\frac{42\ \text{mV}}{21\ \text{mA}}=2\ \Omega$$`,ref:'ص 83–84'},
    {watch:String.raw`<p>في الكتاب طُبع السطر «\(R_1=[R_2(\;\;)]/I_1\)» وما بين القوسين ناقص؛ الصحيح \(R_1=\frac{R_2(I-I_1)}{I_1}\) كما في السطر الذي يليه. أكملناه هنا.</p>`,fix:true},
    {tip:String.raw`<p>الحل الثاني أسهل غالباً: قانون كيرشوف للتيار يعطيك \(I_2\)، ثم قانون أوم يعطيك الجهد، والجهد واحد في الفرعين. ولا داعي لتحويل الوحدات: ميلي أمبير × أوم = ميلي فولت، وميلي فولت ÷ ميلي أمبير = أوم.</p>`},
    {html:String.raw`<div class="w-row"><button class="btn pri" type="button" onclick="var b=document.querySelector('.ltabs button[data-tab=examples]');if(b)b.click()">افتح الحل خطوة بخطوة في «الأمثلة المحلولة»</button></div>`}
   ]},

  {recap:[
   String.raw`قانون كيرشوف للتيار: مجموع التيارات الداخلة إلى عقدة = مجموع التيارات الخارجة منها، والعقدة نقطة تجمع أكثر من فرعين (ص 79).`,
   String.raw`ابدأ بالعقدة التي فيها مجهول واحد، وانتبه لاتجاه الأسهم: نحو العقدة داخل، وبعيداً عنها خارج (ص 80).`,
   String.raw`قاعدة توزيع التيار: \(I_x=\left(\frac{R_T}{R_x}\right)I\) (3-33)؛ المقاومة الأصغر تأخذ التيار الأكبر (ص 81).`,
   String.raw`لمقاومتين: \(I_1=\frac{I\times R_2}{R_1+R_2}\) (3-34) و \(I_2=\frac{I\times R_1}{R_1+R_2}\) (3-35) (ص 82).`]}
],
 theory:[
  {h:'قانون كيرشوف للتيار (Kirchhoff\'s Current Law)',ref:'ص 79',html:`<p>«ينص هذا القانون على أن <b>المجموع الجبري للتيارات الكهربائية الداخلة إلى عقدة معينة يساوي مجموع التيارات الخارجة منها</b>. ويقصد بالعقدة في الدائرة الكهربائية <b>النقطة التي تجمع أكثر من فرعين</b>. وكما هو موضح في الشكل (3-26) فإنه طبقاً لقانون كيرشوف للتيار يكون:»</p>
   $$I_3=I_1+I_2$$<p>«حيث التيار \\(I_3\\) هو التيار الداخل إلى العقدة والتيارات \\(I_1\\) و \\(I_2\\) هي التيارات الخارجة منها.»</p>`},
  {fig:'(3-26)',ref:'ص 79',caption:'العقدة: يدخلها I3 عبر R3، ويخرج منها I1 عبر R1 و I2 عبر R2',draw:()=>box(fig326(),440)},
  {html:'<p>«وكذلك في الشكل (3-27) حيث التيار \\(I_1\\) هو التيار الداخل إلى العقدة والتيارات \\(I_2\\) و \\(I_3\\) و \\(I_4\\) هي التيارات الخارجة منها:» $$I_1=I_2+I_3+I_4$$ <span class="ref">ص 79</span></p>'},
  {fig:'(3-27)',ref:'ص 79',caption:'تشبيه العقدة بتفرع أنبوب: الماء الداخل من أعلى (I1) يتوزع على الفروع الثلاثة (I2 و I3 و I4)، ولا يضيع منه شيء ولا يتجمع في العقدة',draw:()=>box(fig327(),400)},
  {note:NOTE_ADD+'العقدة لا تخزن شحنة: كل ما يدخلها في كل ثانية يخرج منها في نفس الثانية. لذلك إذا عرفت كل تيارات العقدة إلا واحداً، فالمجهول = (مجموع الداخل) − (مجموع الخارج المعلوم). وإذا خرج الناتج سالباً فالتيار الحقيقي عكس السهم الذي رسمته.'},
  {h:'مثال (3-25)',ref:'ص 80',html:'<p>«احسب التيارات \\(I_3\\) و \\(I_5\\) في الشكل (3-28) وذلك بتطبيق قانون كيرشوف للتيار.» عند العقدة a: \\(I_3=I_1+I_2=4+3=7\\) A، وعند العقدة b: \\(I_3=I_4+I_5\\) أي \\(7=1+I_5\\) و \\(I_5=6\\) A.</p>'},
  {fig:'(3-28)',ref:'ص 80',caption:'العقدة a يدخلها I1 = 4 A و I2 = 3 A (سهم I2 متجه نحو a)، ويخرج منها I3 إلى العقدة b، ومن b يخرج I4 = 1 A و I5',draw:()=>box(fig328(),460)},
  {h:'قاعدة توزيع التيار',ref:'ص 81',html:`<p>«نطبق هذه القاعدة عندما نرغب في حساب التيار في أي فرع من فروع دائرة كهربائية موصلة على التوازي كما هو موضح في الشكل (3-29). فإذا أردنا مثلاً إيجاد قيمة التيار \\(I_x\\) المار في المقاومة \\(R_x\\)، فإننا نحسب أولاً التيار I حيث \\(I=V/R_T\\) ويكون فرق الجهد V عبر المقاومة \\(R_x\\) هو \\(V=I_xR_x\\)، أي أن:»</p>
   $$I=\\frac{V}{R_T}=\\frac{I_xR_x}{R_T}$$<p>«حيث \\(R_T\\) هي المقاومة الكلية للدائرة، وبالتالي يكون»</p>
   $$I_x=\\left(\\frac{R_T}{R_x}\\right)I \\qquad (3\\text{-}33)$$
   <p>«المعادلة السابقة تمثل الصورة العامة لقاعدة توزيع التيار.» فمثلاً \\(I_1=\\left(\\frac{R_T}{R_1}\\right)I\\) و \\(I_2=\\left(\\frac{R_T}{R_2}\\right)I\\) «وهكذا يمكن إيجاد أي تيار في الدائرة الموضحة في الشكل (3-29) طبقاً لهذه القاعدة.»</p>`},
  {fig:'(3-29)',ref:'ص 81',caption:'تيار كلي I يتوزع على N فرع على التوازي: I1، I2، I3 … IN (الخطوط المتقطعة تعني «حتى الفرع N»)',draw:()=>box(F329(),620)},
  {h:'حالة خاصة: مقاومتان على التوازي',ref:'ص 81–82',html:`<p>«وفي حالة خاصة إذا ما كانت الدائرة الكهربائية عبارة عن مقاومتين على التوازي كما هو مبين في الشكل (3-30)، فتكون المقاومة الكلية \\(R_T\\) في هذه الحالة: \\(R_T=\\frac{R_1R_2}{R_1+R_2}\\)»</p>
   $$I_1=\\left(\\frac{R_T}{R_1}\\right)I=\\left[\\frac{R_1R_2/(R_1+R_2)}{R_1}\\right]I$$<p>«أي أن التيار \\(I_1\\) يكون»</p>
   $$I_1=\\frac{I\\times R_2}{R_1+R_2} \\qquad (3\\text{-}34)$$<p>«وبالمثل يمكن الحصول على التيار \\(I_2\\)، أي أن»</p>
   $$I_2=\\frac{I\\times R_1}{R_1+R_2} \\qquad (3\\text{-}35)$$`},
  {fig:'(3-30)',ref:'ص 82',caption:'تيار I يتوزع على مقاومتين على التوازي R1 و R2',draw:()=>box(F330(),420)},
  {note:NOTE_ADD+'لاحظ «التقاطع» في (3-34): تيار R<sub>1</sub> يُضرب في <b>R<sub>2</sub></b> (مقاومة الفرع الآخر). السبب: الفرع ذو المقاومة الأصغر يأخذ التيار الأكبر. تحقق سريع: إذا كانت R<sub>1</sub> = R<sub>2</sub> انقسم التيار نصفين.'},
  {h:'مثال (3-26)',ref:'ص 82–83',html:'<p>«أوجد قيمة التيارات \\(I_1\\) و \\(I_2\\) و \\(I_3\\) للدائرة المبينة في الشكل (3-31).» بقاعدة توزيع التيار: \\(I_1=\\frac{4}{2+4}\\times12=8\\) A، \\(I_2=\\frac{2}{2+4}\\times12=4\\) A، وبقانون كيرشوف للتيار \\(I_2=I-I_1=4\\) A و \\(I_3=I_1+I_2=12\\) A — أو مباشرة \\(I_3=I=12\\) A لأن «التيار الكلي الداخل للمقاومتين … يجب أن يكون مساوياً للتيار الخارج منهما».</p>'},
  {fig:'(3-31)',ref:'ص 82',caption:'مطابق للشكل (3-21): I = 12 A يدخل مقاومتين على التوازي 2 Ω و 4 Ω، والتيار الخارج I3',draw:()=>box(F321(),460)},
  {h:'مثال (3-27)',ref:'ص 83–84',html:`<p>«أوجد قيمة المقاومة \\(R_1\\) للدائرة المبينة في الشكل (3-32).» بقاعدة توزيع التيار: \\((R_1+R_2)I_1=R_2I\\) ومنها \\(R_1I_1=R_2(I-I_1)\\) أي</p>$$R_1=\\frac{R_2(I-I_1)}{I_1}=\\frac{(7)(27-21)}{21}=\\frac{(7)(6)}{21}=2\\ \\Omega$$
   <p>«<b>حل آخر:</b>» بقانون كيرشوف للتيار \\(I_2=I-I_1=27-21=6\\) mA، فيكون \\(V_2=I_2R_2=(6)(7)=42\\) mV، و \\(V_1=V_2=42\\) mV، و \\(R_1=V_1/I_1=42\\,\\text{mV}/21\\,\\text{mA}=2\\ \\Omega\\).</p>`},
  {fig:'(3-32)',ref:'ص 83',caption:'تيار 27 mA يتوزع على R1 (مجهولة، يمر فيها 21 mA) و R2 = 7 Ω',draw:()=>box(F332(),460)},
  {note:NOTE_ADD+'ميلي أمبير × أوم = ميلي فولت، وميلي فولت ÷ ميلي أمبير = أوم. لذلك يمكن الحساب بالـ mA مباشرة دون تحويل إلى أمبير ما دامت الوحدة واحدة في البسط والمقام.'},
  {err:`<div class="fixnote"><ul>
   <li><b>مثال (3-27) ص 83:</b> طُبع السطر «\\(R_1=[R_2(\\;\\;)]/I_1\\)» وما بين القوسين ناقص؛ الصحيح \\(R_1=\\frac{R_2(I-I_1)}{I_1}\\) كما في السطر الذي يليه. أكملناه في العرض.</li>
   <li><b>ص 82:</b> في سطر اشتقاق \\(I_1\\) يوجد رمز «\\» زائد بعد القوس، والمقصود الضرب في I. وفي ص 79 «التيارت» والصحيح «التيارات». أخطاء طباعية صححناها.</li></ul></div>`}
 ],
 lab:(el)=>{
  let I1=4,I2=3,I4=1;let I=12,unit='A';const br=[{r:2,on:1},{r:4,on:1},{r:6,on:0},{r:12,on:0}];
  el.innerHTML=`<div class="grid cb-lab">
   <div class="panel c7"><h2>العقدتان a و b <small>مبنية على الشكل (3-28) ص 80</small></h2>
    <div class="svgbox" id="l8k" style="max-width:520px;margin-inline:auto"></div>
    <p class="sub">الأسهم تتبع الاتجاه الحقيقي للتيار: إذا صار التيار سالباً انقلب سهمه. القيم الابتدائية من مثال (3-25).</p></div>
   <div class="panel c5"><h2>التيارات المعلومة</h2>
    ${sl('l8a','I<sub>1</sub> (يدخل a من اليسار)',0,10,0.5,I1)}${sl('l8b','I<sub>2</sub> (يدخل a من الفرع العلوي؛ السالب = يخرج)',-6,6,0.5,I2)}${sl('l8c','I<sub>4</sub> (يخرج من b للفرع العلوي؛ السالب = يدخل)',-6,10,0.5,I4)}
    <div class="facts">${fact('عند a: I<sub>3</sub> = I<sub>1</sub> + I<sub>2</sub>','l8I3')}${fact('عند b: I<sub>5</sub> = I<sub>3</sub> − I<sub>4</sub>','l8I5')}</div>
    <div class="cb-row"><span id="l8chip" class="cb-chip"></span></div></div>
   <div class="panel c12"><h2>مقسّم التيار <small>مبنية على الأشكال (3-29) و(3-30) و(3-31) و(3-32) ص 81–83</small></h2>
    <div class="cb-row"><span class="sub">ضع دائرة من الكتاب:</span>${segHTML('pr',[['e26','مثال (3-26)'],['e27','مثال (3-27)']],'e26')}<span class="sub">وحدة التيار:</span>${segHTML('un',[['A','A'],['mA','mA']],unit)}</div>
    ${sl('l8I','التيار الكلي الداخل I',0,30,0.5,I)}
    <div class="svgbox" id="l8d" style="max-width:560px;margin-inline:auto"></div>
    <div class="cb-br">${br.map((b,k)=>`<div class="cb-cell" id="l8c${k}">${k>1?swHTML('l8s'+k,'R'+(k+1),'موصّل / مفصول',b.on):`<b>R<sub>${k+1}</sub></b>`}${sl('l8r'+k,'R<sub>'+(k+1)+'</sub>',0.5,50,0.5,b.r)}<div class="sub" id="l8o${k}"></div></div>`).join('')}</div>
    <div class="facts">${fact('المقاومة الكلية R<sub>T</sub>','l8RT')}${fact('جهد التوازي V = I·R<sub>T</sub>','l8V')}${fact('مجموع تيارات الفروع','l8sum')}</div>
    <div id="l8bars"></div><div id="l8f"></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l8st"></ol></div></div>`;
  B.math(el);const $=s=>el.querySelector(s);
  const kcl=()=>{const I3=I1+I2,I5=I3-I4;$('#l8a-v').textContent=fm(I1)+' A';$('#l8b-v').textContent=fm(I2)+' A';$('#l8c-v').textContent=fm(I4)+' A';
   $('#l8I3').textContent=fm(I3)+' A';$('#l8I5').textContent=fm(I5)+' A';$('#l8k').innerHTML=fig328({I1,I2,I3,I4,I5});
   const ch=$('#l8chip');if(I5<0||I3<0){ch.className='cb-chip hot';ch.textContent='ناتج سالب: التيار الحقيقي عكس الاتجاه المرسوم في الكتاب، فانقلب سهمه'}else{ch.className='cb-chip ok';ch.innerHTML=`عند a: ${fm(I1)} + ${fm(I2)} = ${fm(I1+I2)} A، وعند b: ${fm(I1+I2)} = ${fm(I4)} + ${fm(I1+I2-I4)} A`}
   steps.check()};
  ['a','b','c'].forEach((k,j)=>$('#l8'+k).oninput=e=>{const v=+e.target.value;if(j===0)I1=v;else if(j===1)I2=v;else I4=v;kcl()});
  const on=()=>br.filter(b=>b.on);
  const div=()=>{const L=on(),G=L.reduce((s,b)=>s+1/b.r,0),RT=1/G,V=I*RT,u=unit,vu=unit==='mA'?'mV':'V';
   $('#l8I-v').textContent=fm(I)+' '+u;br.forEach((b,k)=>{$('#l8r'+k+'-v').textContent=fm(b.r)+' Ω';$('#l8c'+k).classList.toggle('off',!b.on);$('#l8o'+k).innerHTML=b.on?`I<sub>${k+1}</sub> = (R<sub>T</sub>/R<sub>${k+1}</sub>)·I = ${fm(sig(RT/b.r*I,5))} ${u}`:'مفصول'});
   $('#l8RT').textContent=fm(sig(RT,5))+' Ω';$('#l8V').textContent=fm(sig(V,5))+' '+vu;$('#l8sum').textContent=fm(sig(L.reduce((s,b)=>s+RT/b.r*I,0),5))+' '+u;
   const rows=br.map((b,k)=>b.on?{l:`I<sub>${k+1}</sub> (R = ${fm(b.r)} Ω)`,v:RT/b.r*I,t:fm(sig(RT/b.r*I,4))+' '+u}:null).filter(Boolean);
   $('#l8bars').innerHTML=barsHTML([{l:'I الكلي',v:I,t:fm(I)+' '+u,src:1}].concat(rows),I);
   $('#l8f').innerHTML=L.length===2?`<div class="callout">مقاومتان فقط، فتنطبق (3-34) و(3-35): \\(I_1=\\frac{I\\,R_2}{R_1+R_2}=\\frac{${fm(I)}\\times${fm(br[1].r)}}{${fm(br[0].r)}+${fm(br[1].r)}}=${fm(sig(I*br[1].r/(br[0].r+br[1].r),5))}\\ \\text{${u}}\\)، و \\(I_2=\\frac{I\\,R_1}{R_1+R_2}=${fm(sig(I*br[0].r/(br[0].r+br[1].r),5))}\\ \\text{${u}}\\).</div>`:`<div class="callout">${L.length} فروع: نستعمل الصورة العامة (3-33) \\(I_x=(R_T/R_x)\\,I\\).</div>`;B.math($('#l8f'));
   // drawing
   const ys=[];br.forEach((b,k)=>{if(b.on)ys.push([b,k])});const n=ys.length,gap=n>2?58:90,y0=40,ym=y0+(n-1)*gap/2,xL=130,xR=390,live=I>0;let s='';
   s+=W([[20,ym],[xL,ym]],live?'flow':'')+W([[xR,ym],[500,ym]],live?'flow':'')+W([[xL,y0],[xL,y0+(n-1)*gap]])+W([[xR,y0],[xR,y0+(n-1)*gap]])+Dot(xL,ym)+Dot(xR,ym);
   s+=CA(68,ym,'r','I = '+fm(I)+' '+u)+CA(448,ym,'r','');
   ys.forEach(([b,k],j)=>{const y=y0+j*gap,Ix=RT/b.r*I,c=live?'flow':'';s+=W([[xL,y],[200,y]],c)+zz(200,y,320,y,c)+W([[320,y],[xR,y]],c)+T(260,y-13,`R_${k+1} = ${fm(b.r)} Ω`)+T(260,y+24,`I_${k+1} = ${fm(sig(Ix,4))} ${u}`,{c:'b'})});
   $('#l8d').innerHTML=svg(520,y0+(n-1)*gap+44,s,'تيار يتوزع على فروع متوازية');steps.check()};
  const setUI=()=>{$('#l8I').value=I;br.forEach((b,k)=>{$('#l8r'+k).value=b.r;const s=$('#l8s'+k);if(s)s.setAttribute('aria-pressed',b.on?'true':'false')});segSet(el,'un',unit)};
  segBind(el,'pr',p=>{if(p==='e26'){I=12;unit='A';br[0].r=2;br[1].r=4}else{I=27;unit='mA';br[0].r=10;br[1].r=7}br[2].on=br[3].on=0;setUI();div()});
  segBind(el,'un',v=>{unit=v;div()});
  $('#l8I').oninput=e=>{I=+e.target.value;div()};
  br.forEach((b,k)=>{$('#l8r'+k).oninput=e=>{b.r=+e.target.value;div()};const s=$('#l8s'+k);if(s)s.onclick=()=>{b.on=b.on?0:1;s.setAttribute('aria-pressed',b.on?'true':'false');div()}});
  const two=()=>!br[2].on&&!br[3].on;
  const steps=stepsUI($('#l8st'),[
   {t:'مثال (3-25) على العقدتين',x:'بالقيم الابتدائية: <span class="ltr">I<sub>3</sub> = 4 + 3 = 7 A</span> عند a، و <span class="ltr">I<sub>5</sub> = 7 − 1 = 6 A</span> عند b. لاحظ أن ما يدخل كل عقدة يساوي ما يخرج منها.'},
   {t:'اقلب اتجاه I<sub>2</sub>',x:'اجعل I<sub>2</sub> سالباً (يخرج من a بدل أن يدخل): ينقص I<sub>3</sub> لأن I<sub>2</sub> صار من التيارات الخارجة.',done:()=>I2<0},
   {t:'تيار بإشارة سالبة',x:'ارفع I<sub>4</sub> حتى يصبح أكبر من I<sub>3</sub>: يخرج I<sub>5</sub> سالباً وينقلب سهمه — أي أن التيار الحقيقي يدخل العقدة b من هذا الفرع.',done:()=>I1+I2-I4<0},
   {t:'مثال (3-26) على مقسّم التيار',x:'اضغط «مثال (3-26)»: <span class="ltr">I = 12 A</span> على 2 Ω و 4 Ω فيكون <span class="ltr">I<sub>1</sub> = 8 A</span> و <span class="ltr">I<sub>2</sub> = 4 A</span>: المقاومة الأصغر تأخذ التيار الأكبر.',done:()=>I===12&&unit==='A'&&two()&&br[0].r===2&&br[1].r===4},
   {t:'مثال (3-27): ابحث عن R<sub>1</sub>',x:'اضغط «مثال (3-27)» (<span class="ltr">I = 27 mA</span> و <span class="ltr">R<sub>2</sub> = 7 Ω</span>)، ثم حرّك R<sub>1</sub> حتى يصير <span class="ltr">I<sub>1</sub> = 21 mA</span>. عند أي قيمة يحدث ذلك؟',done:()=>I===27&&unit==='mA'&&two()&&br[1].r===7&&br[0].r===2},
   {t:'فرع ثالث',x:'وصّل R<sub>3</sub>: تتغير كل التيارات (لأن R<sub>T</sub> تغيرت) لكن مجموعها يبقى مساوياً للتيار الكلي I.',done:()=>br[2].on||br[3].on}
  ]);
  kcl();div();
 },
 examples:[
  {title:'مثال (3-25)',ref:'ص 80',q:'<p>«احسب التيارات \\(I_3\\) و \\(I_5\\) في الشكل (3-28) وذلك بتطبيق قانون كيرشوف للتيار.»</p>'+box(fig328(),420),
   given:[{id:'I1',label:'التيار الداخل إلى a',sym:'I_1',unit:'A',value:4},{id:'I2',label:'التيار الداخل إلى a من الفرع العلوي',sym:'I_2',unit:'A',value:3},{id:'I4',label:'التيار الخارج من b للفرع العلوي',sym:'I_4',unit:'A',value:1}],solve:solve325},
  {title:'مثال (3-26)',ref:'ص 82–83',q:'<p>«أوجد قيمة التيارات \\(I_1\\) و \\(I_2\\) و \\(I_3\\) للدائرة المبينة في الشكل (3-31).»</p>'+box(F321(),420),
   given:[{id:'I',label:'التيار الداخل',sym:'I',unit:'A',value:12},{id:'R1',label:'المقاومة الأولى',sym:'R_1',unit:'Ω',value:2},{id:'R2',label:'المقاومة الثانية',sym:'R_2',unit:'Ω',value:4}],solve:solve326},
  {title:'مثال (3-27)',ref:'ص 83–84',q:'<p>«أوجد قيمة المقاومة \\(R_1\\) للدائرة المبينة في الشكل (3-32).»</p>'+box(F332(),420),
   given:[{id:'I',label:'التيار الكلي',sym:'I',unit:'mA',value:27},{id:'I1',label:'تيار R1',sym:'I_1',unit:'mA',value:21},{id:'R2',label:'المقاومة الثانية',sym:'R_2',unit:'Ω',value:7}],solve:solve327,
   note:'<span class="fixnote">في الكتاب سطر \\(R_1=[R_2(\\;\\;)]/I_1\\) ناقص ما بين القوسين؛ أكملناه: \\(R_1=R_2(I-I_1)/I_1\\).</span>'}
 ],
 quiz:[
  {q:'العقدة في الدائرة الكهربائية هي:',o:['أي نقطة على سلك','النقطة التي تجمع أكثر من فرعين','طرف البطارية الموجب','مكان المقاومة'],c:1,e:'تعريف الكتاب ص 79.'},
  {q:'يدخل عقدة تياران 5 A و 2 A ويخرج منها تيار 4 A وتيار مجهول. المجهول:',o:['11 A','3 A','1 A','7 A'],c:1,e:'الداخل 7 A = الخارج: 4 + I، إذن I = 3 A.'},
  {q:'في الشكل (3-28) إذا كان I<sub>1</sub> = 4 A و I<sub>2</sub> = 3 A و I<sub>4</sub> = 1 A فإن I<sub>5</sub> =',o:['8 A','6 A','2 A','7 A'],c:1,e:'مثال (3-25): I<sub>3</sub> = 7 A ثم I<sub>5</sub> = 7 − 1 = 6 A.'},
  {q:'الصورة العامة لقاعدة توزيع التيار (3-33):',o:['\\(I_x=(R_x/R_T)\\,I\\)','\\(I_x=(R_T/R_x)\\,I\\)','\\(I_x=I\\,R_x\\)','\\(I_x=V\\,R_x\\)'],c:1,e:'ص 81.'},
  {q:'تيار 9 A يتوزع على 3 Ω و 6 Ω على التوازي. تيار المقاومة 3 Ω:',o:['3 A','4.5 A','6 A','9 A'],c:2,e:'(3-34): \\(9\\times\\frac{6}{3+6}=6\\) A.'},
  {q:'في مقاومتين على التوازي، أي فرع يأخذ التيار الأكبر؟',o:['ذو المقاومة الأكبر','ذو المقاومة الأصغر','يتساويان دائماً','لا يمكن المعرفة'],c:1,e:'الجهد واحد، فالتيار V/R أكبر في المقاومة الأصغر.'},
  {q:'إذا خرج ناتج تيار بإشارة سالبة عند تطبيق قانون كيرشوف فهذا يعني:',o:['خطأ في الحل حتماً','التيار الحقيقي عكس الاتجاه المفروض','التيار صفر','المقاومة سالبة'],c:1,e:'كما في الكتاب لاحقاً (مثال 4-7): القيمة السالبة تعني أن الاتجاه عكس المفروض.'}
 ]
});

/* ======================================================================
   Lesson 9 (u3-l9) — الدوائر المفتوحة ودوائر القصر + التوصيل المركب (1) (ص 84–89)
   ====================================================================== */
function fig333(){let s=Bv(50,40,190,'E')+W([[50,40],[260,40]])+W([[50,190],[260,190]])+Term(264,40,'a',{dx:12,dy:4,a:'start'})+Term(264,190,'b',{dx:12,dy:4,a:'start'});
  s+=CA(150,40,'r','I = 0 A')+arrow(300,180,300,52,'--blue',2)+Pm(316,60,'+')+Pm(316,184,'−')+T(330,112,'V_{open circuit}',{a:'start',c:'b'})+T(330,130,'= E volts',{a:'start',c:'b'});
  return svg(450,214,s,'دائرة مفتوحة عند الطرفين a و b')}
/* الشكل (3-34) left/right; o:{short,blown,I,IR,V,live} */
function sc34(o){o=o||{};const yt=40,yb=190,live=o.live,c=live&&o.I>1e-6?'flow':'';let s=Bv(40,yt,yb,'E = 10 V',{cls:c?'live':''});
  s+=W([[40,yt],[70,yt]],c)+Fuse(70,150,yt,o.blown,c)+T(110,yt-14,'10-A fuse',{fs:11})+W([[150,yt],[250,yt]],c)+W([[250,yb],[40,yb]],c);
  const cR=live&&!o.short&&!o.open&&o.I>1e-6?'flow':'';
  if(!o.open)s+=W([[250,yt],[250,80]],cR)+zz(250,80,250,150,cR)+W([[250,150],[250,yb]],cR)+T(262,118,'R = 2 Ω',{a:'start'});
  else s+=Term(250,yt+10,'a',{dx:12,dy:4,a:'start'})+Term(250,yb-10,'b',{dx:12,dy:4,a:'start'})+W([[250,yt],[250,yt+6]])+W([[250,yb],[250,yb-6]]);
  if(o.short){const cs=live&&o.I>1e-6?'flow':'';s+=`<path class="w ${cs}" d="M250 ${yt+18}C330 ${yt+30} 330 ${yb-30} 250 ${yb-18}"/>`+Dot(250,yt+18)+Dot(250,yb-18)+T(316,yt+28,'Short circuit',{a:'start',fs:11,c:'m'})+T(262,146,'I_R = 0 A',{a:'start',fs:11,c:'b'})+T(338,150,'V ≅ 0 V',{a:'start',fs:11,c:'b'})}
  if(o.lbl)s+=T(196,yt-12,o.lbl,{c:'b'});else s+=CA(196,yt,'r',o.short?'I':'I = 5 A');
  return svg((o.short?430:360)+56,yb+20,`<g transform="translate(56 0)">${s}</g>`,'دائرة الفيوز والمقاومة')}
const fig334=()=>`<div class="cb-figs"><figure>${box(sc34({}),360)}<figcaption>الحالة العادية</figcaption></figure><figure>${box(sc34({short:1}),420)}<figcaption>بعد حدوث القصر</figcaption></figure></div>`;
/* الشكل (3-35) / (3-36) — o:{s1,s2,so,vals,live:{I,IR1,IR2,IR3,V}} */
function c35(o){o=o||{};const L=o.live;const yt=40,yb=190,f=x=>L&&Math.abs(x)>1e-6?'flow':'';let s='';
  const I=L?L.I:1,cb=f(I);s+=Bv(40,yt,yb,'E = 6 V',{cls:cb?'live':''})+W([[40,yt],[70,yt]],cb);
  if(o.s1){s+=W([[70,yt],[180,yt]],cb)+`<path class="w" d="M90 ${yt}V${yt-24}H160V${yt}" stroke-dasharray="4 4"/>`+T(125,yt-30,'R_1 (مقصورة)',{fs:10,c:'m'})}else s+=Rz(70,yt,170,yt,'R_1 = 2 Ω')+W([[170,yt],[180,yt]],cb);
  s+=Dot(180,yt);
  const c2=L?f(L.IR2):'';if(o.s2){s+=W([[180,yt],[180,yb]],c2)+T(192,118,'(قصر)',{a:'start',fs:11,c:'m'})}else s+=Rz(180,yt,180,yb,'R_2 = 10 Ω',{cls:c2});
  const c3=L?f(L.IR3):'';s+=Rz(180,yt,300,yt,'R_3 = 3 Ω',{cls:c3})+W([[300,yt],[330,yt]],c3)+Term(334,yt)+Term(334,yb)+W([[330,yb],[180,yb]],c3)+Dot(180,yb)+W([[180,yb],[40,yb]],cb);
  s+=Pm(350,yt+8,'+')+Pm(350,yb-8,'−')+T(352,118,'V',{a:'start',fs:14});
  if(o.so){const cs=L?f(L.IR3):'';s+=`<path class="w ${cs}" d="M338 ${yt}C392 ${yt+40} 392 ${yb-40} 338 ${yb}"/>`+T(396,118,'(قصر)',{a:'start',fs:11,c:'m'})}
  if(o.loop)s+=`<path d="M86 96A30 30 0 1 1 84 142" fill="none" stroke="var(--stop)" stroke-width="2"/>`+arrow(96,138,84,142,'--stop',2)+T(112,124,'I',{col:'--stop'});
  else s+=CA(56,yt,'r',L?'':'I',{len:16});
  if(L)s+=T(110,yb+18,`I = ${fm(sig(I,4))} A`,{c:'b'})+T(300,yb+18,`V = ${fm(sig(L.V,3))} V`,{c:'b'});
  return svg(486,yb+(L?28:16),`<g transform="translate(56 0)">${s}</g>`,'دائرة الشكل (3-35)')}
function fig337(){let s=Term(30,40)+Term(30,190)+RTa(40,115,'R_T',{len:30})+W([[34,40],[60,40]])+Rz(60,40,150,40,'R_1')+W([[150,40],[180,40]])+Dot(180,40);
  s+=W([[180,40],[180,20],[220,20]])+Rz(220,20,320,20,'R_2')+W([[320,20],[360,20],[360,40]])+W([[180,40],[180,70],[220,70]])+Rz(220,70,320,70,'R_3',{side:'b'})+W([[320,70],[360,70],[360,40]])+Dot(360,40)+W([[360,40],[400,40],[400,190],[34,190]]);
  return svg(440,206,s,'توصيل مركب: R1 على التوالي مع (R2 و R3 على التوازي)')}
function fig338(){let s=Term(30,40,'a',{dx:-10,dy:4,a:'end'})+Term(30,190,'b',{dx:-10,dy:4,a:'end'})+Pm(30,64,'+')+Pm(30,170,'−')+T(30,120,'V',{fs:14})+W([[34,40],[50,40]])+Rz(50,40,120,40,'1')+Rz(120,40,190,40,'2')+W([[190,40],[260,40]])+CA(225,40,'r','I',{len:16});
  s+=Rz(260,40,260,190,'6')+CA(260,64,'d','I_1',{side:'l',len:14})+W([[260,40],[360,40]])+Rz(360,40,360,190,'12')+CA(360,64,'d','I_2',{side:'l',len:14})+W([[360,190],[34,190]])+Dot(260,40)+Dot(260,190);
  return svg(420,206,s,'دائرة مثال (3-29)')}
/* lamps: arr 'p4' (3-39) or 's2' (3-40); o:{R,live:{I,lampsP[],dead[]}} */
function lampFig(arr,o){o=o||{};const L=o.live,yt=40,yb=230;let s=Term(30,yt)+Term(30,yb)+Pm(30,yt+22,'+')+Pm(30,yb-18,'−')+T(30,(yt+yb)/2+4,'230 V',{fs:12});
  const on=L&&L.I>1e-6?'flow':'';s+=W([[34,yt],[60,yt]],on)+Rz(60,yt,150,yt,o.Rl||'R')+W([[150,yt],[200,yt],[200,70]],on)+CA(170,yt,'r','I',{len:14})+W([[200,yb],[34,yb]],on);
  s+=W([[120,70],[380,70]],on)+W([[120,200],[380,200]],on)+W([[200,200],[200,yb]],on);
  const P=k=>L?L.P[k]/60:null,D=k=>L?L.dead[k]:0;
  if(arr==='p4'){[150,227,304,380].forEach((x,k)=>{const c=L&&L.P[k]>1e-6?'flow':'';s+=W([[x,70],[x,122]],c)+Lamp(x,135,P(k),{dead:D(k)})+W([[x,148],[x,200]],c)+`<g data-lamp="${k}" style="cursor:${L?'pointer':'default'}"><rect x="${x-18}" y="117" width="36" height="36" fill="transparent"/></g>`})}
  else{[[180,[0,1]],[340,[2,3]]].forEach(([x,ks])=>{const c=L&&L.P[ks[0]]>1e-6?'flow':'';s+=W([[x,70],[x,88]],c)+Lamp(x,101,P(ks[0]),{dead:D(ks[0])})+W([[x,114],[x,152]],c)+Lamp(x,165,P(ks[1]),{dead:D(ks[1])})+W([[x,178],[x,200]],c);
    ks.forEach((k,j)=>{s+=`<g data-lamp="${k}" style="cursor:${L?'pointer':'default'}"><rect x="${x-18}" y="${83+j*64}" width="36" height="36" fill="transparent"/></g>`})})}
  s+=T(412,140,o.VL||(arr==='p4'?'110 V':'220 V'),{a:'start',c:'b'});
  return svg(500,yb+16,s,arr==='p4'?'أربعة مصابيح على التوازي مع مقاومة':'فرعان كل منهما مصباحان على التوالي')}

function solve328(g,B){if(!(g.R1>0&&g.R2>0))return bad('المقاومات يجب أن تكون أكبر من صفر.');const RT=B.round(g.R1+g.R2,4),I=B.round(g.E/RT,4),V=B.round(I*g.R2,4),Is=B.round(g.E/g.R1,4);
  return [{t:'الدائرة مفتوحة عند الطرفين فلا يمر تيار في R<sub>3</sub>، والتيار الكلي يمر في R<sub>1</sub> و R<sub>2</sub> فقط:',f:`R_T=R_1+R_2=${fm(g.R1)}+${fm(g.R2)}`,v:RT,unit:'Ω'},
   {t:'',f:`I=\\frac{E}{R_T}=\\frac{${fm(g.E)}}{${fm(RT)}}`,v:I,unit:'A',final:true},{t:'لا هبوط على R<sub>3</sub> فجهد الطرفين هو جهد R<sub>2</sub>:',f:`V=I\\times R_2=(${fm(I)})\\times(${fm(g.R2)})`,v:V,unit:'V',final:true},
   {t:'<b>بعد حدوث القصر بين طرفي R<sub>2</sub></b> تصبح \\(R_T=R_1\\) (الشكل 3-36):',f:`I=\\frac{E}{R_T}=\\frac{E}{R_1}=\\frac{${fm(g.E)}}{${fm(g.R1)}}`,v:Is,unit:'A',final:true},
   {t:'',f:'V=I\\times R_2=(I)\\times(0)',v:0,unit:'V',final:true}]}
const G329=[{id:'V2',label:'الجهد على المقاومة 2 Ω',sym:'V_{2\\Omega}',unit:'V',value:10},{id:'Ra',label:'المقاومة الأولى على التوالي',sym:'',unit:'Ω',value:1},{id:'Rb',label:'المقاومة الثانية على التوالي',sym:'',unit:'Ω',value:2},{id:'Rc',label:'الفرع الأول على التوازي',sym:'',unit:'Ω',value:6},{id:'Rd',label:'الفرع الثاني على التوازي',sym:'',unit:'Ω',value:12}];
function s329(g,B){const I=B.round(g.V2/g.Rb,4),Rp=B.round(g.Rc*g.Rd/(g.Rc+g.Rd),4),RT=B.round(g.Ra+g.Rb+Rp,4);return {I,Rp,RT,V:B.round(I*RT,4)}}
function solve329(g,B){if(!(g.Rb>0&&g.Rc>0&&g.Rd>0))return bad('المقاومات يجب أن تكون أكبر من صفر.');const r=s329(g,B);
  return [{t:'التيار الداخل إلى الدائرة يمر في المقاومة 2 Ω:',f:`I=\\frac{${fm(g.V2)}}{${fm(g.Rb)}}`,v:r.I,unit:'A'},{t:'',f:`R_p=\\frac{${fm(g.Rc)}\\times${fm(g.Rd)}}{${fm(g.Rc)}+${fm(g.Rd)}}`,v:r.Rp,unit:'Ω'},
   {t:'',f:`R_T=${fm(g.Ra)}+${fm(g.Rb)}+${fm(r.Rp)}`,v:r.RT,unit:'Ω'},{t:'',f:`V_{ab}=I\\times R_T=${fm(r.RT)}\\times${fm(r.I)}`,v:r.V,unit:'V',final:true}]}
function solve330(g,B){if(!(g.Rb>0&&g.Rc>0&&g.Rd>0))return bad('المقاومات يجب أن تكون أكبر من صفر.');const r=s329(g,B),V1=B.round(r.I*g.Ra,4),V6=B.round(r.V-g.V2-V1,4);
  return [{t:'من مثال (3-29): \\(V_{ab}=\\) '+fm(r.V)+' V و \\(I=\\) '+fm(r.I)+' A.',f:`V_{2\\Omega}=${fm(g.V2)}\\ \\text{V},\\quad V_{1\\Omega}=I\\times${fm(g.Ra)}=${fm(r.I)}\\times${fm(g.Ra)}`,v:V1,unit:'V'},
   {t:'',f:`V_{6\\Omega}=V_{ab}-V_{2\\Omega}-V_{1\\Omega}=${fm(r.V)}-${fm(g.V2)}-${fm(V1)}`,v:V6,unit:'V',final:true},
   {t:'',f:`I_1=\\frac{${fm(V6)}}{${fm(g.Rc)}}`,v:B.round(V6/g.Rc,3),unit:'A',dp:3,final:true},
   {t:'(يتركها الكتاب كسراً \\(I_2=10/6\\) A)',f:`I_2=\\frac{${fm(V6)}}{${fm(g.Rd)}}`,v:B.round(V6/g.Rd,3),unit:'A',dp:3,final:true},
   {t:'تحقق (توضيح — ليس من الكتاب): \\(I_1+I_2=I\\)',f:`${fm(B.round(V6/g.Rc,3))}+${fm(B.round(V6/g.Rd,3))}`,v:B.round(V6/g.Rc+V6/g.Rd,3),unit:'A'}]}
const G331=[{id:'n',label:'عدد المصابيح',sym:'',unit:'',value:4,step:1,min:1},{id:'P',label:'قدرة المصباح',sym:'P',unit:'W',value:60},{id:'VL',label:'جهد المصباح',sym:'V',unit:'V',value:110},{id:'Vs',label:'جهد المنبع',sym:'',unit:'V',value:230}];
function solve331(g,B,bk){if(!(g.VL>0&&g.Vs>g.VL&&g.P>0&&g.n>0))return bad('يجب أن يكون جهد المنبع أكبر من جهد المصابيح والقيم موجبة.');
  const P=B.round(g.n*g.P,4),I=B.round(P/g.VL,4),VR=B.round(g.Vs-g.VL,4),R=B.round(VR/I,4);
  return [{t:'القدرة الإجمالية المسحوبة بواسطة المصابيح في الدائرة المبينة في الشكل (3-39):',f:`P=${fm(g.n)}\\times${fm(g.P)}`,v:P,unit:'W'},{t:'تيار الدخل:',f:`I=\\frac{P}{V}=\\frac{${fm(P)}}{${fm(g.VL)}}`,v:I,unit:'A'},
   {t:'فرق الجهد عبر المقاومة R المتصلة على التوالي:',f:`V_R=${fm(g.Vs)}-${fm(g.VL)}`,v:VR,unit:'V'},{t:'',f:`R=\\frac{V_R}{I}=\\frac{${fm(VR)}}{${fm(I)}}`,v:R,unit:'Ω',dp:bk?0:3,final:true}]}
function solve332(g,B,bk){if(!(g.VL>0&&g.Vs>2*g.VL&&g.P>0&&g.n>0))return bad('يجب أن يكون جهد المنبع أكبر من جهد مصباحين على التوالي.');
  const P=B.round(g.n*g.P,4),VL2=2*g.VL,I=B.round(P/VL2,4),VR=B.round(g.Vs-VL2,4),R=B.round(VR/I,3);
  const I1=B.round(P/g.VL,4),VR1=B.round(g.Vs-g.VL,4),R1=bk?55:B.round(VR1/I1,4);
  return [{t:'في هذه الحالة الجهد عبر مجموعة المصابيح '+fm(VL2)+' V:',f:`I=\\frac{P}{V_L}=\\frac{${fm(P)}}{${fm(VL2)}}`,v:I,unit:'A'},
   {t:'',f:`V_R=${fm(g.Vs)}-${fm(VL2)}=R\\times I`,v:VR,unit:'V'},{t:'وهكذا نحصل على R:',f:`R=\\frac{${fm(VR)}}{${fm(I)}}`,v:R,unit:'Ω',dp:3,final:true},
   {t:'القدرة المفقودة في طريقة المثال (3-31):',f:`P_{loss}=\\frac{${fm(VR1)}^2}{${fm(R1)}}`,v:B.round(VR1*VR1/R1,2),unit:'W',dp:2,final:true},
   {t:'والقدرة المفقودة في طريقة هذا المثال:',f:`P_{loss}=\\frac{${fm(VR)}^2}{${fm(R)}}`,v:B.round(VR*VR/R,bk?1:2),unit:'W',dp:bk?1:2,final:true},
   {t:'«وهكذا تكون الطريقة الثانية أكثر فاعلية ولكن إن احترق مصباح فلن يعمل إلا مصباحان فقط.»'}]}

B.lesson({
 id:'u3-l9',unit:3,order:9,pages:'84–89',
 title:'الدوائر المفتوحة ودوائر القصر، وبداية التوصيل المركب',
 summary:'في الدائرة المفتوحة يوجد جهد بين الطرفين ولا يمر تيار، وفي دائرة القصر يمر تيار ولا يوجد جهد بين الطرفين المقصورين. ثم التوصيل المركب (توالي وتوازي معاً): المقاومة الكلية = مجموع مقاومات التوالي + مكافئ مقاومات التوازي، مع الأمثلة (3-28) إلى (3-32) ومنها تشغيل مصابيح 110 V من منبع 230 V.',
 stations:[
  {intro:true},

  {st:1,short:'الدائرة المفتوحة',title:'الدوائر المفتوحة ودوائر القصر: الدائرة المفتوحة',ref:'ص 84',
   q:'إذا قطعت السلك في دائرة بطارية، هل يختفي الجهد بين طرفي القطع؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="بطارية متصلة بطرفين مفتوحين a و b: التيار صفر والجهد بين الطرفين يساوي جهد البطارية" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><path d="M70 90 L70 155" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M70 165 L70 230" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M54 155H86" stroke="#2C4A40" stroke-width="3"/><path d="M61 165H79" stroke="#2C4A40" stroke-width="6"/><text x="94" y="151" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">+</text><text x="46" y="166" text-anchor="end" font-size="15" fill="#2C4A40" font-weight="700">E</text><path d="M70 90 L265 90" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M70 230 L265 230" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="الطرف ⟦a⟧: طرف مفتوح لا يتصل بشيء."><circle cx="270" cy="90" r="5.5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="282" y="95" text-anchor="start" font-size="15" fill="#2C4A40" font-weight="700">a</text><rect x="258" y="76" width="40" height="28" fill="transparent"/></g><g data-tip="الطرف ⟦b⟧: الطرف الآخر المفتوح."><circle cx="270" cy="230" r="5.5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="282" y="235" text-anchor="start" font-size="15" fill="#2C4A40" font-weight="700">b</text><rect x="258" y="216" width="40" height="28" fill="transparent"/></g><g data-tip="التيار صفر: لا يوجد مسار مغلق يعود فيه التيار إلى البطارية."><path d="M157 90L172 90" stroke="#9AA5A0" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M183 90L172 95.5L172 84.5Z" fill="#9AA5A0"/><text x="170" y="76" text-anchor="middle" font-size="13" fill="#E8735A" font-weight="700">I = 0 A</text><rect x="140" y="58" width="60" height="44" fill="transparent"/></g><g data-tip="الجهد بين الطرفين المفتوحين يساوي جهد البطارية: ⟦Vab = E⟧."><path d="M300 218L300 113" stroke="#4FB3A9" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M300 102L305.5 113L294.5 113Z" fill="#4FB3A9"/><text x="306" y="160" text-anchor="start" font-size="13" fill="#4FB3A9" font-weight="700">V<tspan baseline-shift="sub" font-size="75%">ab</tspan> = E</text><text x="292" y="118" text-anchor="end" font-size="14" fill="#2C4A40" font-weight="700">+</text><text x="292" y="214" text-anchor="end" font-size="16" fill="#2C4A40" font-weight="700">−</text><rect x="270" y="100" width="80" height="120" fill="transparent"/></g><text x="180" y="52" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">الشكل <tspan direction="ltr" unicode-bidi="embed">(3-33)</tspan>: دائرة مفتوحة</text><text x="180" y="272" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700" direction="rtl">جهد موجود… وتيار صفر</text></svg>`,
   cap:'الشكل <span class="ltr">(3-33)</span>: دائرة مفتوحة عند الطرفين a و b.<br><b>مرّر المؤشر على الطرفين والأسهم (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:String.raw`في الدائرة المفتوحة عند الطرفين a و b، كم الجهد \(V_{ab}\)؟`,opts:[
     ['صفر، لأن التيار صفر',false,'التيار صفر فعلاً، لكن الجهد بين الطرفين المفتوحين لا يختفي.'],
     ['يساوي جهد البطارية E',true,String.raw`نص الكتاب ص 84: «فرق الجهد بين طرفي الدائرة: \(V_{ab}=E\) والتيار \(I=0\)».`],
     ['لا نهائي',false,'الجهد محدود بجهد البطارية؛ لا شيء يرفعه فوقها.']]}}
   ],
   body:[
    {book:String.raw`<p>الدائرة الكهربائية المفتوحة يكون لها <b>فرق جهد بين طرفيها المفتوحين</b>، بينما يكون <b>التيار المار فيها دائماً مساوياً للصفر</b>. ويبين الشكل (3-33) دائرة كهربائية مفتوحة عند الطرفين a و b بينما يكون فرق الجهد بين طرفي الدائرة: \(V_{ab}=E\) والتيار \(I=0\).</p>`,ref:'ص 84'},
    {tip:String.raw`<p>لماذا \(V_{ab}=E\)؟ لأنه لا يمر تيار، فلا يوجد هبوط جهد على أي سلك أو مقاومة بين البطارية والطرفين؛ فيظهر جهد البطارية كاملاً عند الطرفين المفتوحين.</p>`},
    {add:String.raw`<p>مقبس الكهرباء في الجدار مثال على دائرة مفتوحة: بين ثقبيه جهد كامل، لكن لا يمر تيار حتى توصل جهازاً يغلق الدائرة. لهذا يبقى المقبس خطراً حتى لو لم يكن فيه شيء.</p>`}
   ]},

  {st:2,short:'دائرة القصر',title:'الدوائر المفتوحة ودوائر القصر: دائرة القصر',ref:'ص 84–85',
   q:'ماذا يحدث لو وصل سلك بين طرفي مقاومة مباشرة؟ أين يذهب التيار، وماذا يحدث لجهد المقاومة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="سلك يقصر طرفي المقاومة: الجهد عليها صفر ولا يمر فيها تيار، والتيار كله في السلك" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><path d="M60 90 L60 155" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M60 165 L60 230" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M44 155H76" stroke="#2C4A40" stroke-width="3"/><path d="M51 165H69" stroke="#2C4A40" stroke-width="6"/><text x="84" y="151" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">+</text><text x="38" y="160" text-anchor="end" font-size="14" fill="#2C4A40" font-weight="700">E</text><text x="38" y="178" text-anchor="end" font-size="12" fill="#2C4A40">10 V</text><g data-tip="الفيوز ⟦10-A fuse⟧: ينصهر إذا زاد التيار عن ⟦10 A⟧ فيفصل الدائرة."><path d="M60 90 L94 90" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M126 90 L160 90" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><rect x="94" y="82" width="32" height="16" rx="4" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><path d="M96 90 L124 90" fill="none" stroke="#2C4A40" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><rect x="94" y="76" width="52" height="28" fill="transparent"/></g><text x="110" y="74" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700">10-A fuse</text><path d="M160 90 L290 90" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M60 230 L290 230" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="المقاومة ⟦R = 2 Ω⟧ بعد القصر: لا يمر فيها تيار ⟦IR = 0 A⟧ لأن التيار يسلك طريق السلك."><path d="M290 90 L290 138 L283 141.7 L297 149 L283 156.3 L297 163.7 L283 171 L297 178.3 L290 182 L290 230" fill="none" stroke="#9AA5A0" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="300" y="150" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="700">R</text><text x="300" y="168" text-anchor="start" font-size="12" fill="#2C4A40">2 Ω</text><text x="300" y="200" text-anchor="start" font-size="11.5" fill="#12855A" font-weight="700">I<tspan baseline-shift="sub" font-size="75%">R</tspan> = 0</text><rect x="280" y="100" width="70" height="120" fill="transparent"/></g><g data-tip="سلك القصر ⟦Short circuit⟧: يصل طرفي ⟦R⟧ مباشرة، فيصير الجهد بينهما تقريباً صفراً ويمر فيه تيار كبير."><path d="M215 90 L215 230" fill="none" stroke="#E8735A" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M215 147L215 162" stroke="#E8735A" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M215 173L209.5 162L220.5 162Z" fill="#E8735A"/><rect x="200" y="90" width="30" height="140" fill="transparent"/></g><circle cx="215" cy="90" r="4" fill="#2C4A40"/><circle cx="215" cy="230" r="4" fill="#2C4A40"/><circle cx="290" cy="90" r="4" fill="#2C4A40"/><text x="180" y="52" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">الشكل <tspan direction="ltr" unicode-bidi="embed">(3-34)</tspan>: بعد القصر</text><text x="180" y="272" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">V<tspan baseline-shift="sub" font-size="75%">short</tspan> ≅ 0 V</text></svg>`,
   cap:'الشكل <span class="ltr">(3-34)</span> بعد القصر: السلك الأحمر يصل طرفي R.<br><b>مرّر المؤشر على السلك والمقاومة والفيوز (أو المسها في الجوال) لتعرف ما يحدث فيها.</b>',
   side:[
    {predict:{q:'بعد حدوث القصر بين طرفي المقاومة R، كم التيار المار في R نفسها؟',opts:[
     ['يصبح كبيراً جداً',false,'التيار الكبير يمر في سلك القصر، لا في R.'],
     ['يبقى 5 A كما قبل القصر',false,'تغير الوضع: صار للتيار طريق مقاومته تقريباً صفر.'],
     ['صفر تقريباً',true,String.raw`في الشكل (3-34) مكتوب \(I_R=0\ \text{A}\): التيار يفضّل طريق السلك، والجهد على R صار صفراً.`]]}}
   ],
   body:[
    {book:String.raw`<p>أما بالنسبة لدائرة القصر فيكون <b>فرق الجهد بين الطرفين المقصورين دائماً مساوياً للصفر</b> بينما يمر بين هذين الطرفين تيار كهربائي. والدائرة الموضحة في الشكل (3-34) تبين أن القصر حدث بين طرفي المقاومة R، وبالتالي يكون فرق الجهد بين طرفي المقاومة بعد حدوث القصر هو</p>
     $$V=I\times R=(I)\times(0)=0\ \text{V}$$
     <p>ويكون التيار بعد حدوث القصر الشكل (3-34) بين طرفي المقاومة R هو</p>
     $$I=\frac{E}{R}=\frac{E}{0}\rightarrow\infty\ \text{A}$$`,ref:'ص 84–85'},
    {tip:String.raw`<p>المقصود بـ\(E/0\): بعد القصر تصبح المقاومة التي تراها البطارية هي مقاومة سلك القصر فقط، وهي صغيرة جداً، فيكبر التيار المسحوب من البطارية جداً. أما المقاومة R نفسها فلا يمر فيها تيار (\(I_R=0\)) لأن التيار يفضّل طريق السلك.</p>`},
    {title:'تابع السلسلة: قبل القصر وبعده (أرقام الشكل 3-34)',widget:(el,B)=>{
      const C={n:['<span class="ltr">E = 10 V</span> تغذي المقاومة <span class="ltr">R = 2 Ω</span>','التيار <span class="ltr">I = 10 ÷ 2 = 5 A</span>','<span class="ltr">5 A</span> أقل من <span class="ltr">10 A</span>','الفيوز سليم والدائرة تعمل'],
               s:['سلك القصر يصل طرفي R','الجهد على R صار صفراً، ولا يمر فيها تيار','مقاومة الدائرة تقريباً صفر فيكبر التيار جداً','التيار يتجاوز <span class="ltr">10 A</span>','الفيوز ينصهر ويفصل الدائرة']};
      let k='n',tm=[];
      const draw=()=>{tm.forEach(clearTimeout);tm=[];const S=C[k];
        el.innerHTML=`<div class="w-row" style="margin-top:0"><span class="w-l">الحالة:</span><span class="mseg">${[['n','الحالة العادية'],['s','بعد القصر']].map(([v,l])=>`<button type="button" data-k="${v}" aria-pressed="${v===k}" style="font-family:var(--font)">${l}</button>`).join('')}</span></div>
         <div class="chain" style="margin-top:12px">${S.map((s,i)=>`<span class="ck${i===S.length-1?' end':''}">${s}</span>${i<S.length-1?'<span class="ar">←</span>':''}`).join('')}</div>`;
        el.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{k=b.dataset.k;draw()});
        [...el.querySelectorAll('.ck')].forEach((c,i)=>tm.push(setTimeout(()=>c.classList.add('on'),i*450)));};
      draw();
    }},
    {watch:String.raw`<p>عند القصر يكبر التيار المسحوب من البطارية جداً، ولهذا يوجد في الشكل <b>فيوز <span class="ltr">10 A</span></b>: في الحالة العادية يمر <span class="ltr">5 A</span> فيبقى سليماً، وعند القصر ينصهر ويفصل الدائرة قبل أن تتلف البطارية أو الأسلاك.</p>`},
    {watch:String.raw`<p>عبارة الكتاب \(I=E/R=E/0\) تخلط بين تيار R (وهو صفر كما في الشكل) والتيار المسحوب من البطارية (الذي يكبر جداً). المقصود الثاني.</p>`,fix:true}
   ]},

  {st:3,short:'مثال <span class="ltr">(3-28)</span>',title:'مثال <span class="ltr">(3-28)</span>: قبل القصر وبعده',ref:'ص 85–86',
   q:String.raw`المقاومة \(R_3\) تنتهي بطرف مفتوح. هل لها أي دور في حساب التيار والجهد؟`,
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="بطارية 6 فولت ومقاومة 2 أوم ثم 10 أوم إلى الخط السفلي و 3 أوم إلى طرف مفتوح" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><path d="M50 90 L50 155" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M50 165 L50 230" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M34 155H66" stroke="#2C4A40" stroke-width="3"/><path d="M41 165H59" stroke="#2C4A40" stroke-width="6"/><text x="74" y="151" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">+</text><text x="38" y="166" text-anchor="end" font-size="13" fill="#2C4A40" font-weight="700">E</text><text x="70" y="150" text-anchor="start" font-size="11" fill="#2C4A40">6 V</text><g data-tip="⟦I⟧: التيار الكلي المسحوب من البطارية."><path d="M71 90L78 90" stroke="#E8735A" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M89 90L78 95.5L78 84.5Z" fill="#E8735A"/><text x="80" y="78" text-anchor="middle" font-size="13" fill="#E8735A" font-weight="700">I</text><rect x="68" y="62" width="28" height="36" fill="transparent"/></g><path d="M50 90 L100 90" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M100 90 L109 90 L112.5 97 L119.5 83 L126.5 97 L133.5 83 L140.5 97 L147.5 83 L151 90 L160 90" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="130" y="74" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">1</tspan> = 2Ω</text><path d="M160 90 L190 90" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="190" cy="90" r="4" fill="#2C4A40"/><g data-tip="⟦R2 = 10 Ω⟧: هي المقاومة التي سيحدث القصر بين طرفيها في الجزء الثاني."><path d="M190 90 L190 138 L183 141.7 L197 149 L183 156.3 L197 163.7 L183 171 L197 178.3 L190 182 L190 230" fill="none" stroke="#E8735A" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="178" y="150" text-anchor="end" font-size="12.5" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">2</tspan></text><text x="178" y="166" text-anchor="end" font-size="11.5" fill="#2C4A40">10Ω</text><rect x="168" y="102" width="40" height="116" fill="transparent"/></g><path d="M190 90 L220 90" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="⟦R3 = 3 Ω⟧: طرفها الآخر مفتوح، فلا يمر فيها تيار ولا يهبط عليها جهد."><path d="M220 90 L229 90 L232.5 97 L239.5 83 L246.5 97 L253.5 83 L260.5 97 L267.5 83 L271 90 L280 90" fill="none" stroke="#9AA5A0" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="250" y="74" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">3</tspan> = 3Ω</text><rect x="214" y="60" width="72" height="44" fill="transparent"/></g><path d="M280 90 L300 90" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="305" cy="90" r="5.5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M50 230 L300 230" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="305" cy="230" r="5.5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="190" cy="230" r="4" fill="#2C4A40"/><g data-tip="الجهد المطلوب ⟦V⟧ بين الطرفين المفتوحين."><text x="316" y="112" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">+</text><text x="316" y="218" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700">−</text><text x="318" y="166" text-anchor="middle" font-size="15" fill="#4FB3A9" font-weight="700">V</text><rect x="300" y="98" width="36" height="124" fill="transparent"/></g><text x="180" y="52" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">الشكل <tspan direction="ltr" unicode-bidi="embed">(3-35)</tspan></text><text x="180" y="272" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">T</tspan> = R<tspan baseline-shift="sub" font-size="75%">1</tspan> + R<tspan baseline-shift="sub" font-size="75%">2</tspan></text></svg>`,
   cap:'الشكل <span class="ltr">(3-35)</span>: الدائرة مفتوحة عند الطرفين، و<span class="ltr">R<sub>2</sub></span> هي التي ستُقصر.<br><b>مرّر المؤشر على المقاومات والطرفين (أو المسها في الجوال) لتعرف دور كل منها.</b>',
   side:[
    {predict:{q:String.raw`بعد القصر بين طرفي \(R_2\)، كم الجهد V بين الطرفين المفتوحين؟`,opts:[
     ['5 V',false,'هذا الجهد قبل القصر.'],
     ['0 V',true,String.raw`النقطة بين \(R_1\) و \(R_2\) صارت متصلة بالخط السفلي بالسلك، و\(R_3\) لا يمر فيها تيار، فـ\(V=I\times0=0\ \text{V}\).`],
     ['6 V',false,String.raw`هذا جهد البطارية؛ وهو كله الآن على \(R_1\).`]]}}
   ],
   body:[
    {book:String.raw`<p>احسب قيمة التيار I وفرق الجهد V للدائرة المبينة في الشكل (3-35)، ثم أعد حساب التيار I وفرق الجهد V بعد حدوث قصر بين طرفي المقاومة \(R_2\).</p>
     <p><b>الحل:</b> حيث إن الدائرة مفتوحة عند الطرفين فيكون التيار الكلي I هو التيار المار في المقاومتين \(R_1\) و \(R_2\) فقط حيث إن التيار المار في المقاومة \(R_3\) يكون مساوياً للصفر. أي أن</p>
     $$R_T=R_1+R_2=2+10=12\ \Omega\qquad I=\frac{E}{R_T}=\frac{6}{12}=0.5\ \text{A}\qquad V=I\times R_2=(0.5)\times(10)=5\ \text{V}$$
     <p>أما بعد حدوث القصر بين طرفي المقاومة \(R_2\) فتكون المقاومة \(R_T=R_1\) كما هو موضح في الشكل (3-36) وبالتالي يكون التيار I هو</p>
     $$I=\frac{E}{R_T}=\frac{E}{R_1}=\frac{6}{2}=3\ \text{A}$$
     <p>أما فرق الجهد V فيكون مساوياً للصفر، أي أن</p>
     $$V=I\times R_2=(I)\times(0)=0\ \text{V}$$`,ref:'ص 85–86'},
    {title:'قارن الحالتين (أرقام المثال)',widget:(el,B)=>{
      const C={o:{t:'قبل القصر',RT:'2 + 10 = 12 Ω',I:'0.5 A',V:'5 V',n:'التيار يمر في R<sub>1</sub> و R<sub>2</sub>، والجهد V هو جهد R<sub>2</sub>.'},s:{t:'بعد قصر R<sub>2</sub>',RT:'R<sub>1</sub> = 2 Ω',I:'3 A',V:'0 V',n:'التيار يدور في الحلقة اليسرى فقط (البطارية و R<sub>1</sub>) كما في الشكل (3-36).'}};let k='o';
      const draw=()=>{const c=C[k];el.innerHTML=`<div class="w-row" style="margin-top:0"><span class="w-l">الحالة:</span><span class="mseg">${Object.entries(C).map(([v,o])=>`<button type="button" data-k="${v}" aria-pressed="${v===k}" style="font-family:var(--font)">${o.t}</button>`).join('')}</span></div>
        <table class="tt" style="margin-top:12px"><tbody><tr><td>المقاومة الكلية R<sub>T</sub></td><td><b class="ltr">${c.RT}</b></td></tr><tr><td>التيار I</td><td><b class="ltr">${c.I}</b></td></tr><tr><td>الجهد V بين الطرفين</td><td><b class="ltr">${c.V}</b></td></tr><tr><td>تيار R<sub>3</sub></td><td><b class="ltr">0 A</b> (طرفها مفتوح)</td></tr></tbody></table><p class="sub" style="margin:8px 0 0">${c.n}</p>`;
       el.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{k=b.dataset.k;draw()})};draw();
    }},
    {tip:String.raw`<p>لماذا \(V\) يساوي جهد \(R_2\) وليس جهد \(R_3\)؟ لأن \(R_3\) لا يمر فيها تيار (الطرف مفتوح)، فلا هبوط عليها، فجهد الطرفين = جهد النقطة بين \(R_1\) و \(R_2\).</p>`},
    {html:String.raw`<div class="w-row"><button class="btn pri" type="button" onclick="var b=document.querySelector('.ltabs button[data-tab=examples]');if(b)b.click()">افتح الحل خطوة بخطوة في «الأمثلة المحلولة»</button></div>`}
   ]},

  {st:4,short:'التوصيل المركب',title:'التوصيل المركب والتوصيل على الشكل نجمة أو دلتا: التوصيل المركب',ref:'ص 87',
   q:'دائرة فيها مقاومات على التوالي وأخرى على التوازي: هل نحتاج إلى قانون جديد؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مقاومة على التوالي مع مقاومتين على التوازي" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><circle cx="40" cy="90" r="5.5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="40" cy="230" r="5.5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M45 90 L70 90" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="السهم ⟦RT⟧: المقاومة الكلية من الطرفين."><path d="M50 160L73 160" stroke="#3B7DD8" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M84 160L73 165.5L73 154.5Z" fill="#3B7DD8"/><text x="67" y="150" text-anchor="middle" font-size="13" fill="#3B7DD8" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">T</tspan></text><rect x="46" y="134" width="44" height="36" fill="transparent"/></g><g data-tip="⟦RS⟧: الجزء الموصل على التوالي — هنا ⟦R1⟧ وحدها."><path d="M70 90 L88 90 L91.7 97 L99 83 L106.3 97 L113.7 83 L121 97 L128.3 83 L132 90 L150 90" fill="none" stroke="#E8735A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><text x="110" y="74" text-anchor="middle" font-size="13" fill="#E8735A" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">1</tspan></text><rect x="66" y="60" width="88" height="44" fill="transparent"/></g><path d="M150 90 L180 90" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="180" cy="90" r="4" fill="#2C4A40"/><path d="M180 90 L180 60 L210 60" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M180 90 L180 130 L210 130" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="⟦RP⟧: الجزء الموصل على التوازي — ⟦R2⟧ و⟦R3⟧ بين نفس النقطتين."><path d="M210 60 L223 60 L226.7 67 L234 53 L241.3 67 L248.7 53 L256 67 L263.3 53 L267 60 L280 60" fill="none" stroke="#4FB3A9" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M210 130 L223 130 L226.7 137 L234 123 L241.3 137 L248.7 123 L256 137 L263.3 123 L267 130 L280 130" fill="none" stroke="#4FB3A9" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><text x="245" y="46" text-anchor="middle" font-size="13" fill="#4FB3A9" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">2</tspan></text><text x="245" y="156" text-anchor="middle" font-size="13" fill="#4FB3A9" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">3</tspan></text><rect x="205" y="40" width="80" height="120" fill="transparent"/></g><path d="M280 60 L310 60 L310 130 L280 130" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="310" cy="90" r="4" fill="#2C4A40"/><path d="M310 90 L330 90 L330 230 L45 230" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><text x="180" y="30" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">الشكل <tspan direction="ltr" unicode-bidi="embed">(3-37)</tspan></text><g data-tip="المقاومة الكلية = مقاومة التوالي + مكافئ التوازي."><rect x="70" y="248" width="220" height="40" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="180" y="274" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">T</tspan> = R<tspan baseline-shift="sub" font-size="75%">S</tspan> + R<tspan baseline-shift="sub" font-size="75%">P</tspan></text></g><text x="110" y="214" text-anchor="middle" font-size="13" fill="#E8735A" font-weight="700" direction="rtl">توالي</text><text x="250" y="214" text-anchor="middle" font-size="13" fill="#4FB3A9" font-weight="700" direction="rtl">توازي</text></svg>`,
   cap:'الشكل <span class="ltr">(3-37)</span>: الجزء البرتقالي على التوالي والجزء الأخضر على التوازي.<br><b>مرّر المؤشر على الجزأين والبطاقة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:String.raw`في الشكل (3-37)، أي المقاومات تمثل \(R_P\)؟`,opts:[
     [String.raw`\(R_1\) وحدها`,false,String.raw`\(R_1\) على التوالي، فهي \(R_S\).`],
     [String.raw`\(R_1\) و \(R_2\) و \(R_3\)`,false,String.raw`هذه كل المقاومات، ومجموعها بالتوالي/التوازي هو \(R_T\).`],
     [String.raw`\(R_2\) و \(R_3\) معاً`,true,String.raw`\(R_P=\frac{R_2\times R_3}{R_2+R_3}\) لأنهما بين نفس النقطتين.`]]}}
   ],
   body:[
    {book:String.raw`<p>يسمى هذا النوع من التوصيل بهذا الاسم حيث أنه يتكون من <b>دوائر التوالي والتوازي معاً</b> كما هو موضح في الشكل (3-37) وبالتالي يمكن إيجاد المقاومة الكلية \(R_T\) لهذه الدائرة كما يلي:</p>
     $$R_T=R_S+R_P$$
     <p>حيث المقاومة \(R_S\) هي مجموع المقاومات الموصلة على التوالي، والمقاومة \(R_P\) هي المقاومة المكافئة للمقاومات الموصلة على التوازي. وبالتالي يكون حساب هذه المقاومات في الشكل (3-37) كالتالي:</p>
     $$R_S=R_1,\qquad R_P=\frac{R_2\times R_3}{R_2+R_3}$$
     <p>لذلك تكون المقاومة الكلية لهذه الدائرة هي:</p>
     $$R_T=R_S+R_P=R_1+\frac{R_2\times R_3}{R_2+R_3}$$
     <p>وسوف نقوم بحل أمثلة توضيحية لهذا النوع من الدوائر الكهربائية.</p>`,ref:'ص 87'},
    {tip:String.raw`<p>لا قانون جديد: نستعمل ما درسناه. نحسب كل مجموعة توازي بقاعدتها (3-31) فتصبح مقاومة واحدة، ثم نجمعها مع مقاومات التوالي. العنوان في الكتاب يذكر «التوصيل على الشكل نجمة أو دلتا» أيضاً، وهو موضوع درس لاحق في هذه الوحدة.</p>`}
   ]},

  {st:5,short:'مثال <span class="ltr">(3-29)</span>',title:'مثال <span class="ltr">(3-29)</span>: جهد الطرفين من جهد مقاومة واحدة',ref:'ص 88',
   q:'نعرف الجهد على مقاومة واحدة فقط (2 Ω). كيف نصل منه إلى جهد الدائرة كلها؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مقاومتان 1 و 2 أوم على التوالي مع مجموعة 6 و 12 أوم على التوازي بين الطرفين a و b" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><circle cx="36" cy="100" r="5.5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="36" cy="230" r="5.5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="26" y="105" text-anchor="end" font-size="14" fill="#2C4A40" font-weight="700">a</text><text x="26" y="235" text-anchor="end" font-size="14" fill="#2C4A40" font-weight="700">b</text><text x="36" y="130" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">+</text><text x="36" y="214" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700">−</text><text x="40" y="170" text-anchor="start" font-size="13" fill="#4FB3A9" font-weight="700">V</text><path d="M41 100 L60 100" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M60 100 L68.2 100 L71.5 107 L77.9 93 L84.3 107 L90.7 93 L97.1 107 L103.5 93 L106.8 100 L115 100" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="88" y="84" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">1 Ω</text><g data-tip="المقاومة ⟦2 Ω⟧: الجهد عليها معلوم ⟦10 V⟧، ومنه نعرف التيار ⟦I⟧."><path d="M125 100 L133.2 100 L136.5 107 L142.9 93 L149.3 107 L155.7 93 L162.1 107 L168.5 93 L171.8 100 L180 100" fill="none" stroke="#E8735A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><text x="152" y="84" text-anchor="middle" font-size="12" fill="#E8735A" font-weight="700">2 Ω</text><text x="152" y="68" text-anchor="middle" font-size="12" fill="#E8735A" font-weight="700">10 V</text><rect x="120" y="54" width="66" height="56" fill="transparent"/></g><path d="M115 100 L125 100" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M180 100 L230 100" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="⟦I⟧: تيار المقاومتين على التوالي، وهو نفسه التيار الكلي الداخل إلى مجموعة التوازي."><path d="M195 100L204 100" stroke="#E8735A" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M215 100L204 105.5L204 94.5Z" fill="#E8735A"/><text x="205" y="88" text-anchor="middle" font-size="13" fill="#E8735A" font-weight="700">I</text><rect x="190" y="72" width="32" height="36" fill="transparent"/></g><circle cx="230" cy="100" r="4" fill="#2C4A40"/><path d="M230 100 L300 100" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="230" cy="230" r="4" fill="#2C4A40"/><path d="M41 230 L300 230" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M230 100 L230 143 L223 146.7 L237 154 L223 161.3 L237 168.7 L223 176 L237 183.3 L230 187 L230 230" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="242" y="160" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700">6 Ω</text><path d="M230 120L230 125" stroke="#E8735A" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M230 136L224.5 125L235.5 125Z" fill="#E8735A"/><text x="222" y="134" text-anchor="end" font-size="11.5" fill="#E8735A" font-weight="700">I<tspan baseline-shift="sub" font-size="75%">1</tspan></text><path d="M300 100 L300 143 L293 146.7 L307 154 L293 161.3 L307 168.7 L293 176 L307 183.3 L300 187 L300 230" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="312" y="160" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700">12 Ω</text><path d="M300 120L300 125" stroke="#E8735A" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M300 136L294.5 125L305.5 125Z" fill="#E8735A"/><text x="292" y="134" text-anchor="end" font-size="11.5" fill="#E8735A" font-weight="700">I<tspan baseline-shift="sub" font-size="75%">2</tspan></text><text x="180" y="50" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">الشكل <tspan direction="ltr" unicode-bidi="embed">(3-38)</tspan></text><text x="180" y="272" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">T</tspan> = 1 + 2 + 4 = 7 Ω</text></svg>`,
   cap:'الشكل <span class="ltr">(3-38)</span>: القيم في الكتاب بالأوم بلا وحدة على الرسم.<br><b>مرّر المؤشر على المقاومة البرتقالية وسهم I (أو المسهما في الجوال) لتعرف من أين نبدأ.</b>',
   side:[
    {predict:{q:'كم التيار I في المقاومة 2 Ω إذا كان جهدها 10 V؟',opts:[
     ['20 A',false,String.raw`هذا ناتج الضرب 10 × 2؛ قانون أوم \(I=V/R\).`],
     ['5 A',true,String.raw`\(I=10/2=5\ \text{A}\) كما في حل الكتاب.`],
     ['10 A',false,'التيار يساوي الجهد فقط إذا كانت المقاومة 1 Ω.']]}}
   ],
   body:[
    {book:String.raw`<p>احسب فرق الجهد عبر الطرفين ab بحيث يكون فرق الجهد عبر المقاومة 2 Ω هو 10V كما موضح في الشكل (3-38).</p>
     <p><b>الحل:</b> التيار الداخل إلى الدائرة الموضحة في الشكل (3-38) يكون</p>
     $$I=\frac{10}{2}=5\ \text{A}\qquad R_p=\frac{6\times12}{6+12}=4\ \Omega\qquad R_T=1+2+4=7\ \Omega\qquad V_{ab}=I\times R_T=7\times5=35\ \text{V}$$`,ref:'ص 88'},
    {tip:String.raw`<p>المقاومة 2 Ω على التوالي مع خط الدخل، فتيارها هو التيار الكلي I. بعد أن عرفناه، نحسب المقاومة الكلية (1 + 2 + مكافئ التوازي 4 = 7 Ω)، ثم قانون أوم للدائرة كلها.</p>`},
    {html:String.raw`<div class="w-row"><button class="btn pri" type="button" onclick="var b=document.querySelector('.ltabs button[data-tab=examples]');if(b)b.click()">افتح الحل خطوة بخطوة في «الأمثلة المحلولة»</button></div>`}
   ]},

  {st:6,short:'مثال <span class="ltr">(3-30)</span>',title:'مثال <span class="ltr">(3-30)</span>: جهد مجموعة التوازي وتياراها',ref:'ص 88',
   q:String.raw`بعد أن عرفنا \(V_{ab}=35\ \text{V}\): كم يبقى من الجهد لمجموعة التوازي؟`,
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مقاومتان 1 و 2 أوم على التوالي مع مجموعة 6 و 12 أوم على التوازي بين الطرفين a و b" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><circle cx="36" cy="100" r="5.5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="36" cy="230" r="5.5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="26" y="105" text-anchor="end" font-size="14" fill="#2C4A40" font-weight="700">a</text><text x="26" y="235" text-anchor="end" font-size="14" fill="#2C4A40" font-weight="700">b</text><text x="36" y="130" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">+</text><text x="36" y="214" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700">−</text><text x="40" y="170" text-anchor="start" font-size="13" fill="#4FB3A9" font-weight="700">V</text><path d="M41 100 L60 100" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M60 100 L68.2 100 L71.5 107 L77.9 93 L84.3 107 L90.7 93 L97.1 107 L103.5 93 L106.8 100 L115 100" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="88" y="84" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">1 Ω</text><g data-tip="المقاومة ⟦2 Ω⟧: الجهد عليها معلوم ⟦10 V⟧، ومنه نعرف التيار ⟦I⟧."><path d="M125 100 L133.2 100 L136.5 107 L142.9 93 L149.3 107 L155.7 93 L162.1 107 L168.5 93 L171.8 100 L180 100" fill="none" stroke="#E8735A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><text x="152" y="84" text-anchor="middle" font-size="12" fill="#E8735A" font-weight="700">2 Ω</text><text x="152" y="68" text-anchor="middle" font-size="12" fill="#E8735A" font-weight="700">10 V</text><rect x="120" y="54" width="66" height="56" fill="transparent"/></g><path d="M115 100 L125 100" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M180 100 L230 100" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="⟦I⟧: تيار المقاومتين على التوالي، وهو نفسه التيار الكلي الداخل إلى مجموعة التوازي."><path d="M195 100L204 100" stroke="#E8735A" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M215 100L204 105.5L204 94.5Z" fill="#E8735A"/><text x="205" y="88" text-anchor="middle" font-size="13" fill="#E8735A" font-weight="700">I</text><rect x="190" y="72" width="32" height="36" fill="transparent"/></g><circle cx="230" cy="100" r="4" fill="#2C4A40"/><path d="M230 100 L300 100" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="230" cy="230" r="4" fill="#2C4A40"/><path d="M41 230 L300 230" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M230 100 L230 143 L223 146.7 L237 154 L223 161.3 L237 168.7 L223 176 L237 183.3 L230 187 L230 230" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="242" y="160" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700">6 Ω</text><path d="M230 120L230 125" stroke="#E8735A" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M230 136L224.5 125L235.5 125Z" fill="#E8735A"/><text x="222" y="134" text-anchor="end" font-size="11.5" fill="#E8735A" font-weight="700">I<tspan baseline-shift="sub" font-size="75%">1</tspan></text><path d="M300 100 L300 143 L293 146.7 L307 154 L293 161.3 L307 168.7 L293 176 L307 183.3 L300 187 L300 230" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="312" y="160" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700">12 Ω</text><path d="M300 120L300 125" stroke="#E8735A" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M300 136L294.5 125L305.5 125Z" fill="#E8735A"/><text x="292" y="134" text-anchor="end" font-size="11.5" fill="#E8735A" font-weight="700">I<tspan baseline-shift="sub" font-size="75%">2</tspan></text><text x="180" y="50" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">الشكل <tspan direction="ltr" unicode-bidi="embed">(3-38)</tspan></text><text x="180" y="272" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">V<tspan baseline-shift="sub" font-size="75%">6Ω</tspan> = 35 − 10 − 5 = 20 V</text></svg>`,
   cap:'نفس الشكل <span class="ltr">(3-38)</span>، وتحته طرح جهدي مقاومتي التوالي.<br><b>مرّر المؤشر على المقاومة البرتقالية وسهم I (أو المسهما في الجوال) لتتذكر قيمتيهما.</b>',
   side:[
    {predict:{q:String.raw`كم التيار \(I_1\) في المقاومة 6 Ω إذا كان جهدها 20 V؟`,opts:[
     ['3.333 A',true,String.raw`\(I_1=20/6=3.333\ \text{A}\).`],
     ['1.667 A',false,String.raw`هذا \(I_2=20/12\) في المقاومة 12 Ω.`],
     ['5 A',false,'هذا التيار الكلي قبل أن يتوزع على الفرعين.']]}}
   ],
   body:[
    {book:String.raw`<p>في مثال (3-29)، احسب فرق الجهد عبر المقاومة 6 Ω ومن ثم احسب التيارين \(I_1\) و \(I_2\).</p>
     <p><b>الحل:</b></p>
     $$V_{2\Omega}=10\ \text{V},\qquad V_{1\Omega}=I\times1=5\times1=5\ \text{V}$$
     $$V_{6\Omega}=V_{ab}-V_{2\Omega}-V_{1\Omega}=35-10-5=20\ \text{V}$$
     $$I_1=\frac{20}{6}=3.333\ \text{A}\qquad I_2=\frac{20}{12}=\frac{10}{6}\ \text{A}$$`,ref:'ص 88'},
    {tip:String.raw`<p>جهد الطرفين يتوزع على أجزاء التوالي: \(5+10+20=35\ \text{V}\). وجهد المقاومة 6 Ω هو نفسه جهد 12 Ω لأنهما على التوازي.</p>
     <p>تحقق: \(I_1+I_2=3.333+1.667=5\ \text{A}=I\) ✓ (يترك الكتاب \(I_2\) كسراً \(10/6\approx1.667\ \text{A}\)).</p>`},
    {html:String.raw`<div class="w-row"><button class="btn pri" type="button" onclick="var b=document.querySelector('.ltabs button[data-tab=examples]');if(b)b.click()">افتح الحل خطوة بخطوة في «الأمثلة المحلولة»</button></div>`}
   ]},

  {st:7,short:'مثال <span class="ltr">(3-31)</span>',title:'مثال <span class="ltr">(3-31)</span>: مصابيح <span class="ltr">110 V</span> من منبع <span class="ltr">230 V</span>',ref:'ص 89',
   q:'مصابيح صُممت لجهد 110 V ومعنا منبع 230 V. كيف نمنع الجهد الزائد عنها؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="أربعة مصابيح على التوازي مع مقاومة على التوالي من منبع 230 فولت" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><circle cx="36" cy="90" r="5.5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="36" cy="240" r="5.5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="36" y="120" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">+</text><text x="36" y="226" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700">−</text><text x="44" y="170" text-anchor="start" font-size="12.5" fill="#2C4A40" font-weight="700">230 V</text><path d="M41 90 L80 90" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M91 90L98 90" stroke="#E8735A" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M109 90L98 95.5L98 84.5Z" fill="#E8735A"/><text x="100" y="78" text-anchor="middle" font-size="13" fill="#E8735A" font-weight="700">I</text><g data-tip="المقاومة ⟦R⟧ على التوالي مع الخط: تأخذ الفرق بين جهد المنبع وجهد المصابيح."><path d="M115 90 L124 90 L127.5 97 L134.5 83 L141.5 97 L148.5 83 L155.5 97 L162.5 83 L166 90 L175 90" fill="none" stroke="#E8735A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><text x="145" y="74" text-anchor="middle" font-size="14" fill="#E8735A" font-weight="700">R</text><rect x="110" y="58" width="70" height="46" fill="transparent"/></g><path d="M80 90 L115 90" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M175 90 L200 90 L200 120" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M41 240 L200 240 L200 210" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M150 120 L330 120" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M150 210 L330 210" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M170 120 L170 152" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="170" cy="165" r="13" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M160.9 155.9L179.1 174.1M179.1 155.9L160.9 174.1" stroke="#2C4A40" stroke-width="2"/><path d="M170 178 L170 210" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M220 120 L220 152" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="220" cy="165" r="13" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M210.9 155.9L229.1 174.1M229.1 155.9L210.9 174.1" stroke="#2C4A40" stroke-width="2"/><path d="M220 178 L220 210" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M270 120 L270 152" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="270" cy="165" r="13" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M260.9 155.9L279.1 174.1M279.1 155.9L260.9 174.1" stroke="#2C4A40" stroke-width="2"/><path d="M270 178 L270 210" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M320 120 L320 152" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="320" cy="165" r="13" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M310.9 155.9L329.1 174.1M329.1 155.9L310.9 174.1" stroke="#2C4A40" stroke-width="2"/><path d="M320 178 L320 210" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="الجهد على المصابيح الأربعة (كلها على التوازي): ⟦110 V⟧، وكل مصباح ⟦60 W⟧."><text x="245" y="112" text-anchor="middle" font-size="12.5" fill="#4FB3A9" font-weight="700">110 V</text><rect x="220" y="98" width="50" height="18" fill="transparent"/></g><text x="180" y="50" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700" direction="rtl">الشكل <tspan direction="ltr" unicode-bidi="embed">(3-39)</tspan>: أربعة على التوازي</text><circle cx="200" cy="120" r="4" fill="#2C4A40"/><circle cx="200" cy="210" r="4" fill="#2C4A40"/><text x="180" y="280" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700">V<tspan baseline-shift="sub" font-size="75%">R</tspan> = 230 − 110 = 120 V</text></svg>`,
   cap:'الشكل <span class="ltr">(3-39)</span>: أربعة مصابيح على التوازي ومقاومة R على التوالي.<br><b>مرّر المؤشر على R وعلى جهد المصابيح (أو المسهما في الجوال) لتعرف معناهما.</b>',
   side:[
    {predict:{q:'كم الجهد الذي يجب أن تأخذه المقاومة R؟',opts:[
     ['110 V',false,'هذا جهد المصابيح.'],
     ['230 V',false,'هذا جهد المنبع كله؛ لو أخذته R لم يبق للمصابيح شيء.'],
     ['120 V',true,String.raw`\(V_R=230-110=120\ \text{V}\): الفرق بين جهد المنبع وجهد المصابيح.`]]}}
   ],
   body:[
    {book:String.raw`<p>نريد تشغيل أربعة مصابيح 60W و 110V من منبع 230V، أحسب قيمة المقاومة المتصلة على التوالي مع الخط حتى لا يزيد الجهد الداخلي عبر المصابيح عن 110V.</p>
     <p><b>الحل:</b> القدرة الإجمالية المسحوبة من المنبع في الدائرة المبينة في الشكل (3-39) تكون</p>
     $$P=4\times60=240\ \text{W}$$
     <p>ويكون تيار الدخل</p>
     $$I=\frac{P}{V}=\frac{240}{110}=2.1818\ \text{A}$$
     <p>وفرق الجهد عبر المقاومة R المتصلة على التوالي يكون</p>
     $$V_R=230-110=120\ \text{V}$$
     <p>وبالتالي تصبح المقاومة R هي</p>
     $$R=\frac{V_R}{I}=\frac{120}{2.1818}=55\ \Omega$$`,ref:'ص 89'},
    {watch:String.raw`<p>عبارة «القدرة الإجمالية المسحوبة من المنبع» المقصود بها القدرة المسحوبة <b>بواسطة المصابيح</b> (240 W)؛ أما القدرة المسحوبة من المنبع فتشمل قدرة R أيضاً.</p>`},
    {tip:String.raw`<p>المصابيح على التوازي فجهدها واحد (110 V)، وتيار الدخل هو مجموع تياراتها، ويمر كله في R. لذلك نحسب التيار من القدرة الكلية للمصابيح وجهدها.</p>`},
    {html:String.raw`<div class="w-row"><button class="btn pri" type="button" onclick="var b=document.querySelector('.ltabs button[data-tab=examples]');if(b)b.click()">افتح الحل خطوة بخطوة في «الأمثلة المحلولة»</button></div>`}
   ]},

  {st:8,short:'مثال <span class="ltr">(3-32)</span>',title:'مثال <span class="ltr">(3-32)</span>: طريقة بديلة… أيهما أفضل؟',ref:'ص 89–90',
   q:'نفس المصابيح الأربعة، لكن في فرعين كل منهما مصباحان على التوالي. أي الطريقتين تضيّع قدرة أقل في المقاومة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="أربعة مصابيح في فرعين كل فرع مصباحان على التوالي مع مقاومة من منبع 230 فولت" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><circle cx="36" cy="90" r="5.5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="36" cy="240" r="5.5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="36" y="120" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">+</text><text x="36" y="226" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700">−</text><text x="44" y="170" text-anchor="start" font-size="12.5" fill="#2C4A40" font-weight="700">230 V</text><path d="M41 90 L80 90" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M91 90L98 90" stroke="#E8735A" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M109 90L98 95.5L98 84.5Z" fill="#E8735A"/><text x="100" y="78" text-anchor="middle" font-size="13" fill="#E8735A" font-weight="700">I</text><g data-tip="المقاومة ⟦R⟧ على التوالي مع الخط: تأخذ الفرق بين جهد المنبع وجهد المصابيح."><path d="M115 90 L124 90 L127.5 97 L134.5 83 L141.5 97 L148.5 83 L155.5 97 L162.5 83 L166 90 L175 90" fill="none" stroke="#E8735A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><text x="145" y="74" text-anchor="middle" font-size="14" fill="#E8735A" font-weight="700">R</text><rect x="110" y="58" width="70" height="46" fill="transparent"/></g><path d="M80 90 L115 90" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M175 90 L200 90 L200 120" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M41 240 L200 240 L200 210" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M160 120 L300 120" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M160 210 L300 210" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M200 120 L200 132" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="200" cy="145" r="11" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M192.3 137.3L207.7 152.7M207.7 137.3L192.3 152.7" stroke="#2C4A40" stroke-width="2"/><path d="M200 156 L200 174" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="200" cy="187" r="11" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M192.3 179.3L207.7 194.7M207.7 179.3L192.3 194.7" stroke="#2C4A40" stroke-width="2"/><path d="M200 198 L200 210" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M280 120 L280 132" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="280" cy="145" r="11" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M272.3 137.3L287.7 152.7M287.7 137.3L272.3 152.7" stroke="#2C4A40" stroke-width="2"/><path d="M280 156 L280 174" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="280" cy="187" r="11" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M272.3 179.3L287.7 194.7M287.7 179.3L272.3 194.7" stroke="#2C4A40" stroke-width="2"/><path d="M280 198 L280 210" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="فرعان على التوازي، كل فرع مصباحان على التوالي، والجهد على المجموعة ⟦220 V⟧ (⟦110 V⟧ لكل مصباح)."><text x="240" y="112" text-anchor="middle" font-size="12.5" fill="#4FB3A9" font-weight="700">220 V</text><rect x="215" y="98" width="50" height="18" fill="transparent"/></g><text x="180" y="50" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">الشكل <tspan direction="ltr" unicode-bidi="embed">(3-40)</tspan>: فرعان، مصباحان في كل فرع</text><circle cx="200" cy="120" r="4" fill="#2C4A40"/><circle cx="200" cy="210" r="4" fill="#2C4A40"/><text x="180" y="280" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700">V<tspan baseline-shift="sub" font-size="75%">R</tspan> = 230 − 220 = 10 V</text></svg>`,
   cap:'الشكل <span class="ltr">(3-40)</span>: جهد المجموعة <span class="ltr">220 V</span>.<br><b>مرّر المؤشر على R وعلى جهد المجموعة (أو المسهما في الجوال) لتعرف معناهما.</b>',
   side:[
    {predict:{q:'في الطريقة الثانية، إذا احترق مصباح واحد، كم مصباحاً يبقى مضيئاً؟',opts:[
     ['ثلاثة',false,'المصباح المحترق يفتح فرعه كله، لأن مصباحي الفرع على التوالي.'],
     ['مصباحان فقط',true,'نص الكتاب: «ولكن إن احترق مصباح فلن يعمل إلا مصباحان فقط» — الفرع الآخر.'],
     ['لا شيء',false,'الفرع الآخر ما زال مغلقاً فيعمل مصباحاه.']]}}
   ],
   body:[
    {book:String.raw`<p>ثمة طريقة بديلة لتشغيل مصابيح المثال (3-31) بتوصيلها كما في الشكل (3-40) مع مقاومة على التوالي احسب قيمة المقاومة التي على التوالي وحدد أي الطريقتين أفضل مع تعليل ذلك.</p>
     <p><b>الحل:</b> في هذه الحالة</p>
     $$I=\frac{P}{V_L}=\frac{240}{220}=1.0909\ \text{A}\qquad V_R=230-220=10\ \text{V}=R\times I$$
     <p>وهكذا نحصل على R</p>
     $$R=\frac{10}{1.0909}=9.167\ \Omega$$
     <p>القدرة المفقودة \((I^2R)\) في طريقة المثال (3-31) هي \((P_{loss}=120^2/55=261.82\ \text{W})\)</p>
     <p>والقدرة المفقودة في الطريقة التي يعتمدها المثال الحالي هي \((P_{loss}=10^2/9.167=10.9\ \text{W})\)</p>
     <p>وهكذا تكون الطريقة الثانية أكثر فاعلية ولكن إن احترق مصباح فلن يعمل إلا مصباحان فقط.</p>`,ref:'ص 89–90'},
    {title:'قارن الطريقتين (أرقام المثالين)',widget:(el,B)=>{
      const C={a:{t:'الطريقة الأولى (3-31)',R:'55 Ω',VR:'120 V',I:'2.1818 A',L:'261.82 W',b:'تبقى ثلاثة مصابيح مضيئة (كل مصباح في فرع مستقل).'},b:{t:'الطريقة الثانية (3-32)',R:'9.167 Ω',VR:'10 V',I:'1.0909 A',L:'10.9 W',b:'ينطفئ مصباحا الفرع نفسه، ولا يعمل إلا مصباحان.'}};let k='a';
      const draw=()=>{const c=C[k];el.innerHTML=`<div class="w-row" style="margin-top:0"><span class="w-l">الطريقة:</span><span class="mseg">${Object.entries(C).map(([v,o])=>`<button type="button" data-k="${v}" aria-pressed="${v===k}" style="font-family:var(--font)">${o.t}</button>`).join('')}</span></div>
        <table class="tt" style="margin-top:12px"><tbody><tr><td>المقاومة على التوالي R</td><td><b class="ltr">${c.R}</b></td></tr><tr><td>جهد المقاومة V<sub>R</sub></td><td><b class="ltr">${c.VR}</b></td></tr><tr><td>تيار الدخل I</td><td><b class="ltr">${c.I}</b></td></tr><tr><td>القدرة المفقودة في R</td><td><b class="ltr">${c.L}</b></td></tr><tr><td>إذا احترق مصباح</td><td>${c.b}</td></tr></tbody></table>`;
       el.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{k=b.dataset.k;draw()})};draw();
    }},
    {tip:String.raw`<p>«أكثر فاعلية» لأن المقاومة في الطريقة الثانية تأخذ 10 V فقط من 230 V فتضيع فيها قدرة قليلة (10.9 W)، بينما في الأولى تأخذ 120 V فتضيع فيها 261.82 W — أكثر من قدرة المصابيح نفسها (240 W).</p>`},
    {watch:String.raw`<p>كُتب في الكتاب «القدرة المفقودة \((I^2R)\)» بينما الحساب بالصيغة \(V^2/R\) — والصيغتان متكافئتان، تعطيان نفس الرقم.</p>`,fix:true},
    {html:String.raw`<div class="w-row"><button class="btn pri" type="button" onclick="var b=document.querySelector('.ltabs button[data-tab=examples]');if(b)b.click()">افتح الحل خطوة بخطوة في «الأمثلة المحلولة»</button></div>`}
   ]},

  {recap:[
   String.raw`الدائرة المفتوحة: جهد بين الطرفين المفتوحين (\(V_{ab}=E\)) وتيار صفر (ص 84).`,
   String.raw`دائرة القصر: جهد صفر بين الطرفين المقصورين ويمر بينهما تيار؛ والمقاومة المقصورة لا يمر فيها تيار، والتيار المسحوب من المصدر يكبر جداً (ص 84–85).`,
   String.raw`التوصيل المركب: \(R_T=R_S+R_P\) — مجموع مقاومات التوالي + مكافئ مقاومات التوازي (ص 87).`,
   String.raw`في الدوائر المركبة: ابدأ من المعلوم (جهد أو تيار مقاومة)، وتيار مقاومات التوالي هو التيار الكلي، وجهد فروع التوازي واحد (ص 88–90).`]}
],
 theory:[
  {h:'الدوائر المفتوحة ودوائر القصر (Open and Short Circuits)',ref:'ص 84',html:'<p>«الدائرة الكهربائية المفتوحة يكون لها <b>فرق جهد بين طرفيها المفتوحين</b>، بينما يكون <b>التيار المار فيها دائماً مساوياً للصفر</b>. ويبين الشكل (3-33) دائرة كهربائية مفتوحة عند الطرفين a و b بينما يكون فرق الجهد بين طرفي الدائرة: \\(V_{ab}=E\\) والتيار \\(I=0\\).»</p>'},
  {fig:'(3-33)',ref:'ص 84',caption:'دائرة مفتوحة عند الطرفين a و b: التيار صفر، والجهد بين الطرفين يساوي جهد البطارية E',draw:()=>box(fig333(),440)},
  {html:`<p>«أما بالنسبة لدائرة القصر فيكون <b>فرق الجهد بين الطرفين المقصورين دائماً مساوياً للصفر</b> بينما يمر بين هذين الطرفين تيار كهربائي. والدائرة الموضحة في الشكل (3-34) تبين أن القصر حدث بين طرفي المقاومة R، وبالتالي يكون فرق الجهد بين طرفي المقاومة بعد حدوث القصر هو» \\(V=I\\times R=(I)\\times(0)=0\\) V. «ويكون التيار بعد حدوث القصر … هو» <span class="ref">ص 84–85</span></p>$$I=\\frac{E}{R}=\\frac{E}{0}\\rightarrow\\infty\\ \\text{A}$$`},
  {fig:'(3-34)',ref:'ص 85',caption:'يساراً: E = 10 V وفيوز 10 A ومقاومة 2 Ω فيمر 5 A. يميناً: سلك يقصر طرفي R، فلا يمر في R تيار (I<sub>R</sub> = 0 A) والجهد عليها تقريباً صفر',draw:()=>fig334()},
  {note:NOTE_ADD+'المقصود بـ \\(E/0\\): بعد القصر تصبح المقاومة التي تراها البطارية هي مقاومة سلك القصر فقط، وهي صغيرة جداً، فيكبر التيار جداً. أما المقاومة R نفسها فلا يمر فيها تيار (\\(I_R=0\\)) لأن التيار يفضّل طريق السلك. لهذا يوجد في الشكل <b>فيوز 10 A</b>: في الحالة العادية يمر 5 A فيبقى سليماً، وعند القصر يتجاوز التيار 10 A فينصهر ويفصل الدائرة قبل أن تتلف البطارية أو الأسلاك. جرّب ذلك في المختبر.'},
  {h:'مثال (3-28)',ref:'ص 85–86',html:'<p>«احسب قيمة التيار I وفرق الجهد V للدائرة المبينة في الشكل (3-35)، ثم أعد حساب التيار I وفرق الجهد V بعد حدوث قصر بين طرفي المقاومة \\(R_2\\).»</p><p>«حيث إن الدائرة مفتوحة عند الطرفين فيكون التيار الكلي I هو التيار المار في المقاومتين \\(R_1\\) و \\(R_2\\) فقط حيث إن التيار المار في المقاومة \\(R_3\\) يكون مساوياً للصفر»: \\(R_T=2+10=12\\ \\Omega\\)، \\(I=6/12=0.5\\) A، \\(V=0.5\\times10=5\\) V. وبعد القصر \\(R_T=R_1\\): \\(I=6/2=3\\) A و \\(V=I\\times0=0\\) V.</p>'},
  {fig:'(3-35)',ref:'ص 85',caption:'E = 6 V، R1 = 2 Ω، R2 = 10 Ω، و R3 = 3 Ω إلى طرف مفتوح؛ V بين الطرفين المفتوحين',draw:()=>box(c35({}),430)},
  {fig:'(3-36)',ref:'ص 86',caption:'نفس الدائرة بعد قصر R2 بسلك: يدور التيار I في الحلقة اليسرى (E و R1) فقط',draw:()=>box(c35({s2:1,loop:1}),430)},
  {note:NOTE_ADD+'لماذا \\(V=0\\) وليس جهد R<sub>3</sub>؟ لأن R<sub>3</sub> لا يمر فيها تيار (الطرف مفتوح)، فلا هبوط عليها، فجهد الطرفين = جهد النقطة بين R<sub>1</sub> و R<sub>2</sub>، وهذه النقطة صارت متصلة بالخط السفلي بسلك القصر.'},
  {h:'التوصيل المركب',ref:'ص 87',html:'<p>«يسمى هذا النوع من التوصيل بهذا الاسم حيث أنه يتكون من <b>دوائر التوالي والتوازي معاً</b> كما هو موضح في الشكل (3-37) وبالتالي يمكن إيجاد المقاومة الكلية \\(R_T\\) لهذه الدائرة كما يلي:»</p>$$R_T=R_S+R_P$$<p>«حيث المقاومة \\(R_S\\) هي مجموع المقاومات الموصلة على التوالي، والمقاومة \\(R_P\\) هي المقاومة المكافئة للمقاومات الموصلة على التوازي.» في الشكل (3-37): \\(R_S=R_1\\)، \\(R_P=\\frac{R_2\\times R_3}{R_2+R_3}\\)، إذن</p>$$R_T=R_S+R_P=R_1+\\frac{R_2\\times R_3}{R_2+R_3}$$'},
  {fig:'(3-37)',ref:'ص 87',caption:'R1 على التوالي مع مجموعة (R2 و R3 على التوازي)',draw:()=>box(fig337(),440)},
  {h:'مثال (3-29) ومثال (3-30)',ref:'ص 88',html:'<p>(3-29): «احسب فرق الجهد عبر الطرفين ab بحيث يكون فرق الجهد عبر المقاومة 2 Ω هو 10V كما موضح في الشكل (3-38).» \\(I=10/2=5\\) A، \\(R_p=\\frac{6\\times12}{6+12}=4\\ \\Omega\\)، \\(R_T=1+2+4=7\\ \\Omega\\)، \\(V_{ab}=7\\times5=35\\) V.</p><p>(3-30): «في مثال (3-29)، احسب فرق الجهد عبر المقاومة 6 Ω ومن ثم احسب التيارين \\(I_1\\) و \\(I_2\\).» \\(V_{6\\Omega}=35-10-5=20\\) V، \\(I_1=20/6=3.333\\) A، \\(I_2=20/12=10/6\\) A.</p>'},
  {fig:'(3-38)',ref:'ص 88',caption:'مقاومتان 1 Ω و 2 Ω على التوالي مع مجموعة 6 Ω و 12 Ω على التوازي (القيم بالأوم بلا وحدة في الرسم)',draw:()=>box(fig338(),420)},
  {h:'مثال (3-31): مصابيح 110 V من منبع 230 V',ref:'ص 89',html:'<p>«نريد تشغيل أربعة مصابيح 60W و 110V من منبع 230V، أحسب قيمة المقاومة المتصلة على التوالي مع الخط حتى لا يزيد الجهد الداخلي عبر المصابيح عن 110V.» القدرة \\(P=4\\times60=240\\) W، التيار \\(I=240/110=2.1818\\) A، \\(V_R=230-110=120\\) V، \\(R=120/2.1818=55\\ \\Omega\\).</p>'},
  {fig:'(3-39)',ref:'ص 89',caption:'أربعة مصابيح على التوازي (جهدها 110 V) على التوالي مع المقاومة R من منبع 230 V',draw:()=>box(lampFig('p4'),480)},
  {h:'مثال (3-32): طريقة بديلة',ref:'ص 89–90',html:'<p>«ثمة طريقة بديلة لتشغيل مصابيح المثال (3-31) بتوصيلها كما في الشكل (3-40) مع مقاومة على التوالي احسب قيمة المقاومة التي على التوالي وحدد أي الطريقتين أفضل مع تعليل ذلك.» \\(I=240/220=1.0909\\) A، \\(V_R=230-220=10\\) V، \\(R=10/1.0909=9.167\\ \\Omega\\). القدرة المفقودة في طريقة (3-31): \\(120^2/55=261.82\\) W، وفي هذه الطريقة: \\(10^2/9.167=10.9\\) W.</p><p>«وهكذا تكون الطريقة الثانية أكثر فاعلية ولكن إن احترق مصباح فلن يعمل إلا مصباحان فقط.»</p>'},
  {fig:'(3-40)',ref:'ص 90',caption:'المصابيح الأربعة في فرعين متوازيين، كل فرع مصباحان على التوالي (جهد المجموعة 220 V)، مع R من منبع 230 V',draw:()=>box(lampFig('s2'),480)},
  {note:NOTE_ADD+'«أكثر فاعلية» لأن المقاومة في الطريقة الثانية تأخذ 10 V فقط من 230 V فتضيع فيها قدرة قليلة، بينما في الأولى تأخذ 120 V. الكفاءة تقريباً: \\(240/(240+261.8)=48\\%\\) في الأولى، و \\(240/(240+10.9)=96\\%\\) في الثانية. وفي المختبر اعتبرنا مقاومة المصباح ثابتة \\(110^2/60=201.7\\ \\Omega\\) (في الواقع مقاومة الفتيلة تتغير مع حرارتها).'},
  {err:`<div class="fixnote"><ul>
   <li><b>ص 85:</b> عبارة «\\(I=E/R=E/0\\rightarrow\\infty\\)» تخلط بين تيار R (وهو صفر كما في الشكل) والتيار المسحوب من البطارية (الذي يكبر جداً). وضّحناها في الملاحظة أعلاه.</li>
   <li><b>مثال (3-31) ص 89:</b> «القدرة الإجمالية المسحوبة من المنبع» والمقصود المسحوبة بواسطة المصابيح (240 W)؛ أما المسحوبة من المنبع فتشمل قدرة R أيضاً.</li>
   <li><b>مثال (3-32) ص 90:</b> كُتب «القدرة المفقودة (I²R)» بينما الحساب بالصيغة \\(V^2/R\\) — والصيغتان متكافئتان.</li></ul></div>`}
 ],
 lab:(el)=>{
  let mode='f35',s1=0,s2=0,so=0,sR=0,open=0,blown=0,over=0;let arr='p4',R=55;const dead=[0,0,0,0];const did={};
  el.innerHTML=`<div id="l9tp"></div><div class="grid cb-lab">
   <div class="panel c12"><h2>دائرة مفتوحة ودائرة قصر <small>مبنية على الأشكال (3-33) إلى (3-36) ص 84–86</small></h2>
    <div class="cb-row">${segHTML('md',[['f35','دائرة الشكل (3-35)'],['f34','دائرة الفيوز — الشكل (3-34)']],mode)}</div>
    <div class="cb-row" id="l9sw"></div>
    <div class="svgbox" id="l9c" style="max-width:520px;margin-inline:auto"></div>
    <div class="facts" id="l9f"></div><div id="l9msg"></div></div>
   <div class="panel c12"><h2>تشغيل مصابيح 110 V من 230 V <small>مبنية على الشكلين (3-39) و(3-40) ص 89–90</small></h2>
    <div class="cb-row">${segHTML('ar',[['p4','الطريقة الأولى (3-39)'],['s2','الطريقة الثانية (3-40)']],arr)}</div>
    ${sl('l9R','المقاومة على التوالي R',0,100,0.001,R)}
    <div class="cb-row"><button class="btn" id="l9r55">R = 55 Ω (مثال 3-31)</button><button class="btn" id="l9r9">R = 9.167 Ω (مثال 3-32)</button><button class="btn" id="l9fix">أصلح كل المصابيح</button></div>
    <div class="svgbox" id="l9l" style="max-width:520px;margin-inline:auto"></div>
    <p class="sub">اضغط على أي مصباح لتجعله «محترقاً» (دائرة مفتوحة). المصباح: 60 W عند 110 V، واعتبرنا مقاومته ثابتة \\(110^2/60=201.7\\ \\Omega\\) (توضيح — ليس من الكتاب).</p>
    <div class="facts">${fact('تيار الخط I','l9I')}${fact('جهد المقاومة V<sub>R</sub>','l9VR')}${fact('جهد مجموعة المصابيح','l9VL')}${fact('القدرة المفقودة في R','l9PR')}${fact('قدرة المصابيح','l9PL')}${fact('الكفاءة (قدرة المصابيح ÷ قدرة المنبع)','l9eta')}</div>
    <div id="l9lmsg"></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l9st"></ol></div></div>`;
  B.math(el);const $=s=>el.querySelector(s);
  const TP=B.params($('#l9tp'),'u3-l9',[{k:'rs',label:'مقاومة سلك القصر (توضيحية: السلك الحقيقي ليس صفراً تماماً)',unit:'Ω',value:0.01,min:0.0001,max:5,step:0.001}],()=>{blown=0;over=0;sim()});
  const RL=110*110/60;
  const swUI=()=>{$('#l9sw').innerHTML=mode==='f35'?swHTML('l9s1','قصر R1','سلك بين طرفي R1',s1)+swHTML('l9s2','قصر R2','سلك بين طرفي R2 (المثال)',s2)+swHTML('l9so','قصر الطرفين','سلك بين طرفي V',so)
     :swHTML('l9sR','قصر R','سلك بين طرفي R',sR)+swHTML('l9op','افصل R','الطرفان a و b مفتوحان (3-33)',open)+'<button class="btn" id="l9new">استبدل الفيوز</button>';
   el.querySelectorAll('#l9sw .sw').forEach(b=>b.onclick=()=>{const k=b.id.slice(2);if(k==='s1')s1^=1;if(k==='s2')s2^=1;if(k==='so')so^=1;if(k==='sR')sR^=1;if(k==='op')open^=1;b.setAttribute('aria-pressed',String(b.getAttribute('aria-pressed')!=='true'));sim()});
   const nb=$('#l9new');if(nb)nb.onclick=()=>{blown=0;over=0;sim()}};
  segBind(el,'md',v=>{mode=v;swUI();sim()});
  const sim=()=>{const rs=TP.v.rs;let h='',msg='';
   if(mode==='f35'){const E=6,els=[{t:'V',a:1,b:0,v:E},{t:'R',a:1,b:2,r:2},{t:'R',a:2,b:0,r:10},{t:'R',a:2,b:3,r:3}];if(s1)els.push({t:'R',a:1,b:2,r:rs});if(s2)els.push({t:'R',a:2,b:0,r:rs});if(so)els.push({t:'R',a:3,b:0,r:rs});
     const r=mna(4,els);const I=r.i[0],IR2=r.i[2],IR3=r.i[3],V=r.v[3];
     $('#l9c').innerHTML=c35({s1,s2,so,live:{I,IR2,IR3,V}});
     h=[['تيار البطارية I',fm(sig(I,4))+' A'],['جهد الطرفين V',fm(sig(V,4))+' V'],['تيار R<sub>2</sub>',fm(sig(IR2,4))+' A'],['تيار R<sub>3</sub>',fm(sig(IR3,4))+' A'],['جهد R<sub>2</sub>',fm(sig(r.v[2],4))+' V']];
     if(!s1&&!s2&&!so)msg='الطرفان مفتوحان: لا تيار في R<sub>3</sub>، والجهد V = جهد R<sub>2</sub> (مثال 3-28).';else if(s2&&!s1&&!so)msg='R<sub>2</sub> مقصورة: R<sub>T</sub> = R<sub>1</sub> فيصير التيار تقريباً 3 A والجهد V ≅ 0 (الشكل 3-36). القيمة ليست صفراً تماماً لأن لسلك القصر مقاومة صغيرة.';else if(so&&!s2)msg='قصر بين الطرفين: صار V ≅ 0 ويمر تيار في R<sub>3</sub> وسلك القصر.';
   }else{const E=10;let I=0,VR=0,Vab=0;
     if(!blown){const els=[{t:'V',a:1,b:0,v:E},{t:'R',a:1,b:2,r:1e-6}];if(!open)els.push({t:'R',a:2,b:0,r:2});if(sR)els.push({t:'R',a:2,b:0,r:rs});const r=mna(3,els);I=r.i[0];Vab=r.v[2];if(I>10){blown=1;did.blown=1;over=I}}
     if(blown){I=0;Vab=0}
     const IR=!blown&&!open?Vab/2:0;
     $('#l9c').innerHTML=sc34({live:1,short:sR,open,blown,I,lbl:`I = ${blown?'0':fm(sig(I,4))} A`});
     h=[['تيار الدائرة I',fm(sig(I,4))+' A'],['تيار المقاومة I<sub>R</sub>',fm(sig(IR,4))+' A'],['الجهد بين طرفي R (أو a–b)',fm(sig(blown?0:Vab,4))+' V'],['حالة الفيوز',blown?'منصهر':'سليم']];
     if(blown)msg=`<span class="cb-chip warn">انصهر الفيوز!</span> لحظة القصر حاول التيار أن يصل إلى <span class="ltr">${fm(sig(over,4))} A</span> ≈ 10 V ÷ ${fm(TP.v.rs)} Ω (أكبر من 10 A)، فانصهر الفيوز وانقطع التيار. افصل القصر ثم «استبدل الفيوز».`;
     else if(open)msg='الطرفان a و b مفتوحان: I = 0 والجهد بينهما يساوي E = 10 V (الشكل 3-33).';else if(!sR)msg='الحالة العادية: I = 10/2 = 5 A أقل من 10 A، فالفيوز سليم.'}
   $('#l9f').innerHTML=h.map(([a,b])=>`<div class="fact"><span>${a}</span><b>${b}</b></div>`).join('');$('#l9msg').innerHTML=msg?`<div class="callout">${msg}</div>`:'';steps&&steps.check()};
  const lamps=()=>{$('#l9R-v').textContent=fm(R,3)+' Ω';let I,VL,P=[0,0,0,0];
   if(arr==='p4'){const n=dead.filter(d=>!d).length;if(!n){I=0;VL=230}else{const Rg=RL/n;I=230/(R+Rg);VL=I*Rg;dead.forEach((d,k)=>{P[k]=d?0:VL*VL/RL})}}
   else{const ok=[!dead[0]&&!dead[1],!dead[2]&&!dead[3]],n=ok.filter(Boolean).length;if(!n){I=0;VL=230}else{const Rg=2*RL/n;I=230/(R+Rg);VL=I*Rg;[0,1,2,3].forEach(k=>{P[k]=ok[k<2?0:1]?(VL/2)*(VL/2)/RL:0})}}
   const PR=I*I*R,PL=P.reduce((a,b)=>a+b,0);
   $('#l9l').innerHTML=lampFig(arr,{live:{I,P,dead},Rl:'R = '+fm(R,3)+' Ω',VL:fm(sig(VL,4))+' V'});
   $('#l9l').querySelectorAll('[data-lamp]').forEach(g=>g.onclick=()=>{const k=+g.dataset.lamp;dead[k]^=1;lamps()});
   $('#l9I').textContent=fm(sig(I,4))+' A';$('#l9VR').textContent=fm(sig(I*R,4))+' V';$('#l9VL').textContent=fm(sig(VL,4))+' V';$('#l9PR').textContent=fm(sig(PR,4))+' W';$('#l9PL').textContent=fm(sig(PL,4))+' W';$('#l9eta').textContent=PL+PR>0?fm(PL/(PL+PR)*100,1)+' %':'—';
   const per=arr==='p4'?VL:VL/2,lit=P.filter(p=>p>1e-6).length;let m='';
   if(lit&&per>110*1.03)m=`<div class="callout err">جهد كل مصباح <span class="ltr">${fm(sig(per,4))} V</span> أعلى من المقنن 110 V: يضيء أكثر لكن عمره يقصر (توضيح — ليس من الكتاب).</div>`;
   else if(lit&&per<110*0.97)m=`<div class="callout">جهد كل مصباح <span class="ltr">${fm(sig(per,4))} V</span> أقل من 110 V فيضيء أضعف من المقنن.</div>`;
   if(dead.some(Boolean))m+=`<div class="callout">مصابيح مضيئة: ${lit} من 4.${arr==='s2'?' في الطريقة الثانية احتراق مصباح يفتح فرعه كله فينطفئ معه المصباح الذي على التوالي معه («فلن يعمل إلا مصباحان فقط»).':' في الطريقة الأولى تبقى بقية المصابيح مضيئة.'}</div>`;
   $('#l9lmsg').innerHTML=m;steps&&steps.check()};
  segBind(el,'ar',v=>{arr=v;lamps()});$('#l9R').oninput=e=>{R=+e.target.value;lamps()};
  $('#l9r55').onclick=()=>{R=55;$('#l9R').value=R;lamps()};$('#l9r9').onclick=()=>{R=9.167;$('#l9R').value=R;lamps()};$('#l9fix').onclick=()=>{dead.fill(0);lamps()};
  let steps=null;
  steps=stepsUI($('#l9st'),[
   {t:'الطرفان مفتوحان — مثال (3-28)',x:'في «دائرة الشكل (3-35)» بدون أي قصر: اقرأ <span class="ltr">I = 0.5 A</span> و <span class="ltr">V = 5 V</span> وتيار R<sub>3</sub> صفر.'},
   {t:'قصر R<sub>2</sub>',x:'شغّل «قصر R2»: يصير التيار قرابة <span class="ltr">3 A</span> والجهد V ≅ 0 (الشكل 3-36).',done:()=>mode==='f35'&&s2&&!s1&&!so},
   {t:'قصر الطرفين',x:'أطفئ «قصر R2» وشغّل «قصر الطرفين»: يمر الآن تيار في R<sub>3</sub> لأن الدائرة لم تعد مفتوحة، والجهد V ≅ 0.',done:()=>mode==='f35'&&so&&!s2},
   {t:'لماذا يوجد فيوز؟',x:'اختر «دائرة الفيوز» ثم شغّل «قصر R»: يحاول التيار أن يكبر جداً فينصهر الفيوز 10 A.',done:()=>did.blown},
   {t:'الطريقة الأولى — مثال (3-31)',x:'في لوحة المصابيح اختر الطريقة الأولى واضغط <span class="ltr">R = 55 Ω</span>: جهد المصابيح 110 V، والقدرة المفقودة في R نحو <span class="ltr">262 W</span>.',done:()=>arr==='p4'&&Math.abs(R-55)<0.01&&!dead.some(Boolean)},
   {t:'الطريقة الثانية — مثال (3-32)',x:'اختر الطريقة الثانية واضغط <span class="ltr">R = 9.167 Ω</span>: المفقود في R نحو <span class="ltr">10.9 W</span> فقط، والكفاءة نحو 96%.',done:()=>arr==='s2'&&Math.abs(R-9.167)<0.01&&!dead.some(Boolean)},
   {t:'احترق مصباح',x:'اضغط على أي مصباح في الطريقة الثانية: ينطفئ معه شريكه في نفس الفرع. جرّب نفس الشيء في الطريقة الأولى وقارن جهد المصابيح الباقية.',done:()=>arr==='s2'&&dead.some(Boolean)}
  ]);
  swUI();sim();lamps();
 },
 examples:[
  {title:'مثال (3-28)',ref:'ص 85–86',q:'<p>«احسب قيمة التيار I وفرق الجهد V للدائرة المبينة في الشكل (3-35)، ثم أعد حساب التيار I وفرق الجهد V بعد حدوث قصر بين طرفي المقاومة \\(R_2\\).»</p>'+box(c35({}),420),
   given:[{id:'E',label:'جهد البطارية',sym:'E',unit:'V',value:6},{id:'R1',label:'المقاومة الأولى',sym:'R_1',unit:'Ω',value:2},{id:'R2',label:'المقاومة الثانية',sym:'R_2',unit:'Ω',value:10},{id:'R3',label:'المقاومة الثالثة (لا تدخل في الحل)',sym:'R_3',unit:'Ω',value:3}],solve:solve328},
  {title:'مثال (3-29)',ref:'ص 88',q:'<p>«احسب فرق الجهد عبر الطرفين ab بحيث يكون فرق الجهد عبر المقاومة 2 Ω هو 10V كما موضح في الشكل (3-38).»</p>'+box(fig338(),400),given:G329,solve:solve329},
  {title:'مثال (3-30)',ref:'ص 88',q:'<p>«في مثال (3-29)، احسب فرق الجهد عبر المقاومة 6 Ω ومن ثم احسب التيارين \\(I_1\\) و \\(I_2\\).»</p>',given:G329,solve:solve330},
  {title:'مثال (3-31)',ref:'ص 89',q:'<p>«نريد تشغيل أربعة مصابيح 60W و 110V من منبع 230V، أحسب قيمة المقاومة المتصلة على التوالي مع الخط حتى لا يزيد الجهد الداخلي عبر المصابيح عن 110V.»</p>'+box(lampFig('p4'),440),given:G331,solve:solve331},
  {title:'مثال (3-32)',ref:'ص 89–90',q:'<p>«ثمة طريقة بديلة لتشغيل مصابيح المثال (3-31) بتوصيلها كما في الشكل (3-40) مع مقاومة على التوالي احسب قيمة المقاومة التي على التوالي وحدد أي الطريقتين أفضل مع تعليل ذلك.»</p>'+box(lampFig('s2'),440),given:G331,solve:solve332,
   note:'<span class="fixnote">الكتاب يكتب «القدرة المفقودة (I²R)» ويحسبها بالصيغة \\(V_R^2/R\\)، وهما متكافئتان. بقيم الكتاب تستعمل الحاسبة R = 55 Ω المطبوعة في المثال السابق.</span>'}
 ],
 quiz:[
  {q:'في الدائرة المفتوحة:',o:['التيار صفر والجهد بين الطرفين موجود','الجهد صفر والتيار كبير','التيار والجهد صفر','التيار يساوي E/R'],c:0,e:'ص 84.'},
  {q:'في دائرة القصر بين طرفين:',o:['التيار بينهما صفر','فرق الجهد بينهما صفر تقريباً ويمر تيار','الجهد يساوي E','المقاومة لا نهائية'],c:1,e:'ص 84.'},
  {q:'في الشكل (3-34) عند قصر طرفي R، تيار المقاومة R نفسها:',o:['5 A','10 A','صفر','لا نهائي'],c:2,e:'الشكل (3-34): \\(I_R=0\\) A لأن التيار يمر في سلك القصر.'},
  {q:'في مثال (3-28) لماذا لا يدخل R<sub>3</sub> في حساب التيار؟',o:['لأنها صغيرة','لأن طرفها مفتوح فلا يمر فيها تيار','لأنها مقصورة','لأنها على التوازي'],c:1,e:'ص 85.'},
  {q:'R<sub>1</sub> = 4 Ω على التوالي مع (6 Ω و 3 Ω على التوازي). R<sub>T</sub> =',o:['13 Ω','6 Ω','2 Ω','6.5 Ω'],c:1,e:'\\(R_T=R_S+R_P=4+2=6\\ \\Omega\\) (ص 87).'},
  {q:'في مثال (3-31) لماذا نضع مقاومة على التوالي مع المصابيح؟',o:['لزيادة الإضاءة','لتأخذ فرق الجهد الزائد (230 − 110 = 120 V)','لحماية المنبع من القصر','لتقليل عدد المصابيح'],c:1,e:'\\(V_R=230-110=120\\) V.'},
  {q:'لماذا الطريقة الثانية (مثال 3-32) أكثر فاعلية؟',o:['لأن المقاومة أكبر','لأن القدرة المفقودة في المقاومة أقل بكثير (10.9 W مقابل 261.82 W)','لأن المصابيح أكثر','لأنها لا تحتاج مقاومة'],c:1,e:'ص 90.'},
  {q:'عيب الطريقة الثانية (مثال 3-32):',o:['تستهلك قدرة أكبر','إذا احترق مصباح لا يعمل إلا مصباحان فقط','تحتاج منبعاً أكبر','المصابيح تحترق فوراً'],c:1,e:'ص 90.'}
 ]
});

/* ======================================================================
   Lesson 10 (u3-l10) — التوصيل المركب: القدرة واختزال الدوائر (ص 90–93)
   ====================================================================== */
/* الشكل (3-41); o:{R:label, live:{I,I3,I6}} */
function fig341(o){o=o||{};const L=o.live,f=x=>L&&x>1e-6?'flow':'';const yt=40,yb=200,c=f(L?L.I:0);
  let s=Term(30,yt)+Term(30,yb)+Pm(30,yt+22,'+')+Pm(30,yb-18,'−')+T(30,(yt+yb)/2+4,L?fm(L.E)+' V':'90 V',{fs:12});
  s+=W([[34,yt],[60,yt]],c)+Rz(60,yt,130,yt,'1',{cls:c})+Rz(140,yt,230,yt,o.R||'R',{cls:c})+W([[130,yt],[140,yt]],c)+W([[230,yt],[290,yt]],c)+CA(262,yt,'r','I',{len:16})+Dot(290,yt);
  s+=Rz(290,yt,290,yb,'3',{cls:f(L?L.I3:0)})+Pm(270,yt+44,'+')+Pm(270,yb-30,'−')+T(270,(yt+yb)/2+18,'V_3',{c:'b'})+W([[290,yt],[390,yt]],f(L?L.I6:0))+Rz(390,yt,390,yb,'6',{cls:f(L?L.I6:0)})+W([[390,yb],[34,yb]],c)+Dot(290,yb);
  if(L)s+=T(300,yb+18,`I_3 = ${fm(sig(L.I3,4))} A`,{a:'start',c:'b',fs:11})+T(150,yb+18,`I = ${fm(sig(L.I,4))} A`,{c:'b',fs:11});
  return svg(450,yb+(L?28:16),s,'دائرة مثال (3-33)')}
/* الشكل (3-42) at reduction stage st (0 = 3-42أ, 2 = 3-42ب, 4 = مقاومة واحدة). v = values, L = live currents */
function fig342(st,v,L){v=v||{E:15,a:1,b:3,c:6,d:2,e:4};const yt=40,yb=240,f=x=>L&&x>1e-6?'flow':'';const rl=(n,r)=>`${n}${r!=null?' = '+fm(sig(r,4))+' Ω':''}`;
  const P=v.b*v.c/(v.b+v.c),Sr=v.d+v.e,P2=P*Sr/(P+Sr);let s=Bv(50,yt,yb,fm(v.E)+'V',{side:'r',cls:L?'live':''});const cI=f(L?L.I:0);
  if(st<4){s+=W([[50,yt],[80,yt]],cI)+Rz(80,yt,160,yt,rl('',v.a).replace(' = ',''),{cls:cI})+W([[160,yt],[230,yt]],cI)+CA(194,yt,'r','I',{len:14})+W([[230,yb],[50,yb]],cI)}
  else{s+=W([[50,yt],[230,yt]],cI)+Rz(230,yt,230,yb,rl('R_T',v.a+P2),{cls:cI})+W([[230,yb],[50,yb]],cI)+CA(140,yt,'r','I',{len:14})}
  if(st===3){s+=Dot(230,yt)+Rz(230,yt,230,yb,rl('',P2).replace(' = ',''),{cls:cI})}
  if(st<3){const c1=f(L?L.I1:0),c2=f(L?L.I2:0);s+=Dot(230,yt)+Dot(230,yb);
    // branch 1 (I1): 3 || 6  or  2 Ω
    if(st===0){const c3=f(L?L.I3:0),c4=f(L?L.I4:0);s+=W([[230,yt],[230,80]],c1)+CA(230,62,'d','I_1',{side:'l',len:14})+W([[190,80],[270,80]])+W([[190,200],[270,200]])+Rz(190,80,190,200,'',{cls:c3})+Rz(270,80,270,200,'',{cls:c4})+T(176,146,fm(v.b)+'Ω',{a:'end'})+T(284,146,fm(v.c)+'Ω',{a:'start'})+CA(190,98,'d','I_3',{side:'l',len:12})+CA(270,98,'d','I_4',{side:'r',len:12})+W([[230,200],[230,yb]],c1)+Dot(230,80)+Dot(230,200)}
    else s+=Rz(230,yt,230,yb,rl('',P).replace(' = ','')+(st===1?' (3‖6)':''),{cls:c1})+CA(230,62,'d','I_1',{side:'l',len:14});
    // branch 2 (I2): 2 + 4  or 6 Ω
    s+=W([[230,yt],[390,yt]],c2)+CA(330,yt,'r','I_2',{len:14});
    if(st<2)s+=Rz(390,yt,390,130,fm(v.d)+'Ω',{cls:c2})+Rz(390,140,390,yb,fm(v.e)+'Ω',{cls:c2})+W([[390,130],[390,140]],c2);else s+=Rz(390,yt,390,yb,rl('',Sr).replace(' = ','')+(st===2?' (2+4)':''),{cls:c2});
    s+=W([[390,yb],[230,yb]],c2)}
  return svg(480,yb+18,s,'دائرة مثال (3-35)')}

const G333=[{id:'E',label:'جهد المنبع',sym:'V',unit:'V',value:90},{id:'Ra',label:'المقاومة على التوالي',sym:'',unit:'Ω',value:1},{id:'R3',label:'مقاومة الفرع الأول',sym:'',unit:'Ω',value:3},{id:'R6',label:'مقاومة الفرع الثاني',sym:'',unit:'Ω',value:6},{id:'P3',label:'القدرة المطلوبة في المقاومة 3 Ω',sym:'P_{3\\Omega}',unit:'W',value:300}];
function s333(g,B){const V3=B.round(Math.sqrt(g.P3*g.R3),4),I3=B.round(V3/g.R3,4),I6=B.round(V3/g.R6,4),I=B.round(I3+I6,4),Rp=B.round(g.R3*g.R6/(g.R3+g.R6),4),k=B.round(I*(g.Ra+Rp),4),R=B.round((g.E-k)/I,4);return {V3,I3,I6,I,Rp,k,R}}
function solve333(g,B){if(!(g.P3>0&&g.R3>0&&g.R6>0))return bad('القيم يجب أن تكون موجبة.');const r=s333(g,B);
  const out=[{t:'',f:`P_{3\\Omega}=\\frac{V_3^2}{${fm(g.R3)}}=${fm(g.P3)}\\ \\text{W}\\;\\Rightarrow\\;V_3=\\sqrt{${fm(g.P3)}\\times${fm(g.R3)}}`,v:r.V3,unit:'V'},
   {t:'',f:`I_{3\\Omega}=\\frac{V_3}{${fm(g.R3)}}=\\frac{${fm(r.V3)}}{${fm(g.R3)}}`,v:r.I3,unit:'A'},{t:'و',f:`I_{6\\Omega}=\\frac{V_3}{${fm(g.R6)}}=\\frac{${fm(r.V3)}}{${fm(g.R6)}}`,v:r.I6,unit:'A'},
   {t:'',f:`I=${fm(r.I3)}+${fm(r.I6)}=\\frac{V}{${fm(g.Ra)}+R+\\frac{${fm(g.R6)}\\times${fm(g.R3)}}{${fm(g.R6)}+${fm(g.R3)}}}=\\frac{V}{${fm(B.round(g.Ra+r.Rp,4))}+R}`,v:r.I,unit:'A'},
   {t:'وحيث إن',f:`V=${fm(r.k)}+${fm(r.I)}R=${fm(g.E)}\\ \\text{V}`},{t:'لذلك فإن',f:`R=\\frac{${fm(g.E)}-${fm(r.k)}}{${fm(r.I)}}`,v:r.R,unit:'Ω',final:true}];
  if(r.R<0)out.push({t:'الناتج سالب: بهذه الأرقام لا يمكن الوصول إلى القدرة المطلوبة (الجهد لا يكفي حتى مع R = 0).'});return out}
function solve334(g,B){if(!(g.P3>0&&g.R3>0&&g.R6>0))return bad('القيم يجب أن تكون موجبة.');const r=s333(g,B);const p6=B.round(r.V3*r.V3/g.R6,4),p3=B.round(r.V3*r.V3/g.R3,4),pR=B.round(r.R*r.I*r.I,4),p1=B.round(g.Ra*r.I*r.I,4);
  return [{t:`من مثال (3-33): \\(V_3=${fm(r.V3)}\\) V، \\(I=${fm(r.I)}\\) A، \\(R=${fm(r.R)}\\ \\Omega\\). القدرة الإجمالية الممتصة في المقاومات:`,f:`P_{loss}=\\frac{${fm(r.V3)}^2}{${fm(g.R6)}}+\\frac{${fm(r.V3)}^2}{${fm(g.R3)}}+${fm(r.R)}\\times${fm(r.I)}^2+${fm(g.Ra)}\\times${fm(r.I)}^2`,v:B.round(p6+p3+pR+p1,4),unit:'W',final:true},
   {t:'(تفصيل: '+[p6,p3,pR,p1].map(x=>fm(x)).join(' + ')+')'},{t:'القدرة التي يزودها المنبع:',f:`P=${fm(r.I)}\\times${fm(g.E)}`,v:B.round(r.I*g.E,4),unit:'W',final:true},
   {t:'«وواضح أن القدرة التي يزودها المنبع تكون مماثلة للقدرة الممتصة في المقاومات.»'}]}
const G335=[{id:'E',label:'جهد البطارية',sym:'E',unit:'V',value:15},{id:'a',label:'المقاومة على التوالي',sym:'',unit:'Ω',value:1},{id:'b',label:'المقاومة 3 Ω',sym:'',unit:'Ω',value:3},{id:'c',label:'المقاومة 6 Ω',sym:'',unit:'Ω',value:6},{id:'d',label:'المقاومة 2 Ω (أعلى الفرع الأيمن)',sym:'',unit:'Ω',value:2},{id:'e',label:'المقاومة 4 Ω',sym:'',unit:'Ω',value:4}];
function s335(g,B){const P=B.round(g.b*g.c/(g.b+g.c),4),Sr=B.round(g.d+g.e,4),RT=B.round(g.a+P*Sr/(P+Sr),4),I=B.round(g.E/RT,4),I2=B.round(P/(P+Sr)*I,4),I1=B.round(I*Sr/(P+Sr),4),I3=B.round(g.c/(g.b+g.c)*I1,4),I4=B.round(g.b/(g.b+g.c)*I1,4);return {P,Sr,RT,I,I1,I2,I3,I4}}
const okG=g=>['a','b','c','d','e'].every(k=>g[k]>0);
function solve335(g,B){if(!okG(g))return bad('المقاومات يجب أن تكون أكبر من صفر.');const r=s335(g,B);
  return [{t:'نختزل الدائرة أولاً كما في الشكل (3-42ب): المقاومتان '+fm(g.b)+' و '+fm(g.c)+' على التوازي، و '+fm(g.d)+' و '+fm(g.e)+' على التوالي:',f:`\\frac{${fm(g.b)}\\times${fm(g.c)}}{${fm(g.b)}+${fm(g.c)}}=${fm(r.P)}\\ \\Omega,\\qquad ${fm(g.d)}+${fm(g.e)}=${fm(r.Sr)}\\ \\Omega`},
   {t:'المقاومة الكلية:',f:`R_T=${fm(g.a)}+\\frac{${fm(r.P)}\\times${fm(r.Sr)}}{${fm(r.P)}+${fm(r.Sr)}}`,v:r.RT,unit:'Ω',final:true},{t:'ويكون التيار I هو',f:`I=\\frac{V}{R_T}=\\frac{${fm(g.E)}}{${fm(r.RT)}}`,v:r.I,unit:'A',final:true}]}
function solve336(g,B){if(!okG(g))return bad('المقاومات يجب أن تكون أكبر من صفر.');const r=s335(g,B);
  return [{t:`من المثال (3-35) لدينا التيار \\(I=${fm(r.I)}\\) A، وبقاعدة تقسيم التيار على الشكل (3-42ب):`,f:`I_2=\\left[\\frac{${fm(r.P)}}{${fm(r.P)}+${fm(r.Sr)}}\\right]${fm(r.I)}`,v:r.I2,unit:'A',final:true},
   {t:'القدرة المفقودة في المقاومة '+fm(g.d)+' Ω:',f:`P_{${fm(g.d)}\\Omega}=I_2^2(${fm(g.d)})=(${fm(r.I2)})^2\\,${fm(g.d)}`,v:B.round(r.I2*r.I2*g.d,4),unit:'W',final:true}]}
function solve337(g,B){if(!okG(g))return bad('المقاومات يجب أن تكون أكبر من صفر.');const r=s335(g,B);const p=[['P_{'+fm(g.b)+'\\Omega}',r.I3,g.b],['P_{'+fm(g.d)+'\\Omega}',r.I2,g.d],['P_{'+fm(g.a)+'\\Omega}',r.I,g.a],['P_{'+fm(g.c)+'\\Omega}',r.I4,g.c],['P_{'+fm(g.e)+'\\Omega}',r.I2,g.e]].map(([n,i,R])=>[n,i,R,B.round(i*i*R,4)]);
  const tot=B.round(p.reduce((s,x)=>s+x[3],0),4);
  return [{t:'من الشكل (3-42ب):',f:`I_1=${fm(r.I)}\\left[\\frac{${fm(r.Sr)}}{${fm(r.P)}+${fm(r.Sr)}}\\right]`,v:r.I1,unit:'A'},
   {t:'ومن الشكل (3-42أ):',f:`I_3=\\left(\\frac{${fm(g.c)}}{${fm(g.b)}+${fm(g.c)}}\\right)(${fm(r.I1)})`,v:r.I3,unit:'A'},{t:'',f:`I_4=\\left(\\frac{${fm(g.b)}}{${fm(g.b)}+${fm(g.c)}}\\right)(${fm(r.I1)})`,v:r.I4,unit:'A'},
   {t:`ومن المثال (3-36) \\(I_2=${fm(r.I2)}\\) A، والقدرة المفقودة \\(P=I^2R\\):`}].concat(p.map(([n,i,R,v])=>({t:'',f:`${n}=(${fm(i)})^2\\,${fm(R)}`,v,unit:'W'})),[
   {t:'القدرة الكلية:',f:`P_T=${p.map(x=>fm(x[3])).join('+')}`,v:tot,unit:'W',final:true},
   {t:'قدرة البطارية للمقارنة (لا يكتبها الكتاب صراحة):',f:`P=E\\times I=${fm(g.E)}\\times${fm(r.I)}`,v:B.round(g.E*r.I,4),unit:'W',final:true}])}

B.lesson({
 id:'u3-l10',unit:3,order:10,pages:'90–93',
 title:'التوصيل المركب: القدرة واختزال الدوائر',
 summary:'نختزل الدائرة المركبة خطوة خطوة (توازي ← مقاومة مكافئة، توالي ← مجموع) حتى مقاومة واحدة، ثم نرجع لحساب تيار كل فرع بقاعدة توزيع التيار وقدرة كل مقاومة. مجموع القدرات يساوي قدرة المنبع. الأمثلة (3-33) إلى (3-37).',
 stations:[
  {intro:true},

  {st:1,short:'مثال <span class="ltr">(3-33)</span>',title:'مثال <span class="ltr">(3-33)</span>: إيجاد مقاومة من قدرة معلومة',ref:'ص 90–91',
   q:'نعرف قدرة مقاومة واحدة فقط (300 W). كيف نصل منها إلى قيمة مقاومة مجهولة في مكان آخر من الدائرة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="منبع 90 فولت ثم 1 أوم ثم مقاومة مجهولة R ثم 3 و 6 أوم على التوازي" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><circle cx="34" cy="100" r="5.5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><circle cx="34" cy="230" r="5.5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="34" y="130" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">+</text><text x="34" y="216" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700">−</text><text x="42" y="172" text-anchor="start" font-size="12.5" fill="#2C4A40" font-weight="700">90 V</text><path d="M39 100 L60 100" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M60 100 L67.5 100 L70.4 107 L76.2 93 L82.1 107 L87.9 93 L93.8 107 L99.6 93 L102.5 100 L110 100" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="85" y="84" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">1 Ω</text><g data-tip="المقاومة المجهولة ⟦R⟧ على التوالي: تمر فيها نفس التيار الكلي ⟦I⟧."><path d="M120 100 L129 100 L132.5 107 L139.5 93 L146.5 107 L153.5 93 L160.5 107 L167.5 93 L171 100 L180 100" fill="none" stroke="#3B7DD8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><text x="150" y="84" text-anchor="middle" font-size="13" fill="#3B7DD8" font-weight="700">R = ?</text><rect x="114" y="68" width="72" height="46" fill="transparent"/></g><path d="M110 100 L120 100" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M180 100 L230 100" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M196 100L203 100" stroke="#E8735A" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M214 100L203 105.5L203 94.5Z" fill="#E8735A"/><text x="205" y="88" text-anchor="middle" font-size="13" fill="#E8735A" font-weight="700">I</text><circle cx="230" cy="100" r="4" fill="#2C4A40"/><circle cx="230" cy="230" r="4" fill="#2C4A40"/><path d="M230 100 L310 100" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M39 230 L310 230" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="المقاومة ⟦3 Ω⟧: قدرتها المفقودة معلومة ⟦300 W⟧، ومنها نعرف جهدها ⟦V3⟧. هي نقطة البداية."><path d="M230 100 L230 143 L223 146.7 L237 154 L223 161.3 L237 168.7 L223 176 L237 183.3 L230 187 L230 230" fill="none" stroke="#E8735A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><text x="242" y="160" text-anchor="start" font-size="12.5" fill="#E8735A" font-weight="700">3 Ω</text><text x="242" y="178" text-anchor="start" font-size="11.5" fill="#E8735A" font-weight="700">300 W</text><rect x="218" y="110" width="64" height="110" fill="transparent"/></g><g data-tip="⟦V3⟧: جهد المقاومة ⟦3 Ω⟧، وهو نفسه جهد ⟦6 Ω⟧ لأنهما على التوازي."><text x="218" y="140" text-anchor="end" font-size="13" fill="#2C4A40" font-weight="700">+</text><text x="218" y="206" text-anchor="end" font-size="15" fill="#2C4A40" font-weight="700">−</text><text x="218" y="174" text-anchor="end" font-size="12" fill="#4FB3A9" font-weight="700">V<tspan baseline-shift="sub" font-size="75%">3</tspan></text><rect x="190" y="126" width="30" height="86" fill="transparent"/></g><path d="M310 100 L310 143 L303 146.7 L317 154 L303 161.3 L317 168.7 L303 176 L317 183.3 L310 187 L310 230" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="300" y="160" text-anchor="end" font-size="12.5" fill="#2C4A40" font-weight="700">6 Ω</text><text x="180" y="56" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">الشكل <tspan direction="ltr" unicode-bidi="embed">(3-41)</tspan></text><text x="180" y="272" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700">P<tspan baseline-shift="sub" font-size="75%">3Ω</tspan> = V<tspan baseline-shift="sub" font-size="75%">3²</tspan> / 3 = 300 W</text></svg>`,
   cap:'الشكل <span class="ltr">(3-41)</span>: الأرقام بالأوم.<br><b>مرّر المؤشر على المقاومتين الملونتين وعلى <span class="ltr">V<sub>3</sub></span> (أو المسها في الجوال) لتعرف من أين نبدأ.</b>',
   side:[
    {predict:{q:String.raw`من \(P=V_3^2/3=300\ \text{W}\)، كم جهد المقاومة 3 Ω؟`,opts:[
     ['30 V',true,String.raw`\(V_3^2=900\) ومنها \(V_3=30\ \text{V}\).`],
     ['100 V',false,String.raw`هذا ناتج \(300/3\)؛ لكن الجهد مربع في القانون، فنأخذ الجذر.`],
     ['900 V',false,String.raw`هذا \(V_3^2\) نفسه؛ بقي أن نأخذ الجذر التربيعي.`]]}}
   ],
   body:[
    {book:String.raw`<p>احسب المقاومة R في الدائرة المبينة في الشكل (3-41) بحيث تكون القدرة المفقودة في المقاومة 3 Ω هي 300 W.</p>
     <p><b>الحل:</b></p>
     $$P_{3\Omega}=\frac{V_3^2}{3}=300\ \text{W}$$
     <p>أي أن</p>
     $$V_3=30\ \text{V}\qquad I_{3\Omega}=\frac{V_3}{3}=\frac{30}{3}=10\ \text{A}$$
     <p>و</p>
     $$I_{6\Omega}=\frac{V_3}{6}=\frac{30}{6}=5\ \text{A}$$
     $$I=10+5=15\ \text{A}=\frac{V}{1+R+\frac{6\times3}{6+3}}=\frac{V}{3+R}$$
     <p>وحيث إن</p>
     $$V=45+15R=90\ \text{V}$$
     <p>لذلك فإن</p>
     $$R=\frac{90-45}{15}=3\ \Omega$$`,ref:'ص 90–91'},
    {tip:String.raw`<p>الطريق من المعلوم إلى المجهول: قدرة 3 Ω ← جهدها \(V_3\) ← تيارها، و\(V_3\) هو أيضاً جهد 6 Ω (توازي) ← تيارها ← مجموع التيارين هو التيار الكلي I (قانون كيرشوف للتيار) ← وهذا التيار يمر في 1 Ω و R ← نكتب قانون أوم للدائرة كلها: \(90=15(3+R)\).</p>`,title:'تتبّع الحل'},
    {watch:String.raw`<p>حيث يقول الحل «\(I=15=\frac{V}{3+R}\)» فالرقم 3 هو مجموع 1 Ω ومكافئ التوازي 2 Ω (\(6\times3/9\))، وليس المقاومة 3 Ω. ثم \(V=15(3+R)=45+15R\).</p>`},
    {html:String.raw`<div class="w-row"><button class="btn pri" type="button" onclick="var b=document.querySelector('.ltabs button[data-tab=examples]');if(b)b.click()">افتح الحل خطوة بخطوة في «الأمثلة المحلولة»</button></div>`}
   ]},

  {st:2,short:'مثال <span class="ltr">(3-34)</span>',title:'مثال <span class="ltr">(3-34)</span>: توازن القدرة',ref:'ص 91',
   q:'هل يمكن أن تمتص المقاومات قدرة أكثر أو أقل مما يعطيه المنبع؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="شريطان متساويان في الطول: مجموع قدرات المقاومات الأربع 1350 واط، وقدرة المنبع 1350 واط" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><text x="180" y="50" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">القدرة الممتصة = القدرة المزودة</text><g data-tip="⟦6 Ω⟧: ⟦30² / 6 = 150 W⟧."><rect x="60" y="100" width="26.7" height="46" rx="0" fill="#4FB3A9" stroke="#2C4A40" stroke-width="2"/><rect x="60" y="100" width="26.7" height="46" fill="transparent"/></g><text x="73.3" y="166" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700">6 Ω</text><g data-tip="⟦3 Ω⟧: ⟦30² / 3 = 300 W⟧ (المعطاة في مثال 3-33)."><rect x="86.7" y="100" width="53.3" height="46" rx="0" fill="#E8735A" stroke="#2C4A40" stroke-width="2"/><rect x="86.7" y="100" width="53.3" height="46" fill="transparent"/></g><text x="113.3" y="166" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700">3 Ω</text><g data-tip="⟦R = 3 Ω⟧: ⟦3 × 15² = 675 W⟧."><rect x="140" y="100" width="120" height="46" rx="0" fill="#3B7DD8" stroke="#2C4A40" stroke-width="2"/><rect x="140" y="100" width="120" height="46" fill="transparent"/></g><text x="200" y="166" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700">R = 3 Ω</text><g data-tip="⟦1 Ω⟧: ⟦1 × 15² = 225 W⟧."><rect x="260" y="100" width="40" height="46" rx="0" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><rect x="260" y="100" width="40" height="46" fill="transparent"/></g><text x="280" y="166" text-anchor="middle" font-size="11" fill="#2C4A40" font-weight="700">1 Ω</text><text x="180" y="92" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">1350 W</text><g data-tip="قدرة المنبع: ⟦P = 15 × 90 = 1350 W⟧."><rect x="60" y="200" width="240" height="46" rx="0" fill="#12855A" stroke="#2C4A40" stroke-width="2"/><text x="180" y="229" text-anchor="middle" font-size="14" fill="#FBF6EE" font-weight="700">15 × 90 = 1350 W</text><rect x="60" y="200" width="240" height="46" fill="transparent"/></g><text x="180" y="272" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700" direction="rtl">المنبع</text><text x="180" y="190" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="rtl">المقاومات الأربع</text></svg>`,
   cap:'الشريط العلوي قدرات المقاومات الأربع، والسفلي قدرة المنبع: الطول نفسه.<br><b>مرّر المؤشر على كل جزء من الشريطين (أو المسه في الجوال) لترى حسابه.</b>',
   side:[
    {predict:{q:'كم القدرة التي يزودها المنبع في مثال (3-33)؟',opts:[
     ['675 W',false,'هذه قدرة المقاومة R وحدها.'],
     ['1350 W',true,String.raw`\(P=15\times90=1350\ \text{W}\)، وهي نفس مجموع قدرات المقاومات.`],
     ['300 W',false,'هذه قدرة المقاومة 3 Ω المعطاة.']]}}
   ],
   body:[
    {book:String.raw`<p>احسب القدرة التي تمتصها كل مقاومة في المثال (3-33) وأثبت أن القدرة الإجمالية التي يتم الحصول عليها تكون مماثلة لتلك التي يزودها المنبع.</p>
     <p><b>الحل:</b> القدرة الإجمالية الممتصة في المقاومات هي</p>
     $$P_{loss}=\frac{30^2}{6}+\frac{30^2}{3}+3\times15^2+1\times15^2=1350\ \text{W}$$
     <p>القدرة التي يزودها المنبع</p>
     $$P=15\times90=1350\ \text{W}$$
     <p>وواضح أن القدرة التي يزودها المنبع تكون مماثلة للقدرة الممتصة في المقاومات.</p>`,ref:'ص 91'},
    {tip:String.raw`<p>الحدود الأربعة هي: \(150+300+675+225=1350\ \text{W}\). لاحظ أن الكتاب يستعمل \(V^2/R\) للمقاومتين المتوازيتين (جهدهما معلوم 30 V) و\(I^2R\) للمقاومتين على التوالي (تيارهما معلوم 15 A). اختر الصيغة حسب المعلوم.</p>`},
    {add:String.raw`<p>هذا «توازن القدرة» هو مبدأ حفظ الطاقة: الطاقة التي يعطيها المصدر في كل ثانية تتحول كلها إلى حرارة في المقاومات. لذلك هو أفضل طريقة لتتأكد من صحة حلك في أي دائرة.</p>`},
    {html:String.raw`<div class="w-row"><button class="btn pri" type="button" onclick="var b=document.querySelector('.ltabs button[data-tab=examples]');if(b)b.click()">افتح الحل خطوة بخطوة في «الأمثلة المحلولة»</button></div>`}
   ]},

  {st:3,short:'مثال <span class="ltr">(3-35)</span>',title:'مثال <span class="ltr">(3-35)</span>: اختزال الدائرة',ref:'ص 92',
   q:'دائرة فيها مجموعات متداخلة. من أين تبدأ حتى تحولها إلى مقاومة واحدة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="بطارية 15 فولت و 1 أوم ثم فرعان: 3 و 6 أوم على التوازي، و 2 و 4 أوم على التوالي" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><path d="M46 80 L46 160" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M46 170 L46 250" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M30 160H62" stroke="#2C4A40" stroke-width="3"/><path d="M37 170H55" stroke="#2C4A40" stroke-width="6"/><text x="70" y="156" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">+</text><text x="32" y="170" text-anchor="end" font-size="11.5" fill="#2C4A40" font-weight="700">15V</text><path d="M46 80 L70 80" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M70 80 L77.5 80 L80.4 87 L86.2 73 L92.1 87 L97.9 73 L103.8 87 L109.6 73 L112.5 80 L120 80" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="95" y="64" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">1Ω</text><path d="M120 80 L160 80" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M132 80L137 80" stroke="#E8735A" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M148 80L137 85.5L137 74.5Z" fill="#E8735A"/><text x="140" y="68" text-anchor="middle" font-size="12.5" fill="#E8735A" font-weight="700">I</text><circle cx="160" cy="80" r="4" fill="#2C4A40"/><path d="M160 80 L160 110" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M130 110 L190 110" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M130 210 L190 210" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M160 210 L160 250" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="160" cy="250" r="4" fill="#2C4A40"/><g data-tip="الخطوة 1: ⟦3 Ω⟧ و⟦6 Ω⟧ على التوازي ⟵ ⟦3×6/(3+6) = 2 Ω⟧."><path d="M130 110 L130 138 L123 141.7 L137 149 L123 156.3 L137 163.7 L123 171 L137 178.3 L130 182 L130 210" fill="none" stroke="#E8735A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M190 110 L190 138 L183 141.7 L197 149 L183 156.3 L197 163.7 L183 171 L197 178.3 L190 182 L190 210" fill="none" stroke="#E8735A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><text x="120" y="164" text-anchor="end" font-size="12" fill="#E8735A" font-weight="700">3Ω</text><text x="200" y="164" text-anchor="start" font-size="12" fill="#E8735A" font-weight="700">6Ω</text><rect x="110" y="104" width="100" height="112" fill="transparent"/></g><circle cx="160" cy="110" r="4" fill="#2C4A40"/><circle cx="160" cy="210" r="4" fill="#2C4A40"/><path d="M160 89L160 92" stroke="#E8735A" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M160 103L154.5 92L165.5 92Z" fill="#E8735A"/><text x="152" y="100" text-anchor="end" font-size="11" fill="#E8735A" font-weight="700">I<tspan baseline-shift="sub" font-size="75%">1</tspan></text><path d="M160 80 L290 80" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M232 80L237 80" stroke="#E8735A" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M248 80L237 85.5L237 74.5Z" fill="#E8735A"/><text x="240" y="68" text-anchor="middle" font-size="11.5" fill="#E8735A" font-weight="700">I<tspan baseline-shift="sub" font-size="75%">2</tspan></text><g data-tip="الخطوة 2: ⟦2 Ω⟧ و⟦4 Ω⟧ على التوالي ⟵ ⟦2 + 4 = 6 Ω⟧."><path d="M290 80 L290 98 L283 101.7 L297 109 L283 116.3 L297 123.7 L283 131 L297 138.3 L290 142 L290 160" fill="none" stroke="#4FB3A9" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M290 170 L290 188 L283 191.7 L297 199 L283 206.3 L297 213.7 L283 221 L297 228.3 L290 232 L290 250" fill="none" stroke="#4FB3A9" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M290 160 L290 170" fill="none" stroke="#4FB3A9" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><text x="300" y="124" text-anchor="start" font-size="12" fill="#4FB3A9" font-weight="700">2Ω</text><text x="300" y="214" text-anchor="start" font-size="12" fill="#4FB3A9" font-weight="700">4Ω</text><rect x="278" y="86" width="60" height="158" fill="transparent"/></g><path d="M290 250 L46 250" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><text x="180" y="48" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">الشكل <tspan direction="ltr" unicode-bidi="embed">(3-42</tspan>أ)</text><g data-tip="الخطوة 3: الفرعان ⟦2 Ω⟧ و⟦6 Ω⟧ على التوازي = ⟦1.5 Ω⟧، ثم ⟦1 Ω⟧ على التوالي: ⟦RT = 2.5 Ω⟧."><text x="180" y="280" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">T</tspan> = 1 + (2×6)/(2+6) = 2.5 Ω</text><rect x="60" y="266" width="240" height="20" fill="transparent"/></g></svg>`,
   cap:'الشكل <span class="ltr">(3-42أ)</span>: المجموعة البرتقالية توازي والخضراء توالي.<br><b>مرّر المؤشر على كل مجموعة وعلى السطر الأخير (أو المسها في الجوال) لترى خطوة الاختزال.</b>',
   side:[
    {predict:{q:'ما أول خطوة اختزال صحيحة في هذه الدائرة؟',opts:[
     ['جمع 1 Ω مع 3 Ω على التوالي',false,'بين 1 Ω و 3 Ω تفرّع (عقدة)، فليستا على التوالي.'],
     ['3 Ω و 6 Ω على التوازي = 2 Ω',true,String.raw`طرفاهما على نفس النقطتين، فمكافئهما \(3\times6/(3+6)=2\ \Omega\). (وجمع 2 و 4 على التوالي خطوة صحيحة أيضاً.)`],
     ['6 Ω و 4 Ω على التوازي',false,'ليستا بين نفس النقطتين: 4 Ω على التوالي مع 2 Ω في فرع آخر.']]}}
   ],
   body:[
    {book:String.raw`<p>احسب التيار المسحوب من البطارية 15V في الدائرة المبينة في الشكل (3-42أ).</p>
     <p>سنقوم أولاً باختزال الدائرة إلى مقاومة مكافئة واحدة وذلك كما هو موضح في الشكل (3-42ب)، ومن الشكل (3-42أ) نحصل على المقاومة الكلية \(R_T\) والتيار I كما يلي</p>
     $$R_T=1+\frac{2\times6}{2+6}=1+\frac{3}{2}=2.5\ \Omega$$
     <p>ويكون التيار I هو</p>
     $$I=\frac{V}{R_T}=\frac{15}{2.5}=6\ \text{A}$$`,ref:'ص 92'},
    {tip:String.raw`<ol><li>3 Ω و 6 Ω على التوازي: \(\frac{3\times6}{3+6}=2\ \Omega\).</li><li>2 Ω و 4 Ω على التوالي: \(2+4=6\ \Omega\).</li><li>صار عندنا فرعان (2 Ω و 6 Ω) على التوازي: \(\frac{2\times6}{2+6}=1.5\ \Omega\)، ثم 1 Ω على التوالي: \(R_T=2.5\ \Omega\).</li></ol>
     <p>الخطوتان 1 و 2 هما الشكل (3-42ب)، والكتاب يكتب الخطوة 3 مباشرة.</p>`,title:'خطوات الاختزال'},
    {tip:String.raw`<p><b>قاعدة الاختزال:</b> ابدأ من أبعد نقطة عن المصدر، واجمع كل مجموعة «واضحة»: مقاومتان طرفاهما على نفس النقطتين ← توازي؛ مقاومتان متتاليتان لا يتفرع بينهما شيء ← توالي. وارسم الدائرة من جديد بعد كل خطوة.</p>`},
    {html:String.raw`<div class="w-row"><button class="btn pri" type="button" onclick="var b=document.querySelector('.ltabs button[data-tab=examples]');if(b)b.click()">افتح الحل خطوة بخطوة في «الأمثلة المحلولة»</button></div>`}
   ]},

  {st:4,short:'مثال <span class="ltr">(3-36)</span>',title:'مثال <span class="ltr">(3-36)</span>: تيار فرع وقدرة مقاومة',ref:'ص 93',
   q:'بعد أن عرفنا التيار الكلي (6 A)، كيف نعرف تيار الفرع الذي فيه 2 Ω و 4 Ω؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="الدائرة بعد الاختزال: 1 أوم ثم فرعان 2 أوم و 6 أوم على التوازي" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><path d="M50 90 L50 160" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M50 170 L50 240" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M34 160H66" stroke="#2C4A40" stroke-width="3"/><path d="M41 170H59" stroke="#2C4A40" stroke-width="6"/><text x="74" y="156" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">+</text><text x="36" y="170" text-anchor="end" font-size="11.5" fill="#2C4A40" font-weight="700">15V</text><path d="M50 90 L70 90" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M70 90 L79 90 L82.5 97 L89.5 83 L96.5 97 L103.5 83 L110.5 97 L117.5 83 L121 90 L130 90" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="100" y="74" text-anchor="middle" font-size="12" fill="#2C4A40" font-weight="700">1Ω</text><path d="M130 90 L180 90" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M147 90L152 90" stroke="#E8735A" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M163 90L152 95.5L152 84.5Z" fill="#E8735A"/><text x="155" y="78" text-anchor="middle" font-size="11.5" fill="#E8735A" font-weight="700">I = 6A</text><circle cx="180" cy="90" r="4" fill="#2C4A40"/><circle cx="180" cy="240" r="4" fill="#2C4A40"/><path d="M180 90 L290 90" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M290 240 L50 240" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="الفرع الأول ⟦2 Ω⟧ = مكافئ ⟦3 Ω⟧ و⟦6 Ω⟧. يأخذ ⟦I1 = 4.5 A⟧."><path d="M180 90 L180 143 L173 146.7 L187 154 L173 161.3 L187 168.7 L173 176 L187 183.3 L180 187 L180 240" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="170" y="168" text-anchor="end" font-size="12" fill="#2C4A40" font-weight="700">2Ω</text><path d="M180 109L180 112" stroke="#E8735A" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M180 123L174.5 112L185.5 112Z" fill="#E8735A"/><text x="190" y="122" text-anchor="start" font-size="11" fill="#E8735A" font-weight="700">I<tspan baseline-shift="sub" font-size="75%">1</tspan></text><rect x="164" y="100" width="44" height="130" fill="transparent"/></g><g data-tip="الفرع الثاني ⟦6 Ω⟧ = ⟦2 Ω + 4 Ω⟧ على التوالي. تياره ⟦I2⟧ هو المطلوب، وهو نفسه تيار المقاومة ⟦2 Ω⟧ الأصلية."><path d="M290 90 L290 143 L283 146.7 L297 154 L283 161.3 L297 168.7 L283 176 L297 183.3 L290 187 L290 240" fill="none" stroke="#E8735A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><text x="300" y="168" text-anchor="start" font-size="12" fill="#E8735A" font-weight="700">6Ω</text><path d="M242 90L247 90" stroke="#E8735A" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M258 90L247 95.5L247 84.5Z" fill="#E8735A"/><text x="250" y="78" text-anchor="middle" font-size="11.5" fill="#E8735A" font-weight="700">I<tspan baseline-shift="sub" font-size="75%">2</tspan></text><rect x="236" y="64" width="90" height="166" fill="transparent"/></g><text x="180" y="56" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">الشكل <tspan direction="ltr" unicode-bidi="embed">(3-42</tspan>ب)</text><text x="180" y="278" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">I<tspan baseline-shift="sub" font-size="75%">2</tspan> = [2/(2+6)] × 6 = 1.5 A</text></svg>`,
   cap:'الشكل <span class="ltr">(3-42ب)</span>: الدائرة بعد الاختزال الأول.<br><b>مرّر المؤشر على الفرعين (أو المسهما في الجوال) لتعرف ما يمثله كل منهما.</b>',
   side:[
    {predict:{q:String.raw`الفرعان 2 Ω و 6 Ω يتقاسمان 6 A. كم يأخذ الفرع 6 Ω (\(I_2\))؟`,opts:[
     ['4.5 A',false,String.raw`هذا تيار الفرع 2 Ω (\(I_1\))؛ المقاومة الأصغر تأخذ الأكثر.`],
     ['3 A',false,'التيار يتقاسم بالتساوي فقط إذا تساوت المقاومتان.'],
     ['1.5 A',true,String.raw`بقاعدة توزيع التيار: \(I_2=\frac{2}{2+6}\times6=1.5\ \text{A}\).`]]}}
   ],
   body:[
    {book:String.raw`<p><b>الحل:</b> من المثال (3-35) لدينا التيار \((I=6\ \text{A})\) وعند تطبيق قاعدة تقسيم التيار على هذه الدائرة المبينة في الشكل (3-42ب) نحصل على</p>
     $$I_2=\left[\frac{2}{2+6}\right]6=1.5\ \text{A}$$
     <p>وبالتالي تكون القدرة المفقودة في المقاومة 2 Ω هي:</p>
     $$P_{2\Omega}=I_2^2(2)=(1.5)^2\,2=4.5\ \text{W}$$`,ref:'ص 93'},
    {watch:String.raw`<p>في الكتاب تبدأ الصفحة بـ«الحل:» مباشرة، ولا يوجد عنوان «مثال (3-36)» ولا نص السؤال. يُفهم من الحل (ومن إشارة مثال 3-37 إليه) أن المطلوب: حساب التيار \(I_2\) والقدرة المفقودة في المقاومة 2 Ω (التي على التوالي مع 4 Ω) في دائرة الشكل (3-42أ).</p>`,fix:true},
    {tip:String.raw`<p>المقاومة 6 Ω في الشكل (3-42ب) ليست مقاومة حقيقية؛ هي 2 Ω و 4 Ω على التوالي. لذلك تيارها \(I_2\) هو نفسه تيار المقاومة 2 Ω الأصلية، ومنه نحسب قدرتها \(I^2R\).</p>`},
    {html:String.raw`<div class="w-row"><button class="btn pri" type="button" onclick="var b=document.querySelector('.ltabs button[data-tab=examples]');if(b)b.click()">افتح الحل خطوة بخطوة في «الأمثلة المحلولة»</button></div>`}
   ]},

  {st:5,short:'مثال <span class="ltr">(3-37)</span>',title:'مثال <span class="ltr">(3-37)</span>: قدرة كل مقاومة في الدائرة',ref:'ص 93',
   q:'خمس مقاومات وبطارية واحدة: كيف نعرف تيار كل مقاومة لنحسب قدرتها؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="أشرطة قدرات المقاومات الخمس: 36 و 27 و 13.5 و 9 و 4.5 واط، ومجموعها 90 واط" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><text x="180" y="46" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">من يمتص الـ <tspan direction="ltr" unicode-bidi="embed">90 W</tspan>؟</text><g data-tip="المقاومة ⟦1 Ω⟧ يمر فيها ⟦6 A⟧، فقدرتها ⟦P = I²R = 36 W⟧."><text x="70" y="88" text-anchor="end" font-size="12.5" fill="#2C4A40" font-weight="700">1 Ω</text><rect x="80" y="74" width="170" height="20" rx="4" fill="#E8735A" stroke="#2C4A40" stroke-width="1.5"/><text x="256" y="89" text-anchor="start" font-size="11.5" fill="#2C4A40" font-weight="700">36 W</text><rect x="40" y="70" width="260" height="28" fill="transparent"/></g><g data-tip="المقاومة ⟦3 Ω⟧ يمر فيها ⟦3 A⟧، فقدرتها ⟦P = I²R = 27 W⟧."><text x="70" y="122" text-anchor="end" font-size="12.5" fill="#2C4A40" font-weight="700">3 Ω</text><rect x="80" y="108" width="127.5" height="20" rx="4" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.5"/><text x="213.5" y="123" text-anchor="start" font-size="11.5" fill="#2C4A40" font-weight="700">27 W</text><rect x="40" y="104" width="260" height="28" fill="transparent"/></g><g data-tip="المقاومة ⟦6 Ω⟧ يمر فيها ⟦1.5 A⟧، فقدرتها ⟦P = I²R = 13.5 W⟧."><text x="70" y="156" text-anchor="end" font-size="12.5" fill="#2C4A40" font-weight="700">6 Ω</text><rect x="80" y="142" width="63.8" height="20" rx="4" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.5"/><text x="149.8" y="157" text-anchor="start" font-size="11.5" fill="#2C4A40" font-weight="700">13.5 W</text><rect x="40" y="138" width="260" height="28" fill="transparent"/></g><g data-tip="المقاومة ⟦4 Ω⟧ يمر فيها ⟦1.5 A⟧، فقدرتها ⟦P = I²R = 9 W⟧."><text x="70" y="190" text-anchor="end" font-size="12.5" fill="#2C4A40" font-weight="700">4 Ω</text><rect x="80" y="176" width="42.5" height="20" rx="4" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.5"/><text x="128.5" y="191" text-anchor="start" font-size="11.5" fill="#2C4A40" font-weight="700">9 W</text><rect x="40" y="172" width="260" height="28" fill="transparent"/></g><g data-tip="المقاومة ⟦2 Ω⟧ يمر فيها ⟦1.5 A⟧، فقدرتها ⟦P = I²R = 4.5 W⟧."><text x="70" y="224" text-anchor="end" font-size="12.5" fill="#2C4A40" font-weight="700">2 Ω</text><rect x="80" y="210" width="21.2" height="20" rx="4" fill="#4FB3A9" stroke="#2C4A40" stroke-width="1.5"/><text x="107.2" y="225" text-anchor="start" font-size="11.5" fill="#2C4A40" font-weight="700">4.5 W</text><rect x="40" y="206" width="260" height="28" fill="transparent"/></g><rect x="80" y="252" width="200" height="34" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="180" y="275" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">P<tspan baseline-shift="sub" font-size="75%">T</tspan> = 90 W = 15 × 6</text></svg>`,
   cap:'قدرة كل مقاومة في الشكل <span class="ltr">(3-42أ)</span>، مرتبة من الأكبر.<br><b>مرّر المؤشر على أي شريط (أو المسه في الجوال) لترى تيار المقاومة وحساب قدرتها.</b>',
   side:[
    {predict:{q:'أي مقاومة تمتص أكبر قدرة؟',opts:[
     ['المقاومة 6 Ω لأنها الأكبر',false,String.raw`قيمة المقاومة وحدها لا تكفي؛ القدرة \(I^2R\) والتيار فيها 1.5 A فقط (13.5 W).`],
     ['المقاومة 1 Ω',true,String.raw`يمر فيها التيار الكلي 6 A: \(6^2\times1=36\ \text{W}\)، وهي الأكبر.`],
     ['المقاومة 2 Ω',false,'تيارها 1.5 A، فقدرتها 4.5 W فقط، وهي الأصغر.']]}}
   ],
   body:[
    {book:String.raw`<p>احسب قيمة القدرات التي تمتصها المقاومات الموضحة في الشكل (3-42أ) في مثال (3-35) ثم أثبت أن مجموع هذه القدرات يساوي القدرة المسحوبة من البطارية.</p>
     <p><b>الحل:</b> من الشكل (3-42ب) في المثال (3-35) لدينا التيار</p>
     $$I_1=6\left[\frac{6}{2+6}\right]=4.5\ \text{A}$$
     <p>ومن الشكل (3-42أ) في المثال (3-35) نحصل على</p>
     $$I_3=\left(\frac{6}{3+6}\right)(4.5)=3\ \text{A}\qquad I_4=\left(\frac{3}{3+6}\right)(4.5)=1.5\ \text{A}$$
     <p>ومن المثال (3-36) لدينا التيار \((I_2=1.5\ \text{A})\) وحيث إن القدرة المفقودة في المقاومة هي \(P=I^2R\) ولذلك فإن</p>
     $$P_{3\Omega}=(3)^2\,3=27\ \text{W}\qquad P_{2\Omega}=(1.5)^2\,2=4.5\ \text{W}\qquad P_{1\Omega}=(6)^2\,1=36\ \text{W}$$
     $$P_{6\Omega}=(1.5)^2\,6=13.5\ \text{W}\qquad P_{4\Omega}=(1.5)^2\,4=9\ \text{W}$$
     <p>وبالتالي تكون القدرة الكلية \(P_T\) هي:</p>
     $$P_T=36+4.5+27+9+13.5=90\ \text{W}$$`,ref:'ص 93'},
    {watch:String.raw`<p>المثال يطلب إثبات أن مجموع القدرات يساوي قدرة البطارية، لكن الكتاب لا يكتب قدرة البطارية. وهي \(E\times I=15\times6=90\ \text{W}\)، فيتحقق المطلوب.</p>`},
    {tip:String.raw`<p>نرجع من الدائرة المختزلة إلى الأصلية خطوة خطوة: التيار الكلي 6 A ← يتوزع على الفرعين (4.5 A و 1.5 A) ← تيار الفرع الأول 4.5 A يتوزع على 3 Ω و 6 Ω (3 A و 1.5 A) ← تيار الفرع الثاني 1.5 A يمر في 2 Ω و 4 Ω معاً.</p>`,title:'من الأصغر إلى الأكبر ثم العكس'},
    {html:String.raw`<div class="w-row"><button class="btn pri" type="button" onclick="var b=document.querySelector('.ltabs button[data-tab=examples]');if(b)b.click()">افتح الحل خطوة بخطوة في «الأمثلة المحلولة»</button></div>`}
   ]},

  {recap:[
   String.raw`في الدوائر المركبة نبدأ من المعلوم: قدرة مقاومة ← جهدها ← تيارها، ثم قانون كيرشوف للتيار وقانون أوم (ص 90–91).`,
   String.raw`مجموع القدرات التي تمتصها المقاومات = القدرة التي يزودها المنبع؛ وهو أفضل تحقق من الحل (ص 91، 93).`,
   String.raw`الاختزال: توازي ← \(R_T=\frac{R_1R_2}{R_1+R_2}\) (3-31)، توالي ← مجموع، حتى مقاومة واحدة، ثم التيار الكلي من قانون أوم (ص 92).`,
   String.raw`للرجوع إلى تيارات الفروع نستعمل قاعدة توزيع التيار \(I_1=\frac{I\times R_2}{R_1+R_2}\) (3-34) ثم \(P=I^2R\) لكل مقاومة (ص 93).`]}
],
 theory:[
  {h:'مثال (3-33): إيجاد مقاومة من قدرة معلومة',ref:'ص 90–91',html:`<p>«احسب المقاومة R في الدائرة المبينة في الشكل (3-41) بحيث تكون القدرة المفقودة في المقاومة 3 Ω هي 300 W.»</p>
   <p>نبدأ من المعلوم: \\(P_{3\\Omega}=V_3^2/3=300\\) W ومنها \\(V_3=30\\) V، ثم \\(I_{3\\Omega}=30/3=10\\) A و \\(I_{6\\Omega}=30/6=5\\) A، فيكون التيار الكلي \\(I=10+5=15\\) A. والتيار نفسه \\(=\\frac{V}{1+R+\\frac{6\\times3}{6+3}}=\\frac{V}{3+R}\\) فيكون \\(V=45+15R=90\\) V ومنها</p>$$R=\\frac{90-45}{15}=3\\ \\Omega$$`},
  {fig:'(3-41)',ref:'ص 90',caption:'منبع 90 V، مقاومة 1 Ω ثم R على التوالي، ثم 3 Ω و 6 Ω على التوازي (الأرقام بالأوم)',draw:()=>box(fig341(),450)},
  {note:NOTE_ADD+'الفكرة: المقاومتان 3 Ω و 6 Ω على التوازي، فجهدهما واحد (V<sub>3</sub>)، لذلك نعرف تيار 6 Ω بمجرد أن نعرف V<sub>3</sub>. ومجموعهما هو التيار الذي يمر في 1 Ω و R (قانون كيرشوف للتيار).'},
  {h:'مثال (3-34): توازن القدرة',ref:'ص 91',html:'<p>«احسب القدرة التي تمتصها كل مقاومة في المثال (3-33) وأثبت أن القدرة الإجمالية التي يتم الحصول عليها تكون مماثلة لتلك التي يزودها المنبع.»</p>$$P_{loss}=\\frac{30^2}{6}+\\frac{30^2}{3}+3\\times15^2+1\\times15^2=1350\\ \\text{W}$$<p>«القدرة التي يزودها المنبع» \\(P=15\\times90=1350\\) W، «وواضح أن القدرة التي يزودها المنبع تكون مماثلة للقدرة الممتصة في المقاومات.»</p>'},
  {h:'مثال (3-35): اختزال الدائرة',ref:'ص 92',html:'<p>«احسب التيار المسحوب من البطارية 15V في الدائرة المبينة في الشكل (3-42أ).» «سنقوم أولاً باختزال الدائرة إلى مقاومة مكافئة واحدة وذلك كما هو موضح في الشكل (3-42ب)»:</p><ol><li>3 Ω و 6 Ω على التوازي: \\(\\frac{3\\times6}{3+6}=2\\ \\Omega\\).</li><li>2 Ω و 4 Ω على التوالي: \\(2+4=6\\ \\Omega\\).</li><li>الفرعان (2 Ω و 6 Ω) على التوازي ثم 1 Ω على التوالي:</li></ol>$$R_T=1+\\frac{2\\times6}{2+6}=1+\\frac{3}{2}=2.5\\ \\Omega,\\qquad I=\\frac{V}{R_T}=\\frac{15}{2.5}=6\\ \\text{A}$$'},
  {fig:'(3-42أ)',ref:'ص 92',caption:'البطارية 15 V، ثم 1 Ω، ثم فرعان: الأول (I1) فيه 3 Ω و 6 Ω على التوازي، والثاني (I2) فيه 2 Ω و 4 Ω على التوالي',draw:()=>box(fig342(0),480)},
  {fig:'(3-42ب)',ref:'ص 92',caption:'الدائرة بعد الاختزال الأول: الفرع الأول 2 Ω (= 3 ‖ 6) والفرع الثاني 6 Ω (= 2 + 4)',draw:()=>box(fig342(2),480)},
  {note:NOTE_ADD+'قاعدة الاختزال: ابدأ من أبعد نقطة عن المصدر، واجمع كل مجموعة «واضحة» (مقاومتان طرفاهما على نفس النقطتين ← توازي؛ مقاومتان متتاليتان لا يتفرع بينهما شيء ← توالي)، وارسم الدائرة من جديد بعد كل خطوة. في المختبر تقدر تنفذ الاختزال خطوة خطوة.'},
  {h:'مثال (3-36)',ref:'ص 93',html:'<p>المطلوب في هذا المثال (يُفهم من حله): حساب التيار \\(I_2\\) والقدرة المفقودة في المقاومة 2 Ω (التي على التوالي مع 4 Ω) في دائرة الشكل (3-42أ).</p><p>«من المثال (3-35) لدينا التيار \\((I=6\\ \\text{A})\\) وعند تطبيق قاعدة تقسيم التيار على هذه الدائرة المبينة في الشكل (3-42ب) نحصل على» \\(I_2=\\left[\\frac{2}{2+6}\\right]6=1.5\\) A «وبالتالي تكون القدرة المفقودة في المقاومة 2 Ω هي:» \\(P_{2\\Omega}=I_2^2(2)=(1.5)^2\\,2=4.5\\) W.</p>'},
  {h:'مثال (3-37)',ref:'ص 93',html:`<p>«احسب قيمة القدرات التي تمتصها المقاومات الموضحة في الشكل (3-42أ) في مثال (3-35) ثم أثبت أن مجموع هذه القدرات يساوي القدرة المسحوبة من البطارية.»</p>
   <p>\\(I_1=6\\left[\\frac{6}{2+6}\\right]=4.5\\) A، ثم \\(I_3=\\frac{6}{3+6}(4.5)=3\\) A و \\(I_4=\\frac{3}{3+6}(4.5)=1.5\\) A، ومن المثال (3-36) \\(I_2=1.5\\) A.</p>
   <div class="cb-tbl"><table class="tt"><thead><tr><th>المقاومة</th><th>التيار</th><th>\\(P=I^2R\\)</th></tr></thead><tbody><tr><td>1 Ω</td><td>6 A</td><td>36 W</td></tr><tr><td>3 Ω</td><td>3 A</td><td>27 W</td></tr><tr><td>6 Ω</td><td>1.5 A</td><td>13.5 W</td></tr><tr><td>2 Ω</td><td>1.5 A</td><td>4.5 W</td></tr><tr><td>4 Ω</td><td>1.5 A</td><td>9 W</td></tr><tr><td><b>المجموع</b></td><td></td><td><b>90 W</b></td></tr></tbody></table></div>
   <p>\\(P_T=36+4.5+27+9+13.5=90\\) W، وقدرة البطارية \\(15\\times6=90\\) W.</p>`},
  {err:`<div class="fixnote"><ul>
   <li><b>مثال (3-36) ص 93:</b> الصفحة تبدأ بـ«الحل:» مباشرة، ولا يوجد عنوان «مثال (3-36)» ولا نص السؤال. كتبنا المطلوب كما يُفهم من الحل ومن إشارة مثال (3-37) إليه.</li>
   <li><b>مثال (3-37) ص 93:</b> يطلب إثبات أن مجموع القدرات يساوي قدرة البطارية، لكنه لا يكتب قدرة البطارية؛ وهي \\(E\\times I=15\\times6=90\\) W فيتحقق المطلوب. أضفناها في الحل.</li>
   <li><b>مثال (3-33) ص 91:</b> طُبع «أو» بين سطري \\(I_{3\\Omega}\\) و \\(I_{6\\Omega}\\) والمقصود «و».</li></ul></div>`}
 ],
 lab:(el)=>{
  let mode='f42',st=0;const v={E:15,a:1,b:3,c:6,d:2,e:4};let E41=90,R41=1;
  const NM={E:'جهد البطارية E',a:'المقاومة 1 Ω (على التوالي)',b:'المقاومة 3 Ω',c:'المقاومة 6 Ω',d:'المقاومة 2 Ω',e:'المقاومة 4 Ω'};
  el.innerHTML=`<div class="grid cb-lab">
   <div class="panel c12"><h2>الدائرة المركبة <small>مبنية على الشكلين (3-42أ، ب) ص 92 والشكل (3-41) ص 90</small></h2>
    <div class="cb-row">${segHTML('md',[['f42','اختزال الشكل (3-42)'],['f41','الشكل (3-41): ابحث عن R']],mode)}</div></div>
   <div class="panel c7" id="l10A"><h2 id="l10h"></h2>
    <div class="cb-row"><button class="btn" id="l10b">◀ خطوة للخلف</button><button class="btn primary" id="l10n">الخطوة التالية ▶</button><button class="btn" id="l10r">من البداية</button></div>
    <div class="svgbox" id="l10c" style="max-width:520px;margin-inline:auto"></div><div id="l10s"></div></div>
   <div class="panel c5" id="l10B"><h2>القيم</h2><div id="l10sl"></div><div class="facts">${fact('R<sub>T</sub>','l10RT')}${fact('تيار البطارية I','l10I')}${fact('قدرة البطارية E·I','l10PS')}${fact('مجموع قدرات المقاومات','l10PR')}</div><div id="l10bars"></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l10st"></ol></div></div>`;
  B.math(el);const $=s=>el.querySelector(s);
  const TXT=['الدائرة الأصلية — الشكل (3-42أ)','الخطوة 1: 3 Ω و 6 Ω على التوازي','الخطوة 2: 2 Ω و 4 Ω على التوالي — الشكل (3-42ب)','الخطوة 3: الفرعان على التوازي','الخطوة 4: مع 1 Ω على التوالي = R<sub>T</sub>'];
  const sliders=()=>{if(mode==='f42'){$('#l10sl').innerHTML=Object.keys(v).map(k=>sl('l10'+k,NM[k],k==='E'?0:0.5,k==='E'?60:20,0.5,v[k])).join('');Object.keys(v).forEach(k=>{$('#l10'+k).oninput=e=>{v[k]=+e.target.value;upd()}})}
    else{$('#l10sl').innerHTML=sl('l10E41','جهد المنبع',0,150,1,E41)+sl('l10R41','المقاومة R',0,20,0.1,R41)+'<p class="sub">ابحث عن R التي تجعل القدرة في المقاومة 3 Ω تساوي 300 W.</p>';$('#l10E41').oninput=e=>{E41=+e.target.value;upd()};$('#l10R41').oninput=e=>{R41=+e.target.value;upd()}}};
  const upd=()=>{let rows,PS,PR,RT,I;
   if(mode==='f42'){Object.keys(v).forEach(k=>{const o=$('#l10'+k+'-v');if(o)o.textContent=fm(v[k])+(k==='E'?' V':' Ω')});
    const r=s335(v,{round:(x)=>x});RT=r.RT;I=r.I;const L={I:r.I,I1:r.I1,I2:r.I2,I3:r.I3,I4:r.I4};
    $('#l10h').innerHTML=TXT[st];$('#l10c').innerHTML=fig342(st,v,L);
    const ex=[`\\(\\frac{${fm(v.b)}\\times${fm(v.c)}}{${fm(v.b)}+${fm(v.c)}}=${fm(sig(r.P,4))}\\ \\Omega\\)`,`\\(${fm(v.d)}+${fm(v.e)}=${fm(r.Sr)}\\ \\Omega\\)`,`\\(\\frac{${fm(sig(r.P,4))}\\times${fm(r.Sr)}}{${fm(sig(r.P,4))}+${fm(r.Sr)}}=${fm(sig(r.P*r.Sr/(r.P+r.Sr),4))}\\ \\Omega\\)`,`\\(R_T=${fm(v.a)}+${fm(sig(r.P*r.Sr/(r.P+r.Sr),4))}=${fm(sig(r.RT,4))}\\ \\Omega\\)، و \\(I=E/R_T=${fm(sig(r.I,4))}\\) A`];
    $('#l10s').innerHTML=`<ol class="cb-try">${ex.slice(0,st).map(x=>`<li>${x}</li>`).join('')}</ol>`+(st===4?'<div class="callout">الآن نرجع للخلف: التيارات على الرسم (الخطوة 0) محسوبة بقاعدة توزيع التيار من I.</div>':'');B.math($('#l10s'));
    rows=[['1 Ω',v.a,r.I],['3 Ω',v.b,r.I3],['6 Ω',v.c,r.I4],['2 Ω',v.d,r.I2],['4 Ω',v.e,r.I2]].map(([n,R,i])=>({l:`<span class="ltr">${n.replace(/^\d+/,fm(R))} (I = ${fm(sig(i,4))} A)</span>`,v:i*i*R,t:fm(sig(i*i*R,4))+' W'}));PS=v.E*I}
   else{$('#l10E41-v').textContent=fm(E41)+' V';$('#l10R41-v').textContent=fm(R41)+' Ω';const Rp=2;RT=1+R41+Rp;I=E41/RT;const V3=I*Rp,I3=V3/3,I6=V3/6;
    $('#l10h').innerHTML='الشكل (3-41)';$('#l10c').innerHTML=fig341({R:'R = '+fm(R41)+' Ω',live:{E:E41,I,I3,I6}});
    const P3=V3*V3/3;$('#l10s').innerHTML=`<div class="callout ${Math.abs(P3-300)<0.5?'':'err'}">القدرة في المقاومة 3 Ω: <b class="ltr">${fm(sig(P3,4))} W</b> ${Math.abs(P3-300)<0.5?'— وصلت إلى 300 W كما يطلب مثال (3-33).':'(المطلوب 300 W)'}</div>`;
    rows=[['1 Ω',1,I],['R',R41,I],['3 Ω',3,I3],['6 Ω',6,I6]].map(([n,R,i])=>({l:`<span class="ltr">${n} (I = ${fm(sig(i,4))} A)</span>`,v:i*i*R,t:fm(sig(i*i*R,4))+' W'}));PS=E41*I}
   PR=rows.reduce((s,r)=>s+r.v,0);$('#l10RT').textContent=fm(sig(RT,4))+' Ω';$('#l10I').textContent=fm(sig(I,4))+' A';$('#l10PS').textContent=fm(sig(PS,4))+' W';$('#l10PR').textContent=fm(sig(PR,4))+' W';
   $('#l10bars').innerHTML=barsHTML([{l:'قدرة المنبع',v:PS,t:fm(sig(PS,4))+' W',src:1}].concat(rows),PS);
   $('#l10b').disabled=mode!=='f42'||st===0;$('#l10n').disabled=mode!=='f42'||st===4;['#l10b','#l10n','#l10r'].forEach(q=>$(q).style.display=mode==='f42'?'':'none');
   steps.check()};
  $('#l10n').onclick=()=>{st=Math.min(4,st+1);upd()};$('#l10b').onclick=()=>{st=Math.max(0,st-1);upd()};$('#l10r').onclick=()=>{st=0;upd()};
  segBind(el,'md',m=>{mode=m;sliders();upd()});
  const bookV=()=>v.E===15&&v.a===1&&v.b===3&&v.c===6&&v.d===2&&v.e===4;
  const steps=stepsUI($('#l10st'),[
   {t:'اختزل الدائرة',x:'اضغط «الخطوة التالية» أربع مرات حتى تصل إلى مقاومة واحدة: <span class="ltr">R<sub>T</sub> = 2.5 Ω</span> و <span class="ltr">I = 6 A</span> (مثال 3-35).',done:()=>mode==='f42'&&st===4&&bookV()},
   {t:'ارجع واقرأ التيارات',x:'اضغط «من البداية»: على الرسم الأصلي <span class="ltr">I<sub>1</sub> = 4.5 A</span>، <span class="ltr">I<sub>2</sub> = 1.5 A</span>، <span class="ltr">I<sub>3</sub> = 3 A</span>، <span class="ltr">I<sub>4</sub> = 1.5 A</span> (المثالان 3-36 و 3-37).',done:()=>mode==='f42'&&st===0&&bookV()},
   {t:'توازن القدرة',x:'قارن عمود «قدرة المنبع» بمجموع قدرات المقاومات: كلاهما <span class="ltr">90 W</span>. غيّر أي مقاومة: يبقيان متساويين دائماً.'},
   {t:'مثال (3-33): ابحث عن R',x:'اختر «الشكل (3-41)» وحرّك R حتى تصبح القدرة في المقاومة 3 Ω تساوي <span class="ltr">300 W</span>.',done:()=>mode==='f41'&&E41===90&&Math.abs(R41-3)<1e-9},
   {t:'مثال (3-34)',x:'عند <span class="ltr">R = 3 Ω</span>: قدرة المنبع <span class="ltr">1350 W</span> = 225 + 675 + 300 + 150. زد R ولاحظ أن كل القدرات تنقص لأن التيار الكلي ينقص.'}
  ]);
  sliders();upd();
 },
 examples:[
  {title:'مثال (3-33)',ref:'ص 90–91',q:'<p>«احسب المقاومة R في الدائرة المبينة في الشكل (3-41) بحيث تكون القدرة المفقودة في المقاومة 3 Ω هي 300 W.»</p>'+box(fig341(),420),given:G333,solve:solve333,note:'<span class="fixnote">في الكتاب كلمة «أو» بين سطري التيارين، والمقصود «و».</span>'},
  {title:'مثال (3-34)',ref:'ص 91',q:'<p>«احسب القدرة التي تمتصها كل مقاومة في المثال (3-33) وأثبت أن القدرة الإجمالية التي يتم الحصول عليها تكون مماثلة لتلك التي يزودها المنبع.»</p>',given:G333,solve:solve334},
  {title:'مثال (3-35)',ref:'ص 92',q:'<p>«احسب التيار المسحوب من البطارية 15V في الدائرة المبينة في الشكل (3-42أ).»</p>'+box(fig342(0),440),given:G335,solve:solve335},
  {title:'مثال (3-36)',ref:'ص 93',q:'<p><span class="fixnote">(نص السؤال غير مطبوع في الكتاب؛ المطلوب كما يُفهم من الحل:)</span> احسب التيار \\(I_2\\) والقدرة المفقودة في المقاومة 2 Ω في دائرة الشكل (3-42أ).</p>'+box(fig342(2),440),given:G335,solve:solve336},
  {title:'مثال (3-37)',ref:'ص 93',q:'<p>«احسب قيمة القدرات التي تمتصها المقاومات الموضحة في الشكل (3-42أ) في مثال (3-35) ثم أثبت أن مجموع هذه القدرات يساوي القدرة المسحوبة من البطارية.»</p>',given:G335,solve:solve337,note:'السطر الأخير (قدرة البطارية) أضفناه لإكمال الإثبات؛ الكتاب لا يكتبه.'}
 ],
 quiz:[
  {q:'في مثال (3-33) عرفنا قدرة المقاومة 3 Ω. أول ما نحسبه منها:',o:['التيار الكلي','جهدها \\(V_3=\\sqrt{P\\,R}\\)','المقاومة R','قدرة المنبع'],c:1,e:'\\(V_3=\\sqrt{300\\times3}=30\\) V.'},
  {q:'3 Ω و 6 Ω على التوازي وجهدهما 30 V. التيار الكلي فيهما:',o:['5 A','10 A','15 A','30 A'],c:2,e:'10 + 5 = 15 A.'},
  {q:'في أي دائرة مقاومات، مجموع القدرات المستهلكة في المقاومات:',o:['أكبر من قدرة المنبع','يساوي قدرة المنبع','أصغر من قدرة المنبع','لا علاقة بينهما'],c:1,e:'المثالان (3-34) و(3-37).'},
  {q:'في الشكل (3-42أ)، المقاومتان 2 Ω و 4 Ω:',o:['على التوازي','على التوالي','مقصورتان','غير موصلتين'],c:1,e:'يمر فيهما نفس التيار I<sub>2</sub>، فمجموعهما 6 Ω.'},
  {q:'R<sub>T</sub> للشكل (3-42أ):',o:['16 Ω','2.5 Ω','6 Ω','1.5 Ω'],c:1,e:'\\(1+\\frac{2\\times6}{2+6}=2.5\\ \\Omega\\).'},
  {q:'تيار 6 A ينقسم على فرعين 2 Ω و 6 Ω. تيار الفرع 6 Ω:',o:['4.5 A','1.5 A','3 A','2 A'],c:1,e:'\\(6\\times\\frac{2}{2+6}=1.5\\) A (مثال 3-36).'},
  {q:'أكبر قدرة في دائرة مثال (3-37) تستهلكها المقاومة:',o:['1 Ω (يمر فيها التيار الكلي 6 A)','6 Ω','4 Ω','2 Ω'],c:0,e:'\\(6^2\\times1=36\\) W.'}
 ]
});

/* ======================================================================
   Lesson 11 (u3-l11) — ربط النجمة وربط الدلتا (Δ–Y) + القنطرة (ص 94–97)
   ====================================================================== */
/* positions: delta N3 top, N1 bottom-left, N2 bottom-right */
const DN={N3:[170,34],N1:[80,190],N2:[260,190]},SN={c:[420,118],N3:[420,34],N1:[330,190],N2:[510,190]};
/* side labels: fixed (corrected) = Ra N1–N3, Rb N1–N2, Rc N3–N2 ; book = Ra N1–N3, Rb N3–N2, Rc N1–N2 */
const SIDES={fixed:{Ra:['N1','N3'],Rb:['N1','N2'],Rc:['N3','N2']},book:{Ra:['N1','N3'],Rb:['N3','N2'],Rc:['N1','N2']}};
function fig343(mode,o){o=o||{};const sd=SIDES[mode||'fixed'],vD=o.vD||{},vS=o.vS||{};let s='';
  Object.entries(sd).forEach(([k,[p,q]])=>{const [x1,y1]=DN[p],[x2,y2]=DN[q];s+=zz(x1,y1,x2,y2,'',7);const mx=(x1+x2)/2,my=(y1+y2)/2;const base=Math.abs(y1-y2)<1;
    const tx=base?mx:mx+(mx<170?-18:18),ty=base?my+26:my;const hl=o.hl===k?'--stop':null;s+=T(tx,ty,k.replace(/^R/,'R_')+(vD[k]!=null?' = '+vD[k]:''),{a:base?'middle':(mx<170?'end':'start'),col:hl||(mode==='book'&&k!=='Ra'?'--live':null)})});
  Object.entries(DN).forEach(([k,[x,y]])=>{s+=Dot(x,y)+T(x+(k==='N1'?-8:k==='N2'?8:0),y+(k==='N3'?-10:18),k.replace('N','N_'),{a:k==='N1'?'end':k==='N2'?'start':'middle'})});
  const [cx,cy]=SN.c;[['R3','N3'],['R1','N1'],['R2','N2']].forEach(([r,n])=>{const [x,y]=SN[n];s+=zz(cx,cy,x,y,'',6);const lx=(cx+x)/2,ly=(cy+y)/2;s+=T(lx+(n==='N3'?14:n==='N1'?-12:12),ly+(n==='N3'?4:-4),r.replace('R','R_')+(vS[r]!=null?' = '+vS[r]:''),{a:n==='N1'?'end':'start'})+Dot(x,y)+T(x+(n==='N1'?-8:n==='N2'?8:0),y+(n==='N3'?-10:18),n.replace('N','N_'),{a:n==='N1'?'end':n==='N2'?'start':'middle'})});
  s+=Dot(cx,cy)+arT(170,236,'دلتا Δ',{fs:13})+arT(440,236,'نجمة Y',{fs:13});
  return svg(600,246,s,'ربط دلتا وربط نجمة')}
/* bridge: st 0 = (3-44أ), 1 = (3-44ب). v={ab,bc,ac,ad,cd}; L = live currents map or null */
function fig344(st,v,L){v=v||{ab:3,bc:6,ac:9,ad:4.5,cd:3};const f=x=>L&&Math.abs(x)>1e-6?'flow':'';const lab=x=>fm(sig(x,4))+'Ω';const cur=(k)=>L&&L[k]!=null?T(0,0,''):'';
  const b=[200,60],a=[80,150],c=[320,150],d=[200,250];let s=Term(200,18,'A',{dx:14,dy:4,a:'start'})+W([[200,22],[200,60]],L?'flow':'')+Term(200,290,'B',{dx:14,dy:4,a:'start'})+W([[200,250],[200,286]],L?'flow':'');
  const R=(p,q,l,k,side)=>{const pts=L&&L[k]<0?[q,p]:[p,q];return zz(pts[0][0],pts[0][1],pts[1][0],pts[1][1],f(L?L[k]:0),6)+T((p[0]+q[0])/2+(side||0),(p[1]+q[1])/2+(side?4:-12),l+(L&&L[k]!=null?`  ${fm(sig(Math.abs(L[k]),3))}A`:''),{a:side<0?'end':side>0?'start':'middle',fs:11})};
  if(st===0){s+=R(b,a,lab(v.ab),'ab',-14)+R(b,c,lab(v.bc),'bc',14)+R(a,c,lab(v.ac),'ac',0)+R(a,d,lab(v.ad),'ad',-14)+R(c,d,lab(v.cd),'cd',14);
    [['b',b],['a',a],['c',c],['d',d]].forEach(([n,[x,y]])=>{s+=Dot(x,y)+T(x+(n==='a'?-10:n==='c'?10:-12),y+(n==='b'?-4:n==='d'?16:-8),n,{a:n==='c'?'start':'end',fs:13})})}
  else{const S=v.ab+v.bc+v.ac,ao=v.ac*v.ab/S,bo=v.bc*v.ab/S,co=v.bc*v.ac/S,o=[200,140];
    s+=R(b,o,lab(bo),'bo',14)+R(o,a,lab(ao),'ao',0)+R(o,c,lab(co),'oc',0)+R(a,d,lab(v.ad),'ad',-14)+R(c,d,lab(v.cd),'cd',14);
    [['b',b],['o',o],['a',a],['c',c],['d',d]].forEach(([n,[x,y]])=>{s+=Dot(x,y)+T(x+(n==='a'?-10:n==='c'?10:n==='o'?-10:-12),y+(n==='b'?-4:n==='d'?16:n==='o'?-8:-8),n,{a:n==='c'?'start':'end',fs:13})})}
  return svg(420,300,s,st?'الشبكة بعد تحويل الدلتا إلى نجمة':'شبكة القنطرة')}

const T31=[[1,12,34],[18.5,45.36,16.78],[1264,2345,657],[0.354,1.216,18.402],[87.5,132,220],[13546,12868,66453]];   // R3,R1,R2
const T31P=[[13.353,37.833,454],[113.87,42.124,103.283],[8121,2275,4221],[1.593,24.113,82.829],[272,453.333,683.886],[29078,147864,140463]]; // printed: Σ/R2, Σ/R1, Σ/R3
const T32=[[16,27,76],[158,545,227],[1320,725,38],[0.76,1.45,3.12],[12000,45625,27210]];  // RA,RC,RB
const T32P=[[3.63,10.218,17.244],[92.591,38.566,133.027],[459.434,24.081,13.226],[0.206754,0.444878,0.84878],[6454,3849,14634]]; // R3,R1,R2
const y2d=(R1,R2,R3)=>{const S=R1*R2+R2*R3+R3*R1;return {S,Ra:S/R2,Rb:S/R3,Rc:S/R1}};
const d2y=(Ra,Rb,Rc)=>{const S=Ra+Rb+Rc;return {S,R1:Ra*Rb/S,R2:Rb*Rc/S,R3:Ra*Rc/S}};
const pd=x=>{const a=Math.abs(x);return a>=1000?0:a>=100?3:a>=1?3:6};
function table31(mode){const bk=mode==='book';const H=bk?['«R<sub>b</sub> [Ω]?»','«R<sub>c</sub> [Ω]?»','«R<sub>c</sub> [Ω]?»']:['R<sub>a</sub> = Σ/R<sub>2</sub> [Ω]','R<sub>c</sub> = Σ/R<sub>1</sub> [Ω]','R<sub>b</sub> = Σ/R<sub>3</sub> [Ω]'];
  return `<div class="cb-tbl"><table class="tt"><thead><tr><th>الحالة</th><th>R<sub>3</sub> [Ω]</th><th>R<sub>1</sub> [Ω]</th><th>R<sub>2</sub> [Ω]</th>${H.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${T31.map(([R3,R1,R2],i)=>{const r=y2d(R1,R2,R3),ex=[r.Ra,r.Rc,r.Rb];
   return `<tr><td>${i+1}</td><td>${R3}</td><td>${R1}</td><td>${R2}</td>${ex.map((x,j)=>{const p=T31P[i][j],badv=Math.abs(p-x)/x>0.0005;return bk?`<td class="${badv?'bad':''}">${p}</td>`:`<td class="${badv?'ok':''}">${fm(x,i===5||i===2?1:3)}</td>`}).join('')}</tr>`}).join('')}</tbody></table></div>`}
function table32(){return `<div class="cb-tbl"><table class="tt"><thead><tr><th>الحالة</th><th>R<sub>A</sub> [Ω]</th><th>R<sub>C</sub> [Ω]</th><th>R<sub>B</sub> [Ω]</th><th>R<sub>3</sub> [Ω]?</th><th>R<sub>1</sub> [Ω]?</th><th>R<sub>2</sub> [Ω]?</th></tr></thead><tbody>${T32.map((r,i)=>`<tr><td>${i+1}</td><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td>${T32P[i].map(x=>`<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`}

function solve338(g,B,bk,book6){if(!(g.R1>0&&g.R2>0&&g.R3>0))return bad('المقاومات يجب أن تكون أكبر من صفر.');const r=y2d(g.R1,g.R2,g.R3),S=B.round(r.S,4);
  const P=book6&&bk?{Ra:29078,Rc:147864,Rb:140463}:null,d=book6?(bk?0:1):null,rd=book6?(bk?0:1):3;
  return [{t:'مجموع حواصل الضرب (البسط المشترك في المعادلات 3-36):',f:`\\Sigma=R_1R_2+R_2R_3+R_3R_1=(${fm(g.R1)})(${fm(g.R2)})+(${fm(g.R2)})(${fm(g.R3)})+(${fm(g.R3)})(${fm(g.R1)})`,v:S,unit:'',dp:book6?0:null},
   {t:'',f:`R_a=\\frac{\\Sigma}{R_2}=\\frac{${fm(S)}}{${fm(g.R2)}}`,v:P?P.Ra:B.round(r.Ra,rd),unit:'Ω',dp:d,final:true},
   {t:'',f:`R_b=\\frac{\\Sigma}{R_3}=\\frac{${fm(S)}}{${fm(g.R3)}}`,v:P?P.Rb:B.round(r.Rb,rd),unit:'Ω',dp:d,final:true},
   {t:'',f:`R_c=\\frac{\\Sigma}{R_1}=\\frac{${fm(S)}}{${fm(g.R1)}}`,v:P?P.Rc:B.round(r.Rc,rd),unit:'Ω',dp:d,final:true}].concat(P?[{t:'<b>كما في الكتاب:</b> هذه هي الأرقام المطبوعة في الحالة 6 من الجدول (3-1)، وهي لا تساوي \\(\\Sigma/R\\) — انظر الحل المصحح.'}]:[])}
function solve339(g,B){if(!(g.Ra>0&&g.Rb>0&&g.Rc>0))return bad('المقاومات يجب أن تكون أكبر من صفر.');const r=d2y(g.Ra,g.Rb,g.Rc);
  return [{t:'مجموع مقاومات الدلتا:',f:`R_a+R_b+R_c=${fm(g.Ra)}+${fm(g.Rb)}+${fm(g.Rc)}`,v:B.round(r.S,4),unit:'Ω'},
   {t:'بالمعادلات (3-37):',f:`R_1=\\frac{R_aR_b}{R_a+R_b+R_c}=\\frac{(${fm(g.Ra)})(${fm(g.Rb)})}{${fm(r.S)}}`,v:B.round(r.R1,3),unit:'Ω',final:true},
   {t:'',f:`R_2=\\frac{R_bR_c}{R_a+R_b+R_c}=\\frac{(${fm(g.Rb)})(${fm(g.Rc)})}{${fm(r.S)}}`,v:B.round(r.R2,3),unit:'Ω',final:true},
   {t:'',f:`R_3=\\frac{R_aR_c}{R_a+R_b+R_c}=\\frac{(${fm(g.Ra)})(${fm(g.Rc)})}{${fm(r.S)}}`,v:B.round(r.R3,3),unit:'Ω',final:true}]}
function solve340(g,B){const ks=['ab','bc','ac','ad','cd'];if(!ks.every(k=>g[k]>0))return bad('المقاومات يجب أن تكون أكبر من صفر.');const S=B.round(g.ab+g.bc+g.ac,4);
  const ao=B.round(g.ac*g.ab/S,4),bo=B.round(g.bc*g.ab/S,4),co=B.round(g.bc*g.ac/S,4),x=B.round(ao+g.ad,4),y=B.round(co+g.cd,4),od=B.round(x*y/(x+y),4);
  return [{t:'نحول شبكة الدلتا abc إلى شبكة نجمية باستخدام المعادلة (3-37):',f:`R_{ao}=\\frac{(${fm(g.ac)}\\times${fm(g.ab)})}{${fm(g.ab)}+${fm(g.bc)}+${fm(g.ac)}}`,v:ao,unit:'Ω'},
   {t:'',f:`R_{bo}=\\frac{(${fm(g.bc)}\\times${fm(g.ab)})}{${fm(S)}}`,v:bo,unit:'Ω'},{t:'',f:`R_{co}=\\frac{(${fm(g.bc)}\\times${fm(g.ac)})}{${fm(S)}}`,v:co,unit:'Ω'},
   {t:'من الدائرة المكافئة الشكل (3-44ب) (توالي/توازي):',f:`R_{od}=\\frac{(${fm(ao)}+${fm(g.ad)})(${fm(co)}+${fm(g.cd)})}{${fm(ao)}+${fm(g.ad)}+${fm(co)}+${fm(g.cd)}}`,v:od,unit:'Ω'},
   {t:'ولذلك:',f:`R_{AB}=R_{bo}+R_{od}=${fm(bo)}+${fm(od)}`,v:B.round(bo+od,4),unit:'Ω',final:true}]}

B.lesson({
 id:'u3-l11',unit:3,order:11,pages:'94–97',
 title:'ربط النجمة وربط الدلتا (Δ–Y) وتطبيقه على القنطرة',
 summary:'ثلاث مقاومات قد لا تكون على التوالي ولا على التوازي، بل على شكل نجمة Y (T) أو دلتا Δ (π). نحول أحد الربطين إلى مكافئه من النوع الآخر بالمعادلتين (3-36) و(3-37) بحيث تبقى المقاومة بين كل طرفين كما هي، ثم نحل الشبكة بالتوالي والتوازي. مع الجدولين (3-1) و(3-2) ومثال القنطرة (3-40).',
 stations:[
  {intro:true},

  {st:1,short:'نجمة ودلتا',title:'ربط النجمة وربط الدلتا <span class="ltr">(Δ – Y)</span>',ref:'ص 94',
   q:'ثلاث مقاومات ليست على التوالي ولا على التوازي: هل نستطيع أن نستبدلها بثلاث أخرى «تتصرف» مثلها تماماً؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ربط دلتا يساراً وربط نجمة يميناً بنفس الأطراف الثلاثة N1 و N2 و N3" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><g data-tip="⟦Ra⟧: ضلع الدلتا بين ⟦N1⟧ و⟦N3⟧. يقابل ذراع النجمة ⟦R2⟧."><path d="M30 210 L51.4 165.8 L59.1 166 L49.2 154.3 L64.6 154.7 L54.7 142.9 L70 143.4 L60.2 131.6 L75.5 132.1 L70.6 126.2 L92 82" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="49" y="150" text-anchor="end" font-size="13" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">a</tspan></text><rect x="20" y="76" width="82" height="152" fill="transparent"/></g><g data-tip="⟦Rb⟧: ضلع الدلتا بين ⟦N1⟧ و⟦N2⟧ (في الرسم المصحح). يقابل ذراع النجمة ⟦R3⟧."><path d="M30 210 L68 210 L71.1 217 L77.4 203 L83.7 217 L90 203 L96.3 217 L102.6 203 L108.9 217 L112 210 L150 210" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="90" y="236" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">b</tspan></text><rect x="20" y="204" width="140" height="24" fill="transparent"/></g><g data-tip="⟦Rc⟧: ضلع الدلتا بين ⟦N3⟧ و⟦N2⟧ (في الرسم المصحح). يقابل ذراع النجمة ⟦R1⟧."><path d="M92 82 L111.9 126 L106.8 131.7 L122.2 131.7 L112 143.2 L127.4 143.1 L117.2 154.6 L132.6 154.6 L122.4 166.1 L130.1 166 L150 210" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="133" y="150" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">c</tspan></text><rect x="82" y="76" width="78" height="152" fill="transparent"/></g><circle cx="92" cy="82" r="5" fill="#2C4A40"/><text x="92" y="70" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700">N<tspan baseline-shift="sub" font-size="75%">3</tspan></text><circle cx="30" cy="210" r="5" fill="#2C4A40"/><text x="22" y="232" text-anchor="end" font-size="12.5" fill="#2C4A40" font-weight="700">N<tspan baseline-shift="sub" font-size="75%">1</tspan></text><circle cx="150" cy="210" r="5" fill="#2C4A40"/><text x="158" y="232" text-anchor="start" font-size="12.5" fill="#2C4A40" font-weight="700">N<tspan baseline-shift="sub" font-size="75%">2</tspan></text><g data-tip="⟦R3⟧: ذراع النجمة إلى الطرف ⟦N3⟧."><path d="M272 156 L272 141 L279 137.3 L265 130 L279 122.7 L265 115.3 L279 108 L265 100.7 L272 97 L272 82" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="284" y="123" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">3</tspan></text><rect x="262" y="76" width="20" height="86" fill="transparent"/></g><g data-tip="⟦R1⟧: ذراع النجمة إلى الطرف ⟦N1⟧."><path d="M272 156 L260.6 167.4 L253 165.1 L257.7 180.2 L242.6 175.5 L247.4 190.5 L232.3 185.8 L237 200.9 L229.4 198.6 L218 210" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="233" y="179" text-anchor="end" font-size="13" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">1</tspan></text><rect x="208" y="150" width="74" height="66" fill="transparent"/></g><g data-tip="⟦R2⟧: ذراع النجمة إلى الطرف ⟦N2⟧."><path d="M272 156 L284.2 167.7 L281.9 175.3 L296.9 170.3 L292.5 185.5 L307.5 180.5 L303.1 195.7 L318.1 190.7 L315.8 198.3 L328 210" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="312" y="179" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">2</tspan></text><rect x="262" y="150" width="76" height="66" fill="transparent"/></g><circle cx="272" cy="82" r="5" fill="#2C4A40"/><text x="272" y="70" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700">N<tspan baseline-shift="sub" font-size="75%">3</tspan></text><circle cx="218" cy="210" r="5" fill="#2C4A40"/><text x="210" y="232" text-anchor="end" font-size="12.5" fill="#2C4A40" font-weight="700">N<tspan baseline-shift="sub" font-size="75%">1</tspan></text><circle cx="328" cy="210" r="5" fill="#2C4A40"/><text x="336" y="232" text-anchor="start" font-size="12.5" fill="#2C4A40" font-weight="700">N<tspan baseline-shift="sub" font-size="75%">2</tspan></text><g data-tip="مركز النجمة: نقطة مشتركة بين الأذرع الثلاثة، وليست طرفاً خارجياً."><circle cx="272" cy="156" r="6" fill="#F2C14E"/><circle cx="272" cy="156" r="6" fill="none" stroke="#2C4A40" stroke-width="2"/><rect x="260" y="144" width="24" height="24" fill="transparent"/></g><text x="92" y="262" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">دلتا Δ (π)</text><text x="272" y="262" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">نجمة <tspan direction="ltr" unicode-bidi="embed">Y</tspan> <tspan direction="ltr" unicode-bidi="embed">(T)</tspan></text><text x="180" y="44" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700" direction="rtl">الشكل <tspan direction="ltr" unicode-bidi="embed">(3-43)</tspan> — الأسماء مصححة</text><text x="180" y="290" text-anchor="middle" font-size="13" fill="#12855A" font-weight="700" direction="rtl">نفس المقاومة بين كل طرفين</text></svg>`,
   cap:'الشكل <span class="ltr">(3-43)</span>: دلتا ونجمة بنفس الأطراف الثلاثة <span class="fixnote">(اسما <span class="ltr">R<sub>b</sub></span> و<span class="ltr">R<sub>c</sub></span> مصححان — انظر «انتبه»)</span>.<br><b>مرّر المؤشر على الأضلاع والأذرع والمركز (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:'متى يكون ربط الدلتا مكافئاً لربط النجمة حسب الكتاب؟',opts:[
     ['إذا تساوت المقاومات الست كلها',false,'لا يُشترط ذلك؛ قيم الدلتا تختلف عادة عن قيم النجمة.'],
     ['إذا كانت المقاومة بين أي طرفين في الدلتا مساوية للمقاومة بين نفس الطرفين في النجمة',true,'نص الكتاب ص 94: «تكافؤ الربطين يتطلب أن تكون المقاومة بين أي طرفين من الربط Δ مساوية للمقاومة بين نفس الطرفين للربط Y».'],
     ['إذا كان مجموع مقاومات الدلتا يساوي مجموع مقاومات النجمة',false,'المجموع ليس هو الشرط؛ الشرط على المقاومة بين كل طرفين.']]}}
   ],
   body:[
    {book:String.raw`<p>يحدث كثيراً أن ترتبط ثلاث مقاومات، <b>لا على التوازي ولا على التوالي</b> بل على الشكل <b>نجمي Y</b> ويشار إليه أيضاً <b>بالربط T</b> أو أن ترتبط على الشكل <b>دلتا</b> ويشار إليه أيضاً <b>بالربط π</b>. وإذا أريد تحليل دائرة تحتوي على ربط من أحد النوعين بدون استخدام التحليل العقدي أو الحلقي فقد يكون من المفضل إجراء تحويل في الربط من نوع إلى مكافئه من النوع الآخر كأن يتم تحويل ربط Y إلى ربط Δ أو العكس. ويمكن إيجاد المكافئ لأي من الرابطين بدلالة الآخر عن طريق الموازنة بين قيم المقاومة بين أي طرفين من الأطراف الثلاثة ومرادفتها في الربط الآخر وتحت نفس الشروط.</p>
     <p>وعند الموازنة بين الربط Y و Δ في الشكل (3-43) فإن تكافؤ الربطين يتطلب أن تكون <b>المقاومة بين أي طرفين من الربط Δ مساوية للمقاومة بين نفس الطرفين للربط Y</b> فالمقاومة الكلية بين N3 و N1 في الربط Δ هي:</p>`,ref:'ص 94'},
    {watch:String.raw`<p><b>الشكل (3-43) في الكتاب:</b> اسما الضلعين \(R_b\) و \(R_c\) في الرسم لا يتفقان مع المعادلات (3-36) و(3-37) ولا مع الجدولين. بتبديل الاسمين (\(R_b\) بين \(N_1\) و \(N_2\)، و \(R_c\) بين \(N_3\) و \(N_2\)) يتفق كل شيء، لذلك رُسم الشكل هنا مصححاً. قارن بنفسك في التجربة أدناه.</p>
     <p>والجملة الأخيرة في ص 94 تنتهي بـ«هي:» ولا توجد بعدها معادلة في الكتاب.</p>`,fix:true},
    {title:'الشكل (3-43): كما في الكتاب أم المصحح؟',widget:(el,B)=>{
      let m='fixed';const draw=()=>{el.innerHTML=`<div class="w-row" style="margin-top:0"><span class="w-l">الرسم:</span><span class="mseg">${[['book','كما في الكتاب'],['fixed','المصحح']].map(([v,l])=>`<button type="button" data-m="${v}" aria-pressed="${v===m}" style="font-family:var(--font)">${l}</button>`).join('')}</span></div>${box(fig343(m),520)}
       <p class="sub" style="margin:8px 0 0">${m==='book'?'في رسم الكتاب R<sub>b</sub> على الضلع N<sub>3</sub>–N<sub>2</sub> و R<sub>c</sub> على القاعدة N<sub>1</sub>–N<sub>2</sub> (بلون مختلف)، فلا تتفق المعادلات (3-36) معه في ضلعين.':'بعد تبديل الاسمين: كل ضلع في الدلتا يقابله ذراع النجمة الذي لا يلمس طرفيه، وهو المقام في المعادلة (3-36).'}</p>`;
       el.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{m=b.dataset.m;draw()})};draw();
    }},
    {tip:String.raw`<p><b>الدلتا</b> مثلث: كل مقاومة بين طرفين. <b>النجمة</b> ثلاثة أذرع من نقطة وسطى: كل مقاومة بين طرف والمركز. الفكرة أن «المتفرج من الخارج» — من يقيس بين أي طرفين — لا يستطيع أن يفرّق بين الربطين إذا كانا متكافئين.</p>`},
    {add:String.raw`<p>ستقابل كلمتي «نجمة» و«دلتا» كثيراً في التمديدات ثلاثية الأوجه وفي توصيل ملفات المحركات والمحولات؛ الشكل الهندسي نفسه، والفكرة هنا مقاومات فقط.</p>`}
   ]},

  {st:2,short:'من Y إلى Δ',title:'تحويل ربط Y إلى ربط Δ',ref:'ص 95',
   q:'لدينا أذرع النجمة الثلاثة. كيف نحسب كل ضلع من أضلاع الدلتا المكافئة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="تحويل النجمة إلى دلتا: الضلع Rb يقابله الذراع R3 الذي لا يلمس طرفيه" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><g data-tip="⟦Ra⟧: ضلع الدلتا بين ⟦N1⟧ و⟦N3⟧. يقابل ذراع النجمة ⟦R2⟧."><path d="M30 210 L51.4 165.8 L59.1 166 L49.2 154.3 L64.6 154.7 L54.7 142.9 L70 143.4 L60.2 131.6 L75.5 132.1 L70.6 126.2 L92 82" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="49" y="150" text-anchor="end" font-size="13" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">a</tspan></text><rect x="20" y="76" width="82" height="152" fill="transparent"/></g><g data-tip="⟦Rb⟧: ضلع الدلتا بين ⟦N1⟧ و⟦N2⟧ (في الرسم المصحح). يقابل ذراع النجمة ⟦R3⟧."><path d="M30 210 L68 210 L71.1 217 L77.4 203 L83.7 217 L90 203 L96.3 217 L102.6 203 L108.9 217 L112 210 L150 210" fill="none" stroke="#E8735A" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="90" y="236" text-anchor="middle" font-size="13" fill="#E8735A" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">b</tspan></text><rect x="20" y="204" width="140" height="24" fill="transparent"/></g><g data-tip="⟦Rc⟧: ضلع الدلتا بين ⟦N3⟧ و⟦N2⟧ (في الرسم المصحح). يقابل ذراع النجمة ⟦R1⟧."><path d="M92 82 L111.9 126 L106.8 131.7 L122.2 131.7 L112 143.2 L127.4 143.1 L117.2 154.6 L132.6 154.6 L122.4 166.1 L130.1 166 L150 210" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="133" y="150" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">c</tspan></text><rect x="82" y="76" width="78" height="152" fill="transparent"/></g><circle cx="92" cy="82" r="5" fill="#2C4A40"/><text x="92" y="70" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700">N<tspan baseline-shift="sub" font-size="75%">3</tspan></text><circle cx="30" cy="210" r="5" fill="#2C4A40"/><text x="22" y="232" text-anchor="end" font-size="12.5" fill="#2C4A40" font-weight="700">N<tspan baseline-shift="sub" font-size="75%">1</tspan></text><circle cx="150" cy="210" r="5" fill="#2C4A40"/><text x="158" y="232" text-anchor="start" font-size="12.5" fill="#2C4A40" font-weight="700">N<tspan baseline-shift="sub" font-size="75%">2</tspan></text><g data-tip="⟦R3⟧: ذراع النجمة إلى الطرف ⟦N3⟧."><path d="M272 156 L272 141 L279 137.3 L265 130 L279 122.7 L265 115.3 L279 108 L265 100.7 L272 97 L272 82" fill="none" stroke="#E8735A" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="284" y="123" text-anchor="start" font-size="13" fill="#E8735A" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">3</tspan></text><rect x="262" y="76" width="20" height="86" fill="transparent"/></g><g data-tip="⟦R1⟧: ذراع النجمة إلى الطرف ⟦N1⟧."><path d="M272 156 L260.6 167.4 L253 165.1 L257.7 180.2 L242.6 175.5 L247.4 190.5 L232.3 185.8 L237 200.9 L229.4 198.6 L218 210" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="233" y="179" text-anchor="end" font-size="13" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">1</tspan></text><rect x="208" y="150" width="74" height="66" fill="transparent"/></g><g data-tip="⟦R2⟧: ذراع النجمة إلى الطرف ⟦N2⟧."><path d="M272 156 L284.2 167.7 L281.9 175.3 L296.9 170.3 L292.5 185.5 L307.5 180.5 L303.1 195.7 L318.1 190.7 L315.8 198.3 L328 210" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="312" y="179" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">2</tspan></text><rect x="262" y="150" width="76" height="66" fill="transparent"/></g><circle cx="272" cy="82" r="5" fill="#2C4A40"/><text x="272" y="70" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700">N<tspan baseline-shift="sub" font-size="75%">3</tspan></text><circle cx="218" cy="210" r="5" fill="#2C4A40"/><text x="210" y="232" text-anchor="end" font-size="12.5" fill="#2C4A40" font-weight="700">N<tspan baseline-shift="sub" font-size="75%">1</tspan></text><circle cx="328" cy="210" r="5" fill="#2C4A40"/><text x="336" y="232" text-anchor="start" font-size="12.5" fill="#2C4A40" font-weight="700">N<tspan baseline-shift="sub" font-size="75%">2</tspan></text><g data-tip="مركز النجمة: نقطة مشتركة بين الأذرع الثلاثة، وليست طرفاً خارجياً."><circle cx="272" cy="156" r="6" fill="#F2C14E"/><circle cx="272" cy="156" r="6" fill="none" stroke="#2C4A40" stroke-width="2"/><rect x="260" y="144" width="24" height="24" fill="transparent"/></g><g data-tip="ضلع الدلتا = (مجموع حواصل ضرب أذرع النجمة مثنى مثنى) ÷ (ذراع النجمة المقابلة للضلع، أي التي لا تلمس طرفيه)."><rect x="60" y="246" width="240" height="50" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="105" y="276" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">b</tspan> =</text><text x="212" y="264" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">1R_2</tspan> + R<tspan baseline-shift="sub" font-size="75%">2R_3</tspan> + R<tspan baseline-shift="sub" font-size="75%">3R_1</tspan></text><path d="M137 272 L287 272" fill="none" stroke="#2C4A40" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><text x="212" y="292" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">3</tspan></text></g><text x="180" y="44" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">من نجمة إلى دلتا <tspan direction="ltr" unicode-bidi="embed">(3-36)</tspan></text></svg>`,
   cap:'الضلع <span class="ltr">R<sub>b</sub></span> والذراع المقابل له <span class="ltr">R<sub>3</sub></span> باللون البرتقالي.<br><b>مرّر المؤشر على البطاقة والأضلاع (أو المسها في الجوال) لتعرف القاعدة.</b>',
   side:[
    {predict:{q:String.raw`في المعادلة (3-36)، ما المقام في معادلة \(R_c\)؟`,opts:[
     [String.raw`\(R_3\)`,false,String.raw`\(R_3\) مقام \(R_b\).`],
     [String.raw`\(R_2\)`,false,String.raw`\(R_2\) مقام \(R_a\).`],
     [String.raw`\(R_1\)`,true,String.raw`\(R_c=\frac{R_1R_2+R_2R_3+R_3R_1}{R_1}\): المقام ذراع النجمة المقابل للضلع.`]]}}
   ],
   body:[
    {book:String.raw`$$R_a=\frac{R_3R_2+R_2R_1+R_3R_1}{R_2}$$
     <div class="eq">$$R_b=\frac{R_1R_2+R_2R_3+R_3R_1}{R_3}$$<span class="eqno">(3-36)</span></div>
     $$R_c=\frac{R_1R_2+R_2R_3+R_3R_1}{R_1}$$`,ref:'ص 95'},
    {tip:String.raw`<p>البسط واحد في المعادلات الثلاث: مجموع حواصل ضرب أذرع النجمة <b>مثنى مثنى</b>. والذي يتغير المقام فقط: <b>ذراع النجمة المقابل للضلع</b> — أي الذراع الذي لا يلمس طرفي الضلع.</p>
     <p>وإذا كانت أذرع النجمة متساوية (\(R_Y\)) فإن كل ضلع \(R_\Delta=\frac{3R_Y^2}{R_Y}=3R_Y\).</p>`,title:'كيف تحفظها؟'}
   ]},

  {st:3,short:'من Δ إلى Y',title:'تحويل ربط Δ إلى ربط Y',ref:'ص 95',
   q:'والعكس: لدينا أضلاع الدلتا. كيف نحسب كل ذراع من أذرع النجمة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="تحويل الدلتا إلى نجمة: الذراع R1 من الضلعين Ra و Rb الملتقيين عند N1" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><g data-tip="⟦Ra⟧: ضلع الدلتا بين ⟦N1⟧ و⟦N3⟧. يقابل ذراع النجمة ⟦R2⟧."><path d="M30 210 L51.4 165.8 L59.1 166 L49.2 154.3 L64.6 154.7 L54.7 142.9 L70 143.4 L60.2 131.6 L75.5 132.1 L70.6 126.2 L92 82" fill="none" stroke="#4FB3A9" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="49" y="150" text-anchor="end" font-size="13" fill="#4FB3A9" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">a</tspan></text><rect x="20" y="76" width="82" height="152" fill="transparent"/></g><g data-tip="⟦Rb⟧: ضلع الدلتا بين ⟦N1⟧ و⟦N2⟧ (في الرسم المصحح). يقابل ذراع النجمة ⟦R3⟧."><path d="M30 210 L68 210 L71.1 217 L77.4 203 L83.7 217 L90 203 L96.3 217 L102.6 203 L108.9 217 L112 210 L150 210" fill="none" stroke="#4FB3A9" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="90" y="236" text-anchor="middle" font-size="13" fill="#4FB3A9" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">b</tspan></text><rect x="20" y="204" width="140" height="24" fill="transparent"/></g><g data-tip="⟦Rc⟧: ضلع الدلتا بين ⟦N3⟧ و⟦N2⟧ (في الرسم المصحح). يقابل ذراع النجمة ⟦R1⟧."><path d="M92 82 L111.9 126 L106.8 131.7 L122.2 131.7 L112 143.2 L127.4 143.1 L117.2 154.6 L132.6 154.6 L122.4 166.1 L130.1 166 L150 210" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="133" y="150" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">c</tspan></text><rect x="82" y="76" width="78" height="152" fill="transparent"/></g><circle cx="92" cy="82" r="5" fill="#2C4A40"/><text x="92" y="70" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700">N<tspan baseline-shift="sub" font-size="75%">3</tspan></text><circle cx="30" cy="210" r="5" fill="#2C4A40"/><text x="22" y="232" text-anchor="end" font-size="12.5" fill="#2C4A40" font-weight="700">N<tspan baseline-shift="sub" font-size="75%">1</tspan></text><circle cx="150" cy="210" r="5" fill="#2C4A40"/><text x="158" y="232" text-anchor="start" font-size="12.5" fill="#2C4A40" font-weight="700">N<tspan baseline-shift="sub" font-size="75%">2</tspan></text><g data-tip="⟦R3⟧: ذراع النجمة إلى الطرف ⟦N3⟧."><path d="M272 156 L272 141 L279 137.3 L265 130 L279 122.7 L265 115.3 L279 108 L265 100.7 L272 97 L272 82" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="284" y="123" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">3</tspan></text><rect x="262" y="76" width="20" height="86" fill="transparent"/></g><g data-tip="⟦R1⟧: ذراع النجمة إلى الطرف ⟦N1⟧."><path d="M272 156 L260.6 167.4 L253 165.1 L257.7 180.2 L242.6 175.5 L247.4 190.5 L232.3 185.8 L237 200.9 L229.4 198.6 L218 210" fill="none" stroke="#4FB3A9" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="233" y="179" text-anchor="end" font-size="13" fill="#4FB3A9" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">1</tspan></text><rect x="208" y="150" width="74" height="66" fill="transparent"/></g><g data-tip="⟦R2⟧: ذراع النجمة إلى الطرف ⟦N2⟧."><path d="M272 156 L284.2 167.7 L281.9 175.3 L296.9 170.3 L292.5 185.5 L307.5 180.5 L303.1 195.7 L318.1 190.7 L315.8 198.3 L328 210" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="312" y="179" text-anchor="start" font-size="13" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">2</tspan></text><rect x="262" y="150" width="76" height="66" fill="transparent"/></g><circle cx="272" cy="82" r="5" fill="#2C4A40"/><text x="272" y="70" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700">N<tspan baseline-shift="sub" font-size="75%">3</tspan></text><circle cx="218" cy="210" r="5" fill="#2C4A40"/><text x="210" y="232" text-anchor="end" font-size="12.5" fill="#2C4A40" font-weight="700">N<tspan baseline-shift="sub" font-size="75%">1</tspan></text><circle cx="328" cy="210" r="5" fill="#2C4A40"/><text x="336" y="232" text-anchor="start" font-size="12.5" fill="#2C4A40" font-weight="700">N<tspan baseline-shift="sub" font-size="75%">2</tspan></text><g data-tip="مركز النجمة: نقطة مشتركة بين الأذرع الثلاثة، وليست طرفاً خارجياً."><circle cx="272" cy="156" r="6" fill="#F2C14E"/><circle cx="272" cy="156" r="6" fill="none" stroke="#2C4A40" stroke-width="2"/><rect x="260" y="144" width="24" height="24" fill="transparent"/></g><g data-tip="ذراع النجمة = (حاصل ضرب ضلعي الدلتا الملتقيين عند طرفه) ÷ (مجموع أضلاع الدلتا)."><rect x="60" y="246" width="240" height="50" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="105" y="276" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">1</tspan> =</text><text x="212" y="264" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">a</tspan> R<tspan baseline-shift="sub" font-size="75%">b</tspan></text><path d="M147 272 L277 272" fill="none" stroke="#2C4A40" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><text x="212" y="292" text-anchor="middle" font-size="13" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">a</tspan> + R<tspan baseline-shift="sub" font-size="75%">b</tspan> + R<tspan baseline-shift="sub" font-size="75%">c</tspan></text></g><text x="180" y="44" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">من دلتا إلى نجمة <tspan direction="ltr" unicode-bidi="embed">(3-37)</tspan></text></svg>`,
   cap:'الذراع <span class="ltr">R<sub>1</sub></span> والضلعان الملتقيان عند <span class="ltr">N<sub>1</sub></span> باللون الأخضر.<br><b>مرّر المؤشر على البطاقة والأضلاع (أو المسها في الجوال) لتعرف القاعدة.</b>',
   side:[
    {predict:{q:String.raw`ذراع النجمة \(R_2\) عند الطرف \(N_2\): أي ضلعين من الدلتا في بسطه؟`,opts:[
     [String.raw`\(R_b\) و \(R_c\)`,true,String.raw`الضلعان الملتقيان عند \(N_2\): \(R_2=\frac{R_bR_c}{R_a+R_b+R_c}\).`],
     [String.raw`\(R_a\) و \(R_b\)`,false,String.raw`هذان يلتقيان عند \(N_1\)، فهما بسط \(R_1\).`],
     [String.raw`\(R_a\) و \(R_c\)`,false,String.raw`هذان يلتقيان عند \(N_3\)، فهما بسط \(R_3\).`]]}}
   ],
   body:[
    {book:String.raw`$$R_1=\frac{R_aR_b}{R_a+R_b+R_c}$$
     <div class="eq">$$R_2=\frac{R_bR_c}{R_a+R_b+R_c}$$<span class="eqno">(3-37)</span></div>
     $$R_3=\frac{R_aR_c}{R_a+R_b+R_c}$$`,ref:'ص 95'},
    {watch:String.raw`<p>السطر الثالث من المعادلة (3-37) مطبوع في الكتاب «\(R_1=\frac{R_aR_C}{\ldots}\)» (\(R_1\) مكررة)، والصحيح \(R_3\) كما يعامله الجدول (3-2). عرضناه هنا مصححاً.</p>`,fix:true},
    {tip:String.raw`<p>المقام واحد في المعادلات الثلاث: <b>مجموع أضلاع الدلتا</b>. والبسط: <b>حاصل ضرب الضلعين الملتقيين عند طرف الذراع</b>. وإذا كانت الأضلاع متساوية (\(R_\Delta\)) فإن كل ذراع \(R_Y=R_\Delta/3\).</p>`,title:'كيف تحفظها؟'}
   ]},

  {st:4,short:'مثال <span class="ltr">(3-38)</span>',title:'مثال <span class="ltr">(3-38)</span>: من نجمة إلى دلتا — الجدول <span class="ltr">(3-1)</span>',ref:'ص 95',
   q:'ست حالات بأرقام مختلفة جداً (من أقل من 1 Ω إلى عشرات الآلاف). هل تتغير الطريقة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="صف الحالة الأولى من الجدول 3-1: 1 و 12 و 34 أوم، والنتائج 13.353 و 37.833 و 454" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><text x="180" y="60" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">الجدول <tspan direction="ltr" unicode-bidi="embed">(3-1)</tspan>: الحالة الأولى</text><rect x="280" y="100" width="50" height="40" rx="0" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2"/><text x="305" y="125" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">3</tspan></text><g data-tip="⟦R3 = 1 Ω⟧ (معطى)."><rect x="280" y="140" width="50" height="40" rx="0" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="305" y="165" text-anchor="middle" font-size="11.5" fill="#2C4A40">1</text><rect x="280" y="140" width="50" height="40" fill="transparent"/></g><rect x="230" y="100" width="50" height="40" rx="0" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2"/><text x="255" y="125" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">1</tspan></text><g data-tip="⟦R1 = 12 Ω⟧ (معطى)."><rect x="230" y="140" width="50" height="40" rx="0" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="255" y="165" text-anchor="middle" font-size="11.5" fill="#2C4A40">12</text><rect x="230" y="140" width="50" height="40" fill="transparent"/></g><rect x="180" y="100" width="50" height="40" rx="0" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2"/><text x="205" y="125" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">2</tspan></text><g data-tip="⟦R2 = 34 Ω⟧ (معطى)."><rect x="180" y="140" width="50" height="40" rx="0" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="205" y="165" text-anchor="middle" font-size="11.5" fill="#2C4A40">34</text><rect x="180" y="140" width="50" height="40" fill="transparent"/></g><rect x="130" y="100" width="50" height="40" rx="0" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="155" y="125" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700">Σ/R<tspan baseline-shift="sub" font-size="75%">2</tspan></text><g data-tip="⟦Σ/R2 = 454/34 = 13.353⟧ — هذا ⟦Ra⟧ (العمود مطبوع «Rb؟»)."><rect x="130" y="140" width="50" height="40" rx="0" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="155" y="165" text-anchor="middle" font-size="11.5" fill="#2C4A40">13.353</text><rect x="130" y="140" width="50" height="40" fill="transparent"/></g><rect x="80" y="100" width="50" height="40" rx="0" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="105" y="125" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700">Σ/R<tspan baseline-shift="sub" font-size="75%">1</tspan></text><g data-tip="⟦Σ/R1 = 454/12 = 37.833⟧ — هذا ⟦Rc⟧."><rect x="80" y="140" width="50" height="40" rx="0" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="105" y="165" text-anchor="middle" font-size="11.5" fill="#2C4A40">37.833</text><rect x="80" y="140" width="50" height="40" fill="transparent"/></g><rect x="30" y="100" width="50" height="40" rx="0" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="55" y="125" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700">Σ/R<tspan baseline-shift="sub" font-size="75%">3</tspan></text><g data-tip="⟦Σ/R3 = 454/1 = 454⟧ — هذا ⟦Rb⟧ (العمود مطبوع «Rc؟»)."><rect x="30" y="140" width="50" height="40" rx="0" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="55" y="165" text-anchor="middle" font-size="11.5" fill="#2C4A40">454</text><rect x="30" y="140" width="50" height="40" fill="transparent"/></g><g data-tip="البسط المشترك ⟦Σ = R1R2 + R2R3 + R3R1 = 408 + 34 + 12 = 454⟧."><rect x="70" y="210" width="220" height="40" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="180" y="236" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700">Σ = 408 + 34 + 12 = 454</text></g><text x="180" y="280" text-anchor="middle" font-size="12.5" fill="#2C4A40" direction="rtl">المعطى بالأخضر، والمطلوب بالأصفر</text></svg>`,
   cap:'الحالة الأولى من الجدول <span class="ltr">(3-1)</span>.<br><b>مرّر المؤشر على خانات الجدول والبطاقة (أو المسها في الجوال) لترى حساب كل خانة.</b>',
   side:[
    {predict:{q:String.raw`في الحالة الأولى (\(R_1=12\)، \(R_2=34\)، \(R_3=1\))، كم \(\Sigma=R_1R_2+R_2R_3+R_3R_1\)؟`,opts:[
     ['47',false,String.raw`هذا مجموع المقاومات \(12+34+1\)، وليس مجموع حواصل الضرب.`],
     ['454',true,String.raw`\(408+34+12=454\)، وهو البسط المشترك للأضلاع الثلاثة.`],
     ['408',false,String.raw`هذا الحد الأول فقط \(R_1R_2\).`]]}}
   ],
   body:[
    {book:String.raw`<p>لتكن المقاومات \(R_1\)، \(R_2\)، \(R_3\) الموضحة في الشكل (3-43) قيمتها 12Ω، 34Ω، 1Ω على التوالي (الحالة الأولى الجدول (3-1)). تم تحويل ربط Y إلى ربط Δ. احسب قيمة المقاومات \(R_a\), \(R_c\), \(R_b\) للحالات الست.</p>
     <p><b>الحل:</b> بتطبيق القوانين (3-36) نحصل على قيم المقاومات للحالات الست الجدول (3-1).</p>`,ref:'ص 95'},
    {title:'الجدول (3-1) ص 95',widget:(el,B)=>{
      let m='book';const draw=()=>{el.innerHTML=`<div class="w-row" style="margin-top:0"><span class="w-l">العرض:</span><span class="mseg">${[['book','كما في الكتاب'],['fixed','المصحح']].map(([v,l])=>`<button type="button" data-m="${v}" aria-pressed="${v===m}" style="font-family:var(--font)">${l}</button>`).join('')}</span></div>${table31(m)}
       <p class="sub" style="margin:8px 0 0">${m==='book'?'رؤوس الأعمدة كما طُبعت («Rb؟ Rc؟ Rc؟»)، والخانات الحمراء أرقام مطبوعة خطأ (الحالة 6).':'<span class="fixnote">رؤوس الأعمدة المصححة، وكل القيم محسوبة بالمعادلات (3-36). الخانات الخضراء صُححت عن الكتاب.</span>'}</p>`;
       el.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{m=b.dataset.m;draw()})};draw();
    }},
    {watch:String.raw`<p><b>الجدول (3-1):</b> رؤوس الأعمدة المحسوبة مطبوعة «Rb، Rc، Rc» والصحيح بالمعادلات (3-36): \(R_a\) (= Σ/\(R_2\))، \(R_c\) (= Σ/\(R_1\))، \(R_b\) (= Σ/\(R_3\)). و<b>الحالة 6 فيها خطأ حسابي</b>: المطبوع 29078 و 147864 و 140463، والصحيح <b>29037.1 و 149953.3 و 142447.9</b>.</p>`,fix:true},
    {tip:String.raw`<p>عبارة «12Ω، 34Ω، 1Ω على التوالي» هنا معناها <b>«بالترتيب»</b> (أي \(R_1=12\) و \(R_2=34\) و \(R_3=1\))، وليست توصيلاً على التوالي.</p>`},
    {html:String.raw`<div class="w-row"><button class="btn pri" type="button" onclick="var b=document.querySelector('.ltabs button[data-tab=examples]');if(b)b.click()">افتح الحل خطوة بخطوة في «الأمثلة المحلولة»</button></div>`}
   ]},

  {st:5,short:'مثال <span class="ltr">(3-39)</span>',title:'مثال <span class="ltr">(3-39)</span>: من دلتا إلى نجمة — الجدول <span class="ltr">(3-2)</span>',ref:'ص 96',
   q:'خمس حالات من الدلتا إلى النجمة. ما الرقم الذي تحسبه مرة واحدة فقط لكل حالة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="صف الحالة الأولى من الجدول 3-2: 16 و 27 و 76 أوم، والنتائج 3.63 و 10.218 و 17.244" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><text x="180" y="60" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">الجدول <tspan direction="ltr" unicode-bidi="embed">(3-2)</tspan>: الحالة الأولى</text><rect x="280" y="100" width="50" height="40" rx="0" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2"/><text x="305" y="125" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">A</tspan></text><g data-tip="⟦RA = 16 Ω⟧ (معطى)."><rect x="280" y="140" width="50" height="40" rx="0" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="305" y="165" text-anchor="middle" font-size="11.5" fill="#2C4A40">16</text><rect x="280" y="140" width="50" height="40" fill="transparent"/></g><rect x="230" y="100" width="50" height="40" rx="0" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2"/><text x="255" y="125" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">C</tspan></text><g data-tip="⟦RC = 27 Ω⟧ (معطى)."><rect x="230" y="140" width="50" height="40" rx="0" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="255" y="165" text-anchor="middle" font-size="11.5" fill="#2C4A40">27</text><rect x="230" y="140" width="50" height="40" fill="transparent"/></g><rect x="180" y="100" width="50" height="40" rx="0" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2"/><text x="205" y="125" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">B</tspan></text><g data-tip="⟦RB = 76 Ω⟧ (معطى)."><rect x="180" y="140" width="50" height="40" rx="0" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="205" y="165" text-anchor="middle" font-size="11.5" fill="#2C4A40">76</text><rect x="180" y="140" width="50" height="40" fill="transparent"/></g><rect x="130" y="100" width="50" height="40" rx="0" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="155" y="125" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">3</tspan></text><g data-tip="⟦R3 = RA·RC / Σ = 432/119 = 3.63⟧."><rect x="130" y="140" width="50" height="40" rx="0" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="155" y="165" text-anchor="middle" font-size="11.5" fill="#2C4A40">3.63</text><rect x="130" y="140" width="50" height="40" fill="transparent"/></g><rect x="80" y="100" width="50" height="40" rx="0" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="105" y="125" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">1</tspan></text><g data-tip="⟦R1 = RA·RB / Σ = 1216/119 = 10.218⟧."><rect x="80" y="140" width="50" height="40" rx="0" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="105" y="165" text-anchor="middle" font-size="11.5" fill="#2C4A40">10.218</text><rect x="80" y="140" width="50" height="40" fill="transparent"/></g><rect x="30" y="100" width="50" height="40" rx="0" fill="#F2C14E" stroke="#2C4A40" stroke-width="2"/><text x="55" y="125" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">2</tspan></text><g data-tip="⟦R2 = RB·RC / Σ = 2052/119 = 17.244⟧."><rect x="30" y="140" width="50" height="40" rx="0" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2"/><text x="55" y="165" text-anchor="middle" font-size="11.5" fill="#2C4A40">17.244</text><rect x="30" y="140" width="50" height="40" fill="transparent"/></g><g data-tip="المقام المشترك ⟦Σ = RA + RB + RC = 16 + 76 + 27 = 119 Ω⟧."><rect x="70" y="210" width="220" height="40" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="180" y="236" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700">Σ = 16 + 76 + 27 = 119</text></g><text x="180" y="280" text-anchor="middle" font-size="12.5" fill="#2C4A40" direction="rtl">المعطى بالأخضر، والمطلوب بالأصفر</text></svg>`,
   cap:'الحالة الأولى من الجدول <span class="ltr">(3-2)</span>.<br><b>مرّر المؤشر على خانات الجدول والبطاقة (أو المسها في الجوال) لترى حساب كل خانة.</b>',
   side:[
    {predict:{q:String.raw`الحالة الأولى: \(R_A=16\)، \(R_B=76\)، \(R_C=27\). ما المقام المشترك للأذرع الثلاثة؟`,opts:[
     [String.raw`\(16\times76\times27\)`,false,'المقام مجموع الأضلاع، لا حاصل ضربها.'],
     ['119',true,String.raw`\(16+76+27=119\ \Omega\)، وهو مقام المعادلات (3-37) الثلاث.`],
     [String.raw`\(16\times76\)`,false,'هذا بسط أحد الأذرع، وليس المقام.']]}}
   ],
   body:[
    {book:String.raw`<p>لتكن المقاومات \(R_A\)، \(R_C\)، \(R_B\) الموضحة في الشكل (3-43) قيمتها 16Ω، 27Ω، 76Ω (الحالة الأولى الجدول (3-2)). تم تحويل ربط Δ إلى ربط Y. احسب قيمة المقاومات \(R_3\)، \(R_1\)، \(R_2\) للحالات الخمس. بتطبيق القوانين (3-37) نحصل على قيم المقاومات للحالات الخمس الجدول (3-2).</p>
     <p><b>الحل:</b></p>${table32()}`,ref:'ص 96'},
    {watch:String.raw`<p>في الكتاب كُتب «(الحالة الأولى الجدول (3-1))» والصحيح الجدول (3-2)؛ وترتيب القيم في النص «27Ω، 76Ω، 16Ω» لا يطابق الجدول، والصحيح من الجدول: \(R_A=16\)، \(R_C=27\)، \(R_B=76\ \Omega\). عرضناها هنا مصححة. أما قيم الجدول (3-2) فكلها صحيحة بالمعادلات (3-37).</p>`,fix:true},
    {html:String.raw`<div class="w-row"><button class="btn pri" type="button" onclick="var b=document.querySelector('.ltabs button[data-tab=examples]');if(b)b.click()">افتح الحل خطوة بخطوة في «الأمثلة المحلولة»</button></div>`}
   ]},

  {st:6,short:'مثال <span class="ltr">(3-40)</span>',title:'مثال <span class="ltr">(3-40)</span>: القنطرة',ref:'ص 96–97',
   q:'شبكة لا توجد فيها مقاومتان على التوالي ولا على التوازي. كيف نحسب مقاومتها المكافئة بين A و B؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="شبكة قنطرة: a-b 3 أوم، b-c 6 أوم، a-c 9 أوم، a-d 4.5 أوم، c-d 3 أوم، والطرفان A و B عند b و d" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><circle cx="180" cy="50" r="5.5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="194" y="54" text-anchor="start" font-size="14" fill="#2C4A40" font-weight="700">A</text><path d="M180 55 L180 84" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="180" cy="280" r="5.5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><text x="194" y="284" text-anchor="start" font-size="14" fill="#2C4A40" font-weight="700">B</text><path d="M180 244 L180 275" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="الدلتا ⟦abc⟧: المقاومات ⟦3⟧ و⟦6⟧ و⟦9 Ω⟧ تكوّن مثلثاً. نحولها إلى نجمة."><path d="M180 84 L147.2 110.3 L139.9 107.1 L143 122.6 L128.5 116.2 L131.5 131.8 L117 125.4 L120.1 140.9 L112.8 137.7 L80 164" fill="none" stroke="#E8735A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M180 84 L212.8 110.3 L211.3 118 L225.8 111.7 L222.8 127.2 L237.2 120.8 L234.2 136.3 L248.7 130 L247.2 137.7 L280 164" fill="none" stroke="#E8735A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M80 164 L158 164 L161.1 171 L167.4 157 L173.7 171 L180 157 L186.3 171 L192.6 157 L198.9 171 L202 164 L280 164" fill="none" stroke="#E8735A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><rect x="80" y="84" width="200" height="84" fill="transparent"/></g><text x="118" y="116" text-anchor="end" font-size="12.5" fill="#E8735A" font-weight="700">3 Ω</text><text x="242" y="116" text-anchor="start" font-size="12.5" fill="#E8735A" font-weight="700">6 Ω</text><text x="180" y="156" text-anchor="middle" font-size="12.5" fill="#E8735A" font-weight="700">9 Ω</text><path d="M80 164 L112.8 190.3 L111.3 198 L125.8 191.7 L122.8 207.2 L137.2 200.8 L134.2 216.3 L148.7 210 L147.2 217.7 L180 244" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M280 164 L247.2 190.3 L239.9 187.1 L243 202.6 L228.5 196.2 L231.5 211.8 L217 205.4 L220.1 220.9 L212.8 217.7 L180 244" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="118" y="214" text-anchor="end" font-size="12.5" fill="#2C4A40" font-weight="700">4.5 Ω</text><text x="242" y="214" text-anchor="start" font-size="12.5" fill="#2C4A40" font-weight="700">3 Ω</text><circle cx="180" cy="84" r="5" fill="#2C4A40"/><text x="168" y="78" text-anchor="end" font-size="14" fill="#2C4A40" font-weight="700">b</text><circle cx="80" cy="164" r="5" fill="#2C4A40"/><text x="70" y="168" text-anchor="end" font-size="14" fill="#2C4A40" font-weight="700">a</text><circle cx="280" cy="164" r="5" fill="#2C4A40"/><text x="290" y="168" text-anchor="start" font-size="14" fill="#2C4A40" font-weight="700">c</text><circle cx="180" cy="244" r="5" fill="#2C4A40"/><text x="168" y="258" text-anchor="end" font-size="14" fill="#2C4A40" font-weight="700">d</text><g data-tip="لا توجد في هذه الشبكة مقاومتان على التوالي ولا على التوازي؛ لذلك نحتاج التحويل."><text x="180" y="30" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">الشكل <tspan direction="ltr" unicode-bidi="embed">(3-44</tspan>أ): قنطرة</text><rect x="100" y="14" width="160" height="22" fill="transparent"/></g></svg>`,
   cap:'الشكل <span class="ltr">(3-44أ)</span>: الدلتا <span class="ltr">abc</span> باللون البرتقالي.<br><b>مرّر المؤشر على المثلث البرتقالي والعنوان (أو المسهما في الجوال) لتعرف الفكرة.</b>',
   side:[
    {predict:{q:'بعد تحويل الدلتا abc إلى نجمة مركزها o، كيف يصبح الطريقان o–a–d و o–c–d؟',opts:[
     ['على التوالي معاً',false,'لا: كل منهما يبدأ من o وينتهي عند d، فهما بين نفس النقطتين.'],
     ['على التوازي، وكل منهما 6 Ω',true,String.raw`\(1.5+4.5=6\) و \(3+3=6\)، وهما بين o و d فمكافئهما \(3\ \Omega\).`],
     ['لا يتغيران عن الشكل الأصلي',false,'تغيرا: صار كل منهما مقاومتين على التوالي بين o و d.']]}}
   ],
   body:[
    {book:String.raw`<p>في شبكة المقاومات المبينة بالشكل (3-44أ). احسب قيمة المقاومة المكافئة عند الطرفين AB.</p>
     <p><b>الحل:</b> نحول شبكة الدلتا abc إلى شبكة نجمية باستخدام المعادلة (3-37):</p>
     $$R_{ao}=\frac{9\times3}{3+6+9}=1.5\ \Omega\qquad R_{bo}=\frac{6\times3}{3+6+9}=1\ \Omega\qquad R_{co}=\frac{6\times9}{3+6+9}=3\ \Omega$$
     <p>ومنها نحصل على الدائرة المكافئة الشكل (3-44ب) التي تحتوي على مجموعات مقاومات موصلة توالي/ توازي، ومنها نجد أن:</p>
     $$R_{od}=\frac{(1.5+4.5)(3+3)}{1.5+4.5+3+3}=3\ \Omega$$
     <p>ولذلك:</p>
     $$R_{AB}=R_{bo}+R_{od}=1+3=4\ \Omega$$`,ref:'ص 96–97'},
    {html:String.raw`<figure style="margin:0">${box(fig344(1),340)}<figcaption class="sub" style="text-align:center">الشكل (3-44ب): بعد تحويل الدلتا abc إلى نجمة مركزها o.</figcaption></figure>`},
    {watch:String.raw`<p>في الكتاب: «نحول شبكة الدلتا الشكل (3-44ب)» والمقصود الدلتا abc في الشكل (3-44أ)؛ و«المعادلة (7-2)» والصحيح (3-37)؛ والرمز «\(R_{ad}\)» المقصود به \(R_{od}\)، و«\(R_{ab}\)» المقصود به \(R_{AB}\). عرضناها هنا مصححة.</p>`,fix:true},
    {tip:String.raw`<p>التحويل لا يغيّر شيئاً «خارج» المثلث: المقاومتان 4.5 Ω و 3 Ω بقيتا كما هما، والطرفان A و B كما هما. لكنه جعل الشبكة توالي وتوازي: \(R_{bo}\) على التوالي مع مجموعة الطريقين المتوازيين.</p>`},
    {html:String.raw`<div class="w-row"><button class="btn pri" type="button" onclick="var b=document.querySelector('.ltabs button[data-tab=examples]');if(b)b.click()">افتح الحل خطوة بخطوة في «الأمثلة المحلولة»</button></div>`}
   ]},

  {recap:[
   String.raw`ثلاث مقاومات قد ترتبط نجمة Y (T) أو دلتا Δ (π)؛ والربطان متكافئان إذا تساوت المقاومة بين كل طرفين (ص 94).`,
   String.raw`من نجمة إلى دلتا (3-36): الضلع = مجموع حواصل ضرب الأذرع مثنى مثنى ÷ الذراع المقابل، مثل \(R_a=\frac{R_1R_2+R_2R_3+R_3R_1}{R_2}\) (ص 95).`,
   String.raw`من دلتا إلى نجمة (3-37): الذراع = حاصل ضرب الضلعين الملتقيين عند طرفه ÷ مجموع الأضلاع، مثل \(R_1=\frac{R_aR_b}{R_a+R_b+R_c}\) (ص 95).`,
   String.raw`التحويل يجعل الشبكات المعقدة (كالقنطرة) توالي وتوازي: في مثال (3-40) \(R_{AB}=1+3=4\ \Omega\) (ص 96–97).`]}
],
 theory:[
  {h:'ربط النجمة وربط الدلتا (Δ – Y)',ref:'ص 94',html:'<p>«يحدث كثيراً أن ترتبط ثلاث مقاومات، <b>لا على التوازي ولا على التوالي</b> بل على الشكل <b>نجمي Y</b> ويشار إليه أيضاً <b>بالربط T</b> أو أن ترتبط على الشكل <b>دلتا</b> ويشار إليه أيضاً <b>بالربط π</b>. وإذا أريد تحليل دائرة تحتوي على ربط من أحد النوعين بدون استخدام التحليل العقدي أو الحلقي فقد يكون من المفضل إجراء تحويل في الربط من نوع إلى مكافئه من النوع الآخر كأن يتم تحويل ربط Y إلى ربط Δ أو العكس.»</p><p>«ويمكن إيجاد المكافئ لأي من الرابطين بدلالة الآخر عن طريق الموازنة بين قيم المقاومة بين أي طرفين من الأطراف الثلاثة ومرادفتها في الربط الآخر وتحت نفس الشروط. وعند الموازنة بين الربط Y و Δ في الشكل (3-43) فإن تكافؤ الربطين يتطلب أن تكون <b>المقاومة بين أي طرفين من الربط Δ مساوية للمقاومة بين نفس الطرفين للربط Y</b>.»</p>'},
  {fig:'(3-43)',ref:'ص 94',caption:'يساراً دلتا رؤوسها N1 و N2 و N3، ويميناً نجمة: R1 إلى N1، و R2 إلى N2، و R3 إلى N3. <span class="fixnote">(الأسماء Rb و Rc على ضلعي الدلتا مصححة — انظر الملاحظة والمفتاح تحت الشكل)</span>',draw:()=>box(fig343('fixed'),560)},
  {widget:(el)=>{let m='fixed';const draw=()=>{const sd=SIDES[m];const opp={N1:'R1',N2:'R2',N3:'R3'};const form={Ra:'R2',Rb:'R3',Rc:'R1'};
    const rows=Object.entries(sd).map(([k,[p,q]])=>{const o=['N1','N2','N3'].find(n=>n!==p&&n!==q);const need=opp[o],ok=need===form[k];return `<tr><td>R<sub>${k[1]}</sub></td><td>${p.replace('N','N<sub>')}</sub>–${q.replace('N','N<sub>')}</sub></td><td>${need.replace('R','R<sub>')}</sub></td><td>Σ/${form[k].replace('R','R<sub>')}</sub></td><td class="${ok?'ok':'bad'}">${ok?'✓ يتفق':'✗ لا يتفق'}</td></tr>`}).join('');
    el.innerHTML=`<figure class="fig"><h3 class="sm" style="margin:0">الشكل (3-43): كما في الكتاب أم المصحح؟</h3><div class="cb-row">${segHTML('f43',[['book','كما في الكتاب'],['fixed','المصحح']],m)}</div>${box(fig343(m),540)}
     <div class="cb-tbl"><table class="tt"><thead><tr><th>ضلع الدلتا</th><th>بين الطرفين</th><th>مقاومة النجمة المقابلة له</th><th>المعادلة (3-36) تقسم على</th><th>النتيجة</th></tr></thead><tbody>${rows}</tbody></table></div>
     <p class="sub">${m==='book'?'في رسم الكتاب R<sub>b</sub> على الضلع N<sub>3</sub>–N<sub>2</sub> و R<sub>c</sub> على القاعدة N<sub>1</sub>–N<sub>2</sub>، فلا تتفق المعادلات (3-36) معه في ضلعين.':'<span class="fixnote">بتبديل اسمي R<sub>b</sub> و R<sub>c</sub> في الرسم تتفق المعادلات (3-36) و(3-37) والجدولان (3-1) و(3-2) كلها مع الشكل.</span>'} القاعدة: ضلع الدلتا = Σ ÷ مقاومة النجمة <b>المقابلة</b> له (التي لا تلمس طرفيه).</p></figure>`;
    el.querySelectorAll('[data-f43]').forEach(b=>b.onclick=()=>{m=b.dataset.f43;draw()})};draw()}},
  {h:'تحويل ربط Y إلى ربط Δ',ref:'ص 95',html:'$$R_a=\\frac{R_3R_2+R_2R_1+R_3R_1}{R_2}$$ $$R_b=\\frac{R_1R_2+R_2R_3+R_3R_1}{R_3} \\qquad (3\\text{-}36)$$ $$R_c=\\frac{R_1R_2+R_2R_3+R_3R_1}{R_1}$$'},
  {h:'تحويل ربط Δ إلى ربط Y',ref:'ص 95',html:'$$R_1=\\frac{R_aR_b}{R_a+R_b+R_c}$$ $$R_2=\\frac{R_bR_c}{R_a+R_b+R_c} \\qquad (3\\text{-}37)$$ $$R_3=\\frac{R_aR_c}{R_a+R_b+R_c}$$'},
  {note:NOTE_ADD+'طريقة سهلة للحفظ: <b>من نجمة إلى دلتا</b>: ضلع الدلتا = (مجموع حواصل ضرب مقاومات النجمة مثنى مثنى) ÷ (مقاومة النجمة المقابلة للضلع). <b>من دلتا إلى نجمة</b>: ذراع النجمة = (حاصل ضرب ضلعي الدلتا الملتقيين عند طرفه) ÷ (مجموع أضلاع الدلتا). وإذا كانت المقاومات الثلاث متساوية: \\(R_\\Delta=3R_Y\\).'},
  {h:'مثال (3-38): من نجمة إلى دلتا',ref:'ص 95',html:'<p>«لتكن المقاومات \\(R_1\\)، \\(R_2\\)، \\(R_3\\) الموضحة في الشكل (3-43) قيمتها 12Ω، 34Ω، 1Ω على التوالي (الحالة الأولى الجدول (3-1)). تم تحويل ربط Y إلى ربط Δ. احسب قيمة المقاومات \\(R_a\\), \\(R_c\\), \\(R_b\\) للحالات الست.» «بتطبيق القوانين (3-36) نحصل على قيم المقاومات للحالات الست الجدول (3-1).» (عبارة «على التوالي» هنا بمعنى «بالترتيب».)</p>'},
  {widget:(el)=>{let m='book';const draw=()=>{el.innerHTML=`<figure class="fig"><h3 class="sm" style="margin:0">الجدول (3-1) ص 95</h3><div class="cb-row">${segHTML('t31',[['book','كما في الكتاب'],['fixed','المصحح']],m)}</div>${table31(m)}<p class="sub">${m==='book'?'رؤوس الأعمدة كما طُبعت («Rb؟ Rc؟ Rc؟»)، والخانات الحمراء أرقام مطبوعة خطأ (الحالة 6).':'<span class="fixnote">رؤوس الأعمدة المصححة، وكل القيم محسوبة بالمعادلات (3-36). الخانات الخضراء صُححت عن الكتاب.</span>'}</p></figure>`;el.querySelectorAll('[data-t31]').forEach(b=>b.onclick=()=>{m=b.dataset.t31;draw()})};draw()}},
  {h:'مثال (3-39): من دلتا إلى نجمة',ref:'ص 96',html:'<p>«لتكن المقاومات \\(R_A\\)، \\(R_C\\)، \\(R_B\\) الموضحة في الشكل (3-43) قيمتها 16Ω، 27Ω، 76Ω (الحالة الأولى الجدول (3-2)). تم تحويل ربط Δ إلى ربط Y. احسب قيمة المقاومات \\(R_3\\)، \\(R_1\\)، \\(R_2\\) للحالات الخمس. بتطبيق القوانين (3-37) نحصل على قيم المقاومات للحالات الخمس الجدول (3-2).»</p><h3 class="sm">الجدول (3-2) ص 96</h3>'+table32()+'<p class="sub">كل قيم الجدول (3-2) صحيحة بالمعادلات (3-37).</p>'},
  {h:'مثال (3-40): القنطرة',ref:'ص 96–97',html:'<p>«في شبكة المقاومات المبينة بالشكل (3-44أ). احسب قيمة المقاومة المكافئة عند الطرفين AB.»</p><p>لا توجد في الشبكة مقاومتان على التوالي ولا على التوازي، لذلك «نحول شبكة الدلتا» abc «إلى شبكة نجمية باستخدام المعادلة» (3-37):</p>$$R_{ao}=\\frac{9\\times3}{3+6+9}=1.5\\ \\Omega,\\quad R_{bo}=\\frac{6\\times3}{3+6+9}=1\\ \\Omega,\\quad R_{co}=\\frac{6\\times9}{3+6+9}=3\\ \\Omega$$<p>«ومنها نحصل على الدائرة المكافئة الشكل (3-44ب) التي تحتوي على مجموعات مقاومات موصلة توالي/ توازي»:</p>$$R_{od}=\\frac{(1.5+4.5)(3+3)}{1.5+4.5+3+3}=3\\ \\Omega,\\qquad R_{AB}=R_{bo}+R_{od}=1+3=4\\ \\Omega$$'},
  {fig:'(3-44أ)',ref:'ص 96',caption:'شبكة قنطرة: a–b = 3 Ω، b–c = 6 Ω، a–c = 9 Ω، a–d = 4.5 Ω، c–d = 3 Ω؛ الطرف A متصل بـ b والطرف B متصل بـ d',draw:()=>box(fig344(0),400)},
  {fig:'(3-44ب)',ref:'ص 97',caption:'بعد تحويل الدلتا abc إلى نجمة مركزها o: b–o = 1 Ω، o–a = 1.5 Ω، o–c = 3 Ω، ثم a–d = 4.5 Ω و c–d = 3 Ω',draw:()=>box(fig344(1),400)},
  {note:NOTE_ADD+'بعد التحويل صار الطريقان o–a–d و o–c–d على التوازي (كل منهما 6 Ω) وهذا ما جعل الحل سهلاً. التحويل لا يغير شيئاً «خارج» المثلث: التيار في المقاومتين 4.5 Ω و 3 Ω هو نفسه في الشكلين — شاهد ذلك في المختبر.'},
  {err:`<div class="fixnote"><ul>
   <li><b>الشكل (3-43) ص 94:</b> اسما الضلعين R<sub>b</sub> و R<sub>c</sub> في الرسم لا يتفقان مع المعادلات (3-36) و(3-37) ولا مع الجدولين. بتبديل الاسمين في الرسم (R<sub>b</sub> بين N<sub>1</sub> و N<sub>2</sub>، و R<sub>c</sub> بين N<sub>3</sub> و N<sub>2</sub>) يتفق كل شيء، لذلك رسمنا الشكل مصححاً، والمفتاح أعلاه يعرض الرسم كما في الكتاب.</li>
   <li><b>المعادلة (3-37) ص 95:</b> السطر الثالث مطبوع «\\(R_1=\\frac{R_aR_C}{\\ldots}\\)» (R<sub>1</sub> مكررة)، والصحيح <b>R<sub>3</sub></b> كما يعامله الجدول (3-2). وص 94 تنتهي بعبارة «فالمقاومة الكلية بين N3 و N1 في الربط Δ هي:» بلا معادلة.</li>
   <li><b>الجدول (3-1) ص 95:</b> رؤوس الأعمدة المحسوبة مطبوعة «Rb، Rc، Rc» والصحيح بالمعادلات (3-36): <b>R<sub>a</sub> (= Σ/R<sub>2</sub>)، R<sub>c</sub> (= Σ/R<sub>1</sub>)، R<sub>b</sub> (= Σ/R<sub>3</sub>)</b>. و<b>الحالة 6 فيها خطأ حسابي</b>: المطبوع 29078 و 147864 و 140463، والصحيح <b>29037.1 و 149953.3 و 142447.9</b>. في تبويب الأمثلة حلان للحالة 6: كما في الكتاب والمصحح.</li>
   <li><b>مثال (3-39) ص 96:</b> كُتب «(الحالة الأولى الجدول (3-1))» والصحيح الجدول (3-2)؛ وترتيب القيم في النص «R<sub>A</sub>، R<sub>C</sub>، R<sub>B</sub> … 27Ω، 76Ω، 16Ω» لا يطابق الجدول، والصحيح من الجدول: R<sub>A</sub> = 16، R<sub>C</sub> = 27، R<sub>B</sub> = 76 Ω.</li>
   <li><b>مثال (3-40) ص 97:</b> «نحول شبكة الدلتا الشكل (3-44ب)» والمقصود الدلتا abc في الشكل (3-44أ)؛ و«المعادلة (7-2)» والصحيح <b>(3-37)</b>؛ والرمز «R<sub>ad</sub>» المقصود به R<sub>od</sub>، و«R<sub>ab</sub>» المقصود به R<sub>AB</sub>. صححناها في العرض.</li></ul></div>`}
 ],
 lab:(el)=>{
  let dir='yd',cs=0,pair='12',st=0;let inY={R1:12,R2:34,R3:1},inD={Ra:16,Rb:76,Rc:27};const bv={ab:3,bc:6,ac:9,ad:4.5,cd:3};const seen=new Set();let did={};
  el.innerHTML=`<div id="l11tp"></div><div class="grid cb-lab">
   <div class="panel c12"><h2>محوّل النجمة والدلتا <small>مبنية على الشكل (3-43) والجدولين (3-1) و(3-2) ص 94–96</small></h2>
    <div class="cb-row">${segHTML('dr',[['yd','نجمة ← دلتا (3-36)'],['dy','دلتا ← نجمة (3-37)']],dir)}<label class="sub">حالة من الجدول: <select class="cb-sel" id="l11cs"></select></label></div>
    <div class="cb-row" id="l11in"></div>
    <div class="svgbox" id="l11f" style="max-width:600px;margin-inline:auto"></div>
    <div id="l11res"></div>
    <h3 class="sm">أوميتر بين طرفين <span class="sub">(التكافؤ يعني نفس القراءة في الشبكتين)</span></h3>
    <div class="cb-row">${segHTML('pr',[['12','N1–N2'],['23','N2–N3'],['31','N3–N1']],pair)}</div><div class="facts" id="l11om"></div></div>
   <div class="panel c12"><h2>القنطرة <small>مبنية على الشكلين (3-44أ، ب) ص 96–97</small></h2>
    <div class="cb-row">${segHTML('bs',[[0,'الشبكة الأصلية (3-44أ)'],[1,'بعد التحويل (3-44ب)']],st)}</div>
    <div class="grid" style="margin-top:0"><div class="c7"><div class="svgbox" id="l11b" style="max-width:440px;margin-inline:auto"></div></div>
     <div class="c5"><div id="l11bsl"></div></div></div>
    <p class="sub">بين A و B مصدر اختبار E؛ الأرقام بجانب كل مقاومة: قيمتها ثم التيار فيها.</p>
    <div class="facts">${fact('R<sub>AB</sub> = E ÷ I','l11RAB')}${fact('تيار المصدر I','l11BI')}${fact('تيار a–d','l11Iad')}${fact('تيار c–d','l11Icd')}</div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l11st"></ol></div></div>`;
  B.math(el);const $=s=>el.querySelector(s);
  const TP=B.params($('#l11tp'),'u3-l11',[{k:'E',label:'جهد مصدر الاختبار بين A و B في القنطرة (الكتاب لا يذكر مصدراً)',unit:'V',value:12,min:0.1,max:1000,step:0.1}],()=>bridge());
  const fillCases=()=>{const L=dir==='yd'?T31:T32;$('#l11cs').innerHTML=`<option value="0">— قيم من عندي —</option>`+L.map((r,i)=>`<option value="${i+1}">${dir==='yd'?'الجدول (3-1)':'الجدول (3-2)'} — الحالة ${i+1}</option>`).join('');$('#l11cs').value=String(cs)};
  const inputs=()=>{const o=dir==='yd'?inY:inD;$('#l11in').innerHTML=Object.keys(o).map(k=>`<label class="sub">${k.replace(/^R(\w)/,'R<sub>$1</sub>')} = <input class="cb-in" type="number" min="0" step="any" data-k="${k}" value="${o[k]}"> Ω</label>`).join('');
   $('#l11in').querySelectorAll('[data-k]').forEach(i=>i.oninput=()=>{const v=parseFloat(i.value);if(v>0){o[i.dataset.k]=v;cs=0;$('#l11cs').value='0';conv()}})};
  $('#l11cs').onchange=e=>{cs=+e.target.value;if(cs){if(dir==='yd'){const [R3,R1,R2]=T31[cs-1];inY={R1,R2,R3}}else{const [Ra,Rc,Rb]=T32[cs-1];inD={Ra,Rb,Rc}}inputs()}conv()};
  segBind(el,'dr',v=>{dir=v;cs=0;fillCases();inputs();conv()});segBind(el,'pr',v=>{pair=v;conv()});
  const conv=()=>{let Y,D;if(dir==='yd'){Y=inY;const r=y2d(Y.R1,Y.R2,Y.R3);D={Ra:r.Ra,Rb:r.Rb,Rc:r.Rc}}else{D=inD;const r=d2y(D.Ra,D.Rb,D.Rc);Y={R1:r.R1,R2:r.R2,R3:r.R3}}
   const f=x=>fm(sig(x,6));$('#l11f').innerHTML=fig343('fixed',{vD:{Ra:f(D.Ra),Rb:f(D.Rb),Rc:f(D.Rc)},vS:{R1:f(Y.R1),R2:f(Y.R2),R3:f(Y.R3)}});
   let h='';if(dir==='yd'){const S=Y.R1*Y.R2+Y.R2*Y.R3+Y.R3*Y.R1;h=`<div class="callout">\\(\\Sigma=R_1R_2+R_2R_3+R_3R_1=${f(S)}\\)؛ \\(R_a=\\Sigma/R_2=${f(D.Ra)}\\)، \\(R_b=\\Sigma/R_3=${f(D.Rb)}\\)، \\(R_c=\\Sigma/R_1=${f(D.Rc)}\\ \\Omega\\)</div>`;
     if(cs){const P=T31P[cs-1],ex=[D.Ra,D.Rc,D.Rb];const bd=P.map((p,j)=>Math.abs(p-ex[j])/ex[j]>0.0005);h+=`<div class="callout ${bd.some(Boolean)?'err':''}">المطبوع في الجدول (3-1) للحالة ${cs}: ${['R<sub>a</sub>','R<sub>c</sub>','R<sub>b</sub>'].map((n,j)=>`${n} = <span class="ltr">${P[j]}</span>${bd[j]?' ✗':' ✓'}`).join('، ')}. ${bd.some(Boolean)?'<span class="fixnote"><b>خطأ حسابي في الكتاب</b> — القيم الصحيحة هي المحسوبة أعلاه.</span>':'تطابق الحساب (مع تقريب الكتاب).'}</div>`}}
   else{const S=D.Ra+D.Rb+D.Rc;h=`<div class="callout">\\(R_a+R_b+R_c=${f(S)}\\)؛ \\(R_1=R_aR_b/\\Sigma=${f(Y.R1)}\\)، \\(R_2=R_bR_c/\\Sigma=${f(Y.R2)}\\)، \\(R_3=R_aR_c/\\Sigma=${f(Y.R3)}\\ \\Omega\\)</div>`;
     if(cs){const P=T32P[cs-1];h+=`<div class="callout">المطبوع في الجدول (3-2) للحالة ${cs}: R<sub>3</sub> = <span class="ltr">${P[0]}</span>، R<sub>1</sub> = <span class="ltr">${P[1]}</span>، R<sub>2</sub> = <span class="ltr">${P[2]}</span> ✓</div>`}}
   $('#l11res').innerHTML=h;B.math($('#l11res'));
   const sY={'12':Y.R1+Y.R2,'23':Y.R2+Y.R3,'31':Y.R3+Y.R1}[pair];const sD={'12':par(D.Rb,D.Ra+D.Rc),'23':par(D.Rc,D.Ra+D.Rb),'31':par(D.Ra,D.Rb+D.Rc)}[pair];seen.add(pair);
   const nm={'12':'N<sub>1</sub>–N<sub>2</sub>','23':'N<sub>2</sub>–N<sub>3</sub>','31':'N<sub>3</sub>–N<sub>1</sub>'}[pair];
   $('#l11om').innerHTML=`<div class="fact"><span>النجمة بين ${nm} (مقاومتان على التوالي)</span><b>${f(sY)} Ω</b></div><div class="fact"><span>الدلتا بين ${nm} (ضلع ‖ مجموع الضلعين الآخرين)</span><b>${f(sD)} Ω</b></div><div class="fact"><span>النتيجة</span><b style="font-family:var(--font);font-size:15px">${Math.abs(sY-sD)/sY<1e-9?'متكافئتان ✓':'غير متكافئتين'}</b></div>`;
   did.cs=cs;did.dir=dir;steps&&steps.check()};
  const NB={ab:'a–b',bc:'b–c',ac:'a–c',ad:'a–d',cd:'c–d'};
  $('#l11bsl').innerHTML=Object.keys(bv).map(k=>sl('l11'+k,'المقاومة '+NB[k],0.5,20,0.5,bv[k])).join('');
  Object.keys(bv).forEach(k=>$('#l11'+k).oninput=e=>{bv[k]=+e.target.value;bridge()});
  segBind(el,'bs',v=>{st=+v;bridge()});
  const bridge=()=>{Object.keys(bv).forEach(k=>$('#l11'+k+'-v').textContent=fm(bv[k])+' Ω');const E=TP.v.E;let I,L;
   if(st===0){const r=mna(4,[{t:'V',a:1,b:0,v:E},{t:'R',a:1,b:2,r:bv.ab},{t:'R',a:1,b:3,r:bv.bc},{t:'R',a:2,b:3,r:bv.ac},{t:'R',a:2,b:0,r:bv.ad},{t:'R',a:3,b:0,r:bv.cd}]);I=r.i[0];L={ab:r.i[1],bc:r.i[2],ac:r.i[3],ad:r.i[4],cd:r.i[5]}}
   else{const S=bv.ab+bv.bc+bv.ac;const r=mna(5,[{t:'V',a:1,b:0,v:E},{t:'R',a:1,b:2,r:bv.bc*bv.ab/S},{t:'R',a:2,b:3,r:bv.ac*bv.ab/S},{t:'R',a:2,b:4,r:bv.bc*bv.ac/S},{t:'R',a:3,b:0,r:bv.ad},{t:'R',a:4,b:0,r:bv.cd}]);I=r.i[0];L={bo:r.i[1],ao:r.i[2],oc:r.i[3],ad:r.i[4],cd:r.i[5]};did.st1=1}
   $('#l11b').innerHTML=fig344(st,bv,L);$('#l11RAB').textContent=fm(sig(E/I,5))+' Ω';$('#l11BI').textContent=fm(sig(I,5))+' A';$('#l11Iad').textContent=fm(sig(L.ad,5))+' A';$('#l11Icd').textContent=fm(sig(L.cd,5))+' A';steps&&steps.check()};
  let steps=null;
  steps=stepsUI($('#l11st'),[
   {t:'مثال (3-38): الحالة 1',x:'في «نجمة ← دلتا» اختر «الجدول (3-1) — الحالة 1» (R<sub>1</sub> = 12، R<sub>2</sub> = 34، R<sub>3</sub> = 1 Ω): <span class="ltr">R<sub>a</sub> = 13.353</span>، <span class="ltr">R<sub>c</sub> = 37.833</span>، <span class="ltr">R<sub>b</sub> = 454 Ω</span>.',done:()=>dir==='yd'&&cs===1},
   {t:'تحقق بالأوميتر',x:'اختر الأزواج الثلاثة N1–N2 و N2–N3 و N3–N1: القراءة في النجمة تساوي القراءة في الدلتا في كل مرة — هذا معنى «التكافؤ» (ص 94).',done:()=>seen.size>=3},
   {t:'الحالة 6: خطأ في الجدول',x:'اختر «الحالة 6» وقارن الحساب بالأرقام المطبوعة: الثلاثة مختلفة (خطأ حسابي في الكتاب).',done:()=>dir==='yd'&&cs===6},
   {t:'مثال (3-39): من دلتا إلى نجمة',x:'اختر «دلتا ← نجمة» ثم «الجدول (3-2) — الحالة 1» (R<sub>A</sub> = 16، R<sub>C</sub> = 27، R<sub>B</sub> = 76 Ω): <span class="ltr">R<sub>1</sub> = 10.218</span>، <span class="ltr">R<sub>2</sub> = 17.244</span>، <span class="ltr">R<sub>3</sub> = 3.63 Ω</span>.',done:()=>dir==='dy'&&cs===1},
   {t:'القنطرة — مثال (3-40)',x:'في لوحة القنطرة بقيم الكتاب: <span class="ltr">R<sub>AB</sub> = 4 Ω</span>. اضغط «بعد التحويل»: نفس R<sub>AB</sub>.',done:()=>did.st1&&st===1&&bv.ab===3&&bv.bc===6&&bv.ac===9&&bv.ad===4.5&&bv.cd===3},
   {t:'ما خارج المثلث لا يتغير',x:'بدّل بين الشكلين وراقب تياري a–d و c–d: متساويان في الشكلين. غيّر أي مقاومة وكرر — التحويل يحفظ كل ما هو خارج الدلتا.'}
  ]);
  fillCases();$('#l11cs').value='0';inputs();conv();bridge();
 },
 examples:[
  {title:'مثال (3-38) — الحالة 1',ref:'ص 95',q:'<p>«لتكن المقاومات \\(R_1\\)، \\(R_2\\)، \\(R_3\\) الموضحة في الشكل (3-43) قيمتها 12Ω، 34Ω، 1Ω على التوالي (الحالة الأولى الجدول (3-1)). تم تحويل ربط Y إلى ربط Δ. احسب قيمة المقاومات \\(R_a\\), \\(R_c\\), \\(R_b\\) للحالات الست.» غيّر المعطيات لحساب أي حالة من الجدول.</p>'+box(fig343('fixed'),480),
   given:[{id:'R1',label:'',sym:'R_1',unit:'Ω',value:12},{id:'R2',label:'',sym:'R_2',unit:'Ω',value:34},{id:'R3',label:'',sym:'R_3',unit:'Ω',value:1}],solve:(g,B,bk)=>solve338(g,B,bk,false)},
  {title:'مثال (3-38) — الحالة 6 كما في الكتاب',ref:'ص 95',q:'<p>الحالة 6 من الجدول (3-1): \\(R_3=13546\\)، \\(R_1=12868\\)، \\(R_2=66453\\ \\Omega\\).</p>',
   given:[{id:'R1',label:'',sym:'R_1',unit:'Ω',value:12868},{id:'R2',label:'',sym:'R_2',unit:'Ω',value:66453},{id:'R3',label:'',sym:'R_3',unit:'Ω',value:13546}],solve:(g,B,bk)=>solve338(g,B,bk,true),
   note:'<b>ملاحظة على الكتاب:</b> بقيم الكتاب تعرض الحاسبة الأرقام المطبوعة في الجدول (29078، 140463، 147864) وهي خطأ حسابي. قارن بالحل المصحح التالي.'},
  {title:'مثال (3-38) — الحالة 6 المصححة',ref:'ص 95',q:'<p>نفس الحالة 6 بالحساب الصحيح بالمعادلات (3-36) (حل مصحح — ليس من الكتاب).</p>',
   given:[{id:'R1',label:'',sym:'R_1',unit:'Ω',value:12868},{id:'R2',label:'',sym:'R_2',unit:'Ω',value:66453},{id:'R3',label:'',sym:'R_3',unit:'Ω',value:13546}],solve:(g,B)=>solve338(g,B,false,true),
   note:'الصحيح: \\(R_a=29037.1\\)، \\(R_b=142447.9\\)، \\(R_c=149953.3\\ \\Omega\\).'},
  {title:'مثال (3-39) — الحالة 1',ref:'ص 96',q:'<p>«لتكن المقاومات \\(R_A\\)، \\(R_C\\)، \\(R_B\\) الموضحة في الشكل (3-43) قيمتها 16Ω، 27Ω، 76Ω (الحالة الأولى الجدول (3-2)). تم تحويل ربط Δ إلى ربط Y. احسب قيمة المقاومات \\(R_3\\)، \\(R_1\\)، \\(R_2\\) للحالات الخمس.»</p>',
   given:[{id:'Ra',label:'',sym:'R_A',unit:'Ω',value:16},{id:'Rc',label:'',sym:'R_C',unit:'Ω',value:27},{id:'Rb',label:'',sym:'R_B',unit:'Ω',value:76}],solve:solve339,
   note:'<span class="fixnote">رتبنا القيم كما في الجدول (3-2) (R<sub>A</sub> = 16، R<sub>C</sub> = 27، R<sub>B</sub> = 76)؛ ترتيبها في نص الكتاب لا يطابق الجدول.</span>'},
  {title:'مثال (3-40)',ref:'ص 96–97',q:'<p>«في شبكة المقاومات المبينة بالشكل (3-44أ). احسب قيمة المقاومة المكافئة عند الطرفين AB.»</p>'+box(fig344(0),360),
   given:[{id:'ab',label:'a–b',sym:'',unit:'Ω',value:3},{id:'bc',label:'b–c',sym:'',unit:'Ω',value:6},{id:'ac',label:'a–c',sym:'',unit:'Ω',value:9},{id:'ad',label:'a–d',sym:'',unit:'Ω',value:4.5},{id:'cd',label:'c–d',sym:'',unit:'Ω',value:3}],solve:solve340,
   note:'<span class="fixnote">في الكتاب: «الشكل (3-44ب)» بدل (3-44أ)، و«المعادلة (7-2)» بدل (3-37)، و R<sub>ad</sub> و R<sub>ab</sub> بدل R<sub>od</sub> و R<sub>AB</sub>. صححناها في الحل.</span>'}
 ],
 quiz:[
  {q:'متى نحتاج تحويل النجمة/الدلتا؟',o:['عندما تكون كل المقاومات على التوالي','عندما ترتبط ثلاث مقاومات لا على التوالي ولا على التوازي','عندما تكون المقاومات متساوية','عندما يوجد مصدر تيار'],c:1,e:'ص 94.'},
  {q:'الربط النجمي يسمى أيضاً:',o:['π','T','H','L'],c:1,e:'ص 94: «نجمي Y ويشار إليه أيضاً بالربط T»، والدلتا بالربط π.'},
  {q:'شرط تكافؤ النجمة والدلتا:',o:['نفس مجموع المقاومات','نفس المقاومة بين أي طرفين','نفس أكبر مقاومة','نفس عدد العقد'],c:1,e:'ص 94.'},
  {q:'نجمة مقاوماتها الثلاث 10 Ω. كل ضلع في الدلتا المكافئة:',o:['3.33 Ω','10 Ω','30 Ω','100 Ω'],c:2,e:'\\(\\Sigma=300\\)، \\(300/10=30\\ \\Omega\\) — أي \\(R_\\Delta=3R_Y\\).'},
  {q:'دلتا أضلاعها 3 و 6 و 9 Ω. ذراع النجمة بين الضلعين 3 و 9 Ω:',o:['1 Ω','1.5 Ω','3 Ω','4.5 Ω'],c:1,e:'\\(\\frac{9\\times3}{18}=1.5\\ \\Omega\\) (مثال 3-40).'},
  {q:'R<sub>AB</sub> لشبكة القنطرة في مثال (3-40):',o:['3 Ω','4 Ω','6 Ω','25.5 Ω'],c:1,e:'\\(1+3=4\\ \\Omega\\).'},
  {q:'عند تحويل الدلتا abc في القنطرة إلى نجمة، التيار في المقاومة a–d:',o:['يتغير دائماً','يبقى كما هو','يصبح صفراً','يتضاعف'],c:1,e:'التحويل يحفظ المقاومة بين الأطراف، فلا يتغير شيء خارج المثلث (توضيح — شاهده في المختبر).'}
 ]
});

/* ======================================================================
   Lesson 12 (u3-l12) — تمارين الوحدة الثالثة (ص 98–104)
   ====================================================================== */
/* single loop on a rectangle. sides: {t:[],r:[],b:[],l:[]} elements {k:'R'|'B', l, pol:'+'side ('l','r','u','d'), pm:['a','b'] marks at start/end, v: extra label} */
function loopFig(sides,o){o=o||{};const x0=o.x0||90,x1=o.x1||390,y0=40,y1=o.y1||220;let s='';
  const side=(list,p,q,dir)=>{const n=list.length;if(!n){s+=W([p,q]);return}const L=dir==='h'?q[0]-p[0]:q[1]-p[1],seg=L/n,len=Math.min(84,seg*0.8);
    let cur=dir==='h'?p[0]:p[1];list.forEach((e,i)=>{const c=(dir==='h'?p[0]:p[1])+seg*(i+0.5),a=c-len/2*Math.sign(L),b=c+len/2*Math.sign(L);
      if(dir==='h'){const y=p[1];s+=W([[cur,y],[a,y]]);const top=y===y0;
        if(e.k==='B'){s+=Bh(Math.min(a,b),Math.max(a,b),y,e.l,{left:e.pol==='l',lbBelow:!top})}else s+=Rz(Math.min(a,b),y,Math.max(a,b),y,e.l,{side:top?'t':'b',v:e.v});
        if(e.pm){s+=Pm(Math.min(a,b)-4,y+(top?16:-12),e.pm[0])+Pm(Math.max(a,b)+4,y+(top?16:-12),e.pm[1])}
        if(e.i)s+=CA((cur+a)/2,y,e.i[0],e.i.slice(1),{len:14,side:top?'t':'b'});cur=b}
      else{const x=p[0];s+=W([[x,cur],[x,a]]);const lft=x===x0;
        if(e.k==='B'){s+=Bv(x,Math.min(a,b),Math.max(a,b),e.l,{down:e.pol==='d',side:lft?'l':'r'})}else s+=Rz(x,Math.min(a,b),x,Math.max(a,b),e.l,{side:lft?'l':'r',v:e.v});
        if(e.pm){s+=Pm(x+(lft?14:-14),Math.min(a,b)+4,e.pm[0])+Pm(x+(lft?14:-14),Math.max(a,b)-2,e.pm[1])}
        if(e.i)s+=CA(x,(cur+a)/2,e.i[0],e.i.slice(1),{len:14,side:lft?'r':'l'});cur=b}});
    s+=dir==='h'?W([[cur,p[1]],q]):W([[p[0],cur],q])};
  side(sides.t||[],[x0,y0],[x1,y0],'h');side(sides.r||[],[x1,y0],[x1,y1],'v');side(sides.b||[],[x0,y1],[x1,y1],'h');side(sides.l||[],[x0,y0],[x0,y1],'v');
  if(o.RT)s+=T((x0+x1)/2,(y0+y1)/2,o.RT,{c:'b'});if(o.I)s+=T((x0+x1)/2,(y0+y1)/2+18,o.I,{c:'b',fs:11});
  return svg(x1+(o.wr||110),y1+(o.hb||40),s,o.aria)}
/* ladder: battery, then pairs [series, shunt]... */
function ladderFig(E,pairs,o){o=o||{};const yt=40,yb=200;let s=Bv(60,yt,yb,E,{})+W([[60,yt],[90,yt]])+W([[60,yb],[90,yb]]);let x=90;
  if(o.IS)s+=CA(76,yt,'r',o.IS,{len:12});
  pairs.forEach(([se,sh],k)=>{s+=Rz(x,yt,x+90,yt,se)+W([[x,yb],[x+110,yb]]);x+=110;s+=W([[x-20,yt],[x,yt]])+Dot(x,yt)+Dot(x,yb)+Rz(x,yt,x,yb,sh.l||sh,{side:'r'});if(sh.i)s+=CA(x,yt+26,'d',sh.i,{side:'l',len:14});if(sh.V)s+=Pm(x-16,yt+48,'+')+Pm(x-16,yb-30,'−')+T(x-16,(yt+yb)/2+20,sh.V,{a:'end',c:'b'})});
  if(o.RT)s+=RTa(110,(yt+yb)/2+30,o.RT,{len:30});
  return svgT(x+90,yb+22,s,'دائرة سلّمية')}
const X=[];   // exercises
const svgT=(w,h,inner,aria,dx,dy)=>{dx=dx==null?50:dx;dy=dy||0;return svg(w+dx,h+dy,`<g transform="translate(${dx} ${dy})">${inner}</g>`,aria)};
const fE=n=>`(${n})`;
/* figures */
const fx1a=()=>loopFig({l:[{k:'B',l:'E = 10 V',pol:'u'}],t:[{l:'200 kΩ'},{l:'1 MΩ'}],r:[{l:'330 kΩ'}],b:[{l:'0.1 MΩ'}]},{RT:'R_T',I:'I'});
function fx1b(){const yt=40,yb=200;let s=Bv(50,yt,yb,'120 V')+W([[50,yt],[80,yt]])+Rz(80,yt,180,yt,'1.2 kΩ')+W([[180,yt],[270,yt]])+Rz(270,yt,270,yb,'4.5 kΩ')+CA(64,yt,'r','I',{len:12});
  s+=W([[50,yb],[80,yb]])+Rz(80,yb,150,yb,'3 kΩ',{side:'b'})+Rz(170,yb,250,yb,'1.3 kΩ',{side:'b'})+W([[150,yb],[170,yb]])+W([[250,yb],[270,yb]])+Dot(270,yb)+Rz(270,yb,370,yb,'2.2 kΩ',{side:'b'})+Term(374,yb)+RTa(76,120,'R_T',{len:30});
  return svgT(400,236,s,'تمرين 4 ب')}
const fx2r=()=>loopFig({l:[{k:'B',l:'60V',pol:'u'}],t:[{l:'12.6KΩ'},{l:'R'}],b:[{l:'45KΩ'},{l:'400KΩ'}]},{RT:'R_T = 600KΩ',I:'I'});
const fx2l=()=>loopFig({t:[{k:'B',l:'50V',pol:'r'},{l:'0.2MΩ'}],r:[{l:'0.56KΩ'}],b:[{l:'R'}],l:[{l:'100KΩ'}]},{RT:'R_T = 1.6MΩ',I:'I'});
const fx3a=()=>loopFig({l:[{k:'B',l:'E = 50 V',pol:'d'}],t:[{l:'R_1 = 7 Ω'},{l:'R_2 = 4 Ω',pm:['−','+'],v:'V_2'}],r:[{l:'R_3 = 7 Ω'}],b:[{l:'R_4 = 7 Ω'}]},{RT:'R_T'});
const fx3b=()=>loopFig({l:[{k:'B',l:'E = 20 V',pol:'u'}],t:[{l:'R_1 = 2 Ω',pm:['+','−'],v:'V_1'}],r:[{l:'R_2',v:'V_2'}],b:[{l:'R_3 = 5 Ω',pm:['−','+'],v:'V_3'}]},{RT:'R_T'});
const fx4=()=>loopFig({t:[{k:'B',l:'6 V',pol:'r'},{l:'R',pm:['−','+'],v:'12 V'}],r:[{k:'B',l:'8 V',pol:'d'}],b:[{k:'B',l:'E',pol:'r'}],l:[{l:'2 kΩ',pm:['+','−'],v:'16 V'}]},{});
const fx5=()=>loopFig({t:[{k:'B',l:'40 V',pol:'r'}],r:[{l:'4 kΩ',v:'P = 144 mW'}],b:[{l:'R',pm:['−','+'],v:'10 V'}],l:[{l:'1 kΩ',i:'uI'}]},{});
const fx6a=()=>parFig({src:'term',RT:'R_T',rs:[{l:'R_1 = 12 Ω'},{l:'R_2 = 12 Ω'},{l:'R_3 = 12 Ω'}],aria:'ثلاث مقاومات 12 Ω على التوازي'});
const fx7a=()=>parFig({src:'term',RT:'R_T = 6 Ω',rs:[{l:'18 Ω'},{l:'R'},{l:'18 Ω'}],aria:'تمرين 10 أ'});
const fx7b=()=>parFig({src:'term',RT:'R_T = 4 Ω',rs:[{l:'R_1'},{l:'9 Ω'},{l:'R_2 = R_1'},{l:'18 Ω'}],dx:96,aria:'تمرين 10 ب'});
const fx8a=()=>parFig({src:'bat',E:'E = 48 V',IS:'I_s',RT:'R_T, G_T',rs:[{l:'R_1 = 8 kΩ',i:'I_1'},{l:'R_2 = 24 kΩ',i:'I_2'}],dx:130,aria:'تمرين 11 أ'});
const fx8b=()=>parFig({src:'bat',E:'E = 12 V',IS:'I_s',RT:'R_T, G_T',rs:[{l:'R_1 = 2.2 kΩ',i:'I_1'},{l:'R_2 = 4.7 kΩ',i:'I_2'},{l:'R_3 = 6.8 kΩ',i:'I_3'}],dx:110,aria:'تمرين 11 ب'});
const fx9=()=>hParFig({Iin:'I = 10 A',Iout:'',rs:[{l:'1 Ω',i:'I_1'},{l:'10 Ω',i:'I_2'},{l:'1 kΩ',i:'I_3'},{l:'100 kΩ',i:'I_4'}],aria:'تمرين 12'});
const fx10=()=>parFig({src:'bat',E:'E',IS:'2 A',rs:[{l:'30 Ω (P = 30 W)',i:'I_1'},{l:'R_2 (P_{R2})',i:'I_2'},{l:'R_3 = R_2',i:'I_3'}],dx:130,aria:'تمرين 13'});
function fx11(){const yt=40,yb=190;let s=Bv(50,yt,yb,'9 V')+W([[50,yt],[70,yt]])+Rz(70,yt,170,yt,'2.2 kΩ')+W([[170,yt],[190,yt]])+Dot(190,yt)+Rz(190,yt,190,yb,'47 kΩ')+Rz(190,yt,300,yt,'3.3 kΩ')+W([[300,yt],[330,yt]])+Term(334,yt)+Term(334,yb)+W([[330,yb],[50,yb]])+Dot(190,yb);
  s+=Pm(350,yt+10,'+')+Pm(350,yb-8,'−')+T(354,118,'V_L',{a:'start',fs:14});return svgT(400,206,s,'تمرين 14')}
function fx12(){const yt=40,yb=210;let s=Bv(50,yt,yb,'E = 64 V')+CA(50,180,'u','I',{side:'r',len:14})+W([[50,yt],[110,yt]])+Dot(110,yt)+W([[110,yt],[110,100],[140,100]])+W([[110,yt],[140,yt]]);
  s+=Rz(140,yt,250,yt,'R_1 = 12 Ω')+CA(126,yt,'r','I_1',{len:12})+Rz(140,100,250,100,'R_2 = 6 Ω',{side:'b'})+W([[250,yt],[280,yt]])+W([[250,100],[280,100],[280,yt]])+Dot(280,yt)+W([[280,yt],[350,yt]])+Rz(350,yt,350,yb,'R_3 = 12 Ω')+Pm(334,yt+40,'+')+Pm(334,yb-30,'−')+T(334,130,'V_3',{a:'end',c:'b'})+W([[350,yb],[50,yb]]);
  return svgT(450,226,s,'تمرين 16 الأول')}
const fx13=()=>ladderFig('E = 240 V',[['R_1 = 5 Ω','R_2 = 6 Ω'],['R_3 = 4 Ω','R_4 = 6 Ω'],['R_5 = 1 Ω',{l:'R_6 = 2 Ω',i:'I_6',V:'V_6'}]],{IS:'I_s',RT:'R_T'});
function fx14(){let s=Bv(40,40,320,'12V')+CA(40,280,'u','I',{side:'r',len:14})+T(40,30,'a',{fs:13})+Rz(40,40,150,40,'2Ω')+Dot(160,40)+T(160,30,'b',{fs:13})+W([[150,40],[160,40]])+W([[160,40],[160,200]]);
  s+=Rz(160,40,250,40,'2Ω')+CA(176,40,'r','I_1',{len:10,side:'b'})+Dot(270,40)+W([[250,40],[270,40]])+T(270,30,'e',{fs:12})+W([[270,40],[270,10],[300,10]])+W([[270,40],[270,70],[300,70]])+Rz(300,10,380,10,'5Ω')+Rz(300,70,380,70,'4Ω',{side:'b'})+W([[380,10],[400,10],[400,70],[380,70]])+Dot(400,40)+T(410,36,'f',{fs:12,a:'start'})+W([[400,40],[480,40]]);
  s+=Rz(160,120,480,120,'4Ω')+CA(184,120,'r','I_2',{len:10,side:'b'})+Rz(160,200,480,200,'6Ω')+CA(184,200,'r','I_3',{len:10,side:'b'})+W([[480,40],[480,240]])+Dot(160,120)+Dot(160,200)+Dot(480,120)+Dot(480,200)+T(492,214,'c',{fs:13,a:'start'})+Dot(480,240);
  s+=Rz(480,240,480,320,'1.5Ω',{side:'l'})+Rz(480,240,600,240,'2.5Ω')+Rz(600,240,600,320,'3Ω')+Rz(600,320,480,320,'0.5Ω',{side:'b'})+Dot(480,320)+T(470,336,'d',{fs:13})+W([[480,320],[40,320]]);
  return svgT(660,346,s,'تمرين 17',50,16)}
function fx15(){const a=[220,30],b=[80,230],c=[360,230],o=[220,160];let s=W([[220,30],[30,30],[30,100]])+Bv(30,100,170,'100V')+W([[30,170],[30,230],[80,230]]);
  s+=zz(a[0],a[1],b[0],b[1],'',7)+T(134,124,'3Ω',{a:'end'})+zz(a[0],a[1],c[0],c[1],'',7)+T(306,124,'6Ω',{a:'start'})+zz(b[0],b[1],c[0],c[1],'',7)+T(220,256,'9Ω');
  s+=zz(a[0],a[1],o[0],o[1],'',6)+T(230,96,'9Ω',{a:'start'})+zz(b[0],b[1],o[0],o[1],'',6)+T(140,188,'6Ω',{a:'end'})+zz(c[0],c[1],o[0],o[1],'',6)+T(300,188,'3Ω',{a:'start'});
  [['a',a,0,-8],['b',b,-8,16],['c',c,8,16],['o',o,0,22]].forEach(([n,[x,y],dx,dy])=>{s+=Dot(x,y)+T(x+dx,y+dy,n,{fs:13})});return svgT(400,270,s,'تمرين 20')}
function fx16(){const yt=40,yb=240;let s=Bv(40,yt,yb,'E')+CA(60,yt,'r','I_T',{len:12})+W([[40,yt],[80,yt]])+Rz(80,yt,160,yt,'8Ω')+W([[160,yt],[180,yt]])+Dot(180,yt)+W([[180,yt],[180,14],[200,14]])+W([[180,yt],[180,66],[200,66]])+Rz(200,14,270,14,'4Ω')+Rz(200,66,270,66,'6Ω',{side:'b'})+W([[270,14],[290,14],[290,66],[270,66]])+Dot(290,yt)+W([[290,yt],[480,yt]]);
  [[320,'12Ω','1A'],[400,'4Ω','3A'],[480,'6Ω','2A']].forEach(([x,l,i],k)=>{s+=Rz(x,yt,x,yb,l)+CA(x,yt+26,'d',i,{side:'l',len:14})+(k<2?Dot(x,yt)+Dot(x,yb):'')});
  s+=W([[480,yb],[300,yb]])+Rz(300,yb,220,yb,'3Ω',{side:'b'})+W([[220,yb],[200,yb]])+Rz(200,yb,120,yb,'7Ω',{side:'b'})+W([[120,yb],[40,yb]])+CA(360,yb,'l','I_T',{len:12,side:'b'});
  return svgT(560,276,s,'تمرين 21',50,16)}
function fx17(){const yt=40,yb=250;let s='';const cells=['20V','14V','25V','11V','10V'];const h=(yb-yt)/5;
  cells.forEach((c,k)=>{const y=yt+h*k;s+=Bv(40,y,y+h,c,{})});
  s+=W([[40,yt],[70,yt]])+Rz(70,yt,170,yt,'6Ω')+Rz(180,yt,280,yt,'9Ω')+W([[170,yt],[180,yt]])+W([[280,yt],[330,yt]])+CA(306,yt,'r','I_T',{len:12})+W([[330,yt],[330,70],[300,70]])+W([[330,70],[360,70]])+Rz(300,70,300,200,'6Ω',{side:'l'})+Rz(360,70,360,200,'3Ω')+W([[300,200],[360,200]])+W([[330,200],[330,yb]])+Dot(330,70)+Dot(330,200);
  s+=W([[330,yb],[280,yb]])+Rz(280,yb,180,yb,'8Ω',{side:'b'})+W([[180,yb],[170,yb]])+Rz(170,yb,70,yb,'5Ω',{side:'b'})+W([[70,yb],[40,yb]]);
  return svgT(440,280,s,'تمرين 22')}
const fx18=()=>parFig({src:'bat',E:'E',IS:'I_T',rs:[{l:'10Ω',i:'I_1'},{l:'2Ω',i:'5A'},{l:'5Ω',i:'2A'}],dx:120,aria:'تمرين 23'});

/* numeric helpers */
const r4=x=>B.round(x,4);
/* each exercise: n, ref, q, figs:[[fn,caption]], ans, given, solve(g)->steps, asks(g)->[{l,u,v}] (for the lab checker) */
X.push({n:'1',ref:'ص 98',q:'موصل مقاومته 28 Ω تزداد مقاومته بمقدار 12 % عندما تزداد درجة حرارته من 18 إلى 20°C، احسب متوسط ارتفاع درجة حرارة الموصل عند درجة حرارة محيطه تبلغ 20°C عندما تكون مقاومته 35Ω ويكون معامل درجة الحرارة ثابتاً.',
 ans:'بالمعادلة (3-14) منسوبة إلى 18°C: \\(R_{20}=28\\times1.12=31.36=28[1+\\alpha_{18}(20-18)]\\) ومنها \\(\\alpha_{18}=0.06\\) °C⁻¹. ثم \\(35=28[1+0.06(T-18)]\\) فتكون \\(T\\approx22.17\\)°C، والارتفاع فوق المحيط \\(22.17-20\\approx2.17\\)°C. <span class="fixnote"><b>تنبيه:</b> زيادة 12% في درجتين فقط غير واقعية لمعدن (الأرجح أن الرقم 20°C خطأ طباعي، قارن مثال 3-3: من 15 إلى 50°C)؛</span> الحاسبة تقبل أي درجة.',
 given:[{id:'R1',label:'المقاومة عند الدرجة الأولى',sym:'R_{T1}',unit:'Ω',value:28},{id:'pc',label:'نسبة الزيادة',sym:'',unit:'%',value:12},{id:'T1',label:'الدرجة الأولى',sym:'T_1',unit:'°C',value:18},{id:'T2',label:'الدرجة الثانية',sym:'T_2',unit:'°C',value:20},{id:'R',label:'المقاومة المعطاة',sym:'R',unit:'Ω',value:35},{id:'Ta',label:'درجة حرارة المحيط',sym:'',unit:'°C',value:20}],
 solve:(g,B)=>{if(!(g.T2!==g.T1&&g.pc>0&&g.R1>0))return bad('تأكد من القيم.');const a=B.round(g.pc/100/(g.T2-g.T1),6),T=B.round(g.T1+(g.R/g.R1-1)/a,2);
  return [{t:'بالمعادلة (3-14) \\(R_{T2}=R_{T1}[1+\\alpha_{T1}(T_2-T_1)]\\):',f:`${fm(g.R1)}\\times${fm(1+g.pc/100)}=${fm(g.R1)}[1+\\alpha_{${fm(g.T1)}}(${fm(g.T2)}-${fm(g.T1)})]`,v:a,unit:'°C⁻¹'},
   {t:'درجة الحرارة عندما تكون المقاومة '+fm(g.R)+' Ω:',f:`${fm(g.R)}=${fm(g.R1)}[1+${fm(a)}(T-${fm(g.T1)})]`,v:T,unit:'°C'},{t:'متوسط الارتفاع فوق درجة حرارة المحيط:',f:`\\Delta T=${fm(T)}-${fm(g.Ta)}`,v:B.round(T-g.Ta,2),unit:'°C',final:true}]},
 asks:g=>[{l:'متوسط ارتفاع درجة الحرارة',u:'°C',v:18+(35/28-1)/0.06-20}]});
X.push({n:'2',ref:'ص 98',q:'احسب التيار المار في المقاومة 4 Ω إذا كان فرق الجهد بين طرفيها 20 V.',ans:'بقانون أوم: \\(I=V/R=20/4=5\\) A.',
 given:[{id:'V',label:'الجهد',sym:'V',unit:'V',value:20},{id:'R',label:'المقاومة',sym:'R',unit:'Ω',value:4}],solve:(g,B)=>[{t:'بقانون أوم:',f:`I=\\frac{V}{R}=\\frac{${fm(g.V)}}{${fm(g.R)}}`,v:B.round(g.V/g.R,4),unit:'A',final:true}],asks:()=>[{l:'I',u:'A',v:5}]});
X.push({n:'3',ref:'ص 98',q:'احسب كفاءة المحرك الكهربائي إذا كانت القدرة الخارجة منه 850 W وكان التيار المغذي له 8A عند 120 V.',ans:'القدرة الداخلة \\(P_{in}=V\\,I=120\\times8=960\\) W، والكفاءة \\(\\eta=P_{out}/P_{in}=850/960=0.8854\\) أي \\(88.54\\%\\).',
 given:[{id:'Po',label:'القدرة الخارجة',sym:'P_{out}',unit:'W',value:850},{id:'I',label:'التيار',sym:'I',unit:'A',value:8},{id:'V',label:'الجهد',sym:'V',unit:'V',value:120}],
 solve:(g,B)=>{const Pi=B.round(g.V*g.I,4);return [{t:'القدرة الداخلة:',f:`P_{in}=V\\,I=${fm(g.V)}\\times${fm(g.I)}`,v:Pi,unit:'W'},{t:'الكفاءة:',f:`\\eta=\\frac{P_{out}}{P_{in}}\\times100=\\frac{${fm(g.Po)}}{${fm(Pi)}}\\times100`,v:B.round(g.Po/Pi*100,2),unit:'%',final:true}]},asks:()=>[{l:'الكفاءة',u:'%',v:850/960*100}]});
const serSolve=(names,unit,iu,k)=>(g,B)=>{const RT=B.round(names.reduce((s,n)=>s+g[n],0),4);return [{t:'المقاومات كلها على التوالي (حلقة واحدة):',f:`R_T=${names.map(n=>fm(g[n])).join('+')}`,v:RT,unit},{t:'',f:`I=\\frac{E}{R_T}=\\frac{${fm(g.E)}}{${fm(RT)}\\ \\text{${unit}}}`,v:B.round(g.E/RT*k,4),unit:iu,final:true}]};
X.push({n:'4 (أ)',ref:'ص 98',q:'احسب المقاومة الكلية والتيار الكلي من الدوائر الكهربائية التالية والموضحة في الشكل (1).',figs:[[fx1a,'الشكل (1) أ: كل المقاومات على التوالي في حلقة واحدة']],
 ans:'\\(R_T=200+1000+330+100=1630\\ k\\Omega=1.63\\ M\\Omega\\)، \\(I=10/1.63\\,M\\Omega=6.135\\ \\mu A\\).',
 given:[{id:'E',label:'جهد البطارية',sym:'E',unit:'V',value:10},{id:'a',label:'',sym:'R',unit:'kΩ',value:200},{id:'b',label:'',sym:'R',unit:'kΩ',value:1000},{id:'c',label:'',sym:'R',unit:'kΩ',value:330},{id:'d',label:'',sym:'R',unit:'kΩ',value:100}],solve:serSolve(['a','b','c','d'],'kΩ','µA',1000),
 asks:()=>[{l:'R<sub>T</sub>',u:'kΩ',v:1630},{l:'I',u:'µA',v:10/1630*1000}]});
X.push({n:'4 (ب)',ref:'ص 98',q:'(تابع التمرين 4) الدائرة (ب) من الشكل (1).',figs:[[fx1b,'الشكل (1) ب: المقاومة 2.2 kΩ طرفها الآخر مفتوح فلا يمر فيها تيار']],
 ans:'2.2 kΩ مفتوحة الطرف فلا تدخل. \\(R_T=1.2+4.5+3+1.3=10\\ k\\Omega\\)، \\(I=120/10\\,k\\Omega=12\\) mA.',
 given:[{id:'E',label:'جهد البطارية',sym:'E',unit:'V',value:120},{id:'a',label:'',sym:'R',unit:'kΩ',value:1.2},{id:'b',label:'',sym:'R',unit:'kΩ',value:4.5},{id:'c',label:'',sym:'R',unit:'kΩ',value:3},{id:'d',label:'',sym:'R',unit:'kΩ',value:1.3}],solve:serSolve(['a','b','c','d'],'kΩ','mA',1),
 asks:()=>[{l:'R<sub>T</sub>',u:'kΩ',v:10},{l:'I',u:'mA',v:12}]});
const unkSer=(g,B,names)=>{const R=B.round(g.RT-names.reduce((s,n)=>s+g[n],0),4);return [{t:'المقاومات على التوالي، فالمجهولة = الكلية − مجموع المعلومة:',f:`R=${fm(g.RT)}-(${names.map(n=>fm(g[n])).join('+')})`,v:R,unit:'kΩ',final:true}].concat(R<=0?[{t:'الناتج غير موجب: تأكد من القيم.'}]:[],[{t:'',f:`I=\\frac{E}{R_T}=\\frac{${fm(g.E)}}{${fm(g.RT)}\\ \\text{k}\\Omega}`,v:B.round(g.E/g.RT*1000,4),unit:'µA',final:true}])};
X.push({n:'5 (الرسم الأيمن)',ref:'ص 98',q:'إذا علمت المقاومة الكلية للدوائر الموضحة في الشكل (2)، احسب المقاومات المجهولة وكذلك التيار I لكل من هذه الدوائر.',figs:[[fx2r,'الشكل (2) — الرسم الأيمن: 60 V، والمقاومة الكلية 600 kΩ']],
 ans:'\\(R=600-12.6-45-400=142.4\\ k\\Omega\\)، \\(I=60/600\\,k\\Omega=0.1\\) mA = 100 µA.',
 given:[{id:'E',label:'الجهد',sym:'E',unit:'V',value:60},{id:'RT',label:'المقاومة الكلية',sym:'R_T',unit:'kΩ',value:600},{id:'a',label:'',sym:'',unit:'kΩ',value:12.6},{id:'b',label:'',sym:'',unit:'kΩ',value:45},{id:'c',label:'',sym:'',unit:'kΩ',value:400}],solve:(g,B)=>unkSer(g,B,['a','b','c']),
 asks:()=>[{l:'R',u:'kΩ',v:142.4},{l:'I',u:'µA',v:100}]});
X.push({n:'5 (الرسم الأيسر)',ref:'ص 98',q:'(تابع التمرين 5) الرسم الأيسر من الشكل (2).',figs:[[fx2l,'الشكل (2) — الرسم الأيسر: 50 V، والمقاومة الكلية 1.6 MΩ']],
 ans:'بالأرقام المطبوعة: \\(R=1600-200-0.56-100=1299.44\\ k\\Omega\\)، \\(I=50/1.6\\,M\\Omega=31.25\\ \\mu A\\). (إن كان المقصود 0.56 <b>M</b>Ω فإن \\(R=740\\ k\\Omega\\) — غيّر الرقم في الحاسبة.)',
 given:[{id:'E',label:'الجهد',sym:'E',unit:'V',value:50},{id:'RT',label:'المقاومة الكلية',sym:'R_T',unit:'kΩ',value:1600},{id:'a',label:'0.2 MΩ',sym:'',unit:'kΩ',value:200},{id:'b',label:'0.56 KΩ',sym:'',unit:'kΩ',value:0.56},{id:'c',label:'100 KΩ',sym:'',unit:'kΩ',value:100}],solve:(g,B)=>unkSer(g,B,['a','b','c']),
 asks:()=>[{l:'R',u:'kΩ',v:1299.44},{l:'I',u:'µA',v:31.25}]});
const serFull=(names,lbl)=>(g,B)=>{if(!names.every(n=>g[n]>0))return bad('المقاومات يجب أن تكون أكبر من صفر.');const RT=r4(names.reduce((s,n)=>s+g[n],0)),I=r4(g.E/RT);
  return [{t:'(أ) المقاومات كلها على التوالي:',f:`R_T=${names.map(n=>fm(g[n])).join('+')}`,v:RT,unit:'Ω'},{t:'',f:`I=\\frac{E}{R_T}=\\frac{${fm(g.E)}}{${fm(RT)}}`,v:I,unit:'A',final:true}]
   .concat(names.map((n,k)=>({t:k?'':'فرق الجهد عبر كل مقاومة \\(V=IR\\):',f:`V_{${lbl[k]}}=${fm(I)}\\times${fm(g[n])}`,v:r4(I*g[n]),unit:'V'})),
    names.map((n,k)=>({t:k?'':'(ب) القدرة المفقودة \\(P=I^2R\\):',f:`P_{${lbl[k]}}=${fm(I)}^2\\times${fm(g[n])}`,v:r4(I*I*g[n]),unit:'W'})),
    [{t:'قدرة البطارية:',f:`P_S=E\\times I=${fm(g.E)}\\times${fm(I)}`,v:r4(g.E*I),unit:'W',final:true},{t:'ومجموع قدرات المقاومات:',f:names.map((n,k)=>`P_{${lbl[k]}}`).join('+'),v:r4(names.reduce((s,n)=>s+I*I*g[n],0)),unit:'W'}])};
X.push({n:'6 (A)',ref:'ص 99',q:'للدوائر الكهربائية الموضحة في الشكل (3) احسب: (أ) المقاومة الكلية والتيار وفرق الجهد عبر كل مقاومة. (ب) القدرة المفقودة في كل مقاومة وكذلك قدرة البطارية وأثبت أن القدرة المفقودة في المقاومات تساوي قدرة المنبع (البطارية).',figs:[[fx3a,'الشكل (3) A']],
 ans:'\\(R_T=7+4+7+7=25\\ \\Omega\\)، \\(I=50/25=2\\) A؛ \\(V_1=V_3=V_4=14\\) V و \\(V_2=8\\) V؛ القدرات 28 و 16 و 28 و 28 W، مجموعها 100 W = \\(50\\times2\\).',
 given:[{id:'E',label:'',sym:'E',unit:'V',value:50},{id:'R1',label:'',sym:'R_1',unit:'Ω',value:7},{id:'R2',label:'',sym:'R_2',unit:'Ω',value:4},{id:'R3',label:'',sym:'R_3',unit:'Ω',value:7},{id:'R4',label:'',sym:'R_4',unit:'Ω',value:7}],solve:serFull(['R1','R2','R3','R4'],['1','2','3','4']),
 asks:()=>[{l:'R<sub>T</sub>',u:'Ω',v:25},{l:'I',u:'A',v:2},{l:'V<sub>2</sub>',u:'V',v:8},{l:'P<sub>S</sub>',u:'W',v:100}]});
X.push({n:'6 (B)',ref:'ص 99',q:'(تابع التمرين 6) الدائرة B من الشكل (3).',figs:[[fx3b,'الشكل (3) B — قيمة R2 غير مذكورة في الكتاب']],
 ans:'قيمة \\(R_2\\) غير مكتوبة في الكتاب، فالحل بدلالتها: \\(R_T=7+R_2\\)، \\(I=20/(7+R_2)\\)، \\(V_1=2I\\)، \\(V_2=R_2I\\)، \\(V_3=5I\\). في الحاسبة اكتب قيمة R<sub>2</sub> (القيمة الابتدائية 3 Ω <b>افتراضية من عندنا</b>، وبها: \\(R_T=10\\ \\Omega\\)، \\(I=2\\) A، \\(V_1=4\\)، \\(V_2=6\\)، \\(V_3=10\\) V، القدرات 8 و 12 و 20 W ومجموعها 40 W = \\(20\\times2\\)).',
 given:[{id:'E',label:'',sym:'E',unit:'V',value:20},{id:'R1',label:'',sym:'R_1',unit:'Ω',value:2},{id:'R2',label:'غير مذكورة في الكتاب — قيمة افتراضية',sym:'R_2',unit:'Ω',value:3},{id:'R3',label:'',sym:'R_3',unit:'Ω',value:5}],solve:serFull(['R1','R2','R3'],['1','2','3']),
 asks:()=>[{l:'I (بالقيمة الافتراضية R<sub>2</sub> = 3 Ω)',u:'A',v:2}]});
X.push({n:'7',ref:'ص 99',q:'احسب المقاومة R وجهد البطارية E للدائرة الموضحة في الشكل (4).',figs:[[fx4,'الشكل (4): حلقة واحدة فيها ثلاث بطاريات ومقاومتان، والجهود على المقاومتين معلومة بأقطابها']],
 ans:'تيار الحلقة من المقاومة 2 kΩ: \\(I=16/2\\,k=8\\) mA، فيكون \\(R=12/8\\,mA=1.5\\ k\\Omega\\). بقانون كيرشوف للجهد على اتجاه التيار (من + إلى − على المقاومتين): \\(-16+E-8-12-6=0\\) أي \\(E=42\\) V (البطاريتان 6 V و 8 V تُشحنان).',
 given:[{id:'VR2',label:'جهد المقاومة 2 kΩ',sym:'',unit:'V',value:16},{id:'R2k',label:'',sym:'',unit:'kΩ',value:2},{id:'VR',label:'جهد R',sym:'',unit:'V',value:12},{id:'E1',label:'البطارية العلوية',sym:'',unit:'V',value:6},{id:'E2',label:'البطارية اليمنى',sym:'',unit:'V',value:8}],
 solve:(g,B)=>{const I=r4(g.VR2/g.R2k);return [{t:'تيار الحلقة (التوالي: نفس التيار في كل العناصر):',f:`I=\\frac{${fm(g.VR2)}}{${fm(g.R2k)}\\ \\text{k}\\Omega}`,v:I,unit:'mA'},{t:'',f:`R=\\frac{${fm(g.VR)}}{${fm(I)}\\ \\text{mA}}`,v:r4(g.VR/I),unit:'kΩ',final:true},
  {t:'قانون كيرشوف للجهد حول الحلقة (حسب أقطاب الشكل):',f:`-${fm(g.VR2)}+E-${fm(g.E2)}-${fm(g.VR)}-${fm(g.E1)}=0`},{t:'',f:`E=${fm(g.VR2)}+${fm(g.E2)}+${fm(g.VR)}+${fm(g.E1)}`,v:r4(g.VR2+g.E2+g.VR+g.E1),unit:'V',final:true}]},
 asks:()=>[{l:'R',u:'kΩ',v:1.5},{l:'E',u:'V',v:42}]});
X.push({n:'8',ref:'ص 99',q:'احسب للدائرة الموضحة في الشكل (5) المقاومة R و فرق الجهد عبر كل مقاومة.',figs:[[fx5,'الشكل (5): حلقة واحدة، قدرة المقاومة 4 kΩ هي 144 mW وجهد R هو 10 V']],
 ans:'\\(P=I^2R\\Rightarrow I=\\sqrt{0.144/4000}=6\\) mA. \\(R=10/6\\,mA=1.667\\ k\\Omega\\)، \\(V_{4k}=24\\) V، \\(V_{1k}=6\\) V (والمجموع 24 + 10 + 6 = 40 V ✓).',
 given:[{id:'E',label:'',sym:'E',unit:'V',value:40},{id:'P',label:'قدرة المقاومة 4 kΩ',sym:'P',unit:'mW',value:144},{id:'R4',label:'',sym:'',unit:'kΩ',value:4},{id:'VR',label:'جهد R',sym:'',unit:'V',value:10},{id:'R1',label:'',sym:'',unit:'kΩ',value:1}],
 solve:(g,B)=>{const I=r4(Math.sqrt(g.P/g.R4));return [{t:'من قدرة المقاومة 4 kΩ:',f:`I=\\sqrt{\\frac{P}{R}}=\\sqrt{\\frac{${fm(g.P)}\\times10^{-3}}{${fm(g.R4)}\\times10^{3}}}`,v:I,unit:'mA'},
  {t:'',f:`R=\\frac{${fm(g.VR)}}{${fm(I)}\\ \\text{mA}}`,v:r4(g.VR/I),unit:'kΩ',final:true},{t:'',f:`V_{${fm(g.R4)}k}=${fm(I)}\\ \\text{mA}\\times${fm(g.R4)}\\ \\text{k}\\Omega`,v:r4(I*g.R4),unit:'V',final:true},{t:'',f:`V_{${fm(g.R1)}k}=${fm(I)}\\times${fm(g.R1)}`,v:r4(I*g.R1),unit:'V',final:true},
  {t:'تحقق بقانون كيرشوف للجهد:',f:`${fm(r4(I*g.R4))}+${fm(g.VR)}+${fm(r4(I*g.R1))}`,v:r4(I*g.R4+g.VR+I*g.R1),unit:'V'}]},
 asks:()=>[{l:'R',u:'kΩ',v:10/6},{l:'V<sub>4k</sub>',u:'V',v:24},{l:'V<sub>1k</sub>',u:'V',v:6}]});
X.push({n:'9',ref:'ص 100',q:'احسب المقاومة الكلية للدوائر الموضحة في شكل(6).',figs:[[fx6a,'الشكل (6) A: ثلاث مقاومات 12 Ω على التوازي'],[F319,'الشكل (6) B: 2 و 4 و 5 Ω على التوازي']],
 ans:'(A) متساوية: \\(R_T=12/3=4\\ \\Omega\\). (B) كمثال (3-18): \\(1/R_T=0.95\\) S و \\(R_T=1.053\\ \\Omega\\).',
 given:[{id:'a',label:'',sym:'R_1',unit:'Ω',value:12},{id:'b',label:'',sym:'R_2',unit:'Ω',value:12},{id:'c',label:'',sym:'R_3',unit:'Ω',value:12}],solve:(g,B)=>{const G=r4(1/g.a+1/g.b+1/g.c);return [{t:'المعادلة (3-30) (غيّر القيم إلى 2 و 4 و 5 للدائرة B):',f:`\\frac{1}{R_T}=\\frac{1}{${fm(g.a)}}+\\frac{1}{${fm(g.b)}}+\\frac{1}{${fm(g.c)}}`,v:G,unit:'S'},{t:'',f:`R_T=\\frac{1}{${fm(G)}}`,v:B.round(1/G,3),unit:'Ω',final:true}]},
 asks:()=>[{l:'R<sub>T</sub> للدائرة A',u:'Ω',v:4},{l:'R<sub>T</sub> للدائرة B',u:'Ω',v:1/0.95}]});
X.push({n:'10',ref:'ص 100',q:'احسب المقاومات المجهولة للدوائر الموضحة في الشكل (7).',figs:[[fx7a,'الشكل (7) A'],[fx7b,'الشكل (7) B: R2 = R1']],
 ans:'(A) \\(\\frac16=\\frac{2}{18}+\\frac1R\\Rightarrow\\frac1R=\\frac16-\\frac19=\\frac1{18}\\) أي \\(R=18\\ \\Omega\\). (B) \\(\\frac14=\\frac{2}{R_1}+\\frac19+\\frac1{18}=\\frac{2}{R_1}+\\frac16\\Rightarrow\\frac{2}{R_1}=\\frac1{12}\\) أي \\(R_1=R_2=24\\ \\Omega\\).',
 given:[{id:'RT',label:'المقاومة الكلية (الدائرة B)',sym:'R_T',unit:'Ω',value:4},{id:'a',label:'',sym:'',unit:'Ω',value:9},{id:'b',label:'',sym:'',unit:'Ω',value:18},{id:'n',label:'عدد المقاومات المجهولة المتساوية',sym:'',unit:'',value:2,step:1}],
 solve:(g,B)=>{const x=B.round(1/g.RT-1/g.a-1/g.b,6);if(!(x>0))return bad('بهذه القيم لا يوجد حل موجب: R<sub>T</sub> يجب أن تكون أصغر من مكافئ المقاومات المعلومة.');return [{t:'من (3-30): \\(\\frac{1}{R_T}=\\frac{n}{R}+\\frac{1}{R_a}+\\frac{1}{R_b}\\) (للدائرة A ضع R<sub>T</sub> = 6 و 18 و 18 و n = 1):',f:`\\frac{${fm(g.n)}}{R}=\\frac{1}{${fm(g.RT)}}-\\frac{1}{${fm(g.a)}}-\\frac{1}{${fm(g.b)}}`,v:x,unit:'S'},{t:'',f:`R=\\frac{${fm(g.n)}}{${fm(x)}}`,v:B.round(g.n/x,3),unit:'Ω',final:true}]},
 asks:()=>[{l:'R في الدائرة A',u:'Ω',v:18},{l:'R<sub>1</sub> في الدائرة B',u:'Ω',v:24}]});
const parFull=(names,ku)=>(g,B)=>{if(!names.every(n=>g[n]>0))return bad('المقاومات يجب أن تكون أكبر من صفر.');const G=names.reduce((s,n)=>s+1/g[n],0),RT=r4(1/G),IS=r4(g.E*G);
  return [{t:'الموصلية الكلية والمقاومة الكلية:',f:`G_T=${names.map(n=>`\\frac{1}{${fm(g[n])}}`).join('+')}`,v:r4(G),unit:'mS'},{t:'',f:`R_T=\\frac{1}{G_T}`,v:RT,unit:'kΩ',final:true},{t:'',f:`I_s=\\frac{E}{R_T}=\\frac{${fm(g.E)}}{${fm(RT)}\\ \\text{k}\\Omega}`,v:IS,unit:'mA',final:true}]
   .concat(names.map((n,k)=>({t:k?'':'تيار كل فرع \\(I=E/R\\):',f:`I_${k+1}=\\frac{${fm(g.E)}}{${fm(g[n])}}`,v:r4(g.E/g[n]),unit:'mA'})),names.map((n,k)=>({t:k?'':'القدرة \\(P=E\\,I\\):',f:`P_${k+1}=${fm(g.E)}\\times${fm(r4(g.E/g[n]))}`,v:r4(g.E*g.E/g[n]),unit:'mW'})),[{t:'قدرة المنبع:',f:`P_S=E\\,I_s`,v:r4(g.E*IS),unit:'mW'}])};
X.push({n:'11 (A)',ref:'ص 100',q:'احسب المقاومة الكلية والتيار \\(I_S\\) وكذلك التيارات في كل فرع بالإضافة إلى القدرة المفقودة في كل مقاومة وذلك للدوائر الموضحة في الشكل (8).',figs:[[fx8a,'الشكل (8) A']],
 ans:'\\(R_T=\\frac{8\\times24}{32}=6\\ k\\Omega\\) (\\(G_T=0.1667\\) mS)، \\(I_S=48/6k=8\\) mA، \\(I_1=6\\) mA، \\(I_2=2\\) mA، \\(P_1=288\\) mW، \\(P_2=96\\) mW (المجموع 384 mW = \\(48\\times8\\)).',
 given:[{id:'E',label:'',sym:'E',unit:'V',value:48},{id:'a',label:'',sym:'R_1',unit:'kΩ',value:8},{id:'b',label:'',sym:'R_2',unit:'kΩ',value:24}],solve:parFull(['a','b']),
 asks:()=>[{l:'R<sub>T</sub>',u:'kΩ',v:6},{l:'I<sub>S</sub>',u:'mA',v:8},{l:'P<sub>1</sub>',u:'mW',v:288}]});
X.push({n:'11 (B)',ref:'ص 100',q:'(تابع التمرين 11) الدائرة B من الشكل (8).',figs:[[fx8b,'الشكل (8) B']],
 ans:'\\(G_T=\\frac1{2.2}+\\frac1{4.7}+\\frac1{6.8}=0.8144\\) mS، \\(R_T=1.228\\ k\\Omega\\)، \\(I_S=9.772\\) mA، \\(I_1=5.455\\)، \\(I_2=2.553\\)، \\(I_3=1.765\\) mA؛ \\(P_1=65.45\\)، \\(P_2=30.64\\)، \\(P_3=21.18\\) mW.',
 given:[{id:'E',label:'',sym:'E',unit:'V',value:12},{id:'a',label:'',sym:'R_1',unit:'kΩ',value:2.2},{id:'b',label:'',sym:'R_2',unit:'kΩ',value:4.7},{id:'c',label:'',sym:'R_3',unit:'kΩ',value:6.8}],solve:parFull(['a','b','c']),
 asks:()=>[{l:'R<sub>T</sub>',u:'kΩ',v:1/(1/2.2+1/4.7+1/6.8)},{l:'I<sub>S</sub>',u:'mA',v:12*(1/2.2+1/4.7+1/6.8)}]});
X.push({n:'12',ref:'ص 101',q:'احسب المقاومة الكلية للدائرة المبينة في الشكل (9) واحسب كذلك التيارات المارة في كل مقاومة.',figs:[[fx9,'الشكل (9): تيار 10 A يتوزع على 1 Ω و 10 Ω و 1 kΩ و 100 kΩ']],
 ans:'\\(G_T=1+0.1+0.001+0.00001=1.10101\\) S، \\(R_T=0.9083\\ \\Omega\\)، الجهد \\(V=10\\times0.9083=9.083\\) V، \\(I_1=9.083\\) A، \\(I_2=0.9083\\) A، \\(I_3=9.083\\) mA، \\(I_4=90.83\\ \\mu A\\). (المقاومة الصغيرة تأخذ معظم التيار.)',
 given:[{id:'I',label:'',sym:'I',unit:'A',value:10},{id:'a',label:'',sym:'',unit:'Ω',value:1},{id:'b',label:'',sym:'',unit:'Ω',value:10},{id:'c',label:'',sym:'',unit:'Ω',value:1000},{id:'d',label:'',sym:'',unit:'Ω',value:100000}],
 solve:(g,B)=>{const G=g.a&&1/g.a+1/g.b+1/g.c+1/g.d,RT=B.round(1/G,5),V=B.round(g.I*RT,4);return [{t:'',f:`\\frac1{R_T}=\\frac1{${fm(g.a)}}+\\frac1{${fm(g.b)}}+\\frac1{${fm(g.c)}}+\\frac1{${fm(g.d)}}`,v:B.round(G,5),unit:'S'},{t:'',f:'R_T=1/G_T',v:RT,unit:'Ω',final:true},{t:'جهد التوازي:',f:`V=I\\,R_T=${fm(g.I)}\\times${fm(RT)}`,v:V,unit:'V'}].concat(['a','b','c','d'].map((k,i)=>{const I=V/g[k],m=Math.abs(I)<0.1;return {t:'',f:`I_${i+1}=\\frac{V}{${fm(g[k])}}`,v:m?B.round(I*1000,4):B.round(I,4),unit:m?'mA':'A',final:true}}))},
 asks:()=>{const G=1+0.1+0.001+0.00001;return [{l:'R<sub>T</sub>',u:'Ω',v:1/G},{l:'I<sub>1</sub>',u:'A',v:10/G},{l:'I<sub>3</sub>',u:'mA',v:10/G/1000*1000}]}});
X.push({n:'13',ref:'ص 101',q:'احسب الكميات المجهولة في الدائرة الموضحة في الشكل (10).',figs:[[fx10,'الشكل (10): التيار الكلي 2 A، وقدرة المقاومة 30 Ω هي 30 W، و R3 = R2']],
 ans:'\\(P=V^2/R\\Rightarrow V=\\sqrt{30\\times30}=30\\) V = E. \\(I_1=30/30=1\\) A، فيبقى \\(2-1=1\\) A يتوزع بالتساوي على R<sub>2</sub> و R<sub>3</sub> (متساويتان): \\(I_2=I_3=0.5\\) A، \\(R_2=R_3=30/0.5=60\\ \\Omega\\)، \\(P_{R2}=30\\times0.5=15\\) W.',
 given:[{id:'I',label:'التيار الكلي',sym:'I',unit:'A',value:2},{id:'R1',label:'',sym:'R_1',unit:'Ω',value:30},{id:'P1',label:'قدرة R1',sym:'P',unit:'W',value:30}],
 solve:(g,B)=>{const V=r4(Math.sqrt(g.P1*g.R1)),I1=r4(V/g.R1),I2=r4((g.I-I1)/2);if(!(I2>0))return bad('التيار الكلي يجب أن يكون أكبر من تيار R1.');return [{t:'',f:`E=V=\\sqrt{P\\,R_1}=\\sqrt{${fm(g.P1)}\\times${fm(g.R1)}}`,v:V,unit:'V',final:true},{t:'',f:`I_1=\\frac{${fm(V)}}{${fm(g.R1)}}`,v:I1,unit:'A'},{t:'R<sub>2</sub> = R<sub>3</sub> فيتقاسمان الباقي بالتساوي:',f:`I_2=I_3=\\frac{${fm(g.I)}-${fm(I1)}}{2}`,v:I2,unit:'A'},{t:'',f:`R_2=R_3=\\frac{${fm(V)}}{${fm(I2)}}`,v:r4(V/I2),unit:'Ω',final:true},{t:'',f:`P_{R2}=V\\,I_2=${fm(V)}\\times${fm(I2)}`,v:r4(V*I2),unit:'W',final:true}]},
 asks:()=>[{l:'E',u:'V',v:30},{l:'R<sub>2</sub>',u:'Ω',v:60},{l:'P<sub>R2</sub>',u:'W',v:15}]});
X.push({n:'14',ref:'ص 101',q:'للدائرة الموضحة في الشكل (11) احسب: أ- فرق الجهد \\(V_L\\) بين طرفي الدائرة المفتوحة. ب- إذا تم عمل قصر بين طرفي المقاومة 2.2 KΩ احسب قيمة \\(V_L\\). ج- إذا تم عمل قصر بين طرفي \\(V_L\\) احسب تيار القصر في هذه الحالة.',figs:[[fx11,'الشكل (11)']],
 ans:'أ) لا تيار في 3.3 kΩ: \\(V_L=9\\times\\frac{47}{2.2+47}=8.598\\) V. ب) بقصر 2.2 kΩ يصبح \\(V_L=9\\) V. ج) بقصر الطرفين: \\(R_T=2.2+\\frac{47\\times3.3}{50.3}=5.284\\ k\\Omega\\)، \\(I_T=1.703\\) mA، وتيار القصر (في 3.3 kΩ) \\(=1.703\\times\\frac{47}{50.3}=1.592\\) mA.',
 given:[{id:'E',label:'',sym:'E',unit:'V',value:9},{id:'a',label:'المقاومة على التوالي',sym:'',unit:'kΩ',value:2.2},{id:'b',label:'المقاومة على التوازي',sym:'',unit:'kΩ',value:47},{id:'c',label:'المقاومة إلى الطرف',sym:'',unit:'kΩ',value:3.3}],
 solve:(g,B)=>{const VL=r4(g.E*g.b/(g.a+g.b)),Rp=r4(g.b*g.c/(g.b+g.c)),RT=r4(g.a+Rp),IT=r4(g.E/RT),Isc=r4(IT*g.b/(g.b+g.c));
  return [{t:'أ) الطرفان مفتوحان فلا تيار في '+fm(g.c)+' kΩ (قاعدة توزيع الجهد):',f:`V_L=E\\frac{${fm(g.b)}}{${fm(g.a)}+${fm(g.b)}}`,v:VL,unit:'V',final:true},{t:'ب) قصر '+fm(g.a)+' kΩ: تتصل E مباشرة بالطرفين (لا تيار في '+fm(g.c)+' kΩ):',f:'V_L=E',v:g.E,unit:'V',final:true},
   {t:'ج) قصر الطرفين: '+fm(g.c)+' kΩ تصبح على التوازي مع '+fm(g.b)+' kΩ:',f:`R_T=${fm(g.a)}+\\frac{${fm(g.b)}\\times${fm(g.c)}}{${fm(g.b)}+${fm(g.c)}}`,v:RT,unit:'kΩ'},{t:'',f:`I_T=\\frac{${fm(g.E)}}{${fm(RT)}}`,v:IT,unit:'mA'},{t:'تيار القصر بقاعدة توزيع التيار:',f:`I_{sc}=I_T\\frac{${fm(g.b)}}{${fm(g.b)}+${fm(g.c)}}`,v:Isc,unit:'mA',final:true}]},
 asks:()=>[{l:'أ) V<sub>L</sub>',u:'V',v:9*47/49.2},{l:'ج) I<sub>sc</sub>',u:'mA',v:9/(2.2+47*3.3/50.3)*47/50.3}]});
X.push({n:'«16» (الأول)',ref:'ص 102',q:'احسب الكميات المجهولة في الدائرة الموضحة في الشكل (12).',figs:[[fx12,'الشكل (12)']],
 ans:'\\(12\\parallel6=4\\ \\Omega\\)، \\(R_T=4+12=16\\ \\Omega\\)، \\(I=64/16=4\\) A، \\(V_3=48\\) V، جهد التوازي 16 V، \\(I_1=16/12=1.333\\) A، \\(I_2=16/6=2.667\\) A.',
 given:[{id:'E',label:'',sym:'E',unit:'V',value:64},{id:'R1',label:'',sym:'R_1',unit:'Ω',value:12},{id:'R2',label:'',sym:'R_2',unit:'Ω',value:6},{id:'R3',label:'',sym:'R_3',unit:'Ω',value:12}],
 solve:(g,B)=>{const Rp=r4(g.R1*g.R2/(g.R1+g.R2)),RT=r4(Rp+g.R3),I=r4(g.E/RT),Vp=r4(I*Rp);return [{t:'',f:`R_p=\\frac{${fm(g.R1)}\\times${fm(g.R2)}}{${fm(g.R1)}+${fm(g.R2)}}`,v:Rp,unit:'Ω'},{t:'',f:`R_T=${fm(Rp)}+${fm(g.R3)}`,v:RT,unit:'Ω',final:true},{t:'',f:`I=\\frac{${fm(g.E)}}{${fm(RT)}}`,v:I,unit:'A',final:true},{t:'',f:`V_3=I\\,R_3`,v:r4(I*g.R3),unit:'V',final:true},{t:'جهد التوازي:',f:`V_p=I\\,R_p`,v:Vp,unit:'V'},{t:'',f:`I_1=\\frac{${fm(Vp)}}{${fm(g.R1)}}`,v:B.round(Vp/g.R1,3),unit:'A',final:true},{t:'',f:`I_2=\\frac{${fm(Vp)}}{${fm(g.R2)}}`,v:B.round(Vp/g.R2,3),unit:'A',final:true}]},
 asks:()=>[{l:'R<sub>T</sub>',u:'Ω',v:16},{l:'I',u:'A',v:4},{l:'V<sub>3</sub>',u:'V',v:48},{l:'I<sub>1</sub>',u:'A',v:4/3}]});
X.push({n:'16',ref:'ص 102',q:'احسب الكميات المجهولة في الدائرة الموضحة في الشكل (13).',figs:[[fx13,'الشكل (13): دائرة سلّمية']],
 ans:'من آخر الدائرة: \\(1+2=3\\)، \\(3\\parallel6=2\\)، \\(2+4=6\\)، \\(6\\parallel6=3\\)، \\(R_T=3+5=8\\ \\Omega\\). \\(I_s=240/8=30\\) A، \\(V_{R2}=240-150=90\\) V، \\(I_{R2}=15\\) A، \\(I_{R3}=15\\) A، \\(V_{R4}=90-60=30\\) V، \\(I_{R4}=5\\) A، \\(I_6=10\\) A، \\(V_6=20\\) V.',
 given:[{id:'E',label:'',sym:'E',unit:'V',value:240},{id:'R1',label:'',sym:'R_1',unit:'Ω',value:5},{id:'R2',label:'',sym:'R_2',unit:'Ω',value:6},{id:'R3',label:'',sym:'R_3',unit:'Ω',value:4},{id:'R4',label:'',sym:'R_4',unit:'Ω',value:6},{id:'R5',label:'',sym:'R_5',unit:'Ω',value:1},{id:'R6',label:'',sym:'R_6',unit:'Ω',value:2}],
 solve:(g,B)=>{const a=r4(g.R5+g.R6),b=r4(a*g.R4/(a+g.R4)),c=r4(b+g.R3),d=r4(c*g.R2/(c+g.R2)),RT=r4(d+g.R1),Is=r4(g.E/RT),V2=r4(Is*d),I3=r4(V2/c),V4=r4(I3*b),I6=r4(V4/a);
  return [{t:'نختزل من آخر الدائرة:',f:`R_5+R_6=${fm(a)},\\ ${fm(a)}\\parallel R_4=${fm(b)},\\ +R_3=${fm(c)},\\ ${fm(c)}\\parallel R_2=${fm(d)}`},{t:'',f:`R_T=${fm(d)}+R_1`,v:RT,unit:'Ω',final:true},{t:'',f:`I_s=\\frac{${fm(g.E)}}{${fm(RT)}}`,v:Is,unit:'A',final:true},
   {t:'',f:`V_{R2}=I_s\\times${fm(d)}`,v:V2,unit:'V'},{t:'',f:`I_{R2}=\\frac{${fm(V2)}}{${fm(g.R2)}}`,v:r4(V2/g.R2),unit:'A'},{t:'',f:`I_{R3}=\\frac{${fm(V2)}}{${fm(c)}}`,v:I3,unit:'A'},{t:'',f:`V_{R4}=I_{R3}\\times${fm(b)}`,v:V4,unit:'V'},{t:'',f:`I_{R4}=\\frac{${fm(V4)}}{${fm(g.R4)}}`,v:r4(V4/g.R4),unit:'A'},
   {t:'',f:`I_6=\\frac{${fm(V4)}}{${fm(a)}}`,v:I6,unit:'A',final:true},{t:'',f:`V_6=I_6\\,R_6`,v:r4(I6*g.R6),unit:'V',final:true}]},
 asks:()=>[{l:'R<sub>T</sub>',u:'Ω',v:8},{l:'I<sub>s</sub>',u:'A',v:30},{l:'I<sub>6</sub>',u:'A',v:10},{l:'V<sub>6</sub>',u:'V',v:20}]});
const ex17=()=>{const b1=2+20/9,Rbc=par(b1,4,6),Rcd=par(1.5,6),RT=2+Rbc+Rcd,I=12/RT,Vbc=I*Rbc;return {b1,Rbc,Rcd,RT,I,Vbc,I1:Vbc/b1,I2:Vbc/4,I3:Vbc/6}};
X.push({n:'17',ref:'ص 102',q:'من الدائرة الممثلة في الشكل (14) احسب التيار الكلي I وكذلك التيارات \\(I_1\\)، \\(I_2\\)، \\(I_3\\).',figs:[[fx14,'الشكل (14) — رسمنا الفروع كما فهمناها من الكتاب: بين b و c ثلاثة فروع، وبين c و d المقاومة 1.5 Ω على التوازي مع (2.5 + 3 + 0.5) Ω']],
 ans:(()=>{const r=ex17();return `الفرع الأول \\(2+\\frac{5\\times4}{9}=${fm(r.b1,3)}\\ \\Omega\\)؛ \\(R_{bc}=${fm(r.b1,3)}\\parallel4\\parallel6=${fm(r.Rbc,3)}\\ \\Omega\\)؛ \\(R_{cd}=1.5\\parallel6=1.2\\ \\Omega\\)؛ \\(R_T=2+${fm(r.Rbc,3)}+1.2=${fm(r.RT,3)}\\ \\Omega\\)؛ \\(I=12/${fm(r.RT,3)}=${fm(r.I,3)}\\) A؛ \\(V_{bc}=${fm(r.Vbc,3)}\\) V فيكون \\(I_1=${fm(r.I1,3)}\\)، \\(I_2=${fm(r.I2,3)}\\)، \\(I_3=${fm(r.I3,3)}\\) A.`})(),
 given:[{id:'E',label:'',sym:'E',unit:'V',value:12}],solve:(g,B)=>{const r=ex17(),k=g.E/12;return [{t:'الفرع الأول (2 Ω + (5 ‖ 4)):',f:'2+\\frac{5\\times4}{5+4}',v:B.round(r.b1,4),unit:'Ω'},{t:'',f:`R_{bc}=${fm(B.round(r.b1,4))}\\parallel4\\parallel6`,v:B.round(r.Rbc,4),unit:'Ω'},{t:'',f:'R_{cd}=1.5\\parallel(2.5+3+0.5)=1.5\\parallel6',v:1.2,unit:'Ω'},{t:'',f:`R_T=2+${fm(B.round(r.Rbc,4))}+1.2`,v:B.round(r.RT,4),unit:'Ω',final:true},
  {t:'',f:`I=\\frac{${fm(g.E)}}{${fm(B.round(r.RT,4))}}`,v:B.round(r.I*k,4),unit:'A',final:true},{t:'',f:'V_{bc}=I\\,R_{bc}',v:B.round(r.Vbc*k,4),unit:'V'},{t:'',f:'I_1=V_{bc}/'+fm(B.round(r.b1,4)),v:B.round(r.I1*k,4),unit:'A',final:true},{t:'',f:'I_2=V_{bc}/4',v:B.round(r.I2*k,4),unit:'A',final:true},{t:'',f:'I_3=V_{bc}/6',v:B.round(r.I3*k,4),unit:'A',final:true}]},
 note:'الحاسبة هنا تغير جهد البطارية فقط (المقاومات ثابتة كما في الشكل).',
 asks:()=>{const r=ex17();return [{l:'I',u:'A',v:r.I},{l:'I<sub>1</sub>',u:'A',v:r.I1},{l:'I<sub>2</sub>',u:'A',v:r.I2},{l:'I<sub>3</sub>',u:'A',v:r.I3}]}});
const ex20=(g)=>{g=g||{ab:3,ac:6,bc:9,ao:9,bo:6,co:3,E:100};const S=g.ao*g.bo+g.bo*g.co+g.co*g.ao,dab=S/g.co,dac=S/g.bo,dbc=S/g.ao,pab=par(g.ab,dab),pac=par(g.ac,dac),pbc=par(g.bc,dbc),R=par(pab,pac+pbc);return {S,dab,dac,dbc,pab,pac,pbc,R,P:g.E*g.E/R}};
X.push({n:'20',ref:'ص 103',q:'احسب القدرة المغذاة إلى الشبكة الشكل (15).',figs:[[fx15,'الشكل (15): دلتا خارجية (3، 6، 9 Ω) ونجمة داخلية مركزها o (9، 6، 3 Ω)، والبطارية 100 V بين a و b']],
 ans:(()=>{const r=ex20();return `نحول النجمة الداخلية إلى دلتا بالمعادلة (3-36): \\(\\Sigma=9\\times6+6\\times3+3\\times9=99\\)، فتصبح \\(R_{ab}'=99/3=33\\)، \\(R_{ac}'=99/6=16.5\\)، \\(R_{bc}'=99/9=11\\ \\Omega\\). كل منها على التوازي مع ضلع الدلتا الخارجية: \\(3\\parallel33=2.75\\)، \\(6\\parallel16.5=4.4\\)، \\(9\\parallel11=4.95\\ \\Omega\\). بين a و b: \\(2.75\\parallel(4.4+4.95)=${fm(r.R,4)}\\ \\Omega\\)، والقدرة \\(P=100^2/${fm(r.R,4)}=${fm(r.P,1)}\\) W.`})(),
 given:[{id:'E',label:'جهد البطارية',sym:'E',unit:'V',value:100},{id:'ab',label:'a–b',sym:'',unit:'Ω',value:3},{id:'ac',label:'a–c',sym:'',unit:'Ω',value:6},{id:'bc',label:'b–c',sym:'',unit:'Ω',value:9},{id:'ao',label:'a–o',sym:'',unit:'Ω',value:9},{id:'bo',label:'b–o',sym:'',unit:'Ω',value:6},{id:'co',label:'c–o',sym:'',unit:'Ω',value:3}],
 solve:(g,B)=>{if(!['ab','ac','bc','ao','bo','co'].every(k=>g[k]>0))return bad('المقاومات يجب أن تكون أكبر من صفر.');const r=ex20(g);return [{t:'نحول النجمة (a–o، b–o، c–o) إلى دلتا بالمعادلة (3-36):',f:`\\Sigma=${fm(g.ao)}\\times${fm(g.bo)}+${fm(g.bo)}\\times${fm(g.co)}+${fm(g.co)}\\times${fm(g.ao)}`,v:r4(r.S),unit:''},
  {t:'كل ضلع = Σ ÷ ذراع النجمة المقابل:',f:`R'_{ab}=\\frac{\\Sigma}{${fm(g.co)}}=${fm(r4(r.dab))},\\ R'_{ac}=\\frac{\\Sigma}{${fm(g.bo)}}=${fm(r4(r.dac))},\\ R'_{bc}=\\frac{\\Sigma}{${fm(g.ao)}}=${fm(r4(r.dbc))}`},
  {t:'كل ضلع جديد على التوازي مع ضلع الدلتا الخارجية بين نفس النقطتين:',f:`${fm(g.ab)}\\parallel${fm(r4(r.dab))}=${fm(r4(r.pab))},\\ ${fm(g.ac)}\\parallel${fm(r4(r.dac))}=${fm(r4(r.pac))},\\ ${fm(g.bc)}\\parallel${fm(r4(r.dbc))}=${fm(r4(r.pbc))}`},
  {t:'بين a و b:',f:`R_{ab}=${fm(r4(r.pab))}\\parallel(${fm(r4(r.pac))}+${fm(r4(r.pbc))})`,v:r4(r.R),unit:'Ω',final:true},{t:'القدرة المغذاة:',f:`P=\\frac{E^2}{R_{ab}}=\\frac{${fm(g.E)}^2}{${fm(r4(r.R))}}`,v:B.round(r.P,1),unit:'W',dp:1,final:true}]},
 asks:()=>[{l:'R<sub>ab</sub>',u:'Ω',v:ex20().R},{l:'P',u:'W',v:ex20().P}]});
X.push({n:'21',ref:'ص 103',q:'من الدائرة الموضحة في شكل رقم (16) أوجد: (أ) قيمة التيار الكلي المار في الدائرة \\(I_T\\) (ب) المقاومة الكلية وأرسم الدائرة المكافئة. (ج) قيمة جهد المصدر E (د) القدرة المستهلكة في الدائرة',figs:[[fx16,'الشكل (16)']],
 ans:'(أ) بقانون كيرشوف للتيار: \\(I_T=1+3+2=6\\) A (وجهد المجموعة \\(12\\times1=4\\times3=6\\times2=12\\) V). (ب) \\(R_T=8+(4\\parallel6)+(12\\parallel4\\parallel6)+3+7=8+2.4+2+3+7=22.4\\ \\Omega\\): الدائرة المكافئة بطارية E مع مقاومة واحدة 22.4 Ω. (ج) \\(E=6\\times22.4=134.4\\) V. (د) \\(P=E\\,I_T=806.4\\) W.',
 given:[{id:'Ia',label:'تيار 12 Ω',sym:'',unit:'A',value:1},{id:'Ib',label:'تيار 4 Ω',sym:'',unit:'A',value:3},{id:'Ic',label:'تيار 6 Ω',sym:'',unit:'A',value:2}],
 solve:(g,B)=>{const IT=r4(g.Ia+g.Ib+g.Ic),RT=22.4;return [{t:'(أ) بقانون كيرشوف للتيار:',f:`I_T=${fm(g.Ia)}+${fm(g.Ib)}+${fm(g.Ic)}`,v:IT,unit:'A',final:true},{t:'(ب)',f:'R_T=8+\\frac{4\\times6}{4+6}+\\frac{1}{\\frac1{12}+\\frac14+\\frac16}+3+7',v:RT,unit:'Ω',final:true},{t:'(ج)',f:`E=I_T\\,R_T=${fm(IT)}\\times22.4`,v:r4(IT*RT),unit:'V',final:true},{t:'(د)',f:'P=E\\,I_T',v:r4(IT*IT*RT),unit:'W',final:true}].concat(Math.abs(g.Ia*12-g.Ib*4)>1e-9||Math.abs(g.Ib*4-g.Ic*6)>1e-9?[{t:'تنبيه: هذه التيارات لا تعطي جهداً واحداً على الفروع المتوازية (12·I = 4·I = 6·I)، فالأرقام غير متسقة.'}]:[])},
 asks:()=>[{l:'I<sub>T</sub>',u:'A',v:6},{l:'R<sub>T</sub>',u:'Ω',v:22.4},{l:'E',u:'V',v:134.4},{l:'P',u:'W',v:806.4}]});
X.push({n:'22',ref:'ص 104',q:'من الدائرة الكهربائية الموضحة في الشكل رقم (17) أوجد: (أ) قيمة جهد المصدر المكافئ (ب) قيمة المقاومة الكلية وأرسم الدائرة المكافئة (ج) التيار الكلى المار في الدائرة \\(I_T\\) (د) القدرة المستهلكة في الدائرة.',figs:[[fx17,'الشكل (17): خمس بطاريات على التوالي — اتجاهات أقطابها غير واضحة في رسم الكتاب، ورسمناها كلها في نفس الاتجاه (افتراض)']],
 ans:'اتجاهات أقطاب البطاريات غير واضحة في الكتاب. <b>بافتراض</b> أنها كلها في اتجاه واحد (تجمع طردياً): (أ) \\(E=20+14+25+11+10=80\\) V. (ب) \\(R_T=6+9+(6\\parallel3)+8+5=6+9+2+8+5=30\\ \\Omega\\). (ج) \\(I_T=80/30=2.667\\) A. (د) \\(P=80\\times2.667=213.3\\) W. إذا كانت بطارية معكوسة فاطرح جهدها بدل جمعه (اكتب الجهد المكافئ في الحاسبة).',
 given:[{id:'E',label:'الجهد المكافئ (افتراض: كلها طردية)',sym:'E',unit:'V',value:80}],
 solve:(g,B)=>{const RT=30;return [{t:'(ب) المقاومة الكلية:',f:'R_T=6+9+\\frac{6\\times3}{6+3}+8+5',v:RT,unit:'Ω',final:true},{t:'(ج)',f:`I_T=\\frac{${fm(g.E)}}{30}`,v:B.round(g.E/RT,3),unit:'A',final:true},{t:'(د)',f:'P=E\\,I_T',v:B.round(g.E*g.E/RT,2),unit:'W',final:true}]},
 asks:()=>[{l:'R<sub>T</sub>',u:'Ω',v:30},{l:'I<sub>T</sub> (بافتراض 80 V)',u:'A',v:80/30}]});
X.push({n:'23',ref:'ص 104',q:'من الدائرة الكهربية الموضحة في الشكل رقم (18)، أوجد: (أ) التيار المار في المقاومة 10Ω (ب) المقاومة الكلية وأرسم الدائرة المكافئة (ج) قيمة جهد المصدر E (د) القدرة المستهلكة في الدائرة',figs:[[fx18,'الشكل (18)']],
 ans:'جهد التوازي \\(5\\times2=2\\times5=10\\) V. (أ) \\(I_1=10/10=1\\) A. (ب) \\(1/R_T=0.1+0.5+0.2=0.8\\) فتكون \\(R_T=1.25\\ \\Omega\\). (ج) \\(E=10\\) V. (د) \\(I_T=1+5+2=8\\) A و \\(P=10\\times8=80\\) W.',
 given:[{id:'I2',label:'تيار 2 Ω',sym:'',unit:'A',value:5},{id:'R2',label:'',sym:'',unit:'Ω',value:2},{id:'R1',label:'',sym:'',unit:'Ω',value:10},{id:'R3',label:'',sym:'',unit:'Ω',value:5}],
 solve:(g,B)=>{const V=r4(g.I2*g.R2),I1=r4(V/g.R1),I3=r4(V/g.R3),RT=r4(1/(1/g.R1+1/g.R2+1/g.R3)),IT=r4(I1+g.I2+I3);return [{t:'جهد التوازي (= E):',f:`V=${fm(g.I2)}\\times${fm(g.R2)}`,v:V,unit:'V',final:true},{t:'(أ)',f:`I_1=\\frac{${fm(V)}}{${fm(g.R1)}}`,v:I1,unit:'A',final:true},{t:'(ب)',f:`R_T=\\frac{1}{\\frac1{${fm(g.R1)}}+\\frac1{${fm(g.R2)}}+\\frac1{${fm(g.R3)}}}`,v:RT,unit:'Ω',final:true},{t:'',f:`I_T=${fm(I1)}+${fm(g.I2)}+${fm(I3)}`,v:IT,unit:'A'},{t:'(د)',f:'P=E\\,I_T',v:r4(V*IT),unit:'W',final:true}]},
 asks:()=>[{l:'I<sub>1</sub>',u:'A',v:1},{l:'R<sub>T</sub>',u:'Ω',v:1.25},{l:'E',u:'V',v:10},{l:'P',u:'W',v:80}]});

const figBlock=x=>(x.figs||[]).map(([f,c])=>`<figure class="fig" style="margin:10px 0">${box(f(),560)}<figcaption class="sub">${c} <span class="ref">${x.ref}</span></figcaption></figure>`).join('');
B.lesson({
 id:'u3-l12',unit:3,order:12,pages:'98–104',
 title:'تمارين الوحدة الثالثة',
 summary:'كل تمارين الوحدة الثالثة بأرقام الكتاب وأشكالها مرسومة من جديد، وتحت كل تمرين إجابة مقترحة، مع حاسبة لكل تمرين حسابي، و«تحقق من إجابتك» في المختبر.',
 stations:[
  {intro:true},

  {st:1,short:'التمارين 1–3',title:'تمارين على الوحدة الثالثة: التمارين <span class="ltr">1–3</span>',ref:'ص 98',
   q:'أول ثلاثة تمارين تراجع ما قبل التوالي والتوازي: الحرارة، وقانون أوم، والكفاءة. هل تتذكر المعادلة المناسبة لكل منها؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="أدوات التمارين من 1 إلى 3" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><text x="180" y="46" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">أدوات التمارين من <tspan direction="ltr" unicode-bidi="embed">1</tspan> إلى <tspan direction="ltr" unicode-bidi="embed">3</tspan></text><g data-tip="المعادلة ⟦(3-14)⟧: تغير المقاومة مع درجة الحرارة (التمرين 1)."><rect x="26" y="64" width="308" height="50" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.2"/><text x="204" y="95" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">T2</tspan> = R<tspan baseline-shift="sub" font-size="75%">T1</tspan>[1+α(T2−T1)]</text><text x="56" y="95" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="rtl"><tspan direction="ltr" unicode-bidi="embed">(3-14)</tspan></text><rect x="26" y="64" width="308" height="50" fill="transparent"/></g><g data-tip="قانون أوم: التيار = الجهد ÷ المقاومة (التمرين 2)."><rect x="26" y="124" width="308" height="50" rx="10" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2.2"/><text x="204" y="155" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700">I = V / R</text><text x="56" y="155" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="rtl">قانون أوم</text><rect x="26" y="124" width="308" height="50" fill="transparent"/></g><g data-tip="المعادلة ⟦(3-21)⟧: القدرة الداخلة = الجهد × التيار (التمرين 3)."><rect x="26" y="184" width="308" height="50" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.2"/><text x="204" y="215" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700">P<tspan baseline-shift="sub" font-size="75%">i</tspan> = E × I</text><text x="56" y="215" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="rtl"><tspan direction="ltr" unicode-bidi="embed">(3-21)</tspan></text><rect x="26" y="184" width="308" height="50" fill="transparent"/></g><g data-tip="المعادلة ⟦(3-20)⟧: الكفاءة = القدرة الخارجة ÷ القدرة الداخلة (التمرين 3)."><rect x="26" y="244" width="308" height="50" rx="10" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.2"/><text x="204" y="275" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700">η = P<tspan baseline-shift="sub" font-size="75%">o</tspan> / P<tspan baseline-shift="sub" font-size="75%">i</tspan></text><text x="56" y="275" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="rtl"><tspan direction="ltr" unicode-bidi="embed">(3-20)</tspan></text><rect x="26" y="244" width="308" height="50" fill="transparent"/></g></svg>`,
   cap:'المعادلات التي تحتاجها في التمارين الثلاثة الأولى.<br><b>مرّر المؤشر على أي بطاقة (أو المسها في الجوال) لتعرف لأي تمرين هي.</b>',
   side:[
    {predict:{q:'التمرين 2: مقاومة 4 Ω جهدها 20 V. كم التيار المار فيها؟',opts:[
     ['80 A',false,String.raw`هذا حاصل الضرب؛ قانون أوم \(I=V/R\).`],
     ['5 A',true,String.raw`\(I=V/R=20/4=5\ \text{A}\).`],
     ['0.2 A',false,String.raw`هذا \(R/V\)؛ الجهد في البسط.`]]}}
   ],
   body:[
    {book:String.raw`<ol><li>موصل مقاومته 28 Ω تزداد مقاومته بمقدار 12 % عندما تزداد درجة حرارته من 18 إلى 20°C، احسب متوسط ارتفاع درجة حرارة الموصل عند درجة حرارة محيطه تبلغ 20°C عندما تكون مقاومته 35Ω ويكون معامل درجة الحرارة ثابتاً.</li>
     <li>احسب التيار المار في المقاومة 4 Ω إذا كان فرق الجهد بين طرفيها 20 V.</li>
     <li>احسب كفاءة المحرك الكهربائي إذا كانت القدرة الخارجة منه 850 W وكان التيار المغذي له 8A عند 120 V.</li></ol>`,ref:'ص 98'},
    {tip:String.raw`<p>الكتاب لا يعطي إجابات للتمارين. حاول بنفسك أولاً، ثم افتح الإجابة المقترحة، أو تحقق من إجابتك في تبويب «المختبر». <span class="fixnote">ترقيم الكتاب فيه قفزات (لا يوجد 15 ولا 18 ولا 19، و«16» مكرر) — احتفظنا بأرقام الكتاب.</span></p>`},
    {tip:(()=>X.filter(x=>['1','2','3'].includes(x.n)).map(x=>`<details class="cb-q"><summary>تمرين ${x.n}</summary><div class="cb-ans">${x.ans}</div></details>`).join('')+`<div class="w-row"><button class="btn pri" type="button" onclick="var b=document.querySelector('.ltabs button[data-tab=examples]');if(b)b.click()">افتح الحاسبات في «الأمثلة المحلولة»</button></div>`)(),title:'الإجابات المقترحة (ليست من الكتاب)'},
    {watch:String.raw`<p>التمرين 1: زيادة 12% بين 18°C و 20°C فقط غير واقعية لمعدن (تعطي معاملاً حرارياً 0.06 لكل درجة)؛ الأرجح خطأ في الدرجة الثانية. الإجابة المقترحة بالأرقام المطبوعة.</p>`,fix:true}
   ]},

  {st:2,short:'التمارين 4–8: التوالي',title:'التمارين <span class="ltr">4–8</span>: دوائر التوالي',ref:'ص 98–99',
   q:'كل الدوائر هنا حلقة واحدة. ما الذي يجمعها كلها؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="أدوات تمارين التوالي (من 4 إلى 8)" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><text x="180" y="46" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">أدوات تمارين التوالي (من <tspan direction="ltr" unicode-bidi="embed">4</tspan> إلى <tspan direction="ltr" unicode-bidi="embed">8)</tspan></text><g data-tip="المعادلة ⟦(3-23)⟧: المقاومة الكلية في التوالي = مجموع المقاومات."><rect x="26" y="64" width="308" height="50" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.2"/><text x="204" y="95" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">T</tspan> = R<tspan baseline-shift="sub" font-size="75%">1</tspan> + R<tspan baseline-shift="sub" font-size="75%">2</tspan> + … + R<tspan baseline-shift="sub" font-size="75%">N</tspan></text><text x="56" y="95" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="rtl"><tspan direction="ltr" unicode-bidi="embed">(3-23)</tspan></text><rect x="26" y="64" width="308" height="50" fill="transparent"/></g><g data-tip="المعادلة ⟦(3-24)⟧: تيار دائرة التوالي، وهو نفسه في كل العناصر."><rect x="26" y="124" width="308" height="50" rx="10" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2.2"/><text x="204" y="155" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700">I = E / R<tspan baseline-shift="sub" font-size="75%">T</tspan></text><text x="56" y="155" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="rtl"><tspan direction="ltr" unicode-bidi="embed">(3-24)</tspan></text><rect x="26" y="124" width="308" height="50" fill="transparent"/></g><g data-tip="المعادلة ⟦(3-25)⟧: جهد كل مقاومة = التيار × مقاومتها."><rect x="26" y="184" width="308" height="50" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.2"/><text x="204" y="215" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700">V<tspan baseline-shift="sub" font-size="75%">1</tspan> = I R<tspan baseline-shift="sub" font-size="75%">1</tspan> , V<tspan baseline-shift="sub" font-size="75%">2</tspan> = I R<tspan baseline-shift="sub" font-size="75%">2</tspan> …</text><text x="56" y="215" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="rtl"><tspan direction="ltr" unicode-bidi="embed">(3-25)</tspan></text><rect x="26" y="184" width="308" height="50" fill="transparent"/></g><g data-tip="المعادلة ⟦(3-17)⟧: القدرة بثلاث صيغ؛ اختر حسب المعلوم (التمرينان 6 و 8)."><rect x="26" y="244" width="308" height="50" rx="10" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.2"/><text x="204" y="275" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700">P = V I = I²R = V²/R</text><text x="56" y="275" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="rtl"><tspan direction="ltr" unicode-bidi="embed">(3-17)</tspan></text><rect x="26" y="244" width="308" height="50" fill="transparent"/></g></svg>`,
   cap:'معادلات التوالي التي تحتاجها في التمارين <span class="ltr">4–8</span>.<br><b>مرّر المؤشر على أي بطاقة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:String.raw`التمرين 4 (ب): المقاومة 2.2 kΩ طرفها الآخر مفتوح. هل تدخل في حساب \(R_T\)؟`,opts:[
     ['نعم، تُجمع مع البقية',false,'لا يمر فيها تيار لأن طرفها مفتوح، فلا تؤثر في التيار.'],
     ['لا، لأنه لا يمر فيها تيار',true,String.raw`طرفها مفتوح (دائرة مفتوحة)، فـ\(R_T=1.2+4.5+3+1.3=10\ \text{k}\Omega\).`],
     ['تدخل على التوازي',false,'التوازي يحتاج أن يتصل طرفاها بنقطتين في الدائرة؛ أحد طرفيها غير متصل بشيء.']]}}
   ],
   body:[
    {book:String.raw`<ol start="4"><li>احسب المقاومة الكلية والتيار الكلي من الدوائر الكهربائية التالية والموضحة في الشكل (1).</li>
     <li>إذا علمت المقاومة الكلية للدوائر الموضحة في الشكل (2)، احسب المقاومات المجهولة وكذلك التيار I لكل من هذه الدوائر.</li>
     <li>للدوائر الكهربائية الموضحة في الشكل (3) احسب: (أ) المقاومة الكلية والتيار وفرق الجهد عبر كل مقاومة. (ب) القدرة المفقودة في كل مقاومة وكذلك قدرة البطارية وأثبت أن القدرة المفقودة في المقاومات تساوي قدرة المنبع (البطارية).</li>
     <li>احسب المقاومة R وجهد البطارية E للدائرة الموضحة في الشكل (4).</li>
     <li>احسب للدائرة الموضحة في الشكل (5) المقاومة R و فرق الجهد عبر كل مقاومة.</li></ol>`,ref:'ص 98–99'},
    {html:`<div class="cb-figs">${[[fx1a,'الشكل (1) أ'],[fx1b,'الشكل (1) ب'],[fx2r,'الشكل (2) — الرسم الأيمن'],[fx2l,'الشكل (2) — الرسم الأيسر'],[fx3a,'الشكل (3) A'],[fx3b,'الشكل (3) B'],[fx4,'الشكل (4)'],[fx5,'الشكل (5)']].map(([f,c])=>`<figure>${box(f(),420)}<figcaption>${c}</figcaption></figure>`).join('')}</div>`},
    {tip:String.raw`<p>في حلقة واحدة: <b>التيار واحد في كل العناصر</b>. لذلك إذا عرفت جهد مقاومة واحدة وقيمتها (التمرين 7: 16 V على 2 kΩ) أو قدرتها (التمرين 8: 144 mW على 4 kΩ) عرفت تيار الحلقة كلها. وانتبه للوحدات: kΩ و MΩ و mA.</p>`},
    {tip:(()=>X.filter(x=>['4 (أ)','4 (ب)','5 (الرسم الأيمن)','5 (الرسم الأيسر)','6 (A)','6 (B)','7','8'].includes(x.n)).map(x=>`<details class="cb-q"><summary>تمرين ${x.n}</summary><div class="cb-ans">${x.ans}</div></details>`).join('')+`<div class="w-row"><button class="btn pri" type="button" onclick="var b=document.querySelector('.ltabs button[data-tab=examples]');if(b)b.click()">افتح الحاسبات في «الأمثلة المحلولة»</button></div>`)(),title:'الإجابات المقترحة (ليست من الكتاب)'},
    {watch:String.raw`<p>التمرين 6 (B): قيمة \(R_2\) غير مكتوبة في الشكل، فلا يمكن الحل العددي إلا بقيمة نفترضها. والتمرين 5: تحت الرسمين حرف «(أ)» فقط، و«0.56KΩ» في الرسم الأيسر صغيرة جداً مقارنة بغيرها (ربما المقصود 0.56 MΩ).</p>`}
   ]},

  {st:3,short:'التمارين 9–13: التوازي',title:'التمارين <span class="ltr">9–13</span>: دوائر التوازي',ref:'ص 100–101',
   q:'في التوازي الجهد واحد على كل الفروع. كيف يساعدك هذا في كل تمرين؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="أدوات تمارين التوازي (من 9 إلى 13)" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><text x="180" y="46" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">أدوات تمارين التوازي (من <tspan direction="ltr" unicode-bidi="embed">9</tspan> إلى <tspan direction="ltr" unicode-bidi="embed">13)</tspan></text><g data-tip="المعادلة ⟦(3-30)⟧: مقلوب المقاومة الكلية = مجموع المقلوبات."><rect x="26" y="64" width="308" height="50" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.2"/><text x="204" y="95" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700">1/R<tspan baseline-shift="sub" font-size="75%">T</tspan> = 1/R<tspan baseline-shift="sub" font-size="75%">1</tspan> + … + 1/R<tspan baseline-shift="sub" font-size="75%">N</tspan></text><text x="56" y="95" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="rtl"><tspan direction="ltr" unicode-bidi="embed">(3-30)</tspan></text><rect x="26" y="64" width="308" height="50" fill="transparent"/></g><g data-tip="المعادلة ⟦(3-31)⟧: لمقاومتين فقط."><rect x="26" y="124" width="308" height="50" rx="10" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2.2"/><text x="204" y="155" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">T</tspan> = R<tspan baseline-shift="sub" font-size="75%">1R_2</tspan> / (R<tspan baseline-shift="sub" font-size="75%">1</tspan>+R<tspan baseline-shift="sub" font-size="75%">2</tspan>)</text><text x="56" y="155" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="rtl"><tspan direction="ltr" unicode-bidi="embed">(3-31)</tspan></text><rect x="26" y="124" width="308" height="50" fill="transparent"/></g><g data-tip="لعدد ⟦N⟧ من المقاومات المتساوية (ص 73، بلا رقم في الكتاب) — التمرين 9 (A)."><rect x="26" y="184" width="308" height="50" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.2"/><text x="204" y="215" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">T</tspan> = R / N</text><text x="56" y="215" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="rtl">متساوية</text><rect x="26" y="184" width="308" height="50" fill="transparent"/></g><g data-tip="المعادلة ⟦(3-33)⟧: قاعدة توزيع التيار (التمرين 12)."><rect x="26" y="244" width="308" height="50" rx="10" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.2"/><text x="204" y="275" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700">I<tspan baseline-shift="sub" font-size="75%">x</tspan> = (R<tspan baseline-shift="sub" font-size="75%">T</tspan> / R<tspan baseline-shift="sub" font-size="75%">x</tspan>) I</text><text x="56" y="275" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="rtl"><tspan direction="ltr" unicode-bidi="embed">(3-33)</tspan></text><rect x="26" y="244" width="308" height="50" fill="transparent"/></g></svg>`,
   cap:'معادلات التوازي التي تحتاجها في التمارين <span class="ltr">9–13</span>.<br><b>مرّر المؤشر على أي بطاقة (أو المسها في الجوال) لتعرف معناها.</b>',
   side:[
    {predict:{q:String.raw`التمرين 9 (A): ثلاث مقاومات كل منها 12 Ω على التوازي. كم \(R_T\)؟`,opts:[
     ['36 Ω',false,'هذا جمعها كأنها على التوالي.'],
     ['6 Ω',false,'هذا ناتج مقاومتين فقط (12/2).'],
     ['4 Ω',true,String.raw`متساوية: \(R_T=R/N=12/3=4\ \Omega\).`]]}}
   ],
   body:[
    {book:String.raw`<ol start="9"><li>احسب المقاومة الكلية للدوائر الموضحة في شكل(6).</li>
     <li>احسب المقاومات المجهولة للدوائر الموضحة في الشكل (7).</li>
     <li>احسب المقاومة الكلية والتيار \(I_S\) وكذلك التيارات في كل فرع بالإضافة إلى القدرة المفقودة في كل مقاومة وذلك للدوائر الموضحة في الشكل (8).</li>
     <li>احسب المقاومة الكلية للدائرة المبينة في الشكل (9) واحسب كذلك التيارات المارة في كل مقاومة.</li>
     <li>احسب الكميات المجهولة في الدائرة الموضحة في الشكل (10).</li></ol>`,ref:'ص 100–101'},
    {html:`<div class="cb-figs">${[[fx6a,'الشكل (6) A'],[F319,'الشكل (6) B'],[fx7a,'الشكل (7) A'],[fx7b,'الشكل (7) B'],[fx8a,'الشكل (8) A'],[fx8b,'الشكل (8) B'],[fx9,'الشكل (9)'],[fx10,'الشكل (10)']].map(([f,c])=>`<figure>${box(f(),420)}<figcaption>${c}</figcaption></figure>`).join('')}</div>`},
    {tip:String.raw`<p>التمرين 9 (B) هو مثال (3-18) نفسه. والتمرين 10 مثل مثال (3-24): اكتب (3-30) وضع المجهول وحده في طرف. وفي التمرين 12 لاحظ أن المقاومة الصغيرة (1 Ω) تأخذ معظم التيار، والكبيرة جداً (100 kΩ) تكاد لا تأخذ شيئاً.</p>`},
    {tip:(()=>X.filter(x=>['9','10','11 (A)','11 (B)','12','13'].includes(x.n)).map(x=>`<details class="cb-q"><summary>تمرين ${x.n}</summary><div class="cb-ans">${x.ans}</div></details>`).join('')+`<div class="w-row"><button class="btn pri" type="button" onclick="var b=document.querySelector('.ltabs button[data-tab=examples]');if(b)b.click()">افتح الحاسبات في «الأمثلة المحلولة»</button></div>`)(),title:'الإجابات المقترحة (ليست من الكتاب)'}
   ]},

  {st:4,short:'التمرين 14: مفتوحة وقصر',title:'التمرين <span class="ltr">14</span>: الدائرة المفتوحة ودائرة القصر',ref:'ص 101',
   q:'دائرة واحدة في ثلاث حالات: مفتوحة، ثم قصر على مقاومة، ثم قصر على الطرفين. ماذا يتغير في كل حالة؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="بطارية 9 فولت ثم 2.2 كيلو أوم ثم 47 كيلو أوم إلى الخط السفلي و 3.3 كيلو أوم إلى طرف مفتوح" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><path d="M50 90 L50 155" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M50 165 L50 230" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M34 155H66" stroke="#2C4A40" stroke-width="3"/><path d="M41 165H59" stroke="#2C4A40" stroke-width="6"/><text x="74" y="151" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">+</text><text x="36" y="166" text-anchor="end" font-size="12" fill="#2C4A40" font-weight="700">9 V</text><path d="M50 90 L70 90" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><g data-tip="المقاومة ⟦2.2 kΩ⟧: في الجزء (ب) يحدث قصر بين طرفيها."><path d="M70 90 L83 90 L86.7 97 L94 83 L101.3 97 L108.7 83 L116 97 L123.3 83 L127 90 L140 90" fill="none" stroke="#E8735A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><text x="105" y="74" text-anchor="middle" font-size="12" fill="#E8735A" font-weight="700">2.2 kΩ</text><rect x="64" y="60" width="82" height="44" fill="transparent"/></g><path d="M140 90 L180 90" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="180" cy="90" r="4" fill="#2C4A40"/><circle cx="180" cy="230" r="4" fill="#2C4A40"/><path d="M180 90 L180 138 L173 141.7 L187 149 L173 156.3 L187 163.7 L173 171 L187 178.3 L180 182 L180 230" fill="none" stroke="#2C4A40" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><text x="192" y="166" text-anchor="start" font-size="12" fill="#2C4A40" font-weight="700">47 kΩ</text><g data-tip="المقاومة ⟦3.3 kΩ⟧: طرفها مفتوح، فلا يمر فيها تيار في (أ) و(ب). في (ج) يصير القصر بين الطرفين فيمر فيها تيار القصر."><path d="M180 90 L198 90 L201.7 97 L209 83 L216.3 97 L223.7 83 L231 97 L238.3 83 L242 90 L260 90" fill="none" stroke="#4FB3A9" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><text x="220" y="74" text-anchor="middle" font-size="12" fill="#4FB3A9" font-weight="700">3.3 kΩ</text><rect x="176" y="60" width="88" height="44" fill="transparent"/></g><path d="M260 90 L285 90" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="290" cy="90" r="5.5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><path d="M50 230 L285 230" fill="none" stroke="#2C4A40" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="290" cy="230" r="5.5" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.5"/><g data-tip="⟦VL⟧: الجهد بين الطرفين المفتوحين. في (ج) يوصل الطرفان بسلك (قصر)."><text x="300" y="114" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">+</text><text x="300" y="218" text-anchor="middle" font-size="16" fill="#2C4A40" font-weight="700">−</text><text x="306" y="166" text-anchor="start" font-size="14" fill="#3B7DD8" font-weight="700">V<tspan baseline-shift="sub" font-size="75%">L</tspan></text><rect x="292" y="98" width="50" height="124" fill="transparent"/></g><text x="180" y="52" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">الشكل <tspan direction="ltr" unicode-bidi="embed">(11)</tspan> في التمرين <tspan direction="ltr" unicode-bidi="embed">14</tspan></text><text x="180" y="272" text-anchor="middle" font-size="12.5" fill="#2C4A40" font-weight="700" direction="rtl">مفتوحة ← قصر <tspan direction="ltr" unicode-bidi="embed">2.2 kΩ</tspan> ← قصر الطرفين</text></svg>`,
   cap:'الشكل <span class="ltr">(11)</span> من التمارين مرسوماً من جديد.<br><b>مرّر المؤشر على المقاومتين الملونتين والطرفين (أو المسها في الجوال) لتعرف دورها في كل جزء.</b>',
   side:[
    {predict:{q:'في الجزء (أ) والطرفان مفتوحان: هل يمر تيار في المقاومة 3.3 kΩ؟',opts:[
     ['نعم، نفس تيار 47 kΩ',false,'المقاومة 3.3 kΩ تنتهي بطرف مفتوح، فلا مسار يكمل الدائرة.'],
     [String.raw`لا، فلا هبوط عليها و\(V_L\) = جهد المقاومة 47 kΩ`,true,'كما في مثال (3-28): المقاومة المنتهية بطرف مفتوح لا يمر فيها تيار.'],
     ['نعم، تيار كبير جداً',false,'التيار الكبير يكون عند القصر، لا في الدائرة المفتوحة.']]}}
   ],
   body:[
    {book:String.raw`<ol start="14"><li>للدائرة الموضحة في الشكل (11) احسب:<br>أ- فرق الجهد \(V_L\) بين طرفي الدائرة المفتوحة.<br>ب- إذا تم عمل قصر بين طرفي المقاومة 2.2 KΩ احسب قيمة \(V_L\).<br>ج- إذا تم عمل قصر بين طرفي \(V_L\) احسب تيار القصر في هذه الحالة.</li></ol>`,ref:'ص 101'},
    {tip:String.raw`<p>هذا التمرين يشبه مثال (3-28): (أ) مثل الحالة قبل القصر — التيار يمر في 2.2 kΩ و 47 kΩ فقط. (ب) القصر على 2.2 kΩ يجعل جهدها صفراً فيظهر جهد البطارية كله على 47 kΩ. (ج) القصر على الطرفين يجعل 3.3 kΩ على التوازي مع 47 kΩ، وتيارها هو تيار القصر.</p>`},
    {tip:(()=>X.filter(x=>['14'].includes(x.n)).map(x=>`<details class="cb-q"><summary>تمرين ${x.n}</summary><div class="cb-ans">${x.ans}</div></details>`).join('')+`<div class="w-row"><button class="btn pri" type="button" onclick="var b=document.querySelector('.ltabs button[data-tab=examples]');if(b)b.click()">افتح الحاسبات في «الأمثلة المحلولة»</button></div>`)(),title:'الإجابات المقترحة (ليست من الكتاب)'}
   ]},

  {st:5,short:'«16» و16 و17: مركب',title:'التمارين <span class="ltr">«16»</span> و<span class="ltr">16</span> و<span class="ltr">17</span>: التوصيل المركب',ref:'ص 102',
   q:'دوائر فيها توالي وتوازي معاً، بعضها سلّمية. من أي طرف تبدأ الاختزال؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="أدوات التوصيل المركب" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#DDEFE6"/><text x="180" y="46" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">أدوات التوصيل المركب</text><g data-tip="التوصيل المركب: مجموع مقاومات التوالي + مكافئ مقاومات التوازي."><rect x="26" y="64" width="308" height="50" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.2"/><text x="204" y="95" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">T</tspan> = R<tspan baseline-shift="sub" font-size="75%">S</tspan> + R<tspan baseline-shift="sub" font-size="75%">P</tspan></text><text x="56" y="95" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="rtl">ص <tspan direction="ltr" unicode-bidi="embed">87</tspan></text><rect x="26" y="64" width="308" height="50" fill="transparent"/></g><g data-tip="المعادلة ⟦(3-31)⟧: لاختزال كل مقاومتين على التوازي."><rect x="26" y="124" width="308" height="50" rx="10" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2.2"/><text x="204" y="155" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">T</tspan> = R<tspan baseline-shift="sub" font-size="75%">1R_2</tspan> / (R<tspan baseline-shift="sub" font-size="75%">1</tspan>+R<tspan baseline-shift="sub" font-size="75%">2</tspan>)</text><text x="56" y="155" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="rtl"><tspan direction="ltr" unicode-bidi="embed">(3-31)</tspan></text><rect x="26" y="124" width="308" height="50" fill="transparent"/></g><g data-tip="المعادلة ⟦(3-34)⟧: للرجوع من التيار الكلي إلى تيارات الفروع."><rect x="26" y="184" width="308" height="50" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.2"/><text x="204" y="215" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700">I<tspan baseline-shift="sub" font-size="75%">1</tspan> = I R<tspan baseline-shift="sub" font-size="75%">2</tspan> / (R<tspan baseline-shift="sub" font-size="75%">1</tspan>+R<tspan baseline-shift="sub" font-size="75%">2</tspan>)</text><text x="56" y="215" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="rtl"><tspan direction="ltr" unicode-bidi="embed">(3-34)</tspan></text><rect x="26" y="184" width="308" height="50" fill="transparent"/></g><g data-tip="قانون كيرشوف للتيار عند كل عقدة (ص 79)."><rect x="26" y="244" width="308" height="50" rx="10" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.2"/><text x="204" y="275" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700">Σ I<tspan baseline-shift="sub" font-size="75%">in</tspan> = Σ I<tspan baseline-shift="sub" font-size="75%">out</tspan></text><text x="56" y="275" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="rtl">كيرشوف</text><rect x="26" y="244" width="308" height="50" fill="transparent"/></g></svg>`,
   cap:'الأدوات التي تحتاجها لاختزال الدوائر المركبة ثم الرجوع إلى تياراتها.<br><b>مرّر المؤشر على أي بطاقة (أو المسها في الجوال) لتعرف متى تستعملها.</b>',
   side:[
    {predict:{q:String.raw`التمرين «16» الأول: 12 Ω و 6 Ω على التوازي، ثم 12 Ω على التوالي معهما. كم \(R_T\)؟`,opts:[
     ['30 Ω',false,'هذا جمع الثلاث كأنها على التوالي.'],
     ['16 Ω',true,String.raw`\(12\parallel6=\frac{12\times6}{18}=4\ \Omega\)، ثم \(4+12=16\ \Omega\).`],
     ['4 Ω',false,'هذا مكافئ التوازي فقط؛ بقيت المقاومة التي على التوالي.']]}}
   ],
   body:[
    {book:String.raw`<ol><li value="16">احسب الكميات المجهولة في الدائرة الموضحة في الشكل (12).</li>
     <li value="16">احسب الكميات المجهولة في الدائرة الموضحة في الشكل (13).</li>
     <li value="17">من الدائرة الممثلة في الشكل (14) احسب التيار الكلي I وكذلك التيارات \(I_1\)، \(I_2\)، \(I_3\).</li></ol>`,ref:'ص 102'},
    {html:`<div class="cb-figs">${[[fx12,'الشكل (12)'],[fx13,'الشكل (13)'],[fx14,'الشكل (14)']].map(([f,c])=>`<figure>${box(f(),420)}<figcaption>${c}</figcaption></figure>`).join('')}</div>`},
    {tip:String.raw`<p>في الدائرة السلّمية (الشكل 13) ابدأ من <b>أبعد نقطة عن البطارية</b>: اجمع آخر مقاومتين على التوالي، ثم الناتج على التوازي مع التي قبلها، وهكذا حتى تصل إلى البطارية. ثم ارجع في الاتجاه المعاكس لتحسب التيارات والجهود.</p>`},
    {tip:(()=>X.filter(x=>['«16» (الأول)','16','17'].includes(x.n)).map(x=>`<details class="cb-q"><summary>تمرين ${x.n}</summary><div class="cb-ans">${x.ans}</div></details>`).join('')+`<div class="w-row"><button class="btn pri" type="button" onclick="var b=document.querySelector('.ltabs button[data-tab=examples]');if(b)b.click()">افتح الحاسبات في «الأمثلة المحلولة»</button></div>`)(),title:'الإجابات المقترحة (ليست من الكتاب)'},
    {watch:String.raw`<p>التمرين الذي بعد 14 مرقم في الكتاب «16» والمفترض 15، وبعده 16 مرة أخرى؛ وبعد 17 يأتي 20.</p>`,fix:true}
   ]},

  {st:6,short:'التمرين 20: دلتا ونجمة',title:'التمرين <span class="ltr">20</span>: شبكة دلتا ونجمة',ref:'ص 103',
   q:'مثلث خارجي ونجمة داخلية في شبكة واحدة: كيف تجعلها توالي وتوازي؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="مثلث دلتا 3 و 6 و 9 أوم وبداخله نجمة 9 و 6 و 3 أوم، والبطارية 100 فولت بين a و b" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#F7DCC8"/><g data-tip="الدلتا الخارجية ⟦abc⟧: ⟦a–b = 3 Ω⟧، ⟦a–c = 6 Ω⟧، ⟦b–c = 9 Ω⟧."><path d="M180 70 L132.7 137 L125.2 135.6 L133 148.8 L117.9 145.8 L125.7 159 L110.7 156.1 L118.5 169.3 L103.4 166.4 L107.3 173 L60 240" fill="none" stroke="#E8735A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M180 70 L227.3 137 L223.4 143.6 L238.5 140.7 L230.7 153.9 L245.7 151 L237.9 164.2 L253 161.2 L245.2 174.4 L252.7 173 L300 240" fill="none" stroke="#E8735A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M60 240 L158 240 L161.1 247 L167.4 233 L173.7 247 L180 233 L186.3 247 L192.6 233 L198.9 247 L202 240 L300 240" fill="none" stroke="#E8735A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><rect x="60" y="70" width="240" height="180" fill="transparent"/></g><g data-tip="النجمة الداخلية مركزها ⟦o⟧: ⟦a–o = 9 Ω⟧، ⟦b–o = 6 Ω⟧، ⟦c–o = 3 Ω⟧."><path d="M180 70 L180 103 L173 106.7 L187 114 L173 121.3 L187 128.7 L173 136 L187 143.3 L180 147 L180 180" fill="none" stroke="#4FB3A9" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M60 240 L100.3 219.8 L106.7 224.5 L107 208.7 L119.9 217.9 L120.1 202.1 L133 211.3 L133.3 195.5 L139.7 200.2 L180 180" fill="none" stroke="#4FB3A9" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M300 240 L259.7 219.8 L259.5 211.9 L246.7 221.2 L246.4 205.4 L233.6 214.6 L233.3 198.8 L220.5 208.1 L220.3 200.2 L180 180" fill="none" stroke="#4FB3A9" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><rect x="100" y="100" width="160" height="130" fill="transparent"/></g><text x="108" y="150" text-anchor="end" font-size="12.5" fill="#E8735A" font-weight="700">3Ω</text><text x="252" y="150" text-anchor="start" font-size="12.5" fill="#E8735A" font-weight="700">6Ω</text><text x="180" y="266" text-anchor="middle" font-size="12.5" fill="#E8735A" font-weight="700">9Ω</text><text x="190" y="126" text-anchor="start" font-size="12" fill="#4FB3A9" font-weight="700">9Ω</text><text x="118" y="202" text-anchor="end" font-size="12" fill="#4FB3A9" font-weight="700">6Ω</text><text x="242" y="202" text-anchor="start" font-size="12" fill="#4FB3A9" font-weight="700">3Ω</text><circle cx="180" cy="70" r="5" fill="#2C4A40"/><text x="180" y="60" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">a</text><circle cx="60" cy="240" r="5" fill="#2C4A40"/><text x="50" y="254" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">b</text><circle cx="300" cy="240" r="5" fill="#2C4A40"/><text x="310" y="254" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">c</text><circle cx="180" cy="180" r="5" fill="#2C4A40"/><text x="180" y="202" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700">o</text><g data-tip="البطارية ⟦100 V⟧ بين العقدتين ⟦a⟧ و⟦b⟧."><text x="70" y="120" text-anchor="middle" font-size="13" fill="#3B7DD8" font-weight="700">100V</text><path d="M76 130L103.1 110.4" stroke="#3B7DD8" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M112 104L106.3 114.9L99.9 106Z" fill="#3B7DD8"/><rect x="40" y="100" width="80" height="36" fill="transparent"/></g><text x="180" y="40" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">الشكل <tspan direction="ltr" unicode-bidi="embed">(15)</tspan> في التمرين <tspan direction="ltr" unicode-bidi="embed">20</tspan></text></svg>`,
   cap:'الشكل <span class="ltr">(15)</span> من التمارين: الدلتا بالبرتقالي والنجمة بالأخضر.<br><b>مرّر المؤشر على المثلث والنجمة والبطارية (أو المسها في الجوال) لتعرف قيمها.</b>',
   side:[
    {predict:{q:'ما الفكرة التي تجعل هذه الشبكة سهلة الحل؟',opts:[
     ['جمع المقاومات الست على التوالي',false,'ليست كلها في مسار واحد.'],
     ['تحويل النجمة الداخلية إلى دلتا',true,'بعد التحويل يصبح كل ضلع من الدلتا الجديدة على التوازي مع ضلع الدلتا الأصلية بين نفس الطرفين.'],
     ['حذف النجمة لأنها في الداخل',false,'لا يجوز حذف مقاومات يمر فيها تيار.']]}}
   ],
   body:[
    {book:String.raw`<ol start="20"><li>احسب القدرة المغذاة إلى الشبكة الشكل (15).</li></ol>`,ref:'ص 103'},
    {tip:String.raw`<p>حوّل النجمة (9 و 6 و 3 Ω) إلى دلتا بالمعادلة (3-36)، فيصير بين كل طرفين ضلعان على التوازي (ضلع أصلي وضلع جديد). اجمع كل زوج، ثم احسب المقاومة بين a و b، ثم القدرة \(P=V^2/R\).</p>`},
    {tip:(()=>X.filter(x=>['20'].includes(x.n)).map(x=>`<details class="cb-q"><summary>تمرين ${x.n}</summary><div class="cb-ans">${x.ans}</div></details>`).join('')+`<div class="w-row"><button class="btn pri" type="button" onclick="var b=document.querySelector('.ltabs button[data-tab=examples]');if(b)b.click()">افتح الحاسبات في «الأمثلة المحلولة»</button></div>`)(),title:'الإجابات المقترحة (ليست من الكتاب)'}
   ]},

  {st:7,short:'التمارين 21–23',title:'التمارين <span class="ltr">21–23</span>: التيار والمقاومة والجهد والقدرة',ref:'ص 103–104',
   q:'في هذه التمارين معطاة تيارات بعض الفروع بدل جهد المصدر. كيف تبدأ؟',
   art:String.raw`<svg viewBox="0 0 360 320" role="img" aria-label="ماذا تطلب التمارين من 21 إلى 23؟" style="font-family:var(--font)" xmlns="http://www.w3.org/2000/svg"><circle cx="180" cy="160" r="140" fill="#FBE6C4"/><text x="180" y="46" text-anchor="middle" font-size="14" fill="#2C4A40" font-weight="700" direction="rtl">ماذا تطلب التمارين من <tspan direction="ltr" unicode-bidi="embed">21</tspan> إلى <tspan direction="ltr" unicode-bidi="embed">23</tspan>؟</text><g data-tip="التيار الكلي: من قانون كيرشوف للتيار عند مجموعة التوازي التي تياراتها معلومة."><rect x="26" y="64" width="308" height="50" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.2"/><text x="204" y="95" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700">I<tspan baseline-shift="sub" font-size="75%">T</tspan></text><text x="56" y="95" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="rtl">(أ)</text><rect x="26" y="64" width="308" height="50" fill="transparent"/></g><g data-tip="المقاومة الكلية، ثم ارسم الدائرة المكافئة: مصدر واحد ومقاومة واحدة."><rect x="26" y="124" width="308" height="50" rx="10" fill="#CFE6DB" stroke="#2C4A40" stroke-width="2.2"/><text x="204" y="155" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700">R<tspan baseline-shift="sub" font-size="75%">T</tspan></text><text x="56" y="155" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="rtl">(ب)</text><rect x="26" y="124" width="308" height="50" fill="transparent"/></g><g data-tip="جهد المصدر من قانون أوم للدائرة كلها."><rect x="26" y="184" width="308" height="50" rx="10" fill="#FBF6EE" stroke="#2C4A40" stroke-width="2.2"/><text x="204" y="215" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700">E = I<tspan baseline-shift="sub" font-size="75%">T</tspan> × R<tspan baseline-shift="sub" font-size="75%">T</tspan></text><text x="56" y="215" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="rtl">(ج)</text><rect x="26" y="184" width="308" height="50" fill="transparent"/></g><g data-tip="المعادلة ⟦(3-18)⟧: القدرة المستهلكة في الدائرة = قدرة المصدر."><rect x="26" y="244" width="308" height="50" rx="10" fill="#F2C14E" stroke="#2C4A40" stroke-width="2.2"/><text x="204" y="275" text-anchor="middle" font-size="13.5" fill="#2C4A40" font-weight="700">P = E × I<tspan baseline-shift="sub" font-size="75%">T</tspan></text><text x="56" y="275" text-anchor="middle" font-size="11.5" fill="#2C4A40" font-weight="700" direction="rtl"><tspan direction="ltr" unicode-bidi="embed">(3-18)</tspan></text><rect x="26" y="244" width="308" height="50" fill="transparent"/></g></svg>`,
   cap:'الأجزاء الأربعة التي تتكرر في التمارين <span class="ltr">21–23</span>.<br><b>مرّر المؤشر على أي بطاقة (أو المسها في الجوال) لتعرف طريقتها.</b>',
   side:[
    {predict:{q:String.raw`التمرين 21: ثلاث مقاومات على التوازي تياراتها 1 A و 3 A و 2 A. كم \(I_T\)؟`,opts:[
     ['6 A',true,String.raw`بقانون كيرشوف للتيار: \(I_T=1+3+2=6\ \text{A}\).`],
     ['3 A',false,'هذا أكبر تيار فرع فقط.'],
     ['2 A',false,'هذا متوسطها، والتيار الكلي مجموعها.']]}}
   ],
   body:[
    {book:String.raw`<ol start="21"><li>من الدائرة الموضحة في شكل رقم (16) أوجد: (أ) قيمة التيار الكلي المار في الدائرة \(I_T\) (ب) المقاومة الكلية وأرسم الدائرة المكافئة. (ج) قيمة جهد المصدر E (د) القدرة المستهلكة في الدائرة</li>
     <li>من الدائرة الكهربائية الموضحة في الشكل رقم (17) أوجد: (أ) قيمة جهد المصدر المكافئ (ب) قيمة المقاومة الكلية وأرسم الدائرة المكافئة (ج) التيار الكلى المار في الدائرة \(I_T\) (د) القدرة المستهلكة في الدائرة.</li>
     <li>من الدائرة الكهربية الموضحة في الشكل رقم (18)، أوجد: (أ) التيار المار في المقاومة 10Ω (ب) المقاومة الكلية وأرسم الدائرة المكافئة (ج) قيمة جهد المصدر E (د) القدرة المستهلكة في الدائرة</li></ol>`,ref:'ص 103–104'},
    {html:`<div class="cb-figs">${[[fx16,'الشكل (16)'],[fx17,'الشكل (17)'],[fx18,'الشكل (18)']].map(([f,c])=>`<figure>${box(f(),420)}<figcaption>${c}</figcaption></figure>`).join('')}</div>`},
    {tip:String.raw`<p>في التمرين 23 الجهد واحد على الفروع الثلاثة: من الفرع المعلوم \(5\times2=10\ \text{V}\) تعرف جهد المصدر وتيار المقاومة 10 Ω. وفي التمرين 21 تعرف جهد المجموعة الثلاثية من أي فرع فيها.</p>`},
    {tip:(()=>X.filter(x=>['21','22','23'].includes(x.n)).map(x=>`<details class="cb-q"><summary>تمرين ${x.n}</summary><div class="cb-ans">${x.ans}</div></details>`).join('')+`<div class="w-row"><button class="btn pri" type="button" onclick="var b=document.querySelector('.ltabs button[data-tab=examples]');if(b)b.click()">افتح الحاسبات في «الأمثلة المحلولة»</button></div>`)(),title:'الإجابات المقترحة (ليست من الكتاب)'},
    {watch:String.raw`<p>التمرين 22: اتجاهات أقطاب البطاريات الخمس غير واضحة في رسم الكتاب؛ الإجابة المقترحة تفترض أنها كلها في اتجاه واحد. إذا كانت إحداها معكوسة فاطرح جهدها بدل جمعه.</p>`,fix:true}
   ]},

  {recap:[
   String.raw`التوالي (حلقة واحدة): \(R_T=R_1+\cdots+R_N\) (3-23)، والتيار واحد \(I=E/R_T\) (3-24)، وجهد كل مقاومة \(V=IR\) (3-25).`,
   String.raw`التوازي: الجهد واحد على كل الفروع، و\(\frac{1}{R_T}=\frac{1}{R_1}+\cdots\) (3-30)، و\(R_T=\frac{R_1R_2}{R_1+R_2}\) (3-31)، و\(I_x=\left(\frac{R_T}{R_x}\right)I\) (3-33).`,
   String.raw`المقاومة المنتهية بطرف مفتوح لا يمر فيها تيار، والمقاومة المقصورة جهدها صفر (ص 84–85).`,
   String.raw`الدوائر المركبة: اختزل من أبعد نقطة عن المصدر، وحوّل النجمة/الدلتا بالمعادلتين (3-36) و(3-37) عند الحاجة، وتحقق بأن مجموع القدرات = قدرة المصدر.`]}
],
 theory:[
  {h:'تمارين على الوحدة الثالثة',ref:'ص 98–104',html:'<p class="sub">الكتاب لا يعطي إجابات للتمارين. اضغط على «إجابة مقترحة» تحت كل تمرين بعد أن تحاول بنفسك، أو اكتب إجاباتك في تبويب «المختبر» لتتحقق منها. <span class="fixnote">ترقيم الكتاب فيه قفزات: بعد 14 يأتي «16» مرتين (لا يوجد 15)، وبعد 17 يأتي 20 (لا يوجد 18 و 19) — احتفظنا بأرقام الكتاب.</span> التمارين 1–3 تخص دروس الوحدة الأولى (الحرارة وقانون أوم والكفاءة).</p>'}
 ].concat(X.map(x=>({h:'تمرين '+x.n,ref:x.ref,html:`<p>«${x.q}»</p>${figBlock(x)}<details class="cb-q"><summary>إجابة مقترحة (ليست من الكتاب)</summary><div class="cb-ans">${x.ans}</div></details>`})),[
  {err:`<div class="fixnote"><ul>
   <li><b>الترقيم:</b> التمرين بعد 14 مرقم «16» والمفترض 15، وبعده 16 مرة أخرى؛ وبعد 17 يأتي 20.</li>
   <li><b>التمرين 1:</b> زيادة 12% بين 18°C و 20°C فقط غير واقعية لمعدن (تعطي معاملاً حرارياً 0.06 لكل درجة)؛ الأرجح خطأ في الدرجة الثانية. الحل المقترح بالأرقام المطبوعة.</li>
   <li><b>التمرين 5:</b> تحت الرسمين حرف «(أ)» فقط. وفي الرسم الأيسر «0.56KΩ» صغيرة جداً مقارنة بغيرها؛ ربما المقصود 0.56 MΩ.</li>
   <li><b>التمرين 6 (B):</b> قيمة R<sub>2</sub> غير مكتوبة في الشكل، فلا يمكن الحل العددي إلا بقيمة نفترضها.</li>
   <li><b>التمرين 22:</b> اتجاهات أقطاب البطاريات الخمس غير واضحة في الرسم؛ افترضنا أنها كلها في اتجاه واحد.</li>
   <li>أخطاء طباعية: «إذاً» بدل «إذا» في التمرينين 2 و 14، و«الد وائر» في التمرين 5.</li></ul></div>`}]),
 lab:(el)=>{
  const L=X.map((x,i)=>({x,i,asks:x.asks({})}));let cur=0;let did={};
  el.innerHTML=`<div class="grid cb-lab"><div class="panel c12"><h2>تحقق من إجابتك <small>تمارين الوحدة الثالثة ص 98–104</small></h2>
   <div class="cb-row"><label class="sub">التمرين: <select class="cb-sel" id="l12s">${L.map((o,i)=>`<option value="${i}">تمرين ${o.x.n}</option>`).join('')}</select></label><button class="btn" id="l12p">◀ السابق</button><button class="btn" id="l12n">التالي ▶</button></div>
   <div id="l12q"></div><div id="l12f"></div><h3 class="sm">اكتب إجاباتك (يقبل فرقاً حتى 1% بسبب التقريب)</h3><div id="l12a"></div>
   <div class="cb-row"><button class="btn primary" id="l12c">تحقق</button><button class="btn" id="l12r">اعرض الإجابات</button></div><div id="l12m"></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="l12st"></ol></div></div>`;
  const $=s=>el.querySelector(s);
  const show=()=>{const o=L[cur];$('#l12s').value=String(cur);$('#l12q').innerHTML=`<p>«${o.x.q}» <span class="ref">${o.x.ref}</span></p>`;$('#l12f').innerHTML=figBlock(o.x);
   $('#l12a').innerHTML=o.asks.map((a,j)=>`<div class="cb-chk"><span>${a.l}</span><input class="cb-in" type="number" step="any" data-j="${j}" aria-label="${a.l.replace(/<[^>]+>/g,'')}"><span class="ltr">${a.u}</span><span class="cb-res" id="l12r${j}"></span></div>`).join('');$('#l12m').innerHTML='';B.math($('#l12q'));B.math($('#l12f'))};
  const check=reveal=>{const o=L[cur];let ok=0,n=0;o.asks.forEach((a,j)=>{const inp=el.querySelector(`[data-j="${j}"]`),r=$('#l12r'+j);if(reveal){inp.value=String(+sig(a.v,5));r.className='cb-res';r.textContent='';return}
    const v=parseFloat(inp.value);if(!isFinite(v)){r.className='cb-res';r.textContent='—';return}n++;const good=Math.abs(v-a.v)<=Math.max(Math.abs(a.v)*0.01,1e-9);if(good)ok++;r.className='cb-res '+(good?'ok':'no');r.textContent=good?'✓ صحيح':'✗ راجع الحل'});
   if(reveal){$('#l12m').innerHTML=`<div class="callout"><b>إجابة مقترحة (ليست من الكتاب):</b> ${o.x.ans}</div>`;B.math($('#l12m'));did.rev=1}
   else{$('#l12m').innerHTML=n?`<div class="callout ${ok===o.asks.length?'':'err'}">${ok} من ${o.asks.length} صحيحة.${ok===o.asks.length?' أحسنت!':' افتح الحاسبة في «الأمثلة المحلولة» لترى الخطوات.'}</div>`:'<div class="callout">اكتب رقماً واحداً على الأقل.</div>';if(n&&ok===o.asks.length)did['ok'+cur]=1;did.chk=1}
   steps.check()};
  $('#l12s').onchange=e=>{cur=+e.target.value;show()};$('#l12p').onclick=()=>{cur=(cur+L.length-1)%L.length;show()};$('#l12n').onclick=()=>{cur=(cur+1)%L.length;show()};
  $('#l12c').onclick=()=>check(false);$('#l12r').onclick=()=>check(true);
  const steps=stepsUI($('#l12st'),[
   {t:'اختر تمريناً',x:'اختر التمرين من القائمة، وحاول حله في دفترك أولاً.'},
   {t:'اكتب إجابتك وتحقق',x:'اكتب الأرقام في الخانات ثم اضغط «تحقق». الإجابة الصحيحة تظهر بعلامة ✓.',done:()=>did.chk},
   {t:'حل تمريناً كاملاً صحيحاً',x:'اجعل كل خانات تمرين واحد صحيحة (مثلاً التمرين 2: <span class="ltr">I = 5 A</span>).',done:()=>Object.keys(did).some(k=>k.startsWith('ok'))},
   {t:'راجع الخطوات',x:'إذا تعثرت اضغط «اعرض الإجابات»، ثم افتح الحاسبة في تبويب «الأمثلة المحلولة» لترى خطوات الحل وتغير الأرقام.',done:()=>did.rev}
  ]);
  show();
 },
 examples:X.map(x=>({title:'تمرين '+x.n+' — حل مقترح (ليس من الكتاب)',ref:x.ref,q:`<p>«${x.q}»</p>`+(x.figs&&x.figs.length?box(x.figs[0][0](),440):''),given:x.given,solve:x.solve,note:'<b>حل مقترح (ليس من الكتاب)</b> بطريقة أمثلة الوحدة: الكتاب لا يعطي إجابات للتمارين.'+(x.note?' '+x.note:'')})),
 quiz:[
  {q:'مقاومات 200 kΩ و 1 MΩ و 330 kΩ و 0.1 MΩ على التوالي. المقاومة الكلية:',o:['1.63 MΩ','531 kΩ','1.53 MΩ','631 kΩ'],c:0,e:'200 + 1000 + 330 + 100 = 1630 kΩ (التمرين 4).'},
  {q:'تيار 10 A يتوزع على 1 Ω و 10 Ω و 1 kΩ و 100 kΩ على التوازي. أكبر تيار في:',o:['100 kΩ','1 kΩ','10 Ω','1 Ω'],c:3,e:'المقاومة الأصغر تأخذ التيار الأكبر (≈ 9.08 A) — التمرين 12.'},
  {q:'مقاومة 30 Ω تستهلك 30 W. جهدها:',o:['1 V','30 V','900 V','60 V'],c:1,e:'\\(V=\\sqrt{PR}=\\sqrt{900}=30\\) V (التمرين 13).'},
  {q:'في التمرين 14: عند قصر طرفي V<sub>L</sub>، المقاومة 3.3 kΩ تصبح:',o:['مفتوحة','على التوازي مع 47 kΩ','مقصورة','على التوالي مع 47 kΩ'],c:1,e:'طرفها الآخر صار متصلاً بالخط السفلي.'},
  {q:'في التمرين 16 (الدائرة السلّمية) نبدأ الاختزال من:',o:['البطارية','أبعد طرف عن البطارية (R5 و R6)','R1','أي مكان'],c:1,e:'نجمع R5 + R6 ثم مع R4 وهكذا رجوعاً إلى البطارية.'},
  {q:'في التمرين 23: 2 Ω يمر فيها 5 A وهي على التوازي مع 10 Ω. تيار 10 Ω:',o:['5 A','0.5 A','1 A','2 A'],c:2,e:'الجهد \\(5\\times2=10\\) V، فتيار 10 Ω = 1 A.'},
  {q:'في التمرين 20 لا توجد مقاومتان على التوالي أو التوازي. الطريقة المناسبة:',o:['قاعدة توزيع الجهد','تحويل النجمة إلى دلتا (أو العكس)','قانون أوم مباشرة','لا يمكن حلها'],c:1,e:'كما في الدرس السابق (مثال 3-40).'}
 ]
});
})(PLCBOOK);
