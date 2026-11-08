/* Unit 3 — تحليل الاستجابة الزمنية لبعض الأنظمة الصناعية ذات الدائرة المغلقة (ص 21–43)
   Lessons u3-l1 … u3-l6 = the unit's experiments 1–6 (P, I, PI, PID simulation, digital PID speed, digital light).
   The book is a pure lab manual: every theory block here is tagged «توضيح للمتدرب — ليس من الكتاب».
   ONE simulation core (simLoop = bench with saturation / dead time / sampling, tfStep = Simulink closed-loop
   transfer function) and ONE bench UI (ctrlBench) drive all six labs. Plant numbers the book does not give
   are B.params trainer fields (one panel per lesson). */
(function(B){
const {S}=B;
const fm=(x,d)=>B.fmtN(x,d);
const fx=v=>(+v).toFixed(1);
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const lt=s=>`<span class="ltr">${s}</span>`;
/* keep «K<sub>p</sub> = 0.5» runs left-to-right inside Arabic text (outside tags and existing ltr spans) */
const ltK=t=>typeof t!=='string'?t:t.replace(/(<span class="ltr">[\s\S]*?<\/span>)|((?:[A-Za-z]+<sub>[^<]+<\/sub>)(?:\s*[=\/·×]\s*(?:[A-Za-z]+<sub>[^<]+<\/sub>|[\d.]+(?:\s?(?:s|V|%))?))*)/g,(m,a,b)=>a?a:`<span class="ltr">${b}</span>`);

/* ---------- styles used only by this file (CSS variables only) ---------- */
(function css(){if(typeof document==='undefined'||document.getElementById('clu3-css'))return;const s=document.createElement('style');s.id='clu3-css';s.textContent=`
.cl-lab .seg{flex-wrap:wrap;max-width:100%}
.cl-lab .seg button{white-space:nowrap}
.cl-row{display:flex;gap:8px 12px;flex-wrap:wrap;margin-top:10px;align-items:center}
.cl-row .sub{margin:0}
.cl-ctl{display:flex;flex-wrap:wrap;gap:10px 18px;margin-top:10px;align-items:flex-end}
.cl-ctl>div{min-width:0}
.cl-ctl .cl-l{font-size:12.5px;color:var(--muted);display:block;margin-bottom:3px}
.cl-num{width:84px;font:600 14px var(--mono);direction:ltr;padding:4px 6px;border:1px solid var(--line);border-radius:8px;background:var(--surface);color:var(--fg)}
.cl-sl{display:flex;flex-direction:column;gap:2px;font-size:13.5px;min-width:200px}
.cl-sl .cl-h{display:flex;justify-content:space-between;gap:8px}
.cl-sl b{font-family:var(--mono);direction:ltr;unicode-bidi:isolate;color:var(--blue-ink)}
.cl-sl input[type=range]{width:100%;accent-color:var(--blue);direction:ltr}
.cl-meters{display:grid;grid-template-columns:repeat(auto-fit,minmax(112px,1fr));gap:8px;margin-top:10px}
.cl-meter{background:var(--surface-2);border:1px solid var(--line);border-radius:10px;padding:6px 8px;text-align:center}
.cl-meter span{display:block;font-size:11.5px;color:var(--muted)}
.cl-meter b{font:700 16px var(--mono);direction:ltr;unicode-bidi:isolate;display:inline-block}
.cl-meter.bad{border-color:var(--stop)}.cl-meter.bad b{color:var(--stop)}
.cl-tbl{overflow-x:auto;margin-top:8px;position:relative}
table.cl-bt{border-collapse:collapse;font-size:13.5px;min-width:100%}
table.cl-bt th,table.cl-bt td{border:1px solid var(--line);padding:5px 8px;text-align:center;white-space:nowrap}
table.cl-bt th{background:var(--surface-2);font-weight:600}
table.cl-bt td{font-family:var(--mono);direction:ltr;min-width:56px}
table.cl-bt td.bad{color:var(--stop)}
table.cl-bt tr.cur th{background:var(--live-soft)}
.cl-q{border:1px solid var(--line);border-radius:12px;padding:10px 14px;margin:10px 0;background:var(--surface)}
.cl-q summary{cursor:pointer;font-weight:600;line-height:1.7}
.cl-ans{margin-top:8px;border-inline-start:3px solid var(--blue);padding:6px 12px;background:var(--blue-soft);border-radius:0 10px 10px 0}
.cl-cur{display:flex;gap:10px;align-items:center;margin-top:8px;font-size:13px;flex-wrap:wrap}
.cl-cur input{flex:1;min-width:140px;accent-color:var(--blue);direction:ltr}
.cl-cur b{font-family:var(--mono);direction:ltr;unicode-bidi:isolate}
.cl-leg{display:flex;gap:12px;flex-wrap:wrap;font-size:12.5px;margin-top:6px;color:var(--muted)}
.cl-leg i{display:inline-block;width:18px;height:3px;border-radius:2px;vertical-align:middle;margin-inline-end:4px}
.svgbox.cl-wide svg{min-width:600px}
.cl-try{margin:6px 0 0;padding-inline-start:20px}
.cl-defs{margin:6px 0 0;padding-inline-start:20px;line-height:1.9}
.katex .katex-mathml{max-width:1px;overflow:hidden}
`;document.head.appendChild(s)})();

/* ---------- small helpers (local copies, as in the other courses) ---------- */
function loopOn(el,fn){let last=performance.now();const f=now=>{if(!document.body.contains(el))return;const dt=Math.min(0.05,Math.max(0,(now-last)/1000));last=now;try{fn(dt)}catch(e){console.error(e);return}requestAnimationFrame(f)};requestAnimationFrame(f)}
function stepsUI(host,steps){let i=0;
  const draw=()=>{host.innerHTML=steps.map((s,j)=>`<li class="${j<i?'done':j===i?'cur':''}"><span class="k">${j<i?'✓':j+1}</span><div><h4>${B.ltrU(ltK(s.t))}</h4><p>${B.ltrU(ltK(typeof s.x==='function'?s.x():s.x))}</p>${j===i?`<div class="act">${s.done?'<span class="hint">بانتظار تنفيذك…</span> <button class="btn" data-next>تخطَّ</button>':'<button class="btn primary" data-next>التالي</button>'}</div>`:''}</div></li>`).join('')+
    (i>=steps.length?`<li class="cur"><span class="k">✓</span><div><h4>أحسنت، أنهيت التجربة</h4><p style="display:block">جرّب قيماً أخرى، أو أعد التجربة من أولها.</p><div class="act"><button class="btn" data-restart>إعادة التجربة</button></div></div></li>`:'');B.math(host)};
  host.addEventListener('click',e=>{if(e.target.closest('[data-next]')){i++;draw()}if(e.target.closest('[data-restart]')){i=0;draw()}});draw();
  return {check(){let m=0,moved=false;while(m++<steps.length){const s=steps[i];if(s&&s.done&&s.done()){i++;moved=true}else break}if(moved)draw()},redraw:draw};}
const segHTML=(attr,items,cur)=>`<div class="seg" role="group">${items.map(([v,l])=>`<button data-${attr}="${v}" aria-pressed="${String(v)===String(cur)}">${l}</button>`).join('')}</div>`;
const segSet=(el,attr,v)=>el.querySelectorAll(`[data-${attr}]`).forEach(b=>b.setAttribute('aria-pressed',String(String(b.dataset[attr])===String(v))));
const swHTML=(id,b,label,on)=>`<button class="sw" id="${id}" aria-pressed="${on?'true':'false'}"><span class="knob"></span><b>${b}</b><small>${label}</small></button>`;
const arT=(x,y,s,o)=>{o=o||{};return `<text class="txt ar" x="${x}" y="${y}" text-anchor="${o.a||'middle'}"${o.fs?` font-size="${o.fs}"`:''}${o.col?` style="fill:var(${o.col})"`:''}>${s}</text>`};
const box=(svg,max,wide)=>`<div class="svgbox${wide?' cl-wide':''}" style="margin-inline:auto;${max?`max-width:${max}px`:''}">${svg}</div>`;
const Q=(n,q,ans)=>`<details class="cl-q"><summary>${n}: ${q}</summary><div class="cl-ans"><b>إجابة مقترحة (ليست من الكتاب):</b> ${ans}</div></details>`;
const ADD='<b>توضيح للمتدرب — ليس من الكتاب:</b> ';
/* printed (empty) table: rows down, columns across — as in the book */
const ptable=(cols,rows)=>`<div class="cl-tbl"><table class="cl-bt"><thead><tr>${cols.map(c=>`<th>${c}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr><th>${r}</th>${cols.slice(1).map(()=>'<td></td>').join('')}</tr>`).join('')}</tbody></table></div>`;
const tryList=items=>`<div class="callout"><b>جرّب:</b><ol class="cl-try">${items.map(x=>`<li>${x}</li>`).join('')}</ol></div>`;
const tsTxt=m=>m.osc?'لا يستقر':(m.ts>m.Tw*1.0001?`> ${fm(m.Tw)}`:fm(m.ts,m.Tw>=50?1:m.Tw>=2?2:3));
const tdp=Tw=>Tw>=50?1:Tw>=2?2:3;
const nz=(v,d)=>v==null?'—':fm(v,d);

/* ======================================================================
   NUMERIC CORE
   ====================================================================== */
/* plants: {x0, d(s,u,z)->ds/dt, y(s)->x, Tt (dead time, s)} */
const PLANT={
  pt1:(K,T)=>({x0:[0],d:(s,u)=>[(K*u-s[0])/T],y:s=>s[0]}),
  pt2:(K,T1,T2,Tt)=>({x0:[0,0],Tt:Tt||0,d:(s,u)=>[(K*u-s[0])/T1,(s[0]-s[1])/T2],y:s=>s[1]}),
  thermal:(K,amb,T,Tt,dz)=>({x0:[0],Tt,d:(s,u,z)=>[(K*u-(z?dz:0)-s[0])/T],y:s=>amb+s[0]})
};
function rk4(P,s,u,z,dt){const n=s.length,a=P.d(s,u,z),s2=new Array(n),s3=new Array(n),s4=new Array(n);
  for(let i=0;i<n;i++)s2[i]=s[i]+a[i]*dt/2;const b=P.d(s2,u,z);for(let i=0;i<n;i++)s3[i]=s[i]+b[i]*dt/2;const c=P.d(s3,u,z);
  for(let i=0;i<n;i++)s4[i]=s[i]+c[i]*dt;const d=P.d(s4,u,z);const r=new Array(n);for(let i=0;i<n;i++)r[i]=s[i]+dt/6*(a[i]+2*b[i]+2*c[i]+d[i]);return r}
/* bench simulation. o:{plant,Tw,w0,ext,sat:[lo,hi],ctrl:{type:'open'|'analog'|'digital',P,I,D,Kp,KI,Ti,Td,T0},zOn:t=>bool}
   analog: u = Kp·e + KI∫e ; digital (every T0, held by the D/A): u = Kp·[e + (T0/Ti)Σe + (Td/T0)Δe]; output limited to sat. */
function simLoop(o){const P=o.plant,Tw=o.Tw,ext=o.ext||6,N=4000,dt=Tw/N,M=N*ext;const c=o.ctrl,lo=o.sat[0],hi=o.sat[1];
  const t=new Float64Array(M+1),w=new Float64Array(M+1),x=new Float64Array(M+1),u=new Float64Array(M+1);
  let s=P.x0.slice(),xi=0,uh=0,nextS=0,eP=null;const dN=P.Tt?Math.max(1,Math.round(P.Tt/dt)):0,buf=new Float64Array(dN+1);let bi=0;
  buf.fill(c.type==='open'?0:clamp(0,lo,hi));
  for(let i=0;i<=M;i++){const ti=i*dt,wi=o.w0,xv=P.y(s),z=o.zOn?o.zOn(ti):0;let ui;
    if(c.type==='open')ui=clamp(wi,lo,hi);
    else if(c.type==='analog'){const e=wi-xv;const up=c.P?c.Kp*e:0;if(c.I){xi+=c.KI*e*dt;xi=clamp(xi,lo,hi)}else xi=0;ui=clamp(up+(c.I?xi:0),lo,hi)}
    else{if(ti>=nextS-1e-9){const e=wi-xv;if(c.I){xi+=c.Kp*c.T0/c.Ti*e;xi=clamp(xi,lo,hi)}else xi=0;const ud=c.D&&eP!=null?c.Kp*c.Td*(e-eP)/c.T0:0;eP=e;
        uh=clamp((c.P?c.Kp*e:0)+(c.I?xi:0)+ud,lo,hi);nextS+=c.T0}ui=uh}
    t[i]=ti;w[i]=wi;x[i]=xv;u[i]=ui;
    let ud=ui;if(dN){buf[bi]=ui;bi=(bi+1)%(dN+1);ud=buf[bi]}
    s=rk4(P,s,ud,z,dt)}
  const n10=Math.round(M*0.1);let mx=-1e9,mn=1e9,sm=0;for(let i=M-n10;i<=M;i++){mx=Math.max(mx,x[i]);mn=Math.min(mn,x[i]);sm+=x[i]}
  return {t,w,x,u,N,M,Tw,xf:sm/(n10+1),amp:mx-mn}}
/* Simulink: step response of a closed-loop transfer function (num/den highest power first, as in MATLAB) */
function tfStep(num,den,amp,Tw,ext){ext=ext||8;const a0=den[0],dn=den.map(v=>v/a0),n=dn.length-1;let nm=num.map(v=>v/a0);while(nm.length<n+1)nm.unshift(0);
  const Dd=nm[0],cc=[];for(let i=1;i<=n;i++)cc.push(nm[i]-Dd*dn[i]);
  const cb=1+Math.max(...dn.slice(1).map(Math.abs));const Nrec=4000,M=Nrec*ext,dtr=Tw/Nrec;const sub=Math.max(1,Math.ceil(dtr/(0.35/cb))),dt=dtr/sub;
  let s=new Array(n).fill(0);const f=v=>{const d=new Array(n);for(let j=0;j<n-1;j++)d[j]=v[j+1];let acc=amp;for(let j=0;j<n;j++)acc-=dn[n-j]*v[j];d[n-1]=acc;return d};
  const out=v=>{let y=Dd*amp;for(let j=0;j<n;j++)y+=cc[n-1-j]*v[j];return y};
  const t=new Float64Array(M+1),w=new Float64Array(M+1),x=new Float64Array(M+1);
  for(let i=0;i<=M;i++){t[i]=i*dtr;w[i]=amp;x[i]=out(s);for(let k=0;k<sub;k++){const a=f(s),s2=s.map((v,j)=>v+a[j]*dt/2),b=f(s2),s3=s.map((v,j)=>v+b[j]*dt/2),c=f(s3),s4=s.map((v,j)=>v+c[j]*dt),d=f(s4);s=s.map((v,j)=>v+dt/6*(a[j]+2*b[j]+2*c[j]+d[j]))}}
  let k=0;const N2=num.slice().reverse(),D2=den.slice().reverse();while(k<D2.length&&Math.abs(D2[k])<1e-12&&Math.abs(N2[k]||0)<1e-12)k++;
  const xf=amp*(N2[k]||0)/D2[k];const n10=Math.round(M*0.1);let mx=-1e9,mn=1e9;for(let i=M-n10;i<=M;i++){mx=Math.max(mx,x[i]);mn=Math.min(mn,x[i])}
  return {t,w,x,u:null,N:Nrec,M,Tw,xf,amp:mx-mn,lin:true}}
/* measurements (definitions in the theory tab): td 50 %, tr 10→90 %, ts 2 % band, Mp above the final value */
function measure(r){const {t,x,N,M}=r;const x00=x[0],xf=r.xf,span=xf-x00,as=Math.abs(span)||1e-9,sg=Math.sign(span)||1;const osc=r.amp>0.02*as;
  const lev=p=>{for(let i=0;i<=N;i++)if((x[i]-x00)/(span||1e-9)>=p)return t[i];return null};
  const td=lev(0.5),t10=lev(0.1),t90=lev(0.9);let mxv=-1e9,mi=0;for(let i=0;i<=N;i++)if((x[i]-x00)*sg>mxv){mxv=(x[i]-x00)*sg;mi=i}
  let Mp=mxv-as;if(Mp<0.005*as)Mp=0;const tp=Mp>0?t[mi]:null;
  let ts=0;if(osc)ts=Infinity;else{for(let i=M;i>=0;i--)if(Math.abs(x[i]-xf)>0.02*as){ts=t[Math.min(M,i+1)];break}}
  const x0=x[N];return {x0,xf,w0:r.w[N],e:r.w[N]-x0,td,tr:(t10!=null&&t90!=null)?t90-t10:null,Mp,MpP:Mp/as*100,tp,ts,osc,Tw:r.Tw,span,xi:x00}}
/* tangent at the inflection point → Tu (delay) and Tg (compensation time) */
function tangent(r){const {t,x,N}=r;let best=0,bi=1;for(let i=1;i<N;i++){const s=(x[i+1]-x[i-1])/(t[i+1]-t[i-1]);if(s>best){best=s;bi=i}}
  const x00=x[0],xf=r.xf;if(!(best>0))return null;const ti=t[bi],xi=x[bi];const t0=ti-(xi-x00)/best,Tg=(xf-x00)/best;return {ti,xi,s:best,Tu:Math.max(0,t0),Tg,x00,xf}}
/* value of a recorded array at time tt (window part) */
const at=(r,arr,tt)=>{const i=clamp(Math.round(tt/r.Tw*r.N),0,r.N);return arr[i]};

/* ======================================================================
   SVG DRAWINGS
   ====================================================================== */
const wcls=on=>on?'w live':'w';
const sock=(x,y,l,pos,col)=>`<circle cx="${x}" cy="${y}" r="6" fill="var(--surface)" stroke="var(${col||'--fg'})" stroke-width="1.8"/>`+(l?S.t(x,pos==='b'?y+19:y-11,l,'b',null,12):'');
const pnl=(x,y,w,h,title)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="9" fill="var(--on-soft)" stroke="var(--on)" stroke-width="1.4"/>`+(title?S.t(x+10,y+16,title,'','start',12):'');
const rbox=(x,y,w,h,fill)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="var(${fill||'--surface'})" stroke="var(--fg)" stroke-width="1.5"/>`;
const sumC=(x,y,r)=>`<circle cx="${x}" cy="${y}" r="${r||11}" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/><path d="M${x-(r||11)*0.7} ${y-(r||11)*0.7}L${x+(r||11)*0.7} ${y+(r||11)*0.7}M${x+(r||11)*0.7} ${y-(r||11)*0.7}L${x-(r||11)*0.7} ${y+(r||11)*0.7}" stroke="var(--fg)" stroke-width="1.2"/>`;
function arr(x1,y1,x2,y2,cls){const a=Math.atan2(y2-y1,x2-x1),h=8,bx=x2-h*Math.cos(a),by=y2-h*Math.sin(a),px=-Math.sin(a)*3.6,py=Math.cos(a)*3.6;
  return `<path class="${cls||'w'}" d="M${fx(x1)} ${fx(y1)}L${fx(bx)} ${fx(by)}"/><path d="M${fx(x2)} ${fx(y2)}L${fx(bx+px)} ${fx(by+py)}L${fx(bx-px)} ${fx(by-py)}Z" fill="var(--fg)"/>`}
/* polyline with arrow at the end */
function parr(pts,cls){let d='';for(let i=0;i<pts.length-1;i++)d+=(i?'L':'M')+pts[i][0]+' '+pts[i][1];const p=pts[pts.length-2],q=pts[pts.length-1];
  return (pts.length>2?`<path class="${cls||'w'}" d="${d}L${p[0]} ${p[1]}"/>`:'')+arr(p[0],p[1],q[0],q[1],cls)}
const hopH=(x1,x2,y,xs,cls)=>{let d=`M${x1} ${y}`;const up=x2>x1;xs.slice().sort((a,b)=>up?a-b:b-a).forEach(x=>{d+=up?`H${x-6}A6 6 0 0 1 ${x+6} ${y}`:`H${x+6}A6 6 0 0 0 ${x-6} ${y}`});return `<path class="${cls||'w'}" d="${d}H${x2}"/>`};
const gnd=(x,y)=>`<path d="M${x} ${y}V${y+8}M${x-10} ${y+8}H${x+10}M${x-6} ${y+12}H${x+6}M${x-2} ${y+16}H${x+2}" stroke="var(--fg)" stroke-width="1.6" fill="none"/>`;
const vtag=(x,y,s,a)=>`<text class="txt b" x="${x}" y="${y}" text-anchor="${a||'middle'}" font-size="11.5">${s}</text>`;
const stepGlyph=(x,y,w,h)=>`<path d="M${x} ${y+h}H${x+w*0.35}V${y}H${x+w}" stroke="var(--fg)" stroke-width="1.6" fill="none"/>`;
const pt1Glyph=(x,y,w,h)=>{let d='';for(let i=0;i<=20;i++){const tt=i/20;d+=(i?'L':'M')+fx(x+tt*w)+' '+fx(y+h-(1-Math.exp(-tt*4))*h)}return `<path d="${d}" stroke="var(--fg)" stroke-width="1.6" fill="none"/>`};
const pidGlyph=(x,y,w,h)=>`<path d="M${x} ${y+h}H${x+w*0.15}V${y}L${x+w*0.3} ${y+h*0.55}L${x+w} ${y+h*0.15}" stroke="var(--fg)" stroke-width="1.6" fill="none"/>`;

/* ---- Com3Lab bench, figures (3-1)/(3-4)/(3-6) and (3-3).
   o:{plant:'pt1'|'motor'|'thermal',P,I,D,Kp,run,v:{w,e,y,x},fan,mm,w0} */
function boardSVG(o){o=o||{};const on=!!o.run,v=o.v||{},th=o.plant==='thermal',C=wcls(on);let s=`<svg viewBox="0 0 720 344" role="img" aria-label="توصيل التجربة على لوحة Com3Lab">`;
  /* oscilloscope / multimeter */
  if(!th){s+=pnl(16,14,170,92,'OSCILLOSCOPE')+`<rect x="30" y="28" width="60" height="30" rx="3" fill="var(--surface-2)" stroke="var(--line)"/><path d="M34 52q8-20 16 0t16 0t16-14" stroke="var(--blue)" stroke-width="1.4" fill="none"/>`;
    [['TRIG',34],['⊥',66],['Y1',100],['Y2',134],['COM',168]].forEach(([l,x])=>{s+=sock(x,84,'','')+S.t(x,104,l,'m',null,10)})}
  else{s+=pnl(16,14,170,92,'MULTIMETER 1')+`<rect x="30" y="26" width="100" height="30" rx="3" fill="var(--surface-2)" stroke="var(--line)"/>`+S.t(80,47,o.mm!=null?fm(o.mm,2)+' V':'-- V','b',null,15);
    [['V',40],['A',76],['Ω',112],['COM',160]].forEach(([l,x])=>{s+=sock(x,84,'','')+S.t(x,104,l,'m',null,10)})}
  /* P/I/D switches + Kp */
  const swx=[[ 'P',222,o.P],['I',256,o.I],['D',290,o.D]];s+=pnl(198,14,140,112,'');
  swx.forEach(([l,x,v1])=>{s+=S.t(x,30,l,'',null,12)+`<rect x="${x-6}" y="36" width="12" height="40" rx="6" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.2"/><rect x="${x-9}" y="${v1?37:61}" width="18" height="14" rx="3" fill="var(${v1?'--on':'--muted'})"/>`});
  s+=S.t(322,48,'ON','m','end',9)+S.t(322,74,'OFF','m','end',9);
  const kps=[1,10,50];s+=S.t(210,100,'Kp','',null,11);kps.forEach((k,i)=>{const x=240+i*30,cur=+o.Kp===k;s+=`<circle cx="${x}" cy="96" r="${cur?6:4}" fill="var(${cur?'--blue':'--surface'})" stroke="var(--fg)" stroke-width="1.2"/>`+S.t(x,116,String(k),cur?'b':'m',null,10)});
  if(o.Kp!=null&&!kps.includes(+o.Kp))s+=S.t(268,82,'Kp='+fm(o.Kp),'b',null,10);
  /* plant panel */
  if(o.plant==='motor'){s+=pnl(392,14,312,92,'Speed Control')+sock(412,62,'yS','b')+`<circle cx="466" cy="62" r="16" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/>`+S.t(466,67,'M','',null,13)+`<path d="M482 62H522" stroke="var(--fg)" stroke-dasharray="4 3" fill="none"/>`+rbox(522,46,68,32)+S.t(556,60,'RPM','',null,10)+S.t(556,73,'TTL','',null,10)+rbox(602,46,50,32)+S.t(627,66,'f/u','',null,11)+sock(684,62,'xS','b')+`<path class="w" d="M418 62H450M590 62H602M652 62H678"/>`;
    if(on)s+=`<g transform="translate(466 62)"><path id="clFan" d="M0 -11L3 0L0 11L-3 0Z" fill="var(--blue)" opacity=".5"/></g>`}
  else if(th){s+=pnl(392,14,312,92,'Temperature Control')+sock(412,62,'yT','b')+rbox(450,44,58,36,'--surface-2');for(let i=0;i<6;i++)s+=`<path d="M${458+i*8} 48V76" stroke="var(${on&&v.y>0.05?'--live':'--fg'})" stroke-width="2"/>`;
    s+=`<path d="M508 62H566" stroke="var(--fg)" stroke-dasharray="4 3" fill="none"/>`+rbox(566,42,44,40)+`<path d="M566 82L610 42" stroke="var(--fg)"/>`+S.t(578,58,'ϑ','',null,12)+S.t(600,78,'u','',null,12)+sock(684,62,'xT','b')+`<path class="w" d="M418 62H450M610 62H678"/>`;
    /* fan = disturbance (fig 2-4) */
    s+=`<g transform="translate(476 120)"><circle r="12" fill="var(--surface)" stroke="var(${o.fan?'--blue':'--muted'})" stroke-width="1.6"/><path id="clFan" d="M0 -10L3 0L0 10L-3 0ZM-10 0L0 3L10 0L0 -3Z" fill="var(${o.fan?'--blue':'--muted'})"/></g>`+S.t(500,124,o.fan?'z = 5 V':'z = 0','b','start',11)+(o.fan?`<path d="M470 104V96M482 104V96M476 104V94" stroke="var(--blue)" stroke-width="1.4"/>`:'')}
  else{s+=pnl(392,14,312,92,'PT1')+sock(412,62,'X5','b')+rbox(500,34,100,56)+pt1Glyph(510,42,80,40)+S.t(590,84,'T1','',null,11)+sock(684,62,'X6','b')+`<path class="w" d="M418 62H500M600 62H678"/>`}
  /* function generator + ground */
  s+=pnl(16,214,170,116,'FUNCTION GENERATOR')+`<rect x="30" y="236" width="88" height="34" rx="3" fill="var(--surface-2)" stroke="var(--line)"/>`+stepGlyph(38,244,26,18)+S.t(96,259,fm(o.w0!=null?o.w0:5,1)+'V','b',null,11)+`<circle cx="152" cy="256" r="14" fill="var(--fg)" opacity=".75"/>`;
  [['OUT',50],['SYNC',100],['⊥',150]].forEach(([l,x])=>{s+=sock(x,298,'','')+S.t(x,320,l,'m',null,10)});
  s+=pnl(206,262,60,62,'')+sock(236,280,'','')+gnd(236,294);
  /* analog controller */
  s+=pnl(300,168,404,162,'Analog Controller')+sock(330,250,'w','')+sumC(390,250)+S.t(398,282,'−','',null,14)+sock(390,306,'x','b')+sock(446,250,'e','')+rbox(478,222,104,56)+pidGlyph(490,232,80,36)+sumC(630,250)+sock(630,196,'z','')+sock(684,250,'y','')+
   `<path class="w" d="M336 250H379M401 250H440M452 250H478M582 250H619M641 250H678M390 300V261M630 202V239"/>`;
  /* wiring (red wires = signals; black = ground) */
  s+=`<path class="${C}" d="M50 304V336H330V256"/>`;                                  /* OUT → w */
  s+=`<path class="${C}" d="M684 244V140H412V68"/>`;                                 /* y → plant input */
  s+=`<path class="${C}" d="M690 62H712V318H390V312"/>`;                               /* plant output → x (feedback) */
  if(!th){s+=`<path class="${C}" d="M100 90V160H322V244"/>`;                         /* Y1 → w */
    s+=`<path class="${C}" d="M134 78V6H684V56"/>`}                                  /* Y2 → output */
  else s+=`<path class="${C}" d="M40 78V6H684V56"/>`;                                 /* multimeter V → x_T */
  const comX=th?160:168;s+=`<path d="M${comX} 90V150" stroke="var(--fg)" stroke-width="1.6" fill="none"/>${th?`<path d="M160 150V196H236V274" stroke="var(--fg)" stroke-width="1.6" fill="none"/>`:`<path d="M168 150V154A6 6 0 0 1 168 166V196H236V274" stroke="var(--fg)" stroke-width="1.6" fill="none"/>`}<path d="M150 304V312H200V280H230" stroke="var(--fg)" stroke-width="1.6" fill="none"/>`;
  if(on){s+=vtag(330,232,'w='+fm(v.w,2))+vtag(446,232,'e='+fm(v.e,2))+vtag(684,232,'y='+fm(v.y,2))+vtag(404,322,'x='+fm(v.x,2),'start')}
  return s+'</svg>'}

/* ---- Simulink diagrams, figures (3-2), (3-5), (3-7), (3-8). kind:'P'|'I'|'PI'|'PID'. o:{kp,ki,kd,mux} */
function simulinkSVG(kind,o){o=o||{};const H=kind==='PID'?272:kind==='PI'?236:210,yM=kind==='PID'?132:kind==='PI'?120:110,mux=kind!=='I';const tfw0=kind==='PID'?150:84,tfx0=kind==='PID'?470:kind==='PI'?470:kind==='I'?440:330,Wv=Math.max(720,tfx0+tfw0+30+(mux?40+36+46:40+46)+12);let s=`<svg viewBox="0 0 ${Wv} ${H}" role="img" aria-label="مخطط Simulink للتجربة">`;
  const blk=(x,y,w,h,inner,lab)=>rbox(x,y,w,h)+inner+(lab?S.t(x+w/2,y+h+14,lab,'m',null,10):'');
  const gain=(x,y,txt,lab)=>`<path d="M${x} ${y-18}L${x+44} ${y}L${x} ${y+18}Z" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.5"/>`+S.t(x+16,y+4,txt,'b',null,11)+(lab?S.t(x+22,y+32,lab,'m',null,10):'');
  const frac=(cx,y,n,d)=>S.t(cx,y-5,n,'',null,11)+`<path d="M${cx-38} ${y}H${cx+38}" stroke="var(--fg)"/>`+S.t(cx,y+14,d,'',null,11);
  const tfw=kind==='PID'?150:84,tfx=kind==='PID'?470:kind==='PI'?470:kind==='I'?440:330;
  s+=blk(18,yM-20,44,40,stepGlyph(26,yM-12,28,22),'Step');
  s+=`<path class="w" d="M62 ${yM}H120"/><circle cx="92" cy="${yM}" r="3" fill="var(--fg)"/>`;
  s+=`<rect x="120" y="${yM-22}" width="14" height="44" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.5"/>`+S.t(127,yM-8,'+','',null,11)+S.t(127,yM+16,'−','',null,12)+S.t(127,yM+38,'Add','m',null,10);
  const yF=H-18,xd=tfx+tfw+30;
  if(kind==='P'){s+=arr(134,yM,180,yM)+gain(180,yM,o.kp!=null?fm(o.kp):'kp','Gain')+arr(224,yM,tfx,yM)+blk(tfx,yM-22,tfw,44,frac(tfx+tfw/2,yM,'1','s+1'),'Transfer Fcn')}
  if(kind==='I'){s+=arr(134,yM,170,yM)+gain(170,yM,o.ki!=null?fm(o.ki):'Ki','Gain')+arr(214,yM,280,yM)+blk(280,yM-20,60,40,frac(310,yM,'1','s'),'Integrator')+arr(340,yM,tfx,yM)+blk(tfx,yM-22,tfw,44,frac(tfx+tfw/2,yM,'1','s+1'),'Transfer Fcn')}
  if(kind==='PI'){const y1=yM-50,y2=yM+30;s+=`<path class="w" d="M134 ${yM}H156V${y1}"/><path class="w" d="M156 ${yM}V${y2}"/><circle cx="156" cy="${yM}" r="3" fill="var(--fg)"/>`+arr(156,y1,190,y1)+gain(190,y1,o.kp!=null?fm(o.kp):'Kp','Gain1')+arr(156,y2,190,y2)+gain(190,y2,o.ki!=null?fm(o.ki):'Ki','Gain')+arr(234,y2,280,y2)+blk(280,y2-20,60,40,frac(310,y2,'1','s'),'Integrator');
    s+=`<rect x="390" y="${yM-30}" width="14" height="60" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.5"/>`+S.t(384,yM-14,'+','',null,11)+S.t(384,yM+22,'+','',null,11)+S.t(397,yM+44,'Add1','m',null,10)+parr([[234,y1],[370,y1],[370,yM-16],[390,yM-16]])+parr([[340,y2],[370,y2],[370,yM+16],[390,yM+16]])+arr(404,yM,tfx,yM)+blk(tfx,yM-22,tfw,44,frac(tfx+tfw/2,yM,'1','s+1'),'Transfer Fcn')}
  if(kind==='PID'){const ys=[yM-70,yM,yM+70];s+=`<path class="w" d="M134 ${yM}H156M156 ${ys[0]}V${ys[2]}"/><circle cx="156" cy="${yM}" r="3" fill="var(--fg)"/>`;
    s+=arr(156,ys[0],180,ys[0])+gain(180,ys[0],o.kp!=null?fm(o.kp):'1','Gain')+arr(156,ys[1],180,ys[1])+gain(180,ys[1],o.ki!=null?fm(o.ki):'0.1','Gain1')+arr(156,ys[2],180,ys[2])+gain(180,ys[2],o.kd!=null?fm(o.kd):'0.1','Gain2');
    s+=arr(224,ys[1],270,ys[1])+blk(270,ys[1]-20,60,40,frac(300,ys[1],'1','s'),'Integrator')+arr(224,ys[2],270,ys[2])+blk(270,ys[2]-20,60,40,S.t(300,ys[2]+5,'du/dt','',null,12),'Derivative');
    s+=`<rect x="400" y="${yM-36}" width="14" height="72" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.5"/>`+S.t(397,yM+52,'Add1','m',null,10)+parr([[224,ys[0]],[380,ys[0]],[380,yM-22],[400,yM-22]])+arr(330,ys[1],400,ys[1])+parr([[330,ys[2]],[380,ys[2]],[380,yM+22],[400,yM+22]]);
    s+=arr(414,yM,tfx,yM)+blk(tfx,yM-24,tfw,48,frac(tfx+tfw/2,yM,'21.81','0.0063s²+0.379s+1'),'Transfer Fcn')}
  /* output branch, feedback, Mux, Scope */
  s+=`<path class="w" d="M${tfx+tfw} ${yM}H${xd}"/><circle cx="${xd}" cy="${yM}" r="3" fill="var(--fg)"/>`;
  s+=`<path class="w" d="M${xd} ${yM}V${yF}H127"/>`+arr(127,yF,127,yM+22);
  if(mux){const mx=xd+40;s+=`<path class="w" d="M92 ${yM}V12H${mx-10}V${yM-14}"/>`+arr(mx-10,yM-14,mx,yM-14)+`<path class="w" d="M${xd} ${yM}H${xd+14}V${yM+10}"/>`+arr(xd+14,yM+10,mx,yM+10)+`<rect x="${mx}" y="${yM-28}" width="7" height="56" fill="var(--fg)"/>`+S.t(mx+4,yM+44,'Mux','m',null,10)+arr(mx+7,yM,mx+36,yM)+blk(mx+36,yM-20,46,40,`<rect x="${mx+42}" y="${yM-13}" width="34" height="22" fill="var(--surface-2)" stroke="var(--line)"/>`,'Scope')}
  else s+=arr(xd,yM,xd+40,yM)+blk(xd+40,yM-20,46,40,`<rect x="${xd+46}" y="${yM-13}" width="34" height="22" fill="var(--surface-2)" stroke="var(--line)"/>`,'Scope');
  return s+'</svg>'}

/* ---- Digital control, figures (3-8) ص 41 and (3-9) ص 43. o:{sys:'speed'|'light',run,v:{w,x,y},open} */
function digitalSVG(o){o=o||{};const on=!!o.run,v=o.v||{},C=wcls(on),lt2=o.sys==='light';let s=`<svg viewBox="0 0 720 312" role="img" aria-label="توصيل التحكم الرقمي على لوحة Com3Lab">`;
  s+=pnl(16,14,404,124,'Digital Controller/Line')+arr(26,72,69,72)+S.t(30,64,'w','',null,12)+sumC(80,72)+S.t(92,104,'−','',null,14)+sock(80,122,'x','b')+`<path class="w" d="M80 116V83"/>`;
  s+=arr(91,72,118,72)+rbox(118,54,58,36)+S.t(147,77,'A/D','',null,12)+arr(176,72,198,72)+rbox(198,50,104,44)+S.t(250,77,'Algorithm','',null,12)+arr(302,72,322,72)+rbox(322,54,58,36)+S.t(351,77,'D/A','',null,12)+`<path class="w" d="M380 72H398"/>`+sock(404,72,'y','');
  if(o.open)s+=arT(250,128,'وضع الخط: الحاكم يمرر w كما هو',{fs:11,col:'--muted'});
  s+=pnl(450,14,254,96,'OSCILLOSCOPE');[['TRIG',476],['⊥',520],['Y1',564],['Y2',608],['COM',660]].forEach(([l,x])=>{s+=sock(x,84,'','')+S.t(x,104,l,'m',null,10)});
  s+=pnl(600,128,70,44,'')+sock(620,146,'','')+gnd(646,138);
  if(!lt2){s+=pnl(16,188,688,96,'Speed Control')+sock(44,240,'yS','b')+`<circle cx="130" cy="240" r="18" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.6"/>`+S.t(130,245,'M','',null,14)+`<path d="M148 240H230" stroke="var(--fg)" stroke-dasharray="4 3" fill="none"/>`+rbox(230,222,80,36)+S.t(270,237,'RPM','',null,10)+S.t(270,251,'TTL','',null,10)+rbox(350,222,60,36)+S.t(380,245,'f/u','',null,12)+sock(680,240,'xS','b')+`<path class="w" d="M50 240H112M310 240H350M410 240H674"/>`;
    if(on)s+=`<g transform="translate(130 240)"><path id="clFan" d="M0 -13L3 0L0 13L-3 0Z" fill="var(--blue)" opacity=".5"/></g>`}
  else{const g=on?Math.min(1,Math.max(0,(v.y||0)/10)):0;s+=pnl(16,188,688,96,'Light Control')+sock(44,240,'yL','b')+rbox(150,218,64,44)+`<path d="M168 230L188 240L168 250ZM190 230V250" stroke="var(--fg)" fill="none" stroke-width="1.5"/><circle cx="182" cy="240" r="22" fill="#ffd34d" opacity="${fx(g*0.7)}"/><path d="M196 226l8-8M202 230l8-8" stroke="var(--fg)" stroke-width="1.3"/>`+
    `<path d="M222 240H330" stroke="var(--muted)" stroke-dasharray="2 5" fill="none"/>`+rbox(330,218,64,44)+`<circle cx="362" cy="240" r="13" fill="none" stroke="var(--fg)" stroke-width="1.4"/><path d="M356 232V248M356 236L368 230M356 244L368 250" stroke="var(--fg)" stroke-width="1.4" fill="none"/><path d="M336 224l8 8M342 220l8 8" stroke="var(--fg)" stroke-width="1.3"/>`+sock(680,240,'xL','b')+`<path class="w" d="M50 240H150M394 240H674"/>`}
  /* wires — as in the figure: y → plant input and → Y1 ; plant output → x (feedback) and → Y2 */
  s+=`<path class="${C}" d="M404 78V164H44V234"/>`;
  s+=`<path class="${C}" d="M410 72H430V150H564V90"/>`;
  s+=`<path class="${o.open?'w':C}" d="M680 246V300H8V122H74" ${o.open?'stroke-dasharray="5 5" style="opacity:.5"':''}/>`;
  s+=`<path class="${C}" d="M686 240H712V6H608V78"/>`;
  s+=`<path d="M660 90V146H626" stroke="var(--fg)" stroke-width="1.6" fill="none"/>`;
  if(on)s+=vtag(372,46,'y='+fm(v.y,2))+vtag(36,92,'w='+fm(v.w,2),'start')+vtag(640,268,'x='+fm(v.x,2));
  return s+'</svg>'}

/* ---- generic closed-loop block diagram (theory, added) */
function loopSVG(ctl,plant,o){o=o||{};let s=`<svg viewBox="0 0 640 170" role="img" aria-label="المخطط الصندوقي لنظام تحكم ذي دائرة مغلقة">`;
  s+=arr(10,70,62,70)+S.t(30,62,'w','',null,13)+sumC(74,70)+S.t(86,98,'−','',null,14)+arr(85,70,150,70)+S.t(116,62,'e','',null,13)+rbox(150,44,130,52)+arT(215,64,o.cl||'الحاكم',{fs:12})+S.t(215,84,ctl,'b',null,12);
  if(o.z){s+=sumC(330,70)+arr(330,22,330,59)+S.t(342,30,'z','','start',13)+arr(280,70,319,70)+arr(341,70,390,70)}else s+=arr(280,70,390,70);
  s+=S.t(358,62,'y','',null,13)+rbox(390,44,140,52)+arT(460,64,o.pl||'النظام المتحكم فيه',{fs:12})+S.t(460,84,plant,'b',null,12)+`<path class="w" d="M530 70H600"/>`+arr(600,70,632,70)+S.t(612,62,'x','',null,13)+`<circle cx="580" cy="70" r="3" fill="var(--fg)"/><path class="w" d="M580 70V140H74"/>`+arr(74,140,74,81);
  s+=arT(330,160,'التغذية الراجعة: نقيس الخرج x ونطرحه من القيمة المطلوبة w',{fs:11,col:'--muted'});return s+'</svg>'}

/* ---- oscilloscope screen. o:{r,ch:[{arr,col,lab}],frac,cursor,ghosts:[{pts,lab}],tan,title,fast} */
function scopeSVG(o){const W=560,H=320,L=40,T=12,Wd=W-L-12,Hd=H-T-40,r=o.r,Tw=r?r.Tw:1;const frac=o.frac==null?1:o.frac;
  let vmax=0.1,vmin=0;const scan=a=>{for(let i=0;i<=r.N;i+=4){if(a[i]>vmax)vmax=a[i];if(a[i]<vmin)vmin=a[i]}};
  if(r)o.ch.forEach(c=>scan(c.arr));(o.ghosts||[]).forEach(g=>g.pts.forEach(p=>{vmax=Math.max(vmax,p[1]);vmin=Math.min(vmin,p[1])}));
  const divs=[0.02,0.05,0.1,0.2,0.5,1,2,5,10,20];let d=divs[divs.length-1];for(const q of divs){if(Math.ceil(vmax/q-1e-9)+Math.ceil(-vmin/q-1e-9)<=8){d=q;break}}
  const nb=Math.ceil(-vmin/d-1e-9),y0=-nb*d,y1=y0+8*d;const X=t=>L+t/Tw*Wd,Y=v=>T+Hd-(v-y0)/(y1-y0)*Hd;
  let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${o.title||'شاشة راسم الذبذبات'}"><rect x="${L}" y="${T}" width="${Wd}" height="${Hd}" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.2"/>`;
  for(let i=1;i<10;i++)s+=`<path d="M${fx(L+i*Wd/10)} ${T}V${T+Hd}" stroke="var(--line)"/>`;for(let i=1;i<8;i++)s+=`<path d="M${L} ${fx(T+i*Hd/8)}H${L+Wd}" stroke="var(--line)"/>`;
  if(y0<0)s+=`<path d="M${L} ${fx(Y(0))}H${L+Wd}" stroke="var(--muted)" stroke-dasharray="4 3"/>`;
  for(let i=0;i<=8;i+=2)s+=S.t(L-4,fx(T+Hd-i*Hd/8+4),fm(+(y0+i*d).toPrecision(3)),'m','end',10);
  for(let i=0;i<=10;i+=2)s+=S.t(fx(L+i*Wd/10),T+Hd+14,fm(+(i*Tw/10).toPrecision(3)),'m',null,10);
  s+=S.t(L+Wd,H-6,`t (s)   ${fm(+(Tw/10).toPrecision(3))} s/div   ${fm(d)} V/div`,'m','end',10);
  (o.ghosts||[]).forEach((g,gi)=>{s+=`<path d="${g.pts.map((p,i)=>(i?'L':'M')+fx(X(p[0]))+' '+fx(Y(p[1]))).join('')}" fill="none" stroke="var(${['--muted','--on','--stop','--blue-ink'][gi%4]})" stroke-width="1.6" stroke-dasharray="5 3" opacity=".85"/>`});
  if(r){const n=Math.max(1,Math.round(r.N*frac)),step=Math.max(1,Math.floor(r.N/700));o.ch.forEach(c=>{let p='';for(let i=0;i<=n;i+=step)p+=(i?'L':'M')+fx(X(r.t[i]))+' '+fx(Y(c.arr[i]));p+='L'+fx(X(r.t[n]))+' '+fx(Y(c.arr[n]));s+=`<path d="${p}" fill="none" stroke="var(${c.col})" stroke-width="2.2" stroke-linejoin="round"/>`})}
  if(o.tan&&frac>=1){const g=o.tan;const ta=g.Tu,tb=g.Tu+g.Tg;s+=`<path d="M${fx(X(Math.max(0,ta-0.015*Tw)))} ${fx(Y(g.x00-g.s*0.015*Tw))}L${fx(X(Math.min(Tw,tb+0.015*Tw)))} ${fx(Y(g.xf+g.s*0.015*Tw))}" stroke="var(--stop)" stroke-width="1.6" fill="none"/><path d="M${L} ${fx(Y(g.xf))}H${L+Wd}" stroke="var(--stop)" stroke-dasharray="3 3"/><circle cx="${fx(X(g.ti))}" cy="${fx(Y(g.xi))}" r="4" fill="var(--stop)"/>`+
    `<path d="M${fx(X(ta))} ${T+Hd-10}V${T+Hd}M${fx(X(tb))} ${T+Hd-10}V${T+Hd}" stroke="var(--stop)" stroke-width="2"/>`+S.t(fx((X(0)+X(ta))/2),T+Hd-14,'Tu','',null,11)+S.t(fx((X(ta)+X(tb))/2),T+Hd-14,'Tg','',null,11)+
    `<path d="M${fx(X(0))} ${T+Hd-6}H${fx(X(ta))}M${fx(X(ta))} ${T+Hd-6}H${fx(X(tb))}" stroke="var(--stop)" stroke-width="1"/>`}
  if(o.cursor!=null&&r){const cx=X(o.cursor);s+=`<path d="M${fx(cx)} ${T}V${T+Hd}" stroke="var(--fg)" stroke-width="1" stroke-dasharray="2 2"/>`;o.ch.forEach(c=>{s+=`<circle cx="${fx(cx)}" cy="${fx(Y(at(r,c.arr,o.cursor)))}" r="3.5" fill="var(${c.col})"/>`})}
  return s+'</svg>'}
const legend=(ch,ghosts)=>`<div class="cl-leg">${ch.map(c=>`<span><i style="background:var(${c.col})"></i>${c.lab}</span>`).join('')}${(ghosts||[]).map((g,gi)=>`<span><i style="background:var(${['--muted','--on','--stop','--blue-ink'][gi%4]})"></i>${g.lab}</span>`).join('')}</div>`;

/* ======================================================================
   THE BENCH — one UI for every lab of this unit.
   cfg:{k, tp:{id,defs}|null, parts:[part], steps:ctx=>[...]}
   part:{key,label,ref,figTitle, s0:{}, ctl:[spec], fig(s,P,live)->svg, sim(s,P)->{r,ch,m,tan?,meters?,fast?},
         tables:[{title,head,rows:[{key,l}],match(s)->key|null,cols(mode)->[{h,f(m,s),dp}],modes?,modeNote?}], results?(rec,P)->html, note?}
   ====================================================================== */
function ctrlBench(el,cfg){const k=cfg.k;let pi=0,run=null,frac=1,cur=null,mode='book',ghostOn=true,msg='';
  const st=cfg.parts.map(p=>Object.assign({},p.s0));const rec=cfg.parts.map(p=>(p.tables||[]).map(()=>({})));const ghosts=cfg.parts.map(()=>[]);const did={};
  el.innerHTML=`<div id="${k}tp"></div><div class="grid cl-lab">
   <div class="panel c12"><div class="cl-row" style="margin-top:0"><span class="sub">جزء التجربة:</span>${segHTML(k+'pt',cfg.parts.map((p,i)=>[i,ltK(p.label)]),0)}</div><div id="${k}pn"></div></div>
   <div class="panel c12"><h2 id="${k}fh"></h2><div class="svgbox cl-wide" id="${k}fig" style="max-width:760px;margin-inline:auto"></div><div class="cl-ctl" id="${k}ctl"></div>
    <div class="cl-row"><button class="btn primary" id="${k}run">شغّل التجربة</button><button class="btn" id="${k}rec">سجّل في الجدول</button><button class="btn" id="${k}clr">امسح الجدول</button></div><div id="${k}msg"></div></div>
   <div class="panel c7"><h2 id="${k}sh">راسم الذبذبات</h2><div class="svgbox" id="${k}sc"></div><div id="${k}lg"></div>
    <div class="cl-cur"><span>المؤشر</span><input type="range" id="${k}cu" min="0" max="1000" value="1000" aria-label="موضع مؤشر القراءة على الزمن"><b id="${k}cv"></b></div>
    <div class="cl-row"><button class="sw" id="${k}gh" aria-pressed="true"><span class="knob"></span><b>⟲</b><small>أظهر المنحنيات المسجلة</small></button></div></div>
   <div class="panel c5"><h3 style="font-size:14px;margin:12px 0 0">قياس من المنحنى</h3><div class="cl-meters" id="${k}m"></div><div id="${k}mn"></div></div>
   <div class="panel c12"><h2 id="${k}th">جداول النتائج</h2><div id="${k}tb"></div><div id="${k}res"></div></div>
   <div class="panel c12"><h2>جرّب</h2><ol class="steps" id="${k}st"></ol></div></div>`;
  const $=s=>el.querySelector(s);let steps=null;
  const TP=cfg.tp?B.params($('#'+k+'tp'),cfg.tp.id,cfg.tp.defs,()=>{rec.forEach(a=>a.forEach(o=>Object.keys(o).forEach(x=>delete o[x])));ghosts.forEach(g=>g.length=0);if(cfg.tp.reset)cfg.tp.reset(st,TP.v);msg='<div class="callout">تغيرت أرقام المحاكاة، فمسحنا الجداول: أعد التسجيل.</div>';ctlUI();go()}):{v:{}};
  const ctx={get pi(){return pi},st,rec,did,get run(){return run},get P(){return TP.v},get mode(){return mode},part:()=>cfg.parts[pi]};
  const part=()=>cfg.parts[pi];
  /* controls */
  const ctlUI=()=>{const p=part(),s=st[pi];if(p.prep)p.prep(s,TP.v);$('#'+k+'ctl').innerHTML=(p.ctl||[]).filter(c=>!c.show||c.show(s,TP.v)).map(c=>{const id=`${k}c-${c.k}`;
     if(c.t==='sw')return `<div>${swHTML(id,c.b,c.l,s[c.k])}</div>`;
     if(c.t==='seg')return `<div><span class="cl-l">${ltK(c.l)}</span><div class="cl-row" style="margin-top:0"><div class="seg" role="group">${c.o.map(x=>Array.isArray(x)?x:[x,fm(x)]).map(([v,l])=>`<button data-ck="${c.k}" data-cv="${v}" aria-pressed="${String(v)===String(s[c.k])}">${l}</button>`).join('')}</div>${c.free?`<input class="cl-num" type="number" step="any" id="${id}-n" value="${s[c.k]}" ${c.free.min!=null?`min="${c.free.min}"`:''} ${c.free.max!=null?`max="${c.free.max}"`:''} aria-label="${c.l.replace(/<[^>]+>/g,'')}">`:''}</div></div>`;
     if(c.t==='num')return `<div><span class="cl-l">${ltK(c.l)}</span><input class="cl-num" type="number" step="any" id="${id}" value="${fm(s[c.k],4)}" ${c.min!=null?`min="${c.min}"`:''} ${c.max!=null?`max="${c.max}"`:''} aria-label="${c.l.replace(/<[^>]+>/g,'')}"></div>`;
     if(c.t==='btn')return `<div><button class="btn" id="${id}">${c.l}</button></div>`;
     if(c.t==='sl')return `<label class="cl-sl"><span class="cl-h"><span>${c.l}</span><b id="${id}-v">${fm(s[c.k])} ${c.u||''}</b></span><input type="range" id="${id}" min="${c.min}" max="${c.max}" step="${c.step}" value="${s[c.k]}"></label>`;
     return ''}).join('')+(p.ctlNote?`<p class="sub" style="flex-basis:100%;margin:0">${ltK(typeof p.ctlNote==='function'?p.ctlNote(s,TP.v):p.ctlNote)}</p>`:'');
    (p.ctl||[]).forEach(c=>{const id=`${k}c-${c.k}`;const set=v=>{s[c.k]=v;did['set-'+p.key+'-'+c.k+'-'+v]=1;if(c.on)c.on(s,v,TP.v);msg='';ctlUI();go()};
     if(c.t==='sw'){const b=$('#'+id);if(b)b.onclick=()=>set(!s[c.k])}
     if(c.t==='seg'){$('#'+k+'ctl').querySelectorAll(`[data-ck="${c.k}"]`).forEach(b=>b.onclick=()=>{const raw=b.dataset.cv;set(raw==='true'?true:raw==='false'?false:isNaN(+raw)?raw:+raw)});
       const n=$('#'+id+'-n');if(n)n.onchange=()=>{let v=+n.value;if(!isFinite(v)){n.value=s[c.k];return}v=clamp(v,c.free.min,c.free.max);set(v)}}
     if(c.t==='num'){const n=$('#'+id);if(n)n.onchange=()=>{let v=+n.value;if(!isFinite(v)){n.value=fm(s[c.k],4);return}set(clamp(v,c.min,c.max))}}
     if(c.t==='btn'){const b=$('#'+id);if(b)b.onclick=()=>{c.on(s,null,TP.v);did['btn-'+p.key+'-'+c.k]=1;msg='';ctlUI();go()}}
     if(c.t==='sl'){const r=$('#'+id);if(r)r.oninput=()=>{s[c.k]=+r.value;$('#'+id+'-v').textContent=fm(s[c.k])+' '+(c.u||'')};if(r)r.onchange=()=>set(+r.value)}})};
  const live=()=>{if(!run)return null;const r=run.r,tt=frac*r.Tw;const w=at(r,r.w,tt),x=at(r,r.x,tt),y=r.u?at(r,r.u,tt):0;return {w,x,y,e:w-x,t:tt}};
  const drawFig=()=>{const p=part();$('#'+k+'fig').innerHTML=p.fig(st[pi],TP.v,live(),run)};
  const drawScope=()=>{if(!run){$('#'+k+'sc').innerHTML=scopeSVG({ch:[]});return}const g=ghostOn?ghosts[pi]:[];
    $('#'+k+'sc').innerHTML=scopeSVG({r:run.r,ch:run.ch,frac,cursor:frac>=1?cur:null,ghosts:g,tan:run.tan});
    if(frac>=1&&cur!=null){$('#'+k+'cv').innerHTML=`t = ${fm(cur,tdp(run.r.Tw))} s · `+run.ch.map(c=>`${c.short||c.lab}: ${fm(at(run.r,c.arr,cur),3)} V`).join(' · ')}else $('#'+k+'cv').textContent=frac<1?'…':''};
  const drawMeters=()=>{if(!run)return;const ms=run.meters||[];$('#'+k+'m').innerHTML=frac<1?'<p class="sub">ينتهي الرسم ثم تظهر القياسات…</p>':ms.map(([a,b,bad])=>`<div class="cl-meter${bad?' bad':''}"><span>${B.ltrU(ltK(a))}</span><b>${b}</b></div>`).join('');$('#'+k+'mn').innerHTML=frac>=1&&run.note?`<div class="callout" style="font-size:13.5px">${run.note}</div>`:''};
  const drawTables=()=>{const p=part();const tabs=p.tables||[];
    $('#'+k+'tb').innerHTML=tabs.map((tb,ti)=>{const cols=tb.cols(mode,TP.v);const mk=tb.match(st[pi],TP.v);
      return `<h3 style="font-size:15px;margin:14px 0 4px">${tb.title}</h3>${tb.modes?`<div class="cl-row" style="margin-top:4px"><span class="sub">رؤوس الأعمدة:</span>${segHTML(k+'md'+ti,[['book','كما في الكتاب'],['fixed','المصحح']],mode)}</div>${tb.modeNote?`<div class="callout${mode==='book'?' err':''}">${tb.modeNote(mode)}</div>`:''}`:''}
       <div class="cl-tbl"><table class="cl-bt"><thead><tr><th>${tb.head}</th>${cols.map(c=>`<th>${c.h}</th>`).join('')}</tr></thead><tbody>${tb.rows.map(rw=>{const m=rec[pi][ti][rw.key];return `<tr class="${mk===rw.key?'cur':''}"><th>${ltK(rw.l)}</th>${cols.map(c=>{if(!m)return '<td></td>';const v=c.f(m.m,m.s);return `<td>${typeof v==='number'?(isFinite(v)?fm(v,c.dp):'—'):v}</td>`}).join('')}</tr>`}).join('')}</tbody></table></div>${tb.foot?`<p class="sub">${tb.foot}</p>`:''}`}).join('')||'<p class="sub">لا يطلب الكتاب جدولاً في هذا الجزء: ارسم الاستجابة وقارن المنحنيات.</p>';
    tabs.forEach((tb,ti)=>{if(tb.modes)el.querySelectorAll(`[data-${k}md${ti}]`).forEach(b=>b.onclick=()=>{mode=b.dataset[k+'md'+ti];did['md'+mode]=1;drawTables()})});
    $('#'+k+'res').innerHTML=p.results?ltK(p.results(rec[pi],TP.v,ctx)||''):'';B.math($('#'+k+'res'));B.math($('#'+k+'tb'))};
  const drawAll=()=>{const p=part();$('#'+k+'fh').innerHTML=B.ltrU(ltK(`${p.figTitle} <small>${p.ref||''}</small>`));$('#'+k+'pn').innerHTML=p.note?`<p class="sub" style="margin:8px 0 0">${B.ltrU(ltK(typeof p.note==='function'?p.note(TP.v):p.note))}</p>`:'';
    $('#'+k+'sh').innerHTML=(p.scopeTitle||'راسم الذبذبات')+(run&&run.fast?` <small>العرض مسرّع ${fm(run.fast)} مرة</small>`:'');
    $('#'+k+'lg').innerHTML=run?legend(run.ch,ghostOn?ghosts[pi]:[]):'';$('#'+k+'msg').innerHTML=B.ltrU(ltK(msg));drawFig();drawScope();drawMeters();drawTables()};
  const go=()=>{const p=part();run=p.sim(st[pi],TP.v);frac=0;cur=run.r.Tw;$('#'+k+'cu').value=1000;run.sweep=clamp(run.r.Tw,1.2,run.fastSweep||3);if(run.r.Tw>run.sweep*3)run.fast=Math.round(run.r.Tw/run.sweep);did['run-'+p.key]=1;drawAll()};
  loopOn(el,dt=>{if(run&&frac<1){frac=Math.min(1,frac+dt/run.sweep);drawFig();drawScope();if(frac>=1){drawMeters();if(steps)steps.check()}}
    const f=el.querySelector('#clFan');if(f&&run){const rr=live();const sp=part().fanSpeed?part().fanSpeed(st[pi],rr):0;if(sp){ctx.ang=((ctx.ang||0)+dt*sp)%360;f.setAttribute('transform',`rotate(${fx(ctx.ang)})`)}}});
  el.addEventListener('click',e=>{const b=e.target.closest(`[data-${k}pt]`);if(b){pi=+b.dataset[k+'pt'];segSet(el,k+'pt',pi);msg='';did['part-'+part().key]=1;ctlUI();go()}});
  $('#'+k+'run').onclick=()=>{msg='';go()};
  $('#'+k+'cu').oninput=e=>{if(!run)return;cur=+e.target.value/1000*run.r.Tw;did['cursor']=1;drawScope()};
  $('#'+k+'gh').onclick=()=>{ghostOn=!ghostOn;$('#'+k+'gh').setAttribute('aria-pressed',String(ghostOn));drawAll()};
  $('#'+k+'clr').onclick=()=>{rec[pi].forEach(o=>Object.keys(o).forEach(x=>delete o[x]));ghosts[pi].length=0;msg='';drawAll()};
  $('#'+k+'rec').onclick=()=>{const p=part();if(!run||frac<1){msg='<div class="callout err">انتظر حتى ينتهي رسم المنحنى ثم سجّل.</div>';drawAll();return}
    const tabs=p.tables||[];let hit=[];tabs.forEach((tb,ti)=>{const key=tb.match(st[pi],TP.v);if(key!=null){rec[pi][ti][key]={m:run.m,s:Object.assign({},st[pi])};hit.push(tb.rows.find(r=>r.key===key).l);did['rec-'+p.key+'-'+ti+'-'+key]=1}});
    const gl=p.ghostLabel?p.ghostLabel(st[pi]):null;if(gl){const step=Math.max(1,Math.floor(run.r.N/300)),pts=[];const a=run.ch[run.ch.length-1].arr;for(let i=0;i<=run.r.N;i+=step)pts.push([run.r.t[i],a[i]]);
      const old=ghosts[pi].findIndex(g=>g.lab===gl);if(old>=0)ghosts[pi].splice(old,1);ghosts[pi].push({lab:gl,pts});if(ghosts[pi].length>4)ghosts[pi].shift();did['ghost-'+p.key]=(did['ghost-'+p.key]||0)+1}
    msg=hit.length?`<div class="callout">سُجّلت القياسات في: ${hit.map(h=>`<b>${h}</b>`).join('، ')}.</div>`:(tabs.length?`<div class="callout err">${p.noMatch||'هذه الإعدادات ليست صفاً من صفوف الجدول.'}</div>`:'<div class="callout">حُفظ المنحنى للمقارنة على الشاشة.</div>');
    drawAll();if(steps)steps.check()};
  ctlUI();steps=stepsUI($('#'+k+'st'),cfg.steps(ctx));go();
  return {TP,ctx}}

/* ======================================================================
   Shared pieces of the analog-board experiments (lessons 1–3)
   ====================================================================== */
const AN_DEFS=()=>[
  {k:'K1',label:'كسب لوحة PT1',unit:'',value:1,min:0.1,max:5,step:0.01},
  {k:'T1',label:'الثابت الزمني للوحة PT1 (T<sub>1</sub>)',unit:'s',value:1,min:0.05,max:20,step:0.01},
  {k:'Km',label:'كسب محرك التيار المستمر (جهد السرعة ÷ جهد الدخل)',unit:'',value:0.8,min:0.1,max:5,step:0.01},
  {k:'Tm',label:'ثابت زمن التسارع (يكبر مع ثقل العضو الدوار)',unit:'s',value:0.6,min:0.05,max:20,step:0.01},
  {k:'Um',label:'أعلى جهد يخرجه الحاكم (حد الإشباع ±)',unit:'V',value:10,min:1,max:50,step:0.5}];
const TH_DEFS=()=>[
  {k:'Kt',label:'كسب النظام الحراري (≈ ميل الخط في الشكل 2-6)',unit:'',value:0.85,min:0.1,max:3,step:0.01},
  {k:'amb',label:'خرج الحساس x<sub>T</sub> قبل التسخين (≈ امتداد خط الشكل 2-6)',unit:'V',value:3.9,min:0,max:8,step:0.1},
  {k:'Tth',label:'الثابت الزمني للنظام الحراري',unit:'s',value:40,min:5,max:300,step:1},
  {k:'Tdl',label:'زمن التأخير في بداية التسخين',unit:'s',value:4,min:0.2,max:40,step:0.1},
  {k:'dz',label:'انخفاض الخرج بسبب المروحة (5 V) في الحلقة المفتوحة',unit:'V',value:1.5,min:0,max:5,step:0.1}];
const PLN={pt1:'PT1',motor:'محرك'};
const plantOf=(s,P)=>s.plant==='motor'?PLANT.pt1(P.Km,P.Tm):PLANT.pt1(P.K1,P.T1);
const gainOf=(s,P)=>s.plant==='motor'?P.Km:P.K1;
const umax=r=>{let m=0;for(let i=0;i<=r.N;i++)m=Math.max(m,Math.abs(r.u[i]));return m};
const CH_B=r=>[{arr:r.w,col:'--live',lab:'Y1 = w (الدخل المرجعي)',short:'Y1'},{arr:r.x,col:'--blue',lab:'Y2 = x (الخرج)',short:'Y2'}];
const CH_M=r=>[{arr:r.w,col:'--live',lab:'المدخل 1 للـ Mux: Step',short:'Step'},{arr:r.x,col:'--blue',lab:'المدخل 2 للـ Mux: الخرج',short:'الخرج'}];
const CH_S=r=>[{arr:r.x,col:'--blue',lab:'الخرج (Scope)',short:'الخرج'}];
const tF=v=>v==null?'—':Math.abs(v)<0.01?fm(v,4):Math.abs(v)<1?fm(v,3):Math.abs(v)<50?fm(v,2):fm(v,1);
const MPV=m=>m.Mp>0?`${fm(m.Mp,3)} (${fm(m.MpP,1)}%)`:'0';
const TPV=m=>m.tp==null?'—':tF(m.tp);
const TSV=m=>m.osc?'لا يستقر':m.ts>m.Tw*1.0001?`> ${fm(m.Tw)}`:tF(m.ts);
const satNote=(r,P)=>umax(r)>=P.Um*0.999?`<b>لاحظ:</b> طلب الحاكم في البداية أكبر من ${lt(fm(P.Um)+' V')} فبقي خرجه عند حدّه (إشباع). لهذا لا يصبح النظام على اللوحة أسرع بقدر زيادة K<sub>p</sub>؛ أما في Simulink فلا حد للإشارة.`:'';
const ctlPID=()=>[{k:'P',t:'sw',b:'P',l:'التناسبي'},{k:'I',t:'sw',b:'I',l:'التكاملي'},{k:'D',t:'sw',b:'D',l:'التفاضلي'}];
const ctlPlant={k:'plant',t:'seg',l:'النظام المتحكم فيه',o:[['pt1','لوحة PT1'],['motor','محرك التيار المستمر']]};
const ampCtl={k:'amp',t:'seg',l:'القيمة النهائية لكتلة Step',o:[[1,'1 (الافتراضية)'],[5,'5']]};
const dNote=s=>s.D?'<span style="color:var(--stop)">المفتاح D لا تستعمله تجارب اللوحة؛ الجزء التفاضلي تدرسه بالمحاكاة في التجربة الرابعة (الدرس 3.4)، لذلك لا يؤثر هنا.</span>':'';
/* board run (analog controller, Y1 = w, Y2 = x) */
function boardRun(s,P,Tw,KI){const r=simLoop({plant:plantOf(s,P),Tw,w0:5,sat:[-P.Um,P.Um],ctrl:{type:'analog',P:s.P,I:s.I,Kp:s.Kp,KI:KI}});const m=measure(r);return {r,m,ch:CH_B(r)}}
const boardFig=(s,P,v,run)=>boardSVG({plant:s.plant,P:s.P,I:s.I,D:s.D,Kp:s.P?s.Kp:null,run:!!v,v:v?{w:v.w,e:v.e,y:v.y,x:v.x}:{},w0:5});
const motorSpin=(s,v)=>s.plant==='motor'&&v?v.x*260:0;

/* ======================================================================
   Lesson 1 — the proportional controller (ص 21–26)
   ====================================================================== */
B.lesson({
 id:'u3-l1',unit:3,order:1,pages:'21–26',
 title:'التجربة الأولى: الحاكم التناسبي P- Controller',
 summary:'نغلق الحلقة على لوحة Com3Lab: نوصل نظاماً من الرتبة الأولى بالحاكم التماثلي، ونغيّر K<sub>p</sub> (1 ثم 10 ثم 50) فنقيس الخرج المستقر والخطأ وزمن الاستقرار، ثم نعيد التجربة بـ Simulink، ثم مع النظام الحراري لنرى كيف تقلل الحلقة المغلقة أثر التشويش.',
 theory:[
  {h:'الوحدة الثالثة: تحليل الاستجابة الزمنية لبعض الأنظمة الصناعية ذات الدائرة المغلقة',ref:'ص 21',html:String.raw`<p>في الوحدة الثانية وصلنا إشارة الخطوة إلى النظام مباشرة (دائرة مفتوحة). في هذه الوحدة نضيف <b>حاكماً</b> ونعيد خرج النظام إليه (دائرة مغلقة)، في ست تجارب: الحاكم التناسبي P، والحاكم التكاملي I، والحاكم التناسبي التكاملي PI، والحاكم PID بالمحاكاة، ثم التحكم الرقمي في سرعة محرك وفي الإضاءة.</p><p class="sub">صفحة الوحدة ص 21 عنوان فقط: لا أهداف ولا شرح نظري للوحدة.</p>`},
  {h:'لوحة الحاكم التماثلي «Analog Controller»',ref:'ص 23',html:String.raw`<p>تتكرر هذه اللوحة في التجارب الأربع الأولى من الوحدة. عليها: المقبس <b>w</b> (القيمة المطلوبة) ← دائرة جمع لها مدخل سالب «−» يأتي من المقبس <b>x</b> (القيمة الفعلية = التغذية الراجعة) ← المقبس <b>e</b> (الخطأ) ← صندوق الحاكم ← دائرة جمع ثانية يدخلها المقبس <b>z</b> (التشويش) ← المقبس <b>y</b> (إشارة التحكم = خرج الحاكم).</p><p>وبجانبها لوحة صغيرة لمفاتيح الحاكم: ثلاثة مفاتيح <b>P</b> و<b>I</b> و<b>D</b> بموضعين <span class="ltr">ON / OFF</span>، وتحتها منزلق <b>\(K_p\)</b> بثلاث قيم <span class="ltr">1 ، 10 ، 50</span>.</p>`},
  {h:'الهدف من التجربة',ref:'ص 22',html:String.raw`<p>أن يتعرف المتدرب من خلال هذه التجربة على ما يلي:</p><ul><li>الأجهزة المستخدمة في مختبر التحكم Com3Lab.</li><li>الحاكم التناسبي وتأثيره على نظام من الرتبة الأولى.</li><li>تأثيره على الخطأ \(e\) وعلى زمن الاستقرار \(t_s\).</li></ul>`},
  {h:'الأجهزة والمكونات',ref:'ص 22',html:String.raw`<ul><li>مصدر التغذية (Power Supply).</li><li>الكارت الإلكتروني.</li><li>مولد إشارة Function Generator.</li><li>نظام من الرتبة الأولى (محرك تيار مستمر، نظام الإضاءة).</li></ul>`},
  {h:'ما الدائرة المغلقة؟',html:String.raw`<div class="callout">${ADD}في الدائرة المغلقة نقيس الخرج \(x\) باستمرار ونقارنه بالقيمة المطلوبة \(w\). الفرق هو <b>الخطأ</b>:</div>$$e = w - x$$<p>والحاكم يحوّل الخطأ إلى إشارة تحكم \(y\) تدخل النظام. إذا نقص الخرج عن المطلوب كبر الخطأ فزاد الحاكم إشارته، وإذا زاد الخرج صغر الخطأ فخفّض الحاكم إشارته. هذا هو معنى «التغذية الراجعة السالبة»: الإشارة السالبة على دائرة الجمع.</p>`},
  {fig:'',caption:'المخطط الصندوقي لحلقة التحكم (توضيح للمتدرب — ليس من الكتاب). z تشويش يدخل بعد الحاكم كما في لوحة Analog Controller.',draw:()=>box(loopSVG('y = Kp·e','K/(T·s+1)',{z:1}),640)},
  {h:'الحاكم التناسبي ونظام الرتبة الأولى',html:String.raw`<div class="callout">${ADD}الحاكم التناسبي يضرب الخطأ في ثابت:</div>$$y = K_p\,e$$<p>والنظام من الرتبة الأولى (لوحة PT1 أو المحرك) دالته \(G(s)=\dfrac{K}{T s+1}\): \(K\) كسبه و\(T\) ثابته الزمني (الزمن الذي يبلغ فيه الخرج 63.2 % من قيمته النهائية). عند غلق الحلقة يصبح:</p>$$x_0 = \frac{K K_p}{1+K K_p}\,w_0 \qquad e = w_0-x_0=\frac{w_0}{1+K K_p}$$$$T' = \frac{T}{1+K K_p} \qquad t_s \approx 4\,T' \;\;(\pm 2\%)$$<ul><li>كلما زاد \(K_p\) <b>قلّ الخطأ</b>، لكنه <b>لا يصبح صفراً أبداً</b> مع الحاكم التناسبي وحده (يلزمه خطأ ليعمل).</li><li>كلما زاد \(K_p\) <b>قصر زمن الاستقرار</b> لأن الثابت الزمني للحلقة \(T'\) يصغر.</li><li>في الجهاز الحقيقي خرج الحاكم محدود (لا يتجاوز جهد التغذية)، فإذا طلب الحاكم أكثر من ذلك «يتشبع» ولا يسرع النظام أكثر. وفي أنظمة فيها تأخير (مثل النظام الحراري) يؤدي \(K_p\) الكبير جداً إلى <b>التذبذب</b>.</li></ul><p class="sub">مثال: \(K=1,\; K_p=10,\; w_0=5\ \text{V} \;\Rightarrow\; e = 5/11 \approx 0.455\ \text{V}\)</p>`},
  {h:'زمن الاستقرار \\(t_s\\)',html:String.raw`<div class="callout">${ADD}الكتاب يطلب \(t_s\) دون تعريف. نعرّفه هنا: هو الزمن من لحظة الخطوة حتى يدخل الخرج شريطاً عرضه ±2 % حول قيمته النهائية ولا يخرج منه بعد ذلك. (بعض المراجع تستعمل ±5 %.) في المختبر يُحسب بهذا التعريف من المنحنى، ويمكنك قراءته بنفسك بالمؤشر.</div>`},
  {h:'خطوات إجراء التجربة',ref:'ص 22–23',html:String.raw`<ol><li>شغل لوحة العمليات.</li><li>قم بتوصيل الأجهزة كما في الشكل (3-1). (ممكن استخدام محرك التيار المستمر عوضاً عن PT1.)</li><li>قبل تشغيل التجربة اطلب من المدرب مراجعة التوصيل.</li><li>قم بتشغيل التجربة وارسم إشارتي القناتين \(Y_1\) و\(Y_2\) لخطوة \(w_0 = 5\ \text{v}\) وخلال زمن \(5\ \text{s}\).</li><li>غيّر الثابت التناسبي \(K_p\) (1 ثم 10 ثم 50) وأكمل الجدول لكل قيمة لـ \(K_p\).</li></ol>`},
  {fig:'(3-1)',ref:'ص 23',caption:'توصيل التجربة (مبسّط عن لقطة Com3Lab): OUT المولد ← w؛ y (خرج الحاكم) ← X<sub>5</sub> (دخل PT1)؛ X<sub>6</sub> (خرج PT1) ← x (تغذية راجعة على الحافة اليمنى وأسفل اللوحة)؛ Y1 ← w (الدخل)، Y2 ← X<sub>6</sub> (الخرج)؛ COM و⊥ المولد ← الأرضي.',draw:()=>box(boardSVG({plant:'pt1',P:1,Kp:1,w0:5}),760,1)},
  {h:'تسجيل النتائج',ref:'ص 23',html:`<p>سجل نتائج التجربة في الجدول التالي:</p>${ptable(['معامل الحاكم التناسبي K<sub>p</sub>','قيمة الخرج x<sub>0</sub> (v)','زمن الاستقرار t<sub>s</sub> (s)','أحسب الخطأ e = w<sub>0</sub> – x<sub>0</sub> (v)'],['K<sub>p</sub> = 1','K<sub>p</sub> = 10','K<sub>p</sub> = 50'])}<p>ماذا تلاحظ؟ …………</p>`},
  {h:'الجزء الثاني: Simulink',ref:'ص 24',html:String.raw`<p>أعد التجربة باستخدام <b>Simulink</b> شكل (3-2) واستخدام نفس القيم للمعامل التناسبي \(k_p\) المبينة في الجدول.</p>`},
  {fig:'(3-2)',ref:'ص 24',caption:'مخطط التجربة: Step ← Add (+ و −) ← Gain (kp) ← Transfer Fcn 1/(s+1) ← Mux ← Scope، مع تغذية راجعة وحدية سالبة من الخرج إلى المدخل «−» في Add، وفرع من Step إلى المدخل الأول لـ Mux.',draw:()=>box(simulinkSVG('P'),760,1)},
  {html:`${ptable(['معامل الحاكم التناسبي K<sub>p</sub>','قيمة الخرج x<sub>0</sub> (v)','زمن الاستقرار t<sub>s</sub> (s)','أحسب الخطأ e = w<sub>0</sub> – x<sub>0</sub> (v)'],['K<sub>p</sub> = 1','K<sub>p</sub> = 10','K<sub>p</sub> = 50'])}<p>قارن النتائج التي توصلت إليها باستخدام اللوحة والنتائج التي توصلت إليها باستخدام <b>Simulink</b> …………</p>`},
  {note:String.raw`${ADD}كتلة Step في Simulink قيمتها النهائية الافتراضية 1. لكي تقارن بالخطوة \(5\ \text{V}\) على اللوحة اكتب في إعدادات الكتلة <span class="ltr">Final value = 5</span>؛ وإن تركتها 1 فكل قيم الخرج والخطأ تُقسم على 5. الكتاب لا يذكر ذلك.`},
  {h:'الجزء الثالث: الحاكم التناسبي مع النظام الحراري',ref:'ص 25',html:String.raw`<p>أعد التجربة مع النظام الحراري بخطوة \(7\ \text{v}\) وخلال زمن \(200\ \text{s}\) حسب التوصيل شكل (3-3).</p>`},
  {fig:'(3-3)',ref:'ص 25',caption:'توصيل التجربة (مبسّط): OUT المولد ← w؛ y ← y<sub>T</sub> (دخل السخان)؛ x<sub>T</sub> ← x (تغذية راجعة) وكذلك ← MULTIMETER V؛ الأرضي. المروحة (التشويش z) فوق عنصر التسخين كما في الشكل (2-4). وفي الشكل مربع للتعبئة: «ϑ = 60° ⇐ w = … V».',draw:()=>box(boardSVG({plant:'thermal',P:1,Kp:1,w0:7}),760,1)},
  {h:'تسجيل النتائج',ref:'ص 25',html:String.raw`<p>بدون تشويش: \(Z = 0\ \text{v}\) استقر الخرج على القيمة: \(X_0 = \dots\ \text{v}\)</p><p>بوجود تشويش: \(Z = 5\ \text{v}\) استقر الخرج على: \(X_{01} = \dots\ \text{v}\)</p><ul><li>قارن بين القيمتين، ماذا تستنتج؟</li><li>هل يتأثر النظام ذو الدائرة المغلقة بالتشويش؟</li><li>لماذا لم يتأثر الخرج بالتشويش في التحكم بالدائرة المغلقة مثلما تأثر به في الدائرة المفتوحة؟</li></ul>`},
  {h:'التشويش في الدائرة المغلقة',html:String.raw`<div class="callout">${ADD}المروحة تبرّد عنصر التسخين فتخفض الخرج. في الدائرة المفتوحة (التجربة الأولى من الوحدة الثانية) لا أحد «يلاحظ» هذا الانخفاض، فيبقى كله في الخرج. في الدائرة المغلقة يرى الحاكم الخرج ينخفض، فيكبر الخطأ ويزيد تسخينه، فيعوّض معظم الانخفاض:</div>$$\Delta X_{\text{مغلقة}} \approx \frac{\Delta X_{\text{مفتوحة}}}{1+K\,K_p}$$<p>مع الحاكم التناسبي وحده يبقى جزء صغير من الانخفاض (يصغر كلما زاد \(K_p\))؛ ولا يزول كله إلا بإضافة الجزء التكاملي (التجربتان التاليتان).</p>`},
  {h:'أسئلة ومناقشة',ref:'ص 26',html:
   Q(1,'ارسم المخطط الصندوقي للتجربة (نكتفي بنظام واحد).','w ← دائرة جمع (− من x) ← e ← الحاكم \\(K_p\\) ← y ← النظام \\(\\frac{K}{Ts+1}\\) (لوحة PT1) ← x، ومن x خط راجع إلى المدخل السالب لدائرة الجمع. انظر المخطط الصندوقي أعلى الصفحة.')+
   Q(2,'كيف يؤثر الحاكم التناسبي على الخطأ؟','يقلل الخطأ المستقر: \\(e = \\frac{w_0}{1+K K_p}\\)؛ كلما زاد \\(K_p\\) صغر الخطأ، لكنه لا يصل إلى الصفر.')+
   Q(3,'كيف يؤثر الحاكم التناسبي على زمن الاستقرار؟','زيادة \\(K_p\\) تجعل الاستجابة أسرع فيقصر زمن الاستقرار (الثابت الزمني للحلقة \\(T/(1+K K_p)\\))، حتى يصل خرج الحاكم إلى حدّه (إشباع) فلا يقصر بعد ذلك كثيراً.')+
   Q(4,'إلى ماذا تؤدي الزيادة المفرطة في المعامل التناسبي \\(K_p\\)؟','إلى إشارة تحكم كبيرة جداً تتشبع عند حد الجهاز، وفي الأنظمة التي فيها تأخير (مثل النظام الحراري) إلى تعدٍّ وتذبذب قد لا يتوقف، أي يفقد النظام استقراره.')+
   Q(5,'ماذا تستخلص من هذه التجربة؟','الحلقة المغلقة مع حاكم تناسبي تجعل الخرج يقترب من القيمة المطلوبة ويسرع الاستجابة ويقلل أثر التشويش، لكن يبقى خطأ مستقر، ولا يجوز رفع \\(K_p\\) بلا حد.')+
   Q(6,'ما تأثير التشويش على الدائرة المغلقة؟','أثره أصغر بكثير من الدائرة المفتوحة: الحاكم يعوّض معظمه، فيقسم الانخفاض تقريباً على \\(1+K K_p\\). مع P وحده يبقى أثر صغير.')},
  {err:String.raw`<ul style="margin:4px 0 0;padding-inline-start:18px"><li>السؤال «لماذا لم يتأثر الخرج بالتشويش في الدائرة المغلقة» يفترض أن الخرج لا يتأثر إطلاقاً؛ مع الحاكم التناسبي وحده يتأثر قليلاً (يقل الأثر ولا يزول)، وهذا ما تراه في المختبر.</li><li>لا يحدد الكتاب \(K_p\) في الجزء الثالث (النظام الحراري)، ولا القيمة النهائية لكتلة Step في Simulink، ولا قيمة w المقابلة لـ \(\vartheta = 60^\circ\) في المربع البرتقالي.</li><li>غلاف الوحدة يكتب «النظم» والفهرس «الأنظمة». وصُححت في النص كلمة «غير .الثابت» (نقطة في غير موضعها).</li></ul>`}
 ],
 lab:(el)=>{
  const ch1=[1,10,50];
  ctrlBench(el,{k:'la',tp:{id:'u3-l1',defs:AN_DEFS().concat(TH_DEFS())},
   parts:[
    {key:'board',label:'1) اللوحة مع PT1',figTitle:'الشكل (3-1): توصيل التجربة',ref:'ص 23',s0:{plant:'pt1',P:true,I:false,D:false,Kp:1},
     ctl:[ctlPlant,...ctlPID(),{k:'Kp',t:'seg',l:'K<sub>p</sub> على منزلق اللوحة',o:ch1}],
     ctlNote:s=>(!s.P&&!s.I?'<span style="color:var(--stop)">P و I مفصولان: خرج الحاكم صفر، فلا يتحرك النظام.</span> ':'')+(s.I?'المفتاح I موصول: صار الحاكم PI (التجربة الثالثة). افصله لتجربة P وحده. ':'')+dNote(s),
     fig:boardFig,fanSpeed:motorSpin,
     sim:(s,P)=>{const o=boardRun(s,P,5,1);const m=o.m;o.meters=[['x<sub>0</sub> عند <span class="ltr">5 s</span>',fm(m.x0,3)+' V'],['e = w<sub>0</sub> − x<sub>0</sub>',fm(m.e,3)+' V'],['زمن الاستقرار t<sub>s</sub>',TSV(m)+' s',m.ts>m.Tw],['أكبر إشارة تحكم y',fm(umax(o.r),2)+' V',umax(o.r)>=P.Um*0.999]];o.note=satNote(o.r,P);return o},
     tables:[{title:'جدول النتائج (ص 23) — على اللوحة',head:'K<sub>p</sub>',rows:ch1.map(v=>({key:'k'+v,l:'K<sub>p</sub> = '+v})),match:s=>s.P&&!s.I&&ch1.includes(s.Kp)?'k'+s.Kp:null,
       cols:(md,P)=>[{h:'x<sub>0</sub> (V)',f:m=>m.x0,dp:3},{h:'t<sub>s</sub> (s)',f:m=>TSV(m)},{h:'e = w<sub>0</sub> − x<sub>0</sub> (V)',f:m=>m.e,dp:3},{h:'إضافة: e المتوقع w<sub>0</sub>/(1+K·K<sub>p</sub>)',f:(m,s)=>5/(1+gainOf(s,P)*s.Kp),dp:3},{h:'النظام',f:(m,s)=>PLN[s.plant]}]}],
     noMatch:'الجدول لـ P وحده (I مفصول) عند K<sub>p</sub> = 1 أو 10 أو 50.',
     results:(rc,P)=>{const r=rc[0];const ks=ch1.filter(v=>r['k'+v]);if(ks.length<3)return '';const sat=r.k50&&r.k10&&r.k50.m.ts>r.k10.m.ts*0.6;return `<div class="callout"><b>ماذا تلاحظ؟</b> كلما زاد K<sub>p</sub> صغر الخطأ e (${ks.map(v=>lt(fm(r['k'+v].m.e,3))).join(' ← ')} V) لكنه لم يصبح صفراً، وقصر زمن الاستقرار.${sat?' وبين K<sub>p</sub> = 10 و 50 لم يقصر زمن الاستقرار كثيراً: خرج الحاكم وصل إلى حدّه (إشباع).':''}</div>`}},
    {key:'sim',label:'2) Simulink',figTitle:'الشكل (3-2): مخطط Simulink',ref:'ص 24',s0:{Kp:1,amp:5},
     ctl:[{k:'Kp',t:'seg',l:'k<sub>p</sub> في كتلة Gain',o:ch1,free:{min:0.01,max:1000}},ampCtl],
     fig:(s)=>simulinkSVG('P',{kp:s.Kp}),scopeTitle:'Scope',
     sim:(s)=>{const r=tfStep([s.Kp],[1,1+s.Kp],s.amp,5);const m=measure(r);return {r,m,ch:CH_M(r),meters:[['x<sub>0</sub> عند <span class="ltr">5 s</span>',fm(m.x0,3)],['e = w<sub>0</sub> − x<sub>0</sub>',fm(m.e,3)],['زمن الاستقرار t<sub>s</sub>',TSV(m)+' s']]}},
     tables:[{title:'الجدول (ص 24) — Simulink',head:'K<sub>p</sub>',rows:ch1.map(v=>({key:'k'+v,l:'K<sub>p</sub> = '+v})),match:s=>ch1.includes(s.Kp)?'k'+s.Kp:null,
       cols:()=>[{h:'x<sub>0</sub>',f:m=>m.x0,dp:3},{h:'t<sub>s</sub> (s)',f:m=>TSV(m)},{h:'e = w<sub>0</sub> − x<sub>0</sub>',f:m=>m.e,dp:3},{h:'Step',f:(m,s)=>fm(s.amp)}]}],
     noMatch:'الجدول لـ k<sub>p</sub> = 1 أو 10 أو 50.',
     results:(rc,P,ctx)=>{const b=ctx.rec[0][0],r=rc[0];const both=ch1.filter(v=>b['k'+v]&&r['k'+v]&&r['k'+v].s.amp===5&&b['k'+v].s.plant==='pt1');if(!both.length)return '<p class="sub">سجّل K<sub>p</sub> نفسها على اللوحة (PT1) وهنا (Step = 5) لتظهر المقارنة.</p>';
       return `<div class="callout"><b>قارن اللوحة بـ Simulink:</b><ul class="cl-try">${both.map(v=>`<li>K<sub>p</sub> = ${v}: الخطأ ${lt(fm(b['k'+v].m.e,3)+' / '+fm(r['k'+v].m.e,3))} V، وزمن الاستقرار ${lt(TSV(b['k'+v].m)+' / '+TSV(r['k'+v].m))} s (اللوحة / Simulink).</li>`).join('')}</ul>الخطأ متقارب لأن المحاكاة تستعمل لوحة PT1 بكسب ${lt(fm(P.K1))} وثابت زمني ${lt(fm(P.T1)+' s')} (توضيحية)، و1/(s+1) في Simulink. أما زمن الاستقرار عند K<sub>p</sub> الكبير فأقصر في Simulink لأن خرج الحاكم الحقيقي محدود.</div>`}},
    {key:'thermal',label:'3) النظام الحراري',figTitle:'الشكل (3-3): توصيل التجربة مع النظام الحراري',ref:'ص 25',s0:{Kp:1,fan:false},
     ctl:[{k:'Kp',t:'seg',l:'K<sub>p</sub> على منزلق اللوحة',o:ch1},{k:'fan',t:'sw',b:'z',l:'تشغيل المروحة 5 V (تشويش)'}],
     ctlNote:'المروحة تبدأ عند t = 100 s حتى ترى أثرها ورد الحاكم عليه. والخطوة 7 V والزمن 200 s من الكتاب.',
     fig:(s,P,v)=>boardSVG({plant:'thermal',P:1,Kp:s.Kp,run:!!v,v:v||{},fan:s.fan&&v&&v.t>=100,mm:v?v.x:null,w0:7}),fanSpeed:(s,v)=>s.fan&&v&&v.t>=100?720:0,scopeTitle:'منحنى x<sub>T</sub> على شاشة الحاسب',
     sim:(s,P)=>{const r=simLoop({plant:PLANT.thermal(P.Kt,P.amb,P.Tth,P.Tdl,P.dz),Tw:200,w0:7,sat:[0,P.Um],ctrl:{type:'analog',P:true,Kp:s.Kp},zOn:t=>s.fan&&t>=100});const m=measure(r);
       return {r,m,fastSweep:4,ch:[{arr:r.w,col:'--live',lab:'w (المطلوب)',short:'w'},{arr:r.x,col:'--blue',lab:'x<sub>T</sub> (الخرج)',short:'x<sub>T</sub>'}],
        meters:[[s.fan?'X<sub>01</sub> عند <span class="ltr">200 s</span>':'X<sub>0</sub> عند <span class="ltr">200 s</span>',fm(m.x0,2)+' V'],['الخطأ w − x',fm(m.e,2)+' V'],['الحالة',m.osc?'يتذبذب':'استقر',m.osc]]}},
     tables:[{title:'تسجيل النتائج (ص 25)',head:'الحالة',rows:[{key:'z0',l:'بدون تشويش Z = 0 V: X<sub>0</sub>'},{key:'z5',l:'بوجود تشويش Z = 5 V: X<sub>01</sub>'}],match:s=>s.fan?'z5':'z0',
       cols:()=>[{h:'القيمة التي استقر عليها الخرج (V)',f:m=>m.osc?'يتذبذب':fm(m.x0,2)},{h:'K<sub>p</sub>',f:(m,s)=>fm(s.Kp)}]}],
     results:(rc,P)=>{const r=rc[0];if(!r.z0||!r.z5)return '<p class="sub">سجّل الحالتين (بلا مروحة ثم بها) بنفس K<sub>p</sub> لتقارن.</p>';if(r.z0.s.Kp!==r.z5.s.Kp)return '<div class="callout err">سجّلت الحالتين بقيمتين مختلفتين لـ K<sub>p</sub>: أعد التسجيل بنفس القيمة لتكون المقارنة صحيحة.</div>';
       const d=r.z0.m.x0-r.z5.m.x0,kp=r.z0.s.Kp;return `<div class="callout"><b>قارن:</b> المروحة خفضت الخرج هنا بمقدار ${lt(fm(d,2)+' V')} فقط، بينما تخفضه في الدائرة المفتوحة بمقدار ${lt(fm(P.dz,2)+' V')} (رقم توضيحي في المحاكاة). المتوقع تقريباً ${lt(fm(P.dz,2)+' / (1 + '+fm(P.Kt)+'×'+fm(kp)+') ≈ '+fm(P.dz/(1+P.Kt*kp),2)+' V')}. الحاكم عوّض معظم أثر التشويش، وبقي جزء صغير لأن الحاكم تناسبي فقط.</div>`},
     note:'الخرج x<sub>T</sub> يبدأ من حرارة الغرفة (ليس من صفر)، لذلك يختلف الخطأ هنا عن معادلة لوحة PT1. وعند K<sub>p</sub> = 50 يتذبذب النظام لأن فيه تأخيراً في بداية التسخين.'}
   ],
   steps:ctx=>{const R=(p,t,k)=>!!ctx.rec[p][t][k];return [
    {t:'شغّل التجربة على اللوحة مع K<sub>p</sub> = 1',x:'التوصيل جاهز كما في الشكل (3-1)، والمفتاح P على ON. راقب Y1 (الخطوة 5 V) وY2 (الخرج). بعد انتهاء الرسم اضغط «سجّل في الجدول».',done:()=>R(0,0,'k1')},
    {t:'غيّر K<sub>p</sub> إلى 10 وسجّل',x:'لاحظ أن الخرج صار أقرب إلى 5 V وأسرع.',done:()=>R(0,0,'k10')},
    {t:'غيّر K<sub>p</sub> إلى 50 وسجّل',x:'قارن الصفوف الثلاثة: الخطأ يصغر ولا يصبح صفراً. انظر «أكبر إشارة تحكم y»: وصل الحاكم إلى حدّه.',done:()=>R(0,0,'k50')},
    {t:'استعمل المؤشر لقراءة الخرج بنفسك',x:'حرّك منزلق «المؤشر» تحت الشاشة واقرأ قيمة Y2 عند زمن ما، كما تفعل على راسم الذبذبات الحقيقي.',done:()=>!!ctx.did.cursor},
    {t:'أعد التجربة بـ Simulink — الشكل (3-2)',x:'اختر الجزء «2) Simulink» وسجّل k<sub>p</sub> = 1 و10 و50 بخطوة 5، ثم اقرأ المقارنة تحت الجدول.',done:()=>R(1,0,'k1')&&R(1,0,'k10')&&R(1,0,'k50')},
    {t:'النظام الحراري بلا تشويش',x:'اختر «3) النظام الحراري». الخطوة 7 V وزمن 200 s. سجّل X<sub>0</sub>.',done:()=>R(2,0,'z0')},
    {t:'شغّل المروحة (z = 5 V) وسجّل X<sub>01</sub> بنفس K<sub>p</sub>',x:'لاحظ انخفاض الخرج عند 100 s ثم رد الحاكم. اقرأ المقارنة تحت الجدول.',done:()=>R(2,0,'z5')},
    {t:'جرّب K<sub>p</sub> = 50 مع النظام الحراري',x:'ماذا يحدث للخرج؟ هذه إجابة السؤال الرابع: الزيادة المفرطة في K<sub>p</sub>.',done:()=>ctx.pi===2&&ctx.st[2].Kp===50&&!!ctx.did['run-thermal']}]}});
 },
 quiz:[
  {q:'في الدائرة المغلقة، ما الإشارة التي تخرج من المقبس e في لوحة Analog Controller؟',o:['القيمة المطلوبة w','الخطأ e = w − x','خرج النظام x','التشويش z'],c:1,e:'دائرة الجمع تطرح x (المدخل السالب) من w، فينتج الخطأ e.'},
  {q:'الحاكم التناسبي يعطي إشارة تحكم:',o:['y = K<sub>p</sub>·e','y = K<sub>p</sub>/e','y = K<sub>p</sub>∫e dt','y = e − K<sub>p</sub>'],c:0,e:'يضرب الخطأ في الثابت K<sub>p</sub>.'},
  {q:'نظام كسبه 1 مع حاكم تناسبي K<sub>p</sub> = 10 وخطوة 5 V. الخطأ المستقر تقريباً:',o:['0 V','0.5 V','0.455 V','4.55 V'],c:2,e:'e = 5/(1+1×10) ≈ 0.455 V.'},
  {q:'ماذا يحدث للخطأ المستقر عند زيادة K<sub>p</sub> من 1 إلى 50 مع الحاكم P وحده؟',o:['يزيد','يقل لكنه لا يصبح صفراً','يصبح صفراً تماماً','لا يتغير'],c:1,e:'e = w<sub>0</sub>/(1+K K<sub>p</sub>) يصغر ولا ينعدم.'},
  {q:'لماذا لم يقصر زمن الاستقرار على اللوحة كثيراً بين K<sub>p</sub> = 10 و50؟',o:['لأن لوحة PT1 معطلة','لأن خرج الحاكم محدود فوصل إلى حدّه (إشباع)','لأن Simulink أبطأ','لأن الخطأ صار صفراً'],c:1,e:'عند K<sub>p</sub> = 50 يطلب الحاكم في البداية 250 V، لكن خرجه لا يتجاوز حدّه.'},
  {q:'في الجزء الثالث، المروحة تمثل:',o:['الحاكم','التشويش z','القيمة المطلوبة','أداة القياس'],c:1,e:'تشغيل المروحة بجهد 5 V يبرّد السخان، أي تشويش على النظام الحراري.'},
  {q:'لماذا يقل أثر المروحة في الدائرة المغلقة؟',o:['لأن المروحة تتوقف','لأن الحاكم يرى انخفاض الخرج فيزيد التسخين ويعوّضه','لأن الخطوة تصبح 7 V','لأن المقياس لا يقرأ'],c:1,e:'التغذية الراجعة تقسم الأثر تقريباً على (1+K K<sub>p</sub>).'},
  {q:'الزيادة المفرطة في K<sub>p</sub> مع النظام الحراري تؤدي إلى:',o:['استجابة أبطأ','تذبذب وفقد الاستقرار','خطأ أكبر','لا شيء'],c:1,e:'وجود تأخير في النظام مع كسب كبير يسبب تذبذباً مستمراً.'}
 ]
});

/* ======================================================================
   Lesson 2 — the integral controller (ص 27–30)
   ====================================================================== */
const DEF_T=String.raw`<ul class="cl-defs"><li><b>زمن التأخير \(t_d\)</b>: الزمن حتى يبلغ الخرج 50 % من قيمته النهائية.</li><li><b>زمن الصعود \(t_r\)</b>: الزمن الذي يصعد فيه الخرج من 10 % إلى 90 % من قيمته النهائية.</li><li><b>زمن التعدي \(t_p\)</b> (زمن القمة): الزمن حتى أعلى قمة للخرج.</li><li><b>التعدي \(M_p\)</b>: مقدار ما تتجاوز به القمة القيمة النهائية (بالفولت، أو كنسبة مئوية منها).</li><li><b>زمن الاستقرار \(t_s\)</b>: حتى يبقى الخرج داخل ±2 % حول قيمته النهائية.</li><li><b>الخطأ المستقر \(e\)</b>: الفرق بين المطلوب والخرج بعد الاستقرار.</li></ul>`;
const respDefSVG=()=>{const r=tfStep([1],[1,1,1],1,10);const m=measure(r);const W=520,H=230,L=40,T=12,Wd=W-L-14,Hd=H-T-36,X=t=>L+t/10*Wd,Y=v=>T+Hd-v/1.3*Hd;let p='';for(let i=0;i<=r.N;i+=10)p+=(i?'L':'M')+fx(X(r.t[i]))+' '+fx(Y(r.x[i]));
  const t10=(()=>{for(let i=0;i<=r.N;i++)if(r.x[i]>=0.1)return r.t[i]})(),t90=(()=>{for(let i=0;i<=r.N;i++)if(r.x[i]>=0.9)return r.t[i]})();
  let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="تعريفات زمن التأخير وزمن الصعود والتعدي وزمن الاستقرار على منحنى استجابة">`+`<path d="M${L} ${T}V${T+Hd}H${L+Wd}" stroke="var(--fg)" fill="none" stroke-width="1.3"/>`+
   `<path d="M${L} ${fx(Y(1))}H${L+Wd}" stroke="var(--muted)" stroke-dasharray="4 3"/><path d="M${L} ${fx(Y(1.02))}H${L+Wd}M${L} ${fx(Y(0.98))}H${L+Wd}" stroke="var(--on)" stroke-dasharray="2 3"/>`+`<path d="${p}" stroke="var(--blue)" stroke-width="2.4" fill="none"/>`+
   `<path d="M${fx(X(m.td))} ${fx(Y(0.5))}V${T+Hd}" stroke="var(--stop)" stroke-dasharray="3 2"/>`+S.t(fx(X(m.td)),T+Hd+14,'td','',null,11)+
   `<path d="M${fx(X(t10))} ${fx(Y(0.1))}V${T+Hd}M${fx(X(t90))} ${fx(Y(0.9))}V${T+Hd}" stroke="var(--live)" stroke-dasharray="3 2"/>`+S.t(fx((X(t10)+X(t90))/2),T+Hd-6,'tr','',null,11)+
   `<path d="M${fx(X(m.tp))} ${fx(Y(1+m.Mp))}V${T+Hd}" stroke="var(--blue-ink)" stroke-dasharray="3 2"/>`+S.t(fx(X(m.tp)),T+Hd+14,'tp','',null,11)+arr(X(m.tp)+18,Y(1),X(m.tp)+18,Y(1+m.Mp))+S.t(fx(X(m.tp)+34),fx(Y(1+m.Mp/2)+4),'Mp','','start',11)+
   `<path d="M${fx(X(m.ts))} ${fx(Y(1.02))}V${T+Hd}" stroke="var(--on)" stroke-dasharray="3 2"/>`+S.t(fx(X(m.ts)),T+Hd+14,'ts','',null,11)+S.t(L-4,fx(Y(1)+4),'1','m','end',10)+S.t(L-4,fx(Y(0.5)+4),'0.5','m','end',10)+S.t(L+Wd,H-4,'t','m','end',11);
  return s+'</svg>'};
B.lesson({
 id:'u3-l2',unit:3,order:2,pages:'27–30',
 title:'التجربة الثانية: الحاكم التكاملي (I-Controller)',
 summary:'نستبدل الحاكم التناسبي بحاكم تكاملي: يصل الخرج إلى القيمة المطلوبة تماماً (الخطأ المستقر صفر)، لكن بتعدٍّ وتذبذب يزدادان مع K<sub>I</sub>. نقيس t<sub>d</sub> و t<sub>r</sub> و M<sub>p</sub> و t<sub>p</sub> و e على اللوحة ثم بـ Simulink.',
 theory:[
  {h:'الهدف من التجربة',ref:'ص 27',html:String.raw`<p>أن يتعرف المتدرب من خلال هذه التجربة على ما يلي:</p><ul><li>الأجهزة المستخدمة في مختبر التحكم Com3Lab.</li><li>الحاكم التكاملي وتأثيره على نظام من الرتبة الأولى \(PT_1\).</li><li>استجابة النظام \(PT_1\) في حالة إشارة دخل خطوة Step Function.</li></ul>`},
  {h:'الأجهزة والمكونات',ref:'ص 27',html:String.raw`<ul><li>مصدر التغذية (Power Supply).</li><li>الكارت الإلكتروني.</li><li>مولد إشارة (Function Generator).</li><li>نظام من الرتبة الأولى PT1.</li><li>جهاز حاسب مع برنامج Com3Lab.</li><li>ولوحة تغيير معاملات الحاكمات.</li></ul>`},
  {h:'الحاكم التكاملي',html:String.raw`<div class="callout">${ADD}الحاكم التكاملي «يجمع» الخطأ مع الزمن:</div>$$y = K_I \int e\,dt$$<ul><li>ما دام هناك خطأ ولو صغير فإن \(y\) يستمر في التغير، فلا يتوقف إلا عندما يصبح الخطأ <b>صفراً</b>. لذلك <b>يلغي الحاكم التكاملي الخطأ المستقر</b>.</li><li>لكن التكامل يحتاج وقتاً ليكبر، ثم يحتاج وقتاً ليصغر: عندما يصل الخرج إلى المطلوب تكون إشارة التحكم ما زالت كبيرة فيتجاوز الخرج المطلوب (<b>تعدٍّ</b>)، ثم يرجع… فتظهر <b>ذبذبة مخمدة</b>.</li><li>مع نظام رتبة أولى \(\frac{1}{s+1}\) — الشكل (3-5) تصبح الحلقة من الرتبة الثانية: \(\dfrac{K_I}{s^2+s+K_I}\)، ومعامل الإخماد \(\zeta = \dfrac{1}{2\sqrt{K_I}}\). كلما زاد \(K_I\) صغر \(\zeta\) فزاد التعدي والتذبذب، وصارت الاستجابة أسرع.</li></ul>`},
  {h:'تعريفات زمن التأخير وزمن الصعود والتعدي',html:`<div class="callout">${ADD}الجدول يطلب هذه المقادير دون تعريفها في الكتاب. التعريفات المستعملة في المختبر:</div>${DEF_T}`},
  {fig:'',caption:'المقادير على منحنى استجابة لخطوة وحدة (توضيح للمتدرب — ليس من الكتاب؛ المنحنى للحلقة 1/(s²+s+1)، أي K<sub>I</sub> = 1 في الشكل 3-5).',draw:()=>box(respDefSVG(),560)},
  {h:'خطوات إجراء التجربة',ref:'ص 27',html:String.raw`<ol><li>شغل لوحة العمليات وأجب عن الأسئلة التي تسمح بمواصلة العمل.</li><li>اضبط قيمة دخل الوحدة المتحكم فيها بواسطة مولد إشارة الدخل عند النقطة Out بعد أن قمنا بالمعايرة وهي إشارة قفزة.</li><li>قم بتوصيل الأجهزة كما في الشكل (3-4) (بإمكانك تغيير النظام \(PT_1\) بمحرك التيار المستمر).</li><li>قبل تشغيل التجربة اطلب من المسؤول عن المختبر مراجعة التوصيل ومعايرة الأجهزة.</li><li>قم بتشغيل التجربة بخطوة \(5\ \text{v}\) وزمن \(10\ \text{s}\) وسجل إشارتي القناتين \(Y_1\) و\(Y_2\) على راسم الذبذبات.</li></ol>`},
  {fig:'(3-4)',ref:'ص 28',caption:'توصيل التجربة — مطابق للشكل (3-1)، والفرق ضبط المفاتيح على I (P و D على OFF).',draw:()=>box(boardSVG({plant:'pt1',P:0,I:1,w0:5}),760,1)},
  {h:'تسجيل النتائج',ref:'ص 28',html:`<p>قم بتغيير معامل الحاكم التكاملي K<sub>I</sub> (1 و 10) وارسم منحنى استجابة النظام ثم أكمل الجدول التالي:</p>${ptable(['الثابت التكاملي K<sub>I</sub>','زمن التأخير t<sub>d</sub> (s)','زمن الصعود t<sub>r</sub> (s)','التعدي M<sub>p</sub> (v)','زمن التعدي t<sub>p</sub> (s)','الخطأ e (v)'],['1','10'])}<p>ما تأثير الثابت التكاملي K<sub>I</sub> على المتغيرات المبينة في الجدول؟ …………</p>`},
  {h:'الجزء الثاني: Simulink',ref:'ص 29',html:'<p>أعد التجربة باستخدام SIMULINK واعتماداً على الشكل (3-5).</p>'},
  {fig:'(3-5)',ref:'ص 29',caption:'مخطط التجربة (بلا Mux — الخرج فقط إلى Scope): Step ← Add ← Gain (Ki) ← Integrator 1/s ← Transfer Fcn 1/(s+1) ← Scope، مع تغذية راجعة وحدية سالبة.',draw:()=>box(simulinkSVG('I'),760,1)},
  {html:`<p>غيّر الثابت التكاملي حسب الجدول ثم سجل النتائج في الجدول:</p>${ptable(['الثابت التكاملي K<sub>I</sub>','زمن التأخير t<sub>d</sub> (s)','زمن الصعود t<sub>r</sub> (s)','التعدي M<sub>p</sub> (v)','زمن التعدي t<sub>p</sub> (s)','الخطأ e (v)'],['0.5','1','2'])}<p>ماذا تلاحظ حول تأثر المتغيرات المبينة في الجدول؟ ………… ماذا تستنتج؟ …………</p>`},
  {h:'أسئلة ومناقشة',ref:'ص 30',html:
   Q(1,'ارسم المخطط الصندوقي للتجربة.','w ← دائرة جمع (− من x) ← e ← الحاكم التكاملي \\(K_I/s\\) ← y ← النظام \\(PT_1\\) ← x، مع خط تغذية راجعة من x إلى المدخل السالب.')+
   Q(2,'ما الهدف من وضع الحاكم التكاملي في نظام التحكم؟','إلغاء الخطأ المستقر: التكامل يستمر في تغيير إشارة التحكم ما دام هناك أي خطأ، فلا يستقر النظام إلا والخرج مساوٍ للقيمة المطلوبة. وكذلك يلغي أثر التشويش الثابت.')+
   Q(3,'عند زيادة قيمة معامل الحاكم التكاملي تظهر ذبذبة مخمدة وتزداد نسبة التعدي. ما سبب ذلك؟','التكامل «يتذكر» الخطأ الماضي: عندما يصل الخرج إلى المطلوب تكون إشارة التحكم ما زالت كبيرة فيتجاوز الخرج، ثم يتجمع خطأ معاكس ليرجعه. كلما زاد \\(K_I\\) صار هذا أعنف (معامل الإخماد \\(\\zeta = 1/(2\\sqrt{K_I})\\) يصغر).')+
   Q(4,'ماذا تستخلص من هذه التجربة؟','الحاكم التكاملي يعطي خطأ مستقراً صفراً، لكنه يجعل الاستجابة تتذبذب وتتعدى، وزيادة \\(K_I\\) تسرّع الصعود وتزيد التعدي. لذلك يُجمع عادة مع التناسبي (PI).')},
  {err:'<ul style="margin:4px 0 0;padding-inline-start:18px"><li>الكتاب يستعمل t<sub>d</sub> و t<sub>r</sub> و M<sub>p</sub> و t<sub>p</sub> دون تعريفها (أضفنا التعريفات أعلاه).</li><li>الجدول يطلب M<sub>p</sub> بالفولت؛ في المختبر نكتبه بالفولت ومعه النسبة المئوية.</li><li>صُححت «ما ذا تلاحظ» إلى «ماذا تلاحظ».</li></ul>'}
 ],
 lab:(el)=>{
  const kb=[1,10],ks=[0.5,1,2];
  const cols=()=>[{h:'t<sub>d</sub> (s)',f:m=>tF(m.td)},{h:'t<sub>r</sub> (s)',f:m=>tF(m.tr)},{h:'M<sub>p</sub> (V)',f:m=>MPV(m)},{h:'t<sub>p</sub> (s)',f:m=>TPV(m)},{h:'e (V)',f:m=>m.e,dp:3}];
  const mets=m=>[['t<sub>d</sub>',tF(m.td)+' s'],['t<sub>r</sub>',tF(m.tr)+' s'],['M<sub>p</sub>',MPV(m)],['t<sub>p</sub>',TPV(m)+' s'],['e عند <span class="ltr">10 s</span>',fm(m.e,3)]];
  ctrlBench(el,{k:'lb',tp:{id:'u3-l2',defs:AN_DEFS()},
   parts:[
    {key:'board',label:'1) اللوحة',figTitle:'الشكل (3-4): توصيل التجربة',ref:'ص 28',s0:{plant:'pt1',P:false,I:true,D:false,KI:1,Kp:1},
     ctl:[ctlPlant,...ctlPID(),{k:'KI',t:'seg',l:'K<sub>I</sub> (لوحة تغيير المعاملات)',o:kb,free:{min:0.05,max:100}}],
     ctlNote:s=>(s.P?'المفتاح P موصول: صار الحاكم PI (والصفوف هنا لـ I وحده). ':'')+(!s.P&&!s.I?'<span style="color:var(--stop)">P و I مفصولان: لا إشارة تحكم.</span> ':'')+dNote(s),
     fig:boardFig,fanSpeed:motorSpin,
     sim:(s,P)=>{const o=boardRun(s,P,10,s.KI);o.meters=mets(o.m);return o},
     tables:[{title:'جدول النتائج (ص 28) — على اللوحة',head:'K<sub>I</sub>',rows:kb.map(v=>({key:'k'+v,l:'K<sub>I</sub> = '+v})),match:s=>!s.P&&s.I&&kb.includes(s.KI)?'k'+s.KI:null,cols:()=>cols().concat([{h:'النظام',f:(m,s)=>PLN[s.plant]}])}],
     noMatch:'الجدول لـ I وحده (P مفصول) عند K<sub>I</sub> = 1 أو 10.',ghostLabel:s=>'K<sub>I</sub> = '+fm(s.KI),
     results:rc=>{const r=rc[0];if(!r.k1||!r.k10)return '';return `<div class="callout"><b>ماذا تلاحظ؟</b> مع K<sub>I</sub> = 10 صار الصعود أسرع (t<sub>r</sub> ${lt(tF(r.k1.m.tr)+' ← '+tF(r.k10.m.tr))} s) لكن التعدي أكبر (${lt(fm(r.k1.m.MpP,0)+'% ← '+fm(r.k10.m.MpP,0)+'%')})، والخطأ في الحالتين قريب من الصفر.</div>`}},
    {key:'sim',label:'2) Simulink',figTitle:'الشكل (3-5): مخطط Simulink',ref:'ص 29',s0:{KI:0.5,amp:5},scopeTitle:'Scope',
     ctl:[{k:'KI',t:'seg',l:'Ki في كتلة Gain',o:ks,free:{min:0.01,max:100}},ampCtl],
     fig:(s)=>simulinkSVG('I',{ki:s.KI}),
     sim:(s)=>{const r=tfStep([s.KI],[1,1,s.KI],s.amp,10);const m=measure(r);return {r,m,ch:CH_S(r),meters:mets(m)}},
     tables:[{title:'الجدول (ص 29) — Simulink',head:'K<sub>I</sub>',rows:ks.map(v=>({key:'k'+v,l:'K<sub>I</sub> = '+v})),match:s=>ks.includes(s.KI)?'k'+s.KI:null,cols:()=>cols().concat([{h:'Step',f:(m,s)=>fm(s.amp)}])}],
     noMatch:'الجدول لـ K<sub>I</sub> = 0.5 أو 1 أو 2.',ghostLabel:s=>'Ki = '+fm(s.KI),
     results:rc=>{const r=rc[0];if(!(r['k0.5']&&r.k1&&r.k2))return '';return `<div class="callout"><b>ماذا تلاحظ؟</b> بزيادة K<sub>I</sub> من 0.5 إلى 2: يقصر t<sub>d</sub> و t<sub>r</sub> و t<sub>p</sub>، ويزيد التعدي (${lt([r['k0.5'],r.k1,r.k2].map(x=>fm(x.m.MpP,1)+'%').join(' ← '))})، ويبقى الخطأ المستقر صفراً. <b>نستنتج</b> أن K<sub>I</sub> الكبير يسرّع الاستجابة على حساب الاستقرار.</div>`}}
   ],
   steps:ctx=>{const R=(p,k)=>!!ctx.rec[p][0][k];return [
    {t:'شغّل التجربة مع K<sub>I</sub> = 1',x:'المفتاح I على ON و P و D على OFF، الخطوة 5 V والزمن 10 s. لاحظ أن الخرج يتجاوز 5 V ثم يرجع. سجّل.',done:()=>R(0,'k1')},
    {t:'غيّر K<sub>I</sub> إلى 10 وسجّل',x:'قارن المنحنيين على الشاشة (المنحنى المسجل يظهر متقطعاً).',done:()=>R(0,'k10')},
    {t:'اقرأ M<sub>p</sub> و t<sub>p</sub> بالمؤشر',x:'ضع المؤشر على أعلى قمة لـ Y2 واقرأ زمنها وقيمتها، وقارنها بالقياس الآلي.',done:()=>!!ctx.did.cursor},
    {t:'شغّل P أيضاً وانظر',x:'ماذا يحدث للتعدي عند إضافة P؟ (هذه بداية التجربة الثالثة). أعد P إلى OFF بعدها.',done:()=>ctx.st[0].P&&!!ctx.did['run-board']},
    {t:'Simulink: سجّل K<sub>I</sub> = 0.5 و1 و2',x:'اختر «2) Simulink» — الشكل (3-5) وسجّل الصفوف الثلاثة، ثم اقرأ الملاحظة تحت الجدول.',done:()=>R(1,'k0.5')&&R(1,'k1')&&R(1,'k2')},
    {t:'جرّب K<sub>I</sub> = 10 في Simulink',x:'اكتب 10 في خانة Ki وقارن مع اللوحة عند K<sub>I</sub> = 10: في Simulink التعدي أكبر (نحو 60 %) لأن خرج الحاكم بلا حد، بينما على اللوحة يتشبع.',done:()=>ctx.pi===1&&ctx.st[1].KI===10}]}});
 },
 quiz:[
  {q:'الحاكم التكاملي يعطي إشارة تحكم:',o:['y = K<sub>I</sub>·e','y = K<sub>I</sub>∫e dt','y = K<sub>I</sub>·de/dt','y = K<sub>I</sub>/e'],c:1,e:'يتكامل الخطأ مع الزمن.'},
  {q:'ما الخطأ المستقر مع الحاكم التكاملي ونظام PT1 (بعد الاستقرار)؟',o:['كبير','نصف الخطوة','صفر','يساوي K<sub>I</sub>'],c:2,e:'التكامل لا يتوقف عن التغير إلا عندما يصبح الخطأ صفراً.'},
  {q:'عند زيادة K<sub>I</sub>:',o:['يقل التعدي وتبطؤ الاستجابة','يزيد التعدي وتسرع الاستجابة','لا يتغير شيء','يصبح الخطأ كبيراً'],c:1,e:'ζ = 1/(2√K<sub>I</sub>) يصغر فيزيد التعدي، و ω<sub>n</sub> = √K<sub>I</sub> يكبر فتسرع.'},
  {q:'زمن الصعود t<sub>r</sub> هو الزمن:',o:['حتى أعلى قمة','من 10 % إلى 90 % من القيمة النهائية','حتى 50 % من القيمة النهائية','حتى الاستقرار'],c:1,e:'تعريف شائع لزمن الصعود.'},
  {q:'زمن التأخير t<sub>d</sub> هو الزمن حتى يبلغ الخرج:',o:['10 %','50 %','90 %','100 %'],c:1,e:'التعريف المستعمل: 50 % من القيمة النهائية.'},
  {q:'في الشكل (3-5) لماذا لا يوجد Mux؟',o:['لأن Scope لا يقبل Mux','لأن الشكل يعرض الخرج فقط','لأن Step غير موجود','لأنه خطأ مطبعي'],c:1,e:'الخرج وحده يدخل Scope في هذا المخطط.'},
  {q:'مع 1/(s+1) و K<sub>I</sub> = 1، الدالة المغلقة هي:',o:['1/(s+2)','1/(s²+s+1)','s/(s²+1)','1/(s+1)²'],c:1,e:'K<sub>I</sub>/(s(s+1)+K<sub>I</sub>) = 1/(s²+s+1).'}
 ]
});

/* ======================================================================
   Lesson 3 — the PI controller (ص 31–34)
   ====================================================================== */
B.lesson({
 id:'u3-l3',unit:3,order:3,pages:'31–34',
 title:'التجربة الثالثة: الحاكم التناسبي التكاملي PI- Controller',
 summary:'نجمع الحاكمين: الجزء التناسبي يسرّع الاستجابة، والجزء التكاملي يلغي الخطأ المستقر. نغيّر K<sub>p</sub> على اللوحة (1، 10، 50)، ثم في Simulink نثبت أحد المعاملين ونغيّر الآخر ونقارن المنحنيات.',
 theory:[
  {h:'الهدف من التجربة',ref:'ص 31',html:String.raw`<p>أن يتعرف المتدرب من خلال هذه التجربة على ما يلي:</p><ul><li>الأجهزة المستخدمة في مختبر التحكم Com3Lab.</li><li>الحاكم التناسبي التكاملي وتأثيره على نظام من الرتبة الأولى \(PT_1\).</li><li>استجابة النظام \(PT_1\) في حالة إشارة دخل الخطوة Step Function.</li></ul>`},
  {h:'الأجهزة والمكونات',ref:'ص 31',html:String.raw`<ul><li>مصدر التغذية (Power Supply).</li><li>الكارت الإلكتروني.</li><li>مولد إشارة (Function Generator).</li><li>نظام من الرتبة الأولى PT1 أو محرك التيار المستمر.</li><li>جهاز راسم ذبذبات (Oscilloscope).</li><li>ولوحة تغيير معاملات الحاكمات.</li></ul>`},
  {h:'الحاكم التناسبي التكاملي',html:String.raw`<div class="callout">${ADD}الحاكم PI مجموع الحاكمين على التوازي (كما في الشكل 3-7):</div>$$y = K_p\,e + K_I\int e\,dt$$<ul><li>الجزء <b>التناسبي</b> يرد فوراً على الخطأ فيسرّع البداية.</li><li>الجزء <b>التكاملي</b> يستمر حتى يصبح الخطأ صفراً، فالخطأ المستقر = 0 لكل القيم.</li><li>مع \(\frac{1}{s+1}\) تصبح الحلقة: \(\dfrac{K_p s + K_I}{s^2+(1+K_p)s+K_I}\). زيادة \(K_p\) تزيد الإخماد (تعدٍّ أقل)، وزيادة \(K_I\) تقرّب الخرج من المطلوب أسرع لكنها تزيد التعدي.</li><li>إذا كان \(K_I\) صغيراً جداً مقارنة بـ \(K_p\) يقترب الخرج بسرعة من جزء كبير من القيمة ثم يكمل الباقي ببطء («ذيل» بطيء).</li></ul>`},
  {h:'خطوات إجراء التجربة',ref:'ص 31',html:String.raw`<ol><li>شغل لوحة العمليات وأجب عن الأسئلة التي تسمح بمواصلة العمل.</li><li>اضبط قيمة دخل الوحدة المتحكم فيها بواسطة مولد إشارة الدخل عند النقطة Out بعد أن قمنا بالمعايرة وهي إشارة قفزة.</li><li>قم بتوصيل الأجهزة كما في الشكل (3-6).</li><li>قبل تشغيل التجربة اطلب من المدرب مراجعة التوصيل ومعايرة الأجهزة.</li><li>ثبت إشارة الدخل على \(w_0 = 5\ \text{v}\) وخلال زمن \(10\ \text{s}\) ثم شغّل التجربة وسجل إشارتي القناتين \(Y_1\) و\(Y_2\) على راسم الذبذبات.</li><li>سجل ملحوظاتك.</li></ol>`},
  {fig:'(3-6)',ref:'ص 32',caption:'توصيلة الحاكم التناسبي التكاملي — مطابقة للشكلين (3-1) و(3-4) مع المفتاحين P و I على ON.',draw:()=>box(boardSVG({plant:'pt1',P:1,I:1,Kp:1,w0:5}),760,1)},
  {h:'تسجيل النتائج',ref:'ص 32',html:`<ul><li>أعد رسم منحنيي الدخل والخرج مع تغيير الثابت K<sub>p</sub> (1، 10، 50).</li><li>لكل قيمة لـ K<sub>p</sub> أكمل الجدول.</li></ul>${ptable(['الثابت K<sub>p</sub>','قيمة الخرج X<sub>0</sub>','قيمة الدخل W<sub>0</sub>','الخطأ e = W<sub>0</sub> – X<sub>0</sub>','زمن الاستقرار t<sub>s</sub>'],['1','10','50'])}<p>ماذا تلاحظ؟ ………… ماذا تستنتج؟ …………</p>`},
  {note:`${ADD}الكتاب لا يذكر قيمة K<sub>I</sub> على اللوحة في هذا الجزء. في المختبر نبدأ بـ K<sub>I</sub> = 1 (أول قيمة في التجربة السابقة)، ويستطيع المدرب تغييرها.`},
  {h:'الجزء الثاني: Simulink',ref:'ص 33',html:'<p>أعد التجربة باستخدام Simulink اعتماداً على الشكل (3-7).</p>'},
  {fig:'(3-7)',ref:'ص 33',caption:'Step ← Add ← فرعان متوازيان: Gain1 (Kp) مباشرة، و Gain (Ki) ← Integrator 1/s، يجتمعان في Add1 ← Transfer Fcn 1/(s+1) ← Mux ← Scope، مع تغذية راجعة سالبة.',draw:()=>box(simulinkSVG('PI'),760,1)},
  {h:'تسجيل النتائج',ref:'ص 33',html:`<p>ثبت K<sub>p</sub> = 1 وغيّر K<sub>I</sub> حسب الجدول التالي:</p><div class="cl-tbl"><table class="cl-bt"><tbody><tr><th>K<sub>I</sub></th><td>0.1</td><td>1</td><td>2</td></tr></tbody></table></div><p>ماذا تلاحظ؟ — ماذا تستنتج؟</p><p>ثبت K<sub>I</sub> = 1 وغيّر K<sub>p</sub> حسب الجدول التالي:</p><div class="cl-tbl"><table class="cl-bt"><tbody><tr><th>K<sub>p</sub></th><td>0.1</td><td>1</td><td>2</td></tr></tbody></table></div><p>ماذا تلاحظ؟ — ماذا تستنتج؟</p><p class="sub">الجدولان صف واحد بالقيم فقط: يرسم المتدرب الاستجابة لكل قيمة ويقارن. في المختبر أضفنا أعمدة قياس للمقارنة.</p>`},
  {h:'أسئلة ومناقشة',ref:'ص 34',html:
   Q(1,'ارسم المخطط الصندوقي للتجربة (لنظام واحد فقط).','w ← دائرة جمع (− من x) ← e ← فرعان: \\(K_p\\) و\\(K_I/s\\) يجتمعان ← y ← النظام \\(PT_1\\) ← x، مع تغذية راجعة سالبة من x.')+
   Q(2,'ما تأثير الحاكم التناسبي التكاملي على استجابة النظام؟','يجعل الخطأ المستقر صفراً (بفضل الجزء التكاملي) مع استجابة أسرع وتعدٍّ أقل من الحاكم التكاملي وحده (بفضل الجزء التناسبي). زيادة \\(K_I\\) تسرّع الوصول وتزيد التعدي، وزيادة \\(K_p\\) تزيد الإخماد.')},
  {err:'<ul style="margin:4px 0 0;padding-inline-start:18px"><li>الخطوة الثانية (ص 31) طُبعت ناقصة: «بعد أن قمنا بالمعايرة وهي إشارة قفزة.» — أكملناها من التجربة السابقة: «اضبط قيمة دخل الوحدة المتحكم فيها بواسطة مولد إشارة الدخل عند النقطة Out بعد أن قمنا بالمعايرة وهي إشارة قفزة».</li><li>لا يحدد الكتاب K<sub>I</sub> على اللوحة في الجزء الأول.</li><li>صُححت «ثم تشغل التجربة» إلى «ثم شغّل التجربة».</li></ul>'}
 ],
 lab:(el)=>{
  const kb=[1,10,50],k3=[0.1,1,2];
  const mets=m=>[['X<sub>0</sub> عند <span class="ltr">10 s</span>',fm(m.x0,3)],['e = W<sub>0</sub> − X<sub>0</sub>',fm(m.e,3)],['زمن الاستقرار t<sub>s</sub>',TSV(m)+' s',m.ts>m.Tw],['M<sub>p</sub>',MPV(m)]];
  const sCols=()=>[{h:'إضافة: X<sub>0</sub> عند <span class="ltr">10 s</span>',f:m=>m.x0,dp:3},{h:'إضافة: M<sub>p</sub>',f:m=>MPV(m)},{h:'إضافة: t<sub>s</sub> (s)',f:m=>TSV(m)}];
  const simPI=(s)=>{const r=tfStep([s.Kp,s.KI],[1,1+s.Kp,s.KI],s.amp,10);const m=measure(r);return {r,m,ch:CH_M(r),meters:mets(m)}};
  ctrlBench(el,{k:'lc',tp:{id:'u3-l3',defs:AN_DEFS().concat([{k:'KIb',label:'K<sub>I</sub> على اللوحة في الجزء الأول (الكتاب لا يحدده)',unit:'1/s',value:1,min:0.05,max:50,step:0.05}]),reset:(st,P)=>{st[0].KI=P.KIb}},
   parts:[
    {key:'board',label:'1) اللوحة',figTitle:'الشكل (3-6): توصيلة الحاكم PI',ref:'ص 32',s0:{plant:'pt1',P:true,I:true,D:false,Kp:1,KI:1},
     ctl:[ctlPlant,...ctlPID(),{k:'Kp',t:'seg',l:'K<sub>p</sub> على منزلق اللوحة',o:kb},{k:'KI',t:'num',l:'K<sub>I</sub>',min:0.05,max:50}],
     ctlNote:s=>(!s.I?'المفتاح I مفصول: صار الحاكم P وحده (التجربة الأولى). ':'')+(!s.P?'المفتاح P مفصول: صار الحاكم I وحده (التجربة الثانية). ':'')+dNote(s),
     fig:boardFig,fanSpeed:motorSpin,
     sim:(s,P)=>{const o=boardRun(s,P,10,s.KI);o.meters=mets(o.m);o.note=satNote(o.r,P);return o},
     tables:[{title:'جدول النتائج (ص 32) — على اللوحة',head:'K<sub>p</sub>',rows:kb.map(v=>({key:'k'+v,l:'K<sub>p</sub> = '+v})),match:s=>s.P&&s.I&&kb.includes(s.Kp)?'k'+s.Kp:null,
       cols:()=>[{h:'X<sub>0</sub> (V)',f:m=>m.x0,dp:3},{h:'W<sub>0</sub> (V)',f:m=>m.w0,dp:2},{h:'e = W<sub>0</sub> − X<sub>0</sub> (V)',f:m=>m.e,dp:3},{h:'t<sub>s</sub> (s)',f:m=>TSV(m)},{h:'K<sub>I</sub>',f:(m,s)=>fm(s.KI)},{h:'النظام',f:(m,s)=>PLN[s.plant]}]}],
     noMatch:'الجدول للحاكم PI (المفتاحان P و I على ON) عند K<sub>p</sub> = 1 أو 10 أو 50.',ghostLabel:s=>'K<sub>p</sub> = '+fm(s.Kp),
     results:rc=>{const r=rc[0];if(!(r.k1&&r.k10&&r.k50))return '';const slow=r.k10.m.ts>r.k10.m.Tw;return `<div class="callout"><b>ماذا تلاحظ؟</b> الخطأ عند نهاية العرض صغير جداً لكل القيم (الجزء التكاملي يلغيه).${slow?' عند K<sub>p</sub> = 10 يصعد الخرج بسرعة ثم يكمل الباقي ببطء، فلم يستقر داخل 10 s: K<sub>I</sub> صغير مقارنة بـ K<sub>p</sub>.':''}</div>`}},
    {key:'simA',label:'2) Simulink: K<sub>p</sub> = 1',figTitle:'الشكل (3-7) مع K<sub>p</sub> = 1',ref:'ص 33',s0:{Kp:1,KI:0.1,amp:5},scopeTitle:'Scope',
     ctl:[{k:'KI',t:'seg',l:'K<sub>I</sub> في كتلة Gain',o:k3,free:{min:0.01,max:100}},ampCtl],fig:s=>simulinkSVG('PI',{kp:s.Kp,ki:s.KI}),sim:simPI,
     tables:[{title:'ثبت K<sub>p</sub> = 1 وغيّر K<sub>I</sub> (ص 33)',head:'K<sub>I</sub>',rows:k3.map(v=>({key:'k'+v,l:'K<sub>I</sub> = '+v})),match:s=>k3.includes(s.KI)?'k'+s.KI:null,cols:sCols,foot:'الكتاب يطلب رسم المنحنيات فقط؛ الأعمدة إضافة للمقارنة. المنحنيات المسجلة تظهر متقطعة على الشاشة.'}],
     ghostLabel:s=>'K<sub>I</sub> = '+fm(s.KI),
     results:rc=>{const r=rc[0];if(!(r['k0.1']&&r.k1&&r.k2))return '';return `<div class="callout"><b>ماذا تلاحظ؟</b> K<sub>I</sub> = 0.1: يقترب ببطء شديد (عند 10 s ما زال ${lt(fm(r['k0.1'].m.x0,2))}). K<sub>I</sub> = 1: يصل بلا تعدٍّ. K<sub>I</sub> = 2: أسرع مع تعدٍّ صغير (${lt(fm(r.k2.m.MpP,1)+'%')}). <b>نستنتج</b> أن K<sub>I</sub> يحدد سرعة إلغاء الخطأ، وزيادته تجلب التعدي.</div>`}},
    {key:'simB',label:'3) Simulink: K<sub>I</sub> = 1',figTitle:'الشكل (3-7) مع K<sub>I</sub> = 1',ref:'ص 33',s0:{Kp:0.1,KI:1,amp:5},scopeTitle:'Scope',
     ctl:[{k:'Kp',t:'seg',l:'K<sub>p</sub> في كتلة Gain1',o:k3,free:{min:0.01,max:100}},ampCtl],fig:s=>simulinkSVG('PI',{kp:s.Kp,ki:s.KI}),sim:simPI,
     tables:[{title:'ثبت K<sub>I</sub> = 1 وغيّر K<sub>p</sub> (ص 33)',head:'K<sub>p</sub>',rows:k3.map(v=>({key:'k'+v,l:'K<sub>p</sub> = '+v})),match:s=>k3.includes(s.Kp)?'k'+s.Kp:null,cols:sCols,foot:'الأعمدة إضافة للمقارنة.'}],
     ghostLabel:s=>'K<sub>p</sub> = '+fm(s.Kp),
     results:rc=>{const r=rc[0];if(!(r['k0.1']&&r.k1&&r.k2))return '';return `<div class="callout"><b>ماذا تلاحظ؟</b> K<sub>p</sub> = 0.1: تعدٍّ واضح (${lt(fm(r['k0.1'].m.MpP,1)+'%')}) لأن الحاكم شبه تكاملي. K<sub>p</sub> = 1: بلا تعدٍّ. K<sub>p</sub> = 2: صعود أولي سريع ثم اقتراب بطيء. <b>نستنتج</b> أن K<sub>p</sub> يزيد الإخماد ويسرّع البداية.</div>`}}
   ],
   steps:ctx=>{const R=(p,k)=>!!ctx.rec[p][0][k];return [
    {t:'شغّل الحاكم PI على اللوحة مع K<sub>p</sub> = 1',x:'P و I على ON، الخطوة 5 V والزمن 10 s. لاحظ أن الخرج يصل إلى 5 V تماماً. سجّل.',done:()=>R(0,'k1')},
    {t:'سجّل K<sub>p</sub> = 10 ثم 50',x:'قارن الخطأ وزمن الاستقرار في الصفوف الثلاثة، والمنحنيات على الشاشة.',done:()=>R(0,'k10')&&R(0,'k50')},
    {t:'افصل I وانظر الفرق',x:'مع P وحده يعود الخطأ المستقر (التجربة الأولى). أعد I إلى ON بعدها.',done:()=>!ctx.st[0].I&&!!ctx.did['run-board']},
    {t:'Simulink: ثبت K<sub>p</sub> = 1 وسجّل K<sub>I</sub> = 0.1 و1 و2',x:'اختر الجزء «2)» وسجّل القيم الثلاث؛ المنحنيات المسجلة تبقى على الشاشة للمقارنة.',done:()=>R(1,'k0.1')&&R(1,'k1')&&R(1,'k2')},
    {t:'Simulink: ثبت K<sub>I</sub> = 1 وسجّل K<sub>p</sub> = 0.1 و1 و2',x:'اختر الجزء «3)» وسجّل، ثم اقرأ «ماذا تلاحظ» تحت الجدول.',done:()=>R(2,'k0.1')&&R(2,'k1')&&R(2,'k2')}]}});
 },
 quiz:[
  {q:'معادلة الحاكم PI هي:',o:['y = K<sub>p</sub>e + K<sub>I</sub>∫e dt','y = K<sub>p</sub>e + K<sub>d</sub>de/dt','y = K<sub>I</sub>∫e dt فقط','y = K<sub>p</sub>e فقط'],c:0,e:'مجموع التناسبي والتكاملي على التوازي — الشكل (3-7).'},
  {q:'الخطأ المستقر مع الحاكم PI ونظام PT1:',o:['صفر','w<sub>0</sub>/(1+K<sub>p</sub>)','يزيد مع K<sub>p</sub>','نصف الخطوة'],c:0,e:'الجزء التكاملي يلغيه.'},
  {q:'ما فائدة الجزء التناسبي في الحاكم PI مقارنة بالتكاملي وحده؟',o:['يلغي الخطأ','يزيد الإخماد ويسرّع البداية فيقل التعدي','يزيد التذبذب','لا فائدة له'],c:1,e:'مع K<sub>I</sub> = 1: K<sub>p</sub> = 0.1 يعطي تعدياً واضحاً، و K<sub>p</sub> = 1 بلا تعدٍّ.'},
  {q:'مع K<sub>p</sub> = 1 و K<sub>I</sub> = 0.1 في الشكل (3-7) يكون الخرج:',o:['متذبذباً بشدة','يقترب ببطء شديد من القيمة النهائية','يتجاوزها 50 %','لا يتحرك'],c:1,e:'التكامل الصغير يكمل الخطأ الباقي ببطء.'},
  {q:'زيادة K<sub>I</sub> مع ثبات K<sub>p</sub>:',o:['تبطئ الاستجابة','تسرّع إلغاء الخطأ وتزيد التعدي','تزيد الخطأ المستقر','لا تؤثر'],c:1,e:'K<sub>I</sub> = 2 أعطى تعدياً صغيراً بينما K<sub>I</sub> = 1 بلا تعدٍّ.'},
  {q:'الدالة المغلقة للشكل (3-7) هي:',o:['(K<sub>p</sub>s+K<sub>I</sub>)/(s²+(1+K<sub>p</sub>)s+K<sub>I</sub>)','K<sub>I</sub>/(s²+s+K<sub>I</sub>)','K<sub>p</sub>/(s+1+K<sub>p</sub>)','1/(s+1)'],c:0,e:'C(s)G(s)/(1+C(s)G(s)) مع C = K<sub>p</sub>+K<sub>I</sub>/s و G = 1/(s+1).'},
  {q:'إذا فصلنا المفتاح I في تجربة PI:',o:['يصبح الحاكم P ويعود الخطأ المستقر','يصبح I','يتوقف النظام','لا يتغير شيء'],c:0,e:'P وحده لا يلغي الخطأ المستقر.'}
 ]
});

/* ======================================================================
   Lesson 4 — PID by simulation on the book's DC-motor model (ص 35–39)
   G(s) = 21.81 / (0.0063 s² + 0.379 s + 1) — every number here is from the book (no trainer fields)
   ====================================================================== */
const GA=0.0063,GB=0.379,GK=21.81;
const pidTF=(Kp,Ki,Kd)=>({num:[GK*Kd,GK*Kp,GK*Ki],den:[GA,GB+GK*Kd,1+GK*Kp,GK*Ki]});
const TWS=[0.5,2,5,10].map(v=>[v,lt(v+' s')]);
const PID_COLS=md=>[{h:'زمن الصعود t<sub>r</sub> (s)',f:m=>tF(m.tr)},md==='book'?{h:'زمن الصعود t<sub>r</sub> (s)',f:m=>tF(m.tr)}:{h:'زمن الاستقرار t<sub>s</sub> (s)',f:m=>TSV(m)},{h:'قيمة الخرج X<sub>0</sub>',f:m=>m.x0,dp:3},{h:'الخطأ e',f:m=>m.e,dp:3},{h:'التعدي M<sub>p</sub>',f:m=>m.Mp>0?fm(m.MpP,1)+' %':'0'}];
const PID_NOTE=md=>md==='book'?'في الكتاب العمودان الثاني والثالث بالعنوان نفسه «زمن الصعود t<sub>r</sub> (s)»، فيتكرر الرقم نفسه.':'جعلنا العمود المكرر «زمن الاستقرار t<sub>s</sub>» (2 %) لأنه المقدار الذي تطلبه بقية تجارب الوحدة. وقد يكون المقصود t<sub>d</sub> أو t<sub>p</sub>؛ القياسان يظهران أيضاً تحت الشاشة.';
B.lesson({
 id:'u3-l4',unit:3,order:4,pages:'35–39',
 title:'التجربة الرابعة: الحاكم التناسبي التكاملي التفاضلي PID- Controller',
 summary:'تجربة محاكاة كاملة بـ MATLAB/Simulink: نتحكم في سرعة محرك تيار مستمر نموذجه G(s) = 21.81/(0.0063s²+0.379s+1) بحاكم PID، ونغيّر كل جزء على حدة (K<sub>p</sub> ثم K<sub>i</sub> ثم K<sub>d</sub>) ونسجل زمن الصعود والخرج والخطأ والتعدي.',
 theory:[
  {note:'هذه التجربة كلها على MATLAB/Simulink (لا تستخدم لوحة Com3Lab).'},
  {h:'الهدف من التجربة',ref:'ص 35',html:String.raw`<ul><li>استخدام برنامج MATLAB لدراسة التحكم في سرعة محرك تيار مستمر بواسطة PID.</li><li>تأثير العنصر التناسبي من الحاكم PID على استجابة النظام المتحكم فيه.</li><li>تأثير العنصر التكاملي من الحاكم PID على استجابة النظام المتحكم فيه.</li><li>تأثير العنصر التفاضلي من الحاكم PID على استجابة النظام المتحكم فيه.</li><li>التحكم في نظام من الدرجة الثانية وهو محرك للتيار المستمر ونموذجه الرياضي الحقيقي هو:</li></ul>$$G(s)=\frac{21.81}{0.0063\,s^2+0.379\,s+1}$$`},
  {h:'الأجهزة ومكونات التجربة',ref:'ص 35',html:'<ul><li>جهاز حاسب.</li><li>برنامج MATLAB يحتوي على Simulink و Control Tool Box.</li></ul>'},
  {h:'نموذج المحرك',html:String.raw`<div class="callout">${ADD}نقرأ النموذج: الكسب الاستاتيكي (عند \(s=0\)) هو \(21.81\)، أي أن كل \(1\ \text{V}\) ثابت يعطي في النهاية 21.81 وحدة سرعة. وجذرا المقام \(0.0063s^2+0.379s+1=0\):</div>$$s_1 \approx -2.77 \qquad s_2 \approx -57.4$$<p>أي ثابتان زمنيان \(\approx 0.362\ \text{s}\) و\(\approx 0.0174\ \text{s}\): الأول بطيء (القصور الذاتي الميكانيكي) والثاني سريع (دائرة المنتج الكهربائية). النظام من الرتبة الثانية «مخمد زائد» (\(\zeta \approx 2.39\)) فلا يتذبذب وحده.</p>`},
  {h:'الحاكم PID',html:String.raw`<div class="callout">${ADD}الحاكم PID مجموع ثلاثة أجزاء على التوازي — الشكل (3-8):</div>$$y = K_p\,e + K_i\int e\,dt + K_d\,\frac{de}{dt}$$<div class="cl-tbl"><table class="tt"><thead><tr><th>زيادة …</th><th>زمن الصعود</th><th>التعدي</th><th>زمن الاستقرار</th><th>الخطأ المستقر</th></tr></thead><tbody><tr><td>\(K_p\)</td><td>يقل</td><td>يزيد</td><td>تغير صغير</td><td>يقل</td></tr><tr><td>\(K_i\)</td><td>يقل</td><td>يزيد</td><td>يزيد</td><td>يزول</td></tr><tr><td>\(K_d\)</td><td>تغير صغير</td><td>يقل</td><td>يقل</td><td>لا يتغير</td></tr></tbody></table></div><p class="sub">جدول تقريبي شائع في المراجع؛ قد يختلف قليلاً حسب النظام. لاحظ مثلاً في المختبر أن \(K_d\) مع هذا المحرك يقصّر الصعود جداً، لأن كتلة du/dt تعطي «نبضة» كبيرة لحظة الخطوة.</p><p>مع الحلقة المغلقة:</p><div class="cl-tbl">$$\frac{X(s)}{W(s)} = \frac{21.81\,(K_d s^2+K_p s+K_i)}{0.0063 s^3+(0.379+21.81K_d)s^2+(1+21.81K_p)s+21.81K_i}$$</div><p> وعند \(K_i=0\): الخرج المستقر \(X_0=\dfrac{21.81K_p}{1+21.81K_p}\) لخطوة وحدة.</p>`},
  {h:'خطوات إجراء التجربة',ref:'ص 35',html:'<ul><li>نشغل برنامج MATLAB.</li><li>ننقر على أيقونة SIMULINK.</li><li>نرسم مخطط المحاكاة الموضح في شكل (3-8) باستعمال Simulink.</li><li>نطبق الإجراءات التالية:</li></ul>'},
  {fig:'(3-8)',ref:'ص 36',caption:'مخطط التجربة: Step ← Add ← ثلاثة فروع متوازية: Gain (1)، و Gain1 (0.1) ← Integrator 1/s، و Gain2 (0.1) ← Derivative du/dt، تجتمع في Add1 ← Transfer Fcn للمحرك ← Mux ← Scope، مع تغذية راجعة سالبة. أي القيم المرسومة K<sub>p</sub> = 1، K<sub>i</sub> = 0.1، K<sub>d</sub> = 0.1.',draw:()=>box(simulinkSVG('PID'),760,1)},
  {h:'الجزء الأول: تأثير K<sub>p</sub>',ref:'ص 36',html:`<p>باعتبار K<sub>d</sub> = 0 و K<sub>i</sub> = 0 ثابتتين ونغير قيم K<sub>p</sub> حسب الجدول التالي:</p>${ptable(['K<sub>p</sub>','زمن الصعود t<sub>r</sub> (s)','زمن الصعود t<sub>r</sub> (s)','قيمة الخرج X<sub>0</sub>','الخطأ e','التعدي M<sub>p</sub>'],['0.1','0.5','2'])}<p>ماذا تلاحظ؟ — ماذا تستنتج؟ — <b>ما تأثير الحاكم التناسبي على متغير الخرج؟</b></p>`},
  {h:'الجزء الثاني: تأثير K<sub>i</sub>',ref:'ص 37',html:`<p>باعتبار K<sub>p</sub> = 0.1 و K<sub>d</sub> = 0 ثابتتين ونغير قيم K<sub>i</sub> حسب الجدول التالي:</p>${ptable(['K<sub>i</sub>','زمن الصعود t<sub>r</sub> (s)','زمن الصعود t<sub>r</sub> (s)','قيمة الخرج X<sub>0</sub>','الخطأ e','التعدي M<sub>p</sub>'],['0.05','0.1','0.5','1'])}<p>ماذا تلاحظ؟ — ماذا تستنتج؟ — <b>ما تأثير الحاكم التكاملي على متغير الخرج؟</b></p>`},
  {h:'الجزء الثالث: تأثير K<sub>d</sub>',ref:'ص 38',html:`<p>باعتبار K<sub>p</sub> = 0.5 و K<sub>i</sub> = 0 ثابتتين ونغير قيم K<sub>d</sub> حسب الجدول التالي:</p>${ptable(['K<sub>d</sub>','زمن الصعود t<sub>r</sub> (s)','زمن الصعود t<sub>r</sub> (s)','قيمة الخرج X<sub>0</sub>','الخطأ e','التعدي M<sub>p</sub>'],['0.1','0.5','1'])}<p>ماذا تلاحظ؟ — ماذا تستنتج؟ — <b>ما تأثير الحاكم التفاضلي على متغير الخرج؟</b></p>`},
  {err:'في الجداول الثلاثة (ص 36–38) عمودان متتاليان بالعنوان نفسه «زمن الصعود t<sub>r</sub> (s)» — تكرار خاطئ. والأرجح أن أحدهما زمن الاستقرار t<sub>s</sub> (أو t<sub>d</sub> أو t<sub>p</sub>). في المختبر مفتاح «كما في الكتاب / المصحح» لرؤوس الأعمدة؛ في «المصحح» جعلنا العمود الثاني t<sub>s</sub>.'},
  {note:`${ADD}الكتاب لا يذكر قيمة الخطوة ولا زمن المحاكاة. نستعمل خطوة وحدة (القيمة الافتراضية لكتلة Step، وهي تناسب «قيمة الخرج X<sub>0</sub>» بلا وحدة)، وزمن عرض تختاره (الافتراضي 2 s، و10 s لجزء K<sub>i</sub> لأن الاستجابة بطيئة). وتعريفات t<sub>r</sub> و M<sub>p</sub> و t<sub>s</sub> كما في الدرس 3.2.`},
  {h:'أسئلة ومناقشة',ref:'ص 39',html:
   Q(1,'ما تأثير الجزء التناسبي من الحاكم PID على الاستجابة؟','زيادة \\(K_p\\) تسرّع الصعود (من 0.23 s إلى 0.017 s تقريباً) وتقلل الخطأ المستقر (0.314 ← 0.022) لكنه لا يزول، وتزيد التعدي (من صفر إلى نحو 30 %).')+
   Q(2,'ما تأثير الجزء التناسبي التكاملي من الحاكم PID على الاستجابة؟','إضافة \\(K_i\\) تجعل الخطأ المستقر صفراً لكل القيم. \\(K_i\\) الصغير (0.05) يصل ببطء شديد، و\\(K_i\\) الكبير (0.5، 1) يصل أسرع لكن بتعدٍّ (نحو 8 % ثم 23 %).')+
   Q(3,'ما تأثير الجزء التكاملي التفاضلي من الحاكم PID على الاستجابة؟','الجزء التفاضلي يرد على سرعة تغير الخطأ: يعطي دفعة قوية لحظة الخطوة فيقصر الصعود جداً، ولا يغير الخرج المستقر (يبقى 0.916 مع \\(K_p=0.5\\)). ومع الجزء التكاملي يحسّن الإخماد. لكن \\(K_d\\) الكبير يجعل إشارة التحكم نبضات كبيرة ويُبطئ الاقتراب الأخير («ذيل»).')+
   Q(4,'ما تأثير الحاكم التناسبي التكاملي التفاضلي على إشارة الخطأ؟','يجعلها تصغر بسرعة (P و D) ثم تصل إلى الصفر في الحالة المستقرة (I)، مع تعدٍّ محدود إذا اختيرت المعاملات بتوازن.')},
  {err:'صُححت في النص: «عل» ← «على»، و«نضام» ← «نظام»، و«نقر» ← «ننقر». ورقم الشكل (3-8) مستعمل في الكتاب لشكلين: هذا المخطط (ص 36) وتوصيل التحكم الرقمي في السرعة (ص 41).'}
 ],
 lab:(el)=>{
  const KP=[0.1,0.5,2],KI=[0.05,0.1,0.5,1],KD=[0.1,0.5,1];
  const run=s=>{const p=pidTF(s.Kp,s.Ki,s.Kd);const r=tfStep(p.num,p.den,1,s.Tw);const m=measure(r);return {r,m,ch:CH_M(r),meters:[['t<sub>r</sub>',tF(m.tr)+' s'],['زمن الاستقرار t<sub>s</sub>',TSV(m)+' s',m.ts>m.Tw],['X<sub>0</sub>',fm(m.x0,3)],['e',fm(m.e,3)],['M<sub>p</sub>',m.Mp>0?fm(m.MpP,1)+' %':'0'],['t<sub>d</sub> / t<sub>p</sub>',tF(m.td)+' / '+TPV(m)+' s']],
    note:m.ts>m.Tw&&!m.osc?'الخرج لم يستقر داخل زمن العرض: اختر زمن عرض أطول لتقرأ t<sub>s</sub> و X<sub>0</sub> النهائية.':''}};
  const fig=s=>simulinkSVG('PID',{kp:s.Kp,ki:s.Ki,kd:s.Kd});
  const tw={k:'Tw',t:'seg',l:'زمن المحاكاة (العرض)',o:TWS};
  const T=(title,head,vals,key)=>({title,head,rows:vals.map(v=>({key:'k'+v,l:head+' = '+v})),match:s=>vals.includes(s[key])?'k'+s[key]:null,cols:PID_COLS,modes:true,modeNote:PID_NOTE});
  ctrlBench(el,{k:'ld',tp:null,
   parts:[
    {key:'kp',label:'1) تأثير K<sub>p</sub>',figTitle:'الشكل (3-8) مع K<sub>i</sub> = 0 و K<sub>d</sub> = 0',ref:'ص 36',s0:{Kp:0.1,Ki:0,Kd:0,Tw:2},scopeTitle:'Scope',
     ctl:[{k:'Kp',t:'seg',l:'K<sub>p</sub> (Gain)',o:KP,free:{min:0.001,max:100}},tw],fig,sim:run,tables:[T('الجدول (ص 36)','K<sub>p</sub>',KP,'Kp')],ghostLabel:s=>'K<sub>p</sub> = '+fm(s.Kp),
     results:rc=>{const r=rc[0];if(!(r['k0.1']&&r['k0.5']&&r.k2))return '';return `<div class="callout"><b>ماذا تلاحظ؟</b> بزيادة K<sub>p</sub>: زمن الصعود يقصر (${lt(KP.map(v=>tF(r['k'+v].m.tr)).join(' ← '))} s)، والخطأ يقل (${lt(KP.map(v=>fm(r['k'+v].m.e,3)).join(' ← '))}) ولا يزول، والتعدي يزيد (${lt(KP.map(v=>fm(r['k'+v].m.MpP,1)+'%').join(' ← '))}).</div>`}},
    {key:'ki',label:'2) تأثير K<sub>i</sub>',figTitle:'الشكل (3-8) مع K<sub>p</sub> = 0.1 و K<sub>d</sub> = 0',ref:'ص 37',s0:{Kp:0.1,Ki:0.05,Kd:0,Tw:10},scopeTitle:'Scope',
     ctl:[{k:'Ki',t:'seg',l:'K<sub>i</sub> (Gain1)',o:KI,free:{min:0,max:100}},tw],fig,sim:run,tables:[T('الجدول (ص 37)','K<sub>i</sub>',KI,'Ki')],ghostLabel:s=>'K<sub>i</sub> = '+fm(s.Ki),
     results:rc=>{const r=rc[0];if(!KI.every(v=>r['k'+v]))return '';return `<div class="callout"><b>ماذا تلاحظ؟</b> الخطأ المستقر صار صفراً تقريباً لكل القيم (بشرط أن يكفي زمن العرض)، وبزيادة K<sub>i</sub> يسرع الوصول ويظهر التعدي (${lt(KI.map(v=>fm(r['k'+v].m.MpP,1)+'%').join(' ← '))}).</div>`}},
    {key:'kd',label:'3) تأثير K<sub>d</sub>',figTitle:'الشكل (3-8) مع K<sub>p</sub> = 0.5 و K<sub>i</sub> = 0',ref:'ص 38',s0:{Kp:0.5,Ki:0,Kd:0.1,Tw:2},scopeTitle:'Scope',
     ctl:[{k:'Kd',t:'seg',l:'K<sub>d</sub> (Gain2)',o:KD,free:{min:0,max:100}},tw],fig,sim:run,tables:[T('الجدول (ص 38)','K<sub>d</sub>',KD,'Kd')],ghostLabel:s=>'K<sub>d</sub> = '+fm(s.Kd),
     results:rc=>{const r=rc[0];if(!KD.every(v=>r['k'+v]))return '';return `<div class="callout"><b>ماذا تلاحظ؟</b> زيادة K<sub>d</sub> تجعل بداية الصعود شبه فورية، والخرج المستقر النظري لا يتغير (${lt('21.81×0.5/(1+21.81×0.5) ≈ 0.916')})، لكن الاقتراب الأخير يصبح أبطأ («ذيل») فيطول t<sub>s</sub>. وفي الواقع تعطي du/dt نبضة كبيرة جداً في إشارة التحكم لحظة الخطوة.</div>`}},
    {key:'free',label:'4) المخطط كما رُسم',figTitle:'الشكل (3-8) بالقيم المرسومة',ref:'ص 36',s0:{Kp:1,Ki:0.1,Kd:0.1,Tw:2},scopeTitle:'Scope',
     ctl:[{k:'Kp',t:'num',l:'K<sub>p</sub>',min:0,max:100},{k:'Ki',t:'num',l:'K<sub>i</sub>',min:0,max:100},{k:'Kd',t:'num',l:'K<sub>d</sub>',min:0,max:100},tw],fig,sim:run,tables:[],
     ghostLabel:s=>`${fm(s.Kp)} / ${fm(s.Ki)} / ${fm(s.Kd)}`,note:'جرّب أي مجموعة من المعاملات الثلاثة. «سجّل» هنا يحفظ المنحنى للمقارنة فقط.'}
   ],
   steps:ctx=>{const R=(p,k)=>!!ctx.rec[p][0][k];return [
    {t:'الجزء الأول: سجّل K<sub>p</sub> = 0.1 و0.5 و2',x:'K<sub>i</sub> = 0 و K<sub>d</sub> = 0. بعد كل قيمة اضغط «سجّل في الجدول».',done:()=>R(0,'k0.1')&&R(0,'k0.5')&&R(0,'k2')},
    {t:'بدّل رؤوس الأعمدة إلى «المصحح»',x:'في الكتاب عمودان باسم «زمن الصعود». اختر «المصحح» فوق الجدول لترى العمود الثاني زمن الاستقرار.',done:()=>!!ctx.did.mdfixed},
    {t:'الجزء الثاني: سجّل K<sub>i</sub> = 0.05 و0.1 و0.5 و1',x:'زمن العرض 10 s لأن K<sub>i</sub> الصغير بطيء. لاحظ أن الخطأ يصبح صفراً.',done:()=>KI.every(v=>R(1,'k'+v))},
    {t:'الجزء الثالث: سجّل K<sub>d</sub> = 0.1 و0.5 و1',x:'K<sub>p</sub> = 0.5 و K<sub>i</sub> = 0. لاحظ أن X<sub>0</sub> النهائية لا تتغير بـ K<sub>d</sub>؛ اختر 10 s لتتأكد.',done:()=>KD.every(v=>R(2,'k'+v))},
    {t:'جرّب المخطط بقيمه المرسومة',x:'اختر «4)» (1، 0.1، 0.1) ثم غيّر القيم بنفسك وابحث عن استجابة سريعة بلا تعدٍّ كبير ولا خطأ.',done:()=>ctx.pi===3&&!!ctx.did['run-free']}]}});
 },
 quiz:[
  {q:'الكسب الاستاتيكي للمحرك G(s) = 21.81/(0.0063s²+0.379s+1) هو:',o:['0.0063','0.379','1','21.81'],c:3,e:'عند s = 0 تصبح G = 21.81.'},
  {q:'مع K<sub>i</sub> = 0 و K<sub>d</sub> = 0 و K<sub>p</sub> = 0.5 وخطوة وحدة، الخرج المستقر تقريباً:',o:['0.5','0.686','0.916','1'],c:2,e:'21.81×0.5/(1+21.81×0.5) ≈ 0.916.'},
  {q:'أي جزء من PID يلغي الخطأ المستقر؟',o:['التناسبي','التكاملي','التفاضلي','لا أحد'],c:1,e:'مع K<sub>i</sub> > 0 صار الخطأ صفراً في الجزء الثاني.'},
  {q:'زيادة K<sub>d</sub> (مع K<sub>p</sub> = 0.5 و K<sub>i</sub> = 0):',o:['تغير الخرج المستقر','لا تغير الخرج المستقر وتسرّع بداية الصعود','تلغي الخطأ','تجعل النظام غير مستقر دائماً'],c:1,e:'المشتق صفر في الحالة المستقرة، فلا يؤثر على X<sub>0</sub>.'},
  {q:'زيادة K<sub>p</sub> من 0.1 إلى 2 مع هذا المحرك:',o:['تقلل التعدي','تزيد التعدي وتقلل الخطأ','لا تغير الخطأ','تبطئ الصعود'],c:1,e:'التعدي من صفر إلى نحو 30 %، والخطأ من 0.314 إلى 0.022.'},
  {q:'ما الخطأ في جداول هذه التجربة في الكتاب؟',o:['لا يوجد خطأ','عمود «زمن الصعود» مكرر مرتين','لا يوجد عمود للخطأ','قيم K<sub>p</sub> ناقصة'],c:1,e:'الأرجح أن أحد العمودين زمن الاستقرار.'},
  {q:'في الشكل (3-8) ما وظيفة الكتلة Mux؟',o:['تجمع الإشارات جمعاً حسابياً','تضم إشارتي الدخل والخرج لتظهرا معاً على Scope','تشتق الإشارة','تكامل الإشارة'],c:1,e:'Mux يجمع إشارتين في خط واحد إلى Scope دون جمع حسابي.'}
 ]
});

/* ======================================================================
   Shared digital pieces (lessons 5–6)
   ====================================================================== */
const niceT=v=>{for(const q of [0.05,0.1,0.2,0.3,0.5,1,2,3,5,10,20,30,50,100])if(q>=v*0.999)return q;return 100};
const CH_D=r=>[{arr:r.u,col:'--live',lab:'Y1 = y (خرج الحاكم الرقمي)',short:'Y1'},{arr:r.x,col:'--blue',lab:'Y2 = x (الخرج المقاس)',short:'Y2'}];
const CHR={0:{P:[0.3],PI:[0.35,1.2],PID:[0.6,1,0.5]},20:{P:[0.7],PI:[0.6,1],PID:[0.95,1.35,0.47]}};
const chrSet=(id,ty,os)=>{const c=CHR[os][ty];const Kp=c[0]*id.Tg/(id.Ks*Math.max(id.Tu,1e-6));return {Kp:B.round(Kp,3),Ti:c[1]!=null?B.round(c[1]*id.Tg,4):null,Td:c[2]!=null?B.round(c[2]*id.Tu,4):null}};
const identify=r=>{const g=tangent(r);const w0=r.w[0]||1;return {Ks:(r.xf-r.x[0])/w0,Tu:g?g.Tu:0,Tg:g?g.Tg:0,g}};
const CHR_TABLE=String.raw`<div class="cl-tbl"><table class="tt"><thead><tr><th rowspan="2">الحاكم</th><th colspan="3">لتغير القيمة المطلوبة w — بلا تعدٍّ (0 %)</th><th colspan="3">لتغير القيمة المطلوبة w — تعدٍّ 20 %</th></tr><tr><th>\(K_p\)</th><th>\(T_i\)</th><th>\(T_d\)</th><th>\(K_p\)</th><th>\(T_i\)</th><th>\(T_d\)</th></tr></thead><tbody>
<tr><td>P</td><td>\(0.3\,\frac{T_g}{K_s T_u}\)</td><td>—</td><td>—</td><td>\(0.7\,\frac{T_g}{K_s T_u}\)</td><td>—</td><td>—</td></tr>
<tr><td>PI</td><td>\(0.35\,\frac{T_g}{K_s T_u}\)</td><td>\(1.2\,T_g\)</td><td>—</td><td>\(0.6\,\frac{T_g}{K_s T_u}\)</td><td>\(T_g\)</td><td>—</td></tr>
<tr><td>PID</td><td>\(0.6\,\frac{T_g}{K_s T_u}\)</td><td>\(T_g\)</td><td>\(0.5\,T_u\)</td><td>\(0.95\,\frac{T_g}{K_s T_u}\)</td><td>\(1.35\,T_g\)</td><td>\(0.47\,T_u\)</td></tr></tbody></table></div>
<p class="sub">وللتشويش (لا لتغير w) جدول آخر في المراجع: بلا تعدٍّ P: \(0.3\)، PI: \(0.6\) و\(T_i=4T_u\)، PID: \(0.95\) و\(T_i=2.4T_u\) و\(T_d=0.42T_u\)؛ وبتعدٍّ 20 % P: \(0.7\)، PI: \(0.7\) و\(T_i=2.3T_u\)، PID: \(1.2\) و\(T_i=2T_u\) و\(T_d=0.42T_u\) (المعامل يُضرب في \(\frac{T_g}{K_s T_u}\)).</p>`;
const DIG_EQ=String.raw`<div class="callout">${ADD}الحاكم الرقمي لا يرى الإشارة باستمرار: كل <b>زمن عيّنة</b> \(T_0\) يقرأ محوّل <b>A/D</b> الخطأ \(e_k = w-x\) ويحوّله إلى رقم، ثم يحسب <b>البرنامج (Algorithm)</b> إشارة التحكم، ثم يحوّلها محوّل <b>D/A</b> إلى جهد يبقى ثابتاً حتى العيّنة التالية (لذلك يظهر خرج الحاكم على شكل درجات سلّم). صيغة PID الرقمية المستعملة في المختبر:</div><div class="cl-tbl">$$y_k = K_p\left[e_k + \frac{T_0}{T_i}\sum_{j\le k} e_j + \frac{T_d}{T_0}\left(e_k-e_{k-1}\right)\right]$$</div><p>\(T_i\) زمن التكامل (كلما صغر قوي الجزء التكاملي: \(K_I = K_p/T_i\))، و\(T_d\) زمن التفاضل (\(K_d = K_p T_d\)). إذا كان \(T_0\) صغيراً جداً مقارنة بزمن النظام يتصرف الحاكم الرقمي تقريباً مثل الحاكم التماثلي؛ وإذا كبر \(T_0\) أضاف تأخيراً قد يسبب التذبذب.</p>`;

/* ======================================================================
   Lesson 5 — digital PID speed control (ص 40–41)
   ====================================================================== */
const SP_DEFS=()=>[
  {k:'Ks',label:'كسب وحدة السرعة (جهد x<sub>S</sub> ÷ جهد y<sub>S</sub>)',unit:'',value:0.9,min:0.1,max:5,step:0.01},
  {k:'T1',label:'ثابت زمن التسارع (يكبر مع ثقل العضو الدوار)',unit:'s',value:0.5,min:0.05,max:20,step:0.01},
  {k:'T2',label:'الثابت الزمني لقياس السرعة (المولد والمحوّل f/u)',unit:'s',value:0.1,min:0.005,max:5,step:0.005},
  {k:'Tt',label:'تأخير قياس السرعة (عدّ النبضات RPM/TTL)',unit:'s',value:0.05,min:0.001,max:2,step:0.001},
  {k:'T0',label:'زمن العيّنة للحاكم الرقمي T<sub>0</sub>',unit:'s',value:0.01,min:0.0005,max:0.5,step:0.0005},
  {k:'Um',label:'أعلى جهد يخرجه الحاكم (المحرك يدور في اتجاه واحد: من 0)',unit:'V',value:10,min:1,max:30,step:0.5}];
const spPlant=P=>PLANT.pt2(P.Ks,P.T1,P.T2,P.Tt);
const spTw=P=>niceT(4*(P.T1+P.T2+P.Tt));
B.lesson({
 id:'u3-l5',unit:3,order:5,pages:'40–41',
 title:'التجربة الخامسة: الحاكم PID الرقمي — التحكم الرقمي في سرعة محرك تيار مستمر Automatic Speed Control',
 summary:'نحوّل السرعة إلى جهد x<sub>S</sub>، ونرسم استجابة المحرك لخطوة فنستخرج K<sub>s</sub> و T<sub>u</sub> و T<sub>g</sub> بطريقة المماس، ثم نصمم الحاكم PID الرقمي بقواعد شين وهرونس وريسويك ونختبره في الحلقة المغلقة.',
 theory:[
  {h:'الهدف من التجربة',ref:'ص 40',html:String.raw`<p>أن يتعرف المتدرب من خلال هذه التجربة على:</p><ul><li>الأجهزة المستخدمة في مختبر التحكم Com3Lab.</li><li>طريقة تشغيل الكرت الإلكتروني المبني عليه هذا المختبر.</li><li>تحويل السرعة إلى جهد مستمر متناسب مع السرعة يمكن قياسه عند القاعدة \(x_s\).</li><li>من تحليل منحنى استجابة سرعة النظام المتحكم يمكننا حساب \(K_s, T_u, T_g\).</li><li>تصميم الحاكم PID باتباع خطوات البحث عن الحل الأمثل حسب شين وهرونس وريسويك واختبارها في حالة الحلقة المغلقة.</li></ul>`},
  {h:'الأجهزة والمكونات',ref:'ص 40',html:String.raw`<ul><li>مصدر التغذية (Power Supply).</li><li>الكرت الإلكتروني.</li><li>وحدة السرعة المتحكم فيها Speed Control Unit.</li><li>جهاز راسم ذبذبات Oscilloscope.</li><li>مولد إشارات Function Generator.</li><li>النظام الميكانيكي (محرك تيار مستمر محمل ميكانيكياً مع مولد)، وإذا لم يكن موجوداً نكتفي بمحرك المروحة في اللوحة COM3LAB.</li></ul>`},
  {h:'الحاكم الرقمي',html:DIG_EQ},
  {h:'استخراج \\(K_s\\) و\\(T_u\\) و\\(T_g\\) بطريقة المماس',html:String.raw`<div class="callout">${ADD}الكتاب يطلب هذه الثلاثة ولا يعرّفها. المحرك مع المولد وقياس السرعة أكثر من رتبة أولى، فاستجابته للخطوة تبدأ ببطء ثم تسرع ثم تستقر (شكل حرف S). نرسم <b>المماس عند نقطة الانعطاف</b> (أشد نقطة ميلاً):</div><ul><li><b>\(K_s\)</b> (معامل التناسب): التغير في الخرج ÷ التغير في الدخل بعد الاستقرار: \(K_s = \Delta x / \Delta y\).</li><li><b>\(T_u\)</b> (زمن التأخير): من لحظة الخطوة حتى يقطع المماس مستوى الخرج الابتدائي.</li><li><b>\(T_g\)</b> (زمن التعويض): المسافة الزمنية بين قطع المماس للمستوى الابتدائي وقطعه للقيمة النهائية.</li></ul><p>النسبة \(T_u/T_g\) تدل على صعوبة التحكم: كلما صغرت كان النظام أسهل.</p>`},
  {fig:'',caption:'المماس عند نقطة الانعطاف و T<sub>u</sub> و T<sub>g</sub> على استجابة وحدة السرعة (توضيح للمتدرب — بالقيم التوضيحية للمحاكاة).',draw:()=>{const P=Object.fromEntries(SP_DEFS().map(d=>[d.k,d.value]));const r=simLoop({plant:spPlant(P),Tw:spTw(P),w0:5,sat:[0,P.Um],ctrl:{type:'open'}});return box(scopeSVG({r,ch:[{arr:r.x,col:'--blue'}],tan:tangent(r)}),560)}},
  {h:'قواعد شين وهرونس وريسويك (Chien, Hrones, Reswick)',html:`<div class="callout">${ADD}الكتاب يذكر الطريقة بالاسم فقط. هذه قيمها المعروفة في المراجع، للحاكم بالصيغة \\(y = K_p\\left[e + \\frac{1}{T_i}\\int e\\,dt + T_d\\frac{de}{dt}\\right]\\):</div>${CHR_TABLE}`},
  {h:'خطوات إجراء التجربة',ref:'ص 40–41',html:String.raw`<ol><li>شغل لوحة العمليات وأجب عن الأسئلة التي تسمح بمواصلة العمل.</li><li>وصل التجربة كما هو موضح في الشكل (3-8)؛ من الأفضل استخدام النظام (محرك + مولد) المثبت على الطاولة عوضاً عن محرك COM3LAB.</li><li>استعمل راسم الذبذبات للحصول على الخرج على القناة \(Y_1\).</li><li>قبل تشغيل التجربة اطلب من المسؤول عن المختبر مراجعة التوصيلات ومعايرة الأجهزة.</li><li>قم بتشغيل التجربة وسجل إشارة القناة \(Y_1\) على راسم الذبذبات.</li></ol>`},
  {fig:'(3-8)',ref:'ص 41',caption:'التحكم الرقمي في السرعة (مبسّط عن لقطة Com3Lab): لوحة Digital Controller/Line (w ← دائرة جمع − x ← A/D ← Algorithm ← D/A ← y)؛ y ← y<sub>S</sub> (دخل المحرك) وأيضاً ← Y1؛ x<sub>S</sub> (جهد السرعة) ← x (تغذية راجعة أسفل اللوحات) وأيضاً ← Y2؛ COM ← الأرضي. لا يظهر مولد الإشارة في اللقطة.',draw:()=>box(digitalSVG({sys:'speed'}),760,1)},
  {h:'تسجيل النتائج',ref:'ص 41',html:String.raw`<ol><li>ارسم استجابة النظام لإشارة الخطوة.</li><li>استنتج معامل التناسب \(K_s\) ……………</li><li>استنتج زمن التأخير \(T_u\) ……………</li><li>استنتج زمن التعويض \(T_g\) ……………</li></ol><p class="sub">لا يذكر الكتاب قيمة الخطوة ولا منحنى نموذجياً ولا معادلات حساب \(K_p\) و\(T_i\) و\(T_d\).</p>`},
  {h:'أسئلة ومناقشة',ref:'ص 41',html:
   Q(1,'اختر العبارة الصحيحة التي تنطبق على منحنى خواص النظام: (أ) النظام المتحكم فيه يصل إلى قيمة الدخل. (ب) النظام المتحكم فيه يصعد كلما زاد الزمن. (ج) النظام المتحكم فيه يستجيب بسرعة لتغير إشارة الدخل.','في الحلقة المفتوحة (استجابة المحرك وحده) العبارة الأنسب (ب): الخرج يصعد مع الزمن حتى يستقر، ولا يصل إلى قيمة الدخل لأن \\(K_s \\ne 1\\)، ولا يستجيب فوراً (يوجد تأخير \\(T_u\\)). أما في الحلقة المغلقة مع حاكم فيه جزء تكاملي فيصل الخرج إلى قيمة الدخل، أي (أ).')+
   Q(2,'ماذا يحدث للنظام في حالة زيادة المعامل \\(K_p\\) إلى قيمة عالية؟','تكبر إشارة التحكم فيسرع الصعود في البداية، لكن يزيد التعدي، ومع التأخير \\(T_u\\) وزمن العيّنة \\(T_0\\) يبدأ الخرج يتذبذب حول القيمة المطلوبة، وعند قيمة عالية جداً يصبح التذبذب مستمراً (النظام غير مستقر)، وتصل إشارة التحكم إلى حديها 0 و10 V.')},
  {err:'<ul style="margin:4px 0 0;padding-inline-start:18px"><li>رقم الشكل (3-8) مستعمل لشكلين: مخطط PID في Simulink (ص 36) وهذا التوصيل (ص 41).</li><li>النص يقول «الخرج على القناة Y1»، بينما الشكل يوصل Y1 بخرج الحاكم y و Y2 بجهد السرعة x<sub>S</sub>. اتبعنا الشكل في المختبر: Y1 = y و Y2 = x<sub>S</sub>.</li><li>مولد الإشارات مذكور في الأجهزة ولا يظهر في الشكل.</li><li>في السؤال الأول «يصد» والأرجح «يصعد». وصُححت «بإتباع» إلى «باتباع».</li></ul>'}
 ],
 lab:(el)=>{let BC=null;
  const ident=P=>{const r0=BC&&BC.rec[0][0].r1;if(r0)return Object.assign({src:'من قراءتك المسجلة في الجزء الأول'},r0.m.id);const r=simLoop({plant:spPlant(P),Tw:spTw(P),w0:5,sat:[0,P.Um],ctrl:{type:'open'}});return Object.assign({src:'من منحنى المحاكاة (لم تسجل الجزء الأول بعد)'},identify(r))};
  const applyCHR=(s,P)=>{const id=ident(P);const c=chrSet(id,s.ty,s.os);s.Kp=c.Kp;s.Ti=c.Ti!=null?c.Ti:s.Ti;s.Td=c.Td!=null?c.Td:s.Td;s.chr=s.ty+s.os;s.src=id.src};
  const man=(s)=>{s.chr=null};
  const rows=[];['P','PI','PID'].forEach(t=>[0,20].forEach(o=>rows.push({key:t+o,l:`${t} — ${o} %`})));
  BC=ctrlBench(el,{k:'le',tp:{id:'u3-l5',defs:SP_DEFS(),reset:(st)=>{st[1].Kp=null}},
   parts:[
    {key:'open',label:'1) استجابة النظام: K<sub>s</sub> و T<sub>u</sub> و T<sub>g</sub>',figTitle:'الشكل (3-8): الحاكم في وضع «الخط» — الحلقة مفتوحة',ref:'ص 41',s0:{w0:5},
     ctl:[{k:'w0',t:'sl',l:'قيمة الخطوة w (الكتاب لا يحددها)',min:1,max:8,step:0.5,u:'V'}],
     ctlNote:'لاستخراج خواص النظام نفصل التغذية الراجعة: لوحة Digital Controller/Line تمرر الخطوة كما هي إلى المحرك (الخط المتقطع = x مفصول).',
     fig:(s,P,v)=>digitalSVG({sys:'speed',open:1,run:!!v,v:v||{}}),fanSpeed:(s,v)=>v?v.x*220:0,
     sim:(s,P)=>{const r=simLoop({plant:spPlant(P),Tw:spTw(P),w0:s.w0,sat:[0,P.Um],ctrl:{type:'open'}});const m=measure(r);m.id=identify(r);const g=m.id.g;
       return {r,m,ch:CH_D(r),tan:g,meters:[['K<sub>s</sub> = Δx/Δy',fm(m.id.Ks,3)],['T<sub>u</sub>',fm(m.id.Tu,3)+' s'],['T<sub>g</sub>',fm(m.id.Tg,3)+' s'],['T<sub>u</sub>/T<sub>g</sub>',fm(m.id.Tu/m.id.Tg,3)],['x<sub>S</sub> النهائي',fm(m.xf,2)+' V']],
        note:'الخط الأحمر: المماس عند نقطة الانعطاف (النقطة الحمراء)، والخط المتقطع الأحمر: القيمة النهائية. T<sub>u</sub> من الصفر حتى قطع المماس للمحور، و T<sub>g</sub> حتى بلوغه القيمة النهائية.'}},
     tables:[{title:'تسجيل النتائج (ص 41)',head:'',rows:[{key:'r1',l:'استجابة الخطوة'}],match:()=>'r1',cols:()=>[{h:'w (V)',f:(m,s)=>fm(s.w0)},{h:'K<sub>s</sub>',f:m=>m.id.Ks,dp:3},{h:'T<sub>u</sub> (s)',f:m=>m.id.Tu,dp:3},{h:'T<sub>g</sub> (s)',f:m=>m.id.Tg,dp:3}]}]},
    {key:'closed',label:'2) الحلقة المغلقة بحاكم CHR',prep:(s,P)=>{if(s.Kp==null)applyCHR(s,P)},figTitle:'الشكل (3-8): التحكم الرقمي في السرعة',ref:'ص 41',s0:{ty:'PID',os:0,Kp:null,Ti:1,Td:0.05,w0:5,chr:null},
     ctl:[{k:'ty',t:'seg',l:'نوع الحاكم',o:[['P','P'],['PI','PI'],['PID','PID']],on:(s,v,P)=>applyCHR(s,P)},{k:'os',t:'seg',l:'هدف التصميم',o:[[0,'بلا تعدٍّ (0 %)'],[20,'تعدٍّ 20 %']],on:(s,v,P)=>applyCHR(s,P)},
      {k:'Kp',t:'num',l:'K<sub>p</sub>',min:0,max:500,on:man},{k:'Ti',t:'num',l:'T<sub>i</sub> (s)',min:0.001,max:100,on:man,show:s=>s.ty!=='P'},{k:'Td',t:'num',l:'T<sub>d</sub> (s)',min:0,max:10,on:man,show:s=>s.ty==='PID'},
      {k:'calc',t:'btn',l:'احسب المعاملات من K<sub>s</sub> و T<sub>u</sub> و T<sub>g</sub>',on:(s,v,P)=>applyCHR(s,P)},{k:'w0',t:'sl',l:'القيمة المطلوبة w',min:1,max:8,step:0.5,u:'V'}],
     ctlNote:s=>s.chr?`المعاملات محسوبة بجدول شين وهرونس وريسويك ${s.src||''}.`:'<span style="color:var(--stop)">غيّرت المعاملات يدوياً: النتيجة لا تُسجل في صفوف الجدول (اضغط «احسب» للرجوع إلى قيم الجدول).</span>',
     fig:(s,P,v)=>digitalSVG({sys:'speed',run:!!v,v:v||{}}),fanSpeed:(s,v)=>v?v.x*220:0,
     sim:(s,P)=>{if(s.Kp==null)applyCHR(s,P);const r=simLoop({plant:spPlant(P),Tw:spTw(P),w0:s.w0,sat:[0,P.Um],ctrl:{type:'digital',T0:P.T0,P:true,I:s.ty!=='P',D:s.ty==='PID',Kp:s.Kp,Ti:s.Ti,Td:s.Td}});const m=measure(r);
       return {r,m,ch:CH_D(r),meters:[['M<sub>p</sub>',m.Mp>0?fm(m.MpP,1)+' %':'0'],['زمن الاستقرار t<sub>s</sub>',TSV(m)+' s',m.ts>m.Tw],['e = w − x',fm(m.e,3)+' V'],['الحالة',m.osc?'يتذبذب':'مستقر',m.osc]],
        note:m.osc?'الخرج يتذبذب ولا يستقر: K<sub>p</sub> كبير جداً مع تأخير القياس وزمن العيّنة.':s.ty==='P'?'مع P وحده يبقى خطأ مستقر.':''}},
     tables:[{title:'نتائج الحلقة المغلقة (إضافة: الكتاب يطلب التصميم والاختبار دون جدول)',head:'الحاكم — الهدف',rows,match:s=>s.chr,cols:()=>[{h:'K<sub>p</sub>',f:(m,s)=>fm(s.Kp,3)},{h:'T<sub>i</sub> (s)',f:(m,s)=>s.ty==='P'?'—':fm(s.Ti,3)},{h:'T<sub>d</sub> (s)',f:(m,s)=>s.ty==='PID'?fm(s.Td,4):'—'},{h:'M<sub>p</sub>',f:m=>m.Mp>0?fm(m.MpP,1)+' %':'0'},{h:'t<sub>s</sub> (s)',f:m=>TSV(m)},{h:'e (V)',f:m=>m.e,dp:3}]}],
     noMatch:'هذه معاملات يدوية، ليست صفاً من الجدول. اضغط «احسب المعاملات» لتعود إلى قيم شين وهرونس وريسويك.',ghostLabel:s=>s.chr?`${s.ty} ${s.os}%`:`K<sub>p</sub> = ${fm(s.Kp,2)}`,
     note:'Y1 يعرض خرج الحاكم y (درجات سلّم: يتغير مرة كل زمن عيّنة)، و Y2 جهد السرعة x<sub>S</sub>، كما في الشكل.'}
   ],
   steps:ctx=>{const R=(p,k)=>!!ctx.rec[p][0][k];return [
    {t:'ارسم استجابة النظام لإشارة الخطوة',x:'الجزء الأول: الحلقة مفتوحة. شغّل وانظر Y2: يبدأ ببطء ثم يسرع ثم يستقر (شكل S).',done:()=>!!ctx.did['run-open']},
    {t:'استنتج K<sub>s</sub> و T<sub>u</sub> و T<sub>g</sub> وسجّلها',x:'المماس الأحمر مرسوم على المنحنى. تحقق بالمؤشر من القيمة النهائية ثم اضغط «سجّل في الجدول».',done:()=>R(0,'r1')},
    {t:'صمم حاكم PID بلا تعدٍّ',x:'اختر «2) الحلقة المغلقة»: المعاملات تُحسب من قراءتك بجدول شين وهرونس وريسويك. شغّل وسجّل.',done:()=>R(1,'PID0')},
    {t:'جرّب P و PI ثم هدف 20 %',x:'سجّل صفين آخرين على الأقل، وقارن التعدي والخطأ وزمن الاستقرار. مع P وحده يبقى خطأ.',done:()=>Object.keys(ctx.rec[1][0]).length>=3},
    {t:'ارفع K<sub>p</sub> إلى قيمة عالية',x:'اكتب في خانة K<sub>p</sub> قيمة أكبر بكثير (مثلاً 4 أضعاف) وشغّل: هذا جواب السؤال الثاني.',done:()=>ctx.pi===1&&ctx.run&&ctx.run.m.osc}]}}).ctx;
 },
 quiz:[
  {q:'في الحاكم الرقمي، ما وظيفة محوّل A/D؟',o:['يحول إشارة التحكم الرقمية إلى جهد','يحول الخطأ التماثلي إلى رقم كل زمن عيّنة','يقيس السرعة','يولد الخطوة'],c:1,e:'A/D = تماثلي إلى رقمي؛ D/A يعيد الرقم إلى جهد.'},
  {q:'لماذا يظهر خرج الحاكم الرقمي على شكل درجات؟',o:['لعطل في اللوحة','لأن D/A يثبت الجهد حتى العيّنة التالية','لأن المحرك يتوقف','بسبب التشويش'],c:1,e:'الإشارة تُحدَّث مرة كل T<sub>0</sub>.'},
  {q:'K<sub>s</sub> في هذه التجربة هو:',o:['زمن التأخير','التغير في جهد السرعة ÷ التغير في جهد الدخل','زمن التعويض','زمن العيّنة'],c:1,e:'K<sub>s</sub> = Δx/Δy بعد الاستقرار.'},
  {q:'T<sub>u</sub> يُقرأ من:',o:['قمة المنحنى','تقاطع المماس عند نقطة الانعطاف مع مستوى الخرج الابتدائي','63 % من القيمة النهائية','زمن الاستقرار'],c:1,e:'طريقة المماس.'},
  {q:'حسب شين وهرونس وريسويك (بلا تعدٍّ) لحاكم PID: K<sub>p</sub> =',o:['0.3 T<sub>g</sub>/(K<sub>s</sub>T<sub>u</sub>)','0.6 T<sub>g</sub>/(K<sub>s</sub>T<sub>u</sub>)','0.95 T<sub>g</sub>/(K<sub>s</sub>T<sub>u</sub>)','T<sub>g</sub>/T<sub>u</sub>'],c:1,e:'ومعه T<sub>i</sub> = T<sub>g</sub> و T<sub>d</sub> = 0.5 T<sub>u</sub>.'},
  {q:'زيادة K<sub>p</sub> إلى قيمة عالية جداً في هذه التجربة تؤدي إلى:',o:['خطأ أكبر واستجابة أبطأ','تذبذب مستمر وفقد الاستقرار','لا شيء','توقف المحرك'],c:1,e:'تأخير القياس وزمن العيّنة مع كسب كبير يسببان التذبذب.'},
  {q:'في الشكل (3-8) ص 41، القناة Y2 موصولة بـ:',o:['خرج الحاكم y','جهد السرعة x<sub>S</sub>','المولد','الأرضي'],c:1,e:'Y1 بخرج الحاكم و Y2 بجهد السرعة (النص يقول الخرج على Y1 — تعارض).'}
 ]
});

/* ======================================================================
   Lesson 6 — digital light control: P, I, PI (ص 42–43)
   ====================================================================== */
const LT_DEFS=()=>[
  {k:'Ks',label:'كسب وحدة الإضاءة (جهد x<sub>L</sub> ÷ جهد y<sub>L</sub>)',unit:'',value:0.8,min:0.1,max:5,step:0.01},
  {k:'T',label:'الثابت الزمني لوحدة الإضاءة (LED وترانزستور ضوئي)',unit:'s',value:0.02,min:0.001,max:2,step:0.001},
  {k:'T0',label:'زمن العيّنة للحاكم الرقمي T<sub>0</sub>',unit:'s',value:0.002,min:0.0002,max:0.1,step:0.0001},
  {k:'Um',label:'أعلى جهد يخرجه الحاكم (الثنائي لا يضيء بجهد سالب: من 0)',unit:'V',value:10,min:1,max:30,step:0.5},
  {k:'Kp0',label:'K<sub>p</sub> المقترح للبداية',unit:'',value:1,min:0.01,max:100,step:0.01},
  {k:'Ti0',label:'T<sub>i</sub> المقترح للبداية',unit:'s',value:0.05,min:0.001,max:10,step:0.001}];
const ltBase=P=>niceT(5*P.T);
B.lesson({
 id:'u3-l6',unit:3,order:6,pages:'42–43',
 title:'التجربة السادسة: الحاكم PID الرقمي — التحكم الرقمي في الإضاءة Automatic Light Control',
 summary:'نفس توصيل التجربة السابقة مع وحدة الإضاءة (ثنائي باعث للضوء وترانزستور ضوئي). نرسم استجابة الحلقة المغلقة مع الحاكم التناسبي فقط، ثم التكاملي فقط، ثم التناسبي التكاملي، ونقارن على نظام سريع جداً.',
 theory:[
  {h:'الهدف من التجربة',ref:'ص 42',html:String.raw`<p>أن يتعرف المتدرب من خلال هذه التجربة على:</p><ul><li>الأجهزة المستخدمة في مختبر التحكم Com3Lab.</li><li>طريقة تشغيل الكرت الإلكتروني المبني عليه هذا المختبر.</li><li>تحويل الإضاءة إلى جهد مستمر متناسب مع الإضاءة ويمكن قياسه عند القاعدة \(x_L\).</li><li>من تحليل منحنى استجابة النظام المتحكم فيه يمكننا حساب \(K_s, T_u, T_g\).</li><li>تصميم الحاكم PID باتباع خطوات البحث عن الحل في حالة الحلقة المغلقة.</li></ul>`},
  {h:'الأجهزة والمكونات',ref:'ص 42',html:'<ul><li>مصدر التغذية (Power Supply).</li><li>الكرت الإلكتروني.</li><li>وحدة الإضاءة المتحكم فيها Light Control Unit.</li><li>جهاز راسم ذبذبات Oscilloscope.</li><li>مولد إشارات Function Generator.</li></ul>'},
  {h:'وحدة الإضاءة',html:String.raw`<div class="callout">${ADD}الثنائي الباعث للضوء (LED) يضيء بقدر الجهد \(y_L\)، والترانزستور الضوئي يحوّل الضوء الساقط عليه إلى جهد \(x_L\). هذا النظام <b>سريع جداً</b> (ثابته الزمني أجزاء من الثانية، كما رأيت في التجربة الثالثة من الوحدة الثانية)، فهو تقريباً من الرتبة الأولى بلا تأخير يُذكر: \(T_u\) قريب من الصفر و\(T_g \approx T\).</div>`},
  {h:'الحاكم الرقمي',html:DIG_EQ},
  {h:'P و I و PI على نظام سريع',html:String.raw`<div class="callout">${ADD}ماذا نتوقع؟</div><ul><li><b>P فقط</b>: استجابة سريعة جداً، لكن يبقى خطأ مستقر \(e = \dfrac{w}{1+K_s K_p}\). ولأن الحاكم الرقمي يتأخر زمن عيّنة، فإن \(K_p\) الكبير جداً يجعل الإضاءة تتذبذب.</li><li><b>I فقط</b>: يصل إلى القيمة المطلوبة تماماً (الخطأ صفر) لكنه أبطأ، وقد يتعدى إذا كان \(K_p/T_i\) كبيراً.</li><li><b>PI</b>: يجمع السرعة (P) وإلغاء الخطأ (I).</li></ul>`},
  {h:'خطوات إجراء التجربة',ref:'ص 42',html:String.raw`<ol><li>شغل لوحة العمليات وأجب عن الأسئلة التي تسمح بمواصلة العمل.</li><li>وصل التجربة كما هو موضح في الشكل (3-9).</li><li>استعمل راسم الذبذبات للحصول على الخرج على القناة \(Y_1\).</li><li>قبل تشغيل التجربة اطلب من المسؤول عن المختبر مراجعة التوصيلات ومعايرة الأجهزة.</li><li>قم بتشغيل التجربة وسجل إشارة القناة \(Y_1\) على راسم الذبذبات.</li></ol>`},
  {fig:'(3-9)',ref:'ص 43',caption:'توصيلة التحكم في الإضاءة — مطابقة للشكل (3-8) ص 41 مع لوحة Light Control (y<sub>L</sub> ← LED ← ترانزستور ضوئي ← x<sub>L</sub>): y ← y<sub>L</sub> وأيضاً ← Y1؛ x<sub>L</sub> ← x (تغذية راجعة) وأيضاً ← Y2؛ COM ← الأرضي.',draw:()=>box(digitalSVG({sys:'light'}),760,1)},
  {h:'تسجيل النتائج',ref:'ص 43',html:'<ol><li>ارسم استجابة النظام عند استخدام الحاكم التناسبي فقط.</li><li>ارسم استجابة النظام عند استخدام الحاكم التكاملي فقط.</li><li>ارسم استجابة النظام عند استخدام الحاكم التناسبي التكاملي معاً.</li></ol><p>ماذا تلاحظ؟ — ماذا تستنتج؟</p><p class="sub">لا يذكر الكتاب قيمة الخطوة ولا قيم K<sub>p</sub> و T<sub>i</sub>؛ في المختبر قيم مقترحة يستطيع المدرب تغييرها.</p>'},
  {h:'أسئلة ومناقشة',ref:'ص 43',html:
   Q(1,'اختر العبارة الصحيحة التي تنطبق على منحنى خواص النظام: (أ) النظام المتحكم فيه يصل إلى قيمة الدخل. (ب) النظام المتحكم فيه يصعد كلما زاد الزمن. (ج) النظام المتحكم فيه يستجيب بسرعة لتغير إشارة الدخل.','لنظام الإضاءة (ج): يستجيب بسرعة كبيرة لأن ثابته الزمني صغير جداً. ومع حاكم فيه جزء تكاملي (I أو PI) يصل أيضاً إلى قيمة الدخل (أ)، أما مع P وحده فلا يصلها.')+
   Q(2,'ماذا يحدث للنظام في حالة زيادة المعامل \\(K_p\\) إلى قيمة عالية؟','يقل الخطأ المستقر مع P، لكن بسبب تأخر الحاكم الرقمي زمن عيّنة واحداً يبدأ الخرج يتذبذب، وعند قيمة عالية جداً يصبح التذبذب مستمراً بين حدي إشارة التحكم (الإضاءة تومض).')},
  {err:'<ul style="margin:4px 0 0;padding-inline-start:18px"><li>نصوص منسوخة من التجربة الخامسة: الهدف الثالث يكتب المقبس «x<sub>s</sub>» والصحيح x<sub>L</sub> في وحدة الإضاءة، والهدف الرابع يكتب «منحنى استجابة <b>سرعة</b> النظام» ولا سرعة هنا. صححناهما أعلاه.</li><li>النص يقول «الخرج على القناة Y1» والشكل يوصل Y1 بخرج الحاكم و Y2 بـ x<sub>L</sub> (كما في التجربة الخامسة). اتبعنا الشكل.</li><li>في السؤال الأول «يصد» والأرجح «يصعد». وصُححت «بإتباع» إلى «باتباع».</li></ul>'}
 ],
 lab:(el)=>{
  const fill=(s,P)=>{if(s.Kp==null)s.Kp=P.Kp0;if(s.Ti==null)s.Ti=P.Ti0};
  const TWM=[[1,'قصير'],[3,'متوسط'],[10,'طويل']];
  ctrlBench(el,{k:'lf',tp:{id:'u3-l6',defs:LT_DEFS(),reset:(st,P)=>{st[1].Kp=P.Kp0;st[1].Ti=P.Ti0}},
   parts:[
    {key:'open',label:'1) وحدة الإضاءة وحدها',figTitle:'الشكل (3-9): الحاكم في وضع «الخط» — الحلقة مفتوحة',ref:'ص 43',s0:{w0:5},
     ctl:[{k:'w0',t:'sl',l:'قيمة الخطوة w (الكتاب لا يحددها)',min:1,max:8,step:0.5,u:'V'}],
     ctlNote:'نبدأ بخواص وحدة الإضاءة نفسها (الهدف الرابع: K<sub>s</sub> و T<sub>u</sub> و T<sub>g</sub>).',
     fig:(s,P,v)=>digitalSVG({sys:'light',open:1,run:!!v,v:v||{}}),
     sim:(s,P)=>{const r=simLoop({plant:PLANT.pt1(P.Ks,P.T),Tw:ltBase(P)*2,w0:s.w0,sat:[0,P.Um],ctrl:{type:'open'}});const m=measure(r);m.id=identify(r);
       return {r,m,ch:CH_D(r),tan:m.id.g,meters:[['K<sub>s</sub>',fm(m.id.Ks,3)],['T<sub>u</sub>',fm(m.id.Tu,4)+' s'],['T<sub>g</sub>',fm(m.id.Tg,4)+' s'],['x<sub>L</sub> النهائي',fm(m.xf,2)+' V']],note:'T<sub>u</sub> صفر تقريباً: النظام من الرتبة الأولى بلا تأخير، و T<sub>g</sub> يساوي ثابته الزمني تقريباً.'}},
     tables:[{title:'خواص وحدة الإضاءة (من أهداف التجربة)',head:'',rows:[{key:'r1',l:'استجابة الخطوة'}],match:()=>'r1',cols:()=>[{h:'K<sub>s</sub>',f:m=>m.id.Ks,dp:3},{h:'T<sub>u</sub> (s)',f:m=>m.id.Tu,dp:4},{h:'T<sub>g</sub> (s)',f:m=>m.id.Tg,dp:4}]}]},
    {key:'closed',label:'2) الحلقة المغلقة: P ثم I ثم PI',prep:(s,P)=>fill(s,P),figTitle:'الشكل (3-9): التحكم الرقمي في الإضاءة',ref:'ص 43',s0:{ty:'P',Kp:null,Ti:null,w0:5,tw:3},
     ctl:[{k:'ty',t:'seg',l:'الحاكم',o:[['P','التناسبي فقط P'],['I','التكاملي فقط I'],['PI','التناسبي التكاملي PI']]},{k:'Kp',t:'num',l:'K<sub>p</sub>',min:0.01,max:500},{k:'Ti',t:'num',l:'T<sub>i</sub> (s)',min:0.0005,max:20,show:s=>s.ty!=='P'},
      {k:'tw',t:'seg',l:'زمن العرض',o:TWM},{k:'w0',t:'sl',l:'القيمة المطلوبة w',min:1,max:8,step:0.5,u:'V'}],
     ctlNote:s=>s.ty==='I'?'التكاملي فقط: y = (K<sub>p</sub>/T<sub>i</sub>)·Σe·T<sub>0</sub>، أي K<sub>I</sub> = K<sub>p</sub>/T<sub>i</sub>.':'',
     fig:(s,P,v)=>digitalSVG({sys:'light',run:!!v,v:v||{}}),
     sim:(s,P)=>{fill(s,P);const Tw=ltBase(P)*s.tw;const r=simLoop({plant:PLANT.pt1(P.Ks,P.T),Tw,w0:s.w0,sat:[0,P.Um],ctrl:{type:'digital',T0:P.T0,P:s.ty!=='I',I:s.ty!=='P',D:false,Kp:s.Kp,Ti:s.Ti}});const m=measure(r);
       return {r,m,ch:CH_D(r),meters:[['x<sub>0</sub> عند نهاية العرض',fm(m.x0,3)+' V'],['e = w − x',fm(m.e,3)+' V'],['M<sub>p</sub>',m.Mp>0?fm(m.MpP,1)+' %':'0'],['زمن الاستقرار t<sub>s</sub>',TSV(m)+' s',m.ts>m.Tw],['الحالة',m.osc?'يتذبذب':'مستقر',m.osc]],
        note:m.osc?'الإضاءة تتذبذب: K<sub>p</sub> كبير جداً مع تأخر الحاكم الرقمي زمن عيّنة.':m.ts>m.Tw?'لم يستقر داخل زمن العرض: اختر زمناً أطول.':''}},
     tables:[{title:'قياسات للمقارنة (إضافة: الكتاب يطلب الرسم فقط)',head:'الحاكم',rows:[{key:'P',l:'التناسبي فقط P'},{key:'I',l:'التكاملي فقط I'},{key:'PI',l:'التناسبي التكاملي PI'}],match:s=>s.ty,
       cols:()=>[{h:'K<sub>p</sub>',f:(m,s)=>fm(s.Kp,3)},{h:'T<sub>i</sub> (s)',f:(m,s)=>s.ty==='P'?'—':fm(s.Ti,4)},{h:'x<sub>0</sub> (V)',f:m=>m.x0,dp:3},{h:'e (V)',f:m=>m.e,dp:3},{h:'M<sub>p</sub>',f:m=>m.Mp>0?fm(m.MpP,1)+' %':'0'},{h:'t<sub>s</sub> (s)',f:m=>TSV(m)}]}],
     ghostLabel:s=>s.ty,note:'سجّل الحاكمات الثلاثة لتظهر منحنياتها معاً على الشاشة (متقطعة) فتقارن.',
     results:rc=>{const r=rc[0];if(!(r.P&&r.I&&r.PI))return '';return `<div class="callout"><b>ماذا تلاحظ؟</b> P: أسرع استجابة لكن الخطأ ${lt(fm(r.P.m.e,2)+' V')}. I: الخطأ ${lt(fm(r.I.m.e,3)+' V')} لكنه أبطأ. PI: يصل إلى المطلوب بسرعة. <b>نستنتج</b> أن الجزء التكاملي ضروري لإلغاء الخطأ، والتناسبي يسرّع، ومع نظام سريع جداً كالإضاءة يكفي الحاكم PI.</div>`}}
   ],
   steps:ctx=>{const R=(p,k)=>!!ctx.rec[p][0][k];return [
    {t:'انظر استجابة وحدة الإضاءة وحدها وسجّل',x:'الجزء الأول: لاحظ أن الخرج يصل إلى قيمته النهائية في أجزاء من الثانية، و T<sub>u</sub> صفر تقريباً.',done:()=>R(0,'r1')},
    {t:'ارسم الاستجابة مع الحاكم التناسبي فقط وسجّل',x:'الجزء الثاني، اختر «P». لاحظ الخطأ المستقر.',done:()=>R(1,'P')},
    {t:'ارسم الاستجابة مع الحاكم التكاملي فقط وسجّل',x:'اختر «I». الخطأ يصبح صفراً والاستجابة أبطأ.',done:()=>R(1,'I')},
    {t:'ارسم الاستجابة مع PI وسجّل',x:'اختر «PI». قارن المنحنيات الثلاثة على الشاشة واقرأ الملاحظة تحت الجدول.',done:()=>R(1,'PI')},
    {t:'ارفع K<sub>p</sub> إلى قيمة عالية مع P',x:'اختر «P» واكتب K<sub>p</sub> = 40 مثلاً: ماذا يحدث للإضاءة؟ (السؤال الثاني).',done:()=>ctx.pi===1&&ctx.run&&ctx.run.m.osc}]}});
 },
 quiz:[
  {q:'في وحدة الإضاءة، ما الذي يحوّل الضوء إلى جهد x<sub>L</sub>؟',o:['الثنائي الباعث للضوء','الترانزستور الضوئي','محوّل D/A','المولد'],c:1,e:'الـ LED يضيء والترانزستور الضوئي يستقبل الضوء.'},
  {q:'مع الحاكم التناسبي فقط على وحدة الإضاءة:',o:['يصل الخرج إلى المطلوب تماماً','يبقى خطأ مستقر','لا يتحرك الخرج','يتذبذب دائماً'],c:1,e:'e = w/(1+K<sub>s</sub>K<sub>p</sub>).'},
  {q:'مع الحاكم التكاملي فقط:',o:['الخطأ المستقر صفر والاستجابة أبطأ','الخطأ كبير','الاستجابة أسرع من P','لا فرق عن P'],c:0,e:'التكامل يلغي الخطأ لكنه يحتاج وقتاً.'},
  {q:'في الصيغة الرقمية المستعملة، إذا كان K<sub>p</sub> = 1 و T<sub>i</sub> = 0.05 s فإن K<sub>I</sub> =',o:['0.05','1','20 1/s','50 1/s'],c:2,e:'K<sub>I</sub> = K<sub>p</sub>/T<sub>i</sub> = 1/0.05 = 20.'},
  {q:'لماذا يتذبذب نظام الإضاءة السريع عند K<sub>p</sub> كبير جداً مع الحاكم الرقمي؟',o:['لأن الضوء متقطع','لأن الحاكم يتأخر زمن عيّنة فيصحح متأخراً بقوة','لأن الترانزستور يحترق','لأن الخطوة كبيرة'],c:1,e:'التأخير مع كسب كبير يسبب التذبذب.'},
  {q:'ما الخطأ المنسوخ في أهداف هذه التجربة؟',o:['اسم المقبس x<sub>s</sub> وكلمة «سرعة» منقولة من تجربة السرعة','رقم الصفحة','اسم الترانزستور','لا يوجد'],c:0,e:'في وحدة الإضاءة المقبس x<sub>L</sub> ولا توجد سرعة.'}
 ]
});

/* keep Latin symbol runs left-to-right in the text of this unit's lessons */
B.LESSONS.filter(L=>/^u3-l[1-6]$/.test(L.id)&&L.unit===3).forEach(L=>{(L.theory||[]).forEach(b=>{['h','html','note','err','caption'].forEach(k=>{if(typeof b[k]==='string')b[k]=B.ltrU(ltK(b[k]))});if(b.fig)b.fig=lt(b.fig)});
  (L.quiz||[]).forEach(q=>{q.q=ltK(q.q);q.e=ltK(q.e);q.o=q.o.map(ltK)});L.summary=ltK(L.summary);L.title=ltK(L.title)});
})(PLCBOOK);
