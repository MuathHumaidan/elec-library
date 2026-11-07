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
  {err:`<ul>
   <li><b>مثال (3-22) ص 77:</b> طُبعت النتائج «28 Ω و 56 Ω و 112 Ω»، والصحيح <b>28 kΩ و 56 kΩ و 112 kΩ</b> لأن المعطى \\(R_T=16\\,k\\Omega\\) (الأرقام نفسها صحيحة). في تبويب الأمثلة حلان: كما في الكتاب، والمصحح.</li>
   <li><b>مثال (3-24) ص 78:</b> الجزء الثاني مرقم «(ت)» والصحيح «(ب)»؛ وكُتب \\(I_T\\) بدل \\(I_S\\) المطلوب (نفس الكمية)؛ وفي سطر \\(I_2\\) طُبع الحد الأوسط \\(E/R_T\\) والصحيح \\(E/R_2\\) (الناتج 40/20 = 2 A صحيح). صححناها في العرض.</li>
   <li>عنوان الشكل (3-19) مطبوع بقوس زائد «((3-19)»، وفي ص 74 كلمتا «التوازي فتحسب» ملتصقتان. أخطاء طباعية صححناها.</li></ul>`}
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
   note:'في الكتاب: الجزء الثاني مرقم «(ت)»، و«\\(I_T\\)» بدل \\(I_S\\)، والحد الأوسط في سطر \\(I_2\\) مطبوع \\(E/R_T\\) والصحيح \\(E/R_2\\). عرضناها مصححة؛ الأرقام لا تتغير.'}
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
  {err:`<ul>
   <li><b>مثال (3-27) ص 83:</b> طُبع السطر «\\(R_1=[R_2(\\;\\;)]/I_1\\)» وما بين القوسين ناقص؛ الصحيح \\(R_1=\\frac{R_2(I-I_1)}{I_1}\\) كما في السطر الذي يليه. أكملناه في العرض.</li>
   <li><b>ص 82:</b> في سطر اشتقاق \\(I_1\\) يوجد رمز «\\» زائد بعد القوس، والمقصود الضرب في I. وفي ص 79 «التيارت» والصحيح «التيارات». أخطاء طباعية صححناها.</li></ul>`}
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
   note:'في الكتاب سطر \\(R_1=[R_2(\\;\\;)]/I_1\\) ناقص ما بين القوسين؛ أكملناه: \\(R_1=R_2(I-I_1)/I_1\\).'}
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
  {err:`<ul>
   <li><b>ص 85:</b> عبارة «\\(I=E/R=E/0\\rightarrow\\infty\\)» تخلط بين تيار R (وهو صفر كما في الشكل) والتيار المسحوب من البطارية (الذي يكبر جداً). وضّحناها في الملاحظة أعلاه.</li>
   <li><b>مثال (3-31) ص 89:</b> «القدرة الإجمالية المسحوبة من المنبع» والمقصود المسحوبة بواسطة المصابيح (240 W)؛ أما المسحوبة من المنبع فتشمل قدرة R أيضاً.</li>
   <li><b>مثال (3-32) ص 90:</b> كُتب «القدرة المفقودة (I²R)» بينما الحساب بالصيغة \\(V^2/R\\) — والصيغتان متكافئتان.</li></ul>`}
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
   note:'الكتاب يكتب «القدرة المفقودة (I²R)» ويحسبها بالصيغة \\(V_R^2/R\\)، وهما متكافئتان. بقيم الكتاب تستعمل الحاسبة R = 55 Ω المطبوعة في المثال السابق.'}
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
  {err:`<ul>
   <li><b>مثال (3-36) ص 93:</b> الصفحة تبدأ بـ«الحل:» مباشرة، ولا يوجد عنوان «مثال (3-36)» ولا نص السؤال. كتبنا المطلوب كما يُفهم من الحل ومن إشارة مثال (3-37) إليه.</li>
   <li><b>مثال (3-37) ص 93:</b> يطلب إثبات أن مجموع القدرات يساوي قدرة البطارية، لكنه لا يكتب قدرة البطارية؛ وهي \\(E\\times I=15\\times6=90\\) W فيتحقق المطلوب. أضفناها في الحل.</li>
   <li><b>مثال (3-33) ص 91:</b> طُبع «أو» بين سطري \\(I_{3\\Omega}\\) و \\(I_{6\\Omega}\\) والمقصود «و».</li></ul>`}
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
  {title:'مثال (3-33)',ref:'ص 90–91',q:'<p>«احسب المقاومة R في الدائرة المبينة في الشكل (3-41) بحيث تكون القدرة المفقودة في المقاومة 3 Ω هي 300 W.»</p>'+box(fig341(),420),given:G333,solve:solve333,note:'في الكتاب كلمة «أو» بين سطري التيارين، والمقصود «و».'},
  {title:'مثال (3-34)',ref:'ص 91',q:'<p>«احسب القدرة التي تمتصها كل مقاومة في المثال (3-33) وأثبت أن القدرة الإجمالية التي يتم الحصول عليها تكون مماثلة لتلك التي يزودها المنبع.»</p>',given:G333,solve:solve334},
  {title:'مثال (3-35)',ref:'ص 92',q:'<p>«احسب التيار المسحوب من البطارية 15V في الدائرة المبينة في الشكل (3-42أ).»</p>'+box(fig342(0),440),given:G335,solve:solve335},
  {title:'مثال (3-36)',ref:'ص 93',q:'<p>(نص السؤال غير مطبوع في الكتاب؛ المطلوب كما يُفهم من الحل:) احسب التيار \\(I_2\\) والقدرة المفقودة في المقاومة 2 Ω في دائرة الشكل (3-42أ).</p>'+box(fig342(2),440),given:G335,solve:solve336},
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
 theory:[
  {h:'ربط النجمة وربط الدلتا (Δ – Y)',ref:'ص 94',html:'<p>«يحدث كثيراً أن ترتبط ثلاث مقاومات، <b>لا على التوازي ولا على التوالي</b> بل على الشكل <b>نجمي Y</b> ويشار إليه أيضاً <b>بالربط T</b> أو أن ترتبط على الشكل <b>دلتا</b> ويشار إليه أيضاً <b>بالربط π</b>. وإذا أريد تحليل دائرة تحتوي على ربط من أحد النوعين بدون استخدام التحليل العقدي أو الحلقي فقد يكون من المفضل إجراء تحويل في الربط من نوع إلى مكافئه من النوع الآخر كأن يتم تحويل ربط Y إلى ربط Δ أو العكس.»</p><p>«ويمكن إيجاد المكافئ لأي من الرابطين بدلالة الآخر عن طريق الموازنة بين قيم المقاومة بين أي طرفين من الأطراف الثلاثة ومرادفتها في الربط الآخر وتحت نفس الشروط. وعند الموازنة بين الربط Y و Δ في الشكل (3-43) فإن تكافؤ الربطين يتطلب أن تكون <b>المقاومة بين أي طرفين من الربط Δ مساوية للمقاومة بين نفس الطرفين للربط Y</b>.»</p>'},
  {fig:'(3-43)',ref:'ص 94',caption:'يساراً دلتا رؤوسها N1 و N2 و N3، ويميناً نجمة: R1 إلى N1، و R2 إلى N2، و R3 إلى N3. (الأسماء Rb و Rc على ضلعي الدلتا مصححة — انظر الملاحظة والمفتاح تحت الشكل)',draw:()=>box(fig343('fixed'),560)},
  {widget:(el)=>{let m='fixed';const draw=()=>{const sd=SIDES[m];const opp={N1:'R1',N2:'R2',N3:'R3'};const form={Ra:'R2',Rb:'R3',Rc:'R1'};
    const rows=Object.entries(sd).map(([k,[p,q]])=>{const o=['N1','N2','N3'].find(n=>n!==p&&n!==q);const need=opp[o],ok=need===form[k];return `<tr><td>R<sub>${k[1]}</sub></td><td>${p.replace('N','N<sub>')}</sub>–${q.replace('N','N<sub>')}</sub></td><td>${need.replace('R','R<sub>')}</sub></td><td>Σ/${form[k].replace('R','R<sub>')}</sub></td><td class="${ok?'ok':'bad'}">${ok?'✓ يتفق':'✗ لا يتفق'}</td></tr>`}).join('');
    el.innerHTML=`<figure class="fig"><h3 class="sm" style="margin:0">الشكل (3-43): كما في الكتاب أم المصحح؟</h3><div class="cb-row">${segHTML('f43',[['book','كما في الكتاب'],['fixed','المصحح']],m)}</div>${box(fig343(m),540)}
     <div class="cb-tbl"><table class="tt"><thead><tr><th>ضلع الدلتا</th><th>بين الطرفين</th><th>مقاومة النجمة المقابلة له</th><th>المعادلة (3-36) تقسم على</th><th>النتيجة</th></tr></thead><tbody>${rows}</tbody></table></div>
     <p class="sub">${m==='book'?'في رسم الكتاب R<sub>b</sub> على الضلع N<sub>3</sub>–N<sub>2</sub> و R<sub>c</sub> على القاعدة N<sub>1</sub>–N<sub>2</sub>، فلا تتفق المعادلات (3-36) معه في ضلعين.':'بتبديل اسمي R<sub>b</sub> و R<sub>c</sub> في الرسم تتفق المعادلات (3-36) و(3-37) والجدولان (3-1) و(3-2) كلها مع الشكل.'} القاعدة: ضلع الدلتا = Σ ÷ مقاومة النجمة <b>المقابلة</b> له (التي لا تلمس طرفيه).</p></figure>`;
    el.querySelectorAll('[data-f43]').forEach(b=>b.onclick=()=>{m=b.dataset.f43;draw()})};draw()}},
  {h:'تحويل ربط Y إلى ربط Δ',ref:'ص 95',html:'$$R_a=\\frac{R_3R_2+R_2R_1+R_3R_1}{R_2}$$ $$R_b=\\frac{R_1R_2+R_2R_3+R_3R_1}{R_3} \\qquad (3\\text{-}36)$$ $$R_c=\\frac{R_1R_2+R_2R_3+R_3R_1}{R_1}$$'},
  {h:'تحويل ربط Δ إلى ربط Y',ref:'ص 95',html:'$$R_1=\\frac{R_aR_b}{R_a+R_b+R_c}$$ $$R_2=\\frac{R_bR_c}{R_a+R_b+R_c} \\qquad (3\\text{-}37)$$ $$R_3=\\frac{R_aR_c}{R_a+R_b+R_c}$$'},
  {note:NOTE_ADD+'طريقة سهلة للحفظ: <b>من نجمة إلى دلتا</b>: ضلع الدلتا = (مجموع حواصل ضرب مقاومات النجمة مثنى مثنى) ÷ (مقاومة النجمة المقابلة للضلع). <b>من دلتا إلى نجمة</b>: ذراع النجمة = (حاصل ضرب ضلعي الدلتا الملتقيين عند طرفه) ÷ (مجموع أضلاع الدلتا). وإذا كانت المقاومات الثلاث متساوية: \\(R_\\Delta=3R_Y\\).'},
  {h:'مثال (3-38): من نجمة إلى دلتا',ref:'ص 95',html:'<p>«لتكن المقاومات \\(R_1\\)، \\(R_2\\)، \\(R_3\\) الموضحة في الشكل (3-43) قيمتها 12Ω، 34Ω، 1Ω على التوالي (الحالة الأولى الجدول (3-1)). تم تحويل ربط Y إلى ربط Δ. احسب قيمة المقاومات \\(R_a\\), \\(R_c\\), \\(R_b\\) للحالات الست.» «بتطبيق القوانين (3-36) نحصل على قيم المقاومات للحالات الست الجدول (3-1).» (عبارة «على التوالي» هنا بمعنى «بالترتيب».)</p>'},
  {widget:(el)=>{let m='book';const draw=()=>{el.innerHTML=`<figure class="fig"><h3 class="sm" style="margin:0">الجدول (3-1) ص 95</h3><div class="cb-row">${segHTML('t31',[['book','كما في الكتاب'],['fixed','المصحح']],m)}</div>${table31(m)}<p class="sub">${m==='book'?'رؤوس الأعمدة كما طُبعت («Rb؟ Rc؟ Rc؟»)، والخانات الحمراء أرقام مطبوعة خطأ (الحالة 6).':'رؤوس الأعمدة المصححة، وكل القيم محسوبة بالمعادلات (3-36). الخانات الخضراء صُححت عن الكتاب.'}</p></figure>`;el.querySelectorAll('[data-t31]').forEach(b=>b.onclick=()=>{m=b.dataset.t31;draw()})};draw()}},
  {h:'مثال (3-39): من دلتا إلى نجمة',ref:'ص 96',html:'<p>«لتكن المقاومات \\(R_A\\)، \\(R_C\\)، \\(R_B\\) الموضحة في الشكل (3-43) قيمتها 16Ω، 27Ω، 76Ω (الحالة الأولى الجدول (3-2)). تم تحويل ربط Δ إلى ربط Y. احسب قيمة المقاومات \\(R_3\\)، \\(R_1\\)، \\(R_2\\) للحالات الخمس. بتطبيق القوانين (3-37) نحصل على قيم المقاومات للحالات الخمس الجدول (3-2).»</p><h3 class="sm">الجدول (3-2) ص 96</h3>'+table32()+'<p class="sub">كل قيم الجدول (3-2) صحيحة بالمعادلات (3-37).</p>'},
  {h:'مثال (3-40): القنطرة',ref:'ص 96–97',html:'<p>«في شبكة المقاومات المبينة بالشكل (3-44أ). احسب قيمة المقاومة المكافئة عند الطرفين AB.»</p><p>لا توجد في الشبكة مقاومتان على التوالي ولا على التوازي، لذلك «نحول شبكة الدلتا» abc «إلى شبكة نجمية باستخدام المعادلة» (3-37):</p>$$R_{ao}=\\frac{9\\times3}{3+6+9}=1.5\\ \\Omega,\\quad R_{bo}=\\frac{6\\times3}{3+6+9}=1\\ \\Omega,\\quad R_{co}=\\frac{6\\times9}{3+6+9}=3\\ \\Omega$$<p>«ومنها نحصل على الدائرة المكافئة الشكل (3-44ب) التي تحتوي على مجموعات مقاومات موصلة توالي/ توازي»:</p>$$R_{od}=\\frac{(1.5+4.5)(3+3)}{1.5+4.5+3+3}=3\\ \\Omega,\\qquad R_{AB}=R_{bo}+R_{od}=1+3=4\\ \\Omega$$'},
  {fig:'(3-44أ)',ref:'ص 96',caption:'شبكة قنطرة: a–b = 3 Ω، b–c = 6 Ω، a–c = 9 Ω، a–d = 4.5 Ω، c–d = 3 Ω؛ الطرف A متصل بـ b والطرف B متصل بـ d',draw:()=>box(fig344(0),400)},
  {fig:'(3-44ب)',ref:'ص 97',caption:'بعد تحويل الدلتا abc إلى نجمة مركزها o: b–o = 1 Ω، o–a = 1.5 Ω، o–c = 3 Ω، ثم a–d = 4.5 Ω و c–d = 3 Ω',draw:()=>box(fig344(1),400)},
  {note:NOTE_ADD+'بعد التحويل صار الطريقان o–a–d و o–c–d على التوازي (كل منهما 6 Ω) وهذا ما جعل الحل سهلاً. التحويل لا يغير شيئاً «خارج» المثلث: التيار في المقاومتين 4.5 Ω و 3 Ω هو نفسه في الشكلين — شاهد ذلك في المختبر.'},
  {err:`<ul>
   <li><b>الشكل (3-43) ص 94:</b> اسما الضلعين R<sub>b</sub> و R<sub>c</sub> في الرسم لا يتفقان مع المعادلات (3-36) و(3-37) ولا مع الجدولين. بتبديل الاسمين في الرسم (R<sub>b</sub> بين N<sub>1</sub> و N<sub>2</sub>، و R<sub>c</sub> بين N<sub>3</sub> و N<sub>2</sub>) يتفق كل شيء، لذلك رسمنا الشكل مصححاً، والمفتاح أعلاه يعرض الرسم كما في الكتاب.</li>
   <li><b>المعادلة (3-37) ص 95:</b> السطر الثالث مطبوع «\\(R_1=\\frac{R_aR_C}{\\ldots}\\)» (R<sub>1</sub> مكررة)، والصحيح <b>R<sub>3</sub></b> كما يعامله الجدول (3-2). وص 94 تنتهي بعبارة «فالمقاومة الكلية بين N3 و N1 في الربط Δ هي:» بلا معادلة.</li>
   <li><b>الجدول (3-1) ص 95:</b> رؤوس الأعمدة المحسوبة مطبوعة «Rb، Rc، Rc» والصحيح بالمعادلات (3-36): <b>R<sub>a</sub> (= Σ/R<sub>2</sub>)، R<sub>c</sub> (= Σ/R<sub>1</sub>)، R<sub>b</sub> (= Σ/R<sub>3</sub>)</b>. و<b>الحالة 6 فيها خطأ حسابي</b>: المطبوع 29078 و 147864 و 140463، والصحيح <b>29037.1 و 149953.3 و 142447.9</b>. في تبويب الأمثلة حلان للحالة 6: كما في الكتاب والمصحح.</li>
   <li><b>مثال (3-39) ص 96:</b> كُتب «(الحالة الأولى الجدول (3-1))» والصحيح الجدول (3-2)؛ وترتيب القيم في النص «R<sub>A</sub>، R<sub>C</sub>، R<sub>B</sub> … 27Ω، 76Ω، 16Ω» لا يطابق الجدول، والصحيح من الجدول: R<sub>A</sub> = 16، R<sub>C</sub> = 27، R<sub>B</sub> = 76 Ω.</li>
   <li><b>مثال (3-40) ص 97:</b> «نحول شبكة الدلتا الشكل (3-44ب)» والمقصود الدلتا abc في الشكل (3-44أ)؛ و«المعادلة (7-2)» والصحيح <b>(3-37)</b>؛ والرمز «R<sub>ad</sub>» المقصود به R<sub>od</sub>، و«R<sub>ab</sub>» المقصود به R<sub>AB</sub>. صححناها في العرض.</li></ul>`}
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
     if(cs){const P=T31P[cs-1],ex=[D.Ra,D.Rc,D.Rb];const bd=P.map((p,j)=>Math.abs(p-ex[j])/ex[j]>0.0005);h+=`<div class="callout ${bd.some(Boolean)?'err':''}">المطبوع في الجدول (3-1) للحالة ${cs}: ${['R<sub>a</sub>','R<sub>c</sub>','R<sub>b</sub>'].map((n,j)=>`${n} = <span class="ltr">${P[j]}</span>${bd[j]?' ✗':' ✓'}`).join('، ')}. ${bd.some(Boolean)?'<b>خطأ حسابي في الكتاب</b> — القيم الصحيحة هي المحسوبة أعلاه.':'تطابق الحساب (مع تقريب الكتاب).'}</div>`}}
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
   note:'رتبنا القيم كما في الجدول (3-2) (R<sub>A</sub> = 16، R<sub>C</sub> = 27، R<sub>B</sub> = 76)؛ ترتيبها في نص الكتاب لا يطابق الجدول.'},
  {title:'مثال (3-40)',ref:'ص 96–97',q:'<p>«في شبكة المقاومات المبينة بالشكل (3-44أ). احسب قيمة المقاومة المكافئة عند الطرفين AB.»</p>'+box(fig344(0),360),
   given:[{id:'ab',label:'a–b',sym:'',unit:'Ω',value:3},{id:'bc',label:'b–c',sym:'',unit:'Ω',value:6},{id:'ac',label:'a–c',sym:'',unit:'Ω',value:9},{id:'ad',label:'a–d',sym:'',unit:'Ω',value:4.5},{id:'cd',label:'c–d',sym:'',unit:'Ω',value:3}],solve:solve340,
   note:'في الكتاب: «الشكل (3-44ب)» بدل (3-44أ)، و«المعادلة (7-2)» بدل (3-37)، و R<sub>ad</sub> و R<sub>ab</sub> بدل R<sub>od</sub> و R<sub>AB</sub>. صححناها في الحل.'}
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
 ans:'بالمعادلة (3-14) منسوبة إلى 18°C: \\(R_{20}=28\\times1.12=31.36=28[1+\\alpha_{18}(20-18)]\\) ومنها \\(\\alpha_{18}=0.06\\) °C⁻¹. ثم \\(35=28[1+0.06(T-18)]\\) فتكون \\(T\\approx22.17\\)°C، والارتفاع فوق المحيط \\(22.17-20\\approx2.17\\)°C. <b>تنبيه:</b> زيادة 12% في درجتين فقط غير واقعية لمعدن (الأرجح أن الرقم 20°C خطأ طباعي، قارن مثال 3-3: من 15 إلى 50°C)؛ الحاسبة تقبل أي درجة.',
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
 theory:[
  {h:'تمارين على الوحدة الثالثة',ref:'ص 98–104',html:'<p class="sub">الكتاب لا يعطي إجابات للتمارين. اضغط على «إجابة مقترحة» تحت كل تمرين بعد أن تحاول بنفسك، أو اكتب إجاباتك في تبويب «المختبر» لتتحقق منها. ترقيم الكتاب فيه قفزات: بعد 14 يأتي «16» مرتين (لا يوجد 15)، وبعد 17 يأتي 20 (لا يوجد 18 و 19) — احتفظنا بأرقام الكتاب. التمارين 1–3 تخص دروس الوحدة الأولى (الحرارة وقانون أوم والكفاءة).</p>'}
 ].concat(X.map(x=>({h:'تمرين '+x.n,ref:x.ref,html:`<p>«${x.q}»</p>${figBlock(x)}<details class="cb-q"><summary>إجابة مقترحة (ليست من الكتاب)</summary><div class="cb-ans">${x.ans}</div></details>`})),[
  {err:`<ul>
   <li><b>الترقيم:</b> التمرين بعد 14 مرقم «16» والمفترض 15، وبعده 16 مرة أخرى؛ وبعد 17 يأتي 20.</li>
   <li><b>التمرين 1:</b> زيادة 12% بين 18°C و 20°C فقط غير واقعية لمعدن (تعطي معاملاً حرارياً 0.06 لكل درجة)؛ الأرجح خطأ في الدرجة الثانية. الحل المقترح بالأرقام المطبوعة.</li>
   <li><b>التمرين 5:</b> تحت الرسمين حرف «(أ)» فقط. وفي الرسم الأيسر «0.56KΩ» صغيرة جداً مقارنة بغيرها؛ ربما المقصود 0.56 MΩ.</li>
   <li><b>التمرين 6 (B):</b> قيمة R<sub>2</sub> غير مكتوبة في الشكل، فلا يمكن الحل العددي إلا بقيمة نفترضها.</li>
   <li><b>التمرين 22:</b> اتجاهات أقطاب البطاريات الخمس غير واضحة في الرسم؛ افترضنا أنها كلها في اتجاه واحد.</li>
   <li>أخطاء طباعية: «إذاً» بدل «إذا» في التمرينين 2 و 14، و«الد وائر» في التمرين 5.</li></ul>`}]),
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
