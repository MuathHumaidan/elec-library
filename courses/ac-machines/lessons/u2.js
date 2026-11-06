/* Unit 2 — المحركات الحثية أحادية الوجه (ص 71–89) */
(function(B){
const {S}=B;
const PI=Math.PI,D=PI/180;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const fm=(x,d)=>B.fmtN(x,d);
const fx=v=>(+v).toFixed(1);
const lt=s=>`<span class="ltr">${s}</span>`;
const neg=(v,d)=>(v<0?'−':'')+fm(Math.abs(v),d);          // printable signed number (true minus sign)
const ltx=(v,d)=>(v<0?'-':'')+fm(Math.abs(v),d);           // signed number for LaTeX

/* ---------- styles used only by this unit (CSS variables only) ---------- */
(function css(){if(typeof document==='undefined'||document.getElementById('u2ac-css'))return;const s=document.createElement('style');s.id='u2ac-css';s.textContent=`
.im-sl{display:flex;flex-direction:column;gap:2px;font-size:13.5px;margin-top:10px;flex:1 1 180px;min-width:150px}
.im-sl .im-h{display:flex;justify-content:space-between;gap:8px;align-items:baseline}
.im-sl b{font-family:var(--mono);direction:ltr;unicode-bidi:isolate;color:var(--blue-ink);font-size:14px}
.im-sl input[type=range]{width:100%;accent-color:var(--blue);direction:ltr;margin:4px 0}
.im-row{display:flex;gap:10px 14px;flex-wrap:wrap;margin-top:10px;align-items:center}
.im-sls{display:flex;gap:4px 16px;flex-wrap:wrap}
.im-svg{max-width:560px;margin-inline:auto}
.im-chip{display:inline-block;padding:3px 10px;border-radius:999px;font-size:13px;font-weight:700;background:var(--surface-2);color:var(--muted)}
.im-chip.run{background:var(--on-soft);color:var(--on)}.im-chip.warn{background:var(--live-soft);color:var(--live)}.im-chip.trip{background:var(--stop-soft);color:var(--stop)}
.im-bar{height:12px;border-radius:6px;background:var(--surface-2);overflow:hidden;margin-top:6px}
.im-bar i{display:block;height:100%;background:var(--live);transition:width .2s}
.im-q{border:1px solid var(--line);border-radius:12px;padding:10px 14px;margin:10px 0;background:var(--surface)}
.im-q summary{cursor:pointer;font-weight:600;line-height:1.7}
.im-ans{margin-top:8px;border-inline-start:3px solid var(--blue);padding:6px 12px;background:var(--blue-soft);border-radius:0 10px 10px 0}
.im-leg{display:flex;gap:14px;flex-wrap:wrap;font-size:12.5px;color:var(--muted);margin-top:6px}
.im-leg i{display:inline-block;width:18px;height:3px;border-radius:2px;vertical-align:middle;margin-inline-end:5px}
.im-leg i.d{background:none!important;border-top:3px dashed currentColor;height:0}
`;document.head.appendChild(s)})();

/* ---------- small lab helpers ---------- */
function loopOn(el,fn){let last=performance.now();const f=now=>{if(!document.body.contains(el))return;const dt=Math.min(0.05,Math.max(0,(now-last)/1000));last=now;try{fn(dt)}catch(e){console.error(e);return}requestAnimationFrame(f)};requestAnimationFrame(f)}
function stepsUI(host,steps){let i=0;
  const draw=()=>{host.innerHTML=steps.map((s,j)=>`<li class="${j<i?'done':j===i?'cur':''}"><span class="k">${j<i?'✓':j+1}</span><div><h4>${s.t}</h4><p>${s.x}</p>${j===i?`<div class="act">${s.done?'<span class="hint">بانتظار تنفيذك…</span> <button class="btn" data-next>تخطَّ</button>':'<button class="btn primary" data-next>التالي</button>'}</div>`:''}</div></li>`).join('')+
    (i>=steps.length?`<li class="cur"><span class="k">✓</span><div><h4>أحسنت، أنهيت التجربة</h4><p style="display:block">جرّب قيماً أخرى، أو أعد التجربة من أولها.</p><div class="act"><button class="btn" data-restart>إعادة التجربة</button></div></div></li>`:'');B.math(host)};
  host.addEventListener('click',e=>{if(e.target.closest('[data-next]')){i++;draw()}if(e.target.closest('[data-restart]')){i=0;draw()}});draw();
  return {check(){const s=steps[i];if(s&&s.done&&s.done()){i++;draw()}}};}
const sl=(id,label,min,max,step,val)=>`<label class="im-sl"><span class="im-h"><span>${label}</span><b id="${id}-v"></b></span><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}" aria-label="${label.replace(/<[^>]+>/g,'')}"></label>`;
const segHTML=(attr,items,cur)=>`<div class="seg" role="group">${items.map(([v,l])=>`<button data-${attr}="${v}" aria-pressed="${String(v)===String(cur)}">${l}</button>`).join('')}</div>`;
const segSet=(el,attr,v)=>el.querySelectorAll(`[data-${attr}]`).forEach(b=>b.setAttribute('aria-pressed',String(b.dataset[attr])===String(v)));
const swHTML=(id,b,label,on)=>`<button class="sw" id="${id}" aria-pressed="${on?'true':'false'}"><span class="knob"></span><b>${b}</b><small>${label}</small></button>`;
const fact=(l,id)=>`<div class="fact"><span>${l}</span><b id="${id}">—</b></div>`;
const tryList=items=>`<div class="callout"><b>جرّب:</b><ol style="margin:6px 0 0;padding-inline-start:20px">${items.map(x=>`<li>${x}</li>`).join('')}</ol></div>`;
const legend=items=>`<div class="im-leg">${items.map(([c,l,d])=>`<span><i class="${d?'d':''}" style="${d?'color':'background'}:var(${c})"></i>${l}</span>`).join('')}</div>`;
const arT=(x,y,s,o)=>{o=o||{};return `<text class="txt ar" x="${x}" y="${y}" text-anchor="${o.a||'middle'}"${o.fs?` font-size="${o.fs}"`:''}${o.col?` style="fill:var(${o.col})"`:''}>${s}</text>`};
const sb=(b,x)=>`${b}<tspan font-size="9" dy="4">${x}</tspan><tspan dy="-4"></tspan>`;
function arrow(x1,y1,x2,y2,col,w,dash){w=w||2.4;const a=Math.atan2(y2-y1,x2-x1),L=Math.hypot(x2-x1,y2-y1);if(L<3)return '';const h=Math.min(11,L*0.6)+w;
  const bx=x2-h*Math.cos(a),by=y2-h*Math.sin(a),px=-Math.sin(a)*h*0.42,py=Math.cos(a)*h*0.42;
  return `<path d="M${fx(x1)} ${fx(y1)}L${fx(bx)} ${fx(by)}" stroke="var(${col})" stroke-width="${w}" fill="none" stroke-linecap="round"${dash?` stroke-dasharray="${dash}"`:''}/><path d="M${fx(x2)} ${fx(y2)}L${fx(bx+px)} ${fx(by+py)}L${fx(bx-px)} ${fx(by-py)}Z" fill="var(${col})"/>`}
/* vertical/horizontal winding (bumps) */
function coil(x1,y1,x2,y2,n,cls){const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy),ux=dx/len,uy=dy/len;const lead=len*0.12,seg=(len-2*lead)/n,r=seg/2;
  let p=`M${fx(x1)} ${fx(y1)}L${fx(x1+ux*lead)} ${fx(y1+uy*lead)}`;for(let i=1;i<=n;i++){p+=`A${fx(r)} ${fx(r)} 0 0 1 ${fx(x1+ux*(lead+seg*i))} ${fx(y1+uy*(lead+seg*i))}`}
  return `<path class="w ${cls||''}" d="${p}L${fx(x2)} ${fx(y2)}"/>`}
/* vertical capacitor between y1 and y2 at x */
function capV(x,y1,y2,cls,lab){const m=(y1+y2)/2;return S.w(`M${x} ${y1}V${m-5}M${x} ${m+5}V${y2}`,cls)+`<path d="M${x-14} ${m-5}H${x+14}M${x-14} ${m+5}H${x+14}" stroke="var(--fg)" stroke-width="3"/>`+(lab?S.t(x+20,m+4,lab,'','start'):'')}
/* vertical switch between y1 (top) and y2 (bottom) at x */
function swV(x,y1,y2,closed,cls){return `<circle cx="${x}" cy="${y1}" r="3.4" fill="var(--fg)"/><circle cx="${x}" cy="${y2}" r="3.4" fill="var(--fg)"/>`+
  (closed?`<path d="M${x} ${y2}L${x} ${y1}" stroke="var(${cls==='flow'||cls==='live'?'--live':'--fg'})" stroke-width="2.6"/>`:`<path d="M${x} ${y2}L${x+17} ${y1+5}" stroke="var(--fg)" stroke-width="2.6"/>`)}

/* ---------- complex helpers ---------- */
const Cx=(re,im)=>({re,im:im||0}),cadd=(a,b)=>Cx(a.re+b.re,a.im+b.im),cdiv=(a,b)=>{const d=b.re*b.re+b.im*b.im;return Cx((a.re*b.re+a.im*b.im)/d,(a.im*b.re-a.re*b.im)/d)},
  cabs=a=>Math.hypot(a.re,a.im),cang=a=>Math.atan2(a.im,a.re)/D,cpol=(m,d)=>Cx(m*Math.cos(d*D),m*Math.sin(d*D));

/* ---------- SVG x-y plot. o:{w,h,x0,x1,y0,y1,xt,yt,xf,yf,xl,yl,series:[{pts,col,w,dash}],under(X,Y),extra(X,Y)}; sets o.X,o.Y ---------- */
function plotSVG(o){const W=o.w||520,H=o.h||290,L=o.left||48,R=14,T=16,Bm=40;
  const X=x=>L+(x-o.x0)/(o.x1-o.x0)*(W-L-R),Y=y=>H-Bm-(y-o.y0)/(o.y1-o.y0)*(H-T-Bm);o.X=X;o.Y=Y;
  let s='';(o.yt||[]).forEach(v=>{s+=`<path d="M${L} ${fx(Y(v))}H${W-R}" stroke="var(--line)"/>`+S.t(L-6,fx(Y(v)+4),o.yf?o.yf(v):v,'m','end')});
  (o.xt||[]).forEach(v=>{s+=`<path d="M${fx(X(v))} ${T}V${H-Bm}" stroke="var(--line)" stroke-dasharray="3 3"/>`+S.t(fx(X(v)),H-Bm+15,o.xf?o.xf(v):v,'m')});
  s+=`<path d="M${L} ${T}V${H-Bm}H${W-R}" stroke="var(--fg)" fill="none" stroke-width="1.4"/>`;
  if(o.y0<0&&o.y1>0)s+=`<path d="M${L} ${fx(Y(0))}H${W-R}" stroke="var(--fg)" stroke-width="1.2"/>`;
  if(o.x0<0&&o.x1>0)s+=`<path d="M${fx(X(0))} ${T}V${H-Bm}" stroke="var(--fg)" stroke-width="1.2"/>`;
  if(o.xl)s+=S.t((L+W-R)/2,H-6,o.xl,'');if(o.yl)s+=`<text class="txt" x="12" y="${(T+H-Bm)/2}" text-anchor="middle" transform="rotate(-90 12 ${(T+H-Bm)/2})">${o.yl}</text>`;
  if(o.under)s+=o.under(X,Y);
  (o.series||[]).forEach(se=>{if(!se.pts.length)return;s+=`<path ${se.id?`id="${se.id}"`:''} d="${se.pts.map((p,i)=>(i?'L':'M')+fx(X(p[0]))+' '+fx(Y(p[1]))).join('')}" fill="none" stroke="var(${se.col})" stroke-width="${se.w||2.4}" ${se.dash?`stroke-dasharray="${se.dash}"`:''} stroke-linejoin="round"/>`});
  if(o.extra)s+=o.extra(X,Y);
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${o.aria||'منحنى'}">${s}</svg>`}
const pathOf=(o,pts)=>pts.map((p,i)=>(i?'L':'M')+fx(o.X(p[0]))+' '+fx(o.Y(p[1]))).join('');
/* monotone cubic interpolation (Fritsch–Carlson) through points [[x,y]] sorted by x */
function mono(P){const n=P.length,dx=[],m=[],t=[];for(let i=0;i<n-1;i++){dx[i]=P[i+1][0]-P[i][0];m[i]=(P[i+1][1]-P[i][1])/dx[i]}
  t[0]=m[0];t[n-1]=m[n-2];for(let i=1;i<n-1;i++)t[i]=m[i-1]*m[i]<=0?0:(m[i-1]+m[i])/2;
  for(let i=0;i<n-1;i++){if(m[i]===0){t[i]=t[i+1]=0;continue}const a=t[i]/m[i],b=t[i+1]/m[i],h=a*a+b*b;if(h>9){const k=3/Math.sqrt(h);t[i]=k*a*m[i];t[i+1]=k*b*m[i]}}
  return x=>{if(x<=P[0][0])return P[0][1];if(x>=P[n-1][0])return P[n-1][1];let i=0;while(x>P[i+1][0])i++;const h=dx[i],u=(x-P[i][0])/h,u2=u*u,u3=u2*u;
    return (2*u3-3*u2+1)*P[i][1]+(u3-2*u2+u)*h*t[i]+(-2*u3+3*u2)*P[i+1][1]+(u3-u2)*h*t[i+1]}}
const sample=(f,a,b,N)=>{N=N||80;const p=[];for(let i=0;i<=N;i++){const x=a+(b-a)*i/N;p.push([x,f(x)])}return p};

/* ---------- الشكل (2-3): double revolving field, Kloss-shaped curve of each field (shape only, أرقام توضيحية) ---------- */
const SM=0.2;
const Tkl=s=>{const a=Math.abs(s);if(a<1e-9)return 0;return Math.sign(s)*2/(a/SM+SM/a)};
const Tfw=n=>Tkl(1-n),Tbw=n=>-Tkl(1+n),Ttot=n=>Tfw(n)+Tbw(n);
const Tfw0=Tfw,Tbw0=Tbw,Ttot0=Ttot;
/* نفس الشكل بانزلاق أقصى عزم sm (للمعمل: قيم المدرب) */
const klossSet=sm=>{const k=s=>{const a=Math.abs(s);if(a<1e-9)return 0;return Math.sign(s)*2/(a/sm+sm/a)};const fw=n=>k(1-n),bw=n=>-k(1+n);return {fw,bw,tot:n=>fw(n)+bw(n)}};

/* ---------- torque–speed curves read from the printed figures (approximate) ---------- */
const CUR={
 split:{fig:'(2-4)',pg:'ص 79',ymax:3.5,yt:[0,0.5,1,1.5,2,2.5,3,3.5],sw:0.75,bothL:'Main And Auxiliary Windings',mainL:'Main Winding Only',
   both:mono([[0,1.25],[0.1,1.38],[0.2,1.55],[0.3,1.76],[0.4,2.02],[0.5,2.32],[0.6,2.65],[0.72,3.0],[0.8,2.9],[0.9,2.2],[1,0]]),
   main:mono([[0,0],[0.1,0.24],[0.2,0.5],[0.3,0.76],[0.4,1.02],[0.5,1.32],[0.6,1.66],[0.7,2.0],[0.8,2.3],[0.88,2.02],[0.95,1.1],[1,0]])},
 cstart:{fig:'(2-6)',pg:'ص 83',ymax:4,yt:[0,1,2,3,4],sw:0.75,bothL:'Main And Auxiliary Windings',mainL:'Main Winding Only',
   both:mono([[0,3.3],[0.2,3.45],[0.38,3.5],[0.55,3.32],[0.75,3.0],[0.85,2.6],[1,0]]),
   main:mono([[0,0],[0.2,0.45],[0.4,0.95],[0.6,1.55],[0.75,2.0],[0.82,2.2],[0.9,1.8],[0.96,1.0],[1,0]])},
 perm:{fig:'(2-8)',pg:'ص 84',ymax:2.5,yt:[0,0.5,1,1.5,2,2.5],sw:null,mainL:'Permanent Capacitor',
   main:mono([[0,0.7],[0.2,0.95],[0.4,1.3],[0.6,1.8],[0.8,2.25],[0.88,2.0],[0.95,1.1],[1,0]])},
 two:{fig:'(2-9)',pg:'ص 85',ymax:3.5,yt:[0,0.5,1,1.5,2,2.5,3,3.5],sw:0.75,bothL:'Starting And Permanent Capacitors',mainL:'Permanent Capacitor',
   both:mono([[0,2.2],[0.2,2.5],[0.4,2.85],[0.55,3.0],[0.65,2.95],[0.75,2.8],[0.85,2.3],[1,0]]),
   main:mono([[0,0.5],[0.2,0.8],[0.4,1.2],[0.6,1.75],[0.8,2.3],[0.88,2.05],[0.95,1.1],[1,0]])},
 shaded:{fig:'(2-11)',pg:'ص 88',ymax:2,yt:[0,0.5,1,1.5,2],sw:null,mainL:'Shaded-Pole',
   main:mono([[0,0.5],[0.2,0.7],[0.4,0.9],[0.6,1.1],[0.78,1.25],[0.86,1.1],[0.93,0.6],[1,0]])}
};
const TNAME={split:'المحرك المشطور الوجه',cstart:'المحرك ذو مكثف البدء',perm:'المحرك ذو المكثف الدائم',two:'المحرك ذو المكثفين',shaded:'المحرك ذو الوجه المظلل'};
/* torque–speed plot of one motor type (as printed); o.op adds a live operating point + load line */
function tsPlot(type,o){o=o||{};const c0=CUR[type],km=o.km==null?1:o.km,c=km===1?c0:Object.assign({},c0,{main:n=>c0.main(n)*km}),sw=c.sw;const P={w:520,h:290,x0:0,x1:1.05,y0:0,y1:c.ymax*1.05,xt:[0,0.2,0.4,0.6,0.8,1.0],yt:c.yt,yf:v=>v.toFixed(1),xl:'Speed (pu)',yl:(type==='two'?'Toque':'Torque')+' (pu)',aria:'منحنى العزم مع السرعة',
  series:[],extra:(X,Y)=>{let s='';
   if(c.both){s+=`<path d="M${fx(X(sw))} ${fx(Y(0))}V${fx(Y(c.ymax))}" stroke="var(--muted)" stroke-dasharray="6 4" stroke-width="1.4"/>`+S.t(fx(X(sw)-4),fx(Y(c.ymax*0.97)),'Switching Speed','m','end');
     s+=`<path d="M${fx(X(sw))} ${fx(Y(c.both(sw)*(o.k||1)))}V${fx(Y(c.main(sw)))}" stroke="var(--fg)" stroke-width="2.2"/>`;
     s+=S.t(fx(X(0.03)),fx(Y(c.both(0.03)*(o.k||1))-9),c.bothL,'b','start')}
   s+=S.t(fx(X(c.both?0.5:0.3)),fx(Y(c.main(c.both?0.5:0.3))-(c.both?-16:10)),c.mainL,'',c.both?'start':'start');
   if(o.ghost)s+=`<path d="${sample(o.ghost.f,0,o.ghost.to||1).map((p,i)=>(i?'L':'M')+fx(X(p[0]))+' '+fx(Y(p[1]))).join('')}" fill="none" stroke="var(--muted)" stroke-width="1.6" stroke-dasharray="2 4"/>`+S.t(fx(X(0.02)),fx(Y(o.ghost.f(0.02))+16),o.ghost.l,'m','start');
   if(o.op)s+=`<path id="${o.op}-ld" d="" fill="none" stroke="var(--stop)" stroke-width="2" stroke-dasharray="7 4"/><circle id="${o.op}-pt" cx="-20" cy="-20" r="7" fill="var(--live)" stroke="var(--surface)" stroke-width="2"/>`;
   return s}};
  if(c.both)P.series.push({pts:sample(n=>c.both(n)*(o.k||1),0,sw,50),col:'--blue',w:2.8});
  P.series.push({pts:sample(c.main,0,1,80),col:c.both?'--fg':'--blue',w:2.6,dash:c.both?'7 5':''});
  if(c.both)P.series.push({pts:sample(c.main,sw,1,30),col:'--blue',w:2.8});
  const svg=plotSVG(P);return {svg,P};
}

/* ---------- running-motor model shared by labs 2–5 (pu, أرقام توضيحية) ---------- */
function mkMotor(type){return {type,on:0,n:0,sw:true,L:0.4,kind:'const',k:1,fail:0,stall:0,ang:0,T:0,TL:0}}
/* J = ثابت زمن التسارع (s)، m.fr = عزم الاحتكاك عند سرعة التزامن (pu). خطوات أصغر تلقائياً إذا صغُر J (للثبات)؛ بالقيم التوضيحية خطوة واحدة دائماً */
function motorStep(m,dt,J){J=J||2.2;const k=Math.max(1,Math.ceil(dt*25/J));if(k>1){for(let i=0;i<k;i++)motorStep1(m,dt/k,J);return m}return motorStep1(m,dt,J)}
function motorStep1(m,dt,J){const c=CUR[m.type];
  if(c.sw!=null){if(m.sw&&m.n>=c.sw)m.sw=false;else if(!m.sw&&m.n<c.sw-0.03)m.sw=true}
  let T=0;if(m.on){T=(c.both&&m.sw&&!m.fail)?c.both(m.n)*(m.k==null?1:m.k):(m.customMain?m.customMain(m.n):c.main(m.n))}
  const TL=m.L*(m.kind==='fan'?m.n*m.n:1),fr=(m.fr==null?0.05:m.fr)*m.n+(m.on?0:0.25*m.n);
  if(m.n<=1e-4&&T<=TL+1e-9){m.n=0;m.stall=m.on?m.stall+dt:0}else{m.stall=0;m.n=clamp(m.n+(T-TL-fr)/J*dt,0,0.999)}
  m.T=T;m.TL=m.n<=1e-4?Math.min(TL,T):TL;m.ang=(m.ang+m.n*240*dt)%360;return m}
/* «قيم المدرب» لنموذج الحركة المشترك (الدروس 2–5) */
const motorDefs=J0=>[
  {k:'J',label:'ثابت زمن التسارع (يكبر مع ثقل العضو الدوار)',unit:'s',value:J0,min:0.1,max:30,step:0.1},
  {k:'fr',label:'عزم الاحتكاك عند سرعة التزامن',unit:'pu',value:0.05,min:0,max:0.5,step:0.01}];
const loadPts=m=>sample(n=>m.L*(m.kind==='fan'?n*n:1),0,1,40);
function rotorSVG(id,lab){let s=`<svg viewBox="0 0 200 200" role="img" aria-label="العضو الدوار"><circle cx="100" cy="100" r="86" fill="var(--surface-2)" stroke="var(--line)" stroke-width="10"/><g id="${id}"><circle cx="100" cy="100" r="64" class="coil"/>`;
  for(let i=0;i<12;i++){const a=i*30*D;s+=`<circle cx="${fx(100+52*Math.cos(a))}" cy="${fx(100+52*Math.sin(a))}" r="5" fill="var(--wire)"/>`}
  s+=`<path d="M100 100L100 40" stroke="var(--live)" stroke-width="6" stroke-linecap="round"/><circle cx="100" cy="100" r="9" fill="var(--fg)"/></g>`;
  return s+(lab?arT(100,196,lab,{fs:12}):'')+'</svg>'}

/* ---------- connection diagrams: الأشكال (2-4) (2-6) (2-8) (2-9) ---------- */
function circSVG(type,o){o=o||{};const on=!!o.on,sw=o.sw!==false,fail=!!o.fail;
  const auxPath=on&&!fail&&(type==='perm'||type==='two'||sw);const cM=on?'flow':'',cA=auxPath?'flow':(on?'live':'');
  const yT=40,yB=222,xa=type==='two'?420:440;
  let s=`<svg viewBox="0 0 560 262" role="img" aria-label="كيفية توصيل ${TNAME[type]}">`;
  // supply
  s+=`<circle cx="50" cy="131" r="20" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.8"/><path d="M38 131q6 -12 12 0t12 0" fill="none" stroke="var(--fg)" stroke-width="1.6"/>`+S.t(22,136,'V','','end');
  s+=S.w(`M50 111V${yT}H${xa}`,on?'flow':'')+S.w(`M50 151V${yB}H${xa}`,on?'flow':'');
  s+=arrow(92,yT-12,130,yT-12,'--stop',2)+S.t(111,yT-18,sb('I','t'),'');
  // main winding
  s+=S.w(`M190 ${yT}V78`,cM)+coil(190,78,190,184,6,cM)+S.w(`M190 184V${yB}`,cM)+S.t(214,135,sb('Z','m'),'','start');
  s+=arrow(172,62,172,90,'--blue',2)+S.t(166,80,sb('I','m'),'b','end');
  // rotor
  s+=`<circle cx="300" cy="128" r="34" class="coil ${o.n>0.01?'on':''}"/>`;for(let i=0;i<8;i++){const a=i*45*D;s+=`<circle cx="${fx(300+24*Math.cos(a))}" cy="${fx(128+24*Math.sin(a))}" r="3.5" fill="var(--wire)"/>`}
  s+=arT(300,186,'العضو الدوار',{fs:12});
  // auxiliary branch
  if(type==='split'){s+=S.w(`M${xa} ${yT}V62`,cA)+swV(xa,62,92,sw,cA)+S.w(`M${xa} 92V108`,cA)+coil(xa,108,xa,196,5,cA)+S.w(`M${xa} 196V${yB}`,cA)}
  else if(type==='cstart'){s+=S.w(`M${xa} ${yT}V56`,cA)+swV(xa,56,84,sw,cA)+capV(xa,84,122,cA,'C')+coil(xa,122,xa,198,5,cA)+S.w(`M${xa} 198V${yB}`,cA)}
  else if(type==='perm'){s+=capV(xa,yT,98,cA,'C')+coil(xa,98,xa,196,5,cA)+S.w(`M${xa} 196V${yB}`,cA)}
  else if(type==='two'){const c2=on&&sw?'flow':(on?'live':'');s+=S.w(`M${xa} ${yT}V52M${xa-34} 52H${xa+34}`,cA)+capV(xa-34,52,118,cA,sb('C','1'))+S.w(`M${xa+34} 52V58`,c2)+swV(xa+34,58,84,sw,c2)+capV(xa+34,84,118,c2,sb('C','2'))+S.w(`M${xa-34} 118H${xa+34}M${xa} 118V128`,cA)+coil(xa,128,xa,200,4,cA)+S.w(`M${xa} 200V${yB}`,cA)}
  s+=S.t(xa-24,type==='perm'?170:178,sb('Z','a'),'','end')+arrow(xa+(type==='two'?22:22),type==='perm'?120:136,xa+22,type==='perm'?148:164,'--fg',2)+S.t(xa+30,type==='perm'?140:156,sb('I','a'),'','start');
  if(type==='split'||type==='cstart')s+=arT(xa-14,type==='split'?74:66,'مفتاح يعمل',{a:'start',fs:11})+arT(xa-14,type==='split'?88:80,'بقوة الطرد المركزي',{a:'start',fs:11});
  if(type==='two')s+=arT(xa+58,66,'مفتاح طرد',{a:'end',fs:11})+arT(xa+58,80,'مركزي',{a:'end',fs:11});
  if(fail)s+=`<path d="M${xa-12} ${150}l24 24M${xa+12} ${150}l-24 24" stroke="var(--stop)" stroke-width="3"/>`;
  return s+'</svg>'}

/* ---------- phasor diagrams: الشكل (2-5) / (2-7) ---------- */
function phasorSVG(Im,Ia,o){o=o||{};const It=cadd(Im,Ia);const W=380,H=o.h||270,ox=46,oy=H/2+(o.dy||0);
  const mx=Math.max(cabs(Im),cabs(Ia),cabs(It),1e-6),sc=(W-110)/mx;
  const P=z=>[ox+z.re*sc,oy-z.im*sc];
  let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="مخطط المتجهات">`;
  s+=`<path d="M${ox-20} ${oy}H${W-8}" stroke="var(--line)"/>`+arrow(ox,oy,W-18,oy,'--muted',2.2)+S.t(W-18,oy+18,'V','','end');
  const pa=P(Ia),pm=P(Im),pt=P(It);
  s+=`<path d="M${fx(pa[0])} ${fx(pa[1])}L${fx(pt[0])} ${fx(pt[1])}L${fx(pm[0])} ${fx(pm[1])}" fill="none" stroke="var(--muted)" stroke-dasharray="4 4"/>`;
  const arc=(ang,r,col,lab)=>{if(Math.abs(ang)<0.5)return '';const e=[ox+r*Math.cos(ang*D),oy-r*Math.sin(ang*D)],sw=ang>0?0:1,m=[ox+(r+12)*Math.cos(ang/2*D),oy-(r+12)*Math.sin(ang/2*D)];
    return `<path d="M${ox+r} ${oy}A${r} ${r} 0 0 ${sw} ${fx(e[0])} ${fx(e[1])}" fill="none" stroke="var(${col})" stroke-width="1.4"/>`+S.t(fx(m[0]+4),fx(m[1]+4),lab,'m','start')};
  s+=arc(cang(Ia),58,'--fg',sb('θ','a'))+arc(cang(Im),40,'--blue',sb('θ','m'))+arc(cang(It),78,'--stop',sb('θ','t'));
  s+=arrow(ox,oy,pa[0],pa[1],'--fg',2.8)+arrow(ox,oy,pm[0],pm[1],'--blue',2.8)+arrow(ox,oy,pt[0],pt[1],'--stop',2.8);
  const lab=(p,t,col)=>S.t(fx(p[0]+(p[0]>W-60?-8:8)),fx(p[1]+(p[1]<oy?-6:14)),t,col,p[0]>W-60?'end':'start');
  s+=lab(pa,sb('I','a'),'')+`<g style="fill:var(--blue)">${lab(pm,sb('I','m'),'b')}</g>`+lab(pt,sb('I','t'),'');
  if(o.alpha!=null)s+=S.t(W-10,18,`angle(Ia,Im) = ${fm(o.alpha,1)}°`,o.ok?'b':'','end');
  return s+'</svg>'}

/* ---------- الشكل (2-2): pulsating field = two counter-rotating fields ---------- */
function pulseCircle(cx,cy,r,phi,o){o=o||{};const L=r*0.86;const af=180+phi,ab=-phi;
  const pf=[cx+L*Math.cos(af*D),cy-L*Math.sin(af*D)],pb=[cx+L*Math.cos(ab*D),cy-L*Math.sin(ab*D)];
  const Bv=-Math.sin(phi*D)*L*2;  // vertical sum (+ = up)
  let s=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="var(--surface)" stroke="var(--line)" stroke-width="1.6"/><path d="M${cx} ${cy-r-6}V${cy+r+6}" stroke="var(--line)" stroke-dasharray="3 3"/>`;
  if(o.big){s+=`<path d="M${fx(pf[0])} ${fx(pf[1])}L${fx(pf[0]+pb[0]-cx)} ${fx(pf[1]+pb[1]-cy)}L${fx(pb[0])} ${fx(pb[1])}" fill="none" stroke="var(--muted)" stroke-dasharray="4 4"/>`}
  s+=arrow(cx,cy,pf[0],pf[1],'--stop',o.big?3.2:2.4)+arrow(cx,cy,pb[0],pb[1],'--blue',o.big?3.2:2.4);
  if(Math.abs(Bv)>3)s+=arrow(cx,cy,cx,cy-Bv,'--fg',o.big?4:3);else s+=`<circle cx="${cx}" cy="${cy}" r="${o.big?5:3.5}" fill="var(--fg)"/>`;
  if(o.big){s+=S.t(fx(pf[0]+(pf[0]<cx?-8:8)),fx(pf[1]+(pf[1]<cy?-4:14)),sb('B','f'),'',pf[0]<cx?'end':'start')+`<g style="fill:var(--blue)">${S.t(fx(pb[0]+(pb[0]<cx?-8:8)),fx(pb[1]+(pb[1]<cy?-4:14)),sb('B','b'),'b',pb[0]<cx?'end':'start')}</g>`;
    if(Math.abs(Bv)>3)s+=S.t(cx+10,fx(cy-Bv*0.8),'B','','start')}
  return s}
function fig22SVG(){let s=`<svg viewBox="0 0 600 290" role="img" aria-label="الشكل 2-2 تحليل المجال النابض إلى مجالين دوارين">`;
  [0,45,90,135,180,225].forEach((ph,i)=>{const cx=100+(i%3)*200,cy=i<3?72:212;s+=pulseCircle(cx,cy,46,ph)+S.t(cx-62,cy-48,String(i+1),'b');
    s+=S.t(cx+56,cy-30,'ωs','m','start');if(ph===0||ph===180)s+=S.t(cx,cy+64,'B = 0','m')});
  return s+'</svg>'}
function fig23(o){o=o||{};const Tfw=o.fw||Tfw0,Tbw=o.bw||Tbw0,Ttot=o.tot||Ttot0;const P={w:540,h:300,x0:-1,x1:1,y0:-1.15,y1:1.15,xt:[-1,-0.5,0,0.5,1],yt:[-1,-0.5,0,0.5,1],xf:v=>Math.abs(v).toFixed(1),yf:v=>v.toFixed(1),xl:'Speed (p.u.)',yl:'Torque',aria:'الشكل 2-3 منحنى العزم مع السرعة',
   series:[{pts:sample(Tfw,-1,1,160),col:'--stop',w:2.4},{pts:sample(Tbw,-1,1,160),col:'--blue',w:2.4},{pts:sample(Ttot,-1,1,160),col:'--fg',w:3}],
   extra:(X,Y)=>S.t(fx(X(0.82)),fx(Y(1.08)),'Forward Field','','middle')+`<g style="fill:var(--blue)">${S.t(fx(X(-0.5)),fx(Y(-1.0)),'Backward Field','b','middle')}</g>`+S.t(fx(X(0.4)),fx(Y(0.15)),'Total Torque','','start')+
    (o.live?`<path id="${o.live}-cur" d="" stroke="var(--live)" stroke-width="1.6" stroke-dasharray="5 4"/><circle id="${o.live}-f" r="5.5" cx="-20" cy="-20" fill="var(--stop)"/><circle id="${o.live}-b" r="5.5" cx="-20" cy="-20" fill="var(--blue)"/><circle id="${o.live}-t" r="6.5" cx="-20" cy="-20" fill="var(--fg)"/><circle id="${o.live}-op" r="8" cx="-20" cy="-20" fill="none" stroke="var(--live)" stroke-width="3"/>`:'')};
  return {svg:plotSVG(P),P}}

/* ---------- الشكل (2-1): stator and cage rotor (simplified redrawing of the photo) ---------- */
function fig21SVG(){let s=`<svg viewBox="0 0 520 220" role="img" aria-label="العضو الثابت والعضو الدوار">`;
  // rotor (left)
  s+=`<rect x="20" y="104" width="230" height="10" rx="4" fill="var(--wire)"/><rect x="60" y="62" width="130" height="94" rx="6" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.6"/>`;
  for(let i=0;i<9;i++)s+=`<path d="M${70+i*14} 62L${76+i*14} 156" stroke="var(--live)" stroke-width="3"/>`;
  s+=`<rect x="52" y="60" width="10" height="98" rx="3" fill="var(--live)"/><rect x="188" y="60" width="10" height="98" rx="3" fill="var(--live)"/>`;
  s+=arT(125,190,'عضو دوار ذو قفص سنجابي',{fs:13})+arT(125,206,'(قضبان وحلقتا قصر)',{fs:11,col:'--muted'});
  // stator (right)
  const cx=390,cy=104;s+=`<circle cx="${cx}" cy="${cy}" r="86" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.6"/><circle cx="${cx}" cy="${cy}" r="52" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.4"/>`;
  for(let i=0;i<24;i++){const a=i*15*D;s+=`<rect x="${fx(cx+56*Math.cos(a)-4)}" y="${fx(cy+56*Math.sin(a)-4)}" width="8" height="8" rx="2" fill="var(--live)" transform="rotate(${i*15} ${fx(cx+56*Math.cos(a))} ${fx(cy+56*Math.sin(a))})"/>`}
  s+=arT(cx,206,'عضو ثابت عليه ملفات أحادية الوجه',{fs:13});
  return s+'</svg>'}

/* ---------- الشكل (2-10): shaded-pole motor schematic (also the live lab view) ---------- */
function shadedSVG(o){o=o||{};const fu=o.fu||0,fs=o.fs==null?fu:o.fs,ring=o.ring!==false,ang=o.ang||0,on=!!o.on;
  const col=v=>v>=0?'--stop':'--blue',op=v=>fx(Math.min(0.85,Math.abs(v)*0.85));
  let s=`<svg viewBox="0 0 440 330" role="img" aria-label="تركيب المحرك ذو الوجه المظلل">`;
  // source and wires
  s+=`<circle cx="40" cy="165" r="18" fill="var(--surface)" stroke="var(--fg)" stroke-width="1.8"/><path d="M29 165q5.5 -11 11 0t11 0" fill="none" stroke="var(--fg)" stroke-width="1.6"/>`+S.t(14,170,'V','','end');
  s+=S.w('M40 147V44H138M40 183V286H138',on?'flow':'');
  // poles: top (unshaded left, shaded right) and bottom (mirror: shaded left)
  const pole=(top)=>{const y0=top?18:252,yf=top?70:228,sgn=top?1:-1;let p='';
    p+=`<rect x="150" y="${y0}" width="140" height="60" rx="4" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.6"/>`;
    p+=`<rect x="136" y="${top?28:262}" width="168" height="34" rx="6" fill="none" stroke="var(--live)" stroke-width="5" opacity=".75"/>`;
    const fy=top?78:216,uL=top?150:224,sL=top?224:150;
    p+=`<rect x="${uL}" y="${fy}" width="66" height="36" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.6"/><rect x="${sL}" y="${fy}" width="66" height="36" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.6"/>`;
    p+=`<rect x="${uL+1}" y="${fy+1}" width="64" height="34" fill="var(${col(sgn*fu)})" opacity="${op(fu)}"/><rect x="${sL+1}" y="${fy+1}" width="64" height="34" fill="var(${col(sgn*fs)})" opacity="${op(fs)}"/>`;
    if(ring)p+=`<rect x="${sL+5}" y="${fy-4}" width="56" height="44" rx="6" fill="none" stroke="var(--live)" stroke-width="5"/>`;
    // flux-centre marker
    const a=Math.abs(fu),b=Math.abs(fs);if(on&&a+b>0.08){const xc=((uL+33)*a+(sL+33)*b)/(a+b),ym=top?fy+46:fy-10;p+=`<path d="M${fx(xc)} ${ym+(top?-6:6)}l-7 ${top?12:-12}h14z" fill="var(--fg)"/>`}
    return p};
  s+=pole(true)+pole(false);
  s+=S.t(220,yLab(true),'','m');
  // rotor
  s+=`<g id="${o.id||'shr'}" transform="rotate(${fx(ang)} 220 165)"><circle cx="220" cy="165" r="44" class="coil"/>`;for(let i=0;i<10;i++){const a=i*36*D;s+=`<circle cx="${fx(220+33*Math.cos(a))}" cy="${fx(165+33*Math.sin(a))}" r="4.5" fill="var(--wire)"/>`}
  s+=`<path d="M220 165L220 129" stroke="var(--live)" stroke-width="5" stroke-linecap="round"/><circle cx="220" cy="165" r="6" fill="var(--fg)"/></g>`;
  // labels (as printed, Latin)
  s+=S.t(312,48,'Main winding','','start')+S.t(312,100,ring?'Shading band':'(ring removed)','','start')+S.t(312,170,'Cage-type rotor','','start')+S.t(150,140,'unshaded','m','end')+S.t(296,140,'','m');
  return s+'</svg>'}
function yLab(){return -10}

/* =====================================================================
   مثال (2-1) procedure
   ===================================================================== */
const decs=x=>{const s=String(x);return s.includes('.')?s.split('.')[1].length:0};
function slipSteps(g,B,bookSlip){const dS=Math.max(2,decs(g.S));const Sb=bookSlip?0.96:B.round(2-g.S,dS);const ns=B.round(120*g.f/g.p,0),k=B.round(1-g.S,dS),n=B.round(ns*k,0);
  return [
   {t:'أ) معامل الانزلاق للمجال الخلفي (المعادلة 2-5):',f:`S_b = 2 - S = 2 - ${g.S}`,v:Sb,dp:dS,final:true},
   bookSlip?{t:'<b>هكذا طُبع في الكتاب (0.96).</b> والصحيح \\(2 - 0.04 = 1.96\\)؛ الرقم 0.96 هو \\((1 - S)\\) الذي يُستعمل في الفرع (ج). اختر الحل المصحح أدناه للمقارنة.'}:null,
   {t:'ب) السرعة التزامنية:',f:`n_s = \\frac{120\\,f_s}{p} = \\frac{120\\times ${g.f}}{${g.p}}`,v:ns,unit:'rpm',dp:0,final:true},
   {t:'ج) سرعة المحرك عند الحمل الكامل:',f:`n = n_s(1 - S) = ${fm(k,dS)}\\times ${ns}`,v:n,unit:'rpm',dp:0,final:true},
   {t:'للتحقق (توضيح، ليس من الكتاب): سرعة المجال الخلفي بالنسبة للعضو الدوار',f:`n_s + n = ${ns} + ${n}`,v:ns+n,unit:'rpm',dp:0}
  ].filter(Boolean)}
const G21=[{id:'f',label:'تردد المصدر',sym:'f_s',unit:'Hz',value:60},{id:'p',label:'عدد الأقطاب',sym:'p',unit:'',value:4,step:2,min:2},{id:'S',label:'الانزلاق عند الحمل الكامل',sym:'S',unit:'',value:0.04,step:0.005,min:0,max:1}];

/* =====================================================================
   مثال (2-2) procedure — book rounding points; BK22 = printed numbers
   ===================================================================== */
const BK22={zm:25.03,zma:87.252,Im:4,re1:0.192,im1:3.995,re2:7.81,im2:3.254,tre:8.02,tim:7.25,It:10.8,Ita:-42.11,pf:0.742};
function splitSteps(g,B,bk){
  const Zm=Cx(g.Rm,g.Xm),Za=Cx(g.Ra,g.Xa);
  const zm=bk?bk.zm:B.round(cabs(Zm),2),zma=bk?bk.zma:B.round(cang(Zm),3),za=B.round(cabs(Za),2),zaa=B.round(cang(Za),2);
  const Im=bk?bk.Im:B.round(g.V/zm,2),Ia=B.round(g.V/za,2);const ama=B.round(zma,2);
  const re1=bk?bk.re1:B.round(Im*Math.cos(ama*D),3),im1=bk?bk.im1:B.round(Im*Math.sin(ama*D),3),re2=bk?bk.re2:B.round(Ia*Math.cos(zaa*D),3),im2=bk?bk.im2:B.round(Ia*Math.sin(zaa*D),3);
  const tre=bk?bk.tre:B.round(re1+re2,2),tim=bk?bk.tim:B.round(im1+im2,2);
  const It=bk?bk.It:B.round(Math.hypot(tre,tim),1),Ita=bk?bk.Ita:B.round(-Math.atan2(tim,tre)/D,2),pf=bk?bk.pf:B.round(Math.cos(Ita*D),3);
  const th=B.round(-ama-(-zaa),2);
  const pol=(m,a,dm,da)=>`${fm(m,dm)}\\angle ${ltx(a,da)}^\\circ`;
  const ex=cadd(cdiv(Cx(g.V),Zm),cdiv(Cx(g.V),Za));
  return [
   {t:'التيار في الملف الرئيسي: نحوّل المعاوقة إلى الصورة القطبية ثم نقسم',f:`I_m = \\frac{V}{Z_m} = \\frac{${g.V}\\angle 0}{${g.Rm} + j${g.Xm}} = \\frac{${g.V}\\angle 0}{${pol(zm,zma,2,3)}}`},
   {t:bk?'تيار الملف الرئيسي كما طُبع في الكتاب:':'تيار الملف الرئيسي:',f:`I_m = ${pol(Im,-zma,bk?0:2,3)}\\ A`,final:true},
   bk?{t:'<b>ملاحظة:</b> \\(110 \\div 25.03 = 4.39\\) وليس 4؛ الكتاب أكمل الحل بالقيمة 4.'}:null,
   {t:'تيار الملف المساعد:',f:`I_a = \\frac{V}{Z_a} = \\frac{${g.V}\\angle 0}{${g.Ra} + j${g.Xa}} = \\frac{${g.V}\\angle 0}{${fm(za)}\\angle ${ltx(zaa,2)}^\\circ} = ${pol(Ia,-zaa,2,2)}\\ A`,final:true},
   {t:'التيار الكلي المسحوب من المصدر: نحوّل كل تيار إلى الصورة الكارتيزية ونجمع',f:`I_t = I_m + I_a = ${pol(Im,-ama,bk?0:2,2)} + ${pol(Ia,-zaa,2,2)}`},
   {f:`I_t = (${fm(re1,3)} - j${fm(im1,3)}) + (${fm(re2,bk?2:3)} - j${fm(im2,3)})`},
   {t:bk?'كما طُبع:':'',f:`I_t = ${fm(tre,2)} - j${fm(tim,2)} = ${pol(It,Ita,1,2)}\\ A`,final:true},
   bk?{t:'<b>ملاحظة:</b> \\(0.192 + 7.81 = 8.00\\) وليس 8.02؛ وبالقيمة 8.00 تكون \\(I_t = 10.80\\angle -42.18^\\circ\\) و \\(\\cos = 0.741\\). الفرق صغير، لكن الخطأ الأكبر هو 4 A بدل 4.39 A.'}:null,
   {t:'معامل القدرة (متأخر):',f:`\\cos(${ltx(Ita,2)}^\\circ)`,v:pf,dp:3,final:true},
   {t:'الزاوية بين تياري الملف الرئيسي والملف المساعد:',f:`\\theta = \\theta_m - \\theta_a = ${ltx(-ama,2)} - (${ltx(-zaa,2)})`,v:th,unit:'°',dp:2,final:true},
   {t:bk?`«I<sub>m</sub> lags I<sub>a</sub> by 64.62°» كما طُبع في السطر الأخير (والقيمة من السطر السابق 64.63°، فرق تقريب).`:`أي أن \\(I_m\\) متأخر عن \\(I_a\\) بزاوية ${lt(fm(Math.abs(th),2)+'°')}، وهي أقل من 90° بكثير، لذلك عزم بدء المحرك المشطور متوسط.`},
   bk?null:{t:'للمقارنة (ليس من الكتاب): الحساب بلا تقريب للخطوات',v:`${fm(cabs(ex),2)} ∠ ${neg(cang(ex),2)}°  ·  pf = ${fm(Math.cos(cang(ex)*D),3)}`,unit:''}
  ].filter(Boolean)}
const G22=[{id:'V',label:'جهد المصدر',sym:'V',unit:'V',value:110},{id:'Rm',label:'مقاومة الملف الرئيسي',sym:'R_m',unit:'Ω',value:1.2},{id:'Xm',label:'ممانعة الملف الرئيسي الحثية',sym:'X_m',unit:'Ω',value:25},
  {id:'Ra',label:'مقاومة الملف المساعد',sym:'R_a',unit:'Ω',value:12},{id:'Xa',label:'ممانعة الملف المساعد الحثية',sym:'X_a',unit:'Ω',value:5}];

/* =====================================================================
   مثال (2-3) procedure (also س8) — book rounds tan to two significant figures (1.105 → 1.1)
   ===================================================================== */
const sig2=x=>Number(x.toPrecision(2));
function capSteps(g,B,o){o=o||{};
  const thm=B.round(Math.atan(g.Xm/g.Rm)/D,2),tha=B.round(g.al-thm,2),tn=sig2(Math.tan(tha*D)),Xc=B.round(tn*g.Ra+g.Xa,2),w=B.round(2*PI*g.f,0),C=B.round(1e6/(w*Xc),0);
  const tnE=Math.tan(tha*D),XcE=tnE*g.Ra+g.Xa,CE=1e6/(2*PI*g.f*XcE);
  return [
   {t:'زاوية معاوقة الملفات الرئيسة (التيار \\(I_m\\) متأخر عن الجهد بهذه الزاوية):',f:`\\theta_m = \\tan^{-1}\\left(\\frac{${g.Xm}}{${g.Rm}}\\right)`,v:thm,unit:'°',dp:2},
   {t:`زاوية الفرع المساعد يجب أن تكون (ليتقدم \\(I_a\\) بها فتصبح الزاوية بين التيارين ${lt(g.al+'°')}):`,f:`\\theta_a = ${g.al} - \\theta_m = ${g.al} - ${fm(thm,2)}`,v:tha,unit:'°',dp:2},
   {t:'ممانعة المكثف \\(X_c\\) يجب أن تحقق العلاقة:',f:`\\tan^{-1}\\left(\\frac{X_c - ${g.Xa}}{${g.Ra}}\\right) = ${fm(tha,2)} \\;\\Rightarrow\\; \\frac{X_c - ${g.Xa}}{${g.Ra}} = \\tan(${fm(tha,2)}) = ${tn}`},
   {t:'(الكتاب قرّب الظل إلى رقمين معنويين: ' +lt('tan '+fm(tha,2)+'° = '+fm(tnE,3)+' ≈ '+tn)+')'},
   {f:`X_c = ${tn}\\times(${g.Ra}) + ${g.Xa}`,v:Xc,unit:'Ω',dp:2,final:true},
   {t:'سعة المكثف من \\(X_c = \\frac{1}{\\omega c} = \\frac{1}{2\\pi f c}\\):',f:`c = \\frac{1}{\\omega\\,X_c} = \\frac{1}{${w}\\times ${fm(Xc,2)}}`,v:C,unit:'µF',dp:0,final:true},
   {t:'للمقارنة (ليس من الكتاب): بلا تقريب الظل',v:`Xc = ${fm(XcE,2)} Ω  ·  C = ${fm(CE,1)} µF`,unit:''},
   o.v127?{t:`الجهد (${g.V} V) لا يدخل في الحل، لأن الزاوية تعتمد على المعاوقات فقط.`}:null
  ].filter(Boolean)}
const G23=[{id:'V',label:'جهد المصدر (لا يدخل في الحل)',sym:'V',unit:'V',value:127},{id:'f',label:'التردد',sym:'f',unit:'Hz',value:60},{id:'Rm',label:'مقاومة الملفات الرئيسة',sym:'R_m',unit:'Ω',value:4.2},{id:'Xm',label:'الممانعة الحثية للرئيسة',sym:'X_m',unit:'Ω',value:3.8},
  {id:'Ra',label:'مقاومة الملفات المساعدة',sym:'R_a',unit:'Ω',value:8.8},{id:'Xa',label:'الممانعة الحثية للمساعدة',sym:'X_a',unit:'Ω',value:3.3},{id:'al',label:'الزاوية المطلوبة بين التيارين',sym:'\\alpha',unit:'°',value:90}];
const cloneG=(arr,vals)=>arr.map(g=>Object.assign({},g,vals&&vals[g.id]!=null?{value:vals[g.id]}:{}));

/* =====================================================================
   Lesson 2.1 — construction and double revolving-field theory
   ===================================================================== */
B.lesson({
 id:'u2-l1',unit:2,order:1,pages:'72–78',
 title:'التركيب ونظرية المجال المغناطيسي المزدوج الدوار',
 summary:'المحرك الحثي أحادي الوجه ملف أحادي الوجه على الثابت وقفص سنجابي على الدوار. مجاله النابض يساوي مجالين دوارين متعاكسين، فلا يملك عزم بدء، لكنه يستمر في الدوران في الاتجاه الذي يُدفع فيه. ونحسب الانزلاق الأمامي والخلفي.',
 theory:[
  {h:'الهدف العام والأهداف التفصيلية للوحدة',ref:'ص 72',html:`<p><b>الهدف العام للوحدة:</b> «معرفة أنواع وتركيب ونظرية عمل وخواص المحركات الحثية أحادية الوجه وطرق بدء حركتها واستخداماتها.»</p>
   <ol><li>أن يلم المتدرب بأنواع و تركيب و استخدامات المحركات الحثية أحادية الوجه.</li><li>أن يفهم المتدرب نظرية عمل المحركات الحثية أحادية الوجه.</li><li>أن يلم المتدرب بأنواع وخواص وتطبيقات المحركات الحثية أحادية الوجه.</li><li>أن يعرف المتدرب تركيب وكيفية عمل الأنواع المختلفة من المحركات الحثية أحادية الوجه.</li><li>أن يفهم المتدرب كيفية تحليل المجال المغناطيسي إلى مجالين دوارين كأساس لحساب العزم المتولد في المحركات الحثية أحادية الوجه.</li><li>أن يعرف المتدرب استخدامات المحركات الحثية أحادية الوجه.</li><li>أن يميز المتدرب بين الطرق المختلفة لبدء حركة المحركات الحثية أحادية الوجه ومميزات كل منها.</li><li>أن يعرف المتدرب منحنيات الخواص لأنواع المحركات الحثية أحادية الوجه.</li></ol>
   <p class="sub">الكتاب لا يذكر في هذه الوحدة الوقت المتوقع ولا الوسائل ولا المتطلبات السابقة.</p>`},
  {err:'ترقيم الصفحات في الحقيبة: بعد ص 72 تأتي ص 74 مباشرة (لا توجد صفحة مطبوعة برقم 73). أرقام الصفحات هنا هي المطبوعة.'},
  {h:'التركيب',ref:'ص 74',html:`<p>«تتكون المحركات الحثية أحادية الوجه من <b>ملفات أحادية الوجه على العضو الثابت</b>، و<b>عضو دوار ذو قفص سنجابي</b> كما يبين ذلك الشكل (2-1)، فتركيبها يشبه المحركات الحثية ثلاثية الأوجه ذات القفص السنجابي، عدا ما يختص بملفات العضو الثابت حيث تكون أحادية الوجه. هذه الملفات موزعة في مجاري العضو الثابت بطريقة تجعلنا نحصل على قوة دافعة مغناطيسية موزعة توزيع جيبي في الفراغ، وبالتالي نحصل على منحنى جيبي لكثافة الفيض المغناطيسي في الثغرة الهوائية.»</p>
   <p>«ومن أهم سمات هذه المحركات أنها <b>لا تمتلك عزم لبدء الحركة</b>، ولكن إذا بدأت حركتها بأي وسيلة مساعدة في اتجاه معين فسوف تستمر في الدوران في نفس ذلك الاتجاه.»</p>`},
  {fig:'(2-1)',ref:'ص 74',caption:'العضو الثابت والعضو الدوار لمحرك حثي أحادي الوجه (في الكتاب صورة فوتوغرافية؛ هنا رسم مبسط لها)',draw:()=>`<div class="svgbox im-svg">${fig21SVG()}</div>`},
  {h:'نظرية المجال المغناطيسي المزدوج الدوار',ref:'ص 74–75',html:`<p>«عند تغذية ملف العضو الثابت من مصدر جهد متردد، ذو موجة جيبيه، فإن موجة القوة الدافعة المغناطيسية المتولدة تكون موزعة توزيعاً جيبياً في الثغرة الهوائية (θ)، و متناسبة جيبياً مع الزمن (t)، ويمكن كتابتها كدالة جيبيه في الفراغ والزمن كما توضح ذلك المعادلة (2-1):»</p>
   $$F_1 = F_{1\\max}\\cos(\\omega_s t)\\cdot\\cos(\\theta) \\qquad (2\\text{-}1)$$
   <p>«هذه القوة الدافعة المغناطيسية تولد مجالا مغناطيسيا، له نفس الخواص في الفراغ و الزمن، ويمكن تمثيله رياضيا بالمعادلة (2-2):»</p>
   $$B_1 = B_{1\\max}\\cos(\\omega_s t)\\cdot\\cos(\\theta) \\qquad (2\\text{-}2)$$
   <p>«يمكن تحليل هذا المجال المغناطيسي إلى مجالين مغناطيسيين دوارين، <b>الأول يدور عكس عقارب الساعة ويسمى بالمجال المغناطيسي الدوار الأمامي</b>، <b>والمجال الآخر يدور في اتجاه عقارب الساعة ويسمى بالمجال المغناطيسي الدوار الخلفي</b>، المعادلة (2-3) توضح هذا التحليل:»</p>
   $$B_1 = \\tfrac{1}{2}B_{1\\max}\\cos(\\theta-\\omega_s t) + \\tfrac{1}{2}B_{1\\max}\\cos(\\theta+\\omega_s t) \\qquad (2\\text{-}3)$$
   <p>«حيث يمثل الحد الأول مجالاً مغناطيسياً جيبياً دوارا بالسرعة التزامنية وذو كثافة عظمى \\(\\tfrac12 B_{1\\max}\\)، كما يمثل الحد الثاني مجالاً مغناطيسياً جيبياً دوارا بنفس الكثافة العظمى، ويدور المجالان في اتجاهين متضادين بنفس السرعة التزامنية \\(\\omega_s\\) حول محيط الثغرة الهوائية. كلاهما يولد عزم دوران في الاتجاه الذي يدور فيه، كما في حالة المحركات الحثية ثلاثية الأوجه.»</p>
   <p class="sub">الرموز: \\(F_1\\) القوة الدافعة المغناطيسية لملف الثابت و\\(F_{1\\max}\\) قيمتها العظمى؛ \\(B_1\\) كثافة الفيض في الثغرة و\\(B_{1\\max}\\) قيمتها العظمى؛ \\(\\omega_s\\) السرعة الزاوية التزامنية (التردد الزاوي للمصدر)؛ \\(t\\) الزمن؛ \\(\\theta\\) الموضع الزاوي على محيط الثغرة. الكتاب لا يذكر الوحدات.</p>`},
  {note:`<b>توضيح للمتدرب (ليس من نص الكتاب):</b> الملف الواحد يصنع مجالاً «ينبض» في مكانه: يكبر ويصغر وينعكس على محور ثابت ولا يدور. فكرة الكتاب أن هذا المجال النابض يساوي تماماً مجموع سهمين طول كل منهما نصف القيمة العظمى، يدوران بنفس السرعة في اتجاهين متعاكسين. كل سهم وحده يشبه المجال الدوار في المحرك ثلاثي الأوجه ويحاول سحب الدوار معه. إذا كان الدوار ساكناً يتساوى الشدّان فلا يتحرك.`},
  {h:'تحليل المجال النابض إلى مجالين دوارين',ref:'ص 75–76',html:`<p>«وباستخدام الرسم التوضيحي المبين في الشكل (2-2)، حيث المتجه الدوار \\(\\vec B_f\\) يمثل المجال الأمامي والمتجه \\(\\vec B_b\\) يمثل المجال الخلفي يلاحظ أن مجموع هذين المتجهين \\(\\vec B\\) يكون دائماً في اتجاه رأسي وتتغير قيمته مع دوران المتجهين \\(\\vec B_f\\) و \\(\\vec B_b\\) و هو يعادل المجال المغناطيسي النابض الناشئ عن ملف أحادي الوجه.»</p>
   $$\\vec B = \\vec B_f + \\vec B_b \\qquad (2\\text{-}3)$$`},
  {err:'رقم المعادلة (2-3) مكرر في الكتاب (ص 75): استُعمل مرة لتحليل \\(B_1\\) إلى حدّين، ومرة للمعادلة \\(\\vec B = \\vec B_f + \\vec B_b\\). أبقينا الرقمين كما طُبعا.'},
  {fig:'(2-2)',ref:'ص 76',caption:'كيفية تحليل المجال النابض إلى مجالين دوارين — الأحمر \\(B_f\\) (عكس عقارب الساعة) والأخضر \\(B_b\\) (مع عقارب الساعة) والأسود المحصلة \\(B\\). جرّبه متحركاً في «المختبر».',draw:()=>`<div class="svgbox im-svg">${fig22SVG()}</div>`},
  {html:`<table class="tt"><thead><tr><th>المرحلة في الشكل</th><th>\\(B_f\\) و \\(B_b\\)</th><th>المحصلة \\(B\\)</th></tr></thead><tbody>
   <tr><td>1</td><td>أفقيان متعاكسان</td><td>صفر</td></tr><tr><td>2</td><td>مائلان إلى أسفل</td><td>رأسية لأسفل (متوسطة)</td></tr><tr><td>3</td><td>منطبقان رأسياً لأسفل</td><td>رأسية لأسفل بأقصى قيمة</td></tr>
   <tr><td>4</td><td>تجاوز كل منهما الآخر</td><td>رأسية لأسفل (متوسطة)</td></tr><tr><td>5</td><td>أفقيان متعاكسان (تبادلا المكان)</td><td>صفر</td></tr><tr><td>6</td><td>مائلان إلى أعلى</td><td>رأسية لأعلى</td></tr></tbody></table>`},
  {h:'منحنى العزم مع السرعة',ref:'ص 76–77',html:`<p>«إذا يمكننا الحصول على خواص المحرك الحثي أحادي الوجه، بجمع خواص محركين متماثلين، كل منهما ثلاثي الأوجه و يدور عكس الآخر. إذا قمنا برسم منحنى العلاقة بين العزم والسرعة، لكل من المجالين، نستطيع الحصول على منحنى خواص المحرك الحثي أحادي الوجه (مجموع خواص المحركين)، كما هو مبين في الشكل (2-3).»</p>`},
  {fig:'(2-3)',ref:'ص 76',caption:'منحنى العزم مع السرعة للمجالين الأمامي والخلفي والمحصلة (اليمين: الدوران مع المجال الأمامي، اليسار: الاتجاه المعاكس). المنحنيات مرسومة بشكل منحنى المحرك الحثي ثلاثي الأوجه (أرقام توضيحية).',draw:()=>`<div class="svgbox im-svg">${fig23().svg}</div>${legend([['--stop','Forward Field (الأمامي)'],['--blue','Backward Field (الخلفي)'],['--fg','Total Torque (المحصلة)']])}`},
  {html:`<p>«في حالة سكون العضو الدوار وعند بدء الحركة يكون عزم الدوران الناتج عن المجال الأمامي، مساوياً ومضاداً في الاتجاه للعزم الناتج عن المجال الخلفي، مما يجعل <b>محصلة عزم الدوران المؤثر على العضو الدوار مساوية للصفر</b> فلا يكون هناك عزم لبدء الحركة، وهي إحدى خصائص هذا النوع من المحركات. ولكن إذا بدأ المحرك حركته الدورانية بوسيلة مساعدة في اتجاه معين فسيستمر في الدوران في نفس ذلك الاتجاه (يمكن اعتبار عزم الدوران الناشئ عن المجال الخلفي كعزم دوران فرملي يعيق حركة دوران المحرك).»</p>`},
  {h:'الانزلاق الأمامي والانزلاق الخلفي',ref:'ص 77',html:`<p>«عندما يدور العضو الدوار للمحرك بسرعة دورانية مقدارها \\(n\\) في اتجاه دوران المجال الأمامي، والذي يدور بسرعة التزامن \\(n_s\\)، فإن الانزلاق الأمامي يكون مساوياً:»</p>
   $$S_f = S = \\frac{(n_s-n)}{n_s} \\qquad (2\\text{-}4)$$
   <p>«بينما يدور المجال الخلفي عكس الاتجاه بالسرعة \\(n_s\\)، أي أنه يدور بالسرعة \\((n_s+n)\\) بالنسبة للعضو الدوار، فيكون معامل الانزلاق للمجال الخلفي \\(S_b\\) مساوياً:»</p>
   $$S_b = \\frac{(n_s+n)}{n_s} = 2 - S \\qquad (2\\text{-}5)$$
   <p>«عند ظروف التشغيل العادية بمعامل انزلاق في حدود 5% (\\(S = 0.05\\)) للمجال الأمامي، تكون قيمة معامل الانزلاق للمجال الخلفي كبيرة جداً مقارنة بقيمة معامل الانزلاق للمجال الأمامي (\\(S_b = 1.95\\)).»</p>
   <p>ويستعمل الكتاب في المثال أيضاً: \\(n_s = \\dfrac{120 f_s}{p}\\) و \\(n = n_s(1-S)\\)، حيث \\(f_s\\) تردد المصدر (Hz) و \\(p\\) عدد الأقطاب، والسرعات بالدورة في الدقيقة <span class="ltr">(rpm)</span>.</p>`},
  {note:`<b>توضيح للمتدرب (ليس من نص الكتاب):</b> لماذا \\(2-S\\)؟ لأن \\(\\frac{n_s+n}{n_s} = 1 + \\frac{n}{n_s} = 1 + (1-S) = 2 - S\\). مثال: محرك يدور بسرعة <span class="ltr">1728 rpm</span> و <span class="ltr">n<sub>s</sub> = 1800 rpm</span>: يرى المجال الأمامي يسبقه بـ <span class="ltr">72 rpm</span> فقط (S = 0.04)، بينما يرى المجال الخلفي قادماً عكسه بسرعة <span class="ltr">1800 + 1728 = 3528 rpm</span> أي \\(S_b = 1.96\\).`},
  {h:'مثال (2-1)',ref:'ص 77–78',html:`<p>«محرك حثي أحادي الوجه، 60Hz، 230V، ذو أربعة أقطاب يعمل عند الحمل الكامل بانزلاق مقداره 4% احسب ما يلي: أ) معامل الانزلاق للمجال الخلفي \\(S_b\\) — ب) السرعة التزامنية \\(n_s\\) — ج) سرعة المحرك عند الحمل الكامل n.»</p>
   <p>الحل كما طُبع (ص 78): \\(S_b = 2 - 0.04 = 0.96\\) ؛ \\(n_s = \\frac{120\\times 60}{4} = 1800\\) rpm ؛ \\(n = 0.96\\times 1800 = 1728\\) rpm. الحل خطوة بخطوة (كما في الكتاب والمصحح) في تبويب «الأمثلة المحلولة».</p>`},
  {err:'في حل مثال (2-1) ص 78 طُبع \\(S_b = 2 - 0.04 = 0.96\\)، والصحيح <b>1.96</b>. (الكتاب نفسه ذكر في ص 77 أن \\(S_b = 1.95\\) عند \\(S = 0.05\\)). الرقم 0.96 هو \\((1 - S)\\) المستعمل صحيحاً في الفرع (ج). الفرعان (ب) و(ج) صحيحان. في «الأمثلة المحلولة» حاسبتان: كما في الكتاب، والمصحح.'}
 ],
 lab:(el)=>{
  let phi=0,play=0,vs=0.25,stage=0,played=0,cur=0.3,cMoved=0,on=0,n=0,L=0.05,ang=0,restT=0,dirs={p:0,m:0};
  let F=null,K=null;
  el.innerHTML=`<div id="l1tp"></div><div class="grid">
   <div class="panel c7"><h2>المجال النابض = مجالان دواران <small>مبنية على الشكل (2-2) ص 76</small></h2>
    <div class="svgbox" style="max-width:360px;margin-inline:auto"><svg viewBox="0 0 300 300" role="img" aria-label="المتجهات الدوارة" id="l1v"></svg></div>
    <div class="im-row"><button class="btn primary" id="l1play">تشغيل الدوران</button><span class="sub">المراحل كما في الشكل:</span>${segHTML('stg',[[1,'1'],[2,'2'],[3,'3'],[4,'4'],[5,'5'],[6,'6']],0)}</div>
    ${sl('l1sp','سرعة العرض (مبطّأة)',0.05,1,0.05,vs)}
    <div class="facts">${fact('|B<sub>f</sub>| = |B<sub>b</sub>|','l1bf')}${fact('المحصلة B (رأسية)','l1b')}${fact('زاوية الدوران ω<sub>s</sub>t','l1ph')}</div></div>
   <div class="panel c5"><h2>المحصلة B مع الزمن</h2><div class="svgbox"><svg viewBox="0 0 320 200" id="l1w" role="img" aria-label="المحصلة مع الزمن"></svg></div>
    <p class="sub">المحصلة لا تدور: تكبر وتصغر وتنعكس على المحور الرأسي فقط، وأقصى قيمة لها \\(B_{1\\max}\\) = ضعف طول كل سهم.</p>${legend([['--stop','B<sub>f</sub> الأمامي (عكس عقارب الساعة)'],['--blue','B<sub>b</sub> الخلفي (مع عقارب الساعة)'],['--fg','B المحصلة']])}</div>
   <div class="panel c7"><h2>عزم المجالين والمحصلة <small>مبنية على الشكل (2-3) ص 76 (<span id="l1tpw">أرقام توضيحية</span>)</small></h2>
    <div class="svgbox im-svg" id="l1tq"></div>${legend([['--stop','الأمامي'],['--blue','الخلفي'],['--fg','المحصلة'],['--live','نقطة تشغيل المحرك']])}
    ${sl('l1c','مؤشر السرعة للاستكشاف (موجب = مع المجال الأمامي)',-1,1,0.01,cur)}
    <div class="facts">${fact('عزم الأمامي','l1tf')}${fact('عزم الخلفي','l1tb')}${fact('المحصلة','l1tt')}</div><div class="callout" id="l1msg"></div></div>
   <div class="panel c5"><h2>المحرك <small>بيانات مثال (2-1): 60 Hz، 4 أقطاب</small></h2>
    <div class="svgbox" style="max-width:220px;margin-inline:auto">${rotorSVG('l1r')}</div>
    <div class="im-row">${swHTML('l1on','230 V','توصيل المصدر',0)}<button class="btn" id="l1pccw">دفعة ↺ (عكس عقارب الساعة)</button><button class="btn" id="l1pcw">دفعة ↻ (مع عقارب الساعة)</button></div>
    ${sl('l1L','الحمل (مروحة)',0,0.6,0.005,L)}
    <div class="facts">${fact('السرعة','l1n')}${fact('الانزلاق S','l1s')}${fact('S<sub>b</sub> = 2 − S','l1sb')}${fact('الحالة','l1st')}</div></div>
   <div class="panel c12">${tryList(['اضغط المراحل 1 ثم 3 ثم 5: المحصلة صفر عندما يتعاكس السهمان، وأقصى قيمة عندما ينطبقان.','حرّك مؤشر السرعة إلى الصفر: عزم الأمامي يساوي عزم الخلفي ويعاكسه، فالمحصلة صفر.','صِل المصدر والدوار ساكن: لا يدور. ثم أعطه دفعة في أي اتجاه: يكمل في نفس الاتجاه.','اضبط الحمل حتى يصير الانزلاق 0.04 (1728 rpm) وانظر S<sub>b</sub> = 1.96 كما في الحل المصحح لمثال (2-1).'])}<h3 class="sm">التجربة الموجّهة</h3><ol class="steps" id="l1steps"></ol></div></div>`;
  B.math(el);const $=s=>el.querySelector(s);
  const drawF=()=>{K=klossSet(TP.v.SM);F=fig23({live:'l1',fw:K.fw,bw:K.bw,tot:K.tot});$('#l1tq').innerHTML=F.svg;$('#l1tpw').textContent=TP.trainer?'قيم المدرب':'أرقام توضيحية'};
  const TP=B.params($('#l1tp'),'u2-l1',[
   {k:'SM',label:'انزلاق أقصى عزم لكل مجال (يحدد شكل منحنيات العزم)',unit:'',value:0.2,min:0.05,max:0.8,step:0.01},
   {k:'J',label:'ثابت زمن التسارع (يكبر مع ثقل العضو الدوار)',unit:'s',value:0.25,min:0.05,max:20,step:0.05},
   {k:'fr',label:'عزم الاحتكاك عند سرعة التزامن',unit:'pu',value:0.02,min:0,max:0.3,step:0.01}],drawF);
  drawF();
  $('#l1play').onclick=()=>{play=!play;played=played||play;$('#l1play').textContent=play?'إيقاف الدوران':'تشغيل الدوران';$('#l1play').classList.toggle('primary',!play);stage=0;segSet(el,'stg',-1)};
  el.querySelectorAll('[data-stg]').forEach(b=>b.onclick=()=>{stage=+b.dataset.stg;phi=[0,45,90,135,180,225][stage-1];play=0;$('#l1play').textContent='تشغيل الدوران';$('#l1play').classList.add('primary');segSet(el,'stg',stage);seen[stage]=1});
  const seen={};
  $('#l1sp').oninput=e=>{vs=+e.target.value};$('#l1c').oninput=e=>{cur=+e.target.value;cMoved=1};$('#l1L').oninput=e=>{L=+e.target.value};
  $('#l1on').onclick=()=>{on=on?0:1;$('#l1on').setAttribute('aria-pressed',on?'true':'false')};
  const push=d=>{if(Math.abs(n)<0.15)n=0.15*d};$('#l1pccw').onclick=()=>push(1);$('#l1pcw').onclick=()=>push(-1);
  const steps=stepsUI($('#l1steps'),[
   {t:'شغّل دوران السهمين',x:'اضغط «تشغيل الدوران». السهم الأحمر \\(B_f\\) يدور عكس عقارب الساعة والأخضر \\(B_b\\) مع عقارب الساعة بنفس السرعة. راقب السهم الأسود: يبقى رأسياً دائماً.',done:()=>played},
   {t:'المرحلة 3: أقصى قيمة',x:'اضغط المرحلة 3: السهمان منطبقان لأسفل فالمحصلة أكبر ما يمكن (ضعف طول كل سهم).',done:()=>seen[3]},
   {t:'المرحلة 1 أو 5: المحصلة صفر',x:'اضغط المرحلة 1 أو 5: السهمان متعاكسان أفقياً فالمحصلة صفر.',done:()=>seen[1]||seen[5]},
   {t:'لا عزم عند السكون',x:'حرّك مؤشر السرعة في لوحة العزم إلى <span class="ltr">0</span>: عزم الأمامي = عزم الخلفي معكوساً، والمحصلة صفر.',done:()=>cMoved&&Math.abs(cur)<0.015},
   {t:'صِل المصدر والدوار ساكن',x:'شغّل مفتاح المصدر ولا تضغط أي دفعة. انتظر قليلاً: الدوار لا يتحرك لأن عزم البدء صفر.',done:()=>on&&n===0&&restT>2},
   {t:'دفعة في اتجاه',x:'اضغط إحدى الدفعتين: يتسارع المحرك ويكمل في نفس الاتجاه حتى يقترب من سرعة التزامن.',done:()=>Math.abs(n)>0.8},
   {t:'الاتجاه الآخر',x:'افصل المصدر حتى يقف، ثم صِله وادفع في الاتجاه المعاكس: يدور بنفس الطريقة لكن عكساً. المجال «الخلفي» صار هو الذي يسحب.',done:()=>dirs.p&&dirs.m},
   {t:'الانزلاق الخلفي',x:'اضبط الحمل حتى يصبح \\(S = 0.04\\) تقريباً (السرعة ≈ <span class="ltr">1728 rpm</span>): لاحظ أن \\(S_b \\approx 1.96\\) وليس 0.96.',done:()=>on&&Math.abs(Math.abs(n)-0.96)<0.004}
  ]);
  const hist=[];let tt=0,lastW=0;
  loopOn(el,dt=>{tt+=dt;if(play)phi=(phi+360*vs*dt)%360;
   const Bv=-Math.sin(phi*D);
   $('#l1v').innerHTML=pulseCircle(150,150,96,phi,{big:1})+S.t(150,18,'ωs','m')+S.t(12,292,'Bf: ↺  ·  Bb: ↻','m','start');
   $('#l1bf').textContent='½ B1max';$('#l1b').textContent=(Bv>=0?'':'−')+fm(Math.abs(Bv),2)+' B1max'+(Math.abs(Bv)<0.01?' (صفر)':'');$('#l1ph').textContent=fm(phi,0)+'°';$('#l1sp-v').textContent=fm(vs,2)+' دورة/ث';
   hist.push([tt,Bv]);while(hist.length&&tt-hist[0][0]>6)hist.shift();
   if(tt-lastW>0.06){lastW=tt;const t0=Math.max(0,tt-6);let p='';hist.forEach((h,i)=>{p+=(i?'L':'M')+fx(20+(h[0]-t0)/6*290)+' '+fx(100-h[1]*80)});
    $('#l1w').innerHTML=`<path d="M20 100H312M20 18V182" stroke="var(--line)"/><path d="${p}" fill="none" stroke="var(--fg)" stroke-width="2.6"/>`+S.t(16,24,'+','m','end')+S.t(16,182,'−','m','end')+S.t(312,116,'t','m','end')}
   // motor
   const ks=Math.max(1,Math.ceil(dt*(2/TP.v.SM)/TP.v.J/2-1e-9)),h=dt/ks;  // خطوات أصغر عند قيم المدرب الحادة فقط (للثبات)
   for(let i=0;i<ks;i++){const T=on?K.tot(n):0,TL=L*n*Math.abs(n)+TP.v.fr*n+(on?0:0.2*n);
    if(n!==0){const nn=n+(T-TL)/TP.v.J*h;n=(Math.sign(nn)!==Math.sign(n)||Math.abs(nn)<0.003)?0:clamp(nn,-0.999,0.999)}}
   restT=on&&n===0?restT+dt:0;if(on&&n>0.8)dirs.p=1;if(on&&n<-0.8)dirs.m=1;
   ang=(ang-n*300*dt)%360;$('#l1r').setAttribute('transform',`rotate(${fx(ang)} 100 100)`);
   const Sx=n===0?1:1-Math.abs(n);
   $('#l1n').textContent=fm(Math.abs(n)*1800,0)+' rpm'+(n>0.001?' ↺':n<-0.001?' ↻':'');$('#l1s').textContent=fm(Sx,3);$('#l1sb').textContent=fm(2-Sx,3);
   $('#l1st').innerHTML=!on?(n===0?'متوقف':'يتباطأ (بلا مصدر)'):n===0?'<span class="im-chip warn">موصل ولا يدور</span>':'<span class="im-chip run">يدور</span>';
   $('#l1L-v').textContent=fm(L,3)+' pu';
   // torque panel
   const P=F.P,cx=P.X(cur);$('#l1-cur').setAttribute('d',`M${fx(cx)} ${fx(P.Y(1.15))}V${fx(P.Y(-1.15))}`);
   [['f',K.fw(cur)],['b',K.bw(cur)],['t',K.tot(cur)]].forEach(([k,v])=>{const c=$('#l1-'+k);c.setAttribute('cx',fx(cx));c.setAttribute('cy',fx(P.Y(v)))});
   const op=$('#l1-op');if(on){op.setAttribute('cx',fx(P.X(n)));op.setAttribute('cy',fx(P.Y(K.tot(n))))}else{op.setAttribute('cx',-20)}
   $('#l1tf').textContent=neg(K.fw(cur),2);$('#l1tb').textContent=neg(K.bw(cur),2);$('#l1tt').textContent=neg(K.tot(cur),2);$('#l1c-v').textContent=neg(cur,2)+' pu';
   $('#l1msg').innerHTML=Math.abs(cur)<0.015?'<b>السرعة صفر:</b> المحصلة = 0 ← لا يوجد عزم لبدء الحركة.':cur>0?'المحصلة موجبة: إذا دار الدوار مع المجال الأمامي يستمر في هذا الاتجاه (عزم الخلفي يعمل كفرملة صغيرة).':'المحصلة سالبة: إذا دار الدوار عكساً يستمر عكساً، والمجال «الأمامي» هو الذي يفرمل الآن.';
   steps.check()});
 },
 examples:[
  {title:'مثال (2-1) — الحل كما في الكتاب',ref:'ص 77–78',q:'<p>«محرك حثي أحادي الوجه، 60Hz، 230V، ذو أربعة أقطاب يعمل عند الحمل الكامل بانزلاق مقداره 4% احسب ما يلي: أ) معامل الانزلاق للمجال الخلفي \\(S_b\\) ب) السرعة التزامنية \\(n_s\\) ج) سرعة المحرك عند الحمل الكامل n.»</p>',
   given:G21,solve:(g,B,isBook)=>slipSteps(g,B,isBook),
   note:'<b>ملاحظة على الكتاب:</b> بقيم الكتاب تعرض هذه الحاسبة الرقم المطبوع <span class="ltr">S<sub>b</sub> = 0.96</span> (خطأ: الصحيح 1.96). إذا غيّرت أي رقم تحسب الحاسبة \\(2 - S\\) صحيحاً. الجهد 230 V لا يدخل في الحل.'},
  {title:'مثال (2-1) — الحل المصحح',ref:'ص 77–78',q:'<p>نفس المثال بحساب صحيح للفرع (أ). (حساب مصحح — ليس من الكتاب.)</p>',given:G21,solve:(g,B)=>slipSteps(g,B,false),
   note:'الفرعان (ب) و(ج) يطابقان الكتاب: <span class="ltr">1800 rpm</span> و <span class="ltr">1728 rpm</span>. التصحيح في (أ) فقط: <span class="ltr">S<sub>b</sub> = 1.96</span>.'}
 ],
 quiz:[
  {q:'مم يتكون المحرك الحثي أحادي الوجه؟',o:['ملفات أحادية الوجه على الثابت وعضو دوار ذو قفص سنجابي','ملفات ثلاثية الأوجه على الدوار','مبدل وفرش','مغناطيس دائم على الثابت'],c:0,e:'ص 74: ملفات أحادية الوجه على العضو الثابت وعضو دوار ذو قفص سنجابي.'},
  {q:'من أهم سمات المحرك الحثي أحادي الوجه أنه:',o:['له عزم بدء كبير جداً','لا يمتلك عزماً لبدء الحركة، لكنه يستمر في الاتجاه الذي بدأ فيه','لا يدور إلا مع عقارب الساعة','يحتاج تياراً مستمراً'],c:1,e:'ص 74 و 77.'},
  {q:'المجال النابض لملف واحد يمكن تحليله إلى:',o:['مجالين ثابتين','مجالين دوارين متعاكسين، كثافة كل منهما العظمى ½ B<sub>1max</sub>','ثلاثة مجالات دوارة','مجال دوار واحد بضعف القيمة'],c:1,e:'المعادلة (2-3) ص 75.'},
  {q:'في الشكل (2-2) تكون المحصلة B صفراً عندما:',o:['ينطبق السهمان','يكون السهمان أفقيين متعاكسين','يكون السهمان رأسيين لأعلى','لا تكون صفراً أبداً'],c:1,e:'المرحلتان 1 و 5.'},
  {q:'لماذا لا يوجد عزم بدء عند سكون الدوار؟',o:['لأن التيار صفر','لأن عزم المجال الأمامي يساوي عزم الخلفي ويضاده فالمحصلة صفر','لأن المجالين يدوران في نفس الاتجاه','لأن القفص مقصور'],c:1,e:'ص 77.'},
  {q:'محرك يدور بانزلاق أمامي S = 0.05. انزلاقه بالنسبة للمجال الخلفي:',o:['0.05','0.95','1.95','2.05'],c:2,e:'S<sub>b</sub> = 2 − S = 1.95 (ص 77).'},
  {q:'محرك 60 Hz بأربعة أقطاب وانزلاق 4%. سرعته عند الحمل الكامل:',o:['1800 rpm','1728 rpm','1872 rpm','3600 rpm'],c:1,e:'n<sub>s</sub> = 120×60/4 = 1800، n = 0.96×1800 = 1728 rpm (مثال 2-1).'},
  {q:'كيف يصف الكتاب عزم المجال الخلفي أثناء الدوران؟',o:['عزم مساعد','عزم دوران فرملي يعيق حركة الدوران','عزم صفري','عزم يعكس الاتجاه فوراً'],c:1,e:'ص 77.'}
 ]
});

/* =====================================================================
   Lesson 2.2 — split-phase motor
   ===================================================================== */
B.lesson({
 id:'u2-l2',unit:2,order:2,pages:'78–81',
 title:'المحرك المشطور الوجه',
 summary:'ملفان على الثابت بينهما 90° في الفراغ: رئيسي ومساعد ذو مقاومة كبيرة. تيار المساعد يسبق تيار الرئيسي فينشأ مجال دوار يبدأ به المحرك، ثم يفصل مفتاح الطرد المركزي الملف المساعد عند 75% من سرعة التزامن.',
 theory:[
  {h:'طرق البدء ومنحنيات الخواص',ref:'ص 78',html:`<p>«المحركات الحثية أحادية الوجه تصنف طبقاً للطريقة المستخدمة لبدء حركتها، كما يطلق عليها أسماء تصف الطريقة التي استخدمت لبدء حركتها، في ما يلي نتناول وصفا لأنواع المحركات الحثية أحادية الوجه الشائعة الاستخدام.»</p>
   <table class="tt"><thead><tr><th>النوع (الاسم يصف طريقة البدء)</th><th>الصفحة</th><th>الدرس هنا</th></tr></thead><tbody>
   <tr><td>المحرك المشطور الوجه (Split-Phase)</td><td>78–81</td><td>2.2</td></tr><tr><td>المحرك ذو مكثف البدء (Capacitor-Start)</td><td>82–83</td><td>2.3</td></tr>
   <tr><td>المحرك ذو المكثف الدائم (Permanent-Capacitor)</td><td>84</td><td>2.4</td></tr><tr><td>المحرك ذو المكثفين (Two-Values Capacitor)</td><td>85–86</td><td>2.4</td></tr><tr><td>المحرك ذو الوجه المظلل (Shaded-Pole)</td><td>87–88</td><td>2.5</td></tr></tbody></table>`},
  {h:'المحرك المشطور الوجه (Split-Phase Motor)',ref:'ص 78',html:`<p>«المحرك المشطور الوجه يحتوي على ملفين في العضو الثابت، الأول هو <b>الملف الرئيسي</b>، والثاني هو <b>الملف المساعد (أو ملف بدء الحركة)</b>، كل من هذين الملفين موزع في مجاري العضو الثابت، بحيث تكون الزاوية بين محوري الملفين <b>تسعون درجة كهربائية في الفراغ</b>، وبطريقة تجعلنا نحصل على مجال مغناطيسي موزع توزيعاً جيبياً في الفراغ، لكل من الملفين على حدة، الشكل (2-4) يبين دائرة توصيل هذين الملفين و كذلك منحنى العزم مع السرعة لهذا المحرك.»</p>
   <p>«تستعمل أسلاك ذات مساحة مقطع صغيرة للملفات المساعدة، فتكون نسبة مقاومتها إلى ممانعتها الحثية كبيرة (\\(Z_a = R_a + jX_a\\))، في حين تكون نسبة المقاومة إلى الممانعة الحثية للملفات الرئيسة أقل من ذلك (\\(Z_m = R_m + jX_m\\))، وحيث أن الملفين موصلان على التوازي مع نفس مصدر الجهد، فإن تيار الملف المساعد \\(I_a\\) يكون متأخراً بزاوية صغيرة عن جهد المصدر، بينما يكون تيار الملف الرئيسي \\(I_m\\) متأخراً بزاوية أكبر من ذلك بصورة محسوسة، كما هو موضح بمخطط المتجهات عند بدء الحركة في الشكل (2-5). وبما أن تيار الملفات المساعدة متقدم عن تيار الملفات الرئيسة، فإن المجال الكلي للعضو الثابت يصل إلى قيمته العظمى على محور الملفات المساعدة أولاً، ثم بعد ذلك يصل إلى قيمته العظمى على محور الملفات الرئيسة.»</p>`},
  {err:'في نص ص 78 بعد \\((Z_m = R_m + jX_m)\\) يوجد قوسان فارغان زائدان «()» (خطأ مطبعي).'},
  {html:`<p>«إذا تيار الملفين يمثل <b>نظاماً ثنائي الوجه غير متزن</b>، والمحرك يكافئ محركاً ذو وجهين غير متزن، فينشأ مجال مغناطيسي دوار، ينتج عنه عزم دوران يمكن العضو الدوار من الدوران.»</p>
   <p>«بعد أن يبدأ المحرك حركته بالملفين معاً تفصل الملفات المساعدة، باستخدام <b>مفتاح يعمل بقوة الطرد المركزي</b> عندما تصل سرعة المحرك إلى حوالي <b>خمسة وسبعين في المائة (75%) من سرعة التزامن</b>، ويستمر المحرك بعد ذلك في الدوران بالملف الرئيسي فقط.»</p>`},
  {fig:'(2-4)',ref:'ص 79',caption:'كيفية التوصيل وخواص المحرك المشطور الوجه: الدائرة (المفتاح مرسوم مفتوحاً) ومنحنى العزم مع السرعة (القيم مقروءة من الشكل تقريباً).',draw:()=>`<div class="svgbox im-svg">${circSVG('split',{sw:false})}</div><div class="svgbox im-svg">${tsPlot('split').svg}</div>${legend([['--blue','المنحنى الفعلي للمحرك'],['--fg','Main Winding Only (الرئيسي فقط)',1]])}`},
  {note:`<b>توضيح للمتدرب (ليس من نص الكتاب) — قراءة المنحنى:</b> عند السرعة صفر يعطي الملفان معاً عزم بدء (حوالي <span class="ltr">1.25 pu</span> في الشكل). يرتفع العزم مع السرعة حتى خط «Switching Speed» عند 75% تقريباً، فيفتح المفتاح ويهبط العزم فجأة إلى منحنى «الرئيسي فقط». لاحظ أن منحنى الرئيسي فقط يبدأ من <b>الصفر</b> عند السكون — وهذا ما درسناه في الدرس السابق: الملف الواحد لا يعطي عزم بدء.`},
  {fig:'(2-5)',ref:'ص 79',caption:'مخطط المتجهات عند بدء الحركة للمحرك المشطور الوجه (مرسوم بقيم مثال 2-2): \\(I_a\\) متأخر قليلاً عن V، و\\(I_m\\) متأخر كثيراً، والزاوية بينهما أقل كثيراً من 90°.',draw:()=>`<div class="svgbox" style="max-width:400px;margin-inline:auto">${phasorSVG(cdiv(Cx(110),Cx(1.2,25)),cdiv(Cx(110),Cx(12,5)),{dy:-90})}</div>`},
  {h:'تقليل ممانعة الملف المساعد',ref:'ص 80',html:`<p>«يمكن التقليل من الممانعة الحثية للملفات المساعدة، بوضعها في الجزء العلوي من مجاري العضو الثابت و لا يشكل استخدام أسلاك ذات مساحة مقطع صغير للملفات المساعدة أي خطر عليها، حيث إنها لا تستعمل إلا أثناء فترة بدء الحركة فقط.»</p>`},
  {h:'الخصائص والتطبيقات',ref:'ص 80',html:`<p>«من خصائص المحركات ذات الوجه المشطور، أن لها <b>عزم بدء حركة متوسط القيمة</b> و<b>تيار منخفض أثناء بدء الحركة</b>، وتستخدم في <b>المراوح و الشفاطات ومضخات الطرد المركزي وفي الأجهزة المنزلية والمكتبية</b>.»</p>`},
  {note:`<b>توضيح للمتدرب (ليس من نص الكتاب):</b> كلما اقتربت الزاوية بين التيارين من 90° صار المجال الدوار أقرب إلى المتزن وزاد عزم البدء. في المحرك المشطور نصنع الفرق بين التيارين بالمقاومة فقط (سلك رفيع للمساعد)، فلا تصل الزاوية إلى 90° (في مثال 2-2 هي <span class="ltr">64.63°</span>)؛ لذلك عزم البدء «متوسط». المكثف في الدرس التالي يوصلها إلى 90°.`},
  {h:'مثال (2-2)',ref:'ص 80–81',html:`<p>«محرك حثي أحادي الوجه، 110V، 50Hz من النوع المشطور الوجه، له الثوابت الآتية عند بدء الحركة: معاوقة الملف الرئيسي \\(Z_m = 1.2 + j25\\ \\Omega\\)، معاوقة الملف المساعد \\(Z_a = 12 + j5\\ \\Omega\\). احسب عند بدء الحركة: 1- التيار المار في الملف الرئيسي 2- التيار المار في الملف المساعد 3- التيار الكلي للمحرك 4- معامل القدرة 5- الزاوية بين تياري الملف الرئيسي والملف المساعد.»</p>
   <p>نتائج الكتاب المطبوعة: \\(I_m = 4\\angle -87.252^\\circ\\) A ؛ \\(I_a = 8.46\\angle -22.62^\\circ\\) A ؛ \\(I_t = 8.02 - j7.25 = 10.8\\angle -42.11^\\circ\\) A ؛ معامل القدرة 0.742 ؛ الزاوية \\(-64.63^\\circ\\). الحل خطوة بخطوة (كما في الكتاب والمصحح) في «الأمثلة المحلولة».</p>`},
  {err:`أخطاء في حل مثال (2-2) ص 80–81:<ol style="margin:6px 0 0;padding-inline-start:20px"><li>\\(110 \\div 25.03 = 4.39\\) A وليس <b>4 A</b>، والكتاب أكمل الحل بالقيمة 4 (\\(0.192 - j3.995\\) متسق مع 4). بالقيمة الصحيحة: \\(I_m = 4.39\\angle -87.25^\\circ = 0.211 - j4.385\\)، و \\(I_t = 8.02 - j7.64 = 11.08\\angle -43.61^\\circ\\) A، ومعامل القدرة <b>0.724</b> بدل 0.742.</li>
   <li>حتى بالقيمة 4 A: \\(0.192 + 7.81 = 8.00\\) وليس 8.02، فيكون \\(I_t = 10.80\\angle -42.18^\\circ\\) A و \\(\\cos = 0.741\\).</li>
   <li>الزاوية بين التيارين طُبعت \\(-64.63^\\circ\\) ثم «by 64.62°» في السطر التالي (فرق تقريب؛ الصحيح 64.63°). ولا يذكر الكتاب صراحة أن معامل القدرة متأخر.</li></ol>في «الأمثلة المحلولة» حاسبتان: كما في الكتاب، والمصحح. والزاوية بين التيارين (64.63°) لا تتأثر بالخطأ.`}
 ],
 lab:(el)=>{
  const m=mkMotor('split');m.L=0.3;let Rm=1.2,Xm=25,Ra=12,Xa=5,sig='',opened=0,failStall=0,usedEx=0;
  const T=tsPlot('split',{op:'l2'});
  el.innerHTML=`<div id="l2tp"></div><div class="grid">
   <div class="panel c7"><h2>دائرة المحرك المشطور الوجه <small>مبنية على الشكل (2-4) ص 79</small></h2><div class="svgbox im-svg" id="l2c"></div>
    <div class="im-row">${swHTML('l2on','110 V','توصيل المصدر',0)}${swHTML('l2f','عطل','الملف المساعد مقطوع',0)}<div><div class="sub">نوع الحمل</div>${segHTML('ld',[['const','عزم ثابت'],['fan','مروحة']],'const')}</div></div>
    ${sl('l2L','عزم الحمل',0,2.5,0.05,m.L)}
    <div class="facts">${fact('السرعة (من سرعة التزامن)','l2n')}${fact('مفتاح الطرد المركزي','l2sw')}${fact('عزم المحرك','l2T')}${fact('الحالة','l2st')}</div></div>
   <div class="panel c5"><h2>العزم مع السرعة <small>الشكل (2-4)</small></h2><div class="svgbox">${T.svg}</div>${legend([['--blue','الملفان معاً ثم الرئيسي فقط'],['--stop','عزم الحمل',1],['--live','نقطة التشغيل']])}<p class="sub">المنحنيات مقروءة من شكل الكتاب (تقريبية)، والسرعة والعزم بالـ pu. سرعة الوصول وزمن التسارع <span id="l2tpw">أرقام توضيحية</span>.</p></div>
   <div class="panel c7"><h2>مخطط المتجهات عند البدء <small>مبني على الشكل (2-5) ص 79 — الجهد 110 V</small></h2><div class="svgbox" style="max-width:420px;margin-inline:auto" id="l2p"></div>
    <div class="im-sls">${sl('l2Rm','R<sub>m</sub> (Ω)',0.5,10,0.1,Rm)}${sl('l2Xm','X<sub>m</sub> (Ω)',5,40,0.5,Xm)}${sl('l2Ra','R<sub>a</sub> (Ω)',1,30,0.5,Ra)}${sl('l2Xa','X<sub>a</sub> (Ω)',0.5,25,0.5,Xa)}</div>
    <div class="im-row"><button class="btn" id="l2ex">قيم مثال (2-2)</button></div></div>
   <div class="panel c5"><h2>القيم المحسوبة <small>حساب دقيق بلا تقريب</small></h2><div class="facts">${fact('I<sub>m</sub>','l2Im')}${fact('I<sub>a</sub>','l2Ia')}${fact('I<sub>t</sub>','l2It')}${fact('معامل القدرة','l2pf')}${fact('الزاوية بين التيارين','l2al')}</div><div class="callout" id="l2msg"></div></div>
   <div class="panel c12">${tryList(['شغّل المحرك وراقب نقطة التشغيل: عند 75% من سرعة التزامن ينفتح المفتاح ويهبط العزم إلى منحنى «الرئيسي فقط».','فعّل عطل «الملف المساعد مقطوع» ثم شغّل: المحرك لا يبدأ (عزم الرئيسي وحده صفر عند السكون).','اجعل عزم الحمل الثابت أكبر من عزم البدء (أكثر من 1.25 pu): لا يبدأ المحرك. هذا سبب وصف عزم بدئه بالمتوسط.','في مخطط المتجهات كبّر R<sub>a</sub> أو صغّر X<sub>a</sub>: يقترب I<sub>a</sub> من V وتكبر الزاوية بين التيارين.'])}<h3 class="sm">التجربة الموجّهة</h3><ol class="steps" id="l2steps"></ol></div></div>`;
  B.math(el);const $=s=>el.querySelector(s);
  const TP=B.params($('#l2tp'),'u2-l2',motorDefs(2.2),()=>{$('#l2tpw').textContent=TP.trainer?'من قيم المدرب':'أرقام توضيحية'});
  $('#l2on').onclick=()=>{m.on=m.on?0:1;$('#l2on').setAttribute('aria-pressed',m.on?'true':'false')};
  $('#l2f').onclick=()=>{m.fail=m.fail?0:1;$('#l2f').setAttribute('aria-pressed',m.fail?'true':'false')};
  el.querySelectorAll('[data-ld]').forEach(b=>b.onclick=()=>{m.kind=b.dataset.ld;segSet(el,'ld',m.kind)});
  $('#l2L').oninput=e=>{m.L=+e.target.value};
  const bind=(id,fn)=>$(id).oninput=e=>{fn(+e.target.value);drawP()};
  bind('#l2Rm',v=>Rm=v);bind('#l2Xm',v=>Xm=v);bind('#l2Ra',v=>Ra=v);bind('#l2Xa',v=>Xa=v);
  $('#l2ex').onclick=()=>{Rm=1.2;Xm=25;Ra=12;Xa=5;[['#l2Rm',Rm],['#l2Xm',Xm],['#l2Ra',Ra],['#l2Xa',Xa]].forEach(([i,v])=>$(i).value=v);usedEx=1;drawP()};
  let al=0;
  function drawP(){const Im=cdiv(Cx(110),Cx(Rm,Xm)),Ia=cdiv(Cx(110),Cx(Ra,Xa)),It=cadd(Im,Ia);al=cang(Ia)-cang(Im);
   $('#l2p').innerHTML=phasorSVG(Im,Ia,{alpha:al,ok:al>=89.5,dy:-60});
   $('#l2Im').textContent=`${fm(cabs(Im),2)}∠${neg(cang(Im),2)}° A`;$('#l2Ia').textContent=`${fm(cabs(Ia),2)}∠${neg(cang(Ia),2)}° A`;$('#l2It').textContent=`${fm(cabs(It),2)}∠${neg(cang(It),2)}° A`;
   $('#l2pf').textContent=fm(Math.cos(cang(It)*D),3);$('#l2al').textContent=fm(al,2)+'°';
   [['#l2Rm',Rm],['#l2Xm',Xm],['#l2Ra',Ra],['#l2Xa',Xa]].forEach(([i,v])=>$(i+'-v').textContent=fm(v,1));
   $('#l2msg').innerHTML=`نسبة R/X للمساعد = ${lt(fm(Ra/Xa,2))} وللرئيسي = ${lt(fm(Rm/Xm,3))}. `+(al<0?'التيار المساعد صار متأخراً عن الرئيسي: سيدور المحرك عكس الاتجاه!':al<89.5?`الزاوية ${lt(fm(al,1)+'°')} أقل من 90°: مجال دوار غير متزن، وعزم بدء متوسط.`:'الزاوية 90° أو أكثر قليلاً — لا تتحقق عملياً بالمقاومة وحدها مع هذه المعاوقات المعقولة.')}
  drawP();
  const steps=stepsUI($('#l2steps'),[
   {t:'شغّل المحرك',x:'شغّل مفتاح المصدر (الحمل صغير). الملفان معاً يعطيان عزم بدء فيتسارع المحرك.',done:()=>m.on&&m.n>0.2},
   {t:'انفتاح مفتاح الطرد المركزي',x:'راقب نقطة التشغيل: عند 75% من سرعة التزامن ينفتح المفتاح في الدائرة، ويهبط العزم إلى منحنى «الرئيسي فقط»، ويكمل المحرك بالملف الرئيسي.',done:()=>opened},
   {t:'أوقف المحرك',x:'افصل المصدر وانتظر حتى يقف. لاحظ أن المفتاح يعود فيغلق عندما تقل السرعة.',done:()=>!m.on&&m.n<0.02},
   {t:'عطل الملف المساعد',x:'فعّل «الملف المساعد مقطوع» ثم صِل المصدر: المحرك لا يدور، لأن الملف الرئيسي وحده لا يعطي عزم بدء.',done:()=>failStall>1.5},
   {t:'حمل أكبر من عزم البدء',x:'ألغِ العطل، واختر «عزم ثابت» واجعل عزم الحمل أكبر من <span class="ltr">1.3 pu</span> وشغّل من السكون: لا يبدأ.',done:()=>!m.fail&&m.kind==='const'&&m.L>1.25&&m.on&&m.stall>1.5},
   {t:'قيم مثال (2-2)',x:'اضغط «قيم مثال (2-2)»: الزاوية بين التيارين <span class="ltr">64.63°</span> مطابقة للكتاب، و \\(I_m = 4.39\\) A (الكتاب طبع 4 A).',done:()=>usedEx},
   {t:'كبّر الزاوية',x:'كبّر \\(R_a\\) (سلك أرفع) حتى تتجاوز الزاوية 70°: كلما ابتعد التياران عن بعضهما تحسّن المجال الدوار.',done:()=>al>70}
  ]);
  loopOn(el,dt=>{m.fr=TP.v.fr;motorStep(m,dt,TP.v.J);if(m.on&&!m.sw)opened=1;failStall=m.fail&&m.on&&m.n===0?failStall+dt:0;
   const s=[m.on,m.sw,m.fail,m.n>0.01].join();if(s!==sig){sig=s;$('#l2c').innerHTML=circSVG('split',{on:m.on,sw:m.sw,fail:m.fail,n:m.n})}
   const P=T.P;$('#l2-pt').setAttribute('cx',m.on?fx(P.X(m.n)):-20);$('#l2-pt').setAttribute('cy',fx(P.Y(m.T)));$('#l2-ld').setAttribute('d',pathOf(P,loadPts(m)));
   $('#l2n').textContent=fm(m.n*100,1)+' %';$('#l2sw').textContent=m.sw?'مغلق':'مفتوح';$('#l2T').textContent=fm(m.T,2)+' pu';$('#l2L-v').textContent=fm(m.L,2)+' pu';
   $('#l2st').innerHTML=!m.on?(m.n>0.01?'يتباطأ':'متوقف'):m.n===0?'<span class="im-chip trip">لا يبدأ (طنين)</span>':m.sw?'<span class="im-chip warn">بدء: الملفان معاً</span>':'<span class="im-chip run">تشغيل: الرئيسي فقط</span>';
   steps.check()});
 },
 examples:[
  {title:'مثال (2-2) — الحل كما في الكتاب',ref:'ص 80–81',q:'<p>«محرك حثي أحادي الوجه، 110V، 50Hz من النوع المشطور الوجه، له الثوابت الآتية عند بدء الحركة: \\(Z_m = 1.2 + j25\\ \\Omega\\) ، \\(Z_a = 12 + j5\\ \\Omega\\). احسب عند بدء الحركة: 1- التيار المار في الملف الرئيسي 2- التيار المار في الملف المساعد 3- التيار الكلي للمحرك 4- معامل القدرة 5- الزاوية بين تياري الملف الرئيسي والملف المساعد.»</p>',
   given:G22,solve:(g,B,isBook)=>splitSteps(g,B,isBook?BK22:null),
   note:'<b>ملاحظة على الكتاب:</b> بقيم الكتاب تعرض الحاسبة أرقامه المطبوعة كما هي، ومنها <span class="ltr">I<sub>m</sub> = 4 A</span> (الصحيح 4.39 A) و <span class="ltr">8.02</span> (من 0.192 + 7.81 = 8.00). إذا غيّرت أي رقم تحسب الحاسبة بنفس خطوات الكتاب وتقريبه دون هذه الأخطاء. قارن بالحل المصحح أدناه.'},
  {title:'مثال (2-2) — الحل المصحح',ref:'ص 80–81',q:'<p>نفس المثال بالقسمة الصحيحة \\(110 \\div 25.03 = 4.39\\) A. (حساب مصحح — ليس من الكتاب.)</p>',given:G22,solve:(g,B)=>splitSteps(g,B,null),
   note:'بالحساب المصحح: \\(I_t = 11.1\\angle -43.61^\\circ\\) A (أي 11.08 A بخانتين) ومعامل القدرة <b>0.724</b> بدل 0.742. تيار الملف المساعد والزاوية بين التيارين (64.63°) مطابقان للكتاب.'}
 ],
 quiz:[
  {q:'كم الزاوية بين محوري الملف الرئيسي والملف المساعد في الفراغ؟',o:['30° كهربائية','90° كهربائية','120° كهربائية','180° كهربائية'],c:1,e:'ص 78.'},
  {q:'لماذا تُلف الملفات المساعدة بأسلاك ذات مساحة مقطع صغيرة؟',o:['لتقليل الوزن فقط','لتكون نسبة مقاومتها إلى ممانعتها الحثية كبيرة فيتقدم تيارها عن تيار الرئيسي','لزيادة الممانعة الحثية','لأنها تعمل باستمرار'],c:1,e:'ص 78.'},
  {q:'عند البدء في المحرك المشطور:',o:['I<sub>m</sub> يتقدم عن V','I<sub>a</sub> متأخر بزاوية صغيرة و I<sub>m</sub> متأخر بزاوية أكبر','التياران في نفس الطور','I<sub>a</sub> متأخر 90° عن I<sub>m</sub>'],c:1,e:'الشكل (2-5).'},
  {q:'متى يفصل مفتاح الطرد المركزي الملف المساعد؟',o:['عند 25% من سرعة التزامن','عند حوالي 75% من سرعة التزامن','عند سرعة التزامن تماماً','لا يفصله أبداً'],c:1,e:'ص 78.'},
  {q:'لماذا لا يشكل السلك الرفيع للملف المساعد خطراً عليه؟',o:['لأنه مبرد بالزيت','لأنه لا يُستعمل إلا أثناء فترة البدء فقط','لأن تياره صفر','لأنه من الألومنيوم'],c:1,e:'ص 80.'},
  {q:'من خصائص المحرك المشطور الوجه:',o:['عزم بدء كبير جداً وتيار بدء عالٍ','عزم بدء متوسط وتيار بدء منخفض','لا عزم بدء','يعمل بلا ملف مساعد'],c:1,e:'ص 80.'},
  {q:'أين يستخدم المحرك المشطور الوجه؟',o:['الضواغط الكبيرة','المراوح والشفاطات ومضخات الطرد المركزي والأجهزة المنزلية والمكتبية','القاطرات','المولدات'],c:1,e:'ص 80.'},
  {q:'في مثال (2-2) الزاوية بين تياري الملفين حوالي:',o:['22.62°','42.11°','64.63°','90°'],c:2,e:'θ = −87.25 − (−22.62) = −64.63°، أي أن I<sub>m</sub> متأخر عن I<sub>a</sub> بـ 64.63°.'}
 ]
});

/* =====================================================================
   Lesson 2.3 — capacitor motors / capacitor-start motor (+ example 2-3)
   ===================================================================== */
const M23={V:127,f:60,Rm:4.2,Xm:3.8,Ra:8.8,Xa:3.3};
function capCurrents(Cuf,mm){mm=mm||M23;const w=2*PI*mm.f,Xc=1e6/(w*Cuf);const Im=cdiv(Cx(mm.V),Cx(mm.Rm,mm.Xm)),Ia=cdiv(Cx(mm.V),Cx(mm.Ra,mm.Xa-Xc));return {Im,Ia,Xc,al:cang(Ia)-cang(Im)}}
B.lesson({
 id:'u2-l3',unit:2,order:3,pages:'82–83، 86',
 title:'المحركات ذات المكثفات: المحرك ذو مكثف البدء',
 summary:'مكثف على التوالي مع الملف المساعد يجعل تياره يتقدم عن تيار الرئيسي بزاوية تصل إلى 90°، فنحصل عند البدء على خصائص محرك متزن ذو وجهين وعزم بدء كبير. ونحسب قيمة المكثف اللازمة (مثال 2-3).',
 theory:[
  {h:'المحركات ذات المكثفات (Capacitor Motors)',ref:'ص 82',html:`<p>«يمكن أن تستخدم المكثفات لتحسين خواص وأداء المحرك الحثي أحادي الوجه، أثناء بدء الحركة أو أثناء التشغيل أو كليهما، اعتماداً على حجم ونوع المكثف المستخدم وطريقة توصيله.»</p>`},
  {fig:'',ref:'ص 82',caption:'في الكتاب صورتان بلا رقم شكل: «محرك ذو مكثف» (صندوق مكثف واحد فوق الهيكل) و«محرك ذو مكثفين» (مكثفان أسطوانيان). هنا رسم مبسط لهما.',draw:()=>{const mot=(x,two)=>`<rect x="${x}" y="70" width="150" height="80" rx="16" fill="var(--surface-2)" stroke="var(--fg)" stroke-width="1.6"/><rect x="${x+150}" y="102" width="40" height="14" rx="4" fill="var(--wire)"/><rect x="${x-14}" y="82" width="14" height="56" rx="4" fill="var(--surface-2)" stroke="var(--fg)"/>${[0,1,2,3,4,5].map(i=>`<path d="M${x+18+i*22} 74V146" stroke="var(--line)"/>`).join('')}`+
    (two?`<rect x="${x+20}" y="34" width="50" height="36" rx="16" fill="var(--fg)"/><rect x="${x+80}" y="34" width="50" height="36" rx="16" fill="var(--fg)"/>`:`<rect x="${x+40}" y="38" width="70" height="32" rx="6" fill="var(--fg)"/>`);
    return `<div class="svgbox im-svg"><svg viewBox="0 0 520 190" role="img" aria-label="محرك ذو مكثف ومحرك ذو مكثفين">${mot(300,0)}${mot(40,1)}${arT(375,180,'محرك ذو مكثف',{fs:13})}${arT(115,180,'محرك ذو مكثفين',{fs:13})}</svg></div>`}},
  {h:'المحرك ذو مكثف البدء (Capacitor-Start Motor)',ref:'ص 82',html:`<p>«يحتوي المحرك ذو مكثف بدء الحركة على ملفات رئيسة وملفات مساعدة على العضو الثابت، الزاوية بين تياري الملفين، نحصل عليها بواسطة <b>مكثف موصل على التوالي مع الملفات المساعدة</b>، كما هو مبين في الشكل (2-6)، يتم فصل الملف المساعد بعد بدء الحركة مثل النوع السابق، وبالتالي يمكن تصميم الملفات المساعدة والمكثف، بحيث يكون تشغيلهما تشغيلاً متقطعاً، مما يساعد على تقليل كلفة كل منهما ومن الممكن استخدام مكثف بدء الحركة ذو القيمة المناسبة، التي تجعل تيار الملفات المساعدة \\(I_a\\)، يتقدم عن تيار الملفات الرئيسة \\(I_m\\) (عند سكون العضو الدوار) بزاوية مقدارها <b>تسعون درجة كهربائية</b> كما يبين ذلك الشكل (2-7)، وبذلك نحصل على <b>خصائص محرك متزن ذو وجهين عند بدء الحركة</b>.»</p>`},
  {fig:'(2-6)',ref:'ص 83',caption:'كيفية توصيل وخواص المحرك ذو مكثف البدء: مفتاح الطرد المركزي + المكثف C + \\(Z_a\\) على التوالي، ومنحنى العزم مع السرعة (القيم مقروءة من الشكل تقريباً).',draw:()=>`<div class="svgbox im-svg">${circSVG('cstart',{sw:true})}</div><div class="svgbox im-svg">${tsPlot('cstart').svg}</div>${legend([['--blue','المنحنى الفعلي للمحرك'],['--fg','Main Winding Only',1]])}`},
  {fig:'(2-7)',ref:'ص 83',caption:'مخطط المتجهات للمحرك ذو مكثف البدء (مرسوم بقيم مثال 2-3 والمكثف 204 µF): \\(I_a\\) متقدم عن V، و\\(I_m\\) متأخر عنه، والزاوية بينهما 90°، و\\(I_t\\) متأخر قليلاً عن V.',draw:()=>{const r=capCurrents(204);return `<div class="svgbox" style="max-width:400px;margin-inline:auto">${phasorSVG(r.Im,r.Ia)}</div>`}},
  {html:`<p>«كما يبين الشكل (2-6) أيضا منحنى الخواص للمحرك ذو مكثف البدء، ومن أهم خصائصه <b>العزم الكبير المتولد عند بدء الحركة</b>، حيث يبدأ المحرك الدوران والملفين موصلين مما يعطي عزم دوران كبير ثم تفصل الملفات المساعدة ويستمر المحرك في الدوران بالملف الرئيسي فقط أثناء التشغيل.»</p>
   <p><b>التطبيقات:</b> «يستخدم هذا النوع من المحركات في <b>الضواغط والمضخات والثلاجات، وأجهزة التبريد والتكييف</b> وفي الأحمال التي تتطلب عزماً كبيراً لبدء حركتها.»</p>`},
  {note:`<b>توضيح للمتدرب (ليس من نص الكتاب):</b> قارن الشكلين (2-4) و(2-6): عزم البدء في المشطور حوالي <span class="ltr">1.25 pu</span> وفي ذي مكثف البدء حوالي <span class="ltr">3.3 pu</span>. السبب أن المكثف يجعل تيار المساعد <b>يتقدم</b> عن الجهد بدلاً من أن يتأخر قليلاً، فتتسع الزاوية بين التيارين حتى 90°. ولأن المكثف والملف المساعد يعملان ثوانٍ قليلة فقط عند البدء، يمكن أن يكونا رخيصين («تشغيل متقطع»).`},
  {h:'مثال (2-3)',ref:'ص 86',html:`<p>«محرك حثي أحادي الوجه، ذو مكثف البدء، جهده 127V وتردده 60Hz، ثوابت الملفات الرئيسة والمساعدة عند البدء كما يلي: \\(Z_m = 4.2 + j3.8\\ \\Omega\\) ، \\(Z_a = 8.8 + j3.3\\ \\Omega\\). عين قيمة مكثف البدء اللازمة للحصول على زاوية مقدارها تسعون درجة كهربائية بين تياري الملفات الرئيسة والمساعدة عند بدء الحركة.»</p>
   <p><b>الحل:</b></p>
   $$\\theta_m = \\tan^{-1}\\left(\\frac{3.8}{4.2}\\right) = 42.14^\\circ \\qquad \\theta_a = 90 - \\theta_m = 47.86^\\circ$$
   $$\\tan^{-1}\\left(\\frac{X_c - 3.3}{8.8}\\right) = 47.86 \\;\\Rightarrow\\; \\frac{X_c-3.3}{8.8} = \\tan(47.86) = 1.1 \\;\\Rightarrow\\; X_c = 1.1\\times(8.8) + 3.3 = 12.98\\ \\Omega$$
   $$X_c = \\frac{1}{\\omega c} = \\frac{1}{2\\pi f c} \\;\\Rightarrow\\; c = \\frac{1}{\\omega X_c} = \\frac{1}{377\\times 12.98} = 204\\ \\mu F$$
   <p>الحاسبة في «الأمثلة المحلولة» تحل هذا المثال وأي زاوية أخرى (مثل س8 بالزاوية 80°).</p>`},
  {note:`<b>توضيح للمتدرب (ليس من نص الكتاب) — لماذا \\(\\theta_a = 90 - \\theta_m\\)؟</b> \\(I_m\\) متأخر عن الجهد بالزاوية \\(\\theta_m = 42.14^\\circ\\). نريد \\(I_a\\) متقدماً عن الجهد بزاوية \\(\\theta_a\\) بحيث يكون المجموع 90°. المكثف يطرح ممانعته من ممانعة الملف المساعد، فتصبح معاوقة الفرع \\(8.8 + j(3.3 - X_c)\\)، وزاويتها \\(-\\tan^{-1}\\frac{X_c - 3.3}{8.8}\\) (سالبة = سعوية)، فيتقدم \\(I_a\\) بهذه الزاوية. و\\(\\omega = 2\\pi\\times 60 = 377\\) rad/s.`},
  {err:'في حل مثال (2-3) ص 86 قُرّب \\(\\tan(47.86^\\circ) = 1.105\\) إلى 1.1. بلا تقريب: \\(X_c = 13.03\\ \\Omega\\) و \\(C = 203.6\\ \\mu F\\). الفرق تقريب فقط ولا يغيّر النتيجة العملية (حوالي 204 µF). الجهد 127V لا يُستخدم في الحل.'}
 ],
 lab:(el)=>{
  const m=mkMotor('cstart');m.L=1.5;let C=100,sig='',hit90=0,opened=0,big=0,ghost=0,lowC=0;
  el.innerHTML=`<div id="l3tp"></div><div class="grid">
   <div class="panel c7"><h2>دائرة المحرك ذي مكثف البدء <small>مبنية على الشكل (2-6) ص 83 وقيم مثال (2-3)</small></h2><div class="svgbox im-svg" id="l3c"></div>
    ${sl('l3C','سعة مكثف البدء C',20,600,1,C)}
    <div class="im-row"><button class="btn" id="l3opt">قيمة مثال (2-3): 204 µF</button>${swHTML('l3on','127 V','توصيل المصدر',0)}${swHTML('l3g','قارن','منحنى المشطور (2-4)',0)}</div>
    ${sl('l3L','عزم الحمل الثابت (ضاغط)',0,3.5,0.05,m.L)}
    <div class="facts">${fact('X<sub>c</sub>','l3xc')}${fact('السرعة','l3n')}${fact('مفتاح الطرد المركزي','l3sw')}${fact('الحالة','l3st')}</div></div>
   <div class="panel c5"><h2>مخطط المتجهات <small>الشكل (2-7) ص 83</small></h2><div class="svgbox" style="max-width:400px;margin-inline:auto" id="l3p"></div>
    <div class="facts">${fact('I<sub>a</sub>','l3Ia')}${fact('I<sub>m</sub>','l3Im')}${fact('الزاوية بين التيارين','l3al')}</div><div class="callout" id="l3msg"></div></div>
   <div class="panel c12"><h2>العزم مع السرعة <small>الشكل (2-6) — عزم البدء مضروب في sin(الزاوية) للتوضيح</small></h2><div class="svgbox" style="max-width:640px;margin-inline:auto" id="l3t"></div>${legend([['--blue','الملفان + المكثف ثم الرئيسي فقط'],['--stop','عزم الحمل',1],['--live','نقطة التشغيل'],['--muted','منحنى بدء المحرك المشطور (للمقارنة)',1]])}
    <p class="sub">المنحنى المطبوع في الكتاب يوافق الزاوية 90°. لتوضيح أثر المكثف نضرب منحنى البدء في \\(\\sin\\alpha\\) حيث \\(\\alpha\\) الزاوية بين التيارين (تبسيط توضيحي ليس من الكتاب: يهمل تغيّر مقدار \\(I_a\\) مع المكثف).</p></div>
   <div class="panel c12">${tryList(['حرّك منزلق المكثف حتى تصبح الزاوية بين التيارين 90° (حوالي 204 µF): هذه قيمة مثال (2-3).','لاحظ أن I<sub>a</sub> صار متقدماً عن V (فوق المحور) بينما I<sub>m</sub> متأخر (تحته).','شغّل المحرك مع حمل ثابت 1.5 pu: يبدأ بسهولة. ثم فعّل «قارن» لترى أن المحرك المشطور لا يستطيع بدء هذا الحمل.','صغّر المكثف كثيراً (أقل من 60 µF): تتغير الزاوية ويقل عزم البدء.'])}<h3 class="sm">التجربة الموجّهة</h3><ol class="steps" id="l3steps"></ol></div></div>`;
  B.math(el);const $=s=>el.querySelector(s);let T,r,lastK=-1;
  const TP=B.params($('#l3tp'),'u2-l3',motorDefs(2.2));
  const drawT=()=>{T=tsPlot('cstart',{op:'l3',k:m.k,ghost:ghost?{f:CUR.split.both,to:0.75,l:'split-phase start'}:null});$('#l3t').innerHTML=T.svg};
  function upd(){r=capCurrents(C);m.k=Math.max(0,Math.sin(r.al*D));
   $('#l3p').innerHTML=phasorSVG(r.Im,r.Ia,{alpha:r.al,ok:Math.abs(r.al-90)<1});$('#l3C-v').textContent=fm(C,0)+' µF';$('#l3xc').textContent=fm(r.Xc,2)+' Ω';
   $('#l3Ia').textContent=`${fm(cabs(r.Ia),2)}∠${neg(cang(r.Ia),2)}° A`;$('#l3Im').textContent=`${fm(cabs(r.Im),2)}∠${neg(cang(r.Im),2)}° A`;$('#l3al').textContent=fm(r.al,2)+'°';
   if(Math.abs(r.al-90)<1)hit90=1;if(C<60)lowC=1;
   $('#l3msg').innerHTML=Math.abs(r.al-90)<1?'<span class="im-chip run">الزاوية 90°</span> تيار المساعد يتقدم عن تيار الرئيسي بتسعين درجة: خصائص محرك متزن ذو وجهين عند البدء.':`الزاوية ${lt(fm(r.al,1)+'°')}. `+(r.al<90?'زد السعة (ممانعة المكثف أصغر) لتكبر الزاوية؟ جرّب في الاتجاهين.':'الزاوية تجاوزت 90°.')+` عزم البدء النسبي (توضيحي) = sin α = ${lt(fm(m.k,2))}`;
   if(Math.abs(m.k-lastK)>0.004){lastK=m.k;drawT()}}
  $('#l3C').oninput=e=>{C=+e.target.value;upd()};$('#l3opt').onclick=()=>{C=204;$('#l3C').value=C;upd()};
  $('#l3on').onclick=()=>{m.on=m.on?0:1;$('#l3on').setAttribute('aria-pressed',m.on?'true':'false')};
  $('#l3g').onclick=()=>{ghost=ghost?0:1;$('#l3g').setAttribute('aria-pressed',ghost?'true':'false');drawT()};
  $('#l3L').oninput=e=>{m.L=+e.target.value};upd();
  const steps=stepsUI($('#l3steps'),[
   {t:'اضبط المكثف حتى 90°',x:'حرّك منزلق السعة ببطء وراقب الزاوية بين التيارين حتى تصل إلى 90° (عند حوالي <span class="ltr">204 µF</span>، كما في مثال 2-3).',done:()=>hit90},
   {t:'اقرأ مخطط المتجهات',x:'لاحظ: \\(I_a\\) فوق محور V (متقدم) و\\(I_m\\) تحته (متأخر)، والتيار الكلي \\(I_t\\) متأخر قليلاً فقط — كما في الشكل (2-7).'},
   {t:'ابدأ حملاً كبيراً',x:'اجعل عزم الحمل الثابت <span class="ltr">1.5 pu</span> أو أكثر، ثم صِل المصدر: يبدأ المحرك لأن عزم بدئه حوالي <span class="ltr">3.3 pu</span>.',done:()=>m.on&&m.L>=1.45&&m.n>0.3&&big},
   {t:'انفتاح المفتاح',x:'عند 75% من سرعة التزامن يخرج المكثف والملف المساعد من الدائرة ويكمل المحرك بالملف الرئيسي.',done:()=>opened},
   {t:'قارن بالمشطور',x:'فعّل «قارن»: منحنى بدء المحرك المشطور (حوالي 1.25 pu) يقع تحت خط الحمل 1.5 pu، فلا يستطيع بدءه. لهذا يُستعمل ذو مكثف البدء في الضواغط والثلاجات.',done:()=>ghost},
   {t:'مكثف صغير جداً',x:'افصل المصدر، ثم صغّر السعة إلى أقل من <span class="ltr">60 µF</span>: تتغير الزاوية ويقل عزم البدء (منحنى البدء ينخفض).',done:()=>lowC}
  ]);
  loopOn(el,dt=>{const was=m.n;m.fr=TP.v.fr;motorStep(m,dt,TP.v.J);if(m.on&&!m.sw)opened=1;if(m.on&&was===0&&m.n>0&&m.L>=1.45)big=1;
   const s=[m.on,m.sw,m.n>0.01].join();if(s!==sig){sig=s;$('#l3c').innerHTML=circSVG('cstart',{on:m.on,sw:m.sw,n:m.n})}
   const P=T.P;$('#l3-pt').setAttribute('cx',m.on?fx(P.X(m.n)):-20);$('#l3-pt').setAttribute('cy',fx(P.Y(m.T)));$('#l3-ld').setAttribute('d',pathOf(P,loadPts(m)));
   $('#l3n').textContent=fm(m.n*100,1)+' %';$('#l3sw').textContent=m.sw?'مغلق':'مفتوح';$('#l3L-v').textContent=fm(m.L,2)+' pu';
   $('#l3st').innerHTML=!m.on?(m.n>0.01?'يتباطأ':'متوقف'):m.n===0?'<span class="im-chip trip">لا يبدأ</span>':m.sw?'<span class="im-chip warn">بدء: الملفان + المكثف</span>':'<span class="im-chip run">تشغيل: الرئيسي فقط</span>';
   steps.check()});
 },
 examples:[
  {title:'مثال (2-3)',ref:'ص 86',q:'<p>«محرك حثي أحادي الوجه، ذو مكثف البدء، جهده 127V وتردده 60Hz، ثوابت الملفات الرئيسة والمساعدة عند البدء كما يلي: \\(Z_m = 4.2 + j3.8\\ \\Omega\\) ، \\(Z_a = 8.8 + j3.3\\ \\Omega\\). عين قيمة مكثف البدء اللازمة للحصول على زاوية مقدارها تسعون درجة كهربائية بين تياري الملفات الرئيسة والمساعدة عند بدء الحركة.»</p>',
   given:G23,solve:(g,B)=>capSteps(g,B,{v127:1}),
   note:'<b>تقريب الكتاب:</b> الكتاب قرّب \\(\\tan 47.86^\\circ = 1.105\\) إلى 1.1 (رقمان معنويان)، والحاسبة تتبع نفس التقريب فتعطي <span class="ltr">12.98 Ω</span> و <span class="ltr">204 µF</span> كما طُبع. السطر الأخير يعطي النتيجة بلا تقريب للمقارنة. غيّر الزاوية إلى 80° وقيم المعاوقات لتحل س8 ص 89.'}
 ],
 quiz:[
  {q:'أين يوصل المكثف في المحرك ذي مكثف البدء؟',o:['على التوازي مع الملف الرئيسي','على التوالي مع الملفات المساعدة (ومع مفتاح الطرد المركزي)','على التوالي مع المصدر كله','على الدوار'],c:1,e:'الشكل (2-6) ص 83.'},
  {q:'ما الزاوية المناسبة بين تياري الملفين عند السكون في المحرك ذي مكثف البدء؟',o:['30°','45°','90°','180°'],c:2,e:'ص 82: تسعون درجة كهربائية، فنحصل على خصائص محرك متزن ذو وجهين عند البدء.'},
  {q:'في الشكل (2-7) تيار الملفات المساعدة:',o:['متأخر عن الجهد بزاوية كبيرة','متقدم عن الجهد','في طور الجهد تماماً','صفر'],c:1,e:'المكثف يجعل I<sub>a</sub> يتقدم.'},
  {q:'لماذا يمكن تقليل كلفة الملفات المساعدة والمكثف في هذا المحرك؟',o:['لأنهما يعملان تشغيلاً متقطعاً (عند البدء فقط)','لأنهما من الألومنيوم','لأن الجهد منخفض','لأنهما يعملان باستمرار'],c:0,e:'ص 82.'},
  {q:'أهم خصائص المحرك ذي مكثف البدء:',o:['هدوء الصوت','العزم الكبير عند بدء الحركة','عدم وجود مفتاح','سرعة متغيرة'],c:1,e:'ص 83.'},
  {q:'أين يستخدم المحرك ذو مكثف البدء؟',o:['المراوح الصغيرة فقط','الضواغط والمضخات والثلاجات وأجهزة التبريد والتكييف','الساعات','لعب الأطفال'],c:1,e:'ص 83.'},
  {q:'في مثال (2-3) قيمة X<sub>c</sub>:',o:['3.3 Ω','8.8 Ω','12.98 Ω','204 Ω'],c:2,e:'X<sub>c</sub> = 1.1 × 8.8 + 3.3 = 12.98 Ω.'},
  {q:'في مثال (2-3) كم قيمة θ<sub>a</sub> المطلوبة؟',o:['42.14°','47.86°','90°','22.62°'],c:1,e:'θ<sub>a</sub> = 90 − 42.14 = 47.86°.'}
 ]
});

/* =====================================================================
   Lesson 2.4 — permanent-capacitor and two-value capacitor motors (comparison lab)
   ===================================================================== */
const TYPES=[['split','المشطور (2-4)'],['cstart','مكثف البدء (2-6)'],['perm','المكثف الدائم (2-8)'],['two','المكثفين (2-9)']];
B.lesson({
 id:'u2-l4',unit:2,order:4,pages:'84–86',
 title:'المحرك ذو المكثف الدائم والمحرك ذو المكثفين',
 summary:'في المكثف الدائم يبقى الملف المساعد والمكثف عاملين دائماً بلا مفتاح: كفاءة ومعامل قدرة أفضل وتشغيل هادئ، لكن عزم بدء منخفض. والمحرك ذو المكثفين يجمع مكثف تشغيل دائم ومكثف بدء يخرج بمفتاح الطرد المركزي: أفضل خواص في البدء والتشغيل معاً.',
 theory:[
  {h:'المحرك ذو المكثف الدائم (Permanent-Capacitor Motor)',ref:'ص 84',html:`<p>«في المحرك ذو المكثف الدائم تظل الملفات المساعدة عاملة مع الملفات الرئيسة أثناء التشغيل المستمر للمحرك، فيمكن تبسيط تركيب المحرك، <b>بالاستغناء عن مفتاح الطرد المركزي</b>، المشار إليه في الحالتين السابقتين. الشكل (2-8) يبين كيفية توصيل الملفات كما يبين أيضاً منحنى خواص المحرك.»</p>
   <p>«تصمم الملفات المساعدة والمكثف على أساس التشغيل المستمر، بحيث يصبح المحرك مكافئ لمحرك مثالي ذو وجهين <b>عند حمل بعينه</b>، فيختفي وجود المجال الخلفي مما يؤدي إلى <b>تحسين الكفاءة</b>، كما تختفي أيضا الضجة التي كان يسببها المجال الخلفي، فتكون النتيجة <b>محرك هادئ الصوت</b> أثناء التشغيل، كما يؤدي استخدام المكثف الدائم إلى <b>تحسين معامل القدرة</b> أثناء التشغيل ويستخدم هذا النوع من المحركات في التطبيقات التي تتطلب هدوءاً في الصوت أثناء تشغيلها.»</p>`},
  {fig:'(2-8)',ref:'ص 84',caption:'كيفية توصيل وخواص المحرك ذو المكثف الدائم: المكثف C و\\(Z_a\\) على التوالي بلا مفتاح؛ منحنى واحد يبدأ بعزم منخفض (حوالي 0.7 pu) ولا يوجد خط فصل.',draw:()=>`<div class="svgbox im-svg">${circSVG('perm',{})}</div><div class="svgbox im-svg">${tsPlot('perm').svg}</div>`},
  {note:`<b>توضيح للمتدرب (ليس من نص الكتاب):</b> تذكّر الدرس الأول: الملف الواحد يصنع مجالاً أمامياً ومجالاً خلفياً متساويين، والخلفي «يفرمل» ويسبب ضجيجاً. عندما يعمل الملفان والمكثف معاً بتيارين بينهما 90° ومقداريهما مناسبين، يصبح المجال دواراً منتظماً في اتجاه واحد ويختفي الخلفي. لكن المكثف يُختار لحمل واحد معيّن، فلا يختفي الخلفي تماماً إلا عند هذا الحمل. وبما أن المكثف مختار للتشغيل لا للبدء، يكون عزم البدء منخفضاً.`},
  {h:'المحرك ذو المكثفين (Two-Values Capacitor Motor)',ref:'ص 85',html:`<p>«عند استخدام مكثفين أحدهما يستخدم أثناء فترة البدء فقط، والآخر يستمر عمله أثناء التشغيل المستمر للمحرك، يمكننا الحصول على <b>أفضل خواص للمحرك، أثناء فترتي البدء والتشغيل معاً</b>. الشكل (2-9) يبين طريقة توصيل هذين المكثفين، كما يبين أيضا منحنى الخواص للمحرك.»</p>
   <p>«يستخدم المكثف \\(C_1\\) من <b>النوع الورقي المشبع بالزيت</b> ويوصل على التوالي بصفة مستديمة، مع الملفات المساعدة لتحسين خواص التشغيل. كما يستخدم المكثف \\(C_2\\) من <b>النوع ذي السائل الكهربي</b> لتحسين عزم بدء الحركة، حيث يوصل مع مفتاح طرد مركزي خاص به، على التوازي مع المكثف الدائم، ليعملا معاً أثناء فترة البدء فقط، ويعتبر هذا النوع من المحركات <b>أكثر تكلفة</b> من الأنواع السابقة، ويستخدم في التطبيقات التي تتطلب <b>تشغيلاً هادئاً مع عزم كبير لبدء الحركة</b>.»</p>`},
  {fig:'(2-9)',ref:'ص 85',caption:'كيفية توصيل وخواص المحرك ذو المكثفين: \\(C_1\\) ثابت، وبالتوازي معه \\(C_2\\) على التوالي مع مفتاح الطرد المركزي. المنحنى «Starting And Permanent Capacitors» حتى سرعة الفصل ثم «Permanent Capacitor».',draw:()=>`<div class="svgbox im-svg">${circSVG('two',{sw:true})}</div><div class="svgbox im-svg">${tsPlot('two').svg}</div>${legend([['--blue','المنحنى الفعلي للمحرك'],['--fg','Permanent Capacitor (C1 فقط)',1]])}`},
  {err:'في الشكل (2-9) ص 85 كُتب على المحور الرأسي «Toque (pu)» والصحيح «Torque (pu)» (خطأ مطبعي، أبقيناه في الرسم كما طُبع). وعنوان الفقرة «Two-Values Capacitor Motor» والشائع «Two-Value Capacitor Motor».'},
  {note:`<b>توضيح للمتدرب (ليس من نص الكتاب):</b> عند البدء يكون \\(C_1\\) و\\(C_2\\) على التوازي، والمكثفات على التوازي تُجمع سعاتها: \\(C = C_1 + C_2\\) (سعة كبيرة لعزم بدء كبير). بعد الفصل يبقى \\(C_1\\) وحده (سعة أصغر مناسبة للتشغيل الهادئ).`},
  {h:'مقارنة الأنواع (ملخص من نص الكتاب)',ref:'ص 80–85',html:`<table class="tt"><thead><tr><th>النوع</th><th>مفتاح طرد مركزي</th><th>المكثف</th><th>عزم البدء</th><th>التشغيل</th><th>الاستخدامات</th></tr></thead><tbody>
   <tr><td>المشطور الوجه</td><td>نعم</td><td>لا يوجد</td><td>متوسط (وتيار بدء منخفض)</td><td>بالملف الرئيسي فقط</td><td>المراوح والشفاطات ومضخات الطرد المركزي والأجهزة المنزلية والمكتبية</td></tr>
   <tr><td>مكثف البدء</td><td>نعم</td><td>للبدء فقط</td><td>كبير</td><td>بالملف الرئيسي فقط</td><td>الضواغط والمضخات والثلاجات والتبريد والتكييف</td></tr>
   <tr><td>المكثف الدائم</td><td>لا</td><td>دائم</td><td>منخفض (من الشكل 2-8)</td><td>هادئ، كفاءة ومعامل قدرة أفضل</td><td>تطبيقات تتطلب هدوء الصوت</td></tr>
   <tr><td>المكثفين</td><td>نعم (لـ C<sub>2</sub>)</td><td>C<sub>1</sub> دائم + C<sub>2</sub> للبدء</td><td>كبير</td><td>هادئ</td><td>تشغيل هادئ مع عزم بدء كبير (الأغلى تكلفة)</td></tr></tbody></table>`}
 ],
 lab:(el)=>{
  let type='perm';const m=mkMotor(type);m.L=0.9;let sig='',T=null,seen={},stallPerm=0,twoC2=0,quietPerm=0,noisy=0;
  el.innerHTML=`<div id="l4tp"></div><div class="grid">
   <div class="panel c12"><h2>مقارنة أنواع المحركات ذات الملف المساعد <small>مبنية على الأشكال (2-4) و(2-6) و(2-8) و(2-9)</small></h2>
    <div class="wrap-in"><div><div class="sub">نوع المحرك</div>${segHTML('ty',TYPES,type)}</div>${swHTML('l4on','V','توصيل المصدر',0)}<div><div class="sub">نوع الحمل</div>${segHTML('ld4',[['const','عزم ثابت'],['fan','مروحة']],'const')}</div></div>
    ${sl('l4L','عزم الحمل',0,2.5,0.05,m.L)}</div>
   <div class="panel c7"><h2 id="l4h"></h2><div class="svgbox im-svg" id="l4c"></div>
    <div class="facts">${fact('السرعة','l4n')}${fact('المفتاح','l4sw')}${fact('عزم البدء (من المنحنى)','l4ts')}${fact('الحالة','l4st')}</div></div>
   <div class="panel c5"><h2>العزم مع السرعة</h2><div class="svgbox" id="l4t"></div>${legend([['--blue','منحنى المحرك'],['--stop','عزم الحمل',1],['--live','نقطة التشغيل']])}
    <h3 class="sm">المجال الخلفي والضجيج أثناء التشغيل <small class="sub">(نسبي — <span id="l4tpw">أرقام توضيحية</span>)</small></h3><div class="im-bar"><i id="l4bb" style="width:0"></i></div><p class="sub" id="l4bt"></p></div>
   <div class="panel c12">${tryList(['اختر «المكثف الدائم» مع حمل ثابت 0.9 pu وشغّل: لا يبدأ (عزم بدئه حوالي 0.7 pu فقط). اختر «المكثفين» وكرر: يبدأ.','في «المكثفين» راقب C<sub>2</sub>: يخرج بمفتاحه عند سرعة الفصل ويبقى C<sub>1</sub>.','شغّل «المكثف الدائم» بحمل مروحة، واضبط الحمل حتى يقترب مؤشر المجال الخلفي من الصفر: هذا «الحمل بعينه» الذي صُمم له المكثف.','قارن بالمشطور أو مكثف البدء بعد الفصل: المحرك يعمل بملف واحد فيعود المجال الخلفي كاملاً (ضجيج أكبر).'])}<h3 class="sm">التجربة الموجّهة</h3><ol class="steps" id="l4steps"></ol></div></div>`;
  const $=s=>el.querySelector(s);
  const ldTxt=()=>fm(TP.v.Ld,2).replace(/\.?0+$/,'')+' pu';
  const TP=B.params($('#l4tp'),'u2-l4',motorDefs(2.2).concat([
   {k:'Ld',label:'الحمل الذي صُمم له المكثف الدائم (يختفي عنده المجال الخلفي)',unit:'pu',value:1,min:0.1,max:2.5,step:0.05}]),
   ()=>{el.querySelectorAll('.l4ldv').forEach(x=>x.textContent=ldTxt());$('#l4tpw').textContent=TP.trainer?'قيم المدرب':'أرقام توضيحية'});
  const setType=v=>{type=v;m.type=v;m.n=0;m.on=0;m.sw=true;$('#l4on').setAttribute('aria-pressed','false');segSet(el,'ty',v);seen[v]=1;
   T=tsPlot(v,{op:'l4'});$('#l4t').innerHTML=T.svg;$('#l4h').innerHTML=`${TNAME[v]} <small>الشكل ${CUR[v].fig} ${CUR[v].pg}</small>`;$('#l4ts').textContent=fm(CUR[v].both?CUR[v].both(0):CUR[v].main(0),2)+' pu';sig=''};
  el.querySelectorAll('[data-ty]').forEach(b=>b.onclick=()=>setType(b.dataset.ty));
  el.querySelectorAll('[data-ld4]').forEach(b=>b.onclick=()=>{m.kind=b.dataset.ld4;segSet(el,'ld4',m.kind)});
  $('#l4on').onclick=()=>{m.on=m.on?0:1;$('#l4on').setAttribute('aria-pressed',m.on?'true':'false')};$('#l4L').oninput=e=>{m.L=+e.target.value};
  setType('perm');
  const back=()=>{if(!m.on||m.n<0.05)return null;const c=CUR[type];if(c.both&&m.sw)return null;
   if(type==='split'||type==='cstart')return 1;const Ld=TP.v.Ld,TL=m.TL;return clamp(Math.abs(TL-Ld)/Ld,0,1)*0.85+0.03};
  const steps=stepsUI($('#l4steps'),[
   {t:'المكثف الدائم وحمل كبير',x:'اختر «المكثف الدائم» واجعل الحمل الثابت <span class="ltr">0.9 pu</span> ثم صِل المصدر: لا يبدأ، لأن عزم بدئه (حوالي <span class="ltr">0.7 pu</span>) أقل من الحمل.',done:()=>stallPerm>1.2},
   {t:'المحرك ذو المكثفين',x:'اختر «المكثفين» وصِل المصدر بنفس الحمل: يبدأ بعزم كبير (C<sub>1</sub> + C<sub>2</sub>)، ثم ينفتح مفتاح C<sub>2</sub> عند سرعة الفصل.',done:()=>twoC2},
   {t:'الحمل الذي صُمم له المكثف',get x(){return `اختر «المكثف الدائم» وحمل «مروحة»، وشغّل، ثم اضبط الحمل حتى يقترب مؤشر المجال الخلفي من الصفر (حوالي <span class="ltr l4ldv">${ldTxt()}</span> عند السرعة الكاملة).`},done:()=>quietPerm>1},
   {t:'محرك بملف واحد أثناء التشغيل',x:'اختر «المشطور» أو «مكثف البدء» وشغّل: بعد الفصل يعمل بالملف الرئيسي فقط، فيرجع المجال الخلفي كاملاً (ضجيج أكبر وكفاءة أقل).',done:()=>noisy},
   {t:'راجع جدول المقارنة',x:'ارجع إلى تبويب «الشرح» وقارن الأنواع الأربعة في الجدول: المفتاح، المكثف، عزم البدء، الهدوء، الاستخدامات.'}
  ]);
  loopOn(el,dt=>{m.fr=TP.v.fr;motorStep(m,dt,TP.v.J);
   if(type==='perm'&&m.on&&m.n===0&&m.kind==='const'&&m.L>0.7)stallPerm+=dt;else if(type!=='perm')stallPerm=0;
   if(type==='two'&&m.on&&!m.sw)twoC2=1;
   const bb=back();if(type==='perm'&&m.kind==='fan'&&bb!=null&&bb<0.12&&m.n>0.85)quietPerm+=dt;if((type==='split'||type==='cstart')&&bb===1)noisy=1;
   const s=[type,m.on,m.sw,m.n>0.01].join();if(s!==sig){sig=s;$('#l4c').innerHTML=circSVG(type,{on:m.on,sw:m.sw,n:m.n})}
   const P=T.P;$('#l4-pt').setAttribute('cx',m.on?fx(P.X(m.n)):-20);$('#l4-pt').setAttribute('cy',fx(P.Y(m.T)));$('#l4-ld').setAttribute('d',pathOf(P,loadPts(m)));
   $('#l4n').textContent=fm(m.n*100,1)+' %';$('#l4L-v').textContent=fm(m.L,2)+' pu';
   $('#l4sw').textContent=CUR[type].sw==null?'لا يوجد':(type==='two'?(m.sw?'C2 موصل':'C2 مفصول'):(m.sw?'مغلق':'مفتوح'));
   $('#l4st').innerHTML=!m.on?(m.n>0.01?'يتباطأ':'متوقف'):m.n===0?'<span class="im-chip trip">لا يبدأ</span>':(CUR[type].both&&m.sw)?'<span class="im-chip warn">فترة البدء</span>':'<span class="im-chip run">تشغيل مستمر</span>';
   $('#l4bb').style.width=bb==null?'0':(bb*100).toFixed(0)+'%';
   $('#l4bt').innerHTML=bb==null?'يظهر المؤشر أثناء التشغيل المستمر (بعد فترة البدء).':bb===1?'ملف واحد يعمل: مجال نابض = أمامي + خلفي متساويان ← ضجيج وكفاءة أقل.':bb<0.12?'المحرك قريب من «محرك مثالي ذو وجهين»: المجال الخلفي يكاد يختفي ← هادئ.':'المكثف صُمم لحمل آخر، فبقي جزء من المجال الخلفي.';
   steps.check()});
 },
 quiz:[
  {q:'ما الذي يُستغنى عنه في المحرك ذي المكثف الدائم؟',o:['الملف الرئيسي','مفتاح الطرد المركزي','المكثف','العضو الدوار'],c:1,e:'ص 84.'},
  {q:'عند أي ظرف يختفي المجال الخلفي في المحرك ذي المكثف الدائم؟',o:['عند كل الأحمال','عند حمل بعينه صُممت له الملفات والمكثف','عند البدء فقط','لا يختفي أبداً'],c:1,e:'ص 84: «يصبح المحرك مكافئ لمحرك مثالي ذو وجهين عند حمل بعينه».'},
  {q:'من مميزات المحرك ذي المكثف الدائم:',o:['عزم بدء كبير جداً','هدوء الصوت وتحسين الكفاءة ومعامل القدرة','رخص الثمن أكثر من الكل','لا يحتاج ملفاً مساعداً'],c:1,e:'ص 84.'},
  {q:'من الشكل (2-8)، عزم بدء المحرك ذي المكثف الدائم:',o:['منخفض (حوالي 0.7 pu)','حوالي 3.3 pu','صفر','أكبر من كل الأنواع'],c:0,e:'المنحنى يبدأ عند حوالي 0.7 pu.'},
  {q:'في المحرك ذي المكثفين، المكثف C<sub>1</sub>:',o:['ذو سائل كهربي ويعمل عند البدء فقط','ورقي مشبع بالزيت ويوصل على التوالي بصفة مستديمة مع الملفات المساعدة','يوصل مع الملف الرئيسي','يفصل عند 75%'],c:1,e:'ص 85.'},
  {q:'وفي المحرك ذي المكثفين، المكثف C<sub>2</sub>:',o:['ورقي ويعمل دائماً','ذو سائل كهربي، مع مفتاح طرد مركزي خاص به، على التوازي مع C<sub>1</sub> أثناء البدء فقط','على التوالي مع C<sub>1</sub> دائماً','غير موجود'],c:1,e:'ص 85.'},
  {q:'أي الأنواع أكثر تكلفة حسب الكتاب؟',o:['المشطور','ذو مكثف البدء','ذو المكثفين','ذو الوجه المظلل'],c:2,e:'ص 85.'},
  {q:'تطبيق يتطلب تشغيلاً هادئاً مع عزم بدء كبير. الأنسب:',o:['المحرك ذو المكثفين','المحرك المشطور','المحرك ذو الوجه المظلل','المحرك ذو المكثف الدائم'],c:0,e:'ص 85.'}
 ]
});

/* =====================================================================
   Lesson 2.5 — shaded-pole motor
   ===================================================================== */
B.lesson({
 id:'u2-l5',unit:2,order:5,pages:'87–88',
 title:'المحرك ذو الوجه المظلل',
 summary:'أقطاب بارزة يُطوَّق جزء من كل قطب بحلقة نحاسية مقصورة (الملف المظلِل)، فيتأخر فيض الجزء المظلل عن الجزء الآخر، ويتحرك المجال من الجزء غير المظلل إلى المظلل فيعطي عزماً صغيراً. رخيص وبسيط للمراوح الصغيرة.',
 theory:[
  {h:'المحرك ذو الوجه المظلل (Shaded-Pole Motor)',ref:'ص 87',html:`<p>«يتكون العضو الثابت لهذا المحرك من <b>أقطاب بارزة</b> ملفوف عليها ملفات العضو الثابت، كل قطب مقسوم إلى جزئين بواسطة مجرى صغير، حيث يتم إحاطة (تطويق) جزء من كل قطب <b>بحلقة مقصورة من النحاس</b>، تسمى <b>الملف المظلِل (Shading Coil)</b>، كما هو موضح في الشكل (2-10).»</p>
   <p>«تتولد في الملف المظلِل تيارات بفعل جزء المجال المغناطيسي المتشابك معه، تؤدي إلى <b>تأخر محصلة المجال المغناطيسي لهذا الجزء من القطب (الجزء المظلل) زمنياً</b> عن المجال المغناطيسي في الجزء الآخر، نتيجة لذلك يتكون مجال مغناطيسي دوار يتحرك <b>من الجزء غير المظلل باتجاه الجزء المظلل</b> من القطب، ينتج عنه <b>عزم دوران صغير</b> يعمل على دوران المحرك كما يوضح ذلك منحنى العزم مع السرعة المبين بالشكل (2-11).»</p>`},
  {err:'في جدول المحتويات كُتب «المحرك ذو الوجه <b>المضلل</b>» بالضاد، وفي متن الكتاب «المظلل» بالظاء (من الظل). الصحيح «المظلل».'},
  {fig:'(2-10)',ref:'ص 87',caption:'تركيب المحرك ذو الوجه المظلل — رسم تخطيطي: مصدر V يغذي ملفي القطبين، وعلى جزء من كل قطب حلقة نحاسية «Shading band»، والعضو الدوار قفص سنجابي. (في الكتاب أيضاً صورة محرك حقيقي: Main winding و Iron core و Squirrel cage rotor و Shorted coil حول Shaded pole.)',draw:()=>`<div class="svgbox" style="max-width:440px;margin-inline:auto">${shadedSVG({fu:0,fs:0,id:'shs'})}</div>`},
  {note:`<b>توضيح للمتدرب (ليس من نص الكتاب):</b> الحلقة النحاسية المقصورة تشبه ملفاً ثانوياً لمحول مقصوراً على نفسه: عندما يتغير الفيض داخلها يتولد فيها تيار يعاكس هذا التغيير، فيتأخر فيض الجزء المظلل. فيصل الفيض إلى قمته في الجزء غير المظلل أولاً ثم في الجزء المظلل، أي «يتحرك» على وجه القطب في اتجاه الحلقة. الدوار يتبع هذه الحركة، لذلك <b>اتجاه الدوران ثابت</b>: من الجزء غير المظلل نحو الجزء المظلل.`},
  {fig:'(2-11)',ref:'ص 88',caption:'خواص المحرك ذو الوجه المظلل: عزم بدء حوالي 0.5 pu، وقمة حوالي 1.25 pu قرب 0.78 من سرعة التزامن (القيم مقروءة من الشكل تقريباً).',draw:()=>`<div class="svgbox im-svg">${tsPlot('shaded').svg}</div>`},
  {h:'المميزات والاستخدامات',ref:'ص 88',html:`<p>«يتميز هذا المحرك <b>برخص الثمن وبساطة التركيب</b>، ويستخدم في <b>المراوح الصغيرة ومضخات المياه المستخدمة في المكيفات الصحراوية و غسالات الملابس</b>.»</p>`}
 ],
 lab:(el)=>{
  const m=mkMotor('shaded');m.L=0.2;m.kind='fan';let ring=1,ph=0,fv=0.6,sig='',seenRing=0,stallNo=0,runNo=0,T;
  // تأخر فيض الجزء المظلل (55°) وشدته النسبية (0.8): أرقام توضيحية → TP.v.DEL و TP.v.A
  // العزم: منحنى الشكل (2-11) × f، f = (A·sin DEL)/(0.8·sin 55°) (تقريب منا؛ القيم الافتراضية تعطي f = 1 أي منحنى الكتاب تماماً)، وأقصى f = 1.6
  el.innerHTML=`<div id="l5tp"></div><div class="grid">
   <div class="panel c7"><h2>قطبان مظللان وعضو دوار <small>مبنية على الشكل (2-10) ص 87</small></h2><div class="svgbox" style="max-width:440px;margin-inline:auto" id="l5m"></div>
    <div class="im-row">${swHTML('l5on','V','توصيل المصدر',0)}${swHTML('l5ring','حلقة','الملف المظلِل موجود',1)}</div>
    ${sl('l5f','سرعة عرض التيار المتردد (مبطّأة جداً)',0.1,1.5,0.05,fv)}
    ${sl('l5L','حمل المروحة',0,1.2,0.05,m.L)}
    <div class="facts">${fact('السرعة','l5n')}${fact('عزم المحرك','l5T')}${fact('الحالة','l5st')}</div>
    <p class="sub">الأحمر = قطب شمالي، الأخضر = قطب جنوبي، وشدة اللون = شدة الفيض. المثلث الأسود يبين موضع مركز الفيض على وجه القطب.</p></div>
   <div class="panel c5"><h2>فيض الجزأين مع الزمن</h2><div class="svgbox"><svg viewBox="0 0 320 200" id="l5w" role="img" aria-label="فيض الجزء المظلل وغير المظلل"></svg></div>${legend([['--fg','فيض الجزء غير المظلل'],['--live','فيض الجزء المظلل (متأخر)']])}<p class="sub">تأخر فيض الجزء المظلل <span class="ltr" id="l5del">55°</span> وشدته <span class="ltr" id="l5a">0.8</span> (<span id="l5dw">أرقام توضيحية</span>؛ الكتاب لا يعطي قيمة). يغيّران الرسم وعزم المحرك معاً.</p>
    <h3 class="sm">العزم مع السرعة <small>الشكل (2-11)</small></h3><div class="svgbox" id="l5t"></div><p class="sub">ربط العزم بزاوية التأخر تقريب منا وليس من الكتاب: العزم يتناسب مع قوة فيض الجزء المظلل × جا زاوية التأخر.</p></div>
   <div class="panel c12">${tryList(['صِل المصدر وراقب المثلث الأسود: يتحرك على وجه كل قطب من الجزء غير المظلل إلى الجزء المظلل، والدوار يدور في نفس الاتجاه.','لاحظ في المنحنى الزمني أن قمة فيض الجزء المظلل تأتي بعد قمة الجزء الآخر.','افصل المصدر وانتظر حتى يقف، ثم أزل الحلقة وصِل المصدر: الفيضان متساويان في الطور، والمجال نابض فقط، فلا يبدأ المحرك.','أعد الحلقة والمحرك يدور، ثم أزلها: يستمر في الدوران (مثل الدرس الأول: المحرك أحادي الوجه يكمل في اتجاه حركته).'])}<h3 class="sm">التجربة الموجّهة</h3><ol class="steps" id="l5steps"></ol></div></div>`;
  const $=s=>el.querySelector(s);
  const TP=B.params($('#l5tp'),'u2-l5',[
   {k:'DEL',label:'تأخر فيض الجزء المظلل عن الجزء غير المظلل',unit:'°',value:55,min:0,max:90,step:1},
   {k:'A',label:'شدة فيض الجزء المظلل (نسبة إلى غير المظلل)',unit:'',value:0.8,min:0.1,max:1,step:0.05}].concat(motorDefs(1.6)),
   ()=>{upd5();drawT()});
  const noRing=n=>1.0*Ttot(n);  // بلا حلقة: محرك أحادي الوجه عادي (منحنى الشكل 2-3، أرقام توضيحية)
  // معامل العزم f (تقريب منا): بالقيم الافتراضية f = 1 تماماً (البسط = المقام)
  let f=1;const fOf=()=>{const v=(TP.v.A*Math.sin(TP.v.DEL*D))/(0.8*Math.sin(55*D));return isFinite(v)?clamp(v,0,1.6):0};
  const ringMain=n=>CUR.shaded.main(n)*f;
  const setMain=()=>{m.customMain=ring?(f===1?null:ringMain):noRing};
  const tsTxt=()=>f<1e-3?'بهذه القيم عزم البدء صفر فلا يبدأ الدوار: زد زاوية التأخر أو شدة فيض الجزء المظلل في «قيم المدرب».':`الدوار يبدأ وحده بعزم صغير (حوالي <span class="ltr">${fm(0.5*f,2).replace(/\.?0+$/,'')} pu</span>) — لا يحتاج ملفاً مساعداً ولا مكثفاً.`;
  function upd5(){f=fOf();setMain();$('#l5del').textContent=fm(TP.v.DEL,0)+'°';$('#l5a').textContent=fm(TP.v.A,2).replace(/\.?0+$/,'');$('#l5dw').textContent=TP.trainer?'قيم المدرب':'أرقام توضيحية';
   el.querySelectorAll('.l5tsv').forEach(x=>x.innerHTML=tsTxt())}
  const drawT=()=>{T=tsPlot('shaded',{op:'l5',km:f});$('#l5t').innerHTML=T.svg};upd5();drawT();
  $('#l5on').onclick=()=>{m.on=m.on?0:1;$('#l5on').setAttribute('aria-pressed',m.on?'true':'false')};
  $('#l5ring').onclick=()=>{ring=ring?0:1;$('#l5ring').setAttribute('aria-pressed',ring?'true':'false');setMain();seenRing=1};
  $('#l5f').oninput=e=>{fv=+e.target.value};$('#l5L').oninput=e=>{m.L=+e.target.value};
  const steps=stepsUI($('#l5steps'),[
   {t:'صِل المصدر',get x(){return `شغّل المصدر. <span class="l5tsv">${tsTxt()}</span>`},done:()=>m.on&&m.n>0.3},
   {t:'اتجاه حركة المجال',x:'راقب المثلث الأسود والألوان: الفيض يصل قمته في الجزء غير المظلل أولاً ثم في الجزء المظلل. الدوار يدور من الجزء غير المظلل نحو المظلل (مع عقارب الساعة في هذا الرسم).'},
   {t:'بلا حلقة من السكون',x:'افصل المصدر حتى يقف، ثم أزل الحلقة وصِل المصدر: لا يدور، لأن المجال صار نابضاً فقط.',done:()=>stallNo>1.5},
   {t:'إزالة الحلقة أثناء الدوران',x:'أعد الحلقة حتى يدور المحرك، ثم أزلها وهو يدور: يكمل الدوران. هذا تطبيق لنظرية المجالين في الدرس الأول.',done:()=>runNo>1.5},
   {t:'الحمل والمنحنى',x:'أعد الحلقة وزد حمل المروحة: تنزل السرعة على منحنى الشكل (2-11). العزم صغير، لذلك يناسب هذا المحرك المراوح الصغيرة والمضخات الصغيرة.',done:()=>ring&&m.on&&m.L>0.8&&m.n>0.3}
  ]);
  const hist=[];let tt=0,lw=0;
  loopOn(el,dt=>{tt+=dt;m.fr=TP.v.fr;motorStep(m,dt,TP.v.J);
   if(m.on)ph=(ph+360*fv*dt)%360;const fu=m.on?Math.sin(ph*D):0,fs=m.on?(ring?TP.v.A*Math.sin((ph-TP.v.DEL)*D):fu):0;
   if(!ring&&m.on&&m.n===0)stallNo+=dt;if(!ring&&m.on&&m.n>0.5)runNo+=dt;
   $('#l5m').innerHTML=shadedSVG({fu,fs,ring,on:m.on,ang:m.ang,id:'l5r'});
   hist.push([tt,fu,fs]);while(hist.length&&tt-hist[0][0]>5)hist.shift();
   if(tt-lw>0.06){lw=tt;const t0=Math.max(0,tt-5),pth=k=>hist.map((h,i)=>(i?'L':'M')+fx(20+(h[0]-t0)/5*290)+' '+fx(100-h[k]*78)).join('');
    $('#l5w').innerHTML=`<path d="M20 100H312M20 18V182" stroke="var(--line)"/><path d="${pth(1)}" fill="none" stroke="var(--fg)" stroke-width="2.6"/><path d="${pth(2)}" fill="none" stroke="var(--live)" stroke-width="2.6"/>`+S.t(16,24,'Φ','m','end')+S.t(312,116,'t','m','end')}
   const P=T.P;$('#l5-pt').setAttribute('cx',m.on&&ring?fx(P.X(m.n)):-20);$('#l5-pt').setAttribute('cy',fx(P.Y(m.T)));$('#l5-ld').setAttribute('d',pathOf(P,loadPts(m)));
   $('#l5n').textContent=fm(m.n*100,1)+' %';$('#l5T').textContent=fm(m.T,2)+' pu';$('#l5f-v').textContent=fm(fv,2)+' Hz';$('#l5L-v').textContent=fm(m.L,2)+' pu';
   $('#l5st').innerHTML=!m.on?(m.n>0.01?'يتباطأ':'متوقف'):m.n===0?(ring&&f>=1e-3?'<span class="im-chip trip">لا يبدأ (عزم البدء أقل من الحمل)</span>':'<span class="im-chip trip">لا يبدأ (مجال نابض)</span>'):ring?'<span class="im-chip run">يدور ↻</span>':'<span class="im-chip warn">يدور بلا حلقة</span>';
   steps.check()});
 },
 quiz:[
  {q:'مم يتكون العضو الثابت للمحرك ذي الوجه المظلل؟',o:['ملفين بينهما 90° ومكثف','أقطاب بارزة عليها ملفات، وجزء من كل قطب مطوّق بحلقة نحاسية مقصورة','مغناطيس دائم','مبدل وفرش'],c:1,e:'ص 87.'},
  {q:'ماذا تُسمى الحلقة النحاسية المقصورة؟',o:['ملف البدء','الملف المظلِل (Shading Coil)','الملف الرئيسي','حلقة الانزلاق'],c:1,e:'ص 87.'},
  {q:'ما أثر التيارات المتولدة في الملف المظلل؟',o:['تجعل فيض الجزء المظلل يسبق الجزء الآخر','تؤخر المجال في الجزء المظلل زمنياً عن الجزء الآخر','تلغي المجال','تزيد الجهد'],c:1,e:'ص 87.'},
  {q:'في أي اتجاه يتحرك المجال على وجه القطب؟',o:['من الجزء المظلل إلى غير المظلل','من الجزء غير المظلل باتجاه الجزء المظلل','لا يتحرك','يتغير كل دورة'],c:1,e:'ص 87.'},
  {q:'عزم دوران المحرك ذي الوجه المظلل:',o:['كبير جداً','صغير','صفر عند كل السرعات','سالب'],c:1,e:'ص 87: «عزم دوران صغير»؛ الشكل (2-11).'},
  {q:'يتميز المحرك ذو الوجه المظلل بـ:',o:['رخص الثمن وبساطة التركيب','العزم الكبير','الكفاءة العالية جداً','إمكان عكس الاتجاه بسهولة'],c:0,e:'ص 88.'},
  {q:'من استخدامات المحرك ذي الوجه المظلل حسب الكتاب:',o:['الضواغط الكبيرة','المراوح الصغيرة ومضخات المياه في المكيفات الصحراوية وغسالات الملابس','القطارات','الرافعات'],c:1,e:'ص 88.'}
 ]
});

/* =====================================================================
   Lesson 2.6 — unit questions (ص 89)
   ===================================================================== */
const det=(q,ans)=>`<details class="im-q"><summary>${q}</summary><div class="im-ans"><b>إجابة مقترحة (ليست من الكتاب):</b> ${ans}</div></details>`;
B.lesson({
 id:'u2-l6',unit:2,order:6,pages:'89',
 title:'أسئلة وتمارين الوحدة الثانية',
 summary:'أسئلة وتمارين الوحدة (ص 89)، تحت كل سؤال إجابة مقترحة من نص الكتاب، وحاسبتان للسؤالين الحسابيين 7 و 8.',
 theory:[
  {h:'أسئلة وتمارين',ref:'ص 89',html:`<p>الكتاب لا يعطي مفتاح إجابة؛ الإجابات المقترحة أدناه مأخوذة من نص الوحدة ويعتمدها المدرب.</p>`+
   det('1- لماذا تحتاج المحركات أحادية الوجه لوسيلة مساعدة لبدء حركتها؟ وضح إجابتك بالرسم.','لأن الملف أحادي الوجه يولد مجالاً نابضاً يمكن تحليله إلى مجالين دوارين متساويين (كل منهما \\(\\tfrac12 B_{1\\max}\\)) يدوران في اتجاهين متعاكسين بالسرعة التزامنية (المعادلة 2-3). عند سكون الدوار يكون عزم المجال الأمامي مساوياً ومضاداً لعزم المجال الخلفي، فالمحصلة صفر ولا يوجد عزم بدء (ص 77). أما إذا بدأ الدوران بوسيلة مساعدة في اتجاه ما فيستمر فيه. <b>الرسم:</b> الشكل (2-2) (المتجهان \\(B_f\\) و\\(B_b\\) ومحصلتهما الرأسية) والشكل (2-3) (منحنيا العزم الأمامي والخلفي والمحصلة التي تمر بالصفر عند السرعة صفر) — انظر الدرس 2.1.')+
   det('2- اذكر الطرق المختلفة المستخدمة لبدء حركة المحركات أحادية الوجه.','تُسمى المحركات بطريقة بدئها (ص 78): (1) الوجه المشطور: ملف مساعد ذو مقاومة كبيرة يفصله مفتاح طرد مركزي عند 75% من سرعة التزامن. (2) مكثف البدء: مكثف على التوالي مع الملف المساعد للبدء فقط. (3) المكثف الدائم: مكثف وملف مساعد يعملان باستمرار بلا مفتاح. (4) المكثفان: مكثف دائم C<sub>1</sub> ومكثف بدء C<sub>2</sub> بمفتاح طرد مركزي. (5) الوجه المظلل: حلقة نحاسية مقصورة على جزء من كل قطب.')+
   det('3- ما أهم مميزات المحرك ذو مكثف البدء مقارنة بالمحرك المشطور الوجه؟','عزم بدء كبير (الشكل 2-6: حوالي 3.3 pu) مقارنة بعزم البدء المتوسط للمشطور (الشكل 2-4: حوالي 1.25 pu)، لأن المكثف يجعل تيار المساعد يتقدم عن تيار الرئيسي بزاوية يمكن أن تصل إلى 90° فنحصل على خصائص محرك متزن ذو وجهين عند البدء (ص 82–83). ولأن الملف المساعد والمكثف يعملان تشغيلاً متقطعاً تقل كلفتهما. لذلك يناسب الأحمال التي تتطلب عزم بدء كبيراً كالضواغط والثلاجات والمكيفات.')+
   det('4- ما أهم مميزات المحرك ذو المكثف الدائم مقارنة بالمحرك المشطور الوجه؟','الاستغناء عن مفتاح الطرد المركزي فيبسط التركيب، ويصبح المحرك مكافئاً لمحرك مثالي ذو وجهين عند حمل بعينه فيختفي المجال الخلفي: كفاءة أفضل، وتشغيل هادئ الصوت، ومعامل قدرة أفضل أثناء التشغيل (ص 84). (ملاحظة من الشكل 2-8: عزم بدئه منخفض.)')+
   det('5- ما أهم مميزات المحرك ذو المكثفين مقارنة بالمحرك ذو المكثف الدائم؟','يعطي أفضل خواص في فترتي البدء والتشغيل معاً: عند البدء يعمل C<sub>2</sub> (ذو السائل الكهربي) مع C<sub>1</sub> على التوازي فيكبر عزم البدء (الشكل 2-9: حوالي 2.2 pu مقابل حوالي 0.7 pu للمكثف الدائم في الشكل 2-8)، ثم يخرج C<sub>2</sub> بمفتاحه ويبقى C<sub>1</sub> (الورقي المشبع بالزيت) للتشغيل الهادئ. عيبه أنه أكثر تكلفة (ص 85).')+
   det('6- في أي التطبيقات تستخدم المحركات الحثية أحادية الوجه؟ أعط أمثلة لاستخدام كل نوع من أنواع المحركات.','<ul style="margin:4px 0"><li><b>المشطور الوجه:</b> المراوح والشفاطات ومضخات الطرد المركزي والأجهزة المنزلية والمكتبية (ص 80).</li><li><b>مكثف البدء:</b> الضواغط والمضخات والثلاجات وأجهزة التبريد والتكييف والأحمال التي تتطلب عزم بدء كبيراً (ص 83).</li><li><b>المكثف الدائم:</b> التطبيقات التي تتطلب هدوء الصوت أثناء التشغيل (ص 84).</li><li><b>المكثفين:</b> التطبيقات التي تتطلب تشغيلاً هادئاً مع عزم كبير لبدء الحركة (ص 85).</li><li><b>الوجه المظلل:</b> المراوح الصغيرة ومضخات المياه في المكيفات الصحراوية وغسالات الملابس (ص 88).</li></ul>')+
   det('7- محرك حثي أحادي الوجه 220V، 50Hz ذو ستة أقطاب يعمل عند الحمل الكامل بانزلاق مقداره 5% احسب: أ) الانزلاق للمجال الخلفي (\\(S_b\\)). ب) سرعة التزامن \\(n_s\\) ج) سرعة المحرك عند الحمل الكامل.','بخطوات مثال (2-1) (بالحساب الصحيح للفرع أ): أ) \\(S_b = 2 - 0.05 = 1.95\\) — ب) \\(n_s = \\frac{120\\times 50}{6} = 1000\\) rpm — ج) \\(n = 1000\\times(1 - 0.05) = 950\\) rpm. الجهد 220V لا يدخل في الحل. الحل في تبويب «الأمثلة المحلولة».')+
   det('8- محرك حثي أحادي الوجه ذو مكثف البدء، جهده 120v وتردده 60Hz، ثوابت الملفات الرئيسة والمساعدة عند البدء: \\(Z_m = 4.2 + j3.6\\ \\Omega\\) ، \\(Z_a = 8.4 + j3.0\\ \\Omega\\). احسب قيمة مكثف البدء اللازم للحصول على زاوية مقدارها ثمانون درجة كهربائية (80°) بين تياري الملفات الرئيسة والمساعدة عند بدء الحركة.','بخطوات مثال (2-3) وتقريبه: \\(\\theta_m = \\tan^{-1}(3.6/4.2) = 40.60^\\circ\\)، \\(\\theta_a = 80 - 40.60 = 39.40^\\circ\\)، \\(\\frac{X_c - 3.0}{8.4} = \\tan 39.40^\\circ = 0.821 \\approx 0.82\\)، \\(X_c = 0.82\\times 8.4 + 3.0 = 9.89\\ \\Omega\\)، \\(c = \\frac{1}{377\\times 9.89} = 268\\ \\mu F\\). الحل في «الأمثلة المحلولة».')}
 ],
 examples:[
  {title:'س7 (حساب مقترح — ليس من الكتاب)',ref:'ص 89',q:'<p>«محرك حثي أحادي الوجه 220V، 50Hz ذو ستة أقطاب يعمل عند الحمل الكامل بانزلاق مقداره 5% احسب: أ) الانزلاق للمجال الخلفي. ب) سرعة التزامن. ج) سرعة المحرك عند الحمل الكامل.» — بخطوات مثال (2-1) المصححة.</p>',
   given:cloneG(G21,{f:50,p:6,S:0.05}),solve:(g,B)=>slipSteps(g,B,false)},
  {title:'س8 (حساب مقترح — ليس من الكتاب)',ref:'ص 89',q:'<p>«محرك حثي أحادي الوجه ذو مكثف البدء، جهده 120v وتردده 60Hz، \\(Z_m = 4.2 + j3.6\\ \\Omega\\) ، \\(Z_a = 8.4 + j3.0\\ \\Omega\\). احسب قيمة مكثف البدء اللازم للحصول على زاوية 80° بين تياري الملفات الرئيسة والمساعدة عند بدء الحركة.» — بخطوات مثال (2-3) وتقريبه.</p>',
   given:cloneG(G23,{V:120,Xm:3.6,Ra:8.4,Xa:3.0,al:80}),solve:(g,B)=>capSteps(g,B,{v127:1})}
 ],
 quiz:[
  {q:'س1: لماذا يحتاج المحرك أحادي الوجه وسيلة مساعدة للبدء؟',o:['لأن تياره كبير','لأن عزمي المجالين الأمامي والخلفي متساويان ومتضادان عند السكون','لأن الدوار ملفوف','لأن التردد منخفض'],c:1,e:'ص 77.'},
  {q:'س2: أي مما يلي ليس من طرق بدء المحركات أحادية الوجه في الكتاب؟',o:['الوجه المشطور','مكثف البدء','الوجه المظلل','البدء نجمة/دلتا'],c:3,e:'نجمة/دلتا لثلاثية الأوجه، وليست في هذه الوحدة.'},
  {q:'س3: الميزة الأهم لذي مكثف البدء مقارنة بالمشطور:',o:['هدوء الصوت','عزم بدء كبير','عدم وجود مفتاح','رخص الثمن'],c:1,e:'ص 83.'},
  {q:'س4: الميزة الأهم لذي المكثف الدائم مقارنة بالمشطور:',o:['عزم بدء أكبر','تشغيل هادئ وكفاءة ومعامل قدرة أفضل بلا مفتاح طرد مركزي','تيار بدء منخفض جداً','سعر أقل'],c:1,e:'ص 84.'},
  {q:'س5: ذو المكثفين مقارنة بذي المكثف الدائم:',o:['أرخص','عزم بدء كبير مع بقاء التشغيل هادئاً، لكنه أغلى','بلا ملف مساعد','لا يحتاج مفتاحاً'],c:1,e:'ص 85.'},
  {q:'س7: محرك 50 Hz بستة أقطاب وانزلاق 5%. سرعته عند الحمل الكامل:',o:['1000 rpm','950 rpm','1500 rpm','1050 rpm'],c:1,e:'n<sub>s</sub> = 120×50/6 = 1000 rpm، n = 1000×0.95 = 950 rpm.'},
  {q:'س7: الانزلاق للمجال الخلفي:',o:['0.05','0.95','1.95','2.05'],c:2,e:'S<sub>b</sub> = 2 − 0.05 = 1.95.'},
  {q:'س8: كم تكون θ<sub>a</sub> المطلوبة للزاوية 80° (θ<sub>m</sub> = 40.60°)؟',o:['40.60°','39.40°','49.40°','80°'],c:1,e:'θ<sub>a</sub> = 80 − 40.60 = 39.40°.'}
 ]
});
})(PLCBOOK);
